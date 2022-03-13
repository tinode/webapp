// Audio recorder widget.

import React from 'react';

import { secondsToTime } from '../lib/strformat';

// FFT resolution.
const BUFFER_SIZE = 256;
// Thickness of a visualization bar.
const LINE_WIDTH = 4;
// Spacing between two visualization bars.
const SPACING = 2;
// Duration represented by one visualization bar.
const MILLIS_PER_BAR = 100;
// Color of histogram bars
const BAR_COLOR = '#8fbed6';
// Scaling for visualization bars.
const BAR_SCALE = 96.0;
// Background color
const BKG_COLOR = '#eeeeee';
// Maximum duration of a recording in milliseconds (10 min).
const MAX_DURATION = 600000;

export default class AudioPlayer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      canPlay: false,
      playing: false,
      currentTime: '0:00',
      duration: secondsToTime(this.props.duration)
    };

    this.visualize = this.visualize.bind(this);

    this.handlePlay = this.handlePlay.bind(this);
    this.handlePause = this.handlePause.bind(this);

    this.audioPlayer = this.props.src ? new Audio(this.props.src) : null;

    this.durationMillis = 0;
    this.startedOn = null;
    this.viewBuffer = [];
    this.canvasRef = React.createRef();
  }

  componentDidMount() {
    this.canvasContext = this.canvasRef.current.getContext('2d');
    this.canvasContext.lineCap = 'round';
    // To reduce line blurring.
    this.canvasContext.translate(0.5, 0.5);

    if (this.audioPlayer) {
      this.audioPlayer.addEventListener('canplay', _ => {
        console.log('canplay', this.audioPlayer.duration);
        this.setState({canPlay: true, duration: secondsToTime(this.audioPlayer.duration)})
      });
      this.audioPlayer.addEventListener('timeupdate', _ => console.log(this.audioPlayer.currentTime));
      this.audioPlayer.addEventListener('ended', _ => this.setState({playing: false, currentTime: secondsToTime(0)}));
    }
  }

  // Draw amplitude of sound.
  visualize() {
    const pcmData = new Uint8Array(this.analyser.frequencyBinCount);
    const width = this.canvasRef.current.width;
    const height = this.canvasRef.current.height;
    const viewLength = (width / (LINE_WIDTH + SPACING)) | 0;
    const viewDuration = MILLIS_PER_BAR * viewLength;

    this.canvasContext.fillStyle = BKG_COLOR;
    this.canvasContext.lineWidth = LINE_WIDTH;
    this.canvasContext.strokeStyle = BAR_COLOR;

    let prevBarCount = 0;
    const drawFrame = () => {
      if (!this.startedOn) {
        return;
      }
      window.requestAnimationFrame(drawFrame);

      const duration = this.durationMillis + (Date.now() - this.startedOn);
      // Update record length timer.
      this.setState({duration: secondsToTime(duration / 1000)});

      // Check if record is too long.
      if (duration > MAX_DURATION) {
        this.mediaRecorder.pause();
        this.durationMillis += Date.now() - this.startedOn;
        this.startedOn = null;
        this.setState({enabled: false, recording: false, duration: secondsToTime(this.durationMillis / 1000)});
      }

      // Draw histogram.

      // Get current waveform and calculate its amplitude.
      this.analyser.getByteTimeDomainData(pcmData);
      let volume = 0.0;
      for (const amplitude of pcmData) {
        volume += (amplitude - 127) ** 2;
      }
      volume = Math.sqrt(volume/pcmData.length);

      let barCount = (duration / MILLIS_PER_BAR) | 0;
      // Shift of the histogram along x-axis to make scrolling smooth. No need to shift if recording is too short.
      const dx = viewDuration > duration ? 0 :
        (duration - MILLIS_PER_BAR * barCount) / MILLIS_PER_BAR * (LINE_WIDTH + SPACING);

      if (prevBarCount != barCount) {
        prevBarCount = barCount;
        // Add new amplitude visualization bar.
        this.viewBuffer.push(volume);
        if (this.viewBuffer.length > viewLength) {
          // Keep at most 'viewLength' amplitude bars.
          this.viewBuffer.shift();
        }
      }

      // Clear canvas.
      this.canvasContext.fillRect(0, 0, width, height);

      // Draw amplitude bars.
      this.canvasContext.beginPath();
      for (let i = 0; i < this.viewBuffer.length; i++) {
        let x = i * (LINE_WIDTH + SPACING) - dx;
        let y = this.viewBuffer[i] / BAR_SCALE * height;

        this.canvasContext.moveTo(x, (height - y) * 0.5);
        this.canvasContext.lineTo(x, height * 0.5 + y * 0.5);
      }
      // Actually draw the bars on canvas.
      this.canvasContext.stroke();
    }

    drawFrame();
  }

  handlePause(e) {
    e.preventDefault();
    this.setState({recording: false, duration: secondsToTime(this.durationMillis / 1000)});
  }

  handlePlay(e) {
    e.preventDefault();
    if (!this.state.canPlay) {
      return;
    }
    if (this.state.playing) {
      this.audioPlayer.pause();
    } else {
      this.audioPlayer.play();
    }
    this.setState({playing: !this.state.playing});
  }

  render() {
    const playClass = 'material-icons large' + (this.state.canPlay ? '' : ' disabled');
    return (
      <div className="audio-player">
        <a href="#" onClick={this.handlePlay} title="Play">
          <i className={playClass}>{this.state.playing ? 'pause_circle' : 'play_circle'}</i>
        </a>
        <div>
          <canvas className="visualiser" style={{backgroundColor: '#666'}} ref={this.canvasRef} />
          <div className="timer">{this.state.currentTime}/{this.state.duration}</div>
        </div>
      </div>
    );
  }
}

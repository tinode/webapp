// Audio recorder widget.

import React from 'react';

import { secondsToTime } from '../lib/strformat';
import { base64ToIntArray } from '../lib/blob-helpers';

// Make canvas bigger than the element size to reduce blurring.
const CANVAS_UPSCALING = 2.0;
// Thickness of a visualization bar.
const LINE_WIDTH = 3 * CANVAS_UPSCALING;
// Spacing between two visualization bars.
const SPACING = 2 * CANVAS_UPSCALING;
// Color of histogram bars
const BAR_COLOR = '#8fbed6';
const BAR_COLOR_DARK = '#5f8ea5';

// Background color
const BKG_COLOR = '#fff';
// Minimum number of amplitude bars to draw.
const MIN_PREVIEW_LENGTH = 16;

export default class AudioPlayer extends React.PureComponent {
  constructor(props) {
    super(props);

    let preview = base64ToIntArray(this.props.preview);
    if (Array.isArray(preview) && preview.length < MIN_PREVIEW_LENGTH) {
      preview = null;
    }

    this.state = {
      canPlay: false,
      playing: false,
      currentTime: '0:00',
      duration: this.props.duration > 0 ? secondsToTime(this.props.duration / 1000) : '-:--',
      preview: preview
    };

    this.calcPreviewBars = this.calcPreviewBars.bind(this);
    this.visualize = this.visualize.bind(this);

    this.handlePlay = this.handlePlay.bind(this);
    this.handleSeek = this.handleSeek.bind(this);
    this.handleError = this.handleError.bind(this);

    this.audioPlayer = null;

    this.viewBuffer = [];
    this.canvasRef = React.createRef();
  }

  componentDidMount() {
    if (this.props.src) {
      this.audioPlayer = new Audio(this.props.src);
      this.audioPlayer.addEventListener('canplay', _ => this.setState({canPlay: true}));
      this.audioPlayer.addEventListener('timeupdate', _ => this.setState({currentTime: secondsToTime(this.audioPlayer.currentTime)}));
      this.audioPlayer.addEventListener('ended', _ => this.setState({playing: false, currentTime: secondsToTime(0)}));
    }

    if (this.state.preview) {
      // Force canvas aspect ration to match one of the element + upscale canvas to reduce blurring.
      this.canvasRef.current.width = this.canvasRef.current.offsetWidth * CANVAS_UPSCALING;
      this.canvasRef.current.height = this.canvasRef.current.offsetHeight * CANVAS_UPSCALING;

      this.canvasContext = this.canvasRef.current.getContext('2d');
      this.canvasContext.lineCap = 'round';

      this.viewBuffer = this.calcPreviewBars(this.state.preview);
      this.visualize();
    }
  }

  // Draw amplitude of sound.
  visualize() {
    const width = this.canvasRef.current.width;
    const height = this.canvasRef.current.height;

    this.canvasContext.lineWidth = LINE_WIDTH;

    const drawFrame = () => {
      this.canvasContext.clearRect(0, 0, width, height);

      // Start new drawing.
      this.canvasContext.beginPath();

      if (this.viewBuffer) {
        window.requestAnimationFrame(drawFrame);

        this.canvasContext.strokeStyle = BAR_COLOR;
        // Draw amplitude bars.
        for (let i = 0; i < this.viewBuffer.length; i++) {
          let x = 1 + i * (LINE_WIDTH + SPACING) + LINE_WIDTH * 0.5;
          let y = this.viewBuffer[i] * height * 0.9;

          this.canvasContext.moveTo(x, (height - y) * 0.5);
          this.canvasContext.lineTo(x, height * 0.5 + y * 0.5);
        }

        // Actually draw the bars on canvas.
        this.canvasContext.stroke();

        if (this.props.duration) {
          this.canvasContext.beginPath();

          const x = Math.max(0, Math.min(this.audioPlayer.currentTime * 1000 / this.props.duration, 1)) * width;
          this.canvasContext.arc(x + LINE_WIDTH * 0.5, height * 0.5, LINE_WIDTH * 2, 0, 2 * Math.PI);
          this.canvasContext.fillStyle = BAR_COLOR_DARK;
          this.canvasContext.fill();
        }
      }
    }

    drawFrame();
  }

  // Quick and dirty downsampling of the original preview bars into a smaller (or equal) number of bars we can display here.
  calcPreviewBars(original) {
    const barCount = Math.min(original.length, ((this.canvasRef.current.width - 1) / (LINE_WIDTH + SPACING)) | 0);
    const factor = original.length / barCount;
    let amps = [];
    let max = -1;
    for (let i=0;i<barCount;i++) {
      let lo = (i * factor) | 0; // low bound;
      let hi = ((i + 1) * factor) | 0; // high bound;
      let amp = 0.0;
      for (let j=lo; j<hi; j++) {
        amp += original[j]
      }
      amps[i] = Math.max(0, amp / (hi - lo));
      max = Math.max(amps[i], max);
    }

    if (max > 0) {
      return amps.map(a => a / max);
    }
    return null;
  }

  handlePlay(e) {
    e.preventDefault();
    if (!this.state.canPlay) {
      return;
    }
    if (this.state.playing) {
      this.audioPlayer.pause();
      this.startedOn = null;
    } else {
      this.audioPlayer.play();
      this.startedOn = Date.now();
    }
    this.setState({playing: !this.state.playing});
  }

  handleError(err) {
    console.log(err);
  }

  handleSeek(e) {
    e.preventDefault();
    if (e.target && this.props.duration) {
      const rect = e.target.getBoundingClientRect();
      const offset = (e.clientX - rect.left) / rect.width;
      this.audioPlayer.currentTime = this.props.duration * offset / 1000;
      this.setState({currentTime: secondsToTime(this.audioPlayer.currentTime)});
    }
  }

  render() {
    const playClass = 'material-icons large' + (this.state.canPlay ? '' : ' disabled');
    return (
      <div className="audio-player">
        <a href="#" onClick={this.handlePlay} title="Play">
          <i className={playClass}>{this.state.playing ? 'pause_circle' : 'play_circle'}</i>
        </a>
        <div>
          {this.state.preview ?
            <canvas className="visualiser" ref={this.canvasRef} onClick={this.handleSeek} /> :
            <div className="visualiser">unavailable</div>
          }
          <div className="timer">{this.state.currentTime}/{this.state.duration}</div>
        </div>
      </div>
    );
  }
}

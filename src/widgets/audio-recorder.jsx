// Audio recorder widget.

import React from 'react';

import { secondsToTime } from '../lib/strformat';

// FFT resolution.
const BUFFER_SIZE = 256;
// Thickness of a visualization bar.
const LINE_WIDTH = 5;
// Spacing between two visualization bars.
const SPACING = 2;
// Duration represented by one visualization bar.
const MILLIS_PER_BAR = 100;
// Color of histogram bars
const BAR_COLOR = '#8fbed6';
// Background color
const BKG_COLOR = '#eeeeee';

export default class AudioRecorder extends React.PureComponent {
  constructor(props) {
    super(props);

    const enabled = !!navigator.mediaDevices.getUserMedia;
    this.state = {
      enabled: enabled,
      audioRecord: null,
      recording: false,
      paused: false,
      duration: '0:00'
    };

    this.visualize = this.visualize.bind(this);
    this.initMediaRecording = this.initMediaRecording.bind(this);
    this.handleStart = this.handleStart.bind(this);
    this.handleStop = this.handleStop.bind(this);
    this.handleDelete = this.handleDelete.bind(this);

    this.durationMillis = 0;
    this.startedOn = null;
    this.canvasRef = React.createRef();
  }

  componentDidMount() {
    if (!this.state.enabled) {
      return;
    }

    this.canvasContext = this.canvasRef.current.getContext('2d');
    this.canvasContext.lineCap = 'round';
    // To reduce line blurring.
    this.canvasContext.translate(0.5, 0.5);

    this.stream = null;
    this.mediaRecorder = null;
    this.audioContext = null;
    this.sampleRate = null;
    this.audioInput = null;
    this.analyser = null;

    this.audioChunks = [];
  }

  // Draw amplitude of sound.
  visualize() {
    const pcmData = new Uint8Array(this.analyser.frequencyBinCount);
    const width = this.canvasRef.current.width;
    const height = this.canvasRef.current.height;
    const viewBuffer = [];
    const viewLength = (width / (LINE_WIDTH + SPACING)) | 0;
    const viewDuration = MILLIS_PER_BAR * viewLength;

    // Take each N-th sample:
    const samples = (0.1 * this.sampleRate) | 0;

    this.canvasContext.fillStyle = BKG_COLOR;
    this.canvasContext.lineWidth = LINE_WIDTH;
    this.canvasContext.strokeStyle = BAR_COLOR;

    let prevBarCount = 0;
    const drawFrame = () => {
      const duration = this.durationMillis + Date.now() - this.startedOn;
      // Update record length timer.
      this.setState({duration: secondsToTime(duration / 1000)});

      if (this.state.recording) {
        window.requestAnimationFrame(drawFrame);
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
        viewBuffer.push(volume);
        if (viewBuffer.length > viewLength) {
          // Keep at most 'viewLength' amplitude bars.
          viewBuffer.shift();
        }
      }

      // Clear canvas.
      this.canvasContext.fillRect(0, 0, width, height);

      // Draw amplitude bars.
      this.canvasContext.beginPath();
      for (let i = 0; i < viewBuffer.length; i++) {
        let x = i * (LINE_WIDTH + SPACING) - dx;
        let y = viewBuffer[i] / 64 * height;

        this.canvasContext.moveTo(x, (height - y) * 0.5);
        this.canvasContext.lineTo(x, height * 0.5 + y * 0.5);
      }
      // Actually draw the bars on canvas.
      this.canvasContext.stroke();
    }

    drawFrame();
  }

  handleStop() {
    this.mediaRecorder.pause();
    this.durationMillis += Date.now() - this.startedOn;
    this.setState({recording: false, duration: secondsToTime(this.durationMillis / 1000)});
  }

  handleStart() {
    if (this.mediaRecorder) {
      this.startedOn = Date.now();
      this.mediaRecorder.resume();
      this.setState({recording: true}, this.visualize);
    } else {
      try {
        navigator.mediaDevices.getUserMedia({audio: true, video: false}).then(this.initMediaRecording, this.props.onError);
      } catch (err) {
        this.props.onError(err);
      }
    }
  }

  handleDelete() {
    // Delete current recording.
    console.log("Delete current cached recording");
  }

  initMediaRecording(stream) {
    this.stream = stream;
    this.mediaRecorder = new MediaRecorder(stream);

    // The following code is needed for visualization.
    this.audioContext = new AudioContext();
    this.sampleRate = this.audioContext.sampleRate;
    this.audioInput = this.audioContext.createMediaStreamSource(stream);
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = BUFFER_SIZE;
    this.audioInput.connect(this.analyser);

    this.mediaRecorder.onstop = _ => {
      console.log("Data available after MediaRecorder.stop() called.");
      const blob = new Blob(this.audioChunks, { 'type' : 'audio/mp3; codecs=mp3' });
      this.audioChunks = [];
      const url = window.URL.createObjectURL(blob);
      this.setState({audioRecord: url});
      console.log("Audio URL:", url);
    }

    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        this.audioChunks.push(e.data);
      }
    }

    this.startedOn = Date.now();
    this.mediaRecorder.start();
    this.setState({recording: true}, this.visualize);
  }

  render() {
    return (this.state.enabled ?
      <div className="audio">
        <canvas className="visualiser" width="200" height="60" ref={this.canvasRef} />
        <div className="duration">{this.state.duration}</div>
        {this.state.recording ?
          <a href="#" onClick={this.handleStop} title="Pause">
            <i className="material-icons">pause_circle_outline</i>
          </a> :
          <a href="#" onClick={this.handleStart} title="Resume">
            <i className="material-icons">mic</i>
          </a>
        }
      </div> :
      <div>Audio not available</div>);
  }
}

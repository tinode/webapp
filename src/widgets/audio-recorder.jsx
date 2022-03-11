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
// Minimum duration of a recording in milliseconds.
const MIN_DURATION = 200;
// Maximum duration of a recording in milliseconds (10 min).
const MAX_DURATION = 600000;

export default class AudioRecorder extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      enabled: true,
      audioRecord: null,
      recording: true,
      paused: false,
      duration: '0:00'
    };

    this.visualize = this.visualize.bind(this);
    this.initMediaRecording = this.initMediaRecording.bind(this);
    this.cleanUp = this.cleanUp.bind(this);

    this.handleResume = this.handleResume.bind(this);
    this.handlePause = this.handlePause.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleDone = this.handleDone.bind(this);

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

    this.stream = null;
    this.mediaRecorder = null;
    this.audioContext = null;
    this.audioInput = null;
    this.analyser = null;

    this.audioChunks = [];

    // Start recorder right away.
    try {
      navigator.mediaDevices.getUserMedia({audio: true, video: false}).then(this.initMediaRecording, this.props.onError);
    } catch (err) {
      this.props.onError(err);
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
    this.mediaRecorder.pause();
    this.durationMillis += Date.now() - this.startedOn;
    this.startedOn = null;
    this.setState({recording: false, duration: secondsToTime(this.durationMillis / 1000)});
  }

  handleResume(e) {
    e.preventDefault();
    if (this.state.enabled) {
      this.startedOn = Date.now();
      this.mediaRecorder.resume();
      this.setState({recording: true}, this.visualize);
    }
  }

  handleDelete(e) {
    e.preventDefault();
    this.durationMillis = 0;
    this.startedOn = null;
    this.mediaRecorder.stop();
    this.cleanUp();
    this.setState({recording: false});
  }

  handleDone(e) {
    e.preventDefault();
    this.setState({recording: false});
    if (this.startedOn) {
      this.durationMillis += Date.now() - this.startedOn;
      this.startedOn = null;
    }
    // Stop recording and return data.
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
    }
  }

  initMediaRecording(stream) {
    this.stream = stream;
    this.mediaRecorder = new MediaRecorder(stream);

    // The following code is needed for visualization.
    this.audioContext = new AudioContext();
    this.audioInput = this.audioContext.createMediaStreamSource(stream);
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = BUFFER_SIZE;
    this.audioInput.connect(this.analyser);

    this.mediaRecorder.onstop = _ => {
      const blob = new Blob(this.audioChunks, { 'type' : 'audio/mp3; codecs=mp3' });
      this.audioChunks = [];
      const url = window.URL.createObjectURL(blob);
      this.cleanUp();
      if (this.durationMillis > MIN_DURATION) {
        this.props.onFinished(url, this.durationMillis);
      } else {
        this.props.onDeleted();
      }
    }

    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        this.audioChunks.push(e.data);
      }
    }

    this.durationMillis = 0;
    this.startedOn = Date.now();
    this.mediaRecorder.start();
    this.visualize();
  }

  cleanUp() {
    this.stream.getTracks().forEach(track => track.stop());
    this.audioInput.disconnect();
    this.audioContext.close();
  }

  render() {
    const resumeClass = 'material-icons ' + (this.state.enabled ? 'red' : 'gray');
    return (
      <div className="audio">
        <a href="#" onClick={this.handleDelete} title="Delete">
          <i className="material-icons">delete_outline</i>
        </a>
        <canvas className="visualiser" width="200" height="60" ref={this.canvasRef} />
        <div className="duration">{this.state.duration}</div>
        {this.state.recording ?
          <a href="#" onClick={this.handlePause} title="Pause">
            <i className="material-icons">pause_circle_outline</i>
          </a> :
          <a href="#" onClick={this.handleResume} title="Resume">
            <i className={resumeClass}>radio_button_checked</i>
          </a>
        }
        <a href="#" onClick={this.handleDone} title="Send">
          <i className="material-icons">send</i>
        </a>
      </div>
    );
  }
}

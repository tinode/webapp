// Audio recorder widget.

import React from 'react';

const BUFFER_SIZE = 256;

export default class AudioRecorder extends React.PureComponent {
  constructor(props) {
    super(props);

    const enabled = !!navigator.mediaDevices.getUserMedia;
    this.state = {
      enabled: enabled,
      audioRecord: null,
      length: 0
    };

    this.recording = false;
    this.visualize = this.visualize.bind(this);
    this.initMediaRecording = this.initMediaRecording.bind(this);
    this.handleStart = this.handleStart.bind(this);
    this.handleStop = this.handleStop.bind(this);
    this.handleDelete = this.handleDelete.bind(this);

    // DEBUG
    this.min = 1000000;
    this.max = 0;

    this.canvasRef = React.createRef();
  }

  componentDidMount() {
    if (!this.state.enabled) {
      return;
    }

    this.canvasContext = this.canvasRef.current.getContext('2d');

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
    const record = [];
    const pcmData = new Uint8Array(BUFFER_SIZE);
    const width = this.canvasRef.current.width;
    const height = this.canvasRef.current.height;

    const drawFrame = () => {
      if (this.recording) {
        window.requestAnimationFrame(drawFrame);
      }

      // Get current waveform.
      this.analyser.getByteTimeDomainData(pcmData);

      this.canvasContext.fillStyle = 'rgb(200, 200, 200)';
      this.canvasContext.fillRect(0, 0, width, height);

      this.canvasContext.lineWidth = 2;
      this.canvasContext.strokeStyle = 'rgb(0, 0, 0)';

      let volume = 0.0;
      for (const amplitude of pcmData) {
        volume += (amplitude - 127) ** 2;
      }
      console.log("Amp sum, sqrt(sum), ave, sqrt(ave):", volume, Math.sqrt(volume) | 0, (volume/pcmData.length) | 0, Math.sqrt(volume/pcmData.length) | 0);

      this.min = Math.min(this.min, Math.sqrt(volume/pcmData.length))
      this.max = Math.max(this.max, Math.sqrt(volume/pcmData.length));

      record.push(volume);
      if (record.length > BUFFER_SIZE) {
        record.shift();
      }

      this.canvasContext.beginPath();

      const sliceWidth = width / BUFFER_SIZE;
      let x = 0;
      for (let i = 0; i < record.length; i++) {
        let v = record[i] / 128.0;
        let y = v * height * 0.5;

        if (i == 0) {
          this.canvasContext.moveTo(x, y);
        } else {
          this.canvasContext.lineTo(x, y);
        }

        x += sliceWidth;
      }
    }

    drawFrame();
  }

  handleStop() {
    this.recording = false;
    this.mediaRecorder.stop();
    console.log(this.mediaRecorder.state);
    console.log("recorder stopped");
  }

  handleStart() {
    try {
      navigator.mediaDevices.getUserMedia({audio: true, video: false}).then(this.initMediaRecording, this.props.onError);
    } catch (err) {
      this.props.onError(err);
    }
  }

  handleDelete() {
    // Delete current recording.
    console.log("Delete current cached recording");
  }

  initMediaRecording(stream) {
    this.recording = true;

    this.stream = stream;
    this.recording = true;

    this.mediaRecorder = new MediaRecorder(stream);

    // The following code is needed for visualization.
    this.audioContext = new AudioContext();
    this.sampleRate = this.audioContext.sampleRate;
    this.audioInput = this.audioContext.createMediaStreamSource(stream);
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = BUFFER_SIZE;
    this.audioInput.connect(this.analyser);
    this.visualize();

    this.mediaRecorder.onstop = _ => {
      console.log("Data available after MediaRecorder.stop() called.", this.min, this.max);
      const blob = new Blob(this.audioChunks, { 'type' : 'audio/mp3; codecs=mp3' });
      this.audioChunks = [];
      const url = window.URL.createObjectURL(blob);
      this.setState({audioRecord: url});
      console.log("Audio URL:", url);
    }

    this.mediaRecorder.ondataavailable = (e) => {
      this.audioChunks.push(e.data);
    }

    this.mediaRecorder.start();
  }

  render() {
    return (this.state.enabled ?
      <>
        <canvas className="audio-visualiser" width="200" height="60" ref={this.canvasRef} />
        <button className="record" onClick={this.handleStart}>Record</button>
        <button className="stop" onClick={this.handleStop}>Stop</button>
      </> :
      <div>Audio not available</div>);
  }
}

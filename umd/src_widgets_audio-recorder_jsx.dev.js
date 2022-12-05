"use strict";
(globalThis["webpackChunktinode_webapp"] = globalThis["webpackChunktinode_webapp"] || []).push([["src_widgets_audio-recorder_jsx"],{

/***/ "./src/widgets/audio-recorder.jsx":
/*!****************************************!*\
  !*** ./src/widgets/audio-recorder.jsx ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AudioRecorder)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _audio_player_jsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./audio-player.jsx */ "./src/widgets/audio-player.jsx");
/* harmony import */ var webm_duration_fix__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! webm-duration-fix */ "./node_modules/webm-duration-fix/lib/index.js");
/* harmony import */ var webm_duration_fix__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(webm_duration_fix__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/blob-helpers.js */ "./src/lib/blob-helpers.js");
/* harmony import */ var _lib_strformat__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../lib/strformat */ "./src/lib/strformat.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../config.js */ "./src/config.js");






const BUFFER_SIZE = 256;
const CANVAS_UPSCALING = 2.0;
const LINE_WIDTH = 3 * CANVAS_UPSCALING;
const SPACING = 2 * CANVAS_UPSCALING;
const MILLIS_PER_BAR = 100;
const BAR_COLOR = '#BBBD';
const BAR_SCALE = 64.0;
const VISUALIZATION_BARS = 96;
const MAX_SAMPLES_PER_BAR = 10;
const AUDIO_MIME_TYPE = 'audio/webm';
class AudioRecorder extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
    this.state = {
      enabled: true,
      audioRecord: null,
      recording: true,
      paused: false,
      duration: '0:00',
      blobUrl: null,
      preview: null
    };
    this.visualize = this.visualize.bind(this);
    this.initMediaRecording = this.initMediaRecording.bind(this);
    this.initCanvas = this.initCanvas.bind(this);
    this.getRecording = this.getRecording.bind(this);
    this.cleanUp = this.cleanUp.bind(this);
    this.handleResume = this.handleResume.bind(this);
    this.handlePause = this.handlePause.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleDone = this.handleDone.bind(this);
    this.durationMillis = 0;
    this.startedOn = null;
    this.viewBuffer = [];
    this.canvasRef = react__WEBPACK_IMPORTED_MODULE_0___default().createRef();
  }
  componentDidMount() {
    this.stream = null;
    this.mediaRecorder = null;
    this.audioContext = null;
    this.audioInput = null;
    this.analyser = null;
    this.audioChunks = [];
    try {
      navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
      }).then(this.initMediaRecording, this.props.onError);
    } catch (err) {
      this.props.onError(err);
    }
  }
  componentWillUnmount() {
    this.startedOn = null;
    if (this.stream) {
      this.cleanUp();
    }
  }
  visualize() {
    this.initCanvas();
    const pcmData = new Uint8Array(this.analyser.frequencyBinCount);
    const width = this.canvasWidth;
    const height = this.canvasHeight;
    const viewLength = width / (LINE_WIDTH + SPACING) | 0;
    const viewDuration = MILLIS_PER_BAR * viewLength;
    this.canvasContext.lineWidth = LINE_WIDTH;
    this.canvasContext.strokeStyle = BAR_COLOR;
    let prevBarCount = 0;
    let volume = 0.0;
    let countPerBar = 0;
    const drawFrame = _ => {
      if (!this.startedOn) {
        return;
      }
      window.requestAnimationFrame(drawFrame);
      const duration = this.durationMillis + (Date.now() - this.startedOn);
      this.setState({
        duration: (0,_lib_strformat__WEBPACK_IMPORTED_MODULE_4__.secondsToTime)(duration / 1000)
      });
      if (duration > _config_js__WEBPACK_IMPORTED_MODULE_5__.MAX_DURATION) {
        this.startedOn = null;
        this.mediaRecorder.pause();
        this.durationMillis += Date.now() - this.startedOn;
        this.setState({
          enabled: false,
          recording: false,
          duration: (0,_lib_strformat__WEBPACK_IMPORTED_MODULE_4__.secondsToTime)(this.durationMillis / 1000)
        });
      }
      this.analyser.getByteTimeDomainData(pcmData);
      let amp = 0.0;
      for (const amplitude of pcmData) {
        amp += (amplitude - 127) ** 2;
      }
      volume += Math.sqrt(amp / pcmData.length);
      countPerBar++;
      let barCount = duration / MILLIS_PER_BAR | 0;
      const dx = viewDuration > duration ? 0 : (duration - MILLIS_PER_BAR * barCount) / MILLIS_PER_BAR * (LINE_WIDTH + SPACING);
      if (prevBarCount != barCount) {
        prevBarCount = barCount;
        this.viewBuffer.push(volume / countPerBar);
        volume = 0.0;
        countPerBar = 0;
        if (this.viewBuffer.length > viewLength) {
          this.viewBuffer.shift();
        }
      }
      this.canvasContext.clearRect(0, 0, width, height);
      this.canvasContext.beginPath();
      for (let i = 0; i < this.viewBuffer.length; i++) {
        let x = i * (LINE_WIDTH + SPACING) - dx;
        let y = Math.min(this.viewBuffer[i] / BAR_SCALE, 0.9) * height;
        this.canvasContext.moveTo(x, (height - y) * 0.5);
        this.canvasContext.lineTo(x, height * 0.5 + y * 0.5);
      }
      this.canvasContext.stroke();
    };
    drawFrame();
  }
  handlePause(e) {
    e.preventDefault();
    this.mediaRecorder.pause();
    this.mediaRecorder.requestData();
    this.durationMillis += Date.now() - this.startedOn;
    this.startedOn = null;
    this.setState({
      recording: false
    });
  }
  handleResume(e) {
    e.preventDefault();
    if (this.state.enabled) {
      this.startedOn = Date.now();
      this.mediaRecorder.resume();
      this.setState({
        recording: true
      }, this.visualize);
    }
  }
  handleDelete(e) {
    e.preventDefault();
    this.durationMillis = 0;
    this.startedOn = null;
    this.mediaRecorder.stop();
    this.cleanUp();
    this.setState({
      recording: false
    });
  }
  handleDone(e) {
    e.preventDefault();
    this.setState({
      recording: false
    });
    if (this.startedOn) {
      this.durationMillis += Date.now() - this.startedOn;
      this.startedOn = null;
    }
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
    }
  }
  initCanvas() {
    this.canvasRef.current.width = this.canvasRef.current.offsetWidth * CANVAS_UPSCALING;
    this.canvasRef.current.height = this.canvasRef.current.offsetHeight * CANVAS_UPSCALING;
    this.canvasContext = this.canvasRef.current.getContext('2d');
    this.canvasContext.lineCap = 'round';
    this.canvasContext.translate(0.5, 0.5);
    this.canvasWidth = this.canvasRef.current.width;
    this.canvasHeight = this.canvasRef.current.height;
  }
  initMediaRecording(stream) {
    this.stream = stream;
    this.mediaRecorder = new MediaRecorder(stream, {
      mimeType: AUDIO_MIME_TYPE,
      audioBitsPerSecond: 24_000
    });
    this.audioContext = new AudioContext();
    this.audioInput = this.audioContext.createMediaStreamSource(stream);
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = BUFFER_SIZE;
    this.audioInput.connect(this.analyser);
    this.mediaRecorder.onstop = _ => {
      if (this.durationMillis > _config_js__WEBPACK_IMPORTED_MODULE_5__.MIN_DURATION) {
        this.getRecording(this.mediaRecorder.mimeType, this.durationMillis).then(result => this.props.onFinished(result.url, result.preview, this.durationMillis));
      } else {
        this.props.onDeleted();
      }
      this.cleanUp();
    };
    this.mediaRecorder.ondataavailable = e => {
      if (e.data.size > 0) {
        this.audioChunks.push(e.data);
      }
      if (this.mediaRecorder.state != 'inactive') {
        this.getRecording(this.mediaRecorder.mimeType).then(result => {
          this.setState({
            blobUrl: result.url,
            preview: result.preview
          });
        });
      }
    };
    this.durationMillis = 0;
    this.startedOn = Date.now();
    this.mediaRecorder.start();
    this.visualize();
  }
  getRecording(mimeType, duration) {
    mimeType = mimeType || AUDIO_MIME_TYPE;
    let blob = new Blob(this.audioChunks, {
      type: mimeType
    });
    return webm_duration_fix__WEBPACK_IMPORTED_MODULE_2___default()(blob, mimeType).then(fixedBlob => {
      blob = fixedBlob;
      return fixedBlob.arrayBuffer();
    }).then(arrayBuff => this.audioContext.decodeAudioData(arrayBuff)).then(decoded => this.createPreview(decoded)).then(preview => ({
      url: window.URL.createObjectURL(blob),
      preview: (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_3__.intArrayToBase64)(preview)
    }));
  }
  createPreview(audio) {
    const data = audio.getChannelData(0);
    const viewLength = Math.min(data.length, VISUALIZATION_BARS);
    const totalSPB = data.length / viewLength | 0;
    const samplingRate = Math.max(1, totalSPB / MAX_SAMPLES_PER_BAR | 0);
    let buffer = [];
    let max = -1;
    for (let i = 0; i < viewLength; i++) {
      let amplitude = 0;
      let count = 0;
      for (let j = 0; j < totalSPB; j += samplingRate) {
        amplitude += data[totalSPB * i + j] ** 2;
        count++;
      }
      const val = Math.sqrt(amplitude / count);
      buffer.push(val);
      max = Math.max(max, val);
    }
    if (max > 0) {
      buffer = buffer.map(a => 100 * a / max | 0);
    }
    return buffer;
  }
  cleanUp() {
    this.audioInput.disconnect();
    this.stream.getTracks().forEach(track => track.stop());
  }
  render() {
    const resumeClass = 'material-icons ' + (this.state.enabled ? 'red' : 'gray');
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "audio"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      onClick: this.handleDelete,
      title: "Delete"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons gray"
    }, "delete_outline")), this.state.recording ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("canvas", {
      ref: this.canvasRef
    }) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_audio_player_jsx__WEBPACK_IMPORTED_MODULE_1__["default"], {
      src: this.state.blobUrl,
      preview: this.state.preview,
      duration: this.durationMillis,
      short: true
    }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "duration"
    }, this.state.duration), this.state.recording ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      onClick: this.handlePause,
      title: "Pause"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "pause_circle_outline")) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      onClick: this.handleResume,
      title: "Resume"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: resumeClass
    }, "radio_button_checked")), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      onClick: this.handleDone,
      title: "Send"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "send")));
  }
}

/***/ })

}]);
//# sourceMappingURL=src_widgets_audio-recorder_jsx.dev.js.map
"use strict";
(self["webpackChunktinode_webapp"] = self["webpackChunktinode_webapp"] || []).push([["src_widgets_call-panel_jsx"],{

/***/ "./src/widgets/call-panel.jsx":
/*!************************************!*\
  !*** ./src/widgets/call-panel.jsx ***!
  \************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _letter_tile_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./letter-tile.jsx */ "./src/widgets/letter-tile.jsx");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../constants.js */ "./src/constants.js");
/* harmony import */ var _lib_strformat_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../lib/strformat.js */ "./src/lib/strformat.js");






const RING_SOUND = new Audio('audio/call-out.m4a');
RING_SOUND.loop = true;
const CALL_ENDED_SOUND = new Audio('audio/call-end.m4a');
CALL_ENDED_SOUND.loop = true;
const DIALING_SOUND = new Audio('audio/dialing.m4a');
const VIDEO_MUTED_EVENT = 'video:muted';
const VIDEO_UNMUTED_EVENT = 'video:unmuted';
const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_1__.defineMessages)({
  already_in_call: {
    id: "already_in_call",
    defaultMessage: [{
      "type": 0,
      "value": "You already in an ongoing call!"
    }]
  }
});
class CallPanel extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
    this.state = {
      localStream: undefined,
      remoteStream: undefined,
      pc: undefined,
      dataChannel: undefined,
      previousOnInfo: undefined,
      waitingForPeer: false,
      callInitialSetupComplete: false,
      audioOnly: props.callAudioOnly,
      videoToggleInProgress: false,
      remoteVideoLive: false
    };
    this.localStreamConstraints = {
      audio: true,
      video: !props.callAudioOnly
    };
    this.isOutgoingCall = props.callState == _constants_js__WEBPACK_IMPORTED_MODULE_4__.CALL_STATE_OUTGOING_INITATED;
    this.containerRef = react__WEBPACK_IMPORTED_MODULE_0___default().createRef();
    this.localRef = react__WEBPACK_IMPORTED_MODULE_0___default().createRef();
    this.remoteRef = react__WEBPACK_IMPORTED_MODULE_0___default().createRef();
    this.remoteIceCandidatesCache = [];
    this.onInfo = this.onInfo.bind(this);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.createPeerConnection = this.createPeerConnection.bind(this);
    this.canSendOffer = this.canSendOffer.bind(this);
    this.drainRemoteIceCandidatesCache = this.drainRemoteIceCandidatesCache.bind(this);
    this.handleNegotiationNeededEvent = this.handleNegotiationNeededEvent.bind(this);
    this.handleICECandidateEvent = this.handleICECandidateEvent.bind(this);
    this.handleNewICECandidateMsg = this.handleNewICECandidateMsg.bind(this);
    this.handleICEConnectionStateChangeEvent = this.handleICEConnectionStateChangeEvent.bind(this);
    this.handleSignalingStateChangeEvent = this.handleSignalingStateChangeEvent.bind(this);
    this.handleICEGatheringStateChangeEvent = this.handleICEGatheringStateChangeEvent.bind(this);
    this.handleIceCandidateErrorEvent = this.handleIceCandidateErrorEvent.bind(this);
    this.handleTrackEvent = this.handleTrackEvent.bind(this);
    this.handleVideoOfferMsg = this.handleVideoOfferMsg.bind(this);
    this.handleVideoAnswerMsg = this.handleVideoAnswerMsg.bind(this);
    this.handleNewICECandidateMsg = this.handleNewICECandidateMsg.bind(this);
    this.reportError = this.reportError.bind(this);
    this.handleGetUserMediaError = this.handleGetUserMediaError.bind(this);
    this.stopTracks = this.stopTracks.bind(this);
    this.disconnectMedia = this.disconnectMedia.bind(this);
    this.handleCloseClick = this.handleCloseClick.bind(this);
    this.handleToggleCameraClick = this.handleToggleCameraClick.bind(this);
    this.handleToggleMicClick = this.handleToggleMicClick.bind(this);
    this.handleRemoteHangup = this.handleRemoteHangup.bind(this);
    this.handleVideoCallAccepted = this.handleVideoCallAccepted.bind(this);
    this.muteVideo = this.muteVideo.bind(this);
    this.unmuteVideo = this.unmuteVideo.bind(this);
    this.emptyVideoTrack = this.emptyVideoTrack.bind(this);
    this.handleDataChannelEvent = this.handleDataChannelEvent.bind(this);
    this.handleDataChannelError = this.handleDataChannelError.bind(this);
    this.handleDataChannelMessage = this.handleDataChannelMessage.bind(this);
    this.handleDataChannelOpen = this.handleDataChannelOpen.bind(this);
    this.handleDataChannelClose = this.handleDataChannelClose.bind(this);
    this.bounds = {};
    this.dragStart = event => {
      if (!event.target.classList.contains('draggable')) {
        return;
      }
      if (window.matchMedia('(width<=640px)')) {
        return;
      }
      if (this.props.minimized && this.containerRef) {
        event.stopPropagation();
        this.containerRef.current.setPointerCapture(event.pointerId);
        this.containerRef.current.style.cursor = 'grabbing';
        this.bounds.left = this.containerRef.current.offsetLeft;
        this.bounds.top = this.containerRef.current.offsetTop;
        this.bounds.width = this.containerRef.current.offsetWidth;
        this.bounds.height = this.containerRef.current.offsetHeight;
        const parent = this.containerRef.current.offsetParent;
        this.bounds.maxX = parent.offsetWidth;
        this.bounds.maxY = parent.offsetHeight;
      }
    };
    this.drag = event => {
      event.stopPropagation();
      const el = this.containerRef.current;
      if (this.props.minimized && this.containerRef && el.hasPointerCapture(event.pointerId)) {
        this.bounds.left = Math.min(Math.max(this.bounds.left + event.movementX, 0), this.bounds.maxX - this.bounds.width);
        this.bounds.top = Math.min(Math.max(this.bounds.top + event.movementY, 0), this.bounds.maxY - this.bounds.height);
        el.style.left = `${this.bounds.left}px`;
        el.style.top = `${this.bounds.top}px`;
      }
    };
    this.dragEnd = event => {
      event.stopPropagation();
      if (this.props.minimized && this.containerRef) {
        this.containerRef.current.releasePointerCapture(event.pointerId);
        this.containerRef.current.style.cursor = 'grab';
      }
    };
  }
  componentDidMount() {
    const topic = this.props.tinode.getTopic(this.props.topic);
    this.previousOnInfo = topic.onInfo;
    topic.onInfo = this.onInfo;
    if ((this.props.callState == _constants_js__WEBPACK_IMPORTED_MODULE_4__.CALL_STATE_OUTGOING_INITATED || this.props.callState == _constants_js__WEBPACK_IMPORTED_MODULE_4__.CALL_STATE_IN_PROGRESS) && this.localRef.current) {
      this.start();
    }
    if (this.containerRef) {
      this.containerRef.current.addEventListener('pointerdown', this.dragStart);
      this.containerRef.current.addEventListener('pointermove', this.drag);
      this.containerRef.current.addEventListener('pointerup', this.dragEnd);
    }
  }
  componentWillUnmount() {
    const topic = this.props.tinode.getTopic(this.props.topic);
    topic.onInfo = this.previousOnInfo;
    this.stop();
    if (this.containerRef) {
      this.containerRef.current.removeEventListener('pointerdown', this.dragStart);
      this.containerRef.current.removeEventListener('pointermove', this.drag);
      this.containerRef.current.removeEventListener('pointerup', this.dragEnd);
    }
  }
  handleVideoCallAccepted(info) {
    RING_SOUND.pause();
    const pc = this.createPeerConnection(true);
    const stream = this.state.localStream;
    stream.getTracks().forEach(track => {
      pc.addTrack(track, stream);
      if (track.kind == 'video' && this.state.audioOnly) {
        track.enabled = false;
        track.stop();
        stream.removeTrack(track);
      }
    });
  }
  onInfo(info) {
    if (info.what != 'call') {
      return;
    }
    switch (info.event) {
      case 'accept':
        this.handleVideoCallAccepted(info);
        break;
      case 'answer':
        this.handleVideoAnswerMsg(info);
        break;
      case 'ice-candidate':
        this.handleNewICECandidateMsg(info);
        break;
      case 'hang-up':
        this.handleRemoteHangup(info);
        break;
      case 'offer':
        this.handleVideoOfferMsg(info);
        break;
      case 'ringing':
        RING_SOUND.play().catch(_ => {});
        break;
      default:
        console.warn("Unknown call event", info.event);
        break;
    }
  }
  emptyVideoTrack() {
    const width = 640;
    const height = 480;
    const canvas = Object.assign(document.createElement("canvas"), {
      width,
      height
    });
    canvas.getContext('2d').fillRect(0, 0, width, height);
    const stream = canvas.captureStream(0);
    return Object.assign(stream.getVideoTracks()[0], {
      enabled: false
    });
  }
  start() {
    if (this.state.localStream) {
      this.props.onError(this.props.intl.formatMessage(messages.already_in_call), 'info');
      return;
    }
    if (this.props.callState == _constants_js__WEBPACK_IMPORTED_MODULE_4__.CALL_STATE_IN_PROGRESS) {
      this.props.onInvite(this.props.topic, this.props.seq, _constants_js__WEBPACK_IMPORTED_MODULE_4__.CALL_STATE_IN_PROGRESS, this.props.callAudioOnly);
      return;
    }
    navigator.mediaDevices.getUserMedia(this.localStreamConstraints).then(stream => {
      if (!this.localStreamConstraints.video) {
        stream.addTrack(this.emptyVideoTrack());
      }
      this.setState({
        localStream: stream,
        waitingForPeer: true
      });
      this.localRef.current.srcObject = stream;
      DIALING_SOUND.play();
      this.props.onInvite(this.props.topic, this.props.seq, this.props.callState, this.props.callAudioOnly);
    }).catch(this.handleGetUserMediaError);
  }
  stop() {
    CALL_ENDED_SOUND.pause();
    CALL_ENDED_SOUND.currentTime = 0;
    RING_SOUND.pause();
    RING_SOUND.currentTime = 0;
    this.stopTracks(this.state.localStream);
    this.stopTracks(this.state.remoteStream);
    this.disconnectMedia(this.localRef.current);
    this.disconnectMedia(this.remoteRef.current);
    if (this.state.pc) {
      this.state.pc.ontrack = null;
      this.state.pc.onremovetrack = null;
      this.state.pc.onremovestream = null;
      this.state.pc.onicecandidate = null;
      this.state.pc.oniceconnectionstatechange = null;
      this.state.pc.onsignalingstatechange = null;
      this.state.pc.onicegatheringstatechange = null;
      this.state.pc.onnegotiationneeded = null;
      this.state.pc.onicecandidateerror = null;
      this.state.pc.ondatachannel = null;
      if (this.state.dataChannel && (this.state.dataChannel.readyState == 'open' || this.state.dataChannel.readyState == 'connecting')) {
        this.state.dataChannel.close();
      }
      this.state.pc.close();
    }
    this.setState({
      pc: null,
      waitingForPeer: false
    });
  }
  disconnectMedia(el) {
    if (!el) {
      return;
    }
    el.srcObject = null;
    el.src = '';
  }
  stopTracks(stream) {
    if (!stream) {
      return;
    }
    let tracks = stream.getTracks();
    if (tracks) {
      tracks.forEach(track => {
        track.stop();
        track.enabled = false;
      });
    }
  }
  handleDataChannelError(error) {
    console.error('data channel error', error);
  }
  handleDataChannelMessage(event) {
    switch (event.data) {
      case VIDEO_MUTED_EVENT:
        this.setState({
          remoteVideoLive: false
        }, _ => {
          this.remoteRef.current.srcObject = this.state.remoteStream;
        });
        break;
      case VIDEO_UNMUTED_EVENT:
        this.setState({
          remoteVideoLive: true
        }, _ => {
          this.remoteRef.current.srcObject = this.state.remoteStream;
        });
        break;
      default:
        break;
    }
  }
  handleDataChannelOpen(event) {
    if (!this.state.audioOnly) {
      event.target.send(VIDEO_UNMUTED_EVENT);
    }
  }
  handleDataChannelClose(event) {
    console.info('close data channel:', event);
  }
  handleDataChannelEvent(event) {
    console.info('data channel event:', event);
    const channel = event.channel;
    channel.onerror = this.handleDataChannelError;
    channel.onmessage = this.handleDataChannelMessage;
    channel.onopen = this.handleDataChannelOpen;
    channel.onclose = this.handleDataChannelClose;
    this.setState({
      dataChannel: channel
    });
  }
  createPeerConnection(withDataChannel) {
    const iceServers = this.props.tinode.getServerParam('iceServers', null);
    const pc = iceServers ? new RTCPeerConnection({
      iceServers: iceServers
    }) : new RTCPeerConnection();
    pc.onicecandidate = this.handleICECandidateEvent;
    pc.oniceconnectionstatechange = this.handleICEConnectionStateChangeEvent;
    pc.onicegatheringstatechange = this.handleICEGatheringStateChangeEvent;
    pc.onsignalingstatechange = this.handleSignalingStateChangeEvent;
    pc.onnegotiationneeded = this.handleNegotiationNeededEvent;
    pc.onicecandidateerror = this.handleIceCandidateErrorEvent;
    pc.ontrack = this.handleTrackEvent;
    pc.ondatachannel = this.handleDataChannelEvent;
    let stateUpdate = {
      pc: pc,
      waitingForPeer: false
    };
    if (withDataChannel) {
      const channel = pc.createDataChannel("events", {
        ordered: true
      });
      channel.onerror = this.handleDataChannelError;
      channel.onmessage = this.handleDataChannelMessage;
      channel.onopen = this.handleDataChannelOpen;
      channel.onclose = this.handleDataChannelClose;
      stateUpdate.dataChannel = channel;
    }
    this.setState(stateUpdate);
    return pc;
  }
  handleVideoAnswerMsg(info) {
    const desc = new RTCSessionDescription(info.payload);
    this.state.pc.setRemoteDescription(desc).then(_ => {
      this.setState({
        callInitialSetupComplete: true
      }, _ => this.drainRemoteIceCandidatesCache());
    }).catch(err => this.reportError(err));
  }
  reportError(err) {
    this.props.onError(err.message, 'err');
  }
  canSendOffer() {
    return this.isOutgoingCall || this.state.callInitialSetupComplete;
  }
  handleNegotiationNeededEvent(event) {
    const pc = event.target;
    if (!this.canSendOffer()) {
      return;
    }
    pc.createOffer().then(offer => {
      return pc.setLocalDescription(offer);
    }).then(_ => {
      this.props.onSendOffer(this.props.topic, this.props.seq, pc.localDescription.toJSON());
    }).catch(err => this.reportError(err));
  }
  handleIceCandidateErrorEvent(event) {
    console.warn("ICE candidate error:", event);
  }
  handleICECandidateEvent(event) {
    if (event.candidate) {
      this.props.onIceCandidate(this.props.topic, this.props.seq, event.candidate.toJSON());
    }
  }
  handleNewICECandidateMsg(info) {
    const candidate = new RTCIceCandidate(info.payload);
    if (this.state.callInitialSetupComplete) {
      this.state.pc.addIceCandidate(candidate).catch(err => {
        if (candidate.candidate) {
          this.reportError(err);
        }
        console.warn("Error adding new ice candidate", candidate, err);
      });
    } else {
      this.remoteIceCandidatesCache.push(candidate);
    }
  }
  drainRemoteIceCandidatesCache() {
    this.remoteIceCandidatesCache.forEach(candidate => {
      this.state.pc.addIceCandidate(candidate).catch(err => {
        if (candidate.candidate) {
          this.reportError(err);
        }
        console.warn("Error adding cached ice candidate", candidate, err);
      });
    });
    this.remoteIceCandidatesCache = [];
  }
  handleICEConnectionStateChangeEvent(event) {
    switch (event.target.iceConnectionState) {
      case 'closed':
      case 'failed':
        this.handleCloseClick();
        break;
    }
  }
  handleSignalingStateChangeEvent(event) {
    if (event.target.signalingState == 'closed') {
      this.handleCloseClick();
    }
  }
  handleICEGatheringStateChangeEvent(event) {}
  handleTrackEvent(event) {
    this.remoteRef.current.srcObject = event.streams[0];
    this.setState({
      remoteStream: event.streams[0]
    });
  }
  handleGetUserMediaError(e) {
    console.error("Error opening camera and/or microphone", e);
    switch (e.name) {
      case 'NotFoundError':
        this.reportError(e);
        break;
      case 'SecurityError':
      case 'PermissionDeniedError':
        break;
      default:
        this.reportError(e);
        break;
    }
    this.handleCloseClick();
  }
  handleVideoOfferMsg(info) {
    let localStream = null;
    const pc = this.state.pc ? this.state.pc : this.createPeerConnection(false);
    const desc = new RTCSessionDescription(info.payload);
    pc.setRemoteDescription(desc).then(_ => {
      return navigator.mediaDevices.getUserMedia(this.localStreamConstraints);
    }).then(stream => {
      let dummyVideo;
      if (!this.localStreamConstraints.video) {
        dummyVideo = this.emptyVideoTrack();
        stream.addTrack(dummyVideo);
      }
      localStream = stream;
      this.localRef.current.srcObject = stream;
      this.setState({
        localStream: stream
      });
      localStream.getTracks().forEach(track => {
        pc.addTrack(track, localStream);
      });
      if (dummyVideo) {
        dummyVideo.enabled = false;
        dummyVideo.stop();
        stream.removeTrack(dummyVideo);
      }
    }).then(_ => {
      return pc.createAnswer();
    }).then(answer => {
      return pc.setLocalDescription(answer);
    }).then(_ => {
      this.props.onSendAnswer(this.props.topic, this.props.seq, pc.localDescription.toJSON());
      this.setState({
        callInitialSetupComplete: true
      }, _ => this.drainRemoteIceCandidatesCache());
    }).catch(this.handleGetUserMediaError);
  }
  handleRemoteHangup() {
    if (!this.state.waitingForPeer) {
      this.handleCloseClick();
    } else {
      this.setState({
        waitingForPeer: false
      });
      RING_SOUND.pause();
      RING_SOUND.currentTime = 0;
      CALL_ENDED_SOUND.loop = true;
      CALL_ENDED_SOUND.play().catch(_ => {});
      setTimeout(_ => {
        this.handleCloseClick();
      }, 2000);
    }
  }
  handleCloseClick() {
    this.stop();
    this.props.onHangup(this.props.topic, this.props.seq);
  }
  muteVideo() {
    if (!this.state.pc || !this.state.dataChannel) {
      return;
    }
    const stream = this.state.localStream;
    const t = stream.getVideoTracks()[0];
    t.enabled = false;
    t.stop();
    stream.removeTrack(t);
    this.state.dataChannel.send(VIDEO_MUTED_EVENT);
    this.setState({
      videoToggleInProgress: false
    });
  }
  unmuteVideo() {
    if (!this.state.pc || !this.state.dataChannel) {
      return;
    }
    navigator.mediaDevices.getUserMedia({
      video: true
    }).then(stream => {
      this.localRef.current.srcObject = null;
      const sender = this.state.pc.getSenders().find(s => s.track.kind == 'video');
      const track = stream.getVideoTracks()[0];
      stream.removeTrack(track);
      this.state.localStream.addTrack(track);
      return sender.replaceTrack(track);
    }).then(_ => {
      this.localRef.current.srcObject = this.state.localStream;
      this.state.dataChannel.send(VIDEO_UNMUTED_EVENT);
    }).catch(err => this.handleGetUserMediaError(err)).finally(_ => {
      this.setState({
        videoToggleInProgress: false
      });
    });
  }
  handleToggleCameraClick() {
    if (this.state.videoToggleInProgress) {
      return;
    }
    const tracks = this.state.localStream.getVideoTracks();
    this.setState({
      videoToggleInProgress: true
    }, _ => {
      if (tracks && tracks.length > 0 && tracks[0].enabled && tracks[0].readyState == 'live') {
        this.muteVideo();
      } else {
        this.unmuteVideo();
      }
      this.setState({
        audioOnly: !this.state.audioOnly
      });
    });
  }
  handleToggleMicClick() {
    const stream = this.state.localStream;
    const t = stream.getAudioTracks()[0];
    t.enabled = !t.enabled;
    this.forceUpdate();
  }
  render() {
    const audioTracks = this.state.localStream && this.state.localStream.getAudioTracks();
    const videoTracks = !this.state.audioOnly && this.state.localStream && this.state.localStream.getVideoTracks();
    const disabled = !this.state.pc || !this.state.dataChannel || !(audioTracks && audioTracks[0]);
    const audioIcon = audioTracks && audioTracks[0] && audioTracks[0].enabled ? 'mic' : 'mic_off';
    const videoIcon = videoTracks && videoTracks[0] && videoTracks[0].enabled && videoTracks[0].readyState == 'live' ? 'videocam' : 'videocam_off';
    const peerTitle = (0,_lib_strformat_js__WEBPACK_IMPORTED_MODULE_5__.truncateString)(this.props.title, _config_js__WEBPACK_IMPORTED_MODULE_3__.MAX_PEER_TITLE_LENGTH);
    const pulseAnimation = this.state.waitingForPeer ? ' pulse' : '';
    let remoteActive = false;
    if (this.remoteRef.current && this.remoteRef.current.srcObject && this.state.remoteVideoLive) {
      const rstream = this.remoteRef.current.srcObject;
      if (rstream.getVideoTracks().length > 0) {
        const t = rstream.getVideoTracks()[0];
        remoteActive = t.enabled && t.readyState == 'live';
      }
    }
    const minimizedClass = this.props.minimized ? 'minimized' : null;
    const fullScreen = this.props.minimized ? 'fullscreen' : 'fullscreen_exit';
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "video-container",
      className: minimizedClass,
      ref: this.containerRef
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "video-container-panel"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "call-party self",
      disabled: this.state.audioOnly || this.props.minimized
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("video", {
      ref: this.localRef,
      autoPlay: true,
      muted: true,
      playsInline: true
    }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "caller-name inactive"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "calls_you_label",
      defaultMessage: [{
        "type": 0,
        "value": "You"
      }]
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "call-party peer",
      disabled: !remoteActive
    }, remoteActive ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("video", {
      ref: this.remoteRef,
      autoPlay: true,
      playsInline: true
    }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "caller-name inactive"
    }, peerTitle)) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("audio", {
      ref: this.remoteRef,
      autoPlay: true
    }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: `caller-card${pulseAnimation} draggable`
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "avatar-box"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_letter_tile_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
      authorizeURL: this.props.tinode.authorizeURL,
      avatar: this.props.avatar,
      topic: this.props.topic,
      title: this.props.title
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "caller-name"
    }, peerTitle))))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
      className: "full-screen",
      onClick: this.props.onToggleMinimize
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, fullScreen)), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "controls",
      className: minimizedClass
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
      className: "danger",
      onClick: this.handleCloseClick
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "call_end")), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
      className: "secondary",
      onClick: this.handleToggleCameraClick,
      disabled: disabled
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, videoIcon)), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
      className: "secondary",
      onClick: this.handleToggleMicClick,
      disabled: disabled
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, audioIcon))));
  }
}
;
/* harmony default export */ __webpack_exports__["default"] = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(CallPanel));

/***/ })

}]);
//# sourceMappingURL=src_widgets_call-panel_jsx.dev.js.map
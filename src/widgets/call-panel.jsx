// CallPanel displays call in progress: local and remote viewports and controls.
import React from 'react';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';

import LetterTile from './letter-tile.jsx';

import { CALL_WEBRTC_CONFIG, MAX_PEER_TITLE_LENGTH } from '../config.js';
import { CALL_STATE_OUTGOING_INITATED, CALL_STATE_IN_PROGRESS } from '../constants.js';

import { clipStr } from '../lib/utils.js'

const RING_SOUND = new Audio('audio/call-out.m4a');
RING_SOUND.loop = true;

const messages = defineMessages({
  already_in_call: {
    id: 'already_in_call',
    defaultMessage: 'You already in an ongoing call!',
    description: 'Error message when the user tried to accept a new call without finishing pervious one',
  }
});

class CallPanel extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      localStream: undefined,
      pc: undefined,

      previousOnInfo: undefined
    };

    this.localStreamConstraints = {
      audio: true,
      video: true
    };

    this.localRef = React.createRef();
    this.remoteRef = React.createRef();

    this.onInfo = this.onInfo.bind(this);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);

    this.createPeerConnection = this.createPeerConnection.bind(this);

    this.handleNegotiationNeededEvent = this.handleNegotiationNeededEvent.bind(this);
    this.handleICECandidateEvent = this.handleICECandidateEvent.bind(this);
    this.handleNewICECandidateMsg = this.handleNewICECandidateMsg.bind(this);
    this.handleICEConnectionStateChangeEvent = this.handleICEConnectionStateChangeEvent.bind(this);
    this.handleSignalingStateChangeEvent = this.handleSignalingStateChangeEvent.bind(this);
    this.handleICEGatheringStateChangeEvent = this.handleICEGatheringStateChangeEvent.bind(this);
    this.handleTrackEvent = this.handleTrackEvent.bind(this);

    this.handleVideoOfferMsg = this.handleVideoOfferMsg.bind(this);
    this.handleVideoAnswerMsg = this.handleVideoAnswerMsg.bind(this);
    this.handleNewICECandidateMsg = this.handleNewICECandidateMsg.bind(this);

    this.reportError = this.reportError.bind(this);
    this.handleGetUserMediaError = this.handleGetUserMediaError.bind(this);

    this.stopTracks = this.stopTracks.bind(this);

    this.handleCloseClick = this.handleCloseClick.bind(this);
    this.handleToggleCameraClick = this.handleToggleCameraClick.bind(this);
    this.handleToggleMicClick = this.handleToggleMicClick.bind(this);
    this.toggleMedia = this.toggleMedia.bind(this);

    this.handleRemoteHangup = this.handleRemoteHangup.bind(this);
    this.handleVideoCallAccepted = this.handleVideoCallAccepted.bind(this);
  }

  componentDidMount() {
    const topic = this.props.tinode.getTopic(this.props.topic);
    this.previousOnInfo = topic.onInfo;
    topic.onInfo = this.onInfo;
    if ((this.props.callState == CALL_STATE_OUTGOING_INITATED ||
         this.props.callState == CALL_STATE_IN_PROGRESS) && this.localRef.current) {
      this.start();
    }
  }

  componentWillUnmount() {
    const topic = this.props.tinode.getTopic(this.props.topic);
    topic.onInfo = this.previousOnInfo;
    this.stop();
  }

  handleVideoCallAccepted(info) {
    const pc = this.createPeerConnection();
    const stream = this.state.localStream;
    stream.getTracks().forEach(track => {
      pc.addTrack(track, stream);
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
      case 'offer':
        this.handleVideoOfferMsg(info);
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
    }
  }

  start() {
    if (this.state.localStream) {
      this.props.onError(this.props.intl.formatMessage(messages.already_in_call));
      return;
    }

    if (this.props.callState == CALL_STATE_IN_PROGRESS) {
      // We apparently just accepted the call.
      this.props.onInvite(this.props.topic, this.props.seq, this.props.callState);
      return;
    }

    // This is an outgoing call waiting for the other side to pick up.
    // Start local video.
    navigator.mediaDevices.getUserMedia(this.localStreamConstraints)
      .then(stream => {
        this.setState({localStream: stream});
        this.localRef.current.srcObject = stream;

        RING_SOUND.play();

        // Send call invitation.
        this.props.onInvite(this.props.topic, this.props.seq, this.props.callState);
      })
      .catch(this.handleGetUserMediaError);
  }

  stop() {
    RING_SOUND.pause();
    RING_SOUND.currentTime = 0;

    this.stopTracks(this.localRef.current);
    this.stopTracks(this.remoteRef.current);
    if (this.state.pc) {
      this.state.pc.ontrack = null;
      this.state.pc.onremovetrack = null;
      this.state.pc.onremovestream = null;
      this.state.pc.onicecandidate = null;
      this.state.pc.oniceconnectionstatechange = null;
      this.state.pc.onsignalingstatechange = null;
      this.state.pc.onicegatheringstatechange = null;
      this.state.pc.onnegotiationneeded = null;

      this.state.pc.close();
    }
    this.setState({pc: null});
  }

  stopTracks(el) {
    if (!el) {
      return;
    }
    let stream = el.srcObject;
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
    el.srcObject = null;
    el.src = '';
  }

  createPeerConnection() {
    var pc = new RTCPeerConnection(CALL_WEBRTC_CONFIG);

    pc.onicecandidate = this.handleICECandidateEvent;
    pc.oniceconnectionstatechange = this.handleICEConnectionStateChangeEvent;
    pc.onicegatheringstatechange = this.handleICEGatheringStateChangeEvent;
    pc.onsignalingstatechange = this.handleSignalingStateChangeEvent;
    pc.onnegotiationneeded = this.handleNegotiationNeededEvent;
    pc.ontrack = this.handleTrackEvent;

    this.setState({pc: pc});
    return pc;
  }

  handleVideoAnswerMsg(info) {
    // Configure the remote description, which is the SDP payload
    // in 'info' message.
    var desc = new RTCSessionDescription(info.payload);
    this.state.pc.setRemoteDescription(desc).catch(this.reportError);
  }

  reportError(err) {
    this.props.onError(err.message, 'err');
  }

  handleNegotiationNeededEvent() {
    this.state.pc.createOffer().then(offer => {
      return this.state.pc.setLocalDescription(offer);
    })
    .then(_ => {
      this.props.onSendOffer(this.props.topic, this.props.seq, this.state.pc.localDescription.toJSON());
    })
    .catch(this.reportError);
  }

  handleICECandidateEvent(event) {
    if (event.candidate) {
      this.props.onIceCandidate(this.props.topic, this.props.seq, event.candidate.toJSON());
    }
  }

  handleNewICECandidateMsg(info) {
    var candidate = new RTCIceCandidate(info.payload);

    this.state.pc.addIceCandidate(candidate)
      .catch(this.reportError);
  }

  handleICEConnectionStateChangeEvent(event) {
    switch (this.state.pc.iceConnectionState) {
      case 'closed':
      case 'failed':
        this.handleCloseClick();
        break;
    }
  }

  handleSignalingStateChangeEvent(event) {
    if (this.state.pc.signalingState == 'closed') {
      this.handleCloseClick();
    }
  }

  handleICEGatheringStateChangeEvent(event) {
    console.log('ICE gathering change state: ', event);
  }

  handleTrackEvent(event) {
    // Remote video becomes available.
    this.remoteRef.current.srcObject = event.streams[0];
    // Make sure we display the title (peer's name) over the remote video.
    this.forceUpdate();
  }

  handleGetUserMediaError(e) {
    switch(e.name) {
      case 'NotFoundError':
        // Cannot start the call b/c no camera and/or microphone found.
        this.reportError(e);
        break;
      case 'SecurityError':
      case 'PermissionDeniedError':
        // Do nothing; this is the same as the user canceling the call.
        break;
      default:
        console.log('Error opening your camera and/or microphone: ' + e.message);
        break;
    }

    // Make sure we shut down our end of the RTCPeerConnection so we're
    // ready to try again.
    this.handleCloseClick();
  }

  handleVideoOfferMsg(info) {
    var localStream = null;

    const pc = this.createPeerConnection();

    var desc = new RTCSessionDescription(info.payload);

    pc.setRemoteDescription(desc).then(() => {
      return navigator.mediaDevices.getUserMedia(this.localStreamConstraints);
    })
    .then(stream => {
      localStream = stream;
      this.localRef.current.srcObject = stream;
      this.setState({localStream: stream});

      localStream.getTracks().forEach(track => {
        pc.addTrack(track, localStream);
      });
    })
    .then(() => {
      return pc.createAnswer();
    })
    .then(answer => {
      return pc.setLocalDescription(answer);
    })
    .then(() => {
      this.props.onSendAnswer(this.props.topic, this.props.seq, pc.localDescription.toJSON());
    })
    .catch(this.handleGetUserMediaError);
  }

  handleRemoteHangup() {
    this.handleCloseClick();
  }

  handleCloseClick() {
    this.stop();
    this.props.onHangup(this.props.topic, this.props.seq);
  }

  // Mute/unmute audio/video (specified by kind).
  toggleMedia(kind) {
    const stream = this.state.localStream;
    stream.getTracks().forEach(track => {
      if (track.kind != kind) {
        return;
      }
      track.enabled = !track.enabled;
    });
    // Make sure we redraw the mute/unmute icons (e.g. mic -> mic_off).
    this.forceUpdate();
  }

  handleToggleCameraClick() {
    this.toggleMedia('video');
  }

  handleToggleMicClick() {
    this.toggleMedia('audio');
  }

  render() {
    const remoteActive = this.remoteRef.current && this.remoteRef.current.srcObject;
    const audioIcon = this.state.localStream && this.state.localStream.getAudioTracks()[0].enabled ? 'mic' : 'mic_off';
    const videoIcon = this.state.localStream && this.state.localStream.getVideoTracks()[0].enabled ? 'videocam' : 'videocam_off';
    const peerTitle = clipStr(this.props.title, MAX_PEER_TITLE_LENGTH);

    return (
      <>
        <div id="video-container">
          <div id="video-container-panel">
            <div className="call-party self">
              <video ref={this.localRef} autoPlay muted playsInline></video>
              <div className="caller-name inactive">
                <FormattedMessage id="calls_you_label"
                  defaultMessage="You" description="Shown over the local video screen" />
              </div>
            </div>
            <div className="call-party peer">
              <video ref={this.remoteRef} autoPlay playsInline></video>
              {remoteActive ?
                <div className="caller-name inactive">{peerTitle}</div> :
                <div className="caller-card">
                  <div className="avatar-box">
                    <LetterTile
                      tinode={this.props.tinode}
                      avatar={this.props.avatar}
                      topic={this.props.topic}
                      title={this.props.title} />
                  </div>
                  <div className="caller-name">{peerTitle}</div>
                </div>
              }
            </div>
          </div>
          <div className="controls">
            <button className="danger" onClick={this.handleCloseClick}><i className="material-icons">call_end</i></button>
            <button className="secondary" onClick={this.handleToggleCameraClick}><i className="material-icons">{videoIcon}</i></button>
            <button className="secondary" onClick={this.handleToggleMicClick}><i className="material-icons">{audioIcon}</i></button>
          </div>
        </div>
      </>
    );
  }
};

export default injectIntl(CallPanel);

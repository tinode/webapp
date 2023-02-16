// CallPanel displays call in progress: local and remote viewports and controls.
import React from 'react';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';

import LetterTile from './letter-tile.jsx';

import { MAX_PEER_TITLE_LENGTH } from '../config.js';
import { CALL_STATE_OUTGOING_INITATED, CALL_STATE_IN_PROGRESS } from '../constants.js';

import { clipStr } from '../lib/utils.js'

const RING_SOUND = new Audio('audio/call-out.m4a');
RING_SOUND.loop = true;
const CALL_ENDED_SOUND = new Audio('audio/call-end.m4a');
CALL_ENDED_SOUND.loop = true;
const DIALING_SOUND = new Audio('audio/dialing.m4a');

const VIDEO_MUTED_EVENT = 'video:muted';
const VIDEO_UNMUTED_EVENT = 'video:unmuted';

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
      remoteStream: undefined,
      pc: undefined,
      dataChannel: undefined,

      previousOnInfo: undefined,
      waitingForPeer: false,
      // If true, the client has received a remote SDP from the peer and has sent a local SDP to the peer.
      callInitialSetupComplete: false,
      audioOnly: props.callAudioOnly,
      // Video mute/unmute in progress.
      videoToggleInProgress: false,
      // Indicates if the remote peer has informed us that their camera is on.
      remoteVideoLive: false,
    };

    this.localStreamConstraints = {
      audio: true,
      video: !props.callAudioOnly
    };
    this.isOutgoingCall = props.callState == CALL_STATE_OUTGOING_INITATED;

    this.localRef = React.createRef();
    this.remoteRef = React.createRef();
    // Cache for remote ice candidates until initial setup gets completed.
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
    RING_SOUND.pause();
    // Create peer connection with a data channel.
    const pc = this.createPeerConnection(true);
    const stream = this.state.localStream;
    stream.getTracks().forEach(track => {
      pc.addTrack(track, stream);

      if (track.kind == 'video' && this.state.audioOnly) {
        // This is an audio-only call.
        // Remove dummy video track (placeholder remains).
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
        // play() throws if the user did not click the app first: https://goo.gl/xX8pDD.
        RING_SOUND.play().catch(_ => {});
        break;
      default:
        console.warn("Unknown call event", info.event);
        break;
    }
  }

  // Creates an empty video track placeholder.
  emptyVideoTrack() {
    const width = 640;
    const height = 480;
    const canvas = Object.assign(document.createElement("canvas"), {width, height});
    canvas.getContext('2d').fillRect(0, 0, width, height);
    const stream = canvas.captureStream(0);
    return Object.assign(stream.getVideoTracks()[0], {enabled: false});
  }

  start() {
    if (this.state.localStream) {
      this.props.onError(this.props.intl.formatMessage(messages.already_in_call), 'info');
      return;
    }

    if (this.props.callState == CALL_STATE_IN_PROGRESS) {
      // We apparently just accepted the call.
      this.props.onInvite(this.props.topic, this.props.seq, CALL_STATE_IN_PROGRESS, this.props.callAudioOnly);
      return;
    }

    // This is an outgoing call waiting for the other side to pick up.
    // Start local video.
    navigator.mediaDevices.getUserMedia(this.localStreamConstraints)
      .then(stream => {
        if (!this.localStreamConstraints.video) {
          // Starting an audio-only call. Create a dummy video track
          // (so video can be enabled during the call if the user desires).
          stream.addTrack(this.emptyVideoTrack());
        }
        this.setState({localStream: stream, waitingForPeer: true});
        this.localRef.current.srcObject = stream;

        DIALING_SOUND.play();

        // Send call invitation.
        this.props.onInvite(this.props.topic, this.props.seq, this.props.callState, this.props.callAudioOnly);
      })
      .catch(this.handleGetUserMediaError);
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
    this.setState({pc: null, waitingForPeer: false});
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
      this.setState({remoteVideoLive: false}, _ => { this.remoteRef.current.srcObject = this.state.remoteStream; });
      break;
    case VIDEO_UNMUTED_EVENT:
      this.setState({remoteVideoLive: true}, _ => { this.remoteRef.current.srcObject = this.state.remoteStream; });
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
    console.log('close data channel:', event);
  }

  handleDataChannelEvent(event) {
    console.log('data channel event:', event);
    const channel = event.channel;
    channel.onerror = this.handleDataChannelError;
    channel.onmessage = this.handleDataChannelMessage;
    channel.onopen = this.handleDataChannelOpen;
    channel.onclose = this.handleDataChannelClose;
    this.setState({dataChannel: channel});
  }

  createPeerConnection(withDataChannel) {
    const iceServers = this.props.tinode.getServerParam('iceServers', null);
    const pc = iceServers ? new RTCPeerConnection({iceServers: iceServers}) : new RTCPeerConnection();

    pc.onicecandidate = this.handleICECandidateEvent;
    pc.oniceconnectionstatechange = this.handleICEConnectionStateChangeEvent;
    pc.onicegatheringstatechange = this.handleICEGatheringStateChangeEvent;
    pc.onsignalingstatechange = this.handleSignalingStateChangeEvent;
    pc.onnegotiationneeded = this.handleNegotiationNeededEvent;
    pc.onicecandidateerror = this.handleIceCandidateErrorEvent;
    pc.ontrack = this.handleTrackEvent;
    pc.ondatachannel = this.handleDataChannelEvent;

    let stateUpdate = {pc: pc, waitingForPeer: false};
    if (withDataChannel) {
      // Create data channel for exchanging events.
      const channel = pc.createDataChannel("events", {ordered: true});
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
    // Configure the remote description, which is the SDP payload
    // in 'info' message.
    const desc = new RTCSessionDescription(info.payload);
    this.state.pc.setRemoteDescription(desc)
      .then(_ => {
        this.setState({ callInitialSetupComplete: true }, _ => this.drainRemoteIceCandidatesCache());
      })
      .catch(err => this.reportError(err));
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
    })
    .then(_ => {
      this.props.onSendOffer(this.props.topic, this.props.seq, pc.localDescription.toJSON());
    })
    .catch(err => this.reportError(err));
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
      this.state.pc.addIceCandidate(candidate)
        .catch(err => {
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
      this.state.pc.addIceCandidate(candidate)
        .catch(err => {
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

  handleICEGatheringStateChangeEvent(event) {
    // ICE gathering change state
  }

  handleTrackEvent(event) {
    // Remote video becomes available.
    this.remoteRef.current.srcObject = event.streams[0];
    this.setState({remoteStream: event.streams[0]});
  }

  handleGetUserMediaError(e) {
    console.error("Error opening camera and/or microphone", e);
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
        this.reportError(e);
        break;
    }

    // Make sure we shut down our end of the RTCPeerConnection so we're
    // ready to try again.
    this.handleCloseClick();
  }

  handleVideoOfferMsg(info) {
    let localStream = null;
    // If needed, create peer connection.
    // Not creating data channel since it should be created by the peer.
    const pc = this.state.pc ? this.state.pc : this.createPeerConnection(false);
    const desc = new RTCSessionDescription(info.payload);

    pc.setRemoteDescription(desc).then(_ => {
      return navigator.mediaDevices.getUserMedia(this.localStreamConstraints);
    })
    .then(stream => {
      let dummyVideo;
      if (!this.localStreamConstraints.video) {
        // Starting an audio-only call. Create an empty video track so
        // so the user can enable the video during the call.
        dummyVideo = this.emptyVideoTrack();
        stream.addTrack(dummyVideo);
      }
      localStream = stream;
      this.localRef.current.srcObject = stream;
      this.setState({localStream: stream});

      localStream.getTracks().forEach(track => {
        pc.addTrack(track, localStream);
      });

      if (dummyVideo) {
        dummyVideo.enabled = false;
        dummyVideo.stop();
        stream.removeTrack(dummyVideo);
      }
    })
    .then(_ => {
      return pc.createAnswer();
    })
    .then(answer => {
      return pc.setLocalDescription(answer);
    })
    .then(_ => {
      this.props.onSendAnswer(this.props.topic, this.props.seq, pc.localDescription.toJSON());
      this.setState({ callInitialSetupComplete: true }, _ => this.drainRemoteIceCandidatesCache());
    })
    .catch(this.handleGetUserMediaError);
  }

  // Call disconnected by remote.
  handleRemoteHangup() {
    if (!this.state.waitingForPeer) {
      // This is live call, just hang up.
      this.handleCloseClick();
    } else {
      // This is a call which is not yet connected.
      // Stop pulse animation.
      this.setState({waitingForPeer: false});
      // Change sound and wait a bit before ending it.
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

  // Ends video track and turns off the camera.
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
    this.setState({videoToggleInProgress: false});
  }

  unmuteVideo() {
    if (!this.state.pc || !this.state.dataChannel) {
      return;
    }
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        // Will extract video track from stream and throw stream away,
        // and replace video track in the media sender.
        this.localRef.current.srcObject = null;
        const sender = this.state.pc.getSenders().find(s => s.track.kind == 'video');
        const track = stream.getVideoTracks()[0];
        // Remote track from new stream.
        stream.removeTrack(track);
        // Add this track to the existing local stream.
        this.state.localStream.addTrack(track);
        return sender.replaceTrack(track);
      })
      .then(_ => {
        this.localRef.current.srcObject = this.state.localStream;
        this.state.dataChannel.send(VIDEO_UNMUTED_EVENT);
      })
      .catch(err => this.handleGetUserMediaError(err))
      .finally(_ => { this.setState({videoToggleInProgress: false}); }); // Make sure we redraw the mute/unmute icons (e.g. camera -> camera_off).
  }

  handleToggleCameraClick() {
    if (this.state.videoToggleInProgress) {
      // Toggle currently in progress.
      return;
    }
    const tracks = this.state.localStream.getVideoTracks();
    this.setState({videoToggleInProgress: true}, _ => {
      if (tracks && tracks.length > 0 && tracks[0].enabled && tracks[0].readyState == 'live') {
        this.muteVideo();
      } else {
        this.unmuteVideo();
      }
      this.setState({audioOnly: !this.state.audioOnly});
    });
  }

  handleToggleMicClick() {
    const stream = this.state.localStream;
    const t = stream.getAudioTracks()[0];
    t.enabled = !t.enabled;
    // Make sure we redraw the mute/unmute icons (e.g. mic -> mic_off).
    this.forceUpdate();
  }

  render() {
    const audioTracks = this.state.localStream && this.state.localStream.getAudioTracks();
    const videoTracks = !this.state.audioOnly && this.state.localStream && this.state.localStream.getVideoTracks();
    const disabled = !this.state.pc || !this.state.dataChannel || !(audioTracks && audioTracks[0]);
    const audioIcon = audioTracks && audioTracks[0] && audioTracks[0].enabled ? 'mic' : 'mic_off';
    const videoIcon = videoTracks && videoTracks[0] && videoTracks[0].enabled && videoTracks[0].readyState == 'live' ? 'videocam' : 'videocam_off';
    const peerTitle = clipStr(this.props.title, MAX_PEER_TITLE_LENGTH);
    const pulseAnimation = this.state.waitingForPeer ? ' pulse' : '';

    let remoteActive = false;
    if (this.remoteRef.current && this.remoteRef.current.srcObject && this.state.remoteVideoLive) {
      const rstream = this.remoteRef.current.srcObject;
      if (rstream.getVideoTracks().length > 0) {
        const t = rstream.getVideoTracks()[0];
        remoteActive = t.enabled && t.readyState == 'live';
      }
    }

    return (
      <>
        <div id="video-container">
          <div id="video-container-panel">
            <div className="call-party self" disabled={this.state.audioOnly}>
              <video ref={this.localRef} autoPlay muted playsInline />
              <div className="caller-name inactive">
                <FormattedMessage id="calls_you_label"
                  defaultMessage="You" description="Shown over the local video screen" />
              </div>
            </div>
            <div className="call-party peer" disabled={!remoteActive}>
              {remoteActive ?
                <>
                  <video ref={this.remoteRef} autoPlay playsInline />
                  <div className="caller-name inactive">{peerTitle}</div>
                </> :
                <>
                  <audio ref={this.remoteRef} autoPlay />
                  <div className={`caller-card${pulseAnimation}`}>
                    <div className="avatar-box">
                      <LetterTile
                        tinode={this.props.tinode}
                        avatar={this.props.avatar}
                        topic={this.props.topic}
                        title={this.props.title} />
                    </div>
                    <div className="caller-name">{peerTitle}</div>
                  </div>
                </>
              }
            </div>
          </div>
          <div className="controls">
            <button className="danger" onClick={this.handleCloseClick}>
              <i className="material-icons">call_end</i>
            </button>
            <button className="secondary" onClick={this.handleToggleCameraClick} disabled={disabled}>
              <i className="material-icons">{videoIcon}</i>
            </button>
            <button className="secondary" onClick={this.handleToggleMicClick} disabled={disabled}>
              <i className="material-icons">{audioIcon}</i>
            </button>
          </div>
        </div>
      </>
    );
  }
};

export default injectIntl(CallPanel);

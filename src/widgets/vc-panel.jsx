// Video conference or broadcast: local and/or peer viewports and controls.
import React from 'react';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';

import {
  connect,
  LocalParticipant,
  LocalVideoTrack,
  MediaDeviceFailure,
  Participant,
  ParticipantEvent,
  RemoteParticipant,
  RemoteTrack,
  RemoteTrackPublication,
  Room,
  RoomEvent,
  Track,
  VideoPresets
} from 'livekit-client';

import LetterTile from './letter-tile.jsx';
import VCCarousel from './vc-carousel.jsx';
import { makeImageUrl } from '../lib/blob-helpers.js';

import { MAX_PEER_TITLE_LENGTH } from '../config.js';
import { CALL_STATE_OUTGOING_INITATED } from '../constants.js';

import { clipStr } from '../lib/utils.js'

class VCPanel extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      room: undefined,

      participants: {},
      activeSpeaker: undefined,

      previousOnInfo: undefined,
    };

    this.isOutgoingCall = props.callState == CALL_STATE_OUTGOING_INITATED;
    const topic = this.props.tinode.getTopic(this.props.topic);
    this.isBroadcast = topic && topic.chan;

    this.localRef = React.createRef();
    this.remoteRef = React.createRef();

    this.onInfo = this.onInfo.bind(this);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);

    this.reportError = this.reportError.bind(this);

    this.handleCloseClick = this.handleCloseClick.bind(this);
    this.handleToggleCameraClick = this.handleToggleCameraClick.bind(this);
    this.handleToggleMicClick = this.handleToggleMicClick.bind(this);

    this.handleRemoteHangup = this.handleRemoteHangup.bind(this);

    this.handleTrackSubscribed = this.handleTrackSubscribed.bind(this);
    this.handleTrackUnsubscribed = this.handleTrackUnsubscribed.bind(this);
    this.handleActiveSpeakerChange = this.handleActiveSpeakerChange.bind(this);
    this.handleDisconnect = this.handleDisconnect.bind(this);
    this.handleLocalTrackUnpublished = this.handleLocalTrackUnpublished.bind(this);
    this.handleLocalTrackPublished = this.handleLocalTrackPublished.bind(this);
    this.handleParticipantConnected = this.handleParticipantConnected.bind(this);
    this.handleParticipantDisconnected = this.handleParticipantDisconnected.bind(this);
    this.handleData = this.handleData.bind(this);
    this.handleDevicesChanged = this.handleDevicesChanged.bind(this);
    this.startRoom = this.startRoom.bind(this);

    this.participants = {};
  }

  componentDidMount() {
    const topic = this.props.tinode.getTopic(this.props.topic);
    this.previousOnInfo = topic.onInfo;
    topic.onInfo = this.onInfo;
    this.start();
  }

  componentWillUnmount() {
    const topic = this.props.tinode.getTopic(this.props.topic);
    topic.onInfo = this.previousOnInfo;
    this.stop();
  }

  onInfo(info) {
    if (info.what != 'call') {
      return;
    }
    switch (info.event) {
      case 'vc-token':
        const ts = info.payload;
        this.setState({token: ts.token});
        this.startRoom(ts.token);
        break;
      case 'hang-up':
        this.handleRemoteHangup(info);
        break;
      default:
        console.warn("Unknown call event", info.event);
        break;
    }
  }


  handleParticipantConnected(participant) {
    if (!participant) return;
    if (participant instanceof RemoteParticipant) {
      participant
        .on(ParticipantEvent.TrackMuted, pub => {
          console.log('track was muted', pub.trackSid, participant.identity);
          this.forceUpdate();  // Redraw carousel.
        })
        .on(ParticipantEvent.TrackUnmuted, pub => {
          console.log('track was unmuted', pub.trackSid, participant.identity);
          this.forceUpdate();  // Redraw carousel.
        })
        .on(ParticipantEvent.IsSpeakingChanged, _ => {
          this.forceUpdate();  // Redraw carousel.
        })
        .on(ParticipantEvent.ConnectionQualityChanged, _ => {
          this.forceUpdate();  // Redraw carousel.
        });

      const me = this.props.tinode.getMeTopic();
      const c = me.getContact(participant.identity);
      const name = c && c.public && c.public.fn ? c.public.fn : participant.identity;
      const photo = makeImageUrl(c && c.public ? c.public.photo : null);
      const p = {
        name: name,
        photo: photo,
        participant: participant
      };
      this.participants[participant.identity] = p
      console.log('participant connected', this.participants);
      this.setState({participants: this.participants}, _ => { this.forceUpdate(); });
    }
  }

  handleParticipantDisconnected(participant) {
    console.log('Deleting participant ', participant.identity);
    delete this.participants[participant.identity];
    this.setState({participants: this.participants});
  }

  handleData(msg, participant) {
    console.log('Data message ', msg, participant);
  }

  handleTrackSubscribed(track, publication, participant) {
    if (participant instanceof RemoteParticipant) {
      // Check if we're presenting a remote video stream.
      if (this.remoteRef.current && !(this.remoteRef.current.src != '' || this.remoteRef.srcObject)) {
        track.attach(this.remoteRef.current);
      }
    }
    // Redraw the carousel and remote view.
    this.forceUpdate();
  }

  handleTrackUnsubscribed(track, publication, participant) {
    console.log('handleTrackUnsubscribed', track);
    // remove tracks from all attached elements
    track.detach();
    this.forceUpdate();
  }

  handleLocalTrackPublished(pub) {
    console.log('Local track published', pub);
    const track = pub.track;
    if ((track instanceof LocalVideoTrack) && this.localRef.current) {
      const elem = this.localRef.current;
      track.attach(elem);
      // flip.
      elem.style.transform = 'scale(-1, 1)';
    }
  }

  handleLocalTrackUnpublished(pub) {
    const track = pub.track;
    console.log('handleLocalTrackUnpublished', track);
    track.detach();
    // Redraw carousel.
    this.forceUpdate();
  }

  handleActiveSpeakerChange(speakers) {
    console.log('handleActiveSpeakerChange', speakers);
    speakers.forEach(s => {
      if (s.isSpeaking) {
        console.log('Speaking participant ', s);

        // Display speaker in remote peer view.
        const elem = this.remoteRef.current;
        const me = this.props.tinode.getMeTopic();
        const c = me.getContact(s.identity);
        const name = c && c.public && c.public.fn ? c.public.fn : undefined;
        this.setState({activeSpeaker: name});

        const cameraPub = s.getTrack(Track.Source.Camera);
        const cameraEnabled = cameraPub && cameraPub.isSubscribed && !cameraPub.isMuted;
        if (cameraEnabled && cameraPub.videoTrack) {
          cameraPub.videoTrack.attach(elem);
        }
      }
    });
  }

  handleDevicesChanged() {
    console.log('devices changed');
    // TODO: implement.
  }

  handleDisconnect() {
    console.log('disconnected from room');
    this.handleCloseClick();
  }

  startRoom(token) {
    const roomOpts = {
      adaptiveStream: true,
      dynacast: true,
      publishDefaults: {
        simulcast: true,
        videoSimulcastLayers: [VideoPresets.h90, VideoPresets.h216],
        videoCodec: 'vp8'
      },
      videoCaptureDefaults: {
        resolution: VideoPresets.h720.resolution
      }
    };

    const connectOpts = {
      autoSubscribe: true
    };

    // creates a new room with options
    const room = new Room(roomOpts);

    this.setState({room: room});

    const startTime = Date.now();
    const topic = this.props.tinode.getTopic(this.props.topic);
    const shouldPublish = this.isOutgoingCall || !this.isBroadcast;

    room
      .on(RoomEvent.ParticipantConnected, this.handleParticipantConnected)
      .on(RoomEvent.ParticipantDisconnected, this.handleParticipantDisconnected)
      .on(RoomEvent.DataReceived, this.handleData)
      .on(RoomEvent.TrackSubscribed, this.handleTrackSubscribed)
      .on(RoomEvent.TrackUnsubscribed, this.handleTrackUnsubscribed)
      .on(RoomEvent.ActiveSpeakersChanged, this.handleActiveSpeakerChange)
      .on(RoomEvent.Disconnected, this.handleDisconnect)
      .on(RoomEvent.LocalTrackUnpublished, this.handleLocalTrackUnpublished)
      .on(RoomEvent.LocalTrackPublished, this.handleLocalTrackPublished)

      .on(RoomEvent.RoomMetadataChanged, metadata => {
        console.log('VC room new metadata ', metadata);
      })
      .on(RoomEvent.MediaDevicesChanged, this.handleDevicesChanged)
      .on(RoomEvent.AudioPlaybackStatusChanged, e => {
        // TODO: handle it.
        console.log('Audio playback status change: ', e);
      })
      .on(RoomEvent.MediaDevicesError, e => {
        const failure = MediaDeviceFailure.getFailure(e);
        this.reportError(failure);
      })
      .on(RoomEvent.ConnectionQualityChanged, (quality, participant) => {
        const id = participant ? participant.identity : 'nil';
        console.log('Connection quality changed', id, ' -> ', quality);
      })
      .on(RoomEvent.SignalConnected, _ => {
        const signalConnectionTime = Date.now() - startTime;
        console.log(`signal connection established in ${signalConnectionTime}ms`);
        // speed up publishing by starting to publish before it's fully connected
        // publishing is accepted as soon as signal connection has established
        if (shouldPublish) {
          room.localParticipant.enableCameraAndMicrophone();
          console.log(`tracks published in ${Date.now() - startTime}ms`);
        }
      });

    const vcEndpoint = this.props.tinode.getServerParam('vcEndpoint', null);
    room.connect(vcEndpoint, token, connectOpts).then(_ => {
      console.log('Connected to VC room', room.name, '. Access token', token);

      room.participants.forEach((participant) => {
        this.handleParticipantConnected(participant);
      });
      this.handleParticipantConnected(room.localParticipant);
    });

  }

  start() {
    if (this.state.localStream) {
      this.props.onError(this.props.intl.formatMessage(messages.already_in_call), 'info');
      return;
    }
    if (this.isOutgoingCall) {
      this.props.onCreateCall(this.props.topic, this.props.seq, this.props.callState, this.props.callAudioOnly)
          .then(ctrl => {
            const token = ctrl.params.token;
            const seq = ctrl.params.seq;
            this.setState({callSeq: seq, token: token});
            this.startRoom(token);
          });
    } else {
      this.props.onJoin(this.props.topic, this.props.seq);
    }
  }

  stop() {
    if (this.state.room) {
      this.state.room.disconnect();
    }
  }

  reportError(err) {
    this.props.onError(err.message, 'err');
  }

  // Call disconnected by remote.
  handleRemoteHangup() {
    this.handleCloseClick();
  }

  handleCloseClick() {
    this.stop();
    this.props.onHangup(this.props.topic, this.props.seq);
  }

  handleToggleCameraClick() {
    if (!this.state.room) return;
    const enabled = this.state.room.localParticipant.isCameraEnabled;
    this.state.room.localParticipant.setCameraEnabled(!enabled)
      .then(_ => this.forceUpdate());
    this.forceUpdate();
  }

  handleToggleMicClick() {
    if (!this.state.room) return;
    const enabled = this.state.room.localParticipant.isMicrophoneEnabled;
    this.state.room.localParticipant.setMicrophoneEnabled(!enabled)
      .then(_ => this.forceUpdate());

    // Make sure we redraw the mute/unmute icons (e.g. mic -> mic_off).
    this.forceUpdate();
  }

  render() {
    const isPublishing = this.isOutgoingCall || !this.isBroadcast;
    const disabled = !isPublishing || !this.state.room || !this.state.room.localParticipant;
    const audioIcon = !disabled && this.state.room.localParticipant.isMicrophoneEnabled ? 'mic' : 'mic_off';
    const videoIcon = !disabled && this.state.room.localParticipant.isCameraEnabled ? 'videocam' : 'videocam_off';

    const peerTitle = this.state.activeSpeaker ? this.state.activeSpeaker : clipStr(this.props.title, MAX_PEER_TITLE_LENGTH);

    const remoteActive = this.remoteRef.current && (this.remoteRef.current.src || this.remoteRef.current.srcObject)

    return (
      <>
        <div id="video-container">
          {!this.isBroadcast && Object.keys(this.state.participants).length > 0 ?
            <VCCarousel
              tinode={this.props.tinode}
              participants={this.state.participants} /> :
            null
          }
          <div id="video-container-panel">
            {isPublishing ?
              <div className="call-party self" disabled={this.state.audioOnly}>
                <video ref={this.localRef} autoPlay muted playsInline />
                <div className="caller-name inactive">
                  <FormattedMessage id="calls_you_label"
                    defaultMessage="You" description="Shown over the local video screen" />
                </div>
              </div> :
              null }
            <div className="call-party peer" disabled={!remoteActive}>
              <video ref={this.remoteRef} autoPlay playsInline />
              {remoteActive ?
                <>
                  <div className="caller-name inactive">{peerTitle}</div>
                </> :
                <>
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

export default injectIntl(VCPanel);

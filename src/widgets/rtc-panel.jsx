import React from 'react';

export default class RtcPanel extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isChannelReady: false,
      isInitiator: false,
      isStarted: false,
      localStream: undefined,
      pc: undefined,
      remoteStream: undefined,

      previousOnInfo: undefined
    };

    this.localStreamConstraints = {
      audio: true,
      video: true
    };

    this.pcConfig = {
      iceServers: [
        { urls: [ "stun:bn-turn1.xirsys.com" ] }, 
        {   
          username: "0kYXFmQL9xojOrUy4VFemlTnNPVFZpp7jfPjpB3AjxahuRe4QWrCs6Ll1vDc7TTjAAAAAGAG2whXZWJUdXRzUGx1cw==",   
          credential: "285ff060-5a58-11eb-b269-0242ac140004",   
          urls: [       
            "turn:bn-turn1.xirsys.com:80?transport=udp",       
            "turn:bn-turn1.xirsys.com:3478?transport=udp",       
            "turn:bn-turn1.xirsys.com:80?transport=tcp",       
            "turn:bn-turn1.xirsys.com:3478?transport=tcp",       
            "turns:bn-turn1.xirsys.com:443?transport=tcp",       
            "turns:bn-turn1.xirsys.com:5349?transport=tcp"   
           ]
        }
     ]};

    this.localRef = React.createRef();
    this.remoteRef = React.createRef();

    this.onInfo = this.onInfo.bind(this);
    this.launchStream = this.launchStream.bind(this);

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

    this.stop = this.stop.bind(this);
    this.stopTracks = this.stopTracks.bind(this);

    this.handleCloseClick = this.handleCloseClick.bind(this);
    this.handleToggleCameraClick = this.handleToggleCameraClick.bind(this);
    this.handleToggleMicClick = this.handleToggleMicClick.bind(this);
    this.toggleMedia = this.toggleMedia.bind(this);

    this.handleRemoteHangup = this.handleRemoteHangup.bind(this);
    this.handleVideoCallAccepted = this.handleVideoCallAccepted.bind(this);
  }

  handleVideoCallAccepted(info) { 
    const pc = this.createPeerConnection();
    const stream = this.state.localStream;
    stream.getTracks().forEach(track => pc.addTrack(track, stream));
    console.log('RtcPanel: info msg', info);
  }

  onInfo(info) {
    console.log('info --> ', info);
    if (info.what != 'call') {
      return;
    }
    switch (info.event) {
      //case 'invite'
      case 'accept':
        // Call accepted.
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

  componentDidUpdate(props) {
    const topic = this.props.topic;
    if (this.onInfo != topic.onInfo) {
      this.previousOnInfo = topic.onInfo;
      topic.onInfo = this.onInfo;
    }
  }

  componentDidMount() {
    if ((this.props.callState == 1 || this.props.callState == 3) && this.localRef.current) {
      this.launchStream();
    }
  }

  componentWillUnmount() {
    this.props.topic.onInfo = this.previousOnInfo;
    this.stop();
  }

  launchStream() {
    if (this.state.localStream) {
      console.log("You can't start a call because you already have one open!");
    } else {
      navigator.mediaDevices.getUserMedia(this.localStreamConstraints)
      .then(stream => {
        console.log('Adding local stream.', this.localRef.current);
        this.setState({localStream: stream});
        this.localRef.current.srcObject = stream;
        // Send call invitation (or accept call).
        this.props.onInvite(this.props.topic.name, this.props.seq, this.props.callState);
      })
      .catch(this.handleGetUserMediaError);
    }
  }

  createPeerConnection() {
    var pc = new RTCPeerConnection(this.pcConfig);

    pc.onicecandidate = this.handleICECandidateEvent;
    pc.oniceconnectionstatechange = this.handleICEConnectionStateChangeEvent;
    pc.onicegatheringstatechange = this.handleICEGatheringStateChangeEvent;
    pc.onsignalingstatechange = this.handleSignalingStateChangeEvent;
    pc.onnegotiationneeded = this.handleNegotiationNeededEvent;
    pc.ontrack = this.handleTrackEvent;

    this.setState({pc: pc});
    console.log('Created RTCPeerConnnection');
    return pc;
  }

  handleVideoAnswerMsg(info) {
    console.log("*** Call recipient has accepted our call");
  
    // Configure the remote description, which is the SDP payload
    // in our "video-answer" message.
  
    var desc = new RTCSessionDescription(info.payload);
    this.state.pc.setRemoteDescription(desc).catch(this.reportError);
  }

  reportError(errMessage) {
    console.log(`Error ${errMessage.name}: ${errMessage.message}`);
  }

  handleNegotiationNeededEvent() {
    this.state.pc.createOffer().then(offer => {
      return this.state.pc.setLocalDescription(offer);
    })
    .then(() => {
      this.props.onSendOffer(this.props.topic.name, this.props.seq, this.state.pc.localDescription.toJSON());
    })
    .catch(reportError);
  }

  handleICECandidateEvent(event) {
    if (event.candidate) {
      this.props.onIceCandidate(this.props.topic.name, this.props.seq, event.candidate.toJSON());
    }
  }

  handleNewICECandidateMsg(info) {
    var candidate = new RTCIceCandidate(info.payload);
  
    this.state.pc.addIceCandidate(candidate)
      .catch(reportError);
  }

  handleICEConnectionStateChangeEvent(event) {
    switch (this.state.pc.iceConnectionState) {
      case "closed":
      case "failed":
        this.handleCloseClick();
        break;
    }
  }

  handleSignalingStateChangeEvent(event) {
    switch (this.state.pc.signalingState) {
      case "closed":
        this.handleCloseClick();
        break;
    }
  }

  handleICEGatheringStateChangeEvent(event) {
    // Our sample just logs information to console here,
    // but you can do whatever you need.
  }

  handleTrackEvent(event) {
    this.remoteRef.current.srcObject = event.streams[0];
  }

  handleGetUserMediaError(e) {
    console.log('-->', e);
    switch(e.name) {
      case "NotFoundError":
        console.log("Unable to open your call because no camera and/or microphone" +
              "were found.");
        break;
      case "SecurityError":
      case "PermissionDeniedError":
        // Do nothing; this is the same as the user canceling the call.
        break;
      default:
        console.log("Error opening your camera and/or microphone: " + e.message);
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
  
      localStream.getTracks().forEach(track => pc.addTrack(track, localStream));
    })
    .then(() => {
      return pc.createAnswer();
    })
    .then(answer => {
      return pc.setLocalDescription(answer);
    })
    .then(() => {
      this.props.onSendAnswer(this.props.topic.name, this.props.seq, pc.localDescription.toJSON());
    })
    .catch(this.handleGetUserMediaError);
  }

  handleRemoteHangup() {
    this.handleCloseClick();
  }

  stopTracks(el) {
    //let lr = this.localRef.current;
    if (el == null) { return; }
    let stream = el.srcObject;
    if (stream == null) { return; }
    let tracks = stream.getTracks();

    if (tracks != null) {
      tracks.forEach(function(track) {
        track.stop();
      });
    }
    el.srcObject = null;
  }

  stop() {
    this.stopTracks(this.localRef.current);
    this.stopTracks(this.remoteRef.current);
    if (this.state.pc != null) {
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
    this.setState({isStarted: false, isChannelReady: false, isInitiator: false, pc: null});
  }

  handleCloseClick() {
    this.stop();
    this.props.onHangup(this.props.topic.name, this.props.seq);

    this.props.onClose();
  }

  toggleMedia(kind) {
    const video = this.localRef.current;

    // A video's MediaStream object is available through its srcObject attribute
    const mediaStream = video.srcObject;

    // Through the MediaStream, you can get the MediaStreamTracks with getTracks():
    const tracks = mediaStream.getTracks();

    // Or stop all like so:
    tracks.forEach(track => {
      if (track.kind == kind) {
        track.stop();
      }
    });
  }

  handleToggleCameraClick() {
    this.toggleMedia('video');
  }

  handleToggleMicClick() {
    this.toggleMedia('audio');
  }

  render() {
    if (!this.props.topic) {
      return null;
    }

    return (
      <div className="h-100" id="video_display">
      	<div id ="video_container" className="align-items-center" style={{marginTop: "10%"}}>
      		<div className="local_div" id="div1">
			      <video id="localVideo" className="" ref={this.localRef} autoPlay muted playsInline></video>
		      </div>
		      <div className="remote_div" id="div2">
			      <video id="remoteVideo" className="" ref={this.remoteRef} autoPlay playsInline></video>
		      </div>
    	  </div>
        <div id="close" style={{padding: "20px", textAlign: "center"}}>
          <button onClick={this.handleCloseClick} style={{borderRadius: "10px", backgroundColor: "red"}}>
            <i className="material-icons">call_end</i>
          </button>
          <button onClick={this.handleToggleCameraClick} style={{borderRadius: "10px", backgroundColor: "gray"}}><i className="material-icons">video_camera_front</i></button>
          <button onClick={this.handleToggleMicClick} style={{borderRadius: "10px", backgroundColor: "gray"}}><i className="material-icons">mic</i></button>
        </div>
        <script src="https://webrtc.github.io/adapter/adapter-latest.js"></script>
      </div>
    );
  }
};

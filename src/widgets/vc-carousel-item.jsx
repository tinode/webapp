// Video conference carousel item.
import React from 'react';

import LetterTile from './letter-tile.jsx';

export default class VCCarouselItem extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      videoRef: undefined,
      audioRef: undefined
    };

    this.handleVideoRefChange = this.handleVideoRefChange.bind(this);
    this.handleAudioRefChange = this.handleAudioRefChange.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.state.videoRef && !this.state.videoRef.srcObject && this.props.cameraPub && this.props.cameraPub.videoTrack) {
      this.props.cameraPub.videoTrack.attach(this.state.videoRef);
    }
    if (this.state.audioRef && !this.state.audioRef.srcObject && this.props.micPub && this.props.micPub.audioTrack) {
      this.props.micPub.audioTrack.attach(this.state.audioRef);
    }
  }

  handleVideoRefChange(node) {
    if (!node) { return; }
    this.setState({videoRef: node});

    // Attach video track to video element.
    const cameraPub = this.props.cameraPub;
    const cameraEnabled = cameraPub && cameraPub.isSubscribed && !cameraPub.isMuted;
    if (cameraEnabled && cameraPub.videoTrack) {
      cameraPub.videoTrack.attach(node);
    }
  }

  handleAudioRefChange(node) {
    if (!node) { return; }
    this.setState({audioRef: node});

    // Attach audio track to audio element.
    const micPub = this.props.micPub;
    const micEnabled = micPub && micPub.isSubscribed && !micPub.isMuted;
    if (micEnabled && this.state.audioTrack) {
      this.state.audioTrack.attach(node);
    }
  }

  render() {
    let classes = 'call-party carousel-item';
    if (this.props.isSpeaking) {
      classes += ' call-party-speaking';
    }

    const micPub = this.props.micPub;
    const cameraPub = this.props.cameraPub;
    return (
      <div className={classes}>
        <>
          <video ref={this.handleVideoRefChange}></video>
          <audio ref={this.handleAudioRefChange}></audio>
          {micPub && micPub.isMuted ?
            <i className="material-icons muted">mic_off</i>
            : null
          }
          {cameraPub && cameraPub.isMuted ?
            <>
              <div className="avatar-box carousel-item">
                <LetterTile
                  tinode={this.props.tinode}
                  avatar={this.props.photo}
                  topic={this.props.identity}
                  title={this.props.name} />
              </div>
            </>
            : null}
          <div className="caller-name inactive">
            {this.props.name}
          </div>
        </>
      </div>
    );
  }
}

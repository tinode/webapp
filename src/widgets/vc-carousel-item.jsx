// Video conference carousel item.
import React from 'react';

import LetterTile from './letter-tile.jsx';

/**
 * Props:
 *  - cameraPub
 *  - micPub
 *  - isSpeaking
 *  - tinode
 *  - photo
 *  - userId
 *  - name
 */
export default class VCCarouselItem extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleVideoRefChange = this.handleVideoRefChange.bind(this);
    this.handleAudioRefChange = this.handleAudioRefChange.bind(this);

    this.videoRef = null;
    this.audioRef = null;
  }

  componentDidUpdate(prevProps) {
    if (this.videoRef && !this.videoRef.srcObject && this.props.cameraPub && this.props.cameraPub.videoTrack) {
      this.props.cameraPub.videoTrack.attach(this.videoRef);
    }
    if (this.audioRef && !this.audioRef.srcObject && this.props.micPub && this.props.micPub.audioTrack) {
      this.props.micPub.audioTrack.attach(this.audioRef);
    }
  }

  handleVideoRefChange(node) {
    if (!node) {
      return;
    }

    this.videoRef = node;

    // Attach video track to video element.
    const cameraPub = this.props.cameraPub;
    const cameraEnabled = cameraPub && cameraPub.isSubscribed && !cameraPub.isMuted;
    if (cameraEnabled && cameraPub.videoTrack) {
      cameraPub.videoTrack.attach(node);
    }
  }

  handleAudioRefChange(node) {
    if (!node) {
      return;
    }

    this.audioRef = node;

    // Attach audio track to audio element.
    const micPub = this.props.micPub;
    const micEnabled = micPub && micPub.isSubscribed && !micPub.isMuted;
    if (micEnabled && micPub.audioTrack) {
      micPub.audioTrack.attach(node);
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
        <video ref={this.handleVideoRefChange}></video>
        <audio ref={this.handleAudioRefChange}></audio>
        {micPub && micPub.isMuted ?
          <i className="material-icons muted">mic_off</i>
          : null
        }
        {cameraPub && cameraPub.isMuted ?
          <div className="avatar-box">
            <LetterTile
              tinode={this.props.tinode}
              avatar={this.props.photo || true}
              topic={this.props.userId}
              title={this.props.name} />
          </div>
          : null}
        <div className="caller-name inactive">
          {this.props.name}
        </div>
      </div>
    );
  }
}

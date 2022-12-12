// IncomingCall: displays Accept & Reject buttons for incoming calls.
import React from 'react';

import BadgeList from './badge-list.jsx';
import LetterTile from './letter-tile.jsx';

import { MAX_TITLE_LENGTH, MAX_PEER_TITLE_LENGTH } from '../config.js';
import { CALL_STATE_INCOMING_RECEIVED } from '../constants.js';

import { makeImageUrl } from '../lib/blob-helpers.js';
import { clipStr } from '../lib/utils.js'

const RING_SOUND = new Audio('audio/call-in.m4a');

export default class CallIncoming extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      topic: null,
      fullName: undefined,
      avatar: null,
      trustedBadges: [],
      previousMetaDesc: undefined,
    };

    this.resetDesc = this.resetDesc.bind(this);
    this.onMetaDesc = this.onMetaDesc.bind(this);
    this.handleRejectCall = this.handleRejectCall.bind(this);
    this.handleAcceptCall = this.handleAcceptCall.bind(this);
    this.ringTimer = null;
  }

  componentDidMount() {
    const topic = this.props.tinode.getTopic(this.props.topic);
    if (!topic) {
      return;
    }

    this.resetDesc(topic);
    if (this.props.callState == CALL_STATE_INCOMING_RECEIVED) {
      // play() throws if the user did not click the app first: https://goo.gl/xX8pDD.
      RING_SOUND.play().catch(_ => {});
      this.ringTimer = setInterval(_ => {RING_SOUND.play().catch(_ => {})}, 2000);
      this.props.onRinging(this.props.topic, this.props.seq);
    }
  }

  // No need to separately handle component mount.
  componentDidUpdate(props) {
    const topic = this.props.tinode.getTopic(props.topic);
    if (!topic) {
      return;
    }

    if (this.onMetaDesc != topic.onMetaDesc) {
      this.previousMetaDesc = topic.onMetaDesc;
      topic.onMetaDesc = this.onMetaDesc;
    }

    if (this.state.topic != props.topic) {
      this.setState({topic: props.topic});
      this.resetDesc(topic, props);
    }
  }

  componentWillUnmount() {
    if (this.ringTimer != null) {
      clearInterval(this.ringTimer);
      RING_SOUND.pause();
    }
    const topic = this.props.tinode.getTopic(this.props.topic);
    if (!topic) {
      return;
    }
    this.setState({topic: null});
    topic.onMetaDesc = this.previousMetaDesc;
  }

  resetDesc(topic) {
    const badges = [];
    if (topic.trusted) {
      for (const [key, val] of Object.entries(topic.trusted)) {
        if (val) {
          badges.push(key);
        }
      }
    }

    this.setState({
      fullName: clipStr(topic.public ? topic.public.fn : undefined, MAX_TITLE_LENGTH),
      avatar: makeImageUrl(topic.public ? topic.public.photo : null),
      trustedBadges: badges,
    });
  }

  onMetaDesc(desc) {
    const topic = this.props.tinode.getTopic(this.props.topic);
    if (!topic) {
      return;
    }
    this.resetDesc(topic);

    if (this.previousMetaDesc && this.previousMetaDesc != this.onMetaDesc) {
      this.previousMetaDesc(desc);
    }
  }

  handleAcceptCall() {
    this.props.onAcceptCall(this.props.topic);
  }

  handleRejectCall() {
    this.props.onReject(this.props.topic, this.props.seq);
    this.props.onClose();
  }

  render() {
    return (
      <div className="alert-container">
        <div className="incoming-call">
          <div className="caller-card incoming pulse">
            <div className="avatar-box">
              <LetterTile
                tinode={this.props.tinode}
                avatar={this.state.avatar || true}
                topic={this.props.topic}
                title={this.state.fullName} />
            </div>
            <div className="caller-name">{clipStr(this.state.fullName, MAX_PEER_TITLE_LENGTH)}
              <BadgeList short={true} trustedBadges={this.state.trustedBadges} /></div>
          </div>
          <div className="controls">
            {this.props.callState == CALL_STATE_INCOMING_RECEIVED ?
              <>
                <button className="danger" onClick={this.handleRejectCall}>
                  <i className="material-icons">call_end</i>
                </button>
                <button className="positive" onClick={this.handleAcceptCall}>
                  <i className="material-icons">call</i>
                </button>
              </>
              :
              null
            }
          </div>
        </div>
      </div>
    );
  }
};

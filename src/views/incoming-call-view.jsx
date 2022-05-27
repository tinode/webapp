// IncomingCallView: displays Accept & Reject buttons for incoming calls.
import React from 'react';
import { FormattedMessage } from 'react-intl';

import AvatarUpload from '../widgets/avatar-upload.jsx';
import BadgeList from '../widgets/badge-list.jsx';
import MenuCancel from '../widgets/menu-cancel.jsx';

import { MAX_TITLE_LENGTH } from '../config.js';
import { CALL_STATE_INCOMING_RECEIVED } from '../constants.js';

import { makeImageUrl } from '../lib/blob-helpers.js';
import { clipStr } from '../lib/utils.js'

const RING_SOUND = new Audio('audio/call-in.mp3');

export default class IncomingCallView extends React.Component {
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
    this.resetDesc(topic, this.props);
    if (this.props.callState == CALL_STATE_INCOMING_RECEIVED) {
      RING_SOUND.play();
      this.ringTimer = setInterval(() => RING_SOUND.play(), 2000);
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

  resetDesc(topic, props) {
    const defacs = topic.getDefaultAccess() || {};
    const acs = topic.getAccessMode();
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
    this.resetDesc(topic, this.props);

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
    let panelTitle = <FormattedMessage id="calls_incoming_title"
        defaultMessage="Incoming Call" description="Incoming call title (Incoming call view)" />;

    return (
      <div id="info-view">
        <div className="caption-panel" id="info-caption-panel">
          <div className="panel-title" id="info-title">{panelTitle}</div>
          <div>
            <MenuCancel onCancel={this.handleRejectCall} />
          </div>
        </div>
        <div id="info-view-content" className="scrollable-panel">
          <div className="panel-form-column">
            <center>
              <AvatarUpload
                tinode={this.props.tinode}
                avatar={this.state.avatar}
                readOnly={true}
                uid={this.props.topic}
                title={this.state.fullName} />
            </center>
            <div className="group incoming-call-title">
              <div className="large ellipsized">{clipStr(this.state.fullName)}</div>
            </div>
            <div className="group incoming-call-badges">
              <BadgeList trustedBadges={this.state.trustedBadges} />
            </div>
            <div id="actions" className="group incoming-call-actions">
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
      </div>
    );
  }
};

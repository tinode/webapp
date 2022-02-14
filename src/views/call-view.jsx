// InfoView: panel with topic/user info.
import React from 'react';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';

import Tinode from 'tinode-sdk';

import AvatarUpload from '../widgets/avatar-upload.jsx';
import BadgeList from '../widgets/badge-list.jsx';
import MenuCancel from '../widgets/menu-cancel.jsx';

import { MAX_TITLE_LENGTH, MAX_TOPIC_DESCRIPTION_LENGTH, NO_ACCESS_MODE } from '../config.js';

import { makeImageUrl } from '../lib/blob-helpers.js';
import { arrayEqual, theCard } from '../lib/utils.js';

function _clip(str, length) {
  return str && str.substring(0, length);
}

class CallView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      topic: null,
      fullName: undefined,
      avatar: null,
      trustedBadges: [],
      previousMetaDesc: undefined,
      offerSent: false,
    };

    this.resetDesc = this.resetDesc.bind(this);
    this.onMetaDesc = this.onMetaDesc.bind(this);
    this.handleRejectCall = this.handleRejectCall.bind(this);
    this.handleAcceptCall = this.handleAcceptCall.bind(this);
  }

  componentDidMount() {
    const topic = this.props.tinode.getTopic(this.props.topic);
    if (!topic) {
      return;
    }
    this.resetDesc(topic, this.props);
    if (this.props.callState == 2) {
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
      fullName: _clip(topic.public ? topic.public.fn : undefined, MAX_TITLE_LENGTH),
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
    const {formatMessage} = this.props.intl;
    let panelTitle = 'Unknown';
    switch (this.props.callState) {
      case 1:
        panelTitle = 'Calling';
        break;
      case 2:
        panelTitle = 'Incoming Call From';
        break;
      case 3:
        panelTitle = 'Call Established';
        break;
    }

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
              <div className="group" style={{padding: "10px", textAlign: "center"}}>
                <div className="large ellipsized">{this.state.fullName}</div>
              </div>
              <div className="group" style={{textAlign: "center"}}>
                <BadgeList trustedBadges={this.state.trustedBadges} />
              </div>
              <div id="actions" className="group" style={{padding: "20px", textAlign: "center"}}>
                {this.props.callState >= 1 && this.props.callState < 3 ?
                  <button onClick={this.handleRejectCall} style={{borderRadius: "10px", backgroundColor: "red"}}>
                    <i className="material-icons">call_end</i>
                  </button>
                  :
                  null
                }
                {this.props.callState >= 2 && this.props.callState < 3 ?
                  <button onClick={this.handleAcceptCall} style={{borderRadius: "10px", backgroundColor: "green"}}>
                    <i className="material-icons">call</i>
                  </button>
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

export default injectIntl(CallView);

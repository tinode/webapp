// View for editing topic (including 'me' topic) parameters.

import React from 'react';
import { FormattedMessage } from 'react-intl';

import Tinode from 'tinode-sdk';

import AvatarUpload from '../widgets/avatar-upload.jsx';
import InPlaceEdit from '../widgets/in-place-edit.jsx';
import TagManager from '../widgets/tag-manager.jsx';
import TopicDescEdit from '../widgets/topic-desc-edit.jsx';

import { AVATAR_SIZE, MAX_AVATAR_BYTES, MAX_EXTERN_ATTACHMENT_SIZE,
  MAX_INBAND_ATTACHMENT_SIZE, MAX_TITLE_LENGTH } from '../config.js';
import { imageScaled, blobToBase64, makeImageUrl } from '../lib/blob-helpers.js';
import { arrayEqual, asEmail, asPhone, theCard } from '../lib/utils.js';

export default class TopicCommonView extends React.Component {
  constructor(props) {
    super(props);

    const topic = this.props.tinode.getTopic(this.props.topic);
    const acs = topic.getAccessMode();
    this.state = {
      isMe: this.props.tinode.isMe(this.props.topic),
      owner: acs && acs.isOwner(),
      credentials: topic.getCredentials() || [],
      addCredActive: false,
      addCredInvalid: false
    };

    this.tnCredsUpdated = this.tnCredsUpdated.bind(this);
    this.handleCredChange = this.handleCredChange.bind(this);
    this.handleCredKeyDown = this.handleCredKeyDown.bind(this);
    this.handleCredEntered = this.handleCredEntered.bind(this);
  }

  componentDidMount() {
    const topic = this.props.tinode.getTopic(this.props.topic);
    topic.onCredsUpdated = this.tnCredsUpdated;
  }

  componentWillUnmount() {
    const topic = this.props.tinode.getTopic(this.props.topic);
    topic.onCredsUpdated = undefined;
  }

  tnCredsUpdated(creds) {
    this.setState({credentials: creds || []});
  }

  handleCredChange(e) {
    this.setState({newCred: e.target.value, addCredInvalid: false});
  }

  handleCredKeyDown(e) {
    if (e.keyCode === 27) {
      // Escape pressed
      this.setState({newCred: '', addCredActive: false});
    } else if (e.keyCode === 13) {
      // Enter pressed
      this.handleCredEntered(e);
    }
  }

  handleCredEntered(e) {
    let value = this.state.newCred.trim();
    if (!value) {
      this.setState({addCredActive: false, addCredInvalid: false});
      return;
    }

    let val = asPhone(value);
    let method;
    if (val) {
      method = 'tel';
    } else {
      val = asEmail(value);
      if (val) {
        method = 'email';
      }
    }
    if (method) {
      this.props.onCredAdd(method, val);
      this.setState({addCredActive: false, newCred: ''});
    } else {
      this.setState({addCredInvalid: true});
    }
  }

  render() {
    const credentials = [];
    if (this.state.isMe) {
      this.state.credentials.map((cred) => {
        credentials.push(<div key={cred.meth + ":" + cred.val + ":" + cred.done}>{cred.meth}: <tt>{cred.val}</tt>
          <span > {!cred.done ?
            <a href="#" onClick={(e) => {e.preventDefault(); this.props.onCredConfirm(cred.meth, cred.val);}}>
                <FormattedMessage id="validate_credential_action" defaultMessage="confirm"
                  description="Validate credentail call to action" />
              </a>
            : null} <a href="#" onClick={(e) => {e.preventDefault(); this.props.onCredDelete(cred.meth, cred.val);}}><i
              className="material-icons gray">delete_outline</i></a></span></div>);
      });
    }

    return (
      <div className="scrollable-panel">
        <TopicDescEdit
          tinode={this.props.tinode}
          topic={this.props.topic}
          onUpdateTopicDesc={this.props.onUpdateTopicDesc}
          onUpdateTags={this.props.onUpdateTags}
          onError={this.props.onError} />
        {this.state.isMe ?
          <>
            <div className="hr" />
            <div className="panel-form-column">
              <label className="small">
                <FormattedMessage id="label_user_contacts" defaultMessage="Contacts:"
                description="Label for user contacts" />
              </label>
              <div className="quoted">
                {credentials}
                {this.state.addCredActive ?
                  <input type="text" value={this.state.value}
                    className={this.state.addCredInvalid ? 'invalid' : null}
                    placeholder="Phone number or email" required="required" autoFocus
                    onChange={this.handleCredChange} onKeyDown={this.handleCredKeyDown} onBlur={this.handleCredEntered} />
                  : null}
                <div>
                  <a href="#" onClick={(e) => {e.preventDefault(); this.setState({addCredActive: true});}}>
                    <i className="material-icons">add</i>
                    <FormattedMessage id="button_add_another" defaultMessage="Add another" description="Call to action [+ add another]" />
                  </a></div>
              </div>
            </div>
          </>
        : null
      }
      </div>
    );
  }
};

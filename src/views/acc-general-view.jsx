// Edit account parameters.
import React from 'react';
import { FormattedMessage } from 'react-intl';

import Tinode from 'tinode-sdk';

import AvatarUpload from '../widgets/avatar-upload.jsx';
import InPlaceEdit from '../widgets/in-place-edit.jsx';
import TagManager from '../widgets/tag-manager.jsx';

import { MAX_TITLE_LENGTH } from '../config.js';
import { makeImageDataUrl } from '../lib/blob-helpers.js';
import { arrayEqual, asEmail, asPhone, theCard } from '../lib/utils.js';

export default class AccGeneralView extends React.Component {
  constructor(props) {
    super(props);

    const me = this.props.tinode.getMeTopic();
    this.state = {
      fullName: me.public ? me.public.fn : undefined,
      avatar: makeImageDataUrl(me.public ? me.public.photo : null),
      tags: me.tags(),
      credentials: me.getCredentials() || [],
      addCredActive: false,
      addCredInvalid: false,
      newCred: '',
      previousOnTags: me.onTagsUpdated
    };

    this.tnNewTags = this.tnNewTags.bind(this);
    this.tnCredsUpdated = this.tnCredsUpdated.bind(this);
    this.handleFullNameUpdate = this.handleFullNameUpdate.bind(this);
    this.handleImageChanged = this.handleImageChanged.bind(this);
    this.handleCredChange = this.handleCredChange.bind(this);
    this.handleCredKeyDown = this.handleCredKeyDown.bind(this);
    this.handleCredEntered = this.handleCredEntered.bind(this);
    this.handleTagsUpdated = this.handleTagsUpdated.bind(this);
  }

  componentDidMount() {
    const me = this.props.tinode.getMeTopic();
    me.onCredsUpdated = this.tnCredsUpdated;
    me.onTagsUpdated = this.tnNewTags;
  }

  componentWillUnmount() {
    const me = this.props.tinode.getMeTopic();
    me.onTagsUpdated = this.state.previousOnTags;
    me.onCredsUpdated = undefined;
  }

  tnNewTags(tags) {
    this.setState({tags: tags});
  }

  tnCredsUpdated(creds) {
    this.setState({credentials: creds || []});
  }

  handleFullNameUpdate(fn) {
    fn = fn.trim().substring(0, MAX_TITLE_LENGTH);
    if (fn) {
      this.setState({fullName: fn});
      this.props.onUpdateAccount(undefined, theCard(fn, null));
    }
  }

  handleImageChanged(img) {
    this.setState({avatar: img});
    this.props.onUpdateAccount(undefined, theCard(null, img || Tinode.DEL_CHAR));
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

  handleTagsUpdated(tags) {
    // Check if tags have actually changed.
    if (arrayEqual(this.state.tags.slice(0), tags.slice(0))) {
      return;
    }
    this.props.onUpdateTags(tags);
  }

  render() {
    const credentials = [];
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

    return (
      <div className="scrollable-panel">
        <div className="panel-form-row">
          <div className="panel-form-column">
            <label className="small"><FormattedMessage id="label_your_name" defaultMessage="Your name"
              description="Label for full name editing" /></label>
            <div><FormattedMessage id="full_name_prompt" defaultMessage="Full name, e.g. John Doe"
              description="Input placeholder for person's full name">{
              (full_name_placeholder) => <InPlaceEdit
                placeholder={full_name_placeholder}
                value={this.state.fullName}
                onFinished={this.handleFullNameUpdate} />
            }</FormattedMessage></div>
          </div>
          <AvatarUpload
            avatar={this.state.avatar}
            uid={this.props.myUserId}
            title={this.state.fullName}
            onImageChanged={this.handleImageChanged}
            onError={this.props.onError} />
        </div>
        <div className="hr" />
        <FormattedMessage id="title_tag_manager" defaultMessage="Tags (user discovery)"
          description="Section title for TagManager">{
          (title_tag_manager) => <TagManager
            title={title_tag_manager}
            activated={false}
            tags={this.state.tags}
            tinode={this.props.tinode}
            onSubmit={this.handleTagsUpdated} />
        }</FormattedMessage>
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
      </div>
    );
  }
};

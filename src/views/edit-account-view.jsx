// Edit account parameters.
import React from 'react';
import { FormattedMessage } from 'react-intl';

import Tinode from 'tinode-sdk';

import AvatarUpload from '../widgets/avatar-upload.jsx';
import CheckBox from '../widgets/checkbox.jsx';
import InPlaceEdit from '../widgets/in-place-edit.jsx';
import PermissionsEditor from '../widgets/permissions-editor.jsx';
import TagManager from '../widgets/tag-manager.jsx';

import { LINK_CONTACT_US, LINK_PRIVACY_POLICY, LINK_TERMS_OF_SERVICE, MAX_TITLE_LENGTH } from '../config.js';
import { makeImageUrl } from '../lib/blob-helpers.js';
import { arrayEqual, asEmail, asPhone, vcard } from '../lib/utils.js';

export default class EditAccountView extends React.Component {
  constructor(props) {
    super(props);

    const me = this.props.tinode.getMeTopic();
    const defacs = me.getDefaultAccess();
    this.state = {
      fullName: me.public ? me.public.fn : undefined,
      avatar: makeImageUrl(me.public ? me.public.photo : null),
      auth: defacs ? defacs.auth : null,
      anon: defacs ? defacs.anon : null,
      tags: me.tags(),
      credentials: me.getCredentials() || [],
      addCredActive: false,
      addCredInvalid: false,
      newCred: '',
      showPermissionEditorFor: undefined,
      previousOnTags: me.onTagsUpdated
    };

    this.tnNewTags = this.tnNewTags.bind(this);
    this.tnCredsUpdated = this.tnCredsUpdated.bind(this);
    this.handleFullNameUpdate = this.handleFullNameUpdate.bind(this);
    this.handlePasswordUpdate = this.handlePasswordUpdate.bind(this);
    this.handleImageChanged = this.handleImageChanged.bind(this);
    this.handleCheckboxClick = this.handleCheckboxClick.bind(this);
    this.handleCredChange = this.handleCredChange.bind(this);
    this.handleCredKeyDown = this.handleCredKeyDown.bind(this);
    this.handleCredEntered = this.handleCredEntered.bind(this);
    this.handleLaunchPermissionsEditor = this.handleLaunchPermissionsEditor.bind(this);
    this.handleHidePermissionsEditor = this.handleHidePermissionsEditor.bind(this);
    this.handlePermissionsChanged = this.handlePermissionsChanged.bind(this);
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
      this.props.onUpdateAccount(undefined, vcard(fn, null));
    }
  }

  handlePasswordUpdate(pwd) {
    this.setState({password: pwd});
    this.props.onUpdateAccount(pwd);
  }

  handleImageChanged(img) {
    this.setState({avatar: img});
    this.props.onUpdateAccount(undefined, vcard(null, img || Tinode.DEL_CHAR));
  }

  handleCheckboxClick(what, checked) {
    if (what == 'sound') {
      this.props.onToggleMessageSounds(checked);
    } else if (what == 'alert') {
      this.props.onTogglePushNotifications(checked);
    }
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

  handleLaunchPermissionsEditor(which) {
    this.setState({
      showPermissionEditorFor: which,
      editedPermissions: this.state[which]
    });
  }

  handleHidePermissionsEditor() {
    this.setState({showPermissionEditorFor: undefined});
  }

  handlePermissionsChanged(perm) {
    let defacs = {};
    defacs[this.state.showPermissionEditorFor] = perm;
    this.props.onUpdateAccount(undefined, undefined, defacs);

    let newState = {showPermissionEditorFor: undefined};
    newState[this.state.showPermissionEditorFor] = perm;
    this.setState(newState);
  }

  handleTagsUpdated(tags) {
    // Check if tags have actually changed.
    if (arrayEqual(this.state.tags.slice(0), tags.slice(0))) {
      return;
    }
    this.props.onUpdateTags(tags);
  }

  render() {
    let credentials = [];
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
      <React.Fragment>{this.state.showPermissionEditorFor ?
        <PermissionsEditor
          mode={this.state.editedPermissions}
          skip="O"
          onSubmit={this.handlePermissionsChanged}
          onCancel={this.handleHidePermissionsEditor} />
        :
        <div id="edit-account" className="scrollable-panel">
          <div className="panel-form-row">
            <div className="panel-form-column">
              <div><label className="small">
                <FormattedMessage id="label_your_name" defaultMessage="Your name"
                  description="Label for full name editing" />
              </label></div>
              <div><FormattedMessage id="full_name_prompt">{
                (full_name_placeholder) => <InPlaceEdit
                  placeholder={full_name_placeholder}
                  value={this.state.fullName}
                  onFinished={this.handleFullNameUpdate} />
              }</FormattedMessage></div>
              <div><label className="small">
                <FormattedMessage id="label_password" defaultMessage="Password"
                  description="Label for password editing" />
              </label></div>
              <div>
                <FormattedMessage id="password_unchanged_prompt" defaultMessage="Unchanged"
                  description="Message in editor while password is unchanged">{
                  (password_unchanged) => <InPlaceEdit
                    placeholder={password_unchanged}
                    type="password"
                    onFinished={this.handlePasswordUpdate} />
                }</FormattedMessage>
              </div>
            </div>
            <AvatarUpload
              avatar={this.state.avatar}
              uid={this.props.myUserId}
              title={this.state.fullName}
              onImageChanged={this.handleImageChanged}
              onError={this.props.onError} />
          </div>
          <div className="hr" />
          <div className="panel-form-row">
            <label htmlFor="message-sound">
              <FormattedMessage id="label_message_sound" defaultMessage="Message sound:"
                description="Label for message sounds toggle" />
            </label>
            <CheckBox name="sound" id="message-sound"
              checked={this.props.messageSounds}
              onChange={this.handleCheckboxClick} />
          </div>
          <div className="panel-form-row">
            <label htmlFor="desktop-alerts">
            {this.props.desktopAlertsEnabled ?
              <FormattedMessage id="label_push_notifications" defaultMessage="Notification alerts:"
                description="Label for push notifications switch" />
              :
              <FormattedMessage id="label_push_notifications_disabled"
                defaultMessage="Notification alerts (requires HTTPS):"
                description="Label for push notifications switch" />
            }
            </label>
            <CheckBox name="alert" id="desktop-alerts"
              checked={this.props.desktopAlerts}
              onChange={this.props.desktopAlertsEnabled ? this.handleCheckboxClick : null} />
          </div>
          <div className="hr" />
          <FormattedMessage id="title_tag_manager" defaultMessage="Tags (user discovery)"
            description="Section title for TagManager">{
            (title_tag_manager) => <TagManager
              title={title_tag_manager}
              activated={false}
              tags={this.state.tags}
              onSubmit={this.handleTagsUpdated} />
          }</FormattedMessage>
          <div className="hr" />
          <div className="panel-form-column">
            <div>
              <label className="small">
                <FormattedMessage id="label_user_contacts" defaultMessage="Contacts:"
                description="Label for user contacts" />
              </label>
            </div>
            <div className="quoted">
              {credentials}
              {this.state.addCredActive ?
                <input type="text" value={this.state.value}
                  className={this.state.addCredInvalid ? "invalid" : null}
                  placeholder="Phone number or email" required="required" autoFocus
                  onChange={this.handleCredChange} onKeyDown={this.handleCredKeyDown} onBlur={this.handleCredEntered} />
                : null}
              <div><a href="#" onClick={(e) => {e.preventDefault(); this.setState({addCredActive: true});}}>+ Add another</a></div>
            </div>
          </div>
          <div className="hr" />
          <div className="panel-form-column">
            <div className="panel-form-row">
              <label className="small"><FormattedMessage id="label_user_id" defaultMessage="Address:"
                description="Label for user address (ID)" /></label>
              <tt>{this.props.myUserId}</tt>
            </div>
            <div>
              <label className="small">
                <FormattedMessage id="label_default_access_mode" defaultMessage="Default access mode:"
                description="Label for default access mode" />
              </label>
            </div>
            <div className="quoted">
              <div>Auth: <tt className="clickable"
                onClick={this.handleLaunchPermissionsEditor.bind(this, 'auth')}>{this.state.auth}</tt></div>
              <div>Anon: <tt className="clickable"
                onClick={this.handleLaunchPermissionsEditor.bind(this, 'anon')}>{this.state.anon}</tt></div>
            </div>
          </div>
          <div className="hr" />
          <div className="panel-form-column">
            <a href="#" className="red flat-button" onClick={(e) => {e.preventDefault(); this.props.onLogout();}}>
              <i className="material-icons">exit_to_app</i> &nbsp;<FormattedMessage id="button_logout"
                defaultMessage="Logout" description="Button [Logout]" />
            </a>
          </div>
          <div className="hr" />
          <div className="panel-form-column">
            <div>
              <label className="small">
                <FormattedMessage id="label_legal" defaultMessage="Legal"
                description="Section label" />
              </label>
            </div>
            <div className="quoted">
              <a href={LINK_CONTACT_US} className="flat-button" target="_blank">
                <i className="material-icons">email</i> &nbsp;<FormattedMessage id="link_contact_us"
                  defaultMessage="Contact Us" description="Ancor text for contacting us by email" />
              </a>
            </div>
            <div className="quoted">
              <a href={LINK_TERMS_OF_SERVICE} className="flat-button" target="_blank">
                <i className="material-icons">description</i> &nbsp;<FormattedMessage id="link_terms_of_service"
                  defaultMessage="Terms of Service" description="Ancor text for terms of service link" />
              </a>
            </div>
            <div className="quoted">
              <a href={LINK_PRIVACY_POLICY} className="flat-button" target="_blank">
                <i className="material-icons">policy</i> &nbsp;<FormattedMessage id="link_privacy_policy"
                  defaultMessage="Privacy Policy" description="Ancor text for privacy policy link" />
              </a>
            </div>
          </div>
        </div>
      }</React.Fragment>
    );
  }
};


// Edit account parameters.
import React from 'react';
import { FormattedMessage } from 'react-intl';

import AvatarUpload from '../widgets/avatar-upload.jsx';
import CheckBox from '../widgets/checkbox.jsx';
import InPlaceEdit from '../widgets/in-place-edit.jsx';
import PermissionsEditor from '../widgets/permissions-editor.jsx';
import TagManager from '../widgets/tag-manager.jsx';

import { makeImageUrl } from '../lib/blob-helpers.js';
import { vcard } from '../lib/utils.js';

export default class EditAccountView extends React.Component {
  constructor(props) {
    super(props);

    const me = this.props.tinode.getMeTopic();
    const defacs = me ? me.getDefaultAccess() : null;
    const fnd = this.props.tinode.getFndTopic();
    this.state = {
      fullName: me.public ? me.public.fn : undefined,
      avatar: makeImageUrl(me.public ? me.public.photo : null),
      auth: defacs ? defacs.auth : null,
      anon: defacs ? defacs.anon : null,
      fndSubscribed: false,
      tags: fnd.tags(),
      showPermissionEditorFor: undefined,
      previousOnTags: fnd.onTagsUpdated
    };

    this.tnNewTags = this.tnNewTags.bind(this);
    this.handleFullNameUpdate = this.handleFullNameUpdate.bind(this);
    this.handlePasswordUpdate = this.handlePasswordUpdate.bind(this);
    this.handleImageChanged = this.handleImageChanged.bind(this);
    this.handleCheckboxClick = this.handleCheckboxClick.bind(this);
    this.handleLaunchPermissionsEditor = this.handleLaunchPermissionsEditor.bind(this);
    this.handleHidePermissionsEditor = this.handleHidePermissionsEditor.bind(this);
    this.handlePermissionsChanged = this.handlePermissionsChanged.bind(this);
    this.handleTagsUpdated = this.handleTagsUpdated.bind(this);
  }

  componentDidMount() {
    const fnd = this.props.tinode.getFndTopic();
    fnd.onTagsUpdated = this.tnNewTags;
    if (!fnd.isSubscribed()) {
      fnd.subscribe(fnd.startMetaQuery().withTags().build())
        .then((ctrl) => {
          this.setState({fndSubscribed: true});
        })
        .catch((err) => {
          this.props.onError(err.message, 'err');
        });
    }
  }

  componentWillUnmount() {
    const fnd = this.props.tinode.getFndTopic();
    fnd.onTagsUpdated = this.state.previousOnTags;
    if (fnd.isSubscribed() && this.state.fndSubscribed) {
      fnd.leave();
    }
  }

  tnNewTags(tags) {
    this.setState({tags: tags});
  }

  handleFullNameUpdate(fn) {
    this.setState({fullName: fn});
    this.props.onUpdateAccount(undefined, vcard(fn, null));
  }

  handlePasswordUpdate(pwd) {
    this.setState({password: pwd});
    this.props.onUpdateAccount(pwd);
  }

  handleImageChanged(img) {
    this.setState({avatar: img});
    this.props.onUpdateAccount(undefined, vcard(null, img));
  }

  handleCheckboxClick(what, checked) {
    if (what == 'sound') {
      this.props.onToggleMessageSounds(checked);
    } else if (what == 'alert') {
      this.props.onTogglePushNotifications(checked);
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
    var tags = [];
    this.state.tags.map(function(tag) {
      tags.push(<span className="badge" key={tags.length}>{tag}</span>);
    });
    if (tags.length == 0) {
      tags = <i><FormattedMessage id="tags_not_found" /></i>;
    }
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
          <div className="panel-form-column">
            <div className="panel-form-row">
              <label><FormattedMessage id="label_user_id" defaultMessage="Address:"
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
                description="Label for push notifications switch (disabled)" />
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
            <a href="javascript:;" className="red flat-button" onClick={this.props.onLogout}>
              <i className="material-icons">exit_to_app</i> <FormattedMessage id="button_logout"
                defaultMessage="Logout" description="Button [Logout]" />
            </a>
          </div>
        </div>
      }</React.Fragment>
    );
  }
};

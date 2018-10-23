import React from 'react';

import AvatarUpload from './avatar-upload.jsx';
import CheckBox from './checkbox.jsx';
import PermissionsEditor from './permissions-editor.jsx';
import TagManager from './tag-manager.jsx';

/* Edit account parameters */

export default class EditAccountView extends React.Component {
  constructor(props) {
    super(props);

    let me = this.props.tinode.getMeTopic();
    let defacs = me.getDefaultAccess();
    let fnd = this.props.tinode.getFndTopic();
    this.state = {
      fullName: me.public ? me.public.fn : undefined,
      avatar: makeImageUrl(me.public ? me.public.photo : null),
      auth: defacs ? defacs.auth : null,
      anon: defacs ? defacs.anon : null,
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
    let fnd = this.props.tinode.getFndTopic();
    fnd.onTagsUpdated = this.tnNewTags;
    if (!fnd.isSubscribed()) {
      fnd.subscribe(fnd.startMetaQuery().withLaterDesc().withTags().build()).catch((err) => {
        this.props.onError(err.message, 'err');
      });
    }
  }

  componentWillUnmount() {
    var fnd = this.props.tinode.getFndTopic();
    fnd.onTagsUpdated = this.state.previousOnTags;
  }

  tnNewTags(tags) {
    this.setState({tags: tags});
  }

  handleFullNameUpdate(fn) {
    this.setState({fullName: fn});
    this.props.onUpdateAccount(undefined, vcard(fn, this.state.avatar));
  }

  handlePasswordUpdate(pwd) {
    this.setState({password: pwd});
    this.props.onUpdateAccount(pwd);
  }

  handleImageChanged(img) {
    this.setState({avatar: img});
    this.props.onUpdateAccount(undefined, vcard(this.state.fullName, img));
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
      tags = <i>No tags defined. Add some.</i>;
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
              <div><label className="small">Your name</label></div>
              <div><InPlaceEdit
                  placeholder="Full name, e.g. John Doe"
                  value={this.state.fullName}
                  onFinished={this.handleFullNameUpdate} /></div>
              <div><label className="small">Password</label></div>
              <div><InPlaceEdit
                  placeholder="Unchanged"
                  type="password"
                  onFinished={this.handlePasswordUpdate} /></div>
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
              <label>Address:</label>
              <tt>{this.props.myUserId}</tt>
            </div>
            <div>
              <label className="small">Default access mode:</label>
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
            <label htmlFor="message-sound">Message sound:</label>
            <CheckBox name="sound" id="message-sound"
              checked={this.props.messageSounds}
              onChange={this.handleCheckboxClick} />
          </div>
          <div className="panel-form-row">
            <label htmlFor="desktop-alerts">Notification
              alerts{!this.props.desktopAlertsEnabled ? ' (requires HTTPS)' : null}:</label>
            <CheckBox name="alert" id="desktop-alerts"
              checked={this.props.desktopAlerts}
              onChange={this.props.desktopAlertsEnabled ? this.handleCheckboxClick : null} />
          </div>
          <div className="hr" />
          <TagManager
            title="Tags (user discovery)"
            activated={false}
            tags={this.state.tags}
            onSubmit={this.handleTagsUpdated} />
          <div className="hr" />
          <div className="panel-form-column">
            <a href="javascript:;" className="red flat-button" onClick={this.props.onLogout}>
              <i className="material-icons">exit_to_app</i> Logout
            </a>
          </div>
        </div>
      }</React.Fragment>
    );
  }
};

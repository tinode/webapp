// Edit account parameters.
import React from 'react';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';

import InPlaceEdit from '../widgets/in-place-edit.jsx';
import PermissionsEditor from '../widgets/permissions-editor.jsx';

const messages = defineMessages({
  delete_account: {
    id: 'delete_account',
    defaultMessage: 'Delete account',
    description: 'Title for delete account warning'
  },
  delete_account_warning: {
    id: 'delete_account_arning',
    defaultMessage: 'Are you sure you want to delete your account? It cannot be undone.',
    description: 'Warning message when deleting an account'
  }
});

class AccSecurityView extends React.Component {
  constructor(props) {
    super(props);

    const me = this.props.tinode.getMeTopic();
    let blockedCount = 0;
    me.contacts((c) => {
      if (c.acs && !c.acs.isJoiner()) {
        blockedCount ++;
      }
    });
    const defacs = me.getDefaultAccess();
    this.state = {
      auth: defacs ? defacs.auth : null,
      anon: defacs ? defacs.anon : null,
      showPermissionEditorFor: undefined,
      blockedCount: blockedCount,
    };

    this.handlePasswordUpdate = this.handlePasswordUpdate.bind(this);
    this.handleLaunchPermissionsEditor = this.handleLaunchPermissionsEditor.bind(this);
    this.handleHidePermissionsEditor = this.handleHidePermissionsEditor.bind(this);
    this.handlePermissionsChanged = this.handlePermissionsChanged.bind(this);
    this.handleDeleteAccount = this.handleDeleteAccount.bind(this);
  }

  handlePasswordUpdate(pwd) {
    this.setState({password: pwd});
    this.props.onUpdateAccount(pwd);
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

  handleDeleteAccount(e) {
    e.preventDefault();
    const {formatMessage} = this.props.intl;
    this.props.onShowAlert(
      formatMessage(messages.delete_account), // title
      formatMessage(messages.delete_account_warning), // content
      (() => { this.props.onDeleteAccount(); }), // onConfirm
      null, // use default text "OK"
      true, // Show Reject button
      null  // use default text "Cancel"
    );
  }

  render() {
    return (
      <React.Fragment>{this.state.showPermissionEditorFor ?
        <PermissionsEditor
          mode={this.state.editedPermissions}
          skip="O"
          onSubmit={this.handlePermissionsChanged}
          onCancel={this.handleHidePermissionsEditor} />
        :
        <div className="scrollable-panel">
          <div className="panel-form-column">
            <label className="small">
              <FormattedMessage id="label_password" defaultMessage="Password"
                  description="Label for password editing" />
            </label>
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
          <div className="hr" />
          <div className="panel-form-column">
            <a href="#" className="danger flat-button" onClick={(e) => {e.preventDefault(); this.props.onLogout();}}>
              <i className="material-icons">exit_to_app</i> &nbsp;<FormattedMessage id="button_logout"
                defaultMessage="Logout" description="Button [Logout]" />
            </a>
            <a href="#" className="danger flat-button" onClick={(e) => {this.handleDeleteAccount(e);}}>
              <i className="material-icons">delete</i> &nbsp;<FormattedMessage id="button_delete_account"
                defaultMessage="Delete account" description="Button [Delete account]" />
            </a>
          </div>
          <div className="hr" />
          <div className="panel-form-column">
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
          {this.state.blockedCount > 0 ?
            <>
              <div className="hr" />
              <div className="panel-form-row">
                <i className="material-icons">block</i>&nbsp;
                <a href="#" className="gray" onClick={(e) => {e.preventDefault(); this.props.onShowBlocked();}}>
                  <FormattedMessage id="blocked_contacts_link" defaultMessage="Blocked contacts ({count})"
                    values={{ count: this.state.blockedCount }} description="Blocked contacts link" />
                </a>
              </div>
            </>
            : null }
        </div>
      }</React.Fragment>
    );
  }
};

export default injectIntl(AccSecurityView);

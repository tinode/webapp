import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';

import ErrorPanel from '../widgets/error-panel.jsx';
import LoadSpinner from '../widgets/load-spinner.jsx';
import SideNavbar from '../widgets/side-navbar.jsx';

import ContactsView from './contacts-view.jsx';
import CreateAccountView from './create-account-view.jsx';
import EditAccountView from './edit-account-view.jsx';
import LoginView from './login-view.jsx';
import NewTopicView from './new-topic-view.jsx';
import PasswordResetView from './password-reset-view.jsx';
import SettingsView from './settings-view.jsx';
import ValidationView from './validation-view.jsx';

// Panel titles for translation.
const messages = defineMessages({
  'login': {
    id: 'sidepanel_title_login',
    description: 'Sidepanel title for LoginView.',
    defaultMessage: 'Sign In'
  },
  'register': {
    id: 'sidepanel_title_register',
    description: 'Sidepanel title for CreateAccountView.',
    defaultMessage: 'Create Account'
  },
  'settings': {
    id: 'sidepanel_title_settings',
    description: 'Sidepanel title for SettingsView.',
    defaultMessage: 'Settings'
  },
  'edit': {
    id: 'sidepanel_title_edit_account',
    description: 'Sidepanel title for EditAccountView.',
    defaultMessage: 'Edit Account'
  },
  'newtpk': {
    id: 'sidepanel_title_newtpk',
    description: 'Sidepanel title for NewTopicView.',
    defaultMessage: 'Start New Chat'
  },
  'cred': {
    id: 'sidepanel_title_cred',
    description: 'Sidepanel title for ValidationView.',
    defaultMessage: 'Confirm Credentials'
  },
  'reset': {
    id: 'sidepanel_title_reset',
    description: 'Sidepanel title for PasswordResetView.',
    defaultMessage: 'Reset Password'
  },
  'archive': {
    id: 'sidepanel_title_archive',
    description: 'Sidepanel title for ContactsView-Archive.',
    defaultMessage: 'Archived Chats'
  }
});

class SidepanelView extends React.Component {
  constructor(props) {
    super(props);

    this.handleLoginRequested = this.handleLoginRequested.bind(this);
  }

  handleLoginRequested(login, password) {
    this.props.onLoginRequest(login, password);
  }

  render() {
    const {formatMessage} = this.props.intl;
    const view = this.props.state || (this.props.myUserId ? 'contacts' : 'login');

    let title, avatar;
    if (view == 'contacts') {
      title = this.props.title;
      avatar = this.props.avatar ? this.props.avatar : true;
    } else {
      title = formatMessage(messages[view]);
      avatar = false;
    }

    let onCancel;
    if (['login', 'contacts'].indexOf(view) == -1) {
      onCancel = this.props.onCancel;
    }

    return (
      <div id="sidepanel" className={this.props.hideSelf ? 'nodisplay' : null}>
        <SideNavbar
          state={view}
          title={title}
          avatar={avatar}
          myUserId={this.props.myUserId}
          onSignUp={this.props.onSignUp}
          onSettings={this.props.onSettings}
          onNewTopic={this.props.onNewTopic}
          onCancel={onCancel} />

        <ErrorPanel
          level={this.props.errorLevel}
          text={this.props.errorText}
          action={this.props.errorAction}
          actionText={this.props.errorActionText}
          onClearError={this.props.onError} />

        <LoadSpinner show={this.props.loadSpinnerVisible} />

        {view === 'login' ?
          <LoginView
            login={this.props.login}
            disabled={this.props.loginDisabled}
            onLogin={this.handleLoginRequested} /> :

          view === 'register' ?
          <CreateAccountView
            onCreateAccount={this.props.onCreateAccount}
            onCancel={this.props.onCancel}
            onError={this.props.onError} /> :

          view === 'settings' ?
          <SettingsView
            transport={this.props.transport}
            serverAddress={this.props.serverAddress}
            onCancel={this.props.onCancel}
            onUpdate={this.props.onGlobalSettings} /> :

          view === 'edit' ?
          <EditAccountView
            tinode={this.props.tinode}
            myUserId={this.props.myUserId}
            messageSounds={this.props.messageSounds}
            desktopAlerts={this.props.desktopAlerts}
            desktopAlertsEnabled={this.props.desktopAlertsEnabled}
            onUpdateAccount={this.props.onUpdateAccount}
            onUpdateTags={this.props.onUpdateAccountTags}
            onTogglePushNotifications={this.props.onTogglePushNotifications}
            onToggleMessageSounds={this.props.onToggleMessageSounds}
            onCredAdd={this.props.onCredAdd}
            onCredDelete={this.props.onCredDelete}
            onCredConfirm={this.props.onCredConfirm}
            onLogout={this.props.onLogout}
            onCancel={this.props.onCancel}
            onError={this.props.onError} /> :

          (view === 'contacts' || view == 'archive') ?
          <ContactsView
            tinode={this.props.tinode}
            myUserId={this.props.myUserId}
            connected={this.props.connected}
            topicSelected={this.props.topicSelected}
            archive={view == 'archive'}
            chatList={this.props.chatList}
            showContextMenu={this.props.showContextMenu}
            onTopicSelected={this.props.onTopicSelected}
            onShowArchive={this.props.onShowArchive} /> :

          view === 'newtpk' ?
          <NewTopicView
            searchResults={this.props.searchResults}
            onInitFind={this.props.onInitFind}
            onSearchContacts={this.props.onSearchContacts}
            onCreateTopic={this.props.onCreateTopic}
            onError={this.props.onError} /> :

          view === 'cred' ?
          <ValidationView
            credCode={this.props.credCode}
            credMethod={this.props.credMethod}
            onSubmit={this.props.onValidateCredentials}
            onCancel={this.props.onCancel}
            onError={this.props.onError} /> :

          view === 'reset' ?
          <PasswordResetView
            onRequest={this.props.onPasswordResetRequest}
            onReset={this.props.onResetPassword} /> :
          null}
      </div>
    );
  }
};

export default injectIntl(SidepanelView);

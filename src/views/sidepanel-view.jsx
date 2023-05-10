import React, { Suspense } from 'react';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';

import ErrorPanel from '../widgets/error-panel.jsx';
import LoadSpinner from '../widgets/load-spinner.jsx';
import SideNavbar from '../widgets/side-navbar.jsx';
import TopicCommonView from './topic-common-view.jsx';

const AccountSettingsView = React.lazy(_ => import('./account-settings-view.jsx'));
import ContactsView from './contacts-view.jsx';
const CreateAccountView = React.lazy(_ => import('./create-account-view.jsx'));
import AccNotificationsView from './acc-notifications-view.jsx';
import AccSecurityView from './acc-security-view.jsx';
import AccSupportView from './acc-support-view.jsx';
import LoginView from './login-view.jsx';
import NewTopicView from './new-topic-view.jsx';
const PasswordResetView = React.lazy(_ => import('./password-reset-view.jsx'));
import SettingsView from './settings-view.jsx';
import ValidationView from './validation-view.jsx';

// Panel titles for translation.
const messages = defineMessages({
  login: {
    id: 'sidepanel_title_login',
    description: 'Sidepanel title for LoginView.',
    defaultMessage: 'Sign In'
  },
  register: {
    id: 'sidepanel_title_register',
    description: 'Sidepanel title for CreateAccountView.',
    defaultMessage: 'Create Account'
  },
  settings: {
    id: 'sidepanel_title_settings',
    description: 'Sidepanel title for SettingsView.',
    defaultMessage: 'Settings'
  },
  edit: {
    id: 'sidepanel_title_account_settings',
    description: 'Sidepanel title for AccountSettingsView.',
    defaultMessage: 'Account Settings'
  },
  general: {
    id: 'panel_title_general',
    description: 'Title for TopicCommon.',
    defaultMessage: 'General'
  },
  security: {
    id: 'panel_title_security',
    description: 'Title for TopicSecirity and AccSecurity.',
    defaultMessage: 'Security'
  },
  crop: {
    id: 'panel_title_crop',
    description: 'Title for AvatarCropView.',
    defaultMessage: 'Drag to Adjust'
  },
  notif: {
    id: 'sidepanel_title_acc_notifications',
    description: 'Sidepanel title for AccNotificationsView.',
    defaultMessage: 'Notifications'
  },
  support: {
    id: 'sidepanel_title_acc_support',
    description: 'Sidepanel title for AccSupportView.',
    defaultMessage: 'Support'
  },
  newtpk: {
    id: 'sidepanel_title_newtpk',
    description: 'Sidepanel title for NewTopicView.',
    defaultMessage: 'Start New Chat'
  },
  cred: {
    id: 'sidepanel_title_cred',
    description: 'Sidepanel title for ValidationView.',
    defaultMessage: 'Confirm Credentials'
  },
  reset: {
    id: 'sidepanel_title_reset',
    description: 'Sidepanel title for PasswordResetView.',
    defaultMessage: 'Reset Password'
  },
  archive: {
    id: 'sidepanel_title_archive',
    description: 'Sidepanel title for ContactsView-Archive.',
    defaultMessage: 'Archived Chats'
  },
  blocked: {
    id: 'sidepanel_title_blocked',
    description: 'Sidepanel title for ContactsView-Blocked.',
    defaultMessage: 'Blocked Chats'
  }
});

class SidepanelView extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleNewTopic = this.handleNewTopic.bind(this);
  }

  handleNewTopic() {
    this.props.onNavigate('newtpk');
  }

  render() {
    const {formatMessage} = this.props.intl;
    const view = this.props.state || (this.props.myUserId ? 'contacts' : 'login');

    let title, avatar, badges;
    if (view == 'contacts') {
      title = this.props.title;
      avatar = this.props.avatar ? this.props.avatar : true;
      badges = this.props.trustedBadges;
    } else {
      title = formatMessage(messages[view]);
      avatar = false;
      badges = null;
    }

    let onCancel;
    if (['login', 'contacts'].indexOf(view) == -1) {
      onCancel = this.props.onCancel;
    }

    return (
      <div id="sidepanel">
        <SideNavbar
          state={view}
          title={title}
          avatar={avatar}
          tinode={this.props.tinode}
          trustedBadges={badges}
          myUserId={this.props.myUserId}
          onSignUp={this.props.onSignUp}
          onSettings={this.props.onSettings}
          onNewTopic={this.handleNewTopic}
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
            persist={this.props.persist}
            onLogin={this.props.onLoginRequest}
            onPersistenceChange={this.props.onPersistenceChange} /> :

          view === 'register' ?
          <Suspense fallback={<div className="panel-form-row"><FormattedMessage id="loading_note"
            defaultMessage="Loading..." description="Message shown when component is loading"/></div>}>
            <CreateAccountView
              tinode={this.props.tinode}
              reqCredMethod={this.props.reqCredMethod}
              onShowCountrySelector={this.props.onShowCountrySelector}
              onCreateAccount={this.props.onCreateAccount}
              onCancel={this.props.onCancel}
              onError={this.props.onError} />
          </Suspense> :

          view === 'settings' ?
          <SettingsView
            transport={this.props.transport}
            serverAddress={this.props.serverAddress}
            secureConnection={this.props.secureConnection}
            onCancel={this.props.onCancel}
            onUpdate={this.props.onGlobalSettings} /> :

          view === 'edit' ?
          <Suspense fallback={<div className="panel-form-row"><FormattedMessage id="loading_note"
            defaultMessage="Loading..." description="Message shown when component is loading"/></div>}>
            <AccountSettingsView
              tinode={this.props.tinode}
              myUserId={this.props.myUserId}
              trustedBadges={this.props.trustedBadges}
              reqCredMethod={this.props.reqCredMethod}
              onShowCountrySelector={this.props.onShowCountrySelector}
              onNavigate={this.props.onNavigate}
              onCredAdd={this.props.onCredAdd}
              onCredDelete={this.props.onCredDelete}
              onCredConfirm={this.props.onCredConfirm}
              onError={this.props.onError} />
          </Suspense> :

          (view === 'general' || view === 'crop') ?
          <TopicCommonView
            topic="me"
            tinode={this.props.tinode}
            myUserId={this.props.myUserId}
            reqCredMethod={this.props.reqCredMethod}
            onUpdateTopicDesc={this.props.onUpdateAccountDesc}
            onUpdateTagsRequest={this.props.onUpdateAccountTags}
            onError={this.props.onError} /> :

          view === 'notif' ?
          <AccNotificationsView
            messageSounds={this.props.messageSounds}
            desktopAlerts={this.props.desktopAlerts}
            desktopAlertsEnabled={this.props.desktopAlertsEnabled}
            incognitoMode={this.props.incognitoMode}
            onTogglePushNotifications={this.props.onTogglePushNotifications}
            onToggleMessageSounds={this.props.onToggleMessageSounds}
            onToggleIncognitoMode={this.props.onToggleIncognitoMode} /> :

          view === 'security' ?
          <AccSecurityView
            tinode={this.props.tinode}
            onUpdateAccountDesc={this.props.onUpdateAccountDesc}
            onUpdatePassword={this.props.onUpdatePassword}
            onLogout={this.props.onLogout}
            onDeleteAccount={this.props.onDeleteAccount}
            onShowAlert={this.props.onShowAlert}
            onShowBlocked={this.props.onShowBlocked} /> :

          view === 'support' ?
          <AccSupportView
            serverAddress={this.props.serverAddress}
            serverVersion={this.props.serverVersion} /> :

          (view === 'contacts' || view == 'archive' || view == 'blocked') ?
          <ContactsView
            tinode={this.props.tinode}
            myUserId={this.props.myUserId}
            connected={this.props.connected}
            topicSelected={this.props.topicSelected}
            archive={view == 'archive'}
            blocked={view == 'blocked'}
            chatList={this.props.chatList}
            showContextMenu={this.props.showContextMenu}
            onTopicSelected={this.props.onTopicSelected}
            onShowArchive={this.props.onShowArchive} /> :

          view === 'newtpk' ?
          <NewTopicView
            tinode={this.props.tinode}
            searchResults={this.props.searchResults}
            onInitFind={this.props.onInitFind}
            onSearchContacts={this.props.onSearchContacts}
            onCreateTopic={this.props.onCreateTopic}
            onError={this.props.onError} /> :

          view === 'cred' ?
          <ValidationView
            credCode={this.props.credCode}
            credMethod={this.props.credMethod}
            credToken={this.props.credToken}
            onSubmit={this.props.onValidateCredentials}
            onCancel={this.props.onCancel} /> :

          view === 'reset' ?
          <Suspense fallback={<div className="panel-form-row"><FormattedMessage id="loading_note"
            defaultMessage="Loading..." description="Message shown when component is loading"/></div>}>
            <PasswordResetView
              tinode={this.props.tinode}
              reqCredMethod={this.props.reqCredMethod}
              onShowCountrySelector={this.props.onShowCountrySelector}
              onRequest={this.props.onPasswordResetRequest}
              onReset={this.props.onResetPassword}
              onCancel={this.props.onCancel}
              onError={this.props.onError} />
          </Suspense> :
          null}
      </div>
    );
  }
};

export default injectIntl(SidepanelView);

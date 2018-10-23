import React from 'react';

export default class SidepanelView extends React.Component {
  constructor(props) {
    super(props);

    this.handleLoginRequested = this.handleLoginRequested.bind(this);
  }

  handleLoginRequested(login, password) {
    this.props.onLoginRequest(login, password);
  }

  render() {
    var title = null;
    var avatar = false;
    var onCancel = undefined;
    var view = this.props.state || (this.props.myUserId ? 'contacts' : 'login');
    switch (view) {
      case 'login':
        title = "Sign In";
        break;
      case 'register':
        title = "Create Account";
        onCancel = this.props.onCancel;
        break;
      case 'settings':
        title = "Settings";
        onCancel = this.props.onCancel;
        break;
      case 'edit':
        title = "Edit Account";
        onCancel = this.props.onCancel;
        break;
      case 'contacts':
        title = this.props.title;
        avatar = this.props.avatar ? this.props.avatar : true;
        break;
      case 'newtpk':
        title = "Start New Chat";
        onCancel = this.props.onCancel;
        break;
      case 'cred':
        title = "Confirm Credentials";
        onCancel = this.props.onCancel;
        break;
      case 'reset':
        title = "Reset Password";
        onCancel = this.props.onCancel;
        break;
      default:;
    };
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
          onClearError={this.props.onError} />

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
            onServerAddressChange={this.props.onGlobalSettings}
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
            onLogout={this.props.onLogout}
            onCancel={this.props.onCancel}
            onError={this.props.onError} /> :

          view === 'contacts' ?
          <ContactsView
            tinode={this.props.tinode}
            myUserId={this.props.myUserId}
            connected={this.props.connected}
            topicSelected={this.props.topicSelected}
            chatList={this.props.chatList}
            showContextMenu={this.props.showContextMenu}
            onTopicSelected={this.props.onTopicSelected} /> :

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

// The top-level class to hold all functionality together.
import React from 'react';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';

import { initializeApp as firebaseInitApp } from 'firebase/app';
import { getMessaging as firebaseGetMessaging, getToken as firebaseGetToken,
  deleteToken as firebaseDelToken, onMessage as firebaseOnMessage } from 'firebase/messaging';

import { Drafty, Tinode } from 'tinode-sdk';

import Alert from '../widgets/alert.jsx';
import ContextMenu from '../widgets/context-menu.jsx';
import ForwardDialog from '../widgets/forward-dialog.jsx';

import InfoView from './info-view.jsx';
import MessagesView from './messages-view.jsx';
import SidepanelView from './sidepanel-view.jsx';

import { API_KEY, APP_NAME, DEFAULT_P2P_ACCESS_MODE, FORWARDED_PREVIEW_LENGTH, LOGGING_ENABLED,
  MEDIA_BREAKPOINT, RECEIVED_DELAY } from '../config.js';
import { PACKAGE_VERSION } from '../version.js';
import { base64ReEncode, makeImageUrl } from '../lib/blob-helpers.js';
import { detectServerAddress, isLocalHost, isSecureConnection } from '../lib/host-name.js';
import LocalStorageUtil from '../lib/local-storage.js';
import HashNavigation from '../lib/navigation.js';
import { secondsToTime } from '../lib/strformat.js'
import { updateFavicon } from '../lib/utils.js';

// Sound to play on message received.
const POP_SOUND = new Audio('audio/msg.mp3');

const messages = defineMessages({
  reconnect_countdown: {
    id: 'reconnect_countdown',
    defaultMessage: 'Disconnected. Reconnecting in {seconds}…',
    description: 'Message shown when an app update is available.'
  },
  reconnect_now: {
    id: 'reconnect_now',
    defaultMessage: 'Try now',
    description: 'Prompt for reconnecting now'
  },
  push_init_failed: {
    id: 'push_init_failed',
    defaultMessage: 'Failed to initialize push notifications',
    description: 'Error message when push notifications have failed to initialize.'
  },
  invalid_security_token: {
    id: 'invalid_security_token',
    defaultMessage: 'Invalid security token',
    description: 'Error message when resetting password.'
  },
  no_connection: {
    id: 'no_connection',
    defaultMessage: 'No connection',
    description: 'Warning that the user is offline.'
  },
  code_doesnot_match: {
    id: 'code_doesnot_match',
    defaultMessage: 'Code does not match',
    description: 'Error message when the credential validation code is incorrect.'
  },
  menu_item_info: {
    id: 'menu_item_info',
    defaultMessage: 'Info',
    description: 'Show extended topic information'
  }
});

class TinodeWeb extends React.Component {
  constructor(props) {
    super(props);

    this.selfRef = React.createRef();

    this.state = this.getBlankState();

    this.handleResize = this.handleResize.bind(this);
    this.handleHashRoute = this.handleHashRoute.bind(this);
    this.handleOnline = this.handleOnline.bind(this);
    this.checkForAppUpdate = this.checkForAppUpdate.bind(this);
    this.handleVisibilityEvent = this.handleVisibilityEvent.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handleLoginRequest = this.handleLoginRequest.bind(this);
    this.handlePersistenceChange = this.handlePersistenceChange.bind(this);
    this.handleConnected = this.handleConnected.bind(this);
    this.handleAutoreconnectIteration = this.handleAutoreconnectIteration.bind(this);
    this.doLogin = this.doLogin.bind(this);
    this.handleCredentialsRequest = this.handleCredentialsRequest.bind(this);
    this.handleLoginSuccessful = this.handleLoginSuccessful.bind(this);
    this.handleDisconnect = this.handleDisconnect.bind(this);
    this.tnMeMetaDesc = this.tnMeMetaDesc.bind(this);
    this.tnMeContactUpdate = this.tnMeContactUpdate.bind(this);
    this.tnMeSubsUpdated = this.tnMeSubsUpdated.bind(this);
    this.resetContactList = this.resetContactList.bind(this);
    this.tnData = this.tnData.bind(this);
    this.tnInitFind = this.tnInitFind.bind(this);
    this.tnFndSubsUpdated = this.tnFndSubsUpdated.bind(this);
    this.handleSearchContacts = this.handleSearchContacts.bind(this);
    this.handleTopicSelected = this.handleTopicSelected.bind(this);
    this.handleHideMessagesView = this.handleHideMessagesView.bind(this);
    this.handleSendMessage = this.handleSendMessage.bind(this);
    this.handleNewChatInvitation = this.handleNewChatInvitation.bind(this);
    this.handleNewAccount = this.handleNewAccount.bind(this);
    this.handleNewAccountRequest = this.handleNewAccountRequest.bind(this);
    this.handleUpdatePasswordRequest = this.handleUpdatePasswordRequest.bind(this);
    this.handleUpdateAccountTagsRequest = this.handleUpdateAccountTagsRequest.bind(this);
    this.handleToggleIncognitoMode = this.handleToggleIncognitoMode.bind(this);
    this.handleSettings = this.handleSettings.bind(this);
    this.handleGlobalSettings = this.handleGlobalSettings.bind(this);
    this.handleShowArchive = this.handleShowArchive.bind(this);
    this.handleShowBlocked = this.handleShowBlocked.bind(this);
    this.handleToggleMessageSounds = this.handleToggleMessageSounds.bind(this);
    this.handleCredAdd = this.handleCredAdd.bind(this);
    this.handleCredDelete = this.handleCredDelete.bind(this);
    this.handleCredConfirm = this.handleCredConfirm.bind(this);
    this.initFCMessaging = this.initFCMessaging.bind(this);
    this.toggleFCMToken = this.toggleFCMToken.bind(this);
    this.handlePushMessage = this.handlePushMessage.bind(this);
    this.handleSidepanelCancel = this.handleSidepanelCancel.bind(this);
    this.handleStartTopicRequest = this.handleStartTopicRequest.bind(this);
    this.handleNewTopicCreated = this.handleNewTopicCreated.bind(this);
    this.handleTopicUpdateRequest = this.handleTopicUpdateRequest.bind(this);
    this.handleUnarchive = this.handleUnarchive.bind(this);
    this.handleChangePermissions = this.handleChangePermissions.bind(this);
    this.handleTagsUpdateRequest = this.handleTagsUpdateRequest.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleDeleteAccount = this.handleDeleteAccount.bind(this);
    this.handleDeleteTopicRequest = this.handleDeleteTopicRequest.bind(this);
    this.handleDeleteMessagesRequest = this.handleDeleteMessagesRequest.bind(this);
    this.handleLeaveUnsubRequest = this.handleLeaveUnsubRequest.bind(this);
    this.handleBlockTopicRequest = this.handleBlockTopicRequest.bind(this);
    this.handleReportTopic = this.handleReportTopic.bind(this);
    this.handleShowContextMenu = this.handleShowContextMenu.bind(this);
    this.defaultTopicContextMenu = this.defaultTopicContextMenu.bind(this);
    this.handleHideContextMenu = this.handleHideContextMenu.bind(this);
    this.handleShowAlert = this.handleShowAlert.bind(this);
    this.handleShowInfoView = this.handleShowInfoView.bind(this);
    this.handleMemberUpdateRequest = this.handleMemberUpdateRequest.bind(this);
    this.handleValidateCredentialsRequest = this.handleValidateCredentialsRequest.bind(this);
    this.handlePasswordResetRequest = this.handlePasswordResetRequest.bind(this);
    this.handleResetPassword = this.handleResetPassword.bind(this);
    this.handleContextMenuAction = this.handleContextMenuAction.bind(this);

    this.handleShowForwardDialog = this.handleShowForwardDialog.bind(this);
    this.handleHideForwardDialog = this.handleHideForwardDialog.bind(this);

    this.sendMessageToTopic = this.sendMessageToTopic.bind(this);
  }

  getBlankState() {
    const settings = LocalStorageUtil.getObject('settings') || {};
    const persist = !!LocalStorageUtil.getObject('keep-logged-in');

    return {
      connected: false,
      // Connected and subscribed to 'me'
      ready: false,
      // Try to re-login on new connection.
      autoLogin: false,
      transport: settings.transport || null,
      serverAddress: settings.serverAddress || detectServerAddress(),
      serverVersion: "no connection",
      // "On" is the default, so saving the "off" state.
      messageSounds: !settings.messageSoundsOff,
      incognitoMode: false,
      // Persistent request to enable alerts.
      desktopAlerts: persist && !!settings.desktopAlerts,
      // Enable / disable checkbox.
      desktopAlertsEnabled: (isSecureConnection() || isLocalHost()) &&
        (typeof firebaseInitApp != 'undefined') && (typeof navigator != 'undefined') &&
        (typeof FIREBASE_INIT != 'undefined'),
      firebaseToken: persist ? LocalStorageUtil.getObject('firebase-token') : null,

      applicationVisible: !document.hidden,

      errorText: '',
      errorLevel: null,
      errorAction: undefined,
      errorActionText: null,

      sidePanelSelected: 'login',
      sidePanelTitle: null,
      sidePanelAvatar: null,
      myTrustedBadges: [],
      loadSpinnerVisible: false,

      login: '',
      password: '',
      persist: persist,
      myUserId: null,
      liveConnection: navigator.onLine,
      topicSelected: '',
      topicSelectedOnline: false,
      topicSelectedAcs: null,
      newTopicParams: null,
      loginDisabled: false,
      displayMobile: (window.innerWidth <= MEDIA_BREAKPOINT),
      infoPanel: undefined,
      mobilePanel: 'sidepanel',

      contextMenuVisible: false,
      contextMenuBounds: null,
      contextMenuClickAt: null,
      contextMenuParams: null,
      contextMenuItems: [],

      forwardDialogVisible: false,
      forwardMessage: null,

      // Modal alert dialog.
      alertVisible: false,
      alertParams: {},

      // Chats as shown in the ContactsView
      chatList: [],
      // Contacts returned by a search query.
      searchResults: [],
      // Merged results of a search query and p2p chats.
      searchableContacts: [],
      credMethod: undefined,
      credCode: undefined,
      // Topic to go to after login.
      requestedTopic: undefined
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('online', (e) => { this.handleOnline(true); });
    window.addEventListener('offline', (e) => { this.handleOnline(false); });
    window.addEventListener('hashchange', this.handleHashRoute);

    // Process background notifications from the service worker.
    if (typeof BroadcastChannel == 'function') {
      const serviceWorkerChannel = new BroadcastChannel('tinode-sw');
      serviceWorkerChannel.addEventListener('message', this.handlePushMessage);
    } else {
      // Safari is broken by design.
      console.warn("Your browser does not support BroadcastChannel. Some features will not be available");
    }

    // Window/tab visible or invisible for pausing timers.
    document.addEventListener('visibilitychange', this.handleVisibilityEvent);

    this.setState({
      viewportWidth: document.documentElement.clientWidth,
      viewportHeight: document.documentElement.clientHeight
    });

    new Promise((resolve, reject) => {
      this.tinode = TinodeWeb.tnSetup(this.state.serverAddress, this.state.transport,
        this.props.intl.locale, this.state.persist, resolve);
      this.tinode.onConnect = this.handleConnected;
      this.tinode.onDisconnect = this.handleDisconnect;
      this.tinode.onAutoreconnectIteration = this.handleAutoreconnectIteration;
    }).then(() => {
      // Initialize desktop alerts.
      if (this.state.desktopAlertsEnabled) {
        this.initFCMessaging().then(() => {
          if (this.state.desktopAlerts) {
            this.tinode.setDeviceToken(this.state.firebaseToken);
          }
        }).catch(() => {
          // do nothing: handled earlier.
          // catch needed to pervent unnecessary logging of error.
        });
      }

      // Parse and save the hash navigation params.
      const parsedNav = HashNavigation.parseUrlHash(window.location.hash);

      // Read contacts from cache.
      this.resetContactList();

      const token = this.state.persist ? LocalStorageUtil.getObject('auth-token') : undefined;
      if (token) {
        this.setState({autoLogin: true});

        // When reading from storage, date is returned as string.
        token.expires = new Date(token.expires);
        this.tinode.setAuthToken(token);
        this.tinode.connect().catch((err) => {
          // Socket error
          this.handleError(err.message, 'err');
        });
      }

      // Maybe navigate to home screen.
      if (!['cred', 'reset', 'register'].includes(parsedNav.path[0])) {
        // Save possible topic name.
        this.setState({requestedTopic: parsedNav.path[1]});
        HashNavigation.navigateTo('');
      }

      this.readTimer = null;
      this.readTimerCallback = null;

      this.handleHashRoute();
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('hashchange', this.handleHashRoute);
    document.removeEventListener('visibilitychange', this.handleVisibilityEvent);
  }

  // Setup transport (usually websocket) and server address. This will terminate connection with the server.
  static tnSetup(serverAddress, transport, locale, persistentCache, onSetupCompleted) {
    const tinode = new Tinode({appName: APP_NAME, host: serverAddress, apiKey: API_KEY, transport: transport,
      secure: isSecureConnection(), persist: persistentCache}, onSetupCompleted);
    tinode.setHumanLanguage(locale);
    tinode.enableLogging(LOGGING_ENABLED, true);
    return tinode;
  }

  // Tinode received a push notification from the server.
  handlePushMessage(payload) {
    this.tinode.oobNotification(payload.data || {});
  }

  initFCMessaging() {
    const {formatMessage, locale} = this.props.intl;
    const onError = (msg, err) => {
      console.error(msg, err);
      this.handleError(formatMessage(messages.push_init_failed), 'err');
      this.setState({desktopAlertsEnabled: false, firebaseToken: null});
      LocalStorageUtil.updateObject('settings', {desktopAlerts: false});
    }

    try {
      this.fcm = firebaseGetMessaging(firebaseInitApp(FIREBASE_INIT, APP_NAME));
      return navigator.serviceWorker.register('/service-worker.js').then((reg) => {
        this.checkForAppUpdate(reg);
        reg.active.postMessage(JSON.stringify({locale: locale, version: PACKAGE_VERSION}));
        return reg;
      }).then((reg) => {
        // Request token.
        return TinodeWeb.requestFCMToken(this.fcm, reg);
      }).then((token) => {
        const persist = LocalStorageUtil.getObject('keep-logged-in');
        if (token != this.state.firebaseToken) {
          this.tinode.setDeviceToken(token);
          if (persist) {
            LocalStorageUtil.setObject('firebase-token', token);
          }
        }
        this.setState({firebaseToken: token, desktopAlerts: true});
        if (persist) {
          LocalStorageUtil.updateObject('settings', {desktopAlerts: true});
        }

        // Handhe FCM pushes
        // (a) for channels always,
        // (b) pushes when the app is in foreground but has no focus.
        firebaseOnMessage(this.fcm, (payload) => { this.handlePushMessage(payload); });
      }).catch((err) => {
        // SW registration or FCM has failed :(
        onError(err);
        throw err;
      });
    } catch (err) {
      onError(err);
      return Promise.reject(err);
    }
  }

  // Google's FCM API is idiotic.
  static requestFCMToken(fcm, sw) {
    return firebaseGetToken(fcm, {
      serviceWorkerRegistration: sw,
      vapidKey: FIREBASE_INIT.messagingVapidKey
    }).then((token) => {
      if (token) {
        return token;
      } else {
        // Try to request permissions.
        return Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            return firebaseGetToken(fcm, {
              serviceWorkerRegistration: reg,
              vapidKey: FIREBASE_INIT.messagingVapidKey
            }).then((token) => {
              if (token) {
                return token;
              } else {
                throw new Error("Failed to initialize notifications");
              }
            });
          } else {
            throw new Error("No permission to send notifications: " + permission);
          }
        });
      }
    });
  }

  handleResize() {
    const mobile = document.documentElement.clientWidth <= MEDIA_BREAKPOINT;
    this.setState({
      viewportWidth: document.documentElement.clientWidth,
      viewportHeight: document.documentElement.clientHeight
    });
    if (this.state.displayMobile != mobile) {
      this.setState({displayMobile: mobile});
    }
  }

  // Check if a newer version of TinodeWeb app is available at the server.
  checkForAppUpdate(reg) {
    reg.onupdatefound = () => {
      const installingWorker = reg.installing;
      installingWorker.onstatechange = () => {
        if (installingWorker.state == 'installed' && navigator.serviceWorker.controller) {
          const msg = <>
            <FormattedMessage id="update_available"
              defaultMessage="Update available."
              description="Message shown when an app update is available." /> <a href="">
              <FormattedMessage id="reload_update"
                defaultMessage="Reload"
                description="Call to action to reload application when update is available." />
            </a>.</>;
          this.handleError(msg, 'info');
        }
      }
    }
  }

  // Handle for hashchange event: display appropriate panels.
  handleHashRoute() {
    const hash = HashNavigation.parseUrlHash(window.location.hash);
    if (hash.path && hash.path.length > 0) {
      // Left-side panel selector.
      if (['register','settings','edit','notif','security','support','general','crop',
          'cred','reset','newtpk','archive','blocked','contacts',''].includes(hash.path[0])) {
        this.setState({sidePanelSelected: hash.path[0]});
      } else {
        console.warn("Unknown sidepanel view", hash.path[0]);
      }

      // Topic for MessagesView selector.
      let topicName = hash.path[1] || null;
      if (topicName != this.state.topicSelected) {
        if (!Tinode.topicType(topicName)) {
          // Clear invalid topic name.
          topicName = null;
        }
        this.setState({
          topicSelected: topicName,
          topicSelectedAcs: this.tinode.getTopicAccessMode(topicName)
        });
      }
    } else {
      // Empty hashpath
      this.setState({sidePanelSelected: '', topicSelected: null});
    }

    // Save validation credentials, if available.
    if (hash.params.method) {
      this.setState({ credMethod: hash.params.method });
    }
    if (hash.params.code) {
      this.setState({ credCode: hash.params.code });
    }

    // Additional parameters of panels.
    this.setState({
      infoPanel: hash.params.info,
      newTopicTabSelected: hash.params.tab
    });
  }

  handleOnline(online) {
    if (online) {
      this.handleError();
      clearInterval(this.reconnectCountdown);
      this.tinode.reconnect();
    } else {
      this.handleError(this.props.intl.formatMessage(messages.no_connection), 'warn');
    }
    this.setState({liveConnection: online});
  }

  handleVisibilityEvent() {
    this.setState({applicationVisible: !document.hidden});
  }

  handleError(err, level, action, actionText) {
    this.setState({errorText: err, errorLevel: level, errorAction: action, errorActionText: actionText});
  }

  // User clicked Login button in the side panel.
  handleLoginRequest(login, password) {
    this.setState({
      loginDisabled: true,
      login: login,
      password: password,
      loadSpinnerVisible: true,
      autoLogin: true
    });
    this.handleError('', null);

    if (this.tinode.isConnected()) {
      this.doLogin(login, password, {meth: this.state.credMethod, resp: this.state.credCode});
    } else {
      this.tinode.connect().catch((err) => {
        // Socket error
        this.setState({loginDisabled: false, autoLogin: false, loadSpinnerVisible: false});
        this.handleError(err.message, 'err');
      });
    }
  }

  // Enable or disable saving the password and IndexedDB.
  handlePersistenceChange(persist) {
    if (persist) {
      this.tinode.initStorage().then(() => {
        LocalStorageUtil.setObject('keep-logged-in', true);
        this.setState({persist: true});
      });
    } else {
      this.tinode.clearStorage().then(() => {
        LocalStorageUtil.setObject('keep-logged-in', false);
        this.setState({persist: false});
      });
    }
  }

  // Connection succeeded.
  handleConnected() {
    // Just to be sure.
    clearInterval(this.reconnectCountdown);
    this.handleError();

    const params = this.tinode.getServerInfo();
    this.setState({
      serverVersion: params.ver + ' ' + (params.build ? params.build : 'none')
    });

    if (this.state.autoLogin) {
      this.doLogin(this.state.login, this.state.password, {meth: this.state.credMethod, resp: this.state.credCode});
    }
  }

  // Called for each auto-reconnect iteration.
  handleAutoreconnectIteration(sec, prom) {
    clearInterval(this.reconnectCountdown);

    if (sec < 0) {
      // Clear error
      this.handleError();
      return;
    }

    if (prom) {
      // Reconnecting now
      prom.then(() => {
        // Reconnected: clear error
        this.handleError();
      }).catch((err) => {
        this.handleError(err.message, 'err');
      });
      return;
    }

    const {formatMessage} = this.props.intl;
    let count = sec / 1000;
    count = count | count;
    this.reconnectCountdown = setInterval(() => {
      const timeLeft = (count > 99) ? secondsToTime(count) : count;
      this.handleError(
        formatMessage(messages.reconnect_countdown, {seconds: timeLeft}),
        'warn',
        _ => {
          clearInterval(this.reconnectCountdown);
          this.tinode.reconnect();
        },
        formatMessage(messages.reconnect_now)
      );
      count -= 1;
    }, 1000);
  }

  // Connection lost
  handleDisconnect(err) {
    this.setState({
      connected: false,
      ready: false,
      topicSelectedOnline: false,
      errorText: err && err.message ? err.message : "Disconnected",
      errorLevel: err && err.message ? 'err' : 'warn',
      loginDisabled: false,
      contextMenuVisible: false,
      forwardDialogVisible: false,
      serverVersion: "no connection"
    });
  }

  doLogin(login, password, cred) {
    if (this.tinode.isAuthenticated()) {
      // Already logged in. Go to default screen.
      HashNavigation.navigateTo('');
      return;
    }
    // Sanitize and package credentail.
    cred = Tinode.credential(cred);
    // Try to login with login/password. If they are not available, try token. If no token, ask for login/password.
    let promise = null;
    let token = this.tinode.getAuthToken();
    if (login && password) {
      token = null;
      this.setState({password: null});
      promise = this.tinode.loginBasic(login, password, cred);
    } else if (token) {
      promise = this.tinode.loginToken(token.token, cred);
    }

    if (promise) {
      promise.then((ctrl) => {
        if (ctrl.code >= 300 && ctrl.text === 'validate credentials') {
          this.setState({loadSpinnerVisible: false});
          if (cred) {
            this.handleError(this.props.intl.formatMessage(messages.code_doesnot_match), 'warn');
          }
          this.handleCredentialsRequest(ctrl.params);
        } else {
          this.handleLoginSuccessful();
        }
      }).catch((err) => {
        // Login failed, report error.
        this.setState({
          loginDisabled: false,
          credMethod: undefined,
          credCode: undefined,
          loadSpinnerVisible: false,
          autoLogin: false
        });
        this.handleError(err.message, 'err');
        if (token) {
          this.handleLogout();
        }
        HashNavigation.navigateTo('');
      });
    } else {
      // No login credentials provided.
      // Make sure we are on the login page.
      HashNavigation.navigateTo('');
      this.setState({loginDisabled: false});
    }
  }

  handleCredentialsRequest(params) {
    const parsed = HashNavigation.parseUrlHash(window.location.hash);
    parsed.path[0] = 'cred';
    parsed.params['method'] = params.cred[0];
    HashNavigation.navigateTo(HashNavigation.composeUrlHash(parsed.path, parsed.params));
  }

  handleLoginSuccessful() {
    this.handleError();

    // Refresh authentication token.
    if (LocalStorageUtil.getObject('keep-logged-in')) {
      LocalStorageUtil.setObject('auth-token', this.tinode.getAuthToken());
    }

    const goToTopic = this.state.requestedTopic;
    // Logged in fine, subscribe to 'me' attaching callbacks from the contacts view.
    const me = this.tinode.getMeTopic();
    me.onMetaDesc = this.tnMeMetaDesc;
    me.onContactUpdate = this.tnMeContactUpdate;
    me.onSubsUpdated = this.tnMeSubsUpdated;
    this.setState({
      connected: true,
      credMethod: undefined,
      credCode: undefined,
      myUserId: this.tinode.getCurrentUserID(),
      autoLogin: true,
      requestedTopic: undefined,
    });
    // Subscribe, fetch topic desc, the list of subscriptions. Messages are not fetched.
    me.subscribe(
      me.startMetaQuery().
        withLaterSub().
        withDesc().
        withTags().
        withCred().
        build()
      ).catch((err) => {
        this.tinode.disconnect();
        localStorage.removeItem('auth-token');
        this.handleError(err.message, 'err');
        HashNavigation.navigateTo('');
      }).finally(() => {
        this.setState({loadSpinnerVisible: false});
      });
    let urlHash = HashNavigation.setUrlSidePanel(window.location.hash, 'contacts');
    if (goToTopic) {
      urlHash = HashNavigation.setUrlTopic(urlHash, goToTopic);
    }
    HashNavigation.navigateTo(urlHash);
  }

  tnMeMetaDesc(desc) {
    if (desc) {
      if (desc.public) {
        this.setState({
          sidePanelTitle: desc.public.fn,
          sidePanelAvatar: makeImageUrl(desc.public.photo)
        });
      }
      if (desc.trusted) {
        const badges = [];
        for (const [key, val] of Object.entries(desc.trusted)) {
          if (val) {
            badges.push(key);
          }
        }
        this.setState({
          myTrustedBadges: badges,
        });
      }
      if (desc.acs) {
        this.setState({
          incognitoMode: !desc.acs.isPresencer()
        });
      }
    }
  }

  // Reactions to updates to the contact list.
  tnMeContactUpdate(what, cont) {
    if (what == 'on' || what == 'off') {
      this.resetContactList();
      if (this.state.topicSelected == cont.topic) {
        this.setState({topicSelectedOnline: (what == 'on')});
      }
    } else if (what == 'read') {
      this.resetContactList();
    } else if (what == 'msg') {
      // Check if the topic is archived. If so, don't play a sound.
      const topic = this.tinode.getTopic(cont.topic);
      const archived = topic && topic.isArchived();

      // New message received. Maybe the message is from the current user, then unread is 0.
      if (cont.unread > 0 && this.state.messageSounds && !archived) {
        // Skip update if the topic is currently open, otherwise the badge will annoyingly flash.
        if (document.hidden || this.state.topicSelected != cont.topic) {
          POP_SOUND.play();
        }
      }
      // Reorder contact list to use possibly updated 'touched'.
      this.resetContactList();
    } else if (what == 'recv') {
      // Explicitly ignoring "recv" -- it causes no visible updates to contact list.
    } else if (what == 'gone' || what == 'unsub') {
      // Topic deleted or user unsubscribed. Remove topic from view.
      // If the currently selected topic is gone, clear the selection.
      if (this.state.topicSelected == cont.topic) {
        this.handleTopicSelected(null);
      }
      // Redraw without the deleted topic.
      this.resetContactList();
    } else if (what == 'acs') {
      // Permissions changed. If it's for the currently selected topic,
      // update the views.
      if (this.state.topicSelected == cont.topic) {
        this.setState({topicSelectedAcs: cont.acs});
      }
    } else if (what == 'del') {
      // TODO: messages deleted (hard or soft) -- update pill counter.
    } else if (what == 'upd') {
      // upd - handled by the SDK. Explicitly ignoring here.
    } else {
      // TODO(gene): handle other types of notifications:
      // * ua -- user agent changes (maybe display a pictogram for mobile/desktop).
      console.info("Unsupported (yet) presence update:" + what + " in: " + cont.topic);
    }
  }

  tnMeSubsUpdated(unused) {
    this.resetContactList();
  }

  // Merge search results and contact list to create a single flat
  // list of known contacts for GroupManager to use.
  static prepareSearchableContacts(chatList, foundContacts) {
    const merged = {};

    // For chatList topics merge only p2p topics and convert them to the
    // same format as foundContacts.
    for (const c of chatList) {
      if (Tinode.isP2PTopicName(c.topic)) {
          merged[c.topic] = {
            user: c.topic,
            updated: c.updated,
            public: c.public,
            private: c.private,
            acs: c.acs
          };
      }
    }

    // Add all foundCountacts if they have not been added already.
    for (const c of foundContacts) {
      if (!merged[c.user]) {
        merged[c.user] = c;
      }
    }

    return Object.values(merged);
  }

  resetContactList() {
    const newState = {
      chatList: []
    };

    if (!this.state.ready) {
      newState.ready = true;
    }

    this.tinode.getMeTopic().contacts((c) => {
      if (!c.topic && !c.user) {
        // Contacts expect c.topic to be set.
        c.topic = c.name;
      }

      newState.chatList.push(c);
      if (this.state.topicSelected == c.topic) {
        newState.topicSelectedOnline = c.online;
        newState.topicSelectedAcs = c.acs;
      }
    });

    const past = new Date(0);
    newState.chatList.sort((a, b) => {
      return (a.touched || past).getTime() - (b.touched || past).getTime();
    });

    // Merge search results and chat list.
    newState.searchableContacts = TinodeWeb.prepareSearchableContacts(newState.chatList, this.state.searchResults);
    this.setState(newState);
  }

  // Sending "received" notifications
  tnData(data) {
    const topic = this.tinode.getTopic(data.topic);
    if (topic.msgStatus(data, true) >= Tinode.MESSAGE_STATUS_SENT && data.from != this.state.myUserId) {
      clearTimeout(this.receivedTimer);
      this.receivedTimer = setTimeout(() => {
        this.receivedTimer = undefined;
        topic.noteRecv(data.seq);
      }, RECEIVED_DELAY);
    }
  }

  /* Fnd topic: find contacts by tokens */
  tnInitFind() {
    const fnd = this.tinode.getFndTopic();
    fnd.onSubsUpdated = this.tnFndSubsUpdated;
    if (fnd.isSubscribed()) {
      this.tnFndSubsUpdated();
    } else {
      fnd.subscribe(fnd.startMetaQuery().withSub().build()).catch((err) => {
        this.handleError(err.message, 'err');
      });
    }
  }

  tnFndSubsUpdated() {
    const foundContacts = [];
    // Don't attempt to create P2P topics which already exist. Server will reject the duplicates.
    this.tinode.getFndTopic().contacts((s) => {
      foundContacts.push(s);
    });
    this.setState({
      searchResults: foundContacts,
      searchableContacts: TinodeWeb.prepareSearchableContacts(this.state.chatList, foundContacts)
    });
  }

  /** Called when the user enters a contact into the contact search field in the NewAccount panel
    @param query {Array} is an array of contacts to search for
   */
  handleSearchContacts(query) {
    const fnd = this.tinode.getFndTopic();
    fnd.setMeta({desc: {public: query}}).then((ctrl) => {
      return fnd.getMeta(fnd.startMetaQuery().withSub().build());
    }).catch((err) => {
      this.handleError(err.message, 'err');
    });
  }

  // User clicked on a topic in the side panel or deleted a topic.
  handleTopicSelected(topicName) {
    // Clear newTopicParams after use.
    if (this.state.newTopicParams && this.state.newTopicParams._topicName != topicName) {
      this.setState({
        newTopicParams: null
      });
    }

    if (topicName) {
      this.setState({
        errorText: '',
        errorLevel: null,
        mobilePanel: 'topic-view',
        infoPanel: undefined
      });
      // Different topic selected.
      if (this.state.topicSelected != topicName) {
        this.setState({
          topicSelectedOnline: this.tinode.isTopicOnline(topicName),
          topicSelectedAcs: this.tinode.getTopicAccessMode(topicName),
          forwardMessage: null
        });
        HashNavigation.navigateTo(HashNavigation.setUrlTopic('', topicName));
      }
    } else {
      // Currently selected contact deleted
      this.setState({
        errorText: '',
        errorLevel: null,
        mobilePanel: 'sidepanel',
        topicSelectedOnline: false,
        topicSelectedAcs: null,
        infoPanel: undefined,
        forwardMessage: null
      });

      HashNavigation.navigateTo(HashNavigation.setUrlTopic('', null));
    }
  }

  // In mobile view user requested to show sidepanel
  handleHideMessagesView() {
    this.setState({
      mobilePanel: 'sidepanel'
    });
    HashNavigation.navigateTo(HashNavigation.setUrlTopic(window.location.hash, null));
  }

  // User is sending a message, either plain text or a drafty object, possibly
  // with attachments.
  //  - msg - Drafty message with content
  //  - promise - Promise to be resolved when the upload is completed
  //  - uploadCompletionPromise - for tracking progress
  //  - head - head dictionary to be attached to the message
  handleSendMessage(msg, uploadCompletionPromise, uploader, head) {
    const topic = this.tinode.getTopic(this.state.topicSelected);
    this.sendMessageToTopic(topic, msg, uploadCompletionPromise, uploader, head);
  }

  sendMessageToTopic(topic, msg, uploadCompletionPromise, uploader, head) {
    msg = topic.createMessage(msg, false);
    // The uploader is used to show progress.
    msg._uploader = uploader;

    if (head) {
      msg.head = Object.assign(msg.head || {}, head);
    }

    const completion = [];
    if (uploadCompletionPromise) {
      completion.push(uploadCompletionPromise);
    }

    if (!topic.isSubscribed()) {
      // Topic is not subscribed yet. Subscribe.
      const subscribePromise =
        topic.subscribe()
          .then(() => {
            // If there are unsent messages, try sending them now.
            topic.queuedMessages(pub => {
              if (pub._sending || pub.seq == msg.seq) {
                return;
              }
              if (topic.isSubscribed()) {
                topic.publishMessage(pub);
              }
            });
          });
      completion.push(subscribePromise);
    }

    topic.publishDraft(msg, Promise.all(completion))
      .then(_ => {
        if (topic.isArchived()) {
          topic.archive(false);
        }
      })
      .catch((err) => {
        this.handleError(err.message, 'err');
      });
  }

  handleNewChatInvitation(topicName, action) {
    const topic = this.tinode.getTopic(topicName);
    let response = null;
    switch (action) {
      case 'accept':
        // Accept given permissions.
        const mode = topic.getAccessMode().getGiven();
        response = topic.setMeta({sub: {mode: mode}});
        if (topic.isP2PType()) {
          // For P2P topics change 'given' permission of the peer too.
          // In p2p topics the other user has the same name as the topic.
          response = response.then((ctrl) => {
            topic.setMeta({sub: {user: topicName, mode: mode}});
          });
        }
        break;
      case 'delete':
        // Ignore invitation by deleting it.
        response = topic.delTopic(true);
        break;
      case 'block':
        // Ban the topic making futher invites impossible.
        // Just self-ban.
        const am = topic.getAccessMode().updateWant('-JP').getWant();
        response = topic.setMeta({sub: {mode: am}}).then((ctrl) => {
          return this.handleTopicSelected(null);
        });
        break;
      default:
        console.warn("Unknown invitation action", '"' + action + '""');
    }

    if (response != null) {
      response.catch((err) => {
        this.handleError(err.message, 'err');
      });
    }
  }

  // User chose a Sign Up menu item.
  handleNewAccount() {
    this.handleError();

    HashNavigation.navigateTo(HashNavigation.setUrlSidePanel(window.location.hash, 'register'));
  }

  // Actual registration of a new account.
  handleNewAccountRequest(login_, password_, public_, cred_, tags_) {
    // Clear old error, if any.
    this.handleError();

    this.tinode.connect(this.state.serverAddress)
      .then(() => {
        return this.tinode.createAccountBasic(login_, password_,
          {public: public_, tags: tags_, cred: Tinode.credential(cred_)});
      }).then((ctrl) => {
        if (ctrl.code >= 300 && ctrl.text == 'validate credentials') {
          this.handleCredentialsRequest(ctrl.params);
        } else {
          this.handleLoginSuccessful(this);
        }
      }).catch((err) => {
        this.handleError(err.message, 'err');
      });
  }

  handleToggleIncognitoMode(on) {
    // Make state undefined.
    this.setState({incognitoMode: null});

    const me = this.tinode.getMeTopic();
    const am = me.getAccessMode().updateWant(on ? '-P' : '+P').getWant();
    me.setMeta({sub: {mode: am}}).catch((err) => {
      // Request failed, keep existing state.
      this.setState({incognitoMode: !on});
      this.handleError(err.message, 'err');
    });
  }

  handleUpdateAccountTagsRequest(tags) {
    this.tinode.getMeTopic().setMeta({tags: tags})
      .catch((err) => {
        this.handleError(err.message, 'err');
      });
  }

  // User chose Settings menu item.
  handleSettings() {
    this.handleError();

    HashNavigation.navigateTo(HashNavigation.setUrlSidePanel(window.location.hash,
      this.state.myUserId ? 'edit' : 'settings'));
  }

  // User updated global parameters.
  handleGlobalSettings(settings) {
    const serverAddress = settings.serverAddress || this.state.serverAddress;
    const transport = settings.transport || this.state.transport;
    if (this.tinode) {
      this.tinode.clearStorage();
      this.tinode.onDisconnect = undefined;
      this.tinode.disconnect();
    }
    this.tinode = TinodeWeb.tnSetup(serverAddress, transport, this.props.intl.locale,
      LocalStorageUtil.getObject('keep-logged-in'));
    this.tinode.onConnect = this.handleConnected;
    this.tinode.onDisconnect = this.handleDisconnect;
    this.tinode.onAutoreconnectIteration = this.handleAutoreconnectIteration;

    this.setState({
      serverAddress: serverAddress,
      transport: transport
    });
    LocalStorageUtil.setObject('settings', {
      serverAddress: serverAddress,
      transport: transport
    });

    HashNavigation.navigateTo(HashNavigation.setUrlSidePanel(window.location.hash, ''));
  }

  // User chose 'Archived chats'.
  handleShowArchive() {
    HashNavigation.navigateTo(HashNavigation.setUrlSidePanel(window.location.hash,
      this.state.myUserId ? 'archive' : ''));
  }

  // User viewes 'Blocked chats'.
  handleShowBlocked() {
    HashNavigation.navigateTo(HashNavigation.setUrlSidePanel(window.location.hash,
      this.state.myUserId ? 'blocked' : ''));
  }

  toggleFCMToken(enabled) {
    if (enabled) {
      this.setState({desktopAlerts: null});
      if (!this.state.firebaseToken) {
        this.initFCMessaging();
      } else {
        this.setState({desktopAlerts: true});
        if (LocalStorageUtil.getObject('keep-logged-in')) {
          LocalStorageUtil.updateObject('settings', {desktopAlerts: true});
        }
      }
    } else if (this.state.firebaseToken && this.fcm) {
      firebaseDelToken(this.fcm).catch((err) => {
        console.error("Unable to delete token.", err);
      }).finally(() => {
        LocalStorageUtil.updateObject('settings', {desktopAlerts: false});
        localStorage.removeItem('firebase-token');
        this.setState({desktopAlerts: false, firebaseToken: null});
        // Inform the server that the token was deleted.
        this.tinode.setDeviceToken(null);
      });
    } else {
      this.setState({desktopAlerts: false, firebaseToken: null});
      LocalStorageUtil.updateObject('settings', {desktopAlerts: false});
    }
  }

  handleToggleMessageSounds(enabled) {
    this.setState({messageSounds: enabled});
    LocalStorageUtil.updateObject('settings', {
      messageSoundsOff: !enabled
    });
  }

  handleCredAdd(method, value) {
    const me = this.tinode.getMeTopic();
    me.setMeta({cred: {meth: method, val: value}}).catch((err) => {
      this.handleError(err.message, 'err');
    });
  }

  handleCredDelete(method, value) {
    const me = this.tinode.getMeTopic();
    me.delCredential(method, value).catch((err) => {
      this.handleError(err.message, 'err');
    });
  }

  handleCredConfirm(method, response) {
    this.handleCredentialsRequest({cred: [method]});
  }

  // User clicked Cancel button in Setting or Sign Up panel.
  handleSidepanelCancel() {
    const parsed = HashNavigation.parseUrlHash(window.location.hash);
    let path = '';
    if (['security','support','general','notif'].includes(parsed.path[0])) {
      path = 'edit';
    } else if ('crop' == parsed.path[0]) {
      path = 'general';
    } else if ('blocked' == parsed.path[0]) {
      path = 'security';
    } else if (this.state.myUserId) {
      path = 'contacts';
    }
    parsed.path[0] = path;
    if (parsed.params) {
      delete parsed.params.code;
      delete parsed.params.method;
      delete parsed.params.tab;
      delete parsed.params.scheme;
      delete parsed.params.token;
    }
    HashNavigation.navigateTo(HashNavigation.composeUrlHash(parsed.path, parsed.params));
    this.setState({errorText: '', errorLevel: null});
  }

  // Sidepanel navigator. No need to bind to 'this'.
  basicNavigator(hash) {
    HashNavigation.navigateTo(HashNavigation.setUrlSidePanel(window.location.hash, hash));
  }

  // Topic info navigator. No need to bind to 'this'.
  infoNavigator(hash) {
    HashNavigation.navigateTo(HashNavigation.setUrlInfoPanel(window.location.hash, hash));
  }

  // Request to start a topic, new or selected from search results, or "by ID".
  handleStartTopicRequest(topicName, newTopicParams, isChannel) {
    // Check if topic is indeed new. If not, launch it.
    if (topicName && this.tinode.isTopicCached(topicName)) {
      this.handleTopicSelected(topicName);
      return;
    }

    const params = {};
    if (Tinode.isP2PTopicName(topicName)) {
      // Because we are initialing the subscription, set 'want' to all permissions.
      params.sub = {mode: DEFAULT_P2P_ACCESS_MODE};
      // Give the other user all permissions too.
      params.desc = {defacs: {auth: DEFAULT_P2P_ACCESS_MODE}};
    } else {
      topicName = topicName || this.tinode.newGroupTopicName(isChannel);
      if (newTopicParams) {
        params.desc = {public: newTopicParams.public, private: {comment: newTopicParams.private}};
        params.tags = newTopicParams.tags;
      }
    }
    params._topicName = topicName;
    this.setState({newTopicParams: params}, () => {this.handleTopicSelected(topicName)});
  }

  // New topic was created, here is the new topic name.
  handleNewTopicCreated(oldName, newName) {
    if (this.state.topicSelected == oldName && oldName != newName) {
      // If the current URl contains the old topic name, replace it with new.
      // Update the name of the selected topic first so the navigator doen't clear
      // the state.
      this.setState({topicSelected: newName}, () => {
        HashNavigation.navigateTo(HashNavigation.setUrlTopic('', newName));
      });
    }
  }

  handleTopicUpdateRequest(topicName, pub, priv, defacs) {
    this.handleError();

    const topic = this.tinode.getTopic(topicName);
    if (topic) {
      const params = {};
      let attachments;
      if (pub) {
        if (pub.photo) {
          if (pub.photo.ref && pub.photo.ref != Tinode.DEL_CHAR) {
            attachments = [pub.photo.ref];
          } else if (!pub.photo.data || pub.photo.data == Tinode.DEL_CHAR) {
            pub.photo = Tinode.DEL_CHAR;
          }
        }
        params.public = pub;
      }

      if (typeof priv == 'string') {
        params.private = (priv === Tinode.DEL_CHAR) ?
          Tinode.DEL_CHAR : {comment: priv};
      }
      if (defacs) {
        params.defacs = defacs;
      }
      topic.setMeta({desc: params, attachments: attachments}).catch((err) => {
        this.handleError(err.message, 'err');
      });
    }
  }

  handleUnarchive(topicName) {
    const topic = this.tinode.getTopic(topicName);
    if (topic) {
      topic.archive(false);
    }
  }

  handleUpdatePasswordRequest(password)  {
    this.handleError();

    if (password) {
      this.tinode.updateAccountBasic(null, this.tinode.getCurrentLogin(), password).catch((err) => {
        this.handleError(err.message, 'err');
      });
    }
  }

  handleChangePermissions(topicName, mode, uid) {
    const topic = this.tinode.getTopic(topicName);
    if (topic) {
      const am = topic.getAccessMode();
      if (uid) {
        am.updateGiven(mode);
        mode = am.getGiven();
      } else {
        am.updateWant(mode);
        mode = am.getWant();
      }
      topic.setMeta({sub: {user: uid, mode: mode}}).catch((err) => {
        this.handleError(err.message, 'err');
      });
    }
  }

  handleTagsUpdateRequest(topicName, tags) {
    const topic = this.tinode.getTopic(topicName);
    if (topic) {
      topic.setMeta({tags: tags}).catch((err) => {
        this.handleError(err.message, 'err');
      });
    }
  }

  handleLogout() {
    updateFavicon(0);

    // Remove stored data.
    localStorage.removeItem('auth-token');
    localStorage.removeItem('firebase-token');
    localStorage.removeItem('settings');
    if (this.state.firebaseToken) {
      firebaseDelToken(this.fcm);
    }

    clearInterval(this.reconnectCountdown);

    let cleared;
    if (this.tinode) {
      cleared = this.tinode.clearStorage();
      this.tinode.onDisconnect = undefined;
      this.tinode.disconnect();
    } else {
      cleared = Promose.resolve();
    }
    this.setState(this.getBlankState());

    cleared.then(() => {
      this.tinode = TinodeWeb.tnSetup(this.state.serverAddress,
        this.state.transport, this.props.intl.locale, LocalStorageUtil.getObject('keep-logged-in'), () => {
          this.tinode.onConnect = this.handleConnected;
          this.tinode.onDisconnect = this.handleDisconnect;
          this.tinode.onAutoreconnectIteration = this.handleAutoreconnectIteration;
          HashNavigation.navigateTo('');
        })
    });
  }

  handleDeleteAccount() {
    this.tinode.delCurrentUser(true).then((ctrl) => {
      this.handleLogout();
    });
  }

  handleDeleteTopicRequest(topicName) {
    const topic = this.tinode.getTopic(topicName);
    if (!topic) {
      return;
    }

    // Request to hard-delete topic.
    topic.delTopic(true).then((ctrl) => {
      // Hide MessagesView and InfoView panels.
      HashNavigation.navigateTo(HashNavigation.setUrlTopic(window.location.hash, ''));
    }).catch((err) => {
      this.handleError(err.message, 'err');
    });
  }

  handleDeleteMessagesRequest(topicName) {
    const topic = this.tinode.getTopic(topicName);
    if (!topic) {
      return;
    }

    // Request hard-delete all messages.
    topic.delMessagesAll(true).catch((err) => {
      this.handleError(err.message, 'err');
    });
  }

  handleLeaveUnsubRequest(topicName) {
    const topic = this.tinode.getTopic(topicName);
    if (!topic) {
      return;
    }

    topic.leave(true).then((ctrl) => {
      // Hide MessagesView and InfoView panels.
      HashNavigation.navigateTo(HashNavigation.setUrlTopic(window.location.hash, ''));
    }).catch((err) => {
      this.handleError(err.message, 'err');
    });
  }

  handleBlockTopicRequest(topicName) {
    const topic = this.tinode.getTopic(topicName);
    if (!topic) {
      return;
    }

    topic.updateMode(null, '-JP').then(_ => {
      // Hide MessagesView and InfoView panels.
      HashNavigation.navigateTo(HashNavigation.setUrlTopic(window.location.hash, ''));
    }).catch((err) => {
      this.handleError(err.message, 'err');
    });
  }

  handleReportTopic(topicName) {
    const topic = this.tinode.getTopic(topicName);
    if (!topic) {
      return;
    }

    // Publish spam report.
    this.tinode.report('report', topicName);

    // Remove J and P permissions.
    topic.updateMode(null, '-JP').then((ctrl) => {
      // Hide MessagesView and InfoView panels.
      HashNavigation.navigateTo(HashNavigation.setUrlTopic(window.location.hash, ''));
    }).catch((err) => {
      this.handleError(err.message, 'err');
    });
  }

  handleShowContextMenu(params, menuItems) {
    this.setState({
      contextMenuVisible: true,
      contextMenuClickAt: {x: params.x, y: params.y},
      contextMenuParams: params,
      contextMenuItems: menuItems || this.defaultTopicContextMenu(params.topicName),
      contextMenuBounds: this.selfRef.current.getBoundingClientRect()
    });
  }

  //
  handleShowForwardDialog(params) {
    if (this.state.sidePanelSelected == 'newtpk') {
      // If the Find panel is active, close it.
      this.handleSidepanelCancel();
    }
    const header = '➦ ' + params.userName;
    const content = typeof params.content == 'string' ? Drafty.init(params.content) : Drafty.forwardedContent(params.content);
    const preview = Drafty.preview(content, FORWARDED_PREVIEW_LENGTH, true);
    const msg = Drafty.append(Drafty.appendLineBreak(Drafty.mention(header, params.userFrom)), content);
    const msgPreview = Drafty.quote(header, params.userFrom, preview);

    const head = {
      forwarded: params.topicName + ':' + params.seq
    };
    this.setState({
      forwardDialogVisible: true,
      forwardMessage: { head: head, msg: msg, preview: msgPreview }
    });
  }

  defaultTopicContextMenu(topicName) {
    const topic = this.tinode.getTopic(topicName);

    if (topic._deleted) {
      return [
        'topic_delete'
      ];
    }

    let muted = false, blocked = false, self_blocked = false, subscribed = false, deleter = false, archived = false;
    if (topic) {
      subscribed = topic.isSubscribed();
      archived = topic.isArchived();

      const acs = topic.getAccessMode();
      if (acs) {
        muted = acs.isMuted();
        blocked = !acs.isJoiner();
        self_blocked = !acs.isJoiner('want');
        deleter = acs.isDeleter();
      }
    }

    return [
      subscribed ? {
        title: this.props.intl.formatMessage(messages.menu_item_info),
        handler: this.handleShowInfoView
      } : null,
      subscribed ? 'messages_clear' : null,
      subscribed && deleter ? 'messages_clear_hard' : null,
      muted ? (blocked ? null : 'topic_unmute') : 'topic_mute',
      self_blocked ? 'topic_unblock' : 'topic_block',
      archived ? 'topic_restore' : 'topic_archive',
      'topic_delete'
    ];
  }

  handleHideContextMenu() {
    this.setState({
      contextMenuVisible: false,
      contextMenuClickAt: null,
      contextMenuParams: null,
      contextMenuBounds: null
    });
  }

  handleHideForwardDialog(keepForwardedMessage) {
    this.setState({
      forwardDialogVisible: false,
      forwardMessage: keepForwardedMessage ? this.state.forwardMessage : null
    });
  }

  handleContextMenuAction(action, promise, params) {
    if (action == 'topic_archive') {
      if (promise && params.topicName && params.topicName == this.state.topicSelected) {
        promise.then(() => {
          this.handleTopicSelected(null);
        });
      }
    } else if (action == 'menu_item_forward') {
      this.handleShowForwardDialog(params);
    }
  }

  handleShowAlert(title, content, onConfirm, confirmText, onReject, rejectText) {
    this.setState({
      alertVisible: true,
      alertParams: {
        title: title,
        content: content,
        onConfirm: onConfirm,
        confirm: confirmText,
        onReject: onReject,
        reject: rejectText
      }
    });
  }

  handleShowInfoView() {
    HashNavigation.navigateTo(HashNavigation.addUrlParam(window.location.hash, 'info', 'info'));
    this.setState({infoPanel: 'info'});
  }

  handleMemberUpdateRequest(topicName, added, removed) {
    if (!topicName) {
      return;
    }

    const topic = this.tinode.getTopic(topicName);
    if (!topic) {
      return;
    }

    if (added && added.length > 0) {
      added.map((uid) => {
        topic.invite(uid, null).catch((err) => {
          this.handleError(err.message, 'err');
        });
      });
    }

    if (removed && removed.length > 0) {
      removed.map((uid) => {
        topic.delSubscription(uid).catch((err) => {
          this.handleError(err.message, 'err');
        });
      });
    }
  }

  handleValidateCredentialsRequest(cred, code) {
    if (this.tinode.isAuthenticated()) {
      const me = this.tinode.getMeTopic();
      me.setMeta({cred: {meth: cred, resp: code}})
        .then(() => {
          HashNavigation.navigateTo('');
        })
        .catch((err) => {
          this.handleError(err.message, 'err');
        });
    } else {
      this.setState({credMethod: cred, credCode: code});
      this.doLogin(null, null, {meth: cred, resp: code});
    }
  }

  handlePasswordResetRequest(method, value) {
    // If already connected, connnect() will return a resolved promise.
    return this.tinode.connect()
      .then(() => {
        return this.tinode.requestResetAuthSecret('basic', method, value);
      })
      .catch((err) => {
        // Socket error
        this.handleError(err.message, 'err');
      });
  }

  handleResetPassword(scheme, newPassword, token) {
    token = base64ReEncode(token);
    if (!token) {
      this.handleError(this.props.intl.formatMessage(messages.invalid_security_token), 'err');
    } else {
      this.tinode.connect()
        .then(() => {
          return this.tinode.updateAccountBasic(null, null, newPassword, {token: token});
        })
        .then(() => {
          HashNavigation.navigateTo('');
        })
        .catch((err) => {
          // Socket error
          this.handleError(err.message, 'err');
        });
    }
  }

  render() {
    return (
      <div id="app-container" ref={this.selfRef}>
        {this.state.contextMenuVisible ?
          <ContextMenu
            tinode={this.tinode}
            bounds={this.state.contextMenuBounds}
            clickAt={this.state.contextMenuClickAt}
            params={this.state.contextMenuParams}
            items={this.state.contextMenuItems}
            hide={this.handleHideContextMenu}
            onShowAlert={this.handleShowAlert}
            onAction={this.handleContextMenuAction}
            onTopicRemoved={(topicName) => {
              if (topicName == this.state.topicSelected) {
                this.handleTopicSelected(null);
              }
            }}
            onError={this.handleError} />
          :
          null
        }
        {this.state.forwardDialogVisible ?
          <ForwardDialog
            tinode={this.tinode}
            contacts={this.state.chatList}
            topicSelected={this.state.topicSelected}
            myUserId={this.state.myUserId}

            hide={this.handleHideForwardDialog}
            onInitFind={this.tnInitFind}
            searchResults={this.state.searchResults}
            onSearchContacts={this.handleSearchContacts}
            onTopicSelected={this.handleStartTopicRequest}
          />
          :
          null
        }
        <Alert
          visible={this.state.alertVisible}
          title={this.state.alertParams.title}
          content={this.state.alertParams.content}
          onReject={this.state.alertParams.onReject ? (() => { this.setState({alertVisible: false}); }) : null}
          reject={this.state.alertParams.reject}
          onConfirm={() => { this.setState({alertVisible: false}); this.state.alertParams.onConfirm(); }}
          confirm={this.state.alertParams.confirm}
          />
        <SidepanelView
          tinode={this.tinode}
          connected={this.state.connected}
          displayMobile={this.state.displayMobile}
          hideSelf={this.state.displayMobile && this.state.mobilePanel !== 'sidepanel'}
          state={this.state.sidePanelSelected}
          title={this.state.sidePanelTitle}
          avatar={this.state.sidePanelAvatar}
          trustedBadges={this.state.myTrustedBadges}
          login={this.state.login}
          persist={this.state.persist}
          myUserId={this.state.myUserId}
          loginDisabled={this.state.loginDisabled}
          loadSpinnerVisible={this.state.loadSpinnerVisible}

          errorText={this.state.errorText}
          errorLevel={this.state.errorLevel}
          errorAction={this.state.errorAction}
          errorActionText={this.state.errorActionText}

          topicSelected={this.state.topicSelected}
          chatList={this.state.chatList}
          credMethod={this.state.credMethod}
          credCode={this.state.credCode}

          transport={this.state.transport}
          messageSounds={this.state.messageSounds}
          desktopAlerts={this.state.desktopAlerts}
          desktopAlertsEnabled={this.state.desktopAlertsEnabled}
          incognitoMode={this.state.incognitoMode}
          serverAddress={this.state.serverAddress}
          serverVersion={this.state.serverVersion}

          onGlobalSettings={this.handleGlobalSettings}
          onSignUp={this.handleNewAccount}
          onSettings={this.handleSettings}
          onNavigate={this.basicNavigator}
          onLoginRequest={this.handleLoginRequest}
          onPersistenceChange={this.handlePersistenceChange}
          onCreateAccount={this.handleNewAccountRequest}
          onUpdateAccountDesc={this.handleTopicUpdateRequest}
          onUpdatePassword={this.handleUpdatePasswordRequest}
          onUpdateAccountTags={this.handleUpdateAccountTagsRequest}
          onTogglePushNotifications={this.toggleFCMToken}
          onToggleMessageSounds={this.handleToggleMessageSounds}
          onToggleIncognitoMode={this.handleToggleIncognitoMode}
          onCredAdd={this.handleCredAdd}
          onCredDelete={this.handleCredDelete}
          onCredConfirm={this.handleCredConfirm}
          onTopicSelected={this.handleTopicSelected}
          onCreateTopic={this.handleStartTopicRequest}
          onLogout={this.handleLogout}
          onDeleteAccount={this.handleDeleteAccount}
          onShowAlert={this.handleShowAlert}
          onCancel={this.handleSidepanelCancel}
          onError={this.handleError}
          onValidateCredentials={this.handleValidateCredentialsRequest}
          onPasswordResetRequest={this.handlePasswordResetRequest}
          onResetPassword={this.handleResetPassword}
          onShowArchive={this.handleShowArchive}
          onShowBlocked={this.handleShowBlocked}

          onInitFind={this.tnInitFind}
          searchResults={this.state.searchResults}
          onSearchContacts={this.handleSearchContacts}

          showContextMenu={this.handleShowContextMenu} />

        <MessagesView
          tinode={this.tinode}
          connected={this.state.connected}
          ready={this.state.ready}
          online={this.state.topicSelectedOnline}
          acs={this.state.topicSelectedAcs}
          displayMobile={this.state.displayMobile}
          viewportWidth={this.state.viewportWidth}
          viewportHeight={this.state.viewportHeight}
          hideSelf={this.state.displayMobile &&
            (this.state.mobilePanel !== 'topic-view' || this.state.infoPanel)}
          topic={this.state.topicSelected}
          myUserId={this.state.myUserId}
          // User public.fn.
          myUserName={this.state.sidePanelTitle}
          serverVersion={this.state.serverVersion}
          serverAddress={this.state.serverAddress}
          applicationVisible={this.state.applicationVisible}

          forwardMessage={this.state.forwardMessage}
          onCancelForwardMessage={this.handleHideForwardDialog}

          errorText={this.state.errorText}
          errorLevel={this.state.errorLevel}
          errorAction={this.state.errorAction}
          errorActionText={this.state.errorActionText}

          newTopicParams={this.state.newTopicParams}

          onHideMessagesView={this.handleHideMessagesView}
          onData={this.tnData}
          onError={this.handleError}
          onNewTopicCreated={this.handleNewTopicCreated}
          showContextMenu={this.handleShowContextMenu}
          onChangePermissions={this.handleChangePermissions}
          onNewChat={this.handleNewChatInvitation}
          sendMessage={this.handleSendMessage} />

        {this.state.infoPanel ?
          <InfoView
            tinode={this.tinode}
            connected={this.state.connected}
            displayMobile={this.state.displayMobile}
            topic={this.state.topicSelected}
            searchableContacts={this.state.searchableContacts}
            myUserId={this.state.myUserId}
            panel={this.state.infoPanel}

            errorText={this.state.errorText}
            errorLevel={this.state.errorLevel}
            errorAction={this.state.errorAction}
            errorActionText={this.state.errorActionText}

            onNavigate={this.infoNavigator}
            onTopicDescUpdateRequest={this.handleTopicUpdateRequest}
            onShowAlert={this.handleShowAlert}
            onChangePermissions={this.handleChangePermissions}
            onMemberUpdateRequest={this.handleMemberUpdateRequest}
            onDeleteTopic={this.handleDeleteTopicRequest}
            onDeleteMessages={this.handleDeleteMessagesRequest}
            onLeaveTopic={this.handleLeaveUnsubRequest}
            onBlockTopic={this.handleBlockTopicRequest}
            onReportTopic={this.handleReportTopic}
            onAddMember={this.handleManageGroupMembers}
            onTopicTagsUpdateRequest={this.handleTagsUpdateRequest}
            onTopicUnArchive={this.handleUnarchive}
            onInitFind={this.tnInitFind}
            onError={this.handleError}

            showContextMenu={this.handleShowContextMenu}
            />
          :
          null
        }
      </div>
    );
  }
};

export default injectIntl(TinodeWeb);

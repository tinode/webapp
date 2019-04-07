// The top-level class to hold all functionality together.
import React from 'react';
import ReactDOM from 'react-dom';
import { defineMessages, injectIntl } from 'react-intl';

import * as firebase from 'firebase/app';
import 'firebase/messaging';

import Tinode from 'tinode-sdk';

import ContextMenu from '../widgets/context-menu.jsx';

import InfoView from './info-view.jsx';
import MessagesView from './messages-view.jsx';
import SidepanelView from './sidepanel-view.jsx';

import { API_KEY, APP_NAME, DEFAULT_ACCESS_MODE, MEDIA_BREAKPOINT, READ_DELAY, RECEIVED_DELAY } from '../config.js';
import { base64ReEncode, makeImageUrl } from '../lib/blob-helpers.js';
import { detectServerAddress, isLocalHost, isSecureConnection } from '../lib/host-name.js';
import LocalStorageUtil from '../lib/local-storage.js';
import HashNavigation from '../lib/navigation.js';
import { secondsToTime } from '../lib/strformat.js'
import { updateFavicon } from '../lib/utils.js';

// Sound to play on message received.
const POP_SOUND = new Audio('audio/msg.mp3');

const messages = defineMessages({
  update_available: {
    id: 'update_available',
    defaultMessage: 'Update available. <a href="">Reload</a>.',
    description: 'Message shown when an app update is available.'
  },
  reconnect_countdown: {
    id: 'reconnect_countdown',
    defaultMessage: 'Disconnected. Reconnecting in {seconds}…',
    description: 'Message shown when an app update is available.'
  },
  reconnect_now: {
    id: 'reconnect_now',
    defaultMessage: 'Try now',
    description: 'Prompt for reconnecting now'
  }
});

class TinodeWeb extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.getBlankState();

    this.handleResize = this.handleResize.bind(this);
    this.handleHashRoute = this.handleHashRoute.bind(this);
    this.handleOnline = this.handleOnline.bind(this);
    this.checkForAppUpdate = this.checkForAppUpdate.bind(this);
    this.handleAppVisibility = this.handleAppVisibility.bind(this);
    this.handleReadTimer = this.handleReadTimer.bind(this);
    this.handleVisibilityEvent = this.handleVisibilityEvent.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handleLoginRequest = this.handleLoginRequest.bind(this);
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
    this.handleUpdateAccountRequest = this.handleUpdateAccountRequest.bind(this);
    this.handleUpdateAccountTagsRequest = this.handleUpdateAccountTagsRequest.bind(this);
    this.handleSettings = this.handleSettings.bind(this);
    this.handleGlobalSettings = this.handleGlobalSettings.bind(this);
    this.handleShowArchive = this.handleShowArchive.bind(this);
    this.handleToggleMessageSounds = this.handleToggleMessageSounds.bind(this);
    this.initDesktopAlerts = this.initDesktopAlerts.bind(this);
    this.togglePushToken = this.togglePushToken.bind(this);
    this.requestPushToken = this.requestPushToken.bind(this);
    this.handleSidepanelCancel = this.handleSidepanelCancel.bind(this);
    this.handleNewTopic = this.handleNewTopic.bind(this);
    this.handleNewTopicRequest = this.handleNewTopicRequest.bind(this);
    this.handleNewTopicCreated = this.handleNewTopicCreated.bind(this);
    this.handleTopicUpdateRequest = this.handleTopicUpdateRequest.bind(this);
    this.handleChangePermissions = this.handleChangePermissions.bind(this);
    this.handleTagsUpdated = this.handleTagsUpdated.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleLeaveUnsubRequest = this.handleLeaveUnsubRequest.bind(this);
    this.handleDialogCancel = this.handleDialogCancel.bind(this);
    this.handleShowContextMenu = this.handleShowContextMenu.bind(this);
    this.defaultTopicContextMenu = this.defaultTopicContextMenu.bind(this);
    this.handleHideContextMenu = this.handleHideContextMenu.bind(this);
    this.handleShowInfoView = this.handleShowInfoView.bind(this);
    this.handleHideInfoView = this.handleHideInfoView.bind(this);
    this.handleMemberUpdateRequest = this.handleMemberUpdateRequest.bind(this);
    this.handleValidateCredentialsRequest = this.handleValidateCredentialsRequest.bind(this);
    this.handlePasswordResetRequest = this.handlePasswordResetRequest.bind(this);
    this.handleResetPassword = this.handleResetPassword.bind(this);
    this.handleContextMenuAction = this.handleContextMenuAction.bind(this);
  }

  getBlankState() {
    const settings = LocalStorageUtil.getObject('settings') || {};

    return {
      connected: false,
      // Connected and subscribed to 'me'
      ready: false,
      transport: settings.transport || null,
      serverAddress: settings.serverAddress || detectServerAddress(),
      serverVersion: "no connection",
      // "On" is the default, so saving the "off" state.
      messageSounds: !settings.messageSoundsOff,
      desktopAlerts: settings.desktopAlerts,
      desktopAlertsEnabled: (isSecureConnection() || isLocalHost()) &&
        (typeof firebase != 'undefined') && (typeof navigator != 'undefined') &&
        (typeof FIREBASE_INIT != 'undefined'),
      firebaseToken: LocalStorageUtil.getObject('firebase-token'),

      errorText: '',
      errorLevel: null,
      errorAction: undefined,
      errorActionText: null,

      sidePanelSelected: 'login',
      sidePanelTitle: null,
      sidePanelAvatar: null,
      dialogSelected: null,
      contextMenuVisible: false,
      login: '',
      password: '',
      myUserId: null,
      liveConnection: navigator.onLine,
      topicSelected: '',
      topicSelectedOnline: false,
      topicSelectedAcs: null,
      newTopicParams: null,
      loginDisabled: false,
      displayMobile: (window.innerWidth <= MEDIA_BREAKPOINT),
      showInfoPanel: false,
      mobilePanel: 'sidepanel',

      contextMenuVisible: false,
      contextMenuBounds: null,
      contextMenuClickAt: null,
      contextMenuParams: null,
      contextMenuItems: [],

      // Chats as shown in the ContactsView
      chatList: [],
      // Contacts returned by a search query.
      searchResults: [],
      // Merged results of a search query and p2p chats.
      searchableContacts: [],
      credMethod: undefined,
      credCode: undefined
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('online', (e) => { this.handleOnline(true); });
    window.addEventListener('offline', (e) => { this.handleOnline(false); });
    window.addEventListener('hashchange', this.handleHashRoute);
    // Window/tab visible or invisible for pausing timers.
    document.addEventListener('visibilitychange', this.handleVisibilityEvent);

    this.setState({
      viewportWidth: document.documentElement.clientWidth,
      viewportHeight: document.documentElement.clientHeight
    });

    this.tinode = TinodeWeb.tnSetup(this.state.serverAddress, this.state.transport);
    this.tinode.onConnect = this.handleConnected;
    this.tinode.onDisconnect = this.handleDisconnect;
    this.tinode.onAutoreconnectIteration = this.handleAutoreconnectIteration;

    // Initialize desktop alerts.
    if (this.state.desktopAlertsEnabled) {
      try {
        this.fbPush = firebase.initializeApp(FIREBASE_INIT, APP_NAME).messaging();
        this.fbPush.usePublicVapidKey(FIREBASE_INIT.messagingVapidKey);
        navigator.serviceWorker.register('/service-worker.js').then((reg) => {
          this.checkForAppUpdate(reg);
          this.fbPush.useServiceWorker(reg);
          this.initDesktopAlerts();
          if (this.state.desktopAlerts) {
            if (!this.state.firebaseToken) {
              this.togglePushToken(true);
            } else {
              this.tinode.setDeviceToken(this.state.firebaseToken, true);
            }
          }
        }).catch((err) => {
          // registration failed :(
          console.log("Failed to register service worker:", err);
        });
      } catch (err) {
        this.handleError("Failed to initialize push notifications", 'err');
        console.log("Failed to initialize push notifications", err);
        this.setState({desktopAlertsEnabled: false});
      }
    }

    const token = LocalStorageUtil.getObject('keep-logged-in') ?
      LocalStorageUtil.getObject('auth-token') : undefined;

    const parsedNav = HashNavigation.parseUrlHash(window.location.hash);
    if (token) {
      // When reading from storage, date is returned as string.
      token.expires = new Date(token.expires);
      this.tinode.setAuthToken(token);
      this.tinode.connect().catch((err) => {
        // Socket error
        this.handleError(err.message, 'err');
      });
      delete parsedNav.params.info;
      delete parsedNav.params.tab;
      parsedNav.path[0] = '';
      HashNavigation.navigateTo(HashNavigation.composeUrlHash(parsedNav.path, parsedNav.params));
    } else if (!parsedNav.params.token) {
      HashNavigation.navigateTo('');
    }

    this.readTimer = null;
    this.readTimerCallback = null;

    this.handleHashRoute();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('hashchange', this.handleHashRoute);
    document.removeEventListener('visibilitychange', this.handleVisibilityEvent);
  }

  // Setup transport (usually websocket) and server address. This will terminate connection with the server.
  static tnSetup(serverAddress, transport) {
    let tinode = new Tinode(APP_NAME, serverAddress, API_KEY, transport, isSecureConnection());
    tinode.enableLogging(true, true);
    return tinode;
  }

  handleResize() {
    var mobile = document.documentElement.clientWidth <= MEDIA_BREAKPOINT;
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
    const {formatHTMLMessage} = this.props.intl;
    reg.onupdatefound = () => {
      const installingWorker = reg.installing;
      installingWorker.onstatechange = () => {
        if (installingWorker.state == 'installed' && navigator.serviceWorker.controller) {
          this.handleError(formatHTMLMessage(messages.update_available), 'info');
        }
      }
    }
  }

  // Handle for hashchange event: display appropriate panels.
  handleHashRoute() {
    var hash = HashNavigation.parseUrlHash(window.location.hash);
    if (hash.path && hash.path.length > 0) {
      // Left-side panel selector.
      if (['register','settings','edit','cred','reset','newtpk','archive','contacts',''].includes(hash.path[0])) {
        this.setState({sidePanelSelected: hash.path[0]});
      } else {
        console.log("Unknown sidepanel view", hash.path[0]);
      }

      // Topic for MessagesView selector.
      if (hash.path.length > 1 && hash.path[1] != this.state.topicSelected) {
        this.setState({
          topicSelected: Tinode.topicType(hash.path[1]) ? hash.path[1] : null
        });
      }
    } else {
      // Empty hashpath
      this.setState({sidePanelSelected: ''});
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
      showInfoPanel: hash.params.info,
      newTopicTabSelected: hash.params.tab
    });
  }

  handleOnline(online) {
    var newState = {liveConnection: online};
    if (online) {
      this.handleError('', null);
    } else {
      this.handleError("No connection", 'warn');
    }
    this.setState({liveConnection: online});
  }

  // Handling read notifications here to be able to pause
  // them then the window/tab is not visible.
  handleAppVisibility(visible, callback) {
    clearTimeout(this.readTimer);
    this.readTimerCallback = callback;
    if (visible && callback) {
      this.readTimer = setTimeout(callback, READ_DELAY);
    } else {
      this.readTimer = null;
    }
  }

  handleReadTimer(callback) {
    this.handleAppVisibility(!document.hidden, callback);
  }

  handleVisibilityEvent() {
    this.handleAppVisibility(!document.hidden, this.readTimerCallback);
  }

  handleError(err, level, action, actionText) {
    this.setState({errorText: err, errorLevel: level, errorAction: action, errorActionText: actionText});
  }

  // User clicked Login button in the side panel.
  handleLoginRequest(login, password) {
    this.setState({loginDisabled: true, login: login, password: password});
    this.handleError('', null);

    if (this.tinode.isConnected()) {
      this.doLogin(login, password, {meth: this.state.credMethod, resp: this.state.credCode});
    } else {
      this.tinode.connect().catch((err) => {
        // Socket error
        this.setState({loginDisabled: false});
        this.handleError(err.message, 'err');
      });
    }
  }

  // Connection succeeded.
  handleConnected() {
    var params = this.tinode.getServerInfo();
    this.setState({
      serverVersion: params.ver + ' ' + (params.build ? params.build : 'none') + '; '
    });
    this.doLogin(this.state.login, this.state.password, {meth: this.state.credMethod, resp: this.state.credCode});
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

    const {formatHTMLMessage} = this.props.intl;
    let count = sec / 1000;
    count = count | count;
    this.reconnectCountdown = setInterval(() => {
      const timeLeft = (count > 99) ? secondsToTime(count) : count;
      this.handleError(
        formatHTMLMessage(messages.reconnect_countdown, {seconds: timeLeft}),
        'warn',
        () => {
          clearInterval(this.reconnectCountdown);
          this.tinode.reconnect();
        },
        formatHTMLMessage(messages.reconnect_now)
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
      dialogSelected: null,
      errorText: err && err.message ? err.message : "Disconnected",
      errorLevel: err && err.message ? 'err' : 'warn',
      loginDisabled: false,
      contextMenuVisible: false,
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
      this.setState({password: null});
      promise = this.tinode.loginBasic(login, password, cred);
    } else if (token) {
      promise = this.tinode.loginToken(token.token, cred);
    }

    if (promise) {
      promise.then((ctrl) => {
        if (ctrl.code >= 300 && ctrl.text === 'validate credentials') {
          if (cred) {
            this.handleError("Code does not match", 'warn');
          }
          this.handleCredentialsRequest(ctrl.params);
        } else {
          this.handleLoginSuccessful();
        }
      }).catch((err) => {
        // Login failed, report error.
        this.setState({loginDisabled: false, credMethod: undefined, credCode: undefined});
        this.handleError(err.message, 'err');
        localStorage.removeItem('auth-token');
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
    var parsed = HashNavigation.parseUrlHash(window.location.hash);
    parsed.path[0] = 'cred';
    parsed.params['method'] = params.cred[0];
    HashNavigation.navigateTo(HashNavigation.composeUrlHash(parsed.path, parsed.params));
  }

  handleLoginSuccessful() {
    this.handleError('', null);

    // Refresh authentication token.
    if (LocalStorageUtil.getObject('keep-logged-in')) {
      LocalStorageUtil.setObject('auth-token', this.tinode.getAuthToken());
    }
    // Logged in fine, subscribe to 'me' attaching callbacks from the contacts view.
    var me = this.tinode.getMeTopic();
    me.onMetaDesc = this.tnMeMetaDesc;
    me.onContactUpdate = this.tnMeContactUpdate;
    me.onSubsUpdated = this.tnMeSubsUpdated;
    this.setState({
      connected: true,
      credMethod: undefined,
      credCode: undefined,
      myUserId: this.tinode.getCurrentUserID()
    });
    // Subscribe, fetch topic desc, the list of subscriptions. Messages are not fetched.
    me.subscribe(
      me.startMetaQuery().
        withLaterSub().
        withDesc().
        build()
      ).catch((err) => {
        localStorage.removeItem('auth-token');
        this.handleError(err.message, 'err');
        HashNavigation.navigateTo('');
      });
    HashNavigation.navigateTo(HashNavigation.setUrlSidePanel(window.location.hash, 'contacts'));
  }

  tnMeMetaDesc(desc) {
    if (desc && desc.public) {
      this.setState({
        sidePanelTitle: desc.public.fn,
        sidePanelAvatar: makeImageUrl(desc.public.photo)
      });
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
      // New message received
      // Skip update if the topic is currently open, otherwise the badge will annoyingly flash.
      if (this.state.topicSelected != cont.topic) {
        if (this.state.messageSounds) {
          POP_SOUND.play();
        }
        this.resetContactList();
      } else if (document.hidden && this.state.messageSounds) {
        POP_SOUND.play();
      }
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
      // messages deleted (hard or soft) -- update pill counter.
    } else {
      // TODO(gene): handle other types of notifications:
      // * ua -- user agent changes (maybe display a pictogram for mobile/desktop).
      // * upd -- topic 'public' updated, issue getMeta().
      console.log("Unsupported (yet) presence update:" + what + " in: " + cont.topic);
    }
  }

  tnMeSubsUpdated(unused) {
    this.resetContactList();
  }

  // Merge search results and contact list to create a single flat
  // list of kown contacts for GroupManager to use.
  static prepareSearchableContacts(chatList, foundContacts) {
    let merged = {};

    // For chatList topics merge only p2p topics and convert them to the
    // same format as foundContacts.
    for (const c of chatList) {
      if (Tinode.topicType(c.topic) == 'p2p') {
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
      newState.chatList.push(c);
      if (this.state.topicSelected == c.topic) {
        newState.topicSelectedOnline = c.online;
        newState.topicSelectedAcs = c.acs;
      }
    });
    // Merge search results and chat list.
    newState.searchableContacts = TinodeWeb.prepareSearchableContacts(newState.chatList, this.state.searchResults);
    this.setState(newState);
  }

  // Sending "received" notifications
  tnData(data) {
    const topic = this.tinode.getTopic(data.topic);
    if (topic.msgStatus(data) >= Tinode.MESSAGE_STATUS_SENT && data.from != this.state.myUserId) {
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
      fnd.subscribe(fnd.startMetaQuery().withSub().withTags().build()).catch((err) => {
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

  // User clicked on a contact in the side panel or deleted a contact.
  handleTopicSelected(topicName, unused_index, online, acs) {
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
        showInfoPanel: false
      });
      // Different contact selected.
      if (this.state.topicSelected != topicName) {
        this.setState({
          topicSelectedOnline: online,
          topicSelectedAcs: acs
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
        showInfoPanel: false
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
  handleSendMessage(msg, promise, uploader) {
    const topic = this.tinode.getTopic(this.state.topicSelected);

    msg = topic.createMessage(msg, false);
    // The uploader is used to show progress.
    msg._uploader = uploader;

    if (!topic.isSubscribed()) {
      if (!promise) {
        promise = Promise.resolve();
      }
      promise = promise.then(() => { return topic.subscribe(); });
    }

    if (promise) {
      promise = promise.catch((err) => {
        this.handleError(err.message, 'err');
      });
    }

    topic.publishDraft(msg, promise)
      .then((ctrl) => {
        if (topic.isArchived()) {
          return topic.archive(false);
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
        if (topic.getType() == 'p2p') {
          // For P2P topics change 'given' permission of the peer too.
          // In p2p topics the other user has the same name as the topic.
          response = response.then((ctrl) => {
            topic.setMeta({sub: {user: topicName, mode: mode}});
          });
        }
        break;
      case 'delete':
        // Ignore invitation by deleting it.
        response = topic.delTopic();
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
        console.log("Unknown invitation action", '"' + action + '""');
    }

    if (response != null) {
      response.catch((err) => {
        this.handleError(err.message, 'err');
      });
    }
  }

  // User chose a Sign Up menu item.
  handleNewAccount() {
    HashNavigation.navigateTo(HashNavigation.setUrlSidePanel(window.location.hash, 'register'));
  }

  // Actual registration of a new account.
  handleNewAccountRequest(login_, password_, public_, cred_, tags_) {
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

  handleUpdateAccountRequest(password, pub, defacs) {
    if (pub || defacs) {
      const params = {};
      if (pub) {
        params.public = pub;
      }
      if (defacs) {
        params.defacs = defacs;
      }
      this.tinode.getMeTopic().setMeta({desc: params}).catch((err) => {
        this.handleError(err.message, 'err');
      });
    }
    if (password) {
      this.tinode.updateAccountBasic(null, this.tinode.getCurrentLogin(), password).catch((err) => {
        this.handleError(err.message, 'err');
      });
    }
  }

  handleUpdateAccountTagsRequest(tags) {
    this.tinode.getFndTopic().setMeta({tags: tags})
      .catch((err) => {
        this.handleError(err.message, 'err');
      });
  }

  // User chose Settings menu item.
  handleSettings() {
    HashNavigation.navigateTo(HashNavigation.setUrlSidePanel(window.location.hash,
      this.state.myUserId ? 'edit' : 'settings'));
  }

  // User updated global parameters.
  handleGlobalSettings(settings) {
    let serverAddress = settings.serverAddress || this.state.serverAddress;
    let transport = settings.transport || this.state.transport;
    if (this.tinode) {
      this.tinode.onDisconnect = undefined;
      this.tinode.disconnect();
    }
    this.tinode = TinodeWeb.tnSetup(serverAddress, transport);
    this.tinode.onConnect = this.handleConnected;
    this.tinode.onDisconnect = this.handleDisconnect;

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

  // Initialize desktop alerts = push notifications.
  initDesktopAlerts() {
    // Google could not be bothered to mention that
    // onTokenRefresh is never called.
    this.fbPush.onTokenRefresh(() => {
      this.requestPushToken();
    });

    this.fbPush.onMessage((payload) => {
      // No need to do anything about it.
      // All the magic happends in the service worker.
    });
  }

  togglePushToken(enabled) {
    if (enabled) {
      if (!this.state.firebaseToken) {
        this.fbPush.requestPermission().then(() => {
          this.requestPushToken();
        }).catch((err) => {
          this.handleError(err.message, 'err');
          this.setState({desktopAlerts: false, firebaseToken: null});
          LocalStorageUtil.updateObject('settings', {desktopAlerts: false});
          console.log("Failed to get permission to notify.", err);
        });
      } else {
        this.setState({desktopAlerts: true});
        LocalStorageUtil.updateObject('settings', {desktopAlerts: true});
      }
    } else if (this.state.firebaseToken) {
      this.fbPush.deleteToken(this.state.firebaseToken).catch((err) => {
        console.log("Unable to delete token.", err);
      }).finally(() => {
        LocalStorageUtil.updateObject('settings', {desktopAlerts: false});
        localStorage.removeItem('firebase-token');
        this.setState({desktopAlerts: false, firebaseToken: null});
      });
    } else {
      this.setState({desktopAlerts: false, firebaseToken: null});
      LocalStorageUtil.updateObject('settings', {desktopAlerts: false});
    }
  }

  requestPushToken() {
    this.fbPush.getToken().then((refreshedToken) => {
      if (refreshedToken != this.state.firebaseToken) {
        this.tinode.setDeviceToken(refreshedToken, true);
        LocalStorageUtil.setObject('firebase-token', refreshedToken);
      }
      this.setState({firebaseToken: refreshedToken, desktopAlerts: true});
      LocalStorageUtil.updateObject('settings', {desktopAlerts: true});
    }).catch((err) => {
      this.handleError(err.message, 'err');
      console.log("Failed to retrieve firebase token", err);
    });
  }

  handleToggleMessageSounds(enabled) {
    this.setState({messageSounds: enabled});
    LocalStorageUtil.updateObject('settings', {
      messageSoundsOff: !enabled
    });
  }

  // User clicked Cancel button in Setting or Sign Up panel.
  handleSidepanelCancel() {
    const parsed = HashNavigation.parseUrlHash(window.location.hash);
    parsed.path[0] = this.state.myUserId ? 'contacts' : '';
    if (parsed.params) {
      delete parsed.params.code;
      delete parsed.params.method;
      delete parsed.params.tab;
    }
    HashNavigation.navigateTo(HashNavigation.composeUrlHash(parsed.path, parsed.params));
    this.setState({errorText: '', errorLevel: null});
  }

  // User clicked a (+) menu item.
  handleNewTopic() {
    HashNavigation.navigateTo(HashNavigation.setUrlSidePanel(window.location.hash, 'newtpk'));
  }

  // Request to start a new topic. New P2P topic requires peer's name.
  handleNewTopicRequest(peerName, pub, priv, tags) {
    const topicName = peerName || this.tinode.newGroupTopicName();
    const params = {
      _topicName: topicName,
    };
    if (peerName) {
      // Because we are initialing the subscription, set 'want' to all permissions.
      params.sub = {mode: DEFAULT_ACCESS_MODE};
      // Give the other user all permissions too.
      params.desc = {defacs: {auth: DEFAULT_ACCESS_MODE}};
    } else {
      params.desc = {public: pub, private: {comment: priv}};
      params.tags = tags;
    }
    this.setState({newTopicParams: params}, () => {this.handleTopicSelected(topicName)});
  }

  // New topic was creted, here is the new topic name.
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

  handleTopicUpdateRequest(topicName, pub, priv, permissions) {
    const topic = this.tinode.getTopic(topicName);
    if (topic) {
      const params = {};
      if (pub) {
        params.public = pub;
      }
      if (priv) {
        params.private = (priv === Tinode.DEL_CHAR) ?
          Tinode.DEL_CHAR : {comment: priv};
      }
      if (permissions) {
        params.defacs = permissions;
      }
      topic.setMeta({desc: params}).catch((err) => {
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

  handleTagsUpdated(topicName, tags) {
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
      this.fbPush.deleteToken(this.state.firebaseToken)
    }

    if (this.tinode) {
      this.tinode.onDisconnect = undefined;
      this.tinode.disconnect();
    }
    this.setState(this.getBlankState());
    this.tinode = TinodeWeb.tnSetup(this.state.serverAddress, this.state.transport);
    this.tinode.onConnect = this.handleConnected;
    this.tinode.onDisconnect = this.handleDisconnect;
    HashNavigation.navigateTo('');
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

  handleDialogCancel() {
    this.setState({dialogSelected: null});
  }

  handleShowContextMenu(params, menuItems) {
    this.setState({
      contextMenuVisible: true,
      contextMenuClickAt: {x: params.x, y: params.y},
      contextMenuParams: params,
      contextMenuItems: menuItems || this.defaultTopicContextMenu(params.topicName),
      contextMenuBounds: ReactDOM.findDOMNode(this).getBoundingClientRect()
    });
  }

  defaultTopicContextMenu(topicName) {
    const topic = this.tinode.getTopic(topicName);
    const {formatMessage} = this.props.intl;

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
      subscribed ? {title: formatMessage({id: 'menu_item_info'}), handler: this.handleShowInfoView} : null,
      subscribed ? 'messages_clear' : null,
      subscribed && deleter ? 'messages_clear_hard' : null,
      muted ? (blocked ? null : 'topic_unmute') : 'topic_mute',
      self_blocked ? 'topic_unblock' : 'topic_block',
      !archived ? 'topic_archive' : null,
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

  handleContextMenuAction(action, promise, params) {
    if (action == 'topic_archive') {
      if (promise && params.topicName && params.topicName == this.state.topicSelected) {
        promise.then(() => {
          this.handleTopicSelected(null);
        });
      }
    }
  }

  handleShowInfoView() {
    HashNavigation.navigateTo(HashNavigation.addUrlParam(window.location.hash, 'info', true));
    this.setState({showInfoPanel: true});
  }

  handleHideInfoView() {
    HashNavigation.navigateTo(HashNavigation.removeUrlParam(window.location.hash, 'info'));
    this.setState({showInfoPanel: false});
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
    this.setState({credMethod: cred, credCode: code});
    this.doLogin(null, null, {meth: cred, resp: code});
  }

  handlePasswordResetRequest(method, value) {
    // If already connected, connnect() will return a resolved promise.
    this.tinode.connect()
      .then(() => {
        return this.tinode.requestResetAuthSecret('basic', method, value)
      })
      .catch((err) => {
        // Socket error
        this.handleError(err.message, 'err');
      });
  }

  handleResetPassword(scheme, newPassword, token) {
    token = base64ReEncode(token);
    if (!token)  {
      this.handleError("Invalid security token", 'err');
    } else {
      this.tinode.connect()
        .then(() => {
          return this.tinode.updateAccountBasic(null, null, newPassword, {token: token});
        })
        .catch((err) => {
          // Socket error
          this.handleError(err.message, 'err');
        });
    }
  }

  render() {
    return (
      <div id="app-container">
        {this.state.contextMenuVisible ?
          <ContextMenu
            tinode={this.tinode}
            bounds={this.state.contextMenuBounds}
            clickAt={this.state.contextMenuClickAt}
            params={this.state.contextMenuParams}
            items={this.state.contextMenuItems}
            hide={this.handleHideContextMenu}
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

        <SidepanelView
          tinode={this.tinode}
          connected={this.state.connected}
          displayMobile={this.state.displayMobile}
          hideSelf={this.state.displayMobile && this.state.mobilePanel !== 'sidepanel'}
          state={this.state.sidePanelSelected}
          title={this.state.sidePanelTitle}
          avatar={this.state.sidePanelAvatar}
          login={this.state.login}
          myUserId={this.state.myUserId}
          loginDisabled={this.state.loginDisabled}

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
          serverAddress={this.state.serverAddress}
          onGlobalSettings={this.handleGlobalSettings}

          onSignUp={this.handleNewAccount}
          onSettings={this.handleSettings}
          onLoginRequest={this.handleLoginRequest}
          onCreateAccount={this.handleNewAccountRequest}
          onUpdateAccount={this.handleUpdateAccountRequest}
          onUpdateAccountTags={this.handleUpdateAccountTagsRequest}
          onTogglePushNotifications={this.togglePushToken}
          onToggleMessageSounds={this.handleToggleMessageSounds}
          onTopicSelected={this.handleTopicSelected}
          onCreateTopic={this.handleNewTopicRequest}
          onNewTopic={this.handleNewTopic}
          onLogout={this.handleLogout}
          onCancel={this.handleSidepanelCancel}
          onError={this.handleError}
          onValidateCredentials={this.handleValidateCredentialsRequest}
          onPasswordResetRequest={this.handlePasswordResetRequest}
          onResetPassword={this.handleResetPassword}
          onShowArchive={this.handleShowArchive}

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
            (this.state.mobilePanel !== 'topic-view' || this.state.showInfoPanel)}
          topic={this.state.topicSelected}
          myUserId={this.state.myUserId}
          serverVersion={this.state.serverVersion}
          serverAddress={this.state.serverAddress}

          errorText={this.state.errorText}
          errorLevel={this.state.errorLevel}
          errorAction={this.state.errorAction}
          errorActionText={this.state.errorActionText}

          newTopicParams={this.state.newTopicParams}

          onHideMessagesView={this.handleHideMessagesView}
          onData={this.tnData}
          onError={this.handleError}
          onNewTopicCreated={this.handleNewTopicCreated}
          readTimerHandler={this.handleReadTimer}
          showContextMenu={this.handleShowContextMenu}
          onChangePermissions={this.handleChangePermissions}
          onNewChat={this.handleNewChatInvitation}
          sendMessage={this.handleSendMessage} />

        {this.state.showInfoPanel ?
          <InfoView
            tinode={this.tinode}
            connected={this.state.connected}
            displayMobile={this.state.displayMobile}
            topic={this.state.topicSelected}
            searchableContacts={this.state.searchableContacts}
            myUserId={this.state.myUserId}

            errorText={this.state.errorText}
            errorLevel={this.state.errorLevel}
            errorAction={this.state.errorAction}
            errorActionText={this.state.errorActionText}

            onTopicDescUpdate={this.handleTopicUpdateRequest}
            onCancel={this.handleHideInfoView}
            onChangePermissions={this.handleChangePermissions}
            onMemberUpdateRequest={this.handleMemberUpdateRequest}
            onLeaveTopic={this.handleLeaveUnsubRequest}
            onAddMember={this.handleManageGroupMembers}
            onTopicTagsUpdate={this.handleTagsUpdated}
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

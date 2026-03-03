"use strict";
(self["webpackChunktinode_webapp"] = self["webpackChunktinode_webapp"] || []).push([["src_views_messages-view_jsx"],{

/***/ "./src/views/logo-view.jsx":
/*!*********************************!*\
  !*** ./src/views/logo-view.jsx ***!
  \*********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ LogoView; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tinode-sdk */ "tinode-sdk");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../config.js */ "./src/config.js");




class LogoView extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  render() {
    const version = _config_js__WEBPACK_IMPORTED_MODULE_3__.APP_NAME + ' (' + tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Tinode.getLibrary() + ')';
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "dummy-view"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "https://github.com/tinode/chat/"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("img", {
      id: "logo",
      alt: "logo",
      src: "img/logo.svg"
    }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h2", null, "Tinode Web")), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_client",
      defaultMessage: [{
        "type": 0,
        "value": "Client:"
      }]
    }), " ", version), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_server",
      defaultMessage: [{
        "type": 0,
        "value": "Server:"
      }]
    }), " ", this.props.serverVersion, " (", this.props.serverAddress, ")")));
  }
}
;

/***/ }),

/***/ "./src/views/messages-view.jsx":
/*!*************************************!*\
  !*** ./src/views/messages-view.jsx ***!
  \*************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tinode-sdk */ "tinode-sdk");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _widgets_chat_message_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../widgets/chat-message.jsx */ "./src/widgets/chat-message.jsx");
/* harmony import */ var _widgets_contact_badges_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../widgets/contact-badges.jsx */ "./src/widgets/contact-badges.jsx");
/* harmony import */ var _widgets_error_panel_jsx__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../widgets/error-panel.jsx */ "./src/widgets/error-panel.jsx");
/* harmony import */ var _widgets_group_subs_jsx__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../widgets/group-subs.jsx */ "./src/widgets/group-subs.jsx");
/* harmony import */ var _widgets_invitation_jsx__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../widgets/invitation.jsx */ "./src/widgets/invitation.jsx");
/* harmony import */ var _widgets_letter_tile_jsx__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../widgets/letter-tile.jsx */ "./src/widgets/letter-tile.jsx");
/* harmony import */ var _widgets_load_spinner_jsx__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../widgets/load-spinner.jsx */ "./src/widgets/load-spinner.jsx");
/* harmony import */ var _logo_view_jsx__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./logo-view.jsx */ "./src/views/logo-view.jsx");
/* harmony import */ var _widgets_meta_message_jsx__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../widgets/meta-message.jsx */ "./src/widgets/meta-message.jsx");
/* harmony import */ var _widgets_pinned_messages_jsx__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../widgets/pinned-messages.jsx */ "./src/widgets/pinned-messages.jsx");
/* harmony import */ var _widgets_send_message_jsx__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../widgets/send-message.jsx */ "./src/widgets/send-message.jsx");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../constants.js */ "./src/constants.js");
/* harmony import */ var _lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../lib/blob-helpers.js */ "./src/lib/blob-helpers.js");
/* harmony import */ var _lib_navigation_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../lib/navigation.js */ "./src/lib/navigation.js");
/* harmony import */ var _lib_strformat_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../lib/strformat.js */ "./src/lib/strformat.js");



const CallPanel = react__WEBPACK_IMPORTED_MODULE_0___default().lazy(_ => __webpack_require__.e(/*! import() */ "src_widgets_call-panel_jsx").then(__webpack_require__.bind(__webpack_require__, /*! ../widgets/call-panel.jsx */ "./src/widgets/call-panel.jsx")));


const DocPreview = react__WEBPACK_IMPORTED_MODULE_0___default().lazy(_ => __webpack_require__.e(/*! import() */ "src_widgets_doc-preview_jsx").then(__webpack_require__.bind(__webpack_require__, /*! ../widgets/doc-preview.jsx */ "./src/widgets/doc-preview.jsx")));


const ImagePreview = react__WEBPACK_IMPORTED_MODULE_0___default().lazy(_ => __webpack_require__.e(/*! import() */ "src_widgets_image-preview_jsx").then(__webpack_require__.bind(__webpack_require__, /*! ../widgets/image-preview.jsx */ "./src/widgets/image-preview.jsx")));







const TheCardPreview = react__WEBPACK_IMPORTED_MODULE_0___default().lazy(_ => Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_libphonenumber-js_mobile_exports_parsePhoneNumberWithError_js"), __webpack_require__.e("src_widgets_the-card-preview_jsx")]).then(__webpack_require__.bind(__webpack_require__, /*! ../widgets/the-card-preview.jsx */ "./src/widgets/the-card-preview.jsx")));
const VideoPreview = react__WEBPACK_IMPORTED_MODULE_0___default().lazy(_ => __webpack_require__.e(/*! import() */ "src_widgets_video-preview_jsx").then(__webpack_require__.bind(__webpack_require__, /*! ../widgets/video-preview.jsx */ "./src/widgets/video-preview.jsx")));





const NOTIFICATION_EXEC_INTERVAL = 300;
const SHOW_GO_TO_LAST_DIST = 100;
const FETCH_PAGE_TRIGGER = 40;
const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_1__.defineMessages)({
  online_now: {
    id: "online_now",
    defaultMessage: [{
      "type": 0,
      "value": "online now"
    }]
  },
  last_seen: {
    id: "last_seen_timestamp",
    defaultMessage: [{
      "type": 0,
      "value": "Last seen: "
    }, {
      "type": 1,
      "value": "timestamp"
    }]
  },
  not_found: {
    id: "title_not_found",
    defaultMessage: [{
      "type": 0,
      "value": "Not found"
    }]
  },
  channel: {
    id: "channel",
    defaultMessage: [{
      "type": 0,
      "value": "channel"
    }]
  },
  file_attachment_too_large: {
    id: "file_attachment_too_large",
    defaultMessage: [{
      "type": 0,
      "value": "The file size "
    }, {
      "type": 1,
      "value": "size"
    }, {
      "type": 0,
      "value": " exceeds the "
    }, {
      "type": 1,
      "value": "limit"
    }, {
      "type": 0,
      "value": " limit."
    }]
  },
  invalid_content: {
    id: "invalid_content",
    defaultMessage: [{
      "type": 0,
      "value": "invalid content"
    }]
  },
  editing_message: {
    id: "editing_message",
    defaultMessage: [{
      "type": 0,
      "value": "Editing"
    }]
  },
  drag_file: {
    id: "drag_file",
    defaultMessage: [{
      "type": 0,
      "value": "Drag file here"
    }]
  },
  self_topic_name: {
    id: "self_topic_name",
    defaultMessage: [{
      "type": 0,
      "value": "Saved messages"
    }]
  },
  subscriber_count: {
    id: "subscriber_count",
    defaultMessage: [{
      "type": 6,
      "value": "count",
      "options": {
        "one": {
          "value": [{
            "type": 2,
            "value": "count",
            "style": null
          }, {
            "type": 0,
            "value": " subscriber"
          }]
        },
        "two": {
          "value": [{
            "type": 2,
            "value": "count",
            "style": null
          }, {
            "type": 0,
            "value": " subscribers"
          }]
        },
        "three": {
          "value": [{
            "type": 2,
            "value": "count",
            "style": null
          }, {
            "type": 0,
            "value": " subscribers"
          }]
        },
        "few": {
          "value": [{
            "type": 2,
            "value": "count",
            "style": null
          }, {
            "type": 0,
            "value": " subscribers"
          }]
        },
        "many": {
          "value": [{
            "type": 2,
            "value": "count",
            "style": null
          }, {
            "type": 0,
            "value": " subscribers"
          }]
        },
        "other": {
          "value": [{
            "type": 2,
            "value": "count",
            "style": null
          }, {
            "type": 0,
            "value": " subscribers"
          }]
        }
      },
      "offset": 0,
      "pluralType": "cardinal"
    }]
  },
  member_count: {
    id: "member_count",
    defaultMessage: [{
      "type": 6,
      "value": "count",
      "options": {
        "one": {
          "value": [{
            "type": 2,
            "value": "count",
            "style": null
          }, {
            "type": 0,
            "value": " member"
          }]
        },
        "two": {
          "value": [{
            "type": 2,
            "value": "count",
            "style": null
          }, {
            "type": 0,
            "value": " members"
          }]
        },
        "three": {
          "value": [{
            "type": 2,
            "value": "count",
            "style": null
          }, {
            "type": 0,
            "value": " members"
          }]
        },
        "few": {
          "value": [{
            "type": 2,
            "value": "count",
            "style": null
          }, {
            "type": 0,
            "value": " members"
          }]
        },
        "many": {
          "value": [{
            "type": 2,
            "value": "count",
            "style": null
          }, {
            "type": 0,
            "value": " members"
          }]
        },
        "other": {
          "value": [{
            "type": 2,
            "value": "count",
            "style": null
          }, {
            "type": 0,
            "value": " members"
          }]
        }
      },
      "offset": 0,
      "pluralType": "cardinal"
    }]
  },
  cannot_parse_vcard: {
    id: "cannot_parse_vcard",
    defaultMessage: [{
      "type": 0,
      "value": "Cannot parse vCard file."
    }]
  }
});
function isUnconfirmed(acs) {
  if (acs) {
    const ex = acs.getExcessive() || '';
    return acs.isJoiner('given') && (ex.includes('R') || ex.includes('W'));
  }
  return false;
}
function isPeerRestricted(acs) {
  if (acs) {
    const ms = acs.getMissing() || '';
    return acs.isJoiner('want') && (ms.includes('R') || ms.includes('W'));
  }
  return false;
}
function shouldPresentCallPanel(callState) {
  return callState == _constants_js__WEBPACK_IMPORTED_MODULE_15__.CALL_STATE_OUTGOING_INITATED || callState == _constants_js__WEBPACK_IMPORTED_MODULE_15__.CALL_STATE_IN_PROGRESS;
}
class MessagesView extends (react__WEBPACK_IMPORTED_MODULE_0___default().Component) {
  constructor(props) {
    super(props);
    this.state = MessagesView.getDerivedStateFromProps(props, {});
    this.componentSetup = this.componentSetup.bind(this);
    this.leave = this.leave.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.retrySend = this.retrySend.bind(this);
    this.sendImageAttachment = this.sendImageAttachment.bind(this);
    this.sendVideoAttachment = this.sendVideoAttachment.bind(this);
    this.sendFileAttachment = this.sendFileAttachment.bind(this);
    this.sendAudioAttachment = this.sendAudioAttachment.bind(this);
    this.sendTheCardAttachment = this.sendTheCardAttachment.bind(this);
    this.sendKeyPress = this.sendKeyPress.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.handleScrollReference = this.handleScrollReference.bind(this);
    this.mountDnDEvents = this.mountDnDEvents.bind(this);
    this.handleScrollEvent = this.handleScrollEvent.bind(this);
    this.handleDescChange = this.handleDescChange.bind(this);
    this.handleSubsUpdated = this.handleSubsUpdated.bind(this);
    this.handleMessageUpdate = this.handleMessageUpdate.bind(this);
    this.handleAuxUpdate = this.handleAuxUpdate.bind(this);
    this.handleAllMessagesReceived = this.handleAllMessagesReceived.bind(this);
    this.handleInfoReceipt = this.handleInfoReceipt.bind(this);
    this.handleExpandMedia = this.handleExpandMedia.bind(this);
    this.handleClosePreview = this.handleClosePreview.bind(this);
    this.handleCallPanelToggle = this.handleCallPanelToggle.bind(this);
    this.handleFormResponse = this.handleFormResponse.bind(this);
    this.handleContextClick = this.handleContextClick.bind(this);
    this.handleShowMessageContextMenu = this.handleShowMessageContextMenu.bind(this);
    this.handleNewChatAcceptance = this.handleNewChatAcceptance.bind(this);
    this.handleEnablePeer = this.handleEnablePeer.bind(this);
    this.handleAttachFile = this.handleAttachFile.bind(this);
    this.handleAttachImageOrVideo = this.handleAttachImageOrVideo.bind(this);
    this.handleCancelUpload = this.handleCancelUpload.bind(this);
    this.postReadNotification = this.postReadNotification.bind(this);
    this.clearNotificationQueue = this.clearNotificationQueue.bind(this);
    this.goToLatestMessage = this.goToLatestMessage.bind(this);
    this.handleFileDrop = this.handleFileDrop.bind(this);
    this.handlePickReply = this.handlePickReply.bind(this);
    this.handleEditMessage = this.handleEditMessage.bind(this);
    this.handleCancelReply = this.handleCancelReply.bind(this);
    this.handleQuoteClick = this.handleQuoteClick.bind(this);
    this.handleUnpinMessage = this.handleUnpinMessage.bind(this);
    this.handleCallHangup = this.handleCallHangup.bind(this);
    this.isDragEnabled = this.isDragEnabled.bind(this);
    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleDragIn = this.handleDragIn.bind(this);
    this.handleDragOut = this.handleDragOut.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.chatMessageRefs = [];
    this.getOrCreateMessageRef = this.getOrCreateMessageRef.bind(this);
    this.getVisibleMessageRange = this.getVisibleMessageRange.bind(this);
    this.dragCounter = 0;
    this.dndRef = null;
    this.readNotificationQueue = [];
    this.readNotificationTimer = null;
    this.keyPressTimer = null;
  }
  getOrCreateMessageRef(seqId) {
    if (this.chatMessageRefs[seqId]) {
      return this.chatMessageRefs[seqId];
    }
    const ref = react__WEBPACK_IMPORTED_MODULE_0___default().createRef();
    this.chatMessageRefs[seqId] = ref;
    return ref;
  }
  getVisibleMessageRange(holderRect) {
    let min = Number.MAX_SAFE_INTEGER,
      max = -1;
    let visibilityStatus = false;
    this.chatMessageRefs.every((ref, seq) => {
      if (ref.current) {
        const {
          top,
          bottom,
          height
        } = ref.current.getBoundingClientRect();
        const visible = top <= holderRect.top ? holderRect.top - top <= height : bottom - holderRect.bottom <= height;
        if (visible) {
          visibilityStatus = true;
          min = Math.min(min, seq);
          max = Math.max(max, seq);
        } else if (visibilityStatus) {
          return false;
        }
      }
      return true;
    });
    return max >= min ? {
      min: min,
      max: max
    } : {
      min: 0,
      max: 0
    };
  }
  componentDidMount() {
    if (this.messagesScroller) {
      this.messagesScroller.addEventListener('scroll', this.handleScrollEvent);
    }
    this.mountDnDEvents(this.dndRef);
    this.componentSetup({}, {});
  }
  componentWillUnmount() {
    if (this.messagesScroller) {
      this.messagesScroller.removeEventListener('scroll', this.handleScrollEvent);
    }
    this.clearNotificationQueue();
    if (this.dndRef) {
      this.dndRef.removeEventListener('dragstart', this.handleDragStart);
      this.dndRef.removeEventListener('dragenter', this.handleDragIn);
      this.dndRef.removeEventListener('dragleave', this.handleDragOut);
      this.dndRef.removeEventListener('dragover', this.handleDrag);
      this.dndRef.removeEventListener('drop', this.handleDrop);
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.messagesScroller && (prevState.topic != this.state.topic || prevState.maxSeqId != this.state.maxSeqId || prevState.minSeqId != this.state.minSeqId)) {
      if (this.state.scrollPosition < SHOW_GO_TO_LAST_DIST) {
        this.messagesScroller.scrollTop = this.messagesScroller.scrollHeight - this.state.scrollPosition - this.messagesScroller.offsetHeight;
      }
    }
    if (!this.props.applicationVisible) {
      this.clearNotificationQueue();
    } else {
      this.postReadNotification(0);
    }
    this.componentSetup(prevProps, prevState);
  }
  componentSetup(prevProps, prevState) {
    const topic = this.props.tinode ? this.props.tinode.getTopic(this.state.topic) : undefined;
    if (this.state.topic != prevState.topic) {
      if (prevState.topic && !tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Tinode.isNewGroupTopicName(prevState.topic)) {
        this.leave(prevState.topic);
        if (prevState.rtcPanel) {
          this.handleCallHangup(prevState.topic, prevProps.callSeq);
        }
      }
      if (topic) {
        topic.onData = this.handleMessageUpdate;
        topic.onAllMessagesReceived = this.handleAllMessagesReceived;
        topic.onInfo = this.handleInfoReceipt;
        topic.onMetaDesc = this.handleDescChange;
        topic.onSubsUpdated = this.handleSubsUpdated;
        topic.onPres = this.handleSubsUpdated;
        topic.onAuxUpdated = this.handleAuxUpdate;
      }
    }
    if (topic) {
      if (this.state.topic != prevState.topic || this.props.myUserId && !prevProps.myUserId) {
        const newTopic = this.props.newTopicParams && this.props.newTopicParams._topicName == this.props.topic;
        if (topic.isP2PType() && newTopic && !_config_js__WEBPACK_IMPORTED_MODULE_14__.IMMEDIATE_P2P_SUBSCRIPTION) {
          topic.getMeta(topic.startMetaQuery().withDesc().build());
        } else if (this.props.myUserId) {
          this.subscribe(topic);
        }
      } else if (topic.isSubscribed() && this.state.isReader && !prevState.isReader) {
        topic.getMeta(topic.startMetaQuery().withLaterData().build());
      } else if (!topic.isSubscribed() && this.props.ready && !prevProps.ready) {
        this.subscribe(topic);
      }
    }
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    let nextState = {};
    if (!nextProps.topic) {
      nextState = {
        minSeqId: -1,
        maxSeqId: -1,
        latestClearId: -1,
        onlineSubs: [],
        topic: null,
        title: '',
        avatar: null,
        isVerified: false,
        isStaff: false,
        isDangerous: false,
        deleted: false,
        docPreview: null,
        imagePreview: null,
        imagePostview: null,
        videoPreview: null,
        videoPostview: null,
        rtcPanel: null,
        minimizedCallPanel: false,
        typingIndicator: false,
        scrollPosition: 0,
        fetchingMessages: false,
        peerMessagingDisabled: false,
        channel: false,
        reply: null,
        contentToEdit: null,
        showGoToLastButton: false,
        dragging: false,
        pins: [],
        pinsLoaded: false,
        selectedPin: 0,
        subsVersion: 0
      };
    } else if (nextProps.topic != prevState.topic) {
      const topic = nextProps.tinode.getTopic(nextProps.topic);
      nextState = {
        topic: nextProps.topic,
        deleted: topic._deleted,
        docPreview: null,
        imagePreview: null,
        imagePostview: null,
        videoPreview: null,
        videoPostview: null,
        rtcPanel: null,
        minimizedCallPanel: false,
        typingIndicator: false,
        scrollPosition: 0,
        fetchingMessages: false,
        showGoToLastButton: false,
        contentToEdit: null,
        dragging: false,
        selectedPin: 0
      };
      if (nextProps.forwardMessage) {
        if (nextProps.forwardMessage.content) {
          const content = nextProps.forwardMessage.content;
          const size = content?.length || content?.size || 0;
          nextState.docPreview = {
            object: content,
            type: nextProps.forwardMessage.type,
            size: size
          };
        } else {
          nextState.reply = {
            content: nextProps.forwardMessage.preview,
            seq: null
          };
        }
      } else {
        nextState.reply = null;
      }
      if (topic) {
        const subs = [];
        if (nextProps.connected) {
          topic.subscribers(sub => {
            if (sub.online && sub.user != nextProps.myUserId) {
              subs.push(sub);
            }
          });
        }
        Object.assign(nextState, {
          onlineSubs: subs
        });
        if (topic.isSelfType()) {
          Object.assign(nextState, {
            title: nextProps.intl.formatMessage(messages.self_topic_name),
            avatar: true
          });
        } else if (topic.public) {
          Object.assign(nextState, {
            title: topic.public.fn,
            avatar: (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_16__.makeImageUrl)(topic.public.photo)
          });
        } else {
          Object.assign(nextState, {
            title: '',
            avatar: null
          });
        }
        const peer = topic.p2pPeerDesc();
        if (peer) {
          Object.assign(nextState, {
            peerMessagingDisabled: isPeerRestricted(peer.acs)
          });
        } else if (prevState.peerMessagingDisabled) {
          Object.assign(nextState, {
            peerMessagingDisabled: false
          });
        }
        Object.assign(nextState, {
          minSeqId: topic.minMsgSeq(),
          maxSeqId: topic.maxMsgSeq(),
          latestClearId: topic.maxClearId(),
          channel: topic.isChannelType(),
          pins: (topic.aux('pins') || []).slice(),
          pinsLoaded: false
        });
        if (nextProps.callTopic == topic.name && shouldPresentCallPanel(nextProps.callState)) {
          nextState.rtcPanel = nextProps.callTopic;
        }
      } else {
        Object.assign(nextState, {
          minSeqId: -1,
          maxSeqId: -1,
          latestClearId: -1,
          onlineSubs: [],
          title: '',
          avatar: null,
          peerMessagingDisabled: false,
          channel: false,
          pins: [],
          pinsLoaded: false
        });
      }
    } else {
      if (nextProps.callTopic == prevState.topic && !prevState.rtcPanel && shouldPresentCallPanel(nextProps.callState)) {
        nextState.rtcPanel = nextProps.callTopic;
      }
    }
    if (nextProps.acs) {
      if (nextProps.acs.isWriter() != prevState.isWriter) {
        nextState.isWriter = !prevState.isWriter;
      }
      if (nextProps.acs.isReader() != prevState.isReader) {
        nextState.isReader = !prevState.isReader;
      }
      if (nextProps.acs.isAdmin() != prevState.isAdmin) {
        nextState.isAdmin = !prevState.isAdmin;
      }
      if (!nextProps.acs.isReader('given') != prevState.readingBlocked) {
        nextState.readingBlocked = !prevState.readingBlocked;
      }
      if (nextProps.acs.isSharer() != prevState.isSharer) {
        nextState.isSharer = !prevState.isSharer;
      }
    } else {
      if (prevState.isWriter) {
        nextState.isWriter = false;
      }
      if (prevState.isReader) {
        nextState.isReader = false;
      }
      if (prevState.isAdmin) {
        nextState.isAdmin = false;
      }
      if (!prevState.readingBlocked) {
        prevState.readingBlocked = true;
      }
      if (prevState.isSharer) {
        nextState.isSharer = false;
      }
    }
    if (isUnconfirmed(nextProps.acs) == !prevState.unconformed) {
      nextState.unconfirmed = !prevState.unconformed;
    }
    if (!nextProps.connected && prevState.onlineSubs && prevState.onlineSubs.length > 0) {
      nextState.onlineSubs = [];
    }
    return nextState;
  }
  subscribe(topic) {
    if (topic.isSubscribed() || !this.props.ready) {
      return;
    }
    const newTopic = this.props.newTopicParams && this.props.newTopicParams._topicName == this.props.topic;
    let getQuery = topic.startMetaQuery().withLaterDesc().withLaterSub().withAux();
    if (this.state.isReader || newTopic) {
      getQuery = getQuery.withLaterData(_config_js__WEBPACK_IMPORTED_MODULE_14__.MESSAGES_PAGE);
      if (this.state.isReader) {
        getQuery = getQuery.withLaterDel();
      }
      this.setState({
        fetchingMessages: true
      });
    }
    const setQuery = newTopic ? this.props.newTopicParams : undefined;
    topic.subscribe(getQuery.build(), setQuery).then(ctrl => {
      if (ctrl.code == 303) {
        _lib_navigation_js__WEBPACK_IMPORTED_MODULE_17__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_17__["default"].setUrlTopic('', ctrl.params.topic));
        return;
      }
      if (this.state.topic != ctrl.topic) {
        this.setState({
          topic: ctrl.topic
        });
      }
      if (this.state.deleted) {
        this.setState({
          deleted: false
        });
      }
      this.props.onNewTopicCreated(this.props.topic, ctrl.topic);
      let discard = [];
      topic.queuedMessages(pub => {
        if (pub._sending) {
          return;
        }
        if (pub._fatal || pub.head && pub.head.webrtc) {
          discard.push(pub.seq);
          return;
        }
        if (topic.isSubscribed()) {
          this.retrySend(pub);
        }
      });
      if (discard.length > 0) {
        topic.delMessagesList(discard, true);
      }
    }).catch(err => {
      console.error("Failed subscription to", this.state.topic, err);
      this.props.onError(err.message, 'err');
      const blankState = MessagesView.getDerivedStateFromProps({}, {});
      blankState.title = this.props.intl.formatMessage(messages.not_found);
      this.setState(blankState);
    });
  }
  leave(oldTopicName) {
    if (!oldTopicName || !this.props.tinode.isTopicCached(oldTopicName)) {
      return;
    }
    const oldTopic = this.props.tinode.getTopic(oldTopicName);
    if (oldTopic && oldTopic.isSubscribed()) {
      oldTopic.leave(false).catch(_ => {}).finally(_ => {
        this.setState({
          fetchingMessages: false
        });
        oldTopic.onData = undefined;
        oldTopic.onAllMessagesReceived = undefined;
        oldTopic.onInfo = undefined;
        oldTopic.onMetaDesc = undefined;
        oldTopic.onSubsUpdated = undefined;
        oldTopic.onPres = undefined;
        oldTopic.onAuxUpdated = undefined;
      });
    }
  }
  handleScrollReference(node) {
    if (node) {
      node.addEventListener('scroll', this.handleScrollEvent);
      this.messagesScroller = node;
      this.messagesScroller.scrollTop = this.messagesScroller.scrollHeight - this.state.scrollPosition - this.messagesScroller.offsetHeight;
    }
  }
  handleScrollEvent(event) {
    const pos = event.target.scrollHeight - event.target.scrollTop - event.target.offsetHeight;
    this.setState({
      scrollPosition: pos,
      showGoToLastButton: pos > SHOW_GO_TO_LAST_DIST && pos < this.state.scrollPosition
    });
    if (this.state.fetchingMessages || this.processingScrollEvent) {
      return;
    }
    if (event.target.scrollTop <= FETCH_PAGE_TRIGGER) {
      const topic = this.props.tinode.getTopic(this.state.topic);
      if (topic && topic.isSubscribed()) {
        this.processingScrollEvent = true;
        const {
          min,
          max
        } = this.getVisibleMessageRange(event.target.getBoundingClientRect());
        const gaps = topic.msgHasMoreMessages(min, max, false);
        if (gaps.length > 0) {
          this.setState({
            fetchingMessages: true
          }, _ => {
            topic.getMessagesPage(_config_js__WEBPACK_IMPORTED_MODULE_14__.MESSAGES_PAGE, gaps, min, max).catch(err => this.props.onError(err.message, 'err')).finally(_ => this.setState({
              fetchingMessages: false
            }));
          });
        }
      }
    }
    this.processingScrollEvent = false;
  }
  mountDnDEvents(dnd) {
    if (dnd) {
      dnd.addEventListener('dragstart', this.handleDragStart);
      dnd.addEventListener('dragenter', this.handleDragIn);
      dnd.addEventListener('dragleave', this.handleDragOut);
      dnd.addEventListener('dragover', this.handleDrag);
      dnd.addEventListener('drop', this.handleDrop);
      this.dndRef = dnd;
    }
  }
  goToLatestMessage() {
    this.setState({
      scrollPosition: 0
    });
    if (this.messagesScroller) {
      this.messagesScroller.scrollTop = this.messagesScroller.scrollHeight - this.messagesScroller.offsetHeight;
    }
  }
  handleDescChange(desc) {
    if (tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Tinode.isSelfTopicName(this.props.topic)) {
      this.setState({
        title: this.props.intl.formatMessage(messages.self_topic_name),
        avatar: true
      });
    } else if (desc.public) {
      this.setState({
        title: desc.public.fn,
        avatar: (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_16__.makeImageUrl)(desc.public.photo)
      });
    } else {
      this.setState({
        title: '',
        avatar: null
      });
    }
    if (desc.acs) {
      this.setState({
        isWriter: desc.acs.isWriter(),
        isReader: desc.acs.isReader(),
        isAdmin: desc.acs.isAdmin(),
        readingBlocked: !desc.acs.isReader('given'),
        unconfirmed: isUnconfirmed(desc.acs)
      });
    }
  }
  postReadNotification(seq) {
    if (!this.props.applicationVisible || !this.state.topic) {
      return;
    }
    if (!this.readNotificationTimer) {
      this.readNotificationTimer = setInterval(_ => {
        if (this.readNotificationQueue.length == 0) {
          clearInterval(this.readNotificationTimer);
          this.readNotificationTimer = null;
          return;
        }
        let seq = -1;
        while (this.readNotificationQueue.length > 0) {
          const n = this.readNotificationQueue[0];
          if (n.topicName != this.state.topic) {
            this.readNotificationQueue.shift();
            continue;
          }
          const now = new Date();
          if (n.sendAt <= now) {
            this.readNotificationQueue.shift();
            if (n.seq == 0 || tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Tinode.isServerAssignedSeq(n.seq)) {
              seq = Math.max(seq, n.seq);
            }
          } else {
            break;
          }
        }
        if (seq >= 0) {
          const topic = this.props.tinode.getTopic(this.state.topic);
          if (topic) {
            try {
              topic.noteRead(seq);
            } catch (err) {
              console.error("Failed to send read notification", err);
            }
          }
        }
      }, NOTIFICATION_EXEC_INTERVAL);
    }
    const now = new Date();
    this.readNotificationQueue.push({
      topicName: this.state.topic,
      seq: seq,
      sendAt: now.setMilliseconds(now.getMilliseconds() + _config_js__WEBPACK_IMPORTED_MODULE_14__.READ_DELAY)
    });
  }
  clearNotificationQueue() {
    this.readNotificationQueue = [];
    if (this.readNotificationTimer) {
      clearInterval(this.readNotificationTimer);
      this.readNotificationTimer = null;
    }
  }
  handleSubsUpdated() {
    if (this.state.topic) {
      const subs = [];
      const topic = this.props.tinode.getTopic(this.state.topic);
      topic.subscribers(sub => {
        if (sub.online && sub.user != this.props.myUserId) {
          subs.push(sub);
        }
      });
      const newState = {
        onlineSubs: subs,
        subsVersion: this.state.subsVersion + 1
      };
      const peer = topic.p2pPeerDesc();
      if (peer) {
        Object.assign(newState, {
          peerMessagingDisabled: isPeerRestricted(peer.acs)
        });
      } else if (this.state.peerMessagingDisabled) {
        Object.assign(newState, {
          peerMessagingDisabled: false
        });
      }
      this.setState(newState);
    }
  }
  handleMessageUpdate(msg) {
    if (!this.state.topic) {
      return;
    }
    const topic = this.props.tinode.getTopic(this.state.topic);
    if (!msg) {
      this.setState({
        latestClearId: topic.maxClearId()
      });
      return;
    }
    clearTimeout(this.keyPressTimer);
    this.setState({
      maxSeqId: topic.maxMsgSeq(),
      minSeqId: topic.minMsgSeq(),
      typingIndicator: false
    }, _ => {
      if (topic.isNewMessage(msg.seq)) {
        if (this.state.scrollPosition > SHOW_GO_TO_LAST_DIST) {
          this.setState({
            showGoToLastButton: true
          });
        } else {
          this.goToLatestMessage();
        }
      } else {
        if (this.messagesScroller) {
          this.messagesScroller.scrollTop = this.messagesScroller.scrollHeight - this.state.scrollPosition - this.messagesScroller.offsetHeight;
        }
      }
    });
    const status = topic.msgStatus(msg, true);
    if (status >= tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Tinode.MESSAGE_STATUS_SENT && msg.from != this.props.myUserId) {
      this.postReadNotification(msg.seq);
    }
  }
  handleAllMessagesReceived(count) {
    this.setState({
      fetchingMessages: false
    });
    if (!count) {
      const topic = this.props.tinode.getTopic(this.state.topic);
      if (topic) {
        this.postReadNotification(topic.seq);
      }
      return;
    }
    if (!this.state.pinsLoaded) {
      const topic = this.props.tinode.getTopic(this.state.topic);
      this.setState({
        pinsLoaded: true
      }, _ => {
        topic.getPinnedMessages();
      });
    } else {
      this.setState({
        pinsLoaded: false
      });
    }
  }
  handleAuxUpdate(aux) {
    const pins = (aux['pins'] || []).slice();
    let selectedPin = this.state.selectedPin;
    if (pins.length > this.state.pins.length) {
      selectedPin = 0;
    } else if (selectedPin >= pins.length) {
      selectedPin = Math.max(0, pins.length - 1);
    }
    this.setState({
      pins: pins,
      selectedPin: selectedPin
    });
  }
  handleInfoReceipt(info) {
    switch (info.what) {
      case 'kp':
        {
          clearTimeout(this.keyPressTimer);
          this.keyPressTimer = setTimeout(_ => this.setState({
            typingIndicator: false
          }), _config_js__WEBPACK_IMPORTED_MODULE_14__.KEYPRESS_DELAY + 1000);
          if (!this.state.typingIndicator) {
            this.setState({
              typingIndicator: true
            });
          }
          break;
        }
      case 'read':
      case 'recv':
        this.forceUpdate();
        break;
      default:
        console.info("Other change in topic: ", info.what);
    }
  }
  handleExpandMedia(content) {
    if (!content) {
      return;
    }
    if (content.video) {
      this.setState({
        videoPostview: content
      });
    } else {
      this.setState({
        imagePostview: content
      });
    }
  }
  handleClosePreview() {
    if (this.state.imagePreview && this.state.imagePreview.url) {
      URL.revokeObjectURL(this.state.imagePreview.url);
    }
    if (this.state.videoPreview && this.state.videoPreview.url) {
      URL.revokeObjectURL(this.state.videoPreview.url);
    }
    this.setState({
      imagePostview: null,
      imagePreview: null,
      docPreview: null,
      videoPreview: null,
      videoPostview: null
    });
    this.props.onCancelForwardMessage();
  }
  handleFormResponse(action, text, data) {
    if (action == 'pub') {
      this.sendMessage(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.attachJSON(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.parse(text), data));
    } else if (action == 'url') {
      const url = new URL(data.ref);
      const params = url.searchParams;
      for (let key in data.resp) {
        if (data.resp.hasOwnProperty(key)) {
          params.set(key, data.resp[key]);
        }
      }
      ['name', 'seq'].forEach(key => {
        if (data[key]) {
          params.set(key, data[key]);
        }
      });
      params.set('uid', this.props.myUserId);
      params.set('topic', this.state.topic);
      url.search = params;
      window.open(url, '_blank');
    } else {
      console.info("Unknown action in form", action);
    }
  }
  handleContextClick(e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.showContextMenu({
      topicName: this.state.topic,
      y: e.pageY,
      x: e.pageX
    });
  }
  handleShowMessageContextMenu(params, messageSpecificMenuItems) {
    if (params.userFrom == 'chan') {
      params.userFrom = this.state.topic;
      params.userName = this.state.title;
    }
    params.topicName = this.state.topic;
    const menuItems = messageSpecificMenuItems || [];
    const topic = this.props.tinode.getTopic(params.topicName);
    if (topic) {
      if (topic.isSelfType()) {
        menuItems.push('message_delete_generic');
      } else {
        if (!topic.isChannelType()) {
          menuItems.push('message_delete');
        }
        const acs = topic.getAccessMode();
        if (acs && acs.isDeleter()) {
          let canDelete = acs.isOwner();
          if (!canDelete) {
            const maxDelAge = this.props.tinode.getServerParam(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Tinode.MSG_DELETE_AGE, 0) | 0;
            canDelete = maxDelAge == 0 || (maxDelAge > 0 && params.timestamp ? params.timestamp.getTime() > new Date().getTime() - maxDelAge * 1000 : false);
          }
          if (canDelete) {
            menuItems.push('message_delete_hard');
          }
        }
      }
    }
    this.props.showContextMenu(params, menuItems);
  }
  handleNewChatAcceptance(action) {
    this.props.onNewChat(this.state.topic, action);
  }
  handleEnablePeer(e) {
    e.preventDefault();
    this.props.onChangePermissions(this.state.topic, _config_js__WEBPACK_IMPORTED_MODULE_14__.DEFAULT_P2P_ACCESS_MODE, this.state.topic);
  }
  sendKeyPress(audio) {
    const topic = this.props.tinode.getTopic(this.state.topic);
    if (topic.isSubscribed()) {
      if (audio) {
        topic.noteRecording(true);
      } else {
        topic.noteKeyPress();
      }
    }
  }
  sendMessage(msg, uploadCompletionPromise, uploader) {
    let head;
    if (!msg && this.props.forwardMessage) {
      msg = this.props.forwardMessage.msg;
      head = this.props.forwardMessage.head;
      this.handleCancelReply();
    } else if (this.state.reply) {
      if (this.state.reply.editing) {
        if (msg == this.state.contentToEdit) {
          this.handleCancelReply();
          return;
        }
        head = {
          replace: ':' + this.state.reply.seq
        };
      } else if (this.state.reply.content) {
        head = {
          reply: '' + this.state.reply.seq
        };
        if (typeof msg == 'string') {
          msg = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.parse(msg);
        }
        msg = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.append(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.sanitizeEntities(this.state.reply.content), msg);
      }
      this.handleCancelReply();
    }
    this.props.sendMessage(msg, uploadCompletionPromise, uploader, head);
  }
  retrySend(pub) {
    this.props.sendMessage(pub.content, undefined, undefined, pub.head).then(_ => {
      const topic = this.props.tinode.getTopic(this.state.topic);
      topic.delMessagesList([pub.seq], true);
    });
  }
  sendFileAttachment(file) {
    const maxInbandAttachmentSize = this.props.tinode.getServerParam('maxMessageSize', _config_js__WEBPACK_IMPORTED_MODULE_14__.MAX_INBAND_ATTACHMENT_SIZE) * 0.75 - 1024 | 0;
    if (tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.TheCard.isFileSupported(file.type, file.name) || file.type == tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.TheCard.contentType) {
      if (this.sendTheCardAttachment(file, maxInbandAttachmentSize)) {
        return;
      }
    }
    const jsonMimeConverter = fileType => fileType === _config_js__WEBPACK_IMPORTED_MODULE_14__.DRAFTY_FR_MIME_TYPE_LEGACY ? 'application/octet-stream' : fileType;
    if (file.size > maxInbandAttachmentSize) {
      const uploader = this.props.tinode.getLargeFileHelper();
      if (!uploader) {
        this.props.onError(this.props.intl.formatMessage(messages.cannot_initiate_upload));
        return;
      }
      const uploadCompletionPromise = uploader.upload(file);
      const msg = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.attachFile(null, {
        mime: jsonMimeConverter(file.type),
        filename: file.name,
        size: file.size,
        urlPromise: uploadCompletionPromise
      });
      this.sendMessage(msg, uploadCompletionPromise, uploader);
    } else {
      (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_16__.fileToBase64)(file).then(b64 => this.sendMessage(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.attachFile(null, {
        mime: jsonMimeConverter(b64.mime),
        data: b64.bits,
        filename: b64.name,
        size: file.size
      }))).catch(err => this.props.onError(err.message, 'err'));
    }
  }
  sendTheCardAttachment(file, maxInbandAttachmentSize) {
    if (file.size > maxInbandAttachmentSize) {
      return false;
    }
    if (file.type == tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.TheCard.contentType) {
      this.sendMessage(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.appendTheCard(null, file.object));
      return true;
    }
    (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_16__.importVCard)(file).then(card => {
      this.sendMessage(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.appendTheCard(null, card));
    }).catch(err => {
      this.props.onError(this.props.intl.formatMessage(messages.cannot_parse_vcard, {
        error: err.message
      }), 'err');
    });
    return true;
  }
  handleAttachFile(file) {
    const maxExternAttachmentSize = this.props.tinode.getServerParam('maxFileUploadSize', _config_js__WEBPACK_IMPORTED_MODULE_14__.MAX_EXTERN_ATTACHMENT_SIZE);
    if (file.size > maxExternAttachmentSize) {
      this.props.onError(this.props.intl.formatMessage(messages.file_attachment_too_large, {
        size: (0,_lib_strformat_js__WEBPACK_IMPORTED_MODULE_18__.bytesToHumanSize)(file.size),
        limit: (0,_lib_strformat_js__WEBPACK_IMPORTED_MODULE_18__.bytesToHumanSize)(maxExternAttachmentSize)
      }), 'err');
    } else {
      this.setState({
        docPreview: {
          file: file,
          name: file.name,
          size: file.size,
          type: file.type
        }
      });
    }
  }
  handleCallHangup(topic, seq) {
    this.props.onVideoCallClosed();
    this.setState({
      rtcPanel: null
    });
    this.props.onCallHangup(topic, seq);
  }
  handleCallPanelToggle() {
    this.setState({
      minimizedCallPanel: !this.state.minimizedCallPanel
    });
  }
  sendImageAttachment(caption, blob) {
    const mime = this.state.imagePreview.mime;
    const width = this.state.imagePreview.width;
    const height = this.state.imagePreview.height;
    const fname = this.state.imagePreview.filename;
    const maxInbandAttachmentSize = this.props.tinode.getServerParam('maxMessageSize', _config_js__WEBPACK_IMPORTED_MODULE_14__.MAX_INBAND_ATTACHMENT_SIZE) * 0.75 - 1024 | 0;
    if (blob.size > maxInbandAttachmentSize) {
      const uploader = this.props.tinode.getLargeFileHelper();
      if (!uploader) {
        this.props.onError(this.props.intl.formatMessage(messages.cannot_initiate_upload));
        return;
      }
      const uploadCompletionPromise = uploader.upload(blob);
      (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_16__.imageScaled)(blob, _config_js__WEBPACK_IMPORTED_MODULE_14__.IMAGE_PREVIEW_DIM, _config_js__WEBPACK_IMPORTED_MODULE_14__.IMAGE_PREVIEW_DIM, -1, false).then(scaled => (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_16__.blobToBase64)(scaled.blob)).then(b64 => {
        let msg = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.insertImage(null, 0, {
          mime: mime,
          _tempPreview: b64.bits,
          bits: b64.bits,
          width: width,
          height: height,
          filename: fname,
          size: blob.size,
          urlPromise: uploadCompletionPromise
        });
        if (caption) {
          msg = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.appendLineBreak(msg);
          msg = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.append(msg, tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.parse(caption));
        }
        this.sendMessage(msg, uploadCompletionPromise, uploader);
      }).catch(err => this.props.onError(err, 'err'));
      return;
    }
    (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_16__.blobToBase64)(blob).then(b64 => {
      let msg = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.insertImage(null, 0, {
        mime: b64.mime,
        bits: b64.bits,
        width: width,
        height: height,
        filename: fname,
        size: blob.size
      });
      if (caption) {
        msg = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.appendLineBreak(msg);
        msg = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.append(msg, tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.parse(caption));
      }
      this.sendMessage(msg);
    });
  }
  sendVideoAttachment(caption, videoBlob, previewBlob, params) {
    const width = params.width;
    const height = params.height;
    const maxInbandAttachmentSize = this.props.tinode.getServerParam('maxMessageSize', _config_js__WEBPACK_IMPORTED_MODULE_14__.MAX_INBAND_ATTACHMENT_SIZE) * 0.75 - 1024 | 0;
    const uploads = [];
    let uploader;
    if (videoBlob.size + previewBlob.size > maxInbandAttachmentSize) {
      uploader = this.props.tinode.getLargeFileHelper();
      if (!uploader) {
        this.props.onError(this.props.intl.formatMessage(messages.cannot_initiate_upload));
        return;
      }
      uploads[0] = videoBlob.size > maxInbandAttachmentSize * 0.675 ? uploader.upload(videoBlob) : null;
      uploads[1] = previewBlob.size > maxInbandAttachmentSize * 0.275 ? uploader.upload(previewBlob) : null;
    }
    if (uploads.length == 0) {
      Promise.all([(0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_16__.blobToBase64)(videoBlob), (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_16__.blobToBase64)(previewBlob)]).then(b64s => {
        const [v64, i64] = b64s;
        let msg = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.insertVideo(null, 0, {
          mime: v64.mime,
          bits: v64.bits,
          preview: i64.bits,
          premime: i64.mime,
          width: width,
          height: height,
          duration: params.duration,
          filename: params.name,
          size: videoBlob.size
        });
        if (caption) {
          msg = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.appendLineBreak(msg);
          msg = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.append(msg, tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.parse(caption));
        }
        this.sendMessage(msg);
      });
      return;
    }
    const uploadCompletionPromise = Promise.all(uploads);
    const b64conv = [];
    b64conv[0] = uploads[0] ? null : (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_16__.blobToBase64)(videoBlob);
    b64conv[1] = uploads[1] ? null : (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_16__.imageScaled)(previewBlob, _config_js__WEBPACK_IMPORTED_MODULE_14__.MAX_IMAGE_DIM, _config_js__WEBPACK_IMPORTED_MODULE_14__.MAX_IMAGE_DIM, -1, false).then(scaled => (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_16__.blobToBase64)(scaled.blob));
    b64conv[2] = (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_16__.imageScaled)(previewBlob, _config_js__WEBPACK_IMPORTED_MODULE_14__.VIDEO_PREVIEW_DIM, _config_js__WEBPACK_IMPORTED_MODULE_14__.VIDEO_PREVIEW_DIM, -1, false).then(scaled => (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_16__.blobToBase64)(scaled.blob));
    Promise.all(b64conv).then(b64s => {
      const [video, img, preview] = b64s;
      let msg = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.insertVideo(null, 0, {
        mime: params.mime,
        bits: video ? video.bits : null,
        _tempPreview: preview.bits,
        preview: img ? img.bits : preview.bits,
        premime: img ? img.mime : preview.mime,
        width: width,
        height: height,
        duration: params.duration,
        filename: params.name,
        size: videoBlob.size,
        urlPromise: uploadCompletionPromise
      });
      if (caption) {
        msg = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.appendLineBreak(msg);
        msg = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.append(msg, tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.parse(caption));
      }
      this.sendMessage(msg, uploadCompletionPromise, uploader);
    }).catch(err => this.props.onError(err.message, 'err'));
  }
  handleAttachImageOrVideo(file) {
    const maxExternAttachmentSize = this.props.tinode.getServerParam('maxFileUploadSize', _config_js__WEBPACK_IMPORTED_MODULE_14__.MAX_EXTERN_ATTACHMENT_SIZE);
    if (file.type.startsWith('video/')) {
      this.setState({
        videoPreview: {
          url: URL.createObjectURL(file),
          blob: file,
          filename: file.name,
          size: file.size,
          mime: file.type
        }
      });
      return;
    }
    (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_16__.imageScaled)(file, _config_js__WEBPACK_IMPORTED_MODULE_14__.MAX_IMAGE_DIM, _config_js__WEBPACK_IMPORTED_MODULE_14__.MAX_IMAGE_DIM, maxExternAttachmentSize, false).then(scaled => {
      this.setState({
        imagePreview: {
          url: URL.createObjectURL(scaled.blob),
          blob: scaled.blob,
          filename: scaled.name,
          width: scaled.width,
          height: scaled.height,
          size: scaled.blob.size,
          mime: scaled.mime
        }
      });
    }).catch(err => {
      this.props.onError(err.message, 'err');
    });
  }
  handleFileDrop(files) {
    if (!files || files.length == 0) {
      return;
    }
    const file = files[0];
    if (file.type && file.type.startsWith('image/')) {
      this.handleAttachImageOrVideo(file);
    } else {
      this.handleAttachFile(file);
    }
  }
  sendAudioAttachment(url, preview, duration) {
    fetch(url).then(result => result.blob()).then(blob => {
      const maxInbandAttachmentSize = this.props.tinode.getServerParam('maxMessageSize', _config_js__WEBPACK_IMPORTED_MODULE_14__.MAX_INBAND_ATTACHMENT_SIZE) * 0.75 - 1024;
      if (blob.size > maxInbandAttachmentSize) {
        const uploader = this.props.tinode.getLargeFileHelper();
        if (!uploader) {
          this.props.onError(this.props.intl.formatMessage(messages.cannot_initiate_upload));
          return;
        }
        const uploadCompletionPromise = uploader.upload(blob);
        const msg = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.appendAudio(null, {
          mime: blob.type,
          size: blob.size,
          duration: duration,
          preview: preview,
          urlPromise: uploadCompletionPromise
        });
        this.sendMessage(msg, uploadCompletionPromise, uploader);
      } else {
        (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_16__.blobToBase64)(blob).then(b64 => {
          this.sendMessage(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.appendAudio(null, {
            mime: b64.mime,
            bits: b64.bits,
            size: blob.size,
            duration: duration,
            preview: preview
          }));
        });
      }
    }).catch(err => {
      this.props.onError(err.message, 'err');
    });
    ;
  }
  handleCancelUpload(seq, uploader) {
    const topic = this.props.tinode.getTopic(this.state.topic);
    const found = topic.findMessage(seq);
    if (found) {
      found._cancelled = true;
    }
    uploader.cancel();
  }
  handlePickReply(seq, content, senderId, senderName) {
    if (!seq || !content) {
      this.setState({
        reply: null
      });
      return;
    }
    content = typeof content == 'string' ? tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.init(content) : content;
    if (tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.isValid(content)) {
      content = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.replyContent(content, _config_js__WEBPACK_IMPORTED_MODULE_14__.QUOTED_REPLY_LENGTH);
    } else {
      content = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.append(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.init('\u26A0 '), tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.wrapInto(this.props.intl.formatMessage(messages.invalid_content), 'EM'));
    }
    this.setState({
      reply: {
        content: tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.quote(senderName, senderId, content),
        seq: seq
      }
    });
    this.props.onCancelForwardMessage();
  }
  handleEditMessage(seq, content) {
    if (!seq || !content) {
      this.setState({
        reply: null
      });
      return;
    }
    content = typeof content == 'string' ? tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.init(content) : content;
    const editable = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.toMarkdown(content);
    if (tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.isValid(content)) {
      content = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.replyContent(content, _config_js__WEBPACK_IMPORTED_MODULE_14__.EDIT_PREVIEW_LENGTH);
    } else {
      content = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.append(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.init('\u26A0 '), tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.wrapInto(this.props.intl.formatMessage(messages.invalid_content), 'EM'));
    }
    this.setState({
      reply: {
        content: tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.quote(this.props.intl.formatMessage(messages.editing_message), null, content),
        seq: seq,
        editing: true
      },
      contentToEdit: editable
    });
    this.props.onCancelForwardMessage();
  }
  handleCancelReply() {
    this.setState({
      reply: null,
      contentToEdit: null
    });
    this.props.onCancelForwardMessage();
  }
  handleQuoteClick(replyToSeq) {
    const ref = this.getOrCreateMessageRef(replyToSeq);
    if (ref && ref.current) {
      ref.current.scrollIntoView({
        block: "center",
        behavior: "smooth"
      });
      ref.current.classList.add('flash');
      setTimeout(_ => {
        ref.current.classList.remove('flash');
      }, 1000);
    } else {
      console.error("Unresolved message ref", replyToSeq);
    }
  }
  handleUnpinMessage(seq) {
    const topic = this.props.tinode.getTopic(this.state.topic);
    topic.pinMessage(seq, false);
  }
  isDragEnabled() {
    return this.state.isWriter && !this.state.unconfirmed && !this.props.forwardMessage && !this.state.peerMessagingDisabled;
  }
  handleDragStart(e) {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.clearData();
  }
  handleDragIn(e) {
    e.preventDefault();
    e.stopPropagation();
    this.dragCounter++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      this.setState({
        dragging: true
      });
    }
  }
  handleDragOut(e) {
    e.preventDefault();
    e.stopPropagation();
    this.dragCounter--;
    if (this.dragCounter <= 0) {
      this.setState({
        dragging: false
      });
    }
  }
  handleDrag(e) {
    e.preventDefault();
    e.stopPropagation();
  }
  handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      dragging: false
    });
    if (this.isDragEnabled() && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      this.handleFileDrop(e.dataTransfer.files);
      this.dragCounter = 0;
    }
  }
  render() {
    const {
      formatMessage
    } = this.props.intl;
    const overlay = this.state.rtcPanel && react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react__WEBPACK_IMPORTED_MODULE_0__.Suspense, {
      fallback: react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
        id: "loading_note",
        defaultMessage: [{
          "type": 0,
          "value": "Loading..."
        }]
      }))
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(CallPanel, {
      topic: this.state.topic,
      seq: this.props.callSeq,
      callState: this.props.callState,
      callAudioOnly: this.props.callAudioOnly,
      tinode: this.props.tinode,
      title: this.state.title,
      avatar: this.state.avatar || true,
      minimized: this.state.minimizedCallPanel,
      onError: this.props.onError,
      onHangup: this.handleCallHangup,
      onToggleMinimize: this.handleCallPanelToggle,
      onInvite: this.props.onCallInvite,
      onSendOffer: this.props.onCallSendOffer,
      onIceCandidate: this.props.onCallIceCandidate,
      onSendAnswer: this.props.onCallSendAnswer
    }));
    let component;
    if (!this.state.topic) {
      component = react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_logo_view_jsx__WEBPACK_IMPORTED_MODULE_10__["default"], {
        serverVersion: this.props.serverVersion,
        serverAddress: this.props.serverAddress
      });
    } else {
      let component2;
      if (this.state.imagePreview) {
        component2 = react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react__WEBPACK_IMPORTED_MODULE_0__.Suspense, {
          fallback: react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "loading_note",
            defaultMessage: [{
              "type": 0,
              "value": "Loading..."
            }]
          }))
        }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(ImagePreview, {
          content: this.state.imagePreview,
          tinode: this.props.tinode,
          reply: this.state.reply,
          onCancelReply: this.handleCancelReply,
          onClose: this.handleClosePreview,
          onSendMessage: this.sendImageAttachment
        }));
      } else if (this.state.videoPreview) {
        component2 = react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react__WEBPACK_IMPORTED_MODULE_0__.Suspense, {
          fallback: react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "loading_note",
            defaultMessage: [{
              "type": 0,
              "value": "Loading..."
            }]
          }))
        }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(VideoPreview, {
          content: this.state.videoPreview,
          tinode: this.props.tinode,
          reply: this.state.reply,
          onError: this.props.onError,
          onCancelReply: this.handleCancelReply,
          onClose: this.handleClosePreview,
          onSendMessage: this.sendVideoAttachment
        }));
      } else if (this.state.imagePostview) {
        component2 = react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react__WEBPACK_IMPORTED_MODULE_0__.Suspense, {
          fallback: react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "loading_note",
            defaultMessage: [{
              "type": 0,
              "value": "Loading..."
            }]
          }))
        }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(ImagePreview, {
          content: this.state.imagePostview,
          onClose: this.handleClosePreview
        }));
      } else if (this.state.videoPostview) {
        component2 = react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react__WEBPACK_IMPORTED_MODULE_0__.Suspense, {
          fallback: react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "loading_note",
            defaultMessage: [{
              "type": 0,
              "value": "Loading..."
            }]
          }))
        }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(VideoPreview, {
          content: this.state.videoPostview,
          tinode: this.props.tinode,
          onError: this.props.onError,
          onClose: this.handleClosePreview
        }));
      } else if (this.state.docPreview) {
        if (tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.TheCard.isFileSupported(this.state.docPreview.type, this.state.docPreview.name) || this.state.docPreview.type == tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.TheCard.contentType) {
          component2 = react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react__WEBPACK_IMPORTED_MODULE_0__.Suspense, {
            fallback: react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
              id: "loading_note",
              defaultMessage: [{
                "type": 0,
                "value": "Loading..."
              }]
            }))
          }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(TheCardPreview, {
            content: this.state.docPreview,
            tinode: this.props.tinode,
            reply: this.state.reply,
            onCancelReply: this.handleCancelReply,
            onClose: this.handleClosePreview,
            onSendMessage: this.sendFileAttachment
          }));
        } else {
          component2 = react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react__WEBPACK_IMPORTED_MODULE_0__.Suspense, {
            fallback: react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
              id: "loading_note",
              defaultMessage: [{
                "type": 0,
                "value": "Loading..."
              }]
            }))
          }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(DocPreview, {
            content: this.state.docPreview,
            tinode: this.props.tinode,
            reply: this.state.reply,
            onCancelReply: this.handleCancelReply,
            onClose: this.handleClosePreview,
            onSendMessage: this.sendFileAttachment
          }));
        }
      } else {
        const topic = this.props.tinode.getTopic(this.state.topic);
        const isChannel = topic.isChannelType() || topic.chan;
        const groupTopic = topic.isGroupType() && !isChannel;
        const icon_badges = [];
        if (topic.trusted) {
          if (topic.trusted.verified) {
            icon_badges.push({
              icon: 'verified',
              color: 'badge-inv'
            });
          }
          if (topic.trusted.staff) {
            icon_badges.push({
              icon: 'staff',
              color: 'badge-inv'
            });
          }
          if (topic.trusted.danger) {
            icon_badges.push({
              icon: 'dangerous',
              color: 'badge-inv'
            });
          }
        }
        const pinnedMessages = [];
        this.state.pins.forEach(seq => pinnedMessages.push(topic.latestMsgVersion(seq) || topic.findMessage(seq)));
        const messageNodes = [];
        let previousFrom = null;
        let prevDate = null;
        let chatBoxClass = null;
        topic.messages((msg, prev, next, i) => {
          let nextFrom = next ? next.from || 'chan' : null;
          let sequence = 'single';
          let thisFrom = msg.from || 'chan';
          if (thisFrom == previousFrom) {
            if (thisFrom == nextFrom) {
              sequence = 'middle';
            } else {
              sequence = 'last';
            }
          } else if (thisFrom == nextFrom) {
            sequence = 'first';
          }
          previousFrom = thisFrom;
          const isReply = !(thisFrom == this.props.myUserId);
          const deliveryStatus = topic.msgStatus(msg, true);
          let userFrom = thisFrom,
            userName,
            userAvatar;
          const user = topic.userDesc(thisFrom);
          if (user && user.public) {
            userName = user.public.fn;
            userAvatar = (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_16__.makeImageUrl)(user.public.photo);
          }
          chatBoxClass = groupTopic ? 'chat-box group' : 'chat-box';
          const ref = this.getOrCreateMessageRef(msg.seq);
          let replyToSeq = msg.head ? parseInt(msg.head.reply) : null;
          if (!replyToSeq || isNaN(replyToSeq)) {
            replyToSeq = null;
          }
          if (msg.hi) {
            messageNodes.push(react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_meta_message_jsx__WEBPACK_IMPORTED_MODULE_11__["default"], {
              deleted: true,
              key: msg.seq
            }));
          } else {
            const thisDate = new Date(msg.ts);
            if (!prevDate || prevDate.toDateString() != thisDate.toDateString()) {
              messageNodes.push(react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_meta_message_jsx__WEBPACK_IMPORTED_MODULE_11__["default"], {
                date: (0,_lib_strformat_js__WEBPACK_IMPORTED_MODULE_18__.relativeDateFormat)(msg.ts),
                locale: this.props.intl.locale,
                key: 'date-' + msg.seq
              }));
              prevDate = thisDate;
            }
            messageNodes.push(react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_chat_message_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
              tinode: this.props.tinode,
              topic: this.state.topic,
              content: msg.content,
              mimeType: msg.head && msg.head.mime,
              replyToSeq: replyToSeq,
              edited: msg.head && !msg.head.webrtc && msg.head.replace,
              timestamp: msg.ts,
              response: isReply,
              seq: msg.seq,
              isGroup: groupTopic,
              isChan: this.state.channel,
              userFrom: userFrom,
              userName: userName,
              userAvatar: userAvatar,
              sequence: sequence,
              received: deliveryStatus,
              uploader: msg._uploader,
              userIsWriter: this.state.isWriter,
              userIsAdmin: this.state.isAdmin,
              pinned: this.state.pins.includes(msg.seq),
              viewportWidth: this.props.viewportWidth,
              showContextMenu: this.handleShowMessageContextMenu,
              onExpandMedia: this.handleExpandMedia,
              onFormResponse: this.handleFormResponse,
              onCancelUpload: this.handleCancelUpload,
              pickReply: this.handlePickReply,
              editMessage: this.handleEditMessage,
              onQuoteClick: this.handleQuoteClick,
              onAcceptCall: this.props.onAcceptCall,
              onError: this.props.onError,
              ref: ref,
              key: msg.seq
            }));
          }
        });
        let lastSeen = null;
        if (isChannel) {
          if (topic.subcnt) {
            lastSeen = formatMessage(messages.subscriber_count, {
              count: topic.subcnt
            });
          }
        } else {
          const cont = this.props.tinode.getMeTopic().getContact(this.state.topic);
          if (cont) {
            if (tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Tinode.isP2PTopicName(cont.topic)) {
              if (cont.online) {
                lastSeen = formatMessage(messages.online_now);
              } else if (cont.seen) {
                lastSeen = formatMessage(messages.last_seen, {
                  timestamp: (0,_lib_strformat_js__WEBPACK_IMPORTED_MODULE_18__.shortDateFormat)(cont.seen.when, this.props.intl.locale)
                });
              }
            } else if (tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Tinode.isGroupTopicName(cont.topic)) {
              if (topic.subcnt) {
                lastSeen = formatMessage(messages.member_count, {
                  count: topic.subcnt
                });
              }
            }
          }
        }
        const avatar = this.state.avatar || true;
        const online = this.state.deleted || topic.isSelfType() ? null : this.props.online ? 'online' + (this.state.typingIndicator ? ' typing' : '') : 'offline';
        const titleClass = 'panel-title' + (this.state.deleted ? ' deleted' : '');
        const darkModeClass = this.props.colorSchema == 'dark' ? 'dark' : '';
        let messagesComponent = react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
          id: "messages-container",
          className: darkModeClass
        }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
          id: "go-to-latest",
          className: 'action-button' + (this.state.showGoToLastButton ? '' : ' hidden'),
          onClick: this.goToLatestMessage
        }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
          className: "material-icons"
        }, "arrow_downward")), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
          id: "messages-panel",
          ref: this.handleScrollReference
        }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("ul", {
          id: "scroller",
          className: chatBoxClass
        }, messageNodes)), !this.state.isReader ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
          id: "write-only-background"
        }, this.state.readingBlocked ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
          id: "write-only-note"
        }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
          id: "messages_not_readable",
          defaultMessage: [{
            "type": 0,
            "value": "no access to messages"
          }]
        })) : null) : null), this.state.peerMessagingDisabled && !this.state.unconfirmed ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
          id: "peer-messaging-disabled-note"
        }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
          className: "material-icons secondary"
        }, "block"), " ", react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
          id: "peers_messaging_disabled",
          defaultMessage: [{
            "type": 0,
            "value": "Peer's messaging is disabled."
          }]
        }), " ", react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
          href: "#",
          onClick: this.handleEnablePeer
        }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
          id: "enable_peers_messaging",
          defaultMessage: [{
            "type": 0,
            "value": "Enable"
          }]
        })), ".") : null, this.state.unconfirmed ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_invitation_jsx__WEBPACK_IMPORTED_MODULE_7__["default"], {
          onAction: this.handleNewChatAcceptance
        }) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_send_message_jsx__WEBPACK_IMPORTED_MODULE_13__["default"], {
          tinode: this.props.tinode,
          topicName: this.state.topic,
          noInput: !!this.props.forwardMessage,
          disabled: !this.state.isWriter || this.state.deleted,
          reply: this.state.reply,
          initMessage: this.state.contentToEdit,
          sendOnEnter: this.props.sendOnEnter,
          onKeyPress: this.sendKeyPress,
          onRecordingProgress: this.sendKeyPress,
          onSendMessage: this.sendMessage,
          onAttachFile: this.props.forwardMessage ? null : this.handleAttachFile,
          onAttachImage: this.props.forwardMessage ? null : this.handleAttachImageOrVideo,
          onAttachAudio: this.props.forwardMessage ? null : this.sendAudioAttachment,
          onError: this.props.onError,
          onQuoteClick: this.handleQuoteClick,
          onCancelReply: this.handleCancelReply
        }));
        component2 = react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
          id: "topic-caption-panel",
          className: "caption-panel"
        }, this.props.displayMobile ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
          href: "#",
          id: "hide-message-view",
          onClick: e => {
            e.preventDefault();
            this.leave(this.state.topic);
            this.props.onHideMessagesView();
          }
        }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
          className: "material-icons"
        }, "arrow_back")) : null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
          className: "avatar-box"
        }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_letter_tile_jsx__WEBPACK_IMPORTED_MODULE_8__["default"], {
          authorizeURL: this.props.tinode.authorizeURL,
          avatar: avatar,
          topic: this.state.topic,
          title: this.state.title,
          deleted: this.state.deleted
        }), !isChannel ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
          className: online
        }) : null), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
          id: "topic-title-group"
        }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
          id: "topic-title",
          className: titleClass
        }, this.state.title || react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
          id: "unnamed_topic",
          defaultMessage: [{
            "type": 0,
            "value": "Unnamed"
          }]
        })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_contact_badges_jsx__WEBPACK_IMPORTED_MODULE_4__["default"], {
          badges: icon_badges
        })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
          id: "topic-last-seen"
        }, lastSeen)), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
          style: {
            marginLeft: 'auto'
          }
        }), !this.props.displayMobile && this.state.pins.length > 0 ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_pinned_messages_jsx__WEBPACK_IMPORTED_MODULE_12__["default"], {
          tinode: this.props.tinode,
          pins: this.state.pins,
          messages: pinnedMessages,
          selected: this.state.selectedPin,
          isAdmin: this.state.isAdmin,
          setSelected: index => this.setState({
            selectedPin: index
          }),
          onSelected: this.handleQuoteClick,
          onCancel: this.handleUnpinMessage
        }) : null, groupTopic ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_group_subs_jsx__WEBPACK_IMPORTED_MODULE_6__["default"], {
          tinode: this.props.tinode,
          subscribers: this.state.onlineSubs
        }) : null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
          href: "#",
          onClick: this.handleContextClick
        }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
          className: "material-icons"
        }, "more_vert")))), this.props.displayMobile ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, this.state.pins.length > 0 ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_pinned_messages_jsx__WEBPACK_IMPORTED_MODULE_12__["default"], {
          tinode: this.props.tinode,
          pins: this.state.pins,
          messages: pinnedMessages,
          selected: this.state.selectedPin,
          isAdmin: this.state.isAdmin,
          setSelected: index => this.setState({
            selectedPin: index
          }),
          onSelected: this.handleQuoteClick,
          onCancel: this.handleUnpinMessage
        }) : null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_error_panel_jsx__WEBPACK_IMPORTED_MODULE_5__["default"], {
          level: this.props.errorLevel,
          text: this.props.errorText,
          onClearError: this.props.onError
        })) : null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_load_spinner_jsx__WEBPACK_IMPORTED_MODULE_9__["default"], {
          show: this.state.fetchingMessages
        }), messagesComponent, this.state.dragging && this.isDragEnabled() ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
          className: "drag-n-drop"
        }, formatMessage(messages.drag_file)) : null);
      }
      component = react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        id: "topic-view",
        ref: this.mountDnDEvents
      }, component2, overlay);
    }
    return component;
  }
}
;
/* harmony default export */ __webpack_exports__["default"] = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(MessagesView));

/***/ }),

/***/ "./src/widgets/attachment.jsx":
/*!************************************!*\
  !*** ./src/widgets/attachment.jsx ***!
  \************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Attachment; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _file_progress_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./file-progress.jsx */ "./src/widgets/file-progress.jsx");
/* harmony import */ var _lib_strformat_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/strformat.js */ "./src/lib/strformat.js");
/* harmony import */ var _lib_utils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../lib/utils.js */ "./src/lib/utils.js");





class Attachment extends (react__WEBPACK_IMPORTED_MODULE_0___default().Component) {
  constructor(props) {
    super(props);
    this.state = {
      downloader: null,
      progress: 0
    };
    this.downloadFile = this.downloadFile.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }
  downloadFile(url, filename, mimetype) {
    if (!url) {
      this.props.onError("Invalid download URL '" + url + "'");
      return;
    }
    const downloader = this.props.tinode.getLargeFileHelper();
    this.setState({
      downloader: downloader
    });
    downloader.download(url, filename, mimetype, loaded => this.setState({
      progress: loaded / this.props.size
    }), err => this.props.onError(err, 'err')).then(_ => this.setState({
      downloader: null,
      progress: 0
    })).catch(err => {
      if (err) {
        this.props.onError("Error downloading file: " + err.message, 'err');
      }
      this.setState({
        downloader: null,
        progress: 0
      });
    });
  }
  handleCancel() {
    if (this.props.uploading) {
      this.props.onCancelUpload();
    } else if (this.state.downloader) {
      this.state.downloader.cancel();
    }
  }
  render() {
    let filename = this.props.filename || 'file_attachment';
    if (filename.length > 36) {
      filename = filename.substr(0, 16) + '...' + filename.substr(-16);
    }
    let size = this.props.size > 0 ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
      className: "small gray"
    }, "(", (0,_lib_strformat_js__WEBPACK_IMPORTED_MODULE_3__.bytesToHumanSize)(this.props.size), ")") : null;
    let url, helperFunc;
    if (!this.props.uploading && !this.state.downloader && (0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_4__.isUrlRelative)(this.props.downloadUrl)) {
      url = '#';
      helperFunc = e => {
        e.preventDefault();
        this.downloadFile(this.props.downloadUrl, this.props.filename, this.props.mimetype);
      };
    } else {
      url = (0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_4__.sanitizeUrl)(this.props.downloadUrl);
      helperFunc = null;
    }
    const downloadWidget = react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "file_download"), " ", react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "save_attachment",
      defaultMessage: [{
        "type": 0,
        "value": "save"
      }]
    }));
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "attachment"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons big gray"
    }, "insert_drive_file")), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "flex-column"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, filename, " ", size), this.props.uploading || this.state.downloader ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_file_progress_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
      progress: this.props.uploading ? this.props.progress : this.state.progress,
      onCancel: this.handleCancel
    }) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, url ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: url,
      download: this.props.filename,
      onClick: helperFunc
    }, downloadWidget) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
      className: "light-gray"
    }, downloadWidget))));
  }
}
;

/***/ }),

/***/ "./src/widgets/chat-message.jsx":
/*!**************************************!*\
  !*** ./src/widgets/chat-message.jsx ***!
  \**************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tinode-sdk */ "tinode-sdk");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _attachment_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./attachment.jsx */ "./src/widgets/attachment.jsx");
/* harmony import */ var _letter_tile_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./letter-tile.jsx */ "./src/widgets/letter-tile.jsx");
/* harmony import */ var _received_marker_jsx__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./received-marker.jsx */ "./src/widgets/received-marker.jsx");
/* harmony import */ var _lib_formatters_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../lib/formatters.js */ "./src/lib/formatters.js");
/* harmony import */ var _lib_utils_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../lib/utils.js */ "./src/lib/utils.js");
/* harmony import */ var _lib_navigation_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../lib/navigation.js */ "./src/lib/navigation.js");
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }









class BaseChatMessage extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
    this.state = {
      progress: 0
    };
    if (props.uploader) {
      props.uploader.onProgress = this.handleProgress.bind(this);
    }
    this.handleExpandImage = this.handleExpandImage.bind(this);
    this.handlePlayVideo = this.handlePlayVideo.bind(this);
    this.handleFormButtonClick = this.handleFormButtonClick.bind(this);
    this.handleQuoteClick = this.handleQuoteClick.bind(this);
    this.handleContextClick = this.handleContextClick.bind(this);
    this.handleCancelUpload = this.handleCancelUpload.bind(this);
    this.handleDraftyClick = this.handleDraftyClick.bind(this);
    this.formatterContext = {
      formatMessage: props.intl.formatMessage.bind(props.intl),
      viewportWidth: props.viewportWidth,
      authorizeURL: props.tinode.authorizeURL.bind(props.tinode),
      onHandleClick: this.handleDraftyClick
    };
  }
  handleDraftyClick = (e, action) => {
    switch (action) {
      case 'image':
        this.handleExpandImage(e);
        break;
      case 'video':
        this.handlePlayVideo(e);
        break;
      case 'form_button':
        this.handleFormButtonClick(e);
        break;
      case 'quote':
        this.handleQuoteClick(e);
        break;
      case 'contact_chat':
        e.preventDefault();
        try {
          const pathname = new URL(e.target.dataset.val)?.pathname;
          const parts = pathname.split('/').filter(Boolean);
          _lib_navigation_js__WEBPACK_IMPORTED_MODULE_8__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_8__["default"].setUrlTopic('', parts.pop() || ''));
        } catch (error) {
          console.error("Invalid URL:", error);
        }
        break;
      case 'contact_find':
        e.preventDefault();
        let hashUrl = _lib_navigation_js__WEBPACK_IMPORTED_MODULE_8__["default"].setUrlSidePanel(window.location.hash, 'newtpk');
        hashUrl = _lib_navigation_js__WEBPACK_IMPORTED_MODULE_8__["default"].addUrlParam(hashUrl, 'q', e.target.dataset.val);
        hashUrl = _lib_navigation_js__WEBPACK_IMPORTED_MODULE_8__["default"].addUrlParam(hashUrl, 'tab', 'find');
        _lib_navigation_js__WEBPACK_IMPORTED_MODULE_8__["default"].navigateTo(hashUrl);
        break;
      default:
        console.info('Unhandled drafty action.', action, e.target.dataset);
        break;
    }
  };
  handleExpandImage(e) {
    e.preventDefault();
    this.props.onExpandMedia({
      url: e.target.src,
      filename: e.target.dataset.name,
      width: e.target.dataset.width,
      height: e.target.dataset.height,
      size: e.target.dataset.size,
      type: e.target.dataset.mime
    });
  }
  handlePlayVideo(e) {
    e.preventDefault();
    this.props.onExpandMedia({
      video: true,
      url: e.target.dataset.src,
      preview: e.target.src,
      filename: e.target.dataset.name,
      width: e.target.dataset.width,
      height: e.target.dataset.height,
      duration: e.target.dataset.duration,
      size: e.target.dataset.size,
      type: e.target.dataset.mime
    });
  }
  handleFormButtonClick(e) {
    e.preventDefault();
    const data = {
      seq: this.props.seq
    };
    data.resp = {};
    if (e.target.dataset.name) {
      data.resp[e.target.dataset.name] = e.target.dataset.val ? e.target.dataset.val : e.target.dataset.val === undefined ? 1 : '' + e.target.dataset.val;
    }
    if (e.target.dataset.act == 'url') {
      data.ref = (0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_7__.sanitizeUrl)(e.target.dataset.ref) || 'about:blank';
    }
    const text = e.target.dataset.title || 'unknown';
    this.props.onFormResponse(e.target.dataset.act, text, data);
  }
  handleContextClick(e) {
    e.preventDefault();
    e.stopPropagation();
    const menuItems = [];
    if (this.props.received == tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Tinode.MESSAGE_STATUS_FAILED) {
      menuItems.push('menu_item_send_retry');
    }
    if (this.props.received > tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Tinode.MESSAGE_STATUS_FATAL) {
      if (this.props.userIsWriter) {
        menuItems.push('menu_item_reply');
        if (!this.props.response) {
          let immutable = false;
          tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.entities(this.props.content, (_0, _1, tp) => {
            immutable = ['AU', 'EX', 'FM', 'IM', 'TC', 'VC', 'VD'].includes(tp);
            return immutable;
          });
          if (!immutable) {
            tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.styles(this.props.content, tp => {
              immutable = ['QQ'].includes(tp);
              return immutable;
            });
          }
          if (!immutable) {
            menuItems.push('menu_item_edit');
          }
        }
      }
      if (this.props.userIsAdmin) {
        menuItems.push(this.props.pinned ? 'menu_item_unpin' : 'menu_item_pin');
      }
    }
    menuItems.push('menu_item_forward');
    this.props.showContextMenu({
      seq: this.props.seq,
      replace: this.props.edited ? parseInt(this.props.edited.split(':')[1]) : 0,
      content: this.props.content,
      userFrom: this.props.userFrom,
      userName: this.props.userName,
      y: e.pageY,
      x: e.pageX,
      pickReply: this.props.pickReply,
      editMessage: this.props.editMessage,
      timestamp: this.props.timestamp
    }, menuItems);
  }
  handleProgress(ratio) {
    this.setState({
      progress: ratio
    });
  }
  handleCancelUpload() {
    this.props.onCancelUpload(this.props.seq, this.props.uploader);
  }
  handleQuoteClick(e) {
    e.preventDefault();
    e.stopPropagation();
    const replyToSeq = this.props.replyToSeq;
    if (replyToSeq) {
      this.props.onQuoteClick(replyToSeq);
    }
  }
  render() {
    const sideClass = this.props.sequence + ' ' + (this.props.response ? 'left' : 'right');
    const bubbleClass = this.props.sequence == 'single' || this.props.sequence == 'last' ? 'bubble tip' : 'bubble';
    const avatar = this.props.userAvatar || true;
    let textSizeClass = 'message-content';
    const fullDisplay = this.props.isGroup && this.props.response && (this.props.sequence == 'single' || this.props.sequence == 'last');
    let content = this.props.content;
    const attachments = [];
    if (this.props.mimeType == tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.getContentType() && tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.isValid(content)) {
      tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.attachments(content, (att, i) => {
        if (tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.isFormResponseType(att.mime)) {
          return;
        }
        attachments.push(react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_attachment_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
          tinode: this.props.tinode,
          downloadUrl: tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.getDownloadUrl(att),
          filename: att.name,
          uploading: tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.isProcessing(att),
          mimetype: att.mime,
          size: tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.getEntitySize(att),
          progress: this.state.progress,
          onCancelUpload: this.handleCancelUpload,
          onError: this.props.onError,
          key: i
        }));
      }, this);
      const tree = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.format(content, _lib_formatters_js__WEBPACK_IMPORTED_MODULE_6__.fullFormatter, this.formatterContext);
      content = react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, tree);
    } else if (typeof content == 'string') {
      if (new RegExp('^\\p{RGI_Emoji}{1,5}$', 'v').test(content || '')) {
        textSizeClass += ' emoji-' + (content || '').match(/(?:👨🏻‍❤️‍💋‍👨🏻|👨🏻‍❤️‍💋‍👨🏼|👨🏻‍❤️‍💋‍👨🏽|👨🏻‍❤️‍💋‍👨🏾|👨🏻‍❤️‍💋‍👨🏿|👨🏼‍❤️‍💋‍👨🏻|👨🏼‍❤️‍💋‍👨🏼|👨🏼‍❤️‍💋‍👨🏽|👨🏼‍❤️‍💋‍👨🏾|👨🏼‍❤️‍💋‍👨🏿|👨🏽‍❤️‍💋‍👨🏻|👨🏽‍❤️‍💋‍👨🏼|👨🏽‍❤️‍💋‍👨🏽|👨🏽‍❤️‍💋‍👨🏾|👨🏽‍❤️‍💋‍👨🏿|👨🏾‍❤️‍💋‍👨🏻|👨🏾‍❤️‍💋‍👨🏼|👨🏾‍❤️‍💋‍👨🏽|👨🏾‍❤️‍💋‍👨🏾|👨🏾‍❤️‍💋‍👨🏿|👨🏿‍❤️‍💋‍👨🏻|👨🏿‍❤️‍💋‍👨🏼|👨🏿‍❤️‍💋‍👨🏽|👨🏿‍❤️‍💋‍👨🏾|👨🏿‍❤️‍💋‍👨🏿|👩🏻‍❤️‍💋‍👨🏻|👩🏻‍❤️‍💋‍👨🏼|👩🏻‍❤️‍💋‍👨🏽|👩🏻‍❤️‍💋‍👨🏾|👩🏻‍❤️‍💋‍👨🏿|👩🏻‍❤️‍💋‍👩🏻|👩🏻‍❤️‍💋‍👩🏼|👩🏻‍❤️‍💋‍👩🏽|👩🏻‍❤️‍💋‍👩🏾|👩🏻‍❤️‍💋‍👩🏿|👩🏼‍❤️‍💋‍👨🏻|👩🏼‍❤️‍💋‍👨🏼|👩🏼‍❤️‍💋‍👨🏽|👩🏼‍❤️‍💋‍👨🏾|👩🏼‍❤️‍💋‍👨🏿|👩🏼‍❤️‍💋‍👩🏻|👩🏼‍❤️‍💋‍👩🏼|👩🏼‍❤️‍💋‍👩🏽|👩🏼‍❤️‍💋‍👩🏾|👩🏼‍❤️‍💋‍👩🏿|👩🏽‍❤️‍💋‍👨🏻|👩🏽‍❤️‍💋‍👨🏼|👩🏽‍❤️‍💋‍👨🏽|👩🏽‍❤️‍💋‍👨🏾|👩🏽‍❤️‍💋‍👨🏿|👩🏽‍❤️‍💋‍👩🏻|👩🏽‍❤️‍💋‍👩🏼|👩🏽‍❤️‍💋‍👩🏽|👩🏽‍❤️‍💋‍👩🏾|👩🏽‍❤️‍💋‍👩🏿|👩🏾‍❤️‍💋‍👨🏻|👩🏾‍❤️‍💋‍👨🏼|👩🏾‍❤️‍💋‍👨🏽|👩🏾‍❤️‍💋‍👨🏾|👩🏾‍❤️‍💋‍👨🏿|👩🏾‍❤️‍💋‍👩🏻|👩🏾‍❤️‍💋‍👩🏼|👩🏾‍❤️‍💋‍👩🏽|👩🏾‍❤️‍💋‍👩🏾|👩🏾‍❤️‍💋‍👩🏿|👩🏿‍❤️‍💋‍👨🏻|👩🏿‍❤️‍💋‍👨🏼|👩🏿‍❤️‍💋‍👨🏽|👩🏿‍❤️‍💋‍👨🏾|👩🏿‍❤️‍💋‍👨🏿|👩🏿‍❤️‍💋‍👩🏻|👩🏿‍❤️‍💋‍👩🏼|👩🏿‍❤️‍💋‍👩🏽|👩🏿‍❤️‍💋‍👩🏾|👩🏿‍❤️‍💋‍👩🏿|🧑🏻‍❤️‍💋‍🧑🏼|🧑🏻‍❤️‍💋‍🧑🏽|🧑🏻‍❤️‍💋‍🧑🏾|🧑🏻‍❤️‍💋‍🧑🏿|🧑🏼‍❤️‍💋‍🧑🏻|🧑🏼‍❤️‍💋‍🧑🏽|🧑🏼‍❤️‍💋‍🧑🏾|🧑🏼‍❤️‍💋‍🧑🏿|🧑🏽‍❤️‍💋‍🧑🏻|🧑🏽‍❤️‍💋‍🧑🏼|🧑🏽‍❤️‍💋‍🧑🏾|🧑🏽‍❤️‍💋‍🧑🏿|🧑🏾‍❤️‍💋‍🧑🏻|🧑🏾‍❤️‍💋‍🧑🏼|🧑🏾‍❤️‍💋‍🧑🏽|🧑🏾‍❤️‍💋‍🧑🏿|🧑🏿‍❤️‍💋‍🧑🏻|🧑🏿‍❤️‍💋‍🧑🏼|🧑🏿‍❤️‍💋‍🧑🏽|🧑🏿‍❤️‍💋‍🧑🏾|🏴󠁧󠁢󠁥󠁮󠁧󠁿|🏴󠁧󠁢󠁳󠁣󠁴󠁿|🏴󠁧󠁢󠁷󠁬󠁳󠁿|👨🏻‍❤️‍👨🏻|👨🏻‍❤️‍👨🏼|👨🏻‍❤️‍👨🏽|👨🏻‍❤️‍👨🏾|👨🏻‍❤️‍👨🏿|👨🏻‍🐰‍👨🏼|👨🏻‍🐰‍👨🏽|👨🏻‍🐰‍👨🏾|👨🏻‍🐰‍👨🏿|👨🏻‍🤝‍👨🏼|👨🏻‍🤝‍👨🏽|👨🏻‍🤝‍👨🏾|👨🏻‍🤝‍👨🏿|👨🏻‍🫯‍👨🏼|👨🏻‍🫯‍👨🏽|👨🏻‍🫯‍👨🏾|👨🏻‍🫯‍👨🏿|👨🏼‍❤️‍👨🏻|👨🏼‍❤️‍👨🏼|👨🏼‍❤️‍👨🏽|👨🏼‍❤️‍👨🏾|👨🏼‍❤️‍👨🏿|👨🏼‍🐰‍👨🏻|👨🏼‍🐰‍👨🏽|👨🏼‍🐰‍👨🏾|👨🏼‍🐰‍👨🏿|👨🏼‍🤝‍👨🏻|👨🏼‍🤝‍👨🏽|👨🏼‍🤝‍👨🏾|👨🏼‍🤝‍👨🏿|👨🏼‍🫯‍👨🏻|👨🏼‍🫯‍👨🏽|👨🏼‍🫯‍👨🏾|👨🏼‍🫯‍👨🏿|👨🏽‍❤️‍👨🏻|👨🏽‍❤️‍👨🏼|👨🏽‍❤️‍👨🏽|👨🏽‍❤️‍👨🏾|👨🏽‍❤️‍👨🏿|👨🏽‍🐰‍👨🏻|👨🏽‍🐰‍👨🏼|👨🏽‍🐰‍👨🏾|👨🏽‍🐰‍👨🏿|👨🏽‍🤝‍👨🏻|👨🏽‍🤝‍👨🏼|👨🏽‍🤝‍👨🏾|👨🏽‍🤝‍👨🏿|👨🏽‍🫯‍👨🏻|👨🏽‍🫯‍👨🏼|👨🏽‍🫯‍👨🏾|👨🏽‍🫯‍👨🏿|👨🏾‍❤️‍👨🏻|👨🏾‍❤️‍👨🏼|👨🏾‍❤️‍👨🏽|👨🏾‍❤️‍👨🏾|👨🏾‍❤️‍👨🏿|👨🏾‍🐰‍👨🏻|👨🏾‍🐰‍👨🏼|👨🏾‍🐰‍👨🏽|👨🏾‍🐰‍👨🏿|👨🏾‍🤝‍👨🏻|👨🏾‍🤝‍👨🏼|👨🏾‍🤝‍👨🏽|👨🏾‍🤝‍👨🏿|👨🏾‍🫯‍👨🏻|👨🏾‍🫯‍👨🏼|👨🏾‍🫯‍👨🏽|👨🏾‍🫯‍👨🏿|👨🏿‍❤️‍👨🏻|👨🏿‍❤️‍👨🏼|👨🏿‍❤️‍👨🏽|👨🏿‍❤️‍👨🏾|👨🏿‍❤️‍👨🏿|👨🏿‍🐰‍👨🏻|👨🏿‍🐰‍👨🏼|👨🏿‍🐰‍👨🏽|👨🏿‍🐰‍👨🏾|👨🏿‍🤝‍👨🏻|👨🏿‍🤝‍👨🏼|👨🏿‍🤝‍👨🏽|👨🏿‍🤝‍👨🏾|👨🏿‍🫯‍👨🏻|👨🏿‍🫯‍👨🏼|👨🏿‍🫯‍👨🏽|👨🏿‍🫯‍👨🏾|👩🏻‍❤️‍👨🏻|👩🏻‍❤️‍👨🏼|👩🏻‍❤️‍👨🏽|👩🏻‍❤️‍👨🏾|👩🏻‍❤️‍👨🏿|👩🏻‍❤️‍👩🏻|👩🏻‍❤️‍👩🏼|👩🏻‍❤️‍👩🏽|👩🏻‍❤️‍👩🏾|👩🏻‍❤️‍👩🏿|👩🏻‍🐰‍👩🏼|👩🏻‍🐰‍👩🏽|👩🏻‍🐰‍👩🏾|👩🏻‍🐰‍👩🏿|👩🏻‍🤝‍👨🏼|👩🏻‍🤝‍👨🏽|👩🏻‍🤝‍👨🏾|👩🏻‍🤝‍👨🏿|👩🏻‍🤝‍👩🏼|👩🏻‍🤝‍👩🏽|👩🏻‍🤝‍👩🏾|👩🏻‍🤝‍👩🏿|👩🏻‍🫯‍👩🏼|👩🏻‍🫯‍👩🏽|👩🏻‍🫯‍👩🏾|👩🏻‍🫯‍👩🏿|👩🏼‍❤️‍👨🏻|👩🏼‍❤️‍👨🏼|👩🏼‍❤️‍👨🏽|👩🏼‍❤️‍👨🏾|👩🏼‍❤️‍👨🏿|👩🏼‍❤️‍👩🏻|👩🏼‍❤️‍👩🏼|👩🏼‍❤️‍👩🏽|👩🏼‍❤️‍👩🏾|👩🏼‍❤️‍👩🏿|👩🏼‍🐰‍👩🏻|👩🏼‍🐰‍👩🏽|👩🏼‍🐰‍👩🏾|👩🏼‍🐰‍👩🏿|👩🏼‍🤝‍👨🏻|👩🏼‍🤝‍👨🏽|👩🏼‍🤝‍👨🏾|👩🏼‍🤝‍👨🏿|👩🏼‍🤝‍👩🏻|👩🏼‍🤝‍👩🏽|👩🏼‍🤝‍👩🏾|👩🏼‍🤝‍👩🏿|👩🏼‍🫯‍👩🏻|👩🏼‍🫯‍👩🏽|👩🏼‍🫯‍👩🏾|👩🏼‍🫯‍👩🏿|👩🏽‍❤️‍👨🏻|👩🏽‍❤️‍👨🏼|👩🏽‍❤️‍👨🏽|👩🏽‍❤️‍👨🏾|👩🏽‍❤️‍👨🏿|👩🏽‍❤️‍👩🏻|👩🏽‍❤️‍👩🏼|👩🏽‍❤️‍👩🏽|👩🏽‍❤️‍👩🏾|👩🏽‍❤️‍👩🏿|👩🏽‍🐰‍👩🏻|👩🏽‍🐰‍👩🏼|👩🏽‍🐰‍👩🏾|👩🏽‍🐰‍👩🏿|👩🏽‍🤝‍👨🏻|👩🏽‍🤝‍👨🏼|👩🏽‍🤝‍👨🏾|👩🏽‍🤝‍👨🏿|👩🏽‍🤝‍👩🏻|👩🏽‍🤝‍👩🏼|👩🏽‍🤝‍👩🏾|👩🏽‍🤝‍👩🏿|👩🏽‍🫯‍👩🏻|👩🏽‍🫯‍👩🏼|👩🏽‍🫯‍👩🏾|👩🏽‍🫯‍👩🏿|👩🏾‍❤️‍👨🏻|👩🏾‍❤️‍👨🏼|👩🏾‍❤️‍👨🏽|👩🏾‍❤️‍👨🏾|👩🏾‍❤️‍👨🏿|👩🏾‍❤️‍👩🏻|👩🏾‍❤️‍👩🏼|👩🏾‍❤️‍👩🏽|👩🏾‍❤️‍👩🏾|👩🏾‍❤️‍👩🏿|👩🏾‍🐰‍👩🏻|👩🏾‍🐰‍👩🏼|👩🏾‍🐰‍👩🏽|👩🏾‍🐰‍👩🏿|👩🏾‍🤝‍👨🏻|👩🏾‍🤝‍👨🏼|👩🏾‍🤝‍👨🏽|👩🏾‍🤝‍👨🏿|👩🏾‍🤝‍👩🏻|👩🏾‍🤝‍👩🏼|👩🏾‍🤝‍👩🏽|👩🏾‍🤝‍👩🏿|👩🏾‍🫯‍👩🏻|👩🏾‍🫯‍👩🏼|👩🏾‍🫯‍👩🏽|👩🏾‍🫯‍👩🏿|👩🏿‍❤️‍👨🏻|👩🏿‍❤️‍👨🏼|👩🏿‍❤️‍👨🏽|👩🏿‍❤️‍👨🏾|👩🏿‍❤️‍👨🏿|👩🏿‍❤️‍👩🏻|👩🏿‍❤️‍👩🏼|👩🏿‍❤️‍👩🏽|👩🏿‍❤️‍👩🏾|👩🏿‍❤️‍👩🏿|👩🏿‍🐰‍👩🏻|👩🏿‍🐰‍👩🏼|👩🏿‍🐰‍👩🏽|👩🏿‍🐰‍👩🏾|👩🏿‍🤝‍👨🏻|👩🏿‍🤝‍👨🏼|👩🏿‍🤝‍👨🏽|👩🏿‍🤝‍👨🏾|👩🏿‍🤝‍👩🏻|👩🏿‍🤝‍👩🏼|👩🏿‍🤝‍👩🏽|👩🏿‍🤝‍👩🏾|👩🏿‍🫯‍👩🏻|👩🏿‍🫯‍👩🏼|👩🏿‍🫯‍👩🏽|👩🏿‍🫯‍👩🏾|🧑🏻‍❤️‍🧑🏼|🧑🏻‍❤️‍🧑🏽|🧑🏻‍❤️‍🧑🏾|🧑🏻‍❤️‍🧑🏿|🧑🏻‍🐰‍🧑🏼|🧑🏻‍🐰‍🧑🏽|🧑🏻‍🐰‍🧑🏾|🧑🏻‍🐰‍🧑🏿|🧑🏻‍🤝‍🧑🏻|🧑🏻‍🤝‍🧑🏼|🧑🏻‍🤝‍🧑🏽|🧑🏻‍🤝‍🧑🏾|🧑🏻‍🤝‍🧑🏿|🧑🏻‍🫯‍🧑🏼|🧑🏻‍🫯‍🧑🏽|🧑🏻‍🫯‍🧑🏾|🧑🏻‍🫯‍🧑🏿|🧑🏼‍❤️‍🧑🏻|🧑🏼‍❤️‍🧑🏽|🧑🏼‍❤️‍🧑🏾|🧑🏼‍❤️‍🧑🏿|🧑🏼‍🐰‍🧑🏻|🧑🏼‍🐰‍🧑🏽|🧑🏼‍🐰‍🧑🏾|🧑🏼‍🐰‍🧑🏿|🧑🏼‍🤝‍🧑🏻|🧑🏼‍🤝‍🧑🏼|🧑🏼‍🤝‍🧑🏽|🧑🏼‍🤝‍🧑🏾|🧑🏼‍🤝‍🧑🏿|🧑🏼‍🫯‍🧑🏻|🧑🏼‍🫯‍🧑🏽|🧑🏼‍🫯‍🧑🏾|🧑🏼‍🫯‍🧑🏿|🧑🏽‍❤️‍🧑🏻|🧑🏽‍❤️‍🧑🏼|🧑🏽‍❤️‍🧑🏾|🧑🏽‍❤️‍🧑🏿|🧑🏽‍🐰‍🧑🏻|🧑🏽‍🐰‍🧑🏼|🧑🏽‍🐰‍🧑🏾|🧑🏽‍🐰‍🧑🏿|🧑🏽‍🤝‍🧑🏻|🧑🏽‍🤝‍🧑🏼|🧑🏽‍🤝‍🧑🏽|🧑🏽‍🤝‍🧑🏾|🧑🏽‍🤝‍🧑🏿|🧑🏽‍🫯‍🧑🏻|🧑🏽‍🫯‍🧑🏼|🧑🏽‍🫯‍🧑🏾|🧑🏽‍🫯‍🧑🏿|🧑🏾‍❤️‍🧑🏻|🧑🏾‍❤️‍🧑🏼|🧑🏾‍❤️‍🧑🏽|🧑🏾‍❤️‍🧑🏿|🧑🏾‍🐰‍🧑🏻|🧑🏾‍🐰‍🧑🏼|🧑🏾‍🐰‍🧑🏽|🧑🏾‍🐰‍🧑🏿|🧑🏾‍🤝‍🧑🏻|🧑🏾‍🤝‍🧑🏼|🧑🏾‍🤝‍🧑🏽|🧑🏾‍🤝‍🧑🏾|🧑🏾‍🤝‍🧑🏿|🧑🏾‍🫯‍🧑🏻|🧑🏾‍🫯‍🧑🏼|🧑🏾‍🫯‍🧑🏽|🧑🏾‍🫯‍🧑🏿|🧑🏿‍❤️‍🧑🏻|🧑🏿‍❤️‍🧑🏼|🧑🏿‍❤️‍🧑🏽|🧑🏿‍❤️‍🧑🏾|🧑🏿‍🐰‍🧑🏻|🧑🏿‍🐰‍🧑🏼|🧑🏿‍🐰‍🧑🏽|🧑🏿‍🐰‍🧑🏾|🧑🏿‍🤝‍🧑🏻|🧑🏿‍🤝‍🧑🏼|🧑🏿‍🤝‍🧑🏽|🧑🏿‍🤝‍🧑🏾|🧑🏿‍🤝‍🧑🏿|🧑🏿‍🫯‍🧑🏻|🧑🏿‍🫯‍🧑🏼|🧑🏿‍🫯‍🧑🏽|🧑🏿‍🫯‍🧑🏾|👨‍❤️‍💋‍👨|👨‍👨‍👦‍👦|👨‍👨‍👧‍👦|👨‍👨‍👧‍👧|👨‍👩‍👦‍👦|👨‍👩‍👧‍👦|👨‍👩‍👧‍👧|👩‍❤️‍💋‍👨|👩‍❤️‍💋‍👩|👩‍👩‍👦‍👦|👩‍👩‍👧‍👦|👩‍👩‍👧‍👧|🧑‍🧑‍🧒‍🧒|🏃🏻‍♀️‍➡️|🏃🏻‍♂️‍➡️|🏃🏼‍♀️‍➡️|🏃🏼‍♂️‍➡️|🏃🏽‍♀️‍➡️|🏃🏽‍♂️‍➡️|🏃🏾‍♀️‍➡️|🏃🏾‍♂️‍➡️|🏃🏿‍♀️‍➡️|🏃🏿‍♂️‍➡️|👨🏻‍🦯‍➡️|👨🏻‍🦼‍➡️|👨🏻‍🦽‍➡️|👨🏼‍🦯‍➡️|👨🏼‍🦼‍➡️|👨🏼‍🦽‍➡️|👨🏽‍🦯‍➡️|👨🏽‍🦼‍➡️|👨🏽‍🦽‍➡️|👨🏾‍🦯‍➡️|👨🏾‍🦼‍➡️|👨🏾‍🦽‍➡️|👨🏿‍🦯‍➡️|👨🏿‍🦼‍➡️|👨🏿‍🦽‍➡️|👩🏻‍🦯‍➡️|👩🏻‍🦼‍➡️|👩🏻‍🦽‍➡️|👩🏼‍🦯‍➡️|👩🏼‍🦼‍➡️|👩🏼‍🦽‍➡️|👩🏽‍🦯‍➡️|👩🏽‍🦼‍➡️|👩🏽‍🦽‍➡️|👩🏾‍🦯‍➡️|👩🏾‍🦼‍➡️|👩🏾‍🦽‍➡️|👩🏿‍🦯‍➡️|👩🏿‍🦼‍➡️|👩🏿‍🦽‍➡️|🚶🏻‍♀️‍➡️|🚶🏻‍♂️‍➡️|🚶🏼‍♀️‍➡️|🚶🏼‍♂️‍➡️|🚶🏽‍♀️‍➡️|🚶🏽‍♂️‍➡️|🚶🏾‍♀️‍➡️|🚶🏾‍♂️‍➡️|🚶🏿‍♀️‍➡️|🚶🏿‍♂️‍➡️|🧎🏻‍♀️‍➡️|🧎🏻‍♂️‍➡️|🧎🏼‍♀️‍➡️|🧎🏼‍♂️‍➡️|🧎🏽‍♀️‍➡️|🧎🏽‍♂️‍➡️|🧎🏾‍♀️‍➡️|🧎🏾‍♂️‍➡️|🧎🏿‍♀️‍➡️|🧎🏿‍♂️‍➡️|🧑🏻‍🦯‍➡️|🧑🏻‍🦼‍➡️|🧑🏻‍🦽‍➡️|🧑🏼‍🦯‍➡️|🧑🏼‍🦼‍➡️|🧑🏼‍🦽‍➡️|🧑🏽‍🦯‍➡️|🧑🏽‍🦼‍➡️|🧑🏽‍🦽‍➡️|🧑🏾‍🦯‍➡️|🧑🏾‍🦼‍➡️|🧑🏾‍🦽‍➡️|🧑🏿‍🦯‍➡️|🧑🏿‍🦼‍➡️|🧑🏿‍🦽‍➡️|🫱🏻‍🫲🏼|🫱🏻‍🫲🏽|🫱🏻‍🫲🏾|🫱🏻‍🫲🏿|🫱🏼‍🫲🏻|🫱🏼‍🫲🏽|🫱🏼‍🫲🏾|🫱🏼‍🫲🏿|🫱🏽‍🫲🏻|🫱🏽‍🫲🏼|🫱🏽‍🫲🏾|🫱🏽‍🫲🏿|🫱🏾‍🫲🏻|🫱🏾‍🫲🏼|🫱🏾‍🫲🏽|🫱🏾‍🫲🏿|🫱🏿‍🫲🏻|🫱🏿‍🫲🏼|🫱🏿‍🫲🏽|🫱🏿‍🫲🏾|🏃‍♀️‍➡️|🏃‍♂️‍➡️|👨‍❤️‍👨|👨‍👦‍👦|👨‍👧‍👦|👨‍👧‍👧|👨‍👨‍👦|👨‍👨‍👧|👨‍👩‍👦|👨‍👩‍👧|👨‍🦯‍➡️|👨‍🦼‍➡️|👨‍🦽‍➡️|👩‍❤️‍👨|👩‍❤️‍👩|👩‍👦‍👦|👩‍👧‍👦|👩‍👧‍👧|👩‍👩‍👦|👩‍👩‍👧|👩‍🦯‍➡️|👩‍🦼‍➡️|👩‍🦽‍➡️|🚶‍♀️‍➡️|🚶‍♂️‍➡️|🧎‍♀️‍➡️|🧎‍♂️‍➡️|🧑‍🤝‍🧑|🧑‍🦯‍➡️|🧑‍🦼‍➡️|🧑‍🦽‍➡️|🧑‍🧑‍🧒|🧑‍🧒‍🧒|🏃🏻‍♀️|🏃🏻‍♂️|🏃🏻‍➡️|🏃🏼‍♀️|🏃🏼‍♂️|🏃🏼‍➡️|🏃🏽‍♀️|🏃🏽‍♂️|🏃🏽‍➡️|🏃🏾‍♀️|🏃🏾‍♂️|🏃🏾‍➡️|🏃🏿‍♀️|🏃🏿‍♂️|🏃🏿‍➡️|🏄🏻‍♀️|🏄🏻‍♂️|🏄🏼‍♀️|🏄🏼‍♂️|🏄🏽‍♀️|🏄🏽‍♂️|🏄🏾‍♀️|🏄🏾‍♂️|🏄🏿‍♀️|🏄🏿‍♂️|🏊🏻‍♀️|🏊🏻‍♂️|🏊🏼‍♀️|🏊🏼‍♂️|🏊🏽‍♀️|🏊🏽‍♂️|🏊🏾‍♀️|🏊🏾‍♂️|🏊🏿‍♀️|🏊🏿‍♂️|🏋🏻‍♀️|🏋🏻‍♂️|🏋🏼‍♀️|🏋🏼‍♂️|🏋🏽‍♀️|🏋🏽‍♂️|🏋🏾‍♀️|🏋🏾‍♂️|🏋🏿‍♀️|🏋🏿‍♂️|🏌🏻‍♀️|🏌🏻‍♂️|🏌🏼‍♀️|🏌🏼‍♂️|🏌🏽‍♀️|🏌🏽‍♂️|🏌🏾‍♀️|🏌🏾‍♂️|🏌🏿‍♀️|🏌🏿‍♂️|👁️‍🗨️|👨🏻‍⚕️|👨🏻‍⚖️|👨🏻‍✈️|👨🏻‍🌾|👨🏻‍🍳|👨🏻‍🍼|👨🏻‍🎓|👨🏻‍🎤|👨🏻‍🎨|👨🏻‍🏫|👨🏻‍🏭|👨🏻‍💻|👨🏻‍💼|👨🏻‍🔧|👨🏻‍🔬|👨🏻‍🚀|👨🏻‍🚒|👨🏻‍🦯|👨🏻‍🦰|👨🏻‍🦱|👨🏻‍🦲|👨🏻‍🦳|👨🏻‍🦼|👨🏻‍🦽|👨🏼‍⚕️|👨🏼‍⚖️|👨🏼‍✈️|👨🏼‍🌾|👨🏼‍🍳|👨🏼‍🍼|👨🏼‍🎓|👨🏼‍🎤|👨🏼‍🎨|👨🏼‍🏫|👨🏼‍🏭|👨🏼‍💻|👨🏼‍💼|👨🏼‍🔧|👨🏼‍🔬|👨🏼‍🚀|👨🏼‍🚒|👨🏼‍🦯|👨🏼‍🦰|👨🏼‍🦱|👨🏼‍🦲|👨🏼‍🦳|👨🏼‍🦼|👨🏼‍🦽|👨🏽‍⚕️|👨🏽‍⚖️|👨🏽‍✈️|👨🏽‍🌾|👨🏽‍🍳|👨🏽‍🍼|👨🏽‍🎓|👨🏽‍🎤|👨🏽‍🎨|👨🏽‍🏫|👨🏽‍🏭|👨🏽‍💻|👨🏽‍💼|👨🏽‍🔧|👨🏽‍🔬|👨🏽‍🚀|👨🏽‍🚒|👨🏽‍🦯|👨🏽‍🦰|👨🏽‍🦱|👨🏽‍🦲|👨🏽‍🦳|👨🏽‍🦼|👨🏽‍🦽|👨🏾‍⚕️|👨🏾‍⚖️|👨🏾‍✈️|👨🏾‍🌾|👨🏾‍🍳|👨🏾‍🍼|👨🏾‍🎓|👨🏾‍🎤|👨🏾‍🎨|👨🏾‍🏫|👨🏾‍🏭|👨🏾‍💻|👨🏾‍💼|👨🏾‍🔧|👨🏾‍🔬|👨🏾‍🚀|👨🏾‍🚒|👨🏾‍🦯|👨🏾‍🦰|👨🏾‍🦱|👨🏾‍🦲|👨🏾‍🦳|👨🏾‍🦼|👨🏾‍🦽|👨🏿‍⚕️|👨🏿‍⚖️|👨🏿‍✈️|👨🏿‍🌾|👨🏿‍🍳|👨🏿‍🍼|👨🏿‍🎓|👨🏿‍🎤|👨🏿‍🎨|👨🏿‍🏫|👨🏿‍🏭|👨🏿‍💻|👨🏿‍💼|👨🏿‍🔧|👨🏿‍🔬|👨🏿‍🚀|👨🏿‍🚒|👨🏿‍🦯|👨🏿‍🦰|👨🏿‍🦱|👨🏿‍🦲|👨🏿‍🦳|👨🏿‍🦼|👨🏿‍🦽|👩🏻‍⚕️|👩🏻‍⚖️|👩🏻‍✈️|👩🏻‍🌾|👩🏻‍🍳|👩🏻‍🍼|👩🏻‍🎓|👩🏻‍🎤|👩🏻‍🎨|👩🏻‍🏫|👩🏻‍🏭|👩🏻‍💻|👩🏻‍💼|👩🏻‍🔧|👩🏻‍🔬|👩🏻‍🚀|👩🏻‍🚒|👩🏻‍🦯|👩🏻‍🦰|👩🏻‍🦱|👩🏻‍🦲|👩🏻‍🦳|👩🏻‍🦼|👩🏻‍🦽|👩🏼‍⚕️|👩🏼‍⚖️|👩🏼‍✈️|👩🏼‍🌾|👩🏼‍🍳|👩🏼‍🍼|👩🏼‍🎓|👩🏼‍🎤|👩🏼‍🎨|👩🏼‍🏫|👩🏼‍🏭|👩🏼‍💻|👩🏼‍💼|👩🏼‍🔧|👩🏼‍🔬|👩🏼‍🚀|👩🏼‍🚒|👩🏼‍🦯|👩🏼‍🦰|👩🏼‍🦱|👩🏼‍🦲|👩🏼‍🦳|👩🏼‍🦼|👩🏼‍🦽|👩🏽‍⚕️|👩🏽‍⚖️|👩🏽‍✈️|👩🏽‍🌾|👩🏽‍🍳|👩🏽‍🍼|👩🏽‍🎓|👩🏽‍🎤|👩🏽‍🎨|👩🏽‍🏫|👩🏽‍🏭|👩🏽‍💻|👩🏽‍💼|👩🏽‍🔧|👩🏽‍🔬|👩🏽‍🚀|👩🏽‍🚒|👩🏽‍🦯|👩🏽‍🦰|👩🏽‍🦱|👩🏽‍🦲|👩🏽‍🦳|👩🏽‍🦼|👩🏽‍🦽|👩🏾‍⚕️|👩🏾‍⚖️|👩🏾‍✈️|👩🏾‍🌾|👩🏾‍🍳|👩🏾‍🍼|👩🏾‍🎓|👩🏾‍🎤|👩🏾‍🎨|👩🏾‍🏫|👩🏾‍🏭|👩🏾‍💻|👩🏾‍💼|👩🏾‍🔧|👩🏾‍🔬|👩🏾‍🚀|👩🏾‍🚒|👩🏾‍🦯|👩🏾‍🦰|👩🏾‍🦱|👩🏾‍🦲|👩🏾‍🦳|👩🏾‍🦼|👩🏾‍🦽|👩🏿‍⚕️|👩🏿‍⚖️|👩🏿‍✈️|👩🏿‍🌾|👩🏿‍🍳|👩🏿‍🍼|👩🏿‍🎓|👩🏿‍🎤|👩🏿‍🎨|👩🏿‍🏫|👩🏿‍🏭|👩🏿‍💻|👩🏿‍💼|👩🏿‍🔧|👩🏿‍🔬|👩🏿‍🚀|👩🏿‍🚒|👩🏿‍🦯|👩🏿‍🦰|👩🏿‍🦱|👩🏿‍🦲|👩🏿‍🦳|👩🏿‍🦼|👩🏿‍🦽|👮🏻‍♀️|👮🏻‍♂️|👮🏼‍♀️|👮🏼‍♂️|👮🏽‍♀️|👮🏽‍♂️|👮🏾‍♀️|👮🏾‍♂️|👮🏿‍♀️|👮🏿‍♂️|👯🏻‍♀️|👯🏻‍♂️|👯🏼‍♀️|👯🏼‍♂️|👯🏽‍♀️|👯🏽‍♂️|👯🏾‍♀️|👯🏾‍♂️|👯🏿‍♀️|👯🏿‍♂️|👰🏻‍♀️|👰🏻‍♂️|👰🏼‍♀️|👰🏼‍♂️|👰🏽‍♀️|👰🏽‍♂️|👰🏾‍♀️|👰🏾‍♂️|👰🏿‍♀️|👰🏿‍♂️|👱🏻‍♀️|👱🏻‍♂️|👱🏼‍♀️|👱🏼‍♂️|👱🏽‍♀️|👱🏽‍♂️|👱🏾‍♀️|👱🏾‍♂️|👱🏿‍♀️|👱🏿‍♂️|👳🏻‍♀️|👳🏻‍♂️|👳🏼‍♀️|👳🏼‍♂️|👳🏽‍♀️|👳🏽‍♂️|👳🏾‍♀️|👳🏾‍♂️|👳🏿‍♀️|👳🏿‍♂️|👷🏻‍♀️|👷🏻‍♂️|👷🏼‍♀️|👷🏼‍♂️|👷🏽‍♀️|👷🏽‍♂️|👷🏾‍♀️|👷🏾‍♂️|👷🏿‍♀️|👷🏿‍♂️|💁🏻‍♀️|💁🏻‍♂️|💁🏼‍♀️|💁🏼‍♂️|💁🏽‍♀️|💁🏽‍♂️|💁🏾‍♀️|💁🏾‍♂️|💁🏿‍♀️|💁🏿‍♂️|💂🏻‍♀️|💂🏻‍♂️|💂🏼‍♀️|💂🏼‍♂️|💂🏽‍♀️|💂🏽‍♂️|💂🏾‍♀️|💂🏾‍♂️|💂🏿‍♀️|💂🏿‍♂️|💆🏻‍♀️|💆🏻‍♂️|💆🏼‍♀️|💆🏼‍♂️|💆🏽‍♀️|💆🏽‍♂️|💆🏾‍♀️|💆🏾‍♂️|💆🏿‍♀️|💆🏿‍♂️|💇🏻‍♀️|💇🏻‍♂️|💇🏼‍♀️|💇🏼‍♂️|💇🏽‍♀️|💇🏽‍♂️|💇🏾‍♀️|💇🏾‍♂️|💇🏿‍♀️|💇🏿‍♂️|🕵🏻‍♀️|🕵🏻‍♂️|🕵🏼‍♀️|🕵🏼‍♂️|🕵🏽‍♀️|🕵🏽‍♂️|🕵🏾‍♀️|🕵🏾‍♂️|🕵🏿‍♀️|🕵🏿‍♂️|🙅🏻‍♀️|🙅🏻‍♂️|🙅🏼‍♀️|🙅🏼‍♂️|🙅🏽‍♀️|🙅🏽‍♂️|🙅🏾‍♀️|🙅🏾‍♂️|🙅🏿‍♀️|🙅🏿‍♂️|🙆🏻‍♀️|🙆🏻‍♂️|🙆🏼‍♀️|🙆🏼‍♂️|🙆🏽‍♀️|🙆🏽‍♂️|🙆🏾‍♀️|🙆🏾‍♂️|🙆🏿‍♀️|🙆🏿‍♂️|🙇🏻‍♀️|🙇🏻‍♂️|🙇🏼‍♀️|🙇🏼‍♂️|🙇🏽‍♀️|🙇🏽‍♂️|🙇🏾‍♀️|🙇🏾‍♂️|🙇🏿‍♀️|🙇🏿‍♂️|🙋🏻‍♀️|🙋🏻‍♂️|🙋🏼‍♀️|🙋🏼‍♂️|🙋🏽‍♀️|🙋🏽‍♂️|🙋🏾‍♀️|🙋🏾‍♂️|🙋🏿‍♀️|🙋🏿‍♂️|🙍🏻‍♀️|🙍🏻‍♂️|🙍🏼‍♀️|🙍🏼‍♂️|🙍🏽‍♀️|🙍🏽‍♂️|🙍🏾‍♀️|🙍🏾‍♂️|🙍🏿‍♀️|🙍🏿‍♂️|🙎🏻‍♀️|🙎🏻‍♂️|🙎🏼‍♀️|🙎🏼‍♂️|🙎🏽‍♀️|🙎🏽‍♂️|🙎🏾‍♀️|🙎🏾‍♂️|🙎🏿‍♀️|🙎🏿‍♂️|🚣🏻‍♀️|🚣🏻‍♂️|🚣🏼‍♀️|🚣🏼‍♂️|🚣🏽‍♀️|🚣🏽‍♂️|🚣🏾‍♀️|🚣🏾‍♂️|🚣🏿‍♀️|🚣🏿‍♂️|🚴🏻‍♀️|🚴🏻‍♂️|🚴🏼‍♀️|🚴🏼‍♂️|🚴🏽‍♀️|🚴🏽‍♂️|🚴🏾‍♀️|🚴🏾‍♂️|🚴🏿‍♀️|🚴🏿‍♂️|🚵🏻‍♀️|🚵🏻‍♂️|🚵🏼‍♀️|🚵🏼‍♂️|🚵🏽‍♀️|🚵🏽‍♂️|🚵🏾‍♀️|🚵🏾‍♂️|🚵🏿‍♀️|🚵🏿‍♂️|🚶🏻‍♀️|🚶🏻‍♂️|🚶🏻‍➡️|🚶🏼‍♀️|🚶🏼‍♂️|🚶🏼‍➡️|🚶🏽‍♀️|🚶🏽‍♂️|🚶🏽‍➡️|🚶🏾‍♀️|🚶🏾‍♂️|🚶🏾‍➡️|🚶🏿‍♀️|🚶🏿‍♂️|🚶🏿‍➡️|🤦🏻‍♀️|🤦🏻‍♂️|🤦🏼‍♀️|🤦🏼‍♂️|🤦🏽‍♀️|🤦🏽‍♂️|🤦🏾‍♀️|🤦🏾‍♂️|🤦🏿‍♀️|🤦🏿‍♂️|🤵🏻‍♀️|🤵🏻‍♂️|🤵🏼‍♀️|🤵🏼‍♂️|🤵🏽‍♀️|🤵🏽‍♂️|🤵🏾‍♀️|🤵🏾‍♂️|🤵🏿‍♀️|🤵🏿‍♂️|🤷🏻‍♀️|🤷🏻‍♂️|🤷🏼‍♀️|🤷🏼‍♂️|🤷🏽‍♀️|🤷🏽‍♂️|🤷🏾‍♀️|🤷🏾‍♂️|🤷🏿‍♀️|🤷🏿‍♂️|🤸🏻‍♀️|🤸🏻‍♂️|🤸🏼‍♀️|🤸🏼‍♂️|🤸🏽‍♀️|🤸🏽‍♂️|🤸🏾‍♀️|🤸🏾‍♂️|🤸🏿‍♀️|🤸🏿‍♂️|🤹🏻‍♀️|🤹🏻‍♂️|🤹🏼‍♀️|🤹🏼‍♂️|🤹🏽‍♀️|🤹🏽‍♂️|🤹🏾‍♀️|🤹🏾‍♂️|🤹🏿‍♀️|🤹🏿‍♂️|🤼🏻‍♀️|🤼🏻‍♂️|🤼🏼‍♀️|🤼🏼‍♂️|🤼🏽‍♀️|🤼🏽‍♂️|🤼🏾‍♀️|🤼🏾‍♂️|🤼🏿‍♀️|🤼🏿‍♂️|🤽🏻‍♀️|🤽🏻‍♂️|🤽🏼‍♀️|🤽🏼‍♂️|🤽🏽‍♀️|🤽🏽‍♂️|🤽🏾‍♀️|🤽🏾‍♂️|🤽🏿‍♀️|🤽🏿‍♂️|🤾🏻‍♀️|🤾🏻‍♂️|🤾🏼‍♀️|🤾🏼‍♂️|🤾🏽‍♀️|🤾🏽‍♂️|🤾🏾‍♀️|🤾🏾‍♂️|🤾🏿‍♀️|🤾🏿‍♂️|🦸🏻‍♀️|🦸🏻‍♂️|🦸🏼‍♀️|🦸🏼‍♂️|🦸🏽‍♀️|🦸🏽‍♂️|🦸🏾‍♀️|🦸🏾‍♂️|🦸🏿‍♀️|🦸🏿‍♂️|🦹🏻‍♀️|🦹🏻‍♂️|🦹🏼‍♀️|🦹🏼‍♂️|🦹🏽‍♀️|🦹🏽‍♂️|🦹🏾‍♀️|🦹🏾‍♂️|🦹🏿‍♀️|🦹🏿‍♂️|🧍🏻‍♀️|🧍🏻‍♂️|🧍🏼‍♀️|🧍🏼‍♂️|🧍🏽‍♀️|🧍🏽‍♂️|🧍🏾‍♀️|🧍🏾‍♂️|🧍🏿‍♀️|🧍🏿‍♂️|🧎🏻‍♀️|🧎🏻‍♂️|🧎🏻‍➡️|🧎🏼‍♀️|🧎🏼‍♂️|🧎🏼‍➡️|🧎🏽‍♀️|🧎🏽‍♂️|🧎🏽‍➡️|🧎🏾‍♀️|🧎🏾‍♂️|🧎🏾‍➡️|🧎🏿‍♀️|🧎🏿‍♂️|🧎🏿‍➡️|🧏🏻‍♀️|🧏🏻‍♂️|🧏🏼‍♀️|🧏🏼‍♂️|🧏🏽‍♀️|🧏🏽‍♂️|🧏🏾‍♀️|🧏🏾‍♂️|🧏🏿‍♀️|🧏🏿‍♂️|🧑🏻‍⚕️|🧑🏻‍⚖️|🧑🏻‍✈️|🧑🏻‍🌾|🧑🏻‍🍳|🧑🏻‍🍼|🧑🏻‍🎄|🧑🏻‍🎓|🧑🏻‍🎤|🧑🏻‍🎨|🧑🏻‍🏫|🧑🏻‍🏭|🧑🏻‍💻|🧑🏻‍💼|🧑🏻‍🔧|🧑🏻‍🔬|🧑🏻‍🚀|🧑🏻‍🚒|🧑🏻‍🦯|🧑🏻‍🦰|🧑🏻‍🦱|🧑🏻‍🦲|🧑🏻‍🦳|🧑🏻‍🦼|🧑🏻‍🦽|🧑🏻‍🩰|🧑🏼‍⚕️|🧑🏼‍⚖️|🧑🏼‍✈️|🧑🏼‍🌾|🧑🏼‍🍳|🧑🏼‍🍼|🧑🏼‍🎄|🧑🏼‍🎓|🧑🏼‍🎤|🧑🏼‍🎨|🧑🏼‍🏫|🧑🏼‍🏭|🧑🏼‍💻|🧑🏼‍💼|🧑🏼‍🔧|🧑🏼‍🔬|🧑🏼‍🚀|🧑🏼‍🚒|🧑🏼‍🦯|🧑🏼‍🦰|🧑🏼‍🦱|🧑🏼‍🦲|🧑🏼‍🦳|🧑🏼‍🦼|🧑🏼‍🦽|🧑🏼‍🩰|🧑🏽‍⚕️|🧑🏽‍⚖️|🧑🏽‍✈️|🧑🏽‍🌾|🧑🏽‍🍳|🧑🏽‍🍼|🧑🏽‍🎄|🧑🏽‍🎓|🧑🏽‍🎤|🧑🏽‍🎨|🧑🏽‍🏫|🧑🏽‍🏭|🧑🏽‍💻|🧑🏽‍💼|🧑🏽‍🔧|🧑🏽‍🔬|🧑🏽‍🚀|🧑🏽‍🚒|🧑🏽‍🦯|🧑🏽‍🦰|🧑🏽‍🦱|🧑🏽‍🦲|🧑🏽‍🦳|🧑🏽‍🦼|🧑🏽‍🦽|🧑🏽‍🩰|🧑🏾‍⚕️|🧑🏾‍⚖️|🧑🏾‍✈️|🧑🏾‍🌾|🧑🏾‍🍳|🧑🏾‍🍼|🧑🏾‍🎄|🧑🏾‍🎓|🧑🏾‍🎤|🧑🏾‍🎨|🧑🏾‍🏫|🧑🏾‍🏭|🧑🏾‍💻|🧑🏾‍💼|🧑🏾‍🔧|🧑🏾‍🔬|🧑🏾‍🚀|🧑🏾‍🚒|🧑🏾‍🦯|🧑🏾‍🦰|🧑🏾‍🦱|🧑🏾‍🦲|🧑🏾‍🦳|🧑🏾‍🦼|🧑🏾‍🦽|🧑🏾‍🩰|🧑🏿‍⚕️|🧑🏿‍⚖️|🧑🏿‍✈️|🧑🏿‍🌾|🧑🏿‍🍳|🧑🏿‍🍼|🧑🏿‍🎄|🧑🏿‍🎓|🧑🏿‍🎤|🧑🏿‍🎨|🧑🏿‍🏫|🧑🏿‍🏭|🧑🏿‍💻|🧑🏿‍💼|🧑🏿‍🔧|🧑🏿‍🔬|🧑🏿‍🚀|🧑🏿‍🚒|🧑🏿‍🦯|🧑🏿‍🦰|🧑🏿‍🦱|🧑🏿‍🦲|🧑🏿‍🦳|🧑🏿‍🦼|🧑🏿‍🦽|🧑🏿‍🩰|🧔🏻‍♀️|🧔🏻‍♂️|🧔🏼‍♀️|🧔🏼‍♂️|🧔🏽‍♀️|🧔🏽‍♂️|🧔🏾‍♀️|🧔🏾‍♂️|🧔🏿‍♀️|🧔🏿‍♂️|🧖🏻‍♀️|🧖🏻‍♂️|🧖🏼‍♀️|🧖🏼‍♂️|🧖🏽‍♀️|🧖🏽‍♂️|🧖🏾‍♀️|🧖🏾‍♂️|🧖🏿‍♀️|🧖🏿‍♂️|🧗🏻‍♀️|🧗🏻‍♂️|🧗🏼‍♀️|🧗🏼‍♂️|🧗🏽‍♀️|🧗🏽‍♂️|🧗🏾‍♀️|🧗🏾‍♂️|🧗🏿‍♀️|🧗🏿‍♂️|🧘🏻‍♀️|🧘🏻‍♂️|🧘🏼‍♀️|🧘🏼‍♂️|🧘🏽‍♀️|🧘🏽‍♂️|🧘🏾‍♀️|🧘🏾‍♂️|🧘🏿‍♀️|🧘🏿‍♂️|🧙🏻‍♀️|🧙🏻‍♂️|🧙🏼‍♀️|🧙🏼‍♂️|🧙🏽‍♀️|🧙🏽‍♂️|🧙🏾‍♀️|🧙🏾‍♂️|🧙🏿‍♀️|🧙🏿‍♂️|🧚🏻‍♀️|🧚🏻‍♂️|🧚🏼‍♀️|🧚🏼‍♂️|🧚🏽‍♀️|🧚🏽‍♂️|🧚🏾‍♀️|🧚🏾‍♂️|🧚🏿‍♀️|🧚🏿‍♂️|🧛🏻‍♀️|🧛🏻‍♂️|🧛🏼‍♀️|🧛🏼‍♂️|🧛🏽‍♀️|🧛🏽‍♂️|🧛🏾‍♀️|🧛🏾‍♂️|🧛🏿‍♀️|🧛🏿‍♂️|🧜🏻‍♀️|🧜🏻‍♂️|🧜🏼‍♀️|🧜🏼‍♂️|🧜🏽‍♀️|🧜🏽‍♂️|🧜🏾‍♀️|🧜🏾‍♂️|🧜🏿‍♀️|🧜🏿‍♂️|🧝🏻‍♀️|🧝🏻‍♂️|🧝🏼‍♀️|🧝🏼‍♂️|🧝🏽‍♀️|🧝🏽‍♂️|🧝🏾‍♀️|🧝🏾‍♂️|🧝🏿‍♀️|🧝🏿‍♂️|⛹🏻‍♀️|⛹🏻‍♂️|⛹🏼‍♀️|⛹🏼‍♂️|⛹🏽‍♀️|⛹🏽‍♂️|⛹🏾‍♀️|⛹🏾‍♂️|⛹🏿‍♀️|⛹🏿‍♂️|🏋️‍♀️|🏋️‍♂️|🏌️‍♀️|🏌️‍♂️|🏳️‍⚧️|🏳️‍🌈|🕵️‍♀️|🕵️‍♂️|😶‍🌫️|⛓️‍💥|⛹️‍♀️|⛹️‍♂️|❤️‍🔥|❤️‍🩹|🍄‍🟫|🍋‍🟩|🏃‍♀️|🏃‍♂️|🏃‍➡️|🏄‍♀️|🏄‍♂️|🏊‍♀️|🏊‍♂️|🏴‍☠️|🐕‍🦺|🐦‍🔥|🐻‍❄️|👨‍⚕️|👨‍⚖️|👨‍✈️|👨‍🌾|👨‍🍳|👨‍🍼|👨‍🎓|👨‍🎤|👨‍🎨|👨‍🏫|👨‍🏭|👨‍👦|👨‍👧|👨‍💻|👨‍💼|👨‍🔧|👨‍🔬|👨‍🚀|👨‍🚒|👨‍🦯|👨‍🦰|👨‍🦱|👨‍🦲|👨‍🦳|👨‍🦼|👨‍🦽|👩‍⚕️|👩‍⚖️|👩‍✈️|👩‍🌾|👩‍🍳|👩‍🍼|👩‍🎓|👩‍🎤|👩‍🎨|👩‍🏫|👩‍🏭|👩‍👦|👩‍👧|👩‍💻|👩‍💼|👩‍🔧|👩‍🔬|👩‍🚀|👩‍🚒|👩‍🦯|👩‍🦰|👩‍🦱|👩‍🦲|👩‍🦳|👩‍🦼|👩‍🦽|👮‍♀️|👮‍♂️|👯‍♀️|👯‍♂️|👰‍♀️|👰‍♂️|👱‍♀️|👱‍♂️|👳‍♀️|👳‍♂️|👷‍♀️|👷‍♂️|💁‍♀️|💁‍♂️|💂‍♀️|💂‍♂️|💆‍♀️|💆‍♂️|💇‍♀️|💇‍♂️|😮‍💨|😵‍💫|🙂‍↔️|🙂‍↕️|🙅‍♀️|🙅‍♂️|🙆‍♀️|🙆‍♂️|🙇‍♀️|🙇‍♂️|🙋‍♀️|🙋‍♂️|🙍‍♀️|🙍‍♂️|🙎‍♀️|🙎‍♂️|🚣‍♀️|🚣‍♂️|🚴‍♀️|🚴‍♂️|🚵‍♀️|🚵‍♂️|🚶‍♀️|🚶‍♂️|🚶‍➡️|🤦‍♀️|🤦‍♂️|🤵‍♀️|🤵‍♂️|🤷‍♀️|🤷‍♂️|🤸‍♀️|🤸‍♂️|🤹‍♀️|🤹‍♂️|🤼‍♀️|🤼‍♂️|🤽‍♀️|🤽‍♂️|🤾‍♀️|🤾‍♂️|🦸‍♀️|🦸‍♂️|🦹‍♀️|🦹‍♂️|🧍‍♀️|🧍‍♂️|🧎‍♀️|🧎‍♂️|🧎‍➡️|🧏‍♀️|🧏‍♂️|🧑‍⚕️|🧑‍⚖️|🧑‍✈️|🧑‍🌾|🧑‍🍳|🧑‍🍼|🧑‍🎄|🧑‍🎓|🧑‍🎤|🧑‍🎨|🧑‍🏫|🧑‍🏭|🧑‍💻|🧑‍💼|🧑‍🔧|🧑‍🔬|🧑‍🚀|🧑‍🚒|🧑‍🦯|🧑‍🦰|🧑‍🦱|🧑‍🦲|🧑‍🦳|🧑‍🦼|🧑‍🦽|🧑‍🧒|🧑‍🩰|🧔‍♀️|🧔‍♂️|🧖‍♀️|🧖‍♂️|🧗‍♀️|🧗‍♂️|🧘‍♀️|🧘‍♂️|🧙‍♀️|🧙‍♂️|🧚‍♀️|🧚‍♂️|🧛‍♀️|🧛‍♂️|🧜‍♀️|🧜‍♂️|🧝‍♀️|🧝‍♂️|🧞‍♀️|🧞‍♂️|🧟‍♀️|🧟‍♂️|\*️⃣|🇦🇨|🇦🇩|🇦🇪|🇦🇫|🇦🇬|🇦🇮|🇦🇱|🇦🇲|🇦🇴|🇦🇶|🇦🇷|🇦🇸|🇦🇹|🇦🇺|🇦🇼|🇦🇽|🇦🇿|🇧🇦|🇧🇧|🇧🇩|🇧🇪|🇧🇫|🇧🇬|🇧🇭|🇧🇮|🇧🇯|🇧🇱|🇧🇲|🇧🇳|🇧🇴|🇧🇶|🇧🇷|🇧🇸|🇧🇹|🇧🇻|🇧🇼|🇧🇾|🇧🇿|🇨🇦|🇨🇨|🇨🇩|🇨🇫|🇨🇬|🇨🇭|🇨🇮|🇨🇰|🇨🇱|🇨🇲|🇨🇳|🇨🇴|🇨🇵|🇨🇶|🇨🇷|🇨🇺|🇨🇻|🇨🇼|🇨🇽|🇨🇾|🇨🇿|🇩🇪|🇩🇬|🇩🇯|🇩🇰|🇩🇲|🇩🇴|🇩🇿|🇪🇦|🇪🇨|🇪🇪|🇪🇬|🇪🇭|🇪🇷|🇪🇸|🇪🇹|🇪🇺|🇫🇮|🇫🇯|🇫🇰|🇫🇲|🇫🇴|🇫🇷|🇬🇦|🇬🇧|🇬🇩|🇬🇪|🇬🇫|🇬🇬|🇬🇭|🇬🇮|🇬🇱|🇬🇲|🇬🇳|🇬🇵|🇬🇶|🇬🇷|🇬🇸|🇬🇹|🇬🇺|🇬🇼|🇬🇾|🇭🇰|🇭🇲|🇭🇳|🇭🇷|🇭🇹|🇭🇺|🇮🇨|🇮🇩|🇮🇪|🇮🇱|🇮🇲|🇮🇳|🇮🇴|🇮🇶|🇮🇷|🇮🇸|🇮🇹|🇯🇪|🇯🇲|🇯🇴|🇯🇵|🇰🇪|🇰🇬|🇰🇭|🇰🇮|🇰🇲|🇰🇳|🇰🇵|🇰🇷|🇰🇼|🇰🇾|🇰🇿|🇱🇦|🇱🇧|🇱🇨|🇱🇮|🇱🇰|🇱🇷|🇱🇸|🇱🇹|🇱🇺|🇱🇻|🇱🇾|🇲🇦|🇲🇨|🇲🇩|🇲🇪|🇲🇫|🇲🇬|🇲🇭|🇲🇰|🇲🇱|🇲🇲|🇲🇳|🇲🇴|🇲🇵|🇲🇶|🇲🇷|🇲🇸|🇲🇹|🇲🇺|🇲🇻|🇲🇼|🇲🇽|🇲🇾|🇲🇿|🇳🇦|🇳🇨|🇳🇪|🇳🇫|🇳🇬|🇳🇮|🇳🇱|🇳🇴|🇳🇵|🇳🇷|🇳🇺|🇳🇿|🇴🇲|🇵🇦|🇵🇪|🇵🇫|🇵🇬|🇵🇭|🇵🇰|🇵🇱|🇵🇲|🇵🇳|🇵🇷|🇵🇸|🇵🇹|🇵🇼|🇵🇾|🇶🇦|🇷🇪|🇷🇴|🇷🇸|🇷🇺|🇷🇼|🇸🇦|🇸🇧|🇸🇨|🇸🇩|🇸🇪|🇸🇬|🇸🇭|🇸🇮|🇸🇯|🇸🇰|🇸🇱|🇸🇲|🇸🇳|🇸🇴|🇸🇷|🇸🇸|🇸🇹|🇸🇻|🇸🇽|🇸🇾|🇸🇿|🇹🇦|🇹🇨|🇹🇩|🇹🇫|🇹🇬|🇹🇭|🇹🇯|🇹🇰|🇹🇱|🇹🇲|🇹🇳|🇹🇴|🇹🇷|🇹🇹|🇹🇻|🇹🇼|🇹🇿|🇺🇦|🇺🇬|🇺🇲|🇺🇳|🇺🇸|🇺🇾|🇺🇿|🇻🇦|🇻🇨|🇻🇪|🇻🇬|🇻🇮|🇻🇳|🇻🇺|🇼🇫|🇼🇸|🇽🇰|🇾🇪|🇾🇹|🇿🇦|🇿🇲|🇿🇼|🎅🏻|🎅🏼|🎅🏽|🎅🏾|🎅🏿|🏂🏻|🏂🏼|🏂🏽|🏂🏾|🏂🏿|🏃🏻|🏃🏼|🏃🏽|🏃🏾|🏃🏿|🏄🏻|🏄🏼|🏄🏽|🏄🏾|🏄🏿|🏇🏻|🏇🏼|🏇🏽|🏇🏾|🏇🏿|🏊🏻|🏊🏼|🏊🏽|🏊🏾|🏊🏿|🏋🏻|🏋🏼|🏋🏽|🏋🏾|🏋🏿|🏌🏻|🏌🏼|🏌🏽|🏌🏾|🏌🏿|🐈‍⬛|🐦‍⬛|👂🏻|👂🏼|👂🏽|👂🏾|👂🏿|👃🏻|👃🏼|👃🏽|👃🏾|👃🏿|👆🏻|👆🏼|👆🏽|👆🏾|👆🏿|👇🏻|👇🏼|👇🏽|👇🏾|👇🏿|👈🏻|👈🏼|👈🏽|👈🏾|👈🏿|👉🏻|👉🏼|👉🏽|👉🏾|👉🏿|👊🏻|👊🏼|👊🏽|👊🏾|👊🏿|👋🏻|👋🏼|👋🏽|👋🏾|👋🏿|👌🏻|👌🏼|👌🏽|👌🏾|👌🏿|👍🏻|👍🏼|👍🏽|👍🏾|👍🏿|👎🏻|👎🏼|👎🏽|👎🏾|👎🏿|👏🏻|👏🏼|👏🏽|👏🏾|👏🏿|👐🏻|👐🏼|👐🏽|👐🏾|👐🏿|👦🏻|👦🏼|👦🏽|👦🏾|👦🏿|👧🏻|👧🏼|👧🏽|👧🏾|👧🏿|👨🏻|👨🏼|👨🏽|👨🏾|👨🏿|👩🏻|👩🏼|👩🏽|👩🏾|👩🏿|👫🏻|👫🏼|👫🏽|👫🏾|👫🏿|👬🏻|👬🏼|👬🏽|👬🏾|👬🏿|👭🏻|👭🏼|👭🏽|👭🏾|👭🏿|👮🏻|👮🏼|👮🏽|👮🏾|👮🏿|👯🏻|👯🏼|👯🏽|👯🏾|👯🏿|👰🏻|👰🏼|👰🏽|👰🏾|👰🏿|👱🏻|👱🏼|👱🏽|👱🏾|👱🏿|👲🏻|👲🏼|👲🏽|👲🏾|👲🏿|👳🏻|👳🏼|👳🏽|👳🏾|👳🏿|👴🏻|👴🏼|👴🏽|👴🏾|👴🏿|👵🏻|👵🏼|👵🏽|👵🏾|👵🏿|👶🏻|👶🏼|👶🏽|👶🏾|👶🏿|👷🏻|👷🏼|👷🏽|👷🏾|👷🏿|👸🏻|👸🏼|👸🏽|👸🏾|👸🏿|👼🏻|👼🏼|👼🏽|👼🏾|👼🏿|💁🏻|💁🏼|💁🏽|💁🏾|💁🏿|💂🏻|💂🏼|💂🏽|💂🏾|💂🏿|💃🏻|💃🏼|💃🏽|💃🏾|💃🏿|💅🏻|💅🏼|💅🏽|💅🏾|💅🏿|💆🏻|💆🏼|💆🏽|💆🏾|💆🏿|💇🏻|💇🏼|💇🏽|💇🏾|💇🏿|💏🏻|💏🏼|💏🏽|💏🏾|💏🏿|💑🏻|💑🏼|💑🏽|💑🏾|💑🏿|💪🏻|💪🏼|💪🏽|💪🏾|💪🏿|🕴🏻|🕴🏼|🕴🏽|🕴🏾|🕴🏿|🕵🏻|🕵🏼|🕵🏽|🕵🏾|🕵🏿|🕺🏻|🕺🏼|🕺🏽|🕺🏾|🕺🏿|🖐🏻|🖐🏼|🖐🏽|🖐🏾|🖐🏿|🖕🏻|🖕🏼|🖕🏽|🖕🏾|🖕🏿|🖖🏻|🖖🏼|🖖🏽|🖖🏾|🖖🏿|🙅🏻|🙅🏼|🙅🏽|🙅🏾|🙅🏿|🙆🏻|🙆🏼|🙆🏽|🙆🏾|🙆🏿|🙇🏻|🙇🏼|🙇🏽|🙇🏾|🙇🏿|🙋🏻|🙋🏼|🙋🏽|🙋🏾|🙋🏿|🙌🏻|🙌🏼|🙌🏽|🙌🏾|🙌🏿|🙍🏻|🙍🏼|🙍🏽|🙍🏾|🙍🏿|🙎🏻|🙎🏼|🙎🏽|🙎🏾|🙎🏿|🙏🏻|🙏🏼|🙏🏽|🙏🏾|🙏🏿|🚣🏻|🚣🏼|🚣🏽|🚣🏾|🚣🏿|🚴🏻|🚴🏼|🚴🏽|🚴🏾|🚴🏿|🚵🏻|🚵🏼|🚵🏽|🚵🏾|🚵🏿|🚶🏻|🚶🏼|🚶🏽|🚶🏾|🚶🏿|🛀🏻|🛀🏼|🛀🏽|🛀🏾|🛀🏿|🛌🏻|🛌🏼|🛌🏽|🛌🏾|🛌🏿|🤌🏻|🤌🏼|🤌🏽|🤌🏾|🤌🏿|🤏🏻|🤏🏼|🤏🏽|🤏🏾|🤏🏿|🤘🏻|🤘🏼|🤘🏽|🤘🏾|🤘🏿|🤙🏻|🤙🏼|🤙🏽|🤙🏾|🤙🏿|🤚🏻|🤚🏼|🤚🏽|🤚🏾|🤚🏿|🤛🏻|🤛🏼|🤛🏽|🤛🏾|🤛🏿|🤜🏻|🤜🏼|🤜🏽|🤜🏾|🤜🏿|🤝🏻|🤝🏼|🤝🏽|🤝🏾|🤝🏿|🤞🏻|🤞🏼|🤞🏽|🤞🏾|🤞🏿|🤟🏻|🤟🏼|🤟🏽|🤟🏾|🤟🏿|🤦🏻|🤦🏼|🤦🏽|🤦🏾|🤦🏿|🤰🏻|🤰🏼|🤰🏽|🤰🏾|🤰🏿|🤱🏻|🤱🏼|🤱🏽|🤱🏾|🤱🏿|🤲🏻|🤲🏼|🤲🏽|🤲🏾|🤲🏿|🤳🏻|🤳🏼|🤳🏽|🤳🏾|🤳🏿|🤴🏻|🤴🏼|🤴🏽|🤴🏾|🤴🏿|🤵🏻|🤵🏼|🤵🏽|🤵🏾|🤵🏿|🤶🏻|🤶🏼|🤶🏽|🤶🏾|🤶🏿|🤷🏻|🤷🏼|🤷🏽|🤷🏾|🤷🏿|🤸🏻|🤸🏼|🤸🏽|🤸🏾|🤸🏿|🤹🏻|🤹🏼|🤹🏽|🤹🏾|🤹🏿|🤼🏻|🤼🏼|🤼🏽|🤼🏾|🤼🏿|🤽🏻|🤽🏼|🤽🏽|🤽🏾|🤽🏿|🤾🏻|🤾🏼|🤾🏽|🤾🏾|🤾🏿|🥷🏻|🥷🏼|🥷🏽|🥷🏾|🥷🏿|🦵🏻|🦵🏼|🦵🏽|🦵🏾|🦵🏿|🦶🏻|🦶🏼|🦶🏽|🦶🏾|🦶🏿|🦸🏻|🦸🏼|🦸🏽|🦸🏾|🦸🏿|🦹🏻|🦹🏼|🦹🏽|🦹🏾|🦹🏿|🦻🏻|🦻🏼|🦻🏽|🦻🏾|🦻🏿|🧍🏻|🧍🏼|🧍🏽|🧍🏾|🧍🏿|🧎🏻|🧎🏼|🧎🏽|🧎🏾|🧎🏿|🧏🏻|🧏🏼|🧏🏽|🧏🏾|🧏🏿|🧑🏻|🧑🏼|🧑🏽|🧑🏾|🧑🏿|🧒🏻|🧒🏼|🧒🏽|🧒🏾|🧒🏿|🧓🏻|🧓🏼|🧓🏽|🧓🏾|🧓🏿|🧔🏻|🧔🏼|🧔🏽|🧔🏾|🧔🏿|🧕🏻|🧕🏼|🧕🏽|🧕🏾|🧕🏿|🧖🏻|🧖🏼|🧖🏽|🧖🏾|🧖🏿|🧗🏻|🧗🏼|🧗🏽|🧗🏾|🧗🏿|🧘🏻|🧘🏼|🧘🏽|🧘🏾|🧘🏿|🧙🏻|🧙🏼|🧙🏽|🧙🏾|🧙🏿|🧚🏻|🧚🏼|🧚🏽|🧚🏾|🧚🏿|🧛🏻|🧛🏼|🧛🏽|🧛🏾|🧛🏿|🧜🏻|🧜🏼|🧜🏽|🧜🏾|🧜🏿|🧝🏻|🧝🏼|🧝🏽|🧝🏾|🧝🏿|🫃🏻|🫃🏼|🫃🏽|🫃🏾|🫃🏿|🫄🏻|🫄🏼|🫄🏽|🫄🏾|🫄🏿|🫅🏻|🫅🏼|🫅🏽|🫅🏾|🫅🏿|🫰🏻|🫰🏼|🫰🏽|🫰🏾|🫰🏿|🫱🏻|🫱🏼|🫱🏽|🫱🏾|🫱🏿|🫲🏻|🫲🏼|🫲🏽|🫲🏾|🫲🏿|🫳🏻|🫳🏼|🫳🏽|🫳🏾|🫳🏿|🫴🏻|🫴🏼|🫴🏽|🫴🏾|🫴🏿|🫵🏻|🫵🏼|🫵🏽|🫵🏾|🫵🏿|🫶🏻|🫶🏼|🫶🏽|🫶🏾|🫶🏿|🫷🏻|🫷🏼|🫷🏽|🫷🏾|🫷🏿|🫸🏻|🫸🏼|🫸🏽|🫸🏾|🫸🏿|#️⃣|0️⃣|1️⃣|2️⃣|3️⃣|4️⃣|5️⃣|6️⃣|7️⃣|8️⃣|9️⃣|☝🏻|☝🏼|☝🏽|☝🏾|☝🏿|⛹🏻|⛹🏼|⛹🏽|⛹🏾|⛹🏿|✊🏻|✊🏼|✊🏽|✊🏾|✊🏿|✋🏻|✋🏼|✋🏽|✋🏾|✋🏿|✌🏻|✌🏼|✌🏽|✌🏾|✌🏿|✍🏻|✍🏼|✍🏽|✍🏾|✍🏿|🅰️|🅱️|🅾️|🅿️|🈂️|🈷️|🌡️|🌤️|🌥️|🌦️|🌧️|🌨️|🌩️|🌪️|🌫️|🌬️|🌶️|🍽️|🎖️|🎗️|🎙️|🎚️|🎛️|🎞️|🎟️|🏋️|🏌️|🏍️|🏎️|🏔️|🏕️|🏖️|🏗️|🏘️|🏙️|🏚️|🏛️|🏜️|🏝️|🏞️|🏟️|🏳️|🏵️|🏷️|🐿️|👁️|📽️|🕉️|🕊️|🕯️|🕰️|🕳️|🕴️|🕵️|🕶️|🕷️|🕸️|🕹️|🖇️|🖊️|🖋️|🖌️|🖍️|🖐️|🖥️|🖨️|🖱️|🖲️|🖼️|🗂️|🗃️|🗄️|🗑️|🗒️|🗓️|🗜️|🗝️|🗞️|🗡️|🗣️|🗨️|🗯️|🗳️|🗺️|🛋️|🛍️|🛎️|🛏️|🛠️|🛡️|🛢️|🛣️|🛤️|🛥️|🛩️|🛰️|🛳️|©️|®️|‼️|⁉️|™️|ℹ️|↔️|↕️|↖️|↗️|↘️|↙️|↩️|↪️|⌨️|⏏️|⏭️|⏮️|⏯️|⏱️|⏲️|⏸️|⏹️|⏺️|Ⓜ️|▪️|▫️|▶️|◀️|◻️|◼️|☀️|☁️|☂️|☃️|☄️|☎️|☑️|☘️|☝️|☠️|☢️|☣️|☦️|☪️|☮️|☯️|☸️|☹️|☺️|♀️|♂️|♟️|♠️|♣️|♥️|♦️|♨️|♻️|♾️|⚒️|⚔️|⚕️|⚖️|⚗️|⚙️|⚛️|⚜️|⚠️|⚧️|⚰️|⚱️|⛈️|⛏️|⛑️|⛓️|⛩️|⛰️|⛱️|⛴️|⛷️|⛸️|⛹️|✂️|✈️|✉️|✌️|✍️|✏️|✒️|✔️|✖️|✝️|✡️|✳️|✴️|❄️|❇️|❣️|❤️|➡️|⤴️|⤵️|⬅️|⬆️|⬇️|〰️|〽️|㊗️|㊙️|[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55\u{1F004}\u{1F0CF}\u{1F18E}\u{1F191}-\u{1F19A}\u{1F201}\u{1F21A}\u{1F22F}\u{1F232}-\u{1F236}\u{1F238}-\u{1F23A}\u{1F250}\u{1F251}\u{1F300}-\u{1F320}\u{1F32D}-\u{1F335}\u{1F337}-\u{1F37C}\u{1F37E}-\u{1F393}\u{1F3A0}-\u{1F3CA}\u{1F3CF}-\u{1F3D3}\u{1F3E0}-\u{1F3F0}\u{1F3F4}\u{1F3F8}-\u{1F43E}\u{1F440}\u{1F442}-\u{1F4FC}\u{1F4FF}-\u{1F53D}\u{1F54B}-\u{1F54E}\u{1F550}-\u{1F567}\u{1F57A}\u{1F595}\u{1F596}\u{1F5A4}\u{1F5FB}-\u{1F64F}\u{1F680}-\u{1F6C5}\u{1F6CC}\u{1F6D0}-\u{1F6D2}\u{1F6D5}-\u{1F6D8}\u{1F6DC}-\u{1F6DF}\u{1F6EB}\u{1F6EC}\u{1F6F4}-\u{1F6FC}\u{1F7E0}-\u{1F7EB}\u{1F7F0}\u{1F90C}-\u{1F93A}\u{1F93C}-\u{1F945}\u{1F947}-\u{1F9FF}\u{1FA70}-\u{1FA7C}\u{1FA80}-\u{1FA8A}\u{1FA8E}-\u{1FAC6}\u{1FAC8}\u{1FACD}-\u{1FADC}\u{1FADF}-\u{1FAEA}\u{1FAEF}-\u{1FAF8}])/ug).length;
      }
    } else {
      content = react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
        className: "material-icons gray"
      }, "warning_amber"), " ", react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
        className: "gray"
      }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
        id: "invalid_content",
        defaultMessage: [{
          "type": 0,
          "value": "invalid content"
        }]
      })));
    }
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("li", {
      ref: this.props.innerRef,
      className: sideClass
    }, this.props.isGroup && this.props.response ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "avatar-box"
    }, fullDisplay ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_letter_tile_jsx__WEBPACK_IMPORTED_MODULE_4__["default"], {
      authorizeURL: this.props.tinode.authorizeURL,
      topic: this.props.userFrom,
      title: this.props.userName,
      avatar: avatar
    }) : null) : null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: bubbleClass
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "content-meta"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: textSizeClass
    }, content, attachments), this.props.timestamp ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_received_marker_jsx__WEBPACK_IMPORTED_MODULE_5__["default"], {
      edited: this.props.edited,
      timestamp: this.props.timestamp,
      received: this.props.received
    }) : null), this.props.showContextMenu ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
      className: "menuTrigger"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      onClick: this.handleContextClick
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "expand_more"))) : null), fullDisplay ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "author"
    }, this.props.userName || react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "user_not_found",
      defaultMessage: [{
        "type": 0,
        "value": "Not found"
      }]
    }))) : null));
  }
}
;
const IntlChatMessage = (0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(BaseChatMessage);
const ChatMessage = react__WEBPACK_IMPORTED_MODULE_0___default().forwardRef((props, ref) => react__WEBPACK_IMPORTED_MODULE_0___default().createElement(IntlChatMessage, _extends({
  innerRef: ref
}, props)));
/* harmony default export */ __webpack_exports__["default"] = (ChatMessage);

/***/ }),

/***/ "./src/widgets/group-subs.jsx":
/*!************************************!*\
  !*** ./src/widgets/group-subs.jsx ***!
  \************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ GroupSubs; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var _letter_tile_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./letter-tile.jsx */ "./src/widgets/letter-tile.jsx");
/* harmony import */ var _lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../lib/blob-helpers.js */ "./src/lib/blob-helpers.js");





class GroupSubs extends (react__WEBPACK_IMPORTED_MODULE_0___default().Component) {
  constructor(props) {
    super(props);
  }
  render() {
    const usersOnline = [];
    const totalCount = (this.props.subscribers || []).length;
    const countToShow = Math.min(_config_js__WEBPACK_IMPORTED_MODULE_2__.MAX_ONLINE_IN_TOPIC, totalCount);
    (this.props.subscribers || []).some(sub => {
      usersOnline.push(react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: "avatar-box",
        key: sub.user
      }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_letter_tile_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
        authorizeURL: this.props.tinode.authorizeURL,
        topic: sub.user,
        avatar: (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_4__.makeImageUrl)(sub.public ? sub.public.photo : null) || true,
        title: sub.public ? sub.public.fn : null
      })));
      return usersOnline.length == countToShow;
    });
    if (usersOnline.length == 0) {
      return null;
    }
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "topic-users"
    }, usersOnline, " ", totalCount > countToShow ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "more_online_members",
      defaultMessage: [{
        "type": 0,
        "value": "+"
      }, {
        "type": 1,
        "value": "overflow"
      }, {
        "type": 0,
        "value": " more"
      }],
      values: {
        overflow: totalCount - countToShow
      }
    })) : null);
  }
}
;

/***/ }),

/***/ "./src/widgets/invitation.jsx":
/*!************************************!*\
  !*** ./src/widgets/invitation.jsx ***!
  \************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Invitation; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);


class Invitation extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
    this.handleButtonAction = this.handleButtonAction.bind(this);
  }
  handleButtonAction(evt, data) {
    evt.preventDefault();
    this.props.onAction(data);
  }
  render() {
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "accept-invite-panel"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "title"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "chat_invitation",
      defaultMessage: [{
        "type": 0,
        "value": "You are invited to start a new chat. What would you like to do?"
      }]
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "footer"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
      className: "primary",
      onClick: event => {
        this.handleButtonAction(event, "accept");
      }
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "chat_invitation_accept",
      defaultMessage: [{
        "type": 0,
        "value": "Accept"
      }]
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
      className: "secondary",
      onClick: event => {
        this.handleButtonAction(event, "delete");
      }
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "chat_invitation_ignore",
      defaultMessage: [{
        "type": 0,
        "value": "Ignore"
      }]
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
      className: "secondary",
      onClick: event => {
        this.handleButtonAction(event, "block");
      }
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "chat_invitation_block",
      defaultMessage: [{
        "type": 0,
        "value": "Block"
      }]
    }))));
  }
}
;

/***/ }),

/***/ "./src/widgets/meta-message.jsx":
/*!**************************************!*\
  !*** ./src/widgets/meta-message.jsx ***!
  \**************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ MetaMessage; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

class MetaMessage extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
  }
  render() {
    let content = null;
    let bubbleClass = 'bubble';
    if (this.props.date) {
      content = react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, this.props.date);
      bubbleClass += ' date';
    }
    if (!content) {
      return react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, null);
    }
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("li", {
      className: "meta"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: bubbleClass
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "message-content"
    }, content)));
  }
}
;

/***/ }),

/***/ "./src/widgets/pinned-messages.jsx":
/*!*****************************************!*\
  !*** ./src/widgets/pinned-messages.jsx ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tinode-sdk */ "tinode-sdk");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _lib_formatters_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/formatters.js */ "./src/lib/formatters.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../config.js */ "./src/config.js");





const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_1__.defineMessages)({
  message_not_found: {
    id: "message_not_found",
    defaultMessage: [{
      "type": 0,
      "value": "message not found"
    }]
  },
  message_deleted: {
    id: "message_deleted",
    defaultMessage: [{
      "type": 0,
      "value": "message deleted"
    }]
  }
});
class PinnedMessages extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
    this.touchX = null;
    this.touchY = null;
    this.touchSurface = react__WEBPACK_IMPORTED_MODULE_0___default().createRef();
    this.getSelectedIndex = this.getSelectedIndex.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSelected = this.handleSelected.bind(this);
    this.handleMoveNext = this.handleMoveNext.bind(this);
    this.handleMovePrev = this.handleMovePrev.bind(this);
    this.handleTouchEventStart = this.handleTouchEventStart.bind(this);
    this.handleTouchEventEnd = this.handleTouchEventEnd.bind(this);
    this.handleTouchCancel = this.handleTouchCancel.bind(this);
  }
  componentDidMount() {
    this.touchSurface.current.addEventListener('touchstart', this.handleTouchEventStart, {
      passive: true
    });
    this.touchSurface.current.addEventListener('touchend', this.handleTouchEventEnd, {
      passive: true
    });
    this.touchSurface.current.addEventListener('touchcancel', this.handleTouchCancel, {
      passive: true
    });
  }
  componentWillUnmount() {
    this.touchSurface.current.removeEventListener('touchstart', this.handleTouchEventStart);
    this.touchSurface.current.removeEventListener('touchend', this.handleTouchEventEnd);
    this.touchSurface.current.removeEventListener('touchcancel', this.handleTouchCancel);
  }
  getSelectedIndex() {
    const list = this.props.pins || [];
    return list.length - this.props.selected - 1;
  }
  handleCancel(e) {
    e.preventDefault();
    this.props.onCancel(this.props.pins[this.getSelectedIndex()]);
  }
  handleSelected(e) {
    e.preventDefault();
    this.props.onSelected(this.props.pins[this.getSelectedIndex()]);
  }
  handleMoveNext(e, isTouch) {
    isTouch || e.preventDefault();
    e.stopPropagation();
    const idx = Math.max(this.props.selected - 1, 0);
    if (idx != this.props.selected) {
      this.props.setSelected(idx);
    }
  }
  handleMovePrev(e, isTouch) {
    isTouch || e.preventDefault();
    e.stopPropagation();
    const idx = Math.min(this.props.selected + 1, (this.props.pins || []).length - 1);
    if (idx != this.props.selected) {
      this.props.setSelected(idx);
    }
  }
  handleTouchEventStart(e) {
    if (e.touches.length == 1) {
      this.touchX = e.touches[0].clientX;
      this.touchY = e.touches[0].clientY;
    }
  }
  handleTouchEventEnd(e) {
    if (this.touchX === null || e.changedTouches.length != 1) {
      this.touchX = null;
      return;
    }
    const dX = this.touchX - e.changedTouches[0].clientX;
    const dY = this.touchY - e.changedTouches[0].clientY;
    this.touchX = null;
    if (Math.abs(dX) > Math.abs(dY) || Math.abs(dY) < _config_js__WEBPACK_IMPORTED_MODULE_4__.MIN_SWIPE_DISTANCE) {
      return;
    }
    if (dY > 0) {
      this.handleMovePrev(e, true);
    } else {
      this.handleMoveNext(e, true);
    }
  }
  handleTouchCancel() {
    this.touchX = null;
  }
  render() {
    const selected = this.getSelectedIndex();
    let messageShown = (this.props.messages || [])[selected];
    messageShown = messageShown ? messageShown._deleted ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "gray"
    }, this.props.intl.formatMessage(messages.message_deleted)) : tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.format(messageShown.content, _lib_formatters_js__WEBPACK_IMPORTED_MODULE_3__.previewFormatter, {
      formatMessage: this.props.intl.formatMessage.bind(this.props.intl),
      authorizeURL: this.props.tinode.authorizeURL.bind(this.props.tinode)
    }) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "gray"
    }, this.props.intl.formatMessage(messages.message_not_found));
    const dots = [];
    this.props.pins.forEach(seq => {
      const cn = dots.length == selected ? 'adot' : 'dot';
      dots.push(react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        key: seq,
        className: cn
      }));
    });
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "pinned-wrapper",
      ref: this.touchSurface
    }, this.props.isAdmin ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "cancel"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      onClick: this.handleCancel
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons gray"
    }, "close"))) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons gray"
    }, "push_pin")), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "pinned-scroll"
    }, dots), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "pinned",
      onClick: this.handleSelected
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", null, messageShown)), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "pinned-menu"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
      className: "menuTrigger upper"
    }, selected > 0 ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      onClick: this.handleMovePrev
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "expand_less")) : null), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
      className: "menuTrigger lower"
    }, this.props.selected > 0 ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      onClick: this.handleMoveNext
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "expand_more")) : null)));
  }
}
/* harmony default export */ __webpack_exports__["default"] = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(PinnedMessages));

/***/ }),

/***/ "./src/widgets/received-marker.jsx":
/*!*****************************************!*\
  !*** ./src/widgets/received-marker.jsx ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tinode-sdk */ "tinode-sdk");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _lib_utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/utils.js */ "./src/lib/utils.js");




const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_1__.defineMessages)({
  message_sending: {
    id: "message_sending",
    defaultMessage: [{
      "type": 0,
      "value": "sending..."
    }]
  },
  message_sending_failed: {
    id: "message_sending_failed",
    defaultMessage: [{
      "type": 0,
      "value": "failed"
    }]
  },
  message_edited_marker: {
    id: "message_edited_marker",
    defaultMessage: [{
      "type": 0,
      "value": ", edited"
    }]
  }
});
class ReceivedMarker extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  render() {
    const {
      formatMessage
    } = this.props.intl;
    let timestamp;
    if (this.props.received <= tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Tinode.MESSAGE_STATUS_SENDING) {
      timestamp = formatMessage(messages.message_sending);
    } else if (this.props.received == tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Tinode.MESSAGE_STATUS_FAILED || this.props.received == tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Tinode.MESSAGE_STATUS_FATAL) {
      timestamp = formatMessage(messages.message_sending_failed);
    } else {
      timestamp = this.props.timestamp.toLocaleTimeString(this.props.intl.locale, {
        timeStyle: 'short'
      });
    }
    const icon = (0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_3__.deliveryMarker)(this.props.received);
    const marker = icon ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: 'material-icons small ' + icon.color
    }, icon.name) : null;
    const edited = this.props.edited ? formatMessage(messages.message_edited_marker) : null;
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
      className: "timestamp"
    }, timestamp, edited, '\u00a0', marker);
  }
}
;
/* harmony default export */ __webpack_exports__["default"] = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(ReceivedMarker));

/***/ }),

/***/ "./src/widgets/send-message.jsx":
/*!**************************************!*\
  !*** ./src/widgets/send-message.jsx ***!
  \**************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tinode-sdk */ "tinode-sdk");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var _lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../lib/blob-helpers.js */ "./src/lib/blob-helpers.js");
/* harmony import */ var _lib_formatters_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../lib/formatters.js */ "./src/lib/formatters.js");



const AudioRecorder = react__WEBPACK_IMPORTED_MODULE_0___default().lazy(_ => Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_webm-duration-fix_lib_index_js"), __webpack_require__.e("src_widgets_audio-recorder_jsx")]).then(__webpack_require__.bind(__webpack_require__, /*! ./audio-recorder.jsx */ "./src/widgets/audio-recorder.jsx")));



const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_1__.defineMessages)({
  messaging_disabled: {
    id: "messaging_disabled_prompt",
    defaultMessage: [{
      "type": 0,
      "value": "Messaging disabled"
    }]
  },
  type_new_message: {
    id: "new_message_prompt",
    defaultMessage: [{
      "type": 0,
      "value": "New message"
    }]
  },
  add_image_caption: {
    id: "image_caption_prompt",
    defaultMessage: [{
      "type": 0,
      "value": "Image caption"
    }]
  },
  file_attachment_too_large: {
    id: "file_attachment_too_large",
    defaultMessage: [{
      "type": 0,
      "value": "The file size "
    }, {
      "type": 1,
      "value": "size"
    }, {
      "type": 0,
      "value": " exceeds the "
    }, {
      "type": 1,
      "value": "limit"
    }, {
      "type": 0,
      "value": " limit."
    }]
  },
  cannot_initiate_upload: {
    id: "cannot_initiate_file_upload",
    defaultMessage: [{
      "type": 0,
      "value": "Cannot initiate file upload."
    }]
  },
  icon_title_record_voice: {
    id: "icon_title_record_voice",
    defaultMessage: [{
      "type": 0,
      "value": "Record voice message"
    }]
  },
  icon_title_attach_file: {
    id: "icon_title_attach_file",
    defaultMessage: [{
      "type": 0,
      "value": "Attach file"
    }]
  },
  icon_title_add_image: {
    id: "icon_title_add_image",
    defaultMessage: [{
      "type": 0,
      "value": "Add image"
    }]
  },
  icon_title_send: {
    id: "icon_title_send",
    defaultMessage: [{
      "type": 0,
      "value": "Send message"
    }]
  }
});
class SendMessage extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
    this.state = {
      quote: null,
      message: '',
      audioRec: false,
      audioAvailable: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
    };
    this.keypressTimestamp = 0;
    this.handlePasteEvent = this.handlePasteEvent.bind(this);
    this.handleAttachImage = this.handleAttachImage.bind(this);
    this.handleAttachFile = this.handleAttachFile.bind(this);
    this.handleAttachAudio = this.handleAttachAudio.bind(this);
    this.handleSend = this.handleSend.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleMessageTyping = this.handleMessageTyping.bind(this);
    this.handleDropAttach = this.handleDropAttach.bind(this);
    this.handleQuoteClick = this.handleQuoteClick.bind(this);
    this.formatReply = this.formatReply.bind(this);
  }
  componentDidMount() {
    if (this.messageEditArea) {
      this.messageEditArea.addEventListener('paste', this.handlePasteEvent, false);
      if (window.getComputedStyle(this.messageEditArea).getPropertyValue('transition-property') == 'all') {
        this.messageEditArea.focus();
      }
    }
    this.setState({
      quote: this.formatReply()
    });
  }
  componentWillUnmount() {
    if (this.messageEditArea) {
      this.messageEditArea.removeEventListener('paste', this.handlePasteEvent, false);
    }
  }
  componentDidUpdate(prevProps) {
    if (this.messageEditArea) {
      if (window.getComputedStyle(this.messageEditArea).getPropertyValue('transition-property') == 'all') {
        this.messageEditArea.focus();
      }
      this.messageEditArea.style.height = '0px';
      this.messageEditArea.style.height = this.messageEditArea.scrollHeight + 'px';
    }
    if (prevProps.topicName != this.props.topicName) {
      this.setState({
        message: this.props.initMessage || '',
        audioRec: false,
        quote: null
      });
    } else if (prevProps.initMessage != this.props.initMessage) {
      const msg = this.props.initMessage || '';
      this.setState({
        message: msg
      }, _ => {
        this.messageEditArea.scrollTop = this.messageEditArea.scrollHeight;
        this.messageEditArea.setSelectionRange(msg.length, msg.length);
      });
    }
    if (prevProps.reply != this.props.reply) {
      this.setState({
        quote: this.formatReply()
      });
    }
  }
  formatReply() {
    return this.props.reply ? tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.format(this.props.reply.content, _lib_formatters_js__WEBPACK_IMPORTED_MODULE_5__.replyFormatter, {
      formatMessage: this.props.intl.formatMessage.bind(this.props.intl),
      authorizeURL: this.props.tinode.authorizeURL.bind(this.props.tinode)
    }) : null;
  }
  handlePasteEvent(e) {
    if (this.props.disabled) {
      return;
    }
    if ((0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_4__.filePasted)(e, file => {
      this.props.onAttachImage(file);
    }, file => {
      this.props.onAttachFile(file);
    }, this.props.onError)) {
      e.preventDefault();
    }
  }
  handleAttachImage(e) {
    if (e.target.files && e.target.files.length > 0) {
      this.props.onAttachImage(e.target.files[0]);
    }
    e.target.value = '';
  }
  handleAttachFile(e) {
    if (e.target.files && e.target.files.length > 0) {
      this.props.onAttachFile(e.target.files[0]);
    }
    e.target.value = '';
  }
  handleDropAttach(files) {
    if (files && files.length > 0) {
      this.props.onAttachFile(files[0]);
    }
  }
  handleAttachAudio(url, preview, duration) {
    this.setState({
      audioRec: false
    });
    this.props.onAttachAudio(url, preview, duration);
  }
  handleSend(e) {
    e.preventDefault();
    const message = this.state.message.trim();
    if (message || this.props.acceptBlank || this.props.noInput) {
      this.props.onSendMessage(message);
      this.setState({
        message: ''
      });
    }
  }
  handleKeyPress(e) {
    if (this.state.audioRec) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (e.key === 'Enter') {
      if (this.props.sendOnEnter == 'plain') {
        if (!e.shiftKey) {
          e.preventDefault();
          e.stopPropagation();
          this.handleSend(e);
        }
      } else {
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          e.stopPropagation();
          this.handleSend(e);
        }
      }
    }
  }
  handleMessageTyping(e) {
    this.setState({
      message: e.target.value
    });
    if (this.props.onKeyPress) {
      const now = new Date().getTime();
      if (now - this.keypressTimestamp > _config_js__WEBPACK_IMPORTED_MODULE_3__.KEYPRESS_DELAY) {
        this.props.onKeyPress();
        this.keypressTimestamp = now;
      }
    }
  }
  handleQuoteClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if (this.props.reply && this.props.onQuoteClick) {
      const replyToSeq = this.props.reply.seq;
      this.props.onQuoteClick(replyToSeq);
    }
  }
  render() {
    const {
      formatMessage
    } = this.props.intl;
    const prompt = this.props.disabled ? formatMessage(messages.messaging_disabled) : this.props.messagePrompt ? formatMessage(messages[this.props.messagePrompt]) : formatMessage(messages.type_new_message);
    const sendIcon = this.props.reply && this.props.reply.editing ? 'check_circle' : 'send';
    const quote = this.state.quote ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "reply-quote-preview"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "cancel"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      onClick: e => {
        e.preventDefault();
        this.props.onCancelReply();
      }
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons gray"
    }, "close"))), this.state.quote) : null;
    const audioEnabled = this.state.audioAvailable && this.props.onAttachAudio;
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "send-message-wrapper"
    }, !this.props.noInput ? quote : null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "send-message-panel"
    }, !this.props.disabled ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, this.props.onAttachFile && !this.state.audioRec ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      onClick: e => {
        e.preventDefault();
        this.attachImage.click();
      },
      title: formatMessage(messages.icon_title_add_image)
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons secondary"
    }, "photo")), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      onClick: e => {
        e.preventDefault();
        this.attachFile.click();
      },
      title: formatMessage(messages.icon_title_attach_file)
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons secondary"
    }, "attach_file"))) : null, this.props.noInput ? quote || react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "hr thin"
    }) : this.state.audioRec ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react__WEBPACK_IMPORTED_MODULE_0__.Suspense, {
      fallback: react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
        id: "loading_note",
        defaultMessage: [{
          "type": 0,
          "value": "Loading..."
        }]
      }))
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(AudioRecorder, {
      onRecordingProgress: _ => this.props.onKeyPress(true),
      onDeleted: _ => this.setState({
        audioRec: false
      }),
      onFinished: this.handleAttachAudio
    })) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("textarea", {
      id: "send-message-input",
      placeholder: prompt,
      value: this.state.message,
      onChange: this.handleMessageTyping,
      onKeyDown: this.handleKeyPress,
      ref: ref => {
        this.messageEditArea = ref;
      }
    }), this.state.message || !audioEnabled ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      onClick: this.handleSend,
      title: formatMessage(messages.icon_title_send)
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, sendIcon)) : !this.state.audioRec ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      onClick: e => {
        e.preventDefault();
        this.setState({
          audioRec: true
        });
      },
      title: formatMessage(messages.icon_title_record_voice)
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "mic")) : null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", {
      type: "file",
      ref: ref => {
        this.attachFile = ref;
      },
      onChange: this.handleAttachFile,
      style: {
        display: 'none'
      }
    }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", {
      type: "file",
      ref: ref => {
        this.attachImage = ref;
      },
      accept: "image/*, video/*",
      onChange: this.handleAttachImage,
      style: {
        display: 'none'
      }
    })) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "writing-disabled"
    }, prompt)));
  }
}
;
/* harmony default export */ __webpack_exports__["default"] = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(SendMessage));

/***/ })

}]);
//# sourceMappingURL=src_views_messages-view_jsx.dev.js.map
"use strict";
(self["webpackChunktinode_webapp"] = self["webpackChunktinode_webapp"] || []).push([["src_views_info-view_jsx"],{

/***/ "./src/views/info-view.jsx":
/*!*********************************!*\
  !*** ./src/views/info-view.jsx ***!
  \*********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tinode-sdk */ "tinode-sdk");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _widgets_avatar_upload_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../widgets/avatar-upload.jsx */ "./src/widgets/avatar-upload.jsx");
/* harmony import */ var _widgets_badge_list_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../widgets/badge-list.jsx */ "./src/widgets/badge-list.jsx");
/* harmony import */ var _widgets_checkbox_jsx__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../widgets/checkbox.jsx */ "./src/widgets/checkbox.jsx");
/* harmony import */ var _widgets_contact_list_jsx__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../widgets/contact-list.jsx */ "./src/widgets/contact-list.jsx");
/* harmony import */ var _widgets_error_panel_jsx__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../widgets/error-panel.jsx */ "./src/widgets/error-panel.jsx");
/* harmony import */ var _widgets_group_manager_jsx__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../widgets/group-manager.jsx */ "./src/widgets/group-manager.jsx");
/* harmony import */ var _widgets_menu_cancel_jsx__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../widgets/menu-cancel.jsx */ "./src/widgets/menu-cancel.jsx");
/* harmony import */ var _widgets_permissions_editor_jsx__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../widgets/permissions-editor.jsx */ "./src/widgets/permissions-editor.jsx");
/* harmony import */ var _widgets_show_qrcode_jsx__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../widgets/show-qrcode.jsx */ "./src/widgets/show-qrcode.jsx");
/* harmony import */ var _topic_common_view_jsx__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./topic-common-view.jsx */ "./src/views/topic-common-view.jsx");
/* harmony import */ var _widgets_topic_security_jsx__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../widgets/topic-security.jsx */ "./src/widgets/topic-security.jsx");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var _lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../lib/blob-helpers.js */ "./src/lib/blob-helpers.js");
/* harmony import */ var _lib_strformat_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../lib/strformat.js */ "./src/lib/strformat.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");


















const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_1__.defineMessages)({
  info: {
    id: 'panel_title_info',
    description: 'Title for InfoView',
    defaultMessage: 'Info'
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
  members: {
    id: 'panel_title_members',
    description: 'Title for managing group members view.',
    defaultMessage: 'Members'
  },
  crop: {
    id: 'panel_title_crop',
    description: 'Title for AvatarCropView.',
    defaultMessage: 'Drag to Adjust'
  },
  perm_want: {
    id: 'requested_permissions',
    defaultMessage: 'Requested',
    description: 'Title for permissions'
  },
  perm_given: {
    id: 'granted_permissions',
    defaultMessage: 'Granted',
    description: 'Title for permissions'
  },
  perm_auth: {
    id: 'permissions_authenticated',
    defaultMessage: 'Authenticated',
    description: 'Title for editing default authenticated permissions'
  },
  perm_anon: {
    id: 'permissions_anonymous',
    defaultMessage: 'Anonymous',
    description: 'Title for editing default anonymous permissions'
  },
  perm_user: {
    id: 'permissions_user',
    defaultMessage: 'User\'s Permissions',
    description: 'Title for editing user\'s permissions'
  },
  edit_permissions: {
    id: 'menu_item_edit_permissions',
    defaultMessage: 'Edit permissions',
    description: 'Menu item [Edit permissions]'
  },
  qrcode: {
    id: 'scan_qr_code',
    defaultMessage: 'Scan QR Code',
    description: 'Title for scanning QR code'
  },
  text_copied: {
    id: 'text_copied',
    defaultMessage: 'Copied to clipboard',
    description: 'Notification that text has been copied to clipboard'
  },
  self_topic_name: {
    id: 'self_topic_name',
    defaultMessage: 'Saved messages',
    description: 'Name of self topic for UI'
  },
  self_topic_comment: {
    id: 'self_topic_comment',
    defaultMessage: 'Notes, messages, links, files saved for posterity',
    description: 'Comment for self topic for UI'
  }
});
class InfoView extends (react__WEBPACK_IMPORTED_MODULE_0___default().Component) {
  constructor(props) {
    super(props);
    this.state = {
      topic: null,
      owner: false,
      admin: false,
      sharer: false,
      deleter: false,
      muted: false,
      address: null,
      groupTopic: undefined,
      isSelf: false,
      channel: undefined,
      fullName: undefined,
      description: undefined,
      avatar: null,
      private: null,
      selectedContact: null,
      access: null,
      modeGiven: null,
      modeWant: null,
      modeGiven2: null,
      modeWant2: null,
      auth: null,
      anon: null,
      contactList: [],
      trustedBadges: [],
      previousMetaDesc: undefined,
      previousSubsUpdated: undefined
    };
    this.propsUpdated = this.propsUpdated.bind(this);
    this.resetSubs = this.resetSubs.bind(this);
    this.resetDesc = this.resetDesc.bind(this);
    this.resetTags = this.resetTags.bind(this);
    this.onMetaDesc = this.onMetaDesc.bind(this);
    this.onSubsUpdated = this.onSubsUpdated.bind(this);
    this.handleImageChanged = this.handleImageChanged.bind(this);
    this.handleMuted = this.handleMuted.bind(this);
    this.handleUnarchive = this.handleUnarchive.bind(this);
    this.handlePermissionsChanged = this.handlePermissionsChanged.bind(this);
    this.handleLaunchPermissionsEditor = this.handleLaunchPermissionsEditor.bind(this);
    this.handleShowQRCode = this.handleShowQRCode.bind(this);
    this.handleCopyToClipboard = this.handleCopyToClipboard.bind(this);
    this.handleShare = this.handleShare.bind(this);
    this.handleShowAddMembers = this.handleShowAddMembers.bind(this);
    this.handleMemberUpdateRequest = this.handleMemberUpdateRequest.bind(this);
    this.handleMemberSelected = this.handleMemberSelected.bind(this);
    this.handleContextMenu = this.handleContextMenu.bind(this);
    this.handleBackNavigate = this.handleBackNavigate.bind(this);
  }
  propsUpdated(props) {
    const topic = this.props.tinode.getTopic(props.topic);
    if (!topic) {
      return;
    }
    if (this.onMetaDesc != topic.onMetaDesc) {
      this.previousMetaDesc = topic.onMetaDesc;
      topic.onMetaDesc = this.onMetaDesc;
      this.previousSubsUpdated = topic.onSubsUpdated;
      topic.onSubsUpdated = this.onSubsUpdated;
    }
    if (this.state.topic != props.topic) {
      this.setState({
        topic: props.topic
      });
      this.resetDesc(topic, props);
      this.resetSubs(topic, props);
      this.resetTags(topic);
    }
  }
  componentDidMount() {
    this.propsUpdated(this.props);
  }
  componentDidUpdate(props) {
    this.propsUpdated(props);
  }
  componentWillUnmount() {
    const topic = this.props.tinode.getTopic(this.props.topic);
    if (!topic) {
      return;
    }
    this.setState({
      topic: null
    });
    topic.onMetaDesc = this.previousMetaDesc;
    topic.onSubsUpdated = this.previousSubsUpdated;
  }
  resetSubs(topic, props) {
    const newState = {
      contactList: []
    };
    if (topic.getType() == 'p2p') {
      const user2 = topic.subscriber(props.topic);
      if (user2) {
        newState.modeGiven2 = user2.acs.getGiven();
        newState.modeWant2 = user2.acs.getWant();
      } else {
        newState.modeGiven2 = _config_js__WEBPACK_IMPORTED_MODULE_14__.NO_ACCESS_MODE;
        newState.modeWant2 = _config_js__WEBPACK_IMPORTED_MODULE_14__.NO_ACCESS_MODE;
      }
    } else {
      topic.subscribers(sub => {
        newState.contactList.push(sub);
      }, this);
    }
    this.setState(newState);
  }
  resetDesc(topic, props) {
    const defacs = topic.getDefaultAccess() || {};
    const acs = topic.getAccessMode();
    const badges = [];
    if (topic.trusted) {
      for (const [key, val] of Object.entries(topic.trusted)) {
        if (val) {
          badges.push(key);
        }
      }
    }
    const isSelf = topic.isSelfType();
    this.setState({
      owner: acs && acs.isOwner(),
      admin: acs && acs.isAdmin(),
      sharer: acs && acs.isSharer(),
      deleter: acs && acs.isDeleter(),
      muted: acs && acs.isMuted(),
      fullName: isSelf ? props.intl.formatMessage(messages.self_topic_name) : (0,_lib_strformat_js__WEBPACK_IMPORTED_MODULE_16__.truncateString)(topic.public && topic.public.fn, _config_js__WEBPACK_IMPORTED_MODULE_14__.MAX_TITLE_LENGTH),
      description: isSelf ? props.intl.formatMessage(messages.self_topic_comment) : (0,_lib_strformat_js__WEBPACK_IMPORTED_MODULE_16__.truncateString)(topic.public && topic.public.note, _config_js__WEBPACK_IMPORTED_MODULE_14__.MAX_TOPIC_DESCRIPTION_LENGTH),
      avatar: (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_15__.makeImageUrl)(topic.public ? topic.public.photo : null),
      trustedBadges: badges,
      private: (0,_lib_strformat_js__WEBPACK_IMPORTED_MODULE_16__.truncateString)(topic.private && topic.private.comment, _config_js__WEBPACK_IMPORTED_MODULE_14__.MAX_TITLE_LENGTH),
      archived: topic.isArchived(),
      address: topic.name,
      groupTopic: topic.isGroupType(),
      isSelf: isSelf,
      channel: topic.isChannelType() || topic.chan,
      access: acs ? acs.getMode() : undefined,
      modeGiven: acs ? acs.getGiven() : undefined,
      modeWant: acs ? acs.getWant() : undefined,
      auth: defacs.auth,
      anon: defacs.anon
    });
  }
  resetTags(topic) {
    if (topic.getType() != 'grp') {
      return;
    }
    const acs = topic.getAccessMode();
    if (acs && acs.isOwner()) {
      topic.getMeta(topic.startMetaQuery().withTags().build());
    }
  }
  onMetaDesc(desc) {
    const topic = this.props.tinode.getTopic(this.props.topic);
    if (!topic) {
      return;
    }
    this.resetDesc(topic, this.props);
    if (this.previousMetaDesc && this.previousMetaDesc != this.onMetaDesc) {
      this.previousMetaDesc(desc);
    }
  }
  onSubsUpdated(subs) {
    const topic = this.props.tinode.getTopic(this.props.topic);
    if (!topic) {
      return;
    }
    this.resetSubs(topic, this.props);
    if (this.previousSubsUpdated && this.previousSubsUpdated != this.onSubsUpdated) {
      this.previousSubsUpdated(subs);
    }
  }
  handleImageChanged(mime, img) {
    this.setState({
      avatar: img
    });
    this.props.onTopicDescUpdate(this.props.topic, new tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.TheCard(null, img || tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Tinode.DEL_CHAR), null);
  }
  handleMuted(ignored, checked) {
    this.setState({
      muted: checked
    });
    this.props.onChangePermissions(this.props.topic, checked ? '-P' : '+P');
  }
  handleUnarchive(ignored, ignored2) {
    this.props.onTopicUnArchive(this.props.topic);
  }
  handlePermissionsChanged(which, perm) {
    switch (which) {
      case 'auth':
        this.props.onTopicDescUpdateRequest(this.props.topic, null, null, {
          auth: perm
        });
        break;
      case 'anon':
        this.props.onTopicDescUpdateRequest(this.props.topic, null, null, {
          anon: perm
        });
        break;
      case 'mode':
      case 'want':
        this.props.onChangePermissions(this.props.topic, perm);
        break;
      case 'given':
        this.props.onChangePermissions(this.props.topic, perm, this.props.topic);
        break;
      case 'user':
        this.props.onChangePermissions(this.props.topic, perm, this.state.userPermissionsEdited);
        break;
    }
    this.handleBackNavigate();
  }
  handleLaunchPermissionsEditor(which, uid) {
    const {
      formatMessage
    } = this.props.intl;
    let toEdit, toCompare, toSkip, titleEdit, titleCompare, userTitle, userAvatar;
    switch (which) {
      case 'mode':
        toEdit = this.state.access;
        break;
      case 'want':
        toEdit = this.state.modeWant;
        toCompare = this.state.modeGiven;
        if (this.state.owner) {
          toSkip = 'O';
        } else {
          toSkip = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.AccessMode.encode(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.AccessMode.diff('ASDO', this.state.modeGiven));
          if (this.state.channel) {
            toSkip += 'W';
          }
        }
        titleEdit = formatMessage(messages.perm_want);
        titleCompare = formatMessage(messages.perm_given);
        break;
      case 'given':
        toEdit = this.state.modeGiven2;
        toCompare = this.state.modeWant2;
        toSkip = this.state.groupTopic ? this.state.owner ? '' : 'O' : 'ASDO';
        titleEdit = formatMessage(messages.perm_given);
        titleCompare = formatMessage(messages.perm_want);
        break;
      case 'auth':
        toEdit = this.state.auth;
        toSkip = 'O';
        break;
      case 'anon':
        toEdit = this.state.anon;
        toSkip = 'O';
        break;
      case 'user':
        {
          const topic = this.props.tinode.getTopic(this.props.topic);
          if (!topic) {
            return;
          }
          const user = topic.subscriber(uid);
          if (!user || !user.acs) {
            return;
          }
          toEdit = user.acs.getGiven();
          toCompare = user.acs.getWant();
          toSkip = this.state.owner ? '' : 'O';
          titleEdit = formatMessage(messages.perm_given);
          titleCompare = formatMessage(messages.perm_want);
          if (user.public) {
            userTitle = user.public.fn;
            userAvatar = user.public.photo;
          }
          break;
        }
      default:
        console.error("Unknown permission editing mode '" + which + "'");
        return;
    }
    this.setState({
      userPermissionsEdited: uid,
      userPermissionsTitle: userTitle,
      userPermissionsAvatar: userAvatar,
      editedPermissions: toEdit,
      immutablePermissions: toCompare,
      editedPermissionsTitle: titleEdit,
      immutablePermissionsTitle: titleCompare,
      editedPermissionsSkipped: toSkip
    });
    this.props.onNavigate(`perm/${which}`);
  }
  handleShowQRCode(e) {
    e.preventDefault();
    this.props.onNavigate('qrcode');
  }
  handleCopyToClipboard(e, text) {
    e.preventDefault();
    navigator.clipboard.writeText(text).then(_ => {
      this.setState({
        toast: this.props.intl.formatMessage(messages.text_copied)
      });
      setTimeout(_ => {
        this.setState({
          toast: ''
        });
      }, _config_js__WEBPACK_IMPORTED_MODULE_14__.TOAST_DURATION);
    });
  }
  handleShare(e) {
    e.preventDefault();
    const card = new tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.TheCard(this.state.fullName, this.state.avatar, null, this.state.description);
    tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.TheCard.setTinodeID(card, tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Tinode.URI_TOPIC_ID_PREFIX + this.props.topic);
    this.props.onShareTheCard(card);
  }
  handleShowAddMembers(e) {
    e.preventDefault();
    this.props.onInitFind();
    this.props.onNavigate('members');
  }
  handleMemberUpdateRequest(members, added, removed) {
    this.props.onMemberUpdateRequest(this.props.topic, added, removed);
    this.props.onNavigate('info');
  }
  handleMemberSelected(uid) {
    this.setState({
      selectedContact: uid
    });
  }
  handleBackNavigate() {
    const args = (this.props.panel || 'info').split('/');
    if (args[0] == 'info') {
      this.props.onNavigate(null);
    } else if (args[0] == 'perm') {
      if (args[1] == 'user') {
        this.props.onNavigate('info');
      } else {
        this.props.onNavigate('security');
      }
    } else {
      this.props.onNavigate('info');
    }
  }
  handleContextMenu(params) {
    const {
      formatMessage
    } = this.props.intl;
    const topic = this.props.tinode.getTopic(this.props.topic);
    if (!topic) {
      return;
    }
    const user = topic.subscriber(params.topicName);
    if (!user || !user.acs) {
      return;
    }
    const isMe = this.props.tinode.isMe(params.topicName);
    const menuItems = [{
      title: formatMessage(messages.edit_permissions),
      handler: _ => this.handleLaunchPermissionsEditor(isMe ? 'want' : 'user', params.topicName)
    }];
    if (!isMe) {
      menuItems.push('member_delete');
    }
    menuItems.push(user.acs.isMuted() ? 'member_unmute' : 'member_mute');
    if (!isMe) {
      menuItems.push(user.acs.isJoiner() ? 'member_block' : 'member_unblock');
    }
    this.props.showContextMenu({
      topicName: this.props.topic,
      x: params.x,
      y: params.y,
      user: params.topicName
    }, menuItems);
  }
  render() {
    const args = (this.props.panel || 'info').split('/');
    const view = args[0];
    args.shift();
    const {
      formatMessage
    } = this.props.intl;
    const panelTitle = formatMessage((view == 'perm' ? messages['perm_' + args[0]] : messages[view]) || messages['info']);
    const topic = this.props.tinode.getTopic(this.state.topic);
    const alias = topic && topic.alias();
    return (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)("div", {
      id: "info-view",
      children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)("div", {
        className: `toast${this.state.toast ? ' show' : ''}`,
        children: this.state.toast
      }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)("div", {
        className: "caption-panel",
        id: "info-caption-panel",
        children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)("div", {
          className: "panel-title",
          id: "info-title",
          children: panelTitle
        }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)("div", {
          children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)(_widgets_menu_cancel_jsx__WEBPACK_IMPORTED_MODULE_9__["default"], {
            onCancel: this.handleBackNavigate
          }, void 0, false)
        }, void 0, false)]
      }, void 0, true), this.props.displayMobile ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)(_widgets_error_panel_jsx__WEBPACK_IMPORTED_MODULE_7__["default"], {
        level: this.props.errorLevel,
        text: this.props.errorText,
        onClearError: this.props.onError
      }, void 0, false) : null, view == 'members' ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)(_widgets_group_manager_jsx__WEBPACK_IMPORTED_MODULE_8__["default"], {
        tinode: this.props.tinode,
        members: this.state.contactList,
        requiredMember: this.props.myUserId,
        keepInitialMembers: !this.state.admin && !this.state.owner,
        myUserId: this.props.myUserId,
        contacts: this.props.searchableContacts,
        onCancel: this.handleBackNavigate,
        onSubmit: this.handleMemberUpdateRequest
      }, void 0, false) : view == 'perm' && args.length > 0 ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)(_widgets_permissions_editor_jsx__WEBPACK_IMPORTED_MODULE_10__["default"], {
        tinode: this.props.tinode,
        mode: this.state.editedPermissions,
        compare: this.state.immutablePermissions,
        skip: this.state.editedPermissionsSkipped,
        modeTitle: this.state.editedPermissionsTitle,
        compareTitle: this.state.immutablePermissionsTitle,
        userTitle: this.state.userPermissionsTitle,
        item: this.state.userPermissionsEdited,
        userAvatar: this.state.userPermissionsAvatar,
        onSubmit: mode => this.handlePermissionsChanged(args[0], mode),
        onCancel: this.handleBackNavigate
      }, void 0, false) : view == 'general' ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)(_topic_common_view_jsx__WEBPACK_IMPORTED_MODULE_12__["default"], {
        tinode: this.props.tinode,
        topic: this.props.topic,
        reqCredMethod: this.props.reqCredMethod,
        onCredAdd: this.props.onCredAdd,
        onUpdateTagsRequest: this.props.onTopicTagsUpdateRequest,
        onCredConfirm: this.props.onCredConfirm,
        onCredDelete: this.props.onCredDelete,
        onUpdateTopicDesc: this.props.onTopicDescUpdateRequest,
        onError: this.props.onError
      }, void 0, false) : view == 'security' ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)(_widgets_topic_security_jsx__WEBPACK_IMPORTED_MODULE_13__["default"], {
        topic: this.props.topic,
        owner: this.state.owner,
        admin: this.state.admin,
        sharer: this.state.sharer,
        deleter: this.state.deleter,
        muted: this.state.muted,
        groupTopic: this.state.groupTopic,
        channel: this.state.channel,
        access: this.state.access,
        modeGiven: this.state.modeGiven,
        modeWant: this.state.modeWant,
        modeGiven2: this.state.modeGiven2,
        modeWant2: this.state.modeWant2,
        auth: this.state.auth,
        anon: this.state.anon,
        onShowAlert: this.props.onShowAlert,
        onDeleteMessages: this.props.onDeleteMessages,
        onLeaveTopic: this.props.onLeaveTopic,
        onBlockTopic: this.props.onBlockTopic,
        onReportTopic: this.props.onReportTopic,
        onLaunchPermissionsEditor: this.handleLaunchPermissionsEditor,
        onNavigate: this.props.onNavigate
      }, void 0, false) : view == 'qrcode' ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)(_widgets_show_qrcode_jsx__WEBPACK_IMPORTED_MODULE_11__["default"], {
        uri: tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Tinode.URI_TOPIC_ID_PREFIX + this.props.topic,
        onCancel: this.handleBackNavigate
      }, void 0, false) : (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)("div", {
        id: "info-view-content",
        className: "scrollable-panel",
        children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)("div", {
          className: "panel-form-column",
          children: [!this.state.isSelf ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)("a", {
            href: "#",
            className: "flat-button float-right",
            onClick: e => {
              e.preventDefault();
              this.props.onNavigate('general');
            },
            children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)("i", {
              className: "material-icons",
              children: "edit"
            }, void 0, false), "\xA0", (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
              id: "button_edit",
              defaultMessage: "Edit",
              description: "Call to action [Edit]"
            }, void 0, false)]
          }, void 0, true) : null, (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)("center", {
            children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)(_widgets_avatar_upload_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
              tinode: this.props.tinode,
              avatar: this.state.avatar,
              readOnly: true,
              uid: this.props.topic,
              title: this.state.fullName
            }, void 0, false)
          }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)("div", {
            className: "group",
            children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)("div", {
              children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)("label", {
                className: "small",
                children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
                  id: "label_topic_name",
                  defaultMessage: "Name",
                  description: "Label for editing topic name"
                }, void 0, false)
              }, void 0, false)
            }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)("div", {
              className: "large ellipsized",
              children: [this.state.fullName, "\xA0", this.state.channel ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)("i", {
                className: "material-icons",
                children: "podcasts"
              }, void 0, false) : null]
            }, void 0, true)]
          }, void 0, true), this.state.private ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)("div", {
            className: "group",
            children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)("div", {
              children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)("label", {
                className: "small",
                children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
                  id: "label_private",
                  defaultMessage: "Private comment",
                  description: "Label for editing 'private'"
                }, void 0, false)
              }, void 0, false)
            }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)("div", {
              className: "large ellipsized",
              children: this.state.private
            }, void 0, false)]
          }, void 0, true) : null, !this.state.isSelf ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.Fragment, {
            children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)("div", {
              className: "panel-form-row",
              children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)("div", {
                children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)("label", {
                  className: "small",
                  children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
                    id: "label_user_id",
                    defaultMessage: "ID:",
                    description: "Label for user address (ID)"
                  }, void 0, false)
                }, void 0, false), "\xA0", (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)("tt", {
                  children: this.state.address
                }, void 0, false)]
              }, void 0, true), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)("div", {
                style: {
                  marginLeft: 'auto'
                },
                children: ["\xA0", (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)("a", {
                  href: "#",
                  onClick: e => {
                    this.handleCopyToClipboard(e, this.state.address);
                  },
                  children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)("i", {
                    className: "material-icons",
                    children: "content_copy"
                  }, void 0, false)
                }, void 0, false), "\xA0 \xA0", (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)("a", {
                  href: "#",
                  onClick: this.handleShowQRCode,
                  children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)("i", {
                    className: "material-icons",
                    children: "qr_code"
                  }, void 0, false)
                }, void 0, false), "\xA0 \xA0", (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)("a", {
                  href: "#",
                  onClick: this.handleShare,
                  children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)("i", {
                    className: "material-icons",
                    children: "share"
                  }, void 0, false)
                }, void 0, false), "\xA0"]
              }, void 0, true)]
            }, void 0, true), alias ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)("div", {
              className: "panel-form-row",
              children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)("div", {
                children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)("label", {
                  className: "small",
                  children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
                    id: "label_alias",
                    defaultMessage: "Alias:",
                    description: "Label for user or topic alias"
                  }, void 0, false)
                }, void 0, false), "\xA0", (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)("tt", {
                  children: alias
                }, void 0, false)]
              }, void 0, true), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)("div", {
                style: {
                  marginLeft: 'auto'
                },
                children: ["\xA0", (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)("a", {
                  href: "#",
                  onClick: e => {
                    this.handleCopyToClipboard(e, alias);
                  },
                  children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)("i", {
                    className: "material-icons",
                    children: "content_copy"
                  }, void 0, false)
                }, void 0, false), "\xA0 \xA0", (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)("i", {
                  className: "material-icons",
                  style: {
                    opacity: 0
                  },
                  children: "qr_code"
                }, void 0, false), "\xA0"]
              }, void 0, true)]
            }, void 0, true) : null]
          }, void 0, true) : null, this.state.trustedBadges.length > 0 ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)("div", {
            className: "group",
            children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)(_widgets_badge_list_jsx__WEBPACK_IMPORTED_MODULE_4__["default"], {
              trustedBadges: this.state.trustedBadges
            }, void 0, false)
          }, void 0, false) : null, this.state.groupTopic && topic.subcnt > 0 ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)("div", {
            className: "group",
            children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)("label", {
              className: "small",
              children: this.state.channel ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
                id: "label_subscriber_count",
                defaultMessage: "Subscribers:",
                description: "Label for the count of channel subscribers"
              }, void 0, false) : (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
                id: "label_member_count",
                defaultMessage: "Members:",
                description: "Label for the count of group topic members"
              }, void 0, false)
            }, void 0, false), "\xA0", (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedNumber, {
              value: topic.subcnt
            }, void 0, false)]
          }, void 0, true) : null, this.state.description ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)("div", {
            className: "group",
            children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)("label", {
              className: "small",
              children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
                id: "label_description",
                defaultMessage: "Description",
                description: "Label for description of user or topic"
              }, void 0, false)
            }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)("div", {
              children: this.state.description
            }, void 0, false)]
          }, void 0, true) : null]
        }, void 0, true), !this.state.isSelf ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.Fragment, {
          children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)("div", {
            className: "hr"
          }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)("div", {
            className: "panel-form-row",
            children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)("label", {
              children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
                id: "label_muting_topic",
                defaultMessage: "Muted:",
                description: "Label for Muting/unmuting the topic"
              }, void 0, false)
            }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)(_widgets_checkbox_jsx__WEBPACK_IMPORTED_MODULE_5__["default"], {
              name: "P",
              checked: this.state.muted,
              onChange: this.handleMuted
            }, void 0, false)]
          }, void 0, true)]
        }, void 0, true) : null, this.state.archived ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)("div", {
          className: "panel-form-row",
          children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)("label", {
            children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
              id: "label_unarchive_topic",
              defaultMessage: "Archived:",
              description: "Label for unarchiving the topic"
            }, void 0, false)
          }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)(_widgets_checkbox_jsx__WEBPACK_IMPORTED_MODULE_5__["default"], {
            name: "archived",
            checked: true,
            onChange: this.handleUnarchive
          }, void 0, false)]
        }, void 0, true) : null, !this.state.isSelf ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.Fragment, {
          children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)("div", {
            className: "hr"
          }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)("div", {
            className: "panel-form-row",
            children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)("a", {
              href: "#",
              className: "flat-button",
              onClick: e => {
                e.preventDefault();
                this.props.onNavigate('security');
              },
              children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)("i", {
                className: "material-icons",
                children: "security"
              }, void 0, false), "\xA0", (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
                id: "button_security",
                defaultMessage: "Security",
                description: "Navigaton button for security panel."
              }, void 0, false)]
            }, void 0, true)
          }, void 0, false)]
        }, void 0, true) : null, this.state.groupTopic && this.state.sharer ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.Fragment, {
          children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)("div", {
            className: "hr"
          }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)("div", {
            className: "panel-form-row",
            children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)("label", {
              className: "small",
              children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
                id: "label_group_members",
                defaultMessage: "Group members:",
                description: "Section title or label"
              }, void 0, false)
            }, void 0, false)
          }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)("div", {
            className: "panel-form-row",
            children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)("a", {
              href: "#",
              className: "flat-button",
              onClick: this.handleShowAddMembers,
              children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)("i", {
                className: "material-icons",
                children: "person_add"
              }, void 0, false), " \xA0", (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
                id: "button_add_members",
                defaultMessage: "Add members",
                description: "Flat button [Add members] (to topic)"
              }, void 0, false)]
            }, void 0, true)
          }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "group_has_no_members",
            defaultMessage: "No members",
            description: "Shown in place of group members",
            children: no_members => (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxDEV)(_widgets_contact_list_jsx__WEBPACK_IMPORTED_MODULE_6__["default"], {
              tinode: this.props.tinode,
              contacts: this.state.contactList,
              myUserId: this.props.myUserId,
              emptyListMessage: no_members,
              topicSelected: this.state.selectedContact,
              showOnline: false,
              showUnread: false,
              showMode: true,
              noScroll: true,
              onTopicSelected: this.handleMemberSelected,
              showContextMenu: this.state.admin ? this.handleContextMenu : false
            }, void 0, false)
          }, void 0, false)]
        }, void 0, true) : null]
      }, void 0, true)]
    }, void 0, true);
  }
}
;
/* harmony default export */ __webpack_exports__["default"] = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(InfoView));

/***/ }),

/***/ "./src/widgets/group-manager.jsx":
/*!***************************************!*\
  !*** ./src/widgets/group-manager.jsx ***!
  \***************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _chip_input_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./chip-input.jsx */ "./src/widgets/chip-input.jsx");
/* harmony import */ var _contact_list_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./contact-list.jsx */ "./src/widgets/contact-list.jsx");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");





const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_1__.defineMessages)({
  no_contacts: {
    id: 'no_contacts',
    defaultMessage: 'You have no contacts :-(',
    description: 'Shown in ContactsView when the user has no contacts'
  },
  contacts_not_found_short: {
    id: 'contacts_not_found_short',
    defaultMessage: "No contacts match ''{query}''",
    description: 'Shown in ContactsView when search returned no results'
  },
  add_members_prompt: {
    id: 'add_members_prompt',
    defaultMessage: 'add members',
    description: 'Placeholder in group members input field'
  }
});
class GroupManager extends (react__WEBPACK_IMPORTED_MODULE_0___default().Component) {
  constructor(props) {
    super(props);
    this.state = {
      members: props.members,
      index: GroupManager.indexMembers(props.members),
      staticMembers: GroupManager.staticMembers(props.members, props.keepInitialMembers, props.requiredMember),
      contactFilter: '',
      noContactsMessage: props.intl.formatMessage(messages.no_contacts),
      selectedContacts: GroupManager.selectedContacts(props.members)
    };
    this.handleContactSelected = this.handleContactSelected.bind(this);
    this.handleMemberRemoved = this.handleMemberRemoved.bind(this);
    this.handleContactFilter = this.handleContactFilter.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }
  static indexMembers(members) {
    let index = {};
    members.forEach(m => {
      index[m.user] = {
        delta: 0,
        present: true
      };
    });
    return index;
  }
  static staticMembers(members, keepInitial, requiredMember) {
    let stat = [];
    members.forEach(m => {
      if (keepInitial || m.user == requiredMember) {
        stat.push(m.user);
      }
    });
    return stat;
  }
  static selectedContacts(members) {
    let sel = [];
    members.forEach(m => {
      sel.push(m.user);
    });
    return sel;
  }
  handleContactSelected(userId, index) {
    let status = this.state.index[userId];
    if (status) {
      if (status.present) {
        return;
      }
      status.delta += 1;
      status.present = true;
    } else {
      status = {
        delta: 1,
        present: true
      };
    }
    let m = this.state.members.slice();
    m.push(this.props.contacts[index]);
    const sel = GroupManager.selectedContacts(m);
    const i = this.state.index;
    i[userId] = status;
    this.setState({
      members: m,
      index: i,
      selectedContacts: sel
    });
  }
  handleMemberRemoved(userId, index) {
    const status = this.state.index[userId];
    if (!status || !status.present) {
      return;
    }
    status.present = false;
    status.delta -= 1;
    let m = this.state.members.slice();
    m.splice(index, 1);
    const sel = GroupManager.selectedContacts(m);
    const i = this.state.index;
    i[userId] = status;
    this.setState({
      members: m,
      index: i,
      selectedContacts: sel
    });
  }
  handleContactFilter(val) {
    const {
      formatMessage
    } = this.props.intl;
    const msg = !val ? formatMessage(messages.no_contacts) : formatMessage(messages.contacts_not_found_short, {
      query: val
    });
    this.setState({
      contactFilter: val,
      noContactsMessage: msg
    });
  }
  static doContactFiltering(filter, values) {
    if (filter) {
      for (let i = 0; i < values.length; i++) {
        if (values[i].indexOf(filter) >= 0) {
          return true;
        }
      }
      return false;
    }
    return true;
  }
  handleSubmit() {
    const members = [];
    const added = [];
    const removed = [];
    const keys = Object.keys(this.state.index);
    keys.forEach(k => {
      if (this.state.index[k].present) {
        members.push(k);
      }
      if (this.state.index[k].delta > 0) {
        added.push(k);
      } else if (this.state.index[k].delta < 0) {
        removed.push(k);
      }
    });
    this.props.onSubmit(members, added, removed);
  }
  handleCancel() {
    this.props.onCancel();
  }
  render() {
    return (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
      id: "group-manager",
      children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
        className: "panel-form-row",
        children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("label", {
          className: "small",
          children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "title_group_members",
            defaultMessage: "Group Members",
            description: "Section title"
          }, void 0, false)
        }, void 0, false)
      }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
        className: "panel-form-row",
        children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(_chip_input_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
          tinode: this.props.tinode,
          chips: this.state.members,
          staticMembers: this.state.staticMembers,
          prompt: this.props.intl.formatMessage(messages.add_members_prompt),
          filterFunc: this.handleContactFilter,
          onChipRemoved: this.handleMemberRemoved
        }, void 0, false)
      }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
        className: "panel-form-row",
        children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("label", {
          className: "small",
          children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "title_all_contacts",
            defaultMessage: "All Contacts",
            description: "Section title [All Contacts]"
          }, void 0, false)
        }, void 0, false)
      }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(_contact_list_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
        tinode: this.props.tinode,
        contacts: this.props.contacts,
        myUserId: this.props.myUserId,
        topicSelected: this.state.selectedContacts,
        filter: this.state.contactFilter,
        filterFunc: GroupManager.doContactFiltering,
        emptyListMessage: this.state.noContactsMessage,
        showOnline: false,
        showUnread: false,
        onTopicSelected: this.handleContactSelected
      }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
        id: "group-manager-buttons",
        className: "panel-form-row",
        children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("button", {
          className: "secondary",
          onClick: this.handleCancel,
          children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "button_cancel",
            defaultMessage: "Cancel",
            description: "Button [Cancel]"
          }, void 0, false)
        }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("button", {
          className: "primary",
          onClick: this.handleSubmit,
          children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "button_ok",
            defaultMessage: "OK",
            description: "Button [OK]"
          }, void 0, false)
        }, void 0, false)]
      }, void 0, true)]
    }, void 0, true);
  }
}
;
/* harmony default export */ __webpack_exports__["default"] = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(GroupManager));

/***/ }),

/***/ "./src/widgets/permissions-editor.jsx":
/*!********************************************!*\
  !*** ./src/widgets/permissions-editor.jsx ***!
  \********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _checkbox_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./checkbox.jsx */ "./src/widgets/checkbox.jsx");
/* harmony import */ var _contact_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./contact.jsx */ "./src/widgets/contact.jsx");
/* harmony import */ var _lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../lib/blob-helpers.js */ "./src/lib/blob-helpers.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");






const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_1__.defineMessages)({
  joiner: {
    id: 'permission_join',
    defaultMessage: "Join ({val})",
    description: 'Name of J permission'
  },
  reader: {
    id: 'permission_read',
    defaultMessage: "Read ({val})",
    description: 'Name of R permission'
  },
  writer: {
    id: 'permission_write',
    defaultMessage: "Write ({val})",
    description: 'Name of W permission'
  },
  preser: {
    id: 'permission_pres',
    defaultMessage: "Get notified ({val})",
    description: 'Name of P permission'
  },
  approver: {
    id: 'permission_admin',
    defaultMessage: "Approve ({val})",
    description: 'Name of A permission'
  },
  sharer: {
    id: 'permission_share',
    defaultMessage: "Share ({val})",
    description: 'Name of S permission'
  },
  deleter: {
    id: 'permission_delete',
    defaultMessage: "Delete ({val})",
    description: 'Name of D permission'
  },
  owner: {
    id: 'permission_owner',
    defaultMessage: "Owner ({val})",
    description: 'Name of O permission'
  }
});
class PermissionsEditor extends (react__WEBPACK_IMPORTED_MODULE_0___default().Component) {
  constructor(props) {
    super(props);
    this.state = {
      mode: (props.mode || '').replace('N', '')
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }
  handleChange(val) {
    let mode = this.state.mode;
    const idx = mode.indexOf(val);
    if (idx == -1) {
      mode += val;
    } else {
      mode = mode.replace(val, '');
    }
    this.setState({
      mode: mode
    });
  }
  handleSubmit() {
    const mode = (this.state.mode || 'N').split('').sort().join('');
    const before = (this.props.mode || 'N').split('').sort().join('');
    if (mode !== before) {
      this.props.onSubmit(mode);
    } else {
      this.props.onCancel();
    }
  }
  handleCancel() {
    this.props.onCancel();
  }
  render() {
    const {
      formatMessage
    } = this.props.intl;
    const all = 'JRWPASDO';
    const names = {
      'J': formatMessage(messages.joiner, {
        val: 'J'
      }),
      'R': formatMessage(messages.reader, {
        val: 'R'
      }),
      'W': formatMessage(messages.writer, {
        val: 'W'
      }),
      'P': formatMessage(messages.preser, {
        val: 'P'
      }),
      'A': formatMessage(messages.approver, {
        val: 'A'
      }),
      'S': formatMessage(messages.sharer, {
        val: 'S'
      }),
      'D': formatMessage(messages.deleter, {
        val: 'D'
      }),
      'O': formatMessage(messages.owner, {
        val: 'O'
      })
    };
    let skip = this.props.skip || '';
    let mode = this.state.mode;
    let compare = (this.props.compare || '').replace('N', '');
    let items = [];
    for (let i = 0; i < all.length; i++) {
      let c = all.charAt(i);
      if (skip.indexOf(c) >= 0 && mode.indexOf(c) < 0) {
        continue;
      }
      items.push((0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("tr", {
        children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("td", {
          children: names[c]
        }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("td", {
          className: "checkbox",
          children: skip.indexOf(c) < 0 ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)(_checkbox_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
            name: c,
            checked: mode.indexOf(c) >= 0,
            onChange: this.handleChange
          }, void 0, false) : (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)(_checkbox_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
            name: c,
            checked: mode.indexOf(c) >= 0
          }, void 0, false)
        }, void 0, false), this.props.compare ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("td", {
          className: "checkbox",
          children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)(_checkbox_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
            name: c,
            checked: compare.indexOf(c) >= 0
          }, void 0, false)
        }, void 0, false) : null]
      }, c, true));
    }
    return (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("div", {
      className: "panel-form-column",
      children: [this.props.userTitle ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("ul", {
        className: "contact-box small",
        children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)(_contact_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
          tinode: this.props.tinode,
          item: this.props.item,
          title: this.props.userTitle,
          small: true,
          avatar: (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_4__.makeImageUrl)(this.props.userAvatar ? this.props.userAvatar : null)
        }, void 0, false)
      }, void 0, false) : null, (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("label", {
        className: "small",
        children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
          id: "title_permissions",
          defaultMessage: "Permissions",
          description: "Section title"
        }, void 0, false)
      }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("table", {
        className: "permission-editor",
        children: [this.props.compare ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("thead", {
          children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("tr", {
            children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("th", {}, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("th", {
              children: this.props.modeTitle
            }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("th", {
              children: this.props.compareTitle
            }, void 0, false)]
          }, void 0, true)
        }, void 0, false) : null, (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("tbody", {
          children: items
        }, void 0, false)]
      }, void 0, true), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("br", {}, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("div", {
        className: "dialog-buttons",
        children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("button", {
          className: "outline",
          onClick: this.handleCancel,
          children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "button_cancel",
            defaultMessage: "Cancel",
            description: "Button [Cancel]"
          }, void 0, false)
        }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("button", {
          className: "primary",
          onClick: this.handleSubmit,
          children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "button_ok",
            defaultMessage: "OK",
            description: "Button [OK]"
          }, void 0, false)
        }, void 0, false)]
      }, void 0, true)]
    }, void 0, true);
  }
}
;
/* harmony default export */ __webpack_exports__["default"] = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(PermissionsEditor));

/***/ }),

/***/ "./src/widgets/show-qrcode.jsx":
/*!*************************************!*\
  !*** ./src/widgets/show-qrcode.jsx ***!
  \*************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ ShowQRCode; }
/* harmony export */ });
/* harmony import */ var qrcodejs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! qrcodejs */ "qrcodejs");
/* harmony import */ var qrcodejs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(qrcodejs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../config */ "./src/config.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");





class ShowQRCode extends (react__WEBPACK_IMPORTED_MODULE_1___default().PureComponent) {
  constructor(props) {
    super(props);
    this.qrCodeRef = react__WEBPACK_IMPORTED_MODULE_1___default().createRef();
  }
  componentDidMount() {
    new (qrcodejs__WEBPACK_IMPORTED_MODULE_0___default())(this.qrCodeRef.current, {
      text: this.props.uri,
      width: _config__WEBPACK_IMPORTED_MODULE_3__.QRCODE_SIZE,
      height: _config__WEBPACK_IMPORTED_MODULE_3__.QRCODE_SIZE
    });
  }
  render() {
    return (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
      className: "panel-form-column",
      children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("br", {}, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
        className: "qr-code",
        ref: this.qrCodeRef
      }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
        children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("tt", {
          children: this.props.uri
        }, void 0, false)
      }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
        className: "dialog-buttons",
        children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("button", {
          className: "outline",
          onClick: this.props.onCancel,
          children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_2__.FormattedMessage, {
            id: "button_ok",
            defaultMessage: "OK",
            description: "Button [OK]"
          }, void 0, false)
        }, void 0, false)
      }, void 0, false)]
    }, void 0, true);
  }
}
;

/***/ }),

/***/ "./src/widgets/topic-security.jsx":
/*!****************************************!*\
  !*** ./src/widgets/topic-security.jsx ***!
  \****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");



const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_1__.defineMessages)({
  clear_messages: {
    id: 'action_clear_messages',
    defaultMessage: 'Clear Messages',
    description: 'Flat button [Clear Messages] (soft-delete messages)'
  },
  clear_messages_warning: {
    id: 'clear_messages_warning',
    defaultMessage: 'Are you sure you want to clear all messages? It cannot be undone.',
    description: 'Alert dialog warning when deleting all messages.'
  },
  delete_messages: {
    id: 'action_delete_messages',
    defaultMessage: 'Clear Messages for All',
    description: 'Flat button [Clear for All] (hard-delete all messages)'
  },
  delete_messages_warning: {
    id: 'delete_messages_warning',
    defaultMessage: 'Are you sure you want to delete all messages for everyone? It cannot be undone.',
    description: 'Alert dialog warning when hard-deleting all messages.'
  },
  topic_delete: {
    id: 'topic_delete',
    defaultMessage: 'Delete Conversation',
    description: 'Alert title when deleting the topic.'
  },
  topic_delete_warning: {
    id: 'topic_delete_warning',
    defaultMessage: 'Are you sure you want to delete this conversation? It cannot be undone.',
    description: 'Alert warning when deleting entire topic'
  },
  leave_chat: {
    id: 'action_leave_chat',
    defaultMessage: 'Leave Conversation',
    description: 'Flat button [Leave Conversation]'
  },
  leave_chat_warning: {
    id: 'leave_chat_warning',
    defaultMessage: 'Are you sure you want to leave this conversation?',
    description: 'Alert dialog warning when unsubscribing from a chat.'
  },
  block_contact: {
    id: 'action_block_contact',
    defaultMessage: "Block Contact",
    description: "Flat button [Block Contact]"
  },
  block_contact_warning: {
    id: 'block_contact_warning',
    defaultMessage: 'Are you sure you want to block this contact?',
    description: 'Alert dialog warning when blocking a contact.'
  },
  report_chat: {
    id: 'action_report_chat',
    defaultMessage: 'Report Conversation',
    description: 'Flat button [Report Group]'
  },
  report_chat_warning: {
    id: 'report_chat_warning',
    defaultMessage: 'Are you sure you want to block and report this conversation?',
    description: 'Alert dialog warning when reporting a conversation for abuse'
  },
  other_user: {
    id: 'label_other_user',
    defaultMessage: 'Other',
    description: 'Label for the other user when the user is unnamed'
  }
});
class TopicSecurity extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
    this.handleDeleteTopic = this.handleDeleteTopic.bind(this);
    this.handleDeleteMessages = this.handleDeleteMessages.bind(this);
    this.handleLeave = this.handleLeave.bind(this);
    this.handleBlock = this.handleBlock.bind(this);
    this.handleReport = this.handleReport.bind(this);
  }
  handleDeleteTopic(e) {
    e.preventDefault();
    const {
      formatMessage
    } = this.props.intl;
    this.props.onShowAlert(formatMessage(messages.topic_delete), formatMessage(messages.topic_delete_warning), _ => this.props.onDeleteTopic(this.props.topic), null, true, null);
  }
  handleDeleteMessages(e) {
    e.preventDefault();
    const {
      formatMessage
    } = this.props.intl;
    this.props.onShowAlert(formatMessage(this.props.deleter ? messages.delete_messages : messages.clear_messages), formatMessage(this.props.deleter ? messages.delete_messages_warning : messages.clear_messages_warning), _ => this.props.onDeleteMessages(this.props.topic), null, true, null);
  }
  handleLeave(e) {
    e.preventDefault();
    const {
      formatMessage
    } = this.props.intl;
    this.props.onShowAlert(formatMessage(messages.leave_chat), formatMessage(messages.leave_chat_warning), _ => this.props.onLeaveTopic(this.props.topic), null, true, null);
  }
  handleBlock(e) {
    e.preventDefault();
    const {
      formatMessage
    } = this.props.intl;
    this.props.onShowAlert(formatMessage(messages.block_contact), formatMessage(messages.block_contact_warning), _ => this.props.onBlockTopic(this.props.topic), null, true, null);
  }
  handleReport(e) {
    e.preventDefault();
    const {
      formatMessage
    } = this.props.intl;
    this.props.onShowAlert(formatMessage(messages.report_chat), formatMessage(messages.report_chat_warning), _ => {
      this.props.onReportTopic(this.props.topic);
    }, null, true, null);
  }
  render() {
    const {
      formatMessage
    } = this.props.intl;
    return (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("div", {
      className: "scrollable-panel",
      children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("div", {
        className: "panel-form-column",
        children: [!this.props.channel ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("a", {
          href: "#",
          className: "flat-button",
          onClick: this.handleDeleteMessages,
          children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("i", {
            className: "material-icons",
            children: "delete_outline"
          }, void 0, false), " \xA0", formatMessage(this.props.deleter ? messages.delete_messages : messages.clear_messages)]
        }, void 0, true) : null, this.props.owner ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("a", {
          href: "#",
          className: "danger flat-button",
          onClick: this.handleDeleteTopic,
          children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("i", {
            className: "material-icons",
            children: "delete"
          }, void 0, false), " \xA0", formatMessage(messages.topic_delete)]
        }, void 0, true) : (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("a", {
          href: "#",
          className: "danger flat-button",
          onClick: this.handleLeave,
          children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("i", {
            className: "material-icons",
            children: "exit_to_app"
          }, void 0, false), " \xA0", formatMessage(messages.leave_chat)]
        }, void 0, true), !this.props.groupTopic ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("a", {
          href: "#",
          className: "danger flat-button",
          onClick: this.handleBlock,
          children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("i", {
            className: "material-icons",
            children: "block"
          }, void 0, false), " \xA0", formatMessage(messages.block_contact)]
        }, void 0, true) : null, !this.props.owner ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("a", {
          href: "#",
          className: "danger flat-button",
          onClick: this.handleReport,
          children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("i", {
            className: "material-icons",
            children: "report"
          }, void 0, false), " \xA0", formatMessage(messages.report_chat)]
        }, void 0, true) : null]
      }, void 0, true), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("div", {
        className: "hr"
      }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("div", {
        className: "panel-form-column",
        children: this.props.groupTopic ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.Fragment, {
          children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("div", {
            className: "group",
            children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("label", {
              children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
                id: "label_your_permissions",
                defaultMessage: "Your permissions:",
                description: "Label for current user permissions"
              }, void 0, false)
            }, void 0, false), " ", (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("tt", {
              className: "clickable",
              onClick: e => {
                e.preventDefault();
                this.props.onLaunchPermissionsEditor('want');
              },
              children: this.props.access
            }, void 0, false)]
          }, void 0, true), !this.props.channel ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("div", {
            className: "group",
            children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("div", {
              children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("label", {
                className: "small",
                children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
                  id: "label_default_access_mode",
                  defaultMessage: "Default access mode:",
                  description: "Label for default access mode"
                }, void 0, false)
              }, void 0, false)
            }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("div", {
              className: "quoted",
              children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("div", {
                children: ["Auth: ", (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("tt", {
                  className: this.props.owner ? 'clickable' : null,
                  onClick: e => {
                    e.preventDefault();
                    if (this.props.owner) {
                      this.props.onLaunchPermissionsEditor('auth');
                    }
                  },
                  children: this.props.auth
                }, void 0, false)]
              }, void 0, true), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("div", {
                children: ["Anon: ", (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("tt", {
                  className: this.props.owner ? 'clickable' : null,
                  onClick: e => {
                    e.preventDefault();
                    if (this.props.owner) {
                      this.props.onLaunchPermissionsEditor('anon');
                    }
                  },
                  children: this.props.anon
                }, void 0, false)]
              }, void 0, true)]
            }, void 0, true)]
          }, void 0, true) : null]
        }, void 0, true) : (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("div", {
          className: "group",
          children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("div", {
            children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("label", {
              className: "small",
              children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
                id: "label_permissions",
                defaultMessage: "Permissions:",
                description: "Section title"
              }, void 0, false)
            }, void 0, false)
          }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("div", {
            className: "quoted",
            children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("div", {
              children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
                id: "label_you",
                defaultMessage: "You:",
                description: "Label for the current user"
              }, void 0, false), " ", (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("tt", {
                className: "clickable",
                onClick: e => {
                  e.preventDefault();
                  this.props.onLaunchPermissionsEditor('want');
                },
                children: this.props.access
              }, void 0, false)]
            }, void 0, true), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("div", {
              children: [this.props.fullName ? this.props.fullName : formatMessage(messages.other_user), ": \xA0", (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("tt", {
                className: "clickable",
                onClick: e => {
                  e.preventDefault();
                  this.props.onLaunchPermissionsEditor('given');
                },
                children: this.props.modeGiven2
              }, void 0, false)]
            }, void 0, true)]
          }, void 0, true)]
        }, void 0, true)
      }, void 0, false)]
    }, void 0, true);
  }
}
;
/* harmony default export */ __webpack_exports__["default"] = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(TopicSecurity));

/***/ })

}]);
//# sourceMappingURL=src_views_info-view_jsx.dev.js.map
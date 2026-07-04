"use strict";
(self["webpackChunktinode_webapp"] = self["webpackChunktinode_webapp"] || []).push([["src_views_account-settings-view_jsx"],{

/***/ "./src/views/account-settings-view.jsx":
/*!*********************************************!*\
  !*** ./src/views/account-settings-view.jsx ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ AccountSettingsView; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var libphonenumber_js_mobile__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! libphonenumber-js/mobile */ "./node_modules/libphonenumber-js/mobile/exports/parsePhoneNumberWithError.js");
/* harmony import */ var _widgets_avatar_upload_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../widgets/avatar-upload.jsx */ "./src/widgets/avatar-upload.jsx");
/* harmony import */ var _widgets_badge_list_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../widgets/badge-list.jsx */ "./src/widgets/badge-list.jsx");
/* harmony import */ var _widgets_credential_edit_jsx__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../widgets/credential-edit.jsx */ "./src/widgets/credential-edit.jsx");
/* harmony import */ var _lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../lib/blob-helpers.js */ "./src/lib/blob-helpers.js");
/* harmony import */ var _lib_strformat_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../lib/strformat.js */ "./src/lib/strformat.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");










function _clip(str, length) {
  return (0,_lib_strformat_js__WEBPACK_IMPORTED_MODULE_7__.truncateString)(str, length);
}
class AccountSettingsView extends (react__WEBPACK_IMPORTED_MODULE_0___default().Component) {
  constructor(props) {
    super(props);
    const me = this.props.tinode.getMeTopic();
    this.state = {
      fullName: _clip(me.public ? me.public.fn : undefined, _config_js__WEBPACK_IMPORTED_MODULE_8__.MAX_TITLE_LENGTH),
      description: _clip(me.public ? me.public.note : undefined, _config_js__WEBPACK_IMPORTED_MODULE_8__.MAX_TOPIC_DESCRIPTION_LENGTH),
      avatar: (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_6__.makeImageUrl)(me.public ? me.public.photo : null),
      credentials: me.getCredentials() || [],
      credEdit: undefined,
      alias: ((me.tags() || []).find(tag => tag.startsWith('alias:')) || '').substring(6)
    };
  }
  componentDidMount() {
    const me = this.props.tinode.getMeTopic();
    me.onCredsUpdated = _ => this.setState({
      credentials: me.getCredentials()
    });
  }
  componentWillUnmount() {
    const me = this.props.tinode.getMeTopic();
    me.onCredsUpdated = null;
  }
  render() {
    if (this.state.credEdit) {
      return (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)(_widgets_credential_edit_jsx__WEBPACK_IMPORTED_MODULE_5__["default"], {
        method: this.state.credEdit.meth,
        val: this.state.credEdit.val,
        done: this.state.credEdit.done,
        onShowCountrySelector: this.props.onShowCountrySelector,
        onCredAdd: this.props.onCredAdd,
        onCredConfirm: this.props.onCredConfirm,
        onCancel: _ => this.setState({
          credEdit: undefined
        }),
        onError: this.props.onError
      }, void 0, false);
    }
    const validated = {};
    this.state.credentials.forEach(cred => {
      if (cred.done) {
        validated[cred.meth] = (validated[cred.meth] || 0) + 1;
      }
    });
    const credentials = [];
    this.state.credentials.forEach((cred, idx) => {
      if (!['email', 'tel'].includes(cred.meth)) {
        return;
      }
      let val = cred.val;
      if (cred.meth == 'tel') {
        const number = (0,libphonenumber_js_mobile__WEBPACK_IMPORTED_MODULE_2__.parsePhoneNumberWithError)(cred.val);
        val = number ? number.formatInternational() : cred.val;
      }
      credentials.push((0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
        className: "group quoted",
        children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("tt", {
          className: "clickable",
          onClick: e => {
            e.preventDefault();
            this.setState({
              credEdit: cred
            });
          },
          children: val
        }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("span", {
          children: [" ", cred.done ? null : (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("i", {
            className: "material-icons",
            children: "pending"
          }, void 0, false), "\xA0", !cred.done || validated[cred.meth] > 1 || this.props.reqCredMethod != cred.meth ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("a", {
            href: "#",
            onClick: e => {
              e.preventDefault();
              this.props.onCredDelete(cred.meth, cred.val);
            },
            children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("i", {
              className: "material-icons",
              children: "delete"
            }, void 0, false)
          }, void 0, false) : null]
        }, void 0, true)]
      }, idx, true));
    });
    if (credentials.length > 0) {
      credentials.unshift((0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("label", {
        className: "small",
        children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
          id: "label_user_contacts",
          defaultMessage: "Contacts",
          description: "Label for user contacts"
        }, void 0, false)
      }, 'title', false));
    }
    return (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
      className: "scrollable-panel",
      children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
        className: "panel-form-column",
        children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("a", {
          href: "#",
          className: "flat-button float-right",
          onClick: e => {
            e.preventDefault();
            this.props.onNavigate('general');
          },
          children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("i", {
            className: "material-icons",
            children: "edit"
          }, void 0, false), "\xA0", (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "button_edit",
            defaultMessage: "Edit",
            description: "Call to action [Edit]"
          }, void 0, false)]
        }, void 0, true), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("center", {
          children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)(_widgets_avatar_upload_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
            tinode: this.props.tinode,
            avatar: this.state.avatar,
            readOnly: true,
            uid: this.props.myUserId,
            title: this.state.fullName
          }, void 0, false)
        }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
          className: "group",
          children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("label", {
            className: "small",
            children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
              id: "label_your_name",
              defaultMessage: "Your name",
              description: "Label for full name editing"
            }, void 0, false)
          }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
            className: "large ellipsized",
            children: this.state.fullName
          }, void 0, false)]
        }, void 0, true), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
          className: "group",
          children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("label", {
            className: "small",
            children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
              id: "label_user_id",
              defaultMessage: "ID:",
              description: "Label for user address (ID)"
            }, void 0, false)
          }, void 0, false), "\xA0", (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("tt", {
            children: this.props.myUserId
          }, void 0, false)]
        }, void 0, true), this.state.alias ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
          className: "group",
          children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("label", {
            className: "small",
            children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
              id: "label_alias",
              defaultMessage: "Alias:",
              description: "Label for user or topic alias"
            }, void 0, false)
          }, void 0, false), "\xA0", (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("tt", {
            children: ["@", this.state.alias]
          }, void 0, true)]
        }, void 0, true) : null, (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
          className: "group",
          children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)(_widgets_badge_list_jsx__WEBPACK_IMPORTED_MODULE_4__["default"], {
            trustedBadges: this.props.trustedBadges
          }, void 0, false)
        }, void 0, false), this.state.description ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
          className: "group",
          children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("label", {
            className: "small",
            children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
              id: "label_description",
              defaultMessage: "Description",
              description: "Label for description of user or topic"
            }, void 0, false)
          }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
            className: "quoted",
            children: this.state.description
          }, void 0, false)]
        }, void 0, true) : null]
      }, void 0, true), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
        className: "hr"
      }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
        className: "panel-form-column",
        children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
          className: "group",
          children: credentials
        }, void 0, false)
      }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
        className: "hr"
      }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
        className: "panel-form-column",
        children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("a", {
          href: "#",
          className: "flat-button",
          onClick: e => {
            e.preventDefault();
            this.props.onNavigate('acc_general');
          },
          children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("i", {
            className: "material-icons",
            children: "tune"
          }, void 0, false), "\xA0", (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "sidepanel_title_acc_general",
            defaultMessage: "General",
            description: "Sidepanel title for AccGeneralView."
          }, void 0, false)]
        }, void 0, true), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("a", {
          href: "#",
          className: "flat-button",
          onClick: e => {
            e.preventDefault();
            this.props.onNavigate('notif');
          },
          children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("i", {
            className: "material-icons",
            children: "notifications"
          }, void 0, false), "\xA0", (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "sidepanel_title_acc_notifications",
            defaultMessage: "Notifications",
            description: "Sidepanel title for AccNotificationsView."
          }, void 0, false)]
        }, void 0, true), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("a", {
          href: "#",
          className: "flat-button",
          onClick: e => {
            e.preventDefault();
            this.props.onNavigate('security');
          },
          children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("i", {
            className: "material-icons",
            children: "security"
          }, void 0, false), "\xA0", (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "button_security",
            defaultMessage: "Security",
            description: "Navigaton button for security panel."
          }, void 0, false)]
        }, void 0, true), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("a", {
          href: "#",
          className: "flat-button",
          onClick: e => {
            e.preventDefault();
            this.props.onNavigate('support');
          },
          children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("i", {
            className: "material-icons",
            children: "contact_support"
          }, void 0, false), "\xA0", (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "sidepanel_title_acc_support",
            defaultMessage: "Support",
            description: "Sidepanel title for AccSupportView."
          }, void 0, false)]
        }, void 0, true)]
      }, void 0, true)]
    }, void 0, true);
  }
}
;

/***/ }),

/***/ "./src/widgets/credential-edit.jsx":
/*!*****************************************!*\
  !*** ./src/widgets/credential-edit.jsx ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _phone_edit_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./phone-edit.jsx */ "./src/widgets/phone-edit.jsx");
/* harmony import */ var libphonenumber_js_mobile__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! libphonenumber-js/mobile */ "./node_modules/libphonenumber-js/mobile/exports/parsePhoneNumberWithError.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");





const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_1__.defineMessages)({
  password_reset_email_sent: {
    id: 'password_reset_email_sent',
    defaultMessage: 'An email with security code has been sent.',
    description: 'Notification that the email with password reset instructions has been sent'
  },
  password_reset_sms_sent: {
    id: 'password_reset_sms_sent',
    defaultMessage: 'A text message with security code has been sent.',
    description: 'Notification that the SMS with password reset instructions has been sent'
  }
});
class CredentialEdit extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
    this.state = {
      code: '',
      tel: '',
      email: '',
      sent: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePhoneChange = this.handlePhoneChange.bind(this);
    this.handleCodeChange = this.handleCodeChange.bind(this);
  }
  static formatPhoneNumber(raw) {
    let number;
    try {
      number = (0,libphonenumber_js_mobile__WEBPACK_IMPORTED_MODULE_3__.parsePhoneNumberWithError)(raw);
    } catch (err) {}
    return number ? number.formatInternational() : raw;
  }
  handleEmailChange(e) {
    this.setState({
      email: e.target.value
    });
  }
  handlePhoneChange(number) {
    this.setState({
      tel: number
    });
  }
  handleCodeChange(e) {
    this.setState({
      code: e.target.value.replace(/[^\d]/g, '')
    });
  }
  handleSubmit(e) {
    e.preventDefault();
    const value = this.props.method == 'email' ? this.state.email : this.state.tel;
    if (this.state.code) {
      this.props.onError(null);
      this.props.onCredConfirm(this.props.method, this.state.code);
    } else if (value) {
      this.props.onCredAdd(this.props.method, value);
      this.setState({
        sent: true
      });
      const msg = this.props.method == 'email' ? messages.password_reset_email_sent : messages.password_reset_sms_sent;
      this.props.onError(this.props.intl.formatMessage(msg), 'info');
    }
  }
  render() {
    const readyForCode = this.state.sent || !this.props.done;
    const rawValue = readyForCode ? this.state.tel || this.state.email : this.props.val;
    const formattedValue = this.props.method == 'tel' ? CredentialEdit.formatPhoneNumber(rawValue) : rawValue;
    const changeEmail = (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.Fragment, {
      children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
        className: "panel-form-row",
        children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("label", {
          className: "large",
          children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "change_email",
            defaultMessage: "Change email",
            description: "Prompt to change current email"
          }, void 0, false)
        }, void 0, false)
      }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
        className: "group",
        children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("label", {
          className: "small gray",
          children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "current_email",
            defaultMessage: "Current email",
            description: "Label for old email"
          }, void 0, false)
        }, void 0, false)
      }, void 0, false)]
    }, void 0, true);
    const changePhone = (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.Fragment, {
      children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
        className: "panel-form-row",
        children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("label", {
          className: "large",
          children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "change_phone",
            defaultMessage: "Change phone number",
            description: "Prompt to change current phone number"
          }, void 0, false)
        }, void 0, false)
      }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
        className: "group",
        children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("label", {
          className: "small gray",
          children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "current_phone",
            defaultMessage: "Current phone number",
            description: "Label for old phone"
          }, void 0, false)
        }, void 0, false)
      }, void 0, false)]
    }, void 0, true);
    const newEmailLabel = (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("label", {
      className: "small gray",
      children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
        id: "new_email",
        defaultMessage: "New email",
        description: "Prompt for entering a new email"
      }, void 0, false)
    }, void 0, false);
    const newEmailInput = (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.Fragment, {
      children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
        className: "group",
        children: newEmailLabel
      }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
        className: "group",
        children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
          id: "email_prompt",
          defaultMessage: "Email, e.g. jdoe@example.com",
          description: "Input placeholder for email entry",
          children: email_prompt => (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("input", {
            type: "email",
            placeholder: email_prompt,
            autoComplete: "email",
            value: this.state.email,
            onChange: this.handleEmailChange,
            required: true
          }, void 0, false)
        }, void 0, false)
      }, void 0, false)]
    }, void 0, true);
    const newPhoneLabel = (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("label", {
      className: "small gray",
      children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
        id: "new_phone_number",
        defaultMessage: "New phone number",
        description: "Prompt for entering a new telephone number"
      }, void 0, false)
    }, void 0, false);
    const newPhoneInput = (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.Fragment, {
      children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
        className: "group",
        children: newPhoneLabel
      }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
        className: "panel-form-row",
        children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(_phone_edit_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
          autoFocus: true,
          onShowCountrySelector: this.props.onShowCountrySelector,
          onSubmit: this.handlePhoneChange
        }, void 0, false)
      }, void 0, false)]
    }, void 0, true);
    const codeInput = (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.Fragment, {
      children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
        className: "group",
        children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("label", {
          className: "small gray",
          children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "enter_confirmation_code_prompt",
            defaultMessage: "Confirmation code",
            description: "Request to enter confirmation code"
          }, void 0, false)
        }, void 0, false)
      }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
        className: "group",
        children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
          id: "numeric_confirmation_code_prompt",
          defaultMessage: "Numbers only",
          description: "Prompt for numeric conformation code",
          children: numbers_only => (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("input", {
            type: "text",
            placeholder: numbers_only,
            maxLength: 10,
            value: this.state.code,
            onChange: this.handleCodeChange,
            required: true
          }, void 0, false)
        }, void 0, false)
      }, void 0, false)]
    }, void 0, true);
    return (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("form", {
      className: "panel-form-column",
      onSubmit: this.handleSubmit,
      children: [readyForCode ? this.props.method == 'email' ? newEmailLabel : this.props.method == 'tel' ? newPhoneLabel : null : this.props.method == 'email' ? changeEmail : this.props.method == 'tel' ? changePhone : null, (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
        className: "panel-form-row",
        children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("tt", {
          className: "quoted",
          children: formattedValue
        }, void 0, false)
      }, void 0, false), readyForCode ? null : this.props.method == 'email' ? newEmailInput : this.props.method == 'tel' ? newPhoneInput : null, readyForCode ? codeInput : null, (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
        className: "dialog-buttons",
        children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("button", {
          className: "secondary",
          onClick: this.props.onCancel,
          children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "button_cancel",
            defaultMessage: "Cancel",
            description: "Button [Cancel]"
          }, void 0, false)
        }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("button", {
          className: "primary",
          type: "submit",
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
/* harmony default export */ __webpack_exports__["default"] = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(CredentialEdit));

/***/ })

}]);
//# sourceMappingURL=src_views_account-settings-view_jsx.dev.js.map
"use strict";
(self["webpackChunktinode_webapp"] = self["webpackChunktinode_webapp"] || []).push([["src_views_acc-security-view_jsx"],{

/***/ "./src/views/acc-security-view.jsx":
/*!*****************************************!*\
  !*** ./src/views/acc-security-view.jsx ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _widgets_checkbox_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../widgets/checkbox.jsx */ "./src/widgets/checkbox.jsx");
/* harmony import */ var _widgets_in_place_edit_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../widgets/in-place-edit.jsx */ "./src/widgets/in-place-edit.jsx");
/* harmony import */ var _widgets_permissions_editor_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../widgets/permissions-editor.jsx */ "./src/widgets/permissions-editor.jsx");





const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_1__.defineMessages)({
  delete_account: {
    id: "delete_account",
    defaultMessage: [{
      "type": 0,
      "value": "Delete account"
    }]
  },
  delete_account_warning: {
    id: "delete_account_warning",
    defaultMessage: [{
      "type": 0,
      "value": "Are you sure you want to delete your account? It cannot be undone."
    }]
  }
});
class AccSecurityView extends (react__WEBPACK_IMPORTED_MODULE_0___default().Component) {
  constructor(props) {
    super(props);
    const me = this.props.tinode.getMeTopic();
    let blockedCount = 0;
    me.contacts(c => {
      if (c.acs && !c.acs.isJoiner()) {
        blockedCount++;
      }
    });
    const defacs = me.getDefaultAccess();
    this.state = {
      auth: defacs ? defacs.auth : null,
      anon: defacs ? defacs.anon : null,
      showPermissionEditorFor: undefined,
      blockedCount: blockedCount
    };
    this.handlePasswordUpdate = this.handlePasswordUpdate.bind(this);
    this.handleLaunchPermissionsEditor = this.handleLaunchPermissionsEditor.bind(this);
    this.handleHidePermissionsEditor = this.handleHidePermissionsEditor.bind(this);
    this.handlePermissionsChanged = this.handlePermissionsChanged.bind(this);
    this.handleDeleteAccount = this.handleDeleteAccount.bind(this);
    this.handleCheckboxClick = this.handleCheckboxClick.bind(this);
  }
  handlePasswordUpdate(pwd) {
    this.setState({
      password: pwd
    });
    this.props.onUpdatePassword(pwd);
  }
  handleLaunchPermissionsEditor(which) {
    this.setState({
      showPermissionEditorFor: which,
      editedPermissions: this.state[which]
    });
  }
  handleHidePermissionsEditor() {
    this.setState({
      showPermissionEditorFor: undefined
    });
  }
  handlePermissionsChanged(perm) {
    let defacs = {};
    defacs[this.state.showPermissionEditorFor] = perm;
    this.props.onUpdateAccountDesc('me', undefined, undefined, defacs);
    let newState = {
      showPermissionEditorFor: undefined
    };
    newState[this.state.showPermissionEditorFor] = perm;
    this.setState(newState);
  }
  handleCheckboxClick(what, checked) {
    this.props.onToggleIncognitoMode(checked);
  }
  handleDeleteAccount(e) {
    e.preventDefault();
    const {
      formatMessage
    } = this.props.intl;
    this.props.onShowAlert(formatMessage(messages.delete_account), formatMessage(messages.delete_account_warning), _ => this.props.onDeleteAccount(), null, true, null);
  }
  render() {
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, this.state.showPermissionEditorFor ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_permissions_editor_jsx__WEBPACK_IMPORTED_MODULE_4__["default"], {
      mode: this.state.editedPermissions,
      skip: "O",
      onSubmit: this.handlePermissionsChanged,
      onCancel: this.handleHidePermissionsEditor
    }) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "scrollable-panel"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-column"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      className: "small"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_password",
      defaultMessage: [{
        "type": 0,
        "value": "Password"
      }]
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "password_unchanged_prompt",
      defaultMessage: [{
        "type": 0,
        "value": "Unchanged"
      }]
    }, password_unchanged => react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_in_place_edit_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
      placeholder: password_unchanged,
      type: "password",
      onFinished: this.handlePasswordUpdate
    })))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "hr"
    }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      htmlFor: "incognito-mode"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_incognito_mode",
      defaultMessage: [{
        "type": 0,
        "value": "Incognito mode:"
      }]
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_checkbox_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
      name: "incognito",
      id: "incognito-mode",
      checked: this.props.incognitoMode,
      onChange: this.handleCheckboxClick
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
      className: "small gray"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "incognito_mode_description",
      defaultMessage: [{
        "type": 0,
        "value": "Hide your online status and typing indicators."
      }]
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "hr"
    }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-column"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      className: "danger flat-button",
      onClick: e => {
        e.preventDefault();
        this.props.onLogout();
      }
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "exit_to_app"), " \xA0", react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "button_logout",
      defaultMessage: [{
        "type": 0,
        "value": "Logout"
      }]
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      className: "danger flat-button",
      onClick: e => {
        this.handleDeleteAccount(e);
      }
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "delete"), " \xA0", react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "button_delete_account",
      defaultMessage: [{
        "type": 0,
        "value": "Delete account"
      }]
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "hr"
    }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-column"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      className: "small"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_default_access_mode",
      defaultMessage: [{
        "type": 0,
        "value": "Default access mode:"
      }]
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "quoted"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, "Auth: ", react__WEBPACK_IMPORTED_MODULE_0___default().createElement("tt", {
      className: "clickable",
      onClick: this.handleLaunchPermissionsEditor.bind(this, 'auth')
    }, this.state.auth)), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, "Anon: ", react__WEBPACK_IMPORTED_MODULE_0___default().createElement("tt", {
      className: "clickable",
      onClick: this.handleLaunchPermissionsEditor.bind(this, 'anon')
    }, this.state.anon)))), this.state.blockedCount > 0 ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "hr"
    }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "block"), "\xA0", react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      className: "gray",
      onClick: e => {
        e.preventDefault();
        this.props.onShowBlocked();
      }
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "blocked_contacts_link",
      defaultMessage: [{
        "type": 0,
        "value": "Blocked contacts ("
      }, {
        "type": 1,
        "value": "count"
      }, {
        "type": 0,
        "value": ")"
      }],
      values: {
        count: this.state.blockedCount
      }
    })))) : null));
  }
}
;
/* harmony default export */ __webpack_exports__["default"] = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(AccSecurityView));

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





const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_1__.defineMessages)({
  joiner: {
    id: "permission_join",
    defaultMessage: [{
      "type": 0,
      "value": "Join ("
    }, {
      "type": 1,
      "value": "val"
    }, {
      "type": 0,
      "value": ")"
    }]
  },
  reader: {
    id: "permission_read",
    defaultMessage: [{
      "type": 0,
      "value": "Read ("
    }, {
      "type": 1,
      "value": "val"
    }, {
      "type": 0,
      "value": ")"
    }]
  },
  writer: {
    id: "permission_write",
    defaultMessage: [{
      "type": 0,
      "value": "Write ("
    }, {
      "type": 1,
      "value": "val"
    }, {
      "type": 0,
      "value": ")"
    }]
  },
  preser: {
    id: "permission_pres",
    defaultMessage: [{
      "type": 0,
      "value": "Get notified ("
    }, {
      "type": 1,
      "value": "val"
    }, {
      "type": 0,
      "value": ")"
    }]
  },
  approver: {
    id: "permission_admin",
    defaultMessage: [{
      "type": 0,
      "value": "Approve ("
    }, {
      "type": 1,
      "value": "val"
    }, {
      "type": 0,
      "value": ")"
    }]
  },
  sharer: {
    id: "permission_share",
    defaultMessage: [{
      "type": 0,
      "value": "Share ("
    }, {
      "type": 1,
      "value": "val"
    }, {
      "type": 0,
      "value": ")"
    }]
  },
  deleter: {
    id: "permission_delete",
    defaultMessage: [{
      "type": 0,
      "value": "Delete ("
    }, {
      "type": 1,
      "value": "val"
    }, {
      "type": 0,
      "value": ")"
    }]
  },
  owner: {
    id: "permission_owner",
    defaultMessage: [{
      "type": 0,
      "value": "Owner ("
    }, {
      "type": 1,
      "value": "val"
    }, {
      "type": 0,
      "value": ")"
    }]
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
      items.push(react__WEBPACK_IMPORTED_MODULE_0___default().createElement("tr", {
        key: c
      }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("td", null, names[c]), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("td", {
        className: "checkbox"
      }, skip.indexOf(c) < 0 ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_checkbox_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
        name: c,
        checked: mode.indexOf(c) >= 0,
        onChange: this.handleChange
      }) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_checkbox_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
        name: c,
        checked: mode.indexOf(c) >= 0
      })), this.props.compare ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("td", {
        className: "checkbox"
      }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_checkbox_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
        name: c,
        checked: compare.indexOf(c) >= 0
      })) : null));
    }
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-column"
    }, this.props.userTitle ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("ul", {
      className: "contact-box small"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_contact_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
      tinode: this.props.tinode,
      item: this.props.item,
      title: this.props.userTitle,
      small: true,
      avatar: (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_4__.makeImageUrl)(this.props.userAvatar ? this.props.userAvatar : null)
    })) : null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      className: "small"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "title_permissions",
      defaultMessage: [{
        "type": 0,
        "value": "Permissions"
      }]
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("table", {
      className: "permission-editor"
    }, this.props.compare ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("thead", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("tr", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("th", null), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("th", null, this.props.modeTitle), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("th", null, this.props.compareTitle))) : null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("tbody", null, items)), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("br", null), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "dialog-buttons"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
      className: "outline",
      onClick: this.handleCancel
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "button_cancel",
      defaultMessage: [{
        "type": 0,
        "value": "Cancel"
      }]
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
      className: "primary",
      onClick: this.handleSubmit
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "button_ok",
      defaultMessage: [{
        "type": 0,
        "value": "OK"
      }]
    }))));
  }
}
;
/* harmony default export */ __webpack_exports__["default"] = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(PermissionsEditor));

/***/ })

}]);
//# sourceMappingURL=src_views_acc-security-view_jsx.dev.js.map
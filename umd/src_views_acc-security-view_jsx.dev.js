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
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");






const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_1__.defineMessages)({
  delete_account: {
    id: 'delete_account',
    defaultMessage: 'Delete account',
    description: 'Title for delete account warning'
  },
  delete_account_warning: {
    id: 'delete_account_warning',
    defaultMessage: 'Are you sure you want to delete your account? It cannot be undone.',
    description: 'Warning message when deleting an account'
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
    return (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.Fragment, {
      children: this.state.showPermissionEditorFor ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)(_widgets_permissions_editor_jsx__WEBPACK_IMPORTED_MODULE_4__["default"], {
        mode: this.state.editedPermissions,
        skip: "O",
        onSubmit: this.handlePermissionsChanged,
        onCancel: this.handleHidePermissionsEditor
      }, void 0, false) : (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("div", {
        className: "scrollable-panel",
        children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("div", {
          className: "panel-form-column",
          children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("label", {
            className: "small",
            children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
              id: "label_password",
              defaultMessage: "Password",
              description: "Label for password editing"
            }, void 0, false)
          }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("div", {
            children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
              id: "password_unchanged_prompt",
              defaultMessage: "Unchanged",
              description: "Message in editor while password is unchanged",
              children: password_unchanged => (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)(_widgets_in_place_edit_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
                placeholder: password_unchanged,
                type: "password",
                onFinished: this.handlePasswordUpdate
              }, void 0, false)
            }, void 0, false)
          }, void 0, false)]
        }, void 0, true), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("div", {
          className: "hr"
        }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("div", {
          className: "panel-form-row",
          children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("label", {
            htmlFor: "incognito-mode",
            children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
              id: "label_incognito_mode",
              defaultMessage: "Incognito mode:",
              description: "Label for incognito mode toggle"
            }, void 0, false)
          }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)(_widgets_checkbox_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
            name: "incognito",
            id: "incognito-mode",
            checked: this.props.incognitoMode,
            onChange: this.handleCheckboxClick
          }, void 0, false)]
        }, void 0, true), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("div", {
          className: "panel-form-row",
          children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("span", {
            className: "small gray",
            children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
              id: "incognito_mode_description",
              defaultMessage: "Hide your online status and typing indicators.",
              description: "Description for incognito mode toggle"
            }, void 0, false)
          }, void 0, false)
        }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("div", {
          className: "hr"
        }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("div", {
          className: "panel-form-column",
          children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("a", {
            href: "#",
            className: "danger flat-button",
            onClick: e => {
              e.preventDefault();
              this.props.onLogout();
            },
            children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("i", {
              className: "material-icons",
              children: "exit_to_app"
            }, void 0, false), " \xA0", (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
              id: "button_logout",
              defaultMessage: "Logout",
              description: "Button [Logout]"
            }, void 0, false)]
          }, void 0, true), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("a", {
            href: "#",
            className: "danger flat-button",
            onClick: e => {
              this.handleDeleteAccount(e);
            },
            children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("i", {
              className: "material-icons",
              children: "delete"
            }, void 0, false), " \xA0", (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
              id: "button_delete_account",
              defaultMessage: "Delete account",
              description: "Button [Delete account]"
            }, void 0, false)]
          }, void 0, true)]
        }, void 0, true), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("div", {
          className: "hr"
        }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("div", {
          className: "panel-form-column",
          children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("div", {
            children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("label", {
              className: "small",
              children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
                id: "label_default_access_mode",
                defaultMessage: "Default access mode:",
                description: "Label for default access mode"
              }, void 0, false)
            }, void 0, false)
          }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("div", {
            className: "quoted",
            children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("div", {
              children: ["Auth: ", (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("tt", {
                className: "clickable",
                onClick: this.handleLaunchPermissionsEditor.bind(this, 'auth'),
                children: this.state.auth
              }, void 0, false)]
            }, void 0, true), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("div", {
              children: ["Anon: ", (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("tt", {
                className: "clickable",
                onClick: this.handleLaunchPermissionsEditor.bind(this, 'anon'),
                children: this.state.anon
              }, void 0, false)]
            }, void 0, true)]
          }, void 0, true)]
        }, void 0, true), this.state.blockedCount > 0 ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.Fragment, {
          children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("div", {
            className: "hr"
          }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("div", {
            className: "panel-form-row",
            children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("i", {
              className: "material-icons",
              children: "block"
            }, void 0, false), "\xA0", (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("a", {
              href: "#",
              className: "gray",
              onClick: e => {
                e.preventDefault();
                this.props.onShowBlocked();
              },
              children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
                id: "blocked_contacts_link",
                defaultMessage: "Blocked contacts ({count})",
                values: {
                  count: this.state.blockedCount
                },
                description: "Blocked contacts link"
              }, void 0, false)
            }, void 0, false)]
          }, void 0, true)]
        }, void 0, true) : null]
      }, void 0, true)
    }, void 0, false);
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

/***/ })

}]);
//# sourceMappingURL=src_views_acc-security-view_jsx.dev.js.map
"use strict";
(self["webpackChunktinode_webapp"] = self["webpackChunktinode_webapp"] || []).push([["src_views_create-account-view_jsx"],{

/***/ "./src/views/create-account-view.jsx":
/*!*******************************************!*\
  !*** ./src/views/create-account-view.jsx ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ CreateAccountView; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _widgets_avatar_crop_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../widgets/avatar-crop.jsx */ "./src/widgets/avatar-crop.jsx");
/* harmony import */ var _widgets_avatar_upload_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../widgets/avatar-upload.jsx */ "./src/widgets/avatar-upload.jsx");
/* harmony import */ var _widgets_checkbox_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../widgets/checkbox.jsx */ "./src/widgets/checkbox.jsx");
/* harmony import */ var _widgets_phone_edit_jsx__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../widgets/phone-edit.jsx */ "./src/widgets/phone-edit.jsx");
/* harmony import */ var _widgets_visible_password_jsx__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../widgets/visible-password.jsx */ "./src/widgets/visible-password.jsx");
/* harmony import */ var _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../lib/local-storage.js */ "./src/lib/local-storage.js");
/* harmony import */ var _lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../lib/blob-helpers.js */ "./src/lib/blob-helpers.js");
/* harmony import */ var _lib_utils_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../lib/utils.js */ "./src/lib/utils.js");
/* harmony import */ var _lib_strformat_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../lib/strformat.js */ "./src/lib/strformat.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");













class CreateAccountView extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
    this.state = {
      login: '',
      password: '',
      meth: '',
      email: '',
      tel: '',
      fn: '',
      imageUrl: null,
      uploadUrl: null,
      newAvatar: null,
      newAvatarMime: null,
      buttonDisabled: false,
      saveToken: _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_7__["default"].getObject('keep-logged-in')
    };
    this.handleLoginChange = this.handleLoginChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePhoneChange = this.handlePhoneChange.bind(this);
    this.handleFnChange = this.handleFnChange.bind(this);
    this.handleImageChanged = this.handleImageChanged.bind(this);
    this.handleToggleSaveToken = this.handleToggleSaveToken.bind(this);
    this.handleAvatarCropped = this.handleAvatarCropped.bind(this);
    this.handleAvatarCropCancel = this.handleAvatarCropCancel.bind(this);
    this.uploadAvatar = this.uploadAvatar.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    props.tinode.connect().catch(err => {
      this.props.onError(err.message, 'err');
    });
  }
  handleLoginChange(e) {
    this.setState({
      login: e.target.value
    });
  }
  handlePasswordChange(password) {
    this.setState({
      password: password
    });
  }
  handleEmailChange(e) {
    this.setState({
      meth: 'email',
      email: e.target.value
    });
  }
  handlePhoneChange(number) {
    this.setState({
      meth: 'tel',
      tel: number
    });
  }
  handleFnChange(e) {
    this.setState({
      fn: e.target.value
    });
  }
  handleImageChanged(mime, img) {
    this.setState({
      newAvatar: img,
      newAvatarMime: mime
    });
    if (!img) {
      this.setState({
        imageUrl: null,
        uploadUrl: null
      });
    }
  }
  handleToggleSaveToken() {
    _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_7__["default"].setObject('keep-logged-in', !this.state.saveToken);
    this.setState({
      saveToken: !this.state.saveToken
    });
  }
  handleSubmit(e) {
    e.preventDefault();
    this.props.onCreateAccount(this.state.login.trim(), this.state.password.trim(), (0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_9__.theCard)((0,_lib_strformat_js__WEBPACK_IMPORTED_MODULE_10__.truncateString)(this.state.fn.trim(), _config_js__WEBPACK_IMPORTED_MODULE_11__.MAX_TITLE_LENGTH), this.state.uploadUrl), {
      'meth': this.state.meth,
      'val': this.state.meth == 'email' ? this.state.email : this.state.meth == 'tel' ? this.state.tel : null
    });
  }
  handleAvatarCropped(mime, blob, width, height) {
    const url = blob ? URL.createObjectURL(blob) : null;
    this.setState({
      newAvatar: null,
      newAvatarMime: null
    });
    if (blob) {
      this.uploadAvatar(mime, blob, width, height);
    }
  }
  handleAvatarCropCancel() {
    this.setState({
      newAvatar: null,
      newAvatarMime: null
    });
  }
  uploadAvatar(mime, blob, width, height) {
    const readyToUpload = image => {
      let {
        mime,
        blob
      } = image;
      this.setState({
        imageUrl: URL.createObjectURL(blob),
        buttonDisabled: true
      });
      if (blob.size > _config_js__WEBPACK_IMPORTED_MODULE_11__.MAX_AVATAR_BYTES) {
        const uploader = this.props.tinode.getLargeFileHelper();
        uploader.upload(blob, 'newacc').then(url => this.setState({
          uploadUrl: url
        })).catch(err => this.props.onError(err.message, 'err')).finally(_ => this.setState({
          buttonDisabled: false
        }));
      } else {
        (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_8__.blobToBase64)(blob).then(b64 => this.setState({
          uploadUrl: (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_8__.makeImageUrl)({
            data: b64.bits,
            type: mime
          })
        })).finally(_ => this.setState({
          buttonDisabled: false
        }));
      }
    };
    if (width > _config_js__WEBPACK_IMPORTED_MODULE_11__.AVATAR_SIZE || height > _config_js__WEBPACK_IMPORTED_MODULE_11__.AVATAR_SIZE || width != height) {
      (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_8__.imageScaled)(blob, _config_js__WEBPACK_IMPORTED_MODULE_11__.AVATAR_SIZE, _config_js__WEBPACK_IMPORTED_MODULE_11__.AVATAR_SIZE, _config_js__WEBPACK_IMPORTED_MODULE_11__.MAX_EXTERN_ATTACHMENT_SIZE, true).then(scaled => readyToUpload(scaled)).catch(err => this.props.onError(err.message, 'err'));
    } else {
      readyToUpload({
        mime: mime,
        blob: blob,
        width: width,
        height: height
      });
    }
  }
  render() {
    if (this.state.newAvatar) {
      return (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxDEV)(_widgets_avatar_crop_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
        avatar: this.state.newAvatar,
        mime: this.state.newAvatarMime,
        onSubmit: this.handleAvatarCropped,
        onCancel: this.handleAvatarCropCancel,
        onError: this.props.onError
      }, void 0, false);
    }
    let submitClasses = 'primary';
    if (this.props.disabled) {
      submitClasses += ' disabled';
    }
    return (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxDEV)("form", {
      className: "panel-form-column",
      onSubmit: this.handleSubmit,
      children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxDEV)("div", {
        className: "panel-form-row",
        children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxDEV)("div", {
          className: "umn",
          children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "login_prompt",
            defaultMessage: "Login",
            description: "Placeholer for username/login",
            children: login_prompt => (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxDEV)("input", {
              type: "text",
              placeholder: login_prompt,
              autoComplete: "user-name",
              value: this.state.login,
              onChange: this.handleLoginChange,
              required: true,
              autoFocus: true
            }, void 0, false)
          }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "password_prompt",
            defaultMessage: "Password",
            description: "Placeholder/prompt for entering password",
            children: password_prompt => (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxDEV)(_widgets_visible_password_jsx__WEBPACK_IMPORTED_MODULE_6__["default"], {
              placeholder: password_prompt,
              autoComplete: "new-password",
              value: this.state.password,
              onFinished: this.handlePasswordChange,
              required: true
            }, void 0, false)
          }, void 0, false)]
        }, void 0, true), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxDEV)(_widgets_avatar_upload_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
          tinode: this.props.tinode,
          avatar: this.state.imageUrl,
          onImageUpdated: this.handleImageChanged,
          onError: this.props.onError
        }, void 0, false)]
      }, void 0, true), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxDEV)("div", {
        className: "panel-form-row",
        children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
          id: "full_name_prompt",
          defaultMessage: "Full name, e.g. John Doe",
          description: "Input placeholder for person's full name",
          children: full_name_prompt => (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxDEV)("input", {
            type: "text",
            placeholder: full_name_prompt,
            autoComplete: "name",
            value: this.state.fn,
            onChange: this.handleFnChange,
            required: true
          }, void 0, false)
        }, void 0, false)
      }, void 0, false), this.props.reqCredMethod == 'email' ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxDEV)("div", {
        className: "panel-form-row",
        children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
          id: "email_prompt",
          defaultMessage: "Email, e.g. jdoe@example.com",
          description: "Input placeholder for email entry",
          children: email_prompt => (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxDEV)("input", {
            type: "email",
            placeholder: email_prompt,
            autoComplete: "email",
            value: this.state.email,
            onChange: this.handleEmailChange,
            required: true
          }, void 0, false)
        }, void 0, false)
      }, void 0, false) : this.props.reqCredMethod == 'tel' ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_12__.Fragment, {
        children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxDEV)("div", {
          className: "panel-form-row",
          children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxDEV)("label", {
            className: "small gray",
            children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
              id: "mobile_phone_number",
              defaultMessage: "Mobile phone number",
              description: "Prompt for entering a mobile phone number"
            }, void 0, false)
          }, void 0, false)
        }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxDEV)("div", {
          className: "panel-form-row",
          children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxDEV)(_widgets_phone_edit_jsx__WEBPACK_IMPORTED_MODULE_5__["default"], {
            autoFocus: false,
            onShowCountrySelector: this.props.onShowCountrySelector,
            onSubmit: this.handlePhoneChange
          }, void 0, false)
        }, void 0, false)]
      }, void 0, true) : null, (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxDEV)("div", {
        className: "panel-form-row",
        children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxDEV)(_widgets_checkbox_jsx__WEBPACK_IMPORTED_MODULE_4__["default"], {
          id: "save-token",
          name: "save-token",
          checked: this.state.saveToken,
          onChange: this.handleToggleSaveToken
        }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
          id: "stay_logged_in",
          defaultMessage: "Stay logged in",
          description: "Label for a checkbox",
          children: stay_logged_in => (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxDEV)("label", {
            htmlFor: "save-token",
            children: ["\xA0", stay_logged_in]
          }, void 0, true)
        }, void 0, false)]
      }, void 0, true), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxDEV)("div", {
        className: "dialog-buttons",
        children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxDEV)("button", {
          className: submitClasses,
          type: "submit",
          disabled: this.state.buttonDisabled,
          children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "button_sign_up",
            defaultMessage: "Sign up",
            description: "Create account button [Sign Up]"
          }, void 0, false)
        }, void 0, false)
      }, void 0, false)]
    }, void 0, true);
  }
}
;

/***/ })

}]);
//# sourceMappingURL=src_views_create-account-view_jsx.dev.js.map
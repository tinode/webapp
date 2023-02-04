"use strict";
(globalThis["webpackChunktinode_webapp"] = globalThis["webpackChunktinode_webapp"] || []).push([["src_views_create-account-view_jsx"],{

/***/ "./src/views/create-account-view.jsx":
/*!*******************************************!*\
  !*** ./src/views/create-account-view.jsx ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CreateAccountView)
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
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../config.js */ "./src/config.js");











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
  }
  handleToggleSaveToken() {
    _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_7__["default"].setObject('keep-logged-in', !this.state.saveToken);
    this.setState({
      saveToken: !this.state.saveToken
    });
  }
  handleSubmit(e) {
    e.preventDefault();
    this.props.onCreateAccount(this.state.login.trim(), this.state.password.trim(), (0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_9__.theCard)(this.state.fn.trim().substring(0, _config_js__WEBPACK_IMPORTED_MODULE_10__.MAX_TITLE_LENGTH), this.state.uploadUrl), {
      'meth': this.state.meth,
      'val': this.state.meth == 'email' ? this.state.email : this.state.meth == 'tel' ? this.state.tel : null
    });
  }
  handleAvatarCropped(mime, blob, width, height) {
    const url = blob ? URL.createObjectURL(blob) : null;
    this.setState({
      avatar: url,
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
      if (blob.size > _config_js__WEBPACK_IMPORTED_MODULE_10__.MAX_AVATAR_BYTES) {
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
    if (width > _config_js__WEBPACK_IMPORTED_MODULE_10__.AVATAR_SIZE || height > _config_js__WEBPACK_IMPORTED_MODULE_10__.AVATAR_SIZE || width != height) {
      (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_8__.imageScaled)(blob, _config_js__WEBPACK_IMPORTED_MODULE_10__.AVATAR_SIZE, _config_js__WEBPACK_IMPORTED_MODULE_10__.AVATAR_SIZE, _config_js__WEBPACK_IMPORTED_MODULE_10__.MAX_EXTERN_ATTACHMENT_SIZE, true).then(scaled => readyToUpload(scaled)).catch(err => this.props.onError(err.message, 'err'));
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
      return react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_avatar_crop_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
        avatar: this.state.newAvatar,
        mime: this.state.newAvatarMime,
        onSubmit: this.handleAvatarCropped,
        onCancel: this.handleAvatarCropCancel,
        onError: this.props.onError
      });
    }
    let submitClasses = 'primary';
    if (this.props.disabled) {
      submitClasses += ' disabled';
    }
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("form", {
      className: "panel-form-column",
      onSubmit: this.handleSubmit
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "umn"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "login_prompt",
      defaultMessage: [{
        "type": 0,
        "value": "Login"
      }]
    }, login_prompt => react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", {
      type: "text",
      placeholder: login_prompt,
      autoComplete: "user-name",
      value: this.state.login,
      onChange: this.handleLoginChange,
      required: true,
      autoFocus: true
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "password_prompt",
      defaultMessage: [{
        "type": 0,
        "value": "Password"
      }]
    }, password_prompt => react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_visible_password_jsx__WEBPACK_IMPORTED_MODULE_6__["default"], {
      placeholder: password_prompt,
      autoComplete: "new-password",
      value: this.state.password,
      onFinished: this.handlePasswordChange,
      required: true
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_avatar_upload_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
      tinode: this.props.tinode,
      avatar: this.state.imageUrl,
      onImageUpdated: this.handleImageChanged,
      onError: this.props.onError
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "full_name_prompt",
      defaultMessage: [{
        "type": 0,
        "value": "Full name, e.g. John Doe"
      }]
    }, full_name_prompt => react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", {
      type: "text",
      placeholder: full_name_prompt,
      autoComplete: "name",
      value: this.state.fn,
      onChange: this.handleFnChange,
      required: true
    }))), this.props.reqCredMethod == 'email' ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "email_prompt",
      defaultMessage: [{
        "type": 0,
        "value": "Email, e.g. jdoe@example.com"
      }]
    }, email_prompt => react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", {
      type: "email",
      placeholder: email_prompt,
      autoComplete: "email",
      value: this.state.email,
      onChange: this.handleEmailChange,
      required: true
    }))) : this.props.reqCredMethod == 'tel' ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      className: "small gray"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "mobile_phone_number",
      defaultMessage: [{
        "type": 0,
        "value": "Mobile phone number"
      }]
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_phone_edit_jsx__WEBPACK_IMPORTED_MODULE_5__["default"], {
      autoFocus: false,
      onShowCountrySelector: this.props.onShowCountrySelector,
      onSubmit: this.handlePhoneChange
    }))) : null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_checkbox_jsx__WEBPACK_IMPORTED_MODULE_4__["default"], {
      id: "save-token",
      name: "save-token",
      checked: this.state.saveToken,
      onChange: this.handleToggleSaveToken
    }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "stay_logged_in",
      defaultMessage: [{
        "type": 0,
        "value": "Stay logged in"
      }]
    }, stay_logged_in => react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      htmlFor: "save-token"
    }, "\xA0", stay_logged_in))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "dialog-buttons"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
      className: submitClasses,
      type: "submit",
      disabled: this.state.buttonDisabled
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "button_sign_up",
      defaultMessage: [{
        "type": 0,
        "value": "Sign up"
      }]
    }))));
  }
}
;

/***/ }),

/***/ "./src/widgets/phone-edit.jsx":
/*!************************************!*\
  !*** ./src/widgets/phone-edit.jsx ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var libphonenumber_js_mobile__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! libphonenumber-js/mobile */ "./node_modules/libphonenumber-js/mobile/exports/AsYouType.js");
/* harmony import */ var libphonenumber_js_mobile__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! libphonenumber-js/mobile */ "./node_modules/libphonenumber-js/mobile/exports/parsePhoneNumberWithError.js");
/* harmony import */ var libphonenumber_js_mobile__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! libphonenumber-js/mobile */ "./node_modules/libphonenumber-js/mobile/exports/getExampleNumber.js");
/* harmony import */ var libphonenumber_js_mobile_examples__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! libphonenumber-js/mobile/examples */ "./node_modules/libphonenumber-js/examples.mobile.json.js");
/* harmony import */ var _dcodes_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../dcodes.json */ "./src/dcodes.json");
/* harmony import */ var _lib_strformat__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/strformat */ "./src/lib/strformat.js");






const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_1__.defineMessages)({
  mobile_number_required: {
    id: "mobile_number_required",
    defaultMessage: [{
      "type": 0,
      "value": "Mobile phone number required"
    }]
  }
});
class PhoneEdit extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
    this.codeMap = {};
    _dcodes_json__WEBPACK_IMPORTED_MODULE_2__.forEach(dc => {
      this.codeMap[dc.code] = dc.dial;
    });
    const code = props.countryCode || 'US';
    const dial = this.codeMap[code];
    this.state = {
      countryCode: code,
      dialCode: dial,
      localNumber: '',
      placeholderNumber: this.placeholderNumber(code, dial)
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleFinished = this.handleFinished.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.showCountrySelector = this.showCountrySelector.bind(this);
  }
  handleChange(e) {
    const prefix = `+${this.state.dialCode}`;
    let formatted = new libphonenumber_js_mobile__WEBPACK_IMPORTED_MODULE_4__.AsYouType().input(`${prefix}${this.filterNumber(e.target.value)}`);
    formatted = formatted.substring(prefix.length).trim();
    this.setState({
      localNumber: formatted
    });
  }
  handleFinished(e) {
    e.preventDefault();
    const raw = `${this.state.dialCode}${this.state.localNumber.trim()}`.replace(/[^\d]/g, '');
    let number = null;
    try {
      number = (0,libphonenumber_js_mobile__WEBPACK_IMPORTED_MODULE_5__.parsePhoneNumberWithError)(`+${raw}`);
    } catch (err) {}
    if (!number || !number.isValid()) {
      this.inputField.setCustomValidity(this.props.intl.formatMessage(messages.mobile_number_required));
      return;
    }
    this.inputField.setCustomValidity('');
    this.props.onSubmit(number.format('E.164'));
  }
  handleKeyDown(e) {
    if (e.key === 'Enter') {
      this.handleFinished(e);
    }
  }
  showCountrySelector() {
    this.props.onShowCountrySelector(this.state.countryCode, this.state.dialCode, (code, dial) => {
      this.setState({
        countryCode: code,
        dialCode: dial,
        placeholderNumber: this.placeholderNumber(code, dial)
      });
    });
  }
  filterNumber(number) {
    if (!number) {
      return number;
    }
    return number.replace(/[^-\s().\d]/g, '');
  }
  placeholderNumber(code, dial) {
    const sample = (0,libphonenumber_js_mobile__WEBPACK_IMPORTED_MODULE_6__.getExampleNumber)(code, libphonenumber_js_mobile_examples__WEBPACK_IMPORTED_MODULE_7__["default"]);
    return sample ? sample.formatInternational().substring(dial.length + 1).trim() : '123 0123';
  }
  render() {
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
      className: "dial-code",
      onClick: this.showCountrySelector
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
      className: "country-flag"
    }, (0,_lib_strformat__WEBPACK_IMPORTED_MODULE_3__.flagEmoji)(this.state.countryCode), "\xA0"), "+", this.state.dialCode, "\xA0"), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", {
      type: "tel",
      ref: ref => {
        this.inputField = ref;
      },
      placeholder: this.state.placeholderNumber,
      value: this.state.localNumber,
      onChange: this.handleChange,
      maxLength: 17,
      onKeyDown: this.handleKeyDown,
      onBlur: this.handleFinished,
      required: true,
      autoFocus: this.props.autoFocus
    }));
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(PhoneEdit));

/***/ }),

/***/ "./src/dcodes.json":
/*!*************************!*\
  !*** ./src/dcodes.json ***!
  \*************************/
/***/ ((module) => {

module.exports = JSON.parse('[{"dial":"93","code":"AF"},{"dial":"355","code":"AL"},{"dial":"213","code":"DZ"},{"dial":"1-684","code":"AS"},{"dial":"376","code":"AD"},{"dial":"244","code":"AO"},{"dial":"1-264","code":"AI"},{"dial":"672","code":"AQ"},{"dial":"1-268","code":"AG"},{"dial":"54","code":"AR"},{"dial":"374","code":"AM"},{"dial":"297","code":"AW"},{"dial":"61","code":"AU"},{"dial":"43","code":"AT"},{"dial":"994","code":"AZ"},{"dial":"1-242","code":"BS"},{"dial":"973","code":"BH"},{"dial":"880","code":"BD"},{"dial":"1-246","code":"BB"},{"dial":"375","code":"BY"},{"dial":"32","code":"BE"},{"dial":"501","code":"BZ"},{"dial":"229","code":"BJ"},{"dial":"1-441","code":"BM"},{"dial":"975","code":"BT"},{"dial":"591","code":"BO"},{"dial":"387","code":"BA"},{"dial":"267","code":"BW"},{"dial":"55","code":"BR"},{"dial":"246","code":"IO"},{"dial":"1-284","code":"VG"},{"dial":"673","code":"BN"},{"dial":"359","code":"BG"},{"dial":"226","code":"BF"},{"dial":"257","code":"BI"},{"dial":"855","code":"KH"},{"dial":"237","code":"CM"},{"dial":"1","code":"CA"},{"dial":"238","code":"CV"},{"dial":"1-345","code":"KY"},{"dial":"236","code":"CF"},{"dial":"235","code":"TD"},{"dial":"56","code":"CL"},{"dial":"86","code":"CN"},{"dial":"61","code":"CX"},{"dial":"61","code":"CC"},{"dial":"57","code":"CO"},{"dial":"269","code":"KM"},{"dial":"682","code":"CK"},{"dial":"506","code":"CR"},{"dial":"385","code":"HR"},{"dial":"53","code":"CU"},{"dial":"599","code":"CW"},{"dial":"357","code":"CY"},{"dial":"420","code":"CZ"},{"dial":"243","code":"CD"},{"dial":"45","code":"DK"},{"dial":"253","code":"DJ"},{"dial":"1-767","code":"DM"},{"dial":"1-809, 1-829, 1-849","code":"DO"},{"dial":"670","code":"TL"},{"dial":"593","code":"EC"},{"dial":"20","code":"EG"},{"dial":"503","code":"SV"},{"dial":"240","code":"GQ"},{"dial":"291","code":"ER"},{"dial":"372","code":"EE"},{"dial":"251","code":"ET"},{"dial":"500","code":"FK"},{"dial":"298","code":"FO"},{"dial":"679","code":"FJ"},{"dial":"358","code":"FI"},{"dial":"33","code":"FR"},{"dial":"689","code":"PF"},{"dial":"241","code":"GA"},{"dial":"220","code":"GM"},{"dial":"995","code":"GE"},{"dial":"49","code":"DE"},{"dial":"233","code":"GH"},{"dial":"350","code":"GI"},{"dial":"30","code":"GR"},{"dial":"299","code":"GL"},{"dial":"1-473","code":"GD"},{"dial":"1-671","code":"GU"},{"dial":"502","code":"GT"},{"dial":"44-1481","code":"GG"},{"dial":"224","code":"GN"},{"dial":"245","code":"GW"},{"dial":"592","code":"GY"},{"dial":"509","code":"HT"},{"dial":"504","code":"HN"},{"dial":"852","code":"HK"},{"dial":"36","code":"HU"},{"dial":"354","code":"IS"},{"dial":"91","code":"IN"},{"dial":"62","code":"ID"},{"dial":"98","code":"IR"},{"dial":"964","code":"IQ"},{"dial":"353","code":"IE"},{"dial":"44-1624","code":"IM"},{"dial":"972","code":"IL"},{"dial":"39","code":"IT"},{"dial":"225","code":"CI"},{"dial":"1-876","code":"JM"},{"dial":"81","code":"JP"},{"dial":"44-1534","code":"JE"},{"dial":"962","code":"JO"},{"dial":"7, 997","code":"KZ"},{"dial":"254","code":"KE"},{"dial":"686","code":"KI"},{"dial":"383","code":"XK"},{"dial":"965","code":"KW"},{"dial":"996","code":"KG"},{"dial":"856","code":"LA"},{"dial":"371","code":"LV"},{"dial":"961","code":"LB"},{"dial":"266","code":"LS"},{"dial":"231","code":"LR"},{"dial":"218","code":"LY"},{"dial":"423","code":"LI"},{"dial":"370","code":"LT"},{"dial":"352","code":"LU"},{"dial":"853","code":"MO"},{"dial":"389","code":"MK"},{"dial":"261","code":"MG"},{"dial":"265","code":"MW"},{"dial":"60","code":"MY"},{"dial":"960","code":"MV"},{"dial":"223","code":"ML"},{"dial":"356","code":"MT"},{"dial":"692","code":"MH"},{"dial":"222","code":"MR"},{"dial":"230","code":"MU"},{"dial":"262","code":"YT"},{"dial":"52","code":"MX"},{"dial":"691","code":"FM"},{"dial":"373","code":"MD"},{"dial":"377","code":"MC"},{"dial":"976","code":"MN"},{"dial":"382","code":"ME"},{"dial":"1-664","code":"MS"},{"dial":"212","code":"MA"},{"dial":"258","code":"MZ"},{"dial":"95","code":"MM"},{"dial":"264","code":"NA"},{"dial":"674","code":"NR"},{"dial":"977","code":"NP"},{"dial":"31","code":"NL"},{"dial":"599","code":"CW"},{"dial":"687","code":"NC"},{"dial":"64","code":"NZ"},{"dial":"505","code":"NI"},{"dial":"227","code":"NE"},{"dial":"234","code":"NG"},{"dial":"683","code":"NU"},{"dial":"850","code":"KP"},{"dial":"1-670","code":"MP"},{"dial":"47","code":"NO"},{"dial":"968","code":"OM"},{"dial":"92","code":"PK"},{"dial":"680","code":"PW"},{"dial":"970","code":"PS"},{"dial":"507","code":"PA"},{"dial":"675","code":"PG"},{"dial":"595","code":"PY"},{"dial":"51","code":"PE"},{"dial":"63","code":"PH"},{"dial":"64","code":"PN"},{"dial":"48","code":"PL"},{"dial":"351","code":"PT"},{"dial":"1-787, 1-939","code":"PR"},{"dial":"974","code":"QA"},{"dial":"242","code":"CG"},{"dial":"262","code":"RE"},{"dial":"40","code":"RO"},{"dial":"7","code":"RU"},{"dial":"250","code":"RW"},{"dial":"590","code":"BL"},{"dial":"290","code":"SH"},{"dial":"1-869","code":"KN"},{"dial":"1-758","code":"LC"},{"dial":"590","code":"MF"},{"dial":"508","code":"PM"},{"dial":"1-784","code":"VC"},{"dial":"685","code":"WS"},{"dial":"378","code":"SM"},{"dial":"239","code":"ST"},{"dial":"966","code":"SA"},{"dial":"221","code":"SN"},{"dial":"381","code":"RS"},{"dial":"248","code":"SC"},{"dial":"232","code":"SL"},{"dial":"65","code":"SG"},{"dial":"1-721","code":"SX"},{"dial":"421","code":"SK"},{"dial":"386","code":"SI"},{"dial":"677","code":"SB"},{"dial":"252","code":"SO"},{"dial":"27","code":"ZA"},{"dial":"82","code":"KR"},{"dial":"211","code":"SS"},{"dial":"34","code":"ES"},{"dial":"94","code":"LK"},{"dial":"249","code":"SD"},{"dial":"597","code":"SR"},{"dial":"47","code":"SJ"},{"dial":"268","code":"SZ"},{"dial":"46","code":"SE"},{"dial":"41","code":"CH"},{"dial":"963","code":"SY"},{"dial":"886","code":"TW"},{"dial":"992","code":"TJ"},{"dial":"255","code":"TZ"},{"dial":"66","code":"TH"},{"dial":"228","code":"TG"},{"dial":"690","code":"TK"},{"dial":"676","code":"TO"},{"dial":"1-868","code":"TT"},{"dial":"216","code":"TN"},{"dial":"90","code":"TR"},{"dial":"993","code":"TM"},{"dial":"1-649","code":"TC"},{"dial":"688","code":"TV"},{"dial":"1-340","code":"VI"},{"dial":"256","code":"UG"},{"dial":"380","code":"UA"},{"dial":"971","code":"AE"},{"dial":"44","code":"GB"},{"dial":"1","code":"US"},{"dial":"598","code":"UY"},{"dial":"998","code":"UZ"},{"dial":"678","code":"VU"},{"dial":"379","code":"VA"},{"dial":"58","code":"VE"},{"dial":"84","code":"VN"},{"dial":"681","code":"WF"},{"dial":"212","code":"EH"},{"dial":"967","code":"YE"},{"dial":"260","code":"ZM"},{"dial":"263","code":"ZW"}]');

/***/ })

}]);
//# sourceMappingURL=src_views_create-account-view_jsx.dev.js.map
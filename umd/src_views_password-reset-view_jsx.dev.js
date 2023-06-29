"use strict";
(globalThis["webpackChunktinode_webapp"] = globalThis["webpackChunktinode_webapp"] || []).push([["src_views_password-reset-view_jsx"],{

/***/ "./src/views/password-reset-view.jsx":
/*!*******************************************!*\
  !*** ./src/views/password-reset-view.jsx ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _widgets_phone_edit_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../widgets/phone-edit.jsx */ "./src/widgets/phone-edit.jsx");
/* harmony import */ var _widgets_visible_password_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../widgets/visible-password.jsx */ "./src/widgets/visible-password.jsx");
/* harmony import */ var _lib_navigation_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../lib/navigation.js */ "./src/lib/navigation.js");





const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_1__.defineMessages)({
  password_reset_email_sent: {
    id: "password_reset_email_sent",
    defaultMessage: [{
      "type": 0,
      "value": "An email with security code has been sent."
    }]
  },
  password_reset_sms_sent: {
    id: "password_reset_sms_sent",
    defaultMessage: [{
      "type": 0,
      "value": "A text message with security code has been sent."
    }]
  }
});
class PasswordResetView extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
    this.state = {
      tel: '',
      email: '',
      password: '',
      sent: false,
      haveCode: false,
      code: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleCodeChange = this.handleCodeChange.bind(this);
    this.handleShowCodeField = this.handleShowCodeField.bind(this);
    props.tinode.connect().catch(err => {
      this.props.onError(err.message, 'err');
    });
  }
  componentDidMount() {
    const parsed = _lib_navigation_js__WEBPACK_IMPORTED_MODULE_4__["default"].parseUrlHash(window.location.hash);
    const newState = {
      token: parsed.params.token,
      scheme: parsed.params.scheme,
      code: parsed.params.code || ''
    };
    this.savedCred = parsed.params.cred;
    if (this.props.reqCredMethod && parsed.params.cred) {
      newState[this.props.reqCredMethod] = this.savedCred;
    }
    this.setState(newState);
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.reqCredMethod != this.props.reqCredMethod && this.props.reqCredMethod) {
      this.setState({
        [this.props.reqCredMethod]: this.savedCred || ''
      });
    }
  }
  handleSubmit(e) {
    e.preventDefault();
    if (this.state.token) {
      this.props.onReset(this.state.password.trim(), {
        scheme: 'token',
        secret: this.state.token
      });
    } else if (this.state.code && this.props.reqCredMethod) {
      const cred = this.props.reqCredMethod == 'email' ? this.state.email.trim() : this.state.tel.trim();
      this.props.onReset(this.state.password.trim(), {
        scheme: 'code',
        secret: btoa(`${this.state.code}:${this.props.reqCredMethod}:${cred}`)
      });
    } else {
      const email = this.state.email.trim();
      const tel = this.state.tel.trim();
      this.setState({
        email: email,
        tel: tel
      });
      this.props.onRequest(this.props.reqCredMethod, email || tel).then(_ => {
        this.setState({
          sent: true
        });
        const msg = this.props.reqCredMethod == 'email' ? messages.password_reset_email_sent : this.props.reqCredMethod == 'tel' ? messages.password_reset_sms_sent : null;
        if (msg) {
          this.props.onError(this.props.intl.formatMessage(msg), 'info');
        }
      });
    }
  }
  handleEmailChange(e) {
    this.setState({
      email: e.target.value
    });
  }
  handlePasswordChange(e) {
    this.setState({
      password: e.target.value
    });
  }
  handleCodeChange(e) {
    this.setState({
      code: e.target.value.replace(/[^\d]/g, '')
    });
  }
  handleShowCodeField(e) {
    e.preventDefault();
    this.setState({
      haveCode: true
    });
  }
  render() {
    const showCredentialInput = !((this.state.token || this.state.code && this.props.reqCredMethod) && this.state.scheme);
    const showPasswordInput = !showCredentialInput || this.state.haveCode || this.state.sent;
    const passwordInput = react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      className: "small gray",
      htmlFor: "new-password"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_new_password",
      defaultMessage: [{
        "type": 0,
        "value": "New password"
      }]
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "new_password_placeholder",
      defaultMessage: [{
        "type": 0,
        "value": "Enter new password"
      }]
    }, placeholder => react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_visible_password_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
      id: "new-password",
      placeholder: placeholder,
      autoComplete: "new-password",
      value: this.state.password,
      required: true,
      autoFocus: true,
      onChange: this.handlePasswordChange
    })));
    const emailInput = react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, this.state.haveCode ? null : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      htmlFor: "inputEmail"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_reset_password",
      defaultMessage: [{
        "type": 0,
        "value": "Send a password reset email"
      }]
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "credential_email_prompt",
      defaultMessage: [{
        "type": 0,
        "value": "Your registration email"
      }]
    }, placeholder => react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", {
      type: "email",
      id: "inputEmail",
      placeholder: placeholder,
      autoComplete: "email",
      value: this.state.email,
      onChange: this.handleEmailChange,
      required: true,
      autoFocus: true
    })));
    const phoneInput = react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, this.state.haveCode ? null : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_reset_password_tel",
      defaultMessage: [{
        "type": 0,
        "value": "Send SMS to reset password"
      }]
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      className: "small gray"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "mobile_phone_number",
      defaultMessage: [{
        "type": 0,
        "value": "Mobile phone number"
      }]
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_phone_edit_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
      autoFocus: true,
      onShowCountrySelector: this.props.onShowCountrySelector,
      onSubmit: number => this.setState({
        tel: number
      })
    })));
    const codeInput = react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      className: "small gray",
      htmlFor: "enter-confirmation-code"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "enter_confirmation_code_prompt",
      defaultMessage: [{
        "type": 0,
        "value": "Confirmation code"
      }]
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "numeric_confirmation_code_prompt",
      defaultMessage: [{
        "type": 0,
        "value": "Numbers only"
      }]
    }, numbers_only => react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", {
      type: "text",
      id: "enter-confirmation-code",
      placeholder: numbers_only,
      maxLength: 10,
      value: this.state.code,
      onChange: this.handleCodeChange,
      required: true
    }))));
    const credentialInput = this.props.reqCredMethod == 'email' ? emailInput : this.props.reqCredMethod == 'tel' ? phoneInput : null;
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("form", {
      id: "password-reset-form",
      onSubmit: this.handleSubmit
    }, !this.state.sent && showCredentialInput ? credentialInput : null, this.state.haveCode || this.state.sent ? codeInput : null, showPasswordInput ? passwordInput : null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "dialog-buttons"
    }, this.state.haveCode || this.state.sent || this.state.token || this.state.code ? null : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      onClick: this.handleShowCodeField,
      style: {
        marginRight: 'auto'
      }
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "password_i_have_code",
      defaultMessage: [{
        "type": 0,
        "value": "I have code"
      }]
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
      className: "primary",
      type: "submit"
    }, showPasswordInput ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "button_reset",
      defaultMessage: [{
        "type": 0,
        "value": "Reset"
      }]
    }) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "button_send_request",
      defaultMessage: [{
        "type": 0,
        "value": "Send request"
      }]
    }))));
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(PasswordResetView));

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
//# sourceMappingURL=src_views_password-reset-view_jsx.dev.js.map
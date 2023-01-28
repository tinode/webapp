"use strict";
(globalThis["webpackChunktinode_webapp"] = globalThis["webpackChunktinode_webapp"] || []).push([["src_widgets_phone-country-selector_jsx"],{

/***/ "./src/widgets/phone-country-selector.jsx":
/*!************************************************!*\
  !*** ./src/widgets/phone-country-selector.jsx ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _dcodes_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../dcodes.json */ "./src/dcodes.json");
/* harmony import */ var _lib_strformat__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/strformat */ "./src/lib/strformat.js");




class PhoneCountrySelector extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
    this.countries = [];
    const {
      formatDisplayName
    } = props.intl;
    _dcodes_json__WEBPACK_IMPORTED_MODULE_2__.forEach(dc => {
      const parts = dc.dial.split(',');
      parts.forEach(part => {
        this.countries.push({
          dial: part.trim(),
          code: dc.code,
          flag: (0,_lib_strformat__WEBPACK_IMPORTED_MODULE_3__.flagEmoji)(dc.code),
          name: formatDisplayName(dc.code, {
            type: 'region'
          })
        });
      });
    });
    this.countries.sort((a, b) => a.name.localeCompare(b.name));
  }
  componentDidMount() {
    if (this.selectedRef) {
      this.selectedRef.scrollIntoView({
        block: 'center',
        inline: 'nearest'
      });
    }
  }
  render() {
    const countries = [];
    const selected = this.props.selected || 'US';
    this.countries.forEach((c, idx) => {
      const style = c.code == selected ? 'selected ' : '';
      countries.push(react__WEBPACK_IMPORTED_MODULE_0___default().createElement("li", {
        className: style,
        key: idx,
        ref: ref => {
          if (c.code == selected) {
            this.selectedRef = ref;
          }
        },
        onClick: _ => this.props.onSubmit(c.code, c.dial)
      }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
        className: "country-flag"
      }, c.flag), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
        className: "country"
      }, "\xA0", c.name), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
        className: "dial-code"
      }, "\xA0+", c.dial)));
    });
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "scrollable-panel",
      style: {
        height: '30rem'
      }
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("ul", {
      className: "phone-country-selector"
    }, countries));
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(PhoneCountrySelector));

/***/ })

}]);
//# sourceMappingURL=src_widgets_phone-country-selector_jsx.dev.js.map
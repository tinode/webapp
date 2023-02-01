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

/***/ }),

/***/ "./src/dcodes.json":
/*!*************************!*\
  !*** ./src/dcodes.json ***!
  \*************************/
/***/ ((module) => {

module.exports = JSON.parse('[{"dial":"93","code":"AF"},{"dial":"355","code":"AL"},{"dial":"213","code":"DZ"},{"dial":"1-684","code":"AS"},{"dial":"376","code":"AD"},{"dial":"244","code":"AO"},{"dial":"1-264","code":"AI"},{"dial":"672","code":"AQ"},{"dial":"1-268","code":"AG"},{"dial":"54","code":"AR"},{"dial":"374","code":"AM"},{"dial":"297","code":"AW"},{"dial":"61","code":"AU"},{"dial":"43","code":"AT"},{"dial":"994","code":"AZ"},{"dial":"1-242","code":"BS"},{"dial":"973","code":"BH"},{"dial":"880","code":"BD"},{"dial":"1-246","code":"BB"},{"dial":"375","code":"BY"},{"dial":"32","code":"BE"},{"dial":"501","code":"BZ"},{"dial":"229","code":"BJ"},{"dial":"1-441","code":"BM"},{"dial":"975","code":"BT"},{"dial":"591","code":"BO"},{"dial":"387","code":"BA"},{"dial":"267","code":"BW"},{"dial":"55","code":"BR"},{"dial":"246","code":"IO"},{"dial":"1-284","code":"VG"},{"dial":"673","code":"BN"},{"dial":"359","code":"BG"},{"dial":"226","code":"BF"},{"dial":"257","code":"BI"},{"dial":"855","code":"KH"},{"dial":"237","code":"CM"},{"dial":"1","code":"CA"},{"dial":"238","code":"CV"},{"dial":"1-345","code":"KY"},{"dial":"236","code":"CF"},{"dial":"235","code":"TD"},{"dial":"56","code":"CL"},{"dial":"86","code":"CN"},{"dial":"61","code":"CX"},{"dial":"61","code":"CC"},{"dial":"57","code":"CO"},{"dial":"269","code":"KM"},{"dial":"682","code":"CK"},{"dial":"506","code":"CR"},{"dial":"385","code":"HR"},{"dial":"53","code":"CU"},{"dial":"599","code":"CW"},{"dial":"357","code":"CY"},{"dial":"420","code":"CZ"},{"dial":"243","code":"CD"},{"dial":"45","code":"DK"},{"dial":"253","code":"DJ"},{"dial":"1-767","code":"DM"},{"dial":"1-809, 1-829, 1-849","code":"DO"},{"dial":"670","code":"TL"},{"dial":"593","code":"EC"},{"dial":"20","code":"EG"},{"dial":"503","code":"SV"},{"dial":"240","code":"GQ"},{"dial":"291","code":"ER"},{"dial":"372","code":"EE"},{"dial":"251","code":"ET"},{"dial":"500","code":"FK"},{"dial":"298","code":"FO"},{"dial":"679","code":"FJ"},{"dial":"358","code":"FI"},{"dial":"33","code":"FR"},{"dial":"689","code":"PF"},{"dial":"241","code":"GA"},{"dial":"220","code":"GM"},{"dial":"995","code":"GE"},{"dial":"49","code":"DE"},{"dial":"233","code":"GH"},{"dial":"350","code":"GI"},{"dial":"30","code":"GR"},{"dial":"299","code":"GL"},{"dial":"1-473","code":"GD"},{"dial":"1-671","code":"GU"},{"dial":"502","code":"GT"},{"dial":"44-1481","code":"GG"},{"dial":"224","code":"GN"},{"dial":"245","code":"GW"},{"dial":"592","code":"GY"},{"dial":"509","code":"HT"},{"dial":"504","code":"HN"},{"dial":"852","code":"HK"},{"dial":"36","code":"HU"},{"dial":"354","code":"IS"},{"dial":"91","code":"IN"},{"dial":"62","code":"ID"},{"dial":"98","code":"IR"},{"dial":"964","code":"IQ"},{"dial":"353","code":"IE"},{"dial":"44-1624","code":"IM"},{"dial":"972","code":"IL"},{"dial":"39","code":"IT"},{"dial":"225","code":"CI"},{"dial":"1-876","code":"JM"},{"dial":"81","code":"JP"},{"dial":"44-1534","code":"JE"},{"dial":"962","code":"JO"},{"dial":"7, 997","code":"KZ"},{"dial":"254","code":"KE"},{"dial":"686","code":"KI"},{"dial":"383","code":"XK"},{"dial":"965","code":"KW"},{"dial":"996","code":"KG"},{"dial":"856","code":"LA"},{"dial":"371","code":"LV"},{"dial":"961","code":"LB"},{"dial":"266","code":"LS"},{"dial":"231","code":"LR"},{"dial":"218","code":"LY"},{"dial":"423","code":"LI"},{"dial":"370","code":"LT"},{"dial":"352","code":"LU"},{"dial":"853","code":"MO"},{"dial":"389","code":"MK"},{"dial":"261","code":"MG"},{"dial":"265","code":"MW"},{"dial":"60","code":"MY"},{"dial":"960","code":"MV"},{"dial":"223","code":"ML"},{"dial":"356","code":"MT"},{"dial":"692","code":"MH"},{"dial":"222","code":"MR"},{"dial":"230","code":"MU"},{"dial":"262","code":"YT"},{"dial":"52","code":"MX"},{"dial":"691","code":"FM"},{"dial":"373","code":"MD"},{"dial":"377","code":"MC"},{"dial":"976","code":"MN"},{"dial":"382","code":"ME"},{"dial":"1-664","code":"MS"},{"dial":"212","code":"MA"},{"dial":"258","code":"MZ"},{"dial":"95","code":"MM"},{"dial":"264","code":"NA"},{"dial":"674","code":"NR"},{"dial":"977","code":"NP"},{"dial":"31","code":"NL"},{"dial":"599","code":"CW"},{"dial":"687","code":"NC"},{"dial":"64","code":"NZ"},{"dial":"505","code":"NI"},{"dial":"227","code":"NE"},{"dial":"234","code":"NG"},{"dial":"683","code":"NU"},{"dial":"850","code":"KP"},{"dial":"1-670","code":"MP"},{"dial":"47","code":"NO"},{"dial":"968","code":"OM"},{"dial":"92","code":"PK"},{"dial":"680","code":"PW"},{"dial":"970","code":"PS"},{"dial":"507","code":"PA"},{"dial":"675","code":"PG"},{"dial":"595","code":"PY"},{"dial":"51","code":"PE"},{"dial":"63","code":"PH"},{"dial":"64","code":"PN"},{"dial":"48","code":"PL"},{"dial":"351","code":"PT"},{"dial":"1-787, 1-939","code":"PR"},{"dial":"974","code":"QA"},{"dial":"242","code":"CG"},{"dial":"262","code":"RE"},{"dial":"40","code":"RO"},{"dial":"7","code":"RU"},{"dial":"250","code":"RW"},{"dial":"590","code":"BL"},{"dial":"290","code":"SH"},{"dial":"1-869","code":"KN"},{"dial":"1-758","code":"LC"},{"dial":"590","code":"MF"},{"dial":"508","code":"PM"},{"dial":"1-784","code":"VC"},{"dial":"685","code":"WS"},{"dial":"378","code":"SM"},{"dial":"239","code":"ST"},{"dial":"966","code":"SA"},{"dial":"221","code":"SN"},{"dial":"381","code":"RS"},{"dial":"248","code":"SC"},{"dial":"232","code":"SL"},{"dial":"65","code":"SG"},{"dial":"1-721","code":"SX"},{"dial":"421","code":"SK"},{"dial":"386","code":"SI"},{"dial":"677","code":"SB"},{"dial":"252","code":"SO"},{"dial":"27","code":"ZA"},{"dial":"82","code":"KR"},{"dial":"211","code":"SS"},{"dial":"34","code":"ES"},{"dial":"94","code":"LK"},{"dial":"249","code":"SD"},{"dial":"597","code":"SR"},{"dial":"47","code":"SJ"},{"dial":"268","code":"SZ"},{"dial":"46","code":"SE"},{"dial":"41","code":"CH"},{"dial":"963","code":"SY"},{"dial":"886","code":"TW"},{"dial":"992","code":"TJ"},{"dial":"255","code":"TZ"},{"dial":"66","code":"TH"},{"dial":"228","code":"TG"},{"dial":"690","code":"TK"},{"dial":"676","code":"TO"},{"dial":"1-868","code":"TT"},{"dial":"216","code":"TN"},{"dial":"90","code":"TR"},{"dial":"993","code":"TM"},{"dial":"1-649","code":"TC"},{"dial":"688","code":"TV"},{"dial":"1-340","code":"VI"},{"dial":"256","code":"UG"},{"dial":"380","code":"UA"},{"dial":"971","code":"AE"},{"dial":"44","code":"GB"},{"dial":"1","code":"US"},{"dial":"598","code":"UY"},{"dial":"998","code":"UZ"},{"dial":"678","code":"VU"},{"dial":"379","code":"VA"},{"dial":"58","code":"VE"},{"dial":"84","code":"VN"},{"dial":"681","code":"WF"},{"dial":"212","code":"EH"},{"dial":"967","code":"YE"},{"dial":"260","code":"ZM"},{"dial":"263","code":"ZW"}]');

/***/ })

}]);
//# sourceMappingURL=src_widgets_phone-country-selector_jsx.dev.js.map
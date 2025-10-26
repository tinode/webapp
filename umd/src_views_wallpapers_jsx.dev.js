"use strict";
(self["webpackChunktinode_webapp"] = self["webpackChunktinode_webapp"] || []).push([["src_views_wallpapers_jsx"],{

/***/ "./src/views/wallpapers.jsx":
/*!**********************************!*\
  !*** ./src/views/wallpapers.jsx ***!
  \**********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ WallpapersView; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _lib_navigation_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/navigation.js */ "./src/lib/navigation.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var _img_bkg_index_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../img/bkg/index.json */ "./img/bkg/index.json");





class WallpapersView extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
    this.state = {
      tab: _config_js__WEBPACK_IMPORTED_MODULE_3__.WALLPAPER_DEFAULTS.type,
      selectedType: _config_js__WEBPACK_IMPORTED_MODULE_3__.WALLPAPER_DEFAULTS.type,
      wallpaper: _img_bkg_index_json__WEBPACK_IMPORTED_MODULE_4__[_config_js__WEBPACK_IMPORTED_MODULE_3__.WALLPAPER_DEFAULTS.type][_config_js__WEBPACK_IMPORTED_MODULE_3__.WALLPAPER_DEFAULTS.index].name,
      blur: 0
    };
    this.blurValues = [0, 1, 2, 4, 8, 16];
    this.handleTabClick = this.handleTabClick.bind(this);
    this.handleWallpaperSelected = this.handleWallpaperSelected.bind(this);
    this.handleBlurChanged = this.handleBlurChanged.bind(this);
  }
  handleTabClick(e) {
    e.preventDefault();
    _lib_navigation_js__WEBPACK_IMPORTED_MODULE_2__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_2__["default"].addUrlParam(window.location.hash, 'tab', e.currentTarget.dataset.id));
    this.setState({
      tab: e.currentTarget.dataset.id
    });
  }
  handleWallpaperSelected(e) {
    let index, type, blur;
    if (!e) {
      type = _config_js__WEBPACK_IMPORTED_MODULE_3__.WALLPAPER_DEFAULTS.type;
      index = _config_js__WEBPACK_IMPORTED_MODULE_3__.WALLPAPER_DEFAULTS.index;
      blur = 0;
    } else {
      e.preventDefault();
      type = this.state.tab;
      index = e.currentTarget.dataset.id;
      blur = type == 'patt' ? 0 : this.state.blur;
    }
    const fname = _img_bkg_index_json__WEBPACK_IMPORTED_MODULE_4__[type][index].name;
    const size = type == 'patt' ? _img_bkg_index_json__WEBPACK_IMPORTED_MODULE_4__[type][index].size : 0;
    this.setState({
      tab: type,
      wallpaper: fname,
      selectedType: type,
      blur: blur
    });
    this.props.onWallpaperSelected(`../${_config_js__WEBPACK_IMPORTED_MODULE_3__.WALLPAPER_DEFAULTS.path}${fname}`, size, this.blurValues[blur]);
  }
  handleBlurChanged(e) {
    e.preventDefault();
    const blur = e.currentTarget.value;
    this.setState({
      blur: blur
    });
    if (this.state.selectedType == 'img') {
      this.props.onWallpaperSelected(`../${_config_js__WEBPACK_IMPORTED_MODULE_3__.WALLPAPER_DEFAULTS.path}${this.state.wallpaper}`, 0, this.blurValues[blur]);
    }
  }
  render() {
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "flex-column"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row clean-clickable"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      className: "flat-button",
      onClick: () => this.handleWallpaperSelected(null)
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "undo"), "\xA0", react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "button_restore",
      defaultMessage: [{
        "type": 0,
        "value": "Restore default"
      }]
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("ul", {
      className: "tabbar"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("li", {
      className: this.state.tab === 'patt' ? 'active' : null
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      "data-id": "patt",
      onClick: this.handleTabClick
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "tabtitle_pattern",
      defaultMessage: [{
        "type": 0,
        "value": "pattern"
      }]
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("li", {
      className: this.state.tab === 'img' ? 'active' : null
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      "data-id": "img",
      onClick: this.handleTabClick
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "tabtitle_image",
      defaultMessage: [{
        "type": 0,
        "value": "image"
      }]
    })))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "settings-form",
      className: "scrollable-panel"
    }, this.state.tab === 'patt' ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "image-grid"
    }, _img_bkg_index_json__WEBPACK_IMPORTED_MODULE_4__.patt.map((img, idx) => {
      const selected = this.state.wallpaper === img.name ? ' selected' : '';
      const dark = this.props.colorSchema == 'dark' ? 'inverted' : null;
      return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        key: idx,
        "data-id": idx,
        className: `image-grid-cell${selected}`,
        onClick: this.handleWallpaperSelected
      }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("img", {
        src: _config_js__WEBPACK_IMPORTED_MODULE_3__.WALLPAPER_DEFAULTS.path + img.name,
        alt: img.name,
        className: dark,
        style: {
          width: `${img.size}px`,
          height: `${img.size}px`
        }
      }));
    })) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-column"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      className: "small"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_blur_wallpaper",
      defaultMessage: [{
        "type": 0,
        "value": "Blur:"
      }]
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", {
      type: "range",
      id: "blur",
      name: "blur",
      min: "0",
      max: "5",
      step: "1",
      value: this.state.blur,
      onChange: this.handleBlurChanged
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "image-grid"
    }, _img_bkg_index_json__WEBPACK_IMPORTED_MODULE_4__.img.map((img, idx) => {
      const selected = this.state.wallpaper === img.name ? ' selected' : '';
      return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        key: idx,
        "data-id": idx,
        className: `image-grid-cell${selected}`,
        onClick: this.handleWallpaperSelected
      }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("img", {
        src: _config_js__WEBPACK_IMPORTED_MODULE_3__.WALLPAPER_DEFAULTS.path + img.pr,
        alt: img.name,
        style: {
          width: '100%',
          height: '100%'
        }
      }));
    })))));
  }
}

/***/ })

}]);
//# sourceMappingURL=src_views_wallpapers_jsx.dev.js.map
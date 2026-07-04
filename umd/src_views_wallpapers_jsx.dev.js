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
/* harmony import */ var _lib_utils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../lib/utils.js */ "./src/lib/utils.js");
/* harmony import */ var _img_bkg_index_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../img/bkg/index.json */ "./img/bkg/index.json");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");







class WallpapersView extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
    const type = (0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_4__.wallpaperTypeFromUrl)(this.props.wallpaper);
    const name = (0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_4__.wallpaperNameFromUrl)(this.props.wallpaper);
    this.state = {
      tab: type || _config_js__WEBPACK_IMPORTED_MODULE_3__.WALLPAPER_DEFAULTS.type,
      selectedType: type || _config_js__WEBPACK_IMPORTED_MODULE_3__.WALLPAPER_DEFAULTS.type,
      wallpaper: name || _img_bkg_index_json__WEBPACK_IMPORTED_MODULE_5__[_config_js__WEBPACK_IMPORTED_MODULE_3__.WALLPAPER_DEFAULTS.type][_config_js__WEBPACK_IMPORTED_MODULE_3__.WALLPAPER_DEFAULTS.index].name,
      blur: this.props.wallpaperBlur | 0
    };
    this.blurValues = [0, 1, 2, 4, 8, 16];
    this.handleTabClick = this.handleTabClick.bind(this);
    this.handleWallpaperSelected = this.handleWallpaperSelected.bind(this);
    this.handleBlurChanged = this.handleBlurChanged.bind(this);
    this.hasChanged = this.hasChanged.bind(this);
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
      if (!this.hasChanged()) {
        return;
      }
      type = _config_js__WEBPACK_IMPORTED_MODULE_3__.WALLPAPER_DEFAULTS.type;
      index = _config_js__WEBPACK_IMPORTED_MODULE_3__.WALLPAPER_DEFAULTS.index;
      blur = 0;
    } else {
      e.preventDefault();
      type = this.state.tab;
      index = e.currentTarget.dataset.id;
      blur = type == 'patt' ? 0 : this.state.blur;
    }
    const fname = _img_bkg_index_json__WEBPACK_IMPORTED_MODULE_5__[type][index].name;
    const size = type == 'patt' ? _img_bkg_index_json__WEBPACK_IMPORTED_MODULE_5__[type][index].size : 0;
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
  hasChanged() {
    return this.state.selectedType != _config_js__WEBPACK_IMPORTED_MODULE_3__.WALLPAPER_DEFAULTS.type || this.state.wallpaper != _img_bkg_index_json__WEBPACK_IMPORTED_MODULE_5__[_config_js__WEBPACK_IMPORTED_MODULE_3__.WALLPAPER_DEFAULTS.type][_config_js__WEBPACK_IMPORTED_MODULE_3__.WALLPAPER_DEFAULTS.index].name || this.state.blur != 0;
  }
  render() {
    return (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxDEV)("div", {
      className: "flex-column",
      children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxDEV)("div", {
        className: `panel-form-row${this.hasChanged() ? ' clean-clickable' : ''}`,
        children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxDEV)("a", {
          className: `flat-button${this.hasChanged() ? '' : ' disabled'}`,
          onClick: () => this.handleWallpaperSelected(null),
          children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxDEV)("i", {
            className: "material-icons",
            children: "undo"
          }, void 0, false), "\xA0", (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "button_restore",
            defaultMessage: "Restore default",
            description: "Reset setting to default"
          }, void 0, false)]
        }, void 0, true)
      }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxDEV)("ul", {
        className: "tabbar",
        children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxDEV)("li", {
          className: this.state.tab === 'patt' ? 'active' : null,
          children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxDEV)("a", {
            href: "#",
            "data-id": "patt",
            onClick: this.handleTabClick,
            children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
              id: "tabtitle_pattern",
              defaultMessage: "pattern",
              description: "Tab title Pattern"
            }, void 0, false)
          }, void 0, false)
        }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxDEV)("li", {
          className: this.state.tab === 'img' ? 'active' : null,
          children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxDEV)("a", {
            href: "#",
            "data-id": "img",
            onClick: this.handleTabClick,
            children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
              id: "tabtitle_image",
              defaultMessage: "image",
              description: "Tab title Image"
            }, void 0, false)
          }, void 0, false)
        }, void 0, false)]
      }, void 0, true), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxDEV)("div", {
        id: "settings-form",
        className: "scrollable-panel",
        children: this.state.tab === 'patt' ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxDEV)("div", {
          className: "image-grid",
          children: _img_bkg_index_json__WEBPACK_IMPORTED_MODULE_5__.patt.map((img, idx) => {
            const selected = this.state.wallpaper === img.name ? ' selected' : '';
            const dark = this.props.colorSchema == 'dark' ? 'inverted' : null;
            return (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxDEV)("div", {
              "data-id": idx,
              className: `image-grid-cell${selected}`,
              onClick: this.handleWallpaperSelected,
              children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxDEV)("img", {
                src: _config_js__WEBPACK_IMPORTED_MODULE_3__.WALLPAPER_DEFAULTS.path + img.name,
                alt: img.name,
                className: dark,
                style: {
                  width: `${img.size}px`,
                  height: `${img.size}px`
                }
              }, void 0, false)
            }, idx, false);
          })
        }, void 0, false) : (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__.Fragment, {
          children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxDEV)("div", {
            className: "panel-form-column",
            children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxDEV)("div", {
              className: "panel-form-row",
              children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxDEV)("label", {
                className: "small",
                children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
                  id: "label_blur_wallpaper",
                  defaultMessage: "Blur:",
                  description: "Label adjusting blur amount"
                }, void 0, false)
              }, void 0, false)
            }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxDEV)("div", {
              className: "panel-form-row",
              children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxDEV)("input", {
                type: "range",
                id: "blur",
                name: "blur",
                min: "0",
                max: "5",
                step: "1",
                value: this.state.blur,
                onChange: this.handleBlurChanged
              }, void 0, false)
            }, void 0, false)]
          }, void 0, true), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxDEV)("div", {
            className: "image-grid",
            children: _img_bkg_index_json__WEBPACK_IMPORTED_MODULE_5__.img.map((img, idx) => {
              const selected = this.state.wallpaper === img.name ? ' selected' : '';
              return (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxDEV)("div", {
                "data-id": idx,
                className: `image-grid-cell${selected}`,
                onClick: this.handleWallpaperSelected,
                children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxDEV)("img", {
                  src: _config_js__WEBPACK_IMPORTED_MODULE_3__.WALLPAPER_DEFAULTS.path + img.pr,
                  alt: img.name,
                  style: {
                    width: '100%',
                    height: '100%'
                  }
                }, void 0, false)
              }, idx, false);
            })
          }, void 0, false)]
        }, void 0, true)
      }, void 0, false)]
    }, void 0, true);
  }
}

/***/ })

}]);
//# sourceMappingURL=src_views_wallpapers_jsx.dev.js.map
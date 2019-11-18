/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/umd/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/config.js":
/*!***********************!*\
  !*** ./src/config.js ***!
  \***********************/
/*! exports provided: APP_NAME, API_KEY, KNOWN_HOSTS, DEFAULT_HOST, LOGGING_ENABLED, KEYPRESS_DELAY, RECEIVED_DELAY, READ_DELAY, MIN_TAG_LENGTH, DEFAULT_P2P_ACCESS_MODE, NEW_GRP_ACCESS_MODE, NO_ACCESS_MODE, MEDIA_BREAKPOINT, REM_SIZE, AVATAR_SIZE, BROKEN_IMAGE_SIZE, MESSAGES_PAGE, MAX_INBAND_ATTACHMENT_SIZE, MAX_EXTERN_ATTACHMENT_SIZE, MAX_IMAGE_DIM, MAX_ONLINE_IN_TOPIC, MAX_TITLE_LENGTH, LINK_CONTACT_US, LINK_PRIVACY_POLICY, LINK_TERMS_OF_SERVICE */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "APP_NAME", function() { return APP_NAME; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "API_KEY", function() { return API_KEY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KNOWN_HOSTS", function() { return KNOWN_HOSTS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DEFAULT_HOST", function() { return DEFAULT_HOST; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LOGGING_ENABLED", function() { return LOGGING_ENABLED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KEYPRESS_DELAY", function() { return KEYPRESS_DELAY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RECEIVED_DELAY", function() { return RECEIVED_DELAY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "READ_DELAY", function() { return READ_DELAY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MIN_TAG_LENGTH", function() { return MIN_TAG_LENGTH; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DEFAULT_P2P_ACCESS_MODE", function() { return DEFAULT_P2P_ACCESS_MODE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NEW_GRP_ACCESS_MODE", function() { return NEW_GRP_ACCESS_MODE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NO_ACCESS_MODE", function() { return NO_ACCESS_MODE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MEDIA_BREAKPOINT", function() { return MEDIA_BREAKPOINT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "REM_SIZE", function() { return REM_SIZE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AVATAR_SIZE", function() { return AVATAR_SIZE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BROKEN_IMAGE_SIZE", function() { return BROKEN_IMAGE_SIZE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MESSAGES_PAGE", function() { return MESSAGES_PAGE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MAX_INBAND_ATTACHMENT_SIZE", function() { return MAX_INBAND_ATTACHMENT_SIZE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MAX_EXTERN_ATTACHMENT_SIZE", function() { return MAX_EXTERN_ATTACHMENT_SIZE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MAX_IMAGE_DIM", function() { return MAX_IMAGE_DIM; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MAX_ONLINE_IN_TOPIC", function() { return MAX_ONLINE_IN_TOPIC; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MAX_TITLE_LENGTH", function() { return MAX_TITLE_LENGTH; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LINK_CONTACT_US", function() { return LINK_CONTACT_US; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LINK_PRIVACY_POLICY", function() { return LINK_PRIVACY_POLICY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LINK_TERMS_OF_SERVICE", function() { return LINK_TERMS_OF_SERVICE; });
/* harmony import */ var _version_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./version.js */ "./src/version.js");

var APP_NAME = 'TinodeWeb/' + (_version_js__WEBPACK_IMPORTED_MODULE_0__["PACKAGE_VERSION"] || '0.16');
var API_KEY = 'AQEAAAABAAD_rAp4DJh05a1HAwFT3A6K';
var KNOWN_HOSTS = {
  hosted: 'web.tinode.co',
  local: 'localhost:6060'
};
var DEFAULT_HOST = KNOWN_HOSTS.hosted;
var LOGGING_ENABLED = true;
var KEYPRESS_DELAY = 3 * 1000;
var RECEIVED_DELAY = 500;
var READ_DELAY = 1000;
var MIN_TAG_LENGTH = 4;
var DEFAULT_P2P_ACCESS_MODE = 'JRWPS';
var NEW_GRP_ACCESS_MODE = 'JRWPSAO';
var NO_ACCESS_MODE = 'N';
var MEDIA_BREAKPOINT = 640;
var REM_SIZE = 13;
var AVATAR_SIZE = 128;
var BROKEN_IMAGE_SIZE = 32;
var MESSAGES_PAGE = 24;
var MAX_INBAND_ATTACHMENT_SIZE = 195840;
var MAX_EXTERN_ATTACHMENT_SIZE = 1 << 23;
var MAX_IMAGE_DIM = 768;
var MAX_ONLINE_IN_TOPIC = 4;
var MAX_TITLE_LENGTH = 60;
var LINK_CONTACT_US = 'email:info@tinode.co';
var LINK_PRIVACY_POLICY = 'https://tinode.co/privacy.html';
var LINK_TERMS_OF_SERVICE = 'https://tinode.co/terms.html';

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "react-dom");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _messages_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./messages.json */ "./src/messages.json");
var _messages_json__WEBPACK_IMPORTED_MODULE_3___namespace = /*#__PURE__*/__webpack_require__.t(/*! ./messages.json */ "./src/messages.json", 1);
/* harmony import */ var _views_tinode_web_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./views/tinode-web.jsx */ "./src/views/tinode-web.jsx");
/* harmony import */ var _lib_navigation_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./lib/navigation.js */ "./src/lib/navigation.js");







var _HashNavigation$parse = _lib_navigation_js__WEBPACK_IMPORTED_MODULE_5__["default"].parseUrlHash(window.location.hash),
    params = _HashNavigation$parse.params;

var language = params && params.hl || navigator.languages && navigator.languages[0] || navigator.language || navigator.userLanguage || 'en';
var baseLanguage = language.toLowerCase().split(/[-_]/)[0];
var messages = _messages_json__WEBPACK_IMPORTED_MODULE_3__[language] || _messages_json__WEBPACK_IMPORTED_MODULE_3__[baseLanguage] || _messages_json__WEBPACK_IMPORTED_MODULE_3__.en;
react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.render(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_2__["IntlProvider"], {
  locale: language,
  messages: messages,
  textComponent: react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment
}, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_views_tinode_web_jsx__WEBPACK_IMPORTED_MODULE_4__["default"], null)), document.getElementById('mountPoint'));

/***/ }),

/***/ "./src/lib/blob-helpers.js":
/*!*********************************!*\
  !*** ./src/lib/blob-helpers.js ***!
  \*********************************/
/*! exports provided: SUPPORTED_IMAGE_FORMATS, MIME_EXTENSIONS, makeImageUrl, fitImageSize, fileNameForMime, imageFileScaledToBase64, imageFileToBase64, fileToBase64, filePasted, getMimeType, base64EncodedLen, base64DecodedLen, base64ReEncode */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SUPPORTED_IMAGE_FORMATS", function() { return SUPPORTED_IMAGE_FORMATS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MIME_EXTENSIONS", function() { return MIME_EXTENSIONS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "makeImageUrl", function() { return makeImageUrl; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fitImageSize", function() { return fitImageSize; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fileNameForMime", function() { return fileNameForMime; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "imageFileScaledToBase64", function() { return imageFileScaledToBase64; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "imageFileToBase64", function() { return imageFileToBase64; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fileToBase64", function() { return fileToBase64; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "filePasted", function() { return filePasted; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getMimeType", function() { return getMimeType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "base64EncodedLen", function() { return base64EncodedLen; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "base64DecodedLen", function() { return base64DecodedLen; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "base64ReEncode", function() { return base64ReEncode; });
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../config.js */ "./src/config.js");

var SUPPORTED_IMAGE_FORMATS = ['image/jpeg', 'image/gif', 'image/png', 'image/svg', 'image/svg+xml'];
var MIME_EXTENSIONS = ['jpg', 'gif', 'png', 'svg', 'svg'];
function makeImageUrl(photo) {
  return photo && photo.type && photo.data ? 'data:image/' + photo.type + ';base64,' + photo.data : null;
}
function fitImageSize(width, height, maxWidth, maxHeight, forceSquare) {
  width = width | 0;
  height = height | 0;
  maxWidth = maxWidth | 0;
  maxHeight = maxHeight | 0;

  if (width <= 0 || height <= 0 || maxWidth <= 0 || maxHeight <= 0) {
    return null;
  }

  if (forceSquare) {
    maxWidth = maxHeight = Math.min(maxWidth, maxHeight);
  }

  var scale = Math.min(Math.min(width, maxWidth) / width, Math.min(height, maxHeight) / height);
  var size = {
    dstWidth: width * scale | 0,
    dstHeight: height * scale | 0
  };

  if (forceSquare) {
    size.dstWidth = size.dstHeight = Math.min(size.dstWidth, size.dstHeight);
    size.srcWidth = size.srcHeight = Math.min(width, height);
    size.xoffset = (width - size.srcWidth) / 2 | 0;
    size.yoffset = (height - size.srcWidth) / 2 | 0;
  } else {
    size.xoffset = size.yoffset = 0;
    size.srcWidth = width;
    size.srcHeight = height;
  }

  return size;
}
function fileNameForMime(fname, mime) {
  var idx = SUPPORTED_IMAGE_FORMATS.indexOf(mime);
  var ext = MIME_EXTENSIONS[idx];
  var at = fname.lastIndexOf('.');

  if (at >= 0) {
    fname = fname.substring(0, at);
  }

  return fname + '.' + ext;
}
function imageFileScaledToBase64(file, width, height, forceSquare, onSuccess, onError) {
  var img = new Image();
  img.crossOrigin = 'Anonymous';

  img.onerror = function (err) {
    onError("Image format unrecognized");
  };

  img.onload = function () {
    var dim = fitImageSize(this.width, this.height, width, height, forceSquare);

    if (!dim) {
      onError("Invalid image");
      return;
    }

    var canvas = document.createElement('canvas');
    canvas.width = dim.dstWidth;
    canvas.height = dim.dstHeight;
    var ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(this, dim.xoffset, dim.yoffset, dim.srcWidth, dim.srcHeight, 0, 0, dim.dstWidth, dim.dstHeight);
    var mime = this.width != dim.dstWidth || this.height != dim.dstHeight || SUPPORTED_IMAGE_FORMATS.indexOf(file.type) < 0 ? 'image/jpeg' : file.type;
    var imageBits = canvas.toDataURL(mime);
    var parts = imageBits.split(',');
    mime = getMimeType(parts[0]);

    if (!mime) {
      onError("Unsupported image format");
      return;
    }

    var quality = 0.78;

    if (base64DecodedLen(imageBits.length) > _config_js__WEBPACK_IMPORTED_MODULE_0__["MAX_INBAND_ATTACHMENT_SIZE"]) {
      mime = 'image/jpeg';
    }

    if (mime == 'image/jpeg') {
      while (base64DecodedLen(imageBits.length) > _config_js__WEBPACK_IMPORTED_MODULE_0__["MAX_INBAND_ATTACHMENT_SIZE"] && quality > 0.45) {
        imageBits = canvas.toDataURL(mime, quality);
        quality *= 0.84;
      }
    }

    if (base64DecodedLen(imageBits.length) > _config_js__WEBPACK_IMPORTED_MODULE_0__["MAX_INBAND_ATTACHMENT_SIZE"]) {
      onError("The image size " + bytesToHumanSize(base64DecodedLen(imageBits.length)) + " exceeds the " + bytesToHumanSize(_config_js__WEBPACK_IMPORTED_MODULE_0__["MAX_INBAND_ATTACHMENT_SIZE"]) + " limit.", "err");
      return;
    }

    canvas = null;
    onSuccess(imageBits.split(',')[1], mime, dim.dstWidth, dim.dstHeight, fileNameForMime(file.name, mime));
  };

  img.src = URL.createObjectURL(file);
}
function imageFileToBase64(file, onSuccess, onError) {
  var reader = new FileReader();
  reader.addEventListener('load', function () {
    var parts = reader.result.split(',');
    var mime = getMimeType(parts[0]);

    if (!mime) {
      onError("Failed to process image file");
      return;
    }

    var img = new Image();
    img.crossOrigin = 'Anonymous';

    img.onload = function () {
      onSuccess(parts[1], mime, this.width, this.height, fileNameForMime(file.name, mime));
    };

    img.onerror = function (err) {
      onError("Image format not recognized");
    };

    img.src = URL.createObjectURL(file);
  }, false);
  reader.readAsDataURL(file);
}
function fileToBase64(file, onSuccess, onError) {
  var reader = new FileReader();
  reader.addEventListener('load', function () {
    onSuccess(file.type, reader.result.split(',')[1], file.name);
  });
  reader.readAsDataURL(file);
}
function filePasted(event, onImageSuccess, onAttachmentSuccess, onError) {
  var items = (event.clipboardData || event.originalEvent.clipboardData || {}).items;

  for (var i in items) {
    var item = items[i];

    if (item.kind === 'file') {
      var file = item.getAsFile();

      if (!file) {
        console.log("Failed to get file object from pasted file item", item.kind, item.type);
        continue;
      }

      if (file.type && file.type.split('/')[0] == 'image') {
        if (file.size > _config_js__WEBPACK_IMPORTED_MODULE_0__["MAX_INBAND_ATTACHMENT_SIZE"] || SUPPORTED_IMAGE_FORMATS.indexOf(file.type) < 0) {
          imageFileScaledToBase64(file, _config_js__WEBPACK_IMPORTED_MODULE_0__["MAX_IMAGE_DIM"], _config_js__WEBPACK_IMPORTED_MODULE_0__["MAX_IMAGE_DIM"], false, onImageSuccess, onError);
        } else {
          imageFileToBase64(file, onImageSuccess, onError);
        }
      } else {
        fileToBase64(file, onAttachmentSuccess, onError);
      }

      return true;
    }
  }

  return false;
}
function getMimeType(header) {
  var mime = /^data:(image\/[-+a-z0-9.]+);base64/.exec(header);
  return mime && mime.length > 1 ? mime[1] : null;
}
function base64EncodedLen(n) {
  return Math.floor((n + 2) / 3) * 4;
}
function base64DecodedLen(n) {
  return Math.floor(n / 4) * 3;
}
function base64ReEncode(str) {
  if (str) {
    str = str.replace(/-/g, '+').replace(/_/g, '/');

    try {
      str = btoa(atob(str));
    } catch (err) {
      console.log("Failed to base64 re-encode string.", err);
      str = null;
    }
  }

  return str;
}

/***/ }),

/***/ "./src/lib/host-name.js":
/*!******************************!*\
  !*** ./src/lib/host-name.js ***!
  \******************************/
/*! exports provided: detectServerAddress, isSecureConnection, isLocalHost */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "detectServerAddress", function() { return detectServerAddress; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isSecureConnection", function() { return isSecureConnection; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isLocalHost", function() { return isLocalHost; });
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../config.js */ "./src/config.js");

function detectServerAddress() {
  var host = _config_js__WEBPACK_IMPORTED_MODULE_0__["DEFAULT_HOST"];

  if (typeof window.location == 'object') {
    if (window.location.protocol == 'file:' || window.location.hostname == 'localhost') {
      host = _config_js__WEBPACK_IMPORTED_MODULE_0__["KNOWN_HOSTS"].local;
    } else if (window.location.hostname) {
      host = window.location.hostname + (window.location.port ? ':' + window.location.port : '');
    }
  }

  return host;
}
function isSecureConnection() {
  if (typeof window.location == 'object') {
    return window.location.protocol == 'https:';
  }

  return false;
}
function isLocalHost() {
  if (typeof window.location == 'object') {
    return window.location.hostname == 'localhost';
  }

  return false;
}

/***/ }),

/***/ "./src/lib/local-storage.js":
/*!**********************************!*\
  !*** ./src/lib/local-storage.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return LocalStorageUtil; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var LocalStorageUtil = function () {
  function LocalStorageUtil() {
    _classCallCheck(this, LocalStorageUtil);
  }

  _createClass(LocalStorageUtil, null, [{
    key: "setObject",
    value: function setObject(key, value) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }, {
    key: "getObject",
    value: function getObject(key) {
      var value = localStorage.getItem(key);
      return value && JSON.parse(value);
    }
  }, {
    key: "updateObject",
    value: function updateObject(key, value) {
      var oldVal = this.getObject(key);
      this.setObject(key, Object.assign(oldVal || {}, value));
    }
  }, {
    key: "removeItem",
    value: function removeItem(key) {
      localStorage.removeItem(key);
    }
  }]);

  return LocalStorageUtil;
}();



/***/ }),

/***/ "./src/lib/navigation.js":
/*!*******************************!*\
  !*** ./src/lib/navigation.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return HashNavigation; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var HashNavigation = function () {
  function HashNavigation() {
    _classCallCheck(this, HashNavigation);
  }

  _createClass(HashNavigation, null, [{
    key: "parseUrlHash",
    value: function parseUrlHash(hash) {
      var parts = hash.split('?', 2);
      var params = {};
      var path = [];

      if (parts[0]) {
        path = parts[0].substr(1).split('/');
      }

      if (parts[1]) {
        parts[1].split('&').forEach(function (part) {
          var item = part.split('=');

          if (item[0]) {
            params[decodeURIComponent(item[0])] = decodeURIComponent(item[1]);
          }
        });
      }

      return {
        path: path,
        params: params
      };
    }
  }, {
    key: "navigateTo",
    value: function navigateTo(url) {
      window.location.hash = url;
    }
  }, {
    key: "composeUrlHash",
    value: function composeUrlHash(path, params) {
      var url = path.join('/');
      var args = [];

      for (var key in params) {
        if (params.hasOwnProperty(key)) {
          args.push(key + '=' + params[key]);
        }
      }

      if (args.length > 0) {
        url += '?' + args.join('&');
      }

      return url;
    }
  }, {
    key: "addUrlParam",
    value: function addUrlParam(hash, key, value) {
      var parsed = this.parseUrlHash(hash);
      parsed.params[key] = value;
      return this.composeUrlHash(parsed.path, parsed.params);
    }
  }, {
    key: "removeUrlParam",
    value: function removeUrlParam(hash, key) {
      var parsed = this.parseUrlHash(hash);
      delete parsed.params[key];
      return this.composeUrlHash(parsed.path, parsed.params);
    }
  }, {
    key: "setUrlSidePanel",
    value: function setUrlSidePanel(hash, sidepanel) {
      var parsed = this.parseUrlHash(hash);
      parsed.path[0] = sidepanel;
      return this.composeUrlHash(parsed.path, parsed.params);
    }
  }, {
    key: "setUrlTopic",
    value: function setUrlTopic(hash, topic) {
      var parsed = this.parseUrlHash(hash);
      parsed.path[1] = topic;
      delete parsed.params.info;
      return this.composeUrlHash(parsed.path, parsed.params);
    }
  }]);

  return HashNavigation;
}();



/***/ }),

/***/ "./src/lib/strformat.js":
/*!******************************!*\
  !*** ./src/lib/strformat.js ***!
  \******************************/
/*! exports provided: shortDateFormat, secondsToTime, bytesToHumanSize, stringHash */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "shortDateFormat", function() { return shortDateFormat; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "secondsToTime", function() { return secondsToTime; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bytesToHumanSize", function() { return bytesToHumanSize; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "stringHash", function() { return stringHash; });
function shortDateFormat(then, locale) {
  locale = locale || window.navigator.userLanguage || window.navigator.language;
  var now = new Date();

  if (then.getFullYear() == now.getFullYear()) {
    if (then.getMonth() == now.getMonth() && then.getDate() == now.getDate()) {
      return then.toLocaleTimeString(locale, {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      });
    } else {
      return then.toLocaleDateString(locale, {
        hour12: false,
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }

  return then.toLocaleDateString(locale, {
    hour12: false,
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
function secondsToTime(seconds) {
  var min = Math.floor(seconds / 60);
  var sec = seconds % 60;
  sec = sec < 10 ? "0".concat(sec) : sec;
  return "".concat(min, ":").concat(sec);
}
function bytesToHumanSize(bytes) {
  if (!bytes || bytes == 0) {
    return '0 Bytes';
  }

  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  var bucket = Math.min(Math.floor(Math.log2(bytes) / 10) | 0, sizes.length - 1);
  var count = bytes / Math.pow(1024, bucket);
  var round = bucket > 0 ? count < 3 ? 2 : count < 30 ? 1 : 0 : 0;
  return count.toFixed(round) + ' ' + sizes[bucket];
}
function stringHash(value) {
  var hash = 0;
  value = '' + value;

  for (var i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash = hash & hash;
  }

  return hash;
}

/***/ }),

/***/ "./src/lib/utils.js":
/*!**************************!*\
  !*** ./src/lib/utils.js ***!
  \**************************/
/*! exports provided: updateFavicon, vcard, arrayEqual, asPhone, asEmail, isUrlRelative, sanitizeUrl, sanitizeImageUrl */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "updateFavicon", function() { return updateFavicon; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "vcard", function() { return vcard; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "arrayEqual", function() { return arrayEqual; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "asPhone", function() { return asPhone; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "asEmail", function() { return asEmail; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isUrlRelative", function() { return isUrlRelative; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sanitizeUrl", function() { return sanitizeUrl; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sanitizeImageUrl", function() { return sanitizeImageUrl; });
function updateFavicon(count) {
  var oldIcon = document.getElementById('shortcut-icon');
  var head = document.head || document.getElementsByTagName('head')[0];
  var newIcon = document.createElement('link');
  newIcon.type = 'image/png';
  newIcon.id = 'shortcut-icon';
  newIcon.rel = 'shortcut icon';
  newIcon.href = 'img/logo32x32' + (count > 0 ? 'a' : '') + '.png';

  if (oldIcon) {
    head.removeChild(oldIcon);
  }

  head.appendChild(newIcon);
  document.title = (count > 0 ? '(' + count + ') ' : '') + 'Tinode';
}
function vcard(fn, imageDataUrl) {
  var card = null;

  if (fn && fn.trim() || imageDataUrl) {
    card = {};

    if (fn) {
      card.fn = fn.trim();
    }

    if (imageDataUrl) {
      var dataStart = imageDataUrl.indexOf(',');
      card.photo = dataStart >= 0 ? {
        data: imageDataUrl.substring(dataStart + 1),
        type: 'jpg'
      } : imageDataUrl;
    }
  }

  return card;
}
function arrayEqual(a, b) {
  if (a === b) {
    return true;
  }

  if (!Array.isArray(a) || !Array.isArray(b)) {
    return false;
  }

  if (a.length != b.length) {
    return false;
  }

  a.sort();
  b.sort();

  for (var i = 0, l = a.length; i < l; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }

  return true;
}
function asPhone(val) {
  val = val.trim();

  if (/^(?:\+?(\d{1,3}))?[- (.]*(\d{3})[- ).]*(\d{3})[- .]*(\d{2})[- .]*(\d{2})?$/.test(val)) {
    return val.replace(/[- ().]*/, '');
  }

  return null;
}
function asEmail(val) {
  val = val.trim();

  if (/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(val)) {
    return val;
  }

  return null;
}
function isUrlRelative(url) {
  return !/^\s*([a-z][a-z0-9+.-]*:|\/\/)/im.test(url);
}
function sanitizeUrl(url, allowedSchemes) {
  if (!url) {
    return null;
  }

  url = url.replace(/[^\x20-\x7E]/gmi, '').trim();

  if (!/^([a-z][a-z0-9+.-]*:|\/\/)/i.test(url)) {
    return url;
  }

  if (/^blob:http/.test(url)) {
    return url;
  }

  var schemes = Array.isArray(allowedSchemes) ? allowedSchemes.join('|') : 'http|https';
  var re = new RegExp('^((' + schemes + '):|//)', 'i');

  if (!re.test(url)) {
    return null;
  }

  return url;
}
function sanitizeImageUrl(url) {
  if (!url) {
    return null;
  }

  var sanitizedUrl = sanitizeUrl(url);

  if (sanitizedUrl) {
    return sanitizedUrl;
  }

  if (/data:image\/[a-z0-9.-]+;base64,/i.test(url.trim())) {
    return url;
  }

  return null;
}

/***/ }),

/***/ "./src/messages.json":
/*!***************************!*\
  !*** ./src/messages.json ***!
  \***************************/
/*! exports provided: en, ru, zh, default */
/***/ (function(module) {

module.exports = JSON.parse("{\"en\":{\"archived_contacts\":\"Archived contacts ({count})\",\"contacts_not_found\":\"You have no chats<br />¯∖_(ツ)_/¯\",\"full_name_prompt\":\"Full name, e.g. John Doe\",\"email_prompt\":\"Email, e.g. jdoe@example.com\",\"button_sign_up\":\"Sign up\",\"validate_credential_action\":\"confirm\",\"label_your_name\":\"Your name\",\"label_password\":\"Password\",\"password_unchanged_prompt\":\"Unchanged\",\"label_message_sound\":\"Message sound:\",\"label_push_notifications\":\"Notification alerts:\",\"label_push_notifications_disabled\":\"Notification alerts (requires HTTPS):\",\"title_tag_manager\":\"Tags (user discovery)\",\"label_user_contacts\":\"Contacts:\",\"label_user_id\":\"Address:\",\"label_default_access_mode\":\"Default access mode:\",\"button_logout\":\"Logout\",\"label_legal\":\"Legal\",\"link_contact_us\":\"Contact Us\",\"link_terms_of_service\":\"Terms of Service\",\"link_privacy_policy\":\"Privacy Policy\",\"requested_permissions\":\"Requested\",\"granted_permissions\":\"Granted\",\"menu_item_edit_permissions\":\"Edit permissions\",\"label_other_user\":\"Other\",\"action_clear_messages\":\"Clear Messages\",\"clear_messages_warning\":\"Are you sure you want to clear all messages? It cannot be undone.\",\"action_delete_messages\":\"Clear Messages for All\",\"delete_messages_warning\":\"Are you sure you want to delete all messages for everyone? It cannot be undone.\",\"action_leave_chat\":\"Leave Conversation\",\"leave_chat_warning\":\"Are you sure you want to leave this conversation?\",\"action_block_contact\":\"Block Contact\",\"block_contact_warning\":\"Are you sure you want to block this contact?\",\"action_report_chat\":\"Report Conversation\",\"report_chat_warning\":\"Are you sure you want to block and report this conversation?\",\"title_info\":\"Info\",\"label_topic_name\":\"Name\",\"label_private\":\"Private comment\",\"private_editing_placeholder\":\"Visible to you only\",\"label_muting_topic\":\"Muted:\",\"action_more\":\"More\",\"label_your_permissions\":\"Your permissions:\",\"label_permissions\":\"Permissions:\",\"label_you\":\"You:\",\"label_default_access\":\"Default access mode:\",\"label_group_members\":\"Group members:\",\"button_add_members\":\"Add members\",\"group_has_no_members\":\"No members\",\"login_prompt\":\"Login\",\"password_prompt\":\"Password\",\"stay_logged_in\":\"Stay logged in\",\"forgot_password_link\":\"Forgot password?\",\"button_sign_in\":\"Sign in\",\"label_client\":\"Client:\",\"label_server\":\"Server:\",\"online_now\":\"online now\",\"last_seen_timestamp\":\"Last seen\",\"title_not_found\":\"Not found\",\"unnamed_topic\":\"Unnamed\",\"messages_not_readable\":\"no access to messages\",\"peers_messaging_disabled\":\"Peer's messaging is disabled.\",\"enable_peers_messaging\":\"Enable\",\"search_for_contacts\":\"Use search to find contacts\",\"search_no_results\":\"Search returned no results\",\"tabtitle_find_user\":\"find\",\"tabtitle_new_group\":\"new group\",\"tabtitle_group_by_id\":\"by id\",\"new_password_placeholder\":\"Enter new password\",\"label_reset_password\":\"Send a password reset email:\",\"credential_email_prompt\":\"Your registration email\",\"button_reset\":\"Reset\",\"button_send_request\":\"Send request\",\"label_server_to_use\":\"Server to use:\",\"label_wire_transport\":\"Wire transport:\",\"button_update\":\"Update\",\"sidepanel_title_login\":\"Sign In\",\"sidepanel_title_register\":\"Create Account\",\"sidepanel_title_settings\":\"Settings\",\"sidepanel_title_edit_account\":\"Edit Account\",\"sidepanel_title_newtpk\":\"Start New Chat\",\"sidepanel_title_cred\":\"Confirm Credentials\",\"sidepanel_title_reset\":\"Reset Password\",\"sidepanel_title_archive\":\"Archived Chats\",\"update_available\":\"Update available. <a href=\\\"\\\">Reload</a>.\",\"reconnect_countdown\":\"Disconnected. Reconnecting in {seconds}…\",\"reconnect_now\":\"Try now\",\"phone_dative\":\"phone\",\"email_dative\":\"email\",\"enter_confirmation_code_prompt\":\"Enter confirmation code sent to you by {method}:\",\"numeric_confirmation_code_prompt\":\"Numbers only\",\"button_confirm\":\"Confirm\",\"save_attachment\":\"save\",\"invalid_content\":\"invalid content\",\"user_not_found\":\"Not found\",\"badge_you\":\"you\",\"badge_owner\":\"owner\",\"menu_item_info\":\"Info\",\"menu_item_clear_messages\":\"Clear messages\",\"menu_item_clear_messages_for_all\":\"Clear for All\",\"menu_item_delete\":\"Delete\",\"menu_item_delete_for_all\":\"Delete for All\",\"menu_item_mute\":\"Mute\",\"menu_item_unmute\":\"Unmute\",\"menu_item_delete_topic\":\"Delete\",\"topic_delete_warning\":\"Are you sure you want to delete this conversation?\",\"menu_item_unblock\":\"Unblock\",\"menu_item_block\":\"Block\",\"topic_block_warning\":\"Are you sure you want to block this conversation?\",\"menu_item_member_delete\":\"Remove\",\"menu_item_archive_topic\":\"Archive\",\"action_cancel\":\"cancel\",\"upload_finishing\":\"finishing...\",\"no_contacts\":\"You have no contacts :-(\",\"contacts_not_found_short\":\"No contacts match '{query}'\",\"title_group_members\":\"Group Members\",\"title_all_contacts\":\"All Contacts\",\"button_ok\":\"OK\",\"button_cancel\":\"Cancel\",\"more_online_members\":\"+{overflow} more\",\"download_action\":\"download\",\"label_file_name\":\"File name:\",\"label_content_type\":\"Content type:\",\"label_size\":\"Size:\",\"chat_invitation\":\"You are invited to start a new chat. What would you like to do?\",\"chat_invitation_accept\":\"Accept\",\"chat_invitation_ignore\":\"Ignore\",\"chat_invitation_block\":\"Block\",\"error_invalid_id\":\"Invalid ID\",\"group_user_id_prompt\":\"Group or User ID\",\"button_subscribe\":\"Subscribe\",\"topic_name_editing_placeholder\":\"Freeform name of the group\",\"button_create\":\"Create\",\"permission_join\":\"Join ({val})\",\"permission_read\":\"Read ({val})\",\"permission_write\":\"Write ({val})\",\"permission_pres\":\"Get notified ({val})\",\"permission_admin\":\"Approve ({val})\",\"permission_share\":\"Share ({val})\",\"permission_delete\":\"Delete ({val})\",\"permission_owner\":\"Owner ({val})\",\"title_permissions\":\"Permissions\",\"message_sending\":\"sending...\",\"message_sending_failed\":\"failed\",\"search_placeholder\":\"List like email:alice@example.com, tel:17025550003...\",\"messaging_disabled_prompt\":\"Messaging disabled\",\"new_message_prompt\":\"New message\",\"file_attachment_too_large\":\"The file size {size} exceeds the {limit} limit.\",\"cannot_initiate_file_upload\":\"Cannot initiate file upload.\",\"tags_not_found\":\"No tags defined. Add some.\",\"tags_editor_no_tags\":\"Add some tags\",\"title_manage_tags\":\"Manage\"},\"ru\":{\"contacts_not_found\":\"Чатов нет<br />¯∖_(ツ)_/¯\",\"full_name_prompt\":\"Полное имя, напр. Иван Петров\",\"email_prompt\":\"Email, напр. ivan@example.com\",\"button_sign_up\":\"Создать аккаунт\",\"label_your_name\":\"Ваше имя\",\"label_password\":\"Пароль\",\"password_unchanged_prompt\":\"Не изменен\",\"label_user_id\":\"Адрес:\",\"label_default_access_mode\":\"Доступ по умолчанию:\",\"label_message_sound\":\"Звук нового сообщения:\",\"label_push_notifications\":\"Уведомления:\",\"label_push_notifications_disabled\":\"Уведомления (требуют HTTPS):\",\"title_tag_manager\":\"Теги для поиска\",\"button_logout\":\"Выйти\",\"login_prompt\":\"Логин\",\"password_prompt\":\"Пароль\",\"stay_logged_in\":\"Запомнить\",\"forgot_password_link\":\"Напомнить пароль\",\"button_sign_in\":\"Войти\",\"label_client\":\"Клиент:\",\"label_server\":\"Сервер:\",\"online_now\":\"онлайн\",\"last_seen_timestamp\":\"Был активен\",\"title_not_found\":\"Не найден\",\"unnamed_topic\":\"Без названия\",\"messages_not_readable\":\"нет доступа к сообщениям\",\"tabtitle_find_user\":\"найти\",\"tabtitle_new_group\":\"создать\",\"tabtitle_group_by_id\":\"по id\",\"label_server_to_use\":\"Использовать сервер:\",\"label_wire_transport\":\"Соединение:\",\"button_update\":\"Применить\",\"sidepanel_title_login\":\"Авторизация\",\"sidepanel_title_register\":\"Зарегистрироваться\",\"sidepanel_title_settings\":\"Настройки\",\"sidepanel_title_edit_account\":\"Редактировать аккаунт\",\"sidepanel_title_newtpk\":\"Новый чат\",\"sidepanel_title_cred\":\"Подтвердить\",\"sidepanel_title_reset\":\"Сменить пароль\",\"tags_not_found\":\"Тегов нет. Добавьте\",\"tags_editor_no_tags\":\"Добавьте теги\",\"title_manage_tags\":\"Редактировать\",\"message_sending\":\"в пути...\",\"message_sending_failed\":\"ошибка\",\"search_placeholder\":\"Список, напр. email:alice@example.com, tel:+17025550003...\",\"messaging_disabled_prompt\":\"Отправка недоступна\",\"new_message_prompt\":\"Новое сообщение\",\"file_attachment_too_large\":\"Размер файла {size} превышает {limit} лимит.\",\"cannot_initiate_file_upload\":\"Ошибка загрузки файла.\",\"search_for_contacts\":\"Поиск контактов\",\"enter_confirmation_code_prompt\":\"Код подтверждения, полученный по {method}:\",\"numeric_confirmation_code_prompt\":\"Только цифры\",\"button_confirm\":\"Подтвердить\",\"button_ok\":\"OK\",\"button_cancel\":\"Отменить\",\"invalid_content\":\"сообщение не читается\",\"label_file_name\":\"Имя файла:\",\"label_content_type\":\"Тип:\",\"label_size\":\"Размер:\",\"phone_dative\":\"телефону\",\"email_dative\":\"емейлу\",\"title_group_members\":\"Участники\",\"download_action\":\"скачать\",\"permission_join\":\"Подписываться ({val})\",\"permission_read\":\"Читать ({val})\",\"permission_write\":\"Писать ({val})\",\"permission_pres\":\"Уведомлять ({val})\",\"permission_admin\":\"Подтверждать ({val})\",\"permission_share\":\"Приглашать ({val})\",\"permission_delete\":\"Удалять ({val})\",\"permission_owner\":\"Владелец ({val})\",\"title_permissions\":\"Права доступа\",\"requested_permissions\":\"Требуются\",\"granted_permissions\":\"Получены\",\"menu_item_edit_permissions\":\"Права доступа\",\"label_other_user\":\"Второй\",\"label_topic_name\":\"Название\",\"label_private\":\"Комментарий\",\"private_editing_placeholder\":\"Виден только вам\",\"label_muting_topic\":\"Без уведомлений\",\"action_more\":\"Ещё\",\"label_your_permissions\":\"Ваши права доступа:\",\"label_permissions\":\"Права доступа:\",\"label_you\":\"Вы:\",\"label_default_access\":\"Права по умолчанию:\",\"label_group_members\":\"Участники чата:\",\"button_add_members\":\"Добавить\",\"group_has_no_members\":\"Нет участников\",\"action_leave_chat\":\"Уйти из чата\",\"menu_item_info\":\"Информация\",\"menu_item_clear_messages\":\"Удалить сообщения\",\"menu_item_clear_messages_for_all\":\"Удалить для всех\",\"menu_item_delete\":\"Удалить\",\"menu_item_delete_for_all\":\"Удалить для всех\",\"menu_item_mute\":\"Не уведомлять\",\"menu_item_unmute\":\"Уведомлять\",\"menu_item_delete_topic\":\"Удалить чат\",\"menu_item_unblock\":\"Разблокировать\",\"menu_item_block\":\"Заблокировать\",\"menu_item_member_delete\":\"Отписать\",\"title_info\":\"Подробности\",\"new_password_placeholder\":\"Введите новый пароль\",\"label_reset_password\":\"Отправить емейл для смены пароля:\",\"credential_email_prompt\":\"Регистрационный емейл\",\"button_reset\":\"Изменить\",\"button_send_request\":\"Отправить\",\"action_cancel\":\"отменить\",\"upload_finishing\":\"завершение...\",\"no_contacts\":\"Ничего нет :-(\",\"contacts_not_found_short\":\"Нет контактов для запроса '{query}'\",\"title_all_contacts\":\"Все контакты\",\"error_invalid_id\":\"Неверный ID\",\"group_user_id_prompt\":\"ID чата или пользователя\",\"button_subscribe\":\"Подписаться\",\"topic_name_editing_placeholder\":\"Название чата\",\"button_create\":\"Создать\",\"badge_you\":\"вы\",\"badge_owner\":\"влад.\",\"update_available\":\"Есть новая версия приложения. <a href=\\\"\\\">Обновить</a>.\",\"user_not_found\":\"Не найден\",\"reconnect_countdown\":\"Нет связи. Подключение через {seconds}…\",\"reconnect_now\":\"Подключить сейчас.\",\"save_attachment\":\"сохранить\",\"menu_item_archive_topic\":\"В архив\",\"archived_contacts\":\"Чаты в архиве ({count})\",\"sidepanel_title_archive\":\"Архив чатов\",\"chat_invitation\":\"Вас пригласили начать новый чат. Как вы хотите поступить?\",\"chat_invitation_accept\":\"Принять\",\"chat_invitation_ignore\":\"Игнорировать\",\"chat_invitation_block\":\"Заблокировать\",\"peers_messaging_disabled\":\"Чат заблокирован у корреспондента.\",\"enable_peers_messaging\":\"Разблокировать.\",\"more_online_members\":\"+еще {overflow}\",\"label_user_contacts\":\"Конакты:\",\"validate_credential_action\":\"подтвердить\",\"label_legal\":\"Прочее\",\"link_contact_us\":\"Связаться с нами\",\"link_terms_of_service\":\"Условия сервиса\",\"link_privacy_policy\":\"Политика конфиденциальности\",\"action_delete_messages\":\"Удалить сообщения\",\"action_block_contact\":\"Заблокировать контакт\",\"action_report_chat\":\"Сообщить о нарушении\",\"delete_messages_warning\":\"Вы действительно хотите удалить все сообщения?\",\"leave_chat_warning\":\"Вы действительно хотите покинуть этот чат?\",\"block_contact_warning\":\"Вы действительно заблокировать этот контакт?\",\"report_chat_warning\":\"Вы действительно хотите сообщить о нарушении и заблокировать этот чат?\",\"action_clear_messages\":\"Удалить сообщения\",\"clear_messages_warning\":\"Вы действительно хотите удалить все сообщения в чате? Их будет невозможно восстановить.\",\"topic_delete_warning\":\"Вы действительно хотите удалить этот чат?\",\"topic_block_warning\":\"Вы действительно хотите заблокировать этот чат?\",\"search_no_results\":\"Ничего не найдено\"},\"zh\":{\"archived_contacts\":\"已归档联系人 ({count})\",\"contacts_not_found\":\"你尚无会话<br />¯∖_(ツ)_/¯\",\"full_name_prompt\":\"全名，例如张伟\",\"email_prompt\":\"电子邮件，例如 zhang@example.com\",\"button_sign_up\":\"注册\",\"label_your_name\":\"你的姓名\",\"label_password\":\"密码\",\"password_unchanged_prompt\":\"未改变\",\"label_user_id\":\"地址：\",\"label_default_access_mode\":\"蓦然访问模式：\",\"label_message_sound\":\"消息提示音：\",\"label_push_notifications\":\"通知提醒：\",\"label_push_notifications_disabled\":\"通知提醒（需要 HTTPS）：\",\"title_tag_manager\":\"标签（用户发现）\",\"button_logout\":\"登出\",\"requested_permissions\":\"已请求\",\"granted_permissions\":\"已授予\",\"menu_item_edit_permissions\":\"编辑权限\",\"label_other_user\":\"其他\",\"title_info\":\"信息\",\"label_topic_name\":\"名称\",\"label_private\":\"私人评论\",\"private_editing_placeholder\":\"仅自己可见\",\"label_muting_topic\":\"已静音：\",\"action_more\":\"更多\",\"label_your_permissions\":\"你的权限：\",\"label_permissions\":\"权限：\",\"label_you\":\"你：\",\"label_default_access\":\"默认权限模式：\",\"label_group_members\":\"群组成员：\",\"button_add_members\":\"添加成员\",\"group_has_no_members\":\"无成员\",\"action_leave_chat\":\"离开\",\"login_prompt\":\"登录\",\"password_prompt\":\"密码\",\"stay_logged_in\":\"保持登录\",\"forgot_password_link\":\"忘记密码？\",\"button_sign_in\":\"登录\",\"label_client\":\"客户端：\",\"label_server\":\"服务器：\",\"online_now\":\"在线\",\"last_seen_timestamp\":\"最后可见\",\"title_not_found\":\"无法找到\",\"unnamed_topic\":\"未命名\",\"messages_not_readable\":\"无消息访问权限\",\"peers_messaging_disabled\":\"成员间消息已禁用。\",\"enable_peers_messaging\":\"启用\",\"tabtitle_find_user\":\"搜索\",\"tabtitle_new_group\":\"新群组\",\"tabtitle_group_by_id\":\"通过 id\",\"search_for_contacts\":\"使用搜索寻找联系人\",\"new_password_placeholder\":\"输入新密码\",\"label_reset_password\":\"发送密码重置邮件：\",\"credential_email_prompt\":\"你的注册邮箱\",\"button_reset\":\"重置\",\"button_send_request\":\"发送请求\",\"label_server_to_use\":\"使用的服务器：\",\"label_wire_transport\":\"线路传输：\",\"button_update\":\"更新\",\"sidepanel_title_login\":\"登录\",\"sidepanel_title_register\":\"创建账户\",\"sidepanel_title_settings\":\"设置\",\"sidepanel_title_edit_account\":\"编辑账户\",\"sidepanel_title_newtpk\":\"开始新会话\",\"sidepanel_title_cred\":\"确认凭据\",\"sidepanel_title_reset\":\"重置密码\",\"sidepanel_title_archive\":\"已存档会话\",\"update_available\":\"更新可用。<a href=\\\"\\\">重新载入</a>.\",\"reconnect_countdown\":\"连接已断开。{seconds} 秒后重新连接…\",\"reconnect_now\":\"立即尝试\",\"phone_dative\":\"电话\",\"email_dative\":\"电子邮件\",\"enter_confirmation_code_prompt\":\"输入通过{method}发送的验证码：\",\"numeric_confirmation_code_prompt\":\"仅数字\",\"button_confirm\":\"确认\",\"save_attachment\":\"保存\",\"invalid_content\":\"无效内容\",\"user_not_found\":\"未找到\",\"badge_you\":\"你\",\"badge_owner\":\"所有者\",\"menu_item_info\":\"信息\",\"menu_item_clear_messages\":\"清空消息\",\"menu_item_clear_messages_for_all\":\"全部清除\",\"menu_item_delete\":\"删除\",\"menu_item_delete_for_all\":\"全部删除\",\"menu_item_mute\":\"静音\",\"menu_item_unmute\":\"取消静音\",\"menu_item_delete_topic\":\"删除\",\"menu_item_unblock\":\"取消屏蔽\",\"menu_item_block\":\"屏蔽\",\"menu_item_member_delete\":\"移除\",\"menu_item_archive_topic\":\"归档\",\"action_cancel\":\"取消\",\"upload_finishing\":\"正在结束...\",\"no_contacts\":\"你尚无联系人 ：-(\",\"contacts_not_found_short\":\"无联系人匹配 '{query}'\",\"title_group_members\":\"群组成员\",\"title_all_contacts\":\"全部联系人\",\"button_ok\":\"好\",\"button_cancel\":\"取消\",\"download_action\":\"下载\",\"label_file_name\":\"文件名：\",\"label_content_type\":\"内容类型：\",\"label_size\":\"大小：\",\"chat_invitation\":\"你受邀开始新会话。你想怎么做？\",\"chat_invitation_accept\":\"接受\",\"chat_invitation_ignore\":\"忽略\",\"chat_invitation_block\":\"屏蔽\",\"error_invalid_id\":\"无效 ID\",\"group_user_id_prompt\":\"群组或用户 ID\",\"button_subscribe\":\"订阅\",\"topic_name_editing_placeholder\":\"群组自由格式名称\",\"button_create\":\"创建\",\"permission_join\":\"加入 ({val})\",\"permission_read\":\"读取 ({val})\",\"permission_write\":\"写入 ({val})\",\"permission_pres\":\"获取通知 ({val})\",\"permission_admin\":\"批准 ({val})\",\"permission_share\":\"分享 ({val})\",\"permission_delete\":\"删除 ({val})\",\"permission_owner\":\"所有者 ({val})\",\"title_permissions\":\"权限\",\"message_sending\":\"正在发送...\",\"message_sending_failed\":\"发送失败\",\"search_placeholder\":\"列表如 email:alice@example.com, tel:+17025550003...\",\"messaging_disabled_prompt\":\"消息已禁用\",\"new_message_prompt\":\"新消息\",\"file_attachment_too_large\":\"文件大小 {size} 超过 {limit} 限制。\",\"cannot_initiate_file_upload\":\"无法初始化文件上传。\",\"tags_not_found\":\"尚未定义标签。添加一些。\",\"tags_editor_no_tags\":\"添加一些标签\",\"title_manage_tags\":\"管理标签\",\"more_online_members\":\"还有{overflow}个\",\"label_user_contacts\":\"往来：\",\"validate_credential_action\":\"确认\",\"label_legal\":\"法律东西\",\"link_contact_us\":\"联系我们\",\"link_terms_of_service\":\"条款和条件\",\"link_privacy_policy\":\"隐私政策\",\"action_delete_messages\":\"删除所有帖子\",\"action_block_contact\":\"屏蔽联系人\",\"action_report_chat\":\"检举垃圾邮件\"}}");

/***/ }),

/***/ "./src/version.js":
/*!************************!*\
  !*** ./src/version.js ***!
  \************************/
/*! exports provided: PACKAGE_VERSION */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PACKAGE_VERSION", function() { return PACKAGE_VERSION; });
var PACKAGE_VERSION = "0.16.2";

/***/ }),

/***/ "./src/views/contacts-view.jsx":
/*!*************************************!*\
  !*** ./src/views/contacts-view.jsx ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ContactsView; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _widgets_contact_list_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../widgets/contact-list.jsx */ "./src/widgets/contact-list.jsx");
/* harmony import */ var _lib_utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/utils.js */ "./src/lib/utils.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }





var messages = Object(react_intl__WEBPACK_IMPORTED_MODULE_1__["defineMessages"])({
  archived_contacts_title: {
    "id": "archived_contacts",
    "defaultMessage": "Archived contacts ({count})"
  }
});

var ContactsView = function (_React$Component) {
  _inherits(ContactsView, _React$Component);

  function ContactsView(props) {
    var _this;

    _classCallCheck(this, ContactsView);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ContactsView).call(this, props));
    _this.handleAction = _this.handleAction.bind(_assertThisInitialized(_this));
    _this.state = ContactsView.deriveStateFromProps(props);
    return _this;
  }

  _createClass(ContactsView, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      if (prevProps.chatList != this.props.chatList || prevProps.archive != this.props.archive) {
        var newState = ContactsView.deriveStateFromProps(this.props);
        this.setState(newState);

        if (newState.unreadThreads != prevState.unreadThreads) {
          Object(_lib_utils_js__WEBPACK_IMPORTED_MODULE_3__["updateFavicon"])(newState.unreadThreads);
        }
      }
    }
  }, {
    key: "handleAction",
    value: function handleAction(action_ignored) {
      this.props.onShowArchive();
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedHTMLMessage"], {
        id: "contacts_not_found",
        defaultMessage: "You have no chats<br />\xAF\u2216_(\u30C4)_/\xAF"
      }, function (no_contacts) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_contact_list_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
          connected: _this2.props.connected,
          contacts: _this2.state.contactList,
          emptyListMessage: no_contacts,
          topicSelected: _this2.props.topicSelected,
          myUserId: _this2.props.myUserId,
          showOnline: true,
          showUnread: true,
          onTopicSelected: _this2.props.onTopicSelected,
          showContextMenu: _this2.props.showContextMenu,
          onAction: _this2.handleAction
        });
      });
    }
  }], [{
    key: "deriveStateFromProps",
    value: function deriveStateFromProps(props) {
      var contacts = [];
      var unreadThreads = 0;
      var archivedCount = 0;
      props.chatList.map(function (c) {
        if (c.private && c.private.arch) {
          if (props.archive) {
            contacts.push(c);
          } else {
            archivedCount++;
          }
        } else if (!props.archive) {
          contacts.push(c);
          unreadThreads += c.unread > 0 ? 1 : 0;
        }
      });
      contacts.sort(function (a, b) {
        return (b.touched || 0) - (a.touched || 0);
      });

      if (archivedCount > 0) {
        contacts.push({
          action: 'archive',
          title: messages.archived_contacts_title,
          values: {
            count: archivedCount
          }
        });
      }

      return {
        contactList: contacts,
        unreadThreads: unreadThreads
      };
    }
  }]);

  return ContactsView;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);


;

/***/ }),

/***/ "./src/views/create-account-view.jsx":
/*!*******************************************!*\
  !*** ./src/views/create-account-view.jsx ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return CreateAccountView; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _widgets_avatar_upload_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../widgets/avatar-upload.jsx */ "./src/widgets/avatar-upload.jsx");
/* harmony import */ var _widgets_checkbox_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../widgets/checkbox.jsx */ "./src/widgets/checkbox.jsx");
/* harmony import */ var _widgets_visible_password_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../widgets/visible-password.jsx */ "./src/widgets/visible-password.jsx");
/* harmony import */ var _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../lib/local-storage.js */ "./src/lib/local-storage.js");
/* harmony import */ var _lib_utils_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../lib/utils.js */ "./src/lib/utils.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }










var CreateAccountView = function (_React$PureComponent) {
  _inherits(CreateAccountView, _React$PureComponent);

  function CreateAccountView(props) {
    var _this;

    _classCallCheck(this, CreateAccountView);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CreateAccountView).call(this, props));
    _this.state = {
      login: '',
      password: '',
      email: '',
      fn: '',
      imageDataUrl: null,
      errorCleared: false,
      saveToken: _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_5__["default"].getObject('keep-logged-in')
    };
    _this.handleLoginChange = _this.handleLoginChange.bind(_assertThisInitialized(_this));
    _this.handlePasswordChange = _this.handlePasswordChange.bind(_assertThisInitialized(_this));
    _this.handleEmailChange = _this.handleEmailChange.bind(_assertThisInitialized(_this));
    _this.handleFnChange = _this.handleFnChange.bind(_assertThisInitialized(_this));
    _this.handleImageChanged = _this.handleImageChanged.bind(_assertThisInitialized(_this));
    _this.handleToggleSaveToken = _this.handleToggleSaveToken.bind(_assertThisInitialized(_this));
    _this.handleSubmit = _this.handleSubmit.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(CreateAccountView, [{
    key: "handleLoginChange",
    value: function handleLoginChange(e) {
      this.setState({
        login: e.target.value
      });
    }
  }, {
    key: "handlePasswordChange",
    value: function handlePasswordChange(password) {
      this.setState({
        password: password
      });
    }
  }, {
    key: "handleEmailChange",
    value: function handleEmailChange(e) {
      this.setState({
        email: e.target.value
      });
    }
  }, {
    key: "handleFnChange",
    value: function handleFnChange(e) {
      this.setState({
        fn: e.target.value
      });
    }
  }, {
    key: "handleImageChanged",
    value: function handleImageChanged(img) {
      this.setState({
        imageDataUrl: img
      });
    }
  }, {
    key: "handleToggleSaveToken",
    value: function handleToggleSaveToken() {
      _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_5__["default"].setObject('keep-logged-in', !this.state.saveToken);
      this.setState({
        saveToken: !this.state.saveToken
      });
    }
  }, {
    key: "handleSubmit",
    value: function handleSubmit(e) {
      e.preventDefault();
      this.setState({
        errorCleared: false
      });
      this.props.onCreateAccount(this.state.login.trim(), this.state.password.trim(), Object(_lib_utils_js__WEBPACK_IMPORTED_MODULE_6__["vcard"])(this.state.fn.trim().substring(0, _config_js__WEBPACK_IMPORTED_MODULE_7__["MAX_TITLE_LENGTH"]), this.state.imageDataUrl), {
        'meth': 'email',
        'val': this.state.email
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var submitClasses = 'blue';

      if (this.props.disabled) {
        submitClasses += ' disabled';
      }

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("form", {
        className: "panel-form-column",
        onSubmit: this.handleSubmit
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-column"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "login_prompt"
      }, function (login_prompt) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
          type: "text",
          placeholder: login_prompt,
          autoComplete: "user-name",
          value: _this2.state.login,
          onChange: _this2.handleLoginChange,
          required: true,
          autoFocus: true
        });
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "password_prompt"
      }, function (password_prompt) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_visible_password_jsx__WEBPACK_IMPORTED_MODULE_4__["default"], {
          placeholder: password_prompt,
          autoComplete: "new-password",
          value: _this2.state.password,
          onFinished: _this2.handlePasswordChange,
          required: true
        });
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_avatar_upload_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
        onImageChanged: this.handleImageChanged,
        onError: this.props.onError
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "full_name_prompt",
        defaultMessage: "Full name, e.g. John Doe"
      }, function (full_name_prompt) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
          type: "text",
          placeholder: full_name_prompt,
          autoComplete: "name",
          value: _this2.state.fn,
          onChange: _this2.handleFnChange,
          required: true
        });
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "email_prompt",
        defaultMessage: "Email, e.g. jdoe@example.com"
      }, function (email_prompt) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
          type: "email",
          placeholder: email_prompt,
          autoComplete: "email",
          value: _this2.state.email,
          onChange: _this2.handleEmailChange,
          required: true
        });
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_checkbox_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
        id: "save-token",
        name: "save-token",
        checked: this.state.saveToken,
        onChange: this.handleToggleSaveToken
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "stay_logged_in"
      }, function (stay_logged_in) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
          htmlFor: "save-token"
        }, "\xA0", stay_logged_in);
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "dialog-buttons"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: submitClasses,
        type: "submit"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "button_sign_up",
        defaultMessage: "Sign up"
      }))));
    }
  }]);

  return CreateAccountView;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.PureComponent);


;

/***/ }),

/***/ "./src/views/edit-account-view.jsx":
/*!*****************************************!*\
  !*** ./src/views/edit-account-view.jsx ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return EditAccountView; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tinode-sdk */ "tinode-sdk");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _widgets_avatar_upload_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../widgets/avatar-upload.jsx */ "./src/widgets/avatar-upload.jsx");
/* harmony import */ var _widgets_checkbox_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../widgets/checkbox.jsx */ "./src/widgets/checkbox.jsx");
/* harmony import */ var _widgets_in_place_edit_jsx__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../widgets/in-place-edit.jsx */ "./src/widgets/in-place-edit.jsx");
/* harmony import */ var _widgets_permissions_editor_jsx__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../widgets/permissions-editor.jsx */ "./src/widgets/permissions-editor.jsx");
/* harmony import */ var _widgets_tag_manager_jsx__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../widgets/tag-manager.jsx */ "./src/widgets/tag-manager.jsx");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var _lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../lib/blob-helpers.js */ "./src/lib/blob-helpers.js");
/* harmony import */ var _lib_utils_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../lib/utils.js */ "./src/lib/utils.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }













var EditAccountView = function (_React$Component) {
  _inherits(EditAccountView, _React$Component);

  function EditAccountView(props) {
    var _this;

    _classCallCheck(this, EditAccountView);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(EditAccountView).call(this, props));

    var me = _this.props.tinode.getMeTopic();

    var defacs = me.getDefaultAccess();
    _this.state = {
      fullName: me.public ? me.public.fn : undefined,
      avatar: Object(_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_9__["makeImageUrl"])(me.public ? me.public.photo : null),
      auth: defacs ? defacs.auth : null,
      anon: defacs ? defacs.anon : null,
      tags: me.tags(),
      credentials: me.getCredentials() || [],
      addCredActive: false,
      addCredInvalid: false,
      newCred: '',
      showPermissionEditorFor: undefined,
      previousOnTags: me.onTagsUpdated
    };
    _this.tnNewTags = _this.tnNewTags.bind(_assertThisInitialized(_this));
    _this.tnCredsUpdated = _this.tnCredsUpdated.bind(_assertThisInitialized(_this));
    _this.handleFullNameUpdate = _this.handleFullNameUpdate.bind(_assertThisInitialized(_this));
    _this.handlePasswordUpdate = _this.handlePasswordUpdate.bind(_assertThisInitialized(_this));
    _this.handleImageChanged = _this.handleImageChanged.bind(_assertThisInitialized(_this));
    _this.handleCheckboxClick = _this.handleCheckboxClick.bind(_assertThisInitialized(_this));
    _this.handleCredChange = _this.handleCredChange.bind(_assertThisInitialized(_this));
    _this.handleCredKeyDown = _this.handleCredKeyDown.bind(_assertThisInitialized(_this));
    _this.handleCredEntered = _this.handleCredEntered.bind(_assertThisInitialized(_this));
    _this.handleLaunchPermissionsEditor = _this.handleLaunchPermissionsEditor.bind(_assertThisInitialized(_this));
    _this.handleHidePermissionsEditor = _this.handleHidePermissionsEditor.bind(_assertThisInitialized(_this));
    _this.handlePermissionsChanged = _this.handlePermissionsChanged.bind(_assertThisInitialized(_this));
    _this.handleTagsUpdated = _this.handleTagsUpdated.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(EditAccountView, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var me = this.props.tinode.getMeTopic();
      me.onCredsUpdated = this.tnCredsUpdated;
      me.onTagsUpdated = this.tnNewTags;
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      var me = this.props.tinode.getMeTopic();
      me.onTagsUpdated = this.state.previousOnTags;
      me.onCredsUpdated = undefined;
    }
  }, {
    key: "tnNewTags",
    value: function tnNewTags(tags) {
      this.setState({
        tags: tags
      });
    }
  }, {
    key: "tnCredsUpdated",
    value: function tnCredsUpdated(creds) {
      this.setState({
        credentials: creds || []
      });
    }
  }, {
    key: "handleFullNameUpdate",
    value: function handleFullNameUpdate(fn) {
      fn = fn.trim().substring(0, _config_js__WEBPACK_IMPORTED_MODULE_8__["MAX_TITLE_LENGTH"]);

      if (fn) {
        this.setState({
          fullName: fn
        });
        this.props.onUpdateAccount(undefined, Object(_lib_utils_js__WEBPACK_IMPORTED_MODULE_10__["vcard"])(fn, null));
      }
    }
  }, {
    key: "handlePasswordUpdate",
    value: function handlePasswordUpdate(pwd) {
      this.setState({
        password: pwd
      });
      this.props.onUpdateAccount(pwd);
    }
  }, {
    key: "handleImageChanged",
    value: function handleImageChanged(img) {
      this.setState({
        avatar: img
      });
      this.props.onUpdateAccount(undefined, Object(_lib_utils_js__WEBPACK_IMPORTED_MODULE_10__["vcard"])(null, img || tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default.a.DEL_CHAR));
    }
  }, {
    key: "handleCheckboxClick",
    value: function handleCheckboxClick(what, checked) {
      if (what == 'sound') {
        this.props.onToggleMessageSounds(checked);
      } else if (what == 'alert') {
        this.props.onTogglePushNotifications(checked);
      }
    }
  }, {
    key: "handleCredChange",
    value: function handleCredChange(e) {
      this.setState({
        newCred: e.target.value,
        addCredInvalid: false
      });
    }
  }, {
    key: "handleCredKeyDown",
    value: function handleCredKeyDown(e) {
      if (e.keyCode === 27) {
        this.setState({
          newCred: '',
          addCredActive: false
        });
      } else if (e.keyCode === 13) {
        this.handleCredEntered(e);
      }
    }
  }, {
    key: "handleCredEntered",
    value: function handleCredEntered(e) {
      var value = this.state.newCred.trim();

      if (!value) {
        this.setState({
          addCredActive: false,
          addCredInvalid: false
        });
        return;
      }

      var val = Object(_lib_utils_js__WEBPACK_IMPORTED_MODULE_10__["asPhone"])(value);
      var method;

      if (val) {
        method = 'tel';
      } else {
        val = Object(_lib_utils_js__WEBPACK_IMPORTED_MODULE_10__["asEmail"])(value);

        if (val) {
          method = 'email';
        }
      }

      if (method) {
        this.props.onCredAdd(method, val);
        this.setState({
          addCredActive: false,
          newCred: ''
        });
      } else {
        this.setState({
          addCredInvalid: true
        });
      }
    }
  }, {
    key: "handleLaunchPermissionsEditor",
    value: function handleLaunchPermissionsEditor(which) {
      this.setState({
        showPermissionEditorFor: which,
        editedPermissions: this.state[which]
      });
    }
  }, {
    key: "handleHidePermissionsEditor",
    value: function handleHidePermissionsEditor() {
      this.setState({
        showPermissionEditorFor: undefined
      });
    }
  }, {
    key: "handlePermissionsChanged",
    value: function handlePermissionsChanged(perm) {
      var defacs = {};
      defacs[this.state.showPermissionEditorFor] = perm;
      this.props.onUpdateAccount(undefined, undefined, defacs);
      var newState = {
        showPermissionEditorFor: undefined
      };
      newState[this.state.showPermissionEditorFor] = perm;
      this.setState(newState);
    }
  }, {
    key: "handleTagsUpdated",
    value: function handleTagsUpdated(tags) {
      if (Object(_lib_utils_js__WEBPACK_IMPORTED_MODULE_10__["arrayEqual"])(this.state.tags.slice(0), tags.slice(0))) {
        return;
      }

      this.props.onUpdateTags(tags);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var credentials = [];
      this.state.credentials.map(function (cred) {
        credentials.push(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          key: cred.meth + ":" + cred.val + ":" + cred.done
        }, cred.meth, ": ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tt", null, cred.val), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", null, " ", !cred.done ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
          href: "#",
          onClick: function onClick(e) {
            e.preventDefault();

            _this2.props.onCredConfirm(cred.meth, cred.val);
          }
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
          id: "validate_credential_action",
          defaultMessage: "confirm"
        })) : null, " ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
          href: "#",
          onClick: function onClick(e) {
            e.preventDefault();

            _this2.props.onCredDelete(cred.meth, cred.val);
          }
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
          className: "material-icons gray"
        }, "delete_outline")))));
      });
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, this.state.showPermissionEditorFor ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_permissions_editor_jsx__WEBPACK_IMPORTED_MODULE_6__["default"], {
        mode: this.state.editedPermissions,
        skip: "O",
        onSubmit: this.handlePermissionsChanged,
        onCancel: this.handleHidePermissionsEditor
      }) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        id: "edit-account",
        className: "scrollable-panel"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-column"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "small"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "label_your_name",
        defaultMessage: "Your name"
      }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "full_name_prompt"
      }, function (full_name_placeholder) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_in_place_edit_jsx__WEBPACK_IMPORTED_MODULE_5__["default"], {
          placeholder: full_name_placeholder,
          value: _this2.state.fullName,
          onFinished: _this2.handleFullNameUpdate
        });
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "small"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "label_password",
        defaultMessage: "Password"
      }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "password_unchanged_prompt",
        defaultMessage: "Unchanged"
      }, function (password_unchanged) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_in_place_edit_jsx__WEBPACK_IMPORTED_MODULE_5__["default"], {
          placeholder: password_unchanged,
          type: "password",
          onFinished: _this2.handlePasswordUpdate
        });
      }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_avatar_upload_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
        avatar: this.state.avatar,
        uid: this.props.myUserId,
        title: this.state.fullName,
        onImageChanged: this.handleImageChanged,
        onError: this.props.onError
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "hr"
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        htmlFor: "message-sound"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "label_message_sound",
        defaultMessage: "Message sound:"
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_checkbox_jsx__WEBPACK_IMPORTED_MODULE_4__["default"], {
        name: "sound",
        id: "message-sound",
        checked: this.props.messageSounds,
        onChange: this.handleCheckboxClick
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        htmlFor: "desktop-alerts"
      }, this.props.desktopAlertsEnabled ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "label_push_notifications",
        defaultMessage: "Notification alerts:"
      }) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "label_push_notifications_disabled",
        defaultMessage: "Notification alerts (requires HTTPS):"
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_checkbox_jsx__WEBPACK_IMPORTED_MODULE_4__["default"], {
        name: "alert",
        id: "desktop-alerts",
        checked: this.props.desktopAlerts,
        onChange: this.props.desktopAlertsEnabled ? this.handleCheckboxClick : null
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "hr"
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "title_tag_manager",
        defaultMessage: "Tags (user discovery)"
      }, function (title_tag_manager) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_tag_manager_jsx__WEBPACK_IMPORTED_MODULE_7__["default"], {
          title: title_tag_manager,
          activated: false,
          tags: _this2.state.tags,
          onSubmit: _this2.handleTagsUpdated
        });
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "hr"
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-column"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "small"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "label_user_contacts",
        defaultMessage: "Contacts:"
      }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "quoted"
      }, credentials, this.state.addCredActive ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        type: "text",
        value: this.state.value,
        className: this.state.addCredInvalid ? "invalid" : null,
        placeholder: "Phone number or email",
        required: "required",
        autoFocus: true,
        onChange: this.handleCredChange,
        onKeyDown: this.handleCredKeyDown,
        onBlur: this.handleCredEntered
      }) : null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "#",
        onClick: function onClick(e) {
          e.preventDefault();

          _this2.setState({
            addCredActive: true
          });
        }
      }, "+ Add another")))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "hr"
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-column"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "small"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "label_user_id",
        defaultMessage: "Address:"
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tt", null, this.props.myUserId)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "small"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "label_default_access_mode",
        defaultMessage: "Default access mode:"
      }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "quoted"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, "Auth: ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tt", {
        className: "clickable",
        onClick: this.handleLaunchPermissionsEditor.bind(this, 'auth')
      }, this.state.auth)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, "Anon: ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tt", {
        className: "clickable",
        onClick: this.handleLaunchPermissionsEditor.bind(this, 'anon')
      }, this.state.anon)))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "hr"
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-column"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "#",
        className: "red flat-button",
        onClick: function onClick(e) {
          e.preventDefault();

          _this2.props.onLogout();
        }
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons"
      }, "exit_to_app"), " \xA0", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "button_logout",
        defaultMessage: "Logout"
      }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "hr"
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-column"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "small"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "label_legal",
        defaultMessage: "Legal"
      }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "quoted"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: _config_js__WEBPACK_IMPORTED_MODULE_8__["LINK_CONTACT_US"],
        className: "flat-button",
        target: "_blank"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons"
      }, "email"), " \xA0", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "link_contact_us",
        defaultMessage: "Contact Us"
      }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "quoted"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: _config_js__WEBPACK_IMPORTED_MODULE_8__["LINK_TERMS_OF_SERVICE"],
        className: "flat-button",
        target: "_blank"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons"
      }, "description"), " \xA0", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "link_terms_of_service",
        defaultMessage: "Terms of Service"
      }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "quoted"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: _config_js__WEBPACK_IMPORTED_MODULE_8__["LINK_PRIVACY_POLICY"],
        className: "flat-button",
        target: "_blank"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons"
      }, "policy"), " \xA0", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "link_privacy_policy",
        defaultMessage: "Privacy Policy"
      }))))));
    }
  }]);

  return EditAccountView;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);


;

/***/ }),

/***/ "./src/views/info-view.jsx":
/*!*********************************!*\
  !*** ./src/views/info-view.jsx ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tinode-sdk */ "tinode-sdk");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _widgets_avatar_upload_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../widgets/avatar-upload.jsx */ "./src/widgets/avatar-upload.jsx");
/* harmony import */ var _widgets_checkbox_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../widgets/checkbox.jsx */ "./src/widgets/checkbox.jsx");
/* harmony import */ var _widgets_contact_list_jsx__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../widgets/contact-list.jsx */ "./src/widgets/contact-list.jsx");
/* harmony import */ var _widgets_error_panel_jsx__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../widgets/error-panel.jsx */ "./src/widgets/error-panel.jsx");
/* harmony import */ var _widgets_group_manager_jsx__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../widgets/group-manager.jsx */ "./src/widgets/group-manager.jsx");
/* harmony import */ var _widgets_in_place_edit_jsx__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../widgets/in-place-edit.jsx */ "./src/widgets/in-place-edit.jsx");
/* harmony import */ var _widgets_menu_cancel_jsx__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../widgets/menu-cancel.jsx */ "./src/widgets/menu-cancel.jsx");
/* harmony import */ var _widgets_more_button_jsx__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../widgets/more-button.jsx */ "./src/widgets/more-button.jsx");
/* harmony import */ var _widgets_permissions_editor_jsx__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../widgets/permissions-editor.jsx */ "./src/widgets/permissions-editor.jsx");
/* harmony import */ var _widgets_tag_manager_jsx__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../widgets/tag-manager.jsx */ "./src/widgets/tag-manager.jsx");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var _lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../lib/blob-helpers.js */ "./src/lib/blob-helpers.js");
/* harmony import */ var _lib_utils_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../lib/utils.js */ "./src/lib/utils.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

















var messages = Object(react_intl__WEBPACK_IMPORTED_MODULE_1__["defineMessages"])({
  requested: {
    "id": "requested_permissions",
    "defaultMessage": "Requested"
  },
  granted: {
    "id": "granted_permissions",
    "defaultMessage": "Granted"
  },
  edit_permissions: {
    "id": "menu_item_edit_permissions",
    "defaultMessage": "Edit permissions"
  },
  other_user: {
    "id": "label_other_user",
    "defaultMessage": "Other"
  },
  clear_messages: {
    "id": "action_clear_messages",
    "defaultMessage": "Clear Messages"
  },
  clear_messages_warning: {
    "id": "clear_messages_warning",
    "defaultMessage": "Are you sure you want to clear all messages? It cannot be undone."
  },
  delete_messages: {
    "id": "action_delete_messages",
    "defaultMessage": "Clear Messages for All"
  },
  delete_messages_warning: {
    "id": "delete_messages_warning",
    "defaultMessage": "Are you sure you want to delete all messages for everyone? It cannot be undone."
  },
  leave_chat: {
    "id": "action_leave_chat",
    "defaultMessage": "Leave Conversation"
  },
  leave_chat_warning: {
    "id": "leave_chat_warning",
    "defaultMessage": "Are you sure you want to leave this conversation?"
  },
  block_contact: {
    "id": "action_block_contact",
    "defaultMessage": "Block Contact"
  },
  block_contact_warning: {
    "id": "block_contact_warning",
    "defaultMessage": "Are you sure you want to block this contact?"
  },
  report_chat: {
    "id": "action_report_chat",
    "defaultMessage": "Report Conversation"
  },
  report_chat_warning: {
    "id": "report_chat_warning",
    "defaultMessage": "Are you sure you want to block and report this conversation?"
  }
});

var InfoView = function (_React$Component) {
  _inherits(InfoView, _React$Component);

  function InfoView(props) {
    var _this;

    _classCallCheck(this, InfoView);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(InfoView).call(this, props));
    _this.state = {
      topic: null,
      owner: false,
      admin: false,
      sharer: false,
      deleter: false,
      muted: false,
      address: null,
      groupTopic: undefined,
      fullName: undefined,
      avatar: null,
      private: null,
      selectedContact: null,
      access: null,
      modeGiven: null,
      modeWant: null,
      modeGiven2: null,
      modeWant2: null,
      auth: null,
      anon: null,
      contactList: [],
      tags: [],
      showMemberPanel: false,
      showPermissionEditorFor: undefined,
      moreInfoExpanded: false,
      previousMetaDesc: undefined,
      previousSubsUpdated: undefined,
      previousTagsUpdated: undefined
    };
    _this.resetSubs = _this.resetSubs.bind(_assertThisInitialized(_this));
    _this.resetDesc = _this.resetDesc.bind(_assertThisInitialized(_this));
    _this.onMetaDesc = _this.onMetaDesc.bind(_assertThisInitialized(_this));
    _this.onSubsUpdated = _this.onSubsUpdated.bind(_assertThisInitialized(_this));
    _this.onTagsUpdated = _this.onTagsUpdated.bind(_assertThisInitialized(_this));
    _this.handleFullNameUpdate = _this.handleFullNameUpdate.bind(_assertThisInitialized(_this));
    _this.handlePrivateUpdate = _this.handlePrivateUpdate.bind(_assertThisInitialized(_this));
    _this.handleImageChanged = _this.handleImageChanged.bind(_assertThisInitialized(_this));
    _this.handleMuted = _this.handleMuted.bind(_assertThisInitialized(_this));
    _this.handlePermissionsChanged = _this.handlePermissionsChanged.bind(_assertThisInitialized(_this));
    _this.handleLaunchPermissionsEditor = _this.handleLaunchPermissionsEditor.bind(_assertThisInitialized(_this));
    _this.handleHidePermissionsEditor = _this.handleHidePermissionsEditor.bind(_assertThisInitialized(_this));
    _this.handleShowAddMembers = _this.handleShowAddMembers.bind(_assertThisInitialized(_this));
    _this.handleHideAddMembers = _this.handleHideAddMembers.bind(_assertThisInitialized(_this));
    _this.handleMemberUpdateRequest = _this.handleMemberUpdateRequest.bind(_assertThisInitialized(_this));
    _this.handleDeleteMessages = _this.handleDeleteMessages.bind(_assertThisInitialized(_this));
    _this.handleLeave = _this.handleLeave.bind(_assertThisInitialized(_this));
    _this.handleBlock = _this.handleBlock.bind(_assertThisInitialized(_this));
    _this.handleReport = _this.handleReport.bind(_assertThisInitialized(_this));
    _this.handleMemberSelected = _this.handleMemberSelected.bind(_assertThisInitialized(_this));
    _this.handleMoreInfo = _this.handleMoreInfo.bind(_assertThisInitialized(_this));
    _this.handleTagsUpdated = _this.handleTagsUpdated.bind(_assertThisInitialized(_this));
    _this.handleContextMenu = _this.handleContextMenu.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(InfoView, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(props) {
      var topic = this.props.tinode.getTopic(props.topic);

      if (!topic) {
        return;
      }

      if (this.onMetaDesc != topic.onMetaDesc) {
        this.previousMetaDesc = topic.onMetaDesc;
        topic.onMetaDesc = this.onMetaDesc;
        this.previousSubsUpdated = topic.onSubsUpdated;
        topic.onSubsUpdated = this.onSubsUpdated;

        if (topic.getType() == 'grp') {
          this.previousTagsUpdated = topic.onTagsUpdated;
          topic.onTagsUpdated = this.onTagsUpdated;
        } else {
          this.previousTagsUpdated = undefined;
        }
      }

      if (this.state.topic != props.topic) {
        this.setState({
          topic: props.topic
        });
        this.resetDesc(topic, props);
        this.resetSubs(topic, props);
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      var topic = this.props.tinode.getTopic(this.props.topic);

      if (!topic) {
        return;
      }

      this.setState({
        topic: null
      });
      topic.onMetaDesc = this.previousMetaDesc;
      topic.onSubsUpdated = this.previousSubsUpdated;
      topic.onTagsUpdated = this.previousTagsUpdated;
    }
  }, {
    key: "resetSubs",
    value: function resetSubs(topic, props) {
      var newState = {
        contactList: []
      };

      if (topic.getType() == 'p2p') {
        var user2 = topic.subscriber(props.topic);

        if (user2) {
          newState.modeGiven2 = user2.acs.getGiven();
          newState.modeWant2 = user2.acs.getWant();
        } else {
          newState.modeGiven2 = _config_js__WEBPACK_IMPORTED_MODULE_13__["NO_ACCESS_MODE"];
          newState.modeWant2 = _config_js__WEBPACK_IMPORTED_MODULE_13__["NO_ACCESS_MODE"];
        }
      } else {
        topic.subscribers(function (sub) {
          newState.contactList.push(sub);
        }, this);
      }

      this.setState(newState);
    }
  }, {
    key: "resetDesc",
    value: function resetDesc(topic, props) {
      var defacs = topic.getDefaultAccess() || {};
      var acs = topic.getAccessMode();
      this.setState({
        owner: acs && acs.isOwner(),
        admin: acs && acs.isAdmin(),
        sharer: acs && acs.isSharer(),
        deleter: acs && acs.isDeleter(),
        muted: acs && acs.isMuted(),
        fullName: topic.public ? topic.public.fn : undefined,
        avatar: Object(_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_14__["makeImageUrl"])(topic.public ? topic.public.photo : null),
        private: topic.private ? topic.private.comment : null,
        address: topic.name,
        groupTopic: topic.getType() == 'grp',
        showMemberPanel: false,
        access: acs ? acs.getMode() : undefined,
        modeGiven: acs ? acs.getGiven() : undefined,
        modeWant: acs ? acs.getWant() : undefined,
        auth: defacs.auth,
        anon: defacs.anon
      });

      if (topic.getType() == 'grp' && acs && acs.isOwner()) {
        topic.getMeta(topic.startMetaQuery().withTags().build());
      }
    }
  }, {
    key: "onMetaDesc",
    value: function onMetaDesc(desc) {
      var topic = this.props.tinode.getTopic(this.props.topic);

      if (!topic) {
        return;
      }

      this.resetDesc(topic, this.props);

      if (this.previousMetaDesc && this.previousMetaDesc != this.onMetaDesc) {
        this.previousMetaDesc(desc);
      }
    }
  }, {
    key: "onSubsUpdated",
    value: function onSubsUpdated(subs) {
      var topic = this.props.tinode.getTopic(this.props.topic);

      if (!topic) {
        return;
      }

      this.resetSubs(topic, this.props);

      if (this.previousSubsUpdated && this.previousSubsUpdated != this.onSubsUpdated) {
        this.previousSubsUpdated(subs);
      }
    }
  }, {
    key: "onTagsUpdated",
    value: function onTagsUpdated(tags) {
      this.setState({
        tags: tags
      });

      if (this.previousTagsUpdated && this.previousTagsUpdated != this.onTagsUpdated) {
        this.previousTagsUpdated();
      }
    }
  }, {
    key: "handleFullNameUpdate",
    value: function handleFullNameUpdate(fn) {
      fn = fn.trim().substring(0, _config_js__WEBPACK_IMPORTED_MODULE_13__["MAX_TITLE_LENGTH"]);

      if (this.state.fullName !== fn) {
        this.setState({
          fullName: fn
        });
        this.props.onTopicDescUpdate(this.props.topic, Object(_lib_utils_js__WEBPACK_IMPORTED_MODULE_15__["vcard"])(fn, null), null);
      }
    }
  }, {
    key: "handlePrivateUpdate",
    value: function handlePrivateUpdate(comment) {
      comment = comment.trim().substring(0, _config_js__WEBPACK_IMPORTED_MODULE_13__["MAX_TITLE_LENGTH"]);

      if (this.state.private !== comment) {
        this.setState({
          private: comment
        });
        this.props.onTopicDescUpdate(this.props.topic, null, comment || tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default.a.DEL_CHAR);
      }
    }
  }, {
    key: "handleImageChanged",
    value: function handleImageChanged(img) {
      this.setState({
        avatar: img
      });
      this.props.onTopicDescUpdate(this.props.topic, Object(_lib_utils_js__WEBPACK_IMPORTED_MODULE_15__["vcard"])(null, img || tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default.a.DEL_CHAR), null);
    }
  }, {
    key: "handleMuted",
    value: function handleMuted(ignored, checked) {
      this.setState({
        muted: checked
      });
      this.props.onChangePermissions(this.props.topic, checked ? '-P' : '+P');
    }
  }, {
    key: "handlePermissionsChanged",
    value: function handlePermissionsChanged(perm) {
      switch (this.state.showPermissionEditorFor) {
        case 'auth':
          this.props.onTopicDescUpdate(this.props.topic, null, null, {
            auth: perm
          });
          break;

        case 'anon':
          this.props.onTopicDescUpdate(this.props.topic, null, null, {
            anon: perm
          });
          break;

        case 'mode':
        case 'want':
          this.props.onChangePermissions(this.props.topic, perm);
          break;

        case 'given':
          this.props.onChangePermissions(this.props.topic, perm, this.props.topic);
          break;

        case 'user':
          this.props.onChangePermissions(this.props.topic, perm, this.state.userPermissionsEdited);
          break;
      }

      this.setState({
        showPermissionEditorFor: undefined
      });
    }
  }, {
    key: "handleLaunchPermissionsEditor",
    value: function handleLaunchPermissionsEditor(which, uid) {
      var formatMessage = this.props.intl.formatMessage;
      var toEdit, toCompare, toSkip, titleEdit, titleCompare, userTitle, userAvatar;

      switch (which) {
        case 'mode':
          toEdit = this.state.access;
          break;

        case 'want':
          toEdit = this.state.modeWant;
          toCompare = this.state.modeGiven;
          toSkip = this.state.groupTopic ? 'O' : 'ASDO';
          titleEdit = formatMessage(messages.requested);
          titleCompare = formatMessage(messages.granted);
          break;

        case 'given':
          toEdit = this.state.modeGiven2;
          toCompare = this.state.modeWant2;
          toSkip = this.state.groupTopic ? this.state.owner ? '' : 'O' : 'ASDO';
          titleEdit = formatMessage(messages.granted);
          titleCompare = formatMessage(messages.requested);
          break;

        case 'auth':
          toEdit = this.state.auth;
          toSkip = 'O';
          break;

        case 'anon':
          toEdit = this.state.anon;
          toSkip = 'O';
          break;

        case 'user':
          {
            var topic = this.props.tinode.getTopic(this.props.topic);

            if (!topic) {
              return;
            }

            var user = topic.subscriber(uid);

            if (!user || !user.acs) {
              return;
            }

            toEdit = user.acs.getGiven();
            toCompare = user.acs.getWant();
            toSkip = this.state.owner ? '' : 'O';
            titleEdit = formatMessage(messages.granted);
            titleCompare = formatMessage(messages.requested);

            if (user.public) {
              userTitle = user.public.fn;
              userAvatar = user.public.photo;
            }

            break;
          }

        default:
          console.log("Unknown permission editing mode '" + which + "'");
          break;
      }

      this.setState({
        showPermissionEditorFor: which,
        userPermissionsEdited: uid,
        userPermissionsTitle: userTitle,
        userPermissionsAvatar: userAvatar,
        editedPermissions: toEdit,
        immutablePermissions: toCompare,
        editedPermissionsTitle: titleEdit,
        immutablePermissionsTitle: titleCompare,
        editedPermissionsSkipped: toSkip
      });
    }
  }, {
    key: "handleHidePermissionsEditor",
    value: function handleHidePermissionsEditor() {
      this.setState({
        showPermissionEditorFor: undefined
      });
    }
  }, {
    key: "handleShowAddMembers",
    value: function handleShowAddMembers(e) {
      e.preventDefault();
      this.props.onInitFind();
      this.setState({
        showMemberPanel: true
      });
    }
  }, {
    key: "handleHideAddMembers",
    value: function handleHideAddMembers() {
      this.setState({
        showMemberPanel: false
      });
    }
  }, {
    key: "handleMemberUpdateRequest",
    value: function handleMemberUpdateRequest(members, added, removed) {
      this.props.onMemberUpdateRequest(this.props.topic, added, removed);
      this.setState({
        showMemberPanel: false
      });
    }
  }, {
    key: "handleDeleteMessages",
    value: function handleDeleteMessages(e) {
      var _this2 = this;

      e.preventDefault();
      var formatMessage = this.props.intl.formatMessage;
      this.props.onShowAlert(formatMessage(this.state.deleter ? messages.delete_messages : messages.clear_messages), formatMessage(this.state.deleter ? messages.delete_messages_warning : messages.clear_messages_warning), function () {
        _this2.props.onDeleteMessages(_this2.props.topic);
      }, null, true, null);
    }
  }, {
    key: "handleLeave",
    value: function handleLeave(e) {
      var _this3 = this;

      e.preventDefault();
      var formatMessage = this.props.intl.formatMessage;
      this.props.onShowAlert(formatMessage(messages.leave_chat), formatMessage(messages.leave_chat_warning), function () {
        _this3.props.onLeaveTopic(_this3.props.topic);
      }, null, true, null);
    }
  }, {
    key: "handleBlock",
    value: function handleBlock(e) {
      var _this4 = this;

      e.preventDefault();
      var formatMessage = this.props.intl.formatMessage;
      this.props.onShowAlert(formatMessage(messages.block_contact), formatMessage(messages.block_contact_warning), function () {
        _this4.props.onBlockTopic(_this4.props.topic);
      }, null, true, null);
    }
  }, {
    key: "handleReport",
    value: function handleReport(e) {
      var _this5 = this;

      e.preventDefault();
      var formatMessage = this.props.intl.formatMessage;
      this.props.onShowAlert(formatMessage(messages.report_chat), formatMessage(messages.report_chat_warning), function () {
        _this5.props.onReportTopic(_this5.props.topic);
      }, null, true, null);
    }
  }, {
    key: "handleMemberSelected",
    value: function handleMemberSelected(uid) {
      this.setState({
        selectedContact: uid
      });
    }
  }, {
    key: "handleMoreInfo",
    value: function handleMoreInfo(open) {
      this.setState({
        moreInfoExpanded: open
      });
    }
  }, {
    key: "handleTagsUpdated",
    value: function handleTagsUpdated(tags) {
      if (!Object(_lib_utils_js__WEBPACK_IMPORTED_MODULE_15__["arrayEqual"])(this.state.tags.slice(0), tags.slice(0))) {
        this.props.onTopicTagsUpdate(this.props.topic, tags);
      }
    }
  }, {
    key: "handleContextMenu",
    value: function handleContextMenu(params) {
      var formatMessage = this.props.intl.formatMessage;
      var instance = this;
      var topic = this.props.tinode.getTopic(this.props.topic);

      if (!topic) {
        return;
      }

      var user = topic.subscriber(params.topicName);

      if (!user || !user.acs) {
        return;
      }

      var menuItems = [{
        title: formatMessage(messages.edit_permissions),
        handler: function handler() {
          instance.handleLaunchPermissionsEditor('user', params.topicName);
        }
      }, 'member_delete', user.acs.isMuted() ? 'member_unmute' : 'member_mute', user.acs.isJoiner() ? 'member_block' : 'member_unblock'];
      this.props.showContextMenu({
        topicName: this.props.topic,
        x: params.x,
        y: params.y,
        user: params.topicName
      }, menuItems);
    }
  }, {
    key: "render",
    value: function render() {
      var _this6 = this;

      var formatMessage = this.props.intl.formatMessage;
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        id: "info-view"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "caption-panel",
        id: "info-caption-panel"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-title",
        id: "info-title"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "title_info",
        defaultMessage: "Info"
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_menu_cancel_jsx__WEBPACK_IMPORTED_MODULE_9__["default"], {
        onCancel: this.props.onCancel
      }))), this.props.displayMobile ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_error_panel_jsx__WEBPACK_IMPORTED_MODULE_6__["default"], {
        level: this.props.errorLevel,
        text: this.props.errorText,
        onClearError: this.props.onError
      }) : null, this.state.showMemberPanel ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_group_manager_jsx__WEBPACK_IMPORTED_MODULE_7__["default"], {
        members: this.state.contactList,
        requiredMember: this.props.myUserId,
        keepInitialMembers: !this.state.admin && !this.state.owner,
        myUserId: this.props.myUserId,
        contacts: this.props.searchableContacts,
        onCancel: this.handleHideAddMembers,
        onSubmit: this.handleMemberUpdateRequest
      }) : this.state.showPermissionEditorFor ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_permissions_editor_jsx__WEBPACK_IMPORTED_MODULE_11__["default"], {
        mode: this.state.editedPermissions,
        compare: this.state.immutablePermissions,
        skip: this.state.editedPermissionsSkipped,
        modeTitle: this.state.editedPermissionsTitle,
        compareTitle: this.state.immutablePermissionsTitle,
        userTitle: this.state.userPermissionsTitle,
        item: this.state.userPermissionsEdited,
        userAvatar: this.state.userPermissionsAvatar,
        onSubmit: this.handlePermissionsChanged,
        onCancel: this.handleHidePermissionsEditor
      }) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        id: "info-view-content",
        className: "scrollable-panel"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-column"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "small"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "label_topic_name",
        defaultMessage: "Name"
      }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_in_place_edit_jsx__WEBPACK_IMPORTED_MODULE_8__["default"], {
        placeholder: this.state.groupTopic ? "Group name" : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", null, "Unknown"),
        readOnly: !this.state.owner,
        value: this.state.fullName,
        required: true,
        onFinished: this.handleFullNameUpdate
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "small"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "label_private",
        defaultMessage: "Private comment"
      }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "private_editing_placeholder",
        defaultMessage: "Visible to you only"
      }, function (private_placeholder) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_in_place_edit_jsx__WEBPACK_IMPORTED_MODULE_8__["default"], {
          placeholder: private_placeholder,
          value: _this6.state.private,
          onFinished: _this6.handlePrivateUpdate
        });
      }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_avatar_upload_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
        avatar: this.state.avatar,
        readOnly: !this.state.owner,
        uid: this.props.topic,
        title: this.state.fullName,
        onImageChanged: this.handleImageChanged,
        onError: this.props.onError
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "hr"
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-column"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "label_muting_topic",
        defaultMessage: "Muted:"
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_checkbox_jsx__WEBPACK_IMPORTED_MODULE_4__["default"], {
        name: "P",
        checked: this.state.muted,
        onChange: this.handleMuted
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "action_more",
        defaultMessage: "More"
      }, function (more) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_more_button_jsx__WEBPACK_IMPORTED_MODULE_10__["default"], {
          title: more,
          open: _this6.state.moreInfoExpanded,
          onToggle: _this6.handleMoreInfo
        });
      }), this.state.moreInfoExpanded ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-column"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "label_user_id"
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tt", null, this.state.address)), this.state.groupTopic ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "label_your_permissions",
        defaultMessage: "Your permissions:"
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tt", {
        className: "clickable",
        onClick: this.handleLaunchPermissionsEditor.bind(this, 'want')
      }, this.state.access)) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "small"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "label_permissions",
        defaultMessage: "Permissions:"
      }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "quoted"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "label_you",
        defaultMessage: "You:"
      }), " \xA0", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tt", {
        className: "clickable",
        onClick: this.handleLaunchPermissionsEditor.bind(this, 'want')
      }, this.state.access)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, this.state.fullName ? this.state.fullName : formatMessage(messages.other_user), ": \xA0", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tt", {
        className: "clickable",
        onClick: this.handleLaunchPermissionsEditor.bind(this, 'given')
      }, this.state.modeGiven2)))), this.state.sharer && (this.state.auth || this.state.anon) ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "small"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "label_default_access",
        defaultMessage: "Default access mode:"
      }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "quoted"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, "Auth: ", this.state.admin ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tt", {
        className: "clickable",
        onClick: this.handleLaunchPermissionsEditor.bind(this, 'auth')
      }, this.state.auth) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tt", null, this.state.auth)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, "Anon: ", this.state.admin ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tt", {
        className: "clickable",
        onClick: this.handleLaunchPermissionsEditor.bind(this, 'anon')
      }, this.state.anon) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tt", null, this.state.anon)))) : null) : null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "hr"
      }), this.state.owner ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "title_tag_manager"
      }, function (tags) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_tag_manager_jsx__WEBPACK_IMPORTED_MODULE_12__["default"], {
          title: tags,
          tags: _this6.state.tags,
          activated: false,
          onSubmit: _this6.handleTagsUpdated
        });
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "hr"
      })) : null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-column"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "#",
        className: "flat-button",
        onClick: this.handleDeleteMessages
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons"
      }, "delete_outline"), " \xA0", formatMessage(this.state.deleter ? messages.delete_messages : messages.clear_messages)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "#",
        className: "red flat-button",
        onClick: this.handleLeave
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons"
      }, "exit_to_app"), " \xA0", formatMessage(messages.leave_chat)), !this.state.groupTopic ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "#",
        className: "red flat-button",
        onClick: this.handleBlock
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons"
      }, "block"), " \xA0", formatMessage(messages.block_contact)) : null, !this.state.owner ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "#",
        className: "red flat-button",
        onClick: this.handleReport
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons"
      }, "report"), " \xA0", formatMessage(messages.report_chat)) : null), this.state.groupTopic ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "hr"
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-column"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "small"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "label_group_members",
        defaultMessage: "Group members:"
      }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-row"
      }, this.state.sharer ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "#",
        className: "flat-button",
        onClick: this.handleShowAddMembers
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons"
      }, "person_add"), " \xA0", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "button_add_members",
        defaultMessage: "Add members"
      })) : null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "group_has_no_members",
        defaultMessage: "No members"
      }, function (no_members) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_contact_list_jsx__WEBPACK_IMPORTED_MODULE_5__["default"], {
          contacts: _this6.state.contactList,
          myUserId: _this6.props.myUserId,
          emptyListMessage: no_members,
          topicSelected: _this6.state.selectedContact,
          showOnline: false,
          showUnread: false,
          showMode: true,
          noScroll: true,
          onTopicSelected: _this6.handleMemberSelected,
          showContextMenu: _this6.state.admin ? _this6.handleContextMenu : false
        });
      }))) : null));
    }
  }]);

  return InfoView;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);

;
/* harmony default export */ __webpack_exports__["default"] = (Object(react_intl__WEBPACK_IMPORTED_MODULE_1__["injectIntl"])(InfoView));

/***/ }),

/***/ "./src/views/login-view.jsx":
/*!**********************************!*\
  !*** ./src/views/login-view.jsx ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return LoginView; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _widgets_checkbox_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../widgets/checkbox.jsx */ "./src/widgets/checkbox.jsx");
/* harmony import */ var _widgets_visible_password_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../widgets/visible-password.jsx */ "./src/widgets/visible-password.jsx");
/* harmony import */ var _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../lib/local-storage.js */ "./src/lib/local-storage.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }







var LoginView = function (_React$Component) {
  _inherits(LoginView, _React$Component);

  function LoginView(props) {
    var _this;

    _classCallCheck(this, LoginView);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(LoginView).call(this, props));
    _this.state = {
      login: props.login,
      password: '',
      hostName: props.serverAddress,
      saveToken: _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_4__["default"].getObject('keep-logged-in')
    };
    _this.handleLoginChange = _this.handleLoginChange.bind(_assertThisInitialized(_this));
    _this.handlePasswordChange = _this.handlePasswordChange.bind(_assertThisInitialized(_this));
    _this.handleToggleSaveToken = _this.handleToggleSaveToken.bind(_assertThisInitialized(_this));
    _this.handleSubmit = _this.handleSubmit.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(LoginView, [{
    key: "handleLoginChange",
    value: function handleLoginChange(e) {
      this.setState({
        login: e.target.value
      });
    }
  }, {
    key: "handlePasswordChange",
    value: function handlePasswordChange(e) {
      this.setState({
        password: e.target.value
      });
    }
  }, {
    key: "handleToggleSaveToken",
    value: function handleToggleSaveToken() {
      _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_4__["default"].setObject('keep-logged-in', !this.state.saveToken);
      this.setState({
        saveToken: !this.state.saveToken
      });
    }
  }, {
    key: "handleSubmit",
    value: function handleSubmit(e) {
      e.preventDefault();
      this.props.onLogin(this.state.login.trim(), this.state.password.trim());
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var submitClasses = 'blue';

      if (this.props.disabled) {
        submitClasses += ' disabled';
      }

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("form", {
        id: "login-form",
        onSubmit: this.handleSubmit
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "login_prompt",
        defaultMessage: "Login"
      }, function (login_prompt) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
          type: "text",
          id: "inputLogin",
          placeholder: login_prompt,
          autoComplete: "username",
          autoCorrect: "off",
          autoCapitalize: "none",
          value: _this2.state.login,
          onChange: _this2.handleLoginChange,
          required: true,
          autoFocus: true
        });
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "password_prompt",
        defaultMessage: "Password"
      }, function (password_prompt) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_visible_password_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
          type: "password",
          id: "inputPassword",
          placeholder: password_prompt,
          autoComplete: "current-password",
          value: _this2.state.password,
          onChange: _this2.handlePasswordChange,
          required: true
        });
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_checkbox_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
        id: "save-token",
        name: "save-token",
        checked: this.state.saveToken,
        onChange: this.handleToggleSaveToken
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        htmlFor: "save-token"
      }, "\xA0", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "stay_logged_in",
        defaultMessage: "Stay logged in"
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "#reset"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "forgot_password_link",
        defaultMessage: "Forgot password?"
      }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "dialog-buttons"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: submitClasses,
        type: "submit"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "button_sign_in",
        defaultMessage: "Sign in"
      }))));
    }
  }]);

  return LoginView;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);


;

/***/ }),

/***/ "./src/views/logo-view.jsx":
/*!*********************************!*\
  !*** ./src/views/logo-view.jsx ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return LogoView; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tinode-sdk */ "tinode-sdk");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }






var LogoView = function (_React$PureComponent) {
  _inherits(LogoView, _React$PureComponent);

  function LogoView() {
    _classCallCheck(this, LogoView);

    return _possibleConstructorReturn(this, _getPrototypeOf(LogoView).apply(this, arguments));
  }

  _createClass(LogoView, [{
    key: "render",
    value: function render() {
      var version = _config_js__WEBPACK_IMPORTED_MODULE_3__["APP_NAME"] + ' (' + tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default.a.getLibrary() + ')';
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        id: "dummy-view",
        className: this.props.hideSelf ? 'nodisplay' : null
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "https://github.com/tinode/chat/"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("img", {
        id: "logo",
        alt: "logo",
        src: "img/logo.svg"
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h2", null, "Tinode Web")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "label_client",
        defaultMessage: "Client:"
      }), " ", version), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "label_server",
        defaultMessage: "Server:"
      }), " ", this.props.serverVersion, " (", this.props.serverAddress, ")")));
    }
  }]);

  return LogoView;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.PureComponent);


;

/***/ }),

/***/ "./src/views/messages-view.jsx":
/*!*************************************!*\
  !*** ./src/views/messages-view.jsx ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tinode-sdk */ "tinode-sdk");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _widgets_chat_message_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../widgets/chat-message.jsx */ "./src/widgets/chat-message.jsx");
/* harmony import */ var _widgets_error_panel_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../widgets/error-panel.jsx */ "./src/widgets/error-panel.jsx");
/* harmony import */ var _widgets_group_subs_jsx__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../widgets/group-subs.jsx */ "./src/widgets/group-subs.jsx");
/* harmony import */ var _widgets_image_preview_jsx__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../widgets/image-preview.jsx */ "./src/widgets/image-preview.jsx");
/* harmony import */ var _widgets_Invitation_jsx__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../widgets/Invitation.jsx */ "./src/widgets/Invitation.jsx");
/* harmony import */ var _widgets_letter_tile_jsx__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../widgets/letter-tile.jsx */ "./src/widgets/letter-tile.jsx");
/* harmony import */ var _widgets_load_spinner_jsx__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../widgets/load-spinner.jsx */ "./src/widgets/load-spinner.jsx");
/* harmony import */ var _logo_view_jsx__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./logo-view.jsx */ "./src/views/logo-view.jsx");
/* harmony import */ var _widgets_send_message_jsx__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../widgets/send-message.jsx */ "./src/widgets/send-message.jsx");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var _lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../lib/blob-helpers.js */ "./src/lib/blob-helpers.js");
/* harmony import */ var _lib_strformat_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../lib/strformat.js */ "./src/lib/strformat.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }




var Drafty = tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default.a.Drafty;












var messages = Object(react_intl__WEBPACK_IMPORTED_MODULE_1__["defineMessages"])({
  online_now: {
    "id": "online_now",
    "defaultMessage": "online now"
  },
  last_seen: {
    "id": "last_seen_timestamp",
    "defaultMessage": "Last seen"
  },
  'not_found': {
    "id": "title_not_found",
    "defaultMessage": "Not found"
  }
});

function isUnconfirmed(acs) {
  if (acs) {
    var ex = acs.getExcessive() || '';
    return acs.isJoiner('given') && (ex.includes('R') || ex.includes('W'));
  }

  return false;
}

function isPeerRestricted(acs) {
  if (acs) {
    var ms = acs.getMissing() || '';
    return acs.isJoiner('want') && (ms.includes('R') || ms.includes('W'));
  }

  return false;
}

var MessagesView = function (_React$Component) {
  _inherits(MessagesView, _React$Component);

  function MessagesView(props) {
    var _this;

    _classCallCheck(this, MessagesView);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(MessagesView).call(this, props));
    _this.state = MessagesView.getDerivedStateFromProps(props, {});
    _this.leave = _this.leave.bind(_assertThisInitialized(_this));
    _this.handleScrollReference = _this.handleScrollReference.bind(_assertThisInitialized(_this));
    _this.handleScrollEvent = _this.handleScrollEvent.bind(_assertThisInitialized(_this));
    _this.handleDescChange = _this.handleDescChange.bind(_assertThisInitialized(_this));
    _this.handleSubsUpdated = _this.handleSubsUpdated.bind(_assertThisInitialized(_this));
    _this.handleNewMessage = _this.handleNewMessage.bind(_assertThisInitialized(_this));
    _this.handleAllMessagesReceived = _this.handleAllMessagesReceived.bind(_assertThisInitialized(_this));
    _this.handleInfoReceipt = _this.handleInfoReceipt.bind(_assertThisInitialized(_this));
    _this.handleImagePreview = _this.handleImagePreview.bind(_assertThisInitialized(_this));
    _this.handleCloseImagePreview = _this.handleCloseImagePreview.bind(_assertThisInitialized(_this));
    _this.handleFormResponse = _this.handleFormResponse.bind(_assertThisInitialized(_this));
    _this.handleContextClick = _this.handleContextClick.bind(_assertThisInitialized(_this));
    _this.handleShowContextMenuMessage = _this.handleShowContextMenuMessage.bind(_assertThisInitialized(_this));
    _this.handleNewChatAcceptance = _this.handleNewChatAcceptance.bind(_assertThisInitialized(_this));
    _this.handleEnablePeer = _this.handleEnablePeer.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(MessagesView, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.messagesScroller) {
        this.messagesScroller.addEventListener('scroll', this.handleScrollEvent);
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.messagesScroller) {
        this.messagesScroller.removeEventListener('scroll', this.handleScrollEvent);
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      var _this2 = this;

      if (this.messagesScroller) {
        if (prevState.topic != this.state.topic || prevState.messages.length != this.state.messages.length) {
          this.messagesScroller.scrollTop = this.messagesScroller.scrollHeight - this.state.scrollPosition;
        } else if (prevProps.viewportHeight > this.props.viewportHeight) {
          this.messagesScroller.scrollTop += prevProps.viewportHeight - this.props.viewportHeight;
        }
      }

      var topic = this.props.tinode.getTopic(this.state.topic);

      if (this.state.topic != prevState.topic) {
        if (prevState.topic && !tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default.a.isNewGroupTopicName(prevState.topic)) {
          this.leave(prevState.topic);
          this.props.readTimerHandler(null);
        }

        if (topic) {
          topic.onData = this.handleNewMessage;
          topic.onAllMessagesReceived = this.handleAllMessagesReceived;
          topic.onInfo = this.handleInfoReceipt;
          topic.onMetaDesc = this.handleDescChange;
          topic.onSubsUpdated = this.handleSubsUpdated;
          topic.onPres = this.handleSubsUpdated;
        }
      }

      if (topic && !topic.isSubscribed() && this.props.ready && (this.state.topic != prevState.topic || !prevProps.ready)) {
        var newTopic = this.props.newTopicParams && this.props.newTopicParams._topicName == this.props.topic;
        var getQuery = topic.startMetaQuery().withLaterDesc().withLaterSub();

        if (this.state.isReader || newTopic) {
          getQuery = getQuery.withLaterData(_config_js__WEBPACK_IMPORTED_MODULE_12__["MESSAGES_PAGE"]);

          if (this.state.isReader) {
            getQuery = getQuery.withLaterDel();
          }

          this.setState({
            fetchingMessages: true
          });
        }

        var setQuery = newTopic ? this.props.newTopicParams : undefined;
        topic.subscribe(getQuery.build(), setQuery).then(function (ctrl) {
          if (_this2.state.topic != ctrl.topic) {
            _this2.setState({
              topic: ctrl.topic
            });
          }

          _this2.props.onNewTopicCreated(_this2.props.topic, ctrl.topic);

          topic.queuedMessages(function (pub) {
            if (!pub._sending && topic.isSubscribed()) {
              topic.publishMessage(pub);
            }
          });
        }).catch(function (err) {
          console.log("Failed subscription to", _this2.state.topic);

          _this2.props.onError(err.message, 'err');

          var blankState = MessagesView.getDerivedStateFromProps({}, {});
          blankState.title = _this2.props.intl.formatMessage(messages.not_found);

          _this2.setState(blankState);
        });
      }
    }
  }, {
    key: "leave",
    value: function leave(oldTopicName) {
      var _this3 = this;

      if (!oldTopicName) {
        return;
      }

      var oldTopic = this.props.tinode.getTopic(oldTopicName);

      if (oldTopic && oldTopic.isSubscribed()) {
        oldTopic.leave(false).catch(function () {}).finally(function () {
          _this3.setState({
            fetchingMessages: false
          });

          oldTopic.onData = undefined;
          oldTopic.onAllMessagesReceived = undefined;
          oldTopic.onInfo = undefined;
          oldTopic.onMetaDesc = undefined;
          oldTopic.onSubsUpdated = undefined;
          oldTopic.onPres = undefined;
        });
      }
    }
  }, {
    key: "handleScrollReference",
    value: function handleScrollReference(node) {
      if (node) {
        node.addEventListener('scroll', this.handleScrollEvent);
        this.messagesScroller = node;
      }
    }
  }, {
    key: "handleScrollEvent",
    value: function handleScrollEvent(event) {
      var _this4 = this;

      this.setState({
        scrollPosition: event.target.scrollHeight - event.target.scrollTop
      });

      if (event.target.scrollTop <= 0) {
        this.setState(function (prevState, props) {
          var newState = {};

          if (!prevState.fetchingMessages) {
            var topic = _this4.props.tinode.getTopic(_this4.state.topic);

            if (topic && topic.isSubscribed() && topic.msgHasMoreMessages()) {
              newState.fetchingMessages = true;
              topic.getMessagesPage(_config_js__WEBPACK_IMPORTED_MODULE_12__["MESSAGES_PAGE"]).catch(function (err) {
                _this4.setState({
                  fetchingMessages: false
                });

                _this4.props.onError(err.message, 'err');
              });
            }
          }

          return newState;
        });
      }
    }
  }, {
    key: "handleDescChange",
    value: function handleDescChange(desc) {
      if (desc.public) {
        this.setState({
          title: desc.public.fn,
          avatar: Object(_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_13__["makeImageUrl"])(desc.public.photo)
        });
      } else {
        this.setState({
          title: '',
          avatar: null
        });
      }

      if (desc.acs) {
        this.setState({
          isWriter: desc.acs.isWriter(),
          isReader: desc.acs.isReader(),
          readingBlocked: !desc.acs.isReader('given'),
          unconfirmed: isUnconfirmed(desc.acs)
        });
      }
    }
  }, {
    key: "handleSubsUpdated",
    value: function handleSubsUpdated() {
      var _this5 = this;

      if (this.state.topic) {
        var subs = [];
        var topic = this.props.tinode.getTopic(this.state.topic);
        topic.subscribers(function (sub) {
          if (sub.online && sub.user != _this5.props.myUserId) {
            subs.push(sub);
          }
        });
        var newState = {
          onlineSubs: subs
        };
        var peer = topic.p2pPeerDesc();

        if (peer) {
          Object.assign(newState, {
            peerMessagingDisabled: isPeerRestricted(peer.acs)
          });
        } else if (this.state.peerMessagingDisabled) {
          Object.assign(newState, {
            peerMessagingDisabled: false
          });
        }

        this.setState(newState);
      }
    }
  }, {
    key: "handleNewMessage",
    value: function handleNewMessage(msg) {
      var topic = this.props.tinode.getTopic(this.state.topic);
      var newState = {
        messages: []
      };
      topic.messages(function (m) {
        if (!m.deleted) {
          newState.messages.push(m);
        }
      });

      if (msg && !msg.deleted) {
        if (topic.isNewMessage(msg.seq)) {
          newState.scrollPosition = 0;
        }

        var status = topic.msgStatus(msg);

        if (status >= tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default.a.MESSAGE_STATUS_SENT && msg.from != this.props.myUserId) {
          this.props.readTimerHandler(function () {
            topic.noteRead(msg.seq);
          });
        }

        this.props.onData(msg);
      }

      this.setState(newState);
    }
  }, {
    key: "handleAllMessagesReceived",
    value: function handleAllMessagesReceived(count) {
      this.setState({
        fetchingMessages: false
      });
    }
  }, {
    key: "handleInfoReceipt",
    value: function handleInfoReceipt(info) {
      switch (info.what) {
        case 'kp':
          {
            clearTimeout(this.keyPressTimer);
            var instance = this;
            this.keyPressTimer = setTimeout(function () {
              instance.setState({
                typingIndicator: false
              });
            }, _config_js__WEBPACK_IMPORTED_MODULE_12__["KEYPRESS_DELAY"] + 1000);

            if (!this.state.typingIndicator) {
              this.setState({
                typingIndicator: true
              });
            }

            break;
          }

        case 'read':
        case 'recv':
          this.forceUpdate();
          break;

        default:
          console.log("Other change in topic: ", info.what);
      }
    }
  }, {
    key: "handleImagePreview",
    value: function handleImagePreview(content) {
      this.setState({
        imagePreview: content
      });
    }
  }, {
    key: "handleCloseImagePreview",
    value: function handleCloseImagePreview() {
      this.setState({
        imagePreview: null
      });
    }
  }, {
    key: "handleFormResponse",
    value: function handleFormResponse(action, text, data) {
      if (action == 'pub') {
        this.props.sendMessage(Drafty.attachJSON(Drafty.parse(text), data));
      } else if (action == 'url') {
        var url = new URL(data.ref);
        var params = url.searchParams;

        for (var key in data.resp) {
          if (data.resp.hasOwnProperty(key)) {
            params.set(key, data.resp[key]);
          }
        }

        ['name', 'seq'].map(function (key) {
          if (data[key]) {
            params.set(key, data[key]);
          }
        });
        params.set('uid', this.props.myUserId);
        url.search = params;
        window.open(url, '_blank');
      } else {
        console.log("Unknown action in form", action);
      }
    }
  }, {
    key: "handleContextClick",
    value: function handleContextClick(e) {
      e.preventDefault();
      e.stopPropagation();
      this.props.showContextMenu({
        topicName: this.state.topic,
        y: e.pageY,
        x: e.pageX
      });
    }
  }, {
    key: "handleShowContextMenuMessage",
    value: function handleShowContextMenuMessage(params) {
      params.topicName = this.state.topic;
      var menuItems = ['message_delete'];
      var topic = this.props.tinode.getTopic(params.topicName);

      if (topic) {
        var acs = topic.getAccessMode();

        if (acs && acs.isDeleter()) {
          menuItems.push('message_delete_hard');
        }
      }

      this.props.showContextMenu(params, menuItems);
    }
  }, {
    key: "handleNewChatAcceptance",
    value: function handleNewChatAcceptance(action) {
      this.props.onNewChat(this.state.topic, action);
    }
  }, {
    key: "handleEnablePeer",
    value: function handleEnablePeer(e) {
      e.preventDefault();
      this.props.onChangePermissions(this.state.topic, _config_js__WEBPACK_IMPORTED_MODULE_12__["DEFAULT_P2P_ACCESS_MODE"], this.state.topic);
    }
  }, {
    key: "render",
    value: function render() {
      var _this6 = this;

      var formatMessage = this.props.intl.formatMessage;
      var component;

      if (this.state.topic) {
        var topic = this.props.tinode.getTopic(this.state.topic);
        var groupTopic = topic.getType() == 'grp';
        var messageNodes = [];
        var previousFrom = null;
        var chatBoxClass = null;

        for (var i = 0; i < this.state.messages.length; i++) {
          var msg = this.state.messages[i];
          var nextFrom = null;

          if (i + 1 < this.state.messages.length) {
            nextFrom = this.state.messages[i + 1].from;
          }

          var sequence = 'single';

          if (msg.from == previousFrom) {
            if (msg.from == nextFrom) {
              sequence = 'middle';
            } else {
              sequence = 'last';
            }
          } else if (msg.from == nextFrom) {
            sequence = 'first';
          }

          previousFrom = msg.from;
          var isReply = !(msg.from == this.props.myUserId);
          var deliveryStatus = topic.msgStatus(msg);
          var userName = void 0,
              userAvatar = void 0,
              userFrom = void 0;

          if (groupTopic) {
            var user = topic.userDesc(msg.from);

            if (user && user.public) {
              userName = user.public.fn;
              userAvatar = Object(_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_13__["makeImageUrl"])(user.public.photo);
            }

            userFrom = msg.from;
            chatBoxClass = 'chat-box group';
          } else {
            chatBoxClass = 'chat-box';
          }

          messageNodes.push(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_chat_message_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
            tinode: this.props.tinode,
            content: msg.content,
            mimeType: msg.head ? msg.head.mime : null,
            timestamp: msg.ts,
            response: isReply,
            seq: msg.seq,
            userFrom: userFrom,
            userName: userName,
            userAvatar: userAvatar,
            sequence: sequence,
            received: deliveryStatus,
            uploader: msg._uploader,
            viewportWidth: this.props.viewportWidth,
            showContextMenu: this.handleShowContextMenuMessage,
            onImagePreview: this.handleImagePreview,
            onFormResponse: this.handleFormResponse,
            onError: this.props.onError,
            key: msg.seq
          }));
        }

        var lastSeen = null;
        var cont = this.props.tinode.getMeTopic().getContact(this.state.topic);

        if (cont && tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default.a.topicType(cont.topic) == 'p2p') {
          if (cont.online) {
            lastSeen = formatMessage(messages.online_now);
          } else if (cont.seen) {
            lastSeen = formatMessage(messages.last_seen) + ": " + Object(_lib_strformat_js__WEBPACK_IMPORTED_MODULE_14__["shortDateFormat"])(cont.seen.when, this.props.intl.locale);
          }
        }

        var avatar = this.state.avatar || true;
        var online = this.props.online ? 'online' + (this.state.typingIndicator ? ' typing' : '') : 'offline';
        component = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          id: "topic-view",
          className: this.props.hideSelf ? 'nodisplay' : null
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          id: "topic-caption-panel",
          className: "caption-panel"
        }, this.props.displayMobile ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
          href: "#",
          id: "hide-message-view",
          onClick: function onClick(e) {
            e.preventDefault();

            _this6.props.onHideMessagesView();
          }
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
          className: "material-icons"
        }, "arrow_back")) : null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          className: "avatar-box"
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_letter_tile_jsx__WEBPACK_IMPORTED_MODULE_8__["default"], {
          avatar: avatar,
          topic: this.state.topic,
          title: this.state.title
        }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
          className: online
        })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          id: "topic-title-group"
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          id: "topic-title",
          className: "panel-title"
        }, this.state.title || react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
          id: "unnamed_topic",
          defaultMessage: "Unnamed"
        }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          id: "topic-last-seen"
        }, lastSeen)), groupTopic ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_group_subs_jsx__WEBPACK_IMPORTED_MODULE_5__["default"], {
          subscribers: this.state.onlineSubs
        }) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          id: "topic-users"
        }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
          href: "#",
          onClick: this.handleContextClick
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
          className: "material-icons"
        }, "more_vert")))), this.props.displayMobile ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_error_panel_jsx__WEBPACK_IMPORTED_MODULE_4__["default"], {
          level: this.props.errorLevel,
          text: this.props.errorText,
          onClearError: this.props.onError
        }) : null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_load_spinner_jsx__WEBPACK_IMPORTED_MODULE_9__["default"], {
          show: this.state.fetchingMessages
        }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          id: "messages-container"
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          id: "messages-panel",
          ref: this.handleScrollReference
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("ul", {
          id: "scroller",
          className: chatBoxClass
        }, messageNodes)), !this.state.isReader ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          id: "write-only-background"
        }, this.state.readingBlocked ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          id: "write-only-note"
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
          id: "messages_not_readable",
          defaultMessage: "no access to messages"
        })) : null) : null), this.state.peerMessagingDisabled && !this.state.unconfirmed ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          id: "peer-messaging-disabled-note"
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
          className: "material-icons secondary"
        }, "block"), " ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
          id: "peers_messaging_disabled",
          defaultMessage: "Peer's messaging is disabled."
        }), " ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
          href: "#",
          onClick: this.handleEnablePeer
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
          id: "enable_peers_messaging",
          defaultMessage: "Enable"
        })), ".") : null, this.state.unconfirmed ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_Invitation_jsx__WEBPACK_IMPORTED_MODULE_7__["default"], {
          onAction: this.handleNewChatAcceptance
        }) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_send_message_jsx__WEBPACK_IMPORTED_MODULE_11__["default"], {
          tinode: this.props.tinode,
          topic: this.props.topic,
          disabled: !this.state.isWriter,
          sendMessage: this.props.sendMessage,
          onError: this.props.onError
        }), this.state.imagePreview ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_image_preview_jsx__WEBPACK_IMPORTED_MODULE_6__["default"], {
          content: this.state.imagePreview,
          onClose: this.handleCloseImagePreview
        }) : null);
      } else {
        component = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_logo_view_jsx__WEBPACK_IMPORTED_MODULE_10__["default"], {
          hideSelf: this.props.hideSelf,
          serverVersion: this.props.serverVersion,
          serverAddress: this.props.serverAddress
        });
      }

      return component;
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(nextProps, prevState) {
      var nextState = {};

      if (!nextProps.topic) {
        nextState = {
          messages: [],
          onlineSubs: [],
          topic: null,
          title: '',
          avatar: null,
          imagePreview: null,
          typingIndicator: false,
          scrollPosition: 0,
          fetchingMessages: false,
          peerMessagingDisabled: false
        };
      } else if (nextProps.topic != prevState.topic) {
        var topic = nextProps.tinode.getTopic(nextProps.topic);
        nextState = {
          topic: nextProps.topic,
          imagePreview: null,
          typingIndicator: false,
          scrollPosition: 0,
          fetchingMessages: false
        };

        if (topic) {
          var msgs = [];
          var subs = [];

          if (nextProps.connected) {
            topic.subscribers(function (sub) {
              if (sub.online && sub.user != nextProps.myUserId) {
                subs.push(sub);
              }
            });
          }

          topic.messages(function (msg) {
            if (!msg.deleted) {
              msgs.push(msg);
            }
          });
          Object.assign(nextState, {
            messages: msgs,
            onlineSubs: subs
          });

          if (topic.public) {
            Object.assign(nextState, {
              title: topic.public.fn,
              avatar: Object(_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_13__["makeImageUrl"])(topic.public.photo)
            });
          } else {
            Object.assign(nextState, {
              title: '',
              avatar: null
            });
          }

          var peer = topic.p2pPeerDesc();

          if (peer) {
            Object.assign(nextState, {
              peerMessagingDisabled: isPeerRestricted(peer.acs)
            });
          } else if (prevState.peerMessagingDisabled) {
            Object.assign(nextState, {
              peerMessagingDisabled: false
            });
          }
        } else {
          Object.assign(nextState, {
            messages: [],
            onlineSubs: [],
            title: '',
            avatar: null,
            peerMessagingDisabled: false
          });
        }
      }

      if (nextProps.acs) {
        if (nextProps.acs.isWriter() != prevState.isWriter) {
          nextState.isWriter = !prevState.isWriter;
        }

        if (nextProps.acs.isReader() != prevState.isReader) {
          nextState.isReader = !prevState.isReader;
        }

        if (!nextProps.acs.isReader('given') != prevState.readingBlocked) {
          nextState.readingBlocked = !prevState.readingBlocked;
        }
      } else {
        if (prevState.isWriter) {
          nextState.isWriter = false;
        }

        if (prevState.isReader) {
          nextState.isReader = false;
        }

        if (!prevState.readingBlocked) {
          prevState.readingBlocked = true;
        }
      }

      if (isUnconfirmed(nextProps.acs) == !prevState.unconformed) {
        nextState.unconfirmed = !prevState.unconformed;
      }

      if (!nextProps.connected && prevState.onlineSubs && prevState.onlineSubs.length > 0) {
        nextState.onlineSubs = [];
      }

      return nextState;
    }
  }]);

  return MessagesView;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);

;
/* harmony default export */ __webpack_exports__["default"] = (Object(react_intl__WEBPACK_IMPORTED_MODULE_1__["injectIntl"])(MessagesView));

/***/ }),

/***/ "./src/views/new-topic-view.jsx":
/*!**************************************!*\
  !*** ./src/views/new-topic-view.jsx ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tinode-sdk */ "tinode-sdk");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _widgets_contact_list_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../widgets/contact-list.jsx */ "./src/widgets/contact-list.jsx");
/* harmony import */ var _widgets_new_topic_by_id_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../widgets/new-topic-by-id.jsx */ "./src/widgets/new-topic-by-id.jsx");
/* harmony import */ var _widgets_new_topic_group_jsx__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../widgets/new-topic-group.jsx */ "./src/widgets/new-topic-group.jsx");
/* harmony import */ var _widgets_search_contacts_jsx__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../widgets/search-contacts.jsx */ "./src/widgets/search-contacts.jsx");
/* harmony import */ var _lib_navigation_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../lib/navigation.js */ "./src/lib/navigation.js");
/* harmony import */ var _lib_utils_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../lib/utils.js */ "./src/lib/utils.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }










var messages = Object(react_intl__WEBPACK_IMPORTED_MODULE_1__["defineMessages"])({
  search_for_contacts: {
    "id": "search_for_contacts",
    "defaultMessage": "Use search to find contacts"
  },
  search_no_results: {
    "id": "search_no_results",
    "defaultMessage": "Search returned no results"
  }
});

var NewTopicView = function (_React$Component) {
  _inherits(NewTopicView, _React$Component);

  function NewTopicView(props) {
    var _this;

    _classCallCheck(this, NewTopicView);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(NewTopicView).call(this, props));
    _this.state = {
      tabSelected: 'p2p',
      searchQuery: null
    };
    _this.handleTabClick = _this.handleTabClick.bind(_assertThisInitialized(_this));
    _this.handleSearchContacts = _this.handleSearchContacts.bind(_assertThisInitialized(_this));
    _this.handleContactSelected = _this.handleContactSelected.bind(_assertThisInitialized(_this));
    _this.handleNewGroupSubmit = _this.handleNewGroupSubmit.bind(_assertThisInitialized(_this));
    _this.handleGroupByID = _this.handleGroupByID.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(NewTopicView, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.props.onInitFind();
    }
  }, {
    key: "handleTabClick",
    value: function handleTabClick(e) {
      e.preventDefault();
      _lib_navigation_js__WEBPACK_IMPORTED_MODULE_7__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_7__["default"].addUrlParam(window.location.hash, 'tab', e.currentTarget.dataset.id));
      this.setState({
        tabSelected: e.currentTarget.dataset.id
      });
    }
  }, {
    key: "handleSearchContacts",
    value: function handleSearchContacts(query) {
      this.props.onSearchContacts(query);
      this.setState({
        searchQuery: tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default.a.isNullValue(query) ? null : query
      });
    }
  }, {
    key: "handleContactSelected",
    value: function handleContactSelected(sel) {
      if (this.state.tabSelected === 'p2p') {
        _lib_navigation_js__WEBPACK_IMPORTED_MODULE_7__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_7__["default"].removeUrlParam(window.location.hash, 'tab'));
        this.props.onCreateTopic(sel, undefined);
      }
    }
  }, {
    key: "handleNewGroupSubmit",
    value: function handleNewGroupSubmit(name, dataUrl, priv, tags) {
      _lib_navigation_js__WEBPACK_IMPORTED_MODULE_7__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_7__["default"].removeUrlParam(window.location.hash, 'tab'));
      this.props.onCreateTopic(undefined, Object(_lib_utils_js__WEBPACK_IMPORTED_MODULE_8__["vcard"])(name, dataUrl), priv, tags);
    }
  }, {
    key: "handleGroupByID",
    value: function handleGroupByID(topicName) {
      _lib_navigation_js__WEBPACK_IMPORTED_MODULE_7__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_7__["default"].removeUrlParam(window.location.hash, 'tab'));
      this.props.onCreateTopic(topicName);
    }
  }, {
    key: "render",
    value: function render() {
      var formatMessage = this.props.intl.formatMessage;
      var no_contacts_placeholder = formatMessage(this.state.searchQuery ? messages.search_no_results : messages.search_for_contacts);
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "flex-column"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("ul", {
        className: "tabbar"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
        className: this.state.tabSelected === "p2p" ? "active" : null
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "#",
        "data-id": "p2p",
        onClick: this.handleTabClick
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "tabtitle_find_user",
        defaultMessage: "find"
      }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
        className: this.state.tabSelected === "grp" ? "active" : null
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "#",
        "data-id": "grp",
        onClick: this.handleTabClick
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "tabtitle_new_group",
        defaultMessage: "new group"
      }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
        className: this.state.tabSelected === "byid" ? "active" : null
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "#",
        "data-id": "byid",
        onClick: this.handleTabClick
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "tabtitle_group_by_id",
        defaultMessage: "by id"
      })))), this.state.tabSelected === 'grp' ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_new_topic_group_jsx__WEBPACK_IMPORTED_MODULE_5__["default"], {
        onSubmit: this.handleNewGroupSubmit
      }) : this.state.tabSelected === 'byid' ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_new_topic_by_id_jsx__WEBPACK_IMPORTED_MODULE_4__["default"], {
        onSubmit: this.handleGroupByID,
        onError: this.props.onError
      }) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "flex-column"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_search_contacts_jsx__WEBPACK_IMPORTED_MODULE_6__["default"], {
        type: "p2p",
        onSearchContacts: this.handleSearchContacts
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_contact_list_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
        contacts: this.props.searchResults,
        myUserId: this.props.myUserId,
        emptyListMessage: no_contacts_placeholder,
        showOnline: false,
        showUnread: false,
        showContextMenu: false,
        onTopicSelected: this.handleContactSelected
      })));
    }
  }]);

  return NewTopicView;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);

;
/* harmony default export */ __webpack_exports__["default"] = (Object(react_intl__WEBPACK_IMPORTED_MODULE_1__["injectIntl"])(NewTopicView));

/***/ }),

/***/ "./src/views/password-reset-view.jsx":
/*!*******************************************!*\
  !*** ./src/views/password-reset-view.jsx ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return PasswordResetView; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _widgets_visible_password_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../widgets/visible-password.jsx */ "./src/widgets/visible-password.jsx");
/* harmony import */ var _lib_navigation_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/navigation.js */ "./src/lib/navigation.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }






var PasswordResetView = function (_React$PureComponent) {
  _inherits(PasswordResetView, _React$PureComponent);

  function PasswordResetView(props) {
    var _this;

    _classCallCheck(this, PasswordResetView);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PasswordResetView).call(this, props));
    _this.state = {
      email: '',
      password: ''
    };
    _this.handleSubmit = _this.handleSubmit.bind(_assertThisInitialized(_this));
    _this.handleEmailChange = _this.handleEmailChange.bind(_assertThisInitialized(_this));
    _this.handlePasswordChange = _this.handlePasswordChange.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(PasswordResetView, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var parsed = _lib_navigation_js__WEBPACK_IMPORTED_MODULE_3__["default"].parseUrlHash(window.location.hash);
      this.setState({
        token: parsed.params.token,
        scheme: parsed.params.scheme
      });
    }
  }, {
    key: "handleSubmit",
    value: function handleSubmit(e) {
      e.preventDefault();

      if (this.state.token) {
        this.props.onReset(this.state.scheme, this.state.password.trim(), this.state.token);
      } else {
        this.props.onRequest('email', this.state.email.trim());
      }
    }
  }, {
    key: "handleEmailChange",
    value: function handleEmailChange(e) {
      this.setState({
        email: e.target.value
      });
    }
  }, {
    key: "handlePasswordChange",
    value: function handlePasswordChange(e) {
      this.setState({
        password: e.target.value
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var reset = this.state.token && this.state.scheme;
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("form", {
        id: "password-reset-form",
        onSubmit: this.handleSubmit
      }, reset ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "new_password_placeholder",
        defaultMessage: "Enter new password"
      }, function (placeholder) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_visible_password_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
          placeholder: placeholder,
          autoComplete: "new-password",
          value: _this2.state.password,
          required: true,
          autoFocus: true,
          onChange: _this2.handlePasswordChange
        });
      }) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        htmlFor: "inputEmail"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "label_reset_password",
        defaultMessage: "Send a password reset email:"
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "credential_email_prompt",
        defaultMessage: "Your registration email"
      }, function (placeholder) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
          type: "email",
          id: "inputEmail",
          placeholder: placeholder,
          autoComplete: "email",
          value: _this2.state.email,
          onChange: _this2.handleEmailChange,
          required: true,
          autoFocus: true
        });
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "dialog-buttons"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "blue",
        type: "submit"
      }, reset ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "button_reset",
        defaultMessage: "Reset"
      }) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "button_send_request",
        defaultMessage: "Send request"
      }))));
    }
  }]);

  return PasswordResetView;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.PureComponent);



/***/ }),

/***/ "./src/views/settings-view.jsx":
/*!*************************************!*\
  !*** ./src/views/settings-view.jsx ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return SettingsView; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _widgets_host_selector_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../widgets/host-selector.jsx */ "./src/widgets/host-selector.jsx");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }





var SettingsView = function (_React$PureComponent) {
  _inherits(SettingsView, _React$PureComponent);

  function SettingsView(props) {
    var _this;

    _classCallCheck(this, SettingsView);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SettingsView).call(this, props));
    _this.state = {
      transport: props.transport || 'def',
      serverAddress: props.serverAddress
    };
    _this.handleSubmit = _this.handleSubmit.bind(_assertThisInitialized(_this));
    _this.handleTransportSelected = _this.handleTransportSelected.bind(_assertThisInitialized(_this));
    _this.handleServerAddressChange = _this.handleServerAddressChange.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(SettingsView, [{
    key: "handleSubmit",
    value: function handleSubmit(e) {
      e.preventDefault();
      this.props.onUpdate({
        transport: this.state.transport,
        serverAddress: this.state.serverAddress
      });
    }
  }, {
    key: "handleTransportSelected",
    value: function handleTransportSelected(e) {
      this.setState({
        transport: e.currentTarget.value
      });
    }
  }, {
    key: "handleServerAddressChange",
    value: function handleServerAddressChange(name) {
      this.setState({
        serverAddress: name
      });
    }
  }, {
    key: "render",
    value: function render() {
      var names = {
        def: "default",
        ws: "websocket",
        lp: "long polling"
      };
      var transportOptions = [];
      var instance = this;
      ['def', 'ws', 'lp'].map(function (item) {
        var id = 'transport-' + item;
        var name = names[item];
        transportOptions.push(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
          key: item
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
          type: "radio",
          id: id,
          name: "transport-select",
          value: item,
          checked: instance.state.transport === item,
          onChange: instance.handleTransportSelected
        }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
          htmlFor: id
        }, name)));
      });
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("form", {
        id: "settings-form",
        className: "panel-form",
        onSubmit: this.handleSubmit
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "small"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "label_server_to_use",
        defaultMessage: "Server to use:"
      }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_host_selector_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
        serverAddress: this.state.serverAddress,
        onServerAddressChange: this.handleServerAddressChange
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "small"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "label_wire_transport",
        defaultMessage: "Wire transport:"
      }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("ul", {
        className: "quoted"
      }, transportOptions)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "dialog-buttons"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        type: "submit",
        className: "blue"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "button_update",
        defaultMessage: "Update"
      }))));
    }
  }]);

  return SettingsView;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.PureComponent);


;

/***/ }),

/***/ "./src/views/sidepanel-view.jsx":
/*!**************************************!*\
  !*** ./src/views/sidepanel-view.jsx ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _widgets_error_panel_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../widgets/error-panel.jsx */ "./src/widgets/error-panel.jsx");
/* harmony import */ var _widgets_load_spinner_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../widgets/load-spinner.jsx */ "./src/widgets/load-spinner.jsx");
/* harmony import */ var _widgets_side_navbar_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../widgets/side-navbar.jsx */ "./src/widgets/side-navbar.jsx");
/* harmony import */ var _contacts_view_jsx__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./contacts-view.jsx */ "./src/views/contacts-view.jsx");
/* harmony import */ var _create_account_view_jsx__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./create-account-view.jsx */ "./src/views/create-account-view.jsx");
/* harmony import */ var _edit_account_view_jsx__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./edit-account-view.jsx */ "./src/views/edit-account-view.jsx");
/* harmony import */ var _login_view_jsx__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./login-view.jsx */ "./src/views/login-view.jsx");
/* harmony import */ var _new_topic_view_jsx__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./new-topic-view.jsx */ "./src/views/new-topic-view.jsx");
/* harmony import */ var _password_reset_view_jsx__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./password-reset-view.jsx */ "./src/views/password-reset-view.jsx");
/* harmony import */ var _settings_view_jsx__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./settings-view.jsx */ "./src/views/settings-view.jsx");
/* harmony import */ var _validation_view_jsx__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./validation-view.jsx */ "./src/views/validation-view.jsx");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }














var messages = Object(react_intl__WEBPACK_IMPORTED_MODULE_1__["defineMessages"])({
  'login': {
    "id": "sidepanel_title_login",
    "defaultMessage": "Sign In"
  },
  'register': {
    "id": "sidepanel_title_register",
    "defaultMessage": "Create Account"
  },
  'settings': {
    "id": "sidepanel_title_settings",
    "defaultMessage": "Settings"
  },
  'edit': {
    "id": "sidepanel_title_edit_account",
    "defaultMessage": "Edit Account"
  },
  'newtpk': {
    "id": "sidepanel_title_newtpk",
    "defaultMessage": "Start New Chat"
  },
  'cred': {
    "id": "sidepanel_title_cred",
    "defaultMessage": "Confirm Credentials"
  },
  'reset': {
    "id": "sidepanel_title_reset",
    "defaultMessage": "Reset Password"
  },
  'archive': {
    "id": "sidepanel_title_archive",
    "defaultMessage": "Archived Chats"
  }
});

var SidepanelView = function (_React$Component) {
  _inherits(SidepanelView, _React$Component);

  function SidepanelView(props) {
    var _this;

    _classCallCheck(this, SidepanelView);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SidepanelView).call(this, props));
    _this.handleLoginRequested = _this.handleLoginRequested.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(SidepanelView, [{
    key: "handleLoginRequested",
    value: function handleLoginRequested(login, password) {
      this.props.onLoginRequest(login, password);
    }
  }, {
    key: "render",
    value: function render() {
      var formatMessage = this.props.intl.formatMessage;
      var view = this.props.state || (this.props.myUserId ? 'contacts' : 'login');
      var title, avatar;

      if (view == 'contacts') {
        title = this.props.title;
        avatar = this.props.avatar ? this.props.avatar : true;
      } else {
        title = formatMessage(messages[view]);
        avatar = false;
      }

      var onCancel;

      if (['login', 'contacts'].indexOf(view) == -1) {
        onCancel = this.props.onCancel;
      }

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        id: "sidepanel",
        className: this.props.hideSelf ? 'nodisplay' : null
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_side_navbar_jsx__WEBPACK_IMPORTED_MODULE_4__["default"], {
        state: view,
        title: title,
        avatar: avatar,
        myUserId: this.props.myUserId,
        onSignUp: this.props.onSignUp,
        onSettings: this.props.onSettings,
        onNewTopic: this.props.onNewTopic,
        onCancel: onCancel
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_error_panel_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
        level: this.props.errorLevel,
        text: this.props.errorText,
        action: this.props.errorAction,
        actionText: this.props.errorActionText,
        onClearError: this.props.onError
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_load_spinner_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
        show: this.props.loadSpinnerVisible
      }), view === 'login' ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_login_view_jsx__WEBPACK_IMPORTED_MODULE_8__["default"], {
        login: this.props.login,
        disabled: this.props.loginDisabled,
        onLogin: this.handleLoginRequested
      }) : view === 'register' ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_create_account_view_jsx__WEBPACK_IMPORTED_MODULE_6__["default"], {
        onCreateAccount: this.props.onCreateAccount,
        onCancel: this.props.onCancel,
        onError: this.props.onError
      }) : view === 'settings' ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_settings_view_jsx__WEBPACK_IMPORTED_MODULE_11__["default"], {
        transport: this.props.transport,
        serverAddress: this.props.serverAddress,
        onCancel: this.props.onCancel,
        onUpdate: this.props.onGlobalSettings
      }) : view === 'edit' ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_edit_account_view_jsx__WEBPACK_IMPORTED_MODULE_7__["default"], {
        tinode: this.props.tinode,
        myUserId: this.props.myUserId,
        messageSounds: this.props.messageSounds,
        desktopAlerts: this.props.desktopAlerts,
        desktopAlertsEnabled: this.props.desktopAlertsEnabled,
        onUpdateAccount: this.props.onUpdateAccount,
        onUpdateTags: this.props.onUpdateAccountTags,
        onTogglePushNotifications: this.props.onTogglePushNotifications,
        onToggleMessageSounds: this.props.onToggleMessageSounds,
        onCredAdd: this.props.onCredAdd,
        onCredDelete: this.props.onCredDelete,
        onCredConfirm: this.props.onCredConfirm,
        onLogout: this.props.onLogout,
        onCancel: this.props.onCancel,
        onError: this.props.onError
      }) : view === 'contacts' || view == 'archive' ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_contacts_view_jsx__WEBPACK_IMPORTED_MODULE_5__["default"], {
        tinode: this.props.tinode,
        myUserId: this.props.myUserId,
        connected: this.props.connected,
        topicSelected: this.props.topicSelected,
        archive: view == 'archive',
        chatList: this.props.chatList,
        showContextMenu: this.props.showContextMenu,
        onTopicSelected: this.props.onTopicSelected,
        onShowArchive: this.props.onShowArchive
      }) : view === 'newtpk' ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_new_topic_view_jsx__WEBPACK_IMPORTED_MODULE_9__["default"], {
        searchResults: this.props.searchResults,
        onInitFind: this.props.onInitFind,
        onSearchContacts: this.props.onSearchContacts,
        onCreateTopic: this.props.onCreateTopic,
        onError: this.props.onError
      }) : view === 'cred' ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_validation_view_jsx__WEBPACK_IMPORTED_MODULE_12__["default"], {
        credCode: this.props.credCode,
        credMethod: this.props.credMethod,
        onSubmit: this.props.onValidateCredentials,
        onCancel: this.props.onCancel,
        onError: this.props.onError
      }) : view === 'reset' ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_password_reset_view_jsx__WEBPACK_IMPORTED_MODULE_10__["default"], {
        onRequest: this.props.onPasswordResetRequest,
        onReset: this.props.onResetPassword
      }) : null);
    }
  }]);

  return SidepanelView;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);

;
/* harmony default export */ __webpack_exports__["default"] = (Object(react_intl__WEBPACK_IMPORTED_MODULE_1__["injectIntl"])(SidepanelView));

/***/ }),

/***/ "./src/views/tinode-web.jsx":
/*!**********************************!*\
  !*** ./src/views/tinode-web.jsx ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "react-dom");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var firebase_app__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! firebase/app */ "firebase/app");
/* harmony import */ var firebase_app__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(firebase_app__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var firebase_messaging__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! firebase/messaging */ "firebase/messaging");
/* harmony import */ var firebase_messaging__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(firebase_messaging__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! tinode-sdk */ "tinode-sdk");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _widgets_alert_jsx__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../widgets/alert.jsx */ "./src/widgets/alert.jsx");
/* harmony import */ var _widgets_context_menu_jsx__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../widgets/context-menu.jsx */ "./src/widgets/context-menu.jsx");
/* harmony import */ var _info_view_jsx__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./info-view.jsx */ "./src/views/info-view.jsx");
/* harmony import */ var _messages_view_jsx__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./messages-view.jsx */ "./src/views/messages-view.jsx");
/* harmony import */ var _sidepanel_view_jsx__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./sidepanel-view.jsx */ "./src/views/sidepanel-view.jsx");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var _lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../lib/blob-helpers.js */ "./src/lib/blob-helpers.js");
/* harmony import */ var _lib_host_name_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../lib/host-name.js */ "./src/lib/host-name.js");
/* harmony import */ var _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../lib/local-storage.js */ "./src/lib/local-storage.js");
/* harmony import */ var _lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../lib/navigation.js */ "./src/lib/navigation.js");
/* harmony import */ var _lib_strformat_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../lib/strformat.js */ "./src/lib/strformat.js");
/* harmony import */ var _lib_utils_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../lib/utils.js */ "./src/lib/utils.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }



















var POP_SOUND = new Audio('audio/msg.mp3');
var messages = Object(react_intl__WEBPACK_IMPORTED_MODULE_2__["defineMessages"])({
  update_available: {
    "id": "update_available",
    "defaultMessage": "Update available. <a href=\"\">Reload</a>."
  },
  reconnect_countdown: {
    "id": "reconnect_countdown",
    "defaultMessage": "Disconnected. Reconnecting in {seconds}\u2026"
  },
  reconnect_now: {
    "id": "reconnect_now",
    "defaultMessage": "Try now"
  }
});

var TinodeWeb = function (_React$Component) {
  _inherits(TinodeWeb, _React$Component);

  function TinodeWeb(props) {
    var _this;

    _classCallCheck(this, TinodeWeb);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TinodeWeb).call(this, props));
    _this.state = _this.getBlankState();
    _this.handleResize = _this.handleResize.bind(_assertThisInitialized(_this));
    _this.handleHashRoute = _this.handleHashRoute.bind(_assertThisInitialized(_this));
    _this.handleOnline = _this.handleOnline.bind(_assertThisInitialized(_this));
    _this.checkForAppUpdate = _this.checkForAppUpdate.bind(_assertThisInitialized(_this));
    _this.handleAppVisibility = _this.handleAppVisibility.bind(_assertThisInitialized(_this));
    _this.handleReadTimer = _this.handleReadTimer.bind(_assertThisInitialized(_this));
    _this.handleVisibilityEvent = _this.handleVisibilityEvent.bind(_assertThisInitialized(_this));
    _this.handleError = _this.handleError.bind(_assertThisInitialized(_this));
    _this.handleLoginRequest = _this.handleLoginRequest.bind(_assertThisInitialized(_this));
    _this.handleConnected = _this.handleConnected.bind(_assertThisInitialized(_this));
    _this.handleAutoreconnectIteration = _this.handleAutoreconnectIteration.bind(_assertThisInitialized(_this));
    _this.doLogin = _this.doLogin.bind(_assertThisInitialized(_this));
    _this.handleCredentialsRequest = _this.handleCredentialsRequest.bind(_assertThisInitialized(_this));
    _this.handleLoginSuccessful = _this.handleLoginSuccessful.bind(_assertThisInitialized(_this));
    _this.handleDisconnect = _this.handleDisconnect.bind(_assertThisInitialized(_this));
    _this.tnMeMetaDesc = _this.tnMeMetaDesc.bind(_assertThisInitialized(_this));
    _this.tnMeContactUpdate = _this.tnMeContactUpdate.bind(_assertThisInitialized(_this));
    _this.tnMeSubsUpdated = _this.tnMeSubsUpdated.bind(_assertThisInitialized(_this));
    _this.resetContactList = _this.resetContactList.bind(_assertThisInitialized(_this));
    _this.tnData = _this.tnData.bind(_assertThisInitialized(_this));
    _this.tnInitFind = _this.tnInitFind.bind(_assertThisInitialized(_this));
    _this.tnFndSubsUpdated = _this.tnFndSubsUpdated.bind(_assertThisInitialized(_this));
    _this.handleSearchContacts = _this.handleSearchContacts.bind(_assertThisInitialized(_this));
    _this.handleTopicSelected = _this.handleTopicSelected.bind(_assertThisInitialized(_this));
    _this.handleHideMessagesView = _this.handleHideMessagesView.bind(_assertThisInitialized(_this));
    _this.handleSendMessage = _this.handleSendMessage.bind(_assertThisInitialized(_this));
    _this.handleNewChatInvitation = _this.handleNewChatInvitation.bind(_assertThisInitialized(_this));
    _this.handleNewAccount = _this.handleNewAccount.bind(_assertThisInitialized(_this));
    _this.handleNewAccountRequest = _this.handleNewAccountRequest.bind(_assertThisInitialized(_this));
    _this.handleUpdateAccountRequest = _this.handleUpdateAccountRequest.bind(_assertThisInitialized(_this));
    _this.handleUpdateAccountTagsRequest = _this.handleUpdateAccountTagsRequest.bind(_assertThisInitialized(_this));
    _this.handleSettings = _this.handleSettings.bind(_assertThisInitialized(_this));
    _this.handleGlobalSettings = _this.handleGlobalSettings.bind(_assertThisInitialized(_this));
    _this.handleShowArchive = _this.handleShowArchive.bind(_assertThisInitialized(_this));
    _this.handleToggleMessageSounds = _this.handleToggleMessageSounds.bind(_assertThisInitialized(_this));
    _this.handleCredAdd = _this.handleCredAdd.bind(_assertThisInitialized(_this));
    _this.handleCredDelete = _this.handleCredDelete.bind(_assertThisInitialized(_this));
    _this.handleCredConfirm = _this.handleCredConfirm.bind(_assertThisInitialized(_this));
    _this.initDesktopAlerts = _this.initDesktopAlerts.bind(_assertThisInitialized(_this));
    _this.togglePushToken = _this.togglePushToken.bind(_assertThisInitialized(_this));
    _this.requestPushToken = _this.requestPushToken.bind(_assertThisInitialized(_this));
    _this.handleSidepanelCancel = _this.handleSidepanelCancel.bind(_assertThisInitialized(_this));
    _this.handleNewTopic = _this.handleNewTopic.bind(_assertThisInitialized(_this));
    _this.handleNewTopicRequest = _this.handleNewTopicRequest.bind(_assertThisInitialized(_this));
    _this.handleNewTopicCreated = _this.handleNewTopicCreated.bind(_assertThisInitialized(_this));
    _this.handleTopicUpdateRequest = _this.handleTopicUpdateRequest.bind(_assertThisInitialized(_this));
    _this.handleChangePermissions = _this.handleChangePermissions.bind(_assertThisInitialized(_this));
    _this.handleTagsUpdated = _this.handleTagsUpdated.bind(_assertThisInitialized(_this));
    _this.handleLogout = _this.handleLogout.bind(_assertThisInitialized(_this));
    _this.handleDeleteMessagesRequest = _this.handleDeleteMessagesRequest.bind(_assertThisInitialized(_this));
    _this.handleLeaveUnsubRequest = _this.handleLeaveUnsubRequest.bind(_assertThisInitialized(_this));
    _this.handleBlockTopicRequest = _this.handleBlockTopicRequest.bind(_assertThisInitialized(_this));
    _this.handleReportTopic = _this.handleReportTopic.bind(_assertThisInitialized(_this));
    _this.handleShowContextMenu = _this.handleShowContextMenu.bind(_assertThisInitialized(_this));
    _this.defaultTopicContextMenu = _this.defaultTopicContextMenu.bind(_assertThisInitialized(_this));
    _this.handleHideContextMenu = _this.handleHideContextMenu.bind(_assertThisInitialized(_this));
    _this.handleShowAlert = _this.handleShowAlert.bind(_assertThisInitialized(_this));
    _this.handleShowInfoView = _this.handleShowInfoView.bind(_assertThisInitialized(_this));
    _this.handleHideInfoView = _this.handleHideInfoView.bind(_assertThisInitialized(_this));
    _this.handleMemberUpdateRequest = _this.handleMemberUpdateRequest.bind(_assertThisInitialized(_this));
    _this.handleValidateCredentialsRequest = _this.handleValidateCredentialsRequest.bind(_assertThisInitialized(_this));
    _this.handlePasswordResetRequest = _this.handlePasswordResetRequest.bind(_assertThisInitialized(_this));
    _this.handleResetPassword = _this.handleResetPassword.bind(_assertThisInitialized(_this));
    _this.handleContextMenuAction = _this.handleContextMenuAction.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(TinodeWeb, [{
    key: "getBlankState",
    value: function getBlankState() {
      var settings = _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_14__["default"].getObject('settings') || {};
      return {
        connected: false,
        ready: false,
        transport: settings.transport || null,
        serverAddress: settings.serverAddress || Object(_lib_host_name_js__WEBPACK_IMPORTED_MODULE_13__["detectServerAddress"])(),
        serverVersion: "no connection",
        messageSounds: !settings.messageSoundsOff,
        desktopAlerts: settings.desktopAlerts,
        desktopAlertsEnabled: (Object(_lib_host_name_js__WEBPACK_IMPORTED_MODULE_13__["isSecureConnection"])() || Object(_lib_host_name_js__WEBPACK_IMPORTED_MODULE_13__["isLocalHost"])()) && typeof firebase_app__WEBPACK_IMPORTED_MODULE_3__ != 'undefined' && typeof navigator != 'undefined' && typeof FIREBASE_INIT != 'undefined',
        firebaseToken: _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_14__["default"].getObject('firebase-token'),
        errorText: '',
        errorLevel: null,
        errorAction: undefined,
        errorActionText: null,
        sidePanelSelected: 'login',
        sidePanelTitle: null,
        sidePanelAvatar: null,
        loadSpinnerVisible: false,
        login: '',
        password: '',
        myUserId: null,
        liveConnection: navigator.onLine,
        topicSelected: '',
        topicSelectedOnline: false,
        topicSelectedAcs: null,
        newTopicParams: null,
        loginDisabled: false,
        displayMobile: window.innerWidth <= _config_js__WEBPACK_IMPORTED_MODULE_11__["MEDIA_BREAKPOINT"],
        showInfoPanel: false,
        mobilePanel: 'sidepanel',
        contextMenuVisible: false,
        contextMenuBounds: null,
        contextMenuClickAt: null,
        contextMenuParams: null,
        contextMenuItems: [],
        alertVisible: false,
        alertParams: {},
        chatList: [],
        searchResults: [],
        searchableContacts: [],
        credMethod: undefined,
        credCode: undefined
      };
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      window.addEventListener('resize', this.handleResize);
      window.addEventListener('online', function (e) {
        _this2.handleOnline(true);
      });
      window.addEventListener('offline', function (e) {
        _this2.handleOnline(false);
      });
      window.addEventListener('hashchange', this.handleHashRoute);
      document.addEventListener('visibilitychange', this.handleVisibilityEvent);
      this.setState({
        viewportWidth: document.documentElement.clientWidth,
        viewportHeight: document.documentElement.clientHeight
      });
      this.tinode = TinodeWeb.tnSetup(this.state.serverAddress, this.state.transport);
      this.tinode.onConnect = this.handleConnected;
      this.tinode.onDisconnect = this.handleDisconnect;
      this.tinode.onAutoreconnectIteration = this.handleAutoreconnectIteration;

      if (this.state.desktopAlertsEnabled) {
        try {
          this.fbPush = firebase_app__WEBPACK_IMPORTED_MODULE_3__["initializeApp"](FIREBASE_INIT, _config_js__WEBPACK_IMPORTED_MODULE_11__["APP_NAME"]).messaging();
          this.fbPush.usePublicVapidKey(FIREBASE_INIT.messagingVapidKey);
          navigator.serviceWorker.register('/service-worker.js').then(function (reg) {
            _this2.checkForAppUpdate(reg);

            _this2.fbPush.useServiceWorker(reg);

            _this2.initDesktopAlerts();

            if (_this2.state.desktopAlerts) {
              if (!_this2.state.firebaseToken) {
                _this2.togglePushToken(true);
              } else {
                _this2.tinode.setDeviceToken(_this2.state.firebaseToken, true);
              }
            }
          }).catch(function (err) {
            console.log("Failed to register service worker:", err);
          });
        } catch (err) {
          this.handleError("Failed to initialize push notifications", 'err');
          console.log("Failed to initialize push notifications", err);
          this.setState({
            desktopAlertsEnabled: false
          });
        }
      }

      var token = _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_14__["default"].getObject('keep-logged-in') ? _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_14__["default"].getObject('auth-token') : undefined;
      var parsedNav = _lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__["default"].parseUrlHash(window.location.hash);

      if (token) {
        token.expires = new Date(token.expires);
        this.tinode.setAuthToken(token);
        this.tinode.connect().catch(function (err) {
          _this2.handleError(err.message, 'err');
        });
        delete parsedNav.params.info;
        delete parsedNav.params.tab;
        parsedNav.path[0] = '';
        _lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__["default"].composeUrlHash(parsedNav.path, parsedNav.params));
      } else if (!parsedNav.params.token) {
        _lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__["default"].navigateTo('');
      }

      this.readTimer = null;
      this.readTimerCallback = null;
      this.handleHashRoute();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      window.removeEventListener('resize', this.handleResize);
      window.removeEventListener('hashchange', this.handleHashRoute);
      document.removeEventListener('visibilitychange', this.handleVisibilityEvent);
    }
  }, {
    key: "handleResize",
    value: function handleResize() {
      var mobile = document.documentElement.clientWidth <= _config_js__WEBPACK_IMPORTED_MODULE_11__["MEDIA_BREAKPOINT"];
      this.setState({
        viewportWidth: document.documentElement.clientWidth,
        viewportHeight: document.documentElement.clientHeight
      });

      if (this.state.displayMobile != mobile) {
        this.setState({
          displayMobile: mobile
        });
      }
    }
  }, {
    key: "checkForAppUpdate",
    value: function checkForAppUpdate(reg) {
      var _this3 = this;

      var formatHTMLMessage = this.props.intl.formatHTMLMessage;

      reg.onupdatefound = function () {
        var installingWorker = reg.installing;

        installingWorker.onstatechange = function () {
          if (installingWorker.state == 'installed' && navigator.serviceWorker.controller) {
            _this3.handleError(formatHTMLMessage(messages.update_available), 'info');
          }
        };
      };
    }
  }, {
    key: "handleHashRoute",
    value: function handleHashRoute() {
      var hash = _lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__["default"].parseUrlHash(window.location.hash);

      if (hash.path && hash.path.length > 0) {
        if (['register', 'settings', 'edit', 'cred', 'reset', 'newtpk', 'archive', 'contacts', ''].includes(hash.path[0])) {
          this.setState({
            sidePanelSelected: hash.path[0]
          });
        } else {
          console.log("Unknown sidepanel view", hash.path[0]);
        }

        if (hash.path.length > 1 && hash.path[1] != this.state.topicSelected) {
          this.setState({
            topicSelected: tinode_sdk__WEBPACK_IMPORTED_MODULE_5___default.a.topicType(hash.path[1]) ? hash.path[1] : null
          });
        }
      } else {
        this.setState({
          sidePanelSelected: ''
        });
      }

      if (hash.params.method) {
        this.setState({
          credMethod: hash.params.method
        });
      }

      if (hash.params.code) {
        this.setState({
          credCode: hash.params.code
        });
      }

      this.setState({
        showInfoPanel: hash.params.info,
        newTopicTabSelected: hash.params.tab
      });
    }
  }, {
    key: "handleOnline",
    value: function handleOnline(online) {
      var newState = {
        liveConnection: online
      };

      if (online) {
        this.handleError('', null);
      } else {
        this.handleError("No connection", 'warn');
      }

      this.setState({
        liveConnection: online
      });
    }
  }, {
    key: "handleAppVisibility",
    value: function handleAppVisibility(visible, callback) {
      clearTimeout(this.readTimer);
      this.readTimerCallback = callback;

      if (visible && callback) {
        this.readTimer = setTimeout(callback, _config_js__WEBPACK_IMPORTED_MODULE_11__["READ_DELAY"]);
      } else {
        this.readTimer = null;
      }
    }
  }, {
    key: "handleReadTimer",
    value: function handleReadTimer(callback) {
      this.handleAppVisibility(!document.hidden, callback);
    }
  }, {
    key: "handleVisibilityEvent",
    value: function handleVisibilityEvent() {
      this.handleAppVisibility(!document.hidden, this.readTimerCallback);
    }
  }, {
    key: "handleError",
    value: function handleError(err, level, action, actionText) {
      this.setState({
        errorText: err,
        errorLevel: level,
        errorAction: action,
        errorActionText: actionText
      });
    }
  }, {
    key: "handleLoginRequest",
    value: function handleLoginRequest(login, password) {
      var _this4 = this;

      this.setState({
        loginDisabled: true,
        login: login,
        password: password,
        loadSpinnerVisible: true
      });
      this.handleError('', null);

      if (this.tinode.isConnected()) {
        this.doLogin(login, password, {
          meth: this.state.credMethod,
          resp: this.state.credCode
        });
      } else {
        this.tinode.connect().catch(function (err) {
          _this4.setState({
            loginDisabled: false
          });

          _this4.handleError(err.message, 'err');
        });
      }
    }
  }, {
    key: "handleConnected",
    value: function handleConnected() {
      var params = this.tinode.getServerInfo();
      this.setState({
        serverVersion: params.ver + ' ' + (params.build ? params.build : 'none') + '; '
      });
      this.doLogin(this.state.login, this.state.password, {
        meth: this.state.credMethod,
        resp: this.state.credCode
      });
    }
  }, {
    key: "handleAutoreconnectIteration",
    value: function handleAutoreconnectIteration(sec, prom) {
      var _this5 = this;

      clearInterval(this.reconnectCountdown);

      if (sec < 0) {
        this.handleError();
        return;
      }

      if (prom) {
        prom.then(function () {
          _this5.handleError();
        }).catch(function (err) {
          _this5.handleError(err.message, 'err');
        });
        return;
      }

      var formatHTMLMessage = this.props.intl.formatHTMLMessage;
      var count = sec / 1000;
      count = count | count;
      this.reconnectCountdown = setInterval(function () {
        var timeLeft = count > 99 ? Object(_lib_strformat_js__WEBPACK_IMPORTED_MODULE_16__["secondsToTime"])(count) : count;

        _this5.handleError(formatHTMLMessage(messages.reconnect_countdown, {
          seconds: timeLeft
        }), 'warn', function () {
          clearInterval(_this5.reconnectCountdown);

          _this5.tinode.reconnect();
        }, formatHTMLMessage(messages.reconnect_now));

        count -= 1;
      }, 1000);
    }
  }, {
    key: "handleDisconnect",
    value: function handleDisconnect(err) {
      this.setState({
        connected: false,
        ready: false,
        topicSelectedOnline: false,
        errorText: err && err.message ? err.message : "Disconnected",
        errorLevel: err && err.message ? 'err' : 'warn',
        loginDisabled: false,
        contextMenuVisible: false,
        serverVersion: "no connection"
      });
    }
  }, {
    key: "doLogin",
    value: function doLogin(login, password, cred) {
      var _this6 = this;

      if (this.tinode.isAuthenticated()) {
        _lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__["default"].navigateTo('');
        return;
      }

      cred = tinode_sdk__WEBPACK_IMPORTED_MODULE_5___default.a.credential(cred);
      var promise = null;
      var token = this.tinode.getAuthToken();

      if (login && password) {
        this.setState({
          password: null
        });
        promise = this.tinode.loginBasic(login, password, cred);
      } else if (token) {
        promise = this.tinode.loginToken(token.token, cred);
      }

      if (promise) {
        promise.then(function (ctrl) {
          if (ctrl.code >= 300 && ctrl.text === 'validate credentials') {
            _this6.setState({
              loadSpinnerVisible: false
            });

            if (cred) {
              _this6.handleError("Code does not match", 'warn');
            }

            _this6.handleCredentialsRequest(ctrl.params);
          } else {
            _this6.handleLoginSuccessful();
          }
        }).catch(function (err) {
          _this6.setState({
            loginDisabled: false,
            credMethod: undefined,
            credCode: undefined,
            loadSpinnerVisible: false
          });

          _this6.handleError(err.message, 'err');

          localStorage.removeItem('auth-token');
          _lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__["default"].navigateTo('');
        });
      } else {
        _lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__["default"].navigateTo('');
        this.setState({
          loginDisabled: false
        });
      }
    }
  }, {
    key: "handleCredentialsRequest",
    value: function handleCredentialsRequest(params) {
      var parsed = _lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__["default"].parseUrlHash(window.location.hash);
      parsed.path[0] = 'cred';
      parsed.params['method'] = params.cred[0];
      _lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__["default"].composeUrlHash(parsed.path, parsed.params));
    }
  }, {
    key: "handleLoginSuccessful",
    value: function handleLoginSuccessful() {
      var _this7 = this;

      this.handleError('', null);

      if (_lib_local_storage_js__WEBPACK_IMPORTED_MODULE_14__["default"].getObject('keep-logged-in')) {
        _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_14__["default"].setObject('auth-token', this.tinode.getAuthToken());
      }

      var me = this.tinode.getMeTopic();
      me.onMetaDesc = this.tnMeMetaDesc;
      me.onContactUpdate = this.tnMeContactUpdate;
      me.onSubsUpdated = this.tnMeSubsUpdated;
      this.setState({
        connected: true,
        credMethod: undefined,
        credCode: undefined,
        myUserId: this.tinode.getCurrentUserID()
      });
      me.subscribe(me.startMetaQuery().withLaterSub().withDesc().withTags().withCred().build()).catch(function (err) {
        _this7.tinode.disconnect();

        localStorage.removeItem('auth-token');

        _this7.handleError(err.message, 'err');

        _lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__["default"].navigateTo('');
      }).finally(function () {
        _this7.setState({
          loadSpinnerVisible: false
        });
      });
      _lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__["default"].setUrlSidePanel(window.location.hash, 'contacts'));
    }
  }, {
    key: "tnMeMetaDesc",
    value: function tnMeMetaDesc(desc) {
      if (desc && desc.public) {
        this.setState({
          sidePanelTitle: desc.public.fn,
          sidePanelAvatar: Object(_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_12__["makeImageUrl"])(desc.public.photo)
        });
      }
    }
  }, {
    key: "tnMeContactUpdate",
    value: function tnMeContactUpdate(what, cont) {
      if (what == 'on' || what == 'off') {
        this.resetContactList();

        if (this.state.topicSelected == cont.topic) {
          this.setState({
            topicSelectedOnline: what == 'on'
          });
        }
      } else if (what == 'read') {
        this.resetContactList();
      } else if (what == 'msg') {
        var topic = this.tinode.getTopic(cont.topic);
        var archived = topic && topic.isArchived();

        if (document.hidden) {
          if (this.state.messageSounds && !archived) {
            POP_SOUND.play();
          }

          this.resetContactList();
        } else if (this.state.topicSelected != cont.topic) {
          if (this.state.messageSounds && !archived) {
            POP_SOUND.play();
          }

          this.resetContactList();
        }
      } else if (what == 'recv') {} else if (what == 'gone' || what == 'unsub') {
        if (this.state.topicSelected == cont.topic) {
          this.handleTopicSelected(null);
        }

        this.resetContactList();
      } else if (what == 'acs') {
        if (this.state.topicSelected == cont.topic) {
          this.setState({
            topicSelectedAcs: cont.acs
          });
        }
      } else if (what == 'del') {} else if (what == 'upd') {} else {
        console.log("Unsupported (yet) presence update:" + what + " in: " + cont.topic);
      }
    }
  }, {
    key: "tnMeSubsUpdated",
    value: function tnMeSubsUpdated(unused) {
      this.resetContactList();
    }
  }, {
    key: "resetContactList",
    value: function resetContactList() {
      var _this8 = this;

      var newState = {
        chatList: []
      };

      if (!this.state.ready) {
        newState.ready = true;
      }

      this.tinode.getMeTopic().contacts(function (c) {
        newState.chatList.push(c);

        if (_this8.state.topicSelected == c.topic) {
          newState.topicSelectedOnline = c.online;
          newState.topicSelectedAcs = c.acs;
        }
      });
      newState.searchableContacts = TinodeWeb.prepareSearchableContacts(newState.chatList, this.state.searchResults);
      this.setState(newState);
    }
  }, {
    key: "tnData",
    value: function tnData(data) {
      var _this9 = this;

      var topic = this.tinode.getTopic(data.topic);

      if (topic.msgStatus(data) >= tinode_sdk__WEBPACK_IMPORTED_MODULE_5___default.a.MESSAGE_STATUS_SENT && data.from != this.state.myUserId) {
        clearTimeout(this.receivedTimer);
        this.receivedTimer = setTimeout(function () {
          _this9.receivedTimer = undefined;
          topic.noteRecv(data.seq);
        }, _config_js__WEBPACK_IMPORTED_MODULE_11__["RECEIVED_DELAY"]);
      }
    }
  }, {
    key: "tnInitFind",
    value: function tnInitFind() {
      var _this10 = this;

      var fnd = this.tinode.getFndTopic();
      fnd.onSubsUpdated = this.tnFndSubsUpdated;

      if (fnd.isSubscribed()) {
        this.tnFndSubsUpdated();
      } else {
        fnd.subscribe(fnd.startMetaQuery().withSub().build()).catch(function (err) {
          _this10.handleError(err.message, 'err');
        });
      }
    }
  }, {
    key: "tnFndSubsUpdated",
    value: function tnFndSubsUpdated() {
      var foundContacts = [];
      this.tinode.getFndTopic().contacts(function (s) {
        foundContacts.push(s);
      });
      this.setState({
        searchResults: foundContacts,
        searchableContacts: TinodeWeb.prepareSearchableContacts(this.state.chatList, foundContacts)
      });
    }
  }, {
    key: "handleSearchContacts",
    value: function handleSearchContacts(query) {
      var _this11 = this;

      var fnd = this.tinode.getFndTopic();
      fnd.setMeta({
        desc: {
          public: query
        }
      }).then(function (ctrl) {
        return fnd.getMeta(fnd.startMetaQuery().withSub().build());
      }).catch(function (err) {
        _this11.handleError(err.message, 'err');
      });
    }
  }, {
    key: "handleTopicSelected",
    value: function handleTopicSelected(topicName, unused_index, online, acs) {
      if (this.state.newTopicParams && this.state.newTopicParams._topicName != topicName) {
        this.setState({
          newTopicParams: null
        });
      }

      if (topicName) {
        this.setState({
          errorText: '',
          errorLevel: null,
          mobilePanel: 'topic-view',
          showInfoPanel: false
        });

        if (this.state.topicSelected != topicName) {
          this.setState({
            topicSelectedOnline: online,
            topicSelectedAcs: acs
          });
          _lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__["default"].setUrlTopic('', topicName));
        }
      } else {
        this.setState({
          errorText: '',
          errorLevel: null,
          mobilePanel: 'sidepanel',
          topicSelectedOnline: false,
          topicSelectedAcs: null,
          showInfoPanel: false
        });
        _lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__["default"].setUrlTopic('', null));
      }
    }
  }, {
    key: "handleHideMessagesView",
    value: function handleHideMessagesView() {
      this.setState({
        mobilePanel: 'sidepanel'
      });
      _lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__["default"].setUrlTopic(window.location.hash, null));
    }
  }, {
    key: "handleSendMessage",
    value: function handleSendMessage(msg, promise, uploader) {
      var _this12 = this;

      var topic = this.tinode.getTopic(this.state.topicSelected);
      msg = topic.createMessage(msg, false);
      msg._uploader = uploader;

      if (!topic.isSubscribed()) {
        if (!promise) {
          promise = Promise.resolve();
        }

        promise = promise.then(function () {
          return topic.subscribe();
        });
      }

      if (promise) {
        promise = promise.catch(function (err) {
          _this12.handleError(err.message, 'err');
        });
      }

      topic.publishDraft(msg, promise).then(function (ctrl) {
        if (topic.isArchived()) {
          return topic.archive(false);
        }
      }).catch(function (err) {
        _this12.handleError(err.message, 'err');
      });
    }
  }, {
    key: "handleNewChatInvitation",
    value: function handleNewChatInvitation(topicName, action) {
      var _this13 = this;

      var topic = this.tinode.getTopic(topicName);
      var response = null;

      switch (action) {
        case 'accept':
          var mode = topic.getAccessMode().getGiven();
          response = topic.setMeta({
            sub: {
              mode: mode
            }
          });

          if (topic.getType() == 'p2p') {
            response = response.then(function (ctrl) {
              topic.setMeta({
                sub: {
                  user: topicName,
                  mode: mode
                }
              });
            });
          }

          break;

        case 'delete':
          response = topic.delTopic();
          break;

        case 'block':
          var am = topic.getAccessMode().updateWant('-JP').getWant();
          response = topic.setMeta({
            sub: {
              mode: am
            }
          }).then(function (ctrl) {
            return _this13.handleTopicSelected(null);
          });
          break;

        default:
          console.log("Unknown invitation action", '"' + action + '""');
      }

      if (response != null) {
        response.catch(function (err) {
          _this13.handleError(err.message, 'err');
        });
      }
    }
  }, {
    key: "handleNewAccount",
    value: function handleNewAccount() {
      _lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__["default"].setUrlSidePanel(window.location.hash, 'register'));
    }
  }, {
    key: "handleNewAccountRequest",
    value: function handleNewAccountRequest(login_, password_, public_, cred_, tags_) {
      var _this14 = this;

      this.tinode.connect(this.state.serverAddress).then(function () {
        return _this14.tinode.createAccountBasic(login_, password_, {
          public: public_,
          tags: tags_,
          cred: tinode_sdk__WEBPACK_IMPORTED_MODULE_5___default.a.credential(cred_)
        });
      }).then(function (ctrl) {
        if (ctrl.code >= 300 && ctrl.text == 'validate credentials') {
          _this14.handleCredentialsRequest(ctrl.params);
        } else {
          _this14.handleLoginSuccessful(_this14);
        }
      }).catch(function (err) {
        _this14.handleError(err.message, 'err');
      });
    }
  }, {
    key: "handleUpdateAccountRequest",
    value: function handleUpdateAccountRequest(password, pub, defacs) {
      var _this15 = this;

      if (pub || defacs) {
        var params = {};

        if (pub) {
          params.public = pub;
        }

        if (defacs) {
          params.defacs = defacs;
        }

        this.tinode.getMeTopic().setMeta({
          desc: params
        }).catch(function (err) {
          _this15.handleError(err.message, 'err');
        });
      }

      if (password) {
        this.tinode.updateAccountBasic(null, this.tinode.getCurrentLogin(), password).catch(function (err) {
          _this15.handleError(err.message, 'err');
        });
      }
    }
  }, {
    key: "handleUpdateAccountTagsRequest",
    value: function handleUpdateAccountTagsRequest(tags) {
      var _this16 = this;

      this.tinode.getMeTopic().setMeta({
        tags: tags
      }).catch(function (err) {
        _this16.handleError(err.message, 'err');
      });
    }
  }, {
    key: "handleSettings",
    value: function handleSettings() {
      _lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__["default"].setUrlSidePanel(window.location.hash, this.state.myUserId ? 'edit' : 'settings'));
    }
  }, {
    key: "handleGlobalSettings",
    value: function handleGlobalSettings(settings) {
      var serverAddress = settings.serverAddress || this.state.serverAddress;
      var transport = settings.transport || this.state.transport;

      if (this.tinode) {
        this.tinode.onDisconnect = undefined;
        this.tinode.disconnect();
      }

      this.tinode = TinodeWeb.tnSetup(serverAddress, transport);
      this.tinode.onConnect = this.handleConnected;
      this.tinode.onDisconnect = this.handleDisconnect;
      this.setState({
        serverAddress: serverAddress,
        transport: transport
      });
      _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_14__["default"].setObject('settings', {
        serverAddress: serverAddress,
        transport: transport
      });
      _lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__["default"].setUrlSidePanel(window.location.hash, ''));
    }
  }, {
    key: "handleShowArchive",
    value: function handleShowArchive() {
      _lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__["default"].setUrlSidePanel(window.location.hash, this.state.myUserId ? 'archive' : ''));
    }
  }, {
    key: "initDesktopAlerts",
    value: function initDesktopAlerts() {
      var _this17 = this;

      this.fbPush.onTokenRefresh(function () {
        _this17.requestPushToken();
      });
      this.fbPush.onMessage(function (payload) {});
    }
  }, {
    key: "togglePushToken",
    value: function togglePushToken(enabled) {
      var _this18 = this;

      if (enabled) {
        if (!this.state.firebaseToken) {
          this.fbPush.requestPermission().then(function () {
            _this18.requestPushToken();
          }).catch(function (err) {
            _this18.handleError(err.message, 'err');

            _this18.setState({
              desktopAlerts: false,
              firebaseToken: null
            });

            _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_14__["default"].updateObject('settings', {
              desktopAlerts: false
            });
            console.log("Failed to get permission to notify.", err);
          });
        } else {
          this.setState({
            desktopAlerts: true
          });
          _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_14__["default"].updateObject('settings', {
            desktopAlerts: true
          });
        }
      } else if (this.state.firebaseToken) {
        this.fbPush.deleteToken(this.state.firebaseToken).catch(function (err) {
          console.log("Unable to delete token.", err);
        }).finally(function () {
          _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_14__["default"].updateObject('settings', {
            desktopAlerts: false
          });
          localStorage.removeItem('firebase-token');

          _this18.setState({
            desktopAlerts: false,
            firebaseToken: null
          });
        });
      } else {
        this.setState({
          desktopAlerts: false,
          firebaseToken: null
        });
        _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_14__["default"].updateObject('settings', {
          desktopAlerts: false
        });
      }
    }
  }, {
    key: "requestPushToken",
    value: function requestPushToken() {
      var _this19 = this;

      this.fbPush.getToken().then(function (refreshedToken) {
        if (refreshedToken != _this19.state.firebaseToken) {
          _this19.tinode.setDeviceToken(refreshedToken, true);

          _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_14__["default"].setObject('firebase-token', refreshedToken);
        }

        _this19.setState({
          firebaseToken: refreshedToken,
          desktopAlerts: true
        });

        _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_14__["default"].updateObject('settings', {
          desktopAlerts: true
        });
      }).catch(function (err) {
        _this19.handleError(err.message, 'err');

        console.log("Failed to retrieve firebase token", err);
      });
    }
  }, {
    key: "handleToggleMessageSounds",
    value: function handleToggleMessageSounds(enabled) {
      this.setState({
        messageSounds: enabled
      });
      _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_14__["default"].updateObject('settings', {
        messageSoundsOff: !enabled
      });
    }
  }, {
    key: "handleCredAdd",
    value: function handleCredAdd(method, value) {
      var _this20 = this;

      var me = this.tinode.getMeTopic();
      me.setMeta({
        cred: {
          meth: method,
          val: value
        }
      }).catch(function (err) {
        _this20.handleError(err.message, 'err');
      });
    }
  }, {
    key: "handleCredDelete",
    value: function handleCredDelete(method, value) {
      var _this21 = this;

      var me = this.tinode.getMeTopic();
      me.delCredential(method, value).catch(function (err) {
        _this21.handleError(err.message, 'err');
      });
    }
  }, {
    key: "handleCredConfirm",
    value: function handleCredConfirm(method, response) {
      this.handleCredentialsRequest({
        cred: [method]
      });
    }
  }, {
    key: "handleSidepanelCancel",
    value: function handleSidepanelCancel() {
      var parsed = _lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__["default"].parseUrlHash(window.location.hash);
      parsed.path[0] = this.state.myUserId ? 'contacts' : '';

      if (parsed.params) {
        delete parsed.params.code;
        delete parsed.params.method;
        delete parsed.params.tab;
      }

      _lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__["default"].composeUrlHash(parsed.path, parsed.params));
      this.setState({
        errorText: '',
        errorLevel: null
      });
    }
  }, {
    key: "handleNewTopic",
    value: function handleNewTopic() {
      _lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__["default"].setUrlSidePanel(window.location.hash, 'newtpk'));
    }
  }, {
    key: "handleNewTopicRequest",
    value: function handleNewTopicRequest(peerName, pub, priv, tags) {
      var _this22 = this;

      var topicName = peerName || this.tinode.newGroupTopicName();
      var params = {
        _topicName: topicName
      };

      if (peerName) {
        params.sub = {
          mode: _config_js__WEBPACK_IMPORTED_MODULE_11__["DEFAULT_P2P_ACCESS_MODE"]
        };
        params.desc = {
          defacs: {
            auth: _config_js__WEBPACK_IMPORTED_MODULE_11__["DEFAULT_P2P_ACCESS_MODE"]
          }
        };
      } else {
        params.desc = {
          public: pub,
          private: {
            comment: priv
          }
        };
        params.tags = tags;
      }

      this.setState({
        newTopicParams: params
      }, function () {
        _this22.handleTopicSelected(topicName);
      });
    }
  }, {
    key: "handleNewTopicCreated",
    value: function handleNewTopicCreated(oldName, newName) {
      if (this.state.topicSelected == oldName && oldName != newName) {
        this.setState({
          topicSelected: newName
        }, function () {
          _lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__["default"].setUrlTopic('', newName));
        });
      }
    }
  }, {
    key: "handleTopicUpdateRequest",
    value: function handleTopicUpdateRequest(topicName, pub, priv, permissions) {
      var _this23 = this;

      var topic = this.tinode.getTopic(topicName);

      if (topic) {
        var params = {};

        if (pub) {
          params.public = pub;
        }

        if (priv) {
          params.private = priv === tinode_sdk__WEBPACK_IMPORTED_MODULE_5___default.a.DEL_CHAR ? tinode_sdk__WEBPACK_IMPORTED_MODULE_5___default.a.DEL_CHAR : {
            comment: priv
          };
        }

        if (permissions) {
          params.defacs = permissions;
        }

        topic.setMeta({
          desc: params
        }).catch(function (err) {
          _this23.handleError(err.message, 'err');
        });
      }
    }
  }, {
    key: "handleChangePermissions",
    value: function handleChangePermissions(topicName, mode, uid) {
      var _this24 = this;

      var topic = this.tinode.getTopic(topicName);

      if (topic) {
        var am = topic.getAccessMode();

        if (uid) {
          am.updateGiven(mode);
          mode = am.getGiven();
        } else {
          am.updateWant(mode);
          mode = am.getWant();
        }

        topic.setMeta({
          sub: {
            user: uid,
            mode: mode
          }
        }).catch(function (err) {
          _this24.handleError(err.message, 'err');
        });
      }
    }
  }, {
    key: "handleTagsUpdated",
    value: function handleTagsUpdated(topicName, tags) {
      var _this25 = this;

      var topic = this.tinode.getTopic(topicName);

      if (topic) {
        topic.setMeta({
          tags: tags
        }).catch(function (err) {
          _this25.handleError(err.message, 'err');
        });
      }
    }
  }, {
    key: "handleLogout",
    value: function handleLogout() {
      Object(_lib_utils_js__WEBPACK_IMPORTED_MODULE_17__["updateFavicon"])(0);
      localStorage.removeItem('auth-token');
      localStorage.removeItem('firebase-token');
      localStorage.removeItem('settings');

      if (this.state.firebaseToken) {
        this.fbPush.deleteToken(this.state.firebaseToken);
      }

      if (this.tinode) {
        this.tinode.onDisconnect = undefined;
        this.tinode.disconnect();
      }

      this.setState(this.getBlankState());
      this.tinode = TinodeWeb.tnSetup(this.state.serverAddress, this.state.transport);
      this.tinode.onConnect = this.handleConnected;
      this.tinode.onDisconnect = this.handleDisconnect;
      _lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__["default"].navigateTo('');
    }
  }, {
    key: "handleDeleteMessagesRequest",
    value: function handleDeleteMessagesRequest(topicName) {
      var _this26 = this;

      var topic = this.tinode.getTopic(topicName);

      if (!topic) {
        return;
      }

      topic.delMessagesAll(true).catch(function (err) {
        _this26.handleError(err.message, 'err');
      });
    }
  }, {
    key: "handleLeaveUnsubRequest",
    value: function handleLeaveUnsubRequest(topicName) {
      var _this27 = this;

      var topic = this.tinode.getTopic(topicName);

      if (!topic) {
        return;
      }

      topic.leave(true).then(function (ctrl) {
        _lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__["default"].setUrlTopic(window.location.hash, ''));
      }).catch(function (err) {
        _this27.handleError(err.message, 'err');
      });
    }
  }, {
    key: "handleBlockTopicRequest",
    value: function handleBlockTopicRequest(topicName) {
      var _this28 = this;

      var topic = this.tinode.getTopic(topicName);

      if (!topic) {
        return;
      }

      topic.updateMode(null, '-JP').then(function (ctrl) {
        _lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__["default"].setUrlTopic(window.location.hash, ''));
      }).catch(function (err) {
        _this28.handleError(err.message, 'err');
      });
    }
  }, {
    key: "handleReportTopic",
    value: function handleReportTopic(topicName) {
      var _this29 = this;

      var topic = this.tinode.getTopic(topicName);

      if (!topic) {
        return;
      }

      this.tinode.publish(tinode_sdk__WEBPACK_IMPORTED_MODULE_5___default.a.TOPIC_SYS, tinode_sdk__WEBPACK_IMPORTED_MODULE_5___default.a.Drafty.attachJSON(null, {
        'action': 'report',
        'target': topicName
      }));
      topic.updateMode(null, '-JP').then(function (ctrl) {
        _lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__["default"].setUrlTopic(window.location.hash, ''));
      }).catch(function (err) {
        _this29.handleError(err.message, 'err');
      });
    }
  }, {
    key: "handleShowContextMenu",
    value: function handleShowContextMenu(params, menuItems) {
      this.setState({
        contextMenuVisible: true,
        contextMenuClickAt: {
          x: params.x,
          y: params.y
        },
        contextMenuParams: params,
        contextMenuItems: menuItems || this.defaultTopicContextMenu(params.topicName),
        contextMenuBounds: react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.findDOMNode(this).getBoundingClientRect()
      });
    }
  }, {
    key: "defaultTopicContextMenu",
    value: function defaultTopicContextMenu(topicName) {
      var topic = this.tinode.getTopic(topicName);
      var formatMessage = this.props.intl.formatMessage;
      var muted = false,
          blocked = false,
          self_blocked = false,
          subscribed = false,
          deleter = false,
          archived = false;

      if (topic) {
        subscribed = topic.isSubscribed();
        archived = topic.isArchived();
        var acs = topic.getAccessMode();

        if (acs) {
          muted = acs.isMuted();
          blocked = !acs.isJoiner();
          self_blocked = !acs.isJoiner('want');
          deleter = acs.isDeleter();
        }
      }

      return [subscribed ? {
        title: formatMessage({
          id: 'menu_item_info'
        }),
        handler: this.handleShowInfoView
      } : null, subscribed ? 'messages_clear' : null, subscribed && deleter ? 'messages_clear_hard' : null, muted ? blocked ? null : 'topic_unmute' : 'topic_mute', self_blocked ? 'topic_unblock' : 'topic_block', !archived ? 'topic_archive' : null, 'topic_delete'];
    }
  }, {
    key: "handleHideContextMenu",
    value: function handleHideContextMenu() {
      this.setState({
        contextMenuVisible: false,
        contextMenuClickAt: null,
        contextMenuParams: null,
        contextMenuBounds: null
      });
    }
  }, {
    key: "handleContextMenuAction",
    value: function handleContextMenuAction(action, promise, params) {
      var _this30 = this;

      if (action == 'topic_archive') {
        if (promise && params.topicName && params.topicName == this.state.topicSelected) {
          promise.then(function () {
            _this30.handleTopicSelected(null);
          });
        }
      }
    }
  }, {
    key: "handleShowAlert",
    value: function handleShowAlert(title, content, onConfirm, confirm, onReject, reject) {
      this.setState({
        alertVisible: true,
        alertParams: {
          title: title,
          content: content,
          onConfirm: onConfirm,
          confirm: confirm,
          onReject: onReject,
          reject: reject
        }
      });
    }
  }, {
    key: "handleShowInfoView",
    value: function handleShowInfoView() {
      _lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__["default"].addUrlParam(window.location.hash, 'info', true));
      this.setState({
        showInfoPanel: true
      });
    }
  }, {
    key: "handleHideInfoView",
    value: function handleHideInfoView() {
      _lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__["default"].removeUrlParam(window.location.hash, 'info'));
      this.setState({
        showInfoPanel: false
      });
    }
  }, {
    key: "handleMemberUpdateRequest",
    value: function handleMemberUpdateRequest(topicName, added, removed) {
      var _this31 = this;

      if (!topicName) {
        return;
      }

      var topic = this.tinode.getTopic(topicName);

      if (!topic) {
        return;
      }

      if (added && added.length > 0) {
        added.map(function (uid) {
          topic.invite(uid, null).catch(function (err) {
            _this31.handleError(err.message, 'err');
          });
        });
      }

      if (removed && removed.length > 0) {
        removed.map(function (uid) {
          topic.delSubscription(uid).catch(function (err) {
            _this31.handleError(err.message, 'err');
          });
        });
      }
    }
  }, {
    key: "handleValidateCredentialsRequest",
    value: function handleValidateCredentialsRequest(cred, code) {
      var _this32 = this;

      if (this.tinode.isAuthenticated()) {
        var me = this.tinode.getMeTopic();
        me.setMeta({
          cred: {
            meth: cred,
            resp: code
          }
        }).then(function () {
          _lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__["default"].navigateTo('');
        }).catch(function (err) {
          _this32.handleError(err.message, 'err');
        });
      } else {
        this.setState({
          credMethod: cred,
          credCode: code
        });
        this.doLogin(null, null, {
          meth: cred,
          resp: code
        });
      }
    }
  }, {
    key: "handlePasswordResetRequest",
    value: function handlePasswordResetRequest(method, value) {
      var _this33 = this;

      this.tinode.connect().then(function () {
        return _this33.tinode.requestResetAuthSecret('basic', method, value);
      }).catch(function (err) {
        _this33.handleError(err.message, 'err');
      });
    }
  }, {
    key: "handleResetPassword",
    value: function handleResetPassword(scheme, newPassword, token) {
      var _this34 = this;

      token = Object(_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_12__["base64ReEncode"])(token);

      if (!token) {
        this.handleError("Invalid security token", 'err');
      } else {
        this.tinode.connect().then(function () {
          return _this34.tinode.updateAccountBasic(null, null, newPassword, {
            token: token
          });
        }).catch(function (err) {
          _this34.handleError(err.message, 'err');
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this35 = this;

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        id: "app-container"
      }, this.state.contextMenuVisible ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_context_menu_jsx__WEBPACK_IMPORTED_MODULE_7__["default"], {
        tinode: this.tinode,
        bounds: this.state.contextMenuBounds,
        clickAt: this.state.contextMenuClickAt,
        params: this.state.contextMenuParams,
        items: this.state.contextMenuItems,
        hide: this.handleHideContextMenu,
        onShowAlert: this.handleShowAlert,
        onAction: this.handleContextMenuAction,
        onTopicRemoved: function onTopicRemoved(topicName) {
          if (topicName == _this35.state.topicSelected) {
            _this35.handleTopicSelected(null);
          }
        },
        onError: this.handleError
      }) : null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_alert_jsx__WEBPACK_IMPORTED_MODULE_6__["default"], {
        visible: this.state.alertVisible,
        title: this.state.alertParams.title,
        content: this.state.alertParams.content,
        onReject: this.state.alertParams.onReject ? function () {
          _this35.setState({
            alertVisible: false
          });
        } : null,
        reject: this.state.alertParams.reject,
        onConfirm: function onConfirm() {
          _this35.setState({
            alertVisible: false
          });

          _this35.state.alertParams.onConfirm();
        },
        confirm: this.state.alertParams.confirm
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_sidepanel_view_jsx__WEBPACK_IMPORTED_MODULE_10__["default"], {
        tinode: this.tinode,
        connected: this.state.connected,
        displayMobile: this.state.displayMobile,
        hideSelf: this.state.displayMobile && this.state.mobilePanel !== 'sidepanel',
        state: this.state.sidePanelSelected,
        title: this.state.sidePanelTitle,
        avatar: this.state.sidePanelAvatar,
        login: this.state.login,
        myUserId: this.state.myUserId,
        loginDisabled: this.state.loginDisabled,
        loadSpinnerVisible: this.state.loadSpinnerVisible,
        errorText: this.state.errorText,
        errorLevel: this.state.errorLevel,
        errorAction: this.state.errorAction,
        errorActionText: this.state.errorActionText,
        topicSelected: this.state.topicSelected,
        chatList: this.state.chatList,
        credMethod: this.state.credMethod,
        credCode: this.state.credCode,
        transport: this.state.transport,
        messageSounds: this.state.messageSounds,
        desktopAlerts: this.state.desktopAlerts,
        desktopAlertsEnabled: this.state.desktopAlertsEnabled,
        serverAddress: this.state.serverAddress,
        onGlobalSettings: this.handleGlobalSettings,
        onSignUp: this.handleNewAccount,
        onSettings: this.handleSettings,
        onLoginRequest: this.handleLoginRequest,
        onCreateAccount: this.handleNewAccountRequest,
        onUpdateAccount: this.handleUpdateAccountRequest,
        onUpdateAccountTags: this.handleUpdateAccountTagsRequest,
        onTogglePushNotifications: this.togglePushToken,
        onToggleMessageSounds: this.handleToggleMessageSounds,
        onCredAdd: this.handleCredAdd,
        onCredDelete: this.handleCredDelete,
        onCredConfirm: this.handleCredConfirm,
        onTopicSelected: this.handleTopicSelected,
        onCreateTopic: this.handleNewTopicRequest,
        onNewTopic: this.handleNewTopic,
        onLogout: this.handleLogout,
        onCancel: this.handleSidepanelCancel,
        onError: this.handleError,
        onValidateCredentials: this.handleValidateCredentialsRequest,
        onPasswordResetRequest: this.handlePasswordResetRequest,
        onResetPassword: this.handleResetPassword,
        onShowArchive: this.handleShowArchive,
        onInitFind: this.tnInitFind,
        searchResults: this.state.searchResults,
        onSearchContacts: this.handleSearchContacts,
        showContextMenu: this.handleShowContextMenu
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_messages_view_jsx__WEBPACK_IMPORTED_MODULE_9__["default"], {
        tinode: this.tinode,
        connected: this.state.connected,
        ready: this.state.ready,
        online: this.state.topicSelectedOnline,
        acs: this.state.topicSelectedAcs,
        displayMobile: this.state.displayMobile,
        viewportWidth: this.state.viewportWidth,
        viewportHeight: this.state.viewportHeight,
        hideSelf: this.state.displayMobile && (this.state.mobilePanel !== 'topic-view' || this.state.showInfoPanel),
        topic: this.state.topicSelected,
        myUserId: this.state.myUserId,
        serverVersion: this.state.serverVersion,
        serverAddress: this.state.serverAddress,
        errorText: this.state.errorText,
        errorLevel: this.state.errorLevel,
        errorAction: this.state.errorAction,
        errorActionText: this.state.errorActionText,
        newTopicParams: this.state.newTopicParams,
        onHideMessagesView: this.handleHideMessagesView,
        onData: this.tnData,
        onError: this.handleError,
        onNewTopicCreated: this.handleNewTopicCreated,
        readTimerHandler: this.handleReadTimer,
        showContextMenu: this.handleShowContextMenu,
        onChangePermissions: this.handleChangePermissions,
        onNewChat: this.handleNewChatInvitation,
        sendMessage: this.handleSendMessage
      }), this.state.showInfoPanel ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_info_view_jsx__WEBPACK_IMPORTED_MODULE_8__["default"], {
        tinode: this.tinode,
        connected: this.state.connected,
        displayMobile: this.state.displayMobile,
        topic: this.state.topicSelected,
        searchableContacts: this.state.searchableContacts,
        myUserId: this.state.myUserId,
        errorText: this.state.errorText,
        errorLevel: this.state.errorLevel,
        errorAction: this.state.errorAction,
        errorActionText: this.state.errorActionText,
        onTopicDescUpdate: this.handleTopicUpdateRequest,
        onCancel: this.handleHideInfoView,
        onShowAlert: this.handleShowAlert,
        onChangePermissions: this.handleChangePermissions,
        onMemberUpdateRequest: this.handleMemberUpdateRequest,
        onDeleteMessages: this.handleDeleteMessagesRequest,
        onLeaveTopic: this.handleLeaveUnsubRequest,
        onBlockTopic: this.handleBlockTopicRequest,
        onReportTopic: this.handleReportTopic,
        onAddMember: this.handleManageGroupMembers,
        onTopicTagsUpdate: this.handleTagsUpdated,
        onInitFind: this.tnInitFind,
        onError: this.handleError,
        showContextMenu: this.handleShowContextMenu
      }) : null);
    }
  }], [{
    key: "tnSetup",
    value: function tnSetup(serverAddress, transport) {
      var tinode = new tinode_sdk__WEBPACK_IMPORTED_MODULE_5___default.a(_config_js__WEBPACK_IMPORTED_MODULE_11__["APP_NAME"], serverAddress, _config_js__WEBPACK_IMPORTED_MODULE_11__["API_KEY"], transport, Object(_lib_host_name_js__WEBPACK_IMPORTED_MODULE_13__["isSecureConnection"])());
      tinode.enableLogging(_config_js__WEBPACK_IMPORTED_MODULE_11__["LOGGING_ENABLED"], true);
      return tinode;
    }
  }, {
    key: "prepareSearchableContacts",
    value: function prepareSearchableContacts(chatList, foundContacts) {
      var merged = {};
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = chatList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var c = _step.value;

          if (tinode_sdk__WEBPACK_IMPORTED_MODULE_5___default.a.topicType(c.topic) == 'p2p') {
            merged[c.topic] = {
              user: c.topic,
              updated: c.updated,
              public: c.public,
              private: c.private,
              acs: c.acs
            };
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = foundContacts[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _c = _step2.value;

          if (!merged[_c.user]) {
            merged[_c.user] = _c;
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return Object.values(merged);
    }
  }]);

  return TinodeWeb;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);

;
/* harmony default export */ __webpack_exports__["default"] = (Object(react_intl__WEBPACK_IMPORTED_MODULE_2__["injectIntl"])(TinodeWeb));

/***/ }),

/***/ "./src/views/validation-view.jsx":
/*!***************************************!*\
  !*** ./src/views/validation-view.jsx ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }



var messages = Object(react_intl__WEBPACK_IMPORTED_MODULE_1__["defineMessages"])({
  phone: {
    "id": "phone_dative",
    "defaultMessage": "phone"
  },
  email: {
    "id": "email_dative",
    "defaultMessage": "email"
  }
});

var ValidationView = function (_React$PureComponent) {
  _inherits(ValidationView, _React$PureComponent);

  function ValidationView(props) {
    var _this;

    _classCallCheck(this, ValidationView);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ValidationView).call(this, props));
    _this.state = {
      code: props.credCode || ''
    };
    _this.handleChange = _this.handleChange.bind(_assertThisInitialized(_this));
    _this.handleKeyPress = _this.handleKeyPress.bind(_assertThisInitialized(_this));
    _this.handleSubmit = _this.handleSubmit.bind(_assertThisInitialized(_this));
    _this.handleCancel = _this.handleCancel.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(ValidationView, [{
    key: "handleChange",
    value: function handleChange(e) {
      this.setState({
        code: e.target.value
      });
    }
  }, {
    key: "handleKeyPress",
    value: function handleKeyPress(e) {
      if (e.key === 'Enter') {
        this.handleSubmit(e);
      } else if (e.key == 'Escape') {
        this.handleCancel(e);
      }
    }
  }, {
    key: "handleSubmit",
    value: function handleSubmit(e) {
      e.preventDefault();

      if (this.state.code && this.state.code.trim()) {
        this.props.onSubmit(this.props.credMethod, this.state.code.trim());
      }
    }
  }, {
    key: "handleCancel",
    value: function handleCancel(e) {
      e.preventDefault();
      this.props.onCancel();
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var formatMessage = this.props.intl.formatMessage;
      var methods = {
        'email': formatMessage(messages.email),
        'tel': formatMessage(messages.phone)
      };
      var method = methods[this.props.credMethod] || this.props.credMethod;
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "small",
        htmlFor: "enter-confirmation-code"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "enter_confirmation_code_prompt",
        defaultMessage: "Enter confirmation code sent to you by {method}:",
        values: {
          method: method
        }
      }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "numeric_confirmation_code_prompt",
        defaultMessage: "Numbers only"
      }, function (numbers_only) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
          type: "text",
          id: "enter-confirmation-code",
          placeholder: numbers_only,
          value: _this2.state.code,
          onChange: _this2.handleChange,
          onKeyPress: _this2.handleKeyPress,
          required: true
        });
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "dialog-buttons"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "blue",
        onClick: this.handleSubmit
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "button_confirm",
        defaultMessage: "Confirm"
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "white",
        onClick: this.handleCancel
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "button_cancel"
      }))));
    }
  }]);

  return ValidationView;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.PureComponent);

;
/* harmony default export */ __webpack_exports__["default"] = (Object(react_intl__WEBPACK_IMPORTED_MODULE_1__["injectIntl"])(ValidationView));

/***/ }),

/***/ "./src/widgets/Invitation.jsx":
/*!************************************!*\
  !*** ./src/widgets/Invitation.jsx ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Invitation; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }




var Invitation = function (_React$PureComponent) {
  _inherits(Invitation, _React$PureComponent);

  function Invitation(props) {
    var _this;

    _classCallCheck(this, Invitation);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Invitation).call(this, props));
    _this.handleButtonAction = _this.handleButtonAction.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(Invitation, [{
    key: "handleButtonAction",
    value: function handleButtonAction(evt, data) {
      evt.preventDefault();
      this.props.onAction(data);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "accept-invite-panel"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "title"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "chat_invitation",
        defaultMessage: "You are invited to start a new chat. What would you like to do?"
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "footer"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "blue",
        onClick: function onClick(event) {
          _this2.handleButtonAction(event, "accept");
        }
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "chat_invitation_accept",
        defaultMessage: "Accept"
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "white",
        onClick: function onClick(event) {
          _this2.handleButtonAction(event, "delete");
        }
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "chat_invitation_ignore",
        defaultMessage: "Ignore"
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "white",
        onClick: function onClick(event) {
          _this2.handleButtonAction(event, "block");
        }
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "chat_invitation_block",
        defaultMessage: "Block"
      }))));
    }
  }]);

  return Invitation;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.PureComponent);


;

/***/ }),

/***/ "./src/widgets/alert.jsx":
/*!*******************************!*\
  !*** ./src/widgets/alert.jsx ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Alert; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }




var Alert = function (_React$PureComponent) {
  _inherits(Alert, _React$PureComponent);

  function Alert() {
    _classCallCheck(this, Alert);

    return _possibleConstructorReturn(this, _getPrototypeOf(Alert).apply(this, arguments));
  }

  _createClass(Alert, [{
    key: "render",
    value: function render() {
      return this.props.visible ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "alert-container"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "alert"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "title"
      }, this.props.title), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "content"
      }, this.props.content), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "dialog-buttons"
      }, this.props.onReject ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "outline",
        onClick: this.props.onReject
      }, this.props.reject || react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "button_cancel"
      })) : null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "blue",
        onClick: this.props.onConfirm
      }, this.props.confirm || react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "button_ok"
      }))))) : null;
    }
  }]);

  return Alert;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.PureComponent);


;

/***/ }),

/***/ "./src/widgets/attachment.jsx":
/*!************************************!*\
  !*** ./src/widgets/attachment.jsx ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Attachment; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _file_progress_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./file-progress.jsx */ "./src/widgets/file-progress.jsx");
/* harmony import */ var _lib_strformat_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/strformat.js */ "./src/lib/strformat.js");
/* harmony import */ var _lib_utils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../lib/utils.js */ "./src/lib/utils.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }







var Attachment = function (_React$Component) {
  _inherits(Attachment, _React$Component);

  function Attachment(props) {
    var _this;

    _classCallCheck(this, Attachment);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Attachment).call(this, props));
    _this.state = {
      downloader: null,
      progress: 0
    };
    _this.downloadFile = _this.downloadFile.bind(_assertThisInitialized(_this));
    _this.handleCancel = _this.handleCancel.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(Attachment, [{
    key: "downloadFile",
    value: function downloadFile(url, filename, mimetype) {
      var _this2 = this;

      var downloader = this.props.tinode.getLargeFileHelper();
      this.setState({
        downloader: downloader
      });
      downloader.download(url, filename, mimetype, function (loaded) {
        _this2.setState({
          progress: loaded / _this2.props.size
        });
      }).then(function () {
        _this2.setState({
          downloader: null,
          progress: 0
        });
      }).catch(function (err) {
        if (err) {
          _this2.props.onError("Error downloading file: " + err.message, 'err');
        }

        _this2.setState({
          downloader: null,
          progress: 0
        });
      });
    }
  }, {
    key: "handleCancel",
    value: function handleCancel() {
      if (this.props.uploader) {
        this.props.onCancelUpload();
      } else if (this.state.downloader) {
        this.state.downloader.cancel();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var filename = this.props.filename || 'file_attachment';

      if (filename.length > 36) {
        filename = filename.substr(0, 16) + '...' + filename.substr(-16);
      }

      var size = this.props.size > 0 ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "small gray"
      }, "(", Object(_lib_strformat_js__WEBPACK_IMPORTED_MODULE_3__["bytesToHumanSize"])(this.props.size), ")") : null;
      var url, helperFunc;

      if (!this.props.uploader && !this.state.downloader && Object(_lib_utils_js__WEBPACK_IMPORTED_MODULE_4__["isUrlRelative"])(this.props.downloadUrl)) {
        url = '#';

        helperFunc = function helperFunc(e) {
          e.preventDefault();

          _this3.downloadFile(_this3.props.downloadUrl, _this3.props.filename, _this3.props.mimetype);
        };
      } else {
        url = Object(_lib_utils_js__WEBPACK_IMPORTED_MODULE_4__["sanitizeUrl"])(this.props.downloadUrl) || 'about:blank';
        helperFunc = null;
      }

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "attachment"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons big gray"
      }, "insert_drive_file")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "flex-column"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, filename, " ", size), this.props.uploader || this.state.downloader ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_file_progress_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
        progress: this.props.uploader ? this.props.progress : this.state.progress,
        onCancel: this.handleCancel
      }) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: url,
        download: this.props.filename,
        onClick: helperFunc
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons"
      }, "file_download"), " ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "save_attachment",
        defaultMessage: "save"
      })))));
    }
  }]);

  return Attachment;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);


;

/***/ }),

/***/ "./src/widgets/avatar-upload.jsx":
/*!***************************************!*\
  !*** ./src/widgets/avatar-upload.jsx ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return AvatarUpload; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _letter_tile_jsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./letter-tile.jsx */ "./src/widgets/letter-tile.jsx");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var _lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/blob-helpers.js */ "./src/lib/blob-helpers.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }






var AvatarUpload = function (_React$Component) {
  _inherits(AvatarUpload, _React$Component);

  function AvatarUpload(props) {
    var _this;

    _classCallCheck(this, AvatarUpload);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AvatarUpload).call(this, props));
    _this.state = {
      dataUrl: props.avatar
    };
    _this.handleFileUpload = _this.handleFileUpload.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(AvatarUpload, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (this.props.avatar != prevProps.avatar) {
        this.setState({
          dataUrl: this.props.avatar
        });
      }
    }
  }, {
    key: "handleFileUpload",
    value: function handleFileUpload(e) {
      var _this2 = this;

      Object(_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_3__["imageFileScaledToBase64"])(e.target.files[0], _config_js__WEBPACK_IMPORTED_MODULE_2__["AVATAR_SIZE"], _config_js__WEBPACK_IMPORTED_MODULE_2__["AVATAR_SIZE"], true, function (base64bits, mime) {
        var du = Object(_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_3__["makeImageUrl"])({
          data: base64bits,
          type: mime
        });

        _this2.setState({
          dataUrl: du
        });

        _this2.props.onImageChanged(du);
      }, function (err) {
        _this2.props.onError(err, 'err');
      });
      e.target.value = '';
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var randId = "file-input-avatar-" + (Math.random() + '').substr(2);
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "avatar-upload"
      }, this.props.readOnly || !this.state.dataUrl ? null : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "#",
        className: "clear-avatar",
        onClick: function onClick(e) {
          e.preventDefault();

          _this3.props.onImageChanged(null);
        }
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons"
      }, "clear")), this.state.dataUrl ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("img", {
        src: this.state.dataUrl,
        className: "preview"
      }) : this.props.readOnly && this.props.uid ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "avatar-box"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_letter_tile_jsx__WEBPACK_IMPORTED_MODULE_1__["default"], {
        avatar: true,
        topic: this.props.uid,
        title: this.props.title
      })) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "blank"
      }, _config_js__WEBPACK_IMPORTED_MODULE_2__["AVATAR_SIZE"], "\xD7", _config_js__WEBPACK_IMPORTED_MODULE_2__["AVATAR_SIZE"]), this.props.readOnly ? null : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        type: "file",
        id: randId,
        className: "inputfile hidden",
        accept: "image/*",
        onChange: this.handleFileUpload
      }), this.props.readOnly ? null : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        htmlFor: randId,
        className: "round"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons"
      }, "file_upload")));
    }
  }]);

  return AvatarUpload;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);


;

/***/ }),

/***/ "./src/widgets/chat-message.jsx":
/*!**************************************!*\
  !*** ./src/widgets/chat-message.jsx ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ChatMessage; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tinode-sdk */ "tinode-sdk");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _attachment_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./attachment.jsx */ "./src/widgets/attachment.jsx");
/* harmony import */ var _letter_tile_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./letter-tile.jsx */ "./src/widgets/letter-tile.jsx");
/* harmony import */ var _received_marker_jsx__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./received-marker.jsx */ "./src/widgets/received-marker.jsx");
/* harmony import */ var _lib_utils_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../lib/utils.js */ "./src/lib/utils.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var _lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../lib/blob-helpers.js */ "./src/lib/blob-helpers.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }









var ChatMessage = function (_React$Component) {
  _inherits(ChatMessage, _React$Component);

  function ChatMessage(props) {
    var _this;

    _classCallCheck(this, ChatMessage);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ChatMessage).call(this, props));
    _this.state = {
      progress: 0
    };

    if (props.uploader) {
      props.uploader.onProgress = _this.handleProgress.bind(_assertThisInitialized(_this));
    }

    _this.handlePreviewImage = _this.handlePreviewImage.bind(_assertThisInitialized(_this));
    _this.handleFormButtonClick = _this.handleFormButtonClick.bind(_assertThisInitialized(_this));
    _this.handleContextClick = _this.handleContextClick.bind(_assertThisInitialized(_this));
    _this.handleCancelUpload = _this.handleCancelUpload.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(ChatMessage, [{
    key: "handlePreviewImage",
    value: function handlePreviewImage(e) {
      e.preventDefault();
      this.props.onImagePreview({
        url: e.target.src,
        filename: e.target.title,
        width: e.target.dataset.width,
        height: e.target.dataset.height,
        size: e.target.dataset.size,
        type: e.target.dataset.mime
      });
    }
  }, {
    key: "handleFormButtonClick",
    value: function handleFormButtonClick(e) {
      e.preventDefault();
      var data = {
        seq: this.props.seq
      };
      data.resp = {};

      if (e.target.dataset.name) {
        data.resp[e.target.dataset.name] = e.target.dataset.val ? e.target.dataset.val : e.target.dataset.val === undefined ? 1 : '' + e.target.dataset.val;
      }

      if (e.target.dataset.act == 'url') {
        data.ref = Object(_lib_utils_js__WEBPACK_IMPORTED_MODULE_6__["sanitizeUrl"])(e.target.dataset.ref) || 'about:blank';
      }

      var text = e.target.dataset.title || 'unknown';
      this.props.onFormResponse(e.target.dataset.act, text, data);
    }
  }, {
    key: "handleContextClick",
    value: function handleContextClick(e) {
      e.preventDefault();
      e.stopPropagation();
      this.props.showContextMenu({
        seq: this.props.seq,
        y: e.pageY,
        x: e.pageX
      });
    }
  }, {
    key: "handleProgress",
    value: function handleProgress(ratio) {
      this.setState({
        progress: ratio
      });
    }
  }, {
    key: "handleCancelUpload",
    value: function handleCancelUpload() {
      this.props.uploader.cancel();
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var sideClass = this.props.sequence + ' ' + (this.props.response ? 'left' : 'right');
      var bubbleClass = this.props.sequence == 'single' || this.props.sequence == 'last' ? 'bubble tip' : 'bubble';
      var avatar = this.props.userAvatar || true;
      var fullDisplay = this.props.userFrom && this.props.response && (this.props.sequence == 'single' || this.props.sequence == 'last');
      var content = this.props.content;
      var attachments = [];

      if (this.props.mimeType == tinode_sdk__WEBPACK_IMPORTED_MODULE_2__["Drafty"].getContentType()) {
        tinode_sdk__WEBPACK_IMPORTED_MODULE_2__["Drafty"].attachments(content, function (att, i) {
          if (att.mime == 'application/json') {
            return;
          }

          attachments.push(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_attachment_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
            tinode: this.props.tinode,
            downloadUrl: tinode_sdk__WEBPACK_IMPORTED_MODULE_2__["Drafty"].getDownloadUrl(att),
            filename: att.name,
            uploader: tinode_sdk__WEBPACK_IMPORTED_MODULE_2__["Drafty"].isUploading(att),
            mimetype: att.mime,
            size: tinode_sdk__WEBPACK_IMPORTED_MODULE_2__["Drafty"].getEntitySize(att),
            progress: this.state.progress,
            onCancelUpload: this.handleCancelUpload,
            onError: this.props.onError,
            key: i
          }));
        }, this);
        content = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement('span', null, tinode_sdk__WEBPACK_IMPORTED_MODULE_2__["Drafty"].format(content, draftyFormatter, this));
      } else if (typeof content != 'string') {
        content = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
          className: "material-icons"
        }, "error_outline"), " ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
          id: "invalid_content",
          defaultMessage: "invalid content"
        })));
      }

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
        className: sideClass
      }, this.props.userFrom && this.props.response ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "avatar-box"
      }, fullDisplay ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_letter_tile_jsx__WEBPACK_IMPORTED_MODULE_4__["default"], {
        topic: this.props.userFrom,
        title: this.props.userName,
        avatar: avatar
      }) : null) : null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: bubbleClass
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "message-content"
      }, content, attachments, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_received_marker_jsx__WEBPACK_IMPORTED_MODULE_5__["default"], {
        timestamp: this.props.timestamp,
        received: this.props.received
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "menuTrigger"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "#",
        onClick: this.handleContextClick
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons"
      }, "expand_more")))), fullDisplay ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "author"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "user_not_found",
        defaultMessage: "Not found"
      }, function (notFound) {
        return _this2.props.userName || react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", null, notFound);
      })) : null));
    }
  }]);

  return ChatMessage;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);


;



function draftyFormatter(style, data, values, key) {
  var el = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__["Drafty"].tagName(style);

  if (el) {
    var attr = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__["Drafty"].attrValue(style, data) || {};
    attr.key = key;

    switch (style) {
      case 'IM':
        if (data) {
          attr.className = 'inline-image';
          var dim = Object(_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_8__["fitImageSize"])(data.width, data.height, Math.min(this.props.viewportWidth - _config_js__WEBPACK_IMPORTED_MODULE_7__["REM_SIZE"] * 4, _config_js__WEBPACK_IMPORTED_MODULE_7__["REM_SIZE"] * 36), _config_js__WEBPACK_IMPORTED_MODULE_7__["REM_SIZE"] * 24, false);
          dim = dim || {
            dstWidth: _config_js__WEBPACK_IMPORTED_MODULE_7__["BROKEN_IMAGE_SIZE"],
            dstHeight: _config_js__WEBPACK_IMPORTED_MODULE_7__["BROKEN_IMAGE_SIZE"]
          };
          attr.style = {
            width: dim.dstWidth + 'px',
            height: dim.dstHeight + 'px'
          };
          attr.src = Object(_lib_utils_js__WEBPACK_IMPORTED_MODULE_6__["sanitizeImageUrl"])(attr.src);

          if (attr.src) {
            attr.onClick = this.handlePreviewImage;
            attr.className += ' image-clickable';
          } else {
            attr.src = 'img/broken_image.png';
          }
        }

        break;

      case 'BN':
        attr.onClick = this.handleFormButtonClick;
        var inner = react__WEBPACK_IMPORTED_MODULE_0___default.a.Children.map(values, function (child) {
          return typeof child == 'string' ? child : undefined;
        });

        if (!inner || inner.length == 0) {
          inner = [attr.name];
        }

        attr['data-title'] = inner.join('');
        break;

      case 'FM':
        attr.className = 'bot-form';
        break;

      case 'FE':
        break;
    }

    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(el, attr, values);
  } else {
    return values;
  }
}

;

/***/ }),

/***/ "./src/widgets/checkbox.jsx":
/*!**********************************!*\
  !*** ./src/widgets/checkbox.jsx ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return CheckBox; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }



var CheckBox = function (_React$PureComponent) {
  _inherits(CheckBox, _React$PureComponent);

  function CheckBox(props) {
    var _this;

    _classCallCheck(this, CheckBox);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CheckBox).call(this, props));
    _this.handleChange = _this.handleChange.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(CheckBox, [{
    key: "handleChange",
    value: function handleChange() {
      this.props.onChange(this.props.name, !this.props.checked);
    }
  }, {
    key: "render",
    value: function render() {
      return this.props.onChange ? this.props.checked ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons blue clickable",
        onClick: this.handleChange
      }, "check_box") : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons blue clickable",
        onClick: this.handleChange
      }, "check_box_outline_blank") : this.props.checked ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons"
      }, "check_box") : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons"
      }, "check_box_outline_blank");
    }
  }]);

  return CheckBox;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.PureComponent);



/***/ }),

/***/ "./src/widgets/chip-input.jsx":
/*!************************************!*\
  !*** ./src/widgets/chip-input.jsx ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ChipInput; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _chip_jsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./chip.jsx */ "./src/widgets/chip.jsx");
/* harmony import */ var _lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/blob-helpers.js */ "./src/lib/blob-helpers.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }





var ChipInput = function (_React$Component) {
  _inherits(ChipInput, _React$Component);

  function ChipInput(props) {
    var _this;

    _classCallCheck(this, ChipInput);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ChipInput).call(this, props));
    _this.state = ChipInput.deriveStateFromProps(props);
    _this.state.input = '';
    _this.state.focused = false;
    _this.handleTextInput = _this.handleTextInput.bind(_assertThisInitialized(_this));
    _this.removeChipAt = _this.removeChipAt.bind(_assertThisInitialized(_this));
    _this.handleChipCancel = _this.handleChipCancel.bind(_assertThisInitialized(_this));
    _this.handleFocusGained = _this.handleFocusGained.bind(_assertThisInitialized(_this));
    _this.handleFocusLost = _this.handleFocusLost.bind(_assertThisInitialized(_this));
    _this.handleKeyDown = _this.handleKeyDown.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(ChipInput, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      if (prevProps.chips != this.props.chips || prevProps.staticMembers != this.props.staticMembers || prevProps.prompt != this.props.prompt) {
        this.setState(ChipInput.deriveStateFromProps(this.props));
      }

      if (!prevState || this.props.chips.length > prevState.sortedChips.length) {
        this.setState({
          input: ''
        });
      }
    }
  }, {
    key: "handleTextInput",
    value: function handleTextInput(e) {
      this.setState({
        input: e.target.value
      });

      if (this.props.filterFunc) {
        this.props.filterFunc(e.target.value);
      }
    }
  }, {
    key: "removeChipAt",
    value: function removeChipAt(idx) {
      var removed = this.state.sortedChips[idx];
      this.props.onChipRemoved(removed.user, this.state.chipIndex[removed.user]);
    }
  }, {
    key: "handleChipCancel",
    value: function handleChipCancel(item, idx) {
      this.removeChipAt(idx);
    }
  }, {
    key: "handleFocusGained",
    value: function handleFocusGained() {
      this.setState({
        focused: true
      });
    }
  }, {
    key: "handleFocusLost",
    value: function handleFocusLost() {
      this.setState({
        focused: false
      });

      if (this.props.onFocusLost) {
        this.props.onFocusLost(this.state.input);
      }
    }
  }, {
    key: "handleKeyDown",
    value: function handleKeyDown(e) {
      if (e.key === 'Backspace') {
        if (this.state.input.length == 0 && this.state.sortedChips.length > 0) {
          var at = this.state.sortedChips.length - 1;

          if (this.state.sortedChips[at].user !== this.props.staticMembers) {
            this.removeChipAt(at);
          }
        }
      } else if (e.key === 'Enter') {
        if (this.props.onEnter) {
          this.props.onEnter(this.state.input);
        }
      } else if (e.key === 'Escape') {
        if (this.props.onCancel) {
          this.props.onCancel();
        }
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var chips = [];
      var count = 0;
      var staticMembers = this.props.staticMembers || [];
      this.state.sortedChips.map(function (item) {
        chips.push(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_chip_jsx__WEBPACK_IMPORTED_MODULE_1__["default"], {
          onCancel: _this2.handleChipCancel,
          avatar: Object(_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_2__["makeImageUrl"])(item.public ? item.public.photo : null),
          title: item.public ? item.public.fn : undefined,
          noAvatar: _this2.props.avatarDisabled,
          topic: item.user,
          required: staticMembers.includes(item.user),
          invalid: item.invalid,
          index: count,
          key: item.user
        }));
        count++;
      });
      var className = "chip-input" + (this.state.focused ? ' focused' : '');
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: className
      }, chips, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        type: "text",
        placeholder: this.state.placeholder,
        onChange: this.handleTextInput,
        onFocus: this.handleFocusGained,
        onBlur: this.handleFocusLost,
        onKeyDown: this.handleKeyDown,
        value: this.state.input,
        autoFocus: true
      }));
    }
  }], [{
    key: "deriveStateFromProps",
    value: function deriveStateFromProps(props) {
      return {
        placeholder: props.chips ? '' : props.prompt,
        sortedChips: ChipInput.sortChips(props.chips, props.staticMembers),
        chipIndex: ChipInput.indexChips(props.chips)
      };
    }
  }, {
    key: "indexChips",
    value: function indexChips(chips) {
      var index = {};
      var count = 0;
      chips.map(function (item) {
        index[item.user] = count;
        count++;
      });
      return index;
    }
  }, {
    key: "sortChips",
    value: function sortChips(chips, keep) {
      var required = [];
      var normal = [];
      chips.map(function (item) {
        if (keep && keep.includes(item.user)) {
          required.push(item);
        } else {
          normal.push(item);
        }
      });
      return required.concat(normal);
    }
  }]);

  return ChipInput;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);


;

/***/ }),

/***/ "./src/widgets/chip.jsx":
/*!******************************!*\
  !*** ./src/widgets/chip.jsx ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Chip; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _letter_tile_jsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./letter-tile.jsx */ "./src/widgets/letter-tile.jsx");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }




var Chip = function (_React$PureComponent) {
  _inherits(Chip, _React$PureComponent);

  function Chip(props) {
    var _this;

    _classCallCheck(this, Chip);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Chip).call(this, props));
    _this.handleCancel = _this.handleCancel.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(Chip, [{
    key: "handleCancel",
    value: function handleCancel(e) {
      e.preventDefault();
      this.props.onCancel(this.props.topic, this.props.index);
    }
  }, {
    key: "render",
    value: function render() {
      var title = this.props.title || this.props.topic;
      var className = this.props.invalid ? 'chip invalid' : 'chip';
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: className
      }, this.props.noAvatar ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "spacer"
      }) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "avatar-box"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_letter_tile_jsx__WEBPACK_IMPORTED_MODULE_1__["default"], {
        avatar: this.props.avatar || true,
        topic: this.props.topic,
        title: this.props.title
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", null, title), this.props.onCancel && !this.props.required ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "#",
        onClick: this.handleCancel
      }, "\xD7") : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "spacer"
      }));
    }
  }]);

  return Chip;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.PureComponent);


;

/***/ }),

/***/ "./src/widgets/contact-action.jsx":
/*!****************************************!*\
  !*** ./src/widgets/contact-action.jsx ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }




var ContactAction = function (_React$PureComponent) {
  _inherits(ContactAction, _React$PureComponent);

  function ContactAction(props) {
    var _this;

    _classCallCheck(this, ContactAction);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ContactAction).call(this, props));
    _this.handleClick = _this.handleClick.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(ContactAction, [{
    key: "handleClick",
    value: function handleClick(e) {
      e.preventDefault();
      e.stopPropagation();
      this.props.onAction(this.props.action);
    }
  }, {
    key: "render",
    value: function render() {
      var formatMessage = this.props.intl.formatMessage;
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
        onClick: this.handleClick,
        className: "action"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "action-text"
      }, formatMessage(this.props.title, this.props.values)));
    }
  }]);

  return ContactAction;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.PureComponent);

;
/* harmony default export */ __webpack_exports__["default"] = (Object(react_intl__WEBPACK_IMPORTED_MODULE_1__["injectIntl"])(ContactAction));

/***/ }),

/***/ "./src/widgets/contact-badges.jsx":
/*!****************************************!*\
  !*** ./src/widgets/contact-badges.jsx ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ContactBadges; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }


var icon_mapping = {
  'muted': 'notifications_off',
  'banned': 'block'
};

var ContactBadges = function (_React$PureComponent) {
  _inherits(ContactBadges, _React$PureComponent);

  function ContactBadges() {
    _classCallCheck(this, ContactBadges);

    return _possibleConstructorReturn(this, _getPrototypeOf(ContactBadges).apply(this, arguments));
  }

  _createClass(ContactBadges, [{
    key: "render",
    value: function render() {
      var badges = null;

      if (this.props.badges && this.props.badges.length > 0) {
        badges = [];
        this.props.badges.map(function (b) {
          if (b.icon) {
            badges.push(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
              className: "material-icons as-badge",
              key: b.key || b.icon
            }, icon_mapping[b.icon]));
          } else {
            var style = 'badge' + (b.color ? ' ' + b.color : '');
            badges.push(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
              className: style,
              key: b.key || b.name
            }, b.name));
          }
        });
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, badges);
      }

      return null;
    }
  }]);

  return ContactBadges;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.PureComponent);


;

/***/ }),

/***/ "./src/widgets/contact-list.jsx":
/*!**************************************!*\
  !*** ./src/widgets/contact-list.jsx ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _contact_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./contact.jsx */ "./src/widgets/contact.jsx");
/* harmony import */ var _contact_action_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./contact-action.jsx */ "./src/widgets/contact-action.jsx");
/* harmony import */ var _lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../lib/blob-helpers.js */ "./src/lib/blob-helpers.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }






var messages = Object(react_intl__WEBPACK_IMPORTED_MODULE_1__["defineMessages"])({
  badge_you: {
    "id": "badge_you",
    "defaultMessage": "you"
  },
  badge_owner: {
    "id": "badge_owner",
    "defaultMessage": "owner"
  }
});

var ContactList = function (_React$Component) {
  _inherits(ContactList, _React$Component);

  function ContactList() {
    _classCallCheck(this, ContactList);

    return _possibleConstructorReturn(this, _getPrototypeOf(ContactList).apply(this, arguments));
  }

  _createClass(ContactList, [{
    key: "render",
    value: function render() {
      var _this = this;

      var formatMessage = this.props.intl.formatMessage;
      var showCheckmark = Array.isArray(this.props.topicSelected);
      var contactNodes = [];
      var contactsCount = 0;

      if (this.props.contacts && this.props.contacts.length > 0) {
        this.props.contacts.map(function (c) {
          if (c.action) {
            contactNodes.push(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_contact_action_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
              title: c.title,
              action: c.action,
              values: c.values,
              key: c.action,
              onAction: _this.props.onAction
            }));
          } else {
            var key = c.topic ? c.topic : c.user;

            if (_this.props.filterFunc && _this.props.filter) {
              var content = [key];

              if (c.private && c.private.comment) {
                content.push(('' + c.private.comment).toLowerCase());
              }

              if (c.public && c.public.fn) {
                content.push(('' + c.public.fn).toLowerCase());
              }

              if (!_this.props.filterFunc(_this.props.filter, content)) {
                return;
              }
            }

            var selected = showCheckmark ? _this.props.topicSelected.indexOf(key) > -1 : _this.props.topicSelected === key;
            var badges = [];

            if (_this.props.showMode) {
              if (key === _this.props.myUserId) {
                badges.push({
                  name: formatMessage(messages.badge_you),
                  color: 'green'
                });
              }

              if (c.acs && c.acs.isOwner()) {
                badges.push({
                  name: formatMessage(messages.badge_owner),
                  color: 'blue'
                });
              }
            }

            var comment = Array.isArray(c.private) ? c.private.join(',') : c.private ? c.private.comment : null;
            contactNodes.push(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_contact_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
              title: c.public ? c.public.fn : null,
              avatar: Object(_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_4__["makeImageUrl"])(c.public ? c.public.photo : null),
              comment: comment,
              unread: _this.props.showUnread ? c.unread : 0,
              now: c.online && _this.props.connected,
              acs: c.acs,
              showMode: _this.props.showMode,
              badges: badges,
              showCheckmark: showCheckmark,
              selected: selected,
              showOnline: _this.props.showOnline,
              onSelected: _this.props.onTopicSelected,
              showContextMenu: _this.props.showContextMenu,
              item: key,
              index: contactNodes.length,
              key: key
            }));
            contactsCount++;
          }
        }, this);
      }

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: this.props.noScroll ? null : "scrollable-panel"
      }, contactsCount == 0 ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "center-medium-text",
        dangerouslySetInnerHTML: {
          __html: this.props.emptyListMessage
        }
      }) : null, contactNodes.length > 0 ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("ul", {
        className: "contact-box"
      }, contactNodes) : null);
    }
  }]);

  return ContactList;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);

;
/* harmony default export */ __webpack_exports__["default"] = (Object(react_intl__WEBPACK_IMPORTED_MODULE_1__["injectIntl"])(ContactList));

/***/ }),

/***/ "./src/widgets/contact.jsx":
/*!*********************************!*\
  !*** ./src/widgets/contact.jsx ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Contact; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _letter_tile_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./letter-tile.jsx */ "./src/widgets/letter-tile.jsx");
/* harmony import */ var _contact_badges_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./contact-badges.jsx */ "./src/widgets/contact-badges.jsx");
/* harmony import */ var _unread_badge_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./unread-badge.jsx */ "./src/widgets/unread-badge.jsx");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }







var Contact = function (_React$Component) {
  _inherits(Contact, _React$Component);

  function Contact(props) {
    var _this;

    _classCallCheck(this, Contact);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Contact).call(this, props));
    _this.handleClick = _this.handleClick.bind(_assertThisInitialized(_this));
    _this.handleContextClick = _this.handleContextClick.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(Contact, [{
    key: "handleClick",
    value: function handleClick(e) {
      e.preventDefault();
      e.stopPropagation();

      if (this.props.onSelected) {
        this.props.onSelected(this.props.item, this.props.index, this.props.now, this.props.acs);
      }
    }
  }, {
    key: "handleContextClick",
    value: function handleContextClick(e) {
      e.preventDefault();
      e.stopPropagation();
      this.props.showContextMenu({
        topicName: this.props.item,
        y: e.pageY,
        x: e.pageX
      });
    }
  }, {
    key: "render",
    value: function render() {
      var title = this.props.title;

      if (!title) {
        title = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
          id: "unnamed_topic"
        }));
      } else if (title.length > 30) {
        title = title.substring(0, 28) + '...';
      }

      var online = this.props.now ? 'online' : 'offline';
      var avatar = this.props.avatar ? this.props.avatar : true;
      var badges = this.props.badges ? this.props.badges.slice() : [];
      var icon_badges = [];

      if (this.props.acs) {
        if (this.props.showMode) {
          badges.push({
            name: this.props.acs.getMode(),
            key: 'mode'
          });
        }

        if (this.props.acs.isMuted()) {
          icon_badges.push({
            icon: 'muted'
          });
        }

        if (!this.props.acs.isJoiner()) {
          icon_badges.push({
            icon: 'banned'
          });
        }
      }

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
        className: !this.props.showCheckmark && this.props.selected ? "selected" : null,
        onClick: this.handleClick
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "avatar-box"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_letter_tile_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
        avatar: avatar,
        title: this.props.title,
        topic: this.props.item
      }), this.props.showOnline ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: online
      }) : this.props.showCheckmark && this.props.selected ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "checkmark material-icons"
      }, "check_circle") : null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "text-box"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "contact-title"
      }, title), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_unread_badge_jsx__WEBPACK_IMPORTED_MODULE_4__["default"], {
        count: this.props.unread
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_contact_badges_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
        badges: icon_badges
      })), this.props.comment ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "contact-comment"
      }, this.props.comment) : null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_contact_badges_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
        badges: badges
      }))), this.props.showContextMenu ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "menuTrigger"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "#",
        onClick: this.handleContextClick
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons"
      }, "expand_more"))) : null);
    }
  }]);

  return Contact;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);


;

/***/ }),

/***/ "./src/widgets/context-menu.jsx":
/*!**************************************!*\
  !*** ./src/widgets/context-menu.jsx ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "react-dom");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var _lib_navigation_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../lib/navigation.js */ "./src/lib/navigation.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }






var messages = Object(react_intl__WEBPACK_IMPORTED_MODULE_2__["defineMessages"])({
  info: {
    "id": "menu_item_info",
    "defaultMessage": "Info"
  },
  clear_messages: {
    "id": "menu_item_clear_messages",
    "defaultMessage": "Clear messages"
  },
  clear_for_all: {
    "id": "menu_item_clear_messages_for_all",
    "defaultMessage": "Clear for All"
  },
  'delete': {
    "id": "menu_item_delete",
    "defaultMessage": "Delete"
  },
  delete_for_all: {
    "id": "menu_item_delete_for_all",
    "defaultMessage": "Delete for All"
  },
  mute: {
    "id": "menu_item_mute",
    "defaultMessage": "Mute"
  },
  unmute: {
    "id": "menu_item_unmute",
    "defaultMessage": "Unmute"
  },
  topic_delete: {
    "id": "menu_item_delete_topic",
    "defaultMessage": "Delete"
  },
  topic_delete_warning: {
    "id": "topic_delete_warning",
    "defaultMessage": "Are you sure you want to delete this conversation?"
  },
  unblock: {
    "id": "menu_item_unblock",
    "defaultMessage": "Unblock"
  },
  block: {
    "id": "menu_item_block",
    "defaultMessage": "Block"
  },
  topic_block_warning: {
    "id": "topic_block_warning",
    "defaultMessage": "Are you sure you want to block this conversation?"
  },
  member_delete: {
    "id": "menu_item_member_delete",
    "defaultMessage": "Remove"
  },
  archive: {
    "id": "menu_item_archive_topic",
    "defaultMessage": "Archive"
  }
});

var ContextMenu = function (_React$Component) {
  _inherits(ContextMenu, _React$Component);

  function ContextMenu(props) {
    var _this;

    _classCallCheck(this, ContextMenu);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ContextMenu).call(this, props));
    var formatMessage = props.intl.formatMessage;
    _this.handlePageClick = _this.handlePageClick.bind(_assertThisInitialized(_this));
    _this.handleEscapeKey = _this.handleEscapeKey.bind(_assertThisInitialized(_this));
    _this.handleClick = _this.handleClick.bind(_assertThisInitialized(_this));
    _this.MenuItems = {
      'topic_info': {
        id: 'topic_info',
        title: formatMessage(messages.info),
        handler: null
      },
      'messages_clear': {
        id: 'messages_clear',
        title: formatMessage(messages.clear_messages),
        handler: function handler(params, errorHandler) {
          return props.onShowAlert(formatMessage({
            id: 'menu_item_clear_messages'
          }), formatMessage({
            id: 'clear_messages_warning'
          }), function () {
            _this.deleteMessages(true, false, params, errorHandler);
          }, null, true, null);
        }
      },
      'messages_clear_hard': {
        id: 'messages_clear_hard',
        title: formatMessage(messages.clear_for_all),
        handler: function handler(params, errorHandler) {
          return props.onShowAlert(formatMessage({
            id: 'menu_item_clear_messages_for_all'
          }), formatMessage({
            id: 'delete_messages_warning'
          }), function () {
            return _this.deleteMessages(true, true, params, errorHandler);
          }, null, true, null);
        }
      },
      'message_delete': {
        id: 'message_delete',
        title: formatMessage(messages.delete),
        handler: function handler(params, errorHandler) {
          return _this.deleteMessages(false, false, params, errorHandler);
        }
      },
      'message_delete_hard': {
        id: 'message_delete_hard',
        title: formatMessage(messages.delete_for_all),
        handler: function handler(params, errorHandler) {
          return _this.deleteMessages(false, true, params, errorHandler);
        }
      },
      'topic_unmute': {
        id: 'topic_unmute',
        title: formatMessage(messages.unmute),
        handler: _this.topicPermissionSetter.bind(_assertThisInitialized(_this), '+P')
      },
      'topic_mute': {
        id: 'topic_mute',
        title: formatMessage(messages.mute),
        handler: _this.topicPermissionSetter.bind(_assertThisInitialized(_this), '-P')
      },
      'topic_unblock': {
        id: 'topic_unblock',
        title: formatMessage(messages.unblock),
        handler: _this.topicPermissionSetter.bind(_assertThisInitialized(_this), '+JP')
      },
      'topic_block': {
        id: 'topic_block',
        title: formatMessage(messages.block),
        handler: function handler(params, errorHandler) {
          return props.onShowAlert(formatMessage({
            id: 'menu_item_block'
          }), formatMessage(messages.topic_block_warning), function () {
            return _this.topicPermissionSetter('-JP', params, errorHandler).then(function (ctrl) {
              _this.props.onTopicRemoved(params.topicName);

              return ctrl;
            });
          }, null, true, null);
        }
      },
      'topic_delete': {
        id: 'topic_delete',
        title: formatMessage(messages.topic_delete),
        handler: function handler(params, errorHandler) {
          return props.onShowAlert(formatMessage({
            id: 'menu_item_delete_topic'
          }), formatMessage(messages.topic_delete_warning), function () {
            var topic = _this.props.tinode.getTopic(params.topicName);

            if (!topic) {
              console.log("Topic not found: ", params.topicName);
              return;
            }

            return topic.delTopic().catch(function (err) {
              if (errorHandler) {
                errorHandler(err.message, 'err');
              }
            });
          }, null, true, null);
        }
      },
      'topic_archive': {
        id: 'topic_archive',
        title: formatMessage(messages.archive),
        handler: function handler(params, errorHandler) {
          var topic = _this.props.tinode.getTopic(params.topicName);

          if (!topic) {
            console.log("Topic not found: ", params.topicName);
            return;
          }

          return topic.archive(true).catch(function (err) {
            if (errorHandler) {
              errorHandler(err.message, 'err');
            }
          });
        }
      },
      'permissions': {
        id: 'permissions',
        title: formatMessage({
          id: 'menu_item_edit_permissions'
        }),
        handler: null
      },
      'member_delete': {
        id: 'member_delete',
        title: formatMessage(messages.member_delete),
        handler: function handler(params, errorHandler) {
          var topic = _this.props.tinode.getTopic(params.topicName);

          if (!topic || !params.user) {
            console.log("Topic or user not found: '" + params.topicName + "', '" + params.user + "'");
            return;
          }

          return topic.delSubscription(params.user).catch(function (err) {
            if (errorHandler) {
              errorHandler(err.message, 'err');
            }
          });
        }
      },
      'member_mute': {
        id: 'member_mute',
        title: formatMessage(messages.mute),
        handler: _this.topicPermissionSetter.bind(_assertThisInitialized(_this), '-P')
      },
      'member_unmute': {
        id: 'member_unmute',
        title: formatMessage(messages.unmute),
        handler: _this.topicPermissionSetter.bind(_assertThisInitialized(_this), '+P')
      },
      'member_block': {
        id: 'member_block',
        title: formatMessage(messages.block),
        handler: _this.topicPermissionSetter.bind(_assertThisInitialized(_this), '-J')
      },
      'member_unblock': {
        id: 'member_unblock',
        title: formatMessage(messages.unblock),
        handler: _this.topicPermissionSetter.bind(_assertThisInitialized(_this), '+J')
      }
    };
    return _this;
  }

  _createClass(ContextMenu, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      document.addEventListener('mousedown', this.handlePageClick, false);
      document.addEventListener('keyup', this.handleEscapeKey, false);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      document.removeEventListener('mousedown', this.handlePageClick, false);
      document.removeEventListener('keyup', this.handleEscapeKey, false);
    }
  }, {
    key: "handlePageClick",
    value: function handlePageClick(e) {
      if (react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.findDOMNode(this).contains(e.target)) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();
      this.props.hide();
    }
  }, {
    key: "handleEscapeKey",
    value: function handleEscapeKey(e) {
      if (e.keyCode === 27) {
        this.props.hide();
      }
    }
  }, {
    key: "handleClick",
    value: function handleClick(e) {
      e.preventDefault();
      e.stopPropagation();
      this.props.hide();
      var item = this.props.items[e.currentTarget.dataset.id];

      if (typeof item == 'string') {
        item = this.MenuItems[item];
      }

      if (!item) {
        console.log("Invalid menu item ID", e.currentTarget.dataset.id);
      } else {
        this.props.onAction(item.id, item.handler(this.props.params, this.props.onError), this.props.params);
      }
    }
  }, {
    key: "deleteMessages",
    value: function deleteMessages(all, hard, params, errorHandler) {
      var topic = this.props.tinode.getTopic(params.topicName);

      if (!topic) {
        console.log("Topic not found: ", params.topicName);
        return;
      }

      if (!all && topic.cancelSend(params.seq)) {
        return;
      }

      var promise = all ? topic.delMessagesAll(hard) : topic.delMessagesList([params.seq], hard);
      return promise.catch(function (err) {
        if (errorHandler) {
          errorHandler(err.message, 'err');
        }
      });
    }
  }, {
    key: "topicPermissionSetter",
    value: function topicPermissionSetter(mode, params, errorHandler) {
      var topic = this.props.tinode.getTopic(params.topicName);

      if (!topic) {
        console.log("Topic not found", params.topicName);
        return;
      }

      var result = topic.updateMode(params.user, mode);

      if (errorHandler) {
        result = result.catch(function (err) {
          errorHandler(err.message, 'err');
        });
      }

      return result;
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var count = 0;
      var menu = [];
      this.props.items.map(function (item) {
        if (typeof item == 'string') {
          item = _this2.MenuItems[item];
        }

        if (item && item.title) {
          menu.push(item.title == '-' ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
            className: "separator",
            key: count
          }) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
            onClick: _this2.handleClick,
            "data-id": count,
            key: count
          }, item.title));
        }

        count++;
      });
      var hSize = 12 * _config_js__WEBPACK_IMPORTED_MODULE_3__["REM_SIZE"];
      var vSize = _config_js__WEBPACK_IMPORTED_MODULE_3__["REM_SIZE"] * (0.7 + menu.length * 2.5);
      var left = this.props.bounds.right - this.props.clickAt.x < hSize ? this.props.clickAt.x - this.props.bounds.left - hSize : this.props.clickAt.x - this.props.bounds.left;
      var top = this.props.bounds.bottom - this.props.clickAt.y < vSize ? this.props.clickAt.y - this.props.bounds.top - vSize : this.props.clickAt.y - this.props.bounds.top;
      var position = {
        left: left + 'px',
        top: top + 'px'
      };
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("ul", {
        className: "menu",
        style: position
      }, menu);
    }
  }]);

  return ContextMenu;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);

/* harmony default export */ __webpack_exports__["default"] = (Object(react_intl__WEBPACK_IMPORTED_MODULE_2__["injectIntl"])(ContextMenu));

/***/ }),

/***/ "./src/widgets/error-panel.jsx":
/*!*************************************!*\
  !*** ./src/widgets/error-panel.jsx ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ErrorPanel; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _menu_cancel_jsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./menu-cancel.jsx */ "./src/widgets/menu-cancel.jsx");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }




var ErrorPanel = function (_React$PureComponent) {
  _inherits(ErrorPanel, _React$PureComponent);

  function ErrorPanel(props) {
    var _this;

    _classCallCheck(this, ErrorPanel);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ErrorPanel).call(this, props));
    _this.state = {
      show: false
    };
    _this.hide = _this.hide.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(ErrorPanel, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (prevProps.level !== this.props.level) {
        this.setState({
          show: !!this.props.level
        });
      }
    }
  }, {
    key: "hide",
    value: function hide() {
      this.setState({
        show: false
      });

      if (this.props.onClearError) {
        this.props.onClearError();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var icons = {
        err: 'error',
        warn: 'warning',
        info: 'info'
      };
      var level = icons[this.props.level] || '';
      var className = 'info-box ' + level;
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: className
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "icon"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons"
      }, level)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        dangerouslySetInnerHTML: {
          __html: this.props.text
        }
      }), this.props.action ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "#",
        style: {
          whiteSpace: 'nowrap'
        },
        onClick: function onClick(e) {
          e.preventDefault();

          _this2.props.action();
        }
      }, this.props.actionText)) : null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "cancel"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_menu_cancel_jsx__WEBPACK_IMPORTED_MODULE_1__["default"], {
        onCancel: this.hide
      })));
    }
  }]);

  return ErrorPanel;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.PureComponent);


;

/***/ }),

/***/ "./src/widgets/file-progress.jsx":
/*!***************************************!*\
  !*** ./src/widgets/file-progress.jsx ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return FileProgress; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }




var FileProgress = function (_React$PureComponent) {
  _inherits(FileProgress, _React$PureComponent);

  function FileProgress() {
    _classCallCheck(this, FileProgress);

    return _possibleConstructorReturn(this, _getPrototypeOf(FileProgress).apply(this, arguments));
  }

  _createClass(FileProgress, [{
    key: "render",
    value: function render() {
      var _this = this;

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "uploader"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        style: {
          width: this.props.progress * 100 + "%"
        }
      })), this.props.progress < 0.999 ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "#",
        onClick: function onClick(e) {
          e.preventDefault();

          _this.props.onCancel();
        }
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons"
      }, "close"), " ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "action_cancel",
        defaultMessage: "cancel"
      })) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "upload_finishing",
        defaultMessage: "finishing..."
      }));
    }
  }]);

  return FileProgress;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.PureComponent);



/***/ }),

/***/ "./src/widgets/group-manager.jsx":
/*!***************************************!*\
  !*** ./src/widgets/group-manager.jsx ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _chip_input_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./chip-input.jsx */ "./src/widgets/chip-input.jsx");
/* harmony import */ var _contact_list_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./contact-list.jsx */ "./src/widgets/contact-list.jsx");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }





var messages = Object(react_intl__WEBPACK_IMPORTED_MODULE_1__["defineMessages"])({
  no_contacts: {
    "id": "no_contacts",
    "defaultMessage": "You have no contacts :-("
  },
  contacts_not_found: {
    "id": "contacts_not_found_short",
    "defaultMessage": "No contacts match '{query}'"
  }
});

var GroupManager = function (_React$Component) {
  _inherits(GroupManager, _React$Component);

  function GroupManager(props) {
    var _this;

    _classCallCheck(this, GroupManager);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(GroupManager).call(this, props));
    _this.state = {
      members: props.members,
      index: GroupManager.indexMembers(props.members),
      staticMembers: GroupManager.staticMembers(props.members, props.keepInitialMembers, props.requiredMember),
      contactFilter: '',
      noContactsMessage: props.intl.formatMessage(messages.no_contacts),
      selectedContacts: GroupManager.selectedContacts(props.members)
    };
    _this.handleContactSelected = _this.handleContactSelected.bind(_assertThisInitialized(_this));
    _this.handleMemberRemoved = _this.handleMemberRemoved.bind(_assertThisInitialized(_this));
    _this.handleContactFilter = _this.handleContactFilter.bind(_assertThisInitialized(_this));
    _this.handleSubmit = _this.handleSubmit.bind(_assertThisInitialized(_this));
    _this.handleCancel = _this.handleCancel.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(GroupManager, [{
    key: "handleContactSelected",
    value: function handleContactSelected(userId, index) {
      var status = this.state.index[userId];

      if (status) {
        if (status.present) {
          return;
        }

        status.delta += 1;
        status.present = true;
      } else {
        status = {
          delta: 1,
          present: true
        };
      }

      var m = this.state.members.slice();
      m.push(this.props.contacts[index]);
      var sel = GroupManager.selectedContacts(m);
      var i = this.state.index;
      i[userId] = status;
      this.setState({
        members: m,
        index: i,
        selectedContacts: sel
      });
    }
  }, {
    key: "handleMemberRemoved",
    value: function handleMemberRemoved(userId, index) {
      var status = this.state.index[userId];

      if (!status || !status.present) {
        return;
      }

      status.present = false;
      status.delta -= 1;
      var m = this.state.members.slice();
      m.splice(index, 1);
      var sel = GroupManager.selectedContacts(m);
      var i = this.state.index;
      i[userId] = status;
      this.setState({
        members: m,
        index: i,
        selectedContacts: sel
      });
    }
  }, {
    key: "handleContactFilter",
    value: function handleContactFilter(val) {
      var formatMessage = this.props.intl.formatMessage;
      var msg = !val ? formatMessage(messages.no_contacts) : formatMessage(messages.contacts_not_found, {
        query: val
      });
      this.setState({
        contactFilter: val,
        noContactsMessage: msg
      });
    }
  }, {
    key: "handleSubmit",
    value: function handleSubmit() {
      var instance = this;
      var members = [];
      var added = [];
      var removed = [];
      var keys = Object.keys(this.state.index);
      keys.map(function (k) {
        if (instance.state.index[k].present) {
          members.push(k);
        }

        if (instance.state.index[k].delta > 0) {
          added.push(k);
        } else if (instance.state.index[k].delta < 0) {
          removed.push(k);
        }
      });
      this.props.onSubmit(members, added, removed);
    }
  }, {
    key: "handleCancel",
    value: function handleCancel() {
      this.props.onCancel();
    }
  }, {
    key: "render",
    value: function render() {
      var formatMessage = this.props.intl.formatMessage;
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        id: "group-manager"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "small"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "title_group_members",
        defaultMessage: "Group Members"
      }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_chip_input_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
        chips: this.state.members,
        staticMembers: this.state.staticMembers,
        prompt: "add members",
        filterFunc: this.handleContactFilter,
        onChipRemoved: this.handleMemberRemoved
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "small"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "title_all_contacts",
        defaultMessage: "All Contacts"
      }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_contact_list_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
        contacts: this.props.contacts,
        myUserId: this.props.myUserId,
        topicSelected: this.state.selectedContacts,
        filter: this.state.contactFilter,
        filterFunc: GroupManager.doContactFiltering,
        emptyListMessage: this.state.noContactsMessage,
        showOnline: false,
        showUnread: false,
        onTopicSelected: this.handleContactSelected
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        id: "group-manager-buttons",
        className: "panel-form-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "blue",
        onClick: this.handleSubmit
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "button_ok",
        defaultMessage: "OK"
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "white",
        onClick: this.handleCancel
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "button_cancel",
        defaultMessage: "Cancel"
      }))));
    }
  }], [{
    key: "indexMembers",
    value: function indexMembers(members) {
      var index = {};
      members.map(function (m) {
        index[m.user] = {
          delta: 0,
          present: true
        };
      });
      return index;
    }
  }, {
    key: "staticMembers",
    value: function staticMembers(members, keepInitial, requiredMember) {
      var stat = [];
      members.map(function (m) {
        if (keepInitial || m.user == requiredMember) {
          stat.push(m.user);
        }
      });
      return stat;
    }
  }, {
    key: "selectedContacts",
    value: function selectedContacts(members) {
      var sel = [];
      members.map(function (m) {
        sel.push(m.user);
      });
      return sel;
    }
  }, {
    key: "doContactFiltering",
    value: function doContactFiltering(filter, values) {
      if (filter) {
        for (var i = 0; i < values.length; i++) {
          if (values[i].indexOf(filter) >= 0) {
            return true;
          }
        }

        return false;
      }

      return true;
    }
  }]);

  return GroupManager;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);

;
/* harmony default export */ __webpack_exports__["default"] = (Object(react_intl__WEBPACK_IMPORTED_MODULE_1__["injectIntl"])(GroupManager));

/***/ }),

/***/ "./src/widgets/group-subs.jsx":
/*!************************************!*\
  !*** ./src/widgets/group-subs.jsx ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return GroupSubs; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var _letter_tile_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./letter-tile.jsx */ "./src/widgets/letter-tile.jsx");
/* harmony import */ var _lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../lib/blob-helpers.js */ "./src/lib/blob-helpers.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }







var GroupSubs = function (_React$Component) {
  _inherits(GroupSubs, _React$Component);

  function GroupSubs(props) {
    _classCallCheck(this, GroupSubs);

    return _possibleConstructorReturn(this, _getPrototypeOf(GroupSubs).call(this, props));
  }

  _createClass(GroupSubs, [{
    key: "render",
    value: function render() {
      var usersOnline = [];
      var totalCount = (this.props.subscribers || []).length;
      var countToShow = Math.min(_config_js__WEBPACK_IMPORTED_MODULE_2__["MAX_ONLINE_IN_TOPIC"], totalCount);
      (this.props.subscribers || []).some(function (sub) {
        usersOnline.push(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          className: "avatar-box",
          key: sub.user
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_letter_tile_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
          topic: sub.user,
          avatar: Object(_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_4__["makeImageUrl"])(sub.public ? sub.public.photo : null) || true,
          title: sub.public ? sub.public.fn : null
        })));
        return usersOnline.length == countToShow;
      });
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        id: "topic-users"
      }, usersOnline, " ", totalCount > countToShow ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "more_online_members",
        defaultMessage: "+{overflow} more",
        values: {
          overflow: totalCount - countToShow
        }
      })) : null);
    }
  }]);

  return GroupSubs;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);


;

/***/ }),

/***/ "./src/widgets/host-selector.jsx":
/*!***************************************!*\
  !*** ./src/widgets/host-selector.jsx ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return HostSelector; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }




var HostSelector = function (_React$PureComponent) {
  _inherits(HostSelector, _React$PureComponent);

  function HostSelector(props) {
    var _this;

    _classCallCheck(this, HostSelector);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(HostSelector).call(this, props));
    _this.state = {
      hostName: props.serverAddress,
      changed: false
    };
    _this.handleHostNameChange = _this.handleHostNameChange.bind(_assertThisInitialized(_this));
    _this.handleEditingFinished = _this.handleEditingFinished.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(HostSelector, [{
    key: "handleHostNameChange",
    value: function handleHostNameChange(e) {
      this.setState({
        hostName: e.target.value,
        changed: true
      });
    }
  }, {
    key: "handleEditingFinished",
    value: function handleEditingFinished() {
      if (this.state.changed) {
        this.setState({
          changed: false
        });
        this.props.onServerAddressChange(this.state.hostName.trim());
      }
    }
  }, {
    key: "render",
    value: function render() {
      var hostOptions = [];

      for (var key in _config_js__WEBPACK_IMPORTED_MODULE_1__["KNOWN_HOSTS"]) {
        var item = _config_js__WEBPACK_IMPORTED_MODULE_1__["KNOWN_HOSTS"][key];
        hostOptions.push(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("option", {
          key: item,
          value: item
        }));
      }

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        type: "search",
        id: "host-name",
        placeholder: this.props.hostName,
        list: "known-hosts",
        className: "quoted",
        value: this.state.hostName,
        onChange: this.handleHostNameChange,
        onBlur: this.handleEditingFinished,
        required: true
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("datalist", {
        id: "known-hosts"
      }, hostOptions));
    }
  }]);

  return HostSelector;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.PureComponent);



/***/ }),

/***/ "./src/widgets/image-preview.jsx":
/*!***************************************!*\
  !*** ./src/widgets/image-preview.jsx ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ImagePreview; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var _lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/blob-helpers.js */ "./src/lib/blob-helpers.js");
/* harmony import */ var _lib_strformat_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../lib/strformat.js */ "./src/lib/strformat.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }







var ImagePreview = function (_React$PureComponent) {
  _inherits(ImagePreview, _React$PureComponent);

  function ImagePreview(props) {
    var _this;

    _classCallCheck(this, ImagePreview);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ImagePreview).call(this, props));
    _this.state = {
      width: 0,
      height: 0
    };
    return _this;
  }

  _createClass(ImagePreview, [{
    key: "assignWidth",
    value: function assignWidth(node) {
      if (node && !this.state.width) {
        var bounds = node.getBoundingClientRect();
        this.setState({
          width: bounds.width | 0,
          height: bounds.height | 0
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      if (!this.props.content) {
        return null;
      }

      var dim = Object(_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_3__["fitImageSize"])(this.props.content.width, this.props.content.height, this.state.width, this.state.height, false);
      var size = dim ? {
        width: dim.dstWidth + 'px',
        height: dim.dstHeight + 'px'
      } : this.props.content.width > this.props.content.height ? {
        width: '100%'
      } : {
        height: '100%'
      };
      size.maxWidth = '100%';
      size.maxHeight = '100%';
      var filename = this.props.content.filename;
      var maxlength = Math.max((this.state.width / _config_js__WEBPACK_IMPORTED_MODULE_2__["REM_SIZE"] / 1.5 | 0) - 2, 12);

      if (filename.length > maxlength) {
        filename = filename.slice(0, maxlength / 2 - 1) + '...' + filename.slice(1 - maxlength / 2);
      }

      var width = this.props.content.width || '-';
      var height = this.props.content.height || '-';
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        id: "image-preview",
        onClick: this.props.onClose
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        id: "image-preview-caption-panel"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: this.props.content.url,
        download: this.props.content.filename
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons"
      }, "file_download"), " ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "download_action",
        defaultMessage: "download"
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "#",
        onClick: function onClick(e) {
          e.preventDefault();

          _this2.props.onClose();
        }
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons gray"
      }, "close"))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        id: "image-preview-container",
        ref: function ref(node) {
          return _this2.assignWidth(node);
        }
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("img", {
        src: this.props.content.url,
        style: size
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        id: "image-preview-footer"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("b", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "label_file_name",
        defaultMessage: "File name:"
      }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        title: this.props.content.filename
      }, filename ? filename : '-'))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("b", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "label_content_type",
        defaultMessage: "Content type:"
      }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, this.props.content.type)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("b", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "label_size",
        defaultMessage: "Size:"
      }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, width, " \xD7 ", height, " px; ", Object(_lib_strformat_js__WEBPACK_IMPORTED_MODULE_4__["bytesToHumanSize"])(this.props.content.size)))));
    }
  }]);

  return ImagePreview;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.PureComponent);


;

/***/ }),

/***/ "./src/widgets/in-place-edit.jsx":
/*!***************************************!*\
  !*** ./src/widgets/in-place-edit.jsx ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return InPlaceEdit; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "react-dom");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _visible_password_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./visible-password.jsx */ "./src/widgets/visible-password.jsx");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }





var InPlaceEdit = function (_React$Component) {
  _inherits(InPlaceEdit, _React$Component);

  function InPlaceEdit(props) {
    var _this;

    _classCallCheck(this, InPlaceEdit);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(InPlaceEdit).call(this, props));
    _this.state = {
      active: props.active,
      initialValue: props.value || '',
      value: props.value || ''
    };
    _this.handeTextChange = _this.handeTextChange.bind(_assertThisInitialized(_this));
    _this.handleKeyDown = _this.handleKeyDown.bind(_assertThisInitialized(_this));
    _this.handleStartEditing = _this.handleStartEditing.bind(_assertThisInitialized(_this));
    _this.handleEditingFinished = _this.handleEditingFinished.bind(_assertThisInitialized(_this));
    _this.handlePasswordFinished = _this.handlePasswordFinished.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(InPlaceEdit, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      var newValue = this.props.value || '';

      if (prevState.initialValue != newValue && !prevState.active) {
        this.setState({
          initialValue: newValue,
          value: newValue
        });
      }
    }
  }, {
    key: "handeTextChange",
    value: function handeTextChange(e) {
      this.setState({
        value: e.target.value
      });
    }
  }, {
    key: "handleKeyDown",
    value: function handleKeyDown(e) {
      if (e.keyCode === 27) {
        this.setState({
          value: this.props.value,
          active: false
        });
      } else if (e.keyCode === 13) {
        this.handleEditingFinished(e);
      }
    }
  }, {
    key: "handleStartEditing",
    value: function handleStartEditing() {
      if (!this.props.readOnly) {
        react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.findDOMNode(this).focus();
        this.setState({
          active: true
        });
      }
    }
  }, {
    key: "handleEditingFinished",
    value: function handleEditingFinished(event) {
      if (this.props.required && !event.target.checkValidity()) {
        this.setState({
          value: this.props.value,
          active: false
        });
        return;
      }

      this.setState({
        active: false
      });
      var value = this.state.value.trim();

      if ((value || this.props.value) && value !== this.props.value) {
        this.props.onFinished(value);
      }
    }
  }, {
    key: "handlePasswordFinished",
    value: function handlePasswordFinished(value) {
      this.setState({
        active: false
      });

      if (value && value !== this.props.value) {
        this.props.onFinished(value);
      }
    }
  }, {
    key: "render",
    value: function render() {
      if (this.state.active) {
        var fieldType = this.props.type || 'text';
      } else {
        var spanText = this.props.type == 'password' ? '••••••••' : this.state.value;
        var spanClass = 'in-place-edit' + (this.props.readOnly ? ' disabled' : '');

        if (!spanText) {
          spanText = this.props.placeholder;
          spanClass += ' placeholder';
        }

        if (spanText.length > 20) {
          spanText = spanText.substring(0, 19) + '...';
        }
      }

      return this.state.active ? fieldType == 'password' ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_visible_password_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
        value: this.state.value,
        placeholder: this.props.placeholder,
        required: this.props.required ? 'required' : '',
        autoComplete: this.props.autoComplete,
        autoFocus: true,
        onFinished: this.handlePasswordFinished
      }) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        type: fieldType,
        value: this.state.value,
        placeholder: this.props.placeholder,
        required: this.props.required ? 'required' : '',
        autoComplete: this.props.autoComplete,
        autoFocus: true,
        onChange: this.handeTextChange,
        onKeyDown: this.handleKeyDown,
        onBlur: this.handleEditingFinished
      }) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: spanClass,
        onClick: this.handleStartEditing
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "content"
      }, spanText));
    }
  }]);

  return InPlaceEdit;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);


;

/***/ }),

/***/ "./src/widgets/letter-tile.jsx":
/*!*************************************!*\
  !*** ./src/widgets/letter-tile.jsx ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return LetterTile; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tinode-sdk */ "tinode-sdk");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _lib_strformat_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/strformat.js */ "./src/lib/strformat.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }





var LetterTile = function (_React$PureComponent) {
  _inherits(LetterTile, _React$PureComponent);

  function LetterTile() {
    _classCallCheck(this, LetterTile);

    return _possibleConstructorReturn(this, _getPrototypeOf(LetterTile).apply(this, arguments));
  }

  _createClass(LetterTile, [{
    key: "render",
    value: function render() {
      var avatar;

      if (this.props.avatar === true) {
        var isGroup = tinode_sdk__WEBPACK_IMPORTED_MODULE_1___default.a.topicType(this.props.topic) == 'grp';
        var iconColor = (isGroup ? 'light-color' : 'dark-color') + Math.abs(Object(_lib_strformat_js__WEBPACK_IMPORTED_MODULE_2__["stringHash"])(this.props.topic)) % 16;

        if (this.props.topic && this.props.title && this.props.title.trim()) {
          var letter = this.props.title.trim().charAt(0);
          var className = 'lettertile ' + iconColor;
          avatar = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
            className: className
          }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, letter));
        } else {
          var _className = 'material-icons ' + iconColor;

          avatar = isGroup ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
            className: _className
          }, "group") : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
            className: _className
          }, "person");
        }
      } else if (this.props.avatar) {
        avatar = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("img", {
          className: "avatar",
          alt: "avatar",
          src: this.props.avatar,
          onError: function onError(e) {
            e.target.onerror = null;
            e.target.src = "/img/broken_image.png";
          }
        });
      } else {
        avatar = null;
      }

      return avatar;
    }
  }]);

  return LetterTile;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.PureComponent);



/***/ }),

/***/ "./src/widgets/load-spinner.jsx":
/*!**************************************!*\
  !*** ./src/widgets/load-spinner.jsx ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return LoadSpinner; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }



var LoadSpinner = function (_React$PureComponent) {
  _inherits(LoadSpinner, _React$PureComponent);

  function LoadSpinner() {
    _classCallCheck(this, LoadSpinner);

    return _possibleConstructorReturn(this, _getPrototypeOf(LoadSpinner).apply(this, arguments));
  }

  _createClass(LoadSpinner, [{
    key: "render",
    value: function render() {
      return this.props.show ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "load-spinner-box"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "loader-spinner"
      })) : null;
    }
  }]);

  return LoadSpinner;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.PureComponent);



/***/ }),

/***/ "./src/widgets/menu-cancel.jsx":
/*!*************************************!*\
  !*** ./src/widgets/menu-cancel.jsx ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return MenuCancel; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }



var MenuCancel = function (_React$PureComponent) {
  _inherits(MenuCancel, _React$PureComponent);

  function MenuCancel() {
    _classCallCheck(this, MenuCancel);

    return _possibleConstructorReturn(this, _getPrototypeOf(MenuCancel).apply(this, arguments));
  }

  _createClass(MenuCancel, [{
    key: "render",
    value: function render() {
      var _this = this;

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "#",
        onClick: function onClick(e) {
          e.preventDefault();

          _this.props.onCancel();
        }
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons"
      }, "close"));
    }
  }]);

  return MenuCancel;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.PureComponent);



/***/ }),

/***/ "./src/widgets/menu-contacts.jsx":
/*!***************************************!*\
  !*** ./src/widgets/menu-contacts.jsx ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return MenuContacts; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }



var MenuContacts = function (_React$PureComponent) {
  _inherits(MenuContacts, _React$PureComponent);

  function MenuContacts() {
    _classCallCheck(this, MenuContacts);

    return _possibleConstructorReturn(this, _getPrototypeOf(MenuContacts).apply(this, arguments));
  }

  _createClass(MenuContacts, [{
    key: "render",
    value: function render() {
      var _this = this;

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "#",
        onClick: function onClick(e) {
          e.preventDefault();

          _this.props.onNewTopic();
        }
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons"
      }, "chat")), "\xA0", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "#",
        onClick: function onClick(e) {
          e.preventDefault();

          _this.props.onSettings();
        }
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons"
      }, "settings")));
    }
  }]);

  return MenuContacts;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.PureComponent);


;

/***/ }),

/***/ "./src/widgets/menu-start.jsx":
/*!************************************!*\
  !*** ./src/widgets/menu-start.jsx ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return MenuStart; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }



var MenuStart = function (_React$PureComponent) {
  _inherits(MenuStart, _React$PureComponent);

  function MenuStart() {
    _classCallCheck(this, MenuStart);

    return _possibleConstructorReturn(this, _getPrototypeOf(MenuStart).apply(this, arguments));
  }

  _createClass(MenuStart, [{
    key: "render",
    value: function render() {
      var _this = this;

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "#",
        onClick: function onClick(e) {
          e.preventDefault();

          _this.props.onSignUp();
        }
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons"
      }, "person_add")), "\xA0", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "#",
        onClick: function onClick(e) {
          e.preventDefault();

          _this.props.onSettings();
        }
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons"
      }, "settings")));
    }
  }]);

  return MenuStart;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.PureComponent);


;

/***/ }),

/***/ "./src/widgets/more-button.jsx":
/*!*************************************!*\
  !*** ./src/widgets/more-button.jsx ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return MoreButton; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }



var MoreButton = function (_React$PureComponent) {
  _inherits(MoreButton, _React$PureComponent);

  function MoreButton(props) {
    var _this;

    _classCallCheck(this, MoreButton);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(MoreButton).call(this, props));
    _this.state = {
      open: props.open
    };
    _this.handleToggle = _this.handleToggle.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(MoreButton, [{
    key: "handleToggle",
    value: function handleToggle() {
      var open = !this.state.open;
      this.setState({
        open: open
      });

      if (this.props.onToggle) {
        this.props.onToggle(open);
      }
    }
  }, {
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "small clean-clickable",
        onClick: this.handleToggle
      }, this.props.title, "...", this.state.open ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons"
      }, "expand_more") : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons"
      }, "chevron_right"));
    }
  }]);

  return MoreButton;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.PureComponent);



/***/ }),

/***/ "./src/widgets/new-topic-by-id.jsx":
/*!*****************************************!*\
  !*** ./src/widgets/new-topic-by-id.jsx ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }



var messages = Object(react_intl__WEBPACK_IMPORTED_MODULE_1__["defineMessages"])({
  invalid_id: {
    "id": "error_invalid_id",
    "defaultMessage": "Invalid ID"
  }
});

var NewTopicById = function (_React$PureComponent) {
  _inherits(NewTopicById, _React$PureComponent);

  function NewTopicById(props) {
    var _this;

    _classCallCheck(this, NewTopicById);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(NewTopicById).call(this, props));
    _this.state = {
      groupId: ''
    };
    _this.handleChange = _this.handleChange.bind(_assertThisInitialized(_this));
    _this.handleKeyPress = _this.handleKeyPress.bind(_assertThisInitialized(_this));
    _this.handleSubmit = _this.handleSubmit.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(NewTopicById, [{
    key: "handleChange",
    value: function handleChange(e) {
      this.setState({
        groupId: e.target.value
      });
    }
  }, {
    key: "handleKeyPress",
    value: function handleKeyPress(e) {
      if (e.key === 'Enter') {
        this.handleSubmit(e);
      }
    }
  }, {
    key: "handleSubmit",
    value: function handleSubmit(e) {
      e.preventDefault();

      if (this.state.groupId) {
        var name = this.state.groupId.trim();

        if (name.length > 3 && (name.substr(0, 3) == 'usr' || name.substr(0, 3) == 'grp')) {
          this.props.onSubmit(name);
        } else {
          this.props.onError(this.props.intl.formatMessage(messages.invalid_id), 'err');
        }
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "group_user_id_prompt",
        defaultMessage: "Group or User ID"
      }, function (prompt) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
          type: "text",
          placeholder: prompt,
          value: _this2.state.groupId,
          onChange: _this2.handleChange,
          onKeyPress: _this2.handleKeyPress,
          required: true
        });
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "dialog-buttons"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "blue",
        onClick: this.handleSubmit
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "button_subscribe",
        defaultMessage: "Subscribe"
      }))));
    }
  }]);

  return NewTopicById;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.PureComponent);

;
/* harmony default export */ __webpack_exports__["default"] = (Object(react_intl__WEBPACK_IMPORTED_MODULE_1__["injectIntl"])(NewTopicById));

/***/ }),

/***/ "./src/widgets/new-topic-group.jsx":
/*!*****************************************!*\
  !*** ./src/widgets/new-topic-group.jsx ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return NewTopicGroup; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _avatar_upload_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./avatar-upload.jsx */ "./src/widgets/avatar-upload.jsx");
/* harmony import */ var _tag_manager_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./tag-manager.jsx */ "./src/widgets/tag-manager.jsx");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }







var NewTopicGroup = function (_React$PureComponent) {
  _inherits(NewTopicGroup, _React$PureComponent);

  function NewTopicGroup(props) {
    var _this;

    _classCallCheck(this, NewTopicGroup);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(NewTopicGroup).call(this, props));
    _this.state = {
      fn: '',
      private: '',
      imageDataUrl: null,
      tags: []
    };
    _this.handleFnChange = _this.handleFnChange.bind(_assertThisInitialized(_this));
    _this.handlePrivateChange = _this.handlePrivateChange.bind(_assertThisInitialized(_this));
    _this.handleImageChanged = _this.handleImageChanged.bind(_assertThisInitialized(_this));
    _this.handleTagsChanged = _this.handleTagsChanged.bind(_assertThisInitialized(_this));
    _this.handleTagsChanged = _this.handleTagsChanged.bind(_assertThisInitialized(_this));
    _this.handleSubmit = _this.handleSubmit.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(NewTopicGroup, [{
    key: "handleFnChange",
    value: function handleFnChange(e) {
      this.setState({
        fn: e.target.value
      });
    }
  }, {
    key: "handlePrivateChange",
    value: function handlePrivateChange(e) {
      this.setState({
        private: e.target.value
      });
    }
  }, {
    key: "handleImageChanged",
    value: function handleImageChanged(img) {
      this.setState({
        imageDataUrl: img
      });
    }
  }, {
    key: "handleTagsChanged",
    value: function handleTagsChanged(tags) {
      this.setState({
        tags: tags
      });
    }
  }, {
    key: "handleSubmit",
    value: function handleSubmit(e) {
      e.preventDefault();
      var fn = this.state.fn.trim().substring(0, _config_js__WEBPACK_IMPORTED_MODULE_4__["MAX_TITLE_LENGTH"]);
      var comment = this.state.private.trim().substring(0, _config_js__WEBPACK_IMPORTED_MODULE_4__["MAX_TITLE_LENGTH"]);

      if (fn) {
        this.props.onSubmit(fn, this.state.imageDataUrl, comment, this.state.tags);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var submitClasses = 'blue';

      if (this.props.disabled) {
        submitClasses += ' disabled';
      }

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("form", {
        className: "panel-form",
        onSubmit: this.handleSubmit
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-column"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "small",
        htmlFor: "new-topic-fn"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "label_topic_name"
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "topic_name_editing_placeholder",
        defaultMessage: "Freeform name of the group"
      }, function (placeholder) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
          type: "text",
          id: "new-topic-fn",
          placeholder: placeholder,
          value: _this2.state.fn,
          onChange: _this2.handleFnChange,
          autoFocus: true,
          required: true
        });
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("br", null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "small",
        htmlFor: "new-topic-priv"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "label_private"
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "private_editing_placeholder"
      }, function (placeholder) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
          type: "text",
          id: "new-topic-priv",
          placeholder: placeholder,
          value: _this2.state.private,
          onChange: _this2.handlePrivateChange
        });
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_avatar_upload_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
        onError: this.props.onError,
        onImageChanged: this.handleImageChanged
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "title_tag_manager"
      }, function (title) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_tag_manager_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
          tags: _this2.state.tags,
          activated: true,
          onTagsChanged: _this2.handleTagsChanged,
          title: title
        });
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "dialog-buttons"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: submitClasses
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "button_create",
        defaultMessage: "Create"
      }))));
    }
  }]);

  return NewTopicGroup;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.PureComponent);


;

/***/ }),

/***/ "./src/widgets/permissions-editor.jsx":
/*!********************************************!*\
  !*** ./src/widgets/permissions-editor.jsx ***!
  \********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _checkbox_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./checkbox.jsx */ "./src/widgets/checkbox.jsx");
/* harmony import */ var _contact_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./contact.jsx */ "./src/widgets/contact.jsx");
/* harmony import */ var _lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../lib/blob-helpers.js */ "./src/lib/blob-helpers.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }






var messages = Object(react_intl__WEBPACK_IMPORTED_MODULE_1__["defineMessages"])({
  'joiner': {
    "id": "permission_join",
    "defaultMessage": "Join ({val})"
  },
  'reader': {
    "id": "permission_read",
    "defaultMessage": "Read ({val})"
  },
  'writer': {
    "id": "permission_write",
    "defaultMessage": "Write ({val})"
  },
  'preser': {
    "id": "permission_pres",
    "defaultMessage": "Get notified ({val})"
  },
  'approver': {
    "id": "permission_admin",
    "defaultMessage": "Approve ({val})"
  },
  'sharer': {
    "id": "permission_share",
    "defaultMessage": "Share ({val})"
  },
  'deleter': {
    "id": "permission_delete",
    "defaultMessage": "Delete ({val})"
  },
  'owner': {
    "id": "permission_owner",
    "defaultMessage": "Owner ({val})"
  }
});

var PermissionsEditor = function (_React$Component) {
  _inherits(PermissionsEditor, _React$Component);

  function PermissionsEditor(props) {
    var _this;

    _classCallCheck(this, PermissionsEditor);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PermissionsEditor).call(this, props));
    _this.state = {
      mode: (props.mode || '').replace('N', '')
    };
    _this.handleChange = _this.handleChange.bind(_assertThisInitialized(_this));
    _this.handleSubmit = _this.handleSubmit.bind(_assertThisInitialized(_this));
    _this.handleCancel = _this.handleCancel.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(PermissionsEditor, [{
    key: "handleChange",
    value: function handleChange(val) {
      var mode = this.state.mode;
      var idx = mode.indexOf(val);

      if (idx == -1) {
        mode += val;
      } else {
        mode = mode.replace(val, '');
      }

      this.setState({
        mode: mode
      });
    }
  }, {
    key: "handleSubmit",
    value: function handleSubmit() {
      var mode = (this.state.mode || 'N').split('').sort().join('');
      var before = (this.props.mode || 'N').split('').sort().join('');

      if (mode !== before) {
        this.props.onSubmit(mode);
      } else {
        this.props.onCancel();
      }
    }
  }, {
    key: "handleCancel",
    value: function handleCancel() {
      this.props.onCancel();
    }
  }, {
    key: "render",
    value: function render() {
      var formatMessage = this.props.intl.formatMessage;
      var all = 'JRWPASDO';
      var names = {
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
      var skip = this.props.skip || '';
      var mode = this.state.mode;
      var compare = (this.props.compare || '').replace('N', '');
      var items = [];

      for (var i = 0; i < all.length; i++) {
        var c = all.charAt(i);

        if (skip.indexOf(c) >= 0 && mode.indexOf(c) < 0) {
          continue;
        }

        items.push(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", {
          key: c
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, names[c]), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
          className: "checkbox"
        }, skip.indexOf(c) < 0 ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_checkbox_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
          name: c,
          checked: mode.indexOf(c) >= 0,
          onChange: this.handleChange
        }) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_checkbox_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
          name: c,
          checked: mode.indexOf(c) >= 0
        })), this.props.compare ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
          className: "checkbox"
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_checkbox_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
          name: c,
          checked: compare.indexOf(c) >= 0
        })) : null));
      }

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-column"
      }, this.props.userTitle ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("ul", {
        className: "contact-box"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_contact_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
        item: this.props.item,
        title: this.props.userTitle,
        avatar: Object(_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_4__["makeImageUrl"])(this.props.userAvatar ? this.props.userAvatar : null)
      })) : null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "small"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "title_permissions",
        defaultMessage: "Permissions"
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("table", {
        className: "permission-editor"
      }, this.props.compare ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("thead", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", null, this.props.modeTitle), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", null, this.props.compareTitle))) : null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tbody", null, items)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("br", null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "dialog-buttons"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "outline",
        onClick: this.handleCancel
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "button_cancel"
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "blue",
        onClick: this.handleSubmit
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "button_ok"
      }))));
    }
  }]);

  return PermissionsEditor;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);

;
/* harmony default export */ __webpack_exports__["default"] = (Object(react_intl__WEBPACK_IMPORTED_MODULE_1__["injectIntl"])(PermissionsEditor));

/***/ }),

/***/ "./src/widgets/received-marker.jsx":
/*!*****************************************!*\
  !*** ./src/widgets/received-marker.jsx ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tinode-sdk */ "tinode-sdk");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _lib_strformat_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/strformat.js */ "./src/lib/strformat.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }





var messages = Object(react_intl__WEBPACK_IMPORTED_MODULE_1__["defineMessages"])({
  'sending': {
    "id": "message_sending",
    "defaultMessage": "sending..."
  },
  'failed': {
    "id": "message_sending_failed",
    "defaultMessage": "failed"
  }
});

var ReceivedMarker = function (_React$PureComponent) {
  _inherits(ReceivedMarker, _React$PureComponent);

  function ReceivedMarker() {
    _classCallCheck(this, ReceivedMarker);

    return _possibleConstructorReturn(this, _getPrototypeOf(ReceivedMarker).apply(this, arguments));
  }

  _createClass(ReceivedMarker, [{
    key: "render",
    value: function render() {
      var formatMessage = this.props.intl.formatMessage;
      var timestamp;

      if (this.props.received <= tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default.a.MESSAGE_STATUS_SENDING) {
        timestamp = formatMessage(messages.sending);
      } else if (this.props.received == tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default.a.MESSAGE_STATUS_FAILED) {
        timestamp = formatMessage(messages.failed);
      } else {
        timestamp = Object(_lib_strformat_js__WEBPACK_IMPORTED_MODULE_3__["shortDateFormat"])(this.props.timestamp, this.props.intl.locale);
      }

      var marker = null;

      if (this.props.received <= tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default.a.MESSAGE_STATUS_SENDING) {
        marker = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
          className: "material-icons small"
        }, "access_time");
      } else if (this.props.received == tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default.a.MESSAGE_STATUS_FAILED) {
        marker = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
          className: "material-icons small amber"
        }, "warning");
      } else if (this.props.received == tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default.a.MESSAGE_STATUS_SENT) {
        marker = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
          className: "material-icons small"
        }, "done");
      } else if (this.props.received == tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default.a.MESSAGE_STATUS_RECEIVED) {
        marker = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
          className: "material-icons small"
        }, "done_all");
      } else if (this.props.received == tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default.a.MESSAGE_STATUS_READ) {
        marker = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
          className: "material-icons small blue"
        }, "done_all");
      }

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "timestamp"
      }, timestamp, '\u00a0', marker);
    }
  }]);

  return ReceivedMarker;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.PureComponent);

;
/* harmony default export */ __webpack_exports__["default"] = (Object(react_intl__WEBPACK_IMPORTED_MODULE_1__["injectIntl"])(ReceivedMarker));

/***/ }),

/***/ "./src/widgets/search-contacts.jsx":
/*!*****************************************!*\
  !*** ./src/widgets/search-contacts.jsx ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return SearchContacts; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tinode-sdk */ "tinode-sdk");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }





var SearchContacts = function (_React$PureComponent) {
  _inherits(SearchContacts, _React$PureComponent);

  function SearchContacts(props) {
    var _this;

    _classCallCheck(this, SearchContacts);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SearchContacts).call(this, props));
    _this.state = {
      edited: false,
      search: ''
    };
    _this.handleSearchChange = _this.handleSearchChange.bind(_assertThisInitialized(_this));
    _this.handleSearch = _this.handleSearch.bind(_assertThisInitialized(_this));
    _this.handleClear = _this.handleClear.bind(_assertThisInitialized(_this));
    _this.handleKeyDown = _this.handleKeyDown.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(SearchContacts, [{
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.state.edited) {
        this.setState({
          search: '',
          edited: false
        });
        this.props.onSearchContacts(tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default.a.DEL_CHAR);
      }
    }
  }, {
    key: "handleSearchChange",
    value: function handleSearchChange(e) {
      this.setState({
        search: e.target.value
      });
    }
  }, {
    key: "handleSearch",
    value: function handleSearch(e) {
      e.preventDefault();
      var query = this.state.search.trim();
      this.setState({
        edited: query.length > 0
      });
      this.props.onSearchContacts(query.length > 0 ? query : tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default.a.DEL_CHAR);
    }
  }, {
    key: "handleClear",
    value: function handleClear(e) {
      e.preventDefault();

      if (this.state.edited) {
        this.props.onSearchContacts(tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default.a.DEL_CHAR);
      }

      this.setState({
        search: '',
        edited: false
      });
    }
  }, {
    key: "handleKeyDown",
    value: function handleKeyDown(e) {
      if (e.key === 'Enter') {
        this.handleSearch(e);
      } else if (e.key === 'Escape') {
        this.handleClear();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons search"
      }, "search"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "search_placeholder",
        defaultMessage: "List like email:alice@example.com, tel:17025550003..."
      }, function (search_placeholder) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
          className: "search",
          type: "text",
          placeholder: search_placeholder,
          value: _this2.state.search,
          onChange: _this2.handleSearchChange,
          onKeyDown: _this2.handleKeyDown,
          required: true,
          autoFocus: true
        });
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "#",
        onClick: this.handleClear
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons"
      }, "close"))));
    }
  }]);

  return SearchContacts;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.PureComponent);


;

/***/ }),

/***/ "./src/widgets/send-message.jsx":
/*!**************************************!*\
  !*** ./src/widgets/send-message.jsx ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tinode-sdk */ "tinode-sdk");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var _lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../lib/blob-helpers.js */ "./src/lib/blob-helpers.js");
/* harmony import */ var _lib_strformat_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../lib/strformat.js */ "./src/lib/strformat.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }







var messages = Object(react_intl__WEBPACK_IMPORTED_MODULE_1__["defineMessages"])({
  'messaging_disabled': {
    "id": "messaging_disabled_prompt",
    "defaultMessage": "Messaging disabled"
  },
  'type_new_message': {
    "id": "new_message_prompt",
    "defaultMessage": "New message"
  },
  'file_attachment_too_large': {
    "id": "file_attachment_too_large",
    "defaultMessage": "The file size {size} exceeds the {limit} limit."
  },
  'cannot_initiate_upload': {
    "id": "cannot_initiate_file_upload",
    "defaultMessage": "Cannot initiate file upload."
  }
});

var SendMessage = function (_React$PureComponent) {
  _inherits(SendMessage, _React$PureComponent);

  function SendMessage(props) {
    var _this;

    _classCallCheck(this, SendMessage);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SendMessage).call(this, props));
    _this.state = {
      message: '',
      keypressTimestamp: new Date().getTime() - _config_js__WEBPACK_IMPORTED_MODULE_3__["KEYPRESS_DELAY"] - 1
    };
    _this.handlePasteEvent = _this.handlePasteEvent.bind(_assertThisInitialized(_this));
    _this.handleAttachImage = _this.handleAttachImage.bind(_assertThisInitialized(_this));
    _this.handleAttachFile = _this.handleAttachFile.bind(_assertThisInitialized(_this));
    _this.handleSend = _this.handleSend.bind(_assertThisInitialized(_this));
    _this.handleKeyPress = _this.handleKeyPress.bind(_assertThisInitialized(_this));
    _this.handleMessageTyping = _this.handleMessageTyping.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(SendMessage, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.messageEditArea.addEventListener('paste', this.handlePasteEvent, false);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.messageEditArea.removeEventListener('paste', this.handlePasteEvent, false);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this.messageEditArea.focus();
    }
  }, {
    key: "handlePasteEvent",
    value: function handlePasteEvent(e) {
      var _this2 = this;

      if (this.props.disabled) {
        return;
      }

      if (Object(_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_4__["filePasted"])(e, function (bits, mime, width, height, fname) {
        _this2.props.sendMessage(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__["Drafty"].insertImage(null, 0, mime, bits, width, height, fname));
      }, function (mime, bits, fname) {
        _this2.props.sendMessage(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__["Drafty"].attachFile(null, mime, bits, fname));
      }, this.props.onError)) {
        e.preventDefault();
      }
    }
  }, {
    key: "handleAttachImage",
    value: function handleAttachImage(e) {
      var _this3 = this;

      if (e.target.files && e.target.files.length > 0) {
        var file = e.target.files[0];

        if (file.size > _config_js__WEBPACK_IMPORTED_MODULE_3__["MAX_INBAND_ATTACHMENT_SIZE"] || _lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_4__["SUPPORTED_IMAGE_FORMATS"].indexOf(file.type) < 0) {
          Object(_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_4__["imageFileScaledToBase64"])(file, _config_js__WEBPACK_IMPORTED_MODULE_3__["MAX_IMAGE_DIM"], _config_js__WEBPACK_IMPORTED_MODULE_3__["MAX_IMAGE_DIM"], false, function (bits, mime, width, height, fname) {
            _this3.props.sendMessage(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__["Drafty"].insertImage(null, 0, mime, bits, width, height, fname));
          }, function (err) {
            _this3.props.onError(err, 'err');
          });
        } else {
          Object(_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_4__["imageFileToBase64"])(file, function (bits, mime, width, height, fname) {
            _this3.props.sendMessage(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__["Drafty"].insertImage(null, 0, mime, bits, width, height, fname));
          }, function (err) {
            _this3.props.onError(err, 'err');
          });
        }
      }

      e.target.value = '';
    }
  }, {
    key: "handleAttachFile",
    value: function handleAttachFile(e) {
      var _this4 = this;

      var formatMessage = this.props.intl.formatMessage;

      if (e.target.files && e.target.files.length > 0) {
        var file = e.target.files[0];

        if (file.size > _config_js__WEBPACK_IMPORTED_MODULE_3__["MAX_EXTERN_ATTACHMENT_SIZE"]) {
          this.props.onError(formatMessage(messages.file_attachment_too_large, {
            size: Object(_lib_strformat_js__WEBPACK_IMPORTED_MODULE_5__["bytesToHumanSize"])(file.size),
            limit: Object(_lib_strformat_js__WEBPACK_IMPORTED_MODULE_5__["bytesToHumanSize"])(_config_js__WEBPACK_IMPORTED_MODULE_3__["MAX_EXTERN_ATTACHMENT_SIZE"])
          }), 'err');
        } else if (file.size > _config_js__WEBPACK_IMPORTED_MODULE_3__["MAX_INBAND_ATTACHMENT_SIZE"]) {
          var uploader = this.props.tinode.getLargeFileHelper();

          if (!uploader) {
            this.props.onError(formatMessage(messages.cannot_initiate_upload));
            return;
          }

          var uploadCompletionPromise = uploader.upload(file);
          var msg = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__["Drafty"].attachFile(null, file.type, null, file.name, file.size, uploadCompletionPromise);
          this.props.sendMessage(msg, uploadCompletionPromise, uploader);
        } else {
          Object(_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_4__["fileToBase64"])(file, function (mime, bits, fname) {
            _this4.props.sendMessage(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__["Drafty"].attachFile(null, mime, bits, fname));
          }, this.props.onError);
        }
      }

      e.target.value = '';
    }
  }, {
    key: "handleSend",
    value: function handleSend(e) {
      e.preventDefault();
      var message = this.state.message.trim();

      if (message) {
        this.props.sendMessage(this.state.message.trim());
        this.setState({
          message: ''
        });
      }
    }
  }, {
    key: "handleKeyPress",
    value: function handleKeyPress(e) {
      if (e.key === 'Enter') {
        if (!e.shiftKey) {
          e.preventDefault();
          e.stopPropagation();
          this.handleSend(e);
        }
      }
    }
  }, {
    key: "handleMessageTyping",
    value: function handleMessageTyping(e) {
      var newState = {
        message: e.target.value
      };
      var now = new Date().getTime();

      if (now - this.state.keypressTimestamp > _config_js__WEBPACK_IMPORTED_MODULE_3__["KEYPRESS_DELAY"]) {
        var topic = this.props.tinode.getTopic(this.props.topic);

        if (topic.isSubscribed()) {
          topic.noteKeyPress();
        }

        newState.keypressTimestamp = now;
      }

      this.setState(newState);
    }
  }, {
    key: "render",
    value: function render() {
      var _this5 = this;

      var formatMessage = this.props.intl.formatMessage;
      var prompt = this.props.disabled ? formatMessage(messages.messaging_disabled) : formatMessage(messages.type_new_message);
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        id: "send-message-panel"
      }, this.props.disabled ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons disabled"
      }, "photo") : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "#",
        onClick: function onClick(e) {
          e.preventDefault();

          _this5.attachImage.click();
        },
        title: "Add image"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons secondary"
      }, "photo")), this.props.disabled ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons disabled"
      }, "attach_file") : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "#",
        onClick: function onClick(e) {
          e.preventDefault();

          _this5.attachFile.click();
        },
        title: "Attach file"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons secondary"
      }, "attach_file")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("textarea", {
        id: "sendMessage",
        placeholder: prompt,
        disabled: this.props.disabled,
        value: this.state.message,
        onChange: this.handleMessageTyping,
        onKeyPress: this.handleKeyPress,
        ref: function ref(_ref) {
          _this5.messageEditArea = _ref;
        },
        autoFocus: true
      }), this.props.disabled ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons disabled"
      }, "send") : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "#",
        onClick: this.handleSend,
        title: "Send"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons"
      }, "send")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        type: "file",
        ref: function ref(_ref2) {
          _this5.attachFile = _ref2;
        },
        onChange: this.handleAttachFile,
        style: {
          display: 'none'
        }
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        type: "file",
        ref: function ref(_ref3) {
          _this5.attachImage = _ref3;
        },
        accept: "image/*",
        onChange: this.handleAttachImage,
        style: {
          display: 'none'
        }
      }));
    }
  }]);

  return SendMessage;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.PureComponent);

;
/* harmony default export */ __webpack_exports__["default"] = (Object(react_intl__WEBPACK_IMPORTED_MODULE_1__["injectIntl"])(SendMessage));

/***/ }),

/***/ "./src/widgets/side-navbar.jsx":
/*!*************************************!*\
  !*** ./src/widgets/side-navbar.jsx ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return SideNavbar; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _letter_tile_jsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./letter-tile.jsx */ "./src/widgets/letter-tile.jsx");
/* harmony import */ var _menu_cancel_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./menu-cancel.jsx */ "./src/widgets/menu-cancel.jsx");
/* harmony import */ var _menu_contacts_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./menu-contacts.jsx */ "./src/widgets/menu-contacts.jsx");
/* harmony import */ var _menu_start_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./menu-start.jsx */ "./src/widgets/menu-start.jsx");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }







var SideNavbar = function (_React$PureComponent) {
  _inherits(SideNavbar, _React$PureComponent);

  function SideNavbar() {
    _classCallCheck(this, SideNavbar);

    return _possibleConstructorReturn(this, _getPrototypeOf(SideNavbar).apply(this, arguments));
  }

  _createClass(SideNavbar, [{
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        id: "side-caption-panel",
        className: "caption-panel"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        id: "self-avatar",
        className: "avatar-box"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_letter_tile_jsx__WEBPACK_IMPORTED_MODULE_1__["default"], {
        avatar: this.props.avatar,
        topic: this.props.myUserId,
        title: this.props.title
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        id: "sidepanel-title",
        className: "panel-title"
      }, this.props.title), this.props.state === 'login' ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_menu_start_jsx__WEBPACK_IMPORTED_MODULE_4__["default"], {
        onSignUp: this.props.onSignUp,
        onSettings: this.props.onSettings
      }) : this.props.state === 'contacts' ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_menu_contacts_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
        onNewTopic: this.props.onNewTopic,
        onSettings: this.props.onSettings
      }) : null, this.props.onCancel ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_menu_cancel_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
        onCancel: this.props.onCancel
      }) : null);
    }
  }]);

  return SideNavbar;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.PureComponent);


;

/***/ }),

/***/ "./src/widgets/tag-manager.jsx":
/*!*************************************!*\
  !*** ./src/widgets/tag-manager.jsx ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return TagManager; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _chip_input_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./chip-input.jsx */ "./src/widgets/chip-input.jsx");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var _lib_utils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../lib/utils.js */ "./src/lib/utils.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }







var TagManager = function (_React$Component) {
  _inherits(TagManager, _React$Component);

  function TagManager(props) {
    var _this;

    _classCallCheck(this, TagManager);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TagManager).call(this, props));
    _this.state = {
      tags: _this.props.tags,
      tagInput: '',
      activated: _this.props.activated
    };
    _this.handleTagInput = _this.handleTagInput.bind(_assertThisInitialized(_this));
    _this.handleAddTag = _this.handleAddTag.bind(_assertThisInitialized(_this));
    _this.handleRemoveTag = _this.handleRemoveTag.bind(_assertThisInitialized(_this));
    _this.handleSubmit = _this.handleSubmit.bind(_assertThisInitialized(_this));
    _this.handleCancel = _this.handleCancel.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(TagManager, [{
    key: "handleTagInput",
    value: function handleTagInput(text) {
      this.setState({
        tagInput: text
      });

      if (text.length > 0) {
        var last = text[text.length - 1];

        if (text[0] == '"') {
          if (text.length > 1 && last == '"') {
            this.handleAddTag(text.substring(1, text.length - 1));
          }
        } else if (last == ',' || last == ' ' || last == ';' || last == '"') {
          this.handleAddTag(text.substring(0, text.length - 1).trim());
        }
      }
    }
  }, {
    key: "handleAddTag",
    value: function handleAddTag(tag) {
      if (tag.length > 0) {
        var tags = this.state.tags.slice(0);
        tags.push(tag);
        this.setState({
          tags: tags,
          tagInput: ''
        });

        if (this.props.onTagsChanged) {
          this.props.onTagsChanged(tags);
        }

        return tags;
      }

      return this.state.tags;
    }
  }, {
    key: "handleRemoveTag",
    value: function handleRemoveTag(tag, index) {
      var tags = this.state.tags.slice(0);
      tags.splice(index, 1);
      this.setState({
        tags: tags
      });

      if (this.props.onTagsChanged) {
        this.props.onTagsChanged(tags);
      }
    }
  }, {
    key: "handleSubmit",
    value: function handleSubmit() {
      this.props.onSubmit(this.handleAddTag(this.state.tagInput.trim()));
      this.setState({
        activated: false,
        tags: this.props.tags
      });
    }
  }, {
    key: "handleCancel",
    value: function handleCancel() {
      this.setState({
        activated: false,
        tagInput: '',
        tags: this.props.tags
      });

      if (this.props.onCancel) {
        this.props.onCancel();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var tags = [];

      if (this.state.activated) {
        this.state.tags.map(function (tag) {
          tags.push({
            user: tag,
            invalid: tag.length < _config_js__WEBPACK_IMPORTED_MODULE_3__["MIN_TAG_LENGTH"]
          });
        });
      } else {
        this.state.tags.map(function (tag) {
          tags.push(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
            className: "badge",
            key: tags.length
          }, tag));
        });

        if (tags.length == 0) {
          tags = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
            id: "tags_not_found",
            defaultMessage: "No tags defined. Add some."
          }));
        }
      }

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-column"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "small"
      }, this.props.title)), this.state.activated ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "tags_editor_no_tags",
        defaultMessage: "Add some tags"
      }, function (add_tags_prompt) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_chip_input_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
          chips: tags,
          avatarDisabled: true,
          prompt: add_tags_prompt,
          onEnter: _this2.handleAddTag,
          onFocusLost: _this2.handleAddTag,
          onCancel: _this2.handleCancel,
          onChipRemoved: _this2.handleRemoveTag,
          filterFunc: _this2.handleTagInput
        });
      }), this.props.onSubmit || this.props.onCancel ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        id: "tag-manager-buttons",
        className: "dialog-buttons panel-form-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "outline",
        onClick: this.handleCancel
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "button_cancel",
        defautMessage: "Cancel",
        description: "Rejection button [Cancel]"
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "blue",
        onClick: this.handleSubmit
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "button_ok",
        defautMessage: "OK",
        description: "Confirmation button [OK]"
      }))) : null) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "quoted"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "#",
        className: "flat-button",
        onClick: function onClick(e) {
          e.preventDefault();

          _this2.setState({
            activated: true
          });
        }
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons"
      }, "edit"), " \xA0", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "title_manage_tags",
        defaultMessage: "Manage"
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, tags)));
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(nextProps, prevState) {
      if (!Object(_lib_utils_js__WEBPACK_IMPORTED_MODULE_4__["arrayEqual"])(nextProps.tags, prevState.tags) && !prevState.activated) {
        return {
          tags: nextProps.tags
        };
      }

      return null;
    }
  }]);

  return TagManager;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);


;

/***/ }),

/***/ "./src/widgets/unread-badge.jsx":
/*!**************************************!*\
  !*** ./src/widgets/unread-badge.jsx ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return UnreadBadge; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }



var UnreadBadge = function (_React$PureComponent) {
  _inherits(UnreadBadge, _React$PureComponent);

  function UnreadBadge() {
    _classCallCheck(this, UnreadBadge);

    return _possibleConstructorReturn(this, _getPrototypeOf(UnreadBadge).apply(this, arguments));
  }

  _createClass(UnreadBadge, [{
    key: "render",
    value: function render() {
      return this.props.count > 0 ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "unread"
      }, this.props.count > 9 ? "9+" : this.props.count) : null;
    }
  }]);

  return UnreadBadge;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.PureComponent);


;

/***/ }),

/***/ "./src/widgets/visible-password.jsx":
/*!******************************************!*\
  !*** ./src/widgets/visible-password.jsx ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return VisiblePassword; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }



var VisiblePassword = function (_React$PureComponent) {
  _inherits(VisiblePassword, _React$PureComponent);

  function VisiblePassword(props) {
    var _this;

    _classCallCheck(this, VisiblePassword);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(VisiblePassword).call(this, props));
    _this.state = {
      value: _this.props.value,
      visible: false
    };
    _this.handleVisibility = _this.handleVisibility.bind(_assertThisInitialized(_this));
    _this.handeTextChange = _this.handeTextChange.bind(_assertThisInitialized(_this));
    _this.handleKeyDown = _this.handleKeyDown.bind(_assertThisInitialized(_this));
    _this.handleEditingFinished = _this.handleEditingFinished.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(VisiblePassword, [{
    key: "handeTextChange",
    value: function handeTextChange(e) {
      this.setState({
        value: e.target.value
      });

      if (this.props.onChange) {
        this.props.onChange(e);
      }
    }
  }, {
    key: "handleVisibility",
    value: function handleVisibility(e) {
      e.preventDefault();
      this.setState({
        visible: !this.state.visible
      });
    }
  }, {
    key: "handleKeyDown",
    value: function handleKeyDown(e) {
      if (e.keyCode == 27) {
        this.setState({
          value: this.props.value,
          visible: false
        });

        if (this.props.onFinished) {
          this.props.onFinished();
        }
      } else if (e.keyCode == 13) {
        this.handleEditingFinished();
      }
    }
  }, {
    key: "handleEditingFinished",
    value: function handleEditingFinished(e) {
      var _this2 = this;

      if (e) {
        var currentTarget = e.currentTarget;
        setTimeout(function () {
          if (!currentTarget.contains(document.activeElement)) {
            if (_this2.props.onFinished) {
              _this2.props.onFinished(_this2.state.value);
            }
          }
        }, 0);
      } else if (this.props.onFinished) {
        this.props.onFinished(this.state.value.trim());
      }
    }
  }, {
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        tabIndex: "-1",
        className: "group-focus",
        onBlur: this.handleEditingFinished
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        className: "with-visibility",
        type: this.state.visible ? "text" : "password",
        value: this.state.value,
        placeholder: this.props.placeholder,
        required: this.props.required ? 'required' : '',
        autoFocus: this.props.autoFocus ? 'autoFocus' : '',
        autoComplete: this.props.autoComplete,
        onChange: this.handeTextChange,
        onKeyDown: this.handleKeyDown
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        onClick: this.handleVisibility
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons clickable light-gray"
      }, this.state.visible ? 'visibility' : 'visibility_off')));
    }
  }]);

  return VisiblePassword;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.PureComponent);



/***/ }),

/***/ "firebase/app":
/*!***************************!*\
  !*** external "firebase" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = firebase;

/***/ }),

/***/ "firebase/messaging":
/*!*****************************************!*\
  !*** external ["firebase","messaging"] ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = firebase["messaging"];

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = React;

/***/ }),

/***/ "react-dom":
/*!***************************!*\
  !*** external "ReactDOM" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ReactDOM;

/***/ }),

/***/ "react-intl":
/*!****************************!*\
  !*** external "ReactIntl" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ReactIntl;

/***/ }),

/***/ "tinode-sdk":
/*!*************************!*\
  !*** external "Tinode" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = Tinode;

/***/ })

/******/ });
//# sourceMappingURL=index.dev.js.map
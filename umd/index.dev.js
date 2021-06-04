/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/config.js":
/*!***********************!*\
  !*** ./src/config.js ***!
  \***********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "APP_NAME": function() { return /* binding */ APP_NAME; },
/* harmony export */   "API_KEY": function() { return /* binding */ API_KEY; },
/* harmony export */   "KNOWN_HOSTS": function() { return /* binding */ KNOWN_HOSTS; },
/* harmony export */   "DEFAULT_HOST": function() { return /* binding */ DEFAULT_HOST; },
/* harmony export */   "LOGGING_ENABLED": function() { return /* binding */ LOGGING_ENABLED; },
/* harmony export */   "KEYPRESS_DELAY": function() { return /* binding */ KEYPRESS_DELAY; },
/* harmony export */   "RECEIVED_DELAY": function() { return /* binding */ RECEIVED_DELAY; },
/* harmony export */   "READ_DELAY": function() { return /* binding */ READ_DELAY; },
/* harmony export */   "MIN_TAG_LENGTH": function() { return /* binding */ MIN_TAG_LENGTH; },
/* harmony export */   "MAX_TAG_LENGTH": function() { return /* binding */ MAX_TAG_LENGTH; },
/* harmony export */   "MAX_TAG_COUNT": function() { return /* binding */ MAX_TAG_COUNT; },
/* harmony export */   "DEFAULT_P2P_ACCESS_MODE": function() { return /* binding */ DEFAULT_P2P_ACCESS_MODE; },
/* harmony export */   "NEW_GRP_ACCESS_MODE": function() { return /* binding */ NEW_GRP_ACCESS_MODE; },
/* harmony export */   "CHANNEL_ACCESS_MODE": function() { return /* binding */ CHANNEL_ACCESS_MODE; },
/* harmony export */   "NO_ACCESS_MODE": function() { return /* binding */ NO_ACCESS_MODE; },
/* harmony export */   "MEDIA_BREAKPOINT": function() { return /* binding */ MEDIA_BREAKPOINT; },
/* harmony export */   "REM_SIZE": function() { return /* binding */ REM_SIZE; },
/* harmony export */   "AVATAR_SIZE": function() { return /* binding */ AVATAR_SIZE; },
/* harmony export */   "BROKEN_IMAGE_SIZE": function() { return /* binding */ BROKEN_IMAGE_SIZE; },
/* harmony export */   "MESSAGES_PAGE": function() { return /* binding */ MESSAGES_PAGE; },
/* harmony export */   "MAX_INBAND_ATTACHMENT_SIZE": function() { return /* binding */ MAX_INBAND_ATTACHMENT_SIZE; },
/* harmony export */   "MAX_EXTERN_ATTACHMENT_SIZE": function() { return /* binding */ MAX_EXTERN_ATTACHMENT_SIZE; },
/* harmony export */   "MAX_IMAGE_DIM": function() { return /* binding */ MAX_IMAGE_DIM; },
/* harmony export */   "IMAGE_PREVIEW_DIM": function() { return /* binding */ IMAGE_PREVIEW_DIM; },
/* harmony export */   "MAX_ONLINE_IN_TOPIC": function() { return /* binding */ MAX_ONLINE_IN_TOPIC; },
/* harmony export */   "MAX_TITLE_LENGTH": function() { return /* binding */ MAX_TITLE_LENGTH; },
/* harmony export */   "MESSAGE_PREVIEW_LENGTH": function() { return /* binding */ MESSAGE_PREVIEW_LENGTH; },
/* harmony export */   "LINK_CONTACT_US": function() { return /* binding */ LINK_CONTACT_US; },
/* harmony export */   "LINK_PRIVACY_POLICY": function() { return /* binding */ LINK_PRIVACY_POLICY; },
/* harmony export */   "LINK_TERMS_OF_SERVICE": function() { return /* binding */ LINK_TERMS_OF_SERVICE; }
/* harmony export */ });
/* harmony import */ var _version_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./version.js */ "./src/version.js");

const APP_NAME = 'TinodeWeb/' + (_version_js__WEBPACK_IMPORTED_MODULE_0__.PACKAGE_VERSION || '0.17');
const API_KEY = 'AQEAAAABAAD_rAp4DJh05a1HAwFT3A6K';
const KNOWN_HOSTS = {
  hosted: 'web.tinode.co',
  local: 'localhost:6060'
};
const DEFAULT_HOST = KNOWN_HOSTS.hosted;
const LOGGING_ENABLED = true;
const KEYPRESS_DELAY = 3 * 1000;
const RECEIVED_DELAY = 500;
const READ_DELAY = 1000;
const MIN_TAG_LENGTH = 2;
const MAX_TAG_LENGTH = 96;
const MAX_TAG_COUNT = 16;
const DEFAULT_P2P_ACCESS_MODE = 'JRWPS';
const NEW_GRP_ACCESS_MODE = 'JRWPSAO';
const CHANNEL_ACCESS_MODE = 'JR';
const NO_ACCESS_MODE = 'N';
const MEDIA_BREAKPOINT = 640;
const REM_SIZE = 13;
const AVATAR_SIZE = 128;
const BROKEN_IMAGE_SIZE = 32;
const MESSAGES_PAGE = 24;
const MAX_INBAND_ATTACHMENT_SIZE = 262144;
const MAX_EXTERN_ATTACHMENT_SIZE = 1 << 23;
const MAX_IMAGE_DIM = 1024;
const IMAGE_PREVIEW_DIM = 64;
const MAX_ONLINE_IN_TOPIC = 4;
const MAX_TITLE_LENGTH = 60;
const MESSAGE_PREVIEW_LENGTH = 80;
const LINK_CONTACT_US = 'email:support@tinode.co';
const LINK_PRIVACY_POLICY = 'https://tinode.co/privacy.html';
const LINK_TERMS_OF_SERVICE = 'https://tinode.co/terms.html';

/***/ }),

/***/ "./src/lib/blob-helpers.js":
/*!*********************************!*\
  !*** ./src/lib/blob-helpers.js ***!
  \*********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SUPPORTED_IMAGE_FORMATS": function() { return /* binding */ SUPPORTED_IMAGE_FORMATS; },
/* harmony export */   "MIME_EXTENSIONS": function() { return /* binding */ MIME_EXTENSIONS; },
/* harmony export */   "makeImageDataUrl": function() { return /* binding */ makeImageDataUrl; },
/* harmony export */   "fitImageSize": function() { return /* binding */ fitImageSize; },
/* harmony export */   "fileNameForMime": function() { return /* binding */ fileNameForMime; },
/* harmony export */   "imageScaled": function() { return /* binding */ imageScaled; },
/* harmony export */   "fileToBase64": function() { return /* binding */ fileToBase64; },
/* harmony export */   "blobToBase64": function() { return /* binding */ blobToBase64; },
/* harmony export */   "filePasted": function() { return /* binding */ filePasted; },
/* harmony export */   "getMimeType": function() { return /* binding */ getMimeType; },
/* harmony export */   "base64EncodedLen": function() { return /* binding */ base64EncodedLen; },
/* harmony export */   "base64DecodedLen": function() { return /* binding */ base64DecodedLen; },
/* harmony export */   "base64ReEncode": function() { return /* binding */ base64ReEncode; }
/* harmony export */ });
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var _strformat_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./strformat.js */ "./src/lib/strformat.js");


const SUPPORTED_IMAGE_FORMATS = ['image/jpeg', 'image/gif', 'image/png', 'image/svg', 'image/svg+xml'];
const MIME_EXTENSIONS = ['jpg', 'gif', 'png', 'svg', 'svg'];
function makeImageDataUrl(photo) {
  if (photo) {
    if (photo.data && photo.type) {
      return 'data:image/' + photo.type + ';base64,' + photo.data;
    }

    return photo.ref;
  }

  return null;
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

  let scale = Math.min(Math.min(width, maxWidth) / width, Math.min(height, maxHeight) / height);
  let size = {
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
  const idx = SUPPORTED_IMAGE_FORMATS.indexOf(mime);

  if (idx < 0 || !fname) {
    return fname;
  }

  const ext = MIME_EXTENSIONS[idx];
  const at = fname.lastIndexOf('.');

  if (at >= 0) {
    fname = fname.substring(0, at);
  }

  return fname + '.' + ext;
}
function imageScaled(fileOrBlob, maxWidth, maxHeight, maxSize, forceSquare, onSuccess, onError) {
  const img = new Image();
  img.crossOrigin = 'Anonymous';

  img.onerror = function (err) {
    onError("Image format unrecognized");
  };

  img.onload = async function () {
    URL.revokeObjectURL(img.src);
    const dim = fitImageSize(this.width, this.height, maxWidth, maxHeight, forceSquare);

    if (!dim) {
      onError("Invalid image");
      return;
    }

    let canvas = document.createElement('canvas');
    canvas.width = dim.dstWidth;
    canvas.height = dim.dstHeight;
    let ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(this, dim.xoffset, dim.yoffset, dim.srcWidth, dim.srcHeight, 0, 0, dim.dstWidth, dim.dstHeight);
    const mime = SUPPORTED_IMAGE_FORMATS.indexOf(fileOrBlob.type) < 0 ? 'image/jpeg' : fileOrBlob.type;
    let blob = await new Promise(resolve => canvas.toBlob(resolve, mime));

    if (!blob) {
      onError("Unsupported image format");
      return;
    }

    while (maxSize > 0 && blob.length > maxSize) {
      dim.dstWidth = dim.dstWidth * 0.70710678118 | 0;
      dim.dstHeight = dim.dstHeight * 0.70710678118 | 0;
      canvas.width = dim.dstWidth;
      canvas.height = dim.dstHeight;
      ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(this, dim.xoffset, dim.yoffset, dim.srcWidth, dim.srcHeight, 0, 0, dim.dstWidth, dim.dstHeight);
      blob = await new Promise(resolve => canvas.toBlob(resolve, mime));
    }

    canvas = null;
    onSuccess(blob, mime, dim.dstWidth, dim.dstHeight, fileNameForMime(fileOrBlob.name, mime));
  };

  img.src = URL.createObjectURL(fileOrBlob);
}
function fileToBase64(file, onSuccess) {
  const reader = new FileReader();
  reader.addEventListener('load', function () {
    onSuccess(file.type, reader.result.split(',')[1], file.name);
  });
  reader.readAsDataURL(file);
}
function blobToBase64(blob, onSuccess) {
  const reader = new FileReader();
  reader.addEventListener('load', function () {
    onSuccess(blob.type, reader.result.split(',')[1]);
  });
  reader.readAsDataURL(blob);
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
        if (file.size > _config_js__WEBPACK_IMPORTED_MODULE_0__.MAX_INBAND_ATTACHMENT_SIZE || SUPPORTED_IMAGE_FORMATS.indexOf(file.type) < 0) {
          imageFileScaledToBase64(file, _config_js__WEBPACK_IMPORTED_MODULE_0__.MAX_IMAGE_DIM, _config_js__WEBPACK_IMPORTED_MODULE_0__.MAX_IMAGE_DIM, false, onImageSuccess, onError);
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
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "detectServerAddress": function() { return /* binding */ detectServerAddress; },
/* harmony export */   "isSecureConnection": function() { return /* binding */ isSecureConnection; },
/* harmony export */   "isLocalHost": function() { return /* binding */ isLocalHost; }
/* harmony export */ });
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../config.js */ "./src/config.js");

function detectServerAddress() {
  let host = _config_js__WEBPACK_IMPORTED_MODULE_0__.DEFAULT_HOST;

  if (typeof window.location == 'object') {
    if (window.location.protocol == 'file:' || window.location.hostname == 'localhost') {
      host = _config_js__WEBPACK_IMPORTED_MODULE_0__.KNOWN_HOSTS.local;
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
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ LocalStorageUtil; }
/* harmony export */ });
class LocalStorageUtil {
  static setObject(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  static getObject(key) {
    const value = localStorage.getItem(key);
    return value && JSON.parse(value);
  }

  static updateObject(key, value) {
    const oldVal = this.getObject(key);
    this.setObject(key, Object.assign(oldVal || {}, value));
  }

  static removeItem(key) {
    localStorage.removeItem(key);
  }

}

/***/ }),

/***/ "./src/lib/navigation.js":
/*!*******************************!*\
  !*** ./src/lib/navigation.js ***!
  \*******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ HashNavigation; }
/* harmony export */ });
class HashNavigation {
  static parseUrlHash(hash) {
    const parts = hash.split('?', 2);
    const params = {};
    let path = [];

    if (parts[0]) {
      path = parts[0].substr(1).split('/');
    }

    if (parts[1]) {
      parts[1].split('&').forEach(function (part) {
        let item = part.split('=');

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

  static navigateTo(url) {
    window.location.hash = url;
  }

  static composeUrlHash(path, params) {
    let url = path.join('/');
    const args = [];

    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        args.push(key + '=' + params[key]);
      }
    }

    if (args.length > 0) {
      url += '?' + args.join('&');
    }

    return url;
  }

  static addUrlParam(hash, key, value) {
    const parsed = this.parseUrlHash(hash);
    parsed.params[key] = value;
    return this.composeUrlHash(parsed.path, parsed.params);
  }

  static removeUrlParam(hash, key) {
    const parsed = this.parseUrlHash(hash);
    delete parsed.params[key];
    return this.composeUrlHash(parsed.path, parsed.params);
  }

  static setUrlSidePanel(hash, sidepanel) {
    const parsed = this.parseUrlHash(hash);
    parsed.path[0] = sidepanel;
    return this.composeUrlHash(parsed.path, parsed.params);
  }

  static setUrlTopic(hash, topic) {
    const parsed = this.parseUrlHash(hash);
    parsed.path[1] = topic;
    delete parsed.params.info;
    return this.composeUrlHash(parsed.path, parsed.params);
  }

}

/***/ }),

/***/ "./src/lib/strformat.js":
/*!******************************!*\
  !*** ./src/lib/strformat.js ***!
  \******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "shortDateFormat": function() { return /* binding */ shortDateFormat; },
/* harmony export */   "secondsToTime": function() { return /* binding */ secondsToTime; },
/* harmony export */   "bytesToHumanSize": function() { return /* binding */ bytesToHumanSize; },
/* harmony export */   "stringHash": function() { return /* binding */ stringHash; }
/* harmony export */ });
function shortDateFormat(then, locale) {
  locale = locale || window.navigator.userLanguage || window.navigator.language;
  const now = new Date();

  if (then.getFullYear() == now.getFullYear()) {
    if (then.getMonth() == now.getMonth() && then.getDate() == now.getDate()) {
      return then.toLocaleTimeString(locale, {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      });
    }

    return then.toLocaleDateString(locale, {
      hour12: false,
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  return then.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}
function secondsToTime(seconds) {
  const min = Math.floor(seconds / 60);
  let sec = seconds % 60;
  sec = sec < 10 ? `0${sec}` : sec;
  return `${min}:${sec}`;
}
function bytesToHumanSize(bytes) {
  if (!bytes || bytes == 0) {
    return '0 Bytes';
  }

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const bucket = Math.min(Math.floor(Math.log2(bytes) / 10) | 0, sizes.length - 1);
  const count = bytes / Math.pow(1024, bucket);
  const round = bucket > 0 ? count < 3 ? 2 : count < 30 ? 1 : 0 : 0;
  return count.toFixed(round) + ' ' + sizes[bucket];
}
function stringHash(value) {
  let hash = 0;
  value = '' + value;

  for (let i = 0; i < value.length; i++) {
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
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "updateFavicon": function() { return /* binding */ updateFavicon; },
/* harmony export */   "theCard": function() { return /* binding */ theCard; },
/* harmony export */   "arrayEqual": function() { return /* binding */ arrayEqual; },
/* harmony export */   "asPhone": function() { return /* binding */ asPhone; },
/* harmony export */   "asEmail": function() { return /* binding */ asEmail; },
/* harmony export */   "isUrlRelative": function() { return /* binding */ isUrlRelative; },
/* harmony export */   "sanitizeUrl": function() { return /* binding */ sanitizeUrl; },
/* harmony export */   "sanitizeImageUrl": function() { return /* binding */ sanitizeImageUrl; },
/* harmony export */   "deliveryMarker": function() { return /* binding */ deliveryMarker; }
/* harmony export */ });
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tinode-sdk */ "tinode-sdk");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_0__);

function updateFavicon(count) {
  const oldIcon = document.getElementById('shortcut-icon');
  const head = document.head || document.getElementsByTagName('head')[0];
  const newIcon = document.createElement('link');
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
function theCard(fn, imageUrl, imageMimeType) {
  let card = null;
  fn = fn && fn.trim();

  if (fn) {
    card = {
      fn: fn
    };
  }

  if (imageUrl) {
    card = card || {};
    let mimeType = imageMimeType;
    const matches = /^data:(image\/[-a-z0-9+.]+)(;base64)?,/i.exec(imageUrl);

    if (matches) {
      mimeType = matches[1];
      card.photo = {
        data: imageUrl.substring(imageUrl.indexOf(',') + 1)
      };
    } else {
      card.photo = {
        ref: imageUrl
      };
    }

    card.photo.type = (mimeType || 'image/jpeg').substring('image/'.length);
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

  for (let i = 0, l = a.length; i < l; i++) {
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
  return url && !/^\s*([a-z][a-z0-9+.-]*:|\/\/)/im.test(url);
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

  const schemes = Array.isArray(allowedSchemes) ? allowedSchemes.join('|') : 'http|https';
  const re = new RegExp('^((' + schemes + '):|//)', 'i');

  if (!re.test(url)) {
    return null;
  }

  return url;
}
function sanitizeImageUrl(url) {
  if (!url) {
    return null;
  }

  const sanitizedUrl = sanitizeUrl(url);

  if (sanitizedUrl) {
    return sanitizedUrl;
  }

  if (/data:image\/[a-z0-9.-]+;base64,/i.test(url.trim())) {
    return url;
  }

  return null;
}
function deliveryMarker(received) {
  switch (received) {
    case (tinode_sdk__WEBPACK_IMPORTED_MODULE_0___default().MESSAGE_STATUS_SENDING):
      return {
        name: 'access_time'
      };

    case (tinode_sdk__WEBPACK_IMPORTED_MODULE_0___default().MESSAGE_STATUS_FAILED):
      return {
        name: 'warning',
        color: 'amber'
      };

    case (tinode_sdk__WEBPACK_IMPORTED_MODULE_0___default().MESSAGE_STATUS_SENT):
      return {
        name: 'done'
      };

    case (tinode_sdk__WEBPACK_IMPORTED_MODULE_0___default().MESSAGE_STATUS_RECEIVED):
      return {
        name: 'done_all'
      };

    case (tinode_sdk__WEBPACK_IMPORTED_MODULE_0___default().MESSAGE_STATUS_READ):
      return {
        name: 'done_all',
        color: 'blue'
      };
  }

  return null;
}

/***/ }),

/***/ "./src/version.js":
/*!************************!*\
  !*** ./src/version.js ***!
  \************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PACKAGE_VERSION": function() { return /* binding */ PACKAGE_VERSION; }
/* harmony export */ });
const PACKAGE_VERSION = "0.17.1";

/***/ }),

/***/ "./src/views/acc-general-view.jsx":
/*!****************************************!*\
  !*** ./src/views/acc-general-view.jsx ***!
  \****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ AccGeneralView; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tinode-sdk */ "tinode-sdk");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _widgets_avatar_upload_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../widgets/avatar-upload.jsx */ "./src/widgets/avatar-upload.jsx");
/* harmony import */ var _widgets_in_place_edit_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../widgets/in-place-edit.jsx */ "./src/widgets/in-place-edit.jsx");
/* harmony import */ var _widgets_tag_manager_jsx__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../widgets/tag-manager.jsx */ "./src/widgets/tag-manager.jsx");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var _lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../lib/blob-helpers.js */ "./src/lib/blob-helpers.js");
/* harmony import */ var _lib_utils_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../lib/utils.js */ "./src/lib/utils.js");









class AccGeneralView extends (react__WEBPACK_IMPORTED_MODULE_0___default().Component) {
  constructor(props) {
    super(props);
    const me = this.props.tinode.getMeTopic();
    this.state = {
      fullName: me.public ? me.public.fn : undefined,
      avatar: (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_7__.makeImageDataUrl)(me.public ? me.public.photo : null),
      tags: me.tags(),
      credentials: me.getCredentials() || [],
      addCredActive: false,
      addCredInvalid: false,
      newCred: '',
      previousOnTags: me.onTagsUpdated
    };
    this.tnNewTags = this.tnNewTags.bind(this);
    this.tnCredsUpdated = this.tnCredsUpdated.bind(this);
    this.handleFullNameUpdate = this.handleFullNameUpdate.bind(this);
    this.handleImageChanged = this.handleImageChanged.bind(this);
    this.handleCredChange = this.handleCredChange.bind(this);
    this.handleCredKeyDown = this.handleCredKeyDown.bind(this);
    this.handleCredEntered = this.handleCredEntered.bind(this);
    this.handleTagsUpdated = this.handleTagsUpdated.bind(this);
  }

  componentDidMount() {
    const me = this.props.tinode.getMeTopic();
    me.onCredsUpdated = this.tnCredsUpdated;
    me.onTagsUpdated = this.tnNewTags;
  }

  componentWillUnmount() {
    const me = this.props.tinode.getMeTopic();
    me.onTagsUpdated = this.state.previousOnTags;
    me.onCredsUpdated = undefined;
  }

  tnNewTags(tags) {
    this.setState({
      tags: tags
    });
  }

  tnCredsUpdated(creds) {
    this.setState({
      credentials: creds || []
    });
  }

  handleFullNameUpdate(fn) {
    fn = fn.trim().substring(0, _config_js__WEBPACK_IMPORTED_MODULE_6__.MAX_TITLE_LENGTH);

    if (fn) {
      this.setState({
        fullName: fn
      });
      this.props.onUpdateAccount(undefined, (0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_8__.theCard)(fn, null));
    }
  }

  handleImageChanged(img) {
    this.setState({
      avatar: img
    });
    this.props.onUpdateAccount(undefined, (0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_8__.theCard)(null, img || (tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default().DEL_CHAR)));
  }

  handleCredChange(e) {
    this.setState({
      newCred: e.target.value,
      addCredInvalid: false
    });
  }

  handleCredKeyDown(e) {
    if (e.keyCode === 27) {
      this.setState({
        newCred: '',
        addCredActive: false
      });
    } else if (e.keyCode === 13) {
      this.handleCredEntered(e);
    }
  }

  handleCredEntered(e) {
    let value = this.state.newCred.trim();

    if (!value) {
      this.setState({
        addCredActive: false,
        addCredInvalid: false
      });
      return;
    }

    let val = (0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_8__.asPhone)(value);
    let method;

    if (val) {
      method = 'tel';
    } else {
      val = (0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_8__.asEmail)(value);

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

  handleTagsUpdated(tags) {
    if ((0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_8__.arrayEqual)(this.state.tags.slice(0), tags.slice(0))) {
      return;
    }

    this.props.onUpdateTags(tags);
  }

  render() {
    const credentials = [];
    this.state.credentials.map(cred => {
      credentials.push(react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        key: cred.meth + ":" + cred.val + ":" + cred.done
      }, cred.meth, ": ", react__WEBPACK_IMPORTED_MODULE_0___default().createElement("tt", null, cred.val), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, " ", !cred.done ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
        href: "#",
        onClick: e => {
          e.preventDefault();
          this.props.onCredConfirm(cred.meth, cred.val);
        }
      }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
        id: "validate_credential_action",
        defaultMessage: [{
          "type": 0,
          "value": "confirm"
        }]
      })) : null, " ", react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
        href: "#",
        onClick: e => {
          e.preventDefault();
          this.props.onCredDelete(cred.meth, cred.val);
        }
      }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
        className: "material-icons gray"
      }, "delete_outline")))));
    });
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "scrollable-panel"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-column"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      className: "small"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_your_name",
      defaultMessage: [{
        "type": 0,
        "value": "Your name"
      }]
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "full_name_prompt",
      defaultMessage: [{
        "type": 0,
        "value": "Full name, e.g. John Doe"
      }]
    }, full_name_placeholder => react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_in_place_edit_jsx__WEBPACK_IMPORTED_MODULE_4__.default, {
      placeholder: full_name_placeholder,
      value: this.state.fullName,
      onFinished: this.handleFullNameUpdate
    })))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_avatar_upload_jsx__WEBPACK_IMPORTED_MODULE_3__.default, {
      avatar: this.state.avatar,
      uid: this.props.myUserId,
      title: this.state.fullName,
      onImageChanged: this.handleImageChanged,
      onError: this.props.onError
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "hr"
    }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "title_tag_manager",
      defaultMessage: [{
        "type": 0,
        "value": "Tags (user discovery)"
      }]
    }, title_tag_manager => react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_tag_manager_jsx__WEBPACK_IMPORTED_MODULE_5__.default, {
      title: title_tag_manager,
      activated: false,
      tags: this.state.tags,
      tinode: this.props.tinode,
      onSubmit: this.handleTagsUpdated
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "hr"
    }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-column"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      className: "small"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_user_contacts",
      defaultMessage: [{
        "type": 0,
        "value": "Contacts:"
      }]
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "quoted"
    }, credentials, this.state.addCredActive ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", {
      type: "text",
      value: this.state.value,
      className: this.state.addCredInvalid ? 'invalid' : null,
      placeholder: "Phone number or email",
      required: "required",
      autoFocus: true,
      onChange: this.handleCredChange,
      onKeyDown: this.handleCredKeyDown,
      onBlur: this.handleCredEntered
    }) : null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      onClick: e => {
        e.preventDefault();
        this.setState({
          addCredActive: true
        });
      }
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "add"), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "button_add_another",
      defaultMessage: [{
        "type": 0,
        "value": "Add another"
      }]
    }))))));
  }

}
;

/***/ }),

/***/ "./src/views/acc-notifications-view.jsx":
/*!**********************************************!*\
  !*** ./src/views/acc-notifications-view.jsx ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ EditAccountView; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _widgets_checkbox_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../widgets/checkbox.jsx */ "./src/widgets/checkbox.jsx");



class EditAccountView extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
    this.handleCheckboxClick = this.handleCheckboxClick.bind(this);
  }

  handleCheckboxClick(what, checked) {
    if (what == 'sound') {
      this.props.onToggleMessageSounds(checked);
    } else if (what == 'alert') {
      this.props.onTogglePushNotifications(checked);
    } else if (what == 'incognito') {
      this.props.onToggleIncognitoMode(checked);
    }
  }

  render() {
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "scrollable-panel"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      htmlFor: "message-sound"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_message_sound",
      defaultMessage: [{
        "type": 0,
        "value": "Message sound:"
      }]
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_checkbox_jsx__WEBPACK_IMPORTED_MODULE_2__.default, {
      name: "sound",
      id: "message-sound",
      checked: this.props.messageSounds,
      onChange: this.handleCheckboxClick
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      htmlFor: "desktop-alerts"
    }, this.props.desktopAlertsEnabled ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_push_notifications",
      defaultMessage: [{
        "type": 0,
        "value": "Notification alerts:"
      }]
    }) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_push_notifications_disabled",
      defaultMessage: [{
        "type": 0,
        "value": "Notification alerts (requires HTTPS):"
      }]
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_checkbox_jsx__WEBPACK_IMPORTED_MODULE_2__.default, {
      name: "alert",
      id: "desktop-alerts",
      checked: this.props.desktopAlerts,
      onChange: this.props.desktopAlertsEnabled ? this.handleCheckboxClick : null
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      htmlFor: "incognito-mode"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_incognito_mode",
      defaultMessage: [{
        "type": 0,
        "value": "Incognito mode:"
      }]
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_checkbox_jsx__WEBPACK_IMPORTED_MODULE_2__.default, {
      name: "incognito",
      id: "incognito-mode",
      checked: this.props.incognitoMode,
      onChange: this.handleCheckboxClick
    })));
  }

}
;

/***/ }),

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
/* harmony import */ var _widgets_in_place_edit_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../widgets/in-place-edit.jsx */ "./src/widgets/in-place-edit.jsx");
/* harmony import */ var _widgets_permissions_editor_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../widgets/permissions-editor.jsx */ "./src/widgets/permissions-editor.jsx");




const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_1__.defineMessages)({
  delete_account: {
    id: "delete_account",
    defaultMessage: [{
      "type": 0,
      "value": "Delete account"
    }]
  },
  delete_account_warning: {
    id: "delete_account_arning",
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
  }

  handlePasswordUpdate(pwd) {
    this.setState({
      password: pwd
    });
    this.props.onUpdateAccount(pwd);
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
    this.props.onUpdateAccount(undefined, undefined, defacs);
    let newState = {
      showPermissionEditorFor: undefined
    };
    newState[this.state.showPermissionEditorFor] = perm;
    this.setState(newState);
  }

  handleDeleteAccount(e) {
    e.preventDefault();
    const {
      formatMessage
    } = this.props.intl;
    this.props.onShowAlert(formatMessage(messages.delete_account), formatMessage(messages.delete_account_warning), () => {
      this.props.onDeleteAccount();
    }, null, true, null);
  }

  render() {
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, this.state.showPermissionEditorFor ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_permissions_editor_jsx__WEBPACK_IMPORTED_MODULE_3__.default, {
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
    }, password_unchanged => react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_in_place_edit_jsx__WEBPACK_IMPORTED_MODULE_2__.default, {
      placeholder: password_unchanged,
      type: "password",
      onFinished: this.handlePasswordUpdate
    })))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
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

/***/ "./src/views/acc-support-view.jsx":
/*!****************************************!*\
  !*** ./src/views/acc-support-view.jsx ***!
  \****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ AccSupportView; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tinode-sdk */ "tinode-sdk");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../config.js */ "./src/config.js");




class AccSupportView extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  render() {
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "scrollable-panel"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-column"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: _config_js__WEBPACK_IMPORTED_MODULE_3__.LINK_CONTACT_US,
      className: "flat-button",
      target: "_blank"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "email"), " \xA0", react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "link_contact_us",
      defaultMessage: [{
        "type": 0,
        "value": "Contact Us"
      }]
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: _config_js__WEBPACK_IMPORTED_MODULE_3__.LINK_TERMS_OF_SERVICE,
      className: "flat-button",
      target: "_blank"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "description"), " \xA0", react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "link_terms_of_service",
      defaultMessage: [{
        "type": 0,
        "value": "Terms of Service"
      }]
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: _config_js__WEBPACK_IMPORTED_MODULE_3__.LINK_PRIVACY_POLICY,
      className: "flat-button",
      target: "_blank"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "policy"), " \xA0", react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "link_privacy_policy",
      defaultMessage: [{
        "type": 0,
        "value": "Privacy Policy"
      }]
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "hr"
    }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-column"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      className: "small"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_client",
      defaultMessage: [{
        "type": 0,
        "value": "Client:"
      }]
    })), _config_js__WEBPACK_IMPORTED_MODULE_3__.APP_NAME), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      className: "small"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_sdk",
      defaultMessage: [{
        "type": 0,
        "value": "SDK:"
      }]
    })), tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default().getLibrary()), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      className: "small"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_server",
      defaultMessage: [{
        "type": 0,
        "value": "Server:"
      }]
    })), this.props.serverVersion), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      className: "small"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_server_address",
      defaultMessage: [{
        "type": 0,
        "value": "Server address:"
      }]
    })), this.props.serverAddress)));
  }

}
;

/***/ }),

/***/ "./src/views/contacts-view.jsx":
/*!*************************************!*\
  !*** ./src/views/contacts-view.jsx ***!
  \*************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ ContactsView; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _widgets_contact_list_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../widgets/contact-list.jsx */ "./src/widgets/contact-list.jsx");
/* harmony import */ var _lib_utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/utils.js */ "./src/lib/utils.js");




const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_1__.defineMessages)({
  archived_contacts_title: {
    id: "archived_contacts",
    defaultMessage: [{
      "type": 0,
      "value": "Archived contacts ("
    }, {
      "type": 1,
      "value": "count"
    }, {
      "type": 0,
      "value": ")"
    }]
  }
});
class ContactsView extends (react__WEBPACK_IMPORTED_MODULE_0___default().Component) {
  constructor(props) {
    super(props);
    this.handleAction = this.handleAction.bind(this);
    this.state = ContactsView.deriveStateFromProps(props);
  }

  static deriveStateFromProps(props) {
    const contacts = [];
    let unreadThreads = 0;
    let archivedCount = 0;
    props.chatList.map(c => {
      const blocked = c.acs && !c.acs.isJoiner();

      if (blocked && props.blocked) {
        contacts.push(c);
      }

      if (blocked || props.blocked) {
        return;
      }

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
    contacts.sort((a, b) => {
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

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.chatList != this.props.chatList || prevProps.archive != this.props.archive || prevProps.blocked != this.props.blocked) {
      const newState = ContactsView.deriveStateFromProps(this.props);
      this.setState(newState);

      if (newState.unreadThreads != prevState.unreadThreads) {
        (0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_3__.updateFavicon)(newState.unreadThreads);
      }
    }
  }

  handleAction(action_ignored) {
    this.props.onShowArchive();
  }

  render() {
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "contacts_not_found",
      defaultMessage: [{
        "type": 0,
        "value": "You have no chats"
      }, {
        "type": 0,
        "value": "<br/>"
      }, {
        "type": 0,
        "value": "¯∖_(ツ)_/¯"
      }]
    }, no_contacts => react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_contact_list_jsx__WEBPACK_IMPORTED_MODULE_2__.default, {
      connected: this.props.connected,
      contacts: this.state.contactList,
      emptyListMessage: no_contacts,
      topicSelected: this.props.topicSelected,
      myUserId: this.props.myUserId,
      showOnline: true,
      showUnread: true,
      onTopicSelected: this.props.onTopicSelected,
      showContextMenu: this.props.showContextMenu,
      onAction: this.handleAction
    }));
  }

}
;

/***/ }),

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
/* harmony import */ var _widgets_avatar_upload_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../widgets/avatar-upload.jsx */ "./src/widgets/avatar-upload.jsx");
/* harmony import */ var _widgets_checkbox_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../widgets/checkbox.jsx */ "./src/widgets/checkbox.jsx");
/* harmony import */ var _widgets_visible_password_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../widgets/visible-password.jsx */ "./src/widgets/visible-password.jsx");
/* harmony import */ var _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../lib/local-storage.js */ "./src/lib/local-storage.js");
/* harmony import */ var _lib_utils_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../lib/utils.js */ "./src/lib/utils.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../config.js */ "./src/config.js");








class CreateAccountView extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
    this.state = {
      login: '',
      password: '',
      email: '',
      fn: '',
      imageDataUrl: null,
      errorCleared: false,
      saveToken: _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_5__.default.getObject('keep-logged-in')
    };
    this.handleLoginChange = this.handleLoginChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleFnChange = this.handleFnChange.bind(this);
    this.handleImageChanged = this.handleImageChanged.bind(this);
    this.handleToggleSaveToken = this.handleToggleSaveToken.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
      email: e.target.value
    });
  }

  handleFnChange(e) {
    this.setState({
      fn: e.target.value
    });
  }

  handleImageChanged(img) {
    this.setState({
      imageDataUrl: img
    });
  }

  handleToggleSaveToken() {
    _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_5__.default.setObject('keep-logged-in', !this.state.saveToken);
    this.setState({
      saveToken: !this.state.saveToken
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({
      errorCleared: false
    });
    this.props.onCreateAccount(this.state.login.trim(), this.state.password.trim(), (0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_6__.theCard)(this.state.fn.trim().substring(0, _config_js__WEBPACK_IMPORTED_MODULE_7__.MAX_TITLE_LENGTH), this.state.imageDataUrl), {
      'meth': 'email',
      'val': this.state.email
    });
  }

  render() {
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
      className: "panel-form-column"
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
    }, password_prompt => react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_visible_password_jsx__WEBPACK_IMPORTED_MODULE_4__.default, {
      placeholder: password_prompt,
      autoComplete: "new-password",
      value: this.state.password,
      onFinished: this.handlePasswordChange,
      required: true
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_avatar_upload_jsx__WEBPACK_IMPORTED_MODULE_2__.default, {
      onImageChanged: this.handleImageChanged,
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
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
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
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_checkbox_jsx__WEBPACK_IMPORTED_MODULE_3__.default, {
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
      type: "submit"
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

/***/ "./src/views/edit-account-view.jsx":
/*!*****************************************!*\
  !*** ./src/views/edit-account-view.jsx ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ EditAccountView; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _widgets_avatar_upload_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../widgets/avatar-upload.jsx */ "./src/widgets/avatar-upload.jsx");
/* harmony import */ var _lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/blob-helpers.js */ "./src/lib/blob-helpers.js");




class EditAccountView extends (react__WEBPACK_IMPORTED_MODULE_0___default().Component) {
  constructor(props) {
    super(props);
    const me = this.props.tinode.getMeTopic();
    this.state = {
      fullName: me.public ? me.public.fn : undefined,
      avatar: (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_3__.makeImageDataUrl)(me.public ? me.public.photo : null)
    };
  }

  render() {
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "scrollable-panel"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-column"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      className: "small"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_your_name",
      defaultMessage: [{
        "type": 0,
        "value": "Your name"
      }]
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "large"
    }, this.state.fullName), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      className: "small"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_user_id",
      defaultMessage: [{
        "type": 0,
        "value": "ID:"
      }]
    })), "\xA0", react__WEBPACK_IMPORTED_MODULE_0___default().createElement("tt", null, this.props.myUserId))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_avatar_upload_jsx__WEBPACK_IMPORTED_MODULE_2__.default, {
      avatar: this.state.avatar,
      readOnly: !this.state.owner,
      uid: this.props.myUserId,
      title: this.state.fullName
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      className: "flat-button",
      onClick: e => {
        e.preventDefault();
        this.props.onBasicNavigate('general');
      }
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "edit"), "\xA0", react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "button_edit",
      defaultMessage: [{
        "type": 0,
        "value": "Edit"
      }]
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "hr"
    }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-column"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      className: "flat-button",
      onClick: e => {
        e.preventDefault();
        this.props.onBasicNavigate('notif');
      }
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "notifications"), "\xA0", react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "sidepanel_title_acc_notifications",
      defaultMessage: [{
        "type": 0,
        "value": "Notifications"
      }]
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      className: "flat-button",
      onClick: e => {
        e.preventDefault();
        this.props.onBasicNavigate('security');
      }
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "security"), "\xA0", react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "sidepanel_title_acc_security",
      defaultMessage: [{
        "type": 0,
        "value": "Security"
      }]
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      className: "flat-button",
      onClick: e => {
        e.preventDefault();
        this.props.onBasicNavigate('support');
      }
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "contact_support"), "\xA0", react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "sidepanel_title_acc_support",
      defaultMessage: [{
        "type": 0,
        "value": "Support"
      }]
    }))));
  }

}
;

/***/ }),

/***/ "./src/views/info-view.jsx":
/*!*********************************!*\
  !*** ./src/views/info-view.jsx ***!
  \*********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

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
















const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_1__.defineMessages)({
  requested: {
    id: "requested_permissions",
    defaultMessage: [{
      "type": 0,
      "value": "Requested"
    }]
  },
  granted: {
    id: "granted_permissions",
    defaultMessage: [{
      "type": 0,
      "value": "Granted"
    }]
  },
  edit_permissions: {
    id: "menu_item_edit_permissions",
    defaultMessage: [{
      "type": 0,
      "value": "Edit permissions"
    }]
  },
  other_user: {
    id: "label_other_user",
    defaultMessage: [{
      "type": 0,
      "value": "Other"
    }]
  },
  clear_messages: {
    id: "action_clear_messages",
    defaultMessage: [{
      "type": 0,
      "value": "Clear Messages"
    }]
  },
  clear_messages_warning: {
    id: "clear_messages_warning",
    defaultMessage: [{
      "type": 0,
      "value": "Are you sure you want to clear all messages? It cannot be undone."
    }]
  },
  delete_messages: {
    id: "action_delete_messages",
    defaultMessage: [{
      "type": 0,
      "value": "Clear Messages for All"
    }]
  },
  delete_messages_warning: {
    id: "delete_messages_warning",
    defaultMessage: [{
      "type": 0,
      "value": "Are you sure you want to delete all messages for everyone? It cannot be undone."
    }]
  },
  leave_chat: {
    id: "action_leave_chat",
    defaultMessage: [{
      "type": 0,
      "value": "Leave Conversation"
    }]
  },
  leave_chat_warning: {
    id: "leave_chat_warning",
    defaultMessage: [{
      "type": 0,
      "value": "Are you sure you want to leave this conversation?"
    }]
  },
  block_contact: {
    id: "action_block_contact",
    defaultMessage: [{
      "type": 0,
      "value": "Block Contact"
    }]
  },
  block_contact_warning: {
    id: "block_contact_warning",
    defaultMessage: [{
      "type": 0,
      "value": "Are you sure you want to block this contact?"
    }]
  },
  report_chat: {
    id: "action_report_chat",
    defaultMessage: [{
      "type": 0,
      "value": "Report Conversation"
    }]
  },
  report_chat_warning: {
    id: "report_chat_warning",
    defaultMessage: [{
      "type": 0,
      "value": "Are you sure you want to block and report this conversation?"
    }]
  }
});

class InfoView extends (react__WEBPACK_IMPORTED_MODULE_0___default().Component) {
  constructor(props) {
    super(props);
    this.state = {
      topic: null,
      owner: false,
      admin: false,
      sharer: false,
      deleter: false,
      muted: false,
      address: null,
      groupTopic: undefined,
      channel: undefined,
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
    this.resetSubs = this.resetSubs.bind(this);
    this.resetDesc = this.resetDesc.bind(this);
    this.onMetaDesc = this.onMetaDesc.bind(this);
    this.onSubsUpdated = this.onSubsUpdated.bind(this);
    this.onTagsUpdated = this.onTagsUpdated.bind(this);
    this.handleFullNameUpdate = this.handleFullNameUpdate.bind(this);
    this.handlePrivateUpdate = this.handlePrivateUpdate.bind(this);
    this.handleImageChanged = this.handleImageChanged.bind(this);
    this.handleMuted = this.handleMuted.bind(this);
    this.handlePermissionsChanged = this.handlePermissionsChanged.bind(this);
    this.handleLaunchPermissionsEditor = this.handleLaunchPermissionsEditor.bind(this);
    this.handleHidePermissionsEditor = this.handleHidePermissionsEditor.bind(this);
    this.handleShowAddMembers = this.handleShowAddMembers.bind(this);
    this.handleHideAddMembers = this.handleHideAddMembers.bind(this);
    this.handleMemberUpdateRequest = this.handleMemberUpdateRequest.bind(this);
    this.handleDeleteMessages = this.handleDeleteMessages.bind(this);
    this.handleLeave = this.handleLeave.bind(this);
    this.handleBlock = this.handleBlock.bind(this);
    this.handleReport = this.handleReport.bind(this);
    this.handleMemberSelected = this.handleMemberSelected.bind(this);
    this.handleMoreInfo = this.handleMoreInfo.bind(this);
    this.handleTagsUpdated = this.handleTagsUpdated.bind(this);
    this.handleContextMenu = this.handleContextMenu.bind(this);
  }

  componentDidUpdate(props) {
    const topic = this.props.tinode.getTopic(props.topic);

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

  componentWillUnmount() {
    const topic = this.props.tinode.getTopic(this.props.topic);

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

  resetSubs(topic, props) {
    const newState = {
      contactList: []
    };

    if (topic.getType() == 'p2p') {
      const user2 = topic.subscriber(props.topic);

      if (user2) {
        newState.modeGiven2 = user2.acs.getGiven();
        newState.modeWant2 = user2.acs.getWant();
      } else {
        newState.modeGiven2 = _config_js__WEBPACK_IMPORTED_MODULE_13__.NO_ACCESS_MODE;
        newState.modeWant2 = _config_js__WEBPACK_IMPORTED_MODULE_13__.NO_ACCESS_MODE;
      }
    } else {
      topic.subscribers(sub => {
        newState.contactList.push(sub);
      }, this);
    }

    this.setState(newState);
  }

  resetDesc(topic, props) {
    const defacs = topic.getDefaultAccess() || {};
    const acs = topic.getAccessMode();
    this.setState({
      owner: acs && acs.isOwner(),
      admin: acs && acs.isAdmin(),
      sharer: acs && acs.isSharer(),
      deleter: acs && acs.isDeleter(),
      muted: acs && acs.isMuted(),
      fullName: topic.public ? topic.public.fn : undefined,
      avatar: (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_14__.makeImageDataUrl)(topic.public ? topic.public.photo : null),
      private: topic.private ? topic.private.comment : null,
      address: topic.name,
      groupTopic: topic.isGroupType(),
      channel: topic.isChannelType(),
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

  onMetaDesc(desc) {
    const topic = this.props.tinode.getTopic(this.props.topic);

    if (!topic) {
      return;
    }

    this.resetDesc(topic, this.props);

    if (this.previousMetaDesc && this.previousMetaDesc != this.onMetaDesc) {
      this.previousMetaDesc(desc);
    }
  }

  onSubsUpdated(subs) {
    const topic = this.props.tinode.getTopic(this.props.topic);

    if (!topic) {
      return;
    }

    this.resetSubs(topic, this.props);

    if (this.previousSubsUpdated && this.previousSubsUpdated != this.onSubsUpdated) {
      this.previousSubsUpdated(subs);
    }
  }

  onTagsUpdated(tags) {
    this.setState({
      tags: tags
    });

    if (this.previousTagsUpdated && this.previousTagsUpdated != this.onTagsUpdated) {
      this.previousTagsUpdated();
    }
  }

  handleFullNameUpdate(fn) {
    fn = fn.trim().substring(0, _config_js__WEBPACK_IMPORTED_MODULE_13__.MAX_TITLE_LENGTH);

    if (this.state.fullName !== fn) {
      this.setState({
        fullName: fn
      });
      this.props.onTopicDescUpdate(this.props.topic, (0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_15__.theCard)(fn, null), null);
    }
  }

  handlePrivateUpdate(comment) {
    comment = comment.trim().substring(0, _config_js__WEBPACK_IMPORTED_MODULE_13__.MAX_TITLE_LENGTH);

    if (this.state.private !== comment) {
      this.setState({
        private: comment
      });
      this.props.onTopicDescUpdate(this.props.topic, null, comment || (tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default().DEL_CHAR));
    }
  }

  handleImageChanged(img) {
    this.setState({
      avatar: img
    });
    this.props.onTopicDescUpdate(this.props.topic, (0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_15__.theCard)(null, img || (tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default().DEL_CHAR)), null);
  }

  handleMuted(ignored, checked) {
    this.setState({
      muted: checked
    });
    this.props.onChangePermissions(this.props.topic, checked ? '-P' : '+P');
  }

  handlePermissionsChanged(perm) {
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

  handleLaunchPermissionsEditor(which, uid) {
    const {
      formatMessage
    } = this.props.intl;
    let toEdit, toCompare, toSkip, titleEdit, titleCompare, userTitle, userAvatar;

    switch (which) {
      case 'mode':
        toEdit = this.state.access;
        break;

      case 'want':
        toEdit = this.state.modeWant;
        toCompare = this.state.modeGiven;

        if (this.state.owner) {
          toSkip = 'O';
        } else {
          toSkip = tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default().AccessMode.encode(tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default().AccessMode.diff('ASDO', this.state.modeGiven));

          if (this.state.channel) {
            toSkip += 'W';
          }
        }

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
          const topic = this.props.tinode.getTopic(this.props.topic);

          if (!topic) {
            return;
          }

          const user = topic.subscriber(uid);

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

  handleHidePermissionsEditor() {
    this.setState({
      showPermissionEditorFor: undefined
    });
  }

  handleShowAddMembers(e) {
    e.preventDefault();
    this.props.onInitFind();
    this.setState({
      showMemberPanel: true
    });
  }

  handleHideAddMembers() {
    this.setState({
      showMemberPanel: false
    });
  }

  handleMemberUpdateRequest(members, added, removed) {
    this.props.onMemberUpdateRequest(this.props.topic, added, removed);
    this.setState({
      showMemberPanel: false
    });
  }

  handleDeleteMessages(e) {
    e.preventDefault();
    const {
      formatMessage
    } = this.props.intl;
    this.props.onShowAlert(formatMessage(this.state.deleter ? messages.delete_messages : messages.clear_messages), formatMessage(this.state.deleter ? messages.delete_messages_warning : messages.clear_messages_warning), () => {
      this.props.onDeleteMessages(this.props.topic);
    }, null, true, null);
  }

  handleLeave(e) {
    e.preventDefault();
    const {
      formatMessage
    } = this.props.intl;
    this.props.onShowAlert(formatMessage(messages.leave_chat), formatMessage(messages.leave_chat_warning), () => {
      this.props.onLeaveTopic(this.props.topic);
    }, null, true, null);
  }

  handleBlock(e) {
    e.preventDefault();
    const {
      formatMessage
    } = this.props.intl;
    this.props.onShowAlert(formatMessage(messages.block_contact), formatMessage(messages.block_contact_warning), () => {
      this.props.onBlockTopic(this.props.topic);
    }, null, true, null);
  }

  handleReport(e) {
    e.preventDefault();
    const {
      formatMessage
    } = this.props.intl;
    this.props.onShowAlert(formatMessage(messages.report_chat), formatMessage(messages.report_chat_warning), () => {
      this.props.onReportTopic(this.props.topic);
    }, null, true, null);
  }

  handleMemberSelected(uid) {
    this.setState({
      selectedContact: uid
    });
  }

  handleMoreInfo(open) {
    this.setState({
      moreInfoExpanded: open
    });
  }

  handleTagsUpdated(tags) {
    if (!(0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_15__.arrayEqual)(this.state.tags.slice(0), tags.slice(0))) {
      this.props.onTopicTagsUpdate(this.props.topic, tags);
    }
  }

  handleContextMenu(params) {
    const {
      formatMessage
    } = this.props.intl;
    const instance = this;
    const topic = this.props.tinode.getTopic(this.props.topic);

    if (!topic) {
      return;
    }

    const user = topic.subscriber(params.topicName);

    if (!user || !user.acs) {
      return;
    }

    const menuItems = [{
      title: formatMessage(messages.edit_permissions),
      handler: function () {
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

  render() {
    const {
      formatMessage
    } = this.props.intl;
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "info-view"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "caption-panel",
      id: "info-caption-panel"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-title",
      id: "info-title"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "title_info",
      defaultMessage: [{
        "type": 0,
        "value": "Info"
      }]
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_menu_cancel_jsx__WEBPACK_IMPORTED_MODULE_9__.default, {
      onCancel: this.props.onCancel
    }))), this.props.displayMobile ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_error_panel_jsx__WEBPACK_IMPORTED_MODULE_6__.default, {
      level: this.props.errorLevel,
      text: this.props.errorText,
      onClearError: this.props.onError
    }) : null, this.state.showMemberPanel ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_group_manager_jsx__WEBPACK_IMPORTED_MODULE_7__.default, {
      members: this.state.contactList,
      requiredMember: this.props.myUserId,
      keepInitialMembers: !this.state.admin && !this.state.owner,
      myUserId: this.props.myUserId,
      contacts: this.props.searchableContacts,
      onCancel: this.handleHideAddMembers,
      onSubmit: this.handleMemberUpdateRequest
    }) : this.state.showPermissionEditorFor ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_permissions_editor_jsx__WEBPACK_IMPORTED_MODULE_11__.default, {
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
    }) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "info-view-content",
      className: "scrollable-panel"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-column"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      className: "small"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_topic_name",
      defaultMessage: [{
        "type": 0,
        "value": "Name"
      }]
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_in_place_edit_jsx__WEBPACK_IMPORTED_MODULE_8__.default, {
      placeholder: this.state.groupTopic ? "Group name" : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", null, "Unknown"),
      readOnly: !this.state.owner,
      value: this.state.fullName,
      required: true,
      onFinished: this.handleFullNameUpdate
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      className: "small"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_private",
      defaultMessage: [{
        "type": 0,
        "value": "Private comment"
      }]
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "private_editing_placeholder",
      defaultMessage: [{
        "type": 0,
        "value": "Visible to you only"
      }]
    }, private_placeholder => react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_in_place_edit_jsx__WEBPACK_IMPORTED_MODULE_8__.default, {
      placeholder: private_placeholder,
      value: this.state.private,
      onFinished: this.handlePrivateUpdate
    })))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_avatar_upload_jsx__WEBPACK_IMPORTED_MODULE_3__.default, {
      avatar: this.state.avatar,
      readOnly: !this.state.owner,
      uid: this.props.topic,
      title: this.state.fullName,
      onImageChanged: this.handleImageChanged,
      onError: this.props.onError
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "hr"
    }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-column"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_muting_topic",
      defaultMessage: [{
        "type": 0,
        "value": "Muted:"
      }]
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_checkbox_jsx__WEBPACK_IMPORTED_MODULE_4__.default, {
      name: "P",
      checked: this.state.muted,
      onChange: this.handleMuted
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "action_more",
      defaultMessage: [{
        "type": 0,
        "value": "More"
      }]
    }, more => react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_more_button_jsx__WEBPACK_IMPORTED_MODULE_10__.default, {
      title: more,
      open: this.state.moreInfoExpanded,
      onToggle: this.handleMoreInfo
    })), this.state.moreInfoExpanded ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-column"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_user_id",
      defaultMessage: [{
        "type": 0,
        "value": "ID:"
      }]
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("tt", null, this.state.address)), this.state.groupTopic ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_your_permissions",
      defaultMessage: [{
        "type": 0,
        "value": "Your permissions:"
      }]
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("tt", {
      className: "clickable",
      onClick: this.handleLaunchPermissionsEditor.bind(this, 'want')
    }, this.state.access)) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      className: "small"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_permissions",
      defaultMessage: [{
        "type": 0,
        "value": "Permissions:"
      }]
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "quoted"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_you",
      defaultMessage: [{
        "type": 0,
        "value": "You:"
      }]
    }), " \xA0", react__WEBPACK_IMPORTED_MODULE_0___default().createElement("tt", {
      className: "clickable",
      onClick: this.handleLaunchPermissionsEditor.bind(this, 'want')
    }, this.state.access)), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, this.state.fullName ? this.state.fullName : formatMessage(messages.other_user), ": \xA0", react__WEBPACK_IMPORTED_MODULE_0___default().createElement("tt", {
      className: "clickable",
      onClick: this.handleLaunchPermissionsEditor.bind(this, 'given')
    }, this.state.modeGiven2)))), this.state.sharer && (this.state.auth || this.state.anon) ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      className: "small"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_default_access",
      defaultMessage: [{
        "type": 0,
        "value": "Default access mode:"
      }]
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "quoted"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, "Auth: ", this.state.admin ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("tt", {
      className: "clickable",
      onClick: this.handleLaunchPermissionsEditor.bind(this, 'auth')
    }, this.state.auth) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("tt", null, this.state.auth)), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, "Anon: ", this.state.admin ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("tt", {
      className: "clickable",
      onClick: this.handleLaunchPermissionsEditor.bind(this, 'anon')
    }, this.state.anon) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("tt", null, this.state.anon)))) : null) : null), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "hr"
    }), this.state.owner ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "title_tag_manager",
      defaultMessage: [{
        "type": 0,
        "value": "Tags (user discovery)"
      }]
    }, tags => react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_tag_manager_jsx__WEBPACK_IMPORTED_MODULE_12__.default, {
      title: tags,
      tags: this.state.tags,
      activated: false,
      tinode: this.props.tinode,
      onSubmit: this.handleTagsUpdated
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "hr"
    })) : null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-column"
    }, !this.state.channel ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      className: "flat-button",
      onClick: this.handleDeleteMessages
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "delete_outline"), " \xA0", formatMessage(this.state.deleter ? messages.delete_messages : messages.clear_messages)) : null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      className: "danger flat-button",
      onClick: this.handleLeave
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "exit_to_app"), " \xA0", formatMessage(messages.leave_chat)), !this.state.groupTopic ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      className: "danger flat-button",
      onClick: this.handleBlock
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "block"), " \xA0", formatMessage(messages.block_contact)) : null, !this.state.owner ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      className: "danger flat-button",
      onClick: this.handleReport
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "report"), " \xA0", formatMessage(messages.report_chat)) : null), this.state.groupTopic && this.state.sharer ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "hr"
    }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-column"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      className: "small"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_group_members",
      defaultMessage: [{
        "type": 0,
        "value": "Group members:"
      }]
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      className: "flat-button",
      onClick: this.handleShowAddMembers
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "person_add"), " \xA0", react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "button_add_members",
      defaultMessage: [{
        "type": 0,
        "value": "Add members"
      }]
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "group_has_no_members",
      defaultMessage: [{
        "type": 0,
        "value": "No members"
      }]
    }, no_members => react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_contact_list_jsx__WEBPACK_IMPORTED_MODULE_5__.default, {
      contacts: this.state.contactList,
      myUserId: this.props.myUserId,
      emptyListMessage: no_members,
      topicSelected: this.state.selectedContact,
      showOnline: false,
      showUnread: false,
      showMode: true,
      noScroll: true,
      onTopicSelected: this.handleMemberSelected,
      showContextMenu: this.state.admin ? this.handleContextMenu : false
    })))) : null));
  }

}

;
/* harmony default export */ __webpack_exports__["default"] = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(InfoView));

/***/ }),

/***/ "./src/views/login-view.jsx":
/*!**********************************!*\
  !*** ./src/views/login-view.jsx ***!
  \**********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ LoginView; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _widgets_checkbox_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../widgets/checkbox.jsx */ "./src/widgets/checkbox.jsx");
/* harmony import */ var _widgets_visible_password_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../widgets/visible-password.jsx */ "./src/widgets/visible-password.jsx");
/* harmony import */ var _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../lib/local-storage.js */ "./src/lib/local-storage.js");





class LoginView extends (react__WEBPACK_IMPORTED_MODULE_0___default().Component) {
  constructor(props) {
    super(props);
    this.state = {
      login: props.login,
      password: '',
      hostName: props.serverAddress,
      saveToken: _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_4__.default.getObject('keep-logged-in')
    };
    this.handleLoginChange = this.handleLoginChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleToggleSaveToken = this.handleToggleSaveToken.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleLoginChange(e) {
    this.setState({
      login: e.target.value
    });
  }

  handlePasswordChange(e) {
    this.setState({
      password: e.target.value
    });
  }

  handleToggleSaveToken() {
    _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_4__.default.setObject('keep-logged-in', !this.state.saveToken);
    this.setState({
      saveToken: !this.state.saveToken
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.onLogin(this.state.login.trim(), this.state.password.trim());
  }

  render() {
    let submitClasses = 'primary';

    if (this.props.disabled) {
      submitClasses += ' disabled';
    }

    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("form", {
      id: "login-form",
      onSubmit: this.handleSubmit
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "login_prompt",
      defaultMessage: [{
        "type": 0,
        "value": "Login"
      }]
    }, login_prompt => react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", {
      type: "text",
      id: "inputLogin",
      placeholder: login_prompt,
      autoComplete: "username",
      autoCorrect: "off",
      autoCapitalize: "none",
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
    }, password_prompt => react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_visible_password_jsx__WEBPACK_IMPORTED_MODULE_3__.default, {
      type: "password",
      id: "inputPassword",
      placeholder: password_prompt,
      autoComplete: "current-password",
      value: this.state.password,
      onChange: this.handlePasswordChange,
      required: true
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_checkbox_jsx__WEBPACK_IMPORTED_MODULE_2__.default, {
      id: "save-token",
      name: "save-token",
      checked: this.state.saveToken,
      onChange: this.handleToggleSaveToken
    }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      htmlFor: "save-token"
    }, "\xA0", react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "stay_logged_in",
      defaultMessage: [{
        "type": 0,
        "value": "Stay logged in"
      }]
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#reset"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "forgot_password_link",
      defaultMessage: [{
        "type": 0,
        "value": "Forgot password?"
      }]
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "dialog-buttons"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
      className: submitClasses,
      type: "submit"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "button_sign_in",
      defaultMessage: [{
        "type": 0,
        "value": "Sign in"
      }]
    }))));
  }

}
;

/***/ }),

/***/ "./src/views/logo-view.jsx":
/*!*********************************!*\
  !*** ./src/views/logo-view.jsx ***!
  \*********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ LogoView; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tinode-sdk */ "tinode-sdk");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../config.js */ "./src/config.js");




class LogoView extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  render() {
    const version = _config_js__WEBPACK_IMPORTED_MODULE_3__.APP_NAME + ' (' + tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default().getLibrary() + ')';
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "dummy-view"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "https://github.com/tinode/chat/"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("img", {
      id: "logo",
      alt: "logo",
      src: "img/logo.svg"
    }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h2", null, "Tinode Web")), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_client",
      defaultMessage: [{
        "type": 0,
        "value": "Client:"
      }]
    }), " ", version), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_server",
      defaultMessage: [{
        "type": 0,
        "value": "Server:"
      }]
    }), " ", this.props.serverVersion, " (", this.props.serverAddress, ")")));
  }

}
;

/***/ }),

/***/ "./src/views/messages-view.jsx":
/*!*************************************!*\
  !*** ./src/views/messages-view.jsx ***!
  \*************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tinode-sdk */ "tinode-sdk");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _widgets_chat_message_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../widgets/chat-message.jsx */ "./src/widgets/chat-message.jsx");
/* harmony import */ var _widgets_doc_preview_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../widgets/doc-preview.jsx */ "./src/widgets/doc-preview.jsx");
/* harmony import */ var _widgets_error_panel_jsx__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../widgets/error-panel.jsx */ "./src/widgets/error-panel.jsx");
/* harmony import */ var _widgets_group_subs_jsx__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../widgets/group-subs.jsx */ "./src/widgets/group-subs.jsx");
/* harmony import */ var _widgets_image_preview_jsx__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../widgets/image-preview.jsx */ "./src/widgets/image-preview.jsx");
/* harmony import */ var _widgets_invitation_jsx__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../widgets/invitation.jsx */ "./src/widgets/invitation.jsx");
/* harmony import */ var _widgets_letter_tile_jsx__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../widgets/letter-tile.jsx */ "./src/widgets/letter-tile.jsx");
/* harmony import */ var _widgets_load_spinner_jsx__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../widgets/load-spinner.jsx */ "./src/widgets/load-spinner.jsx");
/* harmony import */ var _logo_view_jsx__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./logo-view.jsx */ "./src/views/logo-view.jsx");
/* harmony import */ var _widgets_send_message_jsx__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../widgets/send-message.jsx */ "./src/widgets/send-message.jsx");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var _lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../lib/blob-helpers.js */ "./src/lib/blob-helpers.js");
/* harmony import */ var _lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../lib/navigation.js */ "./src/lib/navigation.js");
/* harmony import */ var _lib_strformat_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../lib/strformat.js */ "./src/lib/strformat.js");



const Drafty = (tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default().Drafty);














const NOTIFICATION_EXEC_INTERVAL = 300;
const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_1__.defineMessages)({
  online_now: {
    id: "online_now",
    defaultMessage: [{
      "type": 0,
      "value": "online now"
    }]
  },
  last_seen: {
    id: "last_seen_timestamp",
    defaultMessage: [{
      "type": 0,
      "value": "Last seen"
    }]
  },
  not_found: {
    id: "title_not_found",
    defaultMessage: [{
      "type": 0,
      "value": "Not found"
    }]
  },
  channel: {
    id: "channel",
    defaultMessage: [{
      "type": 0,
      "value": "channel"
    }]
  },
  file_attachment_too_large: {
    id: "file_attachment_too_large",
    defaultMessage: [{
      "type": 0,
      "value": "The file size "
    }, {
      "type": 1,
      "value": "size"
    }, {
      "type": 0,
      "value": " exceeds the "
    }, {
      "type": 1,
      "value": "limit"
    }, {
      "type": 0,
      "value": " limit."
    }]
  }
});

function isUnconfirmed(acs) {
  if (acs) {
    const ex = acs.getExcessive() || '';
    return acs.isJoiner('given') && (ex.includes('R') || ex.includes('W'));
  }

  return false;
}

function isPeerRestricted(acs) {
  if (acs) {
    const ms = acs.getMissing() || '';
    return acs.isJoiner('want') && (ms.includes('R') || ms.includes('W'));
  }

  return false;
}

class MessagesView extends (react__WEBPACK_IMPORTED_MODULE_0___default().Component) {
  constructor(props) {
    super(props);
    this.state = MessagesView.getDerivedStateFromProps(props, {});
    this.leave = this.leave.bind(this);
    this.sendImageAttachment = this.sendImageAttachment.bind(this);
    this.sendFileAttachment = this.sendFileAttachment.bind(this);
    this.sendKeyPress = this.sendKeyPress.bind(this);
    this.handleScrollReference = this.handleScrollReference.bind(this);
    this.handleScrollEvent = this.handleScrollEvent.bind(this);
    this.handleDescChange = this.handleDescChange.bind(this);
    this.handleSubsUpdated = this.handleSubsUpdated.bind(this);
    this.handleNewMessage = this.handleNewMessage.bind(this);
    this.handleAllMessagesReceived = this.handleAllMessagesReceived.bind(this);
    this.handleInfoReceipt = this.handleInfoReceipt.bind(this);
    this.handleImagePostview = this.handleImagePostview.bind(this);
    this.handleClosePreview = this.handleClosePreview.bind(this);
    this.handleFormResponse = this.handleFormResponse.bind(this);
    this.handleContextClick = this.handleContextClick.bind(this);
    this.handleShowContextMenuMessage = this.handleShowContextMenuMessage.bind(this);
    this.handleNewChatAcceptance = this.handleNewChatAcceptance.bind(this);
    this.handleEnablePeer = this.handleEnablePeer.bind(this);
    this.handleAttachFile = this.handleAttachFile.bind(this);
    this.handleAttachImage = this.handleAttachImage.bind(this);
    this.handleCancelUpload = this.handleCancelUpload.bind(this);
    this.postReadNotification = this.postReadNotification.bind(this);
    this.clearNotificationQueue = this.clearNotificationQueue.bind(this);
    this.readNotificationQueue = [];
    this.readNotificationTimer = null;
  }

  componentDidMount() {
    if (this.messagesScroller) {
      this.messagesScroller.addEventListener('scroll', this.handleScrollEvent);
    }
  }

  componentWillUnmount() {
    if (this.messagesScroller) {
      this.messagesScroller.removeEventListener('scroll', this.handleScrollEvent);
    }

    this.clearNotificationQueue();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.messagesScroller) {
      if (prevState.topic != this.state.topic || prevState.messages.length != this.state.messages.length) {
        this.messagesScroller.scrollTop = this.messagesScroller.scrollHeight - this.state.scrollPosition;
      } else if (prevProps.viewportHeight > this.props.viewportHeight) {
        this.messagesScroller.scrollTop += prevProps.viewportHeight - this.props.viewportHeight;
      }
    }

    const topic = this.props.tinode ? this.props.tinode.getTopic(this.state.topic) : undefined;

    if (this.state.topic != prevState.topic) {
      if (prevState.topic && !tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default().isNewGroupTopicName(prevState.topic)) {
        this.leave(prevState.topic);
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

    if (!this.props.applicationVisible) {
      this.clearNotificationQueue();
    } else {
      this.postReadNotification(0);
    }

    if (topic && !topic.isSubscribed() && this.props.ready && (this.state.topic != prevState.topic || !prevProps.ready)) {
      const newTopic = this.props.newTopicParams && this.props.newTopicParams._topicName == this.props.topic;
      let getQuery = topic.startMetaQuery().withLaterDesc().withLaterSub();

      if (this.state.isReader || newTopic) {
        getQuery = getQuery.withLaterData(_config_js__WEBPACK_IMPORTED_MODULE_13__.MESSAGES_PAGE);

        if (this.state.isReader) {
          getQuery = getQuery.withLaterDel();
        }

        this.setState({
          fetchingMessages: true
        });
      }

      const setQuery = newTopic ? this.props.newTopicParams : undefined;
      topic.subscribe(getQuery.build(), setQuery).then(ctrl => {
        if (ctrl.code == 303) {
          _lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__.default.navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__.default.setUrlTopic('', ctrl.params.topic));
          return;
        }

        if (this.state.topic != ctrl.topic) {
          this.setState({
            topic: ctrl.topic
          });
        }

        this.props.onNewTopicCreated(this.props.topic, ctrl.topic);
        topic.queuedMessages(pub => {
          if (!pub._sending && topic.isSubscribed()) {
            topic.publishMessage(pub);
          }
        });
      }).catch(err => {
        console.log("Failed subscription to", this.state.topic);
        this.props.onError(err.message, 'err');
        const blankState = MessagesView.getDerivedStateFromProps({}, {});
        blankState.title = this.props.intl.formatMessage(messages.not_found);
        this.setState(blankState);
      });
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let nextState = {};

    if (!nextProps.topic) {
      nextState = {
        messages: [],
        onlineSubs: [],
        topic: null,
        title: '',
        avatar: null,
        docPreview: null,
        imagePreview: null,
        imagePostview: null,
        typingIndicator: false,
        scrollPosition: 0,
        fetchingMessages: false,
        peerMessagingDisabled: false,
        channel: false
      };
    } else if (nextProps.topic != prevState.topic) {
      const topic = nextProps.tinode.getTopic(nextProps.topic);
      nextState = {
        topic: nextProps.topic,
        docPreview: null,
        imagePreview: null,
        imagePostview: null,
        typingIndicator: false,
        scrollPosition: 0,
        fetchingMessages: false
      };

      if (topic) {
        const msgs = [];
        const subs = [];

        if (nextProps.connected) {
          topic.subscribers(sub => {
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
            avatar: (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_14__.makeImageDataUrl)(topic.public.photo)
          });
        } else {
          Object.assign(nextState, {
            title: '',
            avatar: null
          });
        }

        const peer = topic.p2pPeerDesc();

        if (peer) {
          Object.assign(nextState, {
            peerMessagingDisabled: isPeerRestricted(peer.acs)
          });
        } else if (prevState.peerMessagingDisabled) {
          Object.assign(nextState, {
            peerMessagingDisabled: false
          });
        }

        Object.assign(nextState, {
          channel: topic.isChannelType()
        });
      } else {
        Object.assign(nextState, {
          messages: [],
          onlineSubs: [],
          title: '',
          avatar: null,
          peerMessagingDisabled: false,
          channel: false
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

      if (nextProps.acs.isSharer() != prevState.isSharer) {
        nextState.isSharer = !prevState.isSharer;
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

      if (prevState.isSharer) {
        nextState.isSharer = false;
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

  leave(oldTopicName) {
    if (!oldTopicName || !this.props.tinode.isTopicCached(oldTopicName)) {
      return;
    }

    const oldTopic = this.props.tinode.getTopic(oldTopicName);

    if (oldTopic && oldTopic.isSubscribed()) {
      oldTopic.leave(false).catch(() => {}).finally(() => {
        this.setState({
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

  handleScrollReference(node) {
    if (node) {
      node.addEventListener('scroll', this.handleScrollEvent);
      this.messagesScroller = node;
      this.messagesScroller.scrollTop = this.messagesScroller.scrollHeight - this.state.scrollPosition;
    }
  }

  handleScrollEvent(event) {
    this.setState({
      scrollPosition: event.target.scrollHeight - event.target.scrollTop
    });

    if (event.target.scrollTop <= 0) {
      this.setState((prevState, props) => {
        const newState = {};

        if (!prevState.fetchingMessages) {
          const topic = this.props.tinode.getTopic(this.state.topic);

          if (topic && topic.isSubscribed() && topic.msgHasMoreMessages()) {
            newState.fetchingMessages = true;
            topic.getMessagesPage(_config_js__WEBPACK_IMPORTED_MODULE_13__.MESSAGES_PAGE).catch(err => {
              this.setState({
                fetchingMessages: false
              });
              this.props.onError(err.message, 'err');
            });
          }
        }

        return newState;
      });
    }
  }

  handleDescChange(desc) {
    if (desc.public) {
      this.setState({
        title: desc.public.fn,
        avatar: (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_14__.makeImageDataUrl)(desc.public.photo)
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

  postReadNotification(seq) {
    if (!this.props.applicationVisible) {
      return;
    }

    if (!this.readNotificationTimer) {
      this.readNotificationTimer = setInterval(() => {
        if (this.readNotificationQueue.length == 0) {
          clearInterval(this.readNotificationTimer);
          this.readNotificationTimer = null;
          return;
        }

        let seq = -1;

        while (this.readNotificationQueue.length > 0) {
          const n = this.readNotificationQueue[0];

          if (n.topicName != this.state.topic) {
            this.readNotificationQueue.shift();
            continue;
          }

          const now = new Date();

          if (n.sendAt <= now) {
            this.readNotificationQueue.shift();
            seq = Math.max(seq, n.seq);
          } else {
            break;
          }
        }

        if (seq >= 0) {
          const topic = this.props.tinode.getTopic(this.state.topic);

          if (topic) {
            topic.noteRead(seq);
          }
        }
      }, NOTIFICATION_EXEC_INTERVAL);
    }

    const now = new Date();
    this.readNotificationQueue.push({
      topicName: this.state.topic,
      seq: seq,
      sendAt: now.setMilliseconds(now.getMilliseconds() + _config_js__WEBPACK_IMPORTED_MODULE_13__.READ_DELAY)
    });
  }

  clearNotificationQueue() {
    this.readNotificationQueue = [];

    if (this.readNotificationTimer) {
      clearInterval(this.readNotificationTimer);
      this.readNotificationTimer = null;
    }
  }

  handleSubsUpdated() {
    if (this.state.topic) {
      const subs = [];
      const topic = this.props.tinode.getTopic(this.state.topic);
      topic.subscribers(sub => {
        if (sub.online && sub.user != this.props.myUserId) {
          subs.push(sub);
        }
      });
      const newState = {
        onlineSubs: subs
      };
      const peer = topic.p2pPeerDesc();

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

  handleNewMessage(msg) {
    const topic = this.props.tinode.getTopic(this.state.topic);
    const newState = {
      messages: []
    };
    topic.messages(m => {
      if (!m.deleted) {
        newState.messages.push(m);
      }
    });

    if (msg && !msg.deleted) {
      if (topic.isNewMessage(msg.seq)) {
        newState.scrollPosition = 0;
      }

      const status = topic.msgStatus(msg, true);

      if (status >= (tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default().MESSAGE_STATUS_SENT) && msg.from != this.props.myUserId) {
        this.postReadNotification(msg.seq);
      }

      this.props.onData(msg);
    }

    this.setState(newState);
  }

  handleAllMessagesReceived(count) {
    this.setState({
      fetchingMessages: false
    });

    if (count > 0) {
      this.postReadNotification(0);
    }
  }

  handleInfoReceipt(info) {
    switch (info.what) {
      case 'kp':
        {
          clearTimeout(this.keyPressTimer);
          var instance = this;
          this.keyPressTimer = setTimeout(function () {
            instance.setState({
              typingIndicator: false
            });
          }, _config_js__WEBPACK_IMPORTED_MODULE_13__.KEYPRESS_DELAY + 1000);

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

  handleImagePostview(content) {
    this.setState({
      imagePostview: content
    });
  }

  handleClosePreview() {
    if (this.state.imagePreview && this.state.imagePreview.url) {
      URL.revokeObjectURL(this.state.imagePreview.url);
    }

    this.setState({
      imagePostview: null,
      imagePreview: null,
      docPreview: null
    });
  }

  handleFormResponse(action, text, data) {
    if (action == 'pub') {
      this.props.sendMessage(Drafty.attachJSON(Drafty.parse(text), data));
    } else if (action == 'url') {
      const url = new URL(data.ref);
      const params = url.searchParams;

      for (let key in data.resp) {
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

  handleContextClick(e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.showContextMenu({
      topicName: this.state.topic,
      y: e.pageY,
      x: e.pageX
    });
  }

  handleShowContextMenuMessage(params, messageSpecificMenuItems) {
    params.topicName = this.state.topic;
    const menuItems = messageSpecificMenuItems || [];
    const topic = this.props.tinode.getTopic(params.topicName);

    if (topic) {
      if (!topic.isChannelType()) {
        menuItems.push('message_delete');
      }

      const acs = topic.getAccessMode();

      if (acs && acs.isDeleter()) {
        menuItems.push('message_delete_hard');
      }
    }

    this.props.showContextMenu(params, menuItems);
  }

  handleNewChatAcceptance(action) {
    this.props.onNewChat(this.state.topic, action);
  }

  handleEnablePeer(e) {
    e.preventDefault();
    this.props.onChangePermissions(this.state.topic, _config_js__WEBPACK_IMPORTED_MODULE_13__.DEFAULT_P2P_ACCESS_MODE, this.state.topic);
  }

  sendKeyPress() {
    const topic = this.props.tinode.getTopic(this.state.topic);

    if (topic.isSubscribed()) {
      topic.noteKeyPress();
    }
  }

  sendFileAttachment(file) {
    const maxInbandAttachmentSize = this.props.tinode.getServerLimit('maxMessageSize', _config_js__WEBPACK_IMPORTED_MODULE_13__.MAX_INBAND_ATTACHMENT_SIZE) * 0.75 - 1024 | 0;

    if (file.size > maxInbandAttachmentSize) {
      const uploader = this.props.tinode.getLargeFileHelper();

      if (!uploader) {
        this.props.onError(this.props.intl.formatMessage(messages.cannot_initiate_upload));
        return;
      }

      const uploadCompletionPromise = uploader.upload(file);
      const msg = Drafty.attachFile(null, {
        mime: file.type,
        filename: file.name,
        size: file.size,
        urlPromise: uploadCompletionPromise
      });
      this.props.sendMessage(msg, uploadCompletionPromise, uploader);
    } else {
      (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_14__.fileToBase64)(file, (mime, bits, fname) => {
        this.props.sendMessage(Drafty.attachFile(null, {
          mime: mime,
          data: bits,
          filename: fname
        }));
      }, this.props.onError);
    }
  }

  handleAttachFile(file) {
    const maxExternAttachmentSize = this.props.tinode.getServerLimit('maxFileUploadSize', _config_js__WEBPACK_IMPORTED_MODULE_13__.MAX_EXTERN_ATTACHMENT_SIZE);

    if (file.size > maxExternAttachmentSize) {
      this.props.onError(this.props.intl.formatMessage(messages.file_attachment_too_large, {
        size: (0,_lib_strformat_js__WEBPACK_IMPORTED_MODULE_16__.bytesToHumanSize)(file.size),
        limit: (0,_lib_strformat_js__WEBPACK_IMPORTED_MODULE_16__.bytesToHumanSize)(maxExternAttachmentSize)
      }), 'err');
    } else {
      this.setState({
        docPreview: {
          file: file,
          filename: file.name,
          size: file.size,
          type: file.type
        }
      });
    }
  }

  sendImageAttachment(caption, blob) {
    const mime = this.state.imagePreview.type;
    const width = this.state.imagePreview.width;
    const height = this.state.imagePreview.height;
    const fname = this.state.imagePreview.filename;
    const maxInbandAttachmentSize = this.props.tinode.getServerLimit('maxMessageSize', _config_js__WEBPACK_IMPORTED_MODULE_13__.MAX_INBAND_ATTACHMENT_SIZE) * 0.75 - 1024 | 0;

    if (blob.size > maxInbandAttachmentSize) {
      const uploader = this.props.tinode.getLargeFileHelper();

      if (!uploader) {
        this.props.onError(this.props.intl.formatMessage(messages.cannot_initiate_upload));
        return;
      }

      const uploadCompletionPromise = uploader.upload(blob);
      (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_14__.imageScaled)(blob, _config_js__WEBPACK_IMPORTED_MODULE_13__.IMAGE_PREVIEW_DIM, _config_js__WEBPACK_IMPORTED_MODULE_13__.IMAGE_PREVIEW_DIM, -1, false, tinyBlob => {
        (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_14__.blobToBase64)(tinyBlob, (blobMime, tinyBits64) => {
          let msg = Drafty.insertImage(null, 0, {
            mime: mime,
            _tempPreview: tinyBits64,
            width: width,
            height: height,
            filename: fname,
            size: blob.size,
            urlPromise: uploadCompletionPromise
          });

          if (caption) {
            msg = Drafty.appendLineBreak(msg);
            msg = Drafty.append(msg, Drafty.init(caption));
          }

          this.props.sendMessage(msg, uploadCompletionPromise, uploader);
        });
      }, err => {
        this.props.onError(err, 'err');
      });
      return;
    }

    (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_14__.blobToBase64)(blob, (blobMime, bits64) => {
      let msg = Drafty.insertImage(null, 0, {
        mime: blobMime,
        preview: bits64,
        width: width,
        height: height,
        filename: fname,
        size: blob.size
      });

      if (caption) {
        msg = Drafty.appendLineBreak(msg);
        msg = Drafty.append(msg, Drafty.init(caption));
      }

      this.props.sendMessage(msg);
    });
  }

  handleAttachImage(file) {
    const maxExternAttachmentSize = this.props.tinode.getServerLimit('maxFileUploadSize', _config_js__WEBPACK_IMPORTED_MODULE_13__.MAX_EXTERN_ATTACHMENT_SIZE);
    (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_14__.imageScaled)(file, _config_js__WEBPACK_IMPORTED_MODULE_13__.MAX_IMAGE_DIM, _config_js__WEBPACK_IMPORTED_MODULE_13__.MAX_IMAGE_DIM, maxExternAttachmentSize, false, (blob, mime, width, height, fname) => {
      this.setState({
        imagePreview: {
          url: URL.createObjectURL(blob),
          blob: blob,
          filename: fname,
          width: width,
          height: height,
          size: blob.size,
          type: mime
        }
      });
    }, err => {
      this.props.onError(err, 'err');
    });
  }

  handleCancelUpload(seq, uploader) {
    const found = this.state.messages.find(msg => msg.seq == seq);

    if (found) {
      found._cancelled = true;
    }

    uploader.cancel();
  }

  render() {
    const {
      formatMessage
    } = this.props.intl;
    let component;

    if (this.props.hideSelf) {
      component = null;
    } else if (!this.state.topic) {
      component = react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_logo_view_jsx__WEBPACK_IMPORTED_MODULE_11__.default, {
        serverVersion: this.props.serverVersion,
        serverAddress: this.props.serverAddress
      });
    } else {
      let component2;

      if (this.state.imagePreview) {
        component2 = react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_image_preview_jsx__WEBPACK_IMPORTED_MODULE_7__.default, {
          content: this.state.imagePreview,
          onClose: this.handleClosePreview,
          onSendMessage: this.sendImageAttachment
        });
      } else if (this.state.imagePostview) {
        component2 = react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_image_preview_jsx__WEBPACK_IMPORTED_MODULE_7__.default, {
          content: this.state.imagePostview,
          onClose: this.handleClosePreview
        });
      } else if (this.state.docPreview) {
        component2 = react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_doc_preview_jsx__WEBPACK_IMPORTED_MODULE_4__.default, {
          content: this.state.docPreview,
          onClose: this.handleClosePreview,
          onSendMessage: this.sendFileAttachment
        });
      } else {
        const topic = this.props.tinode.getTopic(this.state.topic);
        const isChannel = topic.isChannelType();
        const groupTopic = topic.isGroupType() && !isChannel;
        let messageNodes = [];
        let previousFrom = null;
        let chatBoxClass = null;

        for (let i = 0; i < this.state.messages.length; i++) {
          let msg = this.state.messages[i];
          let nextFrom = null;

          if (i + 1 < this.state.messages.length) {
            nextFrom = this.state.messages[i + 1].from || 'chan';
          }

          let sequence = 'single';
          let thisFrom = msg.from || 'chan';

          if (thisFrom == previousFrom) {
            if (thisFrom == nextFrom) {
              sequence = 'middle';
            } else {
              sequence = 'last';
            }
          } else if (thisFrom == nextFrom) {
            sequence = 'first';
          }

          previousFrom = thisFrom;
          const isReply = !(thisFrom == this.props.myUserId);
          const deliveryStatus = topic.msgStatus(msg, true);
          let userName, userAvatar, userFrom;

          if (groupTopic) {
            const user = topic.userDesc(thisFrom);

            if (user && user.public) {
              userName = user.public.fn;
              userAvatar = (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_14__.makeImageDataUrl)(user.public.photo);
            }

            userFrom = thisFrom;
            chatBoxClass = 'chat-box group';
          } else {
            chatBoxClass = 'chat-box';
          }

          messageNodes.push(react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_chat_message_jsx__WEBPACK_IMPORTED_MODULE_3__.default, {
            tinode: this.props.tinode,
            content: msg.content,
            deleted: msg.hi,
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
            showContextMenu: this.state.channel ? false : this.handleShowContextMenuMessage,
            onImagePreview: this.handleImagePostview,
            onFormResponse: this.handleFormResponse,
            onError: this.props.onError,
            onCancelUpload: this.handleCancelUpload,
            key: msg.seq
          }));
        }

        let lastSeen = null;

        if (isChannel) {
          lastSeen = formatMessage(messages.channel);
        } else {
          const cont = this.props.tinode.getMeTopic().getContact(this.state.topic);

          if (cont && tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default().isP2PTopicName(cont.topic)) {
            if (cont.online) {
              lastSeen = formatMessage(messages.online_now);
            } else if (cont.seen) {
              lastSeen = formatMessage(messages.last_seen) + ": " + (0,_lib_strformat_js__WEBPACK_IMPORTED_MODULE_16__.shortDateFormat)(cont.seen.when, this.props.intl.locale);
            }
          }
        }

        const avatar = this.state.avatar || true;
        const online = this.props.online ? 'online' + (this.state.typingIndicator ? ' typing' : '') : 'offline';
        component2 = react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
          id: "topic-caption-panel",
          className: "caption-panel"
        }, this.props.displayMobile ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
          href: "#",
          id: "hide-message-view",
          onClick: e => {
            e.preventDefault();
            this.props.onHideMessagesView();
          }
        }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
          className: "material-icons"
        }, "arrow_back")) : null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
          className: "avatar-box"
        }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_letter_tile_jsx__WEBPACK_IMPORTED_MODULE_9__.default, {
          avatar: avatar,
          topic: this.state.topic,
          title: this.state.title
        }), !isChannel ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
          className: online
        }) : null), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
          id: "topic-title-group"
        }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
          id: "topic-title",
          className: "panel-title"
        }, this.state.title || react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
          id: "unnamed_topic",
          defaultMessage: [{
            "type": 0,
            "value": "Unnamed"
          }]
        }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
          id: "topic-last-seen"
        }, lastSeen)), groupTopic ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_group_subs_jsx__WEBPACK_IMPORTED_MODULE_6__.default, {
          subscribers: this.state.onlineSubs
        }) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
          id: "topic-users"
        }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
          href: "#",
          onClick: this.handleContextClick
        }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
          className: "material-icons"
        }, "more_vert")))), this.props.displayMobile ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_error_panel_jsx__WEBPACK_IMPORTED_MODULE_5__.default, {
          level: this.props.errorLevel,
          text: this.props.errorText,
          onClearError: this.props.onError
        }) : null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_load_spinner_jsx__WEBPACK_IMPORTED_MODULE_10__.default, {
          show: this.state.fetchingMessages
        }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
          id: "messages-container"
        }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
          id: "messages-panel",
          ref: this.handleScrollReference
        }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("ul", {
          id: "scroller",
          className: chatBoxClass
        }, messageNodes)), !this.state.isReader ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
          id: "write-only-background"
        }, this.state.readingBlocked ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
          id: "write-only-note"
        }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
          id: "messages_not_readable",
          defaultMessage: [{
            "type": 0,
            "value": "no access to messages"
          }]
        })) : null) : null), this.state.peerMessagingDisabled && !this.state.unconfirmed ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
          id: "peer-messaging-disabled-note"
        }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
          className: "material-icons secondary"
        }, "block"), " ", react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
          id: "peers_messaging_disabled",
          defaultMessage: [{
            "type": 0,
            "value": "Peer's messaging is disabled."
          }]
        }), " ", react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
          href: "#",
          onClick: this.handleEnablePeer
        }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
          id: "enable_peers_messaging",
          defaultMessage: [{
            "type": 0,
            "value": "Enable"
          }]
        })), ".") : null, this.state.unconfirmed ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_invitation_jsx__WEBPACK_IMPORTED_MODULE_8__.default, {
          onAction: this.handleNewChatAcceptance
        }) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_send_message_jsx__WEBPACK_IMPORTED_MODULE_12__.default, {
          disabled: !this.state.isWriter,
          onSendMessage: this.props.sendMessage,
          onKeyPress: this.sendKeyPress,
          onAttachFile: this.handleAttachFile,
          onAttachImage: this.handleAttachImage,
          onError: this.props.onError
        }));
      }

      component = react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        id: "topic-view"
      }, component2);
    }

    return component;
  }

}

;
/* harmony default export */ __webpack_exports__["default"] = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(MessagesView));

/***/ }),

/***/ "./src/views/new-topic-view.jsx":
/*!**************************************!*\
  !*** ./src/views/new-topic-view.jsx ***!
  \**************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

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









const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_1__.defineMessages)({
  search_for_contacts: {
    id: "search_for_contacts",
    defaultMessage: [{
      "type": 0,
      "value": "Use search to find contacts"
    }]
  },
  search_no_results: {
    id: "search_no_results",
    defaultMessage: [{
      "type": 0,
      "value": "Search returned no results"
    }]
  }
});

class NewTopicView extends (react__WEBPACK_IMPORTED_MODULE_0___default().Component) {
  constructor(props) {
    super(props);
    this.state = {
      tabSelected: 'p2p',
      searchQuery: null
    };
    this.handleTabClick = this.handleTabClick.bind(this);
    this.handleSearchContacts = this.handleSearchContacts.bind(this);
    this.handleContactSelected = this.handleContactSelected.bind(this);
    this.handleNewGroupSubmit = this.handleNewGroupSubmit.bind(this);
    this.handleGroupByID = this.handleGroupByID.bind(this);
  }

  componentDidMount() {
    this.props.onInitFind();
  }

  handleTabClick(e) {
    e.preventDefault();
    _lib_navigation_js__WEBPACK_IMPORTED_MODULE_7__.default.navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_7__.default.addUrlParam(window.location.hash, 'tab', e.currentTarget.dataset.id));
    this.setState({
      tabSelected: e.currentTarget.dataset.id
    });
  }

  handleSearchContacts(query) {
    this.props.onSearchContacts(query);
    this.setState({
      searchQuery: tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default().isNullValue(query) ? null : query
    });
  }

  handleContactSelected(sel) {
    if (this.state.tabSelected === 'p2p') {
      _lib_navigation_js__WEBPACK_IMPORTED_MODULE_7__.default.navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_7__.default.removeUrlParam(window.location.hash, 'tab'));
      this.props.onCreateTopic(sel);
    }
  }

  handleNewGroupSubmit(name, dataUrl, priv, tags, isChannel) {
    _lib_navigation_js__WEBPACK_IMPORTED_MODULE_7__.default.navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_7__.default.removeUrlParam(window.location.hash, 'tab'));
    this.props.onCreateTopic(undefined, (0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_8__.theCard)(name, dataUrl), priv, tags, isChannel);
  }

  handleGroupByID(topicName) {
    _lib_navigation_js__WEBPACK_IMPORTED_MODULE_7__.default.navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_7__.default.removeUrlParam(window.location.hash, 'tab'));
    this.props.onCreateTopic(topicName);
  }

  render() {
    const {
      formatMessage
    } = this.props.intl;
    const no_contacts_placeholder = formatMessage(this.state.searchQuery ? messages.search_no_results : messages.search_for_contacts);
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "flex-column"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("ul", {
      className: "tabbar"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("li", {
      className: this.state.tabSelected === "p2p" ? "active" : null
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      "data-id": "p2p",
      onClick: this.handleTabClick
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "tabtitle_find_user",
      defaultMessage: [{
        "type": 0,
        "value": "find"
      }]
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("li", {
      className: this.state.tabSelected === "grp" ? "active" : null
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      "data-id": "grp",
      onClick: this.handleTabClick
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "tabtitle_new_group",
      defaultMessage: [{
        "type": 0,
        "value": "new group"
      }]
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("li", {
      className: this.state.tabSelected === "byid" ? "active" : null
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      "data-id": "byid",
      onClick: this.handleTabClick
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "tabtitle_group_by_id",
      defaultMessage: [{
        "type": 0,
        "value": "by id"
      }]
    })))), this.state.tabSelected === 'grp' ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_new_topic_group_jsx__WEBPACK_IMPORTED_MODULE_5__.default, {
      tinode: this.props.tinode,
      onSubmit: this.handleNewGroupSubmit
    }) : this.state.tabSelected === 'byid' ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_new_topic_by_id_jsx__WEBPACK_IMPORTED_MODULE_4__.default, {
      onSubmit: this.handleGroupByID,
      onError: this.props.onError
    }) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "flex-column"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_search_contacts_jsx__WEBPACK_IMPORTED_MODULE_6__.default, {
      type: "p2p",
      onSearchContacts: this.handleSearchContacts
    }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_contact_list_jsx__WEBPACK_IMPORTED_MODULE_3__.default, {
      contacts: this.props.searchResults,
      myUserId: this.props.myUserId,
      emptyListMessage: no_contacts_placeholder,
      showOnline: false,
      showUnread: false,
      showContextMenu: false,
      onTopicSelected: this.handleContactSelected
    })));
  }

}

;
/* harmony default export */ __webpack_exports__["default"] = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(NewTopicView));

/***/ }),

/***/ "./src/views/password-reset-view.jsx":
/*!*******************************************!*\
  !*** ./src/views/password-reset-view.jsx ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ PasswordResetView; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _widgets_visible_password_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../widgets/visible-password.jsx */ "./src/widgets/visible-password.jsx");
/* harmony import */ var _lib_navigation_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/navigation.js */ "./src/lib/navigation.js");




class PasswordResetView extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  componentDidMount() {
    let parsed = _lib_navigation_js__WEBPACK_IMPORTED_MODULE_3__.default.parseUrlHash(window.location.hash);
    this.setState({
      token: parsed.params.token,
      scheme: parsed.params.scheme
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    if (this.state.token) {
      this.props.onReset(this.state.scheme, this.state.password.trim(), this.state.token);
    } else {
      this.props.onRequest('email', this.state.email.trim());
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

  render() {
    let reset = this.state.token && this.state.scheme;
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("form", {
      id: "password-reset-form",
      onSubmit: this.handleSubmit
    }, reset ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "new_password_placeholder",
      defaultMessage: [{
        "type": 0,
        "value": "Enter new password"
      }]
    }, placeholder => react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_visible_password_jsx__WEBPACK_IMPORTED_MODULE_2__.default, {
      placeholder: placeholder,
      autoComplete: "new-password",
      value: this.state.password,
      required: true,
      autoFocus: true,
      onChange: this.handlePasswordChange
    })) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      htmlFor: "inputEmail"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_reset_password",
      defaultMessage: [{
        "type": 0,
        "value": "Send a password reset email:"
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
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "dialog-buttons"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
      className: "primary",
      type: "submit"
    }, reset ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
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

/***/ }),

/***/ "./src/views/settings-view.jsx":
/*!*************************************!*\
  !*** ./src/views/settings-view.jsx ***!
  \*************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ SettingsView; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _widgets_host_selector_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../widgets/host-selector.jsx */ "./src/widgets/host-selector.jsx");



class SettingsView extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
    this.state = {
      transport: props.transport || 'def',
      serverAddress: props.serverAddress
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTransportSelected = this.handleTransportSelected.bind(this);
    this.handleServerAddressChange = this.handleServerAddressChange.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.onUpdate({
      transport: this.state.transport,
      serverAddress: this.state.serverAddress
    });
  }

  handleTransportSelected(e) {
    this.setState({
      transport: e.currentTarget.value
    });
  }

  handleServerAddressChange(name) {
    this.setState({
      serverAddress: name
    });
  }

  render() {
    const names = {
      def: "default",
      ws: "websocket",
      lp: "long polling"
    };
    const transportOptions = [];
    ['def', 'ws', 'lp'].map(item => {
      const id = 'transport-' + item;
      const name = names[item];
      transportOptions.push(react__WEBPACK_IMPORTED_MODULE_0___default().createElement("li", {
        key: item
      }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", {
        type: "radio",
        id: id,
        name: "transport-select",
        value: item,
        checked: this.state.transport === item,
        onChange: this.handleTransportSelected
      }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
        htmlFor: id
      }, name)));
    });
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("form", {
      id: "settings-form",
      className: "panel-form",
      onSubmit: this.handleSubmit
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      className: "small"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_server_to_use",
      defaultMessage: [{
        "type": 0,
        "value": "Server to use:"
      }]
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_host_selector_jsx__WEBPACK_IMPORTED_MODULE_2__.default, {
      serverAddress: this.state.serverAddress,
      onServerAddressChange: this.handleServerAddressChange
    }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      className: "small"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_wire_transport",
      defaultMessage: [{
        "type": 0,
        "value": "Wire transport:"
      }]
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("ul", {
      className: "quoted"
    }, transportOptions)), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "dialog-buttons"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
      type: "submit",
      className: "primary"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "button_update",
      defaultMessage: [{
        "type": 0,
        "value": "Update"
      }]
    }))));
  }

}
;

/***/ }),

/***/ "./src/views/sidepanel-view.jsx":
/*!**************************************!*\
  !*** ./src/views/sidepanel-view.jsx ***!
  \**************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

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
/* harmony import */ var _acc_general_view_jsx__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./acc-general-view.jsx */ "./src/views/acc-general-view.jsx");
/* harmony import */ var _acc_notifications_view_jsx__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./acc-notifications-view.jsx */ "./src/views/acc-notifications-view.jsx");
/* harmony import */ var _acc_security_view_jsx__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./acc-security-view.jsx */ "./src/views/acc-security-view.jsx");
/* harmony import */ var _acc_support_view_jsx__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./acc-support-view.jsx */ "./src/views/acc-support-view.jsx");
/* harmony import */ var _login_view_jsx__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./login-view.jsx */ "./src/views/login-view.jsx");
/* harmony import */ var _new_topic_view_jsx__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./new-topic-view.jsx */ "./src/views/new-topic-view.jsx");
/* harmony import */ var _password_reset_view_jsx__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./password-reset-view.jsx */ "./src/views/password-reset-view.jsx");
/* harmony import */ var _settings_view_jsx__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./settings-view.jsx */ "./src/views/settings-view.jsx");
/* harmony import */ var _validation_view_jsx__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./validation-view.jsx */ "./src/views/validation-view.jsx");

















const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_1__.defineMessages)({
  login: {
    id: "sidepanel_title_login",
    defaultMessage: [{
      "type": 0,
      "value": "Sign In"
    }]
  },
  register: {
    id: "sidepanel_title_register",
    defaultMessage: [{
      "type": 0,
      "value": "Create Account"
    }]
  },
  settings: {
    id: "sidepanel_title_settings",
    defaultMessage: [{
      "type": 0,
      "value": "Settings"
    }]
  },
  edit: {
    id: "sidepanel_title_account_settings",
    defaultMessage: [{
      "type": 0,
      "value": "Account Settings"
    }]
  },
  general: {
    id: "sidepanel_title_acc_general",
    defaultMessage: [{
      "type": 0,
      "value": "General"
    }]
  },
  security: {
    id: "sidepanel_title_acc_security",
    defaultMessage: [{
      "type": 0,
      "value": "Security"
    }]
  },
  notif: {
    id: "sidepanel_title_acc_notifications",
    defaultMessage: [{
      "type": 0,
      "value": "Notifications"
    }]
  },
  support: {
    id: "sidepanel_title_acc_support",
    defaultMessage: [{
      "type": 0,
      "value": "Support"
    }]
  },
  newtpk: {
    id: "sidepanel_title_newtpk",
    defaultMessage: [{
      "type": 0,
      "value": "Start New Chat"
    }]
  },
  cred: {
    id: "sidepanel_title_cred",
    defaultMessage: [{
      "type": 0,
      "value": "Confirm Credentials"
    }]
  },
  reset: {
    id: "sidepanel_title_reset",
    defaultMessage: [{
      "type": 0,
      "value": "Reset Password"
    }]
  },
  archive: {
    id: "sidepanel_title_archive",
    defaultMessage: [{
      "type": 0,
      "value": "Archived Chats"
    }]
  },
  blocked: {
    id: "sidepanel_title_blocked",
    defaultMessage: [{
      "type": 0,
      "value": "Blocked Chats"
    }]
  }
});

class SidepanelView extends (react__WEBPACK_IMPORTED_MODULE_0___default().Component) {
  constructor(props) {
    super(props);
    this.handleLoginRequested = this.handleLoginRequested.bind(this);
    this.handleNewTopic = this.handleNewTopic.bind(this);
  }

  handleLoginRequested(login, password) {
    this.props.onLoginRequest(login, password);
  }

  handleNewTopic() {
    this.props.onBasicNavigate('newtpk');
  }

  render() {
    const {
      formatMessage
    } = this.props.intl;
    const view = this.props.state || (this.props.myUserId ? 'contacts' : 'login');
    let title, avatar;

    if (view == 'contacts') {
      title = this.props.title;
      avatar = this.props.avatar ? this.props.avatar : true;
    } else {
      title = formatMessage(messages[view]);
      avatar = false;
    }

    let onCancel;

    if (['login', 'contacts'].indexOf(view) == -1) {
      onCancel = this.props.onCancel;
    }

    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "sidepanel",
      className: this.props.hideSelf ? 'nodisplay' : null
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_side_navbar_jsx__WEBPACK_IMPORTED_MODULE_4__.default, {
      state: view,
      title: title,
      avatar: avatar,
      myUserId: this.props.myUserId,
      onSignUp: this.props.onSignUp,
      onSettings: this.props.onSettings,
      onNewTopic: this.handleNewTopic,
      onCancel: onCancel
    }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_error_panel_jsx__WEBPACK_IMPORTED_MODULE_2__.default, {
      level: this.props.errorLevel,
      text: this.props.errorText,
      action: this.props.errorAction,
      actionText: this.props.errorActionText,
      onClearError: this.props.onError
    }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_load_spinner_jsx__WEBPACK_IMPORTED_MODULE_3__.default, {
      show: this.props.loadSpinnerVisible
    }), view === 'login' ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_login_view_jsx__WEBPACK_IMPORTED_MODULE_12__.default, {
      login: this.props.login,
      disabled: this.props.loginDisabled,
      onLogin: this.handleLoginRequested
    }) : view === 'register' ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_create_account_view_jsx__WEBPACK_IMPORTED_MODULE_6__.default, {
      onCreateAccount: this.props.onCreateAccount,
      onCancel: this.props.onCancel,
      onError: this.props.onError
    }) : view === 'settings' ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_settings_view_jsx__WEBPACK_IMPORTED_MODULE_15__.default, {
      transport: this.props.transport,
      serverAddress: this.props.serverAddress,
      onCancel: this.props.onCancel,
      onUpdate: this.props.onGlobalSettings
    }) : view === 'edit' ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_edit_account_view_jsx__WEBPACK_IMPORTED_MODULE_7__.default, {
      tinode: this.props.tinode,
      myUserId: this.props.myUserId,
      onBasicNavigate: this.props.onBasicNavigate
    }) : view === 'general' ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_acc_general_view_jsx__WEBPACK_IMPORTED_MODULE_8__.default, {
      tinode: this.props.tinode,
      myUserId: this.props.myUserId,
      onUpdateAccount: this.props.onUpdateAccount,
      onUpdateTags: this.props.onUpdateAccountTags,
      onCredAdd: this.props.onCredAdd,
      onCredDelete: this.props.onCredDelete,
      onCredConfirm: this.props.onCredConfirm,
      onBasicNavigate: this.props.onBasicNavigate,
      onError: this.props.onError
    }) : view === 'notif' ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_acc_notifications_view_jsx__WEBPACK_IMPORTED_MODULE_9__.default, {
      messageSounds: this.props.messageSounds,
      desktopAlerts: this.props.desktopAlerts,
      desktopAlertsEnabled: this.props.desktopAlertsEnabled,
      incognitoMode: this.props.incognitoMode,
      onTogglePushNotifications: this.props.onTogglePushNotifications,
      onToggleMessageSounds: this.props.onToggleMessageSounds,
      onToggleIncognitoMode: this.props.onToggleIncognitoMode
    }) : view === 'security' ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_acc_security_view_jsx__WEBPACK_IMPORTED_MODULE_10__.default, {
      tinode: this.props.tinode,
      onUpdateAccount: this.props.onUpdateAccount,
      onLogout: this.props.onLogout,
      onDeleteAccount: this.props.onDeleteAccount,
      onShowAlert: this.props.onShowAlert,
      onShowBlocked: this.props.onShowBlocked
    }) : view === 'support' ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_acc_support_view_jsx__WEBPACK_IMPORTED_MODULE_11__.default, {
      serverAddress: this.props.serverAddress,
      serverVersion: this.props.serverVersion
    }) : view === 'contacts' || view == 'archive' || view == 'blocked' ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_contacts_view_jsx__WEBPACK_IMPORTED_MODULE_5__.default, {
      tinode: this.props.tinode,
      myUserId: this.props.myUserId,
      connected: this.props.connected,
      topicSelected: this.props.topicSelected,
      archive: view == 'archive',
      blocked: view == 'blocked',
      chatList: this.props.chatList,
      showContextMenu: this.props.showContextMenu,
      onTopicSelected: this.props.onTopicSelected,
      onShowArchive: this.props.onShowArchive
    }) : view === 'newtpk' ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_new_topic_view_jsx__WEBPACK_IMPORTED_MODULE_13__.default, {
      tinode: this.props.tinode,
      searchResults: this.props.searchResults,
      onInitFind: this.props.onInitFind,
      onSearchContacts: this.props.onSearchContacts,
      onCreateTopic: this.props.onCreateTopic,
      onError: this.props.onError
    }) : view === 'cred' ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_validation_view_jsx__WEBPACK_IMPORTED_MODULE_16__.default, {
      credCode: this.props.credCode,
      credMethod: this.props.credMethod,
      onSubmit: this.props.onValidateCredentials,
      onCancel: this.props.onCancel,
      onError: this.props.onError
    }) : view === 'reset' ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_password_reset_view_jsx__WEBPACK_IMPORTED_MODULE_14__.default, {
      onRequest: this.props.onPasswordResetRequest,
      onReset: this.props.onResetPassword
    }) : null);
  }

}

;
/* harmony default export */ __webpack_exports__["default"] = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(SidepanelView));

/***/ }),

/***/ "./src/views/tinode-web.jsx":
/*!**********************************!*\
  !*** ./src/views/tinode-web.jsx ***!
  \**********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

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
/* harmony import */ var _version_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../version.js */ "./src/version.js");
/* harmony import */ var _lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../lib/blob-helpers.js */ "./src/lib/blob-helpers.js");
/* harmony import */ var _lib_host_name_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../lib/host-name.js */ "./src/lib/host-name.js");
/* harmony import */ var _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../lib/local-storage.js */ "./src/lib/local-storage.js");
/* harmony import */ var _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../lib/navigation.js */ "./src/lib/navigation.js");
/* harmony import */ var _lib_strformat_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../lib/strformat.js */ "./src/lib/strformat.js");
/* harmony import */ var _lib_utils_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../lib/utils.js */ "./src/lib/utils.js");



















const POP_SOUND = new Audio('audio/msg.mp3');
const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_2__.defineMessages)({
  reconnect_countdown: {
    id: "reconnect_countdown",
    defaultMessage: [{
      "type": 0,
      "value": "Disconnected. Reconnecting in "
    }, {
      "type": 1,
      "value": "seconds"
    }, {
      "type": 0,
      "value": "…"
    }]
  },
  reconnect_now: {
    id: "reconnect_now",
    defaultMessage: [{
      "type": 0,
      "value": "Try now"
    }]
  },
  push_init_failed: {
    id: "push_init_failed",
    defaultMessage: [{
      "type": 0,
      "value": "Failed to initialize push notifications"
    }]
  },
  invalid_security_token: {
    id: "invalid_security_token",
    defaultMessage: [{
      "type": 0,
      "value": "Invalid security token"
    }]
  },
  no_connection: {
    id: "no_connection",
    defaultMessage: [{
      "type": 0,
      "value": "No connection"
    }]
  },
  code_doesnot_match: {
    id: "code_doesnot_match",
    defaultMessage: [{
      "type": 0,
      "value": "Code does not match"
    }]
  },
  menu_item_info: {
    id: "menu_item_info",
    defaultMessage: [{
      "type": 0,
      "value": "Info"
    }]
  }
});

class TinodeWeb extends (react__WEBPACK_IMPORTED_MODULE_0___default().Component) {
  constructor(props) {
    super(props);
    this.state = this.getBlankState();
    this.handleResize = this.handleResize.bind(this);
    this.handleHashRoute = this.handleHashRoute.bind(this);
    this.handleOnline = this.handleOnline.bind(this);
    this.checkForAppUpdate = this.checkForAppUpdate.bind(this);
    this.handleVisibilityEvent = this.handleVisibilityEvent.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handleLoginRequest = this.handleLoginRequest.bind(this);
    this.handleConnected = this.handleConnected.bind(this);
    this.handleAutoreconnectIteration = this.handleAutoreconnectIteration.bind(this);
    this.doLogin = this.doLogin.bind(this);
    this.handleCredentialsRequest = this.handleCredentialsRequest.bind(this);
    this.handleLoginSuccessful = this.handleLoginSuccessful.bind(this);
    this.handleDisconnect = this.handleDisconnect.bind(this);
    this.tnMeMetaDesc = this.tnMeMetaDesc.bind(this);
    this.tnMeContactUpdate = this.tnMeContactUpdate.bind(this);
    this.tnMeSubsUpdated = this.tnMeSubsUpdated.bind(this);
    this.resetContactList = this.resetContactList.bind(this);
    this.tnData = this.tnData.bind(this);
    this.tnInitFind = this.tnInitFind.bind(this);
    this.tnFndSubsUpdated = this.tnFndSubsUpdated.bind(this);
    this.handleSearchContacts = this.handleSearchContacts.bind(this);
    this.handleTopicSelected = this.handleTopicSelected.bind(this);
    this.handleHideMessagesView = this.handleHideMessagesView.bind(this);
    this.handleSendMessage = this.handleSendMessage.bind(this);
    this.handleNewChatInvitation = this.handleNewChatInvitation.bind(this);
    this.handleNewAccount = this.handleNewAccount.bind(this);
    this.handleNewAccountRequest = this.handleNewAccountRequest.bind(this);
    this.handleUpdateAccountRequest = this.handleUpdateAccountRequest.bind(this);
    this.handleUpdateAccountTagsRequest = this.handleUpdateAccountTagsRequest.bind(this);
    this.handleToggleIncognitoMode = this.handleToggleIncognitoMode.bind(this);
    this.handleSettings = this.handleSettings.bind(this);
    this.handleGlobalSettings = this.handleGlobalSettings.bind(this);
    this.handleShowArchive = this.handleShowArchive.bind(this);
    this.handleShowBlocked = this.handleShowBlocked.bind(this);
    this.handleToggleMessageSounds = this.handleToggleMessageSounds.bind(this);
    this.handleCredAdd = this.handleCredAdd.bind(this);
    this.handleCredDelete = this.handleCredDelete.bind(this);
    this.handleCredConfirm = this.handleCredConfirm.bind(this);
    this.initFCMessaging = this.initFCMessaging.bind(this);
    this.togglePushToken = this.togglePushToken.bind(this);
    this.requestPushToken = this.requestPushToken.bind(this);
    this.handlePushMessage = this.handlePushMessage.bind(this);
    this.handleSidepanelCancel = this.handleSidepanelCancel.bind(this);
    this.handleStartTopicRequest = this.handleStartTopicRequest.bind(this);
    this.handleNewTopicCreated = this.handleNewTopicCreated.bind(this);
    this.handleTopicUpdateRequest = this.handleTopicUpdateRequest.bind(this);
    this.handleChangePermissions = this.handleChangePermissions.bind(this);
    this.handleTagsUpdated = this.handleTagsUpdated.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleDeleteAccount = this.handleDeleteAccount.bind(this);
    this.handleDeleteMessagesRequest = this.handleDeleteMessagesRequest.bind(this);
    this.handleLeaveUnsubRequest = this.handleLeaveUnsubRequest.bind(this);
    this.handleBlockTopicRequest = this.handleBlockTopicRequest.bind(this);
    this.handleReportTopic = this.handleReportTopic.bind(this);
    this.handleShowContextMenu = this.handleShowContextMenu.bind(this);
    this.defaultTopicContextMenu = this.defaultTopicContextMenu.bind(this);
    this.handleHideContextMenu = this.handleHideContextMenu.bind(this);
    this.handleShowAlert = this.handleShowAlert.bind(this);
    this.handleShowInfoView = this.handleShowInfoView.bind(this);
    this.handleHideInfoView = this.handleHideInfoView.bind(this);
    this.handleMemberUpdateRequest = this.handleMemberUpdateRequest.bind(this);
    this.handleValidateCredentialsRequest = this.handleValidateCredentialsRequest.bind(this);
    this.handlePasswordResetRequest = this.handlePasswordResetRequest.bind(this);
    this.handleResetPassword = this.handleResetPassword.bind(this);
    this.handleContextMenuAction = this.handleContextMenuAction.bind(this);
  }

  getBlankState() {
    const settings = _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_15__.default.getObject('settings') || {};
    const persist = !!_lib_local_storage_js__WEBPACK_IMPORTED_MODULE_15__.default.getObject('keep-logged-in');
    return {
      connected: false,
      ready: false,
      autoLogin: false,
      transport: settings.transport || null,
      serverAddress: settings.serverAddress || (0,_lib_host_name_js__WEBPACK_IMPORTED_MODULE_14__.detectServerAddress)(),
      serverVersion: "no connection",
      messageSounds: !settings.messageSoundsOff,
      incognitoMode: false,
      desktopAlerts: persist && settings.desktopAlerts,
      desktopAlertsEnabled: ((0,_lib_host_name_js__WEBPACK_IMPORTED_MODULE_14__.isSecureConnection)() || (0,_lib_host_name_js__WEBPACK_IMPORTED_MODULE_14__.isLocalHost)()) && typeof firebase_app__WEBPACK_IMPORTED_MODULE_3__ != 'undefined' && typeof navigator != 'undefined' && typeof FIREBASE_INIT != 'undefined',
      firebaseToken: persist ? _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_15__.default.getObject('firebase-token') : null,
      applicationVisible: !document.hidden,
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
      displayMobile: window.innerWidth <= _config_js__WEBPACK_IMPORTED_MODULE_11__.MEDIA_BREAKPOINT,
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
      credCode: undefined,
      requestedTopic: undefined
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('online', e => {
      this.handleOnline(true);
    });
    window.addEventListener('offline', e => {
      this.handleOnline(false);
    });
    window.addEventListener('hashchange', this.handleHashRoute);
    const serviceWorkerChannel = new BroadcastChannel('tinode-sw');
    serviceWorkerChannel.addEventListener('message', this.handlePushMessage);
    document.addEventListener('visibilitychange', this.handleVisibilityEvent);
    this.setState({
      viewportWidth: document.documentElement.clientWidth,
      viewportHeight: document.documentElement.clientHeight
    });
    const keepLoggedIn = _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_15__.default.getObject('keep-logged-in');
    new Promise((resolve, reject) => {
      this.tinode = TinodeWeb.tnSetup(this.state.serverAddress, this.state.transport, this.props.intl.locale, keepLoggedIn, resolve);
      this.tinode.onConnect = this.handleConnected;
      this.tinode.onDisconnect = this.handleDisconnect;
      this.tinode.onAutoreconnectIteration = this.handleAutoreconnectIteration;
    }).then(() => {
      if (this.state.desktopAlertsEnabled) {
        this.initFCMessaging().then(() => {
          if (this.state.desktopAlerts) {
            if (!this.state.firebaseToken) {
              this.togglePushToken(true);
            } else {
              this.tinode.setDeviceToken(this.state.firebaseToken);
            }
          }
        }).catch(() => {});
      }

      const parsedNav = _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__.default.parseUrlHash(window.location.hash);
      this.resetContactList();
      const token = keepLoggedIn ? _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_15__.default.getObject('auth-token') : undefined;

      if (token) {
        this.setState({
          autoLogin: true
        });
        token.expires = new Date(token.expires);
        this.tinode.setAuthToken(token);
        this.tinode.connect().catch(err => {
          this.handleError(err.message, 'err');
        });
        delete parsedNav.params.info;
        delete parsedNav.params.tab;
        parsedNav.path[0] = '';
        _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__.default.navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__.default.composeUrlHash(parsedNav.path, parsedNav.params));
      } else if (!parsedNav.params.token) {
        this.setState({
          requestedTopic: parsedNav.path[1]
        });
        _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__.default.navigateTo('');
      }

      this.readTimer = null;
      this.readTimerCallback = null;
      this.handleHashRoute();
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('hashchange', this.handleHashRoute);
    document.removeEventListener('visibilitychange', this.handleVisibilityEvent);
  }

  static tnSetup(serverAddress, transport, locale, persistentCache, onSetupCompleted) {
    const tinode = new (tinode_sdk__WEBPACK_IMPORTED_MODULE_5___default())({
      appName: _config_js__WEBPACK_IMPORTED_MODULE_11__.APP_NAME,
      host: serverAddress,
      apiKey: _config_js__WEBPACK_IMPORTED_MODULE_11__.API_KEY,
      transport: transport,
      secure: (0,_lib_host_name_js__WEBPACK_IMPORTED_MODULE_14__.isSecureConnection)(),
      persist: persistentCache
    }, onSetupCompleted);
    tinode.setHumanLanguage(locale);
    tinode.enableLogging(_config_js__WEBPACK_IMPORTED_MODULE_11__.LOGGING_ENABLED, true);
    return tinode;
  }

  handlePushMessage(data) {
    if (data.what == 'msg' && tinode_sdk__WEBPACK_IMPORTED_MODULE_5___default().isChannelTopicName(data.topic)) {
      this.tinode.oobNotification(data.topic, data.seq, 'fake-uid');
    }
  }

  initFCMessaging() {
    const {
      formatMessage,
      locale
    } = this.props.intl;

    const onError = (msg, err) => {
      console.log(msg, err);
      this.handleError(formatMessage(messages.push_init_failed), 'err');
      this.setState({
        desktopAlertsEnabled: false
      });
    };

    try {
      this.fbPush = firebase_app__WEBPACK_IMPORTED_MODULE_3__.initializeApp(FIREBASE_INIT, _config_js__WEBPACK_IMPORTED_MODULE_11__.APP_NAME).messaging();
      this.fbPush.usePublicVapidKey(FIREBASE_INIT.messagingVapidKey);
      return navigator.serviceWorker.register('/service-worker.js').then(reg => {
        this.checkForAppUpdate(reg);
        this.fbPush.useServiceWorker(reg);
        reg.active.postMessage(JSON.stringify({
          locale: locale,
          version: _version_js__WEBPACK_IMPORTED_MODULE_12__.PACKAGE_VERSION
        }));
        this.fbPush.onTokenRefresh(() => {
          this.requestPushToken();
        });
        this.fbPush.onMessage(payload => {
          this.handlePushMessage(payload.data);
        });
        return reg;
      }).catch(err => {
        onError("Failed to register service worker:", err);
        return Promise.reject(err);
      });
    } catch (err) {
      onError("Failed to initialize push notifications", err);
      return Promise.reject(err);
    }
  }

  handleResize() {
    const mobile = document.documentElement.clientWidth <= _config_js__WEBPACK_IMPORTED_MODULE_11__.MEDIA_BREAKPOINT;
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

  checkForAppUpdate(reg) {
    reg.onupdatefound = () => {
      const installingWorker = reg.installing;

      installingWorker.onstatechange = () => {
        if (installingWorker.state == 'installed' && navigator.serviceWorker.controller) {
          const msg = react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_2__.FormattedMessage, {
            id: "update_available",
            defaultMessage: [{
              "type": 0,
              "value": "Update available."
            }]
          }), " ", react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
            href: ""
          }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_2__.FormattedMessage, {
            id: "reload_update",
            defaultMessage: [{
              "type": 0,
              "value": "Reload"
            }]
          })), ".");
          this.handleError(msg, 'info');
        }
      };
    };
  }

  handleHashRoute() {
    const hash = _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__.default.parseUrlHash(window.location.hash);

    if (hash.path && hash.path.length > 0) {
      if (['register', 'settings', 'edit', 'notif', 'security', 'support', 'general', 'cred', 'reset', 'newtpk', 'archive', 'blocked', 'contacts', ''].includes(hash.path[0])) {
        this.setState({
          sidePanelSelected: hash.path[0]
        });
      } else {
        console.log("Unknown sidepanel view", hash.path[0]);
      }

      const topicName = hash.path[1];

      if (tinode_sdk__WEBPACK_IMPORTED_MODULE_5___default().topicType(topicName) && topicName != this.state.topicSelected) {
        const newState = {
          topicSelected: topicName
        };
        const acs = this.tinode.getTopicAccessMode(topicName);

        if (acs) {
          newState.topicSelectedAcs = acs;
        }

        this.setState(newState);
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

  handleOnline(online) {
    console.log("handleOnline", online);

    if (online) {
      this.handleError();
      clearInterval(this.reconnectCountdown);
      this.tinode.reconnect();
    } else {
      this.handleError(this.props.intl.formatMessage(messages.no_connection), 'warn');
    }

    this.setState({
      liveConnection: online
    });
  }

  handleVisibilityEvent() {
    this.setState({
      applicationVisible: !document.hidden
    });
  }

  handleError(err, level, action, actionText) {
    this.setState({
      errorText: err,
      errorLevel: level,
      errorAction: action,
      errorActionText: actionText
    });
  }

  handleLoginRequest(login, password) {
    this.setState({
      loginDisabled: true,
      login: login,
      password: password,
      loadSpinnerVisible: true,
      autoLogin: true
    });
    this.handleError('', null);

    if (this.tinode.isConnected()) {
      this.doLogin(login, password, {
        meth: this.state.credMethod,
        resp: this.state.credCode
      });
    } else {
      this.tinode.connect().catch(err => {
        this.setState({
          loginDisabled: false,
          autoLogin: false,
          loadSpinnerVisible: false
        });
        this.handleError(err.message, 'err');
      });
    }
  }

  handleConnected() {
    clearInterval(this.reconnectCountdown);
    this.handleError();
    const params = this.tinode.getServerInfo();
    this.setState({
      serverVersion: params.ver + ' ' + (params.build ? params.build : 'none')
    });

    if (this.state.autoLogin) {
      this.doLogin(this.state.login, this.state.password, {
        meth: this.state.credMethod,
        resp: this.state.credCode
      });
    }
  }

  handleAutoreconnectIteration(sec, prom) {
    clearInterval(this.reconnectCountdown);

    if (sec < 0) {
      this.handleError();
      return;
    }

    if (prom) {
      prom.then(() => {
        this.handleError();
      }).catch(err => {
        this.handleError(err.message, 'err');
      });
      return;
    }

    const {
      formatMessage
    } = this.props.intl;
    let count = sec / 1000;
    count = count | count;
    this.reconnectCountdown = setInterval(() => {
      const timeLeft = count > 99 ? (0,_lib_strformat_js__WEBPACK_IMPORTED_MODULE_17__.secondsToTime)(count) : count;
      this.handleError(formatMessage(messages.reconnect_countdown, {
        seconds: timeLeft
      }), 'warn', () => {
        clearInterval(this.reconnectCountdown);
        this.tinode.reconnect();
      }, formatMessage(messages.reconnect_now));
      count -= 1;
    }, 1000);
  }

  handleDisconnect(err) {
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

  doLogin(login, password, cred) {
    if (this.tinode.isAuthenticated()) {
      _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__.default.navigateTo('');
      return;
    }

    cred = tinode_sdk__WEBPACK_IMPORTED_MODULE_5___default().credential(cred);
    let promise = null;
    const token = this.tinode.getAuthToken();

    if (login && password) {
      this.setState({
        password: null
      });
      promise = this.tinode.loginBasic(login, password, cred);
    } else if (token) {
      promise = this.tinode.loginToken(token.token, cred);
    }

    if (promise) {
      promise.then(ctrl => {
        if (ctrl.code >= 300 && ctrl.text === 'validate credentials') {
          this.setState({
            loadSpinnerVisible: false
          });

          if (cred) {
            this.handleError(this.props.intl.formatMessage(messages.code_doesnot_match), 'warn');
          }

          this.handleCredentialsRequest(ctrl.params);
        } else {
          this.handleLoginSuccessful();
        }
      }).catch(err => {
        this.setState({
          loginDisabled: false,
          credMethod: undefined,
          credCode: undefined,
          loadSpinnerVisible: false,
          autoLogin: false
        });
        this.handleError(err.message, 'err');
        localStorage.removeItem('auth-token');
        _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__.default.navigateTo('');
      });
    } else {
      _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__.default.navigateTo('');
      this.setState({
        loginDisabled: false
      });
    }
  }

  handleCredentialsRequest(params) {
    const parsed = _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__.default.parseUrlHash(window.location.hash);
    parsed.path[0] = 'cred';
    parsed.params['method'] = params.cred[0];
    _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__.default.navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__.default.composeUrlHash(parsed.path, parsed.params));
  }

  handleLoginSuccessful() {
    this.handleError();

    if (_lib_local_storage_js__WEBPACK_IMPORTED_MODULE_15__.default.getObject('keep-logged-in')) {
      _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_15__.default.setObject('auth-token', this.tinode.getAuthToken());
    }

    const goToTopic = this.state.requestedTopic;
    const me = this.tinode.getMeTopic();
    me.onMetaDesc = this.tnMeMetaDesc;
    me.onContactUpdate = this.tnMeContactUpdate;
    me.onSubsUpdated = this.tnMeSubsUpdated;
    this.setState({
      connected: true,
      credMethod: undefined,
      credCode: undefined,
      myUserId: this.tinode.getCurrentUserID(),
      autoLogin: true,
      requestedTopic: undefined
    });
    me.subscribe(me.startMetaQuery().withLaterSub().withDesc().withTags().withCred().build()).catch(err => {
      this.tinode.disconnect();
      localStorage.removeItem('auth-token');
      this.handleError(err.message, 'err');
      _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__.default.navigateTo('');
    }).finally(() => {
      this.setState({
        loadSpinnerVisible: false
      });
    });
    let urlHash = _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__.default.setUrlSidePanel(window.location.hash, 'contacts');

    if (goToTopic) {
      urlHash = _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__.default.setUrlTopic(urlHash, goToTopic);
    }

    _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__.default.navigateTo(urlHash);
  }

  tnMeMetaDesc(desc) {
    if (desc) {
      if (desc.public) {
        this.setState({
          sidePanelTitle: desc.public.fn,
          sidePanelAvatar: (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_13__.makeImageDataUrl)(desc.public.photo)
        });
      }

      if (desc.acs) {
        this.setState({
          incognitoMode: !desc.acs.isPresencer()
        });
      }
    }
  }

  tnMeContactUpdate(what, cont) {
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
      const topic = this.tinode.getTopic(cont.topic);
      const archived = topic && topic.isArchived();

      if (cont.unread > 0 && this.state.messageSounds && !archived) {
        if (document.hidden || this.state.topicSelected != cont.topic) {
          POP_SOUND.play();
        }
      }

      this.resetContactList();
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

  tnMeSubsUpdated(unused) {
    this.resetContactList();
  }

  static prepareSearchableContacts(chatList, foundContacts) {
    const merged = {};

    for (const c of chatList) {
      if (tinode_sdk__WEBPACK_IMPORTED_MODULE_5___default().isP2PTopicName(c.topic)) {
        merged[c.topic] = {
          user: c.topic,
          updated: c.updated,
          public: c.public,
          private: c.private,
          acs: c.acs
        };
      }
    }

    for (const c of foundContacts) {
      if (!merged[c.user]) {
        merged[c.user] = c;
      }
    }

    return Object.values(merged);
  }

  resetContactList() {
    const newState = {
      chatList: []
    };

    if (!this.state.ready) {
      newState.ready = true;
    }

    this.tinode.getMeTopic().contacts(c => {
      if (!c.topic && !c.user) {
        c.topic = c.name;
      }

      newState.chatList.push(c);

      if (this.state.topicSelected == c.topic) {
        newState.topicSelectedOnline = c.online;
        newState.topicSelectedAcs = c.acs;
      }
    });
    newState.searchableContacts = TinodeWeb.prepareSearchableContacts(newState.chatList, this.state.searchResults);
    this.setState(newState);
  }

  tnData(data) {
    const topic = this.tinode.getTopic(data.topic);

    if (topic.msgStatus(data, true) >= (tinode_sdk__WEBPACK_IMPORTED_MODULE_5___default().MESSAGE_STATUS_SENT) && data.from != this.state.myUserId) {
      clearTimeout(this.receivedTimer);
      this.receivedTimer = setTimeout(() => {
        this.receivedTimer = undefined;
        topic.noteRecv(data.seq);
      }, _config_js__WEBPACK_IMPORTED_MODULE_11__.RECEIVED_DELAY);
    }
  }

  tnInitFind() {
    const fnd = this.tinode.getFndTopic();
    fnd.onSubsUpdated = this.tnFndSubsUpdated;

    if (fnd.isSubscribed()) {
      this.tnFndSubsUpdated();
    } else {
      fnd.subscribe(fnd.startMetaQuery().withSub().build()).catch(err => {
        this.handleError(err.message, 'err');
      });
    }
  }

  tnFndSubsUpdated() {
    const foundContacts = [];
    this.tinode.getFndTopic().contacts(s => {
      foundContacts.push(s);
    });
    this.setState({
      searchResults: foundContacts,
      searchableContacts: TinodeWeb.prepareSearchableContacts(this.state.chatList, foundContacts)
    });
  }

  handleSearchContacts(query) {
    const fnd = this.tinode.getFndTopic();
    fnd.setMeta({
      desc: {
        public: query
      }
    }).then(ctrl => {
      return fnd.getMeta(fnd.startMetaQuery().withSub().build());
    }).catch(err => {
      this.handleError(err.message, 'err');
    });
  }

  handleTopicSelected(topicName) {
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
          topicSelectedOnline: this.tinode.isTopicOnline(topicName),
          topicSelectedAcs: this.tinode.getTopicAccessMode(topicName)
        });
        _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__.default.navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__.default.setUrlTopic('', topicName));
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
      _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__.default.navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__.default.setUrlTopic('', null));
    }
  }

  handleHideMessagesView() {
    this.setState({
      mobilePanel: 'sidepanel'
    });
    _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__.default.navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__.default.setUrlTopic(window.location.hash, null));
  }

  handleSendMessage(msg, promise, uploader) {
    const topic = this.tinode.getTopic(this.state.topicSelected);
    msg = topic.createMessage(msg, false);
    msg._uploader = uploader;

    if (!topic.isSubscribed()) {
      if (!promise) {
        promise = Promise.resolve();
      }

      promise = promise.then(() => {
        return topic.subscribe();
      });
    }

    if (promise) {
      promise = promise.catch(err => {
        this.handleError(err.message, 'err');
      });
    }

    topic.publishDraft(msg, promise).then(ctrl => {
      if (topic.isArchived()) {
        return topic.archive(false);
      }
    }).catch(err => {
      this.handleError(err.message, 'err');
    });
  }

  handleNewChatInvitation(topicName, action) {
    const topic = this.tinode.getTopic(topicName);
    let response = null;

    switch (action) {
      case 'accept':
        const mode = topic.getAccessMode().getGiven();
        response = topic.setMeta({
          sub: {
            mode: mode
          }
        });

        if (topic.isP2PType()) {
          response = response.then(ctrl => {
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
        response = topic.delTopic(true);
        break;

      case 'block':
        const am = topic.getAccessMode().updateWant('-JP').getWant();
        response = topic.setMeta({
          sub: {
            mode: am
          }
        }).then(ctrl => {
          return this.handleTopicSelected(null);
        });
        break;

      default:
        console.log("Unknown invitation action", '"' + action + '""');
    }

    if (response != null) {
      response.catch(err => {
        this.handleError(err.message, 'err');
      });
    }
  }

  handleNewAccount() {
    this.handleError();
    _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__.default.navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__.default.setUrlSidePanel(window.location.hash, 'register'));
  }

  handleNewAccountRequest(login_, password_, public_, cred_, tags_) {
    this.handleError();
    this.tinode.connect(this.state.serverAddress).then(() => {
      return this.tinode.createAccountBasic(login_, password_, {
        public: public_,
        tags: tags_,
        cred: tinode_sdk__WEBPACK_IMPORTED_MODULE_5___default().credential(cred_)
      });
    }).then(ctrl => {
      if (ctrl.code >= 300 && ctrl.text == 'validate credentials') {
        this.handleCredentialsRequest(ctrl.params);
      } else {
        this.handleLoginSuccessful(this);
      }
    }).catch(err => {
      this.handleError(err.message, 'err');
    });
  }

  handleUpdateAccountRequest(password, pub, defacs) {
    this.handleError();

    if (pub || defacs) {
      const params = {};

      if (pub) {
        params.public = pub;
      }

      if (defacs) {
        params.defacs = defacs;
      }

      this.tinode.getMeTopic().setMeta({
        desc: params
      }).catch(err => {
        this.handleError(err.message, 'err');
      });
    }

    if (password) {
      this.tinode.updateAccountBasic(null, this.tinode.getCurrentLogin(), password).catch(err => {
        this.handleError(err.message, 'err');
      });
    }
  }

  handleToggleIncognitoMode(on) {
    const me = this.tinode.getMeTopic();
    const am = me.getAccessMode().updateWant(on ? '-P' : '+P').getWant();
    me.setMeta({
      sub: {
        mode: am
      }
    }).catch(err => {
      this.handleError(err.message, 'err');
    });
  }

  handleUpdateAccountTagsRequest(tags) {
    this.tinode.getMeTopic().setMeta({
      tags: tags
    }).catch(err => {
      this.handleError(err.message, 'err');
    });
  }

  handleSettings() {
    this.handleError();
    _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__.default.navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__.default.setUrlSidePanel(window.location.hash, this.state.myUserId ? 'edit' : 'settings'));
  }

  handleGlobalSettings(settings) {
    const serverAddress = settings.serverAddress || this.state.serverAddress;
    const transport = settings.transport || this.state.transport;

    if (this.tinode) {
      this.tinode.clearStorage();
      this.tinode.onDisconnect = undefined;
      this.tinode.disconnect();
    }

    this.tinode = TinodeWeb.tnSetup(serverAddress, transport, this.props.intl.locale, _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_15__.default.getObject('keep-logged-in'));
    this.tinode.onConnect = this.handleConnected;
    this.tinode.onDisconnect = this.handleDisconnect;
    this.setState({
      serverAddress: serverAddress,
      transport: transport
    });
    _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_15__.default.setObject('settings', {
      serverAddress: serverAddress,
      transport: transport
    });
    _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__.default.navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__.default.setUrlSidePanel(window.location.hash, ''));
  }

  handleShowArchive() {
    _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__.default.navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__.default.setUrlSidePanel(window.location.hash, this.state.myUserId ? 'archive' : ''));
  }

  handleShowBlocked() {
    _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__.default.navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__.default.setUrlSidePanel(window.location.hash, this.state.myUserId ? 'blocked' : ''));
  }

  togglePushToken(enabled) {
    if (enabled) {
      if (!this.state.firebaseToken) {
        const fcm = this.fbPush ? Promise.resolve() : this.initFCMessaging();
        fcm.then(() => {
          return this.fbPush.requestPermission();
        }).then(() => {
          this.requestPushToken();
        }).catch(err => {
          console.log("Failed to get notification permission.", err);
          this.handleError(err.message, 'err');
          this.setState({
            desktopAlerts: false,
            firebaseToken: null
          });
          _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_15__.default.updateObject('settings', {
            desktopAlerts: false
          });
        });
      } else {
        this.setState({
          desktopAlerts: true
        });

        if (_lib_local_storage_js__WEBPACK_IMPORTED_MODULE_15__.default.getObject('keep-logged-in')) {
          _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_15__.default.updateObject('settings', {
            desktopAlerts: true
          });
        }
      }
    } else if (this.state.firebaseToken && this.fbPush) {
      this.fbPush.deleteToken(this.state.firebaseToken).catch(err => {
        console.log("Unable to delete token.", err);
      }).finally(() => {
        _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_15__.default.updateObject('settings', {
          desktopAlerts: false
        });
        localStorage.removeItem('firebase-token');
        this.setState({
          desktopAlerts: false,
          firebaseToken: null
        });
        this.tinode.setDeviceToken(null);
      });
    } else {
      this.setState({
        desktopAlerts: false,
        firebaseToken: null
      });
      _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_15__.default.updateObject('settings', {
        desktopAlerts: false
      });
    }
  }

  requestPushToken() {
    this.fbPush.getToken().then(refreshedToken => {
      const persist = _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_15__.default.getObject('keep-logged-in');

      if (refreshedToken != this.state.firebaseToken) {
        this.tinode.setDeviceToken(refreshedToken);

        if (persist) {
          _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_15__.default.setObject('firebase-token', refreshedToken);
        }
      }

      this.setState({
        firebaseToken: refreshedToken,
        desktopAlerts: true
      });

      if (persist) {
        _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_15__.default.updateObject('settings', {
          desktopAlerts: true
        });
      }
    }).catch(err => {
      this.handleError(err.message, 'err');
      console.log("Failed to retrieve firebase token", err);
    });
  }

  handleToggleMessageSounds(enabled) {
    this.setState({
      messageSounds: enabled
    });
    _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_15__.default.updateObject('settings', {
      messageSoundsOff: !enabled
    });
  }

  handleCredAdd(method, value) {
    const me = this.tinode.getMeTopic();
    me.setMeta({
      cred: {
        meth: method,
        val: value
      }
    }).catch(err => {
      this.handleError(err.message, 'err');
    });
  }

  handleCredDelete(method, value) {
    const me = this.tinode.getMeTopic();
    me.delCredential(method, value).catch(err => {
      this.handleError(err.message, 'err');
    });
  }

  handleCredConfirm(method, response) {
    this.handleCredentialsRequest({
      cred: [method]
    });
  }

  handleSidepanelCancel() {
    const parsed = _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__.default.parseUrlHash(window.location.hash);
    let path = '';

    if (['security', 'support', 'general', 'notif'].includes(parsed.path[0])) {
      path = 'edit';
    } else if ('blocked' == parsed.path[0]) {
      path = 'security';
    } else if (this.state.myUserId) {
      path = 'contacts';
    }

    parsed.path[0] = path;

    if (parsed.params) {
      delete parsed.params.code;
      delete parsed.params.method;
      delete parsed.params.tab;
    }

    _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__.default.navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__.default.composeUrlHash(parsed.path, parsed.params));
    this.setState({
      errorText: '',
      errorLevel: null
    });
  }

  basicNavigator(hash) {
    _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__.default.navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__.default.setUrlSidePanel(window.location.hash, hash));
  }

  handleStartTopicRequest(topicName, pub, priv, tags, isChannel) {
    if (topicName && this.tinode.isTopicCached(topicName)) {
      this.handleTopicSelected(topicName);
      return;
    }

    const params = {};

    if (tinode_sdk__WEBPACK_IMPORTED_MODULE_5___default().isP2PTopicName(topicName)) {
      params.sub = {
        mode: _config_js__WEBPACK_IMPORTED_MODULE_11__.DEFAULT_P2P_ACCESS_MODE
      };
      params.desc = {
        defacs: {
          auth: _config_js__WEBPACK_IMPORTED_MODULE_11__.DEFAULT_P2P_ACCESS_MODE
        }
      };
    } else {
      topicName = topicName || this.tinode.newGroupTopicName(isChannel);
      params.desc = {
        public: pub,
        private: {
          comment: priv
        }
      };
      params.tags = tags;
    }

    params._topicName = topicName;
    this.setState({
      newTopicParams: params
    }, () => {
      this.handleTopicSelected(topicName);
    });
  }

  handleNewTopicCreated(oldName, newName) {
    if (this.state.topicSelected == oldName && oldName != newName) {
      this.setState({
        topicSelected: newName
      }, () => {
        _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__.default.navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__.default.setUrlTopic('', newName));
      });
    }
  }

  handleTopicUpdateRequest(topicName, pub, priv, permissions) {
    const topic = this.tinode.getTopic(topicName);

    if (topic) {
      const params = {};

      if (pub) {
        params.public = pub;
      }

      if (priv) {
        params.private = priv === (tinode_sdk__WEBPACK_IMPORTED_MODULE_5___default().DEL_CHAR) ? (tinode_sdk__WEBPACK_IMPORTED_MODULE_5___default().DEL_CHAR) : {
          comment: priv
        };
      }

      if (permissions) {
        params.defacs = permissions;
      }

      topic.setMeta({
        desc: params
      }).catch(err => {
        this.handleError(err.message, 'err');
      });
    }
  }

  handleChangePermissions(topicName, mode, uid) {
    const topic = this.tinode.getTopic(topicName);

    if (topic) {
      const am = topic.getAccessMode();

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
      }).catch(err => {
        this.handleError(err.message, 'err');
      });
    }
  }

  handleTagsUpdated(topicName, tags) {
    const topic = this.tinode.getTopic(topicName);

    if (topic) {
      topic.setMeta({
        tags: tags
      }).catch(err => {
        this.handleError(err.message, 'err');
      });
    }
  }

  handleLogout() {
    (0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_18__.updateFavicon)(0);
    localStorage.removeItem('auth-token');
    localStorage.removeItem('firebase-token');
    localStorage.removeItem('settings');

    if (this.state.firebaseToken) {
      this.fbPush.deleteToken(this.state.firebaseToken);
    }

    if (this.tinode) {
      this.tinode.clearStorage();
      this.tinode.onDisconnect = undefined;
      this.tinode.disconnect();
    }

    this.setState(this.getBlankState());
    this.tinode = TinodeWeb.tnSetup(this.state.serverAddress, this.state.transport, this.props.intl.locale, _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_15__.default.getObject('keep-logged-in'));
    this.tinode.onConnect = this.handleConnected;
    this.tinode.onDisconnect = this.handleDisconnect;
    _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__.default.navigateTo('');
  }

  handleDeleteAccount() {
    this.tinode.delCurrentUser(true).then(ctrl => {
      this.handleLogout();
    });
  }

  handleDeleteMessagesRequest(topicName) {
    const topic = this.tinode.getTopic(topicName);

    if (!topic) {
      return;
    }

    topic.delMessagesAll(true).catch(err => {
      this.handleError(err.message, 'err');
    });
  }

  handleLeaveUnsubRequest(topicName) {
    const topic = this.tinode.getTopic(topicName);

    if (!topic) {
      return;
    }

    topic.leave(true).then(ctrl => {
      _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__.default.navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__.default.setUrlTopic(window.location.hash, ''));
    }).catch(err => {
      this.handleError(err.message, 'err');
    });
  }

  handleBlockTopicRequest(topicName) {
    const topic = this.tinode.getTopic(topicName);

    if (!topic) {
      return;
    }

    topic.updateMode(null, '-JP').then(ctrl => {
      _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__.default.navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__.default.setUrlTopic(window.location.hash, ''));
    }).catch(err => {
      this.handleError(err.message, 'err');
    });
  }

  handleReportTopic(topicName) {
    const topic = this.tinode.getTopic(topicName);

    if (!topic) {
      return;
    }

    this.tinode.publish((tinode_sdk__WEBPACK_IMPORTED_MODULE_5___default().TOPIC_SYS), tinode_sdk__WEBPACK_IMPORTED_MODULE_5___default().Drafty.attachJSON(null, {
      'action': 'report',
      'target': topicName
    }));
    topic.updateMode(null, '-JP').then(ctrl => {
      _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__.default.navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__.default.setUrlTopic(window.location.hash, ''));
    }).catch(err => {
      this.handleError(err.message, 'err');
    });
  }

  handleShowContextMenu(params, menuItems) {
    this.setState({
      contextMenuVisible: true,
      contextMenuClickAt: {
        x: params.x,
        y: params.y
      },
      contextMenuParams: params,
      contextMenuItems: menuItems || this.defaultTopicContextMenu(params.topicName),
      contextMenuBounds: react_dom__WEBPACK_IMPORTED_MODULE_1___default().findDOMNode(this).getBoundingClientRect()
    });
  }

  defaultTopicContextMenu(topicName) {
    const topic = this.tinode.getTopic(topicName);
    let muted = false,
        blocked = false,
        self_blocked = false,
        subscribed = false,
        deleter = false,
        archived = false;

    if (topic) {
      subscribed = topic.isSubscribed();
      archived = topic.isArchived();
      const acs = topic.getAccessMode();

      if (acs) {
        muted = acs.isMuted();
        blocked = !acs.isJoiner();
        self_blocked = !acs.isJoiner('want');
        deleter = acs.isDeleter();
      }
    }

    return [subscribed ? {
      title: this.props.intl.formatMessage(messages.menu_item_info),
      handler: this.handleShowInfoView
    } : null, subscribed ? 'messages_clear' : null, subscribed && deleter ? 'messages_clear_hard' : null, muted ? blocked ? null : 'topic_unmute' : 'topic_mute', self_blocked ? 'topic_unblock' : 'topic_block', !archived ? 'topic_archive' : null, 'topic_delete'];
  }

  handleHideContextMenu() {
    this.setState({
      contextMenuVisible: false,
      contextMenuClickAt: null,
      contextMenuParams: null,
      contextMenuBounds: null
    });
  }

  handleContextMenuAction(action, promise, params) {
    if (action == 'topic_archive') {
      if (promise && params.topicName && params.topicName == this.state.topicSelected) {
        promise.then(() => {
          this.handleTopicSelected(null);
        });
      }
    }
  }

  handleShowAlert(title, content, onConfirm, confirmText, onReject, rejectText) {
    this.setState({
      alertVisible: true,
      alertParams: {
        title: title,
        content: content,
        onConfirm: onConfirm,
        confirm: confirmText,
        onReject: onReject,
        reject: rejectText
      }
    });
  }

  handleShowInfoView() {
    _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__.default.navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__.default.addUrlParam(window.location.hash, 'info', true));
    this.setState({
      showInfoPanel: true
    });
  }

  handleHideInfoView() {
    _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__.default.navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__.default.removeUrlParam(window.location.hash, 'info'));
    this.setState({
      showInfoPanel: false
    });
  }

  handleMemberUpdateRequest(topicName, added, removed) {
    if (!topicName) {
      return;
    }

    const topic = this.tinode.getTopic(topicName);

    if (!topic) {
      return;
    }

    if (added && added.length > 0) {
      added.map(uid => {
        topic.invite(uid, null).catch(err => {
          this.handleError(err.message, 'err');
        });
      });
    }

    if (removed && removed.length > 0) {
      removed.map(uid => {
        topic.delSubscription(uid).catch(err => {
          this.handleError(err.message, 'err');
        });
      });
    }
  }

  handleValidateCredentialsRequest(cred, code) {
    if (this.tinode.isAuthenticated()) {
      const me = this.tinode.getMeTopic();
      me.setMeta({
        cred: {
          meth: cred,
          resp: code
        }
      }).then(() => {
        _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__.default.navigateTo('');
      }).catch(err => {
        this.handleError(err.message, 'err');
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

  handlePasswordResetRequest(method, value) {
    this.tinode.connect().then(() => {
      return this.tinode.requestResetAuthSecret('basic', method, value);
    }).catch(err => {
      this.handleError(err.message, 'err');
    });
  }

  handleResetPassword(scheme, newPassword, token) {
    token = (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_13__.base64ReEncode)(token);

    if (!token) {
      this.handleError(this.props.intl.formatMessage(messages.invalid_security_token), 'err');
    } else {
      this.tinode.connect().then(() => {
        return this.tinode.updateAccountBasic(null, null, newPassword, {
          token: token
        });
      }).catch(err => {
        this.handleError(err.message, 'err');
      });
    }
  }

  render() {
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "app-container"
    }, this.state.contextMenuVisible ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_context_menu_jsx__WEBPACK_IMPORTED_MODULE_7__.default, {
      tinode: this.tinode,
      bounds: this.state.contextMenuBounds,
      clickAt: this.state.contextMenuClickAt,
      params: this.state.contextMenuParams,
      items: this.state.contextMenuItems,
      hide: this.handleHideContextMenu,
      onShowAlert: this.handleShowAlert,
      onAction: this.handleContextMenuAction,
      onTopicRemoved: topicName => {
        if (topicName == this.state.topicSelected) {
          this.handleTopicSelected(null);
        }
      },
      onError: this.handleError
    }) : null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_alert_jsx__WEBPACK_IMPORTED_MODULE_6__.default, {
      visible: this.state.alertVisible,
      title: this.state.alertParams.title,
      content: this.state.alertParams.content,
      onReject: this.state.alertParams.onReject ? () => {
        this.setState({
          alertVisible: false
        });
      } : null,
      reject: this.state.alertParams.reject,
      onConfirm: () => {
        this.setState({
          alertVisible: false
        });
        this.state.alertParams.onConfirm();
      },
      confirm: this.state.alertParams.confirm
    }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_sidepanel_view_jsx__WEBPACK_IMPORTED_MODULE_10__.default, {
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
      incognitoMode: this.state.incognitoMode,
      serverAddress: this.state.serverAddress,
      serverVersion: this.state.serverVersion,
      onGlobalSettings: this.handleGlobalSettings,
      onSignUp: this.handleNewAccount,
      onSettings: this.handleSettings,
      onBasicNavigate: this.basicNavigator,
      onLoginRequest: this.handleLoginRequest,
      onCreateAccount: this.handleNewAccountRequest,
      onUpdateAccount: this.handleUpdateAccountRequest,
      onUpdateAccountTags: this.handleUpdateAccountTagsRequest,
      onTogglePushNotifications: this.togglePushToken,
      onToggleMessageSounds: this.handleToggleMessageSounds,
      onToggleIncognitoMode: this.handleToggleIncognitoMode,
      onCredAdd: this.handleCredAdd,
      onCredDelete: this.handleCredDelete,
      onCredConfirm: this.handleCredConfirm,
      onTopicSelected: this.handleTopicSelected,
      onCreateTopic: this.handleStartTopicRequest,
      onLogout: this.handleLogout,
      onDeleteAccount: this.handleDeleteAccount,
      onShowAlert: this.handleShowAlert,
      onCancel: this.handleSidepanelCancel,
      onError: this.handleError,
      onValidateCredentials: this.handleValidateCredentialsRequest,
      onPasswordResetRequest: this.handlePasswordResetRequest,
      onResetPassword: this.handleResetPassword,
      onShowArchive: this.handleShowArchive,
      onShowBlocked: this.handleShowBlocked,
      onInitFind: this.tnInitFind,
      searchResults: this.state.searchResults,
      onSearchContacts: this.handleSearchContacts,
      showContextMenu: this.handleShowContextMenu
    }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_messages_view_jsx__WEBPACK_IMPORTED_MODULE_9__.default, {
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
      applicationVisible: this.state.applicationVisible,
      errorText: this.state.errorText,
      errorLevel: this.state.errorLevel,
      errorAction: this.state.errorAction,
      errorActionText: this.state.errorActionText,
      newTopicParams: this.state.newTopicParams,
      onHideMessagesView: this.handleHideMessagesView,
      onData: this.tnData,
      onError: this.handleError,
      onNewTopicCreated: this.handleNewTopicCreated,
      showContextMenu: this.handleShowContextMenu,
      onChangePermissions: this.handleChangePermissions,
      onNewChat: this.handleNewChatInvitation,
      sendMessage: this.handleSendMessage
    }), this.state.showInfoPanel ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_info_view_jsx__WEBPACK_IMPORTED_MODULE_8__.default, {
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

}

;
/* harmony default export */ __webpack_exports__["default"] = ((0,react_intl__WEBPACK_IMPORTED_MODULE_2__.injectIntl)(TinodeWeb));

/***/ }),

/***/ "./src/views/validation-view.jsx":
/*!***************************************!*\
  !*** ./src/views/validation-view.jsx ***!
  \***************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);


const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_1__.defineMessages)({
  phone: {
    id: "phone_dative",
    defaultMessage: [{
      "type": 0,
      "value": "phone"
    }]
  },
  email: {
    id: "email_dative",
    defaultMessage: [{
      "type": 0,
      "value": "email"
    }]
  }
});

class ValidationView extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
    this.state = {
      code: props.credCode || ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleChange(e) {
    this.setState({
      code: e.target.value
    });
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.handleSubmit(e);
    } else if (e.key == 'Escape') {
      this.handleCancel(e);
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    if (this.state.code && this.state.code.trim()) {
      this.props.onSubmit(this.props.credMethod, this.state.code.trim());
    }
  }

  handleCancel(e) {
    e.preventDefault();
    this.props.onCancel();
  }

  render() {
    const {
      formatMessage
    } = this.props.intl;
    const methods = {
      'email': formatMessage(messages.email),
      'tel': formatMessage(messages.phone)
    };
    let method = methods[this.props.credMethod] || this.props.credMethod;
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      className: "small",
      htmlFor: "enter-confirmation-code"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "enter_confirmation_code_prompt",
      defaultMessage: [{
        "type": 0,
        "value": "Enter confirmation code sent to you by "
      }, {
        "type": 1,
        "value": "method"
      }, {
        "type": 0,
        "value": ":"
      }],
      values: {
        method: method
      }
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "numeric_confirmation_code_prompt",
      defaultMessage: [{
        "type": 0,
        "value": "Numbers only"
      }]
    }, numbers_only => react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", {
      type: "text",
      id: "enter-confirmation-code",
      placeholder: numbers_only,
      value: this.state.code,
      onChange: this.handleChange,
      onKeyPress: this.handleKeyPress,
      required: true
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "dialog-buttons"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
      className: "primary",
      onClick: this.handleSubmit
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "button_confirm",
      defaultMessage: [{
        "type": 0,
        "value": "Confirm"
      }]
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
      className: "secondary",
      onClick: this.handleCancel
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "button_cancel",
      defaultMessage: [{
        "type": 0,
        "value": "Cancel"
      }]
    }))));
  }

}

;
/* harmony default export */ __webpack_exports__["default"] = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(ValidationView));

/***/ }),

/***/ "./src/widgets/alert.jsx":
/*!*******************************!*\
  !*** ./src/widgets/alert.jsx ***!
  \*******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Alert; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);


class Alert extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  render() {
    return this.props.visible ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "alert-container"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "alert"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "title"
    }, this.props.title), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "content"
    }, this.props.content), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "dialog-buttons"
    }, this.props.onReject ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
      className: "outline",
      onClick: this.props.onReject
    }, this.props.reject || react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "button_cancel",
      defaultMessage: [{
        "type": 0,
        "value": "Cancel"
      }]
    })) : null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
      className: "primary",
      onClick: this.props.onConfirm
    }, this.props.confirm || react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "button_ok",
      defaultMessage: [{
        "type": 0,
        "value": "OK"
      }]
    }))))) : null;
  }

}
;

/***/ }),

/***/ "./src/widgets/attachment.jsx":
/*!************************************!*\
  !*** ./src/widgets/attachment.jsx ***!
  \************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Attachment; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _file_progress_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./file-progress.jsx */ "./src/widgets/file-progress.jsx");
/* harmony import */ var _lib_strformat_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/strformat.js */ "./src/lib/strformat.js");
/* harmony import */ var _lib_utils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../lib/utils.js */ "./src/lib/utils.js");





class Attachment extends (react__WEBPACK_IMPORTED_MODULE_0___default().Component) {
  constructor(props) {
    super(props);
    this.state = {
      downloader: null,
      progress: 0
    };
    this.downloadFile = this.downloadFile.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  downloadFile(url, filename, mimetype) {
    if (!url) {
      this.props.onError("Invalid download URL '" + url + "'");
      return;
    }

    const downloader = this.props.tinode.getLargeFileHelper();
    this.setState({
      downloader: downloader
    });
    downloader.download(url, filename, mimetype, loaded => {
      this.setState({
        progress: loaded / this.props.size
      });
    }, err => {
      this.props.onError(err, 'err');
    }).then(() => {
      this.setState({
        downloader: null,
        progress: 0
      });
    }).catch(err => {
      if (err) {
        this.props.onError("Error downloading file: " + err.message, 'err');
      }

      this.setState({
        downloader: null,
        progress: 0
      });
    });
  }

  handleCancel() {
    if (this.props.uploading) {
      this.props.onCancelUpload();
    } else if (this.state.downloader) {
      this.state.downloader.cancel();
    }
  }

  render() {
    let filename = this.props.filename || 'file_attachment';

    if (filename.length > 36) {
      filename = filename.substr(0, 16) + '...' + filename.substr(-16);
    }

    let size = this.props.size > 0 ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
      className: "small gray"
    }, "(", (0,_lib_strformat_js__WEBPACK_IMPORTED_MODULE_3__.bytesToHumanSize)(this.props.size), ")") : null;
    let url, helperFunc;

    if (!this.props.uploading && !this.state.downloader && (0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_4__.isUrlRelative)(this.props.downloadUrl)) {
      url = '#';

      helperFunc = e => {
        e.preventDefault();
        this.downloadFile(this.props.downloadUrl, this.props.filename, this.props.mimetype);
      };
    } else {
      url = (0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_4__.sanitizeUrl)(this.props.downloadUrl);
      helperFunc = null;
    }

    const downloadWidget = react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "file_download"), " ", react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "save_attachment",
      defaultMessage: [{
        "type": 0,
        "value": "save"
      }]
    }));
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "attachment"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons big gray"
    }, "insert_drive_file")), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "flex-column"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, filename, " ", size), this.props.uploading || this.state.downloader ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_file_progress_jsx__WEBPACK_IMPORTED_MODULE_2__.default, {
      progress: this.props.uploading ? this.props.progress : this.state.progress,
      onCancel: this.handleCancel
    }) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, url ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: url,
      download: this.props.filename,
      onClick: helperFunc
    }, downloadWidget) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
      className: "light-gray"
    }, downloadWidget))));
  }

}
;

/***/ }),

/***/ "./src/widgets/avatar-upload.jsx":
/*!***************************************!*\
  !*** ./src/widgets/avatar-upload.jsx ***!
  \***************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ AvatarUpload; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _letter_tile_jsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./letter-tile.jsx */ "./src/widgets/letter-tile.jsx");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var _lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/blob-helpers.js */ "./src/lib/blob-helpers.js");




class AvatarUpload extends (react__WEBPACK_IMPORTED_MODULE_0___default().Component) {
  constructor(props) {
    super(props);
    this.state = {
      dataUrl: props.avatar
    };
    this.handleFileUpload = this.handleFileUpload.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.avatar != prevProps.avatar) {
      this.setState({
        dataUrl: this.props.avatar
      });
    }
  }

  handleFileUpload(e) {
    (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_3__.imageScaled)(e.target.files[0], _config_js__WEBPACK_IMPORTED_MODULE_2__.AVATAR_SIZE, _config_js__WEBPACK_IMPORTED_MODULE_2__.AVATAR_SIZE, _config_js__WEBPACK_IMPORTED_MODULE_2__.MAX_EXTERN_ATTACHMENT_SIZE, true, (mime, blob) => {
      (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_3__.blobToBase64)(blob, (unused, base64bits) => {
        const du = (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_3__.makeImageDataUrl)({
          data: base64bits,
          type: mime
        });
        this.setState({
          dataUrl: du
        });
        this.props.onImageChanged(du);
      });
    }, err => {
      this.props.onError(err, 'err');
    });
    e.target.value = '';
  }

  render() {
    const randId = 'file-input-avatar-' + (Math.random() + '').substr(2);
    const className = 'avatar-upload' + (this.props.readOnly ? ' read-only' : '');
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: className
    }, this.props.readOnly || !this.state.dataUrl ? null : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      className: "clear-avatar",
      onClick: e => {
        e.preventDefault();
        this.props.onImageChanged(null);
      }
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "clear")), this.state.dataUrl ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("img", {
      src: this.state.dataUrl,
      className: "preview"
    }) : this.props.readOnly && this.props.uid ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "avatar-box"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_letter_tile_jsx__WEBPACK_IMPORTED_MODULE_1__.default, {
      avatar: true,
      topic: this.props.uid,
      title: this.props.title
    })) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "blank"
    }, _config_js__WEBPACK_IMPORTED_MODULE_2__.AVATAR_SIZE, "\xD7", _config_js__WEBPACK_IMPORTED_MODULE_2__.AVATAR_SIZE), this.props.readOnly ? null : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", {
      type: "file",
      id: randId,
      className: "inputfile hidden",
      accept: "image/*",
      onChange: this.handleFileUpload
    }), this.props.readOnly ? null : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      htmlFor: randId,
      className: "round"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "file_upload")));
  }

}
;

/***/ }),

/***/ "./src/widgets/button-back.jsx":
/*!*************************************!*\
  !*** ./src/widgets/button-back.jsx ***!
  \*************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ ButtonBack; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

class ButtonBack extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  render() {
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      onClick: e => {
        e.preventDefault();
        this.props.onBack();
      }
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "arrow_back"));
  }

}

/***/ }),

/***/ "./src/widgets/chat-message.jsx":
/*!**************************************!*\
  !*** ./src/widgets/chat-message.jsx ***!
  \**************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ ChatMessage; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tinode-sdk */ "tinode-sdk");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _attachment_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./attachment.jsx */ "./src/widgets/attachment.jsx");
/* harmony import */ var _letter_tile_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./letter-tile.jsx */ "./src/widgets/letter-tile.jsx");
/* harmony import */ var _received_marker_jsx__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./received-marker.jsx */ "./src/widgets/received-marker.jsx");
/* harmony import */ var _uploading_image_jsx__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./uploading-image.jsx */ "./src/widgets/uploading-image.jsx");
/* harmony import */ var _lib_utils_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../lib/utils.js */ "./src/lib/utils.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var _lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../lib/blob-helpers.js */ "./src/lib/blob-helpers.js");








class ChatMessage extends (react__WEBPACK_IMPORTED_MODULE_0___default().Component) {
  constructor(props) {
    super(props);
    this.state = {
      progress: 0
    };

    if (props.uploader) {
      props.uploader.onProgress = this.handleProgress.bind(this);
    }

    this.handleImagePreview = this.handleImagePreview.bind(this);
    this.handleFormButtonClick = this.handleFormButtonClick.bind(this);
    this.handleContextClick = this.handleContextClick.bind(this);
    this.handleCancelUpload = this.handleCancelUpload.bind(this);
  }

  handleImagePreview(e) {
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

  handleFormButtonClick(e) {
    e.preventDefault();
    const data = {
      seq: this.props.seq
    };
    data.resp = {};

    if (e.target.dataset.name) {
      data.resp[e.target.dataset.name] = e.target.dataset.val ? e.target.dataset.val : e.target.dataset.val === undefined ? 1 : '' + e.target.dataset.val;
    }

    if (e.target.dataset.act == 'url') {
      data.ref = (0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_7__.sanitizeUrl)(e.target.dataset.ref) || 'about:blank';
    }

    const text = e.target.dataset.title || 'unknown';
    this.props.onFormResponse(e.target.dataset.act, text, data);
  }

  handleContextClick(e) {
    e.preventDefault();
    e.stopPropagation();
    const menuItems = this.props.received == Tinode.MESSAGE_STATUS_FAILED ? ['menu_item_send_retry'] : [];
    this.props.showContextMenu({
      seq: this.props.seq,
      content: this.props.content,
      y: e.pageY,
      x: e.pageX
    }, menuItems);
  }

  handleProgress(ratio) {
    this.setState({
      progress: ratio
    });
  }

  handleCancelUpload() {
    this.props.onCancelUpload(this.props.seq, this.props.uploader);
  }

  render() {
    const sideClass = this.props.deleted ? 'center' : this.props.sequence + ' ' + (this.props.response ? 'left' : 'right');
    const bubbleClass = this.props.sequence == 'single' || this.props.sequence == 'last' ? 'bubble tip' : 'bubble';
    const avatar = this.props.deleted ? null : this.props.userAvatar || true;
    const fullDisplay = this.props.userFrom && this.props.response && !this.props.deleted && (this.props.sequence == 'single' || this.props.sequence == 'last');
    let content = this.props.content;
    const attachments = [];

    if (this.props.mimeType == tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.getContentType() && tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.isValid(content)) {
      tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.attachments(content, function (att, i) {
        if (att.mime == 'application/json') {
          return;
        }

        attachments.push(react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_attachment_jsx__WEBPACK_IMPORTED_MODULE_3__.default, {
          tinode: this.props.tinode,
          downloadUrl: tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.getDownloadUrl(att),
          filename: att.name,
          uploading: tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.isProcessing(att),
          mimetype: att.mime,
          size: tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.getEntitySize(att),
          progress: this.state.progress,
          onCancelUpload: this.handleCancelUpload,
          onError: this.props.onError,
          key: i
        }));
      }, this);
      content = react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.format(content, draftyFormatter, this));
    } else if (this.props.deleted) {
      content = react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
        className: "material-icons gray"
      }, "block"), " ", react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
        className: "gray"
      }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
        id: "deleted_content",
        defaultMessage: [{
          "type": 0,
          "value": "content deleted"
        }]
      })));
    } else if (typeof content != 'string') {
      content = react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
        className: "material-icons gray"
      }, "error_outline"), " ", react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
        className: "gray"
      }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
        id: "invalid_content",
        defaultMessage: [{
          "type": 0,
          "value": "invalid content"
        }]
      })));
    }

    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("li", {
      className: sideClass
    }, this.props.userFrom && this.props.response ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "avatar-box"
    }, fullDisplay ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_letter_tile_jsx__WEBPACK_IMPORTED_MODULE_4__.default, {
      topic: this.props.userFrom,
      title: this.props.userName,
      avatar: avatar
    }) : null) : null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: bubbleClass
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "content-meta"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "message-content"
    }, content, attachments), this.props.timestamp ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_received_marker_jsx__WEBPACK_IMPORTED_MODULE_5__.default, {
      timestamp: this.props.timestamp,
      received: this.props.received
    }) : null), this.props.deleted || !this.props.showContextMenu ? null : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
      className: "menuTrigger"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      onClick: this.handleContextClick
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "expand_more")))), fullDisplay ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "author"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "user_not_found",
      defaultMessage: [{
        "type": 0,
        "value": "Not found"
      }]
    }, notFound => {
      return this.props.userName || react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", null, notFound);
    })) : null));
  }

}
;



function draftyFormatter(style, data, values, key) {
  if (style == 'EX') {
    return null;
  }

  let el = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.tagName(style);

  if (el) {
    const attr = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.attrValue(style, data) || {};
    attr.key = key;

    switch (style) {
      case 'HL':
        attr.className = 'highlight';
        break;

      case 'IM':
        if (data) {
          attr.className = 'inline-image';
          const dim = (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_9__.fitImageSize)(data.width, data.height, Math.min(this.props.viewportWidth - _config_js__WEBPACK_IMPORTED_MODULE_8__.REM_SIZE * 6.5, _config_js__WEBPACK_IMPORTED_MODULE_8__.REM_SIZE * 34.5), _config_js__WEBPACK_IMPORTED_MODULE_8__.REM_SIZE * 24, false) || {
            dstWidth: _config_js__WEBPACK_IMPORTED_MODULE_8__.BROKEN_IMAGE_SIZE,
            dstHeight: _config_js__WEBPACK_IMPORTED_MODULE_8__.BROKEN_IMAGE_SIZE
          };
          attr.style = {
            width: dim.dstWidth + 'px',
            height: dim.dstHeight + 'px',
            minWidth: dim.dstWidth + 'px',
            minHeight: dim.dstHeight + 'px'
          };

          if (!tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.isProcessing(data)) {
            attr.src = this.props.tinode.authorizeURL((0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_7__.sanitizeImageUrl)(attr.src));
            attr.alt = data.name;

            if (attr.src) {
              attr.onClick = this.handleImagePreview;
              attr.className += ' image-clickable';
            } else {
              attr.src = 'img/broken_image.png';
            }
          } else {
            el = _uploading_image_jsx__WEBPACK_IMPORTED_MODULE_6__.default;
          }
        }

        break;

      case 'BN':
        attr.onClick = this.handleFormButtonClick;
        let inner = react__WEBPACK_IMPORTED_MODULE_0___default().Children.map(values, child => {
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

      case 'RW':
        break;

      default:
        if (el == '_UNKN') {
          el = react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
            className: "material-icons"
          }, "extension"));
        }

        break;
    }

    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement(el, attr, values);
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
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ CheckBox; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

class CheckBox extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    this.props.onChange(this.props.name, !this.props.checked);
  }

  render() {
    return this.props.onChange ? this.props.checked ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons blue clickable",
      onClick: this.handleChange
    }, "check_box") : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons blue clickable",
      onClick: this.handleChange
    }, "check_box_outline_blank") : this.props.checked ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "check_box") : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "check_box_outline_blank");
  }

}

/***/ }),

/***/ "./src/widgets/chip-input.jsx":
/*!************************************!*\
  !*** ./src/widgets/chip-input.jsx ***!
  \************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ ChipInput; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _chip_jsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./chip.jsx */ "./src/widgets/chip.jsx");
/* harmony import */ var _lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/blob-helpers.js */ "./src/lib/blob-helpers.js");



class ChipInput extends (react__WEBPACK_IMPORTED_MODULE_0___default().Component) {
  constructor(props) {
    super(props);
    this.state = ChipInput.deriveStateFromProps(props);
    this.state.input = '';
    this.state.focused = false;
    this.handleTextInput = this.handleTextInput.bind(this);
    this.removeChipAt = this.removeChipAt.bind(this);
    this.handleChipCancel = this.handleChipCancel.bind(this);
    this.handleFocusGained = this.handleFocusGained.bind(this);
    this.handleFocusLost = this.handleFocusLost.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  static deriveStateFromProps(props) {
    return {
      placeholder: props.chips ? '' : props.prompt,
      sortedChips: ChipInput.sortChips(props.chips, props.staticMembers),
      chipIndex: ChipInput.indexChips(props.chips)
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.chips != this.props.chips || prevProps.staticMembers != this.props.staticMembers || prevProps.prompt != this.props.prompt) {
      this.setState(ChipInput.deriveStateFromProps(this.props));
    }

    if (!prevState || this.props.chips.length > prevState.sortedChips.length) {
      this.setState({
        input: ''
      });
    }
  }

  static indexChips(chips) {
    const index = {};
    let count = 0;
    chips.map(item => {
      index[item.user] = count;
      count++;
    });
    return index;
  }

  static sortChips(chips, keep) {
    const required = [];
    const normal = [];
    chips.map(item => {
      if (keep && keep.includes(item.user)) {
        required.push(item);
      } else {
        normal.push(item);
      }
    });
    return required.concat(normal);
  }

  handleTextInput(e) {
    this.setState({
      input: e.target.value
    });

    if (this.props.filterFunc) {
      this.props.filterFunc(e.target.value);
    }
  }

  removeChipAt(idx) {
    const removed = this.state.sortedChips[idx];
    this.props.onChipRemoved(removed.user, this.state.chipIndex[removed.user]);
  }

  handleChipCancel(item, idx) {
    this.removeChipAt(idx);
  }

  handleFocusGained() {
    this.setState({
      focused: true
    });
  }

  handleFocusLost() {
    this.setState({
      focused: false
    });

    if (this.props.onFocusLost) {
      this.props.onFocusLost(this.state.input);
    }
  }

  handleKeyDown(e) {
    if (e.key === 'Backspace') {
      if (this.state.input.length == 0 && this.state.sortedChips.length > 0) {
        const at = this.state.sortedChips.length - 1;

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

  render() {
    const chips = [];
    let count = 0;
    const staticMembers = this.props.staticMembers || [];
    this.state.sortedChips.map(item => {
      chips.push(react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_chip_jsx__WEBPACK_IMPORTED_MODULE_1__.default, {
        onCancel: this.handleChipCancel,
        avatar: (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_2__.makeImageDataUrl)(item.public ? item.public.photo : null),
        title: item.public ? item.public.fn : undefined,
        noAvatar: this.props.avatarDisabled,
        topic: item.user,
        required: staticMembers.includes(item.user),
        invalid: item.invalid,
        index: count,
        key: item.user
      }));
      count++;
    });
    const className = "chip-input" + (this.state.focused ? ' focused' : '');
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: className
    }, chips, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", {
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

}
;

/***/ }),

/***/ "./src/widgets/chip.jsx":
/*!******************************!*\
  !*** ./src/widgets/chip.jsx ***!
  \******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Chip; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _letter_tile_jsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./letter-tile.jsx */ "./src/widgets/letter-tile.jsx");


class Chip extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleCancel(e) {
    e.preventDefault();
    this.props.onCancel(this.props.topic, this.props.index);
  }

  render() {
    const title = this.props.title || this.props.topic;
    const className = this.props.invalid ? 'chip invalid' : 'chip';
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: className
    }, this.props.noAvatar ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
      className: "spacer"
    }) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "avatar-box"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_letter_tile_jsx__WEBPACK_IMPORTED_MODULE_1__.default, {
      avatar: this.props.avatar || true,
      topic: this.props.topic,
      title: this.props.title
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, title), this.props.onCancel && !this.props.required ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      onClick: this.handleCancel
    }, "\xD7") : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
      className: "spacer"
    }));
  }

}
;

/***/ }),

/***/ "./src/widgets/contact-action.jsx":
/*!****************************************!*\
  !*** ./src/widgets/contact-action.jsx ***!
  \****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);



class ContactAction extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.onAction(this.props.action);
  }

  render() {
    const {
      formatMessage
    } = this.props.intl;
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("li", {
      onClick: this.handleClick,
      className: "action"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "action-text"
    }, formatMessage(this.props.title, this.props.values)));
  }

}

;
/* harmony default export */ __webpack_exports__["default"] = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(ContactAction));

/***/ }),

/***/ "./src/widgets/contact-badges.jsx":
/*!****************************************!*\
  !*** ./src/widgets/contact-badges.jsx ***!
  \****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ ContactBadges; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

const icon_mapping = {
  'muted': 'notifications_off',
  'banned': 'block'
};
class ContactBadges extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  render() {
    let badges = null;

    if (this.props.badges && this.props.badges.length > 0) {
      badges = [];
      this.props.badges.map(function (b) {
        if (b.icon) {
          badges.push(react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
            className: "material-icons as-badge",
            key: b.key || b.icon
          }, icon_mapping[b.icon]));
        } else {
          const style = 'badge' + (b.color ? ' ' + b.color : '');
          badges.push(react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
            className: style,
            key: b.key || b.name
          }, b.name));
        }
      });
      return react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, badges);
    }

    return null;
  }

}
;

/***/ }),

/***/ "./src/widgets/contact-list.jsx":
/*!**************************************!*\
  !*** ./src/widgets/contact-list.jsx ***!
  \**************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tinode-sdk */ "tinode-sdk");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _contact_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./contact.jsx */ "./src/widgets/contact.jsx");
/* harmony import */ var _contact_action_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./contact-action.jsx */ "./src/widgets/contact-action.jsx");
/* harmony import */ var _lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../lib/blob-helpers.js */ "./src/lib/blob-helpers.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../config.js */ "./src/config.js");








const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_1__.defineMessages)({
  badge_you: {
    id: "badge_you",
    defaultMessage: [{
      "type": 0,
      "value": "you"
    }]
  },
  badge_owner: {
    id: "badge_owner",
    defaultMessage: [{
      "type": 0,
      "value": "owner"
    }]
  }
});

class ContactList extends (react__WEBPACK_IMPORTED_MODULE_0___default().Component) {
  render() {
    const {
      formatMessage
    } = this.props.intl;
    const showCheckmark = Array.isArray(this.props.topicSelected);
    const contactNodes = [];
    let contactsCount = 0;

    if (this.props.contacts && this.props.contacts.length > 0) {
      this.props.contacts.map(c => {
        if (c.action) {
          contactNodes.push(react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_contact_action_jsx__WEBPACK_IMPORTED_MODULE_4__.default, {
            title: c.title,
            action: c.action,
            values: c.values,
            key: c.action,
            onAction: this.props.onAction
          }));
        } else {
          const key = this.props.showMode ? c.user : c.topic || c.user;

          if (this.props.filterFunc && this.props.filter) {
            const filterOn = [key];

            if (c.private && c.private.comment) {
              filterOn.push(('' + c.private.comment).toLowerCase());
            }

            if (c.public && c.public.fn) {
              filterOn.push(('' + c.public.fn).toLowerCase());
            }

            if (!this.props.filterFunc(this.props.filter, filterOn)) {
              return;
            }
          }

          const isChannel = tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default().isChannelTopicName(key);
          const selected = showCheckmark ? this.props.topicSelected.indexOf(key) > -1 : this.props.topicSelected === key;
          const badges = [];

          if (this.props.showMode) {
            if (key == this.props.myUserId) {
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

          const comment = Array.isArray(c.private) ? c.private.join(',') : c.private ? c.private.comment : null;
          let preview;
          let deliveryStatus;

          if (!this.props.showMode && c.latestMessage) {
            const msg = c.latestMessage(true);

            if (msg) {
              deliveryStatus = msg._status || c.msgStatus(msg, true);
              preview = typeof msg.content == 'string' ? msg.content.substr(0, _config_js__WEBPACK_IMPORTED_MODULE_6__.MESSAGE_PREVIEW_LENGTH) : tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.preview(msg.content, _config_js__WEBPACK_IMPORTED_MODULE_6__.MESSAGE_PREVIEW_LENGTH);
            }
          }

          contactNodes.push(react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_contact_jsx__WEBPACK_IMPORTED_MODULE_3__.default, {
            title: c.public ? c.public.fn : null,
            avatar: (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_5__.makeImageDataUrl)(c.public ? c.public.photo : null),
            comment: comment,
            preview: preview,
            received: deliveryStatus,
            unread: this.props.showUnread ? c.unread : 0,
            now: c.online && this.props.connected,
            acs: c.acs,
            showMode: this.props.showMode,
            badges: badges,
            showCheckmark: showCheckmark,
            selected: selected,
            showOnline: this.props.showOnline && !isChannel,
            isChannel: isChannel,
            onSelected: this.props.onTopicSelected,
            showContextMenu: this.props.showContextMenu,
            item: key,
            index: contactNodes.length,
            key: key
          }));
          contactsCount++;
        }
      }, this);
    }

    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: this.props.noScroll ? null : "scrollable-panel"
    }, contactsCount == 0 ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "center-medium-text",
      dangerouslySetInnerHTML: {
        __html: this.props.emptyListMessage
      }
    }) : null, contactNodes.length > 0 ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("ul", {
      className: "contact-box"
    }, contactNodes) : null);
  }

}

;
/* harmony default export */ __webpack_exports__["default"] = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(ContactList));

/***/ }),

/***/ "./src/widgets/contact.jsx":
/*!*********************************!*\
  !*** ./src/widgets/contact.jsx ***!
  \*********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _contact_badges_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./contact-badges.jsx */ "./src/widgets/contact-badges.jsx");
/* harmony import */ var _letter_tile_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./letter-tile.jsx */ "./src/widgets/letter-tile.jsx");
/* harmony import */ var _received_marker_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./received-marker.jsx */ "./src/widgets/received-marker.jsx");
/* harmony import */ var _unread_badge_jsx__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./unread-badge.jsx */ "./src/widgets/unread-badge.jsx");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! tinode-sdk */ "tinode-sdk");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _lib_utils_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../lib/utils.js */ "./src/lib/utils.js");








const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_1__.defineMessages)({
  drafty_image: {
    id: "drafty_image",
    defaultMessage: [{
      "type": 0,
      "value": "Picture"
    }]
  },
  drafty_form: {
    id: "drafty_form",
    defaultMessage: [{
      "type": 0,
      "value": "Form:"
    }]
  },
  drafty_attachment: {
    id: "drafty_attachment",
    defaultMessage: [{
      "type": 0,
      "value": "Attachment"
    }]
  }
});

class Contact extends (react__WEBPACK_IMPORTED_MODULE_0___default().Component) {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleContextClick = this.handleContextClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    e.stopPropagation();

    if (this.props.onSelected) {
      this.props.onSelected(this.props.item, this.props.index);
    }
  }

  handleContextClick(e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.showContextMenu({
      topicName: this.props.item,
      y: e.pageY,
      x: e.pageX
    });
  }

  render() {
    let title = this.props.title;

    if (!title) {
      title = react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
        id: "unnamed_topic",
        defaultMessage: [{
          "type": 0,
          "value": "Unnamed"
        }]
      }));
    } else if (title.length > 30) {
      title = title.substring(0, 28) + '…';
    }

    const online = this.props.now ? 'online' : 'offline';
    const avatar = this.props.avatar ? this.props.avatar : true;
    const badges = this.props.badges ? this.props.badges.slice() : [];
    const icon_badges = [];

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

    const subtitle = this.props.preview ? typeof this.props.preview == 'string' ? this.props.preview : react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, tinode_sdk__WEBPACK_IMPORTED_MODULE_6__.Drafty.format(this.props.preview, draftyFormatter, this)) : this.props.comment;
    const icon = (0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_7__.deliveryMarker)(this.props.received);
    const marker = icon ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: 'material-icons small space-right' + (icon.color ? ' ' + icon.color : '')
    }, icon.name) : null;
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("li", {
      className: !this.props.showCheckmark && this.props.selected ? 'selected' : null,
      onClick: this.handleClick
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "avatar-box"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_letter_tile_jsx__WEBPACK_IMPORTED_MODULE_3__.default, {
      avatar: avatar,
      title: this.props.title,
      topic: this.props.item
    }), this.props.showOnline ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
      className: online
    }) : this.props.showCheckmark && this.props.selected ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "checkmark material-icons"
    }, "check_circle") : null), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "text-box"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
      className: "contact-title"
    }, title), this.props.isChannel ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("img", {
      src: "/img/channel.png",
      className: "channel",
      alt: "channel"
    }) : null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_unread_badge_jsx__WEBPACK_IMPORTED_MODULE_5__.default, {
      count: this.props.unread
    }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_contact_badges_jsx__WEBPACK_IMPORTED_MODULE_2__.default, {
      badges: icon_badges
    })), this.props.showMode ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_contact_badges_jsx__WEBPACK_IMPORTED_MODULE_2__.default, {
      badges: badges
    })) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "contact-comment"
    }, marker, subtitle || '\u00A0')), this.props.showContextMenu ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
      className: "menuTrigger"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      onClick: this.handleContextClick
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "expand_more"))) : null);
  }

}

;

function draftyFormatter(style, data, values, key) {
  let el = tinode_sdk__WEBPACK_IMPORTED_MODULE_6__.Drafty.tagName(style);
  const attr = {
    key: key
  };

  if (el) {
    const {
      formatMessage
    } = this.props.intl;

    switch (style) {
      case 'BR':
        el = (react__WEBPACK_IMPORTED_MODULE_0___default().Fragment);
        values = [' '];
        break;

      case 'HL':
        attr.className = 'highlight preview';
        break;

      case 'LN':
        el = 'span';
        break;

      case 'IM':
        el = (react__WEBPACK_IMPORTED_MODULE_0___default().Fragment);
        values = [react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
          key: "im",
          className: "material-icons"
        }, "photo"), formatMessage(messages.drafty_image)];
        break;

      case 'BN':
        el = 'span';
        attr.className = 'flat-button faux';
        break;

      case 'FM':
        el = (react__WEBPACK_IMPORTED_MODULE_0___default().Fragment);
        values = [react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
          key: "fm",
          className: "material-icons"
        }, "dashboard"), formatMessage(messages.drafty_form)].concat(values || []);
        break;

      case 'RW':
        el = (react__WEBPACK_IMPORTED_MODULE_0___default().Fragment);
        break;

      case 'EX':
        if (data && data.mime == 'application/json') {
          return null;
        }

        el = (react__WEBPACK_IMPORTED_MODULE_0___default().Fragment);
        values = [react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
          key: "ex",
          className: "material-icons"
        }, "attachment"), formatMessage(messages.drafty_attachment)];
        break;

      default:
        if (el == '_UNKN') {
          el = (react__WEBPACK_IMPORTED_MODULE_0___default().Fragment);
          values = [react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
            key: "unkn",
            className: "material-icons"
          }, "extension")];
        }

        break;
    }

    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement(el, attr, values);
  } else {
    return values;
  }
}

;
/* harmony default export */ __webpack_exports__["default"] = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(Contact));

/***/ }),

/***/ "./src/widgets/context-menu.jsx":
/*!**************************************!*\
  !*** ./src/widgets/context-menu.jsx ***!
  \**************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "react-dom");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var _lib_navigation_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../lib/navigation.js */ "./src/lib/navigation.js");





const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_2__.defineMessages)({
  info: {
    id: "menu_item_info",
    defaultMessage: [{
      "type": 0,
      "value": "Info"
    }]
  },
  clear_messages: {
    id: "menu_item_clear_messages",
    defaultMessage: [{
      "type": 0,
      "value": "Clear messages"
    }]
  },
  clear_for_all: {
    id: "menu_item_clear_messages_for_all",
    defaultMessage: [{
      "type": 0,
      "value": "Clear for All"
    }]
  },
  delete: {
    id: "menu_item_delete",
    defaultMessage: [{
      "type": 0,
      "value": "Delete"
    }]
  },
  delete_for_all: {
    id: "menu_item_delete_for_all",
    defaultMessage: [{
      "type": 0,
      "value": "Delete for All"
    }]
  },
  send_retry: {
    id: "menu_item_send_retry",
    defaultMessage: [{
      "type": 0,
      "value": "Retry"
    }]
  },
  mute: {
    id: "menu_item_mute",
    defaultMessage: [{
      "type": 0,
      "value": "Mute"
    }]
  },
  unmute: {
    id: "menu_item_unmute",
    defaultMessage: [{
      "type": 0,
      "value": "Unmute"
    }]
  },
  topic_delete: {
    id: "menu_item_delete_topic",
    defaultMessage: [{
      "type": 0,
      "value": "Delete"
    }]
  },
  topic_delete_warning: {
    id: "topic_delete_warning",
    defaultMessage: [{
      "type": 0,
      "value": "Are you sure you want to delete this conversation?"
    }]
  },
  delete_messages_warning: {
    id: "delete_messages_warning",
    defaultMessage: [{
      "type": 0,
      "value": "Are you sure you want to delete all messages for everyone? It cannot be undone."
    }]
  },
  unblock: {
    id: "menu_item_unblock",
    defaultMessage: [{
      "type": 0,
      "value": "Unblock"
    }]
  },
  block: {
    id: "menu_item_block",
    defaultMessage: [{
      "type": 0,
      "value": "Block"
    }]
  },
  topic_block_warning: {
    id: "topic_block_warning",
    defaultMessage: [{
      "type": 0,
      "value": "Are you sure you want to block this conversation?"
    }]
  },
  member_delete: {
    id: "menu_item_member_delete",
    defaultMessage: [{
      "type": 0,
      "value": "Remove"
    }]
  },
  archive: {
    id: "menu_item_archive_topic",
    defaultMessage: [{
      "type": 0,
      "value": "Archive"
    }]
  },
  edit_permissions: {
    id: "menu_item_edit_permissions",
    defaultMessage: [{
      "type": 0,
      "value": "Edit permissions"
    }]
  },
  clear_messages_warning: {
    id: "clear_messages_warning",
    defaultMessage: [{
      "type": 0,
      "value": "Are you sure you want to clear all messages? It cannot be undone."
    }]
  }
});

class ContextMenu extends (react__WEBPACK_IMPORTED_MODULE_0___default().Component) {
  constructor(props) {
    super(props);
    const {
      formatMessage
    } = props.intl;
    this.handlePageClick = this.handlePageClick.bind(this);
    this.handleEscapeKey = this.handleEscapeKey.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.MenuItems = {
      'topic_info': {
        id: 'topic_info',
        title: formatMessage(messages.info),
        handler: null
      },
      'messages_clear': {
        id: 'messages_clear',
        title: formatMessage(messages.clear_messages),
        handler: (params, errorHandler) => {
          return props.onShowAlert(formatMessage(messages.clear_messages), formatMessage(messages.clear_messages_warning), () => {
            this.deleteMessages(true, false, params, errorHandler);
          }, null, true, null);
        }
      },
      'messages_clear_hard': {
        id: 'messages_clear_hard',
        title: formatMessage(messages.clear_for_all),
        handler: (params, errorHandler) => {
          return props.onShowAlert(formatMessage(messages.clear_for_all), formatMessage(message.delete_messages_warning), () => {
            return this.deleteMessages(true, true, params, errorHandler);
          }, null, true, null);
        }
      },
      'message_delete': {
        id: 'message_delete',
        title: formatMessage(messages.delete),
        handler: (params, errorHandler) => {
          return this.deleteMessages(false, false, params, errorHandler);
        }
      },
      'message_delete_hard': {
        id: 'message_delete_hard',
        title: formatMessage(messages.delete_for_all),
        handler: (params, errorHandler) => {
          return this.deleteMessages(false, true, params, errorHandler);
        }
      },
      'menu_item_send_retry': {
        id: 'menu_item_send_retry',
        title: formatMessage(messages.send_retry),
        handler: (params, errorHandler) => {
          return this.retryMessage(params, errorHandler);
        }
      },
      'topic_unmute': {
        id: 'topic_unmute',
        title: formatMessage(messages.unmute),
        handler: this.topicPermissionSetter.bind(this, '+P')
      },
      'topic_mute': {
        id: 'topic_mute',
        title: formatMessage(messages.mute),
        handler: this.topicPermissionSetter.bind(this, '-P')
      },
      'topic_unblock': {
        id: 'topic_unblock',
        title: formatMessage(messages.unblock),
        handler: this.topicPermissionSetter.bind(this, '+JP')
      },
      'topic_block': {
        id: 'topic_block',
        title: formatMessage(messages.block),
        handler: (params, errorHandler) => {
          return props.onShowAlert(formatMessage(messages.block), formatMessage(messages.topic_block_warning), () => {
            return this.topicPermissionSetter('-JP', params, errorHandler).then(ctrl => {
              this.props.onTopicRemoved(params.topicName);
              return ctrl;
            });
          }, null, true, null);
        }
      },
      'topic_delete': {
        id: 'topic_delete',
        title: formatMessage(messages.topic_delete),
        handler: (params, errorHandler) => {
          return props.onShowAlert(formatMessage(messages.topic_delete), formatMessage(messages.topic_delete_warning), () => {
            const topic = this.props.tinode.getTopic(params.topicName);

            if (!topic) {
              console.log("Topic not found: ", params.topicName);
              return;
            }

            return topic.delTopic(true).catch(err => {
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
        handler: (params, errorHandler) => {
          const topic = this.props.tinode.getTopic(params.topicName);

          if (!topic) {
            console.log("Topic not found: ", params.topicName);
            return;
          }

          return topic.archive(true).catch(err => {
            if (errorHandler) {
              errorHandler(err.message, 'err');
            }
          });
        }
      },
      'permissions': {
        id: 'permissions',
        title: formatMessage(messages.edit_permissions),
        handler: null
      },
      'member_delete': {
        id: 'member_delete',
        title: formatMessage(messages.member_delete),
        handler: (params, errorHandler) => {
          const topic = this.props.tinode.getTopic(params.topicName);

          if (!topic || !params.user) {
            console.log("Topic or user not found: '" + params.topicName + "', '" + params.user + "'");
            return;
          }

          return topic.delSubscription(params.user).catch(err => {
            if (errorHandler) {
              errorHandler(err.message, 'err');
            }
          });
        }
      },
      'member_mute': {
        id: 'member_mute',
        title: formatMessage(messages.mute),
        handler: this.topicPermissionSetter.bind(this, '-P')
      },
      'member_unmute': {
        id: 'member_unmute',
        title: formatMessage(messages.unmute),
        handler: this.topicPermissionSetter.bind(this, '+P')
      },
      'member_block': {
        id: 'member_block',
        title: formatMessage(messages.block),
        handler: this.topicPermissionSetter.bind(this, '-JP')
      },
      'member_unblock': {
        id: 'member_unblock',
        title: formatMessage(messages.unblock),
        handler: this.topicPermissionSetter.bind(this, '+JP')
      }
    };
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handlePageClick, false);
    document.addEventListener('keyup', this.handleEscapeKey, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handlePageClick, false);
    document.removeEventListener('keyup', this.handleEscapeKey, false);
  }

  handlePageClick(e) {
    if (react_dom__WEBPACK_IMPORTED_MODULE_1___default().findDOMNode(this).contains(e.target)) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    this.props.hide();
  }

  handleEscapeKey(e) {
    if (e.keyCode === 27) {
      this.props.hide();
    }
  }

  handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.hide();
    let item = this.props.items[e.currentTarget.dataset.id];

    if (typeof item == 'string') {
      item = this.MenuItems[item];
    }

    if (!item) {
      console.log("Invalid menu item ID", e.currentTarget.dataset.id);
    } else {
      this.props.onAction(item.id, item.handler(this.props.params, this.props.onError), this.props.params);
    }
  }

  deleteMessages(all, hard, params, errorHandler) {
    const topic = this.props.tinode.getTopic(params.topicName);

    if (!topic) {
      console.log("Topic not found: ", params.topicName);
      return;
    }

    if (!all && topic.cancelSend(params.seq)) {
      return;
    }

    const promise = all ? topic.delMessagesAll(hard) : topic.delMessagesList([params.seq], hard);
    return promise.catch(err => {
      if (errorHandler) {
        errorHandler(err.message, 'err');
      }
    });
  }

  retryMessage(params, errorHandler) {
    const topic = this.props.tinode.getTopic(params.topicName);

    if (!topic || !topic.flushMessage(params.seq)) {
      return;
    }

    const msg = topic.createMessage(params.content, false);
    return topic.publishDraft(msg).catch(err => {
      if (errorHandler) {
        errorHandler(err.message, 'err');
      }
    });
  }

  topicPermissionSetter(mode, params, errorHandler) {
    const topic = this.props.tinode.getTopic(params.topicName);

    if (!topic) {
      console.log("Topic not found", params.topicName);
      return;
    }

    let result = topic.updateMode(params.user, mode);

    if (errorHandler) {
      result = result.catch(err => {
        errorHandler(err.message, 'err');
      });
    }

    return result;
  }

  render() {
    let count = 0;
    let menu = [];
    this.props.items.map(item => {
      if (typeof item == 'string') {
        item = this.MenuItems[item];
      }

      if (item && item.title) {
        menu.push(item.title == '-' ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("li", {
          className: "separator",
          key: count
        }) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("li", {
          onClick: this.handleClick,
          "data-id": count,
          key: count
        }, item.title));
      }

      count++;
    });
    const hSize = 12 * _config_js__WEBPACK_IMPORTED_MODULE_3__.REM_SIZE;
    const vSize = _config_js__WEBPACK_IMPORTED_MODULE_3__.REM_SIZE * (0.7 + menu.length * 2.5);
    const left = this.props.bounds.right - this.props.clickAt.x < hSize ? this.props.clickAt.x - this.props.bounds.left - hSize : this.props.clickAt.x - this.props.bounds.left;
    const top = this.props.bounds.bottom - this.props.clickAt.y < vSize ? this.props.clickAt.y - this.props.bounds.top - vSize : this.props.clickAt.y - this.props.bounds.top;
    const position = {
      left: left + 'px',
      top: top + 'px'
    };
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("ul", {
      className: "menu",
      style: position
    }, menu);
  }

}

/* harmony default export */ __webpack_exports__["default"] = ((0,react_intl__WEBPACK_IMPORTED_MODULE_2__.injectIntl)(ContextMenu));

/***/ }),

/***/ "./src/widgets/doc-preview.jsx":
/*!*************************************!*\
  !*** ./src/widgets/doc-preview.jsx ***!
  \*************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ DocPreview; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _widgets_send_message_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../widgets/send-message.jsx */ "./src/widgets/send-message.jsx");
/* harmony import */ var _lib_strformat_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/strformat.js */ "./src/lib/strformat.js");





function iconFromMime(mime) {
  const mimeToIcon = {
    default: 'insert_drive_file',
    image: 'image',
    text: 'description',
    video: 'theaters'
  };
  return mimeToIcon[mime] || mimeToIcon[(mime || '').split('/')[0]] || mimeToIcon['default'];
}

class DocPreview extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
    this.handleSendDoc = this.handleSendDoc.bind(this);
  }

  handleSendDoc(caption) {
    this.props.onClose();
    this.props.onSendMessage(this.props.content.file);
  }

  render() {
    if (!this.props.content) {
      return null;
    }

    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "image-preview"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "image-preview-caption-panel"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, this.props.content.filename), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      onClick: e => {
        e.preventDefault();
        this.props.onClose();
      }
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons gray"
    }, "close"))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "image-preview-container"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "flex-column narrow"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons gray"
    }, iconFromMime(this.props.content.type)), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("b", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_content_type",
      defaultMessage: [{
        "type": 0,
        "value": "Content type:"
      }]
    })), " ", this.props.content.type || 'application/octet-stream'), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("b", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_size",
      defaultMessage: [{
        "type": 0,
        "value": "Size:"
      }]
    })), " ", (0,_lib_strformat_js__WEBPACK_IMPORTED_MODULE_3__.bytesToHumanSize)(this.props.content.size)))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_send_message_jsx__WEBPACK_IMPORTED_MODULE_2__.default, {
      noInput: true,
      onSendMessage: this.handleSendDoc,
      onError: this.props.onError
    }));
  }

}
;

/***/ }),

/***/ "./src/widgets/error-panel.jsx":
/*!*************************************!*\
  !*** ./src/widgets/error-panel.jsx ***!
  \*************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ ErrorPanel; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _menu_cancel_jsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./menu-cancel.jsx */ "./src/widgets/menu-cancel.jsx");


class ErrorPanel extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
    this.state = {
      show: false
    };
    this.hide = this.hide.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.level !== this.props.level) {
      this.setState({
        show: !!this.props.level
      });
    }
  }

  hide() {
    this.setState({
      show: false
    });

    if (this.props.onClearError) {
      this.props.onClearError();
    }
  }

  render() {
    const icons = {
      err: 'error',
      warn: 'warning',
      info: 'info'
    };
    const level = icons[this.props.level] || '';
    const className = 'info-box ' + level;
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: className
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "icon"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, level)), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, this.props.text, this.props.action ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      style: {
        whiteSpace: 'nowrap'
      },
      onClick: e => {
        e.preventDefault();
        this.props.action();
      }
    }, this.props.actionText)) : null), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "cancel"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_menu_cancel_jsx__WEBPACK_IMPORTED_MODULE_1__.default, {
      onCancel: this.hide
    })));
  }

}
;

/***/ }),

/***/ "./src/widgets/file-progress.jsx":
/*!***************************************!*\
  !*** ./src/widgets/file-progress.jsx ***!
  \***************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ FileProgress; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);


class FileProgress extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  render() {
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "uploader"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
      style: {
        width: this.props.progress * 100 + "%"
      }
    })), this.props.progress < 0.999 ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      onClick: e => {
        e.preventDefault();
        this.props.onCancel();
      }
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "close"), " ", react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "action_cancel",
      defaultMessage: [{
        "type": 0,
        "value": "cancel"
      }]
    })) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "upload_finishing",
      defaultMessage: [{
        "type": 0,
        "value": "finishing..."
      }]
    }));
  }

}

/***/ }),

/***/ "./src/widgets/group-manager.jsx":
/*!***************************************!*\
  !*** ./src/widgets/group-manager.jsx ***!
  \***************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _chip_input_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./chip-input.jsx */ "./src/widgets/chip-input.jsx");
/* harmony import */ var _contact_list_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./contact-list.jsx */ "./src/widgets/contact-list.jsx");




const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_1__.defineMessages)({
  no_contacts: {
    id: "no_contacts",
    defaultMessage: [{
      "type": 0,
      "value": "You have no contacts :-("
    }]
  },
  contacts_not_found_short: {
    id: "contacts_not_found_short",
    defaultMessage: [{
      "type": 0,
      "value": "No contacts match '"
    }, {
      "type": 1,
      "value": "query"
    }, {
      "type": 0,
      "value": "'"
    }]
  }
});

class GroupManager extends (react__WEBPACK_IMPORTED_MODULE_0___default().Component) {
  constructor(props) {
    super(props);
    this.state = {
      members: props.members,
      index: GroupManager.indexMembers(props.members),
      staticMembers: GroupManager.staticMembers(props.members, props.keepInitialMembers, props.requiredMember),
      contactFilter: '',
      noContactsMessage: props.intl.formatMessage(messages.no_contacts),
      selectedContacts: GroupManager.selectedContacts(props.members)
    };
    this.handleContactSelected = this.handleContactSelected.bind(this);
    this.handleMemberRemoved = this.handleMemberRemoved.bind(this);
    this.handleContactFilter = this.handleContactFilter.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  static indexMembers(members) {
    let index = {};
    members.map(m => {
      index[m.user] = {
        delta: 0,
        present: true
      };
    });
    return index;
  }

  static staticMembers(members, keepInitial, requiredMember) {
    let stat = [];
    members.map(m => {
      if (keepInitial || m.user == requiredMember) {
        stat.push(m.user);
      }
    });
    return stat;
  }

  static selectedContacts(members) {
    let sel = [];
    members.map(m => {
      sel.push(m.user);
    });
    return sel;
  }

  handleContactSelected(userId, index) {
    let status = this.state.index[userId];

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

    let m = this.state.members.slice();
    m.push(this.props.contacts[index]);
    const sel = GroupManager.selectedContacts(m);
    const i = this.state.index;
    i[userId] = status;
    this.setState({
      members: m,
      index: i,
      selectedContacts: sel
    });
  }

  handleMemberRemoved(userId, index) {
    const status = this.state.index[userId];

    if (!status || !status.present) {
      return;
    }

    status.present = false;
    status.delta -= 1;
    let m = this.state.members.slice();
    m.splice(index, 1);
    const sel = GroupManager.selectedContacts(m);
    const i = this.state.index;
    i[userId] = status;
    this.setState({
      members: m,
      index: i,
      selectedContacts: sel
    });
  }

  handleContactFilter(val) {
    const {
      formatMessage
    } = this.props.intl;
    const msg = !val ? formatMessage(messages.no_contacts) : formatMessage(messages.contacts_not_found_short, {
      query: val
    });
    this.setState({
      contactFilter: val,
      noContactsMessage: msg
    });
  }

  static doContactFiltering(filter, values) {
    if (filter) {
      for (let i = 0; i < values.length; i++) {
        if (values[i].indexOf(filter) >= 0) {
          return true;
        }
      }

      return false;
    }

    return true;
  }

  handleSubmit() {
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

  handleCancel() {
    this.props.onCancel();
  }

  render() {
    const {
      formatMessage
    } = this.props.intl;
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "group-manager"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      className: "small"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "title_group_members",
      defaultMessage: [{
        "type": 0,
        "value": "Group Members"
      }]
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_chip_input_jsx__WEBPACK_IMPORTED_MODULE_2__.default, {
      chips: this.state.members,
      staticMembers: this.state.staticMembers,
      prompt: "add members",
      filterFunc: this.handleContactFilter,
      onChipRemoved: this.handleMemberRemoved
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      className: "small"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "title_all_contacts",
      defaultMessage: [{
        "type": 0,
        "value": "All Contacts"
      }]
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_contact_list_jsx__WEBPACK_IMPORTED_MODULE_3__.default, {
      contacts: this.props.contacts,
      myUserId: this.props.myUserId,
      topicSelected: this.state.selectedContacts,
      filter: this.state.contactFilter,
      filterFunc: GroupManager.doContactFiltering,
      emptyListMessage: this.state.noContactsMessage,
      showOnline: false,
      showUnread: false,
      onTopicSelected: this.handleContactSelected
    }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "group-manager-buttons",
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
      className: "primary",
      onClick: this.handleSubmit
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "button_ok",
      defaultMessage: [{
        "type": 0,
        "value": "OK"
      }]
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
      className: "secondary",
      onClick: this.handleCancel
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "button_cancel",
      defaultMessage: [{
        "type": 0,
        "value": "Cancel"
      }]
    }))));
  }

}

;
/* harmony default export */ __webpack_exports__["default"] = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(GroupManager));

/***/ }),

/***/ "./src/widgets/group-subs.jsx":
/*!************************************!*\
  !*** ./src/widgets/group-subs.jsx ***!
  \************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ GroupSubs; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var _letter_tile_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./letter-tile.jsx */ "./src/widgets/letter-tile.jsx");
/* harmony import */ var _lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../lib/blob-helpers.js */ "./src/lib/blob-helpers.js");





class GroupSubs extends (react__WEBPACK_IMPORTED_MODULE_0___default().Component) {
  constructor(props) {
    super(props);
  }

  render() {
    const usersOnline = [];
    const totalCount = (this.props.subscribers || []).length;
    const countToShow = Math.min(_config_js__WEBPACK_IMPORTED_MODULE_2__.MAX_ONLINE_IN_TOPIC, totalCount);
    (this.props.subscribers || []).some(sub => {
      usersOnline.push(react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: "avatar-box",
        key: sub.user
      }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_letter_tile_jsx__WEBPACK_IMPORTED_MODULE_3__.default, {
        topic: sub.user,
        avatar: (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_4__.makeImageDataUrl)(sub.public ? sub.public.photo : null) || true,
        title: sub.public ? sub.public.fn : null
      })));
      return usersOnline.length == countToShow;
    });
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "topic-users"
    }, usersOnline, " ", totalCount > countToShow ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "more_online_members",
      defaultMessage: [{
        "type": 0,
        "value": "+"
      }, {
        "type": 1,
        "value": "overflow"
      }, {
        "type": 0,
        "value": " more"
      }],
      values: {
        overflow: totalCount - countToShow
      }
    })) : null);
  }

}
;

/***/ }),

/***/ "./src/widgets/host-selector.jsx":
/*!***************************************!*\
  !*** ./src/widgets/host-selector.jsx ***!
  \***************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ HostSelector; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../config.js */ "./src/config.js");


class HostSelector extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
    this.state = {
      hostName: props.serverAddress,
      changed: false
    };
    this.handleHostNameChange = this.handleHostNameChange.bind(this);
    this.handleEditingFinished = this.handleEditingFinished.bind(this);
  }

  handleHostNameChange(e) {
    this.setState({
      hostName: e.target.value,
      changed: true
    });
  }

  handleEditingFinished() {
    if (this.state.changed) {
      this.setState({
        changed: false
      });
      this.props.onServerAddressChange(this.state.hostName.trim());
    }
  }

  render() {
    var hostOptions = [];

    for (let key in _config_js__WEBPACK_IMPORTED_MODULE_1__.KNOWN_HOSTS) {
      let item = _config_js__WEBPACK_IMPORTED_MODULE_1__.KNOWN_HOSTS[key];
      hostOptions.push(react__WEBPACK_IMPORTED_MODULE_0___default().createElement("option", {
        key: item,
        value: item
      }));
    }

    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", {
      type: "search",
      id: "host-name",
      placeholder: this.props.hostName,
      list: "known-hosts",
      className: "quoted",
      value: this.state.hostName,
      onChange: this.handleHostNameChange,
      onBlur: this.handleEditingFinished,
      required: true
    }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("datalist", {
      id: "known-hosts"
    }, hostOptions));
  }

}

/***/ }),

/***/ "./src/widgets/image-preview.jsx":
/*!***************************************!*\
  !*** ./src/widgets/image-preview.jsx ***!
  \***************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ ImagePreview; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _widgets_send_message_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../widgets/send-message.jsx */ "./src/widgets/send-message.jsx");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var _lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../lib/blob-helpers.js */ "./src/lib/blob-helpers.js");
/* harmony import */ var _lib_strformat_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../lib/strformat.js */ "./src/lib/strformat.js");






class ImagePreview extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0
    };
    this.handleSendImage = this.handleSendImage.bind(this);
  }

  assignWidth(node) {
    if (node && !this.state.width) {
      const bounds = node.getBoundingClientRect();
      this.setState({
        width: bounds.width | 0,
        height: bounds.height | 0
      });
    }
  }

  handleSendImage(caption) {
    this.props.onClose();
    this.props.onSendMessage(caption, this.props.content.blob);
  }

  render() {
    if (!this.props.content) {
      return null;
    }

    const dim = (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_4__.fitImageSize)(this.props.content.width, this.props.content.height, this.state.width, this.state.height, false);
    const size = dim ? {
      width: dim.dstWidth + 'px',
      height: dim.dstHeight + 'px'
    } : this.props.content.width > this.props.content.height ? {
      width: '100%'
    } : {
      height: '100%'
    };
    size.maxWidth = '100%';
    size.maxHeight = '100%';
    let filename = this.props.content.filename;
    const maxlength = Math.max((this.state.width / _config_js__WEBPACK_IMPORTED_MODULE_3__.REM_SIZE / 1.5 | 0) - 2, 12);

    if (filename.length > maxlength) {
      filename = filename.slice(0, maxlength / 2 - 1) + '…' + filename.slice(1 - maxlength / 2);
    }

    const width = this.props.content.width || '-';
    const height = this.props.content.height || '-';
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "image-preview"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "image-preview-caption-panel"
    }, !this.props.onSendMessage ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: this.props.content.url,
      download: this.props.content.filename
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "file_download"), " ", react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "download_action",
      defaultMessage: [{
        "type": 0,
        "value": "download"
      }]
    })) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, this.props.content.filename), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      onClick: e => {
        e.preventDefault();
        this.props.onClose();
      }
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons gray"
    }, "close"))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "image-preview-container",
      ref: node => this.assignWidth(node)
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("img", {
      src: this.props.content.url,
      style: size,
      className: "image-preview",
      alt: this.props.content.filename
    })), this.props.onSendMessage ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_send_message_jsx__WEBPACK_IMPORTED_MODULE_2__.default, {
      messagePrompt: "add_image_caption",
      acceptBlank: true,
      onSendMessage: this.handleSendImage,
      onError: this.props.onError
    }) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "image-preview-footer"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("b", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_file_name",
      defaultMessage: [{
        "type": 0,
        "value": "File name:"
      }]
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
      title: this.props.content.filename
    }, filename ? filename : '-'))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("b", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_content_type",
      defaultMessage: [{
        "type": 0,
        "value": "Content type:"
      }]
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, this.props.content.type)), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("b", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_size",
      defaultMessage: [{
        "type": 0,
        "value": "Size:"
      }]
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, width, " \xD7 ", height, " px; ", (0,_lib_strformat_js__WEBPACK_IMPORTED_MODULE_5__.bytesToHumanSize)(this.props.content.size)))));
  }

}
;

/***/ }),

/***/ "./src/widgets/in-place-edit.jsx":
/*!***************************************!*\
  !*** ./src/widgets/in-place-edit.jsx ***!
  \***************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ InPlaceEdit; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "react-dom");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _visible_password_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./visible-password.jsx */ "./src/widgets/visible-password.jsx");



class InPlaceEdit extends (react__WEBPACK_IMPORTED_MODULE_0___default().Component) {
  constructor(props) {
    super(props);
    this.state = {
      active: props.active,
      initialValue: props.value || '',
      value: props.value || ''
    };
    this.handeTextChange = this.handeTextChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleStartEditing = this.handleStartEditing.bind(this);
    this.handleEditingFinished = this.handleEditingFinished.bind(this);
    this.handlePasswordFinished = this.handlePasswordFinished.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    const newValue = this.props.value || '';

    if (prevState.initialValue != newValue && !prevState.active) {
      this.setState({
        initialValue: newValue,
        value: newValue
      });
    }
  }

  handeTextChange(e) {
    this.setState({
      value: e.target.value
    });
  }

  handleKeyDown(e) {
    if (e.keyCode === 27) {
      this.setState({
        value: this.props.value,
        active: false
      });
    } else if (e.keyCode === 13) {
      this.handleEditingFinished(e);
    }
  }

  handleStartEditing() {
    if (!this.props.readOnly) {
      react_dom__WEBPACK_IMPORTED_MODULE_1___default().findDOMNode(this).focus();
      this.setState({
        active: true
      });
    }
  }

  handleEditingFinished(event) {
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
    let value = this.state.value.trim();

    if ((value || this.props.value) && value !== this.props.value) {
      this.props.onFinished(value);
    }
  }

  handlePasswordFinished(value) {
    this.setState({
      active: false
    });

    if (value && value !== this.props.value) {
      this.props.onFinished(value);
    }
  }

  render() {
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

    return this.state.active ? fieldType == 'password' ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_visible_password_jsx__WEBPACK_IMPORTED_MODULE_2__.default, {
      value: this.state.value,
      placeholder: this.props.placeholder,
      required: this.props.required ? 'required' : '',
      autoComplete: this.props.autoComplete,
      autoFocus: true,
      onFinished: this.handlePasswordFinished
    }) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", {
      type: fieldType,
      value: this.state.value,
      placeholder: this.props.placeholder,
      required: this.props.required ? 'required' : '',
      autoComplete: this.props.autoComplete,
      autoFocus: true,
      onChange: this.handeTextChange,
      onKeyDown: this.handleKeyDown,
      onBlur: this.handleEditingFinished
    }) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
      className: spanClass,
      onClick: this.handleStartEditing
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
      className: "content"
    }, spanText));
  }

}
;

/***/ }),

/***/ "./src/widgets/invitation.jsx":
/*!************************************!*\
  !*** ./src/widgets/invitation.jsx ***!
  \************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Invitation; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);


class Invitation extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
    this.handleButtonAction = this.handleButtonAction.bind(this);
  }

  handleButtonAction(evt, data) {
    evt.preventDefault();
    this.props.onAction(data);
  }

  render() {
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "accept-invite-panel"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "title"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "chat_invitation",
      defaultMessage: [{
        "type": 0,
        "value": "You are invited to start a new chat. What would you like to do?"
      }]
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "footer"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
      className: "primary",
      onClick: event => {
        this.handleButtonAction(event, "accept");
      }
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "chat_invitation_accept",
      defaultMessage: [{
        "type": 0,
        "value": "Accept"
      }]
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
      className: "secondary",
      onClick: event => {
        this.handleButtonAction(event, "delete");
      }
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "chat_invitation_ignore",
      defaultMessage: [{
        "type": 0,
        "value": "Ignore"
      }]
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
      className: "secondary",
      onClick: event => {
        this.handleButtonAction(event, "block");
      }
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "chat_invitation_block",
      defaultMessage: [{
        "type": 0,
        "value": "Block"
      }]
    }))));
  }

}
;

/***/ }),

/***/ "./src/widgets/letter-tile.jsx":
/*!*************************************!*\
  !*** ./src/widgets/letter-tile.jsx ***!
  \*************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ LetterTile; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tinode-sdk */ "tinode-sdk");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _lib_strformat_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/strformat.js */ "./src/lib/strformat.js");



class LetterTile extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  render() {
    let avatar;

    if (this.props.avatar === true) {
      const isGroup = tinode_sdk__WEBPACK_IMPORTED_MODULE_1___default().topicType(this.props.topic) == 'grp';
      const iconColor = (isGroup ? 'light-color' : 'dark-color') + Math.abs((0,_lib_strformat_js__WEBPACK_IMPORTED_MODULE_2__.stringHash)(this.props.topic)) % 16;

      if (this.props.topic && this.props.title && this.props.title.trim()) {
        const letter = this.props.title.trim().charAt(0);
        const className = 'lettertile ' + iconColor;
        avatar = react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
          className: className
        }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, letter));
      } else {
        const className = 'material-icons ' + iconColor;
        avatar = isGroup ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
          className: className
        }, "group") : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
          className: className
        }, "person");
      }
    } else if (this.props.avatar) {
      avatar = react__WEBPACK_IMPORTED_MODULE_0___default().createElement("img", {
        className: "avatar",
        alt: "avatar",
        src: this.props.avatar,
        onError: e => {
          e.target.onerror = null;
          e.target.src = "/img/broken_image.png";
        }
      });
    } else {
      avatar = null;
    }

    return avatar;
  }

}

/***/ }),

/***/ "./src/widgets/load-spinner.jsx":
/*!**************************************!*\
  !*** ./src/widgets/load-spinner.jsx ***!
  \**************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ LoadSpinner; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

class LoadSpinner extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  render() {
    return this.props.show ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "load-spinner-box"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "loader-spinner"
    })) : null;
  }

}

/***/ }),

/***/ "./src/widgets/menu-cancel.jsx":
/*!*************************************!*\
  !*** ./src/widgets/menu-cancel.jsx ***!
  \*************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ MenuCancel; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

class MenuCancel extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  render() {
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      onClick: e => {
        e.preventDefault();
        this.props.onCancel();
      }
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "close"));
  }

}

/***/ }),

/***/ "./src/widgets/menu-contacts.jsx":
/*!***************************************!*\
  !*** ./src/widgets/menu-contacts.jsx ***!
  \***************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ MenuContacts; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

class MenuContacts extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  render() {
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      onClick: e => {
        e.preventDefault();
        this.props.onNewTopic();
      }
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "chat")), "\xA0", react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      onClick: e => {
        e.preventDefault();
        this.props.onSettings();
      }
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "settings")));
  }

}
;

/***/ }),

/***/ "./src/widgets/menu-start.jsx":
/*!************************************!*\
  !*** ./src/widgets/menu-start.jsx ***!
  \************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ MenuStart; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

class MenuStart extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  render() {
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      onClick: e => {
        e.preventDefault();
        this.props.onSignUp();
      }
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "person_add")), "\xA0", react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      onClick: e => {
        e.preventDefault();
        this.props.onSettings();
      }
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "settings")));
  }

}
;

/***/ }),

/***/ "./src/widgets/more-button.jsx":
/*!*************************************!*\
  !*** ./src/widgets/more-button.jsx ***!
  \*************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ MoreButton; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

class MoreButton extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
    this.state = {
      open: props.open
    };
    this.handleToggle = this.handleToggle.bind(this);
  }

  handleToggle() {
    const open = !this.state.open;
    this.setState({
      open: open
    });

    if (this.props.onToggle) {
      this.props.onToggle(open);
    }
  }

  render() {
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      className: "small clean-clickable",
      onClick: this.handleToggle
    }, this.props.title, "...", this.state.open ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "expand_more") : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "chevron_right"));
  }

}

/***/ }),

/***/ "./src/widgets/new-topic-by-id.jsx":
/*!*****************************************!*\
  !*** ./src/widgets/new-topic-by-id.jsx ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);


const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_1__.defineMessages)({
  invalid_id: {
    id: "error_invalid_id",
    defaultMessage: [{
      "type": 0,
      "value": "Invalid ID"
    }]
  }
});

class NewTopicById extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
    this.state = {
      groupId: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({
      groupId: e.target.value
    });
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.handleSubmit(e);
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    if (this.state.groupId) {
      const name = this.state.groupId.trim();
      const prefix = name.substr(0, 3);

      if (name.length > 3 && ['usr', 'grp', 'chn'].includes(prefix)) {
        this.props.onSubmit(name);
      } else {
        this.props.onError(this.props.intl.formatMessage(messages.invalid_id), 'err');
      }
    }
  }

  render() {
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "group_user_id_prompt",
      defaultMessage: [{
        "type": 0,
        "value": "Group or User ID"
      }]
    }, prompt => react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", {
      type: "text",
      placeholder: prompt,
      value: this.state.groupId,
      onChange: this.handleChange,
      onKeyPress: this.handleKeyPress,
      required: true,
      autoFocus: true
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "dialog-buttons"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
      className: "primary",
      onClick: this.handleSubmit
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "button_subscribe",
      defaultMessage: [{
        "type": 0,
        "value": "Subscribe"
      }]
    }))));
  }

}

;
/* harmony default export */ __webpack_exports__["default"] = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(NewTopicById));

/***/ }),

/***/ "./src/widgets/new-topic-group.jsx":
/*!*****************************************!*\
  !*** ./src/widgets/new-topic-group.jsx ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ NewTopicGroup; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _avatar_upload_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./avatar-upload.jsx */ "./src/widgets/avatar-upload.jsx");
/* harmony import */ var _checkbox_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./checkbox.jsx */ "./src/widgets/checkbox.jsx");
/* harmony import */ var _tag_manager_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./tag-manager.jsx */ "./src/widgets/tag-manager.jsx");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../config.js */ "./src/config.js");






class NewTopicGroup extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
    this.state = {
      fn: '',
      private: '',
      imageDataUrl: null,
      tags: [],
      isChannel: false
    };
    this.handleFnChange = this.handleFnChange.bind(this);
    this.handlePrivateChange = this.handlePrivateChange.bind(this);
    this.handleImageChanged = this.handleImageChanged.bind(this);
    this.handleTagsChanged = this.handleTagsChanged.bind(this);
    this.handleChannelToggle = this.handleChannelToggle.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleFnChange(e) {
    this.setState({
      fn: e.target.value
    });
  }

  handlePrivateChange(e) {
    this.setState({
      private: e.target.value
    });
  }

  handleImageChanged(img) {
    this.setState({
      imageDataUrl: img
    });
  }

  handleTagsChanged(tags) {
    this.setState({
      tags: tags
    });
  }

  handleChannelToggle() {
    this.setState({
      isChannel: !this.state.isChannel
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const fn = this.state.fn.trim().substring(0, _config_js__WEBPACK_IMPORTED_MODULE_5__.MAX_TITLE_LENGTH);
    const comment = this.state.private.trim().substring(0, _config_js__WEBPACK_IMPORTED_MODULE_5__.MAX_TITLE_LENGTH);

    if (fn) {
      this.props.onSubmit(fn, this.state.imageDataUrl, comment, this.state.tags, this.state.isChannel);
    }
  }

  render() {
    let submitClasses = 'primary';

    if (this.props.disabled) {
      submitClasses += ' disabled';
    }

    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("form", {
      className: "panel-form",
      onSubmit: this.handleSubmit
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-column"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      className: "small",
      htmlFor: "new-topic-fn"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_topic_name",
      defaultMessage: [{
        "type": 0,
        "value": "Name"
      }]
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "topic_name_editing_placeholder",
      defaultMessage: [{
        "type": 0,
        "value": "Freeform name of the group"
      }]
    }, placeholder => react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", {
      type: "text",
      id: "new-topic-fn",
      placeholder: placeholder,
      value: this.state.fn,
      onChange: this.handleFnChange,
      autoFocus: true,
      required: true
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("br", null), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      className: "small",
      htmlFor: "new-topic-priv"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_private",
      defaultMessage: [{
        "type": 0,
        "value": "Private comment"
      }]
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "private_editing_placeholder",
      defaultMessage: [{
        "type": 0,
        "value": "Visible to you only"
      }]
    }, placeholder => react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", {
      type: "text",
      id: "new-topic-priv",
      placeholder: placeholder,
      value: this.state.private,
      onChange: this.handlePrivateChange
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_avatar_upload_jsx__WEBPACK_IMPORTED_MODULE_2__.default, {
      onError: this.props.onError,
      onImageChanged: this.handleImageChanged
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_checkbox_jsx__WEBPACK_IMPORTED_MODULE_3__.default, {
      checked: this.state.isChannel,
      onChange: this.handleChannelToggle
    }), "\xA0", react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      onClick: this.handleChannelToggle
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "channel_prompt",
      defaultMessage: [{
        "type": 0,
        "value": "This is a channel"
      }]
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "title_tag_manager",
      defaultMessage: [{
        "type": 0,
        "value": "Tags (user discovery)"
      }]
    }, title => react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_tag_manager_jsx__WEBPACK_IMPORTED_MODULE_4__.default, {
      tags: this.state.tags,
      activated: true,
      onTagsChanged: this.handleTagsChanged,
      tinode: this.props.tinode,
      title: title
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "dialog-buttons"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
      className: submitClasses
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "button_create",
      defaultMessage: [{
        "type": 0,
        "value": "Create"
      }]
    }))));
  }

}
;

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
    let idx = mode.indexOf(val);

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
    var mode = (this.state.mode || 'N').split('').sort().join('');
    var before = (this.props.mode || 'N').split('').sort().join('');

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
      }, skip.indexOf(c) < 0 ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_checkbox_jsx__WEBPACK_IMPORTED_MODULE_2__.default, {
        name: c,
        checked: mode.indexOf(c) >= 0,
        onChange: this.handleChange
      }) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_checkbox_jsx__WEBPACK_IMPORTED_MODULE_2__.default, {
        name: c,
        checked: mode.indexOf(c) >= 0
      })), this.props.compare ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("td", {
        className: "checkbox"
      }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_checkbox_jsx__WEBPACK_IMPORTED_MODULE_2__.default, {
        name: c,
        checked: compare.indexOf(c) >= 0
      })) : null));
    }

    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-column"
    }, this.props.userTitle ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("ul", {
      className: "contact-box"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_contact_jsx__WEBPACK_IMPORTED_MODULE_3__.default, {
      item: this.props.item,
      title: this.props.userTitle,
      avatar: (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_4__.makeImageDataUrl)(this.props.userAvatar ? this.props.userAvatar : null)
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

/***/ }),

/***/ "./src/widgets/received-marker.jsx":
/*!*****************************************!*\
  !*** ./src/widgets/received-marker.jsx ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tinode-sdk */ "tinode-sdk");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _lib_strformat_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/strformat.js */ "./src/lib/strformat.js");
/* harmony import */ var _lib_utils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../lib/utils.js */ "./src/lib/utils.js");





const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_1__.defineMessages)({
  message_sending: {
    id: "message_sending",
    defaultMessage: [{
      "type": 0,
      "value": "sending..."
    }]
  },
  message_sending_failed: {
    id: "message_sending_failed",
    defaultMessage: [{
      "type": 0,
      "value": "failed"
    }]
  }
});

class ReceivedMarker extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  render() {
    const {
      formatMessage
    } = this.props.intl;
    let timestamp;

    if (this.props.received <= (tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default().MESSAGE_STATUS_SENDING)) {
      timestamp = formatMessage(messages.message_sending);
    } else if (this.props.received == (tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default().MESSAGE_STATUS_FAILED)) {
      timestamp = formatMessage(messages.message_sending_failed);
    } else {
      timestamp = (0,_lib_strformat_js__WEBPACK_IMPORTED_MODULE_3__.shortDateFormat)(this.props.timestamp, this.props.intl.locale);
    }

    const icon = (0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_4__.deliveryMarker)(this.props.received);
    const marker = icon ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: 'material-icons small ' + icon.color
    }, icon.name) : null;
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
      className: "timestamp"
    }, timestamp, '\u00a0', marker);
  }

}

;
/* harmony default export */ __webpack_exports__["default"] = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(ReceivedMarker));

/***/ }),

/***/ "./src/widgets/search-contacts.jsx":
/*!*****************************************!*\
  !*** ./src/widgets/search-contacts.jsx ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ SearchContacts; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tinode-sdk */ "tinode-sdk");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__);



class SearchContacts extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
    this.state = {
      edited: false,
      search: ''
    };
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentWillUnmount() {
    if (this.state.edited) {
      this.setState({
        search: '',
        edited: false
      });
      this.props.onSearchContacts((tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default().DEL_CHAR));
    }
  }

  handleSearchChange(e) {
    this.setState({
      search: e.target.value
    });
  }

  handleSearch(e) {
    e.preventDefault();
    var query = this.state.search.trim();
    this.setState({
      edited: query.length > 0
    });
    this.props.onSearchContacts(query.length > 0 ? query : (tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default().DEL_CHAR));
  }

  handleClear(e) {
    e.preventDefault();

    if (this.state.edited) {
      this.props.onSearchContacts((tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default().DEL_CHAR));
    }

    this.setState({
      search: '',
      edited: false
    });
  }

  handleKeyDown(e) {
    if (e.key === 'Enter') {
      this.handleSearch(e);
    } else if (e.key === 'Escape') {
      this.handleClear();
    }
  }

  render() {
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons search"
    }, "search"), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "search_placeholder",
      defaultMessage: [{
        "type": 0,
        "value": "List like email:alice@example.com, tel:17025550003..."
      }]
    }, search_placeholder => react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", {
      className: "search",
      type: "text",
      placeholder: search_placeholder,
      value: this.state.search,
      onChange: this.handleSearchChange,
      onKeyDown: this.handleKeyDown,
      required: true,
      autoFocus: true
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      onClick: this.handleClear
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "close"))));
  }

}
;

/***/ }),

/***/ "./src/widgets/send-message.jsx":
/*!**************************************!*\
  !*** ./src/widgets/send-message.jsx ***!
  \**************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tinode-sdk */ "tinode-sdk");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var _lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../lib/blob-helpers.js */ "./src/lib/blob-helpers.js");





const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_1__.defineMessages)({
  messaging_disabled: {
    id: "messaging_disabled_prompt",
    defaultMessage: [{
      "type": 0,
      "value": "Messaging disabled"
    }]
  },
  type_new_message: {
    id: "new_message_prompt",
    defaultMessage: [{
      "type": 0,
      "value": "New message"
    }]
  },
  add_image_caption: {
    id: "image_caption_prompt",
    defaultMessage: [{
      "type": 0,
      "value": "Image caption"
    }]
  },
  file_attachment_too_large: {
    id: "file_attachment_too_large",
    defaultMessage: [{
      "type": 0,
      "value": "The file size "
    }, {
      "type": 1,
      "value": "size"
    }, {
      "type": 0,
      "value": " exceeds the "
    }, {
      "type": 1,
      "value": "limit"
    }, {
      "type": 0,
      "value": " limit."
    }]
  },
  cannot_initiate_upload: {
    id: "cannot_initiate_file_upload",
    defaultMessage: [{
      "type": 0,
      "value": "Cannot initiate file upload."
    }]
  }
});

class SendMessage extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      keypressTimestamp: new Date().getTime() - _config_js__WEBPACK_IMPORTED_MODULE_3__.KEYPRESS_DELAY - 1
    };
    this.handlePasteEvent = this.handlePasteEvent.bind(this);
    this.handleAttachImage = this.handleAttachImage.bind(this);
    this.handleAttachFile = this.handleAttachFile.bind(this);
    this.handleSend = this.handleSend.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleMessageTyping = this.handleMessageTyping.bind(this);
  }

  componentDidMount() {
    if (this.messageEditArea) {
      this.messageEditArea.addEventListener('paste', this.handlePasteEvent, false);
    }
  }

  componentWillUnmount() {
    if (this.messageEditArea) {
      this.messageEditArea.removeEventListener('paste', this.handlePasteEvent, false);
    }
  }

  componentDidUpdate() {
    if (this.messageEditArea) {
      this.messageEditArea.focus();
    }
  }

  handlePasteEvent(e) {
    if (this.props.disabled) {
      return;
    }

    if ((0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_4__.filePasted)(e, (bits, mime, width, height, fname) => {
      this.props.onAttachImage(mime, bits, width, height, fname);
    }, (mime, bits, fname) => {
      this.props.onAttachFile(mime, bits, fname);
    }, this.props.onError)) {
      e.preventDefault();
    }
  }

  handleAttachImage(e) {
    if (e.target.files && e.target.files.length > 0) {
      this.props.onAttachImage(e.target.files[0]);
    }

    e.target.value = '';
  }

  handleAttachFile(e) {
    const {
      formatMessage
    } = this.props.intl;

    if (e.target.files && e.target.files.length > 0) {
      this.props.onAttachFile(e.target.files[0]);
    }

    e.target.value = '';
  }

  handleSend(e) {
    e.preventDefault();
    const message = this.state.message.trim();

    if (message || this.props.acceptBlank || this.props.noInput) {
      this.props.onSendMessage(message);
      this.setState({
        message: ''
      });
    }
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      if (!e.shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        this.handleSend(e);
      }
    }
  }

  handleMessageTyping(e) {
    const newState = {
      message: e.target.value
    };

    if (this.props.onKeyPress) {
      const now = new Date().getTime();

      if (now - this.state.keypressTimestamp > _config_js__WEBPACK_IMPORTED_MODULE_3__.KEYPRESS_DELAY) {
        this.props.onKeyPress();
        newState.keypressTimestamp = now;
      }
    }

    this.setState(newState);
  }

  render() {
    const {
      formatMessage
    } = this.props.intl;
    const prompt = this.props.disabled ? formatMessage(messages.messaging_disabled) : this.props.messagePrompt ? formatMessage(messages[this.props.messagePrompt]) : formatMessage(messages.type_new_message);
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "send-message-panel"
    }, !this.props.disabled ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, this.props.onAttachFile ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      onClick: e => {
        e.preventDefault();
        this.attachImage.click();
      },
      title: "Add image"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons secondary"
    }, "photo")), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      onClick: e => {
        e.preventDefault();
        this.attachFile.click();
      },
      title: "Attach file"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons secondary"
    }, "attach_file"))) : null, this.props.noInput ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "hr thin"
    }) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("textarea", {
      id: "sendMessage",
      placeholder: prompt,
      value: this.state.message,
      onChange: this.handleMessageTyping,
      onKeyPress: this.handleKeyPress,
      ref: ref => {
        this.messageEditArea = ref;
      },
      autoFocus: true
    }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      onClick: this.handleSend,
      title: "Send"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "send")), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", {
      type: "file",
      ref: ref => {
        this.attachFile = ref;
      },
      onChange: this.handleAttachFile,
      style: {
        display: 'none'
      }
    }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", {
      type: "file",
      ref: ref => {
        this.attachImage = ref;
      },
      accept: "image/*",
      onChange: this.handleAttachImage,
      style: {
        display: 'none'
      }
    })) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "writing-disabled"
    }, prompt));
  }

}

;
/* harmony default export */ __webpack_exports__["default"] = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(SendMessage));

/***/ }),

/***/ "./src/widgets/side-navbar.jsx":
/*!*************************************!*\
  !*** ./src/widgets/side-navbar.jsx ***!
  \*************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ SideNavbar; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _letter_tile_jsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./letter-tile.jsx */ "./src/widgets/letter-tile.jsx");
/* harmony import */ var _button_back_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./button-back.jsx */ "./src/widgets/button-back.jsx");
/* harmony import */ var _menu_contacts_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./menu-contacts.jsx */ "./src/widgets/menu-contacts.jsx");
/* harmony import */ var _menu_start_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./menu-start.jsx */ "./src/widgets/menu-start.jsx");





class SideNavbar extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  render() {
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "side-caption-panel",
      className: "caption-panel"
    }, this.props.onCancel ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_button_back_jsx__WEBPACK_IMPORTED_MODULE_2__.default, {
      onBack: this.props.onCancel
    }) : null, this.props.avatar ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "self-avatar",
      className: "avatar-box"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_letter_tile_jsx__WEBPACK_IMPORTED_MODULE_1__.default, {
      avatar: this.props.avatar,
      topic: this.props.myUserId,
      title: this.props.title
    })) : null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "sidepanel-title",
      className: "panel-title"
    }, this.props.title), this.props.state === 'login' ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_menu_start_jsx__WEBPACK_IMPORTED_MODULE_4__.default, {
      onSignUp: this.props.onSignUp,
      onSettings: this.props.onSettings
    }) : this.props.state === 'contacts' ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_menu_contacts_jsx__WEBPACK_IMPORTED_MODULE_3__.default, {
      onNewTopic: this.props.onNewTopic,
      onSettings: this.props.onSettings
    }) : null);
  }

}
;

/***/ }),

/***/ "./src/widgets/tag-manager.jsx":
/*!*************************************!*\
  !*** ./src/widgets/tag-manager.jsx ***!
  \*************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ TagManager; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _chip_input_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./chip-input.jsx */ "./src/widgets/chip-input.jsx");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var _lib_utils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../lib/utils.js */ "./src/lib/utils.js");





class TagManager extends (react__WEBPACK_IMPORTED_MODULE_0___default().Component) {
  constructor(props) {
    super(props);
    this.state = {
      tags: this.props.tags,
      tagInput: '',
      activated: this.props.activated
    };
    this.handleTagInput = this.handleTagInput.bind(this);
    this.handleAddTag = this.handleAddTag.bind(this);
    this.handleRemoveTag = this.handleRemoveTag.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!(0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_4__.arrayEqual)(nextProps.tags, prevState.tags) && !prevState.activated) {
      return {
        tags: nextProps.tags
      };
    }

    return null;
  }

  handleTagInput(text) {
    this.setState({
      tagInput: text
    });

    if (text.length > 0) {
      const last = text[text.length - 1];

      if (text[0] == '"') {
        if (text.length > 1 && last == '"') {
          this.handleAddTag(text.substring(1, text.length - 1));
        }
      } else if (last == ',' || last == ' ' || last == ';' || last == '"') {
        this.handleAddTag(text.substring(0, text.length - 1).trim());
      }
    }
  }

  handleAddTag(tag) {
    const maxTagCount = this.props.tinode.getServerLimit('maxTagCount', _config_js__WEBPACK_IMPORTED_MODULE_3__.MAX_TAG_COUNT);

    if (tag.length > 0 && this.state.tags.length < maxTagCount) {
      const tags = this.state.tags.slice(0);
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

  handleRemoveTag(tag, index) {
    const tags = this.state.tags.slice(0);
    tags.splice(index, 1);
    this.setState({
      tags: tags
    });

    if (this.props.onTagsChanged) {
      this.props.onTagsChanged(tags);
    }
  }

  handleSubmit() {
    this.props.onSubmit(this.handleAddTag(this.state.tagInput.trim()));
    this.setState({
      activated: false,
      tags: this.props.tags
    });
  }

  handleCancel() {
    this.setState({
      activated: false,
      tagInput: '',
      tags: this.props.tags
    });

    if (this.props.onCancel) {
      this.props.onCancel();
    }
  }

  render() {
    const minTagLength = this.props.tinode.getServerLimit('minTagLength', _config_js__WEBPACK_IMPORTED_MODULE_3__.MIN_TAG_LENGTH);
    const maxTagLength = this.props.tinode.getServerLimit('maxTagLength', _config_js__WEBPACK_IMPORTED_MODULE_3__.MAX_TAG_LENGTH);
    let tags = [];

    if (this.state.activated) {
      this.state.tags.map(tag => {
        tags.push({
          user: tag,
          invalid: tag.length < minTagLength || tag.length > maxTagLength
        });
      });
    } else {
      this.state.tags.map(tag => {
        tags.push(react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
          className: "badge",
          key: tags.length
        }, tag));
      });

      if (tags.length == 0) {
        tags = react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
          id: "tags_not_found",
          defaultMessage: [{
            "type": 0,
            "value": "No tags defined. Add some."
          }]
        }));
      }
    }

    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-column"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      className: "small"
    }, this.props.title)), this.state.activated ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "tags_editor_no_tags",
      defaultMessage: [{
        "type": 0,
        "value": "Add some tags"
      }]
    }, add_tags_prompt => react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_chip_input_jsx__WEBPACK_IMPORTED_MODULE_2__.default, {
      chips: tags,
      avatarDisabled: true,
      prompt: add_tags_prompt,
      onEnter: this.handleAddTag,
      onFocusLost: this.handleAddTag,
      onCancel: this.handleCancel,
      onChipRemoved: this.handleRemoveTag,
      filterFunc: this.handleTagInput
    })), this.props.onSubmit || this.props.onCancel ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "tag-manager-buttons",
      className: "dialog-buttons panel-form-row"
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
    }))) : null) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "quoted"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      className: "flat-button",
      onClick: e => {
        e.preventDefault();
        this.setState({
          activated: true
        });
      }
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "edit"), " \xA0", react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "title_manage_tags",
      defaultMessage: [{
        "type": 0,
        "value": "Manage"
      }]
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, tags)));
  }

}
;

/***/ }),

/***/ "./src/widgets/unread-badge.jsx":
/*!**************************************!*\
  !*** ./src/widgets/unread-badge.jsx ***!
  \**************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ UnreadBadge; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

class UnreadBadge extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  render() {
    return this.props.count > 0 ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
      className: "unread"
    }, this.props.count > 9 ? "9+" : this.props.count) : null;
  }

}
;

/***/ }),

/***/ "./src/widgets/uploading-image.jsx":
/*!*****************************************!*\
  !*** ./src/widgets/uploading-image.jsx ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ UploadingImage; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _file_progress_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./file-progress.jsx */ "./src/widgets/file-progress.jsx");



class UploadingImage extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
  }

  render() {
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "inline-image"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement('img', this.props), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "rounded-container"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_file_progress_jsx__WEBPACK_IMPORTED_MODULE_2__.default, {
      progress: this.props.progress,
      onCancel: this.props.onCancelUpload
    })));
  }

}
;

/***/ }),

/***/ "./src/widgets/visible-password.jsx":
/*!******************************************!*\
  !*** ./src/widgets/visible-password.jsx ***!
  \******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ VisiblePassword; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

class VisiblePassword extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value,
      visible: false
    };
    this.handleVisibility = this.handleVisibility.bind(this);
    this.handeTextChange = this.handeTextChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleEditingFinished = this.handleEditingFinished.bind(this);
  }

  handeTextChange(e) {
    this.setState({
      value: e.target.value
    });

    if (this.props.onChange) {
      this.props.onChange(e);
    }
  }

  handleVisibility(e) {
    e.preventDefault();
    this.setState({
      visible: !this.state.visible
    });
  }

  handleKeyDown(e) {
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

  handleEditingFinished(e) {
    if (e) {
      let currentTarget = e.currentTarget;
      setTimeout(() => {
        if (!currentTarget.contains(document.activeElement)) {
          if (this.props.onFinished) {
            this.props.onFinished(this.state.value);
          }
        }
      }, 0);
    } else if (this.props.onFinished) {
      this.props.onFinished(this.state.value.trim());
    }
  }

  render() {
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      tabIndex: "-1",
      className: "group-focus",
      onBlur: this.handleEditingFinished
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", {
      className: "with-visibility",
      type: this.state.visible ? "text" : "password",
      value: this.state.value,
      placeholder: this.props.placeholder,
      required: this.props.required ? 'required' : '',
      autoFocus: this.props.autoFocus ? 'autoFocus' : '',
      autoComplete: this.props.autoComplete,
      onChange: this.handeTextChange,
      onKeyDown: this.handleKeyDown
    }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
      onClick: this.handleVisibility
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons clickable light-gray"
    }, this.state.visible ? 'visibility' : 'visibility_off')));
  }

}

/***/ }),

/***/ "./src/messages.json":
/*!***************************!*\
  !*** ./src/messages.json ***!
  \***************************/
/***/ (function(module) {

module.exports = JSON.parse('{"de":{"validate_credential_action":"bestätigen","title_tag_manager":"Schlagworte (Nutzer entdecken)","label_user_contacts":"Kontakte:","button_add_another":"Hinzufügen","label_message_sound":"Benachrichtigungston:","label_push_notifications":"Benachrichtigungsmeldungen:","label_push_notifications_disabled":"Benachrichtigungsmeldungen (erfordert HTTPS):","label_incognito_mode":"inkognito-Modus:","delete_account":"Konto löschen","delete_account_arning":"Möchten Sie das Konto wirklich löschen? Das kann nicht rückgängig gemacht werden","label_password":"Passwort","password_unchanged_prompt":"unverändert","button_logout":"Abmelden","button_delete_account":"Konto löschen","label_default_access_mode":"Standard Zugriffsmodus:","blocked_contacts_link":"Blockierte Kontakte ({count})","link_contact_us":"Kontakt","link_terms_of_service":"Nutzungsbedingungen","link_privacy_policy":"Datenschutzerklärung","label_sdk":"SDK:","label_server_address":"Server Adresse:","archived_contacts":"Archivierte Kontakte ({count})","contacts_not_found":"Sie haben keine Unterhaltungen<br />¯∖_(ツ)_/¯","full_name_prompt":"Vollständiger Name, z.B. Lisa Musterfrau","email_prompt":"E-Mail, z.B. lisam@beispiel.de","button_sign_up":"Anmelden","label_your_name":"Ihr Name","label_user_id":"ID:","button_edit":"Bearbeiten","requested_permissions":"Angefordert","granted_permissions":"Erteilt","menu_item_edit_permissions":"Berechtigungen ändern","label_other_user":"Andere","action_clear_messages":"Nachrichten leeren","clear_messages_warning":"Sind Sie sicher, dass Sie diese Unterhaltung für alle leeren wollen? Das kann nicht rückgängig gemacht werden.","action_delete_messages":"Nachrichten für alle löschen","delete_messages_warning":"Sind Sie sicher, dass Sie diese Unterhaltung für alle löschen wollen? Das kann nicht rückgängig gemacht werden.","action_leave_chat":"Unterhaltung verlassen","leave_chat_warning":"Möchten Sie diese Unterhaltung wirklich verlassen?","action_block_contact":"Kontakt blockieren","block_contact_warning":"Möchten Sie diesen Kontakt wirklich blockieren?","action_report_chat":"Unterhaltung melden","report_chat_warning":"Möchten Sie diese Unterhaltung wirklich blockieren und melden?","title_info":"Info","label_topic_name":"Name","label_private":"Privater Kommentar","private_editing_placeholder":"Nur für Sie sichtbar","label_muting_topic":"Stumm geschaltet:","action_more":"Mehr","label_your_permissions":"Ihre Berechtigungen:","label_permissions":"Berechtigungen:","label_you":"Sie:","label_default_access":"Standard Zugriffsmodus:","label_group_members":"Gruppenmitglieder:","button_add_members":"Mitglieder hinzufügen","group_has_no_members":"Keine Mitglieder","login_prompt":"Anmelden","password_prompt":"Passwort","stay_logged_in":"Angemeldet bleiben","forgot_password_link":"Passwort vergessen?","button_sign_in":"Anmelden","label_client":"Client:","label_server":"Server:","online_now":"jetzt online","last_seen_timestamp":"Zuletzt gesehen","title_not_found":"Nicht gefunden","unnamed_topic":"Unbenannt","messages_not_readable":"Neue Nachrichten können nicht gelesen werden","peers_messaging_disabled":"Gruppennachrichten sind deaktiviert","enable_peers_messaging":"Aktivieren","search_for_contacts":"Nutzen Sie die Suche um Kontakte zu finden","search_no_results":"Die Suche hatte keine Ergebnisse","tabtitle_find_user":"Suchen","tabtitle_new_group":"Neue Gruppe","tabtitle_group_by_id":"nach ID","new_password_placeholder":"Geben Sie ein neues Passwort ein","label_reset_password":"Passwort per E-Mail wiederherstellen:","credential_email_prompt":"E-Mail Adresse für Registrierung","button_reset":"Zurücksetzen","button_send_request":"Anfrage senden","label_server_to_use":"Server verwenden:","label_wire_transport":"Übertragung per Kabel:","button_update":"Aktualisieren","sidepanel_title_login":"Anmelden","sidepanel_title_register":"Konto erstellen","sidepanel_title_settings":"Einstellungen","sidepanel_title_account_settings":"Konto-Einstellungen","sidepanel_title_acc_general":"Allgemein","sidepanel_title_acc_security":"Sicherheit","sidepanel_title_acc_notifications":"Benachrichtigungen","sidepanel_title_acc_support":"Unterstützung","sidepanel_title_newtpk":"Neue Unterhaltung starten","sidepanel_title_cred":"Anmeldeinformationen bestätigen","sidepanel_title_reset":"Passwort zurücksetzen","sidepanel_title_archive":"Archivierte Unterhaltungen","sidepanel_title_blocked":"Blockierte Unterhaltungen","reconnect_countdown":"Getrennt. Wiederverbinden in {seconds}…","reconnect_now":"Jetzt probieren","push_init_failed":"Initialisierung von Push-Benachrichtigungen fehlgeschlagen","invalid_security_token":"Ungültiger Sicherheitsschlüssel","no_connection":"Keine Verbindung","code_doesnot_match":"Code stimmt nicht überein","update_available":"Aktualisierung verfügbar.","reload_update":"Neu laden","phone_dative":"Telefon","email_dative":"E-Mail","enter_confirmation_code_prompt":"Geben Sie den Bestätigungscode ein, der per {method} geschickt wurde:","numeric_confirmation_code_prompt":"Nur zahlen","button_confirm":"Bestätigen","save_attachment":"Speichern","deleted_content":"Inhalt gelöscht","invalid_content":"ungültiger Inhalt","user_not_found":"Nicht gefunden","badge_you":"Sie","badge_owner":"Besitzer","menu_item_info":"Info","menu_item_clear_messages":"Nachrichten leeren","menu_item_clear_messages_for_all":"Für alle leeren","menu_item_delete":"Löschen","menu_item_delete_for_all":"Für alle löschen","menu_item_send_retry":"Wiederholen","menu_item_mute":"Unterhaltung stumm schalten","menu_item_unmute":"Stumm schalten beenden","menu_item_delete_topic":"Entfernen","topic_delete_warning":"Möchten Sie diese Unterhaltung wirklich löschen?","menu_item_unblock":"Blockierung aufheben","menu_item_block":"Blockieren","topic_block_warning":"Möchten Sie diese Unterhaltung wirklich blockieren?","menu_item_member_delete":"Entfernen","menu_item_archive_topic":"Archivieren","action_cancel":"Abbrechen","upload_finishing":"wird abgeschlossen...","no_contacts":"Sie haben keine Kontakte :-(","contacts_not_found_short":"Keine Kontakte für \'\'{query}\'\'","title_group_members":"Gruppenmitglieder","title_all_contacts":"Alle Kontakte","button_ok":"OK","button_cancel":"Abbrechen","more_online_members":"+{overflow} mehr","download_action":"herunterladen","label_file_name":"Dateiname:","label_content_type":"Inhaltsart:","label_size":"Größe:","chat_invitation":"Sie sind eingeladen, an einem neuen Chat teilzunehmen. Was möchten Sie tun?","chat_invitation_accept":"Akzeptieren","chat_invitation_ignore":"Ignorieren","chat_invitation_block":"Blockieren","error_invalid_id":"ungültige ID","group_user_id_prompt":"Gruppe oder Benutzer ID","button_subscribe":"Abbonieren","topic_name_editing_placeholder":"Freiform Name der Gruppe","button_create":"Erstellen","permission_join":"Beitreten ({val})","permission_read":"Lesen ({val})","permission_write":"Schreiben ({val})","permission_pres":"Benachrichtigt werden ({val})","permission_admin":"Bestätigen ({val})","permission_share":"Teilen ({val})","permission_delete":"Entfernen ({val})","permission_owner":"Besitzer ({val})","title_permissions":"Berechtigungen","message_sending":"wird gesendet...","message_sending_failed":"fehlgeschlagen","search_placeholder":"Liste: email:lisa@beispiel.de, tel:17025550003...","messaging_disabled_prompt":"Nachrichtenübermittlung deaktiviert","new_message_prompt":"Neue Nachricht","image_caption_prompt":"Bildunterschrift","file_attachment_too_large":"Die Dateigröße {size} überschreitet das Limit von {limit}.","cannot_initiate_file_upload":"Datei kann nicht hochgeladen werden.","tags_not_found":"Keine Schlagworte definiert. Erstellen Sie welche.","tags_editor_no_tags":"Schlagworte hinzufügen","title_manage_tags":"Verwalten","channel_prompt":"Dies ist ein Sender","channel":"Sender","drafty_attachment":"Dateianhang","drafty_form":"Formular:","drafty_image":"Bild"},"en":{"action_block_contact":"Block Contact","action_cancel":"cancel","action_clear_messages":"Clear Messages","action_delete_messages":"Clear Messages for All","action_leave_chat":"Leave Conversation","action_more":"More","action_report_chat":"Report Conversation","archived_contacts":"Archived contacts ({count})","badge_owner":"owner","badge_you":"you","block_contact_warning":"Are you sure you want to block this contact?","blocked_contacts_link":"Blocked contacts ({count})","button_add_another":"Add another","button_add_members":"Add members","button_cancel":"Cancel","button_confirm":"Confirm","button_create":"Create","button_delete_account":"Delete account","button_edit":"Edit","button_logout":"Logout","button_ok":"OK","button_reset":"Reset","button_send_request":"Send request","button_sign_in":"Sign in","button_sign_up":"Sign up","button_subscribe":"Subscribe","button_update":"Update","cannot_initiate_file_upload":"Cannot initiate file upload.","channel":"channel","channel_prompt":"This is a channel","chat_invitation":"You are invited to start a new chat. What would you like to do?","chat_invitation_accept":"Accept","chat_invitation_block":"Block","chat_invitation_ignore":"Ignore","clear_messages_warning":"Are you sure you want to clear all messages? It cannot be undone.","code_doesnot_match":"Code does not match","contacts_not_found":"You have no chats<br />¯∖_(ツ)_/¯","contacts_not_found_short":"No contacts match \'\'{query}\'\'","credential_email_prompt":"Your registration email","delete_account":"Delete account","delete_account_arning":"Are you sure you want to delete your account? It cannot be undone.","delete_messages_warning":"Are you sure you want to delete all messages for everyone? It cannot be undone.","deleted_content":"content deleted","download_action":"download","drafty_attachment":"Attachment","drafty_form":"Form:","drafty_image":"Picture","email_dative":"email","email_prompt":"Email, e.g. jdoe@example.com","enable_peers_messaging":"Enable","enter_confirmation_code_prompt":"Enter confirmation code sent to you by {method}:","error_invalid_id":"Invalid ID","file_attachment_too_large":"The file size {size} exceeds the {limit} limit.","forgot_password_link":"Forgot password?","full_name_prompt":"Full name, e.g. John Doe","granted_permissions":"Granted","group_has_no_members":"No members","group_user_id_prompt":"Group or User ID","image_caption_prompt":"Image caption","invalid_content":"invalid content","invalid_security_token":"Invalid security token","label_client":"Client:","label_content_type":"Content type:","label_default_access":"Default access mode:","label_default_access_mode":"Default access mode:","label_file_name":"File name:","label_group_members":"Group members:","label_incognito_mode":"Incognito mode:","label_message_sound":"Message sound:","label_muting_topic":"Muted:","label_other_user":"Other","label_password":"Password","label_permissions":"Permissions:","label_private":"Private comment","label_push_notifications":"Notification alerts:","label_push_notifications_disabled":"Notification alerts (requires HTTPS):","label_reset_password":"Send a password reset email:","label_sdk":"SDK:","label_server":"Server:","label_server_address":"Server address:","label_server_to_use":"Server to use:","label_size":"Size:","label_topic_name":"Name","label_user_contacts":"Contacts:","label_user_id":"ID:","label_wire_transport":"Wire transport:","label_you":"You:","label_your_name":"Your name","label_your_permissions":"Your permissions:","last_seen_timestamp":"Last seen","leave_chat_warning":"Are you sure you want to leave this conversation?","link_contact_us":"Contact Us","link_privacy_policy":"Privacy Policy","link_terms_of_service":"Terms of Service","login_prompt":"Login","menu_item_archive_topic":"Archive","menu_item_block":"Block","menu_item_clear_messages":"Clear messages","menu_item_clear_messages_for_all":"Clear for All","menu_item_delete":"Delete","menu_item_delete_for_all":"Delete for All","menu_item_delete_topic":"Delete","menu_item_edit_permissions":"Edit permissions","menu_item_info":"Info","menu_item_member_delete":"Remove","menu_item_mute":"Mute","menu_item_send_retry":"Retry","menu_item_unblock":"Unblock","menu_item_unmute":"Unmute","message_sending":"sending...","message_sending_failed":"failed","messages_not_readable":"no access to messages","messaging_disabled_prompt":"Messaging disabled","more_online_members":"+{overflow} more","new_message_prompt":"New message","new_password_placeholder":"Enter new password","no_connection":"No connection","no_contacts":"You have no contacts :-(","numeric_confirmation_code_prompt":"Numbers only","online_now":"online now","password_prompt":"Password","password_unchanged_prompt":"Unchanged","peers_messaging_disabled":"Peer\'s messaging is disabled.","permission_admin":"Approve ({val})","permission_delete":"Delete ({val})","permission_join":"Join ({val})","permission_owner":"Owner ({val})","permission_pres":"Get notified ({val})","permission_read":"Read ({val})","permission_share":"Share ({val})","permission_write":"Write ({val})","phone_dative":"phone","private_editing_placeholder":"Visible to you only","push_init_failed":"Failed to initialize push notifications","reconnect_countdown":"Disconnected. Reconnecting in {seconds}…","reconnect_now":"Try now","reload_update":"Reload","report_chat_warning":"Are you sure you want to block and report this conversation?","requested_permissions":"Requested","save_attachment":"save","search_for_contacts":"Use search to find contacts","search_no_results":"Search returned no results","search_placeholder":"List like email:alice@example.com, tel:17025550003...","sidepanel_title_acc_general":"General","sidepanel_title_acc_notifications":"Notifications","sidepanel_title_acc_security":"Security","sidepanel_title_acc_support":"Support","sidepanel_title_account_settings":"Account Settings","sidepanel_title_archive":"Archived Chats","sidepanel_title_blocked":"Blocked Chats","sidepanel_title_cred":"Confirm Credentials","sidepanel_title_login":"Sign In","sidepanel_title_newtpk":"Start New Chat","sidepanel_title_register":"Create Account","sidepanel_title_reset":"Reset Password","sidepanel_title_settings":"Settings","stay_logged_in":"Stay logged in","tabtitle_find_user":"find","tabtitle_group_by_id":"by id","tabtitle_new_group":"new group","tags_editor_no_tags":"Add some tags","tags_not_found":"No tags defined. Add some.","title_all_contacts":"All Contacts","title_group_members":"Group Members","title_info":"Info","title_manage_tags":"Manage","title_not_found":"Not found","title_permissions":"Permissions","title_tag_manager":"Tags (user discovery)","topic_block_warning":"Are you sure you want to block this conversation?","topic_delete_warning":"Are you sure you want to delete this conversation?","topic_name_editing_placeholder":"Freeform name of the group","unnamed_topic":"Unnamed","update_available":"Update available.","upload_finishing":"finishing...","user_not_found":"Not found","validate_credential_action":"confirm"},"es":{"validate_credential_action":"confirmar","title_tag_manager":"Etiquetas (descubrimiento de usuarios)","label_user_contacts":"Contactos:","button_add_another":"Añadir contacto","label_message_sound":"Sonido de mensaje:","label_push_notifications":"Alertas de notificaciones:","label_push_notifications_disabled":"Alertas de notificaciones (requiere HTTPS):","label_incognito_mode":"Modo incógnito:","delete_account":"Eliminar cuenta","delete_account_arning":"¿Estás seguro de que deseas eliminar permanentemente tu cuenta? Esta acción es irreversible.","label_password":"Contraseña","password_unchanged_prompt":"Sin cambios","button_logout":"Cerrar sesión","button_delete_account":"Eliminar cuenta","label_default_access_mode":"Modo de acceso predeterminado:","blocked_contacts_link":"Contactos bloqueados ({count})","link_contact_us":"Contáctanos","link_terms_of_service":"Términos de uso","link_privacy_policy":"Política de privacidad","label_sdk":"SDK:","label_server_address":"Dirección del servidor:","archived_contacts":"Contactos archivados ({count})","contacts_not_found":"No tienes chats<br />¯∖_(ツ)_/¯","full_name_prompt":"Nombre completo, p.ej. Juan González Hernández","email_prompt":"Correo electrónico, p.ej. juan@example.com","button_sign_up":"Regístrate","label_your_name":"Tu nombre","label_user_id":"ID:","button_edit":"Editar","requested_permissions":"Solicitados","granted_permissions":"Otorgados","menu_item_edit_permissions":"Editar permisos","label_other_user":"Otros","action_clear_messages":"Borrar mensajes","clear_messages_warning":"¿Estás seguro de que quieres eliminar todos los mensajes? Esta acción es irreversible.","action_delete_messages":"Borrar mensajes para todos","delete_messages_warning":"¿Estás seguro de que quieres eliminar todos los mensajes para todos? Esta acción es irreversible.","action_leave_chat":"Dejar conversación","leave_chat_warning":"¿Estás seguro de que quieres dejar esta conversación?","action_block_contact":"Bloquear contacto","block_contact_warning":"¿Estás seguro de que quieres bloquear a este contacto?","action_report_chat":"Reportar conversación","report_chat_warning":"¿Estás seguro de que quieres bloquear y reportar a esta conversación?","title_info":"Información","label_topic_name":"Nombre del tema","label_private":"Comentario privado","private_editing_placeholder":"Sólo visible para tí","label_muting_topic":"Silenciado:","action_more":"Más","label_your_permissions":"Tus permisos:","label_permissions":"Permisos:","label_you":"Tú:","label_default_access":"Modo de acceso predeterminado:","label_group_members":"Miembros del grupo:","button_add_members":"Añadir miembros","group_has_no_members":"No hay miembros","login_prompt":"Nombre de usuario","password_prompt":"Contraseña","stay_logged_in":"Permanecer conectado","forgot_password_link":"¿Olvidaste tu contraseña?","button_sign_in":"Entrar","label_client":"Cliente:","label_server":"Servidor:","online_now":"en línea","last_seen_timestamp":"Últ. vez","title_not_found":"No encontrado","unnamed_topic":"Sin nombre","messages_not_readable":"sin acceso a mensajes","peers_messaging_disabled":"La mensajería Peer está deshabilitada.","enable_peers_messaging":"Habilitar","search_for_contacts":"Usa la búsqueda para encontrar contactos","search_no_results":"La búsqueda no arrojó resultados","tabtitle_find_user":"encontrar","tabtitle_new_group":"nuevo grupo","tabtitle_group_by_id":"por ID","new_password_placeholder":"Introduzca una nueva contraseña","label_reset_password":"Enviar un correo electrónico de restablecimiento de contraseña:","credential_email_prompt":"Tu correo electrónico de registro","button_reset":"Restablecer","button_send_request":"Enviar petición","label_server_to_use":"Servidor para usar:","label_wire_transport":"Transporte de alambre:","button_update":"Actualizar","sidepanel_title_login":"Iniciar sesión","sidepanel_title_register":"Crear cuenta","sidepanel_title_settings":"Ajustes","sidepanel_title_account_settings":"Ajustes de la cuenta","sidepanel_title_acc_general":"General","sidepanel_title_acc_security":"Seguridad","sidepanel_title_acc_notifications":"Notificaciones","sidepanel_title_acc_support":"Soporte","sidepanel_title_newtpk":"Iniciar un nuevo chat","sidepanel_title_cred":"Confirmar credenciales","sidepanel_title_reset":"Restablecer contraseña","sidepanel_title_archive":"Chats archivados","sidepanel_title_blocked":"Chats bloqueados","update_available":"Actualización disponible.","reload_update":"Recargar","reconnect_countdown":"Desconectado. Reconectando en {seconds}…","reconnect_now":"Reintentar","push_init_failed":"Error al inicializar las notificaciones push","invalid_security_token":"Token de seguridad inválido","no_connection":"Sin conexión","code_doesnot_match":"El código no coincide","phone_dative":"teléfono","email_dative":"correo electrónico","enter_confirmation_code_prompt":"Introduzca el código de confirmación enviado a tu {method}:","numeric_confirmation_code_prompt":"Sólo números","button_confirm":"Confirmar","save_attachment":"guardar","deleted_content":"este mensaje fue eliminado","invalid_content":"contenido inválido","user_not_found":"Usuario no encontrado","badge_you":"tú","badge_owner":"propietario","menu_item_info":"Información","menu_item_clear_messages":"Borrar mensajes","menu_item_clear_messages_for_all":"Borrar para todos","menu_item_delete":"Eliminar","menu_item_delete_for_all":"Eliminar para todos","menu_item_send_retry":"Inténtalo de nuevo","menu_item_mute":"Silenciar","menu_item_unmute":"Anular el silencio","menu_item_delete_topic":"Eliminar","topic_delete_warning":"¿Estás seguro de que quieres eliminar esta conversación?","menu_item_unblock":"Desbloquear","menu_item_block":"Bloquear","topic_block_warning":"¿Estás seguro de que quieres bloquear esta conversación","menu_item_member_delete":"Eliminar","menu_item_archive_topic":"Archivar","action_cancel":"cancelar","upload_finishing":"terminando...","no_contacts":"No tienes contactos :-(","contacts_not_found_short":"Ningún contacto coincide con \'\'{query}\'\'","title_group_members":"Miembros del grupo","title_all_contacts":"Todos los contactos","button_ok":"OK","button_cancel":"Cancelar","more_online_members":"+{overflow} más","download_action":"descargar","label_file_name":"Nombre del archivo:","label_content_type":"Tipo de contenido:","label_size":"Tamaño:","chat_invitation":"Estás invitado a participar en un nuevo chat. ¿Qué te gustaría hacer?","chat_invitation_accept":"Aceptar","chat_invitation_ignore":"Ignorar","chat_invitation_block":"Bloquear","error_invalid_id":"ID inválido","group_user_id_prompt":"ID del grupo o usuario","button_subscribe":"Suscribirse","topic_name_editing_placeholder":"Nombre del grupo","button_create":"Crear","permission_join":"Unirse ({val})","permission_read":"Leer ({val})","permission_write":"Escribir ({val})","permission_pres":"Ser notificado ({val})","permission_admin":"Approbar ({val})","permission_share":"Compartir ({val})","permission_delete":"Eliminar ({val})","permission_owner":"Propietario ({val})","title_permissions":"Permisos","message_sending":"enviando...","message_sending_failed":"no se pudo enviar el mensaje","search_placeholder":"Ej. email:alice@example.com, tel:17025550003...","messaging_disabled_prompt":"El envío de mensajes está deshabilitado","new_message_prompt":"Nuevo mensaje","image_caption_prompt":"Añade un comentario","file_attachment_too_large":"El tamaño del archivo {size} excede el límite de {limit}.","cannot_initiate_file_upload":"No se pudo iniciar la carga del archivo.","tags_not_found":"No hay etiquetas definidas. Añade unas.","tags_editor_no_tags":"Añadir etiquetas","title_manage_tags":"Gestionar","channel_prompt":"Este es un canal","channel":"canal","drafty_attachment":"Archivo","drafty_form":"Formulario:","drafty_image":"Imagen"},"ko":{"validate_credential_action":"확인","title_tag_manager":"태그(사용자검색)","label_user_contacts":"연락처: ","button_add_another":"다른항목추가","label_message_sound":"메시지소리: ","label_push_notifications":"통지경보: ","label_push_notifications_disabled":"통지경보(HTTPS필요): ","label_incognito_mode":"시크릿모드: ","delete_account":"계정삭제","delete_account_arning":"계정을삭제하시겠습니까?실행취소할수없습니다.","label_password":"비밀번호","password_unchanged_prompt":"변경되지않음","button_logout":"로그아웃","button_delete_account":"계정삭제","label_default_access_mode":"기본액세스모드: ","blocked_contacts_link":"차단된연락처({수})","link_contact_us":"문의처","link_terms_of_service":"서비스약관","link_privacy_policy":"개인정보보호정책","label_sdk":"SDK:","label_server_address":"서버주소: ","archived_contacts":"보관된연락처({수})","contacts_not_found":"채팅이없습니다<br/>¯∖_(ツ)_/¯","full_name_prompt":"전체이름(예:홍길동)","email_prompt":"이메일(예:hong@example.com)","button_sign_up":"가입","label_your_name":"이름","label_user_id":"ID:","button_edit":"편집","requested_permissions":"요청","menu_item_edit_permissions":"편집권한","label_other_user":"기타","action_clear_messages":"메시지지우기","clear_messages_warning":"모든메시지를지우시겠습니까?실행취소할수없습니다.","action_delete_messages":"모든메시지지우기","delete_messages_warning":"모든사람의모든메시지를삭제하시겠습니까?실행취소할수없습니다.","action_leave_chat":"대화나누기","leave_chat_warning":"이대화를나가시겠습니까?","action_block_contact":"연락차단","block_contact_warning":"이연락처를차단하시겠습니까?","action_report_chat":"대화기록","report_chat_warning":"이대화를차단하고기록하시겠습니까?","title_info":"정보","label_topic_name":"이름","label_private":"개인코멘트","private_editing_placeholder":"나만볼수있습니다","label_muting_topic":"음소거: ","action_more":"더보기","label_your_permissions":"권한: ","label_permissions":"권한: ","label_you":"당신: ","label_default_access":"기본액세스모드: ","label_group_members":"그룹회원: ","button_add_members":"회원추가","group_has_no_members":"회원없음","login_prompt":"로그인","password_prompt":"비밀번호","stay_logged_in":"로그인상태유지","forgot_password_link":"비밀번호를잊으셨습니까?","button_sign_in":"로그인","label_client":"클라이언트: ","label_server":"서버: ","online_now":"현재접속중","last_seen_timestamp":"마지막으로본","title_not_found":"찾을수없음","unnamed_topic":"이름없는","peers_messaging_disabled":"동료의메시지가비활성화되었습니다.","enable_peers_messaging":"활성화","search_for_contacts":"검색을사용하여연락처찾기","search_no_results":"검색결과가없습니다","tabtitle_find_user":"찾기","tabtitle_new_group":"새그룹","tabtitle_group_by_id":"id로","new_password_placeholder":"새비밀번호입력","label_reset_password":"비밀번호재설정이메일보내기: ","credential_email_prompt":"등록이메일","button_reset":"재설정","button_send_request":"요청보내기","label_server_to_use":"사용할서버:","label_wire_transport":"와이어수송:","button_update":"업데이트","sidepanel_title_login":"로그인","sidepanel_title_register":"계정만들기","sidepanel_title_settings":"설정","sidepanel_title_account_settings":"계정설정","sidepanel_title_acc_general":"일반","sidepanel_title_acc_security":"보안","sidepanel_title_acc_notifications":"알림","sidepanel_title_acc_support":"지원","sidepanel_title_newtpk":"새채팅시작","sidepanel_title_cred":"자격증명확인","sidepanel_title_reset":"비밀번호재설정","sidepanel_title_archive":"보관된채팅","sidepanel_title_blocked":"차단된채팅","update_available":"업데이트가능.","reload_update":"재로드","reconnect_countdown":"연결이끊어졌습니다.다시연결하는중{초}…","reconnect_now":"지금시도","push_init_failed":"푸시알림을초기화하지못했습니다","invalid_security_token":"유효하지않은보안토큰","no_connection":"연결없음","code_doesnot_match":"코드가일치하지않습니다","phone_dative":"전화","email_dative":"이메일","enter_confirmation_code_prompt":"{방법}으로보낸확인코드를입력하십시오:","numeric_confirmation_code_prompt":"숫자만","button_confirm":"확인","save_attachment":"저장","invalid_content":"잘못된내용","user_not_found":"찾을수없음","badge_you":"당신","badge_owner":"소유자","menu_item_info":"정보","menu_item_clear_messages":"메시지지우기","menu_item_clear_messages_for_all":"모두지우기","menu_item_delete":"삭제","menu_item_delete_for_all":"모두삭제","menu_item_send_retry":"다시시도","menu_item_mute":"음소거","menu_item_unmute":"음소거해제","menu_item_delete_topic":"삭제","topic_delete_warning":"이대화를삭제하시겠습니까?","menu_item_unblock":"차단해제","menu_item_block":"차단","topic_block_warning":"이대화를차단하시겠습니까?","menu_item_member_delete":"제거","menu_item_archive_topic":"보관","action_cancel":"취소","upload_finishing":"마무리...","no_contacts":"연락처가없습니다 (._.)","contacts_not_found_short":"\'{문의}\'와일치하는연락처가없습니다.","title_group_members":"그룹구성원","title_all_contacts":"모든연락처","button_ok":"OK","button_cancel":"취소","more_online_members":"+{넘침}더보기","download_action":"다운로드","label_file_name":"파일이름: ","label_content_type":"컨텐츠유형: ","label_size":"크기: ","chat_invitation":"새로운대화를시작하도록초대되었습니다.무엇을하시겠습니까?","chat_invitation_accept":"수락","chat_invitation_ignore":"무시","chat_invitation_block":"차단","error_invalid_id":"잘못된ID","group_user_id_prompt":"그룹또는사용자ID","button_subscribe":"구독","topic_name_editing_placeholder":"그룹의자유형이름","button_create":"작성","permission_join":"참여({val})","permission_read":"읽기({val})","permission_write":"쓰기({val})","permission_pres":"알림받기({val})","permission_admin":"승인({val})","permission_share":"공유({val})","permission_delete":"삭제({val})","permission_owner":"소유자({val})","title_permissions":"권한","message_sending":"보내기...","message_sending_failed":"실패","search_placeholder":"email:alice@example.com,tel:17025550003...와같은목록","messaging_disabled_prompt":"메시지비활성화","new_message_prompt":"새메시지","image_caption_prompt":"이미지설명","file_attachment_too_large":"파일크기{크기}이(가){제한}제한을초과합니다.","cannot_initiate_file_upload":"파일업로드를시작할수없습니다.","tags_not_found":"태그가정의되지않았습니다.일부를추가하십시오.","tags_editor_no_tags":"일부태그추가","title_manage_tags":"관리","granted_permissions":"승낙하다","messages_not_readable":"메시지에 액세스 할 수 없습니다","deleted_content":"내용이 삭제되었습니다","channel_prompt":"이 채널입니다","channel":"채널","drafty_attachment":"부착","drafty_form":"형태:","drafty_image":"이미지"},"ro":{"validate_credential_action":"confirmă","title_tag_manager":"Tag-uri (user discovery)","label_user_contacts":"Contacte:","button_add_another":"Adaugă","label_message_sound":"Sunet de mesaj:","label_push_notifications":"Alerte de notificare:","label_push_notifications_disabled":"Alerte de notificare (necesită HTTPS):","label_incognito_mode":"Mod incognito:","delete_account":"Șterge contul","delete_account_arning":"Ești sigur că dorești să ștergi contul? Acesta nu va putea fi recuperat.","label_password":"Parola","password_unchanged_prompt":"Neschimbată","button_logout":"Deconectare","button_delete_account":"Șterge cont","label_default_access_mode":"Default access mode:","blocked_contacts_link":"Contact blocate ({count})","link_contact_us":"Contactează-ne","link_terms_of_service":"Termenii Serviciului","link_privacy_policy":"Politica de Confidențialitate","label_sdk":"SDK:","label_server_address":"Adresa serverului:","archived_contacts":"Contacte arhivate ({count})","contacts_not_found":"Nu ai contacte salvate<br />¯∖_(ツ)_/¯","full_name_prompt":"Numele tău","email_prompt":"Adresa de e-mail","button_sign_up":"Creează cont","label_your_name":"Numele tău","label_user_id":"ID:","button_edit":"Editează","requested_permissions":"Necesare","granted_permissions":"Oferite","menu_item_edit_permissions":"Editează permisiuni","label_other_user":"Altele","action_clear_messages":"Șterge mesajele","clear_messages_warning":"Ești sigur că dorești să ștergi mesajele? Acestea nu pot fi recuperate.","action_delete_messages":"Șterge toate mesajele","delete_messages_warning":"Ești sigur că dorești să șterge mesajele din toate conversațiile? Acestea nu pot fi recuperate.","action_leave_chat":"Ieși din conversație","leave_chat_warning":"Ești sigur că dorești să ieși din conersație?","action_block_contact":"Blochează contact","block_contact_warning":"Ești sigur că dorești să blochezi acest contact?","action_report_chat":"Raportează conversația","report_chat_warning":"Ești sigur că dorești să blochezi și să raportezi această conversație?","title_info":"Info","label_topic_name":"Nume","label_private":"Comentariu privat","private_editing_placeholder":"Vizibil doar ție","label_muting_topic":"Mod silențios (muted):","action_more":"Mai multe","label_your_permissions":"Permisiuniile tale:","label_permissions":"Permisiuni:","label_you":"Tu:","label_default_access":"Modul default:","label_group_members":"Membrii grupului:","button_add_members":"Adaugă persoane","group_has_no_members":"În acest grup nu se află persoane","login_prompt":"Conectează-te","password_prompt":"Parola","stay_logged_in":"Rămâi conectat","forgot_password_link":"Ți-ai uitat parola?","button_sign_in":"Conectează-te","label_client":"Client:","label_server":"Server:","online_now":"online acum","last_seen_timestamp":"Văzut ultima dată","title_not_found":"Nu a fost găsit","channel":"canal","unnamed_topic":"Nedenumit","messages_not_readable":"Mesajele nu pot fi citite","peers_messaging_disabled":"Mesageria de tip Peer este dezactivată.","enable_peers_messaging":"Activează","search_for_contacts":"Caută în contacte","search_no_results":"Nu s-au găsit rezultate","tabtitle_find_user":"caută","tabtitle_new_group":"grup nou","tabtitle_group_by_id":"după id","new_password_placeholder":"Introdu parolă","label_reset_password":"Resetează parola:","credential_email_prompt":"Adresa de e-mail","button_reset":"Resetează","button_send_request":"Trimite cerere","label_server_to_use":"Server de utilizat:","label_wire_transport":"Transportul legat:","button_update":"Actualizează","sidepanel_title_login":"Conectează-te","sidepanel_title_register":"Creează Cont","sidepanel_title_settings":"Setări","sidepanel_title_account_settings":"Setările Contului","sidepanel_title_acc_general":"Generale","sidepanel_title_acc_security":"Securitate","sidepanel_title_acc_notifications":"Notificări","sidepanel_title_acc_support":"Ajutor","sidepanel_title_newtpk":"Creeză un nou Chat","sidepanel_title_cred":"Confirmă credențiale","sidepanel_title_reset":"Resetează Parola","sidepanel_title_archive":"Conversații Arhivate","sidepanel_title_blocked":"Conversații Blocate","reconnect_countdown":"Deconectat. Se încearcă conectarea în {seconds}…","reconnect_now":"Încearcă din nou","push_init_failed":"Nu s-a reușit inițializarea tip push notifications","invalid_security_token":"Codul de securitate este invalid","no_connection":"Nu există conexiune","code_doesnot_match":"Codul furnizat nu este valid","update_available":"Actualizare disponibilă.","reload_update":"Reîncarcă","phone_dative":"telefon","email_dative":"email","enter_confirmation_code_prompt":"Introu codul de confirmare trimis pe {method}:","numeric_confirmation_code_prompt":"Doar cifre","button_confirm":"Confirmă","save_attachment":"salvează","deleted_content":"conținut șters","invalid_content":"conținut invalid","user_not_found":"Utilizatorul nu a fost găsit","badge_you":"tu","badge_owner":"owner","menu_item_info":"Info","menu_item_clear_messages":"Șterge mesajele","menu_item_clear_messages_for_all":"Ștergele pe toate","menu_item_delete":"Șterge","menu_item_delete_for_all":"Ștergele pe toate","menu_item_send_retry":"Reîncearcă","menu_item_mute":"Mute","menu_item_unmute":"Unmute","menu_item_delete_topic":"Șterge","topic_delete_warning":"Ești sigur că dorești să șterge această conversație?","menu_item_unblock":"Deblochează","menu_item_block":"Blochează","topic_block_warning":"Ești sigur că dorești să blochezi această conversație?","menu_item_member_delete":"Șterge persoană","menu_item_archive_topic":"Arhivează","action_cancel":"anulează","upload_finishing":"se încarcă...","no_contacts":"Nu ai contacte adăugate :-(","contacts_not_found_short":"Niciun contact găsit după criteriile \'\'{query}\'\'","title_group_members":"Persoanele din grup","title_all_contacts":"Toate Contactele","button_ok":"OK","button_cancel":"Anulează","more_online_members":"+{overflow} mai mult","download_action":"download","label_file_name":"Nume fișier:","label_content_type":"Tip conținut:","label_size":"Size:","chat_invitation":"Ai primit invitație într-o conversație. Accepți?","chat_invitation_accept":"Da, accept","chat_invitation_ignore":"Ignoră","chat_invitation_block":"Blochează","error_invalid_id":"ID Invalid","group_user_id_prompt":"Grup sau user ID","button_subscribe":"Subscribe","topic_name_editing_placeholder":"Numele grupului","channel_prompt":"Acesta este un canal","button_create":"Creează","permission_join":"Participare ({val})","permission_read":"Citire ({val})","permission_write":"Scriere ({val})","permission_pres":"Notificare ({val})","permission_admin":"Aprobare ({val})","permission_share":"Distribuire ({val})","permission_delete":"Ștergere ({val})","permission_owner":"Deținător ({val})","title_permissions":"Permisiuni","message_sending":"se trimite...","message_sending_failed":"eroare","search_placeholder":"Caută după e-mail sau număr telefon...","messaging_disabled_prompt":"Mesageria este dezactivată","new_message_prompt":"Mesaj nou","image_caption_prompt":"Titlul imaginii","file_attachment_too_large":"Dimensiunea fișiterului {size} depășește limita de {limit}.","cannot_initiate_file_upload":"Nu se poate face încărcarea.","tags_not_found":"Niciun tag definit. Adaugă.","tags_editor_no_tags":"Adaugă tag-uri","title_manage_tags":"Administrează","drafty_attachment":"Atasament","drafty_form":"Formă:","drafty_image":"Imagine"},"ru":{"contacts_not_found":"Чатов нет<br />¯∖_(ツ)_/¯","full_name_prompt":"Полное имя, напр. Иван Петров","email_prompt":"Email, напр. ivan@example.com","button_sign_up":"Создать аккаунт","label_your_name":"Ваше имя","label_password":"Пароль","password_unchanged_prompt":"Не изменен","label_user_id":"ID:","label_default_access_mode":"Доступ по умолчанию:","label_message_sound":"Звук нового сообщения:","label_push_notifications":"Уведомления:","label_push_notifications_disabled":"Уведомления (требуют HTTPS):","title_tag_manager":"Теги для поиска","button_logout":"Выйти","login_prompt":"Логин","password_prompt":"Пароль","stay_logged_in":"Запомнить","forgot_password_link":"Напомнить пароль","button_sign_in":"Войти","label_client":"Клиент:","label_server":"Сервер:","online_now":"онлайн","last_seen_timestamp":"Был активен","title_not_found":"Не найден","unnamed_topic":"Без названия","messages_not_readable":"нет доступа к сообщениям","tabtitle_find_user":"найти","tabtitle_new_group":"создать","tabtitle_group_by_id":"по id","label_server_to_use":"Использовать сервер:","label_wire_transport":"Соединение:","button_update":"Применить","sidepanel_title_login":"Авторизация","sidepanel_title_register":"Зарегистрироваться","sidepanel_title_settings":"Настройки","sidepanel_title_account_settings":"Настройки аккаунта","sidepanel_title_newtpk":"Новый чат","sidepanel_title_cred":"Подтвердить","sidepanel_title_reset":"Сменить пароль","tags_not_found":"Тегов нет. Добавьте","tags_editor_no_tags":"Добавьте теги","title_manage_tags":"Редактировать","message_sending":"в пути...","message_sending_failed":"ошибка","search_placeholder":"Список, напр. email:alice@example.com, tel:+17025550003...","messaging_disabled_prompt":"Отправка недоступна","new_message_prompt":"Новое сообщение","file_attachment_too_large":"Размер файла {size} превышает {limit} лимит.","cannot_initiate_file_upload":"Ошибка загрузки файла.","search_for_contacts":"Поиск контактов","enter_confirmation_code_prompt":"Код подтверждения, полученный по {method}:","numeric_confirmation_code_prompt":"Только цифры","button_confirm":"Подтвердить","button_ok":"OK","button_cancel":"Отменить","invalid_content":"сообщение не читается","label_file_name":"Имя файла:","label_content_type":"Тип:","label_size":"Размер:","phone_dative":"телефону","email_dative":"емейлу","title_group_members":"Участники","download_action":"скачать","permission_join":"Подписываться ({val})","permission_read":"Читать ({val})","permission_write":"Писать ({val})","permission_pres":"Уведомлять ({val})","permission_admin":"Подтверждать ({val})","permission_share":"Приглашать ({val})","permission_delete":"Удалять ({val})","permission_owner":"Владелец ({val})","title_permissions":"Права доступа","requested_permissions":"Требуются","granted_permissions":"Получены","menu_item_edit_permissions":"Права доступа","label_other_user":"Второй","label_topic_name":"Название","label_private":"Комментарий","private_editing_placeholder":"Виден только вам","label_muting_topic":"Без уведомлений","action_more":"Ещё","label_your_permissions":"Ваши права доступа:","label_permissions":"Права доступа:","label_you":"Вы:","label_default_access":"Права по умолчанию:","label_group_members":"Участники чата:","button_add_members":"Добавить","group_has_no_members":"Нет участников","action_leave_chat":"Уйти из чата","menu_item_info":"Информация","menu_item_clear_messages":"Удалить сообщения","menu_item_clear_messages_for_all":"Удалить для всех","menu_item_delete":"Удалить","menu_item_delete_for_all":"Удалить для всех","menu_item_send_retry":"Отправить заново","menu_item_mute":"Не уведомлять","menu_item_unmute":"Уведомлять","menu_item_delete_topic":"Удалить чат","menu_item_unblock":"Разблокировать","menu_item_block":"Заблокировать","menu_item_member_delete":"Отписать","title_info":"Подробности","new_password_placeholder":"Введите новый пароль","label_reset_password":"Отправить емейл для смены пароля:","credential_email_prompt":"Регистрационный емейл","button_reset":"Изменить","button_send_request":"Отправить","action_cancel":"отменить","upload_finishing":"завершение...","no_contacts":"Ничего нет :-(","contacts_not_found_short":"Нет контактов для запроса \'\'{query}\'\'","title_all_contacts":"Все контакты","error_invalid_id":"Неверный ID","group_user_id_prompt":"ID чата или пользователя","button_subscribe":"Подписаться","topic_name_editing_placeholder":"Название чата","button_create":"Создать","badge_you":"вы","badge_owner":"влад.","update_available":"Есть новая версия приложения.","reload_update":"Обновить","user_not_found":"Не найден","reconnect_countdown":"Нет связи. Подключение через {seconds}…","reconnect_now":"Подключить сейчас.","save_attachment":"сохранить","menu_item_archive_topic":"В архив","archived_contacts":"Чаты в архиве ({count})","sidepanel_title_archive":"Архив чатов","chat_invitation":"Вас пригласили начать новый чат. Как вы хотите поступить?","chat_invitation_accept":"Принять","chat_invitation_ignore":"Игнорировать","chat_invitation_block":"Заблокировать","peers_messaging_disabled":"Чат заблокирован у корреспондента.","enable_peers_messaging":"Разблокировать.","more_online_members":"+еще {overflow}","label_user_contacts":"Конакты:","validate_credential_action":"подтвердить","link_contact_us":"Связаться с нами","link_terms_of_service":"Условия сервиса","link_privacy_policy":"Политика конфиденциальности","action_delete_messages":"Удалить сообщения","action_block_contact":"Заблокировать контакт","action_report_chat":"Сообщить о нарушении","delete_messages_warning":"Вы действительно хотите удалить все сообщения?","leave_chat_warning":"Вы действительно хотите покинуть этот чат?","block_contact_warning":"Вы действительно заблокировать этот контакт?","report_chat_warning":"Вы действительно хотите сообщить о нарушении и заблокировать этот чат?","action_clear_messages":"Удалить сообщения","clear_messages_warning":"Вы действительно хотите удалить все сообщения в чате? Их будет невозможно восстановить.","topic_delete_warning":"Вы действительно хотите удалить этот чат?","topic_block_warning":"Вы действительно хотите заблокировать этот чат?","search_no_results":"Ничего не найдено","deleted_content":"удалено","image_caption_prompt":"Подпись к фото","label_incognito_mode":"Режим инкогнито:","delete_account":"Удалить аккаунт","delete_account_arning":"Вы уверены, что ходите удалить свой аккаунт? Его невозможно будет восстановить.","button_delete_account":"Удалить аккаунт","sidepanel_title_acc_security":"Безопасность","sidepanel_title_acc_notifications":"Уведомления","sidepanel_title_acc_support":"Поддержка","label_sdk":"SDK:","label_server_address":"Адрес сервера:","button_edit":"Редактировать","button_add_another":"Добавить","sidepanel_title_acc_general":"Общие настройки","blocked_contacts_link":"Заблокированные ({count})","sidepanel_title_blocked":"Заблокированные чаты","push_init_failed":"Ошибка инициализации пуш уведомлений","invalid_security_token":"Токен некорректен","no_connection":"Нет связи","code_doesnot_match":"Код не совпадает","channel_prompt":"Создать канал","channel":"канал","drafty_attachment":"Аттачмент","drafty_form":"Форма:","drafty_image":"Картинка"},"zh":{"archived_contacts":"已归档联系人 ({count})","contacts_not_found":"你尚无会话<br />¯∖_(ツ)_/¯","full_name_prompt":"全名，例如张伟","email_prompt":"电子邮件，例如 zhang@example.com","button_sign_up":"注册","label_your_name":"你的姓名","label_password":"密码","password_unchanged_prompt":"未改变","label_user_id":"地址：","label_default_access_mode":"蓦然访问模式：","label_message_sound":"消息提示音：","label_push_notifications":"通知提醒：","label_push_notifications_disabled":"通知提醒（需要 HTTPS）：","title_tag_manager":"标签（用户发现）","button_logout":"登出","requested_permissions":"已请求","granted_permissions":"已授予","menu_item_edit_permissions":"编辑权限","label_other_user":"其他","title_info":"信息","label_topic_name":"名称","label_private":"私人评论","private_editing_placeholder":"仅自己可见","label_muting_topic":"已静音：","action_more":"更多","label_your_permissions":"你的权限：","label_permissions":"权限：","label_you":"你：","label_default_access":"默认权限模式：","label_group_members":"群组成员：","button_add_members":"添加成员","group_has_no_members":"无成员","action_leave_chat":"离开","login_prompt":"登录","password_prompt":"密码","stay_logged_in":"保持登录","forgot_password_link":"忘记密码？","button_sign_in":"登录","label_client":"客户端：","label_server":"服务器：","online_now":"在线","last_seen_timestamp":"最后可见","title_not_found":"无法找到","unnamed_topic":"未命名","messages_not_readable":"无消息访问权限","peers_messaging_disabled":"成员间消息已禁用。","enable_peers_messaging":"启用","tabtitle_find_user":"搜索","tabtitle_new_group":"新群组","tabtitle_group_by_id":"通过 id","search_for_contacts":"使用搜索寻找联系人","new_password_placeholder":"输入新密码","label_reset_password":"发送密码重置邮件：","credential_email_prompt":"你的注册邮箱","button_reset":"重置","button_send_request":"发送请求","label_server_to_use":"使用的服务器：","label_wire_transport":"线路传输：","button_update":"更新","sidepanel_title_login":"登录","sidepanel_title_register":"创建账户","sidepanel_title_settings":"设置","sidepanel_title_account_settings":"帐号设定","sidepanel_title_newtpk":"开始新会话","sidepanel_title_cred":"确认凭据","sidepanel_title_reset":"重置密码","sidepanel_title_archive":"已存档会话","update_available":"更新可用。","reload_update":"重新载入","reconnect_countdown":"连接已断开。{seconds} 秒后重新连接…","reconnect_now":"立即尝试","phone_dative":"电话","email_dative":"电子邮件","enter_confirmation_code_prompt":"输入通过{method}发送的验证码：","numeric_confirmation_code_prompt":"仅数字","button_confirm":"确认","save_attachment":"保存","invalid_content":"无效内容","user_not_found":"未找到","badge_you":"你","badge_owner":"所有者","menu_item_info":"信息","menu_item_clear_messages":"清空消息","menu_item_clear_messages_for_all":"全部清除","menu_item_delete":"删除","menu_item_delete_for_all":"全部删除","menu_item_mute":"静音","menu_item_unmute":"取消静音","menu_item_delete_topic":"删除","menu_item_unblock":"取消屏蔽","menu_item_block":"屏蔽","menu_item_member_delete":"移除","menu_item_archive_topic":"归档","action_cancel":"取消","upload_finishing":"正在结束...","no_contacts":"你尚无联系人 (._.)","contacts_not_found_short":"无联系人匹配\'\'{query}\'\'","title_group_members":"群组成员","title_all_contacts":"全部联系人","button_ok":"好","button_cancel":"取消","download_action":"下载","label_file_name":"文件名：","label_content_type":"内容类型：","label_size":"大小：","chat_invitation":"你受邀开始新会话。你想怎么做？","chat_invitation_accept":"接受","chat_invitation_ignore":"忽略","chat_invitation_block":"屏蔽","error_invalid_id":"无效 ID","group_user_id_prompt":"群组或用户 ID","button_subscribe":"订阅","topic_name_editing_placeholder":"群组自由格式名称","button_create":"创建","permission_join":"加入 ({val})","permission_read":"读取 ({val})","permission_write":"写入 ({val})","permission_pres":"获取通知 ({val})","permission_admin":"批准 ({val})","permission_share":"分享 ({val})","permission_delete":"删除 ({val})","permission_owner":"所有者 ({val})","title_permissions":"权限","message_sending":"正在发送...","message_sending_failed":"发送失败","search_placeholder":"列表如 email:alice@example.com, tel:+17025550003...","messaging_disabled_prompt":"消息已禁用","new_message_prompt":"新消息","file_attachment_too_large":"文件大小 {size} 超过 {limit} 限制。","cannot_initiate_file_upload":"无法初始化文件上传。","tags_not_found":"尚未定义标签。添加一些。","tags_editor_no_tags":"添加一些标签","title_manage_tags":"管理标签","more_online_members":"还有{overflow}个","label_user_contacts":"往来：","validate_credential_action":"确认","link_contact_us":"联系我们","link_terms_of_service":"条款和条件","link_privacy_policy":"隐私政策","action_delete_messages":"删除所有帖子","action_block_contact":"屏蔽联系人","delete_messages_warning":"您确定要删除所有消息吗？无法撤消。","leave_chat_warning":"您确定要退出此对话吗？","block_contact_warning":"您确定要阻止此联系人吗？","action_report_chat":"检举垃圾邮件","report_chat_warning":"您确定要停止并报告此对话吗？","action_clear_messages":"删除讯息","clear_messages_warning":"您确定要清除所有消息吗？无法撤消。","topic_delete_warning":"您确定要删除此对话吗？","topic_block_warning":"您确定要阻止此对话吗？","search_no_results":"搜索返回任何结果","deleted_content":"内容已删除","image_caption_prompt":"图片标题","menu_item_send_retry":"重试","label_incognito_mode":"无痕模式：","delete_account":"删除帐户","delete_account_arning":"您确定要删除您的帐户吗？无法撤消。","button_delete_account":"删除帐户","sidepanel_title_acc_security":"安全","sidepanel_title_acc_notifications":"通知","sidepanel_title_acc_support":"支持","label_sdk":"开发包：","label_server_address":"服务器地址：","button_edit":"编辑","button_add_another":"加上另一个","sidepanel_title_acc_general":"常用设定","blocked_contacts_link":"封锁的联络人 ({count})","sidepanel_title_blocked":"被阻止的聊天","push_init_failed":"初始化推送通知失败","invalid_security_token":"无效的安全令牌","no_connection":"无连接","code_doesnot_match":"代码不匹配","channel_prompt":"这是一个频道","channel":"频道","drafty_attachment":"附件","drafty_form":"形式：","drafty_image":"图像"}}');

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ (function(module) {

module.exports = React;

/***/ }),

/***/ "react-dom":
/*!***************************!*\
  !*** external "ReactDOM" ***!
  \***************************/
/***/ (function(module) {

module.exports = ReactDOM;

/***/ }),

/***/ "react-intl":
/*!****************************!*\
  !*** external "ReactIntl" ***!
  \****************************/
/***/ (function(module) {

module.exports = ReactIntl;

/***/ }),

/***/ "tinode-sdk":
/*!*************************!*\
  !*** external "Tinode" ***!
  \*************************/
/***/ (function(module) {

module.exports = Tinode;

/***/ }),

/***/ "firebase/app":
/*!***************************!*\
  !*** external "firebase" ***!
  \***************************/
/***/ (function(module) {

module.exports = firebase;

/***/ }),

/***/ "firebase/messaging":
/*!*****************************************!*\
  !*** external ["firebase","messaging"] ***!
  \*****************************************/
/***/ (function(module) {

module.exports = firebase.messaging;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
!function() {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "react-dom");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _messages_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./messages.json */ "./src/messages.json");
/* harmony import */ var _views_tinode_web_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./views/tinode-web.jsx */ "./src/views/tinode-web.jsx");
/* harmony import */ var _lib_navigation_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./lib/navigation.js */ "./src/lib/navigation.js");






const {
  params
} = _lib_navigation_js__WEBPACK_IMPORTED_MODULE_5__.default.parseUrlHash(window.location.hash);
const language = params && params.hl || navigator.languages && navigator.languages[0] || navigator.language || navigator.userLanguage || 'en';
const baseLanguage = language.toLowerCase().split(/[-_]/)[0];
const messages = _messages_json__WEBPACK_IMPORTED_MODULE_3__[language] || _messages_json__WEBPACK_IMPORTED_MODULE_3__[baseLanguage] || _messages_json__WEBPACK_IMPORTED_MODULE_3__.en;
react_dom__WEBPACK_IMPORTED_MODULE_1___default().render(react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_2__.IntlProvider, {
  locale: language,
  messages: messages,
  textComponent: (react__WEBPACK_IMPORTED_MODULE_0___default().Fragment)
}, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_views_tinode_web_jsx__WEBPACK_IMPORTED_MODULE_4__.default, null)), document.getElementById('mountPoint'));
}();
/******/ })()
;
//# sourceMappingURL=index.dev.js.map
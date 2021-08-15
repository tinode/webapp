/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/config.js":
/*!***********************!*\
  !*** ./src/config.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "APP_NAME": () => (/* binding */ APP_NAME),
/* harmony export */   "API_KEY": () => (/* binding */ API_KEY),
/* harmony export */   "KNOWN_HOSTS": () => (/* binding */ KNOWN_HOSTS),
/* harmony export */   "DEFAULT_HOST": () => (/* binding */ DEFAULT_HOST),
/* harmony export */   "LOGGING_ENABLED": () => (/* binding */ LOGGING_ENABLED),
/* harmony export */   "KEYPRESS_DELAY": () => (/* binding */ KEYPRESS_DELAY),
/* harmony export */   "RECEIVED_DELAY": () => (/* binding */ RECEIVED_DELAY),
/* harmony export */   "READ_DELAY": () => (/* binding */ READ_DELAY),
/* harmony export */   "MIN_TAG_LENGTH": () => (/* binding */ MIN_TAG_LENGTH),
/* harmony export */   "MAX_TAG_LENGTH": () => (/* binding */ MAX_TAG_LENGTH),
/* harmony export */   "MAX_TAG_COUNT": () => (/* binding */ MAX_TAG_COUNT),
/* harmony export */   "DEFAULT_P2P_ACCESS_MODE": () => (/* binding */ DEFAULT_P2P_ACCESS_MODE),
/* harmony export */   "NEW_GRP_ACCESS_MODE": () => (/* binding */ NEW_GRP_ACCESS_MODE),
/* harmony export */   "CHANNEL_ACCESS_MODE": () => (/* binding */ CHANNEL_ACCESS_MODE),
/* harmony export */   "NO_ACCESS_MODE": () => (/* binding */ NO_ACCESS_MODE),
/* harmony export */   "MEDIA_BREAKPOINT": () => (/* binding */ MEDIA_BREAKPOINT),
/* harmony export */   "REM_SIZE": () => (/* binding */ REM_SIZE),
/* harmony export */   "AVATAR_SIZE": () => (/* binding */ AVATAR_SIZE),
/* harmony export */   "MAX_AVATAR_BYTES": () => (/* binding */ MAX_AVATAR_BYTES),
/* harmony export */   "BROKEN_IMAGE_SIZE": () => (/* binding */ BROKEN_IMAGE_SIZE),
/* harmony export */   "MESSAGES_PAGE": () => (/* binding */ MESSAGES_PAGE),
/* harmony export */   "MAX_INBAND_ATTACHMENT_SIZE": () => (/* binding */ MAX_INBAND_ATTACHMENT_SIZE),
/* harmony export */   "MAX_EXTERN_ATTACHMENT_SIZE": () => (/* binding */ MAX_EXTERN_ATTACHMENT_SIZE),
/* harmony export */   "MAX_IMAGE_DIM": () => (/* binding */ MAX_IMAGE_DIM),
/* harmony export */   "IMAGE_PREVIEW_DIM": () => (/* binding */ IMAGE_PREVIEW_DIM),
/* harmony export */   "IMAGE_THUMBNAIL_DIM": () => (/* binding */ IMAGE_THUMBNAIL_DIM),
/* harmony export */   "MAX_ONLINE_IN_TOPIC": () => (/* binding */ MAX_ONLINE_IN_TOPIC),
/* harmony export */   "MAX_TITLE_LENGTH": () => (/* binding */ MAX_TITLE_LENGTH),
/* harmony export */   "MAX_TOPIC_DESCRIPTION_LENGTH": () => (/* binding */ MAX_TOPIC_DESCRIPTION_LENGTH),
/* harmony export */   "MESSAGE_PREVIEW_LENGTH": () => (/* binding */ MESSAGE_PREVIEW_LENGTH),
/* harmony export */   "LINK_CONTACT_US": () => (/* binding */ LINK_CONTACT_US),
/* harmony export */   "LINK_PRIVACY_POLICY": () => (/* binding */ LINK_PRIVACY_POLICY),
/* harmony export */   "LINK_TERMS_OF_SERVICE": () => (/* binding */ LINK_TERMS_OF_SERVICE)
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
const AVATAR_SIZE = 384;
const MAX_AVATAR_BYTES = 4096;
const BROKEN_IMAGE_SIZE = 32;
const MESSAGES_PAGE = 24;
const MAX_INBAND_ATTACHMENT_SIZE = 262144;
const MAX_EXTERN_ATTACHMENT_SIZE = 1 << 23;
const MAX_IMAGE_DIM = 1024;
const IMAGE_PREVIEW_DIM = 64;
const IMAGE_THUMBNAIL_DIM = 25;
const MAX_ONLINE_IN_TOPIC = 4;
const MAX_TITLE_LENGTH = 60;
const MAX_TOPIC_DESCRIPTION_LENGTH = 360;
const MESSAGE_PREVIEW_LENGTH = 80;
const LINK_CONTACT_US = 'email:support@tinode.co';
const LINK_PRIVACY_POLICY = 'https://tinode.co/privacy.html';
const LINK_TERMS_OF_SERVICE = 'https://tinode.co/terms.html';

/***/ }),

/***/ "./src/lib/blob-helpers.js":
/*!*********************************!*\
  !*** ./src/lib/blob-helpers.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SUPPORTED_IMAGE_FORMATS": () => (/* binding */ SUPPORTED_IMAGE_FORMATS),
/* harmony export */   "MIME_EXTENSIONS": () => (/* binding */ MIME_EXTENSIONS),
/* harmony export */   "makeImageUrl": () => (/* binding */ makeImageUrl),
/* harmony export */   "fitImageSize": () => (/* binding */ fitImageSize),
/* harmony export */   "fileNameForMime": () => (/* binding */ fileNameForMime),
/* harmony export */   "imageScaled": () => (/* binding */ imageScaled),
/* harmony export */   "imageCrop": () => (/* binding */ imageCrop),
/* harmony export */   "fileToBase64": () => (/* binding */ fileToBase64),
/* harmony export */   "blobToBase64": () => (/* binding */ blobToBase64),
/* harmony export */   "filePasted": () => (/* binding */ filePasted),
/* harmony export */   "getMimeType": () => (/* binding */ getMimeType),
/* harmony export */   "base64EncodedLen": () => (/* binding */ base64EncodedLen),
/* harmony export */   "base64DecodedLen": () => (/* binding */ base64DecodedLen),
/* harmony export */   "base64ReEncode": () => (/* binding */ base64ReEncode),
/* harmony export */   "base64ToBlob": () => (/* binding */ base64ToBlob)
/* harmony export */ });
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var _strformat_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./strformat.js */ "./src/lib/strformat.js");


const SUPPORTED_IMAGE_FORMATS = ['image/jpeg', 'image/gif', 'image/png', 'image/svg', 'image/svg+xml'];
const MIME_EXTENSIONS = ['jpg', 'gif', 'png', 'svg', 'svg'];
function makeImageUrl(photo) {
  if (photo && typeof photo == 'object') {
    if (photo.data && photo.type) {
      const mime = photo.type.startsWith('image/') ? photo.type : 'image/' + photo.type;
      return 'data:' + mime + ';base64,' + photo.data;
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

  const scale = Math.min(Math.min(width, maxWidth) / width, Math.min(height, maxHeight) / height);
  const size = {
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
    const mime = SUPPORTED_IMAGE_FORMATS.includes(fileOrBlob.type) ? fileOrBlob.type : 'image/jpeg';
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
    onSuccess(mime, blob, dim.dstWidth, dim.dstHeight, fileNameForMime(fileOrBlob.name, mime));
  };

  img.src = URL.createObjectURL(fileOrBlob);
}
function imageCrop(mime, objURL, left, top, width, height, scale, onSuccess, onError) {
  const img = new Image();
  img.crossOrigin = 'Anonymous';

  img.onerror = function (err) {
    onError("Image format unrecognized");
  };

  img.onload = async function () {
    URL.revokeObjectURL(img.src);
    let canvas = document.createElement('canvas');
    canvas.width = width * scale;
    canvas.height = height * scale;
    let ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(this, left, top, width, height, 0, 0, canvas.width, canvas.height);
    mime = SUPPORTED_IMAGE_FORMATS.includes(mime) ? mime : 'image/jpeg';
    let blob = await new Promise(resolve => canvas.toBlob(resolve, mime));

    if (!blob) {
      onError("Unsupported image format");
      return;
    }

    canvas = null;
    onSuccess(mime, blob, width, height);
  };

  img.src = objURL;
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
        console.error("Failed to get file object from pasted file item", item.kind, item.type);
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
      console.error("Failed to base64 re-encode string.", err);
      str = null;
    }
  }

  return str;
}
function base64ToBlob(str, mime) {
  if (!str) {
    return null;
  }

  try {
    const bin = atob(str);
    const length = bin.length;
    const buf = new ArrayBuffer(length);
    const arr = new Uint8Array(buf);

    for (let i = 0; i < length; i++) {
      arr[i] = bin.charCodeAt(i);
    }

    return new Blob([buf], {
      type: mime
    });
  } catch (err) {
    console.log("Failed to convert base64 to blob: ", err);
  }

  return null;
}

/***/ }),

/***/ "./src/lib/host-name.js":
/*!******************************!*\
  !*** ./src/lib/host-name.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "detectServerAddress": () => (/* binding */ detectServerAddress),
/* harmony export */   "isSecureConnection": () => (/* binding */ isSecureConnection),
/* harmony export */   "isLocalHost": () => (/* binding */ isLocalHost)
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LocalStorageUtil)
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ HashNavigation)
/* harmony export */ });
class HashNavigation {
  static parseUrlHash(hash) {
    const parts = hash.split('?', 2);
    const params = {};
    let path = [];

    if (parts[0]) {
      path = parts[0].replace('#', '').split('/');
    }

    if (parts[1]) {
      parts[1].split('&').forEach(function (part) {
        const item = part.split('=');

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

  static setUrlInfoPanel(hash, infopanel) {
    const parsed = this.parseUrlHash(hash);

    if (infopanel) {
      parsed.params.info = infopanel;
    } else {
      delete parsed.params.info;
    }

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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "shortDateFormat": () => (/* binding */ shortDateFormat),
/* harmony export */   "secondsToTime": () => (/* binding */ secondsToTime),
/* harmony export */   "bytesToHumanSize": () => (/* binding */ bytesToHumanSize),
/* harmony export */   "stringHash": () => (/* binding */ stringHash)
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "updateFavicon": () => (/* binding */ updateFavicon),
/* harmony export */   "theCard": () => (/* binding */ theCard),
/* harmony export */   "arrayEqual": () => (/* binding */ arrayEqual),
/* harmony export */   "asPhone": () => (/* binding */ asPhone),
/* harmony export */   "asEmail": () => (/* binding */ asEmail),
/* harmony export */   "isUrlRelative": () => (/* binding */ isUrlRelative),
/* harmony export */   "sanitizeUrl": () => (/* binding */ sanitizeUrl),
/* harmony export */   "sanitizeImageUrl": () => (/* binding */ sanitizeImageUrl),
/* harmony export */   "deliveryMarker": () => (/* binding */ deliveryMarker)
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
function theCard(fn, imageUrl, imageMimeType, note) {
  let card = null;
  fn = fn && fn.trim();
  note = note && note.trim();

  if (fn) {
    card = {
      fn: fn
    };
  }

  if (typeof note == 'string') {
    card = card || {};
    card.note = note ? note : (tinode_sdk__WEBPACK_IMPORTED_MODULE_0___default().DEL_CHAR);
  }

  if (imageUrl) {
    card = card || {};
    let mimeType = imageMimeType;
    const matches = /^data:(image\/[-a-z0-9+.]+)?(;base64)?,/i.exec(imageUrl);

    if (matches) {
      mimeType = matches[1];
      card.photo = {
        data: imageUrl.substring(imageUrl.indexOf(',') + 1),
        ref: (tinode_sdk__WEBPACK_IMPORTED_MODULE_0___default().DEL_CHAR)
      };
    } else {
      card.photo = {
        data: (tinode_sdk__WEBPACK_IMPORTED_MODULE_0___default().DEL_CHAR),
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
  if (typeof url != 'string') {
    return url;
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
        color: 'danger-color'
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PACKAGE_VERSION": () => (/* binding */ PACKAGE_VERSION)
/* harmony export */ });
const PACKAGE_VERSION = "0.18.0-alpha1";

/***/ }),

/***/ "./src/views/acc-notifications-view.jsx":
/*!**********************************************!*\
  !*** ./src/views/acc-notifications-view.jsx ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ EditAccountView)
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
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
    id: "delete_account_warning",
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
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(AccSecurityView));

/***/ }),

/***/ "./src/views/acc-support-view.jsx":
/*!****************************************!*\
  !*** ./src/views/acc-support-view.jsx ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AccSupportView)
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

/***/ "./src/views/account-settings-view.jsx":
/*!*********************************************!*\
  !*** ./src/views/account-settings-view.jsx ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AccountSettingsView)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _widgets_avatar_upload_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../widgets/avatar-upload.jsx */ "./src/widgets/avatar-upload.jsx");
/* harmony import */ var _widgets_badge_list_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../widgets/badge-list.jsx */ "./src/widgets/badge-list.jsx");
/* harmony import */ var _lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../lib/blob-helpers.js */ "./src/lib/blob-helpers.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../config.js */ "./src/config.js");







function _clip(str, length) {
  return str && str.substring(0, length);
}

class AccountSettingsView extends (react__WEBPACK_IMPORTED_MODULE_0___default().Component) {
  constructor(props) {
    super(props);
    const me = this.props.tinode.getMeTopic();
    this.state = {
      fullName: _clip(me.public ? me.public.fn : undefined, _config_js__WEBPACK_IMPORTED_MODULE_5__.MAX_TITLE_LENGTH),
      description: _clip(me.public ? me.public.note : undefined, _config_js__WEBPACK_IMPORTED_MODULE_5__.MAX_TOPIC_DESCRIPTION_LENGTH),
      avatar: (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_4__.makeImageUrl)(me.public ? me.public.photo : null)
    };
  }

  render() {
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "scrollable-panel"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-column"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      className: "flat-button float-right",
      onClick: e => {
        e.preventDefault();
        this.props.onNavigate('general');
      }
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "edit"), "\xA0", react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "button_edit",
      defaultMessage: [{
        "type": 0,
        "value": "Edit"
      }]
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("center", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_avatar_upload_jsx__WEBPACK_IMPORTED_MODULE_2__.default, {
      tinode: this.props.tinode,
      avatar: this.state.avatar,
      readOnly: true,
      uid: this.props.myUserId,
      title: this.state.fullName
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "group"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      className: "small"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_your_name",
      defaultMessage: [{
        "type": 0,
        "value": "Your name"
      }]
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "large ellipsized"
    }, this.state.fullName)), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "group"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      className: "small"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_user_id",
      defaultMessage: [{
        "type": 0,
        "value": "ID:"
      }]
    })), "\xA0", react__WEBPACK_IMPORTED_MODULE_0___default().createElement("tt", null, this.props.myUserId)), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "group"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_badge_list_jsx__WEBPACK_IMPORTED_MODULE_3__.default, {
      trustedBadges: this.props.trustedBadges
    })), this.state.description ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "group"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      className: "small"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_description",
      defaultMessage: [{
        "type": 0,
        "value": "Description"
      }]
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, this.state.description)) : null), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "hr"
    }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-column"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      className: "flat-button",
      onClick: e => {
        e.preventDefault();
        this.props.onNavigate('notif');
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
        this.props.onNavigate('security');
      }
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "security"), "\xA0", react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "button_security",
      defaultMessage: [{
        "type": 0,
        "value": "Security"
      }]
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      className: "flat-button",
      onClick: e => {
        e.preventDefault();
        this.props.onNavigate('support');
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

/***/ "./src/views/contacts-view.jsx":
/*!*************************************!*\
  !*** ./src/views/contacts-view.jsx ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ContactsView)
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
      tinode: this.props.tinode,
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CreateAccountView)
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
      tinode: this.props.tinode,
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

/***/ "./src/views/info-view.jsx":
/*!*********************************!*\
  !*** ./src/views/info-view.jsx ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tinode-sdk */ "tinode-sdk");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _widgets_avatar_upload_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../widgets/avatar-upload.jsx */ "./src/widgets/avatar-upload.jsx");
/* harmony import */ var _widgets_badge_list_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../widgets/badge-list.jsx */ "./src/widgets/badge-list.jsx");
/* harmony import */ var _widgets_checkbox_jsx__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../widgets/checkbox.jsx */ "./src/widgets/checkbox.jsx");
/* harmony import */ var _widgets_contact_list_jsx__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../widgets/contact-list.jsx */ "./src/widgets/contact-list.jsx");
/* harmony import */ var _widgets_error_panel_jsx__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../widgets/error-panel.jsx */ "./src/widgets/error-panel.jsx");
/* harmony import */ var _widgets_group_manager_jsx__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../widgets/group-manager.jsx */ "./src/widgets/group-manager.jsx");
/* harmony import */ var _widgets_menu_cancel_jsx__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../widgets/menu-cancel.jsx */ "./src/widgets/menu-cancel.jsx");
/* harmony import */ var _widgets_permissions_editor_jsx__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../widgets/permissions-editor.jsx */ "./src/widgets/permissions-editor.jsx");
/* harmony import */ var _widgets_topic_common_jsx__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../widgets/topic-common.jsx */ "./src/widgets/topic-common.jsx");
/* harmony import */ var _widgets_topic_security_jsx__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../widgets/topic-security.jsx */ "./src/widgets/topic-security.jsx");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var _lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../lib/blob-helpers.js */ "./src/lib/blob-helpers.js");
/* harmony import */ var _lib_utils_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../lib/utils.js */ "./src/lib/utils.js");
















const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_1__.defineMessages)({
  info: {
    id: "panel_title_info",
    defaultMessage: [{
      "type": 0,
      "value": "Info"
    }]
  },
  general: {
    id: "panel_title_general",
    defaultMessage: [{
      "type": 0,
      "value": "General"
    }]
  },
  security: {
    id: "panel_title_security",
    defaultMessage: [{
      "type": 0,
      "value": "Security"
    }]
  },
  members: {
    id: "panel_title_members",
    defaultMessage: [{
      "type": 0,
      "value": "Members"
    }]
  },
  crop: {
    id: "panel_title_crop",
    defaultMessage: [{
      "type": 0,
      "value": "Drag to Adjust"
    }]
  },
  perm_want: {
    id: "requested_permissions",
    defaultMessage: [{
      "type": 0,
      "value": "Requested"
    }]
  },
  perm_given: {
    id: "granted_permissions",
    defaultMessage: [{
      "type": 0,
      "value": "Granted"
    }]
  },
  perm_auth: {
    id: "permissions_authenticated",
    defaultMessage: [{
      "type": 0,
      "value": "Authenticated"
    }]
  },
  perm_anon: {
    id: "permissions_anonymous",
    defaultMessage: [{
      "type": 0,
      "value": "Anonymous"
    }]
  },
  perm_user: {
    id: "permissions_user",
    defaultMessage: [{
      "type": 0,
      "value": "User's Permissions"
    }]
  },
  edit_permissions: {
    id: "menu_item_edit_permissions",
    defaultMessage: [{
      "type": 0,
      "value": "Edit permissions"
    }]
  }
});

function _clip(str, length) {
  return str && str.substring(0, length);
}

class InfoView extends (react__WEBPACK_IMPORTED_MODULE_0___default().Component) {
  constructor(props) {
    super(props);
    this.state = {
      topic: null,
      owner: false,
      admin: false,
      sharer: false,
      muted: false,
      address: null,
      groupTopic: undefined,
      channel: undefined,
      fullName: undefined,
      description: undefined,
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
      trustedBadges: [],
      previousMetaDesc: undefined,
      previousSubsUpdated: undefined
    };
    this.resetSubs = this.resetSubs.bind(this);
    this.resetDesc = this.resetDesc.bind(this);
    this.onMetaDesc = this.onMetaDesc.bind(this);
    this.onSubsUpdated = this.onSubsUpdated.bind(this);
    this.handleImageChanged = this.handleImageChanged.bind(this);
    this.handleMuted = this.handleMuted.bind(this);
    this.handlePermissionsChanged = this.handlePermissionsChanged.bind(this);
    this.handleLaunchPermissionsEditor = this.handleLaunchPermissionsEditor.bind(this);
    this.handleShowAddMembers = this.handleShowAddMembers.bind(this);
    this.handleMemberUpdateRequest = this.handleMemberUpdateRequest.bind(this);
    this.handleMemberSelected = this.handleMemberSelected.bind(this);
    this.handleContextMenu = this.handleContextMenu.bind(this);
    this.handleBackNavigate = this.handleBackNavigate.bind(this);
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
    const badges = [];

    if (topic.trusted) {
      for (const [key, val] of Object.entries(topic.trusted)) {
        if (val) {
          badges.push(key);
        }
      }
    }

    this.setState({
      owner: acs && acs.isOwner(),
      admin: acs && acs.isAdmin(),
      sharer: acs && acs.isSharer(),
      muted: acs && acs.isMuted(),
      fullName: _clip(topic.public ? topic.public.fn : undefined, _config_js__WEBPACK_IMPORTED_MODULE_13__.MAX_TITLE_LENGTH),
      description: _clip(topic.public ? topic.public.note : undefined, _config_js__WEBPACK_IMPORTED_MODULE_13__.MAX_TOPIC_DESCRIPTION_LENGTH),
      avatar: (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_14__.makeImageUrl)(topic.public ? topic.public.photo : null),
      trustedBadges: badges,
      private: _clip(topic.private ? topic.private.comment : null, _config_js__WEBPACK_IMPORTED_MODULE_13__.MAX_TITLE_LENGTH),
      address: topic.name,
      groupTopic: topic.isGroupType(),
      channel: topic.isChannelType() || topic.chan,
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

  handlePermissionsChanged(which, perm) {
    console.log("handlePermissionsChanged", which, perm);

    switch (which) {
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
  }

  handleLaunchPermissionsEditor(which, uid) {
    console.log(which, uid);
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

        titleEdit = formatMessage(messages.perm_want);
        titleCompare = formatMessage(messages.perm_given);
        break;

      case 'given':
        toEdit = this.state.modeGiven2;
        toCompare = this.state.modeWant2;
        toSkip = this.state.groupTopic ? this.state.owner ? '' : 'O' : 'ASDO';
        titleEdit = formatMessage(messages.perm_given);
        titleCompare = formatMessage(messages.perm_want);
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
          titleEdit = formatMessage(messages.perm_given);
          titleCompare = formatMessage(messages.perm_want);

          if (user.public) {
            userTitle = user.public.fn;
            userAvatar = user.public.photo;
          }

          break;
        }

      default:
        console.log("Unknown permission editing mode '" + which + "'");
        return;
    }

    this.setState({
      userPermissionsEdited: uid,
      userPermissionsTitle: userTitle,
      userPermissionsAvatar: userAvatar,
      editedPermissions: toEdit,
      immutablePermissions: toCompare,
      editedPermissionsTitle: titleEdit,
      immutablePermissionsTitle: titleCompare,
      editedPermissionsSkipped: toSkip
    });
    this.props.onNavigate(`perm/${which}`);
  }

  handleShowAddMembers(e) {
    e.preventDefault();
    this.props.onInitFind();
    this.props.onNavigate('members');
  }

  handleMemberUpdateRequest(members, added, removed) {
    this.props.onMemberUpdateRequest(this.props.topic, added, removed);
    this.props.onNavigate('info');
  }

  handleMemberSelected(uid) {
    this.setState({
      selectedContact: uid
    });
  }

  handleBackNavigate() {
    const args = (this.props.panel || 'info').split('/');

    if (args[0] == 'info') {
      this.props.onNavigate(null);
    } else if (args[0] == 'perm') {
      if (args[1] == 'user') {
        this.props.onNavigate('info');
      } else {
        this.props.onNavigate('security');
      }
    } else {
      this.props.onNavigate('info');
    }
  }

  handleContextMenu(params) {
    const {
      formatMessage
    } = this.props.intl;
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
      handler: () => {
        this.handleLaunchPermissionsEditor('user', params.topicName);
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
    const args = (this.props.panel || 'info').split('/');
    console.log("args:", args);
    const view = args[0];
    args.shift();
    const {
      formatMessage
    } = this.props.intl;
    const panelTitle = formatMessage((view == 'perm' ? messages['perm_' + args[0]] : messages[view]) || messages['info']);
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "info-view"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "caption-panel",
      id: "info-caption-panel"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-title",
      id: "info-title"
    }, panelTitle), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_menu_cancel_jsx__WEBPACK_IMPORTED_MODULE_9__.default, {
      onCancel: this.handleBackNavigate
    }))), this.props.displayMobile ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_error_panel_jsx__WEBPACK_IMPORTED_MODULE_7__.default, {
      level: this.props.errorLevel,
      text: this.props.errorText,
      onClearError: this.props.onError
    }) : null, view == 'members' ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_group_manager_jsx__WEBPACK_IMPORTED_MODULE_8__.default, {
      tinode: this.props.tinode,
      members: this.state.contactList,
      requiredMember: this.props.myUserId,
      keepInitialMembers: !this.state.admin && !this.state.owner,
      myUserId: this.props.myUserId,
      contacts: this.props.searchableContacts,
      onCancel: this.handleBackNavigate,
      onSubmit: this.handleMemberUpdateRequest
    }) : view == 'perm' && args.length > 0 ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_permissions_editor_jsx__WEBPACK_IMPORTED_MODULE_10__.default, {
      tinode: this.props.tinode,
      mode: this.state.editedPermissions,
      compare: this.state.immutablePermissions,
      skip: this.state.editedPermissionsSkipped,
      modeTitle: this.state.editedPermissionsTitle,
      compareTitle: this.state.immutablePermissionsTitle,
      userTitle: this.state.userPermissionsTitle,
      item: this.state.userPermissionsEdited,
      userAvatar: this.state.userPermissionsAvatar,
      onSubmit: mode => this.handlePermissionsChanged(args[0], mode),
      onCancel: this.handleBackNavigate
    }) : view == 'general' ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_topic_common_jsx__WEBPACK_IMPORTED_MODULE_11__.default, {
      tinode: this.props.tinode,
      topic: this.props.topic,
      onCredAdd: this.props.onCredAdd,
      onTopicTagsUpdate: this.props.onTopicTagsUpdate,
      onCredConfirm: this.props.onCredConfirm,
      onCredDelete: this.props.onCredDelete,
      onUpdateTopicDesc: this.props.onTopicDescUpdate,
      onUpdateTags: this.props.onUpdateTags,
      onError: this.props.onError
    }) : view == 'security' ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_topic_security_jsx__WEBPACK_IMPORTED_MODULE_12__.default, {
      tinode: this.props.tinode,
      topic: this.props.topic,
      onShowAlert: this.props.onShowAlert,
      onDeleteMessages: this.props.onDeleteMessages,
      onLeaveTopic: this.props.onLeaveTopic,
      onBlockTopic: this.props.onBlockTopic,
      onReportTopic: this.props.onReportTopic,
      onLaunchPermissionsEditor: this.handleLaunchPermissionsEditor,
      onNavigate: this.props.onNavigate
    }) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "info-view-content",
      className: "scrollable-panel"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-column"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      className: "flat-button float-right",
      onClick: e => {
        e.preventDefault();
        this.props.onNavigate('general');
      }
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "edit"), "\xA0", react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "button_edit",
      defaultMessage: [{
        "type": 0,
        "value": "Edit"
      }]
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("center", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_avatar_upload_jsx__WEBPACK_IMPORTED_MODULE_3__.default, {
      tinode: this.props.tinode,
      avatar: this.state.avatar,
      readOnly: true,
      uid: this.props.topic,
      title: this.state.fullName
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "group"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      className: "small"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_topic_name",
      defaultMessage: [{
        "type": 0,
        "value": "Name"
      }]
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "large ellipsized"
    }, this.state.fullName, this.state.channel ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("img", {
      src: "/img/channel.png",
      className: "channel",
      alt: "channel"
    }) : null)), this.state.private ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "group"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      className: "small"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_private",
      defaultMessage: [{
        "type": 0,
        "value": "Private comment"
      }]
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "large ellipsized"
    }, this.state.private)) : null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "group"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      className: "small"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_user_id",
      defaultMessage: [{
        "type": 0,
        "value": "ID:"
      }]
    })), "\xA0", react__WEBPACK_IMPORTED_MODULE_0___default().createElement("tt", null, this.state.address)), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "group"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_badge_list_jsx__WEBPACK_IMPORTED_MODULE_4__.default, {
      trustedBadges: this.state.trustedBadges
    })), this.state.description ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "group"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      className: "small"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_description",
      defaultMessage: [{
        "type": 0,
        "value": "Description"
      }]
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, this.state.description)) : null), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
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
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_checkbox_jsx__WEBPACK_IMPORTED_MODULE_5__.default, {
      name: "P",
      checked: this.state.muted,
      onChange: this.handleMuted
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "hr"
    }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-column"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      className: "flat-button",
      onClick: e => {
        e.preventDefault();
        this.props.onNavigate('security');
      }
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "security"), "\xA0", react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "button_security",
      defaultMessage: [{
        "type": 0,
        "value": "Security"
      }]
    }))), this.state.groupTopic && this.state.sharer ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
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
    }, no_members => react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_contact_list_jsx__WEBPACK_IMPORTED_MODULE_6__.default, {
      tinode: this.props.tinode,
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
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(InfoView));

/***/ }),

/***/ "./src/views/login-view.jsx":
/*!**********************************!*\
  !*** ./src/views/login-view.jsx ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LoginView)
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
      saveToken: props.persist
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
    this.props.onPersistenceChange(!this.state.saveToken);
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LogoView)
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tinode-sdk */ "tinode-sdk");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _widgets_chat_message_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../widgets/chat-message.jsx */ "./src/widgets/chat-message.jsx");
/* harmony import */ var _widgets_contact_badges_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../widgets/contact-badges.jsx */ "./src/widgets/contact-badges.jsx");
/* harmony import */ var _widgets_doc_preview_jsx__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../widgets/doc-preview.jsx */ "./src/widgets/doc-preview.jsx");
/* harmony import */ var _widgets_error_panel_jsx__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../widgets/error-panel.jsx */ "./src/widgets/error-panel.jsx");
/* harmony import */ var _widgets_group_subs_jsx__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../widgets/group-subs.jsx */ "./src/widgets/group-subs.jsx");
/* harmony import */ var _widgets_image_preview_jsx__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../widgets/image-preview.jsx */ "./src/widgets/image-preview.jsx");
/* harmony import */ var _widgets_invitation_jsx__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../widgets/invitation.jsx */ "./src/widgets/invitation.jsx");
/* harmony import */ var _widgets_letter_tile_jsx__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../widgets/letter-tile.jsx */ "./src/widgets/letter-tile.jsx");
/* harmony import */ var _widgets_load_spinner_jsx__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../widgets/load-spinner.jsx */ "./src/widgets/load-spinner.jsx");
/* harmony import */ var _logo_view_jsx__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./logo-view.jsx */ "./src/views/logo-view.jsx");
/* harmony import */ var _widgets_send_message_jsx__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../widgets/send-message.jsx */ "./src/widgets/send-message.jsx");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var _lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../lib/blob-helpers.js */ "./src/lib/blob-helpers.js");
/* harmony import */ var _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../lib/navigation.js */ "./src/lib/navigation.js");
/* harmony import */ var _lib_strformat_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../lib/strformat.js */ "./src/lib/strformat.js");
/* harmony import */ var _lib_utils_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../lib/utils.js */ "./src/lib/utils.js");



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
    this.handleSendMessage = this.handleSendMessage.bind(this);
    this.handlePickReply = this.handlePickReply.bind(this);
    this.handleCancelReply = this.handleCancelReply.bind(this);
    this.handleQuoteClick = this.handleQuoteClick.bind(this);
    this.convertIntoThumbnails = this.convertIntoThumbnails.bind(this);
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
        getQuery = getQuery.withLaterData(_config_js__WEBPACK_IMPORTED_MODULE_14__.MESSAGES_PAGE);

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
          _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__.default.navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__.default.setUrlTopic('', ctrl.params.topic));
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
        isVerified: false,
        isStaff: false,
        isDangerous: false,
        docPreview: null,
        imagePreview: null,
        imagePostview: null,
        typingIndicator: false,
        scrollPosition: 0,
        fetchingMessages: false,
        peerMessagingDisabled: false,
        channel: false,
        reply: null
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
        fetchingMessages: false,
        reply: null
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
            avatar: (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_15__.makeImageUrl)(topic.public.photo)
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
            topic.getMessagesPage(_config_js__WEBPACK_IMPORTED_MODULE_14__.MESSAGES_PAGE).catch(err => {
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
        avatar: (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_15__.makeImageUrl)(desc.public.photo)
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
      sendAt: now.setMilliseconds(now.getMilliseconds() + _config_js__WEBPACK_IMPORTED_MODULE_14__.READ_DELAY)
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
          }, _config_js__WEBPACK_IMPORTED_MODULE_14__.KEYPRESS_DELAY + 1000);

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

      ['name', 'seq'].map(key => {
        if (data[key]) {
          params.set(key, data[key]);
        }
      });
      params.set('uid', this.props.myUserId);
      params.set('topic', this.state.topic);
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
    this.props.onChangePermissions(this.state.topic, _config_js__WEBPACK_IMPORTED_MODULE_14__.DEFAULT_P2P_ACCESS_MODE, this.state.topic);
  }

  sendKeyPress() {
    const topic = this.props.tinode.getTopic(this.state.topic);

    if (topic.isSubscribed()) {
      topic.noteKeyPress();
    }
  }

  sendFileAttachment(file) {
    const maxInbandAttachmentSize = this.props.tinode.getServerLimit('maxMessageSize', _config_js__WEBPACK_IMPORTED_MODULE_14__.MAX_INBAND_ATTACHMENT_SIZE) * 0.75 - 1024 | 0;

    if (file.size > maxInbandAttachmentSize) {
      const uploader = this.props.tinode.getLargeFileHelper();
      const uploadCompletionPromise = uploader.upload(file);
      const msg = Drafty.attachFile(null, {
        mime: file.type,
        filename: file.name,
        size: file.size,
        urlPromise: uploadCompletionPromise
      });
      this.props.sendMessage(msg, uploadCompletionPromise, uploader);
    } else {
      (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_15__.fileToBase64)(file, (mime, bits, fname) => {
        this.props.sendMessage(Drafty.attachFile(null, {
          mime: mime,
          data: bits,
          filename: fname
        }));
      }, this.props.onError);
    }
  }

  handleAttachFile(file) {
    const maxExternAttachmentSize = this.props.tinode.getServerLimit('maxFileUploadSize', _config_js__WEBPACK_IMPORTED_MODULE_14__.MAX_EXTERN_ATTACHMENT_SIZE);

    if (file.size > maxExternAttachmentSize) {
      this.props.onError(this.props.intl.formatMessage(messages.file_attachment_too_large, {
        size: (0,_lib_strformat_js__WEBPACK_IMPORTED_MODULE_17__.bytesToHumanSize)(file.size),
        limit: (0,_lib_strformat_js__WEBPACK_IMPORTED_MODULE_17__.bytesToHumanSize)(maxExternAttachmentSize)
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
    const maxInbandAttachmentSize = this.props.tinode.getServerLimit('maxMessageSize', _config_js__WEBPACK_IMPORTED_MODULE_14__.MAX_INBAND_ATTACHMENT_SIZE) * 0.75 - 1024 | 0;

    if (blob.size > maxInbandAttachmentSize) {
      const uploader = this.props.tinode.getLargeFileHelper();

      if (!uploader) {
        this.props.onError(this.props.intl.formatMessage(messages.cannot_initiate_upload));
        return;
      }

      const uploadCompletionPromise = uploader.upload(blob);
      (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_15__.imageScaled)(blob, _config_js__WEBPACK_IMPORTED_MODULE_14__.IMAGE_PREVIEW_DIM, _config_js__WEBPACK_IMPORTED_MODULE_14__.IMAGE_PREVIEW_DIM, -1, false, (tinyMine, tinyBlob) => {
        (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_15__.blobToBase64)(tinyBlob, (blobMime, tinyBits64) => {
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

    (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_15__.blobToBase64)(blob, (blobMime, bits64) => {
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
    const maxExternAttachmentSize = this.props.tinode.getServerLimit('maxFileUploadSize', _config_js__WEBPACK_IMPORTED_MODULE_14__.MAX_EXTERN_ATTACHMENT_SIZE);
    (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_15__.imageScaled)(file, _config_js__WEBPACK_IMPORTED_MODULE_14__.MAX_IMAGE_DIM, _config_js__WEBPACK_IMPORTED_MODULE_14__.MAX_IMAGE_DIM, maxExternAttachmentSize, false, (mime, blob, width, height, fname) => {
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

  handlePickReply(m) {
    this.setState({
      reply: null
    });

    if (m) {
      let cont = m.content;

      if (cont) {
        if (typeof cont == 'string') {
          cont = Drafty.init(cont);
        }

        cont = Drafty.preview(cont, 30, (src, target) => {
          if (src.data && src.tp && src.tp == 'IM') {
            ['val', 'ref'].forEach(key => {
              const val = src.data[key];

              if (val) {
                target.data[key] = val;
              }
            });
          }
        });
        let header = '';
        const seq = m.seq;
        const idx = this.msgIndex(seq);

        if (idx < this.state.messages.length) {
          const m0 = this.state.messages[idx];
          let thisFrom = m0.from || 'chan';

          if (thisFrom != this.props.myUserId) {
            const topic = this.props.tinode.getTopic(this.state.topic);
            const user = topic.userDesc(thisFrom);

            if (user && user.public) {
              header = user.public.fn;
            }
          } else {
            header = this.props.myUserName;
          }
        }

        header = Drafty.init(header);
        let ents = [];

        if (cont.ent) {
          Drafty.entities(cont, (data, idx, tp) => {
            if (tp == 'IM') {
              ents.push({
                tp: tp,
                data: data
              });
            }
          }, this);
        }

        this.convertIntoThumbnails(ents, 0, success => {
          if (success) {
            const msg = Drafty.createQuote(header, cont);
            this.setState({
              reply: {
                content: msg,
                seq: m.seq
              }
            });
          }
        });
        return;
      }
    }
  }

  msgIndex(seq) {
    let l = -1;
    let r = this.state.messages.length;

    while (r > l + 1) {
      const m = Math.floor((l + r) / 2);

      if (this.state.messages[m].seq < seq) {
        l = m;
      } else {
        r = m;
      }
    }

    return r;
  }

  convertIntoThumbnails(ents, idx, done) {
    if (idx >= ents.length) {
      done(true);
      return;
    }

    function scale(origBlob) {
      (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_15__.imageScaled)(origBlob, _config_js__WEBPACK_IMPORTED_MODULE_14__.IMAGE_THUMBNAIL_DIM, _config_js__WEBPACK_IMPORTED_MODULE_14__.IMAGE_THUMBNAIL_DIM, -1, false, (mime, blob, width, height, fname) => {
        let ex = ents[idx];
        ex.data.mime = mime;
        ex.data.val = blob;
        ex.data.width = width;
        ex.data.height = height;
        ex.data.name = fname;
        ex.data.ref = undefined;
        (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_15__.blobToBase64)(blob, (blobMime, tinyBits64) => {
          ex.data.val = tinyBits64;
          this.convertIntoThumbnails(ents, idx + 1, done);
        });
      }, err => {
        done(false);
        this.props.onError(err, 'err');
      });
    }

    const ex = ents[idx];

    if (ex.data.val) {
      const b = (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_15__.base64ToBlob)(ex.data.val, ex.data.mime);

      if (b) {
        scale.call(this, b);
      }
    } else {
      let saveThis = this;
      const from = this.props.tinode.authorizeURL((0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_18__.sanitizeImageUrl)(ex.data.ref));
      fetch(from).then(e => e.blob()).then(function (b) {
        scale.call(saveThis, b);
      });
      return;
    }
  }

  handleSendMessage(msg) {
    if (this.state.reply) {
      let quote = this.state.reply.content;

      if (quote) {
        if (typeof msg == 'string') {
          msg = Drafty.init(msg);
        }

        msg = Drafty.attachQuote(msg, quote);
        let head = {
          replyToSeq: this.state.reply.seq
        };
        this.props.sendMessage(msg, undefined, undefined, head);
        this.setState({
          reply: null
        });
        return;
      }
    }

    this.props.sendMessage(msg);
  }

  handleCancelReply() {
    this.setState({
      reply: null
    });
  }

  handleQuoteClick(replyToSeq) {
    const element = document.getElementById("msg-" + replyToSeq);

    if (element) {
      element.scrollIntoView({
        block: "center",
        behavior: "smooth"
      });
      element.style.backgroundColor = 'rgb(0, 0, 0, 0.4)';
      setTimeout(() => {
        element.style.backgroundColor = '';
      }, 1000);
    }
  }

  render() {
    const {
      formatMessage
    } = this.props.intl;
    let component;

    if (this.props.hideSelf) {
      component = null;
    } else if (!this.state.topic) {
      component = react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_logo_view_jsx__WEBPACK_IMPORTED_MODULE_12__.default, {
        serverVersion: this.props.serverVersion,
        serverAddress: this.props.serverAddress
      });
    } else {
      let component2;

      if (this.state.imagePreview) {
        component2 = react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_image_preview_jsx__WEBPACK_IMPORTED_MODULE_8__.default, {
          content: this.state.imagePreview,
          onClose: this.handleClosePreview,
          onSendMessage: this.sendImageAttachment
        });
      } else if (this.state.imagePostview) {
        component2 = react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_image_preview_jsx__WEBPACK_IMPORTED_MODULE_8__.default, {
          content: this.state.imagePostview,
          onClose: this.handleClosePreview
        });
      } else if (this.state.docPreview) {
        component2 = react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_doc_preview_jsx__WEBPACK_IMPORTED_MODULE_5__.default, {
          content: this.state.docPreview,
          onClose: this.handleClosePreview,
          onSendMessage: this.sendFileAttachment
        });
      } else {
        const topic = this.props.tinode.getTopic(this.state.topic);
        const isChannel = topic.isChannelType();
        const groupTopic = topic.isGroupType() && !isChannel;
        const icon_badges = [];

        if (topic.trusted) {
          if (topic.trusted.verified) {
            icon_badges.push({
              icon: 'verified',
              color: 'badge-inv'
            });
          }

          if (topic.trusted.staff) {
            icon_badges.push({
              icon: 'staff',
              color: 'badge-inv'
            });
          }

          if (topic.trusted.danger) {
            icon_badges.push({
              icon: 'dangerous',
              color: 'badge-inv'
            });
          }
        }

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
              userAvatar = (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_15__.makeImageUrl)(user.public.photo);
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
            pickReply: this.handlePickReply,
            replyToSeq: msg.head ? msg.head.replyToSeq : null,
            onQuoteClick: this.handleQuoteClick,
            onFormatQuote: quoteFormatter,
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
              lastSeen = formatMessage(messages.last_seen) + ": " + (0,_lib_strformat_js__WEBPACK_IMPORTED_MODULE_17__.shortDateFormat)(cont.seen.when, this.props.intl.locale);
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
        }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_letter_tile_jsx__WEBPACK_IMPORTED_MODULE_10__.default, {
          tinode: this.props.tinode,
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
        })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_contact_badges_jsx__WEBPACK_IMPORTED_MODULE_4__.default, {
          badges: icon_badges
        })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
          id: "topic-last-seen"
        }, lastSeen)), groupTopic ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_group_subs_jsx__WEBPACK_IMPORTED_MODULE_7__.default, {
          tinode: this.props.tinode,
          subscribers: this.state.onlineSubs
        }) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
          id: "topic-users"
        }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
          href: "#",
          onClick: this.handleContextClick
        }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
          className: "material-icons"
        }, "more_vert")))), this.props.displayMobile ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_error_panel_jsx__WEBPACK_IMPORTED_MODULE_6__.default, {
          level: this.props.errorLevel,
          text: this.props.errorText,
          onClearError: this.props.onError
        }) : null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_load_spinner_jsx__WEBPACK_IMPORTED_MODULE_11__.default, {
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
        })), ".") : null, this.state.unconfirmed ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_invitation_jsx__WEBPACK_IMPORTED_MODULE_9__.default, {
          onAction: this.handleNewChatAcceptance
        }) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_send_message_jsx__WEBPACK_IMPORTED_MODULE_13__.default, {
          disabled: !this.state.isWriter,
          onKeyPress: this.sendKeyPress,
          onAttachFile: this.handleAttachFile,
          onAttachImage: this.handleAttachImage,
          onError: this.props.onError,
          tinode: this.props.tinode,
          replyTo: this.state.reply,
          onQuoteClick: this.handleQuoteClick,
          onSendMessage: this.handleSendMessage,
          onFormatQuote: quoteFormatter,
          onCancelReply: this.handleCancelReply
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

function quoteFormatter(style, data, values, key) {
  let el = Drafty.tagName(style);
  let attr = {
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
        if (data) {
          attr = Drafty.attrValue(style, data) || {};
          attr.key = key;
          attr.className = 'inline-image';
          const dim = (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_15__.fitImageSize)(data.width, data.height, Math.min(this.props.viewportWidth - _config_js__WEBPACK_IMPORTED_MODULE_14__.REM_SIZE * 6.5, _config_js__WEBPACK_IMPORTED_MODULE_14__.REM_SIZE * 34.5), _config_js__WEBPACK_IMPORTED_MODULE_14__.REM_SIZE * 24, false) || {
            dstWidth: _config_js__WEBPACK_IMPORTED_MODULE_14__.BROKEN_IMAGE_SIZE,
            dstHeight: _config_js__WEBPACK_IMPORTED_MODULE_14__.BROKEN_IMAGE_SIZE
          };
          attr.style = {
            width: dim.dstWidth + 'px',
            height: dim.dstHeight + 'px',
            minWidth: dim.dstWidth + 'px',
            minHeight: dim.dstHeight + 'px'
          };
          attr.src = this.props.tinode.authorizeURL((0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_18__.sanitizeImageUrl)(attr.src));
          attr.alt = data.name;

          if (!attr.src) {
            attr.src = 'img/broken_image.png';
          }
        }

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

      case 'QQ':
        attr.className = 'reply-quote';
        attr.onClick = this.handleQuoteClick;
        break;

      case 'QH':
        attr.className = 'reply-quote-header';
        break;

      case 'QB':
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
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(MessagesView));

/***/ }),

/***/ "./src/views/new-topic-view.jsx":
/*!**************************************!*\
  !*** ./src/views/new-topic-view.jsx ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
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

  handleNewGroupSubmit(name, description, dataUrl, priv, tags, isChannel) {
    _lib_navigation_js__WEBPACK_IMPORTED_MODULE_7__.default.navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_7__.default.removeUrlParam(window.location.hash, 'tab'));
    this.props.onCreateTopic(undefined, (0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_8__.theCard)(name, dataUrl, null, description), priv, tags, isChannel);
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
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(NewTopicView));

/***/ }),

/***/ "./src/views/password-reset-view.jsx":
/*!*******************************************!*\
  !*** ./src/views/password-reset-view.jsx ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PasswordResetView)
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SettingsView)
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _widgets_error_panel_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../widgets/error-panel.jsx */ "./src/widgets/error-panel.jsx");
/* harmony import */ var _widgets_load_spinner_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../widgets/load-spinner.jsx */ "./src/widgets/load-spinner.jsx");
/* harmony import */ var _widgets_side_navbar_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../widgets/side-navbar.jsx */ "./src/widgets/side-navbar.jsx");
/* harmony import */ var _widgets_topic_common_jsx__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../widgets/topic-common.jsx */ "./src/widgets/topic-common.jsx");
/* harmony import */ var _account_settings_view_jsx__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./account-settings-view.jsx */ "./src/views/account-settings-view.jsx");
/* harmony import */ var _contacts_view_jsx__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./contacts-view.jsx */ "./src/views/contacts-view.jsx");
/* harmony import */ var _create_account_view_jsx__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./create-account-view.jsx */ "./src/views/create-account-view.jsx");
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
    id: "panel_title_general",
    defaultMessage: [{
      "type": 0,
      "value": "General"
    }]
  },
  security: {
    id: "panel_title_security",
    defaultMessage: [{
      "type": 0,
      "value": "Security"
    }]
  },
  crop: {
    id: "panel_title_crop",
    defaultMessage: [{
      "type": 0,
      "value": "Drag to Adjust"
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
    this.handleNewTopic = this.handleNewTopic.bind(this);
  }

  handleNewTopic() {
    this.props.onNavigate('newtpk');
  }

  render() {
    const {
      formatMessage
    } = this.props.intl;
    const view = this.props.state || (this.props.myUserId ? 'contacts' : 'login');
    let title, avatar, badges;

    if (view == 'contacts') {
      title = this.props.title;
      avatar = this.props.avatar ? this.props.avatar : true;
      badges = this.props.trustedBadges;
    } else {
      title = formatMessage(messages[view]);
      avatar = false;
      badges = null;
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
      tinode: this.props.tinode,
      trustedBadges: badges,
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
      persist: this.props.persist,
      onLogin: this.props.onLoginRequest,
      onPersistenceChange: this.props.onPersistenceChange
    }) : view === 'register' ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_create_account_view_jsx__WEBPACK_IMPORTED_MODULE_8__.default, {
      tinode: this.props.tinode,
      onCreateAccount: this.props.onCreateAccount,
      onCancel: this.props.onCancel,
      onError: this.props.onError
    }) : view === 'settings' ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_settings_view_jsx__WEBPACK_IMPORTED_MODULE_15__.default, {
      transport: this.props.transport,
      serverAddress: this.props.serverAddress,
      onCancel: this.props.onCancel,
      onUpdate: this.props.onGlobalSettings
    }) : view === 'edit' ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_account_settings_view_jsx__WEBPACK_IMPORTED_MODULE_6__.default, {
      tinode: this.props.tinode,
      myUserId: this.props.myUserId,
      trustedBadges: this.props.trustedBadges,
      onNavigate: this.props.onNavigate
    }) : view === 'general' || view === 'crop' ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_topic_common_jsx__WEBPACK_IMPORTED_MODULE_5__.default, {
      topic: "me",
      tinode: this.props.tinode,
      myUserId: this.props.myUserId,
      onUpdateTopicDesc: this.props.onUpdateAccountDesc,
      onUpdateTags: this.props.onUpdateAccountTags,
      onCredAdd: this.props.onCredAdd,
      onCredDelete: this.props.onCredDelete,
      onCredConfirm: this.props.onCredConfirm,
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
      onUpdateAccountDesc: this.props.onUpdateAccountDesc,
      onUpdatePassword: this.props.onUpdatePassword,
      onLogout: this.props.onLogout,
      onDeleteAccount: this.props.onDeleteAccount,
      onShowAlert: this.props.onShowAlert,
      onShowBlocked: this.props.onShowBlocked
    }) : view === 'support' ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_acc_support_view_jsx__WEBPACK_IMPORTED_MODULE_11__.default, {
      serverAddress: this.props.serverAddress,
      serverVersion: this.props.serverVersion
    }) : view === 'contacts' || view == 'archive' || view == 'blocked' ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_contacts_view_jsx__WEBPACK_IMPORTED_MODULE_7__.default, {
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
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(SidepanelView));

/***/ }),

/***/ "./src/views/tinode-web.jsx":
/*!**********************************!*\
  !*** ./src/views/tinode-web.jsx ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var firebase_app__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! firebase/app */ "firebase/app");
/* harmony import */ var firebase_app__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(firebase_app__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var firebase_messaging__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! firebase/messaging */ "firebase/messaging");
/* harmony import */ var firebase_messaging__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(firebase_messaging__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! tinode-sdk */ "tinode-sdk");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _widgets_alert_jsx__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../widgets/alert.jsx */ "./src/widgets/alert.jsx");
/* harmony import */ var _widgets_context_menu_jsx__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../widgets/context-menu.jsx */ "./src/widgets/context-menu.jsx");
/* harmony import */ var _info_view_jsx__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./info-view.jsx */ "./src/views/info-view.jsx");
/* harmony import */ var _messages_view_jsx__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./messages-view.jsx */ "./src/views/messages-view.jsx");
/* harmony import */ var _sidepanel_view_jsx__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./sidepanel-view.jsx */ "./src/views/sidepanel-view.jsx");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var _version_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../version.js */ "./src/version.js");
/* harmony import */ var _lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../lib/blob-helpers.js */ "./src/lib/blob-helpers.js");
/* harmony import */ var _lib_host_name_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../lib/host-name.js */ "./src/lib/host-name.js");
/* harmony import */ var _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../lib/local-storage.js */ "./src/lib/local-storage.js");
/* harmony import */ var _lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../lib/navigation.js */ "./src/lib/navigation.js");
/* harmony import */ var _lib_strformat_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../lib/strformat.js */ "./src/lib/strformat.js");
/* harmony import */ var _lib_utils_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../lib/utils.js */ "./src/lib/utils.js");


















const POP_SOUND = new Audio('audio/msg.mp3');
const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_1__.defineMessages)({
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
    this.selfRef = react__WEBPACK_IMPORTED_MODULE_0___default().createRef();
    this.state = this.getBlankState();
    this.handleResize = this.handleResize.bind(this);
    this.handleHashRoute = this.handleHashRoute.bind(this);
    this.handleOnline = this.handleOnline.bind(this);
    this.checkForAppUpdate = this.checkForAppUpdate.bind(this);
    this.handleVisibilityEvent = this.handleVisibilityEvent.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handleLoginRequest = this.handleLoginRequest.bind(this);
    this.handlePersistenceChange = this.handlePersistenceChange.bind(this);
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
    this.handleUpdatePasswordRequest = this.handleUpdatePasswordRequest.bind(this);
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
    this.handleDeleteTopicRequest = this.handleDeleteTopicRequest.bind(this);
    this.handleDeleteMessagesRequest = this.handleDeleteMessagesRequest.bind(this);
    this.handleLeaveUnsubRequest = this.handleLeaveUnsubRequest.bind(this);
    this.handleBlockTopicRequest = this.handleBlockTopicRequest.bind(this);
    this.handleReportTopic = this.handleReportTopic.bind(this);
    this.handleShowContextMenu = this.handleShowContextMenu.bind(this);
    this.defaultTopicContextMenu = this.defaultTopicContextMenu.bind(this);
    this.handleHideContextMenu = this.handleHideContextMenu.bind(this);
    this.handleShowAlert = this.handleShowAlert.bind(this);
    this.handleShowInfoView = this.handleShowInfoView.bind(this);
    this.handleMemberUpdateRequest = this.handleMemberUpdateRequest.bind(this);
    this.handleValidateCredentialsRequest = this.handleValidateCredentialsRequest.bind(this);
    this.handlePasswordResetRequest = this.handlePasswordResetRequest.bind(this);
    this.handleResetPassword = this.handleResetPassword.bind(this);
    this.handleContextMenuAction = this.handleContextMenuAction.bind(this);
  }

  getBlankState() {
    const settings = _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_14__.default.getObject('settings') || {};
    const persist = !!_lib_local_storage_js__WEBPACK_IMPORTED_MODULE_14__.default.getObject('keep-logged-in');
    return {
      connected: false,
      ready: false,
      autoLogin: false,
      transport: settings.transport || null,
      serverAddress: settings.serverAddress || (0,_lib_host_name_js__WEBPACK_IMPORTED_MODULE_13__.detectServerAddress)(),
      serverVersion: "no connection",
      messageSounds: !settings.messageSoundsOff,
      incognitoMode: false,
      desktopAlerts: persist && settings.desktopAlerts,
      desktopAlertsEnabled: ((0,_lib_host_name_js__WEBPACK_IMPORTED_MODULE_13__.isSecureConnection)() || (0,_lib_host_name_js__WEBPACK_IMPORTED_MODULE_13__.isLocalHost)()) && typeof firebase_app__WEBPACK_IMPORTED_MODULE_2__ != 'undefined' && typeof navigator != 'undefined' && typeof FIREBASE_INIT != 'undefined',
      firebaseToken: persist ? _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_14__.default.getObject('firebase-token') : null,
      applicationVisible: !document.hidden,
      errorText: '',
      errorLevel: null,
      errorAction: undefined,
      errorActionText: null,
      sidePanelSelected: 'login',
      sidePanelTitle: null,
      sidePanelAvatar: null,
      myTrustedBadges: [],
      loadSpinnerVisible: false,
      login: '',
      password: '',
      persist: persist,
      myUserId: null,
      liveConnection: navigator.onLine,
      topicSelected: '',
      topicSelectedOnline: false,
      topicSelectedAcs: null,
      newTopicParams: null,
      loginDisabled: false,
      displayMobile: window.innerWidth <= _config_js__WEBPACK_IMPORTED_MODULE_10__.MEDIA_BREAKPOINT,
      infoPanel: undefined,
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

    if (typeof BroadcastChannel == 'function') {
      const serviceWorkerChannel = new BroadcastChannel('tinode-sw');
      serviceWorkerChannel.addEventListener('message', this.handlePushMessage);
    } else {
      console.warn('Your browser does not support BroadcastChannel. Some features will not be available');
    }

    document.addEventListener('visibilitychange', this.handleVisibilityEvent);
    this.setState({
      viewportWidth: document.documentElement.clientWidth,
      viewportHeight: document.documentElement.clientHeight
    });
    new Promise((resolve, reject) => {
      this.tinode = TinodeWeb.tnSetup(this.state.serverAddress, this.state.transport, this.props.intl.locale, this.state.persist, resolve);
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

      const parsedNav = _lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__.default.parseUrlHash(window.location.hash);
      this.resetContactList();
      const token = this.state.persist ? _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_14__.default.getObject('auth-token') : undefined;

      if (token) {
        this.setState({
          autoLogin: true
        });
        token.expires = new Date(token.expires);
        this.tinode.setAuthToken(token);
        this.tinode.connect().catch(err => {
          this.handleError(err.message, 'err');
        });
      }

      this.setState({
        requestedTopic: parsedNav.path[1]
      });
      _lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__.default.navigateTo('');
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
    const tinode = new (tinode_sdk__WEBPACK_IMPORTED_MODULE_4___default())({
      appName: _config_js__WEBPACK_IMPORTED_MODULE_10__.APP_NAME,
      host: serverAddress,
      apiKey: _config_js__WEBPACK_IMPORTED_MODULE_10__.API_KEY,
      transport: transport,
      secure: (0,_lib_host_name_js__WEBPACK_IMPORTED_MODULE_13__.isSecureConnection)(),
      persist: persistentCache
    }, onSetupCompleted);
    tinode.setHumanLanguage(locale);
    tinode.enableLogging(_config_js__WEBPACK_IMPORTED_MODULE_10__.LOGGING_ENABLED, true);
    return tinode;
  }

  handlePushMessage(data) {
    if (data.what == 'msg' && tinode_sdk__WEBPACK_IMPORTED_MODULE_4___default().isChannelTopicName(data.topic)) {
      this.tinode.oobNotification(data.topic, data.seq, 'fake-uid');
    }
  }

  initFCMessaging() {
    const {
      formatMessage,
      locale
    } = this.props.intl;

    const onError = (msg, err) => {
      console.error(msg, err);
      this.handleError(formatMessage(messages.push_init_failed), 'err');
      this.setState({
        desktopAlertsEnabled: false
      });
    };

    try {
      this.fbPush = firebase_app__WEBPACK_IMPORTED_MODULE_2__.initializeApp(FIREBASE_INIT, _config_js__WEBPACK_IMPORTED_MODULE_10__.APP_NAME).messaging();
      this.fbPush.usePublicVapidKey(FIREBASE_INIT.messagingVapidKey);
      return navigator.serviceWorker.register('/service-worker.js').then(reg => {
        this.checkForAppUpdate(reg);
        this.fbPush.useServiceWorker(reg);
        reg.active.postMessage(JSON.stringify({
          locale: locale,
          version: _version_js__WEBPACK_IMPORTED_MODULE_11__.PACKAGE_VERSION
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
    const mobile = document.documentElement.clientWidth <= _config_js__WEBPACK_IMPORTED_MODULE_10__.MEDIA_BREAKPOINT;
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
          const msg = react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "update_available",
            defaultMessage: [{
              "type": 0,
              "value": "Update available."
            }]
          }), " ", react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
            href: ""
          }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
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
    const hash = _lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__.default.parseUrlHash(window.location.hash);

    if (hash.path && hash.path.length > 0) {
      if (['register', 'settings', 'edit', 'notif', 'security', 'support', 'general', 'crop', 'cred', 'reset', 'newtpk', 'archive', 'blocked', 'contacts', ''].includes(hash.path[0])) {
        this.setState({
          sidePanelSelected: hash.path[0]
        });
      } else {
        console.warn("Unknown sidepanel view", hash.path[0]);
      }

      let topicName = hash.path[1] || null;

      if (topicName != this.state.topicSelected) {
        if (!tinode_sdk__WEBPACK_IMPORTED_MODULE_4___default().topicType(topicName)) {
          topicName = null;
        }

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
        sidePanelSelected: '',
        topicSelected: null
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
      infoPanel: hash.params.info,
      newTopicTabSelected: hash.params.tab
    });
  }

  handleOnline(online) {
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

  handlePersistenceChange(persist) {
    if (persist) {
      this.tinode.initStorage().then(() => {
        _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_14__.default.setObject('keep-logged-in', true);
        this.setState({
          persist: true
        });
      });
    } else {
      this.tinode.clearStorage().then(() => {
        _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_14__.default.setObject('keep-logged-in', false);
        this.setState({
          persist: false
        });
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
      const timeLeft = count > 99 ? (0,_lib_strformat_js__WEBPACK_IMPORTED_MODULE_16__.secondsToTime)(count) : count;
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
      _lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__.default.navigateTo('');
      return;
    }

    cred = tinode_sdk__WEBPACK_IMPORTED_MODULE_4___default().credential(cred);
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
        _lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__.default.navigateTo('');
      });
    } else {
      _lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__.default.navigateTo('');
      this.setState({
        loginDisabled: false
      });
    }
  }

  handleCredentialsRequest(params) {
    const parsed = _lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__.default.parseUrlHash(window.location.hash);
    parsed.path[0] = 'cred';
    parsed.params['method'] = params.cred[0];
    _lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__.default.navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__.default.composeUrlHash(parsed.path, parsed.params));
  }

  handleLoginSuccessful() {
    this.handleError();

    if (_lib_local_storage_js__WEBPACK_IMPORTED_MODULE_14__.default.getObject('keep-logged-in')) {
      _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_14__.default.setObject('auth-token', this.tinode.getAuthToken());
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
      _lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__.default.navigateTo('');
    }).finally(() => {
      this.setState({
        loadSpinnerVisible: false
      });
    });
    let urlHash = _lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__.default.setUrlSidePanel(window.location.hash, 'contacts');

    if (goToTopic) {
      urlHash = _lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__.default.setUrlTopic(urlHash, goToTopic);
    }

    _lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__.default.navigateTo(urlHash);
  }

  tnMeMetaDesc(desc) {
    if (desc) {
      if (desc.public) {
        this.setState({
          sidePanelTitle: desc.public.fn,
          sidePanelAvatar: (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_12__.makeImageUrl)(desc.public.photo)
        });
      }

      if (desc.trusted) {
        const badges = [];

        for (const [key, val] of Object.entries(desc.trusted)) {
          if (val) {
            badges.push(key);
          }
        }

        this.setState({
          myTrustedBadges: badges
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
      console.info("Unsupported (yet) presence update:" + what + " in: " + cont.topic);
    }
  }

  tnMeSubsUpdated(unused) {
    this.resetContactList();
  }

  static prepareSearchableContacts(chatList, foundContacts) {
    const merged = {};

    for (const c of chatList) {
      if (tinode_sdk__WEBPACK_IMPORTED_MODULE_4___default().isP2PTopicName(c.topic)) {
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
    const past = new Date(0);
    newState.chatList.sort((a, b) => {
      return (a.touched || past).getTime() - (b.touched || past).getTime();
    });
    newState.searchableContacts = TinodeWeb.prepareSearchableContacts(newState.chatList, this.state.searchResults);
    this.setState(newState);
  }

  tnData(data) {
    const topic = this.tinode.getTopic(data.topic);

    if (topic.msgStatus(data, true) >= (tinode_sdk__WEBPACK_IMPORTED_MODULE_4___default().MESSAGE_STATUS_SENT) && data.from != this.state.myUserId) {
      clearTimeout(this.receivedTimer);
      this.receivedTimer = setTimeout(() => {
        this.receivedTimer = undefined;
        topic.noteRecv(data.seq);
      }, _config_js__WEBPACK_IMPORTED_MODULE_10__.RECEIVED_DELAY);
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
        infoPanel: undefined
      });

      if (this.state.topicSelected != topicName) {
        this.setState({
          topicSelectedOnline: this.tinode.isTopicOnline(topicName),
          topicSelectedAcs: this.tinode.getTopicAccessMode(topicName)
        });
        _lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__.default.navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__.default.setUrlTopic('', topicName));
      }
    } else {
      this.setState({
        errorText: '',
        errorLevel: null,
        mobilePanel: 'sidepanel',
        topicSelectedOnline: false,
        topicSelectedAcs: null,
        infoPanel: undefined
      });
      _lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__.default.navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__.default.setUrlTopic('', null));
    }
  }

  handleHideMessagesView() {
    this.setState({
      mobilePanel: 'sidepanel'
    });
    _lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__.default.navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__.default.setUrlTopic(window.location.hash, null));
  }

  handleSendMessage(msg, promise, uploader, head) {
    const topic = this.tinode.getTopic(this.state.topicSelected);
    msg = topic.createMessage(msg, false);
    msg._uploader = uploader;

    if (head) {
      if (!msg.hasOwnProperty('head')) {
        msg.head = {};
      }

      for (const [key, value] of Object.entries(head)) {
        msg.head[key] = value;
      }
    }

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
        console.warn("Unknown invitation action", '"' + action + '""');
    }

    if (response != null) {
      response.catch(err => {
        this.handleError(err.message, 'err');
      });
    }
  }

  handleNewAccount() {
    this.handleError();
    _lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__.default.navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__.default.setUrlSidePanel(window.location.hash, 'register'));
  }

  handleNewAccountRequest(login_, password_, public_, cred_, tags_) {
    this.handleError();
    this.tinode.connect(this.state.serverAddress).then(() => {
      return this.tinode.createAccountBasic(login_, password_, {
        public: public_,
        tags: tags_,
        cred: tinode_sdk__WEBPACK_IMPORTED_MODULE_4___default().credential(cred_)
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
    _lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__.default.navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__.default.setUrlSidePanel(window.location.hash, this.state.myUserId ? 'edit' : 'settings'));
  }

  handleGlobalSettings(settings) {
    const serverAddress = settings.serverAddress || this.state.serverAddress;
    const transport = settings.transport || this.state.transport;

    if (this.tinode) {
      this.tinode.clearStorage();
      this.tinode.onDisconnect = undefined;
      this.tinode.disconnect();
    }

    this.tinode = TinodeWeb.tnSetup(serverAddress, transport, this.props.intl.locale, _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_14__.default.getObject('keep-logged-in'));
    this.tinode.onConnect = this.handleConnected;
    this.tinode.onDisconnect = this.handleDisconnect;
    this.tinode.onAutoreconnectIteration = this.handleAutoreconnectIteration;
    this.setState({
      serverAddress: serverAddress,
      transport: transport
    });
    _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_14__.default.setObject('settings', {
      serverAddress: serverAddress,
      transport: transport
    });
    _lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__.default.navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__.default.setUrlSidePanel(window.location.hash, ''));
  }

  handleShowArchive() {
    _lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__.default.navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__.default.setUrlSidePanel(window.location.hash, this.state.myUserId ? 'archive' : ''));
  }

  handleShowBlocked() {
    _lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__.default.navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__.default.setUrlSidePanel(window.location.hash, this.state.myUserId ? 'blocked' : ''));
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
          console.error("Failed to get notification permission.", err);
          this.handleError(err.message, 'err');
          this.setState({
            desktopAlerts: false,
            firebaseToken: null
          });
          _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_14__.default.updateObject('settings', {
            desktopAlerts: false
          });
        });
      } else {
        this.setState({
          desktopAlerts: true
        });

        if (_lib_local_storage_js__WEBPACK_IMPORTED_MODULE_14__.default.getObject('keep-logged-in')) {
          _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_14__.default.updateObject('settings', {
            desktopAlerts: true
          });
        }
      }
    } else if (this.state.firebaseToken && this.fbPush) {
      this.fbPush.deleteToken(this.state.firebaseToken).catch(err => {
        console.error("Unable to delete token.", err);
      }).finally(() => {
        _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_14__.default.updateObject('settings', {
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
      _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_14__.default.updateObject('settings', {
        desktopAlerts: false
      });
    }
  }

  requestPushToken() {
    this.fbPush.getToken().then(refreshedToken => {
      const persist = _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_14__.default.getObject('keep-logged-in');

      if (refreshedToken != this.state.firebaseToken) {
        this.tinode.setDeviceToken(refreshedToken);

        if (persist) {
          _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_14__.default.setObject('firebase-token', refreshedToken);
        }
      }

      this.setState({
        firebaseToken: refreshedToken,
        desktopAlerts: true
      });

      if (persist) {
        _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_14__.default.updateObject('settings', {
          desktopAlerts: true
        });
      }
    }).catch(err => {
      this.handleError(err.message, 'err');
      console.error("Failed to retrieve firebase token", err);
    });
  }

  handleToggleMessageSounds(enabled) {
    this.setState({
      messageSounds: enabled
    });
    _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_14__.default.updateObject('settings', {
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
    const parsed = _lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__.default.parseUrlHash(window.location.hash);
    let path = '';

    if (['security', 'support', 'general', 'notif'].includes(parsed.path[0])) {
      path = 'edit';
    } else if ('crop' == parsed.path[0]) {
      path = 'general';
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

    _lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__.default.navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__.default.composeUrlHash(parsed.path, parsed.params));
    this.setState({
      errorText: '',
      errorLevel: null
    });
  }

  basicNavigator(hash) {
    _lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__.default.navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__.default.setUrlSidePanel(window.location.hash, hash));
  }

  infoNavigator(hash) {
    _lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__.default.navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__.default.setUrlInfoPanel(window.location.hash, hash));
  }

  handleStartTopicRequest(topicName, pub, priv, tags, isChannel) {
    if (topicName && this.tinode.isTopicCached(topicName)) {
      this.handleTopicSelected(topicName);
      return;
    }

    const params = {};

    if (tinode_sdk__WEBPACK_IMPORTED_MODULE_4___default().isP2PTopicName(topicName)) {
      params.sub = {
        mode: _config_js__WEBPACK_IMPORTED_MODULE_10__.DEFAULT_P2P_ACCESS_MODE
      };
      params.desc = {
        defacs: {
          auth: _config_js__WEBPACK_IMPORTED_MODULE_10__.DEFAULT_P2P_ACCESS_MODE
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
        _lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__.default.navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__.default.setUrlTopic('', newName));
      });
    }
  }

  handleTopicUpdateRequest(topicName, pub, priv, defacs) {
    this.handleError();
    const topic = this.tinode.getTopic(topicName);

    if (topic) {
      const params = {};
      let attachments;

      if (pub) {
        if (pub.photo) {
          if (pub.photo.ref && pub.photo.ref != (tinode_sdk__WEBPACK_IMPORTED_MODULE_4___default().DEL_CHAR)) {
            attachments = [pub.photo.ref];
          } else if (!pub.photo.data || pub.photo.data == (tinode_sdk__WEBPACK_IMPORTED_MODULE_4___default().DEL_CHAR)) {
            pub.photo = (tinode_sdk__WEBPACK_IMPORTED_MODULE_4___default().DEL_CHAR);
          }
        }

        params.public = pub;
      }

      if (priv) {
        params.private = priv === (tinode_sdk__WEBPACK_IMPORTED_MODULE_4___default().DEL_CHAR) ? (tinode_sdk__WEBPACK_IMPORTED_MODULE_4___default().DEL_CHAR) : {
          comment: priv
        };
      }

      if (defacs) {
        params.defacs = defacs;
      }

      topic.setMeta({
        desc: params,
        attachments: attachments
      }).catch(err => {
        this.handleError(err.message, 'err');
      });
    }
  }

  handleUpdatePasswordRequest(password) {
    this.handleError();

    if (password) {
      this.tinode.updateAccountBasic(null, this.tinode.getCurrentLogin(), password).catch(err => {
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
    (0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_17__.updateFavicon)(0);
    localStorage.removeItem('auth-token');
    localStorage.removeItem('firebase-token');
    localStorage.removeItem('settings');

    if (this.state.firebaseToken) {
      this.fbPush.deleteToken(this.state.firebaseToken);
    }

    clearInterval(this.reconnectCountdown);

    if (this.tinode) {
      this.tinode.clearStorage();
      this.tinode.onDisconnect = undefined;
      this.tinode.disconnect();
    }

    this.setState(this.getBlankState());
    this.tinode = TinodeWeb.tnSetup(this.state.serverAddress, this.state.transport, this.props.intl.locale, _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_14__.default.getObject('keep-logged-in'));
    this.tinode.onConnect = this.handleConnected;
    this.tinode.onDisconnect = this.handleDisconnect;
    this.tinode.onAutoreconnectIteration = this.handleAutoreconnectIteration;
    _lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__.default.navigateTo('');
  }

  handleDeleteAccount() {
    this.tinode.delCurrentUser(true).then(ctrl => {
      this.handleLogout();
    });
  }

  handleDeleteTopicRequest(topicName) {
    const topic = this.tinode.getTopic(topicName);

    if (!topic) {
      return;
    }

    topic.delTopic(true).then(ctrl => {
      _lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__.default.navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__.default.setUrlTopic(window.location.hash, ''));
    }).catch(err => {
      this.handleError(err.message, 'err');
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
      _lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__.default.navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__.default.setUrlTopic(window.location.hash, ''));
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
      _lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__.default.navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__.default.setUrlTopic(window.location.hash, ''));
    }).catch(err => {
      this.handleError(err.message, 'err');
    });
  }

  handleReportTopic(topicName) {
    const topic = this.tinode.getTopic(topicName);

    if (!topic) {
      return;
    }

    this.tinode.publish((tinode_sdk__WEBPACK_IMPORTED_MODULE_4___default().TOPIC_SYS), tinode_sdk__WEBPACK_IMPORTED_MODULE_4___default().Drafty.attachJSON(null, {
      'action': 'report',
      'target': topicName
    }));
    topic.updateMode(null, '-JP').then(ctrl => {
      _lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__.default.navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__.default.setUrlTopic(window.location.hash, ''));
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
      contextMenuBounds: this.selfRef.current.getBoundingClientRect()
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
    } : null, subscribed ? 'messages_clear' : null, subscribed && deleter ? 'messages_clear_hard' : null, muted ? blocked ? null : 'topic_unmute' : 'topic_mute', self_blocked ? 'topic_unblock' : 'topic_block', !archived ? 'topic_restore' : 'topic_archive', 'topic_delete'];
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
    _lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__.default.navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__.default.addUrlParam(window.location.hash, 'info', 'info'));
    this.setState({
      infoPanel: 'info'
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
        _lib_navigation_js__WEBPACK_IMPORTED_MODULE_15__.default.navigateTo('');
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
    token = (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_12__.base64ReEncode)(token);

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
      id: "app-container",
      ref: this.selfRef
    }, this.state.contextMenuVisible ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_context_menu_jsx__WEBPACK_IMPORTED_MODULE_6__.default, {
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
    }) : null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_alert_jsx__WEBPACK_IMPORTED_MODULE_5__.default, {
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
    }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_sidepanel_view_jsx__WEBPACK_IMPORTED_MODULE_9__.default, {
      tinode: this.tinode,
      connected: this.state.connected,
      displayMobile: this.state.displayMobile,
      hideSelf: this.state.displayMobile && this.state.mobilePanel !== 'sidepanel',
      state: this.state.sidePanelSelected,
      title: this.state.sidePanelTitle,
      avatar: this.state.sidePanelAvatar,
      trustedBadges: this.state.myTrustedBadges,
      login: this.state.login,
      persist: this.state.persist,
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
      onNavigate: this.basicNavigator,
      onLoginRequest: this.handleLoginRequest,
      onPersistenceChange: this.handlePersistenceChange,
      onCreateAccount: this.handleNewAccountRequest,
      onUpdateAccountDesc: this.handleTopicUpdateRequest,
      onUpdatePassword: this.handleUpdatePasswordRequest,
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
    }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_messages_view_jsx__WEBPACK_IMPORTED_MODULE_8__.default, {
      tinode: this.tinode,
      connected: this.state.connected,
      ready: this.state.ready,
      online: this.state.topicSelectedOnline,
      acs: this.state.topicSelectedAcs,
      displayMobile: this.state.displayMobile,
      viewportWidth: this.state.viewportWidth,
      viewportHeight: this.state.viewportHeight,
      hideSelf: this.state.displayMobile && (this.state.mobilePanel !== 'topic-view' || this.state.infoPanel),
      topic: this.state.topicSelected,
      myUserId: this.state.myUserId,
      myUserName: this.state.sidePanelTitle,
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
    }), this.state.infoPanel ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_info_view_jsx__WEBPACK_IMPORTED_MODULE_7__.default, {
      tinode: this.tinode,
      connected: this.state.connected,
      displayMobile: this.state.displayMobile,
      topic: this.state.topicSelected,
      searchableContacts: this.state.searchableContacts,
      myUserId: this.state.myUserId,
      panel: this.state.infoPanel,
      errorText: this.state.errorText,
      errorLevel: this.state.errorLevel,
      errorAction: this.state.errorAction,
      errorActionText: this.state.errorActionText,
      onNavigate: this.infoNavigator,
      onTopicDescUpdate: this.handleTopicUpdateRequest,
      onShowAlert: this.handleShowAlert,
      onChangePermissions: this.handleChangePermissions,
      onMemberUpdateRequest: this.handleMemberUpdateRequest,
      onDeleteTopic: this.handleDeleteTopicRequest,
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
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(TinodeWeb));

/***/ }),

/***/ "./src/views/validation-view.jsx":
/*!***************************************!*\
  !*** ./src/views/validation-view.jsx ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
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
      className: "secondary",
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
      id: "button_confirm",
      defaultMessage: [{
        "type": 0,
        "value": "Confirm"
      }]
    }))));
  }

}

;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(ValidationView));

/***/ }),

/***/ "./src/widgets/alert.jsx":
/*!*******************************!*\
  !*** ./src/widgets/alert.jsx ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Alert)
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Attachment)
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

/***/ "./src/widgets/avatar-crop.jsx":
/*!*************************************!*\
  !*** ./src/widgets/avatar-crop.jsx ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AvatarCrop)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _cropper_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./cropper.jsx */ "./src/widgets/cropper.jsx");
/* harmony import */ var _lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/blob-helpers.js */ "./src/lib/blob-helpers.js");




class AvatarCrop extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
    this.state = {
      top: 0,
      left: 0,
      width: 0,
      height: 0,
      scale: 1
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(left, top, width, height, scale) {
    this.setState({
      left: left,
      top: top,
      width: width,
      height: height,
      scale: scale
    });
  }

  handleSubmit() {
    (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_3__.imageCrop)(this.props.mime, this.props.avatar, this.state.left, this.state.top, this.state.width, this.state.height, this.state.scale, (mime, blob, width, height) => {
      this.props.onSubmit(mime, blob, width, height);
    }, err => {
      this.props.onError(err);
    });
  }

  render() {
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_cropper_jsx__WEBPACK_IMPORTED_MODULE_2__.default, {
      source: this.props.avatar,
      onChange: this.handleChange
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "dialog-buttons"
    }, this.props.onCancel ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
      className: "secondary",
      onClick: this.props.onCancel
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "button_cancel",
      defaultMessage: [{
        "type": 0,
        "value": "Cancel"
      }]
    })) : null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
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

/***/ }),

/***/ "./src/widgets/avatar-upload.jsx":
/*!***************************************!*\
  !*** ./src/widgets/avatar-upload.jsx ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AvatarUpload)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _letter_tile_jsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./letter-tile.jsx */ "./src/widgets/letter-tile.jsx");
/* harmony import */ var _load_spinner_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./load-spinner.jsx */ "./src/widgets/load-spinner.jsx");
/* harmony import */ var _lib_utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/utils.js */ "./src/lib/utils.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../config.js */ "./src/config.js");





class AvatarUpload extends (react__WEBPACK_IMPORTED_MODULE_0___default().Component) {
  constructor(props) {
    super(props);
    this.state = {
      source: props.avatar
    };
    this.handleFileReceived = this.handleFileReceived.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.avatar != prevProps.avatar) {
      this.setState({
        source: this.props.avatar
      });
    }
  }

  handleFileReceived(e) {
    const image = e.target.files[0];
    this.props.onImageUpdated(image.type, URL.createObjectURL(image), image.name);
    e.target.value = '';
  }

  render() {
    const randId = 'file-input-avatar-' + (Math.random() + '').substr(2);
    const className = 'avatar-upload' + (this.props.readOnly ? ' read-only' : '');
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: className
    }, this.props.readOnly || !this.state.source ? null : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      className: "clear-avatar",
      onClick: e => {
        e.preventDefault();
        this.props.onImageUpdated();
      }
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "clear")), this.state.source ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("img", {
      src: this.props.tinode.authorizeURL((0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_3__.sanitizeImageUrl)(this.state.source)),
      className: "preview"
    }) : this.props.readOnly && this.props.uid ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "avatar-box"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_letter_tile_jsx__WEBPACK_IMPORTED_MODULE_1__.default, {
      tinode: this.props.tinode,
      avatar: true,
      topic: this.props.uid,
      title: this.props.title
    })) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "blank"
    }, _config_js__WEBPACK_IMPORTED_MODULE_4__.AVATAR_SIZE, "\xD7", _config_js__WEBPACK_IMPORTED_MODULE_4__.AVATAR_SIZE), this.props.readOnly ? null : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", {
      type: "file",
      id: randId,
      className: "inputfile hidden",
      accept: "image/*",
      onChange: this.handleFileReceived
    }), this.props.readOnly ? null : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      htmlFor: randId,
      className: "round"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "file_upload")), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_load_spinner_jsx__WEBPACK_IMPORTED_MODULE_2__.default, {
      show: this.props.uploading,
      large: true,
      clear: true,
      centered: true
    }));
  }

}
;

/***/ }),

/***/ "./src/widgets/badge-list.jsx":
/*!************************************!*\
  !*** ./src/widgets/badge-list.jsx ***!
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


const icon_mapping = {
  'staff': 'verified_user'
};
const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_1__.defineMessages)({
  badge_verified: {
    id: "badge_verified",
    defaultMessage: [{
      "type": 0,
      "value": "Verified/official"
    }]
  },
  badge_staff: {
    id: "badge_staff",
    defaultMessage: [{
      "type": 0,
      "value": "Staff-managed"
    }]
  },
  badge_danger: {
    id: "badge_danger",
    defaultMessage: [{
      "type": 0,
      "value": "Untrustworthy"
    }]
  }
});

class BadgeList extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  render() {
    const {
      formatMessage
    } = this.props.intl;
    let badges = null;

    if (this.props.trustedBadges && this.props.trustedBadges.length > 0) {
      badges = [];
      this.props.trustedBadges.map(b => {
        const comment = formatMessage(messages['badge_' + b]);
        const style = 'material-icons ' + b + '-color';
        badges.push(react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
          className: "trusted-badge",
          key: b
        }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
          className: style
        }, icon_mapping[b] || b), " ", comment));
      });
      return react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, badges);
    }

    return null;
  }

}

;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(BadgeList));

/***/ }),

/***/ "./src/widgets/button-back.jsx":
/*!*************************************!*\
  !*** ./src/widgets/button-back.jsx ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ButtonBack)
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
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









class ChatMessage extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
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
    this.handleQuoteClick = this.handleQuoteClick.bind(this);
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

    if (this.props.received >= Tinode.MESSAGE_STATUS_FAILED && this.props.received < Tinode.MESSAGE_STATUS_DEL_RANGE) {
      menuItems.push('menu_item_reply');
    }

    this.props.showContextMenu({
      seq: this.props.seq,
      content: this.props.content,
      y: e.pageY,
      x: e.pageX,
      pickReply: this.props.pickReply
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

  handleQuoteClick(e) {
    e.preventDefault();
    e.stopPropagation();
    const replyToSeq = this.props.replyToSeq;
    this.props.onQuoteClick(replyToSeq);
  }

  render() {
    const sideClass = this.props.deleted ? 'center' : this.props.sequence + ' ' + (this.props.response ? 'left' : 'right');
    const bubbleClass = this.props.sequence == 'single' || this.props.sequence == 'last' ? 'bubble tip' : 'bubble';
    const avatar = this.props.deleted ? null : this.props.userAvatar || true;
    const fullDisplay = this.props.userFrom && this.props.response && !this.props.deleted && (this.props.sequence == 'single' || this.props.sequence == 'last');
    const msgId = 'msg-' + this.props.seq;
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
      let qte = [];

      if (content.qte) {
        qte = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.format(content.qte, this.props.onFormatQuote, this);
        const lf = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.appendLineBreak(null);
        qte = qte.concat(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.format(lf, draftyFormatter, this, qte.length));
      }

      let tree = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.format(content, draftyFormatter, this, qte.length);
      tree = qte.concat(tree);
      content = react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, tree);
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
      id: msgId,
      className: sideClass
    }, this.props.userFrom && this.props.response ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "avatar-box"
    }, fullDisplay ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_letter_tile_jsx__WEBPACK_IMPORTED_MODULE_4__.default, {
      tinode: this.props.tinode,
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
              attr.loading = 'lazy';
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

      case 'QQ':
        attr.className = 'reply-quote';
        attr.onClick = this.handleQuoteClick;
        break;

      case 'QH':
        attr.className = 'reply-quote-header';
        break;

      case 'QB':
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
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(ChatMessage));

/***/ }),

/***/ "./src/widgets/checkbox.jsx":
/*!**********************************!*\
  !*** ./src/widgets/checkbox.jsx ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CheckBox)
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ChipInput)
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
        tinode: this.props.tinode,
        onCancel: this.handleChipCancel,
        avatar: (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_2__.makeImageUrl)(item.public ? item.public.photo : null),
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
    const autoFocus = !(this.props.tabIndex > 0);
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
      tabIndex: this.props.tabIndex,
      autoFocus: autoFocus
    }));
  }

}
;

/***/ }),

/***/ "./src/widgets/chip.jsx":
/*!******************************!*\
  !*** ./src/widgets/chip.jsx ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Chip)
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
      tinode: this.props.tinode,
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
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
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(ContactAction));

/***/ }),

/***/ "./src/widgets/contact-badges.jsx":
/*!****************************************!*\
  !*** ./src/widgets/contact-badges.jsx ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ContactBadges)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

const icon_mapping = {
  'muted': 'notifications_off',
  'banned': 'block',
  'staff': 'verified_user'
};
class ContactBadges extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  render() {
    let badges = null;

    if (this.props.badges && this.props.badges.length > 0) {
      badges = [];
      this.props.badges.map(b => {
        const color = b.color ? ' ' + b.color : '';

        if (b.icon) {
          badges.push(react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
            className: 'material-icons as-badge' + color,
            key: b.key || b.icon
          }, icon_mapping[b.icon] || b.icon));
        } else {
          badges.push(react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
            className: 'badge' + color,
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
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
            tinode: this.props.tinode,
            title: c.public ? c.public.fn : null,
            avatar: (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_5__.makeImageUrl)(c.public ? c.public.photo : null),
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
            isVerified: c.trusted && c.trusted.verified,
            isStaff: c.trusted && c.trusted.staff,
            isDangerous: c.trusted && c.trusted.danger,
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
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(ContactList));

/***/ }),

/***/ "./src/widgets/contact.jsx":
/*!*********************************!*\
  !*** ./src/widgets/contact.jsx ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
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

    if (this.props.isVerified) {
      icon_badges.push({
        icon: 'verified',
        color: 'verified-color'
      });
    }

    if (this.props.isStaff) {
      icon_badges.push({
        icon: 'staff',
        color: 'staff-color'
      });
    }

    if (this.props.isDangerous) {
      icon_badges.push({
        icon: 'dangerous',
        color: 'danger-color'
      });
    }

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
      tinode: this.props.tinode,
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
    }) : null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_contact_badges_jsx__WEBPACK_IMPORTED_MODULE_2__.default, {
      badges: icon_badges
    }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_unread_badge_jsx__WEBPACK_IMPORTED_MODULE_5__.default, {
      count: this.props.unread
    })), this.props.showMode ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_contact_badges_jsx__WEBPACK_IMPORTED_MODULE_2__.default, {
      badges: badges
    })) : this.props.small ? null : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
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
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(Contact));

/***/ }),

/***/ "./src/widgets/context-menu.jsx":
/*!**************************************!*\
  !*** ./src/widgets/context-menu.jsx ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../config.js */ "./src/config.js");



const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_1__.defineMessages)({
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
  reply: {
    id: "menu_item_reply",
    defaultMessage: [{
      "type": 0,
      "value": "Reply"
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
      "value": "Are you sure you want to delete this conversation? It cannot be undone."
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
  unarchive: {
    id: "menu_item_restore_topic",
    defaultMessage: [{
      "type": 0,
      "value": "Restore"
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
    this.selfRef = react__WEBPACK_IMPORTED_MODULE_0___default().createRef();
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
      'menu_item_reply': {
        id: 'menu_item_reply',
        title: formatMessage(messages.reply),
        handler: (params, errorHandler) => {
          return this.replyToMessage(params, errorHandler);
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
      'topic_restore': {
        id: 'topic_restore',
        title: formatMessage(messages.unarchive),
        handler: (params, errorHandler) => {
          const topic = this.props.tinode.getTopic(params.topicName);

          if (!topic) {
            console.log("Topic not found: ", params.topicName);
            return;
          }

          return topic.archive(false).catch(err => {
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
    if (this.selfRef.current.contains(e.target)) {
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

  replyToMessage(params, errorHandler) {
    console.log("Reply to message", params);
    params.pickReply({
      seq: params.seq,
      content: params.content
    });
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
    const hSize = 12 * _config_js__WEBPACK_IMPORTED_MODULE_2__.REM_SIZE;
    const vSize = _config_js__WEBPACK_IMPORTED_MODULE_2__.REM_SIZE * (0.7 + menu.length * 2.5);
    const left = this.props.bounds.right - this.props.clickAt.x < hSize ? this.props.clickAt.x - this.props.bounds.left - hSize : this.props.clickAt.x - this.props.bounds.left;
    const top = this.props.bounds.bottom - this.props.clickAt.y < vSize ? this.props.clickAt.y - this.props.bounds.top - vSize : this.props.clickAt.y - this.props.bounds.top;
    const position = {
      left: left + 'px',
      top: top + 'px'
    };
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("ul", {
      className: "menu",
      style: position,
      ref: this.selfRef
    }, menu);
  }

}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(ContextMenu));

/***/ }),

/***/ "./src/widgets/cropper.jsx":
/*!*********************************!*\
  !*** ./src/widgets/cropper.jsx ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Cropper)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

const DEFAULT_MAX_ZOOM = 2.5;
class Cropper extends (react__WEBPACK_IMPORTED_MODULE_0___default().Component) {
  constructor(props) {
    super(props);
    this.state = {
      panX: 0,
      panY: 0,
      originX: 0,
      originY: 0,
      zoom: 1,
      minZoom: 0,
      maxZoom: DEFAULT_MAX_ZOOM
    };
    this.overlay = react__WEBPACK_IMPORTED_MODULE_0___default().createRef();
    this.cutout = react__WEBPACK_IMPORTED_MODULE_0___default().createRef();
    this.preview = react__WEBPACK_IMPORTED_MODULE_0___default().createRef();
    this.boundingBox = react__WEBPACK_IMPORTED_MODULE_0___default().createRef();
    this.imageWidth = 0;
    this.imageHeight = 0;
    this.mouseX = 0;
    this.mouseY = 0;
    this.prevDistance = 0;
    this.cutoutRect = {};
    this.bBoxRect = {};
    this.originX = 0;
    this.originY = 0;
    this.initScaling = this.initScaling.bind(this);
    this.onZoom = this.onZoom.bind(this);
    this.handleZoom = this.handleZoom.bind(this);
    this.mouseDown = this.mouseDown.bind(this);
    this.mouseUp = this.mouseUp.bind(this);
    this.mouseMove = this.mouseMove.bind(this);
    this.mouseTouch = this.mouseTouch.bind(this);
    this.positionAll = this.positionAll.bind(this);
    this.translate = this.translate.bind(this);
  }

  componentDidMount() {
    this.overlay.current.addEventListener('mousedown', this.mouseDown, {
      passive: true
    });
    this.overlay.current.addEventListener('touchstart', this.mouseDown, {
      passive: true
    });
    this.bBoxRect = this.boundingBox.current.getBoundingClientRect();
    this.originX = this.bBoxRect.width / 2;
    this.originY = this.bBoxRect.height / 2;
    this.cutoutRect = this.cutout.current.getBoundingClientRect();
  }

  componentWillUnmount() {
    this.overlay.current.removeEventListener('mousedown', this.mouseDown);
    this.overlay.current.removeEventListener('touchstart', this.mouseDown);
  }

  positionAll(panX, panY, zoom) {
    this.setState({
      panX: panX,
      panY: panY,
      zoom: zoom,
      originX: this.originX - panX,
      originY: this.originY - panY
    });
    const left = (this.originX - panX) * zoom - this.originX;
    const top = (this.originY - panY) * zoom - this.originY;
    this.props.onChange((left + this.cutoutRect.left - this.bBoxRect.left) / zoom, (top + this.cutoutRect.top - this.bBoxRect.top) / zoom, this.cutoutRect.width / zoom, this.cutoutRect.height / zoom, zoom);
  }

  static checkBound(currPan, img, cutout, delta) {
    let nextDiff = Math.min(0, cutout[0] - img[0] - delta, img[1] - cutout[1] + delta);

    if (nextDiff == 0) {
      currPan += delta;
    } else if (Math.min(0, cutout[0] - img[0], img[1] - cutout[1]) < nextDiff) {
      currPan += delta;
    }

    return currPan;
  }

  initScaling() {
    const imgRect = this.preview.current.getBoundingClientRect();
    this.imageWidth = imgRect.width;
    this.imageHeight = imgRect.height;
    const minZoom = Math.max(this.cutoutRect.width / imgRect.width, this.cutoutRect.height / imgRect.height);
    this.setState({
      minZoom: minZoom,
      maxZoom: Math.max(DEFAULT_MAX_ZOOM, minZoom + 1)
    });
    const zoom = Math.max(this.bBoxRect.width / imgRect.width, this.bBoxRect.height / imgRect.height);
    const panX = this.cutoutRect.left - this.bBoxRect.left - (imgRect.width - this.cutoutRect.width) / 2;
    const panY = this.cutoutRect.top - this.bBoxRect.top - (imgRect.height - this.cutoutRect.height) / 2;
    this.positionAll(panX, panY, zoom);
  }

  onZoom(e) {
    this.handleZoom(e.target.value);
  }

  handleZoom(zoom) {
    let panX = this.state.panX;
    let panY = this.state.panY;
    const imgLeft = this.originX - (this.originX - panX) * zoom;
    const imgRight = imgLeft + this.imageWidth * zoom;
    const coLeft = this.cutoutRect.left - this.bBoxRect.left;
    const coRight = coLeft + this.cutoutRect.width;

    if (coLeft < imgLeft) {
      panX -= imgLeft - coLeft;
    } else if (coRight > imgRight) {
      panX += coRight - imgRight;
    }

    const imgTop = this.originY - (this.originY - panY) * zoom;
    const imgBottom = imgTop + this.imageHeight * zoom;
    const coTop = this.cutoutRect.top - this.bBoxRect.top;
    const coBottom = coTop + this.cutoutRect.height;

    if (coTop < imgTop) {
      panY -= imgTop - coTop;
    } else if (coBottom > imgBottom) {
      panY += coBottom - imgBottom;
    }

    this.positionAll(panX, panY, zoom);
  }

  mouseDown(e) {
    if (e.touches) {
      this.mouseX = e.touches[0].pageX;
      this.mouseY = e.touches[0].pageY;
    } else {
      this.mouseX = e.pageX;
      this.mouseY = e.pageY;
    }

    window.addEventListener('mousemove', this.mouseMove, {
      passive: false
    });
    window.addEventListener('touchmove', this.mouseTouch, {
      passive: false
    });
    window.addEventListener('mouseup', this.mouseUp, {
      passive: true
    });
    window.addEventListener('touchend', this.mouseUp, {
      passive: true
    });
    document.body.style['userSelect'] = 'none';
  }

  translate(pageX, pageY) {
    const dX = pageX - this.mouseX;
    const dY = pageY - this.mouseY;
    this.mouseX = pageX;
    this.mouseY = pageY;
    const imgRect = this.preview.current.getBoundingClientRect();
    let panX = Cropper.checkBound(this.state.panX, [imgRect.left, imgRect.right], [this.cutoutRect.left, this.cutoutRect.right], dX);
    let panY = Cropper.checkBound(this.state.panY, [imgRect.top, imgRect.bottom], [this.cutoutRect.top, this.cutoutRect.bottom], dY);
    this.positionAll(panX, panY, this.state.zoom);
  }

  mouseMove(e) {
    e.preventDefault();
    this.translate(e.pageX, e.pageY);
  }

  mouseTouch(e) {
    e.preventDefault();

    if (e.touches.length == 1) {
      this.translate(e.touches[0].pageX, e.touches[0].pageY);
      return;
    }

    const [touch0, touch1] = e.touches;
    const distance = Math.sqrt((touch0.pageX - touch1.pageX) * (touch0.pageX - touch1.pageX) + (touch0.pageY - touch1.pageY) * (touch0.pageY - touch1.pageY));

    if (!this.prevDistance) {
      this.prevDistance = distance / this.state.zoom;
    }

    let scale = distance / this.prevDistance;
    this.handleZoom(Math.max(this.minZoom, Math.min(this.maxZoom, scale)));
  }

  mouseUp(e) {
    window.removeEventListener('mousemove', this.mouseMove);
    window.removeEventListener('touchmove', this.mouseTouch);
    window.removeEventListener('mouseup', this.mouseUp);
    window.removeEventListener('touchend', this.mouseUp);
    document.body.style['userSelect'] = '';
    this.positionAll(this.state.panX, this.state.panY, this.state.zoom);
  }

  render() {
    const t3d = `translate3d(${this.state.panX}px, ${this.state.panY}px, 0) scale(${this.state.zoom})`;
    const orig = `${this.state.originX}px ${this.state.originY}px`;
    const overlay = {
      top: `${this.originY - this.state.originY * this.state.zoom}px`,
      left: `${this.originX - this.state.originX * this.state.zoom}px`,
      width: `${this.imageWidth * this.state.zoom}px`,
      height: `${this.imageHeight * this.state.zoom}px`
    };
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "cropper"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "bounding-box",
      ref: this.boundingBox
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("img", {
      src: this.props.source,
      className: "preview",
      alt: "",
      style: {
        transform: t3d,
        transformOrigin: orig
      },
      ref: this.preview,
      onLoad: this.initScaling
    }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "cutout circle",
      ref: this.cutout
    }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "overlay",
      style: overlay,
      ref: this.overlay
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "zoom-wrapper"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", {
      type: "range",
      className: "zoomer",
      step: "0.001",
      min: this.state.minZoom,
      max: this.state.maxZoom,
      value: this.state.zoom,
      onChange: this.onZoom
    })));
  }

}

/***/ }),

/***/ "./src/widgets/doc-preview.jsx":
/*!*************************************!*\
  !*** ./src/widgets/doc-preview.jsx ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DocPreview)
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ErrorPanel)
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ FileProgress)
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
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
      tinode: this.props.tinode,
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
      tinode: this.props.tinode,
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
      className: "secondary",
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
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(GroupManager));

/***/ }),

/***/ "./src/widgets/group-subs.jsx":
/*!************************************!*\
  !*** ./src/widgets/group-subs.jsx ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ GroupSubs)
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
        tinode: this.props.tinode,
        topic: sub.user,
        avatar: (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_4__.makeImageUrl)(sub.public ? sub.public.photo : null) || true,
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ HostSelector)
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ImagePreview)
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ InPlaceEdit)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _visible_password_jsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./visible-password.jsx */ "./src/widgets/visible-password.jsx");


class InPlaceEdit extends (react__WEBPACK_IMPORTED_MODULE_0___default().Component) {
  constructor(props) {
    super(props);
    this.selfRef = react__WEBPACK_IMPORTED_MODULE_0___default().createRef();
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
      this.setState({
        active: true
      }, () => {
        if (this.selfRef.current) {
          this.selfRef.current.focus();
        }
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
    const value = this.state.value.trim();

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
    if (!this.state.active) {
      let spanText = this.props.type == 'password' ? '••••••••' : this.state.value;
      let spanClass = 'in-place-edit' + (this.props.readOnly ? ' disabled' : '');

      if (!spanText) {
        spanText = this.props.placeholder;
        spanClass += ' placeholder';
      }

      if (!this.props.multiline || this.props.multiline == 1) {
        spanClass += ' short';
      }

      return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
        className: spanClass,
        onClick: this.handleStartEditing
      }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, spanText));
    }

    let element;
    const attr = {};

    if (this.props.type == 'password') {
      element = _visible_password_jsx__WEBPACK_IMPORTED_MODULE_1__.default;
      attr.onFinished = this.handlePasswordFinished;
    } else {
      if (this.props.multiline > 1) {
        element = 'textarea';
        attr.rows = this.props.multiline;
        attr.className = 'inplace-edit';
      } else {
        element = 'input';
        attr.type = this.props.type || 'text';
      }

      attr.value = this.state.value;
      attr.onChange = this.handeTextChange;
      attr.onKeyDown = this.handleKeyDown;
      attr.onBlur = this.handleEditingFinished;
    }

    attr.placeholder = this.props.placeholder;
    attr.required = this.props.required ? 'required' : '';
    attr.autoComplete = this.props.autoComplete;
    attr.autoFocus = true;
    attr.ref = this.selfRef;
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement(element, attr, null);
  }

}
;

/***/ }),

/***/ "./src/widgets/invitation.jsx":
/*!************************************!*\
  !*** ./src/widgets/invitation.jsx ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Invitation)
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LetterTile)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tinode-sdk */ "tinode-sdk");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _lib_strformat_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/strformat.js */ "./src/lib/strformat.js");
/* harmony import */ var _lib_utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/utils.js */ "./src/lib/utils.js");




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
      const url = this.props.tinode.authorizeURL((0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_3__.sanitizeImageUrl)(this.props.avatar));
      avatar = react__WEBPACK_IMPORTED_MODULE_0___default().createElement("img", {
        className: "avatar",
        alt: "avatar",
        src: url,
        onError: e => {
          e.target.onerror = null;
          e.target.src = "../img/broken_image.png";
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LoadSpinner)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

class LoadSpinner extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  render() {
    const className = 'load-spinner-box' + (this.props.large ? ' large' : '') + (this.props.clear ? ' clear' : '') + (this.props.centered ? ' centered' : '');
    return this.props.show ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: className
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MenuCancel)
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MenuContacts)
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MenuStart)
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

/***/ "./src/widgets/new-topic-by-id.jsx":
/*!*****************************************!*\
  !*** ./src/widgets/new-topic-by-id.jsx ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
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
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(NewTopicById));

/***/ }),

/***/ "./src/widgets/new-topic-group.jsx":
/*!*****************************************!*\
  !*** ./src/widgets/new-topic-group.jsx ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ NewTopicGroup)
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
    this.fullName = react__WEBPACK_IMPORTED_MODULE_0___default().createRef();
    this.state = {
      fullName: '',
      private: '',
      description: '',
      imageDataUrl: null,
      tags: [],
      isChannel: false
    };
    this.handleFieldEdit = this.handleFieldEdit.bind(this);
    this.handleImageChanged = this.handleImageChanged.bind(this);
    this.handleTagsChanged = this.handleTagsChanged.bind(this);
    this.handleChannelToggle = this.handleChannelToggle.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {}

  handleFieldEdit(name, e) {
    this.setState({
      [name]: e.target.value
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
    const fn = this.state.fullName.trim().substring(0, _config_js__WEBPACK_IMPORTED_MODULE_5__.MAX_TITLE_LENGTH);
    const comment = this.state.private.trim().substring(0, _config_js__WEBPACK_IMPORTED_MODULE_5__.MAX_TITLE_LENGTH);
    const description = this.state.description.trim().substring(0, _config_js__WEBPACK_IMPORTED_MODULE_5__.MAX_TOPIC_DESCRIPTION_LENGTH);

    if (fn) {
      this.props.onSubmit(fn, description, this.state.imageDataUrl, comment, this.state.tags, this.state.isChannel);
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
      className: "panel-form-column"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("center", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_avatar_upload_jsx__WEBPACK_IMPORTED_MODULE_2__.default, {
      tinode: this.props.tinode,
      onError: this.props.onError,
      onImageChanged: this.handleImageChanged
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "group"
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
      ref: this.fullName,
      value: this.state.fullName,
      onChange: this.handleFieldEdit.bind('fullName'),
      autoFocus: true,
      required: true,
      tabIndex: 0
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "group"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
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
      onChange: this.handleFieldEdit.bind('private'),
      tabIndex: 1
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "group"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      className: "small",
      htmlFor: "new-topic-desc"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_description",
      defaultMessage: [{
        "type": 0,
        "value": "Description"
      }]
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "description_editing_placeholder",
      defaultMessage: [{
        "type": 0,
        "value": "Description (optional)"
      }]
    }, placeholder => react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", {
      type: "text",
      id: "new-topic-desc",
      placeholder: placeholder,
      value: this.state.description,
      onChange: this.handleFieldEdit.bind('description'),
      tabIndex: 2
    })))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_checkbox_jsx__WEBPACK_IMPORTED_MODULE_3__.default, {
      checked: this.state.isChannel,
      tabIndex: 3,
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
        "value": "Tags (search & discovery)"
      }]
    }, title => react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_tag_manager_jsx__WEBPACK_IMPORTED_MODULE_4__.default, {
      tinode: this.props.tinode,
      tags: this.state.tags,
      activated: true,
      onTagsChanged: this.handleTagsChanged,
      tabIndex: 4,
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
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
      className: "contact-box small"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_contact_jsx__WEBPACK_IMPORTED_MODULE_3__.default, {
      tinode: this.props.tinode,
      item: this.props.item,
      title: this.props.userTitle,
      small: true,
      avatar: (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_4__.makeImageUrl)(this.props.userAvatar ? this.props.userAvatar : null)
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
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(PermissionsEditor));

/***/ }),

/***/ "./src/widgets/received-marker.jsx":
/*!*****************************************!*\
  !*** ./src/widgets/received-marker.jsx ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
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
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(ReceivedMarker));

/***/ }),

/***/ "./src/widgets/search-contacts.jsx":
/*!*****************************************!*\
  !*** ./src/widgets/search-contacts.jsx ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SearchContacts)
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
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
    this.handleQuoteClick = this.handleQuoteClick.bind(this);
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

  handleQuoteClick(e) {
    e.preventDefault();
    e.stopPropagation();

    if (this.props.replyTo) {
      const replyToSeq = this.props.replyTo.seq;
      this.props.onQuoteClick(replyToSeq);
    }
  }

  render() {
    const {
      formatMessage
    } = this.props.intl;
    const prompt = this.props.disabled ? formatMessage(messages.messaging_disabled) : this.props.messagePrompt ? formatMessage(messages[this.props.messagePrompt]) : formatMessage(messages.type_new_message);
    let quote = null;

    if (this.props.replyTo) {
      quote = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.format(this.props.replyTo.content, this.props.onFormatQuote, this);
    }

    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "send-message-wrapper"
    }, quote ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "reply-quote-preview"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      onClick: e => {
        e.preventDefault();
        this.props.onCancelReply();
      }
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons gray"
    }, "close")), quote) : null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
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
    }, prompt)));
  }

}

;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(SendMessage));

/***/ }),

/***/ "./src/widgets/side-navbar.jsx":
/*!*************************************!*\
  !*** ./src/widgets/side-navbar.jsx ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SideNavbar)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _letter_tile_jsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./letter-tile.jsx */ "./src/widgets/letter-tile.jsx");
/* harmony import */ var _button_back_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./button-back.jsx */ "./src/widgets/button-back.jsx");
/* harmony import */ var _contact_badges_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./contact-badges.jsx */ "./src/widgets/contact-badges.jsx");
/* harmony import */ var _menu_contacts_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./menu-contacts.jsx */ "./src/widgets/menu-contacts.jsx");
/* harmony import */ var _menu_start_jsx__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./menu-start.jsx */ "./src/widgets/menu-start.jsx");
/* harmony import */ var _lib_utils_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../lib/utils.js */ "./src/lib/utils.js");







class SideNavbar extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  render() {
    const icon_badges = [];

    if (this.props.trustedBadges) {
      this.props.trustedBadges.map(b => {
        icon_badges.push({
          icon: b,
          color: 'badge-inv'
        });
      });
    }

    let avatar = null;

    if (this.props.tinode) {
      avatar = this.props.tinode.authorizeURL((0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_6__.sanitizeImageUrl)(this.props.avatar));
    }

    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "side-caption-panel",
      className: "caption-panel"
    }, this.props.onCancel ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_button_back_jsx__WEBPACK_IMPORTED_MODULE_2__.default, {
      onBack: this.props.onCancel
    }) : null, avatar ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "self-avatar",
      className: "avatar-box"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_letter_tile_jsx__WEBPACK_IMPORTED_MODULE_1__.default, {
      tinode: this.props.tinode,
      avatar: avatar,
      topic: this.props.myUserId,
      title: this.props.title
    })) : null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "sidepanel-title",
      className: "panel-title"
    }, this.props.title, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_contact_badges_jsx__WEBPACK_IMPORTED_MODULE_3__.default, {
      badges: icon_badges
    })), this.props.state === 'login' ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_menu_start_jsx__WEBPACK_IMPORTED_MODULE_5__.default, {
      onSignUp: this.props.onSignUp,
      onSettings: this.props.onSettings
    }) : this.props.state === 'contacts' ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_menu_contacts_jsx__WEBPACK_IMPORTED_MODULE_4__.default, {
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TagManager)
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
      tags: this.props.tags || [],
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
    const tags = nextProps.tags || [];

    if (!(0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_4__.arrayEqual)(tags, prevState.tags) && !prevState.activated) {
      return {
        tags: tags
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
      tags: this.props.tags || []
    });
  }

  handleCancel() {
    this.setState({
      activated: false,
      tagInput: '',
      tags: this.props.tags || []
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
      tinode: this.props.tinode,
      chips: tags,
      avatarDisabled: true,
      prompt: add_tags_prompt,
      tabIndex: this.props.tabIndex,
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

/***/ "./src/widgets/topic-common.jsx":
/*!**************************************!*\
  !*** ./src/widgets/topic-common.jsx ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TopicCommon)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _widgets_avatar_upload_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../widgets/avatar-upload.jsx */ "./src/widgets/avatar-upload.jsx");
/* harmony import */ var _widgets_topic_desc_edit_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../widgets/topic-desc-edit.jsx */ "./src/widgets/topic-desc-edit.jsx");
/* harmony import */ var _lib_utils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../lib/utils.js */ "./src/lib/utils.js");





class TopicCommon extends (react__WEBPACK_IMPORTED_MODULE_0___default().Component) {
  constructor(props) {
    super(props);
    const topic = this.props.tinode.getTopic(this.props.topic);
    const acs = topic.getAccessMode();
    this.state = {
      isMe: this.props.topic == 'me',
      owner: acs && acs.isOwner(),
      credentials: (topic.getCredentials ? topic.getCredentials() : null) || [],
      addCredActive: false,
      addCredInvalid: false,
      newCred: '',
      tags: [],
      previousTagsUpdated: undefined
    };
    this.onTagsUpdated = this.onTagsUpdated.bind(this);
    this.handleTagsUpdated = this.handleTagsUpdated.bind(this);
    this.tnCredsUpdated = this.tnCredsUpdated.bind(this);
    this.handleCredChange = this.handleCredChange.bind(this);
    this.handleCredKeyDown = this.handleCredKeyDown.bind(this);
    this.handleCredEntered = this.handleCredEntered.bind(this);
  }

  componentDidUpdate(props) {
    const topic = this.props.tinode.getTopic(props.topic);

    if (!topic) {
      return;
    }

    topic.onCredsUpdated = this.tnCredsUpdated;

    if (topic.onTagsUpdated != this.onTagsUpdated) {
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
    }
  }

  componentWillUnmount() {
    const topic = this.props.tinode.getTopic(this.props.topic);
    topic.onCredsUpdated = undefined;
    topic.onTagsUpdated = this.previousTagsUpdated;
  }

  tnCredsUpdated(creds) {
    this.setState({
      credentials: creds || []
    });
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
    const value = this.state.newCred.trim();

    if (!value) {
      this.setState({
        addCredActive: false,
        addCredInvalid: false
      });
      return;
    }

    let val = (0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_4__.asPhone)(value);
    let method;

    if (val) {
      method = 'tel';
    } else {
      val = (0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_4__.asEmail)(value);

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

  onTagsUpdated(tags) {
    this.setState({
      tags: tags
    });

    if (this.previousTagsUpdated && this.previousTagsUpdated != this.onTagsUpdated) {
      this.previousTagsUpdated();
    }
  }

  handleTagsUpdated(tags) {
    if (!(0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_4__.arrayEqual)(this.state.tags.slice(0), tags.slice(0))) {
      this.props.onTopicTagsUpdate(this.props.topic, tags);
    }
  }

  render() {
    const credentials = [];

    if (this.state.isMe) {
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
    }

    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "scrollable-panel"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_topic_desc_edit_jsx__WEBPACK_IMPORTED_MODULE_3__.default, {
      tinode: this.props.tinode,
      topic: this.props.topic,
      onUpdateTopicDesc: this.props.onUpdateTopicDesc,
      onUpdateTags: this.props.onUpdateTags,
      onError: this.props.onError
    }), this.state.isMe ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
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
    })))))) : null);
  }

}
;

/***/ }),

/***/ "./src/widgets/topic-desc-edit.jsx":
/*!*****************************************!*\
  !*** ./src/widgets/topic-desc-edit.jsx ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TopicDescEdit)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tinode-sdk */ "tinode-sdk");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _avatar_crop_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./avatar-crop.jsx */ "./src/widgets/avatar-crop.jsx");
/* harmony import */ var _avatar_upload_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./avatar-upload.jsx */ "./src/widgets/avatar-upload.jsx");
/* harmony import */ var _in_place_edit_jsx__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./in-place-edit.jsx */ "./src/widgets/in-place-edit.jsx");
/* harmony import */ var _tag_manager_jsx__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./tag-manager.jsx */ "./src/widgets/tag-manager.jsx");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var _lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../lib/blob-helpers.js */ "./src/lib/blob-helpers.js");
/* harmony import */ var _lib_utils_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../lib/utils.js */ "./src/lib/utils.js");










class TopicDescEdit extends (react__WEBPACK_IMPORTED_MODULE_0___default().Component) {
  constructor(props) {
    super(props);
    const topic = this.props.tinode.getTopic(this.props.topic);
    const acs = topic.getAccessMode();
    this.state = {
      isMe: tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default().isMeTopicName(this.props.topic),
      owner: acs && acs.isOwner(),
      fullName: topic.public ? topic.public.fn : undefined,
      private: topic.private ? topic.private.comment : null,
      description: topic.public ? topic.public.note : undefined,
      avatar: (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_8__.makeImageUrl)(topic.public ? topic.public.photo : null),
      tags: topic.tags(),
      newAvatar: null,
      newAvatarMime: null,
      previousOnTags: topic.onTagsUpdated
    };
    this.tnNewTags = this.tnNewTags.bind(this);
    this.handleFullNameUpdate = this.handleFullNameUpdate.bind(this);
    this.handleImageUpdated = this.handleImageUpdated.bind(this);
    this.handleAvatarCropped = this.handleAvatarCropped.bind(this);
    this.handlePrivateUpdate = this.handlePrivateUpdate.bind(this);
    this.handleDescriptionUpdate = this.handleDescriptionUpdate.bind(this);
    this.uploadAvatar = this.uploadAvatar.bind(this);
    this.handleAvatarCropCancel = this.handleAvatarCropCancel.bind(this);
    this.handleTagsUpdated = this.handleTagsUpdated.bind(this);
  }

  componentDidMount() {
    const topic = this.props.tinode.getTopic(this.props.topic);
    topic.onTagsUpdated = this.tnNewTags;
  }

  componentWillUnmount() {
    const topic = this.props.tinode.getTopic(this.props.topic);
    topic.onTagsUpdated = this.state.previousOnTags;
  }

  tnNewTags(tags) {
    this.setState({
      tags: tags
    });
  }

  handleFullNameUpdate(fn) {
    fn = fn.trim().substring(0, _config_js__WEBPACK_IMPORTED_MODULE_7__.MAX_TITLE_LENGTH);

    if (fn && this.state.fullName !== fn) {
      this.setState({
        fullName: fn
      });
      this.props.onUpdateTopicDesc(this.props.topic, (0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_9__.theCard)(fn, null));
    }
  }

  handlePrivateUpdate(comment) {
    comment = comment.trim().substring(0, _config_js__WEBPACK_IMPORTED_MODULE_7__.MAX_TITLE_LENGTH);

    if (this.state.private !== comment) {
      this.setState({
        private: comment
      });
      this.props.onUpdateTopicDesc(this.props.topic, null, comment || (tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default().DEL_CHAR));
    }
  }

  handleDescriptionUpdate(desc) {
    desc = desc.trim().substring(0, _config_js__WEBPACK_IMPORTED_MODULE_7__.MAX_TOPIC_DESCRIPTION_LENGTH);

    if (desc) {
      this.setState({
        description: desc
      });
      this.props.onUpdateTopicDesc(this.props.topic, (0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_9__.theCard)(null, null, null, desc));
    }
  }

  handleImageUpdated(mime, img) {
    this.setState({
      newAvatar: img,
      newAvatarMime: mime
    });

    if (!img) {
      this.props.onUpdateTopicDesc(this.props.topic, (0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_9__.theCard)(null, (tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default().DEL_CHAR)));
    }
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

  uploadAvatar(mime, blob, width, height) {
    const readyToUpload = (mime, blob, width, height) => {
      if (blob.size > _config_js__WEBPACK_IMPORTED_MODULE_7__.MAX_AVATAR_BYTES) {
        const uploader = this.props.tinode.getLargeFileHelper();
        this.setState({
          uploading: true
        });
        uploader.upload(blob).then(url => {
          this.props.onUpdateTopicDesc(this.props.topic, (0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_9__.theCard)(null, url));
        }).catch(err => {
          this.props.onError(err, 'err');
        }).finally(() => {
          this.setState({
            uploading: false
          });
        });
      } else {
        this.setState({
          uploading: true
        });
        (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_8__.blobToBase64)(blob, (unused, base64bits) => {
          const du = (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_8__.makeImageUrl)({
            data: base64bits,
            type: mime
          });
          this.setState({
            source: du
          });
          this.props.onUpdateTopicDesc(this.props.topic, (0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_9__.theCard)(null, du));
          this.setState({
            uploading: false
          });
        });
      }
    };

    if (width > _config_js__WEBPACK_IMPORTED_MODULE_7__.AVATAR_SIZE || height > _config_js__WEBPACK_IMPORTED_MODULE_7__.AVATAR_SIZE || width != height) {
      (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_8__.imageScaled)(blob, _config_js__WEBPACK_IMPORTED_MODULE_7__.AVATAR_SIZE, _config_js__WEBPACK_IMPORTED_MODULE_7__.AVATAR_SIZE, _config_js__WEBPACK_IMPORTED_MODULE_7__.MAX_EXTERN_ATTACHMENT_SIZE, true, readyToUpload, err => {
        this.props.onError(err, 'err');
      });
    } else {
      readyToUpload(mime, blob, width, height);
    }
  }

  handleAvatarCropCancel(img) {
    this.setState({
      newAvatar: null,
      newAvatarMime: null
    });
  }

  handleTagsUpdated(tags) {
    if ((0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_9__.arrayEqual)(this.state.tags.slice(0), tags.slice(0))) {
      return;
    }

    this.props.onUpdateTags(tags);
  }

  render() {
    if (this.state.newAvatar) {
      return react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_avatar_crop_jsx__WEBPACK_IMPORTED_MODULE_3__.default, {
        avatar: this.state.newAvatar,
        mime: this.state.newAvatarMime,
        onSubmit: this.handleAvatarCropped,
        onCancel: this.handleAvatarCropCancel,
        onError: this.props.onError
      });
    }

    const editable = this.state.isMe || this.state.owner;
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-column"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("center", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_avatar_upload_jsx__WEBPACK_IMPORTED_MODULE_4__.default, {
      tinode: this.props.tinode,
      avatar: this.state.avatar,
      readOnly: !editable,
      uid: this.props.topic,
      title: this.state.fullName,
      onImageUpdated: this.handleImageUpdated,
      onError: this.props.onError
    })), this.state.isMe ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "group"
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
    }, full_name_placeholder => react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_in_place_edit_jsx__WEBPACK_IMPORTED_MODULE_5__.default, {
      placeholder: full_name_placeholder,
      value: this.state.fullName,
      required: true,
      onFinished: this.handleFullNameUpdate
    })))) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "group"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      className: "small"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_topic_name",
      defaultMessage: [{
        "type": 0,
        "value": "Name"
      }]
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_in_place_edit_jsx__WEBPACK_IMPORTED_MODULE_5__.default, {
      placeholder: this.state.groupTopic ? "Group name" : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", null, "Unknown"),
      readOnly: !editable,
      value: this.state.fullName,
      required: true,
      onFinished: this.handleFullNameUpdate
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "group"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
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
    }, private_placeholder => react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_in_place_edit_jsx__WEBPACK_IMPORTED_MODULE_5__.default, {
      placeholder: private_placeholder,
      value: this.state.private,
      onFinished: this.handlePrivateUpdate
    }))))), editable || this.state.description ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "group"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      className: "small"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_description",
      defaultMessage: [{
        "type": 0,
        "value": "Description"
      }]
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "description_editing_placeholder",
      defaultMessage: [{
        "type": 0,
        "value": "Description (optional)"
      }]
    }, private_placeholder => react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_in_place_edit_jsx__WEBPACK_IMPORTED_MODULE_5__.default, {
      placeholder: private_placeholder,
      readOnly: !editable,
      value: this.state.description,
      multiline: 2,
      onFinished: this.handleDescriptionUpdate
    })))) : null), editable ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "hr"
    }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "title_tag_manager",
      defaultMessage: [{
        "type": 0,
        "value": "Tags (search & discovery)"
      }]
    }, title_tag_manager => react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_tag_manager_jsx__WEBPACK_IMPORTED_MODULE_6__.default, {
      tinode: this.props.tinode,
      title: title_tag_manager,
      activated: false,
      tags: this.state.tags,
      onSubmit: this.handleTagsUpdated
    }))) : null);
  }

}
;

/***/ }),

/***/ "./src/widgets/topic-security.jsx":
/*!****************************************!*\
  !*** ./src/widgets/topic-security.jsx ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _in_place_edit_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./in-place-edit.jsx */ "./src/widgets/in-place-edit.jsx");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../config.js */ "./src/config.js");




const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_1__.defineMessages)({
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
  topic_delete: {
    id: "topic_delete",
    defaultMessage: [{
      "type": 0,
      "value": "Delete Conversation"
    }]
  },
  topic_delete_warning: {
    id: "topic_delete_warning",
    defaultMessage: [{
      "type": 0,
      "value": "Are you sure you want to delete this conversation? It cannot be undone."
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
  },
  other_user: {
    id: "label_other_user",
    defaultMessage: [{
      "type": 0,
      "value": "Other"
    }]
  }
});

class TopicSecurity extends (react__WEBPACK_IMPORTED_MODULE_0___default().Component) {
  constructor(props) {
    super(props);
    const topic = this.props.tinode.getTopic(this.props.topic);

    if (!topic) {
      return;
    }

    const defacs = topic.getDefaultAccess() || {};
    const acs = topic.getAccessMode();
    let modeGiven2 = _config_js__WEBPACK_IMPORTED_MODULE_3__.NO_ACCESS_MODE;
    let modeWant2 = _config_js__WEBPACK_IMPORTED_MODULE_3__.NO_ACCESS_MODE;

    if (topic.getType() == 'p2p') {
      const user2 = topic.subscriber(props.topic);

      if (user2 && user2.acs) {
        modeGiven2 = user2.acs.getGiven();
        modeWant2 = user2.acs.getWant();
      }
    }

    this.state = {
      owner: acs && acs.isOwner(),
      admin: acs && acs.isAdmin(),
      sharer: acs && acs.isSharer(),
      deleter: acs && acs.isDeleter(),
      muted: acs && acs.isMuted(),
      groupTopic: topic.isGroupType(),
      channel: topic.isChannelType(),
      access: acs ? acs.getMode() : undefined,
      modeGiven: acs ? acs.getGiven() : undefined,
      modeWant: acs ? acs.getWant() : undefined,
      modeGiven2: modeGiven2,
      modeWant2: modeWant2,
      auth: defacs ? defacs.auth : null,
      anon: defacs ? defacs.anon : null
    };
    this.handleDeleteTopic = this.handleDeleteTopic.bind(this);
    this.handleDeleteMessages = this.handleDeleteMessages.bind(this);
    this.handleLeave = this.handleLeave.bind(this);
    this.handleBlock = this.handleBlock.bind(this);
    this.handleReport = this.handleReport.bind(this);
  }

  handleDeleteTopic(e) {
    e.preventDefault();
    const {
      formatMessage
    } = this.props.intl;
    this.props.onShowAlert(formatMessage(messages.topic_delete), formatMessage(messages.topic_delete_warning), () => {
      this.props.onDeleteTopic(this.props.topic);
    }, null, true, null);
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

  render() {
    const {
      formatMessage
    } = this.props.intl;
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "scrollable-panel"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-column"
    }, !this.state.channel ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      className: "flat-button",
      onClick: this.handleDeleteMessages
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "delete_outline"), " \xA0", formatMessage(this.state.deleter ? messages.delete_messages : messages.clear_messages)) : null, this.state.owner ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      className: "danger flat-button",
      onClick: this.handleDeleteTopic
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "delete"), " \xA0", formatMessage(messages.topic_delete)) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
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
    }, "report"), " \xA0", formatMessage(messages.report_chat)) : null), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "hr"
    }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-column"
    }, this.state.groupTopic ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "group"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_your_permissions",
      defaultMessage: [{
        "type": 0,
        "value": "Your permissions:"
      }]
    })), " ", react__WEBPACK_IMPORTED_MODULE_0___default().createElement("tt", {
      className: "clickable",
      onClick: e => {
        e.preventDefault();
        this.props.onLaunchPermissionsEditor('want');
      }
    }, this.state.access)), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "group"
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
      onClick: e => {
        e.preventDefault();
        this.props.onLaunchPermissionsEditor('auth');
      }
    }, this.state.auth)), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, "Anon: ", react__WEBPACK_IMPORTED_MODULE_0___default().createElement("tt", {
      className: "clickable",
      onClick: e => {
        e.preventDefault();
        this.props.onLaunchPermissionsEditor('anon');
      }
    }, this.state.anon))))) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "group"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
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
    }), " ", react__WEBPACK_IMPORTED_MODULE_0___default().createElement("tt", {
      className: "clickable",
      onClick: e => {
        e.preventDefault();
        this.props.onLaunchPermissionsEditor('want');
      }
    }, this.state.access)), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, this.state.fullName ? this.state.fullName : formatMessage(messages.other_user), ": \xA0", react__WEBPACK_IMPORTED_MODULE_0___default().createElement("tt", {
      className: "clickable",
      onClick: e => {
        e.preventDefault();
        this.props.onLaunchPermissionsEditor('given');
      }
    }, this.state.modeGiven2))))));
  }

}

;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(TopicSecurity));

/***/ }),

/***/ "./src/widgets/unread-badge.jsx":
/*!**************************************!*\
  !*** ./src/widgets/unread-badge.jsx ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ UnreadBadge)
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ UploadingImage)
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ VisiblePassword)
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
/***/ ((module) => {

module.exports = JSON.parse('{"de":{"action_block_contact":"Kontakt blockieren","action_cancel":"Abbrechen","action_clear_messages":"Nachrichten leeren","action_delete_messages":"Nachrichten für alle löschen","action_leave_chat":"Unterhaltung verlassen","action_report_chat":"Unterhaltung melden","archived_contacts":"Archivierte Kontakte ({count})","badge_danger":"Verdächtig","badge_owner":"Besitzer","badge_staff":"Verwaltung","badge_verified":"Verifiziert","badge_you":"Sie","block_contact_warning":"Möchten Sie diesen Kontakt wirklich blockieren?","blocked_contacts_link":"Blockierte Kontakte ({count})","button_add_another":"Hinzufügen","button_add_members":"Mitglieder hinzufügen","button_cancel":"Abbrechen","button_confirm":"Bestätigen","button_create":"Erstellen","button_delete_account":"Konto löschen","button_edit":"Bearbeiten","button_logout":"Abmelden","button_ok":"OK","button_reset":"Zurücksetzen","button_send_request":"Anfrage senden","button_sign_in":"Anmelden","button_sign_up":"Anmelden","button_subscribe":"Abbonieren","button_update":"Aktualisieren","cannot_initiate_file_upload":"Datei kann nicht hochgeladen werden.","channel":"Sender","channel_prompt":"Dies ist ein Sender","chat_invitation":"Sie sind eingeladen, an einem neuen Chat teilzunehmen. Was möchten Sie tun?","chat_invitation_accept":"Akzeptieren","chat_invitation_block":"Blockieren","chat_invitation_ignore":"Ignorieren","clear_messages_warning":"Sind Sie sicher, dass Sie diese Unterhaltung für alle leeren wollen? Das kann nicht rückgängig gemacht werden.","code_doesnot_match":"Code stimmt nicht überein","contacts_not_found":"Sie haben keine Unterhaltungen<br />¯∖_(ツ)_/¯","contacts_not_found_short":"Keine Kontakte für \'\'{query}\'\'","credential_email_prompt":"E-Mail Adresse für Registrierung","delete_account":"Konto löschen","delete_account_warning":"Möchten Sie das Konto wirklich löschen? Das kann nicht rückgängig gemacht werden","delete_messages_warning":"Sind Sie sicher, dass Sie diese Unterhaltung für alle löschen wollen? Das kann nicht rückgängig gemacht werden.","deleted_content":"Inhalt gelöscht","download_action":"herunterladen","drafty_attachment":"Dateianhang","drafty_form":"Formular:","drafty_image":"Bild","email_dative":"E-Mail","email_prompt":"E-Mail, z.B. lisam@beispiel.de","enable_peers_messaging":"Aktivieren","enter_confirmation_code_prompt":"Geben Sie den Bestätigungscode ein, der per {method} geschickt wurde:","error_invalid_id":"ungültige ID","file_attachment_too_large":"Die Dateigröße {size} überschreitet das Limit von {limit}.","forgot_password_link":"Passwort vergessen?","full_name_prompt":"Vollständiger Name, z.B. Lisa Musterfrau","granted_permissions":"Erteilt","group_has_no_members":"Keine Mitglieder","group_user_id_prompt":"Gruppe oder Benutzer ID","image_caption_prompt":"Bildunterschrift","invalid_content":"ungültiger Inhalt","invalid_security_token":"Ungültiger Sicherheitsschlüssel","label_client":"Client:","label_content_type":"Inhaltsart:","label_default_access_mode":"Standard Zugriffsmodus:","label_file_name":"Dateiname:","label_group_members":"Gruppenmitglieder:","label_incognito_mode":"inkognito-Modus:","label_message_sound":"Benachrichtigungston:","label_muting_topic":"Stumm geschaltet:","label_other_user":"Andere","label_password":"Passwort","label_permissions":"Berechtigungen:","label_private":"Privater Kommentar","label_push_notifications":"Benachrichtigungsmeldungen:","label_push_notifications_disabled":"Benachrichtigungsmeldungen (erfordert HTTPS):","label_reset_password":"Passwort per E-Mail wiederherstellen:","label_sdk":"SDK:","label_server":"Server:","label_server_address":"Server Adresse:","label_server_to_use":"Server verwenden:","label_size":"Größe:","label_topic_name":"Name","label_user_contacts":"Kontakte:","label_user_id":"ID:","label_wire_transport":"Übertragung per Kabel:","label_you":"Sie:","label_your_name":"Ihr Name","label_your_permissions":"Ihre Berechtigungen:","last_seen_timestamp":"Zuletzt gesehen","leave_chat_warning":"Möchten Sie diese Unterhaltung wirklich verlassen?","link_contact_us":"Kontakt","link_privacy_policy":"Datenschutzerklärung","link_terms_of_service":"Nutzungsbedingungen","login_prompt":"Anmelden","menu_item_archive_topic":"Archivieren","menu_item_block":"Blockieren","menu_item_clear_messages":"Nachrichten leeren","menu_item_clear_messages_for_all":"Für alle leeren","menu_item_delete":"Löschen","menu_item_delete_for_all":"Für alle löschen","menu_item_delete_topic":"Entfernen","menu_item_edit_permissions":"Berechtigungen ändern","menu_item_info":"Info","menu_item_member_delete":"Entfernen","menu_item_mute":"Unterhaltung stumm schalten","menu_item_restore_topic":"Wiederherstellen","menu_item_send_retry":"Wiederholen","menu_item_unblock":"Blockierung aufheben","menu_item_unmute":"Stumm schalten beenden","message_sending":"wird gesendet...","message_sending_failed":"fehlgeschlagen","messages_not_readable":"Neue Nachrichten können nicht gelesen werden","messaging_disabled_prompt":"Nachrichtenübermittlung deaktiviert","more_online_members":"+{overflow} mehr","new_message_prompt":"Neue Nachricht","new_password_placeholder":"Geben Sie ein neues Passwort ein","no_connection":"Keine Verbindung","no_contacts":"Sie haben keine Kontakte :-(","numeric_confirmation_code_prompt":"Nur zahlen","online_now":"jetzt online","password_prompt":"Passwort","password_unchanged_prompt":"unverändert","peers_messaging_disabled":"Gruppennachrichten sind deaktiviert","permission_admin":"Bestätigen ({val})","permission_delete":"Entfernen ({val})","permission_join":"Beitreten ({val})","permission_owner":"Besitzer ({val})","permission_pres":"Benachrichtigt werden ({val})","permission_read":"Lesen ({val})","permission_share":"Teilen ({val})","permission_write":"Schreiben ({val})","phone_dative":"Telefon","private_editing_placeholder":"Nur für Sie sichtbar","push_init_failed":"Initialisierung von Push-Benachrichtigungen fehlgeschlagen","reconnect_countdown":"Getrennt. Wiederverbinden in {seconds}…","reconnect_now":"Jetzt probieren","reload_update":"Neu laden","report_chat_warning":"Möchten Sie diese Unterhaltung wirklich blockieren und melden?","requested_permissions":"Angefordert","save_attachment":"Speichern","search_for_contacts":"Nutzen Sie die Suche um Kontakte zu finden","search_no_results":"Die Suche hatte keine Ergebnisse","search_placeholder":"Liste: email:lisa@beispiel.de, tel:17025550003...","sidepanel_title_acc_notifications":"Benachrichtigungen","sidepanel_title_acc_support":"Unterstützung","sidepanel_title_account_settings":"Konto-Einstellungen","sidepanel_title_archive":"Archivierte Unterhaltungen","sidepanel_title_blocked":"Blockierte Unterhaltungen","sidepanel_title_cred":"Anmeldeinformationen bestätigen","sidepanel_title_login":"Anmelden","sidepanel_title_newtpk":"Neue Unterhaltung starten","sidepanel_title_register":"Konto erstellen","sidepanel_title_reset":"Passwort zurücksetzen","sidepanel_title_settings":"Einstellungen","stay_logged_in":"Angemeldet bleiben","tabtitle_find_user":"Suchen","tabtitle_group_by_id":"nach ID","tabtitle_new_group":"Neue Gruppe","tags_editor_no_tags":"Schlagworte hinzufügen","tags_not_found":"Keine Schlagworte definiert. Erstellen Sie welche.","title_all_contacts":"Alle Kontakte","title_group_members":"Gruppenmitglieder","panel_title_info":"Info","title_manage_tags":"Verwalten","title_not_found":"Nicht gefunden","title_permissions":"Berechtigungen","title_tag_manager":"Schlagworte (Nutzer entdecken)","topic_block_warning":"Möchten Sie diese Unterhaltung wirklich blockieren?","topic_delete_warning":"Möchten Sie diese Unterhaltung wirklich löschen?","topic_name_editing_placeholder":"Freiform Name der Gruppe","unnamed_topic":"Unbenannt","update_available":"Aktualisierung verfügbar.","upload_finishing":"wird abgeschlossen...","user_not_found":"Nicht gefunden","validate_credential_action":"bestätigen","button_security":"Sicherheit","panel_title_security":"Sicherheit","panel_title_members":"Mitglieder","topic_delete":"Chat löschen"},"en":{"action_block_contact":"Block Contact","action_cancel":"cancel","action_clear_messages":"Clear Messages","action_delete_messages":"Clear Messages for All","action_leave_chat":"Leave Conversation","action_report_chat":"Report Conversation","archived_contacts":"Archived contacts ({count})","badge_danger":"Untrustworthy","badge_owner":"owner","badge_staff":"Staff-managed","badge_verified":"Verified/official","badge_you":"you","block_contact_warning":"Are you sure you want to block this contact?","blocked_contacts_link":"Blocked contacts ({count})","button_add_another":"Add another","button_add_members":"Add members","button_cancel":"Cancel","button_confirm":"Confirm","button_create":"Create","button_delete_account":"Delete account","button_edit":"Edit","button_logout":"Logout","button_ok":"OK","button_reset":"Reset","button_send_request":"Send request","button_sign_in":"Sign in","button_sign_up":"Sign up","button_subscribe":"Subscribe","button_update":"Update","cannot_initiate_file_upload":"Cannot initiate file upload.","channel":"channel","channel_prompt":"This is a channel","chat_invitation":"You are invited to start a new chat. What would you like to do?","chat_invitation_accept":"Accept","chat_invitation_block":"Block","chat_invitation_ignore":"Ignore","clear_messages_warning":"Are you sure you want to clear all messages? It cannot be undone.","code_doesnot_match":"Code does not match","contacts_not_found":"You have no chats<br />¯∖_(ツ)_/¯","contacts_not_found_short":"No contacts match \'\'{query}\'\'","credential_email_prompt":"Your registration email","delete_account":"Delete account","delete_account_warning":"Are you sure you want to delete your account? It cannot be undone.","delete_messages_warning":"Are you sure you want to delete all messages for everyone? It cannot be undone.","deleted_content":"content deleted","download_action":"download","drafty_attachment":"Attachment","drafty_form":"Form:","drafty_image":"Picture","email_dative":"email","email_prompt":"Email, e.g. jdoe@example.com","enable_peers_messaging":"Enable","enter_confirmation_code_prompt":"Enter confirmation code sent to you by {method}:","error_invalid_id":"Invalid ID","file_attachment_too_large":"The file size {size} exceeds the {limit} limit.","forgot_password_link":"Forgot password?","full_name_prompt":"Full name, e.g. John Doe","granted_permissions":"Granted","group_has_no_members":"No members","group_user_id_prompt":"Group or User ID","image_caption_prompt":"Image caption","invalid_content":"invalid content","invalid_security_token":"Invalid security token","label_client":"Client:","label_content_type":"Content type:","label_default_access_mode":"Default access mode:","label_file_name":"File name:","label_group_members":"Group members:","label_incognito_mode":"Incognito mode:","label_message_sound":"Message sound:","label_muting_topic":"Muted:","label_other_user":"Other","label_password":"Password","label_permissions":"Permissions:","label_private":"Private comment","label_push_notifications":"Notification alerts:","label_push_notifications_disabled":"Notification alerts (requires HTTPS):","label_reset_password":"Send a password reset email:","label_sdk":"SDK:","label_server":"Server:","label_server_address":"Server address:","label_server_to_use":"Server to use:","label_size":"Size:","label_topic_name":"Name","label_user_contacts":"Contacts:","label_user_id":"ID:","label_wire_transport":"Wire transport:","label_you":"You:","label_your_name":"Your name","label_your_permissions":"Your permissions:","last_seen_timestamp":"Last seen","leave_chat_warning":"Are you sure you want to leave this conversation?","link_contact_us":"Contact Us","link_privacy_policy":"Privacy Policy","link_terms_of_service":"Terms of Service","login_prompt":"Login","menu_item_archive_topic":"Archive","menu_item_block":"Block","menu_item_clear_messages":"Clear messages","menu_item_clear_messages_for_all":"Clear for All","menu_item_delete":"Delete","menu_item_delete_for_all":"Delete for All","menu_item_delete_topic":"Delete","menu_item_edit_permissions":"Edit permissions","menu_item_info":"Info","menu_item_member_delete":"Remove","menu_item_mute":"Mute","menu_item_reply":"Reply","menu_item_restore_topic":"Restore","menu_item_send_retry":"Retry","menu_item_unblock":"Unblock","menu_item_unmute":"Unmute","message_sending":"sending...","message_sending_failed":"failed","messages_not_readable":"no access to messages","messaging_disabled_prompt":"Messaging disabled","more_online_members":"+{overflow} more","new_message_prompt":"New message","new_password_placeholder":"Enter new password","no_connection":"No connection","no_contacts":"You have no contacts :-(","numeric_confirmation_code_prompt":"Numbers only","online_now":"online now","password_prompt":"Password","password_unchanged_prompt":"Unchanged","peers_messaging_disabled":"Peer\'s messaging is disabled.","permission_admin":"Approve ({val})","permission_delete":"Delete ({val})","permission_join":"Join ({val})","permission_owner":"Owner ({val})","permission_pres":"Get notified ({val})","permission_read":"Read ({val})","permission_share":"Share ({val})","permission_write":"Write ({val})","phone_dative":"phone","private_editing_placeholder":"Visible to you only","push_init_failed":"Failed to initialize push notifications","reconnect_countdown":"Disconnected. Reconnecting in {seconds}…","reconnect_now":"Try now","reload_update":"Reload","report_chat_warning":"Are you sure you want to block and report this conversation?","requested_permissions":"Requested","save_attachment":"save","search_for_contacts":"Use search to find contacts","search_no_results":"Search returned no results","search_placeholder":"List like email:alice@example.com, tel:17025550003...","sidepanel_title_acc_notifications":"Notifications","sidepanel_title_acc_support":"Support","sidepanel_title_account_settings":"Account Settings","sidepanel_title_archive":"Archived Chats","sidepanel_title_blocked":"Blocked Chats","sidepanel_title_cred":"Confirm Credentials","sidepanel_title_login":"Sign In","sidepanel_title_newtpk":"Start New Chat","sidepanel_title_register":"Create Account","sidepanel_title_reset":"Reset Password","sidepanel_title_settings":"Settings","stay_logged_in":"Stay logged in","tabtitle_find_user":"find","tabtitle_group_by_id":"by id","tabtitle_new_group":"new group","tags_editor_no_tags":"Add some tags","tags_not_found":"No tags defined. Add some.","title_all_contacts":"All Contacts","title_group_members":"Group Members","title_manage_tags":"Manage","title_not_found":"Not found","title_permissions":"Permissions","title_tag_manager":"Tags (search & discovery)","topic_block_warning":"Are you sure you want to block this conversation?","topic_delete_warning":"Are you sure you want to delete this conversation?","topic_name_editing_placeholder":"Freeform name of the group","unnamed_topic":"Unnamed","update_available":"Update available.","upload_finishing":"finishing...","user_not_found":"Not found","validate_credential_action":"confirm","description_editing_placeholder":"Optional description","label_description":"Description","button_security":"Security","panel_title_crop":"Drag to Adjust","panel_title_general":"General","panel_title_members":"Members","panel_title_security":"Security","panel_title_info":"Info","permissions_anonymous":"Anonymous","permissions_authenticated":"Authenticated","topic_delete":"Delete Conversation","permissions_user":"User\'s Permissions"},"es":{"action_block_contact":"Bloquear contacto","action_cancel":"cancelar","action_clear_messages":"Borrar mensajes","action_delete_messages":"Borrar mensajes para todos","action_leave_chat":"Dejar conversación","action_report_chat":"Reportar conversación","archived_contacts":"Contactos archivados ({count})","badge_danger":"Suspicaz","badge_owner":"propietario","badge_staff":"Administración","badge_verified":"Verificado","badge_you":"tú","block_contact_warning":"¿Estás seguro de que quieres bloquear a este contacto?","blocked_contacts_link":"Contactos bloqueados ({count})","button_add_another":"Añadir contacto","button_add_members":"Añadir miembros","button_cancel":"Cancelar","button_confirm":"Confirmar","button_create":"Crear","button_delete_account":"Eliminar cuenta","button_edit":"Editar","button_logout":"Cerrar sesión","button_ok":"OK","button_reset":"Restablecer","button_send_request":"Enviar petición","button_sign_in":"Entrar","button_sign_up":"Regístrate","button_subscribe":"Suscribirse","button_update":"Actualizar","cannot_initiate_file_upload":"No se pudo iniciar la carga del archivo.","channel":"canal","channel_prompt":"Este es un canal","chat_invitation":"Estás invitado a participar en un nuevo chat. ¿Qué te gustaría hacer?","chat_invitation_accept":"Aceptar","chat_invitation_block":"Bloquear","chat_invitation_ignore":"Ignorar","clear_messages_warning":"¿Estás seguro de que quieres eliminar todos los mensajes? Esta acción es irreversible.","code_doesnot_match":"El código no coincide","contacts_not_found":"No tienes chats<br />¯∖_(ツ)_/¯","contacts_not_found_short":"Ningún contacto coincide con \'\'{query}\'\'","credential_email_prompt":"Tu correo electrónico de registro","delete_account":"Eliminar cuenta","delete_account_warning":"¿Estás seguro de que deseas eliminar permanentemente tu cuenta? Esta acción es irreversible.","delete_messages_warning":"¿Estás seguro de que quieres eliminar todos los mensajes para todos? Esta acción es irreversible.","deleted_content":"este mensaje fue eliminado","download_action":"descargar","drafty_attachment":"Archivo","drafty_form":"Formulario:","drafty_image":"Imagen","email_dative":"correo electrónico","email_prompt":"Correo electrónico, p.ej. juan@example.com","enable_peers_messaging":"Habilitar","enter_confirmation_code_prompt":"Introduzca el código de confirmación enviado a tu {method}:","error_invalid_id":"ID inválido","file_attachment_too_large":"El tamaño del archivo {size} excede el límite de {limit}.","forgot_password_link":"¿Olvidaste tu contraseña?","full_name_prompt":"Nombre completo, p.ej. Juan González Hernández","granted_permissions":"Otorgados","group_has_no_members":"No hay miembros","group_user_id_prompt":"ID del grupo o usuario","image_caption_prompt":"Añade un comentario","invalid_content":"contenido inválido","invalid_security_token":"Token de seguridad inválido","label_client":"Cliente:","label_content_type":"Tipo de contenido:","label_default_access_mode":"Modo de acceso predeterminado:","label_file_name":"Nombre del archivo:","label_group_members":"Miembros del grupo:","label_incognito_mode":"Modo incógnito:","label_message_sound":"Sonido de mensaje:","label_muting_topic":"Silenciado:","label_other_user":"Otros","label_password":"Contraseña","label_permissions":"Permisos:","label_private":"Comentario privado","label_push_notifications":"Alertas de notificaciones:","label_push_notifications_disabled":"Alertas de notificaciones (requiere HTTPS):","label_reset_password":"Enviar un correo electrónico de restablecimiento de contraseña:","label_sdk":"SDK:","label_server":"Servidor:","label_server_address":"Dirección del servidor:","label_server_to_use":"Servidor para usar:","label_size":"Tamaño:","label_topic_name":"Nombre del tema","label_user_contacts":"Contactos:","label_user_id":"ID:","label_wire_transport":"Transporte de alambre:","label_you":"Tú:","label_your_name":"Tu nombre","label_your_permissions":"Tus permisos:","last_seen_timestamp":"Últ. vez","leave_chat_warning":"¿Estás seguro de que quieres dejar esta conversación?","link_contact_us":"Contáctanos","link_privacy_policy":"Política de privacidad","link_terms_of_service":"Términos de uso","login_prompt":"Nombre de usuario","menu_item_archive_topic":"Archivar","menu_item_block":"Bloquear","menu_item_clear_messages":"Borrar mensajes","menu_item_clear_messages_for_all":"Borrar para todos","menu_item_delete":"Eliminar","menu_item_delete_for_all":"Eliminar para todos","menu_item_delete_topic":"Eliminar","menu_item_edit_permissions":"Editar permisos","menu_item_info":"Información","menu_item_member_delete":"Eliminar","menu_item_mute":"Silenciar","menu_item_restore_topic":"Restaurar","menu_item_send_retry":"Inténtalo de nuevo","menu_item_unblock":"Desbloquear","menu_item_unmute":"Anular el silencio","message_sending":"enviando...","message_sending_failed":"no se pudo enviar el mensaje","messages_not_readable":"sin acceso a mensajes","messaging_disabled_prompt":"El envío de mensajes está deshabilitado","more_online_members":"+{overflow} más","new_message_prompt":"Nuevo mensaje","new_password_placeholder":"Introduzca una nueva contraseña","no_connection":"Sin conexión","no_contacts":"No tienes contactos :-(","numeric_confirmation_code_prompt":"Sólo números","online_now":"en línea","password_prompt":"Contraseña","password_unchanged_prompt":"Sin cambios","peers_messaging_disabled":"La mensajería Peer está deshabilitada.","permission_admin":"Approbar ({val})","permission_delete":"Eliminar ({val})","permission_join":"Unirse ({val})","permission_owner":"Propietario ({val})","permission_pres":"Ser notificado ({val})","permission_read":"Leer ({val})","permission_share":"Compartir ({val})","permission_write":"Escribir ({val})","phone_dative":"teléfono","private_editing_placeholder":"Sólo visible para tí","push_init_failed":"Error al inicializar las notificaciones push","reconnect_countdown":"Desconectado. Reconectando en {seconds}…","reconnect_now":"Reintentar","reload_update":"Recargar","report_chat_warning":"¿Estás seguro de que quieres bloquear y reportar a esta conversación?","requested_permissions":"Solicitados","save_attachment":"guardar","search_for_contacts":"Usa la búsqueda para encontrar contactos","search_no_results":"La búsqueda no arrojó resultados","search_placeholder":"Ej. email:alice@example.com, tel:17025550003...","sidepanel_title_acc_notifications":"Notificaciones","sidepanel_title_acc_support":"Soporte","sidepanel_title_account_settings":"Ajustes de la cuenta","sidepanel_title_archive":"Chats archivados","sidepanel_title_blocked":"Chats bloqueados","sidepanel_title_cred":"Confirmar credenciales","sidepanel_title_login":"Iniciar sesión","sidepanel_title_newtpk":"Iniciar un nuevo chat","sidepanel_title_register":"Crear cuenta","sidepanel_title_reset":"Restablecer contraseña","sidepanel_title_settings":"Ajustes","stay_logged_in":"Permanecer conectado","tabtitle_find_user":"encontrar","tabtitle_group_by_id":"por ID","tabtitle_new_group":"nuevo grupo","tags_editor_no_tags":"Añadir etiquetas","tags_not_found":"No hay etiquetas definidas. Añade unas.","title_all_contacts":"Todos los contactos","title_group_members":"Miembros del grupo","title_manage_tags":"Gestionar","title_not_found":"No encontrado","title_permissions":"Permisos","title_tag_manager":"Etiquetas (descubrimiento de usuarios)","topic_block_warning":"¿Estás seguro de que quieres bloquear esta conversación","topic_delete_warning":"¿Estás seguro de que quieres eliminar esta conversación?","topic_name_editing_placeholder":"Nombre del grupo","unnamed_topic":"Sin nombre","update_available":"Actualización disponible.","upload_finishing":"terminando...","user_not_found":"Usuario no encontrado","validate_credential_action":"confirmar","topic_delete":"Eliminar chat"},"ko":{"action_block_contact":"연락차단","action_cancel":"취소","action_clear_messages":"메시지지우기","action_delete_messages":"모든메시지지우기","action_leave_chat":"대화나누기","action_report_chat":"대화기록","archived_contacts":"보관된연락처({수})","badge_danger":"의심 많은","badge_owner":"소유자","badge_staff":"직원 관리하에","badge_verified":"확인 됨","badge_you":"당신","block_contact_warning":"이연락처를차단하시겠습니까?","blocked_contacts_link":"차단된연락처({수})","button_add_another":"다른항목추가","button_add_members":"회원추가","button_cancel":"취소","button_confirm":"확인","button_create":"작성","button_delete_account":"계정삭제","button_edit":"편집","button_logout":"로그아웃","button_ok":"OK","button_reset":"재설정","button_send_request":"요청보내기","button_sign_in":"로그인","button_sign_up":"가입","button_subscribe":"구독","button_update":"업데이트","cannot_initiate_file_upload":"파일업로드를시작할수없습니다.","channel":"채널","channel_prompt":"이 채널입니다","chat_invitation":"새로운대화를시작하도록초대되었습니다.무엇을하시겠습니까?","chat_invitation_accept":"수락","chat_invitation_block":"차단","chat_invitation_ignore":"무시","clear_messages_warning":"모든메시지를지우시겠습니까?실행취소할수없습니다.","code_doesnot_match":"코드가일치하지않습니다","contacts_not_found":"채팅이없습니다<br/>¯∖_(ツ)_/¯","contacts_not_found_short":"\'{문의}\'와일치하는연락처가없습니다.","credential_email_prompt":"등록이메일","delete_account":"계정삭제","delete_account_warning":"계정을삭제하시겠습니까?실행취소할수없습니다.","delete_messages_warning":"모든사람의모든메시지를삭제하시겠습니까?실행취소할수없습니다.","deleted_content":"내용이 삭제되었습니다","download_action":"다운로드","drafty_attachment":"부착","drafty_form":"형태:","drafty_image":"이미지","email_dative":"이메일","email_prompt":"이메일(예:hong@example.com)","enable_peers_messaging":"활성화","enter_confirmation_code_prompt":"{방법}으로보낸확인코드를입력하십시오:","error_invalid_id":"잘못된ID","file_attachment_too_large":"파일크기{크기}이(가){제한}제한을초과합니다.","forgot_password_link":"비밀번호를잊으셨습니까?","full_name_prompt":"전체이름(예:홍길동)","granted_permissions":"승낙하다","group_has_no_members":"회원없음","group_user_id_prompt":"그룹또는사용자ID","image_caption_prompt":"이미지설명","invalid_content":"잘못된내용","invalid_security_token":"유효하지않은보안토큰","label_client":"클라이언트: ","label_content_type":"컨텐츠유형: ","label_default_access_mode":"기본액세스모드: ","label_file_name":"파일이름: ","label_group_members":"그룹회원: ","label_incognito_mode":"시크릿모드: ","label_message_sound":"메시지소리: ","label_muting_topic":"음소거: ","label_other_user":"기타","label_password":"비밀번호","label_permissions":"권한: ","label_private":"개인코멘트","label_push_notifications":"통지경보: ","label_push_notifications_disabled":"통지경보(HTTPS필요): ","label_reset_password":"비밀번호재설정이메일보내기: ","label_sdk":"SDK:","label_server":"서버: ","label_server_address":"서버주소: ","label_server_to_use":"사용할서버:","label_size":"크기: ","label_topic_name":"이름","label_user_contacts":"연락처: ","label_user_id":"ID:","label_wire_transport":"와이어수송:","label_you":"당신: ","label_your_name":"이름","label_your_permissions":"권한: ","last_seen_timestamp":"마지막으로본","leave_chat_warning":"이대화를나가시겠습니까?","link_contact_us":"문의처","link_privacy_policy":"개인정보보호정책","link_terms_of_service":"서비스약관","login_prompt":"로그인","menu_item_archive_topic":"보관","menu_item_block":"차단","menu_item_clear_messages":"메시지지우기","menu_item_clear_messages_for_all":"모두지우기","menu_item_delete":"삭제","menu_item_delete_for_all":"모두삭제","menu_item_delete_topic":"삭제","menu_item_edit_permissions":"편집권한","menu_item_info":"정보","menu_item_member_delete":"제거","menu_item_mute":"음소거","menu_item_restore_topic":"복원","menu_item_send_retry":"다시시도","menu_item_unblock":"차단해제","menu_item_unmute":"음소거해제","message_sending":"보내기...","message_sending_failed":"실패","messages_not_readable":"메시지에 액세스 할 수 없습니다","messaging_disabled_prompt":"메시지비활성화","more_online_members":"+{넘침}더보기","new_message_prompt":"새메시지","new_password_placeholder":"새비밀번호입력","no_connection":"연결없음","no_contacts":"연락처가없습니다 (._.)","numeric_confirmation_code_prompt":"숫자만","online_now":"현재접속중","password_prompt":"비밀번호","password_unchanged_prompt":"변경되지않음","peers_messaging_disabled":"동료의메시지가비활성화되었습니다.","permission_admin":"승인({val})","permission_delete":"삭제({val})","permission_join":"참여({val})","permission_owner":"소유자({val})","permission_pres":"알림받기({val})","permission_read":"읽기({val})","permission_share":"공유({val})","permission_write":"쓰기({val})","phone_dative":"전화","private_editing_placeholder":"나만볼수있습니다","push_init_failed":"푸시알림을초기화하지못했습니다","reconnect_countdown":"연결이끊어졌습니다.다시연결하는중{초}…","reconnect_now":"지금시도","reload_update":"재로드","report_chat_warning":"이대화를차단하고기록하시겠습니까?","requested_permissions":"요청","save_attachment":"저장","search_for_contacts":"검색을사용하여연락처찾기","search_no_results":"검색결과가없습니다","search_placeholder":"email:alice@example.com,tel:17025550003...와같은목록","sidepanel_title_acc_notifications":"알림","sidepanel_title_acc_support":"지원","sidepanel_title_account_settings":"계정설정","sidepanel_title_archive":"보관된채팅","sidepanel_title_blocked":"차단된채팅","sidepanel_title_cred":"자격증명확인","sidepanel_title_login":"로그인","sidepanel_title_newtpk":"새채팅시작","sidepanel_title_register":"계정만들기","sidepanel_title_reset":"비밀번호재설정","sidepanel_title_settings":"설정","stay_logged_in":"로그인상태유지","tabtitle_find_user":"찾기","tabtitle_group_by_id":"id로","tabtitle_new_group":"새그룹","tags_editor_no_tags":"일부태그추가","tags_not_found":"태그가정의되지않았습니다.일부를추가하십시오.","title_all_contacts":"모든연락처","title_group_members":"그룹구성원","title_manage_tags":"관리","title_not_found":"찾을수없음","title_permissions":"권한","title_tag_manager":"태그(사용자검색)","topic_block_warning":"이대화를차단하시겠습니까?","topic_delete_warning":"이대화를삭제하시겠습니까?","topic_name_editing_placeholder":"그룹의자유형이름","unnamed_topic":"이름없는","update_available":"업데이트가능.","upload_finishing":"마무리...","user_not_found":"찾을수없음","validate_credential_action":"확인","topic_delete":"채팅 삭제"},"ro":{"action_block_contact":"Blochează contact","action_cancel":"anulează","action_clear_messages":"Șterge mesajele","action_delete_messages":"Șterge toate mesajele","action_leave_chat":"Ieși din conversație","action_report_chat":"Raportează conversația","archived_contacts":"Contacte arhivate ({count})","badge_danger":"Suspicios","badge_owner":"owner","badge_staff":"Administrare","badge_verified":"Verificat","badge_you":"tu","block_contact_warning":"Ești sigur că dorești să blochezi acest contact?","blocked_contacts_link":"Contact blocate ({count})","button_add_another":"Adaugă","button_add_members":"Adaugă persoane","button_cancel":"Anulează","button_confirm":"Confirmă","button_create":"Creează","button_delete_account":"Șterge cont","button_edit":"Editează","button_logout":"Deconectare","button_ok":"OK","button_reset":"Resetează","button_send_request":"Trimite cerere","button_sign_in":"Conectează-te","button_sign_up":"Creează cont","button_subscribe":"Subscribe","button_update":"Actualizează","cannot_initiate_file_upload":"Nu se poate face încărcarea.","channel":"canal","channel_prompt":"Acesta este un canal","chat_invitation":"Ai primit invitație într-o conversație. Accepți?","chat_invitation_accept":"Da, accept","chat_invitation_block":"Blochează","chat_invitation_ignore":"Ignoră","clear_messages_warning":"Ești sigur că dorești să ștergi mesajele? Acestea nu pot fi recuperate.","code_doesnot_match":"Codul furnizat nu este valid","contacts_not_found":"Nu ai contacte salvate<br />¯∖_(ツ)_/¯","contacts_not_found_short":"Niciun contact găsit după criteriile \'\'{query}\'\'","credential_email_prompt":"Adresa de e-mail","delete_account":"Șterge contul","delete_account_warning":"Ești sigur că dorești să ștergi contul? Acesta nu va putea fi recuperat.","delete_messages_warning":"Ești sigur că dorești să șterge mesajele din toate conversațiile? Acestea nu pot fi recuperate.","deleted_content":"conținut șters","download_action":"download","drafty_attachment":"Atasament","drafty_form":"Formă:","drafty_image":"Imagine","email_dative":"email","email_prompt":"Adresa de e-mail","enable_peers_messaging":"Activează","enter_confirmation_code_prompt":"Introu codul de confirmare trimis pe {method}:","error_invalid_id":"ID Invalid","file_attachment_too_large":"Dimensiunea fișiterului {size} depășește limita de {limit}.","forgot_password_link":"Ți-ai uitat parola?","full_name_prompt":"Numele tău","granted_permissions":"Oferite","group_has_no_members":"În acest grup nu se află persoane","group_user_id_prompt":"Grup sau user ID","image_caption_prompt":"Titlul imaginii","invalid_content":"conținut invalid","invalid_security_token":"Codul de securitate este invalid","label_client":"Client:","label_content_type":"Tip conținut:","label_default_access_mode":"Default access mode:","label_file_name":"Nume fișier:","label_group_members":"Membrii grupului:","label_incognito_mode":"Mod incognito:","label_message_sound":"Sunet de mesaj:","label_muting_topic":"Mod silențios (muted):","label_other_user":"Altele","label_password":"Parola","label_permissions":"Permisiuni:","label_private":"Comentariu privat","label_push_notifications":"Alerte de notificare:","label_push_notifications_disabled":"Alerte de notificare (necesită HTTPS):","label_reset_password":"Resetează parola:","label_sdk":"SDK:","label_server":"Server:","label_server_address":"Adresa serverului:","label_server_to_use":"Server de utilizat:","label_size":"Size:","label_topic_name":"Nume","label_user_contacts":"Contacte:","label_user_id":"ID:","label_wire_transport":"Transportul legat:","label_you":"Tu:","label_your_name":"Numele tău","label_your_permissions":"Permisiuniile tale:","last_seen_timestamp":"Văzut ultima dată","leave_chat_warning":"Ești sigur că dorești să ieși din conersație?","link_contact_us":"Contactează-ne","link_privacy_policy":"Politica de Confidențialitate","link_terms_of_service":"Termenii Serviciului","login_prompt":"Conectează-te","menu_item_archive_topic":"Arhivează","menu_item_block":"Blochează","menu_item_clear_messages":"Șterge mesajele","menu_item_clear_messages_for_all":"Ștergele pe toate","menu_item_delete":"Șterge","menu_item_delete_for_all":"Ștergele pe toate","menu_item_delete_topic":"Șterge","menu_item_edit_permissions":"Editează permisiuni","menu_item_info":"Info","menu_item_member_delete":"Șterge persoană","menu_item_mute":"Mute","menu_item_restore_topic":"Restabili","menu_item_send_retry":"Reîncearcă","menu_item_unblock":"Deblochează","menu_item_unmute":"Unmute","message_sending":"se trimite...","message_sending_failed":"eroare","messages_not_readable":"Mesajele nu pot fi citite","messaging_disabled_prompt":"Mesageria este dezactivată","more_online_members":"+{overflow} mai mult","new_message_prompt":"Mesaj nou","new_password_placeholder":"Introdu parolă","no_connection":"Nu există conexiune","no_contacts":"Nu ai contacte adăugate :-(","numeric_confirmation_code_prompt":"Doar cifre","online_now":"online acum","password_prompt":"Parola","password_unchanged_prompt":"Neschimbată","peers_messaging_disabled":"Mesageria de tip Peer este dezactivată.","permission_admin":"Aprobare ({val})","permission_delete":"Ștergere ({val})","permission_join":"Participare ({val})","permission_owner":"Deținător ({val})","permission_pres":"Notificare ({val})","permission_read":"Citire ({val})","permission_share":"Distribuire ({val})","permission_write":"Scriere ({val})","phone_dative":"telefon","private_editing_placeholder":"Vizibil doar ție","push_init_failed":"Nu s-a reușit inițializarea tip push notifications","reconnect_countdown":"Deconectat. Se încearcă conectarea în {seconds}…","reconnect_now":"Încearcă din nou","reload_update":"Reîncarcă","report_chat_warning":"Ești sigur că dorești să blochezi și să raportezi această conversație?","requested_permissions":"Necesare","save_attachment":"salvează","search_for_contacts":"Caută în contacte","search_no_results":"Nu s-au găsit rezultate","search_placeholder":"Caută după e-mail sau număr telefon...","sidepanel_title_acc_notifications":"Notificări","sidepanel_title_acc_support":"Ajutor","sidepanel_title_account_settings":"Setările Contului","sidepanel_title_archive":"Conversații Arhivate","sidepanel_title_blocked":"Conversații Blocate","sidepanel_title_cred":"Confirmă credențiale","sidepanel_title_login":"Conectează-te","sidepanel_title_newtpk":"Creeză un nou Chat","sidepanel_title_register":"Creează Cont","sidepanel_title_reset":"Resetează Parola","sidepanel_title_settings":"Setări","stay_logged_in":"Rămâi conectat","tabtitle_find_user":"caută","tabtitle_group_by_id":"după id","tabtitle_new_group":"grup nou","tags_editor_no_tags":"Adaugă tag-uri","tags_not_found":"Niciun tag definit. Adaugă.","title_all_contacts":"Toate Contactele","title_group_members":"Persoanele din grup","title_manage_tags":"Administrează","title_not_found":"Nu a fost găsit","title_permissions":"Permisiuni","title_tag_manager":"Tag-uri (user discovery)","topic_block_warning":"Ești sigur că dorești să blochezi această conversație?","topic_delete_warning":"Ești sigur că dorești să șterge această conversație?","topic_name_editing_placeholder":"Numele grupului","unnamed_topic":"Nedenumit","update_available":"Actualizare disponibilă.","upload_finishing":"se încarcă...","user_not_found":"Utilizatorul nu a fost găsit","validate_credential_action":"confirmă","topic_delete":"Ștergeți Chat"},"ru":{"action_block_contact":"Заблокировать контакт","action_cancel":"отменить","action_clear_messages":"Удалить сообщения","action_delete_messages":"Удалить сообщения","action_leave_chat":"Уйти из чата","action_report_chat":"Сообщить о нарушении","archived_contacts":"Чаты в архиве ({count})","badge_danger":"Подозрительный","badge_owner":"влад.","badge_staff":"Администрация","badge_verified":"Верифицированный","badge_you":"вы","block_contact_warning":"Вы действительно заблокировать этот контакт?","blocked_contacts_link":"Заблокированные ({count})","button_add_another":"Добавить","button_add_members":"Добавить","button_cancel":"Отменить","button_confirm":"Подтвердить","button_create":"Создать","button_delete_account":"Удалить аккаунт","button_edit":"Редактировать","button_logout":"Выйти","button_ok":"OK","button_reset":"Изменить","button_send_request":"Отправить","button_sign_in":"Войти","button_sign_up":"Создать аккаунт","button_subscribe":"Подписаться","button_update":"Применить","cannot_initiate_file_upload":"Ошибка загрузки файла.","channel":"канал","channel_prompt":"Создать канал","chat_invitation":"Вас пригласили начать новый чат. Как вы хотите поступить?","chat_invitation_accept":"Принять","chat_invitation_block":"Заблокировать","chat_invitation_ignore":"Игнорировать","clear_messages_warning":"Вы действительно хотите удалить все сообщения в чате? Их будет невозможно восстановить.","code_doesnot_match":"Код не совпадает","contacts_not_found":"Чатов нет<br />¯∖_(ツ)_/¯","contacts_not_found_short":"Нет контактов для запроса \'\'{query}\'\'","credential_email_prompt":"Регистрационный емейл","delete_account":"Удалить аккаунт","delete_account_warning":"Вы уверены, что ходите удалить свой аккаунт? Его невозможно будет восстановить.","delete_messages_warning":"Вы действительно хотите удалить все сообщения?","deleted_content":"удалено","download_action":"скачать","drafty_attachment":"Аттачмент","drafty_form":"Форма:","drafty_image":"Картинка","email_dative":"емейлу","email_prompt":"Email, напр. ivan@example.com","enable_peers_messaging":"Разблокировать.","enter_confirmation_code_prompt":"Код подтверждения, полученный по {method}:","error_invalid_id":"Неверный ID","file_attachment_too_large":"Размер файла {size} превышает {limit} лимит.","forgot_password_link":"Напомнить пароль","full_name_prompt":"Полное имя, напр. Иван Петров","granted_permissions":"Получены","group_has_no_members":"Нет участников","group_user_id_prompt":"ID чата или пользователя","image_caption_prompt":"Подпись к фото","invalid_content":"сообщение не читается","invalid_security_token":"Токен некорректен","label_client":"Клиент:","label_content_type":"Тип:","label_default_access_mode":"Доступ по умолчанию:","label_file_name":"Имя файла:","label_group_members":"Участники чата:","label_incognito_mode":"Режим инкогнито:","label_message_sound":"Звук нового сообщения:","label_muting_topic":"Без уведомлений","label_other_user":"Второй","label_password":"Пароль","label_permissions":"Права доступа:","label_private":"Комментарий","label_push_notifications":"Уведомления:","label_push_notifications_disabled":"Уведомления (требуют HTTPS):","label_reset_password":"Отправить емейл для смены пароля:","label_sdk":"SDK:","label_server":"Сервер:","label_server_address":"Адрес сервера:","label_server_to_use":"Использовать сервер:","label_size":"Размер:","label_topic_name":"Название","label_user_contacts":"Конакты:","label_user_id":"ID:","label_wire_transport":"Соединение:","label_you":"Вы:","label_your_name":"Ваше имя","label_your_permissions":"Ваши права доступа:","last_seen_timestamp":"Был активен","leave_chat_warning":"Вы действительно хотите покинуть этот чат?","link_contact_us":"Связаться с нами","link_privacy_policy":"Политика конфиденциальности","link_terms_of_service":"Условия сервиса","login_prompt":"Логин","menu_item_archive_topic":"В архив","menu_item_block":"Заблокировать","menu_item_clear_messages":"Удалить сообщения","menu_item_clear_messages_for_all":"Удалить для всех","menu_item_delete":"Удалить","menu_item_delete_for_all":"Удалить для всех","menu_item_delete_topic":"Удалить чат","menu_item_edit_permissions":"Права доступа","menu_item_info":"Информация","menu_item_member_delete":"Отписать","menu_item_mute":"Не уведомлять","menu_item_restore_topic":"Разархивировать","menu_item_send_retry":"Отправить заново","menu_item_unblock":"Разблокировать","menu_item_unmute":"Уведомлять","message_sending":"в пути...","message_sending_failed":"ошибка","messages_not_readable":"нет доступа к сообщениям","messaging_disabled_prompt":"Отправка недоступна","more_online_members":"+еще {overflow}","new_message_prompt":"Новое сообщение","new_password_placeholder":"Введите новый пароль","no_connection":"Нет связи","no_contacts":"Ничего нет :-(","numeric_confirmation_code_prompt":"Только цифры","online_now":"онлайн","password_prompt":"Пароль","password_unchanged_prompt":"Не изменен","peers_messaging_disabled":"Чат заблокирован у корреспондента.","permission_admin":"Подтверждать ({val})","permission_delete":"Удалять ({val})","permission_join":"Подписываться ({val})","permission_owner":"Владелец ({val})","permission_pres":"Уведомлять ({val})","permission_read":"Читать ({val})","permission_share":"Приглашать ({val})","permission_write":"Писать ({val})","phone_dative":"телефону","private_editing_placeholder":"Виден только вам","push_init_failed":"Ошибка инициализации пуш уведомлений","reconnect_countdown":"Нет связи. Подключение через {seconds}…","reconnect_now":"Подключить сейчас.","reload_update":"Обновить","report_chat_warning":"Вы действительно хотите сообщить о нарушении и заблокировать этот чат?","requested_permissions":"Требуются","save_attachment":"сохранить","search_for_contacts":"Поиск контактов","search_no_results":"Ничего не найдено","search_placeholder":"Список, напр. email:alice@example.com, tel:+17025550003...","sidepanel_title_acc_notifications":"Уведомления","sidepanel_title_acc_support":"Поддержка","sidepanel_title_account_settings":"Настройки аккаунта","sidepanel_title_archive":"Архив чатов","sidepanel_title_blocked":"Заблокированные чаты","sidepanel_title_cred":"Подтвердить","sidepanel_title_login":"Авторизация","sidepanel_title_newtpk":"Новый чат","sidepanel_title_register":"Зарегистрироваться","sidepanel_title_reset":"Сменить пароль","sidepanel_title_settings":"Настройки","stay_logged_in":"Запомнить","tabtitle_find_user":"найти","tabtitle_group_by_id":"по id","tabtitle_new_group":"создать","tags_editor_no_tags":"Добавьте теги","tags_not_found":"Тегов нет. Добавьте","title_all_contacts":"Все контакты","title_group_members":"Участники","title_manage_tags":"Редактировать","title_not_found":"Не найден","title_permissions":"Права доступа","title_tag_manager":"Теги для поиска","topic_block_warning":"Вы действительно хотите заблокировать этот чат?","topic_delete_warning":"Вы действительно хотите удалить этот чат?","topic_name_editing_placeholder":"Название чата","unnamed_topic":"Без названия","update_available":"Есть новая версия приложения.","upload_finishing":"завершение...","user_not_found":"Не найден","validate_credential_action":"подтвердить","topic_delete":"Удалить чат"},"zh-TW":{"action_block_contact":"封鎖聯絡人","action_cancel":"取消","action_clear_messages":"清除訊息","action_delete_messages":"為所有人清除訊息","action_leave_chat":"離開對話","action_report_chat":"檢舉對話","archived_contacts":"已封存的聯絡人 ({count})","badge_owner":"擁有者","badge_you":"您","block_contact_warning":"您確定要封鎖此聯絡人嗎？","blocked_contacts_link":"已封鎖的聯絡人 ({count})","button_add_another":"新增其他人","button_add_members":"新增成員","button_cancel":"取消","button_confirm":"確認","button_create":"建立","button_delete_account":"刪除帳號","button_edit":"編輯","button_logout":"登出","button_ok":"OK","button_reset":"重設","button_send_request":"傳送要求","button_sign_in":"登入","button_sign_up":"註冊","button_subscribe":"訂閱","button_update":"更新","cannot_initiate_file_upload":"無法為檔案上傳初始化。","channel":"頻道","channel_prompt":"這是頻道","chat_invitation":"您已被邀請開始新對話。您接下來要做什麼呢？","chat_invitation_accept":"接受","chat_invitation_block":"封鎖","chat_invitation_ignore":"忽略","clear_messages_warning":"您確定要清除所有訊息嗎？此操作無法復原。","code_doesnot_match":"代碼不相符","contacts_not_found":"您沒有任何對話<br />¯∖_(ツ)_/¯","contacts_not_found_short":"沒有符合 \'\'{query}\'\' 的聯絡人","credential_email_prompt":"您的註冊電子郵件地址","delete_account":"刪除帳號","delete_messages_warning":"您確定要為所有人刪除所有訊息嗎？此操作無法復原。","deleted_content":"內容已被刪除","download_action":"下載","drafty_attachment":"附加檔案","drafty_form":"表單：","drafty_image":"圖片","email_dative":"電子郵件地址","email_prompt":"電子郵件地址，例如：jdoe@example.com","enable_peers_messaging":"啟用","enter_confirmation_code_prompt":"輸入透過 {method} 傳送給您的確認碼：","error_invalid_id":"ID 無效","file_attachment_too_large":"檔案大小 {size} 超出 {limit} 限制。","forgot_password_link":"忘記密碼？","full_name_prompt":"全名，例如：王小明","granted_permissions":"已授權","group_has_no_members":"無成員","group_user_id_prompt":"群組或使用者 ID","image_caption_prompt":"圖片說明","invalid_content":"內容無效","invalid_security_token":"安全權杖無效","label_client":"客戶端：","label_content_type":"類型：","label_default_access_mode":"預設存取模式：","label_file_name":"檔名：","label_group_members":"群組成員：","label_incognito_mode":"無痕模式：","label_message_sound":"訊息提示聲：","label_muting_topic":"靜音：","label_other_user":"其他","label_password":"密碼","label_permissions":"權限：","label_private":"私人留言","label_push_notifications":"通知：","label_push_notifications_disabled":"通知 (需要 HTTPS)：","label_reset_password":"傳送重設密碼郵件：","label_sdk":"SDK：","label_server":"伺服器：","label_server_address":"伺服器位址：","label_server_to_use":"使用的伺服器：","label_size":"大小：","label_topic_name":"名稱","label_user_contacts":"聯絡人：","label_user_id":"ID：","label_wire_transport":"Wire transport：","label_you":"您：","label_your_name":"您的名字","label_your_permissions":"您的權限：","last_seen_timestamp":"最後上線","leave_chat_warning":"您確定要離開此對話嗎？","link_contact_us":"聯絡我們","link_privacy_policy":"隱私權政策","link_terms_of_service":"服務條款","login_prompt":"登入","menu_item_archive_topic":"封存","menu_item_block":"封鎖","menu_item_clear_messages":"清除訊息","menu_item_clear_messages_for_all":"為所有人清除訊息","menu_item_delete":"刪除","menu_item_delete_for_all":"為所有人刪除","menu_item_delete_topic":"刪除","menu_item_edit_permissions":"編輯權限","menu_item_info":"Info","menu_item_member_delete":"移除","menu_item_mute":"靜音","menu_item_send_retry":"重試","menu_item_unblock":"解除封鎖","menu_item_unmute":"解除靜音","message_sending":"正在傳送...","message_sending_failed":"失敗","messages_not_readable":"沒有存取訊息的權限","messaging_disabled_prompt":"停用訊息","more_online_members":"+{overflow}","new_message_prompt":"新訊息","new_password_placeholder":"輸入新的密碼","no_connection":"無連線","no_contacts":"您沒有任何聯絡人 :-(","numeric_confirmation_code_prompt":"僅數字","online_now":"上線中","password_prompt":"密碼","password_unchanged_prompt":"未修改","peers_messaging_disabled":"Peer 已停用訊息。","permission_admin":"核可 ({val})","permission_delete":"刪除 ({val})","permission_join":"加入 ({val})","permission_owner":"擁有者 ({val})","permission_pres":"收到通知 ({val})","permission_read":"讀取 ({val})","permission_share":"分享 ({val})","permission_write":"撰寫 ({val})","phone_dative":"phone","private_editing_placeholder":"僅您可見","push_init_failed":"初始化通知失敗。","reconnect_countdown":"已斷線。將在 {seconds} 秒後重新連線…","reconnect_now":"現在重試","reload_update":"重新載入","report_chat_warning":"您確定要封鎖並檢舉此對話嗎？","requested_permissions":"重新請求","save_attachment":"儲存","search_for_contacts":"使用搜尋來尋找聯絡人","search_no_results":"搜尋無結果","search_placeholder":"例如 email:alice@example.com, tel:17025550003... 的清單","sidepanel_title_acc_notifications":"通知","sidepanel_title_acc_support":"支援","sidepanel_title_account_settings":"帳號設定","sidepanel_title_archive":"已封存的對話","sidepanel_title_blocked":"已封鎖的對話","sidepanel_title_cred":"確認認證","sidepanel_title_login":"登入","sidepanel_title_newtpk":"開始新對話","sidepanel_title_register":"建立帳號","sidepanel_title_reset":"重設密碼","sidepanel_title_settings":"設定","stay_logged_in":"保持登入","tabtitle_find_user":"尋找","tabtitle_group_by_id":"以 id","tabtitle_new_group":"新群組","tags_editor_no_tags":"新增一些標籤","tags_not_found":"未定義任何標籤。請新增一些標籤。","title_all_contacts":"所有聯絡人","title_group_members":"群組成員","title_manage_tags":"管理","title_not_found":"找不到","title_permissions":"權限","title_tag_manager":"標籤 (使用者探索)","topic_block_warning":"您確定要封鎖此對話嗎？","topic_delete_warning":"您確定要刪除此對話嗎？","topic_name_editing_placeholder":"群組的任意名稱","unnamed_topic":"未命名","update_available":"有可用的更新。","upload_finishing":"正在完成...","user_not_found":"找不到","validate_credential_action":"確認","topic_delete":"刪除聊天"},"zh":{"action_block_contact":"屏蔽联系人","action_cancel":"取消","action_clear_messages":"删除讯息","action_delete_messages":"删除所有帖子","action_leave_chat":"离开","action_report_chat":"检举垃圾邮件","archived_contacts":"已归档联系人 ({count})","badge_danger":"可疑的","badge_owner":"所有者","badge_staff":"在员工管理下","badge_verified":"值得信赖","badge_you":"你","block_contact_warning":"您确定要阻止此联系人吗？","blocked_contacts_link":"封锁的联络人 ({count})","button_add_another":"加上另一个","button_add_members":"添加成员","button_cancel":"取消","button_confirm":"确认","button_create":"创建","button_delete_account":"删除帐户","button_edit":"编辑","button_logout":"登出","button_ok":"好","button_reset":"重置","button_send_request":"发送请求","button_sign_in":"登录","button_sign_up":"注册","button_subscribe":"订阅","button_update":"更新","cannot_initiate_file_upload":"无法初始化文件上传。","channel":"频道","channel_prompt":"这是一个频道","chat_invitation":"你受邀开始新会话。你想怎么做？","chat_invitation_accept":"接受","chat_invitation_block":"屏蔽","chat_invitation_ignore":"忽略","clear_messages_warning":"您确定要清除所有消息吗？无法撤消。","code_doesnot_match":"代码不匹配","contacts_not_found":"你尚无会话<br />¯∖_(ツ)_/¯","contacts_not_found_short":"无联系人匹配\'\'{query}\'\'","credential_email_prompt":"你的注册邮箱","delete_account":"删除帐户","delete_account_warning":"您确定要删除您的帐户吗？无法撤消。","delete_messages_warning":"您确定要删除所有消息吗？无法撤消。","deleted_content":"内容已删除","download_action":"下载","drafty_attachment":"附件","drafty_form":"形式：","drafty_image":"图像","email_dative":"电子邮件","email_prompt":"电子邮件，例如 zhang@example.com","enable_peers_messaging":"启用","enter_confirmation_code_prompt":"输入通过{method}发送的验证码：","error_invalid_id":"无效 ID","file_attachment_too_large":"文件大小 {size} 超过 {limit} 限制。","forgot_password_link":"忘记密码？","full_name_prompt":"全名，例如张伟","granted_permissions":"已授予","group_has_no_members":"无成员","group_user_id_prompt":"群组或用户 ID","image_caption_prompt":"图片标题","invalid_content":"无效内容","invalid_security_token":"无效的安全令牌","label_client":"客户端：","label_content_type":"内容类型：","label_default_access_mode":"蓦然访问模式：","label_file_name":"文件名：","label_group_members":"群组成员：","label_incognito_mode":"无痕模式：","label_message_sound":"消息提示音：","label_muting_topic":"已静音：","label_other_user":"其他","label_password":"密码","label_permissions":"权限：","label_private":"私人评论","label_push_notifications":"通知提醒：","label_push_notifications_disabled":"通知提醒（需要 HTTPS）：","label_reset_password":"发送密码重置邮件：","label_sdk":"开发包：","label_server":"服务器：","label_server_address":"服务器地址：","label_server_to_use":"使用的服务器：","label_size":"大小：","label_topic_name":"名称","label_user_contacts":"往来：","label_user_id":"地址：","label_wire_transport":"线路传输：","label_you":"你：","label_your_name":"你的姓名","label_your_permissions":"你的权限：","last_seen_timestamp":"最后可见","leave_chat_warning":"您确定要退出此对话吗？","link_contact_us":"联系我们","link_privacy_policy":"隐私政策","link_terms_of_service":"条款和条件","login_prompt":"登录","menu_item_archive_topic":"归档","menu_item_block":"屏蔽","menu_item_clear_messages":"清空消息","menu_item_clear_messages_for_all":"全部清除","menu_item_delete":"删除","menu_item_delete_for_all":"全部删除","menu_item_delete_topic":"删除","menu_item_edit_permissions":"编辑权限","menu_item_info":"信息","menu_item_member_delete":"移除","menu_item_mute":"静音","menu_item_restore_topic":"从存档中恢复","menu_item_send_retry":"重试","menu_item_unblock":"取消屏蔽","menu_item_unmute":"取消静音","message_sending":"正在发送...","message_sending_failed":"发送失败","messages_not_readable":"无消息访问权限","messaging_disabled_prompt":"消息已禁用","more_online_members":"还有{overflow}个","new_message_prompt":"新消息","new_password_placeholder":"输入新密码","no_connection":"无连接","no_contacts":"你尚无联系人 (._.)","numeric_confirmation_code_prompt":"仅数字","online_now":"在线","password_prompt":"密码","password_unchanged_prompt":"未改变","peers_messaging_disabled":"成员间消息已禁用。","permission_admin":"批准 ({val})","permission_delete":"删除 ({val})","permission_join":"加入 ({val})","permission_owner":"所有者 ({val})","permission_pres":"获取通知 ({val})","permission_read":"读取 ({val})","permission_share":"分享 ({val})","permission_write":"写入 ({val})","phone_dative":"电话","private_editing_placeholder":"仅自己可见","push_init_failed":"初始化推送通知失败","reconnect_countdown":"连接已断开。{seconds} 秒后重新连接…","reconnect_now":"立即尝试","reload_update":"重新载入","report_chat_warning":"您确定要停止并报告此对话吗？","requested_permissions":"已请求","save_attachment":"保存","search_for_contacts":"使用搜索寻找联系人","search_no_results":"搜索返回任何结果","search_placeholder":"列表如 email:alice@example.com, tel:+17025550003...","sidepanel_title_acc_notifications":"通知","sidepanel_title_acc_support":"支持","sidepanel_title_account_settings":"帐号设定","sidepanel_title_archive":"已存档会话","sidepanel_title_blocked":"被阻止的聊天","sidepanel_title_cred":"确认凭据","sidepanel_title_login":"登录","sidepanel_title_newtpk":"开始新会话","sidepanel_title_register":"创建账户","sidepanel_title_reset":"重置密码","sidepanel_title_settings":"设置","stay_logged_in":"保持登录","tabtitle_find_user":"搜索","tabtitle_group_by_id":"通过 id","tabtitle_new_group":"新群组","tags_editor_no_tags":"添加一些标签","tags_not_found":"尚未定义标签。添加一些。","title_all_contacts":"全部联系人","title_group_members":"群组成员","title_manage_tags":"管理标签","title_not_found":"无法找到","title_permissions":"权限","title_tag_manager":"标签（用户发现）","topic_block_warning":"您确定要阻止此对话吗？","topic_delete_warning":"您确定要删除此对话吗？","topic_name_editing_placeholder":"群组自由格式名称","unnamed_topic":"未命名","update_available":"更新可用。","upload_finishing":"正在结束...","user_not_found":"未找到","validate_credential_action":"确认","topic_delete":"删除聊天"}}');

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

module.exports = React;

/***/ }),

/***/ "react-dom":
/*!***************************!*\
  !*** external "ReactDOM" ***!
  \***************************/
/***/ ((module) => {

module.exports = ReactDOM;

/***/ }),

/***/ "react-intl":
/*!****************************!*\
  !*** external "ReactIntl" ***!
  \****************************/
/***/ ((module) => {

module.exports = ReactIntl;

/***/ }),

/***/ "tinode-sdk":
/*!*************************!*\
  !*** external "Tinode" ***!
  \*************************/
/***/ ((module) => {

module.exports = Tinode;

/***/ }),

/***/ "firebase/app":
/*!***************************!*\
  !*** external "firebase" ***!
  \***************************/
/***/ ((module) => {

module.exports = firebase;

/***/ }),

/***/ "firebase/messaging":
/*!*****************************************!*\
  !*** external ["firebase","messaging"] ***!
  \*****************************************/
/***/ ((module) => {

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
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
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
react_dom__WEBPACK_IMPORTED_MODULE_1___default().render(react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().StrictMode), null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_2__.IntlProvider, {
  locale: language,
  messages: messages,
  textComponent: (react__WEBPACK_IMPORTED_MODULE_0___default().Fragment)
}, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_views_tinode_web_jsx__WEBPACK_IMPORTED_MODULE_4__.default, null))), document.getElementById('mountPoint'));
})();

/******/ })()
;
//# sourceMappingURL=index.dev.js.map
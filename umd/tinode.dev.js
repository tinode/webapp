(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["tinode"] = factory();
	else
		root["tinode"] = factory();
})(this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/access-mode.js":
/*!****************************!*\
  !*** ./src/access-mode.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AccessMode)
/* harmony export */ });

class AccessMode {
  constructor(acs) {
    if (acs) {
      this.given = typeof acs.given == 'number' ? acs.given : AccessMode.decode(acs.given);
      this.want = typeof acs.want == 'number' ? acs.want : AccessMode.decode(acs.want);
      this.mode = acs.mode ? typeof acs.mode == 'number' ? acs.mode : AccessMode.decode(acs.mode) : this.given & this.want;
    }
  }
  static #checkFlag(val, side, flag) {
    side = side || 'mode';
    if (['given', 'want', 'mode'].includes(side)) {
      return (val[side] & flag) != 0;
    }
    throw new Error(`Invalid AccessMode component '${side}'`);
  }
  static decode(str) {
    if (!str) {
      return null;
    } else if (typeof str == 'number') {
      return str & AccessMode._BITMASK;
    } else if (str === 'N' || str === 'n') {
      return AccessMode._NONE;
    }
    const bitmask = {
      'J': AccessMode._JOIN,
      'R': AccessMode._READ,
      'W': AccessMode._WRITE,
      'P': AccessMode._PRES,
      'A': AccessMode._APPROVE,
      'S': AccessMode._SHARE,
      'D': AccessMode._DELETE,
      'O': AccessMode._OWNER
    };
    let m0 = AccessMode._NONE;
    for (let i = 0; i < str.length; i++) {
      const bit = bitmask[str.charAt(i).toUpperCase()];
      if (!bit) {
        continue;
      }
      m0 |= bit;
    }
    return m0;
  }
  static encode(val) {
    if (val === null || val === AccessMode._INVALID) {
      return null;
    } else if (val === AccessMode._NONE) {
      return 'N';
    }
    const bitmask = ['J', 'R', 'W', 'P', 'A', 'S', 'D', 'O'];
    let res = '';
    for (let i = 0; i < bitmask.length; i++) {
      if ((val & 1 << i) != 0) {
        res = res + bitmask[i];
      }
    }
    return res;
  }
  static update(val, upd) {
    if (!upd || typeof upd != 'string') {
      return val;
    }
    let action = upd.charAt(0);
    if (action == '+' || action == '-') {
      let val0 = val;
      const parts = upd.split(/([-+])/);
      for (let i = 1; i < parts.length - 1; i += 2) {
        action = parts[i];
        const m0 = AccessMode.decode(parts[i + 1]);
        if (m0 == AccessMode._INVALID) {
          return val;
        }
        if (m0 == null) {
          continue;
        }
        if (action === '+') {
          val0 |= m0;
        } else if (action === '-') {
          val0 &= ~m0;
        }
      }
      val = val0;
    } else {
      const val0 = AccessMode.decode(upd);
      if (val0 != AccessMode._INVALID) {
        val = val0;
      }
    }
    return val;
  }
  static diff(a1, a2) {
    a1 = AccessMode.decode(a1);
    a2 = AccessMode.decode(a2);
    if (a1 == AccessMode._INVALID || a2 == AccessMode._INVALID) {
      return AccessMode._INVALID;
    }
    return a1 & ~a2;
  }
  toString() {
    return '{"mode": "' + AccessMode.encode(this.mode) + '", "given": "' + AccessMode.encode(this.given) + '", "want": "' + AccessMode.encode(this.want) + '"}';
  }
  jsonHelper() {
    return {
      mode: AccessMode.encode(this.mode),
      given: AccessMode.encode(this.given),
      want: AccessMode.encode(this.want)
    };
  }
  setMode(m) {
    this.mode = AccessMode.decode(m);
    return this;
  }
  updateMode(u) {
    this.mode = AccessMode.update(this.mode, u);
    return this;
  }
  getMode() {
    return AccessMode.encode(this.mode);
  }
  setGiven(g) {
    this.given = AccessMode.decode(g);
    return this;
  }
  updateGiven(u) {
    this.given = AccessMode.update(this.given, u);
    return this;
  }
  getGiven() {
    return AccessMode.encode(this.given);
  }
  setWant(w) {
    this.want = AccessMode.decode(w);
    return this;
  }
  updateWant(u) {
    this.want = AccessMode.update(this.want, u);
    return this;
  }
  getWant() {
    return AccessMode.encode(this.want);
  }
  getMissing() {
    return AccessMode.encode(this.want & ~this.given);
  }
  getExcessive() {
    return AccessMode.encode(this.given & ~this.want);
  }
  updateAll(val) {
    if (val) {
      this.updateGiven(val.given);
      this.updateWant(val.want);
      this.mode = this.given & this.want;
    }
    return this;
  }
  isOwner(side) {
    return AccessMode.#checkFlag(this, side, AccessMode._OWNER);
  }
  isPresencer(side) {
    return AccessMode.#checkFlag(this, side, AccessMode._PRES);
  }
  isMuted(side) {
    return !this.isPresencer(side);
  }
  isJoiner(side) {
    return AccessMode.#checkFlag(this, side, AccessMode._JOIN);
  }
  isReader(side) {
    return AccessMode.#checkFlag(this, side, AccessMode._READ);
  }
  isWriter(side) {
    return AccessMode.#checkFlag(this, side, AccessMode._WRITE);
  }
  isApprover(side) {
    return AccessMode.#checkFlag(this, side, AccessMode._APPROVE);
  }
  isAdmin(side) {
    return this.isOwner(side) || this.isApprover(side);
  }
  isSharer(side) {
    return this.isAdmin(side) || AccessMode.#checkFlag(this, side, AccessMode._SHARE);
  }
  isDeleter(side) {
    return AccessMode.#checkFlag(this, side, AccessMode._DELETE);
  }
}
AccessMode._NONE = 0x00;
AccessMode._JOIN = 0x01;
AccessMode._READ = 0x02;
AccessMode._WRITE = 0x04;
AccessMode._PRES = 0x08;
AccessMode._APPROVE = 0x10;
AccessMode._SHARE = 0x20;
AccessMode._DELETE = 0x40;
AccessMode._OWNER = 0x80;
AccessMode._BITMASK = AccessMode._JOIN | AccessMode._READ | AccessMode._WRITE | AccessMode._PRES | AccessMode._APPROVE | AccessMode._SHARE | AccessMode._DELETE | AccessMode._OWNER;
AccessMode._INVALID = 0x100000;

/***/ }),

/***/ "./src/cbuffer.js":
/*!************************!*\
  !*** ./src/cbuffer.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CBuffer)
/* harmony export */ });

class CBuffer {
  #comparator = undefined;
  #unique = false;
  buffer = [];
  constructor(compare_, unique_) {
    this.#comparator = compare_ || ((a, b) => {
      return a === b ? 0 : a < b ? -1 : 1;
    });
    this.#unique = unique_;
  }
  #findNearest(elem, arr, exact) {
    let start = 0;
    let end = arr.length - 1;
    let pivot = 0;
    let diff = 0;
    let found = false;
    while (start <= end) {
      pivot = (start + end) / 2 | 0;
      diff = this.#comparator(arr[pivot], elem);
      if (diff < 0) {
        start = pivot + 1;
      } else if (diff > 0) {
        end = pivot - 1;
      } else {
        found = true;
        break;
      }
    }
    if (found) {
      return {
        idx: pivot,
        exact: true
      };
    }
    if (exact) {
      return {
        idx: -1
      };
    }
    return {
      idx: diff < 0 ? pivot + 1 : pivot
    };
  }
  #insertSorted(elem, arr) {
    const found = this.#findNearest(elem, arr, false);
    const count = found.exact && this.#unique ? 1 : 0;
    arr.splice(found.idx, count, elem);
    return arr;
  }
  getAt(at) {
    return this.buffer[at];
  }
  getLast(filter) {
    return filter ? this.buffer.findLast(filter) : this.buffer[this.buffer.length - 1];
  }
  put() {
    let insert;
    if (arguments.length == 1 && Array.isArray(arguments[0])) {
      insert = arguments[0];
    } else {
      insert = arguments;
    }
    for (let idx in insert) {
      this.#insertSorted(insert[idx], this.buffer);
    }
  }
  delAt(at) {
    at |= 0;
    let r = this.buffer.splice(at, 1);
    if (r && r.length > 0) {
      return r[0];
    }
    return undefined;
  }
  delRange(since, before) {
    return this.buffer.splice(since, before - since);
  }
  length() {
    return this.buffer.length;
  }
  reset() {
    this.buffer = [];
  }
  forEach(callback, startIdx, beforeIdx, context) {
    startIdx = Math.max(0, startIdx | 0);
    beforeIdx = Math.min(beforeIdx || this.buffer.length, this.buffer.length);
    for (let i = startIdx; i < beforeIdx; i++) {
      callback.call(context, this.buffer[i], i > startIdx ? this.buffer[i - 1] : undefined, i < beforeIdx - 1 ? this.buffer[i + 1] : undefined, i);
    }
  }
  find(elem, nearest) {
    const {
      idx
    } = this.#findNearest(elem, this.buffer, !nearest);
    return idx;
  }
  filter(callback, context) {
    let count = 0;
    for (let i = 0; i < this.buffer.length; i++) {
      if (callback.call(context, this.buffer[i], i)) {
        this.buffer[count] = this.buffer[i];
        count++;
      }
    }
    this.buffer.splice(count);
  }
  isEmpty() {
    return this.buffer.length == 0;
  }
}

/***/ }),

/***/ "./src/comm-error.js":
/*!***************************!*\
  !*** ./src/comm-error.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CommError)
/* harmony export */ });


class CommError extends Error {
  constructor(message, code) {
    super(`${message} (${code})`);
    this.name = 'CommError';
    this.code = code;
  }
}

/***/ }),

/***/ "./src/config.js":
/*!***********************!*\
  !*** ./src/config.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DEFAULT_MESSAGES_PAGE: () => (/* binding */ DEFAULT_MESSAGES_PAGE),
/* harmony export */   DEL_CHAR: () => (/* binding */ DEL_CHAR),
/* harmony export */   EXPIRE_PROMISES_PERIOD: () => (/* binding */ EXPIRE_PROMISES_PERIOD),
/* harmony export */   EXPIRE_PROMISES_TIMEOUT: () => (/* binding */ EXPIRE_PROMISES_TIMEOUT),
/* harmony export */   LIBRARY: () => (/* binding */ LIBRARY),
/* harmony export */   LOCAL_SEQID: () => (/* binding */ LOCAL_SEQID),
/* harmony export */   MAX_PINNED_COUNT: () => (/* binding */ MAX_PINNED_COUNT),
/* harmony export */   MESSAGE_STATUS_FAILED: () => (/* binding */ MESSAGE_STATUS_FAILED),
/* harmony export */   MESSAGE_STATUS_FATAL: () => (/* binding */ MESSAGE_STATUS_FATAL),
/* harmony export */   MESSAGE_STATUS_NONE: () => (/* binding */ MESSAGE_STATUS_NONE),
/* harmony export */   MESSAGE_STATUS_QUEUED: () => (/* binding */ MESSAGE_STATUS_QUEUED),
/* harmony export */   MESSAGE_STATUS_READ: () => (/* binding */ MESSAGE_STATUS_READ),
/* harmony export */   MESSAGE_STATUS_RECEIVED: () => (/* binding */ MESSAGE_STATUS_RECEIVED),
/* harmony export */   MESSAGE_STATUS_SENDING: () => (/* binding */ MESSAGE_STATUS_SENDING),
/* harmony export */   MESSAGE_STATUS_SENT: () => (/* binding */ MESSAGE_STATUS_SENT),
/* harmony export */   MESSAGE_STATUS_TO_ME: () => (/* binding */ MESSAGE_STATUS_TO_ME),
/* harmony export */   PROTOCOL_VERSION: () => (/* binding */ PROTOCOL_VERSION),
/* harmony export */   RECV_TIMEOUT: () => (/* binding */ RECV_TIMEOUT),
/* harmony export */   TAG_ALIAS: () => (/* binding */ TAG_ALIAS),
/* harmony export */   TAG_EMAIL: () => (/* binding */ TAG_EMAIL),
/* harmony export */   TAG_PHONE: () => (/* binding */ TAG_PHONE),
/* harmony export */   TOPIC_CHAN: () => (/* binding */ TOPIC_CHAN),
/* harmony export */   TOPIC_FND: () => (/* binding */ TOPIC_FND),
/* harmony export */   TOPIC_GRP: () => (/* binding */ TOPIC_GRP),
/* harmony export */   TOPIC_ME: () => (/* binding */ TOPIC_ME),
/* harmony export */   TOPIC_NEW: () => (/* binding */ TOPIC_NEW),
/* harmony export */   TOPIC_NEW_CHAN: () => (/* binding */ TOPIC_NEW_CHAN),
/* harmony export */   TOPIC_P2P: () => (/* binding */ TOPIC_P2P),
/* harmony export */   TOPIC_SLF: () => (/* binding */ TOPIC_SLF),
/* harmony export */   TOPIC_SYS: () => (/* binding */ TOPIC_SYS),
/* harmony export */   USER_NEW: () => (/* binding */ USER_NEW),
/* harmony export */   VERSION: () => (/* binding */ VERSION)
/* harmony export */ });
/* harmony import */ var _version_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../version.js */ "./version.js");



const PROTOCOL_VERSION = '0';
const VERSION = _version_js__WEBPACK_IMPORTED_MODULE_0__.PACKAGE_VERSION || '0.24';
const LIBRARY = 'tinodejs/' + VERSION;
const TOPIC_NEW = 'new';
const TOPIC_NEW_CHAN = 'nch';
const TOPIC_ME = 'me';
const TOPIC_FND = 'fnd';
const TOPIC_SYS = 'sys';
const TOPIC_SLF = 'slf';
const TOPIC_CHAN = 'chn';
const TOPIC_GRP = 'grp';
const TOPIC_P2P = 'p2p';
const USER_NEW = 'new';
const LOCAL_SEQID = 0xFFFFFFF;
const MESSAGE_STATUS_NONE = 0;
const MESSAGE_STATUS_QUEUED = 10;
const MESSAGE_STATUS_SENDING = 20;
const MESSAGE_STATUS_FAILED = 30;
const MESSAGE_STATUS_FATAL = 40;
const MESSAGE_STATUS_SENT = 50;
const MESSAGE_STATUS_RECEIVED = 60;
const MESSAGE_STATUS_READ = 70;
const MESSAGE_STATUS_TO_ME = 80;
const EXPIRE_PROMISES_TIMEOUT = 5000;
const EXPIRE_PROMISES_PERIOD = 1000;
const RECV_TIMEOUT = 100;
const DEFAULT_MESSAGES_PAGE = 24;
const DEL_CHAR = '\u2421';
const MAX_PINNED_COUNT = 5;
const TAG_ALIAS = 'alias:';
const TAG_EMAIL = 'email:';
const TAG_PHONE = 'tel:';

/***/ }),

/***/ "./src/connection.js":
/*!***************************!*\
  !*** ./src/connection.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Connection)
/* harmony export */ });
/* harmony import */ var _comm_error_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./comm-error.js */ "./src/comm-error.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils.js */ "./src/utils.js");




let WebSocketProvider;
let XHRProvider;
const NETWORK_ERROR = 503;
const NETWORK_ERROR_TEXT = "Connection failed";
const NETWORK_USER = 418;
const NETWORK_USER_TEXT = "Disconnected by client";
const _BOFF_BASE = 2000;
const _BOFF_MAX_ITER = 10;
const _BOFF_JITTER = 0.3;
function makeBaseUrl(host, protocol, version, apiKey) {
  let url = null;
  if (['http', 'https', 'ws', 'wss'].includes(protocol)) {
    url = `${protocol}://${host}`;
    if (url.charAt(url.length - 1) !== '/') {
      url += '/';
    }
    url += 'v' + version + '/channels';
    if (['http', 'https'].includes(protocol)) {
      url += '/lp';
    }
    url += '?apikey=' + apiKey;
  }
  return url;
}
class Connection {
  static #log = _ => {};
  #boffTimer = null;
  #boffIteration = 0;
  #boffClosed = false;
  #socket = null;
  host;
  secure;
  apiKey;
  version;
  autoreconnect;
  initialized;
  constructor(config, version_, autoreconnect_) {
    this.host = config.host;
    this.secure = config.secure;
    this.apiKey = config.apiKey;
    this.version = version_;
    this.autoreconnect = autoreconnect_;
    if (config.transport === 'lp') {
      this.#init_lp();
      this.initialized = 'lp';
    } else if (config.transport === 'ws') {
      this.#init_ws();
      this.initialized = 'ws';
    }
    if (!this.initialized) {
      Connection.#log("Unknown or invalid network transport. Running under Node? Call 'Tinode.setNetworkProviders()'.");
      throw new Error("Unknown or invalid network transport. Running under Node? Call 'Tinode.setNetworkProviders()'.");
    }
  }
  static setNetworkProviders(wsProvider, xhrProvider) {
    WebSocketProvider = wsProvider;
    XHRProvider = xhrProvider;
  }
  static set logger(l) {
    Connection.#log = l;
  }
  connect(host_, force) {
    return Promise.reject(null);
  }
  reconnect(force) {}
  disconnect() {}
  sendText(msg) {}
  isConnected() {
    return false;
  }
  transport() {
    return this.initialized;
  }
  probe() {
    this.sendText('1');
  }
  backoffReset() {
    this.#boffReset();
  }
  #boffReconnect() {
    clearTimeout(this.#boffTimer);
    const timeout = _BOFF_BASE * (Math.pow(2, this.#boffIteration) * (1.0 + _BOFF_JITTER * Math.random()));
    this.#boffIteration = this.#boffIteration >= _BOFF_MAX_ITER ? this.#boffIteration : this.#boffIteration + 1;
    if (this.onAutoreconnectIteration) {
      this.onAutoreconnectIteration(timeout);
    }
    this.#boffTimer = setTimeout(_ => {
      Connection.#log(`Reconnecting, iter=${this.#boffIteration}, timeout=${timeout}`);
      if (!this.#boffClosed) {
        const prom = this.connect();
        if (this.onAutoreconnectIteration) {
          this.onAutoreconnectIteration(0, prom);
        } else {
          prom.catch(_ => {});
        }
      } else if (this.onAutoreconnectIteration) {
        this.onAutoreconnectIteration(-1);
      }
    }, timeout);
  }
  #boffStop() {
    clearTimeout(this.#boffTimer);
    this.#boffTimer = null;
  }
  #boffReset() {
    this.#boffIteration = 0;
  }
  #init_lp() {
    const XDR_UNSENT = 0;
    const XDR_OPENED = 1;
    const XDR_HEADERS_RECEIVED = 2;
    const XDR_LOADING = 3;
    const XDR_DONE = 4;
    let _lpURL = null;
    let _poller = null;
    let _sender = null;
    let lp_sender = url_ => {
      const sender = new XHRProvider();
      sender.onreadystatechange = evt => {
        if (sender.readyState == XDR_DONE && sender.status >= 400) {
          throw new _comm_error_js__WEBPACK_IMPORTED_MODULE_0__["default"]("LP sender failed", sender.status);
        }
      };
      sender.open('POST', url_, true);
      return sender;
    };
    let lp_poller = (url_, resolve, reject) => {
      let poller = new XHRProvider();
      let promiseCompleted = false;
      poller.onreadystatechange = evt => {
        if (poller.readyState == XDR_DONE) {
          if (poller.status == 201) {
            let pkt = JSON.parse(poller.responseText, _utils_js__WEBPACK_IMPORTED_MODULE_1__.jsonParseHelper);
            _lpURL = url_ + '&sid=' + pkt.ctrl.params.sid;
            poller = lp_poller(_lpURL);
            poller.send(null);
            if (this.onOpen) {
              this.onOpen();
            }
            if (resolve) {
              promiseCompleted = true;
              resolve();
            }
            if (this.autoreconnect) {
              this.#boffStop();
            }
          } else if (poller.status > 0 && poller.status < 400) {
            if (this.onMessage) {
              this.onMessage(poller.responseText);
            }
            poller = lp_poller(_lpURL);
            poller.send(null);
          } else {
            if (reject && !promiseCompleted) {
              promiseCompleted = true;
              reject(poller.responseText);
            }
            if (this.onMessage && poller.responseText) {
              this.onMessage(poller.responseText);
            }
            if (this.onDisconnect) {
              const code = poller.status || (this.#boffClosed ? NETWORK_USER : NETWORK_ERROR);
              const text = poller.responseText || (this.#boffClosed ? NETWORK_USER_TEXT : NETWORK_ERROR_TEXT);
              this.onDisconnect(new _comm_error_js__WEBPACK_IMPORTED_MODULE_0__["default"](text, code), code);
            }
            poller = null;
            if (!this.#boffClosed && this.autoreconnect) {
              this.#boffReconnect();
            }
          }
        }
      };
      poller.open('POST', url_, true);
      return poller;
    };
    this.connect = (host_, force) => {
      this.#boffClosed = false;
      if (_poller) {
        if (!force) {
          return Promise.resolve();
        }
        _poller.onreadystatechange = undefined;
        _poller.abort();
        _poller = null;
      }
      if (host_) {
        this.host = host_;
      }
      return new Promise((resolve, reject) => {
        const url = makeBaseUrl(this.host, this.secure ? 'https' : 'http', this.version, this.apiKey);
        Connection.#log("LP connecting to:", url);
        _poller = lp_poller(url, resolve, reject);
        _poller.send(null);
      }).catch(err => {
        Connection.#log("LP connection failed:", err);
      });
    };
    this.reconnect = force => {
      this.#boffStop();
      this.connect(null, force);
    };
    this.disconnect = _ => {
      this.#boffClosed = true;
      this.#boffStop();
      if (_sender) {
        _sender.onreadystatechange = undefined;
        _sender.abort();
        _sender = null;
      }
      if (_poller) {
        _poller.onreadystatechange = undefined;
        _poller.abort();
        _poller = null;
      }
      if (this.onDisconnect) {
        this.onDisconnect(new _comm_error_js__WEBPACK_IMPORTED_MODULE_0__["default"](NETWORK_USER_TEXT, NETWORK_USER), NETWORK_USER);
      }
      _lpURL = null;
    };
    this.sendText = msg => {
      _sender = lp_sender(_lpURL);
      if (_sender && _sender.readyState == XDR_OPENED) {
        _sender.send(msg);
      } else {
        throw new Error("Long poller failed to connect");
      }
    };
    this.isConnected = _ => {
      return _poller && true;
    };
  }
  #init_ws() {
    this.connect = (host_, force) => {
      this.#boffClosed = false;
      if (this.#socket) {
        if (!force && this.#socket.readyState == this.#socket.OPEN) {
          this.probe();
          return Promise.resolve();
        }
        this.#socket.close();
        this.#socket = null;
      }
      if (host_) {
        this.host = host_;
      }
      return new Promise((resolve, reject) => {
        const url = makeBaseUrl(this.host, this.secure ? 'wss' : 'ws', this.version, this.apiKey);
        Connection.#log("WS connecting to: ", url);
        const conn = new WebSocketProvider(url);
        conn.onerror = err => {
          reject(err);
        };
        conn.onopen = _ => {
          if (this.autoreconnect) {
            this.#boffStop();
          }
          if (this.onOpen) {
            this.onOpen();
          }
          resolve();
        };
        conn.onclose = _ => {
          this.#socket = null;
          if (this.onDisconnect) {
            const code = this.#boffClosed ? NETWORK_USER : NETWORK_ERROR;
            this.onDisconnect(new _comm_error_js__WEBPACK_IMPORTED_MODULE_0__["default"](this.#boffClosed ? NETWORK_USER_TEXT : NETWORK_ERROR_TEXT, code), code);
          }
          if (!this.#boffClosed && this.autoreconnect) {
            this.#boffReconnect();
          }
        };
        conn.onmessage = evt => {
          if (this.onMessage) {
            this.onMessage(evt.data);
          }
        };
        this.#socket = conn;
      });
    };
    this.reconnect = force => {
      this.#boffStop();
      this.connect(null, force);
    };
    this.disconnect = _ => {
      this.#boffClosed = true;
      this.#boffStop();
      if (!this.#socket) {
        return;
      }
      this.#socket.close();
      this.#socket = null;
    };
    this.sendText = msg => {
      if (this.#socket && this.#socket.readyState == this.#socket.OPEN) {
        this.#socket.send(msg);
      } else {
        throw new Error("Websocket is not connected");
      }
    };
    this.isConnected = _ => {
      return this.#socket && this.#socket.readyState == this.#socket.OPEN;
    };
  }
  onMessage = undefined;
  onDisconnect = undefined;
  onOpen = undefined;
  onAutoreconnectIteration = undefined;
}
Connection.NETWORK_ERROR = NETWORK_ERROR;
Connection.NETWORK_ERROR_TEXT = NETWORK_ERROR_TEXT;
Connection.NETWORK_USER = NETWORK_USER;
Connection.NETWORK_USER_TEXT = NETWORK_USER_TEXT;

/***/ }),

/***/ "./src/db.js":
/*!*******************!*\
  !*** ./src/db.js ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DB)
/* harmony export */ });

const DB_VERSION = 3;
const DB_NAME = 'tinode-web';
let IDBProvider;
class DB {
  #onError = _ => {};
  #logger = _ => {};
  db = null;
  disabled = true;
  constructor(onError, logger) {
    this.#onError = onError || this.#onError;
    this.#logger = logger || this.#logger;
  }
  #mapObjects(source, callback, context) {
    if (!this.db) {
      return disabled ? Promise.resolve([]) : Promise.reject(new Error("not initialized"));
    }
    return new Promise((resolve, reject) => {
      const trx = this.db.transaction([source]);
      trx.onerror = event => {
        this.#logger('PCache', 'mapObjects', source, event.target.error);
        reject(event.target.error);
      };
      trx.objectStore(source).getAll().onsuccess = event => {
        if (callback) {
          event.target.result.forEach(topic => {
            callback.call(context, topic);
          });
        }
        resolve(event.target.result);
      };
    });
  }
  initDatabase() {
    return new Promise((resolve, reject) => {
      const req = IDBProvider.open(DB_NAME, DB_VERSION);
      req.onsuccess = event => {
        this.db = event.target.result;
        this.disabled = false;
        resolve(this.db);
      };
      req.onerror = event => {
        this.#logger('PCache', "failed to initialize", event);
        reject(event.target.error);
        this.#onError(event.target.error);
      };
      req.onupgradeneeded = event => {
        this.db = event.target.result;
        this.db.onerror = event => {
          this.#logger('PCache', "failed to create storage", event);
          this.#onError(event.target.error);
        };
        this.db.createObjectStore('topic', {
          keyPath: 'name'
        });
        this.db.createObjectStore('user', {
          keyPath: 'uid'
        });
        this.db.createObjectStore('subscription', {
          keyPath: ['topic', 'uid']
        });
        this.db.createObjectStore('message', {
          keyPath: ['topic', 'seq']
        });
        const dellog = this.db.createObjectStore('dellog', {
          keyPath: ['topic', 'low', 'hi']
        });
        dellog.createIndex('topic_clear', ['topic', 'clear'], {
          unique: false
        });
      };
    });
  }
  deleteDatabase() {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
    return new Promise((resolve, reject) => {
      const req = IDBProvider.deleteDatabase(DB_NAME);
      req.onblocked = _ => {
        if (this.db) {
          this.db.close();
        }
        const err = new Error("blocked");
        this.#logger('PCache', 'deleteDatabase', err);
        reject(err);
      };
      req.onsuccess = _ => {
        this.db = null;
        this.disabled = true;
        resolve(true);
      };
      req.onerror = event => {
        this.#logger('PCache', 'deleteDatabase', event.target.error);
        reject(event.target.error);
      };
    });
  }
  isReady() {
    return !!this.db;
  }
  updTopic(topic) {
    if (!this.isReady()) {
      return this.disabled ? Promise.resolve() : Promise.reject(new Error("not initialized"));
    }
    return new Promise((resolve, reject) => {
      const trx = this.db.transaction(['topic'], 'readwrite');
      trx.oncomplete = event => {
        resolve(event.target.result);
      };
      trx.onerror = event => {
        this.#logger('PCache', 'updTopic', event.target.error);
        reject(event.target.error);
      };
      const req = trx.objectStore('topic').get(topic.name);
      req.onsuccess = _ => {
        trx.objectStore('topic').put(DB.#serializeTopic(req.result, topic));
        trx.commit();
      };
    });
  }
  markTopicAsDeleted(name, deleted) {
    if (!this.isReady()) {
      return this.disabled ? Promise.resolve() : Promise.reject(new Error("not initialized"));
    }
    return new Promise((resolve, reject) => {
      const trx = this.db.transaction(['topic'], 'readwrite');
      trx.oncomplete = event => {
        resolve(event.target.result);
      };
      trx.onerror = event => {
        this.#logger('PCache', 'markTopicAsDeleted', event.target.error);
        reject(event.target.error);
      };
      const req = trx.objectStore('topic').get(name);
      req.onsuccess = event => {
        const topic = event.target.result;
        if (topic && topic._deleted != deleted) {
          topic._deleted = deleted;
          trx.objectStore('topic').put(topic);
        }
        trx.commit();
      };
    });
  }
  remTopic(name) {
    if (!this.isReady()) {
      return this.disabled ? Promise.resolve() : Promise.reject(new Error("not initialized"));
    }
    return new Promise((resolve, reject) => {
      const trx = this.db.transaction(['topic', 'subscription', 'message'], 'readwrite');
      trx.oncomplete = event => {
        resolve(event.target.result);
      };
      trx.onerror = event => {
        this.#logger('PCache', 'remTopic', event.target.error);
        reject(event.target.error);
      };
      trx.objectStore('topic').delete(IDBKeyRange.only(name));
      trx.objectStore('subscription').delete(IDBKeyRange.bound([name, '-'], [name, '~']));
      trx.objectStore('message').delete(IDBKeyRange.bound([name, 0], [name, Number.MAX_SAFE_INTEGER]));
      trx.commit();
    });
  }
  mapTopics(callback, context) {
    return this.#mapObjects('topic', callback, context);
  }
  deserializeTopic(topic, src) {
    DB.#deserializeTopic(topic, src);
  }
  updUser(uid, pub) {
    if (arguments.length < 2 || pub === undefined) {
      return;
    }
    if (!this.isReady()) {
      return this.disabled ? Promise.resolve() : Promise.reject(new Error("not initialized"));
    }
    return new Promise((resolve, reject) => {
      const trx = this.db.transaction(['user'], 'readwrite');
      trx.oncomplete = event => {
        resolve(event.target.result);
      };
      trx.onerror = event => {
        this.#logger('PCache', 'updUser', event.target.error);
        reject(event.target.error);
      };
      trx.objectStore('user').put({
        uid: uid,
        public: pub
      });
      trx.commit();
    });
  }
  remUser(uid) {
    if (!this.isReady()) {
      return this.disabled ? Promise.resolve() : Promise.reject(new Error("not initialized"));
    }
    return new Promise((resolve, reject) => {
      const trx = this.db.transaction(['user'], 'readwrite');
      trx.oncomplete = event => {
        resolve(event.target.result);
      };
      trx.onerror = event => {
        this.#logger('PCache', 'remUser', event.target.error);
        reject(event.target.error);
      };
      trx.objectStore('user').delete(IDBKeyRange.only(uid));
      trx.commit();
    });
  }
  mapUsers(callback, context) {
    return this.#mapObjects('user', callback, context);
  }
  getUser(uid) {
    if (!this.isReady()) {
      return this.disabled ? Promise.resolve() : Promise.reject(new Error("not initialized"));
    }
    return new Promise((resolve, reject) => {
      const trx = this.db.transaction(['user']);
      trx.oncomplete = event => {
        const user = event.target.result;
        resolve({
          user: user.uid,
          public: user.public
        });
      };
      trx.onerror = event => {
        this.#logger('PCache', 'getUser', event.target.error);
        reject(event.target.error);
      };
      trx.objectStore('user').get(uid);
    });
  }
  updSubscription(topicName, uid, sub) {
    if (!this.isReady()) {
      return this.disabled ? Promise.resolve() : Promise.reject(new Error("not initialized"));
    }
    return new Promise((resolve, reject) => {
      const trx = this.db.transaction(['subscription'], 'readwrite');
      trx.oncomplete = event => {
        resolve(event.target.result);
      };
      trx.onerror = event => {
        this.#logger('PCache', 'updSubscription', event.target.error);
        reject(event.target.error);
      };
      trx.objectStore('subscription').get([topicName, uid]).onsuccess = event => {
        trx.objectStore('subscription').put(DB.#serializeSubscription(event.target.result, topicName, uid, sub));
        trx.commit();
      };
    });
  }
  mapSubscriptions(topicName, callback, context) {
    if (!this.isReady()) {
      return this.disabled ? Promise.resolve([]) : Promise.reject(new Error("not initialized"));
    }
    return new Promise((resolve, reject) => {
      const trx = this.db.transaction(['subscription']);
      trx.onerror = event => {
        this.#logger('PCache', 'mapSubscriptions', event.target.error);
        reject(event.target.error);
      };
      trx.objectStore('subscription').getAll(IDBKeyRange.bound([topicName, '-'], [topicName, '~'])).onsuccess = event => {
        if (callback) {
          event.target.result.forEach(topic => {
            callback.call(context, topic);
          });
        }
        resolve(event.target.result);
      };
    });
  }
  addMessage(msg) {
    if (!this.isReady()) {
      return this.disabled ? Promise.resolve() : Promise.reject(new Error("not initialized"));
    }
    return new Promise((resolve, reject) => {
      const trx = this.db.transaction(['message'], 'readwrite');
      trx.onsuccess = event => {
        resolve(event.target.result);
      };
      trx.onerror = event => {
        this.#logger('PCache', 'addMessage', event.target.error);
        reject(event.target.error);
      };
      trx.objectStore('message').add(DB.#serializeMessage(null, msg));
      trx.commit();
    });
  }
  updMessageStatus(topicName, seq, status) {
    if (!this.isReady()) {
      return this.disabled ? Promise.resolve() : Promise.reject(new Error("not initialized"));
    }
    return new Promise((resolve, reject) => {
      const trx = this.db.transaction(['message'], 'readwrite');
      trx.onsuccess = event => {
        resolve(event.target.result);
      };
      trx.onerror = event => {
        this.#logger('PCache', 'updMessageStatus', event.target.error);
        reject(event.target.error);
      };
      const req = trx.objectStore('message').get(IDBKeyRange.only([topicName, seq]));
      req.onsuccess = event => {
        const src = req.result || event.target.result;
        if (!src || src._status == status) {
          trx.commit();
          return;
        }
        trx.objectStore('message').put(DB.#serializeMessage(src, {
          topic: topicName,
          seq: seq,
          _status: status
        }));
        trx.commit();
      };
    });
  }
  remMessages(topicName, from, to) {
    if (!this.isReady()) {
      return this.disabled ? Promise.resolve() : Promise.reject(new Error("not initialized"));
    }
    return new Promise((resolve, reject) => {
      if (!from && !to) {
        from = 0;
        to = Number.MAX_SAFE_INTEGER;
      }
      const range = to > 0 ? IDBKeyRange.bound([topicName, from], [topicName, to], false, true) : IDBKeyRange.only([topicName, from]);
      const trx = this.db.transaction(['message'], 'readwrite');
      trx.onsuccess = event => {
        resolve(event.target.result);
      };
      trx.onerror = event => {
        this.#logger('PCache', 'remMessages', event.target.error);
        reject(event.target.error);
      };
      trx.objectStore('message').delete(range);
      trx.commit();
    });
  }
  readMessages(topicName, query, callback, context) {
    query = query || {};
    if (!this.isReady()) {
      return this.disabled ? Promise.resolve([]) : Promise.reject(new Error("not initialized"));
    }
    const trx = this.db.transaction(['message']);
    let result = [];
    if (Array.isArray(query.ranges)) {
      return new Promise((resolve, reject) => {
        trx.onerror = event => {
          this.#logger('PCache', 'readMessages', event.target.error);
          reject(event.target.error);
        };
        let count = 0;
        query.ranges.forEach(range => {
          const key = range.hi ? IDBKeyRange.bound([topicName, range.low], [topicName, range.hi], false, true) : IDBKeyRange.only([topicName, range.low]);
          trx.objectStore('message').getAll(key).onsuccess = event => {
            const msgs = event.target.result;
            if (msgs) {
              if (callback) {
                callback.call(context, msgs);
              }
              if (Array.isArray(msgs)) {
                result = result.concat(msgs);
              } else {
                result.push(msgs);
              }
            }
            count++;
            if (count == query.ranges.length) {
              resolve(result);
            }
          };
        });
      });
    }
    return new Promise((resolve, reject) => {
      const since = query.since > 0 ? query.since : 0;
      const before = query.before > 0 ? query.before : Number.MAX_SAFE_INTEGER;
      const limit = query.limit | 0;
      trx.onerror = event => {
        this.#logger('PCache', 'readMessages', event.target.error);
        reject(event.target.error);
      };
      const range = IDBKeyRange.bound([topicName, since], [topicName, before], false, true);
      trx.objectStore('message').openCursor(range, 'prev').onsuccess = event => {
        const cursor = event.target.result;
        if (cursor) {
          if (callback) {
            callback.call(context, cursor.value);
          }
          result.push(cursor.value);
          if (limit <= 0 || result.length < limit) {
            cursor.continue();
          } else {
            resolve(result);
          }
        } else {
          resolve(result);
        }
      };
    });
  }
  addDelLog(topicName, delId, ranges) {
    if (!this.isReady()) {
      return this.disabled ? Promise.resolve() : Promise.reject(new Error("not initialized"));
    }
    return new Promise((resolve, reject) => {
      const trx = this.db.transaction(['dellog'], 'readwrite');
      trx.onsuccess = event => {
        resolve(event.target.result);
      };
      trx.onerror = event => {
        this.#logger('PCache', 'addDelLog', event.target.error);
        reject(event.target.error);
      };
      ranges.forEach(r => trx.objectStore('dellog').add({
        topic: topicName,
        clear: delId,
        low: r.low,
        hi: r.hi || r.low + 1
      }));
      trx.commit();
    });
  }
  readDelLog(topicName, query) {
    query = query || {};
    if (!this.isReady()) {
      return this.disabled ? Promise.resolve([]) : Promise.reject(new Error("not initialized"));
    }
    const trx = this.db.transaction(['dellog']);
    let result = [];
    if (Array.isArray(query.ranges)) {
      return new Promise((resolve, reject) => {
        trx.onerror = event => {
          this.#logger('PCache', 'readDelLog', event.target.error);
          reject(event.target.error);
        };
        let count = 0;
        query.ranges.forEach(range => {
          const hi = range.hi || range.low + 1;
          const key = IDBKeyRange.bound([topicName, 0, range.low], [topicName, hi, Number.MAX_SAFE_INTEGER], false, true);
          trx.objectStore('dellog').getAll(key).onsuccess = event => {
            const entries = event.target.result;
            if (entries) {
              if (Array.isArray(entries)) {
                result = result.concat(entries.map(entry => {
                  return {
                    low: entry.low,
                    hi: entry.hi
                  };
                }));
              } else {
                result.push({
                  low: entries.low,
                  hi: entries.hi
                });
              }
            }
            count++;
            if (count == query.ranges.length) {
              resolve(result);
            }
          };
        });
      });
    }
    return new Promise((resolve, reject) => {
      const since = query.since > 0 ? query.since : 0;
      const before = query.before > 0 ? query.before : Number.MAX_SAFE_INTEGER;
      const limit = query.limit | 0;
      trx.onerror = event => {
        this.#logger('PCache', 'readDelLog', event.target.error);
        reject(event.target.error);
      };
      let count = 0;
      const result = [];
      const range = IDBKeyRange.bound([topicName, 0, since], [topicName, before, Number.MAX_SAFE_INTEGER], false, true);
      trx.objectStore('dellog').openCursor(range, 'prev').onsuccess = event => {
        const cursor = event.target.result;
        if (cursor) {
          result.push({
            low: cursor.value.low,
            hi: cursor.value.hi
          });
          count += cursor.value.hi - cursor.value.low;
          if (limit <= 0 || count < limit) {
            cursor.continue();
          } else {
            resolve(result);
          }
        } else {
          resolve(result);
        }
      };
    });
  }
  maxDelId(topicName) {
    if (!this.isReady()) {
      return this.disabled ? Promise.resolve(0) : Promise.reject(new Error("not initialized"));
    }
    return new Promise((resolve, reject) => {
      const trx = this.db.transaction(['dellog']);
      trx.onerror = event => {
        this.#logger('PCache', 'maxDelId', event.target.error);
        reject(event.target.error);
      };
      const index = trx.objectStore('dellog').index('topic_clear');
      index.openCursor(IDBKeyRange.bound([topicName, 0], [topicName, Number.MAX_SAFE_INTEGER]), 'prev').onsuccess = event => {
        if (event.target.result) {
          resolve(event.target.result.value);
        }
      };
    });
  }
  static #topic_fields = ['created', 'updated', 'deleted', 'touched', 'read', 'recv', 'seq', 'clear', 'defacs', 'creds', 'public', 'trusted', 'private', '_aux', '_deleted'];
  static #deserializeTopic(topic, src) {
    DB.#topic_fields.forEach(f => {
      if (src.hasOwnProperty(f)) {
        topic[f] = src[f];
      }
    });
    if (Array.isArray(src.tags)) {
      topic._tags = src.tags;
    }
    if (src.acs) {
      topic.setAccessMode(src.acs);
    }
    topic.seq |= 0;
    topic.read |= 0;
    topic.unread = Math.max(0, topic.seq - topic.read);
  }
  static #serializeTopic(dst, src) {
    const res = dst || {
      name: src.name
    };
    DB.#topic_fields.forEach(f => {
      if (src.hasOwnProperty(f)) {
        res[f] = src[f];
      }
    });
    if (Array.isArray(src._tags)) {
      res.tags = src._tags;
    }
    if (src.acs) {
      res.acs = src.getAccessMode().jsonHelper();
    }
    return res;
  }
  static #serializeSubscription(dst, topicName, uid, sub) {
    const fields = ['updated', 'mode', 'read', 'recv', 'clear', 'lastSeen', 'userAgent'];
    const res = dst || {
      topic: topicName,
      uid: uid
    };
    fields.forEach(f => {
      if (sub.hasOwnProperty(f)) {
        res[f] = sub[f];
      }
    });
    return res;
  }
  static #serializeMessage(dst, msg) {
    const fields = ['topic', 'seq', 'ts', '_status', 'from', 'head', 'content'];
    const res = dst || {};
    fields.forEach(f => {
      if (msg.hasOwnProperty(f)) {
        res[f] = msg[f];
      }
    });
    return res;
  }
  static setDatabaseProvider(idbProvider) {
    IDBProvider = idbProvider;
  }
}

/***/ }),

/***/ "./src/drafty.js":
/*!***********************!*\
  !*** ./src/drafty.js ***!
  \***********************/
/***/ ((module) => {

/**
 * @copyright 2015-2024 Tinode LLC.
 * @summary Minimally rich text representation and formatting for Tinode.
 * @license Apache 2.0
 *
 * @file Basic parser and formatter for very simple text markup. Mostly targeted at
 * mobile use cases similar to Telegram, WhatsApp, and FB Messenger.
 *
 * <p>Supports conversion of user keyboard input to formatted text:</p>
 * <ul>
 *   <li>*abc* &rarr; <b>abc</b></li>
 *   <li>_abc_ &rarr; <i>abc</i></li>
 *   <li>~abc~ &rarr; <del>abc</del></li>
 *   <li>`abc` &rarr; <tt>abc</tt></li>
 * </ul>
 * Also supports forms and buttons.
 *
 * Nested formatting is supported, e.g. *abc _def_* -> <b>abc <i>def</i></b>
 * URLs, @mentions, and #hashtags are extracted and converted into links.
 * Forms and buttons can be added procedurally.
 * JSON data representation is inspired by Draft.js raw formatting.
 *
 *
 * @example
 * Text:
 * <pre>
 *     this is *bold*, `code` and _italic_, ~strike~
 *     combined *bold and _italic_*
 *     an url: https://www.example.com/abc#fragment and another _www.tinode.co_
 *     this is a @mention and a #hashtag in a string
 *     second #hashtag
 * </pre>
 *
 *  Sample JSON representation of the text above:
 *  {
 *     "txt": "this is bold, code and italic, strike combined bold and italic an url: https://www.example.com/abc#fragment " +
 *             "and another www.tinode.co this is a @mention and a #hashtag in a string second #hashtag",
 *     "fmt": [
 *         { "at":8, "len":4,"tp":"ST" },{ "at":14, "len":4, "tp":"CO" },{ "at":23, "len":6, "tp":"EM"},
 *         { "at":31, "len":6, "tp":"DL" },{ "tp":"BR", "len":1, "at":37 },{ "at":56, "len":6, "tp":"EM" },
 *         { "at":47, "len":15, "tp":"ST" },{ "tp":"BR", "len":1, "at":62 },{ "at":120, "len":13, "tp":"EM" },
 *         { "at":71, "len":36, "key":0 },{ "at":120, "len":13, "key":1 },{ "tp":"BR", "len":1, "at":133 },
 *         { "at":144, "len":8, "key":2 },{ "at":159, "len":8, "key":3 },{ "tp":"BR", "len":1, "at":179 },
 *         { "at":187, "len":8, "key":3 },{ "tp":"BR", "len":1, "at":195 }
 *     ],
 *     "ent": [
 *         { "tp":"LN", "data":{ "url":"https://www.example.com/abc#fragment" } },
 *         { "tp":"LN", "data":{ "url":"http://www.tinode.co" } },
 *         { "tp":"MN", "data":{ "val":"mention" } },
 *         { "tp":"HT", "data":{ "val":"hashtag" } }
 *     ]
 *  }
 */


const MAX_FORM_ELEMENTS = 8;
const MAX_PREVIEW_ATTACHMENTS = 3;
const MAX_PREVIEW_DATA_SIZE = 64;
const JSON_MIME_TYPE = 'application/json';
const DRAFTY_MIME_TYPE = 'text/x-drafty';
const ALLOWED_ENT_FIELDS = ['act', 'height', 'duration', 'incoming', 'mime', 'name', 'premime', 'preref', 'preview', 'ref', 'size', 'state', 'url', 'val', 'width'];
const segmenter = new Intl.Segmenter();
const INLINE_STYLES = [{
  name: 'ST',
  start: /(?:^|[\W_])(\*)[^\s*]/,
  end: /[^\s*](\*)(?=$|[\W_])/
}, {
  name: 'EM',
  start: /(?:^|\W)(_)[^\s_]/,
  end: /[^\s_](_)(?=$|\W)/
}, {
  name: 'DL',
  start: /(?:^|[\W_])(~)[^\s~]/,
  end: /[^\s~](~)(?=$|[\W_])/
}, {
  name: 'CO',
  start: /(?:^|\W)(`)[^`]/,
  end: /[^`](`)(?=$|\W)/
}];
const FMT_WEIGHT = ['QQ'];
const ENTITY_TYPES = [{
  name: 'LN',
  dataName: 'url',
  pack: function (val) {
    if (!/^[a-z]+:\/\//i.test(val)) {
      val = 'http://' + val;
    }
    return {
      url: val
    };
  },
  re: /(?:(?:https?|ftp):\/\/|www\.|ftp\.)[-A-Z0-9+&@#\/%=~_|$?!:,.]*[A-Z0-9+&@#\/%=~_|$]/ig
}, {
  name: 'MN',
  dataName: 'val',
  pack: function (val) {
    return {
      val: val.slice(1)
    };
  },
  re: /\B@([\p{L}\p{N}][._\p{L}\p{N}]*[\p{L}\p{N}])/ug
}, {
  name: 'HT',
  dataName: 'val',
  pack: function (val) {
    return {
      val: val.slice(1)
    };
  },
  re: /\B#([\p{L}\p{N}][._\p{L}\p{N}]*[\p{L}\p{N}])/ug
}];
const FORMAT_TAGS = {
  AU: {
    html_tag: 'audio',
    md_tag: undefined,
    isVoid: false
  },
  BN: {
    html_tag: 'button',
    md_tag: undefined,
    isVoid: false
  },
  BR: {
    html_tag: 'br',
    md_tag: '\n',
    isVoid: true
  },
  CO: {
    html_tag: 'tt',
    md_tag: '`',
    isVoid: false
  },
  DL: {
    html_tag: 'del',
    md_tag: '~',
    isVoid: false
  },
  EM: {
    html_tag: 'i',
    md_tag: '_',
    isVoid: false
  },
  EX: {
    html_tag: '',
    md_tag: undefined,
    isVoid: true
  },
  FM: {
    html_tag: 'div',
    md_tag: undefined,
    isVoid: false
  },
  HD: {
    html_tag: '',
    md_tag: undefined,
    isVoid: false
  },
  HL: {
    html_tag: 'span',
    md_tag: undefined,
    isVoid: false
  },
  HT: {
    html_tag: 'a',
    md_tag: undefined,
    isVoid: false
  },
  IM: {
    html_tag: 'img',
    md_tag: undefined,
    isVoid: false
  },
  LN: {
    html_tag: 'a',
    md_tag: undefined,
    isVoid: false
  },
  MN: {
    html_tag: 'a',
    md_tag: undefined,
    isVoid: false
  },
  RW: {
    html_tag: 'div',
    md_tag: undefined,
    isVoid: false
  },
  QQ: {
    html_tag: 'div',
    md_tag: undefined,
    isVoid: false
  },
  ST: {
    html_tag: 'b',
    md_tag: '*',
    isVoid: false
  },
  VC: {
    html_tag: 'div',
    md_tag: undefined,
    isVoid: false
  },
  VD: {
    html_tag: 'video',
    md_tag: undefined,
    isVoid: false
  }
};
function base64toObjectUrl(b64, contentType, logger) {
  if (!b64) {
    return null;
  }
  try {
    const bin = atob(b64);
    const length = bin.length;
    const buf = new ArrayBuffer(length);
    const arr = new Uint8Array(buf);
    for (let i = 0; i < length; i++) {
      arr[i] = bin.charCodeAt(i);
    }
    return URL.createObjectURL(new Blob([buf], {
      type: contentType
    }));
  } catch (err) {
    if (logger) {
      logger("Drafty: failed to convert object.", err.message);
    }
  }
  return null;
}
function base64toDataUrl(b64, contentType) {
  if (!b64) {
    return null;
  }
  contentType = contentType || 'image/jpeg';
  return 'data:' + contentType + ';base64,' + b64;
}
const DECORATORS = {
  ST: {
    open: _ => '<b>',
    close: _ => '</b>'
  },
  EM: {
    open: _ => '<i>',
    close: _ => '</i>'
  },
  DL: {
    open: _ => '<del>',
    close: _ => '</del>'
  },
  CO: {
    open: _ => '<tt>',
    close: _ => '</tt>'
  },
  BR: {
    open: _ => '<br/>',
    close: _ => ''
  },
  HD: {
    open: _ => '',
    close: _ => ''
  },
  HL: {
    open: _ => '<span style="color:teal">',
    close: _ => '</span>'
  },
  LN: {
    open: data => {
      return '<a href="' + data.url + '">';
    },
    close: _ => '</a>',
    props: data => {
      return data ? {
        href: data.url,
        target: '_blank'
      } : null;
    }
  },
  MN: {
    open: data => {
      return '<a href="#' + data.val + '">';
    },
    close: _ => '</a>',
    props: data => {
      return data ? {
        id: data.val
      } : null;
    }
  },
  HT: {
    open: data => {
      return '<a href="#' + data.val + '">';
    },
    close: _ => '</a>',
    props: data => {
      return data ? {
        id: data.val
      } : null;
    }
  },
  BN: {
    open: _ => '<button>',
    close: _ => '</button>',
    props: data => {
      return data ? {
        'data-act': data.act,
        'data-val': data.val,
        'data-name': data.name,
        'data-ref': data.ref
      } : null;
    }
  },
  AU: {
    open: data => {
      const url = data.ref || base64toObjectUrl(data.val, data.mime, Drafty.logger);
      return '<audio controls src="' + url + '">';
    },
    close: _ => '</audio>',
    props: data => {
      if (!data) return null;
      return {
        src: data.ref || base64toObjectUrl(data.val, data.mime, Drafty.logger),
        'data-preload': data.ref ? 'metadata' : 'auto',
        'data-duration': data.duration,
        'data-name': data.name,
        'data-size': data.val ? data.val.length * 0.75 | 0 : data.size | 0,
        'data-mime': data.mime
      };
    }
  },
  IM: {
    open: data => {
      const tmpPreviewUrl = base64toDataUrl(data._tempPreview, data.mime);
      const previewUrl = base64toObjectUrl(data.val, data.mime, Drafty.logger);
      const downloadUrl = data.ref || previewUrl;
      return (data.name ? '<a href="' + downloadUrl + '" download="' + data.name + '">' : '') + '<img src="' + (tmpPreviewUrl || previewUrl) + '"' + (data.width ? ' width="' + data.width + '"' : '') + (data.height ? ' height="' + data.height + '"' : '') + ' border="0" />';
    },
    close: data => {
      return data.name ? '</a>' : '';
    },
    props: data => {
      if (!data) return null;
      return {
        src: base64toDataUrl(data._tempPreview, data.mime) || data.ref || base64toObjectUrl(data.val, data.mime, Drafty.logger),
        title: data.name,
        alt: data.name,
        'data-width': data.width,
        'data-height': data.height,
        'data-name': data.name,
        'data-size': data.ref ? data.size | 0 : data.val ? data.val.length * 0.75 | 0 : data.size | 0,
        'data-mime': data.mime
      };
    }
  },
  FM: {
    open: _ => '<div>',
    close: _ => '</div>'
  },
  RW: {
    open: _ => '<div>',
    close: _ => '</div>'
  },
  QQ: {
    open: _ => '<div>',
    close: _ => '</div>',
    props: data => {
      return data ? {} : null;
    }
  },
  VC: {
    open: _ => '<div>',
    close: _ => '</div>',
    props: data => {
      if (!data) return {};
      return {
        'data-duration': data.duration,
        'data-state': data.state
      };
    }
  },
  VD: {
    open: data => {
      const tmpPreviewUrl = base64toDataUrl(data._tempPreview, data.mime);
      const previewUrl = data.ref || base64toObjectUrl(data.preview, data.premime || 'image/jpeg', Drafty.logger);
      return '<img src="' + (tmpPreviewUrl || previewUrl) + '"' + (data.width ? ' width="' + data.width + '"' : '') + (data.height ? ' height="' + data.height + '"' : '') + ' border="0" />';
    },
    close: _ => '',
    props: data => {
      if (!data) return null;
      const poster = data.preref || base64toObjectUrl(data.preview, data.premime || 'image/jpeg', Drafty.logger);
      return {
        src: poster,
        'data-src': data.ref || base64toObjectUrl(data.val, data.mime, Drafty.logger),
        'data-width': data.width,
        'data-height': data.height,
        'data-preload': data.ref ? 'metadata' : 'auto',
        'data-preview': poster,
        'data-duration': data.duration | 0,
        'data-name': data.name,
        'data-size': data.ref ? data.size | 0 : data.val ? data.val.length * 0.75 | 0 : data.size | 0,
        'data-mime': data.mime
      };
    }
  }
};
const Drafty = function () {
  this.txt = '';
  this.fmt = [];
  this.ent = [];
};
Drafty.init = function (plainText) {
  if (typeof plainText == 'undefined') {
    plainText = '';
  } else if (typeof plainText != 'string') {
    return null;
  }
  return {
    txt: plainText
  };
};
Drafty.parse = function (content) {
  if (typeof content != 'string') {
    return null;
  }
  const lines = content.split(/\r?\n/);
  const entityMap = [];
  const entityIndex = {};
  const blx = [];
  lines.forEach(line => {
    let spans = [];
    let entities;
    INLINE_STYLES.forEach(tag => {
      spans = spans.concat(spannify(line, tag.start, tag.end, tag.name));
    });
    let block;
    if (spans.length == 0) {
      block = {
        txt: line
      };
    } else {
      spans.sort((a, b) => {
        const diff = a.at - b.at;
        return diff != 0 ? diff : b.end - a.end;
      });
      spans = toSpanTree(spans);
      const chunks = chunkify(line, 0, line.length, spans);
      const drafty = draftify(chunks, 0);
      block = {
        txt: drafty.txt,
        fmt: drafty.fmt
      };
    }
    entities = extractEntities(block.txt);
    if (entities.length > 0) {
      const ranges = [];
      for (let i in entities) {
        const entity = entities[i];
        let index = entityIndex[entity.unique];
        if (!index) {
          index = entityMap.length;
          entityIndex[entity.unique] = index;
          entityMap.push({
            tp: entity.type,
            data: entity.data
          });
        }
        ranges.push({
          at: entity.offset,
          len: entity.len,
          key: index
        });
      }
      block.ent = ranges;
    }
    blx.push(block);
  });
  const result = {
    txt: ''
  };
  if (blx.length > 0) {
    result.txt = blx[0].txt;
    result.fmt = (blx[0].fmt || []).concat(blx[0].ent || []);
    if (result.fmt.length) {
      const segments = segmenter.segment(result.txt);
      for (const ele of result.fmt) {
        ({
          at: ele.at,
          len: ele.len
        } = toGraphemeValues(ele, segments, result.txt));
      }
    }
    for (let i = 1; i < blx.length; i++) {
      const block = blx[i];
      const offset = stringToGraphemes(result.txt).length + 1;
      result.fmt.push({
        tp: 'BR',
        len: 1,
        at: offset - 1
      });
      let segments = {};
      result.txt += ' ' + block.txt;
      if (block.fmt) {
        segments = segmenter.segment(block.txt);
        result.fmt = result.fmt.concat(block.fmt.map(s => {
          const {
            at: correctAt,
            len: correctLen
          } = toGraphemeValues(s, segments, block.txt);
          s.at = correctAt + offset;
          s.len = correctLen;
          return s;
        }));
      }
      if (block.ent) {
        if (isEmptyObject(segments)) {
          segments = segmenter.segment(block.txt);
        }
        result.fmt = result.fmt.concat(block.ent.map(s => {
          const {
            at: correctAt,
            len: correctLen
          } = toGraphemeValues(s, segments, block.txt);
          s.at = correctAt + offset;
          s.len = correctLen;
          return s;
        }));
      }
    }
    if (result.fmt.length == 0) {
      delete result.fmt;
    }
    if (entityMap.length > 0) {
      result.ent = entityMap;
    }
  }
  return result;
};
Drafty.append = function (first, second) {
  if (!first) {
    return second;
  }
  if (!second) {
    return first;
  }
  first.txt = first.txt || '';
  const len = stringToGraphemes(first.txt).length;
  if (typeof second == 'string') {
    first.txt += second;
  } else if (second.txt) {
    first.txt += second.txt;
  }
  if (Array.isArray(second.fmt)) {
    first.fmt = first.fmt || [];
    if (Array.isArray(second.ent)) {
      first.ent = first.ent || [];
    }
    second.fmt.forEach(src => {
      const fmt = {
        at: (src.at | 0) + len,
        len: src.len | 0
      };
      if (src.at == -1) {
        fmt.at = -1;
        fmt.len = 0;
      }
      if (src.tp) {
        fmt.tp = src.tp;
      } else {
        fmt.key = first.ent.length;
        first.ent.push(second.ent[src.key || 0]);
      }
      first.fmt.push(fmt);
    });
  }
  return first;
};
Drafty.insertImage = function (content, at, imageDesc) {
  content = content || {
    txt: ' '
  };
  content.ent = content.ent || [];
  content.fmt = content.fmt || [];
  content.fmt.push({
    at: at | 0,
    len: 1,
    key: content.ent.length
  });
  const ex = {
    tp: 'IM',
    data: {
      mime: imageDesc.mime,
      ref: imageDesc.refurl,
      val: imageDesc.bits || imageDesc.preview,
      width: imageDesc.width,
      height: imageDesc.height,
      name: imageDesc.filename,
      size: imageDesc.size | 0
    }
  };
  if (imageDesc.urlPromise) {
    ex.data._tempPreview = imageDesc._tempPreview;
    ex.data._processing = true;
    imageDesc.urlPromise.then(url => {
      ex.data.ref = url;
      ex.data._tempPreview = undefined;
      ex.data._processing = undefined;
    }, _ => {
      ex.data._processing = undefined;
    });
  }
  content.ent.push(ex);
  return content;
};
Drafty.insertVideo = function (content, at, videoDesc) {
  content = content || {
    txt: ' '
  };
  content.ent = content.ent || [];
  content.fmt = content.fmt || [];
  content.fmt.push({
    at: at | 0,
    len: 1,
    key: content.ent.length
  });
  const ex = {
    tp: 'VD',
    data: {
      mime: videoDesc.mime,
      ref: videoDesc.refurl,
      val: videoDesc.bits,
      preref: videoDesc.preref,
      preview: videoDesc.preview,
      width: videoDesc.width,
      height: videoDesc.height,
      duration: videoDesc.duration | 0,
      name: videoDesc.filename,
      size: videoDesc.size | 0
    }
  };
  if (videoDesc.urlPromise) {
    ex.data._tempPreview = videoDesc._tempPreview;
    ex.data._processing = true;
    videoDesc.urlPromise.then(urls => {
      ex.data.ref = urls[0];
      ex.data.preref = urls[1];
      ex.data._tempPreview = undefined;
      ex.data._processing = undefined;
    }, _ => {
      ex.data._processing = undefined;
    });
  }
  content.ent.push(ex);
  return content;
};
Drafty.insertAudio = function (content, at, audioDesc) {
  content = content || {
    txt: ' '
  };
  content.ent = content.ent || [];
  content.fmt = content.fmt || [];
  content.fmt.push({
    at: at | 0,
    len: 1,
    key: content.ent.length
  });
  const ex = {
    tp: 'AU',
    data: {
      mime: audioDesc.mime,
      val: audioDesc.bits,
      duration: audioDesc.duration | 0,
      preview: audioDesc.preview,
      name: audioDesc.filename,
      size: audioDesc.size | 0,
      ref: audioDesc.refurl
    }
  };
  if (audioDesc.urlPromise) {
    ex.data._processing = true;
    audioDesc.urlPromise.then(url => {
      ex.data.ref = url;
      ex.data._processing = undefined;
    }, _ => {
      ex.data._processing = undefined;
    });
  }
  content.ent.push(ex);
  return content;
};
Drafty.videoCall = function (audioOnly) {
  const content = {
    txt: ' ',
    fmt: [{
      at: 0,
      len: 1,
      key: 0
    }],
    ent: [{
      tp: 'VC',
      data: {
        aonly: audioOnly
      }
    }]
  };
  return content;
};
Drafty.updateVideoCall = function (content, params) {
  const fmt = ((content || {}).fmt || [])[0];
  if (!fmt) {
    return content;
  }
  let ent;
  if (fmt.tp == 'VC') {
    delete fmt.tp;
    fmt.key = 0;
    ent = {
      tp: 'VC'
    };
    content.ent = [ent];
  } else {
    ent = (content.ent || [])[fmt.key | 0];
    if (!ent || ent.tp != 'VC') {
      return content;
    }
  }
  ent.data = ent.data || {};
  Object.assign(ent.data, params);
  return content;
};
Drafty.quote = function (header, uid, body) {
  const quote = Drafty.append(Drafty.appendLineBreak(Drafty.mention(header, uid)), body);
  quote.fmt.push({
    at: 0,
    len: stringToGraphemes(quote.txt).length,
    tp: 'QQ'
  });
  return quote;
};
Drafty.mention = function (name, uid) {
  return {
    txt: name || '',
    fmt: [{
      at: 0,
      len: stringToGraphemes(name || '').length,
      key: 0
    }],
    ent: [{
      tp: 'MN',
      data: {
        val: uid
      }
    }]
  };
};
Drafty.appendLink = function (content, linkData) {
  content = content || {
    txt: ''
  };
  content.ent = content.ent || [];
  content.fmt = content.fmt || [];
  content.fmt.push({
    at: content.txt.length,
    len: linkData.txt.length,
    key: content.ent.length
  });
  content.txt += linkData.txt;
  const ex = {
    tp: 'LN',
    data: {
      url: linkData.url
    }
  };
  content.ent.push(ex);
  return content;
};
Drafty.appendImage = function (content, imageDesc) {
  content = content || {
    txt: ''
  };
  content.txt += ' ';
  return Drafty.insertImage(content, content.txt.length - 1, imageDesc);
};
Drafty.appendAudio = function (content, audioDesc) {
  content = content || {
    txt: ''
  };
  content.txt += ' ';
  return Drafty.insertAudio(content, content.txt.length - 1, audioDesc);
};
Drafty.attachFile = function (content, attachmentDesc) {
  content = content || {
    txt: ''
  };
  content.ent = content.ent || [];
  content.fmt = content.fmt || [];
  content.fmt.push({
    at: -1,
    len: 0,
    key: content.ent.length
  });
  const ex = {
    tp: 'EX',
    data: {
      mime: attachmentDesc.mime,
      val: attachmentDesc.data,
      name: attachmentDesc.filename,
      ref: attachmentDesc.refurl,
      size: attachmentDesc.size | 0
    }
  };
  if (attachmentDesc.urlPromise) {
    ex.data._processing = true;
    attachmentDesc.urlPromise.then(url => {
      ex.data.ref = url;
      ex.data._processing = undefined;
    }, _ => {
      ex.data._processing = undefined;
    });
  }
  content.ent.push(ex);
  return content;
};
Drafty.wrapInto = function (content, style, at, len) {
  if (typeof content == 'string') {
    content = {
      txt: content
    };
  }
  content.fmt = content.fmt || [];
  content.fmt.push({
    at: at || 0,
    len: len || content.txt.length,
    tp: style
  });
  return content;
};
Drafty.wrapAsForm = function (content, at, len) {
  return Drafty.wrapInto(content, 'FM', at, len);
};
Drafty.insertButton = function (content, at, len, name, actionType, actionValue, refUrl) {
  if (typeof content == 'string') {
    content = {
      txt: content
    };
  }
  if (!content || !content.txt || content.txt.length < at + len) {
    return null;
  }
  if (len <= 0 || ['url', 'pub'].indexOf(actionType) == -1) {
    return null;
  }
  if (actionType == 'url' && !refUrl) {
    return null;
  }
  refUrl = '' + refUrl;
  content.ent = content.ent || [];
  content.fmt = content.fmt || [];
  content.fmt.push({
    at: at | 0,
    len: len,
    key: content.ent.length
  });
  content.ent.push({
    tp: 'BN',
    data: {
      act: actionType,
      val: actionValue,
      ref: refUrl,
      name: name
    }
  });
  return content;
};
Drafty.appendButton = function (content, title, name, actionType, actionValue, refUrl) {
  content = content || {
    txt: ''
  };
  const at = content.txt.length;
  content.txt += title;
  return Drafty.insertButton(content, at, title.length, name, actionType, actionValue, refUrl);
};
Drafty.attachJSON = function (content, data) {
  content = content || {
    txt: ''
  };
  content.ent = content.ent || [];
  content.fmt = content.fmt || [];
  content.fmt.push({
    at: -1,
    len: 0,
    key: content.ent.length
  });
  content.ent.push({
    tp: 'EX',
    data: {
      mime: JSON_MIME_TYPE,
      val: data
    }
  });
  return content;
};
Drafty.appendLineBreak = function (content) {
  content = content || {
    txt: ''
  };
  content.fmt = content.fmt || [];
  content.fmt.push({
    at: stringToGraphemes(content.txt).length,
    len: 1,
    tp: 'BR'
  });
  content.txt += ' ';
  return content;
};
Drafty.UNSAFE_toHTML = function (doc) {
  const tree = draftyToTree(doc);
  const htmlFormatter = function (type, data, values) {
    const tag = DECORATORS[type];
    let result = values ? values.join('') : '';
    if (tag) {
      result = tag.open(data) + result + tag.close(data);
    }
    return result;
  };
  return treeBottomUp(tree, htmlFormatter, 0);
};
Drafty.format = function (original, formatter, context) {
  return treeBottomUp(draftyToTree(original), formatter, 0, [], context);
};
Drafty.shorten = function (original, limit, light) {
  let tree = draftyToTree(original);
  tree = shortenTree(tree, limit, '…');
  if (tree && light) {
    tree = lightEntity(tree);
  }
  return treeToDrafty({}, tree, []);
};
Drafty.forwardedContent = function (original) {
  let tree = draftyToTree(original);
  const rmMention = function (node) {
    if (node.type == 'MN') {
      if (!node.parent || !node.parent.type) {
        return null;
      }
    }
    return node;
  };
  tree = treeTopDown(tree, rmMention);
  tree = lTrim(tree);
  return treeToDrafty({}, tree, []);
};
Drafty.replyContent = function (original, limit) {
  const convMNnQQnBR = function (node) {
    if (node.type == 'QQ') {
      return null;
    } else if (node.type == 'MN') {
      if ((!node.parent || !node.parent.type) && (node.text || '').startsWith('➦')) {
        node.text = '➦';
        delete node.children;
        delete node.data;
      }
    } else if (node.type == 'BR') {
      node.text = ' ';
      delete node.type;
      delete node.children;
    }
    return node;
  };
  let tree = draftyToTree(original);
  if (!tree) {
    return original;
  }
  tree = treeTopDown(tree, convMNnQQnBR);
  tree = attachmentsToEnd(tree, MAX_PREVIEW_ATTACHMENTS);
  tree = shortenTree(tree, limit, '…');
  const filter = node => {
    switch (node.type) {
      case 'IM':
        return ['val'];
      case 'VD':
        return ['preview'];
    }
    return null;
  };
  tree = lightEntity(tree, filter);
  return treeToDrafty({}, tree, []);
};
Drafty.preview = function (original, limit, forwarding) {
  let tree = draftyToTree(original);
  tree = attachmentsToEnd(tree, MAX_PREVIEW_ATTACHMENTS);
  const convMNnQQnBR = function (node) {
    if (node.type == 'MN') {
      if ((!node.parent || !node.parent.type) && (node.text || '').startsWith('➦')) {
        node.text = '➦';
        delete node.children;
      }
    } else if (node.type == 'QQ') {
      node.text = ' ';
      delete node.children;
    } else if (node.type == 'BR') {
      node.text = ' ';
      delete node.children;
      delete node.type;
    }
    return node;
  };
  tree = treeTopDown(tree, convMNnQQnBR);
  tree = shortenTree(tree, limit, '…');
  if (forwarding) {
    const filter = {
      IM: ['val'],
      VD: ['preview']
    };
    tree = lightEntity(tree, node => {
      return filter[node.type];
    });
  } else {
    tree = lightEntity(tree);
  }
  return treeToDrafty({}, tree, []);
};
Drafty.toPlainText = function (content) {
  return typeof content == 'string' ? content : content.txt;
};
Drafty.isPlainText = function (content) {
  return typeof content == 'string' || !(content.fmt || content.ent);
};
Drafty.toMarkdown = function (content) {
  let tree = draftyToTree(content);
  const mdFormatter = function (type, _, values) {
    const def = FORMAT_TAGS[type];
    let result = values ? values.join('') : '';
    if (def) {
      if (def.isVoid) {
        result = def.md_tag || '';
      } else if (def.md_tag) {
        result = def.md_tag + result + def.md_tag;
      }
    }
    return result;
  };
  return treeBottomUp(tree, mdFormatter, 0);
};
Drafty.isValid = function (content) {
  if (!content) {
    return false;
  }
  const {
    txt,
    fmt,
    ent
  } = content;
  if (!txt && txt !== '' && !fmt && !ent) {
    return false;
  }
  const txt_type = typeof txt;
  if (txt_type != 'string' && txt_type != 'undefined' && txt !== null) {
    return false;
  }
  if (typeof fmt != 'undefined' && !Array.isArray(fmt) && fmt !== null) {
    return false;
  }
  if (typeof ent != 'undefined' && !Array.isArray(ent) && ent !== null) {
    return false;
  }
  return true;
};
Drafty.hasAttachments = function (content) {
  if (!Array.isArray(content.fmt)) {
    return false;
  }
  for (let i in content.fmt) {
    const fmt = content.fmt[i];
    if (fmt && fmt.at < 0) {
      const ent = content.ent[fmt.key | 0];
      return ent && ent.tp == 'EX' && ent.data;
    }
  }
  return false;
};
Drafty.attachments = function (content, callback, context) {
  if (!Array.isArray(content.fmt)) {
    return;
  }
  let count = 0;
  for (let i in content.fmt) {
    let fmt = content.fmt[i];
    if (fmt && fmt.at < 0) {
      const ent = content.ent[fmt.key | 0];
      if (ent && ent.tp == 'EX' && ent.data) {
        if (callback.call(context, ent.data, count++, 'EX')) {
          break;
        }
      }
    }
  }
  ;
};
Drafty.hasEntities = function (content) {
  return content.ent && content.ent.length > 0;
};
Drafty.entities = function (content, callback, context) {
  if (content.ent && content.ent.length > 0) {
    for (let i in content.ent) {
      if (content.ent[i]) {
        if (callback.call(context, content.ent[i].data, i, content.ent[i].tp)) {
          break;
        }
      }
    }
  }
};
Drafty.styles = function (content, callback, context) {
  if (content.fmt && content.fmt.length > 0) {
    for (let i in content.fmt) {
      const fmt = content.fmt[i];
      if (fmt) {
        if (callback.call(context, fmt.tp, fmt.at, fmt.len, fmt.key, i)) {
          break;
        }
      }
    }
  }
};
Drafty.sanitizeEntities = function (content) {
  if (content && content.ent && content.ent.length > 0) {
    for (let i in content.ent) {
      const ent = content.ent[i];
      if (ent && ent.data) {
        const data = copyEntData(ent.data);
        if (data) {
          content.ent[i].data = data;
        } else {
          delete content.ent[i].data;
        }
      }
    }
  }
  return content;
};
Drafty.getDownloadUrl = function (entData) {
  let url = null;
  if (entData.mime != JSON_MIME_TYPE && entData.val) {
    url = base64toObjectUrl(entData.val, entData.mime, Drafty.logger);
  } else if (typeof entData.ref == 'string') {
    url = entData.ref;
  }
  return url;
};
Drafty.isProcessing = function (entData) {
  return !!entData._processing;
};
Drafty.getPreviewUrl = function (entData) {
  return entData.val ? base64toObjectUrl(entData.val, entData.mime, Drafty.logger) : null;
};
Drafty.getEntitySize = function (entData) {
  return entData.size ? entData.size : entData.val ? entData.val.length * 0.75 | 0 : 0;
};
Drafty.getEntityMimeType = function (entData) {
  return entData.mime || 'text/plain';
};
Drafty.tagName = function (style) {
  return FORMAT_TAGS[style] && FORMAT_TAGS[style].html_tag;
};
Drafty.attrValue = function (style, data) {
  if (data && DECORATORS[style] && DECORATORS[style].props) {
    return DECORATORS[style].props(data);
  }
  return undefined;
};
Drafty.getContentType = function () {
  return DRAFTY_MIME_TYPE;
};
function chunkify(line, start, end, spans) {
  const chunks = [];
  if (spans.length == 0) {
    return [];
  }
  for (let i in spans) {
    const span = spans[i];
    if (span.at > start) {
      chunks.push({
        txt: line.slice(start, span.at)
      });
    }
    const chunk = {
      tp: span.tp
    };
    const chld = chunkify(line, span.at + 1, span.end, span.children);
    if (chld.length > 0) {
      chunk.children = chld;
    } else {
      chunk.txt = span.txt;
    }
    chunks.push(chunk);
    start = span.end + 1;
  }
  if (start < end) {
    chunks.push({
      txt: line.slice(start, end)
    });
  }
  return chunks;
}
function spannify(original, re_start, re_end, type) {
  const result = [];
  let index = 0;
  let line = original.slice(0);
  while (line.length > 0) {
    const start = re_start.exec(line);
    if (start == null) {
      break;
    }
    let start_offset = start['index'] + start[0].lastIndexOf(start[1]);
    line = line.slice(start_offset + 1);
    start_offset += index;
    index = start_offset + 1;
    const end = re_end ? re_end.exec(line) : null;
    if (end == null) {
      break;
    }
    let end_offset = end['index'] + end[0].indexOf(end[1]);
    line = line.slice(end_offset + 1);
    end_offset += index;
    index = end_offset + 1;
    result.push({
      txt: original.slice(start_offset + 1, end_offset),
      children: [],
      at: start_offset,
      end: end_offset,
      tp: type
    });
  }
  return result;
}
function toSpanTree(spans) {
  if (spans.length == 0) {
    return [];
  }
  const tree = [spans[0]];
  let last = spans[0];
  for (let i = 1; i < spans.length; i++) {
    if (spans[i].at > last.end) {
      tree.push(spans[i]);
      last = spans[i];
    } else if (spans[i].end <= last.end) {
      last.children.push(spans[i]);
    }
  }
  for (let i in tree) {
    tree[i].children = toSpanTree(tree[i].children);
  }
  return tree;
}
function draftyToTree(doc) {
  if (!doc) {
    return null;
  }
  doc = typeof doc == 'string' ? {
    txt: doc
  } : doc;
  let {
    txt,
    fmt,
    ent
  } = doc;
  txt = txt || '';
  if (!Array.isArray(ent)) {
    ent = [];
  }
  if (!Array.isArray(fmt) || fmt.length == 0) {
    if (ent.length == 0) {
      return {
        text: txt
      };
    }
    fmt = [{
      at: 0,
      len: 0,
      key: 0
    }];
  }
  const spans = [];
  const attachments = [];
  fmt.forEach(span => {
    if (!span || typeof span != 'object') {
      return;
    }
    if (!['undefined', 'number'].includes(typeof span.at)) {
      return;
    }
    if (!['undefined', 'number'].includes(typeof span.len)) {
      return;
    }
    let at = span.at | 0;
    let len = span.len | 0;
    if (len < 0) {
      return;
    }
    let key = span.key || 0;
    if (ent.length > 0 && (typeof key != 'number' || key < 0 || key >= ent.length)) {
      return;
    }
    if (at <= -1) {
      attachments.push({
        start: -1,
        end: 0,
        key: key
      });
      return;
    } else if (at + len > stringToGraphemes(txt).length) {
      return;
    }
    if (!span.tp) {
      if (ent.length > 0 && typeof ent[key] == 'object') {
        spans.push({
          start: at,
          end: at + len,
          key: key
        });
      }
    } else {
      spans.push({
        type: span.tp,
        start: at,
        end: at + len
      });
    }
  });
  spans.sort((a, b) => {
    let diff = a.start - b.start;
    if (diff != 0) {
      return diff;
    }
    diff = b.end - a.end;
    if (diff != 0) {
      return diff;
    }
    return FMT_WEIGHT.indexOf(b.type) - FMT_WEIGHT.indexOf(a.type);
  });
  if (attachments.length > 0) {
    spans.push(...attachments);
  }
  spans.forEach(span => {
    if (ent.length > 0 && !span.type && ent[span.key] && typeof ent[span.key] == 'object') {
      span.type = ent[span.key].tp;
      span.data = ent[span.key].data;
    }
    if (!span.type) {
      span.type = 'HD';
    }
  });
  const graphemes = stringToGraphemes(txt);
  let tree = spansToTree({}, graphemes, 0, graphemes.length, spans);
  const flatten = function (node) {
    if (Array.isArray(node.children) && node.children.length == 1) {
      const child = node.children[0];
      if (!node.type) {
        const parent = node.parent;
        node = child;
        node.parent = parent;
      } else if (!child.type && !child.children) {
        node.text = child.text;
        delete node.children;
      }
    }
    return node;
  };
  tree = treeTopDown(tree, flatten);
  return tree;
}
function addNode(parent, n) {
  if (!n) {
    return parent;
  }
  if (!parent.children) {
    parent.children = [];
  }
  if (parent.text) {
    parent.children.push({
      text: parent.text,
      parent: parent
    });
    delete parent.text;
  }
  n.parent = parent;
  parent.children.push(n);
  return parent;
}
function spansToTree(parent, graphemes, start, end, spans) {
  if (!spans || spans.length == 0) {
    if (start < end) {
      addNode(parent, {
        text: graphemes.slice(start, end).map(segment => segment.segment).join('')
      });
    }
    return parent;
  }
  for (let i = 0; i < spans.length; i++) {
    const span = spans[i];
    if (span.start < 0 && span.type == 'EX') {
      addNode(parent, {
        type: span.type,
        data: span.data,
        key: span.key,
        att: true
      });
      continue;
    }
    if (start < span.start) {
      addNode(parent, {
        text: graphemes.slice(start, span.start).map(segment => segment.segment).join('')
      });
      start = span.start;
    }
    const subspans = [];
    while (i < spans.length - 1) {
      const inner = spans[i + 1];
      if (inner.start < 0) {
        break;
      } else if (inner.start < span.end) {
        if (inner.end <= span.end) {
          const tag = FORMAT_TAGS[inner.tp] || {};
          if (inner.start < inner.end || tag.isVoid) {
            subspans.push(inner);
          }
        }
        i++;
      } else {
        break;
      }
    }
    addNode(parent, spansToTree({
      type: span.type,
      data: span.data,
      key: span.key
    }, graphemes, start, span.end, subspans));
    start = span.end;
  }
  if (start < end) {
    addNode(parent, {
      text: graphemes.slice(start, end).map(segment => segment.segment).join('')
    });
  }
  return parent;
}
function treeToDrafty(doc, tree, keymap) {
  if (!tree) {
    return doc;
  }
  doc.txt = doc.txt || '';
  const start = stringToGraphemes(doc.txt).length;
  if (tree.text) {
    doc.txt += tree.text;
  } else if (Array.isArray(tree.children)) {
    tree.children.forEach(c => {
      treeToDrafty(doc, c, keymap);
    });
  }
  if (tree.type) {
    const len = stringToGraphemes(doc.txt).length - start;
    doc.fmt = doc.fmt || [];
    if (Object.keys(tree.data || {}).length > 0) {
      doc.ent = doc.ent || [];
      const newKey = typeof keymap[tree.key] == 'undefined' ? doc.ent.length : keymap[tree.key];
      keymap[tree.key] = newKey;
      doc.ent[newKey] = {
        tp: tree.type,
        data: tree.data
      };
      if (tree.att) {
        doc.fmt.push({
          at: -1,
          len: 0,
          key: newKey
        });
      } else {
        doc.fmt.push({
          at: start,
          len: len,
          key: newKey
        });
      }
    } else {
      doc.fmt.push({
        tp: tree.type,
        at: start,
        len: len
      });
    }
  }
  return doc;
}
function treeTopDown(src, transformer, context) {
  if (!src) {
    return null;
  }
  let dst = transformer.call(context, src);
  if (!dst || !dst.children) {
    return dst;
  }
  const children = [];
  for (let i in dst.children) {
    let n = dst.children[i];
    if (n) {
      n = treeTopDown(n, transformer, context);
      if (n) {
        children.push(n);
      }
    }
  }
  if (children.length == 0) {
    dst.children = null;
  } else {
    dst.children = children;
  }
  return dst;
}
function treeBottomUp(src, formatter, index, stack, context) {
  if (!src) {
    return null;
  }
  if (stack && src.type) {
    stack.push(src.type);
  }
  let values = [];
  for (let i in src.children) {
    const n = treeBottomUp(src.children[i], formatter, i, stack, context);
    if (n) {
      values.push(n);
    }
  }
  if (values.length == 0) {
    if (src.text) {
      values = [src.text];
    } else {
      values = null;
    }
  }
  if (stack && src.type) {
    stack.pop();
  }
  return formatter.call(context, src.type, src.data, values, index, stack);
}
function shortenTree(tree, limit, tail) {
  if (!tree) {
    return null;
  }
  if (tail) {
    limit -= tail.length;
  }
  const shortener = function (node) {
    if (limit <= -1) {
      return null;
    }
    if (node.att) {
      return node;
    }
    if (limit == 0) {
      node.text = tail;
      limit = -1;
    } else if (node.text) {
      const graphemes = stringToGraphemes(node.text);
      if (graphemes.length > limit) {
        node.text = graphemes.slice(0, limit).map(segment => segment.segment).join('') + tail;
        limit = -1;
      } else {
        limit -= graphemes.length;
      }
    }
    return node;
  };
  return treeTopDown(tree, shortener);
}
function lightEntity(tree, allow) {
  const lightCopy = node => {
    const data = copyEntData(node.data, true, allow ? allow(node) : null);
    if (data) {
      node.data = data;
    } else {
      delete node.data;
    }
    return node;
  };
  return treeTopDown(tree, lightCopy);
}
function lTrim(tree) {
  if (tree.type == 'BR') {
    tree = null;
  } else if (tree.text) {
    if (!tree.type) {
      tree.text = tree.text.trimStart();
      if (!tree.text) {
        tree = null;
      }
    }
  } else if (!tree.type && tree.children && tree.children.length > 0) {
    const c = lTrim(tree.children[0]);
    if (c) {
      tree.children[0] = c;
    } else {
      tree.children.shift();
      if (!tree.type && tree.children.length == 0) {
        tree = null;
      }
    }
  }
  return tree;
}
function attachmentsToEnd(tree, limit) {
  if (!tree) {
    return null;
  }
  if (tree.att) {
    tree.text = ' ';
    delete tree.att;
    delete tree.children;
  } else if (tree.children) {
    const attachments = [];
    const children = [];
    for (let i in tree.children) {
      const c = tree.children[i];
      if (c.att) {
        if (attachments.length == limit) {
          continue;
        }
        if (c.data['mime'] == JSON_MIME_TYPE) {
          continue;
        }
        delete c.att;
        delete c.children;
        c.text = ' ';
        attachments.push(c);
      } else {
        children.push(c);
      }
    }
    tree.children = children.concat(attachments);
  }
  return tree;
}
function extractEntities(line) {
  let match;
  let extracted = [];
  ENTITY_TYPES.forEach(entity => {
    while ((match = entity.re.exec(line)) !== null) {
      extracted.push({
        offset: match['index'],
        len: match[0].length,
        unique: match[0],
        data: entity.pack(match[0]),
        type: entity.name
      });
    }
  });
  if (extracted.length == 0) {
    return extracted;
  }
  extracted.sort((a, b) => {
    return a.offset - b.offset;
  });
  let idx = -1;
  extracted = extracted.filter(el => {
    const result = el.offset > idx;
    idx = el.offset + el.len;
    return result;
  });
  return extracted;
}
function draftify(chunks, startAt) {
  let plain = '';
  let ranges = [];
  for (let i in chunks) {
    const chunk = chunks[i];
    if (!chunk.txt) {
      const drafty = draftify(chunk.children, plain.length + startAt);
      chunk.txt = drafty.txt;
      ranges = ranges.concat(drafty.fmt);
    }
    if (chunk.tp) {
      ranges.push({
        at: plain.length + startAt,
        len: chunk.txt.length,
        tp: chunk.tp
      });
    }
    plain += chunk.txt;
  }
  return {
    txt: plain,
    fmt: ranges
  };
}
function copyEntData(data, light, allow) {
  if (data && Object.entries(data).length > 0) {
    allow = allow || [];
    const dc = {};
    ALLOWED_ENT_FIELDS.forEach(key => {
      if (data[key]) {
        if (light && !allow.includes(key) && (typeof data[key] == 'string' || Array.isArray(data[key])) && data[key].length > MAX_PREVIEW_DATA_SIZE) {
          return;
        }
        if (typeof data[key] == 'object') {
          return;
        }
        dc[key] = data[key];
      }
    });
    if (Object.entries(dc).length != 0) {
      return dc;
    }
  }
  return null;
}
function isEmptyObject(obj) {
  return Object.keys(obj ?? {}).length == 0;
}
;
function graphemeIndices(graphemes) {
  const result = [];
  let graphemeIndex = 0;
  let charIndex = 0;
  for (const {
    segment
  } of graphemes) {
    for (let i = 0; i < segment.length; i++) {
      result[charIndex + i] = graphemeIndex;
    }
    charIndex += segment.length;
    graphemeIndex++;
  }
  return result;
}
function toGraphemeValues(fmt, segments, txt) {
  segments = segments ?? segmenter.segment(txt);
  const indices = graphemeIndices(segments);
  const correctAt = indices[fmt.at];
  const correctLen = fmt.at + fmt.len <= txt.length ? indices[fmt.at + fmt.len - 1] - correctAt : fmt.len;
  return {
    at: correctAt,
    len: correctLen + 1
  };
}
function stringToGraphemes(str) {
  return Array.from(segmenter.segment(str));
}
if (true) {
  module.exports = Drafty;
}

/***/ }),

/***/ "./src/fnd-topic.js":
/*!**************************!*\
  !*** ./src/fnd-topic.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TopicFnd)
/* harmony export */ });
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./config.js */ "./src/config.js");
/* harmony import */ var _topic_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./topic.js */ "./src/topic.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils.js */ "./src/utils.js");





class TopicFnd extends _topic_js__WEBPACK_IMPORTED_MODULE_1__["default"] {
  _contacts = {};
  constructor(callbacks) {
    super(_config_js__WEBPACK_IMPORTED_MODULE_0__.TOPIC_FND, callbacks);
  }
  _processMetaSubs(subs) {
    let updateCount = Object.getOwnPropertyNames(this._contacts).length;
    this._contacts = {};
    for (let idx in subs) {
      let sub = subs[idx];
      const indexBy = sub.topic ? sub.topic : sub.user;
      sub = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.mergeToCache)(this._contacts, indexBy, sub);
      updateCount++;
      if (this.onMetaSub) {
        this.onMetaSub(sub);
      }
    }
    if (updateCount > 0 && this.onSubsUpdated) {
      this.onSubsUpdated(Object.keys(this._contacts));
    }
  }
  publish() {
    return Promise.reject(new Error("Publishing to 'fnd' is not supported"));
  }
  setMeta(params) {
    return Object.getPrototypeOf(TopicFnd.prototype).setMeta.call(this, params).then(_ => {
      if (Object.keys(this._contacts).length > 0) {
        this._contacts = {};
        if (this.onSubsUpdated) {
          this.onSubsUpdated([]);
        }
      }
    });
  }
  checkTagUniqueness(tag, caller) {
    return new Promise((resolve, reject) => {
      this.subscribe().then(_ => this.setMeta({
        desc: {
          public: tag
        }
      })).then(_ => this.getMeta(this.startMetaQuery().withTags().build())).then(meta => {
        if (!meta || !Array.isArray(meta.tags) || meta.tags.length == 0) {
          resolve(true);
        }
        const tags = meta.tags.filter(t => t !== caller);
        resolve(tags.length == 0);
      }).catch(err => {
        reject(err);
      });
    });
  }
  contacts(callback, context) {
    const cb = callback || this.onMetaSub;
    if (cb) {
      for (let idx in this._contacts) {
        cb.call(context, this._contacts[idx], idx, this._contacts);
      }
    }
  }
}

/***/ }),

/***/ "./src/large-file.js":
/*!***************************!*\
  !*** ./src/large-file.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LargeFileHelper)
/* harmony export */ });
/* harmony import */ var _comm_error_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./comm-error.js */ "./src/comm-error.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils.js */ "./src/utils.js");




let XHRProvider;
function addURLParam(relUrl, key, value) {
  const url = new URL(relUrl, window.location.origin);
  url.searchParams.append(key, value);
  return url.toString().substring(window.location.origin.length);
}
class LargeFileHelper {
  constructor(tinode, version) {
    this._tinode = tinode;
    this._version = version;
    this._apiKey = tinode._apiKey;
    this._authToken = tinode.getAuthToken();
    this.xhr = [];
  }
  uploadWithBaseUrl(baseUrl, data, avatarFor, onProgress, onSuccess, onFailure) {
    let url = `/v${this._version}/file/u/`;
    if (baseUrl) {
      let base = baseUrl;
      if (base.endsWith('/')) {
        base = base.slice(0, -1);
      }
      if (base.startsWith('http://') || base.startsWith('https://')) {
        url = base + url;
      } else {
        throw new Error(`Invalid base URL '${baseUrl}'`);
      }
    }
    const instance = this;
    const xhr = new XHRProvider();
    this.xhr.push(xhr);
    xhr.open('POST', url, true);
    xhr.setRequestHeader('X-Tinode-APIKey', this._apiKey);
    if (this._authToken) {
      xhr.setRequestHeader('X-Tinode-Auth', `Token ${this._authToken.token}`);
    }
    let toResolve = null;
    let toReject = null;
    const result = new Promise((resolve, reject) => {
      toResolve = resolve;
      toReject = reject;
    });
    xhr.upload.onprogress = e => {
      if (e.lengthComputable) {
        if (onProgress) {
          onProgress(e.loaded / e.total);
        }
        if (this.onProgress) {
          this.onProgress(e.loaded / e.total);
        }
      }
    };
    xhr.onload = function () {
      let pkt;
      try {
        pkt = JSON.parse(this.response, _utils_js__WEBPACK_IMPORTED_MODULE_1__.jsonParseHelper);
      } catch (err) {
        instance._tinode.logger("ERROR: Invalid server response in LargeFileHelper", this.response);
        pkt = {
          ctrl: {
            code: this.status,
            text: this.statusText
          }
        };
      }
      if (this.status >= 200 && this.status < 300) {
        if (toResolve) {
          toResolve(pkt.ctrl.params.url);
        }
        if (onSuccess) {
          onSuccess(pkt.ctrl);
        }
      } else if (this.status >= 400) {
        if (toReject) {
          toReject(new _comm_error_js__WEBPACK_IMPORTED_MODULE_0__["default"](pkt.ctrl.text, pkt.ctrl.code));
        }
        if (onFailure) {
          onFailure(pkt.ctrl);
        }
      } else {
        instance._tinode.logger("ERROR: Unexpected server response status", this.status, this.response);
      }
    };
    xhr.onerror = function (e) {
      if (toReject) {
        toReject(e || new Error("failed"));
      }
      if (onFailure) {
        onFailure(null);
      }
    };
    xhr.onabort = function (e) {
      if (toReject) {
        toReject(new Error("upload cancelled by user"));
      }
      if (onFailure) {
        onFailure(null);
      }
    };
    try {
      const form = new FormData();
      form.append('file', data);
      form.set('id', this._tinode.getNextUniqueId());
      if (avatarFor) {
        form.set('topic', avatarFor);
      }
      xhr.send(form);
    } catch (err) {
      if (toReject) {
        toReject(err);
      }
      if (onFailure) {
        onFailure(null);
      }
    }
    return result;
  }
  upload(data, avatarFor, onProgress, onSuccess, onFailure) {
    const baseUrl = (this._tinode._secure ? 'https://' : 'http://') + this._tinode._host;
    return this.uploadWithBaseUrl(baseUrl, data, avatarFor, onProgress, onSuccess, onFailure);
  }
  download(relativeUrl, filename, mimetype, onProgress, onError) {
    if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isUrlRelative)(relativeUrl)) {
      if (onError) {
        onError(`The URL '${relativeUrl}' must be relative, not absolute`);
      }
      return;
    }
    if (!this._authToken) {
      if (onError) {
        onError("Must authenticate first");
      }
      return;
    }
    const instance = this;
    const xhr = new XHRProvider();
    this.xhr.push(xhr);
    relativeUrl = addURLParam(relativeUrl, 'asatt', '1');
    xhr.open('GET', relativeUrl, true);
    xhr.setRequestHeader('X-Tinode-APIKey', this._apiKey);
    xhr.setRequestHeader('X-Tinode-Auth', 'Token ' + this._authToken.token);
    xhr.responseType = 'blob';
    xhr.onprogress = function (e) {
      if (onProgress) {
        onProgress(e.loaded);
      }
    };
    let toResolve = null;
    let toReject = null;
    const result = new Promise((resolve, reject) => {
      toResolve = resolve;
      toReject = reject;
    });
    xhr.onload = function () {
      if (this.status == 200) {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(new Blob([this.response], {
          type: mimetype
        }));
        link.style.display = 'none';
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(link.href);
        if (toResolve) {
          toResolve();
        }
      } else if (this.status >= 400 && toReject) {
        const reader = new FileReader();
        reader.onload = function () {
          try {
            const pkt = JSON.parse(this.result, _utils_js__WEBPACK_IMPORTED_MODULE_1__.jsonParseHelper);
            toReject(new _comm_error_js__WEBPACK_IMPORTED_MODULE_0__["default"](pkt.ctrl.text, pkt.ctrl.code));
          } catch (err) {
            instance._tinode.logger("ERROR: Invalid server response in LargeFileHelper", this.result);
            toReject(err);
          }
        };
        reader.readAsText(this.response);
      }
    };
    xhr.onerror = function (e) {
      if (toReject) {
        toReject(new Error("failed"));
      }
      if (onError) {
        onError(e);
      }
    };
    xhr.onabort = function () {
      if (toReject) {
        toReject(null);
      }
    };
    try {
      xhr.send();
    } catch (err) {
      if (toReject) {
        toReject(err);
      }
      if (onError) {
        onError(err);
      }
    }
    return result;
  }
  cancel() {
    this.xhr.forEach(req => {
      if (req.readyState < 4) {
        req.abort();
      }
    });
  }
  static setNetworkProvider(xhrProvider) {
    XHRProvider = xhrProvider;
  }
}

/***/ }),

/***/ "./src/me-topic.js":
/*!*************************!*\
  !*** ./src/me-topic.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TopicMe)
/* harmony export */ });
/* harmony import */ var _access_mode_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./access-mode.js */ "./src/access-mode.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./config.js */ "./src/config.js");
/* harmony import */ var _topic_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./topic.js */ "./src/topic.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils.js */ "./src/utils.js");






class TopicMe extends _topic_js__WEBPACK_IMPORTED_MODULE_2__["default"] {
  onContactUpdate;
  constructor(callbacks) {
    super(_config_js__WEBPACK_IMPORTED_MODULE_1__.TOPIC_ME, callbacks);
    if (callbacks) {
      this.onContactUpdate = callbacks.onContactUpdate;
    }
  }
  _processMetaDesc(desc) {
    const turnOff = desc.acs && !desc.acs.isPresencer() && this.acs && this.acs.isPresencer();
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.mergeObj)(this, desc);
    this._tinode._db.updTopic(this);
    this._updateCachedUser(this._tinode._myUID, desc);
    if (turnOff) {
      this._tinode.mapTopics(cont => {
        if (cont.online) {
          cont.online = false;
          cont.seen = Object.assign(cont.seen || {}, {
            when: new Date()
          });
          this._refreshContact('off', cont);
        }
      });
    }
    if (this.onMetaDesc) {
      this.onMetaDesc(this);
    }
  }
  _processMetaSubs(subs) {
    let updateCount = 0;
    subs.forEach(sub => {
      const topicName = sub.topic;
      if (topicName == _config_js__WEBPACK_IMPORTED_MODULE_1__.TOPIC_FND || topicName == _config_js__WEBPACK_IMPORTED_MODULE_1__.TOPIC_ME) {
        return;
      }
      sub.online = !!sub.online;
      let cont = null;
      if (sub.deleted) {
        cont = sub;
        this._tinode.cacheRemTopic(topicName);
        this._tinode._db.remTopic(topicName);
      } else {
        if (typeof sub.seq != 'undefined') {
          sub.seq = sub.seq | 0;
          sub.recv = sub.recv | 0;
          sub.read = sub.read | 0;
          sub.unread = sub.seq - sub.read;
        }
        const topic = this._tinode.getTopic(topicName);
        if (topic._new) {
          delete topic._new;
        }
        cont = (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.mergeObj)(topic, sub);
        this._tinode._db.updTopic(cont);
        if (_topic_js__WEBPACK_IMPORTED_MODULE_2__["default"].isP2PTopicName(topicName)) {
          this._cachePutUser(topicName, cont);
          this._tinode._db.updUser(topicName, cont.public);
        }
        if (!sub._noForwarding && topic) {
          sub._noForwarding = true;
          topic._processMetaDesc(sub);
        }
      }
      updateCount++;
      if (this.onMetaSub) {
        this.onMetaSub(cont);
      }
    });
    if (this.onSubsUpdated && updateCount > 0) {
      const keys = [];
      subs.forEach(s => {
        keys.push(s.topic);
      });
      this.onSubsUpdated(keys, updateCount);
    }
  }
  _processMetaCreds(creds, upd) {
    if (creds.length == 1 && creds[0] == _config_js__WEBPACK_IMPORTED_MODULE_1__.DEL_CHAR) {
      creds = [];
    }
    if (upd) {
      creds.forEach(cr => {
        if (cr.val) {
          let idx = this._credentials.findIndex(el => {
            return el.meth == cr.meth && el.val == cr.val;
          });
          if (idx < 0) {
            if (!cr.done) {
              idx = this._credentials.findIndex(el => {
                return el.meth == cr.meth && !el.done;
              });
              if (idx >= 0) {
                this._credentials.splice(idx, 1);
              }
            }
            this._credentials.push(cr);
          } else {
            this._credentials[idx].done = cr.done;
          }
        } else if (cr.resp) {
          const idx = this._credentials.findIndex(el => {
            return el.meth == cr.meth && !el.done;
          });
          if (idx >= 0) {
            this._credentials[idx].done = true;
          }
        }
      });
    } else {
      this._credentials = creds;
    }
    if (this.onCredsUpdated) {
      this.onCredsUpdated(this._credentials);
    }
  }
  _routePres(pres) {
    if (pres.what == 'term') {
      this._resetSub();
      return;
    }
    if (pres.what == 'upd' && pres.src == _config_js__WEBPACK_IMPORTED_MODULE_1__.TOPIC_ME) {
      this.getMeta(this.startMetaQuery().withDesc().build());
      return;
    }
    const cont = this._tinode.cacheGetTopic(pres.src);
    if (cont) {
      switch (pres.what) {
        case 'on':
          cont.online = true;
          break;
        case 'off':
          if (cont.online) {
            cont.online = false;
            cont.seen = Object.assign(cont.seen || {}, {
              when: new Date()
            });
          }
          break;
        case 'msg':
          cont._updateReceived(pres.seq, pres.act);
          break;
        case 'upd':
          this.getMeta(this.startMetaQuery().withLaterOneSub(pres.src).build());
          break;
        case 'acs':
          if (!pres.tgt) {
            if (cont.acs) {
              cont.acs.updateAll(pres.dacs);
            } else {
              cont.acs = new _access_mode_js__WEBPACK_IMPORTED_MODULE_0__["default"]().updateAll(pres.dacs);
            }
            cont.touched = new Date();
          }
          break;
        case 'ua':
          cont.seen = {
            when: new Date(),
            ua: pres.ua
          };
          break;
        case 'recv':
          pres.seq = pres.seq | 0;
          cont.recv = cont.recv ? Math.max(cont.recv, pres.seq) : pres.seq;
          break;
        case 'read':
          pres.seq = pres.seq | 0;
          cont.read = cont.read ? Math.max(cont.read, pres.seq) : pres.seq;
          cont.recv = cont.recv ? Math.max(cont.read, cont.recv) : cont.recv;
          cont.unread = cont.seq - cont.read;
          break;
        case 'gone':
          this._tinode.cacheRemTopic(pres.src);
          if (!cont._deleted) {
            cont._deleted = true;
            cont._attached = false;
            this._tinode._db.markTopicAsDeleted(pres.src, true);
          } else {
            this._tinode._db.remTopic(pres.src);
          }
          break;
        case 'del':
          break;
        default:
          this._tinode.logger("INFO: Unsupported presence update in 'me'", pres.what);
      }
      this._refreshContact(pres.what, cont);
    } else {
      if (pres.what == 'acs') {
        const acs = new _access_mode_js__WEBPACK_IMPORTED_MODULE_0__["default"](pres.dacs);
        if (!acs || acs.mode == _access_mode_js__WEBPACK_IMPORTED_MODULE_0__["default"]._INVALID) {
          this._tinode.logger("ERROR: Invalid access mode update", pres.src, pres.dacs);
          return;
        } else if (acs.mode == _access_mode_js__WEBPACK_IMPORTED_MODULE_0__["default"]._NONE) {
          this._tinode.logger("WARNING: Removing non-existent subscription", pres.src, pres.dacs);
          return;
        } else {
          this.getMeta(this.startMetaQuery().withOneSub(undefined, pres.src).build());
          const dummy = this._tinode.getTopic(pres.src);
          dummy.topic = pres.src;
          dummy.online = false;
          dummy.acs = acs;
          this._tinode._db.updTopic(dummy);
        }
      } else if (pres.what == 'tags') {
        this.getMeta(this.startMetaQuery().withTags().build());
      } else if (pres.what == 'msg') {
        this.getMeta(this.startMetaQuery().withOneSub(undefined, pres.src).build());
        const dummy = this._tinode.getTopic(pres.src);
        dummy._deleted = false;
        this._tinode._db.updTopic(dummy);
      }
      this._refreshContact(pres.what, cont);
    }
    if (this.onPres) {
      this.onPres(pres);
    }
  }
  _refreshContact(what, cont) {
    if (this.onContactUpdate) {
      this.onContactUpdate(what, cont);
    }
  }
  publish() {
    return Promise.reject(new Error("Publishing to 'me' is not supported"));
  }
  delCredential(method, value) {
    if (!this._attached) {
      return Promise.reject(new Error("Cannot delete credential in inactive 'me' topic"));
    }
    return this._tinode.delCredential(method, value).then(ctrl => {
      const index = this._credentials.findIndex(el => {
        return el.meth == method && el.val == value;
      });
      if (index > -1) {
        this._credentials.splice(index, 1);
      }
      if (this.onCredsUpdated) {
        this.onCredsUpdated(this._credentials);
      }
      return ctrl;
    });
  }
  contacts(callback, filter, context) {
    this._tinode.mapTopics((c, idx) => {
      if (c.isCommType() && (!filter || filter(c))) {
        callback.call(context, c, idx);
      }
    });
  }
  getContact(name) {
    return this._tinode.cacheGetTopic(name);
  }
  getAccessMode(name) {
    if (name) {
      const cont = this._tinode.cacheGetTopic(name);
      return cont ? cont.acs : null;
    }
    return this.acs;
  }
  isArchived(name) {
    const cont = this._tinode.cacheGetTopic(name);
    return cont && cont.private && !!cont.private.arch;
  }
  getCredentials() {
    return this._credentials;
  }
}

/***/ }),

/***/ "./src/meta-builder.js":
/*!*****************************!*\
  !*** ./src/meta-builder.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MetaGetBuilder)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/utils.js");



class MetaGetBuilder {
  constructor(parent) {
    this.topic = parent;
    this.what = {};
  }
  #get_desc_ims() {
    return this.topic._deleted ? undefined : this.topic.updated;
  }
  #get_subs_ims() {
    if (this.topic.isP2PType()) {
      return this.#get_desc_ims();
    }
    return this.topic._deleted ? undefined : this.topic._lastSubsUpdate;
  }
  withData(since, before, limit) {
    this.what['data'] = {
      since: since,
      before: before,
      limit: limit
    };
    return this;
  }
  withLaterData(limit) {
    return this.withData(this.topic._maxSeq > 0 ? this.topic._maxSeq + 1 : undefined, undefined, limit);
  }
  withDataRanges(ranges, limit) {
    this.what['data'] = {
      ranges: (0,_utils__WEBPACK_IMPORTED_MODULE_0__.normalizeRanges)(ranges, this.topic._maxSeq),
      limit: limit
    };
    return this;
  }
  withDataList(list) {
    return this.withDataRanges((0,_utils__WEBPACK_IMPORTED_MODULE_0__.listToRanges)(list));
  }
  withEarlierData(limit) {
    return this.withData(undefined, this.topic._minSeq > 0 ? this.topic._minSeq : undefined, limit);
  }
  withDesc(ims) {
    this.what['desc'] = {
      ims: ims
    };
    return this;
  }
  withLaterDesc() {
    return this.withDesc(this.#get_desc_ims());
  }
  withSub(ims, limit, userOrTopic) {
    const opts = {
      ims: ims,
      limit: limit
    };
    if (this.topic.getType() == 'me') {
      opts.topic = userOrTopic;
    } else {
      opts.user = userOrTopic;
    }
    this.what['sub'] = opts;
    return this;
  }
  withOneSub(ims, userOrTopic) {
    return this.withSub(ims, undefined, userOrTopic);
  }
  withLaterOneSub(userOrTopic) {
    return this.withOneSub(this.topic._lastSubsUpdate, userOrTopic);
  }
  withLaterSub(limit) {
    return this.withSub(this.#get_subs_ims(), limit);
  }
  withTags() {
    this.what['tags'] = true;
    return this;
  }
  withCred() {
    if (this.topic.getType() == 'me') {
      this.what['cred'] = true;
    } else {
      this.topic._tinode.logger("ERROR: Invalid topic type for MetaGetBuilder:withCreds", this.topic.getType());
    }
    return this;
  }
  withAux() {
    this.what['aux'] = true;
    return this;
  }
  withDel(since, limit) {
    if (since || limit) {
      this.what['del'] = {
        since: since,
        limit: limit
      };
    }
    return this;
  }
  withLaterDel(limit) {
    return this.withDel(this.topic._maxSeq > 0 ? this.topic._maxDel + 1 : undefined, limit);
  }
  extract(what) {
    return this.what[what];
  }
  build() {
    const what = [];
    let params = {};
    ['data', 'sub', 'desc', 'tags', 'cred', 'aux', 'del'].forEach(key => {
      if (this.what.hasOwnProperty(key)) {
        what.push(key);
        if (Object.getOwnPropertyNames(this.what[key]).length > 0) {
          params[key] = this.what[key];
        }
      }
    });
    if (what.length > 0) {
      params.what = what.join(' ');
    } else {
      params = undefined;
    }
    return params;
  }
}

/***/ }),

/***/ "./src/topic.js":
/*!**********************!*\
  !*** ./src/topic.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Topic)
/* harmony export */ });
/* harmony import */ var _access_mode_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./access-mode.js */ "./src/access-mode.js");
/* harmony import */ var _cbuffer_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./cbuffer.js */ "./src/cbuffer.js");
/* harmony import */ var _comm_error_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./comm-error.js */ "./src/comm-error.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./config.js */ "./src/config.js");
/* harmony import */ var _drafty_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./drafty.js */ "./src/drafty.js");
/* harmony import */ var _drafty_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_drafty_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _meta_builder_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./meta-builder.js */ "./src/meta-builder.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils.js */ "./src/utils.js");









class Topic {
  constructor(name, callbacks) {
    this._tinode = null;
    this.name = name;
    this.created = null;
    this.updated = null;
    this.touched = new Date(0);
    this.acs = new _access_mode_js__WEBPACK_IMPORTED_MODULE_0__["default"](null);
    this.private = null;
    this.public = null;
    this.trusted = null;
    this._users = {};
    this._queuedSeqId = _config_js__WEBPACK_IMPORTED_MODULE_3__.LOCAL_SEQID;
    this._maxSeq = 0;
    this._minSeq = 0;
    this._noEarlierMsgs = false;
    this._maxDel = 0;
    this._recvNotificationTimer = null;
    this._tags = [];
    this._credentials = [];
    this._aux = {};
    this._messageVersions = {};
    this._messages = new _cbuffer_js__WEBPACK_IMPORTED_MODULE_1__["default"]((a, b) => {
      return a.seq - b.seq;
    }, true);
    this._attached = false;
    this._lastSubsUpdate = new Date(0);
    this._new = true;
    this._deleted = false;
    this._delayedLeaveTimer = null;
    if (callbacks) {
      this.onData = callbacks.onData;
      this.onMeta = callbacks.onMeta;
      this.onPres = callbacks.onPres;
      this.onInfo = callbacks.onInfo;
      this.onMetaDesc = callbacks.onMetaDesc;
      this.onMetaSub = callbacks.onMetaSub;
      this.onSubsUpdated = callbacks.onSubsUpdated;
      this.onTagsUpdated = callbacks.onTagsUpdated;
      this.onCredsUpdated = callbacks.onCredsUpdated;
      this.onAuxUpdated = callbacks.onAuxUpdated;
      this.onDeleteTopic = callbacks.onDeleteTopic;
      this.onAllMessagesReceived = callbacks.onAllMessagesReceived;
    }
  }
  static topicType(name) {
    const types = {
      'me': _config_js__WEBPACK_IMPORTED_MODULE_3__.TOPIC_ME,
      'fnd': _config_js__WEBPACK_IMPORTED_MODULE_3__.TOPIC_FND,
      'grp': _config_js__WEBPACK_IMPORTED_MODULE_3__.TOPIC_GRP,
      'new': _config_js__WEBPACK_IMPORTED_MODULE_3__.TOPIC_GRP,
      'nch': _config_js__WEBPACK_IMPORTED_MODULE_3__.TOPIC_GRP,
      'chn': _config_js__WEBPACK_IMPORTED_MODULE_3__.TOPIC_GRP,
      'usr': _config_js__WEBPACK_IMPORTED_MODULE_3__.TOPIC_P2P,
      'sys': _config_js__WEBPACK_IMPORTED_MODULE_3__.TOPIC_SYS,
      'slf': _config_js__WEBPACK_IMPORTED_MODULE_3__.TOPIC_SLF
    };
    return types[typeof name == 'string' ? name.substring(0, 3) : 'xxx'];
  }
  static isMeTopicName(name) {
    return Topic.topicType(name) == _config_js__WEBPACK_IMPORTED_MODULE_3__.TOPIC_ME;
  }
  static isSelfTopicName(name) {
    return Topic.topicType(name) == _config_js__WEBPACK_IMPORTED_MODULE_3__.TOPIC_SLF;
  }
  static isGroupTopicName(name) {
    return Topic.topicType(name) == _config_js__WEBPACK_IMPORTED_MODULE_3__.TOPIC_GRP;
  }
  static isP2PTopicName(name) {
    return Topic.topicType(name) == _config_js__WEBPACK_IMPORTED_MODULE_3__.TOPIC_P2P;
  }
  static isCommTopicName(name) {
    return Topic.isP2PTopicName(name) || Topic.isGroupTopicName(name) || Topic.isSelfTopicName(name);
  }
  static isNewGroupTopicName(name) {
    return typeof name == 'string' && (name.substring(0, 3) == _config_js__WEBPACK_IMPORTED_MODULE_3__.TOPIC_NEW || name.substring(0, 3) == _config_js__WEBPACK_IMPORTED_MODULE_3__.TOPIC_NEW_CHAN);
  }
  static isChannelTopicName(name) {
    return typeof name == 'string' && (name.substring(0, 3) == _config_js__WEBPACK_IMPORTED_MODULE_3__.TOPIC_CHAN || name.substring(0, 3) == _config_js__WEBPACK_IMPORTED_MODULE_3__.TOPIC_NEW_CHAN);
  }
  static #isReplacementMsg(pub) {
    return pub.head && pub.head.replace;
  }
  isSubscribed() {
    return this._attached;
  }
  subscribe(getParams, setParams) {
    clearTimeout(this._delayedLeaveTimer);
    this._delayedLeaveTimer = null;
    if (this._attached) {
      return Promise.resolve(this);
    }
    return this._tinode.subscribe(this.name || _config_js__WEBPACK_IMPORTED_MODULE_3__.TOPIC_NEW, getParams, setParams).then(ctrl => {
      if (ctrl.code >= 300) {
        return ctrl;
      }
      this._attached = true;
      this._deleted = false;
      this.acs = ctrl.params && ctrl.params.acs ? ctrl.params.acs : this.acs;
      if (this._new) {
        delete this._new;
        if (this.name != ctrl.topic) {
          this._cacheDelSelf();
          this.name = ctrl.topic;
        }
        this._cachePutSelf();
        this.created = ctrl.ts;
        this.updated = ctrl.ts;
        if (this.name != _config_js__WEBPACK_IMPORTED_MODULE_3__.TOPIC_ME && this.name != _config_js__WEBPACK_IMPORTED_MODULE_3__.TOPIC_FND) {
          const me = this._tinode.getMeTopic();
          if (me.onMetaSub) {
            me.onMetaSub(this);
          }
          if (me.onSubsUpdated) {
            me.onSubsUpdated([this.name], 1);
          }
        }
        if (setParams && setParams.desc) {
          setParams.desc._noForwarding = true;
          this._processMetaDesc(setParams.desc);
        }
      }
      return ctrl;
    });
  }
  createMessage(data, noEcho) {
    return this._tinode.createMessage(this.name, data, noEcho);
  }
  publish(data, noEcho) {
    return this.publishMessage(this.createMessage(data, noEcho));
  }
  publishMessage(pub) {
    if (!this._attached) {
      return Promise.reject(new Error("Cannot publish on inactive topic"));
    }
    if (this._sending) {
      return Promise.reject(new Error("The message is already being sent"));
    }
    pub._sending = true;
    pub._failed = false;
    let attachments = null;
    if (_drafty_js__WEBPACK_IMPORTED_MODULE_4___default().hasEntities(pub.content)) {
      attachments = [];
      _drafty_js__WEBPACK_IMPORTED_MODULE_4___default().entities(pub.content, data => {
        if (data) {
          if (data.ref) {
            attachments.push(data.ref);
          }
          if (data.preref) {
            attachments.push(data.preref);
          }
        }
      });
      if (attachments.length == 0) {
        attachments = null;
      }
    }
    return this._tinode.publishMessage(pub, attachments).then(ctrl => {
      pub._sending = false;
      pub.ts = ctrl.ts;
      this.swapMessageId(pub, ctrl.params.seq);
      this._maybeUpdateMessageVersionsCache(pub);
      this._routeData(pub);
      return ctrl;
    }).catch(err => {
      this._tinode.logger("WARNING: Message rejected by the server", err);
      pub._sending = false;
      pub._failed = true;
      if (this.onData) {
        this.onData();
      }
    });
  }
  publishDraft(pub, prom) {
    const seq = pub.seq || this._getQueuedSeqId();
    if (!pub._noForwarding) {
      pub._noForwarding = true;
      pub.seq = seq;
      pub.ts = new Date();
      pub.from = this._tinode.getCurrentUserID();
      pub.noecho = true;
      this._messages.put(pub);
      this._tinode._db.addMessage(pub);
      if (this.onData) {
        this.onData(pub);
      }
    }
    return (prom || Promise.resolve()).then(_ => {
      if (pub._cancelled) {
        return {
          code: 300,
          text: "cancelled"
        };
      }
      return this.publishMessage(pub);
    }).catch(err => {
      this._tinode.logger("WARNING: Message draft rejected", err);
      pub._sending = false;
      pub._failed = true;
      pub._fatal = err instanceof _comm_error_js__WEBPACK_IMPORTED_MODULE_2__["default"] ? err.code >= 400 && err.code < 500 : false;
      if (this.onData) {
        this.onData();
      }
      throw err;
    });
  }
  leave(unsub) {
    if (!this._attached && !unsub) {
      return Promise.reject(new Error("Cannot leave inactive topic"));
    }
    return this._tinode.leave(this.name, unsub).then(ctrl => {
      this._resetSub();
      if (unsub) {
        this._gone();
      }
      return ctrl;
    });
  }
  leaveDelayed(unsub, delay) {
    clearTimeout(this._delayedLeaveTimer);
    this._delayedLeaveTimer = setTimeout(_ => {
      this._delayedLeaveTimer = null;
      this.leave(unsub);
    }, delay);
  }
  getMeta(params) {
    return this._tinode.getMeta(this.name, params);
  }
  getMessagesPage(limit, gaps, min, max, newer) {
    let query = gaps ? this.startMetaQuery().withDataRanges(gaps, limit) : newer ? this.startMetaQuery().withData(min, undefined, limit) : this.startMetaQuery().withData(undefined, max, limit);
    return this._loadMessages(this._tinode._db, query.extract('data')).then(count => {
      gaps = this.msgHasMoreMessages(min, max, newer);
      if (gaps.length == 0) {
        return Promise.resolve({
          topic: this.name,
          code: 200,
          params: {
            count: count
          }
        });
      }
      limit -= count;
      query = this.startMetaQuery().withDataRanges(gaps, limit);
      return this.getMeta(query.build());
    });
  }
  getPinnedMessages() {
    const pins = this.aux('pins');
    if (!Array.isArray(pins)) {
      return Promise.resolve(0);
    }
    const loaded = [];
    let remains = pins;
    return this._tinode._db.readMessages(this.name, {
      ranges: (0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.listToRanges)(remains)
    }).then(msgs => {
      msgs.forEach(data => {
        if (data) {
          loaded.push(data.seq);
          this._messages.put(data);
          this._maybeUpdateMessageVersionsCache(data);
        }
      });
      if (loaded.length < pins.length) {
        remains = pins.filter(seq => !loaded.includes(seq));
        return this._tinode._db.readMessages(this.name, {
          ranges: (0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.listToRanges)(remains)
        });
      }
      return null;
    }).then(ranges => {
      if (ranges) {
        remains.forEach(seq => {
          if (ranges.find(r => r.low <= seq && r.hi > seq)) {
            loaded.push(seq);
          }
        });
      }
      if (loaded.length == pins.length) {
        return Promise.resolve({
          topic: this.name,
          code: 200,
          params: {
            count: loaded.length
          }
        });
      }
      remains = pins.filter(seq => !loaded.includes(seq));
      return this.getMeta(this.startMetaQuery().withDataList(remains).build());
    });
  }
  setMeta(params) {
    if (params.tags) {
      params.tags = (0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.normalizeArray)(params.tags);
    }
    return this._tinode.setMeta(this.name, params).then(ctrl => {
      if (ctrl && ctrl.code >= 300) {
        return ctrl;
      }
      if (params.sub) {
        params.sub.topic = this.name;
        if (ctrl.params && ctrl.params.acs) {
          params.sub.acs = ctrl.params.acs;
          params.sub.updated = ctrl.ts;
        }
        if (!params.sub.user) {
          params.sub.user = this._tinode.getCurrentUserID();
          if (!params.desc) {
            params.desc = {};
          }
        }
        params.sub._noForwarding = true;
        this._processMetaSubs([params.sub]);
      }
      if (params.desc) {
        if (ctrl.params && ctrl.params.acs) {
          params.desc.acs = ctrl.params.acs;
          params.desc.updated = ctrl.ts;
        }
        this._processMetaDesc(params.desc);
      }
      if (params.tags) {
        this._processMetaTags(params.tags);
      }
      if (params.cred) {
        this._processMetaCreds([params.cred], true);
      }
      if (params.aux) {
        this._processMetaAux(params.aux);
      }
      return ctrl;
    });
  }
  updateMode(uid, update) {
    const user = uid ? this.subscriber(uid) : null;
    const am = user ? user.acs.updateGiven(update).getGiven() : this.getAccessMode().updateWant(update).getWant();
    return this.setMeta({
      sub: {
        user: uid,
        mode: am
      }
    });
  }
  invite(uid, mode) {
    return this.setMeta({
      sub: {
        user: uid,
        mode: mode
      }
    });
  }
  archive(arch) {
    if (this.private && !this.private.arch == !arch) {
      return Promise.resolve(arch);
    }
    return this.setMeta({
      desc: {
        private: {
          arch: arch ? true : _config_js__WEBPACK_IMPORTED_MODULE_3__.DEL_CHAR
        }
      }
    });
  }
  pinMessage(seq, pin) {
    let pinned = this.aux('pins');
    if (!Array.isArray(pinned)) {
      pinned = [];
    }
    let changed = false;
    if (pin) {
      if (!pinned.includes(seq)) {
        changed = true;
        if (pinned.length == _config_js__WEBPACK_IMPORTED_MODULE_3__.MAX_PINNED_COUNT) {
          pinned.shift();
        }
        pinned.push(seq);
      }
    } else {
      if (pinned.includes(seq)) {
        changed = true;
        pinned = pinned.filter(id => id != seq);
        if (pinned.length == 0) {
          pinned = _config_js__WEBPACK_IMPORTED_MODULE_3__.DEL_CHAR;
        }
      }
    }
    if (changed) {
      return this.setMeta({
        aux: {
          pins: pinned
        }
      });
    }
    return Promise.resolve();
  }
  delMessages(ranges, hard) {
    if (!this._attached) {
      return Promise.reject(new Error("Cannot delete messages in inactive topic"));
    }
    const tosend = (0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.normalizeRanges)(ranges, this._maxSeq);
    let result;
    if (tosend.length > 0) {
      result = this._tinode.delMessages(this.name, tosend, hard);
    } else {
      result = Promise.resolve({
        params: {
          del: 0
        }
      });
    }
    return result.then(ctrl => {
      if (ctrl.params.del > this._maxDel) {
        this._maxDel = Math.max(ctrl.params.del, this._maxDel);
        this.clear = Math.max(ctrl.params.del, this.clear);
      }
      ranges.forEach(rec => {
        if (rec.hi) {
          this.flushMessageRange(rec.low, rec.hi);
        } else {
          this.flushMessage(rec.low);
        }
        this._messages.put({
          seq: rec.low,
          low: rec.low,
          hi: rec.hi,
          _deleted: true
        });
      });
      this._tinode._db.addDelLog(this.name, ctrl.params.del, ranges);
      if (this.onData) {
        this.onData();
      }
      return ctrl;
    });
  }
  delMessagesAll(hardDel) {
    if (!this._maxSeq || this._maxSeq <= 0) {
      return Promise.resolve();
    }
    return this.delMessages([{
      low: 1,
      hi: this._maxSeq + 1,
      _all: true
    }], hardDel);
  }
  delMessagesList(list, hardDel) {
    return this.delMessages((0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.listToRanges)(list), hardDel);
  }
  delMessagesEdits(seq, hardDel) {
    const list = [seq];
    this.messageVersions(seq, msg => list.push(msg.seq));
    return this.delMessagesList(list, hardDel);
  }
  delTopic(hard) {
    if (this._deleted) {
      this._gone();
      return Promise.resolve(null);
    }
    return this._tinode.delTopic(this.name, hard).then(ctrl => {
      this._deleted = true;
      this._resetSub();
      this._gone();
      return ctrl;
    });
  }
  delSubscription(user) {
    if (!this._attached) {
      return Promise.reject(new Error("Cannot delete subscription in inactive topic"));
    }
    return this._tinode.delSubscription(this.name, user).then(ctrl => {
      delete this._users[user];
      if (this.onSubsUpdated) {
        this.onSubsUpdated(Object.keys(this._users));
      }
      return ctrl;
    });
  }
  note(what, seq) {
    if (!this._attached) {
      return;
    }
    const user = this._users[this._tinode.getCurrentUserID()];
    let update = false;
    if (user) {
      if (!user[what] || user[what] < seq) {
        user[what] = seq;
        update = true;
      }
    } else {
      update = (this[what] | 0) < seq;
    }
    if (update) {
      this._tinode.note(this.name, what, seq);
      this._updateMyReadRecv(what, seq);
      if (this.acs != null && !this.acs.isMuted()) {
        const me = this._tinode.getMeTopic();
        me._refreshContact(what, this);
      }
    }
  }
  noteRecv(seq) {
    this.note('recv', seq);
  }
  noteRead(seq) {
    seq = seq || this._maxSeq;
    if (seq > 0) {
      this.note('read', seq);
    }
  }
  noteKeyPress() {
    if (this._attached) {
      this._tinode.noteKeyPress(this.name);
    } else {
      this._tinode.logger("INFO: Cannot send notification in inactive topic");
    }
  }
  noteRecording(audioOnly) {
    if (this._attached) {
      this._tinode.noteKeyPress(this.name, audioOnly ? 'kpa' : 'kpv');
    } else {
      this._tinode.logger("INFO: Cannot send notification in inactive topic");
    }
  }
  videoCall(evt, seq, payload) {
    if (!this._attached && !['ringing', 'hang-up'].includes(evt)) {
      return;
    }
    return this._tinode.videoCall(this.name, seq, evt, payload);
  }
  _updateMyReadRecv(what, seq, ts) {
    let oldVal,
      doUpdate = false;
    seq = seq | 0;
    this.seq = this.seq | 0;
    this.read = this.read | 0;
    this.recv = this.recv | 0;
    switch (what) {
      case 'recv':
        oldVal = this.recv;
        this.recv = Math.max(this.recv, seq);
        doUpdate = oldVal != this.recv;
        break;
      case 'read':
        oldVal = this.read;
        this.read = Math.max(this.read, seq);
        doUpdate = oldVal != this.read;
        break;
      case 'msg':
        oldVal = this.seq;
        this.seq = Math.max(this.seq, seq);
        if (!this.touched || this.touched < ts) {
          this.touched = ts;
        }
        doUpdate = oldVal != this.seq;
        break;
    }
    if (this.recv < this.read) {
      this.recv = this.read;
      doUpdate = true;
    }
    if (this.seq < this.recv) {
      this.seq = this.recv;
      if (!this.touched || this.touched < ts) {
        this.touched = ts;
      }
      doUpdate = true;
    }
    this.unread = this.seq - this.read;
    return doUpdate;
  }
  userDesc(uid) {
    const user = this._cacheGetUser(uid);
    if (user) {
      return user;
    }
  }
  p2pPeerDesc() {
    if (!this.isP2PType()) {
      return undefined;
    }
    return this._users[this.name];
  }
  subscribers(callback, context) {
    const cb = callback || this.onMetaSub;
    if (cb) {
      for (let idx in this._users) {
        cb.call(context, this._users[idx], idx, this._users);
      }
    }
  }
  tags() {
    return this._tags.slice(0);
  }
  aux(key) {
    return this._aux[key];
  }
  alias() {
    const alias = this._tags && this._tags.find(t => t.startsWith(_config_js__WEBPACK_IMPORTED_MODULE_3__.TAG_ALIAS));
    if (!alias) {
      return undefined;
    }
    return alias.substring(_config_js__WEBPACK_IMPORTED_MODULE_3__.TAG_ALIAS.length);
  }
  subscriber(uid) {
    return this._users[uid];
  }
  messageVersions(origSeq, callback, context) {
    if (!callback) {
      return;
    }
    const versions = this._messageVersions[origSeq];
    if (!versions) {
      return;
    }
    versions.forEach(callback, undefined, undefined, context);
  }
  messages(callback, sinceId, beforeId, context) {
    const cb = callback || this.onData;
    if (cb) {
      const startIdx = typeof sinceId == 'number' ? this._messages.find({
        seq: sinceId
      }, true) : undefined;
      const beforeIdx = typeof beforeId == 'number' ? this._messages.find({
        seq: beforeId
      }, true) : undefined;
      if (startIdx != -1 && beforeIdx != -1) {
        let msgs = [];
        this._messages.forEach((msg, unused1, unused2, i) => {
          if (Topic.#isReplacementMsg(msg)) {
            return;
          }
          if (msg._deleted) {
            return;
          }
          const latest = this.latestMsgVersion(msg.seq) || msg;
          if (!latest._origTs) {
            latest._origTs = latest.ts;
            latest._origSeq = latest.seq;
            latest.ts = msg.ts;
            latest.seq = msg.seq;
          }
          msgs.push({
            data: latest,
            idx: i
          });
        }, startIdx, beforeIdx, {});
        msgs.forEach((val, i) => {
          cb.call(context, val.data, i > 0 ? msgs[i - 1].data : undefined, i < msgs.length - 1 ? msgs[i + 1].data : undefined, val.idx);
        });
      }
    }
  }
  findMessage(seq) {
    const idx = this._messages.find({
      seq: seq
    });
    if (idx >= 0) {
      return this._messages.getAt(idx);
    }
    return undefined;
  }
  latestMessage() {
    return this._messages.getLast(msg => !msg._deleted);
  }
  latestMsgVersion(seq) {
    const versions = this._messageVersions[seq];
    return versions ? versions.getLast() : null;
  }
  maxMsgSeq() {
    return this._maxSeq;
  }
  minMsgSeq() {
    return this._minSeq;
  }
  maxClearId() {
    return this._maxDel;
  }
  messageCount() {
    return this._messages.length();
  }
  queuedMessages(callback, context) {
    if (!callback) {
      throw new Error("Callback must be provided");
    }
    this.messages(callback, _config_js__WEBPACK_IMPORTED_MODULE_3__.LOCAL_SEQID, undefined, context);
  }
  msgReceiptCount(what, seq) {
    let count = 0;
    if (seq > 0) {
      const me = this._tinode.getCurrentUserID();
      for (let idx in this._users) {
        const user = this._users[idx];
        if (user.user !== me && user[what] >= seq) {
          count++;
        }
      }
    }
    return count;
  }
  msgReadCount(seq) {
    return this.msgReceiptCount('read', seq);
  }
  msgRecvCount(seq) {
    return this.msgReceiptCount('recv', seq);
  }
  msgHasMoreMessages(min, max, newer) {
    const gaps = [];
    if (min >= max) {
      return gaps;
    }
    let maxSeq = 0;
    let gap;
    this._messages.forEach((msg, prev) => {
      const p = prev || {
        seq: 0
      };
      const expected = p._deleted ? p.hi : p.seq + 1;
      if (msg.seq > expected) {
        gap = {
          low: expected,
          hi: msg.seq
        };
      } else {
        gap = null;
      }
      if (gap && (newer ? gap.hi >= min : gap.low < max)) {
        gaps.push(gap);
      }
      maxSeq = expected;
    });
    if (maxSeq < this.seq) {
      gap = {
        low: maxSeq + 1,
        hi: this.seq + 1
      };
      if (newer ? gap.hi >= min : gap.low < max) {
        gaps.push(gap);
      }
    }
    return gaps;
  }
  isNewMessage(seqId) {
    return this._maxSeq <= seqId;
  }
  flushMessage(seqId) {
    const idx = this._messages.find({
      seq: seqId
    });
    delete this._messageVersions[seqId];
    if (idx >= 0) {
      this._tinode._db.remMessages(this.name, seqId);
      return this._messages.delAt(idx);
    }
    return undefined;
  }
  flushMessageRange(fromId, untilId) {
    this._tinode._db.remMessages(this.name, fromId, untilId);
    for (let i = fromId; i < untilId; i++) {
      delete this._messageVersions[i];
    }
    const since = this._messages.find({
      seq: fromId
    }, true);
    return since >= 0 ? this._messages.delRange(since, this._messages.find({
      seq: untilId
    }, true)) : [];
  }
  swapMessageId(pub, newSeqId) {
    const idx = this._messages.find(pub);
    const numMessages = this._messages.length();
    if (0 <= idx && idx < numMessages) {
      this._messages.delAt(idx);
      this._tinode._db.remMessages(this.name, pub.seq);
      pub.seq = newSeqId;
      this._messages.put(pub);
      this._tinode._db.addMessage(pub);
    }
  }
  cancelSend(seqId) {
    const idx = this._messages.find({
      seq: seqId
    });
    if (idx >= 0) {
      const msg = this._messages.getAt(idx);
      const status = this.msgStatus(msg);
      if (status == _config_js__WEBPACK_IMPORTED_MODULE_3__.MESSAGE_STATUS_QUEUED || status == _config_js__WEBPACK_IMPORTED_MODULE_3__.MESSAGE_STATUS_FAILED || status == _config_js__WEBPACK_IMPORTED_MODULE_3__.MESSAGE_STATUS_FATAL) {
        this._tinode._db.remMessages(this.name, seqId);
        msg._cancelled = true;
        this._messages.delAt(idx);
        if (this.onData) {
          this.onData();
        }
        return true;
      }
    }
    return false;
  }
  getType() {
    return Topic.topicType(this.name);
  }
  getAccessMode() {
    return this.acs;
  }
  setAccessMode(acs) {
    return this.acs = new _access_mode_js__WEBPACK_IMPORTED_MODULE_0__["default"](acs);
  }
  getDefaultAccess() {
    return this.defacs;
  }
  startMetaQuery() {
    return new _meta_builder_js__WEBPACK_IMPORTED_MODULE_5__["default"](this);
  }
  isArchived() {
    return this.private && !!this.private.arch;
  }
  isMeType() {
    return Topic.isMeTopicName(this.name);
  }
  isSelfType() {
    return Topic.isSelfTopicName(this.name);
  }
  isChannelType() {
    return Topic.isChannelTopicName(this.name);
  }
  isGroupType() {
    return Topic.isGroupTopicName(this.name);
  }
  isP2PType() {
    return Topic.isP2PTopicName(this.name);
  }
  isCommType() {
    return Topic.isCommTopicName(this.name);
  }
  msgStatus(msg, upd) {
    let status = _config_js__WEBPACK_IMPORTED_MODULE_3__.MESSAGE_STATUS_NONE;
    if (this._tinode.isMe(msg.from)) {
      if (msg._sending) {
        status = _config_js__WEBPACK_IMPORTED_MODULE_3__.MESSAGE_STATUS_SENDING;
      } else if (msg._fatal || msg._cancelled) {
        status = _config_js__WEBPACK_IMPORTED_MODULE_3__.MESSAGE_STATUS_FATAL;
      } else if (msg._failed) {
        status = _config_js__WEBPACK_IMPORTED_MODULE_3__.MESSAGE_STATUS_FAILED;
      } else if (msg.seq >= _config_js__WEBPACK_IMPORTED_MODULE_3__.LOCAL_SEQID) {
        status = _config_js__WEBPACK_IMPORTED_MODULE_3__.MESSAGE_STATUS_QUEUED;
      } else if (this.msgReadCount(msg.seq) > 0) {
        status = _config_js__WEBPACK_IMPORTED_MODULE_3__.MESSAGE_STATUS_READ;
      } else if (this.msgRecvCount(msg.seq) > 0) {
        status = _config_js__WEBPACK_IMPORTED_MODULE_3__.MESSAGE_STATUS_RECEIVED;
      } else if (msg.seq > 0) {
        status = _config_js__WEBPACK_IMPORTED_MODULE_3__.MESSAGE_STATUS_SENT;
      }
    } else {
      status = _config_js__WEBPACK_IMPORTED_MODULE_3__.MESSAGE_STATUS_TO_ME;
    }
    if (upd && msg._status != status) {
      msg._status = status;
      this._tinode._db.updMessageStatus(this.name, msg.seq, status);
    }
    return status;
  }
  _maybeUpdateMessageVersionsCache(msg) {
    if (!Topic.#isReplacementMsg(msg)) {
      if (this._messageVersions[msg.seq]) {
        this._messageVersions[msg.seq].filter(version => version.from == msg.from);
        if (this._messageVersions[msg.seq].isEmpty()) {
          delete this._messageVersions[msg.seq];
        }
      }
      return;
    }
    const targetSeq = parseInt(msg.head.replace.split(':')[1]);
    if (targetSeq > msg.seq) {
      return;
    }
    const targetMsg = this.findMessage(targetSeq);
    if (targetMsg && targetMsg.from != msg.from) {
      return;
    }
    const versions = this._messageVersions[targetSeq] || new _cbuffer_js__WEBPACK_IMPORTED_MODULE_1__["default"]((a, b) => {
      return a.seq - b.seq;
    }, true);
    versions.put(msg);
    this._messageVersions[targetSeq] = versions;
  }
  _routeData(data) {
    if (data.content) {
      if (!this.touched || this.touched < data.ts) {
        this.touched = data.ts;
        this._tinode._db.updTopic(this);
      }
    }
    if (data.seq > this._maxSeq) {
      this._maxSeq = data.seq;
      this.msgStatus(data, true);
      clearTimeout(this._recvNotificationTimer);
      this._recvNotificationTimer = setTimeout(_ => {
        this._recvNotificationTimer = null;
        this.noteRecv(this._maxSeq);
      }, _config_js__WEBPACK_IMPORTED_MODULE_3__.RECV_TIMEOUT);
    }
    if (data.seq < this._minSeq || this._minSeq == 0) {
      this._minSeq = data.seq;
    }
    const outgoing = !this.isChannelType() && !data.from || this._tinode.isMe(data.from);
    if (data.head && data.head.webrtc && data.head.mime == _drafty_js__WEBPACK_IMPORTED_MODULE_4___default().getContentType() && data.content) {
      const upd = {
        state: data.head.webrtc,
        duration: data.head['webrtc-duration'],
        incoming: !outgoing
      };
      if (data.head.vc) {
        upd.vc = true;
      }
      data.content = _drafty_js__WEBPACK_IMPORTED_MODULE_4___default().updateVideoCall(data.content, upd);
    }
    if (!data._noForwarding) {
      this._messages.put(data);
      this._tinode._db.addMessage(data);
      this._maybeUpdateMessageVersionsCache(data);
    }
    if (this.onData) {
      this.onData(data);
    }
    const what = outgoing ? 'read' : 'msg';
    this._updateMyReadRecv(what, data.seq, data.ts);
    if (!outgoing && data.from) {
      this._routeInfo({
        what: 'read',
        from: data.from,
        seq: data.seq,
        _noForwarding: true
      });
    }
    this._tinode.getMeTopic()._refreshContact(what, this);
  }
  _routeMeta(meta) {
    if (meta.desc) {
      this._processMetaDesc(meta.desc);
    }
    if (meta.sub && meta.sub.length > 0) {
      this._processMetaSubs(meta.sub);
    }
    if (meta.del) {
      this._processDelMessages(meta.del.clear, meta.del.delseq);
    }
    if (meta.tags) {
      this._processMetaTags(meta.tags);
    }
    if (meta.cred) {
      this._processMetaCreds(meta.cred);
    }
    if (meta.aux) {
      this._processMetaAux(meta.aux);
    }
    if (this.onMeta) {
      this.onMeta(meta);
    }
  }
  _routePres(pres) {
    let user, uid;
    switch (pres.what) {
      case 'del':
        this._processDelMessages(pres.clear, pres.delseq);
        break;
      case 'on':
      case 'off':
        user = this._users[pres.src];
        if (user) {
          user.online = pres.what == 'on';
        } else {
          this._tinode.logger("WARNING: Presence update for an unknown user", this.name, pres.src);
        }
        break;
      case 'term':
        this._resetSub();
        break;
      case 'upd':
        if (pres.src && !this._tinode.isTopicCached(pres.src)) {
          this.getMeta(this.startMetaQuery().withOneSub(undefined, pres.src).build());
        }
        break;
      case 'aux':
        this.getMeta(this.startMetaQuery().withAux().build());
        break;
      case 'acs':
        uid = pres.src || this._tinode.getCurrentUserID();
        user = this._users[uid];
        if (!user) {
          const acs = new _access_mode_js__WEBPACK_IMPORTED_MODULE_0__["default"]().updateAll(pres.dacs);
          if (acs && acs.mode != _access_mode_js__WEBPACK_IMPORTED_MODULE_0__["default"]._NONE) {
            user = this._cacheGetUser(uid);
            if (!user) {
              user = {
                user: uid,
                acs: acs
              };
              this.getMeta(this.startMetaQuery().withOneSub(undefined, uid).build());
            } else {
              user.acs = acs;
            }
            user.updated = new Date();
            this._processMetaSubs([user]);
          }
        } else {
          user.acs.updateAll(pres.dacs);
          this._processMetaSubs([{
            user: uid,
            updated: new Date(),
            acs: user.acs
          }]);
        }
        break;
      default:
        this._tinode.logger("INFO: Ignored presence update", pres.what);
    }
    if (this.onPres) {
      this.onPres(pres);
    }
  }
  _routeInfo(info) {
    switch (info.what) {
      case 'recv':
      case 'read':
        const user = this._users[info.from];
        if (user) {
          user[info.what] = info.seq;
          if (user.recv < user.read) {
            user.recv = user.read;
          }
        }
        const msg = this.latestMessage();
        if (msg) {
          this.msgStatus(msg, true);
        }
        if (this._tinode.isMe(info.from) && !info._noForwarding) {
          this._updateMyReadRecv(info.what, info.seq);
        }
        this._tinode.getMeTopic()._refreshContact(info.what, this);
        break;
      case 'kp':
      case 'kpa':
      case 'kpv':
        break;
      case 'call':
        break;
      default:
        this._tinode.logger("INFO: Ignored info update", info.what);
    }
    if (this.onInfo) {
      this.onInfo(info);
    }
  }
  _processMetaDesc(desc) {
    if (this.isP2PType()) {
      delete desc.defacs;
      this._tinode._db.updUser(this.name, desc.public);
    }
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.mergeObj)(this, desc);
    this._tinode._db.updTopic(this);
    if (this.name !== _config_js__WEBPACK_IMPORTED_MODULE_3__.TOPIC_ME && !desc._noForwarding) {
      const me = this._tinode.getMeTopic();
      if (me.onMetaSub) {
        me.onMetaSub(this);
      }
      if (me.onSubsUpdated) {
        me.onSubsUpdated([this.name], 1);
      }
    }
    if (this.onMetaDesc) {
      this.onMetaDesc(this);
    }
  }
  _processMetaSubs(subs) {
    for (let idx in subs) {
      const sub = subs[idx];
      sub.online = !!sub.online;
      this._lastSubsUpdate = new Date(Math.max(this._lastSubsUpdate, sub.updated));
      let user = null;
      if (!sub.deleted) {
        if (this._tinode.isMe(sub.user) && sub.acs) {
          this._processMetaDesc({
            updated: sub.updated,
            touched: sub.touched,
            acs: sub.acs
          });
        }
        user = this._updateCachedUser(sub.user, sub);
      } else {
        delete this._users[sub.user];
        user = sub;
      }
      if (this.onMetaSub) {
        this.onMetaSub(user);
      }
    }
    if (this.onSubsUpdated) {
      this.onSubsUpdated(Object.keys(this._users));
    }
  }
  _processMetaTags(tags) {
    if (tags == _config_js__WEBPACK_IMPORTED_MODULE_3__.DEL_CHAR || tags.length == 1 && tags[0] == _config_js__WEBPACK_IMPORTED_MODULE_3__.DEL_CHAR) {
      tags = [];
    }
    this._tags = tags;
    this._tinode._db.updTopic(this);
    if (this.onTagsUpdated) {
      this.onTagsUpdated(tags);
    }
  }
  _processMetaCreds(creds) {}
  _processMetaAux(aux) {
    aux = !aux || aux == _config_js__WEBPACK_IMPORTED_MODULE_3__.DEL_CHAR ? {} : aux;
    this._aux = (0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.mergeObj)(this._aux, aux);
    this._tinode._db.updTopic(this);
    if (this.onAuxUpdated) {
      this.onAuxUpdated(this._aux);
    }
  }
  _processDelMessages(clear, delseq) {
    this._maxDel = Math.max(clear, this._maxDel);
    this.clear = Math.max(clear, this.clear);
    let count = 0;
    if (Array.isArray(delseq)) {
      delseq.forEach(rec => {
        if (!rec.hi) {
          count++;
          this.flushMessage(rec.low);
        } else {
          count += rec.hi - rec.low;
          this.flushMessageRange(rec.low, rec.hi);
        }
        this._messages.put({
          seq: rec.low,
          low: rec.low,
          hi: rec.hi,
          _deleted: true
        });
      });
      this._tinode._db.addDelLog(this.name, clear, delseq);
    }
    if (count > 0) {
      if (this.onData) {
        this.onData();
      }
    }
  }
  _allMessagesReceived(count) {
    if (this.onAllMessagesReceived) {
      this.onAllMessagesReceived(count);
    }
  }
  _resetSub() {
    this._attached = false;
  }
  _gone() {
    this._messages.reset();
    this._tinode._db.remMessages(this.name);
    this._users = {};
    this.acs = new _access_mode_js__WEBPACK_IMPORTED_MODULE_0__["default"](null);
    this.private = null;
    this.public = null;
    this.trusted = null;
    this._maxSeq = 0;
    this._minSeq = 0;
    this._attached = false;
    const me = this._tinode.getMeTopic();
    if (me) {
      me._routePres({
        _noForwarding: true,
        what: 'gone',
        topic: _config_js__WEBPACK_IMPORTED_MODULE_3__.TOPIC_ME,
        src: this.name
      });
    }
    if (this.onDeleteTopic) {
      this.onDeleteTopic();
    }
  }
  _updateCachedUser(uid, obj) {
    let cached = this._cacheGetUser(uid);
    cached = (0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.mergeObj)(cached || {}, obj);
    this._cachePutUser(uid, cached);
    return (0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.mergeToCache)(this._users, uid, cached);
  }
  _getQueuedSeqId() {
    return this._queuedSeqId++;
  }
  _loadMessages(db, query) {
    query = query || {};
    query.limit = query.limit || _config_js__WEBPACK_IMPORTED_MODULE_3__.DEFAULT_MESSAGES_PAGE;
    let count = 0;
    return db.readMessages(this.name, query).then(msgs => {
      msgs.forEach(data => {
        if (data.seq > this._maxSeq) {
          this._maxSeq = data.seq;
        }
        if (data.seq < this._minSeq || this._minSeq == 0) {
          this._minSeq = data.seq;
        }
        this._messages.put(data);
        this._maybeUpdateMessageVersionsCache(data);
      });
      count = msgs.length;
    }).then(_ => db.readDelLog(this.name, query)).then(dellog => {
      return dellog.forEach(rec => {
        this._messages.put({
          seq: rec.low,
          low: rec.low,
          hi: rec.hi,
          _deleted: true
        });
      });
    }).then(_ => {
      return count;
    });
  }
  _updateReceived(seq, act) {
    this.touched = new Date();
    this.seq = seq | 0;
    if (!act || this._tinode.isMe(act)) {
      this.read = this.read ? Math.max(this.read, this.seq) : this.seq;
      this.recv = this.recv ? Math.max(this.read, this.recv) : this.read;
    }
    this.unread = this.seq - (this.read | 0);
    this._tinode._db.updTopic(this);
  }
}

/***/ }),

/***/ "./src/utils.js":
/*!**********************!*\
  !*** ./src/utils.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   clipInRange: () => (/* binding */ clipInRange),
/* harmony export */   clipOutRange: () => (/* binding */ clipOutRange),
/* harmony export */   isUrlRelative: () => (/* binding */ isUrlRelative),
/* harmony export */   jsonParseHelper: () => (/* binding */ jsonParseHelper),
/* harmony export */   listToRanges: () => (/* binding */ listToRanges),
/* harmony export */   mergeObj: () => (/* binding */ mergeObj),
/* harmony export */   mergeToCache: () => (/* binding */ mergeToCache),
/* harmony export */   normalizeArray: () => (/* binding */ normalizeArray),
/* harmony export */   normalizeRanges: () => (/* binding */ normalizeRanges),
/* harmony export */   rfc3339DateString: () => (/* binding */ rfc3339DateString),
/* harmony export */   simplify: () => (/* binding */ simplify)
/* harmony export */ });
/* harmony import */ var _access_mode_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./access-mode.js */ "./src/access-mode.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./config.js */ "./src/config.js");




function jsonParseHelper(key, val) {
  if (typeof val == 'string' && val.length >= 20 && val.length <= 24 && ['ts', 'touched', 'updated', 'created', 'when', 'deleted', 'expires'].includes(key)) {
    const date = new Date(val);
    if (!isNaN(date)) {
      return date;
    }
  } else if (key === 'acs' && typeof val === 'object') {
    return new _access_mode_js__WEBPACK_IMPORTED_MODULE_0__["default"](val);
  }
  return val;
}
function isUrlRelative(url) {
  return url && !/^\s*([a-z][a-z0-9+.-]*:|\/\/)/im.test(url);
}
function isValidDate(d) {
  return d instanceof Date && !isNaN(d) && d.getTime() != 0;
}
function rfc3339DateString(d) {
  if (!isValidDate(d)) {
    return undefined;
  }
  const pad = function (val, sp) {
    sp = sp || 2;
    return '0'.repeat(sp - ('' + val).length) + val;
  };
  const millis = d.getUTCMilliseconds();
  return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate()) + 'T' + pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes()) + ':' + pad(d.getUTCSeconds()) + (millis ? '.' + pad(millis, 3) : '') + 'Z';
}
function mergeObj(dst, src, ignore) {
  if (typeof src != 'object') {
    if (src === undefined) {
      return dst;
    }
    if (src === _config_js__WEBPACK_IMPORTED_MODULE_1__.DEL_CHAR) {
      return undefined;
    }
    return src;
  }
  if (src === null) {
    return src;
  }
  if (src instanceof Date && !isNaN(src)) {
    return !dst || !(dst instanceof Date) || isNaN(dst) || dst < src ? src : dst;
  }
  if (src instanceof _access_mode_js__WEBPACK_IMPORTED_MODULE_0__["default"]) {
    return new _access_mode_js__WEBPACK_IMPORTED_MODULE_0__["default"](src);
  }
  if (src instanceof Array) {
    return src;
  }
  if (!dst || dst === _config_js__WEBPACK_IMPORTED_MODULE_1__.DEL_CHAR) {
    dst = src.constructor();
  }
  for (let prop in src) {
    if (src.hasOwnProperty(prop) && (!ignore || !ignore[prop]) && prop != '_noForwarding') {
      try {
        dst[prop] = mergeObj(dst[prop], src[prop]);
      } catch (err) {}
    }
  }
  return dst;
}
function mergeToCache(cache, key, newval, ignore) {
  cache[key] = mergeObj(cache[key], newval, ignore);
  return cache[key];
}
function simplify(obj) {
  Object.keys(obj).forEach(key => {
    if (key[0] == '_') {
      delete obj[key];
    } else if (!obj[key]) {
      delete obj[key];
    } else if (Array.isArray(obj[key]) && obj[key].length == 0) {
      delete obj[key];
    } else if (!obj[key]) {
      delete obj[key];
    } else if (obj[key] instanceof Date) {
      if (!isValidDate(obj[key])) {
        delete obj[key];
      }
    } else if (typeof obj[key] == 'object') {
      simplify(obj[key]);
      if (Object.getOwnPropertyNames(obj[key]).length == 0) {
        delete obj[key];
      }
    }
  });
  return obj;
}
;
function normalizeArray(arr) {
  let out = [];
  if (Array.isArray(arr)) {
    for (let i = 0, l = arr.length; i < l; i++) {
      let t = arr[i];
      if (t) {
        t = t.trim().toLowerCase();
        if (t.length > 1) {
          out.push(t);
        }
      }
    }
    out = out.sort().filter((item, pos, ary) => {
      return !pos || item != ary[pos - 1];
    });
  }
  if (out.length == 0) {
    out.push(_config_js__WEBPACK_IMPORTED_MODULE_1__.DEL_CHAR);
  }
  return out;
}
function normalizeRanges(ranges, maxSeq) {
  if (!Array.isArray(ranges)) {
    return [];
  }
  ranges.sort((r1, r2) => {
    if (r1.low < r2.low) {
      return -1;
    }
    if (r1.low == r2.low) {
      return (r2.hi | 0) - r1.hi;
    }
    return 1;
  });
  ranges = ranges.reduce((out, r) => {
    if (r.low < _config_js__WEBPACK_IMPORTED_MODULE_1__.LOCAL_SEQID && r.low > 0) {
      if (!r.hi || r.hi < _config_js__WEBPACK_IMPORTED_MODULE_1__.LOCAL_SEQID) {
        out.push(r);
      } else {
        out.push({
          low: r.low,
          hi: maxSeq + 1
        });
      }
    }
    return out;
  }, []);
  ranges = ranges.reduce((out, r) => {
    if (out.length == 0) {
      out.push(r);
    } else {
      let prev = out[out.length - 1];
      if (r.low <= prev.hi) {
        prev.hi = Math.max(prev.hi, r.hi);
      } else {
        out.push(r);
      }
    }
    return out;
  }, []);
  return ranges;
}
function listToRanges(list) {
  list.sort((a, b) => a - b);
  return list.reduce((out, id) => {
    if (out.length == 0) {
      out.push({
        low: id
      });
    } else {
      let prev = out[out.length - 1];
      if (!prev.hi && id != prev.low + 1 || id > prev.hi) {
        out.push({
          low: id
        });
      } else {
        prev.hi = prev.hi ? Math.max(prev.hi, id + 1) : id + 1;
      }
    }
    return out;
  }, []);
}
function clipOutRange(src, clip) {
  if (clip.hi <= src.low || clip.low >= src.hi) {
    return [src];
  }
  if (clip.low <= src.low) {
    if (clip.hi >= src.hi) {
      return [];
    }
    return [{
      low: clip.hi,
      hi: src.hi
    }];
  }
  const result = [{
    low: src.low,
    hi: clip.low
  }];
  if (clip.hi < src.hi) {
    result.push({
      low: clip.hi,
      hi: src.hi
    });
  }
  return result;
}
function clipInRange(src, clip) {
  if (clip.hi <= src.low || clip.low >= src.hi) {
    return null;
  }
  if (src.low >= clip.low && src.hi <= clip.hi) {
    return src;
  }
  return {
    low: Math.max(src.low, clip.low),
    hi: Math.min(src.hi, clip.hi)
  };
  // removed by dead control flow
{}
}

/***/ }),

/***/ "./version.js":
/*!********************!*\
  !*** ./version.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PACKAGE_VERSION: () => (/* binding */ PACKAGE_VERSION)
/* harmony export */ });
const PACKAGE_VERSION = "0.24.0";

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
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
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
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!***********************!*\
  !*** ./src/tinode.js ***!
  \***********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AccessMode: () => (/* reexport safe */ _access_mode_js__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   Drafty: () => (/* reexport default from dynamic */ _drafty_js__WEBPACK_IMPORTED_MODULE_5___default.a),
/* harmony export */   Tinode: () => (/* binding */ Tinode)
/* harmony export */ });
/* harmony import */ var _access_mode_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./access-mode.js */ "./src/access-mode.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./config.js */ "./src/config.js");
/* harmony import */ var _comm_error_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./comm-error.js */ "./src/comm-error.js");
/* harmony import */ var _connection_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./connection.js */ "./src/connection.js");
/* harmony import */ var _db_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./db.js */ "./src/db.js");
/* harmony import */ var _drafty_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./drafty.js */ "./src/drafty.js");
/* harmony import */ var _drafty_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_drafty_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _large_file_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./large-file.js */ "./src/large-file.js");
/* harmony import */ var _meta_builder_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./meta-builder.js */ "./src/meta-builder.js");
/* harmony import */ var _topic_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./topic.js */ "./src/topic.js");
/* harmony import */ var _fnd_topic_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./fnd-topic.js */ "./src/fnd-topic.js");
/* harmony import */ var _me_topic_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./me-topic.js */ "./src/me-topic.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./utils.js */ "./src/utils.js");
/**
 * @module tinode-sdk
 *
 * @copyright 2015-2025 Tinode LLC.
 * @summary Javascript bindings for Tinode.
 * @license Apache 2.0
 * @version 0.24
 *
 * See <a href="https://github.com/tinode/webapp">https://github.com/tinode/webapp</a> for real-life usage.
 *
 * @example
 * <head>
 * <script src=".../tinode.js"></script>
 * </head>
 *
 * <body>
 *  ...
 * <script>
 *  // Instantiate tinode.
 *  const tinode = new Tinode(config, _ => {
 *    // Called on init completion.
 *  });
 *  tinode.enableLogging(true);
 *  tinode.onDisconnect = err => {
 *    // Handle disconnect.
 *  };
 *  // Connect to the server.
 *  tinode.connect('https://example.com/').then(_ => {
 *    // Connected. Login now.
 *    return tinode.loginBasic(login, password);
 *  }).then(ctrl => {
 *    // Logged in fine, attach callbacks, subscribe to 'me'.
 *    const me = tinode.getMeTopic();
 *    me.onMetaDesc = function(meta) { ... };
 *    // Subscribe, fetch topic description and the list of contacts.
 *    me.subscribe({get: {desc: {}, sub: {}}});
 *  }).catch(err => {
 *    // Login or subscription failed, do something.
 *    ...
 *  });
 *  ...
 * </script>
 * </body>
 */














let WebSocketProvider;
if (typeof WebSocket != 'undefined') {
  WebSocketProvider = WebSocket;
}
let XHRProvider;
if (typeof XMLHttpRequest != 'undefined') {
  XHRProvider = XMLHttpRequest;
}
let IndexedDBProvider;
if (typeof indexedDB != 'undefined') {
  IndexedDBProvider = indexedDB;
}

initForNonBrowserApp();
function initForNonBrowserApp() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  if (typeof btoa == 'undefined') {
    __webpack_require__.g.btoa = function (input = '') {
      let str = input;
      let output = '';
      for (let block = 0, charCode, i = 0, map = chars; str.charAt(i | 0) || (map = '=', i % 1); output += map.charAt(63 & block >> 8 - i % 1 * 8)) {
        charCode = str.charCodeAt(i += 3 / 4);
        if (charCode > 0xFF) {
          throw new Error("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
        }
        block = block << 8 | charCode;
      }
      return output;
    };
  }
  if (typeof atob == 'undefined') {
    __webpack_require__.g.atob = function (input = '') {
      let str = input.replace(/=+$/, '');
      let output = '';
      if (str.length % 4 == 1) {
        throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
      }
      for (let bc = 0, bs = 0, buffer, i = 0; buffer = str.charAt(i++); ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer, bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0) {
        buffer = chars.indexOf(buffer);
      }
      return output;
    };
  }
  if (typeof window == 'undefined') {
    __webpack_require__.g.window = {
      WebSocket: WebSocketProvider,
      XMLHttpRequest: XHRProvider,
      indexedDB: IndexedDBProvider,
      URL: {
        createObjectURL: function () {
          throw new Error("Unable to use URL.createObjectURL in a non-browser application");
        }
      }
    };
  }
  _connection_js__WEBPACK_IMPORTED_MODULE_3__["default"].setNetworkProviders(WebSocketProvider, XHRProvider);
  _large_file_js__WEBPACK_IMPORTED_MODULE_6__["default"].setNetworkProvider(XHRProvider);
  _db_js__WEBPACK_IMPORTED_MODULE_4__["default"].setDatabaseProvider(IndexedDBProvider);
}
function detectTransport() {
  if (typeof window == 'object') {
    if (window['WebSocket']) {
      return 'ws';
    } else if (window['XMLHttpRequest']) {
      return 'lp';
    }
  }
  return null;
}
function b64EncodeUnicode(str) {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function toSolidBytes(match, p1) {
    return String.fromCharCode('0x' + p1);
  }));
}
function jsonBuildHelper(key, val) {
  if (val instanceof Date) {
    val = (0,_utils_js__WEBPACK_IMPORTED_MODULE_11__.rfc3339DateString)(val);
  } else if (val instanceof _access_mode_js__WEBPACK_IMPORTED_MODULE_0__["default"]) {
    val = val.jsonHelper();
  } else if (val === undefined || val === null || val === false || Array.isArray(val) && val.length == 0 || typeof val == 'object' && Object.keys(val).length == 0) {
    return undefined;
  }
  return val;
}
;
function jsonLoggerHelper(key, val) {
  if (typeof val == 'string' && val.length > 128) {
    return '<' + val.length + ', bytes: ' + val.substring(0, 12) + '...' + val.substring(val.length - 12) + '>';
  }
  return jsonBuildHelper(key, val);
}
;
function getBrowserInfo(ua, product) {
  ua = ua || '';
  let reactnative = '';
  if (/reactnative/i.test(product)) {
    reactnative = 'ReactNative; ';
  }
  let result;
  ua = ua.replace(' (KHTML, like Gecko)', '');
  let m = ua.match(/(AppleWebKit\/[.\d]+)/i);
  if (m) {
    const priority = ['edg', 'chrome', 'safari', 'mobile', 'version'];
    let tmp = ua.substr(m.index + m[0].length).split(' ');
    let tokens = [];
    let version;
    for (let i = 0; i < tmp.length; i++) {
      let m2 = /([\w.]+)[\/]([\.\d]+)/.exec(tmp[i]);
      if (m2) {
        tokens.push([m2[1], m2[2], priority.findIndex(e => {
          return m2[1].toLowerCase().startsWith(e);
        })]);
        if (m2[1] == 'Version') {
          version = m2[2];
        }
      }
    }
    tokens.sort((a, b) => {
      return a[2] - b[2];
    });
    if (tokens.length > 0) {
      if (tokens[0][0].toLowerCase().startsWith('edg')) {
        tokens[0][0] = 'Edge';
      } else if (tokens[0][0] == 'OPR') {
        tokens[0][0] = 'Opera';
      } else if (tokens[0][0] == 'Safari' && version) {
        tokens[0][1] = version;
      }
      result = tokens[0][0] + '/' + tokens[0][1];
    } else {
      result = m[1];
    }
  } else if (/firefox/i.test(ua)) {
    m = /Firefox\/([.\d]+)/g.exec(ua);
    if (m) {
      result = 'Firefox/' + m[1];
    } else {
      result = 'Firefox/?';
    }
  } else {
    m = /([\w.]+)\/([.\d]+)/.exec(ua);
    if (m) {
      result = m[1] + '/' + m[2];
    } else {
      m = ua.split(' ');
      result = m[0];
    }
  }
  m = result.split('/');
  if (m.length > 1) {
    const v = m[1].split('.');
    const minor = v[1] ? '.' + v[1].substr(0, 2) : '';
    result = `${m[0]}/${v[0]}${minor}`;
  }
  return reactnative + result;
}
class Tinode {
  _host;
  _secure;
  _appName;
  _apiKey;
  _browser = '';
  _platform;
  _hwos = 'undefined';
  _humanLanguage = 'xx';
  _loggingEnabled = false;
  _trimLongStrings = false;
  _myUID = null;
  _authenticated = false;
  _login = null;
  _authToken = null;
  _inPacketCount = 0;
  _messageId = Math.floor(Math.random() * 0xFFFF + 0xFFFF);
  _serverInfo = null;
  _deviceToken = null;
  _pendingPromises = {};
  _expirePromises = null;
  _connection = null;
  _persist = false;
  _db = null;
  _cache = {};
  constructor(config, onComplete) {
    this._host = config.host;
    this._secure = config.secure;
    this._appName = config.appName || "Undefined";
    this._apiKey = config.apiKey;
    this._platform = config.platform || 'web';
    if (typeof navigator != 'undefined') {
      this._browser = getBrowserInfo(navigator.userAgent, navigator.product);
      this._hwos = navigator.platform;
      this._humanLanguage = navigator.language || 'en-US';
    }
    _connection_js__WEBPACK_IMPORTED_MODULE_3__["default"].logger = this.logger;
    (_drafty_js__WEBPACK_IMPORTED_MODULE_5___default().logger) = this.logger;
    if (config.transport != 'lp' && config.transport != 'ws') {
      config.transport = detectTransport();
    }
    this._connection = new _connection_js__WEBPACK_IMPORTED_MODULE_3__["default"](config, _config_js__WEBPACK_IMPORTED_MODULE_1__.PROTOCOL_VERSION, true);
    this._connection.onMessage = data => {
      this.#dispatchMessage(data);
    };
    this._connection.onOpen = _ => this.#connectionOpen();
    this._connection.onDisconnect = (err, code) => this.#disconnected(err, code);
    this._connection.onAutoreconnectIteration = (timeout, promise) => {
      if (this.onAutoreconnectIteration) {
        this.onAutoreconnectIteration(timeout, promise);
      }
    };
    this._persist = config.persist;
    this._db = new _db_js__WEBPACK_IMPORTED_MODULE_4__["default"](this.logger, this.logger);
    if (this._persist) {
      const prom = [];
      this._db.initDatabase().then(_ => {
        return this._db.mapTopics(data => {
          let topic = this.#cacheGet('topic', data.name);
          if (topic) {
            return;
          }
          if (data.name == _config_js__WEBPACK_IMPORTED_MODULE_1__.TOPIC_ME) {
            topic = new _me_topic_js__WEBPACK_IMPORTED_MODULE_10__["default"]();
          } else if (data.name == _config_js__WEBPACK_IMPORTED_MODULE_1__.TOPIC_FND) {
            topic = new _fnd_topic_js__WEBPACK_IMPORTED_MODULE_9__["default"]();
          } else {
            topic = new _topic_js__WEBPACK_IMPORTED_MODULE_8__["default"](data.name);
          }
          this._db.deserializeTopic(topic, data);
          this.#attachCacheToTopic(topic);
          topic._cachePutSelf();
          this._db.maxDelId(topic.name).then(clear => {
            topic._maxDel = Math.max(topic._maxDel, clear || 0);
          });
          delete topic._new;
          prom.push(topic._loadMessages(this._db));
        });
      }).then(_ => {
        return this._db.mapUsers(data => {
          this.#cachePut('user', data.uid, (0,_utils_js__WEBPACK_IMPORTED_MODULE_11__.mergeObj)({}, data.public));
        });
      }).then(_ => {
        return Promise.all(prom);
      }).then(_ => {
        if (onComplete) {
          onComplete();
        }
        this.logger("Persistent cache initialized.");
      }).catch(err => {
        if (onComplete) {
          onComplete(err);
        }
        this.logger("Failed to initialize persistent cache:", err);
      });
    } else {
      this._db.deleteDatabase().then(_ => {
        if (onComplete) {
          onComplete();
        }
      });
    }
  }
  logger(str, ...args) {
    if (this._loggingEnabled) {
      const d = new Date();
      const dateString = ('0' + d.getUTCHours()).slice(-2) + ':' + ('0' + d.getUTCMinutes()).slice(-2) + ':' + ('0' + d.getUTCSeconds()).slice(-2) + '.' + ('00' + d.getUTCMilliseconds()).slice(-3);
      console.log('[' + dateString + ']', str, args.join(' '));
    }
  }
  #makePromise(id) {
    let promise = null;
    if (id) {
      promise = new Promise((resolve, reject) => {
        this._pendingPromises[id] = {
          'resolve': resolve,
          'reject': reject,
          'ts': new Date()
        };
      });
    }
    return promise;
  }
  #execPromise(id, code, onOK, errorText) {
    const callbacks = this._pendingPromises[id];
    if (callbacks) {
      delete this._pendingPromises[id];
      if (code >= 200 && code < 400) {
        if (callbacks.resolve) {
          callbacks.resolve(onOK);
        }
      } else if (callbacks.reject) {
        callbacks.reject(new _comm_error_js__WEBPACK_IMPORTED_MODULE_2__["default"](errorText, code));
      }
    }
  }
  #send(pkt, id) {
    let promise;
    if (id) {
      promise = this.#makePromise(id);
    }
    pkt = (0,_utils_js__WEBPACK_IMPORTED_MODULE_11__.simplify)(pkt);
    let msg = JSON.stringify(pkt);
    this.logger("out: " + (this._trimLongStrings ? JSON.stringify(pkt, jsonLoggerHelper) : msg));
    try {
      this._connection.sendText(msg);
    } catch (err) {
      if (id) {
        this.#execPromise(id, _connection_js__WEBPACK_IMPORTED_MODULE_3__["default"].NETWORK_ERROR, null, err.message);
      } else {
        throw err;
      }
    }
    return promise;
  }
  #dispatchMessage(data) {
    if (!data) return;
    this._inPacketCount++;
    if (this.onRawMessage) {
      this.onRawMessage(data);
    }
    if (data === '0') {
      if (this.onNetworkProbe) {
        this.onNetworkProbe();
      }
      return;
    }
    let pkt = JSON.parse(data, _utils_js__WEBPACK_IMPORTED_MODULE_11__.jsonParseHelper);
    if (!pkt) {
      this.logger("in: " + data);
      this.logger("ERROR: failed to parse data");
    } else {
      this.logger("in: " + (this._trimLongStrings ? JSON.stringify(pkt, jsonLoggerHelper) : data));
      if (this.onMessage) {
        this.onMessage(pkt);
      }
      if (pkt.ctrl) {
        if (this.onCtrlMessage) {
          this.onCtrlMessage(pkt.ctrl);
        }
        if (pkt.ctrl.id) {
          this.#execPromise(pkt.ctrl.id, pkt.ctrl.code, pkt.ctrl, pkt.ctrl.text);
        }
        setTimeout(_ => {
          if (pkt.ctrl.code == 205 && pkt.ctrl.text == 'evicted') {
            const topic = this.#cacheGet('topic', pkt.ctrl.topic);
            if (topic) {
              topic._resetSub();
              if (pkt.ctrl.params && pkt.ctrl.params.unsub) {
                topic._gone();
              }
            }
          } else if (pkt.ctrl.code < 300 && pkt.ctrl.params) {
            if (pkt.ctrl.params.what == 'data') {
              const topic = this.#cacheGet('topic', pkt.ctrl.topic);
              if (topic) {
                topic._allMessagesReceived(pkt.ctrl.params.count);
              }
            } else if (pkt.ctrl.params.what == 'sub') {
              const topic = this.#cacheGet('topic', pkt.ctrl.topic);
              if (topic) {
                topic._processMetaSubs([]);
              }
            }
          }
        }, 0);
      } else {
        setTimeout(_ => {
          if (pkt.meta) {
            const topic = this.#cacheGet('topic', pkt.meta.topic);
            if (topic) {
              topic._routeMeta(pkt.meta);
            }
            if (pkt.meta.id) {
              this.#execPromise(pkt.meta.id, 200, pkt.meta, 'META');
            }
            if (this.onMetaMessage) {
              this.onMetaMessage(pkt.meta);
            }
          } else if (pkt.data) {
            const topic = this.#cacheGet('topic', pkt.data.topic);
            if (topic) {
              topic._routeData(pkt.data);
            }
            if (this.onDataMessage) {
              this.onDataMessage(pkt.data);
            }
          } else if (pkt.pres) {
            const topic = this.#cacheGet('topic', pkt.pres.topic);
            if (topic) {
              topic._routePres(pkt.pres);
            }
            if (this.onPresMessage) {
              this.onPresMessage(pkt.pres);
            }
          } else if (pkt.info) {
            const topic = this.#cacheGet('topic', pkt.info.topic);
            if (topic) {
              topic._routeInfo(pkt.info);
            }
            if (this.onInfoMessage) {
              this.onInfoMessage(pkt.info);
            }
          } else {
            this.logger("ERROR: Unknown packet received.");
          }
        }, 0);
      }
    }
  }
  #connectionOpen() {
    if (!this._expirePromises) {
      this._expirePromises = setInterval(_ => {
        const err = new _comm_error_js__WEBPACK_IMPORTED_MODULE_2__["default"]("timeout", 504);
        const expires = new Date(new Date().getTime() - _config_js__WEBPACK_IMPORTED_MODULE_1__.EXPIRE_PROMISES_TIMEOUT);
        for (let id in this._pendingPromises) {
          let callbacks = this._pendingPromises[id];
          if (callbacks && callbacks.ts < expires) {
            this.logger("Promise expired", id);
            delete this._pendingPromises[id];
            if (callbacks.reject) {
              callbacks.reject(err);
            }
          }
        }
      }, _config_js__WEBPACK_IMPORTED_MODULE_1__.EXPIRE_PROMISES_PERIOD);
    }
    this.hello();
  }
  #disconnected(err, code) {
    this._inPacketCount = 0;
    this._serverInfo = null;
    this._authenticated = false;
    if (this._expirePromises) {
      clearInterval(this._expirePromises);
      this._expirePromises = null;
    }
    this.#cacheMap('topic', (topic, key) => {
      topic._resetSub();
    });
    for (let key in this._pendingPromises) {
      const callbacks = this._pendingPromises[key];
      if (callbacks && callbacks.reject) {
        callbacks.reject(err);
      }
    }
    this._pendingPromises = {};
    if (this.onDisconnect) {
      this.onDisconnect(err);
    }
  }
  #getUserAgent() {
    return this._appName + ' (' + (this._browser ? this._browser + '; ' : '') + this._hwos + '); ' + _config_js__WEBPACK_IMPORTED_MODULE_1__.LIBRARY;
  }
  #initPacket(type, topic) {
    switch (type) {
      case 'hi':
        return {
          'hi': {
            'id': this.getNextUniqueId(),
            'ver': _config_js__WEBPACK_IMPORTED_MODULE_1__.VERSION,
            'ua': this.#getUserAgent(),
            'dev': this._deviceToken,
            'lang': this._humanLanguage,
            'platf': this._platform
          }
        };
      case 'acc':
        return {
          'acc': {
            'id': this.getNextUniqueId(),
            'user': null,
            'scheme': null,
            'secret': null,
            'tmpscheme': null,
            'tmpsecret': null,
            'login': false,
            'tags': null,
            'desc': {},
            'cred': {}
          }
        };
      case 'login':
        return {
          'login': {
            'id': this.getNextUniqueId(),
            'scheme': null,
            'secret': null
          }
        };
      case 'sub':
        return {
          'sub': {
            'id': this.getNextUniqueId(),
            'topic': topic,
            'set': {},
            'get': {}
          }
        };
      case 'leave':
        return {
          'leave': {
            'id': this.getNextUniqueId(),
            'topic': topic,
            'unsub': false
          }
        };
      case 'pub':
        return {
          'pub': {
            'id': this.getNextUniqueId(),
            'topic': topic,
            'noecho': false,
            'head': null,
            'content': {}
          }
        };
      case 'get':
        return {
          'get': {
            'id': this.getNextUniqueId(),
            'topic': topic,
            'what': null,
            'desc': {},
            'sub': {},
            'data': {}
          }
        };
      case 'set':
        return {
          'set': {
            'id': this.getNextUniqueId(),
            'topic': topic,
            'desc': {},
            'sub': {},
            'tags': [],
            'aux': {}
          }
        };
      case 'del':
        return {
          'del': {
            'id': this.getNextUniqueId(),
            'topic': topic,
            'what': null,
            'delseq': null,
            'user': null,
            'hard': false
          }
        };
      case 'note':
        return {
          'note': {
            'topic': topic,
            'what': null,
            'seq': undefined
          }
        };
      default:
        throw new Error(`Unknown packet type requested: ${type}`);
    }
  }
  #cachePut(type, name, obj) {
    this._cache[type + ':' + name] = obj;
  }
  #cacheGet(type, name) {
    return this._cache[type + ':' + name];
  }
  #cacheDel(type, name) {
    delete this._cache[type + ':' + name];
  }
  #cacheMap(type, func, context) {
    const key = type ? type + ':' : undefined;
    for (let idx in this._cache) {
      if (!key || idx.indexOf(key) == 0) {
        if (func.call(context, this._cache[idx], idx)) {
          break;
        }
      }
    }
  }
  #attachCacheToTopic(topic) {
    topic._tinode = this;
    topic._cacheGetUser = uid => {
      const pub = this.#cacheGet('user', uid);
      if (pub) {
        return {
          user: uid,
          public: (0,_utils_js__WEBPACK_IMPORTED_MODULE_11__.mergeObj)({}, pub)
        };
      }
      return undefined;
    };
    topic._cachePutUser = (uid, user) => {
      this.#cachePut('user', uid, (0,_utils_js__WEBPACK_IMPORTED_MODULE_11__.mergeObj)({}, user.public));
    };
    topic._cacheDelUser = uid => {
      this.#cacheDel('user', uid);
    };
    topic._cachePutSelf = _ => {
      this.#cachePut('topic', topic.name, topic);
    };
    topic._cacheDelSelf = _ => {
      this.#cacheDel('topic', topic.name);
    };
  }
  #loginSuccessful(ctrl) {
    if (!ctrl.params || !ctrl.params.user) {
      return ctrl;
    }
    this._myUID = ctrl.params.user;
    this._authenticated = ctrl && ctrl.code >= 200 && ctrl.code < 300;
    if (ctrl.params && ctrl.params.token && ctrl.params.expires) {
      this._authToken = {
        token: ctrl.params.token,
        expires: ctrl.params.expires
      };
    } else {
      this._authToken = null;
    }
    if (this.onLogin) {
      this.onLogin(ctrl.code, ctrl.text);
    }
    return ctrl;
  }
  static credential(meth, val, params, resp) {
    if (typeof meth == 'object') {
      ({
        val,
        params,
        resp,
        meth
      } = meth);
    }
    if (meth && (val || resp)) {
      return [{
        'meth': meth,
        'val': val,
        'resp': resp,
        'params': params
      }];
    }
    return null;
  }
  static topicType(name) {
    return _topic_js__WEBPACK_IMPORTED_MODULE_8__["default"].topicType(name);
  }
  static isMeTopicName(name) {
    return _topic_js__WEBPACK_IMPORTED_MODULE_8__["default"].isMeTopicName(name);
  }
  static isSelfTopicName(name) {
    return _topic_js__WEBPACK_IMPORTED_MODULE_8__["default"].isSelfTopicName(name);
  }
  static isGroupTopicName(name) {
    return _topic_js__WEBPACK_IMPORTED_MODULE_8__["default"].isGroupTopicName(name);
  }
  static isP2PTopicName(name) {
    return _topic_js__WEBPACK_IMPORTED_MODULE_8__["default"].isP2PTopicName(name);
  }
  static isCommTopicName(name) {
    return _topic_js__WEBPACK_IMPORTED_MODULE_8__["default"].isCommTopicName(name);
  }
  static isNewGroupTopicName(name) {
    return _topic_js__WEBPACK_IMPORTED_MODULE_8__["default"].isNewGroupTopicName(name);
  }
  static isChannelTopicName(name) {
    return _topic_js__WEBPACK_IMPORTED_MODULE_8__["default"].isChannelTopicName(name);
  }
  static getVersion() {
    return _config_js__WEBPACK_IMPORTED_MODULE_1__.VERSION;
  }
  static setNetworkProviders(wsProvider, xhrProvider) {
    WebSocketProvider = wsProvider;
    XHRProvider = xhrProvider;
    _connection_js__WEBPACK_IMPORTED_MODULE_3__["default"].setNetworkProviders(WebSocketProvider, XHRProvider);
    _large_file_js__WEBPACK_IMPORTED_MODULE_6__["default"].setNetworkProvider(XHRProvider);
  }
  static setDatabaseProvider(idbProvider) {
    IndexedDBProvider = idbProvider;
    _db_js__WEBPACK_IMPORTED_MODULE_4__["default"].setDatabaseProvider(IndexedDBProvider);
  }
  static getLibrary() {
    return _config_js__WEBPACK_IMPORTED_MODULE_1__.LIBRARY;
  }
  static isNullValue(str) {
    return str === _config_js__WEBPACK_IMPORTED_MODULE_1__.DEL_CHAR;
  }
  static isServerAssignedSeq(seq) {
    return seq > 0 && seq < _config_js__WEBPACK_IMPORTED_MODULE_1__.LOCAL_SEQID;
  }
  static isValidTagValue(tag) {
    const ALIAS_REGEX = /^[a-z0-9][a-z0-9_\-]{3,23}$/i;
    return tag && typeof tag == 'string' && tag.length > 3 && tag.length < 24 && ALIAS_REGEX.test(tag);
  }
  static tagSplit(tag) {
    if (!tag) {
      return null;
    }
    tag = tag.trim();
    const splitAt = tag.indexOf(':');
    if (splitAt <= 0) {
      return null;
    }
    const value = tag.substring(splitAt + 1);
    if (!value) {
      return null;
    }
    return {
      prefix: tag.substring(0, splitAt),
      value: value
    };
  }
  static setUniqueTag(tags, uniqueTag) {
    if (!tags || tags.length == 0) {
      return [uniqueTag];
    }
    const parts = Tinode.tagSplit(uniqueTag);
    if (!parts) {
      return tags;
    }
    tags = tags.filter(tag => tag && !tag.startsWith(parts.prefix));
    tags.push(uniqueTag);
    return tags;
  }
  static clearTagPrefix(tags, prefix) {
    if (!tags || tags.length == 0) {
      return [];
    }
    return tags.filter(tag => tag && !tag.startsWith(prefix));
  }
  static tagByPrefix(tags, prefix) {
    if (!tags) {
      return undefined;
    }
    return tags.find(tag => tag && tag.startsWith(prefix));
  }
  getNextUniqueId() {
    return this._messageId != 0 ? '' + this._messageId++ : undefined;
  }
  connect(host_) {
    return this._connection.connect(host_);
  }
  reconnect(force) {
    this._connection.reconnect(force);
  }
  disconnect() {
    this._connection.disconnect();
  }
  clearStorage() {
    if (this._db.isReady()) {
      return this._db.deleteDatabase();
    }
    return Promise.resolve();
  }
  initStorage() {
    if (!this._db.isReady()) {
      return this._db.initDatabase();
    }
    return Promise.resolve();
  }
  networkProbe() {
    this._connection.probe();
  }
  isConnected() {
    return this._connection.isConnected();
  }
  isAuthenticated() {
    return this._authenticated;
  }
  authorizeURL(url) {
    if (typeof url != 'string') {
      return url;
    }
    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_11__.isUrlRelative)(url)) {
      const base = 'scheme://host/';
      const parsed = new URL(url, base);
      if (this._apiKey) {
        parsed.searchParams.append('apikey', this._apiKey);
      }
      if (this._authToken && this._authToken.token) {
        parsed.searchParams.append('auth', 'token');
        parsed.searchParams.append('secret', this._authToken.token);
      }
      url = parsed.toString().substring(base.length - 1);
    }
    return url;
  }
  account(uid, scheme, secret, login, params) {
    const pkt = this.#initPacket('acc');
    pkt.acc.user = uid;
    pkt.acc.scheme = scheme;
    pkt.acc.secret = secret;
    pkt.acc.login = login;
    if (params) {
      pkt.acc.desc.defacs = params.defacs;
      pkt.acc.desc.public = params.public;
      pkt.acc.desc.private = params.private;
      pkt.acc.desc.trusted = params.trusted;
      pkt.acc.tags = params.tags;
      pkt.acc.cred = params.cred;
      pkt.acc.tmpscheme = params.scheme;
      pkt.acc.tmpsecret = params.secret;
      if (Array.isArray(params.attachments) && params.attachments.length > 0) {
        pkt.extra = {
          attachments: params.attachments.filter(ref => (0,_utils_js__WEBPACK_IMPORTED_MODULE_11__.isUrlRelative)(ref))
        };
      }
    }
    return this.#send(pkt, pkt.acc.id);
  }
  createAccount(scheme, secret, login, params) {
    let promise = this.account(_config_js__WEBPACK_IMPORTED_MODULE_1__.USER_NEW, scheme, secret, login, params);
    if (login) {
      promise = promise.then(ctrl => this.#loginSuccessful(ctrl));
    }
    return promise;
  }
  createAccountBasic(username, password, params) {
    username = username || '';
    password = password || '';
    return this.createAccount('basic', b64EncodeUnicode(username + ':' + password), true, params);
  }
  updateAccountBasic(uid, username, password, params) {
    username = username || '';
    password = password || '';
    return this.account(uid, 'basic', b64EncodeUnicode(username + ':' + password), false, params);
  }
  hello() {
    const pkt = this.#initPacket('hi');
    return this.#send(pkt, pkt.hi.id).then(ctrl => {
      this._connection.backoffReset();
      if (ctrl.params) {
        this._serverInfo = ctrl.params;
      }
      if (this.onConnect) {
        this.onConnect();
      }
      return ctrl;
    }).catch(err => {
      this._connection.reconnect(true);
      if (this.onDisconnect) {
        this.onDisconnect(err);
      }
    });
  }
  setDeviceToken(dt) {
    let sent = false;
    dt = dt || null;
    if (dt != this._deviceToken) {
      this._deviceToken = dt;
      if (this.isConnected() && this.isAuthenticated()) {
        this.#send({
          'hi': {
            'dev': dt || Tinode.DEL_CHAR
          }
        });
        sent = true;
      }
    }
    return sent;
  }
  login(scheme, secret, cred) {
    const pkt = this.#initPacket('login');
    pkt.login.scheme = scheme;
    pkt.login.secret = secret;
    pkt.login.cred = cred;
    return this.#send(pkt, pkt.login.id).then(ctrl => this.#loginSuccessful(ctrl));
  }
  loginBasic(uname, password, cred) {
    return this.login('basic', b64EncodeUnicode(uname + ':' + password), cred).then(ctrl => {
      this._login = uname;
      return ctrl;
    });
  }
  loginToken(token, cred) {
    return this.login('token', token, cred);
  }
  requestResetAuthSecret(scheme, method, value) {
    return this.login('reset', b64EncodeUnicode(scheme + ':' + method + ':' + value));
  }
  getAuthToken() {
    if (this._authToken && this._authToken.expires.getTime() > Date.now()) {
      return this._authToken;
    } else {
      this._authToken = null;
    }
    return null;
  }
  setAuthToken(token) {
    this._authToken = token;
  }
  subscribe(topicName, getParams, setParams) {
    const pkt = this.#initPacket('sub', topicName);
    if (!topicName) {
      topicName = _config_js__WEBPACK_IMPORTED_MODULE_1__.TOPIC_NEW;
    }
    pkt.sub.get = getParams;
    if (setParams) {
      if (setParams.sub) {
        pkt.sub.set.sub = setParams.sub;
      }
      if (setParams.desc) {
        const desc = setParams.desc;
        if (Tinode.isNewGroupTopicName(topicName)) {
          pkt.sub.set.desc = desc;
        } else if (Tinode.isP2PTopicName(topicName) && desc.defacs) {
          pkt.sub.set.desc = {
            defacs: desc.defacs
          };
        }
      }
      if (Array.isArray(setParams.attachments) && setParams.attachments.length > 0) {
        pkt.extra = {
          attachments: setParams.attachments.filter(ref => (0,_utils_js__WEBPACK_IMPORTED_MODULE_11__.isUrlRelative)(ref))
        };
      }
      if (setParams.tags) {
        pkt.sub.set.tags = setParams.tags;
      }
      if (setParams.aux) {
        pkt.sub.set.aux = setParams.aux;
      }
    }
    return this.#send(pkt, pkt.sub.id);
  }
  leave(topic, unsub) {
    const pkt = this.#initPacket('leave', topic);
    pkt.leave.unsub = unsub;
    return this.#send(pkt, pkt.leave.id);
  }
  createMessage(topic, content, noEcho) {
    const pkt = this.#initPacket('pub', topic);
    let dft = typeof content == 'string' ? _drafty_js__WEBPACK_IMPORTED_MODULE_5___default().parse(content) : content;
    if (dft && !_drafty_js__WEBPACK_IMPORTED_MODULE_5___default().isPlainText(dft)) {
      pkt.pub.head = {
        mime: _drafty_js__WEBPACK_IMPORTED_MODULE_5___default().getContentType()
      };
      content = dft;
    }
    pkt.pub.noecho = noEcho;
    pkt.pub.content = content;
    return pkt.pub;
  }
  publish(topicName, content, noEcho) {
    return this.publishMessage(this.createMessage(topicName, content, noEcho));
  }
  publishMessage(pub, attachments) {
    pub = Object.assign({}, pub);
    pub.seq = undefined;
    pub.from = undefined;
    pub.ts = undefined;
    const msg = {
      pub: pub
    };
    if (attachments) {
      msg.extra = {
        attachments: attachments.filter(ref => (0,_utils_js__WEBPACK_IMPORTED_MODULE_11__.isUrlRelative)(ref))
      };
    }
    return this.#send(msg, pub.id);
  }
  oobNotification(data) {
    this.logger('oob: ' + (this._trimLongStrings ? JSON.stringify(data, jsonLoggerHelper) : data));
    switch (data.what) {
      case 'msg':
        if (!data.seq || data.seq < 1 || !data.topic) {
          break;
        }
        if (!this.isConnected()) {
          break;
        }
        const topic = this.#cacheGet('topic', data.topic);
        if (!topic) {
          break;
        }
        if (topic.isSubscribed()) {
          break;
        }
        if (topic.maxMsgSeq() < data.seq) {
          if (topic.isChannelType()) {
            topic._updateReceived(data.seq, 'fake-uid');
          }
          if (data.xfrom && !this.#cacheGet('user', data.xfrom)) {
            this.getMeta(data.xfrom, new _meta_builder_js__WEBPACK_IMPORTED_MODULE_7__["default"]().withDesc().build()).catch(err => {
              this.logger("Failed to get the name of a new sender", err);
            });
          }
          topic.subscribe(null).then(_ => {
            return topic.getMeta(new _meta_builder_js__WEBPACK_IMPORTED_MODULE_7__["default"](topic).withLaterData(24).withLaterDel(24).build());
          }).then(_ => {
            topic.leaveDelayed(false, 1000);
          }).catch(err => {
            this.logger("On push data fetch failed", err);
          }).finally(_ => {
            this.getMeTopic()._refreshContact('msg', topic);
          });
        }
        break;
      case 'read':
        this.getMeTopic()._routePres({
          what: 'read',
          seq: data.seq
        });
        break;
      case 'sub':
        if (!this.isMe(data.xfrom)) {
          break;
        }
        const mode = {
          given: data.modeGiven,
          want: data.modeWant
        };
        const acs = new _access_mode_js__WEBPACK_IMPORTED_MODULE_0__["default"](mode);
        const pres = !acs.mode || acs.mode == _access_mode_js__WEBPACK_IMPORTED_MODULE_0__["default"]._NONE ? {
          what: 'gone',
          src: data.topic
        } : {
          what: 'acs',
          src: data.topic,
          dacs: mode
        };
        this.getMeTopic()._routePres(pres);
        break;
      default:
        this.logger("Unknown push type ignored", data.what);
    }
  }
  getMeta(topic, params) {
    const pkt = this.#initPacket('get', topic);
    pkt.get = (0,_utils_js__WEBPACK_IMPORTED_MODULE_11__.mergeObj)(pkt.get, params);
    return this.#send(pkt, pkt.get.id);
  }
  setMeta(topic, params) {
    const pkt = this.#initPacket('set', topic);
    const what = [];
    if (params) {
      ['desc', 'sub', 'tags', 'cred', 'aux'].forEach(key => {
        if (params.hasOwnProperty(key)) {
          what.push(key);
          pkt.set[key] = params[key];
        }
      });
      if (Array.isArray(params.attachments) && params.attachments.length > 0) {
        pkt.extra = {
          attachments: params.attachments.filter(ref => (0,_utils_js__WEBPACK_IMPORTED_MODULE_11__.isUrlRelative)(ref))
        };
      }
    }
    if (what.length == 0) {
      return Promise.reject(new Error("Invalid {set} parameters"));
    }
    return this.#send(pkt, pkt.set.id);
  }
  delMessages(topic, ranges, hard) {
    const pkt = this.#initPacket('del', topic);
    pkt.del.what = 'msg';
    pkt.del.delseq = ranges;
    pkt.del.hard = hard;
    return this.#send(pkt, pkt.del.id);
  }
  delTopic(topicName, hard) {
    const pkt = this.#initPacket('del', topicName);
    pkt.del.what = 'topic';
    pkt.del.hard = hard;
    return this.#send(pkt, pkt.del.id);
  }
  delSubscription(topicName, user) {
    const pkt = this.#initPacket('del', topicName);
    pkt.del.what = 'sub';
    pkt.del.user = user;
    return this.#send(pkt, pkt.del.id);
  }
  delCredential(method, value) {
    const pkt = this.#initPacket('del', _config_js__WEBPACK_IMPORTED_MODULE_1__.TOPIC_ME);
    pkt.del.what = 'cred';
    pkt.del.cred = {
      meth: method,
      val: value
    };
    return this.#send(pkt, pkt.del.id);
  }
  delCurrentUser(hard) {
    const pkt = this.#initPacket('del', null);
    pkt.del.what = 'user';
    pkt.del.hard = hard;
    return this.#send(pkt, pkt.del.id).then(_ => {
      this._myUID = null;
    });
  }
  note(topicName, what, seq) {
    if (seq <= 0 || seq >= _config_js__WEBPACK_IMPORTED_MODULE_1__.LOCAL_SEQID) {
      throw new Error(`Invalid message id ${seq}`);
    }
    const pkt = this.#initPacket('note', topicName);
    pkt.note.what = what;
    pkt.note.seq = seq;
    this.#send(pkt);
  }
  noteKeyPress(topicName, type) {
    const pkt = this.#initPacket('note', topicName);
    pkt.note.what = type || 'kp';
    this.#send(pkt);
  }
  videoCall(topicName, seq, evt, payload) {
    const pkt = this.#initPacket('note', topicName);
    pkt.note.seq = seq;
    pkt.note.what = 'call';
    pkt.note.event = evt;
    pkt.note.payload = payload;
    this.#send(pkt, pkt.note.id);
  }
  getTopic(topicName) {
    let topic = this.#cacheGet('topic', topicName);
    if (!topic && topicName) {
      if (topicName == _config_js__WEBPACK_IMPORTED_MODULE_1__.TOPIC_ME) {
        topic = new _me_topic_js__WEBPACK_IMPORTED_MODULE_10__["default"]();
      } else if (topicName == _config_js__WEBPACK_IMPORTED_MODULE_1__.TOPIC_FND) {
        topic = new _fnd_topic_js__WEBPACK_IMPORTED_MODULE_9__["default"]();
      } else {
        topic = new _topic_js__WEBPACK_IMPORTED_MODULE_8__["default"](topicName);
      }
      this.#attachCacheToTopic(topic);
      topic._cachePutSelf();
    }
    return topic;
  }
  cacheGetTopic(topicName) {
    return this.#cacheGet('topic', topicName);
  }
  cacheRemTopic(topicName) {
    this.#cacheDel('topic', topicName);
  }
  mapTopics(func, context) {
    this.#cacheMap('topic', func, context);
  }
  isTopicCached(topicName) {
    return !!this.#cacheGet('topic', topicName);
  }
  newGroupTopicName(isChan) {
    return (isChan ? _config_js__WEBPACK_IMPORTED_MODULE_1__.TOPIC_NEW_CHAN : _config_js__WEBPACK_IMPORTED_MODULE_1__.TOPIC_NEW) + this.getNextUniqueId();
  }
  getMeTopic() {
    return this.getTopic(_config_js__WEBPACK_IMPORTED_MODULE_1__.TOPIC_ME);
  }
  getFndTopic() {
    return this.getTopic(_config_js__WEBPACK_IMPORTED_MODULE_1__.TOPIC_FND);
  }
  getLargeFileHelper() {
    return new _large_file_js__WEBPACK_IMPORTED_MODULE_6__["default"](this, _config_js__WEBPACK_IMPORTED_MODULE_1__.PROTOCOL_VERSION);
  }
  getCurrentUserID() {
    return this._myUID;
  }
  isMe(uid) {
    return this._myUID === uid;
  }
  getCurrentLogin() {
    return this._login;
  }
  getServerInfo() {
    return this._serverInfo;
  }
  report(action, target) {
    return this.publish(_config_js__WEBPACK_IMPORTED_MODULE_1__.TOPIC_SYS, _drafty_js__WEBPACK_IMPORTED_MODULE_5___default().attachJSON(null, {
      'action': action,
      'target': target
    }));
  }
  getServerParam(name, defaultValue) {
    return this._serverInfo && this._serverInfo[name] || defaultValue;
  }
  enableLogging(enabled, trimLongStrings) {
    this._loggingEnabled = enabled;
    this._trimLongStrings = enabled && trimLongStrings;
  }
  setHumanLanguage(hl) {
    if (hl) {
      this._humanLanguage = hl;
    }
  }
  isTopicOnline(name) {
    const topic = this.#cacheGet('topic', name);
    return topic && topic.online;
  }
  getTopicAccessMode(name) {
    const topic = this.#cacheGet('topic', name);
    return topic ? topic.acs : null;
  }
  wantAkn(status) {
    if (status) {
      this._messageId = Math.floor(Math.random() * 0xFFFFFF + 0xFFFFFF);
    } else {
      this._messageId = 0;
    }
  }
  onWebsocketOpen = undefined;
  onConnect = undefined;
  onDisconnect = undefined;
  onLogin = undefined;
  onCtrlMessage = undefined;
  onDataMessage = undefined;
  onPresMessage = undefined;
  onMessage = undefined;
  onRawMessage = undefined;
  onNetworkProbe = undefined;
  onAutoreconnectIteration = undefined;
}
;
Tinode.MESSAGE_STATUS_NONE = _config_js__WEBPACK_IMPORTED_MODULE_1__.MESSAGE_STATUS_NONE;
Tinode.MESSAGE_STATUS_QUEUED = _config_js__WEBPACK_IMPORTED_MODULE_1__.MESSAGE_STATUS_QUEUED;
Tinode.MESSAGE_STATUS_SENDING = _config_js__WEBPACK_IMPORTED_MODULE_1__.MESSAGE_STATUS_SENDING;
Tinode.MESSAGE_STATUS_FAILED = _config_js__WEBPACK_IMPORTED_MODULE_1__.MESSAGE_STATUS_FAILED;
Tinode.MESSAGE_STATUS_FATAL = _config_js__WEBPACK_IMPORTED_MODULE_1__.MESSAGE_STATUS_FATAL;
Tinode.MESSAGE_STATUS_SENT = _config_js__WEBPACK_IMPORTED_MODULE_1__.MESSAGE_STATUS_SENT;
Tinode.MESSAGE_STATUS_RECEIVED = _config_js__WEBPACK_IMPORTED_MODULE_1__.MESSAGE_STATUS_RECEIVED;
Tinode.MESSAGE_STATUS_READ = _config_js__WEBPACK_IMPORTED_MODULE_1__.MESSAGE_STATUS_READ;
Tinode.MESSAGE_STATUS_TO_ME = _config_js__WEBPACK_IMPORTED_MODULE_1__.MESSAGE_STATUS_TO_ME;
Tinode.DEL_CHAR = _config_js__WEBPACK_IMPORTED_MODULE_1__.DEL_CHAR;
Tinode.MAX_MESSAGE_SIZE = 'maxMessageSize';
Tinode.MAX_SUBSCRIBER_COUNT = 'maxSubscriberCount';
Tinode.MIN_TAG_LENGTH = 'minTagLength';
Tinode.MAX_TAG_LENGTH = 'maxTagLength';
Tinode.MAX_TAG_COUNT = 'maxTagCount';
Tinode.MAX_FILE_UPLOAD_SIZE = 'maxFileUploadSize';
Tinode.REQ_CRED_VALIDATORS = 'reqCred';
Tinode.MSG_DELETE_AGE = 'msgDelAge';
Tinode.URI_TOPIC_ID_PREFIX = 'tinode:topic/';
Tinode.TAG_ALIAS = _config_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ALIAS;
Tinode.TAG_EMAIL = _config_js__WEBPACK_IMPORTED_MODULE_1__.TAG_EMAIL;
Tinode.TAG_PHONE = _config_js__WEBPACK_IMPORTED_MODULE_1__.TAG_PHONE;
})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=tinode.dev.js.map
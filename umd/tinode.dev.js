(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Tinode = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classStaticPrivateMethodGet(receiver, classConstructor, method) { _classCheckPrivateStaticAccess(receiver, classConstructor); return method; }

function _classCheckPrivateStaticAccess(receiver, classConstructor) { if (receiver !== classConstructor) { throw new TypeError("Private static access of wrong provenance"); } }

class AccessMode {
  constructor(acs) {
    if (acs) {
      this.given = typeof acs.given == 'number' ? acs.given : AccessMode.decode(acs.given);
      this.want = typeof acs.want == 'number' ? acs.want : AccessMode.decode(acs.want);
      this.mode = acs.mode ? typeof acs.mode == 'number' ? acs.mode : AccessMode.decode(acs.mode) : this.given & this.want;
    }
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
    return _classStaticPrivateMethodGet(AccessMode, AccessMode, _checkFlag).call(AccessMode, this, side, AccessMode._OWNER);
  }

  isPresencer(side) {
    return _classStaticPrivateMethodGet(AccessMode, AccessMode, _checkFlag).call(AccessMode, this, side, AccessMode._PRES);
  }

  isMuted(side) {
    return !this.isPresencer(side);
  }

  isJoiner(side) {
    return _classStaticPrivateMethodGet(AccessMode, AccessMode, _checkFlag).call(AccessMode, this, side, AccessMode._JOIN);
  }

  isReader(side) {
    return _classStaticPrivateMethodGet(AccessMode, AccessMode, _checkFlag).call(AccessMode, this, side, AccessMode._READ);
  }

  isWriter(side) {
    return _classStaticPrivateMethodGet(AccessMode, AccessMode, _checkFlag).call(AccessMode, this, side, AccessMode._WRITE);
  }

  isApprover(side) {
    return _classStaticPrivateMethodGet(AccessMode, AccessMode, _checkFlag).call(AccessMode, this, side, AccessMode._APPROVE);
  }

  isAdmin(side) {
    return this.isOwner(side) || this.isApprover(side);
  }

  isSharer(side) {
    return this.isAdmin(side) || _classStaticPrivateMethodGet(AccessMode, AccessMode, _checkFlag).call(AccessMode, this, side, AccessMode._SHARE);
  }

  isDeleter(side) {
    return _classStaticPrivateMethodGet(AccessMode, AccessMode, _checkFlag).call(AccessMode, this, side, AccessMode._DELETE);
  }

}

exports.default = AccessMode;

function _checkFlag(val, side, flag) {
  side = side || 'mode';

  if (['given', 'want', 'mode'].includes(side)) {
    return (val[side] & flag) != 0;
  }

  throw new Error("Invalid AccessMode component '".concat(side, "'"));
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

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classPrivateMethodInitSpec(obj, privateSet) { _checkPrivateRedeclaration(obj, privateSet); privateSet.add(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }

function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }

function _classPrivateMethodGet(receiver, privateSet, fn) { if (!privateSet.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return fn; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }

function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }

function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }

function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }

var _comparator = new WeakMap();

var _unique = new WeakMap();

var _findNearest = new WeakSet();

var _insertSorted = new WeakSet();

class CBuffer {
  constructor(compare_, unique_) {
    _classPrivateMethodInitSpec(this, _insertSorted);

    _classPrivateMethodInitSpec(this, _findNearest);

    _classPrivateFieldInitSpec(this, _comparator, {
      writable: true,
      value: undefined
    });

    _classPrivateFieldInitSpec(this, _unique, {
      writable: true,
      value: false
    });

    _defineProperty(this, "buffer", []);

    _classPrivateFieldSet(this, _comparator, compare_ || ((a, b) => {
      return a === b ? 0 : a < b ? -1 : 1;
    }));

    _classPrivateFieldSet(this, _unique, unique_);
  }

  getAt(at) {
    return this.buffer[at];
  }

  getLast(at) {
    at |= 0;
    return this.buffer.length > at ? this.buffer[this.buffer.length - 1 - at] : undefined;
  }

  put() {
    let insert;

    if (arguments.length == 1 && Array.isArray(arguments[0])) {
      insert = arguments[0];
    } else {
      insert = arguments;
    }

    for (let idx in insert) {
      _classPrivateMethodGet(this, _insertSorted, _insertSorted2).call(this, insert[idx], this.buffer);
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
    startIdx = startIdx | 0;
    beforeIdx = beforeIdx || this.buffer.length;

    for (let i = startIdx; i < beforeIdx; i++) {
      callback.call(context, this.buffer[i], i > startIdx ? this.buffer[i - 1] : undefined, i < beforeIdx - 1 ? this.buffer[i + 1] : undefined, i);
    }
  }

  find(elem, nearest) {
    const {
      idx
    } = _classPrivateMethodGet(this, _findNearest, _findNearest2).call(this, elem, this.buffer, !nearest);

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

}

exports.default = CBuffer;

function _findNearest2(elem, arr, exact) {
  let start = 0;
  let end = arr.length - 1;
  let pivot = 0;
  let diff = 0;
  let found = false;

  while (start <= end) {
    pivot = (start + end) / 2 | 0;
    diff = _classPrivateFieldGet(this, _comparator).call(this, arr[pivot], elem);

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

function _insertSorted2(elem, arr) {
  const found = _classPrivateMethodGet(this, _findNearest, _findNearest2).call(this, elem, arr, false);

  const count = found.exact && _classPrivateFieldGet(this, _unique) ? 1 : 0;
  arr.splice(found.idx, count, elem);
  return arr;
}

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VERSION = exports.USER_NEW = exports.TOPIC_SYS = exports.TOPIC_P2P = exports.TOPIC_NEW_CHAN = exports.TOPIC_NEW = exports.TOPIC_ME = exports.TOPIC_GRP = exports.TOPIC_FND = exports.TOPIC_CHAN = exports.PROTOCOL_VERSION = exports.MESSAGE_STATUS_TO_ME = exports.MESSAGE_STATUS_SENT = exports.MESSAGE_STATUS_SENDING = exports.MESSAGE_STATUS_RECEIVED = exports.MESSAGE_STATUS_READ = exports.MESSAGE_STATUS_QUEUED = exports.MESSAGE_STATUS_NONE = exports.MESSAGE_STATUS_FAILED = exports.MESSAGE_STATUS_DEL_RANGE = exports.LOCAL_SEQID = exports.LIBRARY = exports.EXPIRE_PROMISES_TIMEOUT = exports.EXPIRE_PROMISES_PERIOD = exports.DEL_CHAR = exports.DEFAULT_MESSAGES_PAGE = void 0;

var _version = require("../version.json");

const PROTOCOL_VERSION = '0';
exports.PROTOCOL_VERSION = PROTOCOL_VERSION;
const VERSION = _version.version || '0.18';
exports.VERSION = VERSION;
const LIBRARY = 'tinodejs/' + VERSION;
exports.LIBRARY = LIBRARY;
const TOPIC_NEW = 'new';
exports.TOPIC_NEW = TOPIC_NEW;
const TOPIC_NEW_CHAN = 'nch';
exports.TOPIC_NEW_CHAN = TOPIC_NEW_CHAN;
const TOPIC_ME = 'me';
exports.TOPIC_ME = TOPIC_ME;
const TOPIC_FND = 'fnd';
exports.TOPIC_FND = TOPIC_FND;
const TOPIC_SYS = 'sys';
exports.TOPIC_SYS = TOPIC_SYS;
const TOPIC_CHAN = 'chn';
exports.TOPIC_CHAN = TOPIC_CHAN;
const TOPIC_GRP = 'grp;';
exports.TOPIC_GRP = TOPIC_GRP;
const TOPIC_P2P = 'p2p';
exports.TOPIC_P2P = TOPIC_P2P;
const USER_NEW = 'new';
exports.USER_NEW = USER_NEW;
const LOCAL_SEQID = 0xFFFFFFF;
exports.LOCAL_SEQID = LOCAL_SEQID;
const MESSAGE_STATUS_NONE = 0;
exports.MESSAGE_STATUS_NONE = MESSAGE_STATUS_NONE;
const MESSAGE_STATUS_QUEUED = 1;
exports.MESSAGE_STATUS_QUEUED = MESSAGE_STATUS_QUEUED;
const MESSAGE_STATUS_SENDING = 2;
exports.MESSAGE_STATUS_SENDING = MESSAGE_STATUS_SENDING;
const MESSAGE_STATUS_FAILED = 3;
exports.MESSAGE_STATUS_FAILED = MESSAGE_STATUS_FAILED;
const MESSAGE_STATUS_SENT = 4;
exports.MESSAGE_STATUS_SENT = MESSAGE_STATUS_SENT;
const MESSAGE_STATUS_RECEIVED = 5;
exports.MESSAGE_STATUS_RECEIVED = MESSAGE_STATUS_RECEIVED;
const MESSAGE_STATUS_READ = 6;
exports.MESSAGE_STATUS_READ = MESSAGE_STATUS_READ;
const MESSAGE_STATUS_TO_ME = 7;
exports.MESSAGE_STATUS_TO_ME = MESSAGE_STATUS_TO_ME;
const MESSAGE_STATUS_DEL_RANGE = 8;
exports.MESSAGE_STATUS_DEL_RANGE = MESSAGE_STATUS_DEL_RANGE;
const EXPIRE_PROMISES_TIMEOUT = 5000;
exports.EXPIRE_PROMISES_TIMEOUT = EXPIRE_PROMISES_TIMEOUT;
const EXPIRE_PROMISES_PERIOD = 1000;
exports.EXPIRE_PROMISES_PERIOD = EXPIRE_PROMISES_PERIOD;
const DEFAULT_MESSAGES_PAGE = 24;
exports.DEFAULT_MESSAGES_PAGE = DEFAULT_MESSAGES_PAGE;
const DEL_CHAR = '\u2421';
exports.DEL_CHAR = DEL_CHAR;

},{"../version.json":12}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("./utils.js");

function _classPrivateMethodInitSpec(obj, privateSet) { _checkPrivateRedeclaration(obj, privateSet); privateSet.add(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }

function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }

function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }

function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }

function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateMethodGet(receiver, privateSet, fn) { if (!privateSet.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return fn; }

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
    url = "".concat(protocol, "://").concat(host);

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

var _boffTimer = new WeakMap();

var _boffIteration = new WeakMap();

var _boffClosed = new WeakMap();

var _socket = new WeakMap();

var _log = new WeakSet();

var _boffReconnect = new WeakSet();

var _boffStop = new WeakSet();

var _boffReset = new WeakSet();

var _init_lp = new WeakSet();

var _init_ws = new WeakSet();

class Connection {
  constructor(config, version_, autoreconnect_) {
    _classPrivateMethodInitSpec(this, _init_ws);

    _classPrivateMethodInitSpec(this, _init_lp);

    _classPrivateMethodInitSpec(this, _boffReset);

    _classPrivateMethodInitSpec(this, _boffStop);

    _classPrivateMethodInitSpec(this, _boffReconnect);

    _classPrivateMethodInitSpec(this, _log);

    _classPrivateFieldInitSpec(this, _boffTimer, {
      writable: true,
      value: null
    });

    _classPrivateFieldInitSpec(this, _boffIteration, {
      writable: true,
      value: 0
    });

    _classPrivateFieldInitSpec(this, _boffClosed, {
      writable: true,
      value: false
    });

    _classPrivateFieldInitSpec(this, _socket, {
      writable: true,
      value: null
    });

    _defineProperty(this, "host", void 0);

    _defineProperty(this, "secure", void 0);

    _defineProperty(this, "apiKey", void 0);

    _defineProperty(this, "version", void 0);

    _defineProperty(this, "autoreconnect", void 0);

    _defineProperty(this, "initialized", void 0);

    _defineProperty(this, "onMessage", undefined);

    _defineProperty(this, "onDisconnect", undefined);

    _defineProperty(this, "onOpen", undefined);

    _defineProperty(this, "onAutoreconnectIteration", undefined);

    _defineProperty(this, "logger", undefined);

    this.host = config.host;
    this.secure = config.secure;
    this.apiKey = config.apiKey;
    this.version = version_;
    this.autoreconnect = autoreconnect_;

    if (config.transport === 'lp') {
      _classPrivateMethodGet(this, _init_lp, _init_lp2).call(this);

      this.initialized = 'lp';
    } else if (config.transport === 'ws') {
      _classPrivateMethodGet(this, _init_ws, _init_ws2).call(this);

      this.initialized = 'ws';
    }

    if (!this.initialized) {
      _classPrivateMethodGet(this, _log, _log2).call(this, "Unknown or invalid network transport. Running under Node? Call 'Tinode.setNetworkProviders()'.");

      throw new Error("Unknown or invalid network transport. Running under Node? Call 'Tinode.setNetworkProviders()'.");
    }
  }

  static setNetworkProviders(wsProvider, xhrProvider) {
    WebSocketProvider = wsProvider;
    XHRProvider = xhrProvider;
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
    _classPrivateMethodGet(this, _boffReset, _boffReset2).call(this);
  }

}

exports.default = Connection;

function _log2(text) {
  if (Connection.logger) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    Connection.logger(text, ...args);
  }
}

function _boffReconnect2() {
  clearTimeout(_classPrivateFieldGet(this, _boffTimer));

  const timeout = _BOFF_BASE * (Math.pow(2, _classPrivateFieldGet(this, _boffIteration)) * (1.0 + _BOFF_JITTER * Math.random()));

  _classPrivateFieldSet(this, _boffIteration, _classPrivateFieldGet(this, _boffIteration) >= _BOFF_MAX_ITER ? _classPrivateFieldGet(this, _boffIteration) : _classPrivateFieldGet(this, _boffIteration) + 1);

  if (this.onAutoreconnectIteration) {
    this.onAutoreconnectIteration(timeout);
  }

  _classPrivateFieldSet(this, _boffTimer, setTimeout(() => {
    _classPrivateMethodGet(this, _log, _log2).call(this, "Reconnecting, iter=".concat(_classPrivateFieldGet(this, _boffIteration), ", timeout=").concat(timeout));

    if (!_classPrivateFieldGet(this, _boffClosed)) {
      const prom = this.connect();

      if (this.onAutoreconnectIteration) {
        this.onAutoreconnectIteration(0, prom);
      } else {
        prom.catch(() => {});
      }
    } else if (this.onAutoreconnectIteration) {
      this.onAutoreconnectIteration(-1);
    }
  }, timeout));
}

function _boffStop2() {
  clearTimeout(_classPrivateFieldGet(this, _boffTimer));

  _classPrivateFieldSet(this, _boffTimer, null);
}

function _boffReset2() {
  _classPrivateFieldSet(this, _boffIteration, 0);
}

function _init_lp2() {
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
        throw new Error("LP sender failed, ".concat(sender.status));
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
          let pkt = JSON.parse(poller.responseText, _utils.jsonParseHelper);
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
            _classPrivateMethodGet(this, _boffStop, _boffStop2).call(this);
          }
        } else if (poller.status < 400) {
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
            const code = poller.status || (_classPrivateFieldGet(this, _boffClosed) ? NETWORK_USER : NETWORK_ERROR);
            const text = poller.responseText || (_classPrivateFieldGet(this, _boffClosed) ? NETWORK_USER_TEXT : NETWORK_ERROR_TEXT);
            this.onDisconnect(new Error(text + ' (' + code + ')'), code);
          }

          poller = null;

          if (!_classPrivateFieldGet(this, _boffClosed) && this.autoreconnect) {
            _classPrivateMethodGet(this, _boffReconnect, _boffReconnect2).call(this);
          }
        }
      }
    };

    poller.open('GET', url_, true);
    return poller;
  };

  this.connect = (host_, force) => {
    _classPrivateFieldSet(this, _boffClosed, false);

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

      _classPrivateMethodGet(this, _log, _log2).call(this, "Connecting to:", url);

      _poller = lp_poller(url, resolve, reject);

      _poller.send(null);
    }).catch(err => {
      _classPrivateMethodGet(this, _log, _log2).call(this, "LP connection failed:", err);
    });
  };

  this.reconnect = force => {
    _classPrivateMethodGet(this, _boffStop, _boffStop2).call(this);

    this.connect(null, force);
  };

  this.disconnect = () => {
    _classPrivateFieldSet(this, _boffClosed, true);

    _classPrivateMethodGet(this, _boffStop, _boffStop2).call(this);

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
      this.onDisconnect(new Error(NETWORK_USER_TEXT + ' (' + NETWORK_USER + ')'), NETWORK_USER);
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

  this.isConnected = () => {
    return _poller && true;
  };
}

function _init_ws2() {
  this.connect = (host_, force) => {
    _classPrivateFieldSet(this, _boffClosed, false);

    if (_classPrivateFieldGet(this, _socket)) {
      if (!force && _classPrivateFieldGet(this, _socket).readyState == _classPrivateFieldGet(this, _socket).OPEN) {
        return Promise.resolve();
      }

      _classPrivateFieldGet(this, _socket).close();

      _classPrivateFieldSet(this, _socket, null);
    }

    if (host_) {
      this.host = host_;
    }

    return new Promise((resolve, reject) => {
      const url = makeBaseUrl(this.host, this.secure ? 'wss' : 'ws', this.version, this.apiKey);

      _classPrivateMethodGet(this, _log, _log2).call(this, "Connecting to: ", url);

      const conn = new WebSocketProvider(url);

      conn.onerror = err => {
        reject(err);
      };

      conn.onopen = evt => {
        if (this.autoreconnect) {
          _classPrivateMethodGet(this, _boffStop, _boffStop2).call(this);
        }

        if (this.onOpen) {
          this.onOpen();
        }

        resolve();
      };

      conn.onclose = evt => {
        _classPrivateFieldSet(this, _socket, null);

        if (this.onDisconnect) {
          const code = _classPrivateFieldGet(this, _boffClosed) ? NETWORK_USER : NETWORK_ERROR;
          this.onDisconnect(new Error(_classPrivateFieldGet(this, _boffClosed) ? NETWORK_USER_TEXT : NETWORK_ERROR_TEXT + ' (' + code + ')'), code);
        }

        if (!_classPrivateFieldGet(this, _boffClosed) && this.autoreconnect) {
          _classPrivateMethodGet(this, _boffReconnect, _boffReconnect2).call(this);
        }
      };

      conn.onmessage = evt => {
        if (this.onMessage) {
          this.onMessage(evt.data);
        }
      };

      _classPrivateFieldSet(this, _socket, conn);
    });
  };

  this.reconnect = force => {
    _classPrivateMethodGet(this, _boffStop, _boffStop2).call(this);

    this.connect(null, force);
  };

  this.disconnect = () => {
    _classPrivateFieldSet(this, _boffClosed, true);

    _classPrivateMethodGet(this, _boffStop, _boffStop2).call(this);

    if (!_classPrivateFieldGet(this, _socket)) {
      return;
    }

    _classPrivateFieldGet(this, _socket).close();

    _classPrivateFieldSet(this, _socket, null);
  };

  this.sendText = msg => {
    if (_classPrivateFieldGet(this, _socket) && _classPrivateFieldGet(this, _socket).readyState == _classPrivateFieldGet(this, _socket).OPEN) {
      _classPrivateFieldGet(this, _socket).send(msg);
    } else {
      throw new Error("Websocket is not connected");
    }
  };

  this.isConnected = () => {
    return _classPrivateFieldGet(this, _socket) && _classPrivateFieldGet(this, _socket).readyState == _classPrivateFieldGet(this, _socket).OPEN;
  };
}

Connection.NETWORK_ERROR = NETWORK_ERROR;
Connection.NETWORK_ERROR_TEXT = NETWORK_ERROR_TEXT;
Connection.NETWORK_USER = NETWORK_USER;
Connection.NETWORK_USER_TEXT = NETWORK_USER_TEXT;

},{"./utils.js":11}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classPrivateMethodInitSpec(obj, privateSet) { _checkPrivateRedeclaration(obj, privateSet); privateSet.add(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }

function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }

function _classStaticPrivateFieldSpecGet(receiver, classConstructor, descriptor) { _classCheckPrivateStaticAccess(receiver, classConstructor); _classCheckPrivateStaticFieldDescriptor(descriptor, "get"); return _classApplyDescriptorGet(receiver, descriptor); }

function _classCheckPrivateStaticFieldDescriptor(descriptor, action) { if (descriptor === undefined) { throw new TypeError("attempted to " + action + " private static field before its declaration"); } }

function _classPrivateMethodGet(receiver, privateSet, fn) { if (!privateSet.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return fn; }

function _classStaticPrivateMethodGet(receiver, classConstructor, method) { _classCheckPrivateStaticAccess(receiver, classConstructor); return method; }

function _classCheckPrivateStaticAccess(receiver, classConstructor) { if (receiver !== classConstructor) { throw new TypeError("Private static access of wrong provenance"); } }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }

function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }

function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }

function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }

const DB_VERSION = 1;
const DB_NAME = 'tinode-web';
let IDBProvider;

var _onError = new WeakMap();

var _logger = new WeakMap();

var _mapObjects = new WeakSet();

class DB {
  constructor(onError, logger) {
    _classPrivateMethodInitSpec(this, _mapObjects);

    _classPrivateFieldInitSpec(this, _onError, {
      writable: true,
      value: function () {}
    });

    _classPrivateFieldInitSpec(this, _logger, {
      writable: true,
      value: function () {}
    });

    _defineProperty(this, "db", null);

    _defineProperty(this, "disabled", false);

    _classPrivateFieldSet(this, _onError, onError || _classPrivateFieldGet(this, _onError));

    _classPrivateFieldSet(this, _logger, logger || _classPrivateFieldGet(this, _logger));
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
        _classPrivateFieldGet(this, _logger).call(this, 'PCache', "failed to initialize", event);

        reject(event.target.error);

        _classPrivateFieldGet(this, _onError).call(this, event.target.error);
      };

      req.onupgradeneeded = function (event) {
        this.db = event.target.result;

        this.db.onerror = function (event) {
          _classPrivateFieldGet(this, _logger).call(this, 'PCache', "failed to create storage", event);

          _classPrivateFieldGet(this, _onError).call(this, event.target.error);
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

      req.onblocked = function (event) {
        if (this.db) {
          this.db.close();
        }

        const err = new Error("blocked");

        _classPrivateFieldGet(this, _logger).call(this, 'PCache', 'deleteDatabase', err);

        reject(err);
      };

      req.onsuccess = event => {
        this.db = null;
        this.disabled = true;
        resolve(true);
      };

      req.onerror = event => {
        _classPrivateFieldGet(this, _logger).call(this, 'PCache', 'deleteDatabase', event.target.error);

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
        _classPrivateFieldGet(this, _logger).call(this, 'PCache', 'updTopic', event.target.error);

        reject(event.target.error);
      };

      const req = trx.objectStore('topic').get(topic.name);

      req.onsuccess = event => {
        trx.objectStore('topic').put(_classStaticPrivateMethodGet(DB, DB, _serializeTopic).call(DB, req.result, topic));
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
        _classPrivateFieldGet(this, _logger).call(this, 'PCache', 'markTopicAsDeleted', event.target.error);

        reject(event.target.error);
      };

      const req = trx.objectStore('topic').get(name);

      req.onsuccess = event => {
        const topic = event.target.result;

        if (topic._deleted != deleted) {
          topic._deleted = true;
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
        _classPrivateFieldGet(this, _logger).call(this, 'PCache', 'remTopic', event.target.error);

        reject(event.target.error);
      };

      trx.objectStore('topic').delete(IDBKeyRange.only(name));
      trx.objectStore('subscription').delete(IDBKeyRange.bound([name, '-'], [name, '~']));
      trx.objectStore('message').delete(IDBKeyRange.bound([name, 0], [name, Number.MAX_SAFE_INTEGER]));
      trx.commit();
    });
  }

  mapTopics(callback, context) {
    return _classPrivateMethodGet(this, _mapObjects, _mapObjects2).call(this, 'topic', callback, context);
  }

  deserializeTopic(topic, src) {
    _classStaticPrivateMethodGet(DB, DB, _deserializeTopic).call(DB, topic, src);
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
        _classPrivateFieldGet(this, _logger).call(this, 'PCache', 'updUser', event.target.error);

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
        _classPrivateFieldGet(this, _logger).call(this, 'PCache', 'remUser', event.target.error);

        reject(event.target.error);
      };

      trx.objectStore('user').delete(IDBKeyRange.only(uid));
      trx.commit();
    });
  }

  mapUsers(callback, context) {
    return _classPrivateMethodGet(this, _mapObjects, _mapObjects2).call(this, 'user', callback, context);
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
        _classPrivateFieldGet(this, _logger).call(this, 'PCache', 'getUser', event.target.error);

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
        _classPrivateFieldGet(this, _logger).call(this, 'PCache', 'updSubscription', event.target.error);

        reject(event.target.error);
      };

      trx.objectStore('subscription').get([topicName, uid]).onsuccess = event => {
        trx.objectStore('subscription').put(_classStaticPrivateMethodGet(DB, DB, _serializeSubscription).call(DB, event.target.result, topicName, uid, sub));
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
        _classPrivateFieldGet(this, _logger).call(this, 'PCache', 'mapSubscriptions', event.target.error);

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
        _classPrivateFieldGet(this, _logger).call(this, 'PCache', 'addMessage', event.target.error);

        reject(event.target.error);
      };

      trx.objectStore('message').add(_classStaticPrivateMethodGet(DB, DB, _serializeMessage).call(DB, null, msg));
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
        _classPrivateFieldGet(this, _logger).call(this, 'PCache', 'updMessageStatus', event.target.error);

        reject(event.target.error);
      };

      const req = trx.objectStore('message').get(IDBKeyRange.only([topicName, seq]));

      req.onsuccess = event => {
        const src = req.result || event.target.result;

        if (!src || src._status == status) {
          trx.commit();
          return;
        }

        trx.objectStore('message').put(_classStaticPrivateMethodGet(DB, DB, _serializeMessage).call(DB, src, {
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
        _classPrivateFieldGet(this, _logger).call(this, 'PCache', 'remMessages', event.target.error);

        reject(event.target.error);
      };

      trx.objectStore('message').delete(range);
      trx.commit();
    });
  }

  readMessages(topicName, query, callback, context) {
    if (!this.isReady()) {
      return this.disabled ? Promise.resolve([]) : Promise.reject(new Error("not initialized"));
    }

    return new Promise((resolve, reject) => {
      query = query || {};
      const since = query.since > 0 ? query.since : 0;
      const before = query.before > 0 ? query.before : Number.MAX_SAFE_INTEGER;
      const limit = query.limit | 0;
      const result = [];
      const range = IDBKeyRange.bound([topicName, since], [topicName, before], false, true);
      const trx = this.db.transaction(['message']);

      trx.onerror = event => {
        _classPrivateFieldGet(this, _logger).call(this, 'PCache', 'readMessages', event.target.error);

        reject(event.target.error);
      };

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

  static setDatabaseProvider(idbProvider) {
    IDBProvider = idbProvider;
  }

}

exports.default = DB;

function _mapObjects2(source, callback, context) {
  if (!this.db) {
    return disabled ? Promise.resolve([]) : Promise.reject(new Error("not initialized"));
  }

  return new Promise((resolve, reject) => {
    const trx = this.db.transaction([source]);

    trx.onerror = event => {
      _classPrivateFieldGet(this, _logger).call(this, 'PCache', 'mapObjects', source, event.target.error);

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

function _deserializeTopic(topic, src) {
  _classStaticPrivateFieldSpecGet(DB, DB, _topic_fields).forEach(f => {
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

function _serializeTopic(dst, src) {
  const res = dst || {
    name: src.name
  };

  _classStaticPrivateFieldSpecGet(DB, DB, _topic_fields).forEach(f => {
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

function _serializeSubscription(dst, topicName, uid, sub) {
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

function _serializeMessage(dst, msg) {
  const fields = ['topic', 'seq', 'ts', '_status', 'from', 'head', 'content'];
  const res = dst || {};
  fields.forEach(f => {
    if (msg.hasOwnProperty(f)) {
      res[f] = msg[f];
    }
  });
  return res;
}

var _topic_fields = {
  writable: true,
  value: ['created', 'updated', 'deleted', 'read', 'recv', 'seq', 'clear', 'defacs', 'creds', 'public', 'trusted', 'private', 'touched', '_deleted']
};

},{}],6:[function(require,module,exports){
/**
 * @copyright 2015-2022 Tinode LLC.
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
'use strict';

const MAX_FORM_ELEMENTS = 8;
const MAX_PREVIEW_ATTACHMENTS = 3;
const MAX_PREVIEW_DATA_SIZE = 64;
const JSON_MIME_TYPE = 'application/json';
const DRAFTY_MIME_TYPE = 'text/x-drafty';
const ALLOWED_ENT_FIELDS = ['act', 'height', 'duration', 'mime', 'name', 'preview', 'ref', 'size', 'url', 'val', 'width'];
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
const HTML_TAGS = {
  AU: {
    name: 'audio',
    isVoid: false
  },
  BN: {
    name: 'button',
    isVoid: false
  },
  BR: {
    name: 'br',
    isVoid: true
  },
  CO: {
    name: 'tt',
    isVoid: false
  },
  DL: {
    name: 'del',
    isVoid: false
  },
  EM: {
    name: 'i',
    isVoid: false
  },
  EX: {
    name: '',
    isVoid: true
  },
  FM: {
    name: 'div',
    isVoid: false
  },
  HD: {
    name: '',
    isVoid: false
  },
  HL: {
    name: 'span',
    isVoid: false
  },
  HT: {
    name: 'a',
    isVoid: false
  },
  IM: {
    name: 'img',
    isVoid: false
  },
  LN: {
    name: 'a',
    isVoid: false
  },
  MN: {
    name: 'a',
    isVoid: false
  },
  RW: {
    name: 'div',
    isVoid: false
  },
  QQ: {
    name: 'div',
    isVoid: false
  },
  ST: {
    name: 'b',
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
        'data-size': data.val ? data.val.length * 0.75 | 0 : data.size | 0,
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

    for (let i = 1; i < blx.length; i++) {
      const block = blx[i];
      const offset = result.txt.length + 1;
      result.fmt.push({
        tp: 'BR',
        len: 1,
        at: offset - 1
      });
      result.txt += ' ' + block.txt;

      if (block.fmt) {
        result.fmt = result.fmt.concat(block.fmt.map(s => {
          s.at += offset;
          return s;
        }));
      }

      if (block.ent) {
        result.fmt = result.fmt.concat(block.ent.map(s => {
          s.at += offset;
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
  const len = first.txt.length;

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
      val: imageDesc.preview,
      width: imageDesc.width,
      height: imageDesc.height,
      name: imageDesc.filename,
      size: imageDesc.size | 0,
      ref: imageDesc.refurl
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
      val: audioDesc.data,
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

Drafty.quote = function (header, uid, body) {
  const quote = Drafty.append(Drafty.appendLineBreak(Drafty.mention(header, uid)), body);
  quote.fmt.push({
    at: 0,
    len: quote.txt.length,
    tp: 'QQ'
  });
  return quote;
};

Drafty.mention = function (name, uid) {
  return {
    txt: name || '',
    fmt: [{
      at: 0,
      len: (name || '').length,
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
    }, err => {
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
    at: content.txt.length,
    len: 1,
    tp: 'BR'
  });
  content.txt += ' ';
  return content;
};

Drafty.UNSAFE_toHTML = function (doc) {
  let tree = draftyToTree(doc);

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
  tree = treeTopDown(tree, node => {
    const data = copyEntData(node.data, true, node.type == 'IM' ? ['val'] : null);

    if (data) {
      node.data = data;
    } else {
      delete node.data;
    }

    return node;
  });
  return treeToDrafty({}, tree, []);
};

Drafty.preview = function (original, limit) {
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
  tree = lightEntity(tree);
  return treeToDrafty({}, tree, []);
};

Drafty.toPlainText = function (content) {
  return typeof content == 'string' ? content : content.txt;
};

Drafty.isPlainText = function (content) {
  return typeof content == 'string' || !(content.fmt || content.ent);
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

  let i = 0;
  content.fmt.forEach(fmt => {
    if (fmt && fmt.at < 0) {
      const ent = content.ent[fmt.key | 0];

      if (ent && ent.tp == 'EX' && ent.data) {
        callback.call(context, ent.data, i++, 'EX');
      }
    }
  });
};

Drafty.hasEntities = function (content) {
  return content.ent && content.ent.length > 0;
};

Drafty.entities = function (content, callback, context) {
  if (content.ent && content.ent.length > 0) {
    for (let i in content.ent) {
      if (content.ent[i]) {
        callback.call(context, content.ent[i].data, i, content.ent[i].tp);
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
  return style ? HTML_TAGS[style] ? HTML_TAGS[style].name : '_UNKN' : undefined;
};

Drafty.attrValue = function (style, data) {
  if (data && DECORATORS[style]) {
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
    } else if (at + len > txt.length) {
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
  let tree = spansToTree({}, txt, 0, txt.length, spans);

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

function spansToTree(parent, text, start, end, spans) {
  if (!spans || spans.length == 0) {
    if (start < end) {
      addNode(parent, {
        text: text.substring(start, end)
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
        text: text.substring(start, span.start)
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
          const tag = HTML_TAGS[inner.tp] || {};

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
    }, text, start, span.end, subspans));
    start = span.end;
  }

  if (start < end) {
    addNode(parent, {
      text: text.substring(start, end)
    });
  }

  return parent;
}

function treeToDrafty(doc, tree, keymap) {
  if (!tree) {
    return doc;
  }

  doc.txt = doc.txt || '';
  const start = doc.txt.length;

  if (tree.text) {
    doc.txt += tree.text;
  } else if (Array.isArray(tree.children)) {
    tree.children.forEach(c => {
      treeToDrafty(doc, c, keymap);
    });
  }

  if (tree.type) {
    const len = doc.txt.length - start;
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
      const len = node.text.length;

      if (len > limit) {
        node.text = node.text.substring(0, limit) + tail;
        limit = -1;
      } else {
        limit -= len;
      }
    }

    return node;
  };

  return treeTopDown(tree, shortener);
}

function lightEntity(tree) {
  const lightCopy = function (node) {
    const data = copyEntData(node.data, true);

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
  } else if (tree.children && tree.children.length > 0) {
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

if (typeof module != 'undefined') {
  module.exports = Drafty;
}

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("./utils.js");

let XHRProvider;

class LargeFileHelper {
  constructor(tinode, version) {
    this._tinode = tinode;
    this._version = version;
    this._apiKey = tinode._apiKey;
    this._authToken = tinode.getAuthToken();
    this._reqId = tinode.getNextUniqueId();
    this.xhr = new XHRProvider();
    this.toResolve = null;
    this.toReject = null;
    this.onProgress = null;
    this.onSuccess = null;
    this.onFailure = null;
  }

  uploadWithBaseUrl(baseUrl, data, avatarFor, onProgress, onSuccess, onFailure) {
    if (!this._authToken) {
      throw new Error("Must authenticate first");
    }

    const instance = this;
    let url = "/v".concat(this._version, "/file/u/");

    if (baseUrl) {
      let base = baseUrl;

      if (base.endsWith('/')) {
        base = base.slice(0, -1);
      }

      if (base.startsWith('http://') || base.startsWith('https://')) {
        url = base + url;
      } else {
        throw new Error("Invalid base URL '".concat(baseUrl, "'"));
      }
    }

    this.xhr.open('POST', url, true);
    this.xhr.setRequestHeader('X-Tinode-APIKey', this._apiKey);
    this.xhr.setRequestHeader('X-Tinode-Auth', "Token ".concat(this._authToken.token));
    const result = new Promise((resolve, reject) => {
      this.toResolve = resolve;
      this.toReject = reject;
    });
    this.onProgress = onProgress;
    this.onSuccess = onSuccess;
    this.onFailure = onFailure;

    this.xhr.upload.onprogress = e => {
      if (e.lengthComputable && instance.onProgress) {
        instance.onProgress(e.loaded / e.total);
      }
    };

    this.xhr.onload = function () {
      let pkt;

      try {
        pkt = JSON.parse(this.response, _utils.jsonParseHelper);
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
        if (instance.toResolve) {
          instance.toResolve(pkt.ctrl.params.url);
        }

        if (instance.onSuccess) {
          instance.onSuccess(pkt.ctrl);
        }
      } else if (this.status >= 400) {
        if (instance.toReject) {
          instance.toReject(new Error("".concat(pkt.ctrl.text, " (").concat(pkt.ctrl.code, ")")));
        }

        if (instance.onFailure) {
          instance.onFailure(pkt.ctrl);
        }
      } else {
        instance._tinode.logger("ERROR: Unexpected server response status", this.status, this.response);
      }
    };

    this.xhr.onerror = function (e) {
      if (instance.toReject) {
        instance.toReject(new Error("failed"));
      }

      if (instance.onFailure) {
        instance.onFailure(null);
      }
    };

    this.xhr.onabort = function (e) {
      if (instance.toReject) {
        instance.toReject(new Error("upload cancelled by user"));
      }

      if (instance.onFailure) {
        instance.onFailure(null);
      }
    };

    try {
      const form = new FormData();
      form.append('file', data);
      form.set('id', this._reqId);

      if (avatarFor) {
        form.set('topic', avatarFor);
      }

      this.xhr.send(form);
    } catch (err) {
      if (this.toReject) {
        this.toReject(err);
      }

      if (this.onFailure) {
        this.onFailure(null);
      }
    }

    return result;
  }

  upload(data, avatarFor, onProgress, onSuccess, onFailure) {
    const baseUrl = (this._tinode._secure ? 'https://' : 'http://') + this._tinode._host;
    return this.uploadWithBaseUrl(baseUrl, data, avatarFor, onProgress, onSuccess, onFailure);
  }

  download(relativeUrl, filename, mimetype, onProgress, onError) {
    if (!Tinode.isRelativeURL(relativeUrl)) {
      if (onError) {
        onError("The URL '".concat(relativeUrl, "' must be relative, not absolute"));
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
    this.xhr.open('GET', relativeUrl, true);
    this.xhr.setRequestHeader('X-Tinode-APIKey', this._apiKey);
    this.xhr.setRequestHeader('X-Tinode-Auth', 'Token ' + this._authToken.token);
    this.xhr.responseType = 'blob';
    this.onProgress = onProgress;

    this.xhr.onprogress = function (e) {
      if (instance.onProgress) {
        instance.onProgress(e.loaded);
      }
    };

    const result = new Promise((resolve, reject) => {
      this.toResolve = resolve;
      this.toReject = reject;
    });

    this.xhr.onload = function () {
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

        if (instance.toResolve) {
          instance.toResolve();
        }
      } else if (this.status >= 400 && instance.toReject) {
        const reader = new FileReader();

        reader.onload = function () {
          try {
            const pkt = JSON.parse(this.result, _utils.jsonParseHelper);
            instance.toReject(new Error("".concat(pkt.ctrl.text, " (").concat(pkt.ctrl.code, ")")));
          } catch (err) {
            instance._tinode.logger("ERROR: Invalid server response in LargeFileHelper", this.result);

            instance.toReject(err);
          }
        };

        reader.readAsText(this.response);
      }
    };

    this.xhr.onerror = function (e) {
      if (instance.toReject) {
        instance.toReject(new Error("failed"));
      }
    };

    this.xhr.onabort = function () {
      if (instance.toReject) {
        instance.toReject(null);
      }
    };

    try {
      this.xhr.send();
    } catch (err) {
      if (this.toReject) {
        this.toReject(err);
      }
    }

    return result;
  }

  cancel() {
    if (this.xhr && this.xhr.readyState < 4) {
      this.xhr.abort();
    }
  }

  getId() {
    return this._reqId;
  }

  static setNetworkProvider(xhrProvider) {
    XHRProvider = xhrProvider;
  }

}

exports.default = LargeFileHelper;

},{"./utils.js":11}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classPrivateMethodInitSpec(obj, privateSet) { _checkPrivateRedeclaration(obj, privateSet); privateSet.add(obj); }

function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }

function _classPrivateMethodGet(receiver, privateSet, fn) { if (!privateSet.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return fn; }

var _get_desc_ims = new WeakSet();

var _get_subs_ims = new WeakSet();

class MetaGetBuilder {
  constructor(parent) {
    _classPrivateMethodInitSpec(this, _get_subs_ims);

    _classPrivateMethodInitSpec(this, _get_desc_ims);

    this.topic = parent;
    this.what = {};
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
    return this.withDesc(_classPrivateMethodGet(this, _get_desc_ims, _get_desc_ims2).call(this));
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
    return this.withSub(_classPrivateMethodGet(this, _get_subs_ims, _get_subs_ims2).call(this), limit);
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
    ['data', 'sub', 'desc', 'tags', 'cred', 'del'].forEach(key => {
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

exports.default = MetaGetBuilder;

function _get_desc_ims2() {
  return this.topic.updated;
}

function _get_subs_ims2() {
  if (this.topic.isP2PType()) {
    return _classPrivateMethodGet(this, _get_desc_ims, _get_desc_ims2).call(this);
  }

  return this.topic._lastSubsUpdate;
}

},{}],9:[function(require,module,exports){
(function (global){(function (){
/**
 * @file SDK to connect to Tinode chat server.
 * See <a href="https://github.com/tinode/webapp">https://github.com/tinode/webapp</a> for real-life usage.
 *
 * @copyright 2015-2022 Tinode LLC.
 * @summary Javascript bindings for Tinode.
 * @license Apache 2.0
 * @version 0.18
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
 *  const tinode = new Tinode(config, () => {
 *    // Called on init completion.
 *  });
 *  tinode.enableLogging(true);
 *  tinode.onDisconnect = (err) => {
 *    // Handle disconnect.
 *  };
 *  // Connect to the server.
 *  tinode.connect('https://example.com/').then(() => {
 *    // Connected. Login now.
 *    return tinode.loginBasic(login, password);
 *  }).then((ctrl) => {
 *    // Logged in fine, attach callbacks, subscribe to 'me'.
 *    const me = tinode.getMeTopic();
 *    me.onMetaDesc = function(meta) { ... };
 *    // Subscribe, fetch topic description and the list of contacts.
 *    me.subscribe({get: {desc: {}, sub: {}}});
 *  }).catch((err) => {
 *    // Login or subscription failed, do something.
 *    ...
 *  });
 *  ...
 * </script>
 * </body>
 */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Drafty", {
  enumerable: true,
  get: function () {
    return _drafty.default;
  }
});
exports.Tinode = void 0;

var _accessMode = _interopRequireDefault(require("./access-mode.js"));

var Const = _interopRequireWildcard(require("./config.js"));

var _connection = _interopRequireDefault(require("./connection.js"));

var _db = _interopRequireDefault(require("./db.js"));

var _drafty = _interopRequireDefault(require("./drafty.js"));

var _largeFile = _interopRequireDefault(require("./large-file.js"));

var _topic = require("./topic.js");

var _utils = require("./utils.js");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classPrivateMethodInitSpec(obj, privateSet) { _checkPrivateRedeclaration(obj, privateSet); privateSet.add(obj); }

function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classPrivateMethodGet(receiver, privateSet, fn) { if (!privateSet.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return fn; }

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
    global.btoa = function () {
      let input = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
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
    global.atob = function () {
      let input = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
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
    global.window = {
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

  _connection.default.setNetworkProviders(WebSocketProvider, XHRProvider);

  _largeFile.default.setNetworkProvider(XHRProvider);

  _db.default.setDatabaseProvider(IndexedDBProvider);
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
    val = (0, _utils.rfc3339DateString)(val);
  } else if (val instanceof _accessMode.default) {
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
    result = "".concat(m[0], "/").concat(v[0]).concat(minor);
  }

  return reactnative + result;
}

var _logger = new WeakSet();

var _makePromise = new WeakSet();

var _execPromise = new WeakSet();

var _send = new WeakSet();

var _dispatchMessage = new WeakSet();

var _connectionOpen = new WeakSet();

var _disconnected = new WeakSet();

var _getUserAgent = new WeakSet();

var _initPacket = new WeakSet();

var _cachePut = new WeakSet();

var _cacheGet = new WeakSet();

var _cacheDel = new WeakSet();

var _cacheMap = new WeakSet();

var _attachCacheToTopic = new WeakSet();

var _loginSuccessful = new WeakSet();

class Tinode {
  constructor(config, onComplete) {
    var _this = this;

    _classPrivateMethodInitSpec(this, _loginSuccessful);

    _classPrivateMethodInitSpec(this, _attachCacheToTopic);

    _classPrivateMethodInitSpec(this, _cacheMap);

    _classPrivateMethodInitSpec(this, _cacheDel);

    _classPrivateMethodInitSpec(this, _cacheGet);

    _classPrivateMethodInitSpec(this, _cachePut);

    _classPrivateMethodInitSpec(this, _initPacket);

    _classPrivateMethodInitSpec(this, _getUserAgent);

    _classPrivateMethodInitSpec(this, _disconnected);

    _classPrivateMethodInitSpec(this, _connectionOpen);

    _classPrivateMethodInitSpec(this, _dispatchMessage);

    _classPrivateMethodInitSpec(this, _send);

    _classPrivateMethodInitSpec(this, _execPromise);

    _classPrivateMethodInitSpec(this, _makePromise);

    _classPrivateMethodInitSpec(this, _logger);

    _defineProperty(this, "_host", void 0);

    _defineProperty(this, "_secure", void 0);

    _defineProperty(this, "_appName", void 0);

    _defineProperty(this, "_apiKey", void 0);

    _defineProperty(this, "_browser", '');

    _defineProperty(this, "_platform", void 0);

    _defineProperty(this, "_hwos", 'undefined');

    _defineProperty(this, "_humanLanguage", 'xx');

    _defineProperty(this, "_loggingEnabled", false);

    _defineProperty(this, "_trimLongStrings", false);

    _defineProperty(this, "_myUID", null);

    _defineProperty(this, "_authenticated", false);

    _defineProperty(this, "_login", null);

    _defineProperty(this, "_authToken", null);

    _defineProperty(this, "_inPacketCount", 0);

    _defineProperty(this, "_messageId", Math.floor(Math.random() * 0xFFFF + 0xFFFF));

    _defineProperty(this, "_serverInfo", null);

    _defineProperty(this, "_deviceToken", null);

    _defineProperty(this, "_pendingPromises", {});

    _defineProperty(this, "_expirePromises", null);

    _defineProperty(this, "_connection", null);

    _defineProperty(this, "_persist", false);

    _defineProperty(this, "_db", null);

    _defineProperty(this, "_cache", {});

    _defineProperty(this, "onWebsocketOpen", undefined);

    _defineProperty(this, "onConnect", undefined);

    _defineProperty(this, "onDisconnect", undefined);

    _defineProperty(this, "onLogin", undefined);

    _defineProperty(this, "onCtrlMessage", undefined);

    _defineProperty(this, "onDataMessage", undefined);

    _defineProperty(this, "onPresMessage", undefined);

    _defineProperty(this, "onMessage", undefined);

    _defineProperty(this, "onRawMessage", undefined);

    _defineProperty(this, "onNetworkProbe", undefined);

    _defineProperty(this, "onAutoreconnectIteration", undefined);

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

    _connection.default.logger = function (str) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      _classPrivateMethodGet(_this, _logger, _logger2).call(_this, str, args);
    };

    _drafty.default.logger = function (str) {
      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      _classPrivateMethodGet(_this, _logger, _logger2).call(_this, str, args);
    };

    if (config.transport != 'lp' && config.transport != 'ws') {
      config.transport = detectTransport();
    }

    this._connection = new _connection.default(config, Const.PROTOCOL_VERSION, true);

    this._connection.onMessage = data => {
      _classPrivateMethodGet(this, _dispatchMessage, _dispatchMessage2).call(this, data);
    };

    this._connection.onOpen = () => {
      _classPrivateMethodGet(this, _connectionOpen, _connectionOpen2).call(this);
    };

    this._connection.onDisconnect = (err, code) => {
      _classPrivateMethodGet(this, _disconnected, _disconnected2).call(this, err, code);
    };

    this._connection.onAutoreconnectIteration = (timeout, promise) => {
      if (this.onAutoreconnectIteration) {
        this.onAutoreconnectIteration(timeout, promise);
      }
    };

    this._persist = config.persist;
    this._db = new _db.default(err => {
      _classPrivateMethodGet(this, _logger, _logger2).call(this, 'DB', err);
    }, this.logger);

    if (this._persist) {
      const prom = [];

      this._db.initDatabase().then(() => {
        return this._db.mapTopics(data => {
          let topic = _classPrivateMethodGet(this, _cacheGet, _cacheGet2).call(this, 'topic', data.name);

          if (topic) {
            return;
          }

          if (data.name == Const.TOPIC_ME) {
            topic = new _topic.TopicMe();
          } else if (data.name == Const.TOPIC_FND) {
            topic = new _topic.TopicFnd();
          } else {
            topic = new _topic.Topic(data.name);
          }

          this._db.deserializeTopic(topic, data);

          _classPrivateMethodGet(this, _attachCacheToTopic, _attachCacheToTopic2).call(this, topic);

          topic._cachePutSelf();

          prom.push(topic._loadMessages(this._db));
        });
      }).then(() => {
        return this._db.mapUsers(data => {
          _classPrivateMethodGet(this, _cachePut, _cachePut2).call(this, 'user', data.uid, (0, _utils.mergeObj)({}, data.public));
        });
      }).then(() => {
        return Promise.all(prom);
      }).then(() => {
        if (onComplete) {
          onComplete();
        }

        _classPrivateMethodGet(this, _logger, _logger2).call(this, "Persistent cache initialized.");
      }).catch(err => {
        if (onComplete) {
          onComplete(err);
        }

        _classPrivateMethodGet(this, _logger, _logger2).call(this, "Failed to initialize persistent cache:", err);
      });
    } else {
      this._db.deleteDatabase().then(() => {
        if (onComplete) {
          onComplete();
        }
      });
    }
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
    return _topic.Topic.topicType(name);
  }

  static isMeTopicName(name) {
    return _topic.Topic.isMeTopicName(name);
  }

  static isGroupTopicName(name) {
    return _topic.Topic.isGroupTopicName(name);
  }

  static isP2PTopicName(name) {
    return _topic.Topic.isP2PTopicName(name);
  }

  static isCommTopicName(name) {
    return _topic.Topic.isCommTopicName(name);
  }

  static isNewGroupTopicName(name) {
    return _topic.Topic.isNewGroupTopicName(name);
  }

  static isChannelTopicName(name) {
    return _topic.Topic.isChannelTopicName(name);
  }

  static getVersion() {
    return Const.VERSION;
  }

  static setNetworkProviders(wsProvider, xhrProvider) {
    WebSocketProvider = wsProvider;
    XHRProvider = xhrProvider;

    _connection.default.setNetworkProviders(WebSocketProvider, XHRProvider);

    _largeFile.default.setNetworkProvider(XHRProvider);
  }

  static setDatabaseProvider(idbProvider) {
    IndexedDBProvider = idbProvider;

    _db.default.setDatabaseProvider(IndexedDBProvider);
  }

  static getLibrary() {
    return Const.LIBRARY;
  }

  static isNullValue(str) {
    return str === Const.DEL_CHAR;
  }

  static isRelativeURL(url) {
    return !/^\s*([a-z][a-z0-9+.-]*:|\/\/)/im.test(url);
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

    if (Tinode.isRelativeURL(url)) {
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
    const pkt = _classPrivateMethodGet(this, _initPacket, _initPacket2).call(this, 'acc');

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
      pkt.acc.token = params.token;

      if (Array.isArray(params.attachments) && params.attachments.length > 0) {
        pkt.extra = {
          attachments: params.attachments.filter(ref => Tinode.isRelativeURL(ref))
        };
      }
    }

    return _classPrivateMethodGet(this, _send, _send2).call(this, pkt, pkt.acc.id);
  }

  createAccount(scheme, secret, login, params) {
    let promise = this.account(USER_NEW, scheme, secret, login, params);

    if (login) {
      promise = promise.then(ctrl => {
        return _classPrivateMethodGet(this, _loginSuccessful, _loginSuccessful2).call(this, ctrl);
      });
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
    const pkt = _classPrivateMethodGet(this, _initPacket, _initPacket2).call(this, 'hi');

    return _classPrivateMethodGet(this, _send, _send2).call(this, pkt, pkt.hi.id).then(ctrl => {
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
        _classPrivateMethodGet(this, _send, _send2).call(this, {
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
    const pkt = _classPrivateMethodGet(this, _initPacket, _initPacket2).call(this, 'login');

    pkt.login.scheme = scheme;
    pkt.login.secret = secret;
    pkt.login.cred = cred;
    return _classPrivateMethodGet(this, _send, _send2).call(this, pkt, pkt.login.id).then(ctrl => {
      return _classPrivateMethodGet(this, _loginSuccessful, _loginSuccessful2).call(this, ctrl);
    });
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
    const pkt = _classPrivateMethodGet(this, _initPacket, _initPacket2).call(this, 'sub', topicName);

    if (!topicName) {
      topicName = Const.TOPIC_NEW;
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
          attachments: setParams.attachments.filter(ref => Tinode.isRelativeURL(ref))
        };
      }

      if (setParams.tags) {
        pkt.sub.set.tags = setParams.tags;
      }
    }

    return _classPrivateMethodGet(this, _send, _send2).call(this, pkt, pkt.sub.id);
  }

  leave(topic, unsub) {
    const pkt = _classPrivateMethodGet(this, _initPacket, _initPacket2).call(this, 'leave', topic);

    pkt.leave.unsub = unsub;
    return _classPrivateMethodGet(this, _send, _send2).call(this, pkt, pkt.leave.id);
  }

  createMessage(topic, content, noEcho) {
    const pkt = _classPrivateMethodGet(this, _initPacket, _initPacket2).call(this, 'pub', topic);

    let dft = typeof content == 'string' ? _drafty.default.parse(content) : content;

    if (dft && !_drafty.default.isPlainText(dft)) {
      pkt.pub.head = {
        mime: _drafty.default.getContentType()
      };
      content = dft;
    }

    pkt.pub.noecho = noEcho;
    pkt.pub.content = content;
    return pkt.pub;
  }

  publish(topic, content, noEcho) {
    return this.publishMessage(this.createMessage(topic, content, noEcho));
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
        attachments: attachments.filter(ref => Tinode.isRelativeURL(ref))
      };
    }

    return _classPrivateMethodGet(this, _send, _send2).call(this, msg, pub.id);
  }

  oobNotification(what, topicName, seq, act) {
    const topic = _classPrivateMethodGet(this, _cacheGet, _cacheGet2).call(this, 'topic', topicName);

    if (topic) {
      topic._updateReceived(seq, act);

      this.getMeTopic()._refreshContact('msg', topic);
    }
  }

  getMeta(topic, params) {
    const pkt = _classPrivateMethodGet(this, _initPacket, _initPacket2).call(this, 'get', topic);

    pkt.get = (0, _utils.mergeObj)(pkt.get, params);
    return _classPrivateMethodGet(this, _send, _send2).call(this, pkt, pkt.get.id);
  }

  setMeta(topic, params) {
    const pkt = _classPrivateMethodGet(this, _initPacket, _initPacket2).call(this, 'set', topic);

    const what = [];

    if (params) {
      ['desc', 'sub', 'tags', 'cred'].forEach(function (key) {
        if (params.hasOwnProperty(key)) {
          what.push(key);
          pkt.set[key] = params[key];
        }
      });

      if (Array.isArray(params.attachments) && params.attachments.length > 0) {
        pkt.extra = {
          attachments: params.attachments.filter(ref => Tinode.isRelativeURL(ref))
        };
      }
    }

    if (what.length == 0) {
      return Promise.reject(new Error("Invalid {set} parameters"));
    }

    return _classPrivateMethodGet(this, _send, _send2).call(this, pkt, pkt.set.id);
  }

  delMessages(topic, ranges, hard) {
    const pkt = _classPrivateMethodGet(this, _initPacket, _initPacket2).call(this, 'del', topic);

    pkt.del.what = 'msg';
    pkt.del.delseq = ranges;
    pkt.del.hard = hard;
    return _classPrivateMethodGet(this, _send, _send2).call(this, pkt, pkt.del.id);
  }

  delTopic(topicName, hard) {
    const pkt = _classPrivateMethodGet(this, _initPacket, _initPacket2).call(this, 'del', topicName);

    pkt.del.what = 'topic';
    pkt.del.hard = hard;
    return _classPrivateMethodGet(this, _send, _send2).call(this, pkt, pkt.del.id);
  }

  delSubscription(topicName, user) {
    const pkt = _classPrivateMethodGet(this, _initPacket, _initPacket2).call(this, 'del', topicName);

    pkt.del.what = 'sub';
    pkt.del.user = user;
    return _classPrivateMethodGet(this, _send, _send2).call(this, pkt, pkt.del.id);
  }

  delCredential(method, value) {
    const pkt = _classPrivateMethodGet(this, _initPacket, _initPacket2).call(this, 'del', Const.TOPIC_ME);

    pkt.del.what = 'cred';
    pkt.del.cred = {
      meth: method,
      val: value
    };
    return _classPrivateMethodGet(this, _send, _send2).call(this, pkt, pkt.del.id);
  }

  delCurrentUser(hard) {
    const pkt = _classPrivateMethodGet(this, _initPacket, _initPacket2).call(this, 'del', null);

    pkt.del.what = 'user';
    pkt.del.hard = hard;
    return _classPrivateMethodGet(this, _send, _send2).call(this, pkt, pkt.del.id).then(ctrl => {
      this._myUID = null;
    });
  }

  note(topicName, what, seq) {
    if (seq <= 0 || seq >= Const.LOCAL_SEQID) {
      throw new Error("Invalid message id ".concat(seq));
    }

    const pkt = _classPrivateMethodGet(this, _initPacket, _initPacket2).call(this, 'note', topicName);

    pkt.note.what = what;
    pkt.note.seq = seq;

    _classPrivateMethodGet(this, _send, _send2).call(this, pkt);
  }

  noteKeyPress(topicName) {
    const pkt = _classPrivateMethodGet(this, _initPacket, _initPacket2).call(this, 'note', topicName);

    pkt.note.what = 'kp';

    _classPrivateMethodGet(this, _send, _send2).call(this, pkt);
  }

  getTopic(topicName) {
    let topic = _classPrivateMethodGet(this, _cacheGet, _cacheGet2).call(this, 'topic', topicName);

    if (!topic && topicName) {
      if (topicName == Const.TOPIC_ME) {
        topic = new _topic.TopicMe();
      } else if (topicName == Const.TOPIC_FND) {
        topic = new _topic.TopicFnd();
      } else {
        topic = new _topic.Topic(topicName);
      }

      _classPrivateMethodGet(this, _attachCacheToTopic, _attachCacheToTopic2).call(this, topic);

      topic._cachePutSelf();
    }

    return topic;
  }

  cacheGetTopic(topicName) {
    return _classPrivateMethodGet(this, _cacheGet, _cacheGet2).call(this, 'topic', topicName);
  }

  cacheRemTopic(topicName) {
    _classPrivateMethodGet(this, _cacheDel, _cacheDel2).call(this, 'topic', topicName);
  }

  mapTopics(func, context) {
    _classPrivateMethodGet(this, _cacheMap, _cacheMap2).call(this, 'topic', func, context);
  }

  isTopicCached(topicName) {
    return !!_classPrivateMethodGet(this, _cacheGet, _cacheGet2).call(this, 'topic', topicName);
  }

  newGroupTopicName(isChan) {
    return (isChan ? Const.TOPIC_NEW_CHAN : Const.TOPIC_NEW) + this.getNextUniqueId();
  }

  getMeTopic() {
    return this.getTopic(Const.TOPIC_ME);
  }

  getFndTopic() {
    return this.getTopic(Const.TOPIC_FND);
  }

  getLargeFileHelper() {
    return new _largeFile.default(this, Const.PROTOCOL_VERSION);
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

  getServerLimit(name, defaultValue) {
    return (this._serverInfo ? this._serverInfo[name] : null) || defaultValue;
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
    const topic = _classPrivateMethodGet(this, _cacheGet, _cacheGet2).call(this, 'topic', name);

    return topic && topic.online;
  }

  getTopicAccessMode(name) {
    const topic = _classPrivateMethodGet(this, _cacheGet, _cacheGet2).call(this, 'topic', name);

    return topic ? topic.acs : null;
  }

  wantAkn(status) {
    if (status) {
      this._messageId = Math.floor(Math.random() * 0xFFFFFF + 0xFFFFFF);
    } else {
      this._messageId = 0;
    }
  }

}

exports.Tinode = Tinode;

function _logger2(str) {
  if (this._loggingEnabled) {
    const d = new Date();
    const dateString = ('0' + d.getUTCHours()).slice(-2) + ':' + ('0' + d.getUTCMinutes()).slice(-2) + ':' + ('0' + d.getUTCSeconds()).slice(-2) + '.' + ('00' + d.getUTCMilliseconds()).slice(-3);

    for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      args[_key3 - 1] = arguments[_key3];
    }

    console.log('[' + dateString + ']', str, args.join(' '));
  }
}

function _makePromise2(id) {
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

function _execPromise2(id, code, onOK, errorText) {
  const callbacks = this._pendingPromises[id];

  if (callbacks) {
    delete this._pendingPromises[id];

    if (code >= 200 && code < 400) {
      if (callbacks.resolve) {
        callbacks.resolve(onOK);
      }
    } else if (callbacks.reject) {
      callbacks.reject(new Error("".concat(errorText, " (").concat(code, ")")));
    }
  }
}

function _send2(pkt, id) {
  let promise;

  if (id) {
    promise = _classPrivateMethodGet(this, _makePromise, _makePromise2).call(this, id);
  }

  pkt = (0, _utils.simplify)(pkt);
  let msg = JSON.stringify(pkt);

  _classPrivateMethodGet(this, _logger, _logger2).call(this, "out: " + (this._trimLongStrings ? JSON.stringify(pkt, jsonLoggerHelper) : msg));

  try {
    this._connection.sendText(msg);
  } catch (err) {
    if (id) {
      _classPrivateMethodGet(this, _execPromise, _execPromise2).call(this, id, _connection.default.NETWORK_ERROR, null, err.message);
    } else {
      throw err;
    }
  }

  return promise;
}

function _dispatchMessage2(data) {
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

  let pkt = JSON.parse(data, _utils.jsonParseHelper);

  if (!pkt) {
    _classPrivateMethodGet(this, _logger, _logger2).call(this, "in: " + data);

    _classPrivateMethodGet(this, _logger, _logger2).call(this, "ERROR: failed to parse data");
  } else {
    _classPrivateMethodGet(this, _logger, _logger2).call(this, "in: " + (this._trimLongStrings ? JSON.stringify(pkt, jsonLoggerHelper) : data));

    if (this.onMessage) {
      this.onMessage(pkt);
    }

    if (pkt.ctrl) {
      if (this.onCtrlMessage) {
        this.onCtrlMessage(pkt.ctrl);
      }

      if (pkt.ctrl.id) {
        _classPrivateMethodGet(this, _execPromise, _execPromise2).call(this, pkt.ctrl.id, pkt.ctrl.code, pkt.ctrl, pkt.ctrl.text);
      }

      setTimeout(() => {
        if (pkt.ctrl.code == 205 && pkt.ctrl.text == 'evicted') {
          const topic = _classPrivateMethodGet(this, _cacheGet, _cacheGet2).call(this, 'topic', pkt.ctrl.topic);

          if (topic) {
            topic._resetSub();

            if (pkt.ctrl.params && pkt.ctrl.params.unsub) {
              topic._gone();
            }
          }
        } else if (pkt.ctrl.code < 300 && pkt.ctrl.params) {
          if (pkt.ctrl.params.what == 'data') {
            const topic = _classPrivateMethodGet(this, _cacheGet, _cacheGet2).call(this, 'topic', pkt.ctrl.topic);

            if (topic) {
              topic._allMessagesReceived(pkt.ctrl.params.count);
            }
          } else if (pkt.ctrl.params.what == 'sub') {
            const topic = _classPrivateMethodGet(this, _cacheGet, _cacheGet2).call(this, 'topic', pkt.ctrl.topic);

            if (topic) {
              topic._processMetaSub([]);
            }
          }
        }
      }, 0);
    } else {
      setTimeout(() => {
        if (pkt.meta) {
          const topic = _classPrivateMethodGet(this, _cacheGet, _cacheGet2).call(this, 'topic', pkt.meta.topic);

          if (topic) {
            topic._routeMeta(pkt.meta);
          }

          if (pkt.meta.id) {
            _classPrivateMethodGet(this, _execPromise, _execPromise2).call(this, pkt.meta.id, 200, pkt.meta, 'META');
          }

          if (this.onMetaMessage) {
            this.onMetaMessage(pkt.meta);
          }
        } else if (pkt.data) {
          const topic = _classPrivateMethodGet(this, _cacheGet, _cacheGet2).call(this, 'topic', pkt.data.topic);

          if (topic) {
            topic._routeData(pkt.data);
          }

          if (this.onDataMessage) {
            this.onDataMessage(pkt.data);
          }
        } else if (pkt.pres) {
          const topic = _classPrivateMethodGet(this, _cacheGet, _cacheGet2).call(this, 'topic', pkt.pres.topic);

          if (topic) {
            topic._routePres(pkt.pres);
          }

          if (this.onPresMessage) {
            this.onPresMessage(pkt.pres);
          }
        } else if (pkt.info) {
          const topic = _classPrivateMethodGet(this, _cacheGet, _cacheGet2).call(this, 'topic', pkt.info.topic);

          if (topic) {
            topic._routeInfo(pkt.info);
          }

          if (this.onInfoMessage) {
            this.onInfoMessage(pkt.info);
          }
        } else {
          _classPrivateMethodGet(this, _logger, _logger2).call(this, "ERROR: Unknown packet received.");
        }
      }, 0);
    }
  }
}

function _connectionOpen2() {
  if (!this._expirePromises) {
    this._expirePromises = setInterval(() => {
      const err = new Error("Timeout (504)");
      const expires = new Date(new Date().getTime() - Const.EXPIRE_PROMISES_TIMEOUT);

      for (let id in this._pendingPromises) {
        let callbacks = this._pendingPromises[id];

        if (callbacks && callbacks.ts < expires) {
          _classPrivateMethodGet(this, _logger, _logger2).call(this, "Promise expired", id);

          delete this._pendingPromises[id];

          if (callbacks.reject) {
            callbacks.reject(err);
          }
        }
      }
    }, Const.EXPIRE_PROMISES_PERIOD);
  }

  this.hello();
}

function _disconnected2(err, code) {
  this._inPacketCount = 0;
  this._serverInfo = null;
  this._authenticated = false;

  if (this._expirePromises) {
    clearInterval(this._expirePromises);
    this._expirePromises = null;
  }

  _classPrivateMethodGet(this, _cacheMap, _cacheMap2).call(this, 'topic', (topic, key) => {
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

function _getUserAgent2() {
  return this._appName + ' (' + (this._browser ? this._browser + '; ' : '') + this._hwos + '); ' + Const.LIBRARY;
}

function _initPacket2(type, topic) {
  switch (type) {
    case 'hi':
      return {
        'hi': {
          'id': this.getNextUniqueId(),
          'ver': Const.VERSION,
          'ua': _classPrivateMethodGet(this, _getUserAgent, _getUserAgent2).call(this),
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
          'tags': []
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
      throw new Error("Unknown packet type requested: ".concat(type));
  }
}

function _cachePut2(type, name, obj) {
  this._cache[type + ':' + name] = obj;
}

function _cacheGet2(type, name) {
  return this._cache[type + ':' + name];
}

function _cacheDel2(type, name) {
  delete this._cache[type + ':' + name];
}

function _cacheMap2(type, func, context) {
  const key = type ? type + ':' : undefined;

  for (let idx in this._cache) {
    if (!key || idx.indexOf(key) == 0) {
      if (func.call(context, this._cache[idx], idx)) {
        break;
      }
    }
  }
}

function _attachCacheToTopic2(topic) {
  topic._tinode = this;

  topic._cacheGetUser = uid => {
    const pub = _classPrivateMethodGet(this, _cacheGet, _cacheGet2).call(this, 'user', uid);

    if (pub) {
      return {
        user: uid,
        public: (0, _utils.mergeObj)({}, pub)
      };
    }

    return undefined;
  };

  topic._cachePutUser = (uid, user) => {
    _classPrivateMethodGet(this, _cachePut, _cachePut2).call(this, 'user', uid, (0, _utils.mergeObj)({}, user.public));
  };

  topic._cacheDelUser = uid => {
    _classPrivateMethodGet(this, _cacheDel, _cacheDel2).call(this, 'user', uid);
  };

  topic._cachePutSelf = () => {
    _classPrivateMethodGet(this, _cachePut, _cachePut2).call(this, 'topic', topic.name, topic);
  };

  topic._cacheDelSelf = () => {
    _classPrivateMethodGet(this, _cacheDel, _cacheDel2).call(this, 'topic', topic.name);
  };
}

function _loginSuccessful2(ctrl) {
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

;
Tinode.MESSAGE_STATUS_NONE = Const.MESSAGE_STATUS_NONE;
Tinode.MESSAGE_STATUS_QUEUED = Const.MESSAGE_STATUS_QUEUED;
Tinode.MESSAGE_STATUS_SENDING = Const.MESSAGE_STATUS_SENDING;
Tinode.MESSAGE_STATUS_FAILED = Const.MESSAGE_STATUS_FAILED;
Tinode.MESSAGE_STATUS_SENT = Const.MESSAGE_STATUS_SENT;
Tinode.MESSAGE_STATUS_RECEIVED = Const.MESSAGE_STATUS_RECEIVED;
Tinode.MESSAGE_STATUS_READ = Const.MESSAGE_STATUS_READ;
Tinode.MESSAGE_STATUS_TO_ME = Const.MESSAGE_STATUS_TO_ME;
Tinode.MESSAGE_STATUS_DEL_RANGE = Const.MESSAGE_STATUS_DEL_RANGE;
Tinode.DEL_CHAR = Const.DEL_CHAR;
Tinode.MAX_MESSAGE_SIZE = 'maxMessageSize';
Tinode.MAX_SUBSCRIBER_COUNT = 'maxSubscriberCount';
Tinode.MAX_TAG_COUNT = 'maxTagCount';
Tinode.MAX_FILE_UPLOAD_SIZE = 'maxFileUploadSize';

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./access-mode.js":1,"./config.js":3,"./connection.js":4,"./db.js":5,"./drafty.js":6,"./large-file.js":7,"./topic.js":10,"./utils.js":11}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TopicMe = exports.TopicFnd = exports.Topic = void 0;

var _accessMode = _interopRequireDefault(require("./access-mode.js"));

var _cbuffer = _interopRequireDefault(require("./cbuffer.js"));

var Const = _interopRequireWildcard(require("./config.js"));

var _drafty = _interopRequireDefault(require("./drafty.js"));

var _metaBuilder = _interopRequireDefault(require("./meta-builder.js"));

var _utils = require("./utils.js");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Topic {
  constructor(name, callbacks) {
    this._tinode = null;
    this.name = name;
    this.created = null;
    this.updated = null;
    this.touched = new Date(0);
    this.acs = new _accessMode.default(null);
    this.private = null;
    this.public = null;
    this.trusted = null;
    this._users = {};
    this._queuedSeqId = Const.LOCAL_SEQID;
    this._maxSeq = 0;
    this._minSeq = 0;
    this._noEarlierMsgs = false;
    this._maxDel = 0;
    this._tags = [];
    this._credentials = [];
    this._messages = new _cbuffer.default((a, b) => {
      return a.seq - b.seq;
    }, true);
    this._attached = false;
    this._lastSubsUpdate = new Date(0);
    this._new = true;
    this._deleted = false;

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
      this.onDeleteTopic = callbacks.onDeleteTopic;
      this.onAllMessagesReceived = callbacks.onAllMessagesReceived;
    }
  }

  static topicType(name) {
    const types = {
      'me': Const.TOPIC_ME,
      'fnd': Const.TOPIC_FND,
      'grp': Const.TOPIC_GRP,
      'new': Const.TOPIC_GRP,
      'nch': Const.TOPIC_GRP,
      'chn': Const.TOPIC_GRP,
      'usr': Const.TOPIC_P2P,
      'sys': Const.TOPIC_SYS
    };
    return types[typeof name == 'string' ? name.substring(0, 3) : 'xxx'];
  }

  static isMeTopicName(name) {
    return Topic.topicType(name) == Const.TOPIC_ME;
  }

  static isGroupTopicName(name) {
    return Topic.topicType(name) == Const.TOPIC_GRP;
  }

  static isP2PTopicName(name) {
    return Topic.topicType(name) == Const.TOPIC_P2P;
  }

  static isCommTopicName(name) {
    return Topic.isP2PTopicName(name) || Topic.isGroupTopicName(name);
  }

  static isNewGroupTopicName(name) {
    return typeof name == 'string' && (name.substring(0, 3) == Const.TOPIC_NEW || name.substring(0, 3) == Const.TOPIC_NEW_CHAN);
  }

  static isChannelTopicName(name) {
    return typeof name == 'string' && (name.substring(0, 3) == Const.TOPIC_CHAN || name.substring(0, 3) == Const.TOPIC_NEW_CHAN);
  }

  isSubscribed() {
    return this._attached;
  }

  subscribe(getParams, setParams) {
    if (this._attached) {
      return Promise.resolve(this);
    }

    if (this._deleted) {
      return Promise.reject(new Error("Conversation deleted"));
    }

    return this._tinode.subscribe(this.name || Const.TOPIC_NEW, getParams, setParams).then(ctrl => {
      if (ctrl.code >= 300) {
        return ctrl;
      }

      this._attached = true;
      this._deleted = false;
      this.acs = ctrl.params && ctrl.params.acs ? ctrl.params.acs : this.acs;

      if (this._new) {
        this._new = false;

        if (this.name != ctrl.topic) {
          this._cacheDelSelf();

          this.name = ctrl.topic;
        }

        this._cachePutSelf();

        this.created = ctrl.ts;
        this.updated = ctrl.ts;

        if (this.name != Const.TOPIC_ME && this.name != Const.TOPIC_FND) {
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

    let attachments = null;

    if (_drafty.default.hasEntities(pub.content)) {
      attachments = [];

      _drafty.default.entities(pub.content, data => {
        if (data && data.ref) {
          attachments.push(data.ref);
        }
      });

      if (attachments.length == 0) {
        attachments = null;
      }
    }

    pub._sending = true;
    pub._failed = false;
    return this._tinode.publishMessage(pub, attachments).then(ctrl => {
      pub._sending = false;
      pub.ts = ctrl.ts;
      this.swapMessageId(pub, ctrl.params.seq);

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
    if (!prom && !this._attached) {
      return Promise.reject(new Error("Cannot publish on inactive topic"));
    }

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

    prom = (prom || Promise.resolve()).then(() => {
      if (pub._cancelled) {
        return {
          code: 300,
          text: "cancelled"
        };
      }

      return this.publishMessage(pub);
    }, err => {
      this._tinode.logger("WARNING: Message draft rejected", err);

      pub._sending = false;
      pub._failed = true;

      this._messages.delAt(this._messages.find(pub));

      this._tinode._db.remMessages(this.name, pub.seq);

      if (this.onData) {
        this.onData();
      }
    });
    return prom;
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

  getMeta(params) {
    return this._tinode.getMeta(this.name, params);
  }

  getMessagesPage(limit, forward) {
    let query = forward ? this.startMetaQuery().withLaterData(limit) : this.startMetaQuery().withEarlierData(limit);
    return this._loadMessages(this._tinode._db, query.extract('data')).then(count => {
      if (count == limit) {
        return Promise.resolve({
          topic: this.name,
          code: 200,
          params: {
            count: count
          }
        });
      }

      limit -= count;
      query = forward ? this.startMetaQuery().withLaterData(limit) : this.startMetaQuery().withEarlierData(limit);
      let promise = this.getMeta(query.build());

      if (!forward) {
        promise = promise.then(ctrl => {
          if (ctrl && ctrl.params && !ctrl.params.count) {
            this._noEarlierMsgs = true;
          }
        });
      }

      return promise;
    });
  }

  setMeta(params) {
    if (params.tags) {
      params.tags = (0, _utils.normalizeArray)(params.tags);
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

        this._processMetaSub([params.sub]);
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
          arch: arch ? true : Const.DEL_CHAR
        }
      }
    });
  }

  delMessages(ranges, hard) {
    if (!this._attached) {
      return Promise.reject(new Error("Cannot delete messages in inactive topic"));
    }

    ranges.sort((r1, r2) => {
      if (r1.low < r2.low) {
        return true;
      }

      if (r1.low == r2.low) {
        return !r2.hi || r1.hi >= r2.hi;
      }

      return false;
    });
    let tosend = ranges.reduce((out, r) => {
      if (r.low < Const.LOCAL_SEQID) {
        if (!r.hi || r.hi < Const.LOCAL_SEQID) {
          out.push(r);
        } else {
          out.push({
            low: r.low,
            hi: this._maxSeq + 1
          });
        }
      }

      return out;
    }, []);
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
        this._maxDel = ctrl.params.del;
      }

      ranges.forEach(r => {
        if (r.hi) {
          this.flushMessageRange(r.low, r.hi);
        } else {
          this.flushMessage(r.low);
        }
      });

      this._updateDeletedRanges();

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
    list.sort((a, b) => a - b);
    let ranges = list.reduce((out, id) => {
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
    return this.delMessages(ranges, hardDel);
  }

  delTopic(hard) {
    if (this._deleted) {
      this._gone();

      return new Promise.resolve(null);
    }

    return this._tinode.delTopic(this.name, hard).then(ctrl => {
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

      this._updateReadRecv(what, seq);

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

  _updateReadRecv(what, seq, ts) {
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

  subscriber(uid) {
    return this._users[uid];
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
        this._messages.forEach(cb, startIdx, beforeIdx, context);
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

  latestMessage(skipDeleted) {
    const msg = this._messages.getLast();

    if (!skipDeleted || !msg || msg._status != Const.MESSAGE_STATUS_DEL_RANGE) {
      return msg;
    }

    return this._messages.getLast(1);
  }

  maxMsgSeq() {
    return this._maxSeq;
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

    this.messages(callback, Const.LOCAL_SEQID, undefined, context);
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

  msgHasMoreMessages(newer) {
    return newer ? this.seq > this._maxSeq : this._minSeq > 1 && !this._noEarlierMsgs;
  }

  isNewMessage(seqId) {
    return this._maxSeq <= seqId;
  }

  flushMessage(seqId) {
    const idx = this._messages.find({
      seq: seqId
    });

    if (idx >= 0) {
      this._tinode._db.remMessages(this.name, seqId);

      return this._messages.delAt(idx);
    }

    return undefined;
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

  flushMessageRange(fromId, untilId) {
    this._tinode._db.remMessages(this.name, fromId, untilId);

    const since = this._messages.find({
      seq: fromId
    }, true);

    return since >= 0 ? this._messages.delRange(since, this._messages.find({
      seq: untilId
    }, true)) : [];
  }

  cancelSend(seqId) {
    const idx = this._messages.find({
      seq: seqId
    });

    if (idx >= 0) {
      const msg = this._messages.getAt(idx);

      const status = this.msgStatus(msg);

      if (status == Const.MESSAGE_STATUS_QUEUED || status == Const.MESSAGE_STATUS_FAILED) {
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
    return this.acs = new _accessMode.default(acs);
  }

  getDefaultAccess() {
    return this.defacs;
  }

  startMetaQuery() {
    return new _metaBuilder.default(this);
  }

  isArchived() {
    return this.private && !!this.private.arch;
  }

  isMeType() {
    return Topic.isMeTopicName(this.name);
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
    let status = Const.MESSAGE_STATUS_NONE;

    if (this._tinode.isMe(msg.from)) {
      if (msg._sending) {
        status = Const.MESSAGE_STATUS_SENDING;
      } else if (msg._failed || msg._cancelled) {
        status = Const.MESSAGE_STATUS_FAILED;
      } else if (msg.seq >= Const.LOCAL_SEQID) {
        status = Const.MESSAGE_STATUS_QUEUED;
      } else if (this.msgReadCount(msg.seq) > 0) {
        status = Const.MESSAGE_STATUS_READ;
      } else if (this.msgRecvCount(msg.seq) > 0) {
        status = Const.MESSAGE_STATUS_RECEIVED;
      } else if (msg.seq > 0) {
        status = Const.MESSAGE_STATUS_SENT;
      }
    } else if (msg._status == Const.MESSAGE_STATUS_DEL_RANGE) {
      status == Const.MESSAGE_STATUS_DEL_RANGE;
    } else {
      status = Const.MESSAGE_STATUS_TO_ME;
    }

    if (upd && msg._status != status) {
      msg._status = status;

      this._tinode._db.updMessageStatus(this.name, msg.seq, status);
    }

    return status;
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
    }

    if (data.seq < this._minSeq || this._minSeq == 0) {
      this._minSeq = data.seq;
    }

    if (!data._noForwarding) {
      this._messages.put(data);

      this._tinode._db.addMessage(data);

      this._updateDeletedRanges();
    }

    if (this.onData) {
      this.onData(data);
    }

    const what = !this.isChannelType() && !data.from || this._tinode.isMe(data.from) ? 'read' : 'msg';

    this._updateReadRecv(what, data.seq, data.ts);

    this._tinode.getMeTopic()._refreshContact(what, this);
  }

  _routeMeta(meta) {
    if (meta.desc) {
      this._processMetaDesc(meta.desc);
    }

    if (meta.sub && meta.sub.length > 0) {
      this._processMetaSub(meta.sub);
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
          this.getMeta(this.startMetaQuery().withLaterOneSub(pres.src).build());
        }

        break;

      case 'acs':
        uid = pres.src || this._tinode.getCurrentUserID();
        user = this._users[uid];

        if (!user) {
          const acs = new _accessMode.default().updateAll(pres.dacs);

          if (acs && acs.mode != _accessMode.default._NONE) {
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

            this._processMetaSub([user]);
          }
        } else {
          user.acs.updateAll(pres.dacs);

          this._processMetaSub([{
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
    if (info.what !== 'kp') {
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

      if (this._tinode.isMe(info.from)) {
        this._updateReadRecv(info.what, info.seq);
      }

      this._tinode.getMeTopic()._refreshContact(info.what, this);
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

    (0, _utils.mergeObj)(this, desc);

    this._tinode._db.updTopic(this);

    if (this.name !== Const.TOPIC_ME && !desc._noForwarding) {
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

  _processMetaSub(subs) {
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
    if (tags.length == 1 && tags[0] == Const.DEL_CHAR) {
      tags = [];
    }

    this._tags = tags;

    if (this.onTagsUpdated) {
      this.onTagsUpdated(tags);
    }
  }

  _processMetaCreds(creds) {}

  _processDelMessages(clear, delseq) {
    this._maxDel = Math.max(clear, this._maxDel);
    this.clear = Math.max(clear, this.clear);
    const topic = this;
    let count = 0;

    if (Array.isArray(delseq)) {
      delseq.forEach(function (range) {
        if (!range.hi) {
          count++;
          topic.flushMessage(range.low);
        } else {
          for (let i = range.low; i < range.hi; i++) {
            count++;
            topic.flushMessage(i);
          }
        }
      });
    }

    if (count > 0) {
      this._updateDeletedRanges();

      if (this.onData) {
        this.onData();
      }
    }
  }

  _allMessagesReceived(count) {
    this._updateDeletedRanges();

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
    this.acs = new _accessMode.default(null);
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
        topic: Const.TOPIC_ME,
        src: this.name
      });
    }

    if (this.onDeleteTopic) {
      this.onDeleteTopic();
    }
  }

  _updateCachedUser(uid, obj) {
    let cached = this._cacheGetUser(uid);

    cached = (0, _utils.mergeObj)(cached || {}, obj);

    this._cachePutUser(uid, cached);

    return (0, _utils.mergeToCache)(this._users, uid, cached);
  }

  _getQueuedSeqId() {
    return this._queuedSeqId++;
  }

  _updateDeletedRanges() {
    const ranges = [];
    let prev = null;

    const first = this._messages.getAt(0);

    if (first && this._minSeq > 1 && !this._noEarlierMsgs) {
      if (first.hi) {
        if (first.seq > 1) {
          first.seq = 1;
        }

        if (first.hi < this._minSeq - 1) {
          first.hi = this._minSeq - 1;
        }

        prev = first;
      } else {
        prev = {
          seq: 1,
          hi: this._minSeq - 1
        };
        ranges.push(prev);
      }
    } else {
      prev = {
        seq: 0,
        hi: 0
      };
    }

    this._messages.filter(data => {
      if (data.seq >= Const.LOCAL_SEQID) {
        return true;
      }

      if (data.seq == (prev.hi || prev.seq) + 1) {
        if (data.hi && prev.hi) {
          prev.hi = data.hi;
          return false;
        }

        prev = data;
        return true;
      }

      if (prev.hi) {
        prev.hi = data.hi || data.seq;
      } else {
        prev = {
          seq: prev.seq + 1,
          hi: data.hi || data.seq
        };
        ranges.push(prev);
      }

      if (!data.hi) {
        prev = data;
        return true;
      }

      return false;
    });

    const last = this._messages.getLast();

    const maxSeq = Math.max(this.seq, this._maxSeq) || 0;

    if (maxSeq > 0 && !last || last && (last.hi || last.seq) < maxSeq) {
      if (last && last.hi) {
        last.hi = maxSeq;
      } else {
        ranges.push({
          seq: last ? last.seq + 1 : 1,
          hi: maxSeq
        });
      }
    }

    ranges.forEach(gap => {
      gap._status = Const.MESSAGE_STATUS_DEL_RANGE;

      this._messages.put(gap);
    });
  }

  _loadMessages(db, params) {
    const {
      since,
      before,
      limit
    } = params || {};
    return db.readMessages(this.name, {
      since: since,
      before: before,
      limit: limit || Const.DEFAULT_MESSAGES_PAGE
    }).then(msgs => {
      msgs.forEach(data => {
        if (data.seq > this._maxSeq) {
          this._maxSeq = data.seq;
        }

        if (data.seq < this._minSeq || this._minSeq == 0) {
          this._minSeq = data.seq;
        }

        this._messages.put(data);
      });

      if (msgs.length > 0) {
        this._updateDeletedRanges();
      }

      return msgs.length;
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

exports.Topic = Topic;

class TopicMe extends Topic {
  constructor(callbacks) {
    super(Const.TOPIC_ME, callbacks);

    _defineProperty(this, "onContactUpdate", void 0);

    if (callbacks) {
      this.onContactUpdate = callbacks.onContactUpdate;
    }
  }

  _processMetaDesc(desc) {
    const turnOff = desc.acs && !desc.acs.isPresencer() && this.acs && this.acs.isPresencer();
    (0, _utils.mergeObj)(this, desc);

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

  _processMetaSub(subs) {
    let updateCount = 0;
    subs.forEach(sub => {
      const topicName = sub.topic;

      if (topicName == Const.TOPIC_FND || topicName == Const.TOPIC_ME) {
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

        cont = (0, _utils.mergeObj)(this._tinode.getTopic(topicName), sub);

        this._tinode._db.updTopic(cont);

        if (Topic.isP2PTopicName(topicName)) {
          this._cachePutUser(topicName, cont);

          this._tinode._db.updUser(topicName, cont.public);
        }

        if (!sub._noForwarding) {
          const topic = this._tinode.getTopic(topicName);

          if (topic) {
            sub._noForwarding = true;

            topic._processMetaDesc(sub);
          }
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
    if (creds.length == 1 && creds[0] == Const.DEL_CHAR) {
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

    if (pres.what == 'upd' && pres.src == Const.TOPIC_ME) {
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
          if (cont.acs) {
            cont.acs.updateAll(pres.dacs);
          } else {
            cont.acs = new _accessMode.default().updateAll(pres.dacs);
          }

          cont.touched = new Date();
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
          if (!cont._deleted) {
            cont._deleted = true;
            cont._attached = false;

            this._tinode._db.markTopicAsDeleted(pres.src, true);
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
        const acs = new _accessMode.default(pres.dacs);

        if (!acs || acs.mode == _accessMode.default._INVALID) {
          this._tinode.logger("ERROR: Invalid access mode update", pres.src, pres.dacs);

          return;
        } else if (acs.mode == _accessMode.default._NONE) {
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
      }
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

exports.TopicMe = TopicMe;

class TopicFnd extends Topic {
  constructor(callbacks) {
    super(Const.TOPIC_FND, callbacks);

    _defineProperty(this, "_contacts", {});
  }

  _processMetaSub(subs) {
    let updateCount = Object.getOwnPropertyNames(this._contacts).length;
    this._contacts = {};

    for (let idx in subs) {
      let sub = subs[idx];
      const indexBy = sub.topic ? sub.topic : sub.user;
      sub = (0, _utils.mergeToCache)(this._contacts, indexBy, sub);
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
    return Object.getPrototypeOf(TopicFnd.prototype).setMeta.call(this, params).then(() => {
      if (Object.keys(this._contacts).length > 0) {
        this._contacts = {};

        if (this.onSubsUpdated) {
          this.onSubsUpdated([]);
        }
      }
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

exports.TopicFnd = TopicFnd;

},{"./access-mode.js":1,"./cbuffer.js":2,"./config.js":3,"./drafty.js":6,"./meta-builder.js":8,"./utils.js":11}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isUrlRelative = isUrlRelative;
exports.jsonParseHelper = jsonParseHelper;
exports.mergeObj = mergeObj;
exports.mergeToCache = mergeToCache;
exports.normalizeArray = normalizeArray;
exports.rfc3339DateString = rfc3339DateString;
exports.simplify = simplify;

var _accessMode = _interopRequireDefault(require("./access-mode.js"));

var _config = _interopRequireDefault(require("./config.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function jsonParseHelper(key, val) {
  if (typeof val == 'string' && val.length >= 20 && val.length <= 24 && ['ts', 'touched', 'updated', 'created', 'when', 'deleted', 'expires'].includes(key)) {
    const date = new Date(val);

    if (!isNaN(date)) {
      return date;
    }
  } else if (key === 'acs' && typeof val === 'object') {
    return new _accessMode.default(val);
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

    if (src === _config.default) {
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

  if (src instanceof _accessMode.default) {
    return new _accessMode.default(src);
  }

  if (src instanceof Array) {
    return src;
  }

  if (!dst || dst === _config.default) {
    dst = src.constructor();
  }

  for (let prop in src) {
    if (src.hasOwnProperty(prop) && (!ignore || !ignore[prop]) && prop != '_noForwarding') {
      dst[prop] = mergeObj(dst[prop], src[prop]);
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

    out.sort().filter(function (item, pos, ary) {
      return !pos || item != ary[pos - 1];
    });
  }

  if (out.length == 0) {
    out.push(_config.default);
  }

  return out;
}

},{"./access-mode.js":1,"./config.js":3}],12:[function(require,module,exports){
module.exports={"version": "0.19.0-alpha1"}

},{}]},{},[9])(9)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYWNjZXNzLW1vZGUuanMiLCJzcmMvY2J1ZmZlci5qcyIsInNyYy9jb25maWcuanMiLCJzcmMvY29ubmVjdGlvbi5qcyIsInNyYy9kYi5qcyIsInNyYy9kcmFmdHkuanMiLCJzcmMvbGFyZ2UtZmlsZS5qcyIsInNyYy9tZXRhLWJ1aWxkZXIuanMiLCJzcmMvdGlub2RlLmpzIiwic3JjL3RvcGljLmpzIiwic3JjL3V0aWxzLmpzIiwidmVyc2lvbi5qc29uIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDS0E7Ozs7Ozs7Ozs7O0FBY2UsTUFBTSxVQUFOLENBQWlCO0FBQzlCLEVBQUEsV0FBVyxDQUFDLEdBQUQsRUFBTTtBQUNmLFFBQUksR0FBSixFQUFTO0FBQ1AsV0FBSyxLQUFMLEdBQWEsT0FBTyxHQUFHLENBQUMsS0FBWCxJQUFvQixRQUFwQixHQUErQixHQUFHLENBQUMsS0FBbkMsR0FBMkMsVUFBVSxDQUFDLE1BQVgsQ0FBa0IsR0FBRyxDQUFDLEtBQXRCLENBQXhEO0FBQ0EsV0FBSyxJQUFMLEdBQVksT0FBTyxHQUFHLENBQUMsSUFBWCxJQUFtQixRQUFuQixHQUE4QixHQUFHLENBQUMsSUFBbEMsR0FBeUMsVUFBVSxDQUFDLE1BQVgsQ0FBa0IsR0FBRyxDQUFDLElBQXRCLENBQXJEO0FBQ0EsV0FBSyxJQUFMLEdBQVksR0FBRyxDQUFDLElBQUosR0FBWSxPQUFPLEdBQUcsQ0FBQyxJQUFYLElBQW1CLFFBQW5CLEdBQThCLEdBQUcsQ0FBQyxJQUFsQyxHQUF5QyxVQUFVLENBQUMsTUFBWCxDQUFrQixHQUFHLENBQUMsSUFBdEIsQ0FBckQsR0FDVCxLQUFLLEtBQUwsR0FBYSxLQUFLLElBRHJCO0FBRUQ7QUFDRjs7QUFpQlksU0FBTixNQUFNLENBQUMsR0FBRCxFQUFNO0FBQ2pCLFFBQUksQ0FBQyxHQUFMLEVBQVU7QUFDUixhQUFPLElBQVA7QUFDRCxLQUZELE1B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LEdBQWQsQ0FBSixFQUF3QjtBQUV0QixTQUFLLElBQUksQ0FBQyxHQUFHLENBQVIsRUFBVyxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQXhCLEVBQWdDLENBQUMsR0FBRyxDQUFwQyxFQUF1QyxDQUFDLEVBQXhDLEVBQTRDO0FBQzFDLFVBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFELENBQVg7O0FBQ0EsVUFBSSxDQUFKLEVBQU87QUFDTCxRQUFBLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBRixHQUFTLFdBQVQsRUFBSjs7QUFDQSxZQUFJLENBQUMsQ0FBQyxNQUFGLEdBQVcsQ0FBZixFQUFrQjtBQUNoQixVQUFBLEdBQUcsQ0FBQyxJQUFKLENBQVMsQ0FBVDtBQUNEO0FBQ0Y7QUFDRjs7QUFDRCxJQUFBLEdBQUcsQ0FBQyxJQUFKLEdBQVcsTUFBWCxDQUFrQixVQUFTLElBQVQsRUFBZSxHQUFmLEVBQW9CLEdBQXBCLEVBQXlCO0FBQ3pDLGFBQU8sQ0FBQyxHQUFELElBQVEsSUFBSSxJQUFJLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBUCxDQUExQjtBQUNELEtBRkQ7QUFHRDs7QUFDRCxNQUFJLEdBQUcsQ0FBQyxNQUFKLElBQWMsQ0FBbEIsRUFBcUI7QUFHbkIsSUFBQSxHQUFHLENBQUMsSUFBSixDQUFTLGVBQVQ7QUFDRDs7QUFDRCxTQUFPLEdBQVA7QUFDRDs7O0FDdEtEO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvKipcbiAqIEBmaWxlIEFjY2VzcyBjb250cm9sIG1vZGVsLlxuICpcbiAqIEBjb3B5cmlnaHQgMjAxNS0yMDIyIFRpbm9kZSBMTEMuXG4gKi9cbid1c2Ugc3RyaWN0JztcblxuLy8gTk9URSBUTyBERVZFTE9QRVJTOlxuLy8gTG9jYWxpemFibGUgc3RyaW5ncyBzaG91bGQgYmUgZG91YmxlIHF1b3RlZCBcItGB0YLRgNC+0LrQsCDQvdCwINC00YDRg9Cz0L7QvCDRj9C30YvQutC1XCIsXG4vLyBub24tbG9jYWxpemFibGUgc3RyaW5ncyBzaG91bGQgYmUgc2luZ2xlIHF1b3RlZCAnbm9uLWxvY2FsaXplZCcuXG5cbi8qKlxuICogSGVscGVyIGNsYXNzIGZvciBoYW5kbGluZyBhY2Nlc3MgbW9kZS5cbiAqXG4gKiBAY2xhc3MgQWNjZXNzTW9kZVxuICogQG1lbWJlcm9mIFRpbm9kZVxuICpcbiAqIEBwYXJhbSB7QWNjZXNzTW9kZXxPYmplY3Q9fSBhY3MgLSBBY2Nlc3NNb2RlIHRvIGNvcHkgb3IgYWNjZXNzIG1vZGUgb2JqZWN0IHJlY2VpdmVkIGZyb20gdGhlIHNlcnZlci5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQWNjZXNzTW9kZSB7XG4gIGNvbnN0cnVjdG9yKGFjcykge1xuICAgIGlmIChhY3MpIHtcbiAgICAgIHRoaXMuZ2l2ZW4gPSB0eXBlb2YgYWNzLmdpdmVuID09ICdudW1iZXInID8gYWNzLmdpdmVuIDogQWNjZXNzTW9kZS5kZWNvZGUoYWNzLmdpdmVuKTtcbiAgICAgIHRoaXMud2FudCA9IHR5cGVvZiBhY3Mud2FudCA9PSAnbnVtYmVyJyA/IGFjcy53YW50IDogQWNjZXNzTW9kZS5kZWNvZGUoYWNzLndhbnQpO1xuICAgICAgdGhpcy5tb2RlID0gYWNzLm1vZGUgPyAodHlwZW9mIGFjcy5tb2RlID09ICdudW1iZXInID8gYWNzLm1vZGUgOiBBY2Nlc3NNb2RlLmRlY29kZShhY3MubW9kZSkpIDpcbiAgICAgICAgKHRoaXMuZ2l2ZW4gJiB0aGlzLndhbnQpO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyAjY2hlY2tGbGFnKHZhbCwgc2lkZSwgZmxhZykge1xuICAgIHNpZGUgPSBzaWRlIHx8ICdtb2RlJztcbiAgICBpZiAoWydnaXZlbicsICd3YW50JywgJ21vZGUnXS5pbmNsdWRlcyhzaWRlKSkge1xuICAgICAgcmV0dXJuICgodmFsW3NpZGVdICYgZmxhZykgIT0gMCk7XG4gICAgfVxuICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBBY2Nlc3NNb2RlIGNvbXBvbmVudCAnJHtzaWRlfSdgKTtcbiAgfVxuICAvKipcbiAgICogUGFyc2Ugc3RyaW5nIGludG8gYW4gYWNjZXNzIG1vZGUgdmFsdWUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nIHwgTnVtYmVyfSBtb2RlIC0gZWl0aGVyIGEgU3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBhY2Nlc3MgbW9kZSB0byBwYXJzZSBvciBhIHNldCBvZiBiaXRzIHRvIGFzc2lnbi5cbiAgICogQHJldHVybnMge251bWJlcn0gLSBBY2Nlc3MgbW9kZSBhcyBhIG51bWVyaWMgdmFsdWUuXG4gICAqL1xuICBzdGF0aWMgZGVjb2RlKHN0cikge1xuICAgIGlmICghc3RyKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBzdHIgPT0gJ251bWJlcicpIHtcbiAgICAgIHJldHVybiBzdHIgJiBBY2Nlc3NNb2RlLl9CSVRNQVNLO1xuICAgIH0gZWxzZSBpZiAoc3RyID09PSAnTicgfHwgc3RyID09PSAnbicpIHtcbiAgICAgIHJldHVybiBBY2Nlc3NNb2RlLl9OT05FO1xuICAgIH1cblxuICAgIGNvbnN0IGJpdG1hc2sgPSB7XG4gICAgICAnSic6IEFjY2Vzc01vZGUuX0pPSU4sXG4gICAgICAnUic6IEFjY2Vzc01vZGUuX1JFQUQsXG4gICAgICAnVyc6IEFjY2Vzc01vZGUuX1dSSVRFLFxuICAgICAgJ1AnOiBBY2Nlc3NNb2RlLl9QUkVTLFxuICAgICAgJ0EnOiBBY2Nlc3NNb2RlLl9BUFBST1ZFLFxuICAgICAgJ1MnOiBBY2Nlc3NNb2RlLl9TSEFSRSxcbiAgICAgICdEJzogQWNjZXNzTW9kZS5fREVMRVRFLFxuICAgICAgJ08nOiBBY2Nlc3NNb2RlLl9PV05FUlxuICAgIH07XG5cbiAgICBsZXQgbTAgPSBBY2Nlc3NNb2RlLl9OT05FO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGJpdCA9IGJpdG1hc2tbc3RyLmNoYXJBdChpKS50b1VwcGVyQ2FzZSgpXTtcbiAgICAgIGlmICghYml0KSB7XG4gICAgICAgIC8vIFVucmVjb2duaXplZCBiaXQsIHNraXAuXG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgbTAgfD0gYml0O1xuICAgIH1cbiAgICByZXR1cm4gbTA7XG4gIH1cbiAgLyoqXG4gICAqIENvbnZlcnQgbnVtZXJpYyByZXByZXNlbnRhdGlvbiBvZiB0aGUgYWNjZXNzIG1vZGUgaW50byBhIHN0cmluZy5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IHZhbCAtIGFjY2VzcyBtb2RlIHZhbHVlIHRvIGNvbnZlcnQgdG8gYSBzdHJpbmcuXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IC0gQWNjZXNzIG1vZGUgYXMgYSBzdHJpbmcuXG4gICAqL1xuICBzdGF0aWMgZW5jb2RlKHZhbCkge1xuICAgIGlmICh2YWwgPT09IG51bGwgfHwgdmFsID09PSBBY2Nlc3NNb2RlLl9JTlZBTElEKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9IGVsc2UgaWYgKHZhbCA9PT0gQWNjZXNzTW9kZS5fTk9ORSkge1xuICAgICAgcmV0dXJuICdOJztcbiAgICB9XG5cbiAgICBjb25zdCBiaXRtYXNrID0gWydKJywgJ1InLCAnVycsICdQJywgJ0EnLCAnUycsICdEJywgJ08nXTtcbiAgICBsZXQgcmVzID0gJyc7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBiaXRtYXNrLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoKHZhbCAmICgxIDw8IGkpKSAhPSAwKSB7XG4gICAgICAgIHJlcyA9IHJlcyArIGJpdG1hc2tbaV07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXM7XG4gIH1cbiAgLyoqXG4gICAqIFVwZGF0ZSBudW1lcmljIHJlcHJlc2VudGF0aW9uIG9mIGFjY2VzcyBtb2RlIHdpdGggdGhlIG5ldyB2YWx1ZS4gVGhlIHZhbHVlXG4gICAqIGlzIG9uZSBvZiB0aGUgZm9sbG93aW5nOlxuICAgKiAgLSBhIHN0cmluZyBzdGFydGluZyB3aXRoIDxjb2RlPicrJzwvY29kZT4gb3IgPGNvZGU+Jy0nPC9jb2RlPiB0aGVuIHRoZSBiaXRzIHRvIGFkZCBvciByZW1vdmUsIGUuZy4gPGNvZGU+JytSLVcnPC9jb2RlPiBvciA8Y29kZT4nLVBTJzwvY29kZT4uXG4gICAqICAtIGEgbmV3IHZhbHVlIG9mIGFjY2VzcyBtb2RlXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB2YWwgLSBhY2Nlc3MgbW9kZSB2YWx1ZSB0byB1cGRhdGUuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1cGQgLSB1cGRhdGUgdG8gYXBwbHkgdG8gdmFsLlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSAtIHVwZGF0ZWQgYWNjZXNzIG1vZGUuXG4gICAqL1xuICBzdGF0aWMgdXBkYXRlKHZhbCwgdXBkKSB7XG4gICAgaWYgKCF1cGQgfHwgdHlwZW9mIHVwZCAhPSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIHZhbDtcbiAgICB9XG5cbiAgICBsZXQgYWN0aW9uID0gdXBkLmNoYXJBdCgwKTtcbiAgICBpZiAoYWN0aW9uID09ICcrJyB8fCBhY3Rpb24gPT0gJy0nKSB7XG4gICAgICBsZXQgdmFsMCA9IHZhbDtcbiAgICAgIC8vIFNwbGl0IGRlbHRhLXN0cmluZyBsaWtlICcrQUJDLURFRitaJyBpbnRvIGFuIGFycmF5IG9mIHBhcnRzIGluY2x1ZGluZyArIGFuZCAtLlxuICAgICAgY29uc3QgcGFydHMgPSB1cGQuc3BsaXQoLyhbLStdKS8pO1xuICAgICAgLy8gU3RhcnRpbmcgaXRlcmF0aW9uIGZyb20gMSBiZWNhdXNlIFN0cmluZy5zcGxpdCgpIGNyZWF0ZXMgYW4gYXJyYXkgd2l0aCB0aGUgZmlyc3QgZW1wdHkgZWxlbWVudC5cbiAgICAgIC8vIEl0ZXJhdGluZyBieSAyIGJlY2F1c2Ugd2UgcGFyc2UgcGFpcnMgKy8tIHRoZW4gZGF0YS5cbiAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgcGFydHMubGVuZ3RoIC0gMTsgaSArPSAyKSB7XG4gICAgICAgIGFjdGlvbiA9IHBhcnRzW2ldO1xuICAgICAgICBjb25zdCBtMCA9IEFjY2Vzc01vZGUuZGVjb2RlKHBhcnRzW2kgKyAxXSk7XG4gICAgICAgIGlmIChtMCA9PSBBY2Nlc3NNb2RlLl9JTlZBTElEKSB7XG4gICAgICAgICAgcmV0dXJuIHZhbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAobTAgPT0gbnVsbCkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhY3Rpb24gPT09ICcrJykge1xuICAgICAgICAgIHZhbDAgfD0gbTA7XG4gICAgICAgIH0gZWxzZSBpZiAoYWN0aW9uID09PSAnLScpIHtcbiAgICAgICAgICB2YWwwICY9IH5tMDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdmFsID0gdmFsMDtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVGhlIHN0cmluZyBpcyBhbiBleHBsaWNpdCBuZXcgdmFsdWUgJ0FCQycgcmF0aGVyIHRoYW4gZGVsdGEuXG4gICAgICBjb25zdCB2YWwwID0gQWNjZXNzTW9kZS5kZWNvZGUodXBkKTtcbiAgICAgIGlmICh2YWwwICE9IEFjY2Vzc01vZGUuX0lOVkFMSUQpIHtcbiAgICAgICAgdmFsID0gdmFsMDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdmFsO1xuICB9XG4gIC8qKlxuICAgKiBCaXRzIHByZXNlbnQgaW4gYTEgYnV0IG1pc3NpbmcgaW4gYTIuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlciB8IHN0cmluZ30gYTEgLSBhY2Nlc3MgbW9kZSB0byBzdWJ0cmFjdCBmcm9tLlxuICAgKiBAcGFyYW0ge251bWJlciB8IHN0cmluZ30gYTIgLSBhY2Nlc3MgbW9kZSB0byBzdWJ0cmFjdC5cbiAgICogQHJldHVybnMge251bWJlcn0gYWNjZXNzIG1vZGUgd2l0aCBiaXRzIHByZXNlbnQgaW4gPGNvZGU+YTE8L2NvZGU+IGJ1dCBtaXNzaW5nIGluIDxjb2RlPmEyPC9jb2RlPi5cbiAgICovXG4gIHN0YXRpYyBkaWZmKGExLCBhMikge1xuICAgIGExID0gQWNjZXNzTW9kZS5kZWNvZGUoYTEpO1xuICAgIGEyID0gQWNjZXNzTW9kZS5kZWNvZGUoYTIpO1xuXG4gICAgaWYgKGExID09IEFjY2Vzc01vZGUuX0lOVkFMSUQgfHwgYTIgPT0gQWNjZXNzTW9kZS5fSU5WQUxJRCkge1xuICAgICAgcmV0dXJuIEFjY2Vzc01vZGUuX0lOVkFMSUQ7XG4gICAgfVxuICAgIHJldHVybiBhMSAmIH5hMjtcbiAgfVxuICAvKipcbiAgICogQWNjZXNzTW9kZSBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyB0b3BpYyBhY2Nlc3MgbW9kZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAY2xhc3MgQWNjZXNzTW9kZVxuICAgKi9cbiAgLyoqXG4gICAqIEN1c3RvbSBmb3JtYXR0ZXJcbiAgICovXG4gIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiAne1wibW9kZVwiOiBcIicgKyBBY2Nlc3NNb2RlLmVuY29kZSh0aGlzLm1vZGUpICtcbiAgICAgICdcIiwgXCJnaXZlblwiOiBcIicgKyBBY2Nlc3NNb2RlLmVuY29kZSh0aGlzLmdpdmVuKSArXG4gICAgICAnXCIsIFwid2FudFwiOiBcIicgKyBBY2Nlc3NNb2RlLmVuY29kZSh0aGlzLndhbnQpICsgJ1wifSc7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBDb252ZXJ0cyBudW1lcmljIHZhbHVlcyB0byBzdHJpbmdzLlxuICAgKi9cbiAganNvbkhlbHBlcigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbW9kZTogQWNjZXNzTW9kZS5lbmNvZGUodGhpcy5tb2RlKSxcbiAgICAgIGdpdmVuOiBBY2Nlc3NNb2RlLmVuY29kZSh0aGlzLmdpdmVuKSxcbiAgICAgIHdhbnQ6IEFjY2Vzc01vZGUuZW5jb2RlKHRoaXMud2FudClcbiAgICB9O1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogQXNzaWduIHZhbHVlIHRvICdtb2RlJy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nIHwgTnVtYmVyfSBtIC0gZWl0aGVyIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBhY2Nlc3MgbW9kZSBvciBhIHNldCBvZiBiaXRzLlxuICAgKiBAcmV0dXJucyB7QWNjZXNzTW9kZX0gLSA8Y29kZT50aGlzPC9jb2RlPiBBY2Nlc3NNb2RlLlxuICAgKi9cbiAgc2V0TW9kZShtKSB7XG4gICAgdGhpcy5tb2RlID0gQWNjZXNzTW9kZS5kZWNvZGUobSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBVcGRhdGUgPGNvZGU+bW9kZTwvY29kZT4gdmFsdWUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdSAtIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgY2hhbmdlcyB0byBhcHBseSB0byBhY2Nlc3MgbW9kZS5cbiAgICogQHJldHVybnMge0FjY2Vzc01vZGV9IC0gPGNvZGU+dGhpczwvY29kZT4gQWNjZXNzTW9kZS5cbiAgICovXG4gIHVwZGF0ZU1vZGUodSkge1xuICAgIHRoaXMubW9kZSA9IEFjY2Vzc01vZGUudXBkYXRlKHRoaXMubW9kZSwgdSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBHZXQgPGNvZGU+bW9kZTwvY29kZT4gdmFsdWUgYXMgYSBzdHJpbmcuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSAtIDxjb2RlPm1vZGU8L2NvZGU+IHZhbHVlLlxuICAgKi9cbiAgZ2V0TW9kZSgpIHtcbiAgICByZXR1cm4gQWNjZXNzTW9kZS5lbmNvZGUodGhpcy5tb2RlKTtcbiAgfVxuICAvKipcbiAgICogQWNjZXNzTW9kZSBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyB0b3BpYyBhY2Nlc3MgbW9kZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAY2xhc3MgQWNjZXNzTW9kZVxuICAgKi9cbiAgLyoqXG4gICAqIEFzc2lnbiA8Y29kZT5naXZlbjwvY29kZT4gIHZhbHVlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmcgfCBOdW1iZXJ9IGcgLSBlaXRoZXIgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIGFjY2VzcyBtb2RlIG9yIGEgc2V0IG9mIGJpdHMuXG4gICAqIEByZXR1cm5zIHtBY2Nlc3NNb2RlfSAtIDxjb2RlPnRoaXM8L2NvZGU+IEFjY2Vzc01vZGUuXG4gICAqL1xuICBzZXRHaXZlbihnKSB7XG4gICAgdGhpcy5naXZlbiA9IEFjY2Vzc01vZGUuZGVjb2RlKGcpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogVXBkYXRlICdnaXZlbicgdmFsdWUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdSAtIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgY2hhbmdlcyB0byBhcHBseSB0byBhY2Nlc3MgbW9kZS5cbiAgICogQHJldHVybnMge0FjY2Vzc01vZGV9IC0gPGNvZGU+dGhpczwvY29kZT4gQWNjZXNzTW9kZS5cbiAgICovXG4gIHVwZGF0ZUdpdmVuKHUpIHtcbiAgICB0aGlzLmdpdmVuID0gQWNjZXNzTW9kZS51cGRhdGUodGhpcy5naXZlbiwgdSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBHZXQgJ2dpdmVuJyB2YWx1ZSBhcyBhIHN0cmluZy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IC0gPGI+Z2l2ZW48L2I+IHZhbHVlLlxuICAgKi9cbiAgZ2V0R2l2ZW4oKSB7XG4gICAgcmV0dXJuIEFjY2Vzc01vZGUuZW5jb2RlKHRoaXMuZ2l2ZW4pO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogQXNzaWduICd3YW50JyB2YWx1ZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nIHwgTnVtYmVyfSB3IC0gZWl0aGVyIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBhY2Nlc3MgbW9kZSBvciBhIHNldCBvZiBiaXRzLlxuICAgKiBAcmV0dXJucyB7QWNjZXNzTW9kZX0gLSA8Y29kZT50aGlzPC9jb2RlPiBBY2Nlc3NNb2RlLlxuICAgKi9cbiAgc2V0V2FudCh3KSB7XG4gICAgdGhpcy53YW50ID0gQWNjZXNzTW9kZS5kZWNvZGUodyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBVcGRhdGUgJ3dhbnQnIHZhbHVlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHUgLSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIGNoYW5nZXMgdG8gYXBwbHkgdG8gYWNjZXNzIG1vZGUuXG4gICAqIEByZXR1cm5zIHtBY2Nlc3NNb2RlfSAtIDxjb2RlPnRoaXM8L2NvZGU+IEFjY2Vzc01vZGUuXG4gICAqL1xuICB1cGRhdGVXYW50KHUpIHtcbiAgICB0aGlzLndhbnQgPSBBY2Nlc3NNb2RlLnVwZGF0ZSh0aGlzLndhbnQsIHUpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogR2V0ICd3YW50JyB2YWx1ZSBhcyBhIHN0cmluZy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IC0gPGI+d2FudDwvYj4gdmFsdWUuXG4gICAqL1xuICBnZXRXYW50KCkge1xuICAgIHJldHVybiBBY2Nlc3NNb2RlLmVuY29kZSh0aGlzLndhbnQpO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogR2V0IHBlcm1pc3Npb25zIHByZXNlbnQgaW4gJ3dhbnQnIGJ1dCBtaXNzaW5nIGluICdnaXZlbicuXG4gICAqIEludmVyc2Ugb2Yge0BsaW5rIFRpbm9kZS5BY2Nlc3NNb2RlI2dldEV4Y2Vzc2l2ZX1cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IHBlcm1pc3Npb25zIHByZXNlbnQgaW4gPGI+d2FudDwvYj4gYnV0IG1pc3NpbmcgaW4gPGI+Z2l2ZW48L2I+LlxuICAgKi9cbiAgZ2V0TWlzc2luZygpIHtcbiAgICByZXR1cm4gQWNjZXNzTW9kZS5lbmNvZGUodGhpcy53YW50ICYgfnRoaXMuZ2l2ZW4pO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogR2V0IHBlcm1pc3Npb25zIHByZXNlbnQgaW4gJ2dpdmVuJyBidXQgbWlzc2luZyBpbiAnd2FudCcuXG4gICAqIEludmVyc2Ugb2Yge0BsaW5rIFRpbm9kZS5BY2Nlc3NNb2RlI2dldE1pc3Npbmd9XG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBwZXJtaXNzaW9ucyBwcmVzZW50IGluIDxiPmdpdmVuPC9iPiBidXQgbWlzc2luZyBpbiA8Yj53YW50PC9iPi5cbiAgICovXG4gIGdldEV4Y2Vzc2l2ZSgpIHtcbiAgICByZXR1cm4gQWNjZXNzTW9kZS5lbmNvZGUodGhpcy5naXZlbiAmIH50aGlzLndhbnQpO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogVXBkYXRlICd3YW50JywgJ2dpdmUnLCBhbmQgJ21vZGUnIHZhbHVlcy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqXG4gICAqIEBwYXJhbSB7QWNjZXNzTW9kZX0gdmFsIC0gbmV3IGFjY2VzcyBtb2RlIHZhbHVlLlxuICAgKiBAcmV0dXJucyB7QWNjZXNzTW9kZX0gLSA8Y29kZT50aGlzPC9jb2RlPiBBY2Nlc3NNb2RlLlxuICAgKi9cbiAgdXBkYXRlQWxsKHZhbCkge1xuICAgIGlmICh2YWwpIHtcbiAgICAgIHRoaXMudXBkYXRlR2l2ZW4odmFsLmdpdmVuKTtcbiAgICAgIHRoaXMudXBkYXRlV2FudCh2YWwud2FudCk7XG4gICAgICB0aGlzLm1vZGUgPSB0aGlzLmdpdmVuICYgdGhpcy53YW50O1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICAvKipcbiAgICogQWNjZXNzTW9kZSBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyB0b3BpYyBhY2Nlc3MgbW9kZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAY2xhc3MgQWNjZXNzTW9kZVxuICAgKi9cbiAgLyoqXG4gICAqIENoZWNrIGlmIE93bmVyIChPKSBmbGFnIGlzIHNldC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gc2lkZSAtIHdoaWNoIHBlcm1pc3Npb24gdG8gY2hlY2s6IGdpdmVuLCB3YW50LCBtb2RlOyBkZWZhdWx0OiBtb2RlLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSA8Y29kZT50cnVlPC9jb2RlPiBpZiBmbGFnIGlzIHNldC5cbiAgICovXG4gIGlzT3duZXIoc2lkZSkge1xuICAgIHJldHVybiBBY2Nlc3NNb2RlLiNjaGVja0ZsYWcodGhpcywgc2lkZSwgQWNjZXNzTW9kZS5fT1dORVIpO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogQ2hlY2sgaWYgUHJlc2VuY2UgKFApIGZsYWcgaXMgc2V0LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICogQHBhcmFtIHtzdHJpbmc9fSBzaWRlIC0gd2hpY2ggcGVybWlzc2lvbiB0byBjaGVjazogZ2l2ZW4sIHdhbnQsIG1vZGU7IGRlZmF1bHQ6IG1vZGUuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIDxjb2RlPnRydWU8L2NvZGU+IGlmIGZsYWcgaXMgc2V0LlxuICAgKi9cbiAgaXNQcmVzZW5jZXIoc2lkZSkge1xuICAgIHJldHVybiBBY2Nlc3NNb2RlLiNjaGVja0ZsYWcodGhpcywgc2lkZSwgQWNjZXNzTW9kZS5fUFJFUyk7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBDaGVjayBpZiBQcmVzZW5jZSAoUCkgZmxhZyBpcyBOT1Qgc2V0LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICogQHBhcmFtIHtzdHJpbmc9fSBzaWRlIC0gd2hpY2ggcGVybWlzc2lvbiB0byBjaGVjazogZ2l2ZW4sIHdhbnQsIG1vZGU7IGRlZmF1bHQ6IG1vZGUuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIDxjb2RlPnRydWU8L2NvZGU+IGlmIGZsYWcgaXMgc2V0LlxuICAgKi9cbiAgaXNNdXRlZChzaWRlKSB7XG4gICAgcmV0dXJuICF0aGlzLmlzUHJlc2VuY2VyKHNpZGUpO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogQ2hlY2sgaWYgSm9pbiAoSikgZmxhZyBpcyBzZXQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKiBAcGFyYW0ge3N0cmluZz19IHNpZGUgLSB3aGljaCBwZXJtaXNzaW9uIHRvIGNoZWNrOiBnaXZlbiwgd2FudCwgbW9kZTsgZGVmYXVsdDogbW9kZS5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IC0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgZmxhZyBpcyBzZXQuXG4gICAqL1xuICBpc0pvaW5lcihzaWRlKSB7XG4gICAgcmV0dXJuIEFjY2Vzc01vZGUuI2NoZWNrRmxhZyh0aGlzLCBzaWRlLCBBY2Nlc3NNb2RlLl9KT0lOKTtcbiAgfVxuICAvKipcbiAgICogQWNjZXNzTW9kZSBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyB0b3BpYyBhY2Nlc3MgbW9kZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAY2xhc3MgQWNjZXNzTW9kZVxuICAgKi9cbiAgLyoqXG4gICAqIENoZWNrIGlmIFJlYWRlciAoUikgZmxhZyBpcyBzZXQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKiBAcGFyYW0ge3N0cmluZz19IHNpZGUgLSB3aGljaCBwZXJtaXNzaW9uIHRvIGNoZWNrOiBnaXZlbiwgd2FudCwgbW9kZTsgZGVmYXVsdDogbW9kZS5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IC0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgZmxhZyBpcyBzZXQuXG4gICAqL1xuICBpc1JlYWRlcihzaWRlKSB7XG4gICAgcmV0dXJuIEFjY2Vzc01vZGUuI2NoZWNrRmxhZyh0aGlzLCBzaWRlLCBBY2Nlc3NNb2RlLl9SRUFEKTtcbiAgfVxuICAvKipcbiAgICogQWNjZXNzTW9kZSBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyB0b3BpYyBhY2Nlc3MgbW9kZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAY2xhc3MgQWNjZXNzTW9kZVxuICAgKi9cbiAgLyoqXG4gICAqIENoZWNrIGlmIFdyaXRlciAoVykgZmxhZyBpcyBzZXQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKiBAcGFyYW0ge3N0cmluZz19IHNpZGUgLSB3aGljaCBwZXJtaXNzaW9uIHRvIGNoZWNrOiBnaXZlbiwgd2FudCwgbW9kZTsgZGVmYXVsdDogbW9kZS5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IC0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgZmxhZyBpcyBzZXQuXG4gICAqL1xuICBpc1dyaXRlcihzaWRlKSB7XG4gICAgcmV0dXJuIEFjY2Vzc01vZGUuI2NoZWNrRmxhZyh0aGlzLCBzaWRlLCBBY2Nlc3NNb2RlLl9XUklURSk7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBDaGVjayBpZiBBcHByb3ZlciAoQSkgZmxhZyBpcyBzZXQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKiBAcGFyYW0ge3N0cmluZz19IHNpZGUgLSB3aGljaCBwZXJtaXNzaW9uIHRvIGNoZWNrOiBnaXZlbiwgd2FudCwgbW9kZTsgZGVmYXVsdDogbW9kZS5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IC0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgZmxhZyBpcyBzZXQuXG4gICAqL1xuICBpc0FwcHJvdmVyKHNpZGUpIHtcbiAgICByZXR1cm4gQWNjZXNzTW9kZS4jY2hlY2tGbGFnKHRoaXMsIHNpZGUsIEFjY2Vzc01vZGUuX0FQUFJPVkUpO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogQ2hlY2sgaWYgZWl0aGVyIG9uZSBvZiBPd25lciAoTykgb3IgQXBwcm92ZXIgKEEpIGZsYWdzIGlzIHNldC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gc2lkZSAtIHdoaWNoIHBlcm1pc3Npb24gdG8gY2hlY2s6IGdpdmVuLCB3YW50LCBtb2RlOyBkZWZhdWx0OiBtb2RlLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSA8Y29kZT50cnVlPC9jb2RlPiBpZiBmbGFnIGlzIHNldC5cbiAgICovXG4gIGlzQWRtaW4oc2lkZSkge1xuICAgIHJldHVybiB0aGlzLmlzT3duZXIoc2lkZSkgfHwgdGhpcy5pc0FwcHJvdmVyKHNpZGUpO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogQ2hlY2sgaWYgZWl0aGVyIG9uZSBvZiBPd25lciAoTyksIEFwcHJvdmVyIChBKSwgb3IgU2hhcmVyIChTKSBmbGFncyBpcyBzZXQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKiBAcGFyYW0ge3N0cmluZz19IHNpZGUgLSB3aGljaCBwZXJtaXNzaW9uIHRvIGNoZWNrOiBnaXZlbiwgd2FudCwgbW9kZTsgZGVmYXVsdDogbW9kZS5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IC0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgZmxhZyBpcyBzZXQuXG4gICAqL1xuICBpc1NoYXJlcihzaWRlKSB7XG4gICAgcmV0dXJuIHRoaXMuaXNBZG1pbihzaWRlKSB8fCBBY2Nlc3NNb2RlLiNjaGVja0ZsYWcodGhpcywgc2lkZSwgQWNjZXNzTW9kZS5fU0hBUkUpO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogQ2hlY2sgaWYgRGVsZXRlciAoRCkgZmxhZyBpcyBzZXQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKiBAcGFyYW0ge3N0cmluZz19IHNpZGUgLSB3aGljaCBwZXJtaXNzaW9uIHRvIGNoZWNrOiBnaXZlbiwgd2FudCwgbW9kZTsgZGVmYXVsdDogbW9kZS5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IC0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgZmxhZyBpcyBzZXQuXG4gICAqL1xuICBpc0RlbGV0ZXIoc2lkZSkge1xuICAgIHJldHVybiBBY2Nlc3NNb2RlLiNjaGVja0ZsYWcodGhpcywgc2lkZSwgQWNjZXNzTW9kZS5fREVMRVRFKTtcbiAgfVxufVxuXG5BY2Nlc3NNb2RlLl9OT05FID0gMHgwMDtcbkFjY2Vzc01vZGUuX0pPSU4gPSAweDAxO1xuQWNjZXNzTW9kZS5fUkVBRCA9IDB4MDI7XG5BY2Nlc3NNb2RlLl9XUklURSA9IDB4MDQ7XG5BY2Nlc3NNb2RlLl9QUkVTID0gMHgwODtcbkFjY2Vzc01vZGUuX0FQUFJPVkUgPSAweDEwO1xuQWNjZXNzTW9kZS5fU0hBUkUgPSAweDIwO1xuQWNjZXNzTW9kZS5fREVMRVRFID0gMHg0MDtcbkFjY2Vzc01vZGUuX09XTkVSID0gMHg4MDtcblxuQWNjZXNzTW9kZS5fQklUTUFTSyA9IEFjY2Vzc01vZGUuX0pPSU4gfCBBY2Nlc3NNb2RlLl9SRUFEIHwgQWNjZXNzTW9kZS5fV1JJVEUgfCBBY2Nlc3NNb2RlLl9QUkVTIHxcbiAgQWNjZXNzTW9kZS5fQVBQUk9WRSB8IEFjY2Vzc01vZGUuX1NIQVJFIHwgQWNjZXNzTW9kZS5fREVMRVRFIHwgQWNjZXNzTW9kZS5fT1dORVI7XG5BY2Nlc3NNb2RlLl9JTlZBTElEID0gMHgxMDAwMDA7XG4iLCIvKipcbiAqIEBmaWxlIEluLW1lbW9yeSBzb3J0ZWQgY2FjaGUgb2Ygb2JqZWN0cy5cbiAqXG4gKiBAY29weXJpZ2h0IDIwMTUtMjAyMiBUaW5vZGUgTExDLlxuICovXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogSW4tbWVtb3J5IHNvcnRlZCBjYWNoZSBvZiBvYmplY3RzLlxuICpcbiAqIEBjbGFzcyBDQnVmZmVyXG4gKiBAbWVtYmVyb2YgVGlub2RlXG4gKiBAcHJvdGVjdGVkXG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbn0gY29tcGFyZSBjdXN0b20gY29tcGFyYXRvciBvZiBvYmplY3RzLiBUYWtlcyB0d28gcGFyYW1ldGVycyA8Y29kZT5hPC9jb2RlPiBhbmQgPGNvZGU+YjwvY29kZT47XG4gKiAgICByZXR1cm5zIDxjb2RlPi0xPC9jb2RlPiBpZiA8Y29kZT5hIDwgYjwvY29kZT4sIDxjb2RlPjA8L2NvZGU+IGlmIDxjb2RlPmEgPT0gYjwvY29kZT4sIDxjb2RlPjE8L2NvZGU+IG90aGVyd2lzZS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gdW5pcXVlIGVuZm9yY2UgZWxlbWVudCB1bmlxdWVuZXNzOiB3aGVuIDxjb2RlPnRydWU8L2NvZGU+IHJlcGxhY2UgZXhpc3RpbmcgZWxlbWVudCB3aXRoIGEgbmV3XG4gKiAgICBvbmUgb24gY29uZmxpY3Q7IHdoZW4gPGNvZGU+ZmFsc2U8L2NvZGU+IGtlZXAgYm90aCBlbGVtZW50cy5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ0J1ZmZlciB7XG4gICNjb21wYXJhdG9yID0gdW5kZWZpbmVkO1xuICAjdW5pcXVlID0gZmFsc2U7XG4gIGJ1ZmZlciA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKGNvbXBhcmVfLCB1bmlxdWVfKSB7XG4gICAgdGhpcy4jY29tcGFyYXRvciA9IGNvbXBhcmVfIHx8ICgoYSwgYikgPT4ge1xuICAgICAgcmV0dXJuIGEgPT09IGIgPyAwIDogYSA8IGIgPyAtMSA6IDE7XG4gICAgfSk7XG4gICAgdGhpcy4jdW5pcXVlID0gdW5pcXVlXztcbiAgfVxuXG4gICNmaW5kTmVhcmVzdChlbGVtLCBhcnIsIGV4YWN0KSB7XG4gICAgbGV0IHN0YXJ0ID0gMDtcbiAgICBsZXQgZW5kID0gYXJyLmxlbmd0aCAtIDE7XG4gICAgbGV0IHBpdm90ID0gMDtcbiAgICBsZXQgZGlmZiA9IDA7XG4gICAgbGV0IGZvdW5kID0gZmFsc2U7XG5cbiAgICB3aGlsZSAoc3RhcnQgPD0gZW5kKSB7XG4gICAgICBwaXZvdCA9IChzdGFydCArIGVuZCkgLyAyIHwgMDtcbiAgICAgIGRpZmYgPSB0aGlzLiNjb21wYXJhdG9yKGFycltwaXZvdF0sIGVsZW0pO1xuICAgICAgaWYgKGRpZmYgPCAwKSB7XG4gICAgICAgIHN0YXJ0ID0gcGl2b3QgKyAxO1xuICAgICAgfSBlbHNlIGlmIChkaWZmID4gMCkge1xuICAgICAgICBlbmQgPSBwaXZvdCAtIDE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZm91bmQpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlkeDogcGl2b3QsXG4gICAgICAgIGV4YWN0OiB0cnVlXG4gICAgICB9O1xuICAgIH1cbiAgICBpZiAoZXhhY3QpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlkeDogLTFcbiAgICAgIH07XG4gICAgfVxuICAgIC8vIE5vdCBleGFjdCAtIGluc2VydGlvbiBwb2ludFxuICAgIHJldHVybiB7XG4gICAgICBpZHg6IGRpZmYgPCAwID8gcGl2b3QgKyAxIDogcGl2b3RcbiAgICB9O1xuICB9XG5cbiAgLy8gSW5zZXJ0IGVsZW1lbnQgaW50byBhIHNvcnRlZCBhcnJheS5cbiAgI2luc2VydFNvcnRlZChlbGVtLCBhcnIpIHtcbiAgICBjb25zdCBmb3VuZCA9IHRoaXMuI2ZpbmROZWFyZXN0KGVsZW0sIGFyciwgZmFsc2UpO1xuICAgIGNvbnN0IGNvdW50ID0gKGZvdW5kLmV4YWN0ICYmIHRoaXMuI3VuaXF1ZSkgPyAxIDogMDtcbiAgICBhcnIuc3BsaWNlKGZvdW5kLmlkeCwgY291bnQsIGVsZW0pO1xuICAgIHJldHVybiBhcnI7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGFuIGVsZW1lbnQgYXQgdGhlIGdpdmVuIHBvc2l0aW9uLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNCdWZmZXIjXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBhdCAtIFBvc2l0aW9uIHRvIGZldGNoIGZyb20uXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IEVsZW1lbnQgYXQgdGhlIGdpdmVuIHBvc2l0aW9uIG9yIDxjb2RlPnVuZGVmaW5lZDwvY29kZT4uXG4gICAqL1xuICBnZXRBdChhdCkge1xuICAgIHJldHVybiB0aGlzLmJ1ZmZlclthdF07XG4gIH1cblxuICAvKipcbiAgICogQ29udmVuaWVuY2UgbWV0aG9kIGZvciBnZXR0aW5nIHRoZSBlbGVtZW50IGZyb20gdGhlIGVuZCBvZiB0aGUgYnVmZmVyLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNCdWZmZXIjXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBhdCAtIHBvc2l0aW9uIHRvIGZldGNoIGZyb20sIGNvdW50aW5nIGZyb20gdGhlIGVuZDtcbiAgICogICAgPGNvZGU+dW5kZWZpbmVkPC9jb2RlPiBvciA8Y29kZT5udWxsPC9jb2RlPiAgbWVhbiBcImxhc3RcIi5cbiAgICogQHJldHVybnMge09iamVjdH0gVGhlIGxhc3QgZWxlbWVudCBpbiB0aGUgYnVmZmVyIG9yIDxjb2RlPnVuZGVmaW5lZDwvY29kZT4gaWYgYnVmZmVyIGlzIGVtcHR5LlxuICAgKi9cbiAgZ2V0TGFzdChhdCkge1xuICAgIGF0IHw9IDA7XG4gICAgcmV0dXJuIHRoaXMuYnVmZmVyLmxlbmd0aCA+IGF0ID8gdGhpcy5idWZmZXJbdGhpcy5idWZmZXIubGVuZ3RoIC0gMSAtIGF0XSA6IHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgbmV3IGVsZW1lbnQocykgdG8gdGhlIGJ1ZmZlci4gVmFyaWFkaWM6IHRha2VzIG9uZSBvciBtb3JlIGFyZ3VtZW50cy4gSWYgYW4gYXJyYXkgaXMgcGFzc2VkIGFzIGEgc2luZ2xlXG4gICAqIGFyZ3VtZW50LCBpdHMgZWxlbWVudHMgYXJlIGluc2VydGVkIGluZGl2aWR1YWxseS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5DQnVmZmVyI1xuICAgKlxuICAgKiBAcGFyYW0gey4uLk9iamVjdHxBcnJheX0gLSBPbmUgb3IgbW9yZSBvYmplY3RzIHRvIGluc2VydC5cbiAgICovXG4gIHB1dCgpIHtcbiAgICBsZXQgaW5zZXJ0O1xuICAgIC8vIGluc3BlY3QgYXJndW1lbnRzOiBpZiBhcnJheSwgaW5zZXJ0IGl0cyBlbGVtZW50cywgaWYgb25lIG9yIG1vcmUgbm9uLWFycmF5IGFyZ3VtZW50cywgaW5zZXJ0IHRoZW0gb25lIGJ5IG9uZVxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDEgJiYgQXJyYXkuaXNBcnJheShhcmd1bWVudHNbMF0pKSB7XG4gICAgICBpbnNlcnQgPSBhcmd1bWVudHNbMF07XG4gICAgfSBlbHNlIHtcbiAgICAgIGluc2VydCA9IGFyZ3VtZW50cztcbiAgICB9XG4gICAgZm9yIChsZXQgaWR4IGluIGluc2VydCkge1xuICAgICAgdGhpcy4jaW5zZXJ0U29ydGVkKGluc2VydFtpZHhdLCB0aGlzLmJ1ZmZlcik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBlbGVtZW50IGF0IHRoZSBnaXZlbiBwb3NpdGlvbi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5DQnVmZmVyI1xuICAgKiBAcGFyYW0ge251bWJlcn0gYXQgLSBQb3NpdGlvbiB0byBkZWxldGUgYXQuXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IEVsZW1lbnQgYXQgdGhlIGdpdmVuIHBvc2l0aW9uIG9yIDxjb2RlPnVuZGVmaW5lZDwvY29kZT4uXG4gICAqL1xuICBkZWxBdChhdCkge1xuICAgIGF0IHw9IDA7XG4gICAgbGV0IHIgPSB0aGlzLmJ1ZmZlci5zcGxpY2UoYXQsIDEpO1xuICAgIGlmIChyICYmIHIubGVuZ3RoID4gMCkge1xuICAgICAgcmV0dXJuIHJbMF07XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGVsZW1lbnRzIGJldHdlZW4gdHdvIHBvc2l0aW9ucy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5DQnVmZmVyI1xuICAgKiBAcGFyYW0ge251bWJlcn0gc2luY2UgLSBQb3NpdGlvbiB0byBkZWxldGUgZnJvbSAoaW5jbHVzaXZlKS5cbiAgICogQHBhcmFtIHtudW1iZXJ9IGJlZm9yZSAtIFBvc2l0aW9uIHRvIGRlbGV0ZSB0byAoZXhjbHVzaXZlKS5cbiAgICpcbiAgICogQHJldHVybnMge0FycmF5fSBhcnJheSBvZiByZW1vdmVkIGVsZW1lbnRzIChjb3VsZCBiZSB6ZXJvIGxlbmd0aCkuXG4gICAqL1xuICBkZWxSYW5nZShzaW5jZSwgYmVmb3JlKSB7XG4gICAgcmV0dXJuIHRoaXMuYnVmZmVyLnNwbGljZShzaW5jZSwgYmVmb3JlIC0gc2luY2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgbnVtYmVyIG9mIGVsZW1lbnRzIHRoZSBidWZmZXIgaG9sZHMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ0J1ZmZlciNcbiAgICogQHJldHVybiB7bnVtYmVyfSBOdW1iZXIgb2YgZWxlbWVudHMgaW4gdGhlIGJ1ZmZlci5cbiAgICovXG4gIGxlbmd0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5idWZmZXIubGVuZ3RoO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0IHRoZSBidWZmZXIgZGlzY2FyZGluZyBhbGwgZWxlbWVudHNcbiAgICogQG1lbWJlcm9mIFRpbm9kZS5DQnVmZmVyI1xuICAgKi9cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5idWZmZXIgPSBbXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsYmFjayBmb3IgaXRlcmF0aW5nIGNvbnRlbnRzIG9mIGJ1ZmZlci4gU2VlIHtAbGluayBUaW5vZGUuQ0J1ZmZlciNmb3JFYWNofS5cbiAgICogQGNhbGxiYWNrIEZvckVhY2hDYWxsYmFja1R5cGVcbiAgICogQG1lbWJlcm9mIFRpbm9kZS5DQnVmZmVyI1xuICAgKiBAcGFyYW0ge09iamVjdH0gZWxlbSAtIEN1cnJlbnQgZWxlbWVudCBvZiB0aGUgYnVmZmVyLlxuICAgKiBAcGFyYW0ge09iamVjdH0gcHJldiAtIFByZXZpb3VzIGVsZW1lbnQgb2YgdGhlIGJ1ZmZlci5cbiAgICogQHBhcmFtIHtPYmplY3R9IG5leHQgLSBOZXh0IGVsZW1lbnQgb2YgdGhlIGJ1ZmZlci5cbiAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IC0gSW5kZXggb2YgdGhlIGN1cnJlbnQgZWxlbWVudC5cbiAgICovXG5cbiAgLyoqXG4gICAqIEFwcGx5IGdpdmVuIDxjb2RlPmNhbGxiYWNrPC9jb2RlPiB0byBhbGwgZWxlbWVudHMgb2YgdGhlIGJ1ZmZlci5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5DQnVmZmVyI1xuICAgKlxuICAgKiBAcGFyYW0ge1Rpbm9kZS5Gb3JFYWNoQ2FsbGJhY2tUeXBlfSBjYWxsYmFjayAtIEZ1bmN0aW9uIHRvIGNhbGwgZm9yIGVhY2ggZWxlbWVudC5cbiAgICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0SWR4IC0gT3B0aW9uYWwgaW5kZXggdG8gc3RhcnQgaXRlcmF0aW5nIGZyb20gKGluY2x1c2l2ZSkuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBiZWZvcmVJZHggLSBPcHRpb25hbCBpbmRleCB0byBzdG9wIGl0ZXJhdGluZyBiZWZvcmUgKGV4Y2x1c2l2ZSkuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZXh0IC0gY2FsbGluZyBjb250ZXh0IChpLmUuIHZhbHVlIG9mIDxjb2RlPnRoaXM8L2NvZGU+IGluIGNhbGxiYWNrKVxuICAgKi9cbiAgZm9yRWFjaChjYWxsYmFjaywgc3RhcnRJZHgsIGJlZm9yZUlkeCwgY29udGV4dCkge1xuICAgIHN0YXJ0SWR4ID0gc3RhcnRJZHggfCAwO1xuICAgIGJlZm9yZUlkeCA9IGJlZm9yZUlkeCB8fCB0aGlzLmJ1ZmZlci5sZW5ndGg7XG4gICAgZm9yIChsZXQgaSA9IHN0YXJ0SWR4OyBpIDwgYmVmb3JlSWR4OyBpKyspIHtcbiAgICAgIGNhbGxiYWNrLmNhbGwoY29udGV4dCwgdGhpcy5idWZmZXJbaV0sXG4gICAgICAgIChpID4gc3RhcnRJZHggPyB0aGlzLmJ1ZmZlcltpIC0gMV0gOiB1bmRlZmluZWQpLFxuICAgICAgICAoaSA8IGJlZm9yZUlkeCAtIDEgPyB0aGlzLmJ1ZmZlcltpICsgMV0gOiB1bmRlZmluZWQpLCBpKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRmluZCBlbGVtZW50IGluIGJ1ZmZlciB1c2luZyBidWZmZXIncyBjb21wYXJpc29uIGZ1bmN0aW9uLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNCdWZmZXIjXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBlbGVtIC0gZWxlbWVudCB0byBmaW5kLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBuZWFyZXN0IC0gd2hlbiB0cnVlIGFuZCBleGFjdCBtYXRjaCBpcyBub3QgZm91bmQsIHJldHVybiB0aGUgbmVhcmVzdCBlbGVtZW50IChpbnNlcnRpb24gcG9pbnQpLlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSBpbmRleCBvZiB0aGUgZWxlbWVudCBpbiB0aGUgYnVmZmVyIG9yIC0xLlxuICAgKi9cbiAgZmluZChlbGVtLCBuZWFyZXN0KSB7XG4gICAgY29uc3Qge1xuICAgICAgaWR4XG4gICAgfSA9IHRoaXMuI2ZpbmROZWFyZXN0KGVsZW0sIHRoaXMuYnVmZmVyLCAhbmVhcmVzdCk7XG4gICAgcmV0dXJuIGlkeDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsYmFjayBmb3IgZmlsdGVyaW5nIHRoZSBidWZmZXIuIFNlZSB7QGxpbmsgVGlub2RlLkNCdWZmZXIjZmlsdGVyfS5cbiAgICogQGNhbGxiYWNrIEZvckVhY2hDYWxsYmFja1R5cGVcbiAgICogQG1lbWJlcm9mIFRpbm9kZS5DQnVmZmVyI1xuICAgKiBAcGFyYW0ge09iamVjdH0gZWxlbSAtIEN1cnJlbnQgZWxlbWVudCBvZiB0aGUgYnVmZmVyLlxuICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXggLSBJbmRleCBvZiB0aGUgY3VycmVudCBlbGVtZW50LlxuICAgKiBAcmV0dXJucyB7Ym9vbGVufSA8Y29kZT50cnVlPC9jb2RlPiB0byBrZWVwIHRoZSBlbGVtZW50LCA8Y29kZT5mYWxzZTwvY29kZT4gdG8gcmVtb3ZlLlxuICAgKi9cblxuICAvKipcbiAgICogUmVtb3ZlIGFsbCBlbGVtZW50cyB0aGF0IGRvIG5vdCBwYXNzIHRoZSB0ZXN0IGltcGxlbWVudGVkIGJ5IHRoZSBwcm92aWRlZCBjYWxsYmFjayBmdW5jdGlvbi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5DQnVmZmVyI1xuICAgKlxuICAgKiBAcGFyYW0ge1Rpbm9kZS5GaWx0ZXJDYWxsYmFja1R5cGV9IGNhbGxiYWNrIC0gRnVuY3Rpb24gdG8gY2FsbCBmb3IgZWFjaCBlbGVtZW50LlxuICAgKiBAcGFyYW0ge09iamVjdH0gY29udGV4dCAtIGNhbGxpbmcgY29udGV4dCAoaS5lLiB2YWx1ZSBvZiA8Y29kZT50aGlzPC9jb2RlPiBpbiB0aGUgY2FsbGJhY2spXG4gICAqL1xuICBmaWx0ZXIoY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICBsZXQgY291bnQgPSAwO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5idWZmZXIubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChjYWxsYmFjay5jYWxsKGNvbnRleHQsIHRoaXMuYnVmZmVyW2ldLCBpKSkge1xuICAgICAgICB0aGlzLmJ1ZmZlcltjb3VudF0gPSB0aGlzLmJ1ZmZlcltpXTtcbiAgICAgICAgY291bnQrKztcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmJ1ZmZlci5zcGxpY2UoY291bnQpO1xuICB9XG59XG4iLCIvKipcbiAqIEBmaWxlIEdsb2JhbCBjb25zdGFudHMgYW5kIGNvbmZpZ3VyYXRpb24gcGFyYW1ldGVycy5cbiAqXG4gKiBAY29weXJpZ2h0IDIwMTUtMjAyMiBUaW5vZGUgTExDXG4gKi9cbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHtcbiAgdmVyc2lvbiBhcyBwYWNrYWdlX3ZlcnNpb25cbn0gZnJvbSAnLi4vdmVyc2lvbi5qc29uJztcblxuLy8gR2xvYmFsIGNvbnN0YW50c1xuZXhwb3J0IGNvbnN0IFBST1RPQ09MX1ZFUlNJT04gPSAnMCc7IC8vIE1ham9yIGNvbXBvbmVudCBvZiB0aGUgdmVyc2lvbiwgZS5nLiAnMCcgaW4gJzAuMTcuMScuXG5leHBvcnQgY29uc3QgVkVSU0lPTiA9IHBhY2thZ2VfdmVyc2lvbiB8fCAnMC4xOCc7XG5leHBvcnQgY29uc3QgTElCUkFSWSA9ICd0aW5vZGVqcy8nICsgVkVSU0lPTjtcblxuLy8gVG9waWMgbmFtZSBwcmVmaXhlcy5cbmV4cG9ydCBjb25zdCBUT1BJQ19ORVcgPSAnbmV3JztcbmV4cG9ydCBjb25zdCBUT1BJQ19ORVdfQ0hBTiA9ICduY2gnO1xuZXhwb3J0IGNvbnN0IFRPUElDX01FID0gJ21lJztcbmV4cG9ydCBjb25zdCBUT1BJQ19GTkQgPSAnZm5kJztcbmV4cG9ydCBjb25zdCBUT1BJQ19TWVMgPSAnc3lzJztcbmV4cG9ydCBjb25zdCBUT1BJQ19DSEFOID0gJ2Nobic7XG5leHBvcnQgY29uc3QgVE9QSUNfR1JQID0gJ2dycDsnXG5leHBvcnQgY29uc3QgVE9QSUNfUDJQID0gJ3AycCc7XG5leHBvcnQgY29uc3QgVVNFUl9ORVcgPSAnbmV3JztcblxuLy8gU3RhcnRpbmcgdmFsdWUgb2YgYSBsb2NhbGx5LWdlbmVyYXRlZCBzZXFJZCB1c2VkIGZvciBwZW5kaW5nIG1lc3NhZ2VzLlxuZXhwb3J0IGNvbnN0IExPQ0FMX1NFUUlEID0gMHhGRkZGRkZGO1xuXG4vLyBTdGF0dXMgY29kZXMuXG5leHBvcnQgY29uc3QgTUVTU0FHRV9TVEFUVVNfTk9ORSA9IDA7IC8vIFN0YXR1cyBub3QgYXNzaWduZWQuXG5leHBvcnQgY29uc3QgTUVTU0FHRV9TVEFUVVNfUVVFVUVEID0gMTsgLy8gTG9jYWwgSUQgYXNzaWduZWQsIGluIHByb2dyZXNzIHRvIGJlIHNlbnQuXG5leHBvcnQgY29uc3QgTUVTU0FHRV9TVEFUVVNfU0VORElORyA9IDI7IC8vIFRyYW5zbWlzc2lvbiBzdGFydGVkLlxuZXhwb3J0IGNvbnN0IE1FU1NBR0VfU1RBVFVTX0ZBSUxFRCA9IDM7IC8vIEF0IGxlYXN0IG9uZSBhdHRlbXB0IHdhcyBtYWRlIHRvIHNlbmQgdGhlIG1lc3NhZ2UuXG5leHBvcnQgY29uc3QgTUVTU0FHRV9TVEFUVVNfU0VOVCA9IDQ7IC8vIERlbGl2ZXJlZCB0byB0aGUgc2VydmVyLlxuZXhwb3J0IGNvbnN0IE1FU1NBR0VfU1RBVFVTX1JFQ0VJVkVEID0gNTsgLy8gUmVjZWl2ZWQgYnkgdGhlIGNsaWVudC5cbmV4cG9ydCBjb25zdCBNRVNTQUdFX1NUQVRVU19SRUFEID0gNjsgLy8gUmVhZCBieSB0aGUgdXNlci5cbmV4cG9ydCBjb25zdCBNRVNTQUdFX1NUQVRVU19UT19NRSA9IDc7IC8vIFRoZSBtZXNzYWdlIGlzIHJlY2VpdmVkIGZyb20gYW5vdGhlciB1c2VyLlxuZXhwb3J0IGNvbnN0IE1FU1NBR0VfU1RBVFVTX0RFTF9SQU5HRSA9IDg7IC8vIFRoZSBtZXNzYWdlIHJlcHJlc2VudHMgYSBkZWxldGVkIHJhbmdlLlxuXG4vLyBSZWplY3QgdW5yZXNvbHZlZCBmdXR1cmVzIGFmdGVyIHRoaXMgbWFueSBtaWxsaXNlY29uZHMuXG5leHBvcnQgY29uc3QgRVhQSVJFX1BST01JU0VTX1RJTUVPVVQgPSA1MDAwO1xuLy8gUGVyaW9kaWNpdHkgb2YgZ2FyYmFnZSBjb2xsZWN0aW9uIG9mIHVucmVzb2x2ZWQgZnV0dXJlcy5cbmV4cG9ydCBjb25zdCBFWFBJUkVfUFJPTUlTRVNfUEVSSU9EID0gMTAwMDtcblxuLy8gRGVmYXVsdCBudW1iZXIgb2YgbWVzc2FnZXMgdG8gcHVsbCBpbnRvIG1lbW9yeSBmcm9tIHBlcnNpc3RlbnQgY2FjaGUuXG5leHBvcnQgY29uc3QgREVGQVVMVF9NRVNTQUdFU19QQUdFID0gMjQ7XG5cbi8vIFVuaWNvZGUgREVMIGNoYXJhY3RlciBpbmRpY2F0aW5nIGRhdGEgd2FzIGRlbGV0ZWQuXG5leHBvcnQgY29uc3QgREVMX0NIQVIgPSAnXFx1MjQyMSc7XG4iLCIvKipcbiAqIEBmaWxlIEFic3RyYWN0aW9uIGxheWVyIGZvciB3ZWJzb2NrZXQgYW5kIGxvbmcgcG9sbGluZyBjb25uZWN0aW9ucy5cbiAqXG4gKiBAY29weXJpZ2h0IDIwMTUtMjAyMiBUaW5vZGUgTExDLlxuICovXG4ndXNlIHN0cmljdCc7XG5cbmltcG9ydCB7XG4gIGpzb25QYXJzZUhlbHBlclxufSBmcm9tICcuL3V0aWxzLmpzJztcblxubGV0IFdlYlNvY2tldFByb3ZpZGVyO1xubGV0IFhIUlByb3ZpZGVyO1xuXG4vLyBFcnJvciBjb2RlIHRvIHJldHVybiBpbiBjYXNlIG9mIGEgbmV0d29yayBwcm9ibGVtLlxuY29uc3QgTkVUV09SS19FUlJPUiA9IDUwMztcbmNvbnN0IE5FVFdPUktfRVJST1JfVEVYVCA9IFwiQ29ubmVjdGlvbiBmYWlsZWRcIjtcblxuLy8gRXJyb3IgY29kZSB0byByZXR1cm4gd2hlbiB1c2VyIGRpc2Nvbm5lY3RlZCBmcm9tIHNlcnZlci5cbmNvbnN0IE5FVFdPUktfVVNFUiA9IDQxODtcbmNvbnN0IE5FVFdPUktfVVNFUl9URVhUID0gXCJEaXNjb25uZWN0ZWQgYnkgY2xpZW50XCI7XG5cbi8vIFNldHRpbmdzIGZvciBleHBvbmVudGlhbCBiYWNrb2ZmXG5jb25zdCBfQk9GRl9CQVNFID0gMjAwMDsgLy8gMjAwMCBtaWxsaXNlY29uZHMsIG1pbmltdW0gZGVsYXkgYmV0d2VlbiByZWNvbm5lY3RzXG5jb25zdCBfQk9GRl9NQVhfSVRFUiA9IDEwOyAvLyBNYXhpbXVtIGRlbGF5IGJldHdlZW4gcmVjb25uZWN0cyAyXjEwICogMjAwMCB+IDM0IG1pbnV0ZXNcbmNvbnN0IF9CT0ZGX0pJVFRFUiA9IDAuMzsgLy8gQWRkIHJhbmRvbSBkZWxheVxuXG4vLyBIZWxwZXIgZnVuY3Rpb24gZm9yIGNyZWF0aW5nIGFuIGVuZHBvaW50IFVSTC5cbmZ1bmN0aW9uIG1ha2VCYXNlVXJsKGhvc3QsIHByb3RvY29sLCB2ZXJzaW9uLCBhcGlLZXkpIHtcbiAgbGV0IHVybCA9IG51bGw7XG5cbiAgaWYgKFsnaHR0cCcsICdodHRwcycsICd3cycsICd3c3MnXS5pbmNsdWRlcyhwcm90b2NvbCkpIHtcbiAgICB1cmwgPSBgJHtwcm90b2NvbH06Ly8ke2hvc3R9YDtcbiAgICBpZiAodXJsLmNoYXJBdCh1cmwubGVuZ3RoIC0gMSkgIT09ICcvJykge1xuICAgICAgdXJsICs9ICcvJztcbiAgICB9XG4gICAgdXJsICs9ICd2JyArIHZlcnNpb24gKyAnL2NoYW5uZWxzJztcbiAgICBpZiAoWydodHRwJywgJ2h0dHBzJ10uaW5jbHVkZXMocHJvdG9jb2wpKSB7XG4gICAgICAvLyBMb25nIHBvbGxpbmcgZW5kcG9pbnQgZW5kcyB3aXRoIFwibHBcIiwgaS5lLlxuICAgICAgLy8gJy92MC9jaGFubmVscy9scCcgdnMganVzdCAnL3YwL2NoYW5uZWxzJyBmb3Igd3NcbiAgICAgIHVybCArPSAnL2xwJztcbiAgICB9XG4gICAgdXJsICs9ICc/YXBpa2V5PScgKyBhcGlLZXk7XG4gIH1cblxuICByZXR1cm4gdXJsO1xufVxuXG4vKipcbiAqIEFuIGFic3RyYWN0aW9uIGZvciBhIHdlYnNvY2tldCBvciBhIGxvbmcgcG9sbGluZyBjb25uZWN0aW9uLlxuICpcbiAqIEBjbGFzcyBDb25uZWN0aW9uXG4gKiBAbWVtYmVyb2YgVGlub2RlXG5cbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgLSBjb25maWd1cmF0aW9uIHBhcmFtZXRlcnMuXG4gKiBAcGFyYW0ge3N0cmluZ30gY29uZmlnLmhvc3QgLSBIb3N0IG5hbWUgYW5kIG9wdGlvbmFsIHBvcnQgbnVtYmVyIHRvIGNvbm5lY3QgdG8uXG4gKiBAcGFyYW0ge3N0cmluZ30gY29uZmlnLmFwaUtleSAtIEFQSSBrZXkgZ2VuZXJhdGVkIGJ5IDxjb2RlPmtleWdlbjwvY29kZT4uXG4gKiBAcGFyYW0ge3N0cmluZ30gY29uZmlnLnRyYW5zcG9ydCAtIE5ldHdvcmsgdHJhbnNwb3J0IHRvIHVzZSwgZWl0aGVyIDxjb2RlPlwid3NcIjxjb2RlPi88Y29kZT5cIndzc1wiPC9jb2RlPiBmb3Igd2Vic29ja2V0IG9yXG4gKiAgICAgIDxjb2RlPmxwPC9jb2RlPiBmb3IgbG9uZyBwb2xsaW5nLlxuICogQHBhcmFtIHtib29sZWFufSBjb25maWcuc2VjdXJlIC0gVXNlIFNlY3VyZSBXZWJTb2NrZXQgaWYgPGNvZGU+dHJ1ZTwvY29kZT4uXG4gKiBAcGFyYW0ge3N0cmluZ30gdmVyc2lvbl8gLSBNYWpvciB2YWx1ZSBvZiB0aGUgcHJvdG9jb2wgdmVyc2lvbiwgZS5nLiAnMCcgaW4gJzAuMTcuMScuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGF1dG9yZWNvbm5lY3RfIC0gSWYgY29ubmVjdGlvbiBpcyBsb3N0LCB0cnkgdG8gcmVjb25uZWN0IGF1dG9tYXRpY2FsbHkuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbm5lY3Rpb24ge1xuICAjYm9mZlRpbWVyID0gbnVsbDtcbiAgI2JvZmZJdGVyYXRpb24gPSAwO1xuICAjYm9mZkNsb3NlZCA9IGZhbHNlOyAvLyBJbmRpY2F0b3IgaWYgdGhlIHNvY2tldCB3YXMgbWFudWFsbHkgY2xvc2VkIC0gZG9uJ3QgYXV0b3JlY29ubmVjdCBpZiB0cnVlLlxuXG4gIC8vIFdlYnNvY2tldC5cbiAgI3NvY2tldCA9IG51bGw7XG5cbiAgaG9zdDtcbiAgc2VjdXJlO1xuICBhcGlLZXk7XG5cbiAgdmVyc2lvbjtcbiAgYXV0b3JlY29ubmVjdDtcblxuICBpbml0aWFsaXplZDtcblxuICAvLyAoY29uZmlnLmhvc3QsIGNvbmZpZy5hcGlLZXksIGNvbmZpZy50cmFuc3BvcnQsIGNvbmZpZy5zZWN1cmUpLCBQUk9UT0NPTF9WRVJTSU9OLCB0cnVlXG4gIGNvbnN0cnVjdG9yKGNvbmZpZywgdmVyc2lvbl8sIGF1dG9yZWNvbm5lY3RfKSB7XG4gICAgdGhpcy5ob3N0ID0gY29uZmlnLmhvc3Q7XG4gICAgdGhpcy5zZWN1cmUgPSBjb25maWcuc2VjdXJlO1xuICAgIHRoaXMuYXBpS2V5ID0gY29uZmlnLmFwaUtleTtcblxuICAgIHRoaXMudmVyc2lvbiA9IHZlcnNpb25fO1xuICAgIHRoaXMuYXV0b3JlY29ubmVjdCA9IGF1dG9yZWNvbm5lY3RfO1xuXG4gICAgaWYgKGNvbmZpZy50cmFuc3BvcnQgPT09ICdscCcpIHtcbiAgICAgIC8vIGV4cGxpY2l0IHJlcXVlc3QgdG8gdXNlIGxvbmcgcG9sbGluZ1xuICAgICAgdGhpcy4jaW5pdF9scCgpO1xuICAgICAgdGhpcy5pbml0aWFsaXplZCA9ICdscCc7XG4gICAgfSBlbHNlIGlmIChjb25maWcudHJhbnNwb3J0ID09PSAnd3MnKSB7XG4gICAgICAvLyBleHBsaWNpdCByZXF1ZXN0IHRvIHVzZSB3ZWIgc29ja2V0XG4gICAgICAvLyBpZiB3ZWJzb2NrZXRzIGFyZSBub3QgYXZhaWxhYmxlLCBob3JyaWJsZSB0aGluZ3Mgd2lsbCBoYXBwZW5cbiAgICAgIHRoaXMuI2luaXRfd3MoKTtcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSAnd3MnO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5pbml0aWFsaXplZCkge1xuICAgICAgLy8gSW52YWxpZCBvciB1bmRlZmluZWQgbmV0d29yayB0cmFuc3BvcnQuXG4gICAgICB0aGlzLiNsb2coXCJVbmtub3duIG9yIGludmFsaWQgbmV0d29yayB0cmFuc3BvcnQuIFJ1bm5pbmcgdW5kZXIgTm9kZT8gQ2FsbCAnVGlub2RlLnNldE5ldHdvcmtQcm92aWRlcnMoKScuXCIpO1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5rbm93biBvciBpbnZhbGlkIG5ldHdvcmsgdHJhbnNwb3J0LiBSdW5uaW5nIHVuZGVyIE5vZGU/IENhbGwgJ1Rpbm9kZS5zZXROZXR3b3JrUHJvdmlkZXJzKCknLlwiKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVG8gdXNlIENvbm5lY3Rpb24gaW4gYSBub24gYnJvd3NlciBjb250ZXh0LCBzdXBwbHkgV2ViU29ja2V0IGFuZCBYTUxIdHRwUmVxdWVzdCBwcm92aWRlcnMuXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlcm9mIENvbm5lY3Rpb25cbiAgICogQHBhcmFtIHdzUHJvdmlkZXIgV2ViU29ja2V0IHByb3ZpZGVyLCBlLmcuIGZvciBub2RlSlMgLCA8Y29kZT5yZXF1aXJlKCd3cycpPC9jb2RlPi5cbiAgICogQHBhcmFtIHhoclByb3ZpZGVyIFhNTEh0dHBSZXF1ZXN0IHByb3ZpZGVyLCBlLmcuIGZvciBub2RlIDxjb2RlPnJlcXVpcmUoJ3hocicpPC9jb2RlPi5cbiAgICovXG4gIHN0YXRpYyBzZXROZXR3b3JrUHJvdmlkZXJzKHdzUHJvdmlkZXIsIHhoclByb3ZpZGVyKSB7XG4gICAgV2ViU29ja2V0UHJvdmlkZXIgPSB3c1Byb3ZpZGVyO1xuICAgIFhIUlByb3ZpZGVyID0geGhyUHJvdmlkZXI7XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhdGUgYSBuZXcgY29ubmVjdGlvblxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNvbm5lY3Rpb24jXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBob3N0XyBIb3N0IG5hbWUgdG8gY29ubmVjdCB0bzsgaWYgPGNvZGU+bnVsbDwvY29kZT4gdGhlIG9sZCBob3N0IG5hbWUgd2lsbCBiZSB1c2VkLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGZvcmNlIEZvcmNlIG5ldyBjb25uZWN0aW9uIGV2ZW4gaWYgb25lIGFscmVhZHkgZXhpc3RzLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBQcm9taXNlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIGNvbm5lY3Rpb24gY2FsbCBjb21wbGV0ZXMsIHJlc29sdXRpb24gaXMgY2FsbGVkIHdpdGhvdXRcbiAgICogIHBhcmFtZXRlcnMsIHJlamVjdGlvbiBwYXNzZXMgdGhlIHtFcnJvcn0gYXMgcGFyYW1ldGVyLlxuICAgKi9cbiAgY29ubmVjdChob3N0XywgZm9yY2UpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobnVsbCk7XG4gIH1cblxuICAvKipcbiAgICogVHJ5IHRvIHJlc3RvcmUgYSBuZXR3b3JrIGNvbm5lY3Rpb24sIGFsc28gcmVzZXQgYmFja29mZi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Db25uZWN0aW9uI1xuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGZvcmNlIC0gcmVjb25uZWN0IGV2ZW4gaWYgdGhlcmUgaXMgYSBsaXZlIGNvbm5lY3Rpb24gYWxyZWFkeS5cbiAgICovXG4gIHJlY29ubmVjdChmb3JjZSkge31cblxuICAvKipcbiAgICogVGVybWluYXRlIHRoZSBuZXR3b3JrIGNvbm5lY3Rpb25cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Db25uZWN0aW9uI1xuICAgKi9cbiAgZGlzY29ubmVjdCgpIHt9XG5cbiAgLyoqXG4gICAqIFNlbmQgYSBzdHJpbmcgdG8gdGhlIHNlcnZlci5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Db25uZWN0aW9uI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbXNnIC0gU3RyaW5nIHRvIHNlbmQuXG4gICAqIEB0aHJvd3MgVGhyb3dzIGFuIGV4Y2VwdGlvbiBpZiB0aGUgdW5kZXJseWluZyBjb25uZWN0aW9uIGlzIG5vdCBsaXZlLlxuICAgKi9cbiAgc2VuZFRleHQobXNnKSB7fVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBjb25uZWN0aW9uIGlzIGFsaXZlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNvbm5lY3Rpb24jXG4gICAqIEByZXR1cm5zIHtib29sZWFufSA8Y29kZT50cnVlPC9jb2RlPiBpZiBjb25uZWN0aW9uIGlzIGxpdmUsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBpc0Nvbm5lY3RlZCgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBuYW1lIG9mIHRoZSBjdXJyZW50IG5ldHdvcmsgdHJhbnNwb3J0LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNvbm5lY3Rpb24jXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IG5hbWUgb2YgdGhlIHRyYW5zcG9ydCBzdWNoIGFzIDxjb2RlPlwid3NcIjwvY29kZT4gb3IgPGNvZGU+XCJscFwiPC9jb2RlPi5cbiAgICovXG4gIHRyYW5zcG9ydCgpIHtcbiAgICByZXR1cm4gdGhpcy5pbml0aWFsaXplZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kIG5ldHdvcmsgcHJvYmUgdG8gY2hlY2sgaWYgY29ubmVjdGlvbiBpcyBpbmRlZWQgbGl2ZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Db25uZWN0aW9uI1xuICAgKi9cbiAgcHJvYmUoKSB7XG4gICAgdGhpcy5zZW5kVGV4dCgnMScpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0IGF1dG9yZWNvbm5lY3QgY291bnRlciB0byB6ZXJvLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNvbm5lY3Rpb24jXG4gICAqL1xuICBiYWNrb2ZmUmVzZXQoKSB7XG4gICAgdGhpcy4jYm9mZlJlc2V0KCk7XG4gIH1cblxuICAjbG9nKHRleHQsIC4uLmFyZ3MpIHtcbiAgICBpZiAoQ29ubmVjdGlvbi5sb2dnZXIpIHtcbiAgICAgIENvbm5lY3Rpb24ubG9nZ2VyKHRleHQsIC4uLmFyZ3MpO1xuICAgIH1cbiAgfVxuXG4gIC8vIEJhY2tvZmYgaW1wbGVtZW50YXRpb24gLSByZWNvbm5lY3QgYWZ0ZXIgYSB0aW1lb3V0LlxuICAjYm9mZlJlY29ubmVjdCgpIHtcbiAgICAvLyBDbGVhciB0aW1lclxuICAgIGNsZWFyVGltZW91dCh0aGlzLiNib2ZmVGltZXIpO1xuICAgIC8vIENhbGN1bGF0ZSB3aGVuIHRvIGZpcmUgdGhlIHJlY29ubmVjdCBhdHRlbXB0XG4gICAgY29uc3QgdGltZW91dCA9IF9CT0ZGX0JBU0UgKiAoTWF0aC5wb3coMiwgdGhpcy4jYm9mZkl0ZXJhdGlvbikgKiAoMS4wICsgX0JPRkZfSklUVEVSICogTWF0aC5yYW5kb20oKSkpO1xuICAgIC8vIFVwZGF0ZSBpdGVyYXRpb24gY291bnRlciBmb3IgZnV0dXJlIHVzZVxuICAgIHRoaXMuI2JvZmZJdGVyYXRpb24gPSAodGhpcy4jYm9mZkl0ZXJhdGlvbiA+PSBfQk9GRl9NQVhfSVRFUiA/IHRoaXMuI2JvZmZJdGVyYXRpb24gOiB0aGlzLiNib2ZmSXRlcmF0aW9uICsgMSk7XG4gICAgaWYgKHRoaXMub25BdXRvcmVjb25uZWN0SXRlcmF0aW9uKSB7XG4gICAgICB0aGlzLm9uQXV0b3JlY29ubmVjdEl0ZXJhdGlvbih0aW1lb3V0KTtcbiAgICB9XG5cbiAgICB0aGlzLiNib2ZmVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuI2xvZyhgUmVjb25uZWN0aW5nLCBpdGVyPSR7dGhpcy4jYm9mZkl0ZXJhdGlvbn0sIHRpbWVvdXQ9JHt0aW1lb3V0fWApO1xuICAgICAgLy8gTWF5YmUgdGhlIHNvY2tldCB3YXMgY2xvc2VkIHdoaWxlIHdlIHdhaXRlZCBmb3IgdGhlIHRpbWVyP1xuICAgICAgaWYgKCF0aGlzLiNib2ZmQ2xvc2VkKSB7XG4gICAgICAgIGNvbnN0IHByb20gPSB0aGlzLmNvbm5lY3QoKTtcbiAgICAgICAgaWYgKHRoaXMub25BdXRvcmVjb25uZWN0SXRlcmF0aW9uKSB7XG4gICAgICAgICAgdGhpcy5vbkF1dG9yZWNvbm5lY3RJdGVyYXRpb24oMCwgcHJvbSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gU3VwcHJlc3MgZXJyb3IgaWYgaXQncyBub3QgdXNlZC5cbiAgICAgICAgICBwcm9tLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgIC8qIGRvIG5vdGhpbmcgKi9cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0aGlzLm9uQXV0b3JlY29ubmVjdEl0ZXJhdGlvbikge1xuICAgICAgICB0aGlzLm9uQXV0b3JlY29ubmVjdEl0ZXJhdGlvbigtMSk7XG4gICAgICB9XG4gICAgfSwgdGltZW91dCk7XG4gIH1cblxuICAvLyBUZXJtaW5hdGUgYXV0by1yZWNvbm5lY3QgcHJvY2Vzcy5cbiAgI2JvZmZTdG9wKCkge1xuICAgIGNsZWFyVGltZW91dCh0aGlzLiNib2ZmVGltZXIpO1xuICAgIHRoaXMuI2JvZmZUaW1lciA9IG51bGw7XG4gIH1cblxuICAvLyBSZXNldCBhdXRvLXJlY29ubmVjdCBpdGVyYXRpb24gY291bnRlci5cbiAgI2JvZmZSZXNldCgpIHtcbiAgICB0aGlzLiNib2ZmSXRlcmF0aW9uID0gMDtcbiAgfVxuXG4gIC8vIEluaXRpYWxpemF0aW9uIGZvciBsb25nIHBvbGxpbmcuXG4gICNpbml0X2xwKCkge1xuICAgIGNvbnN0IFhEUl9VTlNFTlQgPSAwOyAvLyBDbGllbnQgaGFzIGJlZW4gY3JlYXRlZC4gb3BlbigpIG5vdCBjYWxsZWQgeWV0LlxuICAgIGNvbnN0IFhEUl9PUEVORUQgPSAxOyAvLyBvcGVuKCkgaGFzIGJlZW4gY2FsbGVkLlxuICAgIGNvbnN0IFhEUl9IRUFERVJTX1JFQ0VJVkVEID0gMjsgLy8gc2VuZCgpIGhhcyBiZWVuIGNhbGxlZCwgYW5kIGhlYWRlcnMgYW5kIHN0YXR1cyBhcmUgYXZhaWxhYmxlLlxuICAgIGNvbnN0IFhEUl9MT0FESU5HID0gMzsgLy8gRG93bmxvYWRpbmc7IHJlc3BvbnNlVGV4dCBob2xkcyBwYXJ0aWFsIGRhdGEuXG4gICAgY29uc3QgWERSX0RPTkUgPSA0OyAvLyBUaGUgb3BlcmF0aW9uIGlzIGNvbXBsZXRlLlxuXG4gICAgLy8gRnVsbHkgY29tcG9zZWQgZW5kcG9pbnQgVVJMLCB3aXRoIEFQSSBrZXkgJiBTSURcbiAgICBsZXQgX2xwVVJMID0gbnVsbDtcblxuICAgIGxldCBfcG9sbGVyID0gbnVsbDtcbiAgICBsZXQgX3NlbmRlciA9IG51bGw7XG5cbiAgICBsZXQgbHBfc2VuZGVyID0gKHVybF8pID0+IHtcbiAgICAgIGNvbnN0IHNlbmRlciA9IG5ldyBYSFJQcm92aWRlcigpO1xuICAgICAgc2VuZGVyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IChldnQpID0+IHtcbiAgICAgICAgaWYgKHNlbmRlci5yZWFkeVN0YXRlID09IFhEUl9ET05FICYmIHNlbmRlci5zdGF0dXMgPj0gNDAwKSB7XG4gICAgICAgICAgLy8gU29tZSBzb3J0IG9mIGVycm9yIHJlc3BvbnNlXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBMUCBzZW5kZXIgZmFpbGVkLCAke3NlbmRlci5zdGF0dXN9YCk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHNlbmRlci5vcGVuKCdQT1NUJywgdXJsXywgdHJ1ZSk7XG4gICAgICByZXR1cm4gc2VuZGVyO1xuICAgIH1cblxuICAgIGxldCBscF9wb2xsZXIgPSAodXJsXywgcmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBsZXQgcG9sbGVyID0gbmV3IFhIUlByb3ZpZGVyKCk7XG4gICAgICBsZXQgcHJvbWlzZUNvbXBsZXRlZCA9IGZhbHNlO1xuXG4gICAgICBwb2xsZXIub25yZWFkeXN0YXRlY2hhbmdlID0gKGV2dCkgPT4ge1xuICAgICAgICBpZiAocG9sbGVyLnJlYWR5U3RhdGUgPT0gWERSX0RPTkUpIHtcbiAgICAgICAgICBpZiAocG9sbGVyLnN0YXR1cyA9PSAyMDEpIHsgLy8gMjAxID09IEhUVFAuQ3JlYXRlZCwgZ2V0IFNJRFxuICAgICAgICAgICAgbGV0IHBrdCA9IEpTT04ucGFyc2UocG9sbGVyLnJlc3BvbnNlVGV4dCwganNvblBhcnNlSGVscGVyKTtcbiAgICAgICAgICAgIF9scFVSTCA9IHVybF8gKyAnJnNpZD0nICsgcGt0LmN0cmwucGFyYW1zLnNpZDtcbiAgICAgICAgICAgIHBvbGxlciA9IGxwX3BvbGxlcihfbHBVUkwpO1xuICAgICAgICAgICAgcG9sbGVyLnNlbmQobnVsbCk7XG4gICAgICAgICAgICBpZiAodGhpcy5vbk9wZW4pIHtcbiAgICAgICAgICAgICAgdGhpcy5vbk9wZW4oKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHJlc29sdmUpIHtcbiAgICAgICAgICAgICAgcHJvbWlzZUNvbXBsZXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuYXV0b3JlY29ubmVjdCkge1xuICAgICAgICAgICAgICB0aGlzLiNib2ZmU3RvcCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAocG9sbGVyLnN0YXR1cyA8IDQwMCkgeyAvLyA0MDAgPSBIVFRQLkJhZFJlcXVlc3RcbiAgICAgICAgICAgIGlmICh0aGlzLm9uTWVzc2FnZSkge1xuICAgICAgICAgICAgICB0aGlzLm9uTWVzc2FnZShwb2xsZXIucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBvbGxlciA9IGxwX3BvbGxlcihfbHBVUkwpO1xuICAgICAgICAgICAgcG9sbGVyLnNlbmQobnVsbCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIERvbid0IHRocm93IGFuIGVycm9yIGhlcmUsIGdyYWNlZnVsbHkgaGFuZGxlIHNlcnZlciBlcnJvcnNcbiAgICAgICAgICAgIGlmIChyZWplY3QgJiYgIXByb21pc2VDb21wbGV0ZWQpIHtcbiAgICAgICAgICAgICAgcHJvbWlzZUNvbXBsZXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgIHJlamVjdChwb2xsZXIucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLm9uTWVzc2FnZSAmJiBwb2xsZXIucmVzcG9uc2VUZXh0KSB7XG4gICAgICAgICAgICAgIHRoaXMub25NZXNzYWdlKHBvbGxlci5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMub25EaXNjb25uZWN0KSB7XG4gICAgICAgICAgICAgIGNvbnN0IGNvZGUgPSBwb2xsZXIuc3RhdHVzIHx8ICh0aGlzLiNib2ZmQ2xvc2VkID8gTkVUV09SS19VU0VSIDogTkVUV09SS19FUlJPUik7XG4gICAgICAgICAgICAgIGNvbnN0IHRleHQgPSBwb2xsZXIucmVzcG9uc2VUZXh0IHx8ICh0aGlzLiNib2ZmQ2xvc2VkID8gTkVUV09SS19VU0VSX1RFWFQgOiBORVRXT1JLX0VSUk9SX1RFWFQpO1xuICAgICAgICAgICAgICB0aGlzLm9uRGlzY29ubmVjdChuZXcgRXJyb3IodGV4dCArICcgKCcgKyBjb2RlICsgJyknKSwgY29kZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFBvbGxpbmcgaGFzIHN0b3BwZWQuIEluZGljYXRlIGl0IGJ5IHNldHRpbmcgcG9sbGVyIHRvIG51bGwuXG4gICAgICAgICAgICBwb2xsZXIgPSBudWxsO1xuICAgICAgICAgICAgaWYgKCF0aGlzLiNib2ZmQ2xvc2VkICYmIHRoaXMuYXV0b3JlY29ubmVjdCkge1xuICAgICAgICAgICAgICB0aGlzLiNib2ZmUmVjb25uZWN0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgcG9sbGVyLm9wZW4oJ0dFVCcsIHVybF8sIHRydWUpO1xuICAgICAgcmV0dXJuIHBvbGxlcjtcbiAgICB9XG5cbiAgICB0aGlzLmNvbm5lY3QgPSAoaG9zdF8sIGZvcmNlKSA9PiB7XG4gICAgICB0aGlzLiNib2ZmQ2xvc2VkID0gZmFsc2U7XG5cbiAgICAgIGlmIChfcG9sbGVyKSB7XG4gICAgICAgIGlmICghZm9yY2UpIHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgICAgICAgX3BvbGxlci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSB1bmRlZmluZWQ7XG4gICAgICAgIF9wb2xsZXIuYWJvcnQoKTtcbiAgICAgICAgX3BvbGxlciA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIGlmIChob3N0Xykge1xuICAgICAgICB0aGlzLmhvc3QgPSBob3N0XztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgY29uc3QgdXJsID0gbWFrZUJhc2VVcmwodGhpcy5ob3N0LCB0aGlzLnNlY3VyZSA/ICdodHRwcycgOiAnaHR0cCcsIHRoaXMudmVyc2lvbiwgdGhpcy5hcGlLZXkpO1xuICAgICAgICB0aGlzLiNsb2coXCJDb25uZWN0aW5nIHRvOlwiLCB1cmwpO1xuICAgICAgICBfcG9sbGVyID0gbHBfcG9sbGVyKHVybCwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgX3BvbGxlci5zZW5kKG51bGwpO1xuICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICB0aGlzLiNsb2coXCJMUCBjb25uZWN0aW9uIGZhaWxlZDpcIiwgZXJyKTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICB0aGlzLnJlY29ubmVjdCA9IChmb3JjZSkgPT4ge1xuICAgICAgdGhpcy4jYm9mZlN0b3AoKTtcbiAgICAgIHRoaXMuY29ubmVjdChudWxsLCBmb3JjZSk7XG4gICAgfTtcblxuICAgIHRoaXMuZGlzY29ubmVjdCA9ICgpID0+IHtcbiAgICAgIHRoaXMuI2JvZmZDbG9zZWQgPSB0cnVlO1xuICAgICAgdGhpcy4jYm9mZlN0b3AoKTtcblxuICAgICAgaWYgKF9zZW5kZXIpIHtcbiAgICAgICAgX3NlbmRlci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSB1bmRlZmluZWQ7XG4gICAgICAgIF9zZW5kZXIuYWJvcnQoKTtcbiAgICAgICAgX3NlbmRlciA9IG51bGw7XG4gICAgICB9XG4gICAgICBpZiAoX3BvbGxlcikge1xuICAgICAgICBfcG9sbGVyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgX3BvbGxlci5hYm9ydCgpO1xuICAgICAgICBfcG9sbGVyID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMub25EaXNjb25uZWN0KSB7XG4gICAgICAgIHRoaXMub25EaXNjb25uZWN0KG5ldyBFcnJvcihORVRXT1JLX1VTRVJfVEVYVCArICcgKCcgKyBORVRXT1JLX1VTRVIgKyAnKScpLCBORVRXT1JLX1VTRVIpO1xuICAgICAgfVxuICAgICAgLy8gRW5zdXJlIGl0J3MgcmVjb25zdHJ1Y3RlZFxuICAgICAgX2xwVVJMID0gbnVsbDtcbiAgICB9O1xuXG4gICAgdGhpcy5zZW5kVGV4dCA9IChtc2cpID0+IHtcbiAgICAgIF9zZW5kZXIgPSBscF9zZW5kZXIoX2xwVVJMKTtcbiAgICAgIGlmIChfc2VuZGVyICYmIChfc2VuZGVyLnJlYWR5U3RhdGUgPT0gWERSX09QRU5FRCkpIHsgLy8gMSA9PSBPUEVORURcbiAgICAgICAgX3NlbmRlci5zZW5kKG1zZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJMb25nIHBvbGxlciBmYWlsZWQgdG8gY29ubmVjdFwiKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy5pc0Nvbm5lY3RlZCA9ICgpID0+IHtcbiAgICAgIHJldHVybiAoX3BvbGxlciAmJiB0cnVlKTtcbiAgICB9O1xuICB9XG5cbiAgLy8gSW5pdGlhbGl6YXRpb24gZm9yIFdlYnNvY2tldFxuICAjaW5pdF93cygpIHtcbiAgICB0aGlzLmNvbm5lY3QgPSAoaG9zdF8sIGZvcmNlKSA9PiB7XG4gICAgICB0aGlzLiNib2ZmQ2xvc2VkID0gZmFsc2U7XG5cbiAgICAgIGlmICh0aGlzLiNzb2NrZXQpIHtcbiAgICAgICAgaWYgKCFmb3JjZSAmJiB0aGlzLiNzb2NrZXQucmVhZHlTdGF0ZSA9PSB0aGlzLiNzb2NrZXQuT1BFTikge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLiNzb2NrZXQuY2xvc2UoKTtcbiAgICAgICAgdGhpcy4jc29ja2V0ID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgaWYgKGhvc3RfKSB7XG4gICAgICAgIHRoaXMuaG9zdCA9IGhvc3RfO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBjb25zdCB1cmwgPSBtYWtlQmFzZVVybCh0aGlzLmhvc3QsIHRoaXMuc2VjdXJlID8gJ3dzcycgOiAnd3MnLCB0aGlzLnZlcnNpb24sIHRoaXMuYXBpS2V5KTtcblxuICAgICAgICB0aGlzLiNsb2coXCJDb25uZWN0aW5nIHRvOiBcIiwgdXJsKTtcblxuICAgICAgICAvLyBJdCB0aHJvd3Mgd2hlbiB0aGUgc2VydmVyIGlzIG5vdCBhY2Nlc3NpYmxlIGJ1dCB0aGUgZXhjZXB0aW9uIGNhbm5vdCBiZSBjYXVnaHQ6XG4gICAgICAgIC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzMxMDAyNTkyL2phdmFzY3JpcHQtZG9lc250LWNhdGNoLWVycm9yLWluLXdlYnNvY2tldC1pbnN0YW50aWF0aW9uLzMxMDAzMDU3XG4gICAgICAgIGNvbnN0IGNvbm4gPSBuZXcgV2ViU29ja2V0UHJvdmlkZXIodXJsKTtcblxuICAgICAgICBjb25uLm9uZXJyb3IgPSAoZXJyKSA9PiB7XG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29ubi5vbm9wZW4gPSAoZXZ0KSA9PiB7XG4gICAgICAgICAgaWYgKHRoaXMuYXV0b3JlY29ubmVjdCkge1xuICAgICAgICAgICAgdGhpcy4jYm9mZlN0b3AoKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodGhpcy5vbk9wZW4pIHtcbiAgICAgICAgICAgIHRoaXMub25PcGVuKCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbm4ub25jbG9zZSA9IChldnQpID0+IHtcbiAgICAgICAgICB0aGlzLiNzb2NrZXQgPSBudWxsO1xuXG4gICAgICAgICAgaWYgKHRoaXMub25EaXNjb25uZWN0KSB7XG4gICAgICAgICAgICBjb25zdCBjb2RlID0gdGhpcy4jYm9mZkNsb3NlZCA/IE5FVFdPUktfVVNFUiA6IE5FVFdPUktfRVJST1I7XG4gICAgICAgICAgICB0aGlzLm9uRGlzY29ubmVjdChuZXcgRXJyb3IodGhpcy4jYm9mZkNsb3NlZCA/IE5FVFdPUktfVVNFUl9URVhUIDogTkVUV09SS19FUlJPUl9URVhUICtcbiAgICAgICAgICAgICAgJyAoJyArIGNvZGUgKyAnKScpLCBjb2RlKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoIXRoaXMuI2JvZmZDbG9zZWQgJiYgdGhpcy5hdXRvcmVjb25uZWN0KSB7XG4gICAgICAgICAgICB0aGlzLiNib2ZmUmVjb25uZWN0KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbm4ub25tZXNzYWdlID0gKGV2dCkgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLm9uTWVzc2FnZSkge1xuICAgICAgICAgICAgdGhpcy5vbk1lc3NhZ2UoZXZ0LmRhdGEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLiNzb2NrZXQgPSBjb25uO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5yZWNvbm5lY3QgPSAoZm9yY2UpID0+IHtcbiAgICAgIHRoaXMuI2JvZmZTdG9wKCk7XG4gICAgICB0aGlzLmNvbm5lY3QobnVsbCwgZm9yY2UpO1xuICAgIH07XG5cbiAgICB0aGlzLmRpc2Nvbm5lY3QgPSAoKSA9PiB7XG4gICAgICB0aGlzLiNib2ZmQ2xvc2VkID0gdHJ1ZTtcbiAgICAgIHRoaXMuI2JvZmZTdG9wKCk7XG5cbiAgICAgIGlmICghdGhpcy4jc29ja2V0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHRoaXMuI3NvY2tldC5jbG9zZSgpO1xuICAgICAgdGhpcy4jc29ja2V0ID0gbnVsbDtcbiAgICB9O1xuXG4gICAgdGhpcy5zZW5kVGV4dCA9IChtc2cpID0+IHtcbiAgICAgIGlmICh0aGlzLiNzb2NrZXQgJiYgKHRoaXMuI3NvY2tldC5yZWFkeVN0YXRlID09IHRoaXMuI3NvY2tldC5PUEVOKSkge1xuICAgICAgICB0aGlzLiNzb2NrZXQuc2VuZChtc2cpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiV2Vic29ja2V0IGlzIG5vdCBjb25uZWN0ZWRcIik7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRoaXMuaXNDb25uZWN0ZWQgPSAoKSA9PiB7XG4gICAgICByZXR1cm4gKHRoaXMuI3NvY2tldCAmJiAodGhpcy4jc29ja2V0LnJlYWR5U3RhdGUgPT0gdGhpcy4jc29ja2V0Lk9QRU4pKTtcbiAgICB9O1xuICB9XG5cbiAgLy8gQ2FsbGJhY2tzOlxuXG4gIC8qKlxuICAgKiBBIGNhbGxiYWNrIHRvIHBhc3MgaW5jb21pbmcgbWVzc2FnZXMgdG8uIFNlZSB7QGxpbmsgVGlub2RlLkNvbm5lY3Rpb24jb25NZXNzYWdlfS5cbiAgICogQGNhbGxiYWNrIFRpbm9kZS5Db25uZWN0aW9uLk9uTWVzc2FnZVxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNvbm5lY3Rpb25cbiAgICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2UgLSBNZXNzYWdlIHRvIHByb2Nlc3MuXG4gICAqL1xuICBvbk1lc3NhZ2UgPSB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIEEgY2FsbGJhY2sgZm9yIHJlcG9ydGluZyBhIGRyb3BwZWQgY29ubmVjdGlvbi5cbiAgICogQHR5cGUge2Z1bmN0aW9ufVxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNvbm5lY3Rpb24jXG4gICAqL1xuICBvbkRpc2Nvbm5lY3QgPSB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIEEgY2FsbGJhY2sgY2FsbGVkIHdoZW4gdGhlIGNvbm5lY3Rpb24gaXMgcmVhZHkgdG8gYmUgdXNlZCBmb3Igc2VuZGluZy4gRm9yIHdlYnNvY2tldHMgaXQncyBzb2NrZXQgb3BlbixcbiAgICogZm9yIGxvbmcgcG9sbGluZyBpdCdzIDxjb2RlPnJlYWR5U3RhdGU9MTwvY29kZT4gKE9QRU5FRClcbiAgICogQHR5cGUge2Z1bmN0aW9ufVxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNvbm5lY3Rpb24jXG4gICAqL1xuICBvbk9wZW4gPSB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIEEgY2FsbGJhY2sgdG8gbm90aWZ5IG9mIHJlY29ubmVjdGlvbiBhdHRlbXB0cy4gU2VlIHtAbGluayBUaW5vZGUuQ29ubmVjdGlvbiNvbkF1dG9yZWNvbm5lY3RJdGVyYXRpb259LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNvbm5lY3Rpb25cbiAgICogQGNhbGxiYWNrIEF1dG9yZWNvbm5lY3RJdGVyYXRpb25UeXBlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0aW1lb3V0IC0gdGltZSB0aWxsIHRoZSBuZXh0IHJlY29ubmVjdCBhdHRlbXB0IGluIG1pbGxpc2Vjb25kcy4gPGNvZGU+LTE8L2NvZGU+IG1lYW5zIHJlY29ubmVjdCB3YXMgc2tpcHBlZC5cbiAgICogQHBhcmFtIHtQcm9taXNlfSBwcm9taXNlIHJlc29sdmVkIG9yIHJlamVjdGVkIHdoZW4gdGhlIHJlY29ubmVjdCBhdHRlbXAgY29tcGxldGVzLlxuICAgKlxuICAgKi9cbiAgLyoqXG4gICAqIEEgY2FsbGJhY2sgdG8gaW5mb3JtIHdoZW4gdGhlIG5leHQgYXR0YW1wdCB0byByZWNvbm5lY3Qgd2lsbCBoYXBwZW4gYW5kIHRvIHJlY2VpdmUgY29ubmVjdGlvbiBwcm9taXNlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNvbm5lY3Rpb24jXG4gICAqIEB0eXBlIHtUaW5vZGUuQ29ubmVjdGlvbi5BdXRvcmVjb25uZWN0SXRlcmF0aW9uVHlwZX1cbiAgICovXG4gIG9uQXV0b3JlY29ubmVjdEl0ZXJhdGlvbiA9IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQSBjYWxsYmFjayB0byBsb2cgZXZlbnRzIGZyb20gQ29ubmVjdGlvbi4gU2VlIHtAbGluayBUaW5vZGUuQ29ubmVjdGlvbiNsb2dnZXJ9LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNvbm5lY3Rpb25cbiAgICogQGNhbGxiYWNrIExvZ2dlckNhbGxiYWNrVHlwZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnQgLSBFdmVudCB0byBsb2cuXG4gICAqL1xuICAvKipcbiAgICogQSBjYWxsYmFjayB0byByZXBvcnQgbG9nZ2luZyBldmVudHMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ29ubmVjdGlvbiNcbiAgICogQHR5cGUge1Rpbm9kZS5Db25uZWN0aW9uLkxvZ2dlckNhbGxiYWNrVHlwZX1cbiAgICovXG4gIGxvZ2dlciA9IHVuZGVmaW5lZDtcbn1cblxuQ29ubmVjdGlvbi5ORVRXT1JLX0VSUk9SID0gTkVUV09SS19FUlJPUjtcbkNvbm5lY3Rpb24uTkVUV09SS19FUlJPUl9URVhUID0gTkVUV09SS19FUlJPUl9URVhUO1xuQ29ubmVjdGlvbi5ORVRXT1JLX1VTRVIgPSBORVRXT1JLX1VTRVI7XG5Db25uZWN0aW9uLk5FVFdPUktfVVNFUl9URVhUID0gTkVUV09SS19VU0VSX1RFWFQ7XG4iLCIvKipcbiAqIEBmaWxlIEhlbHBlciBtZXRob2RzIGZvciBkZWFsaW5nIHdpdGggSW5kZXhlZERCIGNhY2hlIG9mIG1lc3NhZ2VzLCB1c2VycywgYW5kIHRvcGljcy5cbiAqXG4gKiBAY29weXJpZ2h0IDIwMTUtMjAyMiBUaW5vZGUgTExDLlxuICovXG4ndXNlIHN0cmljdCc7XG5cbi8vIE5PVEUgVE8gREVWRUxPUEVSUzpcbi8vIExvY2FsaXphYmxlIHN0cmluZ3Mgc2hvdWxkIGJlIGRvdWJsZSBxdW90ZWQgXCLRgdGC0YDQvtC60LAg0L3QsCDQtNGA0YPQs9C+0Lwg0Y/Qt9GL0LrQtVwiLFxuLy8gbm9uLWxvY2FsaXphYmxlIHN0cmluZ3Mgc2hvdWxkIGJlIHNpbmdsZSBxdW90ZWQgJ25vbi1sb2NhbGl6ZWQnLlxuXG5jb25zdCBEQl9WRVJTSU9OID0gMTtcbmNvbnN0IERCX05BTUUgPSAndGlub2RlLXdlYic7XG5cbmxldCBJREJQcm92aWRlcjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgREIge1xuICAjb25FcnJvciA9IGZ1bmN0aW9uKCkge307XG4gICNsb2dnZXIgPSBmdW5jdGlvbigpIHt9O1xuXG4gIC8vIEluc3RhbmNlIG9mIEluZGV4REIuXG4gIGRiID0gbnVsbDtcbiAgLy8gSW5kaWNhdG9yIHRoYXQgdGhlIGNhY2hlIGlzIGRpc2FibGVkLlxuICBkaXNhYmxlZCA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKG9uRXJyb3IsIGxvZ2dlcikge1xuICAgIHRoaXMuI29uRXJyb3IgPSBvbkVycm9yIHx8IHRoaXMuI29uRXJyb3I7XG4gICAgdGhpcy4jbG9nZ2VyID0gbG9nZ2VyIHx8IHRoaXMuI2xvZ2dlcjtcbiAgfVxuXG4gICNtYXBPYmplY3RzKHNvdXJjZSwgY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICBpZiAoIXRoaXMuZGIpIHtcbiAgICAgIHJldHVybiBkaXNhYmxlZCA/XG4gICAgICAgIFByb21pc2UucmVzb2x2ZShbXSkgOlxuICAgICAgICBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJub3QgaW5pdGlhbGl6ZWRcIikpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCB0cnggPSB0aGlzLmRiLnRyYW5zYWN0aW9uKFtzb3VyY2VdKTtcbiAgICAgIHRyeC5vbmVycm9yID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuI2xvZ2dlcignUENhY2hlJywgJ21hcE9iamVjdHMnLCBzb3VyY2UsIGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICAgIHJlamVjdChldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgfTtcbiAgICAgIHRyeC5vYmplY3RTdG9yZShzb3VyY2UpLmdldEFsbCgpLm9uc3VjY2VzcyA9IChldmVudCkgPT4ge1xuICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICBldmVudC50YXJnZXQucmVzdWx0LmZvckVhY2goKHRvcGljKSA9PiB7XG4gICAgICAgICAgICBjYWxsYmFjay5jYWxsKGNvbnRleHQsIHRvcGljKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXNvbHZlKGV2ZW50LnRhcmdldC5yZXN1bHQpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIHBlcnNpc3RlbnQgY2FjaGU6IG9wZW4gb3IgY3JlYXRlL3VwZ3JhZGUgaWYgbmVlZGVkLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gcHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBEQiBpcyBpbml0aWFsaXplZC5cbiAgICovXG4gIGluaXREYXRhYmFzZSgpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgLy8gT3BlbiB0aGUgZGF0YWJhc2UgYW5kIGluaXRpYWxpemUgY2FsbGJhY2tzLlxuICAgICAgY29uc3QgcmVxID0gSURCUHJvdmlkZXIub3BlbihEQl9OQU1FLCBEQl9WRVJTSU9OKTtcbiAgICAgIHJlcS5vbnN1Y2Nlc3MgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy5kYiA9IGV2ZW50LnRhcmdldC5yZXN1bHQ7XG4gICAgICAgIHRoaXMuZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgcmVzb2x2ZSh0aGlzLmRiKTtcbiAgICAgIH07XG4gICAgICByZXEub25lcnJvciA9IChldmVudCkgPT4ge1xuICAgICAgICB0aGlzLiNsb2dnZXIoJ1BDYWNoZScsIFwiZmFpbGVkIHRvIGluaXRpYWxpemVcIiwgZXZlbnQpO1xuICAgICAgICByZWplY3QoZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgICAgdGhpcy4jb25FcnJvcihldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgfTtcbiAgICAgIHJlcS5vbnVwZ3JhZGVuZWVkZWQgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICB0aGlzLmRiID0gZXZlbnQudGFyZ2V0LnJlc3VsdDtcblxuICAgICAgICB0aGlzLmRiLm9uZXJyb3IgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgIHRoaXMuI2xvZ2dlcignUENhY2hlJywgXCJmYWlsZWQgdG8gY3JlYXRlIHN0b3JhZ2VcIiwgZXZlbnQpO1xuICAgICAgICAgIHRoaXMuI29uRXJyb3IoZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBJbmRpdmlkdWFsIG9iamVjdCBzdG9yZXMuXG4gICAgICAgIC8vIE9iamVjdCBzdG9yZSAodGFibGUpIGZvciB0b3BpY3MuIFRoZSBwcmltYXJ5IGtleSBpcyB0b3BpYyBuYW1lLlxuICAgICAgICB0aGlzLmRiLmNyZWF0ZU9iamVjdFN0b3JlKCd0b3BpYycsIHtcbiAgICAgICAgICBrZXlQYXRoOiAnbmFtZSdcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gVXNlcnMgb2JqZWN0IHN0b3JlLiBVSUQgaXMgdGhlIHByaW1hcnkga2V5LlxuICAgICAgICB0aGlzLmRiLmNyZWF0ZU9iamVjdFN0b3JlKCd1c2VyJywge1xuICAgICAgICAgIGtleVBhdGg6ICd1aWQnXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFN1YnNjcmlwdGlvbnMgb2JqZWN0IHN0b3JlIHRvcGljIDwtPiB1c2VyLiBUb3BpYyBuYW1lICsgVUlEIGlzIHRoZSBwcmltYXJ5IGtleS5cbiAgICAgICAgdGhpcy5kYi5jcmVhdGVPYmplY3RTdG9yZSgnc3Vic2NyaXB0aW9uJywge1xuICAgICAgICAgIGtleVBhdGg6IFsndG9waWMnLCAndWlkJ11cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gTWVzc2FnZXMgb2JqZWN0IHN0b3JlLiBUaGUgcHJpbWFyeSBrZXkgaXMgdG9waWMgbmFtZSArIHNlcS5cbiAgICAgICAgdGhpcy5kYi5jcmVhdGVPYmplY3RTdG9yZSgnbWVzc2FnZScsIHtcbiAgICAgICAgICBrZXlQYXRoOiBbJ3RvcGljJywgJ3NlcSddXG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWxldGUgcGVyc2lzdGVudCBjYWNoZS5cbiAgICovXG4gIGRlbGV0ZURhdGFiYXNlKCkge1xuICAgIC8vIENsb3NlIGNvbm5lY3Rpb24sIG90aGVyd2lzZSBvcGVyYXRpb25zIHdpbGwgZmFpbCB3aXRoICdvbmJsb2NrZWQnLlxuICAgIGlmICh0aGlzLmRiKSB7XG4gICAgICB0aGlzLmRiLmNsb3NlKCk7XG4gICAgICB0aGlzLmRiID0gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IHJlcSA9IElEQlByb3ZpZGVyLmRlbGV0ZURhdGFiYXNlKERCX05BTUUpO1xuICAgICAgcmVxLm9uYmxvY2tlZCA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGlmICh0aGlzLmRiKSB7XG4gICAgICAgICAgdGhpcy5kYi5jbG9zZSgpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGVyciA9IG5ldyBFcnJvcihcImJsb2NrZWRcIik7XG4gICAgICAgIHRoaXMuI2xvZ2dlcignUENhY2hlJywgJ2RlbGV0ZURhdGFiYXNlJywgZXJyKTtcbiAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICB9O1xuICAgICAgcmVxLm9uc3VjY2VzcyA9IChldmVudCkgPT4ge1xuICAgICAgICB0aGlzLmRiID0gbnVsbDtcbiAgICAgICAgdGhpcy5kaXNhYmxlZCA9IHRydWU7XG4gICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICB9O1xuICAgICAgcmVxLm9uZXJyb3IgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy4jbG9nZ2VyKCdQQ2FjaGUnLCAnZGVsZXRlRGF0YWJhc2UnLCBldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgICByZWplY3QoZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgcGVyc2lzdGVudCBjYWNoZSBpcyByZWFkeSBmb3IgdXNlLlxuICAgKiBAbWVtYmVyT2YgREJcbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIGNhY2hlIGlzIHJlYWR5LCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgaXNSZWFkeSgpIHtcbiAgICByZXR1cm4gISF0aGlzLmRiO1xuICB9XG5cbiAgLy8gVG9waWNzLlxuXG4gIC8qKlxuICAgKiBTYXZlIHRvIGNhY2hlIG9yIHVwZGF0ZSB0b3BpYyBpbiBwZXJzaXN0ZW50IGNhY2hlLlxuICAgKiBAbWVtYmVyT2YgREJcbiAgICogQHBhcmFtIHtUb3BpY30gdG9waWMgLSB0b3BpYyB0byBiZSBhZGRlZCBvciB1cGRhdGVkLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gcHJvbWlzZSByZXNvbHZlZC9yZWplY3RlZCBvbiBvcGVyYXRpb24gY29tcGxldGlvbi5cbiAgICovXG4gIHVwZFRvcGljKHRvcGljKSB7XG4gICAgaWYgKCF0aGlzLmlzUmVhZHkoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZGlzYWJsZWQgP1xuICAgICAgICBQcm9taXNlLnJlc29sdmUoKSA6XG4gICAgICAgIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIm5vdCBpbml0aWFsaXplZFwiKSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCB0cnggPSB0aGlzLmRiLnRyYW5zYWN0aW9uKFsndG9waWMnXSwgJ3JlYWR3cml0ZScpO1xuICAgICAgdHJ4Lm9uY29tcGxldGUgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgcmVzb2x2ZShldmVudC50YXJnZXQucmVzdWx0KTtcbiAgICAgIH07XG4gICAgICB0cngub25lcnJvciA9IChldmVudCkgPT4ge1xuICAgICAgICB0aGlzLiNsb2dnZXIoJ1BDYWNoZScsICd1cGRUb3BpYycsIGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICAgIHJlamVjdChldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgfTtcbiAgICAgIGNvbnN0IHJlcSA9IHRyeC5vYmplY3RTdG9yZSgndG9waWMnKS5nZXQodG9waWMubmFtZSk7XG4gICAgICByZXEub25zdWNjZXNzID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHRyeC5vYmplY3RTdG9yZSgndG9waWMnKS5wdXQoREIuI3NlcmlhbGl6ZVRvcGljKHJlcS5yZXN1bHQsIHRvcGljKSk7XG4gICAgICAgIHRyeC5jb21taXQoKTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogTWFyayBvciB1bm1hcmsgdG9waWMgYXMgZGVsZXRlZC5cbiAgICogQG1lbWJlck9mIERCXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gbmFtZSBvZiB0aGUgdG9waWMgdG8gbWFyayBvciB1bm1hcmsuXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gZGVsZXRlZCAtIGRlbGV0aW9uIG1hcmsuXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IHByb21pc2UgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gb3BlcmF0aW9uIGNvbXBsZXRpb24uXG4gICAqL1xuICBtYXJrVG9waWNBc0RlbGV0ZWQobmFtZSwgZGVsZXRlZCkge1xuICAgIGlmICghdGhpcy5pc1JlYWR5KCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmRpc2FibGVkID9cbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkgOlxuICAgICAgICBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJub3QgaW5pdGlhbGl6ZWRcIikpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgdHJ4ID0gdGhpcy5kYi50cmFuc2FjdGlvbihbJ3RvcGljJ10sICdyZWFkd3JpdGUnKTtcbiAgICAgIHRyeC5vbmNvbXBsZXRlID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHJlc29sdmUoZXZlbnQudGFyZ2V0LnJlc3VsdCk7XG4gICAgICB9O1xuICAgICAgdHJ4Lm9uZXJyb3IgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy4jbG9nZ2VyKCdQQ2FjaGUnLCAnbWFya1RvcGljQXNEZWxldGVkJywgZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgICAgcmVqZWN0KGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICB9O1xuICAgICAgY29uc3QgcmVxID0gdHJ4Lm9iamVjdFN0b3JlKCd0b3BpYycpLmdldChuYW1lKTtcbiAgICAgIHJlcS5vbnN1Y2Nlc3MgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgY29uc3QgdG9waWMgPSBldmVudC50YXJnZXQucmVzdWx0O1xuICAgICAgICBpZiAodG9waWMuX2RlbGV0ZWQgIT0gZGVsZXRlZCkge1xuICAgICAgICAgIHRvcGljLl9kZWxldGVkID0gdHJ1ZTtcbiAgICAgICAgICB0cngub2JqZWN0U3RvcmUoJ3RvcGljJykucHV0KHRvcGljKTtcbiAgICAgICAgfVxuICAgICAgICB0cnguY29tbWl0KCk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSB0b3BpYyBmcm9tIHBlcnNpc3RlbnQgY2FjaGUuXG4gICAqIEBtZW1iZXJPZiBEQlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIG5hbWUgb2YgdGhlIHRvcGljIHRvIHJlbW92ZSBmcm9tIGRhdGFiYXNlLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBwcm9taXNlIHJlc29sdmVkL3JlamVjdGVkIG9uIG9wZXJhdGlvbiBjb21wbGV0aW9uLlxuICAgKi9cbiAgcmVtVG9waWMobmFtZSkge1xuICAgIGlmICghdGhpcy5pc1JlYWR5KCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmRpc2FibGVkID9cbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkgOlxuICAgICAgICBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJub3QgaW5pdGlhbGl6ZWRcIikpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgdHJ4ID0gdGhpcy5kYi50cmFuc2FjdGlvbihbJ3RvcGljJywgJ3N1YnNjcmlwdGlvbicsICdtZXNzYWdlJ10sICdyZWFkd3JpdGUnKTtcbiAgICAgIHRyeC5vbmNvbXBsZXRlID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHJlc29sdmUoZXZlbnQudGFyZ2V0LnJlc3VsdCk7XG4gICAgICB9O1xuICAgICAgdHJ4Lm9uZXJyb3IgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy4jbG9nZ2VyKCdQQ2FjaGUnLCAncmVtVG9waWMnLCBldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgICByZWplY3QoZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgIH07XG4gICAgICB0cngub2JqZWN0U3RvcmUoJ3RvcGljJykuZGVsZXRlKElEQktleVJhbmdlLm9ubHkobmFtZSkpO1xuICAgICAgdHJ4Lm9iamVjdFN0b3JlKCdzdWJzY3JpcHRpb24nKS5kZWxldGUoSURCS2V5UmFuZ2UuYm91bmQoW25hbWUsICctJ10sIFtuYW1lLCAnfiddKSk7XG4gICAgICB0cngub2JqZWN0U3RvcmUoJ21lc3NhZ2UnKS5kZWxldGUoSURCS2V5UmFuZ2UuYm91bmQoW25hbWUsIDBdLCBbbmFtZSwgTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVJdKSk7XG4gICAgICB0cnguY29tbWl0KCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogRXhlY3V0ZSBhIGNhbGxiYWNrIGZvciBlYWNoIHN0b3JlZCB0b3BpYy5cbiAgICogQG1lbWJlck9mIERCXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIC0gZnVuY3Rpb24gdG8gY2FsbCBmb3IgZWFjaCB0b3BpYy5cbiAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHQgLSB0aGUgdmFsdWUgb3IgPGNvZGU+dGhpczwvY29kZT4gaW5zaWRlIHRoZSBjYWxsYmFjay5cbiAgICogQHJldHVybiB7UHJvbWlzZX0gcHJvbWlzZSByZXNvbHZlZC9yZWplY3RlZCBvbiBvcGVyYXRpb24gY29tcGxldGlvbi5cbiAgICovXG4gIG1hcFRvcGljcyhjYWxsYmFjaywgY29udGV4dCkge1xuICAgIHJldHVybiB0aGlzLiNtYXBPYmplY3RzKCd0b3BpYycsIGNhbGxiYWNrLCBjb250ZXh0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb3B5IGRhdGEgZnJvbSBzZXJpYWxpemVkIG9iamVjdCB0byB0b3BpYy5cbiAgICogQG1lbWJlck9mIERCXG4gICAqIEBwYXJhbSB7VG9waWN9IHRvcGljIC0gdGFyZ2V0IHRvIGRlc2VyaWFsaXplIHRvLlxuICAgKiBAcGFyYW0ge09iamVjdH0gc3JjIC0gc2VyaWFsaXplZCBkYXRhIHRvIGNvcHkgZnJvbS5cbiAgICovXG4gIGRlc2VyaWFsaXplVG9waWModG9waWMsIHNyYykge1xuICAgIERCLiNkZXNlcmlhbGl6ZVRvcGljKHRvcGljLCBzcmMpO1xuICB9XG5cbiAgLy8gVXNlcnMuXG4gIC8qKlxuICAgKiBBZGQgb3IgdXBkYXRlIHVzZXIgb2JqZWN0IGluIHRoZSBwZXJzaXN0ZW50IGNhY2hlLlxuICAgKiBAbWVtYmVyT2YgREJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVpZCAtIElEIG9mIHRoZSB1c2VyIHRvIHNhdmUgb3IgdXBkYXRlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gcHViIC0gdXNlcidzIDxjb2RlPnB1YmxpYzwvY29kZT4gaW5mb3JtYXRpb24uXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBwcm9taXNlIHJlc29sdmVkL3JlamVjdGVkIG9uIG9wZXJhdGlvbiBjb21wbGV0aW9uLlxuICAgKi9cbiAgdXBkVXNlcih1aWQsIHB1Yikge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMiB8fCBwdWIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gTm8gcG9pbnQgaW51cGRhdGluZyB1c2VyIHdpdGggaW52YWxpZCBkYXRhLlxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuaXNSZWFkeSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5kaXNhYmxlZCA/XG4gICAgICAgIFByb21pc2UucmVzb2x2ZSgpIDpcbiAgICAgICAgUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwibm90IGluaXRpYWxpemVkXCIpKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IHRyeCA9IHRoaXMuZGIudHJhbnNhY3Rpb24oWyd1c2VyJ10sICdyZWFkd3JpdGUnKTtcbiAgICAgIHRyeC5vbmNvbXBsZXRlID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHJlc29sdmUoZXZlbnQudGFyZ2V0LnJlc3VsdCk7XG4gICAgICB9O1xuICAgICAgdHJ4Lm9uZXJyb3IgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy4jbG9nZ2VyKCdQQ2FjaGUnLCAndXBkVXNlcicsIGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICAgIHJlamVjdChldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgfTtcbiAgICAgIHRyeC5vYmplY3RTdG9yZSgndXNlcicpLnB1dCh7XG4gICAgICAgIHVpZDogdWlkLFxuICAgICAgICBwdWJsaWM6IHB1YlxuICAgICAgfSk7XG4gICAgICB0cnguY29tbWl0KCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIHVzZXIgZnJvbSBwZXJzaXN0ZW50IGNhY2hlLlxuICAgKiBAbWVtYmVyT2YgREJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVpZCAtIElEIG9mIHRoZSB1c2VyIHRvIHJlbW92ZSBmcm9tIHRoZSBjYWNoZS5cbiAgICogQHJldHVybiB7UHJvbWlzZX0gcHJvbWlzZSByZXNvbHZlZC9yZWplY3RlZCBvbiBvcGVyYXRpb24gY29tcGxldGlvbi5cbiAgICovXG4gIHJlbVVzZXIodWlkKSB7XG4gICAgaWYgKCF0aGlzLmlzUmVhZHkoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZGlzYWJsZWQgP1xuICAgICAgICBQcm9taXNlLnJlc29sdmUoKSA6XG4gICAgICAgIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIm5vdCBpbml0aWFsaXplZFwiKSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCB0cnggPSB0aGlzLmRiLnRyYW5zYWN0aW9uKFsndXNlciddLCAncmVhZHdyaXRlJyk7XG4gICAgICB0cngub25jb21wbGV0ZSA9IChldmVudCkgPT4ge1xuICAgICAgICByZXNvbHZlKGV2ZW50LnRhcmdldC5yZXN1bHQpO1xuICAgICAgfTtcbiAgICAgIHRyeC5vbmVycm9yID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuI2xvZ2dlcignUENhY2hlJywgJ3JlbVVzZXInLCBldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgICByZWplY3QoZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgIH07XG4gICAgICB0cngub2JqZWN0U3RvcmUoJ3VzZXInKS5kZWxldGUoSURCS2V5UmFuZ2Uub25seSh1aWQpKTtcbiAgICAgIHRyeC5jb21taXQoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeGVjdXRlIGEgY2FsbGJhY2sgZm9yIGVhY2ggc3RvcmVkIHVzZXIuXG4gICAqIEBtZW1iZXJPZiBEQlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayAtIGZ1bmN0aW9uIHRvIGNhbGwgZm9yIGVhY2ggdG9waWMuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZXh0IC0gdGhlIHZhbHVlIG9yIDxjb2RlPnRoaXM8L2NvZGU+IGluc2lkZSB0aGUgY2FsbGJhY2suXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IHByb21pc2UgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gb3BlcmF0aW9uIGNvbXBsZXRpb24uXG4gICAqL1xuICBtYXBVc2VycyhjYWxsYmFjaywgY29udGV4dCkge1xuICAgIHJldHVybiB0aGlzLiNtYXBPYmplY3RzKCd1c2VyJywgY2FsbGJhY2ssIGNvbnRleHQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlYWQgYSBzaW5nbGUgdXNlciBmcm9tIHBlcnNpc3RlbnQgY2FjaGUuXG4gICAqIEBtZW1iZXJPZiBEQlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdWlkIC0gSUQgb2YgdGhlIHVzZXIgdG8gZmV0Y2ggZnJvbSBjYWNoZS5cbiAgICogQHJldHVybiB7UHJvbWlzZX0gcHJvbWlzZSByZXNvbHZlZC9yZWplY3RlZCBvbiBvcGVyYXRpb24gY29tcGxldGlvbi5cbiAgICovXG4gIGdldFVzZXIodWlkKSB7XG4gICAgaWYgKCF0aGlzLmlzUmVhZHkoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZGlzYWJsZWQgP1xuICAgICAgICBQcm9taXNlLnJlc29sdmUoKSA6XG4gICAgICAgIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIm5vdCBpbml0aWFsaXplZFwiKSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCB0cnggPSB0aGlzLmRiLnRyYW5zYWN0aW9uKFsndXNlciddKTtcbiAgICAgIHRyeC5vbmNvbXBsZXRlID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIGNvbnN0IHVzZXIgPSBldmVudC50YXJnZXQucmVzdWx0O1xuICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICB1c2VyOiB1c2VyLnVpZCxcbiAgICAgICAgICBwdWJsaWM6IHVzZXIucHVibGljXG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIHRyeC5vbmVycm9yID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuI2xvZ2dlcignUENhY2hlJywgJ2dldFVzZXInLCBldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgICByZWplY3QoZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgIH07XG4gICAgICB0cngub2JqZWN0U3RvcmUoJ3VzZXInKS5nZXQodWlkKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIFN1YnNjcmlwdGlvbnMuXG4gIC8qKlxuICAgKiBBZGQgb3IgdXBkYXRlIHN1YnNjcmlwdGlvbiBpbiBwZXJzaXN0ZW50IGNhY2hlLlxuICAgKiBAbWVtYmVyT2YgREJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljTmFtZSAtIG5hbWUgb2YgdGhlIHRvcGljIHdoaWNoIG93bnMgdGhlIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1aWQgLSBJRCBvZiB0aGUgc3Vic2NyaWJlZCB1c2VyLlxuICAgKiBAcGFyYW0ge09iamVjdH0gc3ViIC0gc3Vic2NyaXB0aW9uIHRvIHNhdmUuXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IHByb21pc2UgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gb3BlcmF0aW9uIGNvbXBsZXRpb24uXG4gICAqL1xuICB1cGRTdWJzY3JpcHRpb24odG9waWNOYW1lLCB1aWQsIHN1Yikge1xuICAgIGlmICghdGhpcy5pc1JlYWR5KCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmRpc2FibGVkID9cbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkgOlxuICAgICAgICBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJub3QgaW5pdGlhbGl6ZWRcIikpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgdHJ4ID0gdGhpcy5kYi50cmFuc2FjdGlvbihbJ3N1YnNjcmlwdGlvbiddLCAncmVhZHdyaXRlJyk7XG4gICAgICB0cngub25jb21wbGV0ZSA9IChldmVudCkgPT4ge1xuICAgICAgICByZXNvbHZlKGV2ZW50LnRhcmdldC5yZXN1bHQpO1xuICAgICAgfTtcbiAgICAgIHRyeC5vbmVycm9yID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuI2xvZ2dlcignUENhY2hlJywgJ3VwZFN1YnNjcmlwdGlvbicsIGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICAgIHJlamVjdChldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgfTtcbiAgICAgIHRyeC5vYmplY3RTdG9yZSgnc3Vic2NyaXB0aW9uJykuZ2V0KFt0b3BpY05hbWUsIHVpZF0pLm9uc3VjY2VzcyA9IChldmVudCkgPT4ge1xuICAgICAgICB0cngub2JqZWN0U3RvcmUoJ3N1YnNjcmlwdGlvbicpLnB1dChEQi4jc2VyaWFsaXplU3Vic2NyaXB0aW9uKGV2ZW50LnRhcmdldC5yZXN1bHQsIHRvcGljTmFtZSwgdWlkLCBzdWIpKTtcbiAgICAgICAgdHJ4LmNvbW1pdCgpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeGVjdXRlIGEgY2FsbGJhY2sgZm9yIGVhY2ggY2FjaGVkIHN1YnNjcmlwdGlvbiBpbiBhIGdpdmVuIHRvcGljLlxuICAgKiBAbWVtYmVyT2YgREJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljTmFtZSAtIG5hbWUgb2YgdGhlIHRvcGljIHdoaWNoIG93bnMgdGhlIHN1YnNjcmlwdGlvbnMuXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIC0gZnVuY3Rpb24gdG8gY2FsbCBmb3IgZWFjaCBzdWJzY3JpcHRpb24uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZXh0IC0gdGhlIHZhbHVlIG9yIDxjb2RlPnRoaXM8L2NvZGU+IGluc2lkZSB0aGUgY2FsbGJhY2suXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IHByb21pc2UgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gb3BlcmF0aW9uIGNvbXBsZXRpb24uXG4gICAqL1xuICBtYXBTdWJzY3JpcHRpb25zKHRvcGljTmFtZSwgY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICBpZiAoIXRoaXMuaXNSZWFkeSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5kaXNhYmxlZCA/XG4gICAgICAgIFByb21pc2UucmVzb2x2ZShbXSkgOlxuICAgICAgICBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJub3QgaW5pdGlhbGl6ZWRcIikpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgdHJ4ID0gdGhpcy5kYi50cmFuc2FjdGlvbihbJ3N1YnNjcmlwdGlvbiddKTtcbiAgICAgIHRyeC5vbmVycm9yID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuI2xvZ2dlcignUENhY2hlJywgJ21hcFN1YnNjcmlwdGlvbnMnLCBldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgICByZWplY3QoZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgIH07XG4gICAgICB0cngub2JqZWN0U3RvcmUoJ3N1YnNjcmlwdGlvbicpLmdldEFsbChJREJLZXlSYW5nZS5ib3VuZChbdG9waWNOYW1lLCAnLSddLCBbdG9waWNOYW1lLCAnfiddKSkub25zdWNjZXNzID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgIGV2ZW50LnRhcmdldC5yZXN1bHQuZm9yRWFjaCgodG9waWMpID0+IHtcbiAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwoY29udGV4dCwgdG9waWMpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJlc29sdmUoZXZlbnQudGFyZ2V0LnJlc3VsdCk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgLy8gTWVzc2FnZXMuXG5cbiAgLyoqXG4gICAqIFNhdmUgbWVzc2FnZSB0byBwZXJzaXN0ZW50IGNhY2hlLlxuICAgKiBAbWVtYmVyT2YgREJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljTmFtZSAtIG5hbWUgb2YgdGhlIHRvcGljIHdoaWNoIG93bnMgdGhlIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBtc2cgLSBtZXNzYWdlIHRvIHNhdmUuXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IHByb21pc2UgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gb3BlcmF0aW9uIGNvbXBsZXRpb24uXG4gICAqL1xuICBhZGRNZXNzYWdlKG1zZykge1xuICAgIGlmICghdGhpcy5pc1JlYWR5KCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmRpc2FibGVkID9cbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkgOlxuICAgICAgICBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJub3QgaW5pdGlhbGl6ZWRcIikpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgdHJ4ID0gdGhpcy5kYi50cmFuc2FjdGlvbihbJ21lc3NhZ2UnXSwgJ3JlYWR3cml0ZScpO1xuICAgICAgdHJ4Lm9uc3VjY2VzcyA9IChldmVudCkgPT4ge1xuICAgICAgICByZXNvbHZlKGV2ZW50LnRhcmdldC5yZXN1bHQpO1xuICAgICAgfTtcbiAgICAgIHRyeC5vbmVycm9yID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuI2xvZ2dlcignUENhY2hlJywgJ2FkZE1lc3NhZ2UnLCBldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgICByZWplY3QoZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgIH07XG4gICAgICB0cngub2JqZWN0U3RvcmUoJ21lc3NhZ2UnKS5hZGQoREIuI3NlcmlhbGl6ZU1lc3NhZ2UobnVsbCwgbXNnKSk7XG4gICAgICB0cnguY29tbWl0KCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlIGRlbGl2ZXJ5IHN0YXR1cyBvZiBhIG1lc3NhZ2Ugc3RvcmVkIGluIHBlcnNpc3RlbnQgY2FjaGUuXG4gICAqIEBtZW1iZXJPZiBEQlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWNOYW1lIC0gbmFtZSBvZiB0aGUgdG9waWMgd2hpY2ggb3ducyB0aGUgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtudW1iZXJ9IHNlcSAtIElEIG9mIHRoZSBtZXNzYWdlIHRvIHVwZGF0ZVxuICAgKiBAcGFyYW0ge251bWJlcn0gc3RhdHVzIC0gbmV3IGRlbGl2ZXJ5IHN0YXR1cyBvZiB0aGUgbWVzc2FnZS5cbiAgICogQHJldHVybiB7UHJvbWlzZX0gcHJvbWlzZSByZXNvbHZlZC9yZWplY3RlZCBvbiBvcGVyYXRpb24gY29tcGxldGlvbi5cbiAgICovXG4gIHVwZE1lc3NhZ2VTdGF0dXModG9waWNOYW1lLCBzZXEsIHN0YXR1cykge1xuICAgIGlmICghdGhpcy5pc1JlYWR5KCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmRpc2FibGVkID9cbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkgOlxuICAgICAgICBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJub3QgaW5pdGlhbGl6ZWRcIikpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgdHJ4ID0gdGhpcy5kYi50cmFuc2FjdGlvbihbJ21lc3NhZ2UnXSwgJ3JlYWR3cml0ZScpO1xuICAgICAgdHJ4Lm9uc3VjY2VzcyA9IChldmVudCkgPT4ge1xuICAgICAgICByZXNvbHZlKGV2ZW50LnRhcmdldC5yZXN1bHQpO1xuICAgICAgfTtcbiAgICAgIHRyeC5vbmVycm9yID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuI2xvZ2dlcignUENhY2hlJywgJ3VwZE1lc3NhZ2VTdGF0dXMnLCBldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgICByZWplY3QoZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgIH07XG4gICAgICBjb25zdCByZXEgPSB0cngub2JqZWN0U3RvcmUoJ21lc3NhZ2UnKS5nZXQoSURCS2V5UmFuZ2Uub25seShbdG9waWNOYW1lLCBzZXFdKSk7XG4gICAgICByZXEub25zdWNjZXNzID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIGNvbnN0IHNyYyA9IHJlcS5yZXN1bHQgfHwgZXZlbnQudGFyZ2V0LnJlc3VsdDtcbiAgICAgICAgaWYgKCFzcmMgfHwgc3JjLl9zdGF0dXMgPT0gc3RhdHVzKSB7XG4gICAgICAgICAgdHJ4LmNvbW1pdCgpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0cngub2JqZWN0U3RvcmUoJ21lc3NhZ2UnKS5wdXQoREIuI3NlcmlhbGl6ZU1lc3NhZ2Uoc3JjLCB7XG4gICAgICAgICAgdG9waWM6IHRvcGljTmFtZSxcbiAgICAgICAgICBzZXE6IHNlcSxcbiAgICAgICAgICBfc3RhdHVzOiBzdGF0dXNcbiAgICAgICAgfSkpO1xuICAgICAgICB0cnguY29tbWl0KCk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBvbmUgb3IgbW9yZSBtZXNzYWdlcyBmcm9tIHBlcnNpc3RlbnQgY2FjaGUuXG4gICAqIEBtZW1iZXJPZiBEQlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWNOYW1lIC0gbmFtZSBvZiB0aGUgdG9waWMgd2hpY2ggb3ducyB0aGUgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtudW1iZXJ9IGZyb20gLSBpZCBvZiB0aGUgbWVzc2FnZSB0byByZW1vdmUgb3IgbG93ZXIgYm91bmRhcnkgd2hlbiByZW1vdmluZyByYW5nZSAoaW5jbHVzaXZlKS5cbiAgICogQHBhcmFtIHtudW1iZXI9fSB0byAtIHVwcGVyIGJvdW5kYXJ5IChleGNsdXNpdmUpIHdoZW4gcmVtb3ZpbmcgYSByYW5nZSBvZiBtZXNzYWdlcy5cbiAgICogQHJldHVybiB7UHJvbWlzZX0gcHJvbWlzZSByZXNvbHZlZC9yZWplY3RlZCBvbiBvcGVyYXRpb24gY29tcGxldGlvbi5cbiAgICovXG4gIHJlbU1lc3NhZ2VzKHRvcGljTmFtZSwgZnJvbSwgdG8pIHtcbiAgICBpZiAoIXRoaXMuaXNSZWFkeSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5kaXNhYmxlZCA/XG4gICAgICAgIFByb21pc2UucmVzb2x2ZSgpIDpcbiAgICAgICAgUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwibm90IGluaXRpYWxpemVkXCIpKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGlmICghZnJvbSAmJiAhdG8pIHtcbiAgICAgICAgZnJvbSA9IDA7XG4gICAgICAgIHRvID0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XG4gICAgICB9XG4gICAgICBjb25zdCByYW5nZSA9IHRvID4gMCA/IElEQktleVJhbmdlLmJvdW5kKFt0b3BpY05hbWUsIGZyb21dLCBbdG9waWNOYW1lLCB0b10sIGZhbHNlLCB0cnVlKSA6XG4gICAgICAgIElEQktleVJhbmdlLm9ubHkoW3RvcGljTmFtZSwgZnJvbV0pO1xuICAgICAgY29uc3QgdHJ4ID0gdGhpcy5kYi50cmFuc2FjdGlvbihbJ21lc3NhZ2UnXSwgJ3JlYWR3cml0ZScpO1xuICAgICAgdHJ4Lm9uc3VjY2VzcyA9IChldmVudCkgPT4ge1xuICAgICAgICByZXNvbHZlKGV2ZW50LnRhcmdldC5yZXN1bHQpO1xuICAgICAgfTtcbiAgICAgIHRyeC5vbmVycm9yID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuI2xvZ2dlcignUENhY2hlJywgJ3JlbU1lc3NhZ2VzJywgZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgICAgcmVqZWN0KGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICB9O1xuICAgICAgdHJ4Lm9iamVjdFN0b3JlKCdtZXNzYWdlJykuZGVsZXRlKHJhbmdlKTtcbiAgICAgIHRyeC5jb21taXQoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSBtZXNzYWdlcyBmcm9tIHBlcnNpc3RlbnQgc3RvcmUuXG4gICAqIEBtZW1iZXJPZiBEQlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWNOYW1lIC0gbmFtZSBvZiB0aGUgdG9waWMgdG8gcmV0cmlldmUgbWVzc2FnZXMgZnJvbS5cbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgdG8gY2FsbCBmb3IgZWFjaCByZXRyaWV2ZWQgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IHF1ZXJ5IC0gcGFyYW1ldGVycyBvZiB0aGUgbWVzc2FnZSByYW5nZSB0byByZXRyaWV2ZS5cbiAgICogQHBhcmFtIHtudW1iZXI9fSBxdWVyeS5zaW5jZSAtIHRoZSBsZWFzdCBtZXNzYWdlIElEIHRvIHJldHJpZXZlIChpbmNsdXNpdmUpLlxuICAgKiBAcGFyYW0ge251bWJlcj19IHF1ZXJ5LmJlZm9yZSAtIHRoZSBncmVhdGVzdCBtZXNzYWdlIElEIHRvIHJldHJpZXZlIChleGNsdXNpdmUpLlxuICAgKiBAcGFyYW0ge251bWJlcj19IHF1ZXJ5LmxpbWl0IC0gdGhlIG1heGltdW0gbnVtYmVyIG9mIG1lc3NhZ2VzIHRvIHJldHJpZXZlLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBwcm9taXNlIHJlc29sdmVkL3JlamVjdGVkIG9uIG9wZXJhdGlvbiBjb21wbGV0aW9uLlxuICAgKi9cbiAgcmVhZE1lc3NhZ2VzKHRvcGljTmFtZSwgcXVlcnksIGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgaWYgKCF0aGlzLmlzUmVhZHkoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZGlzYWJsZWQgP1xuICAgICAgICBQcm9taXNlLnJlc29sdmUoW10pIDpcbiAgICAgICAgUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwibm90IGluaXRpYWxpemVkXCIpKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHF1ZXJ5ID0gcXVlcnkgfHwge307XG4gICAgICBjb25zdCBzaW5jZSA9IHF1ZXJ5LnNpbmNlID4gMCA/IHF1ZXJ5LnNpbmNlIDogMDtcbiAgICAgIGNvbnN0IGJlZm9yZSA9IHF1ZXJ5LmJlZm9yZSA+IDAgPyBxdWVyeS5iZWZvcmUgOiBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcbiAgICAgIGNvbnN0IGxpbWl0ID0gcXVlcnkubGltaXQgfCAwO1xuXG4gICAgICBjb25zdCByZXN1bHQgPSBbXTtcbiAgICAgIGNvbnN0IHJhbmdlID0gSURCS2V5UmFuZ2UuYm91bmQoW3RvcGljTmFtZSwgc2luY2VdLCBbdG9waWNOYW1lLCBiZWZvcmVdLCBmYWxzZSwgdHJ1ZSk7XG4gICAgICBjb25zdCB0cnggPSB0aGlzLmRiLnRyYW5zYWN0aW9uKFsnbWVzc2FnZSddKTtcbiAgICAgIHRyeC5vbmVycm9yID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuI2xvZ2dlcignUENhY2hlJywgJ3JlYWRNZXNzYWdlcycsIGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICAgIHJlamVjdChldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgfTtcbiAgICAgIC8vIEl0ZXJhdGUgaW4gZGVzY2VuZGluZyBvcmRlci5cbiAgICAgIHRyeC5vYmplY3RTdG9yZSgnbWVzc2FnZScpLm9wZW5DdXJzb3IocmFuZ2UsICdwcmV2Jykub25zdWNjZXNzID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIGNvbnN0IGN1cnNvciA9IGV2ZW50LnRhcmdldC5yZXN1bHQ7XG4gICAgICAgIGlmIChjdXJzb3IpIHtcbiAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwoY29udGV4dCwgY3Vyc29yLnZhbHVlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVzdWx0LnB1c2goY3Vyc29yLnZhbHVlKTtcbiAgICAgICAgICBpZiAobGltaXQgPD0gMCB8fCByZXN1bHQubGVuZ3RoIDwgbGltaXQpIHtcbiAgICAgICAgICAgIGN1cnNvci5jb250aW51ZSgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIFByaXZhdGUgbWV0aG9kcy5cblxuICAvLyBTZXJpYWxpemFibGUgdG9waWMgZmllbGRzLlxuICBzdGF0aWMgI3RvcGljX2ZpZWxkcyA9IFsnY3JlYXRlZCcsICd1cGRhdGVkJywgJ2RlbGV0ZWQnLCAncmVhZCcsICdyZWN2JywgJ3NlcScsICdjbGVhcicsICdkZWZhY3MnLFxuICAgICdjcmVkcycsICdwdWJsaWMnLCAndHJ1c3RlZCcsICdwcml2YXRlJywgJ3RvdWNoZWQnLCAnX2RlbGV0ZWQnXG4gIF07XG5cbiAgLy8gQ29weSBkYXRhIGZyb20gc3JjIHRvIFRvcGljIG9iamVjdC5cbiAgc3RhdGljICNkZXNlcmlhbGl6ZVRvcGljKHRvcGljLCBzcmMpIHtcbiAgICBEQi4jdG9waWNfZmllbGRzLmZvckVhY2goKGYpID0+IHtcbiAgICAgIGlmIChzcmMuaGFzT3duUHJvcGVydHkoZikpIHtcbiAgICAgICAgdG9waWNbZl0gPSBzcmNbZl07XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoc3JjLnRhZ3MpKSB7XG4gICAgICB0b3BpYy5fdGFncyA9IHNyYy50YWdzO1xuICAgIH1cbiAgICBpZiAoc3JjLmFjcykge1xuICAgICAgdG9waWMuc2V0QWNjZXNzTW9kZShzcmMuYWNzKTtcbiAgICB9XG4gICAgdG9waWMuc2VxIHw9IDA7XG4gICAgdG9waWMucmVhZCB8PSAwO1xuICAgIHRvcGljLnVucmVhZCA9IE1hdGgubWF4KDAsIHRvcGljLnNlcSAtIHRvcGljLnJlYWQpO1xuICB9XG5cbiAgLy8gQ29weSB2YWx1ZXMgZnJvbSAnc3JjJyB0byAnZHN0Jy4gQWxsb2NhdGUgZHN0IGlmIGl0J3MgbnVsbCBvciB1bmRlZmluZWQuXG4gIHN0YXRpYyAjc2VyaWFsaXplVG9waWMoZHN0LCBzcmMpIHtcbiAgICBjb25zdCByZXMgPSBkc3QgfHwge1xuICAgICAgbmFtZTogc3JjLm5hbWVcbiAgICB9O1xuICAgIERCLiN0b3BpY19maWVsZHMuZm9yRWFjaCgoZikgPT4ge1xuICAgICAgaWYgKHNyYy5oYXNPd25Qcm9wZXJ0eShmKSkge1xuICAgICAgICByZXNbZl0gPSBzcmNbZl07XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoc3JjLl90YWdzKSkge1xuICAgICAgcmVzLnRhZ3MgPSBzcmMuX3RhZ3M7XG4gICAgfVxuICAgIGlmIChzcmMuYWNzKSB7XG4gICAgICByZXMuYWNzID0gc3JjLmdldEFjY2Vzc01vZGUoKS5qc29uSGVscGVyKCk7XG4gICAgfVxuICAgIHJldHVybiByZXM7XG4gIH1cblxuICBzdGF0aWMgI3NlcmlhbGl6ZVN1YnNjcmlwdGlvbihkc3QsIHRvcGljTmFtZSwgdWlkLCBzdWIpIHtcbiAgICBjb25zdCBmaWVsZHMgPSBbJ3VwZGF0ZWQnLCAnbW9kZScsICdyZWFkJywgJ3JlY3YnLCAnY2xlYXInLCAnbGFzdFNlZW4nLCAndXNlckFnZW50J107XG4gICAgY29uc3QgcmVzID0gZHN0IHx8IHtcbiAgICAgIHRvcGljOiB0b3BpY05hbWUsXG4gICAgICB1aWQ6IHVpZFxuICAgIH07XG5cbiAgICBmaWVsZHMuZm9yRWFjaCgoZikgPT4ge1xuICAgICAgaWYgKHN1Yi5oYXNPd25Qcm9wZXJ0eShmKSkge1xuICAgICAgICByZXNbZl0gPSBzdWJbZl07XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVzO1xuICB9XG5cbiAgc3RhdGljICNzZXJpYWxpemVNZXNzYWdlKGRzdCwgbXNnKSB7XG4gICAgLy8gU2VyaWFsaXphYmxlIGZpZWxkcy5cbiAgICBjb25zdCBmaWVsZHMgPSBbJ3RvcGljJywgJ3NlcScsICd0cycsICdfc3RhdHVzJywgJ2Zyb20nLCAnaGVhZCcsICdjb250ZW50J107XG4gICAgY29uc3QgcmVzID0gZHN0IHx8IHt9O1xuICAgIGZpZWxkcy5mb3JFYWNoKChmKSA9PiB7XG4gICAgICBpZiAobXNnLmhhc093blByb3BlcnR5KGYpKSB7XG4gICAgICAgIHJlc1tmXSA9IG1zZ1tmXTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcmVzO1xuICB9XG5cbiAgLyoqXG4gICAqIFRvIHVzZSBEQiBpbiBhIG5vbiBicm93c2VyIGNvbnRleHQsIHN1cHBseSBpbmRleGVkREIgcHJvdmlkZXIuXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlcm9mIERCXG4gICAqIEBwYXJhbSBpZGJQcm92aWRlciBpbmRleGVkREIgcHJvdmlkZXIsIGUuZy4gZm9yIG5vZGUgPGNvZGU+cmVxdWlyZSgnZmFrZS1pbmRleGVkZGInKTwvY29kZT4uXG4gICAqL1xuICBzdGF0aWMgc2V0RGF0YWJhc2VQcm92aWRlcihpZGJQcm92aWRlcikge1xuICAgIElEQlByb3ZpZGVyID0gaWRiUHJvdmlkZXI7XG4gIH1cbn1cbiIsIi8qKlxuICogQGNvcHlyaWdodCAyMDE1LTIwMjIgVGlub2RlIExMQy5cbiAqIEBzdW1tYXJ5IE1pbmltYWxseSByaWNoIHRleHQgcmVwcmVzZW50YXRpb24gYW5kIGZvcm1hdHRpbmcgZm9yIFRpbm9kZS5cbiAqIEBsaWNlbnNlIEFwYWNoZSAyLjBcbiAqXG4gKiBAZmlsZSBCYXNpYyBwYXJzZXIgYW5kIGZvcm1hdHRlciBmb3IgdmVyeSBzaW1wbGUgdGV4dCBtYXJrdXAuIE1vc3RseSB0YXJnZXRlZCBhdFxuICogbW9iaWxlIHVzZSBjYXNlcyBzaW1pbGFyIHRvIFRlbGVncmFtLCBXaGF0c0FwcCwgYW5kIEZCIE1lc3Nlbmdlci5cbiAqXG4gKiA8cD5TdXBwb3J0cyBjb252ZXJzaW9uIG9mIHVzZXIga2V5Ym9hcmQgaW5wdXQgdG8gZm9ybWF0dGVkIHRleHQ6PC9wPlxuICogPHVsPlxuICogICA8bGk+KmFiYyogJnJhcnI7IDxiPmFiYzwvYj48L2xpPlxuICogICA8bGk+X2FiY18gJnJhcnI7IDxpPmFiYzwvaT48L2xpPlxuICogICA8bGk+fmFiY34gJnJhcnI7IDxkZWw+YWJjPC9kZWw+PC9saT5cbiAqICAgPGxpPmBhYmNgICZyYXJyOyA8dHQ+YWJjPC90dD48L2xpPlxuICogPC91bD5cbiAqIEFsc28gc3VwcG9ydHMgZm9ybXMgYW5kIGJ1dHRvbnMuXG4gKlxuICogTmVzdGVkIGZvcm1hdHRpbmcgaXMgc3VwcG9ydGVkLCBlLmcuICphYmMgX2RlZl8qIC0+IDxiPmFiYyA8aT5kZWY8L2k+PC9iPlxuICogVVJMcywgQG1lbnRpb25zLCBhbmQgI2hhc2h0YWdzIGFyZSBleHRyYWN0ZWQgYW5kIGNvbnZlcnRlZCBpbnRvIGxpbmtzLlxuICogRm9ybXMgYW5kIGJ1dHRvbnMgY2FuIGJlIGFkZGVkIHByb2NlZHVyYWxseS5cbiAqIEpTT04gZGF0YSByZXByZXNlbnRhdGlvbiBpcyBpbnNwaXJlZCBieSBEcmFmdC5qcyByYXcgZm9ybWF0dGluZy5cbiAqXG4gKlxuICogQGV4YW1wbGVcbiAqIFRleHQ6XG4gKiA8cHJlPlxuICogICAgIHRoaXMgaXMgKmJvbGQqLCBgY29kZWAgYW5kIF9pdGFsaWNfLCB+c3RyaWtlflxuICogICAgIGNvbWJpbmVkICpib2xkIGFuZCBfaXRhbGljXypcbiAqICAgICBhbiB1cmw6IGh0dHBzOi8vd3d3LmV4YW1wbGUuY29tL2FiYyNmcmFnbWVudCBhbmQgYW5vdGhlciBfd3d3LnRpbm9kZS5jb19cbiAqICAgICB0aGlzIGlzIGEgQG1lbnRpb24gYW5kIGEgI2hhc2h0YWcgaW4gYSBzdHJpbmdcbiAqICAgICBzZWNvbmQgI2hhc2h0YWdcbiAqIDwvcHJlPlxuICpcbiAqICBTYW1wbGUgSlNPTiByZXByZXNlbnRhdGlvbiBvZiB0aGUgdGV4dCBhYm92ZTpcbiAqICB7XG4gKiAgICAgXCJ0eHRcIjogXCJ0aGlzIGlzIGJvbGQsIGNvZGUgYW5kIGl0YWxpYywgc3RyaWtlIGNvbWJpbmVkIGJvbGQgYW5kIGl0YWxpYyBhbiB1cmw6IGh0dHBzOi8vd3d3LmV4YW1wbGUuY29tL2FiYyNmcmFnbWVudCBcIiArXG4gKiAgICAgICAgICAgICBcImFuZCBhbm90aGVyIHd3dy50aW5vZGUuY28gdGhpcyBpcyBhIEBtZW50aW9uIGFuZCBhICNoYXNodGFnIGluIGEgc3RyaW5nIHNlY29uZCAjaGFzaHRhZ1wiLFxuICogICAgIFwiZm10XCI6IFtcbiAqICAgICAgICAgeyBcImF0XCI6OCwgXCJsZW5cIjo0LFwidHBcIjpcIlNUXCIgfSx7IFwiYXRcIjoxNCwgXCJsZW5cIjo0LCBcInRwXCI6XCJDT1wiIH0seyBcImF0XCI6MjMsIFwibGVuXCI6NiwgXCJ0cFwiOlwiRU1cIn0sXG4gKiAgICAgICAgIHsgXCJhdFwiOjMxLCBcImxlblwiOjYsIFwidHBcIjpcIkRMXCIgfSx7IFwidHBcIjpcIkJSXCIsIFwibGVuXCI6MSwgXCJhdFwiOjM3IH0seyBcImF0XCI6NTYsIFwibGVuXCI6NiwgXCJ0cFwiOlwiRU1cIiB9LFxuICogICAgICAgICB7IFwiYXRcIjo0NywgXCJsZW5cIjoxNSwgXCJ0cFwiOlwiU1RcIiB9LHsgXCJ0cFwiOlwiQlJcIiwgXCJsZW5cIjoxLCBcImF0XCI6NjIgfSx7IFwiYXRcIjoxMjAsIFwibGVuXCI6MTMsIFwidHBcIjpcIkVNXCIgfSxcbiAqICAgICAgICAgeyBcImF0XCI6NzEsIFwibGVuXCI6MzYsIFwia2V5XCI6MCB9LHsgXCJhdFwiOjEyMCwgXCJsZW5cIjoxMywgXCJrZXlcIjoxIH0seyBcInRwXCI6XCJCUlwiLCBcImxlblwiOjEsIFwiYXRcIjoxMzMgfSxcbiAqICAgICAgICAgeyBcImF0XCI6MTQ0LCBcImxlblwiOjgsIFwia2V5XCI6MiB9LHsgXCJhdFwiOjE1OSwgXCJsZW5cIjo4LCBcImtleVwiOjMgfSx7IFwidHBcIjpcIkJSXCIsIFwibGVuXCI6MSwgXCJhdFwiOjE3OSB9LFxuICogICAgICAgICB7IFwiYXRcIjoxODcsIFwibGVuXCI6OCwgXCJrZXlcIjozIH0seyBcInRwXCI6XCJCUlwiLCBcImxlblwiOjEsIFwiYXRcIjoxOTUgfVxuICogICAgIF0sXG4gKiAgICAgXCJlbnRcIjogW1xuICogICAgICAgICB7IFwidHBcIjpcIkxOXCIsIFwiZGF0YVwiOnsgXCJ1cmxcIjpcImh0dHBzOi8vd3d3LmV4YW1wbGUuY29tL2FiYyNmcmFnbWVudFwiIH0gfSxcbiAqICAgICAgICAgeyBcInRwXCI6XCJMTlwiLCBcImRhdGFcIjp7IFwidXJsXCI6XCJodHRwOi8vd3d3LnRpbm9kZS5jb1wiIH0gfSxcbiAqICAgICAgICAgeyBcInRwXCI6XCJNTlwiLCBcImRhdGFcIjp7IFwidmFsXCI6XCJtZW50aW9uXCIgfSB9LFxuICogICAgICAgICB7IFwidHBcIjpcIkhUXCIsIFwiZGF0YVwiOnsgXCJ2YWxcIjpcImhhc2h0YWdcIiB9IH1cbiAqICAgICBdXG4gKiAgfVxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuLy8gTk9URSBUTyBERVZFTE9QRVJTOlxuLy8gTG9jYWxpemFibGUgc3RyaW5ncyBzaG91bGQgYmUgZG91YmxlIHF1b3RlZCBcItGB0YLRgNC+0LrQsCDQvdCwINC00YDRg9Cz0L7QvCDRj9C30YvQutC1XCIsXG4vLyBub24tbG9jYWxpemFibGUgc3RyaW5ncyBzaG91bGQgYmUgc2luZ2xlIHF1b3RlZCAnbm9uLWxvY2FsaXplZCcuXG5cbmNvbnN0IE1BWF9GT1JNX0VMRU1FTlRTID0gODtcbmNvbnN0IE1BWF9QUkVWSUVXX0FUVEFDSE1FTlRTID0gMztcbmNvbnN0IE1BWF9QUkVWSUVXX0RBVEFfU0laRSA9IDY0O1xuY29uc3QgSlNPTl9NSU1FX1RZUEUgPSAnYXBwbGljYXRpb24vanNvbic7XG5jb25zdCBEUkFGVFlfTUlNRV9UWVBFID0gJ3RleHQveC1kcmFmdHknO1xuY29uc3QgQUxMT1dFRF9FTlRfRklFTERTID0gWydhY3QnLCAnaGVpZ2h0JywgJ2R1cmF0aW9uJywgJ21pbWUnLCAnbmFtZScsICdwcmV2aWV3JywgJ3JlZicsICdzaXplJywgJ3VybCcsICd2YWwnLCAnd2lkdGgnXTtcblxuLy8gUmVndWxhciBleHByZXNzaW9ucyBmb3IgcGFyc2luZyBpbmxpbmUgZm9ybWF0cy4gSmF2YXNjcmlwdCBkb2VzIG5vdCBzdXBwb3J0IGxvb2tiZWhpbmQsXG4vLyBzbyBpdCdzIGEgYml0IG1lc3N5LlxuY29uc3QgSU5MSU5FX1NUWUxFUyA9IFtcbiAgLy8gU3Ryb25nID0gYm9sZCwgKmJvbGQgdGV4dCpcbiAge1xuICAgIG5hbWU6ICdTVCcsXG4gICAgc3RhcnQ6IC8oPzpefFtcXFdfXSkoXFwqKVteXFxzKl0vLFxuICAgIGVuZDogL1teXFxzKl0oXFwqKSg/PSR8W1xcV19dKS9cbiAgfSxcbiAgLy8gRW1waGVzaXplZCA9IGl0YWxpYywgX2l0YWxpYyB0ZXh0X1xuICB7XG4gICAgbmFtZTogJ0VNJyxcbiAgICBzdGFydDogLyg/Ol58XFxXKShfKVteXFxzX10vLFxuICAgIGVuZDogL1teXFxzX10oXykoPz0kfFxcVykvXG4gIH0sXG4gIC8vIERlbGV0ZWQsIH5zdHJpa2UgdGhpcyB0aG91Z2h+XG4gIHtcbiAgICBuYW1lOiAnREwnLFxuICAgIHN0YXJ0OiAvKD86XnxbXFxXX10pKH4pW15cXHN+XS8sXG4gICAgZW5kOiAvW15cXHN+XSh+KSg/PSR8W1xcV19dKS9cbiAgfSxcbiAgLy8gQ29kZSBibG9jayBgdGhpcyBpcyBtb25vc3BhY2VgXG4gIHtcbiAgICBuYW1lOiAnQ08nLFxuICAgIHN0YXJ0OiAvKD86XnxcXFcpKGApW15gXS8sXG4gICAgZW5kOiAvW15gXShgKSg/PSR8XFxXKS9cbiAgfVxuXTtcblxuLy8gUmVsYXRpdmUgd2VpZ2h0cyBvZiBmb3JtYXR0aW5nIHNwYW5zLiBHcmVhdGVyIGluZGV4IGluIGFycmF5IG1lYW5zIGdyZWF0ZXIgd2VpZ2h0LlxuY29uc3QgRk1UX1dFSUdIVCA9IFsnUVEnXTtcblxuLy8gUmVnRXhwcyBmb3IgZW50aXR5IGV4dHJhY3Rpb24gKFJGID0gcmVmZXJlbmNlKVxuY29uc3QgRU5USVRZX1RZUEVTID0gW1xuICAvLyBVUkxzXG4gIHtcbiAgICBuYW1lOiAnTE4nLFxuICAgIGRhdGFOYW1lOiAndXJsJyxcbiAgICBwYWNrOiBmdW5jdGlvbih2YWwpIHtcbiAgICAgIC8vIENoZWNrIGlmIHRoZSBwcm90b2NvbCBpcyBzcGVjaWZpZWQsIGlmIG5vdCB1c2UgaHR0cFxuICAgICAgaWYgKCEvXlthLXpdKzpcXC9cXC8vaS50ZXN0KHZhbCkpIHtcbiAgICAgICAgdmFsID0gJ2h0dHA6Ly8nICsgdmFsO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdXJsOiB2YWxcbiAgICAgIH07XG4gICAgfSxcbiAgICByZTogLyg/Oig/Omh0dHBzP3xmdHApOlxcL1xcL3x3d3dcXC58ZnRwXFwuKVstQS1aMC05KyZAI1xcLyU9fl98JD8hOiwuXSpbQS1aMC05KyZAI1xcLyU9fl98JF0vaWdcbiAgfSxcbiAgLy8gTWVudGlvbnMgQHVzZXIgKG11c3QgYmUgMiBvciBtb3JlIGNoYXJhY3RlcnMpXG4gIHtcbiAgICBuYW1lOiAnTU4nLFxuICAgIGRhdGFOYW1lOiAndmFsJyxcbiAgICBwYWNrOiBmdW5jdGlvbih2YWwpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHZhbDogdmFsLnNsaWNlKDEpXG4gICAgICB9O1xuICAgIH0sXG4gICAgcmU6IC9cXEJAKFtcXHB7TH1cXHB7Tn1dWy5fXFxwe0x9XFxwe059XSpbXFxwe0x9XFxwe059XSkvdWdcbiAgfSxcbiAgLy8gSGFzaHRhZ3MgI2hhc2h0YWcsIGxpa2UgbWV0aW9uIDIgb3IgbW9yZSBjaGFyYWN0ZXJzLlxuICB7XG4gICAgbmFtZTogJ0hUJyxcbiAgICBkYXRhTmFtZTogJ3ZhbCcsXG4gICAgcGFjazogZnVuY3Rpb24odmFsKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB2YWw6IHZhbC5zbGljZSgxKVxuICAgICAgfTtcbiAgICB9LFxuICAgIHJlOiAvXFxCIyhbXFxwe0x9XFxwe059XVsuX1xccHtMfVxccHtOfV0qW1xccHtMfVxccHtOfV0pL3VnXG4gIH1cbl07XG5cbi8vIEhUTUwgdGFnIG5hbWUgc3VnZ2VzdGlvbnNcbmNvbnN0IEhUTUxfVEFHUyA9IHtcbiAgQVU6IHtcbiAgICBuYW1lOiAnYXVkaW8nLFxuICAgIGlzVm9pZDogZmFsc2VcbiAgfSxcbiAgQk46IHtcbiAgICBuYW1lOiAnYnV0dG9uJyxcbiAgICBpc1ZvaWQ6IGZhbHNlXG4gIH0sXG4gIEJSOiB7XG4gICAgbmFtZTogJ2JyJyxcbiAgICBpc1ZvaWQ6IHRydWVcbiAgfSxcbiAgQ086IHtcbiAgICBuYW1lOiAndHQnLFxuICAgIGlzVm9pZDogZmFsc2VcbiAgfSxcbiAgREw6IHtcbiAgICBuYW1lOiAnZGVsJyxcbiAgICBpc1ZvaWQ6IGZhbHNlXG4gIH0sXG4gIEVNOiB7XG4gICAgbmFtZTogJ2knLFxuICAgIGlzVm9pZDogZmFsc2VcbiAgfSxcbiAgRVg6IHtcbiAgICBuYW1lOiAnJyxcbiAgICBpc1ZvaWQ6IHRydWVcbiAgfSxcbiAgRk06IHtcbiAgICBuYW1lOiAnZGl2JyxcbiAgICBpc1ZvaWQ6IGZhbHNlXG4gIH0sXG4gIEhEOiB7XG4gICAgbmFtZTogJycsXG4gICAgaXNWb2lkOiBmYWxzZVxuICB9LFxuICBITDoge1xuICAgIG5hbWU6ICdzcGFuJyxcbiAgICBpc1ZvaWQ6IGZhbHNlXG4gIH0sXG4gIEhUOiB7XG4gICAgbmFtZTogJ2EnLFxuICAgIGlzVm9pZDogZmFsc2VcbiAgfSxcbiAgSU06IHtcbiAgICBuYW1lOiAnaW1nJyxcbiAgICBpc1ZvaWQ6IGZhbHNlXG4gIH0sXG4gIExOOiB7XG4gICAgbmFtZTogJ2EnLFxuICAgIGlzVm9pZDogZmFsc2VcbiAgfSxcbiAgTU46IHtcbiAgICBuYW1lOiAnYScsXG4gICAgaXNWb2lkOiBmYWxzZVxuICB9LFxuICBSVzoge1xuICAgIG5hbWU6ICdkaXYnLFxuICAgIGlzVm9pZDogZmFsc2UsXG4gIH0sXG4gIFFROiB7XG4gICAgbmFtZTogJ2RpdicsXG4gICAgaXNWb2lkOiBmYWxzZVxuICB9LFxuICBTVDoge1xuICAgIG5hbWU6ICdiJyxcbiAgICBpc1ZvaWQ6IGZhbHNlXG4gIH0sXG59O1xuXG4vLyBDb252ZXJ0IGJhc2U2NC1lbmNvZGVkIHN0cmluZyBpbnRvIEJsb2IuXG5mdW5jdGlvbiBiYXNlNjR0b09iamVjdFVybChiNjQsIGNvbnRlbnRUeXBlLCBsb2dnZXIpIHtcbiAgaWYgKCFiNjQpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHRyeSB7XG4gICAgY29uc3QgYmluID0gYXRvYihiNjQpO1xuICAgIGNvbnN0IGxlbmd0aCA9IGJpbi5sZW5ndGg7XG4gICAgY29uc3QgYnVmID0gbmV3IEFycmF5QnVmZmVyKGxlbmd0aCk7XG4gICAgY29uc3QgYXJyID0gbmV3IFVpbnQ4QXJyYXkoYnVmKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBhcnJbaV0gPSBiaW4uY2hhckNvZGVBdChpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gVVJMLmNyZWF0ZU9iamVjdFVSTChuZXcgQmxvYihbYnVmXSwge1xuICAgICAgdHlwZTogY29udGVudFR5cGVcbiAgICB9KSk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGlmIChsb2dnZXIpIHtcbiAgICAgIGxvZ2dlcihcIkRyYWZ0eTogZmFpbGVkIHRvIGNvbnZlcnQgb2JqZWN0LlwiLCBlcnIubWVzc2FnZSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG5cbmZ1bmN0aW9uIGJhc2U2NHRvRGF0YVVybChiNjQsIGNvbnRlbnRUeXBlKSB7XG4gIGlmICghYjY0KSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgY29udGVudFR5cGUgPSBjb250ZW50VHlwZSB8fCAnaW1hZ2UvanBlZyc7XG4gIHJldHVybiAnZGF0YTonICsgY29udGVudFR5cGUgKyAnO2Jhc2U2NCwnICsgYjY0O1xufVxuXG4vLyBIZWxwZXJzIGZvciBjb252ZXJ0aW5nIERyYWZ0eSB0byBIVE1MLlxuY29uc3QgREVDT1JBVE9SUyA9IHtcbiAgLy8gVmlzaWFsIHN0eWxlc1xuICBTVDoge1xuICAgIG9wZW46IF8gPT4gJzxiPicsXG4gICAgY2xvc2U6IF8gPT4gJzwvYj4nXG4gIH0sXG4gIEVNOiB7XG4gICAgb3BlbjogXyA9PiAnPGk+JyxcbiAgICBjbG9zZTogXyA9PiAnPC9pPidcbiAgfSxcbiAgREw6IHtcbiAgICBvcGVuOiBfID0+ICc8ZGVsPicsXG4gICAgY2xvc2U6IF8gPT4gJzwvZGVsPidcbiAgfSxcbiAgQ086IHtcbiAgICBvcGVuOiBfID0+ICc8dHQ+JyxcbiAgICBjbG9zZTogXyA9PiAnPC90dD4nXG4gIH0sXG4gIC8vIExpbmUgYnJlYWtcbiAgQlI6IHtcbiAgICBvcGVuOiBfID0+ICc8YnIvPicsXG4gICAgY2xvc2U6IF8gPT4gJydcbiAgfSxcbiAgLy8gSGlkZGVuIGVsZW1lbnRcbiAgSEQ6IHtcbiAgICBvcGVuOiBfID0+ICcnLFxuICAgIGNsb3NlOiBfID0+ICcnXG4gIH0sXG4gIC8vIEhpZ2hsaWdodGVkIGVsZW1lbnQuXG4gIEhMOiB7XG4gICAgb3BlbjogXyA9PiAnPHNwYW4gc3R5bGU9XCJjb2xvcjp0ZWFsXCI+JyxcbiAgICBjbG9zZTogXyA9PiAnPC9zcGFuPidcbiAgfSxcbiAgLy8gTGluayAoVVJMKVxuICBMTjoge1xuICAgIG9wZW46IChkYXRhKSA9PiB7XG4gICAgICByZXR1cm4gJzxhIGhyZWY9XCInICsgZGF0YS51cmwgKyAnXCI+JztcbiAgICB9LFxuICAgIGNsb3NlOiBfID0+ICc8L2E+JyxcbiAgICBwcm9wczogKGRhdGEpID0+IHtcbiAgICAgIHJldHVybiBkYXRhID8ge1xuICAgICAgICBocmVmOiBkYXRhLnVybCxcbiAgICAgICAgdGFyZ2V0OiAnX2JsYW5rJ1xuICAgICAgfSA6IG51bGw7XG4gICAgfSxcbiAgfSxcbiAgLy8gTWVudGlvblxuICBNTjoge1xuICAgIG9wZW46IChkYXRhKSA9PiB7XG4gICAgICByZXR1cm4gJzxhIGhyZWY9XCIjJyArIGRhdGEudmFsICsgJ1wiPic7XG4gICAgfSxcbiAgICBjbG9zZTogXyA9PiAnPC9hPicsXG4gICAgcHJvcHM6IChkYXRhKSA9PiB7XG4gICAgICByZXR1cm4gZGF0YSA/IHtcbiAgICAgICAgaWQ6IGRhdGEudmFsXG4gICAgICB9IDogbnVsbDtcbiAgICB9LFxuICB9LFxuICAvLyBIYXNodGFnXG4gIEhUOiB7XG4gICAgb3BlbjogKGRhdGEpID0+IHtcbiAgICAgIHJldHVybiAnPGEgaHJlZj1cIiMnICsgZGF0YS52YWwgKyAnXCI+JztcbiAgICB9LFxuICAgIGNsb3NlOiBfID0+ICc8L2E+JyxcbiAgICBwcm9wczogKGRhdGEpID0+IHtcbiAgICAgIHJldHVybiBkYXRhID8ge1xuICAgICAgICBpZDogZGF0YS52YWxcbiAgICAgIH0gOiBudWxsO1xuICAgIH0sXG4gIH0sXG4gIC8vIEJ1dHRvblxuICBCTjoge1xuICAgIG9wZW46IF8gPT4gJzxidXR0b24+JyxcbiAgICBjbG9zZTogXyA9PiAnPC9idXR0b24+JyxcbiAgICBwcm9wczogKGRhdGEpID0+IHtcbiAgICAgIHJldHVybiBkYXRhID8ge1xuICAgICAgICAnZGF0YS1hY3QnOiBkYXRhLmFjdCxcbiAgICAgICAgJ2RhdGEtdmFsJzogZGF0YS52YWwsXG4gICAgICAgICdkYXRhLW5hbWUnOiBkYXRhLm5hbWUsXG4gICAgICAgICdkYXRhLXJlZic6IGRhdGEucmVmXG4gICAgICB9IDogbnVsbDtcbiAgICB9LFxuICB9LFxuICAvLyBBdWRpbyByZWNvcmRpbmdcbiAgQVU6IHtcbiAgICBvcGVuOiAoZGF0YSkgPT4ge1xuICAgICAgY29uc3QgdXJsID0gZGF0YS5yZWYgfHwgYmFzZTY0dG9PYmplY3RVcmwoZGF0YS52YWwsIGRhdGEubWltZSwgRHJhZnR5LmxvZ2dlcik7XG4gICAgICByZXR1cm4gJzxhdWRpbyBjb250cm9scyBzcmM9XCInICsgdXJsICsgJ1wiPic7XG4gICAgfSxcbiAgICBjbG9zZTogXyA9PiAnPC9hdWRpbz4nLFxuICAgIHByb3BzOiAoZGF0YSkgPT4ge1xuICAgICAgaWYgKCFkYXRhKSByZXR1cm4gbnVsbDtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC8vIEVtYmVkZGVkIGRhdGEgb3IgZXh0ZXJuYWwgbGluay5cbiAgICAgICAgc3JjOiBkYXRhLnJlZiB8fCBiYXNlNjR0b09iamVjdFVybChkYXRhLnZhbCwgZGF0YS5taW1lLCBEcmFmdHkubG9nZ2VyKSxcbiAgICAgICAgJ2RhdGEtcHJlbG9hZCc6IGRhdGEucmVmID8gJ21ldGFkYXRhJyA6ICdhdXRvJyxcbiAgICAgICAgJ2RhdGEtZHVyYXRpb24nOiBkYXRhLmR1cmF0aW9uLFxuICAgICAgICAnZGF0YS1uYW1lJzogZGF0YS5uYW1lLFxuICAgICAgICAnZGF0YS1zaXplJzogZGF0YS52YWwgPyAoKGRhdGEudmFsLmxlbmd0aCAqIDAuNzUpIHwgMCkgOiAoZGF0YS5zaXplIHwgMCksXG4gICAgICAgICdkYXRhLW1pbWUnOiBkYXRhLm1pbWUsXG4gICAgICB9O1xuICAgIH1cbiAgfSxcbiAgLy8gSW1hZ2VcbiAgSU06IHtcbiAgICBvcGVuOiAoZGF0YSkgPT4ge1xuICAgICAgLy8gRG9uJ3QgdXNlIGRhdGEucmVmIGZvciBwcmV2aWV3OiBpdCdzIGEgc2VjdXJpdHkgcmlzay5cbiAgICAgIGNvbnN0IHRtcFByZXZpZXdVcmwgPSBiYXNlNjR0b0RhdGFVcmwoZGF0YS5fdGVtcFByZXZpZXcsIGRhdGEubWltZSk7XG4gICAgICBjb25zdCBwcmV2aWV3VXJsID0gYmFzZTY0dG9PYmplY3RVcmwoZGF0YS52YWwsIGRhdGEubWltZSwgRHJhZnR5LmxvZ2dlcik7XG4gICAgICBjb25zdCBkb3dubG9hZFVybCA9IGRhdGEucmVmIHx8IHByZXZpZXdVcmw7XG4gICAgICByZXR1cm4gKGRhdGEubmFtZSA/ICc8YSBocmVmPVwiJyArIGRvd25sb2FkVXJsICsgJ1wiIGRvd25sb2FkPVwiJyArIGRhdGEubmFtZSArICdcIj4nIDogJycpICtcbiAgICAgICAgJzxpbWcgc3JjPVwiJyArICh0bXBQcmV2aWV3VXJsIHx8IHByZXZpZXdVcmwpICsgJ1wiJyArXG4gICAgICAgIChkYXRhLndpZHRoID8gJyB3aWR0aD1cIicgKyBkYXRhLndpZHRoICsgJ1wiJyA6ICcnKSArXG4gICAgICAgIChkYXRhLmhlaWdodCA/ICcgaGVpZ2h0PVwiJyArIGRhdGEuaGVpZ2h0ICsgJ1wiJyA6ICcnKSArICcgYm9yZGVyPVwiMFwiIC8+JztcbiAgICB9LFxuICAgIGNsb3NlOiAoZGF0YSkgPT4ge1xuICAgICAgcmV0dXJuIChkYXRhLm5hbWUgPyAnPC9hPicgOiAnJyk7XG4gICAgfSxcbiAgICBwcm9wczogKGRhdGEpID0+IHtcbiAgICAgIGlmICghZGF0YSkgcmV0dXJuIG51bGw7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAvLyBUZW1wb3JhcnkgcHJldmlldywgb3IgcGVybWFuZW50IHByZXZpZXcsIG9yIGV4dGVybmFsIGxpbmsuXG4gICAgICAgIHNyYzogYmFzZTY0dG9EYXRhVXJsKGRhdGEuX3RlbXBQcmV2aWV3LCBkYXRhLm1pbWUpIHx8XG4gICAgICAgICAgZGF0YS5yZWYgfHwgYmFzZTY0dG9PYmplY3RVcmwoZGF0YS52YWwsIGRhdGEubWltZSwgRHJhZnR5LmxvZ2dlciksXG4gICAgICAgIHRpdGxlOiBkYXRhLm5hbWUsXG4gICAgICAgIGFsdDogZGF0YS5uYW1lLFxuICAgICAgICAnZGF0YS13aWR0aCc6IGRhdGEud2lkdGgsXG4gICAgICAgICdkYXRhLWhlaWdodCc6IGRhdGEuaGVpZ2h0LFxuICAgICAgICAnZGF0YS1uYW1lJzogZGF0YS5uYW1lLFxuICAgICAgICAnZGF0YS1zaXplJzogZGF0YS52YWwgPyAoKGRhdGEudmFsLmxlbmd0aCAqIDAuNzUpIHwgMCkgOiAoZGF0YS5zaXplIHwgMCksXG4gICAgICAgICdkYXRhLW1pbWUnOiBkYXRhLm1pbWUsXG4gICAgICB9O1xuICAgIH0sXG4gIH0sXG4gIC8vIEZvcm0gLSBzdHJ1Y3R1cmVkIGxheW91dCBvZiBlbGVtZW50cy5cbiAgRk06IHtcbiAgICBvcGVuOiBfID0+ICc8ZGl2PicsXG4gICAgY2xvc2U6IF8gPT4gJzwvZGl2PidcbiAgfSxcbiAgLy8gUm93OiBsb2dpYyBncm91cGluZyBvZiBlbGVtZW50c1xuICBSVzoge1xuICAgIG9wZW46IF8gPT4gJzxkaXY+JyxcbiAgICBjbG9zZTogXyA9PiAnPC9kaXY+J1xuICB9LFxuICAvLyBRdW90ZWQgYmxvY2suXG4gIFFROiB7XG4gICAgb3BlbjogXyA9PiAnPGRpdj4nLFxuICAgIGNsb3NlOiBfID0+ICc8L2Rpdj4nLFxuICAgIHByb3BzOiAoZGF0YSkgPT4ge1xuICAgICAgcmV0dXJuIGRhdGEgPyB7fSA6IG51bGw7XG4gICAgfSxcbiAgfVxufTtcblxuLyoqXG4gKiBUaGUgbWFpbiBvYmplY3Qgd2hpY2ggcGVyZm9ybXMgYWxsIHRoZSBmb3JtYXR0aW5nIGFjdGlvbnMuXG4gKiBAY2xhc3MgRHJhZnR5XG4gKiBAY29uc3RydWN0b3JcbiAqL1xuY29uc3QgRHJhZnR5ID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMudHh0ID0gJyc7XG4gIHRoaXMuZm10ID0gW107XG4gIHRoaXMuZW50ID0gW107XG59XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBEcmFmdHkgZG9jdW1lbnQgdG8gYSBwbGFpbiB0ZXh0IHN0cmluZy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gcGxhaW5UZXh0IC0gc3RyaW5nIHRvIHVzZSBhcyBEcmFmdHkgY29udGVudC5cbiAqXG4gKiBAcmV0dXJucyBuZXcgRHJhZnR5IGRvY3VtZW50IG9yIG51bGwgaXMgcGxhaW5UZXh0IGlzIG5vdCBhIHN0cmluZyBvciB1bmRlZmluZWQuXG4gKi9cbkRyYWZ0eS5pbml0ID0gZnVuY3Rpb24ocGxhaW5UZXh0KSB7XG4gIGlmICh0eXBlb2YgcGxhaW5UZXh0ID09ICd1bmRlZmluZWQnKSB7XG4gICAgcGxhaW5UZXh0ID0gJyc7XG4gIH0gZWxzZSBpZiAodHlwZW9mIHBsYWluVGV4dCAhPSAnc3RyaW5nJykge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICB0eHQ6IHBsYWluVGV4dFxuICB9O1xufVxuXG4vKipcbiAqIFBhcnNlIHBsYWluIHRleHQgaW50byBEcmFmdHkgZG9jdW1lbnQuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGNvbnRlbnQgLSBwbGFpbi10ZXh0IGNvbnRlbnQgdG8gcGFyc2UuXG4gKiBAcmV0dXJuIHtEcmFmdHl9IHBhcnNlZCBkb2N1bWVudCBvciBudWxsIGlmIHRoZSBzb3VyY2UgaXMgbm90IHBsYWluIHRleHQuXG4gKi9cbkRyYWZ0eS5wYXJzZSA9IGZ1bmN0aW9uKGNvbnRlbnQpIHtcbiAgLy8gTWFrZSBzdXJlIHdlIGFyZSBwYXJzaW5nIHN0cmluZ3Mgb25seS5cbiAgaWYgKHR5cGVvZiBjb250ZW50ICE9ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvLyBTcGxpdCB0ZXh0IGludG8gbGluZXMuIEl0IG1ha2VzIGZ1cnRoZXIgcHJvY2Vzc2luZyBlYXNpZXIuXG4gIGNvbnN0IGxpbmVzID0gY29udGVudC5zcGxpdCgvXFxyP1xcbi8pO1xuXG4gIC8vIEhvbGRzIGVudGl0aWVzIHJlZmVyZW5jZWQgZnJvbSB0ZXh0XG4gIGNvbnN0IGVudGl0eU1hcCA9IFtdO1xuICBjb25zdCBlbnRpdHlJbmRleCA9IHt9O1xuXG4gIC8vIFByb2Nlc3NpbmcgbGluZXMgb25lIGJ5IG9uZSwgaG9sZCBpbnRlcm1lZGlhdGUgcmVzdWx0IGluIGJseC5cbiAgY29uc3QgYmx4ID0gW107XG4gIGxpbmVzLmZvckVhY2goKGxpbmUpID0+IHtcbiAgICBsZXQgc3BhbnMgPSBbXTtcbiAgICBsZXQgZW50aXRpZXM7XG5cbiAgICAvLyBGaW5kIGZvcm1hdHRlZCBzcGFucyBpbiB0aGUgc3RyaW5nLlxuICAgIC8vIFRyeSB0byBtYXRjaCBlYWNoIHN0eWxlLlxuICAgIElOTElORV9TVFlMRVMuZm9yRWFjaCgodGFnKSA9PiB7XG4gICAgICAvLyBFYWNoIHN0eWxlIGNvdWxkIGJlIG1hdGNoZWQgbXVsdGlwbGUgdGltZXMuXG4gICAgICBzcGFucyA9IHNwYW5zLmNvbmNhdChzcGFubmlmeShsaW5lLCB0YWcuc3RhcnQsIHRhZy5lbmQsIHRhZy5uYW1lKSk7XG4gICAgfSk7XG5cbiAgICBsZXQgYmxvY2s7XG4gICAgaWYgKHNwYW5zLmxlbmd0aCA9PSAwKSB7XG4gICAgICBibG9jayA9IHtcbiAgICAgICAgdHh0OiBsaW5lXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBTb3J0IHNwYW5zIGJ5IHN0eWxlIG9jY3VyZW5jZSBlYXJseSAtPiBsYXRlLCB0aGVuIGJ5IGxlbmd0aDogZmlyc3QgbG9uZyB0aGVuIHNob3J0LlxuICAgICAgc3BhbnMuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICBjb25zdCBkaWZmID0gYS5hdCAtIGIuYXQ7XG4gICAgICAgIHJldHVybiBkaWZmICE9IDAgPyBkaWZmIDogYi5lbmQgLSBhLmVuZDtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBDb252ZXJ0IGFuIGFycmF5IG9mIHBvc3NpYmx5IG92ZXJsYXBwaW5nIHNwYW5zIGludG8gYSB0cmVlLlxuICAgICAgc3BhbnMgPSB0b1NwYW5UcmVlKHNwYW5zKTtcblxuICAgICAgLy8gQnVpbGQgYSB0cmVlIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBlbnRpcmUgc3RyaW5nLCBub3RcbiAgICAgIC8vIGp1c3QgdGhlIGZvcm1hdHRlZCBwYXJ0cy5cbiAgICAgIGNvbnN0IGNodW5rcyA9IGNodW5raWZ5KGxpbmUsIDAsIGxpbmUubGVuZ3RoLCBzcGFucyk7XG5cbiAgICAgIGNvbnN0IGRyYWZ0eSA9IGRyYWZ0aWZ5KGNodW5rcywgMCk7XG5cbiAgICAgIGJsb2NrID0ge1xuICAgICAgICB0eHQ6IGRyYWZ0eS50eHQsXG4gICAgICAgIGZtdDogZHJhZnR5LmZtdFxuICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBFeHRyYWN0IGVudGl0aWVzIGZyb20gdGhlIGNsZWFuZWQgdXAgc3RyaW5nLlxuICAgIGVudGl0aWVzID0gZXh0cmFjdEVudGl0aWVzKGJsb2NrLnR4dCk7XG4gICAgaWYgKGVudGl0aWVzLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IHJhbmdlcyA9IFtdO1xuICAgICAgZm9yIChsZXQgaSBpbiBlbnRpdGllcykge1xuICAgICAgICAvLyB7b2Zmc2V0OiBtYXRjaFsnaW5kZXgnXSwgdW5pcXVlOiBtYXRjaFswXSwgbGVuOiBtYXRjaFswXS5sZW5ndGgsIGRhdGE6IGVudC5wYWNrZXIoKSwgdHlwZTogZW50Lm5hbWV9XG4gICAgICAgIGNvbnN0IGVudGl0eSA9IGVudGl0aWVzW2ldO1xuICAgICAgICBsZXQgaW5kZXggPSBlbnRpdHlJbmRleFtlbnRpdHkudW5pcXVlXTtcbiAgICAgICAgaWYgKCFpbmRleCkge1xuICAgICAgICAgIGluZGV4ID0gZW50aXR5TWFwLmxlbmd0aDtcbiAgICAgICAgICBlbnRpdHlJbmRleFtlbnRpdHkudW5pcXVlXSA9IGluZGV4O1xuICAgICAgICAgIGVudGl0eU1hcC5wdXNoKHtcbiAgICAgICAgICAgIHRwOiBlbnRpdHkudHlwZSxcbiAgICAgICAgICAgIGRhdGE6IGVudGl0eS5kYXRhXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmFuZ2VzLnB1c2goe1xuICAgICAgICAgIGF0OiBlbnRpdHkub2Zmc2V0LFxuICAgICAgICAgIGxlbjogZW50aXR5LmxlbixcbiAgICAgICAgICBrZXk6IGluZGV4XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgYmxvY2suZW50ID0gcmFuZ2VzO1xuICAgIH1cblxuICAgIGJseC5wdXNoKGJsb2NrKTtcbiAgfSk7XG5cbiAgY29uc3QgcmVzdWx0ID0ge1xuICAgIHR4dDogJydcbiAgfTtcblxuICAvLyBNZXJnZSBsaW5lcyBhbmQgc2F2ZSBsaW5lIGJyZWFrcyBhcyBCUiBpbmxpbmUgZm9ybWF0dGluZy5cbiAgaWYgKGJseC5sZW5ndGggPiAwKSB7XG4gICAgcmVzdWx0LnR4dCA9IGJseFswXS50eHQ7XG4gICAgcmVzdWx0LmZtdCA9IChibHhbMF0uZm10IHx8IFtdKS5jb25jYXQoYmx4WzBdLmVudCB8fCBbXSk7XG5cbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IGJseC5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgYmxvY2sgPSBibHhbaV07XG4gICAgICBjb25zdCBvZmZzZXQgPSByZXN1bHQudHh0Lmxlbmd0aCArIDE7XG5cbiAgICAgIHJlc3VsdC5mbXQucHVzaCh7XG4gICAgICAgIHRwOiAnQlInLFxuICAgICAgICBsZW46IDEsXG4gICAgICAgIGF0OiBvZmZzZXQgLSAxXG4gICAgICB9KTtcblxuICAgICAgcmVzdWx0LnR4dCArPSAnICcgKyBibG9jay50eHQ7XG4gICAgICBpZiAoYmxvY2suZm10KSB7XG4gICAgICAgIHJlc3VsdC5mbXQgPSByZXN1bHQuZm10LmNvbmNhdChibG9jay5mbXQubWFwKChzKSA9PiB7XG4gICAgICAgICAgcy5hdCArPSBvZmZzZXQ7XG4gICAgICAgICAgcmV0dXJuIHM7XG4gICAgICAgIH0pKTtcbiAgICAgIH1cbiAgICAgIGlmIChibG9jay5lbnQpIHtcbiAgICAgICAgcmVzdWx0LmZtdCA9IHJlc3VsdC5mbXQuY29uY2F0KGJsb2NrLmVudC5tYXAoKHMpID0+IHtcbiAgICAgICAgICBzLmF0ICs9IG9mZnNldDtcbiAgICAgICAgICByZXR1cm4gcztcbiAgICAgICAgfSkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChyZXN1bHQuZm10Lmxlbmd0aCA9PSAwKSB7XG4gICAgICBkZWxldGUgcmVzdWx0LmZtdDtcbiAgICB9XG5cbiAgICBpZiAoZW50aXR5TWFwLmxlbmd0aCA+IDApIHtcbiAgICAgIHJlc3VsdC5lbnQgPSBlbnRpdHlNYXA7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogQXBwZW5kIG9uZSBEcmFmdHkgZG9jdW1lbnQgdG8gYW5vdGhlci5cbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eX0gZmlyc3QgLSBEcmFmdHkgZG9jdW1lbnQgdG8gYXBwZW5kIHRvLlxuICogQHBhcmFtIHtEcmFmdHl8c3RyaW5nfSBzZWNvbmQgLSBEcmFmdHkgZG9jdW1lbnQgb3Igc3RyaW5nIGJlaW5nIGFwcGVuZGVkLlxuICpcbiAqIEByZXR1cm4ge0RyYWZ0eX0gZmlyc3QgZG9jdW1lbnQgd2l0aCB0aGUgc2Vjb25kIGFwcGVuZGVkIHRvIGl0LlxuICovXG5EcmFmdHkuYXBwZW5kID0gZnVuY3Rpb24oZmlyc3QsIHNlY29uZCkge1xuICBpZiAoIWZpcnN0KSB7XG4gICAgcmV0dXJuIHNlY29uZDtcbiAgfVxuICBpZiAoIXNlY29uZCkge1xuICAgIHJldHVybiBmaXJzdDtcbiAgfVxuXG4gIGZpcnN0LnR4dCA9IGZpcnN0LnR4dCB8fCAnJztcbiAgY29uc3QgbGVuID0gZmlyc3QudHh0Lmxlbmd0aDtcblxuICBpZiAodHlwZW9mIHNlY29uZCA9PSAnc3RyaW5nJykge1xuICAgIGZpcnN0LnR4dCArPSBzZWNvbmQ7XG4gIH0gZWxzZSBpZiAoc2Vjb25kLnR4dCkge1xuICAgIGZpcnN0LnR4dCArPSBzZWNvbmQudHh0O1xuICB9XG5cbiAgaWYgKEFycmF5LmlzQXJyYXkoc2Vjb25kLmZtdCkpIHtcbiAgICBmaXJzdC5mbXQgPSBmaXJzdC5mbXQgfHwgW107XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoc2Vjb25kLmVudCkpIHtcbiAgICAgIGZpcnN0LmVudCA9IGZpcnN0LmVudCB8fCBbXTtcbiAgICB9XG4gICAgc2Vjb25kLmZtdC5mb3JFYWNoKHNyYyA9PiB7XG4gICAgICBjb25zdCBmbXQgPSB7XG4gICAgICAgIGF0OiAoc3JjLmF0IHwgMCkgKyBsZW4sXG4gICAgICAgIGxlbjogc3JjLmxlbiB8IDBcbiAgICAgIH07XG4gICAgICAvLyBTcGVjaWFsIGNhc2UgZm9yIHRoZSBvdXRzaWRlIG9mIHRoZSBub3JtYWwgcmVuZGVyaW5nIGZsb3cgc3R5bGVzLlxuICAgICAgaWYgKHNyYy5hdCA9PSAtMSkge1xuICAgICAgICBmbXQuYXQgPSAtMTtcbiAgICAgICAgZm10LmxlbiA9IDA7XG4gICAgICB9XG4gICAgICBpZiAoc3JjLnRwKSB7XG4gICAgICAgIGZtdC50cCA9IHNyYy50cDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZtdC5rZXkgPSBmaXJzdC5lbnQubGVuZ3RoO1xuICAgICAgICBmaXJzdC5lbnQucHVzaChzZWNvbmQuZW50W3NyYy5rZXkgfHwgMF0pO1xuICAgICAgfVxuICAgICAgZmlyc3QuZm10LnB1c2goZm10KTtcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBmaXJzdDtcbn1cblxuLyoqXG4gKiBAdHlwZWRlZiBEcmFmdHkuSW1hZ2VEZXNjXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAdHlwZSBPYmplY3RcbiAqIEBwYXJhbSB7c3RyaW5nfSBtaW1lIC0gbWltZS10eXBlIG9mIHRoZSBpbWFnZSwgZS5nLiBcImltYWdlL3BuZ1wiXG4gKiBAcGFyYW0ge3N0cmluZ30gcHJldmlldyAtIGJhc2U2NC1lbmNvZGVkIGltYWdlIGNvbnRlbnQgKG9yIHByZXZpZXcsIGlmIGxhcmdlIGltYWdlIGlzIGF0dGFjaGVkKS4gQ291bGQgYmUgbnVsbC91bmRlZmluZWQuXG4gKiBAcGFyYW0ge2ludGVnZXJ9IHdpZHRoIC0gd2lkdGggb2YgdGhlIGltYWdlXG4gKiBAcGFyYW0ge2ludGVnZXJ9IGhlaWdodCAtIGhlaWdodCBvZiB0aGUgaW1hZ2VcbiAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlbmFtZSAtIGZpbGUgbmFtZSBzdWdnZXN0aW9uIGZvciBkb3dubG9hZGluZyB0aGUgaW1hZ2UuXG4gKiBAcGFyYW0ge2ludGVnZXJ9IHNpemUgLSBzaXplIG9mIHRoZSBpbWFnZSBpbiBieXRlcy4gVHJlYXQgaXMgYXMgYW4gdW50cnVzdGVkIGhpbnQuXG4gKiBAcGFyYW0ge3N0cmluZ30gcmVmdXJsIC0gcmVmZXJlbmNlIHRvIHRoZSBjb250ZW50LiBDb3VsZCBiZSBudWxsL3VuZGVmaW5lZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBfdGVtcFByZXZpZXcgLSBiYXNlNjQtZW5jb2RlZCBpbWFnZSBwcmV2aWV3IHVzZWQgZHVyaW5nIHVwbG9hZCBwcm9jZXNzOyBub3Qgc2VyaWFsaXphYmxlLlxuICogQHBhcmFtIHtQcm9taXNlfSB1cmxQcm9taXNlIC0gUHJvbWlzZSB3aGljaCByZXR1cm5zIGNvbnRlbnQgVVJMIHdoZW4gcmVzb2x2ZWQuXG4gKi9cblxuLyoqXG4gKiBJbnNlcnQgaW5saW5lIGltYWdlIGludG8gRHJhZnR5IGRvY3VtZW50LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fSBjb250ZW50IC0gZG9jdW1lbnQgdG8gYWRkIGltYWdlIHRvLlxuICogQHBhcmFtIHtpbnRlZ2VyfSBhdCAtIGluZGV4IHdoZXJlIHRoZSBvYmplY3QgaXMgaW5zZXJ0ZWQuIFRoZSBsZW5ndGggb2YgdGhlIGltYWdlIGlzIGFsd2F5cyAxLlxuICogQHBhcmFtIHtJbWFnZURlc2N9IGltYWdlRGVzYyAtIG9iamVjdCB3aXRoIGltYWdlIHBhcmFtZW5ldHMgYW5kIGRhdGEuXG4gKlxuICogQHJldHVybiB7RHJhZnR5fSB1cGRhdGVkIGRvY3VtZW50LlxuICovXG5EcmFmdHkuaW5zZXJ0SW1hZ2UgPSBmdW5jdGlvbihjb250ZW50LCBhdCwgaW1hZ2VEZXNjKSB7XG4gIGNvbnRlbnQgPSBjb250ZW50IHx8IHtcbiAgICB0eHQ6ICcgJ1xuICB9O1xuICBjb250ZW50LmVudCA9IGNvbnRlbnQuZW50IHx8IFtdO1xuICBjb250ZW50LmZtdCA9IGNvbnRlbnQuZm10IHx8IFtdO1xuXG4gIGNvbnRlbnQuZm10LnB1c2goe1xuICAgIGF0OiBhdCB8IDAsXG4gICAgbGVuOiAxLFxuICAgIGtleTogY29udGVudC5lbnQubGVuZ3RoXG4gIH0pO1xuXG4gIGNvbnN0IGV4ID0ge1xuICAgIHRwOiAnSU0nLFxuICAgIGRhdGE6IHtcbiAgICAgIG1pbWU6IGltYWdlRGVzYy5taW1lLFxuICAgICAgdmFsOiBpbWFnZURlc2MucHJldmlldyxcbiAgICAgIHdpZHRoOiBpbWFnZURlc2Mud2lkdGgsXG4gICAgICBoZWlnaHQ6IGltYWdlRGVzYy5oZWlnaHQsXG4gICAgICBuYW1lOiBpbWFnZURlc2MuZmlsZW5hbWUsXG4gICAgICBzaXplOiBpbWFnZURlc2Muc2l6ZSB8IDAsXG4gICAgICByZWY6IGltYWdlRGVzYy5yZWZ1cmxcbiAgICB9XG4gIH07XG5cbiAgaWYgKGltYWdlRGVzYy51cmxQcm9taXNlKSB7XG4gICAgZXguZGF0YS5fdGVtcFByZXZpZXcgPSBpbWFnZURlc2MuX3RlbXBQcmV2aWV3O1xuICAgIGV4LmRhdGEuX3Byb2Nlc3NpbmcgPSB0cnVlO1xuICAgIGltYWdlRGVzYy51cmxQcm9taXNlLnRoZW4oXG4gICAgICB1cmwgPT4ge1xuICAgICAgICBleC5kYXRhLnJlZiA9IHVybDtcbiAgICAgICAgZXguZGF0YS5fdGVtcFByZXZpZXcgPSB1bmRlZmluZWQ7XG4gICAgICAgIGV4LmRhdGEuX3Byb2Nlc3NpbmcgPSB1bmRlZmluZWQ7XG4gICAgICB9LFxuICAgICAgXyA9PiB7XG4gICAgICAgIC8vIENhdGNoIHRoZSBlcnJvciwgb3RoZXJ3aXNlIGl0IHdpbGwgYXBwZWFyIGluIHRoZSBjb25zb2xlLlxuICAgICAgICBleC5kYXRhLl9wcm9jZXNzaW5nID0gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgICk7XG4gIH1cblxuICBjb250ZW50LmVudC5wdXNoKGV4KTtcblxuICByZXR1cm4gY29udGVudDtcbn1cblxuLyoqXG4gKiBAdHlwZWRlZiBEcmFmdHkuQXVkaW9EZXNjXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAdHlwZSBPYmplY3RcbiAqIEBwYXJhbSB7c3RyaW5nfSBtaW1lIC0gbWltZS10eXBlIG9mIHRoZSBhdWRpbywgZS5nLiBcImF1ZGlvL29nZ1wiLlxuICogQHBhcmFtIHtzdHJpbmd9IGRhdGEgLSBiYXNlNjQtZW5jb2RlZCBhdWRpbyBjb250ZW50LiBDb3VsZCBiZSBudWxsL3VuZGVmaW5lZC5cbiAqIEBwYXJhbSB7aW50ZWdlcn0gZHVyYXRpb24gLSBkdXJhdGlvbiBvZiB0aGUgcmVjb3JkIGluIG1pbGxpc2Vjb25kcy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBwcmV2aWV3IC0gYmFzZTY0IGVuY29kZWQgc2hvcnQgYXJyYXkgb2YgYW1wbGl0dWRlIHZhbHVlcyAwLi4xMDAuXG4gKiBAcGFyYW0ge3N0cmluZ30gZmlsZW5hbWUgLSBmaWxlIG5hbWUgc3VnZ2VzdGlvbiBmb3IgZG93bmxvYWRpbmcgdGhlIGF1ZGlvLlxuICogQHBhcmFtIHtpbnRlZ2VyfSBzaXplIC0gc2l6ZSBvZiB0aGUgcmVjb3JkaW5nIGluIGJ5dGVzLiBUcmVhdCBpcyBhcyBhbiB1bnRydXN0ZWQgaGludC5cbiAqIEBwYXJhbSB7c3RyaW5nfSByZWZ1cmwgLSByZWZlcmVuY2UgdG8gdGhlIGNvbnRlbnQuIENvdWxkIGJlIG51bGwvdW5kZWZpbmVkLlxuICogQHBhcmFtIHtQcm9taXNlfSB1cmxQcm9taXNlIC0gUHJvbWlzZSB3aGljaCByZXR1cm5zIGNvbnRlbnQgVVJMIHdoZW4gcmVzb2x2ZWQuXG4gKi9cblxuLyoqXG4gKiBJbnNlcnQgYXVkaW8gcmVjb3JkaW5nIGludG8gRHJhZnR5IGRvY3VtZW50LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fSBjb250ZW50IC0gZG9jdW1lbnQgdG8gYWRkIGF1ZGlvIHJlY29yZCB0by5cbiAqIEBwYXJhbSB7aW50ZWdlcn0gYXQgLSBpbmRleCB3aGVyZSB0aGUgb2JqZWN0IGlzIGluc2VydGVkLiBUaGUgbGVuZ3RoIG9mIHRoZSByZWNvcmQgaXMgYWx3YXlzIDEuXG4gKiBAcGFyYW0ge0F1ZGlvRGVzY30gYXVkaW9EZXNjIC0gb2JqZWN0IHdpdGggdGhlIGF1ZGlvIHBhcmFtZW5ldHMgYW5kIGRhdGEuXG4gKlxuICogQHJldHVybiB7RHJhZnR5fSB1cGRhdGVkIGRvY3VtZW50LlxuICovXG5EcmFmdHkuaW5zZXJ0QXVkaW8gPSBmdW5jdGlvbihjb250ZW50LCBhdCwgYXVkaW9EZXNjKSB7XG4gIGNvbnRlbnQgPSBjb250ZW50IHx8IHtcbiAgICB0eHQ6ICcgJ1xuICB9O1xuICBjb250ZW50LmVudCA9IGNvbnRlbnQuZW50IHx8IFtdO1xuICBjb250ZW50LmZtdCA9IGNvbnRlbnQuZm10IHx8IFtdO1xuXG4gIGNvbnRlbnQuZm10LnB1c2goe1xuICAgIGF0OiBhdCB8IDAsXG4gICAgbGVuOiAxLFxuICAgIGtleTogY29udGVudC5lbnQubGVuZ3RoXG4gIH0pO1xuXG4gIGNvbnN0IGV4ID0ge1xuICAgIHRwOiAnQVUnLFxuICAgIGRhdGE6IHtcbiAgICAgIG1pbWU6IGF1ZGlvRGVzYy5taW1lLFxuICAgICAgdmFsOiBhdWRpb0Rlc2MuZGF0YSxcbiAgICAgIGR1cmF0aW9uOiBhdWRpb0Rlc2MuZHVyYXRpb24gfCAwLFxuICAgICAgcHJldmlldzogYXVkaW9EZXNjLnByZXZpZXcsXG4gICAgICBuYW1lOiBhdWRpb0Rlc2MuZmlsZW5hbWUsXG4gICAgICBzaXplOiBhdWRpb0Rlc2Muc2l6ZSB8IDAsXG4gICAgICByZWY6IGF1ZGlvRGVzYy5yZWZ1cmxcbiAgICB9XG4gIH07XG5cbiAgaWYgKGF1ZGlvRGVzYy51cmxQcm9taXNlKSB7XG4gICAgZXguZGF0YS5fcHJvY2Vzc2luZyA9IHRydWU7XG4gICAgYXVkaW9EZXNjLnVybFByb21pc2UudGhlbihcbiAgICAgIHVybCA9PiB7XG4gICAgICAgIGV4LmRhdGEucmVmID0gdXJsO1xuICAgICAgICBleC5kYXRhLl9wcm9jZXNzaW5nID0gdW5kZWZpbmVkO1xuICAgICAgfSxcbiAgICAgIF8gPT4ge1xuICAgICAgICAvLyBDYXRjaCB0aGUgZXJyb3IsIG90aGVyd2lzZSBpdCB3aWxsIGFwcGVhciBpbiB0aGUgY29uc29sZS5cbiAgICAgICAgZXguZGF0YS5fcHJvY2Vzc2luZyA9IHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICApO1xuICB9XG5cbiAgY29udGVudC5lbnQucHVzaChleCk7XG5cbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cbi8qKlxuICogQ3JlYXRlIGEgcXVvdGUgdG8gRHJhZnR5IGRvY3VtZW50LlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBoZWFkZXIgLSBRdW90ZSBoZWFkZXIgKHRpdGxlLCBldGMuKS5cbiAqIEBwYXJhbSB7c3RyaW5nfSB1aWQgLSBVSUQgb2YgdGhlIGF1dGhvciB0byBtZW50aW9uLlxuICogQHBhcmFtIHtEcmFmdHl9IGJvZHkgLSBCb2R5IG9mIHRoZSBxdW90ZWQgbWVzc2FnZS5cbiAqXG4gKiBAcmV0dXJucyBSZXBseSBxdW90ZSBEcmFmdHkgZG9jIHdpdGggdGhlIHF1b3RlIGZvcm1hdHRpbmcuXG4gKi9cbkRyYWZ0eS5xdW90ZSA9IGZ1bmN0aW9uKGhlYWRlciwgdWlkLCBib2R5KSB7XG4gIGNvbnN0IHF1b3RlID0gRHJhZnR5LmFwcGVuZChEcmFmdHkuYXBwZW5kTGluZUJyZWFrKERyYWZ0eS5tZW50aW9uKGhlYWRlciwgdWlkKSksIGJvZHkpO1xuXG4gIC8vIFdyYXAgaW50byBhIHF1b3RlLlxuICBxdW90ZS5mbXQucHVzaCh7XG4gICAgYXQ6IDAsXG4gICAgbGVuOiBxdW90ZS50eHQubGVuZ3RoLFxuICAgIHRwOiAnUVEnXG4gIH0pO1xuXG4gIHJldHVybiBxdW90ZTtcbn1cblxuLyoqXG4gKiBDcmVhdGUgYSBEcmFmdHkgZG9jdW1lbnQgd2l0aCBhIG1lbnRpb24uXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBtZW50aW9uZWQgbmFtZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSB1aWQgLSBtZW50aW9uZWQgdXNlciBJRC5cbiAqXG4gKiBAcmV0dXJucyB7RHJhZnR5fSBkb2N1bWVudCB3aXRoIHRoZSBtZW50aW9uLlxuICovXG5EcmFmdHkubWVudGlvbiA9IGZ1bmN0aW9uKG5hbWUsIHVpZCkge1xuICByZXR1cm4ge1xuICAgIHR4dDogbmFtZSB8fCAnJyxcbiAgICBmbXQ6IFt7XG4gICAgICBhdDogMCxcbiAgICAgIGxlbjogKG5hbWUgfHwgJycpLmxlbmd0aCxcbiAgICAgIGtleTogMFxuICAgIH1dLFxuICAgIGVudDogW3tcbiAgICAgIHRwOiAnTU4nLFxuICAgICAgZGF0YToge1xuICAgICAgICB2YWw6IHVpZFxuICAgICAgfVxuICAgIH1dXG4gIH07XG59XG5cbi8qKlxuICogQXBwZW5kIGEgbGluayB0byBhIERyYWZ0eSBkb2N1bWVudC5cbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eX0gY29udGVudCAtIERyYWZ0eSBkb2N1bWVudCB0byBhcHBlbmQgbGluayB0by5cbiAqIEBwYXJhbSB7T2JqZWN0fSBsaW5rRGF0YSAtIExpbmsgaW5mbyBpbiBmb3JtYXQgPGNvZGU+e3R4dDogJ2Fua29yIHRleHQnLCB1cmw6ICdodHRwOi8vLi4uJ308L2NvZGU+LlxuICpcbiAqIEByZXR1cm5zIHtEcmFmdHl9IHRoZSBzYW1lIGRvY3VtZW50IGFzIDxjb2RlPmNvbnRlbnQ8L2NvZGU+LlxuICovXG5EcmFmdHkuYXBwZW5kTGluayA9IGZ1bmN0aW9uKGNvbnRlbnQsIGxpbmtEYXRhKSB7XG4gIGNvbnRlbnQgPSBjb250ZW50IHx8IHtcbiAgICB0eHQ6ICcnXG4gIH07XG5cbiAgY29udGVudC5lbnQgPSBjb250ZW50LmVudCB8fCBbXTtcbiAgY29udGVudC5mbXQgPSBjb250ZW50LmZtdCB8fCBbXTtcblxuICBjb250ZW50LmZtdC5wdXNoKHtcbiAgICBhdDogY29udGVudC50eHQubGVuZ3RoLFxuICAgIGxlbjogbGlua0RhdGEudHh0Lmxlbmd0aCxcbiAgICBrZXk6IGNvbnRlbnQuZW50Lmxlbmd0aFxuICB9KTtcbiAgY29udGVudC50eHQgKz0gbGlua0RhdGEudHh0O1xuXG4gIGNvbnN0IGV4ID0ge1xuICAgIHRwOiAnTE4nLFxuICAgIGRhdGE6IHtcbiAgICAgIHVybDogbGlua0RhdGEudXJsXG4gICAgfVxuICB9XG4gIGNvbnRlbnQuZW50LnB1c2goZXgpO1xuXG4gIHJldHVybiBjb250ZW50O1xufVxuXG4vKipcbiAqIEFwcGVuZCBpbWFnZSB0byBEcmFmdHkgZG9jdW1lbnQuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGNvbnRlbnQgLSBkb2N1bWVudCB0byBhZGQgaW1hZ2UgdG8uXG4gKiBAcGFyYW0ge0ltYWdlRGVzY30gaW1hZ2VEZXNjIC0gb2JqZWN0IHdpdGggaW1hZ2UgcGFyYW1lbmV0cy5cbiAqXG4gKiBAcmV0dXJuIHtEcmFmdHl9IHVwZGF0ZWQgZG9jdW1lbnQuXG4gKi9cbkRyYWZ0eS5hcHBlbmRJbWFnZSA9IGZ1bmN0aW9uKGNvbnRlbnQsIGltYWdlRGVzYykge1xuICBjb250ZW50ID0gY29udGVudCB8fCB7XG4gICAgdHh0OiAnJ1xuICB9O1xuICBjb250ZW50LnR4dCArPSAnICc7XG4gIHJldHVybiBEcmFmdHkuaW5zZXJ0SW1hZ2UoY29udGVudCwgY29udGVudC50eHQubGVuZ3RoIC0gMSwgaW1hZ2VEZXNjKTtcbn1cblxuLyoqXG4gKiBBcHBlbmQgYXVkaW8gcmVjb2RyaW5nIHRvIERyYWZ0eSBkb2N1bWVudC5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eX0gY29udGVudCAtIGRvY3VtZW50IHRvIGFkZCByZWNvcmRpbmcgdG8uXG4gKiBAcGFyYW0ge0F1ZGlvRGVzY30gYXVkaW9EZXNjIC0gb2JqZWN0IHdpdGggYXVkaW8gZGF0YS5cbiAqXG4gKiBAcmV0dXJuIHtEcmFmdHl9IHVwZGF0ZWQgZG9jdW1lbnQuXG4gKi9cbkRyYWZ0eS5hcHBlbmRBdWRpbyA9IGZ1bmN0aW9uKGNvbnRlbnQsIGF1ZGlvRGVzYykge1xuICBjb250ZW50ID0gY29udGVudCB8fCB7XG4gICAgdHh0OiAnJ1xuICB9O1xuICBjb250ZW50LnR4dCArPSAnICc7XG4gIHJldHVybiBEcmFmdHkuaW5zZXJ0QXVkaW8oY29udGVudCwgY29udGVudC50eHQubGVuZ3RoIC0gMSwgYXVkaW9EZXNjKTtcbn1cblxuLyoqXG4gKiBAdHlwZWRlZiBEcmFmdHkuQXR0YWNobWVudERlc2NcbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEB0eXBlIE9iamVjdFxuICogQHBhcmFtIHtzdHJpbmd9IG1pbWUgLSBtaW1lLXR5cGUgb2YgdGhlIGF0dGFjaG1lbnQsIGUuZy4gXCJhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW1cIlxuICogQHBhcmFtIHtzdHJpbmd9IGRhdGEgLSBiYXNlNjQtZW5jb2RlZCBpbi1iYW5kIGNvbnRlbnQgb2Ygc21hbGwgYXR0YWNobWVudHMuIENvdWxkIGJlIG51bGwvdW5kZWZpbmVkLlxuICogQHBhcmFtIHtzdHJpbmd9IGZpbGVuYW1lIC0gZmlsZSBuYW1lIHN1Z2dlc3Rpb24gZm9yIGRvd25sb2FkaW5nIHRoZSBhdHRhY2htZW50LlxuICogQHBhcmFtIHtpbnRlZ2VyfSBzaXplIC0gc2l6ZSBvZiB0aGUgZmlsZSBpbiBieXRlcy4gVHJlYXQgaXMgYXMgYW4gdW50cnVzdGVkIGhpbnQuXG4gKiBAcGFyYW0ge3N0cmluZ30gcmVmdXJsIC0gcmVmZXJlbmNlIHRvIHRoZSBvdXQtb2YtYmFuZCBjb250ZW50LiBDb3VsZCBiZSBudWxsL3VuZGVmaW5lZC5cbiAqIEBwYXJhbSB7UHJvbWlzZX0gdXJsUHJvbWlzZSAtIFByb21pc2Ugd2hpY2ggcmV0dXJucyBjb250ZW50IFVSTCB3aGVuIHJlc29sdmVkLlxuICovXG5cbi8qKlxuICogQXR0YWNoIGZpbGUgdG8gRHJhZnR5IGNvbnRlbnQuIEVpdGhlciBhcyBhIGJsb2Igb3IgYXMgYSByZWZlcmVuY2UuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGNvbnRlbnQgLSBkb2N1bWVudCB0byBhdHRhY2ggZmlsZSB0by5cbiAqIEBwYXJhbSB7QXR0YWNobWVudERlc2N9IG9iamVjdCAtIGNvbnRhaW5pbmcgYXR0YWNobWVudCBkZXNjcmlwdGlvbiBhbmQgZGF0YS5cbiAqXG4gKiBAcmV0dXJuIHtEcmFmdHl9IHVwZGF0ZWQgZG9jdW1lbnQuXG4gKi9cbkRyYWZ0eS5hdHRhY2hGaWxlID0gZnVuY3Rpb24oY29udGVudCwgYXR0YWNobWVudERlc2MpIHtcbiAgY29udGVudCA9IGNvbnRlbnQgfHwge1xuICAgIHR4dDogJydcbiAgfTtcblxuICBjb250ZW50LmVudCA9IGNvbnRlbnQuZW50IHx8IFtdO1xuICBjb250ZW50LmZtdCA9IGNvbnRlbnQuZm10IHx8IFtdO1xuXG4gIGNvbnRlbnQuZm10LnB1c2goe1xuICAgIGF0OiAtMSxcbiAgICBsZW46IDAsXG4gICAga2V5OiBjb250ZW50LmVudC5sZW5ndGhcbiAgfSk7XG5cbiAgY29uc3QgZXggPSB7XG4gICAgdHA6ICdFWCcsXG4gICAgZGF0YToge1xuICAgICAgbWltZTogYXR0YWNobWVudERlc2MubWltZSxcbiAgICAgIHZhbDogYXR0YWNobWVudERlc2MuZGF0YSxcbiAgICAgIG5hbWU6IGF0dGFjaG1lbnREZXNjLmZpbGVuYW1lLFxuICAgICAgcmVmOiBhdHRhY2htZW50RGVzYy5yZWZ1cmwsXG4gICAgICBzaXplOiBhdHRhY2htZW50RGVzYy5zaXplIHwgMFxuICAgIH1cbiAgfVxuICBpZiAoYXR0YWNobWVudERlc2MudXJsUHJvbWlzZSkge1xuICAgIGV4LmRhdGEuX3Byb2Nlc3NpbmcgPSB0cnVlO1xuICAgIGF0dGFjaG1lbnREZXNjLnVybFByb21pc2UudGhlbihcbiAgICAgICh1cmwpID0+IHtcbiAgICAgICAgZXguZGF0YS5yZWYgPSB1cmw7XG4gICAgICAgIGV4LmRhdGEuX3Byb2Nlc3NpbmcgPSB1bmRlZmluZWQ7XG4gICAgICB9LFxuICAgICAgKGVycikgPT4ge1xuICAgICAgICAvKiBjYXRjaCB0aGUgZXJyb3IsIG90aGVyd2lzZSBpdCB3aWxsIGFwcGVhciBpbiB0aGUgY29uc29sZS4gKi9cbiAgICAgICAgZXguZGF0YS5fcHJvY2Vzc2luZyA9IHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICApO1xuICB9XG4gIGNvbnRlbnQuZW50LnB1c2goZXgpO1xuXG4gIHJldHVybiBjb250ZW50O1xufVxuXG4vKipcbiAqIFdyYXBzIGRyYWZ0eSBkb2N1bWVudCBpbnRvIGEgc2ltcGxlIGZvcm1hdHRpbmcgc3R5bGUuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl8c3RyaW5nfSBjb250ZW50IC0gZG9jdW1lbnQgb3Igc3RyaW5nIHRvIHdyYXAgaW50byBhIHN0eWxlLlxuICogQHBhcmFtIHtzdHJpbmd9IHN0eWxlIC0gdHdvLWxldHRlciBzdHlsZSB0byB3cmFwIGludG8uXG4gKiBAcGFyYW0ge251bWJlcn0gYXQgLSBpbmRleCB3aGVyZSB0aGUgc3R5bGUgc3RhcnRzLCBkZWZhdWx0IDAuXG4gKiBAcGFyYW0ge251bWJlcn0gbGVuIC0gbGVuZ3RoIG9mIHRoZSBmb3JtIGNvbnRlbnQsIGRlZmF1bHQgYWxsIG9mIGl0LlxuICpcbiAqIEByZXR1cm4ge0RyYWZ0eX0gdXBkYXRlZCBkb2N1bWVudC5cbiAqL1xuRHJhZnR5LndyYXBJbnRvID0gZnVuY3Rpb24oY29udGVudCwgc3R5bGUsIGF0LCBsZW4pIHtcbiAgaWYgKHR5cGVvZiBjb250ZW50ID09ICdzdHJpbmcnKSB7XG4gICAgY29udGVudCA9IHtcbiAgICAgIHR4dDogY29udGVudFxuICAgIH07XG4gIH1cbiAgY29udGVudC5mbXQgPSBjb250ZW50LmZtdCB8fCBbXTtcblxuICBjb250ZW50LmZtdC5wdXNoKHtcbiAgICBhdDogYXQgfHwgMCxcbiAgICBsZW46IGxlbiB8fCBjb250ZW50LnR4dC5sZW5ndGgsXG4gICAgdHA6IHN0eWxlLFxuICB9KTtcblxuICByZXR1cm4gY29udGVudDtcbn1cblxuLyoqXG4gKiBXcmFwcyBjb250ZW50IGludG8gYW4gaW50ZXJhY3RpdmUgZm9ybS5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eXxzdHJpbmd9IGNvbnRlbnQgLSB0byB3cmFwIGludG8gYSBmb3JtLlxuICogQHBhcmFtIHtudW1iZXJ9IGF0IC0gaW5kZXggd2hlcmUgdGhlIGZvcm1zIHN0YXJ0cy5cbiAqIEBwYXJhbSB7bnVtYmVyfSBsZW4gLSBsZW5ndGggb2YgdGhlIGZvcm0gY29udGVudC5cbiAqXG4gKiBAcmV0dXJuIHtEcmFmdHl9IHVwZGF0ZWQgZG9jdW1lbnQuXG4gKi9cbkRyYWZ0eS53cmFwQXNGb3JtID0gZnVuY3Rpb24oY29udGVudCwgYXQsIGxlbikge1xuICByZXR1cm4gRHJhZnR5LndyYXBJbnRvKGNvbnRlbnQsICdGTScsIGF0LCBsZW4pO1xufVxuXG4vKipcbiAqIEluc2VydCBjbGlja2FibGUgYnV0dG9uIGludG8gRHJhZnR5IGRvY3VtZW50LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fHN0cmluZ30gY29udGVudCAtIERyYWZ0eSBkb2N1bWVudCB0byBpbnNlcnQgYnV0dG9uIHRvIG9yIGEgc3RyaW5nIHRvIGJlIHVzZWQgYXMgYnV0dG9uIHRleHQuXG4gKiBAcGFyYW0ge251bWJlcn0gYXQgLSBsb2NhdGlvbiB3aGVyZSB0aGUgYnV0dG9uIGlzIGluc2VydGVkLlxuICogQHBhcmFtIHtudW1iZXJ9IGxlbiAtIHRoZSBsZW5ndGggb2YgdGhlIHRleHQgdG8gYmUgdXNlZCBhcyBidXR0b24gdGl0bGUuXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIHRoZSBidXR0b24uIENsaWVudCBzaG91bGQgcmV0dXJuIGl0IHRvIHRoZSBzZXJ2ZXIgd2hlbiB0aGUgYnV0dG9uIGlzIGNsaWNrZWQuXG4gKiBAcGFyYW0ge3N0cmluZ30gYWN0aW9uVHlwZSAtIHRoZSB0eXBlIG9mIHRoZSBidXR0b24sIG9uZSBvZiAndXJsJyBvciAncHViJy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBhY3Rpb25WYWx1ZSAtIHRoZSB2YWx1ZSB0byByZXR1cm4gb24gY2xpY2s6XG4gKiBAcGFyYW0ge3N0cmluZ30gcmVmVXJsIC0gdGhlIFVSTCB0byBnbyB0byB3aGVuIHRoZSAndXJsJyBidXR0b24gaXMgY2xpY2tlZC5cbiAqXG4gKiBAcmV0dXJuIHtEcmFmdHl9IHVwZGF0ZWQgZG9jdW1lbnQuXG4gKi9cbkRyYWZ0eS5pbnNlcnRCdXR0b24gPSBmdW5jdGlvbihjb250ZW50LCBhdCwgbGVuLCBuYW1lLCBhY3Rpb25UeXBlLCBhY3Rpb25WYWx1ZSwgcmVmVXJsKSB7XG4gIGlmICh0eXBlb2YgY29udGVudCA9PSAnc3RyaW5nJykge1xuICAgIGNvbnRlbnQgPSB7XG4gICAgICB0eHQ6IGNvbnRlbnRcbiAgICB9O1xuICB9XG5cbiAgaWYgKCFjb250ZW50IHx8ICFjb250ZW50LnR4dCB8fCBjb250ZW50LnR4dC5sZW5ndGggPCBhdCArIGxlbikge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgaWYgKGxlbiA8PSAwIHx8IFsndXJsJywgJ3B1YiddLmluZGV4T2YoYWN0aW9uVHlwZSkgPT0gLTEpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICAvLyBFbnN1cmUgcmVmVXJsIGlzIGEgc3RyaW5nLlxuICBpZiAoYWN0aW9uVHlwZSA9PSAndXJsJyAmJiAhcmVmVXJsKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgcmVmVXJsID0gJycgKyByZWZVcmw7XG5cbiAgY29udGVudC5lbnQgPSBjb250ZW50LmVudCB8fCBbXTtcbiAgY29udGVudC5mbXQgPSBjb250ZW50LmZtdCB8fCBbXTtcblxuICBjb250ZW50LmZtdC5wdXNoKHtcbiAgICBhdDogYXQgfCAwLFxuICAgIGxlbjogbGVuLFxuICAgIGtleTogY29udGVudC5lbnQubGVuZ3RoXG4gIH0pO1xuICBjb250ZW50LmVudC5wdXNoKHtcbiAgICB0cDogJ0JOJyxcbiAgICBkYXRhOiB7XG4gICAgICBhY3Q6IGFjdGlvblR5cGUsXG4gICAgICB2YWw6IGFjdGlvblZhbHVlLFxuICAgICAgcmVmOiByZWZVcmwsXG4gICAgICBuYW1lOiBuYW1lXG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gY29udGVudDtcbn1cblxuLyoqXG4gKiBBcHBlbmQgY2xpY2thYmxlIGJ1dHRvbiB0byBEcmFmdHkgZG9jdW1lbnQuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl8c3RyaW5nfSBjb250ZW50IC0gRHJhZnR5IGRvY3VtZW50IHRvIGluc2VydCBidXR0b24gdG8gb3IgYSBzdHJpbmcgdG8gYmUgdXNlZCBhcyBidXR0b24gdGV4dC5cbiAqIEBwYXJhbSB7c3RyaW5nfSB0aXRsZSAtIHRoZSB0ZXh0IHRvIGJlIHVzZWQgYXMgYnV0dG9uIHRpdGxlLlxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSB0aGUgYnV0dG9uLiBDbGllbnQgc2hvdWxkIHJldHVybiBpdCB0byB0aGUgc2VydmVyIHdoZW4gdGhlIGJ1dHRvbiBpcyBjbGlja2VkLlxuICogQHBhcmFtIHtzdHJpbmd9IGFjdGlvblR5cGUgLSB0aGUgdHlwZSBvZiB0aGUgYnV0dG9uLCBvbmUgb2YgJ3VybCcgb3IgJ3B1YicuXG4gKiBAcGFyYW0ge3N0cmluZ30gYWN0aW9uVmFsdWUgLSB0aGUgdmFsdWUgdG8gcmV0dXJuIG9uIGNsaWNrOlxuICogQHBhcmFtIHtzdHJpbmd9IHJlZlVybCAtIHRoZSBVUkwgdG8gZ28gdG8gd2hlbiB0aGUgJ3VybCcgYnV0dG9uIGlzIGNsaWNrZWQuXG4gKlxuICogQHJldHVybiB7RHJhZnR5fSB1cGRhdGVkIGRvY3VtZW50LlxuICovXG5EcmFmdHkuYXBwZW5kQnV0dG9uID0gZnVuY3Rpb24oY29udGVudCwgdGl0bGUsIG5hbWUsIGFjdGlvblR5cGUsIGFjdGlvblZhbHVlLCByZWZVcmwpIHtcbiAgY29udGVudCA9IGNvbnRlbnQgfHwge1xuICAgIHR4dDogJydcbiAgfTtcbiAgY29uc3QgYXQgPSBjb250ZW50LnR4dC5sZW5ndGg7XG4gIGNvbnRlbnQudHh0ICs9IHRpdGxlO1xuICByZXR1cm4gRHJhZnR5Lmluc2VydEJ1dHRvbihjb250ZW50LCBhdCwgdGl0bGUubGVuZ3RoLCBuYW1lLCBhY3Rpb25UeXBlLCBhY3Rpb25WYWx1ZSwgcmVmVXJsKTtcbn1cblxuLyoqXG4gKiBBdHRhY2ggYSBnZW5lcmljIEpTIG9iamVjdC4gVGhlIG9iamVjdCBpcyBhdHRhY2hlZCBhcyBhIGpzb24gc3RyaW5nLlxuICogSW50ZW5kZWQgZm9yIHJlcHJlc2VudGluZyBhIGZvcm0gcmVzcG9uc2UuXG4gKlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fSBjb250ZW50IC0gRHJhZnR5IGRvY3VtZW50IHRvIGF0dGFjaCBmaWxlIHRvLlxuICogQHBhcmFtIHtPYmplY3R9IGRhdGEgLSBkYXRhIHRvIGNvbnZlcnQgdG8ganNvbiBzdHJpbmcgYW5kIGF0dGFjaC5cbiAqIEByZXR1cm5zIHtEcmFmdHl9IHRoZSBzYW1lIGRvY3VtZW50IGFzIDxjb2RlPmNvbnRlbnQ8L2NvZGU+LlxuICovXG5EcmFmdHkuYXR0YWNoSlNPTiA9IGZ1bmN0aW9uKGNvbnRlbnQsIGRhdGEpIHtcbiAgY29udGVudCA9IGNvbnRlbnQgfHwge1xuICAgIHR4dDogJydcbiAgfTtcbiAgY29udGVudC5lbnQgPSBjb250ZW50LmVudCB8fCBbXTtcbiAgY29udGVudC5mbXQgPSBjb250ZW50LmZtdCB8fCBbXTtcblxuICBjb250ZW50LmZtdC5wdXNoKHtcbiAgICBhdDogLTEsXG4gICAgbGVuOiAwLFxuICAgIGtleTogY29udGVudC5lbnQubGVuZ3RoXG4gIH0pO1xuXG4gIGNvbnRlbnQuZW50LnB1c2goe1xuICAgIHRwOiAnRVgnLFxuICAgIGRhdGE6IHtcbiAgICAgIG1pbWU6IEpTT05fTUlNRV9UWVBFLFxuICAgICAgdmFsOiBkYXRhXG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gY29udGVudDtcbn1cbi8qKlxuICogQXBwZW5kIGxpbmUgYnJlYWsgdG8gYSBEcmFmdHkgZG9jdW1lbnQuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGNvbnRlbnQgLSBEcmFmdHkgZG9jdW1lbnQgdG8gYXBwZW5kIGxpbmVicmVhayB0by5cbiAqIEByZXR1cm5zIHtEcmFmdHl9IHRoZSBzYW1lIGRvY3VtZW50IGFzIDxjb2RlPmNvbnRlbnQ8L2NvZGU+LlxuICovXG5EcmFmdHkuYXBwZW5kTGluZUJyZWFrID0gZnVuY3Rpb24oY29udGVudCkge1xuICBjb250ZW50ID0gY29udGVudCB8fCB7XG4gICAgdHh0OiAnJ1xuICB9O1xuICBjb250ZW50LmZtdCA9IGNvbnRlbnQuZm10IHx8IFtdO1xuICBjb250ZW50LmZtdC5wdXNoKHtcbiAgICBhdDogY29udGVudC50eHQubGVuZ3RoLFxuICAgIGxlbjogMSxcbiAgICB0cDogJ0JSJ1xuICB9KTtcbiAgY29udGVudC50eHQgKz0gJyAnO1xuXG4gIHJldHVybiBjb250ZW50O1xufVxuLyoqXG4gKiBHaXZlbiBEcmFmdHkgZG9jdW1lbnQsIGNvbnZlcnQgaXQgdG8gSFRNTC5cbiAqIE5vIGF0dGVtcHQgaXMgbWFkZSB0byBzdHJpcCBwcmUtZXhpc3RpbmcgaHRtbCBtYXJrdXAuXG4gKiBUaGlzIGlzIHBvdGVudGlhbGx5IHVuc2FmZSBiZWNhdXNlIDxjb2RlPmNvbnRlbnQudHh0PC9jb2RlPiBtYXkgY29udGFpbiBtYWxpY2lvdXMgSFRNTFxuICogbWFya3VwLlxuICogQG1lbWJlcm9mIFRpbm9kZS5EcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eX0gZG9jIC0gZG9jdW1lbnQgdG8gY29udmVydC5cbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBIVE1MLXJlcHJlc2VudGF0aW9uIG9mIGNvbnRlbnQuXG4gKi9cbkRyYWZ0eS5VTlNBRkVfdG9IVE1MID0gZnVuY3Rpb24oZG9jKSB7XG4gIGxldCB0cmVlID0gZHJhZnR5VG9UcmVlKGRvYyk7XG4gIGNvbnN0IGh0bWxGb3JtYXR0ZXIgPSBmdW5jdGlvbih0eXBlLCBkYXRhLCB2YWx1ZXMpIHtcbiAgICBjb25zdCB0YWcgPSBERUNPUkFUT1JTW3R5cGVdO1xuICAgIGxldCByZXN1bHQgPSB2YWx1ZXMgPyB2YWx1ZXMuam9pbignJykgOiAnJztcbiAgICBpZiAodGFnKSB7XG4gICAgICByZXN1bHQgPSB0YWcub3BlbihkYXRhKSArIHJlc3VsdCArIHRhZy5jbG9zZShkYXRhKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbiAgcmV0dXJuIHRyZWVCb3R0b21VcCh0cmVlLCBodG1sRm9ybWF0dGVyLCAwKTtcbn1cblxuLyoqXG4gKiBDYWxsYmFjayBmb3IgYXBwbHlpbmcgY3VzdG9tIGZvcm1hdHRpbmcgdG8gYSBEcmFmdHkgZG9jdW1lbnQuXG4gKiBDYWxsZWQgb25jZSBmb3IgZWFjaCBzdHlsZSBzcGFuLlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBjYWxsYmFjayBGb3JtYXR0ZXJcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHlsZSAtIHN0eWxlIGNvZGUgc3VjaCBhcyBcIlNUXCIgb3IgXCJJTVwiLlxuICogQHBhcmFtIHtPYmplY3R9IGRhdGEgLSBlbnRpdHkncyBkYXRhLlxuICogQHBhcmFtIHtPYmplY3R9IHZhbHVlcyAtIHBvc3NpYmx5IHN0eWxlZCBzdWJzcGFucyBjb250YWluZWQgaW4gdGhpcyBzdHlsZSBzcGFuLlxuICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IC0gaW5kZXggb2YgdGhlIGVsZW1lbnQgZ3VhcmFudGVlZCB0byBiZSB1bmlxdWUuXG4gKi9cblxuLyoqXG4gKiBDb252ZXJ0IERyYWZ0eSBkb2N1bWVudCB0byBhIHJlcHJlc2VudGF0aW9uIHN1aXRhYmxlIGZvciBkaXNwbGF5LlxuICogVGhlIDxjb2RlPmNvbnRleHQ8L2NvZGU+IG1heSBleHBvc2UgYSBmdW5jdGlvbiA8Y29kZT5nZXRGb3JtYXR0ZXIoc3R5bGUpPC9jb2RlPi4gSWYgaXQncyBhdmFpbGFibGVcbiAqIGl0IHdpbGwgY2FsbCBpdCB0byBvYnRhaW4gYSA8Y29kZT5mb3JtYXR0ZXI8L2NvZGU+IGZvciBhIHN1YnRyZWUgb2Ygc3R5bGVzIHVuZGVyIHRoZSA8Y29kZT5zdHlsZTwvY29kZT4uXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl8T2JqZWN0fSBjb250ZW50IC0gRHJhZnR5IGRvY3VtZW50IHRvIHRyYW5zZm9ybS5cbiAqIEBwYXJhbSB7Rm9ybWF0dGVyfSBmb3JtYXR0ZXIgLSBjYWxsYmFjayB3aGljaCBmb3JtYXRzIGluZGl2aWR1YWwgZWxlbWVudHMuXG4gKiBAcGFyYW0ge09iamVjdH0gY29udGV4dCAtIGNvbnRleHQgcHJvdmlkZWQgdG8gZm9ybWF0dGVyIGFzIDxjb2RlPnRoaXM8L2NvZGU+LlxuICpcbiAqIEByZXR1cm4ge09iamVjdH0gdHJhbnNmb3JtZWQgb2JqZWN0XG4gKi9cbkRyYWZ0eS5mb3JtYXQgPSBmdW5jdGlvbihvcmlnaW5hbCwgZm9ybWF0dGVyLCBjb250ZXh0KSB7XG4gIHJldHVybiB0cmVlQm90dG9tVXAoZHJhZnR5VG9UcmVlKG9yaWdpbmFsKSwgZm9ybWF0dGVyLCAwLCBbXSwgY29udGV4dCk7XG59XG5cbi8qKlxuICogU2hvcnRlbiBEcmFmdHkgZG9jdW1lbnQgbWFraW5nIHRoZSBkcmFmdHkgdGV4dCBubyBsb25nZXIgdGhhbiB0aGUgbGltaXQuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl8c3RyaW5nfSBvcmlnaW5hbCAtIERyYWZ0eSBvYmplY3QgdG8gc2hvcnRlbi5cbiAqIEBwYXJhbSB7bnVtYmVyfSBsaW1pdCAtIGxlbmd0aCBpbiBjaGFyYWNyZXRzIHRvIHNob3J0ZW4gdG8uXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGxpZ2h0IC0gcmVtb3ZlIGhlYXZ5IGRhdGEgZnJvbSBlbnRpdGllcy5cbiAqIEByZXR1cm5zIG5ldyBzaG9ydGVuZWQgRHJhZnR5IG9iamVjdCBsZWF2aW5nIHRoZSBvcmlnaW5hbCBpbnRhY3QuXG4gKi9cbkRyYWZ0eS5zaG9ydGVuID0gZnVuY3Rpb24ob3JpZ2luYWwsIGxpbWl0LCBsaWdodCkge1xuICBsZXQgdHJlZSA9IGRyYWZ0eVRvVHJlZShvcmlnaW5hbCk7XG4gIHRyZWUgPSBzaG9ydGVuVHJlZSh0cmVlLCBsaW1pdCwgJ+KApicpO1xuICBpZiAodHJlZSAmJiBsaWdodCkge1xuICAgIHRyZWUgPSBsaWdodEVudGl0eSh0cmVlKTtcbiAgfVxuICByZXR1cm4gdHJlZVRvRHJhZnR5KHt9LCB0cmVlLCBbXSk7XG59XG5cbi8qKlxuICogVHJhbnNmb3JtIERyYWZ0eSBkb2MgZm9yIGZvcndhcmRpbmc6IHN0cmlwIGxlYWRpbmcgQG1lbnRpb24gYW5kIGFueSBsZWFkaW5nIGxpbmUgYnJlYWtzIG9yIHdoaXRlc3BhY2UuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl8c3RyaW5nfSBvcmlnaW5hbCAtIERyYWZ0eSBvYmplY3QgdG8gc2hvcnRlbi5cbiAqIEByZXR1cm5zIGNvbnZlcnRlZCBEcmFmdHkgb2JqZWN0IGxlYXZpbmcgdGhlIG9yaWdpbmFsIGludGFjdC5cbiAqL1xuRHJhZnR5LmZvcndhcmRlZENvbnRlbnQgPSBmdW5jdGlvbihvcmlnaW5hbCkge1xuICBsZXQgdHJlZSA9IGRyYWZ0eVRvVHJlZShvcmlnaW5hbCk7XG4gIGNvbnN0IHJtTWVudGlvbiA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICBpZiAobm9kZS50eXBlID09ICdNTicpIHtcbiAgICAgIGlmICghbm9kZS5wYXJlbnQgfHwgIW5vZGUucGFyZW50LnR5cGUpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBub2RlO1xuICB9XG4gIC8vIFN0cmlwIGxlYWRpbmcgbWVudGlvbi5cbiAgdHJlZSA9IHRyZWVUb3BEb3duKHRyZWUsIHJtTWVudGlvbik7XG4gIC8vIFJlbW92ZSBsZWFkaW5nIHdoaXRlc3BhY2UuXG4gIHRyZWUgPSBsVHJpbSh0cmVlKTtcbiAgLy8gQ29udmVydCBiYWNrIHRvIERyYWZ0eS5cbiAgcmV0dXJuIHRyZWVUb0RyYWZ0eSh7fSwgdHJlZSwgW10pO1xufVxuXG4vKipcbiAqIFByZXBhcmUgRHJhZnR5IGRvYyBmb3Igd3JhcHBpbmcgaW50byBRUSBhcyBhIHJlcGx5OlxuICogIC0gUmVwbGFjZSBmb3J3YXJkaW5nIG1lbnRpb24gd2l0aCBzeW1ib2wgJ+KepicgYW5kIHJlbW92ZSBkYXRhIChVSUQpLlxuICogIC0gUmVtb3ZlIHF1b3RlZCB0ZXh0IGNvbXBsZXRlbHkuXG4gKiAgLSBSZXBsYWNlIGxpbmUgYnJlYWtzIHdpdGggc3BhY2VzLlxuICogIC0gU3RyaXAgZW50aXRpZXMgb2YgaGVhdnkgY29udGVudC5cbiAqICAtIE1vdmUgYXR0YWNobWVudHMgdG8gdGhlIGVuZCBvZiB0aGUgZG9jdW1lbnQuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl8c3RyaW5nfSBvcmlnaW5hbCAtIERyYWZ0eSBvYmplY3QgdG8gc2hvcnRlbi5cbiAqIEBwYXJhbSB7bnVtYmVyfSBsaW1pdCAtIGxlbmd0aCBpbiBjaGFyYWN0ZXJzIHRvIHNob3J0ZW4gdG8uXG4gKiBAcmV0dXJucyBjb252ZXJ0ZWQgRHJhZnR5IG9iamVjdCBsZWF2aW5nIHRoZSBvcmlnaW5hbCBpbnRhY3QuXG4gKi9cbkRyYWZ0eS5yZXBseUNvbnRlbnQgPSBmdW5jdGlvbihvcmlnaW5hbCwgbGltaXQpIHtcbiAgY29uc3QgY29udk1OblFRbkJSID0gZnVuY3Rpb24obm9kZSkge1xuICAgIGlmIChub2RlLnR5cGUgPT0gJ1FRJykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSBlbHNlIGlmIChub2RlLnR5cGUgPT0gJ01OJykge1xuICAgICAgaWYgKCghbm9kZS5wYXJlbnQgfHwgIW5vZGUucGFyZW50LnR5cGUpICYmIChub2RlLnRleHQgfHwgJycpLnN0YXJ0c1dpdGgoJ+KepicpKSB7XG4gICAgICAgIG5vZGUudGV4dCA9ICfinqYnO1xuICAgICAgICBkZWxldGUgbm9kZS5jaGlsZHJlbjtcbiAgICAgICAgZGVsZXRlIG5vZGUuZGF0YTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG5vZGUudHlwZSA9PSAnQlInKSB7XG4gICAgICBub2RlLnRleHQgPSAnICc7XG4gICAgICBkZWxldGUgbm9kZS50eXBlO1xuICAgICAgZGVsZXRlIG5vZGUuY2hpbGRyZW47XG4gICAgfVxuICAgIHJldHVybiBub2RlO1xuICB9XG5cbiAgbGV0IHRyZWUgPSBkcmFmdHlUb1RyZWUob3JpZ2luYWwpO1xuICBpZiAoIXRyZWUpIHtcbiAgICByZXR1cm4gb3JpZ2luYWw7XG4gIH1cblxuICAvLyBTdHJpcCBsZWFkaW5nIG1lbnRpb24uXG4gIHRyZWUgPSB0cmVlVG9wRG93bih0cmVlLCBjb252TU5uUVFuQlIpO1xuICAvLyBNb3ZlIGF0dGFjaG1lbnRzIHRvIHRoZSBlbmQgb2YgdGhlIGRvYy5cbiAgdHJlZSA9IGF0dGFjaG1lbnRzVG9FbmQodHJlZSwgTUFYX1BSRVZJRVdfQVRUQUNITUVOVFMpO1xuICAvLyBTaG9ydGVuIHRoZSBkb2MuXG4gIHRyZWUgPSBzaG9ydGVuVHJlZSh0cmVlLCBsaW1pdCwgJ+KApicpO1xuICAvLyBTdHJpcCBoZWF2eSBlbGVtZW50cyBleGNlcHQgSU0uZGF0YVsndmFsJ10gKGhhdmUgdG8ga2VlcCB0aGVtIHRvIGdlbmVyYXRlIHByZXZpZXdzIGxhdGVyKS5cbiAgdHJlZSA9IHRyZWVUb3BEb3duKHRyZWUsIChub2RlKSA9PiB7XG4gICAgY29uc3QgZGF0YSA9IGNvcHlFbnREYXRhKG5vZGUuZGF0YSwgdHJ1ZSwgKG5vZGUudHlwZSA9PSAnSU0nID8gWyd2YWwnXSA6IG51bGwpKTtcbiAgICBpZiAoZGF0YSkge1xuICAgICAgbm9kZS5kYXRhID0gZGF0YTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVsZXRlIG5vZGUuZGF0YTtcbiAgICB9XG4gICAgcmV0dXJuIG5vZGU7XG4gIH0pO1xuICAvLyBDb252ZXJ0IGJhY2sgdG8gRHJhZnR5LlxuICByZXR1cm4gdHJlZVRvRHJhZnR5KHt9LCB0cmVlLCBbXSk7XG59XG5cblxuLyoqXG4gKiBHZW5lcmF0ZSBkcmFmdHkgcHJldmllOlxuICogIC0gU2hvcnRlbiB0aGUgZG9jdW1lbnQuXG4gKiAgLSBTdHJpcCBhbGwgaGVhdnkgZW50aXR5IGRhdGEgbGVhdmluZyBqdXN0IGlubGluZSBzdHlsZXMgYW5kIGVudGl0eSByZWZlcmVuY2VzLlxuICogIC0gUmVwbGFjZSBsaW5lIGJyZWFrcyB3aXRoIHNwYWNlcy5cbiAqICAtIFJlcGxhY2UgY29udGVudCBvZiBRUSB3aXRoIGEgc3BhY2UuXG4gKiAgLSBSZXBsYWNlIGZvcndhcmRpbmcgbWVudGlvbiB3aXRoIHN5bWJvbCAn4p6mJy5cbiAqIG1vdmUgYWxsIGF0dGFjaG1lbnRzIHRvIHRoZSBlbmQgb2YgdGhlIGRvY3VtZW50IGFuZCBtYWtlIHRoZW0gdmlzaWJsZS5cbiAqIFRoZSA8Y29kZT5jb250ZXh0PC9jb2RlPiBtYXkgZXhwb3NlIGEgZnVuY3Rpb24gPGNvZGU+Z2V0Rm9ybWF0dGVyKHN0eWxlKTwvY29kZT4uIElmIGl0J3MgYXZhaWxhYmxlXG4gKiBpdCB3aWxsIGNhbGwgaXQgdG8gb2J0YWluIGEgPGNvZGU+Zm9ybWF0dGVyPC9jb2RlPiBmb3IgYSBzdWJ0cmVlIG9mIHN0eWxlcyB1bmRlciB0aGUgPGNvZGU+c3R5bGU8L2NvZGU+LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fHN0cmluZ30gb3JpZ2luYWwgLSBEcmFmdHkgb2JqZWN0IHRvIHNob3J0ZW4uXG4gKiBAcGFyYW0ge251bWJlcn0gbGltaXQgLSBsZW5ndGggaW4gY2hhcmFjdGVycyB0byBzaG9ydGVuIHRvLlxuICogQHJldHVybnMgbmV3IHNob3J0ZW5lZCBEcmFmdHkgb2JqZWN0IGxlYXZpbmcgdGhlIG9yaWdpbmFsIGludGFjdC5cbiAqL1xuRHJhZnR5LnByZXZpZXcgPSBmdW5jdGlvbihvcmlnaW5hbCwgbGltaXQpIHtcbiAgbGV0IHRyZWUgPSBkcmFmdHlUb1RyZWUob3JpZ2luYWwpO1xuXG4gIC8vIE1vdmUgYXR0YWNobWVudHMgdG8gdGhlIGVuZC5cbiAgdHJlZSA9IGF0dGFjaG1lbnRzVG9FbmQodHJlZSwgTUFYX1BSRVZJRVdfQVRUQUNITUVOVFMpO1xuXG4gIC8vIENvbnZlcnQgbGVhZGluZyBtZW50aW9uIHRvICfinqYnIGFuZCByZXBsYWNlIFFRIGFuZCBCUiB3aXRoIGEgc3BhY2UgJyAnLlxuICBjb25zdCBjb252TU5uUVFuQlIgPSBmdW5jdGlvbihub2RlKSB7XG4gICAgaWYgKG5vZGUudHlwZSA9PSAnTU4nKSB7XG4gICAgICBpZiAoKCFub2RlLnBhcmVudCB8fCAhbm9kZS5wYXJlbnQudHlwZSkgJiYgKG5vZGUudGV4dCB8fCAnJykuc3RhcnRzV2l0aCgn4p6mJykpIHtcbiAgICAgICAgbm9kZS50ZXh0ID0gJ+Kepic7XG4gICAgICAgIGRlbGV0ZSBub2RlLmNoaWxkcmVuO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAobm9kZS50eXBlID09ICdRUScpIHtcbiAgICAgIG5vZGUudGV4dCA9ICcgJztcbiAgICAgIGRlbGV0ZSBub2RlLmNoaWxkcmVuO1xuICAgIH0gZWxzZSBpZiAobm9kZS50eXBlID09ICdCUicpIHtcbiAgICAgIG5vZGUudGV4dCA9ICcgJztcbiAgICAgIGRlbGV0ZSBub2RlLmNoaWxkcmVuO1xuICAgICAgZGVsZXRlIG5vZGUudHlwZTtcbiAgICB9XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cbiAgdHJlZSA9IHRyZWVUb3BEb3duKHRyZWUsIGNvbnZNTm5RUW5CUik7XG5cbiAgdHJlZSA9IHNob3J0ZW5UcmVlKHRyZWUsIGxpbWl0LCAn4oCmJyk7XG4gIHRyZWUgPSBsaWdodEVudGl0eSh0cmVlKTtcblxuICAvLyBDb252ZXJ0IGJhY2sgdG8gRHJhZnR5LlxuICByZXR1cm4gdHJlZVRvRHJhZnR5KHt9LCB0cmVlLCBbXSk7XG59XG5cbi8qKlxuICogR2l2ZW4gRHJhZnR5IGRvY3VtZW50LCBjb252ZXJ0IGl0IHRvIHBsYWluIHRleHQuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGNvbnRlbnQgLSBkb2N1bWVudCB0byBjb252ZXJ0IHRvIHBsYWluIHRleHQuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBwbGFpbi10ZXh0IHJlcHJlc2VudGF0aW9uIG9mIHRoZSBkcmFmdHkgZG9jdW1lbnQuXG4gKi9cbkRyYWZ0eS50b1BsYWluVGV4dCA9IGZ1bmN0aW9uKGNvbnRlbnQpIHtcbiAgcmV0dXJuIHR5cGVvZiBjb250ZW50ID09ICdzdHJpbmcnID8gY29udGVudCA6IGNvbnRlbnQudHh0O1xufVxuXG4vKipcbiAqIENoZWNrIGlmIHRoZSBkb2N1bWVudCBoYXMgbm8gbWFya3VwIGFuZCBubyBlbnRpdGllcy5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eX0gY29udGVudCAtIGNvbnRlbnQgdG8gY2hlY2sgZm9yIHByZXNlbmNlIG9mIG1hcmt1cC5cbiAqIEByZXR1cm5zIDxjb2RlPnRydWU8L2NvZGU+IGlzIGNvbnRlbnQgaXMgcGxhaW4gdGV4dCwgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAqL1xuRHJhZnR5LmlzUGxhaW5UZXh0ID0gZnVuY3Rpb24oY29udGVudCkge1xuICByZXR1cm4gdHlwZW9mIGNvbnRlbnQgPT0gJ3N0cmluZycgfHwgIShjb250ZW50LmZtdCB8fCBjb250ZW50LmVudCk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIHRoZSBvYmplY3QgcmVwcmVzZXRzIGlzIGEgdmFsaWQgRHJhZnR5IGRvY3VtZW50LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fSBjb250ZW50IC0gY29udGVudCB0byBjaGVjayBmb3IgdmFsaWRpdHkuXG4gKiBAcmV0dXJucyA8Y29kZT50cnVlPC9jb2RlPiBpcyBjb250ZW50IGlzIHZhbGlkLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICovXG5EcmFmdHkuaXNWYWxpZCA9IGZ1bmN0aW9uKGNvbnRlbnQpIHtcbiAgaWYgKCFjb250ZW50KSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3Qge1xuICAgIHR4dCxcbiAgICBmbXQsXG4gICAgZW50XG4gIH0gPSBjb250ZW50O1xuXG4gIGlmICghdHh0ICYmIHR4dCAhPT0gJycgJiYgIWZtdCAmJiAhZW50KSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3QgdHh0X3R5cGUgPSB0eXBlb2YgdHh0O1xuICBpZiAodHh0X3R5cGUgIT0gJ3N0cmluZycgJiYgdHh0X3R5cGUgIT0gJ3VuZGVmaW5lZCcgJiYgdHh0ICE9PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBmbXQgIT0gJ3VuZGVmaW5lZCcgJiYgIUFycmF5LmlzQXJyYXkoZm10KSAmJiBmbXQgIT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAodHlwZW9mIGVudCAhPSAndW5kZWZpbmVkJyAmJiAhQXJyYXkuaXNBcnJheShlbnQpICYmIGVudCAhPT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLyoqXG4gKiBDaGVjayBpZiB0aGUgZHJhZnR5IGRvY3VtZW50IGhhcyBhdHRhY2htZW50czogc3R5bGUgRVggYW5kIG91dHNpZGUgb2Ygbm9ybWFsIHJlbmRlcmluZyBmbG93LFxuICogaS5lLiA8Y29kZT5hdCA9IC0xPC9jb2RlPi5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eX0gY29udGVudCAtIGRvY3VtZW50IHRvIGNoZWNrIGZvciBhdHRhY2htZW50cy5cbiAqIEByZXR1cm5zIDxjb2RlPnRydWU8L2NvZGU+IGlmIHRoZXJlIGFyZSBhdHRhY2htZW50cy5cbiAqL1xuRHJhZnR5Lmhhc0F0dGFjaG1lbnRzID0gZnVuY3Rpb24oY29udGVudCkge1xuICBpZiAoIUFycmF5LmlzQXJyYXkoY29udGVudC5mbXQpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGZvciAobGV0IGkgaW4gY29udGVudC5mbXQpIHtcbiAgICBjb25zdCBmbXQgPSBjb250ZW50LmZtdFtpXTtcbiAgICBpZiAoZm10ICYmIGZtdC5hdCA8IDApIHtcbiAgICAgIGNvbnN0IGVudCA9IGNvbnRlbnQuZW50W2ZtdC5rZXkgfCAwXTtcbiAgICAgIHJldHVybiBlbnQgJiYgZW50LnRwID09ICdFWCcgJiYgZW50LmRhdGE7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBDYWxsYmFjayBmb3IgYXBwbHlpbmcgY3VzdG9tIGZvcm1hdHRpbmcvdHJhbnNmb3JtYXRpb24gdG8gYSBEcmFmdHkgZG9jdW1lbnQuXG4gKiBDYWxsZWQgb25jZSBmb3IgZWFjaCBlbnRpdHkuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQGNhbGxiYWNrIEVudGl0eUNhbGxiYWNrXG4gKiBAcGFyYW0ge09iamVjdH0gZGF0YSBlbnRpdHkgZGF0YS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBlbnRpdHkgdHlwZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCBlbnRpdHkncyBpbmRleCBpbiBgY29udGVudC5lbnRgLlxuICovXG5cbi8qKlxuICogRW51bWVyYXRlIGF0dGFjaG1lbnRzOiBzdHlsZSBFWCBhbmQgb3V0c2lkZSBvZiBub3JtYWwgcmVuZGVyaW5nIGZsb3csIGkuZS4gPGNvZGU+YXQgPSAtMTwvY29kZT4uXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGNvbnRlbnQgLSBkb2N1bWVudCB0byBwcm9jZXNzIGZvciBhdHRhY2htZW50cy5cbiAqIEBwYXJhbSB7RW50aXR5Q2FsbGJhY2t9IGNhbGxiYWNrIC0gY2FsbGJhY2sgdG8gY2FsbCBmb3IgZWFjaCBhdHRhY2htZW50LlxuICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHQgLSB2YWx1ZSBvZiBcInRoaXNcIiBmb3IgY2FsbGJhY2suXG4gKi9cbkRyYWZ0eS5hdHRhY2htZW50cyA9IGZ1bmN0aW9uKGNvbnRlbnQsIGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gIGlmICghQXJyYXkuaXNBcnJheShjb250ZW50LmZtdCkpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgbGV0IGkgPSAwO1xuICBjb250ZW50LmZtdC5mb3JFYWNoKGZtdCA9PiB7XG4gICAgaWYgKGZtdCAmJiBmbXQuYXQgPCAwKSB7XG4gICAgICBjb25zdCBlbnQgPSBjb250ZW50LmVudFtmbXQua2V5IHwgMF07XG4gICAgICBpZiAoZW50ICYmIGVudC50cCA9PSAnRVgnICYmIGVudC5kYXRhKSB7XG4gICAgICAgIGNhbGxiYWNrLmNhbGwoY29udGV4dCwgZW50LmRhdGEsIGkrKywgJ0VYJyk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn1cblxuLyoqXG4gKiBDaGVjayBpZiB0aGUgZHJhZnR5IGRvY3VtZW50IGhhcyBlbnRpdGllcy5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eX0gY29udGVudCAtIGRvY3VtZW50IHRvIGNoZWNrIGZvciBlbnRpdGllcy5cbiAqIEByZXR1cm5zIDxjb2RlPnRydWU8L2NvZGU+IGlmIHRoZXJlIGFyZSBlbnRpdGllcy5cbiAqL1xuRHJhZnR5Lmhhc0VudGl0aWVzID0gZnVuY3Rpb24oY29udGVudCkge1xuICByZXR1cm4gY29udGVudC5lbnQgJiYgY29udGVudC5lbnQubGVuZ3RoID4gMDtcbn1cblxuLyoqXG4gKiBFbnVtZXJhdGUgZW50aXRpZXMuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGNvbnRlbnQgLSBkb2N1bWVudCB3aXRoIGVudGl0aWVzIHRvIGVudW1lcmF0ZS5cbiAqIEBwYXJhbSB7RW50aXR5Q2FsbGJhY2t9IGNhbGxiYWNrIC0gY2FsbGJhY2sgdG8gY2FsbCBmb3IgZWFjaCBlbnRpdHkuXG4gKiBAcGFyYW0ge09iamVjdH0gY29udGV4dCAtIHZhbHVlIG9mIFwidGhpc1wiIGZvciBjYWxsYmFjay5cbiAqL1xuRHJhZnR5LmVudGl0aWVzID0gZnVuY3Rpb24oY29udGVudCwgY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgaWYgKGNvbnRlbnQuZW50ICYmIGNvbnRlbnQuZW50Lmxlbmd0aCA+IDApIHtcbiAgICBmb3IgKGxldCBpIGluIGNvbnRlbnQuZW50KSB7XG4gICAgICBpZiAoY29udGVudC5lbnRbaV0pIHtcbiAgICAgICAgY2FsbGJhY2suY2FsbChjb250ZXh0LCBjb250ZW50LmVudFtpXS5kYXRhLCBpLCBjb250ZW50LmVudFtpXS50cCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogUmVtb3ZlIHVucmVjb2duaXplZCBmaWVsZHMgZnJvbSBlbnRpdHkgZGF0YVxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fSBjb250ZW50IC0gZG9jdW1lbnQgd2l0aCBlbnRpdGllcyB0byBlbnVtZXJhdGUuXG4gKiBAcmV0dXJucyBjb250ZW50LlxuICovXG5EcmFmdHkuc2FuaXRpemVFbnRpdGllcyA9IGZ1bmN0aW9uKGNvbnRlbnQpIHtcbiAgaWYgKGNvbnRlbnQgJiYgY29udGVudC5lbnQgJiYgY29udGVudC5lbnQubGVuZ3RoID4gMCkge1xuICAgIGZvciAobGV0IGkgaW4gY29udGVudC5lbnQpIHtcbiAgICAgIGNvbnN0IGVudCA9IGNvbnRlbnQuZW50W2ldO1xuICAgICAgaWYgKGVudCAmJiBlbnQuZGF0YSkge1xuICAgICAgICBjb25zdCBkYXRhID0gY29weUVudERhdGEoZW50LmRhdGEpO1xuICAgICAgICBpZiAoZGF0YSkge1xuICAgICAgICAgIGNvbnRlbnQuZW50W2ldLmRhdGEgPSBkYXRhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRlbGV0ZSBjb250ZW50LmVudFtpXS5kYXRhO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBjb250ZW50O1xufVxuXG4vKipcbiAqIEdpdmVuIHRoZSBlbnRpdHksIGdldCBVUkwgd2hpY2ggY2FuIGJlIHVzZWQgZm9yIGRvd25sb2FkaW5nXG4gKiBlbnRpdHkgZGF0YS5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZW50RGF0YSAtIGVudGl0eS5kYXRhIHRvIGdldCB0aGUgVVJsIGZyb20uXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBVUkwgdG8gZG93bmxvYWQgZW50aXR5IGRhdGEgb3IgPGNvZGU+bnVsbDwvY29kZT4uXG4gKi9cbkRyYWZ0eS5nZXREb3dubG9hZFVybCA9IGZ1bmN0aW9uKGVudERhdGEpIHtcbiAgbGV0IHVybCA9IG51bGw7XG4gIGlmIChlbnREYXRhLm1pbWUgIT0gSlNPTl9NSU1FX1RZUEUgJiYgZW50RGF0YS52YWwpIHtcbiAgICB1cmwgPSBiYXNlNjR0b09iamVjdFVybChlbnREYXRhLnZhbCwgZW50RGF0YS5taW1lLCBEcmFmdHkubG9nZ2VyKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZW50RGF0YS5yZWYgPT0gJ3N0cmluZycpIHtcbiAgICB1cmwgPSBlbnREYXRhLnJlZjtcbiAgfVxuICByZXR1cm4gdXJsO1xufVxuXG4vKipcbiAqIENoZWNrIGlmIHRoZSBlbnRpdHkgZGF0YSBpcyBub3QgcmVhZHkgZm9yIHNlbmRpbmcsIHN1Y2ggYXMgYmVpbmcgdXBsb2FkZWQgdG8gdGhlIHNlcnZlci5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZW50aXR5LmRhdGEgdG8gZ2V0IHRoZSBVUmwgZnJvbS5cbiAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIHVwbG9hZCBpcyBpbiBwcm9ncmVzcywgZmFsc2Ugb3RoZXJ3aXNlLlxuICovXG5EcmFmdHkuaXNQcm9jZXNzaW5nID0gZnVuY3Rpb24oZW50RGF0YSkge1xuICByZXR1cm4gISFlbnREYXRhLl9wcm9jZXNzaW5nO1xufVxuXG4vKipcbiAqIEdpdmVuIHRoZSBlbnRpdHksIGdldCBVUkwgd2hpY2ggY2FuIGJlIHVzZWQgZm9yIHByZXZpZXdpbmdcbiAqIHRoZSBlbnRpdHkuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGVudGl0eS5kYXRhIHRvIGdldCB0aGUgVVJsIGZyb20uXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gdXJsIGZvciBwcmV2aWV3aW5nIG9yIG51bGwgaWYgbm8gc3VjaCB1cmwgaXMgYXZhaWxhYmxlLlxuICovXG5EcmFmdHkuZ2V0UHJldmlld1VybCA9IGZ1bmN0aW9uKGVudERhdGEpIHtcbiAgcmV0dXJuIGVudERhdGEudmFsID8gYmFzZTY0dG9PYmplY3RVcmwoZW50RGF0YS52YWwsIGVudERhdGEubWltZSwgRHJhZnR5LmxvZ2dlcikgOiBudWxsO1xufVxuXG4vKipcbiAqIEdldCBhcHByb3hpbWF0ZSBzaXplIG9mIHRoZSBlbnRpdHkuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGVudERhdGEgLSBlbnRpdHkuZGF0YSB0byBnZXQgdGhlIHNpemUgZm9yLlxuICogQHJldHVybnMge251bWJlcn0gc2l6ZSBvZiBlbnRpdHkgZGF0YSBpbiBieXRlcy5cbiAqL1xuRHJhZnR5LmdldEVudGl0eVNpemUgPSBmdW5jdGlvbihlbnREYXRhKSB7XG4gIC8vIEVpdGhlciBzaXplIGhpbnQgb3IgbGVuZ3RoIG9mIHZhbHVlLiBUaGUgdmFsdWUgaXMgYmFzZTY0IGVuY29kZWQsXG4gIC8vIHRoZSBhY3R1YWwgb2JqZWN0IHNpemUgaXMgc21hbGxlciB0aGFuIHRoZSBlbmNvZGVkIGxlbmd0aC5cbiAgcmV0dXJuIGVudERhdGEuc2l6ZSA/IGVudERhdGEuc2l6ZSA6IGVudERhdGEudmFsID8gKGVudERhdGEudmFsLmxlbmd0aCAqIDAuNzUpIHwgMCA6IDA7XG59XG5cbi8qKlxuICogR2V0IGVudGl0eSBtaW1lIHR5cGUuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGVudERhdGEgLSBlbnRpdHkuZGF0YSB0byBnZXQgdGhlIHR5cGUgZm9yLlxuICogQHJldHVybnMge3N0cmluZ30gbWltZSB0eXBlIG9mIGVudGl0eS5cbiAqL1xuRHJhZnR5LmdldEVudGl0eU1pbWVUeXBlID0gZnVuY3Rpb24oZW50RGF0YSkge1xuICByZXR1cm4gZW50RGF0YS5taW1lIHx8ICd0ZXh0L3BsYWluJztcbn1cblxuLyoqXG4gKiBHZXQgSFRNTCB0YWcgZm9yIGEgZ2l2ZW4gdHdvLWxldHRlciBzdHlsZSBuYW1lLlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHlsZSAtIHR3by1sZXR0ZXIgc3R5bGUsIGxpa2UgU1Qgb3IgTE4uXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gSFRNTCB0YWcgbmFtZSBpZiBzdHlsZSBpcyBmb3VuZCwgJ19VTktOJyBpZiBub3QgZm91bmQsIHtjb2RlOiB1bmRlZmluZWR9IGlmIHN0eWxlIGlzIGZhbHNpc2guXG4gKi9cbkRyYWZ0eS50YWdOYW1lID0gZnVuY3Rpb24oc3R5bGUpIHtcbiAgcmV0dXJuIHN0eWxlID8gKEhUTUxfVEFHU1tzdHlsZV0gPyBIVE1MX1RBR1Nbc3R5bGVdLm5hbWUgOiAnX1VOS04nKSA6IHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBGb3IgYSBnaXZlbiBkYXRhIGJ1bmRsZSBnZW5lcmF0ZSBhbiBvYmplY3Qgd2l0aCBIVE1MIGF0dHJpYnV0ZXMsXG4gKiBmb3IgaW5zdGFuY2UsIGdpdmVuIHt1cmw6IFwiaHR0cDovL3d3dy5leGFtcGxlLmNvbS9cIn0gcmV0dXJuXG4gKiB7aHJlZjogXCJodHRwOi8vd3d3LmV4YW1wbGUuY29tL1wifVxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHlsZSAtIHR3by1sZXR0ZXIgc3R5bGUgdG8gZ2VuZXJhdGUgYXR0cmlidXRlcyBmb3IuXG4gKiBAcGFyYW0ge09iamVjdH0gZGF0YSAtIGRhdGEgYnVuZGxlIHRvIGNvbnZlcnQgdG8gYXR0cmlidXRlc1xuICpcbiAqIEByZXR1cm5zIHtPYmplY3R9IG9iamVjdCB3aXRoIEhUTUwgYXR0cmlidXRlcy5cbiAqL1xuRHJhZnR5LmF0dHJWYWx1ZSA9IGZ1bmN0aW9uKHN0eWxlLCBkYXRhKSB7XG4gIGlmIChkYXRhICYmIERFQ09SQVRPUlNbc3R5bGVdKSB7XG4gICAgcmV0dXJuIERFQ09SQVRPUlNbc3R5bGVdLnByb3BzKGRhdGEpO1xuICB9XG5cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBEcmFmdHkgTUlNRSB0eXBlLlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9IGNvbnRlbnQtVHlwZSBcInRleHQveC1kcmFmdHlcIi5cbiAqL1xuRHJhZnR5LmdldENvbnRlbnRUeXBlID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBEUkFGVFlfTUlNRV9UWVBFO1xufVxuXG4vLyA9PT09PT09PT09PT09PT09PVxuLy8gVXRpbGl0eSBtZXRob2RzLlxuLy8gPT09PT09PT09PT09PT09PT1cblxuLy8gVGFrZSBhIHN0cmluZyBhbmQgZGVmaW5lZCBlYXJsaWVyIHN0eWxlIHNwYW5zLCByZS1jb21wb3NlIHRoZW0gaW50byBhIHRyZWUgd2hlcmUgZWFjaCBsZWFmIGlzXG4vLyBhIHNhbWUtc3R5bGUgKGluY2x1ZGluZyB1bnN0eWxlZCkgc3RyaW5nLiBJLmUuICdoZWxsbyAqYm9sZCBfaXRhbGljXyogYW5kIH5tb3JlfiB3b3JsZCcgLT5cbi8vICgnaGVsbG8gJywgKGI6ICdib2xkICcsIChpOiAnaXRhbGljJykpLCAnIGFuZCAnLCAoczogJ21vcmUnKSwgJyB3b3JsZCcpO1xuLy9cbi8vIFRoaXMgaXMgbmVlZGVkIGluIG9yZGVyIHRvIGNsZWFyIG1hcmt1cCwgaS5lLiAnaGVsbG8gKndvcmxkKicgLT4gJ2hlbGxvIHdvcmxkJyBhbmQgY29udmVydFxuLy8gcmFuZ2VzIGZyb20gbWFya3VwLWVkIG9mZnNldHMgdG8gcGxhaW4gdGV4dCBvZmZzZXRzLlxuZnVuY3Rpb24gY2h1bmtpZnkobGluZSwgc3RhcnQsIGVuZCwgc3BhbnMpIHtcbiAgY29uc3QgY2h1bmtzID0gW107XG5cbiAgaWYgKHNwYW5zLmxlbmd0aCA9PSAwKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgZm9yIChsZXQgaSBpbiBzcGFucykge1xuICAgIC8vIEdldCB0aGUgbmV4dCBjaHVuayBmcm9tIHRoZSBxdWV1ZVxuICAgIGNvbnN0IHNwYW4gPSBzcGFuc1tpXTtcblxuICAgIC8vIEdyYWIgdGhlIGluaXRpYWwgdW5zdHlsZWQgY2h1bmtcbiAgICBpZiAoc3Bhbi5hdCA+IHN0YXJ0KSB7XG4gICAgICBjaHVua3MucHVzaCh7XG4gICAgICAgIHR4dDogbGluZS5zbGljZShzdGFydCwgc3Bhbi5hdClcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIEdyYWIgdGhlIHN0eWxlZCBjaHVuay4gSXQgbWF5IGluY2x1ZGUgc3ViY2h1bmtzLlxuICAgIGNvbnN0IGNodW5rID0ge1xuICAgICAgdHA6IHNwYW4udHBcbiAgICB9O1xuICAgIGNvbnN0IGNobGQgPSBjaHVua2lmeShsaW5lLCBzcGFuLmF0ICsgMSwgc3Bhbi5lbmQsIHNwYW4uY2hpbGRyZW4pO1xuICAgIGlmIChjaGxkLmxlbmd0aCA+IDApIHtcbiAgICAgIGNodW5rLmNoaWxkcmVuID0gY2hsZDtcbiAgICB9IGVsc2Uge1xuICAgICAgY2h1bmsudHh0ID0gc3Bhbi50eHQ7XG4gICAgfVxuICAgIGNodW5rcy5wdXNoKGNodW5rKTtcbiAgICBzdGFydCA9IHNwYW4uZW5kICsgMTsgLy8gJysxJyBpcyB0byBza2lwIHRoZSBmb3JtYXR0aW5nIGNoYXJhY3RlclxuICB9XG5cbiAgLy8gR3JhYiB0aGUgcmVtYWluaW5nIHVuc3R5bGVkIGNodW5rLCBhZnRlciB0aGUgbGFzdCBzcGFuXG4gIGlmIChzdGFydCA8IGVuZCkge1xuICAgIGNodW5rcy5wdXNoKHtcbiAgICAgIHR4dDogbGluZS5zbGljZShzdGFydCwgZW5kKVxuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIGNodW5rcztcbn1cblxuLy8gRGV0ZWN0IHN0YXJ0cyBhbmQgZW5kcyBvZiBmb3JtYXR0aW5nIHNwYW5zLiBVbmZvcm1hdHRlZCBzcGFucyBhcmVcbi8vIGlnbm9yZWQgYXQgdGhpcyBzdGFnZS5cbmZ1bmN0aW9uIHNwYW5uaWZ5KG9yaWdpbmFsLCByZV9zdGFydCwgcmVfZW5kLCB0eXBlKSB7XG4gIGNvbnN0IHJlc3VsdCA9IFtdO1xuICBsZXQgaW5kZXggPSAwO1xuICBsZXQgbGluZSA9IG9yaWdpbmFsLnNsaWNlKDApOyAvLyBtYWtlIGEgY29weTtcblxuICB3aGlsZSAobGluZS5sZW5ndGggPiAwKSB7XG4gICAgLy8gbWF0Y2hbMF07IC8vIG1hdGNoLCBsaWtlICcqYWJjKidcbiAgICAvLyBtYXRjaFsxXTsgLy8gbWF0Y2ggY2FwdHVyZWQgaW4gcGFyZW50aGVzaXMsIGxpa2UgJ2FiYydcbiAgICAvLyBtYXRjaFsnaW5kZXgnXTsgLy8gb2Zmc2V0IHdoZXJlIHRoZSBtYXRjaCBzdGFydGVkLlxuXG4gICAgLy8gRmluZCB0aGUgb3BlbmluZyB0b2tlbi5cbiAgICBjb25zdCBzdGFydCA9IHJlX3N0YXJ0LmV4ZWMobGluZSk7XG4gICAgaWYgKHN0YXJ0ID09IG51bGwpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIC8vIEJlY2F1c2UgamF2YXNjcmlwdCBSZWdFeHAgZG9lcyBub3Qgc3VwcG9ydCBsb29rYmVoaW5kLCB0aGUgYWN0dWFsIG9mZnNldCBtYXkgbm90IHBvaW50XG4gICAgLy8gYXQgdGhlIG1hcmt1cCBjaGFyYWN0ZXIuIEZpbmQgaXQgaW4gdGhlIG1hdGNoZWQgc3RyaW5nLlxuICAgIGxldCBzdGFydF9vZmZzZXQgPSBzdGFydFsnaW5kZXgnXSArIHN0YXJ0WzBdLmxhc3RJbmRleE9mKHN0YXJ0WzFdKTtcbiAgICAvLyBDbGlwIHRoZSBwcm9jZXNzZWQgcGFydCBvZiB0aGUgc3RyaW5nLlxuICAgIGxpbmUgPSBsaW5lLnNsaWNlKHN0YXJ0X29mZnNldCArIDEpO1xuICAgIC8vIHN0YXJ0X29mZnNldCBpcyBhbiBvZmZzZXQgd2l0aGluIHRoZSBjbGlwcGVkIHN0cmluZy4gQ29udmVydCB0byBvcmlnaW5hbCBpbmRleC5cbiAgICBzdGFydF9vZmZzZXQgKz0gaW5kZXg7XG4gICAgLy8gSW5kZXggbm93IHBvaW50IHRvIHRoZSBiZWdpbm5pbmcgb2YgJ2xpbmUnIHdpdGhpbiB0aGUgJ29yaWdpbmFsJyBzdHJpbmcuXG4gICAgaW5kZXggPSBzdGFydF9vZmZzZXQgKyAxO1xuXG4gICAgLy8gRmluZCB0aGUgbWF0Y2hpbmcgY2xvc2luZyB0b2tlbi5cbiAgICBjb25zdCBlbmQgPSByZV9lbmQgPyByZV9lbmQuZXhlYyhsaW5lKSA6IG51bGw7XG4gICAgaWYgKGVuZCA9PSBudWxsKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgbGV0IGVuZF9vZmZzZXQgPSBlbmRbJ2luZGV4J10gKyBlbmRbMF0uaW5kZXhPZihlbmRbMV0pO1xuICAgIC8vIENsaXAgdGhlIHByb2Nlc3NlZCBwYXJ0IG9mIHRoZSBzdHJpbmcuXG4gICAgbGluZSA9IGxpbmUuc2xpY2UoZW5kX29mZnNldCArIDEpO1xuICAgIC8vIFVwZGF0ZSBvZmZzZXRzXG4gICAgZW5kX29mZnNldCArPSBpbmRleDtcbiAgICAvLyBJbmRleCBub3cgcG9pbnRzIHRvIHRoZSBiZWdpbm5pbmcgb2YgJ2xpbmUnIHdpdGhpbiB0aGUgJ29yaWdpbmFsJyBzdHJpbmcuXG4gICAgaW5kZXggPSBlbmRfb2Zmc2V0ICsgMTtcblxuICAgIHJlc3VsdC5wdXNoKHtcbiAgICAgIHR4dDogb3JpZ2luYWwuc2xpY2Uoc3RhcnRfb2Zmc2V0ICsgMSwgZW5kX29mZnNldCksXG4gICAgICBjaGlsZHJlbjogW10sXG4gICAgICBhdDogc3RhcnRfb2Zmc2V0LFxuICAgICAgZW5kOiBlbmRfb2Zmc2V0LFxuICAgICAgdHA6IHR5cGVcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8vIENvbnZlcnQgbGluZWFyIGFycmF5IG9yIHNwYW5zIGludG8gYSB0cmVlIHJlcHJlc2VudGF0aW9uLlxuLy8gS2VlcCBzdGFuZGFsb25lIGFuZCBuZXN0ZWQgc3BhbnMsIHRocm93IGF3YXkgcGFydGlhbGx5IG92ZXJsYXBwaW5nIHNwYW5zLlxuZnVuY3Rpb24gdG9TcGFuVHJlZShzcGFucykge1xuICBpZiAoc3BhbnMubGVuZ3RoID09IDApIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBjb25zdCB0cmVlID0gW3NwYW5zWzBdXTtcbiAgbGV0IGxhc3QgPSBzcGFuc1swXTtcbiAgZm9yIChsZXQgaSA9IDE7IGkgPCBzcGFucy5sZW5ndGg7IGkrKykge1xuICAgIC8vIEtlZXAgc3BhbnMgd2hpY2ggc3RhcnQgYWZ0ZXIgdGhlIGVuZCBvZiB0aGUgcHJldmlvdXMgc3BhbiBvciB0aG9zZSB3aGljaFxuICAgIC8vIGFyZSBjb21wbGV0ZSB3aXRoaW4gdGhlIHByZXZpb3VzIHNwYW4uXG4gICAgaWYgKHNwYW5zW2ldLmF0ID4gbGFzdC5lbmQpIHtcbiAgICAgIC8vIFNwYW4gaXMgY29tcGxldGVseSBvdXRzaWRlIG9mIHRoZSBwcmV2aW91cyBzcGFuLlxuICAgICAgdHJlZS5wdXNoKHNwYW5zW2ldKTtcbiAgICAgIGxhc3QgPSBzcGFuc1tpXTtcbiAgICB9IGVsc2UgaWYgKHNwYW5zW2ldLmVuZCA8PSBsYXN0LmVuZCkge1xuICAgICAgLy8gU3BhbiBpcyBmdWxseSBpbnNpZGUgb2YgdGhlIHByZXZpb3VzIHNwYW4uIFB1c2ggdG8gc3Vibm9kZS5cbiAgICAgIGxhc3QuY2hpbGRyZW4ucHVzaChzcGFuc1tpXSk7XG4gICAgfVxuICAgIC8vIFNwYW4gY291bGQgcGFydGlhbGx5IG92ZXJsYXAsIGlnbm9yaW5nIGl0IGFzIGludmFsaWQuXG4gIH1cblxuICAvLyBSZWN1cnNpdmVseSByZWFycmFuZ2UgdGhlIHN1Ym5vZGVzLlxuICBmb3IgKGxldCBpIGluIHRyZWUpIHtcbiAgICB0cmVlW2ldLmNoaWxkcmVuID0gdG9TcGFuVHJlZSh0cmVlW2ldLmNoaWxkcmVuKTtcbiAgfVxuXG4gIHJldHVybiB0cmVlO1xufVxuXG4vLyBDb252ZXJ0IGRyYWZ0eSBkb2N1bWVudCB0byBhIHRyZWUuXG5mdW5jdGlvbiBkcmFmdHlUb1RyZWUoZG9jKSB7XG4gIGlmICghZG9jKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBkb2MgPSAodHlwZW9mIGRvYyA9PSAnc3RyaW5nJykgPyB7XG4gICAgdHh0OiBkb2NcbiAgfSA6IGRvYztcbiAgbGV0IHtcbiAgICB0eHQsXG4gICAgZm10LFxuICAgIGVudFxuICB9ID0gZG9jO1xuXG4gIHR4dCA9IHR4dCB8fCAnJztcbiAgaWYgKCFBcnJheS5pc0FycmF5KGVudCkpIHtcbiAgICBlbnQgPSBbXTtcbiAgfVxuXG4gIGlmICghQXJyYXkuaXNBcnJheShmbXQpIHx8IGZtdC5sZW5ndGggPT0gMCkge1xuICAgIGlmIChlbnQubGVuZ3RoID09IDApIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHRleHQ6IHR4dFxuICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBIYW5kbGUgc3BlY2lhbCBjYXNlIHdoZW4gYWxsIHZhbHVlcyBpbiBmbXQgYXJlIDAgYW5kIGZtdCB0aGVyZWZvcmUgaXMgc2tpcHBlZC5cbiAgICBmbXQgPSBbe1xuICAgICAgYXQ6IDAsXG4gICAgICBsZW46IDAsXG4gICAgICBrZXk6IDBcbiAgICB9XTtcbiAgfVxuXG4gIC8vIFNhbml0aXplIHNwYW5zLlxuICBjb25zdCBzcGFucyA9IFtdO1xuICBjb25zdCBhdHRhY2htZW50cyA9IFtdO1xuICBmbXQuZm9yRWFjaCgoc3BhbikgPT4ge1xuICAgIGlmICghc3BhbiB8fCB0eXBlb2Ygc3BhbiAhPSAnb2JqZWN0Jykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghWyd1bmRlZmluZWQnLCAnbnVtYmVyJ10uaW5jbHVkZXModHlwZW9mIHNwYW4uYXQpKSB7XG4gICAgICAvLyBQcmVzZW50LCBidXQgbm9uLW51bWVyaWMgJ2F0Jy5cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFbJ3VuZGVmaW5lZCcsICdudW1iZXInXS5pbmNsdWRlcyh0eXBlb2Ygc3Bhbi5sZW4pKSB7XG4gICAgICAvLyBQcmVzZW50LCBidXQgbm9uLW51bWVyaWMgJ2xlbicuXG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGxldCBhdCA9IHNwYW4uYXQgfCAwO1xuICAgIGxldCBsZW4gPSBzcGFuLmxlbiB8IDA7XG4gICAgaWYgKGxlbiA8IDApIHtcbiAgICAgIC8vIEludmFsaWQgc3BhbiBsZW5ndGguXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IGtleSA9IHNwYW4ua2V5IHx8IDA7XG4gICAgaWYgKGVudC5sZW5ndGggPiAwICYmICh0eXBlb2Yga2V5ICE9ICdudW1iZXInIHx8IGtleSA8IDAgfHwga2V5ID49IGVudC5sZW5ndGgpKSB7XG4gICAgICAvLyBJbnZhbGlkIGtleSB2YWx1ZS5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoYXQgPD0gLTEpIHtcbiAgICAgIC8vIEF0dGFjaG1lbnQuIFN0b3JlIGF0dGFjaG1lbnRzIHNlcGFyYXRlbHkuXG4gICAgICBhdHRhY2htZW50cy5wdXNoKHtcbiAgICAgICAgc3RhcnQ6IC0xLFxuICAgICAgICBlbmQ6IDAsXG4gICAgICAgIGtleToga2V5XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9IGVsc2UgaWYgKGF0ICsgbGVuID4gdHh0Lmxlbmd0aCkge1xuICAgICAgLy8gU3BhbiBpcyBvdXQgb2YgYm91bmRzLlxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghc3Bhbi50cCkge1xuICAgICAgaWYgKGVudC5sZW5ndGggPiAwICYmICh0eXBlb2YgZW50W2tleV0gPT0gJ29iamVjdCcpKSB7XG4gICAgICAgIHNwYW5zLnB1c2goe1xuICAgICAgICAgIHN0YXJ0OiBhdCxcbiAgICAgICAgICBlbmQ6IGF0ICsgbGVuLFxuICAgICAgICAgIGtleToga2V5XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzcGFucy5wdXNoKHtcbiAgICAgICAgdHlwZTogc3Bhbi50cCxcbiAgICAgICAgc3RhcnQ6IGF0LFxuICAgICAgICBlbmQ6IGF0ICsgbGVuXG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vIFNvcnQgc3BhbnMgZmlyc3QgYnkgc3RhcnQgaW5kZXggKGFzYykgdGhlbiBieSBsZW5ndGggKGRlc2MpLCB0aGVuIGJ5IHdlaWdodC5cbiAgc3BhbnMuc29ydCgoYSwgYikgPT4ge1xuICAgIGxldCBkaWZmID0gYS5zdGFydCAtIGIuc3RhcnQ7XG4gICAgaWYgKGRpZmYgIT0gMCkge1xuICAgICAgcmV0dXJuIGRpZmY7XG4gICAgfVxuICAgIGRpZmYgPSBiLmVuZCAtIGEuZW5kO1xuICAgIGlmIChkaWZmICE9IDApIHtcbiAgICAgIHJldHVybiBkaWZmO1xuICAgIH1cbiAgICByZXR1cm4gRk1UX1dFSUdIVC5pbmRleE9mKGIudHlwZSkgLSBGTVRfV0VJR0hULmluZGV4T2YoYS50eXBlKTtcbiAgfSk7XG5cbiAgLy8gTW92ZSBhdHRhY2htZW50cyB0byB0aGUgZW5kIG9mIHRoZSBsaXN0LlxuICBpZiAoYXR0YWNobWVudHMubGVuZ3RoID4gMCkge1xuICAgIHNwYW5zLnB1c2goLi4uYXR0YWNobWVudHMpO1xuICB9XG5cbiAgc3BhbnMuZm9yRWFjaCgoc3BhbikgPT4ge1xuICAgIGlmIChlbnQubGVuZ3RoID4gMCAmJiAhc3Bhbi50eXBlICYmIGVudFtzcGFuLmtleV0gJiYgdHlwZW9mIGVudFtzcGFuLmtleV0gPT0gJ29iamVjdCcpIHtcbiAgICAgIHNwYW4udHlwZSA9IGVudFtzcGFuLmtleV0udHA7XG4gICAgICBzcGFuLmRhdGEgPSBlbnRbc3Bhbi5rZXldLmRhdGE7XG4gICAgfVxuXG4gICAgLy8gSXMgdHlwZSBzdGlsbCB1bmRlZmluZWQ/IEhpZGUgdGhlIGludmFsaWQgZWxlbWVudCFcbiAgICBpZiAoIXNwYW4udHlwZSkge1xuICAgICAgc3Bhbi50eXBlID0gJ0hEJztcbiAgICB9XG4gIH0pO1xuXG4gIGxldCB0cmVlID0gc3BhbnNUb1RyZWUoe30sIHR4dCwgMCwgdHh0Lmxlbmd0aCwgc3BhbnMpO1xuXG4gIC8vIEZsYXR0ZW4gdHJlZSBub2Rlcy5cbiAgY29uc3QgZmxhdHRlbiA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShub2RlLmNoaWxkcmVuKSAmJiBub2RlLmNoaWxkcmVuLmxlbmd0aCA9PSAxKSB7XG4gICAgICAvLyBVbndyYXAuXG4gICAgICBjb25zdCBjaGlsZCA9IG5vZGUuY2hpbGRyZW5bMF07XG4gICAgICBpZiAoIW5vZGUudHlwZSkge1xuICAgICAgICBjb25zdCBwYXJlbnQgPSBub2RlLnBhcmVudDtcbiAgICAgICAgbm9kZSA9IGNoaWxkO1xuICAgICAgICBub2RlLnBhcmVudCA9IHBhcmVudDtcbiAgICAgIH0gZWxzZSBpZiAoIWNoaWxkLnR5cGUgJiYgIWNoaWxkLmNoaWxkcmVuKSB7XG4gICAgICAgIG5vZGUudGV4dCA9IGNoaWxkLnRleHQ7XG4gICAgICAgIGRlbGV0ZSBub2RlLmNoaWxkcmVuO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuICB0cmVlID0gdHJlZVRvcERvd24odHJlZSwgZmxhdHRlbik7XG5cbiAgcmV0dXJuIHRyZWU7XG59XG5cbi8vIEFkZCB0cmVlIG5vZGUgdG8gYSBwYXJlbnQgdHJlZS5cbmZ1bmN0aW9uIGFkZE5vZGUocGFyZW50LCBuKSB7XG4gIGlmICghbikge1xuICAgIHJldHVybiBwYXJlbnQ7XG4gIH1cblxuICBpZiAoIXBhcmVudC5jaGlsZHJlbikge1xuICAgIHBhcmVudC5jaGlsZHJlbiA9IFtdO1xuICB9XG5cbiAgLy8gSWYgdGV4dCBpcyBwcmVzZW50LCBtb3ZlIGl0IHRvIGEgc3Vibm9kZS5cbiAgaWYgKHBhcmVudC50ZXh0KSB7XG4gICAgcGFyZW50LmNoaWxkcmVuLnB1c2goe1xuICAgICAgdGV4dDogcGFyZW50LnRleHQsXG4gICAgICBwYXJlbnQ6IHBhcmVudFxuICAgIH0pO1xuICAgIGRlbGV0ZSBwYXJlbnQudGV4dDtcbiAgfVxuXG4gIG4ucGFyZW50ID0gcGFyZW50O1xuICBwYXJlbnQuY2hpbGRyZW4ucHVzaChuKTtcblxuICByZXR1cm4gcGFyZW50O1xufVxuXG4vLyBSZXR1cm5zIGEgdHJlZSBvZiBub2Rlcy5cbmZ1bmN0aW9uIHNwYW5zVG9UcmVlKHBhcmVudCwgdGV4dCwgc3RhcnQsIGVuZCwgc3BhbnMpIHtcbiAgaWYgKCFzcGFucyB8fCBzcGFucy5sZW5ndGggPT0gMCkge1xuICAgIGlmIChzdGFydCA8IGVuZCkge1xuICAgICAgYWRkTm9kZShwYXJlbnQsIHtcbiAgICAgICAgdGV4dDogdGV4dC5zdWJzdHJpbmcoc3RhcnQsIGVuZClcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gcGFyZW50O1xuICB9XG5cbiAgLy8gUHJvY2VzcyBzdWJzcGFucy5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzcGFucy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHNwYW4gPSBzcGFuc1tpXTtcbiAgICBpZiAoc3Bhbi5zdGFydCA8IDAgJiYgc3Bhbi50eXBlID09ICdFWCcpIHtcbiAgICAgIGFkZE5vZGUocGFyZW50LCB7XG4gICAgICAgIHR5cGU6IHNwYW4udHlwZSxcbiAgICAgICAgZGF0YTogc3Bhbi5kYXRhLFxuICAgICAgICBrZXk6IHNwYW4ua2V5LFxuICAgICAgICBhdHQ6IHRydWVcbiAgICAgIH0pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gQWRkIHVuLXN0eWxlZCByYW5nZSBiZWZvcmUgdGhlIHN0eWxlZCBzcGFuIHN0YXJ0cy5cbiAgICBpZiAoc3RhcnQgPCBzcGFuLnN0YXJ0KSB7XG4gICAgICBhZGROb2RlKHBhcmVudCwge1xuICAgICAgICB0ZXh0OiB0ZXh0LnN1YnN0cmluZyhzdGFydCwgc3Bhbi5zdGFydClcbiAgICAgIH0pO1xuICAgICAgc3RhcnQgPSBzcGFuLnN0YXJ0O1xuICAgIH1cblxuICAgIC8vIEdldCBhbGwgc3BhbnMgd2hpY2ggYXJlIHdpdGhpbiB0aGUgY3VycmVudCBzcGFuLlxuICAgIGNvbnN0IHN1YnNwYW5zID0gW107XG4gICAgd2hpbGUgKGkgPCBzcGFucy5sZW5ndGggLSAxKSB7XG4gICAgICBjb25zdCBpbm5lciA9IHNwYW5zW2kgKyAxXTtcbiAgICAgIGlmIChpbm5lci5zdGFydCA8IDApIHtcbiAgICAgICAgLy8gQXR0YWNobWVudHMgYXJlIGluIHRoZSBlbmQuIFN0b3AuXG4gICAgICAgIGJyZWFrO1xuICAgICAgfSBlbHNlIGlmIChpbm5lci5zdGFydCA8IHNwYW4uZW5kKSB7XG4gICAgICAgIGlmIChpbm5lci5lbmQgPD0gc3Bhbi5lbmQpIHtcbiAgICAgICAgICBjb25zdCB0YWcgPSBIVE1MX1RBR1NbaW5uZXIudHBdIHx8IHt9O1xuICAgICAgICAgIGlmIChpbm5lci5zdGFydCA8IGlubmVyLmVuZCB8fCB0YWcuaXNWb2lkKSB7XG4gICAgICAgICAgICAvLyBWYWxpZCBzdWJzcGFuOiBjb21wbGV0ZWx5IHdpdGhpbiB0aGUgY3VycmVudCBzcGFuIGFuZFxuICAgICAgICAgICAgLy8gZWl0aGVyIG5vbi16ZXJvIGxlbmd0aCBvciB6ZXJvIGxlbmd0aCBpcyBhY2NlcHRhYmxlLlxuICAgICAgICAgICAgc3Vic3BhbnMucHVzaChpbm5lcik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGkrKztcbiAgICAgICAgLy8gT3ZlcmxhcHBpbmcgc3Vic3BhbnMgYXJlIGlnbm9yZWQuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBQYXN0IHRoZSBlbmQgb2YgdGhlIGN1cnJlbnQgc3Bhbi4gU3RvcC5cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgYWRkTm9kZShwYXJlbnQsIHNwYW5zVG9UcmVlKHtcbiAgICAgIHR5cGU6IHNwYW4udHlwZSxcbiAgICAgIGRhdGE6IHNwYW4uZGF0YSxcbiAgICAgIGtleTogc3Bhbi5rZXlcbiAgICB9LCB0ZXh0LCBzdGFydCwgc3Bhbi5lbmQsIHN1YnNwYW5zKSk7XG4gICAgc3RhcnQgPSBzcGFuLmVuZDtcbiAgfVxuXG4gIC8vIEFkZCB0aGUgbGFzdCB1bmZvcm1hdHRlZCByYW5nZS5cbiAgaWYgKHN0YXJ0IDwgZW5kKSB7XG4gICAgYWRkTm9kZShwYXJlbnQsIHtcbiAgICAgIHRleHQ6IHRleHQuc3Vic3RyaW5nKHN0YXJ0LCBlbmQpXG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gcGFyZW50O1xufVxuXG4vLyBBcHBlbmQgYSB0cmVlIHRvIGEgRHJhZnR5IGRvYy5cbmZ1bmN0aW9uIHRyZWVUb0RyYWZ0eShkb2MsIHRyZWUsIGtleW1hcCkge1xuICBpZiAoIXRyZWUpIHtcbiAgICByZXR1cm4gZG9jO1xuICB9XG5cbiAgZG9jLnR4dCA9IGRvYy50eHQgfHwgJyc7XG5cbiAgLy8gQ2hlY2twb2ludCB0byBtZWFzdXJlIGxlbmd0aCBvZiB0aGUgY3VycmVudCB0cmVlIG5vZGUuXG4gIGNvbnN0IHN0YXJ0ID0gZG9jLnR4dC5sZW5ndGg7XG5cbiAgaWYgKHRyZWUudGV4dCkge1xuICAgIGRvYy50eHQgKz0gdHJlZS50ZXh0O1xuICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkodHJlZS5jaGlsZHJlbikpIHtcbiAgICB0cmVlLmNoaWxkcmVuLmZvckVhY2goKGMpID0+IHtcbiAgICAgIHRyZWVUb0RyYWZ0eShkb2MsIGMsIGtleW1hcCk7XG4gICAgfSk7XG4gIH1cblxuICBpZiAodHJlZS50eXBlKSB7XG4gICAgY29uc3QgbGVuID0gZG9jLnR4dC5sZW5ndGggLSBzdGFydDtcbiAgICBkb2MuZm10ID0gZG9jLmZtdCB8fCBbXTtcbiAgICBpZiAoT2JqZWN0LmtleXModHJlZS5kYXRhIHx8IHt9KS5sZW5ndGggPiAwKSB7XG4gICAgICBkb2MuZW50ID0gZG9jLmVudCB8fCBbXTtcbiAgICAgIGNvbnN0IG5ld0tleSA9ICh0eXBlb2Yga2V5bWFwW3RyZWUua2V5XSA9PSAndW5kZWZpbmVkJykgPyBkb2MuZW50Lmxlbmd0aCA6IGtleW1hcFt0cmVlLmtleV07XG4gICAgICBrZXltYXBbdHJlZS5rZXldID0gbmV3S2V5O1xuICAgICAgZG9jLmVudFtuZXdLZXldID0ge1xuICAgICAgICB0cDogdHJlZS50eXBlLFxuICAgICAgICBkYXRhOiB0cmVlLmRhdGFcbiAgICAgIH07XG4gICAgICBpZiAodHJlZS5hdHQpIHtcbiAgICAgICAgLy8gQXR0YWNobWVudC5cbiAgICAgICAgZG9jLmZtdC5wdXNoKHtcbiAgICAgICAgICBhdDogLTEsXG4gICAgICAgICAgbGVuOiAwLFxuICAgICAgICAgIGtleTogbmV3S2V5XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZG9jLmZtdC5wdXNoKHtcbiAgICAgICAgICBhdDogc3RhcnQsXG4gICAgICAgICAgbGVuOiBsZW4sXG4gICAgICAgICAga2V5OiBuZXdLZXlcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGRvYy5mbXQucHVzaCh7XG4gICAgICAgIHRwOiB0cmVlLnR5cGUsXG4gICAgICAgIGF0OiBzdGFydCxcbiAgICAgICAgbGVuOiBsZW5cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZG9jO1xufVxuXG4vLyBUcmF2ZXJzZSB0aGUgdHJlZSB0b3AgZG93biB0cmFuc2Zvcm1pbmcgdGhlIG5vZGVzOiBhcHBseSB0cmFuc2Zvcm1lciB0byBldmVyeSB0cmVlIG5vZGUuXG5mdW5jdGlvbiB0cmVlVG9wRG93bihzcmMsIHRyYW5zZm9ybWVyLCBjb250ZXh0KSB7XG4gIGlmICghc3JjKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBsZXQgZHN0ID0gdHJhbnNmb3JtZXIuY2FsbChjb250ZXh0LCBzcmMpO1xuICBpZiAoIWRzdCB8fCAhZHN0LmNoaWxkcmVuKSB7XG4gICAgcmV0dXJuIGRzdDtcbiAgfVxuXG4gIGNvbnN0IGNoaWxkcmVuID0gW107XG4gIGZvciAobGV0IGkgaW4gZHN0LmNoaWxkcmVuKSB7XG4gICAgbGV0IG4gPSBkc3QuY2hpbGRyZW5baV07XG4gICAgaWYgKG4pIHtcbiAgICAgIG4gPSB0cmVlVG9wRG93bihuLCB0cmFuc2Zvcm1lciwgY29udGV4dCk7XG4gICAgICBpZiAobikge1xuICAgICAgICBjaGlsZHJlbi5wdXNoKG4pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmIChjaGlsZHJlbi5sZW5ndGggPT0gMCkge1xuICAgIGRzdC5jaGlsZHJlbiA9IG51bGw7XG4gIH0gZWxzZSB7XG4gICAgZHN0LmNoaWxkcmVuID0gY2hpbGRyZW47XG4gIH1cblxuICByZXR1cm4gZHN0O1xufVxuXG4vLyBUcmF2ZXJzZSB0aGUgdHJlZSBib3R0b20tdXA6IGFwcGx5IGZvcm1hdHRlciB0byBldmVyeSBub2RlLlxuLy8gVGhlIGZvcm1hdHRlciBtdXN0IG1haW50YWluIGl0cyBzdGF0ZSB0aHJvdWdoIGNvbnRleHQuXG5mdW5jdGlvbiB0cmVlQm90dG9tVXAoc3JjLCBmb3JtYXR0ZXIsIGluZGV4LCBzdGFjaywgY29udGV4dCkge1xuICBpZiAoIXNyYykge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgaWYgKHN0YWNrICYmIHNyYy50eXBlKSB7XG4gICAgc3RhY2sucHVzaChzcmMudHlwZSk7XG4gIH1cblxuICBsZXQgdmFsdWVzID0gW107XG4gIGZvciAobGV0IGkgaW4gc3JjLmNoaWxkcmVuKSB7XG4gICAgY29uc3QgbiA9IHRyZWVCb3R0b21VcChzcmMuY2hpbGRyZW5baV0sIGZvcm1hdHRlciwgaSwgc3RhY2ssIGNvbnRleHQpO1xuICAgIGlmIChuKSB7XG4gICAgICB2YWx1ZXMucHVzaChuKTtcbiAgICB9XG4gIH1cbiAgaWYgKHZhbHVlcy5sZW5ndGggPT0gMCkge1xuICAgIGlmIChzcmMudGV4dCkge1xuICAgICAgdmFsdWVzID0gW3NyYy50ZXh0XTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFsdWVzID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBpZiAoc3RhY2sgJiYgc3JjLnR5cGUpIHtcbiAgICBzdGFjay5wb3AoKTtcbiAgfVxuXG4gIHJldHVybiBmb3JtYXR0ZXIuY2FsbChjb250ZXh0LCBzcmMudHlwZSwgc3JjLmRhdGEsIHZhbHVlcywgaW5kZXgsIHN0YWNrKTtcbn1cblxuLy8gQ2xpcCB0cmVlIHRvIHRoZSBwcm92aWRlZCBsaW1pdC5cbmZ1bmN0aW9uIHNob3J0ZW5UcmVlKHRyZWUsIGxpbWl0LCB0YWlsKSB7XG4gIGlmICghdHJlZSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgaWYgKHRhaWwpIHtcbiAgICBsaW1pdCAtPSB0YWlsLmxlbmd0aDtcbiAgfVxuXG4gIGNvbnN0IHNob3J0ZW5lciA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICBpZiAobGltaXQgPD0gLTEpIHtcbiAgICAgIC8vIExpbWl0IC0xIG1lYW5zIHRoZSBkb2Mgd2FzIGFscmVhZHkgY2xpcHBlZC5cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGlmIChub2RlLmF0dCkge1xuICAgICAgLy8gQXR0YWNobWVudHMgYXJlIHVuY2hhbmdlZC5cbiAgICAgIHJldHVybiBub2RlO1xuICAgIH1cbiAgICBpZiAobGltaXQgPT0gMCkge1xuICAgICAgbm9kZS50ZXh0ID0gdGFpbDtcbiAgICAgIGxpbWl0ID0gLTE7XG4gICAgfSBlbHNlIGlmIChub2RlLnRleHQpIHtcbiAgICAgIGNvbnN0IGxlbiA9IG5vZGUudGV4dC5sZW5ndGg7XG4gICAgICBpZiAobGVuID4gbGltaXQpIHtcbiAgICAgICAgbm9kZS50ZXh0ID0gbm9kZS50ZXh0LnN1YnN0cmluZygwLCBsaW1pdCkgKyB0YWlsO1xuICAgICAgICBsaW1pdCA9IC0xO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGltaXQgLT0gbGVuO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuXG4gIHJldHVybiB0cmVlVG9wRG93bih0cmVlLCBzaG9ydGVuZXIpO1xufVxuXG4vLyBTdHJpcCBoZWF2eSBlbnRpdGllcyBmcm9tIGEgdHJlZS5cbmZ1bmN0aW9uIGxpZ2h0RW50aXR5KHRyZWUpIHtcbiAgY29uc3QgbGlnaHRDb3B5ID0gZnVuY3Rpb24obm9kZSkge1xuICAgIGNvbnN0IGRhdGEgPSBjb3B5RW50RGF0YShub2RlLmRhdGEsIHRydWUpO1xuICAgIGlmIChkYXRhKSB7XG4gICAgICBub2RlLmRhdGEgPSBkYXRhO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWxldGUgbm9kZS5kYXRhO1xuICAgIH1cbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuICByZXR1cm4gdHJlZVRvcERvd24odHJlZSwgbGlnaHRDb3B5KTtcbn1cblxuLy8gUmVtb3ZlIHNwYWNlcyBhbmQgYnJlYWtzIG9uIHRoZSBsZWZ0LlxuZnVuY3Rpb24gbFRyaW0odHJlZSkge1xuICBpZiAodHJlZS50eXBlID09ICdCUicpIHtcbiAgICB0cmVlID0gbnVsbDtcbiAgfSBlbHNlIGlmICh0cmVlLnRleHQpIHtcbiAgICBpZiAoIXRyZWUudHlwZSkge1xuICAgICAgdHJlZS50ZXh0ID0gdHJlZS50ZXh0LnRyaW1TdGFydCgpO1xuICAgICAgaWYgKCF0cmVlLnRleHQpIHtcbiAgICAgICAgdHJlZSA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKHRyZWUuY2hpbGRyZW4gJiYgdHJlZS5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgY29uc3QgYyA9IGxUcmltKHRyZWUuY2hpbGRyZW5bMF0pO1xuICAgIGlmIChjKSB7XG4gICAgICB0cmVlLmNoaWxkcmVuWzBdID0gYztcbiAgICB9IGVsc2Uge1xuICAgICAgdHJlZS5jaGlsZHJlbi5zaGlmdCgpO1xuICAgICAgaWYgKCF0cmVlLnR5cGUgJiYgdHJlZS5jaGlsZHJlbi5sZW5ndGggPT0gMCkge1xuICAgICAgICB0cmVlID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRyZWU7XG59XG5cbi8vIE1vdmUgYXR0YWNobWVudHMgdG8gdGhlIGVuZC4gQXR0YWNobWVudHMgbXVzdCBiZSBhdCB0aGUgdG9wIGxldmVsLCBubyBuZWVkIHRvIHRyYXZlcnNlIHRoZSB0cmVlLlxuZnVuY3Rpb24gYXR0YWNobWVudHNUb0VuZCh0cmVlLCBsaW1pdCkge1xuICBpZiAoIXRyZWUpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGlmICh0cmVlLmF0dCkge1xuICAgIHRyZWUudGV4dCA9ICcgJztcbiAgICBkZWxldGUgdHJlZS5hdHQ7XG4gICAgZGVsZXRlIHRyZWUuY2hpbGRyZW47XG4gIH0gZWxzZSBpZiAodHJlZS5jaGlsZHJlbikge1xuICAgIGNvbnN0IGF0dGFjaG1lbnRzID0gW107XG4gICAgY29uc3QgY2hpbGRyZW4gPSBbXTtcbiAgICBmb3IgKGxldCBpIGluIHRyZWUuY2hpbGRyZW4pIHtcbiAgICAgIGNvbnN0IGMgPSB0cmVlLmNoaWxkcmVuW2ldO1xuICAgICAgaWYgKGMuYXR0KSB7XG4gICAgICAgIGlmIChhdHRhY2htZW50cy5sZW5ndGggPT0gbGltaXQpIHtcbiAgICAgICAgICAvLyBUb28gbWFueSBhdHRhY2htZW50cyB0byBwcmV2aWV3O1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjLmRhdGFbJ21pbWUnXSA9PSBKU09OX01JTUVfVFlQRSkge1xuICAgICAgICAgIC8vIEpTT04gYXR0YWNobWVudHMgYXJlIG5vdCBzaG93biBpbiBwcmV2aWV3LlxuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZGVsZXRlIGMuYXR0O1xuICAgICAgICBkZWxldGUgYy5jaGlsZHJlbjtcbiAgICAgICAgYy50ZXh0ID0gJyAnO1xuICAgICAgICBhdHRhY2htZW50cy5wdXNoKGMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2hpbGRyZW4ucHVzaChjKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdHJlZS5jaGlsZHJlbiA9IGNoaWxkcmVuLmNvbmNhdChhdHRhY2htZW50cyk7XG4gIH1cbiAgcmV0dXJuIHRyZWU7XG59XG5cbi8vIEdldCBhIGxpc3Qgb2YgZW50aXRpZXMgZnJvbSBhIHRleHQuXG5mdW5jdGlvbiBleHRyYWN0RW50aXRpZXMobGluZSkge1xuICBsZXQgbWF0Y2g7XG4gIGxldCBleHRyYWN0ZWQgPSBbXTtcbiAgRU5USVRZX1RZUEVTLmZvckVhY2goKGVudGl0eSkgPT4ge1xuICAgIHdoaWxlICgobWF0Y2ggPSBlbnRpdHkucmUuZXhlYyhsaW5lKSkgIT09IG51bGwpIHtcbiAgICAgIGV4dHJhY3RlZC5wdXNoKHtcbiAgICAgICAgb2Zmc2V0OiBtYXRjaFsnaW5kZXgnXSxcbiAgICAgICAgbGVuOiBtYXRjaFswXS5sZW5ndGgsXG4gICAgICAgIHVuaXF1ZTogbWF0Y2hbMF0sXG4gICAgICAgIGRhdGE6IGVudGl0eS5wYWNrKG1hdGNoWzBdKSxcbiAgICAgICAgdHlwZTogZW50aXR5Lm5hbWVcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG5cbiAgaWYgKGV4dHJhY3RlZC5sZW5ndGggPT0gMCkge1xuICAgIHJldHVybiBleHRyYWN0ZWQ7XG4gIH1cblxuICAvLyBSZW1vdmUgZW50aXRpZXMgZGV0ZWN0ZWQgaW5zaWRlIG90aGVyIGVudGl0aWVzLCBsaWtlICNoYXNodGFnIGluIGEgVVJMLlxuICBleHRyYWN0ZWQuc29ydCgoYSwgYikgPT4ge1xuICAgIHJldHVybiBhLm9mZnNldCAtIGIub2Zmc2V0O1xuICB9KTtcblxuICBsZXQgaWR4ID0gLTE7XG4gIGV4dHJhY3RlZCA9IGV4dHJhY3RlZC5maWx0ZXIoKGVsKSA9PiB7XG4gICAgY29uc3QgcmVzdWx0ID0gKGVsLm9mZnNldCA+IGlkeCk7XG4gICAgaWR4ID0gZWwub2Zmc2V0ICsgZWwubGVuO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH0pO1xuXG4gIHJldHVybiBleHRyYWN0ZWQ7XG59XG5cbi8vIENvbnZlcnQgdGhlIGNodW5rcyBpbnRvIGZvcm1hdCBzdWl0YWJsZSBmb3Igc2VyaWFsaXphdGlvbi5cbmZ1bmN0aW9uIGRyYWZ0aWZ5KGNodW5rcywgc3RhcnRBdCkge1xuICBsZXQgcGxhaW4gPSAnJztcbiAgbGV0IHJhbmdlcyA9IFtdO1xuICBmb3IgKGxldCBpIGluIGNodW5rcykge1xuICAgIGNvbnN0IGNodW5rID0gY2h1bmtzW2ldO1xuICAgIGlmICghY2h1bmsudHh0KSB7XG4gICAgICBjb25zdCBkcmFmdHkgPSBkcmFmdGlmeShjaHVuay5jaGlsZHJlbiwgcGxhaW4ubGVuZ3RoICsgc3RhcnRBdCk7XG4gICAgICBjaHVuay50eHQgPSBkcmFmdHkudHh0O1xuICAgICAgcmFuZ2VzID0gcmFuZ2VzLmNvbmNhdChkcmFmdHkuZm10KTtcbiAgICB9XG5cbiAgICBpZiAoY2h1bmsudHApIHtcbiAgICAgIHJhbmdlcy5wdXNoKHtcbiAgICAgICAgYXQ6IHBsYWluLmxlbmd0aCArIHN0YXJ0QXQsXG4gICAgICAgIGxlbjogY2h1bmsudHh0Lmxlbmd0aCxcbiAgICAgICAgdHA6IGNodW5rLnRwXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBwbGFpbiArPSBjaHVuay50eHQ7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICB0eHQ6IHBsYWluLFxuICAgIGZtdDogcmFuZ2VzXG4gIH07XG59XG5cbi8vIENyZWF0ZSBhIGNvcHkgb2YgZW50aXR5IGRhdGEgd2l0aCAobGlnaHQ9ZmFsc2UpIG9yIHdpdGhvdXQgKGxpZ2h0PXRydWUpIHRoZSBsYXJnZSBwYXlsb2FkLlxuLy8gVGhlIGFycmF5ICdhbGxvdycgY29udGFpbnMgYSBsaXN0IG9mIGZpZWxkcyBleGVtcHQgZnJvbSBzdHJpcHBpbmcuXG5mdW5jdGlvbiBjb3B5RW50RGF0YShkYXRhLCBsaWdodCwgYWxsb3cpIHtcbiAgaWYgKGRhdGEgJiYgT2JqZWN0LmVudHJpZXMoZGF0YSkubGVuZ3RoID4gMCkge1xuICAgIGFsbG93ID0gYWxsb3cgfHwgW107XG4gICAgY29uc3QgZGMgPSB7fTtcbiAgICBBTExPV0VEX0VOVF9GSUVMRFMuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICBpZiAoZGF0YVtrZXldKSB7XG4gICAgICAgIGlmIChsaWdodCAmJiAhYWxsb3cuaW5jbHVkZXMoa2V5KSAmJlxuICAgICAgICAgICh0eXBlb2YgZGF0YVtrZXldID09ICdzdHJpbmcnIHx8IEFycmF5LmlzQXJyYXkoZGF0YVtrZXldKSkgJiZcbiAgICAgICAgICBkYXRhW2tleV0ubGVuZ3RoID4gTUFYX1BSRVZJRVdfREFUQV9TSVpFKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgZGF0YVtrZXldID09ICdvYmplY3QnKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGRjW2tleV0gPSBkYXRhW2tleV07XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAoT2JqZWN0LmVudHJpZXMoZGMpLmxlbmd0aCAhPSAwKSB7XG4gICAgICByZXR1cm4gZGM7XG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG5pZiAodHlwZW9mIG1vZHVsZSAhPSAndW5kZWZpbmVkJykge1xuICBtb2R1bGUuZXhwb3J0cyA9IERyYWZ0eTtcbn1cbiIsIi8qKlxuICogQGZpbGUgVXRpbGl0aWVzIGZvciB1cGxvYWRpbmcgYW5kIGRvd25sb2FkaW5nIGZpbGVzLlxuICpcbiAqIEBjb3B5cmlnaHQgMjAxNS0yMDIyIFRpbm9kZSBMTEMuXG4gKi9cbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHtcbiAganNvblBhcnNlSGVscGVyXG59IGZyb20gJy4vdXRpbHMuanMnO1xuXG5sZXQgWEhSUHJvdmlkZXI7XG5cbi8qKlxuICogQGNsYXNzIExhcmdlRmlsZUhlbHBlciAtIHV0aWxpdGllcyBmb3IgdXBsb2FkaW5nIGFuZCBkb3dubG9hZGluZyBmaWxlcyBvdXQgb2YgYmFuZC5cbiAqIERvbid0IGluc3RhbnRpYXRlIHRoaXMgY2xhc3MgZGlyZWN0bHkuIFVzZSB7VGlub2RlLmdldExhcmdlRmlsZUhlbHBlcn0gaW5zdGVhZC5cbiAqIEBtZW1iZXJvZiBUaW5vZGVcbiAqXG4gKiBAcGFyYW0ge1Rpbm9kZX0gdGlub2RlIC0gdGhlIG1haW4gVGlub2RlIG9iamVjdC5cbiAqIEBwYXJhbSB7c3RyaW5nfSB2ZXJzaW9uIC0gcHJvdG9jb2wgdmVyc2lvbiwgaS5lLiAnMCcuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExhcmdlRmlsZUhlbHBlciB7XG4gIGNvbnN0cnVjdG9yKHRpbm9kZSwgdmVyc2lvbikge1xuICAgIHRoaXMuX3Rpbm9kZSA9IHRpbm9kZTtcbiAgICB0aGlzLl92ZXJzaW9uID0gdmVyc2lvbjtcblxuICAgIHRoaXMuX2FwaUtleSA9IHRpbm9kZS5fYXBpS2V5O1xuICAgIHRoaXMuX2F1dGhUb2tlbiA9IHRpbm9kZS5nZXRBdXRoVG9rZW4oKTtcbiAgICB0aGlzLl9yZXFJZCA9IHRpbm9kZS5nZXROZXh0VW5pcXVlSWQoKTtcbiAgICB0aGlzLnhociA9IG5ldyBYSFJQcm92aWRlcigpO1xuXG4gICAgLy8gUHJvbWlzZVxuICAgIHRoaXMudG9SZXNvbHZlID0gbnVsbDtcbiAgICB0aGlzLnRvUmVqZWN0ID0gbnVsbDtcblxuICAgIC8vIENhbGxiYWNrc1xuICAgIHRoaXMub25Qcm9ncmVzcyA9IG51bGw7XG4gICAgdGhpcy5vblN1Y2Nlc3MgPSBudWxsO1xuICAgIHRoaXMub25GYWlsdXJlID0gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydCB1cGxvYWRpbmcgdGhlIGZpbGUgdG8gYSBub24tZGVmYXVsdCBlbmRwb2ludC5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZS5MYXJnZUZpbGVIZWxwZXIjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBiYXNlVXJsIGFsdGVybmF0aXZlIGJhc2UgVVJMIG9mIHVwbG9hZCBzZXJ2ZXIuXG4gICAqIEBwYXJhbSB7RmlsZXxCbG9ifSBkYXRhIHRvIHVwbG9hZC5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGF2YXRhckZvciB0b3BpYyBuYW1lIGlmIHRoZSB1cGxvYWQgcmVwcmVzZW50cyBhbiBhdmF0YXIuXG4gICAqIEBwYXJhbSB7Q2FsbGJhY2t9IG9uUHJvZ3Jlc3MgY2FsbGJhY2suIFRha2VzIG9uZSB7ZmxvYXR9IHBhcmFtZXRlciAwLi4xXG4gICAqIEBwYXJhbSB7Q2FsbGJhY2t9IG9uU3VjY2VzcyBjYWxsYmFjay4gQ2FsbGVkIHdoZW4gdGhlIGZpbGUgaXMgc3VjY2Vzc2Z1bGx5IHVwbG9hZGVkLlxuICAgKiBAcGFyYW0ge0NhbGxiYWNrfSBvbkZhaWx1cmUgY2FsbGJhY2suIENhbGxlZCBpbiBjYXNlIG9mIGEgZmFpbHVyZS5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIHVwbG9hZCBpcyBjb21wbGV0ZWQvZmFpbGVkLlxuICAgKi9cbiAgdXBsb2FkV2l0aEJhc2VVcmwoYmFzZVVybCwgZGF0YSwgYXZhdGFyRm9yLCBvblByb2dyZXNzLCBvblN1Y2Nlc3MsIG9uRmFpbHVyZSkge1xuICAgIGlmICghdGhpcy5fYXV0aFRva2VuKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNdXN0IGF1dGhlbnRpY2F0ZSBmaXJzdFwiKTtcbiAgICB9XG4gICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzO1xuXG4gICAgbGV0IHVybCA9IGAvdiR7dGhpcy5fdmVyc2lvbn0vZmlsZS91L2A7XG4gICAgaWYgKGJhc2VVcmwpIHtcbiAgICAgIGxldCBiYXNlID0gYmFzZVVybDtcbiAgICAgIGlmIChiYXNlLmVuZHNXaXRoKCcvJykpIHtcbiAgICAgICAgLy8gUmVtb3ZpbmcgdHJhaWxpbmcgc2xhc2guXG4gICAgICAgIGJhc2UgPSBiYXNlLnNsaWNlKDAsIC0xKTtcbiAgICAgIH1cbiAgICAgIGlmIChiYXNlLnN0YXJ0c1dpdGgoJ2h0dHA6Ly8nKSB8fCBiYXNlLnN0YXJ0c1dpdGgoJ2h0dHBzOi8vJykpIHtcbiAgICAgICAgdXJsID0gYmFzZSArIHVybDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBiYXNlIFVSTCAnJHtiYXNlVXJsfSdgKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy54aHIub3BlbignUE9TVCcsIHVybCwgdHJ1ZSk7XG4gICAgdGhpcy54aHIuc2V0UmVxdWVzdEhlYWRlcignWC1UaW5vZGUtQVBJS2V5JywgdGhpcy5fYXBpS2V5KTtcbiAgICB0aGlzLnhoci5zZXRSZXF1ZXN0SGVhZGVyKCdYLVRpbm9kZS1BdXRoJywgYFRva2VuICR7dGhpcy5fYXV0aFRva2VuLnRva2VufWApO1xuICAgIGNvbnN0IHJlc3VsdCA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMudG9SZXNvbHZlID0gcmVzb2x2ZTtcbiAgICAgIHRoaXMudG9SZWplY3QgPSByZWplY3Q7XG4gICAgfSk7XG5cbiAgICB0aGlzLm9uUHJvZ3Jlc3MgPSBvblByb2dyZXNzO1xuICAgIHRoaXMub25TdWNjZXNzID0gb25TdWNjZXNzO1xuICAgIHRoaXMub25GYWlsdXJlID0gb25GYWlsdXJlO1xuXG4gICAgdGhpcy54aHIudXBsb2FkLm9ucHJvZ3Jlc3MgPSAoZSkgPT4ge1xuICAgICAgaWYgKGUubGVuZ3RoQ29tcHV0YWJsZSAmJiBpbnN0YW5jZS5vblByb2dyZXNzKSB7XG4gICAgICAgIGluc3RhbmNlLm9uUHJvZ3Jlc3MoZS5sb2FkZWQgLyBlLnRvdGFsKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy54aHIub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgcGt0O1xuICAgICAgdHJ5IHtcbiAgICAgICAgcGt0ID0gSlNPTi5wYXJzZSh0aGlzLnJlc3BvbnNlLCBqc29uUGFyc2VIZWxwZXIpO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGluc3RhbmNlLl90aW5vZGUubG9nZ2VyKFwiRVJST1I6IEludmFsaWQgc2VydmVyIHJlc3BvbnNlIGluIExhcmdlRmlsZUhlbHBlclwiLCB0aGlzLnJlc3BvbnNlKTtcbiAgICAgICAgcGt0ID0ge1xuICAgICAgICAgIGN0cmw6IHtcbiAgICAgICAgICAgIGNvZGU6IHRoaXMuc3RhdHVzLFxuICAgICAgICAgICAgdGV4dDogdGhpcy5zdGF0dXNUZXh0XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5zdGF0dXMgPj0gMjAwICYmIHRoaXMuc3RhdHVzIDwgMzAwKSB7XG4gICAgICAgIGlmIChpbnN0YW5jZS50b1Jlc29sdmUpIHtcbiAgICAgICAgICBpbnN0YW5jZS50b1Jlc29sdmUocGt0LmN0cmwucGFyYW1zLnVybCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGluc3RhbmNlLm9uU3VjY2Vzcykge1xuICAgICAgICAgIGluc3RhbmNlLm9uU3VjY2Vzcyhwa3QuY3RybCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0dXMgPj0gNDAwKSB7XG4gICAgICAgIGlmIChpbnN0YW5jZS50b1JlamVjdCkge1xuICAgICAgICAgIGluc3RhbmNlLnRvUmVqZWN0KG5ldyBFcnJvcihgJHtwa3QuY3RybC50ZXh0fSAoJHtwa3QuY3RybC5jb2RlfSlgKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGluc3RhbmNlLm9uRmFpbHVyZSkge1xuICAgICAgICAgIGluc3RhbmNlLm9uRmFpbHVyZShwa3QuY3RybCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGluc3RhbmNlLl90aW5vZGUubG9nZ2VyKFwiRVJST1I6IFVuZXhwZWN0ZWQgc2VydmVyIHJlc3BvbnNlIHN0YXR1c1wiLCB0aGlzLnN0YXR1cywgdGhpcy5yZXNwb25zZSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRoaXMueGhyLm9uZXJyb3IgPSBmdW5jdGlvbihlKSB7XG4gICAgICBpZiAoaW5zdGFuY2UudG9SZWplY3QpIHtcbiAgICAgICAgaW5zdGFuY2UudG9SZWplY3QobmV3IEVycm9yKFwiZmFpbGVkXCIpKTtcbiAgICAgIH1cbiAgICAgIGlmIChpbnN0YW5jZS5vbkZhaWx1cmUpIHtcbiAgICAgICAgaW5zdGFuY2Uub25GYWlsdXJlKG51bGwpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLnhoci5vbmFib3J0ID0gZnVuY3Rpb24oZSkge1xuICAgICAgaWYgKGluc3RhbmNlLnRvUmVqZWN0KSB7XG4gICAgICAgIGluc3RhbmNlLnRvUmVqZWN0KG5ldyBFcnJvcihcInVwbG9hZCBjYW5jZWxsZWQgYnkgdXNlclwiKSk7XG4gICAgICB9XG4gICAgICBpZiAoaW5zdGFuY2Uub25GYWlsdXJlKSB7XG4gICAgICAgIGluc3RhbmNlLm9uRmFpbHVyZShudWxsKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGZvcm0gPSBuZXcgRm9ybURhdGEoKTtcbiAgICAgIGZvcm0uYXBwZW5kKCdmaWxlJywgZGF0YSk7XG4gICAgICBmb3JtLnNldCgnaWQnLCB0aGlzLl9yZXFJZCk7XG4gICAgICBpZiAoYXZhdGFyRm9yKSB7XG4gICAgICAgIGZvcm0uc2V0KCd0b3BpYycsIGF2YXRhckZvcik7XG4gICAgICB9XG4gICAgICB0aGlzLnhoci5zZW5kKGZvcm0pO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgaWYgKHRoaXMudG9SZWplY3QpIHtcbiAgICAgICAgdGhpcy50b1JlamVjdChlcnIpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMub25GYWlsdXJlKSB7XG4gICAgICAgIHRoaXMub25GYWlsdXJlKG51bGwpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgLyoqXG4gICAqIFN0YXJ0IHVwbG9hZGluZyB0aGUgZmlsZSB0byBkZWZhdWx0IGVuZHBvaW50LlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkxhcmdlRmlsZUhlbHBlciNcbiAgICpcbiAgICogQHBhcmFtIHtGaWxlfEJsb2J9IGRhdGEgdG8gdXBsb2FkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBhdmF0YXJGb3IgdG9waWMgbmFtZSBpZiB0aGUgdXBsb2FkIHJlcHJlc2VudHMgYW4gYXZhdGFyLlxuICAgKiBAcGFyYW0ge0NhbGxiYWNrfSBvblByb2dyZXNzIGNhbGxiYWNrLiBUYWtlcyBvbmUge2Zsb2F0fSBwYXJhbWV0ZXIgMC4uMVxuICAgKiBAcGFyYW0ge0NhbGxiYWNrfSBvblN1Y2Nlc3MgY2FsbGJhY2suIENhbGxlZCB3aGVuIHRoZSBmaWxlIGlzIHN1Y2Nlc3NmdWxseSB1cGxvYWRlZC5cbiAgICogQHBhcmFtIHtDYWxsYmFja30gb25GYWlsdXJlIGNhbGxiYWNrLiBDYWxsZWQgaW4gY2FzZSBvZiBhIGZhaWx1cmUuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSB1cGxvYWQgaXMgY29tcGxldGVkL2ZhaWxlZC5cbiAgICovXG4gIHVwbG9hZChkYXRhLCBhdmF0YXJGb3IsIG9uUHJvZ3Jlc3MsIG9uU3VjY2Vzcywgb25GYWlsdXJlKSB7XG4gICAgY29uc3QgYmFzZVVybCA9ICh0aGlzLl90aW5vZGUuX3NlY3VyZSA/ICdodHRwczovLycgOiAnaHR0cDovLycpICsgdGhpcy5fdGlub2RlLl9ob3N0O1xuICAgIHJldHVybiB0aGlzLnVwbG9hZFdpdGhCYXNlVXJsKGJhc2VVcmwsIGRhdGEsIGF2YXRhckZvciwgb25Qcm9ncmVzcywgb25TdWNjZXNzLCBvbkZhaWx1cmUpO1xuICB9XG4gIC8qKlxuICAgKiBEb3dubG9hZCB0aGUgZmlsZSBmcm9tIGEgZ2l2ZW4gVVJMIHVzaW5nIEdFVCByZXF1ZXN0LiBUaGlzIG1ldGhvZCB3b3JrcyB3aXRoIHRoZSBUaW5vZGUgc2VydmVyIG9ubHkuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTGFyZ2VGaWxlSGVscGVyI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcmVsYXRpdmVVcmwgLSBVUkwgdG8gZG93bmxvYWQgdGhlIGZpbGUgZnJvbS4gTXVzdCBiZSByZWxhdGl2ZSB1cmwsIGkuZS4gbXVzdCBub3QgY29udGFpbiB0aGUgaG9zdC5cbiAgICogQHBhcmFtIHtzdHJpbmc9fSBmaWxlbmFtZSAtIGZpbGUgbmFtZSB0byB1c2UgZm9yIHRoZSBkb3dubG9hZGVkIGZpbGUuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBkb3dubG9hZCBpcyBjb21wbGV0ZWQvZmFpbGVkLlxuICAgKi9cbiAgZG93bmxvYWQocmVsYXRpdmVVcmwsIGZpbGVuYW1lLCBtaW1ldHlwZSwgb25Qcm9ncmVzcywgb25FcnJvcikge1xuICAgIGlmICghVGlub2RlLmlzUmVsYXRpdmVVUkwocmVsYXRpdmVVcmwpKSB7XG4gICAgICAvLyBBcyBhIHNlY3VyaXR5IG1lYXN1cmUgcmVmdXNlIHRvIGRvd25sb2FkIGZyb20gYW4gYWJzb2x1dGUgVVJMLlxuICAgICAgaWYgKG9uRXJyb3IpIHtcbiAgICAgICAgb25FcnJvcihgVGhlIFVSTCAnJHtyZWxhdGl2ZVVybH0nIG11c3QgYmUgcmVsYXRpdmUsIG5vdCBhYnNvbHV0ZWApO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuX2F1dGhUb2tlbikge1xuICAgICAgaWYgKG9uRXJyb3IpIHtcbiAgICAgICAgb25FcnJvcihcIk11c3QgYXV0aGVudGljYXRlIGZpcnN0XCIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXM7XG4gICAgLy8gR2V0IGRhdGEgYXMgYmxvYiAoc3RvcmVkIGJ5IHRoZSBicm93c2VyIGFzIGEgdGVtcG9yYXJ5IGZpbGUpLlxuICAgIHRoaXMueGhyLm9wZW4oJ0dFVCcsIHJlbGF0aXZlVXJsLCB0cnVlKTtcbiAgICB0aGlzLnhoci5zZXRSZXF1ZXN0SGVhZGVyKCdYLVRpbm9kZS1BUElLZXknLCB0aGlzLl9hcGlLZXkpO1xuICAgIHRoaXMueGhyLnNldFJlcXVlc3RIZWFkZXIoJ1gtVGlub2RlLUF1dGgnLCAnVG9rZW4gJyArIHRoaXMuX2F1dGhUb2tlbi50b2tlbik7XG4gICAgdGhpcy54aHIucmVzcG9uc2VUeXBlID0gJ2Jsb2InO1xuXG4gICAgdGhpcy5vblByb2dyZXNzID0gb25Qcm9ncmVzcztcbiAgICB0aGlzLnhoci5vbnByb2dyZXNzID0gZnVuY3Rpb24oZSkge1xuICAgICAgaWYgKGluc3RhbmNlLm9uUHJvZ3Jlc3MpIHtcbiAgICAgICAgLy8gUGFzc2luZyBlLmxvYWRlZCBpbnN0ZWFkIG9mIGUubG9hZGVkL2UudG90YWwgYmVjYXVzZSBlLnRvdGFsXG4gICAgICAgIC8vIGlzIGFsd2F5cyAwIHdpdGggZ3ppcCBjb21wcmVzc2lvbiBlbmFibGVkIGJ5IHRoZSBzZXJ2ZXIuXG4gICAgICAgIGluc3RhbmNlLm9uUHJvZ3Jlc3MoZS5sb2FkZWQpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCByZXN1bHQgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLnRvUmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgICB0aGlzLnRvUmVqZWN0ID0gcmVqZWN0O1xuICAgIH0pO1xuXG4gICAgLy8gVGhlIGJsb2IgbmVlZHMgdG8gYmUgc2F2ZWQgYXMgZmlsZS4gVGhlcmUgaXMgbm8ga25vd24gd2F5IHRvXG4gICAgLy8gc2F2ZSB0aGUgYmxvYiBhcyBmaWxlIG90aGVyIHRoYW4gdG8gZmFrZSBhIGNsaWNrIG9uIGFuIDxhIGhyZWYuLi4gZG93bmxvYWQ9Li4uPi5cbiAgICB0aGlzLnhoci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLnN0YXR1cyA9PSAyMDApIHtcbiAgICAgICAgY29uc3QgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICAgICAgLy8gVVJMLmNyZWF0ZU9iamVjdFVSTCBpcyBub3QgYXZhaWxhYmxlIGluIG5vbi1icm93c2VyIGVudmlyb25tZW50LiBUaGlzIGNhbGwgd2lsbCBmYWlsLlxuICAgICAgICBsaW5rLmhyZWYgPSB3aW5kb3cuVVJMLmNyZWF0ZU9iamVjdFVSTChuZXcgQmxvYihbdGhpcy5yZXNwb25zZV0sIHtcbiAgICAgICAgICB0eXBlOiBtaW1ldHlwZVxuICAgICAgICB9KSk7XG4gICAgICAgIGxpbmsuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgbGluay5zZXRBdHRyaWJ1dGUoJ2Rvd25sb2FkJywgZmlsZW5hbWUpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGxpbmspO1xuICAgICAgICBsaW5rLmNsaWNrKCk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQobGluayk7XG4gICAgICAgIHdpbmRvdy5VUkwucmV2b2tlT2JqZWN0VVJMKGxpbmsuaHJlZik7XG4gICAgICAgIGlmIChpbnN0YW5jZS50b1Jlc29sdmUpIHtcbiAgICAgICAgICBpbnN0YW5jZS50b1Jlc29sdmUoKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0aGlzLnN0YXR1cyA+PSA0MDAgJiYgaW5zdGFuY2UudG9SZWplY3QpIHtcbiAgICAgICAgLy8gVGhlIHRoaXMucmVzcG9uc2VUZXh0IGlzIHVuZGVmaW5lZCwgbXVzdCB1c2UgdGhpcy5yZXNwb25zZSB3aGljaCBpcyBhIGJsb2IuXG4gICAgICAgIC8vIE5lZWQgdG8gY29udmVydCB0aGlzLnJlc3BvbnNlIHRvIEpTT04uIFRoZSBibG9iIGNhbiBvbmx5IGJlIGFjY2Vzc2VkIGJ5IHRoZVxuICAgICAgICAvLyBGaWxlUmVhZGVyLlxuICAgICAgICBjb25zdCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgICAgICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHBrdCA9IEpTT04ucGFyc2UodGhpcy5yZXN1bHQsIGpzb25QYXJzZUhlbHBlcik7XG4gICAgICAgICAgICBpbnN0YW5jZS50b1JlamVjdChuZXcgRXJyb3IoYCR7cGt0LmN0cmwudGV4dH0gKCR7cGt0LmN0cmwuY29kZX0pYCkpO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgaW5zdGFuY2UuX3Rpbm9kZS5sb2dnZXIoXCJFUlJPUjogSW52YWxpZCBzZXJ2ZXIgcmVzcG9uc2UgaW4gTGFyZ2VGaWxlSGVscGVyXCIsIHRoaXMucmVzdWx0KTtcbiAgICAgICAgICAgIGluc3RhbmNlLnRvUmVqZWN0KGVycik7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICByZWFkZXIucmVhZEFzVGV4dCh0aGlzLnJlc3BvbnNlKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy54aHIub25lcnJvciA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgIGlmIChpbnN0YW5jZS50b1JlamVjdCkge1xuICAgICAgICBpbnN0YW5jZS50b1JlamVjdChuZXcgRXJyb3IoXCJmYWlsZWRcIikpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLnhoci5vbmFib3J0ID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoaW5zdGFuY2UudG9SZWplY3QpIHtcbiAgICAgICAgaW5zdGFuY2UudG9SZWplY3QobnVsbCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRyeSB7XG4gICAgICB0aGlzLnhoci5zZW5kKCk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBpZiAodGhpcy50b1JlamVjdCkge1xuICAgICAgICB0aGlzLnRvUmVqZWN0KGVycik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICAvKipcbiAgICogVHJ5IHRvIGNhbmNlbCBhbiBvbmdvaW5nIHVwbG9hZCBvciBkb3dubG9hZC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5MYXJnZUZpbGVIZWxwZXIjXG4gICAqL1xuICBjYW5jZWwoKSB7XG4gICAgaWYgKHRoaXMueGhyICYmIHRoaXMueGhyLnJlYWR5U3RhdGUgPCA0KSB7XG4gICAgICB0aGlzLnhoci5hYm9ydCgpO1xuICAgIH1cbiAgfVxuICAvKipcbiAgICogR2V0IHVuaXF1ZSBpZCBvZiB0aGlzIHJlcXVlc3QuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTGFyZ2VGaWxlSGVscGVyI1xuICAgKlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSB1bmlxdWUgaWRcbiAgICovXG4gIGdldElkKCkge1xuICAgIHJldHVybiB0aGlzLl9yZXFJZDtcbiAgfVxuICAvKipcbiAgICogVG8gdXNlIExhcmdlRmlsZUhlbHBlciBpbiBhIG5vbiBicm93c2VyIGNvbnRleHQsIHN1cHBseSBYTUxIdHRwUmVxdWVzdCBwcm92aWRlci5cbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyb2YgTGFyZ2VGaWxlSGVscGVyXG4gICAqIEBwYXJhbSB4aHJQcm92aWRlciBYTUxIdHRwUmVxdWVzdCBwcm92aWRlciwgZS5nLiBmb3Igbm9kZSA8Y29kZT5yZXF1aXJlKCd4aHInKTwvY29kZT4uXG4gICAqL1xuICBzdGF0aWMgc2V0TmV0d29ya1Byb3ZpZGVyKHhoclByb3ZpZGVyKSB7XG4gICAgWEhSUHJvdmlkZXIgPSB4aHJQcm92aWRlcjtcbiAgfVxufVxuIiwiLyoqXG4gKiBAZmlsZSBIZWxwZXIgY2xhc3MgZm9yIGNvbnN0cnVjdGluZyB7QGxpbmsgVGlub2RlLkdldFF1ZXJ5fS5cbiAqXG4gKiBAY29weXJpZ2h0IDIwMTUtMjAyMiBUaW5vZGUgTExDLlxuICovXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogSGVscGVyIGNsYXNzIGZvciBjb25zdHJ1Y3Rpbmcge0BsaW5rIFRpbm9kZS5HZXRRdWVyeX0uXG4gKlxuICogQGNsYXNzIE1ldGFHZXRCdWlsZGVyXG4gKiBAbWVtYmVyb2YgVGlub2RlXG4gKlxuICogQHBhcmFtIHtUaW5vZGUuVG9waWN9IHBhcmVudCB0b3BpYyB3aGljaCBpbnN0YW50aWF0ZWQgdGhpcyBidWlsZGVyLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNZXRhR2V0QnVpbGRlciB7XG4gIGNvbnN0cnVjdG9yKHBhcmVudCkge1xuICAgIHRoaXMudG9waWMgPSBwYXJlbnQ7XG4gICAgdGhpcy53aGF0ID0ge307XG4gIH1cblxuICAvLyBHZXQgdGltZXN0YW1wIG9mIHRoZSBtb3N0IHJlY2VudCBkZXNjIHVwZGF0ZS5cbiAgI19nZXRfZGVzY19pbXMoKSB7XG4gICAgcmV0dXJuIHRoaXMudG9waWMudXBkYXRlZDtcbiAgfVxuXG4gIC8vIEdldCB0aW1lc3RhbXAgb2YgdGhlIG1vc3QgcmVjZW50IHN1YnMgdXBkYXRlLlxuICAjX2dldF9zdWJzX2ltcygpIHtcbiAgICBpZiAodGhpcy50b3BpYy5pc1AyUFR5cGUoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuI19nZXRfZGVzY19pbXMoKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMudG9waWMuX2xhc3RTdWJzVXBkYXRlO1xuICB9XG4gIC8qKlxuICAgKiBBZGQgcXVlcnkgcGFyYW1ldGVycyB0byBmZXRjaCBtZXNzYWdlcyB3aXRoaW4gZXhwbGljaXQgbGltaXRzLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLk1ldGFHZXRCdWlsZGVyI1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcj19IHNpbmNlIC0gbWVzc2FnZXMgbmV3ZXIgdGhhbiB0aGlzIChpbmNsdXNpdmUpO1xuICAgKiBAcGFyYW0ge251bWJlcj19IGJlZm9yZSAtIG9sZGVyIHRoYW4gdGhpcyAoZXhjbHVzaXZlKVxuICAgKiBAcGFyYW0ge251bWJlcj19IGxpbWl0IC0gbnVtYmVyIG9mIG1lc3NhZ2VzIHRvIGZldGNoXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuTWV0YUdldEJ1aWxkZXJ9IDxjb2RlPnRoaXM8L2NvZGU+IG9iamVjdC5cbiAgICovXG4gIHdpdGhEYXRhKHNpbmNlLCBiZWZvcmUsIGxpbWl0KSB7XG4gICAgdGhpcy53aGF0WydkYXRhJ10gPSB7XG4gICAgICBzaW5jZTogc2luY2UsXG4gICAgICBiZWZvcmU6IGJlZm9yZSxcbiAgICAgIGxpbWl0OiBsaW1pdFxuICAgIH07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLyoqXG4gICAqIEFkZCBxdWVyeSBwYXJhbWV0ZXJzIHRvIGZldGNoIG1lc3NhZ2VzIG5ld2VyIHRoYW4gdGhlIGxhdGVzdCBzYXZlZCBtZXNzYWdlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLk1ldGFHZXRCdWlsZGVyI1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcj19IGxpbWl0IC0gbnVtYmVyIG9mIG1lc3NhZ2VzIHRvIGZldGNoXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuTWV0YUdldEJ1aWxkZXJ9IDxjb2RlPnRoaXM8L2NvZGU+IG9iamVjdC5cbiAgICovXG4gIHdpdGhMYXRlckRhdGEobGltaXQpIHtcbiAgICByZXR1cm4gdGhpcy53aXRoRGF0YSh0aGlzLnRvcGljLl9tYXhTZXEgPiAwID8gdGhpcy50b3BpYy5fbWF4U2VxICsgMSA6IHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBsaW1pdCk7XG4gIH1cbiAgLyoqXG4gICAqIEFkZCBxdWVyeSBwYXJhbWV0ZXJzIHRvIGZldGNoIG1lc3NhZ2VzIG9sZGVyIHRoYW4gdGhlIGVhcmxpZXN0IHNhdmVkIG1lc3NhZ2UuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTWV0YUdldEJ1aWxkZXIjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gbGltaXQgLSBtYXhpbXVtIG51bWJlciBvZiBtZXNzYWdlcyB0byBmZXRjaC5cbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5NZXRhR2V0QnVpbGRlcn0gPGNvZGU+dGhpczwvY29kZT4gb2JqZWN0LlxuICAgKi9cbiAgd2l0aEVhcmxpZXJEYXRhKGxpbWl0KSB7XG4gICAgcmV0dXJuIHRoaXMud2l0aERhdGEodW5kZWZpbmVkLCB0aGlzLnRvcGljLl9taW5TZXEgPiAwID8gdGhpcy50b3BpYy5fbWluU2VxIDogdW5kZWZpbmVkLCBsaW1pdCk7XG4gIH1cbiAgLyoqXG4gICAqIEFkZCBxdWVyeSBwYXJhbWV0ZXJzIHRvIGZldGNoIHRvcGljIGRlc2NyaXB0aW9uIGlmIGl0J3MgbmV3ZXIgdGhhbiB0aGUgZ2l2ZW4gdGltZXN0YW1wLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLk1ldGFHZXRCdWlsZGVyI1xuICAgKlxuICAgKiBAcGFyYW0ge0RhdGU9fSBpbXMgLSBmZXRjaCBtZXNzYWdlcyBuZXdlciB0aGFuIHRoaXMgdGltZXN0YW1wLlxuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLk1ldGFHZXRCdWlsZGVyfSA8Y29kZT50aGlzPC9jb2RlPiBvYmplY3QuXG4gICAqL1xuICB3aXRoRGVzYyhpbXMpIHtcbiAgICB0aGlzLndoYXRbJ2Rlc2MnXSA9IHtcbiAgICAgIGltczogaW1zXG4gICAgfTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICAvKipcbiAgICogQWRkIHF1ZXJ5IHBhcmFtZXRlcnMgdG8gZmV0Y2ggdG9waWMgZGVzY3JpcHRpb24gaWYgaXQncyBuZXdlciB0aGFuIHRoZSBsYXN0IHVwZGF0ZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5NZXRhR2V0QnVpbGRlciNcbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5NZXRhR2V0QnVpbGRlcn0gPGNvZGU+dGhpczwvY29kZT4gb2JqZWN0LlxuICAgKi9cbiAgd2l0aExhdGVyRGVzYygpIHtcbiAgICByZXR1cm4gdGhpcy53aXRoRGVzYyh0aGlzLiNfZ2V0X2Rlc2NfaW1zKCkpO1xuICB9XG4gIC8qKlxuICAgKiBBZGQgcXVlcnkgcGFyYW1ldGVycyB0byBmZXRjaCBzdWJzY3JpcHRpb25zLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLk1ldGFHZXRCdWlsZGVyI1xuICAgKlxuICAgKiBAcGFyYW0ge0RhdGU9fSBpbXMgLSBmZXRjaCBzdWJzY3JpcHRpb25zIG1vZGlmaWVkIG1vcmUgcmVjZW50bHkgdGhhbiB0aGlzIHRpbWVzdGFtcFxuICAgKiBAcGFyYW0ge251bWJlcj19IGxpbWl0IC0gbWF4aW11bSBudW1iZXIgb2Ygc3Vic2NyaXB0aW9ucyB0byBmZXRjaC5cbiAgICogQHBhcmFtIHtzdHJpbmc9fSB1c2VyT3JUb3BpYyAtIHVzZXIgSUQgb3IgdG9waWMgbmFtZSB0byBmZXRjaCBmb3IgZmV0Y2hpbmcgb25lIHN1YnNjcmlwdGlvbi5cbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5NZXRhR2V0QnVpbGRlcn0gPGNvZGU+dGhpczwvY29kZT4gb2JqZWN0LlxuICAgKi9cbiAgd2l0aFN1YihpbXMsIGxpbWl0LCB1c2VyT3JUb3BpYykge1xuICAgIGNvbnN0IG9wdHMgPSB7XG4gICAgICBpbXM6IGltcyxcbiAgICAgIGxpbWl0OiBsaW1pdFxuICAgIH07XG4gICAgaWYgKHRoaXMudG9waWMuZ2V0VHlwZSgpID09ICdtZScpIHtcbiAgICAgIG9wdHMudG9waWMgPSB1c2VyT3JUb3BpYztcbiAgICB9IGVsc2Uge1xuICAgICAgb3B0cy51c2VyID0gdXNlck9yVG9waWM7XG4gICAgfVxuICAgIHRoaXMud2hhdFsnc3ViJ10gPSBvcHRzO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIC8qKlxuICAgKiBBZGQgcXVlcnkgcGFyYW1ldGVycyB0byBmZXRjaCBhIHNpbmdsZSBzdWJzY3JpcHRpb24uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTWV0YUdldEJ1aWxkZXIjXG4gICAqXG4gICAqIEBwYXJhbSB7RGF0ZT19IGltcyAtIGZldGNoIHN1YnNjcmlwdGlvbnMgbW9kaWZpZWQgbW9yZSByZWNlbnRseSB0aGFuIHRoaXMgdGltZXN0YW1wXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gdXNlck9yVG9waWMgLSB1c2VyIElEIG9yIHRvcGljIG5hbWUgdG8gZmV0Y2ggZm9yIGZldGNoaW5nIG9uZSBzdWJzY3JpcHRpb24uXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuTWV0YUdldEJ1aWxkZXJ9IDxjb2RlPnRoaXM8L2NvZGU+IG9iamVjdC5cbiAgICovXG4gIHdpdGhPbmVTdWIoaW1zLCB1c2VyT3JUb3BpYykge1xuICAgIHJldHVybiB0aGlzLndpdGhTdWIoaW1zLCB1bmRlZmluZWQsIHVzZXJPclRvcGljKTtcbiAgfVxuICAvKipcbiAgICogQWRkIHF1ZXJ5IHBhcmFtZXRlcnMgdG8gZmV0Y2ggYSBzaW5nbGUgc3Vic2NyaXB0aW9uIGlmIGl0J3MgYmVlbiB1cGRhdGVkIHNpbmNlIHRoZSBsYXN0IHVwZGF0ZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5NZXRhR2V0QnVpbGRlciNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmc9fSB1c2VyT3JUb3BpYyAtIHVzZXIgSUQgb3IgdG9waWMgbmFtZSB0byBmZXRjaCBmb3IgZmV0Y2hpbmcgb25lIHN1YnNjcmlwdGlvbi5cbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5NZXRhR2V0QnVpbGRlcn0gPGNvZGU+dGhpczwvY29kZT4gb2JqZWN0LlxuICAgKi9cbiAgd2l0aExhdGVyT25lU3ViKHVzZXJPclRvcGljKSB7XG4gICAgcmV0dXJuIHRoaXMud2l0aE9uZVN1Yih0aGlzLnRvcGljLl9sYXN0U3Vic1VwZGF0ZSwgdXNlck9yVG9waWMpO1xuICB9XG4gIC8qKlxuICAgKiBBZGQgcXVlcnkgcGFyYW1ldGVycyB0byBmZXRjaCBzdWJzY3JpcHRpb25zIHVwZGF0ZWQgc2luY2UgdGhlIGxhc3QgdXBkYXRlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLk1ldGFHZXRCdWlsZGVyI1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcj19IGxpbWl0IC0gbWF4aW11bSBudW1iZXIgb2Ygc3Vic2NyaXB0aW9ucyB0byBmZXRjaC5cbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5NZXRhR2V0QnVpbGRlcn0gPGNvZGU+dGhpczwvY29kZT4gb2JqZWN0LlxuICAgKi9cbiAgd2l0aExhdGVyU3ViKGxpbWl0KSB7XG4gICAgcmV0dXJuIHRoaXMud2l0aFN1Yih0aGlzLiNfZ2V0X3N1YnNfaW1zKCksIGxpbWl0KTtcbiAgfVxuICAvKipcbiAgICogQWRkIHF1ZXJ5IHBhcmFtZXRlcnMgdG8gZmV0Y2ggdG9waWMgdGFncy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5NZXRhR2V0QnVpbGRlciNcbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5NZXRhR2V0QnVpbGRlcn0gPGNvZGU+dGhpczwvY29kZT4gb2JqZWN0LlxuICAgKi9cbiAgd2l0aFRhZ3MoKSB7XG4gICAgdGhpcy53aGF0Wyd0YWdzJ10gPSB0cnVlO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIC8qKlxuICAgKiBBZGQgcXVlcnkgcGFyYW1ldGVycyB0byBmZXRjaCB1c2VyJ3MgY3JlZGVudGlhbHMuIDxjb2RlPidtZSc8L2NvZGU+IHRvcGljIG9ubHkuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTWV0YUdldEJ1aWxkZXIjXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuTWV0YUdldEJ1aWxkZXJ9IDxjb2RlPnRoaXM8L2NvZGU+IG9iamVjdC5cbiAgICovXG4gIHdpdGhDcmVkKCkge1xuICAgIGlmICh0aGlzLnRvcGljLmdldFR5cGUoKSA9PSAnbWUnKSB7XG4gICAgICB0aGlzLndoYXRbJ2NyZWQnXSA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudG9waWMuX3Rpbm9kZS5sb2dnZXIoXCJFUlJPUjogSW52YWxpZCB0b3BpYyB0eXBlIGZvciBNZXRhR2V0QnVpbGRlcjp3aXRoQ3JlZHNcIiwgdGhpcy50b3BpYy5nZXRUeXBlKCkpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICAvKipcbiAgICogQWRkIHF1ZXJ5IHBhcmFtZXRlcnMgdG8gZmV0Y2ggZGVsZXRlZCBtZXNzYWdlcyB3aXRoaW4gZXhwbGljaXQgbGltaXRzLiBBbnkvYWxsIHBhcmFtZXRlcnMgY2FuIGJlIG51bGwuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTWV0YUdldEJ1aWxkZXIjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gc2luY2UgLSBpZHMgb2YgbWVzc2FnZXMgZGVsZXRlZCBzaW5jZSB0aGlzICdkZWwnIGlkIChpbmNsdXNpdmUpXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gbGltaXQgLSBudW1iZXIgb2YgZGVsZXRlZCBtZXNzYWdlIGlkcyB0byBmZXRjaFxuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLk1ldGFHZXRCdWlsZGVyfSA8Y29kZT50aGlzPC9jb2RlPiBvYmplY3QuXG4gICAqL1xuICB3aXRoRGVsKHNpbmNlLCBsaW1pdCkge1xuICAgIGlmIChzaW5jZSB8fCBsaW1pdCkge1xuICAgICAgdGhpcy53aGF0WydkZWwnXSA9IHtcbiAgICAgICAgc2luY2U6IHNpbmNlLFxuICAgICAgICBsaW1pdDogbGltaXRcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIC8qKlxuICAgKiBBZGQgcXVlcnkgcGFyYW1ldGVycyB0byBmZXRjaCBtZXNzYWdlcyBkZWxldGVkIGFmdGVyIHRoZSBzYXZlZCA8Y29kZT4nZGVsJzwvY29kZT4gaWQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTWV0YUdldEJ1aWxkZXIjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gbGltaXQgLSBudW1iZXIgb2YgZGVsZXRlZCBtZXNzYWdlIGlkcyB0byBmZXRjaFxuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLk1ldGFHZXRCdWlsZGVyfSA8Y29kZT50aGlzPC9jb2RlPiBvYmplY3QuXG4gICAqL1xuICB3aXRoTGF0ZXJEZWwobGltaXQpIHtcbiAgICAvLyBTcGVjaWZ5ICdzaW5jZScgb25seSBpZiB3ZSBoYXZlIGFscmVhZHkgcmVjZWl2ZWQgc29tZSBtZXNzYWdlcy4gSWZcbiAgICAvLyB3ZSBoYXZlIG5vIGxvY2FsbHkgY2FjaGVkIG1lc3NhZ2VzIHRoZW4gd2UgZG9uJ3QgY2FyZSBpZiBhbnkgbWVzc2FnZXMgd2VyZSBkZWxldGVkLlxuICAgIHJldHVybiB0aGlzLndpdGhEZWwodGhpcy50b3BpYy5fbWF4U2VxID4gMCA/IHRoaXMudG9waWMuX21heERlbCArIDEgOiB1bmRlZmluZWQsIGxpbWl0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeHRyYWN0IHN1YnF1ZXJ5OiBnZXQgYW4gb2JqZWN0IHRoYXQgY29udGFpbnMgc3BlY2lmaWVkIHN1YnF1ZXJ5LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLk1ldGFHZXRCdWlsZGVyI1xuICAgKiBAcGFyYW0ge3N0cmluZ30gd2hhdCAtIHN1YnF1ZXJ5IHRvIHJldHVybjogb25lIG9mICdkYXRhJywgJ3N1YicsICdkZXNjJywgJ3RhZ3MnLCAnY3JlZCcsICdkZWwnLlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSByZXF1ZXN0ZWQgc3VicXVlcnkgb3IgPGNvZGU+dW5kZWZpbmVkPC9jb2RlPi5cbiAgICovXG4gIGV4dHJhY3Qod2hhdCkge1xuICAgIHJldHVybiB0aGlzLndoYXRbd2hhdF07XG4gIH1cblxuICAvKipcbiAgICogQ29uc3RydWN0IHBhcmFtZXRlcnMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTWV0YUdldEJ1aWxkZXIjXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuR2V0UXVlcnl9IEdldCBxdWVyeVxuICAgKi9cbiAgYnVpbGQoKSB7XG4gICAgY29uc3Qgd2hhdCA9IFtdO1xuICAgIGxldCBwYXJhbXMgPSB7fTtcbiAgICBbJ2RhdGEnLCAnc3ViJywgJ2Rlc2MnLCAndGFncycsICdjcmVkJywgJ2RlbCddLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgaWYgKHRoaXMud2hhdC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgIHdoYXQucHVzaChrZXkpO1xuICAgICAgICBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGhpcy53aGF0W2tleV0pLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBwYXJhbXNba2V5XSA9IHRoaXMud2hhdFtrZXldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKHdoYXQubGVuZ3RoID4gMCkge1xuICAgICAgcGFyYW1zLndoYXQgPSB3aGF0LmpvaW4oJyAnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGFyYW1zID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICByZXR1cm4gcGFyYW1zO1xuICB9XG59XG4iLCIvKipcbiAqIEBmaWxlIFNESyB0byBjb25uZWN0IHRvIFRpbm9kZSBjaGF0IHNlcnZlci5cbiAqIFNlZSA8YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL3Rpbm9kZS93ZWJhcHBcIj5odHRwczovL2dpdGh1Yi5jb20vdGlub2RlL3dlYmFwcDwvYT4gZm9yIHJlYWwtbGlmZSB1c2FnZS5cbiAqXG4gKiBAY29weXJpZ2h0IDIwMTUtMjAyMiBUaW5vZGUgTExDLlxuICogQHN1bW1hcnkgSmF2YXNjcmlwdCBiaW5kaW5ncyBmb3IgVGlub2RlLlxuICogQGxpY2Vuc2UgQXBhY2hlIDIuMFxuICogQHZlcnNpb24gMC4xOFxuICpcbiAqIEBleGFtcGxlXG4gKiA8aGVhZD5cbiAqIDxzY3JpcHQgc3JjPVwiLi4uL3Rpbm9kZS5qc1wiPjwvc2NyaXB0PlxuICogPC9oZWFkPlxuICpcbiAqIDxib2R5PlxuICogIC4uLlxuICogPHNjcmlwdD5cbiAqICAvLyBJbnN0YW50aWF0ZSB0aW5vZGUuXG4gKiAgY29uc3QgdGlub2RlID0gbmV3IFRpbm9kZShjb25maWcsICgpID0+IHtcbiAqICAgIC8vIENhbGxlZCBvbiBpbml0IGNvbXBsZXRpb24uXG4gKiAgfSk7XG4gKiAgdGlub2RlLmVuYWJsZUxvZ2dpbmcodHJ1ZSk7XG4gKiAgdGlub2RlLm9uRGlzY29ubmVjdCA9IChlcnIpID0+IHtcbiAqICAgIC8vIEhhbmRsZSBkaXNjb25uZWN0LlxuICogIH07XG4gKiAgLy8gQ29ubmVjdCB0byB0aGUgc2VydmVyLlxuICogIHRpbm9kZS5jb25uZWN0KCdodHRwczovL2V4YW1wbGUuY29tLycpLnRoZW4oKCkgPT4ge1xuICogICAgLy8gQ29ubmVjdGVkLiBMb2dpbiBub3cuXG4gKiAgICByZXR1cm4gdGlub2RlLmxvZ2luQmFzaWMobG9naW4sIHBhc3N3b3JkKTtcbiAqICB9KS50aGVuKChjdHJsKSA9PiB7XG4gKiAgICAvLyBMb2dnZWQgaW4gZmluZSwgYXR0YWNoIGNhbGxiYWNrcywgc3Vic2NyaWJlIHRvICdtZScuXG4gKiAgICBjb25zdCBtZSA9IHRpbm9kZS5nZXRNZVRvcGljKCk7XG4gKiAgICBtZS5vbk1ldGFEZXNjID0gZnVuY3Rpb24obWV0YSkgeyAuLi4gfTtcbiAqICAgIC8vIFN1YnNjcmliZSwgZmV0Y2ggdG9waWMgZGVzY3JpcHRpb24gYW5kIHRoZSBsaXN0IG9mIGNvbnRhY3RzLlxuICogICAgbWUuc3Vic2NyaWJlKHtnZXQ6IHtkZXNjOiB7fSwgc3ViOiB7fX19KTtcbiAqICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gKiAgICAvLyBMb2dpbiBvciBzdWJzY3JpcHRpb24gZmFpbGVkLCBkbyBzb21ldGhpbmcuXG4gKiAgICAuLi5cbiAqICB9KTtcbiAqICAuLi5cbiAqIDwvc2NyaXB0PlxuICogPC9ib2R5PlxuICovXG4ndXNlIHN0cmljdCc7XG5cbi8vIE5PVEUgVE8gREVWRUxPUEVSUzpcbi8vIExvY2FsaXphYmxlIHN0cmluZ3Mgc2hvdWxkIGJlIGRvdWJsZSBxdW90ZWQgXCLRgdGC0YDQvtC60LAg0L3QsCDQtNGA0YPQs9C+0Lwg0Y/Qt9GL0LrQtVwiLFxuLy8gbm9uLWxvY2FsaXphYmxlIHN0cmluZ3Mgc2hvdWxkIGJlIHNpbmdsZSBxdW90ZWQgJ25vbi1sb2NhbGl6ZWQnLlxuXG5pbXBvcnQgQWNjZXNzTW9kZSBmcm9tICcuL2FjY2Vzcy1tb2RlLmpzJztcbmltcG9ydCAqIGFzIENvbnN0IGZyb20gJy4vY29uZmlnLmpzJztcbmltcG9ydCBDb25uZWN0aW9uIGZyb20gJy4vY29ubmVjdGlvbi5qcyc7XG5pbXBvcnQgREJDYWNoZSBmcm9tICcuL2RiLmpzJztcbmltcG9ydCBEcmFmdHkgZnJvbSAnLi9kcmFmdHkuanMnO1xuaW1wb3J0IExhcmdlRmlsZUhlbHBlciBmcm9tICcuL2xhcmdlLWZpbGUuanMnO1xuaW1wb3J0IHtcbiAgVG9waWMsXG4gIFRvcGljTWUsXG4gIFRvcGljRm5kXG59IGZyb20gJy4vdG9waWMuanMnO1xuXG5pbXBvcnQge1xuICBqc29uUGFyc2VIZWxwZXIsXG4gIG1lcmdlT2JqLFxuICByZmMzMzM5RGF0ZVN0cmluZyxcbiAgc2ltcGxpZnlcbn0gZnJvbSAnLi91dGlscy5qcyc7XG5cbmxldCBXZWJTb2NrZXRQcm92aWRlcjtcbmlmICh0eXBlb2YgV2ViU29ja2V0ICE9ICd1bmRlZmluZWQnKSB7XG4gIFdlYlNvY2tldFByb3ZpZGVyID0gV2ViU29ja2V0O1xufVxuXG5sZXQgWEhSUHJvdmlkZXI7XG5pZiAodHlwZW9mIFhNTEh0dHBSZXF1ZXN0ICE9ICd1bmRlZmluZWQnKSB7XG4gIFhIUlByb3ZpZGVyID0gWE1MSHR0cFJlcXVlc3Q7XG59XG5cbmxldCBJbmRleGVkREJQcm92aWRlcjtcbmlmICh0eXBlb2YgaW5kZXhlZERCICE9ICd1bmRlZmluZWQnKSB7XG4gIEluZGV4ZWREQlByb3ZpZGVyID0gaW5kZXhlZERCO1xufVxuXG4vLyBSZS1leHBvcnQgRHJhZnR5LlxuZXhwb3J0IHtcbiAgRHJhZnR5XG59XG5cbmluaXRGb3JOb25Ccm93c2VyQXBwKCk7XG5cbi8vIFV0aWxpdHkgZnVuY3Rpb25zXG5cbi8vIFBvbHlmaWxsIGZvciBub24tYnJvd3NlciBjb250ZXh0LCBlLmcuIE5vZGVKcy5cbmZ1bmN0aW9uIGluaXRGb3JOb25Ccm93c2VyQXBwKCkge1xuICAvLyBUaW5vZGUgcmVxdWlyZW1lbnQgaW4gbmF0aXZlIG1vZGUgYmVjYXVzZSByZWFjdCBuYXRpdmUgZG9lc24ndCBwcm92aWRlIEJhc2U2NCBtZXRob2RcbiAgY29uc3QgY2hhcnMgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLz0nO1xuXG4gIGlmICh0eXBlb2YgYnRvYSA9PSAndW5kZWZpbmVkJykge1xuICAgIGdsb2JhbC5idG9hID0gZnVuY3Rpb24oaW5wdXQgPSAnJykge1xuICAgICAgbGV0IHN0ciA9IGlucHV0O1xuICAgICAgbGV0IG91dHB1dCA9ICcnO1xuXG4gICAgICBmb3IgKGxldCBibG9jayA9IDAsIGNoYXJDb2RlLCBpID0gMCwgbWFwID0gY2hhcnM7IHN0ci5jaGFyQXQoaSB8IDApIHx8IChtYXAgPSAnPScsIGkgJSAxKTsgb3V0cHV0ICs9IG1hcC5jaGFyQXQoNjMgJiBibG9jayA+PiA4IC0gaSAlIDEgKiA4KSkge1xuXG4gICAgICAgIGNoYXJDb2RlID0gc3RyLmNoYXJDb2RlQXQoaSArPSAzIC8gNCk7XG5cbiAgICAgICAgaWYgKGNoYXJDb2RlID4gMHhGRikge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIididG9hJyBmYWlsZWQ6IFRoZSBzdHJpbmcgdG8gYmUgZW5jb2RlZCBjb250YWlucyBjaGFyYWN0ZXJzIG91dHNpZGUgb2YgdGhlIExhdGluMSByYW5nZS5cIik7XG4gICAgICAgIH1cbiAgICAgICAgYmxvY2sgPSBibG9jayA8PCA4IHwgY2hhckNvZGU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgYXRvYiA9PSAndW5kZWZpbmVkJykge1xuICAgIGdsb2JhbC5hdG9iID0gZnVuY3Rpb24oaW5wdXQgPSAnJykge1xuICAgICAgbGV0IHN0ciA9IGlucHV0LnJlcGxhY2UoLz0rJC8sICcnKTtcbiAgICAgIGxldCBvdXRwdXQgPSAnJztcblxuICAgICAgaWYgKHN0ci5sZW5ndGggJSA0ID09IDEpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiJ2F0b2InIGZhaWxlZDogVGhlIHN0cmluZyB0byBiZSBkZWNvZGVkIGlzIG5vdCBjb3JyZWN0bHkgZW5jb2RlZC5cIik7XG4gICAgICB9XG4gICAgICBmb3IgKGxldCBiYyA9IDAsIGJzID0gMCwgYnVmZmVyLCBpID0gMDsgYnVmZmVyID0gc3RyLmNoYXJBdChpKyspO1xuXG4gICAgICAgIH5idWZmZXIgJiYgKGJzID0gYmMgJSA0ID8gYnMgKiA2NCArIGJ1ZmZlciA6IGJ1ZmZlcixcbiAgICAgICAgICBiYysrICUgNCkgPyBvdXRwdXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZSgyNTUgJiBicyA+PiAoLTIgKiBiYyAmIDYpKSA6IDBcbiAgICAgICkge1xuICAgICAgICBidWZmZXIgPSBjaGFycy5pbmRleE9mKGJ1ZmZlcik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfTtcbiAgfVxuXG4gIGlmICh0eXBlb2Ygd2luZG93ID09ICd1bmRlZmluZWQnKSB7XG4gICAgZ2xvYmFsLndpbmRvdyA9IHtcbiAgICAgIFdlYlNvY2tldDogV2ViU29ja2V0UHJvdmlkZXIsXG4gICAgICBYTUxIdHRwUmVxdWVzdDogWEhSUHJvdmlkZXIsXG4gICAgICBpbmRleGVkREI6IEluZGV4ZWREQlByb3ZpZGVyLFxuICAgICAgVVJMOiB7XG4gICAgICAgIGNyZWF0ZU9iamVjdFVSTDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5hYmxlIHRvIHVzZSBVUkwuY3JlYXRlT2JqZWN0VVJMIGluIGEgbm9uLWJyb3dzZXIgYXBwbGljYXRpb25cIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBDb25uZWN0aW9uLnNldE5ldHdvcmtQcm92aWRlcnMoV2ViU29ja2V0UHJvdmlkZXIsIFhIUlByb3ZpZGVyKTtcbiAgTGFyZ2VGaWxlSGVscGVyLnNldE5ldHdvcmtQcm92aWRlcihYSFJQcm92aWRlcik7XG4gIERCQ2FjaGUuc2V0RGF0YWJhc2VQcm92aWRlcihJbmRleGVkREJQcm92aWRlcik7XG59XG5cbi8vIERldGVjdCBmaW5kIG1vc3QgdXNlZnVsIG5ldHdvcmsgdHJhbnNwb3J0LlxuZnVuY3Rpb24gZGV0ZWN0VHJhbnNwb3J0KCkge1xuICBpZiAodHlwZW9mIHdpbmRvdyA9PSAnb2JqZWN0Jykge1xuICAgIGlmICh3aW5kb3dbJ1dlYlNvY2tldCddKSB7XG4gICAgICByZXR1cm4gJ3dzJztcbiAgICB9IGVsc2UgaWYgKHdpbmRvd1snWE1MSHR0cFJlcXVlc3QnXSkge1xuICAgICAgLy8gVGhlIGJyb3dzZXIgb3Igbm9kZSBoYXMgbm8gd2Vic29ja2V0cywgdXNpbmcgbG9uZyBwb2xsaW5nLlxuICAgICAgcmV0dXJuICdscCc7XG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG4vLyBidG9hIHJlcGxhY2VtZW50LiBTdG9jayBidG9hIGZhaWxzIG9uIG9uIG5vbi1MYXRpbjEgc3RyaW5ncy5cbmZ1bmN0aW9uIGI2NEVuY29kZVVuaWNvZGUoc3RyKSB7XG4gIC8vIFRoZSBlbmNvZGVVUklDb21wb25lbnQgcGVyY2VudC1lbmNvZGVzIFVURi04IHN0cmluZyxcbiAgLy8gdGhlbiB0aGUgcGVyY2VudCBlbmNvZGluZyBpcyBjb252ZXJ0ZWQgaW50byByYXcgYnl0ZXMgd2hpY2hcbiAgLy8gY2FuIGJlIGZlZCBpbnRvIGJ0b2EuXG4gIHJldHVybiBidG9hKGVuY29kZVVSSUNvbXBvbmVudChzdHIpLnJlcGxhY2UoLyUoWzAtOUEtRl17Mn0pL2csXG4gICAgZnVuY3Rpb24gdG9Tb2xpZEJ5dGVzKG1hdGNoLCBwMSkge1xuICAgICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoJzB4JyArIHAxKTtcbiAgICB9KSk7XG59XG5cbi8vIEpTT04gc3RyaW5naWZ5IGhlbHBlciAtIHByZS1wcm9jZXNzb3IgZm9yIEpTT04uc3RyaW5naWZ5XG5mdW5jdGlvbiBqc29uQnVpbGRIZWxwZXIoa2V5LCB2YWwpIHtcbiAgaWYgKHZhbCBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAvLyBDb252ZXJ0IGphdmFzY3JpcHQgRGF0ZSBvYmplY3RzIHRvIHJmYzMzMzkgc3RyaW5nc1xuICAgIHZhbCA9IHJmYzMzMzlEYXRlU3RyaW5nKHZhbCk7XG4gIH0gZWxzZSBpZiAodmFsIGluc3RhbmNlb2YgQWNjZXNzTW9kZSkge1xuICAgIHZhbCA9IHZhbC5qc29uSGVscGVyKCk7XG4gIH0gZWxzZSBpZiAodmFsID09PSB1bmRlZmluZWQgfHwgdmFsID09PSBudWxsIHx8IHZhbCA9PT0gZmFsc2UgfHxcbiAgICAoQXJyYXkuaXNBcnJheSh2YWwpICYmIHZhbC5sZW5ndGggPT0gMCkgfHxcbiAgICAoKHR5cGVvZiB2YWwgPT0gJ29iamVjdCcpICYmIChPYmplY3Qua2V5cyh2YWwpLmxlbmd0aCA9PSAwKSkpIHtcbiAgICAvLyBzdHJpcCBvdXQgZW1wdHkgZWxlbWVudHMgd2hpbGUgc2VyaWFsaXppbmcgb2JqZWN0cyB0byBKU09OXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHJldHVybiB2YWw7XG59O1xuXG4vLyBUcmltcyB2ZXJ5IGxvbmcgc3RyaW5ncyAoZW5jb2RlZCBpbWFnZXMpIHRvIG1ha2UgbG9nZ2VkIHBhY2tldHMgbW9yZSByZWFkYWJsZS5cbmZ1bmN0aW9uIGpzb25Mb2dnZXJIZWxwZXIoa2V5LCB2YWwpIHtcbiAgaWYgKHR5cGVvZiB2YWwgPT0gJ3N0cmluZycgJiYgdmFsLmxlbmd0aCA+IDEyOCkge1xuICAgIHJldHVybiAnPCcgKyB2YWwubGVuZ3RoICsgJywgYnl0ZXM6ICcgKyB2YWwuc3Vic3RyaW5nKDAsIDEyKSArICcuLi4nICsgdmFsLnN1YnN0cmluZyh2YWwubGVuZ3RoIC0gMTIpICsgJz4nO1xuICB9XG4gIHJldHVybiBqc29uQnVpbGRIZWxwZXIoa2V5LCB2YWwpO1xufTtcblxuLy8gUGFyc2UgYnJvd3NlciB1c2VyIGFnZW50IHRvIGV4dHJhY3QgYnJvd3NlciBuYW1lIGFuZCB2ZXJzaW9uLlxuZnVuY3Rpb24gZ2V0QnJvd3NlckluZm8odWEsIHByb2R1Y3QpIHtcbiAgdWEgPSB1YSB8fCAnJztcbiAgbGV0IHJlYWN0bmF0aXZlID0gJyc7XG4gIC8vIENoZWNrIGlmIHRoaXMgaXMgYSBSZWFjdE5hdGl2ZSBhcHAuXG4gIGlmICgvcmVhY3RuYXRpdmUvaS50ZXN0KHByb2R1Y3QpKSB7XG4gICAgcmVhY3RuYXRpdmUgPSAnUmVhY3ROYXRpdmU7ICc7XG4gIH1cbiAgbGV0IHJlc3VsdDtcbiAgLy8gUmVtb3ZlIHVzZWxlc3Mgc3RyaW5nLlxuICB1YSA9IHVhLnJlcGxhY2UoJyAoS0hUTUwsIGxpa2UgR2Vja28pJywgJycpO1xuICAvLyBUZXN0IGZvciBXZWJLaXQtYmFzZWQgYnJvd3Nlci5cbiAgbGV0IG0gPSB1YS5tYXRjaCgvKEFwcGxlV2ViS2l0XFwvWy5cXGRdKykvaSk7XG4gIGlmIChtKSB7XG4gICAgLy8gTGlzdCBvZiBjb21tb24gc3RyaW5ncywgZnJvbSBtb3JlIHVzZWZ1bCB0byBsZXNzIHVzZWZ1bC5cbiAgICAvLyBBbGwgdW5rbm93biBzdHJpbmdzIGdldCB0aGUgaGlnaGVzdCAoLTEpIHByaW9yaXR5LlxuICAgIGNvbnN0IHByaW9yaXR5ID0gWydlZGcnLCAnY2hyb21lJywgJ3NhZmFyaScsICdtb2JpbGUnLCAndmVyc2lvbiddO1xuICAgIGxldCB0bXAgPSB1YS5zdWJzdHIobS5pbmRleCArIG1bMF0ubGVuZ3RoKS5zcGxpdCgnICcpO1xuICAgIGxldCB0b2tlbnMgPSBbXTtcbiAgICBsZXQgdmVyc2lvbjsgLy8gMS4wIGluIFZlcnNpb24vMS4wIG9yIHVuZGVmaW5lZDtcbiAgICAvLyBTcGxpdCBzdHJpbmcgbGlrZSAnTmFtZS8wLjAuMCcgaW50byBbJ05hbWUnLCAnMC4wLjAnLCAzXSB3aGVyZSB0aGUgbGFzdCBlbGVtZW50IGlzIHRoZSBwcmlvcml0eS5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRtcC5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IG0yID0gLyhbXFx3Ll0rKVtcXC9dKFtcXC5cXGRdKykvLmV4ZWModG1wW2ldKTtcbiAgICAgIGlmIChtMikge1xuICAgICAgICAvLyBVbmtub3duIHZhbHVlcyBhcmUgaGlnaGVzdCBwcmlvcml0eSAoLTEpLlxuICAgICAgICB0b2tlbnMucHVzaChbbTJbMV0sIG0yWzJdLCBwcmlvcml0eS5maW5kSW5kZXgoKGUpID0+IHtcbiAgICAgICAgICByZXR1cm4gbTJbMV0udG9Mb3dlckNhc2UoKS5zdGFydHNXaXRoKGUpO1xuICAgICAgICB9KV0pO1xuICAgICAgICBpZiAobTJbMV0gPT0gJ1ZlcnNpb24nKSB7XG4gICAgICAgICAgdmVyc2lvbiA9IG0yWzJdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIC8vIFNvcnQgYnkgcHJpb3JpdHk6IG1vcmUgaW50ZXJlc3RpbmcgaXMgZWFybGllciB0aGFuIGxlc3MgaW50ZXJlc3RpbmcuXG4gICAgdG9rZW5zLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgIHJldHVybiBhWzJdIC0gYlsyXTtcbiAgICB9KTtcbiAgICBpZiAodG9rZW5zLmxlbmd0aCA+IDApIHtcbiAgICAgIC8vIFJldHVybiB0aGUgbGVhc3QgY29tbW9uIGJyb3dzZXIgc3RyaW5nIGFuZCB2ZXJzaW9uLlxuICAgICAgaWYgKHRva2Vuc1swXVswXS50b0xvd2VyQ2FzZSgpLnN0YXJ0c1dpdGgoJ2VkZycpKSB7XG4gICAgICAgIHRva2Vuc1swXVswXSA9ICdFZGdlJztcbiAgICAgIH0gZWxzZSBpZiAodG9rZW5zWzBdWzBdID09ICdPUFInKSB7XG4gICAgICAgIHRva2Vuc1swXVswXSA9ICdPcGVyYSc7XG4gICAgICB9IGVsc2UgaWYgKHRva2Vuc1swXVswXSA9PSAnU2FmYXJpJyAmJiB2ZXJzaW9uKSB7XG4gICAgICAgIHRva2Vuc1swXVsxXSA9IHZlcnNpb247XG4gICAgICB9XG4gICAgICByZXN1bHQgPSB0b2tlbnNbMF1bMF0gKyAnLycgKyB0b2tlbnNbMF1bMV07XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEZhaWxlZCB0byBJRCB0aGUgYnJvd3Nlci4gUmV0dXJuIHRoZSB3ZWJraXQgdmVyc2lvbi5cbiAgICAgIHJlc3VsdCA9IG1bMV07XG4gICAgfVxuICB9IGVsc2UgaWYgKC9maXJlZm94L2kudGVzdCh1YSkpIHtcbiAgICBtID0gL0ZpcmVmb3hcXC8oWy5cXGRdKykvZy5leGVjKHVhKTtcbiAgICBpZiAobSkge1xuICAgICAgcmVzdWx0ID0gJ0ZpcmVmb3gvJyArIG1bMV07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdCA9ICdGaXJlZm94Lz8nO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvLyBOZWl0aGVyIEFwcGxlV2ViS2l0IG5vciBGaXJlZm94LiBUcnkgdGhlIGxhc3QgcmVzb3J0LlxuICAgIG0gPSAvKFtcXHcuXSspXFwvKFsuXFxkXSspLy5leGVjKHVhKTtcbiAgICBpZiAobSkge1xuICAgICAgcmVzdWx0ID0gbVsxXSArICcvJyArIG1bMl07XG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSB1YS5zcGxpdCgnICcpO1xuICAgICAgcmVzdWx0ID0gbVswXTtcbiAgICB9XG4gIH1cblxuICAvLyBTaG9ydGVuIHRoZSB2ZXJzaW9uIHRvIG9uZSBkb3QgJ2EuYmIuY2NjLmQgLT4gYS5iYicgYXQgbW9zdC5cbiAgbSA9IHJlc3VsdC5zcGxpdCgnLycpO1xuICBpZiAobS5sZW5ndGggPiAxKSB7XG4gICAgY29uc3QgdiA9IG1bMV0uc3BsaXQoJy4nKTtcbiAgICBjb25zdCBtaW5vciA9IHZbMV0gPyAnLicgKyB2WzFdLnN1YnN0cigwLCAyKSA6ICcnO1xuICAgIHJlc3VsdCA9IGAke21bMF19LyR7dlswXX0ke21pbm9yfWA7XG4gIH1cbiAgcmV0dXJuIHJlYWN0bmF0aXZlICsgcmVzdWx0O1xufVxuXG4vKipcbiAqIEBjbGFzcyBUaW5vZGVcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnIC0gY29uZmlndXJhdGlvbiBwYXJhbWV0ZXJzLlxuICogQHBhcmFtIHtzdHJpbmd9IGNvbmZpZy5hcHBOYW1lIC0gTmFtZSBvZiB0aGUgY2FsbGluZyBhcHBsaWNhdGlvbiB0byBiZSByZXBvcnRlZCBpbiB0aGUgVXNlciBBZ2VudC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBjb25maWcuaG9zdCAtIEhvc3QgbmFtZSBhbmQgb3B0aW9uYWwgcG9ydCBudW1iZXIgdG8gY29ubmVjdCB0by5cbiAqIEBwYXJhbSB7c3RyaW5nfSBjb25maWcuYXBpS2V5IC0gQVBJIGtleSBnZW5lcmF0ZWQgYnkgPGNvZGU+a2V5Z2VuPC9jb2RlPi5cbiAqIEBwYXJhbSB7c3RyaW5nfSBjb25maWcudHJhbnNwb3J0IC0gU2VlIHtAbGluayBUaW5vZGUuQ29ubmVjdGlvbiN0cmFuc3BvcnR9LlxuICogQHBhcmFtIHtib29sZWFufSBjb25maWcuc2VjdXJlIC0gVXNlIFNlY3VyZSBXZWJTb2NrZXQgaWYgPGNvZGU+dHJ1ZTwvY29kZT4uXG4gKiBAcGFyYW0ge3N0cmluZ30gY29uZmlnLnBsYXRmb3JtIC0gT3B0aW9uYWwgcGxhdGZvcm0gaWRlbnRpZmllciwgb25lIG9mIDxjb2RlPlwiaW9zXCI8L2NvZGU+LCA8Y29kZT5cIndlYlwiPC9jb2RlPiwgPGNvZGU+XCJhbmRyb2lkXCI8L2NvZGU+LlxuICogQHBhcmFtIHtib29sZW59IGNvbmZpZy5wZXJzaXN0IC0gVXNlIEluZGV4ZWREQiBwZXJzaXN0ZW50IHN0b3JhZ2UuXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBvbkNvbXBsZXRlIC0gY2FsbGJhY2sgdG8gY2FsbCB3aGVuIGluaXRpYWxpemF0aW9uIGlzIGNvbXBsZXRlZC5cbiAqL1xuZXhwb3J0IGNsYXNzIFRpbm9kZSB7XG4gIF9ob3N0O1xuICBfc2VjdXJlO1xuXG4gIF9hcHBOYW1lO1xuXG4gIC8vIEFQSSBLZXkuXG4gIF9hcGlLZXk7XG5cbiAgLy8gTmFtZSBhbmQgdmVyc2lvbiBvZiB0aGUgYnJvd3Nlci5cbiAgX2Jyb3dzZXIgPSAnJztcbiAgX3BsYXRmb3JtO1xuICAvLyBIYXJkd2FyZVxuICBfaHdvcyA9ICd1bmRlZmluZWQnO1xuICBfaHVtYW5MYW5ndWFnZSA9ICd4eCc7XG5cbiAgLy8gTG9nZ2luZyB0byBjb25zb2xlIGVuYWJsZWRcbiAgX2xvZ2dpbmdFbmFibGVkID0gZmFsc2U7XG4gIC8vIFdoZW4gbG9nZ2luZywgdHJpcCBsb25nIHN0cmluZ3MgKGJhc2U2NC1lbmNvZGVkIGltYWdlcykgZm9yIHJlYWRhYmlsaXR5XG4gIF90cmltTG9uZ1N0cmluZ3MgPSBmYWxzZTtcbiAgLy8gVUlEIG9mIHRoZSBjdXJyZW50bHkgYXV0aGVudGljYXRlZCB1c2VyLlxuICBfbXlVSUQgPSBudWxsO1xuICAvLyBTdGF0dXMgb2YgY29ubmVjdGlvbjogYXV0aGVudGljYXRlZCBvciBub3QuXG4gIF9hdXRoZW50aWNhdGVkID0gZmFsc2U7XG4gIC8vIExvZ2luIHVzZWQgaW4gdGhlIGxhc3Qgc3VjY2Vzc2Z1bCBiYXNpYyBhdXRoZW50aWNhdGlvblxuICBfbG9naW4gPSBudWxsO1xuICAvLyBUb2tlbiB3aGljaCBjYW4gYmUgdXNlZCBmb3IgbG9naW4gaW5zdGVhZCBvZiBsb2dpbi9wYXNzd29yZC5cbiAgX2F1dGhUb2tlbiA9IG51bGw7XG4gIC8vIENvdW50ZXIgb2YgcmVjZWl2ZWQgcGFja2V0c1xuICBfaW5QYWNrZXRDb3VudCA9IDA7XG4gIC8vIENvdW50ZXIgZm9yIGdlbmVyYXRpbmcgdW5pcXVlIG1lc3NhZ2UgSURzXG4gIF9tZXNzYWdlSWQgPSBNYXRoLmZsb29yKChNYXRoLnJhbmRvbSgpICogMHhGRkZGKSArIDB4RkZGRik7XG4gIC8vIEluZm9ybWF0aW9uIGFib3V0IHRoZSBzZXJ2ZXIsIGlmIGNvbm5lY3RlZFxuICBfc2VydmVySW5mbyA9IG51bGw7XG4gIC8vIFB1c2ggbm90aWZpY2F0aW9uIHRva2VuLiBDYWxsZWQgZGV2aWNlVG9rZW4gZm9yIGNvbnNpc3RlbmN5IHdpdGggdGhlIEFuZHJvaWQgU0RLLlxuICBfZGV2aWNlVG9rZW4gPSBudWxsO1xuXG4gIC8vIENhY2hlIG9mIHBlbmRpbmcgcHJvbWlzZXMgYnkgbWVzc2FnZSBpZC5cbiAgX3BlbmRpbmdQcm9taXNlcyA9IHt9O1xuICAvLyBUaGUgVGltZW91dCBvYmplY3QgcmV0dXJuZWQgYnkgdGhlIHJlamVjdCBleHBpcmVkIHByb21pc2VzIHNldEludGVydmFsLlxuICBfZXhwaXJlUHJvbWlzZXMgPSBudWxsO1xuXG4gIC8vIFdlYnNvY2tldCBvciBsb25nIHBvbGxpbmcgY29ubmVjdGlvbi5cbiAgX2Nvbm5lY3Rpb24gPSBudWxsO1xuXG4gIC8vIFVzZSBpbmRleERCIGZvciBjYWNoaW5nIHRvcGljcyBhbmQgbWVzc2FnZXMuXG4gIF9wZXJzaXN0ID0gZmFsc2U7XG4gIC8vIEluZGV4ZWREQiB3cmFwcGVyIG9iamVjdC5cbiAgX2RiID0gbnVsbDtcblxuICAvLyBUaW5vZGUncyBjYWNoZSBvZiBvYmplY3RzXG4gIF9jYWNoZSA9IHt9O1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZywgb25Db21wbGV0ZSkge1xuICAgIHRoaXMuX2hvc3QgPSBjb25maWcuaG9zdDtcbiAgICB0aGlzLl9zZWN1cmUgPSBjb25maWcuc2VjdXJlO1xuXG4gICAgLy8gQ2xpZW50LXByb3ZpZGVkIGFwcGxpY2F0aW9uIG5hbWUsIGZvcm1hdCA8TmFtZT4vPHZlcnNpb24gbnVtYmVyPlxuICAgIHRoaXMuX2FwcE5hbWUgPSBjb25maWcuYXBwTmFtZSB8fCBcIlVuZGVmaW5lZFwiO1xuXG4gICAgLy8gQVBJIEtleS5cbiAgICB0aGlzLl9hcGlLZXkgPSBjb25maWcuYXBpS2V5O1xuXG4gICAgLy8gTmFtZSBhbmQgdmVyc2lvbiBvZiB0aGUgYnJvd3Nlci5cbiAgICB0aGlzLl9wbGF0Zm9ybSA9IGNvbmZpZy5wbGF0Zm9ybSB8fCAnd2ViJztcbiAgICAvLyBVbmRlcmx5aW5nIE9TLlxuICAgIGlmICh0eXBlb2YgbmF2aWdhdG9yICE9ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aGlzLl9icm93c2VyID0gZ2V0QnJvd3NlckluZm8obmF2aWdhdG9yLnVzZXJBZ2VudCwgbmF2aWdhdG9yLnByb2R1Y3QpO1xuICAgICAgdGhpcy5faHdvcyA9IG5hdmlnYXRvci5wbGF0Zm9ybTtcbiAgICAgIC8vIFRoaXMgaXMgdGhlIGRlZmF1bHQgbGFuZ3VhZ2UuIEl0IGNvdWxkIGJlIGNoYW5nZWQgYnkgY2xpZW50LlxuICAgICAgdGhpcy5faHVtYW5MYW5ndWFnZSA9IG5hdmlnYXRvci5sYW5ndWFnZSB8fCAnZW4tVVMnO1xuICAgIH1cblxuICAgIENvbm5lY3Rpb24ubG9nZ2VyID0gKHN0ciwgLi4uYXJncykgPT4ge1xuICAgICAgdGhpcy4jbG9nZ2VyKHN0ciwgYXJncyk7XG4gICAgfTtcbiAgICBEcmFmdHkubG9nZ2VyID0gKHN0ciwgLi4uYXJncykgPT4ge1xuICAgICAgdGhpcy4jbG9nZ2VyKHN0ciwgYXJncyk7XG4gICAgfTtcblxuICAgIC8vIFdlYlNvY2tldCBvciBsb25nIHBvbGxpbmcgbmV0d29yayBjb25uZWN0aW9uLlxuICAgIGlmIChjb25maWcudHJhbnNwb3J0ICE9ICdscCcgJiYgY29uZmlnLnRyYW5zcG9ydCAhPSAnd3MnKSB7XG4gICAgICBjb25maWcudHJhbnNwb3J0ID0gZGV0ZWN0VHJhbnNwb3J0KCk7XG4gICAgfVxuICAgIHRoaXMuX2Nvbm5lY3Rpb24gPSBuZXcgQ29ubmVjdGlvbihjb25maWcsIENvbnN0LlBST1RPQ09MX1ZFUlNJT04sIC8qIGF1dG9yZWNvbm5lY3QgKi8gdHJ1ZSk7XG4gICAgdGhpcy5fY29ubmVjdGlvbi5vbk1lc3NhZ2UgPSAoZGF0YSkgPT4ge1xuICAgICAgLy8gQ2FsbCB0aGUgbWFpbiBtZXNzYWdlIGRpc3BhdGNoZXIuXG4gICAgICB0aGlzLiNkaXNwYXRjaE1lc3NhZ2UoZGF0YSk7XG4gICAgfVxuICAgIHRoaXMuX2Nvbm5lY3Rpb24ub25PcGVuID0gKCkgPT4ge1xuICAgICAgLy8gUmVhZHkgdG8gc3RhcnQgc2VuZGluZy5cbiAgICAgIHRoaXMuI2Nvbm5lY3Rpb25PcGVuKCk7XG4gICAgfVxuICAgIHRoaXMuX2Nvbm5lY3Rpb24ub25EaXNjb25uZWN0ID0gKGVyciwgY29kZSkgPT4ge1xuICAgICAgdGhpcy4jZGlzY29ubmVjdGVkKGVyciwgY29kZSk7XG4gICAgfVxuICAgIC8vIFdyYXBwZXIgZm9yIHRoZSByZWNvbm5lY3QgaXRlcmF0b3IgY2FsbGJhY2suXG4gICAgdGhpcy5fY29ubmVjdGlvbi5vbkF1dG9yZWNvbm5lY3RJdGVyYXRpb24gPSAodGltZW91dCwgcHJvbWlzZSkgPT4ge1xuICAgICAgaWYgKHRoaXMub25BdXRvcmVjb25uZWN0SXRlcmF0aW9uKSB7XG4gICAgICAgIHRoaXMub25BdXRvcmVjb25uZWN0SXRlcmF0aW9uKHRpbWVvdXQsIHByb21pc2UpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuX3BlcnNpc3QgPSBjb25maWcucGVyc2lzdDtcbiAgICAvLyBJbml0aWFsaXplIG9iamVjdCByZWdhcmRsZXNzLiBJdCBzaW1wbGlmaWVzIHRoZSBjb2RlLlxuICAgIHRoaXMuX2RiID0gbmV3IERCQ2FjaGUoKGVycikgPT4ge1xuICAgICAgdGhpcy4jbG9nZ2VyKCdEQicsIGVycik7XG4gICAgfSwgdGhpcy5sb2dnZXIpO1xuXG4gICAgaWYgKHRoaXMuX3BlcnNpc3QpIHtcbiAgICAgIC8vIENyZWF0ZSB0aGUgcGVyc2lzdGVudCBjYWNoZS5cbiAgICAgIC8vIFN0b3JlIHByb21pc2VzIHRvIGJlIHJlc29sdmVkIHdoZW4gbWVzc2FnZXMgbG9hZCBpbnRvIG1lbW9yeS5cbiAgICAgIGNvbnN0IHByb20gPSBbXTtcbiAgICAgIHRoaXMuX2RiLmluaXREYXRhYmFzZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAvLyBGaXJzdCBsb2FkIHRvcGljcyBpbnRvIG1lbW9yeS5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2RiLm1hcFRvcGljcygoZGF0YSkgPT4ge1xuICAgICAgICAgIGxldCB0b3BpYyA9IHRoaXMuI2NhY2hlR2V0KCd0b3BpYycsIGRhdGEubmFtZSk7XG4gICAgICAgICAgaWYgKHRvcGljKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChkYXRhLm5hbWUgPT0gQ29uc3QuVE9QSUNfTUUpIHtcbiAgICAgICAgICAgIHRvcGljID0gbmV3IFRvcGljTWUoKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGRhdGEubmFtZSA9PSBDb25zdC5UT1BJQ19GTkQpIHtcbiAgICAgICAgICAgIHRvcGljID0gbmV3IFRvcGljRm5kKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRvcGljID0gbmV3IFRvcGljKGRhdGEubmFtZSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5fZGIuZGVzZXJpYWxpemVUb3BpYyh0b3BpYywgZGF0YSk7XG4gICAgICAgICAgdGhpcy4jYXR0YWNoQ2FjaGVUb1RvcGljKHRvcGljKTtcbiAgICAgICAgICB0b3BpYy5fY2FjaGVQdXRTZWxmKCk7XG4gICAgICAgICAgLy8gUmVxdWVzdCB0byBsb2FkIG1lc3NhZ2VzIGFuZCBzYXZlIHRoZSBwcm9taXNlLlxuICAgICAgICAgIHByb20ucHVzaCh0b3BpYy5fbG9hZE1lc3NhZ2VzKHRoaXMuX2RiKSk7XG4gICAgICAgIH0pO1xuICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgIC8vIFRoZW4gbG9hZCB1c2Vycy5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2RiLm1hcFVzZXJzKChkYXRhKSA9PiB7XG4gICAgICAgICAgdGhpcy4jY2FjaGVQdXQoJ3VzZXInLCBkYXRhLnVpZCwgbWVyZ2VPYmooe30sIGRhdGEucHVibGljKSk7XG4gICAgICAgIH0pO1xuICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgIC8vIE5vdyB3YWl0IGZvciBhbGwgbWVzc2FnZXMgdG8gZmluaXNoIGxvYWRpbmcuXG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9tKTtcbiAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICBpZiAob25Db21wbGV0ZSkge1xuICAgICAgICAgIG9uQ29tcGxldGUoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLiNsb2dnZXIoXCJQZXJzaXN0ZW50IGNhY2hlIGluaXRpYWxpemVkLlwiKTtcbiAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgaWYgKG9uQ29tcGxldGUpIHtcbiAgICAgICAgICBvbkNvbXBsZXRlKGVycik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy4jbG9nZ2VyKFwiRmFpbGVkIHRvIGluaXRpYWxpemUgcGVyc2lzdGVudCBjYWNoZTpcIiwgZXJyKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9kYi5kZWxldGVEYXRhYmFzZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICBpZiAob25Db21wbGV0ZSkge1xuICAgICAgICAgIG9uQ29tcGxldGUoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLy8gUHJpdmF0ZSBtZXRob2RzLlxuXG4gIC8vIENvbnNvbGUgbG9nZ2VyLiBCYWJlbCBzb21laG93IGZhaWxzIHRvIHBhcnNlICcuLi5yZXN0JyBwYXJhbWV0ZXIuXG4gICNsb2dnZXIoc3RyLCAuLi5hcmdzKSB7XG4gICAgaWYgKHRoaXMuX2xvZ2dpbmdFbmFibGVkKSB7XG4gICAgICBjb25zdCBkID0gbmV3IERhdGUoKTtcbiAgICAgIGNvbnN0IGRhdGVTdHJpbmcgPSAoJzAnICsgZC5nZXRVVENIb3VycygpKS5zbGljZSgtMikgKyAnOicgK1xuICAgICAgICAoJzAnICsgZC5nZXRVVENNaW51dGVzKCkpLnNsaWNlKC0yKSArICc6JyArXG4gICAgICAgICgnMCcgKyBkLmdldFVUQ1NlY29uZHMoKSkuc2xpY2UoLTIpICsgJy4nICtcbiAgICAgICAgKCcwMCcgKyBkLmdldFVUQ01pbGxpc2Vjb25kcygpKS5zbGljZSgtMyk7XG5cbiAgICAgIGNvbnNvbGUubG9nKCdbJyArIGRhdGVTdHJpbmcgKyAnXScsIHN0ciwgYXJncy5qb2luKCcgJykpO1xuICAgIH1cbiAgfVxuXG4gIC8vIEdlbmVyYXRvciBvZiBkZWZhdWx0IHByb21pc2VzIGZvciBzZW50IHBhY2tldHMuXG4gICNtYWtlUHJvbWlzZShpZCkge1xuICAgIGxldCBwcm9taXNlID0gbnVsbDtcbiAgICBpZiAoaWQpIHtcbiAgICAgIHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIC8vIFN0b3JlZCBjYWxsYmFja3Mgd2lsbCBiZSBjYWxsZWQgd2hlbiB0aGUgcmVzcG9uc2UgcGFja2V0IHdpdGggdGhpcyBJZCBhcnJpdmVzXG4gICAgICAgIHRoaXMuX3BlbmRpbmdQcm9taXNlc1tpZF0gPSB7XG4gICAgICAgICAgJ3Jlc29sdmUnOiByZXNvbHZlLFxuICAgICAgICAgICdyZWplY3QnOiByZWplY3QsXG4gICAgICAgICAgJ3RzJzogbmV3IERhdGUoKVxuICAgICAgICB9O1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBwcm9taXNlO1xuICB9O1xuXG4gIC8vIFJlc29sdmUgb3IgcmVqZWN0IGEgcGVuZGluZyBwcm9taXNlLlxuICAvLyBVbnJlc29sdmVkIHByb21pc2VzIGFyZSBzdG9yZWQgaW4gX3BlbmRpbmdQcm9taXNlcy5cbiAgI2V4ZWNQcm9taXNlKGlkLCBjb2RlLCBvbk9LLCBlcnJvclRleHQpIHtcbiAgICBjb25zdCBjYWxsYmFja3MgPSB0aGlzLl9wZW5kaW5nUHJvbWlzZXNbaWRdO1xuICAgIGlmIChjYWxsYmFja3MpIHtcbiAgICAgIGRlbGV0ZSB0aGlzLl9wZW5kaW5nUHJvbWlzZXNbaWRdO1xuICAgICAgaWYgKGNvZGUgPj0gMjAwICYmIGNvZGUgPCA0MDApIHtcbiAgICAgICAgaWYgKGNhbGxiYWNrcy5yZXNvbHZlKSB7XG4gICAgICAgICAgY2FsbGJhY2tzLnJlc29sdmUob25PSyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoY2FsbGJhY2tzLnJlamVjdCkge1xuICAgICAgICBjYWxsYmFja3MucmVqZWN0KG5ldyBFcnJvcihgJHtlcnJvclRleHR9ICgke2NvZGV9KWApKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBTZW5kIGEgcGFja2V0LiBJZiBwYWNrZXQgaWQgaXMgcHJvdmlkZWQgcmV0dXJuIGEgcHJvbWlzZS5cbiAgI3NlbmQocGt0LCBpZCkge1xuICAgIGxldCBwcm9taXNlO1xuICAgIGlmIChpZCkge1xuICAgICAgcHJvbWlzZSA9IHRoaXMuI21ha2VQcm9taXNlKGlkKTtcbiAgICB9XG4gICAgcGt0ID0gc2ltcGxpZnkocGt0KTtcbiAgICBsZXQgbXNnID0gSlNPTi5zdHJpbmdpZnkocGt0KTtcbiAgICB0aGlzLiNsb2dnZXIoXCJvdXQ6IFwiICsgKHRoaXMuX3RyaW1Mb25nU3RyaW5ncyA/IEpTT04uc3RyaW5naWZ5KHBrdCwganNvbkxvZ2dlckhlbHBlcikgOiBtc2cpKTtcbiAgICB0cnkge1xuICAgICAgdGhpcy5fY29ubmVjdGlvbi5zZW5kVGV4dChtc2cpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgLy8gSWYgc2VuZFRleHQgdGhyb3dzLCB3cmFwIHRoZSBlcnJvciBpbiBhIHByb21pc2Ugb3IgcmV0aHJvdy5cbiAgICAgIGlmIChpZCkge1xuICAgICAgICB0aGlzLiNleGVjUHJvbWlzZShpZCwgQ29ubmVjdGlvbi5ORVRXT1JLX0VSUk9SLCBudWxsLCBlcnIubWVzc2FnZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgLy8gVGhlIG1haW4gbWVzc2FnZSBkaXNwYXRjaGVyLlxuICAjZGlzcGF0Y2hNZXNzYWdlKGRhdGEpIHtcbiAgICAvLyBTa2lwIGVtcHR5IHJlc3BvbnNlLiBUaGlzIGhhcHBlbnMgd2hlbiBMUCB0aW1lcyBvdXQuXG4gICAgaWYgKCFkYXRhKVxuICAgICAgcmV0dXJuO1xuXG4gICAgdGhpcy5faW5QYWNrZXRDb3VudCsrO1xuXG4gICAgLy8gU2VuZCByYXcgbWVzc2FnZSB0byBsaXN0ZW5lclxuICAgIGlmICh0aGlzLm9uUmF3TWVzc2FnZSkge1xuICAgICAgdGhpcy5vblJhd01lc3NhZ2UoZGF0YSk7XG4gICAgfVxuXG4gICAgaWYgKGRhdGEgPT09ICcwJykge1xuICAgICAgLy8gU2VydmVyIHJlc3BvbnNlIHRvIGEgbmV0d29yayBwcm9iZS5cbiAgICAgIGlmICh0aGlzLm9uTmV0d29ya1Byb2JlKSB7XG4gICAgICAgIHRoaXMub25OZXR3b3JrUHJvYmUoKTtcbiAgICAgIH1cbiAgICAgIC8vIE5vIHByb2Nlc3NpbmcgaXMgbmVjZXNzYXJ5LlxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBwa3QgPSBKU09OLnBhcnNlKGRhdGEsIGpzb25QYXJzZUhlbHBlcik7XG4gICAgaWYgKCFwa3QpIHtcbiAgICAgIHRoaXMuI2xvZ2dlcihcImluOiBcIiArIGRhdGEpO1xuICAgICAgdGhpcy4jbG9nZ2VyKFwiRVJST1I6IGZhaWxlZCB0byBwYXJzZSBkYXRhXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLiNsb2dnZXIoXCJpbjogXCIgKyAodGhpcy5fdHJpbUxvbmdTdHJpbmdzID8gSlNPTi5zdHJpbmdpZnkocGt0LCBqc29uTG9nZ2VySGVscGVyKSA6IGRhdGEpKTtcblxuICAgICAgLy8gU2VuZCBjb21wbGV0ZSBwYWNrZXQgdG8gbGlzdGVuZXJcbiAgICAgIGlmICh0aGlzLm9uTWVzc2FnZSkge1xuICAgICAgICB0aGlzLm9uTWVzc2FnZShwa3QpO1xuICAgICAgfVxuXG4gICAgICBpZiAocGt0LmN0cmwpIHtcbiAgICAgICAgLy8gSGFuZGxpbmcge2N0cmx9IG1lc3NhZ2VcbiAgICAgICAgaWYgKHRoaXMub25DdHJsTWVzc2FnZSkge1xuICAgICAgICAgIHRoaXMub25DdHJsTWVzc2FnZShwa3QuY3RybCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZXNvbHZlIG9yIHJlamVjdCBhIHBlbmRpbmcgcHJvbWlzZSwgaWYgYW55XG4gICAgICAgIGlmIChwa3QuY3RybC5pZCkge1xuICAgICAgICAgIHRoaXMuI2V4ZWNQcm9taXNlKHBrdC5jdHJsLmlkLCBwa3QuY3RybC5jb2RlLCBwa3QuY3RybCwgcGt0LmN0cmwudGV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgaWYgKHBrdC5jdHJsLmNvZGUgPT0gMjA1ICYmIHBrdC5jdHJsLnRleHQgPT0gJ2V2aWN0ZWQnKSB7XG4gICAgICAgICAgICAvLyBVc2VyIGV2aWN0ZWQgZnJvbSB0b3BpYy5cbiAgICAgICAgICAgIGNvbnN0IHRvcGljID0gdGhpcy4jY2FjaGVHZXQoJ3RvcGljJywgcGt0LmN0cmwudG9waWMpO1xuICAgICAgICAgICAgaWYgKHRvcGljKSB7XG4gICAgICAgICAgICAgIHRvcGljLl9yZXNldFN1YigpO1xuICAgICAgICAgICAgICBpZiAocGt0LmN0cmwucGFyYW1zICYmIHBrdC5jdHJsLnBhcmFtcy51bnN1Yikge1xuICAgICAgICAgICAgICAgIHRvcGljLl9nb25lKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKHBrdC5jdHJsLmNvZGUgPCAzMDAgJiYgcGt0LmN0cmwucGFyYW1zKSB7XG4gICAgICAgICAgICBpZiAocGt0LmN0cmwucGFyYW1zLndoYXQgPT0gJ2RhdGEnKSB7XG4gICAgICAgICAgICAgIC8vIGNvZGU9MjA4LCBhbGwgbWVzc2FnZXMgcmVjZWl2ZWQ6IFwicGFyYW1zXCI6e1wiY291bnRcIjoxMSxcIndoYXRcIjpcImRhdGFcIn0sXG4gICAgICAgICAgICAgIGNvbnN0IHRvcGljID0gdGhpcy4jY2FjaGVHZXQoJ3RvcGljJywgcGt0LmN0cmwudG9waWMpO1xuICAgICAgICAgICAgICBpZiAodG9waWMpIHtcbiAgICAgICAgICAgICAgICB0b3BpYy5fYWxsTWVzc2FnZXNSZWNlaXZlZChwa3QuY3RybC5wYXJhbXMuY291bnQpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHBrdC5jdHJsLnBhcmFtcy53aGF0ID09ICdzdWInKSB7XG4gICAgICAgICAgICAgIC8vIGNvZGU9MjA0LCB0aGUgdG9waWMgaGFzIG5vIChyZWZyZXNoZWQpIHN1YnNjcmlwdGlvbnMuXG4gICAgICAgICAgICAgIGNvbnN0IHRvcGljID0gdGhpcy4jY2FjaGVHZXQoJ3RvcGljJywgcGt0LmN0cmwudG9waWMpO1xuICAgICAgICAgICAgICBpZiAodG9waWMpIHtcbiAgICAgICAgICAgICAgICAvLyBUcmlnZ2VyIHRvcGljLm9uU3Vic1VwZGF0ZWQuXG4gICAgICAgICAgICAgICAgdG9waWMuX3Byb2Nlc3NNZXRhU3ViKFtdKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSwgMCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBpZiAocGt0Lm1ldGEpIHtcbiAgICAgICAgICAgIC8vIEhhbmRsaW5nIGEge21ldGF9IG1lc3NhZ2UuXG4gICAgICAgICAgICAvLyBQcmVmZXJyZWQgQVBJOiBSb3V0ZSBtZXRhIHRvIHRvcGljLCBpZiBvbmUgaXMgcmVnaXN0ZXJlZFxuICAgICAgICAgICAgY29uc3QgdG9waWMgPSB0aGlzLiNjYWNoZUdldCgndG9waWMnLCBwa3QubWV0YS50b3BpYyk7XG4gICAgICAgICAgICBpZiAodG9waWMpIHtcbiAgICAgICAgICAgICAgdG9waWMuX3JvdXRlTWV0YShwa3QubWV0YSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChwa3QubWV0YS5pZCkge1xuICAgICAgICAgICAgICB0aGlzLiNleGVjUHJvbWlzZShwa3QubWV0YS5pZCwgMjAwLCBwa3QubWV0YSwgJ01FVEEnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gU2Vjb25kYXJ5IEFQSTogY2FsbGJhY2tcbiAgICAgICAgICAgIGlmICh0aGlzLm9uTWV0YU1lc3NhZ2UpIHtcbiAgICAgICAgICAgICAgdGhpcy5vbk1ldGFNZXNzYWdlKHBrdC5tZXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKHBrdC5kYXRhKSB7XG4gICAgICAgICAgICAvLyBIYW5kbGluZyB7ZGF0YX0gbWVzc2FnZVxuICAgICAgICAgICAgLy8gUHJlZmVycmVkIEFQSTogUm91dGUgZGF0YSB0byB0b3BpYywgaWYgb25lIGlzIHJlZ2lzdGVyZWRcbiAgICAgICAgICAgIGNvbnN0IHRvcGljID0gdGhpcy4jY2FjaGVHZXQoJ3RvcGljJywgcGt0LmRhdGEudG9waWMpO1xuICAgICAgICAgICAgaWYgKHRvcGljKSB7XG4gICAgICAgICAgICAgIHRvcGljLl9yb3V0ZURhdGEocGt0LmRhdGEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBTZWNvbmRhcnkgQVBJOiBDYWxsIGNhbGxiYWNrXG4gICAgICAgICAgICBpZiAodGhpcy5vbkRhdGFNZXNzYWdlKSB7XG4gICAgICAgICAgICAgIHRoaXMub25EYXRhTWVzc2FnZShwa3QuZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChwa3QucHJlcykge1xuICAgICAgICAgICAgLy8gSGFuZGxpbmcge3ByZXN9IG1lc3NhZ2VcbiAgICAgICAgICAgIC8vIFByZWZlcnJlZCBBUEk6IFJvdXRlIHByZXNlbmNlIHRvIHRvcGljLCBpZiBvbmUgaXMgcmVnaXN0ZXJlZFxuICAgICAgICAgICAgY29uc3QgdG9waWMgPSB0aGlzLiNjYWNoZUdldCgndG9waWMnLCBwa3QucHJlcy50b3BpYyk7XG4gICAgICAgICAgICBpZiAodG9waWMpIHtcbiAgICAgICAgICAgICAgdG9waWMuX3JvdXRlUHJlcyhwa3QucHJlcyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFNlY29uZGFyeSBBUEkgLSBjYWxsYmFja1xuICAgICAgICAgICAgaWYgKHRoaXMub25QcmVzTWVzc2FnZSkge1xuICAgICAgICAgICAgICB0aGlzLm9uUHJlc01lc3NhZ2UocGt0LnByZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAocGt0LmluZm8pIHtcbiAgICAgICAgICAgIC8vIHtpbmZvfSBtZXNzYWdlIC0gcmVhZC9yZWNlaXZlZCBub3RpZmljYXRpb25zIGFuZCBrZXkgcHJlc3Nlc1xuICAgICAgICAgICAgLy8gUHJlZmVycmVkIEFQSTogUm91dGUge2luZm99fSB0byB0b3BpYywgaWYgb25lIGlzIHJlZ2lzdGVyZWRcbiAgICAgICAgICAgIGNvbnN0IHRvcGljID0gdGhpcy4jY2FjaGVHZXQoJ3RvcGljJywgcGt0LmluZm8udG9waWMpO1xuICAgICAgICAgICAgaWYgKHRvcGljKSB7XG4gICAgICAgICAgICAgIHRvcGljLl9yb3V0ZUluZm8ocGt0LmluZm8pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBTZWNvbmRhcnkgQVBJIC0gY2FsbGJhY2tcbiAgICAgICAgICAgIGlmICh0aGlzLm9uSW5mb01lc3NhZ2UpIHtcbiAgICAgICAgICAgICAgdGhpcy5vbkluZm9NZXNzYWdlKHBrdC5pbmZvKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy4jbG9nZ2VyKFwiRVJST1I6IFVua25vd24gcGFja2V0IHJlY2VpdmVkLlwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIDApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIENvbm5lY3Rpb24gb3BlbiwgcmVhZHkgdG8gc3RhcnQgc2VuZGluZy5cbiAgI2Nvbm5lY3Rpb25PcGVuKCkge1xuICAgIGlmICghdGhpcy5fZXhwaXJlUHJvbWlzZXMpIHtcbiAgICAgIC8vIFJlamVjdCBwcm9taXNlcyB3aGljaCBoYXZlIG5vdCBiZWVuIHJlc29sdmVkIGZvciB0b28gbG9uZy5cbiAgICAgIHRoaXMuX2V4cGlyZVByb21pc2VzID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICBjb25zdCBlcnIgPSBuZXcgRXJyb3IoXCJUaW1lb3V0ICg1MDQpXCIpO1xuICAgICAgICBjb25zdCBleHBpcmVzID0gbmV3IERhdGUobmV3IERhdGUoKS5nZXRUaW1lKCkgLSBDb25zdC5FWFBJUkVfUFJPTUlTRVNfVElNRU9VVCk7XG4gICAgICAgIGZvciAobGV0IGlkIGluIHRoaXMuX3BlbmRpbmdQcm9taXNlcykge1xuICAgICAgICAgIGxldCBjYWxsYmFja3MgPSB0aGlzLl9wZW5kaW5nUHJvbWlzZXNbaWRdO1xuICAgICAgICAgIGlmIChjYWxsYmFja3MgJiYgY2FsbGJhY2tzLnRzIDwgZXhwaXJlcykge1xuICAgICAgICAgICAgdGhpcy4jbG9nZ2VyKFwiUHJvbWlzZSBleHBpcmVkXCIsIGlkKTtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9wZW5kaW5nUHJvbWlzZXNbaWRdO1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrcy5yZWplY3QpIHtcbiAgICAgICAgICAgICAgY2FsbGJhY2tzLnJlamVjdChlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwgQ29uc3QuRVhQSVJFX1BST01JU0VTX1BFUklPRCk7XG4gICAgfVxuICAgIHRoaXMuaGVsbG8oKTtcbiAgfVxuXG4gICNkaXNjb25uZWN0ZWQoZXJyLCBjb2RlKSB7XG4gICAgdGhpcy5faW5QYWNrZXRDb3VudCA9IDA7XG4gICAgdGhpcy5fc2VydmVySW5mbyA9IG51bGw7XG4gICAgdGhpcy5fYXV0aGVudGljYXRlZCA9IGZhbHNlO1xuXG4gICAgaWYgKHRoaXMuX2V4cGlyZVByb21pc2VzKSB7XG4gICAgICBjbGVhckludGVydmFsKHRoaXMuX2V4cGlyZVByb21pc2VzKTtcbiAgICAgIHRoaXMuX2V4cGlyZVByb21pc2VzID0gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBNYXJrIGFsbCB0b3BpY3MgYXMgdW5zdWJzY3JpYmVkXG4gICAgdGhpcy4jY2FjaGVNYXAoJ3RvcGljJywgKHRvcGljLCBrZXkpID0+IHtcbiAgICAgIHRvcGljLl9yZXNldFN1YigpO1xuICAgIH0pO1xuXG4gICAgLy8gUmVqZWN0IGFsbCBwZW5kaW5nIHByb21pc2VzXG4gICAgZm9yIChsZXQga2V5IGluIHRoaXMuX3BlbmRpbmdQcm9taXNlcykge1xuICAgICAgY29uc3QgY2FsbGJhY2tzID0gdGhpcy5fcGVuZGluZ1Byb21pc2VzW2tleV07XG4gICAgICBpZiAoY2FsbGJhY2tzICYmIGNhbGxiYWNrcy5yZWplY3QpIHtcbiAgICAgICAgY2FsbGJhY2tzLnJlamVjdChlcnIpO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLl9wZW5kaW5nUHJvbWlzZXMgPSB7fTtcblxuICAgIGlmICh0aGlzLm9uRGlzY29ubmVjdCkge1xuICAgICAgdGhpcy5vbkRpc2Nvbm5lY3QoZXJyKTtcbiAgICB9XG4gIH1cblxuICAvLyBHZXQgVXNlciBBZ2VudCBzdHJpbmdcbiAgI2dldFVzZXJBZ2VudCgpIHtcbiAgICByZXR1cm4gdGhpcy5fYXBwTmFtZSArICcgKCcgKyAodGhpcy5fYnJvd3NlciA/IHRoaXMuX2Jyb3dzZXIgKyAnOyAnIDogJycpICsgdGhpcy5faHdvcyArICcpOyAnICsgQ29uc3QuTElCUkFSWTtcbiAgfVxuXG4gIC8vIEdlbmVyYXRvciBvZiBwYWNrZXRzIHN0dWJzXG4gICNpbml0UGFja2V0KHR5cGUsIHRvcGljKSB7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICBjYXNlICdoaSc6XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgJ2hpJzoge1xuICAgICAgICAgICAgJ2lkJzogdGhpcy5nZXROZXh0VW5pcXVlSWQoKSxcbiAgICAgICAgICAgICd2ZXInOiBDb25zdC5WRVJTSU9OLFxuICAgICAgICAgICAgJ3VhJzogdGhpcy4jZ2V0VXNlckFnZW50KCksXG4gICAgICAgICAgICAnZGV2JzogdGhpcy5fZGV2aWNlVG9rZW4sXG4gICAgICAgICAgICAnbGFuZyc6IHRoaXMuX2h1bWFuTGFuZ3VhZ2UsXG4gICAgICAgICAgICAncGxhdGYnOiB0aGlzLl9wbGF0Zm9ybVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgY2FzZSAnYWNjJzpcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAnYWNjJzoge1xuICAgICAgICAgICAgJ2lkJzogdGhpcy5nZXROZXh0VW5pcXVlSWQoKSxcbiAgICAgICAgICAgICd1c2VyJzogbnVsbCxcbiAgICAgICAgICAgICdzY2hlbWUnOiBudWxsLFxuICAgICAgICAgICAgJ3NlY3JldCc6IG51bGwsXG4gICAgICAgICAgICAnbG9naW4nOiBmYWxzZSxcbiAgICAgICAgICAgICd0YWdzJzogbnVsbCxcbiAgICAgICAgICAgICdkZXNjJzoge30sXG4gICAgICAgICAgICAnY3JlZCc6IHt9XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICBjYXNlICdsb2dpbic6XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgJ2xvZ2luJzoge1xuICAgICAgICAgICAgJ2lkJzogdGhpcy5nZXROZXh0VW5pcXVlSWQoKSxcbiAgICAgICAgICAgICdzY2hlbWUnOiBudWxsLFxuICAgICAgICAgICAgJ3NlY3JldCc6IG51bGxcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgIGNhc2UgJ3N1Yic6XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgJ3N1Yic6IHtcbiAgICAgICAgICAgICdpZCc6IHRoaXMuZ2V0TmV4dFVuaXF1ZUlkKCksXG4gICAgICAgICAgICAndG9waWMnOiB0b3BpYyxcbiAgICAgICAgICAgICdzZXQnOiB7fSxcbiAgICAgICAgICAgICdnZXQnOiB7fVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgY2FzZSAnbGVhdmUnOlxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICdsZWF2ZSc6IHtcbiAgICAgICAgICAgICdpZCc6IHRoaXMuZ2V0TmV4dFVuaXF1ZUlkKCksXG4gICAgICAgICAgICAndG9waWMnOiB0b3BpYyxcbiAgICAgICAgICAgICd1bnN1Yic6IGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICBjYXNlICdwdWInOlxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICdwdWInOiB7XG4gICAgICAgICAgICAnaWQnOiB0aGlzLmdldE5leHRVbmlxdWVJZCgpLFxuICAgICAgICAgICAgJ3RvcGljJzogdG9waWMsXG4gICAgICAgICAgICAnbm9lY2hvJzogZmFsc2UsXG4gICAgICAgICAgICAnaGVhZCc6IG51bGwsXG4gICAgICAgICAgICAnY29udGVudCc6IHt9XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICBjYXNlICdnZXQnOlxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICdnZXQnOiB7XG4gICAgICAgICAgICAnaWQnOiB0aGlzLmdldE5leHRVbmlxdWVJZCgpLFxuICAgICAgICAgICAgJ3RvcGljJzogdG9waWMsXG4gICAgICAgICAgICAnd2hhdCc6IG51bGwsXG4gICAgICAgICAgICAnZGVzYyc6IHt9LFxuICAgICAgICAgICAgJ3N1Yic6IHt9LFxuICAgICAgICAgICAgJ2RhdGEnOiB7fVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgY2FzZSAnc2V0JzpcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAnc2V0Jzoge1xuICAgICAgICAgICAgJ2lkJzogdGhpcy5nZXROZXh0VW5pcXVlSWQoKSxcbiAgICAgICAgICAgICd0b3BpYyc6IHRvcGljLFxuICAgICAgICAgICAgJ2Rlc2MnOiB7fSxcbiAgICAgICAgICAgICdzdWInOiB7fSxcbiAgICAgICAgICAgICd0YWdzJzogW11cbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgIGNhc2UgJ2RlbCc6XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgJ2RlbCc6IHtcbiAgICAgICAgICAgICdpZCc6IHRoaXMuZ2V0TmV4dFVuaXF1ZUlkKCksXG4gICAgICAgICAgICAndG9waWMnOiB0b3BpYyxcbiAgICAgICAgICAgICd3aGF0JzogbnVsbCxcbiAgICAgICAgICAgICdkZWxzZXEnOiBudWxsLFxuICAgICAgICAgICAgJ3VzZXInOiBudWxsLFxuICAgICAgICAgICAgJ2hhcmQnOiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgY2FzZSAnbm90ZSc6XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgJ25vdGUnOiB7XG4gICAgICAgICAgICAvLyBubyBpZCBieSBkZXNpZ25cbiAgICAgICAgICAgICd0b3BpYyc6IHRvcGljLFxuICAgICAgICAgICAgJ3doYXQnOiBudWxsLFxuICAgICAgICAgICAgJ3NlcSc6IHVuZGVmaW5lZCAvLyB0aGUgc2VydmVyLXNpZGUgbWVzc2FnZSBpZCBha25vd2xlZGdlZCBhcyByZWNlaXZlZCBvciByZWFkXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gcGFja2V0IHR5cGUgcmVxdWVzdGVkOiAke3R5cGV9YCk7XG4gICAgfVxuICB9XG5cbiAgLy8gQ2FjaGUgbWFuYWdlbWVudFxuICAjY2FjaGVQdXQodHlwZSwgbmFtZSwgb2JqKSB7XG4gICAgdGhpcy5fY2FjaGVbdHlwZSArICc6JyArIG5hbWVdID0gb2JqO1xuICB9XG4gICNjYWNoZUdldCh0eXBlLCBuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NhY2hlW3R5cGUgKyAnOicgKyBuYW1lXTtcbiAgfVxuICAjY2FjaGVEZWwodHlwZSwgbmFtZSkge1xuICAgIGRlbGV0ZSB0aGlzLl9jYWNoZVt0eXBlICsgJzonICsgbmFtZV07XG4gIH1cblxuICAvLyBFbnVtZXJhdGUgYWxsIGl0ZW1zIGluIGNhY2hlLCBjYWxsIGZ1bmMgZm9yIGVhY2ggaXRlbS5cbiAgLy8gRW51bWVyYXRpb24gc3RvcHMgaWYgZnVuYyByZXR1cm5zIHRydWUuXG4gICNjYWNoZU1hcCh0eXBlLCBmdW5jLCBjb250ZXh0KSB7XG4gICAgY29uc3Qga2V5ID0gdHlwZSA/IHR5cGUgKyAnOicgOiB1bmRlZmluZWQ7XG4gICAgZm9yIChsZXQgaWR4IGluIHRoaXMuX2NhY2hlKSB7XG4gICAgICBpZiAoIWtleSB8fCBpZHguaW5kZXhPZihrZXkpID09IDApIHtcbiAgICAgICAgaWYgKGZ1bmMuY2FsbChjb250ZXh0LCB0aGlzLl9jYWNoZVtpZHhdLCBpZHgpKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBNYWtlIGxpbWl0ZWQgY2FjaGUgbWFuYWdlbWVudCBhdmFpbGFibGUgdG8gdG9waWMuXG4gIC8vIENhY2hpbmcgdXNlci5wdWJsaWMgb25seS4gRXZlcnl0aGluZyBlbHNlIGlzIHBlci10b3BpYy5cbiAgI2F0dGFjaENhY2hlVG9Ub3BpYyh0b3BpYykge1xuICAgIHRvcGljLl90aW5vZGUgPSB0aGlzO1xuXG4gICAgdG9waWMuX2NhY2hlR2V0VXNlciA9ICh1aWQpID0+IHtcbiAgICAgIGNvbnN0IHB1YiA9IHRoaXMuI2NhY2hlR2V0KCd1c2VyJywgdWlkKTtcbiAgICAgIGlmIChwdWIpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB1c2VyOiB1aWQsXG4gICAgICAgICAgcHVibGljOiBtZXJnZU9iaih7fSwgcHViKVxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9O1xuICAgIHRvcGljLl9jYWNoZVB1dFVzZXIgPSAodWlkLCB1c2VyKSA9PiB7XG4gICAgICB0aGlzLiNjYWNoZVB1dCgndXNlcicsIHVpZCwgbWVyZ2VPYmooe30sIHVzZXIucHVibGljKSk7XG4gICAgfTtcbiAgICB0b3BpYy5fY2FjaGVEZWxVc2VyID0gKHVpZCkgPT4ge1xuICAgICAgdGhpcy4jY2FjaGVEZWwoJ3VzZXInLCB1aWQpO1xuICAgIH07XG4gICAgdG9waWMuX2NhY2hlUHV0U2VsZiA9ICgpID0+IHtcbiAgICAgIHRoaXMuI2NhY2hlUHV0KCd0b3BpYycsIHRvcGljLm5hbWUsIHRvcGljKTtcbiAgICB9O1xuICAgIHRvcGljLl9jYWNoZURlbFNlbGYgPSAoKSA9PiB7XG4gICAgICB0aGlzLiNjYWNoZURlbCgndG9waWMnLCB0b3BpYy5uYW1lKTtcbiAgICB9O1xuICB9XG5cbiAgLy8gT24gc3VjY2Vzc2Z1bCBsb2dpbiBzYXZlIHNlcnZlci1wcm92aWRlZCBkYXRhLlxuICAjbG9naW5TdWNjZXNzZnVsKGN0cmwpIHtcbiAgICBpZiAoIWN0cmwucGFyYW1zIHx8ICFjdHJsLnBhcmFtcy51c2VyKSB7XG4gICAgICByZXR1cm4gY3RybDtcbiAgICB9XG4gICAgLy8gVGhpcyBpcyBhIHJlc3BvbnNlIHRvIGEgc3VjY2Vzc2Z1bCBsb2dpbixcbiAgICAvLyBleHRyYWN0IFVJRCBhbmQgc2VjdXJpdHkgdG9rZW4sIHNhdmUgaXQgaW4gVGlub2RlIG1vZHVsZVxuICAgIHRoaXMuX215VUlEID0gY3RybC5wYXJhbXMudXNlcjtcbiAgICB0aGlzLl9hdXRoZW50aWNhdGVkID0gKGN0cmwgJiYgY3RybC5jb2RlID49IDIwMCAmJiBjdHJsLmNvZGUgPCAzMDApO1xuICAgIGlmIChjdHJsLnBhcmFtcyAmJiBjdHJsLnBhcmFtcy50b2tlbiAmJiBjdHJsLnBhcmFtcy5leHBpcmVzKSB7XG4gICAgICB0aGlzLl9hdXRoVG9rZW4gPSB7XG4gICAgICAgIHRva2VuOiBjdHJsLnBhcmFtcy50b2tlbixcbiAgICAgICAgZXhwaXJlczogY3RybC5wYXJhbXMuZXhwaXJlc1xuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fYXV0aFRva2VuID0gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vbkxvZ2luKSB7XG4gICAgICB0aGlzLm9uTG9naW4oY3RybC5jb2RlLCBjdHJsLnRleHQpO1xuICAgIH1cblxuICAgIHJldHVybiBjdHJsO1xuICB9XG5cbiAgLy8gU3RhdGljIG1ldGhvZHMuXG4gIC8qKlxuICAgKiBIZWxwZXIgbWV0aG9kIHRvIHBhY2thZ2UgYWNjb3VudCBjcmVkZW50aWFsLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmcgfCBDcmVkZW50aWFsfSBtZXRoIC0gdmFsaWRhdGlvbiBtZXRob2Qgb3Igb2JqZWN0IHdpdGggdmFsaWRhdGlvbiBkYXRhLlxuICAgKiBAcGFyYW0ge3N0cmluZz19IHZhbCAtIHZhbGlkYXRpb24gdmFsdWUgKGUuZy4gZW1haWwgb3IgcGhvbmUgbnVtYmVyKS5cbiAgICogQHBhcmFtIHtPYmplY3Q9fSBwYXJhbXMgLSB2YWxpZGF0aW9uIHBhcmFtZXRlcnMuXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gcmVzcCAtIHZhbGlkYXRpb24gcmVzcG9uc2UuXG4gICAqXG4gICAqIEByZXR1cm5zIHtBcnJheS48Q3JlZGVudGlhbD59IGFycmF5IHdpdGggYSBzaW5nbGUgY3JlZGVudGlhbCBvciA8Y29kZT5udWxsPC9jb2RlPiBpZiBubyB2YWxpZCBjcmVkZW50aWFscyB3ZXJlIGdpdmVuLlxuICAgKi9cbiAgc3RhdGljIGNyZWRlbnRpYWwobWV0aCwgdmFsLCBwYXJhbXMsIHJlc3ApIHtcbiAgICBpZiAodHlwZW9mIG1ldGggPT0gJ29iamVjdCcpIHtcbiAgICAgICh7XG4gICAgICAgIHZhbCxcbiAgICAgICAgcGFyYW1zLFxuICAgICAgICByZXNwLFxuICAgICAgICBtZXRoXG4gICAgICB9ID0gbWV0aCk7XG4gICAgfVxuICAgIGlmIChtZXRoICYmICh2YWwgfHwgcmVzcCkpIHtcbiAgICAgIHJldHVybiBbe1xuICAgICAgICAnbWV0aCc6IG1ldGgsXG4gICAgICAgICd2YWwnOiB2YWwsXG4gICAgICAgICdyZXNwJzogcmVzcCxcbiAgICAgICAgJ3BhcmFtcyc6IHBhcmFtc1xuICAgICAgfV07XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIERldGVybWluZSB0b3BpYyB0eXBlIGZyb20gdG9waWMncyBuYW1lOiBncnAsIHAycCwgbWUsIGZuZCwgc3lzLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byB0ZXN0LlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBPbmUgb2YgPGNvZGU+XCJtZVwiPC9jb2RlPiwgPGNvZGU+XCJmbmRcIjwvY29kZT4sIDxjb2RlPlwic3lzXCI8L2NvZGU+LCA8Y29kZT5cImdycFwiPC9jb2RlPixcbiAgICogICAgPGNvZGU+XCJwMnBcIjwvY29kZT4gb3IgPGNvZGU+dW5kZWZpbmVkPC9jb2RlPi5cbiAgICovXG4gIHN0YXRpYyB0b3BpY1R5cGUobmFtZSkge1xuICAgIHJldHVybiBUb3BpYy50b3BpY1R5cGUobmFtZSk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgdGhlIGdpdmVuIHRvcGljIG5hbWUgaXMgYSBuYW1lIG9mIGEgJ21lJyB0b3BpYy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gdGVzdC5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIHRoZSBuYW1lIGlzIGEgbmFtZSBvZiBhICdtZScgdG9waWMsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBzdGF0aWMgaXNNZVRvcGljTmFtZShuYW1lKSB7XG4gICAgcmV0dXJuIFRvcGljLmlzTWVUb3BpY05hbWUobmFtZSk7XG4gIH1cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSBnaXZlbiB0b3BpYyBuYW1lIGlzIGEgbmFtZSBvZiBhIGdyb3VwIHRvcGljLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byB0ZXN0LlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgdGhlIG5hbWUgaXMgYSBuYW1lIG9mIGEgZ3JvdXAgdG9waWMsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBzdGF0aWMgaXNHcm91cFRvcGljTmFtZShuYW1lKSB7XG4gICAgcmV0dXJuIFRvcGljLmlzR3JvdXBUb3BpY05hbWUobmFtZSk7XG4gIH1cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSBnaXZlbiB0b3BpYyBuYW1lIGlzIGEgbmFtZSBvZiBhIHAycCB0b3BpYy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gdGVzdC5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIHRoZSBuYW1lIGlzIGEgbmFtZSBvZiBhIHAycCB0b3BpYywgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIHN0YXRpYyBpc1AyUFRvcGljTmFtZShuYW1lKSB7XG4gICAgcmV0dXJuIFRvcGljLmlzUDJQVG9waWNOYW1lKG5hbWUpO1xuICB9XG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgZ2l2ZW4gdG9waWMgbmFtZSBpcyBhIG5hbWUgb2YgYSBjb21tdW5pY2F0aW9uIHRvcGljLCBpLmUuIFAyUCBvciBncm91cC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gdGVzdC5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIHRoZSBuYW1lIGlzIGEgbmFtZSBvZiBhIHAycCBvciBncm91cCB0b3BpYywgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIHN0YXRpYyBpc0NvbW1Ub3BpY05hbWUobmFtZSkge1xuICAgIHJldHVybiBUb3BpYy5pc0NvbW1Ub3BpY05hbWUobmFtZSk7XG4gIH1cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSB0b3BpYyBuYW1lIGlzIGEgbmFtZSBvZiBhIG5ldyB0b3BpYy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gdG9waWMgbmFtZSB0byBjaGVjay5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIHRoZSBuYW1lIGlzIGEgbmFtZSBvZiBhIG5ldyB0b3BpYywgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIHN0YXRpYyBpc05ld0dyb3VwVG9waWNOYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gVG9waWMuaXNOZXdHcm91cFRvcGljTmFtZShuYW1lKTtcbiAgfVxuICAvKipcbiAgICogQ2hlY2sgaWYgdGhlIHRvcGljIG5hbWUgaXMgYSBuYW1lIG9mIGEgY2hhbm5lbC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gdG9waWMgbmFtZSB0byBjaGVjay5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIHRoZSBuYW1lIGlzIGEgbmFtZSBvZiBhIGNoYW5uZWwsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBzdGF0aWMgaXNDaGFubmVsVG9waWNOYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gVG9waWMuaXNDaGFubmVsVG9waWNOYW1lKG5hbWUpO1xuICB9XG4gIC8qKlxuICAgKiBSZXR1cm4gaW5mb3JtYXRpb24gYWJvdXQgdGhlIGN1cnJlbnQgdmVyc2lvbiBvZiB0aGlzIFRpbm9kZSBjbGllbnQgbGlicmFyeS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IHNlbWFudGljIHZlcnNpb24gb2YgdGhlIGxpYnJhcnksIGUuZy4gPGNvZGU+XCIwLjE1LjUtcmMxXCI8L2NvZGU+LlxuICAgKi9cbiAgc3RhdGljIGdldFZlcnNpb24oKSB7XG4gICAgcmV0dXJuIENvbnN0LlZFUlNJT047XG4gIH1cbiAgLyoqXG4gICAqIFRvIHVzZSBUaW5vZGUgaW4gYSBub24gYnJvd3NlciBjb250ZXh0LCBzdXBwbHkgV2ViU29ja2V0IGFuZCBYTUxIdHRwUmVxdWVzdCBwcm92aWRlcnMuXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAcGFyYW0gd3NQcm92aWRlciA8Y29kZT5XZWJTb2NrZXQ8L2NvZGU+IHByb3ZpZGVyLCBlLmcuIGZvciBub2RlSlMgLCA8Y29kZT5yZXF1aXJlKCd3cycpPC9jb2RlPi5cbiAgICogQHBhcmFtIHhoclByb3ZpZGVyIDxjb2RlPlhNTEh0dHBSZXF1ZXN0PC9jb2RlPiBwcm92aWRlciwgZS5nLiBmb3Igbm9kZSA8Y29kZT5yZXF1aXJlKCd4aHInKTwvY29kZT4uXG4gICAqL1xuICBzdGF0aWMgc2V0TmV0d29ya1Byb3ZpZGVycyh3c1Byb3ZpZGVyLCB4aHJQcm92aWRlcikge1xuICAgIFdlYlNvY2tldFByb3ZpZGVyID0gd3NQcm92aWRlcjtcbiAgICBYSFJQcm92aWRlciA9IHhoclByb3ZpZGVyO1xuXG4gICAgQ29ubmVjdGlvbi5zZXROZXR3b3JrUHJvdmlkZXJzKFdlYlNvY2tldFByb3ZpZGVyLCBYSFJQcm92aWRlcik7XG4gICAgTGFyZ2VGaWxlSGVscGVyLnNldE5ldHdvcmtQcm92aWRlcihYSFJQcm92aWRlcik7XG4gIH1cbiAgLyoqXG4gICAqIFRvIHVzZSBUaW5vZGUgaW4gYSBub24gYnJvd3NlciBjb250ZXh0LCBzdXBwbHkgPGNvZGU+aW5kZXhlZERCPC9jb2RlPiBwcm92aWRlci5cbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBwYXJhbSBpZGJQcm92aWRlciA8Y29kZT5pbmRleGVkREI8L2NvZGU+IHByb3ZpZGVyLCBlLmcuIGZvciBub2RlSlMgLCA8Y29kZT5yZXF1aXJlKCdmYWtlLWluZGV4ZWRkYicpPC9jb2RlPi5cbiAgICovXG4gIHN0YXRpYyBzZXREYXRhYmFzZVByb3ZpZGVyKGlkYlByb3ZpZGVyKSB7XG4gICAgSW5kZXhlZERCUHJvdmlkZXIgPSBpZGJQcm92aWRlcjtcblxuICAgIERCQ2FjaGUuc2V0RGF0YWJhc2VQcm92aWRlcihJbmRleGVkREJQcm92aWRlcik7XG4gIH1cbiAgLyoqXG4gICAqIFJldHVybiBpbmZvcm1hdGlvbiBhYm91dCB0aGUgY3VycmVudCBuYW1lIGFuZCB2ZXJzaW9uIG9mIHRoaXMgVGlub2RlIGxpYnJhcnkuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSB0aGUgbmFtZSBvZiB0aGUgbGlicmFyeSBhbmQgaXQncyB2ZXJzaW9uLlxuICAgKi9cbiAgc3RhdGljIGdldExpYnJhcnkoKSB7XG4gICAgcmV0dXJuIENvbnN0LkxJQlJBUlk7XG4gIH1cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSBnaXZlbiBzdHJpbmcgcmVwcmVzZW50cyA8Y29kZT5OVUxMPC9jb2RlPiB2YWx1ZSBhcyBkZWZpbmVkIGJ5IFRpbm9kZSAoPGNvZGU+J1xcdTI0MjEnPC9jb2RlPikuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyIC0gc3RyaW5nIHRvIGNoZWNrIGZvciA8Y29kZT5OVUxMPC9jb2RlPiB2YWx1ZS5cbiAgICpcbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIHN0cmluZyByZXByZXNlbnRzIDxjb2RlPk5VTEw8L2NvZGU+IHZhbHVlLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgc3RhdGljIGlzTnVsbFZhbHVlKHN0cikge1xuICAgIHJldHVybiBzdHIgPT09IENvbnN0LkRFTF9DSEFSO1xuICB9XG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgZ2l2ZW4gVVJMIHN0cmluZyBpcyBhIHJlbGF0aXZlIFVSTC5cbiAgICogQ2hlY2sgZm9yIGNhc2VzIGxpa2U6XG4gICAqICA8Y29kZT4naHR0cDovL2V4YW1wbGUuY29tJzwvY29kZT5cbiAgICogIDxjb2RlPicgaHR0cDovL2V4YW1wbGUuY29tJzwvY29kZT5cbiAgICogIDxjb2RlPicvL2V4YW1wbGUuY29tLyc8L2NvZGU+XG4gICAqICA8Y29kZT4naHR0cDpleGFtcGxlLmNvbSc8L2NvZGU+XG4gICAqICA8Y29kZT4naHR0cDovZXhhbXBsZS5jb20nPC9jb2RlPlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVybCAtIFVSTCBzdHJpbmcgdG8gY2hlY2suXG4gICAqXG4gICAqIEByZXR1cm5zIHtib29sZWFufSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0aGUgVVJMIGlzIHJlbGF0aXZlLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgc3RhdGljIGlzUmVsYXRpdmVVUkwodXJsKSB7XG4gICAgcmV0dXJuICEvXlxccyooW2Etel1bYS16MC05Ky4tXSo6fFxcL1xcLykvaW0udGVzdCh1cmwpO1xuICB9XG5cbiAgLy8gSW5zdGFuY2UgbWV0aG9kcy5cblxuICAvLyBHZW5lcmF0ZXMgdW5pcXVlIG1lc3NhZ2UgSURzXG4gIGdldE5leHRVbmlxdWVJZCgpIHtcbiAgICByZXR1cm4gKHRoaXMuX21lc3NhZ2VJZCAhPSAwKSA/ICcnICsgdGhpcy5fbWVzc2FnZUlkKysgOiB1bmRlZmluZWQ7XG4gIH07XG5cbiAgLyoqXG4gICAqIENvbm5lY3QgdG8gdGhlIHNlcnZlci5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGhvc3RfIC0gbmFtZSBvZiB0aGUgaG9zdCB0byBjb25uZWN0IHRvLlxuICAgKlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBQcm9taXNlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIGNvbm5lY3Rpb24gY2FsbCBjb21wbGV0ZXM6XG4gICAqICAgIDxjb2RlPnJlc29sdmUoKTwvY29kZT4gaXMgY2FsbGVkIHdpdGhvdXQgcGFyYW1ldGVycywgPGNvZGU+cmVqZWN0KCk8L2NvZGU+IHJlY2VpdmVzIHRoZVxuICAgKiAgICA8Y29kZT5FcnJvcjwvY29kZT4gYXMgYSBzaW5nbGUgcGFyYW1ldGVyLlxuICAgKi9cbiAgY29ubmVjdChob3N0Xykge1xuICAgIHJldHVybiB0aGlzLl9jb25uZWN0aW9uLmNvbm5lY3QoaG9zdF8pO1xuICB9XG5cbiAgLyoqXG4gICAqIEF0dGVtcHQgdG8gcmVjb25uZWN0IHRvIHRoZSBzZXJ2ZXIgaW1tZWRpYXRlbHkuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBmb3JjZSAtIHJlY29ubmVjdCBldmVuIGlmIHRoZXJlIGlzIGEgY29ubmVjdGlvbiBhbHJlYWR5LlxuICAgKi9cbiAgcmVjb25uZWN0KGZvcmNlKSB7XG4gICAgdGhpcy5fY29ubmVjdGlvbi5yZWNvbm5lY3QoZm9yY2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc2Nvbm5lY3QgZnJvbSB0aGUgc2VydmVyLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKi9cbiAgZGlzY29ubmVjdCgpIHtcbiAgICB0aGlzLl9jb25uZWN0aW9uLmRpc2Nvbm5lY3QoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbGVhciBwZXJzaXN0ZW50IGNhY2hlOiByZW1vdmUgSW5kZXhlZERCLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBQcm9taXNlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIG9wZXJhdGlvbiBpcyBjb21wbGV0ZWQuXG4gICAqL1xuICBjbGVhclN0b3JhZ2UoKSB7XG4gICAgaWYgKHRoaXMuX2RiLmlzUmVhZHkoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuX2RiLmRlbGV0ZURhdGFiYXNlKCk7XG4gICAgfVxuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIHBlcnNpc3RlbnQgY2FjaGU6IGNyZWF0ZSBJbmRleGVkREIgY2FjaGUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IFByb21pc2UgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgb3BlcmF0aW9uIGlzIGNvbXBsZXRlZC5cbiAgICovXG4gIGluaXRTdG9yYWdlKCkge1xuICAgIGlmICghdGhpcy5fZGIuaXNSZWFkeSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5fZGIuaW5pdERhdGFiYXNlKCk7XG4gICAgfVxuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kIGEgbmV0d29yayBwcm9iZSBtZXNzYWdlIHRvIG1ha2Ugc3VyZSB0aGUgY29ubmVjdGlvbiBpcyBhbGl2ZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICovXG4gIG5ldHdvcmtQcm9iZSgpIHtcbiAgICB0aGlzLl9jb25uZWN0aW9uLnByb2JlKCk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgZm9yIGxpdmUgY29ubmVjdGlvbiB0byBzZXJ2ZXIuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEByZXR1cm5zIHtib29sZWFufSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0aGVyZSBpcyBhIGxpdmUgY29ubmVjdGlvbiwgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIGlzQ29ubmVjdGVkKCkge1xuICAgIHJldHVybiB0aGlzLl9jb25uZWN0aW9uLmlzQ29ubmVjdGVkKCk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgY29ubmVjdGlvbiBpcyBhdXRoZW50aWNhdGVkIChsYXN0IGxvZ2luIHdhcyBzdWNjZXNzZnVsKS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIGF1dGhlbnRpY2F0ZWQsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBpc0F1dGhlbnRpY2F0ZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2F1dGhlbnRpY2F0ZWQ7XG4gIH1cblxuICAvKipcbiAgICogQWRkIEFQSSBrZXkgYW5kIGF1dGggdG9rZW4gdG8gdGhlIHJlbGF0aXZlIFVSTCBtYWtpbmcgaXQgdXNhYmxlIGZvciBnZXR0aW5nIGRhdGFcbiAgICogZnJvbSB0aGUgc2VydmVyIGluIGEgc2ltcGxlIDxjb2RlPkhUVFAgR0VUPC9jb2RlPiByZXF1ZXN0LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gVVJMIC0gVVJMIHRvIHdyYXAuXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IFVSTCB3aXRoIGFwcGVuZGVkIEFQSSBrZXkgYW5kIHRva2VuLCBpZiB2YWxpZCB0b2tlbiBpcyBwcmVzZW50LlxuICAgKi9cbiAgYXV0aG9yaXplVVJMKHVybCkge1xuICAgIGlmICh0eXBlb2YgdXJsICE9ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gdXJsO1xuICAgIH1cblxuICAgIGlmIChUaW5vZGUuaXNSZWxhdGl2ZVVSTCh1cmwpKSB7XG4gICAgICAvLyBGYWtlIGJhc2UgdG8gbWFrZSB0aGUgcmVsYXRpdmUgVVJMIHBhcnNlYWJsZS5cbiAgICAgIGNvbnN0IGJhc2UgPSAnc2NoZW1lOi8vaG9zdC8nO1xuICAgICAgY29uc3QgcGFyc2VkID0gbmV3IFVSTCh1cmwsIGJhc2UpO1xuICAgICAgaWYgKHRoaXMuX2FwaUtleSkge1xuICAgICAgICBwYXJzZWQuc2VhcmNoUGFyYW1zLmFwcGVuZCgnYXBpa2V5JywgdGhpcy5fYXBpS2V5KTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLl9hdXRoVG9rZW4gJiYgdGhpcy5fYXV0aFRva2VuLnRva2VuKSB7XG4gICAgICAgIHBhcnNlZC5zZWFyY2hQYXJhbXMuYXBwZW5kKCdhdXRoJywgJ3Rva2VuJyk7XG4gICAgICAgIHBhcnNlZC5zZWFyY2hQYXJhbXMuYXBwZW5kKCdzZWNyZXQnLCB0aGlzLl9hdXRoVG9rZW4udG9rZW4pO1xuICAgICAgfVxuICAgICAgLy8gQ29udmVydCBiYWNrIHRvIHN0cmluZyBhbmQgc3RyaXAgZmFrZSBiYXNlIFVSTCBleGNlcHQgZm9yIHRoZSByb290IHNsYXNoLlxuICAgICAgdXJsID0gcGFyc2VkLnRvU3RyaW5nKCkuc3Vic3RyaW5nKGJhc2UubGVuZ3RoIC0gMSk7XG4gICAgfVxuICAgIHJldHVybiB1cmw7XG4gIH1cblxuICAvKipcbiAgICogQHR5cGVkZWYgQWNjb3VudFBhcmFtc1xuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBwcm9wZXJ0eSB7VGlub2RlLkRlZkFjcz19IGRlZmFjcyAtIERlZmF1bHQgYWNjZXNzIHBhcmFtZXRlcnMgZm9yIHVzZXIncyA8Y29kZT5tZTwvY29kZT4gdG9waWMuXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0PX0gcHVibGljIC0gUHVibGljIGFwcGxpY2F0aW9uLWRlZmluZWQgZGF0YSBleHBvc2VkIG9uIDxjb2RlPm1lPC9jb2RlPiB0b3BpYy5cbiAgICogQHByb3BlcnR5IHtPYmplY3Q9fSBwcml2YXRlIC0gUHJpdmF0ZSBhcHBsaWNhdGlvbi1kZWZpbmVkIGRhdGEgYWNjZXNzaWJsZSBvbiA8Y29kZT5tZTwvY29kZT4gdG9waWMuXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0PX0gdHJ1c3RlZCAtIFRydXN0ZWQgdXNlciBkYXRhIHdoaWNoIGNhbiBiZSBzZXQgYnkgYSByb290IHVzZXIgb25seS5cbiAgICogQHByb3BlcnR5IHtBcnJheS48c3RyaW5nPn0gdGFncyAtIGFycmF5IG9mIHN0cmluZyB0YWdzIGZvciB1c2VyIGRpc2NvdmVyeS5cbiAgICogQHByb3BlcnR5IHtzdHJpbmc9fSB0b2tlbiAtIGF1dGhlbnRpY2F0aW9uIHRva2VuIHRvIHVzZS5cbiAgICogQHByb3BlcnR5IHtBcnJheS48c3RyaW5nPj19IGF0dGFjaG1lbnRzIC0gQXJyYXkgb2YgcmVmZXJlbmNlcyB0byBvdXQgb2YgYmFuZCBhdHRhY2htZW50cyB1c2VkIGluIGFjY291bnQgZGVzY3JpcHRpb24uXG4gICAqL1xuICAvKipcbiAgICogQHR5cGVkZWYgRGVmQWNzXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHByb3BlcnR5IHtzdHJpbmc9fSBhdXRoIC0gQWNjZXNzIG1vZGUgZm9yIDxjb2RlPm1lPC9jb2RlPiBmb3IgYXV0aGVudGljYXRlZCB1c2Vycy5cbiAgICogQHByb3BlcnR5IHtzdHJpbmc9fSBhbm9uIC0gQWNjZXNzIG1vZGUgZm9yIDxjb2RlPm1lPC9jb2RlPiBmb3IgYW5vbnltb3VzIHVzZXJzLlxuICAgKi9cblxuICAvKipcbiAgICogQ3JlYXRlIG9yIHVwZGF0ZSBhbiBhY2NvdW50LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdWlkIC0gVXNlciBpZCB0byB1cGRhdGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNjaGVtZSAtIEF1dGhlbnRpY2F0aW9uIHNjaGVtZTsgPGNvZGU+XCJiYXNpY1wiPC9jb2RlPiBhbmQgPGNvZGU+XCJhbm9ueW1vdXNcIjwvY29kZT4gYXJlIHRoZSBjdXJyZW50bHkgc3VwcG9ydGVkIHNjaGVtZXMuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzZWNyZXQgLSBBdXRoZW50aWNhdGlvbiBzZWNyZXQsIGFzc3VtZWQgdG8gYmUgYWxyZWFkeSBiYXNlNjQgZW5jb2RlZC5cbiAgICogQHBhcmFtIHtib29sZWFuPX0gbG9naW4gLSBVc2UgbmV3IGFjY291bnQgdG8gYXV0aGVudGljYXRlIGN1cnJlbnQgc2Vzc2lvblxuICAgKiBAcGFyYW0ge1Rpbm9kZS5BY2NvdW50UGFyYW1zPX0gcGFyYW1zIC0gVXNlciBkYXRhIHRvIHBhc3MgdG8gdGhlIHNlcnZlci5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHNlcnZlciByZXBseSBpcyByZWNlaXZlZC5cbiAgICovXG4gIGFjY291bnQodWlkLCBzY2hlbWUsIHNlY3JldCwgbG9naW4sIHBhcmFtcykge1xuICAgIGNvbnN0IHBrdCA9IHRoaXMuI2luaXRQYWNrZXQoJ2FjYycpO1xuICAgIHBrdC5hY2MudXNlciA9IHVpZDtcbiAgICBwa3QuYWNjLnNjaGVtZSA9IHNjaGVtZTtcbiAgICBwa3QuYWNjLnNlY3JldCA9IHNlY3JldDtcbiAgICAvLyBMb2cgaW4gdG8gdGhlIG5ldyBhY2NvdW50IHVzaW5nIHNlbGVjdGVkIHNjaGVtZVxuICAgIHBrdC5hY2MubG9naW4gPSBsb2dpbjtcblxuICAgIGlmIChwYXJhbXMpIHtcbiAgICAgIHBrdC5hY2MuZGVzYy5kZWZhY3MgPSBwYXJhbXMuZGVmYWNzO1xuICAgICAgcGt0LmFjYy5kZXNjLnB1YmxpYyA9IHBhcmFtcy5wdWJsaWM7XG4gICAgICBwa3QuYWNjLmRlc2MucHJpdmF0ZSA9IHBhcmFtcy5wcml2YXRlO1xuICAgICAgcGt0LmFjYy5kZXNjLnRydXN0ZWQgPSBwYXJhbXMudHJ1c3RlZDtcblxuICAgICAgcGt0LmFjYy50YWdzID0gcGFyYW1zLnRhZ3M7XG4gICAgICBwa3QuYWNjLmNyZWQgPSBwYXJhbXMuY3JlZDtcblxuICAgICAgcGt0LmFjYy50b2tlbiA9IHBhcmFtcy50b2tlbjtcblxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkocGFyYW1zLmF0dGFjaG1lbnRzKSAmJiBwYXJhbXMuYXR0YWNobWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgICBwa3QuZXh0cmEgPSB7XG4gICAgICAgICAgYXR0YWNobWVudHM6IHBhcmFtcy5hdHRhY2htZW50cy5maWx0ZXIocmVmID0+IFRpbm9kZS5pc1JlbGF0aXZlVVJMKHJlZikpXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuI3NlbmQocGt0LCBwa3QuYWNjLmlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBuZXcgdXNlci4gV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNhY2NvdW50fS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNjaGVtZSAtIEF1dGhlbnRpY2F0aW9uIHNjaGVtZTsgPGNvZGU+XCJiYXNpY1wiPC9jb2RlPiBpcyB0aGUgb25seSBjdXJyZW50bHkgc3VwcG9ydGVkIHNjaGVtZS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHNlY3JldCAtIEF1dGhlbnRpY2F0aW9uLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBsb2dpbiAtIFVzZSBuZXcgYWNjb3VudCB0byBhdXRoZW50aWNhdGUgY3VycmVudCBzZXNzaW9uXG4gICAqIEBwYXJhbSB7VGlub2RlLkFjY291bnRQYXJhbXM9fSBwYXJhbXMgLSBVc2VyIGRhdGEgdG8gcGFzcyB0byB0aGUgc2VydmVyLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gc2VydmVyIHJlcGx5IGlzIHJlY2VpdmVkLlxuICAgKi9cbiAgY3JlYXRlQWNjb3VudChzY2hlbWUsIHNlY3JldCwgbG9naW4sIHBhcmFtcykge1xuICAgIGxldCBwcm9taXNlID0gdGhpcy5hY2NvdW50KFVTRVJfTkVXLCBzY2hlbWUsIHNlY3JldCwgbG9naW4sIHBhcmFtcyk7XG4gICAgaWYgKGxvZ2luKSB7XG4gICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKChjdHJsKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLiNsb2dpblN1Y2Nlc3NmdWwoY3RybCk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIHVzZXIgd2l0aCA8Y29kZT4nYmFzaWMnPC9jb2RlPiBhdXRoZW50aWNhdGlvbiBzY2hlbWUgYW5kIGltbWVkaWF0ZWx5XG4gICAqIHVzZSBpdCBmb3IgYXV0aGVudGljYXRpb24uIFdyYXBwZXIgZm9yIHtAbGluayBUaW5vZGUjYWNjb3VudH0uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1c2VybmFtZSAtIExvZ2luIHRvIHVzZSBmb3IgdGhlIG5ldyBhY2NvdW50LlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGFzc3dvcmQgLSBVc2VyJ3MgcGFzc3dvcmQuXG4gICAqIEBwYXJhbSB7VGlub2RlLkFjY291bnRQYXJhbXM9fSBwYXJhbXMgLSBVc2VyIGRhdGEgdG8gcGFzcyB0byB0aGUgc2VydmVyLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gc2VydmVyIHJlcGx5IGlzIHJlY2VpdmVkLlxuICAgKi9cbiAgY3JlYXRlQWNjb3VudEJhc2ljKHVzZXJuYW1lLCBwYXNzd29yZCwgcGFyYW1zKSB7XG4gICAgLy8gTWFrZSBzdXJlIHdlIGFyZSBub3QgdXNpbmcgJ251bGwnIG9yICd1bmRlZmluZWQnO1xuICAgIHVzZXJuYW1lID0gdXNlcm5hbWUgfHwgJyc7XG4gICAgcGFzc3dvcmQgPSBwYXNzd29yZCB8fCAnJztcbiAgICByZXR1cm4gdGhpcy5jcmVhdGVBY2NvdW50KCdiYXNpYycsXG4gICAgICBiNjRFbmNvZGVVbmljb2RlKHVzZXJuYW1lICsgJzonICsgcGFzc3dvcmQpLCB0cnVlLCBwYXJhbXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSB1c2VyJ3MgY3JlZGVudGlhbHMgZm9yIDxjb2RlPidiYXNpYyc8L2NvZGU+IGF1dGhlbnRpY2F0aW9uIHNjaGVtZS4gV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNhY2NvdW50fS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVpZCAtIFVzZXIgSUQgdG8gdXBkYXRlLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdXNlcm5hbWUgLSBMb2dpbiB0byB1c2UgZm9yIHRoZSBuZXcgYWNjb3VudC5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhc3N3b3JkIC0gVXNlcidzIHBhc3N3b3JkLlxuICAgKiBAcGFyYW0ge1Rpbm9kZS5BY2NvdW50UGFyYW1zPX0gcGFyYW1zIC0gZGF0YSB0byBwYXNzIHRvIHRoZSBzZXJ2ZXIuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiBzZXJ2ZXIgcmVwbHkgaXMgcmVjZWl2ZWQuXG4gICAqL1xuICB1cGRhdGVBY2NvdW50QmFzaWModWlkLCB1c2VybmFtZSwgcGFzc3dvcmQsIHBhcmFtcykge1xuICAgIC8vIE1ha2Ugc3VyZSB3ZSBhcmUgbm90IHVzaW5nICdudWxsJyBvciAndW5kZWZpbmVkJztcbiAgICB1c2VybmFtZSA9IHVzZXJuYW1lIHx8ICcnO1xuICAgIHBhc3N3b3JkID0gcGFzc3dvcmQgfHwgJyc7XG4gICAgcmV0dXJuIHRoaXMuYWNjb3VudCh1aWQsICdiYXNpYycsXG4gICAgICBiNjRFbmNvZGVVbmljb2RlKHVzZXJuYW1lICsgJzonICsgcGFzc3dvcmQpLCBmYWxzZSwgcGFyYW1zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kIGhhbmRzaGFrZSB0byB0aGUgc2VydmVyLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gc2VydmVyIHJlcGx5IGlzIHJlY2VpdmVkLlxuICAgKi9cbiAgaGVsbG8oKSB7XG4gICAgY29uc3QgcGt0ID0gdGhpcy4jaW5pdFBhY2tldCgnaGknKTtcblxuICAgIHJldHVybiB0aGlzLiNzZW5kKHBrdCwgcGt0LmhpLmlkKVxuICAgICAgLnRoZW4oKGN0cmwpID0+IHtcbiAgICAgICAgLy8gUmVzZXQgYmFja29mZiBjb3VudGVyIG9uIHN1Y2Nlc3NmdWwgY29ubmVjdGlvbi5cbiAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5iYWNrb2ZmUmVzZXQoKTtcblxuICAgICAgICAvLyBTZXJ2ZXIgcmVzcG9uc2UgY29udGFpbnMgc2VydmVyIHByb3RvY29sIHZlcnNpb24sIGJ1aWxkLCBjb25zdHJhaW50cyxcbiAgICAgICAgLy8gc2Vzc2lvbiBJRCBmb3IgbG9uZyBwb2xsaW5nLiBTYXZlIHRoZW0uXG4gICAgICAgIGlmIChjdHJsLnBhcmFtcykge1xuICAgICAgICAgIHRoaXMuX3NlcnZlckluZm8gPSBjdHJsLnBhcmFtcztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm9uQ29ubmVjdCkge1xuICAgICAgICAgIHRoaXMub25Db25uZWN0KCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY3RybDtcbiAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5yZWNvbm5lY3QodHJ1ZSk7XG5cbiAgICAgICAgaWYgKHRoaXMub25EaXNjb25uZWN0KSB7XG4gICAgICAgICAgdGhpcy5vbkRpc2Nvbm5lY3QoZXJyKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogU2V0IG9yIHJlZnJlc2ggdGhlIHB1c2ggbm90aWZpY2F0aW9ucy9kZXZpY2UgdG9rZW4uIElmIHRoZSBjbGllbnQgaXMgY29ubmVjdGVkLFxuICAgKiB0aGUgZGV2aWNlVG9rZW4gY2FuIGJlIHNlbnQgdG8gdGhlIHNlcnZlci5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICogQHBhcmFtIHtzdHJpbmd9IGR0IC0gdG9rZW4gb2J0YWluZWQgZnJvbSB0aGUgcHJvdmlkZXIgb3IgPGNvZGU+ZmFsc2U8L2NvZGU+LFxuICAgKiAgICA8Y29kZT5udWxsPC9jb2RlPiBvciA8Y29kZT51bmRlZmluZWQ8L2NvZGU+IHRvIGNsZWFyIHRoZSB0b2tlbi5cbiAgICpcbiAgICogQHJldHVybnMgPGNvZGU+dHJ1ZTwvY29kZT4gaWYgYXR0ZW1wdCB3YXMgbWFkZSB0byBzZW5kIHRoZSB1cGRhdGUgdG8gdGhlIHNlcnZlci5cbiAgICovXG4gIHNldERldmljZVRva2VuKGR0KSB7XG4gICAgbGV0IHNlbnQgPSBmYWxzZTtcbiAgICAvLyBDb252ZXJ0IGFueSBmYWxzaXNoIHZhbHVlIHRvIG51bGwuXG4gICAgZHQgPSBkdCB8fCBudWxsO1xuICAgIGlmIChkdCAhPSB0aGlzLl9kZXZpY2VUb2tlbikge1xuICAgICAgdGhpcy5fZGV2aWNlVG9rZW4gPSBkdDtcbiAgICAgIGlmICh0aGlzLmlzQ29ubmVjdGVkKCkgJiYgdGhpcy5pc0F1dGhlbnRpY2F0ZWQoKSkge1xuICAgICAgICB0aGlzLiNzZW5kKHtcbiAgICAgICAgICAnaGknOiB7XG4gICAgICAgICAgICAnZGV2JzogZHQgfHwgVGlub2RlLkRFTF9DSEFSXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgc2VudCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzZW50O1xuICB9XG5cbiAgLyoqXG4gICAqIEB0eXBlZGVmIENyZWRlbnRpYWxcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHByb3BlcnR5IHtzdHJpbmd9IG1ldGggLSB2YWxpZGF0aW9uIG1ldGhvZC5cbiAgICogQHByb3BlcnR5IHtzdHJpbmd9IHZhbCAtIHZhbHVlIHRvIHZhbGlkYXRlIChlLmcuIGVtYWlsIG9yIHBob25lIG51bWJlcikuXG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSByZXNwIC0gdmFsaWRhdGlvbiByZXNwb25zZS5cbiAgICogQHByb3BlcnR5IHtPYmplY3R9IHBhcmFtcyAtIHZhbGlkYXRpb24gcGFyYW1ldGVycy5cbiAgICovXG4gIC8qKlxuICAgKiBBdXRoZW50aWNhdGUgY3VycmVudCBzZXNzaW9uLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2NoZW1lIC0gQXV0aGVudGljYXRpb24gc2NoZW1lOyA8Y29kZT5cImJhc2ljXCI8L2NvZGU+IGlzIHRoZSBvbmx5IGN1cnJlbnRseSBzdXBwb3J0ZWQgc2NoZW1lLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2VjcmV0IC0gQXV0aGVudGljYXRpb24gc2VjcmV0LCBhc3N1bWVkIHRvIGJlIGFscmVhZHkgYmFzZTY0IGVuY29kZWQuXG4gICAqIEBwYXJhbSB7Q3JlZGVudGlhbD19IGNyZWQgLSBjcmVkZW50aWFsIGNvbmZpcm1hdGlvbiwgaWYgcmVxdWlyZWQuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiBzZXJ2ZXIgcmVwbHkgaXMgcmVjZWl2ZWQuXG4gICAqL1xuICBsb2dpbihzY2hlbWUsIHNlY3JldCwgY3JlZCkge1xuICAgIGNvbnN0IHBrdCA9IHRoaXMuI2luaXRQYWNrZXQoJ2xvZ2luJyk7XG4gICAgcGt0LmxvZ2luLnNjaGVtZSA9IHNjaGVtZTtcbiAgICBwa3QubG9naW4uc2VjcmV0ID0gc2VjcmV0O1xuICAgIHBrdC5sb2dpbi5jcmVkID0gY3JlZDtcblxuICAgIHJldHVybiB0aGlzLiNzZW5kKHBrdCwgcGt0LmxvZ2luLmlkKVxuICAgICAgLnRoZW4oKGN0cmwpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI2xvZ2luU3VjY2Vzc2Z1bChjdHJsKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFdyYXBwZXIgZm9yIHtAbGluayBUaW5vZGUjbG9naW59IHdpdGggYmFzaWMgYXV0aGVudGljYXRpb25cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVuYW1lIC0gVXNlciBuYW1lLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGFzc3dvcmQgIC0gUGFzc3dvcmQuXG4gICAqIEBwYXJhbSB7Q3JlZGVudGlhbD19IGNyZWQgLSBjcmVkZW50aWFsIGNvbmZpcm1hdGlvbiwgaWYgcmVxdWlyZWQuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gcmVjZWl2aW5nIHNlcnZlciByZXBseS5cbiAgICovXG4gIGxvZ2luQmFzaWModW5hbWUsIHBhc3N3b3JkLCBjcmVkKSB7XG4gICAgcmV0dXJuIHRoaXMubG9naW4oJ2Jhc2ljJywgYjY0RW5jb2RlVW5pY29kZSh1bmFtZSArICc6JyArIHBhc3N3b3JkKSwgY3JlZClcbiAgICAgIC50aGVuKChjdHJsKSA9PiB7XG4gICAgICAgIHRoaXMuX2xvZ2luID0gdW5hbWU7XG4gICAgICAgIHJldHVybiBjdHJsO1xuICAgICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNsb2dpbn0gd2l0aCB0b2tlbiBhdXRoZW50aWNhdGlvblxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9rZW4gLSBUb2tlbiByZWNlaXZlZCBpbiByZXNwb25zZSB0byBlYXJsaWVyIGxvZ2luLlxuICAgKiBAcGFyYW0ge0NyZWRlbnRpYWw9fSBjcmVkIC0gY3JlZGVudGlhbCBjb25maXJtYXRpb24sIGlmIHJlcXVpcmVkLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIG9uIHJlY2VpdmluZyBzZXJ2ZXIgcmVwbHkuXG4gICAqL1xuICBsb2dpblRva2VuKHRva2VuLCBjcmVkKSB7XG4gICAgcmV0dXJuIHRoaXMubG9naW4oJ3Rva2VuJywgdG9rZW4sIGNyZWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgYSByZXF1ZXN0IGZvciByZXNldHRpbmcgYW4gYXV0aGVudGljYXRpb24gc2VjcmV0LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2NoZW1lIC0gYXV0aGVudGljYXRpb24gc2NoZW1lIHRvIHJlc2V0LlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWV0aG9kIC0gbWV0aG9kIHRvIHVzZSBmb3IgcmVzZXR0aW5nIHRoZSBzZWNyZXQsIHN1Y2ggYXMgXCJlbWFpbFwiIG9yIFwidGVsXCIuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSAtIHZhbHVlIG9mIHRoZSBjcmVkZW50aWFsIHRvIHVzZSwgYSBzcGVjaWZpYyBlbWFpbCBhZGRyZXNzIG9yIGEgcGhvbmUgbnVtYmVyLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIG9uIHJlY2VpdmluZyB0aGUgc2VydmVyIHJlcGx5LlxuICAgKi9cbiAgcmVxdWVzdFJlc2V0QXV0aFNlY3JldChzY2hlbWUsIG1ldGhvZCwgdmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5sb2dpbigncmVzZXQnLCBiNjRFbmNvZGVVbmljb2RlKHNjaGVtZSArICc6JyArIG1ldGhvZCArICc6JyArIHZhbHVlKSk7XG4gIH1cblxuICAvKipcbiAgICogQHR5cGVkZWYgQXV0aFRva2VuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHByb3BlcnR5IHtzdHJpbmd9IHRva2VuIC0gVG9rZW4gdmFsdWUuXG4gICAqIEBwcm9wZXJ0eSB7RGF0ZX0gZXhwaXJlcyAtIFRva2VuIGV4cGlyYXRpb24gdGltZS5cbiAgICovXG4gIC8qKlxuICAgKiBHZXQgc3RvcmVkIGF1dGhlbnRpY2F0aW9uIHRva2VuLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLkF1dGhUb2tlbn0gYXV0aGVudGljYXRpb24gdG9rZW4uXG4gICAqL1xuICBnZXRBdXRoVG9rZW4oKSB7XG4gICAgaWYgKHRoaXMuX2F1dGhUb2tlbiAmJiAodGhpcy5fYXV0aFRva2VuLmV4cGlyZXMuZ2V0VGltZSgpID4gRGF0ZS5ub3coKSkpIHtcbiAgICAgIHJldHVybiB0aGlzLl9hdXRoVG9rZW47XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2F1dGhUb2tlbiA9IG51bGw7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGxpY2F0aW9uIG1heSBwcm92aWRlIGEgc2F2ZWQgYXV0aGVudGljYXRpb24gdG9rZW4uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7VGlub2RlLkF1dGhUb2tlbn0gdG9rZW4gLSBhdXRoZW50aWNhdGlvbiB0b2tlbi5cbiAgICovXG4gIHNldEF1dGhUb2tlbih0b2tlbikge1xuICAgIHRoaXMuX2F1dGhUb2tlbiA9IHRva2VuO1xuICB9XG5cbiAgLyoqXG4gICAqIEB0eXBlZGVmIFNldFBhcmFtc1xuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBwcm9wZXJ0eSB7VGlub2RlLlNldERlc2M9fSBkZXNjIC0gVG9waWMgaW5pdGlhbGl6YXRpb24gcGFyYW1ldGVycyB3aGVuIGNyZWF0aW5nIGEgbmV3IHRvcGljIG9yIGEgbmV3IHN1YnNjcmlwdGlvbi5cbiAgICogQHByb3BlcnR5IHtUaW5vZGUuU2V0U3ViPX0gc3ViIC0gU3Vic2NyaXB0aW9uIGluaXRpYWxpemF0aW9uIHBhcmFtZXRlcnMuXG4gICAqIEBwcm9wZXJ0eSB7QXJyYXkuPHN0cmluZz49fSBhdHRhY2htZW50cyAtIFVSTHMgb2Ygb3V0IG9mIGJhbmQgYXR0YWNobWVudHMgdXNlZCBpbiBwYXJhbWV0ZXJzLlxuICAgKi9cbiAgLyoqXG4gICAqIEB0eXBlZGVmIFNldERlc2NcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAcHJvcGVydHkge1Rpbm9kZS5EZWZBY3M9fSBkZWZhY3MgLSBEZWZhdWx0IGFjY2VzcyBtb2RlLlxuICAgKiBAcHJvcGVydHkge09iamVjdD19IHB1YmxpYyAtIEZyZWUtZm9ybSB0b3BpYyBkZXNjcmlwdGlvbiwgcHVibGljYWxseSBhY2Nlc3NpYmxlLlxuICAgKiBAcHJvcGVydHkge09iamVjdD19IHByaXZhdGUgLSBGcmVlLWZvcm0gdG9waWMgZGVzY3JpcHRpb24gYWNjZXNzaWJsZSBvbmx5IHRvIHRoZSBvd25lci5cbiAgICogQHByb3BlcnR5IHtPYmplY3Q9fSB0cnVzdGVkIC0gVHJ1c3RlZCB1c2VyIGRhdGEgd2hpY2ggY2FuIGJlIHNldCBieSBhIHJvb3QgdXNlciBvbmx5LlxuICAgKi9cbiAgLyoqXG4gICAqIEB0eXBlZGVmIFNldFN1YlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nPX0gdXNlciAtIFVJRCBvZiB0aGUgdXNlciBhZmZlY3RlZCBieSB0aGUgcmVxdWVzdC4gRGVmYXVsdCAoZW1wdHkpIC0gY3VycmVudCB1c2VyLlxuICAgKiBAcHJvcGVydHkge3N0cmluZz19IG1vZGUgLSBVc2VyIGFjY2VzcyBtb2RlLCBlaXRoZXIgcmVxdWVzdGVkIG9yIGFzc2lnbmVkIGRlcGVuZGVudCBvbiBjb250ZXh0LlxuICAgKi9cbiAgLyoqXG4gICAqIFBhcmFtZXRlcnMgcGFzc2VkIHRvIHtAbGluayBUaW5vZGUjc3Vic2NyaWJlfS5cbiAgICpcbiAgICogQHR5cGVkZWYgU3Vic2NyaXB0aW9uUGFyYW1zXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQHByb3BlcnR5IHtUaW5vZGUuU2V0UGFyYW1zPX0gc2V0IC0gUGFyYW1ldGVycyB1c2VkIHRvIGluaXRpYWxpemUgdG9waWNcbiAgICogQHByb3BlcnR5IHtUaW5vZGUuR2V0UXVlcnk9fSBnZXQgLSBRdWVyeSBmb3IgZmV0Y2hpbmcgZGF0YSBmcm9tIHRvcGljLlxuICAgKi9cblxuICAvKipcbiAgICogU2VuZCBhIHRvcGljIHN1YnNjcmlwdGlvbiByZXF1ZXN0LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWMgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byBzdWJzY3JpYmUgdG8uXG4gICAqIEBwYXJhbSB7VGlub2RlLkdldFF1ZXJ5PX0gZ2V0UGFyYW1zIC0gT3B0aW9uYWwgc3Vic2NyaXB0aW9uIG1ldGFkYXRhIHF1ZXJ5XG4gICAqIEBwYXJhbSB7VGlub2RlLlNldFBhcmFtcz19IHNldFBhcmFtcyAtIE9wdGlvbmFsIGluaXRpYWxpemF0aW9uIHBhcmFtZXRlcnNcbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCBvbiByZWNlaXZpbmcgc2VydmVyIHJlcGx5LlxuICAgKi9cbiAgc3Vic2NyaWJlKHRvcGljTmFtZSwgZ2V0UGFyYW1zLCBzZXRQYXJhbXMpIHtcbiAgICBjb25zdCBwa3QgPSB0aGlzLiNpbml0UGFja2V0KCdzdWInLCB0b3BpY05hbWUpXG4gICAgaWYgKCF0b3BpY05hbWUpIHtcbiAgICAgIHRvcGljTmFtZSA9IENvbnN0LlRPUElDX05FVztcbiAgICB9XG5cbiAgICBwa3Quc3ViLmdldCA9IGdldFBhcmFtcztcblxuICAgIGlmIChzZXRQYXJhbXMpIHtcbiAgICAgIGlmIChzZXRQYXJhbXMuc3ViKSB7XG4gICAgICAgIHBrdC5zdWIuc2V0LnN1YiA9IHNldFBhcmFtcy5zdWI7XG4gICAgICB9XG5cbiAgICAgIGlmIChzZXRQYXJhbXMuZGVzYykge1xuICAgICAgICBjb25zdCBkZXNjID0gc2V0UGFyYW1zLmRlc2M7XG4gICAgICAgIGlmIChUaW5vZGUuaXNOZXdHcm91cFRvcGljTmFtZSh0b3BpY05hbWUpKSB7XG4gICAgICAgICAgLy8gRnVsbCBzZXQuZGVzYyBwYXJhbXMgYXJlIHVzZWQgZm9yIG5ldyB0b3BpY3Mgb25seVxuICAgICAgICAgIHBrdC5zdWIuc2V0LmRlc2MgPSBkZXNjO1xuICAgICAgICB9IGVsc2UgaWYgKFRpbm9kZS5pc1AyUFRvcGljTmFtZSh0b3BpY05hbWUpICYmIGRlc2MuZGVmYWNzKSB7XG4gICAgICAgICAgLy8gVXNlIG9wdGlvbmFsIGRlZmF1bHQgcGVybWlzc2lvbnMgb25seS5cbiAgICAgICAgICBwa3Quc3ViLnNldC5kZXNjID0ge1xuICAgICAgICAgICAgZGVmYWNzOiBkZXNjLmRlZmFjc1xuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gU2VlIGlmIGV4dGVybmFsIG9iamVjdHMgd2VyZSB1c2VkIGluIHRvcGljIGRlc2NyaXB0aW9uLlxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkoc2V0UGFyYW1zLmF0dGFjaG1lbnRzKSAmJiBzZXRQYXJhbXMuYXR0YWNobWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgICBwa3QuZXh0cmEgPSB7XG4gICAgICAgICAgYXR0YWNobWVudHM6IHNldFBhcmFtcy5hdHRhY2htZW50cy5maWx0ZXIocmVmID0+IFRpbm9kZS5pc1JlbGF0aXZlVVJMKHJlZikpXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIGlmIChzZXRQYXJhbXMudGFncykge1xuICAgICAgICBwa3Quc3ViLnNldC50YWdzID0gc2V0UGFyYW1zLnRhZ3M7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzLiNzZW5kKHBrdCwgcGt0LnN1Yi5pZCk7XG4gIH1cblxuICAvKipcbiAgICogRGV0YWNoIGFuZCBvcHRpb25hbGx5IHVuc3Vic2NyaWJlIGZyb20gdGhlIHRvcGljXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpYyAtIFRvcGljIHRvIGRldGFjaCBmcm9tLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHVuc3ViIC0gSWYgPGNvZGU+dHJ1ZTwvY29kZT4sIGRldGFjaCBhbmQgdW5zdWJzY3JpYmUsIG90aGVyd2lzZSBqdXN0IGRldGFjaC5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCBvbiByZWNlaXZpbmcgc2VydmVyIHJlcGx5LlxuICAgKi9cbiAgbGVhdmUodG9waWMsIHVuc3ViKSB7XG4gICAgY29uc3QgcGt0ID0gdGhpcy4jaW5pdFBhY2tldCgnbGVhdmUnLCB0b3BpYyk7XG4gICAgcGt0LmxlYXZlLnVuc3ViID0gdW5zdWI7XG5cbiAgICByZXR1cm4gdGhpcy4jc2VuZChwa3QsIHBrdC5sZWF2ZS5pZCk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIG1lc3NhZ2UgZHJhZnQgd2l0aG91dCBzZW5kaW5nIGl0IHRvIHRoZSBzZXJ2ZXIuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpYyAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIHB1Ymxpc2ggdG8uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZW50IC0gUGF5bG9hZCB0byBwdWJsaXNoLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBub0VjaG8gLSBJZiA8Y29kZT50cnVlPC9jb2RlPiwgdGVsbCB0aGUgc2VydmVyIG5vdCB0byBlY2hvIHRoZSBtZXNzYWdlIHRvIHRoZSBvcmlnaW5hbCBzZXNzaW9uLlxuICAgKlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSBuZXcgbWVzc2FnZSB3aGljaCBjYW4gYmUgc2VudCB0byB0aGUgc2VydmVyIG9yIG90aGVyd2lzZSB1c2VkLlxuICAgKi9cbiAgY3JlYXRlTWVzc2FnZSh0b3BpYywgY29udGVudCwgbm9FY2hvKSB7XG4gICAgY29uc3QgcGt0ID0gdGhpcy4jaW5pdFBhY2tldCgncHViJywgdG9waWMpO1xuXG4gICAgbGV0IGRmdCA9IHR5cGVvZiBjb250ZW50ID09ICdzdHJpbmcnID8gRHJhZnR5LnBhcnNlKGNvbnRlbnQpIDogY29udGVudDtcbiAgICBpZiAoZGZ0ICYmICFEcmFmdHkuaXNQbGFpblRleHQoZGZ0KSkge1xuICAgICAgcGt0LnB1Yi5oZWFkID0ge1xuICAgICAgICBtaW1lOiBEcmFmdHkuZ2V0Q29udGVudFR5cGUoKVxuICAgICAgfTtcbiAgICAgIGNvbnRlbnQgPSBkZnQ7XG4gICAgfVxuICAgIHBrdC5wdWIubm9lY2hvID0gbm9FY2hvO1xuICAgIHBrdC5wdWIuY29udGVudCA9IGNvbnRlbnQ7XG5cbiAgICByZXR1cm4gcGt0LnB1YjtcbiAgfVxuXG4gIC8qKlxuICAgKiBQdWJsaXNoIHtkYXRhfSBtZXNzYWdlIHRvIHRvcGljLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWMgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byBwdWJsaXNoIHRvLlxuICAgKiBAcGFyYW0ge09iamVjdH0gY29udGVudCAtIFBheWxvYWQgdG8gcHVibGlzaC5cbiAgICogQHBhcmFtIHtib29sZWFuPX0gbm9FY2hvIC0gSWYgPGNvZGU+dHJ1ZTwvY29kZT4sIHRlbGwgdGhlIHNlcnZlciBub3QgdG8gZWNobyB0aGUgbWVzc2FnZSB0byB0aGUgb3JpZ2luYWwgc2Vzc2lvbi5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCBvbiByZWNlaXZpbmcgc2VydmVyIHJlcGx5LlxuICAgKi9cbiAgcHVibGlzaCh0b3BpYywgY29udGVudCwgbm9FY2hvKSB7XG4gICAgcmV0dXJuIHRoaXMucHVibGlzaE1lc3NhZ2UoXG4gICAgICB0aGlzLmNyZWF0ZU1lc3NhZ2UodG9waWMsIGNvbnRlbnQsIG5vRWNobylcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIFB1Ymxpc2ggbWVzc2FnZSB0byB0b3BpYy4gVGhlIG1lc3NhZ2Ugc2hvdWxkIGJlIGNyZWF0ZWQgYnkge0BsaW5rIFRpbm9kZSNjcmVhdGVNZXNzYWdlfS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHB1YiAtIE1lc3NhZ2UgdG8gcHVibGlzaC5cbiAgICogQHBhcmFtIHtBcnJheS48c3RyaW5nPj19IGF0dGFjaG1lbnRzIC0gYXJyYXkgb2YgVVJMcyB3aXRoIGF0dGFjaG1lbnRzLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIG9uIHJlY2VpdmluZyBzZXJ2ZXIgcmVwbHkuXG4gICAqL1xuICBwdWJsaXNoTWVzc2FnZShwdWIsIGF0dGFjaG1lbnRzKSB7XG4gICAgLy8gTWFrZSBhIHNoYWxsb3cgY29weS4gTmVlZGVkIGluIG9yZGVyIHRvIGNsZWFyIGxvY2FsbHktYXNzaWduZWQgdGVtcCB2YWx1ZXM7XG4gICAgcHViID0gT2JqZWN0LmFzc2lnbih7fSwgcHViKTtcbiAgICBwdWIuc2VxID0gdW5kZWZpbmVkO1xuICAgIHB1Yi5mcm9tID0gdW5kZWZpbmVkO1xuICAgIHB1Yi50cyA9IHVuZGVmaW5lZDtcbiAgICBjb25zdCBtc2cgPSB7XG4gICAgICBwdWI6IHB1YixcbiAgICB9O1xuICAgIGlmIChhdHRhY2htZW50cykge1xuICAgICAgbXNnLmV4dHJhID0ge1xuICAgICAgICBhdHRhY2htZW50czogYXR0YWNobWVudHMuZmlsdGVyKHJlZiA9PiBUaW5vZGUuaXNSZWxhdGl2ZVVSTChyZWYpKVxuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuI3NlbmQobXNnLCBwdWIuaWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIE91dCBvZiBiYW5kIG5vdGlmaWNhdGlvbjogbm90aWZ5IHRvcGljIHRoYXQgYW4gZXh0ZXJuYWwgKHB1c2gpIG5vdGlmaWNhdGlvbiB3YXMgcmVjaXZlZCBieSB0aGUgY2xpZW50LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gd2hhdCAtIG5vdGlmaWNhdGlvbiB0eXBlLCAnbXNnJyBvciAncmVhZCcuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpY05hbWUgLSBuYW1lIG9mIHRoZSB1cGRhdGVkIHRvcGljLlxuICAgKiBAcGFyYW0ge251bWJlcn0gc2VxIC0gc2VxIElEIG9mIHRoZSBhZmZlY3RlZCBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge3N0cmluZz19IGFjdCAtIFVJRCBvZiB0aGUgc2VuZGVyOyBkZWZhdWx0IGlzIGN1cnJlbnQuXG4gICAqL1xuICBvb2JOb3RpZmljYXRpb24od2hhdCwgdG9waWNOYW1lLCBzZXEsIGFjdCkge1xuICAgIGNvbnN0IHRvcGljID0gdGhpcy4jY2FjaGVHZXQoJ3RvcGljJywgdG9waWNOYW1lKTtcbiAgICBpZiAodG9waWMpIHtcbiAgICAgIHRvcGljLl91cGRhdGVSZWNlaXZlZChzZXEsIGFjdCk7XG4gICAgICB0aGlzLmdldE1lVG9waWMoKS5fcmVmcmVzaENvbnRhY3QoJ21zZycsIHRvcGljKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHR5cGVkZWYgR2V0UXVlcnlcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAcHJvcGVydHkge1Rpbm9kZS5HZXRPcHRzVHlwZT19IGRlc2MgLSBJZiBwcm92aWRlZCAoZXZlbiBpZiBlbXB0eSksIGZldGNoIHRvcGljIGRlc2NyaXB0aW9uLlxuICAgKiBAcHJvcGVydHkge1Rpbm9kZS5HZXRPcHRzVHlwZT19IHN1YiAtIElmIHByb3ZpZGVkIChldmVuIGlmIGVtcHR5KSwgZmV0Y2ggdG9waWMgc3Vic2NyaXB0aW9ucy5cbiAgICogQHByb3BlcnR5IHtUaW5vZGUuR2V0RGF0YVR5cGU9fSBkYXRhIC0gSWYgcHJvdmlkZWQgKGV2ZW4gaWYgZW1wdHkpLCBnZXQgbWVzc2FnZXMuXG4gICAqL1xuXG4gIC8qKlxuICAgKiBAdHlwZWRlZiBHZXRPcHRzVHlwZVxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBwcm9wZXJ0eSB7RGF0ZT19IGltcyAtIFwiSWYgbW9kaWZpZWQgc2luY2VcIiwgZmV0Y2ggZGF0YSBvbmx5IGl0IHdhcyB3YXMgbW9kaWZpZWQgc2luY2Ugc3RhdGVkIGRhdGUuXG4gICAqIEBwcm9wZXJ0eSB7bnVtYmVyPX0gbGltaXQgLSBNYXhpbXVtIG51bWJlciBvZiByZXN1bHRzIHRvIHJldHVybi4gSWdub3JlZCB3aGVuIHF1ZXJ5aW5nIHRvcGljIGRlc2NyaXB0aW9uLlxuICAgKi9cblxuICAvKipcbiAgICogQHR5cGVkZWYgR2V0RGF0YVR5cGVcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAcHJvcGVydHkge251bWJlcj19IHNpbmNlIC0gTG9hZCBtZXNzYWdlcyB3aXRoIHNlcSBpZCBlcXVhbCBvciBncmVhdGVyIHRoYW4gdGhpcyB2YWx1ZS5cbiAgICogQHByb3BlcnR5IHtudW1iZXI9fSBiZWZvcmUgLSBMb2FkIG1lc3NhZ2VzIHdpdGggc2VxIGlkIGxvd2VyIHRoYW4gdGhpcyBudW1iZXIuXG4gICAqIEBwcm9wZXJ0eSB7bnVtYmVyPX0gbGltaXQgLSBNYXhpbXVtIG51bWJlciBvZiByZXN1bHRzIHRvIHJldHVybi5cbiAgICovXG5cbiAgLyoqXG4gICAqIFJlcXVlc3QgdG9waWMgbWV0YWRhdGFcbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gcXVlcnkuXG4gICAqIEBwYXJhbSB7VGlub2RlLkdldFF1ZXJ5fSBwYXJhbXMgLSBQYXJhbWV0ZXJzIG9mIHRoZSBxdWVyeS4gVXNlIHtAbGluayBUaW5vZGUuTWV0YUdldEJ1aWxkZXJ9IHRvIGdlbmVyYXRlLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIG9uIHJlY2VpdmluZyBzZXJ2ZXIgcmVwbHkuXG4gICAqL1xuICBnZXRNZXRhKHRvcGljLCBwYXJhbXMpIHtcbiAgICBjb25zdCBwa3QgPSB0aGlzLiNpbml0UGFja2V0KCdnZXQnLCB0b3BpYyk7XG5cbiAgICBwa3QuZ2V0ID0gbWVyZ2VPYmoocGt0LmdldCwgcGFyYW1zKTtcblxuICAgIHJldHVybiB0aGlzLiNzZW5kKHBrdCwgcGt0LmdldC5pZCk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlIHRvcGljJ3MgbWV0YWRhdGE6IGRlc2NyaXB0aW9uLCBzdWJzY3JpYnRpb25zLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWMgLSBUb3BpYyB0byB1cGRhdGUuXG4gICAqIEBwYXJhbSB7VGlub2RlLlNldFBhcmFtc30gcGFyYW1zIC0gdG9waWMgbWV0YWRhdGEgdG8gdXBkYXRlLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIG9uIHJlY2VpdmluZyBzZXJ2ZXIgcmVwbHkuXG4gICAqL1xuICBzZXRNZXRhKHRvcGljLCBwYXJhbXMpIHtcbiAgICBjb25zdCBwa3QgPSB0aGlzLiNpbml0UGFja2V0KCdzZXQnLCB0b3BpYyk7XG4gICAgY29uc3Qgd2hhdCA9IFtdO1xuXG4gICAgaWYgKHBhcmFtcykge1xuICAgICAgWydkZXNjJywgJ3N1YicsICd0YWdzJywgJ2NyZWQnXS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgICBpZiAocGFyYW1zLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICB3aGF0LnB1c2goa2V5KTtcbiAgICAgICAgICBwa3Quc2V0W2tleV0gPSBwYXJhbXNba2V5XTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHBhcmFtcy5hdHRhY2htZW50cykgJiYgcGFyYW1zLmF0dGFjaG1lbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcGt0LmV4dHJhID0ge1xuICAgICAgICAgIGF0dGFjaG1lbnRzOiBwYXJhbXMuYXR0YWNobWVudHMuZmlsdGVyKHJlZiA9PiBUaW5vZGUuaXNSZWxhdGl2ZVVSTChyZWYpKVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh3aGF0Lmxlbmd0aCA9PSAwKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiSW52YWxpZCB7c2V0fSBwYXJhbWV0ZXJzXCIpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy4jc2VuZChwa3QsIHBrdC5zZXQuaWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJhbmdlIG9mIG1lc3NhZ2UgSURzIHRvIGRlbGV0ZS5cbiAgICpcbiAgICogQHR5cGVkZWYgRGVsUmFuZ2VcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAcHJvcGVydHkge251bWJlcn0gbG93IC0gbG93IGVuZCBvZiB0aGUgcmFuZ2UsIGluY2x1c2l2ZSAoY2xvc2VkKS5cbiAgICogQHByb3BlcnR5IHtudW1iZXI9fSBoaSAtIGhpZ2ggZW5kIG9mIHRoZSByYW5nZSwgZXhjbHVzaXZlIChvcGVuKS5cbiAgICovXG4gIC8qKlxuICAgKiBEZWxldGUgc29tZSBvciBhbGwgbWVzc2FnZXMgaW4gYSB0b3BpYy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljIC0gVG9waWMgbmFtZSB0byBkZWxldGUgbWVzc2FnZXMgZnJvbS5cbiAgICogQHBhcmFtIHtUaW5vZGUuRGVsUmFuZ2VbXX0gbGlzdCAtIFJhbmdlcyBvZiBtZXNzYWdlIElEcyB0byBkZWxldGUuXG4gICAqIEBwYXJhbSB7Ym9vbGVhbj19IGhhcmQgLSBIYXJkIG9yIHNvZnQgZGVsZXRlXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gcmVjZWl2aW5nIHNlcnZlciByZXBseS5cbiAgICovXG4gIGRlbE1lc3NhZ2VzKHRvcGljLCByYW5nZXMsIGhhcmQpIHtcbiAgICBjb25zdCBwa3QgPSB0aGlzLiNpbml0UGFja2V0KCdkZWwnLCB0b3BpYyk7XG5cbiAgICBwa3QuZGVsLndoYXQgPSAnbXNnJztcbiAgICBwa3QuZGVsLmRlbHNlcSA9IHJhbmdlcztcbiAgICBwa3QuZGVsLmhhcmQgPSBoYXJkO1xuXG4gICAgcmV0dXJuIHRoaXMuI3NlbmQocGt0LCBwa3QuZGVsLmlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWxldGUgdGhlIHRvcGljIGFsbHRvZ2V0aGVyLiBSZXF1aXJlcyBPd25lciBwZXJtaXNzaW9uLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWNOYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gZGVsZXRlXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gaGFyZCAtIGhhcmQtZGVsZXRlIHRvcGljLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIG9uIHJlY2VpdmluZyBzZXJ2ZXIgcmVwbHkuXG4gICAqL1xuICBkZWxUb3BpYyh0b3BpY05hbWUsIGhhcmQpIHtcbiAgICBjb25zdCBwa3QgPSB0aGlzLiNpbml0UGFja2V0KCdkZWwnLCB0b3BpY05hbWUpO1xuICAgIHBrdC5kZWwud2hhdCA9ICd0b3BpYyc7XG4gICAgcGt0LmRlbC5oYXJkID0gaGFyZDtcblxuICAgIHJldHVybiB0aGlzLiNzZW5kKHBrdCwgcGt0LmRlbC5pZCk7XG4gIH1cblxuICAvKipcbiAgICogRGVsZXRlIHN1YnNjcmlwdGlvbi4gUmVxdWlyZXMgU2hhcmUgcGVybWlzc2lvbi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljTmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIGRlbGV0ZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdXNlciAtIFVzZXIgSUQgdG8gcmVtb3ZlLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIG9uIHJlY2VpdmluZyBzZXJ2ZXIgcmVwbHkuXG4gICAqL1xuICBkZWxTdWJzY3JpcHRpb24odG9waWNOYW1lLCB1c2VyKSB7XG4gICAgY29uc3QgcGt0ID0gdGhpcy4jaW5pdFBhY2tldCgnZGVsJywgdG9waWNOYW1lKTtcbiAgICBwa3QuZGVsLndoYXQgPSAnc3ViJztcbiAgICBwa3QuZGVsLnVzZXIgPSB1c2VyO1xuXG4gICAgcmV0dXJuIHRoaXMuI3NlbmQocGt0LCBwa3QuZGVsLmlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWxldGUgY3JlZGVudGlhbC4gQWx3YXlzIHNlbnQgb24gPGNvZGU+J21lJzwvY29kZT4gdG9waWMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtZXRob2QgLSB2YWxpZGF0aW9uIG1ldGhvZCBzdWNoIGFzIDxjb2RlPidlbWFpbCc8L2NvZGU+IG9yIDxjb2RlPid0ZWwnPC9jb2RlPi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIC0gdmFsaWRhdGlvbiB2YWx1ZSwgaS5lLiA8Y29kZT4nYWxpY2VAZXhhbXBsZS5jb20nPC9jb2RlPi5cbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCBvbiByZWNlaXZpbmcgc2VydmVyIHJlcGx5LlxuICAgKi9cbiAgZGVsQ3JlZGVudGlhbChtZXRob2QsIHZhbHVlKSB7XG4gICAgY29uc3QgcGt0ID0gdGhpcy4jaW5pdFBhY2tldCgnZGVsJywgQ29uc3QuVE9QSUNfTUUpO1xuICAgIHBrdC5kZWwud2hhdCA9ICdjcmVkJztcbiAgICBwa3QuZGVsLmNyZWQgPSB7XG4gICAgICBtZXRoOiBtZXRob2QsXG4gICAgICB2YWw6IHZhbHVlXG4gICAgfTtcblxuICAgIHJldHVybiB0aGlzLiNzZW5kKHBrdCwgcGt0LmRlbC5pZCk7XG4gIH1cblxuICAvKipcbiAgICogUmVxdWVzdCB0byBkZWxldGUgYWNjb3VudCBvZiB0aGUgY3VycmVudCB1c2VyLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGhhcmQgLSBoYXJkLWRlbGV0ZSB1c2VyLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIG9uIHJlY2VpdmluZyBzZXJ2ZXIgcmVwbHkuXG4gICAqL1xuICBkZWxDdXJyZW50VXNlcihoYXJkKSB7XG4gICAgY29uc3QgcGt0ID0gdGhpcy4jaW5pdFBhY2tldCgnZGVsJywgbnVsbCk7XG4gICAgcGt0LmRlbC53aGF0ID0gJ3VzZXInO1xuICAgIHBrdC5kZWwuaGFyZCA9IGhhcmQ7XG5cbiAgICByZXR1cm4gdGhpcy4jc2VuZChwa3QsIHBrdC5kZWwuaWQpLnRoZW4oKGN0cmwpID0+IHtcbiAgICAgIHRoaXMuX215VUlEID0gbnVsbDtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBOb3RpZnkgc2VydmVyIHRoYXQgYSBtZXNzYWdlIG9yIG1lc3NhZ2VzIHdlcmUgcmVhZCBvciByZWNlaXZlZC4gRG9lcyBOT1QgcmV0dXJuIHByb21pc2UuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpY05hbWUgLSBOYW1lIG9mIHRoZSB0b3BpYyB3aGVyZSB0aGUgbWVzYWdlIGlzIGJlaW5nIGFrbm93bGVkZ2VkLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gd2hhdCAtIEFjdGlvbiBiZWluZyBha25vd2xlZGdlZCwgZWl0aGVyIDxjb2RlPlwicmVhZFwiPC9jb2RlPiBvciA8Y29kZT5cInJlY3ZcIjwvY29kZT4uXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzZXEgLSBNYXhpbXVtIGlkIG9mIHRoZSBtZXNzYWdlIGJlaW5nIGFja25vd2xlZGdlZC5cbiAgICovXG4gIG5vdGUodG9waWNOYW1lLCB3aGF0LCBzZXEpIHtcbiAgICBpZiAoc2VxIDw9IDAgfHwgc2VxID49IENvbnN0LkxPQ0FMX1NFUUlEKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgbWVzc2FnZSBpZCAke3NlcX1gKTtcbiAgICB9XG5cbiAgICBjb25zdCBwa3QgPSB0aGlzLiNpbml0UGFja2V0KCdub3RlJywgdG9waWNOYW1lKTtcbiAgICBwa3Qubm90ZS53aGF0ID0gd2hhdDtcbiAgICBwa3Qubm90ZS5zZXEgPSBzZXE7XG4gICAgdGhpcy4jc2VuZChwa3QpO1xuICB9XG5cbiAgLyoqXG4gICAqIEJyb2FkY2FzdCBhIGtleS1wcmVzcyBub3RpZmljYXRpb24gdG8gdG9waWMgc3Vic2NyaWJlcnMuIFVzZWQgdG8gc2hvd1xuICAgKiB0eXBpbmcgbm90aWZpY2F0aW9ucyBcInVzZXIgWCBpcyB0eXBpbmcuLi5cIi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljTmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIGJyb2FkY2FzdCB0by5cbiAgICovXG4gIG5vdGVLZXlQcmVzcyh0b3BpY05hbWUpIHtcbiAgICBjb25zdCBwa3QgPSB0aGlzLiNpbml0UGFja2V0KCdub3RlJywgdG9waWNOYW1lKTtcbiAgICBwa3Qubm90ZS53aGF0ID0gJ2twJztcbiAgICB0aGlzLiNzZW5kKHBrdCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGEgbmFtZWQgdG9waWMsIGVpdGhlciBwdWxsIGl0IGZyb20gY2FjaGUgb3IgY3JlYXRlIGEgbmV3IGluc3RhbmNlLlxuICAgKiBUaGVyZSBpcyBhIHNpbmdsZSBpbnN0YW5jZSBvZiB0b3BpYyBmb3IgZWFjaCBuYW1lLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWNOYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gZ2V0LlxuICAgKiBAcmV0dXJucyB7VGlub2RlLlRvcGljfSBSZXF1ZXN0ZWQgb3IgbmV3bHkgY3JlYXRlZCB0b3BpYyBvciA8Y29kZT51bmRlZmluZWQ8L2NvZGU+IGlmIHRvcGljIG5hbWUgaXMgaW52YWxpZC5cbiAgICovXG4gIGdldFRvcGljKHRvcGljTmFtZSkge1xuICAgIGxldCB0b3BpYyA9IHRoaXMuI2NhY2hlR2V0KCd0b3BpYycsIHRvcGljTmFtZSk7XG4gICAgaWYgKCF0b3BpYyAmJiB0b3BpY05hbWUpIHtcbiAgICAgIGlmICh0b3BpY05hbWUgPT0gQ29uc3QuVE9QSUNfTUUpIHtcbiAgICAgICAgdG9waWMgPSBuZXcgVG9waWNNZSgpO1xuICAgICAgfSBlbHNlIGlmICh0b3BpY05hbWUgPT0gQ29uc3QuVE9QSUNfRk5EKSB7XG4gICAgICAgIHRvcGljID0gbmV3IFRvcGljRm5kKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0b3BpYyA9IG5ldyBUb3BpYyh0b3BpY05hbWUpO1xuICAgICAgfVxuICAgICAgLy8gQ2FjaGUgbWFuYWdlbWVudC5cbiAgICAgIHRoaXMuI2F0dGFjaENhY2hlVG9Ub3BpYyh0b3BpYyk7XG4gICAgICB0b3BpYy5fY2FjaGVQdXRTZWxmKCk7XG4gICAgICAvLyBEb24ndCBzYXZlIHRvIERCIGhlcmU6IGEgcmVjb3JkIHdpbGwgYmUgYWRkZWQgd2hlbiB0aGUgdG9waWMgaXMgc3Vic2NyaWJlZC5cbiAgICB9XG4gICAgcmV0dXJuIHRvcGljO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhIG5hbWVkIHRvcGljIGZyb20gY2FjaGUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpY05hbWUgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byBnZXQuXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuVG9waWN9IFJlcXVlc3RlZCB0b3BpYyBvciA8Y29kZT51bmRlZmluZWQ8L2NvZGU+IGlmIHRvcGljIGlzIG5vdCBmb3VuZCBpbiBjYWNoZS5cbiAgICovXG4gIGNhY2hlR2V0VG9waWModG9waWNOYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuI2NhY2hlR2V0KCd0b3BpYycsIHRvcGljTmFtZSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIG5hbWVkIHRvcGljIGZyb20gY2FjaGUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpY05hbWUgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byByZW1vdmUgZnJvbSBjYWNoZS5cbiAgICovXG4gIGNhY2hlUmVtVG9waWModG9waWNOYW1lKSB7XG4gICAgdGhpcy4jY2FjaGVEZWwoJ3RvcGljJywgdG9waWNOYW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJdGVyYXRlIG92ZXIgY2FjaGVkIHRvcGljcy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyAtIGNhbGxiYWNrIHRvIGNhbGwgZm9yIGVhY2ggdG9waWMuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZXh0IC0gJ3RoaXMnIGluc2lkZSB0aGUgJ2Z1bmMnLlxuICAgKi9cbiAgbWFwVG9waWNzKGZ1bmMsIGNvbnRleHQpIHtcbiAgICB0aGlzLiNjYWNoZU1hcCgndG9waWMnLCBmdW5jLCBjb250ZXh0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBuYW1lZCB0b3BpYyBpcyBhbHJlYWR5IHByZXNlbnQgaW4gY2FjaGUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpY05hbWUgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byBjaGVjay5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgdG9waWMgaXMgZm91bmQgaW4gY2FjaGUsIGZhbHNlIG90aGVyd2lzZS5cbiAgICovXG4gIGlzVG9waWNDYWNoZWQodG9waWNOYW1lKSB7XG4gICAgcmV0dXJuICEhdGhpcy4jY2FjaGVHZXQoJ3RvcGljJywgdG9waWNOYW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZSB1bmlxdWUgbmFtZSBsaWtlIDxjb2RlPiduZXcxMjM0NTYnPC9jb2RlPiBzdWl0YWJsZSBmb3IgY3JlYXRpbmcgYSBuZXcgZ3JvdXAgdG9waWMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNDaGFuIC0gaWYgdGhlIHRvcGljIGlzIGNoYW5uZWwtZW5hYmxlZC5cbiAgICogQHJldHVybnMge3N0cmluZ30gbmFtZSB3aGljaCBjYW4gYmUgdXNlZCBmb3IgY3JlYXRpbmcgYSBuZXcgZ3JvdXAgdG9waWMuXG4gICAqL1xuICBuZXdHcm91cFRvcGljTmFtZShpc0NoYW4pIHtcbiAgICByZXR1cm4gKGlzQ2hhbiA/IENvbnN0LlRPUElDX05FV19DSEFOIDogQ29uc3QuVE9QSUNfTkVXKSArIHRoaXMuZ2V0TmV4dFVuaXF1ZUlkKCk7XG4gIH1cblxuICAvKipcbiAgICogSW5zdGFudGlhdGUgPGNvZGU+J21lJzwvY29kZT4gdG9waWMgb3IgZ2V0IGl0IGZyb20gY2FjaGUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuVG9waWNNZX0gSW5zdGFuY2Ugb2YgPGNvZGU+J21lJzwvY29kZT4gdG9waWMuXG4gICAqL1xuICBnZXRNZVRvcGljKCkge1xuICAgIHJldHVybiB0aGlzLmdldFRvcGljKENvbnN0LlRPUElDX01FKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnN0YW50aWF0ZSA8Y29kZT4nZm5kJzwvY29kZT4gKGZpbmQpIHRvcGljIG9yIGdldCBpdCBmcm9tIGNhY2hlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLlRvcGljfSBJbnN0YW5jZSBvZiA8Y29kZT4nZm5kJzwvY29kZT4gdG9waWMuXG4gICAqL1xuICBnZXRGbmRUb3BpYygpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRUb3BpYyhDb25zdC5UT1BJQ19GTkQpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyB7QGxpbmsgTGFyZ2VGaWxlSGVscGVyfSBpbnN0YW5jZVxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLkxhcmdlRmlsZUhlbHBlcn0gaW5zdGFuY2Ugb2YgYSB7QGxpbmsgVGlub2RlLkxhcmdlRmlsZUhlbHBlcn0uXG4gICAqL1xuICBnZXRMYXJnZUZpbGVIZWxwZXIoKSB7XG4gICAgcmV0dXJuIG5ldyBMYXJnZUZpbGVIZWxwZXIodGhpcywgQ29uc3QuUFJPVE9DT0xfVkVSU0lPTik7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBVSUQgb2YgdGhlIHRoZSBjdXJyZW50IGF1dGhlbnRpY2F0ZWQgdXNlci5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICogQHJldHVybnMge3N0cmluZ30gVUlEIG9mIHRoZSBjdXJyZW50IHVzZXIgb3IgPGNvZGU+dW5kZWZpbmVkPC9jb2RlPiBpZiB0aGUgc2Vzc2lvbiBpcyBub3QgeWV0IGF1dGhlbnRpY2F0ZWQgb3IgaWYgdGhlcmUgaXMgbm8gc2Vzc2lvbi5cbiAgICovXG4gIGdldEN1cnJlbnRVc2VySUQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX215VUlEO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSBnaXZlbiB1c2VyIElEIGlzIGVxdWFsIHRvIHRoZSBjdXJyZW50IHVzZXIncyBVSUQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1aWQgLSBVSUQgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIHRoZSBnaXZlbiBVSUQgYmVsb25ncyB0byB0aGUgY3VycmVudCBsb2dnZWQgaW4gdXNlci5cbiAgICovXG4gIGlzTWUodWlkKSB7XG4gICAgcmV0dXJuIHRoaXMuX215VUlEID09PSB1aWQ7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGxvZ2luIHVzZWQgZm9yIGxhc3Qgc3VjY2Vzc2Z1bCBhdXRoZW50aWNhdGlvbi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICogQHJldHVybnMge3N0cmluZ30gbG9naW4gbGFzdCB1c2VkIHN1Y2Nlc3NmdWxseSBvciA8Y29kZT51bmRlZmluZWQ8L2NvZGU+LlxuICAgKi9cbiAgZ2V0Q3VycmVudExvZ2luKCkge1xuICAgIHJldHVybiB0aGlzLl9sb2dpbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gaW5mb3JtYXRpb24gYWJvdXQgdGhlIHNlcnZlcjogcHJvdG9jb2wgdmVyc2lvbiBhbmQgYnVpbGQgdGltZXN0YW1wLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKiBAcmV0dXJucyB7T2JqZWN0fSBidWlsZCBhbmQgdmVyc2lvbiBvZiB0aGUgc2VydmVyIG9yIDxjb2RlPm51bGw8L2NvZGU+IGlmIHRoZXJlIGlzIG5vIGNvbm5lY3Rpb24gb3IgaWYgdGhlIGZpcnN0IHNlcnZlciByZXNwb25zZSBoYXMgbm90IGJlZW4gcmVjZWl2ZWQgeWV0LlxuICAgKi9cbiAgZ2V0U2VydmVySW5mbygpIHtcbiAgICByZXR1cm4gdGhpcy5fc2VydmVySW5mbztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gc2VydmVyLXByb3ZpZGVkIGNvbmZpZ3VyYXRpb24gdmFsdWUgKGxvbmcgaW50ZWdlcikuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIG9mIHRoZSB2YWx1ZSB0byByZXR1cm5cbiAgICogQHBhcmFtIHtPYmplY3R9IGRlZmF1bHRWYWx1ZSB0byByZXR1cm4gaW4gY2FzZSBzZXJ2ZXIgbGltaXQgaXMgbm90IHNldCBvciBub3QgZm91bmQuXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IG5hbWVkIHZhbHVlLlxuICAgKi9cbiAgZ2V0U2VydmVyTGltaXQobmFtZSwgZGVmYXVsdFZhbHVlKSB7XG4gICAgcmV0dXJuICh0aGlzLl9zZXJ2ZXJJbmZvID8gdGhpcy5fc2VydmVySW5mb1tuYW1lXSA6IG51bGwpIHx8IGRlZmF1bHRWYWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUb2dnbGUgY29uc29sZSBsb2dnaW5nLiBMb2dnaW5nIGlzIG9mZiBieSBkZWZhdWx0LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGVuYWJsZWQgLSBTZXQgdG8gPGNvZGU+dHJ1ZTwvY29kZT4gdG8gZW5hYmxlIGxvZ2dpbmcgdG8gY29uc29sZS5cbiAgICogQHBhcmFtIHtib29sZWFufSB0cmltTG9uZ1N0cmluZ3MgLSBTZXQgdG8gPGNvZGU+dHJ1ZTwvY29kZT4gdG8gdHJpbSBsb25nIHN0cmluZ3MuXG4gICAqL1xuICBlbmFibGVMb2dnaW5nKGVuYWJsZWQsIHRyaW1Mb25nU3RyaW5ncykge1xuICAgIHRoaXMuX2xvZ2dpbmdFbmFibGVkID0gZW5hYmxlZDtcbiAgICB0aGlzLl90cmltTG9uZ1N0cmluZ3MgPSBlbmFibGVkICYmIHRyaW1Mb25nU3RyaW5ncztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgVUkgbGFuZ3VhZ2UgdG8gcmVwb3J0IHRvIHRoZSBzZXJ2ZXIuIE11c3QgYmUgY2FsbGVkIGJlZm9yZSA8Y29kZT4naGknPC9jb2RlPiBpcyBzZW50LCBvdGhlcndpc2UgaXQgd2lsbCBub3QgYmUgdXNlZC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGhsIC0gaHVtYW4gKFVJKSBsYW5ndWFnZSwgbGlrZSA8Y29kZT5cImVuX1VTXCI8L2NvZGU+IG9yIDxjb2RlPlwiemgtSGFuc1wiPC9jb2RlPi5cbiAgICovXG4gIHNldEh1bWFuTGFuZ3VhZ2UoaGwpIHtcbiAgICBpZiAoaGwpIHtcbiAgICAgIHRoaXMuX2h1bWFuTGFuZ3VhZ2UgPSBobDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgZ2l2ZW4gdG9waWMgaXMgb25saW5lLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBvZiB0aGUgdG9waWMgdG8gdGVzdC5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgdG9waWMgaXMgb25saW5lLCBmYWxzZSBvdGhlcndpc2UuXG4gICAqL1xuICBpc1RvcGljT25saW5lKG5hbWUpIHtcbiAgICBjb25zdCB0b3BpYyA9IHRoaXMuI2NhY2hlR2V0KCd0b3BpYycsIG5hbWUpO1xuICAgIHJldHVybiB0b3BpYyAmJiB0b3BpYy5vbmxpbmU7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGFjY2VzcyBtb2RlIGZvciB0aGUgZ2l2ZW4gY29udGFjdC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgb2YgdGhlIHRvcGljIHRvIHF1ZXJ5LlxuICAgKiBAcmV0dXJucyB7QWNjZXNzTW9kZX0gYWNjZXNzIG1vZGUgaWYgdG9waWMgaXMgZm91bmQsIG51bGwgb3RoZXJ3aXNlLlxuICAgKi9cbiAgZ2V0VG9waWNBY2Nlc3NNb2RlKG5hbWUpIHtcbiAgICBjb25zdCB0b3BpYyA9IHRoaXMuI2NhY2hlR2V0KCd0b3BpYycsIG5hbWUpO1xuICAgIHJldHVybiB0b3BpYyA/IHRvcGljLmFjcyA6IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogSW5jbHVkZSBtZXNzYWdlIElEIGludG8gYWxsIHN1YnNlcXVlc3QgbWVzc2FnZXMgdG8gc2VydmVyIGluc3RydWN0aW4gaXQgdG8gc2VuZCBha25vd2xlZGdlbWVucy5cbiAgICogUmVxdWlyZWQgZm9yIHByb21pc2VzIHRvIGZ1bmN0aW9uLiBEZWZhdWx0IGlzIDxjb2RlPlwib25cIjwvY29kZT4uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gc3RhdHVzIC0gVHVybiBha25vd2xlZGdlbWVucyBvbiBvciBvZmYuXG4gICAqIEBkZXByZWNhdGVkXG4gICAqL1xuICB3YW50QWtuKHN0YXR1cykge1xuICAgIGlmIChzdGF0dXMpIHtcbiAgICAgIHRoaXMuX21lc3NhZ2VJZCA9IE1hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkgKiAweEZGRkZGRikgKyAweEZGRkZGRik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX21lc3NhZ2VJZCA9IDA7XG4gICAgfVxuICB9XG5cbiAgLy8gQ2FsbGJhY2tzOlxuICAvKipcbiAgICogQ2FsbGJhY2sgdG8gcmVwb3J0IHdoZW4gdGhlIHdlYnNvY2tldCBpcyBvcGVuZWQuIFRoZSBjYWxsYmFjayBoYXMgbm8gcGFyYW1ldGVycy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICogQHR5cGUge1Rpbm9kZS5vbldlYnNvY2tldE9wZW59XG4gICAqL1xuICBvbldlYnNvY2tldE9wZW4gPSB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIEB0eXBlZGVmIFRpbm9kZS5TZXJ2ZXJQYXJhbXNcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAcHJvcGVydHkge3N0cmluZ30gdmVyIC0gU2VydmVyIHZlcnNpb25cbiAgICogQHByb3BlcnR5IHtzdHJpbmd9IGJ1aWxkIC0gU2VydmVyIGJ1aWxkXG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nPX0gc2lkIC0gU2Vzc2lvbiBJRCwgbG9uZyBwb2xsaW5nIGNvbm5lY3Rpb25zIG9ubHkuXG4gICAqL1xuXG4gIC8qKlxuICAgKiBAY2FsbGJhY2sgVGlub2RlLm9uQ29ubmVjdFxuICAgKiBAcGFyYW0ge251bWJlcn0gY29kZSAtIFJlc3VsdCBjb2RlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IC0gVGV4dCBlcHhwbGFpbmluZyB0aGUgY29tcGxldGlvbiwgaS5lIFwiT0tcIiBvciBhbiBlcnJvciBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge1Rpbm9kZS5TZXJ2ZXJQYXJhbXN9IHBhcmFtcyAtIFBhcmFtZXRlcnMgcmV0dXJuZWQgYnkgdGhlIHNlcnZlci5cbiAgICovXG4gIC8qKlxuICAgKiBDYWxsYmFjayB0byByZXBvcnQgd2hlbiBjb25uZWN0aW9uIHdpdGggVGlub2RlIHNlcnZlciBpcyBlc3RhYmxpc2hlZC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICogQHR5cGUge1Rpbm9kZS5vbkNvbm5lY3R9XG4gICAqL1xuICBvbkNvbm5lY3QgPSB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIHRvIHJlcG9ydCB3aGVuIGNvbm5lY3Rpb24gaXMgbG9zdC4gVGhlIGNhbGxiYWNrIGhhcyBubyBwYXJhbWV0ZXJzLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKiBAdHlwZSB7VGlub2RlLm9uRGlzY29ubmVjdH1cbiAgICovXG4gIG9uRGlzY29ubmVjdCA9IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQGNhbGxiYWNrIFRpbm9kZS5vbkxvZ2luXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBjb2RlIC0gTlVtZXJpYyBjb21wbGV0aW9uIGNvZGUsIHNhbWUgYXMgSFRUUCBzdGF0dXMgY29kZXMuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IC0gRXhwbGFuYXRpb24gb2YgdGhlIGNvbXBsZXRpb24gY29kZS5cbiAgICovXG4gIC8qKlxuICAgKiBDYWxsYmFjayB0byByZXBvcnQgbG9naW4gY29tcGxldGlvbi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICogQHR5cGUge1Rpbm9kZS5vbkxvZ2lufVxuICAgKi9cbiAgb25Mb2dpbiA9IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQ2FsbGJhY2sgdG8gcmVjZWl2ZSA8Y29kZT57Y3RybH08L2NvZGU+IChjb250cm9sKSBtZXNzYWdlcy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICogQHR5cGUge1Rpbm9kZS5vbkN0cmxNZXNzYWdlfVxuICAgKi9cbiAgb25DdHJsTWVzc2FnZSA9IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQ2FsbGJhY2sgdG8gcmVjaWV2ZSA8Y29kZT57ZGF0YX08L2NvZGU+IChjb250ZW50KSBtZXNzYWdlcy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICogQHR5cGUge1Rpbm9kZS5vbkRhdGFNZXNzYWdlfVxuICAgKi9cbiAgb25EYXRhTWVzc2FnZSA9IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQ2FsbGJhY2sgdG8gcmVjZWl2ZSA8Y29kZT57cHJlc308L2NvZGU+IChwcmVzZW5jZSkgbWVzc2FnZXMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqIEB0eXBlIHtUaW5vZGUub25QcmVzTWVzc2FnZX1cbiAgICovXG4gIG9uUHJlc01lc3NhZ2UgPSB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIHRvIHJlY2VpdmUgYWxsIG1lc3NhZ2VzIGFzIG9iamVjdHMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqIEB0eXBlIHtUaW5vZGUub25NZXNzYWdlfVxuICAgKi9cbiAgb25NZXNzYWdlID0gdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBDYWxsYmFjayB0byByZWNlaXZlIGFsbCBtZXNzYWdlcyBhcyB1bnBhcnNlZCB0ZXh0LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKiBAdHlwZSB7VGlub2RlLm9uUmF3TWVzc2FnZX1cbiAgICovXG4gIG9uUmF3TWVzc2FnZSA9IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQ2FsbGJhY2sgdG8gcmVjZWl2ZSBzZXJ2ZXIgcmVzcG9uc2VzIHRvIG5ldHdvcmsgcHJvYmVzLiBTZWUge0BsaW5rIFRpbm9kZSNuZXR3b3JrUHJvYmV9XG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqIEB0eXBlIHtUaW5vZGUub25OZXR3b3JrUHJvYmV9XG4gICAqL1xuICBvbk5ldHdvcmtQcm9iZSA9IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQ2FsbGJhY2sgdG8gYmUgbm90aWZpZWQgd2hlbiBleHBvbmVudGlhbCBiYWNrb2ZmIGlzIGl0ZXJhdGluZy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICogQHR5cGUge1Rpbm9kZS5vbkF1dG9yZWNvbm5lY3RJdGVyYXRpb259XG4gICAqL1xuICBvbkF1dG9yZWNvbm5lY3RJdGVyYXRpb24gPSB1bmRlZmluZWQ7XG59O1xuXG4vLyBFeHBvcnRlZCBjb25zdGFudHNcblRpbm9kZS5NRVNTQUdFX1NUQVRVU19OT05FID0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfTk9ORTtcblRpbm9kZS5NRVNTQUdFX1NUQVRVU19RVUVVRUQgPSBDb25zdC5NRVNTQUdFX1NUQVRVU19RVUVVRUQ7XG5UaW5vZGUuTUVTU0FHRV9TVEFUVVNfU0VORElORyA9IENvbnN0Lk1FU1NBR0VfU1RBVFVTX1NFTkRJTkc7XG5UaW5vZGUuTUVTU0FHRV9TVEFUVVNfRkFJTEVEID0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfRkFJTEVEO1xuVGlub2RlLk1FU1NBR0VfU1RBVFVTX1NFTlQgPSBDb25zdC5NRVNTQUdFX1NUQVRVU19TRU5UO1xuVGlub2RlLk1FU1NBR0VfU1RBVFVTX1JFQ0VJVkVEID0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfUkVDRUlWRUQ7XG5UaW5vZGUuTUVTU0FHRV9TVEFUVVNfUkVBRCA9IENvbnN0Lk1FU1NBR0VfU1RBVFVTX1JFQUQ7XG5UaW5vZGUuTUVTU0FHRV9TVEFUVVNfVE9fTUUgPSBDb25zdC5NRVNTQUdFX1NUQVRVU19UT19NRTtcblRpbm9kZS5NRVNTQUdFX1NUQVRVU19ERUxfUkFOR0UgPSBDb25zdC5NRVNTQUdFX1NUQVRVU19ERUxfUkFOR0U7XG5cbi8vIFVuaWNvZGUgW2RlbF0gc3ltYm9sLlxuVGlub2RlLkRFTF9DSEFSID0gQ29uc3QuREVMX0NIQVI7XG5cbi8vIE5hbWVzIG9mIGtleXMgdG8gc2VydmVyLXByb3ZpZGVkIGNvbmZpZ3VyYXRpb24gbGltaXRzLlxuVGlub2RlLk1BWF9NRVNTQUdFX1NJWkUgPSAnbWF4TWVzc2FnZVNpemUnO1xuVGlub2RlLk1BWF9TVUJTQ1JJQkVSX0NPVU5UID0gJ21heFN1YnNjcmliZXJDb3VudCc7XG5UaW5vZGUuTUFYX1RBR19DT1VOVCA9ICdtYXhUYWdDb3VudCc7XG5UaW5vZGUuTUFYX0ZJTEVfVVBMT0FEX1NJWkUgPSAnbWF4RmlsZVVwbG9hZFNpemUnO1xuIiwiLyoqXG4gKiBAZmlsZSBUb3BpYyBtYW5hZ2VtZW50LlxuICpcbiAqIEBjb3B5cmlnaHQgMjAxNS0yMDIyIFRpbm9kZSBMTEMuXG4gKi9cbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IEFjY2Vzc01vZGUgZnJvbSAnLi9hY2Nlc3MtbW9kZS5qcyc7XG5pbXBvcnQgQ0J1ZmZlciBmcm9tICcuL2NidWZmZXIuanMnO1xuaW1wb3J0ICogYXMgQ29uc3QgZnJvbSAnLi9jb25maWcuanMnO1xuaW1wb3J0IERyYWZ0eSBmcm9tICcuL2RyYWZ0eS5qcyc7XG5pbXBvcnQgTWV0YUdldEJ1aWxkZXIgZnJvbSAnLi9tZXRhLWJ1aWxkZXIuanMnO1xuaW1wb3J0IHtcbiAgbWVyZ2VPYmosXG4gIG1lcmdlVG9DYWNoZSxcbiAgbm9ybWFsaXplQXJyYXlcbn0gZnJvbSAnLi91dGlscy5qcyc7XG5cbmV4cG9ydCBjbGFzcyBUb3BpYyB7XG4gIC8qKlxuICAgKiBAY2FsbGJhY2sgVGlub2RlLlRvcGljLm9uRGF0YVxuICAgKiBAcGFyYW0ge0RhdGF9IGRhdGEgLSBEYXRhIHBhY2tldFxuICAgKi9cbiAgLyoqXG4gICAqIFRvcGljIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIGEgbG9naWNhbCBjb21tdW5pY2F0aW9uIGNoYW5uZWwuXG4gICAqIEBjbGFzcyBUb3BpY1xuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gY3JlYXRlLlxuICAgKiBAcGFyYW0ge09iamVjdD19IGNhbGxiYWNrcyAtIE9iamVjdCB3aXRoIHZhcmlvdXMgZXZlbnQgY2FsbGJhY2tzLlxuICAgKiBAcGFyYW0ge1Rpbm9kZS5Ub3BpYy5vbkRhdGF9IGNhbGxiYWNrcy5vbkRhdGEgLSBDYWxsYmFjayB3aGljaCByZWNlaXZlcyBhIDxjb2RlPntkYXRhfTwvY29kZT4gbWVzc2FnZS5cbiAgICogQHBhcmFtIHtjYWxsYmFja30gY2FsbGJhY2tzLm9uTWV0YSAtIENhbGxiYWNrIHdoaWNoIHJlY2VpdmVzIGEgPGNvZGU+e21ldGF9PC9jb2RlPiBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge2NhbGxiYWNrfSBjYWxsYmFja3Mub25QcmVzIC0gQ2FsbGJhY2sgd2hpY2ggcmVjZWl2ZXMgYSA8Y29kZT57cHJlc308L2NvZGU+IG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7Y2FsbGJhY2t9IGNhbGxiYWNrcy5vbkluZm8gLSBDYWxsYmFjayB3aGljaCByZWNlaXZlcyBhbiA8Y29kZT57aW5mb308L2NvZGU+IG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7Y2FsbGJhY2t9IGNhbGxiYWNrcy5vbk1ldGFEZXNjIC0gQ2FsbGJhY2sgd2hpY2ggcmVjZWl2ZXMgY2hhbmdlcyB0byB0b3BpYyBkZXNjdGlvcHRpb24ge0BsaW5rIGRlc2N9LlxuICAgKiBAcGFyYW0ge2NhbGxiYWNrfSBjYWxsYmFja3Mub25NZXRhU3ViIC0gQ2FsbGVkIGZvciBhIHNpbmdsZSBzdWJzY3JpcHRpb24gcmVjb3JkIGNoYW5nZS5cbiAgICogQHBhcmFtIHtjYWxsYmFja30gY2FsbGJhY2tzLm9uU3Vic1VwZGF0ZWQgLSBDYWxsZWQgYWZ0ZXIgYSBiYXRjaCBvZiBzdWJzY3JpcHRpb24gY2hhbmdlcyBoYXZlIGJlZW4gcmVjaWV2ZWQgYW5kIGNhY2hlZC5cbiAgICogQHBhcmFtIHtjYWxsYmFja30gY2FsbGJhY2tzLm9uRGVsZXRlVG9waWMgLSBDYWxsZWQgYWZ0ZXIgdGhlIHRvcGljIGlzIGRlbGV0ZWQuXG4gICAqIEBwYXJhbSB7Y2FsbGJhY2t9IGNhbGxiYWNscy5vbkFsbE1lc3NhZ2VzUmVjZWl2ZWQgLSBDYWxsZWQgd2hlbiBhbGwgcmVxdWVzdGVkIDxjb2RlPntkYXRhfTwvY29kZT4gbWVzc2FnZXMgaGF2ZSBiZWVuIHJlY2l2ZWQuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihuYW1lLCBjYWxsYmFja3MpIHtcbiAgICAvLyBQYXJlbnQgVGlub2RlIG9iamVjdC5cbiAgICB0aGlzLl90aW5vZGUgPSBudWxsO1xuXG4gICAgLy8gU2VydmVyLXByb3ZpZGVkIGRhdGEsIGxvY2FsbHkgaW1tdXRhYmxlLlxuICAgIC8vIHRvcGljIG5hbWVcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIC8vIFRpbWVzdGFtcCB3aGVuIHRoZSB0b3BpYyB3YXMgY3JlYXRlZC5cbiAgICB0aGlzLmNyZWF0ZWQgPSBudWxsO1xuICAgIC8vIFRpbWVzdGFtcCB3aGVuIHRoZSB0b3BpYyB3YXMgbGFzdCB1cGRhdGVkLlxuICAgIHRoaXMudXBkYXRlZCA9IG51bGw7XG4gICAgLy8gVGltZXN0YW1wIG9mIHRoZSBsYXN0IG1lc3NhZ2VzXG4gICAgdGhpcy50b3VjaGVkID0gbmV3IERhdGUoMCk7XG4gICAgLy8gQWNjZXNzIG1vZGUsIHNlZSBBY2Nlc3NNb2RlXG4gICAgdGhpcy5hY3MgPSBuZXcgQWNjZXNzTW9kZShudWxsKTtcbiAgICAvLyBQZXItdG9waWMgcHJpdmF0ZSBkYXRhIChhY2Nlc3NpYmxlIGJ5IGN1cnJlbnQgdXNlciBvbmx5KS5cbiAgICB0aGlzLnByaXZhdGUgPSBudWxsO1xuICAgIC8vIFBlci10b3BpYyBwdWJsaWMgZGF0YSAoYWNjZXNzaWJsZSBieSBhbGwgdXNlcnMpLlxuICAgIHRoaXMucHVibGljID0gbnVsbDtcbiAgICAvLyBQZXItdG9waWMgc3lzdGVtLXByb3ZpZGVkIGRhdGEgKGFjY2Vzc2libGUgYnkgYWxsIHVzZXJzKS5cbiAgICB0aGlzLnRydXN0ZWQgPSBudWxsO1xuXG4gICAgLy8gTG9jYWxseSBjYWNoZWQgZGF0YVxuICAgIC8vIFN1YnNjcmliZWQgdXNlcnMsIGZvciB0cmFja2luZyByZWFkL3JlY3YvbXNnIG5vdGlmaWNhdGlvbnMuXG4gICAgdGhpcy5fdXNlcnMgPSB7fTtcblxuICAgIC8vIEN1cnJlbnQgdmFsdWUgb2YgbG9jYWxseSBpc3N1ZWQgc2VxSWQsIHVzZWQgZm9yIHBlbmRpbmcgbWVzc2FnZXMuXG4gICAgdGhpcy5fcXVldWVkU2VxSWQgPSBDb25zdC5MT0NBTF9TRVFJRDtcblxuICAgIC8vIFRoZSBtYXhpbXVtIGtub3duIHtkYXRhLnNlcX0gdmFsdWUuXG4gICAgdGhpcy5fbWF4U2VxID0gMDtcbiAgICAvLyBUaGUgbWluaW11bSBrbm93biB7ZGF0YS5zZXF9IHZhbHVlLlxuICAgIHRoaXMuX21pblNlcSA9IDA7XG4gICAgLy8gSW5kaWNhdG9yIHRoYXQgdGhlIGxhc3QgcmVxdWVzdCBmb3IgZWFybGllciBtZXNzYWdlcyByZXR1cm5lZCAwLlxuICAgIHRoaXMuX25vRWFybGllck1zZ3MgPSBmYWxzZTtcbiAgICAvLyBUaGUgbWF4aW11bSBrbm93biBkZWxldGlvbiBJRC5cbiAgICB0aGlzLl9tYXhEZWwgPSAwO1xuICAgIC8vIFVzZXIgZGlzY292ZXJ5IHRhZ3NcbiAgICB0aGlzLl90YWdzID0gW107XG4gICAgLy8gQ3JlZGVudGlhbHMgc3VjaCBhcyBlbWFpbCBvciBwaG9uZSBudW1iZXIuXG4gICAgdGhpcy5fY3JlZGVudGlhbHMgPSBbXTtcbiAgICAvLyBNZXNzYWdlIGNhY2hlLCBzb3J0ZWQgYnkgbWVzc2FnZSBzZXEgdmFsdWVzLCBmcm9tIG9sZCB0byBuZXcuXG4gICAgdGhpcy5fbWVzc2FnZXMgPSBuZXcgQ0J1ZmZlcigoYSwgYikgPT4ge1xuICAgICAgcmV0dXJuIGEuc2VxIC0gYi5zZXE7XG4gICAgfSwgdHJ1ZSk7XG4gICAgLy8gQm9vbGVhbiwgdHJ1ZSBpZiB0aGUgdG9waWMgaXMgY3VycmVudGx5IGxpdmVcbiAgICB0aGlzLl9hdHRhY2hlZCA9IGZhbHNlO1xuICAgIC8vIFRpbWVzdGFwIG9mIHRoZSBtb3N0IHJlY2VudGx5IHVwZGF0ZWQgc3Vic2NyaXB0aW9uLlxuICAgIHRoaXMuX2xhc3RTdWJzVXBkYXRlID0gbmV3IERhdGUoMCk7XG4gICAgLy8gVG9waWMgY3JlYXRlZCBidXQgbm90IHlldCBzeW5jZWQgd2l0aCB0aGUgc2VydmVyLiBVc2VkIG9ubHkgZHVyaW5nIGluaXRpYWxpemF0aW9uLlxuICAgIHRoaXMuX25ldyA9IHRydWU7XG4gICAgLy8gVGhlIHRvcGljIGlzIGRlbGV0ZWQgYXQgdGhlIHNlcnZlciwgdGhpcyBpcyBhIGxvY2FsIGNvcHkuXG4gICAgdGhpcy5fZGVsZXRlZCA9IGZhbHNlO1xuXG4gICAgLy8gQ2FsbGJhY2tzXG4gICAgaWYgKGNhbGxiYWNrcykge1xuICAgICAgdGhpcy5vbkRhdGEgPSBjYWxsYmFja3Mub25EYXRhO1xuICAgICAgdGhpcy5vbk1ldGEgPSBjYWxsYmFja3Mub25NZXRhO1xuICAgICAgdGhpcy5vblByZXMgPSBjYWxsYmFja3Mub25QcmVzO1xuICAgICAgdGhpcy5vbkluZm8gPSBjYWxsYmFja3Mub25JbmZvO1xuICAgICAgLy8gQSBzaW5nbGUgZGVzYyB1cGRhdGU7XG4gICAgICB0aGlzLm9uTWV0YURlc2MgPSBjYWxsYmFja3Mub25NZXRhRGVzYztcbiAgICAgIC8vIEEgc2luZ2xlIHN1YnNjcmlwdGlvbiByZWNvcmQ7XG4gICAgICB0aGlzLm9uTWV0YVN1YiA9IGNhbGxiYWNrcy5vbk1ldGFTdWI7XG4gICAgICAvLyBBbGwgc3Vic2NyaXB0aW9uIHJlY29yZHMgcmVjZWl2ZWQ7XG4gICAgICB0aGlzLm9uU3Vic1VwZGF0ZWQgPSBjYWxsYmFja3Mub25TdWJzVXBkYXRlZDtcbiAgICAgIHRoaXMub25UYWdzVXBkYXRlZCA9IGNhbGxiYWNrcy5vblRhZ3NVcGRhdGVkO1xuICAgICAgdGhpcy5vbkNyZWRzVXBkYXRlZCA9IGNhbGxiYWNrcy5vbkNyZWRzVXBkYXRlZDtcbiAgICAgIHRoaXMub25EZWxldGVUb3BpYyA9IGNhbGxiYWNrcy5vbkRlbGV0ZVRvcGljO1xuICAgICAgdGhpcy5vbkFsbE1lc3NhZ2VzUmVjZWl2ZWQgPSBjYWxsYmFja3Mub25BbGxNZXNzYWdlc1JlY2VpdmVkO1xuICAgIH1cbiAgfVxuXG4gIC8vIFN0YXRpYyBtZXRob2RzLlxuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmUgdG9waWMgdHlwZSBmcm9tIHRvcGljJ3MgbmFtZTogZ3JwLCBwMnAsIG1lLCBmbmQsIHN5cy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIHRlc3QuXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IE9uZSBvZiA8Y29kZT5cIm1lXCI8L2NvZGU+LCA8Y29kZT5cImZuZFwiPC9jb2RlPiwgPGNvZGU+XCJzeXNcIjwvY29kZT4sIDxjb2RlPlwiZ3JwXCI8L2NvZGU+LFxuICAgKiAgICA8Y29kZT5cInAycFwiPC9jb2RlPiBvciA8Y29kZT51bmRlZmluZWQ8L2NvZGU+LlxuICAgKi9cbiAgc3RhdGljIHRvcGljVHlwZShuYW1lKSB7XG4gICAgY29uc3QgdHlwZXMgPSB7XG4gICAgICAnbWUnOiBDb25zdC5UT1BJQ19NRSxcbiAgICAgICdmbmQnOiBDb25zdC5UT1BJQ19GTkQsXG4gICAgICAnZ3JwJzogQ29uc3QuVE9QSUNfR1JQLFxuICAgICAgJ25ldyc6IENvbnN0LlRPUElDX0dSUCxcbiAgICAgICduY2gnOiBDb25zdC5UT1BJQ19HUlAsXG4gICAgICAnY2huJzogQ29uc3QuVE9QSUNfR1JQLFxuICAgICAgJ3Vzcic6IENvbnN0LlRPUElDX1AyUCxcbiAgICAgICdzeXMnOiBDb25zdC5UT1BJQ19TWVNcbiAgICB9O1xuICAgIHJldHVybiB0eXBlc1sodHlwZW9mIG5hbWUgPT0gJ3N0cmluZycpID8gbmFtZS5zdWJzdHJpbmcoMCwgMykgOiAneHh4J107XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgdGhlIGdpdmVuIHRvcGljIG5hbWUgaXMgYSBuYW1lIG9mIGEgJ21lJyB0b3BpYy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIHRlc3QuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0aGUgbmFtZSBpcyBhIG5hbWUgb2YgYSAnbWUnIHRvcGljLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgc3RhdGljIGlzTWVUb3BpY05hbWUobmFtZSkge1xuICAgIHJldHVybiBUb3BpYy50b3BpY1R5cGUobmFtZSkgPT0gQ29uc3QuVE9QSUNfTUU7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgdGhlIGdpdmVuIHRvcGljIG5hbWUgaXMgYSBuYW1lIG9mIGEgZ3JvdXAgdG9waWMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byB0ZXN0LlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgdGhlIG5hbWUgaXMgYSBuYW1lIG9mIGEgZ3JvdXAgdG9waWMsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBzdGF0aWMgaXNHcm91cFRvcGljTmFtZShuYW1lKSB7XG4gICAgcmV0dXJuIFRvcGljLnRvcGljVHlwZShuYW1lKSA9PSBDb25zdC5UT1BJQ19HUlA7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgdGhlIGdpdmVuIHRvcGljIG5hbWUgaXMgYSBuYW1lIG9mIGEgcDJwIHRvcGljLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gdGVzdC5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIHRoZSBuYW1lIGlzIGEgbmFtZSBvZiBhIHAycCB0b3BpYywgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIHN0YXRpYyBpc1AyUFRvcGljTmFtZShuYW1lKSB7XG4gICAgcmV0dXJuIFRvcGljLnRvcGljVHlwZShuYW1lKSA9PSBDb25zdC5UT1BJQ19QMlA7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgdGhlIGdpdmVuIHRvcGljIG5hbWUgaXMgYSBuYW1lIG9mIGEgY29tbXVuaWNhdGlvbiB0b3BpYywgaS5lLiBQMlAgb3IgZ3JvdXAuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byB0ZXN0LlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgdGhlIG5hbWUgaXMgYSBuYW1lIG9mIGEgcDJwIG9yIGdyb3VwIHRvcGljLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgc3RhdGljIGlzQ29tbVRvcGljTmFtZShuYW1lKSB7XG4gICAgcmV0dXJuIFRvcGljLmlzUDJQVG9waWNOYW1lKG5hbWUpIHx8IFRvcGljLmlzR3JvdXBUb3BpY05hbWUobmFtZSk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgdGhlIHRvcGljIG5hbWUgaXMgYSBuYW1lIG9mIGEgbmV3IHRvcGljLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gdG9waWMgbmFtZSB0byBjaGVjay5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIHRoZSBuYW1lIGlzIGEgbmFtZSBvZiBhIG5ldyB0b3BpYywgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIHN0YXRpYyBpc05ld0dyb3VwVG9waWNOYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gKHR5cGVvZiBuYW1lID09ICdzdHJpbmcnKSAmJlxuICAgICAgKG5hbWUuc3Vic3RyaW5nKDAsIDMpID09IENvbnN0LlRPUElDX05FVyB8fCBuYW1lLnN1YnN0cmluZygwLCAzKSA9PSBDb25zdC5UT1BJQ19ORVdfQ0hBTik7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgdGhlIHRvcGljIG5hbWUgaXMgYSBuYW1lIG9mIGEgY2hhbm5lbC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIHRvcGljIG5hbWUgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIHtib29sZWFufSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0aGUgbmFtZSBpcyBhIG5hbWUgb2YgYSBjaGFubmVsLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgc3RhdGljIGlzQ2hhbm5lbFRvcGljTmFtZShuYW1lKSB7XG4gICAgcmV0dXJuICh0eXBlb2YgbmFtZSA9PSAnc3RyaW5nJykgJiZcbiAgICAgIChuYW1lLnN1YnN0cmluZygwLCAzKSA9PSBDb25zdC5UT1BJQ19DSEFOIHx8IG5hbWUuc3Vic3RyaW5nKDAsIDMpID09IENvbnN0LlRPUElDX05FV19DSEFOKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgdG9waWMgaXMgc3Vic2NyaWJlZC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaXMgdG9waWMgaXMgYXR0YWNoZWQvc3Vic2NyaWJlZCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgKi9cbiAgaXNTdWJzY3JpYmVkKCkge1xuICAgIHJldHVybiB0aGlzLl9hdHRhY2hlZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXF1ZXN0IHRvcGljIHRvIHN1YnNjcmliZS4gV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNzdWJzY3JpYmV9LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge1Rpbm9kZS5HZXRRdWVyeT19IGdldFBhcmFtcyAtIGdldCBxdWVyeSBwYXJhbWV0ZXJzLlxuICAgKiBAcGFyYW0ge1Rpbm9kZS5TZXRQYXJhbXM9fSBzZXRQYXJhbXMgLSBzZXQgcGFyYW1ldGVycy5cbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgdG8gYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgc2VydmVyIHJlc3BvbmRzIHRvIHRoZSByZXF1ZXN0LlxuICAgKi9cbiAgc3Vic2NyaWJlKGdldFBhcmFtcywgc2V0UGFyYW1zKSB7XG4gICAgLy8gSWYgdGhlIHRvcGljIGlzIGFscmVhZHkgc3Vic2NyaWJlZCwgcmV0dXJuIHJlc29sdmVkIHByb21pc2VcbiAgICBpZiAodGhpcy5fYXR0YWNoZWQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcyk7XG4gICAgfVxuXG4gICAgLy8gSWYgdGhlIHRvcGljIGlzIGRlbGV0ZWQsIHJlamVjdCBzdWJzY3JpcHRpb24gcmVxdWVzdHMuXG4gICAgaWYgKHRoaXMuX2RlbGV0ZWQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJDb252ZXJzYXRpb24gZGVsZXRlZFwiKSk7XG4gICAgfVxuXG4gICAgLy8gU2VuZCBzdWJzY3JpYmUgbWVzc2FnZSwgaGFuZGxlIGFzeW5jIHJlc3BvbnNlLlxuICAgIC8vIElmIHRvcGljIG5hbWUgaXMgZXhwbGljaXRseSBwcm92aWRlZCwgdXNlIGl0LiBJZiBubyBuYW1lLCB0aGVuIGl0J3MgYSBuZXcgZ3JvdXAgdG9waWMsXG4gICAgLy8gdXNlIFwibmV3XCIuXG4gICAgcmV0dXJuIHRoaXMuX3Rpbm9kZS5zdWJzY3JpYmUodGhpcy5uYW1lIHx8IENvbnN0LlRPUElDX05FVywgZ2V0UGFyYW1zLCBzZXRQYXJhbXMpLnRoZW4oKGN0cmwpID0+IHtcbiAgICAgIGlmIChjdHJsLmNvZGUgPj0gMzAwKSB7XG4gICAgICAgIC8vIERvIG5vdGhpbmcgaWYgc3Vic2NyaXB0aW9uIHN0YXR1cyBoYXMgbm90IGNoYW5nZWQuXG4gICAgICAgIHJldHVybiBjdHJsO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9hdHRhY2hlZCA9IHRydWU7XG4gICAgICB0aGlzLl9kZWxldGVkID0gZmFsc2U7XG4gICAgICB0aGlzLmFjcyA9IChjdHJsLnBhcmFtcyAmJiBjdHJsLnBhcmFtcy5hY3MpID8gY3RybC5wYXJhbXMuYWNzIDogdGhpcy5hY3M7XG5cbiAgICAgIC8vIFNldCB0b3BpYyBuYW1lIGZvciBuZXcgdG9waWNzIGFuZCBhZGQgaXQgdG8gY2FjaGUuXG4gICAgICBpZiAodGhpcy5fbmV3KSB7XG4gICAgICAgIHRoaXMuX25ldyA9IGZhbHNlO1xuXG4gICAgICAgIGlmICh0aGlzLm5hbWUgIT0gY3RybC50b3BpYykge1xuICAgICAgICAgIC8vIE5hbWUgbWF5IGNoYW5nZSBuZXcxMjM0NTYgLT4gZ3JwQWJDZEVmLiBSZW1vdmUgZnJvbSBjYWNoZSB1bmRlciB0aGUgb2xkIG5hbWUuXG4gICAgICAgICAgdGhpcy5fY2FjaGVEZWxTZWxmKCk7XG4gICAgICAgICAgdGhpcy5uYW1lID0gY3RybC50b3BpYztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9jYWNoZVB1dFNlbGYoKTtcblxuICAgICAgICB0aGlzLmNyZWF0ZWQgPSBjdHJsLnRzO1xuICAgICAgICB0aGlzLnVwZGF0ZWQgPSBjdHJsLnRzO1xuXG4gICAgICAgIGlmICh0aGlzLm5hbWUgIT0gQ29uc3QuVE9QSUNfTUUgJiYgdGhpcy5uYW1lICE9IENvbnN0LlRPUElDX0ZORCkge1xuICAgICAgICAgIC8vIEFkZCB0aGUgbmV3IHRvcGljIHRvIHRoZSBsaXN0IG9mIGNvbnRhY3RzIG1haW50YWluZWQgYnkgdGhlICdtZScgdG9waWMuXG4gICAgICAgICAgY29uc3QgbWUgPSB0aGlzLl90aW5vZGUuZ2V0TWVUb3BpYygpO1xuICAgICAgICAgIGlmIChtZS5vbk1ldGFTdWIpIHtcbiAgICAgICAgICAgIG1lLm9uTWV0YVN1Yih0aGlzKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKG1lLm9uU3Vic1VwZGF0ZWQpIHtcbiAgICAgICAgICAgIG1lLm9uU3Vic1VwZGF0ZWQoW3RoaXMubmFtZV0sIDEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzZXRQYXJhbXMgJiYgc2V0UGFyYW1zLmRlc2MpIHtcbiAgICAgICAgICBzZXRQYXJhbXMuZGVzYy5fbm9Gb3J3YXJkaW5nID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLl9wcm9jZXNzTWV0YURlc2Moc2V0UGFyYW1zLmRlc2MpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gY3RybDtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBkcmFmdCBvZiBhIG1lc3NhZ2Ugd2l0aG91dCBzZW5kaW5nIGl0IHRvIHRoZSBzZXJ2ZXIuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nIHwgT2JqZWN0fSBkYXRhIC0gQ29udGVudCB0byB3cmFwIGluIGEgZHJhZnQuXG4gICAqIEBwYXJhbSB7Ym9vbGVhbj19IG5vRWNobyAtIElmIDxjb2RlPnRydWU8L2NvZGU+IHNlcnZlciB3aWxsIG5vdCBlY2hvIG1lc3NhZ2UgYmFjayB0byBvcmlnaW5hdGluZ1xuICAgKiBzZXNzaW9uLiBPdGhlcndpc2UgdGhlIHNlcnZlciB3aWxsIHNlbmQgYSBjb3B5IG9mIHRoZSBtZXNzYWdlIHRvIHNlbmRlci5cbiAgICpcbiAgICogQHJldHVybnMge09iamVjdH0gbWVzc2FnZSBkcmFmdC5cbiAgICovXG4gIGNyZWF0ZU1lc3NhZ2UoZGF0YSwgbm9FY2hvKSB7XG4gICAgcmV0dXJuIHRoaXMuX3Rpbm9kZS5jcmVhdGVNZXNzYWdlKHRoaXMubmFtZSwgZGF0YSwgbm9FY2hvKTtcbiAgfVxuICAvKipcbiAgICogSW1tZWRpYXRlbHkgcHVibGlzaCBkYXRhIHRvIHRvcGljLiBXcmFwcGVyIGZvciB7QGxpbmsgVGlub2RlI3B1Ymxpc2h9LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZyB8IE9iamVjdH0gZGF0YSAtIERhdGEgdG8gcHVibGlzaCwgZWl0aGVyIHBsYWluIHN0cmluZyBvciBhIERyYWZ0eSBvYmplY3QuXG4gICAqIEBwYXJhbSB7Ym9vbGVhbj19IG5vRWNobyAtIElmIDxjb2RlPnRydWU8L2NvZGU+IHNlcnZlciB3aWxsIG5vdCBlY2hvIG1lc3NhZ2UgYmFjayB0byBvcmlnaW5hdGluZ1xuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBzZXJ2ZXIgcmVzcG9uZHMgdG8gdGhlIHJlcXVlc3QuXG4gICAqL1xuICBwdWJsaXNoKGRhdGEsIG5vRWNobykge1xuICAgIHJldHVybiB0aGlzLnB1Ymxpc2hNZXNzYWdlKHRoaXMuY3JlYXRlTWVzc2FnZShkYXRhLCBub0VjaG8pKTtcbiAgfVxuICAvKipcbiAgICogUHVibGlzaCBtZXNzYWdlIGNyZWF0ZWQgYnkge0BsaW5rIFRpbm9kZS5Ub3BpYyNjcmVhdGVNZXNzYWdlfS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHB1YiAtIHtkYXRhfSBvYmplY3QgdG8gcHVibGlzaC4gTXVzdCBiZSBjcmVhdGVkIGJ5IHtAbGluayBUaW5vZGUuVG9waWMjY3JlYXRlTWVzc2FnZX1cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgdG8gYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgc2VydmVyIHJlc3BvbmRzIHRvIHRoZSByZXF1ZXN0LlxuICAgKi9cbiAgcHVibGlzaE1lc3NhZ2UocHViKSB7XG4gICAgaWYgKCF0aGlzLl9hdHRhY2hlZCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIkNhbm5vdCBwdWJsaXNoIG9uIGluYWN0aXZlIHRvcGljXCIpKTtcbiAgICB9XG5cbiAgICAvLyBFeHRyYWN0IHJlZmVyZWNlcyB0byBhdHRhY2htZW50cyBhbmQgb3V0IG9mIGJhbmQgaW1hZ2UgcmVjb3Jkcy5cbiAgICBsZXQgYXR0YWNobWVudHMgPSBudWxsO1xuICAgIGlmIChEcmFmdHkuaGFzRW50aXRpZXMocHViLmNvbnRlbnQpKSB7XG4gICAgICBhdHRhY2htZW50cyA9IFtdO1xuICAgICAgRHJhZnR5LmVudGl0aWVzKHB1Yi5jb250ZW50LCAoZGF0YSkgPT4ge1xuICAgICAgICBpZiAoZGF0YSAmJiBkYXRhLnJlZikge1xuICAgICAgICAgIGF0dGFjaG1lbnRzLnB1c2goZGF0YS5yZWYpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGlmIChhdHRhY2htZW50cy5sZW5ndGggPT0gMCkge1xuICAgICAgICBhdHRhY2htZW50cyA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gU2VuZCBkYXRhLlxuICAgIHB1Yi5fc2VuZGluZyA9IHRydWU7XG4gICAgcHViLl9mYWlsZWQgPSBmYWxzZTtcbiAgICByZXR1cm4gdGhpcy5fdGlub2RlLnB1Ymxpc2hNZXNzYWdlKHB1YiwgYXR0YWNobWVudHMpLnRoZW4oKGN0cmwpID0+IHtcbiAgICAgIHB1Yi5fc2VuZGluZyA9IGZhbHNlO1xuICAgICAgcHViLnRzID0gY3RybC50cztcbiAgICAgIHRoaXMuc3dhcE1lc3NhZ2VJZChwdWIsIGN0cmwucGFyYW1zLnNlcSk7XG4gICAgICB0aGlzLl9yb3V0ZURhdGEocHViKTtcbiAgICAgIHJldHVybiBjdHJsO1xuICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgIHRoaXMuX3Rpbm9kZS5sb2dnZXIoXCJXQVJOSU5HOiBNZXNzYWdlIHJlamVjdGVkIGJ5IHRoZSBzZXJ2ZXJcIiwgZXJyKTtcbiAgICAgIHB1Yi5fc2VuZGluZyA9IGZhbHNlO1xuICAgICAgcHViLl9mYWlsZWQgPSB0cnVlO1xuICAgICAgaWYgKHRoaXMub25EYXRhKSB7XG4gICAgICAgIHRoaXMub25EYXRhKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgLyoqXG4gICAqIEFkZCBtZXNzYWdlIHRvIGxvY2FsIG1lc3NhZ2UgY2FjaGUsIHNlbmQgdG8gdGhlIHNlcnZlciB3aGVuIHRoZSBwcm9taXNlIGlzIHJlc29sdmVkLlxuICAgKiBJZiBwcm9taXNlIGlzIG51bGwgb3IgdW5kZWZpbmVkLCB0aGUgbWVzc2FnZSB3aWxsIGJlIHNlbnQgaW1tZWRpYXRlbHkuXG4gICAqIFRoZSBtZXNzYWdlIGlzIHNlbnQgd2hlbiB0aGVcbiAgICogVGhlIG1lc3NhZ2Ugc2hvdWxkIGJlIGNyZWF0ZWQgYnkge0BsaW5rIFRpbm9kZS5Ub3BpYyNjcmVhdGVNZXNzYWdlfS5cbiAgICogVGhpcyBpcyBwcm9iYWJseSBub3QgdGhlIGZpbmFsIEFQSS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHB1YiAtIE1lc3NhZ2UgdG8gdXNlIGFzIGEgZHJhZnQuXG4gICAqIEBwYXJhbSB7UHJvbWlzZX0gcHJvbSAtIE1lc3NhZ2Ugd2lsbCBiZSBzZW50IHdoZW4gdGhpcyBwcm9taXNlIGlzIHJlc29sdmVkLCBkaXNjYXJkZWQgaWYgcmVqZWN0ZWQuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBkZXJpdmVkIHByb21pc2UuXG4gICAqL1xuICBwdWJsaXNoRHJhZnQocHViLCBwcm9tKSB7XG4gICAgaWYgKCFwcm9tICYmICF0aGlzLl9hdHRhY2hlZCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIkNhbm5vdCBwdWJsaXNoIG9uIGluYWN0aXZlIHRvcGljXCIpKTtcbiAgICB9XG5cbiAgICBjb25zdCBzZXEgPSBwdWIuc2VxIHx8IHRoaXMuX2dldFF1ZXVlZFNlcUlkKCk7XG4gICAgaWYgKCFwdWIuX25vRm9yd2FyZGluZykge1xuICAgICAgLy8gVGhlICdzZXEnLCAndHMnLCBhbmQgJ2Zyb20nIGFyZSBhZGRlZCB0byBtaW1pYyB7ZGF0YX0uIFRoZXkgYXJlIHJlbW92ZWQgbGF0ZXJcbiAgICAgIC8vIGJlZm9yZSB0aGUgbWVzc2FnZSBpcyBzZW50LlxuICAgICAgcHViLl9ub0ZvcndhcmRpbmcgPSB0cnVlO1xuICAgICAgcHViLnNlcSA9IHNlcTtcbiAgICAgIHB1Yi50cyA9IG5ldyBEYXRlKCk7XG4gICAgICBwdWIuZnJvbSA9IHRoaXMuX3Rpbm9kZS5nZXRDdXJyZW50VXNlcklEKCk7XG5cbiAgICAgIC8vIERvbid0IG5lZWQgYW4gZWNobyBtZXNzYWdlIGJlY2F1c2UgdGhlIG1lc3NhZ2UgaXMgYWRkZWQgdG8gbG9jYWwgY2FjaGUgcmlnaHQgYXdheS5cbiAgICAgIHB1Yi5ub2VjaG8gPSB0cnVlO1xuICAgICAgLy8gQWRkIHRvIGNhY2hlLlxuICAgICAgdGhpcy5fbWVzc2FnZXMucHV0KHB1Yik7XG4gICAgICB0aGlzLl90aW5vZGUuX2RiLmFkZE1lc3NhZ2UocHViKTtcblxuICAgICAgaWYgKHRoaXMub25EYXRhKSB7XG4gICAgICAgIHRoaXMub25EYXRhKHB1Yik7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIElmIHByb21pc2UgaXMgcHJvdmlkZWQsIHNlbmQgdGhlIHF1ZXVlZCBtZXNzYWdlIHdoZW4gaXQncyByZXNvbHZlZC5cbiAgICAvLyBJZiBubyBwcm9taXNlIGlzIHByb3ZpZGVkLCBjcmVhdGUgYSByZXNvbHZlZCBvbmUgYW5kIHNlbmQgaW1tZWRpYXRlbHkuXG4gICAgcHJvbSA9IChwcm9tIHx8IFByb21pc2UucmVzb2x2ZSgpKS50aGVuKFxuICAgICAgKCAvKiBhcmd1bWVudCBpZ25vcmVkICovICkgPT4ge1xuICAgICAgICBpZiAocHViLl9jYW5jZWxsZWQpIHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY29kZTogMzAwLFxuICAgICAgICAgICAgdGV4dDogXCJjYW5jZWxsZWRcIlxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMucHVibGlzaE1lc3NhZ2UocHViKTtcbiAgICAgIH0sXG4gICAgICAoZXJyKSA9PiB7XG4gICAgICAgIHRoaXMuX3Rpbm9kZS5sb2dnZXIoXCJXQVJOSU5HOiBNZXNzYWdlIGRyYWZ0IHJlamVjdGVkXCIsIGVycik7XG4gICAgICAgIHB1Yi5fc2VuZGluZyA9IGZhbHNlO1xuICAgICAgICBwdWIuX2ZhaWxlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuX21lc3NhZ2VzLmRlbEF0KHRoaXMuX21lc3NhZ2VzLmZpbmQocHViKSk7XG4gICAgICAgIHRoaXMuX3Rpbm9kZS5fZGIucmVtTWVzc2FnZXModGhpcy5uYW1lLCBwdWIuc2VxKTtcbiAgICAgICAgaWYgKHRoaXMub25EYXRhKSB7XG4gICAgICAgICAgdGhpcy5vbkRhdGEoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgcmV0dXJuIHByb207XG4gIH1cbiAgLyoqXG4gICAqIExlYXZlIHRoZSB0b3BpYywgb3B0aW9uYWxseSB1bnNpYnNjcmliZS4gTGVhdmluZyB0aGUgdG9waWMgbWVhbnMgdGhlIHRvcGljIHdpbGwgc3RvcFxuICAgKiByZWNlaXZpbmcgdXBkYXRlcyBmcm9tIHRoZSBzZXJ2ZXIuIFVuc3Vic2NyaWJpbmcgd2lsbCB0ZXJtaW5hdGUgdXNlcidzIHJlbGF0aW9uc2hpcCB3aXRoIHRoZSB0b3BpYy5cbiAgICogV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNsZWF2ZX0uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbj19IHVuc3ViIC0gSWYgdHJ1ZSwgdW5zdWJzY3JpYmUsIG90aGVyd2lzZSBqdXN0IGxlYXZlLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBzZXJ2ZXIgcmVzcG9uZHMgdG8gdGhlIHJlcXVlc3QuXG4gICAqL1xuICBsZWF2ZSh1bnN1Yikge1xuICAgIC8vIEl0J3MgcG9zc2libGUgdG8gdW5zdWJzY3JpYmUgKHVuc3ViPT10cnVlKSBmcm9tIGluYWN0aXZlIHRvcGljLlxuICAgIGlmICghdGhpcy5fYXR0YWNoZWQgJiYgIXVuc3ViKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiQ2Fubm90IGxlYXZlIGluYWN0aXZlIHRvcGljXCIpKTtcbiAgICB9XG5cbiAgICAvLyBTZW5kIGEgJ2xlYXZlJyBtZXNzYWdlLCBoYW5kbGUgYXN5bmMgcmVzcG9uc2VcbiAgICByZXR1cm4gdGhpcy5fdGlub2RlLmxlYXZlKHRoaXMubmFtZSwgdW5zdWIpLnRoZW4oKGN0cmwpID0+IHtcbiAgICAgIHRoaXMuX3Jlc2V0U3ViKCk7XG4gICAgICBpZiAodW5zdWIpIHtcbiAgICAgICAgdGhpcy5fZ29uZSgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGN0cmw7XG4gICAgfSk7XG4gIH1cbiAgLyoqXG4gICAqIFJlcXVlc3QgdG9waWMgbWV0YWRhdGEgZnJvbSB0aGUgc2VydmVyLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge1Rpbm9kZS5HZXRRdWVyeX0gcmVxdWVzdCBwYXJhbWV0ZXJzXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHRvIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIHNlcnZlciByZXNwb25kcyB0byByZXF1ZXN0LlxuICAgKi9cbiAgZ2V0TWV0YShwYXJhbXMpIHtcbiAgICAvLyBTZW5kIHtnZXR9IG1lc3NhZ2UsIHJldHVybiBwcm9taXNlLlxuICAgIHJldHVybiB0aGlzLl90aW5vZGUuZ2V0TWV0YSh0aGlzLm5hbWUsIHBhcmFtcyk7XG4gIH1cbiAgLyoqXG4gICAqIFJlcXVlc3QgbW9yZSBtZXNzYWdlcyBmcm9tIHRoZSBzZXJ2ZXJcbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IGxpbWl0IG51bWJlciBvZiBtZXNzYWdlcyB0byBnZXQuXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gZm9yd2FyZCBpZiB0cnVlLCByZXF1ZXN0IG5ld2VyIG1lc3NhZ2VzLlxuICAgKi9cbiAgZ2V0TWVzc2FnZXNQYWdlKGxpbWl0LCBmb3J3YXJkKSB7XG4gICAgbGV0IHF1ZXJ5ID0gZm9yd2FyZCA/XG4gICAgICB0aGlzLnN0YXJ0TWV0YVF1ZXJ5KCkud2l0aExhdGVyRGF0YShsaW1pdCkgOlxuICAgICAgdGhpcy5zdGFydE1ldGFRdWVyeSgpLndpdGhFYXJsaWVyRGF0YShsaW1pdCk7XG5cbiAgICAvLyBGaXJzdCB0cnkgZmV0Y2hpbmcgZnJvbSBEQiwgdGhlbiBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAgcmV0dXJuIHRoaXMuX2xvYWRNZXNzYWdlcyh0aGlzLl90aW5vZGUuX2RiLCBxdWVyeS5leHRyYWN0KCdkYXRhJykpXG4gICAgICAudGhlbigoY291bnQpID0+IHtcbiAgICAgICAgaWYgKGNvdW50ID09IGxpbWl0KSB7XG4gICAgICAgICAgLy8gR290IGVub3VnaCBtZXNzYWdlcyBmcm9tIGxvY2FsIGNhY2hlLlxuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoe1xuICAgICAgICAgICAgdG9waWM6IHRoaXMubmFtZSxcbiAgICAgICAgICAgIGNvZGU6IDIwMCxcbiAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICBjb3VudDogY291bnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJlZHVjZSB0aGUgY291bnQgb2YgcmVxdWVzdGVkIG1lc3NhZ2VzLlxuICAgICAgICBsaW1pdCAtPSBjb3VudDtcbiAgICAgICAgLy8gVXBkYXRlIHF1ZXJ5IHdpdGggbmV3IHZhbHVlcyBsb2FkZWQgZnJvbSBEQi5cbiAgICAgICAgcXVlcnkgPSBmb3J3YXJkID8gdGhpcy5zdGFydE1ldGFRdWVyeSgpLndpdGhMYXRlckRhdGEobGltaXQpIDpcbiAgICAgICAgICB0aGlzLnN0YXJ0TWV0YVF1ZXJ5KCkud2l0aEVhcmxpZXJEYXRhKGxpbWl0KTtcbiAgICAgICAgbGV0IHByb21pc2UgPSB0aGlzLmdldE1ldGEocXVlcnkuYnVpbGQoKSk7XG4gICAgICAgIGlmICghZm9yd2FyZCkge1xuICAgICAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKGN0cmwpID0+IHtcbiAgICAgICAgICAgIGlmIChjdHJsICYmIGN0cmwucGFyYW1zICYmICFjdHJsLnBhcmFtcy5jb3VudCkge1xuICAgICAgICAgICAgICB0aGlzLl9ub0VhcmxpZXJNc2dzID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgIH0pO1xuICB9XG4gIC8qKlxuICAgKiBVcGRhdGUgdG9waWMgbWV0YWRhdGEuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7VGlub2RlLlNldFBhcmFtc30gcGFyYW1zIHBhcmFtZXRlcnMgdG8gdXBkYXRlLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBzZXJ2ZXIgcmVzcG9uZHMgdG8gcmVxdWVzdC5cbiAgICovXG4gIHNldE1ldGEocGFyYW1zKSB7XG4gICAgaWYgKHBhcmFtcy50YWdzKSB7XG4gICAgICBwYXJhbXMudGFncyA9IG5vcm1hbGl6ZUFycmF5KHBhcmFtcy50YWdzKTtcbiAgICB9XG4gICAgLy8gU2VuZCBTZXQgbWVzc2FnZSwgaGFuZGxlIGFzeW5jIHJlc3BvbnNlLlxuICAgIHJldHVybiB0aGlzLl90aW5vZGUuc2V0TWV0YSh0aGlzLm5hbWUsIHBhcmFtcylcbiAgICAgIC50aGVuKChjdHJsKSA9PiB7XG4gICAgICAgIGlmIChjdHJsICYmIGN0cmwuY29kZSA+PSAzMDApIHtcbiAgICAgICAgICAvLyBOb3QgbW9kaWZpZWRcbiAgICAgICAgICByZXR1cm4gY3RybDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwYXJhbXMuc3ViKSB7XG4gICAgICAgICAgcGFyYW1zLnN1Yi50b3BpYyA9IHRoaXMubmFtZTtcbiAgICAgICAgICBpZiAoY3RybC5wYXJhbXMgJiYgY3RybC5wYXJhbXMuYWNzKSB7XG4gICAgICAgICAgICBwYXJhbXMuc3ViLmFjcyA9IGN0cmwucGFyYW1zLmFjcztcbiAgICAgICAgICAgIHBhcmFtcy5zdWIudXBkYXRlZCA9IGN0cmwudHM7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICghcGFyYW1zLnN1Yi51c2VyKSB7XG4gICAgICAgICAgICAvLyBUaGlzIGlzIGEgc3Vic2NyaXB0aW9uIHVwZGF0ZSBvZiB0aGUgY3VycmVudCB1c2VyLlxuICAgICAgICAgICAgLy8gQXNzaWduIHVzZXIgSUQgb3RoZXJ3aXNlIHRoZSB1cGRhdGUgd2lsbCBiZSBpZ25vcmVkIGJ5IF9wcm9jZXNzTWV0YVN1Yi5cbiAgICAgICAgICAgIHBhcmFtcy5zdWIudXNlciA9IHRoaXMuX3Rpbm9kZS5nZXRDdXJyZW50VXNlcklEKCk7XG4gICAgICAgICAgICBpZiAoIXBhcmFtcy5kZXNjKSB7XG4gICAgICAgICAgICAgIC8vIEZvcmNlIHVwZGF0ZSB0byB0b3BpYydzIGFzYy5cbiAgICAgICAgICAgICAgcGFyYW1zLmRlc2MgPSB7fTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcGFyYW1zLnN1Yi5fbm9Gb3J3YXJkaW5nID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLl9wcm9jZXNzTWV0YVN1YihbcGFyYW1zLnN1Yl0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHBhcmFtcy5kZXNjKSB7XG4gICAgICAgICAgaWYgKGN0cmwucGFyYW1zICYmIGN0cmwucGFyYW1zLmFjcykge1xuICAgICAgICAgICAgcGFyYW1zLmRlc2MuYWNzID0gY3RybC5wYXJhbXMuYWNzO1xuICAgICAgICAgICAgcGFyYW1zLmRlc2MudXBkYXRlZCA9IGN0cmwudHM7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuX3Byb2Nlc3NNZXRhRGVzYyhwYXJhbXMuZGVzYyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocGFyYW1zLnRhZ3MpIHtcbiAgICAgICAgICB0aGlzLl9wcm9jZXNzTWV0YVRhZ3MocGFyYW1zLnRhZ3MpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwYXJhbXMuY3JlZCkge1xuICAgICAgICAgIHRoaXMuX3Byb2Nlc3NNZXRhQ3JlZHMoW3BhcmFtcy5jcmVkXSwgdHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY3RybDtcbiAgICAgIH0pO1xuICB9XG4gIC8qKlxuICAgKiBVcGRhdGUgYWNjZXNzIG1vZGUgb2YgdGhlIGN1cnJlbnQgdXNlciBvciBvZiBhbm90aGVyIHRvcGljIHN1YnNyaWJlci5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVpZCAtIFVJRCBvZiB0aGUgdXNlciB0byB1cGRhdGUgb3IgbnVsbCB0byB1cGRhdGUgY3VycmVudCB1c2VyLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdXBkYXRlIC0gdGhlIHVwZGF0ZSB2YWx1ZSwgZnVsbCBvciBkZWx0YS5cbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgdG8gYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgc2VydmVyIHJlc3BvbmRzIHRvIHJlcXVlc3QuXG4gICAqL1xuICB1cGRhdGVNb2RlKHVpZCwgdXBkYXRlKSB7XG4gICAgY29uc3QgdXNlciA9IHVpZCA/IHRoaXMuc3Vic2NyaWJlcih1aWQpIDogbnVsbDtcbiAgICBjb25zdCBhbSA9IHVzZXIgP1xuICAgICAgdXNlci5hY3MudXBkYXRlR2l2ZW4odXBkYXRlKS5nZXRHaXZlbigpIDpcbiAgICAgIHRoaXMuZ2V0QWNjZXNzTW9kZSgpLnVwZGF0ZVdhbnQodXBkYXRlKS5nZXRXYW50KCk7XG5cbiAgICByZXR1cm4gdGhpcy5zZXRNZXRhKHtcbiAgICAgIHN1Yjoge1xuICAgICAgICB1c2VyOiB1aWQsXG4gICAgICAgIG1vZGU6IGFtXG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgLyoqXG4gICAqIENyZWF0ZSBuZXcgdG9waWMgc3Vic2NyaXB0aW9uLiBXcmFwcGVyIGZvciB7QGxpbmsgVGlub2RlI3NldE1ldGF9LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdWlkIC0gSUQgb2YgdGhlIHVzZXIgdG8gaW52aXRlXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gbW9kZSAtIEFjY2VzcyBtb2RlLiA8Y29kZT5udWxsPC9jb2RlPiBtZWFucyB0byB1c2UgZGVmYXVsdC5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgdG8gYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgc2VydmVyIHJlc3BvbmRzIHRvIHJlcXVlc3QuXG4gICAqL1xuICBpbnZpdGUodWlkLCBtb2RlKSB7XG4gICAgcmV0dXJuIHRoaXMuc2V0TWV0YSh7XG4gICAgICBzdWI6IHtcbiAgICAgICAgdXNlcjogdWlkLFxuICAgICAgICBtb2RlOiBtb2RlXG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgLyoqXG4gICAqIEFyY2hpdmUgb3IgdW4tYXJjaGl2ZSB0aGUgdG9waWMuIFdyYXBwZXIgZm9yIHtAbGluayBUaW5vZGUjc2V0TWV0YX0uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gYXJjaCAtIHRydWUgdG8gYXJjaGl2ZSB0aGUgdG9waWMsIGZhbHNlIG90aGVyd2lzZS5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgdG8gYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgc2VydmVyIHJlc3BvbmRzIHRvIHJlcXVlc3QuXG4gICAqL1xuICBhcmNoaXZlKGFyY2gpIHtcbiAgICBpZiAodGhpcy5wcml2YXRlICYmICghdGhpcy5wcml2YXRlLmFyY2ggPT0gIWFyY2gpKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGFyY2gpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zZXRNZXRhKHtcbiAgICAgIGRlc2M6IHtcbiAgICAgICAgcHJpdmF0ZToge1xuICAgICAgICAgIGFyY2g6IGFyY2ggPyB0cnVlIDogQ29uc3QuREVMX0NIQVJcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIC8qKlxuICAgKiBEZWxldGUgbWVzc2FnZXMuIEhhcmQtZGVsZXRpbmcgbWVzc2FnZXMgcmVxdWlyZXMgT3duZXIgcGVybWlzc2lvbi5cbiAgICogV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNkZWxNZXNzYWdlc30uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7VGlub2RlLkRlbFJhbmdlW119IHJhbmdlcyAtIFJhbmdlcyBvZiBtZXNzYWdlIElEcyB0byBkZWxldGUuXG4gICAqIEBwYXJhbSB7Ym9vbGVhbj19IGhhcmQgLSBIYXJkIG9yIHNvZnQgZGVsZXRlXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHRvIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIHNlcnZlciByZXNwb25kcyB0byByZXF1ZXN0LlxuICAgKi9cbiAgZGVsTWVzc2FnZXMocmFuZ2VzLCBoYXJkKSB7XG4gICAgaWYgKCF0aGlzLl9hdHRhY2hlZCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIkNhbm5vdCBkZWxldGUgbWVzc2FnZXMgaW4gaW5hY3RpdmUgdG9waWNcIikpO1xuICAgIH1cblxuICAgIC8vIFNvcnQgcmFuZ2VzIGluIGFjY2VuZGluZyBvcmRlciBieSBsb3csIHRoZSBkZXNjZW5kaW5nIGJ5IGhpLlxuICAgIHJhbmdlcy5zb3J0KChyMSwgcjIpID0+IHtcbiAgICAgIGlmIChyMS5sb3cgPCByMi5sb3cpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBpZiAocjEubG93ID09IHIyLmxvdykge1xuICAgICAgICByZXR1cm4gIXIyLmhpIHx8IChyMS5oaSA+PSByMi5oaSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSk7XG5cbiAgICAvLyBSZW1vdmUgcGVuZGluZyBtZXNzYWdlcyBmcm9tIHJhbmdlcyBwb3NzaWJseSBjbGlwcGluZyBzb21lIHJhbmdlcy5cbiAgICBsZXQgdG9zZW5kID0gcmFuZ2VzLnJlZHVjZSgob3V0LCByKSA9PiB7XG4gICAgICBpZiAoci5sb3cgPCBDb25zdC5MT0NBTF9TRVFJRCkge1xuICAgICAgICBpZiAoIXIuaGkgfHwgci5oaSA8IENvbnN0LkxPQ0FMX1NFUUlEKSB7XG4gICAgICAgICAgb3V0LnB1c2gocik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gQ2xpcCBoaSB0byBtYXggYWxsb3dlZCB2YWx1ZS5cbiAgICAgICAgICBvdXQucHVzaCh7XG4gICAgICAgICAgICBsb3c6IHIubG93LFxuICAgICAgICAgICAgaGk6IHRoaXMuX21heFNlcSArIDFcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG91dDtcbiAgICB9LCBbXSk7XG5cbiAgICAvLyBTZW5kIHtkZWx9IG1lc3NhZ2UsIHJldHVybiBwcm9taXNlXG4gICAgbGV0IHJlc3VsdDtcbiAgICBpZiAodG9zZW5kLmxlbmd0aCA+IDApIHtcbiAgICAgIHJlc3VsdCA9IHRoaXMuX3Rpbm9kZS5kZWxNZXNzYWdlcyh0aGlzLm5hbWUsIHRvc2VuZCwgaGFyZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdCA9IFByb21pc2UucmVzb2x2ZSh7XG4gICAgICAgIHBhcmFtczoge1xuICAgICAgICAgIGRlbDogMFxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgLy8gVXBkYXRlIGxvY2FsIGNhY2hlLlxuICAgIHJldHVybiByZXN1bHQudGhlbigoY3RybCkgPT4ge1xuICAgICAgaWYgKGN0cmwucGFyYW1zLmRlbCA+IHRoaXMuX21heERlbCkge1xuICAgICAgICB0aGlzLl9tYXhEZWwgPSBjdHJsLnBhcmFtcy5kZWw7XG4gICAgICB9XG5cbiAgICAgIHJhbmdlcy5mb3JFYWNoKChyKSA9PiB7XG4gICAgICAgIGlmIChyLmhpKSB7XG4gICAgICAgICAgdGhpcy5mbHVzaE1lc3NhZ2VSYW5nZShyLmxvdywgci5oaSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5mbHVzaE1lc3NhZ2Uoci5sb3cpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5fdXBkYXRlRGVsZXRlZFJhbmdlcygpO1xuXG4gICAgICBpZiAodGhpcy5vbkRhdGEpIHtcbiAgICAgICAgLy8gQ2FsbGluZyB3aXRoIG5vIHBhcmFtZXRlcnMgdG8gaW5kaWNhdGUgdGhlIG1lc3NhZ2VzIHdlcmUgZGVsZXRlZC5cbiAgICAgICAgdGhpcy5vbkRhdGEoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjdHJsO1xuICAgIH0pO1xuICB9XG4gIC8qKlxuICAgKiBEZWxldGUgYWxsIG1lc3NhZ2VzLiBIYXJkLWRlbGV0aW5nIG1lc3NhZ2VzIHJlcXVpcmVzIE93bmVyIHBlcm1pc3Npb24uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gaGFyZERlbCAtIHRydWUgaWYgbWVzc2FnZXMgc2hvdWxkIGJlIGhhcmQtZGVsZXRlZC5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgdG8gYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgc2VydmVyIHJlc3BvbmRzIHRvIHJlcXVlc3QuXG4gICAqL1xuICBkZWxNZXNzYWdlc0FsbChoYXJkRGVsKSB7XG4gICAgaWYgKCF0aGlzLl9tYXhTZXEgfHwgdGhpcy5fbWF4U2VxIDw9IDApIHtcbiAgICAgIC8vIFRoZXJlIGFyZSBubyBtZXNzYWdlcyB0byBkZWxldGUuXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmRlbE1lc3NhZ2VzKFt7XG4gICAgICBsb3c6IDEsXG4gICAgICBoaTogdGhpcy5fbWF4U2VxICsgMSxcbiAgICAgIF9hbGw6IHRydWVcbiAgICB9XSwgaGFyZERlbCk7XG4gIH1cbiAgLyoqXG4gICAqIERlbGV0ZSBtdWx0aXBsZSBtZXNzYWdlcyBkZWZpbmVkIGJ5IHRoZWlyIElEcy4gSGFyZC1kZWxldGluZyBtZXNzYWdlcyByZXF1aXJlcyBPd25lciBwZXJtaXNzaW9uLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge1Rpbm9kZS5EZWxSYW5nZVtdfSBsaXN0IC0gbGlzdCBvZiBzZXEgSURzIHRvIGRlbGV0ZVxuICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBoYXJkRGVsIC0gdHJ1ZSBpZiBtZXNzYWdlcyBzaG91bGQgYmUgaGFyZC1kZWxldGVkLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBzZXJ2ZXIgcmVzcG9uZHMgdG8gcmVxdWVzdC5cbiAgICovXG4gIGRlbE1lc3NhZ2VzTGlzdChsaXN0LCBoYXJkRGVsKSB7XG4gICAgLy8gU29ydCB0aGUgbGlzdCBpbiBhc2NlbmRpbmcgb3JkZXJcbiAgICBsaXN0LnNvcnQoKGEsIGIpID0+IGEgLSBiKTtcbiAgICAvLyBDb252ZXJ0IHRoZSBhcnJheSBvZiBJRHMgdG8gcmFuZ2VzLlxuICAgIGxldCByYW5nZXMgPSBsaXN0LnJlZHVjZSgob3V0LCBpZCkgPT4ge1xuICAgICAgaWYgKG91dC5sZW5ndGggPT0gMCkge1xuICAgICAgICAvLyBGaXJzdCBlbGVtZW50LlxuICAgICAgICBvdXQucHVzaCh7XG4gICAgICAgICAgbG93OiBpZFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBwcmV2ID0gb3V0W291dC5sZW5ndGggLSAxXTtcbiAgICAgICAgaWYgKCghcHJldi5oaSAmJiAoaWQgIT0gcHJldi5sb3cgKyAxKSkgfHwgKGlkID4gcHJldi5oaSkpIHtcbiAgICAgICAgICAvLyBOZXcgcmFuZ2UuXG4gICAgICAgICAgb3V0LnB1c2goe1xuICAgICAgICAgICAgbG93OiBpZFxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIEV4cGFuZCBleGlzdGluZyByYW5nZS5cbiAgICAgICAgICBwcmV2LmhpID0gcHJldi5oaSA/IE1hdGgubWF4KHByZXYuaGksIGlkICsgMSkgOiBpZCArIDE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBvdXQ7XG4gICAgfSwgW10pO1xuICAgIC8vIFNlbmQge2RlbH0gbWVzc2FnZSwgcmV0dXJuIHByb21pc2VcbiAgICByZXR1cm4gdGhpcy5kZWxNZXNzYWdlcyhyYW5nZXMsIGhhcmREZWwpO1xuICB9XG4gIC8qKlxuICAgKiBEZWxldGUgdG9waWMuIFJlcXVpcmVzIE93bmVyIHBlcm1pc3Npb24uIFdyYXBwZXIgZm9yIHtAbGluayBUaW5vZGUjZGVsVG9waWN9LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGhhcmQgLSBoYWQtZGVsZXRlIHRvcGljLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBzZXJ2ZXIgcmVzcG9uZHMgdG8gdGhlIHJlcXVlc3QuXG4gICAqL1xuICBkZWxUb3BpYyhoYXJkKSB7XG4gICAgaWYgKHRoaXMuX2RlbGV0ZWQpIHtcbiAgICAgIC8vIFRoZSB0b3BpYyBpcyBhbHJlYWR5IGRlbGV0ZWQgYXQgdGhlIHNlcnZlciwganVzdCByZW1vdmUgZnJvbSBEQi5cbiAgICAgIHRoaXMuX2dvbmUoKTtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZS5yZXNvbHZlKG51bGwpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl90aW5vZGUuZGVsVG9waWModGhpcy5uYW1lLCBoYXJkKS50aGVuKChjdHJsKSA9PiB7XG4gICAgICB0aGlzLl9yZXNldFN1YigpO1xuICAgICAgdGhpcy5fZ29uZSgpO1xuICAgICAgcmV0dXJuIGN0cmw7XG4gICAgfSk7XG4gIH1cbiAgLyoqXG4gICAqIERlbGV0ZSBzdWJzY3JpcHRpb24uIFJlcXVpcmVzIFNoYXJlIHBlcm1pc3Npb24uIFdyYXBwZXIgZm9yIHtAbGluayBUaW5vZGUjZGVsU3Vic2NyaXB0aW9ufS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVzZXIgLSBJRCBvZiB0aGUgdXNlciB0byByZW1vdmUgc3Vic2NyaXB0aW9uIGZvci5cbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgdG8gYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgc2VydmVyIHJlc3BvbmRzIHRvIHJlcXVlc3QuXG4gICAqL1xuICBkZWxTdWJzY3JpcHRpb24odXNlcikge1xuICAgIGlmICghdGhpcy5fYXR0YWNoZWQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJDYW5ub3QgZGVsZXRlIHN1YnNjcmlwdGlvbiBpbiBpbmFjdGl2ZSB0b3BpY1wiKSk7XG4gICAgfVxuICAgIC8vIFNlbmQge2RlbH0gbWVzc2FnZSwgcmV0dXJuIHByb21pc2VcbiAgICByZXR1cm4gdGhpcy5fdGlub2RlLmRlbFN1YnNjcmlwdGlvbih0aGlzLm5hbWUsIHVzZXIpLnRoZW4oKGN0cmwpID0+IHtcbiAgICAgIC8vIFJlbW92ZSB0aGUgb2JqZWN0IGZyb20gdGhlIHN1YnNjcmlwdGlvbiBjYWNoZTtcbiAgICAgIGRlbGV0ZSB0aGlzLl91c2Vyc1t1c2VyXTtcbiAgICAgIC8vIE5vdGlmeSBsaXN0ZW5lcnNcbiAgICAgIGlmICh0aGlzLm9uU3Vic1VwZGF0ZWQpIHtcbiAgICAgICAgdGhpcy5vblN1YnNVcGRhdGVkKE9iamVjdC5rZXlzKHRoaXMuX3VzZXJzKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY3RybDtcbiAgICB9KTtcbiAgfVxuICAvKipcbiAgICogU2VuZCBhIHJlYWQvcmVjdiBub3RpZmljYXRpb24uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB3aGF0IC0gd2hhdCBub3RpZmljYXRpb24gdG8gc2VuZDogPGNvZGU+cmVjdjwvY29kZT4sIDxjb2RlPnJlYWQ8L2NvZGU+LlxuICAgKiBAcGFyYW0ge251bWJlcn0gc2VxIC0gSUQgb3IgdGhlIG1lc3NhZ2UgcmVhZCBvciByZWNlaXZlZC5cbiAgICovXG4gIG5vdGUod2hhdCwgc2VxKSB7XG4gICAgaWYgKCF0aGlzLl9hdHRhY2hlZCkge1xuICAgICAgLy8gQ2Fubm90IHNlbmRpbmcge25vdGV9IG9uIGFuIGluYWN0aXZlIHRvcGljXCIuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gVXBkYXRlIGxvY2FsIGNhY2hlIHdpdGggdGhlIG5ldyBjb3VudC5cbiAgICBjb25zdCB1c2VyID0gdGhpcy5fdXNlcnNbdGhpcy5fdGlub2RlLmdldEN1cnJlbnRVc2VySUQoKV07XG4gICAgbGV0IHVwZGF0ZSA9IGZhbHNlO1xuICAgIGlmICh1c2VyKSB7XG4gICAgICAvLyBTZWxmLXN1YnNjcmlwdGlvbiBpcyBmb3VuZC5cbiAgICAgIGlmICghdXNlclt3aGF0XSB8fCB1c2VyW3doYXRdIDwgc2VxKSB7XG4gICAgICAgIHVzZXJbd2hhdF0gPSBzZXE7XG4gICAgICAgIHVwZGF0ZSA9IHRydWU7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFNlbGYtc3Vic2NyaXB0aW9uIGlzIG5vdCBmb3VuZC5cbiAgICAgIHVwZGF0ZSA9ICh0aGlzW3doYXRdIHwgMCkgPCBzZXE7XG4gICAgfVxuXG4gICAgaWYgKHVwZGF0ZSkge1xuICAgICAgLy8gU2VuZCBub3RpZmljYXRpb24gdG8gdGhlIHNlcnZlci5cbiAgICAgIHRoaXMuX3Rpbm9kZS5ub3RlKHRoaXMubmFtZSwgd2hhdCwgc2VxKTtcbiAgICAgIC8vIFVwZGF0ZSBsb2NhbGx5IGNhY2hlZCBjb250YWN0IHdpdGggdGhlIG5ldyBjb3VudC5cbiAgICAgIHRoaXMuX3VwZGF0ZVJlYWRSZWN2KHdoYXQsIHNlcSk7XG5cbiAgICAgIGlmICh0aGlzLmFjcyAhPSBudWxsICYmICF0aGlzLmFjcy5pc011dGVkKCkpIHtcbiAgICAgICAgY29uc3QgbWUgPSB0aGlzLl90aW5vZGUuZ2V0TWVUb3BpYygpO1xuICAgICAgICAvLyBTZW50IGEgbm90aWZpY2F0aW9uIHRvICdtZScgbGlzdGVuZXJzLlxuICAgICAgICBtZS5fcmVmcmVzaENvbnRhY3Qod2hhdCwgdGhpcyk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIC8qKlxuICAgKiBTZW5kIGEgJ3JlY3YnIHJlY2VpcHQuIFdyYXBwZXIgZm9yIHtAbGluayBUaW5vZGUjbm90ZVJlY3Z9LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gc2VxIC0gSUQgb2YgdGhlIG1lc3NhZ2UgdG8gYWtub3dsZWRnZS5cbiAgICovXG4gIG5vdGVSZWN2KHNlcSkge1xuICAgIHRoaXMubm90ZSgncmVjdicsIHNlcSk7XG4gIH1cbiAgLyoqXG4gICAqIFNlbmQgYSAncmVhZCcgcmVjZWlwdC4gV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNub3RlUmVhZH0uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzZXEgLSBJRCBvZiB0aGUgbWVzc2FnZSB0byBha25vd2xlZGdlIG9yIDAvdW5kZWZpbmVkIHRvIGFja25vd2xlZGdlIHRoZSBsYXRlc3QgbWVzc2FnZXMuXG4gICAqL1xuICBub3RlUmVhZChzZXEpIHtcbiAgICBzZXEgPSBzZXEgfHwgdGhpcy5fbWF4U2VxO1xuICAgIGlmIChzZXEgPiAwKSB7XG4gICAgICB0aGlzLm5vdGUoJ3JlYWQnLCBzZXEpO1xuICAgIH1cbiAgfVxuICAvKipcbiAgICogU2VuZCBhIGtleS1wcmVzcyBub3RpZmljYXRpb24uIFdyYXBwZXIgZm9yIHtAbGluayBUaW5vZGUjbm90ZUtleVByZXNzfS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICovXG4gIG5vdGVLZXlQcmVzcygpIHtcbiAgICBpZiAodGhpcy5fYXR0YWNoZWQpIHtcbiAgICAgIHRoaXMuX3Rpbm9kZS5ub3RlS2V5UHJlc3ModGhpcy5uYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fdGlub2RlLmxvZ2dlcihcIklORk86IENhbm5vdCBzZW5kIG5vdGlmaWNhdGlvbiBpbiBpbmFjdGl2ZSB0b3BpY1wiKTtcbiAgICB9XG4gIH1cbiAgLy8gVXBkYXRlIGNhY2hlZCByZWFkL3JlY3YvdW5yZWFkIGNvdW50cy5cbiAgX3VwZGF0ZVJlYWRSZWN2KHdoYXQsIHNlcSwgdHMpIHtcbiAgICBsZXQgb2xkVmFsLCBkb1VwZGF0ZSA9IGZhbHNlO1xuXG4gICAgc2VxID0gc2VxIHwgMDtcbiAgICB0aGlzLnNlcSA9IHRoaXMuc2VxIHwgMDtcbiAgICB0aGlzLnJlYWQgPSB0aGlzLnJlYWQgfCAwO1xuICAgIHRoaXMucmVjdiA9IHRoaXMucmVjdiB8IDA7XG4gICAgc3dpdGNoICh3aGF0KSB7XG4gICAgICBjYXNlICdyZWN2JzpcbiAgICAgICAgb2xkVmFsID0gdGhpcy5yZWN2O1xuICAgICAgICB0aGlzLnJlY3YgPSBNYXRoLm1heCh0aGlzLnJlY3YsIHNlcSk7XG4gICAgICAgIGRvVXBkYXRlID0gKG9sZFZhbCAhPSB0aGlzLnJlY3YpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3JlYWQnOlxuICAgICAgICBvbGRWYWwgPSB0aGlzLnJlYWQ7XG4gICAgICAgIHRoaXMucmVhZCA9IE1hdGgubWF4KHRoaXMucmVhZCwgc2VxKTtcbiAgICAgICAgZG9VcGRhdGUgPSAob2xkVmFsICE9IHRoaXMucmVhZCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbXNnJzpcbiAgICAgICAgb2xkVmFsID0gdGhpcy5zZXE7XG4gICAgICAgIHRoaXMuc2VxID0gTWF0aC5tYXgodGhpcy5zZXEsIHNlcSk7XG4gICAgICAgIGlmICghdGhpcy50b3VjaGVkIHx8IHRoaXMudG91Y2hlZCA8IHRzKSB7XG4gICAgICAgICAgdGhpcy50b3VjaGVkID0gdHM7XG4gICAgICAgIH1cbiAgICAgICAgZG9VcGRhdGUgPSAob2xkVmFsICE9IHRoaXMuc2VxKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgLy8gU2FuaXR5IGNoZWNrcy5cbiAgICBpZiAodGhpcy5yZWN2IDwgdGhpcy5yZWFkKSB7XG4gICAgICB0aGlzLnJlY3YgPSB0aGlzLnJlYWQ7XG4gICAgICBkb1VwZGF0ZSA9IHRydWU7XG4gICAgfVxuICAgIGlmICh0aGlzLnNlcSA8IHRoaXMucmVjdikge1xuICAgICAgdGhpcy5zZXEgPSB0aGlzLnJlY3Y7XG4gICAgICBpZiAoIXRoaXMudG91Y2hlZCB8fCB0aGlzLnRvdWNoZWQgPCB0cykge1xuICAgICAgICB0aGlzLnRvdWNoZWQgPSB0cztcbiAgICAgIH1cbiAgICAgIGRvVXBkYXRlID0gdHJ1ZTtcbiAgICB9XG4gICAgdGhpcy51bnJlYWQgPSB0aGlzLnNlcSAtIHRoaXMucmVhZDtcbiAgICByZXR1cm4gZG9VcGRhdGU7XG4gIH1cbiAgLyoqXG4gICAqIEdldCB1c2VyIGRlc2NyaXB0aW9uIGZyb20gZ2xvYmFsIGNhY2hlLiBUaGUgdXNlciBkb2VzIG5vdCBuZWVkIHRvIGJlIGFcbiAgICogc3Vic2NyaWJlciBvZiB0aGlzIHRvcGljLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdWlkIC0gSUQgb2YgdGhlIHVzZXIgdG8gZmV0Y2guXG4gICAqIEByZXR1cm4ge09iamVjdH0gdXNlciBkZXNjcmlwdGlvbiBvciB1bmRlZmluZWQuXG4gICAqL1xuICB1c2VyRGVzYyh1aWQpIHtcbiAgICAvLyBUT0RPOiBoYW5kbGUgYXN5bmNocm9ub3VzIHJlcXVlc3RzXG4gICAgY29uc3QgdXNlciA9IHRoaXMuX2NhY2hlR2V0VXNlcih1aWQpO1xuICAgIGlmICh1c2VyKSB7XG4gICAgICByZXR1cm4gdXNlcjsgLy8gUHJvbWlzZS5yZXNvbHZlKHVzZXIpXG4gICAgfVxuICB9XG4gIC8qKlxuICAgKiBHZXQgZGVzY3JpcHRpb24gb2YgdGhlIHAycCBwZWVyIGZyb20gc3Vic2NyaXB0aW9uIGNhY2hlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcmV0dXJuIHtPYmplY3R9IHBlZXIncyBkZXNjcmlwdGlvbiBvciB1bmRlZmluZWQuXG4gICAqL1xuICBwMnBQZWVyRGVzYygpIHtcbiAgICBpZiAoIXRoaXMuaXNQMlBUeXBlKCkpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl91c2Vyc1t0aGlzLm5hbWVdO1xuICB9XG4gIC8qKlxuICAgKiBJdGVyYXRlIG92ZXIgY2FjaGVkIHN1YnNjcmliZXJzLiBJZiBjYWxsYmFjayBpcyB1bmRlZmluZWQsIHVzZSB0aGlzLm9uTWV0YVN1Yi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgLSBDYWxsYmFjayB3aGljaCB3aWxsIHJlY2VpdmUgc3Vic2NyaWJlcnMgb25lIGJ5IG9uZS5cbiAgICogQHBhcmFtIHtPYmplY3Q9fSBjb250ZXh0IC0gVmFsdWUgb2YgYHRoaXNgIGluc2lkZSB0aGUgYGNhbGxiYWNrYC5cbiAgICovXG4gIHN1YnNjcmliZXJzKGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgY29uc3QgY2IgPSAoY2FsbGJhY2sgfHwgdGhpcy5vbk1ldGFTdWIpO1xuICAgIGlmIChjYikge1xuICAgICAgZm9yIChsZXQgaWR4IGluIHRoaXMuX3VzZXJzKSB7XG4gICAgICAgIGNiLmNhbGwoY29udGV4dCwgdGhpcy5fdXNlcnNbaWR4XSwgaWR4LCB0aGlzLl91c2Vycyk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIC8qKlxuICAgKiBHZXQgYSBjb3B5IG9mIGNhY2hlZCB0YWdzLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcmV0dXJuIHtBcnJheS48c3RyaW5nPn0gYSBjb3B5IG9mIHRhZ3NcbiAgICovXG4gIHRhZ3MoKSB7XG4gICAgLy8gUmV0dXJuIGEgY29weS5cbiAgICByZXR1cm4gdGhpcy5fdGFncy5zbGljZSgwKTtcbiAgfVxuICAvKipcbiAgICogR2V0IGNhY2hlZCBzdWJzY3JpcHRpb24gZm9yIHRoZSBnaXZlbiB1c2VyIElELlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdWlkIC0gaWQgb2YgdGhlIHVzZXIgdG8gcXVlcnkgZm9yXG4gICAqIEByZXR1cm4gdXNlciBkZXNjcmlwdGlvbiBvciB1bmRlZmluZWQuXG4gICAqL1xuICBzdWJzY3JpYmVyKHVpZCkge1xuICAgIHJldHVybiB0aGlzLl91c2Vyc1t1aWRdO1xuICB9XG4gIC8qKlxuICAgKiBJdGVyYXRlIG92ZXIgY2FjaGVkIG1lc3NhZ2VzOiBjYWxsIDxjb2RlPmNhbGxiYWNrPC9jb2RlPiBmb3IgZWFjaCBtZXNzYWdlIGluIHRoZSByYW5nZSBbc2luZGVJZHgsIGJlZm9yZUlkeCkuXG4gICAqIElmIDxjb2RlPmNhbGxiYWNrPC9jb2RlPiBpcyB1bmRlZmluZWQsIHVzZSA8Y29kZT50aGlzLm9uRGF0YTwvY29kZT4uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7VGlub2RlLkZvckVhY2hDYWxsYmFja1R5cGV9IGNhbGxiYWNrIC0gQ2FsbGJhY2sgd2hpY2ggd2lsbCByZWNlaXZlIG1lc3NhZ2VzIG9uZSBieSBvbmUuIFNlZSB7QGxpbmsgVGlub2RlLkNCdWZmZXIjZm9yRWFjaH1cbiAgICogQHBhcmFtIHtudW1iZXJ9IHNpbmNlSWQgLSBPcHRpb25hbCBzZXFJZCB0byBzdGFydCBpdGVyYXRpbmcgZnJvbSAoaW5jbHVzaXZlKS5cbiAgICogQHBhcmFtIHtudW1iZXJ9IGJlZm9yZUlkIC0gT3B0aW9uYWwgc2VxSWQgdG8gc3RvcCBpdGVyYXRpbmcgYmVmb3JlIGl0IGlzIHJlYWNoZWQgKGV4Y2x1c2l2ZSkuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZXh0IC0gVmFsdWUgb2YgYHRoaXNgIGluc2lkZSB0aGUgYGNhbGxiYWNrYC5cbiAgICovXG4gIG1lc3NhZ2VzKGNhbGxiYWNrLCBzaW5jZUlkLCBiZWZvcmVJZCwgY29udGV4dCkge1xuICAgIGNvbnN0IGNiID0gKGNhbGxiYWNrIHx8IHRoaXMub25EYXRhKTtcbiAgICBpZiAoY2IpIHtcbiAgICAgIGNvbnN0IHN0YXJ0SWR4ID0gdHlwZW9mIHNpbmNlSWQgPT0gJ251bWJlcicgPyB0aGlzLl9tZXNzYWdlcy5maW5kKHtcbiAgICAgICAgc2VxOiBzaW5jZUlkXG4gICAgICB9LCB0cnVlKSA6IHVuZGVmaW5lZDtcbiAgICAgIGNvbnN0IGJlZm9yZUlkeCA9IHR5cGVvZiBiZWZvcmVJZCA9PSAnbnVtYmVyJyA/IHRoaXMuX21lc3NhZ2VzLmZpbmQoe1xuICAgICAgICBzZXE6IGJlZm9yZUlkXG4gICAgICB9LCB0cnVlKSA6IHVuZGVmaW5lZDtcbiAgICAgIGlmIChzdGFydElkeCAhPSAtMSAmJiBiZWZvcmVJZHggIT0gLTEpIHtcbiAgICAgICAgdGhpcy5fbWVzc2FnZXMuZm9yRWFjaChjYiwgc3RhcnRJZHgsIGJlZm9yZUlkeCwgY29udGV4dCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIC8qKlxuICAgKiBHZXQgdGhlIG1lc3NhZ2UgZnJvbSBjYWNoZSBieSA8Y29kZT5zZXE8L2NvZGU+LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gc2VxIC0gbWVzc2FnZSBzZXFJZCB0byBzZWFyY2ggZm9yLlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSB0aGUgbWVzc2FnZSB3aXRoIHRoZSBnaXZlbiA8Y29kZT5zZXE8L2NvZGU+IG9yIDxjb2RlPnVuZGVmaW5lZDwvY29kZT4sIGlmIG5vIHN1Y2ggbWVzc2FnZSBpcyBmb3VuZC5cbiAgICovXG4gIGZpbmRNZXNzYWdlKHNlcSkge1xuICAgIGNvbnN0IGlkeCA9IHRoaXMuX21lc3NhZ2VzLmZpbmQoe1xuICAgICAgc2VxOiBzZXFcbiAgICB9KTtcbiAgICBpZiAoaWR4ID49IDApIHtcbiAgICAgIHJldHVybiB0aGlzLl9tZXNzYWdlcy5nZXRBdChpZHgpO1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG4gIC8qKlxuICAgKiBHZXQgdGhlIG1vc3QgcmVjZW50IG1lc3NhZ2UgZnJvbSBjYWNoZS4gVGhpcyBtZXRob2QgY291bnRzIGFsbCBtZXNzYWdlcywgaW5jbHVkaW5nIGRlbGV0ZWQgcmFuZ2VzLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlbn0gc2tpcERlbGV0ZWQgLSBpZiB0aGUgbGFzdCBtZXNzYWdlIGlzIGEgZGVsZXRlZCByYW5nZSwgZ2V0IHRoZSBvbmUgYmVmb3JlIGl0LlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSB0aGUgbW9zdCByZWNlbnQgY2FjaGVkIG1lc3NhZ2Ugb3IgPGNvZGU+dW5kZWZpbmVkPC9jb2RlPiwgaWYgbm8gbWVzc2FnZXMgYXJlIGNhY2hlZC5cbiAgICovXG4gIGxhdGVzdE1lc3NhZ2Uoc2tpcERlbGV0ZWQpIHtcbiAgICBjb25zdCBtc2cgPSB0aGlzLl9tZXNzYWdlcy5nZXRMYXN0KCk7XG4gICAgaWYgKCFza2lwRGVsZXRlZCB8fCAhbXNnIHx8IG1zZy5fc3RhdHVzICE9IENvbnN0Lk1FU1NBR0VfU1RBVFVTX0RFTF9SQU5HRSkge1xuICAgICAgcmV0dXJuIG1zZztcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX21lc3NhZ2VzLmdldExhc3QoMSk7XG4gIH1cbiAgLyoqXG4gICAqIEdldCB0aGUgbWF4aW11bSBjYWNoZWQgc2VxIElELlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSB0aGUgZ3JlYXRlc3Qgc2VxIElEIGluIGNhY2hlLlxuICAgKi9cbiAgbWF4TXNnU2VxKCkge1xuICAgIHJldHVybiB0aGlzLl9tYXhTZXE7XG4gIH1cbiAgLyoqXG4gICAqIEdldCB0aGUgbWF4aW11bSBkZWxldGlvbiBJRC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHJldHVybnMge251bWJlcn0gdGhlIGdyZWF0ZXN0IGRlbGV0aW9uIElELlxuICAgKi9cbiAgbWF4Q2xlYXJJZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fbWF4RGVsO1xuICB9XG4gIC8qKlxuICAgKiBHZXQgdGhlIG51bWJlciBvZiBtZXNzYWdlcyBpbiB0aGUgY2FjaGUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IGNvdW50IG9mIGNhY2hlZCBtZXNzYWdlcy5cbiAgICovXG4gIG1lc3NhZ2VDb3VudCgpIHtcbiAgICByZXR1cm4gdGhpcy5fbWVzc2FnZXMubGVuZ3RoKCk7XG4gIH1cbiAgLyoqXG4gICAqIEl0ZXJhdGUgb3ZlciBjYWNoZWQgdW5zZW50IG1lc3NhZ2VzLiBXcmFwcyB7QGxpbmsgVGlub2RlLlRvcGljI21lc3NhZ2VzfS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgLSBDYWxsYmFjayB3aGljaCB3aWxsIHJlY2VpdmUgbWVzc2FnZXMgb25lIGJ5IG9uZS4gU2VlIHtAbGluayBUaW5vZGUuQ0J1ZmZlciNmb3JFYWNofVxuICAgKiBAcGFyYW0ge09iamVjdH0gY29udGV4dCAtIFZhbHVlIG9mIDxjb2RlPnRoaXM8L2NvZGU+IGluc2lkZSB0aGUgPGNvZGU+Y2FsbGJhY2s8L2NvZGU+LlxuICAgKi9cbiAgcXVldWVkTWVzc2FnZXMoY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICBpZiAoIWNhbGxiYWNrKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYWxsYmFjayBtdXN0IGJlIHByb3ZpZGVkXCIpO1xuICAgIH1cbiAgICB0aGlzLm1lc3NhZ2VzKGNhbGxiYWNrLCBDb25zdC5MT0NBTF9TRVFJRCwgdW5kZWZpbmVkLCBjb250ZXh0KTtcbiAgfVxuICAvKipcbiAgICogR2V0IHRoZSBudW1iZXIgb2YgdG9waWMgc3Vic2NyaWJlcnMgd2hvIG1hcmtlZCB0aGlzIG1lc3NhZ2UgYXMgZWl0aGVyIHJlY3Ygb3IgcmVhZFxuICAgKiBDdXJyZW50IHVzZXIgaXMgZXhjbHVkZWQgZnJvbSB0aGUgY291bnQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB3aGF0IC0gd2hhdCBhY3Rpb24gdG8gY29uc2lkZXI6IHJlY2VpdmVkIDxjb2RlPlwicmVjdlwiPC9jb2RlPiBvciByZWFkIDxjb2RlPlwicmVhZFwiPC9jb2RlPi5cbiAgICogQHBhcmFtIHtudW1iZXJ9IHNlcSAtIElEIG9yIHRoZSBtZXNzYWdlIHJlYWQgb3IgcmVjZWl2ZWQuXG4gICAqXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IHRoZSBudW1iZXIgb2Ygc3Vic2NyaWJlcnMgd2hvIG1hcmtlZCB0aGUgbWVzc2FnZSB3aXRoIHRoZSBnaXZlbiBJRCBhcyByZWFkIG9yIHJlY2VpdmVkLlxuICAgKi9cbiAgbXNnUmVjZWlwdENvdW50KHdoYXQsIHNlcSkge1xuICAgIGxldCBjb3VudCA9IDA7XG4gICAgaWYgKHNlcSA+IDApIHtcbiAgICAgIGNvbnN0IG1lID0gdGhpcy5fdGlub2RlLmdldEN1cnJlbnRVc2VySUQoKTtcbiAgICAgIGZvciAobGV0IGlkeCBpbiB0aGlzLl91c2Vycykge1xuICAgICAgICBjb25zdCB1c2VyID0gdGhpcy5fdXNlcnNbaWR4XTtcbiAgICAgICAgaWYgKHVzZXIudXNlciAhPT0gbWUgJiYgdXNlclt3aGF0XSA+PSBzZXEpIHtcbiAgICAgICAgICBjb3VudCsrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjb3VudDtcbiAgfVxuICAvKipcbiAgICogR2V0IHRoZSBudW1iZXIgb2YgdG9waWMgc3Vic2NyaWJlcnMgd2hvIG1hcmtlZCB0aGlzIG1lc3NhZ2UgKGFuZCBhbGwgb2xkZXIgbWVzc2FnZXMpIGFzIHJlYWQuXG4gICAqIFRoZSBjdXJyZW50IHVzZXIgaXMgZXhjbHVkZWQgZnJvbSB0aGUgY291bnQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzZXEgLSBtZXNzYWdlIGlkIHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSBudW1iZXIgb2Ygc3Vic2NyaWJlcnMgd2hvIGNsYWltIHRvIGhhdmUgcmVjZWl2ZWQgdGhlIG1lc3NhZ2UuXG4gICAqL1xuICBtc2dSZWFkQ291bnQoc2VxKSB7XG4gICAgcmV0dXJuIHRoaXMubXNnUmVjZWlwdENvdW50KCdyZWFkJywgc2VxKTtcbiAgfVxuICAvKipcbiAgICogR2V0IHRoZSBudW1iZXIgb2YgdG9waWMgc3Vic2NyaWJlcnMgd2hvIG1hcmtlZCB0aGlzIG1lc3NhZ2UgKGFuZCBhbGwgb2xkZXIgbWVzc2FnZXMpIGFzIHJlY2VpdmVkLlxuICAgKiBUaGUgY3VycmVudCB1c2VyIGlzIGV4Y2x1ZGVkIGZyb20gdGhlIGNvdW50LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gc2VxIC0gTWVzc2FnZSBpZCB0byBjaGVjay5cbiAgICogQHJldHVybnMge251bWJlcn0gTnVtYmVyIG9mIHN1YnNjcmliZXJzIHdobyBjbGFpbSB0byBoYXZlIHJlY2VpdmVkIHRoZSBtZXNzYWdlLlxuICAgKi9cbiAgbXNnUmVjdkNvdW50KHNlcSkge1xuICAgIHJldHVybiB0aGlzLm1zZ1JlY2VpcHRDb3VudCgncmVjdicsIHNlcSk7XG4gIH1cbiAgLyoqXG4gICAqIENoZWNrIGlmIGNhY2hlZCBtZXNzYWdlIElEcyBpbmRpY2F0ZSB0aGF0IHRoZSBzZXJ2ZXIgbWF5IGhhdmUgbW9yZSBtZXNzYWdlcy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSBuZXdlciAtIGlmIDxjb2RlPnRydWU8L2NvZGU+LCBjaGVjayBmb3IgbmV3ZXIgbWVzc2FnZXMgb25seS5cbiAgICovXG4gIG1zZ0hhc01vcmVNZXNzYWdlcyhuZXdlcikge1xuICAgIHJldHVybiBuZXdlciA/IHRoaXMuc2VxID4gdGhpcy5fbWF4U2VxIDpcbiAgICAgIC8vIF9taW5TZXEgY291bGQgYmUgbW9yZSB0aGFuIDEsIGJ1dCBlYXJsaWVyIG1lc3NhZ2VzIGNvdWxkIGhhdmUgYmVlbiBkZWxldGVkLlxuICAgICAgKHRoaXMuX21pblNlcSA+IDEgJiYgIXRoaXMuX25vRWFybGllck1zZ3MpO1xuICB9XG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgZ2l2ZW4gc2VxIElkIGlzIGlkIG9mIHRoZSBtb3N0IHJlY2VudCBtZXNzYWdlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gc2VxSWQgaWQgb2YgdGhlIG1lc3NhZ2UgdG8gY2hlY2tcbiAgICovXG4gIGlzTmV3TWVzc2FnZShzZXFJZCkge1xuICAgIHJldHVybiB0aGlzLl9tYXhTZXEgPD0gc2VxSWQ7XG4gIH1cbiAgLyoqXG4gICAqIFJlbW92ZSBvbmUgbWVzc2FnZSBmcm9tIGxvY2FsIGNhY2hlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gc2VxSWQgaWQgb2YgdGhlIG1lc3NhZ2UgdG8gcmVtb3ZlIGZyb20gY2FjaGUuXG4gICAqIEByZXR1cm5zIHtNZXNzYWdlfSByZW1vdmVkIG1lc3NhZ2Ugb3IgdW5kZWZpbmVkIGlmIHN1Y2ggbWVzc2FnZSB3YXMgbm90IGZvdW5kLlxuICAgKi9cbiAgZmx1c2hNZXNzYWdlKHNlcUlkKSB7XG4gICAgY29uc3QgaWR4ID0gdGhpcy5fbWVzc2FnZXMuZmluZCh7XG4gICAgICBzZXE6IHNlcUlkXG4gICAgfSk7XG4gICAgaWYgKGlkeCA+PSAwKSB7XG4gICAgICB0aGlzLl90aW5vZGUuX2RiLnJlbU1lc3NhZ2VzKHRoaXMubmFtZSwgc2VxSWQpO1xuICAgICAgcmV0dXJuIHRoaXMuX21lc3NhZ2VzLmRlbEF0KGlkeCk7XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgLyoqXG4gICAqIFVwZGF0ZSBtZXNzYWdlJ3Mgc2VxSWQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwdWIgbWVzc2FnZSBvYmplY3QuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBuZXdTZXFJZCBuZXcgc2VxIGlkIGZvciBwdWIuXG4gICAqL1xuICBzd2FwTWVzc2FnZUlkKHB1YiwgbmV3U2VxSWQpIHtcbiAgICBjb25zdCBpZHggPSB0aGlzLl9tZXNzYWdlcy5maW5kKHB1Yik7XG4gICAgY29uc3QgbnVtTWVzc2FnZXMgPSB0aGlzLl9tZXNzYWdlcy5sZW5ndGgoKTtcbiAgICBpZiAoMCA8PSBpZHggJiYgaWR4IDwgbnVtTWVzc2FnZXMpIHtcbiAgICAgIC8vIFJlbW92ZSBtZXNzYWdlIHdpdGggdGhlIG9sZCBzZXEgSUQuXG4gICAgICB0aGlzLl9tZXNzYWdlcy5kZWxBdChpZHgpO1xuICAgICAgdGhpcy5fdGlub2RlLl9kYi5yZW1NZXNzYWdlcyh0aGlzLm5hbWUsIHB1Yi5zZXEpO1xuICAgICAgLy8gQWRkIG1lc3NhZ2Ugd2l0aCB0aGUgbmV3IHNlcSBJRC5cbiAgICAgIHB1Yi5zZXEgPSBuZXdTZXFJZDtcbiAgICAgIHRoaXMuX21lc3NhZ2VzLnB1dChwdWIpO1xuICAgICAgdGhpcy5fdGlub2RlLl9kYi5hZGRNZXNzYWdlKHB1Yik7XG4gICAgfVxuICB9XG4gIC8qKlxuICAgKiBSZW1vdmUgYSByYW5nZSBvZiBtZXNzYWdlcyBmcm9tIHRoZSBsb2NhbCBjYWNoZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IGZyb21JZCBzZXEgSUQgb2YgdGhlIGZpcnN0IG1lc3NhZ2UgdG8gcmVtb3ZlIChpbmNsdXNpdmUpLlxuICAgKiBAcGFyYW0ge251bWJlcn0gdW50aWxJZCBzZXFJRCBvZiB0aGUgbGFzdCBtZXNzYWdlIHRvIHJlbW92ZSAoZXhjbHVzaXZlKS5cbiAgICpcbiAgICogQHJldHVybnMge01lc3NhZ2VbXX0gYXJyYXkgb2YgcmVtb3ZlZCBtZXNzYWdlcyAoY291bGQgYmUgZW1wdHkpLlxuICAgKi9cbiAgZmx1c2hNZXNzYWdlUmFuZ2UoZnJvbUlkLCB1bnRpbElkKSB7XG4gICAgLy8gUmVtb3ZlIHJhbmdlIGZyb20gcGVyc2lzdGVudCBjYWNoZS5cbiAgICB0aGlzLl90aW5vZGUuX2RiLnJlbU1lc3NhZ2VzKHRoaXMubmFtZSwgZnJvbUlkLCB1bnRpbElkKTtcbiAgICAvLyBzdGFydCwgZW5kOiBmaW5kIGluc2VydGlvbiBwb2ludHMgKG5lYXJlc3QgPT0gdHJ1ZSkuXG4gICAgY29uc3Qgc2luY2UgPSB0aGlzLl9tZXNzYWdlcy5maW5kKHtcbiAgICAgIHNlcTogZnJvbUlkXG4gICAgfSwgdHJ1ZSk7XG4gICAgcmV0dXJuIHNpbmNlID49IDAgPyB0aGlzLl9tZXNzYWdlcy5kZWxSYW5nZShzaW5jZSwgdGhpcy5fbWVzc2FnZXMuZmluZCh7XG4gICAgICBzZXE6IHVudGlsSWRcbiAgICB9LCB0cnVlKSkgOiBbXTtcbiAgfVxuICAvKipcbiAgICogQXR0ZW1wdCB0byBzdG9wIG1lc3NhZ2UgZnJvbSBiZWluZyBzZW50LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gc2VxSWQgaWQgb2YgdGhlIG1lc3NhZ2UgdG8gc3RvcCBzZW5kaW5nIGFuZCByZW1vdmUgZnJvbSBjYWNoZS5cbiAgICpcbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIG1lc3NhZ2Ugd2FzIGNhbmNlbGxlZCwgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIGNhbmNlbFNlbmQoc2VxSWQpIHtcbiAgICBjb25zdCBpZHggPSB0aGlzLl9tZXNzYWdlcy5maW5kKHtcbiAgICAgIHNlcTogc2VxSWRcbiAgICB9KTtcbiAgICBpZiAoaWR4ID49IDApIHtcbiAgICAgIGNvbnN0IG1zZyA9IHRoaXMuX21lc3NhZ2VzLmdldEF0KGlkeCk7XG4gICAgICBjb25zdCBzdGF0dXMgPSB0aGlzLm1zZ1N0YXR1cyhtc2cpO1xuICAgICAgaWYgKHN0YXR1cyA9PSBDb25zdC5NRVNTQUdFX1NUQVRVU19RVUVVRUQgfHwgc3RhdHVzID09IENvbnN0Lk1FU1NBR0VfU1RBVFVTX0ZBSUxFRCkge1xuICAgICAgICB0aGlzLl90aW5vZGUuX2RiLnJlbU1lc3NhZ2VzKHRoaXMubmFtZSwgc2VxSWQpO1xuICAgICAgICBtc2cuX2NhbmNlbGxlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuX21lc3NhZ2VzLmRlbEF0KGlkeCk7XG4gICAgICAgIGlmICh0aGlzLm9uRGF0YSkge1xuICAgICAgICAgIC8vIENhbGxpbmcgd2l0aCBubyBwYXJhbWV0ZXJzIHRvIGluZGljYXRlIHRoZSBtZXNzYWdlIHdhcyBkZWxldGVkLlxuICAgICAgICAgIHRoaXMub25EYXRhKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICAvKipcbiAgICogR2V0IHR5cGUgb2YgdGhlIHRvcGljOiBtZSwgcDJwLCBncnAsIGZuZC4uLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBPbmUgb2YgJ21lJywgJ3AycCcsICdncnAnLCAnZm5kJywgJ3N5cycgb3IgPGNvZGU+dW5kZWZpbmVkPC9jb2RlPi5cbiAgICovXG4gIGdldFR5cGUoKSB7XG4gICAgcmV0dXJuIFRvcGljLnRvcGljVHlwZSh0aGlzLm5hbWUpO1xuICB9XG4gIC8qKlxuICAgKiBHZXQgY3VycmVudCB1c2VyJ3MgYWNjZXNzIG1vZGUgb2YgdGhlIHRvcGljLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLkFjY2Vzc01vZGV9IC0gdXNlcidzIGFjY2VzcyBtb2RlXG4gICAqL1xuICBnZXRBY2Nlc3NNb2RlKCkge1xuICAgIHJldHVybiB0aGlzLmFjcztcbiAgfVxuICAvKipcbiAgICogU2V0IGN1cnJlbnQgdXNlcidzIGFjY2VzcyBtb2RlIG9mIHRoZSB0b3BpYy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtBY2Nlc3NNb2RlIHwgT2JqZWN0fSBhY3MgLSBhY2Nlc3MgbW9kZSB0byBzZXQuXG4gICAqL1xuICBzZXRBY2Nlc3NNb2RlKGFjcykge1xuICAgIHJldHVybiB0aGlzLmFjcyA9IG5ldyBBY2Nlc3NNb2RlKGFjcyk7XG4gIH1cbiAgLyoqXG4gICAqIEdldCB0b3BpYydzIGRlZmF1bHQgYWNjZXNzIG1vZGUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuRGVmQWNzfSAtIGFjY2VzcyBtb2RlLCBzdWNoIGFzIHthdXRoOiBgUldQYCwgYW5vbjogYE5gfS5cbiAgICovXG4gIGdldERlZmF1bHRBY2Nlc3MoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGVmYWNzO1xuICB9XG4gIC8qKlxuICAgKiBJbml0aWFsaXplIG5ldyBtZXRhIHtAbGluayBUaW5vZGUuR2V0UXVlcnl9IGJ1aWxkZXIuIFRoZSBxdWVyeSBpcyBhdHRjaGVkIHRvIHRoZSBjdXJyZW50IHRvcGljLlxuICAgKiBJdCB3aWxsIG5vdCB3b3JrIGNvcnJlY3RseSBpZiB1c2VkIHdpdGggYSBkaWZmZXJlbnQgdG9waWMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuTWV0YUdldEJ1aWxkZXJ9IHF1ZXJ5IGF0dGFjaGVkIHRvIHRoZSBjdXJyZW50IHRvcGljLlxuICAgKi9cbiAgc3RhcnRNZXRhUXVlcnkoKSB7XG4gICAgcmV0dXJuIG5ldyBNZXRhR2V0QnVpbGRlcih0aGlzKTtcbiAgfVxuICAvKipcbiAgICogQ2hlY2sgaWYgdG9waWMgaXMgYXJjaGl2ZWQsIGkuZS4gcHJpdmF0ZS5hcmNoID09IHRydWUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIDxjb2RlPnRydWU8L2NvZGU+IGlmIHRvcGljIGlzIGFyY2hpdmVkLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgaXNBcmNoaXZlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5wcml2YXRlICYmICEhdGhpcy5wcml2YXRlLmFyY2g7XG4gIH1cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRvcGljIGlzIGEgJ21lJyB0b3BpYy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHJldHVybnMge2Jvb2xlYW59IC0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgdG9waWMgaXMgYSAnbWUnIHRvcGljLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgaXNNZVR5cGUoKSB7XG4gICAgcmV0dXJuIFRvcGljLmlzTWVUb3BpY05hbWUodGhpcy5uYW1lKTtcbiAgfVxuICAvKipcbiAgICogQ2hlY2sgaWYgdG9waWMgaXMgYSBjaGFubmVsLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0b3BpYyBpcyBhIGNoYW5uZWwsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBpc0NoYW5uZWxUeXBlKCkge1xuICAgIHJldHVybiBUb3BpYy5pc0NoYW5uZWxUb3BpY05hbWUodGhpcy5uYW1lKTtcbiAgfVxuICAvKipcbiAgICogQ2hlY2sgaWYgdG9waWMgaXMgYSBncm91cCB0b3BpYy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHJldHVybnMge2Jvb2xlYW59IC0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgdG9waWMgaXMgYSBncm91cCwgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIGlzR3JvdXBUeXBlKCkge1xuICAgIHJldHVybiBUb3BpYy5pc0dyb3VwVG9waWNOYW1lKHRoaXMubmFtZSk7XG4gIH1cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRvcGljIGlzIGEgcDJwIHRvcGljLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0b3BpYyBpcyBhIHAycCB0b3BpYywgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIGlzUDJQVHlwZSgpIHtcbiAgICByZXR1cm4gVG9waWMuaXNQMlBUb3BpY05hbWUodGhpcy5uYW1lKTtcbiAgfVxuICAvKipcbiAgICogQ2hlY2sgaWYgdG9waWMgaXMgYSBjb21tdW5pY2F0aW9uIHRvcGljLCBpLmUuIGEgZ3JvdXAgb3IgcDJwIHRvcGljLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0b3BpYyBpcyBhIHAycCBvciBncm91cCB0b3BpYywgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIGlzQ29tbVR5cGUoKSB7XG4gICAgcmV0dXJuIFRvcGljLmlzQ29tbVRvcGljTmFtZSh0aGlzLm5hbWUpO1xuICB9XG4gIC8qKlxuICAgKiBHZXQgc3RhdHVzIChxdWV1ZWQsIHNlbnQsIHJlY2VpdmVkIGV0Yykgb2YgYSBnaXZlbiBtZXNzYWdlIGluIHRoZSBjb250ZXh0XG4gICAqIG9mIHRoaXMgdG9waWMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7TWVzc2FnZX0gbXNnIC0gbWVzc2FnZSB0byBjaGVjayBmb3Igc3RhdHVzLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHVwZCAtIHVwZGF0ZSBjaGFjaGVkIG1lc3NhZ2Ugc3RhdHVzLlxuICAgKlxuICAgKiBAcmV0dXJucyBtZXNzYWdlIHN0YXR1cyBjb25zdGFudC5cbiAgICovXG4gIG1zZ1N0YXR1cyhtc2csIHVwZCkge1xuICAgIGxldCBzdGF0dXMgPSBDb25zdC5NRVNTQUdFX1NUQVRVU19OT05FO1xuICAgIGlmICh0aGlzLl90aW5vZGUuaXNNZShtc2cuZnJvbSkpIHtcbiAgICAgIGlmIChtc2cuX3NlbmRpbmcpIHtcbiAgICAgICAgc3RhdHVzID0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfU0VORElORztcbiAgICAgIH0gZWxzZSBpZiAobXNnLl9mYWlsZWQgfHwgbXNnLl9jYW5jZWxsZWQpIHtcbiAgICAgICAgc3RhdHVzID0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfRkFJTEVEO1xuICAgICAgfSBlbHNlIGlmIChtc2cuc2VxID49IENvbnN0LkxPQ0FMX1NFUUlEKSB7XG4gICAgICAgIHN0YXR1cyA9IENvbnN0Lk1FU1NBR0VfU1RBVFVTX1FVRVVFRDtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5tc2dSZWFkQ291bnQobXNnLnNlcSkgPiAwKSB7XG4gICAgICAgIHN0YXR1cyA9IENvbnN0Lk1FU1NBR0VfU1RBVFVTX1JFQUQ7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMubXNnUmVjdkNvdW50KG1zZy5zZXEpID4gMCkge1xuICAgICAgICBzdGF0dXMgPSBDb25zdC5NRVNTQUdFX1NUQVRVU19SRUNFSVZFRDtcbiAgICAgIH0gZWxzZSBpZiAobXNnLnNlcSA+IDApIHtcbiAgICAgICAgc3RhdHVzID0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfU0VOVDtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG1zZy5fc3RhdHVzID09IENvbnN0Lk1FU1NBR0VfU1RBVFVTX0RFTF9SQU5HRSkge1xuICAgICAgc3RhdHVzID09IENvbnN0Lk1FU1NBR0VfU1RBVFVTX0RFTF9SQU5HRTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RhdHVzID0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfVE9fTUU7XG4gICAgfVxuXG4gICAgaWYgKHVwZCAmJiBtc2cuX3N0YXR1cyAhPSBzdGF0dXMpIHtcbiAgICAgIG1zZy5fc3RhdHVzID0gc3RhdHVzO1xuICAgICAgdGhpcy5fdGlub2RlLl9kYi51cGRNZXNzYWdlU3RhdHVzKHRoaXMubmFtZSwgbXNnLnNlcSwgc3RhdHVzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc3RhdHVzO1xuICB9XG4gIC8vIFByb2Nlc3MgZGF0YSBtZXNzYWdlXG4gIF9yb3V0ZURhdGEoZGF0YSkge1xuICAgIGlmIChkYXRhLmNvbnRlbnQpIHtcbiAgICAgIGlmICghdGhpcy50b3VjaGVkIHx8IHRoaXMudG91Y2hlZCA8IGRhdGEudHMpIHtcbiAgICAgICAgdGhpcy50b3VjaGVkID0gZGF0YS50cztcbiAgICAgICAgdGhpcy5fdGlub2RlLl9kYi51cGRUb3BpYyh0aGlzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZGF0YS5zZXEgPiB0aGlzLl9tYXhTZXEpIHtcbiAgICAgIHRoaXMuX21heFNlcSA9IGRhdGEuc2VxO1xuICAgIH1cbiAgICBpZiAoZGF0YS5zZXEgPCB0aGlzLl9taW5TZXEgfHwgdGhpcy5fbWluU2VxID09IDApIHtcbiAgICAgIHRoaXMuX21pblNlcSA9IGRhdGEuc2VxO1xuICAgIH1cblxuICAgIGlmICghZGF0YS5fbm9Gb3J3YXJkaW5nKSB7XG4gICAgICB0aGlzLl9tZXNzYWdlcy5wdXQoZGF0YSk7XG4gICAgICB0aGlzLl90aW5vZGUuX2RiLmFkZE1lc3NhZ2UoZGF0YSk7XG4gICAgICB0aGlzLl91cGRhdGVEZWxldGVkUmFuZ2VzKCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMub25EYXRhKSB7XG4gICAgICB0aGlzLm9uRGF0YShkYXRhKTtcbiAgICB9XG5cbiAgICAvLyBVcGRhdGUgbG9jYWxseSBjYWNoZWQgY29udGFjdCB3aXRoIHRoZSBuZXcgbWVzc2FnZSBjb3VudC5cbiAgICBjb25zdCB3aGF0ID0gKCghdGhpcy5pc0NoYW5uZWxUeXBlKCkgJiYgIWRhdGEuZnJvbSkgfHwgdGhpcy5fdGlub2RlLmlzTWUoZGF0YS5mcm9tKSkgPyAncmVhZCcgOiAnbXNnJztcbiAgICB0aGlzLl91cGRhdGVSZWFkUmVjdih3aGF0LCBkYXRhLnNlcSwgZGF0YS50cyk7XG4gICAgLy8gTm90aWZ5ICdtZScgbGlzdGVuZXJzIG9mIHRoZSBjaGFuZ2UuXG4gICAgdGhpcy5fdGlub2RlLmdldE1lVG9waWMoKS5fcmVmcmVzaENvbnRhY3Qod2hhdCwgdGhpcyk7XG4gIH1cbiAgLy8gUHJvY2VzcyBtZXRhZGF0YSBtZXNzYWdlXG4gIF9yb3V0ZU1ldGEobWV0YSkge1xuICAgIGlmIChtZXRhLmRlc2MpIHtcbiAgICAgIHRoaXMuX3Byb2Nlc3NNZXRhRGVzYyhtZXRhLmRlc2MpO1xuICAgIH1cbiAgICBpZiAobWV0YS5zdWIgJiYgbWV0YS5zdWIubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5fcHJvY2Vzc01ldGFTdWIobWV0YS5zdWIpO1xuICAgIH1cbiAgICBpZiAobWV0YS5kZWwpIHtcbiAgICAgIHRoaXMuX3Byb2Nlc3NEZWxNZXNzYWdlcyhtZXRhLmRlbC5jbGVhciwgbWV0YS5kZWwuZGVsc2VxKTtcbiAgICB9XG4gICAgaWYgKG1ldGEudGFncykge1xuICAgICAgdGhpcy5fcHJvY2Vzc01ldGFUYWdzKG1ldGEudGFncyk7XG4gICAgfVxuICAgIGlmIChtZXRhLmNyZWQpIHtcbiAgICAgIHRoaXMuX3Byb2Nlc3NNZXRhQ3JlZHMobWV0YS5jcmVkKTtcbiAgICB9XG4gICAgaWYgKHRoaXMub25NZXRhKSB7XG4gICAgICB0aGlzLm9uTWV0YShtZXRhKTtcbiAgICB9XG4gIH1cbiAgLy8gUHJvY2VzcyBwcmVzZW5jZSBjaGFuZ2UgbWVzc2FnZVxuICBfcm91dGVQcmVzKHByZXMpIHtcbiAgICBsZXQgdXNlciwgdWlkO1xuICAgIHN3aXRjaCAocHJlcy53aGF0KSB7XG4gICAgICBjYXNlICdkZWwnOlxuICAgICAgICAvLyBEZWxldGUgY2FjaGVkIG1lc3NhZ2VzLlxuICAgICAgICB0aGlzLl9wcm9jZXNzRGVsTWVzc2FnZXMocHJlcy5jbGVhciwgcHJlcy5kZWxzZXEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ29uJzpcbiAgICAgIGNhc2UgJ29mZic6XG4gICAgICAgIC8vIFVwZGF0ZSBvbmxpbmUgc3RhdHVzIG9mIGEgc3Vic2NyaXB0aW9uLlxuICAgICAgICB1c2VyID0gdGhpcy5fdXNlcnNbcHJlcy5zcmNdO1xuICAgICAgICBpZiAodXNlcikge1xuICAgICAgICAgIHVzZXIub25saW5lID0gcHJlcy53aGF0ID09ICdvbic7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fdGlub2RlLmxvZ2dlcihcIldBUk5JTkc6IFByZXNlbmNlIHVwZGF0ZSBmb3IgYW4gdW5rbm93biB1c2VyXCIsIHRoaXMubmFtZSwgcHJlcy5zcmMpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAndGVybSc6XG4gICAgICAgIC8vIEF0dGFjaG1lbnQgdG8gdG9waWMgaXMgdGVybWluYXRlZCBwcm9iYWJseSBkdWUgdG8gY2x1c3RlciByZWhhc2hpbmcuXG4gICAgICAgIHRoaXMuX3Jlc2V0U3ViKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAndXBkJzpcbiAgICAgICAgLy8gQSB0b3BpYyBzdWJzY3JpYmVyIGhhcyB1cGRhdGVkIGhpcyBkZXNjcmlwdGlvbi5cbiAgICAgICAgLy8gSXNzdWUge2dldCBzdWJ9IG9ubHkgaWYgdGhlIGN1cnJlbnQgdXNlciBoYXMgbm8gcDJwIHRvcGljcyB3aXRoIHRoZSB1cGRhdGVkIHVzZXIgKHAycCBuYW1lIGlzIG5vdCBpbiBjYWNoZSkuXG4gICAgICAgIC8vIE90aGVyd2lzZSAnbWUnIHdpbGwgaXNzdWUgYSB7Z2V0IGRlc2N9IHJlcXVlc3QuXG4gICAgICAgIGlmIChwcmVzLnNyYyAmJiAhdGhpcy5fdGlub2RlLmlzVG9waWNDYWNoZWQocHJlcy5zcmMpKSB7XG4gICAgICAgICAgdGhpcy5nZXRNZXRhKHRoaXMuc3RhcnRNZXRhUXVlcnkoKS53aXRoTGF0ZXJPbmVTdWIocHJlcy5zcmMpLmJ1aWxkKCkpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnYWNzJzpcbiAgICAgICAgdWlkID0gcHJlcy5zcmMgfHwgdGhpcy5fdGlub2RlLmdldEN1cnJlbnRVc2VySUQoKTtcbiAgICAgICAgdXNlciA9IHRoaXMuX3VzZXJzW3VpZF07XG4gICAgICAgIGlmICghdXNlcikge1xuICAgICAgICAgIC8vIFVwZGF0ZSBmb3IgYW4gdW5rbm93biB1c2VyOiBub3RpZmljYXRpb24gb2YgYSBuZXcgc3Vic2NyaXB0aW9uLlxuICAgICAgICAgIGNvbnN0IGFjcyA9IG5ldyBBY2Nlc3NNb2RlKCkudXBkYXRlQWxsKHByZXMuZGFjcyk7XG4gICAgICAgICAgaWYgKGFjcyAmJiBhY3MubW9kZSAhPSBBY2Nlc3NNb2RlLl9OT05FKSB7XG4gICAgICAgICAgICB1c2VyID0gdGhpcy5fY2FjaGVHZXRVc2VyKHVpZCk7XG4gICAgICAgICAgICBpZiAoIXVzZXIpIHtcbiAgICAgICAgICAgICAgdXNlciA9IHtcbiAgICAgICAgICAgICAgICB1c2VyOiB1aWQsXG4gICAgICAgICAgICAgICAgYWNzOiBhY3NcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgdGhpcy5nZXRNZXRhKHRoaXMuc3RhcnRNZXRhUXVlcnkoKS53aXRoT25lU3ViKHVuZGVmaW5lZCwgdWlkKS5idWlsZCgpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHVzZXIuYWNzID0gYWNzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdXNlci51cGRhdGVkID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2Nlc3NNZXRhU3ViKFt1c2VyXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIEtub3duIHVzZXJcbiAgICAgICAgICB1c2VyLmFjcy51cGRhdGVBbGwocHJlcy5kYWNzKTtcbiAgICAgICAgICAvLyBVcGRhdGUgdXNlcidzIGFjY2VzcyBtb2RlLlxuICAgICAgICAgIHRoaXMuX3Byb2Nlc3NNZXRhU3ViKFt7XG4gICAgICAgICAgICB1c2VyOiB1aWQsXG4gICAgICAgICAgICB1cGRhdGVkOiBuZXcgRGF0ZSgpLFxuICAgICAgICAgICAgYWNzOiB1c2VyLmFjc1xuICAgICAgICAgIH1dKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRoaXMuX3Rpbm9kZS5sb2dnZXIoXCJJTkZPOiBJZ25vcmVkIHByZXNlbmNlIHVwZGF0ZVwiLCBwcmVzLndoYXQpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm9uUHJlcykge1xuICAgICAgdGhpcy5vblByZXMocHJlcyk7XG4gICAgfVxuICB9XG4gIC8vIFByb2Nlc3Mge2luZm99IG1lc3NhZ2VcbiAgX3JvdXRlSW5mbyhpbmZvKSB7XG4gICAgaWYgKGluZm8ud2hhdCAhPT0gJ2twJykge1xuICAgICAgY29uc3QgdXNlciA9IHRoaXMuX3VzZXJzW2luZm8uZnJvbV07XG4gICAgICBpZiAodXNlcikge1xuICAgICAgICB1c2VyW2luZm8ud2hhdF0gPSBpbmZvLnNlcTtcbiAgICAgICAgaWYgKHVzZXIucmVjdiA8IHVzZXIucmVhZCkge1xuICAgICAgICAgIHVzZXIucmVjdiA9IHVzZXIucmVhZDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY29uc3QgbXNnID0gdGhpcy5sYXRlc3RNZXNzYWdlKCk7XG4gICAgICBpZiAobXNnKSB7XG4gICAgICAgIHRoaXMubXNnU3RhdHVzKG1zZywgdHJ1ZSk7XG4gICAgICB9XG5cbiAgICAgIC8vIElmIHRoaXMgaXMgYW4gdXBkYXRlIGZyb20gdGhlIGN1cnJlbnQgdXNlciwgdXBkYXRlIHRoZSBjYWNoZSB3aXRoIHRoZSBuZXcgY291bnQuXG4gICAgICBpZiAodGhpcy5fdGlub2RlLmlzTWUoaW5mby5mcm9tKSkge1xuICAgICAgICB0aGlzLl91cGRhdGVSZWFkUmVjdihpbmZvLndoYXQsIGluZm8uc2VxKTtcbiAgICAgIH1cblxuICAgICAgLy8gTm90aWZ5ICdtZScgbGlzdGVuZXIgb2YgdGhlIHN0YXR1cyBjaGFuZ2UuXG4gICAgICB0aGlzLl90aW5vZGUuZ2V0TWVUb3BpYygpLl9yZWZyZXNoQ29udGFjdChpbmZvLndoYXQsIHRoaXMpO1xuICAgIH1cbiAgICBpZiAodGhpcy5vbkluZm8pIHtcbiAgICAgIHRoaXMub25JbmZvKGluZm8pO1xuICAgIH1cbiAgfVxuICAvLyBDYWxsZWQgYnkgVGlub2RlIHdoZW4gbWV0YS5kZXNjIHBhY2tldCBpcyByZWNlaXZlZC5cbiAgLy8gQ2FsbGVkIGJ5ICdtZScgdG9waWMgb24gY29udGFjdCB1cGRhdGUgKGRlc2MuX25vRm9yd2FyZGluZyBpcyB0cnVlKS5cbiAgX3Byb2Nlc3NNZXRhRGVzYyhkZXNjKSB7XG4gICAgaWYgKHRoaXMuaXNQMlBUeXBlKCkpIHtcbiAgICAgIC8vIFN5bnRoZXRpYyBkZXNjIG1heSBpbmNsdWRlIGRlZmFjcyBmb3IgcDJwIHRvcGljcyB3aGljaCBpcyB1c2VsZXNzLlxuICAgICAgLy8gUmVtb3ZlIGl0LlxuICAgICAgZGVsZXRlIGRlc2MuZGVmYWNzO1xuXG4gICAgICAvLyBVcGRhdGUgdG8gcDJwIGRlc2MgaXMgdGhlIHNhbWUgYXMgdXNlciB1cGRhdGUuIFVwZGF0ZSBjYWNoZWQgdXNlci5cbiAgICAgIHRoaXMuX3Rpbm9kZS5fZGIudXBkVXNlcih0aGlzLm5hbWUsIGRlc2MucHVibGljKTtcbiAgICB9XG5cbiAgICAvLyBDb3B5IHBhcmFtZXRlcnMgZnJvbSBkZXNjIG9iamVjdCB0byB0aGlzIHRvcGljLlxuICAgIG1lcmdlT2JqKHRoaXMsIGRlc2MpO1xuICAgIC8vIFVwZGF0ZSBwZXJzaXN0ZW50IGNhY2hlLlxuICAgIHRoaXMuX3Rpbm9kZS5fZGIudXBkVG9waWModGhpcyk7XG5cbiAgICAvLyBOb3RpZnkgJ21lJyBsaXN0ZW5lciwgaWYgYXZhaWxhYmxlOlxuICAgIGlmICh0aGlzLm5hbWUgIT09IENvbnN0LlRPUElDX01FICYmICFkZXNjLl9ub0ZvcndhcmRpbmcpIHtcbiAgICAgIGNvbnN0IG1lID0gdGhpcy5fdGlub2RlLmdldE1lVG9waWMoKTtcbiAgICAgIGlmIChtZS5vbk1ldGFTdWIpIHtcbiAgICAgICAgbWUub25NZXRhU3ViKHRoaXMpO1xuICAgICAgfVxuICAgICAgaWYgKG1lLm9uU3Vic1VwZGF0ZWQpIHtcbiAgICAgICAgbWUub25TdWJzVXBkYXRlZChbdGhpcy5uYW1lXSwgMSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMub25NZXRhRGVzYykge1xuICAgICAgdGhpcy5vbk1ldGFEZXNjKHRoaXMpO1xuICAgIH1cbiAgfVxuICAvLyBDYWxsZWQgYnkgVGlub2RlIHdoZW4gbWV0YS5zdWIgaXMgcmVjaXZlZCBvciBpbiByZXNwb25zZSB0byByZWNlaXZlZFxuICAvLyB7Y3RybH0gYWZ0ZXIgc2V0TWV0YS1zdWIuXG4gIF9wcm9jZXNzTWV0YVN1YihzdWJzKSB7XG4gICAgZm9yIChsZXQgaWR4IGluIHN1YnMpIHtcbiAgICAgIGNvbnN0IHN1YiA9IHN1YnNbaWR4XTtcblxuICAgICAgLy8gRmlsbCBkZWZhdWx0cy5cbiAgICAgIHN1Yi5vbmxpbmUgPSAhIXN1Yi5vbmxpbmU7XG4gICAgICAvLyBVcGRhdGUgdGltZXN0YW1wIG9mIHRoZSBtb3N0IHJlY2VudCBzdWJzY3JpcHRpb24gdXBkYXRlLlxuICAgICAgdGhpcy5fbGFzdFN1YnNVcGRhdGUgPSBuZXcgRGF0ZShNYXRoLm1heCh0aGlzLl9sYXN0U3Vic1VwZGF0ZSwgc3ViLnVwZGF0ZWQpKTtcblxuICAgICAgbGV0IHVzZXIgPSBudWxsO1xuICAgICAgaWYgKCFzdWIuZGVsZXRlZCkge1xuICAgICAgICAvLyBJZiB0aGlzIGlzIGEgY2hhbmdlIHRvIHVzZXIncyBvd24gcGVybWlzc2lvbnMsIHVwZGF0ZSB0aGVtIGluIHRvcGljIHRvby5cbiAgICAgICAgLy8gRGVzYyB3aWxsIHVwZGF0ZSAnbWUnIHRvcGljLlxuICAgICAgICBpZiAodGhpcy5fdGlub2RlLmlzTWUoc3ViLnVzZXIpICYmIHN1Yi5hY3MpIHtcbiAgICAgICAgICB0aGlzLl9wcm9jZXNzTWV0YURlc2Moe1xuICAgICAgICAgICAgdXBkYXRlZDogc3ViLnVwZGF0ZWQsXG4gICAgICAgICAgICB0b3VjaGVkOiBzdWIudG91Y2hlZCxcbiAgICAgICAgICAgIGFjczogc3ViLmFjc1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHVzZXIgPSB0aGlzLl91cGRhdGVDYWNoZWRVc2VyKHN1Yi51c2VyLCBzdWIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gU3Vic2NyaXB0aW9uIGlzIGRlbGV0ZWQsIHJlbW92ZSBpdCBmcm9tIHRvcGljIChidXQgbGVhdmUgaW4gVXNlcnMgY2FjaGUpXG4gICAgICAgIGRlbGV0ZSB0aGlzLl91c2Vyc1tzdWIudXNlcl07XG4gICAgICAgIHVzZXIgPSBzdWI7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLm9uTWV0YVN1Yikge1xuICAgICAgICB0aGlzLm9uTWV0YVN1Yih1c2VyKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5vblN1YnNVcGRhdGVkKSB7XG4gICAgICB0aGlzLm9uU3Vic1VwZGF0ZWQoT2JqZWN0LmtleXModGhpcy5fdXNlcnMpKTtcbiAgICB9XG4gIH1cbiAgLy8gQ2FsbGVkIGJ5IFRpbm9kZSB3aGVuIG1ldGEudGFncyBpcyByZWNpdmVkLlxuICBfcHJvY2Vzc01ldGFUYWdzKHRhZ3MpIHtcbiAgICBpZiAodGFncy5sZW5ndGggPT0gMSAmJiB0YWdzWzBdID09IENvbnN0LkRFTF9DSEFSKSB7XG4gICAgICB0YWdzID0gW107XG4gICAgfVxuICAgIHRoaXMuX3RhZ3MgPSB0YWdzO1xuICAgIGlmICh0aGlzLm9uVGFnc1VwZGF0ZWQpIHtcbiAgICAgIHRoaXMub25UYWdzVXBkYXRlZCh0YWdzKTtcbiAgICB9XG4gIH1cbiAgLy8gRG8gbm90aGluZyBmb3IgdG9waWNzIG90aGVyIHRoYW4gJ21lJ1xuICBfcHJvY2Vzc01ldGFDcmVkcyhjcmVkcykge31cbiAgLy8gRGVsZXRlIGNhY2hlZCBtZXNzYWdlcyBhbmQgdXBkYXRlIGNhY2hlZCB0cmFuc2FjdGlvbiBJRHNcbiAgX3Byb2Nlc3NEZWxNZXNzYWdlcyhjbGVhciwgZGVsc2VxKSB7XG4gICAgdGhpcy5fbWF4RGVsID0gTWF0aC5tYXgoY2xlYXIsIHRoaXMuX21heERlbCk7XG4gICAgdGhpcy5jbGVhciA9IE1hdGgubWF4KGNsZWFyLCB0aGlzLmNsZWFyKTtcbiAgICBjb25zdCB0b3BpYyA9IHRoaXM7XG4gICAgbGV0IGNvdW50ID0gMDtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShkZWxzZXEpKSB7XG4gICAgICBkZWxzZXEuZm9yRWFjaChmdW5jdGlvbihyYW5nZSkge1xuICAgICAgICBpZiAoIXJhbmdlLmhpKSB7XG4gICAgICAgICAgY291bnQrKztcbiAgICAgICAgICB0b3BpYy5mbHVzaE1lc3NhZ2UocmFuZ2UubG93KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmb3IgKGxldCBpID0gcmFuZ2UubG93OyBpIDwgcmFuZ2UuaGk7IGkrKykge1xuICAgICAgICAgICAgY291bnQrKztcbiAgICAgICAgICAgIHRvcGljLmZsdXNoTWVzc2FnZShpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChjb3VudCA+IDApIHtcbiAgICAgIHRoaXMuX3VwZGF0ZURlbGV0ZWRSYW5nZXMoKTtcblxuICAgICAgaWYgKHRoaXMub25EYXRhKSB7XG4gICAgICAgIHRoaXMub25EYXRhKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIC8vIFRvcGljIGlzIGluZm9ybWVkIHRoYXQgdGhlIGVudGlyZSByZXNwb25zZSB0byB7Z2V0IHdoYXQ9ZGF0YX0gaGFzIGJlZW4gcmVjZWl2ZWQuXG4gIF9hbGxNZXNzYWdlc1JlY2VpdmVkKGNvdW50KSB7XG4gICAgdGhpcy5fdXBkYXRlRGVsZXRlZFJhbmdlcygpO1xuXG4gICAgaWYgKHRoaXMub25BbGxNZXNzYWdlc1JlY2VpdmVkKSB7XG4gICAgICB0aGlzLm9uQWxsTWVzc2FnZXNSZWNlaXZlZChjb3VudCk7XG4gICAgfVxuICB9XG4gIC8vIFJlc2V0IHN1YnNjcmliZWQgc3RhdGVcbiAgX3Jlc2V0U3ViKCkge1xuICAgIHRoaXMuX2F0dGFjaGVkID0gZmFsc2U7XG4gIH1cbiAgLy8gVGhpcyB0b3BpYyBpcyBlaXRoZXIgZGVsZXRlZCBvciB1bnN1YnNjcmliZWQgZnJvbS5cbiAgX2dvbmUoKSB7XG4gICAgdGhpcy5fbWVzc2FnZXMucmVzZXQoKTtcbiAgICB0aGlzLl90aW5vZGUuX2RiLnJlbU1lc3NhZ2VzKHRoaXMubmFtZSk7XG4gICAgdGhpcy5fdXNlcnMgPSB7fTtcbiAgICB0aGlzLmFjcyA9IG5ldyBBY2Nlc3NNb2RlKG51bGwpO1xuICAgIHRoaXMucHJpdmF0ZSA9IG51bGw7XG4gICAgdGhpcy5wdWJsaWMgPSBudWxsO1xuICAgIHRoaXMudHJ1c3RlZCA9IG51bGw7XG4gICAgdGhpcy5fbWF4U2VxID0gMDtcbiAgICB0aGlzLl9taW5TZXEgPSAwO1xuICAgIHRoaXMuX2F0dGFjaGVkID0gZmFsc2U7XG5cbiAgICBjb25zdCBtZSA9IHRoaXMuX3Rpbm9kZS5nZXRNZVRvcGljKCk7XG4gICAgaWYgKG1lKSB7XG4gICAgICBtZS5fcm91dGVQcmVzKHtcbiAgICAgICAgX25vRm9yd2FyZGluZzogdHJ1ZSxcbiAgICAgICAgd2hhdDogJ2dvbmUnLFxuICAgICAgICB0b3BpYzogQ29uc3QuVE9QSUNfTUUsXG4gICAgICAgIHNyYzogdGhpcy5uYW1lXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKHRoaXMub25EZWxldGVUb3BpYykge1xuICAgICAgdGhpcy5vbkRlbGV0ZVRvcGljKCk7XG4gICAgfVxuICB9XG4gIC8vIFVwZGF0ZSBnbG9iYWwgdXNlciBjYWNoZSBhbmQgbG9jYWwgc3Vic2NyaWJlcnMgY2FjaGUuXG4gIC8vIERvbid0IGNhbGwgdGhpcyBtZXRob2QgZm9yIG5vbi1zdWJzY3JpYmVycy5cbiAgX3VwZGF0ZUNhY2hlZFVzZXIodWlkLCBvYmopIHtcbiAgICAvLyBGZXRjaCB1c2VyIG9iamVjdCBmcm9tIHRoZSBnbG9iYWwgY2FjaGUuXG4gICAgLy8gVGhpcyBpcyBhIGNsb25lIG9mIHRoZSBzdG9yZWQgb2JqZWN0XG4gICAgbGV0IGNhY2hlZCA9IHRoaXMuX2NhY2hlR2V0VXNlcih1aWQpO1xuICAgIGNhY2hlZCA9IG1lcmdlT2JqKGNhY2hlZCB8fCB7fSwgb2JqKTtcbiAgICAvLyBTYXZlIHRvIGdsb2JhbCBjYWNoZVxuICAgIHRoaXMuX2NhY2hlUHV0VXNlcih1aWQsIGNhY2hlZCk7XG4gICAgLy8gU2F2ZSB0byB0aGUgbGlzdCBvZiB0b3BpYyBzdWJzcmliZXJzLlxuICAgIHJldHVybiBtZXJnZVRvQ2FjaGUodGhpcy5fdXNlcnMsIHVpZCwgY2FjaGVkKTtcbiAgfVxuICAvLyBHZXQgbG9jYWwgc2VxSWQgZm9yIGEgcXVldWVkIG1lc3NhZ2UuXG4gIF9nZXRRdWV1ZWRTZXFJZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fcXVldWVkU2VxSWQrKztcbiAgfVxuICAvLyBDYWxjdWxhdGUgcmFuZ2VzIG9mIG1pc3NpbmcgbWVzc2FnZXMuXG4gIF91cGRhdGVEZWxldGVkUmFuZ2VzKCkge1xuICAgIGNvbnN0IHJhbmdlcyA9IFtdO1xuXG4gICAgLy8gR2FwIG1hcmtlciwgcG9zc2libHkgZW1wdHkuXG4gICAgbGV0IHByZXYgPSBudWxsO1xuXG4gICAgLy8gQ2hlY2sgZm9yIGdhcCBpbiB0aGUgYmVnaW5uaW5nLCBiZWZvcmUgdGhlIGZpcnN0IG1lc3NhZ2UuXG4gICAgY29uc3QgZmlyc3QgPSB0aGlzLl9tZXNzYWdlcy5nZXRBdCgwKTtcbiAgICBpZiAoZmlyc3QgJiYgdGhpcy5fbWluU2VxID4gMSAmJiAhdGhpcy5fbm9FYXJsaWVyTXNncykge1xuICAgICAgLy8gU29tZSBtZXNzYWdlcyBhcmUgbWlzc2luZyBpbiB0aGUgYmVnaW5uaW5nLlxuICAgICAgaWYgKGZpcnN0LmhpKSB7XG4gICAgICAgIC8vIFRoZSBmaXJzdCBtZXNzYWdlIGFscmVhZHkgcmVwcmVzZW50cyBhIGdhcC5cbiAgICAgICAgaWYgKGZpcnN0LnNlcSA+IDEpIHtcbiAgICAgICAgICBmaXJzdC5zZXEgPSAxO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmaXJzdC5oaSA8IHRoaXMuX21pblNlcSAtIDEpIHtcbiAgICAgICAgICBmaXJzdC5oaSA9IHRoaXMuX21pblNlcSAtIDE7XG4gICAgICAgIH1cbiAgICAgICAgcHJldiA9IGZpcnN0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQ3JlYXRlIG5ldyBnYXAuXG4gICAgICAgIHByZXYgPSB7XG4gICAgICAgICAgc2VxOiAxLFxuICAgICAgICAgIGhpOiB0aGlzLl9taW5TZXEgLSAxXG4gICAgICAgIH07XG4gICAgICAgIHJhbmdlcy5wdXNoKHByZXYpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBObyBnYXAgaW4gdGhlIGJlZ2lubmluZy5cbiAgICAgIHByZXYgPSB7XG4gICAgICAgIHNlcTogMCxcbiAgICAgICAgaGk6IDBcbiAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gRmluZCBuZXcgZ2FwcyBpbiB0aGUgbGlzdCBvZiByZWNlaXZlZCBtZXNzYWdlcy4gVGhlIGxpc3QgY29udGFpbnMgbWVzc2FnZXMtcHJvcGVyIGFzIHdlbGxcbiAgICAvLyBhcyBwbGFjZWhvbGRlcnMgZm9yIGRlbGV0ZWQgcmFuZ2VzLlxuICAgIC8vIFRoZSBtZXNzYWdlcyBhcmUgaXRlcmF0ZWQgYnkgc2VxIElEIGluIGFzY2VuZGluZyBvcmRlci5cbiAgICB0aGlzLl9tZXNzYWdlcy5maWx0ZXIoKGRhdGEpID0+IHtcbiAgICAgIC8vIERvIG5vdCBjcmVhdGUgYSBnYXAgYmV0d2VlbiB0aGUgbGFzdCBzZW50IG1lc3NhZ2UgYW5kIHRoZSBmaXJzdCB1bnNlbnQgYXMgd2VsbCBhcyBiZXR3ZWVuIHVuc2VudCBtZXNzYWdlcy5cbiAgICAgIGlmIChkYXRhLnNlcSA+PSBDb25zdC5MT0NBTF9TRVFJRCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgLy8gQ2hlY2sgZm9yIGEgZ2FwIGJldHdlZW4gdGhlIHByZXZpb3VzIG1lc3NhZ2UvbWFya2VyIGFuZCB0aGlzIG1lc3NhZ2UvbWFya2VyLlxuICAgICAgaWYgKGRhdGEuc2VxID09IChwcmV2LmhpIHx8IHByZXYuc2VxKSArIDEpIHtcbiAgICAgICAgLy8gTm8gZ2FwIGJldHdlZW4gdGhpcyBtZXNzYWdlIGFuZCB0aGUgcHJldmlvdXMuXG4gICAgICAgIGlmIChkYXRhLmhpICYmIHByZXYuaGkpIHtcbiAgICAgICAgICAvLyBUd28gZ2FwIG1hcmtlcnMgaW4gYSByb3cuIEV4dGVuZCB0aGUgcHJldmlvdXMgb25lLCBkaXNjYXJkIHRoZSBjdXJyZW50LlxuICAgICAgICAgIHByZXYuaGkgPSBkYXRhLmhpO1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBwcmV2ID0gZGF0YTtcblxuICAgICAgICAvLyBLZWVwIGN1cnJlbnQuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBGb3VuZCBhIG5ldyBnYXAuXG4gICAgICAvLyBDaGVjayBpZiB0aGUgcHJldmlvdXMgaXMgYWxzbyBhIGdhcCBtYXJrZXIuXG4gICAgICBpZiAocHJldi5oaSkge1xuICAgICAgICAvLyBBbHRlciBpdCBpbnN0ZWFkIG9mIGNyZWF0aW5nIGEgbmV3IG9uZS5cbiAgICAgICAgcHJldi5oaSA9IGRhdGEuaGkgfHwgZGF0YS5zZXE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBQcmV2aW91cyBpcyBub3QgYSBnYXAgbWFya2VyLiBDcmVhdGUgYSBuZXcgb25lLlxuICAgICAgICBwcmV2ID0ge1xuICAgICAgICAgIHNlcTogcHJldi5zZXEgKyAxLFxuICAgICAgICAgIGhpOiBkYXRhLmhpIHx8IGRhdGEuc2VxXG4gICAgICAgIH07XG4gICAgICAgIHJhbmdlcy5wdXNoKHByZXYpO1xuICAgICAgfVxuXG4gICAgICAvLyBJZiBtYXJrZXIsIHJlbW92ZTsga2VlcCBpZiByZWd1bGFyIG1lc3NhZ2UuXG4gICAgICBpZiAoIWRhdGEuaGkpIHtcbiAgICAgICAgLy8gS2VlcGluZyB0aGUgY3VycmVudCByZWd1bGFyIG1lc3NhZ2UsIHNhdmUgaXQgYXMgcHJldmlvdXMuXG4gICAgICAgIHByZXYgPSBkYXRhO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgLy8gRGlzY2FyZCB0aGUgY3VycmVudCBnYXAgbWFya2VyOiB3ZSBlaXRoZXIgY3JlYXRlZCBhbiBlYXJsaWVyIGdhcCwgb3IgZXh0ZW5kZWQgdGhlIHByZXZvdXMgb25lLlxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0pO1xuXG4gICAgLy8gQ2hlY2sgZm9yIG1pc3NpbmcgbWVzc2FnZXMgYXQgdGhlIGVuZC5cbiAgICAvLyBBbGwgbWVzc2FnZXMgY291bGQgYmUgbWlzc2luZyBvciBpdCBjb3VsZCBiZSBhIG5ldyB0b3BpYyB3aXRoIG5vIG1lc3NhZ2VzLlxuICAgIGNvbnN0IGxhc3QgPSB0aGlzLl9tZXNzYWdlcy5nZXRMYXN0KCk7XG4gICAgY29uc3QgbWF4U2VxID0gTWF0aC5tYXgodGhpcy5zZXEsIHRoaXMuX21heFNlcSkgfHwgMDtcbiAgICBpZiAoKG1heFNlcSA+IDAgJiYgIWxhc3QpIHx8IChsYXN0ICYmICgobGFzdC5oaSB8fCBsYXN0LnNlcSkgPCBtYXhTZXEpKSkge1xuICAgICAgaWYgKGxhc3QgJiYgbGFzdC5oaSkge1xuICAgICAgICAvLyBFeHRlbmQgZXhpc3RpbmcgZ2FwXG4gICAgICAgIGxhc3QuaGkgPSBtYXhTZXE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBDcmVhdGUgbmV3IGdhcC5cbiAgICAgICAgcmFuZ2VzLnB1c2goe1xuICAgICAgICAgIHNlcTogbGFzdCA/IGxhc3Quc2VxICsgMSA6IDEsXG4gICAgICAgICAgaGk6IG1heFNlcVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBJbnNlcnQgbmV3IGdhcHMgaW50byBjYWNoZS5cbiAgICByYW5nZXMuZm9yRWFjaCgoZ2FwKSA9PiB7XG4gICAgICBnYXAuX3N0YXR1cyA9IENvbnN0Lk1FU1NBR0VfU1RBVFVTX0RFTF9SQU5HRTtcbiAgICAgIHRoaXMuX21lc3NhZ2VzLnB1dChnYXApO1xuICAgIH0pO1xuICB9XG4gIC8vIExvYWQgbW9zdCByZWNlbnQgbWVzc2FnZXMgZnJvbSBwZXJzaXN0ZW50IGNhY2hlLlxuICBfbG9hZE1lc3NhZ2VzKGRiLCBwYXJhbXMpIHtcbiAgICBjb25zdCB7XG4gICAgICBzaW5jZSxcbiAgICAgIGJlZm9yZSxcbiAgICAgIGxpbWl0XG4gICAgfSA9IHBhcmFtcyB8fCB7fTtcbiAgICByZXR1cm4gZGIucmVhZE1lc3NhZ2VzKHRoaXMubmFtZSwge1xuICAgICAgICBzaW5jZTogc2luY2UsXG4gICAgICAgIGJlZm9yZTogYmVmb3JlLFxuICAgICAgICBsaW1pdDogbGltaXQgfHwgQ29uc3QuREVGQVVMVF9NRVNTQUdFU19QQUdFXG4gICAgICB9KVxuICAgICAgLnRoZW4oKG1zZ3MpID0+IHtcbiAgICAgICAgbXNncy5mb3JFYWNoKChkYXRhKSA9PiB7XG4gICAgICAgICAgaWYgKGRhdGEuc2VxID4gdGhpcy5fbWF4U2VxKSB7XG4gICAgICAgICAgICB0aGlzLl9tYXhTZXEgPSBkYXRhLnNlcTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGRhdGEuc2VxIDwgdGhpcy5fbWluU2VxIHx8IHRoaXMuX21pblNlcSA9PSAwKSB7XG4gICAgICAgICAgICB0aGlzLl9taW5TZXEgPSBkYXRhLnNlcTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5fbWVzc2FnZXMucHV0KGRhdGEpO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKG1zZ3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHRoaXMuX3VwZGF0ZURlbGV0ZWRSYW5nZXMoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbXNncy5sZW5ndGg7XG4gICAgICB9KTtcbiAgfVxuICAvLyBQdXNoIG9yIHtwcmVzfTogbWVzc2FnZSByZWNlaXZlZC5cbiAgX3VwZGF0ZVJlY2VpdmVkKHNlcSwgYWN0KSB7XG4gICAgdGhpcy50b3VjaGVkID0gbmV3IERhdGUoKTtcbiAgICB0aGlzLnNlcSA9IHNlcSB8IDA7XG4gICAgLy8gQ2hlY2sgaWYgbWVzc2FnZSBpcyBzZW50IGJ5IHRoZSBjdXJyZW50IHVzZXIuIElmIHNvIGl0J3MgYmVlbiByZWFkIGFscmVhZHkuXG4gICAgaWYgKCFhY3QgfHwgdGhpcy5fdGlub2RlLmlzTWUoYWN0KSkge1xuICAgICAgdGhpcy5yZWFkID0gdGhpcy5yZWFkID8gTWF0aC5tYXgodGhpcy5yZWFkLCB0aGlzLnNlcSkgOiB0aGlzLnNlcTtcbiAgICAgIHRoaXMucmVjdiA9IHRoaXMucmVjdiA/IE1hdGgubWF4KHRoaXMucmVhZCwgdGhpcy5yZWN2KSA6IHRoaXMucmVhZDtcbiAgICB9XG4gICAgdGhpcy51bnJlYWQgPSB0aGlzLnNlcSAtICh0aGlzLnJlYWQgfCAwKTtcbiAgICB0aGlzLl90aW5vZGUuX2RiLnVwZFRvcGljKHRoaXMpO1xuICB9XG59XG5cblxuLyoqXG4gKiBAY2xhc3MgVG9waWNNZSAtIHNwZWNpYWwgY2FzZSBvZiB7QGxpbmsgVGlub2RlLlRvcGljfSBmb3JcbiAqIG1hbmFnaW5nIGRhdGEgb2YgdGhlIGN1cnJlbnQgdXNlciwgaW5jbHVkaW5nIGNvbnRhY3QgbGlzdC5cbiAqIEBleHRlbmRzIFRpbm9kZS5Ub3BpY1xuICogQG1lbWJlcm9mIFRpbm9kZVxuICpcbiAqIEBwYXJhbSB7VG9waWNNZS5DYWxsYmFja3N9IGNhbGxiYWNrcyAtIENhbGxiYWNrcyB0byByZWNlaXZlIHZhcmlvdXMgZXZlbnRzLlxuICovXG4vKipcbiAqIEBjbGFzcyBUb3BpY01lIC0gc3BlY2lhbCBjYXNlIG9mIHtAbGluayBUaW5vZGUuVG9waWN9IGZvclxuICogbWFuYWdpbmcgZGF0YSBvZiB0aGUgY3VycmVudCB1c2VyLCBpbmNsdWRpbmcgY29udGFjdCBsaXN0LlxuICogQGV4dGVuZHMgVGlub2RlLlRvcGljXG4gKiBAbWVtYmVyb2YgVGlub2RlXG4gKlxuICogQHBhcmFtIHtUb3BpY01lLkNhbGxiYWNrc30gY2FsbGJhY2tzIC0gQ2FsbGJhY2tzIHRvIHJlY2VpdmUgdmFyaW91cyBldmVudHMuXG4gKi9cbmV4cG9ydCBjbGFzcyBUb3BpY01lIGV4dGVuZHMgVG9waWMge1xuICBvbkNvbnRhY3RVcGRhdGU7XG5cbiAgY29uc3RydWN0b3IoY2FsbGJhY2tzKSB7XG4gICAgc3VwZXIoQ29uc3QuVE9QSUNfTUUsIGNhbGxiYWNrcyk7XG5cbiAgICAvLyBtZS1zcGVjaWZpYyBjYWxsYmFja3NcbiAgICBpZiAoY2FsbGJhY2tzKSB7XG4gICAgICB0aGlzLm9uQ29udGFjdFVwZGF0ZSA9IGNhbGxiYWNrcy5vbkNvbnRhY3RVcGRhdGU7XG4gICAgfVxuICB9XG5cbiAgLy8gT3ZlcnJpZGUgdGhlIG9yaWdpbmFsIFRvcGljLl9wcm9jZXNzTWV0YURlc2MuXG4gIF9wcm9jZXNzTWV0YURlc2MoZGVzYykge1xuICAgIC8vIENoZWNrIGlmIG9ubGluZSBjb250YWN0cyBuZWVkIHRvIGJlIHR1cm5lZCBvZmYgYmVjYXVzZSBQIHBlcm1pc3Npb24gd2FzIHJlbW92ZWQuXG4gICAgY29uc3QgdHVybk9mZiA9IChkZXNjLmFjcyAmJiAhZGVzYy5hY3MuaXNQcmVzZW5jZXIoKSkgJiYgKHRoaXMuYWNzICYmIHRoaXMuYWNzLmlzUHJlc2VuY2VyKCkpO1xuXG4gICAgLy8gQ29weSBwYXJhbWV0ZXJzIGZyb20gZGVzYyBvYmplY3QgdG8gdGhpcyB0b3BpYy5cbiAgICBtZXJnZU9iaih0aGlzLCBkZXNjKTtcbiAgICB0aGlzLl90aW5vZGUuX2RiLnVwZFRvcGljKHRoaXMpO1xuICAgIC8vIFVwZGF0ZSBjdXJyZW50IHVzZXIncyByZWNvcmQgaW4gdGhlIGdsb2JhbCBjYWNoZS5cbiAgICB0aGlzLl91cGRhdGVDYWNoZWRVc2VyKHRoaXMuX3Rpbm9kZS5fbXlVSUQsIGRlc2MpO1xuXG4gICAgLy8gJ1AnIHBlcm1pc3Npb24gd2FzIHJlbW92ZWQuIEFsbCB0b3BpY3MgYXJlIG9mZmxpbmUgbm93LlxuICAgIGlmICh0dXJuT2ZmKSB7XG4gICAgICB0aGlzLl90aW5vZGUubWFwVG9waWNzKChjb250KSA9PiB7XG4gICAgICAgIGlmIChjb250Lm9ubGluZSkge1xuICAgICAgICAgIGNvbnQub25saW5lID0gZmFsc2U7XG4gICAgICAgICAgY29udC5zZWVuID0gT2JqZWN0LmFzc2lnbihjb250LnNlZW4gfHwge30sIHtcbiAgICAgICAgICAgIHdoZW46IG5ldyBEYXRlKClcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0aGlzLl9yZWZyZXNoQ29udGFjdCgnb2ZmJywgY29udCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm9uTWV0YURlc2MpIHtcbiAgICAgIHRoaXMub25NZXRhRGVzYyh0aGlzKTtcbiAgICB9XG4gIH1cblxuICAvLyBPdmVycmlkZSB0aGUgb3JpZ2luYWwgVG9waWMuX3Byb2Nlc3NNZXRhU3ViXG4gIF9wcm9jZXNzTWV0YVN1YihzdWJzKSB7XG4gICAgbGV0IHVwZGF0ZUNvdW50ID0gMDtcbiAgICBzdWJzLmZvckVhY2goKHN1YikgPT4ge1xuICAgICAgY29uc3QgdG9waWNOYW1lID0gc3ViLnRvcGljO1xuICAgICAgLy8gRG9uJ3Qgc2hvdyAnbWUnIGFuZCAnZm5kJyB0b3BpY3MgaW4gdGhlIGxpc3Qgb2YgY29udGFjdHMuXG4gICAgICBpZiAodG9waWNOYW1lID09IENvbnN0LlRPUElDX0ZORCB8fCB0b3BpY05hbWUgPT0gQ29uc3QuVE9QSUNfTUUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgc3ViLm9ubGluZSA9ICEhc3ViLm9ubGluZTtcblxuICAgICAgbGV0IGNvbnQgPSBudWxsO1xuICAgICAgaWYgKHN1Yi5kZWxldGVkKSB7XG4gICAgICAgIGNvbnQgPSBzdWI7XG4gICAgICAgIHRoaXMuX3Rpbm9kZS5jYWNoZVJlbVRvcGljKHRvcGljTmFtZSk7XG4gICAgICAgIHRoaXMuX3Rpbm9kZS5fZGIucmVtVG9waWModG9waWNOYW1lKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEVuc3VyZSB0aGUgdmFsdWVzIGFyZSBkZWZpbmVkIGFuZCBhcmUgaW50ZWdlcnMuXG4gICAgICAgIGlmICh0eXBlb2Ygc3ViLnNlcSAhPSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIHN1Yi5zZXEgPSBzdWIuc2VxIHwgMDtcbiAgICAgICAgICBzdWIucmVjdiA9IHN1Yi5yZWN2IHwgMDtcbiAgICAgICAgICBzdWIucmVhZCA9IHN1Yi5yZWFkIHwgMDtcbiAgICAgICAgICBzdWIudW5yZWFkID0gc3ViLnNlcSAtIHN1Yi5yZWFkO1xuICAgICAgICB9XG5cbiAgICAgICAgY29udCA9IG1lcmdlT2JqKHRoaXMuX3Rpbm9kZS5nZXRUb3BpYyh0b3BpY05hbWUpLCBzdWIpO1xuICAgICAgICB0aGlzLl90aW5vZGUuX2RiLnVwZFRvcGljKGNvbnQpO1xuXG4gICAgICAgIGlmIChUb3BpYy5pc1AyUFRvcGljTmFtZSh0b3BpY05hbWUpKSB7XG4gICAgICAgICAgdGhpcy5fY2FjaGVQdXRVc2VyKHRvcGljTmFtZSwgY29udCk7XG4gICAgICAgICAgdGhpcy5fdGlub2RlLl9kYi51cGRVc2VyKHRvcGljTmFtZSwgY29udC5wdWJsaWMpO1xuICAgICAgICB9XG4gICAgICAgIC8vIE5vdGlmeSB0b3BpYyBvZiB0aGUgdXBkYXRlIGlmIGl0J3MgYW4gZXh0ZXJuYWwgdXBkYXRlLlxuICAgICAgICBpZiAoIXN1Yi5fbm9Gb3J3YXJkaW5nKSB7XG4gICAgICAgICAgY29uc3QgdG9waWMgPSB0aGlzLl90aW5vZGUuZ2V0VG9waWModG9waWNOYW1lKTtcbiAgICAgICAgICBpZiAodG9waWMpIHtcbiAgICAgICAgICAgIHN1Yi5fbm9Gb3J3YXJkaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIHRvcGljLl9wcm9jZXNzTWV0YURlc2Moc3ViKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdXBkYXRlQ291bnQrKztcblxuICAgICAgaWYgKHRoaXMub25NZXRhU3ViKSB7XG4gICAgICAgIHRoaXMub25NZXRhU3ViKGNvbnQpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMub25TdWJzVXBkYXRlZCAmJiB1cGRhdGVDb3VudCA+IDApIHtcbiAgICAgIGNvbnN0IGtleXMgPSBbXTtcbiAgICAgIHN1YnMuZm9yRWFjaCgocykgPT4ge1xuICAgICAgICBrZXlzLnB1c2gocy50b3BpYyk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMub25TdWJzVXBkYXRlZChrZXlzLCB1cGRhdGVDb3VudCk7XG4gICAgfVxuICB9XG5cbiAgLy8gQ2FsbGVkIGJ5IFRpbm9kZSB3aGVuIG1ldGEuc3ViIGlzIHJlY2l2ZWQuXG4gIF9wcm9jZXNzTWV0YUNyZWRzKGNyZWRzLCB1cGQpIHtcbiAgICBpZiAoY3JlZHMubGVuZ3RoID09IDEgJiYgY3JlZHNbMF0gPT0gQ29uc3QuREVMX0NIQVIpIHtcbiAgICAgIGNyZWRzID0gW107XG4gICAgfVxuICAgIGlmICh1cGQpIHtcbiAgICAgIGNyZWRzLmZvckVhY2goKGNyKSA9PiB7XG4gICAgICAgIGlmIChjci52YWwpIHtcbiAgICAgICAgICAvLyBBZGRpbmcgYSBjcmVkZW50aWFsLlxuICAgICAgICAgIGxldCBpZHggPSB0aGlzLl9jcmVkZW50aWFscy5maW5kSW5kZXgoKGVsKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gZWwubWV0aCA9PSBjci5tZXRoICYmIGVsLnZhbCA9PSBjci52YWw7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKGlkeCA8IDApIHtcbiAgICAgICAgICAgIC8vIE5vdCBmb3VuZC5cbiAgICAgICAgICAgIGlmICghY3IuZG9uZSkge1xuICAgICAgICAgICAgICAvLyBVbmNvbmZpcm1lZCBjcmVkZW50aWFsIHJlcGxhY2VzIHByZXZpb3VzIHVuY29uZmlybWVkIGNyZWRlbnRpYWwgb2YgdGhlIHNhbWUgbWV0aG9kLlxuICAgICAgICAgICAgICBpZHggPSB0aGlzLl9jcmVkZW50aWFscy5maW5kSW5kZXgoKGVsKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVsLm1ldGggPT0gY3IubWV0aCAmJiAhZWwuZG9uZTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIGlmIChpZHggPj0gMCkge1xuICAgICAgICAgICAgICAgIC8vIFJlbW92ZSBwcmV2aW91cyB1bmNvbmZpcm1lZCBjcmVkZW50aWFsLlxuICAgICAgICAgICAgICAgIHRoaXMuX2NyZWRlbnRpYWxzLnNwbGljZShpZHgsIDEpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9jcmVkZW50aWFscy5wdXNoKGNyKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gRm91bmQuIE1heWJlIGNoYW5nZSAnZG9uZScgc3RhdHVzLlxuICAgICAgICAgICAgdGhpcy5fY3JlZGVudGlhbHNbaWR4XS5kb25lID0gY3IuZG9uZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoY3IucmVzcCkge1xuICAgICAgICAgIC8vIEhhbmRsZSBjcmVkZW50aWFsIGNvbmZpcm1hdGlvbi5cbiAgICAgICAgICBjb25zdCBpZHggPSB0aGlzLl9jcmVkZW50aWFscy5maW5kSW5kZXgoKGVsKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gZWwubWV0aCA9PSBjci5tZXRoICYmICFlbC5kb25lO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmIChpZHggPj0gMCkge1xuICAgICAgICAgICAgdGhpcy5fY3JlZGVudGlhbHNbaWR4XS5kb25lID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9jcmVkZW50aWFscyA9IGNyZWRzO1xuICAgIH1cbiAgICBpZiAodGhpcy5vbkNyZWRzVXBkYXRlZCkge1xuICAgICAgdGhpcy5vbkNyZWRzVXBkYXRlZCh0aGlzLl9jcmVkZW50aWFscyk7XG4gICAgfVxuICB9XG5cbiAgLy8gUHJvY2VzcyBwcmVzZW5jZSBjaGFuZ2UgbWVzc2FnZVxuICBfcm91dGVQcmVzKHByZXMpIHtcbiAgICBpZiAocHJlcy53aGF0ID09ICd0ZXJtJykge1xuICAgICAgLy8gVGhlICdtZScgdG9waWMgaXRzZWxmIGlzIGRldGFjaGVkLiBNYXJrIGFzIHVuc3Vic2NyaWJlZC5cbiAgICAgIHRoaXMuX3Jlc2V0U3ViKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHByZXMud2hhdCA9PSAndXBkJyAmJiBwcmVzLnNyYyA9PSBDb25zdC5UT1BJQ19NRSkge1xuICAgICAgLy8gVXBkYXRlIHRvIG1lJ3MgZGVzY3JpcHRpb24uIFJlcXVlc3QgdXBkYXRlZCB2YWx1ZS5cbiAgICAgIHRoaXMuZ2V0TWV0YSh0aGlzLnN0YXJ0TWV0YVF1ZXJ5KCkud2l0aERlc2MoKS5idWlsZCgpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBjb250ID0gdGhpcy5fdGlub2RlLmNhY2hlR2V0VG9waWMocHJlcy5zcmMpO1xuICAgIGlmIChjb250KSB7XG4gICAgICBzd2l0Y2ggKHByZXMud2hhdCkge1xuICAgICAgICBjYXNlICdvbic6IC8vIHRvcGljIGNhbWUgb25saW5lXG4gICAgICAgICAgY29udC5vbmxpbmUgPSB0cnVlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdvZmYnOiAvLyB0b3BpYyB3ZW50IG9mZmxpbmVcbiAgICAgICAgICBpZiAoY29udC5vbmxpbmUpIHtcbiAgICAgICAgICAgIGNvbnQub25saW5lID0gZmFsc2U7XG4gICAgICAgICAgICBjb250LnNlZW4gPSBPYmplY3QuYXNzaWduKGNvbnQuc2VlbiB8fCB7fSwge1xuICAgICAgICAgICAgICB3aGVuOiBuZXcgRGF0ZSgpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ21zZyc6IC8vIG5ldyBtZXNzYWdlIHJlY2VpdmVkXG4gICAgICAgICAgY29udC5fdXBkYXRlUmVjZWl2ZWQocHJlcy5zZXEsIHByZXMuYWN0KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAndXBkJzogLy8gZGVzYyB1cGRhdGVkXG4gICAgICAgICAgLy8gUmVxdWVzdCB1cGRhdGVkIHN1YnNjcmlwdGlvbi5cbiAgICAgICAgICB0aGlzLmdldE1ldGEodGhpcy5zdGFydE1ldGFRdWVyeSgpLndpdGhMYXRlck9uZVN1YihwcmVzLnNyYykuYnVpbGQoKSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2Fjcyc6IC8vIGFjY2VzcyBtb2RlIGNoYW5nZWRcbiAgICAgICAgICBpZiAoY29udC5hY3MpIHtcbiAgICAgICAgICAgIGNvbnQuYWNzLnVwZGF0ZUFsbChwcmVzLmRhY3MpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb250LmFjcyA9IG5ldyBBY2Nlc3NNb2RlKCkudXBkYXRlQWxsKHByZXMuZGFjcyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnQudG91Y2hlZCA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3VhJzpcbiAgICAgICAgICAvLyB1c2VyIGFnZW50IGNoYW5nZWQuXG4gICAgICAgICAgY29udC5zZWVuID0ge1xuICAgICAgICAgICAgd2hlbjogbmV3IERhdGUoKSxcbiAgICAgICAgICAgIHVhOiBwcmVzLnVhXG4gICAgICAgICAgfTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAncmVjdic6XG4gICAgICAgICAgLy8gdXNlcidzIG90aGVyIHNlc3Npb24gbWFya2VkIHNvbWUgbWVzc2dlcyBhcyByZWNlaXZlZC5cbiAgICAgICAgICBwcmVzLnNlcSA9IHByZXMuc2VxIHwgMDtcbiAgICAgICAgICBjb250LnJlY3YgPSBjb250LnJlY3YgPyBNYXRoLm1heChjb250LnJlY3YsIHByZXMuc2VxKSA6IHByZXMuc2VxO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdyZWFkJzpcbiAgICAgICAgICAvLyB1c2VyJ3Mgb3RoZXIgc2Vzc2lvbiBtYXJrZWQgc29tZSBtZXNzYWdlcyBhcyByZWFkLlxuICAgICAgICAgIHByZXMuc2VxID0gcHJlcy5zZXEgfCAwO1xuICAgICAgICAgIGNvbnQucmVhZCA9IGNvbnQucmVhZCA/IE1hdGgubWF4KGNvbnQucmVhZCwgcHJlcy5zZXEpIDogcHJlcy5zZXE7XG4gICAgICAgICAgY29udC5yZWN2ID0gY29udC5yZWN2ID8gTWF0aC5tYXgoY29udC5yZWFkLCBjb250LnJlY3YpIDogY29udC5yZWN2O1xuICAgICAgICAgIGNvbnQudW5yZWFkID0gY29udC5zZXEgLSBjb250LnJlYWQ7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2dvbmUnOlxuICAgICAgICAgIC8vIHRvcGljIGRlbGV0ZWQgb3IgdW5zdWJzY3JpYmVkIGZyb20uXG4gICAgICAgICAgaWYgKCFjb250Ll9kZWxldGVkKSB7XG4gICAgICAgICAgICBjb250Ll9kZWxldGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIGNvbnQuX2F0dGFjaGVkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLl90aW5vZGUuX2RiLm1hcmtUb3BpY0FzRGVsZXRlZChwcmVzLnNyYywgdHJ1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdkZWwnOlxuICAgICAgICAgIC8vIFVwZGF0ZSB0b3BpYy5kZWwgdmFsdWUuXG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgdGhpcy5fdGlub2RlLmxvZ2dlcihcIklORk86IFVuc3VwcG9ydGVkIHByZXNlbmNlIHVwZGF0ZSBpbiAnbWUnXCIsIHByZXMud2hhdCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3JlZnJlc2hDb250YWN0KHByZXMud2hhdCwgY29udCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChwcmVzLndoYXQgPT0gJ2FjcycpIHtcbiAgICAgICAgLy8gTmV3IHN1YnNjcmlwdGlvbnMgYW5kIGRlbGV0ZWQvYmFubmVkIHN1YnNjcmlwdGlvbnMgaGF2ZSBmdWxsXG4gICAgICAgIC8vIGFjY2VzcyBtb2RlIChubyArIG9yIC0gaW4gdGhlIGRhY3Mgc3RyaW5nKS4gQ2hhbmdlcyB0byBrbm93biBzdWJzY3JpcHRpb25zIGFyZSBzZW50IGFzXG4gICAgICAgIC8vIGRlbHRhcywgYnV0IHRoZXkgc2hvdWxkIG5vdCBoYXBwZW4gaGVyZS5cbiAgICAgICAgY29uc3QgYWNzID0gbmV3IEFjY2Vzc01vZGUocHJlcy5kYWNzKTtcbiAgICAgICAgaWYgKCFhY3MgfHwgYWNzLm1vZGUgPT0gQWNjZXNzTW9kZS5fSU5WQUxJRCkge1xuICAgICAgICAgIHRoaXMuX3Rpbm9kZS5sb2dnZXIoXCJFUlJPUjogSW52YWxpZCBhY2Nlc3MgbW9kZSB1cGRhdGVcIiwgcHJlcy5zcmMsIHByZXMuZGFjcyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IGVsc2UgaWYgKGFjcy5tb2RlID09IEFjY2Vzc01vZGUuX05PTkUpIHtcbiAgICAgICAgICB0aGlzLl90aW5vZGUubG9nZ2VyKFwiV0FSTklORzogUmVtb3Zpbmcgbm9uLWV4aXN0ZW50IHN1YnNjcmlwdGlvblwiLCBwcmVzLnNyYywgcHJlcy5kYWNzKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gTmV3IHN1YnNjcmlwdGlvbi4gU2VuZCByZXF1ZXN0IGZvciB0aGUgZnVsbCBkZXNjcmlwdGlvbi5cbiAgICAgICAgICAvLyBVc2luZyAud2l0aE9uZVN1YiAobm90IC53aXRoTGF0ZXJPbmVTdWIpIHRvIG1ha2Ugc3VyZSBJZk1vZGlmaWVkU2luY2UgaXMgbm90IHNldC5cbiAgICAgICAgICB0aGlzLmdldE1ldGEodGhpcy5zdGFydE1ldGFRdWVyeSgpLndpdGhPbmVTdWIodW5kZWZpbmVkLCBwcmVzLnNyYykuYnVpbGQoKSk7XG4gICAgICAgICAgLy8gQ3JlYXRlIGEgZHVtbXkgZW50cnkgdG8gY2F0Y2ggb25saW5lIHN0YXR1cyB1cGRhdGUuXG4gICAgICAgICAgY29uc3QgZHVtbXkgPSB0aGlzLl90aW5vZGUuZ2V0VG9waWMocHJlcy5zcmMpO1xuICAgICAgICAgIGR1bW15LnRvcGljID0gcHJlcy5zcmM7XG4gICAgICAgICAgZHVtbXkub25saW5lID0gZmFsc2U7XG4gICAgICAgICAgZHVtbXkuYWNzID0gYWNzO1xuICAgICAgICAgIHRoaXMuX3Rpbm9kZS5fZGIudXBkVG9waWMoZHVtbXkpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHByZXMud2hhdCA9PSAndGFncycpIHtcbiAgICAgICAgdGhpcy5nZXRNZXRhKHRoaXMuc3RhcnRNZXRhUXVlcnkoKS53aXRoVGFncygpLmJ1aWxkKCkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLm9uUHJlcykge1xuICAgICAgdGhpcy5vblByZXMocHJlcyk7XG4gICAgfVxuICB9XG5cbiAgLy8gQ29udGFjdCBpcyB1cGRhdGVkLCBleGVjdXRlIGNhbGxiYWNrcy5cbiAgX3JlZnJlc2hDb250YWN0KHdoYXQsIGNvbnQpIHtcbiAgICBpZiAodGhpcy5vbkNvbnRhY3RVcGRhdGUpIHtcbiAgICAgIHRoaXMub25Db250YWN0VXBkYXRlKHdoYXQsIGNvbnQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBQdWJsaXNoaW5nIHRvIFRvcGljTWUgaXMgbm90IHN1cHBvcnRlZC4ge0BsaW5rIFRvcGljI3B1Ymxpc2h9IGlzIG92ZXJyaWRlbiBhbmQgdGhvd3MgYW4ge0Vycm9yfSBpZiBjYWxsZWQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWNNZSNcbiAgICogQHRocm93cyB7RXJyb3J9IEFsd2F5cyB0aHJvd3MgYW4gZXJyb3IuXG4gICAqL1xuICBwdWJsaXNoKCkge1xuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJQdWJsaXNoaW5nIHRvICdtZScgaXMgbm90IHN1cHBvcnRlZFwiKSk7XG4gIH1cblxuICAvKipcbiAgICogRGVsZXRlIHZhbGlkYXRpb24gY3JlZGVudGlhbC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpY01lI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWMgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byBkZWxldGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVzZXIgLSBVc2VyIElEIHRvIHJlbW92ZS5cbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCBvbiByZWNlaXZpbmcgc2VydmVyIHJlcGx5LlxuICAgKi9cbiAgZGVsQ3JlZGVudGlhbChtZXRob2QsIHZhbHVlKSB7XG4gICAgaWYgKCF0aGlzLl9hdHRhY2hlZCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIkNhbm5vdCBkZWxldGUgY3JlZGVudGlhbCBpbiBpbmFjdGl2ZSAnbWUnIHRvcGljXCIpKTtcbiAgICB9XG4gICAgLy8gU2VuZCB7ZGVsfSBtZXNzYWdlLCByZXR1cm4gcHJvbWlzZVxuICAgIHJldHVybiB0aGlzLl90aW5vZGUuZGVsQ3JlZGVudGlhbChtZXRob2QsIHZhbHVlKS50aGVuKChjdHJsKSA9PiB7XG4gICAgICAvLyBSZW1vdmUgZGVsZXRlZCBjcmVkZW50aWFsIGZyb20gdGhlIGNhY2hlLlxuICAgICAgY29uc3QgaW5kZXggPSB0aGlzLl9jcmVkZW50aWFscy5maW5kSW5kZXgoKGVsKSA9PiB7XG4gICAgICAgIHJldHVybiBlbC5tZXRoID09IG1ldGhvZCAmJiBlbC52YWwgPT0gdmFsdWU7XG4gICAgICB9KTtcbiAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgIHRoaXMuX2NyZWRlbnRpYWxzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICB9XG4gICAgICAvLyBOb3RpZnkgbGlzdGVuZXJzXG4gICAgICBpZiAodGhpcy5vbkNyZWRzVXBkYXRlZCkge1xuICAgICAgICB0aGlzLm9uQ3JlZHNVcGRhdGVkKHRoaXMuX2NyZWRlbnRpYWxzKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjdHJsO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBjYWxsYmFjayBjb250YWN0RmlsdGVyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjb250YWN0IHRvIGNoZWNrIGZvciBpbmNsdXNpb24uXG4gICAqIEByZXR1cm5zIHtib29sZWFufSA8Y29kZT50cnVlPC9jb2RlPiBpZiBjb250YWN0IHNob3VsZCBiZSBwcm9jZXNzZWQsIDxjb2RlPmZhbHNlPC9jb2RlPiB0byBleGNsdWRlIGl0LlxuICAgKi9cbiAgLyoqXG4gICAqIEl0ZXJhdGUgb3ZlciBjYWNoZWQgY29udGFjdHMuXG4gICAqXG4gICAqIEBmdW5jdGlvblxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljTWUjXG4gICAqIEBwYXJhbSB7VG9waWNNZS5Db250YWN0Q2FsbGJhY2t9IGNhbGxiYWNrIC0gQ2FsbGJhY2sgdG8gY2FsbCBmb3IgZWFjaCBjb250YWN0LlxuICAgKiBAcGFyYW0ge2NvbnRhY3RGaWx0ZXI9fSBmaWx0ZXIgLSBPcHRpb25hbGx5IGZpbHRlciBjb250YWN0czsgaW5jbHVkZSBhbGwgaWYgZmlsdGVyIGlzIGZhbHNlLWlzaCwgb3RoZXJ3aXNlXG4gICAqICAgICAgaW5jbHVkZSB0aG9zZSBmb3Igd2hpY2ggZmlsdGVyIHJldHVybnMgdHJ1ZS1pc2guXG4gICAqIEBwYXJhbSB7T2JqZWN0PX0gY29udGV4dCAtIENvbnRleHQgdG8gdXNlIGZvciBjYWxsaW5nIHRoZSBgY2FsbGJhY2tgLCBpLmUuIHRoZSB2YWx1ZSBvZiBgdGhpc2AgaW5zaWRlIHRoZSBjYWxsYmFjay5cbiAgICovXG4gIGNvbnRhY3RzKGNhbGxiYWNrLCBmaWx0ZXIsIGNvbnRleHQpIHtcbiAgICB0aGlzLl90aW5vZGUubWFwVG9waWNzKChjLCBpZHgpID0+IHtcbiAgICAgIGlmIChjLmlzQ29tbVR5cGUoKSAmJiAoIWZpbHRlciB8fCBmaWx0ZXIoYykpKSB7XG4gICAgICAgIGNhbGxiYWNrLmNhbGwoY29udGV4dCwgYywgaWR4KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYSBjb250YWN0IGZyb20gY2FjaGUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWNNZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSBjb250YWN0IHRvIGdldCwgZWl0aGVyIGEgVUlEIChmb3IgcDJwIHRvcGljcykgb3IgYSB0b3BpYyBuYW1lLlxuICAgKiBAcmV0dXJucyB7VGlub2RlLkNvbnRhY3R9IC0gQ29udGFjdCBvciBgdW5kZWZpbmVkYC5cbiAgICovXG4gIGdldENvbnRhY3QobmFtZSkge1xuICAgIHJldHVybiB0aGlzLl90aW5vZGUuY2FjaGVHZXRUb3BpYyhuYW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYWNjZXNzIG1vZGUgb2YgYSBnaXZlbiBjb250YWN0IGZyb20gY2FjaGUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWNNZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSBjb250YWN0IHRvIGdldCBhY2Nlc3MgbW9kZSBmb3IsIGVpdGhlciBhIFVJRCAoZm9yIHAycCB0b3BpY3MpXG4gICAqICAgICAgICBvciBhIHRvcGljIG5hbWU7IGlmIG1pc3NpbmcsIGFjY2VzcyBtb2RlIGZvciB0aGUgJ21lJyB0b3BpYyBpdHNlbGYuXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IC0gYWNjZXNzIG1vZGUsIHN1Y2ggYXMgYFJXUGAuXG4gICAqL1xuICBnZXRBY2Nlc3NNb2RlKG5hbWUpIHtcbiAgICBpZiAobmFtZSkge1xuICAgICAgY29uc3QgY29udCA9IHRoaXMuX3Rpbm9kZS5jYWNoZUdldFRvcGljKG5hbWUpO1xuICAgICAgcmV0dXJuIGNvbnQgPyBjb250LmFjcyA6IG51bGw7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmFjcztcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBjb250YWN0IGlzIGFyY2hpdmVkLCBpLmUuIGNvbnRhY3QucHJpdmF0ZS5hcmNoID09IHRydWUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWNNZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSBjb250YWN0IHRvIGNoZWNrIGFyY2hpdmVkIHN0YXR1cywgZWl0aGVyIGEgVUlEIChmb3IgcDJwIHRvcGljcykgb3IgYSB0b3BpYyBuYW1lLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSB0cnVlIGlmIGNvbnRhY3QgaXMgYXJjaGl2ZWQsIGZhbHNlIG90aGVyd2lzZS5cbiAgICovXG4gIGlzQXJjaGl2ZWQobmFtZSkge1xuICAgIGNvbnN0IGNvbnQgPSB0aGlzLl90aW5vZGUuY2FjaGVHZXRUb3BpYyhuYW1lKTtcbiAgICByZXR1cm4gY29udCAmJiBjb250LnByaXZhdGUgJiYgISFjb250LnByaXZhdGUuYXJjaDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAdHlwZWRlZiBUaW5vZGUuQ3JlZGVudGlhbFxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEB0eXBlIE9iamVjdFxuICAgKiBAcHJvcGVydHkge3N0cmluZ30gbWV0aCAtIHZhbGlkYXRpb24gbWV0aG9kIHN1Y2ggYXMgJ2VtYWlsJyBvciAndGVsJy5cbiAgICogQHByb3BlcnR5IHtzdHJpbmd9IHZhbCAtIGNyZWRlbnRpYWwgdmFsdWUsIGkuZS4gJ2pkb2VAZXhhbXBsZS5jb20nIG9yICcrMTcwMjU1NTEyMzQnXG4gICAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gZG9uZSAtIHRydWUgaWYgY3JlZGVudGlhbCBpcyB2YWxpZGF0ZWQuXG4gICAqL1xuICAvKipcbiAgICogR2V0IHRoZSB1c2VyJ3MgY3JlZGVudGlhbHM6IGVtYWlsLCBwaG9uZSwgZXRjLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljTWUjXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuQ3JlZGVudGlhbFtdfSAtIGFycmF5IG9mIGNyZWRlbnRpYWxzLlxuICAgKi9cbiAgZ2V0Q3JlZGVudGlhbHMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NyZWRlbnRpYWxzO1xuICB9XG59XG5cbi8qKlxuICogQGNsYXNzIFRvcGljRm5kIC0gc3BlY2lhbCBjYXNlIG9mIHtAbGluayBUaW5vZGUuVG9waWN9IGZvciBzZWFyY2hpbmcgZm9yXG4gKiBjb250YWN0cyBhbmQgZ3JvdXAgdG9waWNzLlxuICogQGV4dGVuZHMgVGlub2RlLlRvcGljXG4gKiBAbWVtYmVyb2YgVGlub2RlXG4gKlxuICogQHBhcmFtIHtUb3BpY0ZuZC5DYWxsYmFja3N9IGNhbGxiYWNrcyAtIENhbGxiYWNrcyB0byByZWNlaXZlIHZhcmlvdXMgZXZlbnRzLlxuICovXG5leHBvcnQgY2xhc3MgVG9waWNGbmQgZXh0ZW5kcyBUb3BpYyB7XG4gIC8vIExpc3Qgb2YgdXNlcnMgYW5kIHRvcGljcyB1aWQgb3IgdG9waWNfbmFtZSAtPiBDb250YWN0IG9iamVjdClcbiAgX2NvbnRhY3RzID0ge307XG5cbiAgY29uc3RydWN0b3IoY2FsbGJhY2tzKSB7XG4gICAgc3VwZXIoQ29uc3QuVE9QSUNfRk5ELCBjYWxsYmFja3MpO1xuICB9XG5cbiAgLy8gT3ZlcnJpZGUgdGhlIG9yaWdpbmFsIFRvcGljLl9wcm9jZXNzTWV0YVN1YlxuICBfcHJvY2Vzc01ldGFTdWIoc3Vicykge1xuICAgIGxldCB1cGRhdGVDb3VudCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRoaXMuX2NvbnRhY3RzKS5sZW5ndGg7XG4gICAgLy8gUmVzZXQgY29udGFjdCBsaXN0LlxuICAgIHRoaXMuX2NvbnRhY3RzID0ge307XG4gICAgZm9yIChsZXQgaWR4IGluIHN1YnMpIHtcbiAgICAgIGxldCBzdWIgPSBzdWJzW2lkeF07XG4gICAgICBjb25zdCBpbmRleEJ5ID0gc3ViLnRvcGljID8gc3ViLnRvcGljIDogc3ViLnVzZXI7XG5cbiAgICAgIHN1YiA9IG1lcmdlVG9DYWNoZSh0aGlzLl9jb250YWN0cywgaW5kZXhCeSwgc3ViKTtcbiAgICAgIHVwZGF0ZUNvdW50Kys7XG5cbiAgICAgIGlmICh0aGlzLm9uTWV0YVN1Yikge1xuICAgICAgICB0aGlzLm9uTWV0YVN1YihzdWIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh1cGRhdGVDb3VudCA+IDAgJiYgdGhpcy5vblN1YnNVcGRhdGVkKSB7XG4gICAgICB0aGlzLm9uU3Vic1VwZGF0ZWQoT2JqZWN0LmtleXModGhpcy5fY29udGFjdHMpKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUHVibGlzaGluZyB0byBUb3BpY0ZuZCBpcyBub3Qgc3VwcG9ydGVkLiB7QGxpbmsgVG9waWMjcHVibGlzaH0gaXMgb3ZlcnJpZGVuIGFuZCB0aG93cyBhbiB7RXJyb3J9IGlmIGNhbGxlZC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpY0ZuZCNcbiAgICogQHRocm93cyB7RXJyb3J9IEFsd2F5cyB0aHJvd3MgYW4gZXJyb3IuXG4gICAqL1xuICBwdWJsaXNoKCkge1xuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJQdWJsaXNoaW5nIHRvICdmbmQnIGlzIG5vdCBzdXBwb3J0ZWRcIikpO1xuICB9XG5cbiAgLyoqXG4gICAqIHNldE1ldGEgdG8gVG9waWNGbmQgcmVzZXRzIGNvbnRhY3QgbGlzdCBpbiBhZGRpdGlvbiB0byBzZW5kaW5nIHRoZSBtZXNzYWdlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljRm5kI1xuICAgKiBAcGFyYW0ge1Rpbm9kZS5TZXRQYXJhbXN9IHBhcmFtcyBwYXJhbWV0ZXJzIHRvIHVwZGF0ZS5cbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgdG8gYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgc2VydmVyIHJlc3BvbmRzIHRvIHJlcXVlc3QuXG4gICAqL1xuICBzZXRNZXRhKHBhcmFtcykge1xuICAgIHJldHVybiBPYmplY3QuZ2V0UHJvdG90eXBlT2YoVG9waWNGbmQucHJvdG90eXBlKS5zZXRNZXRhLmNhbGwodGhpcywgcGFyYW1zKS50aGVuKCgpID0+IHtcbiAgICAgIGlmIChPYmplY3Qua2V5cyh0aGlzLl9jb250YWN0cykubGVuZ3RoID4gMCkge1xuICAgICAgICB0aGlzLl9jb250YWN0cyA9IHt9O1xuICAgICAgICBpZiAodGhpcy5vblN1YnNVcGRhdGVkKSB7XG4gICAgICAgICAgdGhpcy5vblN1YnNVcGRhdGVkKFtdKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEl0ZXJhdGUgb3ZlciBmb3VuZCBjb250YWN0cy4gSWYgY2FsbGJhY2sgaXMgdW5kZWZpbmVkLCB1c2Uge0BsaW5rIHRoaXMub25NZXRhU3VifS5cbiAgICogQGZ1bmN0aW9uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWNGbmQjXG4gICAqIEBwYXJhbSB7VG9waWNGbmQuQ29udGFjdENhbGxiYWNrfSBjYWxsYmFjayAtIENhbGxiYWNrIHRvIGNhbGwgZm9yIGVhY2ggY29udGFjdC5cbiAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHQgLSBDb250ZXh0IHRvIHVzZSBmb3IgY2FsbGluZyB0aGUgYGNhbGxiYWNrYCwgaS5lLiB0aGUgdmFsdWUgb2YgYHRoaXNgIGluc2lkZSB0aGUgY2FsbGJhY2suXG4gICAqL1xuICBjb250YWN0cyhjYWxsYmFjaywgY29udGV4dCkge1xuICAgIGNvbnN0IGNiID0gKGNhbGxiYWNrIHx8IHRoaXMub25NZXRhU3ViKTtcbiAgICBpZiAoY2IpIHtcbiAgICAgIGZvciAobGV0IGlkeCBpbiB0aGlzLl9jb250YWN0cykge1xuICAgICAgICBjYi5jYWxsKGNvbnRleHQsIHRoaXMuX2NvbnRhY3RzW2lkeF0sIGlkeCwgdGhpcy5fY29udGFjdHMpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIiwiLyoqXG4gKiBAZmlsZSBVdGlsaXRpZXMgdXNlZCBpbiBtdWx0aXBsZSBwbGFjZXMuXG4gKlxuICogQGNvcHlyaWdodCAyMDE1LTIwMjIgVGlub2RlIExMQy5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgQWNjZXNzTW9kZSBmcm9tICcuL2FjY2Vzcy1tb2RlLmpzJztcbmltcG9ydCBERUxfQ0hBUiBmcm9tICcuL2NvbmZpZy5qcyc7XG5cbi8vIEF0dGVtcHQgdG8gY29udmVydCBkYXRlIGFuZCBBY2Nlc3NNb2RlIHN0cmluZ3MgdG8gb2JqZWN0cy5cbmV4cG9ydCBmdW5jdGlvbiBqc29uUGFyc2VIZWxwZXIoa2V5LCB2YWwpIHtcbiAgLy8gVHJ5IHRvIGNvbnZlcnQgc3RyaW5nIHRpbWVzdGFtcHMgd2l0aCBvcHRpb25hbCBtaWxsaXNlY29uZHMgdG8gRGF0ZSxcbiAgLy8gZS5nLiAyMDE1LTA5LTAyVDAxOjQ1OjQzWy4xMjNdWlxuICBpZiAodHlwZW9mIHZhbCA9PSAnc3RyaW5nJyAmJiB2YWwubGVuZ3RoID49IDIwICYmIHZhbC5sZW5ndGggPD0gMjQgJiYgWyd0cycsICd0b3VjaGVkJywgJ3VwZGF0ZWQnLCAnY3JlYXRlZCcsICd3aGVuJywgJ2RlbGV0ZWQnLCAnZXhwaXJlcyddLmluY2x1ZGVzKGtleSkpIHtcblxuICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSh2YWwpO1xuICAgIGlmICghaXNOYU4oZGF0ZSkpIHtcbiAgICAgIHJldHVybiBkYXRlO1xuICAgIH1cbiAgfSBlbHNlIGlmIChrZXkgPT09ICdhY3MnICYmIHR5cGVvZiB2YWwgPT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIG5ldyBBY2Nlc3NNb2RlKHZhbCk7XG4gIH1cbiAgcmV0dXJuIHZhbDtcbn1cblxuLy8gQ2hlY2tzIGlmIFVSTCBpcyBhIHJlbGF0aXZlIHVybCwgaS5lLiBoYXMgbm8gJ3NjaGVtZTovLycsIGluY2x1ZGluZyB0aGUgY2FzZSBvZiBtaXNzaW5nIHNjaGVtZSAnLy8nLlxuLy8gVGhlIHNjaGVtZSBpcyBleHBlY3RlZCB0byBiZSBSRkMtY29tcGxpYW50LCBlLmcuIFthLXpdW2EtejAtOSsuLV0qXG4vLyBleGFtcGxlLmh0bWwgLSBva1xuLy8gaHR0cHM6ZXhhbXBsZS5jb20gLSBub3Qgb2suXG4vLyBodHRwOi9leGFtcGxlLmNvbSAtIG5vdCBvay5cbi8vICcg4oayIGh0dHBzOi8vZXhhbXBsZS5jb20nIC0gbm90IG9rLiAo4oayIG1lYW5zIGNhcnJpYWdlIHJldHVybilcbmV4cG9ydCBmdW5jdGlvbiBpc1VybFJlbGF0aXZlKHVybCkge1xuICByZXR1cm4gdXJsICYmICEvXlxccyooW2Etel1bYS16MC05Ky4tXSo6fFxcL1xcLykvaW0udGVzdCh1cmwpO1xufVxuXG5mdW5jdGlvbiBpc1ZhbGlkRGF0ZShkKSB7XG4gIHJldHVybiAoZCBpbnN0YW5jZW9mIERhdGUpICYmICFpc05hTihkKSAmJiAoZC5nZXRUaW1lKCkgIT0gMCk7XG59XG5cbi8vIFJGQzMzMzkgZm9ybWF0ZXIgb2YgRGF0ZVxuZXhwb3J0IGZ1bmN0aW9uIHJmYzMzMzlEYXRlU3RyaW5nKGQpIHtcbiAgaWYgKCFpc1ZhbGlkRGF0ZShkKSkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBjb25zdCBwYWQgPSBmdW5jdGlvbih2YWwsIHNwKSB7XG4gICAgc3AgPSBzcCB8fCAyO1xuICAgIHJldHVybiAnMCcucmVwZWF0KHNwIC0gKCcnICsgdmFsKS5sZW5ndGgpICsgdmFsO1xuICB9O1xuXG4gIGNvbnN0IG1pbGxpcyA9IGQuZ2V0VVRDTWlsbGlzZWNvbmRzKCk7XG4gIHJldHVybiBkLmdldFVUQ0Z1bGxZZWFyKCkgKyAnLScgKyBwYWQoZC5nZXRVVENNb250aCgpICsgMSkgKyAnLScgKyBwYWQoZC5nZXRVVENEYXRlKCkpICtcbiAgICAnVCcgKyBwYWQoZC5nZXRVVENIb3VycygpKSArICc6JyArIHBhZChkLmdldFVUQ01pbnV0ZXMoKSkgKyAnOicgKyBwYWQoZC5nZXRVVENTZWNvbmRzKCkpICtcbiAgICAobWlsbGlzID8gJy4nICsgcGFkKG1pbGxpcywgMykgOiAnJykgKyAnWic7XG59XG5cbi8vIFJlY3Vyc2l2ZWx5IG1lcmdlIHNyYydzIG93biBwcm9wZXJ0aWVzIHRvIGRzdC5cbi8vIElnbm9yZSBwcm9wZXJ0aWVzIHdoZXJlIGlnbm9yZVtwcm9wZXJ0eV0gaXMgdHJ1ZS5cbi8vIEFycmF5IGFuZCBEYXRlIG9iamVjdHMgYXJlIHNoYWxsb3ctY29waWVkLlxuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlT2JqKGRzdCwgc3JjLCBpZ25vcmUpIHtcbiAgaWYgKHR5cGVvZiBzcmMgIT0gJ29iamVjdCcpIHtcbiAgICBpZiAoc3JjID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBkc3Q7XG4gICAgfVxuICAgIGlmIChzcmMgPT09IERFTF9DSEFSKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICByZXR1cm4gc3JjO1xuICB9XG4gIC8vIEpTIGlzIGNyYXp5OiB0eXBlb2YgbnVsbCBpcyAnb2JqZWN0Jy5cbiAgaWYgKHNyYyA9PT0gbnVsbCkge1xuICAgIHJldHVybiBzcmM7XG4gIH1cblxuICAvLyBIYW5kbGUgRGF0ZVxuICBpZiAoc3JjIGluc3RhbmNlb2YgRGF0ZSAmJiAhaXNOYU4oc3JjKSkge1xuICAgIHJldHVybiAoIWRzdCB8fCAhKGRzdCBpbnN0YW5jZW9mIERhdGUpIHx8IGlzTmFOKGRzdCkgfHwgZHN0IDwgc3JjKSA/IHNyYyA6IGRzdDtcbiAgfVxuXG4gIC8vIEFjY2VzcyBtb2RlXG4gIGlmIChzcmMgaW5zdGFuY2VvZiBBY2Nlc3NNb2RlKSB7XG4gICAgcmV0dXJuIG5ldyBBY2Nlc3NNb2RlKHNyYyk7XG4gIH1cblxuICAvLyBIYW5kbGUgQXJyYXlcbiAgaWYgKHNyYyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgcmV0dXJuIHNyYztcbiAgfVxuXG4gIGlmICghZHN0IHx8IGRzdCA9PT0gREVMX0NIQVIpIHtcbiAgICBkc3QgPSBzcmMuY29uc3RydWN0b3IoKTtcbiAgfVxuXG4gIGZvciAobGV0IHByb3AgaW4gc3JjKSB7XG4gICAgaWYgKHNyYy5oYXNPd25Qcm9wZXJ0eShwcm9wKSAmJiAoIWlnbm9yZSB8fCAhaWdub3JlW3Byb3BdKSAmJiAocHJvcCAhPSAnX25vRm9yd2FyZGluZycpKSB7XG4gICAgICBkc3RbcHJvcF0gPSBtZXJnZU9iaihkc3RbcHJvcF0sIHNyY1twcm9wXSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBkc3Q7XG59XG5cbi8vIFVwZGF0ZSBvYmplY3Qgc3RvcmVkIGluIGEgY2FjaGUuIFJldHVybnMgdXBkYXRlZCB2YWx1ZS5cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZVRvQ2FjaGUoY2FjaGUsIGtleSwgbmV3dmFsLCBpZ25vcmUpIHtcbiAgY2FjaGVba2V5XSA9IG1lcmdlT2JqKGNhY2hlW2tleV0sIG5ld3ZhbCwgaWdub3JlKTtcbiAgcmV0dXJuIGNhY2hlW2tleV07XG59XG5cbi8vIFN0cmlwcyBhbGwgdmFsdWVzIGZyb20gYW4gb2JqZWN0IG9mIHRoZXkgZXZhbHVhdGUgdG8gZmFsc2Ugb3IgaWYgdGhlaXIgbmFtZSBzdGFydHMgd2l0aCAnXycuXG4vLyBVc2VkIG9uIGFsbCBvdXRnb2luZyBvYmplY3QgYmVmb3JlIHNlcmlhbGl6YXRpb24gdG8gc3RyaW5nLlxuZXhwb3J0IGZ1bmN0aW9uIHNpbXBsaWZ5KG9iaikge1xuICBPYmplY3Qua2V5cyhvYmopLmZvckVhY2goKGtleSkgPT4ge1xuICAgIGlmIChrZXlbMF0gPT0gJ18nKSB7XG4gICAgICAvLyBTdHJpcCBmaWVsZHMgbGlrZSBcIm9iai5fa2V5XCIuXG4gICAgICBkZWxldGUgb2JqW2tleV07XG4gICAgfSBlbHNlIGlmICghb2JqW2tleV0pIHtcbiAgICAgIC8vIFN0cmlwIGZpZWxkcyB3aGljaCBldmFsdWF0ZSB0byBmYWxzZS5cbiAgICAgIGRlbGV0ZSBvYmpba2V5XTtcbiAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkob2JqW2tleV0pICYmIG9ialtrZXldLmxlbmd0aCA9PSAwKSB7XG4gICAgICAvLyBTdHJpcCBlbXB0eSBhcnJheXMuXG4gICAgICBkZWxldGUgb2JqW2tleV07XG4gICAgfSBlbHNlIGlmICghb2JqW2tleV0pIHtcbiAgICAgIC8vIFN0cmlwIGZpZWxkcyB3aGljaCBldmFsdWF0ZSB0byBmYWxzZS5cbiAgICAgIGRlbGV0ZSBvYmpba2V5XTtcbiAgICB9IGVsc2UgaWYgKG9ialtrZXldIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgLy8gU3RyaXAgaW52YWxpZCBvciB6ZXJvIGRhdGUuXG4gICAgICBpZiAoIWlzVmFsaWREYXRlKG9ialtrZXldKSkge1xuICAgICAgICBkZWxldGUgb2JqW2tleV07XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0eXBlb2Ygb2JqW2tleV0gPT0gJ29iamVjdCcpIHtcbiAgICAgIHNpbXBsaWZ5KG9ialtrZXldKTtcbiAgICAgIC8vIFN0cmlwIGVtcHR5IG9iamVjdHMuXG4gICAgICBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMob2JqW2tleV0pLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgIGRlbGV0ZSBvYmpba2V5XTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gb2JqO1xufTtcblxuXG4vLyBUcmltIHdoaXRlc3BhY2UsIHN0cmlwIGVtcHR5IGFuZCBkdXBsaWNhdGUgZWxlbWVudHMgZWxlbWVudHMuXG4vLyBJZiB0aGUgcmVzdWx0IGlzIGFuIGVtcHR5IGFycmF5LCBhZGQgYSBzaW5nbGUgZWxlbWVudCBcIlxcdTI0MjFcIiAoVW5pY29kZSBEZWwgY2hhcmFjdGVyKS5cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVBcnJheShhcnIpIHtcbiAgbGV0IG91dCA9IFtdO1xuICBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSB7XG4gICAgLy8gVHJpbSwgdGhyb3cgYXdheSB2ZXJ5IHNob3J0IGFuZCBlbXB0eSB0YWdzLlxuICAgIGZvciAobGV0IGkgPSAwLCBsID0gYXJyLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgbGV0IHQgPSBhcnJbaV07XG4gICAgICBpZiAodCkge1xuICAgICAgICB0ID0gdC50cmltKCkudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgaWYgKHQubGVuZ3RoID4gMSkge1xuICAgICAgICAgIG91dC5wdXNoKHQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIG91dC5zb3J0KCkuZmlsdGVyKGZ1bmN0aW9uKGl0ZW0sIHBvcywgYXJ5KSB7XG4gICAgICByZXR1cm4gIXBvcyB8fCBpdGVtICE9IGFyeVtwb3MgLSAxXTtcbiAgICB9KTtcbiAgfVxuICBpZiAob3V0Lmxlbmd0aCA9PSAwKSB7XG4gICAgLy8gQWRkIHNpbmdsZSB0YWcgd2l0aCBhIFVuaWNvZGUgRGVsIGNoYXJhY3Rlciwgb3RoZXJ3aXNlIGFuIGFtcHR5IGFycmF5XG4gICAgLy8gaXMgYW1iaWd1b3MuIFRoZSBEZWwgdGFnIHdpbGwgYmUgc3RyaXBwZWQgYnkgdGhlIHNlcnZlci5cbiAgICBvdXQucHVzaChERUxfQ0hBUik7XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cbiIsIm1vZHVsZS5leHBvcnRzPXtcInZlcnNpb25cIjogXCIwLjE5LjAtYWxwaGExXCJ9XG4iXX0=

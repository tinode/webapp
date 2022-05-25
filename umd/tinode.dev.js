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

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }

function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }

function _classStaticPrivateFieldSpecSet(receiver, classConstructor, descriptor, value) { _classCheckPrivateStaticAccess(receiver, classConstructor); _classCheckPrivateStaticFieldDescriptor(descriptor, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }

function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }

function _classStaticPrivateFieldSpecGet(receiver, classConstructor, descriptor) { _classCheckPrivateStaticAccess(receiver, classConstructor); _classCheckPrivateStaticFieldDescriptor(descriptor, "get"); return _classApplyDescriptorGet(receiver, descriptor); }

function _classCheckPrivateStaticFieldDescriptor(descriptor, action) { if (descriptor === undefined) { throw new TypeError("attempted to " + action + " private static field before its declaration"); } }

function _classCheckPrivateStaticAccess(receiver, classConstructor) { if (receiver !== classConstructor) { throw new TypeError("Private static access of wrong provenance"); } }

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
      _classStaticPrivateFieldSpecGet(Connection, Connection, _log).call(Connection, "Unknown or invalid network transport. Running under Node? Call 'Tinode.setNetworkProviders()'.");

      throw new Error("Unknown or invalid network transport. Running under Node? Call 'Tinode.setNetworkProviders()'.");
    }
  }

  static setNetworkProviders(wsProvider, xhrProvider) {
    WebSocketProvider = wsProvider;
    XHRProvider = xhrProvider;
  }

  static set logger(l) {
    _classStaticPrivateFieldSpecSet(Connection, Connection, _log, l);
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

function _boffReconnect2() {
  clearTimeout(_classPrivateFieldGet(this, _boffTimer));

  const timeout = _BOFF_BASE * (Math.pow(2, _classPrivateFieldGet(this, _boffIteration)) * (1.0 + _BOFF_JITTER * Math.random()));

  _classPrivateFieldSet(this, _boffIteration, _classPrivateFieldGet(this, _boffIteration) >= _BOFF_MAX_ITER ? _classPrivateFieldGet(this, _boffIteration) : _classPrivateFieldGet(this, _boffIteration) + 1);

  if (this.onAutoreconnectIteration) {
    this.onAutoreconnectIteration(timeout);
  }

  _classPrivateFieldSet(this, _boffTimer, setTimeout(_ => {
    _classStaticPrivateFieldSpecGet(Connection, Connection, _log).call(Connection, "Reconnecting, iter=".concat(_classPrivateFieldGet(this, _boffIteration), ", timeout=").concat(timeout));

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

    poller.open('POST', url_, true);
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

      _classStaticPrivateFieldSpecGet(Connection, Connection, _log).call(Connection, "LP connecting to:", url);

      _poller = lp_poller(url, resolve, reject);

      _poller.send(null);
    }).catch(err => {
      _classStaticPrivateFieldSpecGet(Connection, Connection, _log).call(Connection, "LP connection failed:", err);
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

      _classStaticPrivateFieldSpecGet(Connection, Connection, _log).call(Connection, "WS connecting to: ", url);

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

var _log = {
  writable: true,
  value: _ => {}
};
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
      value: _ => {}
    });

    _classPrivateFieldInitSpec(this, _logger, {
      writable: true,
      value: _ => {}
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

  markTopicAsDeleted(name) {
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
        topic._deleted = true;
        trx.objectStore('topic').put(topic);
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
  tree = lightEntity(tree, node => node.type == 'IM' ? ['val'] : null);
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
    tree = lightEntity(tree, node => node.type == 'IM' ? ['val'] : null);
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
 * @version 0.19
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

    _connection.default.logger = this.logger;
    _drafty.default.logger = this.logger;

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
      this.logger('DB', err);
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

          delete topic._new;
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

        this.logger("Persistent cache initialized.");
      }).catch(err => {
        if (onComplete) {
          onComplete(err);
        }

        this.logger("Failed to initialize persistent cache:", err);
      });
    } else {
      this._db.deleteDatabase().then(() => {
        if (onComplete) {
          onComplete();
        }
      });
    }
  }

  logger(str) {
    if (this._loggingEnabled) {
      const d = new Date();
      const dateString = ('0' + d.getUTCHours()).slice(-2) + ':' + ('0' + d.getUTCMinutes()).slice(-2) + ':' + ('0' + d.getUTCSeconds()).slice(-2) + '.' + ('00' + d.getUTCMilliseconds()).slice(-3);

      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      console.log('[' + dateString + ']', str, args.join(' '));
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
        attachments: attachments.filter(ref => Tinode.isRelativeURL(ref))
      };
    }

    return _classPrivateMethodGet(this, _send, _send2).call(this, msg, pub.id);
  }

  oobNotification(what, topicName, seq, act, mode) {
    const me = this.getMeTopic();

    if (what == 'sub') {
      let acs = new _accessMode.default(mode);
      let pres = !acs.mode || acs.mode == _accessMode.default._NONE ? {
        what: 'gone',
        src: topicName
      } : {
        what: 'acs',
        src: topicName,
        dacs: mode
      };

      me._routePres(pres);
    } else {
      const topic = _classPrivateMethodGet(this, _cacheGet, _cacheGet2).call(this, 'topic', topicName);

      if (topic) {
        topic._updateReceived(seq, act);

        me._refreshContact('msg', topic);
      }
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

  report(action, target) {
    return this.publish(Const.TOPIC_SYS, _drafty.default.attachJSON(null, {
      'action': action,
      'target': target
    }));
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
  this.logger("out: " + (this._trimLongStrings ? JSON.stringify(pkt, jsonLoggerHelper) : msg));

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
          this.logger("ERROR: Unknown packet received.");
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
          this.logger("Promise expired", id);
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

  topic._cachePutSelf = _ => {
    _classPrivateMethodGet(this, _cachePut, _cachePut2).call(this, 'topic', topic.name, topic);
  };

  topic._cacheDelSelf = _ => {
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
        delete this._new;

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

    if (this._sending) {
      return Promise.reject(new Error("The message is already being sent"));
    }

    pub._sending = true;
    pub._failed = false;
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

        const topic = this._tinode.getTopic(topicName);

        if (topic._new) {
          delete topic._new;
        }

        cont = (0, _utils.mergeObj)(topic, sub);

        this._tinode._db.updTopic(cont);

        if (Topic.isP2PTopicName(topicName)) {
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

            this._tinode._db.markTopicAsDeleted(pres.src);
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
module.exports={"version": "0.19.0-beta1"}

},{}]},{},[9])(9)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYWNjZXNzLW1vZGUuanMiLCJzcmMvY2J1ZmZlci5qcyIsInNyYy9jb25maWcuanMiLCJzcmMvY29ubmVjdGlvbi5qcyIsInNyYy9kYi5qcyIsInNyYy9kcmFmdHkuanMiLCJzcmMvbGFyZ2UtZmlsZS5qcyIsInNyYy9tZXRhLWJ1aWxkZXIuanMiLCJzcmMvdGlub2RlLmpzIiwic3JjL3RvcGljLmpzIiwic3JjL3V0aWxzLmpzIiwidmVyc2lvbi5qc29uIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDS0E7Ozs7Ozs7Ozs7O0FBY2UsTUFBTSxVQUFOLENBQWlCO0VBQzlCLFdBQVcsQ0FBQyxHQUFELEVBQU07SUFDZixJQUFJLEdBQUosRUFBUztNQUNQLEtBQUssS0FBTCxHQUFhLE9BQU8sR0FBRyxDQUFDLEtBQVgsSUFBb0IsUUFBcEIsR0FBK0IsR0FBRyxDQUFDLEtBQW5DLEdBQTJDLFVBQVUsQ0FBQyxNQUFYLENBQWtCLEdBQUcsQ0FBQyxLQUF0QixDQUF4RDtNQUNBLEtBQUssSUFBTCxHQUFZLE9BQU8sR0FBRyxDQUFDLElBQVgsSUFBbUIsUUFBbkIsR0FBOEIsR0FBRyxDQUFDLElBQWxDLEdBQXlDLFVBQVUsQ0FBQyxNQUFYLENBQWtCLEdBQUcsQ0FBQyxJQUF0QixDQUFyRDtNQUNBLEtBQUssSUFBTCxHQUFZLEdBQUcsQ0FBQyxJQUFKLEdBQVksT0FBTyxHQUFHLENBQUMsSUFBWCxJQUFtQixRQUFuQixHQUE4QixHQUFHLENBQUMsSUFBbEMsR0FBeUMsVUFBVSxDQUFDLE1BQVgsQ0FBa0IsR0FBRyxDQUFDLElBQXRCLENBQXJELEdBQ1QsS0FBSyxLQUFMLEdBQWEsS0FBSyxJQURyQjtJQUVEO0VBQ0Y7O0VBaUJZLE9BQU4sTUFBTSxDQUFDLEdBQUQsRUFBTTtJQUNqQixJQUFJLENBQUMsR0FBTCxFQUFVO01BQ1IsT0FBTyxJQUFQO0lBQ0QsQ0FGRCxNQUVPLElB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QUNGLElBQUksRUFBRSxRQURKO0lBRUYsTUFBTSxFQUFFO0VBRk4sQ0FMWTtFQVNoQixFQUFFLEVBQUU7SUFDRixJQUFJLEVBQUUsSUFESjtJQUVGLE1BQU0sRUFBRTtFQUZOLENBVFk7RUFhaEIsRUFBRSxFQUFFO0lBQ0YsSUFBSSxFQUFFLElBREo7SUFFRixNQUFNLEVBQUU7RUFGTixDQWJZO0VBaUJoQixFQUFFLEVBQUU7SUFDRixJQUFJLEVBQUUsS0FESjtJQUVGLE1BQU0sRUFBRTtFQUZOLENBakJZO0VBcUJoQixFQUFFLEVBQUU7SUFDRixJQUFJLEVBQUUsR0FESjtJQUVGLE1BQU0sRUFBRTtFQUZOLENBckJZO0VBeUJoQixFQUFFLEVBQUU7SUFDRixJQUFJLEVBQUUsRUFESjtJQUVGLE1BQU0sRUFBRTtFQUZOLENBekJZO0VBNkJoQixFQUFFLEVBQUU7SUFDRixJQUFJLEVBQUUsS0FESjtJQUVGLE1BQU0sRUFBRTtFQUZOLENBN0JZO0VBaUNoQixFQUFFLEVBQUU7SUFDRixJQUFJLEVBQUUsRUFESjtJQUVGLE1BQU0sRUFBRTtFQUZOLENBakNZO0VBcUNoQixFQUFFLEVBQUU7SUFDRixJQUFJLEVBQUUsTUFESjtJQUVGLE1BQU0sRUFBRTtFQUZOLENBckNZO0VBeUNoQixFQUFFLEVBQUU7SUFDRixJQUFJLEVBQUUsR0FESjtJQUVGLE1BQU0sRUFBRTtFQUZOLENBekNZO0VBNkNoQixFQUFFLEVBQUU7SUFDRixJQUFJLEVBQUUsS0FESjtJQUVGLE1BQU0sRUFBRTtFQUZOLENBN0NZO0VBaURoQixFQUFFLEVBQUU7SUFDRixJQUFJLEVBQUUsR0FESjtJQUVGLE1BQU0sRUFBRTtFQUZOLENBakRZO0VBcURoQixFQUFFLEVBQUU7SUFDRixJQUFJLEVBQUUsR0FESjtJQUVGLE1BQU0sRUFBRTtFQUZOLENBckRZO0VBeURoQixFQUFFLEVBQUU7SUFDRixJQUFJLEVBQUUsS0FESjtJQUVGLE1BQU0sRUFBRTtFQUZOLENBekRZO0VBNkRoQixFQUFFLEVBQUU7SUFDRixJQUFJLEVBQUUsS0FESjtJQUVG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QUFrQjtVQUNoQixHQUFHLENBQUMsSUFBSixDQUFTLENBQVQ7UUFDRDtNQUNGO0lBQ0Y7O0lBQ0QsR0FBRyxDQUFDLElBQUosR0FBVyxNQUFYLENBQWtCLFVBQVMsSUFBVCxFQUFlLEdBQWYsRUFBb0IsR0FBcEIsRUFBeUI7TUFDekMsT0FBTyxDQUFDLEdBQUQsSUFBUSxJQUFJLElBQUksR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFQLENBQTFCO0lBQ0QsQ0FGRDtFQUdEOztFQUNELElBQUksR0FBRyxDQUFDLE1BQUosSUFBYyxDQUFsQixFQUFxQjtJQUduQixHQUFHLENBQUMsSUFBSixDQUFTLGVBQVQ7RUFDRDs7RUFDRCxPQUFPLEdBQVA7QUFDRDs7O0FDMUtEO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvKipcbiAqIEBmaWxlIEFjY2VzcyBjb250cm9sIG1vZGVsLlxuICpcbiAqIEBjb3B5cmlnaHQgMjAxNS0yMDIyIFRpbm9kZSBMTEMuXG4gKi9cbid1c2Ugc3RyaWN0JztcblxuLy8gTk9URSBUTyBERVZFTE9QRVJTOlxuLy8gTG9jYWxpemFibGUgc3RyaW5ncyBzaG91bGQgYmUgZG91YmxlIHF1b3RlZCBcItGB0YLRgNC+0LrQsCDQvdCwINC00YDRg9Cz0L7QvCDRj9C30YvQutC1XCIsXG4vLyBub24tbG9jYWxpemFibGUgc3RyaW5ncyBzaG91bGQgYmUgc2luZ2xlIHF1b3RlZCAnbm9uLWxvY2FsaXplZCcuXG5cbi8qKlxuICogSGVscGVyIGNsYXNzIGZvciBoYW5kbGluZyBhY2Nlc3MgbW9kZS5cbiAqXG4gKiBAY2xhc3MgQWNjZXNzTW9kZVxuICogQG1lbWJlcm9mIFRpbm9kZVxuICpcbiAqIEBwYXJhbSB7QWNjZXNzTW9kZXxPYmplY3Q9fSBhY3MgLSBBY2Nlc3NNb2RlIHRvIGNvcHkgb3IgYWNjZXNzIG1vZGUgb2JqZWN0IHJlY2VpdmVkIGZyb20gdGhlIHNlcnZlci5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQWNjZXNzTW9kZSB7XG4gIGNvbnN0cnVjdG9yKGFjcykge1xuICAgIGlmIChhY3MpIHtcbiAgICAgIHRoaXMuZ2l2ZW4gPSB0eXBlb2YgYWNzLmdpdmVuID09ICdudW1iZXInID8gYWNzLmdpdmVuIDogQWNjZXNzTW9kZS5kZWNvZGUoYWNzLmdpdmVuKTtcbiAgICAgIHRoaXMud2FudCA9IHR5cGVvZiBhY3Mud2FudCA9PSAnbnVtYmVyJyA/IGFjcy53YW50IDogQWNjZXNzTW9kZS5kZWNvZGUoYWNzLndhbnQpO1xuICAgICAgdGhpcy5tb2RlID0gYWNzLm1vZGUgPyAodHlwZW9mIGFjcy5tb2RlID09ICdudW1iZXInID8gYWNzLm1vZGUgOiBBY2Nlc3NNb2RlLmRlY29kZShhY3MubW9kZSkpIDpcbiAgICAgICAgKHRoaXMuZ2l2ZW4gJiB0aGlzLndhbnQpO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyAjY2hlY2tGbGFnKHZhbCwgc2lkZSwgZmxhZykge1xuICAgIHNpZGUgPSBzaWRlIHx8ICdtb2RlJztcbiAgICBpZiAoWydnaXZlbicsICd3YW50JywgJ21vZGUnXS5pbmNsdWRlcyhzaWRlKSkge1xuICAgICAgcmV0dXJuICgodmFsW3NpZGVdICYgZmxhZykgIT0gMCk7XG4gICAgfVxuICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBBY2Nlc3NNb2RlIGNvbXBvbmVudCAnJHtzaWRlfSdgKTtcbiAgfVxuICAvKipcbiAgICogUGFyc2Ugc3RyaW5nIGludG8gYW4gYWNjZXNzIG1vZGUgdmFsdWUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nIHwgTnVtYmVyfSBtb2RlIC0gZWl0aGVyIGEgU3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBhY2Nlc3MgbW9kZSB0byBwYXJzZSBvciBhIHNldCBvZiBiaXRzIHRvIGFzc2lnbi5cbiAgICogQHJldHVybnMge251bWJlcn0gLSBBY2Nlc3MgbW9kZSBhcyBhIG51bWVyaWMgdmFsdWUuXG4gICAqL1xuICBzdGF0aWMgZGVjb2RlKHN0cikge1xuICAgIGlmICghc3RyKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBzdHIgPT0gJ251bWJlcicpIHtcbiAgICAgIHJldHVybiBzdHIgJiBBY2Nlc3NNb2RlLl9CSVRNQVNLO1xuICAgIH0gZWxzZSBpZiAoc3RyID09PSAnTicgfHwgc3RyID09PSAnbicpIHtcbiAgICAgIHJldHVybiBBY2Nlc3NNb2RlLl9OT05FO1xuICAgIH1cblxuICAgIGNvbnN0IGJpdG1hc2sgPSB7XG4gICAgICAnSic6IEFjY2Vzc01vZGUuX0pPSU4sXG4gICAgICAnUic6IEFjY2Vzc01vZGUuX1JFQUQsXG4gICAgICAnVyc6IEFjY2Vzc01vZGUuX1dSSVRFLFxuICAgICAgJ1AnOiBBY2Nlc3NNb2RlLl9QUkVTLFxuICAgICAgJ0EnOiBBY2Nlc3NNb2RlLl9BUFBST1ZFLFxuICAgICAgJ1MnOiBBY2Nlc3NNb2RlLl9TSEFSRSxcbiAgICAgICdEJzogQWNjZXNzTW9kZS5fREVMRVRFLFxuICAgICAgJ08nOiBBY2Nlc3NNb2RlLl9PV05FUlxuICAgIH07XG5cbiAgICBsZXQgbTAgPSBBY2Nlc3NNb2RlLl9OT05FO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGJpdCA9IGJpdG1hc2tbc3RyLmNoYXJBdChpKS50b1VwcGVyQ2FzZSgpXTtcbiAgICAgIGlmICghYml0KSB7XG4gICAgICAgIC8vIFVucmVjb2duaXplZCBiaXQsIHNraXAuXG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgbTAgfD0gYml0O1xuICAgIH1cbiAgICByZXR1cm4gbTA7XG4gIH1cbiAgLyoqXG4gICAqIENvbnZlcnQgbnVtZXJpYyByZXByZXNlbnRhdGlvbiBvZiB0aGUgYWNjZXNzIG1vZGUgaW50byBhIHN0cmluZy5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IHZhbCAtIGFjY2VzcyBtb2RlIHZhbHVlIHRvIGNvbnZlcnQgdG8gYSBzdHJpbmcuXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IC0gQWNjZXNzIG1vZGUgYXMgYSBzdHJpbmcuXG4gICAqL1xuICBzdGF0aWMgZW5jb2RlKHZhbCkge1xuICAgIGlmICh2YWwgPT09IG51bGwgfHwgdmFsID09PSBBY2Nlc3NNb2RlLl9JTlZBTElEKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9IGVsc2UgaWYgKHZhbCA9PT0gQWNjZXNzTW9kZS5fTk9ORSkge1xuICAgICAgcmV0dXJuICdOJztcbiAgICB9XG5cbiAgICBjb25zdCBiaXRtYXNrID0gWydKJywgJ1InLCAnVycsICdQJywgJ0EnLCAnUycsICdEJywgJ08nXTtcbiAgICBsZXQgcmVzID0gJyc7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBiaXRtYXNrLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoKHZhbCAmICgxIDw8IGkpKSAhPSAwKSB7XG4gICAgICAgIHJlcyA9IHJlcyArIGJpdG1hc2tbaV07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXM7XG4gIH1cbiAgLyoqXG4gICAqIFVwZGF0ZSBudW1lcmljIHJlcHJlc2VudGF0aW9uIG9mIGFjY2VzcyBtb2RlIHdpdGggdGhlIG5ldyB2YWx1ZS4gVGhlIHZhbHVlXG4gICAqIGlzIG9uZSBvZiB0aGUgZm9sbG93aW5nOlxuICAgKiAgLSBhIHN0cmluZyBzdGFydGluZyB3aXRoIDxjb2RlPicrJzwvY29kZT4gb3IgPGNvZGU+Jy0nPC9jb2RlPiB0aGVuIHRoZSBiaXRzIHRvIGFkZCBvciByZW1vdmUsIGUuZy4gPGNvZGU+JytSLVcnPC9jb2RlPiBvciA8Y29kZT4nLVBTJzwvY29kZT4uXG4gICAqICAtIGEgbmV3IHZhbHVlIG9mIGFjY2VzcyBtb2RlXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB2YWwgLSBhY2Nlc3MgbW9kZSB2YWx1ZSB0byB1cGRhdGUuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1cGQgLSB1cGRhdGUgdG8gYXBwbHkgdG8gdmFsLlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSAtIHVwZGF0ZWQgYWNjZXNzIG1vZGUuXG4gICAqL1xuICBzdGF0aWMgdXBkYXRlKHZhbCwgdXBkKSB7XG4gICAgaWYgKCF1cGQgfHwgdHlwZW9mIHVwZCAhPSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIHZhbDtcbiAgICB9XG5cbiAgICBsZXQgYWN0aW9uID0gdXBkLmNoYXJBdCgwKTtcbiAgICBpZiAoYWN0aW9uID09ICcrJyB8fCBhY3Rpb24gPT0gJy0nKSB7XG4gICAgICBsZXQgdmFsMCA9IHZhbDtcbiAgICAgIC8vIFNwbGl0IGRlbHRhLXN0cmluZyBsaWtlICcrQUJDLURFRitaJyBpbnRvIGFuIGFycmF5IG9mIHBhcnRzIGluY2x1ZGluZyArIGFuZCAtLlxuICAgICAgY29uc3QgcGFydHMgPSB1cGQuc3BsaXQoLyhbLStdKS8pO1xuICAgICAgLy8gU3RhcnRpbmcgaXRlcmF0aW9uIGZyb20gMSBiZWNhdXNlIFN0cmluZy5zcGxpdCgpIGNyZWF0ZXMgYW4gYXJyYXkgd2l0aCB0aGUgZmlyc3QgZW1wdHkgZWxlbWVudC5cbiAgICAgIC8vIEl0ZXJhdGluZyBieSAyIGJlY2F1c2Ugd2UgcGFyc2UgcGFpcnMgKy8tIHRoZW4gZGF0YS5cbiAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgcGFydHMubGVuZ3RoIC0gMTsgaSArPSAyKSB7XG4gICAgICAgIGFjdGlvbiA9IHBhcnRzW2ldO1xuICAgICAgICBjb25zdCBtMCA9IEFjY2Vzc01vZGUuZGVjb2RlKHBhcnRzW2kgKyAxXSk7XG4gICAgICAgIGlmIChtMCA9PSBBY2Nlc3NNb2RlLl9JTlZBTElEKSB7XG4gICAgICAgICAgcmV0dXJuIHZhbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAobTAgPT0gbnVsbCkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhY3Rpb24gPT09ICcrJykge1xuICAgICAgICAgIHZhbDAgfD0gbTA7XG4gICAgICAgIH0gZWxzZSBpZiAoYWN0aW9uID09PSAnLScpIHtcbiAgICAgICAgICB2YWwwICY9IH5tMDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdmFsID0gdmFsMDtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVGhlIHN0cmluZyBpcyBhbiBleHBsaWNpdCBuZXcgdmFsdWUgJ0FCQycgcmF0aGVyIHRoYW4gZGVsdGEuXG4gICAgICBjb25zdCB2YWwwID0gQWNjZXNzTW9kZS5kZWNvZGUodXBkKTtcbiAgICAgIGlmICh2YWwwICE9IEFjY2Vzc01vZGUuX0lOVkFMSUQpIHtcbiAgICAgICAgdmFsID0gdmFsMDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdmFsO1xuICB9XG4gIC8qKlxuICAgKiBCaXRzIHByZXNlbnQgaW4gYTEgYnV0IG1pc3NpbmcgaW4gYTIuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlciB8IHN0cmluZ30gYTEgLSBhY2Nlc3MgbW9kZSB0byBzdWJ0cmFjdCBmcm9tLlxuICAgKiBAcGFyYW0ge251bWJlciB8IHN0cmluZ30gYTIgLSBhY2Nlc3MgbW9kZSB0byBzdWJ0cmFjdC5cbiAgICogQHJldHVybnMge251bWJlcn0gYWNjZXNzIG1vZGUgd2l0aCBiaXRzIHByZXNlbnQgaW4gPGNvZGU+YTE8L2NvZGU+IGJ1dCBtaXNzaW5nIGluIDxjb2RlPmEyPC9jb2RlPi5cbiAgICovXG4gIHN0YXRpYyBkaWZmKGExLCBhMikge1xuICAgIGExID0gQWNjZXNzTW9kZS5kZWNvZGUoYTEpO1xuICAgIGEyID0gQWNjZXNzTW9kZS5kZWNvZGUoYTIpO1xuXG4gICAgaWYgKGExID09IEFjY2Vzc01vZGUuX0lOVkFMSUQgfHwgYTIgPT0gQWNjZXNzTW9kZS5fSU5WQUxJRCkge1xuICAgICAgcmV0dXJuIEFjY2Vzc01vZGUuX0lOVkFMSUQ7XG4gICAgfVxuICAgIHJldHVybiBhMSAmIH5hMjtcbiAgfVxuICAvKipcbiAgICogQWNjZXNzTW9kZSBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyB0b3BpYyBhY2Nlc3MgbW9kZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAY2xhc3MgQWNjZXNzTW9kZVxuICAgKi9cbiAgLyoqXG4gICAqIEN1c3RvbSBmb3JtYXR0ZXJcbiAgICovXG4gIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiAne1wibW9kZVwiOiBcIicgKyBBY2Nlc3NNb2RlLmVuY29kZSh0aGlzLm1vZGUpICtcbiAgICAgICdcIiwgXCJnaXZlblwiOiBcIicgKyBBY2Nlc3NNb2RlLmVuY29kZSh0aGlzLmdpdmVuKSArXG4gICAgICAnXCIsIFwid2FudFwiOiBcIicgKyBBY2Nlc3NNb2RlLmVuY29kZSh0aGlzLndhbnQpICsgJ1wifSc7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBDb252ZXJ0cyBudW1lcmljIHZhbHVlcyB0byBzdHJpbmdzLlxuICAgKi9cbiAganNvbkhlbHBlcigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbW9kZTogQWNjZXNzTW9kZS5lbmNvZGUodGhpcy5tb2RlKSxcbiAgICAgIGdpdmVuOiBBY2Nlc3NNb2RlLmVuY29kZSh0aGlzLmdpdmVuKSxcbiAgICAgIHdhbnQ6IEFjY2Vzc01vZGUuZW5jb2RlKHRoaXMud2FudClcbiAgICB9O1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogQXNzaWduIHZhbHVlIHRvICdtb2RlJy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nIHwgTnVtYmVyfSBtIC0gZWl0aGVyIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBhY2Nlc3MgbW9kZSBvciBhIHNldCBvZiBiaXRzLlxuICAgKiBAcmV0dXJucyB7QWNjZXNzTW9kZX0gLSA8Y29kZT50aGlzPC9jb2RlPiBBY2Nlc3NNb2RlLlxuICAgKi9cbiAgc2V0TW9kZShtKSB7XG4gICAgdGhpcy5tb2RlID0gQWNjZXNzTW9kZS5kZWNvZGUobSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBVcGRhdGUgPGNvZGU+bW9kZTwvY29kZT4gdmFsdWUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdSAtIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgY2hhbmdlcyB0byBhcHBseSB0byBhY2Nlc3MgbW9kZS5cbiAgICogQHJldHVybnMge0FjY2Vzc01vZGV9IC0gPGNvZGU+dGhpczwvY29kZT4gQWNjZXNzTW9kZS5cbiAgICovXG4gIHVwZGF0ZU1vZGUodSkge1xuICAgIHRoaXMubW9kZSA9IEFjY2Vzc01vZGUudXBkYXRlKHRoaXMubW9kZSwgdSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBHZXQgPGNvZGU+bW9kZTwvY29kZT4gdmFsdWUgYXMgYSBzdHJpbmcuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSAtIDxjb2RlPm1vZGU8L2NvZGU+IHZhbHVlLlxuICAgKi9cbiAgZ2V0TW9kZSgpIHtcbiAgICByZXR1cm4gQWNjZXNzTW9kZS5lbmNvZGUodGhpcy5tb2RlKTtcbiAgfVxuICAvKipcbiAgICogQWNjZXNzTW9kZSBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyB0b3BpYyBhY2Nlc3MgbW9kZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAY2xhc3MgQWNjZXNzTW9kZVxuICAgKi9cbiAgLyoqXG4gICAqIEFzc2lnbiA8Y29kZT5naXZlbjwvY29kZT4gIHZhbHVlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmcgfCBOdW1iZXJ9IGcgLSBlaXRoZXIgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIGFjY2VzcyBtb2RlIG9yIGEgc2V0IG9mIGJpdHMuXG4gICAqIEByZXR1cm5zIHtBY2Nlc3NNb2RlfSAtIDxjb2RlPnRoaXM8L2NvZGU+IEFjY2Vzc01vZGUuXG4gICAqL1xuICBzZXRHaXZlbihnKSB7XG4gICAgdGhpcy5naXZlbiA9IEFjY2Vzc01vZGUuZGVjb2RlKGcpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogVXBkYXRlICdnaXZlbicgdmFsdWUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdSAtIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgY2hhbmdlcyB0byBhcHBseSB0byBhY2Nlc3MgbW9kZS5cbiAgICogQHJldHVybnMge0FjY2Vzc01vZGV9IC0gPGNvZGU+dGhpczwvY29kZT4gQWNjZXNzTW9kZS5cbiAgICovXG4gIHVwZGF0ZUdpdmVuKHUpIHtcbiAgICB0aGlzLmdpdmVuID0gQWNjZXNzTW9kZS51cGRhdGUodGhpcy5naXZlbiwgdSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBHZXQgJ2dpdmVuJyB2YWx1ZSBhcyBhIHN0cmluZy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IC0gPGI+Z2l2ZW48L2I+IHZhbHVlLlxuICAgKi9cbiAgZ2V0R2l2ZW4oKSB7XG4gICAgcmV0dXJuIEFjY2Vzc01vZGUuZW5jb2RlKHRoaXMuZ2l2ZW4pO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogQXNzaWduICd3YW50JyB2YWx1ZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nIHwgTnVtYmVyfSB3IC0gZWl0aGVyIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBhY2Nlc3MgbW9kZSBvciBhIHNldCBvZiBiaXRzLlxuICAgKiBAcmV0dXJucyB7QWNjZXNzTW9kZX0gLSA8Y29kZT50aGlzPC9jb2RlPiBBY2Nlc3NNb2RlLlxuICAgKi9cbiAgc2V0V2FudCh3KSB7XG4gICAgdGhpcy53YW50ID0gQWNjZXNzTW9kZS5kZWNvZGUodyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBVcGRhdGUgJ3dhbnQnIHZhbHVlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHUgLSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIGNoYW5nZXMgdG8gYXBwbHkgdG8gYWNjZXNzIG1vZGUuXG4gICAqIEByZXR1cm5zIHtBY2Nlc3NNb2RlfSAtIDxjb2RlPnRoaXM8L2NvZGU+IEFjY2Vzc01vZGUuXG4gICAqL1xuICB1cGRhdGVXYW50KHUpIHtcbiAgICB0aGlzLndhbnQgPSBBY2Nlc3NNb2RlLnVwZGF0ZSh0aGlzLndhbnQsIHUpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogR2V0ICd3YW50JyB2YWx1ZSBhcyBhIHN0cmluZy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IC0gPGI+d2FudDwvYj4gdmFsdWUuXG4gICAqL1xuICBnZXRXYW50KCkge1xuICAgIHJldHVybiBBY2Nlc3NNb2RlLmVuY29kZSh0aGlzLndhbnQpO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogR2V0IHBlcm1pc3Npb25zIHByZXNlbnQgaW4gJ3dhbnQnIGJ1dCBtaXNzaW5nIGluICdnaXZlbicuXG4gICAqIEludmVyc2Ugb2Yge0BsaW5rIFRpbm9kZS5BY2Nlc3NNb2RlI2dldEV4Y2Vzc2l2ZX1cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IHBlcm1pc3Npb25zIHByZXNlbnQgaW4gPGI+d2FudDwvYj4gYnV0IG1pc3NpbmcgaW4gPGI+Z2l2ZW48L2I+LlxuICAgKi9cbiAgZ2V0TWlzc2luZygpIHtcbiAgICByZXR1cm4gQWNjZXNzTW9kZS5lbmNvZGUodGhpcy53YW50ICYgfnRoaXMuZ2l2ZW4pO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogR2V0IHBlcm1pc3Npb25zIHByZXNlbnQgaW4gJ2dpdmVuJyBidXQgbWlzc2luZyBpbiAnd2FudCcuXG4gICAqIEludmVyc2Ugb2Yge0BsaW5rIFRpbm9kZS5BY2Nlc3NNb2RlI2dldE1pc3Npbmd9XG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBwZXJtaXNzaW9ucyBwcmVzZW50IGluIDxiPmdpdmVuPC9iPiBidXQgbWlzc2luZyBpbiA8Yj53YW50PC9iPi5cbiAgICovXG4gIGdldEV4Y2Vzc2l2ZSgpIHtcbiAgICByZXR1cm4gQWNjZXNzTW9kZS5lbmNvZGUodGhpcy5naXZlbiAmIH50aGlzLndhbnQpO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogVXBkYXRlICd3YW50JywgJ2dpdmUnLCBhbmQgJ21vZGUnIHZhbHVlcy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqXG4gICAqIEBwYXJhbSB7QWNjZXNzTW9kZX0gdmFsIC0gbmV3IGFjY2VzcyBtb2RlIHZhbHVlLlxuICAgKiBAcmV0dXJucyB7QWNjZXNzTW9kZX0gLSA8Y29kZT50aGlzPC9jb2RlPiBBY2Nlc3NNb2RlLlxuICAgKi9cbiAgdXBkYXRlQWxsKHZhbCkge1xuICAgIGlmICh2YWwpIHtcbiAgICAgIHRoaXMudXBkYXRlR2l2ZW4odmFsLmdpdmVuKTtcbiAgICAgIHRoaXMudXBkYXRlV2FudCh2YWwud2FudCk7XG4gICAgICB0aGlzLm1vZGUgPSB0aGlzLmdpdmVuICYgdGhpcy53YW50O1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICAvKipcbiAgICogQWNjZXNzTW9kZSBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyB0b3BpYyBhY2Nlc3MgbW9kZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAY2xhc3MgQWNjZXNzTW9kZVxuICAgKi9cbiAgLyoqXG4gICAqIENoZWNrIGlmIE93bmVyIChPKSBmbGFnIGlzIHNldC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gc2lkZSAtIHdoaWNoIHBlcm1pc3Npb24gdG8gY2hlY2s6IGdpdmVuLCB3YW50LCBtb2RlOyBkZWZhdWx0OiBtb2RlLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSA8Y29kZT50cnVlPC9jb2RlPiBpZiBmbGFnIGlzIHNldC5cbiAgICovXG4gIGlzT3duZXIoc2lkZSkge1xuICAgIHJldHVybiBBY2Nlc3NNb2RlLiNjaGVja0ZsYWcodGhpcywgc2lkZSwgQWNjZXNzTW9kZS5fT1dORVIpO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogQ2hlY2sgaWYgUHJlc2VuY2UgKFApIGZsYWcgaXMgc2V0LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICogQHBhcmFtIHtzdHJpbmc9fSBzaWRlIC0gd2hpY2ggcGVybWlzc2lvbiB0byBjaGVjazogZ2l2ZW4sIHdhbnQsIG1vZGU7IGRlZmF1bHQ6IG1vZGUuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIDxjb2RlPnRydWU8L2NvZGU+IGlmIGZsYWcgaXMgc2V0LlxuICAgKi9cbiAgaXNQcmVzZW5jZXIoc2lkZSkge1xuICAgIHJldHVybiBBY2Nlc3NNb2RlLiNjaGVja0ZsYWcodGhpcywgc2lkZSwgQWNjZXNzTW9kZS5fUFJFUyk7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBDaGVjayBpZiBQcmVzZW5jZSAoUCkgZmxhZyBpcyBOT1Qgc2V0LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICogQHBhcmFtIHtzdHJpbmc9fSBzaWRlIC0gd2hpY2ggcGVybWlzc2lvbiB0byBjaGVjazogZ2l2ZW4sIHdhbnQsIG1vZGU7IGRlZmF1bHQ6IG1vZGUuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIDxjb2RlPnRydWU8L2NvZGU+IGlmIGZsYWcgaXMgc2V0LlxuICAgKi9cbiAgaXNNdXRlZChzaWRlKSB7XG4gICAgcmV0dXJuICF0aGlzLmlzUHJlc2VuY2VyKHNpZGUpO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogQ2hlY2sgaWYgSm9pbiAoSikgZmxhZyBpcyBzZXQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKiBAcGFyYW0ge3N0cmluZz19IHNpZGUgLSB3aGljaCBwZXJtaXNzaW9uIHRvIGNoZWNrOiBnaXZlbiwgd2FudCwgbW9kZTsgZGVmYXVsdDogbW9kZS5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IC0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgZmxhZyBpcyBzZXQuXG4gICAqL1xuICBpc0pvaW5lcihzaWRlKSB7XG4gICAgcmV0dXJuIEFjY2Vzc01vZGUuI2NoZWNrRmxhZyh0aGlzLCBzaWRlLCBBY2Nlc3NNb2RlLl9KT0lOKTtcbiAgfVxuICAvKipcbiAgICogQWNjZXNzTW9kZSBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyB0b3BpYyBhY2Nlc3MgbW9kZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAY2xhc3MgQWNjZXNzTW9kZVxuICAgKi9cbiAgLyoqXG4gICAqIENoZWNrIGlmIFJlYWRlciAoUikgZmxhZyBpcyBzZXQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKiBAcGFyYW0ge3N0cmluZz19IHNpZGUgLSB3aGljaCBwZXJtaXNzaW9uIHRvIGNoZWNrOiBnaXZlbiwgd2FudCwgbW9kZTsgZGVmYXVsdDogbW9kZS5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IC0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgZmxhZyBpcyBzZXQuXG4gICAqL1xuICBpc1JlYWRlcihzaWRlKSB7XG4gICAgcmV0dXJuIEFjY2Vzc01vZGUuI2NoZWNrRmxhZyh0aGlzLCBzaWRlLCBBY2Nlc3NNb2RlLl9SRUFEKTtcbiAgfVxuICAvKipcbiAgICogQWNjZXNzTW9kZSBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyB0b3BpYyBhY2Nlc3MgbW9kZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAY2xhc3MgQWNjZXNzTW9kZVxuICAgKi9cbiAgLyoqXG4gICAqIENoZWNrIGlmIFdyaXRlciAoVykgZmxhZyBpcyBzZXQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKiBAcGFyYW0ge3N0cmluZz19IHNpZGUgLSB3aGljaCBwZXJtaXNzaW9uIHRvIGNoZWNrOiBnaXZlbiwgd2FudCwgbW9kZTsgZGVmYXVsdDogbW9kZS5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IC0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgZmxhZyBpcyBzZXQuXG4gICAqL1xuICBpc1dyaXRlcihzaWRlKSB7XG4gICAgcmV0dXJuIEFjY2Vzc01vZGUuI2NoZWNrRmxhZyh0aGlzLCBzaWRlLCBBY2Nlc3NNb2RlLl9XUklURSk7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBDaGVjayBpZiBBcHByb3ZlciAoQSkgZmxhZyBpcyBzZXQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKiBAcGFyYW0ge3N0cmluZz19IHNpZGUgLSB3aGljaCBwZXJtaXNzaW9uIHRvIGNoZWNrOiBnaXZlbiwgd2FudCwgbW9kZTsgZGVmYXVsdDogbW9kZS5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IC0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgZmxhZyBpcyBzZXQuXG4gICAqL1xuICBpc0FwcHJvdmVyKHNpZGUpIHtcbiAgICByZXR1cm4gQWNjZXNzTW9kZS4jY2hlY2tGbGFnKHRoaXMsIHNpZGUsIEFjY2Vzc01vZGUuX0FQUFJPVkUpO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogQ2hlY2sgaWYgZWl0aGVyIG9uZSBvZiBPd25lciAoTykgb3IgQXBwcm92ZXIgKEEpIGZsYWdzIGlzIHNldC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gc2lkZSAtIHdoaWNoIHBlcm1pc3Npb24gdG8gY2hlY2s6IGdpdmVuLCB3YW50LCBtb2RlOyBkZWZhdWx0OiBtb2RlLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSA8Y29kZT50cnVlPC9jb2RlPiBpZiBmbGFnIGlzIHNldC5cbiAgICovXG4gIGlzQWRtaW4oc2lkZSkge1xuICAgIHJldHVybiB0aGlzLmlzT3duZXIoc2lkZSkgfHwgdGhpcy5pc0FwcHJvdmVyKHNpZGUpO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogQ2hlY2sgaWYgZWl0aGVyIG9uZSBvZiBPd25lciAoTyksIEFwcHJvdmVyIChBKSwgb3IgU2hhcmVyIChTKSBmbGFncyBpcyBzZXQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKiBAcGFyYW0ge3N0cmluZz19IHNpZGUgLSB3aGljaCBwZXJtaXNzaW9uIHRvIGNoZWNrOiBnaXZlbiwgd2FudCwgbW9kZTsgZGVmYXVsdDogbW9kZS5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IC0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgZmxhZyBpcyBzZXQuXG4gICAqL1xuICBpc1NoYXJlcihzaWRlKSB7XG4gICAgcmV0dXJuIHRoaXMuaXNBZG1pbihzaWRlKSB8fCBBY2Nlc3NNb2RlLiNjaGVja0ZsYWcodGhpcywgc2lkZSwgQWNjZXNzTW9kZS5fU0hBUkUpO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogQ2hlY2sgaWYgRGVsZXRlciAoRCkgZmxhZyBpcyBzZXQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKiBAcGFyYW0ge3N0cmluZz19IHNpZGUgLSB3aGljaCBwZXJtaXNzaW9uIHRvIGNoZWNrOiBnaXZlbiwgd2FudCwgbW9kZTsgZGVmYXVsdDogbW9kZS5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IC0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgZmxhZyBpcyBzZXQuXG4gICAqL1xuICBpc0RlbGV0ZXIoc2lkZSkge1xuICAgIHJldHVybiBBY2Nlc3NNb2RlLiNjaGVja0ZsYWcodGhpcywgc2lkZSwgQWNjZXNzTW9kZS5fREVMRVRFKTtcbiAgfVxufVxuXG5BY2Nlc3NNb2RlLl9OT05FID0gMHgwMDtcbkFjY2Vzc01vZGUuX0pPSU4gPSAweDAxO1xuQWNjZXNzTW9kZS5fUkVBRCA9IDB4MDI7XG5BY2Nlc3NNb2RlLl9XUklURSA9IDB4MDQ7XG5BY2Nlc3NNb2RlLl9QUkVTID0gMHgwODtcbkFjY2Vzc01vZGUuX0FQUFJPVkUgPSAweDEwO1xuQWNjZXNzTW9kZS5fU0hBUkUgPSAweDIwO1xuQWNjZXNzTW9kZS5fREVMRVRFID0gMHg0MDtcbkFjY2Vzc01vZGUuX09XTkVSID0gMHg4MDtcblxuQWNjZXNzTW9kZS5fQklUTUFTSyA9IEFjY2Vzc01vZGUuX0pPSU4gfCBBY2Nlc3NNb2RlLl9SRUFEIHwgQWNjZXNzTW9kZS5fV1JJVEUgfCBBY2Nlc3NNb2RlLl9QUkVTIHxcbiAgQWNjZXNzTW9kZS5fQVBQUk9WRSB8IEFjY2Vzc01vZGUuX1NIQVJFIHwgQWNjZXNzTW9kZS5fREVMRVRFIHwgQWNjZXNzTW9kZS5fT1dORVI7XG5BY2Nlc3NNb2RlLl9JTlZBTElEID0gMHgxMDAwMDA7XG4iLCIvKipcbiAqIEBmaWxlIEluLW1lbW9yeSBzb3J0ZWQgY2FjaGUgb2Ygb2JqZWN0cy5cbiAqXG4gKiBAY29weXJpZ2h0IDIwMTUtMjAyMiBUaW5vZGUgTExDLlxuICovXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogSW4tbWVtb3J5IHNvcnRlZCBjYWNoZSBvZiBvYmplY3RzLlxuICpcbiAqIEBjbGFzcyBDQnVmZmVyXG4gKiBAbWVtYmVyb2YgVGlub2RlXG4gKiBAcHJvdGVjdGVkXG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbn0gY29tcGFyZSBjdXN0b20gY29tcGFyYXRvciBvZiBvYmplY3RzLiBUYWtlcyB0d28gcGFyYW1ldGVycyA8Y29kZT5hPC9jb2RlPiBhbmQgPGNvZGU+YjwvY29kZT47XG4gKiAgICByZXR1cm5zIDxjb2RlPi0xPC9jb2RlPiBpZiA8Y29kZT5hIDwgYjwvY29kZT4sIDxjb2RlPjA8L2NvZGU+IGlmIDxjb2RlPmEgPT0gYjwvY29kZT4sIDxjb2RlPjE8L2NvZGU+IG90aGVyd2lzZS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gdW5pcXVlIGVuZm9yY2UgZWxlbWVudCB1bmlxdWVuZXNzOiB3aGVuIDxjb2RlPnRydWU8L2NvZGU+IHJlcGxhY2UgZXhpc3RpbmcgZWxlbWVudCB3aXRoIGEgbmV3XG4gKiAgICBvbmUgb24gY29uZmxpY3Q7IHdoZW4gPGNvZGU+ZmFsc2U8L2NvZGU+IGtlZXAgYm90aCBlbGVtZW50cy5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ0J1ZmZlciB7XG4gICNjb21wYXJhdG9yID0gdW5kZWZpbmVkO1xuICAjdW5pcXVlID0gZmFsc2U7XG4gIGJ1ZmZlciA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKGNvbXBhcmVfLCB1bmlxdWVfKSB7XG4gICAgdGhpcy4jY29tcGFyYXRvciA9IGNvbXBhcmVfIHx8ICgoYSwgYikgPT4ge1xuICAgICAgcmV0dXJuIGEgPT09IGIgPyAwIDogYSA8IGIgPyAtMSA6IDE7XG4gICAgfSk7XG4gICAgdGhpcy4jdW5pcXVlID0gdW5pcXVlXztcbiAgfVxuXG4gICNmaW5kTmVhcmVzdChlbGVtLCBhcnIsIGV4YWN0KSB7XG4gICAgbGV0IHN0YXJ0ID0gMDtcbiAgICBsZXQgZW5kID0gYXJyLmxlbmd0aCAtIDE7XG4gICAgbGV0IHBpdm90ID0gMDtcbiAgICBsZXQgZGlmZiA9IDA7XG4gICAgbGV0IGZvdW5kID0gZmFsc2U7XG5cbiAgICB3aGlsZSAoc3RhcnQgPD0gZW5kKSB7XG4gICAgICBwaXZvdCA9IChzdGFydCArIGVuZCkgLyAyIHwgMDtcbiAgICAgIGRpZmYgPSB0aGlzLiNjb21wYXJhdG9yKGFycltwaXZvdF0sIGVsZW0pO1xuICAgICAgaWYgKGRpZmYgPCAwKSB7XG4gICAgICAgIHN0YXJ0ID0gcGl2b3QgKyAxO1xuICAgICAgfSBlbHNlIGlmIChkaWZmID4gMCkge1xuICAgICAgICBlbmQgPSBwaXZvdCAtIDE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZm91bmQpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlkeDogcGl2b3QsXG4gICAgICAgIGV4YWN0OiB0cnVlXG4gICAgICB9O1xuICAgIH1cbiAgICBpZiAoZXhhY3QpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlkeDogLTFcbiAgICAgIH07XG4gICAgfVxuICAgIC8vIE5vdCBleGFjdCAtIGluc2VydGlvbiBwb2ludFxuICAgIHJldHVybiB7XG4gICAgICBpZHg6IGRpZmYgPCAwID8gcGl2b3QgKyAxIDogcGl2b3RcbiAgICB9O1xuICB9XG5cbiAgLy8gSW5zZXJ0IGVsZW1lbnQgaW50byBhIHNvcnRlZCBhcnJheS5cbiAgI2luc2VydFNvcnRlZChlbGVtLCBhcnIpIHtcbiAgICBjb25zdCBmb3VuZCA9IHRoaXMuI2ZpbmROZWFyZXN0KGVsZW0sIGFyciwgZmFsc2UpO1xuICAgIGNvbnN0IGNvdW50ID0gKGZvdW5kLmV4YWN0ICYmIHRoaXMuI3VuaXF1ZSkgPyAxIDogMDtcbiAgICBhcnIuc3BsaWNlKGZvdW5kLmlkeCwgY291bnQsIGVsZW0pO1xuICAgIHJldHVybiBhcnI7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGFuIGVsZW1lbnQgYXQgdGhlIGdpdmVuIHBvc2l0aW9uLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNCdWZmZXIjXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBhdCAtIFBvc2l0aW9uIHRvIGZldGNoIGZyb20uXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IEVsZW1lbnQgYXQgdGhlIGdpdmVuIHBvc2l0aW9uIG9yIDxjb2RlPnVuZGVmaW5lZDwvY29kZT4uXG4gICAqL1xuICBnZXRBdChhdCkge1xuICAgIHJldHVybiB0aGlzLmJ1ZmZlclthdF07XG4gIH1cblxuICAvKipcbiAgICogQ29udmVuaWVuY2UgbWV0aG9kIGZvciBnZXR0aW5nIHRoZSBlbGVtZW50IGZyb20gdGhlIGVuZCBvZiB0aGUgYnVmZmVyLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNCdWZmZXIjXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBhdCAtIHBvc2l0aW9uIHRvIGZldGNoIGZyb20sIGNvdW50aW5nIGZyb20gdGhlIGVuZDtcbiAgICogICAgPGNvZGU+dW5kZWZpbmVkPC9jb2RlPiBvciA8Y29kZT5udWxsPC9jb2RlPiAgbWVhbiBcImxhc3RcIi5cbiAgICogQHJldHVybnMge09iamVjdH0gVGhlIGxhc3QgZWxlbWVudCBpbiB0aGUgYnVmZmVyIG9yIDxjb2RlPnVuZGVmaW5lZDwvY29kZT4gaWYgYnVmZmVyIGlzIGVtcHR5LlxuICAgKi9cbiAgZ2V0TGFzdChhdCkge1xuICAgIGF0IHw9IDA7XG4gICAgcmV0dXJuIHRoaXMuYnVmZmVyLmxlbmd0aCA+IGF0ID8gdGhpcy5idWZmZXJbdGhpcy5idWZmZXIubGVuZ3RoIC0gMSAtIGF0XSA6IHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgbmV3IGVsZW1lbnQocykgdG8gdGhlIGJ1ZmZlci4gVmFyaWFkaWM6IHRha2VzIG9uZSBvciBtb3JlIGFyZ3VtZW50cy4gSWYgYW4gYXJyYXkgaXMgcGFzc2VkIGFzIGEgc2luZ2xlXG4gICAqIGFyZ3VtZW50LCBpdHMgZWxlbWVudHMgYXJlIGluc2VydGVkIGluZGl2aWR1YWxseS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5DQnVmZmVyI1xuICAgKlxuICAgKiBAcGFyYW0gey4uLk9iamVjdHxBcnJheX0gLSBPbmUgb3IgbW9yZSBvYmplY3RzIHRvIGluc2VydC5cbiAgICovXG4gIHB1dCgpIHtcbiAgICBsZXQgaW5zZXJ0O1xuICAgIC8vIGluc3BlY3QgYXJndW1lbnRzOiBpZiBhcnJheSwgaW5zZXJ0IGl0cyBlbGVtZW50cywgaWYgb25lIG9yIG1vcmUgbm9uLWFycmF5IGFyZ3VtZW50cywgaW5zZXJ0IHRoZW0gb25lIGJ5IG9uZVxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDEgJiYgQXJyYXkuaXNBcnJheShhcmd1bWVudHNbMF0pKSB7XG4gICAgICBpbnNlcnQgPSBhcmd1bWVudHNbMF07XG4gICAgfSBlbHNlIHtcbiAgICAgIGluc2VydCA9IGFyZ3VtZW50cztcbiAgICB9XG4gICAgZm9yIChsZXQgaWR4IGluIGluc2VydCkge1xuICAgICAgdGhpcy4jaW5zZXJ0U29ydGVkKGluc2VydFtpZHhdLCB0aGlzLmJ1ZmZlcik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBlbGVtZW50IGF0IHRoZSBnaXZlbiBwb3NpdGlvbi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5DQnVmZmVyI1xuICAgKiBAcGFyYW0ge251bWJlcn0gYXQgLSBQb3NpdGlvbiB0byBkZWxldGUgYXQuXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IEVsZW1lbnQgYXQgdGhlIGdpdmVuIHBvc2l0aW9uIG9yIDxjb2RlPnVuZGVmaW5lZDwvY29kZT4uXG4gICAqL1xuICBkZWxBdChhdCkge1xuICAgIGF0IHw9IDA7XG4gICAgbGV0IHIgPSB0aGlzLmJ1ZmZlci5zcGxpY2UoYXQsIDEpO1xuICAgIGlmIChyICYmIHIubGVuZ3RoID4gMCkge1xuICAgICAgcmV0dXJuIHJbMF07XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGVsZW1lbnRzIGJldHdlZW4gdHdvIHBvc2l0aW9ucy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5DQnVmZmVyI1xuICAgKiBAcGFyYW0ge251bWJlcn0gc2luY2UgLSBQb3NpdGlvbiB0byBkZWxldGUgZnJvbSAoaW5jbHVzaXZlKS5cbiAgICogQHBhcmFtIHtudW1iZXJ9IGJlZm9yZSAtIFBvc2l0aW9uIHRvIGRlbGV0ZSB0byAoZXhjbHVzaXZlKS5cbiAgICpcbiAgICogQHJldHVybnMge0FycmF5fSBhcnJheSBvZiByZW1vdmVkIGVsZW1lbnRzIChjb3VsZCBiZSB6ZXJvIGxlbmd0aCkuXG4gICAqL1xuICBkZWxSYW5nZShzaW5jZSwgYmVmb3JlKSB7XG4gICAgcmV0dXJuIHRoaXMuYnVmZmVyLnNwbGljZShzaW5jZSwgYmVmb3JlIC0gc2luY2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgbnVtYmVyIG9mIGVsZW1lbnRzIHRoZSBidWZmZXIgaG9sZHMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ0J1ZmZlciNcbiAgICogQHJldHVybiB7bnVtYmVyfSBOdW1iZXIgb2YgZWxlbWVudHMgaW4gdGhlIGJ1ZmZlci5cbiAgICovXG4gIGxlbmd0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5idWZmZXIubGVuZ3RoO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0IHRoZSBidWZmZXIgZGlzY2FyZGluZyBhbGwgZWxlbWVudHNcbiAgICogQG1lbWJlcm9mIFRpbm9kZS5DQnVmZmVyI1xuICAgKi9cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5idWZmZXIgPSBbXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsYmFjayBmb3IgaXRlcmF0aW5nIGNvbnRlbnRzIG9mIGJ1ZmZlci4gU2VlIHtAbGluayBUaW5vZGUuQ0J1ZmZlciNmb3JFYWNofS5cbiAgICogQGNhbGxiYWNrIEZvckVhY2hDYWxsYmFja1R5cGVcbiAgICogQG1lbWJlcm9mIFRpbm9kZS5DQnVmZmVyI1xuICAgKiBAcGFyYW0ge09iamVjdH0gZWxlbSAtIEN1cnJlbnQgZWxlbWVudCBvZiB0aGUgYnVmZmVyLlxuICAgKiBAcGFyYW0ge09iamVjdH0gcHJldiAtIFByZXZpb3VzIGVsZW1lbnQgb2YgdGhlIGJ1ZmZlci5cbiAgICogQHBhcmFtIHtPYmplY3R9IG5leHQgLSBOZXh0IGVsZW1lbnQgb2YgdGhlIGJ1ZmZlci5cbiAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IC0gSW5kZXggb2YgdGhlIGN1cnJlbnQgZWxlbWVudC5cbiAgICovXG5cbiAgLyoqXG4gICAqIEFwcGx5IGdpdmVuIDxjb2RlPmNhbGxiYWNrPC9jb2RlPiB0byBhbGwgZWxlbWVudHMgb2YgdGhlIGJ1ZmZlci5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5DQnVmZmVyI1xuICAgKlxuICAgKiBAcGFyYW0ge1Rpbm9kZS5Gb3JFYWNoQ2FsbGJhY2tUeXBlfSBjYWxsYmFjayAtIEZ1bmN0aW9uIHRvIGNhbGwgZm9yIGVhY2ggZWxlbWVudC5cbiAgICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0SWR4IC0gT3B0aW9uYWwgaW5kZXggdG8gc3RhcnQgaXRlcmF0aW5nIGZyb20gKGluY2x1c2l2ZSkuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBiZWZvcmVJZHggLSBPcHRpb25hbCBpbmRleCB0byBzdG9wIGl0ZXJhdGluZyBiZWZvcmUgKGV4Y2x1c2l2ZSkuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZXh0IC0gY2FsbGluZyBjb250ZXh0IChpLmUuIHZhbHVlIG9mIDxjb2RlPnRoaXM8L2NvZGU+IGluIGNhbGxiYWNrKVxuICAgKi9cbiAgZm9yRWFjaChjYWxsYmFjaywgc3RhcnRJZHgsIGJlZm9yZUlkeCwgY29udGV4dCkge1xuICAgIHN0YXJ0SWR4ID0gc3RhcnRJZHggfCAwO1xuICAgIGJlZm9yZUlkeCA9IGJlZm9yZUlkeCB8fCB0aGlzLmJ1ZmZlci5sZW5ndGg7XG4gICAgZm9yIChsZXQgaSA9IHN0YXJ0SWR4OyBpIDwgYmVmb3JlSWR4OyBpKyspIHtcbiAgICAgIGNhbGxiYWNrLmNhbGwoY29udGV4dCwgdGhpcy5idWZmZXJbaV0sXG4gICAgICAgIChpID4gc3RhcnRJZHggPyB0aGlzLmJ1ZmZlcltpIC0gMV0gOiB1bmRlZmluZWQpLFxuICAgICAgICAoaSA8IGJlZm9yZUlkeCAtIDEgPyB0aGlzLmJ1ZmZlcltpICsgMV0gOiB1bmRlZmluZWQpLCBpKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRmluZCBlbGVtZW50IGluIGJ1ZmZlciB1c2luZyBidWZmZXIncyBjb21wYXJpc29uIGZ1bmN0aW9uLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNCdWZmZXIjXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBlbGVtIC0gZWxlbWVudCB0byBmaW5kLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBuZWFyZXN0IC0gd2hlbiB0cnVlIGFuZCBleGFjdCBtYXRjaCBpcyBub3QgZm91bmQsIHJldHVybiB0aGUgbmVhcmVzdCBlbGVtZW50IChpbnNlcnRpb24gcG9pbnQpLlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSBpbmRleCBvZiB0aGUgZWxlbWVudCBpbiB0aGUgYnVmZmVyIG9yIC0xLlxuICAgKi9cbiAgZmluZChlbGVtLCBuZWFyZXN0KSB7XG4gICAgY29uc3Qge1xuICAgICAgaWR4XG4gICAgfSA9IHRoaXMuI2ZpbmROZWFyZXN0KGVsZW0sIHRoaXMuYnVmZmVyLCAhbmVhcmVzdCk7XG4gICAgcmV0dXJuIGlkeDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsYmFjayBmb3IgZmlsdGVyaW5nIHRoZSBidWZmZXIuIFNlZSB7QGxpbmsgVGlub2RlLkNCdWZmZXIjZmlsdGVyfS5cbiAgICogQGNhbGxiYWNrIEZvckVhY2hDYWxsYmFja1R5cGVcbiAgICogQG1lbWJlcm9mIFRpbm9kZS5DQnVmZmVyI1xuICAgKiBAcGFyYW0ge09iamVjdH0gZWxlbSAtIEN1cnJlbnQgZWxlbWVudCBvZiB0aGUgYnVmZmVyLlxuICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXggLSBJbmRleCBvZiB0aGUgY3VycmVudCBlbGVtZW50LlxuICAgKiBAcmV0dXJucyB7Ym9vbGVufSA8Y29kZT50cnVlPC9jb2RlPiB0byBrZWVwIHRoZSBlbGVtZW50LCA8Y29kZT5mYWxzZTwvY29kZT4gdG8gcmVtb3ZlLlxuICAgKi9cblxuICAvKipcbiAgICogUmVtb3ZlIGFsbCBlbGVtZW50cyB0aGF0IGRvIG5vdCBwYXNzIHRoZSB0ZXN0IGltcGxlbWVudGVkIGJ5IHRoZSBwcm92aWRlZCBjYWxsYmFjayBmdW5jdGlvbi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5DQnVmZmVyI1xuICAgKlxuICAgKiBAcGFyYW0ge1Rpbm9kZS5GaWx0ZXJDYWxsYmFja1R5cGV9IGNhbGxiYWNrIC0gRnVuY3Rpb24gdG8gY2FsbCBmb3IgZWFjaCBlbGVtZW50LlxuICAgKiBAcGFyYW0ge09iamVjdH0gY29udGV4dCAtIGNhbGxpbmcgY29udGV4dCAoaS5lLiB2YWx1ZSBvZiA8Y29kZT50aGlzPC9jb2RlPiBpbiB0aGUgY2FsbGJhY2spXG4gICAqL1xuICBmaWx0ZXIoY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICBsZXQgY291bnQgPSAwO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5idWZmZXIubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChjYWxsYmFjay5jYWxsKGNvbnRleHQsIHRoaXMuYnVmZmVyW2ldLCBpKSkge1xuICAgICAgICB0aGlzLmJ1ZmZlcltjb3VudF0gPSB0aGlzLmJ1ZmZlcltpXTtcbiAgICAgICAgY291bnQrKztcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmJ1ZmZlci5zcGxpY2UoY291bnQpO1xuICB9XG59XG4iLCIvKipcbiAqIEBmaWxlIEdsb2JhbCBjb25zdGFudHMgYW5kIGNvbmZpZ3VyYXRpb24gcGFyYW1ldGVycy5cbiAqXG4gKiBAY29weXJpZ2h0IDIwMTUtMjAyMiBUaW5vZGUgTExDXG4gKi9cbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHtcbiAgdmVyc2lvbiBhcyBwYWNrYWdlX3ZlcnNpb25cbn0gZnJvbSAnLi4vdmVyc2lvbi5qc29uJztcblxuLy8gR2xvYmFsIGNvbnN0YW50c1xuZXhwb3J0IGNvbnN0IFBST1RPQ09MX1ZFUlNJT04gPSAnMCc7IC8vIE1ham9yIGNvbXBvbmVudCBvZiB0aGUgdmVyc2lvbiwgZS5nLiAnMCcgaW4gJzAuMTcuMScuXG5leHBvcnQgY29uc3QgVkVSU0lPTiA9IHBhY2thZ2VfdmVyc2lvbiB8fCAnMC4xOCc7XG5leHBvcnQgY29uc3QgTElCUkFSWSA9ICd0aW5vZGVqcy8nICsgVkVSU0lPTjtcblxuLy8gVG9waWMgbmFtZSBwcmVmaXhlcy5cbmV4cG9ydCBjb25zdCBUT1BJQ19ORVcgPSAnbmV3JztcbmV4cG9ydCBjb25zdCBUT1BJQ19ORVdfQ0hBTiA9ICduY2gnO1xuZXhwb3J0IGNvbnN0IFRPUElDX01FID0gJ21lJztcbmV4cG9ydCBjb25zdCBUT1BJQ19GTkQgPSAnZm5kJztcbmV4cG9ydCBjb25zdCBUT1BJQ19TWVMgPSAnc3lzJztcbmV4cG9ydCBjb25zdCBUT1BJQ19DSEFOID0gJ2Nobic7XG5leHBvcnQgY29uc3QgVE9QSUNfR1JQID0gJ2dycDsnXG5leHBvcnQgY29uc3QgVE9QSUNfUDJQID0gJ3AycCc7XG5leHBvcnQgY29uc3QgVVNFUl9ORVcgPSAnbmV3JztcblxuLy8gU3RhcnRpbmcgdmFsdWUgb2YgYSBsb2NhbGx5LWdlbmVyYXRlZCBzZXFJZCB1c2VkIGZvciBwZW5kaW5nIG1lc3NhZ2VzLlxuZXhwb3J0IGNvbnN0IExPQ0FMX1NFUUlEID0gMHhGRkZGRkZGO1xuXG4vLyBTdGF0dXMgY29kZXMuXG5leHBvcnQgY29uc3QgTUVTU0FHRV9TVEFUVVNfTk9ORSA9IDA7IC8vIFN0YXR1cyBub3QgYXNzaWduZWQuXG5leHBvcnQgY29uc3QgTUVTU0FHRV9TVEFUVVNfUVVFVUVEID0gMTsgLy8gTG9jYWwgSUQgYXNzaWduZWQsIGluIHByb2dyZXNzIHRvIGJlIHNlbnQuXG5leHBvcnQgY29uc3QgTUVTU0FHRV9TVEFUVVNfU0VORElORyA9IDI7IC8vIFRyYW5zbWlzc2lvbiBzdGFydGVkLlxuZXhwb3J0IGNvbnN0IE1FU1NBR0VfU1RBVFVTX0ZBSUxFRCA9IDM7IC8vIEF0IGxlYXN0IG9uZSBhdHRlbXB0IHdhcyBtYWRlIHRvIHNlbmQgdGhlIG1lc3NhZ2UuXG5leHBvcnQgY29uc3QgTUVTU0FHRV9TVEFUVVNfU0VOVCA9IDQ7IC8vIERlbGl2ZXJlZCB0byB0aGUgc2VydmVyLlxuZXhwb3J0IGNvbnN0IE1FU1NBR0VfU1RBVFVTX1JFQ0VJVkVEID0gNTsgLy8gUmVjZWl2ZWQgYnkgdGhlIGNsaWVudC5cbmV4cG9ydCBjb25zdCBNRVNTQUdFX1NUQVRVU19SRUFEID0gNjsgLy8gUmVhZCBieSB0aGUgdXNlci5cbmV4cG9ydCBjb25zdCBNRVNTQUdFX1NUQVRVU19UT19NRSA9IDc7IC8vIFRoZSBtZXNzYWdlIGlzIHJlY2VpdmVkIGZyb20gYW5vdGhlciB1c2VyLlxuZXhwb3J0IGNvbnN0IE1FU1NBR0VfU1RBVFVTX0RFTF9SQU5HRSA9IDg7IC8vIFRoZSBtZXNzYWdlIHJlcHJlc2VudHMgYSBkZWxldGVkIHJhbmdlLlxuXG4vLyBSZWplY3QgdW5yZXNvbHZlZCBmdXR1cmVzIGFmdGVyIHRoaXMgbWFueSBtaWxsaXNlY29uZHMuXG5leHBvcnQgY29uc3QgRVhQSVJFX1BST01JU0VTX1RJTUVPVVQgPSA1MDAwO1xuLy8gUGVyaW9kaWNpdHkgb2YgZ2FyYmFnZSBjb2xsZWN0aW9uIG9mIHVucmVzb2x2ZWQgZnV0dXJlcy5cbmV4cG9ydCBjb25zdCBFWFBJUkVfUFJPTUlTRVNfUEVSSU9EID0gMTAwMDtcblxuLy8gRGVmYXVsdCBudW1iZXIgb2YgbWVzc2FnZXMgdG8gcHVsbCBpbnRvIG1lbW9yeSBmcm9tIHBlcnNpc3RlbnQgY2FjaGUuXG5leHBvcnQgY29uc3QgREVGQVVMVF9NRVNTQUdFU19QQUdFID0gMjQ7XG5cbi8vIFVuaWNvZGUgREVMIGNoYXJhY3RlciBpbmRpY2F0aW5nIGRhdGEgd2FzIGRlbGV0ZWQuXG5leHBvcnQgY29uc3QgREVMX0NIQVIgPSAnXFx1MjQyMSc7XG4iLCIvKipcbiAqIEBmaWxlIEFic3RyYWN0aW9uIGxheWVyIGZvciB3ZWJzb2NrZXQgYW5kIGxvbmcgcG9sbGluZyBjb25uZWN0aW9ucy5cbiAqXG4gKiBAY29weXJpZ2h0IDIwMTUtMjAyMiBUaW5vZGUgTExDLlxuICovXG4ndXNlIHN0cmljdCc7XG5cbmltcG9ydCB7XG4gIGpzb25QYXJzZUhlbHBlclxufSBmcm9tICcuL3V0aWxzLmpzJztcblxubGV0IFdlYlNvY2tldFByb3ZpZGVyO1xubGV0IFhIUlByb3ZpZGVyO1xuXG4vLyBFcnJvciBjb2RlIHRvIHJldHVybiBpbiBjYXNlIG9mIGEgbmV0d29yayBwcm9ibGVtLlxuY29uc3QgTkVUV09SS19FUlJPUiA9IDUwMztcbmNvbnN0IE5FVFdPUktfRVJST1JfVEVYVCA9IFwiQ29ubmVjdGlvbiBmYWlsZWRcIjtcblxuLy8gRXJyb3IgY29kZSB0byByZXR1cm4gd2hlbiB1c2VyIGRpc2Nvbm5lY3RlZCBmcm9tIHNlcnZlci5cbmNvbnN0IE5FVFdPUktfVVNFUiA9IDQxODtcbmNvbnN0IE5FVFdPUktfVVNFUl9URVhUID0gXCJEaXNjb25uZWN0ZWQgYnkgY2xpZW50XCI7XG5cbi8vIFNldHRpbmdzIGZvciBleHBvbmVudGlhbCBiYWNrb2ZmXG5jb25zdCBfQk9GRl9CQVNFID0gMjAwMDsgLy8gMjAwMCBtaWxsaXNlY29uZHMsIG1pbmltdW0gZGVsYXkgYmV0d2VlbiByZWNvbm5lY3RzXG5jb25zdCBfQk9GRl9NQVhfSVRFUiA9IDEwOyAvLyBNYXhpbXVtIGRlbGF5IGJldHdlZW4gcmVjb25uZWN0cyAyXjEwICogMjAwMCB+IDM0IG1pbnV0ZXNcbmNvbnN0IF9CT0ZGX0pJVFRFUiA9IDAuMzsgLy8gQWRkIHJhbmRvbSBkZWxheVxuXG4vLyBIZWxwZXIgZnVuY3Rpb24gZm9yIGNyZWF0aW5nIGFuIGVuZHBvaW50IFVSTC5cbmZ1bmN0aW9uIG1ha2VCYXNlVXJsKGhvc3QsIHByb3RvY29sLCB2ZXJzaW9uLCBhcGlLZXkpIHtcbiAgbGV0IHVybCA9IG51bGw7XG5cbiAgaWYgKFsnaHR0cCcsICdodHRwcycsICd3cycsICd3c3MnXS5pbmNsdWRlcyhwcm90b2NvbCkpIHtcbiAgICB1cmwgPSBgJHtwcm90b2NvbH06Ly8ke2hvc3R9YDtcbiAgICBpZiAodXJsLmNoYXJBdCh1cmwubGVuZ3RoIC0gMSkgIT09ICcvJykge1xuICAgICAgdXJsICs9ICcvJztcbiAgICB9XG4gICAgdXJsICs9ICd2JyArIHZlcnNpb24gKyAnL2NoYW5uZWxzJztcbiAgICBpZiAoWydodHRwJywgJ2h0dHBzJ10uaW5jbHVkZXMocHJvdG9jb2wpKSB7XG4gICAgICAvLyBMb25nIHBvbGxpbmcgZW5kcG9pbnQgZW5kcyB3aXRoIFwibHBcIiwgaS5lLlxuICAgICAgLy8gJy92MC9jaGFubmVscy9scCcgdnMganVzdCAnL3YwL2NoYW5uZWxzJyBmb3Igd3NcbiAgICAgIHVybCArPSAnL2xwJztcbiAgICB9XG4gICAgdXJsICs9ICc/YXBpa2V5PScgKyBhcGlLZXk7XG4gIH1cbiAgcmV0dXJuIHVybDtcbn1cblxuLyoqXG4gKiBBbiBhYnN0cmFjdGlvbiBmb3IgYSB3ZWJzb2NrZXQgb3IgYSBsb25nIHBvbGxpbmcgY29ubmVjdGlvbi5cbiAqXG4gKiBAY2xhc3MgQ29ubmVjdGlvblxuICogQG1lbWJlcm9mIFRpbm9kZVxuXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnIC0gY29uZmlndXJhdGlvbiBwYXJhbWV0ZXJzLlxuICogQHBhcmFtIHtzdHJpbmd9IGNvbmZpZy5ob3N0IC0gSG9zdCBuYW1lIGFuZCBvcHRpb25hbCBwb3J0IG51bWJlciB0byBjb25uZWN0IHRvLlxuICogQHBhcmFtIHtzdHJpbmd9IGNvbmZpZy5hcGlLZXkgLSBBUEkga2V5IGdlbmVyYXRlZCBieSA8Y29kZT5rZXlnZW48L2NvZGU+LlxuICogQHBhcmFtIHtzdHJpbmd9IGNvbmZpZy50cmFuc3BvcnQgLSBOZXR3b3JrIHRyYW5zcG9ydCB0byB1c2UsIGVpdGhlciA8Y29kZT5cIndzXCI8Y29kZT4vPGNvZGU+XCJ3c3NcIjwvY29kZT4gZm9yIHdlYnNvY2tldCBvclxuICogICAgICA8Y29kZT5scDwvY29kZT4gZm9yIGxvbmcgcG9sbGluZy5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gY29uZmlnLnNlY3VyZSAtIFVzZSBTZWN1cmUgV2ViU29ja2V0IGlmIDxjb2RlPnRydWU8L2NvZGU+LlxuICogQHBhcmFtIHtzdHJpbmd9IHZlcnNpb25fIC0gTWFqb3IgdmFsdWUgb2YgdGhlIHByb3RvY29sIHZlcnNpb24sIGUuZy4gJzAnIGluICcwLjE3LjEnLlxuICogQHBhcmFtIHtib29sZWFufSBhdXRvcmVjb25uZWN0XyAtIElmIGNvbm5lY3Rpb24gaXMgbG9zdCwgdHJ5IHRvIHJlY29ubmVjdCBhdXRvbWF0aWNhbGx5LlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb25uZWN0aW9uIHtcbiAgLy8gTG9nZ2VyLCBkb2VzIG5vdGhpbmcgYnkgZGVmYXVsdC5cbiAgc3RhdGljICNsb2cgPSBfID0+IHt9O1xuXG4gICNib2ZmVGltZXIgPSBudWxsO1xuICAjYm9mZkl0ZXJhdGlvbiA9IDA7XG4gICNib2ZmQ2xvc2VkID0gZmFsc2U7IC8vIEluZGljYXRvciBpZiB0aGUgc29ja2V0IHdhcyBtYW51YWxseSBjbG9zZWQgLSBkb24ndCBhdXRvcmVjb25uZWN0IGlmIHRydWUuXG5cbiAgLy8gV2Vic29ja2V0LlxuICAjc29ja2V0ID0gbnVsbDtcblxuICBob3N0O1xuICBzZWN1cmU7XG4gIGFwaUtleTtcblxuICB2ZXJzaW9uO1xuICBhdXRvcmVjb25uZWN0O1xuXG4gIGluaXRpYWxpemVkO1xuXG4gIC8vIChjb25maWcuaG9zdCwgY29uZmlnLmFwaUtleSwgY29uZmlnLnRyYW5zcG9ydCwgY29uZmlnLnNlY3VyZSksIFBST1RPQ09MX1ZFUlNJT04sIHRydWVcbiAgY29uc3RydWN0b3IoY29uZmlnLCB2ZXJzaW9uXywgYXV0b3JlY29ubmVjdF8pIHtcbiAgICB0aGlzLmhvc3QgPSBjb25maWcuaG9zdDtcbiAgICB0aGlzLnNlY3VyZSA9IGNvbmZpZy5zZWN1cmU7XG4gICAgdGhpcy5hcGlLZXkgPSBjb25maWcuYXBpS2V5O1xuXG4gICAgdGhpcy52ZXJzaW9uID0gdmVyc2lvbl87XG4gICAgdGhpcy5hdXRvcmVjb25uZWN0ID0gYXV0b3JlY29ubmVjdF87XG5cbiAgICBpZiAoY29uZmlnLnRyYW5zcG9ydCA9PT0gJ2xwJykge1xuICAgICAgLy8gZXhwbGljaXQgcmVxdWVzdCB0byB1c2UgbG9uZyBwb2xsaW5nXG4gICAgICB0aGlzLiNpbml0X2xwKCk7XG4gICAgICB0aGlzLmluaXRpYWxpemVkID0gJ2xwJztcbiAgICB9IGVsc2UgaWYgKGNvbmZpZy50cmFuc3BvcnQgPT09ICd3cycpIHtcbiAgICAgIC8vIGV4cGxpY2l0IHJlcXVlc3QgdG8gdXNlIHdlYiBzb2NrZXRcbiAgICAgIC8vIGlmIHdlYnNvY2tldHMgYXJlIG5vdCBhdmFpbGFibGUsIGhvcnJpYmxlIHRoaW5ncyB3aWxsIGhhcHBlblxuICAgICAgdGhpcy4jaW5pdF93cygpO1xuICAgICAgdGhpcy5pbml0aWFsaXplZCA9ICd3cyc7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmluaXRpYWxpemVkKSB7XG4gICAgICAvLyBJbnZhbGlkIG9yIHVuZGVmaW5lZCBuZXR3b3JrIHRyYW5zcG9ydC5cbiAgICAgIENvbm5lY3Rpb24uI2xvZyhcIlVua25vd24gb3IgaW52YWxpZCBuZXR3b3JrIHRyYW5zcG9ydC4gUnVubmluZyB1bmRlciBOb2RlPyBDYWxsICdUaW5vZGUuc2V0TmV0d29ya1Byb3ZpZGVycygpJy5cIik7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duIG9yIGludmFsaWQgbmV0d29yayB0cmFuc3BvcnQuIFJ1bm5pbmcgdW5kZXIgTm9kZT8gQ2FsbCAnVGlub2RlLnNldE5ldHdvcmtQcm92aWRlcnMoKScuXCIpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUbyB1c2UgQ29ubmVjdGlvbiBpbiBhIG5vbiBicm93c2VyIGNvbnRleHQsIHN1cHBseSBXZWJTb2NrZXQgYW5kIFhNTEh0dHBSZXF1ZXN0IHByb3ZpZGVycy5cbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyb2YgQ29ubmVjdGlvblxuICAgKiBAcGFyYW0gd3NQcm92aWRlciBXZWJTb2NrZXQgcHJvdmlkZXIsIGUuZy4gZm9yIG5vZGVKUyAsIDxjb2RlPnJlcXVpcmUoJ3dzJyk8L2NvZGU+LlxuICAgKiBAcGFyYW0geGhyUHJvdmlkZXIgWE1MSHR0cFJlcXVlc3QgcHJvdmlkZXIsIGUuZy4gZm9yIG5vZGUgPGNvZGU+cmVxdWlyZSgneGhyJyk8L2NvZGU+LlxuICAgKi9cbiAgc3RhdGljIHNldE5ldHdvcmtQcm92aWRlcnMod3NQcm92aWRlciwgeGhyUHJvdmlkZXIpIHtcbiAgICBXZWJTb2NrZXRQcm92aWRlciA9IHdzUHJvdmlkZXI7XG4gICAgWEhSUHJvdmlkZXIgPSB4aHJQcm92aWRlcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBBc3NpZ24gYSBub24tZGVmYXVsdCBsb2dnZXIuXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlcm9mIENvbm5lY3Rpb25cbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gbCB2YXJpYWRpYyBsb2dnaW5nIGZ1bmN0aW9uLlxuICAgKi9cbiAgc3RhdGljIHNldCBsb2dnZXIobCkge1xuICAgIENvbm5lY3Rpb24uI2xvZyA9IGw7XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhdGUgYSBuZXcgY29ubmVjdGlvblxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNvbm5lY3Rpb24jXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBob3N0XyBIb3N0IG5hbWUgdG8gY29ubmVjdCB0bzsgaWYgPGNvZGU+bnVsbDwvY29kZT4gdGhlIG9sZCBob3N0IG5hbWUgd2lsbCBiZSB1c2VkLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGZvcmNlIEZvcmNlIG5ldyBjb25uZWN0aW9uIGV2ZW4gaWYgb25lIGFscmVhZHkgZXhpc3RzLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBQcm9taXNlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIGNvbm5lY3Rpb24gY2FsbCBjb21wbGV0ZXMsIHJlc29sdXRpb24gaXMgY2FsbGVkIHdpdGhvdXRcbiAgICogIHBhcmFtZXRlcnMsIHJlamVjdGlvbiBwYXNzZXMgdGhlIHtFcnJvcn0gYXMgcGFyYW1ldGVyLlxuICAgKi9cbiAgY29ubmVjdChob3N0XywgZm9yY2UpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobnVsbCk7XG4gIH1cblxuICAvKipcbiAgICogVHJ5IHRvIHJlc3RvcmUgYSBuZXR3b3JrIGNvbm5lY3Rpb24sIGFsc28gcmVzZXQgYmFja29mZi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Db25uZWN0aW9uI1xuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGZvcmNlIC0gcmVjb25uZWN0IGV2ZW4gaWYgdGhlcmUgaXMgYSBsaXZlIGNvbm5lY3Rpb24gYWxyZWFkeS5cbiAgICovXG4gIHJlY29ubmVjdChmb3JjZSkge31cblxuICAvKipcbiAgICogVGVybWluYXRlIHRoZSBuZXR3b3JrIGNvbm5lY3Rpb25cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Db25uZWN0aW9uI1xuICAgKi9cbiAgZGlzY29ubmVjdCgpIHt9XG5cbiAgLyoqXG4gICAqIFNlbmQgYSBzdHJpbmcgdG8gdGhlIHNlcnZlci5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Db25uZWN0aW9uI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbXNnIC0gU3RyaW5nIHRvIHNlbmQuXG4gICAqIEB0aHJvd3MgVGhyb3dzIGFuIGV4Y2VwdGlvbiBpZiB0aGUgdW5kZXJseWluZyBjb25uZWN0aW9uIGlzIG5vdCBsaXZlLlxuICAgKi9cbiAgc2VuZFRleHQobXNnKSB7fVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBjb25uZWN0aW9uIGlzIGFsaXZlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNvbm5lY3Rpb24jXG4gICAqIEByZXR1cm5zIHtib29sZWFufSA8Y29kZT50cnVlPC9jb2RlPiBpZiBjb25uZWN0aW9uIGlzIGxpdmUsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBpc0Nvbm5lY3RlZCgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBuYW1lIG9mIHRoZSBjdXJyZW50IG5ldHdvcmsgdHJhbnNwb3J0LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNvbm5lY3Rpb24jXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IG5hbWUgb2YgdGhlIHRyYW5zcG9ydCBzdWNoIGFzIDxjb2RlPlwid3NcIjwvY29kZT4gb3IgPGNvZGU+XCJscFwiPC9jb2RlPi5cbiAgICovXG4gIHRyYW5zcG9ydCgpIHtcbiAgICByZXR1cm4gdGhpcy5pbml0aWFsaXplZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kIG5ldHdvcmsgcHJvYmUgdG8gY2hlY2sgaWYgY29ubmVjdGlvbiBpcyBpbmRlZWQgbGl2ZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Db25uZWN0aW9uI1xuICAgKi9cbiAgcHJvYmUoKSB7XG4gICAgdGhpcy5zZW5kVGV4dCgnMScpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0IGF1dG9yZWNvbm5lY3QgY291bnRlciB0byB6ZXJvLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNvbm5lY3Rpb24jXG4gICAqL1xuICBiYWNrb2ZmUmVzZXQoKSB7XG4gICAgdGhpcy4jYm9mZlJlc2V0KCk7XG4gIH1cblxuICAvLyBCYWNrb2ZmIGltcGxlbWVudGF0aW9uIC0gcmVjb25uZWN0IGFmdGVyIGEgdGltZW91dC5cbiAgI2JvZmZSZWNvbm5lY3QoKSB7XG4gICAgLy8gQ2xlYXIgdGltZXJcbiAgICBjbGVhclRpbWVvdXQodGhpcy4jYm9mZlRpbWVyKTtcbiAgICAvLyBDYWxjdWxhdGUgd2hlbiB0byBmaXJlIHRoZSByZWNvbm5lY3QgYXR0ZW1wdFxuICAgIGNvbnN0IHRpbWVvdXQgPSBfQk9GRl9CQVNFICogKE1hdGgucG93KDIsIHRoaXMuI2JvZmZJdGVyYXRpb24pICogKDEuMCArIF9CT0ZGX0pJVFRFUiAqIE1hdGgucmFuZG9tKCkpKTtcbiAgICAvLyBVcGRhdGUgaXRlcmF0aW9uIGNvdW50ZXIgZm9yIGZ1dHVyZSB1c2VcbiAgICB0aGlzLiNib2ZmSXRlcmF0aW9uID0gKHRoaXMuI2JvZmZJdGVyYXRpb24gPj0gX0JPRkZfTUFYX0lURVIgPyB0aGlzLiNib2ZmSXRlcmF0aW9uIDogdGhpcy4jYm9mZkl0ZXJhdGlvbiArIDEpO1xuICAgIGlmICh0aGlzLm9uQXV0b3JlY29ubmVjdEl0ZXJhdGlvbikge1xuICAgICAgdGhpcy5vbkF1dG9yZWNvbm5lY3RJdGVyYXRpb24odGltZW91dCk7XG4gICAgfVxuXG4gICAgdGhpcy4jYm9mZlRpbWVyID0gc2V0VGltZW91dChfID0+IHtcbiAgICAgIENvbm5lY3Rpb24uI2xvZyhgUmVjb25uZWN0aW5nLCBpdGVyPSR7dGhpcy4jYm9mZkl0ZXJhdGlvbn0sIHRpbWVvdXQ9JHt0aW1lb3V0fWApO1xuICAgICAgLy8gTWF5YmUgdGhlIHNvY2tldCB3YXMgY2xvc2VkIHdoaWxlIHdlIHdhaXRlZCBmb3IgdGhlIHRpbWVyP1xuICAgICAgaWYgKCF0aGlzLiNib2ZmQ2xvc2VkKSB7XG4gICAgICAgIGNvbnN0IHByb20gPSB0aGlzLmNvbm5lY3QoKTtcbiAgICAgICAgaWYgKHRoaXMub25BdXRvcmVjb25uZWN0SXRlcmF0aW9uKSB7XG4gICAgICAgICAgdGhpcy5vbkF1dG9yZWNvbm5lY3RJdGVyYXRpb24oMCwgcHJvbSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gU3VwcHJlc3MgZXJyb3IgaWYgaXQncyBub3QgdXNlZC5cbiAgICAgICAgICBwcm9tLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgIC8qIGRvIG5vdGhpbmcgKi9cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0aGlzLm9uQXV0b3JlY29ubmVjdEl0ZXJhdGlvbikge1xuICAgICAgICB0aGlzLm9uQXV0b3JlY29ubmVjdEl0ZXJhdGlvbigtMSk7XG4gICAgICB9XG4gICAgfSwgdGltZW91dCk7XG4gIH1cblxuICAvLyBUZXJtaW5hdGUgYXV0by1yZWNvbm5lY3QgcHJvY2Vzcy5cbiAgI2JvZmZTdG9wKCkge1xuICAgIGNsZWFyVGltZW91dCh0aGlzLiNib2ZmVGltZXIpO1xuICAgIHRoaXMuI2JvZmZUaW1lciA9IG51bGw7XG4gIH1cblxuICAvLyBSZXNldCBhdXRvLXJlY29ubmVjdCBpdGVyYXRpb24gY291bnRlci5cbiAgI2JvZmZSZXNldCgpIHtcbiAgICB0aGlzLiNib2ZmSXRlcmF0aW9uID0gMDtcbiAgfVxuXG4gIC8vIEluaXRpYWxpemF0aW9uIGZvciBsb25nIHBvbGxpbmcuXG4gICNpbml0X2xwKCkge1xuICAgIGNvbnN0IFhEUl9VTlNFTlQgPSAwOyAvLyBDbGllbnQgaGFzIGJlZW4gY3JlYXRlZC4gb3BlbigpIG5vdCBjYWxsZWQgeWV0LlxuICAgIGNvbnN0IFhEUl9PUEVORUQgPSAxOyAvLyBvcGVuKCkgaGFzIGJlZW4gY2FsbGVkLlxuICAgIGNvbnN0IFhEUl9IRUFERVJTX1JFQ0VJVkVEID0gMjsgLy8gc2VuZCgpIGhhcyBiZWVuIGNhbGxlZCwgYW5kIGhlYWRlcnMgYW5kIHN0YXR1cyBhcmUgYXZhaWxhYmxlLlxuICAgIGNvbnN0IFhEUl9MT0FESU5HID0gMzsgLy8gRG93bmxvYWRpbmc7IHJlc3BvbnNlVGV4dCBob2xkcyBwYXJ0aWFsIGRhdGEuXG4gICAgY29uc3QgWERSX0RPTkUgPSA0OyAvLyBUaGUgb3BlcmF0aW9uIGlzIGNvbXBsZXRlLlxuXG4gICAgLy8gRnVsbHkgY29tcG9zZWQgZW5kcG9pbnQgVVJMLCB3aXRoIEFQSSBrZXkgJiBTSURcbiAgICBsZXQgX2xwVVJMID0gbnVsbDtcblxuICAgIGxldCBfcG9sbGVyID0gbnVsbDtcbiAgICBsZXQgX3NlbmRlciA9IG51bGw7XG5cbiAgICBsZXQgbHBfc2VuZGVyID0gKHVybF8pID0+IHtcbiAgICAgIGNvbnN0IHNlbmRlciA9IG5ldyBYSFJQcm92aWRlcigpO1xuICAgICAgc2VuZGVyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IChldnQpID0+IHtcbiAgICAgICAgaWYgKHNlbmRlci5yZWFkeVN0YXRlID09IFhEUl9ET05FICYmIHNlbmRlci5zdGF0dXMgPj0gNDAwKSB7XG4gICAgICAgICAgLy8gU29tZSBzb3J0IG9mIGVycm9yIHJlc3BvbnNlXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBMUCBzZW5kZXIgZmFpbGVkLCAke3NlbmRlci5zdGF0dXN9YCk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHNlbmRlci5vcGVuKCdQT1NUJywgdXJsXywgdHJ1ZSk7XG4gICAgICByZXR1cm4gc2VuZGVyO1xuICAgIH1cblxuICAgIGxldCBscF9wb2xsZXIgPSAodXJsXywgcmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBsZXQgcG9sbGVyID0gbmV3IFhIUlByb3ZpZGVyKCk7XG4gICAgICBsZXQgcHJvbWlzZUNvbXBsZXRlZCA9IGZhbHNlO1xuXG4gICAgICBwb2xsZXIub25yZWFkeXN0YXRlY2hhbmdlID0gKGV2dCkgPT4ge1xuICAgICAgICBpZiAocG9sbGVyLnJlYWR5U3RhdGUgPT0gWERSX0RPTkUpIHtcbiAgICAgICAgICBpZiAocG9sbGVyLnN0YXR1cyA9PSAyMDEpIHsgLy8gMjAxID09IEhUVFAuQ3JlYXRlZCwgZ2V0IFNJRFxuICAgICAgICAgICAgbGV0IHBrdCA9IEpTT04ucGFyc2UocG9sbGVyLnJlc3BvbnNlVGV4dCwganNvblBhcnNlSGVscGVyKTtcbiAgICAgICAgICAgIF9scFVSTCA9IHVybF8gKyAnJnNpZD0nICsgcGt0LmN0cmwucGFyYW1zLnNpZDtcbiAgICAgICAgICAgIHBvbGxlciA9IGxwX3BvbGxlcihfbHBVUkwpO1xuICAgICAgICAgICAgcG9sbGVyLnNlbmQobnVsbCk7XG4gICAgICAgICAgICBpZiAodGhpcy5vbk9wZW4pIHtcbiAgICAgICAgICAgICAgdGhpcy5vbk9wZW4oKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHJlc29sdmUpIHtcbiAgICAgICAgICAgICAgcHJvbWlzZUNvbXBsZXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuYXV0b3JlY29ubmVjdCkge1xuICAgICAgICAgICAgICB0aGlzLiNib2ZmU3RvcCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAocG9sbGVyLnN0YXR1cyA8IDQwMCkgeyAvLyA0MDAgPSBIVFRQLkJhZFJlcXVlc3RcbiAgICAgICAgICAgIGlmICh0aGlzLm9uTWVzc2FnZSkge1xuICAgICAgICAgICAgICB0aGlzLm9uTWVzc2FnZShwb2xsZXIucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBvbGxlciA9IGxwX3BvbGxlcihfbHBVUkwpO1xuICAgICAgICAgICAgcG9sbGVyLnNlbmQobnVsbCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIERvbid0IHRocm93IGFuIGVycm9yIGhlcmUsIGdyYWNlZnVsbHkgaGFuZGxlIHNlcnZlciBlcnJvcnNcbiAgICAgICAgICAgIGlmIChyZWplY3QgJiYgIXByb21pc2VDb21wbGV0ZWQpIHtcbiAgICAgICAgICAgICAgcHJvbWlzZUNvbXBsZXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgIHJlamVjdChwb2xsZXIucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLm9uTWVzc2FnZSAmJiBwb2xsZXIucmVzcG9uc2VUZXh0KSB7XG4gICAgICAgICAgICAgIHRoaXMub25NZXNzYWdlKHBvbGxlci5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMub25EaXNjb25uZWN0KSB7XG4gICAgICAgICAgICAgIGNvbnN0IGNvZGUgPSBwb2xsZXIuc3RhdHVzIHx8ICh0aGlzLiNib2ZmQ2xvc2VkID8gTkVUV09SS19VU0VSIDogTkVUV09SS19FUlJPUik7XG4gICAgICAgICAgICAgIGNvbnN0IHRleHQgPSBwb2xsZXIucmVzcG9uc2VUZXh0IHx8ICh0aGlzLiNib2ZmQ2xvc2VkID8gTkVUV09SS19VU0VSX1RFWFQgOiBORVRXT1JLX0VSUk9SX1RFWFQpO1xuICAgICAgICAgICAgICB0aGlzLm9uRGlzY29ubmVjdChuZXcgRXJyb3IodGV4dCArICcgKCcgKyBjb2RlICsgJyknKSwgY29kZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFBvbGxpbmcgaGFzIHN0b3BwZWQuIEluZGljYXRlIGl0IGJ5IHNldHRpbmcgcG9sbGVyIHRvIG51bGwuXG4gICAgICAgICAgICBwb2xsZXIgPSBudWxsO1xuICAgICAgICAgICAgaWYgKCF0aGlzLiNib2ZmQ2xvc2VkICYmIHRoaXMuYXV0b3JlY29ubmVjdCkge1xuICAgICAgICAgICAgICB0aGlzLiNib2ZmUmVjb25uZWN0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgLy8gVXNpbmcgUE9TVCB0byBhdm9pZCBjYWNoaW5nIHJlc3BvbnNlIGJ5IHNlcnZpY2Ugd29ya2VyLlxuICAgICAgcG9sbGVyLm9wZW4oJ1BPU1QnLCB1cmxfLCB0cnVlKTtcbiAgICAgIHJldHVybiBwb2xsZXI7XG4gICAgfVxuXG4gICAgdGhpcy5jb25uZWN0ID0gKGhvc3RfLCBmb3JjZSkgPT4ge1xuICAgICAgdGhpcy4jYm9mZkNsb3NlZCA9IGZhbHNlO1xuXG4gICAgICBpZiAoX3BvbGxlcikge1xuICAgICAgICBpZiAoIWZvcmNlKSB7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICB9XG4gICAgICAgIF9wb2xsZXIub25yZWFkeXN0YXRlY2hhbmdlID0gdW5kZWZpbmVkO1xuICAgICAgICBfcG9sbGVyLmFib3J0KCk7XG4gICAgICAgIF9wb2xsZXIgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICBpZiAoaG9zdF8pIHtcbiAgICAgICAgdGhpcy5ob3N0ID0gaG9zdF87XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGNvbnN0IHVybCA9IG1ha2VCYXNlVXJsKHRoaXMuaG9zdCwgdGhpcy5zZWN1cmUgPyAnaHR0cHMnIDogJ2h0dHAnLCB0aGlzLnZlcnNpb24sIHRoaXMuYXBpS2V5KTtcbiAgICAgICAgQ29ubmVjdGlvbi4jbG9nKFwiTFAgY29ubmVjdGluZyB0bzpcIiwgdXJsKTtcbiAgICAgICAgX3BvbGxlciA9IGxwX3BvbGxlcih1cmwsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgIF9wb2xsZXIuc2VuZChudWxsKTtcbiAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgQ29ubmVjdGlvbi4jbG9nKFwiTFAgY29ubmVjdGlvbiBmYWlsZWQ6XCIsIGVycik7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgdGhpcy5yZWNvbm5lY3QgPSAoZm9yY2UpID0+IHtcbiAgICAgIHRoaXMuI2JvZmZTdG9wKCk7XG4gICAgICB0aGlzLmNvbm5lY3QobnVsbCwgZm9yY2UpO1xuICAgIH07XG5cbiAgICB0aGlzLmRpc2Nvbm5lY3QgPSAoKSA9PiB7XG4gICAgICB0aGlzLiNib2ZmQ2xvc2VkID0gdHJ1ZTtcbiAgICAgIHRoaXMuI2JvZmZTdG9wKCk7XG5cbiAgICAgIGlmIChfc2VuZGVyKSB7XG4gICAgICAgIF9zZW5kZXIub25yZWFkeXN0YXRlY2hhbmdlID0gdW5kZWZpbmVkO1xuICAgICAgICBfc2VuZGVyLmFib3J0KCk7XG4gICAgICAgIF9zZW5kZXIgPSBudWxsO1xuICAgICAgfVxuICAgICAgaWYgKF9wb2xsZXIpIHtcbiAgICAgICAgX3BvbGxlci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSB1bmRlZmluZWQ7XG4gICAgICAgIF9wb2xsZXIuYWJvcnQoKTtcbiAgICAgICAgX3BvbGxlciA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLm9uRGlzY29ubmVjdCkge1xuICAgICAgICB0aGlzLm9uRGlzY29ubmVjdChuZXcgRXJyb3IoTkVUV09SS19VU0VSX1RFWFQgKyAnICgnICsgTkVUV09SS19VU0VSICsgJyknKSwgTkVUV09SS19VU0VSKTtcbiAgICAgIH1cbiAgICAgIC8vIEVuc3VyZSBpdCdzIHJlY29uc3RydWN0ZWRcbiAgICAgIF9scFVSTCA9IG51bGw7XG4gICAgfTtcblxuICAgIHRoaXMuc2VuZFRleHQgPSAobXNnKSA9PiB7XG4gICAgICBfc2VuZGVyID0gbHBfc2VuZGVyKF9scFVSTCk7XG4gICAgICBpZiAoX3NlbmRlciAmJiAoX3NlbmRlci5yZWFkeVN0YXRlID09IFhEUl9PUEVORUQpKSB7IC8vIDEgPT0gT1BFTkVEXG4gICAgICAgIF9zZW5kZXIuc2VuZChtc2cpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTG9uZyBwb2xsZXIgZmFpbGVkIHRvIGNvbm5lY3RcIik7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRoaXMuaXNDb25uZWN0ZWQgPSAoKSA9PiB7XG4gICAgICByZXR1cm4gKF9wb2xsZXIgJiYgdHJ1ZSk7XG4gICAgfTtcbiAgfVxuXG4gIC8vIEluaXRpYWxpemF0aW9uIGZvciBXZWJzb2NrZXRcbiAgI2luaXRfd3MoKSB7XG4gICAgdGhpcy5jb25uZWN0ID0gKGhvc3RfLCBmb3JjZSkgPT4ge1xuICAgICAgdGhpcy4jYm9mZkNsb3NlZCA9IGZhbHNlO1xuXG4gICAgICBpZiAodGhpcy4jc29ja2V0KSB7XG4gICAgICAgIGlmICghZm9yY2UgJiYgdGhpcy4jc29ja2V0LnJlYWR5U3RhdGUgPT0gdGhpcy4jc29ja2V0Lk9QRU4pIHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy4jc29ja2V0LmNsb3NlKCk7XG4gICAgICAgIHRoaXMuI3NvY2tldCA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIGlmIChob3N0Xykge1xuICAgICAgICB0aGlzLmhvc3QgPSBob3N0XztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgY29uc3QgdXJsID0gbWFrZUJhc2VVcmwodGhpcy5ob3N0LCB0aGlzLnNlY3VyZSA/ICd3c3MnIDogJ3dzJywgdGhpcy52ZXJzaW9uLCB0aGlzLmFwaUtleSk7XG5cbiAgICAgICAgQ29ubmVjdGlvbi4jbG9nKFwiV1MgY29ubmVjdGluZyB0bzogXCIsIHVybCk7XG5cbiAgICAgICAgLy8gSXQgdGhyb3dzIHdoZW4gdGhlIHNlcnZlciBpcyBub3QgYWNjZXNzaWJsZSBidXQgdGhlIGV4Y2VwdGlvbiBjYW5ub3QgYmUgY2F1Z2h0OlxuICAgICAgICAvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8zMTAwMjU5Mi9qYXZhc2NyaXB0LWRvZXNudC1jYXRjaC1lcnJvci1pbi13ZWJzb2NrZXQtaW5zdGFudGlhdGlvbi8zMTAwMzA1N1xuICAgICAgICBjb25zdCBjb25uID0gbmV3IFdlYlNvY2tldFByb3ZpZGVyKHVybCk7XG5cbiAgICAgICAgY29ubi5vbmVycm9yID0gKGVycikgPT4ge1xuICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbm4ub25vcGVuID0gKGV2dCkgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLmF1dG9yZWNvbm5lY3QpIHtcbiAgICAgICAgICAgIHRoaXMuI2JvZmZTdG9wKCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHRoaXMub25PcGVuKSB7XG4gICAgICAgICAgICB0aGlzLm9uT3BlbigpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICBjb25uLm9uY2xvc2UgPSAoZXZ0KSA9PiB7XG4gICAgICAgICAgdGhpcy4jc29ja2V0ID0gbnVsbDtcblxuICAgICAgICAgIGlmICh0aGlzLm9uRGlzY29ubmVjdCkge1xuICAgICAgICAgICAgY29uc3QgY29kZSA9IHRoaXMuI2JvZmZDbG9zZWQgPyBORVRXT1JLX1VTRVIgOiBORVRXT1JLX0VSUk9SO1xuICAgICAgICAgICAgdGhpcy5vbkRpc2Nvbm5lY3QobmV3IEVycm9yKHRoaXMuI2JvZmZDbG9zZWQgPyBORVRXT1JLX1VTRVJfVEVYVCA6IE5FVFdPUktfRVJST1JfVEVYVCArXG4gICAgICAgICAgICAgICcgKCcgKyBjb2RlICsgJyknKSwgY29kZSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKCF0aGlzLiNib2ZmQ2xvc2VkICYmIHRoaXMuYXV0b3JlY29ubmVjdCkge1xuICAgICAgICAgICAgdGhpcy4jYm9mZlJlY29ubmVjdCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBjb25uLm9ubWVzc2FnZSA9IChldnQpID0+IHtcbiAgICAgICAgICBpZiAodGhpcy5vbk1lc3NhZ2UpIHtcbiAgICAgICAgICAgIHRoaXMub25NZXNzYWdlKGV2dC5kYXRhKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy4jc29ja2V0ID0gY29ubjtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMucmVjb25uZWN0ID0gKGZvcmNlKSA9PiB7XG4gICAgICB0aGlzLiNib2ZmU3RvcCgpO1xuICAgICAgdGhpcy5jb25uZWN0KG51bGwsIGZvcmNlKTtcbiAgICB9O1xuXG4gICAgdGhpcy5kaXNjb25uZWN0ID0gKCkgPT4ge1xuICAgICAgdGhpcy4jYm9mZkNsb3NlZCA9IHRydWU7XG4gICAgICB0aGlzLiNib2ZmU3RvcCgpO1xuXG4gICAgICBpZiAoIXRoaXMuI3NvY2tldCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0aGlzLiNzb2NrZXQuY2xvc2UoKTtcbiAgICAgIHRoaXMuI3NvY2tldCA9IG51bGw7XG4gICAgfTtcblxuICAgIHRoaXMuc2VuZFRleHQgPSAobXNnKSA9PiB7XG4gICAgICBpZiAodGhpcy4jc29ja2V0ICYmICh0aGlzLiNzb2NrZXQucmVhZHlTdGF0ZSA9PSB0aGlzLiNzb2NrZXQuT1BFTikpIHtcbiAgICAgICAgdGhpcy4jc29ja2V0LnNlbmQobXNnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIldlYnNvY2tldCBpcyBub3QgY29ubmVjdGVkXCIpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLmlzQ29ubmVjdGVkID0gKCkgPT4ge1xuICAgICAgcmV0dXJuICh0aGlzLiNzb2NrZXQgJiYgKHRoaXMuI3NvY2tldC5yZWFkeVN0YXRlID09IHRoaXMuI3NvY2tldC5PUEVOKSk7XG4gICAgfTtcbiAgfVxuXG4gIC8vIENhbGxiYWNrczpcblxuICAvKipcbiAgICogQSBjYWxsYmFjayB0byBwYXNzIGluY29taW5nIG1lc3NhZ2VzIHRvLiBTZWUge0BsaW5rIFRpbm9kZS5Db25uZWN0aW9uI29uTWVzc2FnZX0uXG4gICAqIEBjYWxsYmFjayBUaW5vZGUuQ29ubmVjdGlvbi5Pbk1lc3NhZ2VcbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Db25uZWN0aW9uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlIC0gTWVzc2FnZSB0byBwcm9jZXNzLlxuICAgKi9cbiAgb25NZXNzYWdlID0gdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBBIGNhbGxiYWNrIGZvciByZXBvcnRpbmcgYSBkcm9wcGVkIGNvbm5lY3Rpb24uXG4gICAqIEB0eXBlIHtmdW5jdGlvbn1cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Db25uZWN0aW9uI1xuICAgKi9cbiAgb25EaXNjb25uZWN0ID0gdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBBIGNhbGxiYWNrIGNhbGxlZCB3aGVuIHRoZSBjb25uZWN0aW9uIGlzIHJlYWR5IHRvIGJlIHVzZWQgZm9yIHNlbmRpbmcuIEZvciB3ZWJzb2NrZXRzIGl0J3Mgc29ja2V0IG9wZW4sXG4gICAqIGZvciBsb25nIHBvbGxpbmcgaXQncyA8Y29kZT5yZWFkeVN0YXRlPTE8L2NvZGU+IChPUEVORUQpXG4gICAqIEB0eXBlIHtmdW5jdGlvbn1cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Db25uZWN0aW9uI1xuICAgKi9cbiAgb25PcGVuID0gdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBBIGNhbGxiYWNrIHRvIG5vdGlmeSBvZiByZWNvbm5lY3Rpb24gYXR0ZW1wdHMuIFNlZSB7QGxpbmsgVGlub2RlLkNvbm5lY3Rpb24jb25BdXRvcmVjb25uZWN0SXRlcmF0aW9ufS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Db25uZWN0aW9uXG4gICAqIEBjYWxsYmFjayBBdXRvcmVjb25uZWN0SXRlcmF0aW9uVHlwZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGltZW91dCAtIHRpbWUgdGlsbCB0aGUgbmV4dCByZWNvbm5lY3QgYXR0ZW1wdCBpbiBtaWxsaXNlY29uZHMuIDxjb2RlPi0xPC9jb2RlPiBtZWFucyByZWNvbm5lY3Qgd2FzIHNraXBwZWQuXG4gICAqIEBwYXJhbSB7UHJvbWlzZX0gcHJvbWlzZSByZXNvbHZlZCBvciByZWplY3RlZCB3aGVuIHRoZSByZWNvbm5lY3QgYXR0ZW1wIGNvbXBsZXRlcy5cbiAgICpcbiAgICovXG4gIC8qKlxuICAgKiBBIGNhbGxiYWNrIHRvIGluZm9ybSB3aGVuIHRoZSBuZXh0IGF0dGFtcHQgdG8gcmVjb25uZWN0IHdpbGwgaGFwcGVuIGFuZCB0byByZWNlaXZlIGNvbm5lY3Rpb24gcHJvbWlzZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Db25uZWN0aW9uI1xuICAgKiBAdHlwZSB7VGlub2RlLkNvbm5lY3Rpb24uQXV0b3JlY29ubmVjdEl0ZXJhdGlvblR5cGV9XG4gICAqL1xuICBvbkF1dG9yZWNvbm5lY3RJdGVyYXRpb24gPSB1bmRlZmluZWQ7XG59XG5cbkNvbm5lY3Rpb24uTkVUV09SS19FUlJPUiA9IE5FVFdPUktfRVJST1I7XG5Db25uZWN0aW9uLk5FVFdPUktfRVJST1JfVEVYVCA9IE5FVFdPUktfRVJST1JfVEVYVDtcbkNvbm5lY3Rpb24uTkVUV09SS19VU0VSID0gTkVUV09SS19VU0VSO1xuQ29ubmVjdGlvbi5ORVRXT1JLX1VTRVJfVEVYVCA9IE5FVFdPUktfVVNFUl9URVhUO1xuIiwiLyoqXG4gKiBAZmlsZSBIZWxwZXIgbWV0aG9kcyBmb3IgZGVhbGluZyB3aXRoIEluZGV4ZWREQiBjYWNoZSBvZiBtZXNzYWdlcywgdXNlcnMsIGFuZCB0b3BpY3MuXG4gKlxuICogQGNvcHlyaWdodCAyMDE1LTIwMjIgVGlub2RlIExMQy5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG4vLyBOT1RFIFRPIERFVkVMT1BFUlM6XG4vLyBMb2NhbGl6YWJsZSBzdHJpbmdzIHNob3VsZCBiZSBkb3VibGUgcXVvdGVkIFwi0YHRgtGA0L7QutCwINC90LAg0LTRgNGD0LPQvtC8INGP0LfRi9C60LVcIixcbi8vIG5vbi1sb2NhbGl6YWJsZSBzdHJpbmdzIHNob3VsZCBiZSBzaW5nbGUgcXVvdGVkICdub24tbG9jYWxpemVkJy5cblxuY29uc3QgREJfVkVSU0lPTiA9IDE7XG5jb25zdCBEQl9OQU1FID0gJ3Rpbm9kZS13ZWInO1xuXG5sZXQgSURCUHJvdmlkZXI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERCIHtcbiAgI29uRXJyb3IgPSBfID0+IHt9O1xuICAjbG9nZ2VyID0gXyA9PiB7fTtcblxuICAvLyBJbnN0YW5jZSBvZiBJbmRleERCLlxuICBkYiA9IG51bGw7XG4gIC8vIEluZGljYXRvciB0aGF0IHRoZSBjYWNoZSBpcyBkaXNhYmxlZC5cbiAgZGlzYWJsZWQgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihvbkVycm9yLCBsb2dnZXIpIHtcbiAgICB0aGlzLiNvbkVycm9yID0gb25FcnJvciB8fCB0aGlzLiNvbkVycm9yO1xuICAgIHRoaXMuI2xvZ2dlciA9IGxvZ2dlciB8fCB0aGlzLiNsb2dnZXI7XG4gIH1cblxuICAjbWFwT2JqZWN0cyhzb3VyY2UsIGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgaWYgKCF0aGlzLmRiKSB7XG4gICAgICByZXR1cm4gZGlzYWJsZWQgP1xuICAgICAgICBQcm9taXNlLnJlc29sdmUoW10pIDpcbiAgICAgICAgUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwibm90IGluaXRpYWxpemVkXCIpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgdHJ4ID0gdGhpcy5kYi50cmFuc2FjdGlvbihbc291cmNlXSk7XG4gICAgICB0cngub25lcnJvciA9IChldmVudCkgPT4ge1xuICAgICAgICB0aGlzLiNsb2dnZXIoJ1BDYWNoZScsICdtYXBPYmplY3RzJywgc291cmNlLCBldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgICByZWplY3QoZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgIH07XG4gICAgICB0cngub2JqZWN0U3RvcmUoc291cmNlKS5nZXRBbGwoKS5vbnN1Y2Nlc3MgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgZXZlbnQudGFyZ2V0LnJlc3VsdC5mb3JFYWNoKCh0b3BpYykgPT4ge1xuICAgICAgICAgICAgY2FsbGJhY2suY2FsbChjb250ZXh0LCB0b3BpYyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmVzb2x2ZShldmVudC50YXJnZXQucmVzdWx0KTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSBwZXJzaXN0ZW50IGNhY2hlOiBvcGVuIG9yIGNyZWF0ZS91cGdyYWRlIGlmIG5lZWRlZC5cbiAgICogQHJldHVybnMge1Byb21pc2V9IHByb21pc2UgdG8gYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgREIgaXMgaW5pdGlhbGl6ZWQuXG4gICAqL1xuICBpbml0RGF0YWJhc2UoKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIC8vIE9wZW4gdGhlIGRhdGFiYXNlIGFuZCBpbml0aWFsaXplIGNhbGxiYWNrcy5cbiAgICAgIGNvbnN0IHJlcSA9IElEQlByb3ZpZGVyLm9wZW4oREJfTkFNRSwgREJfVkVSU0lPTik7XG4gICAgICByZXEub25zdWNjZXNzID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuZGIgPSBldmVudC50YXJnZXQucmVzdWx0O1xuICAgICAgICB0aGlzLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIHJlc29sdmUodGhpcy5kYik7XG4gICAgICB9O1xuICAgICAgcmVxLm9uZXJyb3IgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy4jbG9nZ2VyKCdQQ2FjaGUnLCBcImZhaWxlZCB0byBpbml0aWFsaXplXCIsIGV2ZW50KTtcbiAgICAgICAgcmVqZWN0KGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICAgIHRoaXMuI29uRXJyb3IoZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgIH07XG4gICAgICByZXEub251cGdyYWRlbmVlZGVkID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgdGhpcy5kYiA9IGV2ZW50LnRhcmdldC5yZXN1bHQ7XG5cbiAgICAgICAgdGhpcy5kYi5vbmVycm9yID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICB0aGlzLiNsb2dnZXIoJ1BDYWNoZScsIFwiZmFpbGVkIHRvIGNyZWF0ZSBzdG9yYWdlXCIsIGV2ZW50KTtcbiAgICAgICAgICB0aGlzLiNvbkVycm9yKGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gSW5kaXZpZHVhbCBvYmplY3Qgc3RvcmVzLlxuICAgICAgICAvLyBPYmplY3Qgc3RvcmUgKHRhYmxlKSBmb3IgdG9waWNzLiBUaGUgcHJpbWFyeSBrZXkgaXMgdG9waWMgbmFtZS5cbiAgICAgICAgdGhpcy5kYi5jcmVhdGVPYmplY3RTdG9yZSgndG9waWMnLCB7XG4gICAgICAgICAga2V5UGF0aDogJ25hbWUnXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFVzZXJzIG9iamVjdCBzdG9yZS4gVUlEIGlzIHRoZSBwcmltYXJ5IGtleS5cbiAgICAgICAgdGhpcy5kYi5jcmVhdGVPYmplY3RTdG9yZSgndXNlcicsIHtcbiAgICAgICAgICBrZXlQYXRoOiAndWlkJ1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBTdWJzY3JpcHRpb25zIG9iamVjdCBzdG9yZSB0b3BpYyA8LT4gdXNlci4gVG9waWMgbmFtZSArIFVJRCBpcyB0aGUgcHJpbWFyeSBrZXkuXG4gICAgICAgIHRoaXMuZGIuY3JlYXRlT2JqZWN0U3RvcmUoJ3N1YnNjcmlwdGlvbicsIHtcbiAgICAgICAgICBrZXlQYXRoOiBbJ3RvcGljJywgJ3VpZCddXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIE1lc3NhZ2VzIG9iamVjdCBzdG9yZS4gVGhlIHByaW1hcnkga2V5IGlzIHRvcGljIG5hbWUgKyBzZXEuXG4gICAgICAgIHRoaXMuZGIuY3JlYXRlT2JqZWN0U3RvcmUoJ21lc3NhZ2UnLCB7XG4gICAgICAgICAga2V5UGF0aDogWyd0b3BpYycsICdzZXEnXVxuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogRGVsZXRlIHBlcnNpc3RlbnQgY2FjaGUuXG4gICAqL1xuICBkZWxldGVEYXRhYmFzZSgpIHtcbiAgICAvLyBDbG9zZSBjb25uZWN0aW9uLCBvdGhlcndpc2Ugb3BlcmF0aW9ucyB3aWxsIGZhaWwgd2l0aCAnb25ibG9ja2VkJy5cbiAgICBpZiAodGhpcy5kYikge1xuICAgICAgdGhpcy5kYi5jbG9zZSgpO1xuICAgICAgdGhpcy5kYiA9IG51bGw7XG4gICAgfVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCByZXEgPSBJREJQcm92aWRlci5kZWxldGVEYXRhYmFzZShEQl9OQU1FKTtcbiAgICAgIHJlcS5vbmJsb2NrZWQgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBpZiAodGhpcy5kYikge1xuICAgICAgICAgIHRoaXMuZGIuY2xvc2UoKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBlcnIgPSBuZXcgRXJyb3IoXCJibG9ja2VkXCIpO1xuICAgICAgICB0aGlzLiNsb2dnZXIoJ1BDYWNoZScsICdkZWxldGVEYXRhYmFzZScsIGVycik7XG4gICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgfTtcbiAgICAgIHJlcS5vbnN1Y2Nlc3MgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy5kYiA9IG51bGw7XG4gICAgICAgIHRoaXMuZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICByZXNvbHZlKHRydWUpO1xuICAgICAgfTtcbiAgICAgIHJlcS5vbmVycm9yID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuI2xvZ2dlcignUENhY2hlJywgJ2RlbGV0ZURhdGFiYXNlJywgZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgICAgcmVqZWN0KGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHBlcnNpc3RlbnQgY2FjaGUgaXMgcmVhZHkgZm9yIHVzZS5cbiAgICogQG1lbWJlck9mIERCXG4gICAqIEByZXR1cm5zIHtib29sZWFufSA8Y29kZT50cnVlPC9jb2RlPiBpZiBjYWNoZSBpcyByZWFkeSwgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIGlzUmVhZHkoKSB7XG4gICAgcmV0dXJuICEhdGhpcy5kYjtcbiAgfVxuXG4gIC8vIFRvcGljcy5cblxuICAvKipcbiAgICogU2F2ZSB0byBjYWNoZSBvciB1cGRhdGUgdG9waWMgaW4gcGVyc2lzdGVudCBjYWNoZS5cbiAgICogQG1lbWJlck9mIERCXG4gICAqIEBwYXJhbSB7VG9waWN9IHRvcGljIC0gdG9waWMgdG8gYmUgYWRkZWQgb3IgdXBkYXRlZC5cbiAgICogQHJldHVybnMge1Byb21pc2V9IHByb21pc2UgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gb3BlcmF0aW9uIGNvbXBsZXRpb24uXG4gICAqL1xuICB1cGRUb3BpYyh0b3BpYykge1xuICAgIGlmICghdGhpcy5pc1JlYWR5KCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmRpc2FibGVkID9cbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkgOlxuICAgICAgICBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJub3QgaW5pdGlhbGl6ZWRcIikpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgdHJ4ID0gdGhpcy5kYi50cmFuc2FjdGlvbihbJ3RvcGljJ10sICdyZWFkd3JpdGUnKTtcbiAgICAgIHRyeC5vbmNvbXBsZXRlID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHJlc29sdmUoZXZlbnQudGFyZ2V0LnJlc3VsdCk7XG4gICAgICB9O1xuICAgICAgdHJ4Lm9uZXJyb3IgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy4jbG9nZ2VyKCdQQ2FjaGUnLCAndXBkVG9waWMnLCBldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgICByZWplY3QoZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgIH07XG4gICAgICBjb25zdCByZXEgPSB0cngub2JqZWN0U3RvcmUoJ3RvcGljJykuZ2V0KHRvcGljLm5hbWUpO1xuICAgICAgcmVxLm9uc3VjY2VzcyA9IChldmVudCkgPT4ge1xuICAgICAgICB0cngub2JqZWN0U3RvcmUoJ3RvcGljJykucHV0KERCLiNzZXJpYWxpemVUb3BpYyhyZXEucmVzdWx0LCB0b3BpYykpO1xuICAgICAgICB0cnguY29tbWl0KCk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hcmsgb3IgdW5tYXJrIHRvcGljIGFzIGRlbGV0ZWQuXG4gICAqIEBtZW1iZXJPZiBEQlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIG5hbWUgb2YgdGhlIHRvcGljIHRvIG1hcmsgb3IgdW5tYXJrLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBwcm9taXNlIHJlc29sdmVkL3JlamVjdGVkIG9uIG9wZXJhdGlvbiBjb21wbGV0aW9uLlxuICAgKi9cbiAgbWFya1RvcGljQXNEZWxldGVkKG5hbWUpIHtcbiAgICBpZiAoIXRoaXMuaXNSZWFkeSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5kaXNhYmxlZCA/XG4gICAgICAgIFByb21pc2UucmVzb2x2ZSgpIDpcbiAgICAgICAgUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwibm90IGluaXRpYWxpemVkXCIpKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IHRyeCA9IHRoaXMuZGIudHJhbnNhY3Rpb24oWyd0b3BpYyddLCAncmVhZHdyaXRlJyk7XG4gICAgICB0cngub25jb21wbGV0ZSA9IChldmVudCkgPT4ge1xuICAgICAgICByZXNvbHZlKGV2ZW50LnRhcmdldC5yZXN1bHQpO1xuICAgICAgfTtcbiAgICAgIHRyeC5vbmVycm9yID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuI2xvZ2dlcignUENhY2hlJywgJ21hcmtUb3BpY0FzRGVsZXRlZCcsIGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICAgIHJlamVjdChldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgfTtcbiAgICAgIGNvbnN0IHJlcSA9IHRyeC5vYmplY3RTdG9yZSgndG9waWMnKS5nZXQobmFtZSk7XG4gICAgICByZXEub25zdWNjZXNzID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIGNvbnN0IHRvcGljID0gZXZlbnQudGFyZ2V0LnJlc3VsdDtcbiAgICAgICAgdG9waWMuX2RlbGV0ZWQgPSB0cnVlO1xuICAgICAgICB0cngub2JqZWN0U3RvcmUoJ3RvcGljJykucHV0KHRvcGljKTtcbiAgICAgICAgdHJ4LmNvbW1pdCgpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgdG9waWMgZnJvbSBwZXJzaXN0ZW50IGNhY2hlLlxuICAgKiBAbWVtYmVyT2YgREJcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBuYW1lIG9mIHRoZSB0b3BpYyB0byByZW1vdmUgZnJvbSBkYXRhYmFzZS5cbiAgICogQHJldHVybiB7UHJvbWlzZX0gcHJvbWlzZSByZXNvbHZlZC9yZWplY3RlZCBvbiBvcGVyYXRpb24gY29tcGxldGlvbi5cbiAgICovXG4gIHJlbVRvcGljKG5hbWUpIHtcbiAgICBpZiAoIXRoaXMuaXNSZWFkeSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5kaXNhYmxlZCA/XG4gICAgICAgIFByb21pc2UucmVzb2x2ZSgpIDpcbiAgICAgICAgUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwibm90IGluaXRpYWxpemVkXCIpKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IHRyeCA9IHRoaXMuZGIudHJhbnNhY3Rpb24oWyd0b3BpYycsICdzdWJzY3JpcHRpb24nLCAnbWVzc2FnZSddLCAncmVhZHdyaXRlJyk7XG4gICAgICB0cngub25jb21wbGV0ZSA9IChldmVudCkgPT4ge1xuICAgICAgICByZXNvbHZlKGV2ZW50LnRhcmdldC5yZXN1bHQpO1xuICAgICAgfTtcbiAgICAgIHRyeC5vbmVycm9yID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuI2xvZ2dlcignUENhY2hlJywgJ3JlbVRvcGljJywgZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgICAgcmVqZWN0KGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICB9O1xuICAgICAgdHJ4Lm9iamVjdFN0b3JlKCd0b3BpYycpLmRlbGV0ZShJREJLZXlSYW5nZS5vbmx5KG5hbWUpKTtcbiAgICAgIHRyeC5vYmplY3RTdG9yZSgnc3Vic2NyaXB0aW9uJykuZGVsZXRlKElEQktleVJhbmdlLmJvdW5kKFtuYW1lLCAnLSddLCBbbmFtZSwgJ34nXSkpO1xuICAgICAgdHJ4Lm9iamVjdFN0b3JlKCdtZXNzYWdlJykuZGVsZXRlKElEQktleVJhbmdlLmJvdW5kKFtuYW1lLCAwXSwgW25hbWUsIE51bWJlci5NQVhfU0FGRV9JTlRFR0VSXSkpO1xuICAgICAgdHJ4LmNvbW1pdCgpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4ZWN1dGUgYSBjYWxsYmFjayBmb3IgZWFjaCBzdG9yZWQgdG9waWMuXG4gICAqIEBtZW1iZXJPZiBEQlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayAtIGZ1bmN0aW9uIHRvIGNhbGwgZm9yIGVhY2ggdG9waWMuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZXh0IC0gdGhlIHZhbHVlIG9yIDxjb2RlPnRoaXM8L2NvZGU+IGluc2lkZSB0aGUgY2FsbGJhY2suXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IHByb21pc2UgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gb3BlcmF0aW9uIGNvbXBsZXRpb24uXG4gICAqL1xuICBtYXBUb3BpY3MoY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICByZXR1cm4gdGhpcy4jbWFwT2JqZWN0cygndG9waWMnLCBjYWxsYmFjaywgY29udGV4dCk7XG4gIH1cblxuICAvKipcbiAgICogQ29weSBkYXRhIGZyb20gc2VyaWFsaXplZCBvYmplY3QgdG8gdG9waWMuXG4gICAqIEBtZW1iZXJPZiBEQlxuICAgKiBAcGFyYW0ge1RvcGljfSB0b3BpYyAtIHRhcmdldCB0byBkZXNlcmlhbGl6ZSB0by5cbiAgICogQHBhcmFtIHtPYmplY3R9IHNyYyAtIHNlcmlhbGl6ZWQgZGF0YSB0byBjb3B5IGZyb20uXG4gICAqL1xuICBkZXNlcmlhbGl6ZVRvcGljKHRvcGljLCBzcmMpIHtcbiAgICBEQi4jZGVzZXJpYWxpemVUb3BpYyh0b3BpYywgc3JjKTtcbiAgfVxuXG4gIC8vIFVzZXJzLlxuICAvKipcbiAgICogQWRkIG9yIHVwZGF0ZSB1c2VyIG9iamVjdCBpbiB0aGUgcGVyc2lzdGVudCBjYWNoZS5cbiAgICogQG1lbWJlck9mIERCXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1aWQgLSBJRCBvZiB0aGUgdXNlciB0byBzYXZlIG9yIHVwZGF0ZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IHB1YiAtIHVzZXIncyA8Y29kZT5wdWJsaWM8L2NvZGU+IGluZm9ybWF0aW9uLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gcHJvbWlzZSByZXNvbHZlZC9yZWplY3RlZCBvbiBvcGVyYXRpb24gY29tcGxldGlvbi5cbiAgICovXG4gIHVwZFVzZXIodWlkLCBwdWIpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIgfHwgcHViID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIE5vIHBvaW50IGludXBkYXRpbmcgdXNlciB3aXRoIGludmFsaWQgZGF0YS5cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCF0aGlzLmlzUmVhZHkoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZGlzYWJsZWQgP1xuICAgICAgICBQcm9taXNlLnJlc29sdmUoKSA6XG4gICAgICAgIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIm5vdCBpbml0aWFsaXplZFwiKSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCB0cnggPSB0aGlzLmRiLnRyYW5zYWN0aW9uKFsndXNlciddLCAncmVhZHdyaXRlJyk7XG4gICAgICB0cngub25jb21wbGV0ZSA9IChldmVudCkgPT4ge1xuICAgICAgICByZXNvbHZlKGV2ZW50LnRhcmdldC5yZXN1bHQpO1xuICAgICAgfTtcbiAgICAgIHRyeC5vbmVycm9yID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuI2xvZ2dlcignUENhY2hlJywgJ3VwZFVzZXInLCBldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgICByZWplY3QoZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgIH07XG4gICAgICB0cngub2JqZWN0U3RvcmUoJ3VzZXInKS5wdXQoe1xuICAgICAgICB1aWQ6IHVpZCxcbiAgICAgICAgcHVibGljOiBwdWJcbiAgICAgIH0pO1xuICAgICAgdHJ4LmNvbW1pdCgpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSB1c2VyIGZyb20gcGVyc2lzdGVudCBjYWNoZS5cbiAgICogQG1lbWJlck9mIERCXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1aWQgLSBJRCBvZiB0aGUgdXNlciB0byByZW1vdmUgZnJvbSB0aGUgY2FjaGUuXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IHByb21pc2UgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gb3BlcmF0aW9uIGNvbXBsZXRpb24uXG4gICAqL1xuICByZW1Vc2VyKHVpZCkge1xuICAgIGlmICghdGhpcy5pc1JlYWR5KCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmRpc2FibGVkID9cbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkgOlxuICAgICAgICBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJub3QgaW5pdGlhbGl6ZWRcIikpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgdHJ4ID0gdGhpcy5kYi50cmFuc2FjdGlvbihbJ3VzZXInXSwgJ3JlYWR3cml0ZScpO1xuICAgICAgdHJ4Lm9uY29tcGxldGUgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgcmVzb2x2ZShldmVudC50YXJnZXQucmVzdWx0KTtcbiAgICAgIH07XG4gICAgICB0cngub25lcnJvciA9IChldmVudCkgPT4ge1xuICAgICAgICB0aGlzLiNsb2dnZXIoJ1BDYWNoZScsICdyZW1Vc2VyJywgZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgICAgcmVqZWN0KGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICB9O1xuICAgICAgdHJ4Lm9iamVjdFN0b3JlKCd1c2VyJykuZGVsZXRlKElEQktleVJhbmdlLm9ubHkodWlkKSk7XG4gICAgICB0cnguY29tbWl0KCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogRXhlY3V0ZSBhIGNhbGxiYWNrIGZvciBlYWNoIHN0b3JlZCB1c2VyLlxuICAgKiBAbWVtYmVyT2YgREJcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgLSBmdW5jdGlvbiB0byBjYWxsIGZvciBlYWNoIHRvcGljLlxuICAgKiBAcGFyYW0ge09iamVjdH0gY29udGV4dCAtIHRoZSB2YWx1ZSBvciA8Y29kZT50aGlzPC9jb2RlPiBpbnNpZGUgdGhlIGNhbGxiYWNrLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBwcm9taXNlIHJlc29sdmVkL3JlamVjdGVkIG9uIG9wZXJhdGlvbiBjb21wbGV0aW9uLlxuICAgKi9cbiAgbWFwVXNlcnMoY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICByZXR1cm4gdGhpcy4jbWFwT2JqZWN0cygndXNlcicsIGNhbGxiYWNrLCBjb250ZXh0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWFkIGEgc2luZ2xlIHVzZXIgZnJvbSBwZXJzaXN0ZW50IGNhY2hlLlxuICAgKiBAbWVtYmVyT2YgREJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVpZCAtIElEIG9mIHRoZSB1c2VyIHRvIGZldGNoIGZyb20gY2FjaGUuXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IHByb21pc2UgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gb3BlcmF0aW9uIGNvbXBsZXRpb24uXG4gICAqL1xuICBnZXRVc2VyKHVpZCkge1xuICAgIGlmICghdGhpcy5pc1JlYWR5KCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmRpc2FibGVkID9cbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkgOlxuICAgICAgICBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJub3QgaW5pdGlhbGl6ZWRcIikpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgdHJ4ID0gdGhpcy5kYi50cmFuc2FjdGlvbihbJ3VzZXInXSk7XG4gICAgICB0cngub25jb21wbGV0ZSA9IChldmVudCkgPT4ge1xuICAgICAgICBjb25zdCB1c2VyID0gZXZlbnQudGFyZ2V0LnJlc3VsdDtcbiAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgdXNlcjogdXNlci51aWQsXG4gICAgICAgICAgcHVibGljOiB1c2VyLnB1YmxpY1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgICB0cngub25lcnJvciA9IChldmVudCkgPT4ge1xuICAgICAgICB0aGlzLiNsb2dnZXIoJ1BDYWNoZScsICdnZXRVc2VyJywgZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgICAgcmVqZWN0KGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICB9O1xuICAgICAgdHJ4Lm9iamVjdFN0b3JlKCd1c2VyJykuZ2V0KHVpZCk7XG4gICAgfSk7XG4gIH1cblxuICAvLyBTdWJzY3JpcHRpb25zLlxuICAvKipcbiAgICogQWRkIG9yIHVwZGF0ZSBzdWJzY3JpcHRpb24gaW4gcGVyc2lzdGVudCBjYWNoZS5cbiAgICogQG1lbWJlck9mIERCXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpY05hbWUgLSBuYW1lIG9mIHRoZSB0b3BpYyB3aGljaCBvd25zIHRoZSBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdWlkIC0gSUQgb2YgdGhlIHN1YnNjcmliZWQgdXNlci5cbiAgICogQHBhcmFtIHtPYmplY3R9IHN1YiAtIHN1YnNjcmlwdGlvbiB0byBzYXZlLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBwcm9taXNlIHJlc29sdmVkL3JlamVjdGVkIG9uIG9wZXJhdGlvbiBjb21wbGV0aW9uLlxuICAgKi9cbiAgdXBkU3Vic2NyaXB0aW9uKHRvcGljTmFtZSwgdWlkLCBzdWIpIHtcbiAgICBpZiAoIXRoaXMuaXNSZWFkeSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5kaXNhYmxlZCA/XG4gICAgICAgIFByb21pc2UucmVzb2x2ZSgpIDpcbiAgICAgICAgUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwibm90IGluaXRpYWxpemVkXCIpKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IHRyeCA9IHRoaXMuZGIudHJhbnNhY3Rpb24oWydzdWJzY3JpcHRpb24nXSwgJ3JlYWR3cml0ZScpO1xuICAgICAgdHJ4Lm9uY29tcGxldGUgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgcmVzb2x2ZShldmVudC50YXJnZXQucmVzdWx0KTtcbiAgICAgIH07XG4gICAgICB0cngub25lcnJvciA9IChldmVudCkgPT4ge1xuICAgICAgICB0aGlzLiNsb2dnZXIoJ1BDYWNoZScsICd1cGRTdWJzY3JpcHRpb24nLCBldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgICByZWplY3QoZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgIH07XG4gICAgICB0cngub2JqZWN0U3RvcmUoJ3N1YnNjcmlwdGlvbicpLmdldChbdG9waWNOYW1lLCB1aWRdKS5vbnN1Y2Nlc3MgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgdHJ4Lm9iamVjdFN0b3JlKCdzdWJzY3JpcHRpb24nKS5wdXQoREIuI3NlcmlhbGl6ZVN1YnNjcmlwdGlvbihldmVudC50YXJnZXQucmVzdWx0LCB0b3BpY05hbWUsIHVpZCwgc3ViKSk7XG4gICAgICAgIHRyeC5jb21taXQoKTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogRXhlY3V0ZSBhIGNhbGxiYWNrIGZvciBlYWNoIGNhY2hlZCBzdWJzY3JpcHRpb24gaW4gYSBnaXZlbiB0b3BpYy5cbiAgICogQG1lbWJlck9mIERCXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpY05hbWUgLSBuYW1lIG9mIHRoZSB0b3BpYyB3aGljaCBvd25zIHRoZSBzdWJzY3JpcHRpb25zLlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayAtIGZ1bmN0aW9uIHRvIGNhbGwgZm9yIGVhY2ggc3Vic2NyaXB0aW9uLlxuICAgKiBAcGFyYW0ge09iamVjdH0gY29udGV4dCAtIHRoZSB2YWx1ZSBvciA8Y29kZT50aGlzPC9jb2RlPiBpbnNpZGUgdGhlIGNhbGxiYWNrLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBwcm9taXNlIHJlc29sdmVkL3JlamVjdGVkIG9uIG9wZXJhdGlvbiBjb21wbGV0aW9uLlxuICAgKi9cbiAgbWFwU3Vic2NyaXB0aW9ucyh0b3BpY05hbWUsIGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgaWYgKCF0aGlzLmlzUmVhZHkoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZGlzYWJsZWQgP1xuICAgICAgICBQcm9taXNlLnJlc29sdmUoW10pIDpcbiAgICAgICAgUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwibm90IGluaXRpYWxpemVkXCIpKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IHRyeCA9IHRoaXMuZGIudHJhbnNhY3Rpb24oWydzdWJzY3JpcHRpb24nXSk7XG4gICAgICB0cngub25lcnJvciA9IChldmVudCkgPT4ge1xuICAgICAgICB0aGlzLiNsb2dnZXIoJ1BDYWNoZScsICdtYXBTdWJzY3JpcHRpb25zJywgZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgICAgcmVqZWN0KGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICB9O1xuICAgICAgdHJ4Lm9iamVjdFN0b3JlKCdzdWJzY3JpcHRpb24nKS5nZXRBbGwoSURCS2V5UmFuZ2UuYm91bmQoW3RvcGljTmFtZSwgJy0nXSwgW3RvcGljTmFtZSwgJ34nXSkpLm9uc3VjY2VzcyA9IChldmVudCkgPT4ge1xuICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICBldmVudC50YXJnZXQucmVzdWx0LmZvckVhY2goKHRvcGljKSA9PiB7XG4gICAgICAgICAgICBjYWxsYmFjay5jYWxsKGNvbnRleHQsIHRvcGljKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXNvbHZlKGV2ZW50LnRhcmdldC5yZXN1bHQpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIE1lc3NhZ2VzLlxuXG4gIC8qKlxuICAgKiBTYXZlIG1lc3NhZ2UgdG8gcGVyc2lzdGVudCBjYWNoZS5cbiAgICogQG1lbWJlck9mIERCXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpY05hbWUgLSBuYW1lIG9mIHRoZSB0b3BpYyB3aGljaCBvd25zIHRoZSBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gbXNnIC0gbWVzc2FnZSB0byBzYXZlLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBwcm9taXNlIHJlc29sdmVkL3JlamVjdGVkIG9uIG9wZXJhdGlvbiBjb21wbGV0aW9uLlxuICAgKi9cbiAgYWRkTWVzc2FnZShtc2cpIHtcbiAgICBpZiAoIXRoaXMuaXNSZWFkeSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5kaXNhYmxlZCA/XG4gICAgICAgIFByb21pc2UucmVzb2x2ZSgpIDpcbiAgICAgICAgUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwibm90IGluaXRpYWxpemVkXCIpKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IHRyeCA9IHRoaXMuZGIudHJhbnNhY3Rpb24oWydtZXNzYWdlJ10sICdyZWFkd3JpdGUnKTtcbiAgICAgIHRyeC5vbnN1Y2Nlc3MgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgcmVzb2x2ZShldmVudC50YXJnZXQucmVzdWx0KTtcbiAgICAgIH07XG4gICAgICB0cngub25lcnJvciA9IChldmVudCkgPT4ge1xuICAgICAgICB0aGlzLiNsb2dnZXIoJ1BDYWNoZScsICdhZGRNZXNzYWdlJywgZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgICAgcmVqZWN0KGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICB9O1xuICAgICAgdHJ4Lm9iamVjdFN0b3JlKCdtZXNzYWdlJykuYWRkKERCLiNzZXJpYWxpemVNZXNzYWdlKG51bGwsIG1zZykpO1xuICAgICAgdHJ4LmNvbW1pdCgpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSBkZWxpdmVyeSBzdGF0dXMgb2YgYSBtZXNzYWdlIHN0b3JlZCBpbiBwZXJzaXN0ZW50IGNhY2hlLlxuICAgKiBAbWVtYmVyT2YgREJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljTmFtZSAtIG5hbWUgb2YgdGhlIHRvcGljIHdoaWNoIG93bnMgdGhlIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzZXEgLSBJRCBvZiB0aGUgbWVzc2FnZSB0byB1cGRhdGVcbiAgICogQHBhcmFtIHtudW1iZXJ9IHN0YXR1cyAtIG5ldyBkZWxpdmVyeSBzdGF0dXMgb2YgdGhlIG1lc3NhZ2UuXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IHByb21pc2UgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gb3BlcmF0aW9uIGNvbXBsZXRpb24uXG4gICAqL1xuICB1cGRNZXNzYWdlU3RhdHVzKHRvcGljTmFtZSwgc2VxLCBzdGF0dXMpIHtcbiAgICBpZiAoIXRoaXMuaXNSZWFkeSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5kaXNhYmxlZCA/XG4gICAgICAgIFByb21pc2UucmVzb2x2ZSgpIDpcbiAgICAgICAgUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwibm90IGluaXRpYWxpemVkXCIpKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IHRyeCA9IHRoaXMuZGIudHJhbnNhY3Rpb24oWydtZXNzYWdlJ10sICdyZWFkd3JpdGUnKTtcbiAgICAgIHRyeC5vbnN1Y2Nlc3MgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgcmVzb2x2ZShldmVudC50YXJnZXQucmVzdWx0KTtcbiAgICAgIH07XG4gICAgICB0cngub25lcnJvciA9IChldmVudCkgPT4ge1xuICAgICAgICB0aGlzLiNsb2dnZXIoJ1BDYWNoZScsICd1cGRNZXNzYWdlU3RhdHVzJywgZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgICAgcmVqZWN0KGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICB9O1xuICAgICAgY29uc3QgcmVxID0gdHJ4Lm9iamVjdFN0b3JlKCdtZXNzYWdlJykuZ2V0KElEQktleVJhbmdlLm9ubHkoW3RvcGljTmFtZSwgc2VxXSkpO1xuICAgICAgcmVxLm9uc3VjY2VzcyA9IChldmVudCkgPT4ge1xuICAgICAgICBjb25zdCBzcmMgPSByZXEucmVzdWx0IHx8IGV2ZW50LnRhcmdldC5yZXN1bHQ7XG4gICAgICAgIGlmICghc3JjIHx8IHNyYy5fc3RhdHVzID09IHN0YXR1cykge1xuICAgICAgICAgIHRyeC5jb21taXQoKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdHJ4Lm9iamVjdFN0b3JlKCdtZXNzYWdlJykucHV0KERCLiNzZXJpYWxpemVNZXNzYWdlKHNyYywge1xuICAgICAgICAgIHRvcGljOiB0b3BpY05hbWUsXG4gICAgICAgICAgc2VxOiBzZXEsXG4gICAgICAgICAgX3N0YXR1czogc3RhdHVzXG4gICAgICAgIH0pKTtcbiAgICAgICAgdHJ4LmNvbW1pdCgpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgb25lIG9yIG1vcmUgbWVzc2FnZXMgZnJvbSBwZXJzaXN0ZW50IGNhY2hlLlxuICAgKiBAbWVtYmVyT2YgREJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljTmFtZSAtIG5hbWUgb2YgdGhlIHRvcGljIHdoaWNoIG93bnMgdGhlIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBmcm9tIC0gaWQgb2YgdGhlIG1lc3NhZ2UgdG8gcmVtb3ZlIG9yIGxvd2VyIGJvdW5kYXJ5IHdoZW4gcmVtb3ZpbmcgcmFuZ2UgKGluY2x1c2l2ZSkuXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gdG8gLSB1cHBlciBib3VuZGFyeSAoZXhjbHVzaXZlKSB3aGVuIHJlbW92aW5nIGEgcmFuZ2Ugb2YgbWVzc2FnZXMuXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IHByb21pc2UgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gb3BlcmF0aW9uIGNvbXBsZXRpb24uXG4gICAqL1xuICByZW1NZXNzYWdlcyh0b3BpY05hbWUsIGZyb20sIHRvKSB7XG4gICAgaWYgKCF0aGlzLmlzUmVhZHkoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZGlzYWJsZWQgP1xuICAgICAgICBQcm9taXNlLnJlc29sdmUoKSA6XG4gICAgICAgIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIm5vdCBpbml0aWFsaXplZFwiKSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBpZiAoIWZyb20gJiYgIXRvKSB7XG4gICAgICAgIGZyb20gPSAwO1xuICAgICAgICB0byA9IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSO1xuICAgICAgfVxuICAgICAgY29uc3QgcmFuZ2UgPSB0byA+IDAgPyBJREJLZXlSYW5nZS5ib3VuZChbdG9waWNOYW1lLCBmcm9tXSwgW3RvcGljTmFtZSwgdG9dLCBmYWxzZSwgdHJ1ZSkgOlxuICAgICAgICBJREJLZXlSYW5nZS5vbmx5KFt0b3BpY05hbWUsIGZyb21dKTtcbiAgICAgIGNvbnN0IHRyeCA9IHRoaXMuZGIudHJhbnNhY3Rpb24oWydtZXNzYWdlJ10sICdyZWFkd3JpdGUnKTtcbiAgICAgIHRyeC5vbnN1Y2Nlc3MgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgcmVzb2x2ZShldmVudC50YXJnZXQucmVzdWx0KTtcbiAgICAgIH07XG4gICAgICB0cngub25lcnJvciA9IChldmVudCkgPT4ge1xuICAgICAgICB0aGlzLiNsb2dnZXIoJ1BDYWNoZScsICdyZW1NZXNzYWdlcycsIGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICAgIHJlamVjdChldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgfTtcbiAgICAgIHRyeC5vYmplY3RTdG9yZSgnbWVzc2FnZScpLmRlbGV0ZShyYW5nZSk7XG4gICAgICB0cnguY29tbWl0KCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmUgbWVzc2FnZXMgZnJvbSBwZXJzaXN0ZW50IHN0b3JlLlxuICAgKiBAbWVtYmVyT2YgREJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljTmFtZSAtIG5hbWUgb2YgdGhlIHRvcGljIHRvIHJldHJpZXZlIG1lc3NhZ2VzIGZyb20uXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIHRvIGNhbGwgZm9yIGVhY2ggcmV0cmlldmVkIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBxdWVyeSAtIHBhcmFtZXRlcnMgb2YgdGhlIG1lc3NhZ2UgcmFuZ2UgdG8gcmV0cmlldmUuXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gcXVlcnkuc2luY2UgLSB0aGUgbGVhc3QgbWVzc2FnZSBJRCB0byByZXRyaWV2ZSAoaW5jbHVzaXZlKS5cbiAgICogQHBhcmFtIHtudW1iZXI9fSBxdWVyeS5iZWZvcmUgLSB0aGUgZ3JlYXRlc3QgbWVzc2FnZSBJRCB0byByZXRyaWV2ZSAoZXhjbHVzaXZlKS5cbiAgICogQHBhcmFtIHtudW1iZXI9fSBxdWVyeS5saW1pdCAtIHRoZSBtYXhpbXVtIG51bWJlciBvZiBtZXNzYWdlcyB0byByZXRyaWV2ZS5cbiAgICogQHJldHVybiB7UHJvbWlzZX0gcHJvbWlzZSByZXNvbHZlZC9yZWplY3RlZCBvbiBvcGVyYXRpb24gY29tcGxldGlvbi5cbiAgICovXG4gIHJlYWRNZXNzYWdlcyh0b3BpY05hbWUsIHF1ZXJ5LCBjYWxsYmFjaywgY29udGV4dCkge1xuICAgIGlmICghdGhpcy5pc1JlYWR5KCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmRpc2FibGVkID9cbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKFtdKSA6XG4gICAgICAgIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIm5vdCBpbml0aWFsaXplZFwiKSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBxdWVyeSA9IHF1ZXJ5IHx8IHt9O1xuICAgICAgY29uc3Qgc2luY2UgPSBxdWVyeS5zaW5jZSA+IDAgPyBxdWVyeS5zaW5jZSA6IDA7XG4gICAgICBjb25zdCBiZWZvcmUgPSBxdWVyeS5iZWZvcmUgPiAwID8gcXVlcnkuYmVmb3JlIDogTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XG4gICAgICBjb25zdCBsaW1pdCA9IHF1ZXJ5LmxpbWl0IHwgMDtcblxuICAgICAgY29uc3QgcmVzdWx0ID0gW107XG4gICAgICBjb25zdCByYW5nZSA9IElEQktleVJhbmdlLmJvdW5kKFt0b3BpY05hbWUsIHNpbmNlXSwgW3RvcGljTmFtZSwgYmVmb3JlXSwgZmFsc2UsIHRydWUpO1xuICAgICAgY29uc3QgdHJ4ID0gdGhpcy5kYi50cmFuc2FjdGlvbihbJ21lc3NhZ2UnXSk7XG4gICAgICB0cngub25lcnJvciA9IChldmVudCkgPT4ge1xuICAgICAgICB0aGlzLiNsb2dnZXIoJ1BDYWNoZScsICdyZWFkTWVzc2FnZXMnLCBldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgICByZWplY3QoZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgIH07XG4gICAgICAvLyBJdGVyYXRlIGluIGRlc2NlbmRpbmcgb3JkZXIuXG4gICAgICB0cngub2JqZWN0U3RvcmUoJ21lc3NhZ2UnKS5vcGVuQ3Vyc29yKHJhbmdlLCAncHJldicpLm9uc3VjY2VzcyA9IChldmVudCkgPT4ge1xuICAgICAgICBjb25zdCBjdXJzb3IgPSBldmVudC50YXJnZXQucmVzdWx0O1xuICAgICAgICBpZiAoY3Vyc29yKSB7XG4gICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBjYWxsYmFjay5jYWxsKGNvbnRleHQsIGN1cnNvci52YWx1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJlc3VsdC5wdXNoKGN1cnNvci52YWx1ZSk7XG4gICAgICAgICAgaWYgKGxpbWl0IDw9IDAgfHwgcmVzdWx0Lmxlbmd0aCA8IGxpbWl0KSB7XG4gICAgICAgICAgICBjdXJzb3IuY29udGludWUoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICAvLyBQcml2YXRlIG1ldGhvZHMuXG5cbiAgLy8gU2VyaWFsaXphYmxlIHRvcGljIGZpZWxkcy5cbiAgc3RhdGljICN0b3BpY19maWVsZHMgPSBbJ2NyZWF0ZWQnLCAndXBkYXRlZCcsICdkZWxldGVkJywgJ3JlYWQnLCAncmVjdicsICdzZXEnLCAnY2xlYXInLCAnZGVmYWNzJyxcbiAgICAnY3JlZHMnLCAncHVibGljJywgJ3RydXN0ZWQnLCAncHJpdmF0ZScsICd0b3VjaGVkJywgJ19kZWxldGVkJ1xuICBdO1xuXG4gIC8vIENvcHkgZGF0YSBmcm9tIHNyYyB0byBUb3BpYyBvYmplY3QuXG4gIHN0YXRpYyAjZGVzZXJpYWxpemVUb3BpYyh0b3BpYywgc3JjKSB7XG4gICAgREIuI3RvcGljX2ZpZWxkcy5mb3JFYWNoKChmKSA9PiB7XG4gICAgICBpZiAoc3JjLmhhc093blByb3BlcnR5KGYpKSB7XG4gICAgICAgIHRvcGljW2ZdID0gc3JjW2ZdO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChBcnJheS5pc0FycmF5KHNyYy50YWdzKSkge1xuICAgICAgdG9waWMuX3RhZ3MgPSBzcmMudGFncztcbiAgICB9XG4gICAgaWYgKHNyYy5hY3MpIHtcbiAgICAgIHRvcGljLnNldEFjY2Vzc01vZGUoc3JjLmFjcyk7XG4gICAgfVxuICAgIHRvcGljLnNlcSB8PSAwO1xuICAgIHRvcGljLnJlYWQgfD0gMDtcbiAgICB0b3BpYy51bnJlYWQgPSBNYXRoLm1heCgwLCB0b3BpYy5zZXEgLSB0b3BpYy5yZWFkKTtcbiAgfVxuXG4gIC8vIENvcHkgdmFsdWVzIGZyb20gJ3NyYycgdG8gJ2RzdCcuIEFsbG9jYXRlIGRzdCBpZiBpdCdzIG51bGwgb3IgdW5kZWZpbmVkLlxuICBzdGF0aWMgI3NlcmlhbGl6ZVRvcGljKGRzdCwgc3JjKSB7XG4gICAgY29uc3QgcmVzID0gZHN0IHx8IHtcbiAgICAgIG5hbWU6IHNyYy5uYW1lXG4gICAgfTtcbiAgICBEQi4jdG9waWNfZmllbGRzLmZvckVhY2goKGYpID0+IHtcbiAgICAgIGlmIChzcmMuaGFzT3duUHJvcGVydHkoZikpIHtcbiAgICAgICAgcmVzW2ZdID0gc3JjW2ZdO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChBcnJheS5pc0FycmF5KHNyYy5fdGFncykpIHtcbiAgICAgIHJlcy50YWdzID0gc3JjLl90YWdzO1xuICAgIH1cbiAgICBpZiAoc3JjLmFjcykge1xuICAgICAgcmVzLmFjcyA9IHNyYy5nZXRBY2Nlc3NNb2RlKCkuanNvbkhlbHBlcigpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzO1xuICB9XG5cbiAgc3RhdGljICNzZXJpYWxpemVTdWJzY3JpcHRpb24oZHN0LCB0b3BpY05hbWUsIHVpZCwgc3ViKSB7XG4gICAgY29uc3QgZmllbGRzID0gWyd1cGRhdGVkJywgJ21vZGUnLCAncmVhZCcsICdyZWN2JywgJ2NsZWFyJywgJ2xhc3RTZWVuJywgJ3VzZXJBZ2VudCddO1xuICAgIGNvbnN0IHJlcyA9IGRzdCB8fCB7XG4gICAgICB0b3BpYzogdG9waWNOYW1lLFxuICAgICAgdWlkOiB1aWRcbiAgICB9O1xuXG4gICAgZmllbGRzLmZvckVhY2goKGYpID0+IHtcbiAgICAgIGlmIChzdWIuaGFzT3duUHJvcGVydHkoZikpIHtcbiAgICAgICAgcmVzW2ZdID0gc3ViW2ZdO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlcztcbiAgfVxuXG4gIHN0YXRpYyAjc2VyaWFsaXplTWVzc2FnZShkc3QsIG1zZykge1xuICAgIC8vIFNlcmlhbGl6YWJsZSBmaWVsZHMuXG4gICAgY29uc3QgZmllbGRzID0gWyd0b3BpYycsICdzZXEnLCAndHMnLCAnX3N0YXR1cycsICdmcm9tJywgJ2hlYWQnLCAnY29udGVudCddO1xuICAgIGNvbnN0IHJlcyA9IGRzdCB8fCB7fTtcbiAgICBmaWVsZHMuZm9yRWFjaCgoZikgPT4ge1xuICAgICAgaWYgKG1zZy5oYXNPd25Qcm9wZXJ0eShmKSkge1xuICAgICAgICByZXNbZl0gPSBtc2dbZl07XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlcztcbiAgfVxuXG4gIC8qKlxuICAgKiBUbyB1c2UgREIgaW4gYSBub24gYnJvd3NlciBjb250ZXh0LCBzdXBwbHkgaW5kZXhlZERCIHByb3ZpZGVyLlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJvZiBEQlxuICAgKiBAcGFyYW0gaWRiUHJvdmlkZXIgaW5kZXhlZERCIHByb3ZpZGVyLCBlLmcuIGZvciBub2RlIDxjb2RlPnJlcXVpcmUoJ2Zha2UtaW5kZXhlZGRiJyk8L2NvZGU+LlxuICAgKi9cbiAgc3RhdGljIHNldERhdGFiYXNlUHJvdmlkZXIoaWRiUHJvdmlkZXIpIHtcbiAgICBJREJQcm92aWRlciA9IGlkYlByb3ZpZGVyO1xuICB9XG59XG4iLCIvKipcbiAqIEBjb3B5cmlnaHQgMjAxNS0yMDIyIFRpbm9kZSBMTEMuXG4gKiBAc3VtbWFyeSBNaW5pbWFsbHkgcmljaCB0ZXh0IHJlcHJlc2VudGF0aW9uIGFuZCBmb3JtYXR0aW5nIGZvciBUaW5vZGUuXG4gKiBAbGljZW5zZSBBcGFjaGUgMi4wXG4gKlxuICogQGZpbGUgQmFzaWMgcGFyc2VyIGFuZCBmb3JtYXR0ZXIgZm9yIHZlcnkgc2ltcGxlIHRleHQgbWFya3VwLiBNb3N0bHkgdGFyZ2V0ZWQgYXRcbiAqIG1vYmlsZSB1c2UgY2FzZXMgc2ltaWxhciB0byBUZWxlZ3JhbSwgV2hhdHNBcHAsIGFuZCBGQiBNZXNzZW5nZXIuXG4gKlxuICogPHA+U3VwcG9ydHMgY29udmVyc2lvbiBvZiB1c2VyIGtleWJvYXJkIGlucHV0IHRvIGZvcm1hdHRlZCB0ZXh0OjwvcD5cbiAqIDx1bD5cbiAqICAgPGxpPiphYmMqICZyYXJyOyA8Yj5hYmM8L2I+PC9saT5cbiAqICAgPGxpPl9hYmNfICZyYXJyOyA8aT5hYmM8L2k+PC9saT5cbiAqICAgPGxpPn5hYmN+ICZyYXJyOyA8ZGVsPmFiYzwvZGVsPjwvbGk+XG4gKiAgIDxsaT5gYWJjYCAmcmFycjsgPHR0PmFiYzwvdHQ+PC9saT5cbiAqIDwvdWw+XG4gKiBBbHNvIHN1cHBvcnRzIGZvcm1zIGFuZCBidXR0b25zLlxuICpcbiAqIE5lc3RlZCBmb3JtYXR0aW5nIGlzIHN1cHBvcnRlZCwgZS5nLiAqYWJjIF9kZWZfKiAtPiA8Yj5hYmMgPGk+ZGVmPC9pPjwvYj5cbiAqIFVSTHMsIEBtZW50aW9ucywgYW5kICNoYXNodGFncyBhcmUgZXh0cmFjdGVkIGFuZCBjb252ZXJ0ZWQgaW50byBsaW5rcy5cbiAqIEZvcm1zIGFuZCBidXR0b25zIGNhbiBiZSBhZGRlZCBwcm9jZWR1cmFsbHkuXG4gKiBKU09OIGRhdGEgcmVwcmVzZW50YXRpb24gaXMgaW5zcGlyZWQgYnkgRHJhZnQuanMgcmF3IGZvcm1hdHRpbmcuXG4gKlxuICpcbiAqIEBleGFtcGxlXG4gKiBUZXh0OlxuICogPHByZT5cbiAqICAgICB0aGlzIGlzICpib2xkKiwgYGNvZGVgIGFuZCBfaXRhbGljXywgfnN0cmlrZX5cbiAqICAgICBjb21iaW5lZCAqYm9sZCBhbmQgX2l0YWxpY18qXG4gKiAgICAgYW4gdXJsOiBodHRwczovL3d3dy5leGFtcGxlLmNvbS9hYmMjZnJhZ21lbnQgYW5kIGFub3RoZXIgX3d3dy50aW5vZGUuY29fXG4gKiAgICAgdGhpcyBpcyBhIEBtZW50aW9uIGFuZCBhICNoYXNodGFnIGluIGEgc3RyaW5nXG4gKiAgICAgc2Vjb25kICNoYXNodGFnXG4gKiA8L3ByZT5cbiAqXG4gKiAgU2FtcGxlIEpTT04gcmVwcmVzZW50YXRpb24gb2YgdGhlIHRleHQgYWJvdmU6XG4gKiAge1xuICogICAgIFwidHh0XCI6IFwidGhpcyBpcyBib2xkLCBjb2RlIGFuZCBpdGFsaWMsIHN0cmlrZSBjb21iaW5lZCBib2xkIGFuZCBpdGFsaWMgYW4gdXJsOiBodHRwczovL3d3dy5leGFtcGxlLmNvbS9hYmMjZnJhZ21lbnQgXCIgK1xuICogICAgICAgICAgICAgXCJhbmQgYW5vdGhlciB3d3cudGlub2RlLmNvIHRoaXMgaXMgYSBAbWVudGlvbiBhbmQgYSAjaGFzaHRhZyBpbiBhIHN0cmluZyBzZWNvbmQgI2hhc2h0YWdcIixcbiAqICAgICBcImZtdFwiOiBbXG4gKiAgICAgICAgIHsgXCJhdFwiOjgsIFwibGVuXCI6NCxcInRwXCI6XCJTVFwiIH0seyBcImF0XCI6MTQsIFwibGVuXCI6NCwgXCJ0cFwiOlwiQ09cIiB9LHsgXCJhdFwiOjIzLCBcImxlblwiOjYsIFwidHBcIjpcIkVNXCJ9LFxuICogICAgICAgICB7IFwiYXRcIjozMSwgXCJsZW5cIjo2LCBcInRwXCI6XCJETFwiIH0seyBcInRwXCI6XCJCUlwiLCBcImxlblwiOjEsIFwiYXRcIjozNyB9LHsgXCJhdFwiOjU2LCBcImxlblwiOjYsIFwidHBcIjpcIkVNXCIgfSxcbiAqICAgICAgICAgeyBcImF0XCI6NDcsIFwibGVuXCI6MTUsIFwidHBcIjpcIlNUXCIgfSx7IFwidHBcIjpcIkJSXCIsIFwibGVuXCI6MSwgXCJhdFwiOjYyIH0seyBcImF0XCI6MTIwLCBcImxlblwiOjEzLCBcInRwXCI6XCJFTVwiIH0sXG4gKiAgICAgICAgIHsgXCJhdFwiOjcxLCBcImxlblwiOjM2LCBcImtleVwiOjAgfSx7IFwiYXRcIjoxMjAsIFwibGVuXCI6MTMsIFwia2V5XCI6MSB9LHsgXCJ0cFwiOlwiQlJcIiwgXCJsZW5cIjoxLCBcImF0XCI6MTMzIH0sXG4gKiAgICAgICAgIHsgXCJhdFwiOjE0NCwgXCJsZW5cIjo4LCBcImtleVwiOjIgfSx7IFwiYXRcIjoxNTksIFwibGVuXCI6OCwgXCJrZXlcIjozIH0seyBcInRwXCI6XCJCUlwiLCBcImxlblwiOjEsIFwiYXRcIjoxNzkgfSxcbiAqICAgICAgICAgeyBcImF0XCI6MTg3LCBcImxlblwiOjgsIFwia2V5XCI6MyB9LHsgXCJ0cFwiOlwiQlJcIiwgXCJsZW5cIjoxLCBcImF0XCI6MTk1IH1cbiAqICAgICBdLFxuICogICAgIFwiZW50XCI6IFtcbiAqICAgICAgICAgeyBcInRwXCI6XCJMTlwiLCBcImRhdGFcIjp7IFwidXJsXCI6XCJodHRwczovL3d3dy5leGFtcGxlLmNvbS9hYmMjZnJhZ21lbnRcIiB9IH0sXG4gKiAgICAgICAgIHsgXCJ0cFwiOlwiTE5cIiwgXCJkYXRhXCI6eyBcInVybFwiOlwiaHR0cDovL3d3dy50aW5vZGUuY29cIiB9IH0sXG4gKiAgICAgICAgIHsgXCJ0cFwiOlwiTU5cIiwgXCJkYXRhXCI6eyBcInZhbFwiOlwibWVudGlvblwiIH0gfSxcbiAqICAgICAgICAgeyBcInRwXCI6XCJIVFwiLCBcImRhdGFcIjp7IFwidmFsXCI6XCJoYXNodGFnXCIgfSB9XG4gKiAgICAgXVxuICogIH1cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8vIE5PVEUgVE8gREVWRUxPUEVSUzpcbi8vIExvY2FsaXphYmxlIHN0cmluZ3Mgc2hvdWxkIGJlIGRvdWJsZSBxdW90ZWQgXCLRgdGC0YDQvtC60LAg0L3QsCDQtNGA0YPQs9C+0Lwg0Y/Qt9GL0LrQtVwiLFxuLy8gbm9uLWxvY2FsaXphYmxlIHN0cmluZ3Mgc2hvdWxkIGJlIHNpbmdsZSBxdW90ZWQgJ25vbi1sb2NhbGl6ZWQnLlxuXG5jb25zdCBNQVhfRk9STV9FTEVNRU5UUyA9IDg7XG5jb25zdCBNQVhfUFJFVklFV19BVFRBQ0hNRU5UUyA9IDM7XG5jb25zdCBNQVhfUFJFVklFV19EQVRBX1NJWkUgPSA2NDtcbmNvbnN0IEpTT05fTUlNRV9UWVBFID0gJ2FwcGxpY2F0aW9uL2pzb24nO1xuY29uc3QgRFJBRlRZX01JTUVfVFlQRSA9ICd0ZXh0L3gtZHJhZnR5JztcbmNvbnN0IEFMTE9XRURfRU5UX0ZJRUxEUyA9IFsnYWN0JywgJ2hlaWdodCcsICdkdXJhdGlvbicsICdtaW1lJywgJ25hbWUnLCAncHJldmlldycsICdyZWYnLCAnc2l6ZScsICd1cmwnLCAndmFsJywgJ3dpZHRoJ107XG5cbi8vIFJlZ3VsYXIgZXhwcmVzc2lvbnMgZm9yIHBhcnNpbmcgaW5saW5lIGZvcm1hdHMuIEphdmFzY3JpcHQgZG9lcyBub3Qgc3VwcG9ydCBsb29rYmVoaW5kLFxuLy8gc28gaXQncyBhIGJpdCBtZXNzeS5cbmNvbnN0IElOTElORV9TVFlMRVMgPSBbXG4gIC8vIFN0cm9uZyA9IGJvbGQsICpib2xkIHRleHQqXG4gIHtcbiAgICBuYW1lOiAnU1QnLFxuICAgIHN0YXJ0OiAvKD86XnxbXFxXX10pKFxcKilbXlxccypdLyxcbiAgICBlbmQ6IC9bXlxccypdKFxcKikoPz0kfFtcXFdfXSkvXG4gIH0sXG4gIC8vIEVtcGhlc2l6ZWQgPSBpdGFsaWMsIF9pdGFsaWMgdGV4dF9cbiAge1xuICAgIG5hbWU6ICdFTScsXG4gICAgc3RhcnQ6IC8oPzpefFxcVykoXylbXlxcc19dLyxcbiAgICBlbmQ6IC9bXlxcc19dKF8pKD89JHxcXFcpL1xuICB9LFxuICAvLyBEZWxldGVkLCB+c3RyaWtlIHRoaXMgdGhvdWdoflxuICB7XG4gICAgbmFtZTogJ0RMJyxcbiAgICBzdGFydDogLyg/Ol58W1xcV19dKSh+KVteXFxzfl0vLFxuICAgIGVuZDogL1teXFxzfl0ofikoPz0kfFtcXFdfXSkvXG4gIH0sXG4gIC8vIENvZGUgYmxvY2sgYHRoaXMgaXMgbW9ub3NwYWNlYFxuICB7XG4gICAgbmFtZTogJ0NPJyxcbiAgICBzdGFydDogLyg/Ol58XFxXKShgKVteYF0vLFxuICAgIGVuZDogL1teYF0oYCkoPz0kfFxcVykvXG4gIH1cbl07XG5cbi8vIFJlbGF0aXZlIHdlaWdodHMgb2YgZm9ybWF0dGluZyBzcGFucy4gR3JlYXRlciBpbmRleCBpbiBhcnJheSBtZWFucyBncmVhdGVyIHdlaWdodC5cbmNvbnN0IEZNVF9XRUlHSFQgPSBbJ1FRJ107XG5cbi8vIFJlZ0V4cHMgZm9yIGVudGl0eSBleHRyYWN0aW9uIChSRiA9IHJlZmVyZW5jZSlcbmNvbnN0IEVOVElUWV9UWVBFUyA9IFtcbiAgLy8gVVJMc1xuICB7XG4gICAgbmFtZTogJ0xOJyxcbiAgICBkYXRhTmFtZTogJ3VybCcsXG4gICAgcGFjazogZnVuY3Rpb24odmFsKSB7XG4gICAgICAvLyBDaGVjayBpZiB0aGUgcHJvdG9jb2wgaXMgc3BlY2lmaWVkLCBpZiBub3QgdXNlIGh0dHBcbiAgICAgIGlmICghL15bYS16XSs6XFwvXFwvL2kudGVzdCh2YWwpKSB7XG4gICAgICAgIHZhbCA9ICdodHRwOi8vJyArIHZhbDtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHVybDogdmFsXG4gICAgICB9O1xuICAgIH0sXG4gICAgcmU6IC8oPzooPzpodHRwcz98ZnRwKTpcXC9cXC98d3d3XFwufGZ0cFxcLilbLUEtWjAtOSsmQCNcXC8lPX5ffCQ/ITosLl0qW0EtWjAtOSsmQCNcXC8lPX5ffCRdL2lnXG4gIH0sXG4gIC8vIE1lbnRpb25zIEB1c2VyIChtdXN0IGJlIDIgb3IgbW9yZSBjaGFyYWN0ZXJzKVxuICB7XG4gICAgbmFtZTogJ01OJyxcbiAgICBkYXRhTmFtZTogJ3ZhbCcsXG4gICAgcGFjazogZnVuY3Rpb24odmFsKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB2YWw6IHZhbC5zbGljZSgxKVxuICAgICAgfTtcbiAgICB9LFxuICAgIHJlOiAvXFxCQChbXFxwe0x9XFxwe059XVsuX1xccHtMfVxccHtOfV0qW1xccHtMfVxccHtOfV0pL3VnXG4gIH0sXG4gIC8vIEhhc2h0YWdzICNoYXNodGFnLCBsaWtlIG1ldGlvbiAyIG9yIG1vcmUgY2hhcmFjdGVycy5cbiAge1xuICAgIG5hbWU6ICdIVCcsXG4gICAgZGF0YU5hbWU6ICd2YWwnLFxuICAgIHBhY2s6IGZ1bmN0aW9uKHZhbCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdmFsOiB2YWwuc2xpY2UoMSlcbiAgICAgIH07XG4gICAgfSxcbiAgICByZTogL1xcQiMoW1xccHtMfVxccHtOfV1bLl9cXHB7TH1cXHB7Tn1dKltcXHB7TH1cXHB7Tn1dKS91Z1xuICB9XG5dO1xuXG4vLyBIVE1MIHRhZyBuYW1lIHN1Z2dlc3Rpb25zXG5jb25zdCBIVE1MX1RBR1MgPSB7XG4gIEFVOiB7XG4gICAgbmFtZTogJ2F1ZGlvJyxcbiAgICBpc1ZvaWQ6IGZhbHNlXG4gIH0sXG4gIEJOOiB7XG4gICAgbmFtZTogJ2J1dHRvbicsXG4gICAgaXNWb2lkOiBmYWxzZVxuICB9LFxuICBCUjoge1xuICAgIG5hbWU6ICdicicsXG4gICAgaXNWb2lkOiB0cnVlXG4gIH0sXG4gIENPOiB7XG4gICAgbmFtZTogJ3R0JyxcbiAgICBpc1ZvaWQ6IGZhbHNlXG4gIH0sXG4gIERMOiB7XG4gICAgbmFtZTogJ2RlbCcsXG4gICAgaXNWb2lkOiBmYWxzZVxuICB9LFxuICBFTToge1xuICAgIG5hbWU6ICdpJyxcbiAgICBpc1ZvaWQ6IGZhbHNlXG4gIH0sXG4gIEVYOiB7XG4gICAgbmFtZTogJycsXG4gICAgaXNWb2lkOiB0cnVlXG4gIH0sXG4gIEZNOiB7XG4gICAgbmFtZTogJ2RpdicsXG4gICAgaXNWb2lkOiBmYWxzZVxuICB9LFxuICBIRDoge1xuICAgIG5hbWU6ICcnLFxuICAgIGlzVm9pZDogZmFsc2VcbiAgfSxcbiAgSEw6IHtcbiAgICBuYW1lOiAnc3BhbicsXG4gICAgaXNWb2lkOiBmYWxzZVxuICB9LFxuICBIVDoge1xuICAgIG5hbWU6ICdhJyxcbiAgICBpc1ZvaWQ6IGZhbHNlXG4gIH0sXG4gIElNOiB7XG4gICAgbmFtZTogJ2ltZycsXG4gICAgaXNWb2lkOiBmYWxzZVxuICB9LFxuICBMTjoge1xuICAgIG5hbWU6ICdhJyxcbiAgICBpc1ZvaWQ6IGZhbHNlXG4gIH0sXG4gIE1OOiB7XG4gICAgbmFtZTogJ2EnLFxuICAgIGlzVm9pZDogZmFsc2VcbiAgfSxcbiAgUlc6IHtcbiAgICBuYW1lOiAnZGl2JyxcbiAgICBpc1ZvaWQ6IGZhbHNlLFxuICB9LFxuICBRUToge1xuICAgIG5hbWU6ICdkaXYnLFxuICAgIGlzVm9pZDogZmFsc2VcbiAgfSxcbiAgU1Q6IHtcbiAgICBuYW1lOiAnYicsXG4gICAgaXNWb2lkOiBmYWxzZVxuICB9LFxufTtcblxuLy8gQ29udmVydCBiYXNlNjQtZW5jb2RlZCBzdHJpbmcgaW50byBCbG9iLlxuZnVuY3Rpb24gYmFzZTY0dG9PYmplY3RVcmwoYjY0LCBjb250ZW50VHlwZSwgbG9nZ2VyKSB7XG4gIGlmICghYjY0KSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICB0cnkge1xuICAgIGNvbnN0IGJpbiA9IGF0b2IoYjY0KTtcbiAgICBjb25zdCBsZW5ndGggPSBiaW4ubGVuZ3RoO1xuICAgIGNvbnN0IGJ1ZiA9IG5ldyBBcnJheUJ1ZmZlcihsZW5ndGgpO1xuICAgIGNvbnN0IGFyciA9IG5ldyBVaW50OEFycmF5KGJ1Zik7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgYXJyW2ldID0gYmluLmNoYXJDb2RlQXQoaSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFVSTC5jcmVhdGVPYmplY3RVUkwobmV3IEJsb2IoW2J1Zl0sIHtcbiAgICAgIHR5cGU6IGNvbnRlbnRUeXBlXG4gICAgfSkpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBpZiAobG9nZ2VyKSB7XG4gICAgICBsb2dnZXIoXCJEcmFmdHk6IGZhaWxlZCB0byBjb252ZXJ0IG9iamVjdC5cIiwgZXJyLm1lc3NhZ2UpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBudWxsO1xufVxuXG5mdW5jdGlvbiBiYXNlNjR0b0RhdGFVcmwoYjY0LCBjb250ZW50VHlwZSkge1xuICBpZiAoIWI2NCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIGNvbnRlbnRUeXBlID0gY29udGVudFR5cGUgfHwgJ2ltYWdlL2pwZWcnO1xuICByZXR1cm4gJ2RhdGE6JyArIGNvbnRlbnRUeXBlICsgJztiYXNlNjQsJyArIGI2NDtcbn1cblxuLy8gSGVscGVycyBmb3IgY29udmVydGluZyBEcmFmdHkgdG8gSFRNTC5cbmNvbnN0IERFQ09SQVRPUlMgPSB7XG4gIC8vIFZpc2lhbCBzdHlsZXNcbiAgU1Q6IHtcbiAgICBvcGVuOiBfID0+ICc8Yj4nLFxuICAgIGNsb3NlOiBfID0+ICc8L2I+J1xuICB9LFxuICBFTToge1xuICAgIG9wZW46IF8gPT4gJzxpPicsXG4gICAgY2xvc2U6IF8gPT4gJzwvaT4nXG4gIH0sXG4gIERMOiB7XG4gICAgb3BlbjogXyA9PiAnPGRlbD4nLFxuICAgIGNsb3NlOiBfID0+ICc8L2RlbD4nXG4gIH0sXG4gIENPOiB7XG4gICAgb3BlbjogXyA9PiAnPHR0PicsXG4gICAgY2xvc2U6IF8gPT4gJzwvdHQ+J1xuICB9LFxuICAvLyBMaW5lIGJyZWFrXG4gIEJSOiB7XG4gICAgb3BlbjogXyA9PiAnPGJyLz4nLFxuICAgIGNsb3NlOiBfID0+ICcnXG4gIH0sXG4gIC8vIEhpZGRlbiBlbGVtZW50XG4gIEhEOiB7XG4gICAgb3BlbjogXyA9PiAnJyxcbiAgICBjbG9zZTogXyA9PiAnJ1xuICB9LFxuICAvLyBIaWdobGlnaHRlZCBlbGVtZW50LlxuICBITDoge1xuICAgIG9wZW46IF8gPT4gJzxzcGFuIHN0eWxlPVwiY29sb3I6dGVhbFwiPicsXG4gICAgY2xvc2U6IF8gPT4gJzwvc3Bhbj4nXG4gIH0sXG4gIC8vIExpbmsgKFVSTClcbiAgTE46IHtcbiAgICBvcGVuOiAoZGF0YSkgPT4ge1xuICAgICAgcmV0dXJuICc8YSBocmVmPVwiJyArIGRhdGEudXJsICsgJ1wiPic7XG4gICAgfSxcbiAgICBjbG9zZTogXyA9PiAnPC9hPicsXG4gICAgcHJvcHM6IChkYXRhKSA9PiB7XG4gICAgICByZXR1cm4gZGF0YSA/IHtcbiAgICAgICAgaHJlZjogZGF0YS51cmwsXG4gICAgICAgIHRhcmdldDogJ19ibGFuaydcbiAgICAgIH0gOiBudWxsO1xuICAgIH0sXG4gIH0sXG4gIC8vIE1lbnRpb25cbiAgTU46IHtcbiAgICBvcGVuOiAoZGF0YSkgPT4ge1xuICAgICAgcmV0dXJuICc8YSBocmVmPVwiIycgKyBkYXRhLnZhbCArICdcIj4nO1xuICAgIH0sXG4gICAgY2xvc2U6IF8gPT4gJzwvYT4nLFxuICAgIHByb3BzOiAoZGF0YSkgPT4ge1xuICAgICAgcmV0dXJuIGRhdGEgPyB7XG4gICAgICAgIGlkOiBkYXRhLnZhbFxuICAgICAgfSA6IG51bGw7XG4gICAgfSxcbiAgfSxcbiAgLy8gSGFzaHRhZ1xuICBIVDoge1xuICAgIG9wZW46IChkYXRhKSA9PiB7XG4gICAgICByZXR1cm4gJzxhIGhyZWY9XCIjJyArIGRhdGEudmFsICsgJ1wiPic7XG4gICAgfSxcbiAgICBjbG9zZTogXyA9PiAnPC9hPicsXG4gICAgcHJvcHM6IChkYXRhKSA9PiB7XG4gICAgICByZXR1cm4gZGF0YSA/IHtcbiAgICAgICAgaWQ6IGRhdGEudmFsXG4gICAgICB9IDogbnVsbDtcbiAgICB9LFxuICB9LFxuICAvLyBCdXR0b25cbiAgQk46IHtcbiAgICBvcGVuOiBfID0+ICc8YnV0dG9uPicsXG4gICAgY2xvc2U6IF8gPT4gJzwvYnV0dG9uPicsXG4gICAgcHJvcHM6IChkYXRhKSA9PiB7XG4gICAgICByZXR1cm4gZGF0YSA/IHtcbiAgICAgICAgJ2RhdGEtYWN0JzogZGF0YS5hY3QsXG4gICAgICAgICdkYXRhLXZhbCc6IGRhdGEudmFsLFxuICAgICAgICAnZGF0YS1uYW1lJzogZGF0YS5uYW1lLFxuICAgICAgICAnZGF0YS1yZWYnOiBkYXRhLnJlZlxuICAgICAgfSA6IG51bGw7XG4gICAgfSxcbiAgfSxcbiAgLy8gQXVkaW8gcmVjb3JkaW5nXG4gIEFVOiB7XG4gICAgb3BlbjogKGRhdGEpID0+IHtcbiAgICAgIGNvbnN0IHVybCA9IGRhdGEucmVmIHx8IGJhc2U2NHRvT2JqZWN0VXJsKGRhdGEudmFsLCBkYXRhLm1pbWUsIERyYWZ0eS5sb2dnZXIpO1xuICAgICAgcmV0dXJuICc8YXVkaW8gY29udHJvbHMgc3JjPVwiJyArIHVybCArICdcIj4nO1xuICAgIH0sXG4gICAgY2xvc2U6IF8gPT4gJzwvYXVkaW8+JyxcbiAgICBwcm9wczogKGRhdGEpID0+IHtcbiAgICAgIGlmICghZGF0YSkgcmV0dXJuIG51bGw7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAvLyBFbWJlZGRlZCBkYXRhIG9yIGV4dGVybmFsIGxpbmsuXG4gICAgICAgIHNyYzogZGF0YS5yZWYgfHwgYmFzZTY0dG9PYmplY3RVcmwoZGF0YS52YWwsIGRhdGEubWltZSwgRHJhZnR5LmxvZ2dlciksXG4gICAgICAgICdkYXRhLXByZWxvYWQnOiBkYXRhLnJlZiA/ICdtZXRhZGF0YScgOiAnYXV0bycsXG4gICAgICAgICdkYXRhLWR1cmF0aW9uJzogZGF0YS5kdXJhdGlvbixcbiAgICAgICAgJ2RhdGEtbmFtZSc6IGRhdGEubmFtZSxcbiAgICAgICAgJ2RhdGEtc2l6ZSc6IGRhdGEudmFsID8gKChkYXRhLnZhbC5sZW5ndGggKiAwLjc1KSB8IDApIDogKGRhdGEuc2l6ZSB8IDApLFxuICAgICAgICAnZGF0YS1taW1lJzogZGF0YS5taW1lLFxuICAgICAgfTtcbiAgICB9XG4gIH0sXG4gIC8vIEltYWdlXG4gIElNOiB7XG4gICAgb3BlbjogKGRhdGEpID0+IHtcbiAgICAgIC8vIERvbid0IHVzZSBkYXRhLnJlZiBmb3IgcHJldmlldzogaXQncyBhIHNlY3VyaXR5IHJpc2suXG4gICAgICBjb25zdCB0bXBQcmV2aWV3VXJsID0gYmFzZTY0dG9EYXRhVXJsKGRhdGEuX3RlbXBQcmV2aWV3LCBkYXRhLm1pbWUpO1xuICAgICAgY29uc3QgcHJldmlld1VybCA9IGJhc2U2NHRvT2JqZWN0VXJsKGRhdGEudmFsLCBkYXRhLm1pbWUsIERyYWZ0eS5sb2dnZXIpO1xuICAgICAgY29uc3QgZG93bmxvYWRVcmwgPSBkYXRhLnJlZiB8fCBwcmV2aWV3VXJsO1xuICAgICAgcmV0dXJuIChkYXRhLm5hbWUgPyAnPGEgaHJlZj1cIicgKyBkb3dubG9hZFVybCArICdcIiBkb3dubG9hZD1cIicgKyBkYXRhLm5hbWUgKyAnXCI+JyA6ICcnKSArXG4gICAgICAgICc8aW1nIHNyYz1cIicgKyAodG1wUHJldmlld1VybCB8fCBwcmV2aWV3VXJsKSArICdcIicgK1xuICAgICAgICAoZGF0YS53aWR0aCA/ICcgd2lkdGg9XCInICsgZGF0YS53aWR0aCArICdcIicgOiAnJykgK1xuICAgICAgICAoZGF0YS5oZWlnaHQgPyAnIGhlaWdodD1cIicgKyBkYXRhLmhlaWdodCArICdcIicgOiAnJykgKyAnIGJvcmRlcj1cIjBcIiAvPic7XG4gICAgfSxcbiAgICBjbG9zZTogKGRhdGEpID0+IHtcbiAgICAgIHJldHVybiAoZGF0YS5uYW1lID8gJzwvYT4nIDogJycpO1xuICAgIH0sXG4gICAgcHJvcHM6IChkYXRhKSA9PiB7XG4gICAgICBpZiAoIWRhdGEpIHJldHVybiBudWxsO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLy8gVGVtcG9yYXJ5IHByZXZpZXcsIG9yIHBlcm1hbmVudCBwcmV2aWV3LCBvciBleHRlcm5hbCBsaW5rLlxuICAgICAgICBzcmM6IGJhc2U2NHRvRGF0YVVybChkYXRhLl90ZW1wUHJldmlldywgZGF0YS5taW1lKSB8fFxuICAgICAgICAgIGRhdGEucmVmIHx8IGJhc2U2NHRvT2JqZWN0VXJsKGRhdGEudmFsLCBkYXRhLm1pbWUsIERyYWZ0eS5sb2dnZXIpLFxuICAgICAgICB0aXRsZTogZGF0YS5uYW1lLFxuICAgICAgICBhbHQ6IGRhdGEubmFtZSxcbiAgICAgICAgJ2RhdGEtd2lkdGgnOiBkYXRhLndpZHRoLFxuICAgICAgICAnZGF0YS1oZWlnaHQnOiBkYXRhLmhlaWdodCxcbiAgICAgICAgJ2RhdGEtbmFtZSc6IGRhdGEubmFtZSxcbiAgICAgICAgJ2RhdGEtc2l6ZSc6IGRhdGEudmFsID8gKChkYXRhLnZhbC5sZW5ndGggKiAwLjc1KSB8IDApIDogKGRhdGEuc2l6ZSB8IDApLFxuICAgICAgICAnZGF0YS1taW1lJzogZGF0YS5taW1lLFxuICAgICAgfTtcbiAgICB9LFxuICB9LFxuICAvLyBGb3JtIC0gc3RydWN0dXJlZCBsYXlvdXQgb2YgZWxlbWVudHMuXG4gIEZNOiB7XG4gICAgb3BlbjogXyA9PiAnPGRpdj4nLFxuICAgIGNsb3NlOiBfID0+ICc8L2Rpdj4nXG4gIH0sXG4gIC8vIFJvdzogbG9naWMgZ3JvdXBpbmcgb2YgZWxlbWVudHNcbiAgUlc6IHtcbiAgICBvcGVuOiBfID0+ICc8ZGl2PicsXG4gICAgY2xvc2U6IF8gPT4gJzwvZGl2PidcbiAgfSxcbiAgLy8gUXVvdGVkIGJsb2NrLlxuICBRUToge1xuICAgIG9wZW46IF8gPT4gJzxkaXY+JyxcbiAgICBjbG9zZTogXyA9PiAnPC9kaXY+JyxcbiAgICBwcm9wczogKGRhdGEpID0+IHtcbiAgICAgIHJldHVybiBkYXRhID8ge30gOiBudWxsO1xuICAgIH0sXG4gIH1cbn07XG5cbi8qKlxuICogVGhlIG1haW4gb2JqZWN0IHdoaWNoIHBlcmZvcm1zIGFsbCB0aGUgZm9ybWF0dGluZyBhY3Rpb25zLlxuICogQGNsYXNzIERyYWZ0eVxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmNvbnN0IERyYWZ0eSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnR4dCA9ICcnO1xuICB0aGlzLmZtdCA9IFtdO1xuICB0aGlzLmVudCA9IFtdO1xufVxuXG4vKipcbiAqIEluaXRpYWxpemUgRHJhZnR5IGRvY3VtZW50IHRvIGEgcGxhaW4gdGV4dCBzdHJpbmcuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHBsYWluVGV4dCAtIHN0cmluZyB0byB1c2UgYXMgRHJhZnR5IGNvbnRlbnQuXG4gKlxuICogQHJldHVybnMgbmV3IERyYWZ0eSBkb2N1bWVudCBvciBudWxsIGlzIHBsYWluVGV4dCBpcyBub3QgYSBzdHJpbmcgb3IgdW5kZWZpbmVkLlxuICovXG5EcmFmdHkuaW5pdCA9IGZ1bmN0aW9uKHBsYWluVGV4dCkge1xuICBpZiAodHlwZW9mIHBsYWluVGV4dCA9PSAndW5kZWZpbmVkJykge1xuICAgIHBsYWluVGV4dCA9ICcnO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBwbGFpblRleHQgIT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgdHh0OiBwbGFpblRleHRcbiAgfTtcbn1cblxuLyoqXG4gKiBQYXJzZSBwbGFpbiB0ZXh0IGludG8gRHJhZnR5IGRvY3VtZW50LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBjb250ZW50IC0gcGxhaW4tdGV4dCBjb250ZW50IHRvIHBhcnNlLlxuICogQHJldHVybiB7RHJhZnR5fSBwYXJzZWQgZG9jdW1lbnQgb3IgbnVsbCBpZiB0aGUgc291cmNlIGlzIG5vdCBwbGFpbiB0ZXh0LlxuICovXG5EcmFmdHkucGFyc2UgPSBmdW5jdGlvbihjb250ZW50KSB7XG4gIC8vIE1ha2Ugc3VyZSB3ZSBhcmUgcGFyc2luZyBzdHJpbmdzIG9ubHkuXG4gIGlmICh0eXBlb2YgY29udGVudCAhPSAnc3RyaW5nJykge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLy8gU3BsaXQgdGV4dCBpbnRvIGxpbmVzLiBJdCBtYWtlcyBmdXJ0aGVyIHByb2Nlc3NpbmcgZWFzaWVyLlxuICBjb25zdCBsaW5lcyA9IGNvbnRlbnQuc3BsaXQoL1xccj9cXG4vKTtcblxuICAvLyBIb2xkcyBlbnRpdGllcyByZWZlcmVuY2VkIGZyb20gdGV4dFxuICBjb25zdCBlbnRpdHlNYXAgPSBbXTtcbiAgY29uc3QgZW50aXR5SW5kZXggPSB7fTtcblxuICAvLyBQcm9jZXNzaW5nIGxpbmVzIG9uZSBieSBvbmUsIGhvbGQgaW50ZXJtZWRpYXRlIHJlc3VsdCBpbiBibHguXG4gIGNvbnN0IGJseCA9IFtdO1xuICBsaW5lcy5mb3JFYWNoKChsaW5lKSA9PiB7XG4gICAgbGV0IHNwYW5zID0gW107XG4gICAgbGV0IGVudGl0aWVzO1xuXG4gICAgLy8gRmluZCBmb3JtYXR0ZWQgc3BhbnMgaW4gdGhlIHN0cmluZy5cbiAgICAvLyBUcnkgdG8gbWF0Y2ggZWFjaCBzdHlsZS5cbiAgICBJTkxJTkVfU1RZTEVTLmZvckVhY2goKHRhZykgPT4ge1xuICAgICAgLy8gRWFjaCBzdHlsZSBjb3VsZCBiZSBtYXRjaGVkIG11bHRpcGxlIHRpbWVzLlxuICAgICAgc3BhbnMgPSBzcGFucy5jb25jYXQoc3Bhbm5pZnkobGluZSwgdGFnLnN0YXJ0LCB0YWcuZW5kLCB0YWcubmFtZSkpO1xuICAgIH0pO1xuXG4gICAgbGV0IGJsb2NrO1xuICAgIGlmIChzcGFucy5sZW5ndGggPT0gMCkge1xuICAgICAgYmxvY2sgPSB7XG4gICAgICAgIHR4dDogbGluZVxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gU29ydCBzcGFucyBieSBzdHlsZSBvY2N1cmVuY2UgZWFybHkgLT4gbGF0ZSwgdGhlbiBieSBsZW5ndGg6IGZpcnN0IGxvbmcgdGhlbiBzaG9ydC5cbiAgICAgIHNwYW5zLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgY29uc3QgZGlmZiA9IGEuYXQgLSBiLmF0O1xuICAgICAgICByZXR1cm4gZGlmZiAhPSAwID8gZGlmZiA6IGIuZW5kIC0gYS5lbmQ7XG4gICAgICB9KTtcblxuICAgICAgLy8gQ29udmVydCBhbiBhcnJheSBvZiBwb3NzaWJseSBvdmVybGFwcGluZyBzcGFucyBpbnRvIGEgdHJlZS5cbiAgICAgIHNwYW5zID0gdG9TcGFuVHJlZShzcGFucyk7XG5cbiAgICAgIC8vIEJ1aWxkIGEgdHJlZSByZXByZXNlbnRhdGlvbiBvZiB0aGUgZW50aXJlIHN0cmluZywgbm90XG4gICAgICAvLyBqdXN0IHRoZSBmb3JtYXR0ZWQgcGFydHMuXG4gICAgICBjb25zdCBjaHVua3MgPSBjaHVua2lmeShsaW5lLCAwLCBsaW5lLmxlbmd0aCwgc3BhbnMpO1xuXG4gICAgICBjb25zdCBkcmFmdHkgPSBkcmFmdGlmeShjaHVua3MsIDApO1xuXG4gICAgICBibG9jayA9IHtcbiAgICAgICAgdHh0OiBkcmFmdHkudHh0LFxuICAgICAgICBmbXQ6IGRyYWZ0eS5mbXRcbiAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gRXh0cmFjdCBlbnRpdGllcyBmcm9tIHRoZSBjbGVhbmVkIHVwIHN0cmluZy5cbiAgICBlbnRpdGllcyA9IGV4dHJhY3RFbnRpdGllcyhibG9jay50eHQpO1xuICAgIGlmIChlbnRpdGllcy5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCByYW5nZXMgPSBbXTtcbiAgICAgIGZvciAobGV0IGkgaW4gZW50aXRpZXMpIHtcbiAgICAgICAgLy8ge29mZnNldDogbWF0Y2hbJ2luZGV4J10sIHVuaXF1ZTogbWF0Y2hbMF0sIGxlbjogbWF0Y2hbMF0ubGVuZ3RoLCBkYXRhOiBlbnQucGFja2VyKCksIHR5cGU6IGVudC5uYW1lfVxuICAgICAgICBjb25zdCBlbnRpdHkgPSBlbnRpdGllc1tpXTtcbiAgICAgICAgbGV0IGluZGV4ID0gZW50aXR5SW5kZXhbZW50aXR5LnVuaXF1ZV07XG4gICAgICAgIGlmICghaW5kZXgpIHtcbiAgICAgICAgICBpbmRleCA9IGVudGl0eU1hcC5sZW5ndGg7XG4gICAgICAgICAgZW50aXR5SW5kZXhbZW50aXR5LnVuaXF1ZV0gPSBpbmRleDtcbiAgICAgICAgICBlbnRpdHlNYXAucHVzaCh7XG4gICAgICAgICAgICB0cDogZW50aXR5LnR5cGUsXG4gICAgICAgICAgICBkYXRhOiBlbnRpdHkuZGF0YVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJhbmdlcy5wdXNoKHtcbiAgICAgICAgICBhdDogZW50aXR5Lm9mZnNldCxcbiAgICAgICAgICBsZW46IGVudGl0eS5sZW4sXG4gICAgICAgICAga2V5OiBpbmRleFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGJsb2NrLmVudCA9IHJhbmdlcztcbiAgICB9XG5cbiAgICBibHgucHVzaChibG9jayk7XG4gIH0pO1xuXG4gIGNvbnN0IHJlc3VsdCA9IHtcbiAgICB0eHQ6ICcnXG4gIH07XG5cbiAgLy8gTWVyZ2UgbGluZXMgYW5kIHNhdmUgbGluZSBicmVha3MgYXMgQlIgaW5saW5lIGZvcm1hdHRpbmcuXG4gIGlmIChibHgubGVuZ3RoID4gMCkge1xuICAgIHJlc3VsdC50eHQgPSBibHhbMF0udHh0O1xuICAgIHJlc3VsdC5mbXQgPSAoYmx4WzBdLmZtdCB8fCBbXSkuY29uY2F0KGJseFswXS5lbnQgfHwgW10pO1xuXG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCBibHgubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGJsb2NrID0gYmx4W2ldO1xuICAgICAgY29uc3Qgb2Zmc2V0ID0gcmVzdWx0LnR4dC5sZW5ndGggKyAxO1xuXG4gICAgICByZXN1bHQuZm10LnB1c2goe1xuICAgICAgICB0cDogJ0JSJyxcbiAgICAgICAgbGVuOiAxLFxuICAgICAgICBhdDogb2Zmc2V0IC0gMVxuICAgICAgfSk7XG5cbiAgICAgIHJlc3VsdC50eHQgKz0gJyAnICsgYmxvY2sudHh0O1xuICAgICAgaWYgKGJsb2NrLmZtdCkge1xuICAgICAgICByZXN1bHQuZm10ID0gcmVzdWx0LmZtdC5jb25jYXQoYmxvY2suZm10Lm1hcCgocykgPT4ge1xuICAgICAgICAgIHMuYXQgKz0gb2Zmc2V0O1xuICAgICAgICAgIHJldHVybiBzO1xuICAgICAgICB9KSk7XG4gICAgICB9XG4gICAgICBpZiAoYmxvY2suZW50KSB7XG4gICAgICAgIHJlc3VsdC5mbXQgPSByZXN1bHQuZm10LmNvbmNhdChibG9jay5lbnQubWFwKChzKSA9PiB7XG4gICAgICAgICAgcy5hdCArPSBvZmZzZXQ7XG4gICAgICAgICAgcmV0dXJuIHM7XG4gICAgICAgIH0pKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocmVzdWx0LmZtdC5sZW5ndGggPT0gMCkge1xuICAgICAgZGVsZXRlIHJlc3VsdC5mbXQ7XG4gICAgfVxuXG4gICAgaWYgKGVudGl0eU1hcC5sZW5ndGggPiAwKSB7XG4gICAgICByZXN1bHQuZW50ID0gZW50aXR5TWFwO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEFwcGVuZCBvbmUgRHJhZnR5IGRvY3VtZW50IHRvIGFub3RoZXIuXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGZpcnN0IC0gRHJhZnR5IGRvY3VtZW50IHRvIGFwcGVuZCB0by5cbiAqIEBwYXJhbSB7RHJhZnR5fHN0cmluZ30gc2Vjb25kIC0gRHJhZnR5IGRvY3VtZW50IG9yIHN0cmluZyBiZWluZyBhcHBlbmRlZC5cbiAqXG4gKiBAcmV0dXJuIHtEcmFmdHl9IGZpcnN0IGRvY3VtZW50IHdpdGggdGhlIHNlY29uZCBhcHBlbmRlZCB0byBpdC5cbiAqL1xuRHJhZnR5LmFwcGVuZCA9IGZ1bmN0aW9uKGZpcnN0LCBzZWNvbmQpIHtcbiAgaWYgKCFmaXJzdCkge1xuICAgIHJldHVybiBzZWNvbmQ7XG4gIH1cbiAgaWYgKCFzZWNvbmQpIHtcbiAgICByZXR1cm4gZmlyc3Q7XG4gIH1cblxuICBmaXJzdC50eHQgPSBmaXJzdC50eHQgfHwgJyc7XG4gIGNvbnN0IGxlbiA9IGZpcnN0LnR4dC5sZW5ndGg7XG5cbiAgaWYgKHR5cGVvZiBzZWNvbmQgPT0gJ3N0cmluZycpIHtcbiAgICBmaXJzdC50eHQgKz0gc2Vjb25kO1xuICB9IGVsc2UgaWYgKHNlY29uZC50eHQpIHtcbiAgICBmaXJzdC50eHQgKz0gc2Vjb25kLnR4dDtcbiAgfVxuXG4gIGlmIChBcnJheS5pc0FycmF5KHNlY29uZC5mbXQpKSB7XG4gICAgZmlyc3QuZm10ID0gZmlyc3QuZm10IHx8IFtdO1xuICAgIGlmIChBcnJheS5pc0FycmF5KHNlY29uZC5lbnQpKSB7XG4gICAgICBmaXJzdC5lbnQgPSBmaXJzdC5lbnQgfHwgW107XG4gICAgfVxuICAgIHNlY29uZC5mbXQuZm9yRWFjaChzcmMgPT4ge1xuICAgICAgY29uc3QgZm10ID0ge1xuICAgICAgICBhdDogKHNyYy5hdCB8IDApICsgbGVuLFxuICAgICAgICBsZW46IHNyYy5sZW4gfCAwXG4gICAgICB9O1xuICAgICAgLy8gU3BlY2lhbCBjYXNlIGZvciB0aGUgb3V0c2lkZSBvZiB0aGUgbm9ybWFsIHJlbmRlcmluZyBmbG93IHN0eWxlcy5cbiAgICAgIGlmIChzcmMuYXQgPT0gLTEpIHtcbiAgICAgICAgZm10LmF0ID0gLTE7XG4gICAgICAgIGZtdC5sZW4gPSAwO1xuICAgICAgfVxuICAgICAgaWYgKHNyYy50cCkge1xuICAgICAgICBmbXQudHAgPSBzcmMudHA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmbXQua2V5ID0gZmlyc3QuZW50Lmxlbmd0aDtcbiAgICAgICAgZmlyc3QuZW50LnB1c2goc2Vjb25kLmVudFtzcmMua2V5IHx8IDBdKTtcbiAgICAgIH1cbiAgICAgIGZpcnN0LmZtdC5wdXNoKGZtdCk7XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gZmlyc3Q7XG59XG5cbi8qKlxuICogQHR5cGVkZWYgRHJhZnR5LkltYWdlRGVzY1xuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHR5cGUgT2JqZWN0XG4gKiBAcGFyYW0ge3N0cmluZ30gbWltZSAtIG1pbWUtdHlwZSBvZiB0aGUgaW1hZ2UsIGUuZy4gXCJpbWFnZS9wbmdcIlxuICogQHBhcmFtIHtzdHJpbmd9IHByZXZpZXcgLSBiYXNlNjQtZW5jb2RlZCBpbWFnZSBjb250ZW50IChvciBwcmV2aWV3LCBpZiBsYXJnZSBpbWFnZSBpcyBhdHRhY2hlZCkuIENvdWxkIGJlIG51bGwvdW5kZWZpbmVkLlxuICogQHBhcmFtIHtpbnRlZ2VyfSB3aWR0aCAtIHdpZHRoIG9mIHRoZSBpbWFnZVxuICogQHBhcmFtIHtpbnRlZ2VyfSBoZWlnaHQgLSBoZWlnaHQgb2YgdGhlIGltYWdlXG4gKiBAcGFyYW0ge3N0cmluZ30gZmlsZW5hbWUgLSBmaWxlIG5hbWUgc3VnZ2VzdGlvbiBmb3IgZG93bmxvYWRpbmcgdGhlIGltYWdlLlxuICogQHBhcmFtIHtpbnRlZ2VyfSBzaXplIC0gc2l6ZSBvZiB0aGUgaW1hZ2UgaW4gYnl0ZXMuIFRyZWF0IGlzIGFzIGFuIHVudHJ1c3RlZCBoaW50LlxuICogQHBhcmFtIHtzdHJpbmd9IHJlZnVybCAtIHJlZmVyZW5jZSB0byB0aGUgY29udGVudC4gQ291bGQgYmUgbnVsbC91bmRlZmluZWQuXG4gKiBAcGFyYW0ge3N0cmluZ30gX3RlbXBQcmV2aWV3IC0gYmFzZTY0LWVuY29kZWQgaW1hZ2UgcHJldmlldyB1c2VkIGR1cmluZyB1cGxvYWQgcHJvY2Vzczsgbm90IHNlcmlhbGl6YWJsZS5cbiAqIEBwYXJhbSB7UHJvbWlzZX0gdXJsUHJvbWlzZSAtIFByb21pc2Ugd2hpY2ggcmV0dXJucyBjb250ZW50IFVSTCB3aGVuIHJlc29sdmVkLlxuICovXG5cbi8qKlxuICogSW5zZXJ0IGlubGluZSBpbWFnZSBpbnRvIERyYWZ0eSBkb2N1bWVudC5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eX0gY29udGVudCAtIGRvY3VtZW50IHRvIGFkZCBpbWFnZSB0by5cbiAqIEBwYXJhbSB7aW50ZWdlcn0gYXQgLSBpbmRleCB3aGVyZSB0aGUgb2JqZWN0IGlzIGluc2VydGVkLiBUaGUgbGVuZ3RoIG9mIHRoZSBpbWFnZSBpcyBhbHdheXMgMS5cbiAqIEBwYXJhbSB7SW1hZ2VEZXNjfSBpbWFnZURlc2MgLSBvYmplY3Qgd2l0aCBpbWFnZSBwYXJhbWVuZXRzIGFuZCBkYXRhLlxuICpcbiAqIEByZXR1cm4ge0RyYWZ0eX0gdXBkYXRlZCBkb2N1bWVudC5cbiAqL1xuRHJhZnR5Lmluc2VydEltYWdlID0gZnVuY3Rpb24oY29udGVudCwgYXQsIGltYWdlRGVzYykge1xuICBjb250ZW50ID0gY29udGVudCB8fCB7XG4gICAgdHh0OiAnICdcbiAgfTtcbiAgY29udGVudC5lbnQgPSBjb250ZW50LmVudCB8fCBbXTtcbiAgY29udGVudC5mbXQgPSBjb250ZW50LmZtdCB8fCBbXTtcblxuICBjb250ZW50LmZtdC5wdXNoKHtcbiAgICBhdDogYXQgfCAwLFxuICAgIGxlbjogMSxcbiAgICBrZXk6IGNvbnRlbnQuZW50Lmxlbmd0aFxuICB9KTtcblxuICBjb25zdCBleCA9IHtcbiAgICB0cDogJ0lNJyxcbiAgICBkYXRhOiB7XG4gICAgICBtaW1lOiBpbWFnZURlc2MubWltZSxcbiAgICAgIHZhbDogaW1hZ2VEZXNjLnByZXZpZXcsXG4gICAgICB3aWR0aDogaW1hZ2VEZXNjLndpZHRoLFxuICAgICAgaGVpZ2h0OiBpbWFnZURlc2MuaGVpZ2h0LFxuICAgICAgbmFtZTogaW1hZ2VEZXNjLmZpbGVuYW1lLFxuICAgICAgc2l6ZTogaW1hZ2VEZXNjLnNpemUgfCAwLFxuICAgICAgcmVmOiBpbWFnZURlc2MucmVmdXJsXG4gICAgfVxuICB9O1xuXG4gIGlmIChpbWFnZURlc2MudXJsUHJvbWlzZSkge1xuICAgIGV4LmRhdGEuX3RlbXBQcmV2aWV3ID0gaW1hZ2VEZXNjLl90ZW1wUHJldmlldztcbiAgICBleC5kYXRhLl9wcm9jZXNzaW5nID0gdHJ1ZTtcbiAgICBpbWFnZURlc2MudXJsUHJvbWlzZS50aGVuKFxuICAgICAgdXJsID0+IHtcbiAgICAgICAgZXguZGF0YS5yZWYgPSB1cmw7XG4gICAgICAgIGV4LmRhdGEuX3RlbXBQcmV2aWV3ID0gdW5kZWZpbmVkO1xuICAgICAgICBleC5kYXRhLl9wcm9jZXNzaW5nID0gdW5kZWZpbmVkO1xuICAgICAgfSxcbiAgICAgIF8gPT4ge1xuICAgICAgICAvLyBDYXRjaCB0aGUgZXJyb3IsIG90aGVyd2lzZSBpdCB3aWxsIGFwcGVhciBpbiB0aGUgY29uc29sZS5cbiAgICAgICAgZXguZGF0YS5fcHJvY2Vzc2luZyA9IHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICApO1xuICB9XG5cbiAgY29udGVudC5lbnQucHVzaChleCk7XG5cbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cbi8qKlxuICogQHR5cGVkZWYgRHJhZnR5LkF1ZGlvRGVzY1xuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHR5cGUgT2JqZWN0XG4gKiBAcGFyYW0ge3N0cmluZ30gbWltZSAtIG1pbWUtdHlwZSBvZiB0aGUgYXVkaW8sIGUuZy4gXCJhdWRpby9vZ2dcIi5cbiAqIEBwYXJhbSB7c3RyaW5nfSBkYXRhIC0gYmFzZTY0LWVuY29kZWQgYXVkaW8gY29udGVudC4gQ291bGQgYmUgbnVsbC91bmRlZmluZWQuXG4gKiBAcGFyYW0ge2ludGVnZXJ9IGR1cmF0aW9uIC0gZHVyYXRpb24gb2YgdGhlIHJlY29yZCBpbiBtaWxsaXNlY29uZHMuXG4gKiBAcGFyYW0ge3N0cmluZ30gcHJldmlldyAtIGJhc2U2NCBlbmNvZGVkIHNob3J0IGFycmF5IG9mIGFtcGxpdHVkZSB2YWx1ZXMgMC4uMTAwLlxuICogQHBhcmFtIHtzdHJpbmd9IGZpbGVuYW1lIC0gZmlsZSBuYW1lIHN1Z2dlc3Rpb24gZm9yIGRvd25sb2FkaW5nIHRoZSBhdWRpby5cbiAqIEBwYXJhbSB7aW50ZWdlcn0gc2l6ZSAtIHNpemUgb2YgdGhlIHJlY29yZGluZyBpbiBieXRlcy4gVHJlYXQgaXMgYXMgYW4gdW50cnVzdGVkIGhpbnQuXG4gKiBAcGFyYW0ge3N0cmluZ30gcmVmdXJsIC0gcmVmZXJlbmNlIHRvIHRoZSBjb250ZW50LiBDb3VsZCBiZSBudWxsL3VuZGVmaW5lZC5cbiAqIEBwYXJhbSB7UHJvbWlzZX0gdXJsUHJvbWlzZSAtIFByb21pc2Ugd2hpY2ggcmV0dXJucyBjb250ZW50IFVSTCB3aGVuIHJlc29sdmVkLlxuICovXG5cbi8qKlxuICogSW5zZXJ0IGF1ZGlvIHJlY29yZGluZyBpbnRvIERyYWZ0eSBkb2N1bWVudC5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eX0gY29udGVudCAtIGRvY3VtZW50IHRvIGFkZCBhdWRpbyByZWNvcmQgdG8uXG4gKiBAcGFyYW0ge2ludGVnZXJ9IGF0IC0gaW5kZXggd2hlcmUgdGhlIG9iamVjdCBpcyBpbnNlcnRlZC4gVGhlIGxlbmd0aCBvZiB0aGUgcmVjb3JkIGlzIGFsd2F5cyAxLlxuICogQHBhcmFtIHtBdWRpb0Rlc2N9IGF1ZGlvRGVzYyAtIG9iamVjdCB3aXRoIHRoZSBhdWRpbyBwYXJhbWVuZXRzIGFuZCBkYXRhLlxuICpcbiAqIEByZXR1cm4ge0RyYWZ0eX0gdXBkYXRlZCBkb2N1bWVudC5cbiAqL1xuRHJhZnR5Lmluc2VydEF1ZGlvID0gZnVuY3Rpb24oY29udGVudCwgYXQsIGF1ZGlvRGVzYykge1xuICBjb250ZW50ID0gY29udGVudCB8fCB7XG4gICAgdHh0OiAnICdcbiAgfTtcbiAgY29udGVudC5lbnQgPSBjb250ZW50LmVudCB8fCBbXTtcbiAgY29udGVudC5mbXQgPSBjb250ZW50LmZtdCB8fCBbXTtcblxuICBjb250ZW50LmZtdC5wdXNoKHtcbiAgICBhdDogYXQgfCAwLFxuICAgIGxlbjogMSxcbiAgICBrZXk6IGNvbnRlbnQuZW50Lmxlbmd0aFxuICB9KTtcblxuICBjb25zdCBleCA9IHtcbiAgICB0cDogJ0FVJyxcbiAgICBkYXRhOiB7XG4gICAgICBtaW1lOiBhdWRpb0Rlc2MubWltZSxcbiAgICAgIHZhbDogYXVkaW9EZXNjLmRhdGEsXG4gICAgICBkdXJhdGlvbjogYXVkaW9EZXNjLmR1cmF0aW9uIHwgMCxcbiAgICAgIHByZXZpZXc6IGF1ZGlvRGVzYy5wcmV2aWV3LFxuICAgICAgbmFtZTogYXVkaW9EZXNjLmZpbGVuYW1lLFxuICAgICAgc2l6ZTogYXVkaW9EZXNjLnNpemUgfCAwLFxuICAgICAgcmVmOiBhdWRpb0Rlc2MucmVmdXJsXG4gICAgfVxuICB9O1xuXG4gIGlmIChhdWRpb0Rlc2MudXJsUHJvbWlzZSkge1xuICAgIGV4LmRhdGEuX3Byb2Nlc3NpbmcgPSB0cnVlO1xuICAgIGF1ZGlvRGVzYy51cmxQcm9taXNlLnRoZW4oXG4gICAgICB1cmwgPT4ge1xuICAgICAgICBleC5kYXRhLnJlZiA9IHVybDtcbiAgICAgICAgZXguZGF0YS5fcHJvY2Vzc2luZyA9IHVuZGVmaW5lZDtcbiAgICAgIH0sXG4gICAgICBfID0+IHtcbiAgICAgICAgLy8gQ2F0Y2ggdGhlIGVycm9yLCBvdGhlcndpc2UgaXQgd2lsbCBhcHBlYXIgaW4gdGhlIGNvbnNvbGUuXG4gICAgICAgIGV4LmRhdGEuX3Byb2Nlc3NpbmcgPSB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgKTtcbiAgfVxuXG4gIGNvbnRlbnQuZW50LnB1c2goZXgpO1xuXG4gIHJldHVybiBjb250ZW50O1xufVxuXG4vKipcbiAqIENyZWF0ZSBhIHF1b3RlIHRvIERyYWZ0eSBkb2N1bWVudC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gaGVhZGVyIC0gUXVvdGUgaGVhZGVyICh0aXRsZSwgZXRjLikuXG4gKiBAcGFyYW0ge3N0cmluZ30gdWlkIC0gVUlEIG9mIHRoZSBhdXRob3IgdG8gbWVudGlvbi5cbiAqIEBwYXJhbSB7RHJhZnR5fSBib2R5IC0gQm9keSBvZiB0aGUgcXVvdGVkIG1lc3NhZ2UuXG4gKlxuICogQHJldHVybnMgUmVwbHkgcXVvdGUgRHJhZnR5IGRvYyB3aXRoIHRoZSBxdW90ZSBmb3JtYXR0aW5nLlxuICovXG5EcmFmdHkucXVvdGUgPSBmdW5jdGlvbihoZWFkZXIsIHVpZCwgYm9keSkge1xuICBjb25zdCBxdW90ZSA9IERyYWZ0eS5hcHBlbmQoRHJhZnR5LmFwcGVuZExpbmVCcmVhayhEcmFmdHkubWVudGlvbihoZWFkZXIsIHVpZCkpLCBib2R5KTtcblxuICAvLyBXcmFwIGludG8gYSBxdW90ZS5cbiAgcXVvdGUuZm10LnB1c2goe1xuICAgIGF0OiAwLFxuICAgIGxlbjogcXVvdGUudHh0Lmxlbmd0aCxcbiAgICB0cDogJ1FRJ1xuICB9KTtcblxuICByZXR1cm4gcXVvdGU7XG59XG5cbi8qKlxuICogQ3JlYXRlIGEgRHJhZnR5IGRvY3VtZW50IHdpdGggYSBtZW50aW9uLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gbWVudGlvbmVkIG5hbWUuXG4gKiBAcGFyYW0ge3N0cmluZ30gdWlkIC0gbWVudGlvbmVkIHVzZXIgSUQuXG4gKlxuICogQHJldHVybnMge0RyYWZ0eX0gZG9jdW1lbnQgd2l0aCB0aGUgbWVudGlvbi5cbiAqL1xuRHJhZnR5Lm1lbnRpb24gPSBmdW5jdGlvbihuYW1lLCB1aWQpIHtcbiAgcmV0dXJuIHtcbiAgICB0eHQ6IG5hbWUgfHwgJycsXG4gICAgZm10OiBbe1xuICAgICAgYXQ6IDAsXG4gICAgICBsZW46IChuYW1lIHx8ICcnKS5sZW5ndGgsXG4gICAgICBrZXk6IDBcbiAgICB9XSxcbiAgICBlbnQ6IFt7XG4gICAgICB0cDogJ01OJyxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgdmFsOiB1aWRcbiAgICAgIH1cbiAgICB9XVxuICB9O1xufVxuXG4vKipcbiAqIEFwcGVuZCBhIGxpbmsgdG8gYSBEcmFmdHkgZG9jdW1lbnQuXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGNvbnRlbnQgLSBEcmFmdHkgZG9jdW1lbnQgdG8gYXBwZW5kIGxpbmsgdG8uXG4gKiBAcGFyYW0ge09iamVjdH0gbGlua0RhdGEgLSBMaW5rIGluZm8gaW4gZm9ybWF0IDxjb2RlPnt0eHQ6ICdhbmtvciB0ZXh0JywgdXJsOiAnaHR0cDovLy4uLid9PC9jb2RlPi5cbiAqXG4gKiBAcmV0dXJucyB7RHJhZnR5fSB0aGUgc2FtZSBkb2N1bWVudCBhcyA8Y29kZT5jb250ZW50PC9jb2RlPi5cbiAqL1xuRHJhZnR5LmFwcGVuZExpbmsgPSBmdW5jdGlvbihjb250ZW50LCBsaW5rRGF0YSkge1xuICBjb250ZW50ID0gY29udGVudCB8fCB7XG4gICAgdHh0OiAnJ1xuICB9O1xuXG4gIGNvbnRlbnQuZW50ID0gY29udGVudC5lbnQgfHwgW107XG4gIGNvbnRlbnQuZm10ID0gY29udGVudC5mbXQgfHwgW107XG5cbiAgY29udGVudC5mbXQucHVzaCh7XG4gICAgYXQ6IGNvbnRlbnQudHh0Lmxlbmd0aCxcbiAgICBsZW46IGxpbmtEYXRhLnR4dC5sZW5ndGgsXG4gICAga2V5OiBjb250ZW50LmVudC5sZW5ndGhcbiAgfSk7XG4gIGNvbnRlbnQudHh0ICs9IGxpbmtEYXRhLnR4dDtcblxuICBjb25zdCBleCA9IHtcbiAgICB0cDogJ0xOJyxcbiAgICBkYXRhOiB7XG4gICAgICB1cmw6IGxpbmtEYXRhLnVybFxuICAgIH1cbiAgfVxuICBjb250ZW50LmVudC5wdXNoKGV4KTtcblxuICByZXR1cm4gY29udGVudDtcbn1cblxuLyoqXG4gKiBBcHBlbmQgaW1hZ2UgdG8gRHJhZnR5IGRvY3VtZW50LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fSBjb250ZW50IC0gZG9jdW1lbnQgdG8gYWRkIGltYWdlIHRvLlxuICogQHBhcmFtIHtJbWFnZURlc2N9IGltYWdlRGVzYyAtIG9iamVjdCB3aXRoIGltYWdlIHBhcmFtZW5ldHMuXG4gKlxuICogQHJldHVybiB7RHJhZnR5fSB1cGRhdGVkIGRvY3VtZW50LlxuICovXG5EcmFmdHkuYXBwZW5kSW1hZ2UgPSBmdW5jdGlvbihjb250ZW50LCBpbWFnZURlc2MpIHtcbiAgY29udGVudCA9IGNvbnRlbnQgfHwge1xuICAgIHR4dDogJydcbiAgfTtcbiAgY29udGVudC50eHQgKz0gJyAnO1xuICByZXR1cm4gRHJhZnR5Lmluc2VydEltYWdlKGNvbnRlbnQsIGNvbnRlbnQudHh0Lmxlbmd0aCAtIDEsIGltYWdlRGVzYyk7XG59XG5cbi8qKlxuICogQXBwZW5kIGF1ZGlvIHJlY29kcmluZyB0byBEcmFmdHkgZG9jdW1lbnQuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGNvbnRlbnQgLSBkb2N1bWVudCB0byBhZGQgcmVjb3JkaW5nIHRvLlxuICogQHBhcmFtIHtBdWRpb0Rlc2N9IGF1ZGlvRGVzYyAtIG9iamVjdCB3aXRoIGF1ZGlvIGRhdGEuXG4gKlxuICogQHJldHVybiB7RHJhZnR5fSB1cGRhdGVkIGRvY3VtZW50LlxuICovXG5EcmFmdHkuYXBwZW5kQXVkaW8gPSBmdW5jdGlvbihjb250ZW50LCBhdWRpb0Rlc2MpIHtcbiAgY29udGVudCA9IGNvbnRlbnQgfHwge1xuICAgIHR4dDogJydcbiAgfTtcbiAgY29udGVudC50eHQgKz0gJyAnO1xuICByZXR1cm4gRHJhZnR5Lmluc2VydEF1ZGlvKGNvbnRlbnQsIGNvbnRlbnQudHh0Lmxlbmd0aCAtIDEsIGF1ZGlvRGVzYyk7XG59XG5cbi8qKlxuICogQHR5cGVkZWYgRHJhZnR5LkF0dGFjaG1lbnREZXNjXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAdHlwZSBPYmplY3RcbiAqIEBwYXJhbSB7c3RyaW5nfSBtaW1lIC0gbWltZS10eXBlIG9mIHRoZSBhdHRhY2htZW50LCBlLmcuIFwiYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtXCJcbiAqIEBwYXJhbSB7c3RyaW5nfSBkYXRhIC0gYmFzZTY0LWVuY29kZWQgaW4tYmFuZCBjb250ZW50IG9mIHNtYWxsIGF0dGFjaG1lbnRzLiBDb3VsZCBiZSBudWxsL3VuZGVmaW5lZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlbmFtZSAtIGZpbGUgbmFtZSBzdWdnZXN0aW9uIGZvciBkb3dubG9hZGluZyB0aGUgYXR0YWNobWVudC5cbiAqIEBwYXJhbSB7aW50ZWdlcn0gc2l6ZSAtIHNpemUgb2YgdGhlIGZpbGUgaW4gYnl0ZXMuIFRyZWF0IGlzIGFzIGFuIHVudHJ1c3RlZCBoaW50LlxuICogQHBhcmFtIHtzdHJpbmd9IHJlZnVybCAtIHJlZmVyZW5jZSB0byB0aGUgb3V0LW9mLWJhbmQgY29udGVudC4gQ291bGQgYmUgbnVsbC91bmRlZmluZWQuXG4gKiBAcGFyYW0ge1Byb21pc2V9IHVybFByb21pc2UgLSBQcm9taXNlIHdoaWNoIHJldHVybnMgY29udGVudCBVUkwgd2hlbiByZXNvbHZlZC5cbiAqL1xuXG4vKipcbiAqIEF0dGFjaCBmaWxlIHRvIERyYWZ0eSBjb250ZW50LiBFaXRoZXIgYXMgYSBibG9iIG9yIGFzIGEgcmVmZXJlbmNlLlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fSBjb250ZW50IC0gZG9jdW1lbnQgdG8gYXR0YWNoIGZpbGUgdG8uXG4gKiBAcGFyYW0ge0F0dGFjaG1lbnREZXNjfSBvYmplY3QgLSBjb250YWluaW5nIGF0dGFjaG1lbnQgZGVzY3JpcHRpb24gYW5kIGRhdGEuXG4gKlxuICogQHJldHVybiB7RHJhZnR5fSB1cGRhdGVkIGRvY3VtZW50LlxuICovXG5EcmFmdHkuYXR0YWNoRmlsZSA9IGZ1bmN0aW9uKGNvbnRlbnQsIGF0dGFjaG1lbnREZXNjKSB7XG4gIGNvbnRlbnQgPSBjb250ZW50IHx8IHtcbiAgICB0eHQ6ICcnXG4gIH07XG5cbiAgY29udGVudC5lbnQgPSBjb250ZW50LmVudCB8fCBbXTtcbiAgY29udGVudC5mbXQgPSBjb250ZW50LmZtdCB8fCBbXTtcblxuICBjb250ZW50LmZtdC5wdXNoKHtcbiAgICBhdDogLTEsXG4gICAgbGVuOiAwLFxuICAgIGtleTogY29udGVudC5lbnQubGVuZ3RoXG4gIH0pO1xuXG4gIGNvbnN0IGV4ID0ge1xuICAgIHRwOiAnRVgnLFxuICAgIGRhdGE6IHtcbiAgICAgIG1pbWU6IGF0dGFjaG1lbnREZXNjLm1pbWUsXG4gICAgICB2YWw6IGF0dGFjaG1lbnREZXNjLmRhdGEsXG4gICAgICBuYW1lOiBhdHRhY2htZW50RGVzYy5maWxlbmFtZSxcbiAgICAgIHJlZjogYXR0YWNobWVudERlc2MucmVmdXJsLFxuICAgICAgc2l6ZTogYXR0YWNobWVudERlc2Muc2l6ZSB8IDBcbiAgICB9XG4gIH1cbiAgaWYgKGF0dGFjaG1lbnREZXNjLnVybFByb21pc2UpIHtcbiAgICBleC5kYXRhLl9wcm9jZXNzaW5nID0gdHJ1ZTtcbiAgICBhdHRhY2htZW50RGVzYy51cmxQcm9taXNlLnRoZW4oXG4gICAgICAodXJsKSA9PiB7XG4gICAgICAgIGV4LmRhdGEucmVmID0gdXJsO1xuICAgICAgICBleC5kYXRhLl9wcm9jZXNzaW5nID0gdW5kZWZpbmVkO1xuICAgICAgfSxcbiAgICAgIChlcnIpID0+IHtcbiAgICAgICAgLyogY2F0Y2ggdGhlIGVycm9yLCBvdGhlcndpc2UgaXQgd2lsbCBhcHBlYXIgaW4gdGhlIGNvbnNvbGUuICovXG4gICAgICAgIGV4LmRhdGEuX3Byb2Nlc3NpbmcgPSB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgKTtcbiAgfVxuICBjb250ZW50LmVudC5wdXNoKGV4KTtcblxuICByZXR1cm4gY29udGVudDtcbn1cblxuLyoqXG4gKiBXcmFwcyBkcmFmdHkgZG9jdW1lbnQgaW50byBhIHNpbXBsZSBmb3JtYXR0aW5nIHN0eWxlLlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fHN0cmluZ30gY29udGVudCAtIGRvY3VtZW50IG9yIHN0cmluZyB0byB3cmFwIGludG8gYSBzdHlsZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHlsZSAtIHR3by1sZXR0ZXIgc3R5bGUgdG8gd3JhcCBpbnRvLlxuICogQHBhcmFtIHtudW1iZXJ9IGF0IC0gaW5kZXggd2hlcmUgdGhlIHN0eWxlIHN0YXJ0cywgZGVmYXVsdCAwLlxuICogQHBhcmFtIHtudW1iZXJ9IGxlbiAtIGxlbmd0aCBvZiB0aGUgZm9ybSBjb250ZW50LCBkZWZhdWx0IGFsbCBvZiBpdC5cbiAqXG4gKiBAcmV0dXJuIHtEcmFmdHl9IHVwZGF0ZWQgZG9jdW1lbnQuXG4gKi9cbkRyYWZ0eS53cmFwSW50byA9IGZ1bmN0aW9uKGNvbnRlbnQsIHN0eWxlLCBhdCwgbGVuKSB7XG4gIGlmICh0eXBlb2YgY29udGVudCA9PSAnc3RyaW5nJykge1xuICAgIGNvbnRlbnQgPSB7XG4gICAgICB0eHQ6IGNvbnRlbnRcbiAgICB9O1xuICB9XG4gIGNvbnRlbnQuZm10ID0gY29udGVudC5mbXQgfHwgW107XG5cbiAgY29udGVudC5mbXQucHVzaCh7XG4gICAgYXQ6IGF0IHx8IDAsXG4gICAgbGVuOiBsZW4gfHwgY29udGVudC50eHQubGVuZ3RoLFxuICAgIHRwOiBzdHlsZSxcbiAgfSk7XG5cbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cbi8qKlxuICogV3JhcHMgY29udGVudCBpbnRvIGFuIGludGVyYWN0aXZlIGZvcm0uXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl8c3RyaW5nfSBjb250ZW50IC0gdG8gd3JhcCBpbnRvIGEgZm9ybS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBhdCAtIGluZGV4IHdoZXJlIHRoZSBmb3JtcyBzdGFydHMuXG4gKiBAcGFyYW0ge251bWJlcn0gbGVuIC0gbGVuZ3RoIG9mIHRoZSBmb3JtIGNvbnRlbnQuXG4gKlxuICogQHJldHVybiB7RHJhZnR5fSB1cGRhdGVkIGRvY3VtZW50LlxuICovXG5EcmFmdHkud3JhcEFzRm9ybSA9IGZ1bmN0aW9uKGNvbnRlbnQsIGF0LCBsZW4pIHtcbiAgcmV0dXJuIERyYWZ0eS53cmFwSW50byhjb250ZW50LCAnRk0nLCBhdCwgbGVuKTtcbn1cblxuLyoqXG4gKiBJbnNlcnQgY2xpY2thYmxlIGJ1dHRvbiBpbnRvIERyYWZ0eSBkb2N1bWVudC5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eXxzdHJpbmd9IGNvbnRlbnQgLSBEcmFmdHkgZG9jdW1lbnQgdG8gaW5zZXJ0IGJ1dHRvbiB0byBvciBhIHN0cmluZyB0byBiZSB1c2VkIGFzIGJ1dHRvbiB0ZXh0LlxuICogQHBhcmFtIHtudW1iZXJ9IGF0IC0gbG9jYXRpb24gd2hlcmUgdGhlIGJ1dHRvbiBpcyBpbnNlcnRlZC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBsZW4gLSB0aGUgbGVuZ3RoIG9mIHRoZSB0ZXh0IHRvIGJlIHVzZWQgYXMgYnV0dG9uIHRpdGxlLlxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSB0aGUgYnV0dG9uLiBDbGllbnQgc2hvdWxkIHJldHVybiBpdCB0byB0aGUgc2VydmVyIHdoZW4gdGhlIGJ1dHRvbiBpcyBjbGlja2VkLlxuICogQHBhcmFtIHtzdHJpbmd9IGFjdGlvblR5cGUgLSB0aGUgdHlwZSBvZiB0aGUgYnV0dG9uLCBvbmUgb2YgJ3VybCcgb3IgJ3B1YicuXG4gKiBAcGFyYW0ge3N0cmluZ30gYWN0aW9uVmFsdWUgLSB0aGUgdmFsdWUgdG8gcmV0dXJuIG9uIGNsaWNrOlxuICogQHBhcmFtIHtzdHJpbmd9IHJlZlVybCAtIHRoZSBVUkwgdG8gZ28gdG8gd2hlbiB0aGUgJ3VybCcgYnV0dG9uIGlzIGNsaWNrZWQuXG4gKlxuICogQHJldHVybiB7RHJhZnR5fSB1cGRhdGVkIGRvY3VtZW50LlxuICovXG5EcmFmdHkuaW5zZXJ0QnV0dG9uID0gZnVuY3Rpb24oY29udGVudCwgYXQsIGxlbiwgbmFtZSwgYWN0aW9uVHlwZSwgYWN0aW9uVmFsdWUsIHJlZlVybCkge1xuICBpZiAodHlwZW9mIGNvbnRlbnQgPT0gJ3N0cmluZycpIHtcbiAgICBjb250ZW50ID0ge1xuICAgICAgdHh0OiBjb250ZW50XG4gICAgfTtcbiAgfVxuXG4gIGlmICghY29udGVudCB8fCAhY29udGVudC50eHQgfHwgY29udGVudC50eHQubGVuZ3RoIDwgYXQgKyBsZW4pIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGlmIChsZW4gPD0gMCB8fCBbJ3VybCcsICdwdWInXS5pbmRleE9mKGFjdGlvblR5cGUpID09IC0xKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgLy8gRW5zdXJlIHJlZlVybCBpcyBhIHN0cmluZy5cbiAgaWYgKGFjdGlvblR5cGUgPT0gJ3VybCcgJiYgIXJlZlVybCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHJlZlVybCA9ICcnICsgcmVmVXJsO1xuXG4gIGNvbnRlbnQuZW50ID0gY29udGVudC5lbnQgfHwgW107XG4gIGNvbnRlbnQuZm10ID0gY29udGVudC5mbXQgfHwgW107XG5cbiAgY29udGVudC5mbXQucHVzaCh7XG4gICAgYXQ6IGF0IHwgMCxcbiAgICBsZW46IGxlbixcbiAgICBrZXk6IGNvbnRlbnQuZW50Lmxlbmd0aFxuICB9KTtcbiAgY29udGVudC5lbnQucHVzaCh7XG4gICAgdHA6ICdCTicsXG4gICAgZGF0YToge1xuICAgICAgYWN0OiBhY3Rpb25UeXBlLFxuICAgICAgdmFsOiBhY3Rpb25WYWx1ZSxcbiAgICAgIHJlZjogcmVmVXJsLFxuICAgICAgbmFtZTogbmFtZVxuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cbi8qKlxuICogQXBwZW5kIGNsaWNrYWJsZSBidXR0b24gdG8gRHJhZnR5IGRvY3VtZW50LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fHN0cmluZ30gY29udGVudCAtIERyYWZ0eSBkb2N1bWVudCB0byBpbnNlcnQgYnV0dG9uIHRvIG9yIGEgc3RyaW5nIHRvIGJlIHVzZWQgYXMgYnV0dG9uIHRleHQuXG4gKiBAcGFyYW0ge3N0cmluZ30gdGl0bGUgLSB0aGUgdGV4dCB0byBiZSB1c2VkIGFzIGJ1dHRvbiB0aXRsZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gdGhlIGJ1dHRvbi4gQ2xpZW50IHNob3VsZCByZXR1cm4gaXQgdG8gdGhlIHNlcnZlciB3aGVuIHRoZSBidXR0b24gaXMgY2xpY2tlZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBhY3Rpb25UeXBlIC0gdGhlIHR5cGUgb2YgdGhlIGJ1dHRvbiwgb25lIG9mICd1cmwnIG9yICdwdWInLlxuICogQHBhcmFtIHtzdHJpbmd9IGFjdGlvblZhbHVlIC0gdGhlIHZhbHVlIHRvIHJldHVybiBvbiBjbGljazpcbiAqIEBwYXJhbSB7c3RyaW5nfSByZWZVcmwgLSB0aGUgVVJMIHRvIGdvIHRvIHdoZW4gdGhlICd1cmwnIGJ1dHRvbiBpcyBjbGlja2VkLlxuICpcbiAqIEByZXR1cm4ge0RyYWZ0eX0gdXBkYXRlZCBkb2N1bWVudC5cbiAqL1xuRHJhZnR5LmFwcGVuZEJ1dHRvbiA9IGZ1bmN0aW9uKGNvbnRlbnQsIHRpdGxlLCBuYW1lLCBhY3Rpb25UeXBlLCBhY3Rpb25WYWx1ZSwgcmVmVXJsKSB7XG4gIGNvbnRlbnQgPSBjb250ZW50IHx8IHtcbiAgICB0eHQ6ICcnXG4gIH07XG4gIGNvbnN0IGF0ID0gY29udGVudC50eHQubGVuZ3RoO1xuICBjb250ZW50LnR4dCArPSB0aXRsZTtcbiAgcmV0dXJuIERyYWZ0eS5pbnNlcnRCdXR0b24oY29udGVudCwgYXQsIHRpdGxlLmxlbmd0aCwgbmFtZSwgYWN0aW9uVHlwZSwgYWN0aW9uVmFsdWUsIHJlZlVybCk7XG59XG5cbi8qKlxuICogQXR0YWNoIGEgZ2VuZXJpYyBKUyBvYmplY3QuIFRoZSBvYmplY3QgaXMgYXR0YWNoZWQgYXMgYSBqc29uIHN0cmluZy5cbiAqIEludGVuZGVkIGZvciByZXByZXNlbnRpbmcgYSBmb3JtIHJlc3BvbnNlLlxuICpcbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eX0gY29udGVudCAtIERyYWZ0eSBkb2N1bWVudCB0byBhdHRhY2ggZmlsZSB0by5cbiAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIC0gZGF0YSB0byBjb252ZXJ0IHRvIGpzb24gc3RyaW5nIGFuZCBhdHRhY2guXG4gKiBAcmV0dXJucyB7RHJhZnR5fSB0aGUgc2FtZSBkb2N1bWVudCBhcyA8Y29kZT5jb250ZW50PC9jb2RlPi5cbiAqL1xuRHJhZnR5LmF0dGFjaEpTT04gPSBmdW5jdGlvbihjb250ZW50LCBkYXRhKSB7XG4gIGNvbnRlbnQgPSBjb250ZW50IHx8IHtcbiAgICB0eHQ6ICcnXG4gIH07XG4gIGNvbnRlbnQuZW50ID0gY29udGVudC5lbnQgfHwgW107XG4gIGNvbnRlbnQuZm10ID0gY29udGVudC5mbXQgfHwgW107XG5cbiAgY29udGVudC5mbXQucHVzaCh7XG4gICAgYXQ6IC0xLFxuICAgIGxlbjogMCxcbiAgICBrZXk6IGNvbnRlbnQuZW50Lmxlbmd0aFxuICB9KTtcblxuICBjb250ZW50LmVudC5wdXNoKHtcbiAgICB0cDogJ0VYJyxcbiAgICBkYXRhOiB7XG4gICAgICBtaW1lOiBKU09OX01JTUVfVFlQRSxcbiAgICAgIHZhbDogZGF0YVxuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG4vKipcbiAqIEFwcGVuZCBsaW5lIGJyZWFrIHRvIGEgRHJhZnR5IGRvY3VtZW50LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fSBjb250ZW50IC0gRHJhZnR5IGRvY3VtZW50IHRvIGFwcGVuZCBsaW5lYnJlYWsgdG8uXG4gKiBAcmV0dXJucyB7RHJhZnR5fSB0aGUgc2FtZSBkb2N1bWVudCBhcyA8Y29kZT5jb250ZW50PC9jb2RlPi5cbiAqL1xuRHJhZnR5LmFwcGVuZExpbmVCcmVhayA9IGZ1bmN0aW9uKGNvbnRlbnQpIHtcbiAgY29udGVudCA9IGNvbnRlbnQgfHwge1xuICAgIHR4dDogJydcbiAgfTtcbiAgY29udGVudC5mbXQgPSBjb250ZW50LmZtdCB8fCBbXTtcbiAgY29udGVudC5mbXQucHVzaCh7XG4gICAgYXQ6IGNvbnRlbnQudHh0Lmxlbmd0aCxcbiAgICBsZW46IDEsXG4gICAgdHA6ICdCUidcbiAgfSk7XG4gIGNvbnRlbnQudHh0ICs9ICcgJztcblxuICByZXR1cm4gY29udGVudDtcbn1cbi8qKlxuICogR2l2ZW4gRHJhZnR5IGRvY3VtZW50LCBjb252ZXJ0IGl0IHRvIEhUTUwuXG4gKiBObyBhdHRlbXB0IGlzIG1hZGUgdG8gc3RyaXAgcHJlLWV4aXN0aW5nIGh0bWwgbWFya3VwLlxuICogVGhpcyBpcyBwb3RlbnRpYWxseSB1bnNhZmUgYmVjYXVzZSA8Y29kZT5jb250ZW50LnR4dDwvY29kZT4gbWF5IGNvbnRhaW4gbWFsaWNpb3VzIEhUTUxcbiAqIG1hcmt1cC5cbiAqIEBtZW1iZXJvZiBUaW5vZGUuRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGRvYyAtIGRvY3VtZW50IHRvIGNvbnZlcnQuXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gSFRNTC1yZXByZXNlbnRhdGlvbiBvZiBjb250ZW50LlxuICovXG5EcmFmdHkuVU5TQUZFX3RvSFRNTCA9IGZ1bmN0aW9uKGRvYykge1xuICBsZXQgdHJlZSA9IGRyYWZ0eVRvVHJlZShkb2MpO1xuICBjb25zdCBodG1sRm9ybWF0dGVyID0gZnVuY3Rpb24odHlwZSwgZGF0YSwgdmFsdWVzKSB7XG4gICAgY29uc3QgdGFnID0gREVDT1JBVE9SU1t0eXBlXTtcbiAgICBsZXQgcmVzdWx0ID0gdmFsdWVzID8gdmFsdWVzLmpvaW4oJycpIDogJyc7XG4gICAgaWYgKHRhZykge1xuICAgICAgcmVzdWx0ID0gdGFnLm9wZW4oZGF0YSkgKyByZXN1bHQgKyB0YWcuY2xvc2UoZGF0YSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG4gIHJldHVybiB0cmVlQm90dG9tVXAodHJlZSwgaHRtbEZvcm1hdHRlciwgMCk7XG59XG5cbi8qKlxuICogQ2FsbGJhY2sgZm9yIGFwcGx5aW5nIGN1c3RvbSBmb3JtYXR0aW5nIHRvIGEgRHJhZnR5IGRvY3VtZW50LlxuICogQ2FsbGVkIG9uY2UgZm9yIGVhY2ggc3R5bGUgc3Bhbi5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAY2FsbGJhY2sgRm9ybWF0dGVyXG4gKiBAcGFyYW0ge3N0cmluZ30gc3R5bGUgLSBzdHlsZSBjb2RlIHN1Y2ggYXMgXCJTVFwiIG9yIFwiSU1cIi5cbiAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIC0gZW50aXR5J3MgZGF0YS5cbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWx1ZXMgLSBwb3NzaWJseSBzdHlsZWQgc3Vic3BhbnMgY29udGFpbmVkIGluIHRoaXMgc3R5bGUgc3Bhbi5cbiAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCAtIGluZGV4IG9mIHRoZSBlbGVtZW50IGd1YXJhbnRlZWQgdG8gYmUgdW5pcXVlLlxuICovXG5cbi8qKlxuICogQ29udmVydCBEcmFmdHkgZG9jdW1lbnQgdG8gYSByZXByZXNlbnRhdGlvbiBzdWl0YWJsZSBmb3IgZGlzcGxheS5cbiAqIFRoZSA8Y29kZT5jb250ZXh0PC9jb2RlPiBtYXkgZXhwb3NlIGEgZnVuY3Rpb24gPGNvZGU+Z2V0Rm9ybWF0dGVyKHN0eWxlKTwvY29kZT4uIElmIGl0J3MgYXZhaWxhYmxlXG4gKiBpdCB3aWxsIGNhbGwgaXQgdG8gb2J0YWluIGEgPGNvZGU+Zm9ybWF0dGVyPC9jb2RlPiBmb3IgYSBzdWJ0cmVlIG9mIHN0eWxlcyB1bmRlciB0aGUgPGNvZGU+c3R5bGU8L2NvZGU+LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fE9iamVjdH0gY29udGVudCAtIERyYWZ0eSBkb2N1bWVudCB0byB0cmFuc2Zvcm0uXG4gKiBAcGFyYW0ge0Zvcm1hdHRlcn0gZm9ybWF0dGVyIC0gY2FsbGJhY2sgd2hpY2ggZm9ybWF0cyBpbmRpdmlkdWFsIGVsZW1lbnRzLlxuICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHQgLSBjb250ZXh0IHByb3ZpZGVkIHRvIGZvcm1hdHRlciBhcyA8Y29kZT50aGlzPC9jb2RlPi5cbiAqXG4gKiBAcmV0dXJuIHtPYmplY3R9IHRyYW5zZm9ybWVkIG9iamVjdFxuICovXG5EcmFmdHkuZm9ybWF0ID0gZnVuY3Rpb24ob3JpZ2luYWwsIGZvcm1hdHRlciwgY29udGV4dCkge1xuICByZXR1cm4gdHJlZUJvdHRvbVVwKGRyYWZ0eVRvVHJlZShvcmlnaW5hbCksIGZvcm1hdHRlciwgMCwgW10sIGNvbnRleHQpO1xufVxuXG4vKipcbiAqIFNob3J0ZW4gRHJhZnR5IGRvY3VtZW50IG1ha2luZyB0aGUgZHJhZnR5IHRleHQgbm8gbG9uZ2VyIHRoYW4gdGhlIGxpbWl0LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fHN0cmluZ30gb3JpZ2luYWwgLSBEcmFmdHkgb2JqZWN0IHRvIHNob3J0ZW4uXG4gKiBAcGFyYW0ge251bWJlcn0gbGltaXQgLSBsZW5ndGggaW4gY2hhcmFjcmV0cyB0byBzaG9ydGVuIHRvLlxuICogQHBhcmFtIHtib29sZWFufSBsaWdodCAtIHJlbW92ZSBoZWF2eSBkYXRhIGZyb20gZW50aXRpZXMuXG4gKiBAcmV0dXJucyBuZXcgc2hvcnRlbmVkIERyYWZ0eSBvYmplY3QgbGVhdmluZyB0aGUgb3JpZ2luYWwgaW50YWN0LlxuICovXG5EcmFmdHkuc2hvcnRlbiA9IGZ1bmN0aW9uKG9yaWdpbmFsLCBsaW1pdCwgbGlnaHQpIHtcbiAgbGV0IHRyZWUgPSBkcmFmdHlUb1RyZWUob3JpZ2luYWwpO1xuICB0cmVlID0gc2hvcnRlblRyZWUodHJlZSwgbGltaXQsICfigKYnKTtcbiAgaWYgKHRyZWUgJiYgbGlnaHQpIHtcbiAgICB0cmVlID0gbGlnaHRFbnRpdHkodHJlZSk7XG4gIH1cbiAgcmV0dXJuIHRyZWVUb0RyYWZ0eSh7fSwgdHJlZSwgW10pO1xufVxuXG4vKipcbiAqIFRyYW5zZm9ybSBEcmFmdHkgZG9jIGZvciBmb3J3YXJkaW5nOiBzdHJpcCBsZWFkaW5nIEBtZW50aW9uIGFuZCBhbnkgbGVhZGluZyBsaW5lIGJyZWFrcyBvciB3aGl0ZXNwYWNlLlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fHN0cmluZ30gb3JpZ2luYWwgLSBEcmFmdHkgb2JqZWN0IHRvIHNob3J0ZW4uXG4gKiBAcmV0dXJucyBjb252ZXJ0ZWQgRHJhZnR5IG9iamVjdCBsZWF2aW5nIHRoZSBvcmlnaW5hbCBpbnRhY3QuXG4gKi9cbkRyYWZ0eS5mb3J3YXJkZWRDb250ZW50ID0gZnVuY3Rpb24ob3JpZ2luYWwpIHtcbiAgbGV0IHRyZWUgPSBkcmFmdHlUb1RyZWUob3JpZ2luYWwpO1xuICBjb25zdCBybU1lbnRpb24gPSBmdW5jdGlvbihub2RlKSB7XG4gICAgaWYgKG5vZGUudHlwZSA9PSAnTU4nKSB7XG4gICAgICBpZiAoIW5vZGUucGFyZW50IHx8ICFub2RlLnBhcmVudC50eXBlKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuICAvLyBTdHJpcCBsZWFkaW5nIG1lbnRpb24uXG4gIHRyZWUgPSB0cmVlVG9wRG93bih0cmVlLCBybU1lbnRpb24pO1xuICAvLyBSZW1vdmUgbGVhZGluZyB3aGl0ZXNwYWNlLlxuICB0cmVlID0gbFRyaW0odHJlZSk7XG4gIC8vIENvbnZlcnQgYmFjayB0byBEcmFmdHkuXG4gIHJldHVybiB0cmVlVG9EcmFmdHkoe30sIHRyZWUsIFtdKTtcbn1cblxuLyoqXG4gKiBQcmVwYXJlIERyYWZ0eSBkb2MgZm9yIHdyYXBwaW5nIGludG8gUVEgYXMgYSByZXBseTpcbiAqICAtIFJlcGxhY2UgZm9yd2FyZGluZyBtZW50aW9uIHdpdGggc3ltYm9sICfinqYnIGFuZCByZW1vdmUgZGF0YSAoVUlEKS5cbiAqICAtIFJlbW92ZSBxdW90ZWQgdGV4dCBjb21wbGV0ZWx5LlxuICogIC0gUmVwbGFjZSBsaW5lIGJyZWFrcyB3aXRoIHNwYWNlcy5cbiAqICAtIFN0cmlwIGVudGl0aWVzIG9mIGhlYXZ5IGNvbnRlbnQuXG4gKiAgLSBNb3ZlIGF0dGFjaG1lbnRzIHRvIHRoZSBlbmQgb2YgdGhlIGRvY3VtZW50LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fHN0cmluZ30gb3JpZ2luYWwgLSBEcmFmdHkgb2JqZWN0IHRvIHNob3J0ZW4uXG4gKiBAcGFyYW0ge251bWJlcn0gbGltaXQgLSBsZW5ndGggaW4gY2hhcmFjdGVycyB0byBzaG9ydGVuIHRvLlxuICogQHJldHVybnMgY29udmVydGVkIERyYWZ0eSBvYmplY3QgbGVhdmluZyB0aGUgb3JpZ2luYWwgaW50YWN0LlxuICovXG5EcmFmdHkucmVwbHlDb250ZW50ID0gZnVuY3Rpb24ob3JpZ2luYWwsIGxpbWl0KSB7XG4gIGNvbnN0IGNvbnZNTm5RUW5CUiA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICBpZiAobm9kZS50eXBlID09ICdRUScpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0gZWxzZSBpZiAobm9kZS50eXBlID09ICdNTicpIHtcbiAgICAgIGlmICgoIW5vZGUucGFyZW50IHx8ICFub2RlLnBhcmVudC50eXBlKSAmJiAobm9kZS50ZXh0IHx8ICcnKS5zdGFydHNXaXRoKCfinqYnKSkge1xuICAgICAgICBub2RlLnRleHQgPSAn4p6mJztcbiAgICAgICAgZGVsZXRlIG5vZGUuY2hpbGRyZW47XG4gICAgICAgIGRlbGV0ZSBub2RlLmRhdGE7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChub2RlLnR5cGUgPT0gJ0JSJykge1xuICAgICAgbm9kZS50ZXh0ID0gJyAnO1xuICAgICAgZGVsZXRlIG5vZGUudHlwZTtcbiAgICAgIGRlbGV0ZSBub2RlLmNoaWxkcmVuO1xuICAgIH1cbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuXG4gIGxldCB0cmVlID0gZHJhZnR5VG9UcmVlKG9yaWdpbmFsKTtcbiAgaWYgKCF0cmVlKSB7XG4gICAgcmV0dXJuIG9yaWdpbmFsO1xuICB9XG5cbiAgLy8gU3RyaXAgbGVhZGluZyBtZW50aW9uLlxuICB0cmVlID0gdHJlZVRvcERvd24odHJlZSwgY29udk1OblFRbkJSKTtcbiAgLy8gTW92ZSBhdHRhY2htZW50cyB0byB0aGUgZW5kIG9mIHRoZSBkb2MuXG4gIHRyZWUgPSBhdHRhY2htZW50c1RvRW5kKHRyZWUsIE1BWF9QUkVWSUVXX0FUVEFDSE1FTlRTKTtcbiAgLy8gU2hvcnRlbiB0aGUgZG9jLlxuICB0cmVlID0gc2hvcnRlblRyZWUodHJlZSwgbGltaXQsICfigKYnKTtcbiAgLy8gU3RyaXAgaGVhdnkgZWxlbWVudHMgZXhjZXB0IElNLmRhdGFbJ3ZhbCddIChoYXZlIHRvIGtlZXAgdGhlbSB0byBnZW5lcmF0ZSBwcmV2aWV3cyBsYXRlcikuXG4gIHRyZWUgPSBsaWdodEVudGl0eSh0cmVlLCBub2RlID0+IChub2RlLnR5cGUgPT0gJ0lNJyA/IFsndmFsJ10gOiBudWxsKSk7XG4gIC8vIENvbnZlcnQgYmFjayB0byBEcmFmdHkuXG4gIHJldHVybiB0cmVlVG9EcmFmdHkoe30sIHRyZWUsIFtdKTtcbn1cblxuXG4vKipcbiAqIEdlbmVyYXRlIGRyYWZ0eSBwcmV2aWV3OlxuICogIC0gU2hvcnRlbiB0aGUgZG9jdW1lbnQuXG4gKiAgLSBTdHJpcCBhbGwgaGVhdnkgZW50aXR5IGRhdGEgbGVhdmluZyBqdXN0IGlubGluZSBzdHlsZXMgYW5kIGVudGl0eSByZWZlcmVuY2VzLlxuICogIC0gUmVwbGFjZSBsaW5lIGJyZWFrcyB3aXRoIHNwYWNlcy5cbiAqICAtIFJlcGxhY2UgY29udGVudCBvZiBRUSB3aXRoIGEgc3BhY2UuXG4gKiAgLSBSZXBsYWNlIGZvcndhcmRpbmcgbWVudGlvbiB3aXRoIHN5bWJvbCAn4p6mJy5cbiAqIG1vdmUgYWxsIGF0dGFjaG1lbnRzIHRvIHRoZSBlbmQgb2YgdGhlIGRvY3VtZW50IGFuZCBtYWtlIHRoZW0gdmlzaWJsZS5cbiAqIFRoZSA8Y29kZT5jb250ZXh0PC9jb2RlPiBtYXkgZXhwb3NlIGEgZnVuY3Rpb24gPGNvZGU+Z2V0Rm9ybWF0dGVyKHN0eWxlKTwvY29kZT4uIElmIGl0J3MgYXZhaWxhYmxlXG4gKiBpdCB3aWxsIGNhbGwgaXQgdG8gb2J0YWluIGEgPGNvZGU+Zm9ybWF0dGVyPC9jb2RlPiBmb3IgYSBzdWJ0cmVlIG9mIHN0eWxlcyB1bmRlciB0aGUgPGNvZGU+c3R5bGU8L2NvZGU+LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fHN0cmluZ30gb3JpZ2luYWwgLSBEcmFmdHkgb2JqZWN0IHRvIHNob3J0ZW4uXG4gKiBAcGFyYW0ge251bWJlcn0gbGltaXQgLSBsZW5ndGggaW4gY2hhcmFjdGVycyB0byBzaG9ydGVuIHRvLlxuICogQHBhcmFtIHtib29sZWFufSBmb3J3YXJkaW5nIC0gdGhpcyBhIGZvcndhcmRpbmcgbWVzc2FnZSBwcmV2aWV3LlxuICogQHJldHVybnMgbmV3IHNob3J0ZW5lZCBEcmFmdHkgb2JqZWN0IGxlYXZpbmcgdGhlIG9yaWdpbmFsIGludGFjdC5cbiAqL1xuRHJhZnR5LnByZXZpZXcgPSBmdW5jdGlvbihvcmlnaW5hbCwgbGltaXQsIGZvcndhcmRpbmcpIHtcbiAgbGV0IHRyZWUgPSBkcmFmdHlUb1RyZWUob3JpZ2luYWwpO1xuXG4gIC8vIE1vdmUgYXR0YWNobWVudHMgdG8gdGhlIGVuZC5cbiAgdHJlZSA9IGF0dGFjaG1lbnRzVG9FbmQodHJlZSwgTUFYX1BSRVZJRVdfQVRUQUNITUVOVFMpO1xuXG4gIC8vIENvbnZlcnQgbGVhZGluZyBtZW50aW9uIHRvICfinqYnIGFuZCByZXBsYWNlIFFRIGFuZCBCUiB3aXRoIGEgc3BhY2UgJyAnLlxuICBjb25zdCBjb252TU5uUVFuQlIgPSBmdW5jdGlvbihub2RlKSB7XG4gICAgaWYgKG5vZGUudHlwZSA9PSAnTU4nKSB7XG4gICAgICBpZiAoKCFub2RlLnBhcmVudCB8fCAhbm9kZS5wYXJlbnQudHlwZSkgJiYgKG5vZGUudGV4dCB8fCAnJykuc3RhcnRzV2l0aCgn4p6mJykpIHtcbiAgICAgICAgbm9kZS50ZXh0ID0gJ+Kepic7XG4gICAgICAgIGRlbGV0ZSBub2RlLmNoaWxkcmVuO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAobm9kZS50eXBlID09ICdRUScpIHtcbiAgICAgIG5vZGUudGV4dCA9ICcgJztcbiAgICAgIGRlbGV0ZSBub2RlLmNoaWxkcmVuO1xuICAgIH0gZWxzZSBpZiAobm9kZS50eXBlID09ICdCUicpIHtcbiAgICAgIG5vZGUudGV4dCA9ICcgJztcbiAgICAgIGRlbGV0ZSBub2RlLmNoaWxkcmVuO1xuICAgICAgZGVsZXRlIG5vZGUudHlwZTtcbiAgICB9XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cbiAgdHJlZSA9IHRyZWVUb3BEb3duKHRyZWUsIGNvbnZNTm5RUW5CUik7XG5cbiAgdHJlZSA9IHNob3J0ZW5UcmVlKHRyZWUsIGxpbWl0LCAn4oCmJyk7XG4gIGlmIChmb3J3YXJkaW5nKSB7XG4gICAgLy8gS2VlcCBJTSBkYXRhIGZvciBwcmV2aWV3LlxuICAgIHRyZWUgPSBsaWdodEVudGl0eSh0cmVlLCBub2RlID0+IChub2RlLnR5cGUgPT0gJ0lNJyA/IFsndmFsJ10gOiBudWxsKSk7XG4gIH0gZWxzZSB7XG4gICAgdHJlZSA9IGxpZ2h0RW50aXR5KHRyZWUpO1xuICB9XG5cbiAgLy8gQ29udmVydCBiYWNrIHRvIERyYWZ0eS5cbiAgcmV0dXJuIHRyZWVUb0RyYWZ0eSh7fSwgdHJlZSwgW10pO1xufVxuXG4vKipcbiAqIEdpdmVuIERyYWZ0eSBkb2N1bWVudCwgY29udmVydCBpdCB0byBwbGFpbiB0ZXh0LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fSBjb250ZW50IC0gZG9jdW1lbnQgdG8gY29udmVydCB0byBwbGFpbiB0ZXh0LlxuICogQHJldHVybnMge3N0cmluZ30gcGxhaW4tdGV4dCByZXByZXNlbnRhdGlvbiBvZiB0aGUgZHJhZnR5IGRvY3VtZW50LlxuICovXG5EcmFmdHkudG9QbGFpblRleHQgPSBmdW5jdGlvbihjb250ZW50KSB7XG4gIHJldHVybiB0eXBlb2YgY29udGVudCA9PSAnc3RyaW5nJyA/IGNvbnRlbnQgOiBjb250ZW50LnR4dDtcbn1cblxuLyoqXG4gKiBDaGVjayBpZiB0aGUgZG9jdW1lbnQgaGFzIG5vIG1hcmt1cCBhbmQgbm8gZW50aXRpZXMuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGNvbnRlbnQgLSBjb250ZW50IHRvIGNoZWNrIGZvciBwcmVzZW5jZSBvZiBtYXJrdXAuXG4gKiBAcmV0dXJucyA8Y29kZT50cnVlPC9jb2RlPiBpcyBjb250ZW50IGlzIHBsYWluIHRleHQsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gKi9cbkRyYWZ0eS5pc1BsYWluVGV4dCA9IGZ1bmN0aW9uKGNvbnRlbnQpIHtcbiAgcmV0dXJuIHR5cGVvZiBjb250ZW50ID09ICdzdHJpbmcnIHx8ICEoY29udGVudC5mbXQgfHwgY29udGVudC5lbnQpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiB0aGUgb2JqZWN0IHJlcHJlc2V0cyBpcyBhIHZhbGlkIERyYWZ0eSBkb2N1bWVudC5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eX0gY29udGVudCAtIGNvbnRlbnQgdG8gY2hlY2sgZm9yIHZhbGlkaXR5LlxuICogQHJldHVybnMgPGNvZGU+dHJ1ZTwvY29kZT4gaXMgY29udGVudCBpcyB2YWxpZCwgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAqL1xuRHJhZnR5LmlzVmFsaWQgPSBmdW5jdGlvbihjb250ZW50KSB7XG4gIGlmICghY29udGVudCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IHtcbiAgICB0eHQsXG4gICAgZm10LFxuICAgIGVudFxuICB9ID0gY29udGVudDtcblxuICBpZiAoIXR4dCAmJiB0eHQgIT09ICcnICYmICFmbXQgJiYgIWVudCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IHR4dF90eXBlID0gdHlwZW9mIHR4dDtcbiAgaWYgKHR4dF90eXBlICE9ICdzdHJpbmcnICYmIHR4dF90eXBlICE9ICd1bmRlZmluZWQnICYmIHR4dCAhPT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgZm10ICE9ICd1bmRlZmluZWQnICYmICFBcnJheS5pc0FycmF5KGZtdCkgJiYgZm10ICE9PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBlbnQgIT0gJ3VuZGVmaW5lZCcgJiYgIUFycmF5LmlzQXJyYXkoZW50KSAmJiBlbnQgIT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8qKlxuICogQ2hlY2sgaWYgdGhlIGRyYWZ0eSBkb2N1bWVudCBoYXMgYXR0YWNobWVudHM6IHN0eWxlIEVYIGFuZCBvdXRzaWRlIG9mIG5vcm1hbCByZW5kZXJpbmcgZmxvdyxcbiAqIGkuZS4gPGNvZGU+YXQgPSAtMTwvY29kZT4uXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGNvbnRlbnQgLSBkb2N1bWVudCB0byBjaGVjayBmb3IgYXR0YWNobWVudHMuXG4gKiBAcmV0dXJucyA8Y29kZT50cnVlPC9jb2RlPiBpZiB0aGVyZSBhcmUgYXR0YWNobWVudHMuXG4gKi9cbkRyYWZ0eS5oYXNBdHRhY2htZW50cyA9IGZ1bmN0aW9uKGNvbnRlbnQpIHtcbiAgaWYgKCFBcnJheS5pc0FycmF5KGNvbnRlbnQuZm10KSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBmb3IgKGxldCBpIGluIGNvbnRlbnQuZm10KSB7XG4gICAgY29uc3QgZm10ID0gY29udGVudC5mbXRbaV07XG4gICAgaWYgKGZtdCAmJiBmbXQuYXQgPCAwKSB7XG4gICAgICBjb25zdCBlbnQgPSBjb250ZW50LmVudFtmbXQua2V5IHwgMF07XG4gICAgICByZXR1cm4gZW50ICYmIGVudC50cCA9PSAnRVgnICYmIGVudC5kYXRhO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogQ2FsbGJhY2sgZm9yIGFwcGx5aW5nIGN1c3RvbSBmb3JtYXR0aW5nL3RyYW5zZm9ybWF0aW9uIHRvIGEgRHJhZnR5IGRvY3VtZW50LlxuICogQ2FsbGVkIG9uY2UgZm9yIGVhY2ggZW50aXR5LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBjYWxsYmFjayBFbnRpdHlDYWxsYmFja1xuICogQHBhcmFtIHtPYmplY3R9IGRhdGEgZW50aXR5IGRhdGEuXG4gKiBAcGFyYW0ge3N0cmluZ30gZW50aXR5IHR5cGUuXG4gKiBAcGFyYW0ge251bWJlcn0gaW5kZXggZW50aXR5J3MgaW5kZXggaW4gYGNvbnRlbnQuZW50YC5cbiAqL1xuXG4vKipcbiAqIEVudW1lcmF0ZSBhdHRhY2htZW50czogc3R5bGUgRVggYW5kIG91dHNpZGUgb2Ygbm9ybWFsIHJlbmRlcmluZyBmbG93LCBpLmUuIDxjb2RlPmF0ID0gLTE8L2NvZGU+LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fSBjb250ZW50IC0gZG9jdW1lbnQgdG8gcHJvY2VzcyBmb3IgYXR0YWNobWVudHMuXG4gKiBAcGFyYW0ge0VudGl0eUNhbGxiYWNrfSBjYWxsYmFjayAtIGNhbGxiYWNrIHRvIGNhbGwgZm9yIGVhY2ggYXR0YWNobWVudC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZXh0IC0gdmFsdWUgb2YgXCJ0aGlzXCIgZm9yIGNhbGxiYWNrLlxuICovXG5EcmFmdHkuYXR0YWNobWVudHMgPSBmdW5jdGlvbihjb250ZW50LCBjYWxsYmFjaywgY29udGV4dCkge1xuICBpZiAoIUFycmF5LmlzQXJyYXkoY29udGVudC5mbXQpKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGxldCBpID0gMDtcbiAgY29udGVudC5mbXQuZm9yRWFjaChmbXQgPT4ge1xuICAgIGlmIChmbXQgJiYgZm10LmF0IDwgMCkge1xuICAgICAgY29uc3QgZW50ID0gY29udGVudC5lbnRbZm10LmtleSB8IDBdO1xuICAgICAgaWYgKGVudCAmJiBlbnQudHAgPT0gJ0VYJyAmJiBlbnQuZGF0YSkge1xuICAgICAgICBjYWxsYmFjay5jYWxsKGNvbnRleHQsIGVudC5kYXRhLCBpKyssICdFWCcpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59XG5cbi8qKlxuICogQ2hlY2sgaWYgdGhlIGRyYWZ0eSBkb2N1bWVudCBoYXMgZW50aXRpZXMuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGNvbnRlbnQgLSBkb2N1bWVudCB0byBjaGVjayBmb3IgZW50aXRpZXMuXG4gKiBAcmV0dXJucyA8Y29kZT50cnVlPC9jb2RlPiBpZiB0aGVyZSBhcmUgZW50aXRpZXMuXG4gKi9cbkRyYWZ0eS5oYXNFbnRpdGllcyA9IGZ1bmN0aW9uKGNvbnRlbnQpIHtcbiAgcmV0dXJuIGNvbnRlbnQuZW50ICYmIGNvbnRlbnQuZW50Lmxlbmd0aCA+IDA7XG59XG5cbi8qKlxuICogRW51bWVyYXRlIGVudGl0aWVzLlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fSBjb250ZW50IC0gZG9jdW1lbnQgd2l0aCBlbnRpdGllcyB0byBlbnVtZXJhdGUuXG4gKiBAcGFyYW0ge0VudGl0eUNhbGxiYWNrfSBjYWxsYmFjayAtIGNhbGxiYWNrIHRvIGNhbGwgZm9yIGVhY2ggZW50aXR5LlxuICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHQgLSB2YWx1ZSBvZiBcInRoaXNcIiBmb3IgY2FsbGJhY2suXG4gKi9cbkRyYWZ0eS5lbnRpdGllcyA9IGZ1bmN0aW9uKGNvbnRlbnQsIGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gIGlmIChjb250ZW50LmVudCAmJiBjb250ZW50LmVudC5sZW5ndGggPiAwKSB7XG4gICAgZm9yIChsZXQgaSBpbiBjb250ZW50LmVudCkge1xuICAgICAgaWYgKGNvbnRlbnQuZW50W2ldKSB7XG4gICAgICAgIGNhbGxiYWNrLmNhbGwoY29udGV4dCwgY29udGVudC5lbnRbaV0uZGF0YSwgaSwgY29udGVudC5lbnRbaV0udHApO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFJlbW92ZSB1bnJlY29nbml6ZWQgZmllbGRzIGZyb20gZW50aXR5IGRhdGFcbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eX0gY29udGVudCAtIGRvY3VtZW50IHdpdGggZW50aXRpZXMgdG8gZW51bWVyYXRlLlxuICogQHJldHVybnMgY29udGVudC5cbiAqL1xuRHJhZnR5LnNhbml0aXplRW50aXRpZXMgPSBmdW5jdGlvbihjb250ZW50KSB7XG4gIGlmIChjb250ZW50ICYmIGNvbnRlbnQuZW50ICYmIGNvbnRlbnQuZW50Lmxlbmd0aCA+IDApIHtcbiAgICBmb3IgKGxldCBpIGluIGNvbnRlbnQuZW50KSB7XG4gICAgICBjb25zdCBlbnQgPSBjb250ZW50LmVudFtpXTtcbiAgICAgIGlmIChlbnQgJiYgZW50LmRhdGEpIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IGNvcHlFbnREYXRhKGVudC5kYXRhKTtcbiAgICAgICAgaWYgKGRhdGEpIHtcbiAgICAgICAgICBjb250ZW50LmVudFtpXS5kYXRhID0gZGF0YTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkZWxldGUgY29udGVudC5lbnRbaV0uZGF0YTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gY29udGVudDtcbn1cblxuLyoqXG4gKiBHaXZlbiB0aGUgZW50aXR5LCBnZXQgVVJMIHdoaWNoIGNhbiBiZSB1c2VkIGZvciBkb3dubG9hZGluZ1xuICogZW50aXR5IGRhdGEuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGVudERhdGEgLSBlbnRpdHkuZGF0YSB0byBnZXQgdGhlIFVSbCBmcm9tLlxuICogQHJldHVybnMge3N0cmluZ30gVVJMIHRvIGRvd25sb2FkIGVudGl0eSBkYXRhIG9yIDxjb2RlPm51bGw8L2NvZGU+LlxuICovXG5EcmFmdHkuZ2V0RG93bmxvYWRVcmwgPSBmdW5jdGlvbihlbnREYXRhKSB7XG4gIGxldCB1cmwgPSBudWxsO1xuICBpZiAoZW50RGF0YS5taW1lICE9IEpTT05fTUlNRV9UWVBFICYmIGVudERhdGEudmFsKSB7XG4gICAgdXJsID0gYmFzZTY0dG9PYmplY3RVcmwoZW50RGF0YS52YWwsIGVudERhdGEubWltZSwgRHJhZnR5LmxvZ2dlcik7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGVudERhdGEucmVmID09ICdzdHJpbmcnKSB7XG4gICAgdXJsID0gZW50RGF0YS5yZWY7XG4gIH1cbiAgcmV0dXJuIHVybDtcbn1cblxuLyoqXG4gKiBDaGVjayBpZiB0aGUgZW50aXR5IGRhdGEgaXMgbm90IHJlYWR5IGZvciBzZW5kaW5nLCBzdWNoIGFzIGJlaW5nIHVwbG9hZGVkIHRvIHRoZSBzZXJ2ZXIuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGVudGl0eS5kYXRhIHRvIGdldCB0aGUgVVJsIGZyb20uXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiB1cGxvYWQgaXMgaW4gcHJvZ3Jlc3MsIGZhbHNlIG90aGVyd2lzZS5cbiAqL1xuRHJhZnR5LmlzUHJvY2Vzc2luZyA9IGZ1bmN0aW9uKGVudERhdGEpIHtcbiAgcmV0dXJuICEhZW50RGF0YS5fcHJvY2Vzc2luZztcbn1cblxuLyoqXG4gKiBHaXZlbiB0aGUgZW50aXR5LCBnZXQgVVJMIHdoaWNoIGNhbiBiZSB1c2VkIGZvciBwcmV2aWV3aW5nXG4gKiB0aGUgZW50aXR5LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBlbnRpdHkuZGF0YSB0byBnZXQgdGhlIFVSbCBmcm9tLlxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9IHVybCBmb3IgcHJldmlld2luZyBvciBudWxsIGlmIG5vIHN1Y2ggdXJsIGlzIGF2YWlsYWJsZS5cbiAqL1xuRHJhZnR5LmdldFByZXZpZXdVcmwgPSBmdW5jdGlvbihlbnREYXRhKSB7XG4gIHJldHVybiBlbnREYXRhLnZhbCA/IGJhc2U2NHRvT2JqZWN0VXJsKGVudERhdGEudmFsLCBlbnREYXRhLm1pbWUsIERyYWZ0eS5sb2dnZXIpIDogbnVsbDtcbn1cblxuLyoqXG4gKiBHZXQgYXBwcm94aW1hdGUgc2l6ZSBvZiB0aGUgZW50aXR5LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBlbnREYXRhIC0gZW50aXR5LmRhdGEgdG8gZ2V0IHRoZSBzaXplIGZvci5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IHNpemUgb2YgZW50aXR5IGRhdGEgaW4gYnl0ZXMuXG4gKi9cbkRyYWZ0eS5nZXRFbnRpdHlTaXplID0gZnVuY3Rpb24oZW50RGF0YSkge1xuICAvLyBFaXRoZXIgc2l6ZSBoaW50IG9yIGxlbmd0aCBvZiB2YWx1ZS4gVGhlIHZhbHVlIGlzIGJhc2U2NCBlbmNvZGVkLFxuICAvLyB0aGUgYWN0dWFsIG9iamVjdCBzaXplIGlzIHNtYWxsZXIgdGhhbiB0aGUgZW5jb2RlZCBsZW5ndGguXG4gIHJldHVybiBlbnREYXRhLnNpemUgPyBlbnREYXRhLnNpemUgOiBlbnREYXRhLnZhbCA/IChlbnREYXRhLnZhbC5sZW5ndGggKiAwLjc1KSB8IDAgOiAwO1xufVxuXG4vKipcbiAqIEdldCBlbnRpdHkgbWltZSB0eXBlLlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBlbnREYXRhIC0gZW50aXR5LmRhdGEgdG8gZ2V0IHRoZSB0eXBlIGZvci5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IG1pbWUgdHlwZSBvZiBlbnRpdHkuXG4gKi9cbkRyYWZ0eS5nZXRFbnRpdHlNaW1lVHlwZSA9IGZ1bmN0aW9uKGVudERhdGEpIHtcbiAgcmV0dXJuIGVudERhdGEubWltZSB8fCAndGV4dC9wbGFpbic7XG59XG5cbi8qKlxuICogR2V0IEhUTUwgdGFnIGZvciBhIGdpdmVuIHR3by1sZXR0ZXIgc3R5bGUgbmFtZS5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gc3R5bGUgLSB0d28tbGV0dGVyIHN0eWxlLCBsaWtlIFNUIG9yIExOLlxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9IEhUTUwgdGFnIG5hbWUgaWYgc3R5bGUgaXMgZm91bmQsICdfVU5LTicgaWYgbm90IGZvdW5kLCB7Y29kZTogdW5kZWZpbmVkfSBpZiBzdHlsZSBpcyBmYWxzaXNoLlxuICovXG5EcmFmdHkudGFnTmFtZSA9IGZ1bmN0aW9uKHN0eWxlKSB7XG4gIHJldHVybiBzdHlsZSA/IChIVE1MX1RBR1Nbc3R5bGVdID8gSFRNTF9UQUdTW3N0eWxlXS5uYW1lIDogJ19VTktOJykgOiB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogRm9yIGEgZ2l2ZW4gZGF0YSBidW5kbGUgZ2VuZXJhdGUgYW4gb2JqZWN0IHdpdGggSFRNTCBhdHRyaWJ1dGVzLFxuICogZm9yIGluc3RhbmNlLCBnaXZlbiB7dXJsOiBcImh0dHA6Ly93d3cuZXhhbXBsZS5jb20vXCJ9IHJldHVyblxuICoge2hyZWY6IFwiaHR0cDovL3d3dy5leGFtcGxlLmNvbS9cIn1cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gc3R5bGUgLSB0d28tbGV0dGVyIHN0eWxlIHRvIGdlbmVyYXRlIGF0dHJpYnV0ZXMgZm9yLlxuICogQHBhcmFtIHtPYmplY3R9IGRhdGEgLSBkYXRhIGJ1bmRsZSB0byBjb252ZXJ0IHRvIGF0dHJpYnV0ZXNcbiAqXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBvYmplY3Qgd2l0aCBIVE1MIGF0dHJpYnV0ZXMuXG4gKi9cbkRyYWZ0eS5hdHRyVmFsdWUgPSBmdW5jdGlvbihzdHlsZSwgZGF0YSkge1xuICBpZiAoZGF0YSAmJiBERUNPUkFUT1JTW3N0eWxlXSkge1xuICAgIHJldHVybiBERUNPUkFUT1JTW3N0eWxlXS5wcm9wcyhkYXRhKTtcbiAgfVxuXG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogRHJhZnR5IE1JTUUgdHlwZS5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBjb250ZW50LVR5cGUgXCJ0ZXh0L3gtZHJhZnR5XCIuXG4gKi9cbkRyYWZ0eS5nZXRDb250ZW50VHlwZSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gRFJBRlRZX01JTUVfVFlQRTtcbn1cblxuLy8gPT09PT09PT09PT09PT09PT1cbi8vIFV0aWxpdHkgbWV0aG9kcy5cbi8vID09PT09PT09PT09PT09PT09XG5cbi8vIFRha2UgYSBzdHJpbmcgYW5kIGRlZmluZWQgZWFybGllciBzdHlsZSBzcGFucywgcmUtY29tcG9zZSB0aGVtIGludG8gYSB0cmVlIHdoZXJlIGVhY2ggbGVhZiBpc1xuLy8gYSBzYW1lLXN0eWxlIChpbmNsdWRpbmcgdW5zdHlsZWQpIHN0cmluZy4gSS5lLiAnaGVsbG8gKmJvbGQgX2l0YWxpY18qIGFuZCB+bW9yZX4gd29ybGQnIC0+XG4vLyAoJ2hlbGxvICcsIChiOiAnYm9sZCAnLCAoaTogJ2l0YWxpYycpKSwgJyBhbmQgJywgKHM6ICdtb3JlJyksICcgd29ybGQnKTtcbi8vXG4vLyBUaGlzIGlzIG5lZWRlZCBpbiBvcmRlciB0byBjbGVhciBtYXJrdXAsIGkuZS4gJ2hlbGxvICp3b3JsZConIC0+ICdoZWxsbyB3b3JsZCcgYW5kIGNvbnZlcnRcbi8vIHJhbmdlcyBmcm9tIG1hcmt1cC1lZCBvZmZzZXRzIHRvIHBsYWluIHRleHQgb2Zmc2V0cy5cbmZ1bmN0aW9uIGNodW5raWZ5KGxpbmUsIHN0YXJ0LCBlbmQsIHNwYW5zKSB7XG4gIGNvbnN0IGNodW5rcyA9IFtdO1xuXG4gIGlmIChzcGFucy5sZW5ndGggPT0gMCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGZvciAobGV0IGkgaW4gc3BhbnMpIHtcbiAgICAvLyBHZXQgdGhlIG5leHQgY2h1bmsgZnJvbSB0aGUgcXVldWVcbiAgICBjb25zdCBzcGFuID0gc3BhbnNbaV07XG5cbiAgICAvLyBHcmFiIHRoZSBpbml0aWFsIHVuc3R5bGVkIGNodW5rXG4gICAgaWYgKHNwYW4uYXQgPiBzdGFydCkge1xuICAgICAgY2h1bmtzLnB1c2goe1xuICAgICAgICB0eHQ6IGxpbmUuc2xpY2Uoc3RhcnQsIHNwYW4uYXQpXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBHcmFiIHRoZSBzdHlsZWQgY2h1bmsuIEl0IG1heSBpbmNsdWRlIHN1YmNodW5rcy5cbiAgICBjb25zdCBjaHVuayA9IHtcbiAgICAgIHRwOiBzcGFuLnRwXG4gICAgfTtcbiAgICBjb25zdCBjaGxkID0gY2h1bmtpZnkobGluZSwgc3Bhbi5hdCArIDEsIHNwYW4uZW5kLCBzcGFuLmNoaWxkcmVuKTtcbiAgICBpZiAoY2hsZC5sZW5ndGggPiAwKSB7XG4gICAgICBjaHVuay5jaGlsZHJlbiA9IGNobGQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNodW5rLnR4dCA9IHNwYW4udHh0O1xuICAgIH1cbiAgICBjaHVua3MucHVzaChjaHVuayk7XG4gICAgc3RhcnQgPSBzcGFuLmVuZCArIDE7IC8vICcrMScgaXMgdG8gc2tpcCB0aGUgZm9ybWF0dGluZyBjaGFyYWN0ZXJcbiAgfVxuXG4gIC8vIEdyYWIgdGhlIHJlbWFpbmluZyB1bnN0eWxlZCBjaHVuaywgYWZ0ZXIgdGhlIGxhc3Qgc3BhblxuICBpZiAoc3RhcnQgPCBlbmQpIHtcbiAgICBjaHVua3MucHVzaCh7XG4gICAgICB0eHQ6IGxpbmUuc2xpY2Uoc3RhcnQsIGVuZClcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBjaHVua3M7XG59XG5cbi8vIERldGVjdCBzdGFydHMgYW5kIGVuZHMgb2YgZm9ybWF0dGluZyBzcGFucy4gVW5mb3JtYXR0ZWQgc3BhbnMgYXJlXG4vLyBpZ25vcmVkIGF0IHRoaXMgc3RhZ2UuXG5mdW5jdGlvbiBzcGFubmlmeShvcmlnaW5hbCwgcmVfc3RhcnQsIHJlX2VuZCwgdHlwZSkge1xuICBjb25zdCByZXN1bHQgPSBbXTtcbiAgbGV0IGluZGV4ID0gMDtcbiAgbGV0IGxpbmUgPSBvcmlnaW5hbC5zbGljZSgwKTsgLy8gbWFrZSBhIGNvcHk7XG5cbiAgd2hpbGUgKGxpbmUubGVuZ3RoID4gMCkge1xuICAgIC8vIG1hdGNoWzBdOyAvLyBtYXRjaCwgbGlrZSAnKmFiYyonXG4gICAgLy8gbWF0Y2hbMV07IC8vIG1hdGNoIGNhcHR1cmVkIGluIHBhcmVudGhlc2lzLCBsaWtlICdhYmMnXG4gICAgLy8gbWF0Y2hbJ2luZGV4J107IC8vIG9mZnNldCB3aGVyZSB0aGUgbWF0Y2ggc3RhcnRlZC5cblxuICAgIC8vIEZpbmQgdGhlIG9wZW5pbmcgdG9rZW4uXG4gICAgY29uc3Qgc3RhcnQgPSByZV9zdGFydC5leGVjKGxpbmUpO1xuICAgIGlmIChzdGFydCA9PSBudWxsKSB7XG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICAvLyBCZWNhdXNlIGphdmFzY3JpcHQgUmVnRXhwIGRvZXMgbm90IHN1cHBvcnQgbG9va2JlaGluZCwgdGhlIGFjdHVhbCBvZmZzZXQgbWF5IG5vdCBwb2ludFxuICAgIC8vIGF0IHRoZSBtYXJrdXAgY2hhcmFjdGVyLiBGaW5kIGl0IGluIHRoZSBtYXRjaGVkIHN0cmluZy5cbiAgICBsZXQgc3RhcnRfb2Zmc2V0ID0gc3RhcnRbJ2luZGV4J10gKyBzdGFydFswXS5sYXN0SW5kZXhPZihzdGFydFsxXSk7XG4gICAgLy8gQ2xpcCB0aGUgcHJvY2Vzc2VkIHBhcnQgb2YgdGhlIHN0cmluZy5cbiAgICBsaW5lID0gbGluZS5zbGljZShzdGFydF9vZmZzZXQgKyAxKTtcbiAgICAvLyBzdGFydF9vZmZzZXQgaXMgYW4gb2Zmc2V0IHdpdGhpbiB0aGUgY2xpcHBlZCBzdHJpbmcuIENvbnZlcnQgdG8gb3JpZ2luYWwgaW5kZXguXG4gICAgc3RhcnRfb2Zmc2V0ICs9IGluZGV4O1xuICAgIC8vIEluZGV4IG5vdyBwb2ludCB0byB0aGUgYmVnaW5uaW5nIG9mICdsaW5lJyB3aXRoaW4gdGhlICdvcmlnaW5hbCcgc3RyaW5nLlxuICAgIGluZGV4ID0gc3RhcnRfb2Zmc2V0ICsgMTtcblxuICAgIC8vIEZpbmQgdGhlIG1hdGNoaW5nIGNsb3NpbmcgdG9rZW4uXG4gICAgY29uc3QgZW5kID0gcmVfZW5kID8gcmVfZW5kLmV4ZWMobGluZSkgOiBudWxsO1xuICAgIGlmIChlbmQgPT0gbnVsbCkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGxldCBlbmRfb2Zmc2V0ID0gZW5kWydpbmRleCddICsgZW5kWzBdLmluZGV4T2YoZW5kWzFdKTtcbiAgICAvLyBDbGlwIHRoZSBwcm9jZXNzZWQgcGFydCBvZiB0aGUgc3RyaW5nLlxuICAgIGxpbmUgPSBsaW5lLnNsaWNlKGVuZF9vZmZzZXQgKyAxKTtcbiAgICAvLyBVcGRhdGUgb2Zmc2V0c1xuICAgIGVuZF9vZmZzZXQgKz0gaW5kZXg7XG4gICAgLy8gSW5kZXggbm93IHBvaW50cyB0byB0aGUgYmVnaW5uaW5nIG9mICdsaW5lJyB3aXRoaW4gdGhlICdvcmlnaW5hbCcgc3RyaW5nLlxuICAgIGluZGV4ID0gZW5kX29mZnNldCArIDE7XG5cbiAgICByZXN1bHQucHVzaCh7XG4gICAgICB0eHQ6IG9yaWdpbmFsLnNsaWNlKHN0YXJ0X29mZnNldCArIDEsIGVuZF9vZmZzZXQpLFxuICAgICAgY2hpbGRyZW46IFtdLFxuICAgICAgYXQ6IHN0YXJ0X29mZnNldCxcbiAgICAgIGVuZDogZW5kX29mZnNldCxcbiAgICAgIHRwOiB0eXBlXG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vLyBDb252ZXJ0IGxpbmVhciBhcnJheSBvciBzcGFucyBpbnRvIGEgdHJlZSByZXByZXNlbnRhdGlvbi5cbi8vIEtlZXAgc3RhbmRhbG9uZSBhbmQgbmVzdGVkIHNwYW5zLCB0aHJvdyBhd2F5IHBhcnRpYWxseSBvdmVybGFwcGluZyBzcGFucy5cbmZ1bmN0aW9uIHRvU3BhblRyZWUoc3BhbnMpIHtcbiAgaWYgKHNwYW5zLmxlbmd0aCA9PSAwKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgY29uc3QgdHJlZSA9IFtzcGFuc1swXV07XG4gIGxldCBsYXN0ID0gc3BhbnNbMF07XG4gIGZvciAobGV0IGkgPSAxOyBpIDwgc3BhbnMubGVuZ3RoOyBpKyspIHtcbiAgICAvLyBLZWVwIHNwYW5zIHdoaWNoIHN0YXJ0IGFmdGVyIHRoZSBlbmQgb2YgdGhlIHByZXZpb3VzIHNwYW4gb3IgdGhvc2Ugd2hpY2hcbiAgICAvLyBhcmUgY29tcGxldGUgd2l0aGluIHRoZSBwcmV2aW91cyBzcGFuLlxuICAgIGlmIChzcGFuc1tpXS5hdCA+IGxhc3QuZW5kKSB7XG4gICAgICAvLyBTcGFuIGlzIGNvbXBsZXRlbHkgb3V0c2lkZSBvZiB0aGUgcHJldmlvdXMgc3Bhbi5cbiAgICAgIHRyZWUucHVzaChzcGFuc1tpXSk7XG4gICAgICBsYXN0ID0gc3BhbnNbaV07XG4gICAgfSBlbHNlIGlmIChzcGFuc1tpXS5lbmQgPD0gbGFzdC5lbmQpIHtcbiAgICAgIC8vIFNwYW4gaXMgZnVsbHkgaW5zaWRlIG9mIHRoZSBwcmV2aW91cyBzcGFuLiBQdXNoIHRvIHN1Ym5vZGUuXG4gICAgICBsYXN0LmNoaWxkcmVuLnB1c2goc3BhbnNbaV0pO1xuICAgIH1cbiAgICAvLyBTcGFuIGNvdWxkIHBhcnRpYWxseSBvdmVybGFwLCBpZ25vcmluZyBpdCBhcyBpbnZhbGlkLlxuICB9XG5cbiAgLy8gUmVjdXJzaXZlbHkgcmVhcnJhbmdlIHRoZSBzdWJub2Rlcy5cbiAgZm9yIChsZXQgaSBpbiB0cmVlKSB7XG4gICAgdHJlZVtpXS5jaGlsZHJlbiA9IHRvU3BhblRyZWUodHJlZVtpXS5jaGlsZHJlbik7XG4gIH1cblxuICByZXR1cm4gdHJlZTtcbn1cblxuLy8gQ29udmVydCBkcmFmdHkgZG9jdW1lbnQgdG8gYSB0cmVlLlxuZnVuY3Rpb24gZHJhZnR5VG9UcmVlKGRvYykge1xuICBpZiAoIWRvYykge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgZG9jID0gKHR5cGVvZiBkb2MgPT0gJ3N0cmluZycpID8ge1xuICAgIHR4dDogZG9jXG4gIH0gOiBkb2M7XG4gIGxldCB7XG4gICAgdHh0LFxuICAgIGZtdCxcbiAgICBlbnRcbiAgfSA9IGRvYztcblxuICB0eHQgPSB0eHQgfHwgJyc7XG4gIGlmICghQXJyYXkuaXNBcnJheShlbnQpKSB7XG4gICAgZW50ID0gW107XG4gIH1cblxuICBpZiAoIUFycmF5LmlzQXJyYXkoZm10KSB8fCBmbXQubGVuZ3RoID09IDApIHtcbiAgICBpZiAoZW50Lmxlbmd0aCA9PSAwKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0ZXh0OiB0eHRcbiAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gSGFuZGxlIHNwZWNpYWwgY2FzZSB3aGVuIGFsbCB2YWx1ZXMgaW4gZm10IGFyZSAwIGFuZCBmbXQgdGhlcmVmb3JlIGlzIHNraXBwZWQuXG4gICAgZm10ID0gW3tcbiAgICAgIGF0OiAwLFxuICAgICAgbGVuOiAwLFxuICAgICAga2V5OiAwXG4gICAgfV07XG4gIH1cblxuICAvLyBTYW5pdGl6ZSBzcGFucy5cbiAgY29uc3Qgc3BhbnMgPSBbXTtcbiAgY29uc3QgYXR0YWNobWVudHMgPSBbXTtcbiAgZm10LmZvckVhY2goKHNwYW4pID0+IHtcbiAgICBpZiAoIXNwYW4gfHwgdHlwZW9mIHNwYW4gIT0gJ29iamVjdCcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIVsndW5kZWZpbmVkJywgJ251bWJlciddLmluY2x1ZGVzKHR5cGVvZiBzcGFuLmF0KSkge1xuICAgICAgLy8gUHJlc2VudCwgYnV0IG5vbi1udW1lcmljICdhdCcuXG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghWyd1bmRlZmluZWQnLCAnbnVtYmVyJ10uaW5jbHVkZXModHlwZW9mIHNwYW4ubGVuKSkge1xuICAgICAgLy8gUHJlc2VudCwgYnV0IG5vbi1udW1lcmljICdsZW4nLlxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBsZXQgYXQgPSBzcGFuLmF0IHwgMDtcbiAgICBsZXQgbGVuID0gc3Bhbi5sZW4gfCAwO1xuICAgIGlmIChsZW4gPCAwKSB7XG4gICAgICAvLyBJbnZhbGlkIHNwYW4gbGVuZ3RoLlxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBrZXkgPSBzcGFuLmtleSB8fCAwO1xuICAgIGlmIChlbnQubGVuZ3RoID4gMCAmJiAodHlwZW9mIGtleSAhPSAnbnVtYmVyJyB8fCBrZXkgPCAwIHx8IGtleSA+PSBlbnQubGVuZ3RoKSkge1xuICAgICAgLy8gSW52YWxpZCBrZXkgdmFsdWUuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGF0IDw9IC0xKSB7XG4gICAgICAvLyBBdHRhY2htZW50LiBTdG9yZSBhdHRhY2htZW50cyBzZXBhcmF0ZWx5LlxuICAgICAgYXR0YWNobWVudHMucHVzaCh7XG4gICAgICAgIHN0YXJ0OiAtMSxcbiAgICAgICAgZW5kOiAwLFxuICAgICAgICBrZXk6IGtleVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfSBlbHNlIGlmIChhdCArIGxlbiA+IHR4dC5sZW5ndGgpIHtcbiAgICAgIC8vIFNwYW4gaXMgb3V0IG9mIGJvdW5kcy5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIXNwYW4udHApIHtcbiAgICAgIGlmIChlbnQubGVuZ3RoID4gMCAmJiAodHlwZW9mIGVudFtrZXldID09ICdvYmplY3QnKSkge1xuICAgICAgICBzcGFucy5wdXNoKHtcbiAgICAgICAgICBzdGFydDogYXQsXG4gICAgICAgICAgZW5kOiBhdCArIGxlbixcbiAgICAgICAgICBrZXk6IGtleVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgc3BhbnMucHVzaCh7XG4gICAgICAgIHR5cGU6IHNwYW4udHAsXG4gICAgICAgIHN0YXJ0OiBhdCxcbiAgICAgICAgZW5kOiBhdCArIGxlblxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcblxuICAvLyBTb3J0IHNwYW5zIGZpcnN0IGJ5IHN0YXJ0IGluZGV4IChhc2MpIHRoZW4gYnkgbGVuZ3RoIChkZXNjKSwgdGhlbiBieSB3ZWlnaHQuXG4gIHNwYW5zLnNvcnQoKGEsIGIpID0+IHtcbiAgICBsZXQgZGlmZiA9IGEuc3RhcnQgLSBiLnN0YXJ0O1xuICAgIGlmIChkaWZmICE9IDApIHtcbiAgICAgIHJldHVybiBkaWZmO1xuICAgIH1cbiAgICBkaWZmID0gYi5lbmQgLSBhLmVuZDtcbiAgICBpZiAoZGlmZiAhPSAwKSB7XG4gICAgICByZXR1cm4gZGlmZjtcbiAgICB9XG4gICAgcmV0dXJuIEZNVF9XRUlHSFQuaW5kZXhPZihiLnR5cGUpIC0gRk1UX1dFSUdIVC5pbmRleE9mKGEudHlwZSk7XG4gIH0pO1xuXG4gIC8vIE1vdmUgYXR0YWNobWVudHMgdG8gdGhlIGVuZCBvZiB0aGUgbGlzdC5cbiAgaWYgKGF0dGFjaG1lbnRzLmxlbmd0aCA+IDApIHtcbiAgICBzcGFucy5wdXNoKC4uLmF0dGFjaG1lbnRzKTtcbiAgfVxuXG4gIHNwYW5zLmZvckVhY2goKHNwYW4pID0+IHtcbiAgICBpZiAoZW50Lmxlbmd0aCA+IDAgJiYgIXNwYW4udHlwZSAmJiBlbnRbc3Bhbi5rZXldICYmIHR5cGVvZiBlbnRbc3Bhbi5rZXldID09ICdvYmplY3QnKSB7XG4gICAgICBzcGFuLnR5cGUgPSBlbnRbc3Bhbi5rZXldLnRwO1xuICAgICAgc3Bhbi5kYXRhID0gZW50W3NwYW4ua2V5XS5kYXRhO1xuICAgIH1cblxuICAgIC8vIElzIHR5cGUgc3RpbGwgdW5kZWZpbmVkPyBIaWRlIHRoZSBpbnZhbGlkIGVsZW1lbnQhXG4gICAgaWYgKCFzcGFuLnR5cGUpIHtcbiAgICAgIHNwYW4udHlwZSA9ICdIRCc7XG4gICAgfVxuICB9KTtcblxuICBsZXQgdHJlZSA9IHNwYW5zVG9UcmVlKHt9LCB0eHQsIDAsIHR4dC5sZW5ndGgsIHNwYW5zKTtcblxuICAvLyBGbGF0dGVuIHRyZWUgbm9kZXMuXG4gIGNvbnN0IGZsYXR0ZW4gPSBmdW5jdGlvbihub2RlKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkobm9kZS5jaGlsZHJlbikgJiYgbm9kZS5jaGlsZHJlbi5sZW5ndGggPT0gMSkge1xuICAgICAgLy8gVW53cmFwLlxuICAgICAgY29uc3QgY2hpbGQgPSBub2RlLmNoaWxkcmVuWzBdO1xuICAgICAgaWYgKCFub2RlLnR5cGUpIHtcbiAgICAgICAgY29uc3QgcGFyZW50ID0gbm9kZS5wYXJlbnQ7XG4gICAgICAgIG5vZGUgPSBjaGlsZDtcbiAgICAgICAgbm9kZS5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgICB9IGVsc2UgaWYgKCFjaGlsZC50eXBlICYmICFjaGlsZC5jaGlsZHJlbikge1xuICAgICAgICBub2RlLnRleHQgPSBjaGlsZC50ZXh0O1xuICAgICAgICBkZWxldGUgbm9kZS5jaGlsZHJlbjtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cbiAgdHJlZSA9IHRyZWVUb3BEb3duKHRyZWUsIGZsYXR0ZW4pO1xuXG4gIHJldHVybiB0cmVlO1xufVxuXG4vLyBBZGQgdHJlZSBub2RlIHRvIGEgcGFyZW50IHRyZWUuXG5mdW5jdGlvbiBhZGROb2RlKHBhcmVudCwgbikge1xuICBpZiAoIW4pIHtcbiAgICByZXR1cm4gcGFyZW50O1xuICB9XG5cbiAgaWYgKCFwYXJlbnQuY2hpbGRyZW4pIHtcbiAgICBwYXJlbnQuY2hpbGRyZW4gPSBbXTtcbiAgfVxuXG4gIC8vIElmIHRleHQgaXMgcHJlc2VudCwgbW92ZSBpdCB0byBhIHN1Ym5vZGUuXG4gIGlmIChwYXJlbnQudGV4dCkge1xuICAgIHBhcmVudC5jaGlsZHJlbi5wdXNoKHtcbiAgICAgIHRleHQ6IHBhcmVudC50ZXh0LFxuICAgICAgcGFyZW50OiBwYXJlbnRcbiAgICB9KTtcbiAgICBkZWxldGUgcGFyZW50LnRleHQ7XG4gIH1cblxuICBuLnBhcmVudCA9IHBhcmVudDtcbiAgcGFyZW50LmNoaWxkcmVuLnB1c2gobik7XG5cbiAgcmV0dXJuIHBhcmVudDtcbn1cblxuLy8gUmV0dXJucyBhIHRyZWUgb2Ygbm9kZXMuXG5mdW5jdGlvbiBzcGFuc1RvVHJlZShwYXJlbnQsIHRleHQsIHN0YXJ0LCBlbmQsIHNwYW5zKSB7XG4gIGlmICghc3BhbnMgfHwgc3BhbnMubGVuZ3RoID09IDApIHtcbiAgICBpZiAoc3RhcnQgPCBlbmQpIHtcbiAgICAgIGFkZE5vZGUocGFyZW50LCB7XG4gICAgICAgIHRleHQ6IHRleHQuc3Vic3RyaW5nKHN0YXJ0LCBlbmQpXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHBhcmVudDtcbiAgfVxuXG4gIC8vIFByb2Nlc3Mgc3Vic3BhbnMuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc3BhbnMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBzcGFuID0gc3BhbnNbaV07XG4gICAgaWYgKHNwYW4uc3RhcnQgPCAwICYmIHNwYW4udHlwZSA9PSAnRVgnKSB7XG4gICAgICBhZGROb2RlKHBhcmVudCwge1xuICAgICAgICB0eXBlOiBzcGFuLnR5cGUsXG4gICAgICAgIGRhdGE6IHNwYW4uZGF0YSxcbiAgICAgICAga2V5OiBzcGFuLmtleSxcbiAgICAgICAgYXR0OiB0cnVlXG4gICAgICB9KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIEFkZCB1bi1zdHlsZWQgcmFuZ2UgYmVmb3JlIHRoZSBzdHlsZWQgc3BhbiBzdGFydHMuXG4gICAgaWYgKHN0YXJ0IDwgc3Bhbi5zdGFydCkge1xuICAgICAgYWRkTm9kZShwYXJlbnQsIHtcbiAgICAgICAgdGV4dDogdGV4dC5zdWJzdHJpbmcoc3RhcnQsIHNwYW4uc3RhcnQpXG4gICAgICB9KTtcbiAgICAgIHN0YXJ0ID0gc3Bhbi5zdGFydDtcbiAgICB9XG5cbiAgICAvLyBHZXQgYWxsIHNwYW5zIHdoaWNoIGFyZSB3aXRoaW4gdGhlIGN1cnJlbnQgc3Bhbi5cbiAgICBjb25zdCBzdWJzcGFucyA9IFtdO1xuICAgIHdoaWxlIChpIDwgc3BhbnMubGVuZ3RoIC0gMSkge1xuICAgICAgY29uc3QgaW5uZXIgPSBzcGFuc1tpICsgMV07XG4gICAgICBpZiAoaW5uZXIuc3RhcnQgPCAwKSB7XG4gICAgICAgIC8vIEF0dGFjaG1lbnRzIGFyZSBpbiB0aGUgZW5kLiBTdG9wLlxuICAgICAgICBicmVhaztcbiAgICAgIH0gZWxzZSBpZiAoaW5uZXIuc3RhcnQgPCBzcGFuLmVuZCkge1xuICAgICAgICBpZiAoaW5uZXIuZW5kIDw9IHNwYW4uZW5kKSB7XG4gICAgICAgICAgY29uc3QgdGFnID0gSFRNTF9UQUdTW2lubmVyLnRwXSB8fCB7fTtcbiAgICAgICAgICBpZiAoaW5uZXIuc3RhcnQgPCBpbm5lci5lbmQgfHwgdGFnLmlzVm9pZCkge1xuICAgICAgICAgICAgLy8gVmFsaWQgc3Vic3BhbjogY29tcGxldGVseSB3aXRoaW4gdGhlIGN1cnJlbnQgc3BhbiBhbmRcbiAgICAgICAgICAgIC8vIGVpdGhlciBub24temVybyBsZW5ndGggb3IgemVybyBsZW5ndGggaXMgYWNjZXB0YWJsZS5cbiAgICAgICAgICAgIHN1YnNwYW5zLnB1c2goaW5uZXIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpKys7XG4gICAgICAgIC8vIE92ZXJsYXBwaW5nIHN1YnNwYW5zIGFyZSBpZ25vcmVkLlxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gUGFzdCB0aGUgZW5kIG9mIHRoZSBjdXJyZW50IHNwYW4uIFN0b3AuXG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGFkZE5vZGUocGFyZW50LCBzcGFuc1RvVHJlZSh7XG4gICAgICB0eXBlOiBzcGFuLnR5cGUsXG4gICAgICBkYXRhOiBzcGFuLmRhdGEsXG4gICAgICBrZXk6IHNwYW4ua2V5XG4gICAgfSwgdGV4dCwgc3RhcnQsIHNwYW4uZW5kLCBzdWJzcGFucykpO1xuICAgIHN0YXJ0ID0gc3Bhbi5lbmQ7XG4gIH1cblxuICAvLyBBZGQgdGhlIGxhc3QgdW5mb3JtYXR0ZWQgcmFuZ2UuXG4gIGlmIChzdGFydCA8IGVuZCkge1xuICAgIGFkZE5vZGUocGFyZW50LCB7XG4gICAgICB0ZXh0OiB0ZXh0LnN1YnN0cmluZyhzdGFydCwgZW5kKVxuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIHBhcmVudDtcbn1cblxuLy8gQXBwZW5kIGEgdHJlZSB0byBhIERyYWZ0eSBkb2MuXG5mdW5jdGlvbiB0cmVlVG9EcmFmdHkoZG9jLCB0cmVlLCBrZXltYXApIHtcbiAgaWYgKCF0cmVlKSB7XG4gICAgcmV0dXJuIGRvYztcbiAgfVxuXG4gIGRvYy50eHQgPSBkb2MudHh0IHx8ICcnO1xuXG4gIC8vIENoZWNrcG9pbnQgdG8gbWVhc3VyZSBsZW5ndGggb2YgdGhlIGN1cnJlbnQgdHJlZSBub2RlLlxuICBjb25zdCBzdGFydCA9IGRvYy50eHQubGVuZ3RoO1xuXG4gIGlmICh0cmVlLnRleHQpIHtcbiAgICBkb2MudHh0ICs9IHRyZWUudGV4dDtcbiAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHRyZWUuY2hpbGRyZW4pKSB7XG4gICAgdHJlZS5jaGlsZHJlbi5mb3JFYWNoKChjKSA9PiB7XG4gICAgICB0cmVlVG9EcmFmdHkoZG9jLCBjLCBrZXltYXApO1xuICAgIH0pO1xuICB9XG5cbiAgaWYgKHRyZWUudHlwZSkge1xuICAgIGNvbnN0IGxlbiA9IGRvYy50eHQubGVuZ3RoIC0gc3RhcnQ7XG4gICAgZG9jLmZtdCA9IGRvYy5mbXQgfHwgW107XG4gICAgaWYgKE9iamVjdC5rZXlzKHRyZWUuZGF0YSB8fCB7fSkubGVuZ3RoID4gMCkge1xuICAgICAgZG9jLmVudCA9IGRvYy5lbnQgfHwgW107XG4gICAgICBjb25zdCBuZXdLZXkgPSAodHlwZW9mIGtleW1hcFt0cmVlLmtleV0gPT0gJ3VuZGVmaW5lZCcpID8gZG9jLmVudC5sZW5ndGggOiBrZXltYXBbdHJlZS5rZXldO1xuICAgICAga2V5bWFwW3RyZWUua2V5XSA9IG5ld0tleTtcbiAgICAgIGRvYy5lbnRbbmV3S2V5XSA9IHtcbiAgICAgICAgdHA6IHRyZWUudHlwZSxcbiAgICAgICAgZGF0YTogdHJlZS5kYXRhXG4gICAgICB9O1xuICAgICAgaWYgKHRyZWUuYXR0KSB7XG4gICAgICAgIC8vIEF0dGFjaG1lbnQuXG4gICAgICAgIGRvYy5mbXQucHVzaCh7XG4gICAgICAgICAgYXQ6IC0xLFxuICAgICAgICAgIGxlbjogMCxcbiAgICAgICAgICBrZXk6IG5ld0tleVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRvYy5mbXQucHVzaCh7XG4gICAgICAgICAgYXQ6IHN0YXJ0LFxuICAgICAgICAgIGxlbjogbGVuLFxuICAgICAgICAgIGtleTogbmV3S2V5XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBkb2MuZm10LnB1c2goe1xuICAgICAgICB0cDogdHJlZS50eXBlLFxuICAgICAgICBhdDogc3RhcnQsXG4gICAgICAgIGxlbjogbGVuXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRvYztcbn1cblxuLy8gVHJhdmVyc2UgdGhlIHRyZWUgdG9wIGRvd24gdHJhbnNmb3JtaW5nIHRoZSBub2RlczogYXBwbHkgdHJhbnNmb3JtZXIgdG8gZXZlcnkgdHJlZSBub2RlLlxuZnVuY3Rpb24gdHJlZVRvcERvd24oc3JjLCB0cmFuc2Zvcm1lciwgY29udGV4dCkge1xuICBpZiAoIXNyYykge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgbGV0IGRzdCA9IHRyYW5zZm9ybWVyLmNhbGwoY29udGV4dCwgc3JjKTtcbiAgaWYgKCFkc3QgfHwgIWRzdC5jaGlsZHJlbikge1xuICAgIHJldHVybiBkc3Q7XG4gIH1cblxuICBjb25zdCBjaGlsZHJlbiA9IFtdO1xuICBmb3IgKGxldCBpIGluIGRzdC5jaGlsZHJlbikge1xuICAgIGxldCBuID0gZHN0LmNoaWxkcmVuW2ldO1xuICAgIGlmIChuKSB7XG4gICAgICBuID0gdHJlZVRvcERvd24obiwgdHJhbnNmb3JtZXIsIGNvbnRleHQpO1xuICAgICAgaWYgKG4pIHtcbiAgICAgICAgY2hpbGRyZW4ucHVzaChuKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAoY2hpbGRyZW4ubGVuZ3RoID09IDApIHtcbiAgICBkc3QuY2hpbGRyZW4gPSBudWxsO1xuICB9IGVsc2Uge1xuICAgIGRzdC5jaGlsZHJlbiA9IGNoaWxkcmVuO1xuICB9XG5cbiAgcmV0dXJuIGRzdDtcbn1cblxuLy8gVHJhdmVyc2UgdGhlIHRyZWUgYm90dG9tLXVwOiBhcHBseSBmb3JtYXR0ZXIgdG8gZXZlcnkgbm9kZS5cbi8vIFRoZSBmb3JtYXR0ZXIgbXVzdCBtYWludGFpbiBpdHMgc3RhdGUgdGhyb3VnaCBjb250ZXh0LlxuZnVuY3Rpb24gdHJlZUJvdHRvbVVwKHNyYywgZm9ybWF0dGVyLCBpbmRleCwgc3RhY2ssIGNvbnRleHQpIHtcbiAgaWYgKCFzcmMpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGlmIChzdGFjayAmJiBzcmMudHlwZSkge1xuICAgIHN0YWNrLnB1c2goc3JjLnR5cGUpO1xuICB9XG5cbiAgbGV0IHZhbHVlcyA9IFtdO1xuICBmb3IgKGxldCBpIGluIHNyYy5jaGlsZHJlbikge1xuICAgIGNvbnN0IG4gPSB0cmVlQm90dG9tVXAoc3JjLmNoaWxkcmVuW2ldLCBmb3JtYXR0ZXIsIGksIHN0YWNrLCBjb250ZXh0KTtcbiAgICBpZiAobikge1xuICAgICAgdmFsdWVzLnB1c2gobik7XG4gICAgfVxuICB9XG4gIGlmICh2YWx1ZXMubGVuZ3RoID09IDApIHtcbiAgICBpZiAoc3JjLnRleHQpIHtcbiAgICAgIHZhbHVlcyA9IFtzcmMudGV4dF07XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbHVlcyA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgaWYgKHN0YWNrICYmIHNyYy50eXBlKSB7XG4gICAgc3RhY2sucG9wKCk7XG4gIH1cblxuICByZXR1cm4gZm9ybWF0dGVyLmNhbGwoY29udGV4dCwgc3JjLnR5cGUsIHNyYy5kYXRhLCB2YWx1ZXMsIGluZGV4LCBzdGFjayk7XG59XG5cbi8vIENsaXAgdHJlZSB0byB0aGUgcHJvdmlkZWQgbGltaXQuXG5mdW5jdGlvbiBzaG9ydGVuVHJlZSh0cmVlLCBsaW1pdCwgdGFpbCkge1xuICBpZiAoIXRyZWUpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGlmICh0YWlsKSB7XG4gICAgbGltaXQgLT0gdGFpbC5sZW5ndGg7XG4gIH1cblxuICBjb25zdCBzaG9ydGVuZXIgPSBmdW5jdGlvbihub2RlKSB7XG4gICAgaWYgKGxpbWl0IDw9IC0xKSB7XG4gICAgICAvLyBMaW1pdCAtMSBtZWFucyB0aGUgZG9jIHdhcyBhbHJlYWR5IGNsaXBwZWQuXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAobm9kZS5hdHQpIHtcbiAgICAgIC8vIEF0dGFjaG1lbnRzIGFyZSB1bmNoYW5nZWQuXG4gICAgICByZXR1cm4gbm9kZTtcbiAgICB9XG4gICAgaWYgKGxpbWl0ID09IDApIHtcbiAgICAgIG5vZGUudGV4dCA9IHRhaWw7XG4gICAgICBsaW1pdCA9IC0xO1xuICAgIH0gZWxzZSBpZiAobm9kZS50ZXh0KSB7XG4gICAgICBjb25zdCBsZW4gPSBub2RlLnRleHQubGVuZ3RoO1xuICAgICAgaWYgKGxlbiA+IGxpbWl0KSB7XG4gICAgICAgIG5vZGUudGV4dCA9IG5vZGUudGV4dC5zdWJzdHJpbmcoMCwgbGltaXQpICsgdGFpbDtcbiAgICAgICAgbGltaXQgPSAtMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxpbWl0IC09IGxlbjtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cblxuICByZXR1cm4gdHJlZVRvcERvd24odHJlZSwgc2hvcnRlbmVyKTtcbn1cblxuLy8gU3RyaXAgaGVhdnkgZW50aXRpZXMgZnJvbSBhIHRyZWUuXG5mdW5jdGlvbiBsaWdodEVudGl0eSh0cmVlLCBhbGxvdykge1xuICBjb25zdCBsaWdodENvcHkgPSAobm9kZSkgPT4ge1xuICAgIGNvbnN0IGRhdGEgPSBjb3B5RW50RGF0YShub2RlLmRhdGEsIHRydWUsIGFsbG93ID8gYWxsb3cobm9kZSkgOiBudWxsKTtcbiAgICBpZiAoZGF0YSkge1xuICAgICAgbm9kZS5kYXRhID0gZGF0YTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVsZXRlIG5vZGUuZGF0YTtcbiAgICB9XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cbiAgcmV0dXJuIHRyZWVUb3BEb3duKHRyZWUsIGxpZ2h0Q29weSk7XG59XG5cbi8vIFJlbW92ZSBzcGFjZXMgYW5kIGJyZWFrcyBvbiB0aGUgbGVmdC5cbmZ1bmN0aW9uIGxUcmltKHRyZWUpIHtcbiAgaWYgKHRyZWUudHlwZSA9PSAnQlInKSB7XG4gICAgdHJlZSA9IG51bGw7XG4gIH0gZWxzZSBpZiAodHJlZS50ZXh0KSB7XG4gICAgaWYgKCF0cmVlLnR5cGUpIHtcbiAgICAgIHRyZWUudGV4dCA9IHRyZWUudGV4dC50cmltU3RhcnQoKTtcbiAgICAgIGlmICghdHJlZS50ZXh0KSB7XG4gICAgICAgIHRyZWUgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIGlmICghdHJlZS50eXBlICYmIHRyZWUuY2hpbGRyZW4gJiYgdHJlZS5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgY29uc3QgYyA9IGxUcmltKHRyZWUuY2hpbGRyZW5bMF0pO1xuICAgIGlmIChjKSB7XG4gICAgICB0cmVlLmNoaWxkcmVuWzBdID0gYztcbiAgICB9IGVsc2Uge1xuICAgICAgdHJlZS5jaGlsZHJlbi5zaGlmdCgpO1xuICAgICAgaWYgKCF0cmVlLnR5cGUgJiYgdHJlZS5jaGlsZHJlbi5sZW5ndGggPT0gMCkge1xuICAgICAgICB0cmVlID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRyZWU7XG59XG5cbi8vIE1vdmUgYXR0YWNobWVudHMgdG8gdGhlIGVuZC4gQXR0YWNobWVudHMgbXVzdCBiZSBhdCB0aGUgdG9wIGxldmVsLCBubyBuZWVkIHRvIHRyYXZlcnNlIHRoZSB0cmVlLlxuZnVuY3Rpb24gYXR0YWNobWVudHNUb0VuZCh0cmVlLCBsaW1pdCkge1xuICBpZiAoIXRyZWUpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGlmICh0cmVlLmF0dCkge1xuICAgIHRyZWUudGV4dCA9ICcgJztcbiAgICBkZWxldGUgdHJlZS5hdHQ7XG4gICAgZGVsZXRlIHRyZWUuY2hpbGRyZW47XG4gIH0gZWxzZSBpZiAodHJlZS5jaGlsZHJlbikge1xuICAgIGNvbnN0IGF0dGFjaG1lbnRzID0gW107XG4gICAgY29uc3QgY2hpbGRyZW4gPSBbXTtcbiAgICBmb3IgKGxldCBpIGluIHRyZWUuY2hpbGRyZW4pIHtcbiAgICAgIGNvbnN0IGMgPSB0cmVlLmNoaWxkcmVuW2ldO1xuICAgICAgaWYgKGMuYXR0KSB7XG4gICAgICAgIGlmIChhdHRhY2htZW50cy5sZW5ndGggPT0gbGltaXQpIHtcbiAgICAgICAgICAvLyBUb28gbWFueSBhdHRhY2htZW50cyB0byBwcmV2aWV3O1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjLmRhdGFbJ21pbWUnXSA9PSBKU09OX01JTUVfVFlQRSkge1xuICAgICAgICAgIC8vIEpTT04gYXR0YWNobWVudHMgYXJlIG5vdCBzaG93biBpbiBwcmV2aWV3LlxuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZGVsZXRlIGMuYXR0O1xuICAgICAgICBkZWxldGUgYy5jaGlsZHJlbjtcbiAgICAgICAgYy50ZXh0ID0gJyAnO1xuICAgICAgICBhdHRhY2htZW50cy5wdXNoKGMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2hpbGRyZW4ucHVzaChjKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdHJlZS5jaGlsZHJlbiA9IGNoaWxkcmVuLmNvbmNhdChhdHRhY2htZW50cyk7XG4gIH1cbiAgcmV0dXJuIHRyZWU7XG59XG5cbi8vIEdldCBhIGxpc3Qgb2YgZW50aXRpZXMgZnJvbSBhIHRleHQuXG5mdW5jdGlvbiBleHRyYWN0RW50aXRpZXMobGluZSkge1xuICBsZXQgbWF0Y2g7XG4gIGxldCBleHRyYWN0ZWQgPSBbXTtcbiAgRU5USVRZX1RZUEVTLmZvckVhY2goKGVudGl0eSkgPT4ge1xuICAgIHdoaWxlICgobWF0Y2ggPSBlbnRpdHkucmUuZXhlYyhsaW5lKSkgIT09IG51bGwpIHtcbiAgICAgIGV4dHJhY3RlZC5wdXNoKHtcbiAgICAgICAgb2Zmc2V0OiBtYXRjaFsnaW5kZXgnXSxcbiAgICAgICAgbGVuOiBtYXRjaFswXS5sZW5ndGgsXG4gICAgICAgIHVuaXF1ZTogbWF0Y2hbMF0sXG4gICAgICAgIGRhdGE6IGVudGl0eS5wYWNrKG1hdGNoWzBdKSxcbiAgICAgICAgdHlwZTogZW50aXR5Lm5hbWVcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG5cbiAgaWYgKGV4dHJhY3RlZC5sZW5ndGggPT0gMCkge1xuICAgIHJldHVybiBleHRyYWN0ZWQ7XG4gIH1cblxuICAvLyBSZW1vdmUgZW50aXRpZXMgZGV0ZWN0ZWQgaW5zaWRlIG90aGVyIGVudGl0aWVzLCBsaWtlICNoYXNodGFnIGluIGEgVVJMLlxuICBleHRyYWN0ZWQuc29ydCgoYSwgYikgPT4ge1xuICAgIHJldHVybiBhLm9mZnNldCAtIGIub2Zmc2V0O1xuICB9KTtcblxuICBsZXQgaWR4ID0gLTE7XG4gIGV4dHJhY3RlZCA9IGV4dHJhY3RlZC5maWx0ZXIoKGVsKSA9PiB7XG4gICAgY29uc3QgcmVzdWx0ID0gKGVsLm9mZnNldCA+IGlkeCk7XG4gICAgaWR4ID0gZWwub2Zmc2V0ICsgZWwubGVuO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH0pO1xuXG4gIHJldHVybiBleHRyYWN0ZWQ7XG59XG5cbi8vIENvbnZlcnQgdGhlIGNodW5rcyBpbnRvIGZvcm1hdCBzdWl0YWJsZSBmb3Igc2VyaWFsaXphdGlvbi5cbmZ1bmN0aW9uIGRyYWZ0aWZ5KGNodW5rcywgc3RhcnRBdCkge1xuICBsZXQgcGxhaW4gPSAnJztcbiAgbGV0IHJhbmdlcyA9IFtdO1xuICBmb3IgKGxldCBpIGluIGNodW5rcykge1xuICAgIGNvbnN0IGNodW5rID0gY2h1bmtzW2ldO1xuICAgIGlmICghY2h1bmsudHh0KSB7XG4gICAgICBjb25zdCBkcmFmdHkgPSBkcmFmdGlmeShjaHVuay5jaGlsZHJlbiwgcGxhaW4ubGVuZ3RoICsgc3RhcnRBdCk7XG4gICAgICBjaHVuay50eHQgPSBkcmFmdHkudHh0O1xuICAgICAgcmFuZ2VzID0gcmFuZ2VzLmNvbmNhdChkcmFmdHkuZm10KTtcbiAgICB9XG5cbiAgICBpZiAoY2h1bmsudHApIHtcbiAgICAgIHJhbmdlcy5wdXNoKHtcbiAgICAgICAgYXQ6IHBsYWluLmxlbmd0aCArIHN0YXJ0QXQsXG4gICAgICAgIGxlbjogY2h1bmsudHh0Lmxlbmd0aCxcbiAgICAgICAgdHA6IGNodW5rLnRwXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBwbGFpbiArPSBjaHVuay50eHQ7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICB0eHQ6IHBsYWluLFxuICAgIGZtdDogcmFuZ2VzXG4gIH07XG59XG5cbi8vIENyZWF0ZSBhIGNvcHkgb2YgZW50aXR5IGRhdGEgd2l0aCAobGlnaHQ9ZmFsc2UpIG9yIHdpdGhvdXQgKGxpZ2h0PXRydWUpIHRoZSBsYXJnZSBwYXlsb2FkLlxuLy8gVGhlIGFycmF5ICdhbGxvdycgY29udGFpbnMgYSBsaXN0IG9mIGZpZWxkcyBleGVtcHQgZnJvbSBzdHJpcHBpbmcuXG5mdW5jdGlvbiBjb3B5RW50RGF0YShkYXRhLCBsaWdodCwgYWxsb3cpIHtcbiAgaWYgKGRhdGEgJiYgT2JqZWN0LmVudHJpZXMoZGF0YSkubGVuZ3RoID4gMCkge1xuICAgIGFsbG93ID0gYWxsb3cgfHwgW107XG4gICAgY29uc3QgZGMgPSB7fTtcbiAgICBBTExPV0VEX0VOVF9GSUVMRFMuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICBpZiAoZGF0YVtrZXldKSB7XG4gICAgICAgIGlmIChsaWdodCAmJiAhYWxsb3cuaW5jbHVkZXMoa2V5KSAmJlxuICAgICAgICAgICh0eXBlb2YgZGF0YVtrZXldID09ICdzdHJpbmcnIHx8IEFycmF5LmlzQXJyYXkoZGF0YVtrZXldKSkgJiZcbiAgICAgICAgICBkYXRhW2tleV0ubGVuZ3RoID4gTUFYX1BSRVZJRVdfREFUQV9TSVpFKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgZGF0YVtrZXldID09ICdvYmplY3QnKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGRjW2tleV0gPSBkYXRhW2tleV07XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAoT2JqZWN0LmVudHJpZXMoZGMpLmxlbmd0aCAhPSAwKSB7XG4gICAgICByZXR1cm4gZGM7XG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG5pZiAodHlwZW9mIG1vZHVsZSAhPSAndW5kZWZpbmVkJykge1xuICBtb2R1bGUuZXhwb3J0cyA9IERyYWZ0eTtcbn1cbiIsIi8qKlxuICogQGZpbGUgVXRpbGl0aWVzIGZvciB1cGxvYWRpbmcgYW5kIGRvd25sb2FkaW5nIGZpbGVzLlxuICpcbiAqIEBjb3B5cmlnaHQgMjAxNS0yMDIyIFRpbm9kZSBMTEMuXG4gKi9cbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHtcbiAganNvblBhcnNlSGVscGVyXG59IGZyb20gJy4vdXRpbHMuanMnO1xuXG5sZXQgWEhSUHJvdmlkZXI7XG5cbi8qKlxuICogQGNsYXNzIExhcmdlRmlsZUhlbHBlciAtIHV0aWxpdGllcyBmb3IgdXBsb2FkaW5nIGFuZCBkb3dubG9hZGluZyBmaWxlcyBvdXQgb2YgYmFuZC5cbiAqIERvbid0IGluc3RhbnRpYXRlIHRoaXMgY2xhc3MgZGlyZWN0bHkuIFVzZSB7VGlub2RlLmdldExhcmdlRmlsZUhlbHBlcn0gaW5zdGVhZC5cbiAqIEBtZW1iZXJvZiBUaW5vZGVcbiAqXG4gKiBAcGFyYW0ge1Rpbm9kZX0gdGlub2RlIC0gdGhlIG1haW4gVGlub2RlIG9iamVjdC5cbiAqIEBwYXJhbSB7c3RyaW5nfSB2ZXJzaW9uIC0gcHJvdG9jb2wgdmVyc2lvbiwgaS5lLiAnMCcuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExhcmdlRmlsZUhlbHBlciB7XG4gIGNvbnN0cnVjdG9yKHRpbm9kZSwgdmVyc2lvbikge1xuICAgIHRoaXMuX3Rpbm9kZSA9IHRpbm9kZTtcbiAgICB0aGlzLl92ZXJzaW9uID0gdmVyc2lvbjtcblxuICAgIHRoaXMuX2FwaUtleSA9IHRpbm9kZS5fYXBpS2V5O1xuICAgIHRoaXMuX2F1dGhUb2tlbiA9IHRpbm9kZS5nZXRBdXRoVG9rZW4oKTtcbiAgICB0aGlzLl9yZXFJZCA9IHRpbm9kZS5nZXROZXh0VW5pcXVlSWQoKTtcbiAgICB0aGlzLnhociA9IG5ldyBYSFJQcm92aWRlcigpO1xuXG4gICAgLy8gUHJvbWlzZVxuICAgIHRoaXMudG9SZXNvbHZlID0gbnVsbDtcbiAgICB0aGlzLnRvUmVqZWN0ID0gbnVsbDtcblxuICAgIC8vIENhbGxiYWNrc1xuICAgIHRoaXMub25Qcm9ncmVzcyA9IG51bGw7XG4gICAgdGhpcy5vblN1Y2Nlc3MgPSBudWxsO1xuICAgIHRoaXMub25GYWlsdXJlID0gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydCB1cGxvYWRpbmcgdGhlIGZpbGUgdG8gYSBub24tZGVmYXVsdCBlbmRwb2ludC5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZS5MYXJnZUZpbGVIZWxwZXIjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBiYXNlVXJsIGFsdGVybmF0aXZlIGJhc2UgVVJMIG9mIHVwbG9hZCBzZXJ2ZXIuXG4gICAqIEBwYXJhbSB7RmlsZXxCbG9ifSBkYXRhIHRvIHVwbG9hZC5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGF2YXRhckZvciB0b3BpYyBuYW1lIGlmIHRoZSB1cGxvYWQgcmVwcmVzZW50cyBhbiBhdmF0YXIuXG4gICAqIEBwYXJhbSB7Q2FsbGJhY2t9IG9uUHJvZ3Jlc3MgY2FsbGJhY2suIFRha2VzIG9uZSB7ZmxvYXR9IHBhcmFtZXRlciAwLi4xXG4gICAqIEBwYXJhbSB7Q2FsbGJhY2t9IG9uU3VjY2VzcyBjYWxsYmFjay4gQ2FsbGVkIHdoZW4gdGhlIGZpbGUgaXMgc3VjY2Vzc2Z1bGx5IHVwbG9hZGVkLlxuICAgKiBAcGFyYW0ge0NhbGxiYWNrfSBvbkZhaWx1cmUgY2FsbGJhY2suIENhbGxlZCBpbiBjYXNlIG9mIGEgZmFpbHVyZS5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIHVwbG9hZCBpcyBjb21wbGV0ZWQvZmFpbGVkLlxuICAgKi9cbiAgdXBsb2FkV2l0aEJhc2VVcmwoYmFzZVVybCwgZGF0YSwgYXZhdGFyRm9yLCBvblByb2dyZXNzLCBvblN1Y2Nlc3MsIG9uRmFpbHVyZSkge1xuICAgIGlmICghdGhpcy5fYXV0aFRva2VuKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNdXN0IGF1dGhlbnRpY2F0ZSBmaXJzdFwiKTtcbiAgICB9XG4gICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzO1xuXG4gICAgbGV0IHVybCA9IGAvdiR7dGhpcy5fdmVyc2lvbn0vZmlsZS91L2A7XG4gICAgaWYgKGJhc2VVcmwpIHtcbiAgICAgIGxldCBiYXNlID0gYmFzZVVybDtcbiAgICAgIGlmIChiYXNlLmVuZHNXaXRoKCcvJykpIHtcbiAgICAgICAgLy8gUmVtb3ZpbmcgdHJhaWxpbmcgc2xhc2guXG4gICAgICAgIGJhc2UgPSBiYXNlLnNsaWNlKDAsIC0xKTtcbiAgICAgIH1cbiAgICAgIGlmIChiYXNlLnN0YXJ0c1dpdGgoJ2h0dHA6Ly8nKSB8fCBiYXNlLnN0YXJ0c1dpdGgoJ2h0dHBzOi8vJykpIHtcbiAgICAgICAgdXJsID0gYmFzZSArIHVybDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBiYXNlIFVSTCAnJHtiYXNlVXJsfSdgKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy54aHIub3BlbignUE9TVCcsIHVybCwgdHJ1ZSk7XG4gICAgdGhpcy54aHIuc2V0UmVxdWVzdEhlYWRlcignWC1UaW5vZGUtQVBJS2V5JywgdGhpcy5fYXBpS2V5KTtcbiAgICB0aGlzLnhoci5zZXRSZXF1ZXN0SGVhZGVyKCdYLVRpbm9kZS1BdXRoJywgYFRva2VuICR7dGhpcy5fYXV0aFRva2VuLnRva2VufWApO1xuICAgIGNvbnN0IHJlc3VsdCA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMudG9SZXNvbHZlID0gcmVzb2x2ZTtcbiAgICAgIHRoaXMudG9SZWplY3QgPSByZWplY3Q7XG4gICAgfSk7XG5cbiAgICB0aGlzLm9uUHJvZ3Jlc3MgPSBvblByb2dyZXNzO1xuICAgIHRoaXMub25TdWNjZXNzID0gb25TdWNjZXNzO1xuICAgIHRoaXMub25GYWlsdXJlID0gb25GYWlsdXJlO1xuXG4gICAgdGhpcy54aHIudXBsb2FkLm9ucHJvZ3Jlc3MgPSAoZSkgPT4ge1xuICAgICAgaWYgKGUubGVuZ3RoQ29tcHV0YWJsZSAmJiBpbnN0YW5jZS5vblByb2dyZXNzKSB7XG4gICAgICAgIGluc3RhbmNlLm9uUHJvZ3Jlc3MoZS5sb2FkZWQgLyBlLnRvdGFsKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy54aHIub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgcGt0O1xuICAgICAgdHJ5IHtcbiAgICAgICAgcGt0ID0gSlNPTi5wYXJzZSh0aGlzLnJlc3BvbnNlLCBqc29uUGFyc2VIZWxwZXIpO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGluc3RhbmNlLl90aW5vZGUubG9nZ2VyKFwiRVJST1I6IEludmFsaWQgc2VydmVyIHJlc3BvbnNlIGluIExhcmdlRmlsZUhlbHBlclwiLCB0aGlzLnJlc3BvbnNlKTtcbiAgICAgICAgcGt0ID0ge1xuICAgICAgICAgIGN0cmw6IHtcbiAgICAgICAgICAgIGNvZGU6IHRoaXMuc3RhdHVzLFxuICAgICAgICAgICAgdGV4dDogdGhpcy5zdGF0dXNUZXh0XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5zdGF0dXMgPj0gMjAwICYmIHRoaXMuc3RhdHVzIDwgMzAwKSB7XG4gICAgICAgIGlmIChpbnN0YW5jZS50b1Jlc29sdmUpIHtcbiAgICAgICAgICBpbnN0YW5jZS50b1Jlc29sdmUocGt0LmN0cmwucGFyYW1zLnVybCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGluc3RhbmNlLm9uU3VjY2Vzcykge1xuICAgICAgICAgIGluc3RhbmNlLm9uU3VjY2Vzcyhwa3QuY3RybCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0dXMgPj0gNDAwKSB7XG4gICAgICAgIGlmIChpbnN0YW5jZS50b1JlamVjdCkge1xuICAgICAgICAgIGluc3RhbmNlLnRvUmVqZWN0KG5ldyBFcnJvcihgJHtwa3QuY3RybC50ZXh0fSAoJHtwa3QuY3RybC5jb2RlfSlgKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGluc3RhbmNlLm9uRmFpbHVyZSkge1xuICAgICAgICAgIGluc3RhbmNlLm9uRmFpbHVyZShwa3QuY3RybCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGluc3RhbmNlLl90aW5vZGUubG9nZ2VyKFwiRVJST1I6IFVuZXhwZWN0ZWQgc2VydmVyIHJlc3BvbnNlIHN0YXR1c1wiLCB0aGlzLnN0YXR1cywgdGhpcy5yZXNwb25zZSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRoaXMueGhyLm9uZXJyb3IgPSBmdW5jdGlvbihlKSB7XG4gICAgICBpZiAoaW5zdGFuY2UudG9SZWplY3QpIHtcbiAgICAgICAgaW5zdGFuY2UudG9SZWplY3QobmV3IEVycm9yKFwiZmFpbGVkXCIpKTtcbiAgICAgIH1cbiAgICAgIGlmIChpbnN0YW5jZS5vbkZhaWx1cmUpIHtcbiAgICAgICAgaW5zdGFuY2Uub25GYWlsdXJlKG51bGwpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLnhoci5vbmFib3J0ID0gZnVuY3Rpb24oZSkge1xuICAgICAgaWYgKGluc3RhbmNlLnRvUmVqZWN0KSB7XG4gICAgICAgIGluc3RhbmNlLnRvUmVqZWN0KG5ldyBFcnJvcihcInVwbG9hZCBjYW5jZWxsZWQgYnkgdXNlclwiKSk7XG4gICAgICB9XG4gICAgICBpZiAoaW5zdGFuY2Uub25GYWlsdXJlKSB7XG4gICAgICAgIGluc3RhbmNlLm9uRmFpbHVyZShudWxsKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGZvcm0gPSBuZXcgRm9ybURhdGEoKTtcbiAgICAgIGZvcm0uYXBwZW5kKCdmaWxlJywgZGF0YSk7XG4gICAgICBmb3JtLnNldCgnaWQnLCB0aGlzLl9yZXFJZCk7XG4gICAgICBpZiAoYXZhdGFyRm9yKSB7XG4gICAgICAgIGZvcm0uc2V0KCd0b3BpYycsIGF2YXRhckZvcik7XG4gICAgICB9XG4gICAgICB0aGlzLnhoci5zZW5kKGZvcm0pO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgaWYgKHRoaXMudG9SZWplY3QpIHtcbiAgICAgICAgdGhpcy50b1JlamVjdChlcnIpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMub25GYWlsdXJlKSB7XG4gICAgICAgIHRoaXMub25GYWlsdXJlKG51bGwpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgLyoqXG4gICAqIFN0YXJ0IHVwbG9hZGluZyB0aGUgZmlsZSB0byBkZWZhdWx0IGVuZHBvaW50LlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkxhcmdlRmlsZUhlbHBlciNcbiAgICpcbiAgICogQHBhcmFtIHtGaWxlfEJsb2J9IGRhdGEgdG8gdXBsb2FkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBhdmF0YXJGb3IgdG9waWMgbmFtZSBpZiB0aGUgdXBsb2FkIHJlcHJlc2VudHMgYW4gYXZhdGFyLlxuICAgKiBAcGFyYW0ge0NhbGxiYWNrfSBvblByb2dyZXNzIGNhbGxiYWNrLiBUYWtlcyBvbmUge2Zsb2F0fSBwYXJhbWV0ZXIgMC4uMVxuICAgKiBAcGFyYW0ge0NhbGxiYWNrfSBvblN1Y2Nlc3MgY2FsbGJhY2suIENhbGxlZCB3aGVuIHRoZSBmaWxlIGlzIHN1Y2Nlc3NmdWxseSB1cGxvYWRlZC5cbiAgICogQHBhcmFtIHtDYWxsYmFja30gb25GYWlsdXJlIGNhbGxiYWNrLiBDYWxsZWQgaW4gY2FzZSBvZiBhIGZhaWx1cmUuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSB1cGxvYWQgaXMgY29tcGxldGVkL2ZhaWxlZC5cbiAgICovXG4gIHVwbG9hZChkYXRhLCBhdmF0YXJGb3IsIG9uUHJvZ3Jlc3MsIG9uU3VjY2Vzcywgb25GYWlsdXJlKSB7XG4gICAgY29uc3QgYmFzZVVybCA9ICh0aGlzLl90aW5vZGUuX3NlY3VyZSA/ICdodHRwczovLycgOiAnaHR0cDovLycpICsgdGhpcy5fdGlub2RlLl9ob3N0O1xuICAgIHJldHVybiB0aGlzLnVwbG9hZFdpdGhCYXNlVXJsKGJhc2VVcmwsIGRhdGEsIGF2YXRhckZvciwgb25Qcm9ncmVzcywgb25TdWNjZXNzLCBvbkZhaWx1cmUpO1xuICB9XG4gIC8qKlxuICAgKiBEb3dubG9hZCB0aGUgZmlsZSBmcm9tIGEgZ2l2ZW4gVVJMIHVzaW5nIEdFVCByZXF1ZXN0LiBUaGlzIG1ldGhvZCB3b3JrcyB3aXRoIHRoZSBUaW5vZGUgc2VydmVyIG9ubHkuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTGFyZ2VGaWxlSGVscGVyI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcmVsYXRpdmVVcmwgLSBVUkwgdG8gZG93bmxvYWQgdGhlIGZpbGUgZnJvbS4gTXVzdCBiZSByZWxhdGl2ZSB1cmwsIGkuZS4gbXVzdCBub3QgY29udGFpbiB0aGUgaG9zdC5cbiAgICogQHBhcmFtIHtzdHJpbmc9fSBmaWxlbmFtZSAtIGZpbGUgbmFtZSB0byB1c2UgZm9yIHRoZSBkb3dubG9hZGVkIGZpbGUuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBkb3dubG9hZCBpcyBjb21wbGV0ZWQvZmFpbGVkLlxuICAgKi9cbiAgZG93bmxvYWQocmVsYXRpdmVVcmwsIGZpbGVuYW1lLCBtaW1ldHlwZSwgb25Qcm9ncmVzcywgb25FcnJvcikge1xuICAgIGlmICghVGlub2RlLmlzUmVsYXRpdmVVUkwocmVsYXRpdmVVcmwpKSB7XG4gICAgICAvLyBBcyBhIHNlY3VyaXR5IG1lYXN1cmUgcmVmdXNlIHRvIGRvd25sb2FkIGZyb20gYW4gYWJzb2x1dGUgVVJMLlxuICAgICAgaWYgKG9uRXJyb3IpIHtcbiAgICAgICAgb25FcnJvcihgVGhlIFVSTCAnJHtyZWxhdGl2ZVVybH0nIG11c3QgYmUgcmVsYXRpdmUsIG5vdCBhYnNvbHV0ZWApO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuX2F1dGhUb2tlbikge1xuICAgICAgaWYgKG9uRXJyb3IpIHtcbiAgICAgICAgb25FcnJvcihcIk11c3QgYXV0aGVudGljYXRlIGZpcnN0XCIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXM7XG4gICAgLy8gR2V0IGRhdGEgYXMgYmxvYiAoc3RvcmVkIGJ5IHRoZSBicm93c2VyIGFzIGEgdGVtcG9yYXJ5IGZpbGUpLlxuICAgIHRoaXMueGhyLm9wZW4oJ0dFVCcsIHJlbGF0aXZlVXJsLCB0cnVlKTtcbiAgICB0aGlzLnhoci5zZXRSZXF1ZXN0SGVhZGVyKCdYLVRpbm9kZS1BUElLZXknLCB0aGlzLl9hcGlLZXkpO1xuICAgIHRoaXMueGhyLnNldFJlcXVlc3RIZWFkZXIoJ1gtVGlub2RlLUF1dGgnLCAnVG9rZW4gJyArIHRoaXMuX2F1dGhUb2tlbi50b2tlbik7XG4gICAgdGhpcy54aHIucmVzcG9uc2VUeXBlID0gJ2Jsb2InO1xuXG4gICAgdGhpcy5vblByb2dyZXNzID0gb25Qcm9ncmVzcztcbiAgICB0aGlzLnhoci5vbnByb2dyZXNzID0gZnVuY3Rpb24oZSkge1xuICAgICAgaWYgKGluc3RhbmNlLm9uUHJvZ3Jlc3MpIHtcbiAgICAgICAgLy8gUGFzc2luZyBlLmxvYWRlZCBpbnN0ZWFkIG9mIGUubG9hZGVkL2UudG90YWwgYmVjYXVzZSBlLnRvdGFsXG4gICAgICAgIC8vIGlzIGFsd2F5cyAwIHdpdGggZ3ppcCBjb21wcmVzc2lvbiBlbmFibGVkIGJ5IHRoZSBzZXJ2ZXIuXG4gICAgICAgIGluc3RhbmNlLm9uUHJvZ3Jlc3MoZS5sb2FkZWQpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCByZXN1bHQgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLnRvUmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgICB0aGlzLnRvUmVqZWN0ID0gcmVqZWN0O1xuICAgIH0pO1xuXG4gICAgLy8gVGhlIGJsb2IgbmVlZHMgdG8gYmUgc2F2ZWQgYXMgZmlsZS4gVGhlcmUgaXMgbm8ga25vd24gd2F5IHRvXG4gICAgLy8gc2F2ZSB0aGUgYmxvYiBhcyBmaWxlIG90aGVyIHRoYW4gdG8gZmFrZSBhIGNsaWNrIG9uIGFuIDxhIGhyZWYuLi4gZG93bmxvYWQ9Li4uPi5cbiAgICB0aGlzLnhoci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLnN0YXR1cyA9PSAyMDApIHtcbiAgICAgICAgY29uc3QgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICAgICAgLy8gVVJMLmNyZWF0ZU9iamVjdFVSTCBpcyBub3QgYXZhaWxhYmxlIGluIG5vbi1icm93c2VyIGVudmlyb25tZW50LiBUaGlzIGNhbGwgd2lsbCBmYWlsLlxuICAgICAgICBsaW5rLmhyZWYgPSB3aW5kb3cuVVJMLmNyZWF0ZU9iamVjdFVSTChuZXcgQmxvYihbdGhpcy5yZXNwb25zZV0sIHtcbiAgICAgICAgICB0eXBlOiBtaW1ldHlwZVxuICAgICAgICB9KSk7XG4gICAgICAgIGxpbmsuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgbGluay5zZXRBdHRyaWJ1dGUoJ2Rvd25sb2FkJywgZmlsZW5hbWUpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGxpbmspO1xuICAgICAgICBsaW5rLmNsaWNrKCk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQobGluayk7XG4gICAgICAgIHdpbmRvdy5VUkwucmV2b2tlT2JqZWN0VVJMKGxpbmsuaHJlZik7XG4gICAgICAgIGlmIChpbnN0YW5jZS50b1Jlc29sdmUpIHtcbiAgICAgICAgICBpbnN0YW5jZS50b1Jlc29sdmUoKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0aGlzLnN0YXR1cyA+PSA0MDAgJiYgaW5zdGFuY2UudG9SZWplY3QpIHtcbiAgICAgICAgLy8gVGhlIHRoaXMucmVzcG9uc2VUZXh0IGlzIHVuZGVmaW5lZCwgbXVzdCB1c2UgdGhpcy5yZXNwb25zZSB3aGljaCBpcyBhIGJsb2IuXG4gICAgICAgIC8vIE5lZWQgdG8gY29udmVydCB0aGlzLnJlc3BvbnNlIHRvIEpTT04uIFRoZSBibG9iIGNhbiBvbmx5IGJlIGFjY2Vzc2VkIGJ5IHRoZVxuICAgICAgICAvLyBGaWxlUmVhZGVyLlxuICAgICAgICBjb25zdCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgICAgICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHBrdCA9IEpTT04ucGFyc2UodGhpcy5yZXN1bHQsIGpzb25QYXJzZUhlbHBlcik7XG4gICAgICAgICAgICBpbnN0YW5jZS50b1JlamVjdChuZXcgRXJyb3IoYCR7cGt0LmN0cmwudGV4dH0gKCR7cGt0LmN0cmwuY29kZX0pYCkpO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgaW5zdGFuY2UuX3Rpbm9kZS5sb2dnZXIoXCJFUlJPUjogSW52YWxpZCBzZXJ2ZXIgcmVzcG9uc2UgaW4gTGFyZ2VGaWxlSGVscGVyXCIsIHRoaXMucmVzdWx0KTtcbiAgICAgICAgICAgIGluc3RhbmNlLnRvUmVqZWN0KGVycik7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICByZWFkZXIucmVhZEFzVGV4dCh0aGlzLnJlc3BvbnNlKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy54aHIub25lcnJvciA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgIGlmIChpbnN0YW5jZS50b1JlamVjdCkge1xuICAgICAgICBpbnN0YW5jZS50b1JlamVjdChuZXcgRXJyb3IoXCJmYWlsZWRcIikpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLnhoci5vbmFib3J0ID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoaW5zdGFuY2UudG9SZWplY3QpIHtcbiAgICAgICAgaW5zdGFuY2UudG9SZWplY3QobnVsbCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRyeSB7XG4gICAgICB0aGlzLnhoci5zZW5kKCk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBpZiAodGhpcy50b1JlamVjdCkge1xuICAgICAgICB0aGlzLnRvUmVqZWN0KGVycik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICAvKipcbiAgICogVHJ5IHRvIGNhbmNlbCBhbiBvbmdvaW5nIHVwbG9hZCBvciBkb3dubG9hZC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5MYXJnZUZpbGVIZWxwZXIjXG4gICAqL1xuICBjYW5jZWwoKSB7XG4gICAgaWYgKHRoaXMueGhyICYmIHRoaXMueGhyLnJlYWR5U3RhdGUgPCA0KSB7XG4gICAgICB0aGlzLnhoci5hYm9ydCgpO1xuICAgIH1cbiAgfVxuICAvKipcbiAgICogR2V0IHVuaXF1ZSBpZCBvZiB0aGlzIHJlcXVlc3QuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTGFyZ2VGaWxlSGVscGVyI1xuICAgKlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSB1bmlxdWUgaWRcbiAgICovXG4gIGdldElkKCkge1xuICAgIHJldHVybiB0aGlzLl9yZXFJZDtcbiAgfVxuICAvKipcbiAgICogVG8gdXNlIExhcmdlRmlsZUhlbHBlciBpbiBhIG5vbiBicm93c2VyIGNvbnRleHQsIHN1cHBseSBYTUxIdHRwUmVxdWVzdCBwcm92aWRlci5cbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyb2YgTGFyZ2VGaWxlSGVscGVyXG4gICAqIEBwYXJhbSB4aHJQcm92aWRlciBYTUxIdHRwUmVxdWVzdCBwcm92aWRlciwgZS5nLiBmb3Igbm9kZSA8Y29kZT5yZXF1aXJlKCd4aHInKTwvY29kZT4uXG4gICAqL1xuICBzdGF0aWMgc2V0TmV0d29ya1Byb3ZpZGVyKHhoclByb3ZpZGVyKSB7XG4gICAgWEhSUHJvdmlkZXIgPSB4aHJQcm92aWRlcjtcbiAgfVxufVxuIiwiLyoqXG4gKiBAZmlsZSBIZWxwZXIgY2xhc3MgZm9yIGNvbnN0cnVjdGluZyB7QGxpbmsgVGlub2RlLkdldFF1ZXJ5fS5cbiAqXG4gKiBAY29weXJpZ2h0IDIwMTUtMjAyMiBUaW5vZGUgTExDLlxuICovXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogSGVscGVyIGNsYXNzIGZvciBjb25zdHJ1Y3Rpbmcge0BsaW5rIFRpbm9kZS5HZXRRdWVyeX0uXG4gKlxuICogQGNsYXNzIE1ldGFHZXRCdWlsZGVyXG4gKiBAbWVtYmVyb2YgVGlub2RlXG4gKlxuICogQHBhcmFtIHtUaW5vZGUuVG9waWN9IHBhcmVudCB0b3BpYyB3aGljaCBpbnN0YW50aWF0ZWQgdGhpcyBidWlsZGVyLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNZXRhR2V0QnVpbGRlciB7XG4gIGNvbnN0cnVjdG9yKHBhcmVudCkge1xuICAgIHRoaXMudG9waWMgPSBwYXJlbnQ7XG4gICAgdGhpcy53aGF0ID0ge307XG4gIH1cblxuICAvLyBHZXQgdGltZXN0YW1wIG9mIHRoZSBtb3N0IHJlY2VudCBkZXNjIHVwZGF0ZS5cbiAgI2dldF9kZXNjX2ltcygpIHtcbiAgICByZXR1cm4gdGhpcy50b3BpYy51cGRhdGVkO1xuICB9XG5cbiAgLy8gR2V0IHRpbWVzdGFtcCBvZiB0aGUgbW9zdCByZWNlbnQgc3VicyB1cGRhdGUuXG4gICNnZXRfc3Vic19pbXMoKSB7XG4gICAgaWYgKHRoaXMudG9waWMuaXNQMlBUeXBlKCkpIHtcbiAgICAgIHJldHVybiB0aGlzLiNnZXRfZGVzY19pbXMoKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMudG9waWMuX2xhc3RTdWJzVXBkYXRlO1xuICB9XG4gIC8qKlxuICAgKiBBZGQgcXVlcnkgcGFyYW1ldGVycyB0byBmZXRjaCBtZXNzYWdlcyB3aXRoaW4gZXhwbGljaXQgbGltaXRzLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLk1ldGFHZXRCdWlsZGVyI1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcj19IHNpbmNlIC0gbWVzc2FnZXMgbmV3ZXIgdGhhbiB0aGlzIChpbmNsdXNpdmUpO1xuICAgKiBAcGFyYW0ge251bWJlcj19IGJlZm9yZSAtIG9sZGVyIHRoYW4gdGhpcyAoZXhjbHVzaXZlKVxuICAgKiBAcGFyYW0ge251bWJlcj19IGxpbWl0IC0gbnVtYmVyIG9mIG1lc3NhZ2VzIHRvIGZldGNoXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuTWV0YUdldEJ1aWxkZXJ9IDxjb2RlPnRoaXM8L2NvZGU+IG9iamVjdC5cbiAgICovXG4gIHdpdGhEYXRhKHNpbmNlLCBiZWZvcmUsIGxpbWl0KSB7XG4gICAgdGhpcy53aGF0WydkYXRhJ10gPSB7XG4gICAgICBzaW5jZTogc2luY2UsXG4gICAgICBiZWZvcmU6IGJlZm9yZSxcbiAgICAgIGxpbWl0OiBsaW1pdFxuICAgIH07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLyoqXG4gICAqIEFkZCBxdWVyeSBwYXJhbWV0ZXJzIHRvIGZldGNoIG1lc3NhZ2VzIG5ld2VyIHRoYW4gdGhlIGxhdGVzdCBzYXZlZCBtZXNzYWdlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLk1ldGFHZXRCdWlsZGVyI1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcj19IGxpbWl0IC0gbnVtYmVyIG9mIG1lc3NhZ2VzIHRvIGZldGNoXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuTWV0YUdldEJ1aWxkZXJ9IDxjb2RlPnRoaXM8L2NvZGU+IG9iamVjdC5cbiAgICovXG4gIHdpdGhMYXRlckRhdGEobGltaXQpIHtcbiAgICByZXR1cm4gdGhpcy53aXRoRGF0YSh0aGlzLnRvcGljLl9tYXhTZXEgPiAwID8gdGhpcy50b3BpYy5fbWF4U2VxICsgMSA6IHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBsaW1pdCk7XG4gIH1cbiAgLyoqXG4gICAqIEFkZCBxdWVyeSBwYXJhbWV0ZXJzIHRvIGZldGNoIG1lc3NhZ2VzIG9sZGVyIHRoYW4gdGhlIGVhcmxpZXN0IHNhdmVkIG1lc3NhZ2UuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTWV0YUdldEJ1aWxkZXIjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gbGltaXQgLSBtYXhpbXVtIG51bWJlciBvZiBtZXNzYWdlcyB0byBmZXRjaC5cbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5NZXRhR2V0QnVpbGRlcn0gPGNvZGU+dGhpczwvY29kZT4gb2JqZWN0LlxuICAgKi9cbiAgd2l0aEVhcmxpZXJEYXRhKGxpbWl0KSB7XG4gICAgcmV0dXJuIHRoaXMud2l0aERhdGEodW5kZWZpbmVkLCB0aGlzLnRvcGljLl9taW5TZXEgPiAwID8gdGhpcy50b3BpYy5fbWluU2VxIDogdW5kZWZpbmVkLCBsaW1pdCk7XG4gIH1cbiAgLyoqXG4gICAqIEFkZCBxdWVyeSBwYXJhbWV0ZXJzIHRvIGZldGNoIHRvcGljIGRlc2NyaXB0aW9uIGlmIGl0J3MgbmV3ZXIgdGhhbiB0aGUgZ2l2ZW4gdGltZXN0YW1wLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLk1ldGFHZXRCdWlsZGVyI1xuICAgKlxuICAgKiBAcGFyYW0ge0RhdGU9fSBpbXMgLSBmZXRjaCBtZXNzYWdlcyBuZXdlciB0aGFuIHRoaXMgdGltZXN0YW1wLlxuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLk1ldGFHZXRCdWlsZGVyfSA8Y29kZT50aGlzPC9jb2RlPiBvYmplY3QuXG4gICAqL1xuICB3aXRoRGVzYyhpbXMpIHtcbiAgICB0aGlzLndoYXRbJ2Rlc2MnXSA9IHtcbiAgICAgIGltczogaW1zXG4gICAgfTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICAvKipcbiAgICogQWRkIHF1ZXJ5IHBhcmFtZXRlcnMgdG8gZmV0Y2ggdG9waWMgZGVzY3JpcHRpb24gaWYgaXQncyBuZXdlciB0aGFuIHRoZSBsYXN0IHVwZGF0ZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5NZXRhR2V0QnVpbGRlciNcbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5NZXRhR2V0QnVpbGRlcn0gPGNvZGU+dGhpczwvY29kZT4gb2JqZWN0LlxuICAgKi9cbiAgd2l0aExhdGVyRGVzYygpIHtcbiAgICByZXR1cm4gdGhpcy53aXRoRGVzYyh0aGlzLiNnZXRfZGVzY19pbXMoKSk7XG4gIH1cbiAgLyoqXG4gICAqIEFkZCBxdWVyeSBwYXJhbWV0ZXJzIHRvIGZldGNoIHN1YnNjcmlwdGlvbnMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTWV0YUdldEJ1aWxkZXIjXG4gICAqXG4gICAqIEBwYXJhbSB7RGF0ZT19IGltcyAtIGZldGNoIHN1YnNjcmlwdGlvbnMgbW9kaWZpZWQgbW9yZSByZWNlbnRseSB0aGFuIHRoaXMgdGltZXN0YW1wXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gbGltaXQgLSBtYXhpbXVtIG51bWJlciBvZiBzdWJzY3JpcHRpb25zIHRvIGZldGNoLlxuICAgKiBAcGFyYW0ge3N0cmluZz19IHVzZXJPclRvcGljIC0gdXNlciBJRCBvciB0b3BpYyBuYW1lIHRvIGZldGNoIGZvciBmZXRjaGluZyBvbmUgc3Vic2NyaXB0aW9uLlxuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLk1ldGFHZXRCdWlsZGVyfSA8Y29kZT50aGlzPC9jb2RlPiBvYmplY3QuXG4gICAqL1xuICB3aXRoU3ViKGltcywgbGltaXQsIHVzZXJPclRvcGljKSB7XG4gICAgY29uc3Qgb3B0cyA9IHtcbiAgICAgIGltczogaW1zLFxuICAgICAgbGltaXQ6IGxpbWl0XG4gICAgfTtcbiAgICBpZiAodGhpcy50b3BpYy5nZXRUeXBlKCkgPT0gJ21lJykge1xuICAgICAgb3B0cy50b3BpYyA9IHVzZXJPclRvcGljO1xuICAgIH0gZWxzZSB7XG4gICAgICBvcHRzLnVzZXIgPSB1c2VyT3JUb3BpYztcbiAgICB9XG4gICAgdGhpcy53aGF0WydzdWInXSA9IG9wdHM7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLyoqXG4gICAqIEFkZCBxdWVyeSBwYXJhbWV0ZXJzIHRvIGZldGNoIGEgc2luZ2xlIHN1YnNjcmlwdGlvbi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5NZXRhR2V0QnVpbGRlciNcbiAgICpcbiAgICogQHBhcmFtIHtEYXRlPX0gaW1zIC0gZmV0Y2ggc3Vic2NyaXB0aW9ucyBtb2RpZmllZCBtb3JlIHJlY2VudGx5IHRoYW4gdGhpcyB0aW1lc3RhbXBcbiAgICogQHBhcmFtIHtzdHJpbmc9fSB1c2VyT3JUb3BpYyAtIHVzZXIgSUQgb3IgdG9waWMgbmFtZSB0byBmZXRjaCBmb3IgZmV0Y2hpbmcgb25lIHN1YnNjcmlwdGlvbi5cbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5NZXRhR2V0QnVpbGRlcn0gPGNvZGU+dGhpczwvY29kZT4gb2JqZWN0LlxuICAgKi9cbiAgd2l0aE9uZVN1YihpbXMsIHVzZXJPclRvcGljKSB7XG4gICAgcmV0dXJuIHRoaXMud2l0aFN1YihpbXMsIHVuZGVmaW5lZCwgdXNlck9yVG9waWMpO1xuICB9XG4gIC8qKlxuICAgKiBBZGQgcXVlcnkgcGFyYW1ldGVycyB0byBmZXRjaCBhIHNpbmdsZSBzdWJzY3JpcHRpb24gaWYgaXQncyBiZWVuIHVwZGF0ZWQgc2luY2UgdGhlIGxhc3QgdXBkYXRlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLk1ldGFHZXRCdWlsZGVyI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZz19IHVzZXJPclRvcGljIC0gdXNlciBJRCBvciB0b3BpYyBuYW1lIHRvIGZldGNoIGZvciBmZXRjaGluZyBvbmUgc3Vic2NyaXB0aW9uLlxuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLk1ldGFHZXRCdWlsZGVyfSA8Y29kZT50aGlzPC9jb2RlPiBvYmplY3QuXG4gICAqL1xuICB3aXRoTGF0ZXJPbmVTdWIodXNlck9yVG9waWMpIHtcbiAgICByZXR1cm4gdGhpcy53aXRoT25lU3ViKHRoaXMudG9waWMuX2xhc3RTdWJzVXBkYXRlLCB1c2VyT3JUb3BpYyk7XG4gIH1cbiAgLyoqXG4gICAqIEFkZCBxdWVyeSBwYXJhbWV0ZXJzIHRvIGZldGNoIHN1YnNjcmlwdGlvbnMgdXBkYXRlZCBzaW5jZSB0aGUgbGFzdCB1cGRhdGUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTWV0YUdldEJ1aWxkZXIjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gbGltaXQgLSBtYXhpbXVtIG51bWJlciBvZiBzdWJzY3JpcHRpb25zIHRvIGZldGNoLlxuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLk1ldGFHZXRCdWlsZGVyfSA8Y29kZT50aGlzPC9jb2RlPiBvYmplY3QuXG4gICAqL1xuICB3aXRoTGF0ZXJTdWIobGltaXQpIHtcbiAgICByZXR1cm4gdGhpcy53aXRoU3ViKHRoaXMuI2dldF9zdWJzX2ltcygpLCBsaW1pdCk7XG4gIH1cbiAgLyoqXG4gICAqIEFkZCBxdWVyeSBwYXJhbWV0ZXJzIHRvIGZldGNoIHRvcGljIHRhZ3MuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTWV0YUdldEJ1aWxkZXIjXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuTWV0YUdldEJ1aWxkZXJ9IDxjb2RlPnRoaXM8L2NvZGU+IG9iamVjdC5cbiAgICovXG4gIHdpdGhUYWdzKCkge1xuICAgIHRoaXMud2hhdFsndGFncyddID0gdHJ1ZTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICAvKipcbiAgICogQWRkIHF1ZXJ5IHBhcmFtZXRlcnMgdG8gZmV0Y2ggdXNlcidzIGNyZWRlbnRpYWxzLiA8Y29kZT4nbWUnPC9jb2RlPiB0b3BpYyBvbmx5LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLk1ldGFHZXRCdWlsZGVyI1xuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLk1ldGFHZXRCdWlsZGVyfSA8Y29kZT50aGlzPC9jb2RlPiBvYmplY3QuXG4gICAqL1xuICB3aXRoQ3JlZCgpIHtcbiAgICBpZiAodGhpcy50b3BpYy5nZXRUeXBlKCkgPT0gJ21lJykge1xuICAgICAgdGhpcy53aGF0WydjcmVkJ10gPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnRvcGljLl90aW5vZGUubG9nZ2VyKFwiRVJST1I6IEludmFsaWQgdG9waWMgdHlwZSBmb3IgTWV0YUdldEJ1aWxkZXI6d2l0aENyZWRzXCIsIHRoaXMudG9waWMuZ2V0VHlwZSgpKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLyoqXG4gICAqIEFkZCBxdWVyeSBwYXJhbWV0ZXJzIHRvIGZldGNoIGRlbGV0ZWQgbWVzc2FnZXMgd2l0aGluIGV4cGxpY2l0IGxpbWl0cy4gQW55L2FsbCBwYXJhbWV0ZXJzIGNhbiBiZSBudWxsLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLk1ldGFHZXRCdWlsZGVyI1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcj19IHNpbmNlIC0gaWRzIG9mIG1lc3NhZ2VzIGRlbGV0ZWQgc2luY2UgdGhpcyAnZGVsJyBpZCAoaW5jbHVzaXZlKVxuICAgKiBAcGFyYW0ge251bWJlcj19IGxpbWl0IC0gbnVtYmVyIG9mIGRlbGV0ZWQgbWVzc2FnZSBpZHMgdG8gZmV0Y2hcbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5NZXRhR2V0QnVpbGRlcn0gPGNvZGU+dGhpczwvY29kZT4gb2JqZWN0LlxuICAgKi9cbiAgd2l0aERlbChzaW5jZSwgbGltaXQpIHtcbiAgICBpZiAoc2luY2UgfHwgbGltaXQpIHtcbiAgICAgIHRoaXMud2hhdFsnZGVsJ10gPSB7XG4gICAgICAgIHNpbmNlOiBzaW5jZSxcbiAgICAgICAgbGltaXQ6IGxpbWl0XG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICAvKipcbiAgICogQWRkIHF1ZXJ5IHBhcmFtZXRlcnMgdG8gZmV0Y2ggbWVzc2FnZXMgZGVsZXRlZCBhZnRlciB0aGUgc2F2ZWQgPGNvZGU+J2RlbCc8L2NvZGU+IGlkLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLk1ldGFHZXRCdWlsZGVyI1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcj19IGxpbWl0IC0gbnVtYmVyIG9mIGRlbGV0ZWQgbWVzc2FnZSBpZHMgdG8gZmV0Y2hcbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5NZXRhR2V0QnVpbGRlcn0gPGNvZGU+dGhpczwvY29kZT4gb2JqZWN0LlxuICAgKi9cbiAgd2l0aExhdGVyRGVsKGxpbWl0KSB7XG4gICAgLy8gU3BlY2lmeSAnc2luY2UnIG9ubHkgaWYgd2UgaGF2ZSBhbHJlYWR5IHJlY2VpdmVkIHNvbWUgbWVzc2FnZXMuIElmXG4gICAgLy8gd2UgaGF2ZSBubyBsb2NhbGx5IGNhY2hlZCBtZXNzYWdlcyB0aGVuIHdlIGRvbid0IGNhcmUgaWYgYW55IG1lc3NhZ2VzIHdlcmUgZGVsZXRlZC5cbiAgICByZXR1cm4gdGhpcy53aXRoRGVsKHRoaXMudG9waWMuX21heFNlcSA+IDAgPyB0aGlzLnRvcGljLl9tYXhEZWwgKyAxIDogdW5kZWZpbmVkLCBsaW1pdCk7XG4gIH1cblxuICAvKipcbiAgICogRXh0cmFjdCBzdWJxdWVyeTogZ2V0IGFuIG9iamVjdCB0aGF0IGNvbnRhaW5zIHNwZWNpZmllZCBzdWJxdWVyeS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5NZXRhR2V0QnVpbGRlciNcbiAgICogQHBhcmFtIHtzdHJpbmd9IHdoYXQgLSBzdWJxdWVyeSB0byByZXR1cm46IG9uZSBvZiAnZGF0YScsICdzdWInLCAnZGVzYycsICd0YWdzJywgJ2NyZWQnLCAnZGVsJy5cbiAgICogQHJldHVybnMge09iamVjdH0gcmVxdWVzdGVkIHN1YnF1ZXJ5IG9yIDxjb2RlPnVuZGVmaW5lZDwvY29kZT4uXG4gICAqL1xuICBleHRyYWN0KHdoYXQpIHtcbiAgICByZXR1cm4gdGhpcy53aGF0W3doYXRdO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdCBwYXJhbWV0ZXJzLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLk1ldGFHZXRCdWlsZGVyI1xuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLkdldFF1ZXJ5fSBHZXQgcXVlcnlcbiAgICovXG4gIGJ1aWxkKCkge1xuICAgIGNvbnN0IHdoYXQgPSBbXTtcbiAgICBsZXQgcGFyYW1zID0ge307XG4gICAgWydkYXRhJywgJ3N1YicsICdkZXNjJywgJ3RhZ3MnLCAnY3JlZCcsICdkZWwnXS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgIGlmICh0aGlzLndoYXQuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICB3aGF0LnB1c2goa2V5KTtcbiAgICAgICAgaWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRoaXMud2hhdFtrZXldKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgcGFyYW1zW2tleV0gPSB0aGlzLndoYXRba2V5XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIGlmICh3aGF0Lmxlbmd0aCA+IDApIHtcbiAgICAgIHBhcmFtcy53aGF0ID0gd2hhdC5qb2luKCcgJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhcmFtcyA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgcmV0dXJuIHBhcmFtcztcbiAgfVxufVxuIiwiLyoqXG4gKiBAZmlsZSBTREsgdG8gY29ubmVjdCB0byBUaW5vZGUgY2hhdCBzZXJ2ZXIuXG4gKiBTZWUgPGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS90aW5vZGUvd2ViYXBwXCI+aHR0cHM6Ly9naXRodWIuY29tL3Rpbm9kZS93ZWJhcHA8L2E+IGZvciByZWFsLWxpZmUgdXNhZ2UuXG4gKlxuICogQGNvcHlyaWdodCAyMDE1LTIwMjIgVGlub2RlIExMQy5cbiAqIEBzdW1tYXJ5IEphdmFzY3JpcHQgYmluZGluZ3MgZm9yIFRpbm9kZS5cbiAqIEBsaWNlbnNlIEFwYWNoZSAyLjBcbiAqIEB2ZXJzaW9uIDAuMTlcbiAqXG4gKiBAZXhhbXBsZVxuICogPGhlYWQ+XG4gKiA8c2NyaXB0IHNyYz1cIi4uLi90aW5vZGUuanNcIj48L3NjcmlwdD5cbiAqIDwvaGVhZD5cbiAqXG4gKiA8Ym9keT5cbiAqICAuLi5cbiAqIDxzY3JpcHQ+XG4gKiAgLy8gSW5zdGFudGlhdGUgdGlub2RlLlxuICogIGNvbnN0IHRpbm9kZSA9IG5ldyBUaW5vZGUoY29uZmlnLCAoKSA9PiB7XG4gKiAgICAvLyBDYWxsZWQgb24gaW5pdCBjb21wbGV0aW9uLlxuICogIH0pO1xuICogIHRpbm9kZS5lbmFibGVMb2dnaW5nKHRydWUpO1xuICogIHRpbm9kZS5vbkRpc2Nvbm5lY3QgPSAoZXJyKSA9PiB7XG4gKiAgICAvLyBIYW5kbGUgZGlzY29ubmVjdC5cbiAqICB9O1xuICogIC8vIENvbm5lY3QgdG8gdGhlIHNlcnZlci5cbiAqICB0aW5vZGUuY29ubmVjdCgnaHR0cHM6Ly9leGFtcGxlLmNvbS8nKS50aGVuKCgpID0+IHtcbiAqICAgIC8vIENvbm5lY3RlZC4gTG9naW4gbm93LlxuICogICAgcmV0dXJuIHRpbm9kZS5sb2dpbkJhc2ljKGxvZ2luLCBwYXNzd29yZCk7XG4gKiAgfSkudGhlbigoY3RybCkgPT4ge1xuICogICAgLy8gTG9nZ2VkIGluIGZpbmUsIGF0dGFjaCBjYWxsYmFja3MsIHN1YnNjcmliZSB0byAnbWUnLlxuICogICAgY29uc3QgbWUgPSB0aW5vZGUuZ2V0TWVUb3BpYygpO1xuICogICAgbWUub25NZXRhRGVzYyA9IGZ1bmN0aW9uKG1ldGEpIHsgLi4uIH07XG4gKiAgICAvLyBTdWJzY3JpYmUsIGZldGNoIHRvcGljIGRlc2NyaXB0aW9uIGFuZCB0aGUgbGlzdCBvZiBjb250YWN0cy5cbiAqICAgIG1lLnN1YnNjcmliZSh7Z2V0OiB7ZGVzYzoge30sIHN1Yjoge319fSk7XG4gKiAgfSkuY2F0Y2goKGVycikgPT4ge1xuICogICAgLy8gTG9naW4gb3Igc3Vic2NyaXB0aW9uIGZhaWxlZCwgZG8gc29tZXRoaW5nLlxuICogICAgLi4uXG4gKiAgfSk7XG4gKiAgLi4uXG4gKiA8L3NjcmlwdD5cbiAqIDwvYm9keT5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG4vLyBOT1RFIFRPIERFVkVMT1BFUlM6XG4vLyBMb2NhbGl6YWJsZSBzdHJpbmdzIHNob3VsZCBiZSBkb3VibGUgcXVvdGVkIFwi0YHRgtGA0L7QutCwINC90LAg0LTRgNGD0LPQvtC8INGP0LfRi9C60LVcIixcbi8vIG5vbi1sb2NhbGl6YWJsZSBzdHJpbmdzIHNob3VsZCBiZSBzaW5nbGUgcXVvdGVkICdub24tbG9jYWxpemVkJy5cblxuaW1wb3J0IEFjY2Vzc01vZGUgZnJvbSAnLi9hY2Nlc3MtbW9kZS5qcyc7XG5pbXBvcnQgKiBhcyBDb25zdCBmcm9tICcuL2NvbmZpZy5qcyc7XG5pbXBvcnQgQ29ubmVjdGlvbiBmcm9tICcuL2Nvbm5lY3Rpb24uanMnO1xuaW1wb3J0IERCQ2FjaGUgZnJvbSAnLi9kYi5qcyc7XG5pbXBvcnQgRHJhZnR5IGZyb20gJy4vZHJhZnR5LmpzJztcbmltcG9ydCBMYXJnZUZpbGVIZWxwZXIgZnJvbSAnLi9sYXJnZS1maWxlLmpzJztcbmltcG9ydCB7XG4gIFRvcGljLFxuICBUb3BpY01lLFxuICBUb3BpY0ZuZFxufSBmcm9tICcuL3RvcGljLmpzJztcblxuaW1wb3J0IHtcbiAganNvblBhcnNlSGVscGVyLFxuICBtZXJnZU9iaixcbiAgcmZjMzMzOURhdGVTdHJpbmcsXG4gIHNpbXBsaWZ5XG59IGZyb20gJy4vdXRpbHMuanMnO1xuXG5sZXQgV2ViU29ja2V0UHJvdmlkZXI7XG5pZiAodHlwZW9mIFdlYlNvY2tldCAhPSAndW5kZWZpbmVkJykge1xuICBXZWJTb2NrZXRQcm92aWRlciA9IFdlYlNvY2tldDtcbn1cblxubGV0IFhIUlByb3ZpZGVyO1xuaWYgKHR5cGVvZiBYTUxIdHRwUmVxdWVzdCAhPSAndW5kZWZpbmVkJykge1xuICBYSFJQcm92aWRlciA9IFhNTEh0dHBSZXF1ZXN0O1xufVxuXG5sZXQgSW5kZXhlZERCUHJvdmlkZXI7XG5pZiAodHlwZW9mIGluZGV4ZWREQiAhPSAndW5kZWZpbmVkJykge1xuICBJbmRleGVkREJQcm92aWRlciA9IGluZGV4ZWREQjtcbn1cblxuLy8gUmUtZXhwb3J0IERyYWZ0eS5cbmV4cG9ydCB7XG4gIERyYWZ0eVxufVxuXG5pbml0Rm9yTm9uQnJvd3NlckFwcCgpO1xuXG4vLyBVdGlsaXR5IGZ1bmN0aW9uc1xuXG4vLyBQb2x5ZmlsbCBmb3Igbm9uLWJyb3dzZXIgY29udGV4dCwgZS5nLiBOb2RlSnMuXG5mdW5jdGlvbiBpbml0Rm9yTm9uQnJvd3NlckFwcCgpIHtcbiAgLy8gVGlub2RlIHJlcXVpcmVtZW50IGluIG5hdGl2ZSBtb2RlIGJlY2F1c2UgcmVhY3QgbmF0aXZlIGRvZXNuJ3QgcHJvdmlkZSBCYXNlNjQgbWV0aG9kXG4gIGNvbnN0IGNoYXJzID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky89JztcblxuICBpZiAodHlwZW9mIGJ0b2EgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBnbG9iYWwuYnRvYSA9IGZ1bmN0aW9uKGlucHV0ID0gJycpIHtcbiAgICAgIGxldCBzdHIgPSBpbnB1dDtcbiAgICAgIGxldCBvdXRwdXQgPSAnJztcblxuICAgICAgZm9yIChsZXQgYmxvY2sgPSAwLCBjaGFyQ29kZSwgaSA9IDAsIG1hcCA9IGNoYXJzOyBzdHIuY2hhckF0KGkgfCAwKSB8fCAobWFwID0gJz0nLCBpICUgMSk7IG91dHB1dCArPSBtYXAuY2hhckF0KDYzICYgYmxvY2sgPj4gOCAtIGkgJSAxICogOCkpIHtcblxuICAgICAgICBjaGFyQ29kZSA9IHN0ci5jaGFyQ29kZUF0KGkgKz0gMyAvIDQpO1xuXG4gICAgICAgIGlmIChjaGFyQ29kZSA+IDB4RkYpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCInYnRvYScgZmFpbGVkOiBUaGUgc3RyaW5nIHRvIGJlIGVuY29kZWQgY29udGFpbnMgY2hhcmFjdGVycyBvdXRzaWRlIG9mIHRoZSBMYXRpbjEgcmFuZ2UuXCIpO1xuICAgICAgICB9XG4gICAgICAgIGJsb2NrID0gYmxvY2sgPDwgOCB8IGNoYXJDb2RlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH07XG4gIH1cblxuICBpZiAodHlwZW9mIGF0b2IgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBnbG9iYWwuYXRvYiA9IGZ1bmN0aW9uKGlucHV0ID0gJycpIHtcbiAgICAgIGxldCBzdHIgPSBpbnB1dC5yZXBsYWNlKC89KyQvLCAnJyk7XG4gICAgICBsZXQgb3V0cHV0ID0gJyc7XG5cbiAgICAgIGlmIChzdHIubGVuZ3RoICUgNCA9PSAxKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIidhdG9iJyBmYWlsZWQ6IFRoZSBzdHJpbmcgdG8gYmUgZGVjb2RlZCBpcyBub3QgY29ycmVjdGx5IGVuY29kZWQuXCIpO1xuICAgICAgfVxuICAgICAgZm9yIChsZXQgYmMgPSAwLCBicyA9IDAsIGJ1ZmZlciwgaSA9IDA7IGJ1ZmZlciA9IHN0ci5jaGFyQXQoaSsrKTtcblxuICAgICAgICB+YnVmZmVyICYmIChicyA9IGJjICUgNCA/IGJzICogNjQgKyBidWZmZXIgOiBidWZmZXIsXG4gICAgICAgICAgYmMrKyAlIDQpID8gb3V0cHV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoMjU1ICYgYnMgPj4gKC0yICogYmMgJiA2KSkgOiAwXG4gICAgICApIHtcbiAgICAgICAgYnVmZmVyID0gY2hhcnMuaW5kZXhPZihidWZmZXIpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH07XG4gIH1cblxuICBpZiAodHlwZW9mIHdpbmRvdyA9PSAndW5kZWZpbmVkJykge1xuICAgIGdsb2JhbC53aW5kb3cgPSB7XG4gICAgICBXZWJTb2NrZXQ6IFdlYlNvY2tldFByb3ZpZGVyLFxuICAgICAgWE1MSHR0cFJlcXVlc3Q6IFhIUlByb3ZpZGVyLFxuICAgICAgaW5kZXhlZERCOiBJbmRleGVkREJQcm92aWRlcixcbiAgICAgIFVSTDoge1xuICAgICAgICBjcmVhdGVPYmplY3RVUkw6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVuYWJsZSB0byB1c2UgVVJMLmNyZWF0ZU9iamVjdFVSTCBpbiBhIG5vbi1icm93c2VyIGFwcGxpY2F0aW9uXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgQ29ubmVjdGlvbi5zZXROZXR3b3JrUHJvdmlkZXJzKFdlYlNvY2tldFByb3ZpZGVyLCBYSFJQcm92aWRlcik7XG4gIExhcmdlRmlsZUhlbHBlci5zZXROZXR3b3JrUHJvdmlkZXIoWEhSUHJvdmlkZXIpO1xuICBEQkNhY2hlLnNldERhdGFiYXNlUHJvdmlkZXIoSW5kZXhlZERCUHJvdmlkZXIpO1xufVxuXG4vLyBEZXRlY3QgZmluZCBtb3N0IHVzZWZ1bCBuZXR3b3JrIHRyYW5zcG9ydC5cbmZ1bmN0aW9uIGRldGVjdFRyYW5zcG9ydCgpIHtcbiAgaWYgKHR5cGVvZiB3aW5kb3cgPT0gJ29iamVjdCcpIHtcbiAgICBpZiAod2luZG93WydXZWJTb2NrZXQnXSkge1xuICAgICAgcmV0dXJuICd3cyc7XG4gICAgfSBlbHNlIGlmICh3aW5kb3dbJ1hNTEh0dHBSZXF1ZXN0J10pIHtcbiAgICAgIC8vIFRoZSBicm93c2VyIG9yIG5vZGUgaGFzIG5vIHdlYnNvY2tldHMsIHVzaW5nIGxvbmcgcG9sbGluZy5cbiAgICAgIHJldHVybiAnbHAnO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuLy8gYnRvYSByZXBsYWNlbWVudC4gU3RvY2sgYnRvYSBmYWlscyBvbiBvbiBub24tTGF0aW4xIHN0cmluZ3MuXG5mdW5jdGlvbiBiNjRFbmNvZGVVbmljb2RlKHN0cikge1xuICAvLyBUaGUgZW5jb2RlVVJJQ29tcG9uZW50IHBlcmNlbnQtZW5jb2RlcyBVVEYtOCBzdHJpbmcsXG4gIC8vIHRoZW4gdGhlIHBlcmNlbnQgZW5jb2RpbmcgaXMgY29udmVydGVkIGludG8gcmF3IGJ5dGVzIHdoaWNoXG4gIC8vIGNhbiBiZSBmZWQgaW50byBidG9hLlxuICByZXR1cm4gYnRvYShlbmNvZGVVUklDb21wb25lbnQoc3RyKS5yZXBsYWNlKC8lKFswLTlBLUZdezJ9KS9nLFxuICAgIGZ1bmN0aW9uIHRvU29saWRCeXRlcyhtYXRjaCwgcDEpIHtcbiAgICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKCcweCcgKyBwMSk7XG4gICAgfSkpO1xufVxuXG4vLyBKU09OIHN0cmluZ2lmeSBoZWxwZXIgLSBwcmUtcHJvY2Vzc29yIGZvciBKU09OLnN0cmluZ2lmeVxuZnVuY3Rpb24ganNvbkJ1aWxkSGVscGVyKGtleSwgdmFsKSB7XG4gIGlmICh2YWwgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgLy8gQ29udmVydCBqYXZhc2NyaXB0IERhdGUgb2JqZWN0cyB0byByZmMzMzM5IHN0cmluZ3NcbiAgICB2YWwgPSByZmMzMzM5RGF0ZVN0cmluZyh2YWwpO1xuICB9IGVsc2UgaWYgKHZhbCBpbnN0YW5jZW9mIEFjY2Vzc01vZGUpIHtcbiAgICB2YWwgPSB2YWwuanNvbkhlbHBlcigpO1xuICB9IGVsc2UgaWYgKHZhbCA9PT0gdW5kZWZpbmVkIHx8IHZhbCA9PT0gbnVsbCB8fCB2YWwgPT09IGZhbHNlIHx8XG4gICAgKEFycmF5LmlzQXJyYXkodmFsKSAmJiB2YWwubGVuZ3RoID09IDApIHx8XG4gICAgKCh0eXBlb2YgdmFsID09ICdvYmplY3QnKSAmJiAoT2JqZWN0LmtleXModmFsKS5sZW5ndGggPT0gMCkpKSB7XG4gICAgLy8gc3RyaXAgb3V0IGVtcHR5IGVsZW1lbnRzIHdoaWxlIHNlcmlhbGl6aW5nIG9iamVjdHMgdG8gSlNPTlxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICByZXR1cm4gdmFsO1xufTtcblxuLy8gVHJpbXMgdmVyeSBsb25nIHN0cmluZ3MgKGVuY29kZWQgaW1hZ2VzKSB0byBtYWtlIGxvZ2dlZCBwYWNrZXRzIG1vcmUgcmVhZGFibGUuXG5mdW5jdGlvbiBqc29uTG9nZ2VySGVscGVyKGtleSwgdmFsKSB7XG4gIGlmICh0eXBlb2YgdmFsID09ICdzdHJpbmcnICYmIHZhbC5sZW5ndGggPiAxMjgpIHtcbiAgICByZXR1cm4gJzwnICsgdmFsLmxlbmd0aCArICcsIGJ5dGVzOiAnICsgdmFsLnN1YnN0cmluZygwLCAxMikgKyAnLi4uJyArIHZhbC5zdWJzdHJpbmcodmFsLmxlbmd0aCAtIDEyKSArICc+JztcbiAgfVxuICByZXR1cm4ganNvbkJ1aWxkSGVscGVyKGtleSwgdmFsKTtcbn07XG5cbi8vIFBhcnNlIGJyb3dzZXIgdXNlciBhZ2VudCB0byBleHRyYWN0IGJyb3dzZXIgbmFtZSBhbmQgdmVyc2lvbi5cbmZ1bmN0aW9uIGdldEJyb3dzZXJJbmZvKHVhLCBwcm9kdWN0KSB7XG4gIHVhID0gdWEgfHwgJyc7XG4gIGxldCByZWFjdG5hdGl2ZSA9ICcnO1xuICAvLyBDaGVjayBpZiB0aGlzIGlzIGEgUmVhY3ROYXRpdmUgYXBwLlxuICBpZiAoL3JlYWN0bmF0aXZlL2kudGVzdChwcm9kdWN0KSkge1xuICAgIHJlYWN0bmF0aXZlID0gJ1JlYWN0TmF0aXZlOyAnO1xuICB9XG4gIGxldCByZXN1bHQ7XG4gIC8vIFJlbW92ZSB1c2VsZXNzIHN0cmluZy5cbiAgdWEgPSB1YS5yZXBsYWNlKCcgKEtIVE1MLCBsaWtlIEdlY2tvKScsICcnKTtcbiAgLy8gVGVzdCBmb3IgV2ViS2l0LWJhc2VkIGJyb3dzZXIuXG4gIGxldCBtID0gdWEubWF0Y2goLyhBcHBsZVdlYktpdFxcL1suXFxkXSspL2kpO1xuICBpZiAobSkge1xuICAgIC8vIExpc3Qgb2YgY29tbW9uIHN0cmluZ3MsIGZyb20gbW9yZSB1c2VmdWwgdG8gbGVzcyB1c2VmdWwuXG4gICAgLy8gQWxsIHVua25vd24gc3RyaW5ncyBnZXQgdGhlIGhpZ2hlc3QgKC0xKSBwcmlvcml0eS5cbiAgICBjb25zdCBwcmlvcml0eSA9IFsnZWRnJywgJ2Nocm9tZScsICdzYWZhcmknLCAnbW9iaWxlJywgJ3ZlcnNpb24nXTtcbiAgICBsZXQgdG1wID0gdWEuc3Vic3RyKG0uaW5kZXggKyBtWzBdLmxlbmd0aCkuc3BsaXQoJyAnKTtcbiAgICBsZXQgdG9rZW5zID0gW107XG4gICAgbGV0IHZlcnNpb247IC8vIDEuMCBpbiBWZXJzaW9uLzEuMCBvciB1bmRlZmluZWQ7XG4gICAgLy8gU3BsaXQgc3RyaW5nIGxpa2UgJ05hbWUvMC4wLjAnIGludG8gWydOYW1lJywgJzAuMC4wJywgM10gd2hlcmUgdGhlIGxhc3QgZWxlbWVudCBpcyB0aGUgcHJpb3JpdHkuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0bXAubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBtMiA9IC8oW1xcdy5dKylbXFwvXShbXFwuXFxkXSspLy5leGVjKHRtcFtpXSk7XG4gICAgICBpZiAobTIpIHtcbiAgICAgICAgLy8gVW5rbm93biB2YWx1ZXMgYXJlIGhpZ2hlc3QgcHJpb3JpdHkgKC0xKS5cbiAgICAgICAgdG9rZW5zLnB1c2goW20yWzFdLCBtMlsyXSwgcHJpb3JpdHkuZmluZEluZGV4KChlKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIG0yWzFdLnRvTG93ZXJDYXNlKCkuc3RhcnRzV2l0aChlKTtcbiAgICAgICAgfSldKTtcbiAgICAgICAgaWYgKG0yWzFdID09ICdWZXJzaW9uJykge1xuICAgICAgICAgIHZlcnNpb24gPSBtMlsyXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICAvLyBTb3J0IGJ5IHByaW9yaXR5OiBtb3JlIGludGVyZXN0aW5nIGlzIGVhcmxpZXIgdGhhbiBsZXNzIGludGVyZXN0aW5nLlxuICAgIHRva2Vucy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICByZXR1cm4gYVsyXSAtIGJbMl07XG4gICAgfSk7XG4gICAgaWYgKHRva2Vucy5sZW5ndGggPiAwKSB7XG4gICAgICAvLyBSZXR1cm4gdGhlIGxlYXN0IGNvbW1vbiBicm93c2VyIHN0cmluZyBhbmQgdmVyc2lvbi5cbiAgICAgIGlmICh0b2tlbnNbMF1bMF0udG9Mb3dlckNhc2UoKS5zdGFydHNXaXRoKCdlZGcnKSkge1xuICAgICAgICB0b2tlbnNbMF1bMF0gPSAnRWRnZSc7XG4gICAgICB9IGVsc2UgaWYgKHRva2Vuc1swXVswXSA9PSAnT1BSJykge1xuICAgICAgICB0b2tlbnNbMF1bMF0gPSAnT3BlcmEnO1xuICAgICAgfSBlbHNlIGlmICh0b2tlbnNbMF1bMF0gPT0gJ1NhZmFyaScgJiYgdmVyc2lvbikge1xuICAgICAgICB0b2tlbnNbMF1bMV0gPSB2ZXJzaW9uO1xuICAgICAgfVxuICAgICAgcmVzdWx0ID0gdG9rZW5zWzBdWzBdICsgJy8nICsgdG9rZW5zWzBdWzFdO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBGYWlsZWQgdG8gSUQgdGhlIGJyb3dzZXIuIFJldHVybiB0aGUgd2Via2l0IHZlcnNpb24uXG4gICAgICByZXN1bHQgPSBtWzFdO1xuICAgIH1cbiAgfSBlbHNlIGlmICgvZmlyZWZveC9pLnRlc3QodWEpKSB7XG4gICAgbSA9IC9GaXJlZm94XFwvKFsuXFxkXSspL2cuZXhlYyh1YSk7XG4gICAgaWYgKG0pIHtcbiAgICAgIHJlc3VsdCA9ICdGaXJlZm94LycgKyBtWzFdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHQgPSAnRmlyZWZveC8/JztcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gTmVpdGhlciBBcHBsZVdlYktpdCBub3IgRmlyZWZveC4gVHJ5IHRoZSBsYXN0IHJlc29ydC5cbiAgICBtID0gLyhbXFx3Ll0rKVxcLyhbLlxcZF0rKS8uZXhlYyh1YSk7XG4gICAgaWYgKG0pIHtcbiAgICAgIHJlc3VsdCA9IG1bMV0gKyAnLycgKyBtWzJdO1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gdWEuc3BsaXQoJyAnKTtcbiAgICAgIHJlc3VsdCA9IG1bMF07XG4gICAgfVxuICB9XG5cbiAgLy8gU2hvcnRlbiB0aGUgdmVyc2lvbiB0byBvbmUgZG90ICdhLmJiLmNjYy5kIC0+IGEuYmInIGF0IG1vc3QuXG4gIG0gPSByZXN1bHQuc3BsaXQoJy8nKTtcbiAgaWYgKG0ubGVuZ3RoID4gMSkge1xuICAgIGNvbnN0IHYgPSBtWzFdLnNwbGl0KCcuJyk7XG4gICAgY29uc3QgbWlub3IgPSB2WzFdID8gJy4nICsgdlsxXS5zdWJzdHIoMCwgMikgOiAnJztcbiAgICByZXN1bHQgPSBgJHttWzBdfS8ke3ZbMF19JHttaW5vcn1gO1xuICB9XG4gIHJldHVybiByZWFjdG5hdGl2ZSArIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBAY2xhc3MgVGlub2RlXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyAtIGNvbmZpZ3VyYXRpb24gcGFyYW1ldGVycy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBjb25maWcuYXBwTmFtZSAtIE5hbWUgb2YgdGhlIGNhbGxpbmcgYXBwbGljYXRpb24gdG8gYmUgcmVwb3J0ZWQgaW4gdGhlIFVzZXIgQWdlbnQuXG4gKiBAcGFyYW0ge3N0cmluZ30gY29uZmlnLmhvc3QgLSBIb3N0IG5hbWUgYW5kIG9wdGlvbmFsIHBvcnQgbnVtYmVyIHRvIGNvbm5lY3QgdG8uXG4gKiBAcGFyYW0ge3N0cmluZ30gY29uZmlnLmFwaUtleSAtIEFQSSBrZXkgZ2VuZXJhdGVkIGJ5IDxjb2RlPmtleWdlbjwvY29kZT4uXG4gKiBAcGFyYW0ge3N0cmluZ30gY29uZmlnLnRyYW5zcG9ydCAtIFNlZSB7QGxpbmsgVGlub2RlLkNvbm5lY3Rpb24jdHJhbnNwb3J0fS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gY29uZmlnLnNlY3VyZSAtIFVzZSBTZWN1cmUgV2ViU29ja2V0IGlmIDxjb2RlPnRydWU8L2NvZGU+LlxuICogQHBhcmFtIHtzdHJpbmd9IGNvbmZpZy5wbGF0Zm9ybSAtIE9wdGlvbmFsIHBsYXRmb3JtIGlkZW50aWZpZXIsIG9uZSBvZiA8Y29kZT5cImlvc1wiPC9jb2RlPiwgPGNvZGU+XCJ3ZWJcIjwvY29kZT4sIDxjb2RlPlwiYW5kcm9pZFwiPC9jb2RlPi5cbiAqIEBwYXJhbSB7Ym9vbGVufSBjb25maWcucGVyc2lzdCAtIFVzZSBJbmRleGVkREIgcGVyc2lzdGVudCBzdG9yYWdlLlxuICogQHBhcmFtIHtmdW5jdGlvbn0gb25Db21wbGV0ZSAtIGNhbGxiYWNrIHRvIGNhbGwgd2hlbiBpbml0aWFsaXphdGlvbiBpcyBjb21wbGV0ZWQuXG4gKi9cbmV4cG9ydCBjbGFzcyBUaW5vZGUge1xuICBfaG9zdDtcbiAgX3NlY3VyZTtcblxuICBfYXBwTmFtZTtcblxuICAvLyBBUEkgS2V5LlxuICBfYXBpS2V5O1xuXG4gIC8vIE5hbWUgYW5kIHZlcnNpb24gb2YgdGhlIGJyb3dzZXIuXG4gIF9icm93c2VyID0gJyc7XG4gIF9wbGF0Zm9ybTtcbiAgLy8gSGFyZHdhcmVcbiAgX2h3b3MgPSAndW5kZWZpbmVkJztcbiAgX2h1bWFuTGFuZ3VhZ2UgPSAneHgnO1xuXG4gIC8vIExvZ2dpbmcgdG8gY29uc29sZSBlbmFibGVkXG4gIF9sb2dnaW5nRW5hYmxlZCA9IGZhbHNlO1xuICAvLyBXaGVuIGxvZ2dpbmcsIHRyaXAgbG9uZyBzdHJpbmdzIChiYXNlNjQtZW5jb2RlZCBpbWFnZXMpIGZvciByZWFkYWJpbGl0eVxuICBfdHJpbUxvbmdTdHJpbmdzID0gZmFsc2U7XG4gIC8vIFVJRCBvZiB0aGUgY3VycmVudGx5IGF1dGhlbnRpY2F0ZWQgdXNlci5cbiAgX215VUlEID0gbnVsbDtcbiAgLy8gU3RhdHVzIG9mIGNvbm5lY3Rpb246IGF1dGhlbnRpY2F0ZWQgb3Igbm90LlxuICBfYXV0aGVudGljYXRlZCA9IGZhbHNlO1xuICAvLyBMb2dpbiB1c2VkIGluIHRoZSBsYXN0IHN1Y2Nlc3NmdWwgYmFzaWMgYXV0aGVudGljYXRpb25cbiAgX2xvZ2luID0gbnVsbDtcbiAgLy8gVG9rZW4gd2hpY2ggY2FuIGJlIHVzZWQgZm9yIGxvZ2luIGluc3RlYWQgb2YgbG9naW4vcGFzc3dvcmQuXG4gIF9hdXRoVG9rZW4gPSBudWxsO1xuICAvLyBDb3VudGVyIG9mIHJlY2VpdmVkIHBhY2tldHNcbiAgX2luUGFja2V0Q291bnQgPSAwO1xuICAvLyBDb3VudGVyIGZvciBnZW5lcmF0aW5nIHVuaXF1ZSBtZXNzYWdlIElEc1xuICBfbWVzc2FnZUlkID0gTWF0aC5mbG9vcigoTWF0aC5yYW5kb20oKSAqIDB4RkZGRikgKyAweEZGRkYpO1xuICAvLyBJbmZvcm1hdGlvbiBhYm91dCB0aGUgc2VydmVyLCBpZiBjb25uZWN0ZWRcbiAgX3NlcnZlckluZm8gPSBudWxsO1xuICAvLyBQdXNoIG5vdGlmaWNhdGlvbiB0b2tlbi4gQ2FsbGVkIGRldmljZVRva2VuIGZvciBjb25zaXN0ZW5jeSB3aXRoIHRoZSBBbmRyb2lkIFNESy5cbiAgX2RldmljZVRva2VuID0gbnVsbDtcblxuICAvLyBDYWNoZSBvZiBwZW5kaW5nIHByb21pc2VzIGJ5IG1lc3NhZ2UgaWQuXG4gIF9wZW5kaW5nUHJvbWlzZXMgPSB7fTtcbiAgLy8gVGhlIFRpbWVvdXQgb2JqZWN0IHJldHVybmVkIGJ5IHRoZSByZWplY3QgZXhwaXJlZCBwcm9taXNlcyBzZXRJbnRlcnZhbC5cbiAgX2V4cGlyZVByb21pc2VzID0gbnVsbDtcblxuICAvLyBXZWJzb2NrZXQgb3IgbG9uZyBwb2xsaW5nIGNvbm5lY3Rpb24uXG4gIF9jb25uZWN0aW9uID0gbnVsbDtcblxuICAvLyBVc2UgaW5kZXhEQiBmb3IgY2FjaGluZyB0b3BpY3MgYW5kIG1lc3NhZ2VzLlxuICBfcGVyc2lzdCA9IGZhbHNlO1xuICAvLyBJbmRleGVkREIgd3JhcHBlciBvYmplY3QuXG4gIF9kYiA9IG51bGw7XG5cbiAgLy8gVGlub2RlJ3MgY2FjaGUgb2Ygb2JqZWN0c1xuICBfY2FjaGUgPSB7fTtcblxuICBjb25zdHJ1Y3Rvcihjb25maWcsIG9uQ29tcGxldGUpIHtcbiAgICB0aGlzLl9ob3N0ID0gY29uZmlnLmhvc3Q7XG4gICAgdGhpcy5fc2VjdXJlID0gY29uZmlnLnNlY3VyZTtcblxuICAgIC8vIENsaWVudC1wcm92aWRlZCBhcHBsaWNhdGlvbiBuYW1lLCBmb3JtYXQgPE5hbWU+Lzx2ZXJzaW9uIG51bWJlcj5cbiAgICB0aGlzLl9hcHBOYW1lID0gY29uZmlnLmFwcE5hbWUgfHwgXCJVbmRlZmluZWRcIjtcblxuICAgIC8vIEFQSSBLZXkuXG4gICAgdGhpcy5fYXBpS2V5ID0gY29uZmlnLmFwaUtleTtcblxuICAgIC8vIE5hbWUgYW5kIHZlcnNpb24gb2YgdGhlIGJyb3dzZXIuXG4gICAgdGhpcy5fcGxhdGZvcm0gPSBjb25maWcucGxhdGZvcm0gfHwgJ3dlYic7XG4gICAgLy8gVW5kZXJseWluZyBPUy5cbiAgICBpZiAodHlwZW9mIG5hdmlnYXRvciAhPSAndW5kZWZpbmVkJykge1xuICAgICAgdGhpcy5fYnJvd3NlciA9IGdldEJyb3dzZXJJbmZvKG5hdmlnYXRvci51c2VyQWdlbnQsIG5hdmlnYXRvci5wcm9kdWN0KTtcbiAgICAgIHRoaXMuX2h3b3MgPSBuYXZpZ2F0b3IucGxhdGZvcm07XG4gICAgICAvLyBUaGlzIGlzIHRoZSBkZWZhdWx0IGxhbmd1YWdlLiBJdCBjb3VsZCBiZSBjaGFuZ2VkIGJ5IGNsaWVudC5cbiAgICAgIHRoaXMuX2h1bWFuTGFuZ3VhZ2UgPSBuYXZpZ2F0b3IubGFuZ3VhZ2UgfHwgJ2VuLVVTJztcbiAgICB9XG5cbiAgICBDb25uZWN0aW9uLmxvZ2dlciA9IHRoaXMubG9nZ2VyO1xuICAgIERyYWZ0eS5sb2dnZXIgPSB0aGlzLmxvZ2dlcjtcblxuICAgIC8vIFdlYlNvY2tldCBvciBsb25nIHBvbGxpbmcgbmV0d29yayBjb25uZWN0aW9uLlxuICAgIGlmIChjb25maWcudHJhbnNwb3J0ICE9ICdscCcgJiYgY29uZmlnLnRyYW5zcG9ydCAhPSAnd3MnKSB7XG4gICAgICBjb25maWcudHJhbnNwb3J0ID0gZGV0ZWN0VHJhbnNwb3J0KCk7XG4gICAgfVxuICAgIHRoaXMuX2Nvbm5lY3Rpb24gPSBuZXcgQ29ubmVjdGlvbihjb25maWcsIENvbnN0LlBST1RPQ09MX1ZFUlNJT04sIC8qIGF1dG9yZWNvbm5lY3QgKi8gdHJ1ZSk7XG4gICAgdGhpcy5fY29ubmVjdGlvbi5vbk1lc3NhZ2UgPSAoZGF0YSkgPT4ge1xuICAgICAgLy8gQ2FsbCB0aGUgbWFpbiBtZXNzYWdlIGRpc3BhdGNoZXIuXG4gICAgICB0aGlzLiNkaXNwYXRjaE1lc3NhZ2UoZGF0YSk7XG4gICAgfVxuICAgIHRoaXMuX2Nvbm5lY3Rpb24ub25PcGVuID0gKCkgPT4ge1xuICAgICAgLy8gUmVhZHkgdG8gc3RhcnQgc2VuZGluZy5cbiAgICAgIHRoaXMuI2Nvbm5lY3Rpb25PcGVuKCk7XG4gICAgfVxuICAgIHRoaXMuX2Nvbm5lY3Rpb24ub25EaXNjb25uZWN0ID0gKGVyciwgY29kZSkgPT4ge1xuICAgICAgdGhpcy4jZGlzY29ubmVjdGVkKGVyciwgY29kZSk7XG4gICAgfVxuICAgIC8vIFdyYXBwZXIgZm9yIHRoZSByZWNvbm5lY3QgaXRlcmF0b3IgY2FsbGJhY2suXG4gICAgdGhpcy5fY29ubmVjdGlvbi5vbkF1dG9yZWNvbm5lY3RJdGVyYXRpb24gPSAodGltZW91dCwgcHJvbWlzZSkgPT4ge1xuICAgICAgaWYgKHRoaXMub25BdXRvcmVjb25uZWN0SXRlcmF0aW9uKSB7XG4gICAgICAgIHRoaXMub25BdXRvcmVjb25uZWN0SXRlcmF0aW9uKHRpbWVvdXQsIHByb21pc2UpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuX3BlcnNpc3QgPSBjb25maWcucGVyc2lzdDtcbiAgICAvLyBJbml0aWFsaXplIG9iamVjdCByZWdhcmRsZXNzLiBJdCBzaW1wbGlmaWVzIHRoZSBjb2RlLlxuICAgIHRoaXMuX2RiID0gbmV3IERCQ2FjaGUoZXJyID0+IHtcbiAgICAgIHRoaXMubG9nZ2VyKCdEQicsIGVycik7XG4gICAgfSwgdGhpcy5sb2dnZXIpO1xuXG4gICAgaWYgKHRoaXMuX3BlcnNpc3QpIHtcbiAgICAgIC8vIENyZWF0ZSB0aGUgcGVyc2lzdGVudCBjYWNoZS5cbiAgICAgIC8vIFN0b3JlIHByb21pc2VzIHRvIGJlIHJlc29sdmVkIHdoZW4gbWVzc2FnZXMgbG9hZCBpbnRvIG1lbW9yeS5cbiAgICAgIGNvbnN0IHByb20gPSBbXTtcbiAgICAgIHRoaXMuX2RiLmluaXREYXRhYmFzZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAvLyBGaXJzdCBsb2FkIHRvcGljcyBpbnRvIG1lbW9yeS5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2RiLm1hcFRvcGljcygoZGF0YSkgPT4ge1xuICAgICAgICAgIGxldCB0b3BpYyA9IHRoaXMuI2NhY2hlR2V0KCd0b3BpYycsIGRhdGEubmFtZSk7XG4gICAgICAgICAgaWYgKHRvcGljKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChkYXRhLm5hbWUgPT0gQ29uc3QuVE9QSUNfTUUpIHtcbiAgICAgICAgICAgIHRvcGljID0gbmV3IFRvcGljTWUoKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGRhdGEubmFtZSA9PSBDb25zdC5UT1BJQ19GTkQpIHtcbiAgICAgICAgICAgIHRvcGljID0gbmV3IFRvcGljRm5kKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRvcGljID0gbmV3IFRvcGljKGRhdGEubmFtZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuX2RiLmRlc2VyaWFsaXplVG9waWModG9waWMsIGRhdGEpO1xuICAgICAgICAgIHRoaXMuI2F0dGFjaENhY2hlVG9Ub3BpYyh0b3BpYyk7XG4gICAgICAgICAgdG9waWMuX2NhY2hlUHV0U2VsZigpO1xuICAgICAgICAgIC8vIFRvcGljIGxvYWRlZCBmcm9tIERCIGlzIG5vdCBuZXcuXG4gICAgICAgICAgZGVsZXRlIHRvcGljLl9uZXc7XG4gICAgICAgICAgLy8gUmVxdWVzdCB0byBsb2FkIG1lc3NhZ2VzIGFuZCBzYXZlIHRoZSBwcm9taXNlLlxuICAgICAgICAgIHByb20ucHVzaCh0b3BpYy5fbG9hZE1lc3NhZ2VzKHRoaXMuX2RiKSk7XG4gICAgICAgIH0pO1xuICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgIC8vIFRoZW4gbG9hZCB1c2Vycy5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2RiLm1hcFVzZXJzKChkYXRhKSA9PiB7XG4gICAgICAgICAgdGhpcy4jY2FjaGVQdXQoJ3VzZXInLCBkYXRhLnVpZCwgbWVyZ2VPYmooe30sIGRhdGEucHVibGljKSk7XG4gICAgICAgIH0pO1xuICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgIC8vIE5vdyB3YWl0IGZvciBhbGwgbWVzc2FnZXMgdG8gZmluaXNoIGxvYWRpbmcuXG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9tKTtcbiAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICBpZiAob25Db21wbGV0ZSkge1xuICAgICAgICAgIG9uQ29tcGxldGUoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxvZ2dlcihcIlBlcnNpc3RlbnQgY2FjaGUgaW5pdGlhbGl6ZWQuXCIpO1xuICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICBpZiAob25Db21wbGV0ZSkge1xuICAgICAgICAgIG9uQ29tcGxldGUoZXJyKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxvZ2dlcihcIkZhaWxlZCB0byBpbml0aWFsaXplIHBlcnNpc3RlbnQgY2FjaGU6XCIsIGVycik7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fZGIuZGVsZXRlRGF0YWJhc2UoKS50aGVuKCgpID0+IHtcbiAgICAgICAgaWYgKG9uQ29tcGxldGUpIHtcbiAgICAgICAgICBvbkNvbXBsZXRlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8vIFByaXZhdGUgbWV0aG9kcy5cblxuICAvLyBDb25zb2xlIGxvZ2dlci4gQmFiZWwgc29tZWhvdyBmYWlscyB0byBwYXJzZSAnLi4ucmVzdCcgcGFyYW1ldGVyLlxuICBsb2dnZXIoc3RyLCAuLi5hcmdzKSB7XG4gICAgaWYgKHRoaXMuX2xvZ2dpbmdFbmFibGVkKSB7XG4gICAgICBjb25zdCBkID0gbmV3IERhdGUoKTtcbiAgICAgIGNvbnN0IGRhdGVTdHJpbmcgPSAoJzAnICsgZC5nZXRVVENIb3VycygpKS5zbGljZSgtMikgKyAnOicgK1xuICAgICAgICAoJzAnICsgZC5nZXRVVENNaW51dGVzKCkpLnNsaWNlKC0yKSArICc6JyArXG4gICAgICAgICgnMCcgKyBkLmdldFVUQ1NlY29uZHMoKSkuc2xpY2UoLTIpICsgJy4nICtcbiAgICAgICAgKCcwMCcgKyBkLmdldFVUQ01pbGxpc2Vjb25kcygpKS5zbGljZSgtMyk7XG5cbiAgICAgIGNvbnNvbGUubG9nKCdbJyArIGRhdGVTdHJpbmcgKyAnXScsIHN0ciwgYXJncy5qb2luKCcgJykpO1xuICAgIH1cbiAgfVxuXG4gIC8vIEdlbmVyYXRvciBvZiBkZWZhdWx0IHByb21pc2VzIGZvciBzZW50IHBhY2tldHMuXG4gICNtYWtlUHJvbWlzZShpZCkge1xuICAgIGxldCBwcm9taXNlID0gbnVsbDtcbiAgICBpZiAoaWQpIHtcbiAgICAgIHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIC8vIFN0b3JlZCBjYWxsYmFja3Mgd2lsbCBiZSBjYWxsZWQgd2hlbiB0aGUgcmVzcG9uc2UgcGFja2V0IHdpdGggdGhpcyBJZCBhcnJpdmVzXG4gICAgICAgIHRoaXMuX3BlbmRpbmdQcm9taXNlc1tpZF0gPSB7XG4gICAgICAgICAgJ3Jlc29sdmUnOiByZXNvbHZlLFxuICAgICAgICAgICdyZWplY3QnOiByZWplY3QsXG4gICAgICAgICAgJ3RzJzogbmV3IERhdGUoKVxuICAgICAgICB9O1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBwcm9taXNlO1xuICB9O1xuXG4gIC8vIFJlc29sdmUgb3IgcmVqZWN0IGEgcGVuZGluZyBwcm9taXNlLlxuICAvLyBVbnJlc29sdmVkIHByb21pc2VzIGFyZSBzdG9yZWQgaW4gX3BlbmRpbmdQcm9taXNlcy5cbiAgI2V4ZWNQcm9taXNlKGlkLCBjb2RlLCBvbk9LLCBlcnJvclRleHQpIHtcbiAgICBjb25zdCBjYWxsYmFja3MgPSB0aGlzLl9wZW5kaW5nUHJvbWlzZXNbaWRdO1xuICAgIGlmIChjYWxsYmFja3MpIHtcbiAgICAgIGRlbGV0ZSB0aGlzLl9wZW5kaW5nUHJvbWlzZXNbaWRdO1xuICAgICAgaWYgKGNvZGUgPj0gMjAwICYmIGNvZGUgPCA0MDApIHtcbiAgICAgICAgaWYgKGNhbGxiYWNrcy5yZXNvbHZlKSB7XG4gICAgICAgICAgY2FsbGJhY2tzLnJlc29sdmUob25PSyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoY2FsbGJhY2tzLnJlamVjdCkge1xuICAgICAgICBjYWxsYmFja3MucmVqZWN0KG5ldyBFcnJvcihgJHtlcnJvclRleHR9ICgke2NvZGV9KWApKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBTZW5kIGEgcGFja2V0LiBJZiBwYWNrZXQgaWQgaXMgcHJvdmlkZWQgcmV0dXJuIGEgcHJvbWlzZS5cbiAgI3NlbmQocGt0LCBpZCkge1xuICAgIGxldCBwcm9taXNlO1xuICAgIGlmIChpZCkge1xuICAgICAgcHJvbWlzZSA9IHRoaXMuI21ha2VQcm9taXNlKGlkKTtcbiAgICB9XG4gICAgcGt0ID0gc2ltcGxpZnkocGt0KTtcbiAgICBsZXQgbXNnID0gSlNPTi5zdHJpbmdpZnkocGt0KTtcbiAgICB0aGlzLmxvZ2dlcihcIm91dDogXCIgKyAodGhpcy5fdHJpbUxvbmdTdHJpbmdzID8gSlNPTi5zdHJpbmdpZnkocGt0LCBqc29uTG9nZ2VySGVscGVyKSA6IG1zZykpO1xuICAgIHRyeSB7XG4gICAgICB0aGlzLl9jb25uZWN0aW9uLnNlbmRUZXh0KG1zZyk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAvLyBJZiBzZW5kVGV4dCB0aHJvd3MsIHdyYXAgdGhlIGVycm9yIGluIGEgcHJvbWlzZSBvciByZXRocm93LlxuICAgICAgaWYgKGlkKSB7XG4gICAgICAgIHRoaXMuI2V4ZWNQcm9taXNlKGlkLCBDb25uZWN0aW9uLk5FVFdPUktfRVJST1IsIG51bGwsIGVyci5tZXNzYWdlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IGVycjtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICAvLyBUaGUgbWFpbiBtZXNzYWdlIGRpc3BhdGNoZXIuXG4gICNkaXNwYXRjaE1lc3NhZ2UoZGF0YSkge1xuICAgIC8vIFNraXAgZW1wdHkgcmVzcG9uc2UuIFRoaXMgaGFwcGVucyB3aGVuIExQIHRpbWVzIG91dC5cbiAgICBpZiAoIWRhdGEpXG4gICAgICByZXR1cm47XG5cbiAgICB0aGlzLl9pblBhY2tldENvdW50Kys7XG5cbiAgICAvLyBTZW5kIHJhdyBtZXNzYWdlIHRvIGxpc3RlbmVyXG4gICAgaWYgKHRoaXMub25SYXdNZXNzYWdlKSB7XG4gICAgICB0aGlzLm9uUmF3TWVzc2FnZShkYXRhKTtcbiAgICB9XG5cbiAgICBpZiAoZGF0YSA9PT0gJzAnKSB7XG4gICAgICAvLyBTZXJ2ZXIgcmVzcG9uc2UgdG8gYSBuZXR3b3JrIHByb2JlLlxuICAgICAgaWYgKHRoaXMub25OZXR3b3JrUHJvYmUpIHtcbiAgICAgICAgdGhpcy5vbk5ldHdvcmtQcm9iZSgpO1xuICAgICAgfVxuICAgICAgLy8gTm8gcHJvY2Vzc2luZyBpcyBuZWNlc3NhcnkuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IHBrdCA9IEpTT04ucGFyc2UoZGF0YSwganNvblBhcnNlSGVscGVyKTtcbiAgICBpZiAoIXBrdCkge1xuICAgICAgdGhpcy5sb2dnZXIoXCJpbjogXCIgKyBkYXRhKTtcbiAgICAgIHRoaXMubG9nZ2VyKFwiRVJST1I6IGZhaWxlZCB0byBwYXJzZSBkYXRhXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmxvZ2dlcihcImluOiBcIiArICh0aGlzLl90cmltTG9uZ1N0cmluZ3MgPyBKU09OLnN0cmluZ2lmeShwa3QsIGpzb25Mb2dnZXJIZWxwZXIpIDogZGF0YSkpO1xuXG4gICAgICAvLyBTZW5kIGNvbXBsZXRlIHBhY2tldCB0byBsaXN0ZW5lclxuICAgICAgaWYgKHRoaXMub25NZXNzYWdlKSB7XG4gICAgICAgIHRoaXMub25NZXNzYWdlKHBrdCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChwa3QuY3RybCkge1xuICAgICAgICAvLyBIYW5kbGluZyB7Y3RybH0gbWVzc2FnZVxuICAgICAgICBpZiAodGhpcy5vbkN0cmxNZXNzYWdlKSB7XG4gICAgICAgICAgdGhpcy5vbkN0cmxNZXNzYWdlKHBrdC5jdHJsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJlc29sdmUgb3IgcmVqZWN0IGEgcGVuZGluZyBwcm9taXNlLCBpZiBhbnlcbiAgICAgICAgaWYgKHBrdC5jdHJsLmlkKSB7XG4gICAgICAgICAgdGhpcy4jZXhlY1Byb21pc2UocGt0LmN0cmwuaWQsIHBrdC5jdHJsLmNvZGUsIHBrdC5jdHJsLCBwa3QuY3RybC50ZXh0KTtcbiAgICAgICAgfVxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBpZiAocGt0LmN0cmwuY29kZSA9PSAyMDUgJiYgcGt0LmN0cmwudGV4dCA9PSAnZXZpY3RlZCcpIHtcbiAgICAgICAgICAgIC8vIFVzZXIgZXZpY3RlZCBmcm9tIHRvcGljLlxuICAgICAgICAgICAgY29uc3QgdG9waWMgPSB0aGlzLiNjYWNoZUdldCgndG9waWMnLCBwa3QuY3RybC50b3BpYyk7XG4gICAgICAgICAgICBpZiAodG9waWMpIHtcbiAgICAgICAgICAgICAgdG9waWMuX3Jlc2V0U3ViKCk7XG4gICAgICAgICAgICAgIGlmIChwa3QuY3RybC5wYXJhbXMgJiYgcGt0LmN0cmwucGFyYW1zLnVuc3ViKSB7XG4gICAgICAgICAgICAgICAgdG9waWMuX2dvbmUoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAocGt0LmN0cmwuY29kZSA8IDMwMCAmJiBwa3QuY3RybC5wYXJhbXMpIHtcbiAgICAgICAgICAgIGlmIChwa3QuY3RybC5wYXJhbXMud2hhdCA9PSAnZGF0YScpIHtcbiAgICAgICAgICAgICAgLy8gY29kZT0yMDgsIGFsbCBtZXNzYWdlcyByZWNlaXZlZDogXCJwYXJhbXNcIjp7XCJjb3VudFwiOjExLFwid2hhdFwiOlwiZGF0YVwifSxcbiAgICAgICAgICAgICAgY29uc3QgdG9waWMgPSB0aGlzLiNjYWNoZUdldCgndG9waWMnLCBwa3QuY3RybC50b3BpYyk7XG4gICAgICAgICAgICAgIGlmICh0b3BpYykge1xuICAgICAgICAgICAgICAgIHRvcGljLl9hbGxNZXNzYWdlc1JlY2VpdmVkKHBrdC5jdHJsLnBhcmFtcy5jb3VudCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAocGt0LmN0cmwucGFyYW1zLndoYXQgPT0gJ3N1YicpIHtcbiAgICAgICAgICAgICAgLy8gY29kZT0yMDQsIHRoZSB0b3BpYyBoYXMgbm8gKHJlZnJlc2hlZCkgc3Vic2NyaXB0aW9ucy5cbiAgICAgICAgICAgICAgY29uc3QgdG9waWMgPSB0aGlzLiNjYWNoZUdldCgndG9waWMnLCBwa3QuY3RybC50b3BpYyk7XG4gICAgICAgICAgICAgIGlmICh0b3BpYykge1xuICAgICAgICAgICAgICAgIC8vIFRyaWdnZXIgdG9waWMub25TdWJzVXBkYXRlZC5cbiAgICAgICAgICAgICAgICB0b3BpYy5fcHJvY2Vzc01ldGFTdWIoW10pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LCAwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIGlmIChwa3QubWV0YSkge1xuICAgICAgICAgICAgLy8gSGFuZGxpbmcgYSB7bWV0YX0gbWVzc2FnZS5cbiAgICAgICAgICAgIC8vIFByZWZlcnJlZCBBUEk6IFJvdXRlIG1ldGEgdG8gdG9waWMsIGlmIG9uZSBpcyByZWdpc3RlcmVkXG4gICAgICAgICAgICBjb25zdCB0b3BpYyA9IHRoaXMuI2NhY2hlR2V0KCd0b3BpYycsIHBrdC5tZXRhLnRvcGljKTtcbiAgICAgICAgICAgIGlmICh0b3BpYykge1xuICAgICAgICAgICAgICB0b3BpYy5fcm91dGVNZXRhKHBrdC5tZXRhKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHBrdC5tZXRhLmlkKSB7XG4gICAgICAgICAgICAgIHRoaXMuI2V4ZWNQcm9taXNlKHBrdC5tZXRhLmlkLCAyMDAsIHBrdC5tZXRhLCAnTUVUQScpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBTZWNvbmRhcnkgQVBJOiBjYWxsYmFja1xuICAgICAgICAgICAgaWYgKHRoaXMub25NZXRhTWVzc2FnZSkge1xuICAgICAgICAgICAgICB0aGlzLm9uTWV0YU1lc3NhZ2UocGt0Lm1ldGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAocGt0LmRhdGEpIHtcbiAgICAgICAgICAgIC8vIEhhbmRsaW5nIHtkYXRhfSBtZXNzYWdlXG4gICAgICAgICAgICAvLyBQcmVmZXJyZWQgQVBJOiBSb3V0ZSBkYXRhIHRvIHRvcGljLCBpZiBvbmUgaXMgcmVnaXN0ZXJlZFxuICAgICAgICAgICAgY29uc3QgdG9waWMgPSB0aGlzLiNjYWNoZUdldCgndG9waWMnLCBwa3QuZGF0YS50b3BpYyk7XG4gICAgICAgICAgICBpZiAodG9waWMpIHtcbiAgICAgICAgICAgICAgdG9waWMuX3JvdXRlRGF0YShwa3QuZGF0YSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFNlY29uZGFyeSBBUEk6IENhbGwgY2FsbGJhY2tcbiAgICAgICAgICAgIGlmICh0aGlzLm9uRGF0YU1lc3NhZ2UpIHtcbiAgICAgICAgICAgICAgdGhpcy5vbkRhdGFNZXNzYWdlKHBrdC5kYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKHBrdC5wcmVzKSB7XG4gICAgICAgICAgICAvLyBIYW5kbGluZyB7cHJlc30gbWVzc2FnZVxuICAgICAgICAgICAgLy8gUHJlZmVycmVkIEFQSTogUm91dGUgcHJlc2VuY2UgdG8gdG9waWMsIGlmIG9uZSBpcyByZWdpc3RlcmVkXG4gICAgICAgICAgICBjb25zdCB0b3BpYyA9IHRoaXMuI2NhY2hlR2V0KCd0b3BpYycsIHBrdC5wcmVzLnRvcGljKTtcbiAgICAgICAgICAgIGlmICh0b3BpYykge1xuICAgICAgICAgICAgICB0b3BpYy5fcm91dGVQcmVzKHBrdC5wcmVzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gU2Vjb25kYXJ5IEFQSSAtIGNhbGxiYWNrXG4gICAgICAgICAgICBpZiAodGhpcy5vblByZXNNZXNzYWdlKSB7XG4gICAgICAgICAgICAgIHRoaXMub25QcmVzTWVzc2FnZShwa3QucHJlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChwa3QuaW5mbykge1xuICAgICAgICAgICAgLy8ge2luZm99IG1lc3NhZ2UgLSByZWFkL3JlY2VpdmVkIG5vdGlmaWNhdGlvbnMgYW5kIGtleSBwcmVzc2VzXG4gICAgICAgICAgICAvLyBQcmVmZXJyZWQgQVBJOiBSb3V0ZSB7aW5mb319IHRvIHRvcGljLCBpZiBvbmUgaXMgcmVnaXN0ZXJlZFxuICAgICAgICAgICAgY29uc3QgdG9waWMgPSB0aGlzLiNjYWNoZUdldCgndG9waWMnLCBwa3QuaW5mby50b3BpYyk7XG4gICAgICAgICAgICBpZiAodG9waWMpIHtcbiAgICAgICAgICAgICAgdG9waWMuX3JvdXRlSW5mbyhwa3QuaW5mbyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFNlY29uZGFyeSBBUEkgLSBjYWxsYmFja1xuICAgICAgICAgICAgaWYgKHRoaXMub25JbmZvTWVzc2FnZSkge1xuICAgICAgICAgICAgICB0aGlzLm9uSW5mb01lc3NhZ2UocGt0LmluZm8pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlcihcIkVSUk9SOiBVbmtub3duIHBhY2tldCByZWNlaXZlZC5cIik7XG4gICAgICAgICAgfVxuICAgICAgICB9LCAwKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBDb25uZWN0aW9uIG9wZW4sIHJlYWR5IHRvIHN0YXJ0IHNlbmRpbmcuXG4gICNjb25uZWN0aW9uT3BlbigpIHtcbiAgICBpZiAoIXRoaXMuX2V4cGlyZVByb21pc2VzKSB7XG4gICAgICAvLyBSZWplY3QgcHJvbWlzZXMgd2hpY2ggaGF2ZSBub3QgYmVlbiByZXNvbHZlZCBmb3IgdG9vIGxvbmcuXG4gICAgICB0aGlzLl9leHBpcmVQcm9taXNlcyA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgY29uc3QgZXJyID0gbmV3IEVycm9yKFwiVGltZW91dCAoNTA0KVwiKTtcbiAgICAgICAgY29uc3QgZXhwaXJlcyA9IG5ldyBEYXRlKG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gQ29uc3QuRVhQSVJFX1BST01JU0VTX1RJTUVPVVQpO1xuICAgICAgICBmb3IgKGxldCBpZCBpbiB0aGlzLl9wZW5kaW5nUHJvbWlzZXMpIHtcbiAgICAgICAgICBsZXQgY2FsbGJhY2tzID0gdGhpcy5fcGVuZGluZ1Byb21pc2VzW2lkXTtcbiAgICAgICAgICBpZiAoY2FsbGJhY2tzICYmIGNhbGxiYWNrcy50cyA8IGV4cGlyZXMpIHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyKFwiUHJvbWlzZSBleHBpcmVkXCIsIGlkKTtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9wZW5kaW5nUHJvbWlzZXNbaWRdO1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrcy5yZWplY3QpIHtcbiAgICAgICAgICAgICAgY2FsbGJhY2tzLnJlamVjdChlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwgQ29uc3QuRVhQSVJFX1BST01JU0VTX1BFUklPRCk7XG4gICAgfVxuICAgIHRoaXMuaGVsbG8oKTtcbiAgfVxuXG4gICNkaXNjb25uZWN0ZWQoZXJyLCBjb2RlKSB7XG4gICAgdGhpcy5faW5QYWNrZXRDb3VudCA9IDA7XG4gICAgdGhpcy5fc2VydmVySW5mbyA9IG51bGw7XG4gICAgdGhpcy5fYXV0aGVudGljYXRlZCA9IGZhbHNlO1xuXG4gICAgaWYgKHRoaXMuX2V4cGlyZVByb21pc2VzKSB7XG4gICAgICBjbGVhckludGVydmFsKHRoaXMuX2V4cGlyZVByb21pc2VzKTtcbiAgICAgIHRoaXMuX2V4cGlyZVByb21pc2VzID0gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBNYXJrIGFsbCB0b3BpY3MgYXMgdW5zdWJzY3JpYmVkXG4gICAgdGhpcy4jY2FjaGVNYXAoJ3RvcGljJywgKHRvcGljLCBrZXkpID0+IHtcbiAgICAgIHRvcGljLl9yZXNldFN1YigpO1xuICAgIH0pO1xuXG4gICAgLy8gUmVqZWN0IGFsbCBwZW5kaW5nIHByb21pc2VzXG4gICAgZm9yIChsZXQga2V5IGluIHRoaXMuX3BlbmRpbmdQcm9taXNlcykge1xuICAgICAgY29uc3QgY2FsbGJhY2tzID0gdGhpcy5fcGVuZGluZ1Byb21pc2VzW2tleV07XG4gICAgICBpZiAoY2FsbGJhY2tzICYmIGNhbGxiYWNrcy5yZWplY3QpIHtcbiAgICAgICAgY2FsbGJhY2tzLnJlamVjdChlcnIpO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLl9wZW5kaW5nUHJvbWlzZXMgPSB7fTtcblxuICAgIGlmICh0aGlzLm9uRGlzY29ubmVjdCkge1xuICAgICAgdGhpcy5vbkRpc2Nvbm5lY3QoZXJyKTtcbiAgICB9XG4gIH1cblxuICAvLyBHZXQgVXNlciBBZ2VudCBzdHJpbmdcbiAgI2dldFVzZXJBZ2VudCgpIHtcbiAgICByZXR1cm4gdGhpcy5fYXBwTmFtZSArICcgKCcgKyAodGhpcy5fYnJvd3NlciA/IHRoaXMuX2Jyb3dzZXIgKyAnOyAnIDogJycpICsgdGhpcy5faHdvcyArICcpOyAnICsgQ29uc3QuTElCUkFSWTtcbiAgfVxuXG4gIC8vIEdlbmVyYXRvciBvZiBwYWNrZXRzIHN0dWJzXG4gICNpbml0UGFja2V0KHR5cGUsIHRvcGljKSB7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICBjYXNlICdoaSc6XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgJ2hpJzoge1xuICAgICAgICAgICAgJ2lkJzogdGhpcy5nZXROZXh0VW5pcXVlSWQoKSxcbiAgICAgICAgICAgICd2ZXInOiBDb25zdC5WRVJTSU9OLFxuICAgICAgICAgICAgJ3VhJzogdGhpcy4jZ2V0VXNlckFnZW50KCksXG4gICAgICAgICAgICAnZGV2JzogdGhpcy5fZGV2aWNlVG9rZW4sXG4gICAgICAgICAgICAnbGFuZyc6IHRoaXMuX2h1bWFuTGFuZ3VhZ2UsXG4gICAgICAgICAgICAncGxhdGYnOiB0aGlzLl9wbGF0Zm9ybVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgY2FzZSAnYWNjJzpcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAnYWNjJzoge1xuICAgICAgICAgICAgJ2lkJzogdGhpcy5nZXROZXh0VW5pcXVlSWQoKSxcbiAgICAgICAgICAgICd1c2VyJzogbnVsbCxcbiAgICAgICAgICAgICdzY2hlbWUnOiBudWxsLFxuICAgICAgICAgICAgJ3NlY3JldCc6IG51bGwsXG4gICAgICAgICAgICAnbG9naW4nOiBmYWxzZSxcbiAgICAgICAgICAgICd0YWdzJzogbnVsbCxcbiAgICAgICAgICAgICdkZXNjJzoge30sXG4gICAgICAgICAgICAnY3JlZCc6IHt9XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICBjYXNlICdsb2dpbic6XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgJ2xvZ2luJzoge1xuICAgICAgICAgICAgJ2lkJzogdGhpcy5nZXROZXh0VW5pcXVlSWQoKSxcbiAgICAgICAgICAgICdzY2hlbWUnOiBudWxsLFxuICAgICAgICAgICAgJ3NlY3JldCc6IG51bGxcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgIGNhc2UgJ3N1Yic6XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgJ3N1Yic6IHtcbiAgICAgICAgICAgICdpZCc6IHRoaXMuZ2V0TmV4dFVuaXF1ZUlkKCksXG4gICAgICAgICAgICAndG9waWMnOiB0b3BpYyxcbiAgICAgICAgICAgICdzZXQnOiB7fSxcbiAgICAgICAgICAgICdnZXQnOiB7fVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgY2FzZSAnbGVhdmUnOlxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICdsZWF2ZSc6IHtcbiAgICAgICAgICAgICdpZCc6IHRoaXMuZ2V0TmV4dFVuaXF1ZUlkKCksXG4gICAgICAgICAgICAndG9waWMnOiB0b3BpYyxcbiAgICAgICAgICAgICd1bnN1Yic6IGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICBjYXNlICdwdWInOlxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICdwdWInOiB7XG4gICAgICAgICAgICAnaWQnOiB0aGlzLmdldE5leHRVbmlxdWVJZCgpLFxuICAgICAgICAgICAgJ3RvcGljJzogdG9waWMsXG4gICAgICAgICAgICAnbm9lY2hvJzogZmFsc2UsXG4gICAgICAgICAgICAnaGVhZCc6IG51bGwsXG4gICAgICAgICAgICAnY29udGVudCc6IHt9XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICBjYXNlICdnZXQnOlxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICdnZXQnOiB7XG4gICAgICAgICAgICAnaWQnOiB0aGlzLmdldE5leHRVbmlxdWVJZCgpLFxuICAgICAgICAgICAgJ3RvcGljJzogdG9waWMsXG4gICAgICAgICAgICAnd2hhdCc6IG51bGwsXG4gICAgICAgICAgICAnZGVzYyc6IHt9LFxuICAgICAgICAgICAgJ3N1Yic6IHt9LFxuICAgICAgICAgICAgJ2RhdGEnOiB7fVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgY2FzZSAnc2V0JzpcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAnc2V0Jzoge1xuICAgICAgICAgICAgJ2lkJzogdGhpcy5nZXROZXh0VW5pcXVlSWQoKSxcbiAgICAgICAgICAgICd0b3BpYyc6IHRvcGljLFxuICAgICAgICAgICAgJ2Rlc2MnOiB7fSxcbiAgICAgICAgICAgICdzdWInOiB7fSxcbiAgICAgICAgICAgICd0YWdzJzogW11cbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgIGNhc2UgJ2RlbCc6XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgJ2RlbCc6IHtcbiAgICAgICAgICAgICdpZCc6IHRoaXMuZ2V0TmV4dFVuaXF1ZUlkKCksXG4gICAgICAgICAgICAndG9waWMnOiB0b3BpYyxcbiAgICAgICAgICAgICd3aGF0JzogbnVsbCxcbiAgICAgICAgICAgICdkZWxzZXEnOiBudWxsLFxuICAgICAgICAgICAgJ3VzZXInOiBudWxsLFxuICAgICAgICAgICAgJ2hhcmQnOiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgY2FzZSAnbm90ZSc6XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgJ25vdGUnOiB7XG4gICAgICAgICAgICAvLyBubyBpZCBieSBkZXNpZ25cbiAgICAgICAgICAgICd0b3BpYyc6IHRvcGljLFxuICAgICAgICAgICAgJ3doYXQnOiBudWxsLFxuICAgICAgICAgICAgJ3NlcSc6IHVuZGVmaW5lZCAvLyB0aGUgc2VydmVyLXNpZGUgbWVzc2FnZSBpZCBha25vd2xlZGdlZCBhcyByZWNlaXZlZCBvciByZWFkXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gcGFja2V0IHR5cGUgcmVxdWVzdGVkOiAke3R5cGV9YCk7XG4gICAgfVxuICB9XG5cbiAgLy8gQ2FjaGUgbWFuYWdlbWVudFxuICAjY2FjaGVQdXQodHlwZSwgbmFtZSwgb2JqKSB7XG4gICAgdGhpcy5fY2FjaGVbdHlwZSArICc6JyArIG5hbWVdID0gb2JqO1xuICB9XG4gICNjYWNoZUdldCh0eXBlLCBuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NhY2hlW3R5cGUgKyAnOicgKyBuYW1lXTtcbiAgfVxuICAjY2FjaGVEZWwodHlwZSwgbmFtZSkge1xuICAgIGRlbGV0ZSB0aGlzLl9jYWNoZVt0eXBlICsgJzonICsgbmFtZV07XG4gIH1cblxuICAvLyBFbnVtZXJhdGUgYWxsIGl0ZW1zIGluIGNhY2hlLCBjYWxsIGZ1bmMgZm9yIGVhY2ggaXRlbS5cbiAgLy8gRW51bWVyYXRpb24gc3RvcHMgaWYgZnVuYyByZXR1cm5zIHRydWUuXG4gICNjYWNoZU1hcCh0eXBlLCBmdW5jLCBjb250ZXh0KSB7XG4gICAgY29uc3Qga2V5ID0gdHlwZSA/IHR5cGUgKyAnOicgOiB1bmRlZmluZWQ7XG4gICAgZm9yIChsZXQgaWR4IGluIHRoaXMuX2NhY2hlKSB7XG4gICAgICBpZiAoIWtleSB8fCBpZHguaW5kZXhPZihrZXkpID09IDApIHtcbiAgICAgICAgaWYgKGZ1bmMuY2FsbChjb250ZXh0LCB0aGlzLl9jYWNoZVtpZHhdLCBpZHgpKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBNYWtlIGxpbWl0ZWQgY2FjaGUgbWFuYWdlbWVudCBhdmFpbGFibGUgdG8gdG9waWMuXG4gIC8vIENhY2hpbmcgdXNlci5wdWJsaWMgb25seS4gRXZlcnl0aGluZyBlbHNlIGlzIHBlci10b3BpYy5cbiAgI2F0dGFjaENhY2hlVG9Ub3BpYyh0b3BpYykge1xuICAgIHRvcGljLl90aW5vZGUgPSB0aGlzO1xuXG4gICAgdG9waWMuX2NhY2hlR2V0VXNlciA9ICh1aWQpID0+IHtcbiAgICAgIGNvbnN0IHB1YiA9IHRoaXMuI2NhY2hlR2V0KCd1c2VyJywgdWlkKTtcbiAgICAgIGlmIChwdWIpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB1c2VyOiB1aWQsXG4gICAgICAgICAgcHVibGljOiBtZXJnZU9iaih7fSwgcHViKVxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9O1xuICAgIHRvcGljLl9jYWNoZVB1dFVzZXIgPSAodWlkLCB1c2VyKSA9PiB7XG4gICAgICB0aGlzLiNjYWNoZVB1dCgndXNlcicsIHVpZCwgbWVyZ2VPYmooe30sIHVzZXIucHVibGljKSk7XG4gICAgfTtcbiAgICB0b3BpYy5fY2FjaGVEZWxVc2VyID0gKHVpZCkgPT4ge1xuICAgICAgdGhpcy4jY2FjaGVEZWwoJ3VzZXInLCB1aWQpO1xuICAgIH07XG4gICAgdG9waWMuX2NhY2hlUHV0U2VsZiA9IF8gPT4ge1xuICAgICAgdGhpcy4jY2FjaGVQdXQoJ3RvcGljJywgdG9waWMubmFtZSwgdG9waWMpO1xuICAgIH07XG4gICAgdG9waWMuX2NhY2hlRGVsU2VsZiA9IF8gPT4ge1xuICAgICAgdGhpcy4jY2FjaGVEZWwoJ3RvcGljJywgdG9waWMubmFtZSk7XG4gICAgfTtcbiAgfVxuXG4gIC8vIE9uIHN1Y2Nlc3NmdWwgbG9naW4gc2F2ZSBzZXJ2ZXItcHJvdmlkZWQgZGF0YS5cbiAgI2xvZ2luU3VjY2Vzc2Z1bChjdHJsKSB7XG4gICAgaWYgKCFjdHJsLnBhcmFtcyB8fCAhY3RybC5wYXJhbXMudXNlcikge1xuICAgICAgcmV0dXJuIGN0cmw7XG4gICAgfVxuICAgIC8vIFRoaXMgaXMgYSByZXNwb25zZSB0byBhIHN1Y2Nlc3NmdWwgbG9naW4sXG4gICAgLy8gZXh0cmFjdCBVSUQgYW5kIHNlY3VyaXR5IHRva2VuLCBzYXZlIGl0IGluIFRpbm9kZSBtb2R1bGVcbiAgICB0aGlzLl9teVVJRCA9IGN0cmwucGFyYW1zLnVzZXI7XG4gICAgdGhpcy5fYXV0aGVudGljYXRlZCA9IChjdHJsICYmIGN0cmwuY29kZSA+PSAyMDAgJiYgY3RybC5jb2RlIDwgMzAwKTtcbiAgICBpZiAoY3RybC5wYXJhbXMgJiYgY3RybC5wYXJhbXMudG9rZW4gJiYgY3RybC5wYXJhbXMuZXhwaXJlcykge1xuICAgICAgdGhpcy5fYXV0aFRva2VuID0ge1xuICAgICAgICB0b2tlbjogY3RybC5wYXJhbXMudG9rZW4sXG4gICAgICAgIGV4cGlyZXM6IGN0cmwucGFyYW1zLmV4cGlyZXNcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2F1dGhUb2tlbiA9IG51bGw7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMub25Mb2dpbikge1xuICAgICAgdGhpcy5vbkxvZ2luKGN0cmwuY29kZSwgY3RybC50ZXh0KTtcbiAgICB9XG5cbiAgICByZXR1cm4gY3RybDtcbiAgfVxuXG4gIC8vIFN0YXRpYyBtZXRob2RzLlxuICAvKipcbiAgICogSGVscGVyIG1ldGhvZCB0byBwYWNrYWdlIGFjY291bnQgY3JlZGVudGlhbC5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nIHwgQ3JlZGVudGlhbH0gbWV0aCAtIHZhbGlkYXRpb24gbWV0aG9kIG9yIG9iamVjdCB3aXRoIHZhbGlkYXRpb24gZGF0YS5cbiAgICogQHBhcmFtIHtzdHJpbmc9fSB2YWwgLSB2YWxpZGF0aW9uIHZhbHVlIChlLmcuIGVtYWlsIG9yIHBob25lIG51bWJlcikuXG4gICAqIEBwYXJhbSB7T2JqZWN0PX0gcGFyYW1zIC0gdmFsaWRhdGlvbiBwYXJhbWV0ZXJzLlxuICAgKiBAcGFyYW0ge3N0cmluZz19IHJlc3AgLSB2YWxpZGF0aW9uIHJlc3BvbnNlLlxuICAgKlxuICAgKiBAcmV0dXJucyB7QXJyYXkuPENyZWRlbnRpYWw+fSBhcnJheSB3aXRoIGEgc2luZ2xlIGNyZWRlbnRpYWwgb3IgPGNvZGU+bnVsbDwvY29kZT4gaWYgbm8gdmFsaWQgY3JlZGVudGlhbHMgd2VyZSBnaXZlbi5cbiAgICovXG4gIHN0YXRpYyBjcmVkZW50aWFsKG1ldGgsIHZhbCwgcGFyYW1zLCByZXNwKSB7XG4gICAgaWYgKHR5cGVvZiBtZXRoID09ICdvYmplY3QnKSB7XG4gICAgICAoe1xuICAgICAgICB2YWwsXG4gICAgICAgIHBhcmFtcyxcbiAgICAgICAgcmVzcCxcbiAgICAgICAgbWV0aFxuICAgICAgfSA9IG1ldGgpO1xuICAgIH1cbiAgICBpZiAobWV0aCAmJiAodmFsIHx8IHJlc3ApKSB7XG4gICAgICByZXR1cm4gW3tcbiAgICAgICAgJ21ldGgnOiBtZXRoLFxuICAgICAgICAndmFsJzogdmFsLFxuICAgICAgICAncmVzcCc6IHJlc3AsXG4gICAgICAgICdwYXJhbXMnOiBwYXJhbXNcbiAgICAgIH1dO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmUgdG9waWMgdHlwZSBmcm9tIHRvcGljJ3MgbmFtZTogZ3JwLCBwMnAsIG1lLCBmbmQsIHN5cy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gdGVzdC5cbiAgICogQHJldHVybnMge3N0cmluZ30gT25lIG9mIDxjb2RlPlwibWVcIjwvY29kZT4sIDxjb2RlPlwiZm5kXCI8L2NvZGU+LCA8Y29kZT5cInN5c1wiPC9jb2RlPiwgPGNvZGU+XCJncnBcIjwvY29kZT4sXG4gICAqICAgIDxjb2RlPlwicDJwXCI8L2NvZGU+IG9yIDxjb2RlPnVuZGVmaW5lZDwvY29kZT4uXG4gICAqL1xuICBzdGF0aWMgdG9waWNUeXBlKG5hbWUpIHtcbiAgICByZXR1cm4gVG9waWMudG9waWNUeXBlKG5hbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSBnaXZlbiB0b3BpYyBuYW1lIGlzIGEgbmFtZSBvZiBhICdtZScgdG9waWMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIHRlc3QuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0aGUgbmFtZSBpcyBhIG5hbWUgb2YgYSAnbWUnIHRvcGljLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgc3RhdGljIGlzTWVUb3BpY05hbWUobmFtZSkge1xuICAgIHJldHVybiBUb3BpYy5pc01lVG9waWNOYW1lKG5hbWUpO1xuICB9XG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgZ2l2ZW4gdG9waWMgbmFtZSBpcyBhIG5hbWUgb2YgYSBncm91cCB0b3BpYy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gdGVzdC5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIHRoZSBuYW1lIGlzIGEgbmFtZSBvZiBhIGdyb3VwIHRvcGljLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgc3RhdGljIGlzR3JvdXBUb3BpY05hbWUobmFtZSkge1xuICAgIHJldHVybiBUb3BpYy5pc0dyb3VwVG9waWNOYW1lKG5hbWUpO1xuICB9XG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgZ2l2ZW4gdG9waWMgbmFtZSBpcyBhIG5hbWUgb2YgYSBwMnAgdG9waWMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIHRlc3QuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0aGUgbmFtZSBpcyBhIG5hbWUgb2YgYSBwMnAgdG9waWMsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBzdGF0aWMgaXNQMlBUb3BpY05hbWUobmFtZSkge1xuICAgIHJldHVybiBUb3BpYy5pc1AyUFRvcGljTmFtZShuYW1lKTtcbiAgfVxuICAvKipcbiAgICogQ2hlY2sgaWYgdGhlIGdpdmVuIHRvcGljIG5hbWUgaXMgYSBuYW1lIG9mIGEgY29tbXVuaWNhdGlvbiB0b3BpYywgaS5lLiBQMlAgb3IgZ3JvdXAuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIHRlc3QuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0aGUgbmFtZSBpcyBhIG5hbWUgb2YgYSBwMnAgb3IgZ3JvdXAgdG9waWMsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBzdGF0aWMgaXNDb21tVG9waWNOYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gVG9waWMuaXNDb21tVG9waWNOYW1lKG5hbWUpO1xuICB9XG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgdG9waWMgbmFtZSBpcyBhIG5hbWUgb2YgYSBuZXcgdG9waWMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIHRvcGljIG5hbWUgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIHtib29sZWFufSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0aGUgbmFtZSBpcyBhIG5hbWUgb2YgYSBuZXcgdG9waWMsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBzdGF0aWMgaXNOZXdHcm91cFRvcGljTmFtZShuYW1lKSB7XG4gICAgcmV0dXJuIFRvcGljLmlzTmV3R3JvdXBUb3BpY05hbWUobmFtZSk7XG4gIH1cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSB0b3BpYyBuYW1lIGlzIGEgbmFtZSBvZiBhIGNoYW5uZWwuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIHRvcGljIG5hbWUgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIHtib29sZWFufSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0aGUgbmFtZSBpcyBhIG5hbWUgb2YgYSBjaGFubmVsLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgc3RhdGljIGlzQ2hhbm5lbFRvcGljTmFtZShuYW1lKSB7XG4gICAgcmV0dXJuIFRvcGljLmlzQ2hhbm5lbFRvcGljTmFtZShuYW1lKTtcbiAgfVxuICAvKipcbiAgICogUmV0dXJuIGluZm9ybWF0aW9uIGFib3V0IHRoZSBjdXJyZW50IHZlcnNpb24gb2YgdGhpcyBUaW5vZGUgY2xpZW50IGxpYnJhcnkuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBzZW1hbnRpYyB2ZXJzaW9uIG9mIHRoZSBsaWJyYXJ5LCBlLmcuIDxjb2RlPlwiMC4xNS41LXJjMVwiPC9jb2RlPi5cbiAgICovXG4gIHN0YXRpYyBnZXRWZXJzaW9uKCkge1xuICAgIHJldHVybiBDb25zdC5WRVJTSU9OO1xuICB9XG4gIC8qKlxuICAgKiBUbyB1c2UgVGlub2RlIGluIGEgbm9uIGJyb3dzZXIgY29udGV4dCwgc3VwcGx5IFdlYlNvY2tldCBhbmQgWE1MSHR0cFJlcXVlc3QgcHJvdmlkZXJzLlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQHBhcmFtIHdzUHJvdmlkZXIgPGNvZGU+V2ViU29ja2V0PC9jb2RlPiBwcm92aWRlciwgZS5nLiBmb3Igbm9kZUpTICwgPGNvZGU+cmVxdWlyZSgnd3MnKTwvY29kZT4uXG4gICAqIEBwYXJhbSB4aHJQcm92aWRlciA8Y29kZT5YTUxIdHRwUmVxdWVzdDwvY29kZT4gcHJvdmlkZXIsIGUuZy4gZm9yIG5vZGUgPGNvZGU+cmVxdWlyZSgneGhyJyk8L2NvZGU+LlxuICAgKi9cbiAgc3RhdGljIHNldE5ldHdvcmtQcm92aWRlcnMod3NQcm92aWRlciwgeGhyUHJvdmlkZXIpIHtcbiAgICBXZWJTb2NrZXRQcm92aWRlciA9IHdzUHJvdmlkZXI7XG4gICAgWEhSUHJvdmlkZXIgPSB4aHJQcm92aWRlcjtcblxuICAgIENvbm5lY3Rpb24uc2V0TmV0d29ya1Byb3ZpZGVycyhXZWJTb2NrZXRQcm92aWRlciwgWEhSUHJvdmlkZXIpO1xuICAgIExhcmdlRmlsZUhlbHBlci5zZXROZXR3b3JrUHJvdmlkZXIoWEhSUHJvdmlkZXIpO1xuICB9XG4gIC8qKlxuICAgKiBUbyB1c2UgVGlub2RlIGluIGEgbm9uIGJyb3dzZXIgY29udGV4dCwgc3VwcGx5IDxjb2RlPmluZGV4ZWREQjwvY29kZT4gcHJvdmlkZXIuXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAcGFyYW0gaWRiUHJvdmlkZXIgPGNvZGU+aW5kZXhlZERCPC9jb2RlPiBwcm92aWRlciwgZS5nLiBmb3Igbm9kZUpTICwgPGNvZGU+cmVxdWlyZSgnZmFrZS1pbmRleGVkZGInKTwvY29kZT4uXG4gICAqL1xuICBzdGF0aWMgc2V0RGF0YWJhc2VQcm92aWRlcihpZGJQcm92aWRlcikge1xuICAgIEluZGV4ZWREQlByb3ZpZGVyID0gaWRiUHJvdmlkZXI7XG5cbiAgICBEQkNhY2hlLnNldERhdGFiYXNlUHJvdmlkZXIoSW5kZXhlZERCUHJvdmlkZXIpO1xuICB9XG4gIC8qKlxuICAgKiBSZXR1cm4gaW5mb3JtYXRpb24gYWJvdXQgdGhlIGN1cnJlbnQgbmFtZSBhbmQgdmVyc2lvbiBvZiB0aGlzIFRpbm9kZSBsaWJyYXJ5LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHJldHVybnMge3N0cmluZ30gdGhlIG5hbWUgb2YgdGhlIGxpYnJhcnkgYW5kIGl0J3MgdmVyc2lvbi5cbiAgICovXG4gIHN0YXRpYyBnZXRMaWJyYXJ5KCkge1xuICAgIHJldHVybiBDb25zdC5MSUJSQVJZO1xuICB9XG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgZ2l2ZW4gc3RyaW5nIHJlcHJlc2VudHMgPGNvZGU+TlVMTDwvY29kZT4gdmFsdWUgYXMgZGVmaW5lZCBieSBUaW5vZGUgKDxjb2RlPidcXHUyNDIxJzwvY29kZT4pLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN0ciAtIHN0cmluZyB0byBjaGVjayBmb3IgPGNvZGU+TlVMTDwvY29kZT4gdmFsdWUuXG4gICAqXG4gICAqIEByZXR1cm5zIHtib29sZWFufSA8Y29kZT50cnVlPC9jb2RlPiBpZiBzdHJpbmcgcmVwcmVzZW50cyA8Y29kZT5OVUxMPC9jb2RlPiB2YWx1ZSwgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIHN0YXRpYyBpc051bGxWYWx1ZShzdHIpIHtcbiAgICByZXR1cm4gc3RyID09PSBDb25zdC5ERUxfQ0hBUjtcbiAgfVxuICAvKipcbiAgICogQ2hlY2sgaWYgdGhlIGdpdmVuIFVSTCBzdHJpbmcgaXMgYSByZWxhdGl2ZSBVUkwuXG4gICAqIENoZWNrIGZvciBjYXNlcyBsaWtlOlxuICAgKiAgPGNvZGU+J2h0dHA6Ly9leGFtcGxlLmNvbSc8L2NvZGU+XG4gICAqICA8Y29kZT4nIGh0dHA6Ly9leGFtcGxlLmNvbSc8L2NvZGU+XG4gICAqICA8Y29kZT4nLy9leGFtcGxlLmNvbS8nPC9jb2RlPlxuICAgKiAgPGNvZGU+J2h0dHA6ZXhhbXBsZS5jb20nPC9jb2RlPlxuICAgKiAgPGNvZGU+J2h0dHA6L2V4YW1wbGUuY29tJzwvY29kZT5cbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgLSBVUkwgc3RyaW5nIHRvIGNoZWNrLlxuICAgKlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgdGhlIFVSTCBpcyByZWxhdGl2ZSwgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIHN0YXRpYyBpc1JlbGF0aXZlVVJMKHVybCkge1xuICAgIHJldHVybiAhL15cXHMqKFthLXpdW2EtejAtOSsuLV0qOnxcXC9cXC8pL2ltLnRlc3QodXJsKTtcbiAgfVxuXG4gIC8vIEluc3RhbmNlIG1ldGhvZHMuXG5cbiAgLy8gR2VuZXJhdGVzIHVuaXF1ZSBtZXNzYWdlIElEc1xuICBnZXROZXh0VW5pcXVlSWQoKSB7XG4gICAgcmV0dXJuICh0aGlzLl9tZXNzYWdlSWQgIT0gMCkgPyAnJyArIHRoaXMuX21lc3NhZ2VJZCsrIDogdW5kZWZpbmVkO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDb25uZWN0IHRvIHRoZSBzZXJ2ZXIuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBob3N0XyAtIG5hbWUgb2YgdGhlIGhvc3QgdG8gY29ubmVjdCB0by5cbiAgICpcbiAgICogQHJldHVybiB7UHJvbWlzZX0gUHJvbWlzZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBjb25uZWN0aW9uIGNhbGwgY29tcGxldGVzOlxuICAgKiAgICA8Y29kZT5yZXNvbHZlKCk8L2NvZGU+IGlzIGNhbGxlZCB3aXRob3V0IHBhcmFtZXRlcnMsIDxjb2RlPnJlamVjdCgpPC9jb2RlPiByZWNlaXZlcyB0aGVcbiAgICogICAgPGNvZGU+RXJyb3I8L2NvZGU+IGFzIGEgc2luZ2xlIHBhcmFtZXRlci5cbiAgICovXG4gIGNvbm5lY3QoaG9zdF8pIHtcbiAgICByZXR1cm4gdGhpcy5fY29ubmVjdGlvbi5jb25uZWN0KGhvc3RfKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRlbXB0IHRvIHJlY29ubmVjdCB0byB0aGUgc2VydmVyIGltbWVkaWF0ZWx5LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZm9yY2UgLSByZWNvbm5lY3QgZXZlbiBpZiB0aGVyZSBpcyBhIGNvbm5lY3Rpb24gYWxyZWFkeS5cbiAgICovXG4gIHJlY29ubmVjdChmb3JjZSkge1xuICAgIHRoaXMuX2Nvbm5lY3Rpb24ucmVjb25uZWN0KGZvcmNlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNjb25uZWN0IGZyb20gdGhlIHNlcnZlci5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICovXG4gIGRpc2Nvbm5lY3QoKSB7XG4gICAgdGhpcy5fY29ubmVjdGlvbi5kaXNjb25uZWN0KCk7XG4gIH1cblxuICAvKipcbiAgICogQ2xlYXIgcGVyc2lzdGVudCBjYWNoZTogcmVtb3ZlIEluZGV4ZWREQi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICogQHJldHVybiB7UHJvbWlzZX0gUHJvbWlzZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBvcGVyYXRpb24gaXMgY29tcGxldGVkLlxuICAgKi9cbiAgY2xlYXJTdG9yYWdlKCkge1xuICAgIGlmICh0aGlzLl9kYi5pc1JlYWR5KCkpIHtcbiAgICAgIHJldHVybiB0aGlzLl9kYi5kZWxldGVEYXRhYmFzZSgpO1xuICAgIH1cbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSBwZXJzaXN0ZW50IGNhY2hlOiBjcmVhdGUgSW5kZXhlZERCIGNhY2hlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBQcm9taXNlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIG9wZXJhdGlvbiBpcyBjb21wbGV0ZWQuXG4gICAqL1xuICBpbml0U3RvcmFnZSgpIHtcbiAgICBpZiAoIXRoaXMuX2RiLmlzUmVhZHkoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuX2RiLmluaXREYXRhYmFzZSgpO1xuICAgIH1cbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gIH1cblxuICAvKipcbiAgICogU2VuZCBhIG5ldHdvcmsgcHJvYmUgbWVzc2FnZSB0byBtYWtlIHN1cmUgdGhlIGNvbm5lY3Rpb24gaXMgYWxpdmUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqL1xuICBuZXR3b3JrUHJvYmUoKSB7XG4gICAgdGhpcy5fY29ubmVjdGlvbi5wcm9iZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGZvciBsaXZlIGNvbm5lY3Rpb24gdG8gc2VydmVyLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgdGhlcmUgaXMgYSBsaXZlIGNvbm5lY3Rpb24sIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBpc0Nvbm5lY3RlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fY29ubmVjdGlvbi5pc0Nvbm5lY3RlZCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGNvbm5lY3Rpb24gaXMgYXV0aGVudGljYXRlZCAobGFzdCBsb2dpbiB3YXMgc3VjY2Vzc2Z1bCkuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqIEByZXR1cm5zIHtib29sZWFufSA8Y29kZT50cnVlPC9jb2RlPiBpZiBhdXRoZW50aWNhdGVkLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgaXNBdXRoZW50aWNhdGVkKCkge1xuICAgIHJldHVybiB0aGlzLl9hdXRoZW50aWNhdGVkO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBBUEkga2V5IGFuZCBhdXRoIHRva2VuIHRvIHRoZSByZWxhdGl2ZSBVUkwgbWFraW5nIGl0IHVzYWJsZSBmb3IgZ2V0dGluZyBkYXRhXG4gICAqIGZyb20gdGhlIHNlcnZlciBpbiBhIHNpbXBsZSA8Y29kZT5IVFRQIEdFVDwvY29kZT4gcmVxdWVzdC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IFVSTCAtIFVSTCB0byB3cmFwLlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBVUkwgd2l0aCBhcHBlbmRlZCBBUEkga2V5IGFuZCB0b2tlbiwgaWYgdmFsaWQgdG9rZW4gaXMgcHJlc2VudC5cbiAgICovXG4gIGF1dGhvcml6ZVVSTCh1cmwpIHtcbiAgICBpZiAodHlwZW9mIHVybCAhPSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIHVybDtcbiAgICB9XG5cbiAgICBpZiAoVGlub2RlLmlzUmVsYXRpdmVVUkwodXJsKSkge1xuICAgICAgLy8gRmFrZSBiYXNlIHRvIG1ha2UgdGhlIHJlbGF0aXZlIFVSTCBwYXJzZWFibGUuXG4gICAgICBjb25zdCBiYXNlID0gJ3NjaGVtZTovL2hvc3QvJztcbiAgICAgIGNvbnN0IHBhcnNlZCA9IG5ldyBVUkwodXJsLCBiYXNlKTtcbiAgICAgIGlmICh0aGlzLl9hcGlLZXkpIHtcbiAgICAgICAgcGFyc2VkLnNlYXJjaFBhcmFtcy5hcHBlbmQoJ2FwaWtleScsIHRoaXMuX2FwaUtleSk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5fYXV0aFRva2VuICYmIHRoaXMuX2F1dGhUb2tlbi50b2tlbikge1xuICAgICAgICBwYXJzZWQuc2VhcmNoUGFyYW1zLmFwcGVuZCgnYXV0aCcsICd0b2tlbicpO1xuICAgICAgICBwYXJzZWQuc2VhcmNoUGFyYW1zLmFwcGVuZCgnc2VjcmV0JywgdGhpcy5fYXV0aFRva2VuLnRva2VuKTtcbiAgICAgIH1cbiAgICAgIC8vIENvbnZlcnQgYmFjayB0byBzdHJpbmcgYW5kIHN0cmlwIGZha2UgYmFzZSBVUkwgZXhjZXB0IGZvciB0aGUgcm9vdCBzbGFzaC5cbiAgICAgIHVybCA9IHBhcnNlZC50b1N0cmluZygpLnN1YnN0cmluZyhiYXNlLmxlbmd0aCAtIDEpO1xuICAgIH1cbiAgICByZXR1cm4gdXJsO1xuICB9XG5cbiAgLyoqXG4gICAqIEB0eXBlZGVmIEFjY291bnRQYXJhbXNcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAcHJvcGVydHkge1Rpbm9kZS5EZWZBY3M9fSBkZWZhY3MgLSBEZWZhdWx0IGFjY2VzcyBwYXJhbWV0ZXJzIGZvciB1c2VyJ3MgPGNvZGU+bWU8L2NvZGU+IHRvcGljLlxuICAgKiBAcHJvcGVydHkge09iamVjdD19IHB1YmxpYyAtIFB1YmxpYyBhcHBsaWNhdGlvbi1kZWZpbmVkIGRhdGEgZXhwb3NlZCBvbiA8Y29kZT5tZTwvY29kZT4gdG9waWMuXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0PX0gcHJpdmF0ZSAtIFByaXZhdGUgYXBwbGljYXRpb24tZGVmaW5lZCBkYXRhIGFjY2Vzc2libGUgb24gPGNvZGU+bWU8L2NvZGU+IHRvcGljLlxuICAgKiBAcHJvcGVydHkge09iamVjdD19IHRydXN0ZWQgLSBUcnVzdGVkIHVzZXIgZGF0YSB3aGljaCBjYW4gYmUgc2V0IGJ5IGEgcm9vdCB1c2VyIG9ubHkuXG4gICAqIEBwcm9wZXJ0eSB7QXJyYXkuPHN0cmluZz59IHRhZ3MgLSBhcnJheSBvZiBzdHJpbmcgdGFncyBmb3IgdXNlciBkaXNjb3ZlcnkuXG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nPX0gdG9rZW4gLSBhdXRoZW50aWNhdGlvbiB0b2tlbiB0byB1c2UuXG4gICAqIEBwcm9wZXJ0eSB7QXJyYXkuPHN0cmluZz49fSBhdHRhY2htZW50cyAtIEFycmF5IG9mIHJlZmVyZW5jZXMgdG8gb3V0IG9mIGJhbmQgYXR0YWNobWVudHMgdXNlZCBpbiBhY2NvdW50IGRlc2NyaXB0aW9uLlxuICAgKi9cbiAgLyoqXG4gICAqIEB0eXBlZGVmIERlZkFjc1xuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nPX0gYXV0aCAtIEFjY2VzcyBtb2RlIGZvciA8Y29kZT5tZTwvY29kZT4gZm9yIGF1dGhlbnRpY2F0ZWQgdXNlcnMuXG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nPX0gYW5vbiAtIEFjY2VzcyBtb2RlIGZvciA8Y29kZT5tZTwvY29kZT4gZm9yIGFub255bW91cyB1c2Vycy5cbiAgICovXG5cbiAgLyoqXG4gICAqIENyZWF0ZSBvciB1cGRhdGUgYW4gYWNjb3VudC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVpZCAtIFVzZXIgaWQgdG8gdXBkYXRlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzY2hlbWUgLSBBdXRoZW50aWNhdGlvbiBzY2hlbWU7IDxjb2RlPlwiYmFzaWNcIjwvY29kZT4gYW5kIDxjb2RlPlwiYW5vbnltb3VzXCI8L2NvZGU+IGFyZSB0aGUgY3VycmVudGx5IHN1cHBvcnRlZCBzY2hlbWVzLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2VjcmV0IC0gQXV0aGVudGljYXRpb24gc2VjcmV0LCBhc3N1bWVkIHRvIGJlIGFscmVhZHkgYmFzZTY0IGVuY29kZWQuXG4gICAqIEBwYXJhbSB7Ym9vbGVhbj19IGxvZ2luIC0gVXNlIG5ldyBhY2NvdW50IHRvIGF1dGhlbnRpY2F0ZSBjdXJyZW50IHNlc3Npb25cbiAgICogQHBhcmFtIHtUaW5vZGUuQWNjb3VudFBhcmFtcz19IHBhcmFtcyAtIFVzZXIgZGF0YSB0byBwYXNzIHRvIHRoZSBzZXJ2ZXIuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiBzZXJ2ZXIgcmVwbHkgaXMgcmVjZWl2ZWQuXG4gICAqL1xuICBhY2NvdW50KHVpZCwgc2NoZW1lLCBzZWNyZXQsIGxvZ2luLCBwYXJhbXMpIHtcbiAgICBjb25zdCBwa3QgPSB0aGlzLiNpbml0UGFja2V0KCdhY2MnKTtcbiAgICBwa3QuYWNjLnVzZXIgPSB1aWQ7XG4gICAgcGt0LmFjYy5zY2hlbWUgPSBzY2hlbWU7XG4gICAgcGt0LmFjYy5zZWNyZXQgPSBzZWNyZXQ7XG4gICAgLy8gTG9nIGluIHRvIHRoZSBuZXcgYWNjb3VudCB1c2luZyBzZWxlY3RlZCBzY2hlbWVcbiAgICBwa3QuYWNjLmxvZ2luID0gbG9naW47XG5cbiAgICBpZiAocGFyYW1zKSB7XG4gICAgICBwa3QuYWNjLmRlc2MuZGVmYWNzID0gcGFyYW1zLmRlZmFjcztcbiAgICAgIHBrdC5hY2MuZGVzYy5wdWJsaWMgPSBwYXJhbXMucHVibGljO1xuICAgICAgcGt0LmFjYy5kZXNjLnByaXZhdGUgPSBwYXJhbXMucHJpdmF0ZTtcbiAgICAgIHBrdC5hY2MuZGVzYy50cnVzdGVkID0gcGFyYW1zLnRydXN0ZWQ7XG5cbiAgICAgIHBrdC5hY2MudGFncyA9IHBhcmFtcy50YWdzO1xuICAgICAgcGt0LmFjYy5jcmVkID0gcGFyYW1zLmNyZWQ7XG5cbiAgICAgIHBrdC5hY2MudG9rZW4gPSBwYXJhbXMudG9rZW47XG5cbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHBhcmFtcy5hdHRhY2htZW50cykgJiYgcGFyYW1zLmF0dGFjaG1lbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcGt0LmV4dHJhID0ge1xuICAgICAgICAgIGF0dGFjaG1lbnRzOiBwYXJhbXMuYXR0YWNobWVudHMuZmlsdGVyKHJlZiA9PiBUaW5vZGUuaXNSZWxhdGl2ZVVSTChyZWYpKVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLiNzZW5kKHBrdCwgcGt0LmFjYy5pZCk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgbmV3IHVzZXIuIFdyYXBwZXIgZm9yIHtAbGluayBUaW5vZGUjYWNjb3VudH0uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzY2hlbWUgLSBBdXRoZW50aWNhdGlvbiBzY2hlbWU7IDxjb2RlPlwiYmFzaWNcIjwvY29kZT4gaXMgdGhlIG9ubHkgY3VycmVudGx5IHN1cHBvcnRlZCBzY2hlbWUuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzZWNyZXQgLSBBdXRoZW50aWNhdGlvbi5cbiAgICogQHBhcmFtIHtib29sZWFuPX0gbG9naW4gLSBVc2UgbmV3IGFjY291bnQgdG8gYXV0aGVudGljYXRlIGN1cnJlbnQgc2Vzc2lvblxuICAgKiBAcGFyYW0ge1Rpbm9kZS5BY2NvdW50UGFyYW1zPX0gcGFyYW1zIC0gVXNlciBkYXRhIHRvIHBhc3MgdG8gdGhlIHNlcnZlci5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHNlcnZlciByZXBseSBpcyByZWNlaXZlZC5cbiAgICovXG4gIGNyZWF0ZUFjY291bnQoc2NoZW1lLCBzZWNyZXQsIGxvZ2luLCBwYXJhbXMpIHtcbiAgICBsZXQgcHJvbWlzZSA9IHRoaXMuYWNjb3VudChVU0VSX05FVywgc2NoZW1lLCBzZWNyZXQsIGxvZ2luLCBwYXJhbXMpO1xuICAgIGlmIChsb2dpbikge1xuICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoY3RybCkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy4jbG9naW5TdWNjZXNzZnVsKGN0cmwpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSB1c2VyIHdpdGggPGNvZGU+J2Jhc2ljJzwvY29kZT4gYXV0aGVudGljYXRpb24gc2NoZW1lIGFuZCBpbW1lZGlhdGVseVxuICAgKiB1c2UgaXQgZm9yIGF1dGhlbnRpY2F0aW9uLiBXcmFwcGVyIGZvciB7QGxpbmsgVGlub2RlI2FjY291bnR9LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdXNlcm5hbWUgLSBMb2dpbiB0byB1c2UgZm9yIHRoZSBuZXcgYWNjb3VudC5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhc3N3b3JkIC0gVXNlcidzIHBhc3N3b3JkLlxuICAgKiBAcGFyYW0ge1Rpbm9kZS5BY2NvdW50UGFyYW1zPX0gcGFyYW1zIC0gVXNlciBkYXRhIHRvIHBhc3MgdG8gdGhlIHNlcnZlci5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHNlcnZlciByZXBseSBpcyByZWNlaXZlZC5cbiAgICovXG4gIGNyZWF0ZUFjY291bnRCYXNpYyh1c2VybmFtZSwgcGFzc3dvcmQsIHBhcmFtcykge1xuICAgIC8vIE1ha2Ugc3VyZSB3ZSBhcmUgbm90IHVzaW5nICdudWxsJyBvciAndW5kZWZpbmVkJztcbiAgICB1c2VybmFtZSA9IHVzZXJuYW1lIHx8ICcnO1xuICAgIHBhc3N3b3JkID0gcGFzc3dvcmQgfHwgJyc7XG4gICAgcmV0dXJuIHRoaXMuY3JlYXRlQWNjb3VudCgnYmFzaWMnLFxuICAgICAgYjY0RW5jb2RlVW5pY29kZSh1c2VybmFtZSArICc6JyArIHBhc3N3b3JkKSwgdHJ1ZSwgcGFyYW1zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgdXNlcidzIGNyZWRlbnRpYWxzIGZvciA8Y29kZT4nYmFzaWMnPC9jb2RlPiBhdXRoZW50aWNhdGlvbiBzY2hlbWUuIFdyYXBwZXIgZm9yIHtAbGluayBUaW5vZGUjYWNjb3VudH0uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1aWQgLSBVc2VyIElEIHRvIHVwZGF0ZS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHVzZXJuYW1lIC0gTG9naW4gdG8gdXNlIGZvciB0aGUgbmV3IGFjY291bnQuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXNzd29yZCAtIFVzZXIncyBwYXNzd29yZC5cbiAgICogQHBhcmFtIHtUaW5vZGUuQWNjb3VudFBhcmFtcz19IHBhcmFtcyAtIGRhdGEgdG8gcGFzcyB0byB0aGUgc2VydmVyLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gc2VydmVyIHJlcGx5IGlzIHJlY2VpdmVkLlxuICAgKi9cbiAgdXBkYXRlQWNjb3VudEJhc2ljKHVpZCwgdXNlcm5hbWUsIHBhc3N3b3JkLCBwYXJhbXMpIHtcbiAgICAvLyBNYWtlIHN1cmUgd2UgYXJlIG5vdCB1c2luZyAnbnVsbCcgb3IgJ3VuZGVmaW5lZCc7XG4gICAgdXNlcm5hbWUgPSB1c2VybmFtZSB8fCAnJztcbiAgICBwYXNzd29yZCA9IHBhc3N3b3JkIHx8ICcnO1xuICAgIHJldHVybiB0aGlzLmFjY291bnQodWlkLCAnYmFzaWMnLFxuICAgICAgYjY0RW5jb2RlVW5pY29kZSh1c2VybmFtZSArICc6JyArIHBhc3N3b3JkKSwgZmFsc2UsIHBhcmFtcyk7XG4gIH1cblxuICAvKipcbiAgICogU2VuZCBoYW5kc2hha2UgdG8gdGhlIHNlcnZlci5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHNlcnZlciByZXBseSBpcyByZWNlaXZlZC5cbiAgICovXG4gIGhlbGxvKCkge1xuICAgIGNvbnN0IHBrdCA9IHRoaXMuI2luaXRQYWNrZXQoJ2hpJyk7XG5cbiAgICByZXR1cm4gdGhpcy4jc2VuZChwa3QsIHBrdC5oaS5pZClcbiAgICAgIC50aGVuKChjdHJsKSA9PiB7XG4gICAgICAgIC8vIFJlc2V0IGJhY2tvZmYgY291bnRlciBvbiBzdWNjZXNzZnVsIGNvbm5lY3Rpb24uXG4gICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uYmFja29mZlJlc2V0KCk7XG5cbiAgICAgICAgLy8gU2VydmVyIHJlc3BvbnNlIGNvbnRhaW5zIHNlcnZlciBwcm90b2NvbCB2ZXJzaW9uLCBidWlsZCwgY29uc3RyYWludHMsXG4gICAgICAgIC8vIHNlc3Npb24gSUQgZm9yIGxvbmcgcG9sbGluZy4gU2F2ZSB0aGVtLlxuICAgICAgICBpZiAoY3RybC5wYXJhbXMpIHtcbiAgICAgICAgICB0aGlzLl9zZXJ2ZXJJbmZvID0gY3RybC5wYXJhbXM7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5vbkNvbm5lY3QpIHtcbiAgICAgICAgICB0aGlzLm9uQ29ubmVjdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGN0cmw7XG4gICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24ucmVjb25uZWN0KHRydWUpO1xuXG4gICAgICAgIGlmICh0aGlzLm9uRGlzY29ubmVjdCkge1xuICAgICAgICAgIHRoaXMub25EaXNjb25uZWN0KGVycik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCBvciByZWZyZXNoIHRoZSBwdXNoIG5vdGlmaWNhdGlvbnMvZGV2aWNlIHRva2VuLiBJZiB0aGUgY2xpZW50IGlzIGNvbm5lY3RlZCxcbiAgICogdGhlIGRldmljZVRva2VuIGNhbiBiZSBzZW50IHRvIHRoZSBzZXJ2ZXIuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBkdCAtIHRva2VuIG9idGFpbmVkIGZyb20gdGhlIHByb3ZpZGVyIG9yIDxjb2RlPmZhbHNlPC9jb2RlPixcbiAgICogICAgPGNvZGU+bnVsbDwvY29kZT4gb3IgPGNvZGU+dW5kZWZpbmVkPC9jb2RlPiB0byBjbGVhciB0aGUgdG9rZW4uXG4gICAqXG4gICAqIEByZXR1cm5zIDxjb2RlPnRydWU8L2NvZGU+IGlmIGF0dGVtcHQgd2FzIG1hZGUgdG8gc2VuZCB0aGUgdXBkYXRlIHRvIHRoZSBzZXJ2ZXIuXG4gICAqL1xuICBzZXREZXZpY2VUb2tlbihkdCkge1xuICAgIGxldCBzZW50ID0gZmFsc2U7XG4gICAgLy8gQ29udmVydCBhbnkgZmFsc2lzaCB2YWx1ZSB0byBudWxsLlxuICAgIGR0ID0gZHQgfHwgbnVsbDtcbiAgICBpZiAoZHQgIT0gdGhpcy5fZGV2aWNlVG9rZW4pIHtcbiAgICAgIHRoaXMuX2RldmljZVRva2VuID0gZHQ7XG4gICAgICBpZiAodGhpcy5pc0Nvbm5lY3RlZCgpICYmIHRoaXMuaXNBdXRoZW50aWNhdGVkKCkpIHtcbiAgICAgICAgdGhpcy4jc2VuZCh7XG4gICAgICAgICAgJ2hpJzoge1xuICAgICAgICAgICAgJ2Rldic6IGR0IHx8IFRpbm9kZS5ERUxfQ0hBUlxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHNlbnQgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc2VudDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAdHlwZWRlZiBDcmVkZW50aWFsXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBtZXRoIC0gdmFsaWRhdGlvbiBtZXRob2QuXG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB2YWwgLSB2YWx1ZSB0byB2YWxpZGF0ZSAoZS5nLiBlbWFpbCBvciBwaG9uZSBudW1iZXIpLlxuICAgKiBAcHJvcGVydHkge3N0cmluZ30gcmVzcCAtIHZhbGlkYXRpb24gcmVzcG9uc2UuXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBwYXJhbXMgLSB2YWxpZGF0aW9uIHBhcmFtZXRlcnMuXG4gICAqL1xuICAvKipcbiAgICogQXV0aGVudGljYXRlIGN1cnJlbnQgc2Vzc2lvbi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNjaGVtZSAtIEF1dGhlbnRpY2F0aW9uIHNjaGVtZTsgPGNvZGU+XCJiYXNpY1wiPC9jb2RlPiBpcyB0aGUgb25seSBjdXJyZW50bHkgc3VwcG9ydGVkIHNjaGVtZS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHNlY3JldCAtIEF1dGhlbnRpY2F0aW9uIHNlY3JldCwgYXNzdW1lZCB0byBiZSBhbHJlYWR5IGJhc2U2NCBlbmNvZGVkLlxuICAgKiBAcGFyYW0ge0NyZWRlbnRpYWw9fSBjcmVkIC0gY3JlZGVudGlhbCBjb25maXJtYXRpb24sIGlmIHJlcXVpcmVkLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gc2VydmVyIHJlcGx5IGlzIHJlY2VpdmVkLlxuICAgKi9cbiAgbG9naW4oc2NoZW1lLCBzZWNyZXQsIGNyZWQpIHtcbiAgICBjb25zdCBwa3QgPSB0aGlzLiNpbml0UGFja2V0KCdsb2dpbicpO1xuICAgIHBrdC5sb2dpbi5zY2hlbWUgPSBzY2hlbWU7XG4gICAgcGt0LmxvZ2luLnNlY3JldCA9IHNlY3JldDtcbiAgICBwa3QubG9naW4uY3JlZCA9IGNyZWQ7XG5cbiAgICByZXR1cm4gdGhpcy4jc2VuZChwa3QsIHBrdC5sb2dpbi5pZClcbiAgICAgIC50aGVuKChjdHJsKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLiNsb2dpblN1Y2Nlc3NmdWwoY3RybCk7XG4gICAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXcmFwcGVyIGZvciB7QGxpbmsgVGlub2RlI2xvZ2lufSB3aXRoIGJhc2ljIGF1dGhlbnRpY2F0aW9uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1bmFtZSAtIFVzZXIgbmFtZS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhc3N3b3JkICAtIFBhc3N3b3JkLlxuICAgKiBAcGFyYW0ge0NyZWRlbnRpYWw9fSBjcmVkIC0gY3JlZGVudGlhbCBjb25maXJtYXRpb24sIGlmIHJlcXVpcmVkLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIG9uIHJlY2VpdmluZyBzZXJ2ZXIgcmVwbHkuXG4gICAqL1xuICBsb2dpbkJhc2ljKHVuYW1lLCBwYXNzd29yZCwgY3JlZCkge1xuICAgIHJldHVybiB0aGlzLmxvZ2luKCdiYXNpYycsIGI2NEVuY29kZVVuaWNvZGUodW5hbWUgKyAnOicgKyBwYXNzd29yZCksIGNyZWQpXG4gICAgICAudGhlbigoY3RybCkgPT4ge1xuICAgICAgICB0aGlzLl9sb2dpbiA9IHVuYW1lO1xuICAgICAgICByZXR1cm4gY3RybDtcbiAgICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFdyYXBwZXIgZm9yIHtAbGluayBUaW5vZGUjbG9naW59IHdpdGggdG9rZW4gYXV0aGVudGljYXRpb25cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRva2VuIC0gVG9rZW4gcmVjZWl2ZWQgaW4gcmVzcG9uc2UgdG8gZWFybGllciBsb2dpbi5cbiAgICogQHBhcmFtIHtDcmVkZW50aWFsPX0gY3JlZCAtIGNyZWRlbnRpYWwgY29uZmlybWF0aW9uLCBpZiByZXF1aXJlZC5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCBvbiByZWNlaXZpbmcgc2VydmVyIHJlcGx5LlxuICAgKi9cbiAgbG9naW5Ub2tlbih0b2tlbiwgY3JlZCkge1xuICAgIHJldHVybiB0aGlzLmxvZ2luKCd0b2tlbicsIHRva2VuLCBjcmVkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kIGEgcmVxdWVzdCBmb3IgcmVzZXR0aW5nIGFuIGF1dGhlbnRpY2F0aW9uIHNlY3JldC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNjaGVtZSAtIGF1dGhlbnRpY2F0aW9uIHNjaGVtZSB0byByZXNldC5cbiAgICogQHBhcmFtIHtzdHJpbmd9IG1ldGhvZCAtIG1ldGhvZCB0byB1c2UgZm9yIHJlc2V0dGluZyB0aGUgc2VjcmV0LCBzdWNoIGFzIFwiZW1haWxcIiBvciBcInRlbFwiLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgLSB2YWx1ZSBvZiB0aGUgY3JlZGVudGlhbCB0byB1c2UsIGEgc3BlY2lmaWMgZW1haWwgYWRkcmVzcyBvciBhIHBob25lIG51bWJlci5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCBvbiByZWNlaXZpbmcgdGhlIHNlcnZlciByZXBseS5cbiAgICovXG4gIHJlcXVlc3RSZXNldEF1dGhTZWNyZXQoc2NoZW1lLCBtZXRob2QsIHZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMubG9naW4oJ3Jlc2V0JywgYjY0RW5jb2RlVW5pY29kZShzY2hlbWUgKyAnOicgKyBtZXRob2QgKyAnOicgKyB2YWx1ZSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEB0eXBlZGVmIEF1dGhUb2tlblxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB0b2tlbiAtIFRva2VuIHZhbHVlLlxuICAgKiBAcHJvcGVydHkge0RhdGV9IGV4cGlyZXMgLSBUb2tlbiBleHBpcmF0aW9uIHRpbWUuXG4gICAqL1xuICAvKipcbiAgICogR2V0IHN0b3JlZCBhdXRoZW50aWNhdGlvbiB0b2tlbi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5BdXRoVG9rZW59IGF1dGhlbnRpY2F0aW9uIHRva2VuLlxuICAgKi9cbiAgZ2V0QXV0aFRva2VuKCkge1xuICAgIGlmICh0aGlzLl9hdXRoVG9rZW4gJiYgKHRoaXMuX2F1dGhUb2tlbi5leHBpcmVzLmdldFRpbWUoKSA+IERhdGUubm93KCkpKSB7XG4gICAgICByZXR1cm4gdGhpcy5fYXV0aFRva2VuO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9hdXRoVG9rZW4gPSBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBsaWNhdGlvbiBtYXkgcHJvdmlkZSBhIHNhdmVkIGF1dGhlbnRpY2F0aW9uIHRva2VuLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge1Rpbm9kZS5BdXRoVG9rZW59IHRva2VuIC0gYXV0aGVudGljYXRpb24gdG9rZW4uXG4gICAqL1xuICBzZXRBdXRoVG9rZW4odG9rZW4pIHtcbiAgICB0aGlzLl9hdXRoVG9rZW4gPSB0b2tlbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBAdHlwZWRlZiBTZXRQYXJhbXNcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAcHJvcGVydHkge1Rpbm9kZS5TZXREZXNjPX0gZGVzYyAtIFRvcGljIGluaXRpYWxpemF0aW9uIHBhcmFtZXRlcnMgd2hlbiBjcmVhdGluZyBhIG5ldyB0b3BpYyBvciBhIG5ldyBzdWJzY3JpcHRpb24uXG4gICAqIEBwcm9wZXJ0eSB7VGlub2RlLlNldFN1Yj19IHN1YiAtIFN1YnNjcmlwdGlvbiBpbml0aWFsaXphdGlvbiBwYXJhbWV0ZXJzLlxuICAgKiBAcHJvcGVydHkge0FycmF5LjxzdHJpbmc+PX0gYXR0YWNobWVudHMgLSBVUkxzIG9mIG91dCBvZiBiYW5kIGF0dGFjaG1lbnRzIHVzZWQgaW4gcGFyYW1ldGVycy5cbiAgICovXG4gIC8qKlxuICAgKiBAdHlwZWRlZiBTZXREZXNjXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQHByb3BlcnR5IHtUaW5vZGUuRGVmQWNzPX0gZGVmYWNzIC0gRGVmYXVsdCBhY2Nlc3MgbW9kZS5cbiAgICogQHByb3BlcnR5IHtPYmplY3Q9fSBwdWJsaWMgLSBGcmVlLWZvcm0gdG9waWMgZGVzY3JpcHRpb24sIHB1YmxpY2FsbHkgYWNjZXNzaWJsZS5cbiAgICogQHByb3BlcnR5IHtPYmplY3Q9fSBwcml2YXRlIC0gRnJlZS1mb3JtIHRvcGljIGRlc2NyaXB0aW9uIGFjY2Vzc2libGUgb25seSB0byB0aGUgb3duZXIuXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0PX0gdHJ1c3RlZCAtIFRydXN0ZWQgdXNlciBkYXRhIHdoaWNoIGNhbiBiZSBzZXQgYnkgYSByb290IHVzZXIgb25seS5cbiAgICovXG4gIC8qKlxuICAgKiBAdHlwZWRlZiBTZXRTdWJcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAcHJvcGVydHkge3N0cmluZz19IHVzZXIgLSBVSUQgb2YgdGhlIHVzZXIgYWZmZWN0ZWQgYnkgdGhlIHJlcXVlc3QuIERlZmF1bHQgKGVtcHR5KSAtIGN1cnJlbnQgdXNlci5cbiAgICogQHByb3BlcnR5IHtzdHJpbmc9fSBtb2RlIC0gVXNlciBhY2Nlc3MgbW9kZSwgZWl0aGVyIHJlcXVlc3RlZCBvciBhc3NpZ25lZCBkZXBlbmRlbnQgb24gY29udGV4dC5cbiAgICovXG4gIC8qKlxuICAgKiBQYXJhbWV0ZXJzIHBhc3NlZCB0byB7QGxpbmsgVGlub2RlI3N1YnNjcmliZX0uXG4gICAqXG4gICAqIEB0eXBlZGVmIFN1YnNjcmlwdGlvblBhcmFtc1xuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBwcm9wZXJ0eSB7VGlub2RlLlNldFBhcmFtcz19IHNldCAtIFBhcmFtZXRlcnMgdXNlZCB0byBpbml0aWFsaXplIHRvcGljXG4gICAqIEBwcm9wZXJ0eSB7VGlub2RlLkdldFF1ZXJ5PX0gZ2V0IC0gUXVlcnkgZm9yIGZldGNoaW5nIGRhdGEgZnJvbSB0b3BpYy5cbiAgICovXG5cbiAgLyoqXG4gICAqIFNlbmQgYSB0b3BpYyBzdWJzY3JpcHRpb24gcmVxdWVzdC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gc3Vic2NyaWJlIHRvLlxuICAgKiBAcGFyYW0ge1Rpbm9kZS5HZXRRdWVyeT19IGdldFBhcmFtcyAtIE9wdGlvbmFsIHN1YnNjcmlwdGlvbiBtZXRhZGF0YSBxdWVyeVxuICAgKiBAcGFyYW0ge1Rpbm9kZS5TZXRQYXJhbXM9fSBzZXRQYXJhbXMgLSBPcHRpb25hbCBpbml0aWFsaXphdGlvbiBwYXJhbWV0ZXJzXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gcmVjZWl2aW5nIHNlcnZlciByZXBseS5cbiAgICovXG4gIHN1YnNjcmliZSh0b3BpY05hbWUsIGdldFBhcmFtcywgc2V0UGFyYW1zKSB7XG4gICAgY29uc3QgcGt0ID0gdGhpcy4jaW5pdFBhY2tldCgnc3ViJywgdG9waWNOYW1lKVxuICAgIGlmICghdG9waWNOYW1lKSB7XG4gICAgICB0b3BpY05hbWUgPSBDb25zdC5UT1BJQ19ORVc7XG4gICAgfVxuXG4gICAgcGt0LnN1Yi5nZXQgPSBnZXRQYXJhbXM7XG5cbiAgICBpZiAoc2V0UGFyYW1zKSB7XG4gICAgICBpZiAoc2V0UGFyYW1zLnN1Yikge1xuICAgICAgICBwa3Quc3ViLnNldC5zdWIgPSBzZXRQYXJhbXMuc3ViO1xuICAgICAgfVxuXG4gICAgICBpZiAoc2V0UGFyYW1zLmRlc2MpIHtcbiAgICAgICAgY29uc3QgZGVzYyA9IHNldFBhcmFtcy5kZXNjO1xuICAgICAgICBpZiAoVGlub2RlLmlzTmV3R3JvdXBUb3BpY05hbWUodG9waWNOYW1lKSkge1xuICAgICAgICAgIC8vIEZ1bGwgc2V0LmRlc2MgcGFyYW1zIGFyZSB1c2VkIGZvciBuZXcgdG9waWNzIG9ubHlcbiAgICAgICAgICBwa3Quc3ViLnNldC5kZXNjID0gZGVzYztcbiAgICAgICAgfSBlbHNlIGlmIChUaW5vZGUuaXNQMlBUb3BpY05hbWUodG9waWNOYW1lKSAmJiBkZXNjLmRlZmFjcykge1xuICAgICAgICAgIC8vIFVzZSBvcHRpb25hbCBkZWZhdWx0IHBlcm1pc3Npb25zIG9ubHkuXG4gICAgICAgICAgcGt0LnN1Yi5zZXQuZGVzYyA9IHtcbiAgICAgICAgICAgIGRlZmFjczogZGVzYy5kZWZhY3NcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFNlZSBpZiBleHRlcm5hbCBvYmplY3RzIHdlcmUgdXNlZCBpbiB0b3BpYyBkZXNjcmlwdGlvbi5cbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHNldFBhcmFtcy5hdHRhY2htZW50cykgJiYgc2V0UGFyYW1zLmF0dGFjaG1lbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcGt0LmV4dHJhID0ge1xuICAgICAgICAgIGF0dGFjaG1lbnRzOiBzZXRQYXJhbXMuYXR0YWNobWVudHMuZmlsdGVyKHJlZiA9PiBUaW5vZGUuaXNSZWxhdGl2ZVVSTChyZWYpKVxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBpZiAoc2V0UGFyYW1zLnRhZ3MpIHtcbiAgICAgICAgcGt0LnN1Yi5zZXQudGFncyA9IHNldFBhcmFtcy50YWdzO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy4jc2VuZChwa3QsIHBrdC5zdWIuaWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIERldGFjaCBhbmQgb3B0aW9uYWxseSB1bnN1YnNjcmliZSBmcm9tIHRoZSB0b3BpY1xuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWMgLSBUb3BpYyB0byBkZXRhY2ggZnJvbS5cbiAgICogQHBhcmFtIHtib29sZWFufSB1bnN1YiAtIElmIDxjb2RlPnRydWU8L2NvZGU+LCBkZXRhY2ggYW5kIHVuc3Vic2NyaWJlLCBvdGhlcndpc2UganVzdCBkZXRhY2guXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gcmVjZWl2aW5nIHNlcnZlciByZXBseS5cbiAgICovXG4gIGxlYXZlKHRvcGljLCB1bnN1Yikge1xuICAgIGNvbnN0IHBrdCA9IHRoaXMuI2luaXRQYWNrZXQoJ2xlYXZlJywgdG9waWMpO1xuICAgIHBrdC5sZWF2ZS51bnN1YiA9IHVuc3ViO1xuXG4gICAgcmV0dXJuIHRoaXMuI3NlbmQocGt0LCBwa3QubGVhdmUuaWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBtZXNzYWdlIGRyYWZ0IHdpdGhvdXQgc2VuZGluZyBpdCB0byB0aGUgc2VydmVyLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWMgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byBwdWJsaXNoIHRvLlxuICAgKiBAcGFyYW0ge09iamVjdH0gY29udGVudCAtIFBheWxvYWQgdG8gcHVibGlzaC5cbiAgICogQHBhcmFtIHtib29sZWFuPX0gbm9FY2hvIC0gSWYgPGNvZGU+dHJ1ZTwvY29kZT4sIHRlbGwgdGhlIHNlcnZlciBub3QgdG8gZWNobyB0aGUgbWVzc2FnZSB0byB0aGUgb3JpZ2luYWwgc2Vzc2lvbi5cbiAgICpcbiAgICogQHJldHVybnMge09iamVjdH0gbmV3IG1lc3NhZ2Ugd2hpY2ggY2FuIGJlIHNlbnQgdG8gdGhlIHNlcnZlciBvciBvdGhlcndpc2UgdXNlZC5cbiAgICovXG4gIGNyZWF0ZU1lc3NhZ2UodG9waWMsIGNvbnRlbnQsIG5vRWNobykge1xuICAgIGNvbnN0IHBrdCA9IHRoaXMuI2luaXRQYWNrZXQoJ3B1YicsIHRvcGljKTtcblxuICAgIGxldCBkZnQgPSB0eXBlb2YgY29udGVudCA9PSAnc3RyaW5nJyA/IERyYWZ0eS5wYXJzZShjb250ZW50KSA6IGNvbnRlbnQ7XG4gICAgaWYgKGRmdCAmJiAhRHJhZnR5LmlzUGxhaW5UZXh0KGRmdCkpIHtcbiAgICAgIHBrdC5wdWIuaGVhZCA9IHtcbiAgICAgICAgbWltZTogRHJhZnR5LmdldENvbnRlbnRUeXBlKClcbiAgICAgIH07XG4gICAgICBjb250ZW50ID0gZGZ0O1xuICAgIH1cbiAgICBwa3QucHViLm5vZWNobyA9IG5vRWNobztcbiAgICBwa3QucHViLmNvbnRlbnQgPSBjb250ZW50O1xuXG4gICAgcmV0dXJuIHBrdC5wdWI7XG4gIH1cblxuICAvKipcbiAgICogUHVibGlzaCB7ZGF0YX0gbWVzc2FnZSB0byB0b3BpYy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljTmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIHB1Ymxpc2ggdG8uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZW50IC0gUGF5bG9hZCB0byBwdWJsaXNoLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBub0VjaG8gLSBJZiA8Y29kZT50cnVlPC9jb2RlPiwgdGVsbCB0aGUgc2VydmVyIG5vdCB0byBlY2hvIHRoZSBtZXNzYWdlIHRvIHRoZSBvcmlnaW5hbCBzZXNzaW9uLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIG9uIHJlY2VpdmluZyBzZXJ2ZXIgcmVwbHkuXG4gICAqL1xuICBwdWJsaXNoKHRvcGljTmFtZSwgY29udGVudCwgbm9FY2hvKSB7XG4gICAgcmV0dXJuIHRoaXMucHVibGlzaE1lc3NhZ2UoXG4gICAgICB0aGlzLmNyZWF0ZU1lc3NhZ2UodG9waWNOYW1lLCBjb250ZW50LCBub0VjaG8pXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQdWJsaXNoIG1lc3NhZ2UgdG8gdG9waWMuIFRoZSBtZXNzYWdlIHNob3VsZCBiZSBjcmVhdGVkIGJ5IHtAbGluayBUaW5vZGUjY3JlYXRlTWVzc2FnZX0uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwdWIgLSBNZXNzYWdlIHRvIHB1Ymxpc2guXG4gICAqIEBwYXJhbSB7QXJyYXkuPHN0cmluZz49fSBhdHRhY2htZW50cyAtIGFycmF5IG9mIFVSTHMgd2l0aCBhdHRhY2htZW50cy5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCBvbiByZWNlaXZpbmcgc2VydmVyIHJlcGx5LlxuICAgKi9cbiAgcHVibGlzaE1lc3NhZ2UocHViLCBhdHRhY2htZW50cykge1xuICAgIC8vIE1ha2UgYSBzaGFsbG93IGNvcHkuIE5lZWRlZCBpbiBvcmRlciB0byBjbGVhciBsb2NhbGx5LWFzc2lnbmVkIHRlbXAgdmFsdWVzO1xuICAgIHB1YiA9IE9iamVjdC5hc3NpZ24oe30sIHB1Yik7XG4gICAgcHViLnNlcSA9IHVuZGVmaW5lZDtcbiAgICBwdWIuZnJvbSA9IHVuZGVmaW5lZDtcbiAgICBwdWIudHMgPSB1bmRlZmluZWQ7XG4gICAgY29uc3QgbXNnID0ge1xuICAgICAgcHViOiBwdWIsXG4gICAgfTtcbiAgICBpZiAoYXR0YWNobWVudHMpIHtcbiAgICAgIG1zZy5leHRyYSA9IHtcbiAgICAgICAgYXR0YWNobWVudHM6IGF0dGFjaG1lbnRzLmZpbHRlcihyZWYgPT4gVGlub2RlLmlzUmVsYXRpdmVVUkwocmVmKSlcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiB0aGlzLiNzZW5kKG1zZywgcHViLmlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPdXQgb2YgYmFuZCBub3RpZmljYXRpb246IG5vdGlmeSB0b3BpYyB0aGF0IGFuIGV4dGVybmFsIChwdXNoKSBub3RpZmljYXRpb24gd2FzIHJlY2l2ZWQgYnkgdGhlIGNsaWVudC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHdoYXQgLSBub3RpZmljYXRpb24gdHlwZSwgJ21zZycsICdyZWFkJywgJ3N1YicuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpY05hbWUgLSBuYW1lIG9mIHRoZSB1cGRhdGVkIHRvcGljLlxuICAgKiBAcGFyYW0ge251bWJlcn0gc2VxIC0gc2VxIElEIG9mIHRoZSBhZmZlY3RlZCBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge3N0cmluZz19IGFjdCAtIFVJRCBvZiB0aGUgc2VuZGVyOyBkZWZhdWx0IGlzIGN1cnJlbnQuXG4gICAqIEBwYXJhbSB7b2JqZWN0PX0gbW9kZSAtIG5ldyBzdWJzY3JpcHRpb24gJ3dhbnQnIGFuZCAnZ2l2ZW4nIHt3YW50OiAnUldKLi4uJywgZ2l2ZW46ICdBU1dQLi4uJ30uXG4gICAqL1xuICBvb2JOb3RpZmljYXRpb24od2hhdCwgdG9waWNOYW1lLCBzZXEsIGFjdCwgbW9kZSkge1xuICAgIGNvbnN0IG1lID0gdGhpcy5nZXRNZVRvcGljKCk7XG4gICAgaWYgKHdoYXQgPT0gJ3N1YicpIHtcbiAgICAgIGxldCBhY3MgPSBuZXcgQWNjZXNzTW9kZShtb2RlKTtcbiAgICAgIGxldCBwcmVzID0gKCFhY3MubW9kZSB8fCBhY3MubW9kZSA9PSBBY2Nlc3NNb2RlLl9OT05FKSA/XG4gICAgICAgIC8vIFN1YnNjcmlwdGlvbiBkZWxldGVkLlxuICAgICAgICB7XG4gICAgICAgICAgd2hhdDogJ2dvbmUnLFxuICAgICAgICAgIHNyYzogdG9waWNOYW1lXG4gICAgICAgIH0gOlxuICAgICAgICAvLyBOZXcgc3Vic2NyaXB0aW9uIG9yIHN1YnNjcmlwdGlvbiB1cGRhdGVkLlxuICAgICAgICB7XG4gICAgICAgICAgd2hhdDogJ2FjcycsXG4gICAgICAgICAgc3JjOiB0b3BpY05hbWUsXG4gICAgICAgICAgZGFjczogbW9kZVxuICAgICAgICB9O1xuICAgICAgbWUuX3JvdXRlUHJlcyhwcmVzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgdG9waWMgPSB0aGlzLiNjYWNoZUdldCgndG9waWMnLCB0b3BpY05hbWUpO1xuICAgICAgaWYgKHRvcGljKSB7XG4gICAgICAgIHRvcGljLl91cGRhdGVSZWNlaXZlZChzZXEsIGFjdCk7XG4gICAgICAgIG1lLl9yZWZyZXNoQ29udGFjdCgnbXNnJywgdG9waWMpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAdHlwZWRlZiBHZXRRdWVyeVxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBwcm9wZXJ0eSB7VGlub2RlLkdldE9wdHNUeXBlPX0gZGVzYyAtIElmIHByb3ZpZGVkIChldmVuIGlmIGVtcHR5KSwgZmV0Y2ggdG9waWMgZGVzY3JpcHRpb24uXG4gICAqIEBwcm9wZXJ0eSB7VGlub2RlLkdldE9wdHNUeXBlPX0gc3ViIC0gSWYgcHJvdmlkZWQgKGV2ZW4gaWYgZW1wdHkpLCBmZXRjaCB0b3BpYyBzdWJzY3JpcHRpb25zLlxuICAgKiBAcHJvcGVydHkge1Rpbm9kZS5HZXREYXRhVHlwZT19IGRhdGEgLSBJZiBwcm92aWRlZCAoZXZlbiBpZiBlbXB0eSksIGdldCBtZXNzYWdlcy5cbiAgICovXG5cbiAgLyoqXG4gICAqIEB0eXBlZGVmIEdldE9wdHNUeXBlXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQHByb3BlcnR5IHtEYXRlPX0gaW1zIC0gXCJJZiBtb2RpZmllZCBzaW5jZVwiLCBmZXRjaCBkYXRhIG9ubHkgaXQgd2FzIHdhcyBtb2RpZmllZCBzaW5jZSBzdGF0ZWQgZGF0ZS5cbiAgICogQHByb3BlcnR5IHtudW1iZXI9fSBsaW1pdCAtIE1heGltdW0gbnVtYmVyIG9mIHJlc3VsdHMgdG8gcmV0dXJuLiBJZ25vcmVkIHdoZW4gcXVlcnlpbmcgdG9waWMgZGVzY3JpcHRpb24uXG4gICAqL1xuXG4gIC8qKlxuICAgKiBAdHlwZWRlZiBHZXREYXRhVHlwZVxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBwcm9wZXJ0eSB7bnVtYmVyPX0gc2luY2UgLSBMb2FkIG1lc3NhZ2VzIHdpdGggc2VxIGlkIGVxdWFsIG9yIGdyZWF0ZXIgdGhhbiB0aGlzIHZhbHVlLlxuICAgKiBAcHJvcGVydHkge251bWJlcj19IGJlZm9yZSAtIExvYWQgbWVzc2FnZXMgd2l0aCBzZXEgaWQgbG93ZXIgdGhhbiB0aGlzIG51bWJlci5cbiAgICogQHByb3BlcnR5IHtudW1iZXI9fSBsaW1pdCAtIE1heGltdW0gbnVtYmVyIG9mIHJlc3VsdHMgdG8gcmV0dXJuLlxuICAgKi9cblxuICAvKipcbiAgICogUmVxdWVzdCB0b3BpYyBtZXRhZGF0YVxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWMgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byBxdWVyeS5cbiAgICogQHBhcmFtIHtUaW5vZGUuR2V0UXVlcnl9IHBhcmFtcyAtIFBhcmFtZXRlcnMgb2YgdGhlIHF1ZXJ5LiBVc2Uge0BsaW5rIFRpbm9kZS5NZXRhR2V0QnVpbGRlcn0gdG8gZ2VuZXJhdGUuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gcmVjZWl2aW5nIHNlcnZlciByZXBseS5cbiAgICovXG4gIGdldE1ldGEodG9waWMsIHBhcmFtcykge1xuICAgIGNvbnN0IHBrdCA9IHRoaXMuI2luaXRQYWNrZXQoJ2dldCcsIHRvcGljKTtcblxuICAgIHBrdC5nZXQgPSBtZXJnZU9iaihwa3QuZ2V0LCBwYXJhbXMpO1xuXG4gICAgcmV0dXJuIHRoaXMuI3NlbmQocGt0LCBwa3QuZ2V0LmlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgdG9waWMncyBtZXRhZGF0YTogZGVzY3JpcHRpb24sIHN1YnNjcmlidGlvbnMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpYyAtIFRvcGljIHRvIHVwZGF0ZS5cbiAgICogQHBhcmFtIHtUaW5vZGUuU2V0UGFyYW1zfSBwYXJhbXMgLSB0b3BpYyBtZXRhZGF0YSB0byB1cGRhdGUuXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gcmVjZWl2aW5nIHNlcnZlciByZXBseS5cbiAgICovXG4gIHNldE1ldGEodG9waWMsIHBhcmFtcykge1xuICAgIGNvbnN0IHBrdCA9IHRoaXMuI2luaXRQYWNrZXQoJ3NldCcsIHRvcGljKTtcbiAgICBjb25zdCB3aGF0ID0gW107XG5cbiAgICBpZiAocGFyYW1zKSB7XG4gICAgICBbJ2Rlc2MnLCAnc3ViJywgJ3RhZ3MnLCAnY3JlZCddLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgIGlmIChwYXJhbXMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgIHdoYXQucHVzaChrZXkpO1xuICAgICAgICAgIHBrdC5zZXRba2V5XSA9IHBhcmFtc1trZXldO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkocGFyYW1zLmF0dGFjaG1lbnRzKSAmJiBwYXJhbXMuYXR0YWNobWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgICBwa3QuZXh0cmEgPSB7XG4gICAgICAgICAgYXR0YWNobWVudHM6IHBhcmFtcy5hdHRhY2htZW50cy5maWx0ZXIocmVmID0+IFRpbm9kZS5pc1JlbGF0aXZlVVJMKHJlZikpXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHdoYXQubGVuZ3RoID09IDApIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJJbnZhbGlkIHtzZXR9IHBhcmFtZXRlcnNcIikpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLiNzZW5kKHBrdCwgcGt0LnNldC5pZCk7XG4gIH1cblxuICAvKipcbiAgICogUmFuZ2Ugb2YgbWVzc2FnZSBJRHMgdG8gZGVsZXRlLlxuICAgKlxuICAgKiBAdHlwZWRlZiBEZWxSYW5nZVxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBsb3cgLSBsb3cgZW5kIG9mIHRoZSByYW5nZSwgaW5jbHVzaXZlIChjbG9zZWQpLlxuICAgKiBAcHJvcGVydHkge251bWJlcj19IGhpIC0gaGlnaCBlbmQgb2YgdGhlIHJhbmdlLCBleGNsdXNpdmUgKG9wZW4pLlxuICAgKi9cbiAgLyoqXG4gICAqIERlbGV0ZSBzb21lIG9yIGFsbCBtZXNzYWdlcyBpbiBhIHRvcGljLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWMgLSBUb3BpYyBuYW1lIHRvIGRlbGV0ZSBtZXNzYWdlcyBmcm9tLlxuICAgKiBAcGFyYW0ge1Rpbm9kZS5EZWxSYW5nZVtdfSBsaXN0IC0gUmFuZ2VzIG9mIG1lc3NhZ2UgSURzIHRvIGRlbGV0ZS5cbiAgICogQHBhcmFtIHtib29sZWFuPX0gaGFyZCAtIEhhcmQgb3Igc29mdCBkZWxldGVcbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCBvbiByZWNlaXZpbmcgc2VydmVyIHJlcGx5LlxuICAgKi9cbiAgZGVsTWVzc2FnZXModG9waWMsIHJhbmdlcywgaGFyZCkge1xuICAgIGNvbnN0IHBrdCA9IHRoaXMuI2luaXRQYWNrZXQoJ2RlbCcsIHRvcGljKTtcblxuICAgIHBrdC5kZWwud2hhdCA9ICdtc2cnO1xuICAgIHBrdC5kZWwuZGVsc2VxID0gcmFuZ2VzO1xuICAgIHBrdC5kZWwuaGFyZCA9IGhhcmQ7XG5cbiAgICByZXR1cm4gdGhpcy4jc2VuZChwa3QsIHBrdC5kZWwuaWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIERlbGV0ZSB0aGUgdG9waWMgYWxsdG9nZXRoZXIuIFJlcXVpcmVzIE93bmVyIHBlcm1pc3Npb24uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpY05hbWUgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byBkZWxldGVcbiAgICogQHBhcmFtIHtib29sZWFufSBoYXJkIC0gaGFyZC1kZWxldGUgdG9waWMuXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gcmVjZWl2aW5nIHNlcnZlciByZXBseS5cbiAgICovXG4gIGRlbFRvcGljKHRvcGljTmFtZSwgaGFyZCkge1xuICAgIGNvbnN0IHBrdCA9IHRoaXMuI2luaXRQYWNrZXQoJ2RlbCcsIHRvcGljTmFtZSk7XG4gICAgcGt0LmRlbC53aGF0ID0gJ3RvcGljJztcbiAgICBwa3QuZGVsLmhhcmQgPSBoYXJkO1xuXG4gICAgcmV0dXJuIHRoaXMuI3NlbmQocGt0LCBwa3QuZGVsLmlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWxldGUgc3Vic2NyaXB0aW9uLiBSZXF1aXJlcyBTaGFyZSBwZXJtaXNzaW9uLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWNOYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gZGVsZXRlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1c2VyIC0gVXNlciBJRCB0byByZW1vdmUuXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gcmVjZWl2aW5nIHNlcnZlciByZXBseS5cbiAgICovXG4gIGRlbFN1YnNjcmlwdGlvbih0b3BpY05hbWUsIHVzZXIpIHtcbiAgICBjb25zdCBwa3QgPSB0aGlzLiNpbml0UGFja2V0KCdkZWwnLCB0b3BpY05hbWUpO1xuICAgIHBrdC5kZWwud2hhdCA9ICdzdWInO1xuICAgIHBrdC5kZWwudXNlciA9IHVzZXI7XG5cbiAgICByZXR1cm4gdGhpcy4jc2VuZChwa3QsIHBrdC5kZWwuaWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIERlbGV0ZSBjcmVkZW50aWFsLiBBbHdheXMgc2VudCBvbiA8Y29kZT4nbWUnPC9jb2RlPiB0b3BpYy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG1ldGhvZCAtIHZhbGlkYXRpb24gbWV0aG9kIHN1Y2ggYXMgPGNvZGU+J2VtYWlsJzwvY29kZT4gb3IgPGNvZGU+J3RlbCc8L2NvZGU+LlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgLSB2YWxpZGF0aW9uIHZhbHVlLCBpLmUuIDxjb2RlPidhbGljZUBleGFtcGxlLmNvbSc8L2NvZGU+LlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIG9uIHJlY2VpdmluZyBzZXJ2ZXIgcmVwbHkuXG4gICAqL1xuICBkZWxDcmVkZW50aWFsKG1ldGhvZCwgdmFsdWUpIHtcbiAgICBjb25zdCBwa3QgPSB0aGlzLiNpbml0UGFja2V0KCdkZWwnLCBDb25zdC5UT1BJQ19NRSk7XG4gICAgcGt0LmRlbC53aGF0ID0gJ2NyZWQnO1xuICAgIHBrdC5kZWwuY3JlZCA9IHtcbiAgICAgIG1ldGg6IG1ldGhvZCxcbiAgICAgIHZhbDogdmFsdWVcbiAgICB9O1xuXG4gICAgcmV0dXJuIHRoaXMuI3NlbmQocGt0LCBwa3QuZGVsLmlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXF1ZXN0IHRvIGRlbGV0ZSBhY2NvdW50IG9mIHRoZSBjdXJyZW50IHVzZXIuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gaGFyZCAtIGhhcmQtZGVsZXRlIHVzZXIuXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gcmVjZWl2aW5nIHNlcnZlciByZXBseS5cbiAgICovXG4gIGRlbEN1cnJlbnRVc2VyKGhhcmQpIHtcbiAgICBjb25zdCBwa3QgPSB0aGlzLiNpbml0UGFja2V0KCdkZWwnLCBudWxsKTtcbiAgICBwa3QuZGVsLndoYXQgPSAndXNlcic7XG4gICAgcGt0LmRlbC5oYXJkID0gaGFyZDtcblxuICAgIHJldHVybiB0aGlzLiNzZW5kKHBrdCwgcGt0LmRlbC5pZCkudGhlbigoY3RybCkgPT4ge1xuICAgICAgdGhpcy5fbXlVSUQgPSBudWxsO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIE5vdGlmeSBzZXJ2ZXIgdGhhdCBhIG1lc3NhZ2Ugb3IgbWVzc2FnZXMgd2VyZSByZWFkIG9yIHJlY2VpdmVkLiBEb2VzIE5PVCByZXR1cm4gcHJvbWlzZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljTmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHdoZXJlIHRoZSBtZXNhZ2UgaXMgYmVpbmcgYWtub3dsZWRnZWQuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB3aGF0IC0gQWN0aW9uIGJlaW5nIGFrbm93bGVkZ2VkLCBlaXRoZXIgPGNvZGU+XCJyZWFkXCI8L2NvZGU+IG9yIDxjb2RlPlwicmVjdlwiPC9jb2RlPi5cbiAgICogQHBhcmFtIHtudW1iZXJ9IHNlcSAtIE1heGltdW0gaWQgb2YgdGhlIG1lc3NhZ2UgYmVpbmcgYWNrbm93bGVkZ2VkLlxuICAgKi9cbiAgbm90ZSh0b3BpY05hbWUsIHdoYXQsIHNlcSkge1xuICAgIGlmIChzZXEgPD0gMCB8fCBzZXEgPj0gQ29uc3QuTE9DQUxfU0VRSUQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBtZXNzYWdlIGlkICR7c2VxfWApO1xuICAgIH1cblxuICAgIGNvbnN0IHBrdCA9IHRoaXMuI2luaXRQYWNrZXQoJ25vdGUnLCB0b3BpY05hbWUpO1xuICAgIHBrdC5ub3RlLndoYXQgPSB3aGF0O1xuICAgIHBrdC5ub3RlLnNlcSA9IHNlcTtcbiAgICB0aGlzLiNzZW5kKHBrdCk7XG4gIH1cblxuICAvKipcbiAgICogQnJvYWRjYXN0IGEga2V5LXByZXNzIG5vdGlmaWNhdGlvbiB0byB0b3BpYyBzdWJzY3JpYmVycy4gVXNlZCB0byBzaG93XG4gICAqIHR5cGluZyBub3RpZmljYXRpb25zIFwidXNlciBYIGlzIHR5cGluZy4uLlwiLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWNOYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gYnJvYWRjYXN0IHRvLlxuICAgKi9cbiAgbm90ZUtleVByZXNzKHRvcGljTmFtZSkge1xuICAgIGNvbnN0IHBrdCA9IHRoaXMuI2luaXRQYWNrZXQoJ25vdGUnLCB0b3BpY05hbWUpO1xuICAgIHBrdC5ub3RlLndoYXQgPSAna3AnO1xuICAgIHRoaXMuI3NlbmQocGt0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYSBuYW1lZCB0b3BpYywgZWl0aGVyIHB1bGwgaXQgZnJvbSBjYWNoZSBvciBjcmVhdGUgYSBuZXcgaW5zdGFuY2UuXG4gICAqIFRoZXJlIGlzIGEgc2luZ2xlIGluc3RhbmNlIG9mIHRvcGljIGZvciBlYWNoIG5hbWUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpY05hbWUgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byBnZXQuXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuVG9waWN9IFJlcXVlc3RlZCBvciBuZXdseSBjcmVhdGVkIHRvcGljIG9yIDxjb2RlPnVuZGVmaW5lZDwvY29kZT4gaWYgdG9waWMgbmFtZSBpcyBpbnZhbGlkLlxuICAgKi9cbiAgZ2V0VG9waWModG9waWNOYW1lKSB7XG4gICAgbGV0IHRvcGljID0gdGhpcy4jY2FjaGVHZXQoJ3RvcGljJywgdG9waWNOYW1lKTtcbiAgICBpZiAoIXRvcGljICYmIHRvcGljTmFtZSkge1xuICAgICAgaWYgKHRvcGljTmFtZSA9PSBDb25zdC5UT1BJQ19NRSkge1xuICAgICAgICB0b3BpYyA9IG5ldyBUb3BpY01lKCk7XG4gICAgICB9IGVsc2UgaWYgKHRvcGljTmFtZSA9PSBDb25zdC5UT1BJQ19GTkQpIHtcbiAgICAgICAgdG9waWMgPSBuZXcgVG9waWNGbmQoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRvcGljID0gbmV3IFRvcGljKHRvcGljTmFtZSk7XG4gICAgICB9XG4gICAgICAvLyBDYWNoZSBtYW5hZ2VtZW50LlxuICAgICAgdGhpcy4jYXR0YWNoQ2FjaGVUb1RvcGljKHRvcGljKTtcbiAgICAgIHRvcGljLl9jYWNoZVB1dFNlbGYoKTtcbiAgICAgIC8vIERvbid0IHNhdmUgdG8gREIgaGVyZTogYSByZWNvcmQgd2lsbCBiZSBhZGRlZCB3aGVuIHRoZSB0b3BpYyBpcyBzdWJzY3JpYmVkLlxuICAgIH1cbiAgICByZXR1cm4gdG9waWM7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGEgbmFtZWQgdG9waWMgZnJvbSBjYWNoZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljTmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIGdldC5cbiAgICogQHJldHVybnMge1Rpbm9kZS5Ub3BpY30gUmVxdWVzdGVkIHRvcGljIG9yIDxjb2RlPnVuZGVmaW5lZDwvY29kZT4gaWYgdG9waWMgaXMgbm90IGZvdW5kIGluIGNhY2hlLlxuICAgKi9cbiAgY2FjaGVHZXRUb3BpYyh0b3BpY05hbWUpIHtcbiAgICByZXR1cm4gdGhpcy4jY2FjaGVHZXQoJ3RvcGljJywgdG9waWNOYW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgbmFtZWQgdG9waWMgZnJvbSBjYWNoZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljTmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIHJlbW92ZSBmcm9tIGNhY2hlLlxuICAgKi9cbiAgY2FjaGVSZW1Ub3BpYyh0b3BpY05hbWUpIHtcbiAgICB0aGlzLiNjYWNoZURlbCgndG9waWMnLCB0b3BpY05hbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEl0ZXJhdGUgb3ZlciBjYWNoZWQgdG9waWNzLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIC0gY2FsbGJhY2sgdG8gY2FsbCBmb3IgZWFjaCB0b3BpYy5cbiAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHQgLSAndGhpcycgaW5zaWRlIHRoZSAnZnVuYycuXG4gICAqL1xuICBtYXBUb3BpY3MoZnVuYywgY29udGV4dCkge1xuICAgIHRoaXMuI2NhY2hlTWFwKCd0b3BpYycsIGZ1bmMsIGNvbnRleHQpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIG5hbWVkIHRvcGljIGlzIGFscmVhZHkgcHJlc2VudCBpbiBjYWNoZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljTmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiB0b3BpYyBpcyBmb3VuZCBpbiBjYWNoZSwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgKi9cbiAgaXNUb3BpY0NhY2hlZCh0b3BpY05hbWUpIHtcbiAgICByZXR1cm4gISF0aGlzLiNjYWNoZUdldCgndG9waWMnLCB0b3BpY05hbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlIHVuaXF1ZSBuYW1lIGxpa2UgPGNvZGU+J25ldzEyMzQ1Nic8L2NvZGU+IHN1aXRhYmxlIGZvciBjcmVhdGluZyBhIG5ldyBncm91cCB0b3BpYy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSBpc0NoYW4gLSBpZiB0aGUgdG9waWMgaXMgY2hhbm5lbC1lbmFibGVkLlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBuYW1lIHdoaWNoIGNhbiBiZSB1c2VkIGZvciBjcmVhdGluZyBhIG5ldyBncm91cCB0b3BpYy5cbiAgICovXG4gIG5ld0dyb3VwVG9waWNOYW1lKGlzQ2hhbikge1xuICAgIHJldHVybiAoaXNDaGFuID8gQ29uc3QuVE9QSUNfTkVXX0NIQU4gOiBDb25zdC5UT1BJQ19ORVcpICsgdGhpcy5nZXROZXh0VW5pcXVlSWQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnN0YW50aWF0ZSA8Y29kZT4nbWUnPC9jb2RlPiB0b3BpYyBvciBnZXQgaXQgZnJvbSBjYWNoZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5Ub3BpY01lfSBJbnN0YW5jZSBvZiA8Y29kZT4nbWUnPC9jb2RlPiB0b3BpYy5cbiAgICovXG4gIGdldE1lVG9waWMoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0VG9waWMoQ29uc3QuVE9QSUNfTUUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluc3RhbnRpYXRlIDxjb2RlPidmbmQnPC9jb2RlPiAoZmluZCkgdG9waWMgb3IgZ2V0IGl0IGZyb20gY2FjaGUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuVG9waWN9IEluc3RhbmNlIG9mIDxjb2RlPidmbmQnPC9jb2RlPiB0b3BpYy5cbiAgICovXG4gIGdldEZuZFRvcGljKCkge1xuICAgIHJldHVybiB0aGlzLmdldFRvcGljKENvbnN0LlRPUElDX0ZORCk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgbmV3IHtAbGluayBMYXJnZUZpbGVIZWxwZXJ9IGluc3RhbmNlXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuTGFyZ2VGaWxlSGVscGVyfSBpbnN0YW5jZSBvZiBhIHtAbGluayBUaW5vZGUuTGFyZ2VGaWxlSGVscGVyfS5cbiAgICovXG4gIGdldExhcmdlRmlsZUhlbHBlcigpIHtcbiAgICByZXR1cm4gbmV3IExhcmdlRmlsZUhlbHBlcih0aGlzLCBDb25zdC5QUk9UT0NPTF9WRVJTSU9OKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIFVJRCBvZiB0aGUgdGhlIGN1cnJlbnQgYXV0aGVudGljYXRlZCB1c2VyLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBVSUQgb2YgdGhlIGN1cnJlbnQgdXNlciBvciA8Y29kZT51bmRlZmluZWQ8L2NvZGU+IGlmIHRoZSBzZXNzaW9uIGlzIG5vdCB5ZXQgYXV0aGVudGljYXRlZCBvciBpZiB0aGVyZSBpcyBubyBzZXNzaW9uLlxuICAgKi9cbiAgZ2V0Q3VycmVudFVzZXJJRCgpIHtcbiAgICByZXR1cm4gdGhpcy5fbXlVSUQ7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgdGhlIGdpdmVuIHVzZXIgSUQgaXMgZXF1YWwgdG8gdGhlIGN1cnJlbnQgdXNlcidzIFVJRC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVpZCAtIFVJRCB0byBjaGVjay5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgdGhlIGdpdmVuIFVJRCBiZWxvbmdzIHRvIHRoZSBjdXJyZW50IGxvZ2dlZCBpbiB1c2VyLlxuICAgKi9cbiAgaXNNZSh1aWQpIHtcbiAgICByZXR1cm4gdGhpcy5fbXlVSUQgPT09IHVpZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgbG9naW4gdXNlZCBmb3IgbGFzdCBzdWNjZXNzZnVsIGF1dGhlbnRpY2F0aW9uLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBsb2dpbiBsYXN0IHVzZWQgc3VjY2Vzc2Z1bGx5IG9yIDxjb2RlPnVuZGVmaW5lZDwvY29kZT4uXG4gICAqL1xuICBnZXRDdXJyZW50TG9naW4oKSB7XG4gICAgcmV0dXJuIHRoaXMuX2xvZ2luO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiBpbmZvcm1hdGlvbiBhYm91dCB0aGUgc2VydmVyOiBwcm90b2NvbCB2ZXJzaW9uIGFuZCBidWlsZCB0aW1lc3RhbXAuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IGJ1aWxkIGFuZCB2ZXJzaW9uIG9mIHRoZSBzZXJ2ZXIgb3IgPGNvZGU+bnVsbDwvY29kZT4gaWYgdGhlcmUgaXMgbm8gY29ubmVjdGlvbiBvciBpZiB0aGUgZmlyc3Qgc2VydmVyIHJlc3BvbnNlIGhhcyBub3QgYmVlbiByZWNlaXZlZCB5ZXQuXG4gICAqL1xuICBnZXRTZXJ2ZXJJbmZvKCkge1xuICAgIHJldHVybiB0aGlzLl9zZXJ2ZXJJbmZvO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcG9ydCBhIHRvcGljIGZvciBhYnVzZS4gV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNwdWJsaXNofS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGFjdGlvbiAtIHRoZSBvbmx5IHN1cHBvcnRlZCBhY3Rpb24gaXMgJ3JlcG9ydCcuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0YXJnZXQgLSBuYW1lIG9mIHRoZSB0b3BpYyBiZWluZyByZXBvcnRlZC5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgdG8gYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgc2VydmVyIHJlc3BvbmRzIHRvIHJlcXVlc3QuXG4gICAqL1xuICByZXBvcnQoYWN0aW9uLCB0YXJnZXQpIHtcbiAgICByZXR1cm4gdGhpcy5wdWJsaXNoKENvbnN0LlRPUElDX1NZUywgRHJhZnR5LmF0dGFjaEpTT04obnVsbCwge1xuICAgICAgJ2FjdGlvbic6IGFjdGlvbixcbiAgICAgICd0YXJnZXQnOiB0YXJnZXRcbiAgICB9KSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHNlcnZlci1wcm92aWRlZCBjb25maWd1cmF0aW9uIHZhbHVlIChsb25nIGludGVnZXIpLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBvZiB0aGUgdmFsdWUgdG8gcmV0dXJuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkZWZhdWx0VmFsdWUgdG8gcmV0dXJuIGluIGNhc2Ugc2VydmVyIGxpbWl0IGlzIG5vdCBzZXQgb3Igbm90IGZvdW5kLlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSBuYW1lZCB2YWx1ZS5cbiAgICovXG4gIGdldFNlcnZlckxpbWl0KG5hbWUsIGRlZmF1bHRWYWx1ZSkge1xuICAgIHJldHVybiAodGhpcy5fc2VydmVySW5mbyA/IHRoaXMuX3NlcnZlckluZm9bbmFtZV0gOiBudWxsKSB8fCBkZWZhdWx0VmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogVG9nZ2xlIGNvbnNvbGUgbG9nZ2luZy4gTG9nZ2luZyBpcyBvZmYgYnkgZGVmYXVsdC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICogQHBhcmFtIHtib29sZWFufSBlbmFibGVkIC0gU2V0IHRvIDxjb2RlPnRydWU8L2NvZGU+IHRvIGVuYWJsZSBsb2dnaW5nIHRvIGNvbnNvbGUuXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gdHJpbUxvbmdTdHJpbmdzIC0gU2V0IHRvIDxjb2RlPnRydWU8L2NvZGU+IHRvIHRyaW0gbG9uZyBzdHJpbmdzLlxuICAgKi9cbiAgZW5hYmxlTG9nZ2luZyhlbmFibGVkLCB0cmltTG9uZ1N0cmluZ3MpIHtcbiAgICB0aGlzLl9sb2dnaW5nRW5hYmxlZCA9IGVuYWJsZWQ7XG4gICAgdGhpcy5fdHJpbUxvbmdTdHJpbmdzID0gZW5hYmxlZCAmJiB0cmltTG9uZ1N0cmluZ3M7XG4gIH1cblxuICAvKipcbiAgICogU2V0IFVJIGxhbmd1YWdlIHRvIHJlcG9ydCB0byB0aGUgc2VydmVyLiBNdXN0IGJlIGNhbGxlZCBiZWZvcmUgPGNvZGU+J2hpJzwvY29kZT4gaXMgc2VudCwgb3RoZXJ3aXNlIGl0IHdpbGwgbm90IGJlIHVzZWQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBobCAtIGh1bWFuIChVSSkgbGFuZ3VhZ2UsIGxpa2UgPGNvZGU+XCJlbl9VU1wiPC9jb2RlPiBvciA8Y29kZT5cInpoLUhhbnNcIjwvY29kZT4uXG4gICAqL1xuICBzZXRIdW1hbkxhbmd1YWdlKGhsKSB7XG4gICAgaWYgKGhsKSB7XG4gICAgICB0aGlzLl9odW1hbkxhbmd1YWdlID0gaGw7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGdpdmVuIHRvcGljIGlzIG9ubGluZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgb2YgdGhlIHRvcGljIHRvIHRlc3QuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIHRvcGljIGlzIG9ubGluZSwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgKi9cbiAgaXNUb3BpY09ubGluZShuYW1lKSB7XG4gICAgY29uc3QgdG9waWMgPSB0aGlzLiNjYWNoZUdldCgndG9waWMnLCBuYW1lKTtcbiAgICByZXR1cm4gdG9waWMgJiYgdG9waWMub25saW5lO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhY2Nlc3MgbW9kZSBmb3IgdGhlIGdpdmVuIGNvbnRhY3QuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIG9mIHRoZSB0b3BpYyB0byBxdWVyeS5cbiAgICogQHJldHVybnMge0FjY2Vzc01vZGV9IGFjY2VzcyBtb2RlIGlmIHRvcGljIGlzIGZvdW5kLCBudWxsIG90aGVyd2lzZS5cbiAgICovXG4gIGdldFRvcGljQWNjZXNzTW9kZShuYW1lKSB7XG4gICAgY29uc3QgdG9waWMgPSB0aGlzLiNjYWNoZUdldCgndG9waWMnLCBuYW1lKTtcbiAgICByZXR1cm4gdG9waWMgPyB0b3BpYy5hY3MgOiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEluY2x1ZGUgbWVzc2FnZSBJRCBpbnRvIGFsbCBzdWJzZXF1ZXN0IG1lc3NhZ2VzIHRvIHNlcnZlciBpbnN0cnVjdGluIGl0IHRvIHNlbmQgYWtub3dsZWRnZW1lbnMuXG4gICAqIFJlcXVpcmVkIGZvciBwcm9taXNlcyB0byBmdW5jdGlvbi4gRGVmYXVsdCBpcyA8Y29kZT5cIm9uXCI8L2NvZGU+LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHN0YXR1cyAtIFR1cm4gYWtub3dsZWRnZW1lbnMgb24gb3Igb2ZmLlxuICAgKiBAZGVwcmVjYXRlZFxuICAgKi9cbiAgd2FudEFrbihzdGF0dXMpIHtcbiAgICBpZiAoc3RhdHVzKSB7XG4gICAgICB0aGlzLl9tZXNzYWdlSWQgPSBNYXRoLmZsb29yKChNYXRoLnJhbmRvbSgpICogMHhGRkZGRkYpICsgMHhGRkZGRkYpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9tZXNzYWdlSWQgPSAwO1xuICAgIH1cbiAgfVxuXG4gIC8vIENhbGxiYWNrczpcbiAgLyoqXG4gICAqIENhbGxiYWNrIHRvIHJlcG9ydCB3aGVuIHRoZSB3ZWJzb2NrZXQgaXMgb3BlbmVkLiBUaGUgY2FsbGJhY2sgaGFzIG5vIHBhcmFtZXRlcnMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqIEB0eXBlIHtUaW5vZGUub25XZWJzb2NrZXRPcGVufVxuICAgKi9cbiAgb25XZWJzb2NrZXRPcGVuID0gdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBAdHlwZWRlZiBUaW5vZGUuU2VydmVyUGFyYW1zXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHByb3BlcnR5IHtzdHJpbmd9IHZlciAtIFNlcnZlciB2ZXJzaW9uXG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBidWlsZCAtIFNlcnZlciBidWlsZFxuICAgKiBAcHJvcGVydHkge3N0cmluZz19IHNpZCAtIFNlc3Npb24gSUQsIGxvbmcgcG9sbGluZyBjb25uZWN0aW9ucyBvbmx5LlxuICAgKi9cblxuICAvKipcbiAgICogQGNhbGxiYWNrIFRpbm9kZS5vbkNvbm5lY3RcbiAgICogQHBhcmFtIHtudW1iZXJ9IGNvZGUgLSBSZXN1bHQgY29kZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGV4dCAtIFRleHQgZXB4cGxhaW5pbmcgdGhlIGNvbXBsZXRpb24sIGkuZSBcIk9LXCIgb3IgYW4gZXJyb3IgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtUaW5vZGUuU2VydmVyUGFyYW1zfSBwYXJhbXMgLSBQYXJhbWV0ZXJzIHJldHVybmVkIGJ5IHRoZSBzZXJ2ZXIuXG4gICAqL1xuICAvKipcbiAgICogQ2FsbGJhY2sgdG8gcmVwb3J0IHdoZW4gY29ubmVjdGlvbiB3aXRoIFRpbm9kZSBzZXJ2ZXIgaXMgZXN0YWJsaXNoZWQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqIEB0eXBlIHtUaW5vZGUub25Db25uZWN0fVxuICAgKi9cbiAgb25Db25uZWN0ID0gdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBDYWxsYmFjayB0byByZXBvcnQgd2hlbiBjb25uZWN0aW9uIGlzIGxvc3QuIFRoZSBjYWxsYmFjayBoYXMgbm8gcGFyYW1ldGVycy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICogQHR5cGUge1Rpbm9kZS5vbkRpc2Nvbm5lY3R9XG4gICAqL1xuICBvbkRpc2Nvbm5lY3QgPSB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIEBjYWxsYmFjayBUaW5vZGUub25Mb2dpblxuICAgKiBAcGFyYW0ge251bWJlcn0gY29kZSAtIE5VbWVyaWMgY29tcGxldGlvbiBjb2RlLCBzYW1lIGFzIEhUVFAgc3RhdHVzIGNvZGVzLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGV4dCAtIEV4cGxhbmF0aW9uIG9mIHRoZSBjb21wbGV0aW9uIGNvZGUuXG4gICAqL1xuICAvKipcbiAgICogQ2FsbGJhY2sgdG8gcmVwb3J0IGxvZ2luIGNvbXBsZXRpb24uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqIEB0eXBlIHtUaW5vZGUub25Mb2dpbn1cbiAgICovXG4gIG9uTG9naW4gPSB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIHRvIHJlY2VpdmUgPGNvZGU+e2N0cmx9PC9jb2RlPiAoY29udHJvbCkgbWVzc2FnZXMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqIEB0eXBlIHtUaW5vZGUub25DdHJsTWVzc2FnZX1cbiAgICovXG4gIG9uQ3RybE1lc3NhZ2UgPSB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIHRvIHJlY2lldmUgPGNvZGU+e2RhdGF9PC9jb2RlPiAoY29udGVudCkgbWVzc2FnZXMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqIEB0eXBlIHtUaW5vZGUub25EYXRhTWVzc2FnZX1cbiAgICovXG4gIG9uRGF0YU1lc3NhZ2UgPSB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIHRvIHJlY2VpdmUgPGNvZGU+e3ByZXN9PC9jb2RlPiAocHJlc2VuY2UpIG1lc3NhZ2VzLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKiBAdHlwZSB7VGlub2RlLm9uUHJlc01lc3NhZ2V9XG4gICAqL1xuICBvblByZXNNZXNzYWdlID0gdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBDYWxsYmFjayB0byByZWNlaXZlIGFsbCBtZXNzYWdlcyBhcyBvYmplY3RzLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKiBAdHlwZSB7VGlub2RlLm9uTWVzc2FnZX1cbiAgICovXG4gIG9uTWVzc2FnZSA9IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQ2FsbGJhY2sgdG8gcmVjZWl2ZSBhbGwgbWVzc2FnZXMgYXMgdW5wYXJzZWQgdGV4dC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICogQHR5cGUge1Rpbm9kZS5vblJhd01lc3NhZ2V9XG4gICAqL1xuICBvblJhd01lc3NhZ2UgPSB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIHRvIHJlY2VpdmUgc2VydmVyIHJlc3BvbnNlcyB0byBuZXR3b3JrIHByb2Jlcy4gU2VlIHtAbGluayBUaW5vZGUjbmV0d29ya1Byb2JlfVxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKiBAdHlwZSB7VGlub2RlLm9uTmV0d29ya1Byb2JlfVxuICAgKi9cbiAgb25OZXR3b3JrUHJvYmUgPSB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIHRvIGJlIG5vdGlmaWVkIHdoZW4gZXhwb25lbnRpYWwgYmFja29mZiBpcyBpdGVyYXRpbmcuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqIEB0eXBlIHtUaW5vZGUub25BdXRvcmVjb25uZWN0SXRlcmF0aW9ufVxuICAgKi9cbiAgb25BdXRvcmVjb25uZWN0SXRlcmF0aW9uID0gdW5kZWZpbmVkO1xufTtcblxuLy8gRXhwb3J0ZWQgY29uc3RhbnRzXG5UaW5vZGUuTUVTU0FHRV9TVEFUVVNfTk9ORSA9IENvbnN0Lk1FU1NBR0VfU1RBVFVTX05PTkU7XG5UaW5vZGUuTUVTU0FHRV9TVEFUVVNfUVVFVUVEID0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfUVVFVUVEO1xuVGlub2RlLk1FU1NBR0VfU1RBVFVTX1NFTkRJTkcgPSBDb25zdC5NRVNTQUdFX1NUQVRVU19TRU5ESU5HO1xuVGlub2RlLk1FU1NBR0VfU1RBVFVTX0ZBSUxFRCA9IENvbnN0Lk1FU1NBR0VfU1RBVFVTX0ZBSUxFRDtcblRpbm9kZS5NRVNTQUdFX1NUQVRVU19TRU5UID0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfU0VOVDtcblRpbm9kZS5NRVNTQUdFX1NUQVRVU19SRUNFSVZFRCA9IENvbnN0Lk1FU1NBR0VfU1RBVFVTX1JFQ0VJVkVEO1xuVGlub2RlLk1FU1NBR0VfU1RBVFVTX1JFQUQgPSBDb25zdC5NRVNTQUdFX1NUQVRVU19SRUFEO1xuVGlub2RlLk1FU1NBR0VfU1RBVFVTX1RPX01FID0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfVE9fTUU7XG5UaW5vZGUuTUVTU0FHRV9TVEFUVVNfREVMX1JBTkdFID0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfREVMX1JBTkdFO1xuXG4vLyBVbmljb2RlIFtkZWxdIHN5bWJvbC5cblRpbm9kZS5ERUxfQ0hBUiA9IENvbnN0LkRFTF9DSEFSO1xuXG4vLyBOYW1lcyBvZiBrZXlzIHRvIHNlcnZlci1wcm92aWRlZCBjb25maWd1cmF0aW9uIGxpbWl0cy5cblRpbm9kZS5NQVhfTUVTU0FHRV9TSVpFID0gJ21heE1lc3NhZ2VTaXplJztcblRpbm9kZS5NQVhfU1VCU0NSSUJFUl9DT1VOVCA9ICdtYXhTdWJzY3JpYmVyQ291bnQnO1xuVGlub2RlLk1BWF9UQUdfQ09VTlQgPSAnbWF4VGFnQ291bnQnO1xuVGlub2RlLk1BWF9GSUxFX1VQTE9BRF9TSVpFID0gJ21heEZpbGVVcGxvYWRTaXplJztcbiIsIi8qKlxuICogQGZpbGUgVG9waWMgbWFuYWdlbWVudC5cbiAqXG4gKiBAY29weXJpZ2h0IDIwMTUtMjAyMiBUaW5vZGUgTExDLlxuICovXG4ndXNlIHN0cmljdCc7XG5cbmltcG9ydCBBY2Nlc3NNb2RlIGZyb20gJy4vYWNjZXNzLW1vZGUuanMnO1xuaW1wb3J0IENCdWZmZXIgZnJvbSAnLi9jYnVmZmVyLmpzJztcbmltcG9ydCAqIGFzIENvbnN0IGZyb20gJy4vY29uZmlnLmpzJztcbmltcG9ydCBEcmFmdHkgZnJvbSAnLi9kcmFmdHkuanMnO1xuaW1wb3J0IE1ldGFHZXRCdWlsZGVyIGZyb20gJy4vbWV0YS1idWlsZGVyLmpzJztcbmltcG9ydCB7XG4gIG1lcmdlT2JqLFxuICBtZXJnZVRvQ2FjaGUsXG4gIG5vcm1hbGl6ZUFycmF5XG59IGZyb20gJy4vdXRpbHMuanMnO1xuXG5leHBvcnQgY2xhc3MgVG9waWMge1xuICAvKipcbiAgICogQGNhbGxiYWNrIFRpbm9kZS5Ub3BpYy5vbkRhdGFcbiAgICogQHBhcmFtIHtEYXRhfSBkYXRhIC0gRGF0YSBwYWNrZXRcbiAgICovXG4gIC8qKlxuICAgKiBUb3BpYyBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyBhIGxvZ2ljYWwgY29tbXVuaWNhdGlvbiBjaGFubmVsLlxuICAgKiBAY2xhc3MgVG9waWNcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIGNyZWF0ZS5cbiAgICogQHBhcmFtIHtPYmplY3Q9fSBjYWxsYmFja3MgLSBPYmplY3Qgd2l0aCB2YXJpb3VzIGV2ZW50IGNhbGxiYWNrcy5cbiAgICogQHBhcmFtIHtUaW5vZGUuVG9waWMub25EYXRhfSBjYWxsYmFja3Mub25EYXRhIC0gQ2FsbGJhY2sgd2hpY2ggcmVjZWl2ZXMgYSA8Y29kZT57ZGF0YX08L2NvZGU+IG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7Y2FsbGJhY2t9IGNhbGxiYWNrcy5vbk1ldGEgLSBDYWxsYmFjayB3aGljaCByZWNlaXZlcyBhIDxjb2RlPnttZXRhfTwvY29kZT4gbWVzc2FnZS5cbiAgICogQHBhcmFtIHtjYWxsYmFja30gY2FsbGJhY2tzLm9uUHJlcyAtIENhbGxiYWNrIHdoaWNoIHJlY2VpdmVzIGEgPGNvZGU+e3ByZXN9PC9jb2RlPiBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge2NhbGxiYWNrfSBjYWxsYmFja3Mub25JbmZvIC0gQ2FsbGJhY2sgd2hpY2ggcmVjZWl2ZXMgYW4gPGNvZGU+e2luZm99PC9jb2RlPiBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge2NhbGxiYWNrfSBjYWxsYmFja3Mub25NZXRhRGVzYyAtIENhbGxiYWNrIHdoaWNoIHJlY2VpdmVzIGNoYW5nZXMgdG8gdG9waWMgZGVzY3Rpb3B0aW9uIHtAbGluayBkZXNjfS5cbiAgICogQHBhcmFtIHtjYWxsYmFja30gY2FsbGJhY2tzLm9uTWV0YVN1YiAtIENhbGxlZCBmb3IgYSBzaW5nbGUgc3Vic2NyaXB0aW9uIHJlY29yZCBjaGFuZ2UuXG4gICAqIEBwYXJhbSB7Y2FsbGJhY2t9IGNhbGxiYWNrcy5vblN1YnNVcGRhdGVkIC0gQ2FsbGVkIGFmdGVyIGEgYmF0Y2ggb2Ygc3Vic2NyaXB0aW9uIGNoYW5nZXMgaGF2ZSBiZWVuIHJlY2lldmVkIGFuZCBjYWNoZWQuXG4gICAqIEBwYXJhbSB7Y2FsbGJhY2t9IGNhbGxiYWNrcy5vbkRlbGV0ZVRvcGljIC0gQ2FsbGVkIGFmdGVyIHRoZSB0b3BpYyBpcyBkZWxldGVkLlxuICAgKiBAcGFyYW0ge2NhbGxiYWNrfSBjYWxsYmFjbHMub25BbGxNZXNzYWdlc1JlY2VpdmVkIC0gQ2FsbGVkIHdoZW4gYWxsIHJlcXVlc3RlZCA8Y29kZT57ZGF0YX08L2NvZGU+IG1lc3NhZ2VzIGhhdmUgYmVlbiByZWNpdmVkLlxuICAgKi9cbiAgY29uc3RydWN0b3IobmFtZSwgY2FsbGJhY2tzKSB7XG4gICAgLy8gUGFyZW50IFRpbm9kZSBvYmplY3QuXG4gICAgdGhpcy5fdGlub2RlID0gbnVsbDtcblxuICAgIC8vIFNlcnZlci1wcm92aWRlZCBkYXRhLCBsb2NhbGx5IGltbXV0YWJsZS5cbiAgICAvLyB0b3BpYyBuYW1lXG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAvLyBUaW1lc3RhbXAgd2hlbiB0aGUgdG9waWMgd2FzIGNyZWF0ZWQuXG4gICAgdGhpcy5jcmVhdGVkID0gbnVsbDtcbiAgICAvLyBUaW1lc3RhbXAgd2hlbiB0aGUgdG9waWMgd2FzIGxhc3QgdXBkYXRlZC5cbiAgICB0aGlzLnVwZGF0ZWQgPSBudWxsO1xuICAgIC8vIFRpbWVzdGFtcCBvZiB0aGUgbGFzdCBtZXNzYWdlc1xuICAgIHRoaXMudG91Y2hlZCA9IG5ldyBEYXRlKDApO1xuICAgIC8vIEFjY2VzcyBtb2RlLCBzZWUgQWNjZXNzTW9kZVxuICAgIHRoaXMuYWNzID0gbmV3IEFjY2Vzc01vZGUobnVsbCk7XG4gICAgLy8gUGVyLXRvcGljIHByaXZhdGUgZGF0YSAoYWNjZXNzaWJsZSBieSBjdXJyZW50IHVzZXIgb25seSkuXG4gICAgdGhpcy5wcml2YXRlID0gbnVsbDtcbiAgICAvLyBQZXItdG9waWMgcHVibGljIGRhdGEgKGFjY2Vzc2libGUgYnkgYWxsIHVzZXJzKS5cbiAgICB0aGlzLnB1YmxpYyA9IG51bGw7XG4gICAgLy8gUGVyLXRvcGljIHN5c3RlbS1wcm92aWRlZCBkYXRhIChhY2Nlc3NpYmxlIGJ5IGFsbCB1c2VycykuXG4gICAgdGhpcy50cnVzdGVkID0gbnVsbDtcblxuICAgIC8vIExvY2FsbHkgY2FjaGVkIGRhdGFcbiAgICAvLyBTdWJzY3JpYmVkIHVzZXJzLCBmb3IgdHJhY2tpbmcgcmVhZC9yZWN2L21zZyBub3RpZmljYXRpb25zLlxuICAgIHRoaXMuX3VzZXJzID0ge307XG5cbiAgICAvLyBDdXJyZW50IHZhbHVlIG9mIGxvY2FsbHkgaXNzdWVkIHNlcUlkLCB1c2VkIGZvciBwZW5kaW5nIG1lc3NhZ2VzLlxuICAgIHRoaXMuX3F1ZXVlZFNlcUlkID0gQ29uc3QuTE9DQUxfU0VRSUQ7XG5cbiAgICAvLyBUaGUgbWF4aW11bSBrbm93biB7ZGF0YS5zZXF9IHZhbHVlLlxuICAgIHRoaXMuX21heFNlcSA9IDA7XG4gICAgLy8gVGhlIG1pbmltdW0ga25vd24ge2RhdGEuc2VxfSB2YWx1ZS5cbiAgICB0aGlzLl9taW5TZXEgPSAwO1xuICAgIC8vIEluZGljYXRvciB0aGF0IHRoZSBsYXN0IHJlcXVlc3QgZm9yIGVhcmxpZXIgbWVzc2FnZXMgcmV0dXJuZWQgMC5cbiAgICB0aGlzLl9ub0VhcmxpZXJNc2dzID0gZmFsc2U7XG4gICAgLy8gVGhlIG1heGltdW0ga25vd24gZGVsZXRpb24gSUQuXG4gICAgdGhpcy5fbWF4RGVsID0gMDtcbiAgICAvLyBVc2VyIGRpc2NvdmVyeSB0YWdzXG4gICAgdGhpcy5fdGFncyA9IFtdO1xuICAgIC8vIENyZWRlbnRpYWxzIHN1Y2ggYXMgZW1haWwgb3IgcGhvbmUgbnVtYmVyLlxuICAgIHRoaXMuX2NyZWRlbnRpYWxzID0gW107XG4gICAgLy8gTWVzc2FnZSBjYWNoZSwgc29ydGVkIGJ5IG1lc3NhZ2Ugc2VxIHZhbHVlcywgZnJvbSBvbGQgdG8gbmV3LlxuICAgIHRoaXMuX21lc3NhZ2VzID0gbmV3IENCdWZmZXIoKGEsIGIpID0+IHtcbiAgICAgIHJldHVybiBhLnNlcSAtIGIuc2VxO1xuICAgIH0sIHRydWUpO1xuICAgIC8vIEJvb2xlYW4sIHRydWUgaWYgdGhlIHRvcGljIGlzIGN1cnJlbnRseSBsaXZlXG4gICAgdGhpcy5fYXR0YWNoZWQgPSBmYWxzZTtcbiAgICAvLyBUaW1lc3RhcCBvZiB0aGUgbW9zdCByZWNlbnRseSB1cGRhdGVkIHN1YnNjcmlwdGlvbi5cbiAgICB0aGlzLl9sYXN0U3Vic1VwZGF0ZSA9IG5ldyBEYXRlKDApO1xuICAgIC8vIFRvcGljIGNyZWF0ZWQgYnV0IG5vdCB5ZXQgc3luY2VkIHdpdGggdGhlIHNlcnZlci4gVXNlZCBvbmx5IGR1cmluZyBpbml0aWFsaXphdGlvbi5cbiAgICB0aGlzLl9uZXcgPSB0cnVlO1xuICAgIC8vIFRoZSB0b3BpYyBpcyBkZWxldGVkIGF0IHRoZSBzZXJ2ZXIsIHRoaXMgaXMgYSBsb2NhbCBjb3B5LlxuICAgIHRoaXMuX2RlbGV0ZWQgPSBmYWxzZTtcblxuICAgIC8vIENhbGxiYWNrc1xuICAgIGlmIChjYWxsYmFja3MpIHtcbiAgICAgIHRoaXMub25EYXRhID0gY2FsbGJhY2tzLm9uRGF0YTtcbiAgICAgIHRoaXMub25NZXRhID0gY2FsbGJhY2tzLm9uTWV0YTtcbiAgICAgIHRoaXMub25QcmVzID0gY2FsbGJhY2tzLm9uUHJlcztcbiAgICAgIHRoaXMub25JbmZvID0gY2FsbGJhY2tzLm9uSW5mbztcbiAgICAgIC8vIEEgc2luZ2xlIGRlc2MgdXBkYXRlO1xuICAgICAgdGhpcy5vbk1ldGFEZXNjID0gY2FsbGJhY2tzLm9uTWV0YURlc2M7XG4gICAgICAvLyBBIHNpbmdsZSBzdWJzY3JpcHRpb24gcmVjb3JkO1xuICAgICAgdGhpcy5vbk1ldGFTdWIgPSBjYWxsYmFja3Mub25NZXRhU3ViO1xuICAgICAgLy8gQWxsIHN1YnNjcmlwdGlvbiByZWNvcmRzIHJlY2VpdmVkO1xuICAgICAgdGhpcy5vblN1YnNVcGRhdGVkID0gY2FsbGJhY2tzLm9uU3Vic1VwZGF0ZWQ7XG4gICAgICB0aGlzLm9uVGFnc1VwZGF0ZWQgPSBjYWxsYmFja3Mub25UYWdzVXBkYXRlZDtcbiAgICAgIHRoaXMub25DcmVkc1VwZGF0ZWQgPSBjYWxsYmFja3Mub25DcmVkc1VwZGF0ZWQ7XG4gICAgICB0aGlzLm9uRGVsZXRlVG9waWMgPSBjYWxsYmFja3Mub25EZWxldGVUb3BpYztcbiAgICAgIHRoaXMub25BbGxNZXNzYWdlc1JlY2VpdmVkID0gY2FsbGJhY2tzLm9uQWxsTWVzc2FnZXNSZWNlaXZlZDtcbiAgICB9XG4gIH1cblxuICAvLyBTdGF0aWMgbWV0aG9kcy5cblxuICAvKipcbiAgICogRGV0ZXJtaW5lIHRvcGljIHR5cGUgZnJvbSB0b3BpYydzIG5hbWU6IGdycCwgcDJwLCBtZSwgZm5kLCBzeXMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byB0ZXN0LlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBPbmUgb2YgPGNvZGU+XCJtZVwiPC9jb2RlPiwgPGNvZGU+XCJmbmRcIjwvY29kZT4sIDxjb2RlPlwic3lzXCI8L2NvZGU+LCA8Y29kZT5cImdycFwiPC9jb2RlPixcbiAgICogICAgPGNvZGU+XCJwMnBcIjwvY29kZT4gb3IgPGNvZGU+dW5kZWZpbmVkPC9jb2RlPi5cbiAgICovXG4gIHN0YXRpYyB0b3BpY1R5cGUobmFtZSkge1xuICAgIGNvbnN0IHR5cGVzID0ge1xuICAgICAgJ21lJzogQ29uc3QuVE9QSUNfTUUsXG4gICAgICAnZm5kJzogQ29uc3QuVE9QSUNfRk5ELFxuICAgICAgJ2dycCc6IENvbnN0LlRPUElDX0dSUCxcbiAgICAgICduZXcnOiBDb25zdC5UT1BJQ19HUlAsXG4gICAgICAnbmNoJzogQ29uc3QuVE9QSUNfR1JQLFxuICAgICAgJ2Nobic6IENvbnN0LlRPUElDX0dSUCxcbiAgICAgICd1c3InOiBDb25zdC5UT1BJQ19QMlAsXG4gICAgICAnc3lzJzogQ29uc3QuVE9QSUNfU1lTXG4gICAgfTtcbiAgICByZXR1cm4gdHlwZXNbKHR5cGVvZiBuYW1lID09ICdzdHJpbmcnKSA/IG5hbWUuc3Vic3RyaW5nKDAsIDMpIDogJ3h4eCddO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSBnaXZlbiB0b3BpYyBuYW1lIGlzIGEgbmFtZSBvZiBhICdtZScgdG9waWMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byB0ZXN0LlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgdGhlIG5hbWUgaXMgYSBuYW1lIG9mIGEgJ21lJyB0b3BpYywgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIHN0YXRpYyBpc01lVG9waWNOYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gVG9waWMudG9waWNUeXBlKG5hbWUpID09IENvbnN0LlRPUElDX01FO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSBnaXZlbiB0b3BpYyBuYW1lIGlzIGEgbmFtZSBvZiBhIGdyb3VwIHRvcGljLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gdGVzdC5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIHRoZSBuYW1lIGlzIGEgbmFtZSBvZiBhIGdyb3VwIHRvcGljLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgc3RhdGljIGlzR3JvdXBUb3BpY05hbWUobmFtZSkge1xuICAgIHJldHVybiBUb3BpYy50b3BpY1R5cGUobmFtZSkgPT0gQ29uc3QuVE9QSUNfR1JQO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSBnaXZlbiB0b3BpYyBuYW1lIGlzIGEgbmFtZSBvZiBhIHAycCB0b3BpYy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIHRlc3QuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0aGUgbmFtZSBpcyBhIG5hbWUgb2YgYSBwMnAgdG9waWMsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBzdGF0aWMgaXNQMlBUb3BpY05hbWUobmFtZSkge1xuICAgIHJldHVybiBUb3BpYy50b3BpY1R5cGUobmFtZSkgPT0gQ29uc3QuVE9QSUNfUDJQO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSBnaXZlbiB0b3BpYyBuYW1lIGlzIGEgbmFtZSBvZiBhIGNvbW11bmljYXRpb24gdG9waWMsIGkuZS4gUDJQIG9yIGdyb3VwLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gdGVzdC5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIHRoZSBuYW1lIGlzIGEgbmFtZSBvZiBhIHAycCBvciBncm91cCB0b3BpYywgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIHN0YXRpYyBpc0NvbW1Ub3BpY05hbWUobmFtZSkge1xuICAgIHJldHVybiBUb3BpYy5pc1AyUFRvcGljTmFtZShuYW1lKSB8fCBUb3BpYy5pc0dyb3VwVG9waWNOYW1lKG5hbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSB0b3BpYyBuYW1lIGlzIGEgbmFtZSBvZiBhIG5ldyB0b3BpYy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIHRvcGljIG5hbWUgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIHtib29sZWFufSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0aGUgbmFtZSBpcyBhIG5hbWUgb2YgYSBuZXcgdG9waWMsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBzdGF0aWMgaXNOZXdHcm91cFRvcGljTmFtZShuYW1lKSB7XG4gICAgcmV0dXJuICh0eXBlb2YgbmFtZSA9PSAnc3RyaW5nJykgJiZcbiAgICAgIChuYW1lLnN1YnN0cmluZygwLCAzKSA9PSBDb25zdC5UT1BJQ19ORVcgfHwgbmFtZS5zdWJzdHJpbmcoMCwgMykgPT0gQ29uc3QuVE9QSUNfTkVXX0NIQU4pO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSB0b3BpYyBuYW1lIGlzIGEgbmFtZSBvZiBhIGNoYW5uZWwuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSB0b3BpYyBuYW1lIHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgdGhlIG5hbWUgaXMgYSBuYW1lIG9mIGEgY2hhbm5lbCwgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIHN0YXRpYyBpc0NoYW5uZWxUb3BpY05hbWUobmFtZSkge1xuICAgIHJldHVybiAodHlwZW9mIG5hbWUgPT0gJ3N0cmluZycpICYmXG4gICAgICAobmFtZS5zdWJzdHJpbmcoMCwgMykgPT0gQ29uc3QuVE9QSUNfQ0hBTiB8fCBuYW1lLnN1YnN0cmluZygwLCAzKSA9PSBDb25zdC5UT1BJQ19ORVdfQ0hBTik7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgdGhlIHRvcGljIGlzIHN1YnNjcmliZWQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlzIHRvcGljIGlzIGF0dGFjaGVkL3N1YnNjcmliZWQsIGZhbHNlIG90aGVyd2lzZS5cbiAgICovXG4gIGlzU3Vic2NyaWJlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fYXR0YWNoZWQ7XG4gIH1cblxuICAvKipcbiAgICogUmVxdWVzdCB0b3BpYyB0byBzdWJzY3JpYmUuIFdyYXBwZXIgZm9yIHtAbGluayBUaW5vZGUjc3Vic2NyaWJlfS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtUaW5vZGUuR2V0UXVlcnk9fSBnZXRQYXJhbXMgLSBnZXQgcXVlcnkgcGFyYW1ldGVycy5cbiAgICogQHBhcmFtIHtUaW5vZGUuU2V0UGFyYW1zPX0gc2V0UGFyYW1zIC0gc2V0IHBhcmFtZXRlcnMuXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHRvIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIHNlcnZlciByZXNwb25kcyB0byB0aGUgcmVxdWVzdC5cbiAgICovXG4gIHN1YnNjcmliZShnZXRQYXJhbXMsIHNldFBhcmFtcykge1xuICAgIC8vIElmIHRoZSB0b3BpYyBpcyBhbHJlYWR5IHN1YnNjcmliZWQsIHJldHVybiByZXNvbHZlZCBwcm9taXNlXG4gICAgaWYgKHRoaXMuX2F0dGFjaGVkKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMpO1xuICAgIH1cblxuICAgIC8vIElmIHRoZSB0b3BpYyBpcyBkZWxldGVkLCByZWplY3Qgc3Vic2NyaXB0aW9uIHJlcXVlc3RzLlxuICAgIGlmICh0aGlzLl9kZWxldGVkKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiQ29udmVyc2F0aW9uIGRlbGV0ZWRcIikpO1xuICAgIH1cblxuICAgIC8vIFNlbmQgc3Vic2NyaWJlIG1lc3NhZ2UsIGhhbmRsZSBhc3luYyByZXNwb25zZS5cbiAgICAvLyBJZiB0b3BpYyBuYW1lIGlzIGV4cGxpY2l0bHkgcHJvdmlkZWQsIHVzZSBpdC4gSWYgbm8gbmFtZSwgdGhlbiBpdCdzIGEgbmV3IGdyb3VwIHRvcGljLFxuICAgIC8vIHVzZSBcIm5ld1wiLlxuICAgIHJldHVybiB0aGlzLl90aW5vZGUuc3Vic2NyaWJlKHRoaXMubmFtZSB8fCBDb25zdC5UT1BJQ19ORVcsIGdldFBhcmFtcywgc2V0UGFyYW1zKS50aGVuKChjdHJsKSA9PiB7XG4gICAgICBpZiAoY3RybC5jb2RlID49IDMwMCkge1xuICAgICAgICAvLyBEbyBub3RoaW5nIGlmIHN1YnNjcmlwdGlvbiBzdGF0dXMgaGFzIG5vdCBjaGFuZ2VkLlxuICAgICAgICByZXR1cm4gY3RybDtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fYXR0YWNoZWQgPSB0cnVlO1xuICAgICAgdGhpcy5fZGVsZXRlZCA9IGZhbHNlO1xuICAgICAgdGhpcy5hY3MgPSAoY3RybC5wYXJhbXMgJiYgY3RybC5wYXJhbXMuYWNzKSA/IGN0cmwucGFyYW1zLmFjcyA6IHRoaXMuYWNzO1xuXG4gICAgICAvLyBTZXQgdG9waWMgbmFtZSBmb3IgbmV3IHRvcGljcyBhbmQgYWRkIGl0IHRvIGNhY2hlLlxuICAgICAgaWYgKHRoaXMuX25ldykge1xuICAgICAgICBkZWxldGUgdGhpcy5fbmV3O1xuXG4gICAgICAgIGlmICh0aGlzLm5hbWUgIT0gY3RybC50b3BpYykge1xuICAgICAgICAgIC8vIE5hbWUgbWF5IGNoYW5nZSBuZXcxMjM0NTYgLT4gZ3JwQWJDZEVmLiBSZW1vdmUgZnJvbSBjYWNoZSB1bmRlciB0aGUgb2xkIG5hbWUuXG4gICAgICAgICAgdGhpcy5fY2FjaGVEZWxTZWxmKCk7XG4gICAgICAgICAgdGhpcy5uYW1lID0gY3RybC50b3BpYztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9jYWNoZVB1dFNlbGYoKTtcblxuICAgICAgICB0aGlzLmNyZWF0ZWQgPSBjdHJsLnRzO1xuICAgICAgICB0aGlzLnVwZGF0ZWQgPSBjdHJsLnRzO1xuXG4gICAgICAgIGlmICh0aGlzLm5hbWUgIT0gQ29uc3QuVE9QSUNfTUUgJiYgdGhpcy5uYW1lICE9IENvbnN0LlRPUElDX0ZORCkge1xuICAgICAgICAgIC8vIEFkZCB0aGUgbmV3IHRvcGljIHRvIHRoZSBsaXN0IG9mIGNvbnRhY3RzIG1haW50YWluZWQgYnkgdGhlICdtZScgdG9waWMuXG4gICAgICAgICAgY29uc3QgbWUgPSB0aGlzLl90aW5vZGUuZ2V0TWVUb3BpYygpO1xuICAgICAgICAgIGlmIChtZS5vbk1ldGFTdWIpIHtcbiAgICAgICAgICAgIG1lLm9uTWV0YVN1Yih0aGlzKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKG1lLm9uU3Vic1VwZGF0ZWQpIHtcbiAgICAgICAgICAgIG1lLm9uU3Vic1VwZGF0ZWQoW3RoaXMubmFtZV0sIDEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzZXRQYXJhbXMgJiYgc2V0UGFyYW1zLmRlc2MpIHtcbiAgICAgICAgICBzZXRQYXJhbXMuZGVzYy5fbm9Gb3J3YXJkaW5nID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLl9wcm9jZXNzTWV0YURlc2Moc2V0UGFyYW1zLmRlc2MpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gY3RybDtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBkcmFmdCBvZiBhIG1lc3NhZ2Ugd2l0aG91dCBzZW5kaW5nIGl0IHRvIHRoZSBzZXJ2ZXIuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nIHwgT2JqZWN0fSBkYXRhIC0gQ29udGVudCB0byB3cmFwIGluIGEgZHJhZnQuXG4gICAqIEBwYXJhbSB7Ym9vbGVhbj19IG5vRWNobyAtIElmIDxjb2RlPnRydWU8L2NvZGU+IHNlcnZlciB3aWxsIG5vdCBlY2hvIG1lc3NhZ2UgYmFjayB0byBvcmlnaW5hdGluZ1xuICAgKiBzZXNzaW9uLiBPdGhlcndpc2UgdGhlIHNlcnZlciB3aWxsIHNlbmQgYSBjb3B5IG9mIHRoZSBtZXNzYWdlIHRvIHNlbmRlci5cbiAgICpcbiAgICogQHJldHVybnMge09iamVjdH0gbWVzc2FnZSBkcmFmdC5cbiAgICovXG4gIGNyZWF0ZU1lc3NhZ2UoZGF0YSwgbm9FY2hvKSB7XG4gICAgcmV0dXJuIHRoaXMuX3Rpbm9kZS5jcmVhdGVNZXNzYWdlKHRoaXMubmFtZSwgZGF0YSwgbm9FY2hvKTtcbiAgfVxuICAvKipcbiAgICogSW1tZWRpYXRlbHkgcHVibGlzaCBkYXRhIHRvIHRvcGljLiBXcmFwcGVyIGZvciB7QGxpbmsgVGlub2RlI3B1Ymxpc2h9LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZyB8IE9iamVjdH0gZGF0YSAtIERhdGEgdG8gcHVibGlzaCwgZWl0aGVyIHBsYWluIHN0cmluZyBvciBhIERyYWZ0eSBvYmplY3QuXG4gICAqIEBwYXJhbSB7Ym9vbGVhbj19IG5vRWNobyAtIElmIDxjb2RlPnRydWU8L2NvZGU+IHNlcnZlciB3aWxsIG5vdCBlY2hvIG1lc3NhZ2UgYmFjayB0byBvcmlnaW5hdGluZ1xuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBzZXJ2ZXIgcmVzcG9uZHMgdG8gdGhlIHJlcXVlc3QuXG4gICAqL1xuICBwdWJsaXNoKGRhdGEsIG5vRWNobykge1xuICAgIHJldHVybiB0aGlzLnB1Ymxpc2hNZXNzYWdlKHRoaXMuY3JlYXRlTWVzc2FnZShkYXRhLCBub0VjaG8pKTtcbiAgfVxuICAvKipcbiAgICogUHVibGlzaCBtZXNzYWdlIGNyZWF0ZWQgYnkge0BsaW5rIFRpbm9kZS5Ub3BpYyNjcmVhdGVNZXNzYWdlfS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHB1YiAtIHtkYXRhfSBvYmplY3QgdG8gcHVibGlzaC4gTXVzdCBiZSBjcmVhdGVkIGJ5IHtAbGluayBUaW5vZGUuVG9waWMjY3JlYXRlTWVzc2FnZX1cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgdG8gYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgc2VydmVyIHJlc3BvbmRzIHRvIHRoZSByZXF1ZXN0LlxuICAgKi9cbiAgcHVibGlzaE1lc3NhZ2UocHViKSB7XG4gICAgaWYgKCF0aGlzLl9hdHRhY2hlZCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIkNhbm5vdCBwdWJsaXNoIG9uIGluYWN0aXZlIHRvcGljXCIpKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuX3NlbmRpbmcpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJUaGUgbWVzc2FnZSBpcyBhbHJlYWR5IGJlaW5nIHNlbnRcIikpO1xuICAgIH1cblxuICAgIC8vIFNlbmQgZGF0YS5cbiAgICBwdWIuX3NlbmRpbmcgPSB0cnVlO1xuICAgIHB1Yi5fZmFpbGVkID0gZmFsc2U7XG5cbiAgICAvLyBFeHRyYWN0IHJlZmVyZWNlcyB0byBhdHRhY2htZW50cyBhbmQgb3V0IG9mIGJhbmQgaW1hZ2UgcmVjb3Jkcy5cbiAgICBsZXQgYXR0YWNobWVudHMgPSBudWxsO1xuICAgIGlmIChEcmFmdHkuaGFzRW50aXRpZXMocHViLmNvbnRlbnQpKSB7XG4gICAgICBhdHRhY2htZW50cyA9IFtdO1xuICAgICAgRHJhZnR5LmVudGl0aWVzKHB1Yi5jb250ZW50LCAoZGF0YSkgPT4ge1xuICAgICAgICBpZiAoZGF0YSAmJiBkYXRhLnJlZikge1xuICAgICAgICAgIGF0dGFjaG1lbnRzLnB1c2goZGF0YS5yZWYpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGlmIChhdHRhY2htZW50cy5sZW5ndGggPT0gMCkge1xuICAgICAgICBhdHRhY2htZW50cyA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3Rpbm9kZS5wdWJsaXNoTWVzc2FnZShwdWIsIGF0dGFjaG1lbnRzKS50aGVuKChjdHJsKSA9PiB7XG4gICAgICBwdWIuX3NlbmRpbmcgPSBmYWxzZTtcbiAgICAgIHB1Yi50cyA9IGN0cmwudHM7XG4gICAgICB0aGlzLnN3YXBNZXNzYWdlSWQocHViLCBjdHJsLnBhcmFtcy5zZXEpO1xuICAgICAgdGhpcy5fcm91dGVEYXRhKHB1Yik7XG4gICAgICByZXR1cm4gY3RybDtcbiAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICB0aGlzLl90aW5vZGUubG9nZ2VyKFwiV0FSTklORzogTWVzc2FnZSByZWplY3RlZCBieSB0aGUgc2VydmVyXCIsIGVycik7XG4gICAgICBwdWIuX3NlbmRpbmcgPSBmYWxzZTtcbiAgICAgIHB1Yi5fZmFpbGVkID0gdHJ1ZTtcbiAgICAgIGlmICh0aGlzLm9uRGF0YSkge1xuICAgICAgICB0aGlzLm9uRGF0YSgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIC8qKlxuICAgKiBBZGQgbWVzc2FnZSB0byBsb2NhbCBtZXNzYWdlIGNhY2hlLCBzZW5kIHRvIHRoZSBzZXJ2ZXIgd2hlbiB0aGUgcHJvbWlzZSBpcyByZXNvbHZlZC5cbiAgICogSWYgcHJvbWlzZSBpcyBudWxsIG9yIHVuZGVmaW5lZCwgdGhlIG1lc3NhZ2Ugd2lsbCBiZSBzZW50IGltbWVkaWF0ZWx5LlxuICAgKiBUaGUgbWVzc2FnZSBpcyBzZW50IHdoZW4gdGhlXG4gICAqIFRoZSBtZXNzYWdlIHNob3VsZCBiZSBjcmVhdGVkIGJ5IHtAbGluayBUaW5vZGUuVG9waWMjY3JlYXRlTWVzc2FnZX0uXG4gICAqIFRoaXMgaXMgcHJvYmFibHkgbm90IHRoZSBmaW5hbCBBUEkuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwdWIgLSBNZXNzYWdlIHRvIHVzZSBhcyBhIGRyYWZ0LlxuICAgKiBAcGFyYW0ge1Byb21pc2V9IHByb20gLSBNZXNzYWdlIHdpbGwgYmUgc2VudCB3aGVuIHRoaXMgcHJvbWlzZSBpcyByZXNvbHZlZCwgZGlzY2FyZGVkIGlmIHJlamVjdGVkLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gZGVyaXZlZCBwcm9taXNlLlxuICAgKi9cbiAgcHVibGlzaERyYWZ0KHB1YiwgcHJvbSkge1xuICAgIGNvbnN0IHNlcSA9IHB1Yi5zZXEgfHwgdGhpcy5fZ2V0UXVldWVkU2VxSWQoKTtcbiAgICBpZiAoIXB1Yi5fbm9Gb3J3YXJkaW5nKSB7XG4gICAgICAvLyBUaGUgJ3NlcScsICd0cycsIGFuZCAnZnJvbScgYXJlIGFkZGVkIHRvIG1pbWljIHtkYXRhfS4gVGhleSBhcmUgcmVtb3ZlZCBsYXRlclxuICAgICAgLy8gYmVmb3JlIHRoZSBtZXNzYWdlIGlzIHNlbnQuXG4gICAgICBwdWIuX25vRm9yd2FyZGluZyA9IHRydWU7XG4gICAgICBwdWIuc2VxID0gc2VxO1xuICAgICAgcHViLnRzID0gbmV3IERhdGUoKTtcbiAgICAgIHB1Yi5mcm9tID0gdGhpcy5fdGlub2RlLmdldEN1cnJlbnRVc2VySUQoKTtcblxuICAgICAgLy8gRG9uJ3QgbmVlZCBhbiBlY2hvIG1lc3NhZ2UgYmVjYXVzZSB0aGUgbWVzc2FnZSBpcyBhZGRlZCB0byBsb2NhbCBjYWNoZSByaWdodCBhd2F5LlxuICAgICAgcHViLm5vZWNobyA9IHRydWU7XG4gICAgICAvLyBBZGQgdG8gY2FjaGUuXG4gICAgICB0aGlzLl9tZXNzYWdlcy5wdXQocHViKTtcbiAgICAgIHRoaXMuX3Rpbm9kZS5fZGIuYWRkTWVzc2FnZShwdWIpO1xuXG4gICAgICBpZiAodGhpcy5vbkRhdGEpIHtcbiAgICAgICAgdGhpcy5vbkRhdGEocHViKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gSWYgcHJvbWlzZSBpcyBwcm92aWRlZCwgc2VuZCB0aGUgcXVldWVkIG1lc3NhZ2Ugd2hlbiBpdCdzIHJlc29sdmVkLlxuICAgIC8vIElmIG5vIHByb21pc2UgaXMgcHJvdmlkZWQsIGNyZWF0ZSBhIHJlc29sdmVkIG9uZSBhbmQgc2VuZCBpbW1lZGlhdGVseS5cbiAgICByZXR1cm4gKHByb20gfHwgUHJvbWlzZS5yZXNvbHZlKCkpXG4gICAgICAudGhlbihfID0+IHtcbiAgICAgICAgaWYgKHB1Yi5fY2FuY2VsbGVkKSB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNvZGU6IDMwMCxcbiAgICAgICAgICAgIHRleHQ6IFwiY2FuY2VsbGVkXCJcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnB1Ymxpc2hNZXNzYWdlKHB1Yik7XG4gICAgICB9KS5jYXRjaChlcnIgPT4ge1xuICAgICAgICB0aGlzLl90aW5vZGUubG9nZ2VyKFwiV0FSTklORzogTWVzc2FnZSBkcmFmdCByZWplY3RlZFwiLCBlcnIpO1xuICAgICAgICBwdWIuX3NlbmRpbmcgPSBmYWxzZTtcbiAgICAgICAgcHViLl9mYWlsZWQgPSB0cnVlO1xuICAgICAgICBpZiAodGhpcy5vbkRhdGEpIHtcbiAgICAgICAgICB0aGlzLm9uRGF0YSgpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFJldGhyb3cgdG8gbGV0IGNhbGxlciBrbm93IHRoYXQgdGhlIG9wZXJhdGlvbiBmYWlsZWQuXG4gICAgICAgIHRocm93IGVycjtcbiAgICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIExlYXZlIHRoZSB0b3BpYywgb3B0aW9uYWxseSB1bnNpYnNjcmliZS4gTGVhdmluZyB0aGUgdG9waWMgbWVhbnMgdGhlIHRvcGljIHdpbGwgc3RvcFxuICAgKiByZWNlaXZpbmcgdXBkYXRlcyBmcm9tIHRoZSBzZXJ2ZXIuIFVuc3Vic2NyaWJpbmcgd2lsbCB0ZXJtaW5hdGUgdXNlcidzIHJlbGF0aW9uc2hpcCB3aXRoIHRoZSB0b3BpYy5cbiAgICogV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNsZWF2ZX0uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbj19IHVuc3ViIC0gSWYgdHJ1ZSwgdW5zdWJzY3JpYmUsIG90aGVyd2lzZSBqdXN0IGxlYXZlLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBzZXJ2ZXIgcmVzcG9uZHMgdG8gdGhlIHJlcXVlc3QuXG4gICAqL1xuICBsZWF2ZSh1bnN1Yikge1xuICAgIC8vIEl0J3MgcG9zc2libGUgdG8gdW5zdWJzY3JpYmUgKHVuc3ViPT10cnVlKSBmcm9tIGluYWN0aXZlIHRvcGljLlxuICAgIGlmICghdGhpcy5fYXR0YWNoZWQgJiYgIXVuc3ViKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiQ2Fubm90IGxlYXZlIGluYWN0aXZlIHRvcGljXCIpKTtcbiAgICB9XG5cbiAgICAvLyBTZW5kIGEgJ2xlYXZlJyBtZXNzYWdlLCBoYW5kbGUgYXN5bmMgcmVzcG9uc2VcbiAgICByZXR1cm4gdGhpcy5fdGlub2RlLmxlYXZlKHRoaXMubmFtZSwgdW5zdWIpLnRoZW4oKGN0cmwpID0+IHtcbiAgICAgIHRoaXMuX3Jlc2V0U3ViKCk7XG4gICAgICBpZiAodW5zdWIpIHtcbiAgICAgICAgdGhpcy5fZ29uZSgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGN0cmw7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmVxdWVzdCB0b3BpYyBtZXRhZGF0YSBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7VGlub2RlLkdldFF1ZXJ5fSByZXF1ZXN0IHBhcmFtZXRlcnNcbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgdG8gYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgc2VydmVyIHJlc3BvbmRzIHRvIHJlcXVlc3QuXG4gICAqL1xuICBnZXRNZXRhKHBhcmFtcykge1xuICAgIC8vIFNlbmQge2dldH0gbWVzc2FnZSwgcmV0dXJuIHByb21pc2UuXG4gICAgcmV0dXJuIHRoaXMuX3Rpbm9kZS5nZXRNZXRhKHRoaXMubmFtZSwgcGFyYW1zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXF1ZXN0IG1vcmUgbWVzc2FnZXMgZnJvbSB0aGUgc2VydmVyXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBsaW1pdCBudW1iZXIgb2YgbWVzc2FnZXMgdG8gZ2V0LlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGZvcndhcmQgaWYgdHJ1ZSwgcmVxdWVzdCBuZXdlciBtZXNzYWdlcy5cbiAgICovXG4gIGdldE1lc3NhZ2VzUGFnZShsaW1pdCwgZm9yd2FyZCkge1xuICAgIGxldCBxdWVyeSA9IGZvcndhcmQgP1xuICAgICAgdGhpcy5zdGFydE1ldGFRdWVyeSgpLndpdGhMYXRlckRhdGEobGltaXQpIDpcbiAgICAgIHRoaXMuc3RhcnRNZXRhUXVlcnkoKS53aXRoRWFybGllckRhdGEobGltaXQpO1xuXG4gICAgLy8gRmlyc3QgdHJ5IGZldGNoaW5nIGZyb20gREIsIHRoZW4gZnJvbSB0aGUgc2VydmVyLlxuICAgIHJldHVybiB0aGlzLl9sb2FkTWVzc2FnZXModGhpcy5fdGlub2RlLl9kYiwgcXVlcnkuZXh0cmFjdCgnZGF0YScpKVxuICAgICAgLnRoZW4oKGNvdW50KSA9PiB7XG4gICAgICAgIGlmIChjb3VudCA9PSBsaW1pdCkge1xuICAgICAgICAgIC8vIEdvdCBlbm91Z2ggbWVzc2FnZXMgZnJvbSBsb2NhbCBjYWNoZS5cbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHtcbiAgICAgICAgICAgIHRvcGljOiB0aGlzLm5hbWUsXG4gICAgICAgICAgICBjb2RlOiAyMDAsXG4gICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgY291bnQ6IGNvdW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZWR1Y2UgdGhlIGNvdW50IG9mIHJlcXVlc3RlZCBtZXNzYWdlcy5cbiAgICAgICAgbGltaXQgLT0gY291bnQ7XG4gICAgICAgIC8vIFVwZGF0ZSBxdWVyeSB3aXRoIG5ldyB2YWx1ZXMgbG9hZGVkIGZyb20gREIuXG4gICAgICAgIHF1ZXJ5ID0gZm9yd2FyZCA/IHRoaXMuc3RhcnRNZXRhUXVlcnkoKS53aXRoTGF0ZXJEYXRhKGxpbWl0KSA6XG4gICAgICAgICAgdGhpcy5zdGFydE1ldGFRdWVyeSgpLndpdGhFYXJsaWVyRGF0YShsaW1pdCk7XG4gICAgICAgIGxldCBwcm9taXNlID0gdGhpcy5nZXRNZXRhKHF1ZXJ5LmJ1aWxkKCkpO1xuICAgICAgICBpZiAoIWZvcndhcmQpIHtcbiAgICAgICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKChjdHJsKSA9PiB7XG4gICAgICAgICAgICBpZiAoY3RybCAmJiBjdHJsLnBhcmFtcyAmJiAhY3RybC5wYXJhbXMuY291bnQpIHtcbiAgICAgICAgICAgICAgdGhpcy5fbm9FYXJsaWVyTXNncyA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICB9KTtcbiAgfVxuICAvKipcbiAgICogVXBkYXRlIHRvcGljIG1ldGFkYXRhLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge1Rpbm9kZS5TZXRQYXJhbXN9IHBhcmFtcyBwYXJhbWV0ZXJzIHRvIHVwZGF0ZS5cbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgdG8gYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgc2VydmVyIHJlc3BvbmRzIHRvIHJlcXVlc3QuXG4gICAqL1xuICBzZXRNZXRhKHBhcmFtcykge1xuICAgIGlmIChwYXJhbXMudGFncykge1xuICAgICAgcGFyYW1zLnRhZ3MgPSBub3JtYWxpemVBcnJheShwYXJhbXMudGFncyk7XG4gICAgfVxuICAgIC8vIFNlbmQgU2V0IG1lc3NhZ2UsIGhhbmRsZSBhc3luYyByZXNwb25zZS5cbiAgICByZXR1cm4gdGhpcy5fdGlub2RlLnNldE1ldGEodGhpcy5uYW1lLCBwYXJhbXMpXG4gICAgICAudGhlbigoY3RybCkgPT4ge1xuICAgICAgICBpZiAoY3RybCAmJiBjdHJsLmNvZGUgPj0gMzAwKSB7XG4gICAgICAgICAgLy8gTm90IG1vZGlmaWVkXG4gICAgICAgICAgcmV0dXJuIGN0cmw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocGFyYW1zLnN1Yikge1xuICAgICAgICAgIHBhcmFtcy5zdWIudG9waWMgPSB0aGlzLm5hbWU7XG4gICAgICAgICAgaWYgKGN0cmwucGFyYW1zICYmIGN0cmwucGFyYW1zLmFjcykge1xuICAgICAgICAgICAgcGFyYW1zLnN1Yi5hY3MgPSBjdHJsLnBhcmFtcy5hY3M7XG4gICAgICAgICAgICBwYXJhbXMuc3ViLnVwZGF0ZWQgPSBjdHJsLnRzO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoIXBhcmFtcy5zdWIudXNlcikge1xuICAgICAgICAgICAgLy8gVGhpcyBpcyBhIHN1YnNjcmlwdGlvbiB1cGRhdGUgb2YgdGhlIGN1cnJlbnQgdXNlci5cbiAgICAgICAgICAgIC8vIEFzc2lnbiB1c2VyIElEIG90aGVyd2lzZSB0aGUgdXBkYXRlIHdpbGwgYmUgaWdub3JlZCBieSBfcHJvY2Vzc01ldGFTdWIuXG4gICAgICAgICAgICBwYXJhbXMuc3ViLnVzZXIgPSB0aGlzLl90aW5vZGUuZ2V0Q3VycmVudFVzZXJJRCgpO1xuICAgICAgICAgICAgaWYgKCFwYXJhbXMuZGVzYykge1xuICAgICAgICAgICAgICAvLyBGb3JjZSB1cGRhdGUgdG8gdG9waWMncyBhc2MuXG4gICAgICAgICAgICAgIHBhcmFtcy5kZXNjID0ge307XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHBhcmFtcy5zdWIuX25vRm9yd2FyZGluZyA9IHRydWU7XG4gICAgICAgICAgdGhpcy5fcHJvY2Vzc01ldGFTdWIoW3BhcmFtcy5zdWJdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwYXJhbXMuZGVzYykge1xuICAgICAgICAgIGlmIChjdHJsLnBhcmFtcyAmJiBjdHJsLnBhcmFtcy5hY3MpIHtcbiAgICAgICAgICAgIHBhcmFtcy5kZXNjLmFjcyA9IGN0cmwucGFyYW1zLmFjcztcbiAgICAgICAgICAgIHBhcmFtcy5kZXNjLnVwZGF0ZWQgPSBjdHJsLnRzO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLl9wcm9jZXNzTWV0YURlc2MocGFyYW1zLmRlc2MpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHBhcmFtcy50YWdzKSB7XG4gICAgICAgICAgdGhpcy5fcHJvY2Vzc01ldGFUYWdzKHBhcmFtcy50YWdzKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocGFyYW1zLmNyZWQpIHtcbiAgICAgICAgICB0aGlzLl9wcm9jZXNzTWV0YUNyZWRzKFtwYXJhbXMuY3JlZF0sIHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGN0cmw7XG4gICAgICB9KTtcbiAgfVxuICAvKipcbiAgICogVXBkYXRlIGFjY2VzcyBtb2RlIG9mIHRoZSBjdXJyZW50IHVzZXIgb3Igb2YgYW5vdGhlciB0b3BpYyBzdWJzcmliZXIuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1aWQgLSBVSUQgb2YgdGhlIHVzZXIgdG8gdXBkYXRlIG9yIG51bGwgdG8gdXBkYXRlIGN1cnJlbnQgdXNlci5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHVwZGF0ZSAtIHRoZSB1cGRhdGUgdmFsdWUsIGZ1bGwgb3IgZGVsdGEuXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHRvIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIHNlcnZlciByZXNwb25kcyB0byByZXF1ZXN0LlxuICAgKi9cbiAgdXBkYXRlTW9kZSh1aWQsIHVwZGF0ZSkge1xuICAgIGNvbnN0IHVzZXIgPSB1aWQgPyB0aGlzLnN1YnNjcmliZXIodWlkKSA6IG51bGw7XG4gICAgY29uc3QgYW0gPSB1c2VyID9cbiAgICAgIHVzZXIuYWNzLnVwZGF0ZUdpdmVuKHVwZGF0ZSkuZ2V0R2l2ZW4oKSA6XG4gICAgICB0aGlzLmdldEFjY2Vzc01vZGUoKS51cGRhdGVXYW50KHVwZGF0ZSkuZ2V0V2FudCgpO1xuXG4gICAgcmV0dXJuIHRoaXMuc2V0TWV0YSh7XG4gICAgICBzdWI6IHtcbiAgICAgICAgdXNlcjogdWlkLFxuICAgICAgICBtb2RlOiBhbVxuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIC8qKlxuICAgKiBDcmVhdGUgbmV3IHRvcGljIHN1YnNjcmlwdGlvbi4gV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNzZXRNZXRhfS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVpZCAtIElEIG9mIHRoZSB1c2VyIHRvIGludml0ZVxuICAgKiBAcGFyYW0ge3N0cmluZz19IG1vZGUgLSBBY2Nlc3MgbW9kZS4gPGNvZGU+bnVsbDwvY29kZT4gbWVhbnMgdG8gdXNlIGRlZmF1bHQuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHRvIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIHNlcnZlciByZXNwb25kcyB0byByZXF1ZXN0LlxuICAgKi9cbiAgaW52aXRlKHVpZCwgbW9kZSkge1xuICAgIHJldHVybiB0aGlzLnNldE1ldGEoe1xuICAgICAgc3ViOiB7XG4gICAgICAgIHVzZXI6IHVpZCxcbiAgICAgICAgbW9kZTogbW9kZVxuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIC8qKlxuICAgKiBBcmNoaXZlIG9yIHVuLWFyY2hpdmUgdGhlIHRvcGljLiBXcmFwcGVyIGZvciB7QGxpbmsgVGlub2RlI3NldE1ldGF9LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGFyY2ggLSB0cnVlIHRvIGFyY2hpdmUgdGhlIHRvcGljLCBmYWxzZSBvdGhlcndpc2UuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHRvIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIHNlcnZlciByZXNwb25kcyB0byByZXF1ZXN0LlxuICAgKi9cbiAgYXJjaGl2ZShhcmNoKSB7XG4gICAgaWYgKHRoaXMucHJpdmF0ZSAmJiAoIXRoaXMucHJpdmF0ZS5hcmNoID09ICFhcmNoKSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShhcmNoKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc2V0TWV0YSh7XG4gICAgICBkZXNjOiB7XG4gICAgICAgIHByaXZhdGU6IHtcbiAgICAgICAgICBhcmNoOiBhcmNoID8gdHJ1ZSA6IENvbnN0LkRFTF9DSEFSXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICAvKipcbiAgICogRGVsZXRlIG1lc3NhZ2VzLiBIYXJkLWRlbGV0aW5nIG1lc3NhZ2VzIHJlcXVpcmVzIE93bmVyIHBlcm1pc3Npb24uXG4gICAqIFdyYXBwZXIgZm9yIHtAbGluayBUaW5vZGUjZGVsTWVzc2FnZXN9LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge1Rpbm9kZS5EZWxSYW5nZVtdfSByYW5nZXMgLSBSYW5nZXMgb2YgbWVzc2FnZSBJRHMgdG8gZGVsZXRlLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBoYXJkIC0gSGFyZCBvciBzb2Z0IGRlbGV0ZVxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBzZXJ2ZXIgcmVzcG9uZHMgdG8gcmVxdWVzdC5cbiAgICovXG4gIGRlbE1lc3NhZ2VzKHJhbmdlcywgaGFyZCkge1xuICAgIGlmICghdGhpcy5fYXR0YWNoZWQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJDYW5ub3QgZGVsZXRlIG1lc3NhZ2VzIGluIGluYWN0aXZlIHRvcGljXCIpKTtcbiAgICB9XG5cbiAgICAvLyBTb3J0IHJhbmdlcyBpbiBhY2NlbmRpbmcgb3JkZXIgYnkgbG93LCB0aGUgZGVzY2VuZGluZyBieSBoaS5cbiAgICByYW5nZXMuc29ydCgocjEsIHIyKSA9PiB7XG4gICAgICBpZiAocjEubG93IDwgcjIubG93KSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgaWYgKHIxLmxvdyA9PSByMi5sb3cpIHtcbiAgICAgICAgcmV0dXJuICFyMi5oaSB8fCAocjEuaGkgPj0gcjIuaGkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0pO1xuXG4gICAgLy8gUmVtb3ZlIHBlbmRpbmcgbWVzc2FnZXMgZnJvbSByYW5nZXMgcG9zc2libHkgY2xpcHBpbmcgc29tZSByYW5nZXMuXG4gICAgbGV0IHRvc2VuZCA9IHJhbmdlcy5yZWR1Y2UoKG91dCwgcikgPT4ge1xuICAgICAgaWYgKHIubG93IDwgQ29uc3QuTE9DQUxfU0VRSUQpIHtcbiAgICAgICAgaWYgKCFyLmhpIHx8IHIuaGkgPCBDb25zdC5MT0NBTF9TRVFJRCkge1xuICAgICAgICAgIG91dC5wdXNoKHIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIENsaXAgaGkgdG8gbWF4IGFsbG93ZWQgdmFsdWUuXG4gICAgICAgICAgb3V0LnB1c2goe1xuICAgICAgICAgICAgbG93OiByLmxvdyxcbiAgICAgICAgICAgIGhpOiB0aGlzLl9tYXhTZXEgKyAxXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBvdXQ7XG4gICAgfSwgW10pO1xuXG4gICAgLy8gU2VuZCB7ZGVsfSBtZXNzYWdlLCByZXR1cm4gcHJvbWlzZVxuICAgIGxldCByZXN1bHQ7XG4gICAgaWYgKHRvc2VuZC5sZW5ndGggPiAwKSB7XG4gICAgICByZXN1bHQgPSB0aGlzLl90aW5vZGUuZGVsTWVzc2FnZXModGhpcy5uYW1lLCB0b3NlbmQsIGhhcmQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHQgPSBQcm9taXNlLnJlc29sdmUoe1xuICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICBkZWw6IDBcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIC8vIFVwZGF0ZSBsb2NhbCBjYWNoZS5cbiAgICByZXR1cm4gcmVzdWx0LnRoZW4oKGN0cmwpID0+IHtcbiAgICAgIGlmIChjdHJsLnBhcmFtcy5kZWwgPiB0aGlzLl9tYXhEZWwpIHtcbiAgICAgICAgdGhpcy5fbWF4RGVsID0gY3RybC5wYXJhbXMuZGVsO1xuICAgICAgfVxuXG4gICAgICByYW5nZXMuZm9yRWFjaCgocikgPT4ge1xuICAgICAgICBpZiAoci5oaSkge1xuICAgICAgICAgIHRoaXMuZmx1c2hNZXNzYWdlUmFuZ2Uoci5sb3csIHIuaGkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuZmx1c2hNZXNzYWdlKHIubG93KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuX3VwZGF0ZURlbGV0ZWRSYW5nZXMoKTtcblxuICAgICAgaWYgKHRoaXMub25EYXRhKSB7XG4gICAgICAgIC8vIENhbGxpbmcgd2l0aCBubyBwYXJhbWV0ZXJzIHRvIGluZGljYXRlIHRoZSBtZXNzYWdlcyB3ZXJlIGRlbGV0ZWQuXG4gICAgICAgIHRoaXMub25EYXRhKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY3RybDtcbiAgICB9KTtcbiAgfVxuICAvKipcbiAgICogRGVsZXRlIGFsbCBtZXNzYWdlcy4gSGFyZC1kZWxldGluZyBtZXNzYWdlcyByZXF1aXJlcyBPd25lciBwZXJtaXNzaW9uLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGhhcmREZWwgLSB0cnVlIGlmIG1lc3NhZ2VzIHNob3VsZCBiZSBoYXJkLWRlbGV0ZWQuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHRvIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIHNlcnZlciByZXNwb25kcyB0byByZXF1ZXN0LlxuICAgKi9cbiAgZGVsTWVzc2FnZXNBbGwoaGFyZERlbCkge1xuICAgIGlmICghdGhpcy5fbWF4U2VxIHx8IHRoaXMuX21heFNlcSA8PSAwKSB7XG4gICAgICAvLyBUaGVyZSBhcmUgbm8gbWVzc2FnZXMgdG8gZGVsZXRlLlxuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5kZWxNZXNzYWdlcyhbe1xuICAgICAgbG93OiAxLFxuICAgICAgaGk6IHRoaXMuX21heFNlcSArIDEsXG4gICAgICBfYWxsOiB0cnVlXG4gICAgfV0sIGhhcmREZWwpO1xuICB9XG4gIC8qKlxuICAgKiBEZWxldGUgbXVsdGlwbGUgbWVzc2FnZXMgZGVmaW5lZCBieSB0aGVpciBJRHMuIEhhcmQtZGVsZXRpbmcgbWVzc2FnZXMgcmVxdWlyZXMgT3duZXIgcGVybWlzc2lvbi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtUaW5vZGUuRGVsUmFuZ2VbXX0gbGlzdCAtIGxpc3Qgb2Ygc2VxIElEcyB0byBkZWxldGVcbiAgICogQHBhcmFtIHtib29sZWFuPX0gaGFyZERlbCAtIHRydWUgaWYgbWVzc2FnZXMgc2hvdWxkIGJlIGhhcmQtZGVsZXRlZC5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgdG8gYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgc2VydmVyIHJlc3BvbmRzIHRvIHJlcXVlc3QuXG4gICAqL1xuICBkZWxNZXNzYWdlc0xpc3QobGlzdCwgaGFyZERlbCkge1xuICAgIC8vIFNvcnQgdGhlIGxpc3QgaW4gYXNjZW5kaW5nIG9yZGVyXG4gICAgbGlzdC5zb3J0KChhLCBiKSA9PiBhIC0gYik7XG4gICAgLy8gQ29udmVydCB0aGUgYXJyYXkgb2YgSURzIHRvIHJhbmdlcy5cbiAgICBsZXQgcmFuZ2VzID0gbGlzdC5yZWR1Y2UoKG91dCwgaWQpID0+IHtcbiAgICAgIGlmIChvdXQubGVuZ3RoID09IDApIHtcbiAgICAgICAgLy8gRmlyc3QgZWxlbWVudC5cbiAgICAgICAgb3V0LnB1c2goe1xuICAgICAgICAgIGxvdzogaWRcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgcHJldiA9IG91dFtvdXQubGVuZ3RoIC0gMV07XG4gICAgICAgIGlmICgoIXByZXYuaGkgJiYgKGlkICE9IHByZXYubG93ICsgMSkpIHx8IChpZCA+IHByZXYuaGkpKSB7XG4gICAgICAgICAgLy8gTmV3IHJhbmdlLlxuICAgICAgICAgIG91dC5wdXNoKHtcbiAgICAgICAgICAgIGxvdzogaWRcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBFeHBhbmQgZXhpc3RpbmcgcmFuZ2UuXG4gICAgICAgICAgcHJldi5oaSA9IHByZXYuaGkgPyBNYXRoLm1heChwcmV2LmhpLCBpZCArIDEpIDogaWQgKyAxO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gb3V0O1xuICAgIH0sIFtdKTtcbiAgICAvLyBTZW5kIHtkZWx9IG1lc3NhZ2UsIHJldHVybiBwcm9taXNlXG4gICAgcmV0dXJuIHRoaXMuZGVsTWVzc2FnZXMocmFuZ2VzLCBoYXJkRGVsKTtcbiAgfVxuICAvKipcbiAgICogRGVsZXRlIHRvcGljLiBSZXF1aXJlcyBPd25lciBwZXJtaXNzaW9uLiBXcmFwcGVyIGZvciB7QGxpbmsgVGlub2RlI2RlbFRvcGljfS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSBoYXJkIC0gaGFkLWRlbGV0ZSB0b3BpYy5cbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgdG8gYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgc2VydmVyIHJlc3BvbmRzIHRvIHRoZSByZXF1ZXN0LlxuICAgKi9cbiAgZGVsVG9waWMoaGFyZCkge1xuICAgIGlmICh0aGlzLl9kZWxldGVkKSB7XG4gICAgICAvLyBUaGUgdG9waWMgaXMgYWxyZWFkeSBkZWxldGVkIGF0IHRoZSBzZXJ2ZXIsIGp1c3QgcmVtb3ZlIGZyb20gREIuXG4gICAgICB0aGlzLl9nb25lKCk7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG51bGwpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl90aW5vZGUuZGVsVG9waWModGhpcy5uYW1lLCBoYXJkKS50aGVuKChjdHJsKSA9PiB7XG4gICAgICB0aGlzLl9kZWxldGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMuX3Jlc2V0U3ViKCk7XG4gICAgICB0aGlzLl9nb25lKCk7XG4gICAgICByZXR1cm4gY3RybDtcbiAgICB9KTtcbiAgfVxuICAvKipcbiAgICogRGVsZXRlIHN1YnNjcmlwdGlvbi4gUmVxdWlyZXMgU2hhcmUgcGVybWlzc2lvbi4gV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNkZWxTdWJzY3JpcHRpb259LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdXNlciAtIElEIG9mIHRoZSB1c2VyIHRvIHJlbW92ZSBzdWJzY3JpcHRpb24gZm9yLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBzZXJ2ZXIgcmVzcG9uZHMgdG8gcmVxdWVzdC5cbiAgICovXG4gIGRlbFN1YnNjcmlwdGlvbih1c2VyKSB7XG4gICAgaWYgKCF0aGlzLl9hdHRhY2hlZCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIkNhbm5vdCBkZWxldGUgc3Vic2NyaXB0aW9uIGluIGluYWN0aXZlIHRvcGljXCIpKTtcbiAgICB9XG4gICAgLy8gU2VuZCB7ZGVsfSBtZXNzYWdlLCByZXR1cm4gcHJvbWlzZVxuICAgIHJldHVybiB0aGlzLl90aW5vZGUuZGVsU3Vic2NyaXB0aW9uKHRoaXMubmFtZSwgdXNlcikudGhlbigoY3RybCkgPT4ge1xuICAgICAgLy8gUmVtb3ZlIHRoZSBvYmplY3QgZnJvbSB0aGUgc3Vic2NyaXB0aW9uIGNhY2hlO1xuICAgICAgZGVsZXRlIHRoaXMuX3VzZXJzW3VzZXJdO1xuICAgICAgLy8gTm90aWZ5IGxpc3RlbmVyc1xuICAgICAgaWYgKHRoaXMub25TdWJzVXBkYXRlZCkge1xuICAgICAgICB0aGlzLm9uU3Vic1VwZGF0ZWQoT2JqZWN0LmtleXModGhpcy5fdXNlcnMpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjdHJsO1xuICAgIH0pO1xuICB9XG4gIC8qKlxuICAgKiBTZW5kIGEgcmVhZC9yZWN2IG5vdGlmaWNhdGlvbi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHdoYXQgLSB3aGF0IG5vdGlmaWNhdGlvbiB0byBzZW5kOiA8Y29kZT5yZWN2PC9jb2RlPiwgPGNvZGU+cmVhZDwvY29kZT4uXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzZXEgLSBJRCBvciB0aGUgbWVzc2FnZSByZWFkIG9yIHJlY2VpdmVkLlxuICAgKi9cbiAgbm90ZSh3aGF0LCBzZXEpIHtcbiAgICBpZiAoIXRoaXMuX2F0dGFjaGVkKSB7XG4gICAgICAvLyBDYW5ub3Qgc2VuZGluZyB7bm90ZX0gb24gYW4gaW5hY3RpdmUgdG9waWNcIi5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBVcGRhdGUgbG9jYWwgY2FjaGUgd2l0aCB0aGUgbmV3IGNvdW50LlxuICAgIGNvbnN0IHVzZXIgPSB0aGlzLl91c2Vyc1t0aGlzLl90aW5vZGUuZ2V0Q3VycmVudFVzZXJJRCgpXTtcbiAgICBsZXQgdXBkYXRlID0gZmFsc2U7XG4gICAgaWYgKHVzZXIpIHtcbiAgICAgIC8vIFNlbGYtc3Vic2NyaXB0aW9uIGlzIGZvdW5kLlxuICAgICAgaWYgKCF1c2VyW3doYXRdIHx8IHVzZXJbd2hhdF0gPCBzZXEpIHtcbiAgICAgICAgdXNlclt3aGF0XSA9IHNlcTtcbiAgICAgICAgdXBkYXRlID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gU2VsZi1zdWJzY3JpcHRpb24gaXMgbm90IGZvdW5kLlxuICAgICAgdXBkYXRlID0gKHRoaXNbd2hhdF0gfCAwKSA8IHNlcTtcbiAgICB9XG5cbiAgICBpZiAodXBkYXRlKSB7XG4gICAgICAvLyBTZW5kIG5vdGlmaWNhdGlvbiB0byB0aGUgc2VydmVyLlxuICAgICAgdGhpcy5fdGlub2RlLm5vdGUodGhpcy5uYW1lLCB3aGF0LCBzZXEpO1xuICAgICAgLy8gVXBkYXRlIGxvY2FsbHkgY2FjaGVkIGNvbnRhY3Qgd2l0aCB0aGUgbmV3IGNvdW50LlxuICAgICAgdGhpcy5fdXBkYXRlUmVhZFJlY3Yod2hhdCwgc2VxKTtcblxuICAgICAgaWYgKHRoaXMuYWNzICE9IG51bGwgJiYgIXRoaXMuYWNzLmlzTXV0ZWQoKSkge1xuICAgICAgICBjb25zdCBtZSA9IHRoaXMuX3Rpbm9kZS5nZXRNZVRvcGljKCk7XG4gICAgICAgIC8vIFNlbnQgYSBub3RpZmljYXRpb24gdG8gJ21lJyBsaXN0ZW5lcnMuXG4gICAgICAgIG1lLl9yZWZyZXNoQ29udGFjdCh3aGF0LCB0aGlzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgLyoqXG4gICAqIFNlbmQgYSAncmVjdicgcmVjZWlwdC4gV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNub3RlUmVjdn0uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzZXEgLSBJRCBvZiB0aGUgbWVzc2FnZSB0byBha25vd2xlZGdlLlxuICAgKi9cbiAgbm90ZVJlY3Yoc2VxKSB7XG4gICAgdGhpcy5ub3RlKCdyZWN2Jywgc2VxKTtcbiAgfVxuICAvKipcbiAgICogU2VuZCBhICdyZWFkJyByZWNlaXB0LiBXcmFwcGVyIGZvciB7QGxpbmsgVGlub2RlI25vdGVSZWFkfS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IHNlcSAtIElEIG9mIHRoZSBtZXNzYWdlIHRvIGFrbm93bGVkZ2Ugb3IgMC91bmRlZmluZWQgdG8gYWNrbm93bGVkZ2UgdGhlIGxhdGVzdCBtZXNzYWdlcy5cbiAgICovXG4gIG5vdGVSZWFkKHNlcSkge1xuICAgIHNlcSA9IHNlcSB8fCB0aGlzLl9tYXhTZXE7XG4gICAgaWYgKHNlcSA+IDApIHtcbiAgICAgIHRoaXMubm90ZSgncmVhZCcsIHNlcSk7XG4gICAgfVxuICB9XG4gIC8qKlxuICAgKiBTZW5kIGEga2V5LXByZXNzIG5vdGlmaWNhdGlvbi4gV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNub3RlS2V5UHJlc3N9LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKi9cbiAgbm90ZUtleVByZXNzKCkge1xuICAgIGlmICh0aGlzLl9hdHRhY2hlZCkge1xuICAgICAgdGhpcy5fdGlub2RlLm5vdGVLZXlQcmVzcyh0aGlzLm5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl90aW5vZGUubG9nZ2VyKFwiSU5GTzogQ2Fubm90IHNlbmQgbm90aWZpY2F0aW9uIGluIGluYWN0aXZlIHRvcGljXCIpO1xuICAgIH1cbiAgfVxuICAvLyBVcGRhdGUgY2FjaGVkIHJlYWQvcmVjdi91bnJlYWQgY291bnRzLlxuICBfdXBkYXRlUmVhZFJlY3Yod2hhdCwgc2VxLCB0cykge1xuICAgIGxldCBvbGRWYWwsIGRvVXBkYXRlID0gZmFsc2U7XG5cbiAgICBzZXEgPSBzZXEgfCAwO1xuICAgIHRoaXMuc2VxID0gdGhpcy5zZXEgfCAwO1xuICAgIHRoaXMucmVhZCA9IHRoaXMucmVhZCB8IDA7XG4gICAgdGhpcy5yZWN2ID0gdGhpcy5yZWN2IHwgMDtcbiAgICBzd2l0Y2ggKHdoYXQpIHtcbiAgICAgIGNhc2UgJ3JlY3YnOlxuICAgICAgICBvbGRWYWwgPSB0aGlzLnJlY3Y7XG4gICAgICAgIHRoaXMucmVjdiA9IE1hdGgubWF4KHRoaXMucmVjdiwgc2VxKTtcbiAgICAgICAgZG9VcGRhdGUgPSAob2xkVmFsICE9IHRoaXMucmVjdik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAncmVhZCc6XG4gICAgICAgIG9sZFZhbCA9IHRoaXMucmVhZDtcbiAgICAgICAgdGhpcy5yZWFkID0gTWF0aC5tYXgodGhpcy5yZWFkLCBzZXEpO1xuICAgICAgICBkb1VwZGF0ZSA9IChvbGRWYWwgIT0gdGhpcy5yZWFkKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtc2cnOlxuICAgICAgICBvbGRWYWwgPSB0aGlzLnNlcTtcbiAgICAgICAgdGhpcy5zZXEgPSBNYXRoLm1heCh0aGlzLnNlcSwgc2VxKTtcbiAgICAgICAgaWYgKCF0aGlzLnRvdWNoZWQgfHwgdGhpcy50b3VjaGVkIDwgdHMpIHtcbiAgICAgICAgICB0aGlzLnRvdWNoZWQgPSB0cztcbiAgICAgICAgfVxuICAgICAgICBkb1VwZGF0ZSA9IChvbGRWYWwgIT0gdGhpcy5zZXEpO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICAvLyBTYW5pdHkgY2hlY2tzLlxuICAgIGlmICh0aGlzLnJlY3YgPCB0aGlzLnJlYWQpIHtcbiAgICAgIHRoaXMucmVjdiA9IHRoaXMucmVhZDtcbiAgICAgIGRvVXBkYXRlID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKHRoaXMuc2VxIDwgdGhpcy5yZWN2KSB7XG4gICAgICB0aGlzLnNlcSA9IHRoaXMucmVjdjtcbiAgICAgIGlmICghdGhpcy50b3VjaGVkIHx8IHRoaXMudG91Y2hlZCA8IHRzKSB7XG4gICAgICAgIHRoaXMudG91Y2hlZCA9IHRzO1xuICAgICAgfVxuICAgICAgZG9VcGRhdGUgPSB0cnVlO1xuICAgIH1cbiAgICB0aGlzLnVucmVhZCA9IHRoaXMuc2VxIC0gdGhpcy5yZWFkO1xuICAgIHJldHVybiBkb1VwZGF0ZTtcbiAgfVxuICAvKipcbiAgICogR2V0IHVzZXIgZGVzY3JpcHRpb24gZnJvbSBnbG9iYWwgY2FjaGUuIFRoZSB1c2VyIGRvZXMgbm90IG5lZWQgdG8gYmUgYVxuICAgKiBzdWJzY3JpYmVyIG9mIHRoaXMgdG9waWMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1aWQgLSBJRCBvZiB0aGUgdXNlciB0byBmZXRjaC5cbiAgICogQHJldHVybiB7T2JqZWN0fSB1c2VyIGRlc2NyaXB0aW9uIG9yIHVuZGVmaW5lZC5cbiAgICovXG4gIHVzZXJEZXNjKHVpZCkge1xuICAgIC8vIFRPRE86IGhhbmRsZSBhc3luY2hyb25vdXMgcmVxdWVzdHNcbiAgICBjb25zdCB1c2VyID0gdGhpcy5fY2FjaGVHZXRVc2VyKHVpZCk7XG4gICAgaWYgKHVzZXIpIHtcbiAgICAgIHJldHVybiB1c2VyOyAvLyBQcm9taXNlLnJlc29sdmUodXNlcilcbiAgICB9XG4gIH1cbiAgLyoqXG4gICAqIEdldCBkZXNjcmlwdGlvbiBvZiB0aGUgcDJwIHBlZXIgZnJvbSBzdWJzY3JpcHRpb24gY2FjaGUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEByZXR1cm4ge09iamVjdH0gcGVlcidzIGRlc2NyaXB0aW9uIG9yIHVuZGVmaW5lZC5cbiAgICovXG4gIHAycFBlZXJEZXNjKCkge1xuICAgIGlmICghdGhpcy5pc1AyUFR5cGUoKSkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3VzZXJzW3RoaXMubmFtZV07XG4gIH1cbiAgLyoqXG4gICAqIEl0ZXJhdGUgb3ZlciBjYWNoZWQgc3Vic2NyaWJlcnMuIElmIGNhbGxiYWNrIGlzIHVuZGVmaW5lZCwgdXNlIHRoaXMub25NZXRhU3ViLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayAtIENhbGxiYWNrIHdoaWNoIHdpbGwgcmVjZWl2ZSBzdWJzY3JpYmVycyBvbmUgYnkgb25lLlxuICAgKiBAcGFyYW0ge09iamVjdD19IGNvbnRleHQgLSBWYWx1ZSBvZiBgdGhpc2AgaW5zaWRlIHRoZSBgY2FsbGJhY2tgLlxuICAgKi9cbiAgc3Vic2NyaWJlcnMoY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICBjb25zdCBjYiA9IChjYWxsYmFjayB8fCB0aGlzLm9uTWV0YVN1Yik7XG4gICAgaWYgKGNiKSB7XG4gICAgICBmb3IgKGxldCBpZHggaW4gdGhpcy5fdXNlcnMpIHtcbiAgICAgICAgY2IuY2FsbChjb250ZXh0LCB0aGlzLl91c2Vyc1tpZHhdLCBpZHgsIHRoaXMuX3VzZXJzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgLyoqXG4gICAqIEdldCBhIGNvcHkgb2YgY2FjaGVkIHRhZ3MuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEByZXR1cm4ge0FycmF5LjxzdHJpbmc+fSBhIGNvcHkgb2YgdGFnc1xuICAgKi9cbiAgdGFncygpIHtcbiAgICAvLyBSZXR1cm4gYSBjb3B5LlxuICAgIHJldHVybiB0aGlzLl90YWdzLnNsaWNlKDApO1xuICB9XG4gIC8qKlxuICAgKiBHZXQgY2FjaGVkIHN1YnNjcmlwdGlvbiBmb3IgdGhlIGdpdmVuIHVzZXIgSUQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1aWQgLSBpZCBvZiB0aGUgdXNlciB0byBxdWVyeSBmb3JcbiAgICogQHJldHVybiB1c2VyIGRlc2NyaXB0aW9uIG9yIHVuZGVmaW5lZC5cbiAgICovXG4gIHN1YnNjcmliZXIodWlkKSB7XG4gICAgcmV0dXJuIHRoaXMuX3VzZXJzW3VpZF07XG4gIH1cbiAgLyoqXG4gICAqIEl0ZXJhdGUgb3ZlciBjYWNoZWQgbWVzc2FnZXM6IGNhbGwgPGNvZGU+Y2FsbGJhY2s8L2NvZGU+IGZvciBlYWNoIG1lc3NhZ2UgaW4gdGhlIHJhbmdlIFtzaW5kZUlkeCwgYmVmb3JlSWR4KS5cbiAgICogSWYgPGNvZGU+Y2FsbGJhY2s8L2NvZGU+IGlzIHVuZGVmaW5lZCwgdXNlIDxjb2RlPnRoaXMub25EYXRhPC9jb2RlPi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtUaW5vZGUuRm9yRWFjaENhbGxiYWNrVHlwZX0gY2FsbGJhY2sgLSBDYWxsYmFjayB3aGljaCB3aWxsIHJlY2VpdmUgbWVzc2FnZXMgb25lIGJ5IG9uZS4gU2VlIHtAbGluayBUaW5vZGUuQ0J1ZmZlciNmb3JFYWNofVxuICAgKiBAcGFyYW0ge251bWJlcn0gc2luY2VJZCAtIE9wdGlvbmFsIHNlcUlkIHRvIHN0YXJ0IGl0ZXJhdGluZyBmcm9tIChpbmNsdXNpdmUpLlxuICAgKiBAcGFyYW0ge251bWJlcn0gYmVmb3JlSWQgLSBPcHRpb25hbCBzZXFJZCB0byBzdG9wIGl0ZXJhdGluZyBiZWZvcmUgaXQgaXMgcmVhY2hlZCAoZXhjbHVzaXZlKS5cbiAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHQgLSBWYWx1ZSBvZiBgdGhpc2AgaW5zaWRlIHRoZSBgY2FsbGJhY2tgLlxuICAgKi9cbiAgbWVzc2FnZXMoY2FsbGJhY2ssIHNpbmNlSWQsIGJlZm9yZUlkLCBjb250ZXh0KSB7XG4gICAgY29uc3QgY2IgPSAoY2FsbGJhY2sgfHwgdGhpcy5vbkRhdGEpO1xuICAgIGlmIChjYikge1xuICAgICAgY29uc3Qgc3RhcnRJZHggPSB0eXBlb2Ygc2luY2VJZCA9PSAnbnVtYmVyJyA/IHRoaXMuX21lc3NhZ2VzLmZpbmQoe1xuICAgICAgICBzZXE6IHNpbmNlSWRcbiAgICAgIH0sIHRydWUpIDogdW5kZWZpbmVkO1xuICAgICAgY29uc3QgYmVmb3JlSWR4ID0gdHlwZW9mIGJlZm9yZUlkID09ICdudW1iZXInID8gdGhpcy5fbWVzc2FnZXMuZmluZCh7XG4gICAgICAgIHNlcTogYmVmb3JlSWRcbiAgICAgIH0sIHRydWUpIDogdW5kZWZpbmVkO1xuICAgICAgaWYgKHN0YXJ0SWR4ICE9IC0xICYmIGJlZm9yZUlkeCAhPSAtMSkge1xuICAgICAgICB0aGlzLl9tZXNzYWdlcy5mb3JFYWNoKGNiLCBzdGFydElkeCwgYmVmb3JlSWR4LCBjb250ZXh0KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgLyoqXG4gICAqIEdldCB0aGUgbWVzc2FnZSBmcm9tIGNhY2hlIGJ5IDxjb2RlPnNlcTwvY29kZT4uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzZXEgLSBtZXNzYWdlIHNlcUlkIHRvIHNlYXJjaCBmb3IuXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IHRoZSBtZXNzYWdlIHdpdGggdGhlIGdpdmVuIDxjb2RlPnNlcTwvY29kZT4gb3IgPGNvZGU+dW5kZWZpbmVkPC9jb2RlPiwgaWYgbm8gc3VjaCBtZXNzYWdlIGlzIGZvdW5kLlxuICAgKi9cbiAgZmluZE1lc3NhZ2Uoc2VxKSB7XG4gICAgY29uc3QgaWR4ID0gdGhpcy5fbWVzc2FnZXMuZmluZCh7XG4gICAgICBzZXE6IHNlcVxuICAgIH0pO1xuICAgIGlmIChpZHggPj0gMCkge1xuICAgICAgcmV0dXJuIHRoaXMuX21lc3NhZ2VzLmdldEF0KGlkeCk7XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgLyoqXG4gICAqIEdldCB0aGUgbW9zdCByZWNlbnQgbWVzc2FnZSBmcm9tIGNhY2hlLiBUaGlzIG1ldGhvZCBjb3VudHMgYWxsIG1lc3NhZ2VzLCBpbmNsdWRpbmcgZGVsZXRlZCByYW5nZXMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVufSBza2lwRGVsZXRlZCAtIGlmIHRoZSBsYXN0IG1lc3NhZ2UgaXMgYSBkZWxldGVkIHJhbmdlLCBnZXQgdGhlIG9uZSBiZWZvcmUgaXQuXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IHRoZSBtb3N0IHJlY2VudCBjYWNoZWQgbWVzc2FnZSBvciA8Y29kZT51bmRlZmluZWQ8L2NvZGU+LCBpZiBubyBtZXNzYWdlcyBhcmUgY2FjaGVkLlxuICAgKi9cbiAgbGF0ZXN0TWVzc2FnZShza2lwRGVsZXRlZCkge1xuICAgIGNvbnN0IG1zZyA9IHRoaXMuX21lc3NhZ2VzLmdldExhc3QoKTtcbiAgICBpZiAoIXNraXBEZWxldGVkIHx8ICFtc2cgfHwgbXNnLl9zdGF0dXMgIT0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfREVMX1JBTkdFKSB7XG4gICAgICByZXR1cm4gbXNnO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fbWVzc2FnZXMuZ2V0TGFzdCgxKTtcbiAgfVxuICAvKipcbiAgICogR2V0IHRoZSBtYXhpbXVtIGNhY2hlZCBzZXEgSUQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IHRoZSBncmVhdGVzdCBzZXEgSUQgaW4gY2FjaGUuXG4gICAqL1xuICBtYXhNc2dTZXEoKSB7XG4gICAgcmV0dXJuIHRoaXMuX21heFNlcTtcbiAgfVxuICAvKipcbiAgICogR2V0IHRoZSBtYXhpbXVtIGRlbGV0aW9uIElELlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSB0aGUgZ3JlYXRlc3QgZGVsZXRpb24gSUQuXG4gICAqL1xuICBtYXhDbGVhcklkKCkge1xuICAgIHJldHVybiB0aGlzLl9tYXhEZWw7XG4gIH1cbiAgLyoqXG4gICAqIEdldCB0aGUgbnVtYmVyIG9mIG1lc3NhZ2VzIGluIHRoZSBjYWNoZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHJldHVybnMge251bWJlcn0gY291bnQgb2YgY2FjaGVkIG1lc3NhZ2VzLlxuICAgKi9cbiAgbWVzc2FnZUNvdW50KCkge1xuICAgIHJldHVybiB0aGlzLl9tZXNzYWdlcy5sZW5ndGgoKTtcbiAgfVxuICAvKipcbiAgICogSXRlcmF0ZSBvdmVyIGNhY2hlZCB1bnNlbnQgbWVzc2FnZXMuIFdyYXBzIHtAbGluayBUaW5vZGUuVG9waWMjbWVzc2FnZXN9LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayAtIENhbGxiYWNrIHdoaWNoIHdpbGwgcmVjZWl2ZSBtZXNzYWdlcyBvbmUgYnkgb25lLiBTZWUge0BsaW5rIFRpbm9kZS5DQnVmZmVyI2ZvckVhY2h9XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZXh0IC0gVmFsdWUgb2YgPGNvZGU+dGhpczwvY29kZT4gaW5zaWRlIHRoZSA8Y29kZT5jYWxsYmFjazwvY29kZT4uXG4gICAqL1xuICBxdWV1ZWRNZXNzYWdlcyhjYWxsYmFjaywgY29udGV4dCkge1xuICAgIGlmICghY2FsbGJhY2spIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbGxiYWNrIG11c3QgYmUgcHJvdmlkZWRcIik7XG4gICAgfVxuICAgIHRoaXMubWVzc2FnZXMoY2FsbGJhY2ssIENvbnN0LkxPQ0FMX1NFUUlELCB1bmRlZmluZWQsIGNvbnRleHQpO1xuICB9XG4gIC8qKlxuICAgKiBHZXQgdGhlIG51bWJlciBvZiB0b3BpYyBzdWJzY3JpYmVycyB3aG8gbWFya2VkIHRoaXMgbWVzc2FnZSBhcyBlaXRoZXIgcmVjdiBvciByZWFkXG4gICAqIEN1cnJlbnQgdXNlciBpcyBleGNsdWRlZCBmcm9tIHRoZSBjb3VudC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHdoYXQgLSB3aGF0IGFjdGlvbiB0byBjb25zaWRlcjogcmVjZWl2ZWQgPGNvZGU+XCJyZWN2XCI8L2NvZGU+IG9yIHJlYWQgPGNvZGU+XCJyZWFkXCI8L2NvZGU+LlxuICAgKiBAcGFyYW0ge251bWJlcn0gc2VxIC0gSUQgb3IgdGhlIG1lc3NhZ2UgcmVhZCBvciByZWNlaXZlZC5cbiAgICpcbiAgICogQHJldHVybnMge251bWJlcn0gdGhlIG51bWJlciBvZiBzdWJzY3JpYmVycyB3aG8gbWFya2VkIHRoZSBtZXNzYWdlIHdpdGggdGhlIGdpdmVuIElEIGFzIHJlYWQgb3IgcmVjZWl2ZWQuXG4gICAqL1xuICBtc2dSZWNlaXB0Q291bnQod2hhdCwgc2VxKSB7XG4gICAgbGV0IGNvdW50ID0gMDtcbiAgICBpZiAoc2VxID4gMCkge1xuICAgICAgY29uc3QgbWUgPSB0aGlzLl90aW5vZGUuZ2V0Q3VycmVudFVzZXJJRCgpO1xuICAgICAgZm9yIChsZXQgaWR4IGluIHRoaXMuX3VzZXJzKSB7XG4gICAgICAgIGNvbnN0IHVzZXIgPSB0aGlzLl91c2Vyc1tpZHhdO1xuICAgICAgICBpZiAodXNlci51c2VyICE9PSBtZSAmJiB1c2VyW3doYXRdID49IHNlcSkge1xuICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvdW50O1xuICB9XG4gIC8qKlxuICAgKiBHZXQgdGhlIG51bWJlciBvZiB0b3BpYyBzdWJzY3JpYmVycyB3aG8gbWFya2VkIHRoaXMgbWVzc2FnZSAoYW5kIGFsbCBvbGRlciBtZXNzYWdlcykgYXMgcmVhZC5cbiAgICogVGhlIGN1cnJlbnQgdXNlciBpcyBleGNsdWRlZCBmcm9tIHRoZSBjb3VudC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IHNlcSAtIG1lc3NhZ2UgaWQgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IG51bWJlciBvZiBzdWJzY3JpYmVycyB3aG8gY2xhaW0gdG8gaGF2ZSByZWNlaXZlZCB0aGUgbWVzc2FnZS5cbiAgICovXG4gIG1zZ1JlYWRDb3VudChzZXEpIHtcbiAgICByZXR1cm4gdGhpcy5tc2dSZWNlaXB0Q291bnQoJ3JlYWQnLCBzZXEpO1xuICB9XG4gIC8qKlxuICAgKiBHZXQgdGhlIG51bWJlciBvZiB0b3BpYyBzdWJzY3JpYmVycyB3aG8gbWFya2VkIHRoaXMgbWVzc2FnZSAoYW5kIGFsbCBvbGRlciBtZXNzYWdlcykgYXMgcmVjZWl2ZWQuXG4gICAqIFRoZSBjdXJyZW50IHVzZXIgaXMgZXhjbHVkZWQgZnJvbSB0aGUgY291bnQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzZXEgLSBNZXNzYWdlIGlkIHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSBOdW1iZXIgb2Ygc3Vic2NyaWJlcnMgd2hvIGNsYWltIHRvIGhhdmUgcmVjZWl2ZWQgdGhlIG1lc3NhZ2UuXG4gICAqL1xuICBtc2dSZWN2Q291bnQoc2VxKSB7XG4gICAgcmV0dXJuIHRoaXMubXNnUmVjZWlwdENvdW50KCdyZWN2Jywgc2VxKTtcbiAgfVxuICAvKipcbiAgICogQ2hlY2sgaWYgY2FjaGVkIG1lc3NhZ2UgSURzIGluZGljYXRlIHRoYXQgdGhlIHNlcnZlciBtYXkgaGF2ZSBtb3JlIG1lc3NhZ2VzLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IG5ld2VyIC0gaWYgPGNvZGU+dHJ1ZTwvY29kZT4sIGNoZWNrIGZvciBuZXdlciBtZXNzYWdlcyBvbmx5LlxuICAgKi9cbiAgbXNnSGFzTW9yZU1lc3NhZ2VzKG5ld2VyKSB7XG4gICAgcmV0dXJuIG5ld2VyID8gdGhpcy5zZXEgPiB0aGlzLl9tYXhTZXEgOlxuICAgICAgLy8gX21pblNlcSBjb3VsZCBiZSBtb3JlIHRoYW4gMSwgYnV0IGVhcmxpZXIgbWVzc2FnZXMgY291bGQgaGF2ZSBiZWVuIGRlbGV0ZWQuXG4gICAgICAodGhpcy5fbWluU2VxID4gMSAmJiAhdGhpcy5fbm9FYXJsaWVyTXNncyk7XG4gIH1cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSBnaXZlbiBzZXEgSWQgaXMgaWQgb2YgdGhlIG1vc3QgcmVjZW50IG1lc3NhZ2UuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzZXFJZCBpZCBvZiB0aGUgbWVzc2FnZSB0byBjaGVja1xuICAgKi9cbiAgaXNOZXdNZXNzYWdlKHNlcUlkKSB7XG4gICAgcmV0dXJuIHRoaXMuX21heFNlcSA8PSBzZXFJZDtcbiAgfVxuICAvKipcbiAgICogUmVtb3ZlIG9uZSBtZXNzYWdlIGZyb20gbG9jYWwgY2FjaGUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzZXFJZCBpZCBvZiB0aGUgbWVzc2FnZSB0byByZW1vdmUgZnJvbSBjYWNoZS5cbiAgICogQHJldHVybnMge01lc3NhZ2V9IHJlbW92ZWQgbWVzc2FnZSBvciB1bmRlZmluZWQgaWYgc3VjaCBtZXNzYWdlIHdhcyBub3QgZm91bmQuXG4gICAqL1xuICBmbHVzaE1lc3NhZ2Uoc2VxSWQpIHtcbiAgICBjb25zdCBpZHggPSB0aGlzLl9tZXNzYWdlcy5maW5kKHtcbiAgICAgIHNlcTogc2VxSWRcbiAgICB9KTtcbiAgICBpZiAoaWR4ID49IDApIHtcbiAgICAgIHRoaXMuX3Rpbm9kZS5fZGIucmVtTWVzc2FnZXModGhpcy5uYW1lLCBzZXFJZCk7XG4gICAgICByZXR1cm4gdGhpcy5fbWVzc2FnZXMuZGVsQXQoaWR4KTtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuICAvKipcbiAgICogVXBkYXRlIG1lc3NhZ2UncyBzZXFJZC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHB1YiBtZXNzYWdlIG9iamVjdC5cbiAgICogQHBhcmFtIHtudW1iZXJ9IG5ld1NlcUlkIG5ldyBzZXEgaWQgZm9yIHB1Yi5cbiAgICovXG4gIHN3YXBNZXNzYWdlSWQocHViLCBuZXdTZXFJZCkge1xuICAgIGNvbnN0IGlkeCA9IHRoaXMuX21lc3NhZ2VzLmZpbmQocHViKTtcbiAgICBjb25zdCBudW1NZXNzYWdlcyA9IHRoaXMuX21lc3NhZ2VzLmxlbmd0aCgpO1xuICAgIGlmICgwIDw9IGlkeCAmJiBpZHggPCBudW1NZXNzYWdlcykge1xuICAgICAgLy8gUmVtb3ZlIG1lc3NhZ2Ugd2l0aCB0aGUgb2xkIHNlcSBJRC5cbiAgICAgIHRoaXMuX21lc3NhZ2VzLmRlbEF0KGlkeCk7XG4gICAgICB0aGlzLl90aW5vZGUuX2RiLnJlbU1lc3NhZ2VzKHRoaXMubmFtZSwgcHViLnNlcSk7XG4gICAgICAvLyBBZGQgbWVzc2FnZSB3aXRoIHRoZSBuZXcgc2VxIElELlxuICAgICAgcHViLnNlcSA9IG5ld1NlcUlkO1xuICAgICAgdGhpcy5fbWVzc2FnZXMucHV0KHB1Yik7XG4gICAgICB0aGlzLl90aW5vZGUuX2RiLmFkZE1lc3NhZ2UocHViKTtcbiAgICB9XG4gIH1cbiAgLyoqXG4gICAqIFJlbW92ZSBhIHJhbmdlIG9mIG1lc3NhZ2VzIGZyb20gdGhlIGxvY2FsIGNhY2hlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gZnJvbUlkIHNlcSBJRCBvZiB0aGUgZmlyc3QgbWVzc2FnZSB0byByZW1vdmUgKGluY2x1c2l2ZSkuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB1bnRpbElkIHNlcUlEIG9mIHRoZSBsYXN0IG1lc3NhZ2UgdG8gcmVtb3ZlIChleGNsdXNpdmUpLlxuICAgKlxuICAgKiBAcmV0dXJucyB7TWVzc2FnZVtdfSBhcnJheSBvZiByZW1vdmVkIG1lc3NhZ2VzIChjb3VsZCBiZSBlbXB0eSkuXG4gICAqL1xuICBmbHVzaE1lc3NhZ2VSYW5nZShmcm9tSWQsIHVudGlsSWQpIHtcbiAgICAvLyBSZW1vdmUgcmFuZ2UgZnJvbSBwZXJzaXN0ZW50IGNhY2hlLlxuICAgIHRoaXMuX3Rpbm9kZS5fZGIucmVtTWVzc2FnZXModGhpcy5uYW1lLCBmcm9tSWQsIHVudGlsSWQpO1xuICAgIC8vIHN0YXJ0LCBlbmQ6IGZpbmQgaW5zZXJ0aW9uIHBvaW50cyAobmVhcmVzdCA9PSB0cnVlKS5cbiAgICBjb25zdCBzaW5jZSA9IHRoaXMuX21lc3NhZ2VzLmZpbmQoe1xuICAgICAgc2VxOiBmcm9tSWRcbiAgICB9LCB0cnVlKTtcbiAgICByZXR1cm4gc2luY2UgPj0gMCA/IHRoaXMuX21lc3NhZ2VzLmRlbFJhbmdlKHNpbmNlLCB0aGlzLl9tZXNzYWdlcy5maW5kKHtcbiAgICAgIHNlcTogdW50aWxJZFxuICAgIH0sIHRydWUpKSA6IFtdO1xuICB9XG4gIC8qKlxuICAgKiBBdHRlbXB0IHRvIHN0b3AgbWVzc2FnZSBmcm9tIGJlaW5nIHNlbnQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzZXFJZCBpZCBvZiB0aGUgbWVzc2FnZSB0byBzdG9wIHNlbmRpbmcgYW5kIHJlbW92ZSBmcm9tIGNhY2hlLlxuICAgKlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgbWVzc2FnZSB3YXMgY2FuY2VsbGVkLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgY2FuY2VsU2VuZChzZXFJZCkge1xuICAgIGNvbnN0IGlkeCA9IHRoaXMuX21lc3NhZ2VzLmZpbmQoe1xuICAgICAgc2VxOiBzZXFJZFxuICAgIH0pO1xuICAgIGlmIChpZHggPj0gMCkge1xuICAgICAgY29uc3QgbXNnID0gdGhpcy5fbWVzc2FnZXMuZ2V0QXQoaWR4KTtcbiAgICAgIGNvbnN0IHN0YXR1cyA9IHRoaXMubXNnU3RhdHVzKG1zZyk7XG4gICAgICBpZiAoc3RhdHVzID09IENvbnN0Lk1FU1NBR0VfU1RBVFVTX1FVRVVFRCB8fCBzdGF0dXMgPT0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfRkFJTEVEKSB7XG4gICAgICAgIHRoaXMuX3Rpbm9kZS5fZGIucmVtTWVzc2FnZXModGhpcy5uYW1lLCBzZXFJZCk7XG4gICAgICAgIG1zZy5fY2FuY2VsbGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fbWVzc2FnZXMuZGVsQXQoaWR4KTtcbiAgICAgICAgaWYgKHRoaXMub25EYXRhKSB7XG4gICAgICAgICAgLy8gQ2FsbGluZyB3aXRoIG5vIHBhcmFtZXRlcnMgdG8gaW5kaWNhdGUgdGhlIG1lc3NhZ2Ugd2FzIGRlbGV0ZWQuXG4gICAgICAgICAgdGhpcy5vbkRhdGEoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIC8qKlxuICAgKiBHZXQgdHlwZSBvZiB0aGUgdG9waWM6IG1lLCBwMnAsIGdycCwgZm5kLi4uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IE9uZSBvZiAnbWUnLCAncDJwJywgJ2dycCcsICdmbmQnLCAnc3lzJyBvciA8Y29kZT51bmRlZmluZWQ8L2NvZGU+LlxuICAgKi9cbiAgZ2V0VHlwZSgpIHtcbiAgICByZXR1cm4gVG9waWMudG9waWNUeXBlKHRoaXMubmFtZSk7XG4gIH1cbiAgLyoqXG4gICAqIEdldCBjdXJyZW50IHVzZXIncyBhY2Nlc3MgbW9kZSBvZiB0aGUgdG9waWMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuQWNjZXNzTW9kZX0gLSB1c2VyJ3MgYWNjZXNzIG1vZGVcbiAgICovXG4gIGdldEFjY2Vzc01vZGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuYWNzO1xuICB9XG4gIC8qKlxuICAgKiBTZXQgY3VycmVudCB1c2VyJ3MgYWNjZXNzIG1vZGUgb2YgdGhlIHRvcGljLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge0FjY2Vzc01vZGUgfCBPYmplY3R9IGFjcyAtIGFjY2VzcyBtb2RlIHRvIHNldC5cbiAgICovXG4gIHNldEFjY2Vzc01vZGUoYWNzKSB7XG4gICAgcmV0dXJuIHRoaXMuYWNzID0gbmV3IEFjY2Vzc01vZGUoYWNzKTtcbiAgfVxuICAvKipcbiAgICogR2V0IHRvcGljJ3MgZGVmYXVsdCBhY2Nlc3MgbW9kZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5EZWZBY3N9IC0gYWNjZXNzIG1vZGUsIHN1Y2ggYXMge2F1dGg6IGBSV1BgLCBhbm9uOiBgTmB9LlxuICAgKi9cbiAgZ2V0RGVmYXVsdEFjY2VzcygpIHtcbiAgICByZXR1cm4gdGhpcy5kZWZhY3M7XG4gIH1cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgbmV3IG1ldGEge0BsaW5rIFRpbm9kZS5HZXRRdWVyeX0gYnVpbGRlci4gVGhlIHF1ZXJ5IGlzIGF0dGNoZWQgdG8gdGhlIGN1cnJlbnQgdG9waWMuXG4gICAqIEl0IHdpbGwgbm90IHdvcmsgY29ycmVjdGx5IGlmIHVzZWQgd2l0aCBhIGRpZmZlcmVudCB0b3BpYy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5NZXRhR2V0QnVpbGRlcn0gcXVlcnkgYXR0YWNoZWQgdG8gdGhlIGN1cnJlbnQgdG9waWMuXG4gICAqL1xuICBzdGFydE1ldGFRdWVyeSgpIHtcbiAgICByZXR1cm4gbmV3IE1ldGFHZXRCdWlsZGVyKHRoaXMpO1xuICB9XG4gIC8qKlxuICAgKiBDaGVjayBpZiB0b3BpYyBpcyBhcmNoaXZlZCwgaS5lLiBwcml2YXRlLmFyY2ggPT0gdHJ1ZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHJldHVybnMge2Jvb2xlYW59IC0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgdG9waWMgaXMgYXJjaGl2ZWQsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBpc0FyY2hpdmVkKCkge1xuICAgIHJldHVybiB0aGlzLnByaXZhdGUgJiYgISF0aGlzLnByaXZhdGUuYXJjaDtcbiAgfVxuICAvKipcbiAgICogQ2hlY2sgaWYgdG9waWMgaXMgYSAnbWUnIHRvcGljLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0b3BpYyBpcyBhICdtZScgdG9waWMsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBpc01lVHlwZSgpIHtcbiAgICByZXR1cm4gVG9waWMuaXNNZVRvcGljTmFtZSh0aGlzLm5hbWUpO1xuICB9XG4gIC8qKlxuICAgKiBDaGVjayBpZiB0b3BpYyBpcyBhIGNoYW5uZWwuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIDxjb2RlPnRydWU8L2NvZGU+IGlmIHRvcGljIGlzIGEgY2hhbm5lbCwgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIGlzQ2hhbm5lbFR5cGUoKSB7XG4gICAgcmV0dXJuIFRvcGljLmlzQ2hhbm5lbFRvcGljTmFtZSh0aGlzLm5hbWUpO1xuICB9XG4gIC8qKlxuICAgKiBDaGVjayBpZiB0b3BpYyBpcyBhIGdyb3VwIHRvcGljLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0b3BpYyBpcyBhIGdyb3VwLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgaXNHcm91cFR5cGUoKSB7XG4gICAgcmV0dXJuIFRvcGljLmlzR3JvdXBUb3BpY05hbWUodGhpcy5uYW1lKTtcbiAgfVxuICAvKipcbiAgICogQ2hlY2sgaWYgdG9waWMgaXMgYSBwMnAgdG9waWMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIDxjb2RlPnRydWU8L2NvZGU+IGlmIHRvcGljIGlzIGEgcDJwIHRvcGljLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgaXNQMlBUeXBlKCkge1xuICAgIHJldHVybiBUb3BpYy5pc1AyUFRvcGljTmFtZSh0aGlzLm5hbWUpO1xuICB9XG4gIC8qKlxuICAgKiBDaGVjayBpZiB0b3BpYyBpcyBhIGNvbW11bmljYXRpb24gdG9waWMsIGkuZS4gYSBncm91cCBvciBwMnAgdG9waWMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIDxjb2RlPnRydWU8L2NvZGU+IGlmIHRvcGljIGlzIGEgcDJwIG9yIGdyb3VwIHRvcGljLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgaXNDb21tVHlwZSgpIHtcbiAgICByZXR1cm4gVG9waWMuaXNDb21tVG9waWNOYW1lKHRoaXMubmFtZSk7XG4gIH1cbiAgLyoqXG4gICAqIEdldCBzdGF0dXMgKHF1ZXVlZCwgc2VudCwgcmVjZWl2ZWQgZXRjKSBvZiBhIGdpdmVuIG1lc3NhZ2UgaW4gdGhlIGNvbnRleHRcbiAgICogb2YgdGhpcyB0b3BpYy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtNZXNzYWdlfSBtc2cgLSBtZXNzYWdlIHRvIGNoZWNrIGZvciBzdGF0dXMuXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gdXBkIC0gdXBkYXRlIGNoYWNoZWQgbWVzc2FnZSBzdGF0dXMuXG4gICAqXG4gICAqIEByZXR1cm5zIG1lc3NhZ2Ugc3RhdHVzIGNvbnN0YW50LlxuICAgKi9cbiAgbXNnU3RhdHVzKG1zZywgdXBkKSB7XG4gICAgbGV0IHN0YXR1cyA9IENvbnN0Lk1FU1NBR0VfU1RBVFVTX05PTkU7XG4gICAgaWYgKHRoaXMuX3Rpbm9kZS5pc01lKG1zZy5mcm9tKSkge1xuICAgICAgaWYgKG1zZy5fc2VuZGluZykge1xuICAgICAgICBzdGF0dXMgPSBDb25zdC5NRVNTQUdFX1NUQVRVU19TRU5ESU5HO1xuICAgICAgfSBlbHNlIGlmIChtc2cuX2ZhaWxlZCB8fCBtc2cuX2NhbmNlbGxlZCkge1xuICAgICAgICBzdGF0dXMgPSBDb25zdC5NRVNTQUdFX1NUQVRVU19GQUlMRUQ7XG4gICAgICB9IGVsc2UgaWYgKG1zZy5zZXEgPj0gQ29uc3QuTE9DQUxfU0VRSUQpIHtcbiAgICAgICAgc3RhdHVzID0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfUVVFVUVEO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLm1zZ1JlYWRDb3VudChtc2cuc2VxKSA+IDApIHtcbiAgICAgICAgc3RhdHVzID0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfUkVBRDtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5tc2dSZWN2Q291bnQobXNnLnNlcSkgPiAwKSB7XG4gICAgICAgIHN0YXR1cyA9IENvbnN0Lk1FU1NBR0VfU1RBVFVTX1JFQ0VJVkVEO1xuICAgICAgfSBlbHNlIGlmIChtc2cuc2VxID4gMCkge1xuICAgICAgICBzdGF0dXMgPSBDb25zdC5NRVNTQUdFX1NUQVRVU19TRU5UO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAobXNnLl9zdGF0dXMgPT0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfREVMX1JBTkdFKSB7XG4gICAgICBzdGF0dXMgPT0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfREVMX1JBTkdFO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdGF0dXMgPSBDb25zdC5NRVNTQUdFX1NUQVRVU19UT19NRTtcbiAgICB9XG5cbiAgICBpZiAodXBkICYmIG1zZy5fc3RhdHVzICE9IHN0YXR1cykge1xuICAgICAgbXNnLl9zdGF0dXMgPSBzdGF0dXM7XG4gICAgICB0aGlzLl90aW5vZGUuX2RiLnVwZE1lc3NhZ2VTdGF0dXModGhpcy5uYW1lLCBtc2cuc2VxLCBzdGF0dXMpO1xuICAgIH1cblxuICAgIHJldHVybiBzdGF0dXM7XG4gIH1cbiAgLy8gUHJvY2VzcyBkYXRhIG1lc3NhZ2VcbiAgX3JvdXRlRGF0YShkYXRhKSB7XG4gICAgaWYgKGRhdGEuY29udGVudCkge1xuICAgICAgaWYgKCF0aGlzLnRvdWNoZWQgfHwgdGhpcy50b3VjaGVkIDwgZGF0YS50cykge1xuICAgICAgICB0aGlzLnRvdWNoZWQgPSBkYXRhLnRzO1xuICAgICAgICB0aGlzLl90aW5vZGUuX2RiLnVwZFRvcGljKHRoaXMpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChkYXRhLnNlcSA+IHRoaXMuX21heFNlcSkge1xuICAgICAgdGhpcy5fbWF4U2VxID0gZGF0YS5zZXE7XG4gICAgfVxuICAgIGlmIChkYXRhLnNlcSA8IHRoaXMuX21pblNlcSB8fCB0aGlzLl9taW5TZXEgPT0gMCkge1xuICAgICAgdGhpcy5fbWluU2VxID0gZGF0YS5zZXE7XG4gICAgfVxuXG4gICAgaWYgKCFkYXRhLl9ub0ZvcndhcmRpbmcpIHtcbiAgICAgIHRoaXMuX21lc3NhZ2VzLnB1dChkYXRhKTtcbiAgICAgIHRoaXMuX3Rpbm9kZS5fZGIuYWRkTWVzc2FnZShkYXRhKTtcbiAgICAgIHRoaXMuX3VwZGF0ZURlbGV0ZWRSYW5nZXMoKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vbkRhdGEpIHtcbiAgICAgIHRoaXMub25EYXRhKGRhdGEpO1xuICAgIH1cblxuICAgIC8vIFVwZGF0ZSBsb2NhbGx5IGNhY2hlZCBjb250YWN0IHdpdGggdGhlIG5ldyBtZXNzYWdlIGNvdW50LlxuICAgIGNvbnN0IHdoYXQgPSAoKCF0aGlzLmlzQ2hhbm5lbFR5cGUoKSAmJiAhZGF0YS5mcm9tKSB8fCB0aGlzLl90aW5vZGUuaXNNZShkYXRhLmZyb20pKSA/ICdyZWFkJyA6ICdtc2cnO1xuICAgIHRoaXMuX3VwZGF0ZVJlYWRSZWN2KHdoYXQsIGRhdGEuc2VxLCBkYXRhLnRzKTtcbiAgICAvLyBOb3RpZnkgJ21lJyBsaXN0ZW5lcnMgb2YgdGhlIGNoYW5nZS5cbiAgICB0aGlzLl90aW5vZGUuZ2V0TWVUb3BpYygpLl9yZWZyZXNoQ29udGFjdCh3aGF0LCB0aGlzKTtcbiAgfVxuICAvLyBQcm9jZXNzIG1ldGFkYXRhIG1lc3NhZ2VcbiAgX3JvdXRlTWV0YShtZXRhKSB7XG4gICAgaWYgKG1ldGEuZGVzYykge1xuICAgICAgdGhpcy5fcHJvY2Vzc01ldGFEZXNjKG1ldGEuZGVzYyk7XG4gICAgfVxuICAgIGlmIChtZXRhLnN1YiAmJiBtZXRhLnN1Yi5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLl9wcm9jZXNzTWV0YVN1YihtZXRhLnN1Yik7XG4gICAgfVxuICAgIGlmIChtZXRhLmRlbCkge1xuICAgICAgdGhpcy5fcHJvY2Vzc0RlbE1lc3NhZ2VzKG1ldGEuZGVsLmNsZWFyLCBtZXRhLmRlbC5kZWxzZXEpO1xuICAgIH1cbiAgICBpZiAobWV0YS50YWdzKSB7XG4gICAgICB0aGlzLl9wcm9jZXNzTWV0YVRhZ3MobWV0YS50YWdzKTtcbiAgICB9XG4gICAgaWYgKG1ldGEuY3JlZCkge1xuICAgICAgdGhpcy5fcHJvY2Vzc01ldGFDcmVkcyhtZXRhLmNyZWQpO1xuICAgIH1cbiAgICBpZiAodGhpcy5vbk1ldGEpIHtcbiAgICAgIHRoaXMub25NZXRhKG1ldGEpO1xuICAgIH1cbiAgfVxuICAvLyBQcm9jZXNzIHByZXNlbmNlIGNoYW5nZSBtZXNzYWdlXG4gIF9yb3V0ZVByZXMocHJlcykge1xuICAgIGxldCB1c2VyLCB1aWQ7XG4gICAgc3dpdGNoIChwcmVzLndoYXQpIHtcbiAgICAgIGNhc2UgJ2RlbCc6XG4gICAgICAgIC8vIERlbGV0ZSBjYWNoZWQgbWVzc2FnZXMuXG4gICAgICAgIHRoaXMuX3Byb2Nlc3NEZWxNZXNzYWdlcyhwcmVzLmNsZWFyLCBwcmVzLmRlbHNlcSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnb24nOlxuICAgICAgY2FzZSAnb2ZmJzpcbiAgICAgICAgLy8gVXBkYXRlIG9ubGluZSBzdGF0dXMgb2YgYSBzdWJzY3JpcHRpb24uXG4gICAgICAgIHVzZXIgPSB0aGlzLl91c2Vyc1twcmVzLnNyY107XG4gICAgICAgIGlmICh1c2VyKSB7XG4gICAgICAgICAgdXNlci5vbmxpbmUgPSBwcmVzLndoYXQgPT0gJ29uJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl90aW5vZGUubG9nZ2VyKFwiV0FSTklORzogUHJlc2VuY2UgdXBkYXRlIGZvciBhbiB1bmtub3duIHVzZXJcIiwgdGhpcy5uYW1lLCBwcmVzLnNyYyk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd0ZXJtJzpcbiAgICAgICAgLy8gQXR0YWNobWVudCB0byB0b3BpYyBpcyB0ZXJtaW5hdGVkIHByb2JhYmx5IGR1ZSB0byBjbHVzdGVyIHJlaGFzaGluZy5cbiAgICAgICAgdGhpcy5fcmVzZXRTdWIoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd1cGQnOlxuICAgICAgICAvLyBBIHRvcGljIHN1YnNjcmliZXIgaGFzIHVwZGF0ZWQgaGlzIGRlc2NyaXB0aW9uLlxuICAgICAgICAvLyBJc3N1ZSB7Z2V0IHN1Yn0gb25seSBpZiB0aGUgY3VycmVudCB1c2VyIGhhcyBubyBwMnAgdG9waWNzIHdpdGggdGhlIHVwZGF0ZWQgdXNlciAocDJwIG5hbWUgaXMgbm90IGluIGNhY2hlKS5cbiAgICAgICAgLy8gT3RoZXJ3aXNlICdtZScgd2lsbCBpc3N1ZSBhIHtnZXQgZGVzY30gcmVxdWVzdC5cbiAgICAgICAgaWYgKHByZXMuc3JjICYmICF0aGlzLl90aW5vZGUuaXNUb3BpY0NhY2hlZChwcmVzLnNyYykpIHtcbiAgICAgICAgICB0aGlzLmdldE1ldGEodGhpcy5zdGFydE1ldGFRdWVyeSgpLndpdGhMYXRlck9uZVN1YihwcmVzLnNyYykuYnVpbGQoKSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdhY3MnOlxuICAgICAgICB1aWQgPSBwcmVzLnNyYyB8fCB0aGlzLl90aW5vZGUuZ2V0Q3VycmVudFVzZXJJRCgpO1xuICAgICAgICB1c2VyID0gdGhpcy5fdXNlcnNbdWlkXTtcbiAgICAgICAgaWYgKCF1c2VyKSB7XG4gICAgICAgICAgLy8gVXBkYXRlIGZvciBhbiB1bmtub3duIHVzZXI6IG5vdGlmaWNhdGlvbiBvZiBhIG5ldyBzdWJzY3JpcHRpb24uXG4gICAgICAgICAgY29uc3QgYWNzID0gbmV3IEFjY2Vzc01vZGUoKS51cGRhdGVBbGwocHJlcy5kYWNzKTtcbiAgICAgICAgICBpZiAoYWNzICYmIGFjcy5tb2RlICE9IEFjY2Vzc01vZGUuX05PTkUpIHtcbiAgICAgICAgICAgIHVzZXIgPSB0aGlzLl9jYWNoZUdldFVzZXIodWlkKTtcbiAgICAgICAgICAgIGlmICghdXNlcikge1xuICAgICAgICAgICAgICB1c2VyID0ge1xuICAgICAgICAgICAgICAgIHVzZXI6IHVpZCxcbiAgICAgICAgICAgICAgICBhY3M6IGFjc1xuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICB0aGlzLmdldE1ldGEodGhpcy5zdGFydE1ldGFRdWVyeSgpLndpdGhPbmVTdWIodW5kZWZpbmVkLCB1aWQpLmJ1aWxkKCkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdXNlci5hY3MgPSBhY3M7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB1c2VyLnVwZGF0ZWQgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5fcHJvY2Vzc01ldGFTdWIoW3VzZXJdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gS25vd24gdXNlclxuICAgICAgICAgIHVzZXIuYWNzLnVwZGF0ZUFsbChwcmVzLmRhY3MpO1xuICAgICAgICAgIC8vIFVwZGF0ZSB1c2VyJ3MgYWNjZXNzIG1vZGUuXG4gICAgICAgICAgdGhpcy5fcHJvY2Vzc01ldGFTdWIoW3tcbiAgICAgICAgICAgIHVzZXI6IHVpZCxcbiAgICAgICAgICAgIHVwZGF0ZWQ6IG5ldyBEYXRlKCksXG4gICAgICAgICAgICBhY3M6IHVzZXIuYWNzXG4gICAgICAgICAgfV0pO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhpcy5fdGlub2RlLmxvZ2dlcihcIklORk86IElnbm9yZWQgcHJlc2VuY2UgdXBkYXRlXCIsIHByZXMud2hhdCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMub25QcmVzKSB7XG4gICAgICB0aGlzLm9uUHJlcyhwcmVzKTtcbiAgICB9XG4gIH1cbiAgLy8gUHJvY2VzcyB7aW5mb30gbWVzc2FnZVxuICBfcm91dGVJbmZvKGluZm8pIHtcbiAgICBpZiAoaW5mby53aGF0ICE9PSAna3AnKSB7XG4gICAgICBjb25zdCB1c2VyID0gdGhpcy5fdXNlcnNbaW5mby5mcm9tXTtcbiAgICAgIGlmICh1c2VyKSB7XG4gICAgICAgIHVzZXJbaW5mby53aGF0XSA9IGluZm8uc2VxO1xuICAgICAgICBpZiAodXNlci5yZWN2IDwgdXNlci5yZWFkKSB7XG4gICAgICAgICAgdXNlci5yZWN2ID0gdXNlci5yZWFkO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjb25zdCBtc2cgPSB0aGlzLmxhdGVzdE1lc3NhZ2UoKTtcbiAgICAgIGlmIChtc2cpIHtcbiAgICAgICAgdGhpcy5tc2dTdGF0dXMobXNnLCB0cnVlKTtcbiAgICAgIH1cblxuICAgICAgLy8gSWYgdGhpcyBpcyBhbiB1cGRhdGUgZnJvbSB0aGUgY3VycmVudCB1c2VyLCB1cGRhdGUgdGhlIGNhY2hlIHdpdGggdGhlIG5ldyBjb3VudC5cbiAgICAgIGlmICh0aGlzLl90aW5vZGUuaXNNZShpbmZvLmZyb20pKSB7XG4gICAgICAgIHRoaXMuX3VwZGF0ZVJlYWRSZWN2KGluZm8ud2hhdCwgaW5mby5zZXEpO1xuICAgICAgfVxuXG4gICAgICAvLyBOb3RpZnkgJ21lJyBsaXN0ZW5lciBvZiB0aGUgc3RhdHVzIGNoYW5nZS5cbiAgICAgIHRoaXMuX3Rpbm9kZS5nZXRNZVRvcGljKCkuX3JlZnJlc2hDb250YWN0KGluZm8ud2hhdCwgdGhpcyk7XG4gICAgfVxuICAgIGlmICh0aGlzLm9uSW5mbykge1xuICAgICAgdGhpcy5vbkluZm8oaW5mbyk7XG4gICAgfVxuICB9XG4gIC8vIENhbGxlZCBieSBUaW5vZGUgd2hlbiBtZXRhLmRlc2MgcGFja2V0IGlzIHJlY2VpdmVkLlxuICAvLyBDYWxsZWQgYnkgJ21lJyB0b3BpYyBvbiBjb250YWN0IHVwZGF0ZSAoZGVzYy5fbm9Gb3J3YXJkaW5nIGlzIHRydWUpLlxuICBfcHJvY2Vzc01ldGFEZXNjKGRlc2MpIHtcbiAgICBpZiAodGhpcy5pc1AyUFR5cGUoKSkge1xuICAgICAgLy8gU3ludGhldGljIGRlc2MgbWF5IGluY2x1ZGUgZGVmYWNzIGZvciBwMnAgdG9waWNzIHdoaWNoIGlzIHVzZWxlc3MuXG4gICAgICAvLyBSZW1vdmUgaXQuXG4gICAgICBkZWxldGUgZGVzYy5kZWZhY3M7XG5cbiAgICAgIC8vIFVwZGF0ZSB0byBwMnAgZGVzYyBpcyB0aGUgc2FtZSBhcyB1c2VyIHVwZGF0ZS4gVXBkYXRlIGNhY2hlZCB1c2VyLlxuICAgICAgdGhpcy5fdGlub2RlLl9kYi51cGRVc2VyKHRoaXMubmFtZSwgZGVzYy5wdWJsaWMpO1xuICAgIH1cblxuICAgIC8vIENvcHkgcGFyYW1ldGVycyBmcm9tIGRlc2Mgb2JqZWN0IHRvIHRoaXMgdG9waWMuXG4gICAgbWVyZ2VPYmoodGhpcywgZGVzYyk7XG4gICAgLy8gVXBkYXRlIHBlcnNpc3RlbnQgY2FjaGUuXG4gICAgdGhpcy5fdGlub2RlLl9kYi51cGRUb3BpYyh0aGlzKTtcblxuICAgIC8vIE5vdGlmeSAnbWUnIGxpc3RlbmVyLCBpZiBhdmFpbGFibGU6XG4gICAgaWYgKHRoaXMubmFtZSAhPT0gQ29uc3QuVE9QSUNfTUUgJiYgIWRlc2MuX25vRm9yd2FyZGluZykge1xuICAgICAgY29uc3QgbWUgPSB0aGlzLl90aW5vZGUuZ2V0TWVUb3BpYygpO1xuICAgICAgaWYgKG1lLm9uTWV0YVN1Yikge1xuICAgICAgICBtZS5vbk1ldGFTdWIodGhpcyk7XG4gICAgICB9XG4gICAgICBpZiAobWUub25TdWJzVXBkYXRlZCkge1xuICAgICAgICBtZS5vblN1YnNVcGRhdGVkKFt0aGlzLm5hbWVdLCAxKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5vbk1ldGFEZXNjKSB7XG4gICAgICB0aGlzLm9uTWV0YURlc2ModGhpcyk7XG4gICAgfVxuICB9XG4gIC8vIENhbGxlZCBieSBUaW5vZGUgd2hlbiBtZXRhLnN1YiBpcyByZWNpdmVkIG9yIGluIHJlc3BvbnNlIHRvIHJlY2VpdmVkXG4gIC8vIHtjdHJsfSBhZnRlciBzZXRNZXRhLXN1Yi5cbiAgX3Byb2Nlc3NNZXRhU3ViKHN1YnMpIHtcbiAgICBmb3IgKGxldCBpZHggaW4gc3Vicykge1xuICAgICAgY29uc3Qgc3ViID0gc3Vic1tpZHhdO1xuXG4gICAgICAvLyBGaWxsIGRlZmF1bHRzLlxuICAgICAgc3ViLm9ubGluZSA9ICEhc3ViLm9ubGluZTtcbiAgICAgIC8vIFVwZGF0ZSB0aW1lc3RhbXAgb2YgdGhlIG1vc3QgcmVjZW50IHN1YnNjcmlwdGlvbiB1cGRhdGUuXG4gICAgICB0aGlzLl9sYXN0U3Vic1VwZGF0ZSA9IG5ldyBEYXRlKE1hdGgubWF4KHRoaXMuX2xhc3RTdWJzVXBkYXRlLCBzdWIudXBkYXRlZCkpO1xuXG4gICAgICBsZXQgdXNlciA9IG51bGw7XG4gICAgICBpZiAoIXN1Yi5kZWxldGVkKSB7XG4gICAgICAgIC8vIElmIHRoaXMgaXMgYSBjaGFuZ2UgdG8gdXNlcidzIG93biBwZXJtaXNzaW9ucywgdXBkYXRlIHRoZW0gaW4gdG9waWMgdG9vLlxuICAgICAgICAvLyBEZXNjIHdpbGwgdXBkYXRlICdtZScgdG9waWMuXG4gICAgICAgIGlmICh0aGlzLl90aW5vZGUuaXNNZShzdWIudXNlcikgJiYgc3ViLmFjcykge1xuICAgICAgICAgIHRoaXMuX3Byb2Nlc3NNZXRhRGVzYyh7XG4gICAgICAgICAgICB1cGRhdGVkOiBzdWIudXBkYXRlZCxcbiAgICAgICAgICAgIHRvdWNoZWQ6IHN1Yi50b3VjaGVkLFxuICAgICAgICAgICAgYWNzOiBzdWIuYWNzXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdXNlciA9IHRoaXMuX3VwZGF0ZUNhY2hlZFVzZXIoc3ViLnVzZXIsIHN1Yik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBTdWJzY3JpcHRpb24gaXMgZGVsZXRlZCwgcmVtb3ZlIGl0IGZyb20gdG9waWMgKGJ1dCBsZWF2ZSBpbiBVc2VycyBjYWNoZSlcbiAgICAgICAgZGVsZXRlIHRoaXMuX3VzZXJzW3N1Yi51c2VyXTtcbiAgICAgICAgdXNlciA9IHN1YjtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMub25NZXRhU3ViKSB7XG4gICAgICAgIHRoaXMub25NZXRhU3ViKHVzZXIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLm9uU3Vic1VwZGF0ZWQpIHtcbiAgICAgIHRoaXMub25TdWJzVXBkYXRlZChPYmplY3Qua2V5cyh0aGlzLl91c2VycykpO1xuICAgIH1cbiAgfVxuICAvLyBDYWxsZWQgYnkgVGlub2RlIHdoZW4gbWV0YS50YWdzIGlzIHJlY2l2ZWQuXG4gIF9wcm9jZXNzTWV0YVRhZ3ModGFncykge1xuICAgIGlmICh0YWdzLmxlbmd0aCA9PSAxICYmIHRhZ3NbMF0gPT0gQ29uc3QuREVMX0NIQVIpIHtcbiAgICAgIHRhZ3MgPSBbXTtcbiAgICB9XG4gICAgdGhpcy5fdGFncyA9IHRhZ3M7XG4gICAgaWYgKHRoaXMub25UYWdzVXBkYXRlZCkge1xuICAgICAgdGhpcy5vblRhZ3NVcGRhdGVkKHRhZ3MpO1xuICAgIH1cbiAgfVxuICAvLyBEbyBub3RoaW5nIGZvciB0b3BpY3Mgb3RoZXIgdGhhbiAnbWUnXG4gIF9wcm9jZXNzTWV0YUNyZWRzKGNyZWRzKSB7fVxuICAvLyBEZWxldGUgY2FjaGVkIG1lc3NhZ2VzIGFuZCB1cGRhdGUgY2FjaGVkIHRyYW5zYWN0aW9uIElEc1xuICBfcHJvY2Vzc0RlbE1lc3NhZ2VzKGNsZWFyLCBkZWxzZXEpIHtcbiAgICB0aGlzLl9tYXhEZWwgPSBNYXRoLm1heChjbGVhciwgdGhpcy5fbWF4RGVsKTtcbiAgICB0aGlzLmNsZWFyID0gTWF0aC5tYXgoY2xlYXIsIHRoaXMuY2xlYXIpO1xuICAgIGNvbnN0IHRvcGljID0gdGhpcztcbiAgICBsZXQgY291bnQgPSAwO1xuICAgIGlmIChBcnJheS5pc0FycmF5KGRlbHNlcSkpIHtcbiAgICAgIGRlbHNlcS5mb3JFYWNoKGZ1bmN0aW9uKHJhbmdlKSB7XG4gICAgICAgIGlmICghcmFuZ2UuaGkpIHtcbiAgICAgICAgICBjb3VudCsrO1xuICAgICAgICAgIHRvcGljLmZsdXNoTWVzc2FnZShyYW5nZS5sb3cpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZvciAobGV0IGkgPSByYW5nZS5sb3c7IGkgPCByYW5nZS5oaTsgaSsrKSB7XG4gICAgICAgICAgICBjb3VudCsrO1xuICAgICAgICAgICAgdG9waWMuZmx1c2hNZXNzYWdlKGkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKGNvdW50ID4gMCkge1xuICAgICAgdGhpcy5fdXBkYXRlRGVsZXRlZFJhbmdlcygpO1xuXG4gICAgICBpZiAodGhpcy5vbkRhdGEpIHtcbiAgICAgICAgdGhpcy5vbkRhdGEoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgLy8gVG9waWMgaXMgaW5mb3JtZWQgdGhhdCB0aGUgZW50aXJlIHJlc3BvbnNlIHRvIHtnZXQgd2hhdD1kYXRhfSBoYXMgYmVlbiByZWNlaXZlZC5cbiAgX2FsbE1lc3NhZ2VzUmVjZWl2ZWQoY291bnQpIHtcbiAgICB0aGlzLl91cGRhdGVEZWxldGVkUmFuZ2VzKCk7XG5cbiAgICBpZiAodGhpcy5vbkFsbE1lc3NhZ2VzUmVjZWl2ZWQpIHtcbiAgICAgIHRoaXMub25BbGxNZXNzYWdlc1JlY2VpdmVkKGNvdW50KTtcbiAgICB9XG4gIH1cbiAgLy8gUmVzZXQgc3Vic2NyaWJlZCBzdGF0ZVxuICBfcmVzZXRTdWIoKSB7XG4gICAgdGhpcy5fYXR0YWNoZWQgPSBmYWxzZTtcbiAgfVxuICAvLyBUaGlzIHRvcGljIGlzIGVpdGhlciBkZWxldGVkIG9yIHVuc3Vic2NyaWJlZCBmcm9tLlxuICBfZ29uZSgpIHtcbiAgICB0aGlzLl9tZXNzYWdlcy5yZXNldCgpO1xuICAgIHRoaXMuX3Rpbm9kZS5fZGIucmVtTWVzc2FnZXModGhpcy5uYW1lKTtcbiAgICB0aGlzLl91c2VycyA9IHt9O1xuICAgIHRoaXMuYWNzID0gbmV3IEFjY2Vzc01vZGUobnVsbCk7XG4gICAgdGhpcy5wcml2YXRlID0gbnVsbDtcbiAgICB0aGlzLnB1YmxpYyA9IG51bGw7XG4gICAgdGhpcy50cnVzdGVkID0gbnVsbDtcbiAgICB0aGlzLl9tYXhTZXEgPSAwO1xuICAgIHRoaXMuX21pblNlcSA9IDA7XG4gICAgdGhpcy5fYXR0YWNoZWQgPSBmYWxzZTtcblxuICAgIGNvbnN0IG1lID0gdGhpcy5fdGlub2RlLmdldE1lVG9waWMoKTtcbiAgICBpZiAobWUpIHtcbiAgICAgIG1lLl9yb3V0ZVByZXMoe1xuICAgICAgICBfbm9Gb3J3YXJkaW5nOiB0cnVlLFxuICAgICAgICB3aGF0OiAnZ29uZScsXG4gICAgICAgIHRvcGljOiBDb25zdC5UT1BJQ19NRSxcbiAgICAgICAgc3JjOiB0aGlzLm5hbWVcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAodGhpcy5vbkRlbGV0ZVRvcGljKSB7XG4gICAgICB0aGlzLm9uRGVsZXRlVG9waWMoKTtcbiAgICB9XG4gIH1cbiAgLy8gVXBkYXRlIGdsb2JhbCB1c2VyIGNhY2hlIGFuZCBsb2NhbCBzdWJzY3JpYmVycyBjYWNoZS5cbiAgLy8gRG9uJ3QgY2FsbCB0aGlzIG1ldGhvZCBmb3Igbm9uLXN1YnNjcmliZXJzLlxuICBfdXBkYXRlQ2FjaGVkVXNlcih1aWQsIG9iaikge1xuICAgIC8vIEZldGNoIHVzZXIgb2JqZWN0IGZyb20gdGhlIGdsb2JhbCBjYWNoZS5cbiAgICAvLyBUaGlzIGlzIGEgY2xvbmUgb2YgdGhlIHN0b3JlZCBvYmplY3RcbiAgICBsZXQgY2FjaGVkID0gdGhpcy5fY2FjaGVHZXRVc2VyKHVpZCk7XG4gICAgY2FjaGVkID0gbWVyZ2VPYmooY2FjaGVkIHx8IHt9LCBvYmopO1xuICAgIC8vIFNhdmUgdG8gZ2xvYmFsIGNhY2hlXG4gICAgdGhpcy5fY2FjaGVQdXRVc2VyKHVpZCwgY2FjaGVkKTtcbiAgICAvLyBTYXZlIHRvIHRoZSBsaXN0IG9mIHRvcGljIHN1YnNyaWJlcnMuXG4gICAgcmV0dXJuIG1lcmdlVG9DYWNoZSh0aGlzLl91c2VycywgdWlkLCBjYWNoZWQpO1xuICB9XG4gIC8vIEdldCBsb2NhbCBzZXFJZCBmb3IgYSBxdWV1ZWQgbWVzc2FnZS5cbiAgX2dldFF1ZXVlZFNlcUlkKCkge1xuICAgIHJldHVybiB0aGlzLl9xdWV1ZWRTZXFJZCsrO1xuICB9XG4gIC8vIENhbGN1bGF0ZSByYW5nZXMgb2YgbWlzc2luZyBtZXNzYWdlcy5cbiAgX3VwZGF0ZURlbGV0ZWRSYW5nZXMoKSB7XG4gICAgY29uc3QgcmFuZ2VzID0gW107XG5cbiAgICAvLyBHYXAgbWFya2VyLCBwb3NzaWJseSBlbXB0eS5cbiAgICBsZXQgcHJldiA9IG51bGw7XG5cbiAgICAvLyBDaGVjayBmb3IgZ2FwIGluIHRoZSBiZWdpbm5pbmcsIGJlZm9yZSB0aGUgZmlyc3QgbWVzc2FnZS5cbiAgICBjb25zdCBmaXJzdCA9IHRoaXMuX21lc3NhZ2VzLmdldEF0KDApO1xuICAgIGlmIChmaXJzdCAmJiB0aGlzLl9taW5TZXEgPiAxICYmICF0aGlzLl9ub0VhcmxpZXJNc2dzKSB7XG4gICAgICAvLyBTb21lIG1lc3NhZ2VzIGFyZSBtaXNzaW5nIGluIHRoZSBiZWdpbm5pbmcuXG4gICAgICBpZiAoZmlyc3QuaGkpIHtcbiAgICAgICAgLy8gVGhlIGZpcnN0IG1lc3NhZ2UgYWxyZWFkeSByZXByZXNlbnRzIGEgZ2FwLlxuICAgICAgICBpZiAoZmlyc3Quc2VxID4gMSkge1xuICAgICAgICAgIGZpcnN0LnNlcSA9IDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZpcnN0LmhpIDwgdGhpcy5fbWluU2VxIC0gMSkge1xuICAgICAgICAgIGZpcnN0LmhpID0gdGhpcy5fbWluU2VxIC0gMTtcbiAgICAgICAgfVxuICAgICAgICBwcmV2ID0gZmlyc3Q7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBDcmVhdGUgbmV3IGdhcC5cbiAgICAgICAgcHJldiA9IHtcbiAgICAgICAgICBzZXE6IDEsXG4gICAgICAgICAgaGk6IHRoaXMuX21pblNlcSAtIDFcbiAgICAgICAgfTtcbiAgICAgICAgcmFuZ2VzLnB1c2gocHJldik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIE5vIGdhcCBpbiB0aGUgYmVnaW5uaW5nLlxuICAgICAgcHJldiA9IHtcbiAgICAgICAgc2VxOiAwLFxuICAgICAgICBoaTogMFxuICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBGaW5kIG5ldyBnYXBzIGluIHRoZSBsaXN0IG9mIHJlY2VpdmVkIG1lc3NhZ2VzLiBUaGUgbGlzdCBjb250YWlucyBtZXNzYWdlcy1wcm9wZXIgYXMgd2VsbFxuICAgIC8vIGFzIHBsYWNlaG9sZGVycyBmb3IgZGVsZXRlZCByYW5nZXMuXG4gICAgLy8gVGhlIG1lc3NhZ2VzIGFyZSBpdGVyYXRlZCBieSBzZXEgSUQgaW4gYXNjZW5kaW5nIG9yZGVyLlxuICAgIHRoaXMuX21lc3NhZ2VzLmZpbHRlcigoZGF0YSkgPT4ge1xuICAgICAgLy8gRG8gbm90IGNyZWF0ZSBhIGdhcCBiZXR3ZWVuIHRoZSBsYXN0IHNlbnQgbWVzc2FnZSBhbmQgdGhlIGZpcnN0IHVuc2VudCBhcyB3ZWxsIGFzIGJldHdlZW4gdW5zZW50IG1lc3NhZ2VzLlxuICAgICAgaWYgKGRhdGEuc2VxID49IENvbnN0LkxPQ0FMX1NFUUlEKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBDaGVjayBmb3IgYSBnYXAgYmV0d2VlbiB0aGUgcHJldmlvdXMgbWVzc2FnZS9tYXJrZXIgYW5kIHRoaXMgbWVzc2FnZS9tYXJrZXIuXG4gICAgICBpZiAoZGF0YS5zZXEgPT0gKHByZXYuaGkgfHwgcHJldi5zZXEpICsgMSkge1xuICAgICAgICAvLyBObyBnYXAgYmV0d2VlbiB0aGlzIG1lc3NhZ2UgYW5kIHRoZSBwcmV2aW91cy5cbiAgICAgICAgaWYgKGRhdGEuaGkgJiYgcHJldi5oaSkge1xuICAgICAgICAgIC8vIFR3byBnYXAgbWFya2VycyBpbiBhIHJvdy4gRXh0ZW5kIHRoZSBwcmV2aW91cyBvbmUsIGRpc2NhcmQgdGhlIGN1cnJlbnQuXG4gICAgICAgICAgcHJldi5oaSA9IGRhdGEuaGk7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHByZXYgPSBkYXRhO1xuXG4gICAgICAgIC8vIEtlZXAgY3VycmVudC5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIC8vIEZvdW5kIGEgbmV3IGdhcC5cbiAgICAgIC8vIENoZWNrIGlmIHRoZSBwcmV2aW91cyBpcyBhbHNvIGEgZ2FwIG1hcmtlci5cbiAgICAgIGlmIChwcmV2LmhpKSB7XG4gICAgICAgIC8vIEFsdGVyIGl0IGluc3RlYWQgb2YgY3JlYXRpbmcgYSBuZXcgb25lLlxuICAgICAgICBwcmV2LmhpID0gZGF0YS5oaSB8fCBkYXRhLnNlcTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFByZXZpb3VzIGlzIG5vdCBhIGdhcCBtYXJrZXIuIENyZWF0ZSBhIG5ldyBvbmUuXG4gICAgICAgIHByZXYgPSB7XG4gICAgICAgICAgc2VxOiBwcmV2LnNlcSArIDEsXG4gICAgICAgICAgaGk6IGRhdGEuaGkgfHwgZGF0YS5zZXFcbiAgICAgICAgfTtcbiAgICAgICAgcmFuZ2VzLnB1c2gocHJldik7XG4gICAgICB9XG5cbiAgICAgIC8vIElmIG1hcmtlciwgcmVtb3ZlOyBrZWVwIGlmIHJlZ3VsYXIgbWVzc2FnZS5cbiAgICAgIGlmICghZGF0YS5oaSkge1xuICAgICAgICAvLyBLZWVwaW5nIHRoZSBjdXJyZW50IHJlZ3VsYXIgbWVzc2FnZSwgc2F2ZSBpdCBhcyBwcmV2aW91cy5cbiAgICAgICAgcHJldiA9IGRhdGE7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBEaXNjYXJkIHRoZSBjdXJyZW50IGdhcCBtYXJrZXI6IHdlIGVpdGhlciBjcmVhdGVkIGFuIGVhcmxpZXIgZ2FwLCBvciBleHRlbmRlZCB0aGUgcHJldm91cyBvbmUuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSk7XG5cbiAgICAvLyBDaGVjayBmb3IgbWlzc2luZyBtZXNzYWdlcyBhdCB0aGUgZW5kLlxuICAgIC8vIEFsbCBtZXNzYWdlcyBjb3VsZCBiZSBtaXNzaW5nIG9yIGl0IGNvdWxkIGJlIGEgbmV3IHRvcGljIHdpdGggbm8gbWVzc2FnZXMuXG4gICAgY29uc3QgbGFzdCA9IHRoaXMuX21lc3NhZ2VzLmdldExhc3QoKTtcbiAgICBjb25zdCBtYXhTZXEgPSBNYXRoLm1heCh0aGlzLnNlcSwgdGhpcy5fbWF4U2VxKSB8fCAwO1xuICAgIGlmICgobWF4U2VxID4gMCAmJiAhbGFzdCkgfHwgKGxhc3QgJiYgKChsYXN0LmhpIHx8IGxhc3Quc2VxKSA8IG1heFNlcSkpKSB7XG4gICAgICBpZiAobGFzdCAmJiBsYXN0LmhpKSB7XG4gICAgICAgIC8vIEV4dGVuZCBleGlzdGluZyBnYXBcbiAgICAgICAgbGFzdC5oaSA9IG1heFNlcTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIENyZWF0ZSBuZXcgZ2FwLlxuICAgICAgICByYW5nZXMucHVzaCh7XG4gICAgICAgICAgc2VxOiBsYXN0ID8gbGFzdC5zZXEgKyAxIDogMSxcbiAgICAgICAgICBoaTogbWF4U2VxXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEluc2VydCBuZXcgZ2FwcyBpbnRvIGNhY2hlLlxuICAgIHJhbmdlcy5mb3JFYWNoKChnYXApID0+IHtcbiAgICAgIGdhcC5fc3RhdHVzID0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfREVMX1JBTkdFO1xuICAgICAgdGhpcy5fbWVzc2FnZXMucHV0KGdhcCk7XG4gICAgfSk7XG4gIH1cbiAgLy8gTG9hZCBtb3N0IHJlY2VudCBtZXNzYWdlcyBmcm9tIHBlcnNpc3RlbnQgY2FjaGUuXG4gIF9sb2FkTWVzc2FnZXMoZGIsIHBhcmFtcykge1xuICAgIGNvbnN0IHtcbiAgICAgIHNpbmNlLFxuICAgICAgYmVmb3JlLFxuICAgICAgbGltaXRcbiAgICB9ID0gcGFyYW1zIHx8IHt9O1xuICAgIHJldHVybiBkYi5yZWFkTWVzc2FnZXModGhpcy5uYW1lLCB7XG4gICAgICAgIHNpbmNlOiBzaW5jZSxcbiAgICAgICAgYmVmb3JlOiBiZWZvcmUsXG4gICAgICAgIGxpbWl0OiBsaW1pdCB8fCBDb25zdC5ERUZBVUxUX01FU1NBR0VTX1BBR0VcbiAgICAgIH0pXG4gICAgICAudGhlbigobXNncykgPT4ge1xuICAgICAgICBtc2dzLmZvckVhY2goKGRhdGEpID0+IHtcbiAgICAgICAgICBpZiAoZGF0YS5zZXEgPiB0aGlzLl9tYXhTZXEpIHtcbiAgICAgICAgICAgIHRoaXMuX21heFNlcSA9IGRhdGEuc2VxO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZGF0YS5zZXEgPCB0aGlzLl9taW5TZXEgfHwgdGhpcy5fbWluU2VxID09IDApIHtcbiAgICAgICAgICAgIHRoaXMuX21pblNlcSA9IGRhdGEuc2VxO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLl9tZXNzYWdlcy5wdXQoZGF0YSk7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAobXNncy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgdGhpcy5fdXBkYXRlRGVsZXRlZFJhbmdlcygpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtc2dzLmxlbmd0aDtcbiAgICAgIH0pO1xuICB9XG4gIC8vIFB1c2ggb3Ige3ByZXN9OiBtZXNzYWdlIHJlY2VpdmVkLlxuICBfdXBkYXRlUmVjZWl2ZWQoc2VxLCBhY3QpIHtcbiAgICB0aGlzLnRvdWNoZWQgPSBuZXcgRGF0ZSgpO1xuICAgIHRoaXMuc2VxID0gc2VxIHwgMDtcbiAgICAvLyBDaGVjayBpZiBtZXNzYWdlIGlzIHNlbnQgYnkgdGhlIGN1cnJlbnQgdXNlci4gSWYgc28gaXQncyBiZWVuIHJlYWQgYWxyZWFkeS5cbiAgICBpZiAoIWFjdCB8fCB0aGlzLl90aW5vZGUuaXNNZShhY3QpKSB7XG4gICAgICB0aGlzLnJlYWQgPSB0aGlzLnJlYWQgPyBNYXRoLm1heCh0aGlzLnJlYWQsIHRoaXMuc2VxKSA6IHRoaXMuc2VxO1xuICAgICAgdGhpcy5yZWN2ID0gdGhpcy5yZWN2ID8gTWF0aC5tYXgodGhpcy5yZWFkLCB0aGlzLnJlY3YpIDogdGhpcy5yZWFkO1xuICAgIH1cbiAgICB0aGlzLnVucmVhZCA9IHRoaXMuc2VxIC0gKHRoaXMucmVhZCB8IDApO1xuICAgIHRoaXMuX3Rpbm9kZS5fZGIudXBkVG9waWModGhpcyk7XG4gIH1cbn1cblxuXG4vKipcbiAqIEBjbGFzcyBUb3BpY01lIC0gc3BlY2lhbCBjYXNlIG9mIHtAbGluayBUaW5vZGUuVG9waWN9IGZvclxuICogbWFuYWdpbmcgZGF0YSBvZiB0aGUgY3VycmVudCB1c2VyLCBpbmNsdWRpbmcgY29udGFjdCBsaXN0LlxuICogQGV4dGVuZHMgVGlub2RlLlRvcGljXG4gKiBAbWVtYmVyb2YgVGlub2RlXG4gKlxuICogQHBhcmFtIHtUb3BpY01lLkNhbGxiYWNrc30gY2FsbGJhY2tzIC0gQ2FsbGJhY2tzIHRvIHJlY2VpdmUgdmFyaW91cyBldmVudHMuXG4gKi9cbi8qKlxuICogQGNsYXNzIFRvcGljTWUgLSBzcGVjaWFsIGNhc2Ugb2Yge0BsaW5rIFRpbm9kZS5Ub3BpY30gZm9yXG4gKiBtYW5hZ2luZyBkYXRhIG9mIHRoZSBjdXJyZW50IHVzZXIsIGluY2x1ZGluZyBjb250YWN0IGxpc3QuXG4gKiBAZXh0ZW5kcyBUaW5vZGUuVG9waWNcbiAqIEBtZW1iZXJvZiBUaW5vZGVcbiAqXG4gKiBAcGFyYW0ge1RvcGljTWUuQ2FsbGJhY2tzfSBjYWxsYmFja3MgLSBDYWxsYmFja3MgdG8gcmVjZWl2ZSB2YXJpb3VzIGV2ZW50cy5cbiAqL1xuZXhwb3J0IGNsYXNzIFRvcGljTWUgZXh0ZW5kcyBUb3BpYyB7XG4gIG9uQ29udGFjdFVwZGF0ZTtcblxuICBjb25zdHJ1Y3RvcihjYWxsYmFja3MpIHtcbiAgICBzdXBlcihDb25zdC5UT1BJQ19NRSwgY2FsbGJhY2tzKTtcblxuICAgIC8vIG1lLXNwZWNpZmljIGNhbGxiYWNrc1xuICAgIGlmIChjYWxsYmFja3MpIHtcbiAgICAgIHRoaXMub25Db250YWN0VXBkYXRlID0gY2FsbGJhY2tzLm9uQ29udGFjdFVwZGF0ZTtcbiAgICB9XG4gIH1cblxuICAvLyBPdmVycmlkZSB0aGUgb3JpZ2luYWwgVG9waWMuX3Byb2Nlc3NNZXRhRGVzYy5cbiAgX3Byb2Nlc3NNZXRhRGVzYyhkZXNjKSB7XG4gICAgLy8gQ2hlY2sgaWYgb25saW5lIGNvbnRhY3RzIG5lZWQgdG8gYmUgdHVybmVkIG9mZiBiZWNhdXNlIFAgcGVybWlzc2lvbiB3YXMgcmVtb3ZlZC5cbiAgICBjb25zdCB0dXJuT2ZmID0gKGRlc2MuYWNzICYmICFkZXNjLmFjcy5pc1ByZXNlbmNlcigpKSAmJiAodGhpcy5hY3MgJiYgdGhpcy5hY3MuaXNQcmVzZW5jZXIoKSk7XG5cbiAgICAvLyBDb3B5IHBhcmFtZXRlcnMgZnJvbSBkZXNjIG9iamVjdCB0byB0aGlzIHRvcGljLlxuICAgIG1lcmdlT2JqKHRoaXMsIGRlc2MpO1xuICAgIHRoaXMuX3Rpbm9kZS5fZGIudXBkVG9waWModGhpcyk7XG4gICAgLy8gVXBkYXRlIGN1cnJlbnQgdXNlcidzIHJlY29yZCBpbiB0aGUgZ2xvYmFsIGNhY2hlLlxuICAgIHRoaXMuX3VwZGF0ZUNhY2hlZFVzZXIodGhpcy5fdGlub2RlLl9teVVJRCwgZGVzYyk7XG5cbiAgICAvLyAnUCcgcGVybWlzc2lvbiB3YXMgcmVtb3ZlZC4gQWxsIHRvcGljcyBhcmUgb2ZmbGluZSBub3cuXG4gICAgaWYgKHR1cm5PZmYpIHtcbiAgICAgIHRoaXMuX3Rpbm9kZS5tYXBUb3BpY3MoKGNvbnQpID0+IHtcbiAgICAgICAgaWYgKGNvbnQub25saW5lKSB7XG4gICAgICAgICAgY29udC5vbmxpbmUgPSBmYWxzZTtcbiAgICAgICAgICBjb250LnNlZW4gPSBPYmplY3QuYXNzaWduKGNvbnQuc2VlbiB8fCB7fSwge1xuICAgICAgICAgICAgd2hlbjogbmV3IERhdGUoKVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRoaXMuX3JlZnJlc2hDb250YWN0KCdvZmYnLCBjb250KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMub25NZXRhRGVzYykge1xuICAgICAgdGhpcy5vbk1ldGFEZXNjKHRoaXMpO1xuICAgIH1cbiAgfVxuXG4gIC8vIE92ZXJyaWRlIHRoZSBvcmlnaW5hbCBUb3BpYy5fcHJvY2Vzc01ldGFTdWJcbiAgX3Byb2Nlc3NNZXRhU3ViKHN1YnMpIHtcbiAgICBsZXQgdXBkYXRlQ291bnQgPSAwO1xuICAgIHN1YnMuZm9yRWFjaCgoc3ViKSA9PiB7XG4gICAgICBjb25zdCB0b3BpY05hbWUgPSBzdWIudG9waWM7XG4gICAgICAvLyBEb24ndCBzaG93ICdtZScgYW5kICdmbmQnIHRvcGljcyBpbiB0aGUgbGlzdCBvZiBjb250YWN0cy5cbiAgICAgIGlmICh0b3BpY05hbWUgPT0gQ29uc3QuVE9QSUNfRk5EIHx8IHRvcGljTmFtZSA9PSBDb25zdC5UT1BJQ19NRSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBzdWIub25saW5lID0gISFzdWIub25saW5lO1xuXG4gICAgICBsZXQgY29udCA9IG51bGw7XG4gICAgICBpZiAoc3ViLmRlbGV0ZWQpIHtcbiAgICAgICAgY29udCA9IHN1YjtcbiAgICAgICAgdGhpcy5fdGlub2RlLmNhY2hlUmVtVG9waWModG9waWNOYW1lKTtcbiAgICAgICAgdGhpcy5fdGlub2RlLl9kYi5yZW1Ub3BpYyh0b3BpY05hbWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gRW5zdXJlIHRoZSB2YWx1ZXMgYXJlIGRlZmluZWQgYW5kIGFyZSBpbnRlZ2Vycy5cbiAgICAgICAgaWYgKHR5cGVvZiBzdWIuc2VxICE9ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgc3ViLnNlcSA9IHN1Yi5zZXEgfCAwO1xuICAgICAgICAgIHN1Yi5yZWN2ID0gc3ViLnJlY3YgfCAwO1xuICAgICAgICAgIHN1Yi5yZWFkID0gc3ViLnJlYWQgfCAwO1xuICAgICAgICAgIHN1Yi51bnJlYWQgPSBzdWIuc2VxIC0gc3ViLnJlYWQ7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB0b3BpYyA9IHRoaXMuX3Rpbm9kZS5nZXRUb3BpYyh0b3BpY05hbWUpO1xuICAgICAgICBpZiAodG9waWMuX25ldykge1xuICAgICAgICAgIGRlbGV0ZSB0b3BpYy5fbmV3O1xuICAgICAgICB9XG5cbiAgICAgICAgY29udCA9IG1lcmdlT2JqKHRvcGljLCBzdWIpO1xuICAgICAgICB0aGlzLl90aW5vZGUuX2RiLnVwZFRvcGljKGNvbnQpO1xuXG4gICAgICAgIGlmIChUb3BpYy5pc1AyUFRvcGljTmFtZSh0b3BpY05hbWUpKSB7XG4gICAgICAgICAgdGhpcy5fY2FjaGVQdXRVc2VyKHRvcGljTmFtZSwgY29udCk7XG4gICAgICAgICAgdGhpcy5fdGlub2RlLl9kYi51cGRVc2VyKHRvcGljTmFtZSwgY29udC5wdWJsaWMpO1xuICAgICAgICB9XG4gICAgICAgIC8vIE5vdGlmeSB0b3BpYyBvZiB0aGUgdXBkYXRlIGlmIGl0J3MgYW4gZXh0ZXJuYWwgdXBkYXRlLlxuICAgICAgICBpZiAoIXN1Yi5fbm9Gb3J3YXJkaW5nICYmIHRvcGljKSB7XG4gICAgICAgICAgc3ViLl9ub0ZvcndhcmRpbmcgPSB0cnVlO1xuICAgICAgICAgIHRvcGljLl9wcm9jZXNzTWV0YURlc2Moc3ViKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB1cGRhdGVDb3VudCsrO1xuXG4gICAgICBpZiAodGhpcy5vbk1ldGFTdWIpIHtcbiAgICAgICAgdGhpcy5vbk1ldGFTdWIoY29udCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5vblN1YnNVcGRhdGVkICYmIHVwZGF0ZUNvdW50ID4gMCkge1xuICAgICAgY29uc3Qga2V5cyA9IFtdO1xuICAgICAgc3Vicy5mb3JFYWNoKChzKSA9PiB7XG4gICAgICAgIGtleXMucHVzaChzLnRvcGljKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5vblN1YnNVcGRhdGVkKGtleXMsIHVwZGF0ZUNvdW50KTtcbiAgICB9XG4gIH1cblxuICAvLyBDYWxsZWQgYnkgVGlub2RlIHdoZW4gbWV0YS5zdWIgaXMgcmVjaXZlZC5cbiAgX3Byb2Nlc3NNZXRhQ3JlZHMoY3JlZHMsIHVwZCkge1xuICAgIGlmIChjcmVkcy5sZW5ndGggPT0gMSAmJiBjcmVkc1swXSA9PSBDb25zdC5ERUxfQ0hBUikge1xuICAgICAgY3JlZHMgPSBbXTtcbiAgICB9XG4gICAgaWYgKHVwZCkge1xuICAgICAgY3JlZHMuZm9yRWFjaCgoY3IpID0+IHtcbiAgICAgICAgaWYgKGNyLnZhbCkge1xuICAgICAgICAgIC8vIEFkZGluZyBhIGNyZWRlbnRpYWwuXG4gICAgICAgICAgbGV0IGlkeCA9IHRoaXMuX2NyZWRlbnRpYWxzLmZpbmRJbmRleCgoZWwpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBlbC5tZXRoID09IGNyLm1ldGggJiYgZWwudmFsID09IGNyLnZhbDtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAoaWR4IDwgMCkge1xuICAgICAgICAgICAgLy8gTm90IGZvdW5kLlxuICAgICAgICAgICAgaWYgKCFjci5kb25lKSB7XG4gICAgICAgICAgICAgIC8vIFVuY29uZmlybWVkIGNyZWRlbnRpYWwgcmVwbGFjZXMgcHJldmlvdXMgdW5jb25maXJtZWQgY3JlZGVudGlhbCBvZiB0aGUgc2FtZSBtZXRob2QuXG4gICAgICAgICAgICAgIGlkeCA9IHRoaXMuX2NyZWRlbnRpYWxzLmZpbmRJbmRleCgoZWwpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZWwubWV0aCA9PSBjci5tZXRoICYmICFlbC5kb25lO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgaWYgKGlkeCA+PSAwKSB7XG4gICAgICAgICAgICAgICAgLy8gUmVtb3ZlIHByZXZpb3VzIHVuY29uZmlybWVkIGNyZWRlbnRpYWwuXG4gICAgICAgICAgICAgICAgdGhpcy5fY3JlZGVudGlhbHMuc3BsaWNlKGlkeCwgMSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX2NyZWRlbnRpYWxzLnB1c2goY3IpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBGb3VuZC4gTWF5YmUgY2hhbmdlICdkb25lJyBzdGF0dXMuXG4gICAgICAgICAgICB0aGlzLl9jcmVkZW50aWFsc1tpZHhdLmRvbmUgPSBjci5kb25lO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChjci5yZXNwKSB7XG4gICAgICAgICAgLy8gSGFuZGxlIGNyZWRlbnRpYWwgY29uZmlybWF0aW9uLlxuICAgICAgICAgIGNvbnN0IGlkeCA9IHRoaXMuX2NyZWRlbnRpYWxzLmZpbmRJbmRleCgoZWwpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBlbC5tZXRoID09IGNyLm1ldGggJiYgIWVsLmRvbmU7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKGlkeCA+PSAwKSB7XG4gICAgICAgICAgICB0aGlzLl9jcmVkZW50aWFsc1tpZHhdLmRvbmUgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2NyZWRlbnRpYWxzID0gY3JlZHM7XG4gICAgfVxuICAgIGlmICh0aGlzLm9uQ3JlZHNVcGRhdGVkKSB7XG4gICAgICB0aGlzLm9uQ3JlZHNVcGRhdGVkKHRoaXMuX2NyZWRlbnRpYWxzKTtcbiAgICB9XG4gIH1cblxuICAvLyBQcm9jZXNzIHByZXNlbmNlIGNoYW5nZSBtZXNzYWdlXG4gIF9yb3V0ZVByZXMocHJlcykge1xuICAgIGlmIChwcmVzLndoYXQgPT0gJ3Rlcm0nKSB7XG4gICAgICAvLyBUaGUgJ21lJyB0b3BpYyBpdHNlbGYgaXMgZGV0YWNoZWQuIE1hcmsgYXMgdW5zdWJzY3JpYmVkLlxuICAgICAgdGhpcy5fcmVzZXRTdWIoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAocHJlcy53aGF0ID09ICd1cGQnICYmIHByZXMuc3JjID09IENvbnN0LlRPUElDX01FKSB7XG4gICAgICAvLyBVcGRhdGUgdG8gbWUncyBkZXNjcmlwdGlvbi4gUmVxdWVzdCB1cGRhdGVkIHZhbHVlLlxuICAgICAgdGhpcy5nZXRNZXRhKHRoaXMuc3RhcnRNZXRhUXVlcnkoKS53aXRoRGVzYygpLmJ1aWxkKCkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGNvbnQgPSB0aGlzLl90aW5vZGUuY2FjaGVHZXRUb3BpYyhwcmVzLnNyYyk7XG4gICAgaWYgKGNvbnQpIHtcbiAgICAgIHN3aXRjaCAocHJlcy53aGF0KSB7XG4gICAgICAgIGNhc2UgJ29uJzogLy8gdG9waWMgY2FtZSBvbmxpbmVcbiAgICAgICAgICBjb250Lm9ubGluZSA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ29mZic6IC8vIHRvcGljIHdlbnQgb2ZmbGluZVxuICAgICAgICAgIGlmIChjb250Lm9ubGluZSkge1xuICAgICAgICAgICAgY29udC5vbmxpbmUgPSBmYWxzZTtcbiAgICAgICAgICAgIGNvbnQuc2VlbiA9IE9iamVjdC5hc3NpZ24oY29udC5zZWVuIHx8IHt9LCB7XG4gICAgICAgICAgICAgIHdoZW46IG5ldyBEYXRlKClcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnbXNnJzogLy8gbmV3IG1lc3NhZ2UgcmVjZWl2ZWRcbiAgICAgICAgICBjb250Ll91cGRhdGVSZWNlaXZlZChwcmVzLnNlcSwgcHJlcy5hY3QpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICd1cGQnOiAvLyBkZXNjIHVwZGF0ZWRcbiAgICAgICAgICAvLyBSZXF1ZXN0IHVwZGF0ZWQgc3Vic2NyaXB0aW9uLlxuICAgICAgICAgIHRoaXMuZ2V0TWV0YSh0aGlzLnN0YXJ0TWV0YVF1ZXJ5KCkud2l0aExhdGVyT25lU3ViKHByZXMuc3JjKS5idWlsZCgpKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnYWNzJzogLy8gYWNjZXNzIG1vZGUgY2hhbmdlZFxuICAgICAgICAgIGlmIChjb250LmFjcykge1xuICAgICAgICAgICAgY29udC5hY3MudXBkYXRlQWxsKHByZXMuZGFjcyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnQuYWNzID0gbmV3IEFjY2Vzc01vZGUoKS51cGRhdGVBbGwocHJlcy5kYWNzKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29udC50b3VjaGVkID0gbmV3IERhdGUoKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAndWEnOlxuICAgICAgICAgIC8vIHVzZXIgYWdlbnQgY2hhbmdlZC5cbiAgICAgICAgICBjb250LnNlZW4gPSB7XG4gICAgICAgICAgICB3aGVuOiBuZXcgRGF0ZSgpLFxuICAgICAgICAgICAgdWE6IHByZXMudWFcbiAgICAgICAgICB9O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdyZWN2JzpcbiAgICAgICAgICAvLyB1c2VyJ3Mgb3RoZXIgc2Vzc2lvbiBtYXJrZWQgc29tZSBtZXNzZ2VzIGFzIHJlY2VpdmVkLlxuICAgICAgICAgIHByZXMuc2VxID0gcHJlcy5zZXEgfCAwO1xuICAgICAgICAgIGNvbnQucmVjdiA9IGNvbnQucmVjdiA/IE1hdGgubWF4KGNvbnQucmVjdiwgcHJlcy5zZXEpIDogcHJlcy5zZXE7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3JlYWQnOlxuICAgICAgICAgIC8vIHVzZXIncyBvdGhlciBzZXNzaW9uIG1hcmtlZCBzb21lIG1lc3NhZ2VzIGFzIHJlYWQuXG4gICAgICAgICAgcHJlcy5zZXEgPSBwcmVzLnNlcSB8IDA7XG4gICAgICAgICAgY29udC5yZWFkID0gY29udC5yZWFkID8gTWF0aC5tYXgoY29udC5yZWFkLCBwcmVzLnNlcSkgOiBwcmVzLnNlcTtcbiAgICAgICAgICBjb250LnJlY3YgPSBjb250LnJlY3YgPyBNYXRoLm1heChjb250LnJlYWQsIGNvbnQucmVjdikgOiBjb250LnJlY3Y7XG4gICAgICAgICAgY29udC51bnJlYWQgPSBjb250LnNlcSAtIGNvbnQucmVhZDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnZ29uZSc6XG4gICAgICAgICAgLy8gdG9waWMgZGVsZXRlZCBvciB1bnN1YnNjcmliZWQgZnJvbS5cbiAgICAgICAgICBpZiAoIWNvbnQuX2RlbGV0ZWQpIHtcbiAgICAgICAgICAgIGNvbnQuX2RlbGV0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgY29udC5fYXR0YWNoZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuX3Rpbm9kZS5fZGIubWFya1RvcGljQXNEZWxldGVkKHByZXMuc3JjKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fdGlub2RlLl9kYi5yZW1Ub3BpYyhwcmVzLnNyYyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdkZWwnOlxuICAgICAgICAgIC8vIFVwZGF0ZSB0b3BpYy5kZWwgdmFsdWUuXG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgdGhpcy5fdGlub2RlLmxvZ2dlcihcIklORk86IFVuc3VwcG9ydGVkIHByZXNlbmNlIHVwZGF0ZSBpbiAnbWUnXCIsIHByZXMud2hhdCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3JlZnJlc2hDb250YWN0KHByZXMud2hhdCwgY29udCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChwcmVzLndoYXQgPT0gJ2FjcycpIHtcbiAgICAgICAgLy8gTmV3IHN1YnNjcmlwdGlvbnMgYW5kIGRlbGV0ZWQvYmFubmVkIHN1YnNjcmlwdGlvbnMgaGF2ZSBmdWxsXG4gICAgICAgIC8vIGFjY2VzcyBtb2RlIChubyArIG9yIC0gaW4gdGhlIGRhY3Mgc3RyaW5nKS4gQ2hhbmdlcyB0byBrbm93biBzdWJzY3JpcHRpb25zIGFyZSBzZW50IGFzXG4gICAgICAgIC8vIGRlbHRhcywgYnV0IHRoZXkgc2hvdWxkIG5vdCBoYXBwZW4gaGVyZS5cbiAgICAgICAgY29uc3QgYWNzID0gbmV3IEFjY2Vzc01vZGUocHJlcy5kYWNzKTtcbiAgICAgICAgaWYgKCFhY3MgfHwgYWNzLm1vZGUgPT0gQWNjZXNzTW9kZS5fSU5WQUxJRCkge1xuICAgICAgICAgIHRoaXMuX3Rpbm9kZS5sb2dnZXIoXCJFUlJPUjogSW52YWxpZCBhY2Nlc3MgbW9kZSB1cGRhdGVcIiwgcHJlcy5zcmMsIHByZXMuZGFjcyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IGVsc2UgaWYgKGFjcy5tb2RlID09IEFjY2Vzc01vZGUuX05PTkUpIHtcbiAgICAgICAgICB0aGlzLl90aW5vZGUubG9nZ2VyKFwiV0FSTklORzogUmVtb3Zpbmcgbm9uLWV4aXN0ZW50IHN1YnNjcmlwdGlvblwiLCBwcmVzLnNyYywgcHJlcy5kYWNzKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gTmV3IHN1YnNjcmlwdGlvbi4gU2VuZCByZXF1ZXN0IGZvciB0aGUgZnVsbCBkZXNjcmlwdGlvbi5cbiAgICAgICAgICAvLyBVc2luZyAud2l0aE9uZVN1YiAobm90IC53aXRoTGF0ZXJPbmVTdWIpIHRvIG1ha2Ugc3VyZSBJZk1vZGlmaWVkU2luY2UgaXMgbm90IHNldC5cbiAgICAgICAgICB0aGlzLmdldE1ldGEodGhpcy5zdGFydE1ldGFRdWVyeSgpLndpdGhPbmVTdWIodW5kZWZpbmVkLCBwcmVzLnNyYykuYnVpbGQoKSk7XG4gICAgICAgICAgLy8gQ3JlYXRlIGEgZHVtbXkgZW50cnkgdG8gY2F0Y2ggb25saW5lIHN0YXR1cyB1cGRhdGUuXG4gICAgICAgICAgY29uc3QgZHVtbXkgPSB0aGlzLl90aW5vZGUuZ2V0VG9waWMocHJlcy5zcmMpO1xuICAgICAgICAgIGR1bW15LnRvcGljID0gcHJlcy5zcmM7XG4gICAgICAgICAgZHVtbXkub25saW5lID0gZmFsc2U7XG4gICAgICAgICAgZHVtbXkuYWNzID0gYWNzO1xuICAgICAgICAgIHRoaXMuX3Rpbm9kZS5fZGIudXBkVG9waWMoZHVtbXkpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHByZXMud2hhdCA9PSAndGFncycpIHtcbiAgICAgICAgdGhpcy5nZXRNZXRhKHRoaXMuc3RhcnRNZXRhUXVlcnkoKS53aXRoVGFncygpLmJ1aWxkKCkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLm9uUHJlcykge1xuICAgICAgdGhpcy5vblByZXMocHJlcyk7XG4gICAgfVxuICB9XG5cbiAgLy8gQ29udGFjdCBpcyB1cGRhdGVkLCBleGVjdXRlIGNhbGxiYWNrcy5cbiAgX3JlZnJlc2hDb250YWN0KHdoYXQsIGNvbnQpIHtcbiAgICBpZiAodGhpcy5vbkNvbnRhY3RVcGRhdGUpIHtcbiAgICAgIHRoaXMub25Db250YWN0VXBkYXRlKHdoYXQsIGNvbnQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBQdWJsaXNoaW5nIHRvIFRvcGljTWUgaXMgbm90IHN1cHBvcnRlZC4ge0BsaW5rIFRvcGljI3B1Ymxpc2h9IGlzIG92ZXJyaWRlbiBhbmQgdGhvd3MgYW4ge0Vycm9yfSBpZiBjYWxsZWQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWNNZSNcbiAgICogQHRocm93cyB7RXJyb3J9IEFsd2F5cyB0aHJvd3MgYW4gZXJyb3IuXG4gICAqL1xuICBwdWJsaXNoKCkge1xuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJQdWJsaXNoaW5nIHRvICdtZScgaXMgbm90IHN1cHBvcnRlZFwiKSk7XG4gIH1cblxuICAvKipcbiAgICogRGVsZXRlIHZhbGlkYXRpb24gY3JlZGVudGlhbC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpY01lI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWMgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byBkZWxldGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVzZXIgLSBVc2VyIElEIHRvIHJlbW92ZS5cbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCBvbiByZWNlaXZpbmcgc2VydmVyIHJlcGx5LlxuICAgKi9cbiAgZGVsQ3JlZGVudGlhbChtZXRob2QsIHZhbHVlKSB7XG4gICAgaWYgKCF0aGlzLl9hdHRhY2hlZCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIkNhbm5vdCBkZWxldGUgY3JlZGVudGlhbCBpbiBpbmFjdGl2ZSAnbWUnIHRvcGljXCIpKTtcbiAgICB9XG4gICAgLy8gU2VuZCB7ZGVsfSBtZXNzYWdlLCByZXR1cm4gcHJvbWlzZVxuICAgIHJldHVybiB0aGlzLl90aW5vZGUuZGVsQ3JlZGVudGlhbChtZXRob2QsIHZhbHVlKS50aGVuKChjdHJsKSA9PiB7XG4gICAgICAvLyBSZW1vdmUgZGVsZXRlZCBjcmVkZW50aWFsIGZyb20gdGhlIGNhY2hlLlxuICAgICAgY29uc3QgaW5kZXggPSB0aGlzLl9jcmVkZW50aWFscy5maW5kSW5kZXgoKGVsKSA9PiB7XG4gICAgICAgIHJldHVybiBlbC5tZXRoID09IG1ldGhvZCAmJiBlbC52YWwgPT0gdmFsdWU7XG4gICAgICB9KTtcbiAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgIHRoaXMuX2NyZWRlbnRpYWxzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICB9XG4gICAgICAvLyBOb3RpZnkgbGlzdGVuZXJzXG4gICAgICBpZiAodGhpcy5vbkNyZWRzVXBkYXRlZCkge1xuICAgICAgICB0aGlzLm9uQ3JlZHNVcGRhdGVkKHRoaXMuX2NyZWRlbnRpYWxzKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjdHJsO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBjYWxsYmFjayBjb250YWN0RmlsdGVyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjb250YWN0IHRvIGNoZWNrIGZvciBpbmNsdXNpb24uXG4gICAqIEByZXR1cm5zIHtib29sZWFufSA8Y29kZT50cnVlPC9jb2RlPiBpZiBjb250YWN0IHNob3VsZCBiZSBwcm9jZXNzZWQsIDxjb2RlPmZhbHNlPC9jb2RlPiB0byBleGNsdWRlIGl0LlxuICAgKi9cbiAgLyoqXG4gICAqIEl0ZXJhdGUgb3ZlciBjYWNoZWQgY29udGFjdHMuXG4gICAqXG4gICAqIEBmdW5jdGlvblxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljTWUjXG4gICAqIEBwYXJhbSB7VG9waWNNZS5Db250YWN0Q2FsbGJhY2t9IGNhbGxiYWNrIC0gQ2FsbGJhY2sgdG8gY2FsbCBmb3IgZWFjaCBjb250YWN0LlxuICAgKiBAcGFyYW0ge2NvbnRhY3RGaWx0ZXI9fSBmaWx0ZXIgLSBPcHRpb25hbGx5IGZpbHRlciBjb250YWN0czsgaW5jbHVkZSBhbGwgaWYgZmlsdGVyIGlzIGZhbHNlLWlzaCwgb3RoZXJ3aXNlXG4gICAqICAgICAgaW5jbHVkZSB0aG9zZSBmb3Igd2hpY2ggZmlsdGVyIHJldHVybnMgdHJ1ZS1pc2guXG4gICAqIEBwYXJhbSB7T2JqZWN0PX0gY29udGV4dCAtIENvbnRleHQgdG8gdXNlIGZvciBjYWxsaW5nIHRoZSBgY2FsbGJhY2tgLCBpLmUuIHRoZSB2YWx1ZSBvZiBgdGhpc2AgaW5zaWRlIHRoZSBjYWxsYmFjay5cbiAgICovXG4gIGNvbnRhY3RzKGNhbGxiYWNrLCBmaWx0ZXIsIGNvbnRleHQpIHtcbiAgICB0aGlzLl90aW5vZGUubWFwVG9waWNzKChjLCBpZHgpID0+IHtcbiAgICAgIGlmIChjLmlzQ29tbVR5cGUoKSAmJiAoIWZpbHRlciB8fCBmaWx0ZXIoYykpKSB7XG4gICAgICAgIGNhbGxiYWNrLmNhbGwoY29udGV4dCwgYywgaWR4KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYSBjb250YWN0IGZyb20gY2FjaGUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWNNZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSBjb250YWN0IHRvIGdldCwgZWl0aGVyIGEgVUlEIChmb3IgcDJwIHRvcGljcykgb3IgYSB0b3BpYyBuYW1lLlxuICAgKiBAcmV0dXJucyB7VGlub2RlLkNvbnRhY3R9IC0gQ29udGFjdCBvciBgdW5kZWZpbmVkYC5cbiAgICovXG4gIGdldENvbnRhY3QobmFtZSkge1xuICAgIHJldHVybiB0aGlzLl90aW5vZGUuY2FjaGVHZXRUb3BpYyhuYW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYWNjZXNzIG1vZGUgb2YgYSBnaXZlbiBjb250YWN0IGZyb20gY2FjaGUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWNNZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSBjb250YWN0IHRvIGdldCBhY2Nlc3MgbW9kZSBmb3IsIGVpdGhlciBhIFVJRCAoZm9yIHAycCB0b3BpY3MpXG4gICAqICAgICAgICBvciBhIHRvcGljIG5hbWU7IGlmIG1pc3NpbmcsIGFjY2VzcyBtb2RlIGZvciB0aGUgJ21lJyB0b3BpYyBpdHNlbGYuXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IC0gYWNjZXNzIG1vZGUsIHN1Y2ggYXMgYFJXUGAuXG4gICAqL1xuICBnZXRBY2Nlc3NNb2RlKG5hbWUpIHtcbiAgICBpZiAobmFtZSkge1xuICAgICAgY29uc3QgY29udCA9IHRoaXMuX3Rpbm9kZS5jYWNoZUdldFRvcGljKG5hbWUpO1xuICAgICAgcmV0dXJuIGNvbnQgPyBjb250LmFjcyA6IG51bGw7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmFjcztcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBjb250YWN0IGlzIGFyY2hpdmVkLCBpLmUuIGNvbnRhY3QucHJpdmF0ZS5hcmNoID09IHRydWUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWNNZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSBjb250YWN0IHRvIGNoZWNrIGFyY2hpdmVkIHN0YXR1cywgZWl0aGVyIGEgVUlEIChmb3IgcDJwIHRvcGljcykgb3IgYSB0b3BpYyBuYW1lLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSB0cnVlIGlmIGNvbnRhY3QgaXMgYXJjaGl2ZWQsIGZhbHNlIG90aGVyd2lzZS5cbiAgICovXG4gIGlzQXJjaGl2ZWQobmFtZSkge1xuICAgIGNvbnN0IGNvbnQgPSB0aGlzLl90aW5vZGUuY2FjaGVHZXRUb3BpYyhuYW1lKTtcbiAgICByZXR1cm4gY29udCAmJiBjb250LnByaXZhdGUgJiYgISFjb250LnByaXZhdGUuYXJjaDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAdHlwZWRlZiBUaW5vZGUuQ3JlZGVudGlhbFxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEB0eXBlIE9iamVjdFxuICAgKiBAcHJvcGVydHkge3N0cmluZ30gbWV0aCAtIHZhbGlkYXRpb24gbWV0aG9kIHN1Y2ggYXMgJ2VtYWlsJyBvciAndGVsJy5cbiAgICogQHByb3BlcnR5IHtzdHJpbmd9IHZhbCAtIGNyZWRlbnRpYWwgdmFsdWUsIGkuZS4gJ2pkb2VAZXhhbXBsZS5jb20nIG9yICcrMTcwMjU1NTEyMzQnXG4gICAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gZG9uZSAtIHRydWUgaWYgY3JlZGVudGlhbCBpcyB2YWxpZGF0ZWQuXG4gICAqL1xuICAvKipcbiAgICogR2V0IHRoZSB1c2VyJ3MgY3JlZGVudGlhbHM6IGVtYWlsLCBwaG9uZSwgZXRjLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljTWUjXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuQ3JlZGVudGlhbFtdfSAtIGFycmF5IG9mIGNyZWRlbnRpYWxzLlxuICAgKi9cbiAgZ2V0Q3JlZGVudGlhbHMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NyZWRlbnRpYWxzO1xuICB9XG59XG5cbi8qKlxuICogQGNsYXNzIFRvcGljRm5kIC0gc3BlY2lhbCBjYXNlIG9mIHtAbGluayBUaW5vZGUuVG9waWN9IGZvciBzZWFyY2hpbmcgZm9yXG4gKiBjb250YWN0cyBhbmQgZ3JvdXAgdG9waWNzLlxuICogQGV4dGVuZHMgVGlub2RlLlRvcGljXG4gKiBAbWVtYmVyb2YgVGlub2RlXG4gKlxuICogQHBhcmFtIHtUb3BpY0ZuZC5DYWxsYmFja3N9IGNhbGxiYWNrcyAtIENhbGxiYWNrcyB0byByZWNlaXZlIHZhcmlvdXMgZXZlbnRzLlxuICovXG5leHBvcnQgY2xhc3MgVG9waWNGbmQgZXh0ZW5kcyBUb3BpYyB7XG4gIC8vIExpc3Qgb2YgdXNlcnMgYW5kIHRvcGljcyB1aWQgb3IgdG9waWNfbmFtZSAtPiBDb250YWN0IG9iamVjdClcbiAgX2NvbnRhY3RzID0ge307XG5cbiAgY29uc3RydWN0b3IoY2FsbGJhY2tzKSB7XG4gICAgc3VwZXIoQ29uc3QuVE9QSUNfRk5ELCBjYWxsYmFja3MpO1xuICB9XG5cbiAgLy8gT3ZlcnJpZGUgdGhlIG9yaWdpbmFsIFRvcGljLl9wcm9jZXNzTWV0YVN1YlxuICBfcHJvY2Vzc01ldGFTdWIoc3Vicykge1xuICAgIGxldCB1cGRhdGVDb3VudCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRoaXMuX2NvbnRhY3RzKS5sZW5ndGg7XG4gICAgLy8gUmVzZXQgY29udGFjdCBsaXN0LlxuICAgIHRoaXMuX2NvbnRhY3RzID0ge307XG4gICAgZm9yIChsZXQgaWR4IGluIHN1YnMpIHtcbiAgICAgIGxldCBzdWIgPSBzdWJzW2lkeF07XG4gICAgICBjb25zdCBpbmRleEJ5ID0gc3ViLnRvcGljID8gc3ViLnRvcGljIDogc3ViLnVzZXI7XG5cbiAgICAgIHN1YiA9IG1lcmdlVG9DYWNoZSh0aGlzLl9jb250YWN0cywgaW5kZXhCeSwgc3ViKTtcbiAgICAgIHVwZGF0ZUNvdW50Kys7XG5cbiAgICAgIGlmICh0aGlzLm9uTWV0YVN1Yikge1xuICAgICAgICB0aGlzLm9uTWV0YVN1YihzdWIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh1cGRhdGVDb3VudCA+IDAgJiYgdGhpcy5vblN1YnNVcGRhdGVkKSB7XG4gICAgICB0aGlzLm9uU3Vic1VwZGF0ZWQoT2JqZWN0LmtleXModGhpcy5fY29udGFjdHMpKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUHVibGlzaGluZyB0byBUb3BpY0ZuZCBpcyBub3Qgc3VwcG9ydGVkLiB7QGxpbmsgVG9waWMjcHVibGlzaH0gaXMgb3ZlcnJpZGVuIGFuZCB0aG93cyBhbiB7RXJyb3J9IGlmIGNhbGxlZC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpY0ZuZCNcbiAgICogQHRocm93cyB7RXJyb3J9IEFsd2F5cyB0aHJvd3MgYW4gZXJyb3IuXG4gICAqL1xuICBwdWJsaXNoKCkge1xuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJQdWJsaXNoaW5nIHRvICdmbmQnIGlzIG5vdCBzdXBwb3J0ZWRcIikpO1xuICB9XG5cbiAgLyoqXG4gICAqIHNldE1ldGEgdG8gVG9waWNGbmQgcmVzZXRzIGNvbnRhY3QgbGlzdCBpbiBhZGRpdGlvbiB0byBzZW5kaW5nIHRoZSBtZXNzYWdlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljRm5kI1xuICAgKiBAcGFyYW0ge1Rpbm9kZS5TZXRQYXJhbXN9IHBhcmFtcyBwYXJhbWV0ZXJzIHRvIHVwZGF0ZS5cbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgdG8gYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgc2VydmVyIHJlc3BvbmRzIHRvIHJlcXVlc3QuXG4gICAqL1xuICBzZXRNZXRhKHBhcmFtcykge1xuICAgIHJldHVybiBPYmplY3QuZ2V0UHJvdG90eXBlT2YoVG9waWNGbmQucHJvdG90eXBlKS5zZXRNZXRhLmNhbGwodGhpcywgcGFyYW1zKS50aGVuKCgpID0+IHtcbiAgICAgIGlmIChPYmplY3Qua2V5cyh0aGlzLl9jb250YWN0cykubGVuZ3RoID4gMCkge1xuICAgICAgICB0aGlzLl9jb250YWN0cyA9IHt9O1xuICAgICAgICBpZiAodGhpcy5vblN1YnNVcGRhdGVkKSB7XG4gICAgICAgICAgdGhpcy5vblN1YnNVcGRhdGVkKFtdKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEl0ZXJhdGUgb3ZlciBmb3VuZCBjb250YWN0cy4gSWYgY2FsbGJhY2sgaXMgdW5kZWZpbmVkLCB1c2Uge0BsaW5rIHRoaXMub25NZXRhU3VifS5cbiAgICogQGZ1bmN0aW9uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWNGbmQjXG4gICAqIEBwYXJhbSB7VG9waWNGbmQuQ29udGFjdENhbGxiYWNrfSBjYWxsYmFjayAtIENhbGxiYWNrIHRvIGNhbGwgZm9yIGVhY2ggY29udGFjdC5cbiAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHQgLSBDb250ZXh0IHRvIHVzZSBmb3IgY2FsbGluZyB0aGUgYGNhbGxiYWNrYCwgaS5lLiB0aGUgdmFsdWUgb2YgYHRoaXNgIGluc2lkZSB0aGUgY2FsbGJhY2suXG4gICAqL1xuICBjb250YWN0cyhjYWxsYmFjaywgY29udGV4dCkge1xuICAgIGNvbnN0IGNiID0gKGNhbGxiYWNrIHx8IHRoaXMub25NZXRhU3ViKTtcbiAgICBpZiAoY2IpIHtcbiAgICAgIGZvciAobGV0IGlkeCBpbiB0aGlzLl9jb250YWN0cykge1xuICAgICAgICBjYi5jYWxsKGNvbnRleHQsIHRoaXMuX2NvbnRhY3RzW2lkeF0sIGlkeCwgdGhpcy5fY29udGFjdHMpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIiwiLyoqXG4gKiBAZmlsZSBVdGlsaXRpZXMgdXNlZCBpbiBtdWx0aXBsZSBwbGFjZXMuXG4gKlxuICogQGNvcHlyaWdodCAyMDE1LTIwMjIgVGlub2RlIExMQy5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgQWNjZXNzTW9kZSBmcm9tICcuL2FjY2Vzcy1tb2RlLmpzJztcbmltcG9ydCBERUxfQ0hBUiBmcm9tICcuL2NvbmZpZy5qcyc7XG5cbi8vIEF0dGVtcHQgdG8gY29udmVydCBkYXRlIGFuZCBBY2Nlc3NNb2RlIHN0cmluZ3MgdG8gb2JqZWN0cy5cbmV4cG9ydCBmdW5jdGlvbiBqc29uUGFyc2VIZWxwZXIoa2V5LCB2YWwpIHtcbiAgLy8gVHJ5IHRvIGNvbnZlcnQgc3RyaW5nIHRpbWVzdGFtcHMgd2l0aCBvcHRpb25hbCBtaWxsaXNlY29uZHMgdG8gRGF0ZSxcbiAgLy8gZS5nLiAyMDE1LTA5LTAyVDAxOjQ1OjQzWy4xMjNdWlxuICBpZiAodHlwZW9mIHZhbCA9PSAnc3RyaW5nJyAmJiB2YWwubGVuZ3RoID49IDIwICYmIHZhbC5sZW5ndGggPD0gMjQgJiYgWyd0cycsICd0b3VjaGVkJywgJ3VwZGF0ZWQnLCAnY3JlYXRlZCcsICd3aGVuJywgJ2RlbGV0ZWQnLCAnZXhwaXJlcyddLmluY2x1ZGVzKGtleSkpIHtcblxuICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSh2YWwpO1xuICAgIGlmICghaXNOYU4oZGF0ZSkpIHtcbiAgICAgIHJldHVybiBkYXRlO1xuICAgIH1cbiAgfSBlbHNlIGlmIChrZXkgPT09ICdhY3MnICYmIHR5cGVvZiB2YWwgPT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIG5ldyBBY2Nlc3NNb2RlKHZhbCk7XG4gIH1cbiAgcmV0dXJuIHZhbDtcbn1cblxuLy8gQ2hlY2tzIGlmIFVSTCBpcyBhIHJlbGF0aXZlIHVybCwgaS5lLiBoYXMgbm8gJ3NjaGVtZTovLycsIGluY2x1ZGluZyB0aGUgY2FzZSBvZiBtaXNzaW5nIHNjaGVtZSAnLy8nLlxuLy8gVGhlIHNjaGVtZSBpcyBleHBlY3RlZCB0byBiZSBSRkMtY29tcGxpYW50LCBlLmcuIFthLXpdW2EtejAtOSsuLV0qXG4vLyBleGFtcGxlLmh0bWwgLSBva1xuLy8gaHR0cHM6ZXhhbXBsZS5jb20gLSBub3Qgb2suXG4vLyBodHRwOi9leGFtcGxlLmNvbSAtIG5vdCBvay5cbi8vICcg4oayIGh0dHBzOi8vZXhhbXBsZS5jb20nIC0gbm90IG9rLiAo4oayIG1lYW5zIGNhcnJpYWdlIHJldHVybilcbmV4cG9ydCBmdW5jdGlvbiBpc1VybFJlbGF0aXZlKHVybCkge1xuICByZXR1cm4gdXJsICYmICEvXlxccyooW2Etel1bYS16MC05Ky4tXSo6fFxcL1xcLykvaW0udGVzdCh1cmwpO1xufVxuXG5mdW5jdGlvbiBpc1ZhbGlkRGF0ZShkKSB7XG4gIHJldHVybiAoZCBpbnN0YW5jZW9mIERhdGUpICYmICFpc05hTihkKSAmJiAoZC5nZXRUaW1lKCkgIT0gMCk7XG59XG5cbi8vIFJGQzMzMzkgZm9ybWF0ZXIgb2YgRGF0ZVxuZXhwb3J0IGZ1bmN0aW9uIHJmYzMzMzlEYXRlU3RyaW5nKGQpIHtcbiAgaWYgKCFpc1ZhbGlkRGF0ZShkKSkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBjb25zdCBwYWQgPSBmdW5jdGlvbih2YWwsIHNwKSB7XG4gICAgc3AgPSBzcCB8fCAyO1xuICAgIHJldHVybiAnMCcucmVwZWF0KHNwIC0gKCcnICsgdmFsKS5sZW5ndGgpICsgdmFsO1xuICB9O1xuXG4gIGNvbnN0IG1pbGxpcyA9IGQuZ2V0VVRDTWlsbGlzZWNvbmRzKCk7XG4gIHJldHVybiBkLmdldFVUQ0Z1bGxZZWFyKCkgKyAnLScgKyBwYWQoZC5nZXRVVENNb250aCgpICsgMSkgKyAnLScgKyBwYWQoZC5nZXRVVENEYXRlKCkpICtcbiAgICAnVCcgKyBwYWQoZC5nZXRVVENIb3VycygpKSArICc6JyArIHBhZChkLmdldFVUQ01pbnV0ZXMoKSkgKyAnOicgKyBwYWQoZC5nZXRVVENTZWNvbmRzKCkpICtcbiAgICAobWlsbGlzID8gJy4nICsgcGFkKG1pbGxpcywgMykgOiAnJykgKyAnWic7XG59XG5cbi8vIFJlY3Vyc2l2ZWx5IG1lcmdlIHNyYydzIG93biBwcm9wZXJ0aWVzIHRvIGRzdC5cbi8vIElnbm9yZSBwcm9wZXJ0aWVzIHdoZXJlIGlnbm9yZVtwcm9wZXJ0eV0gaXMgdHJ1ZS5cbi8vIEFycmF5IGFuZCBEYXRlIG9iamVjdHMgYXJlIHNoYWxsb3ctY29waWVkLlxuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlT2JqKGRzdCwgc3JjLCBpZ25vcmUpIHtcbiAgaWYgKHR5cGVvZiBzcmMgIT0gJ29iamVjdCcpIHtcbiAgICBpZiAoc3JjID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBkc3Q7XG4gICAgfVxuICAgIGlmIChzcmMgPT09IERFTF9DSEFSKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICByZXR1cm4gc3JjO1xuICB9XG4gIC8vIEpTIGlzIGNyYXp5OiB0eXBlb2YgbnVsbCBpcyAnb2JqZWN0Jy5cbiAgaWYgKHNyYyA9PT0gbnVsbCkge1xuICAgIHJldHVybiBzcmM7XG4gIH1cblxuICAvLyBIYW5kbGUgRGF0ZVxuICBpZiAoc3JjIGluc3RhbmNlb2YgRGF0ZSAmJiAhaXNOYU4oc3JjKSkge1xuICAgIHJldHVybiAoIWRzdCB8fCAhKGRzdCBpbnN0YW5jZW9mIERhdGUpIHx8IGlzTmFOKGRzdCkgfHwgZHN0IDwgc3JjKSA/IHNyYyA6IGRzdDtcbiAgfVxuXG4gIC8vIEFjY2VzcyBtb2RlXG4gIGlmIChzcmMgaW5zdGFuY2VvZiBBY2Nlc3NNb2RlKSB7XG4gICAgcmV0dXJuIG5ldyBBY2Nlc3NNb2RlKHNyYyk7XG4gIH1cblxuICAvLyBIYW5kbGUgQXJyYXlcbiAgaWYgKHNyYyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgcmV0dXJuIHNyYztcbiAgfVxuXG4gIGlmICghZHN0IHx8IGRzdCA9PT0gREVMX0NIQVIpIHtcbiAgICBkc3QgPSBzcmMuY29uc3RydWN0b3IoKTtcbiAgfVxuXG4gIGZvciAobGV0IHByb3AgaW4gc3JjKSB7XG4gICAgaWYgKHNyYy5oYXNPd25Qcm9wZXJ0eShwcm9wKSAmJiAoIWlnbm9yZSB8fCAhaWdub3JlW3Byb3BdKSAmJiAocHJvcCAhPSAnX25vRm9yd2FyZGluZycpKSB7XG4gICAgICB0cnkge1xuICAgICAgICBkc3RbcHJvcF0gPSBtZXJnZU9iaihkc3RbcHJvcF0sIHNyY1twcm9wXSk7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgLy8gRklYTUU6IHByb2JhYmx5IG5lZWQgdG8gbG9nIHNvbWV0aGluZyBoZXJlLlxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gZHN0O1xufVxuXG4vLyBVcGRhdGUgb2JqZWN0IHN0b3JlZCBpbiBhIGNhY2hlLiBSZXR1cm5zIHVwZGF0ZWQgdmFsdWUuXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VUb0NhY2hlKGNhY2hlLCBrZXksIG5ld3ZhbCwgaWdub3JlKSB7XG4gIGNhY2hlW2tleV0gPSBtZXJnZU9iaihjYWNoZVtrZXldLCBuZXd2YWwsIGlnbm9yZSk7XG4gIHJldHVybiBjYWNoZVtrZXldO1xufVxuXG4vLyBTdHJpcHMgYWxsIHZhbHVlcyBmcm9tIGFuIG9iamVjdCBvZiB0aGV5IGV2YWx1YXRlIHRvIGZhbHNlIG9yIGlmIHRoZWlyIG5hbWUgc3RhcnRzIHdpdGggJ18nLlxuLy8gVXNlZCBvbiBhbGwgb3V0Z29pbmcgb2JqZWN0IGJlZm9yZSBzZXJpYWxpemF0aW9uIHRvIHN0cmluZy5cbmV4cG9ydCBmdW5jdGlvbiBzaW1wbGlmeShvYmopIHtcbiAgT2JqZWN0LmtleXMob2JqKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICBpZiAoa2V5WzBdID09ICdfJykge1xuICAgICAgLy8gU3RyaXAgZmllbGRzIGxpa2UgXCJvYmouX2tleVwiLlxuICAgICAgZGVsZXRlIG9ialtrZXldO1xuICAgIH0gZWxzZSBpZiAoIW9ialtrZXldKSB7XG4gICAgICAvLyBTdHJpcCBmaWVsZHMgd2hpY2ggZXZhbHVhdGUgdG8gZmFsc2UuXG4gICAgICBkZWxldGUgb2JqW2tleV07XG4gICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KG9ialtrZXldKSAmJiBvYmpba2V5XS5sZW5ndGggPT0gMCkge1xuICAgICAgLy8gU3RyaXAgZW1wdHkgYXJyYXlzLlxuICAgICAgZGVsZXRlIG9ialtrZXldO1xuICAgIH0gZWxzZSBpZiAoIW9ialtrZXldKSB7XG4gICAgICAvLyBTdHJpcCBmaWVsZHMgd2hpY2ggZXZhbHVhdGUgdG8gZmFsc2UuXG4gICAgICBkZWxldGUgb2JqW2tleV07XG4gICAgfSBlbHNlIGlmIChvYmpba2V5XSBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgIC8vIFN0cmlwIGludmFsaWQgb3IgemVybyBkYXRlLlxuICAgICAgaWYgKCFpc1ZhbGlkRGF0ZShvYmpba2V5XSkpIHtcbiAgICAgICAgZGVsZXRlIG9ialtrZXldO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodHlwZW9mIG9ialtrZXldID09ICdvYmplY3QnKSB7XG4gICAgICBzaW1wbGlmeShvYmpba2V5XSk7XG4gICAgICAvLyBTdHJpcCBlbXB0eSBvYmplY3RzLlxuICAgICAgaWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKG9ialtrZXldKS5sZW5ndGggPT0gMCkge1xuICAgICAgICBkZWxldGUgb2JqW2tleV07XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIG9iajtcbn07XG5cblxuLy8gVHJpbSB3aGl0ZXNwYWNlLCBzdHJpcCBlbXB0eSBhbmQgZHVwbGljYXRlIGVsZW1lbnRzIGVsZW1lbnRzLlxuLy8gSWYgdGhlIHJlc3VsdCBpcyBhbiBlbXB0eSBhcnJheSwgYWRkIGEgc2luZ2xlIGVsZW1lbnQgXCJcXHUyNDIxXCIgKFVuaWNvZGUgRGVsIGNoYXJhY3RlcikuXG5leHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplQXJyYXkoYXJyKSB7XG4gIGxldCBvdXQgPSBbXTtcbiAgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkge1xuICAgIC8vIFRyaW0sIHRocm93IGF3YXkgdmVyeSBzaG9ydCBhbmQgZW1wdHkgdGFncy5cbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IGFyci5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGxldCB0ID0gYXJyW2ldO1xuICAgICAgaWYgKHQpIHtcbiAgICAgICAgdCA9IHQudHJpbSgpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGlmICh0Lmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICBvdXQucHVzaCh0KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBvdXQuc29ydCgpLmZpbHRlcihmdW5jdGlvbihpdGVtLCBwb3MsIGFyeSkge1xuICAgICAgcmV0dXJuICFwb3MgfHwgaXRlbSAhPSBhcnlbcG9zIC0gMV07XG4gICAgfSk7XG4gIH1cbiAgaWYgKG91dC5sZW5ndGggPT0gMCkge1xuICAgIC8vIEFkZCBzaW5nbGUgdGFnIHdpdGggYSBVbmljb2RlIERlbCBjaGFyYWN0ZXIsIG90aGVyd2lzZSBhbiBhbXB0eSBhcnJheVxuICAgIC8vIGlzIGFtYmlndW9zLiBUaGUgRGVsIHRhZyB3aWxsIGJlIHN0cmlwcGVkIGJ5IHRoZSBzZXJ2ZXIuXG4gICAgb3V0LnB1c2goREVMX0NIQVIpO1xuICB9XG4gIHJldHVybiBvdXQ7XG59XG4iLCJtb2R1bGUuZXhwb3J0cz17XCJ2ZXJzaW9uXCI6IFwiMC4xOS4wLWJldGExXCJ9XG4iXX0=

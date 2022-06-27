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
exports.VERSION = exports.USER_NEW = exports.TOPIC_SYS = exports.TOPIC_P2P = exports.TOPIC_NEW_CHAN = exports.TOPIC_NEW = exports.TOPIC_ME = exports.TOPIC_GRP = exports.TOPIC_FND = exports.TOPIC_CHAN = exports.RECV_TIMEOUT = exports.PROTOCOL_VERSION = exports.MESSAGE_STATUS_TO_ME = exports.MESSAGE_STATUS_SENT = exports.MESSAGE_STATUS_SENDING = exports.MESSAGE_STATUS_RECEIVED = exports.MESSAGE_STATUS_READ = exports.MESSAGE_STATUS_QUEUED = exports.MESSAGE_STATUS_NONE = exports.MESSAGE_STATUS_FAILED = exports.MESSAGE_STATUS_DEL_RANGE = exports.LOCAL_SEQID = exports.LIBRARY = exports.EXPIRE_PROMISES_TIMEOUT = exports.EXPIRE_PROMISES_PERIOD = exports.DEL_CHAR = exports.DEFAULT_MESSAGES_PAGE = void 0;

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
const RECV_TIMEOUT = 100;
exports.RECV_TIMEOUT = RECV_TIMEOUT;
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
const ALLOWED_ENT_FIELDS = ['act', 'height', 'duration', 'incoming', 'mime', 'name', 'preview', 'ref', 'size', 'state', 'url', 'val', 'width'];
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
  },
  VC: {
    name: 'div',
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

Drafty.videoCall = function () {
  const content = {
    txt: ' ',
    fmt: [{
      at: 0,
      len: 1,
      key: 0
    }],
    ent: [{
      tp: 'VC'
    }]
  };
  return content;
};

Drafty.updateVideoEnt = function (content, params) {
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
 * @version 0.20
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

var _metaBuilder = _interopRequireDefault(require("./meta-builder.js"));

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

      this._db.initDatabase().then(_ => {
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
      }).then(_ => {
        return this._db.mapUsers(data => {
          _classPrivateMethodGet(this, _cachePut, _cachePut2).call(this, 'user', data.uid, (0, _utils.mergeObj)({}, data.public));
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
    let promise = this.account(Const.USER_NEW, scheme, secret, login, params);

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

  oobNotification(data) {
    switch (data.what) {
      case 'msg':
        if (!data || !data.seq || data.seq < 1 || !data.topic) {
          break;
        }

        if (!this.isConnected()) {
          break;
        }

        const topic = _classPrivateMethodGet(this, _cacheGet, _cacheGet2).call(this, 'topic', data.topic);

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

          if (data.xfrom && !_classPrivateMethodGet(this, _cacheGet, _cacheGet2).call(this, 'user', data.xfrom)) {
            this.getMeta(data.xfrom, new _metaBuilder.default().withDesc().build()).catch(err => {
              this.logger("Failed to get the name of a new sender", err);
            });
          }

          topic.subscribe(null).then(_ => {
            return topic.getMeta(new _metaBuilder.default(topic).withLaterData(24).withLaterDel(24).build());
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
        let mode = {
          given: data.modeGiven,
          want: data.modeWant
        };
        let acs = new _accessMode.default(mode);
        let pres = !acs.mode || acs.mode == _accessMode.default._NONE ? {
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
    const pkt = _classPrivateMethodGet(this, _initPacket, _initPacket2).call(this, 'get', topic);

    pkt.get = (0, _utils.mergeObj)(pkt.get, params);
    return _classPrivateMethodGet(this, _send, _send2).call(this, pkt, pkt.get.id);
  }

  setMeta(topic, params) {
    const pkt = _classPrivateMethodGet(this, _initPacket, _initPacket2).call(this, 'set', topic);

    const what = [];

    if (params) {
      ['desc', 'sub', 'tags', 'cred', 'ephemeral'].forEach(function (key) {
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

  videoCall(topicName, seq, evt, payload) {
    const pkt = _classPrivateMethodGet(this, _initPacket, _initPacket2).call(this, 'note', topicName);

    pkt.note.seq = seq;
    pkt.note.what = 'call';
    pkt.note.event = evt;
    pkt.note.payload = payload;

    _classPrivateMethodGet(this, _send, _send2).call(this, pkt, pkt.note.id);
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
          'tags': [],
          'ephemeral': {}
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

},{"./access-mode.js":1,"./config.js":3,"./connection.js":4,"./db.js":5,"./drafty.js":6,"./large-file.js":7,"./meta-builder.js":8,"./topic.js":10,"./utils.js":11}],10:[function(require,module,exports){
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
    this._recvNotificationTimer = null;
    this._tags = [];
    this._credentials = [];
    this._messageVersions = {};
    this._messages = new _cbuffer.default((a, b) => {
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
    clearTimeout(this._delayedLeaveTimer);
    this._delayedLeaveTimer = null;

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

  videoCall(evt, seq, payload) {
    if (!this._attached && !['ringing', 'hang-up'].includes(evt)) {
      return;
    }

    return this._tinode.videoCall(this.name, seq, evt, payload);
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

  messageVersions(message, callback, context) {
    if (!callback) {
      return;
    }

    const origSeq = this._isReplacementMsg(message) ? parseInt(message.head.replace.split(':')[1]) : message.seq;
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
          if (this._isReplacementMsg(msg)) {
            return;
          }

          msgs.push({
            data: this._getLatestMsgVersion(msg),
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

  _isReplacementMsg(pub) {
    return pub.head && pub.head.replace;
  }

  _maybeUpdateMessageVersionsCache(msg) {
    if (!this._isReplacementMsg(msg)) {
      return;
    }

    const targetSeq = parseInt(msg.head.replace.split(':')[1]);

    if (targetSeq > msg.seq) {
      return false;
    }

    let versions = this._messageVersions[targetSeq] || new _cbuffer.default((a, b) => {
      return a.seq - b.seq;
    }, true);
    versions.put(msg);
    this._messageVersions[targetSeq] = versions;
  }

  _getLatestMsgVersion(msg) {
    const versions = this._messageVersions[msg.seq];
    return versions ? versions.getLast() : msg;
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
      }, Const.RECV_TIMEOUT);
    }

    if (data.seq < this._minSeq || this._minSeq == 0) {
      this._minSeq = data.seq;
    }

    const outgoing = !this.isChannelType() && !data.from || this._tinode.isMe(data.from);

    if (data.head && data.head.webrtc && data.head.mime == _drafty.default.getContentType() && data.content) {
      data.content = _drafty.default.updateVideoEnt(data.content, {
        state: data.head.webrtc,
        duration: data.head['webrtc-duration'],
        incoming: !outgoing
      });
    }

    if (!data._noForwarding) {
      this._messages.put(data);

      this._tinode._db.addMessage(data);

      this._maybeUpdateMessageVersionsCache(data);

      this._updateDeletedRanges();
    }

    if (this.onData) {
      this.onData(data);
    }

    const what = outgoing ? 'read' : 'msg';

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

        this._maybeUpdateMessageVersionsCache(data);
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
module.exports={"version": "0.20.0-beta2"}

},{}]},{},[9])(9)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYWNjZXNzLW1vZGUuanMiLCJzcmMvY2J1ZmZlci5qcyIsInNyYy9jb25maWcuanMiLCJzcmMvY29ubmVjdGlvbi5qcyIsInNyYy9kYi5qcyIsInNyYy9kcmFmdHkuanMiLCJzcmMvbGFyZ2UtZmlsZS5qcyIsInNyYy9tZXRhLWJ1aWxkZXIuanMiLCJzcmMvdGlub2RlLmpzIiwic3JjL3RvcGljLmpzIiwic3JjL3V0aWxzLmpzIiwidmVyc2lvbi5qc29uIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDS0E7Ozs7Ozs7Ozs7O0FBY2UsTUFBTSxVQUFOLENBQWlCO0VBQzlCLFdBQVcsQ0FBQyxHQUFELEVBQU07SUFDZixJQUFJLEdBQUosRUFBUztNQUNQLEtBQUssS0FBTCxHQUFhLE9BQU8sR0FBRyxDQUFDLEtBQVgsSUFBb0IsUUFBcEIsR0FBK0IsR0FBRyxDQUFDLEtBQW5DLEdBQTJDLFVBQVUsQ0FBQyxNQUFYLENBQWtCLEdBQUcsQ0FBQyxLQUF0QixDQUF4RDtNQUNBLEtBQUssSUFBTCxHQUFZLE9BQU8sR0FBRyxDQUFDLElBQVgsSUFBbUIsUUFBbkIsR0FBOEIsR0FBRyxDQUFDLElBQWxDLEdBQXlDLFVBQVUsQ0FBQyxNQUFYLENBQWtCLEdBQUcsQ0FBQyxJQUF0QixDQUFyRDtNQUNBLEtBQUssSUFBTCxHQUFZLEdBQUcsQ0FBQyxJQUFKLEdBQVksT0FBTyxHQUFHLENBQUMsSUFBWCxJQUFtQixRQUFuQixHQUE4QixHQUFHLENBQUMsSUFBbEMsR0FBeUMsVUFBVSxDQUFDLE1BQVgsQ0FBa0IsR0FBRyxDQUFDLElBQXRCLENBQXJELEdBQ1QsS0FBSyxLQUFMLEdBQWEsS0FBSyxJQURyQjtJQUVEO0VBQ0Y7O0VBaUJZLE9BQU4sTUFBTSxDQUFDLEdBQUQsRUFBTTtJQUNqQixJQUFJLENBQUMsR0FBTCxFQUFVO01BQ1IsT0FBTyxJQUFQO0lBQ0QsQ0FGRCxNQUVPLElB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QyxJQUFKLENBQVMsZUFBVDtFQUNEOztFQUNELE9BQU8sR0FBUDtBQUNEOzs7QUMxS0Q7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8qKlxuICogQGZpbGUgQWNjZXNzIGNvbnRyb2wgbW9kZWwuXG4gKlxuICogQGNvcHlyaWdodCAyMDE1LTIwMjIgVGlub2RlIExMQy5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG4vLyBOT1RFIFRPIERFVkVMT1BFUlM6XG4vLyBMb2NhbGl6YWJsZSBzdHJpbmdzIHNob3VsZCBiZSBkb3VibGUgcXVvdGVkIFwi0YHRgtGA0L7QutCwINC90LAg0LTRgNGD0LPQvtC8INGP0LfRi9C60LVcIixcbi8vIG5vbi1sb2NhbGl6YWJsZSBzdHJpbmdzIHNob3VsZCBiZSBzaW5nbGUgcXVvdGVkICdub24tbG9jYWxpemVkJy5cblxuLyoqXG4gKiBIZWxwZXIgY2xhc3MgZm9yIGhhbmRsaW5nIGFjY2VzcyBtb2RlLlxuICpcbiAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gKiBAbWVtYmVyb2YgVGlub2RlXG4gKlxuICogQHBhcmFtIHtBY2Nlc3NNb2RlfE9iamVjdD19IGFjcyAtIEFjY2Vzc01vZGUgdG8gY29weSBvciBhY2Nlc3MgbW9kZSBvYmplY3QgcmVjZWl2ZWQgZnJvbSB0aGUgc2VydmVyLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBY2Nlc3NNb2RlIHtcbiAgY29uc3RydWN0b3IoYWNzKSB7XG4gICAgaWYgKGFjcykge1xuICAgICAgdGhpcy5naXZlbiA9IHR5cGVvZiBhY3MuZ2l2ZW4gPT0gJ251bWJlcicgPyBhY3MuZ2l2ZW4gOiBBY2Nlc3NNb2RlLmRlY29kZShhY3MuZ2l2ZW4pO1xuICAgICAgdGhpcy53YW50ID0gdHlwZW9mIGFjcy53YW50ID09ICdudW1iZXInID8gYWNzLndhbnQgOiBBY2Nlc3NNb2RlLmRlY29kZShhY3Mud2FudCk7XG4gICAgICB0aGlzLm1vZGUgPSBhY3MubW9kZSA/ICh0eXBlb2YgYWNzLm1vZGUgPT0gJ251bWJlcicgPyBhY3MubW9kZSA6IEFjY2Vzc01vZGUuZGVjb2RlKGFjcy5tb2RlKSkgOlxuICAgICAgICAodGhpcy5naXZlbiAmIHRoaXMud2FudCk7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljICNjaGVja0ZsYWcodmFsLCBzaWRlLCBmbGFnKSB7XG4gICAgc2lkZSA9IHNpZGUgfHwgJ21vZGUnO1xuICAgIGlmIChbJ2dpdmVuJywgJ3dhbnQnLCAnbW9kZSddLmluY2x1ZGVzKHNpZGUpKSB7XG4gICAgICByZXR1cm4gKCh2YWxbc2lkZV0gJiBmbGFnKSAhPSAwKTtcbiAgICB9XG4gICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIEFjY2Vzc01vZGUgY29tcG9uZW50ICcke3NpZGV9J2ApO1xuICB9XG4gIC8qKlxuICAgKiBQYXJzZSBzdHJpbmcgaW50byBhbiBhY2Nlc3MgbW9kZSB2YWx1ZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmcgfCBOdW1iZXJ9IG1vZGUgLSBlaXRoZXIgYSBTdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIGFjY2VzcyBtb2RlIHRvIHBhcnNlIG9yIGEgc2V0IG9mIGJpdHMgdG8gYXNzaWduLlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSAtIEFjY2VzcyBtb2RlIGFzIGEgbnVtZXJpYyB2YWx1ZS5cbiAgICovXG4gIHN0YXRpYyBkZWNvZGUoc3RyKSB7XG4gICAgaWYgKCFzdHIpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHN0ciA9PSAnbnVtYmVyJykge1xuICAgICAgcmV0dXJuIHN0ciAmIEFjY2Vzc01vZGUuX0JJVE1BU0s7XG4gICAgfSBlbHNlIGlmIChzdHIgPT09ICdOJyB8fCBzdHIgPT09ICduJykge1xuICAgICAgcmV0dXJuIEFjY2Vzc01vZGUuX05PTkU7XG4gICAgfVxuXG4gICAgY29uc3QgYml0bWFzayA9IHtcbiAgICAgICdKJzogQWNjZXNzTW9kZS5fSk9JTixcbiAgICAgICdSJzogQWNjZXNzTW9kZS5fUkVBRCxcbiAgICAgICdXJzogQWNjZXNzTW9kZS5fV1JJVEUsXG4gICAgICAnUCc6IEFjY2Vzc01vZGUuX1BSRVMsXG4gICAgICAnQSc6IEFjY2Vzc01vZGUuX0FQUFJPVkUsXG4gICAgICAnUyc6IEFjY2Vzc01vZGUuX1NIQVJFLFxuICAgICAgJ0QnOiBBY2Nlc3NNb2RlLl9ERUxFVEUsXG4gICAgICAnTyc6IEFjY2Vzc01vZGUuX09XTkVSXG4gICAgfTtcblxuICAgIGxldCBtMCA9IEFjY2Vzc01vZGUuX05PTkU7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgYml0ID0gYml0bWFza1tzdHIuY2hhckF0KGkpLnRvVXBwZXJDYXNlKCldO1xuICAgICAgaWYgKCFiaXQpIHtcbiAgICAgICAgLy8gVW5yZWNvZ25pemVkIGJpdCwgc2tpcC5cbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBtMCB8PSBiaXQ7XG4gICAgfVxuICAgIHJldHVybiBtMDtcbiAgfVxuICAvKipcbiAgICogQ29udmVydCBudW1lcmljIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBhY2Nlc3MgbW9kZSBpbnRvIGEgc3RyaW5nLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gdmFsIC0gYWNjZXNzIG1vZGUgdmFsdWUgdG8gY29udmVydCB0byBhIHN0cmluZy5cbiAgICogQHJldHVybnMge3N0cmluZ30gLSBBY2Nlc3MgbW9kZSBhcyBhIHN0cmluZy5cbiAgICovXG4gIHN0YXRpYyBlbmNvZGUodmFsKSB7XG4gICAgaWYgKHZhbCA9PT0gbnVsbCB8fCB2YWwgPT09IEFjY2Vzc01vZGUuX0lOVkFMSUQpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0gZWxzZSBpZiAodmFsID09PSBBY2Nlc3NNb2RlLl9OT05FKSB7XG4gICAgICByZXR1cm4gJ04nO1xuICAgIH1cblxuICAgIGNvbnN0IGJpdG1hc2sgPSBbJ0onLCAnUicsICdXJywgJ1AnLCAnQScsICdTJywgJ0QnLCAnTyddO1xuICAgIGxldCByZXMgPSAnJztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJpdG1hc2subGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICgodmFsICYgKDEgPDwgaSkpICE9IDApIHtcbiAgICAgICAgcmVzID0gcmVzICsgYml0bWFza1tpXTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbiAgfVxuICAvKipcbiAgICogVXBkYXRlIG51bWVyaWMgcmVwcmVzZW50YXRpb24gb2YgYWNjZXNzIG1vZGUgd2l0aCB0aGUgbmV3IHZhbHVlLiBUaGUgdmFsdWVcbiAgICogaXMgb25lIG9mIHRoZSBmb2xsb3dpbmc6XG4gICAqICAtIGEgc3RyaW5nIHN0YXJ0aW5nIHdpdGggPGNvZGU+JysnPC9jb2RlPiBvciA8Y29kZT4nLSc8L2NvZGU+IHRoZW4gdGhlIGJpdHMgdG8gYWRkIG9yIHJlbW92ZSwgZS5nLiA8Y29kZT4nK1ItVyc8L2NvZGU+IG9yIDxjb2RlPictUFMnPC9jb2RlPi5cbiAgICogIC0gYSBuZXcgdmFsdWUgb2YgYWNjZXNzIG1vZGVcbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IHZhbCAtIGFjY2VzcyBtb2RlIHZhbHVlIHRvIHVwZGF0ZS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHVwZCAtIHVwZGF0ZSB0byBhcHBseSB0byB2YWwuXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IC0gdXBkYXRlZCBhY2Nlc3MgbW9kZS5cbiAgICovXG4gIHN0YXRpYyB1cGRhdGUodmFsLCB1cGQpIHtcbiAgICBpZiAoIXVwZCB8fCB0eXBlb2YgdXBkICE9ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gdmFsO1xuICAgIH1cblxuICAgIGxldCBhY3Rpb24gPSB1cGQuY2hhckF0KDApO1xuICAgIGlmIChhY3Rpb24gPT0gJysnIHx8IGFjdGlvbiA9PSAnLScpIHtcbiAgICAgIGxldCB2YWwwID0gdmFsO1xuICAgICAgLy8gU3BsaXQgZGVsdGEtc3RyaW5nIGxpa2UgJytBQkMtREVGK1onIGludG8gYW4gYXJyYXkgb2YgcGFydHMgaW5jbHVkaW5nICsgYW5kIC0uXG4gICAgICBjb25zdCBwYXJ0cyA9IHVwZC5zcGxpdCgvKFstK10pLyk7XG4gICAgICAvLyBTdGFydGluZyBpdGVyYXRpb24gZnJvbSAxIGJlY2F1c2UgU3RyaW5nLnNwbGl0KCkgY3JlYXRlcyBhbiBhcnJheSB3aXRoIHRoZSBmaXJzdCBlbXB0eSBlbGVtZW50LlxuICAgICAgLy8gSXRlcmF0aW5nIGJ5IDIgYmVjYXVzZSB3ZSBwYXJzZSBwYWlycyArLy0gdGhlbiBkYXRhLlxuICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBwYXJ0cy5sZW5ndGggLSAxOyBpICs9IDIpIHtcbiAgICAgICAgYWN0aW9uID0gcGFydHNbaV07XG4gICAgICAgIGNvbnN0IG0wID0gQWNjZXNzTW9kZS5kZWNvZGUocGFydHNbaSArIDFdKTtcbiAgICAgICAgaWYgKG0wID09IEFjY2Vzc01vZGUuX0lOVkFMSUQpIHtcbiAgICAgICAgICByZXR1cm4gdmFsO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtMCA9PSBudWxsKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFjdGlvbiA9PT0gJysnKSB7XG4gICAgICAgICAgdmFsMCB8PSBtMDtcbiAgICAgICAgfSBlbHNlIGlmIChhY3Rpb24gPT09ICctJykge1xuICAgICAgICAgIHZhbDAgJj0gfm0wO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB2YWwgPSB2YWwwO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBUaGUgc3RyaW5nIGlzIGFuIGV4cGxpY2l0IG5ldyB2YWx1ZSAnQUJDJyByYXRoZXIgdGhhbiBkZWx0YS5cbiAgICAgIGNvbnN0IHZhbDAgPSBBY2Nlc3NNb2RlLmRlY29kZSh1cGQpO1xuICAgICAgaWYgKHZhbDAgIT0gQWNjZXNzTW9kZS5fSU5WQUxJRCkge1xuICAgICAgICB2YWwgPSB2YWwwO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB2YWw7XG4gIH1cbiAgLyoqXG4gICAqIEJpdHMgcHJlc2VudCBpbiBhMSBidXQgbWlzc2luZyBpbiBhMi5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyIHwgc3RyaW5nfSBhMSAtIGFjY2VzcyBtb2RlIHRvIHN1YnRyYWN0IGZyb20uXG4gICAqIEBwYXJhbSB7bnVtYmVyIHwgc3RyaW5nfSBhMiAtIGFjY2VzcyBtb2RlIHRvIHN1YnRyYWN0LlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSBhY2Nlc3MgbW9kZSB3aXRoIGJpdHMgcHJlc2VudCBpbiA8Y29kZT5hMTwvY29kZT4gYnV0IG1pc3NpbmcgaW4gPGNvZGU+YTI8L2NvZGU+LlxuICAgKi9cbiAgc3RhdGljIGRpZmYoYTEsIGEyKSB7XG4gICAgYTEgPSBBY2Nlc3NNb2RlLmRlY29kZShhMSk7XG4gICAgYTIgPSBBY2Nlc3NNb2RlLmRlY29kZShhMik7XG5cbiAgICBpZiAoYTEgPT0gQWNjZXNzTW9kZS5fSU5WQUxJRCB8fCBhMiA9PSBBY2Nlc3NNb2RlLl9JTlZBTElEKSB7XG4gICAgICByZXR1cm4gQWNjZXNzTW9kZS5fSU5WQUxJRDtcbiAgICB9XG4gICAgcmV0dXJuIGExICYgfmEyO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogQ3VzdG9tIGZvcm1hdHRlclxuICAgKi9cbiAgdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuICd7XCJtb2RlXCI6IFwiJyArIEFjY2Vzc01vZGUuZW5jb2RlKHRoaXMubW9kZSkgK1xuICAgICAgJ1wiLCBcImdpdmVuXCI6IFwiJyArIEFjY2Vzc01vZGUuZW5jb2RlKHRoaXMuZ2l2ZW4pICtcbiAgICAgICdcIiwgXCJ3YW50XCI6IFwiJyArIEFjY2Vzc01vZGUuZW5jb2RlKHRoaXMud2FudCkgKyAnXCJ9JztcbiAgfVxuICAvKipcbiAgICogQWNjZXNzTW9kZSBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyB0b3BpYyBhY2Nlc3MgbW9kZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAY2xhc3MgQWNjZXNzTW9kZVxuICAgKi9cbiAgLyoqXG4gICAqIENvbnZlcnRzIG51bWVyaWMgdmFsdWVzIHRvIHN0cmluZ3MuXG4gICAqL1xuICBqc29uSGVscGVyKCkge1xuICAgIHJldHVybiB7XG4gICAgICBtb2RlOiBBY2Nlc3NNb2RlLmVuY29kZSh0aGlzLm1vZGUpLFxuICAgICAgZ2l2ZW46IEFjY2Vzc01vZGUuZW5jb2RlKHRoaXMuZ2l2ZW4pLFxuICAgICAgd2FudDogQWNjZXNzTW9kZS5lbmNvZGUodGhpcy53YW50KVxuICAgIH07XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBBc3NpZ24gdmFsdWUgdG8gJ21vZGUnLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmcgfCBOdW1iZXJ9IG0gLSBlaXRoZXIgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIGFjY2VzcyBtb2RlIG9yIGEgc2V0IG9mIGJpdHMuXG4gICAqIEByZXR1cm5zIHtBY2Nlc3NNb2RlfSAtIDxjb2RlPnRoaXM8L2NvZGU+IEFjY2Vzc01vZGUuXG4gICAqL1xuICBzZXRNb2RlKG0pIHtcbiAgICB0aGlzLm1vZGUgPSBBY2Nlc3NNb2RlLmRlY29kZShtKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICAvKipcbiAgICogQWNjZXNzTW9kZSBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyB0b3BpYyBhY2Nlc3MgbW9kZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAY2xhc3MgQWNjZXNzTW9kZVxuICAgKi9cbiAgLyoqXG4gICAqIFVwZGF0ZSA8Y29kZT5tb2RlPC9jb2RlPiB2YWx1ZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1IC0gc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBjaGFuZ2VzIHRvIGFwcGx5IHRvIGFjY2VzcyBtb2RlLlxuICAgKiBAcmV0dXJucyB7QWNjZXNzTW9kZX0gLSA8Y29kZT50aGlzPC9jb2RlPiBBY2Nlc3NNb2RlLlxuICAgKi9cbiAgdXBkYXRlTW9kZSh1KSB7XG4gICAgdGhpcy5tb2RlID0gQWNjZXNzTW9kZS51cGRhdGUodGhpcy5tb2RlLCB1KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICAvKipcbiAgICogQWNjZXNzTW9kZSBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyB0b3BpYyBhY2Nlc3MgbW9kZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAY2xhc3MgQWNjZXNzTW9kZVxuICAgKi9cbiAgLyoqXG4gICAqIEdldCA8Y29kZT5tb2RlPC9jb2RlPiB2YWx1ZSBhcyBhIHN0cmluZy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IC0gPGNvZGU+bW9kZTwvY29kZT4gdmFsdWUuXG4gICAqL1xuICBnZXRNb2RlKCkge1xuICAgIHJldHVybiBBY2Nlc3NNb2RlLmVuY29kZSh0aGlzLm1vZGUpO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogQXNzaWduIDxjb2RlPmdpdmVuPC9jb2RlPiAgdmFsdWUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZyB8IE51bWJlcn0gZyAtIGVpdGhlciBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgYWNjZXNzIG1vZGUgb3IgYSBzZXQgb2YgYml0cy5cbiAgICogQHJldHVybnMge0FjY2Vzc01vZGV9IC0gPGNvZGU+dGhpczwvY29kZT4gQWNjZXNzTW9kZS5cbiAgICovXG4gIHNldEdpdmVuKGcpIHtcbiAgICB0aGlzLmdpdmVuID0gQWNjZXNzTW9kZS5kZWNvZGUoZyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBVcGRhdGUgJ2dpdmVuJyB2YWx1ZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1IC0gc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBjaGFuZ2VzIHRvIGFwcGx5IHRvIGFjY2VzcyBtb2RlLlxuICAgKiBAcmV0dXJucyB7QWNjZXNzTW9kZX0gLSA8Y29kZT50aGlzPC9jb2RlPiBBY2Nlc3NNb2RlLlxuICAgKi9cbiAgdXBkYXRlR2l2ZW4odSkge1xuICAgIHRoaXMuZ2l2ZW4gPSBBY2Nlc3NNb2RlLnVwZGF0ZSh0aGlzLmdpdmVuLCB1KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICAvKipcbiAgICogQWNjZXNzTW9kZSBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyB0b3BpYyBhY2Nlc3MgbW9kZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAY2xhc3MgQWNjZXNzTW9kZVxuICAgKi9cbiAgLyoqXG4gICAqIEdldCAnZ2l2ZW4nIHZhbHVlIGFzIGEgc3RyaW5nLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICpcbiAgICogQHJldHVybnMge3N0cmluZ30gLSA8Yj5naXZlbjwvYj4gdmFsdWUuXG4gICAqL1xuICBnZXRHaXZlbigpIHtcbiAgICByZXR1cm4gQWNjZXNzTW9kZS5lbmNvZGUodGhpcy5naXZlbik7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBBc3NpZ24gJ3dhbnQnIHZhbHVlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmcgfCBOdW1iZXJ9IHcgLSBlaXRoZXIgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIGFjY2VzcyBtb2RlIG9yIGEgc2V0IG9mIGJpdHMuXG4gICAqIEByZXR1cm5zIHtBY2Nlc3NNb2RlfSAtIDxjb2RlPnRoaXM8L2NvZGU+IEFjY2Vzc01vZGUuXG4gICAqL1xuICBzZXRXYW50KHcpIHtcbiAgICB0aGlzLndhbnQgPSBBY2Nlc3NNb2RlLmRlY29kZSh3KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICAvKipcbiAgICogQWNjZXNzTW9kZSBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyB0b3BpYyBhY2Nlc3MgbW9kZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAY2xhc3MgQWNjZXNzTW9kZVxuICAgKi9cbiAgLyoqXG4gICAqIFVwZGF0ZSAnd2FudCcgdmFsdWUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdSAtIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgY2hhbmdlcyB0byBhcHBseSB0byBhY2Nlc3MgbW9kZS5cbiAgICogQHJldHVybnMge0FjY2Vzc01vZGV9IC0gPGNvZGU+dGhpczwvY29kZT4gQWNjZXNzTW9kZS5cbiAgICovXG4gIHVwZGF0ZVdhbnQodSkge1xuICAgIHRoaXMud2FudCA9IEFjY2Vzc01vZGUudXBkYXRlKHRoaXMud2FudCwgdSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBHZXQgJ3dhbnQnIHZhbHVlIGFzIGEgc3RyaW5nLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICpcbiAgICogQHJldHVybnMge3N0cmluZ30gLSA8Yj53YW50PC9iPiB2YWx1ZS5cbiAgICovXG4gIGdldFdhbnQoKSB7XG4gICAgcmV0dXJuIEFjY2Vzc01vZGUuZW5jb2RlKHRoaXMud2FudCk7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBHZXQgcGVybWlzc2lvbnMgcHJlc2VudCBpbiAnd2FudCcgYnV0IG1pc3NpbmcgaW4gJ2dpdmVuJy5cbiAgICogSW52ZXJzZSBvZiB7QGxpbmsgVGlub2RlLkFjY2Vzc01vZGUjZ2V0RXhjZXNzaXZlfVxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICpcbiAgICogQHJldHVybnMge3N0cmluZ30gcGVybWlzc2lvbnMgcHJlc2VudCBpbiA8Yj53YW50PC9iPiBidXQgbWlzc2luZyBpbiA8Yj5naXZlbjwvYj4uXG4gICAqL1xuICBnZXRNaXNzaW5nKCkge1xuICAgIHJldHVybiBBY2Nlc3NNb2RlLmVuY29kZSh0aGlzLndhbnQgJiB+dGhpcy5naXZlbik7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBHZXQgcGVybWlzc2lvbnMgcHJlc2VudCBpbiAnZ2l2ZW4nIGJ1dCBtaXNzaW5nIGluICd3YW50Jy5cbiAgICogSW52ZXJzZSBvZiB7QGxpbmsgVGlub2RlLkFjY2Vzc01vZGUjZ2V0TWlzc2luZ31cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IHBlcm1pc3Npb25zIHByZXNlbnQgaW4gPGI+Z2l2ZW48L2I+IGJ1dCBtaXNzaW5nIGluIDxiPndhbnQ8L2I+LlxuICAgKi9cbiAgZ2V0RXhjZXNzaXZlKCkge1xuICAgIHJldHVybiBBY2Nlc3NNb2RlLmVuY29kZSh0aGlzLmdpdmVuICYgfnRoaXMud2FudCk7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBVcGRhdGUgJ3dhbnQnLCAnZ2l2ZScsIGFuZCAnbW9kZScgdmFsdWVzLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICpcbiAgICogQHBhcmFtIHtBY2Nlc3NNb2RlfSB2YWwgLSBuZXcgYWNjZXNzIG1vZGUgdmFsdWUuXG4gICAqIEByZXR1cm5zIHtBY2Nlc3NNb2RlfSAtIDxjb2RlPnRoaXM8L2NvZGU+IEFjY2Vzc01vZGUuXG4gICAqL1xuICB1cGRhdGVBbGwodmFsKSB7XG4gICAgaWYgKHZhbCkge1xuICAgICAgdGhpcy51cGRhdGVHaXZlbih2YWwuZ2l2ZW4pO1xuICAgICAgdGhpcy51cGRhdGVXYW50KHZhbC53YW50KTtcbiAgICAgIHRoaXMubW9kZSA9IHRoaXMuZ2l2ZW4gJiB0aGlzLndhbnQ7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogQ2hlY2sgaWYgT3duZXIgKE8pIGZsYWcgaXMgc2V0LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICogQHBhcmFtIHtzdHJpbmc9fSBzaWRlIC0gd2hpY2ggcGVybWlzc2lvbiB0byBjaGVjazogZ2l2ZW4sIHdhbnQsIG1vZGU7IGRlZmF1bHQ6IG1vZGUuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIDxjb2RlPnRydWU8L2NvZGU+IGlmIGZsYWcgaXMgc2V0LlxuICAgKi9cbiAgaXNPd25lcihzaWRlKSB7XG4gICAgcmV0dXJuIEFjY2Vzc01vZGUuI2NoZWNrRmxhZyh0aGlzLCBzaWRlLCBBY2Nlc3NNb2RlLl9PV05FUik7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBDaGVjayBpZiBQcmVzZW5jZSAoUCkgZmxhZyBpcyBzZXQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKiBAcGFyYW0ge3N0cmluZz19IHNpZGUgLSB3aGljaCBwZXJtaXNzaW9uIHRvIGNoZWNrOiBnaXZlbiwgd2FudCwgbW9kZTsgZGVmYXVsdDogbW9kZS5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IC0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgZmxhZyBpcyBzZXQuXG4gICAqL1xuICBpc1ByZXNlbmNlcihzaWRlKSB7XG4gICAgcmV0dXJuIEFjY2Vzc01vZGUuI2NoZWNrRmxhZyh0aGlzLCBzaWRlLCBBY2Nlc3NNb2RlLl9QUkVTKTtcbiAgfVxuICAvKipcbiAgICogQWNjZXNzTW9kZSBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyB0b3BpYyBhY2Nlc3MgbW9kZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAY2xhc3MgQWNjZXNzTW9kZVxuICAgKi9cbiAgLyoqXG4gICAqIENoZWNrIGlmIFByZXNlbmNlIChQKSBmbGFnIGlzIE5PVCBzZXQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKiBAcGFyYW0ge3N0cmluZz19IHNpZGUgLSB3aGljaCBwZXJtaXNzaW9uIHRvIGNoZWNrOiBnaXZlbiwgd2FudCwgbW9kZTsgZGVmYXVsdDogbW9kZS5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IC0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgZmxhZyBpcyBzZXQuXG4gICAqL1xuICBpc011dGVkKHNpZGUpIHtcbiAgICByZXR1cm4gIXRoaXMuaXNQcmVzZW5jZXIoc2lkZSk7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBDaGVjayBpZiBKb2luIChKKSBmbGFnIGlzIHNldC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gc2lkZSAtIHdoaWNoIHBlcm1pc3Npb24gdG8gY2hlY2s6IGdpdmVuLCB3YW50LCBtb2RlOyBkZWZhdWx0OiBtb2RlLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSA8Y29kZT50cnVlPC9jb2RlPiBpZiBmbGFnIGlzIHNldC5cbiAgICovXG4gIGlzSm9pbmVyKHNpZGUpIHtcbiAgICByZXR1cm4gQWNjZXNzTW9kZS4jY2hlY2tGbGFnKHRoaXMsIHNpZGUsIEFjY2Vzc01vZGUuX0pPSU4pO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogQ2hlY2sgaWYgUmVhZGVyIChSKSBmbGFnIGlzIHNldC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gc2lkZSAtIHdoaWNoIHBlcm1pc3Npb24gdG8gY2hlY2s6IGdpdmVuLCB3YW50LCBtb2RlOyBkZWZhdWx0OiBtb2RlLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSA8Y29kZT50cnVlPC9jb2RlPiBpZiBmbGFnIGlzIHNldC5cbiAgICovXG4gIGlzUmVhZGVyKHNpZGUpIHtcbiAgICByZXR1cm4gQWNjZXNzTW9kZS4jY2hlY2tGbGFnKHRoaXMsIHNpZGUsIEFjY2Vzc01vZGUuX1JFQUQpO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogQ2hlY2sgaWYgV3JpdGVyIChXKSBmbGFnIGlzIHNldC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gc2lkZSAtIHdoaWNoIHBlcm1pc3Npb24gdG8gY2hlY2s6IGdpdmVuLCB3YW50LCBtb2RlOyBkZWZhdWx0OiBtb2RlLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSA8Y29kZT50cnVlPC9jb2RlPiBpZiBmbGFnIGlzIHNldC5cbiAgICovXG4gIGlzV3JpdGVyKHNpZGUpIHtcbiAgICByZXR1cm4gQWNjZXNzTW9kZS4jY2hlY2tGbGFnKHRoaXMsIHNpZGUsIEFjY2Vzc01vZGUuX1dSSVRFKTtcbiAgfVxuICAvKipcbiAgICogQWNjZXNzTW9kZSBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyB0b3BpYyBhY2Nlc3MgbW9kZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAY2xhc3MgQWNjZXNzTW9kZVxuICAgKi9cbiAgLyoqXG4gICAqIENoZWNrIGlmIEFwcHJvdmVyIChBKSBmbGFnIGlzIHNldC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gc2lkZSAtIHdoaWNoIHBlcm1pc3Npb24gdG8gY2hlY2s6IGdpdmVuLCB3YW50LCBtb2RlOyBkZWZhdWx0OiBtb2RlLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSA8Y29kZT50cnVlPC9jb2RlPiBpZiBmbGFnIGlzIHNldC5cbiAgICovXG4gIGlzQXBwcm92ZXIoc2lkZSkge1xuICAgIHJldHVybiBBY2Nlc3NNb2RlLiNjaGVja0ZsYWcodGhpcywgc2lkZSwgQWNjZXNzTW9kZS5fQVBQUk9WRSk7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBDaGVjayBpZiBlaXRoZXIgb25lIG9mIE93bmVyIChPKSBvciBBcHByb3ZlciAoQSkgZmxhZ3MgaXMgc2V0LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICogQHBhcmFtIHtzdHJpbmc9fSBzaWRlIC0gd2hpY2ggcGVybWlzc2lvbiB0byBjaGVjazogZ2l2ZW4sIHdhbnQsIG1vZGU7IGRlZmF1bHQ6IG1vZGUuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIDxjb2RlPnRydWU8L2NvZGU+IGlmIGZsYWcgaXMgc2V0LlxuICAgKi9cbiAgaXNBZG1pbihzaWRlKSB7XG4gICAgcmV0dXJuIHRoaXMuaXNPd25lcihzaWRlKSB8fCB0aGlzLmlzQXBwcm92ZXIoc2lkZSk7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBDaGVjayBpZiBlaXRoZXIgb25lIG9mIE93bmVyIChPKSwgQXBwcm92ZXIgKEEpLCBvciBTaGFyZXIgKFMpIGZsYWdzIGlzIHNldC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gc2lkZSAtIHdoaWNoIHBlcm1pc3Npb24gdG8gY2hlY2s6IGdpdmVuLCB3YW50LCBtb2RlOyBkZWZhdWx0OiBtb2RlLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSA8Y29kZT50cnVlPC9jb2RlPiBpZiBmbGFnIGlzIHNldC5cbiAgICovXG4gIGlzU2hhcmVyKHNpZGUpIHtcbiAgICByZXR1cm4gdGhpcy5pc0FkbWluKHNpZGUpIHx8IEFjY2Vzc01vZGUuI2NoZWNrRmxhZyh0aGlzLCBzaWRlLCBBY2Nlc3NNb2RlLl9TSEFSRSk7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBDaGVjayBpZiBEZWxldGVyIChEKSBmbGFnIGlzIHNldC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gc2lkZSAtIHdoaWNoIHBlcm1pc3Npb24gdG8gY2hlY2s6IGdpdmVuLCB3YW50LCBtb2RlOyBkZWZhdWx0OiBtb2RlLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSA8Y29kZT50cnVlPC9jb2RlPiBpZiBmbGFnIGlzIHNldC5cbiAgICovXG4gIGlzRGVsZXRlcihzaWRlKSB7XG4gICAgcmV0dXJuIEFjY2Vzc01vZGUuI2NoZWNrRmxhZyh0aGlzLCBzaWRlLCBBY2Nlc3NNb2RlLl9ERUxFVEUpO1xuICB9XG59XG5cbkFjY2Vzc01vZGUuX05PTkUgPSAweDAwO1xuQWNjZXNzTW9kZS5fSk9JTiA9IDB4MDE7XG5BY2Nlc3NNb2RlLl9SRUFEID0gMHgwMjtcbkFjY2Vzc01vZGUuX1dSSVRFID0gMHgwNDtcbkFjY2Vzc01vZGUuX1BSRVMgPSAweDA4O1xuQWNjZXNzTW9kZS5fQVBQUk9WRSA9IDB4MTA7XG5BY2Nlc3NNb2RlLl9TSEFSRSA9IDB4MjA7XG5BY2Nlc3NNb2RlLl9ERUxFVEUgPSAweDQwO1xuQWNjZXNzTW9kZS5fT1dORVIgPSAweDgwO1xuXG5BY2Nlc3NNb2RlLl9CSVRNQVNLID0gQWNjZXNzTW9kZS5fSk9JTiB8IEFjY2Vzc01vZGUuX1JFQUQgfCBBY2Nlc3NNb2RlLl9XUklURSB8IEFjY2Vzc01vZGUuX1BSRVMgfFxuICBBY2Nlc3NNb2RlLl9BUFBST1ZFIHwgQWNjZXNzTW9kZS5fU0hBUkUgfCBBY2Nlc3NNb2RlLl9ERUxFVEUgfCBBY2Nlc3NNb2RlLl9PV05FUjtcbkFjY2Vzc01vZGUuX0lOVkFMSUQgPSAweDEwMDAwMDtcbiIsIi8qKlxuICogQGZpbGUgSW4tbWVtb3J5IHNvcnRlZCBjYWNoZSBvZiBvYmplY3RzLlxuICpcbiAqIEBjb3B5cmlnaHQgMjAxNS0yMDIyIFRpbm9kZSBMTEMuXG4gKi9cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBJbi1tZW1vcnkgc29ydGVkIGNhY2hlIG9mIG9iamVjdHMuXG4gKlxuICogQGNsYXNzIENCdWZmZXJcbiAqIEBtZW1iZXJvZiBUaW5vZGVcbiAqIEBwcm90ZWN0ZWRcbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjb21wYXJlIGN1c3RvbSBjb21wYXJhdG9yIG9mIG9iamVjdHMuIFRha2VzIHR3byBwYXJhbWV0ZXJzIDxjb2RlPmE8L2NvZGU+IGFuZCA8Y29kZT5iPC9jb2RlPjtcbiAqICAgIHJldHVybnMgPGNvZGU+LTE8L2NvZGU+IGlmIDxjb2RlPmEgPCBiPC9jb2RlPiwgPGNvZGU+MDwvY29kZT4gaWYgPGNvZGU+YSA9PSBiPC9jb2RlPiwgPGNvZGU+MTwvY29kZT4gb3RoZXJ3aXNlLlxuICogQHBhcmFtIHtib29sZWFufSB1bmlxdWUgZW5mb3JjZSBlbGVtZW50IHVuaXF1ZW5lc3M6IHdoZW4gPGNvZGU+dHJ1ZTwvY29kZT4gcmVwbGFjZSBleGlzdGluZyBlbGVtZW50IHdpdGggYSBuZXdcbiAqICAgIG9uZSBvbiBjb25mbGljdDsgd2hlbiA8Y29kZT5mYWxzZTwvY29kZT4ga2VlcCBib3RoIGVsZW1lbnRzLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDQnVmZmVyIHtcbiAgI2NvbXBhcmF0b3IgPSB1bmRlZmluZWQ7XG4gICN1bmlxdWUgPSBmYWxzZTtcbiAgYnVmZmVyID0gW107XG5cbiAgY29uc3RydWN0b3IoY29tcGFyZV8sIHVuaXF1ZV8pIHtcbiAgICB0aGlzLiNjb21wYXJhdG9yID0gY29tcGFyZV8gfHwgKChhLCBiKSA9PiB7XG4gICAgICByZXR1cm4gYSA9PT0gYiA/IDAgOiBhIDwgYiA/IC0xIDogMTtcbiAgICB9KTtcbiAgICB0aGlzLiN1bmlxdWUgPSB1bmlxdWVfO1xuICB9XG5cbiAgI2ZpbmROZWFyZXN0KGVsZW0sIGFyciwgZXhhY3QpIHtcbiAgICBsZXQgc3RhcnQgPSAwO1xuICAgIGxldCBlbmQgPSBhcnIubGVuZ3RoIC0gMTtcbiAgICBsZXQgcGl2b3QgPSAwO1xuICAgIGxldCBkaWZmID0gMDtcbiAgICBsZXQgZm91bmQgPSBmYWxzZTtcblxuICAgIHdoaWxlIChzdGFydCA8PSBlbmQpIHtcbiAgICAgIHBpdm90ID0gKHN0YXJ0ICsgZW5kKSAvIDIgfCAwO1xuICAgICAgZGlmZiA9IHRoaXMuI2NvbXBhcmF0b3IoYXJyW3Bpdm90XSwgZWxlbSk7XG4gICAgICBpZiAoZGlmZiA8IDApIHtcbiAgICAgICAgc3RhcnQgPSBwaXZvdCArIDE7XG4gICAgICB9IGVsc2UgaWYgKGRpZmYgPiAwKSB7XG4gICAgICAgIGVuZCA9IHBpdm90IC0gMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChmb3VuZCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaWR4OiBwaXZvdCxcbiAgICAgICAgZXhhY3Q6IHRydWVcbiAgICAgIH07XG4gICAgfVxuICAgIGlmIChleGFjdCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaWR4OiAtMVxuICAgICAgfTtcbiAgICB9XG4gICAgLy8gTm90IGV4YWN0IC0gaW5zZXJ0aW9uIHBvaW50XG4gICAgcmV0dXJuIHtcbiAgICAgIGlkeDogZGlmZiA8IDAgPyBwaXZvdCArIDEgOiBwaXZvdFxuICAgIH07XG4gIH1cblxuICAvLyBJbnNlcnQgZWxlbWVudCBpbnRvIGEgc29ydGVkIGFycmF5LlxuICAjaW5zZXJ0U29ydGVkKGVsZW0sIGFycikge1xuICAgIGNvbnN0IGZvdW5kID0gdGhpcy4jZmluZE5lYXJlc3QoZWxlbSwgYXJyLCBmYWxzZSk7XG4gICAgY29uc3QgY291bnQgPSAoZm91bmQuZXhhY3QgJiYgdGhpcy4jdW5pcXVlKSA/IDEgOiAwO1xuICAgIGFyci5zcGxpY2UoZm91bmQuaWR4LCBjb3VudCwgZWxlbSk7XG4gICAgcmV0dXJuIGFycjtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYW4gZWxlbWVudCBhdCB0aGUgZ2l2ZW4gcG9zaXRpb24uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ0J1ZmZlciNcbiAgICogQHBhcmFtIHtudW1iZXJ9IGF0IC0gUG9zaXRpb24gdG8gZmV0Y2ggZnJvbS5cbiAgICogQHJldHVybnMge09iamVjdH0gRWxlbWVudCBhdCB0aGUgZ2l2ZW4gcG9zaXRpb24gb3IgPGNvZGU+dW5kZWZpbmVkPC9jb2RlPi5cbiAgICovXG4gIGdldEF0KGF0KSB7XG4gICAgcmV0dXJuIHRoaXMuYnVmZmVyW2F0XTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZW5pZW5jZSBtZXRob2QgZm9yIGdldHRpbmcgdGhlIGVsZW1lbnQgZnJvbSB0aGUgZW5kIG9mIHRoZSBidWZmZXIuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ0J1ZmZlciNcbiAgICogQHBhcmFtIHtudW1iZXJ9IGF0IC0gcG9zaXRpb24gdG8gZmV0Y2ggZnJvbSwgY291bnRpbmcgZnJvbSB0aGUgZW5kO1xuICAgKiAgICA8Y29kZT51bmRlZmluZWQ8L2NvZGU+IG9yIDxjb2RlPm51bGw8L2NvZGU+ICBtZWFuIFwibGFzdFwiLlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgbGFzdCBlbGVtZW50IGluIHRoZSBidWZmZXIgb3IgPGNvZGU+dW5kZWZpbmVkPC9jb2RlPiBpZiBidWZmZXIgaXMgZW1wdHkuXG4gICAqL1xuICBnZXRMYXN0KGF0KSB7XG4gICAgYXQgfD0gMDtcbiAgICByZXR1cm4gdGhpcy5idWZmZXIubGVuZ3RoID4gYXQgPyB0aGlzLmJ1ZmZlclt0aGlzLmJ1ZmZlci5sZW5ndGggLSAxIC0gYXRdIDogdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBuZXcgZWxlbWVudChzKSB0byB0aGUgYnVmZmVyLiBWYXJpYWRpYzogdGFrZXMgb25lIG9yIG1vcmUgYXJndW1lbnRzLiBJZiBhbiBhcnJheSBpcyBwYXNzZWQgYXMgYSBzaW5nbGVcbiAgICogYXJndW1lbnQsIGl0cyBlbGVtZW50cyBhcmUgaW5zZXJ0ZWQgaW5kaXZpZHVhbGx5LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNCdWZmZXIjXG4gICAqXG4gICAqIEBwYXJhbSB7Li4uT2JqZWN0fEFycmF5fSAtIE9uZSBvciBtb3JlIG9iamVjdHMgdG8gaW5zZXJ0LlxuICAgKi9cbiAgcHV0KCkge1xuICAgIGxldCBpbnNlcnQ7XG4gICAgLy8gaW5zcGVjdCBhcmd1bWVudHM6IGlmIGFycmF5LCBpbnNlcnQgaXRzIGVsZW1lbnRzLCBpZiBvbmUgb3IgbW9yZSBub24tYXJyYXkgYXJndW1lbnRzLCBpbnNlcnQgdGhlbSBvbmUgYnkgb25lXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMSAmJiBBcnJheS5pc0FycmF5KGFyZ3VtZW50c1swXSkpIHtcbiAgICAgIGluc2VydCA9IGFyZ3VtZW50c1swXTtcbiAgICB9IGVsc2Uge1xuICAgICAgaW5zZXJ0ID0gYXJndW1lbnRzO1xuICAgIH1cbiAgICBmb3IgKGxldCBpZHggaW4gaW5zZXJ0KSB7XG4gICAgICB0aGlzLiNpbnNlcnRTb3J0ZWQoaW5zZXJ0W2lkeF0sIHRoaXMuYnVmZmVyKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGVsZW1lbnQgYXQgdGhlIGdpdmVuIHBvc2l0aW9uLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNCdWZmZXIjXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBhdCAtIFBvc2l0aW9uIHRvIGRlbGV0ZSBhdC5cbiAgICogQHJldHVybnMge09iamVjdH0gRWxlbWVudCBhdCB0aGUgZ2l2ZW4gcG9zaXRpb24gb3IgPGNvZGU+dW5kZWZpbmVkPC9jb2RlPi5cbiAgICovXG4gIGRlbEF0KGF0KSB7XG4gICAgYXQgfD0gMDtcbiAgICBsZXQgciA9IHRoaXMuYnVmZmVyLnNwbGljZShhdCwgMSk7XG4gICAgaWYgKHIgJiYgci5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm4gclswXTtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgZWxlbWVudHMgYmV0d2VlbiB0d28gcG9zaXRpb25zLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNCdWZmZXIjXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzaW5jZSAtIFBvc2l0aW9uIHRvIGRlbGV0ZSBmcm9tIChpbmNsdXNpdmUpLlxuICAgKiBAcGFyYW0ge251bWJlcn0gYmVmb3JlIC0gUG9zaXRpb24gdG8gZGVsZXRlIHRvIChleGNsdXNpdmUpLlxuICAgKlxuICAgKiBAcmV0dXJucyB7QXJyYXl9IGFycmF5IG9mIHJlbW92ZWQgZWxlbWVudHMgKGNvdWxkIGJlIHplcm8gbGVuZ3RoKS5cbiAgICovXG4gIGRlbFJhbmdlKHNpbmNlLCBiZWZvcmUpIHtcbiAgICByZXR1cm4gdGhpcy5idWZmZXIuc3BsaWNlKHNpbmNlLCBiZWZvcmUgLSBzaW5jZSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBudW1iZXIgb2YgZWxlbWVudHMgdGhlIGJ1ZmZlciBob2xkcy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5DQnVmZmVyI1xuICAgKiBAcmV0dXJuIHtudW1iZXJ9IE51bWJlciBvZiBlbGVtZW50cyBpbiB0aGUgYnVmZmVyLlxuICAgKi9cbiAgbGVuZ3RoKCkge1xuICAgIHJldHVybiB0aGlzLmJ1ZmZlci5sZW5ndGg7XG4gIH1cblxuICAvKipcbiAgICogUmVzZXQgdGhlIGJ1ZmZlciBkaXNjYXJkaW5nIGFsbCBlbGVtZW50c1xuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNCdWZmZXIjXG4gICAqL1xuICByZXNldCgpIHtcbiAgICB0aGlzLmJ1ZmZlciA9IFtdO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIGZvciBpdGVyYXRpbmcgY29udGVudHMgb2YgYnVmZmVyLiBTZWUge0BsaW5rIFRpbm9kZS5DQnVmZmVyI2ZvckVhY2h9LlxuICAgKiBAY2FsbGJhY2sgRm9yRWFjaENhbGxiYWNrVHlwZVxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNCdWZmZXIjXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBlbGVtIC0gQ3VycmVudCBlbGVtZW50IG9mIHRoZSBidWZmZXIuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwcmV2IC0gUHJldmlvdXMgZWxlbWVudCBvZiB0aGUgYnVmZmVyLlxuICAgKiBAcGFyYW0ge09iamVjdH0gbmV4dCAtIE5leHQgZWxlbWVudCBvZiB0aGUgYnVmZmVyLlxuICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXggLSBJbmRleCBvZiB0aGUgY3VycmVudCBlbGVtZW50LlxuICAgKi9cblxuICAvKipcbiAgICogQXBwbHkgZ2l2ZW4gPGNvZGU+Y2FsbGJhY2s8L2NvZGU+IHRvIGFsbCBlbGVtZW50cyBvZiB0aGUgYnVmZmVyLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNCdWZmZXIjXG4gICAqXG4gICAqIEBwYXJhbSB7VGlub2RlLkZvckVhY2hDYWxsYmFja1R5cGV9IGNhbGxiYWNrIC0gRnVuY3Rpb24gdG8gY2FsbCBmb3IgZWFjaCBlbGVtZW50LlxuICAgKiBAcGFyYW0ge251bWJlcn0gc3RhcnRJZHggLSBPcHRpb25hbCBpbmRleCB0byBzdGFydCBpdGVyYXRpbmcgZnJvbSAoaW5jbHVzaXZlKS5cbiAgICogQHBhcmFtIHtudW1iZXJ9IGJlZm9yZUlkeCAtIE9wdGlvbmFsIGluZGV4IHRvIHN0b3AgaXRlcmF0aW5nIGJlZm9yZSAoZXhjbHVzaXZlKS5cbiAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHQgLSBjYWxsaW5nIGNvbnRleHQgKGkuZS4gdmFsdWUgb2YgPGNvZGU+dGhpczwvY29kZT4gaW4gY2FsbGJhY2spXG4gICAqL1xuICBmb3JFYWNoKGNhbGxiYWNrLCBzdGFydElkeCwgYmVmb3JlSWR4LCBjb250ZXh0KSB7XG4gICAgc3RhcnRJZHggPSBzdGFydElkeCB8IDA7XG4gICAgYmVmb3JlSWR4ID0gYmVmb3JlSWR4IHx8IHRoaXMuYnVmZmVyLmxlbmd0aDtcblxuICAgIGZvciAobGV0IGkgPSBzdGFydElkeDsgaSA8IGJlZm9yZUlkeDsgaSsrKSB7XG4gICAgICBjYWxsYmFjay5jYWxsKGNvbnRleHQsIHRoaXMuYnVmZmVyW2ldLFxuICAgICAgICAoaSA+IHN0YXJ0SWR4ID8gdGhpcy5idWZmZXJbaSAtIDFdIDogdW5kZWZpbmVkKSxcbiAgICAgICAgKGkgPCBiZWZvcmVJZHggLSAxID8gdGhpcy5idWZmZXJbaSArIDFdIDogdW5kZWZpbmVkKSwgaSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEZpbmQgZWxlbWVudCBpbiBidWZmZXIgdXNpbmcgYnVmZmVyJ3MgY29tcGFyaXNvbiBmdW5jdGlvbi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5DQnVmZmVyI1xuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gZWxlbSAtIGVsZW1lbnQgdG8gZmluZC5cbiAgICogQHBhcmFtIHtib29sZWFuPX0gbmVhcmVzdCAtIHdoZW4gdHJ1ZSBhbmQgZXhhY3QgbWF0Y2ggaXMgbm90IGZvdW5kLCByZXR1cm4gdGhlIG5lYXJlc3QgZWxlbWVudCAoaW5zZXJ0aW9uIHBvaW50KS5cbiAgICogQHJldHVybnMge251bWJlcn0gaW5kZXggb2YgdGhlIGVsZW1lbnQgaW4gdGhlIGJ1ZmZlciBvciAtMS5cbiAgICovXG4gIGZpbmQoZWxlbSwgbmVhcmVzdCkge1xuICAgIGNvbnN0IHtcbiAgICAgIGlkeFxuICAgIH0gPSB0aGlzLiNmaW5kTmVhcmVzdChlbGVtLCB0aGlzLmJ1ZmZlciwgIW5lYXJlc3QpO1xuICAgIHJldHVybiBpZHg7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGJhY2sgZm9yIGZpbHRlcmluZyB0aGUgYnVmZmVyLiBTZWUge0BsaW5rIFRpbm9kZS5DQnVmZmVyI2ZpbHRlcn0uXG4gICAqIEBjYWxsYmFjayBGb3JFYWNoQ2FsbGJhY2tUeXBlXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ0J1ZmZlciNcbiAgICogQHBhcmFtIHtPYmplY3R9IGVsZW0gLSBDdXJyZW50IGVsZW1lbnQgb2YgdGhlIGJ1ZmZlci5cbiAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IC0gSW5kZXggb2YgdGhlIGN1cnJlbnQgZWxlbWVudC5cbiAgICogQHJldHVybnMge2Jvb2xlbn0gPGNvZGU+dHJ1ZTwvY29kZT4gdG8ga2VlcCB0aGUgZWxlbWVudCwgPGNvZGU+ZmFsc2U8L2NvZGU+IHRvIHJlbW92ZS5cbiAgICovXG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhbGwgZWxlbWVudHMgdGhhdCBkbyBub3QgcGFzcyB0aGUgdGVzdCBpbXBsZW1lbnRlZCBieSB0aGUgcHJvdmlkZWQgY2FsbGJhY2sgZnVuY3Rpb24uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ0J1ZmZlciNcbiAgICpcbiAgICogQHBhcmFtIHtUaW5vZGUuRmlsdGVyQ2FsbGJhY2tUeXBlfSBjYWxsYmFjayAtIEZ1bmN0aW9uIHRvIGNhbGwgZm9yIGVhY2ggZWxlbWVudC5cbiAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHQgLSBjYWxsaW5nIGNvbnRleHQgKGkuZS4gdmFsdWUgb2YgPGNvZGU+dGhpczwvY29kZT4gaW4gdGhlIGNhbGxiYWNrKVxuICAgKi9cbiAgZmlsdGVyKGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgbGV0IGNvdW50ID0gMDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYnVmZmVyLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoY2FsbGJhY2suY2FsbChjb250ZXh0LCB0aGlzLmJ1ZmZlcltpXSwgaSkpIHtcbiAgICAgICAgdGhpcy5idWZmZXJbY291bnRdID0gdGhpcy5idWZmZXJbaV07XG4gICAgICAgIGNvdW50Kys7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5idWZmZXIuc3BsaWNlKGNvdW50KTtcbiAgfVxufVxuIiwiLyoqXG4gKiBAZmlsZSBHbG9iYWwgY29uc3RhbnRzIGFuZCBjb25maWd1cmF0aW9uIHBhcmFtZXRlcnMuXG4gKlxuICogQGNvcHlyaWdodCAyMDE1LTIwMjIgVGlub2RlIExMQ1xuICovXG4ndXNlIHN0cmljdCc7XG5cbmltcG9ydCB7XG4gIHZlcnNpb24gYXMgcGFja2FnZV92ZXJzaW9uXG59IGZyb20gJy4uL3ZlcnNpb24uanNvbic7XG5cbi8vIEdsb2JhbCBjb25zdGFudHNcbmV4cG9ydCBjb25zdCBQUk9UT0NPTF9WRVJTSU9OID0gJzAnOyAvLyBNYWpvciBjb21wb25lbnQgb2YgdGhlIHZlcnNpb24sIGUuZy4gJzAnIGluICcwLjE3LjEnLlxuZXhwb3J0IGNvbnN0IFZFUlNJT04gPSBwYWNrYWdlX3ZlcnNpb24gfHwgJzAuMTgnO1xuZXhwb3J0IGNvbnN0IExJQlJBUlkgPSAndGlub2RlanMvJyArIFZFUlNJT047XG5cbi8vIFRvcGljIG5hbWUgcHJlZml4ZXMuXG5leHBvcnQgY29uc3QgVE9QSUNfTkVXID0gJ25ldyc7XG5leHBvcnQgY29uc3QgVE9QSUNfTkVXX0NIQU4gPSAnbmNoJztcbmV4cG9ydCBjb25zdCBUT1BJQ19NRSA9ICdtZSc7XG5leHBvcnQgY29uc3QgVE9QSUNfRk5EID0gJ2ZuZCc7XG5leHBvcnQgY29uc3QgVE9QSUNfU1lTID0gJ3N5cyc7XG5leHBvcnQgY29uc3QgVE9QSUNfQ0hBTiA9ICdjaG4nO1xuZXhwb3J0IGNvbnN0IFRPUElDX0dSUCA9ICdncnA7J1xuZXhwb3J0IGNvbnN0IFRPUElDX1AyUCA9ICdwMnAnO1xuZXhwb3J0IGNvbnN0IFVTRVJfTkVXID0gJ25ldyc7XG5cbi8vIFN0YXJ0aW5nIHZhbHVlIG9mIGEgbG9jYWxseS1nZW5lcmF0ZWQgc2VxSWQgdXNlZCBmb3IgcGVuZGluZyBtZXNzYWdlcy5cbmV4cG9ydCBjb25zdCBMT0NBTF9TRVFJRCA9IDB4RkZGRkZGRjtcblxuLy8gU3RhdHVzIGNvZGVzLlxuZXhwb3J0IGNvbnN0IE1FU1NBR0VfU1RBVFVTX05PTkUgPSAwOyAvLyBTdGF0dXMgbm90IGFzc2lnbmVkLlxuZXhwb3J0IGNvbnN0IE1FU1NBR0VfU1RBVFVTX1FVRVVFRCA9IDE7IC8vIExvY2FsIElEIGFzc2lnbmVkLCBpbiBwcm9ncmVzcyB0byBiZSBzZW50LlxuZXhwb3J0IGNvbnN0IE1FU1NBR0VfU1RBVFVTX1NFTkRJTkcgPSAyOyAvLyBUcmFuc21pc3Npb24gc3RhcnRlZC5cbmV4cG9ydCBjb25zdCBNRVNTQUdFX1NUQVRVU19GQUlMRUQgPSAzOyAvLyBBdCBsZWFzdCBvbmUgYXR0ZW1wdCB3YXMgbWFkZSB0byBzZW5kIHRoZSBtZXNzYWdlLlxuZXhwb3J0IGNvbnN0IE1FU1NBR0VfU1RBVFVTX1NFTlQgPSA0OyAvLyBEZWxpdmVyZWQgdG8gdGhlIHNlcnZlci5cbmV4cG9ydCBjb25zdCBNRVNTQUdFX1NUQVRVU19SRUNFSVZFRCA9IDU7IC8vIFJlY2VpdmVkIGJ5IHRoZSBjbGllbnQuXG5leHBvcnQgY29uc3QgTUVTU0FHRV9TVEFUVVNfUkVBRCA9IDY7IC8vIFJlYWQgYnkgdGhlIHVzZXIuXG5leHBvcnQgY29uc3QgTUVTU0FHRV9TVEFUVVNfVE9fTUUgPSA3OyAvLyBUaGUgbWVzc2FnZSBpcyByZWNlaXZlZCBmcm9tIGFub3RoZXIgdXNlci5cbmV4cG9ydCBjb25zdCBNRVNTQUdFX1NUQVRVU19ERUxfUkFOR0UgPSA4OyAvLyBUaGUgbWVzc2FnZSByZXByZXNlbnRzIGEgZGVsZXRlZCByYW5nZS5cblxuLy8gUmVqZWN0IHVucmVzb2x2ZWQgZnV0dXJlcyBhZnRlciB0aGlzIG1hbnkgbWlsbGlzZWNvbmRzLlxuZXhwb3J0IGNvbnN0IEVYUElSRV9QUk9NSVNFU19USU1FT1VUID0gNV8wMDA7XG4vLyBQZXJpb2RpY2l0eSBvZiBnYXJiYWdlIGNvbGxlY3Rpb24gb2YgdW5yZXNvbHZlZCBmdXR1cmVzLlxuZXhwb3J0IGNvbnN0IEVYUElSRV9QUk9NSVNFU19QRVJJT0QgPSAxXzAwMDtcblxuLy8gRGVsYXkgYmVmb3JlIGFja25vd2xlZGdpbmcgdGhhdCBhIG1lc3NhZ2Ugd2FzIHJlY2l2ZWQuXG5leHBvcnQgY29uc3QgUkVDVl9USU1FT1VUID0gMTAwO1xuXG4vLyBEZWZhdWx0IG51bWJlciBvZiBtZXNzYWdlcyB0byBwdWxsIGludG8gbWVtb3J5IGZyb20gcGVyc2lzdGVudCBjYWNoZS5cbmV4cG9ydCBjb25zdCBERUZBVUxUX01FU1NBR0VTX1BBR0UgPSAyNDtcblxuLy8gVW5pY29kZSBERUwgY2hhcmFjdGVyIGluZGljYXRpbmcgZGF0YSB3YXMgZGVsZXRlZC5cbmV4cG9ydCBjb25zdCBERUxfQ0hBUiA9ICdcXHUyNDIxJztcbiIsIi8qKlxuICogQGZpbGUgQWJzdHJhY3Rpb24gbGF5ZXIgZm9yIHdlYnNvY2tldCBhbmQgbG9uZyBwb2xsaW5nIGNvbm5lY3Rpb25zLlxuICpcbiAqIEBjb3B5cmlnaHQgMjAxNS0yMDIyIFRpbm9kZSBMTEMuXG4gKi9cbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHtcbiAganNvblBhcnNlSGVscGVyXG59IGZyb20gJy4vdXRpbHMuanMnO1xuXG5sZXQgV2ViU29ja2V0UHJvdmlkZXI7XG5sZXQgWEhSUHJvdmlkZXI7XG5cbi8vIEVycm9yIGNvZGUgdG8gcmV0dXJuIGluIGNhc2Ugb2YgYSBuZXR3b3JrIHByb2JsZW0uXG5jb25zdCBORVRXT1JLX0VSUk9SID0gNTAzO1xuY29uc3QgTkVUV09SS19FUlJPUl9URVhUID0gXCJDb25uZWN0aW9uIGZhaWxlZFwiO1xuXG4vLyBFcnJvciBjb2RlIHRvIHJldHVybiB3aGVuIHVzZXIgZGlzY29ubmVjdGVkIGZyb20gc2VydmVyLlxuY29uc3QgTkVUV09SS19VU0VSID0gNDE4O1xuY29uc3QgTkVUV09SS19VU0VSX1RFWFQgPSBcIkRpc2Nvbm5lY3RlZCBieSBjbGllbnRcIjtcblxuLy8gU2V0dGluZ3MgZm9yIGV4cG9uZW50aWFsIGJhY2tvZmZcbmNvbnN0IF9CT0ZGX0JBU0UgPSAyMDAwOyAvLyAyMDAwIG1pbGxpc2Vjb25kcywgbWluaW11bSBkZWxheSBiZXR3ZWVuIHJlY29ubmVjdHNcbmNvbnN0IF9CT0ZGX01BWF9JVEVSID0gMTA7IC8vIE1heGltdW0gZGVsYXkgYmV0d2VlbiByZWNvbm5lY3RzIDJeMTAgKiAyMDAwIH4gMzQgbWludXRlc1xuY29uc3QgX0JPRkZfSklUVEVSID0gMC4zOyAvLyBBZGQgcmFuZG9tIGRlbGF5XG5cbi8vIEhlbHBlciBmdW5jdGlvbiBmb3IgY3JlYXRpbmcgYW4gZW5kcG9pbnQgVVJMLlxuZnVuY3Rpb24gbWFrZUJhc2VVcmwoaG9zdCwgcHJvdG9jb2wsIHZlcnNpb24sIGFwaUtleSkge1xuICBsZXQgdXJsID0gbnVsbDtcblxuICBpZiAoWydodHRwJywgJ2h0dHBzJywgJ3dzJywgJ3dzcyddLmluY2x1ZGVzKHByb3RvY29sKSkge1xuICAgIHVybCA9IGAke3Byb3RvY29sfTovLyR7aG9zdH1gO1xuICAgIGlmICh1cmwuY2hhckF0KHVybC5sZW5ndGggLSAxKSAhPT0gJy8nKSB7XG4gICAgICB1cmwgKz0gJy8nO1xuICAgIH1cbiAgICB1cmwgKz0gJ3YnICsgdmVyc2lvbiArICcvY2hhbm5lbHMnO1xuICAgIGlmIChbJ2h0dHAnLCAnaHR0cHMnXS5pbmNsdWRlcyhwcm90b2NvbCkpIHtcbiAgICAgIC8vIExvbmcgcG9sbGluZyBlbmRwb2ludCBlbmRzIHdpdGggXCJscFwiLCBpLmUuXG4gICAgICAvLyAnL3YwL2NoYW5uZWxzL2xwJyB2cyBqdXN0ICcvdjAvY2hhbm5lbHMnIGZvciB3c1xuICAgICAgdXJsICs9ICcvbHAnO1xuICAgIH1cbiAgICB1cmwgKz0gJz9hcGlrZXk9JyArIGFwaUtleTtcbiAgfVxuICByZXR1cm4gdXJsO1xufVxuXG4vKipcbiAqIEFuIGFic3RyYWN0aW9uIGZvciBhIHdlYnNvY2tldCBvciBhIGxvbmcgcG9sbGluZyBjb25uZWN0aW9uLlxuICpcbiAqIEBjbGFzcyBDb25uZWN0aW9uXG4gKiBAbWVtYmVyb2YgVGlub2RlXG5cbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgLSBjb25maWd1cmF0aW9uIHBhcmFtZXRlcnMuXG4gKiBAcGFyYW0ge3N0cmluZ30gY29uZmlnLmhvc3QgLSBIb3N0IG5hbWUgYW5kIG9wdGlvbmFsIHBvcnQgbnVtYmVyIHRvIGNvbm5lY3QgdG8uXG4gKiBAcGFyYW0ge3N0cmluZ30gY29uZmlnLmFwaUtleSAtIEFQSSBrZXkgZ2VuZXJhdGVkIGJ5IDxjb2RlPmtleWdlbjwvY29kZT4uXG4gKiBAcGFyYW0ge3N0cmluZ30gY29uZmlnLnRyYW5zcG9ydCAtIE5ldHdvcmsgdHJhbnNwb3J0IHRvIHVzZSwgZWl0aGVyIDxjb2RlPlwid3NcIjxjb2RlPi88Y29kZT5cIndzc1wiPC9jb2RlPiBmb3Igd2Vic29ja2V0IG9yXG4gKiAgICAgIDxjb2RlPmxwPC9jb2RlPiBmb3IgbG9uZyBwb2xsaW5nLlxuICogQHBhcmFtIHtib29sZWFufSBjb25maWcuc2VjdXJlIC0gVXNlIFNlY3VyZSBXZWJTb2NrZXQgaWYgPGNvZGU+dHJ1ZTwvY29kZT4uXG4gKiBAcGFyYW0ge3N0cmluZ30gdmVyc2lvbl8gLSBNYWpvciB2YWx1ZSBvZiB0aGUgcHJvdG9jb2wgdmVyc2lvbiwgZS5nLiAnMCcgaW4gJzAuMTcuMScuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGF1dG9yZWNvbm5lY3RfIC0gSWYgY29ubmVjdGlvbiBpcyBsb3N0LCB0cnkgdG8gcmVjb25uZWN0IGF1dG9tYXRpY2FsbHkuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbm5lY3Rpb24ge1xuICAvLyBMb2dnZXIsIGRvZXMgbm90aGluZyBieSBkZWZhdWx0LlxuICBzdGF0aWMgI2xvZyA9IF8gPT4ge307XG5cbiAgI2JvZmZUaW1lciA9IG51bGw7XG4gICNib2ZmSXRlcmF0aW9uID0gMDtcbiAgI2JvZmZDbG9zZWQgPSBmYWxzZTsgLy8gSW5kaWNhdG9yIGlmIHRoZSBzb2NrZXQgd2FzIG1hbnVhbGx5IGNsb3NlZCAtIGRvbid0IGF1dG9yZWNvbm5lY3QgaWYgdHJ1ZS5cblxuICAvLyBXZWJzb2NrZXQuXG4gICNzb2NrZXQgPSBudWxsO1xuXG4gIGhvc3Q7XG4gIHNlY3VyZTtcbiAgYXBpS2V5O1xuXG4gIHZlcnNpb247XG4gIGF1dG9yZWNvbm5lY3Q7XG5cbiAgaW5pdGlhbGl6ZWQ7XG5cbiAgLy8gKGNvbmZpZy5ob3N0LCBjb25maWcuYXBpS2V5LCBjb25maWcudHJhbnNwb3J0LCBjb25maWcuc2VjdXJlKSwgUFJPVE9DT0xfVkVSU0lPTiwgdHJ1ZVxuICBjb25zdHJ1Y3Rvcihjb25maWcsIHZlcnNpb25fLCBhdXRvcmVjb25uZWN0Xykge1xuICAgIHRoaXMuaG9zdCA9IGNvbmZpZy5ob3N0O1xuICAgIHRoaXMuc2VjdXJlID0gY29uZmlnLnNlY3VyZTtcbiAgICB0aGlzLmFwaUtleSA9IGNvbmZpZy5hcGlLZXk7XG5cbiAgICB0aGlzLnZlcnNpb24gPSB2ZXJzaW9uXztcbiAgICB0aGlzLmF1dG9yZWNvbm5lY3QgPSBhdXRvcmVjb25uZWN0XztcblxuICAgIGlmIChjb25maWcudHJhbnNwb3J0ID09PSAnbHAnKSB7XG4gICAgICAvLyBleHBsaWNpdCByZXF1ZXN0IHRvIHVzZSBsb25nIHBvbGxpbmdcbiAgICAgIHRoaXMuI2luaXRfbHAoKTtcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSAnbHAnO1xuICAgIH0gZWxzZSBpZiAoY29uZmlnLnRyYW5zcG9ydCA9PT0gJ3dzJykge1xuICAgICAgLy8gZXhwbGljaXQgcmVxdWVzdCB0byB1c2Ugd2ViIHNvY2tldFxuICAgICAgLy8gaWYgd2Vic29ja2V0cyBhcmUgbm90IGF2YWlsYWJsZSwgaG9ycmlibGUgdGhpbmdzIHdpbGwgaGFwcGVuXG4gICAgICB0aGlzLiNpbml0X3dzKCk7XG4gICAgICB0aGlzLmluaXRpYWxpemVkID0gJ3dzJztcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuaW5pdGlhbGl6ZWQpIHtcbiAgICAgIC8vIEludmFsaWQgb3IgdW5kZWZpbmVkIG5ldHdvcmsgdHJhbnNwb3J0LlxuICAgICAgQ29ubmVjdGlvbi4jbG9nKFwiVW5rbm93biBvciBpbnZhbGlkIG5ldHdvcmsgdHJhbnNwb3J0LiBSdW5uaW5nIHVuZGVyIE5vZGU/IENhbGwgJ1Rpbm9kZS5zZXROZXR3b3JrUHJvdmlkZXJzKCknLlwiKTtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIlVua25vd24gb3IgaW52YWxpZCBuZXR3b3JrIHRyYW5zcG9ydC4gUnVubmluZyB1bmRlciBOb2RlPyBDYWxsICdUaW5vZGUuc2V0TmV0d29ya1Byb3ZpZGVycygpJy5cIik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRvIHVzZSBDb25uZWN0aW9uIGluIGEgbm9uIGJyb3dzZXIgY29udGV4dCwgc3VwcGx5IFdlYlNvY2tldCBhbmQgWE1MSHR0cFJlcXVlc3QgcHJvdmlkZXJzLlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJvZiBDb25uZWN0aW9uXG4gICAqIEBwYXJhbSB3c1Byb3ZpZGVyIFdlYlNvY2tldCBwcm92aWRlciwgZS5nLiBmb3Igbm9kZUpTICwgPGNvZGU+cmVxdWlyZSgnd3MnKTwvY29kZT4uXG4gICAqIEBwYXJhbSB4aHJQcm92aWRlciBYTUxIdHRwUmVxdWVzdCBwcm92aWRlciwgZS5nLiBmb3Igbm9kZSA8Y29kZT5yZXF1aXJlKCd4aHInKTwvY29kZT4uXG4gICAqL1xuICBzdGF0aWMgc2V0TmV0d29ya1Byb3ZpZGVycyh3c1Byb3ZpZGVyLCB4aHJQcm92aWRlcikge1xuICAgIFdlYlNvY2tldFByb3ZpZGVyID0gd3NQcm92aWRlcjtcbiAgICBYSFJQcm92aWRlciA9IHhoclByb3ZpZGVyO1xuICB9XG5cbiAgLyoqXG4gICAqIEFzc2lnbiBhIG5vbi1kZWZhdWx0IGxvZ2dlci5cbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyb2YgQ29ubmVjdGlvblxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBsIHZhcmlhZGljIGxvZ2dpbmcgZnVuY3Rpb24uXG4gICAqL1xuICBzdGF0aWMgc2V0IGxvZ2dlcihsKSB7XG4gICAgQ29ubmVjdGlvbi4jbG9nID0gbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWF0ZSBhIG5ldyBjb25uZWN0aW9uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ29ubmVjdGlvbiNcbiAgICogQHBhcmFtIHtzdHJpbmd9IGhvc3RfIEhvc3QgbmFtZSB0byBjb25uZWN0IHRvOyBpZiA8Y29kZT5udWxsPC9jb2RlPiB0aGUgb2xkIGhvc3QgbmFtZSB3aWxsIGJlIHVzZWQuXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gZm9yY2UgRm9yY2UgbmV3IGNvbm5lY3Rpb24gZXZlbiBpZiBvbmUgYWxyZWFkeSBleGlzdHMuXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IFByb21pc2UgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgY29ubmVjdGlvbiBjYWxsIGNvbXBsZXRlcywgcmVzb2x1dGlvbiBpcyBjYWxsZWQgd2l0aG91dFxuICAgKiAgcGFyYW1ldGVycywgcmVqZWN0aW9uIHBhc3NlcyB0aGUge0Vycm9yfSBhcyBwYXJhbWV0ZXIuXG4gICAqL1xuICBjb25uZWN0KGhvc3RfLCBmb3JjZSkge1xuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChudWxsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUcnkgdG8gcmVzdG9yZSBhIG5ldHdvcmsgY29ubmVjdGlvbiwgYWxzbyByZXNldCBiYWNrb2ZmLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNvbm5lY3Rpb24jXG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gZm9yY2UgLSByZWNvbm5lY3QgZXZlbiBpZiB0aGVyZSBpcyBhIGxpdmUgY29ubmVjdGlvbiBhbHJlYWR5LlxuICAgKi9cbiAgcmVjb25uZWN0KGZvcmNlKSB7fVxuXG4gIC8qKlxuICAgKiBUZXJtaW5hdGUgdGhlIG5ldHdvcmsgY29ubmVjdGlvblxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNvbm5lY3Rpb24jXG4gICAqL1xuICBkaXNjb25uZWN0KCkge31cblxuICAvKipcbiAgICogU2VuZCBhIHN0cmluZyB0byB0aGUgc2VydmVyLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNvbm5lY3Rpb24jXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtc2cgLSBTdHJpbmcgdG8gc2VuZC5cbiAgICogQHRocm93cyBUaHJvd3MgYW4gZXhjZXB0aW9uIGlmIHRoZSB1bmRlcmx5aW5nIGNvbm5lY3Rpb24gaXMgbm90IGxpdmUuXG4gICAqL1xuICBzZW5kVGV4dChtc2cpIHt9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGNvbm5lY3Rpb24gaXMgYWxpdmUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ29ubmVjdGlvbiNcbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIGNvbm5lY3Rpb24gaXMgbGl2ZSwgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIGlzQ29ubmVjdGVkKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIG5hbWUgb2YgdGhlIGN1cnJlbnQgbmV0d29yayB0cmFuc3BvcnQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ29ubmVjdGlvbiNcbiAgICogQHJldHVybnMge3N0cmluZ30gbmFtZSBvZiB0aGUgdHJhbnNwb3J0IHN1Y2ggYXMgPGNvZGU+XCJ3c1wiPC9jb2RlPiBvciA8Y29kZT5cImxwXCI8L2NvZGU+LlxuICAgKi9cbiAgdHJhbnNwb3J0KCkge1xuICAgIHJldHVybiB0aGlzLmluaXRpYWxpemVkO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgbmV0d29yayBwcm9iZSB0byBjaGVjayBpZiBjb25uZWN0aW9uIGlzIGluZGVlZCBsaXZlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNvbm5lY3Rpb24jXG4gICAqL1xuICBwcm9iZSgpIHtcbiAgICB0aGlzLnNlbmRUZXh0KCcxJyk7XG4gIH1cblxuICAvKipcbiAgICogUmVzZXQgYXV0b3JlY29ubmVjdCBjb3VudGVyIHRvIHplcm8uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ29ubmVjdGlvbiNcbiAgICovXG4gIGJhY2tvZmZSZXNldCgpIHtcbiAgICB0aGlzLiNib2ZmUmVzZXQoKTtcbiAgfVxuXG4gIC8vIEJhY2tvZmYgaW1wbGVtZW50YXRpb24gLSByZWNvbm5lY3QgYWZ0ZXIgYSB0aW1lb3V0LlxuICAjYm9mZlJlY29ubmVjdCgpIHtcbiAgICAvLyBDbGVhciB0aW1lclxuICAgIGNsZWFyVGltZW91dCh0aGlzLiNib2ZmVGltZXIpO1xuICAgIC8vIENhbGN1bGF0ZSB3aGVuIHRvIGZpcmUgdGhlIHJlY29ubmVjdCBhdHRlbXB0XG4gICAgY29uc3QgdGltZW91dCA9IF9CT0ZGX0JBU0UgKiAoTWF0aC5wb3coMiwgdGhpcy4jYm9mZkl0ZXJhdGlvbikgKiAoMS4wICsgX0JPRkZfSklUVEVSICogTWF0aC5yYW5kb20oKSkpO1xuICAgIC8vIFVwZGF0ZSBpdGVyYXRpb24gY291bnRlciBmb3IgZnV0dXJlIHVzZVxuICAgIHRoaXMuI2JvZmZJdGVyYXRpb24gPSAodGhpcy4jYm9mZkl0ZXJhdGlvbiA+PSBfQk9GRl9NQVhfSVRFUiA/IHRoaXMuI2JvZmZJdGVyYXRpb24gOiB0aGlzLiNib2ZmSXRlcmF0aW9uICsgMSk7XG4gICAgaWYgKHRoaXMub25BdXRvcmVjb25uZWN0SXRlcmF0aW9uKSB7XG4gICAgICB0aGlzLm9uQXV0b3JlY29ubmVjdEl0ZXJhdGlvbih0aW1lb3V0KTtcbiAgICB9XG5cbiAgICB0aGlzLiNib2ZmVGltZXIgPSBzZXRUaW1lb3V0KF8gPT4ge1xuICAgICAgQ29ubmVjdGlvbi4jbG9nKGBSZWNvbm5lY3RpbmcsIGl0ZXI9JHt0aGlzLiNib2ZmSXRlcmF0aW9ufSwgdGltZW91dD0ke3RpbWVvdXR9YCk7XG4gICAgICAvLyBNYXliZSB0aGUgc29ja2V0IHdhcyBjbG9zZWQgd2hpbGUgd2Ugd2FpdGVkIGZvciB0aGUgdGltZXI/XG4gICAgICBpZiAoIXRoaXMuI2JvZmZDbG9zZWQpIHtcbiAgICAgICAgY29uc3QgcHJvbSA9IHRoaXMuY29ubmVjdCgpO1xuICAgICAgICBpZiAodGhpcy5vbkF1dG9yZWNvbm5lY3RJdGVyYXRpb24pIHtcbiAgICAgICAgICB0aGlzLm9uQXV0b3JlY29ubmVjdEl0ZXJhdGlvbigwLCBwcm9tKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBTdXBwcmVzcyBlcnJvciBpZiBpdCdzIG5vdCB1c2VkLlxuICAgICAgICAgIHByb20uY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgLyogZG8gbm90aGluZyAqL1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHRoaXMub25BdXRvcmVjb25uZWN0SXRlcmF0aW9uKSB7XG4gICAgICAgIHRoaXMub25BdXRvcmVjb25uZWN0SXRlcmF0aW9uKC0xKTtcbiAgICAgIH1cbiAgICB9LCB0aW1lb3V0KTtcbiAgfVxuXG4gIC8vIFRlcm1pbmF0ZSBhdXRvLXJlY29ubmVjdCBwcm9jZXNzLlxuICAjYm9mZlN0b3AoKSB7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuI2JvZmZUaW1lcik7XG4gICAgdGhpcy4jYm9mZlRpbWVyID0gbnVsbDtcbiAgfVxuXG4gIC8vIFJlc2V0IGF1dG8tcmVjb25uZWN0IGl0ZXJhdGlvbiBjb3VudGVyLlxuICAjYm9mZlJlc2V0KCkge1xuICAgIHRoaXMuI2JvZmZJdGVyYXRpb24gPSAwO1xuICB9XG5cbiAgLy8gSW5pdGlhbGl6YXRpb24gZm9yIGxvbmcgcG9sbGluZy5cbiAgI2luaXRfbHAoKSB7XG4gICAgY29uc3QgWERSX1VOU0VOVCA9IDA7IC8vIENsaWVudCBoYXMgYmVlbiBjcmVhdGVkLiBvcGVuKCkgbm90IGNhbGxlZCB5ZXQuXG4gICAgY29uc3QgWERSX09QRU5FRCA9IDE7IC8vIG9wZW4oKSBoYXMgYmVlbiBjYWxsZWQuXG4gICAgY29uc3QgWERSX0hFQURFUlNfUkVDRUlWRUQgPSAyOyAvLyBzZW5kKCkgaGFzIGJlZW4gY2FsbGVkLCBhbmQgaGVhZGVycyBhbmQgc3RhdHVzIGFyZSBhdmFpbGFibGUuXG4gICAgY29uc3QgWERSX0xPQURJTkcgPSAzOyAvLyBEb3dubG9hZGluZzsgcmVzcG9uc2VUZXh0IGhvbGRzIHBhcnRpYWwgZGF0YS5cbiAgICBjb25zdCBYRFJfRE9ORSA9IDQ7IC8vIFRoZSBvcGVyYXRpb24gaXMgY29tcGxldGUuXG5cbiAgICAvLyBGdWxseSBjb21wb3NlZCBlbmRwb2ludCBVUkwsIHdpdGggQVBJIGtleSAmIFNJRFxuICAgIGxldCBfbHBVUkwgPSBudWxsO1xuXG4gICAgbGV0IF9wb2xsZXIgPSBudWxsO1xuICAgIGxldCBfc2VuZGVyID0gbnVsbDtcblxuICAgIGxldCBscF9zZW5kZXIgPSAodXJsXykgPT4ge1xuICAgICAgY29uc3Qgc2VuZGVyID0gbmV3IFhIUlByb3ZpZGVyKCk7XG4gICAgICBzZW5kZXIub25yZWFkeXN0YXRlY2hhbmdlID0gKGV2dCkgPT4ge1xuICAgICAgICBpZiAoc2VuZGVyLnJlYWR5U3RhdGUgPT0gWERSX0RPTkUgJiYgc2VuZGVyLnN0YXR1cyA+PSA0MDApIHtcbiAgICAgICAgICAvLyBTb21lIHNvcnQgb2YgZXJyb3IgcmVzcG9uc2VcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYExQIHNlbmRlciBmYWlsZWQsICR7c2VuZGVyLnN0YXR1c31gKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgc2VuZGVyLm9wZW4oJ1BPU1QnLCB1cmxfLCB0cnVlKTtcbiAgICAgIHJldHVybiBzZW5kZXI7XG4gICAgfVxuXG4gICAgbGV0IGxwX3BvbGxlciA9ICh1cmxfLCByZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGxldCBwb2xsZXIgPSBuZXcgWEhSUHJvdmlkZXIoKTtcbiAgICAgIGxldCBwcm9taXNlQ29tcGxldGVkID0gZmFsc2U7XG5cbiAgICAgIHBvbGxlci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoZXZ0KSA9PiB7XG4gICAgICAgIGlmIChwb2xsZXIucmVhZHlTdGF0ZSA9PSBYRFJfRE9ORSkge1xuICAgICAgICAgIGlmIChwb2xsZXIuc3RhdHVzID09IDIwMSkgeyAvLyAyMDEgPT0gSFRUUC5DcmVhdGVkLCBnZXQgU0lEXG4gICAgICAgICAgICBsZXQgcGt0ID0gSlNPTi5wYXJzZShwb2xsZXIucmVzcG9uc2VUZXh0LCBqc29uUGFyc2VIZWxwZXIpO1xuICAgICAgICAgICAgX2xwVVJMID0gdXJsXyArICcmc2lkPScgKyBwa3QuY3RybC5wYXJhbXMuc2lkO1xuICAgICAgICAgICAgcG9sbGVyID0gbHBfcG9sbGVyKF9scFVSTCk7XG4gICAgICAgICAgICBwb2xsZXIuc2VuZChudWxsKTtcbiAgICAgICAgICAgIGlmICh0aGlzLm9uT3Blbikge1xuICAgICAgICAgICAgICB0aGlzLm9uT3BlbigpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocmVzb2x2ZSkge1xuICAgICAgICAgICAgICBwcm9taXNlQ29tcGxldGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5hdXRvcmVjb25uZWN0KSB7XG4gICAgICAgICAgICAgIHRoaXMuI2JvZmZTdG9wKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChwb2xsZXIuc3RhdHVzIDwgNDAwKSB7IC8vIDQwMCA9IEhUVFAuQmFkUmVxdWVzdFxuICAgICAgICAgICAgaWYgKHRoaXMub25NZXNzYWdlKSB7XG4gICAgICAgICAgICAgIHRoaXMub25NZXNzYWdlKHBvbGxlci5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcG9sbGVyID0gbHBfcG9sbGVyKF9scFVSTCk7XG4gICAgICAgICAgICBwb2xsZXIuc2VuZChudWxsKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gRG9uJ3QgdGhyb3cgYW4gZXJyb3IgaGVyZSwgZ3JhY2VmdWxseSBoYW5kbGUgc2VydmVyIGVycm9yc1xuICAgICAgICAgICAgaWYgKHJlamVjdCAmJiAhcHJvbWlzZUNvbXBsZXRlZCkge1xuICAgICAgICAgICAgICBwcm9taXNlQ29tcGxldGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgcmVqZWN0KHBvbGxlci5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMub25NZXNzYWdlICYmIHBvbGxlci5yZXNwb25zZVRleHQpIHtcbiAgICAgICAgICAgICAgdGhpcy5vbk1lc3NhZ2UocG9sbGVyLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5vbkRpc2Nvbm5lY3QpIHtcbiAgICAgICAgICAgICAgY29uc3QgY29kZSA9IHBvbGxlci5zdGF0dXMgfHwgKHRoaXMuI2JvZmZDbG9zZWQgPyBORVRXT1JLX1VTRVIgOiBORVRXT1JLX0VSUk9SKTtcbiAgICAgICAgICAgICAgY29uc3QgdGV4dCA9IHBvbGxlci5yZXNwb25zZVRleHQgfHwgKHRoaXMuI2JvZmZDbG9zZWQgPyBORVRXT1JLX1VTRVJfVEVYVCA6IE5FVFdPUktfRVJST1JfVEVYVCk7XG4gICAgICAgICAgICAgIHRoaXMub25EaXNjb25uZWN0KG5ldyBFcnJvcih0ZXh0ICsgJyAoJyArIGNvZGUgKyAnKScpLCBjb2RlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gUG9sbGluZyBoYXMgc3RvcHBlZC4gSW5kaWNhdGUgaXQgYnkgc2V0dGluZyBwb2xsZXIgdG8gbnVsbC5cbiAgICAgICAgICAgIHBvbGxlciA9IG51bGw7XG4gICAgICAgICAgICBpZiAoIXRoaXMuI2JvZmZDbG9zZWQgJiYgdGhpcy5hdXRvcmVjb25uZWN0KSB7XG4gICAgICAgICAgICAgIHRoaXMuI2JvZmZSZWNvbm5lY3QoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICAvLyBVc2luZyBQT1NUIHRvIGF2b2lkIGNhY2hpbmcgcmVzcG9uc2UgYnkgc2VydmljZSB3b3JrZXIuXG4gICAgICBwb2xsZXIub3BlbignUE9TVCcsIHVybF8sIHRydWUpO1xuICAgICAgcmV0dXJuIHBvbGxlcjtcbiAgICB9XG5cbiAgICB0aGlzLmNvbm5lY3QgPSAoaG9zdF8sIGZvcmNlKSA9PiB7XG4gICAgICB0aGlzLiNib2ZmQ2xvc2VkID0gZmFsc2U7XG5cbiAgICAgIGlmIChfcG9sbGVyKSB7XG4gICAgICAgIGlmICghZm9yY2UpIHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgICAgICAgX3BvbGxlci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSB1bmRlZmluZWQ7XG4gICAgICAgIF9wb2xsZXIuYWJvcnQoKTtcbiAgICAgICAgX3BvbGxlciA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIGlmIChob3N0Xykge1xuICAgICAgICB0aGlzLmhvc3QgPSBob3N0XztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgY29uc3QgdXJsID0gbWFrZUJhc2VVcmwodGhpcy5ob3N0LCB0aGlzLnNlY3VyZSA/ICdodHRwcycgOiAnaHR0cCcsIHRoaXMudmVyc2lvbiwgdGhpcy5hcGlLZXkpO1xuICAgICAgICBDb25uZWN0aW9uLiNsb2coXCJMUCBjb25uZWN0aW5nIHRvOlwiLCB1cmwpO1xuICAgICAgICBfcG9sbGVyID0gbHBfcG9sbGVyKHVybCwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgX3BvbGxlci5zZW5kKG51bGwpO1xuICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICBDb25uZWN0aW9uLiNsb2coXCJMUCBjb25uZWN0aW9uIGZhaWxlZDpcIiwgZXJyKTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICB0aGlzLnJlY29ubmVjdCA9IChmb3JjZSkgPT4ge1xuICAgICAgdGhpcy4jYm9mZlN0b3AoKTtcbiAgICAgIHRoaXMuY29ubmVjdChudWxsLCBmb3JjZSk7XG4gICAgfTtcblxuICAgIHRoaXMuZGlzY29ubmVjdCA9ICgpID0+IHtcbiAgICAgIHRoaXMuI2JvZmZDbG9zZWQgPSB0cnVlO1xuICAgICAgdGhpcy4jYm9mZlN0b3AoKTtcblxuICAgICAgaWYgKF9zZW5kZXIpIHtcbiAgICAgICAgX3NlbmRlci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSB1bmRlZmluZWQ7XG4gICAgICAgIF9zZW5kZXIuYWJvcnQoKTtcbiAgICAgICAgX3NlbmRlciA9IG51bGw7XG4gICAgICB9XG4gICAgICBpZiAoX3BvbGxlcikge1xuICAgICAgICBfcG9sbGVyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgX3BvbGxlci5hYm9ydCgpO1xuICAgICAgICBfcG9sbGVyID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMub25EaXNjb25uZWN0KSB7XG4gICAgICAgIHRoaXMub25EaXNjb25uZWN0KG5ldyBFcnJvcihORVRXT1JLX1VTRVJfVEVYVCArICcgKCcgKyBORVRXT1JLX1VTRVIgKyAnKScpLCBORVRXT1JLX1VTRVIpO1xuICAgICAgfVxuICAgICAgLy8gRW5zdXJlIGl0J3MgcmVjb25zdHJ1Y3RlZFxuICAgICAgX2xwVVJMID0gbnVsbDtcbiAgICB9O1xuXG4gICAgdGhpcy5zZW5kVGV4dCA9IChtc2cpID0+IHtcbiAgICAgIF9zZW5kZXIgPSBscF9zZW5kZXIoX2xwVVJMKTtcbiAgICAgIGlmIChfc2VuZGVyICYmIChfc2VuZGVyLnJlYWR5U3RhdGUgPT0gWERSX09QRU5FRCkpIHsgLy8gMSA9PSBPUEVORURcbiAgICAgICAgX3NlbmRlci5zZW5kKG1zZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJMb25nIHBvbGxlciBmYWlsZWQgdG8gY29ubmVjdFwiKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy5pc0Nvbm5lY3RlZCA9ICgpID0+IHtcbiAgICAgIHJldHVybiAoX3BvbGxlciAmJiB0cnVlKTtcbiAgICB9O1xuICB9XG5cbiAgLy8gSW5pdGlhbGl6YXRpb24gZm9yIFdlYnNvY2tldFxuICAjaW5pdF93cygpIHtcbiAgICB0aGlzLmNvbm5lY3QgPSAoaG9zdF8sIGZvcmNlKSA9PiB7XG4gICAgICB0aGlzLiNib2ZmQ2xvc2VkID0gZmFsc2U7XG5cbiAgICAgIGlmICh0aGlzLiNzb2NrZXQpIHtcbiAgICAgICAgaWYgKCFmb3JjZSAmJiB0aGlzLiNzb2NrZXQucmVhZHlTdGF0ZSA9PSB0aGlzLiNzb2NrZXQuT1BFTikge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLiNzb2NrZXQuY2xvc2UoKTtcbiAgICAgICAgdGhpcy4jc29ja2V0ID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgaWYgKGhvc3RfKSB7XG4gICAgICAgIHRoaXMuaG9zdCA9IGhvc3RfO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBjb25zdCB1cmwgPSBtYWtlQmFzZVVybCh0aGlzLmhvc3QsIHRoaXMuc2VjdXJlID8gJ3dzcycgOiAnd3MnLCB0aGlzLnZlcnNpb24sIHRoaXMuYXBpS2V5KTtcblxuICAgICAgICBDb25uZWN0aW9uLiNsb2coXCJXUyBjb25uZWN0aW5nIHRvOiBcIiwgdXJsKTtcblxuICAgICAgICAvLyBJdCB0aHJvd3Mgd2hlbiB0aGUgc2VydmVyIGlzIG5vdCBhY2Nlc3NpYmxlIGJ1dCB0aGUgZXhjZXB0aW9uIGNhbm5vdCBiZSBjYXVnaHQ6XG4gICAgICAgIC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzMxMDAyNTkyL2phdmFzY3JpcHQtZG9lc250LWNhdGNoLWVycm9yLWluLXdlYnNvY2tldC1pbnN0YW50aWF0aW9uLzMxMDAzMDU3XG4gICAgICAgIGNvbnN0IGNvbm4gPSBuZXcgV2ViU29ja2V0UHJvdmlkZXIodXJsKTtcblxuICAgICAgICBjb25uLm9uZXJyb3IgPSAoZXJyKSA9PiB7XG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29ubi5vbm9wZW4gPSAoZXZ0KSA9PiB7XG4gICAgICAgICAgaWYgKHRoaXMuYXV0b3JlY29ubmVjdCkge1xuICAgICAgICAgICAgdGhpcy4jYm9mZlN0b3AoKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodGhpcy5vbk9wZW4pIHtcbiAgICAgICAgICAgIHRoaXMub25PcGVuKCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbm4ub25jbG9zZSA9IChldnQpID0+IHtcbiAgICAgICAgICB0aGlzLiNzb2NrZXQgPSBudWxsO1xuXG4gICAgICAgICAgaWYgKHRoaXMub25EaXNjb25uZWN0KSB7XG4gICAgICAgICAgICBjb25zdCBjb2RlID0gdGhpcy4jYm9mZkNsb3NlZCA/IE5FVFdPUktfVVNFUiA6IE5FVFdPUktfRVJST1I7XG4gICAgICAgICAgICB0aGlzLm9uRGlzY29ubmVjdChuZXcgRXJyb3IodGhpcy4jYm9mZkNsb3NlZCA/IE5FVFdPUktfVVNFUl9URVhUIDogTkVUV09SS19FUlJPUl9URVhUICtcbiAgICAgICAgICAgICAgJyAoJyArIGNvZGUgKyAnKScpLCBjb2RlKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoIXRoaXMuI2JvZmZDbG9zZWQgJiYgdGhpcy5hdXRvcmVjb25uZWN0KSB7XG4gICAgICAgICAgICB0aGlzLiNib2ZmUmVjb25uZWN0KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbm4ub25tZXNzYWdlID0gKGV2dCkgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLm9uTWVzc2FnZSkge1xuICAgICAgICAgICAgdGhpcy5vbk1lc3NhZ2UoZXZ0LmRhdGEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLiNzb2NrZXQgPSBjb25uO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5yZWNvbm5lY3QgPSAoZm9yY2UpID0+IHtcbiAgICAgIHRoaXMuI2JvZmZTdG9wKCk7XG4gICAgICB0aGlzLmNvbm5lY3QobnVsbCwgZm9yY2UpO1xuICAgIH07XG5cbiAgICB0aGlzLmRpc2Nvbm5lY3QgPSAoKSA9PiB7XG4gICAgICB0aGlzLiNib2ZmQ2xvc2VkID0gdHJ1ZTtcbiAgICAgIHRoaXMuI2JvZmZTdG9wKCk7XG5cbiAgICAgIGlmICghdGhpcy4jc29ja2V0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHRoaXMuI3NvY2tldC5jbG9zZSgpO1xuICAgICAgdGhpcy4jc29ja2V0ID0gbnVsbDtcbiAgICB9O1xuXG4gICAgdGhpcy5zZW5kVGV4dCA9IChtc2cpID0+IHtcbiAgICAgIGlmICh0aGlzLiNzb2NrZXQgJiYgKHRoaXMuI3NvY2tldC5yZWFkeVN0YXRlID09IHRoaXMuI3NvY2tldC5PUEVOKSkge1xuICAgICAgICB0aGlzLiNzb2NrZXQuc2VuZChtc2cpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiV2Vic29ja2V0IGlzIG5vdCBjb25uZWN0ZWRcIik7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRoaXMuaXNDb25uZWN0ZWQgPSAoKSA9PiB7XG4gICAgICByZXR1cm4gKHRoaXMuI3NvY2tldCAmJiAodGhpcy4jc29ja2V0LnJlYWR5U3RhdGUgPT0gdGhpcy4jc29ja2V0Lk9QRU4pKTtcbiAgICB9O1xuICB9XG5cbiAgLy8gQ2FsbGJhY2tzOlxuXG4gIC8qKlxuICAgKiBBIGNhbGxiYWNrIHRvIHBhc3MgaW5jb21pbmcgbWVzc2FnZXMgdG8uIFNlZSB7QGxpbmsgVGlub2RlLkNvbm5lY3Rpb24jb25NZXNzYWdlfS5cbiAgICogQGNhbGxiYWNrIFRpbm9kZS5Db25uZWN0aW9uLk9uTWVzc2FnZVxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNvbm5lY3Rpb25cbiAgICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2UgLSBNZXNzYWdlIHRvIHByb2Nlc3MuXG4gICAqL1xuICBvbk1lc3NhZ2UgPSB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIEEgY2FsbGJhY2sgZm9yIHJlcG9ydGluZyBhIGRyb3BwZWQgY29ubmVjdGlvbi5cbiAgICogQHR5cGUge2Z1bmN0aW9ufVxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNvbm5lY3Rpb24jXG4gICAqL1xuICBvbkRpc2Nvbm5lY3QgPSB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIEEgY2FsbGJhY2sgY2FsbGVkIHdoZW4gdGhlIGNvbm5lY3Rpb24gaXMgcmVhZHkgdG8gYmUgdXNlZCBmb3Igc2VuZGluZy4gRm9yIHdlYnNvY2tldHMgaXQncyBzb2NrZXQgb3BlbixcbiAgICogZm9yIGxvbmcgcG9sbGluZyBpdCdzIDxjb2RlPnJlYWR5U3RhdGU9MTwvY29kZT4gKE9QRU5FRClcbiAgICogQHR5cGUge2Z1bmN0aW9ufVxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNvbm5lY3Rpb24jXG4gICAqL1xuICBvbk9wZW4gPSB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIEEgY2FsbGJhY2sgdG8gbm90aWZ5IG9mIHJlY29ubmVjdGlvbiBhdHRlbXB0cy4gU2VlIHtAbGluayBUaW5vZGUuQ29ubmVjdGlvbiNvbkF1dG9yZWNvbm5lY3RJdGVyYXRpb259LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNvbm5lY3Rpb25cbiAgICogQGNhbGxiYWNrIEF1dG9yZWNvbm5lY3RJdGVyYXRpb25UeXBlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0aW1lb3V0IC0gdGltZSB0aWxsIHRoZSBuZXh0IHJlY29ubmVjdCBhdHRlbXB0IGluIG1pbGxpc2Vjb25kcy4gPGNvZGU+LTE8L2NvZGU+IG1lYW5zIHJlY29ubmVjdCB3YXMgc2tpcHBlZC5cbiAgICogQHBhcmFtIHtQcm9taXNlfSBwcm9taXNlIHJlc29sdmVkIG9yIHJlamVjdGVkIHdoZW4gdGhlIHJlY29ubmVjdCBhdHRlbXAgY29tcGxldGVzLlxuICAgKlxuICAgKi9cbiAgLyoqXG4gICAqIEEgY2FsbGJhY2sgdG8gaW5mb3JtIHdoZW4gdGhlIG5leHQgYXR0YW1wdCB0byByZWNvbm5lY3Qgd2lsbCBoYXBwZW4gYW5kIHRvIHJlY2VpdmUgY29ubmVjdGlvbiBwcm9taXNlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNvbm5lY3Rpb24jXG4gICAqIEB0eXBlIHtUaW5vZGUuQ29ubmVjdGlvbi5BdXRvcmVjb25uZWN0SXRlcmF0aW9uVHlwZX1cbiAgICovXG4gIG9uQXV0b3JlY29ubmVjdEl0ZXJhdGlvbiA9IHVuZGVmaW5lZDtcbn1cblxuQ29ubmVjdGlvbi5ORVRXT1JLX0VSUk9SID0gTkVUV09SS19FUlJPUjtcbkNvbm5lY3Rpb24uTkVUV09SS19FUlJPUl9URVhUID0gTkVUV09SS19FUlJPUl9URVhUO1xuQ29ubmVjdGlvbi5ORVRXT1JLX1VTRVIgPSBORVRXT1JLX1VTRVI7XG5Db25uZWN0aW9uLk5FVFdPUktfVVNFUl9URVhUID0gTkVUV09SS19VU0VSX1RFWFQ7XG4iLCIvKipcbiAqIEBmaWxlIEhlbHBlciBtZXRob2RzIGZvciBkZWFsaW5nIHdpdGggSW5kZXhlZERCIGNhY2hlIG9mIG1lc3NhZ2VzLCB1c2VycywgYW5kIHRvcGljcy5cbiAqXG4gKiBAY29weXJpZ2h0IDIwMTUtMjAyMiBUaW5vZGUgTExDLlxuICovXG4ndXNlIHN0cmljdCc7XG5cbi8vIE5PVEUgVE8gREVWRUxPUEVSUzpcbi8vIExvY2FsaXphYmxlIHN0cmluZ3Mgc2hvdWxkIGJlIGRvdWJsZSBxdW90ZWQgXCLRgdGC0YDQvtC60LAg0L3QsCDQtNGA0YPQs9C+0Lwg0Y/Qt9GL0LrQtVwiLFxuLy8gbm9uLWxvY2FsaXphYmxlIHN0cmluZ3Mgc2hvdWxkIGJlIHNpbmdsZSBxdW90ZWQgJ25vbi1sb2NhbGl6ZWQnLlxuXG5jb25zdCBEQl9WRVJTSU9OID0gMTtcbmNvbnN0IERCX05BTUUgPSAndGlub2RlLXdlYic7XG5cbmxldCBJREJQcm92aWRlcjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgREIge1xuICAjb25FcnJvciA9IF8gPT4ge307XG4gICNsb2dnZXIgPSBfID0+IHt9O1xuXG4gIC8vIEluc3RhbmNlIG9mIEluZGV4REIuXG4gIGRiID0gbnVsbDtcbiAgLy8gSW5kaWNhdG9yIHRoYXQgdGhlIGNhY2hlIGlzIGRpc2FibGVkLlxuICBkaXNhYmxlZCA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKG9uRXJyb3IsIGxvZ2dlcikge1xuICAgIHRoaXMuI29uRXJyb3IgPSBvbkVycm9yIHx8IHRoaXMuI29uRXJyb3I7XG4gICAgdGhpcy4jbG9nZ2VyID0gbG9nZ2VyIHx8IHRoaXMuI2xvZ2dlcjtcbiAgfVxuXG4gICNtYXBPYmplY3RzKHNvdXJjZSwgY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICBpZiAoIXRoaXMuZGIpIHtcbiAgICAgIHJldHVybiBkaXNhYmxlZCA/XG4gICAgICAgIFByb21pc2UucmVzb2x2ZShbXSkgOlxuICAgICAgICBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJub3QgaW5pdGlhbGl6ZWRcIikpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCB0cnggPSB0aGlzLmRiLnRyYW5zYWN0aW9uKFtzb3VyY2VdKTtcbiAgICAgIHRyeC5vbmVycm9yID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuI2xvZ2dlcignUENhY2hlJywgJ21hcE9iamVjdHMnLCBzb3VyY2UsIGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICAgIHJlamVjdChldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgfTtcbiAgICAgIHRyeC5vYmplY3RTdG9yZShzb3VyY2UpLmdldEFsbCgpLm9uc3VjY2VzcyA9IChldmVudCkgPT4ge1xuICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICBldmVudC50YXJnZXQucmVzdWx0LmZvckVhY2goKHRvcGljKSA9PiB7XG4gICAgICAgICAgICBjYWxsYmFjay5jYWxsKGNvbnRleHQsIHRvcGljKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXNvbHZlKGV2ZW50LnRhcmdldC5yZXN1bHQpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIHBlcnNpc3RlbnQgY2FjaGU6IG9wZW4gb3IgY3JlYXRlL3VwZ3JhZGUgaWYgbmVlZGVkLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gcHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBEQiBpcyBpbml0aWFsaXplZC5cbiAgICovXG4gIGluaXREYXRhYmFzZSgpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgLy8gT3BlbiB0aGUgZGF0YWJhc2UgYW5kIGluaXRpYWxpemUgY2FsbGJhY2tzLlxuICAgICAgY29uc3QgcmVxID0gSURCUHJvdmlkZXIub3BlbihEQl9OQU1FLCBEQl9WRVJTSU9OKTtcbiAgICAgIHJlcS5vbnN1Y2Nlc3MgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy5kYiA9IGV2ZW50LnRhcmdldC5yZXN1bHQ7XG4gICAgICAgIHRoaXMuZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgcmVzb2x2ZSh0aGlzLmRiKTtcbiAgICAgIH07XG4gICAgICByZXEub25lcnJvciA9IChldmVudCkgPT4ge1xuICAgICAgICB0aGlzLiNsb2dnZXIoJ1BDYWNoZScsIFwiZmFpbGVkIHRvIGluaXRpYWxpemVcIiwgZXZlbnQpO1xuICAgICAgICByZWplY3QoZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgICAgdGhpcy4jb25FcnJvcihldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgfTtcbiAgICAgIHJlcS5vbnVwZ3JhZGVuZWVkZWQgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICB0aGlzLmRiID0gZXZlbnQudGFyZ2V0LnJlc3VsdDtcblxuICAgICAgICB0aGlzLmRiLm9uZXJyb3IgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgIHRoaXMuI2xvZ2dlcignUENhY2hlJywgXCJmYWlsZWQgdG8gY3JlYXRlIHN0b3JhZ2VcIiwgZXZlbnQpO1xuICAgICAgICAgIHRoaXMuI29uRXJyb3IoZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBJbmRpdmlkdWFsIG9iamVjdCBzdG9yZXMuXG4gICAgICAgIC8vIE9iamVjdCBzdG9yZSAodGFibGUpIGZvciB0b3BpY3MuIFRoZSBwcmltYXJ5IGtleSBpcyB0b3BpYyBuYW1lLlxuICAgICAgICB0aGlzLmRiLmNyZWF0ZU9iamVjdFN0b3JlKCd0b3BpYycsIHtcbiAgICAgICAgICBrZXlQYXRoOiAnbmFtZSdcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gVXNlcnMgb2JqZWN0IHN0b3JlLiBVSUQgaXMgdGhlIHByaW1hcnkga2V5LlxuICAgICAgICB0aGlzLmRiLmNyZWF0ZU9iamVjdFN0b3JlKCd1c2VyJywge1xuICAgICAgICAgIGtleVBhdGg6ICd1aWQnXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFN1YnNjcmlwdGlvbnMgb2JqZWN0IHN0b3JlIHRvcGljIDwtPiB1c2VyLiBUb3BpYyBuYW1lICsgVUlEIGlzIHRoZSBwcmltYXJ5IGtleS5cbiAgICAgICAgdGhpcy5kYi5jcmVhdGVPYmplY3RTdG9yZSgnc3Vic2NyaXB0aW9uJywge1xuICAgICAgICAgIGtleVBhdGg6IFsndG9waWMnLCAndWlkJ11cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gTWVzc2FnZXMgb2JqZWN0IHN0b3JlLiBUaGUgcHJpbWFyeSBrZXkgaXMgdG9waWMgbmFtZSArIHNlcS5cbiAgICAgICAgdGhpcy5kYi5jcmVhdGVPYmplY3RTdG9yZSgnbWVzc2FnZScsIHtcbiAgICAgICAgICBrZXlQYXRoOiBbJ3RvcGljJywgJ3NlcSddXG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWxldGUgcGVyc2lzdGVudCBjYWNoZS5cbiAgICovXG4gIGRlbGV0ZURhdGFiYXNlKCkge1xuICAgIC8vIENsb3NlIGNvbm5lY3Rpb24sIG90aGVyd2lzZSBvcGVyYXRpb25zIHdpbGwgZmFpbCB3aXRoICdvbmJsb2NrZWQnLlxuICAgIGlmICh0aGlzLmRiKSB7XG4gICAgICB0aGlzLmRiLmNsb3NlKCk7XG4gICAgICB0aGlzLmRiID0gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IHJlcSA9IElEQlByb3ZpZGVyLmRlbGV0ZURhdGFiYXNlKERCX05BTUUpO1xuICAgICAgcmVxLm9uYmxvY2tlZCA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGlmICh0aGlzLmRiKSB7XG4gICAgICAgICAgdGhpcy5kYi5jbG9zZSgpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGVyciA9IG5ldyBFcnJvcihcImJsb2NrZWRcIik7XG4gICAgICAgIHRoaXMuI2xvZ2dlcignUENhY2hlJywgJ2RlbGV0ZURhdGFiYXNlJywgZXJyKTtcbiAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICB9O1xuICAgICAgcmVxLm9uc3VjY2VzcyA9IChldmVudCkgPT4ge1xuICAgICAgICB0aGlzLmRiID0gbnVsbDtcbiAgICAgICAgdGhpcy5kaXNhYmxlZCA9IHRydWU7XG4gICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICB9O1xuICAgICAgcmVxLm9uZXJyb3IgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy4jbG9nZ2VyKCdQQ2FjaGUnLCAnZGVsZXRlRGF0YWJhc2UnLCBldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgICByZWplY3QoZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgcGVyc2lzdGVudCBjYWNoZSBpcyByZWFkeSBmb3IgdXNlLlxuICAgKiBAbWVtYmVyT2YgREJcbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIGNhY2hlIGlzIHJlYWR5LCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgaXNSZWFkeSgpIHtcbiAgICByZXR1cm4gISF0aGlzLmRiO1xuICB9XG5cbiAgLy8gVG9waWNzLlxuXG4gIC8qKlxuICAgKiBTYXZlIHRvIGNhY2hlIG9yIHVwZGF0ZSB0b3BpYyBpbiBwZXJzaXN0ZW50IGNhY2hlLlxuICAgKiBAbWVtYmVyT2YgREJcbiAgICogQHBhcmFtIHtUb3BpY30gdG9waWMgLSB0b3BpYyB0byBiZSBhZGRlZCBvciB1cGRhdGVkLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gcHJvbWlzZSByZXNvbHZlZC9yZWplY3RlZCBvbiBvcGVyYXRpb24gY29tcGxldGlvbi5cbiAgICovXG4gIHVwZFRvcGljKHRvcGljKSB7XG4gICAgaWYgKCF0aGlzLmlzUmVhZHkoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZGlzYWJsZWQgP1xuICAgICAgICBQcm9taXNlLnJlc29sdmUoKSA6XG4gICAgICAgIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIm5vdCBpbml0aWFsaXplZFwiKSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCB0cnggPSB0aGlzLmRiLnRyYW5zYWN0aW9uKFsndG9waWMnXSwgJ3JlYWR3cml0ZScpO1xuICAgICAgdHJ4Lm9uY29tcGxldGUgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgcmVzb2x2ZShldmVudC50YXJnZXQucmVzdWx0KTtcbiAgICAgIH07XG4gICAgICB0cngub25lcnJvciA9IChldmVudCkgPT4ge1xuICAgICAgICB0aGlzLiNsb2dnZXIoJ1BDYWNoZScsICd1cGRUb3BpYycsIGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICAgIHJlamVjdChldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgfTtcbiAgICAgIGNvbnN0IHJlcSA9IHRyeC5vYmplY3RTdG9yZSgndG9waWMnKS5nZXQodG9waWMubmFtZSk7XG4gICAgICByZXEub25zdWNjZXNzID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHRyeC5vYmplY3RTdG9yZSgndG9waWMnKS5wdXQoREIuI3NlcmlhbGl6ZVRvcGljKHJlcS5yZXN1bHQsIHRvcGljKSk7XG4gICAgICAgIHRyeC5jb21taXQoKTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogTWFyayBvciB1bm1hcmsgdG9waWMgYXMgZGVsZXRlZC5cbiAgICogQG1lbWJlck9mIERCXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gbmFtZSBvZiB0aGUgdG9waWMgdG8gbWFyayBvciB1bm1hcmsuXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IHByb21pc2UgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gb3BlcmF0aW9uIGNvbXBsZXRpb24uXG4gICAqL1xuICBtYXJrVG9waWNBc0RlbGV0ZWQobmFtZSkge1xuICAgIGlmICghdGhpcy5pc1JlYWR5KCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmRpc2FibGVkID9cbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkgOlxuICAgICAgICBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJub3QgaW5pdGlhbGl6ZWRcIikpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgdHJ4ID0gdGhpcy5kYi50cmFuc2FjdGlvbihbJ3RvcGljJ10sICdyZWFkd3JpdGUnKTtcbiAgICAgIHRyeC5vbmNvbXBsZXRlID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHJlc29sdmUoZXZlbnQudGFyZ2V0LnJlc3VsdCk7XG4gICAgICB9O1xuICAgICAgdHJ4Lm9uZXJyb3IgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy4jbG9nZ2VyKCdQQ2FjaGUnLCAnbWFya1RvcGljQXNEZWxldGVkJywgZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgICAgcmVqZWN0KGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICB9O1xuICAgICAgY29uc3QgcmVxID0gdHJ4Lm9iamVjdFN0b3JlKCd0b3BpYycpLmdldChuYW1lKTtcbiAgICAgIHJlcS5vbnN1Y2Nlc3MgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgY29uc3QgdG9waWMgPSBldmVudC50YXJnZXQucmVzdWx0O1xuICAgICAgICB0b3BpYy5fZGVsZXRlZCA9IHRydWU7XG4gICAgICAgIHRyeC5vYmplY3RTdG9yZSgndG9waWMnKS5wdXQodG9waWMpO1xuICAgICAgICB0cnguY29tbWl0KCk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSB0b3BpYyBmcm9tIHBlcnNpc3RlbnQgY2FjaGUuXG4gICAqIEBtZW1iZXJPZiBEQlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIG5hbWUgb2YgdGhlIHRvcGljIHRvIHJlbW92ZSBmcm9tIGRhdGFiYXNlLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBwcm9taXNlIHJlc29sdmVkL3JlamVjdGVkIG9uIG9wZXJhdGlvbiBjb21wbGV0aW9uLlxuICAgKi9cbiAgcmVtVG9waWMobmFtZSkge1xuICAgIGlmICghdGhpcy5pc1JlYWR5KCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmRpc2FibGVkID9cbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkgOlxuICAgICAgICBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJub3QgaW5pdGlhbGl6ZWRcIikpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgdHJ4ID0gdGhpcy5kYi50cmFuc2FjdGlvbihbJ3RvcGljJywgJ3N1YnNjcmlwdGlvbicsICdtZXNzYWdlJ10sICdyZWFkd3JpdGUnKTtcbiAgICAgIHRyeC5vbmNvbXBsZXRlID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHJlc29sdmUoZXZlbnQudGFyZ2V0LnJlc3VsdCk7XG4gICAgICB9O1xuICAgICAgdHJ4Lm9uZXJyb3IgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy4jbG9nZ2VyKCdQQ2FjaGUnLCAncmVtVG9waWMnLCBldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgICByZWplY3QoZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgIH07XG4gICAgICB0cngub2JqZWN0U3RvcmUoJ3RvcGljJykuZGVsZXRlKElEQktleVJhbmdlLm9ubHkobmFtZSkpO1xuICAgICAgdHJ4Lm9iamVjdFN0b3JlKCdzdWJzY3JpcHRpb24nKS5kZWxldGUoSURCS2V5UmFuZ2UuYm91bmQoW25hbWUsICctJ10sIFtuYW1lLCAnfiddKSk7XG4gICAgICB0cngub2JqZWN0U3RvcmUoJ21lc3NhZ2UnKS5kZWxldGUoSURCS2V5UmFuZ2UuYm91bmQoW25hbWUsIDBdLCBbbmFtZSwgTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVJdKSk7XG4gICAgICB0cnguY29tbWl0KCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogRXhlY3V0ZSBhIGNhbGxiYWNrIGZvciBlYWNoIHN0b3JlZCB0b3BpYy5cbiAgICogQG1lbWJlck9mIERCXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIC0gZnVuY3Rpb24gdG8gY2FsbCBmb3IgZWFjaCB0b3BpYy5cbiAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHQgLSB0aGUgdmFsdWUgb3IgPGNvZGU+dGhpczwvY29kZT4gaW5zaWRlIHRoZSBjYWxsYmFjay5cbiAgICogQHJldHVybiB7UHJvbWlzZX0gcHJvbWlzZSByZXNvbHZlZC9yZWplY3RlZCBvbiBvcGVyYXRpb24gY29tcGxldGlvbi5cbiAgICovXG4gIG1hcFRvcGljcyhjYWxsYmFjaywgY29udGV4dCkge1xuICAgIHJldHVybiB0aGlzLiNtYXBPYmplY3RzKCd0b3BpYycsIGNhbGxiYWNrLCBjb250ZXh0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb3B5IGRhdGEgZnJvbSBzZXJpYWxpemVkIG9iamVjdCB0byB0b3BpYy5cbiAgICogQG1lbWJlck9mIERCXG4gICAqIEBwYXJhbSB7VG9waWN9IHRvcGljIC0gdGFyZ2V0IHRvIGRlc2VyaWFsaXplIHRvLlxuICAgKiBAcGFyYW0ge09iamVjdH0gc3JjIC0gc2VyaWFsaXplZCBkYXRhIHRvIGNvcHkgZnJvbS5cbiAgICovXG4gIGRlc2VyaWFsaXplVG9waWModG9waWMsIHNyYykge1xuICAgIERCLiNkZXNlcmlhbGl6ZVRvcGljKHRvcGljLCBzcmMpO1xuICB9XG5cbiAgLy8gVXNlcnMuXG4gIC8qKlxuICAgKiBBZGQgb3IgdXBkYXRlIHVzZXIgb2JqZWN0IGluIHRoZSBwZXJzaXN0ZW50IGNhY2hlLlxuICAgKiBAbWVtYmVyT2YgREJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVpZCAtIElEIG9mIHRoZSB1c2VyIHRvIHNhdmUgb3IgdXBkYXRlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gcHViIC0gdXNlcidzIDxjb2RlPnB1YmxpYzwvY29kZT4gaW5mb3JtYXRpb24uXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBwcm9taXNlIHJlc29sdmVkL3JlamVjdGVkIG9uIG9wZXJhdGlvbiBjb21wbGV0aW9uLlxuICAgKi9cbiAgdXBkVXNlcih1aWQsIHB1Yikge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMiB8fCBwdWIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gTm8gcG9pbnQgaW51cGRhdGluZyB1c2VyIHdpdGggaW52YWxpZCBkYXRhLlxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuaXNSZWFkeSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5kaXNhYmxlZCA/XG4gICAgICAgIFByb21pc2UucmVzb2x2ZSgpIDpcbiAgICAgICAgUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwibm90IGluaXRpYWxpemVkXCIpKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IHRyeCA9IHRoaXMuZGIudHJhbnNhY3Rpb24oWyd1c2VyJ10sICdyZWFkd3JpdGUnKTtcbiAgICAgIHRyeC5vbmNvbXBsZXRlID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHJlc29sdmUoZXZlbnQudGFyZ2V0LnJlc3VsdCk7XG4gICAgICB9O1xuICAgICAgdHJ4Lm9uZXJyb3IgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy4jbG9nZ2VyKCdQQ2FjaGUnLCAndXBkVXNlcicsIGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICAgIHJlamVjdChldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgfTtcbiAgICAgIHRyeC5vYmplY3RTdG9yZSgndXNlcicpLnB1dCh7XG4gICAgICAgIHVpZDogdWlkLFxuICAgICAgICBwdWJsaWM6IHB1YlxuICAgICAgfSk7XG4gICAgICB0cnguY29tbWl0KCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIHVzZXIgZnJvbSBwZXJzaXN0ZW50IGNhY2hlLlxuICAgKiBAbWVtYmVyT2YgREJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVpZCAtIElEIG9mIHRoZSB1c2VyIHRvIHJlbW92ZSBmcm9tIHRoZSBjYWNoZS5cbiAgICogQHJldHVybiB7UHJvbWlzZX0gcHJvbWlzZSByZXNvbHZlZC9yZWplY3RlZCBvbiBvcGVyYXRpb24gY29tcGxldGlvbi5cbiAgICovXG4gIHJlbVVzZXIodWlkKSB7XG4gICAgaWYgKCF0aGlzLmlzUmVhZHkoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZGlzYWJsZWQgP1xuICAgICAgICBQcm9taXNlLnJlc29sdmUoKSA6XG4gICAgICAgIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIm5vdCBpbml0aWFsaXplZFwiKSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCB0cnggPSB0aGlzLmRiLnRyYW5zYWN0aW9uKFsndXNlciddLCAncmVhZHdyaXRlJyk7XG4gICAgICB0cngub25jb21wbGV0ZSA9IChldmVudCkgPT4ge1xuICAgICAgICByZXNvbHZlKGV2ZW50LnRhcmdldC5yZXN1bHQpO1xuICAgICAgfTtcbiAgICAgIHRyeC5vbmVycm9yID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuI2xvZ2dlcignUENhY2hlJywgJ3JlbVVzZXInLCBldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgICByZWplY3QoZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgIH07XG4gICAgICB0cngub2JqZWN0U3RvcmUoJ3VzZXInKS5kZWxldGUoSURCS2V5UmFuZ2Uub25seSh1aWQpKTtcbiAgICAgIHRyeC5jb21taXQoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeGVjdXRlIGEgY2FsbGJhY2sgZm9yIGVhY2ggc3RvcmVkIHVzZXIuXG4gICAqIEBtZW1iZXJPZiBEQlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayAtIGZ1bmN0aW9uIHRvIGNhbGwgZm9yIGVhY2ggdG9waWMuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZXh0IC0gdGhlIHZhbHVlIG9yIDxjb2RlPnRoaXM8L2NvZGU+IGluc2lkZSB0aGUgY2FsbGJhY2suXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IHByb21pc2UgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gb3BlcmF0aW9uIGNvbXBsZXRpb24uXG4gICAqL1xuICBtYXBVc2VycyhjYWxsYmFjaywgY29udGV4dCkge1xuICAgIHJldHVybiB0aGlzLiNtYXBPYmplY3RzKCd1c2VyJywgY2FsbGJhY2ssIGNvbnRleHQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlYWQgYSBzaW5nbGUgdXNlciBmcm9tIHBlcnNpc3RlbnQgY2FjaGUuXG4gICAqIEBtZW1iZXJPZiBEQlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdWlkIC0gSUQgb2YgdGhlIHVzZXIgdG8gZmV0Y2ggZnJvbSBjYWNoZS5cbiAgICogQHJldHVybiB7UHJvbWlzZX0gcHJvbWlzZSByZXNvbHZlZC9yZWplY3RlZCBvbiBvcGVyYXRpb24gY29tcGxldGlvbi5cbiAgICovXG4gIGdldFVzZXIodWlkKSB7XG4gICAgaWYgKCF0aGlzLmlzUmVhZHkoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZGlzYWJsZWQgP1xuICAgICAgICBQcm9taXNlLnJlc29sdmUoKSA6XG4gICAgICAgIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIm5vdCBpbml0aWFsaXplZFwiKSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCB0cnggPSB0aGlzLmRiLnRyYW5zYWN0aW9uKFsndXNlciddKTtcbiAgICAgIHRyeC5vbmNvbXBsZXRlID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIGNvbnN0IHVzZXIgPSBldmVudC50YXJnZXQucmVzdWx0O1xuICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICB1c2VyOiB1c2VyLnVpZCxcbiAgICAgICAgICBwdWJsaWM6IHVzZXIucHVibGljXG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIHRyeC5vbmVycm9yID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuI2xvZ2dlcignUENhY2hlJywgJ2dldFVzZXInLCBldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgICByZWplY3QoZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgIH07XG4gICAgICB0cngub2JqZWN0U3RvcmUoJ3VzZXInKS5nZXQodWlkKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIFN1YnNjcmlwdGlvbnMuXG4gIC8qKlxuICAgKiBBZGQgb3IgdXBkYXRlIHN1YnNjcmlwdGlvbiBpbiBwZXJzaXN0ZW50IGNhY2hlLlxuICAgKiBAbWVtYmVyT2YgREJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljTmFtZSAtIG5hbWUgb2YgdGhlIHRvcGljIHdoaWNoIG93bnMgdGhlIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1aWQgLSBJRCBvZiB0aGUgc3Vic2NyaWJlZCB1c2VyLlxuICAgKiBAcGFyYW0ge09iamVjdH0gc3ViIC0gc3Vic2NyaXB0aW9uIHRvIHNhdmUuXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IHByb21pc2UgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gb3BlcmF0aW9uIGNvbXBsZXRpb24uXG4gICAqL1xuICB1cGRTdWJzY3JpcHRpb24odG9waWNOYW1lLCB1aWQsIHN1Yikge1xuICAgIGlmICghdGhpcy5pc1JlYWR5KCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmRpc2FibGVkID9cbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkgOlxuICAgICAgICBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJub3QgaW5pdGlhbGl6ZWRcIikpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgdHJ4ID0gdGhpcy5kYi50cmFuc2FjdGlvbihbJ3N1YnNjcmlwdGlvbiddLCAncmVhZHdyaXRlJyk7XG4gICAgICB0cngub25jb21wbGV0ZSA9IChldmVudCkgPT4ge1xuICAgICAgICByZXNvbHZlKGV2ZW50LnRhcmdldC5yZXN1bHQpO1xuICAgICAgfTtcbiAgICAgIHRyeC5vbmVycm9yID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuI2xvZ2dlcignUENhY2hlJywgJ3VwZFN1YnNjcmlwdGlvbicsIGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICAgIHJlamVjdChldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgfTtcbiAgICAgIHRyeC5vYmplY3RTdG9yZSgnc3Vic2NyaXB0aW9uJykuZ2V0KFt0b3BpY05hbWUsIHVpZF0pLm9uc3VjY2VzcyA9IChldmVudCkgPT4ge1xuICAgICAgICB0cngub2JqZWN0U3RvcmUoJ3N1YnNjcmlwdGlvbicpLnB1dChEQi4jc2VyaWFsaXplU3Vic2NyaXB0aW9uKGV2ZW50LnRhcmdldC5yZXN1bHQsIHRvcGljTmFtZSwgdWlkLCBzdWIpKTtcbiAgICAgICAgdHJ4LmNvbW1pdCgpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeGVjdXRlIGEgY2FsbGJhY2sgZm9yIGVhY2ggY2FjaGVkIHN1YnNjcmlwdGlvbiBpbiBhIGdpdmVuIHRvcGljLlxuICAgKiBAbWVtYmVyT2YgREJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljTmFtZSAtIG5hbWUgb2YgdGhlIHRvcGljIHdoaWNoIG93bnMgdGhlIHN1YnNjcmlwdGlvbnMuXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIC0gZnVuY3Rpb24gdG8gY2FsbCBmb3IgZWFjaCBzdWJzY3JpcHRpb24uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZXh0IC0gdGhlIHZhbHVlIG9yIDxjb2RlPnRoaXM8L2NvZGU+IGluc2lkZSB0aGUgY2FsbGJhY2suXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IHByb21pc2UgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gb3BlcmF0aW9uIGNvbXBsZXRpb24uXG4gICAqL1xuICBtYXBTdWJzY3JpcHRpb25zKHRvcGljTmFtZSwgY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICBpZiAoIXRoaXMuaXNSZWFkeSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5kaXNhYmxlZCA/XG4gICAgICAgIFByb21pc2UucmVzb2x2ZShbXSkgOlxuICAgICAgICBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJub3QgaW5pdGlhbGl6ZWRcIikpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgdHJ4ID0gdGhpcy5kYi50cmFuc2FjdGlvbihbJ3N1YnNjcmlwdGlvbiddKTtcbiAgICAgIHRyeC5vbmVycm9yID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuI2xvZ2dlcignUENhY2hlJywgJ21hcFN1YnNjcmlwdGlvbnMnLCBldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgICByZWplY3QoZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgIH07XG4gICAgICB0cngub2JqZWN0U3RvcmUoJ3N1YnNjcmlwdGlvbicpLmdldEFsbChJREJLZXlSYW5nZS5ib3VuZChbdG9waWNOYW1lLCAnLSddLCBbdG9waWNOYW1lLCAnfiddKSkub25zdWNjZXNzID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgIGV2ZW50LnRhcmdldC5yZXN1bHQuZm9yRWFjaCgodG9waWMpID0+IHtcbiAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwoY29udGV4dCwgdG9waWMpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJlc29sdmUoZXZlbnQudGFyZ2V0LnJlc3VsdCk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgLy8gTWVzc2FnZXMuXG5cbiAgLyoqXG4gICAqIFNhdmUgbWVzc2FnZSB0byBwZXJzaXN0ZW50IGNhY2hlLlxuICAgKiBAbWVtYmVyT2YgREJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljTmFtZSAtIG5hbWUgb2YgdGhlIHRvcGljIHdoaWNoIG93bnMgdGhlIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBtc2cgLSBtZXNzYWdlIHRvIHNhdmUuXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IHByb21pc2UgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gb3BlcmF0aW9uIGNvbXBsZXRpb24uXG4gICAqL1xuICBhZGRNZXNzYWdlKG1zZykge1xuICAgIGlmICghdGhpcy5pc1JlYWR5KCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmRpc2FibGVkID9cbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkgOlxuICAgICAgICBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJub3QgaW5pdGlhbGl6ZWRcIikpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgdHJ4ID0gdGhpcy5kYi50cmFuc2FjdGlvbihbJ21lc3NhZ2UnXSwgJ3JlYWR3cml0ZScpO1xuICAgICAgdHJ4Lm9uc3VjY2VzcyA9IChldmVudCkgPT4ge1xuICAgICAgICByZXNvbHZlKGV2ZW50LnRhcmdldC5yZXN1bHQpO1xuICAgICAgfTtcbiAgICAgIHRyeC5vbmVycm9yID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuI2xvZ2dlcignUENhY2hlJywgJ2FkZE1lc3NhZ2UnLCBldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgICByZWplY3QoZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgIH07XG4gICAgICB0cngub2JqZWN0U3RvcmUoJ21lc3NhZ2UnKS5hZGQoREIuI3NlcmlhbGl6ZU1lc3NhZ2UobnVsbCwgbXNnKSk7XG4gICAgICB0cnguY29tbWl0KCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlIGRlbGl2ZXJ5IHN0YXR1cyBvZiBhIG1lc3NhZ2Ugc3RvcmVkIGluIHBlcnNpc3RlbnQgY2FjaGUuXG4gICAqIEBtZW1iZXJPZiBEQlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWNOYW1lIC0gbmFtZSBvZiB0aGUgdG9waWMgd2hpY2ggb3ducyB0aGUgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtudW1iZXJ9IHNlcSAtIElEIG9mIHRoZSBtZXNzYWdlIHRvIHVwZGF0ZVxuICAgKiBAcGFyYW0ge251bWJlcn0gc3RhdHVzIC0gbmV3IGRlbGl2ZXJ5IHN0YXR1cyBvZiB0aGUgbWVzc2FnZS5cbiAgICogQHJldHVybiB7UHJvbWlzZX0gcHJvbWlzZSByZXNvbHZlZC9yZWplY3RlZCBvbiBvcGVyYXRpb24gY29tcGxldGlvbi5cbiAgICovXG4gIHVwZE1lc3NhZ2VTdGF0dXModG9waWNOYW1lLCBzZXEsIHN0YXR1cykge1xuICAgIGlmICghdGhpcy5pc1JlYWR5KCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmRpc2FibGVkID9cbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkgOlxuICAgICAgICBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJub3QgaW5pdGlhbGl6ZWRcIikpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgdHJ4ID0gdGhpcy5kYi50cmFuc2FjdGlvbihbJ21lc3NhZ2UnXSwgJ3JlYWR3cml0ZScpO1xuICAgICAgdHJ4Lm9uc3VjY2VzcyA9IChldmVudCkgPT4ge1xuICAgICAgICByZXNvbHZlKGV2ZW50LnRhcmdldC5yZXN1bHQpO1xuICAgICAgfTtcbiAgICAgIHRyeC5vbmVycm9yID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuI2xvZ2dlcignUENhY2hlJywgJ3VwZE1lc3NhZ2VTdGF0dXMnLCBldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgICByZWplY3QoZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgIH07XG4gICAgICBjb25zdCByZXEgPSB0cngub2JqZWN0U3RvcmUoJ21lc3NhZ2UnKS5nZXQoSURCS2V5UmFuZ2Uub25seShbdG9waWNOYW1lLCBzZXFdKSk7XG4gICAgICByZXEub25zdWNjZXNzID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIGNvbnN0IHNyYyA9IHJlcS5yZXN1bHQgfHwgZXZlbnQudGFyZ2V0LnJlc3VsdDtcbiAgICAgICAgaWYgKCFzcmMgfHwgc3JjLl9zdGF0dXMgPT0gc3RhdHVzKSB7XG4gICAgICAgICAgdHJ4LmNvbW1pdCgpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0cngub2JqZWN0U3RvcmUoJ21lc3NhZ2UnKS5wdXQoREIuI3NlcmlhbGl6ZU1lc3NhZ2Uoc3JjLCB7XG4gICAgICAgICAgdG9waWM6IHRvcGljTmFtZSxcbiAgICAgICAgICBzZXE6IHNlcSxcbiAgICAgICAgICBfc3RhdHVzOiBzdGF0dXNcbiAgICAgICAgfSkpO1xuICAgICAgICB0cnguY29tbWl0KCk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBvbmUgb3IgbW9yZSBtZXNzYWdlcyBmcm9tIHBlcnNpc3RlbnQgY2FjaGUuXG4gICAqIEBtZW1iZXJPZiBEQlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWNOYW1lIC0gbmFtZSBvZiB0aGUgdG9waWMgd2hpY2ggb3ducyB0aGUgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtudW1iZXJ9IGZyb20gLSBpZCBvZiB0aGUgbWVzc2FnZSB0byByZW1vdmUgb3IgbG93ZXIgYm91bmRhcnkgd2hlbiByZW1vdmluZyByYW5nZSAoaW5jbHVzaXZlKS5cbiAgICogQHBhcmFtIHtudW1iZXI9fSB0byAtIHVwcGVyIGJvdW5kYXJ5IChleGNsdXNpdmUpIHdoZW4gcmVtb3ZpbmcgYSByYW5nZSBvZiBtZXNzYWdlcy5cbiAgICogQHJldHVybiB7UHJvbWlzZX0gcHJvbWlzZSByZXNvbHZlZC9yZWplY3RlZCBvbiBvcGVyYXRpb24gY29tcGxldGlvbi5cbiAgICovXG4gIHJlbU1lc3NhZ2VzKHRvcGljTmFtZSwgZnJvbSwgdG8pIHtcbiAgICBpZiAoIXRoaXMuaXNSZWFkeSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5kaXNhYmxlZCA/XG4gICAgICAgIFByb21pc2UucmVzb2x2ZSgpIDpcbiAgICAgICAgUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwibm90IGluaXRpYWxpemVkXCIpKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGlmICghZnJvbSAmJiAhdG8pIHtcbiAgICAgICAgZnJvbSA9IDA7XG4gICAgICAgIHRvID0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XG4gICAgICB9XG4gICAgICBjb25zdCByYW5nZSA9IHRvID4gMCA/IElEQktleVJhbmdlLmJvdW5kKFt0b3BpY05hbWUsIGZyb21dLCBbdG9waWNOYW1lLCB0b10sIGZhbHNlLCB0cnVlKSA6XG4gICAgICAgIElEQktleVJhbmdlLm9ubHkoW3RvcGljTmFtZSwgZnJvbV0pO1xuICAgICAgY29uc3QgdHJ4ID0gdGhpcy5kYi50cmFuc2FjdGlvbihbJ21lc3NhZ2UnXSwgJ3JlYWR3cml0ZScpO1xuICAgICAgdHJ4Lm9uc3VjY2VzcyA9IChldmVudCkgPT4ge1xuICAgICAgICByZXNvbHZlKGV2ZW50LnRhcmdldC5yZXN1bHQpO1xuICAgICAgfTtcbiAgICAgIHRyeC5vbmVycm9yID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuI2xvZ2dlcignUENhY2hlJywgJ3JlbU1lc3NhZ2VzJywgZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgICAgcmVqZWN0KGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICB9O1xuICAgICAgdHJ4Lm9iamVjdFN0b3JlKCdtZXNzYWdlJykuZGVsZXRlKHJhbmdlKTtcbiAgICAgIHRyeC5jb21taXQoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSBtZXNzYWdlcyBmcm9tIHBlcnNpc3RlbnQgc3RvcmUuXG4gICAqIEBtZW1iZXJPZiBEQlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWNOYW1lIC0gbmFtZSBvZiB0aGUgdG9waWMgdG8gcmV0cmlldmUgbWVzc2FnZXMgZnJvbS5cbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgdG8gY2FsbCBmb3IgZWFjaCByZXRyaWV2ZWQgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IHF1ZXJ5IC0gcGFyYW1ldGVycyBvZiB0aGUgbWVzc2FnZSByYW5nZSB0byByZXRyaWV2ZS5cbiAgICogQHBhcmFtIHtudW1iZXI9fSBxdWVyeS5zaW5jZSAtIHRoZSBsZWFzdCBtZXNzYWdlIElEIHRvIHJldHJpZXZlIChpbmNsdXNpdmUpLlxuICAgKiBAcGFyYW0ge251bWJlcj19IHF1ZXJ5LmJlZm9yZSAtIHRoZSBncmVhdGVzdCBtZXNzYWdlIElEIHRvIHJldHJpZXZlIChleGNsdXNpdmUpLlxuICAgKiBAcGFyYW0ge251bWJlcj19IHF1ZXJ5LmxpbWl0IC0gdGhlIG1heGltdW0gbnVtYmVyIG9mIG1lc3NhZ2VzIHRvIHJldHJpZXZlLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBwcm9taXNlIHJlc29sdmVkL3JlamVjdGVkIG9uIG9wZXJhdGlvbiBjb21wbGV0aW9uLlxuICAgKi9cbiAgcmVhZE1lc3NhZ2VzKHRvcGljTmFtZSwgcXVlcnksIGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgaWYgKCF0aGlzLmlzUmVhZHkoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZGlzYWJsZWQgP1xuICAgICAgICBQcm9taXNlLnJlc29sdmUoW10pIDpcbiAgICAgICAgUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwibm90IGluaXRpYWxpemVkXCIpKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHF1ZXJ5ID0gcXVlcnkgfHwge307XG4gICAgICBjb25zdCBzaW5jZSA9IHF1ZXJ5LnNpbmNlID4gMCA/IHF1ZXJ5LnNpbmNlIDogMDtcbiAgICAgIGNvbnN0IGJlZm9yZSA9IHF1ZXJ5LmJlZm9yZSA+IDAgPyBxdWVyeS5iZWZvcmUgOiBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcbiAgICAgIGNvbnN0IGxpbWl0ID0gcXVlcnkubGltaXQgfCAwO1xuXG4gICAgICBjb25zdCByZXN1bHQgPSBbXTtcbiAgICAgIGNvbnN0IHJhbmdlID0gSURCS2V5UmFuZ2UuYm91bmQoW3RvcGljTmFtZSwgc2luY2VdLCBbdG9waWNOYW1lLCBiZWZvcmVdLCBmYWxzZSwgdHJ1ZSk7XG4gICAgICBjb25zdCB0cnggPSB0aGlzLmRiLnRyYW5zYWN0aW9uKFsnbWVzc2FnZSddKTtcbiAgICAgIHRyeC5vbmVycm9yID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuI2xvZ2dlcignUENhY2hlJywgJ3JlYWRNZXNzYWdlcycsIGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICAgIHJlamVjdChldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgfTtcbiAgICAgIC8vIEl0ZXJhdGUgaW4gZGVzY2VuZGluZyBvcmRlci5cbiAgICAgIHRyeC5vYmplY3RTdG9yZSgnbWVzc2FnZScpLm9wZW5DdXJzb3IocmFuZ2UsICdwcmV2Jykub25zdWNjZXNzID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIGNvbnN0IGN1cnNvciA9IGV2ZW50LnRhcmdldC5yZXN1bHQ7XG4gICAgICAgIGlmIChjdXJzb3IpIHtcbiAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwoY29udGV4dCwgY3Vyc29yLnZhbHVlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVzdWx0LnB1c2goY3Vyc29yLnZhbHVlKTtcbiAgICAgICAgICBpZiAobGltaXQgPD0gMCB8fCByZXN1bHQubGVuZ3RoIDwgbGltaXQpIHtcbiAgICAgICAgICAgIGN1cnNvci5jb250aW51ZSgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIFByaXZhdGUgbWV0aG9kcy5cblxuICAvLyBTZXJpYWxpemFibGUgdG9waWMgZmllbGRzLlxuICBzdGF0aWMgI3RvcGljX2ZpZWxkcyA9IFsnY3JlYXRlZCcsICd1cGRhdGVkJywgJ2RlbGV0ZWQnLCAncmVhZCcsICdyZWN2JywgJ3NlcScsICdjbGVhcicsICdkZWZhY3MnLFxuICAgICdjcmVkcycsICdwdWJsaWMnLCAndHJ1c3RlZCcsICdwcml2YXRlJywgJ3RvdWNoZWQnLCAnX2RlbGV0ZWQnXG4gIF07XG5cbiAgLy8gQ29weSBkYXRhIGZyb20gc3JjIHRvIFRvcGljIG9iamVjdC5cbiAgc3RhdGljICNkZXNlcmlhbGl6ZVRvcGljKHRvcGljLCBzcmMpIHtcbiAgICBEQi4jdG9waWNfZmllbGRzLmZvckVhY2goKGYpID0+IHtcbiAgICAgIGlmIChzcmMuaGFzT3duUHJvcGVydHkoZikpIHtcbiAgICAgICAgdG9waWNbZl0gPSBzcmNbZl07XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoc3JjLnRhZ3MpKSB7XG4gICAgICB0b3BpYy5fdGFncyA9IHNyYy50YWdzO1xuICAgIH1cbiAgICBpZiAoc3JjLmFjcykge1xuICAgICAgdG9waWMuc2V0QWNjZXNzTW9kZShzcmMuYWNzKTtcbiAgICB9XG4gICAgdG9waWMuc2VxIHw9IDA7XG4gICAgdG9waWMucmVhZCB8PSAwO1xuICAgIHRvcGljLnVucmVhZCA9IE1hdGgubWF4KDAsIHRvcGljLnNlcSAtIHRvcGljLnJlYWQpO1xuICB9XG5cbiAgLy8gQ29weSB2YWx1ZXMgZnJvbSAnc3JjJyB0byAnZHN0Jy4gQWxsb2NhdGUgZHN0IGlmIGl0J3MgbnVsbCBvciB1bmRlZmluZWQuXG4gIHN0YXRpYyAjc2VyaWFsaXplVG9waWMoZHN0LCBzcmMpIHtcbiAgICBjb25zdCByZXMgPSBkc3QgfHwge1xuICAgICAgbmFtZTogc3JjLm5hbWVcbiAgICB9O1xuICAgIERCLiN0b3BpY19maWVsZHMuZm9yRWFjaCgoZikgPT4ge1xuICAgICAgaWYgKHNyYy5oYXNPd25Qcm9wZXJ0eShmKSkge1xuICAgICAgICByZXNbZl0gPSBzcmNbZl07XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoc3JjLl90YWdzKSkge1xuICAgICAgcmVzLnRhZ3MgPSBzcmMuX3RhZ3M7XG4gICAgfVxuICAgIGlmIChzcmMuYWNzKSB7XG4gICAgICByZXMuYWNzID0gc3JjLmdldEFjY2Vzc01vZGUoKS5qc29uSGVscGVyKCk7XG4gICAgfVxuICAgIHJldHVybiByZXM7XG4gIH1cblxuICBzdGF0aWMgI3NlcmlhbGl6ZVN1YnNjcmlwdGlvbihkc3QsIHRvcGljTmFtZSwgdWlkLCBzdWIpIHtcbiAgICBjb25zdCBmaWVsZHMgPSBbJ3VwZGF0ZWQnLCAnbW9kZScsICdyZWFkJywgJ3JlY3YnLCAnY2xlYXInLCAnbGFzdFNlZW4nLCAndXNlckFnZW50J107XG4gICAgY29uc3QgcmVzID0gZHN0IHx8IHtcbiAgICAgIHRvcGljOiB0b3BpY05hbWUsXG4gICAgICB1aWQ6IHVpZFxuICAgIH07XG5cbiAgICBmaWVsZHMuZm9yRWFjaCgoZikgPT4ge1xuICAgICAgaWYgKHN1Yi5oYXNPd25Qcm9wZXJ0eShmKSkge1xuICAgICAgICByZXNbZl0gPSBzdWJbZl07XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVzO1xuICB9XG5cbiAgc3RhdGljICNzZXJpYWxpemVNZXNzYWdlKGRzdCwgbXNnKSB7XG4gICAgLy8gU2VyaWFsaXphYmxlIGZpZWxkcy5cbiAgICBjb25zdCBmaWVsZHMgPSBbJ3RvcGljJywgJ3NlcScsICd0cycsICdfc3RhdHVzJywgJ2Zyb20nLCAnaGVhZCcsICdjb250ZW50J107XG4gICAgY29uc3QgcmVzID0gZHN0IHx8IHt9O1xuICAgIGZpZWxkcy5mb3JFYWNoKChmKSA9PiB7XG4gICAgICBpZiAobXNnLmhhc093blByb3BlcnR5KGYpKSB7XG4gICAgICAgIHJlc1tmXSA9IG1zZ1tmXTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcmVzO1xuICB9XG5cbiAgLyoqXG4gICAqIFRvIHVzZSBEQiBpbiBhIG5vbiBicm93c2VyIGNvbnRleHQsIHN1cHBseSBpbmRleGVkREIgcHJvdmlkZXIuXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlcm9mIERCXG4gICAqIEBwYXJhbSBpZGJQcm92aWRlciBpbmRleGVkREIgcHJvdmlkZXIsIGUuZy4gZm9yIG5vZGUgPGNvZGU+cmVxdWlyZSgnZmFrZS1pbmRleGVkZGInKTwvY29kZT4uXG4gICAqL1xuICBzdGF0aWMgc2V0RGF0YWJhc2VQcm92aWRlcihpZGJQcm92aWRlcikge1xuICAgIElEQlByb3ZpZGVyID0gaWRiUHJvdmlkZXI7XG4gIH1cbn1cbiIsIi8qKlxuICogQGNvcHlyaWdodCAyMDE1LTIwMjIgVGlub2RlIExMQy5cbiAqIEBzdW1tYXJ5IE1pbmltYWxseSByaWNoIHRleHQgcmVwcmVzZW50YXRpb24gYW5kIGZvcm1hdHRpbmcgZm9yIFRpbm9kZS5cbiAqIEBsaWNlbnNlIEFwYWNoZSAyLjBcbiAqXG4gKiBAZmlsZSBCYXNpYyBwYXJzZXIgYW5kIGZvcm1hdHRlciBmb3IgdmVyeSBzaW1wbGUgdGV4dCBtYXJrdXAuIE1vc3RseSB0YXJnZXRlZCBhdFxuICogbW9iaWxlIHVzZSBjYXNlcyBzaW1pbGFyIHRvIFRlbGVncmFtLCBXaGF0c0FwcCwgYW5kIEZCIE1lc3Nlbmdlci5cbiAqXG4gKiA8cD5TdXBwb3J0cyBjb252ZXJzaW9uIG9mIHVzZXIga2V5Ym9hcmQgaW5wdXQgdG8gZm9ybWF0dGVkIHRleHQ6PC9wPlxuICogPHVsPlxuICogICA8bGk+KmFiYyogJnJhcnI7IDxiPmFiYzwvYj48L2xpPlxuICogICA8bGk+X2FiY18gJnJhcnI7IDxpPmFiYzwvaT48L2xpPlxuICogICA8bGk+fmFiY34gJnJhcnI7IDxkZWw+YWJjPC9kZWw+PC9saT5cbiAqICAgPGxpPmBhYmNgICZyYXJyOyA8dHQ+YWJjPC90dD48L2xpPlxuICogPC91bD5cbiAqIEFsc28gc3VwcG9ydHMgZm9ybXMgYW5kIGJ1dHRvbnMuXG4gKlxuICogTmVzdGVkIGZvcm1hdHRpbmcgaXMgc3VwcG9ydGVkLCBlLmcuICphYmMgX2RlZl8qIC0+IDxiPmFiYyA8aT5kZWY8L2k+PC9iPlxuICogVVJMcywgQG1lbnRpb25zLCBhbmQgI2hhc2h0YWdzIGFyZSBleHRyYWN0ZWQgYW5kIGNvbnZlcnRlZCBpbnRvIGxpbmtzLlxuICogRm9ybXMgYW5kIGJ1dHRvbnMgY2FuIGJlIGFkZGVkIHByb2NlZHVyYWxseS5cbiAqIEpTT04gZGF0YSByZXByZXNlbnRhdGlvbiBpcyBpbnNwaXJlZCBieSBEcmFmdC5qcyByYXcgZm9ybWF0dGluZy5cbiAqXG4gKlxuICogQGV4YW1wbGVcbiAqIFRleHQ6XG4gKiA8cHJlPlxuICogICAgIHRoaXMgaXMgKmJvbGQqLCBgY29kZWAgYW5kIF9pdGFsaWNfLCB+c3RyaWtlflxuICogICAgIGNvbWJpbmVkICpib2xkIGFuZCBfaXRhbGljXypcbiAqICAgICBhbiB1cmw6IGh0dHBzOi8vd3d3LmV4YW1wbGUuY29tL2FiYyNmcmFnbWVudCBhbmQgYW5vdGhlciBfd3d3LnRpbm9kZS5jb19cbiAqICAgICB0aGlzIGlzIGEgQG1lbnRpb24gYW5kIGEgI2hhc2h0YWcgaW4gYSBzdHJpbmdcbiAqICAgICBzZWNvbmQgI2hhc2h0YWdcbiAqIDwvcHJlPlxuICpcbiAqICBTYW1wbGUgSlNPTiByZXByZXNlbnRhdGlvbiBvZiB0aGUgdGV4dCBhYm92ZTpcbiAqICB7XG4gKiAgICAgXCJ0eHRcIjogXCJ0aGlzIGlzIGJvbGQsIGNvZGUgYW5kIGl0YWxpYywgc3RyaWtlIGNvbWJpbmVkIGJvbGQgYW5kIGl0YWxpYyBhbiB1cmw6IGh0dHBzOi8vd3d3LmV4YW1wbGUuY29tL2FiYyNmcmFnbWVudCBcIiArXG4gKiAgICAgICAgICAgICBcImFuZCBhbm90aGVyIHd3dy50aW5vZGUuY28gdGhpcyBpcyBhIEBtZW50aW9uIGFuZCBhICNoYXNodGFnIGluIGEgc3RyaW5nIHNlY29uZCAjaGFzaHRhZ1wiLFxuICogICAgIFwiZm10XCI6IFtcbiAqICAgICAgICAgeyBcImF0XCI6OCwgXCJsZW5cIjo0LFwidHBcIjpcIlNUXCIgfSx7IFwiYXRcIjoxNCwgXCJsZW5cIjo0LCBcInRwXCI6XCJDT1wiIH0seyBcImF0XCI6MjMsIFwibGVuXCI6NiwgXCJ0cFwiOlwiRU1cIn0sXG4gKiAgICAgICAgIHsgXCJhdFwiOjMxLCBcImxlblwiOjYsIFwidHBcIjpcIkRMXCIgfSx7IFwidHBcIjpcIkJSXCIsIFwibGVuXCI6MSwgXCJhdFwiOjM3IH0seyBcImF0XCI6NTYsIFwibGVuXCI6NiwgXCJ0cFwiOlwiRU1cIiB9LFxuICogICAgICAgICB7IFwiYXRcIjo0NywgXCJsZW5cIjoxNSwgXCJ0cFwiOlwiU1RcIiB9LHsgXCJ0cFwiOlwiQlJcIiwgXCJsZW5cIjoxLCBcImF0XCI6NjIgfSx7IFwiYXRcIjoxMjAsIFwibGVuXCI6MTMsIFwidHBcIjpcIkVNXCIgfSxcbiAqICAgICAgICAgeyBcImF0XCI6NzEsIFwibGVuXCI6MzYsIFwia2V5XCI6MCB9LHsgXCJhdFwiOjEyMCwgXCJsZW5cIjoxMywgXCJrZXlcIjoxIH0seyBcInRwXCI6XCJCUlwiLCBcImxlblwiOjEsIFwiYXRcIjoxMzMgfSxcbiAqICAgICAgICAgeyBcImF0XCI6MTQ0LCBcImxlblwiOjgsIFwia2V5XCI6MiB9LHsgXCJhdFwiOjE1OSwgXCJsZW5cIjo4LCBcImtleVwiOjMgfSx7IFwidHBcIjpcIkJSXCIsIFwibGVuXCI6MSwgXCJhdFwiOjE3OSB9LFxuICogICAgICAgICB7IFwiYXRcIjoxODcsIFwibGVuXCI6OCwgXCJrZXlcIjozIH0seyBcInRwXCI6XCJCUlwiLCBcImxlblwiOjEsIFwiYXRcIjoxOTUgfVxuICogICAgIF0sXG4gKiAgICAgXCJlbnRcIjogW1xuICogICAgICAgICB7IFwidHBcIjpcIkxOXCIsIFwiZGF0YVwiOnsgXCJ1cmxcIjpcImh0dHBzOi8vd3d3LmV4YW1wbGUuY29tL2FiYyNmcmFnbWVudFwiIH0gfSxcbiAqICAgICAgICAgeyBcInRwXCI6XCJMTlwiLCBcImRhdGFcIjp7IFwidXJsXCI6XCJodHRwOi8vd3d3LnRpbm9kZS5jb1wiIH0gfSxcbiAqICAgICAgICAgeyBcInRwXCI6XCJNTlwiLCBcImRhdGFcIjp7IFwidmFsXCI6XCJtZW50aW9uXCIgfSB9LFxuICogICAgICAgICB7IFwidHBcIjpcIkhUXCIsIFwiZGF0YVwiOnsgXCJ2YWxcIjpcImhhc2h0YWdcIiB9IH1cbiAqICAgICBdXG4gKiAgfVxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuLy8gTk9URSBUTyBERVZFTE9QRVJTOlxuLy8gTG9jYWxpemFibGUgc3RyaW5ncyBzaG91bGQgYmUgZG91YmxlIHF1b3RlZCBcItGB0YLRgNC+0LrQsCDQvdCwINC00YDRg9Cz0L7QvCDRj9C30YvQutC1XCIsXG4vLyBub24tbG9jYWxpemFibGUgc3RyaW5ncyBzaG91bGQgYmUgc2luZ2xlIHF1b3RlZCAnbm9uLWxvY2FsaXplZCcuXG5cbmNvbnN0IE1BWF9GT1JNX0VMRU1FTlRTID0gODtcbmNvbnN0IE1BWF9QUkVWSUVXX0FUVEFDSE1FTlRTID0gMztcbmNvbnN0IE1BWF9QUkVWSUVXX0RBVEFfU0laRSA9IDY0O1xuY29uc3QgSlNPTl9NSU1FX1RZUEUgPSAnYXBwbGljYXRpb24vanNvbic7XG5jb25zdCBEUkFGVFlfTUlNRV9UWVBFID0gJ3RleHQveC1kcmFmdHknO1xuY29uc3QgQUxMT1dFRF9FTlRfRklFTERTID0gWydhY3QnLCAnaGVpZ2h0JywgJ2R1cmF0aW9uJywgJ2luY29taW5nJywgJ21pbWUnLCAnbmFtZScsICdwcmV2aWV3JyxcbiAgJ3JlZicsICdzaXplJywgJ3N0YXRlJywgJ3VybCcsICd2YWwnLCAnd2lkdGgnXG5dO1xuXG4vLyBSZWd1bGFyIGV4cHJlc3Npb25zIGZvciBwYXJzaW5nIGlubGluZSBmb3JtYXRzLiBKYXZhc2NyaXB0IGRvZXMgbm90IHN1cHBvcnQgbG9va2JlaGluZCxcbi8vIHNvIGl0J3MgYSBiaXQgbWVzc3kuXG5jb25zdCBJTkxJTkVfU1RZTEVTID0gW1xuICAvLyBTdHJvbmcgPSBib2xkLCAqYm9sZCB0ZXh0KlxuICB7XG4gICAgbmFtZTogJ1NUJyxcbiAgICBzdGFydDogLyg/Ol58W1xcV19dKShcXCopW15cXHMqXS8sXG4gICAgZW5kOiAvW15cXHMqXShcXCopKD89JHxbXFxXX10pL1xuICB9LFxuICAvLyBFbXBoZXNpemVkID0gaXRhbGljLCBfaXRhbGljIHRleHRfXG4gIHtcbiAgICBuYW1lOiAnRU0nLFxuICAgIHN0YXJ0OiAvKD86XnxcXFcpKF8pW15cXHNfXS8sXG4gICAgZW5kOiAvW15cXHNfXShfKSg/PSR8XFxXKS9cbiAgfSxcbiAgLy8gRGVsZXRlZCwgfnN0cmlrZSB0aGlzIHRob3VnaH5cbiAge1xuICAgIG5hbWU6ICdETCcsXG4gICAgc3RhcnQ6IC8oPzpefFtcXFdfXSkofilbXlxcc35dLyxcbiAgICBlbmQ6IC9bXlxcc35dKH4pKD89JHxbXFxXX10pL1xuICB9LFxuICAvLyBDb2RlIGJsb2NrIGB0aGlzIGlzIG1vbm9zcGFjZWBcbiAge1xuICAgIG5hbWU6ICdDTycsXG4gICAgc3RhcnQ6IC8oPzpefFxcVykoYClbXmBdLyxcbiAgICBlbmQ6IC9bXmBdKGApKD89JHxcXFcpL1xuICB9XG5dO1xuXG4vLyBSZWxhdGl2ZSB3ZWlnaHRzIG9mIGZvcm1hdHRpbmcgc3BhbnMuIEdyZWF0ZXIgaW5kZXggaW4gYXJyYXkgbWVhbnMgZ3JlYXRlciB3ZWlnaHQuXG5jb25zdCBGTVRfV0VJR0hUID0gWydRUSddO1xuXG4vLyBSZWdFeHBzIGZvciBlbnRpdHkgZXh0cmFjdGlvbiAoUkYgPSByZWZlcmVuY2UpXG5jb25zdCBFTlRJVFlfVFlQRVMgPSBbXG4gIC8vIFVSTHNcbiAge1xuICAgIG5hbWU6ICdMTicsXG4gICAgZGF0YU5hbWU6ICd1cmwnLFxuICAgIHBhY2s6IGZ1bmN0aW9uKHZhbCkge1xuICAgICAgLy8gQ2hlY2sgaWYgdGhlIHByb3RvY29sIGlzIHNwZWNpZmllZCwgaWYgbm90IHVzZSBodHRwXG4gICAgICBpZiAoIS9eW2Etel0rOlxcL1xcLy9pLnRlc3QodmFsKSkge1xuICAgICAgICB2YWwgPSAnaHR0cDovLycgKyB2YWw7XG4gICAgICB9XG4gICAgICByZXR1cm4ge1xuICAgICAgICB1cmw6IHZhbFxuICAgICAgfTtcbiAgICB9LFxuICAgIHJlOiAvKD86KD86aHR0cHM/fGZ0cCk6XFwvXFwvfHd3d1xcLnxmdHBcXC4pWy1BLVowLTkrJkAjXFwvJT1+X3wkPyE6LC5dKltBLVowLTkrJkAjXFwvJT1+X3wkXS9pZ1xuICB9LFxuICAvLyBNZW50aW9ucyBAdXNlciAobXVzdCBiZSAyIG9yIG1vcmUgY2hhcmFjdGVycylcbiAge1xuICAgIG5hbWU6ICdNTicsXG4gICAgZGF0YU5hbWU6ICd2YWwnLFxuICAgIHBhY2s6IGZ1bmN0aW9uKHZhbCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdmFsOiB2YWwuc2xpY2UoMSlcbiAgICAgIH07XG4gICAgfSxcbiAgICByZTogL1xcQkAoW1xccHtMfVxccHtOfV1bLl9cXHB7TH1cXHB7Tn1dKltcXHB7TH1cXHB7Tn1dKS91Z1xuICB9LFxuICAvLyBIYXNodGFncyAjaGFzaHRhZywgbGlrZSBtZXRpb24gMiBvciBtb3JlIGNoYXJhY3RlcnMuXG4gIHtcbiAgICBuYW1lOiAnSFQnLFxuICAgIGRhdGFOYW1lOiAndmFsJyxcbiAgICBwYWNrOiBmdW5jdGlvbih2YWwpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHZhbDogdmFsLnNsaWNlKDEpXG4gICAgICB9O1xuICAgIH0sXG4gICAgcmU6IC9cXEIjKFtcXHB7TH1cXHB7Tn1dWy5fXFxwe0x9XFxwe059XSpbXFxwe0x9XFxwe059XSkvdWdcbiAgfVxuXTtcblxuLy8gSFRNTCB0YWcgbmFtZSBzdWdnZXN0aW9uc1xuY29uc3QgSFRNTF9UQUdTID0ge1xuICBBVToge1xuICAgIG5hbWU6ICdhdWRpbycsXG4gICAgaXNWb2lkOiBmYWxzZVxuICB9LFxuICBCTjoge1xuICAgIG5hbWU6ICdidXR0b24nLFxuICAgIGlzVm9pZDogZmFsc2VcbiAgfSxcbiAgQlI6IHtcbiAgICBuYW1lOiAnYnInLFxuICAgIGlzVm9pZDogdHJ1ZVxuICB9LFxuICBDTzoge1xuICAgIG5hbWU6ICd0dCcsXG4gICAgaXNWb2lkOiBmYWxzZVxuICB9LFxuICBETDoge1xuICAgIG5hbWU6ICdkZWwnLFxuICAgIGlzVm9pZDogZmFsc2VcbiAgfSxcbiAgRU06IHtcbiAgICBuYW1lOiAnaScsXG4gICAgaXNWb2lkOiBmYWxzZVxuICB9LFxuICBFWDoge1xuICAgIG5hbWU6ICcnLFxuICAgIGlzVm9pZDogdHJ1ZVxuICB9LFxuICBGTToge1xuICAgIG5hbWU6ICdkaXYnLFxuICAgIGlzVm9pZDogZmFsc2VcbiAgfSxcbiAgSEQ6IHtcbiAgICBuYW1lOiAnJyxcbiAgICBpc1ZvaWQ6IGZhbHNlXG4gIH0sXG4gIEhMOiB7XG4gICAgbmFtZTogJ3NwYW4nLFxuICAgIGlzVm9pZDogZmFsc2VcbiAgfSxcbiAgSFQ6IHtcbiAgICBuYW1lOiAnYScsXG4gICAgaXNWb2lkOiBmYWxzZVxuICB9LFxuICBJTToge1xuICAgIG5hbWU6ICdpbWcnLFxuICAgIGlzVm9pZDogZmFsc2VcbiAgfSxcbiAgTE46IHtcbiAgICBuYW1lOiAnYScsXG4gICAgaXNWb2lkOiBmYWxzZVxuICB9LFxuICBNTjoge1xuICAgIG5hbWU6ICdhJyxcbiAgICBpc1ZvaWQ6IGZhbHNlXG4gIH0sXG4gIFJXOiB7XG4gICAgbmFtZTogJ2RpdicsXG4gICAgaXNWb2lkOiBmYWxzZSxcbiAgfSxcbiAgUVE6IHtcbiAgICBuYW1lOiAnZGl2JyxcbiAgICBpc1ZvaWQ6IGZhbHNlXG4gIH0sXG4gIFNUOiB7XG4gICAgbmFtZTogJ2InLFxuICAgIGlzVm9pZDogZmFsc2VcbiAgfSxcbiAgVkM6IHtcbiAgICBuYW1lOiAnZGl2JyxcbiAgICBpc1ZvaWQ6IGZhbHNlXG4gIH0sXG59O1xuXG4vLyBDb252ZXJ0IGJhc2U2NC1lbmNvZGVkIHN0cmluZyBpbnRvIEJsb2IuXG5mdW5jdGlvbiBiYXNlNjR0b09iamVjdFVybChiNjQsIGNvbnRlbnRUeXBlLCBsb2dnZXIpIHtcbiAgaWYgKCFiNjQpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHRyeSB7XG4gICAgY29uc3QgYmluID0gYXRvYihiNjQpO1xuICAgIGNvbnN0IGxlbmd0aCA9IGJpbi5sZW5ndGg7XG4gICAgY29uc3QgYnVmID0gbmV3IEFycmF5QnVmZmVyKGxlbmd0aCk7XG4gICAgY29uc3QgYXJyID0gbmV3IFVpbnQ4QXJyYXkoYnVmKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBhcnJbaV0gPSBiaW4uY2hhckNvZGVBdChpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gVVJMLmNyZWF0ZU9iamVjdFVSTChuZXcgQmxvYihbYnVmXSwge1xuICAgICAgdHlwZTogY29udGVudFR5cGVcbiAgICB9KSk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGlmIChsb2dnZXIpIHtcbiAgICAgIGxvZ2dlcihcIkRyYWZ0eTogZmFpbGVkIHRvIGNvbnZlcnQgb2JqZWN0LlwiLCBlcnIubWVzc2FnZSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG5cbmZ1bmN0aW9uIGJhc2U2NHRvRGF0YVVybChiNjQsIGNvbnRlbnRUeXBlKSB7XG4gIGlmICghYjY0KSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgY29udGVudFR5cGUgPSBjb250ZW50VHlwZSB8fCAnaW1hZ2UvanBlZyc7XG4gIHJldHVybiAnZGF0YTonICsgY29udGVudFR5cGUgKyAnO2Jhc2U2NCwnICsgYjY0O1xufVxuXG4vLyBIZWxwZXJzIGZvciBjb252ZXJ0aW5nIERyYWZ0eSB0byBIVE1MLlxuY29uc3QgREVDT1JBVE9SUyA9IHtcbiAgLy8gVmlzaWFsIHN0eWxlc1xuICBTVDoge1xuICAgIG9wZW46IF8gPT4gJzxiPicsXG4gICAgY2xvc2U6IF8gPT4gJzwvYj4nXG4gIH0sXG4gIEVNOiB7XG4gICAgb3BlbjogXyA9PiAnPGk+JyxcbiAgICBjbG9zZTogXyA9PiAnPC9pPidcbiAgfSxcbiAgREw6IHtcbiAgICBvcGVuOiBfID0+ICc8ZGVsPicsXG4gICAgY2xvc2U6IF8gPT4gJzwvZGVsPidcbiAgfSxcbiAgQ086IHtcbiAgICBvcGVuOiBfID0+ICc8dHQ+JyxcbiAgICBjbG9zZTogXyA9PiAnPC90dD4nXG4gIH0sXG4gIC8vIExpbmUgYnJlYWtcbiAgQlI6IHtcbiAgICBvcGVuOiBfID0+ICc8YnIvPicsXG4gICAgY2xvc2U6IF8gPT4gJydcbiAgfSxcbiAgLy8gSGlkZGVuIGVsZW1lbnRcbiAgSEQ6IHtcbiAgICBvcGVuOiBfID0+ICcnLFxuICAgIGNsb3NlOiBfID0+ICcnXG4gIH0sXG4gIC8vIEhpZ2hsaWdodGVkIGVsZW1lbnQuXG4gIEhMOiB7XG4gICAgb3BlbjogXyA9PiAnPHNwYW4gc3R5bGU9XCJjb2xvcjp0ZWFsXCI+JyxcbiAgICBjbG9zZTogXyA9PiAnPC9zcGFuPidcbiAgfSxcbiAgLy8gTGluayAoVVJMKVxuICBMTjoge1xuICAgIG9wZW46IChkYXRhKSA9PiB7XG4gICAgICByZXR1cm4gJzxhIGhyZWY9XCInICsgZGF0YS51cmwgKyAnXCI+JztcbiAgICB9LFxuICAgIGNsb3NlOiBfID0+ICc8L2E+JyxcbiAgICBwcm9wczogKGRhdGEpID0+IHtcbiAgICAgIHJldHVybiBkYXRhID8ge1xuICAgICAgICBocmVmOiBkYXRhLnVybCxcbiAgICAgICAgdGFyZ2V0OiAnX2JsYW5rJ1xuICAgICAgfSA6IG51bGw7XG4gICAgfSxcbiAgfSxcbiAgLy8gTWVudGlvblxuICBNTjoge1xuICAgIG9wZW46IChkYXRhKSA9PiB7XG4gICAgICByZXR1cm4gJzxhIGhyZWY9XCIjJyArIGRhdGEudmFsICsgJ1wiPic7XG4gICAgfSxcbiAgICBjbG9zZTogXyA9PiAnPC9hPicsXG4gICAgcHJvcHM6IChkYXRhKSA9PiB7XG4gICAgICByZXR1cm4gZGF0YSA/IHtcbiAgICAgICAgaWQ6IGRhdGEudmFsXG4gICAgICB9IDogbnVsbDtcbiAgICB9LFxuICB9LFxuICAvLyBIYXNodGFnXG4gIEhUOiB7XG4gICAgb3BlbjogKGRhdGEpID0+IHtcbiAgICAgIHJldHVybiAnPGEgaHJlZj1cIiMnICsgZGF0YS52YWwgKyAnXCI+JztcbiAgICB9LFxuICAgIGNsb3NlOiBfID0+ICc8L2E+JyxcbiAgICBwcm9wczogKGRhdGEpID0+IHtcbiAgICAgIHJldHVybiBkYXRhID8ge1xuICAgICAgICBpZDogZGF0YS52YWxcbiAgICAgIH0gOiBudWxsO1xuICAgIH0sXG4gIH0sXG4gIC8vIEJ1dHRvblxuICBCTjoge1xuICAgIG9wZW46IF8gPT4gJzxidXR0b24+JyxcbiAgICBjbG9zZTogXyA9PiAnPC9idXR0b24+JyxcbiAgICBwcm9wczogKGRhdGEpID0+IHtcbiAgICAgIHJldHVybiBkYXRhID8ge1xuICAgICAgICAnZGF0YS1hY3QnOiBkYXRhLmFjdCxcbiAgICAgICAgJ2RhdGEtdmFsJzogZGF0YS52YWwsXG4gICAgICAgICdkYXRhLW5hbWUnOiBkYXRhLm5hbWUsXG4gICAgICAgICdkYXRhLXJlZic6IGRhdGEucmVmXG4gICAgICB9IDogbnVsbDtcbiAgICB9LFxuICB9LFxuICAvLyBBdWRpbyByZWNvcmRpbmdcbiAgQVU6IHtcbiAgICBvcGVuOiAoZGF0YSkgPT4ge1xuICAgICAgY29uc3QgdXJsID0gZGF0YS5yZWYgfHwgYmFzZTY0dG9PYmplY3RVcmwoZGF0YS52YWwsIGRhdGEubWltZSwgRHJhZnR5LmxvZ2dlcik7XG4gICAgICByZXR1cm4gJzxhdWRpbyBjb250cm9scyBzcmM9XCInICsgdXJsICsgJ1wiPic7XG4gICAgfSxcbiAgICBjbG9zZTogXyA9PiAnPC9hdWRpbz4nLFxuICAgIHByb3BzOiAoZGF0YSkgPT4ge1xuICAgICAgaWYgKCFkYXRhKSByZXR1cm4gbnVsbDtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC8vIEVtYmVkZGVkIGRhdGEgb3IgZXh0ZXJuYWwgbGluay5cbiAgICAgICAgc3JjOiBkYXRhLnJlZiB8fCBiYXNlNjR0b09iamVjdFVybChkYXRhLnZhbCwgZGF0YS5taW1lLCBEcmFmdHkubG9nZ2VyKSxcbiAgICAgICAgJ2RhdGEtcHJlbG9hZCc6IGRhdGEucmVmID8gJ21ldGFkYXRhJyA6ICdhdXRvJyxcbiAgICAgICAgJ2RhdGEtZHVyYXRpb24nOiBkYXRhLmR1cmF0aW9uLFxuICAgICAgICAnZGF0YS1uYW1lJzogZGF0YS5uYW1lLFxuICAgICAgICAnZGF0YS1zaXplJzogZGF0YS52YWwgPyAoKGRhdGEudmFsLmxlbmd0aCAqIDAuNzUpIHwgMCkgOiAoZGF0YS5zaXplIHwgMCksXG4gICAgICAgICdkYXRhLW1pbWUnOiBkYXRhLm1pbWUsXG4gICAgICB9O1xuICAgIH1cbiAgfSxcbiAgLy8gSW1hZ2VcbiAgSU06IHtcbiAgICBvcGVuOiAoZGF0YSkgPT4ge1xuICAgICAgLy8gRG9uJ3QgdXNlIGRhdGEucmVmIGZvciBwcmV2aWV3OiBpdCdzIGEgc2VjdXJpdHkgcmlzay5cbiAgICAgIGNvbnN0IHRtcFByZXZpZXdVcmwgPSBiYXNlNjR0b0RhdGFVcmwoZGF0YS5fdGVtcFByZXZpZXcsIGRhdGEubWltZSk7XG4gICAgICBjb25zdCBwcmV2aWV3VXJsID0gYmFzZTY0dG9PYmplY3RVcmwoZGF0YS52YWwsIGRhdGEubWltZSwgRHJhZnR5LmxvZ2dlcik7XG4gICAgICBjb25zdCBkb3dubG9hZFVybCA9IGRhdGEucmVmIHx8IHByZXZpZXdVcmw7XG4gICAgICByZXR1cm4gKGRhdGEubmFtZSA/ICc8YSBocmVmPVwiJyArIGRvd25sb2FkVXJsICsgJ1wiIGRvd25sb2FkPVwiJyArIGRhdGEubmFtZSArICdcIj4nIDogJycpICtcbiAgICAgICAgJzxpbWcgc3JjPVwiJyArICh0bXBQcmV2aWV3VXJsIHx8IHByZXZpZXdVcmwpICsgJ1wiJyArXG4gICAgICAgIChkYXRhLndpZHRoID8gJyB3aWR0aD1cIicgKyBkYXRhLndpZHRoICsgJ1wiJyA6ICcnKSArXG4gICAgICAgIChkYXRhLmhlaWdodCA/ICcgaGVpZ2h0PVwiJyArIGRhdGEuaGVpZ2h0ICsgJ1wiJyA6ICcnKSArICcgYm9yZGVyPVwiMFwiIC8+JztcbiAgICB9LFxuICAgIGNsb3NlOiAoZGF0YSkgPT4ge1xuICAgICAgcmV0dXJuIChkYXRhLm5hbWUgPyAnPC9hPicgOiAnJyk7XG4gICAgfSxcbiAgICBwcm9wczogKGRhdGEpID0+IHtcbiAgICAgIGlmICghZGF0YSkgcmV0dXJuIG51bGw7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAvLyBUZW1wb3JhcnkgcHJldmlldywgb3IgcGVybWFuZW50IHByZXZpZXcsIG9yIGV4dGVybmFsIGxpbmsuXG4gICAgICAgIHNyYzogYmFzZTY0dG9EYXRhVXJsKGRhdGEuX3RlbXBQcmV2aWV3LCBkYXRhLm1pbWUpIHx8XG4gICAgICAgICAgZGF0YS5yZWYgfHwgYmFzZTY0dG9PYmplY3RVcmwoZGF0YS52YWwsIGRhdGEubWltZSwgRHJhZnR5LmxvZ2dlciksXG4gICAgICAgIHRpdGxlOiBkYXRhLm5hbWUsXG4gICAgICAgIGFsdDogZGF0YS5uYW1lLFxuICAgICAgICAnZGF0YS13aWR0aCc6IGRhdGEud2lkdGgsXG4gICAgICAgICdkYXRhLWhlaWdodCc6IGRhdGEuaGVpZ2h0LFxuICAgICAgICAnZGF0YS1uYW1lJzogZGF0YS5uYW1lLFxuICAgICAgICAnZGF0YS1zaXplJzogZGF0YS52YWwgPyAoKGRhdGEudmFsLmxlbmd0aCAqIDAuNzUpIHwgMCkgOiAoZGF0YS5zaXplIHwgMCksXG4gICAgICAgICdkYXRhLW1pbWUnOiBkYXRhLm1pbWUsXG4gICAgICB9O1xuICAgIH0sXG4gIH0sXG4gIC8vIEZvcm0gLSBzdHJ1Y3R1cmVkIGxheW91dCBvZiBlbGVtZW50cy5cbiAgRk06IHtcbiAgICBvcGVuOiBfID0+ICc8ZGl2PicsXG4gICAgY2xvc2U6IF8gPT4gJzwvZGl2PidcbiAgfSxcbiAgLy8gUm93OiBsb2dpYyBncm91cGluZyBvZiBlbGVtZW50c1xuICBSVzoge1xuICAgIG9wZW46IF8gPT4gJzxkaXY+JyxcbiAgICBjbG9zZTogXyA9PiAnPC9kaXY+J1xuICB9LFxuICAvLyBRdW90ZWQgYmxvY2suXG4gIFFROiB7XG4gICAgb3BlbjogXyA9PiAnPGRpdj4nLFxuICAgIGNsb3NlOiBfID0+ICc8L2Rpdj4nLFxuICAgIHByb3BzOiAoZGF0YSkgPT4ge1xuICAgICAgcmV0dXJuIGRhdGEgPyB7fSA6IG51bGw7XG4gICAgfSxcbiAgfSxcbiAgLy8gVmlkZW8gY2FsbFxuICBWQzoge1xuICAgIG9wZW46IF8gPT4gJzxkaXY+JyxcbiAgICBjbG9zZTogXyA9PiAnPC9kaXY+JyxcbiAgICBwcm9wczogZGF0YSA9PiB7XG4gICAgICBpZiAoIWRhdGEpIHJldHVybiB7fTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgICdkYXRhLWR1cmF0aW9uJzogZGF0YS5kdXJhdGlvbixcbiAgICAgICAgJ2RhdGEtc3RhdGUnOiBkYXRhLnN0YXRlLFxuICAgICAgfTtcbiAgICB9XG4gIH0sXG59O1xuXG4vKipcbiAqIFRoZSBtYWluIG9iamVjdCB3aGljaCBwZXJmb3JtcyBhbGwgdGhlIGZvcm1hdHRpbmcgYWN0aW9ucy5cbiAqIEBjbGFzcyBEcmFmdHlcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5jb25zdCBEcmFmdHkgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy50eHQgPSAnJztcbiAgdGhpcy5mbXQgPSBbXTtcbiAgdGhpcy5lbnQgPSBbXTtcbn1cblxuLyoqXG4gKiBJbml0aWFsaXplIERyYWZ0eSBkb2N1bWVudCB0byBhIHBsYWluIHRleHQgc3RyaW5nLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBwbGFpblRleHQgLSBzdHJpbmcgdG8gdXNlIGFzIERyYWZ0eSBjb250ZW50LlxuICpcbiAqIEByZXR1cm5zIG5ldyBEcmFmdHkgZG9jdW1lbnQgb3IgbnVsbCBpcyBwbGFpblRleHQgaXMgbm90IGEgc3RyaW5nIG9yIHVuZGVmaW5lZC5cbiAqL1xuRHJhZnR5LmluaXQgPSBmdW5jdGlvbihwbGFpblRleHQpIHtcbiAgaWYgKHR5cGVvZiBwbGFpblRleHQgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBwbGFpblRleHQgPSAnJztcbiAgfSBlbHNlIGlmICh0eXBlb2YgcGxhaW5UZXh0ICE9ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHR4dDogcGxhaW5UZXh0XG4gIH07XG59XG5cbi8qKlxuICogUGFyc2UgcGxhaW4gdGV4dCBpbnRvIERyYWZ0eSBkb2N1bWVudC5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gY29udGVudCAtIHBsYWluLXRleHQgY29udGVudCB0byBwYXJzZS5cbiAqIEByZXR1cm4ge0RyYWZ0eX0gcGFyc2VkIGRvY3VtZW50IG9yIG51bGwgaWYgdGhlIHNvdXJjZSBpcyBub3QgcGxhaW4gdGV4dC5cbiAqL1xuRHJhZnR5LnBhcnNlID0gZnVuY3Rpb24oY29udGVudCkge1xuICAvLyBNYWtlIHN1cmUgd2UgYXJlIHBhcnNpbmcgc3RyaW5ncyBvbmx5LlxuICBpZiAodHlwZW9mIGNvbnRlbnQgIT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8vIFNwbGl0IHRleHQgaW50byBsaW5lcy4gSXQgbWFrZXMgZnVydGhlciBwcm9jZXNzaW5nIGVhc2llci5cbiAgY29uc3QgbGluZXMgPSBjb250ZW50LnNwbGl0KC9cXHI/XFxuLyk7XG5cbiAgLy8gSG9sZHMgZW50aXRpZXMgcmVmZXJlbmNlZCBmcm9tIHRleHRcbiAgY29uc3QgZW50aXR5TWFwID0gW107XG4gIGNvbnN0IGVudGl0eUluZGV4ID0ge307XG5cbiAgLy8gUHJvY2Vzc2luZyBsaW5lcyBvbmUgYnkgb25lLCBob2xkIGludGVybWVkaWF0ZSByZXN1bHQgaW4gYmx4LlxuICBjb25zdCBibHggPSBbXTtcbiAgbGluZXMuZm9yRWFjaCgobGluZSkgPT4ge1xuICAgIGxldCBzcGFucyA9IFtdO1xuICAgIGxldCBlbnRpdGllcztcblxuICAgIC8vIEZpbmQgZm9ybWF0dGVkIHNwYW5zIGluIHRoZSBzdHJpbmcuXG4gICAgLy8gVHJ5IHRvIG1hdGNoIGVhY2ggc3R5bGUuXG4gICAgSU5MSU5FX1NUWUxFUy5mb3JFYWNoKCh0YWcpID0+IHtcbiAgICAgIC8vIEVhY2ggc3R5bGUgY291bGQgYmUgbWF0Y2hlZCBtdWx0aXBsZSB0aW1lcy5cbiAgICAgIHNwYW5zID0gc3BhbnMuY29uY2F0KHNwYW5uaWZ5KGxpbmUsIHRhZy5zdGFydCwgdGFnLmVuZCwgdGFnLm5hbWUpKTtcbiAgICB9KTtcblxuICAgIGxldCBibG9jaztcbiAgICBpZiAoc3BhbnMubGVuZ3RoID09IDApIHtcbiAgICAgIGJsb2NrID0ge1xuICAgICAgICB0eHQ6IGxpbmVcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFNvcnQgc3BhbnMgYnkgc3R5bGUgb2NjdXJlbmNlIGVhcmx5IC0+IGxhdGUsIHRoZW4gYnkgbGVuZ3RoOiBmaXJzdCBsb25nIHRoZW4gc2hvcnQuXG4gICAgICBzcGFucy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgIGNvbnN0IGRpZmYgPSBhLmF0IC0gYi5hdDtcbiAgICAgICAgcmV0dXJuIGRpZmYgIT0gMCA/IGRpZmYgOiBiLmVuZCAtIGEuZW5kO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIENvbnZlcnQgYW4gYXJyYXkgb2YgcG9zc2libHkgb3ZlcmxhcHBpbmcgc3BhbnMgaW50byBhIHRyZWUuXG4gICAgICBzcGFucyA9IHRvU3BhblRyZWUoc3BhbnMpO1xuXG4gICAgICAvLyBCdWlsZCBhIHRyZWUgcmVwcmVzZW50YXRpb24gb2YgdGhlIGVudGlyZSBzdHJpbmcsIG5vdFxuICAgICAgLy8ganVzdCB0aGUgZm9ybWF0dGVkIHBhcnRzLlxuICAgICAgY29uc3QgY2h1bmtzID0gY2h1bmtpZnkobGluZSwgMCwgbGluZS5sZW5ndGgsIHNwYW5zKTtcblxuICAgICAgY29uc3QgZHJhZnR5ID0gZHJhZnRpZnkoY2h1bmtzLCAwKTtcblxuICAgICAgYmxvY2sgPSB7XG4gICAgICAgIHR4dDogZHJhZnR5LnR4dCxcbiAgICAgICAgZm10OiBkcmFmdHkuZm10XG4gICAgICB9O1xuICAgIH1cblxuICAgIC8vIEV4dHJhY3QgZW50aXRpZXMgZnJvbSB0aGUgY2xlYW5lZCB1cCBzdHJpbmcuXG4gICAgZW50aXRpZXMgPSBleHRyYWN0RW50aXRpZXMoYmxvY2sudHh0KTtcbiAgICBpZiAoZW50aXRpZXMubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgcmFuZ2VzID0gW107XG4gICAgICBmb3IgKGxldCBpIGluIGVudGl0aWVzKSB7XG4gICAgICAgIC8vIHtvZmZzZXQ6IG1hdGNoWydpbmRleCddLCB1bmlxdWU6IG1hdGNoWzBdLCBsZW46IG1hdGNoWzBdLmxlbmd0aCwgZGF0YTogZW50LnBhY2tlcigpLCB0eXBlOiBlbnQubmFtZX1cbiAgICAgICAgY29uc3QgZW50aXR5ID0gZW50aXRpZXNbaV07XG4gICAgICAgIGxldCBpbmRleCA9IGVudGl0eUluZGV4W2VudGl0eS51bmlxdWVdO1xuICAgICAgICBpZiAoIWluZGV4KSB7XG4gICAgICAgICAgaW5kZXggPSBlbnRpdHlNYXAubGVuZ3RoO1xuICAgICAgICAgIGVudGl0eUluZGV4W2VudGl0eS51bmlxdWVdID0gaW5kZXg7XG4gICAgICAgICAgZW50aXR5TWFwLnB1c2goe1xuICAgICAgICAgICAgdHA6IGVudGl0eS50eXBlLFxuICAgICAgICAgICAgZGF0YTogZW50aXR5LmRhdGFcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByYW5nZXMucHVzaCh7XG4gICAgICAgICAgYXQ6IGVudGl0eS5vZmZzZXQsXG4gICAgICAgICAgbGVuOiBlbnRpdHkubGVuLFxuICAgICAgICAgIGtleTogaW5kZXhcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBibG9jay5lbnQgPSByYW5nZXM7XG4gICAgfVxuXG4gICAgYmx4LnB1c2goYmxvY2spO1xuICB9KTtcblxuICBjb25zdCByZXN1bHQgPSB7XG4gICAgdHh0OiAnJ1xuICB9O1xuXG4gIC8vIE1lcmdlIGxpbmVzIGFuZCBzYXZlIGxpbmUgYnJlYWtzIGFzIEJSIGlubGluZSBmb3JtYXR0aW5nLlxuICBpZiAoYmx4Lmxlbmd0aCA+IDApIHtcbiAgICByZXN1bHQudHh0ID0gYmx4WzBdLnR4dDtcbiAgICByZXN1bHQuZm10ID0gKGJseFswXS5mbXQgfHwgW10pLmNvbmNhdChibHhbMF0uZW50IHx8IFtdKTtcblxuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgYmx4Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBibG9jayA9IGJseFtpXTtcbiAgICAgIGNvbnN0IG9mZnNldCA9IHJlc3VsdC50eHQubGVuZ3RoICsgMTtcblxuICAgICAgcmVzdWx0LmZtdC5wdXNoKHtcbiAgICAgICAgdHA6ICdCUicsXG4gICAgICAgIGxlbjogMSxcbiAgICAgICAgYXQ6IG9mZnNldCAtIDFcbiAgICAgIH0pO1xuXG4gICAgICByZXN1bHQudHh0ICs9ICcgJyArIGJsb2NrLnR4dDtcbiAgICAgIGlmIChibG9jay5mbXQpIHtcbiAgICAgICAgcmVzdWx0LmZtdCA9IHJlc3VsdC5mbXQuY29uY2F0KGJsb2NrLmZtdC5tYXAoKHMpID0+IHtcbiAgICAgICAgICBzLmF0ICs9IG9mZnNldDtcbiAgICAgICAgICByZXR1cm4gcztcbiAgICAgICAgfSkpO1xuICAgICAgfVxuICAgICAgaWYgKGJsb2NrLmVudCkge1xuICAgICAgICByZXN1bHQuZm10ID0gcmVzdWx0LmZtdC5jb25jYXQoYmxvY2suZW50Lm1hcCgocykgPT4ge1xuICAgICAgICAgIHMuYXQgKz0gb2Zmc2V0O1xuICAgICAgICAgIHJldHVybiBzO1xuICAgICAgICB9KSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHJlc3VsdC5mbXQubGVuZ3RoID09IDApIHtcbiAgICAgIGRlbGV0ZSByZXN1bHQuZm10O1xuICAgIH1cblxuICAgIGlmIChlbnRpdHlNYXAubGVuZ3RoID4gMCkge1xuICAgICAgcmVzdWx0LmVudCA9IGVudGl0eU1hcDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBBcHBlbmQgb25lIERyYWZ0eSBkb2N1bWVudCB0byBhbm90aGVyLlxuICpcbiAqIEBwYXJhbSB7RHJhZnR5fSBmaXJzdCAtIERyYWZ0eSBkb2N1bWVudCB0byBhcHBlbmQgdG8uXG4gKiBAcGFyYW0ge0RyYWZ0eXxzdHJpbmd9IHNlY29uZCAtIERyYWZ0eSBkb2N1bWVudCBvciBzdHJpbmcgYmVpbmcgYXBwZW5kZWQuXG4gKlxuICogQHJldHVybiB7RHJhZnR5fSBmaXJzdCBkb2N1bWVudCB3aXRoIHRoZSBzZWNvbmQgYXBwZW5kZWQgdG8gaXQuXG4gKi9cbkRyYWZ0eS5hcHBlbmQgPSBmdW5jdGlvbihmaXJzdCwgc2Vjb25kKSB7XG4gIGlmICghZmlyc3QpIHtcbiAgICByZXR1cm4gc2Vjb25kO1xuICB9XG4gIGlmICghc2Vjb25kKSB7XG4gICAgcmV0dXJuIGZpcnN0O1xuICB9XG5cbiAgZmlyc3QudHh0ID0gZmlyc3QudHh0IHx8ICcnO1xuICBjb25zdCBsZW4gPSBmaXJzdC50eHQubGVuZ3RoO1xuXG4gIGlmICh0eXBlb2Ygc2Vjb25kID09ICdzdHJpbmcnKSB7XG4gICAgZmlyc3QudHh0ICs9IHNlY29uZDtcbiAgfSBlbHNlIGlmIChzZWNvbmQudHh0KSB7XG4gICAgZmlyc3QudHh0ICs9IHNlY29uZC50eHQ7XG4gIH1cblxuICBpZiAoQXJyYXkuaXNBcnJheShzZWNvbmQuZm10KSkge1xuICAgIGZpcnN0LmZtdCA9IGZpcnN0LmZtdCB8fCBbXTtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShzZWNvbmQuZW50KSkge1xuICAgICAgZmlyc3QuZW50ID0gZmlyc3QuZW50IHx8IFtdO1xuICAgIH1cbiAgICBzZWNvbmQuZm10LmZvckVhY2goc3JjID0+IHtcbiAgICAgIGNvbnN0IGZtdCA9IHtcbiAgICAgICAgYXQ6IChzcmMuYXQgfCAwKSArIGxlbixcbiAgICAgICAgbGVuOiBzcmMubGVuIHwgMFxuICAgICAgfTtcbiAgICAgIC8vIFNwZWNpYWwgY2FzZSBmb3IgdGhlIG91dHNpZGUgb2YgdGhlIG5vcm1hbCByZW5kZXJpbmcgZmxvdyBzdHlsZXMuXG4gICAgICBpZiAoc3JjLmF0ID09IC0xKSB7XG4gICAgICAgIGZtdC5hdCA9IC0xO1xuICAgICAgICBmbXQubGVuID0gMDtcbiAgICAgIH1cbiAgICAgIGlmIChzcmMudHApIHtcbiAgICAgICAgZm10LnRwID0gc3JjLnRwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm10LmtleSA9IGZpcnN0LmVudC5sZW5ndGg7XG4gICAgICAgIGZpcnN0LmVudC5wdXNoKHNlY29uZC5lbnRbc3JjLmtleSB8fCAwXSk7XG4gICAgICB9XG4gICAgICBmaXJzdC5mbXQucHVzaChmbXQpO1xuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIGZpcnN0O1xufVxuXG4vKipcbiAqIEB0eXBlZGVmIERyYWZ0eS5JbWFnZURlc2NcbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEB0eXBlIE9iamVjdFxuICogQHBhcmFtIHtzdHJpbmd9IG1pbWUgLSBtaW1lLXR5cGUgb2YgdGhlIGltYWdlLCBlLmcuIFwiaW1hZ2UvcG5nXCJcbiAqIEBwYXJhbSB7c3RyaW5nfSBwcmV2aWV3IC0gYmFzZTY0LWVuY29kZWQgaW1hZ2UgY29udGVudCAob3IgcHJldmlldywgaWYgbGFyZ2UgaW1hZ2UgaXMgYXR0YWNoZWQpLiBDb3VsZCBiZSBudWxsL3VuZGVmaW5lZC5cbiAqIEBwYXJhbSB7aW50ZWdlcn0gd2lkdGggLSB3aWR0aCBvZiB0aGUgaW1hZ2VcbiAqIEBwYXJhbSB7aW50ZWdlcn0gaGVpZ2h0IC0gaGVpZ2h0IG9mIHRoZSBpbWFnZVxuICogQHBhcmFtIHtzdHJpbmd9IGZpbGVuYW1lIC0gZmlsZSBuYW1lIHN1Z2dlc3Rpb24gZm9yIGRvd25sb2FkaW5nIHRoZSBpbWFnZS5cbiAqIEBwYXJhbSB7aW50ZWdlcn0gc2l6ZSAtIHNpemUgb2YgdGhlIGltYWdlIGluIGJ5dGVzLiBUcmVhdCBpcyBhcyBhbiB1bnRydXN0ZWQgaGludC5cbiAqIEBwYXJhbSB7c3RyaW5nfSByZWZ1cmwgLSByZWZlcmVuY2UgdG8gdGhlIGNvbnRlbnQuIENvdWxkIGJlIG51bGwvdW5kZWZpbmVkLlxuICogQHBhcmFtIHtzdHJpbmd9IF90ZW1wUHJldmlldyAtIGJhc2U2NC1lbmNvZGVkIGltYWdlIHByZXZpZXcgdXNlZCBkdXJpbmcgdXBsb2FkIHByb2Nlc3M7IG5vdCBzZXJpYWxpemFibGUuXG4gKiBAcGFyYW0ge1Byb21pc2V9IHVybFByb21pc2UgLSBQcm9taXNlIHdoaWNoIHJldHVybnMgY29udGVudCBVUkwgd2hlbiByZXNvbHZlZC5cbiAqL1xuXG4vKipcbiAqIEluc2VydCBpbmxpbmUgaW1hZ2UgaW50byBEcmFmdHkgZG9jdW1lbnQuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGNvbnRlbnQgLSBkb2N1bWVudCB0byBhZGQgaW1hZ2UgdG8uXG4gKiBAcGFyYW0ge2ludGVnZXJ9IGF0IC0gaW5kZXggd2hlcmUgdGhlIG9iamVjdCBpcyBpbnNlcnRlZC4gVGhlIGxlbmd0aCBvZiB0aGUgaW1hZ2UgaXMgYWx3YXlzIDEuXG4gKiBAcGFyYW0ge0ltYWdlRGVzY30gaW1hZ2VEZXNjIC0gb2JqZWN0IHdpdGggaW1hZ2UgcGFyYW1lbmV0cyBhbmQgZGF0YS5cbiAqXG4gKiBAcmV0dXJuIHtEcmFmdHl9IHVwZGF0ZWQgZG9jdW1lbnQuXG4gKi9cbkRyYWZ0eS5pbnNlcnRJbWFnZSA9IGZ1bmN0aW9uKGNvbnRlbnQsIGF0LCBpbWFnZURlc2MpIHtcbiAgY29udGVudCA9IGNvbnRlbnQgfHwge1xuICAgIHR4dDogJyAnXG4gIH07XG4gIGNvbnRlbnQuZW50ID0gY29udGVudC5lbnQgfHwgW107XG4gIGNvbnRlbnQuZm10ID0gY29udGVudC5mbXQgfHwgW107XG5cbiAgY29udGVudC5mbXQucHVzaCh7XG4gICAgYXQ6IGF0IHwgMCxcbiAgICBsZW46IDEsXG4gICAga2V5OiBjb250ZW50LmVudC5sZW5ndGhcbiAgfSk7XG5cbiAgY29uc3QgZXggPSB7XG4gICAgdHA6ICdJTScsXG4gICAgZGF0YToge1xuICAgICAgbWltZTogaW1hZ2VEZXNjLm1pbWUsXG4gICAgICB2YWw6IGltYWdlRGVzYy5wcmV2aWV3LFxuICAgICAgd2lkdGg6IGltYWdlRGVzYy53aWR0aCxcbiAgICAgIGhlaWdodDogaW1hZ2VEZXNjLmhlaWdodCxcbiAgICAgIG5hbWU6IGltYWdlRGVzYy5maWxlbmFtZSxcbiAgICAgIHNpemU6IGltYWdlRGVzYy5zaXplIHwgMCxcbiAgICAgIHJlZjogaW1hZ2VEZXNjLnJlZnVybFxuICAgIH1cbiAgfTtcblxuICBpZiAoaW1hZ2VEZXNjLnVybFByb21pc2UpIHtcbiAgICBleC5kYXRhLl90ZW1wUHJldmlldyA9IGltYWdlRGVzYy5fdGVtcFByZXZpZXc7XG4gICAgZXguZGF0YS5fcHJvY2Vzc2luZyA9IHRydWU7XG4gICAgaW1hZ2VEZXNjLnVybFByb21pc2UudGhlbihcbiAgICAgIHVybCA9PiB7XG4gICAgICAgIGV4LmRhdGEucmVmID0gdXJsO1xuICAgICAgICBleC5kYXRhLl90ZW1wUHJldmlldyA9IHVuZGVmaW5lZDtcbiAgICAgICAgZXguZGF0YS5fcHJvY2Vzc2luZyA9IHVuZGVmaW5lZDtcbiAgICAgIH0sXG4gICAgICBfID0+IHtcbiAgICAgICAgLy8gQ2F0Y2ggdGhlIGVycm9yLCBvdGhlcndpc2UgaXQgd2lsbCBhcHBlYXIgaW4gdGhlIGNvbnNvbGUuXG4gICAgICAgIGV4LmRhdGEuX3Byb2Nlc3NpbmcgPSB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgKTtcbiAgfVxuXG4gIGNvbnRlbnQuZW50LnB1c2goZXgpO1xuXG4gIHJldHVybiBjb250ZW50O1xufVxuXG4vKipcbiAqIEB0eXBlZGVmIERyYWZ0eS5BdWRpb0Rlc2NcbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEB0eXBlIE9iamVjdFxuICogQHBhcmFtIHtzdHJpbmd9IG1pbWUgLSBtaW1lLXR5cGUgb2YgdGhlIGF1ZGlvLCBlLmcuIFwiYXVkaW8vb2dnXCIuXG4gKiBAcGFyYW0ge3N0cmluZ30gZGF0YSAtIGJhc2U2NC1lbmNvZGVkIGF1ZGlvIGNvbnRlbnQuIENvdWxkIGJlIG51bGwvdW5kZWZpbmVkLlxuICogQHBhcmFtIHtpbnRlZ2VyfSBkdXJhdGlvbiAtIGR1cmF0aW9uIG9mIHRoZSByZWNvcmQgaW4gbWlsbGlzZWNvbmRzLlxuICogQHBhcmFtIHtzdHJpbmd9IHByZXZpZXcgLSBiYXNlNjQgZW5jb2RlZCBzaG9ydCBhcnJheSBvZiBhbXBsaXR1ZGUgdmFsdWVzIDAuLjEwMC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlbmFtZSAtIGZpbGUgbmFtZSBzdWdnZXN0aW9uIGZvciBkb3dubG9hZGluZyB0aGUgYXVkaW8uXG4gKiBAcGFyYW0ge2ludGVnZXJ9IHNpemUgLSBzaXplIG9mIHRoZSByZWNvcmRpbmcgaW4gYnl0ZXMuIFRyZWF0IGlzIGFzIGFuIHVudHJ1c3RlZCBoaW50LlxuICogQHBhcmFtIHtzdHJpbmd9IHJlZnVybCAtIHJlZmVyZW5jZSB0byB0aGUgY29udGVudC4gQ291bGQgYmUgbnVsbC91bmRlZmluZWQuXG4gKiBAcGFyYW0ge1Byb21pc2V9IHVybFByb21pc2UgLSBQcm9taXNlIHdoaWNoIHJldHVybnMgY29udGVudCBVUkwgd2hlbiByZXNvbHZlZC5cbiAqL1xuXG4vKipcbiAqIEluc2VydCBhdWRpbyByZWNvcmRpbmcgaW50byBEcmFmdHkgZG9jdW1lbnQuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGNvbnRlbnQgLSBkb2N1bWVudCB0byBhZGQgYXVkaW8gcmVjb3JkIHRvLlxuICogQHBhcmFtIHtpbnRlZ2VyfSBhdCAtIGluZGV4IHdoZXJlIHRoZSBvYmplY3QgaXMgaW5zZXJ0ZWQuIFRoZSBsZW5ndGggb2YgdGhlIHJlY29yZCBpcyBhbHdheXMgMS5cbiAqIEBwYXJhbSB7QXVkaW9EZXNjfSBhdWRpb0Rlc2MgLSBvYmplY3Qgd2l0aCB0aGUgYXVkaW8gcGFyYW1lbmV0cyBhbmQgZGF0YS5cbiAqXG4gKiBAcmV0dXJuIHtEcmFmdHl9IHVwZGF0ZWQgZG9jdW1lbnQuXG4gKi9cbkRyYWZ0eS5pbnNlcnRBdWRpbyA9IGZ1bmN0aW9uKGNvbnRlbnQsIGF0LCBhdWRpb0Rlc2MpIHtcbiAgY29udGVudCA9IGNvbnRlbnQgfHwge1xuICAgIHR4dDogJyAnXG4gIH07XG4gIGNvbnRlbnQuZW50ID0gY29udGVudC5lbnQgfHwgW107XG4gIGNvbnRlbnQuZm10ID0gY29udGVudC5mbXQgfHwgW107XG5cbiAgY29udGVudC5mbXQucHVzaCh7XG4gICAgYXQ6IGF0IHwgMCxcbiAgICBsZW46IDEsXG4gICAga2V5OiBjb250ZW50LmVudC5sZW5ndGhcbiAgfSk7XG5cbiAgY29uc3QgZXggPSB7XG4gICAgdHA6ICdBVScsXG4gICAgZGF0YToge1xuICAgICAgbWltZTogYXVkaW9EZXNjLm1pbWUsXG4gICAgICB2YWw6IGF1ZGlvRGVzYy5kYXRhLFxuICAgICAgZHVyYXRpb246IGF1ZGlvRGVzYy5kdXJhdGlvbiB8IDAsXG4gICAgICBwcmV2aWV3OiBhdWRpb0Rlc2MucHJldmlldyxcbiAgICAgIG5hbWU6IGF1ZGlvRGVzYy5maWxlbmFtZSxcbiAgICAgIHNpemU6IGF1ZGlvRGVzYy5zaXplIHwgMCxcbiAgICAgIHJlZjogYXVkaW9EZXNjLnJlZnVybFxuICAgIH1cbiAgfTtcblxuICBpZiAoYXVkaW9EZXNjLnVybFByb21pc2UpIHtcbiAgICBleC5kYXRhLl9wcm9jZXNzaW5nID0gdHJ1ZTtcbiAgICBhdWRpb0Rlc2MudXJsUHJvbWlzZS50aGVuKFxuICAgICAgdXJsID0+IHtcbiAgICAgICAgZXguZGF0YS5yZWYgPSB1cmw7XG4gICAgICAgIGV4LmRhdGEuX3Byb2Nlc3NpbmcgPSB1bmRlZmluZWQ7XG4gICAgICB9LFxuICAgICAgXyA9PiB7XG4gICAgICAgIC8vIENhdGNoIHRoZSBlcnJvciwgb3RoZXJ3aXNlIGl0IHdpbGwgYXBwZWFyIGluIHRoZSBjb25zb2xlLlxuICAgICAgICBleC5kYXRhLl9wcm9jZXNzaW5nID0gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgICk7XG4gIH1cblxuICBjb250ZW50LmVudC5wdXNoKGV4KTtcblxuICByZXR1cm4gY29udGVudDtcbn1cblxuLyoqXG4gKiBDcmVhdGUgYSAoc2VsZi1jb250YWluZWQpIHZpZGVvIGNhbGwgRHJhZnR5IGRvY3VtZW50LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEByZXR1cm5zIFZpZGVvIENhbGwgZHJhZnR5IGRvY3VtZW50LlxuICovXG5EcmFmdHkudmlkZW9DYWxsID0gZnVuY3Rpb24oKSB7XG4gIGNvbnN0IGNvbnRlbnQgPSB7XG4gICAgdHh0OiAnICcsXG4gICAgZm10OiBbe1xuICAgICAgYXQ6IDAsXG4gICAgICBsZW46IDEsXG4gICAgICBrZXk6IDBcbiAgICB9XSxcbiAgICBlbnQ6IFt7XG4gICAgICB0cDogJ1ZDJ1xuICAgIH1dXG4gIH07XG4gIHJldHVybiBjb250ZW50O1xufVxuXG4vKipcbiAqIFVwZGF0ZSB2aWRlbyBjYWxsIChWQykgZW50aXR5IHdpdGggdGhlIG5ldyBzdGF0dXMgYW5kIGR1cmF0aW9uLlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fSBjb250ZW50IC0gVkMgZG9jdW1lbnQgdG8gdXBkYXRlLlxuICogQHBhcmFtIHtvYmplY3R9IHBhcmFtcyAtIG5ldyB2aWRlbyBjYWxsIHBhcmFtZXRlcnMuXG4gKiBAcGFyYW0ge3N0cmluZ30gcGFyYW1zLnN0YXRlIC0gc3RhdGUgb2YgdmlkZW8gY2FsbC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBwYXJhbXMuZHVyYXRpb24gLSBkdXJhdGlvbiBvZiB0aGUgdmlkZW8gY2FsbCBpbiBtaWxsaXNlY29uZHMuXG4gKlxuICogQHJldHVybnMgdGhlIHNhbWUgZG9jdW1lbnQgd2l0aCB1cGRhdGUgYXBwbGllZC5cbiAqL1xuRHJhZnR5LnVwZGF0ZVZpZGVvRW50ID0gZnVuY3Rpb24oY29udGVudCwgcGFyYW1zKSB7XG4gIC8vIFRoZSB2aWRlbyBlbGVtZW50IGNvdWxkIGJlIGp1c3QgYSBmb3JtYXQgb3IgYSBmb3JtYXQgKyBlbnRpdHkuXG4gIC8vIE11c3QgZW5zdXJlIGl0J3MgdGhlIGxhdHRlciBmaXJzdC5cbiAgY29uc3QgZm10ID0gKChjb250ZW50IHx8IHt9KS5mbXQgfHwgW10pWzBdO1xuICBpZiAoIWZtdCkge1xuICAgIC8vIFVucmVjb2duaXplZCBjb250ZW50LlxuICAgIHJldHVybiBjb250ZW50O1xuICB9XG5cbiAgbGV0IGVudDtcbiAgaWYgKGZtdC50cCA9PSAnVkMnKSB7XG4gICAgLy8gSnVzdCBhIGZvcm1hdCwgY29udmVydCB0byBmb3JtYXQgKyBlbnRpdHkuXG4gICAgZGVsZXRlIGZtdC50cDtcbiAgICBmbXQua2V5ID0gMDtcbiAgICBlbnQgPSB7XG4gICAgICB0cDogJ1ZDJ1xuICAgIH07XG4gICAgY29udGVudC5lbnQgPSBbZW50XTtcbiAgfSBlbHNlIHtcbiAgICBlbnQgPSAoY29udGVudC5lbnQgfHwgW10pW2ZtdC5rZXkgfCAwXTtcbiAgICBpZiAoIWVudCB8fCBlbnQudHAgIT0gJ1ZDJykge1xuICAgICAgLy8gTm90IGEgVkMgZW50aXR5LlxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfVxuICB9XG4gIGVudC5kYXRhID0gZW50LmRhdGEgfHwge307XG4gIE9iamVjdC5hc3NpZ24oZW50LmRhdGEsIHBhcmFtcyk7XG4gIHJldHVybiBjb250ZW50O1xufVxuXG4vKipcbiAqIENyZWF0ZSBhIHF1b3RlIHRvIERyYWZ0eSBkb2N1bWVudC5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gaGVhZGVyIC0gUXVvdGUgaGVhZGVyICh0aXRsZSwgZXRjLikuXG4gKiBAcGFyYW0ge3N0cmluZ30gdWlkIC0gVUlEIG9mIHRoZSBhdXRob3IgdG8gbWVudGlvbi5cbiAqIEBwYXJhbSB7RHJhZnR5fSBib2R5IC0gQm9keSBvZiB0aGUgcXVvdGVkIG1lc3NhZ2UuXG4gKlxuICogQHJldHVybnMgUmVwbHkgcXVvdGUgRHJhZnR5IGRvYyB3aXRoIHRoZSBxdW90ZSBmb3JtYXR0aW5nLlxuICovXG5EcmFmdHkucXVvdGUgPSBmdW5jdGlvbihoZWFkZXIsIHVpZCwgYm9keSkge1xuICBjb25zdCBxdW90ZSA9IERyYWZ0eS5hcHBlbmQoRHJhZnR5LmFwcGVuZExpbmVCcmVhayhEcmFmdHkubWVudGlvbihoZWFkZXIsIHVpZCkpLCBib2R5KTtcblxuICAvLyBXcmFwIGludG8gYSBxdW90ZS5cbiAgcXVvdGUuZm10LnB1c2goe1xuICAgIGF0OiAwLFxuICAgIGxlbjogcXVvdGUudHh0Lmxlbmd0aCxcbiAgICB0cDogJ1FRJ1xuICB9KTtcblxuICByZXR1cm4gcXVvdGU7XG59XG5cbi8qKlxuICogQ3JlYXRlIGEgRHJhZnR5IGRvY3VtZW50IHdpdGggYSBtZW50aW9uLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gbWVudGlvbmVkIG5hbWUuXG4gKiBAcGFyYW0ge3N0cmluZ30gdWlkIC0gbWVudGlvbmVkIHVzZXIgSUQuXG4gKlxuICogQHJldHVybnMge0RyYWZ0eX0gZG9jdW1lbnQgd2l0aCB0aGUgbWVudGlvbi5cbiAqL1xuRHJhZnR5Lm1lbnRpb24gPSBmdW5jdGlvbihuYW1lLCB1aWQpIHtcbiAgcmV0dXJuIHtcbiAgICB0eHQ6IG5hbWUgfHwgJycsXG4gICAgZm10OiBbe1xuICAgICAgYXQ6IDAsXG4gICAgICBsZW46IChuYW1lIHx8ICcnKS5sZW5ndGgsXG4gICAgICBrZXk6IDBcbiAgICB9XSxcbiAgICBlbnQ6IFt7XG4gICAgICB0cDogJ01OJyxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgdmFsOiB1aWRcbiAgICAgIH1cbiAgICB9XVxuICB9O1xufVxuXG4vKipcbiAqIEFwcGVuZCBhIGxpbmsgdG8gYSBEcmFmdHkgZG9jdW1lbnQuXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGNvbnRlbnQgLSBEcmFmdHkgZG9jdW1lbnQgdG8gYXBwZW5kIGxpbmsgdG8uXG4gKiBAcGFyYW0ge09iamVjdH0gbGlua0RhdGEgLSBMaW5rIGluZm8gaW4gZm9ybWF0IDxjb2RlPnt0eHQ6ICdhbmtvciB0ZXh0JywgdXJsOiAnaHR0cDovLy4uLid9PC9jb2RlPi5cbiAqXG4gKiBAcmV0dXJucyB7RHJhZnR5fSB0aGUgc2FtZSBkb2N1bWVudCBhcyA8Y29kZT5jb250ZW50PC9jb2RlPi5cbiAqL1xuRHJhZnR5LmFwcGVuZExpbmsgPSBmdW5jdGlvbihjb250ZW50LCBsaW5rRGF0YSkge1xuICBjb250ZW50ID0gY29udGVudCB8fCB7XG4gICAgdHh0OiAnJ1xuICB9O1xuXG4gIGNvbnRlbnQuZW50ID0gY29udGVudC5lbnQgfHwgW107XG4gIGNvbnRlbnQuZm10ID0gY29udGVudC5mbXQgfHwgW107XG5cbiAgY29udGVudC5mbXQucHVzaCh7XG4gICAgYXQ6IGNvbnRlbnQudHh0Lmxlbmd0aCxcbiAgICBsZW46IGxpbmtEYXRhLnR4dC5sZW5ndGgsXG4gICAga2V5OiBjb250ZW50LmVudC5sZW5ndGhcbiAgfSk7XG4gIGNvbnRlbnQudHh0ICs9IGxpbmtEYXRhLnR4dDtcblxuICBjb25zdCBleCA9IHtcbiAgICB0cDogJ0xOJyxcbiAgICBkYXRhOiB7XG4gICAgICB1cmw6IGxpbmtEYXRhLnVybFxuICAgIH1cbiAgfVxuICBjb250ZW50LmVudC5wdXNoKGV4KTtcblxuICByZXR1cm4gY29udGVudDtcbn1cblxuLyoqXG4gKiBBcHBlbmQgaW1hZ2UgdG8gRHJhZnR5IGRvY3VtZW50LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fSBjb250ZW50IC0gZG9jdW1lbnQgdG8gYWRkIGltYWdlIHRvLlxuICogQHBhcmFtIHtJbWFnZURlc2N9IGltYWdlRGVzYyAtIG9iamVjdCB3aXRoIGltYWdlIHBhcmFtZW5ldHMuXG4gKlxuICogQHJldHVybiB7RHJhZnR5fSB1cGRhdGVkIGRvY3VtZW50LlxuICovXG5EcmFmdHkuYXBwZW5kSW1hZ2UgPSBmdW5jdGlvbihjb250ZW50LCBpbWFnZURlc2MpIHtcbiAgY29udGVudCA9IGNvbnRlbnQgfHwge1xuICAgIHR4dDogJydcbiAgfTtcbiAgY29udGVudC50eHQgKz0gJyAnO1xuICByZXR1cm4gRHJhZnR5Lmluc2VydEltYWdlKGNvbnRlbnQsIGNvbnRlbnQudHh0Lmxlbmd0aCAtIDEsIGltYWdlRGVzYyk7XG59XG5cbi8qKlxuICogQXBwZW5kIGF1ZGlvIHJlY29kcmluZyB0byBEcmFmdHkgZG9jdW1lbnQuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGNvbnRlbnQgLSBkb2N1bWVudCB0byBhZGQgcmVjb3JkaW5nIHRvLlxuICogQHBhcmFtIHtBdWRpb0Rlc2N9IGF1ZGlvRGVzYyAtIG9iamVjdCB3aXRoIGF1ZGlvIGRhdGEuXG4gKlxuICogQHJldHVybiB7RHJhZnR5fSB1cGRhdGVkIGRvY3VtZW50LlxuICovXG5EcmFmdHkuYXBwZW5kQXVkaW8gPSBmdW5jdGlvbihjb250ZW50LCBhdWRpb0Rlc2MpIHtcbiAgY29udGVudCA9IGNvbnRlbnQgfHwge1xuICAgIHR4dDogJydcbiAgfTtcbiAgY29udGVudC50eHQgKz0gJyAnO1xuICByZXR1cm4gRHJhZnR5Lmluc2VydEF1ZGlvKGNvbnRlbnQsIGNvbnRlbnQudHh0Lmxlbmd0aCAtIDEsIGF1ZGlvRGVzYyk7XG59XG5cbi8qKlxuICogQHR5cGVkZWYgRHJhZnR5LkF0dGFjaG1lbnREZXNjXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAdHlwZSBPYmplY3RcbiAqIEBwYXJhbSB7c3RyaW5nfSBtaW1lIC0gbWltZS10eXBlIG9mIHRoZSBhdHRhY2htZW50LCBlLmcuIFwiYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtXCJcbiAqIEBwYXJhbSB7c3RyaW5nfSBkYXRhIC0gYmFzZTY0LWVuY29kZWQgaW4tYmFuZCBjb250ZW50IG9mIHNtYWxsIGF0dGFjaG1lbnRzLiBDb3VsZCBiZSBudWxsL3VuZGVmaW5lZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlbmFtZSAtIGZpbGUgbmFtZSBzdWdnZXN0aW9uIGZvciBkb3dubG9hZGluZyB0aGUgYXR0YWNobWVudC5cbiAqIEBwYXJhbSB7aW50ZWdlcn0gc2l6ZSAtIHNpemUgb2YgdGhlIGZpbGUgaW4gYnl0ZXMuIFRyZWF0IGlzIGFzIGFuIHVudHJ1c3RlZCBoaW50LlxuICogQHBhcmFtIHtzdHJpbmd9IHJlZnVybCAtIHJlZmVyZW5jZSB0byB0aGUgb3V0LW9mLWJhbmQgY29udGVudC4gQ291bGQgYmUgbnVsbC91bmRlZmluZWQuXG4gKiBAcGFyYW0ge1Byb21pc2V9IHVybFByb21pc2UgLSBQcm9taXNlIHdoaWNoIHJldHVybnMgY29udGVudCBVUkwgd2hlbiByZXNvbHZlZC5cbiAqL1xuXG4vKipcbiAqIEF0dGFjaCBmaWxlIHRvIERyYWZ0eSBjb250ZW50LiBFaXRoZXIgYXMgYSBibG9iIG9yIGFzIGEgcmVmZXJlbmNlLlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fSBjb250ZW50IC0gZG9jdW1lbnQgdG8gYXR0YWNoIGZpbGUgdG8uXG4gKiBAcGFyYW0ge0F0dGFjaG1lbnREZXNjfSBvYmplY3QgLSBjb250YWluaW5nIGF0dGFjaG1lbnQgZGVzY3JpcHRpb24gYW5kIGRhdGEuXG4gKlxuICogQHJldHVybiB7RHJhZnR5fSB1cGRhdGVkIGRvY3VtZW50LlxuICovXG5EcmFmdHkuYXR0YWNoRmlsZSA9IGZ1bmN0aW9uKGNvbnRlbnQsIGF0dGFjaG1lbnREZXNjKSB7XG4gIGNvbnRlbnQgPSBjb250ZW50IHx8IHtcbiAgICB0eHQ6ICcnXG4gIH07XG5cbiAgY29udGVudC5lbnQgPSBjb250ZW50LmVudCB8fCBbXTtcbiAgY29udGVudC5mbXQgPSBjb250ZW50LmZtdCB8fCBbXTtcblxuICBjb250ZW50LmZtdC5wdXNoKHtcbiAgICBhdDogLTEsXG4gICAgbGVuOiAwLFxuICAgIGtleTogY29udGVudC5lbnQubGVuZ3RoXG4gIH0pO1xuXG4gIGNvbnN0IGV4ID0ge1xuICAgIHRwOiAnRVgnLFxuICAgIGRhdGE6IHtcbiAgICAgIG1pbWU6IGF0dGFjaG1lbnREZXNjLm1pbWUsXG4gICAgICB2YWw6IGF0dGFjaG1lbnREZXNjLmRhdGEsXG4gICAgICBuYW1lOiBhdHRhY2htZW50RGVzYy5maWxlbmFtZSxcbiAgICAgIHJlZjogYXR0YWNobWVudERlc2MucmVmdXJsLFxuICAgICAgc2l6ZTogYXR0YWNobWVudERlc2Muc2l6ZSB8IDBcbiAgICB9XG4gIH1cbiAgaWYgKGF0dGFjaG1lbnREZXNjLnVybFByb21pc2UpIHtcbiAgICBleC5kYXRhLl9wcm9jZXNzaW5nID0gdHJ1ZTtcbiAgICBhdHRhY2htZW50RGVzYy51cmxQcm9taXNlLnRoZW4oXG4gICAgICAodXJsKSA9PiB7XG4gICAgICAgIGV4LmRhdGEucmVmID0gdXJsO1xuICAgICAgICBleC5kYXRhLl9wcm9jZXNzaW5nID0gdW5kZWZpbmVkO1xuICAgICAgfSxcbiAgICAgIChlcnIpID0+IHtcbiAgICAgICAgLyogY2F0Y2ggdGhlIGVycm9yLCBvdGhlcndpc2UgaXQgd2lsbCBhcHBlYXIgaW4gdGhlIGNvbnNvbGUuICovXG4gICAgICAgIGV4LmRhdGEuX3Byb2Nlc3NpbmcgPSB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgKTtcbiAgfVxuICBjb250ZW50LmVudC5wdXNoKGV4KTtcblxuICByZXR1cm4gY29udGVudDtcbn1cblxuLyoqXG4gKiBXcmFwcyBkcmFmdHkgZG9jdW1lbnQgaW50byBhIHNpbXBsZSBmb3JtYXR0aW5nIHN0eWxlLlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fHN0cmluZ30gY29udGVudCAtIGRvY3VtZW50IG9yIHN0cmluZyB0byB3cmFwIGludG8gYSBzdHlsZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHlsZSAtIHR3by1sZXR0ZXIgc3R5bGUgdG8gd3JhcCBpbnRvLlxuICogQHBhcmFtIHtudW1iZXJ9IGF0IC0gaW5kZXggd2hlcmUgdGhlIHN0eWxlIHN0YXJ0cywgZGVmYXVsdCAwLlxuICogQHBhcmFtIHtudW1iZXJ9IGxlbiAtIGxlbmd0aCBvZiB0aGUgZm9ybSBjb250ZW50LCBkZWZhdWx0IGFsbCBvZiBpdC5cbiAqXG4gKiBAcmV0dXJuIHtEcmFmdHl9IHVwZGF0ZWQgZG9jdW1lbnQuXG4gKi9cbkRyYWZ0eS53cmFwSW50byA9IGZ1bmN0aW9uKGNvbnRlbnQsIHN0eWxlLCBhdCwgbGVuKSB7XG4gIGlmICh0eXBlb2YgY29udGVudCA9PSAnc3RyaW5nJykge1xuICAgIGNvbnRlbnQgPSB7XG4gICAgICB0eHQ6IGNvbnRlbnRcbiAgICB9O1xuICB9XG4gIGNvbnRlbnQuZm10ID0gY29udGVudC5mbXQgfHwgW107XG5cbiAgY29udGVudC5mbXQucHVzaCh7XG4gICAgYXQ6IGF0IHx8IDAsXG4gICAgbGVuOiBsZW4gfHwgY29udGVudC50eHQubGVuZ3RoLFxuICAgIHRwOiBzdHlsZSxcbiAgfSk7XG5cbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cbi8qKlxuICogV3JhcHMgY29udGVudCBpbnRvIGFuIGludGVyYWN0aXZlIGZvcm0uXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl8c3RyaW5nfSBjb250ZW50IC0gdG8gd3JhcCBpbnRvIGEgZm9ybS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBhdCAtIGluZGV4IHdoZXJlIHRoZSBmb3JtcyBzdGFydHMuXG4gKiBAcGFyYW0ge251bWJlcn0gbGVuIC0gbGVuZ3RoIG9mIHRoZSBmb3JtIGNvbnRlbnQuXG4gKlxuICogQHJldHVybiB7RHJhZnR5fSB1cGRhdGVkIGRvY3VtZW50LlxuICovXG5EcmFmdHkud3JhcEFzRm9ybSA9IGZ1bmN0aW9uKGNvbnRlbnQsIGF0LCBsZW4pIHtcbiAgcmV0dXJuIERyYWZ0eS53cmFwSW50byhjb250ZW50LCAnRk0nLCBhdCwgbGVuKTtcbn1cblxuLyoqXG4gKiBJbnNlcnQgY2xpY2thYmxlIGJ1dHRvbiBpbnRvIERyYWZ0eSBkb2N1bWVudC5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eXxzdHJpbmd9IGNvbnRlbnQgLSBEcmFmdHkgZG9jdW1lbnQgdG8gaW5zZXJ0IGJ1dHRvbiB0byBvciBhIHN0cmluZyB0byBiZSB1c2VkIGFzIGJ1dHRvbiB0ZXh0LlxuICogQHBhcmFtIHtudW1iZXJ9IGF0IC0gbG9jYXRpb24gd2hlcmUgdGhlIGJ1dHRvbiBpcyBpbnNlcnRlZC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBsZW4gLSB0aGUgbGVuZ3RoIG9mIHRoZSB0ZXh0IHRvIGJlIHVzZWQgYXMgYnV0dG9uIHRpdGxlLlxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSB0aGUgYnV0dG9uLiBDbGllbnQgc2hvdWxkIHJldHVybiBpdCB0byB0aGUgc2VydmVyIHdoZW4gdGhlIGJ1dHRvbiBpcyBjbGlja2VkLlxuICogQHBhcmFtIHtzdHJpbmd9IGFjdGlvblR5cGUgLSB0aGUgdHlwZSBvZiB0aGUgYnV0dG9uLCBvbmUgb2YgJ3VybCcgb3IgJ3B1YicuXG4gKiBAcGFyYW0ge3N0cmluZ30gYWN0aW9uVmFsdWUgLSB0aGUgdmFsdWUgdG8gcmV0dXJuIG9uIGNsaWNrOlxuICogQHBhcmFtIHtzdHJpbmd9IHJlZlVybCAtIHRoZSBVUkwgdG8gZ28gdG8gd2hlbiB0aGUgJ3VybCcgYnV0dG9uIGlzIGNsaWNrZWQuXG4gKlxuICogQHJldHVybiB7RHJhZnR5fSB1cGRhdGVkIGRvY3VtZW50LlxuICovXG5EcmFmdHkuaW5zZXJ0QnV0dG9uID0gZnVuY3Rpb24oY29udGVudCwgYXQsIGxlbiwgbmFtZSwgYWN0aW9uVHlwZSwgYWN0aW9uVmFsdWUsIHJlZlVybCkge1xuICBpZiAodHlwZW9mIGNvbnRlbnQgPT0gJ3N0cmluZycpIHtcbiAgICBjb250ZW50ID0ge1xuICAgICAgdHh0OiBjb250ZW50XG4gICAgfTtcbiAgfVxuXG4gIGlmICghY29udGVudCB8fCAhY29udGVudC50eHQgfHwgY29udGVudC50eHQubGVuZ3RoIDwgYXQgKyBsZW4pIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGlmIChsZW4gPD0gMCB8fCBbJ3VybCcsICdwdWInXS5pbmRleE9mKGFjdGlvblR5cGUpID09IC0xKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgLy8gRW5zdXJlIHJlZlVybCBpcyBhIHN0cmluZy5cbiAgaWYgKGFjdGlvblR5cGUgPT0gJ3VybCcgJiYgIXJlZlVybCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHJlZlVybCA9ICcnICsgcmVmVXJsO1xuXG4gIGNvbnRlbnQuZW50ID0gY29udGVudC5lbnQgfHwgW107XG4gIGNvbnRlbnQuZm10ID0gY29udGVudC5mbXQgfHwgW107XG5cbiAgY29udGVudC5mbXQucHVzaCh7XG4gICAgYXQ6IGF0IHwgMCxcbiAgICBsZW46IGxlbixcbiAgICBrZXk6IGNvbnRlbnQuZW50Lmxlbmd0aFxuICB9KTtcbiAgY29udGVudC5lbnQucHVzaCh7XG4gICAgdHA6ICdCTicsXG4gICAgZGF0YToge1xuICAgICAgYWN0OiBhY3Rpb25UeXBlLFxuICAgICAgdmFsOiBhY3Rpb25WYWx1ZSxcbiAgICAgIHJlZjogcmVmVXJsLFxuICAgICAgbmFtZTogbmFtZVxuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cbi8qKlxuICogQXBwZW5kIGNsaWNrYWJsZSBidXR0b24gdG8gRHJhZnR5IGRvY3VtZW50LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fHN0cmluZ30gY29udGVudCAtIERyYWZ0eSBkb2N1bWVudCB0byBpbnNlcnQgYnV0dG9uIHRvIG9yIGEgc3RyaW5nIHRvIGJlIHVzZWQgYXMgYnV0dG9uIHRleHQuXG4gKiBAcGFyYW0ge3N0cmluZ30gdGl0bGUgLSB0aGUgdGV4dCB0byBiZSB1c2VkIGFzIGJ1dHRvbiB0aXRsZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gdGhlIGJ1dHRvbi4gQ2xpZW50IHNob3VsZCByZXR1cm4gaXQgdG8gdGhlIHNlcnZlciB3aGVuIHRoZSBidXR0b24gaXMgY2xpY2tlZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBhY3Rpb25UeXBlIC0gdGhlIHR5cGUgb2YgdGhlIGJ1dHRvbiwgb25lIG9mICd1cmwnIG9yICdwdWInLlxuICogQHBhcmFtIHtzdHJpbmd9IGFjdGlvblZhbHVlIC0gdGhlIHZhbHVlIHRvIHJldHVybiBvbiBjbGljazpcbiAqIEBwYXJhbSB7c3RyaW5nfSByZWZVcmwgLSB0aGUgVVJMIHRvIGdvIHRvIHdoZW4gdGhlICd1cmwnIGJ1dHRvbiBpcyBjbGlja2VkLlxuICpcbiAqIEByZXR1cm4ge0RyYWZ0eX0gdXBkYXRlZCBkb2N1bWVudC5cbiAqL1xuRHJhZnR5LmFwcGVuZEJ1dHRvbiA9IGZ1bmN0aW9uKGNvbnRlbnQsIHRpdGxlLCBuYW1lLCBhY3Rpb25UeXBlLCBhY3Rpb25WYWx1ZSwgcmVmVXJsKSB7XG4gIGNvbnRlbnQgPSBjb250ZW50IHx8IHtcbiAgICB0eHQ6ICcnXG4gIH07XG4gIGNvbnN0IGF0ID0gY29udGVudC50eHQubGVuZ3RoO1xuICBjb250ZW50LnR4dCArPSB0aXRsZTtcbiAgcmV0dXJuIERyYWZ0eS5pbnNlcnRCdXR0b24oY29udGVudCwgYXQsIHRpdGxlLmxlbmd0aCwgbmFtZSwgYWN0aW9uVHlwZSwgYWN0aW9uVmFsdWUsIHJlZlVybCk7XG59XG5cbi8qKlxuICogQXR0YWNoIGEgZ2VuZXJpYyBKUyBvYmplY3QuIFRoZSBvYmplY3QgaXMgYXR0YWNoZWQgYXMgYSBqc29uIHN0cmluZy5cbiAqIEludGVuZGVkIGZvciByZXByZXNlbnRpbmcgYSBmb3JtIHJlc3BvbnNlLlxuICpcbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eX0gY29udGVudCAtIERyYWZ0eSBkb2N1bWVudCB0byBhdHRhY2ggZmlsZSB0by5cbiAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIC0gZGF0YSB0byBjb252ZXJ0IHRvIGpzb24gc3RyaW5nIGFuZCBhdHRhY2guXG4gKiBAcmV0dXJucyB7RHJhZnR5fSB0aGUgc2FtZSBkb2N1bWVudCBhcyA8Y29kZT5jb250ZW50PC9jb2RlPi5cbiAqL1xuRHJhZnR5LmF0dGFjaEpTT04gPSBmdW5jdGlvbihjb250ZW50LCBkYXRhKSB7XG4gIGNvbnRlbnQgPSBjb250ZW50IHx8IHtcbiAgICB0eHQ6ICcnXG4gIH07XG4gIGNvbnRlbnQuZW50ID0gY29udGVudC5lbnQgfHwgW107XG4gIGNvbnRlbnQuZm10ID0gY29udGVudC5mbXQgfHwgW107XG5cbiAgY29udGVudC5mbXQucHVzaCh7XG4gICAgYXQ6IC0xLFxuICAgIGxlbjogMCxcbiAgICBrZXk6IGNvbnRlbnQuZW50Lmxlbmd0aFxuICB9KTtcblxuICBjb250ZW50LmVudC5wdXNoKHtcbiAgICB0cDogJ0VYJyxcbiAgICBkYXRhOiB7XG4gICAgICBtaW1lOiBKU09OX01JTUVfVFlQRSxcbiAgICAgIHZhbDogZGF0YVxuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG4vKipcbiAqIEFwcGVuZCBsaW5lIGJyZWFrIHRvIGEgRHJhZnR5IGRvY3VtZW50LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fSBjb250ZW50IC0gRHJhZnR5IGRvY3VtZW50IHRvIGFwcGVuZCBsaW5lYnJlYWsgdG8uXG4gKiBAcmV0dXJucyB7RHJhZnR5fSB0aGUgc2FtZSBkb2N1bWVudCBhcyA8Y29kZT5jb250ZW50PC9jb2RlPi5cbiAqL1xuRHJhZnR5LmFwcGVuZExpbmVCcmVhayA9IGZ1bmN0aW9uKGNvbnRlbnQpIHtcbiAgY29udGVudCA9IGNvbnRlbnQgfHwge1xuICAgIHR4dDogJydcbiAgfTtcbiAgY29udGVudC5mbXQgPSBjb250ZW50LmZtdCB8fCBbXTtcbiAgY29udGVudC5mbXQucHVzaCh7XG4gICAgYXQ6IGNvbnRlbnQudHh0Lmxlbmd0aCxcbiAgICBsZW46IDEsXG4gICAgdHA6ICdCUidcbiAgfSk7XG4gIGNvbnRlbnQudHh0ICs9ICcgJztcblxuICByZXR1cm4gY29udGVudDtcbn1cbi8qKlxuICogR2l2ZW4gRHJhZnR5IGRvY3VtZW50LCBjb252ZXJ0IGl0IHRvIEhUTUwuXG4gKiBObyBhdHRlbXB0IGlzIG1hZGUgdG8gc3RyaXAgcHJlLWV4aXN0aW5nIGh0bWwgbWFya3VwLlxuICogVGhpcyBpcyBwb3RlbnRpYWxseSB1bnNhZmUgYmVjYXVzZSA8Y29kZT5jb250ZW50LnR4dDwvY29kZT4gbWF5IGNvbnRhaW4gbWFsaWNpb3VzIEhUTUxcbiAqIG1hcmt1cC5cbiAqIEBtZW1iZXJvZiBUaW5vZGUuRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGRvYyAtIGRvY3VtZW50IHRvIGNvbnZlcnQuXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gSFRNTC1yZXByZXNlbnRhdGlvbiBvZiBjb250ZW50LlxuICovXG5EcmFmdHkuVU5TQUZFX3RvSFRNTCA9IGZ1bmN0aW9uKGRvYykge1xuICBsZXQgdHJlZSA9IGRyYWZ0eVRvVHJlZShkb2MpO1xuICBjb25zdCBodG1sRm9ybWF0dGVyID0gZnVuY3Rpb24odHlwZSwgZGF0YSwgdmFsdWVzKSB7XG4gICAgY29uc3QgdGFnID0gREVDT1JBVE9SU1t0eXBlXTtcbiAgICBsZXQgcmVzdWx0ID0gdmFsdWVzID8gdmFsdWVzLmpvaW4oJycpIDogJyc7XG4gICAgaWYgKHRhZykge1xuICAgICAgcmVzdWx0ID0gdGFnLm9wZW4oZGF0YSkgKyByZXN1bHQgKyB0YWcuY2xvc2UoZGF0YSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG4gIHJldHVybiB0cmVlQm90dG9tVXAodHJlZSwgaHRtbEZvcm1hdHRlciwgMCk7XG59XG5cbi8qKlxuICogQ2FsbGJhY2sgZm9yIGFwcGx5aW5nIGN1c3RvbSBmb3JtYXR0aW5nIHRvIGEgRHJhZnR5IGRvY3VtZW50LlxuICogQ2FsbGVkIG9uY2UgZm9yIGVhY2ggc3R5bGUgc3Bhbi5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAY2FsbGJhY2sgRm9ybWF0dGVyXG4gKiBAcGFyYW0ge3N0cmluZ30gc3R5bGUgLSBzdHlsZSBjb2RlIHN1Y2ggYXMgXCJTVFwiIG9yIFwiSU1cIi5cbiAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIC0gZW50aXR5J3MgZGF0YS5cbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWx1ZXMgLSBwb3NzaWJseSBzdHlsZWQgc3Vic3BhbnMgY29udGFpbmVkIGluIHRoaXMgc3R5bGUgc3Bhbi5cbiAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCAtIGluZGV4IG9mIHRoZSBlbGVtZW50IGd1YXJhbnRlZWQgdG8gYmUgdW5pcXVlLlxuICovXG5cbi8qKlxuICogQ29udmVydCBEcmFmdHkgZG9jdW1lbnQgdG8gYSByZXByZXNlbnRhdGlvbiBzdWl0YWJsZSBmb3IgZGlzcGxheS5cbiAqIFRoZSA8Y29kZT5jb250ZXh0PC9jb2RlPiBtYXkgZXhwb3NlIGEgZnVuY3Rpb24gPGNvZGU+Z2V0Rm9ybWF0dGVyKHN0eWxlKTwvY29kZT4uIElmIGl0J3MgYXZhaWxhYmxlXG4gKiBpdCB3aWxsIGNhbGwgaXQgdG8gb2J0YWluIGEgPGNvZGU+Zm9ybWF0dGVyPC9jb2RlPiBmb3IgYSBzdWJ0cmVlIG9mIHN0eWxlcyB1bmRlciB0aGUgPGNvZGU+c3R5bGU8L2NvZGU+LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fE9iamVjdH0gY29udGVudCAtIERyYWZ0eSBkb2N1bWVudCB0byB0cmFuc2Zvcm0uXG4gKiBAcGFyYW0ge0Zvcm1hdHRlcn0gZm9ybWF0dGVyIC0gY2FsbGJhY2sgd2hpY2ggZm9ybWF0cyBpbmRpdmlkdWFsIGVsZW1lbnRzLlxuICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHQgLSBjb250ZXh0IHByb3ZpZGVkIHRvIGZvcm1hdHRlciBhcyA8Y29kZT50aGlzPC9jb2RlPi5cbiAqXG4gKiBAcmV0dXJuIHtPYmplY3R9IHRyYW5zZm9ybWVkIG9iamVjdFxuICovXG5EcmFmdHkuZm9ybWF0ID0gZnVuY3Rpb24ob3JpZ2luYWwsIGZvcm1hdHRlciwgY29udGV4dCkge1xuICByZXR1cm4gdHJlZUJvdHRvbVVwKGRyYWZ0eVRvVHJlZShvcmlnaW5hbCksIGZvcm1hdHRlciwgMCwgW10sIGNvbnRleHQpO1xufVxuXG4vKipcbiAqIFNob3J0ZW4gRHJhZnR5IGRvY3VtZW50IG1ha2luZyB0aGUgZHJhZnR5IHRleHQgbm8gbG9uZ2VyIHRoYW4gdGhlIGxpbWl0LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fHN0cmluZ30gb3JpZ2luYWwgLSBEcmFmdHkgb2JqZWN0IHRvIHNob3J0ZW4uXG4gKiBAcGFyYW0ge251bWJlcn0gbGltaXQgLSBsZW5ndGggaW4gY2hhcmFjcmV0cyB0byBzaG9ydGVuIHRvLlxuICogQHBhcmFtIHtib29sZWFufSBsaWdodCAtIHJlbW92ZSBoZWF2eSBkYXRhIGZyb20gZW50aXRpZXMuXG4gKiBAcmV0dXJucyBuZXcgc2hvcnRlbmVkIERyYWZ0eSBvYmplY3QgbGVhdmluZyB0aGUgb3JpZ2luYWwgaW50YWN0LlxuICovXG5EcmFmdHkuc2hvcnRlbiA9IGZ1bmN0aW9uKG9yaWdpbmFsLCBsaW1pdCwgbGlnaHQpIHtcbiAgbGV0IHRyZWUgPSBkcmFmdHlUb1RyZWUob3JpZ2luYWwpO1xuICB0cmVlID0gc2hvcnRlblRyZWUodHJlZSwgbGltaXQsICfigKYnKTtcbiAgaWYgKHRyZWUgJiYgbGlnaHQpIHtcbiAgICB0cmVlID0gbGlnaHRFbnRpdHkodHJlZSk7XG4gIH1cbiAgcmV0dXJuIHRyZWVUb0RyYWZ0eSh7fSwgdHJlZSwgW10pO1xufVxuXG4vKipcbiAqIFRyYW5zZm9ybSBEcmFmdHkgZG9jIGZvciBmb3J3YXJkaW5nOiBzdHJpcCBsZWFkaW5nIEBtZW50aW9uIGFuZCBhbnkgbGVhZGluZyBsaW5lIGJyZWFrcyBvciB3aGl0ZXNwYWNlLlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fHN0cmluZ30gb3JpZ2luYWwgLSBEcmFmdHkgb2JqZWN0IHRvIHNob3J0ZW4uXG4gKiBAcmV0dXJucyBjb252ZXJ0ZWQgRHJhZnR5IG9iamVjdCBsZWF2aW5nIHRoZSBvcmlnaW5hbCBpbnRhY3QuXG4gKi9cbkRyYWZ0eS5mb3J3YXJkZWRDb250ZW50ID0gZnVuY3Rpb24ob3JpZ2luYWwpIHtcbiAgbGV0IHRyZWUgPSBkcmFmdHlUb1RyZWUob3JpZ2luYWwpO1xuICBjb25zdCBybU1lbnRpb24gPSBmdW5jdGlvbihub2RlKSB7XG4gICAgaWYgKG5vZGUudHlwZSA9PSAnTU4nKSB7XG4gICAgICBpZiAoIW5vZGUucGFyZW50IHx8ICFub2RlLnBhcmVudC50eXBlKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuICAvLyBTdHJpcCBsZWFkaW5nIG1lbnRpb24uXG4gIHRyZWUgPSB0cmVlVG9wRG93bih0cmVlLCBybU1lbnRpb24pO1xuICAvLyBSZW1vdmUgbGVhZGluZyB3aGl0ZXNwYWNlLlxuICB0cmVlID0gbFRyaW0odHJlZSk7XG4gIC8vIENvbnZlcnQgYmFjayB0byBEcmFmdHkuXG4gIHJldHVybiB0cmVlVG9EcmFmdHkoe30sIHRyZWUsIFtdKTtcbn1cblxuLyoqXG4gKiBQcmVwYXJlIERyYWZ0eSBkb2MgZm9yIHdyYXBwaW5nIGludG8gUVEgYXMgYSByZXBseTpcbiAqICAtIFJlcGxhY2UgZm9yd2FyZGluZyBtZW50aW9uIHdpdGggc3ltYm9sICfinqYnIGFuZCByZW1vdmUgZGF0YSAoVUlEKS5cbiAqICAtIFJlbW92ZSBxdW90ZWQgdGV4dCBjb21wbGV0ZWx5LlxuICogIC0gUmVwbGFjZSBsaW5lIGJyZWFrcyB3aXRoIHNwYWNlcy5cbiAqICAtIFN0cmlwIGVudGl0aWVzIG9mIGhlYXZ5IGNvbnRlbnQuXG4gKiAgLSBNb3ZlIGF0dGFjaG1lbnRzIHRvIHRoZSBlbmQgb2YgdGhlIGRvY3VtZW50LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fHN0cmluZ30gb3JpZ2luYWwgLSBEcmFmdHkgb2JqZWN0IHRvIHNob3J0ZW4uXG4gKiBAcGFyYW0ge251bWJlcn0gbGltaXQgLSBsZW5ndGggaW4gY2hhcmFjdGVycyB0byBzaG9ydGVuIHRvLlxuICogQHJldHVybnMgY29udmVydGVkIERyYWZ0eSBvYmplY3QgbGVhdmluZyB0aGUgb3JpZ2luYWwgaW50YWN0LlxuICovXG5EcmFmdHkucmVwbHlDb250ZW50ID0gZnVuY3Rpb24ob3JpZ2luYWwsIGxpbWl0KSB7XG4gIGNvbnN0IGNvbnZNTm5RUW5CUiA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICBpZiAobm9kZS50eXBlID09ICdRUScpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0gZWxzZSBpZiAobm9kZS50eXBlID09ICdNTicpIHtcbiAgICAgIGlmICgoIW5vZGUucGFyZW50IHx8ICFub2RlLnBhcmVudC50eXBlKSAmJiAobm9kZS50ZXh0IHx8ICcnKS5zdGFydHNXaXRoKCfinqYnKSkge1xuICAgICAgICBub2RlLnRleHQgPSAn4p6mJztcbiAgICAgICAgZGVsZXRlIG5vZGUuY2hpbGRyZW47XG4gICAgICAgIGRlbGV0ZSBub2RlLmRhdGE7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChub2RlLnR5cGUgPT0gJ0JSJykge1xuICAgICAgbm9kZS50ZXh0ID0gJyAnO1xuICAgICAgZGVsZXRlIG5vZGUudHlwZTtcbiAgICAgIGRlbGV0ZSBub2RlLmNoaWxkcmVuO1xuICAgIH1cbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuXG4gIGxldCB0cmVlID0gZHJhZnR5VG9UcmVlKG9yaWdpbmFsKTtcbiAgaWYgKCF0cmVlKSB7XG4gICAgcmV0dXJuIG9yaWdpbmFsO1xuICB9XG5cbiAgLy8gU3RyaXAgbGVhZGluZyBtZW50aW9uLlxuICB0cmVlID0gdHJlZVRvcERvd24odHJlZSwgY29udk1OblFRbkJSKTtcbiAgLy8gTW92ZSBhdHRhY2htZW50cyB0byB0aGUgZW5kIG9mIHRoZSBkb2MuXG4gIHRyZWUgPSBhdHRhY2htZW50c1RvRW5kKHRyZWUsIE1BWF9QUkVWSUVXX0FUVEFDSE1FTlRTKTtcbiAgLy8gU2hvcnRlbiB0aGUgZG9jLlxuICB0cmVlID0gc2hvcnRlblRyZWUodHJlZSwgbGltaXQsICfigKYnKTtcbiAgLy8gU3RyaXAgaGVhdnkgZWxlbWVudHMgZXhjZXB0IElNLmRhdGFbJ3ZhbCddIChoYXZlIHRvIGtlZXAgdGhlbSB0byBnZW5lcmF0ZSBwcmV2aWV3cyBsYXRlcikuXG4gIHRyZWUgPSBsaWdodEVudGl0eSh0cmVlLCBub2RlID0+IChub2RlLnR5cGUgPT0gJ0lNJyA/IFsndmFsJ10gOiBudWxsKSk7XG4gIC8vIENvbnZlcnQgYmFjayB0byBEcmFmdHkuXG4gIHJldHVybiB0cmVlVG9EcmFmdHkoe30sIHRyZWUsIFtdKTtcbn1cblxuXG4vKipcbiAqIEdlbmVyYXRlIGRyYWZ0eSBwcmV2aWV3OlxuICogIC0gU2hvcnRlbiB0aGUgZG9jdW1lbnQuXG4gKiAgLSBTdHJpcCBhbGwgaGVhdnkgZW50aXR5IGRhdGEgbGVhdmluZyBqdXN0IGlubGluZSBzdHlsZXMgYW5kIGVudGl0eSByZWZlcmVuY2VzLlxuICogIC0gUmVwbGFjZSBsaW5lIGJyZWFrcyB3aXRoIHNwYWNlcy5cbiAqICAtIFJlcGxhY2UgY29udGVudCBvZiBRUSB3aXRoIGEgc3BhY2UuXG4gKiAgLSBSZXBsYWNlIGZvcndhcmRpbmcgbWVudGlvbiB3aXRoIHN5bWJvbCAn4p6mJy5cbiAqIG1vdmUgYWxsIGF0dGFjaG1lbnRzIHRvIHRoZSBlbmQgb2YgdGhlIGRvY3VtZW50IGFuZCBtYWtlIHRoZW0gdmlzaWJsZS5cbiAqIFRoZSA8Y29kZT5jb250ZXh0PC9jb2RlPiBtYXkgZXhwb3NlIGEgZnVuY3Rpb24gPGNvZGU+Z2V0Rm9ybWF0dGVyKHN0eWxlKTwvY29kZT4uIElmIGl0J3MgYXZhaWxhYmxlXG4gKiBpdCB3aWxsIGNhbGwgaXQgdG8gb2J0YWluIGEgPGNvZGU+Zm9ybWF0dGVyPC9jb2RlPiBmb3IgYSBzdWJ0cmVlIG9mIHN0eWxlcyB1bmRlciB0aGUgPGNvZGU+c3R5bGU8L2NvZGU+LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fHN0cmluZ30gb3JpZ2luYWwgLSBEcmFmdHkgb2JqZWN0IHRvIHNob3J0ZW4uXG4gKiBAcGFyYW0ge251bWJlcn0gbGltaXQgLSBsZW5ndGggaW4gY2hhcmFjdGVycyB0byBzaG9ydGVuIHRvLlxuICogQHBhcmFtIHtib29sZWFufSBmb3J3YXJkaW5nIC0gdGhpcyBhIGZvcndhcmRpbmcgbWVzc2FnZSBwcmV2aWV3LlxuICogQHJldHVybnMgbmV3IHNob3J0ZW5lZCBEcmFmdHkgb2JqZWN0IGxlYXZpbmcgdGhlIG9yaWdpbmFsIGludGFjdC5cbiAqL1xuRHJhZnR5LnByZXZpZXcgPSBmdW5jdGlvbihvcmlnaW5hbCwgbGltaXQsIGZvcndhcmRpbmcpIHtcbiAgbGV0IHRyZWUgPSBkcmFmdHlUb1RyZWUob3JpZ2luYWwpO1xuXG4gIC8vIE1vdmUgYXR0YWNobWVudHMgdG8gdGhlIGVuZC5cbiAgdHJlZSA9IGF0dGFjaG1lbnRzVG9FbmQodHJlZSwgTUFYX1BSRVZJRVdfQVRUQUNITUVOVFMpO1xuXG4gIC8vIENvbnZlcnQgbGVhZGluZyBtZW50aW9uIHRvICfinqYnIGFuZCByZXBsYWNlIFFRIGFuZCBCUiB3aXRoIGEgc3BhY2UgJyAnLlxuICBjb25zdCBjb252TU5uUVFuQlIgPSBmdW5jdGlvbihub2RlKSB7XG4gICAgaWYgKG5vZGUudHlwZSA9PSAnTU4nKSB7XG4gICAgICBpZiAoKCFub2RlLnBhcmVudCB8fCAhbm9kZS5wYXJlbnQudHlwZSkgJiYgKG5vZGUudGV4dCB8fCAnJykuc3RhcnRzV2l0aCgn4p6mJykpIHtcbiAgICAgICAgbm9kZS50ZXh0ID0gJ+Kepic7XG4gICAgICAgIGRlbGV0ZSBub2RlLmNoaWxkcmVuO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAobm9kZS50eXBlID09ICdRUScpIHtcbiAgICAgIG5vZGUudGV4dCA9ICcgJztcbiAgICAgIGRlbGV0ZSBub2RlLmNoaWxkcmVuO1xuICAgIH0gZWxzZSBpZiAobm9kZS50eXBlID09ICdCUicpIHtcbiAgICAgIG5vZGUudGV4dCA9ICcgJztcbiAgICAgIGRlbGV0ZSBub2RlLmNoaWxkcmVuO1xuICAgICAgZGVsZXRlIG5vZGUudHlwZTtcbiAgICB9XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cbiAgdHJlZSA9IHRyZWVUb3BEb3duKHRyZWUsIGNvbnZNTm5RUW5CUik7XG5cbiAgdHJlZSA9IHNob3J0ZW5UcmVlKHRyZWUsIGxpbWl0LCAn4oCmJyk7XG4gIGlmIChmb3J3YXJkaW5nKSB7XG4gICAgLy8gS2VlcCBJTSBkYXRhIGZvciBwcmV2aWV3LlxuICAgIHRyZWUgPSBsaWdodEVudGl0eSh0cmVlLCBub2RlID0+IChub2RlLnR5cGUgPT0gJ0lNJyA/IFsndmFsJ10gOiBudWxsKSk7XG4gIH0gZWxzZSB7XG4gICAgdHJlZSA9IGxpZ2h0RW50aXR5KHRyZWUpO1xuICB9XG5cbiAgLy8gQ29udmVydCBiYWNrIHRvIERyYWZ0eS5cbiAgcmV0dXJuIHRyZWVUb0RyYWZ0eSh7fSwgdHJlZSwgW10pO1xufVxuXG4vKipcbiAqIEdpdmVuIERyYWZ0eSBkb2N1bWVudCwgY29udmVydCBpdCB0byBwbGFpbiB0ZXh0LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fSBjb250ZW50IC0gZG9jdW1lbnQgdG8gY29udmVydCB0byBwbGFpbiB0ZXh0LlxuICogQHJldHVybnMge3N0cmluZ30gcGxhaW4tdGV4dCByZXByZXNlbnRhdGlvbiBvZiB0aGUgZHJhZnR5IGRvY3VtZW50LlxuICovXG5EcmFmdHkudG9QbGFpblRleHQgPSBmdW5jdGlvbihjb250ZW50KSB7XG4gIHJldHVybiB0eXBlb2YgY29udGVudCA9PSAnc3RyaW5nJyA/IGNvbnRlbnQgOiBjb250ZW50LnR4dDtcbn1cblxuLyoqXG4gKiBDaGVjayBpZiB0aGUgZG9jdW1lbnQgaGFzIG5vIG1hcmt1cCBhbmQgbm8gZW50aXRpZXMuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGNvbnRlbnQgLSBjb250ZW50IHRvIGNoZWNrIGZvciBwcmVzZW5jZSBvZiBtYXJrdXAuXG4gKiBAcmV0dXJucyA8Y29kZT50cnVlPC9jb2RlPiBpcyBjb250ZW50IGlzIHBsYWluIHRleHQsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gKi9cbkRyYWZ0eS5pc1BsYWluVGV4dCA9IGZ1bmN0aW9uKGNvbnRlbnQpIHtcbiAgcmV0dXJuIHR5cGVvZiBjb250ZW50ID09ICdzdHJpbmcnIHx8ICEoY29udGVudC5mbXQgfHwgY29udGVudC5lbnQpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiB0aGUgb2JqZWN0IHJlcHJlc2V0cyBpcyBhIHZhbGlkIERyYWZ0eSBkb2N1bWVudC5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eX0gY29udGVudCAtIGNvbnRlbnQgdG8gY2hlY2sgZm9yIHZhbGlkaXR5LlxuICogQHJldHVybnMgPGNvZGU+dHJ1ZTwvY29kZT4gaXMgY29udGVudCBpcyB2YWxpZCwgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAqL1xuRHJhZnR5LmlzVmFsaWQgPSBmdW5jdGlvbihjb250ZW50KSB7XG4gIGlmICghY29udGVudCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IHtcbiAgICB0eHQsXG4gICAgZm10LFxuICAgIGVudFxuICB9ID0gY29udGVudDtcblxuICBpZiAoIXR4dCAmJiB0eHQgIT09ICcnICYmICFmbXQgJiYgIWVudCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IHR4dF90eXBlID0gdHlwZW9mIHR4dDtcbiAgaWYgKHR4dF90eXBlICE9ICdzdHJpbmcnICYmIHR4dF90eXBlICE9ICd1bmRlZmluZWQnICYmIHR4dCAhPT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgZm10ICE9ICd1bmRlZmluZWQnICYmICFBcnJheS5pc0FycmF5KGZtdCkgJiYgZm10ICE9PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBlbnQgIT0gJ3VuZGVmaW5lZCcgJiYgIUFycmF5LmlzQXJyYXkoZW50KSAmJiBlbnQgIT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8qKlxuICogQ2hlY2sgaWYgdGhlIGRyYWZ0eSBkb2N1bWVudCBoYXMgYXR0YWNobWVudHM6IHN0eWxlIEVYIGFuZCBvdXRzaWRlIG9mIG5vcm1hbCByZW5kZXJpbmcgZmxvdyxcbiAqIGkuZS4gPGNvZGU+YXQgPSAtMTwvY29kZT4uXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGNvbnRlbnQgLSBkb2N1bWVudCB0byBjaGVjayBmb3IgYXR0YWNobWVudHMuXG4gKiBAcmV0dXJucyA8Y29kZT50cnVlPC9jb2RlPiBpZiB0aGVyZSBhcmUgYXR0YWNobWVudHMuXG4gKi9cbkRyYWZ0eS5oYXNBdHRhY2htZW50cyA9IGZ1bmN0aW9uKGNvbnRlbnQpIHtcbiAgaWYgKCFBcnJheS5pc0FycmF5KGNvbnRlbnQuZm10KSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBmb3IgKGxldCBpIGluIGNvbnRlbnQuZm10KSB7XG4gICAgY29uc3QgZm10ID0gY29udGVudC5mbXRbaV07XG4gICAgaWYgKGZtdCAmJiBmbXQuYXQgPCAwKSB7XG4gICAgICBjb25zdCBlbnQgPSBjb250ZW50LmVudFtmbXQua2V5IHwgMF07XG4gICAgICByZXR1cm4gZW50ICYmIGVudC50cCA9PSAnRVgnICYmIGVudC5kYXRhO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogQ2FsbGJhY2sgZm9yIGFwcGx5aW5nIGN1c3RvbSBmb3JtYXR0aW5nL3RyYW5zZm9ybWF0aW9uIHRvIGEgRHJhZnR5IGRvY3VtZW50LlxuICogQ2FsbGVkIG9uY2UgZm9yIGVhY2ggZW50aXR5LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBjYWxsYmFjayBFbnRpdHlDYWxsYmFja1xuICogQHBhcmFtIHtPYmplY3R9IGRhdGEgZW50aXR5IGRhdGEuXG4gKiBAcGFyYW0ge3N0cmluZ30gZW50aXR5IHR5cGUuXG4gKiBAcGFyYW0ge251bWJlcn0gaW5kZXggZW50aXR5J3MgaW5kZXggaW4gYGNvbnRlbnQuZW50YC5cbiAqL1xuXG4vKipcbiAqIEVudW1lcmF0ZSBhdHRhY2htZW50czogc3R5bGUgRVggYW5kIG91dHNpZGUgb2Ygbm9ybWFsIHJlbmRlcmluZyBmbG93LCBpLmUuIDxjb2RlPmF0ID0gLTE8L2NvZGU+LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fSBjb250ZW50IC0gZG9jdW1lbnQgdG8gcHJvY2VzcyBmb3IgYXR0YWNobWVudHMuXG4gKiBAcGFyYW0ge0VudGl0eUNhbGxiYWNrfSBjYWxsYmFjayAtIGNhbGxiYWNrIHRvIGNhbGwgZm9yIGVhY2ggYXR0YWNobWVudC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZXh0IC0gdmFsdWUgb2YgXCJ0aGlzXCIgZm9yIGNhbGxiYWNrLlxuICovXG5EcmFmdHkuYXR0YWNobWVudHMgPSBmdW5jdGlvbihjb250ZW50LCBjYWxsYmFjaywgY29udGV4dCkge1xuICBpZiAoIUFycmF5LmlzQXJyYXkoY29udGVudC5mbXQpKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGxldCBpID0gMDtcbiAgY29udGVudC5mbXQuZm9yRWFjaChmbXQgPT4ge1xuICAgIGlmIChmbXQgJiYgZm10LmF0IDwgMCkge1xuICAgICAgY29uc3QgZW50ID0gY29udGVudC5lbnRbZm10LmtleSB8IDBdO1xuICAgICAgaWYgKGVudCAmJiBlbnQudHAgPT0gJ0VYJyAmJiBlbnQuZGF0YSkge1xuICAgICAgICBjYWxsYmFjay5jYWxsKGNvbnRleHQsIGVudC5kYXRhLCBpKyssICdFWCcpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59XG5cbi8qKlxuICogQ2hlY2sgaWYgdGhlIGRyYWZ0eSBkb2N1bWVudCBoYXMgZW50aXRpZXMuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGNvbnRlbnQgLSBkb2N1bWVudCB0byBjaGVjayBmb3IgZW50aXRpZXMuXG4gKiBAcmV0dXJucyA8Y29kZT50cnVlPC9jb2RlPiBpZiB0aGVyZSBhcmUgZW50aXRpZXMuXG4gKi9cbkRyYWZ0eS5oYXNFbnRpdGllcyA9IGZ1bmN0aW9uKGNvbnRlbnQpIHtcbiAgcmV0dXJuIGNvbnRlbnQuZW50ICYmIGNvbnRlbnQuZW50Lmxlbmd0aCA+IDA7XG59XG5cbi8qKlxuICogRW51bWVyYXRlIGVudGl0aWVzLlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fSBjb250ZW50IC0gZG9jdW1lbnQgd2l0aCBlbnRpdGllcyB0byBlbnVtZXJhdGUuXG4gKiBAcGFyYW0ge0VudGl0eUNhbGxiYWNrfSBjYWxsYmFjayAtIGNhbGxiYWNrIHRvIGNhbGwgZm9yIGVhY2ggZW50aXR5LlxuICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHQgLSB2YWx1ZSBvZiBcInRoaXNcIiBmb3IgY2FsbGJhY2suXG4gKi9cbkRyYWZ0eS5lbnRpdGllcyA9IGZ1bmN0aW9uKGNvbnRlbnQsIGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gIGlmIChjb250ZW50LmVudCAmJiBjb250ZW50LmVudC5sZW5ndGggPiAwKSB7XG4gICAgZm9yIChsZXQgaSBpbiBjb250ZW50LmVudCkge1xuICAgICAgaWYgKGNvbnRlbnQuZW50W2ldKSB7XG4gICAgICAgIGNhbGxiYWNrLmNhbGwoY29udGV4dCwgY29udGVudC5lbnRbaV0uZGF0YSwgaSwgY29udGVudC5lbnRbaV0udHApO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFJlbW92ZSB1bnJlY29nbml6ZWQgZmllbGRzIGZyb20gZW50aXR5IGRhdGFcbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eX0gY29udGVudCAtIGRvY3VtZW50IHdpdGggZW50aXRpZXMgdG8gZW51bWVyYXRlLlxuICogQHJldHVybnMgY29udGVudC5cbiAqL1xuRHJhZnR5LnNhbml0aXplRW50aXRpZXMgPSBmdW5jdGlvbihjb250ZW50KSB7XG4gIGlmIChjb250ZW50ICYmIGNvbnRlbnQuZW50ICYmIGNvbnRlbnQuZW50Lmxlbmd0aCA+IDApIHtcbiAgICBmb3IgKGxldCBpIGluIGNvbnRlbnQuZW50KSB7XG4gICAgICBjb25zdCBlbnQgPSBjb250ZW50LmVudFtpXTtcbiAgICAgIGlmIChlbnQgJiYgZW50LmRhdGEpIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IGNvcHlFbnREYXRhKGVudC5kYXRhKTtcbiAgICAgICAgaWYgKGRhdGEpIHtcbiAgICAgICAgICBjb250ZW50LmVudFtpXS5kYXRhID0gZGF0YTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkZWxldGUgY29udGVudC5lbnRbaV0uZGF0YTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gY29udGVudDtcbn1cblxuLyoqXG4gKiBHaXZlbiB0aGUgZW50aXR5LCBnZXQgVVJMIHdoaWNoIGNhbiBiZSB1c2VkIGZvciBkb3dubG9hZGluZ1xuICogZW50aXR5IGRhdGEuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGVudERhdGEgLSBlbnRpdHkuZGF0YSB0byBnZXQgdGhlIFVSbCBmcm9tLlxuICogQHJldHVybnMge3N0cmluZ30gVVJMIHRvIGRvd25sb2FkIGVudGl0eSBkYXRhIG9yIDxjb2RlPm51bGw8L2NvZGU+LlxuICovXG5EcmFmdHkuZ2V0RG93bmxvYWRVcmwgPSBmdW5jdGlvbihlbnREYXRhKSB7XG4gIGxldCB1cmwgPSBudWxsO1xuICBpZiAoZW50RGF0YS5taW1lICE9IEpTT05fTUlNRV9UWVBFICYmIGVudERhdGEudmFsKSB7XG4gICAgdXJsID0gYmFzZTY0dG9PYmplY3RVcmwoZW50RGF0YS52YWwsIGVudERhdGEubWltZSwgRHJhZnR5LmxvZ2dlcik7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGVudERhdGEucmVmID09ICdzdHJpbmcnKSB7XG4gICAgdXJsID0gZW50RGF0YS5yZWY7XG4gIH1cbiAgcmV0dXJuIHVybDtcbn1cblxuLyoqXG4gKiBDaGVjayBpZiB0aGUgZW50aXR5IGRhdGEgaXMgbm90IHJlYWR5IGZvciBzZW5kaW5nLCBzdWNoIGFzIGJlaW5nIHVwbG9hZGVkIHRvIHRoZSBzZXJ2ZXIuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGVudGl0eS5kYXRhIHRvIGdldCB0aGUgVVJsIGZyb20uXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiB1cGxvYWQgaXMgaW4gcHJvZ3Jlc3MsIGZhbHNlIG90aGVyd2lzZS5cbiAqL1xuRHJhZnR5LmlzUHJvY2Vzc2luZyA9IGZ1bmN0aW9uKGVudERhdGEpIHtcbiAgcmV0dXJuICEhZW50RGF0YS5fcHJvY2Vzc2luZztcbn1cblxuLyoqXG4gKiBHaXZlbiB0aGUgZW50aXR5LCBnZXQgVVJMIHdoaWNoIGNhbiBiZSB1c2VkIGZvciBwcmV2aWV3aW5nXG4gKiB0aGUgZW50aXR5LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBlbnRpdHkuZGF0YSB0byBnZXQgdGhlIFVSbCBmcm9tLlxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9IHVybCBmb3IgcHJldmlld2luZyBvciBudWxsIGlmIG5vIHN1Y2ggdXJsIGlzIGF2YWlsYWJsZS5cbiAqL1xuRHJhZnR5LmdldFByZXZpZXdVcmwgPSBmdW5jdGlvbihlbnREYXRhKSB7XG4gIHJldHVybiBlbnREYXRhLnZhbCA/IGJhc2U2NHRvT2JqZWN0VXJsKGVudERhdGEudmFsLCBlbnREYXRhLm1pbWUsIERyYWZ0eS5sb2dnZXIpIDogbnVsbDtcbn1cblxuLyoqXG4gKiBHZXQgYXBwcm94aW1hdGUgc2l6ZSBvZiB0aGUgZW50aXR5LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBlbnREYXRhIC0gZW50aXR5LmRhdGEgdG8gZ2V0IHRoZSBzaXplIGZvci5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IHNpemUgb2YgZW50aXR5IGRhdGEgaW4gYnl0ZXMuXG4gKi9cbkRyYWZ0eS5nZXRFbnRpdHlTaXplID0gZnVuY3Rpb24oZW50RGF0YSkge1xuICAvLyBFaXRoZXIgc2l6ZSBoaW50IG9yIGxlbmd0aCBvZiB2YWx1ZS4gVGhlIHZhbHVlIGlzIGJhc2U2NCBlbmNvZGVkLFxuICAvLyB0aGUgYWN0dWFsIG9iamVjdCBzaXplIGlzIHNtYWxsZXIgdGhhbiB0aGUgZW5jb2RlZCBsZW5ndGguXG4gIHJldHVybiBlbnREYXRhLnNpemUgPyBlbnREYXRhLnNpemUgOiBlbnREYXRhLnZhbCA/IChlbnREYXRhLnZhbC5sZW5ndGggKiAwLjc1KSB8IDAgOiAwO1xufVxuXG4vKipcbiAqIEdldCBlbnRpdHkgbWltZSB0eXBlLlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBlbnREYXRhIC0gZW50aXR5LmRhdGEgdG8gZ2V0IHRoZSB0eXBlIGZvci5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IG1pbWUgdHlwZSBvZiBlbnRpdHkuXG4gKi9cbkRyYWZ0eS5nZXRFbnRpdHlNaW1lVHlwZSA9IGZ1bmN0aW9uKGVudERhdGEpIHtcbiAgcmV0dXJuIGVudERhdGEubWltZSB8fCAndGV4dC9wbGFpbic7XG59XG5cbi8qKlxuICogR2V0IEhUTUwgdGFnIGZvciBhIGdpdmVuIHR3by1sZXR0ZXIgc3R5bGUgbmFtZS5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gc3R5bGUgLSB0d28tbGV0dGVyIHN0eWxlLCBsaWtlIFNUIG9yIExOLlxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9IEhUTUwgdGFnIG5hbWUgaWYgc3R5bGUgaXMgZm91bmQsICdfVU5LTicgaWYgbm90IGZvdW5kLCB7Y29kZTogdW5kZWZpbmVkfSBpZiBzdHlsZSBpcyBmYWxzaXNoLlxuICovXG5EcmFmdHkudGFnTmFtZSA9IGZ1bmN0aW9uKHN0eWxlKSB7XG4gIHJldHVybiBzdHlsZSA/IChIVE1MX1RBR1Nbc3R5bGVdID8gSFRNTF9UQUdTW3N0eWxlXS5uYW1lIDogJ19VTktOJykgOiB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogRm9yIGEgZ2l2ZW4gZGF0YSBidW5kbGUgZ2VuZXJhdGUgYW4gb2JqZWN0IHdpdGggSFRNTCBhdHRyaWJ1dGVzLFxuICogZm9yIGluc3RhbmNlLCBnaXZlbiB7dXJsOiBcImh0dHA6Ly93d3cuZXhhbXBsZS5jb20vXCJ9IHJldHVyblxuICoge2hyZWY6IFwiaHR0cDovL3d3dy5leGFtcGxlLmNvbS9cIn1cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gc3R5bGUgLSB0d28tbGV0dGVyIHN0eWxlIHRvIGdlbmVyYXRlIGF0dHJpYnV0ZXMgZm9yLlxuICogQHBhcmFtIHtPYmplY3R9IGRhdGEgLSBkYXRhIGJ1bmRsZSB0byBjb252ZXJ0IHRvIGF0dHJpYnV0ZXNcbiAqXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBvYmplY3Qgd2l0aCBIVE1MIGF0dHJpYnV0ZXMuXG4gKi9cbkRyYWZ0eS5hdHRyVmFsdWUgPSBmdW5jdGlvbihzdHlsZSwgZGF0YSkge1xuICBpZiAoZGF0YSAmJiBERUNPUkFUT1JTW3N0eWxlXSkge1xuICAgIHJldHVybiBERUNPUkFUT1JTW3N0eWxlXS5wcm9wcyhkYXRhKTtcbiAgfVxuXG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogRHJhZnR5IE1JTUUgdHlwZS5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBjb250ZW50LVR5cGUgXCJ0ZXh0L3gtZHJhZnR5XCIuXG4gKi9cbkRyYWZ0eS5nZXRDb250ZW50VHlwZSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gRFJBRlRZX01JTUVfVFlQRTtcbn1cblxuLy8gPT09PT09PT09PT09PT09PT1cbi8vIFV0aWxpdHkgbWV0aG9kcy5cbi8vID09PT09PT09PT09PT09PT09XG5cbi8vIFRha2UgYSBzdHJpbmcgYW5kIGRlZmluZWQgZWFybGllciBzdHlsZSBzcGFucywgcmUtY29tcG9zZSB0aGVtIGludG8gYSB0cmVlIHdoZXJlIGVhY2ggbGVhZiBpc1xuLy8gYSBzYW1lLXN0eWxlIChpbmNsdWRpbmcgdW5zdHlsZWQpIHN0cmluZy4gSS5lLiAnaGVsbG8gKmJvbGQgX2l0YWxpY18qIGFuZCB+bW9yZX4gd29ybGQnIC0+XG4vLyAoJ2hlbGxvICcsIChiOiAnYm9sZCAnLCAoaTogJ2l0YWxpYycpKSwgJyBhbmQgJywgKHM6ICdtb3JlJyksICcgd29ybGQnKTtcbi8vXG4vLyBUaGlzIGlzIG5lZWRlZCBpbiBvcmRlciB0byBjbGVhciBtYXJrdXAsIGkuZS4gJ2hlbGxvICp3b3JsZConIC0+ICdoZWxsbyB3b3JsZCcgYW5kIGNvbnZlcnRcbi8vIHJhbmdlcyBmcm9tIG1hcmt1cC1lZCBvZmZzZXRzIHRvIHBsYWluIHRleHQgb2Zmc2V0cy5cbmZ1bmN0aW9uIGNodW5raWZ5KGxpbmUsIHN0YXJ0LCBlbmQsIHNwYW5zKSB7XG4gIGNvbnN0IGNodW5rcyA9IFtdO1xuXG4gIGlmIChzcGFucy5sZW5ndGggPT0gMCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGZvciAobGV0IGkgaW4gc3BhbnMpIHtcbiAgICAvLyBHZXQgdGhlIG5leHQgY2h1bmsgZnJvbSB0aGUgcXVldWVcbiAgICBjb25zdCBzcGFuID0gc3BhbnNbaV07XG5cbiAgICAvLyBHcmFiIHRoZSBpbml0aWFsIHVuc3R5bGVkIGNodW5rXG4gICAgaWYgKHNwYW4uYXQgPiBzdGFydCkge1xuICAgICAgY2h1bmtzLnB1c2goe1xuICAgICAgICB0eHQ6IGxpbmUuc2xpY2Uoc3RhcnQsIHNwYW4uYXQpXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBHcmFiIHRoZSBzdHlsZWQgY2h1bmsuIEl0IG1heSBpbmNsdWRlIHN1YmNodW5rcy5cbiAgICBjb25zdCBjaHVuayA9IHtcbiAgICAgIHRwOiBzcGFuLnRwXG4gICAgfTtcbiAgICBjb25zdCBjaGxkID0gY2h1bmtpZnkobGluZSwgc3Bhbi5hdCArIDEsIHNwYW4uZW5kLCBzcGFuLmNoaWxkcmVuKTtcbiAgICBpZiAoY2hsZC5sZW5ndGggPiAwKSB7XG4gICAgICBjaHVuay5jaGlsZHJlbiA9IGNobGQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNodW5rLnR4dCA9IHNwYW4udHh0O1xuICAgIH1cbiAgICBjaHVua3MucHVzaChjaHVuayk7XG4gICAgc3RhcnQgPSBzcGFuLmVuZCArIDE7IC8vICcrMScgaXMgdG8gc2tpcCB0aGUgZm9ybWF0dGluZyBjaGFyYWN0ZXJcbiAgfVxuXG4gIC8vIEdyYWIgdGhlIHJlbWFpbmluZyB1bnN0eWxlZCBjaHVuaywgYWZ0ZXIgdGhlIGxhc3Qgc3BhblxuICBpZiAoc3RhcnQgPCBlbmQpIHtcbiAgICBjaHVua3MucHVzaCh7XG4gICAgICB0eHQ6IGxpbmUuc2xpY2Uoc3RhcnQsIGVuZClcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBjaHVua3M7XG59XG5cbi8vIERldGVjdCBzdGFydHMgYW5kIGVuZHMgb2YgZm9ybWF0dGluZyBzcGFucy4gVW5mb3JtYXR0ZWQgc3BhbnMgYXJlXG4vLyBpZ25vcmVkIGF0IHRoaXMgc3RhZ2UuXG5mdW5jdGlvbiBzcGFubmlmeShvcmlnaW5hbCwgcmVfc3RhcnQsIHJlX2VuZCwgdHlwZSkge1xuICBjb25zdCByZXN1bHQgPSBbXTtcbiAgbGV0IGluZGV4ID0gMDtcbiAgbGV0IGxpbmUgPSBvcmlnaW5hbC5zbGljZSgwKTsgLy8gbWFrZSBhIGNvcHk7XG5cbiAgd2hpbGUgKGxpbmUubGVuZ3RoID4gMCkge1xuICAgIC8vIG1hdGNoWzBdOyAvLyBtYXRjaCwgbGlrZSAnKmFiYyonXG4gICAgLy8gbWF0Y2hbMV07IC8vIG1hdGNoIGNhcHR1cmVkIGluIHBhcmVudGhlc2lzLCBsaWtlICdhYmMnXG4gICAgLy8gbWF0Y2hbJ2luZGV4J107IC8vIG9mZnNldCB3aGVyZSB0aGUgbWF0Y2ggc3RhcnRlZC5cblxuICAgIC8vIEZpbmQgdGhlIG9wZW5pbmcgdG9rZW4uXG4gICAgY29uc3Qgc3RhcnQgPSByZV9zdGFydC5leGVjKGxpbmUpO1xuICAgIGlmIChzdGFydCA9PSBudWxsKSB7XG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICAvLyBCZWNhdXNlIGphdmFzY3JpcHQgUmVnRXhwIGRvZXMgbm90IHN1cHBvcnQgbG9va2JlaGluZCwgdGhlIGFjdHVhbCBvZmZzZXQgbWF5IG5vdCBwb2ludFxuICAgIC8vIGF0IHRoZSBtYXJrdXAgY2hhcmFjdGVyLiBGaW5kIGl0IGluIHRoZSBtYXRjaGVkIHN0cmluZy5cbiAgICBsZXQgc3RhcnRfb2Zmc2V0ID0gc3RhcnRbJ2luZGV4J10gKyBzdGFydFswXS5sYXN0SW5kZXhPZihzdGFydFsxXSk7XG4gICAgLy8gQ2xpcCB0aGUgcHJvY2Vzc2VkIHBhcnQgb2YgdGhlIHN0cmluZy5cbiAgICBsaW5lID0gbGluZS5zbGljZShzdGFydF9vZmZzZXQgKyAxKTtcbiAgICAvLyBzdGFydF9vZmZzZXQgaXMgYW4gb2Zmc2V0IHdpdGhpbiB0aGUgY2xpcHBlZCBzdHJpbmcuIENvbnZlcnQgdG8gb3JpZ2luYWwgaW5kZXguXG4gICAgc3RhcnRfb2Zmc2V0ICs9IGluZGV4O1xuICAgIC8vIEluZGV4IG5vdyBwb2ludCB0byB0aGUgYmVnaW5uaW5nIG9mICdsaW5lJyB3aXRoaW4gdGhlICdvcmlnaW5hbCcgc3RyaW5nLlxuICAgIGluZGV4ID0gc3RhcnRfb2Zmc2V0ICsgMTtcblxuICAgIC8vIEZpbmQgdGhlIG1hdGNoaW5nIGNsb3NpbmcgdG9rZW4uXG4gICAgY29uc3QgZW5kID0gcmVfZW5kID8gcmVfZW5kLmV4ZWMobGluZSkgOiBudWxsO1xuICAgIGlmIChlbmQgPT0gbnVsbCkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGxldCBlbmRfb2Zmc2V0ID0gZW5kWydpbmRleCddICsgZW5kWzBdLmluZGV4T2YoZW5kWzFdKTtcbiAgICAvLyBDbGlwIHRoZSBwcm9jZXNzZWQgcGFydCBvZiB0aGUgc3RyaW5nLlxuICAgIGxpbmUgPSBsaW5lLnNsaWNlKGVuZF9vZmZzZXQgKyAxKTtcbiAgICAvLyBVcGRhdGUgb2Zmc2V0c1xuICAgIGVuZF9vZmZzZXQgKz0gaW5kZXg7XG4gICAgLy8gSW5kZXggbm93IHBvaW50cyB0byB0aGUgYmVnaW5uaW5nIG9mICdsaW5lJyB3aXRoaW4gdGhlICdvcmlnaW5hbCcgc3RyaW5nLlxuICAgIGluZGV4ID0gZW5kX29mZnNldCArIDE7XG5cbiAgICByZXN1bHQucHVzaCh7XG4gICAgICB0eHQ6IG9yaWdpbmFsLnNsaWNlKHN0YXJ0X29mZnNldCArIDEsIGVuZF9vZmZzZXQpLFxuICAgICAgY2hpbGRyZW46IFtdLFxuICAgICAgYXQ6IHN0YXJ0X29mZnNldCxcbiAgICAgIGVuZDogZW5kX29mZnNldCxcbiAgICAgIHRwOiB0eXBlXG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vLyBDb252ZXJ0IGxpbmVhciBhcnJheSBvciBzcGFucyBpbnRvIGEgdHJlZSByZXByZXNlbnRhdGlvbi5cbi8vIEtlZXAgc3RhbmRhbG9uZSBhbmQgbmVzdGVkIHNwYW5zLCB0aHJvdyBhd2F5IHBhcnRpYWxseSBvdmVybGFwcGluZyBzcGFucy5cbmZ1bmN0aW9uIHRvU3BhblRyZWUoc3BhbnMpIHtcbiAgaWYgKHNwYW5zLmxlbmd0aCA9PSAwKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgY29uc3QgdHJlZSA9IFtzcGFuc1swXV07XG4gIGxldCBsYXN0ID0gc3BhbnNbMF07XG4gIGZvciAobGV0IGkgPSAxOyBpIDwgc3BhbnMubGVuZ3RoOyBpKyspIHtcbiAgICAvLyBLZWVwIHNwYW5zIHdoaWNoIHN0YXJ0IGFmdGVyIHRoZSBlbmQgb2YgdGhlIHByZXZpb3VzIHNwYW4gb3IgdGhvc2Ugd2hpY2hcbiAgICAvLyBhcmUgY29tcGxldGUgd2l0aGluIHRoZSBwcmV2aW91cyBzcGFuLlxuICAgIGlmIChzcGFuc1tpXS5hdCA+IGxhc3QuZW5kKSB7XG4gICAgICAvLyBTcGFuIGlzIGNvbXBsZXRlbHkgb3V0c2lkZSBvZiB0aGUgcHJldmlvdXMgc3Bhbi5cbiAgICAgIHRyZWUucHVzaChzcGFuc1tpXSk7XG4gICAgICBsYXN0ID0gc3BhbnNbaV07XG4gICAgfSBlbHNlIGlmIChzcGFuc1tpXS5lbmQgPD0gbGFzdC5lbmQpIHtcbiAgICAgIC8vIFNwYW4gaXMgZnVsbHkgaW5zaWRlIG9mIHRoZSBwcmV2aW91cyBzcGFuLiBQdXNoIHRvIHN1Ym5vZGUuXG4gICAgICBsYXN0LmNoaWxkcmVuLnB1c2goc3BhbnNbaV0pO1xuICAgIH1cbiAgICAvLyBTcGFuIGNvdWxkIHBhcnRpYWxseSBvdmVybGFwLCBpZ25vcmluZyBpdCBhcyBpbnZhbGlkLlxuICB9XG5cbiAgLy8gUmVjdXJzaXZlbHkgcmVhcnJhbmdlIHRoZSBzdWJub2Rlcy5cbiAgZm9yIChsZXQgaSBpbiB0cmVlKSB7XG4gICAgdHJlZVtpXS5jaGlsZHJlbiA9IHRvU3BhblRyZWUodHJlZVtpXS5jaGlsZHJlbik7XG4gIH1cblxuICByZXR1cm4gdHJlZTtcbn1cblxuLy8gQ29udmVydCBkcmFmdHkgZG9jdW1lbnQgdG8gYSB0cmVlLlxuZnVuY3Rpb24gZHJhZnR5VG9UcmVlKGRvYykge1xuICBpZiAoIWRvYykge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgZG9jID0gKHR5cGVvZiBkb2MgPT0gJ3N0cmluZycpID8ge1xuICAgIHR4dDogZG9jXG4gIH0gOiBkb2M7XG4gIGxldCB7XG4gICAgdHh0LFxuICAgIGZtdCxcbiAgICBlbnRcbiAgfSA9IGRvYztcblxuICB0eHQgPSB0eHQgfHwgJyc7XG4gIGlmICghQXJyYXkuaXNBcnJheShlbnQpKSB7XG4gICAgZW50ID0gW107XG4gIH1cblxuICBpZiAoIUFycmF5LmlzQXJyYXkoZm10KSB8fCBmbXQubGVuZ3RoID09IDApIHtcbiAgICBpZiAoZW50Lmxlbmd0aCA9PSAwKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0ZXh0OiB0eHRcbiAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gSGFuZGxlIHNwZWNpYWwgY2FzZSB3aGVuIGFsbCB2YWx1ZXMgaW4gZm10IGFyZSAwIGFuZCBmbXQgdGhlcmVmb3JlIGlzIHNraXBwZWQuXG4gICAgZm10ID0gW3tcbiAgICAgIGF0OiAwLFxuICAgICAgbGVuOiAwLFxuICAgICAga2V5OiAwXG4gICAgfV07XG4gIH1cblxuICAvLyBTYW5pdGl6ZSBzcGFucy5cbiAgY29uc3Qgc3BhbnMgPSBbXTtcbiAgY29uc3QgYXR0YWNobWVudHMgPSBbXTtcbiAgZm10LmZvckVhY2goKHNwYW4pID0+IHtcbiAgICBpZiAoIXNwYW4gfHwgdHlwZW9mIHNwYW4gIT0gJ29iamVjdCcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIVsndW5kZWZpbmVkJywgJ251bWJlciddLmluY2x1ZGVzKHR5cGVvZiBzcGFuLmF0KSkge1xuICAgICAgLy8gUHJlc2VudCwgYnV0IG5vbi1udW1lcmljICdhdCcuXG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghWyd1bmRlZmluZWQnLCAnbnVtYmVyJ10uaW5jbHVkZXModHlwZW9mIHNwYW4ubGVuKSkge1xuICAgICAgLy8gUHJlc2VudCwgYnV0IG5vbi1udW1lcmljICdsZW4nLlxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBsZXQgYXQgPSBzcGFuLmF0IHwgMDtcbiAgICBsZXQgbGVuID0gc3Bhbi5sZW4gfCAwO1xuICAgIGlmIChsZW4gPCAwKSB7XG4gICAgICAvLyBJbnZhbGlkIHNwYW4gbGVuZ3RoLlxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBrZXkgPSBzcGFuLmtleSB8fCAwO1xuICAgIGlmIChlbnQubGVuZ3RoID4gMCAmJiAodHlwZW9mIGtleSAhPSAnbnVtYmVyJyB8fCBrZXkgPCAwIHx8IGtleSA+PSBlbnQubGVuZ3RoKSkge1xuICAgICAgLy8gSW52YWxpZCBrZXkgdmFsdWUuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGF0IDw9IC0xKSB7XG4gICAgICAvLyBBdHRhY2htZW50LiBTdG9yZSBhdHRhY2htZW50cyBzZXBhcmF0ZWx5LlxuICAgICAgYXR0YWNobWVudHMucHVzaCh7XG4gICAgICAgIHN0YXJ0OiAtMSxcbiAgICAgICAgZW5kOiAwLFxuICAgICAgICBrZXk6IGtleVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfSBlbHNlIGlmIChhdCArIGxlbiA+IHR4dC5sZW5ndGgpIHtcbiAgICAgIC8vIFNwYW4gaXMgb3V0IG9mIGJvdW5kcy5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIXNwYW4udHApIHtcbiAgICAgIGlmIChlbnQubGVuZ3RoID4gMCAmJiAodHlwZW9mIGVudFtrZXldID09ICdvYmplY3QnKSkge1xuICAgICAgICBzcGFucy5wdXNoKHtcbiAgICAgICAgICBzdGFydDogYXQsXG4gICAgICAgICAgZW5kOiBhdCArIGxlbixcbiAgICAgICAgICBrZXk6IGtleVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgc3BhbnMucHVzaCh7XG4gICAgICAgIHR5cGU6IHNwYW4udHAsXG4gICAgICAgIHN0YXJ0OiBhdCxcbiAgICAgICAgZW5kOiBhdCArIGxlblxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcblxuICAvLyBTb3J0IHNwYW5zIGZpcnN0IGJ5IHN0YXJ0IGluZGV4IChhc2MpIHRoZW4gYnkgbGVuZ3RoIChkZXNjKSwgdGhlbiBieSB3ZWlnaHQuXG4gIHNwYW5zLnNvcnQoKGEsIGIpID0+IHtcbiAgICBsZXQgZGlmZiA9IGEuc3RhcnQgLSBiLnN0YXJ0O1xuICAgIGlmIChkaWZmICE9IDApIHtcbiAgICAgIHJldHVybiBkaWZmO1xuICAgIH1cbiAgICBkaWZmID0gYi5lbmQgLSBhLmVuZDtcbiAgICBpZiAoZGlmZiAhPSAwKSB7XG4gICAgICByZXR1cm4gZGlmZjtcbiAgICB9XG4gICAgcmV0dXJuIEZNVF9XRUlHSFQuaW5kZXhPZihiLnR5cGUpIC0gRk1UX1dFSUdIVC5pbmRleE9mKGEudHlwZSk7XG4gIH0pO1xuXG4gIC8vIE1vdmUgYXR0YWNobWVudHMgdG8gdGhlIGVuZCBvZiB0aGUgbGlzdC5cbiAgaWYgKGF0dGFjaG1lbnRzLmxlbmd0aCA+IDApIHtcbiAgICBzcGFucy5wdXNoKC4uLmF0dGFjaG1lbnRzKTtcbiAgfVxuXG4gIHNwYW5zLmZvckVhY2goKHNwYW4pID0+IHtcbiAgICBpZiAoZW50Lmxlbmd0aCA+IDAgJiYgIXNwYW4udHlwZSAmJiBlbnRbc3Bhbi5rZXldICYmIHR5cGVvZiBlbnRbc3Bhbi5rZXldID09ICdvYmplY3QnKSB7XG4gICAgICBzcGFuLnR5cGUgPSBlbnRbc3Bhbi5rZXldLnRwO1xuICAgICAgc3Bhbi5kYXRhID0gZW50W3NwYW4ua2V5XS5kYXRhO1xuICAgIH1cblxuICAgIC8vIElzIHR5cGUgc3RpbGwgdW5kZWZpbmVkPyBIaWRlIHRoZSBpbnZhbGlkIGVsZW1lbnQhXG4gICAgaWYgKCFzcGFuLnR5cGUpIHtcbiAgICAgIHNwYW4udHlwZSA9ICdIRCc7XG4gICAgfVxuICB9KTtcblxuICBsZXQgdHJlZSA9IHNwYW5zVG9UcmVlKHt9LCB0eHQsIDAsIHR4dC5sZW5ndGgsIHNwYW5zKTtcblxuICAvLyBGbGF0dGVuIHRyZWUgbm9kZXMuXG4gIGNvbnN0IGZsYXR0ZW4gPSBmdW5jdGlvbihub2RlKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkobm9kZS5jaGlsZHJlbikgJiYgbm9kZS5jaGlsZHJlbi5sZW5ndGggPT0gMSkge1xuICAgICAgLy8gVW53cmFwLlxuICAgICAgY29uc3QgY2hpbGQgPSBub2RlLmNoaWxkcmVuWzBdO1xuICAgICAgaWYgKCFub2RlLnR5cGUpIHtcbiAgICAgICAgY29uc3QgcGFyZW50ID0gbm9kZS5wYXJlbnQ7XG4gICAgICAgIG5vZGUgPSBjaGlsZDtcbiAgICAgICAgbm9kZS5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgICB9IGVsc2UgaWYgKCFjaGlsZC50eXBlICYmICFjaGlsZC5jaGlsZHJlbikge1xuICAgICAgICBub2RlLnRleHQgPSBjaGlsZC50ZXh0O1xuICAgICAgICBkZWxldGUgbm9kZS5jaGlsZHJlbjtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cbiAgdHJlZSA9IHRyZWVUb3BEb3duKHRyZWUsIGZsYXR0ZW4pO1xuXG4gIHJldHVybiB0cmVlO1xufVxuXG4vLyBBZGQgdHJlZSBub2RlIHRvIGEgcGFyZW50IHRyZWUuXG5mdW5jdGlvbiBhZGROb2RlKHBhcmVudCwgbikge1xuICBpZiAoIW4pIHtcbiAgICByZXR1cm4gcGFyZW50O1xuICB9XG5cbiAgaWYgKCFwYXJlbnQuY2hpbGRyZW4pIHtcbiAgICBwYXJlbnQuY2hpbGRyZW4gPSBbXTtcbiAgfVxuXG4gIC8vIElmIHRleHQgaXMgcHJlc2VudCwgbW92ZSBpdCB0byBhIHN1Ym5vZGUuXG4gIGlmIChwYXJlbnQudGV4dCkge1xuICAgIHBhcmVudC5jaGlsZHJlbi5wdXNoKHtcbiAgICAgIHRleHQ6IHBhcmVudC50ZXh0LFxuICAgICAgcGFyZW50OiBwYXJlbnRcbiAgICB9KTtcbiAgICBkZWxldGUgcGFyZW50LnRleHQ7XG4gIH1cblxuICBuLnBhcmVudCA9IHBhcmVudDtcbiAgcGFyZW50LmNoaWxkcmVuLnB1c2gobik7XG5cbiAgcmV0dXJuIHBhcmVudDtcbn1cblxuLy8gUmV0dXJucyBhIHRyZWUgb2Ygbm9kZXMuXG5mdW5jdGlvbiBzcGFuc1RvVHJlZShwYXJlbnQsIHRleHQsIHN0YXJ0LCBlbmQsIHNwYW5zKSB7XG4gIGlmICghc3BhbnMgfHwgc3BhbnMubGVuZ3RoID09IDApIHtcbiAgICBpZiAoc3RhcnQgPCBlbmQpIHtcbiAgICAgIGFkZE5vZGUocGFyZW50LCB7XG4gICAgICAgIHRleHQ6IHRleHQuc3Vic3RyaW5nKHN0YXJ0LCBlbmQpXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHBhcmVudDtcbiAgfVxuXG4gIC8vIFByb2Nlc3Mgc3Vic3BhbnMuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc3BhbnMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBzcGFuID0gc3BhbnNbaV07XG4gICAgaWYgKHNwYW4uc3RhcnQgPCAwICYmIHNwYW4udHlwZSA9PSAnRVgnKSB7XG4gICAgICBhZGROb2RlKHBhcmVudCwge1xuICAgICAgICB0eXBlOiBzcGFuLnR5cGUsXG4gICAgICAgIGRhdGE6IHNwYW4uZGF0YSxcbiAgICAgICAga2V5OiBzcGFuLmtleSxcbiAgICAgICAgYXR0OiB0cnVlXG4gICAgICB9KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIEFkZCB1bi1zdHlsZWQgcmFuZ2UgYmVmb3JlIHRoZSBzdHlsZWQgc3BhbiBzdGFydHMuXG4gICAgaWYgKHN0YXJ0IDwgc3Bhbi5zdGFydCkge1xuICAgICAgYWRkTm9kZShwYXJlbnQsIHtcbiAgICAgICAgdGV4dDogdGV4dC5zdWJzdHJpbmcoc3RhcnQsIHNwYW4uc3RhcnQpXG4gICAgICB9KTtcbiAgICAgIHN0YXJ0ID0gc3Bhbi5zdGFydDtcbiAgICB9XG5cbiAgICAvLyBHZXQgYWxsIHNwYW5zIHdoaWNoIGFyZSB3aXRoaW4gdGhlIGN1cnJlbnQgc3Bhbi5cbiAgICBjb25zdCBzdWJzcGFucyA9IFtdO1xuICAgIHdoaWxlIChpIDwgc3BhbnMubGVuZ3RoIC0gMSkge1xuICAgICAgY29uc3QgaW5uZXIgPSBzcGFuc1tpICsgMV07XG4gICAgICBpZiAoaW5uZXIuc3RhcnQgPCAwKSB7XG4gICAgICAgIC8vIEF0dGFjaG1lbnRzIGFyZSBpbiB0aGUgZW5kLiBTdG9wLlxuICAgICAgICBicmVhaztcbiAgICAgIH0gZWxzZSBpZiAoaW5uZXIuc3RhcnQgPCBzcGFuLmVuZCkge1xuICAgICAgICBpZiAoaW5uZXIuZW5kIDw9IHNwYW4uZW5kKSB7XG4gICAgICAgICAgY29uc3QgdGFnID0gSFRNTF9UQUdTW2lubmVyLnRwXSB8fCB7fTtcbiAgICAgICAgICBpZiAoaW5uZXIuc3RhcnQgPCBpbm5lci5lbmQgfHwgdGFnLmlzVm9pZCkge1xuICAgICAgICAgICAgLy8gVmFsaWQgc3Vic3BhbjogY29tcGxldGVseSB3aXRoaW4gdGhlIGN1cnJlbnQgc3BhbiBhbmRcbiAgICAgICAgICAgIC8vIGVpdGhlciBub24temVybyBsZW5ndGggb3IgemVybyBsZW5ndGggaXMgYWNjZXB0YWJsZS5cbiAgICAgICAgICAgIHN1YnNwYW5zLnB1c2goaW5uZXIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpKys7XG4gICAgICAgIC8vIE92ZXJsYXBwaW5nIHN1YnNwYW5zIGFyZSBpZ25vcmVkLlxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gUGFzdCB0aGUgZW5kIG9mIHRoZSBjdXJyZW50IHNwYW4uIFN0b3AuXG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGFkZE5vZGUocGFyZW50LCBzcGFuc1RvVHJlZSh7XG4gICAgICB0eXBlOiBzcGFuLnR5cGUsXG4gICAgICBkYXRhOiBzcGFuLmRhdGEsXG4gICAgICBrZXk6IHNwYW4ua2V5XG4gICAgfSwgdGV4dCwgc3RhcnQsIHNwYW4uZW5kLCBzdWJzcGFucykpO1xuICAgIHN0YXJ0ID0gc3Bhbi5lbmQ7XG4gIH1cblxuICAvLyBBZGQgdGhlIGxhc3QgdW5mb3JtYXR0ZWQgcmFuZ2UuXG4gIGlmIChzdGFydCA8IGVuZCkge1xuICAgIGFkZE5vZGUocGFyZW50LCB7XG4gICAgICB0ZXh0OiB0ZXh0LnN1YnN0cmluZyhzdGFydCwgZW5kKVxuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIHBhcmVudDtcbn1cblxuLy8gQXBwZW5kIGEgdHJlZSB0byBhIERyYWZ0eSBkb2MuXG5mdW5jdGlvbiB0cmVlVG9EcmFmdHkoZG9jLCB0cmVlLCBrZXltYXApIHtcbiAgaWYgKCF0cmVlKSB7XG4gICAgcmV0dXJuIGRvYztcbiAgfVxuXG4gIGRvYy50eHQgPSBkb2MudHh0IHx8ICcnO1xuXG4gIC8vIENoZWNrcG9pbnQgdG8gbWVhc3VyZSBsZW5ndGggb2YgdGhlIGN1cnJlbnQgdHJlZSBub2RlLlxuICBjb25zdCBzdGFydCA9IGRvYy50eHQubGVuZ3RoO1xuXG4gIGlmICh0cmVlLnRleHQpIHtcbiAgICBkb2MudHh0ICs9IHRyZWUudGV4dDtcbiAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHRyZWUuY2hpbGRyZW4pKSB7XG4gICAgdHJlZS5jaGlsZHJlbi5mb3JFYWNoKChjKSA9PiB7XG4gICAgICB0cmVlVG9EcmFmdHkoZG9jLCBjLCBrZXltYXApO1xuICAgIH0pO1xuICB9XG5cbiAgaWYgKHRyZWUudHlwZSkge1xuICAgIGNvbnN0IGxlbiA9IGRvYy50eHQubGVuZ3RoIC0gc3RhcnQ7XG4gICAgZG9jLmZtdCA9IGRvYy5mbXQgfHwgW107XG4gICAgaWYgKE9iamVjdC5rZXlzKHRyZWUuZGF0YSB8fCB7fSkubGVuZ3RoID4gMCkge1xuICAgICAgZG9jLmVudCA9IGRvYy5lbnQgfHwgW107XG4gICAgICBjb25zdCBuZXdLZXkgPSAodHlwZW9mIGtleW1hcFt0cmVlLmtleV0gPT0gJ3VuZGVmaW5lZCcpID8gZG9jLmVudC5sZW5ndGggOiBrZXltYXBbdHJlZS5rZXldO1xuICAgICAga2V5bWFwW3RyZWUua2V5XSA9IG5ld0tleTtcbiAgICAgIGRvYy5lbnRbbmV3S2V5XSA9IHtcbiAgICAgICAgdHA6IHRyZWUudHlwZSxcbiAgICAgICAgZGF0YTogdHJlZS5kYXRhXG4gICAgICB9O1xuICAgICAgaWYgKHRyZWUuYXR0KSB7XG4gICAgICAgIC8vIEF0dGFjaG1lbnQuXG4gICAgICAgIGRvYy5mbXQucHVzaCh7XG4gICAgICAgICAgYXQ6IC0xLFxuICAgICAgICAgIGxlbjogMCxcbiAgICAgICAgICBrZXk6IG5ld0tleVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRvYy5mbXQucHVzaCh7XG4gICAgICAgICAgYXQ6IHN0YXJ0LFxuICAgICAgICAgIGxlbjogbGVuLFxuICAgICAgICAgIGtleTogbmV3S2V5XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBkb2MuZm10LnB1c2goe1xuICAgICAgICB0cDogdHJlZS50eXBlLFxuICAgICAgICBhdDogc3RhcnQsXG4gICAgICAgIGxlbjogbGVuXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRvYztcbn1cblxuLy8gVHJhdmVyc2UgdGhlIHRyZWUgdG9wIGRvd24gdHJhbnNmb3JtaW5nIHRoZSBub2RlczogYXBwbHkgdHJhbnNmb3JtZXIgdG8gZXZlcnkgdHJlZSBub2RlLlxuZnVuY3Rpb24gdHJlZVRvcERvd24oc3JjLCB0cmFuc2Zvcm1lciwgY29udGV4dCkge1xuICBpZiAoIXNyYykge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgbGV0IGRzdCA9IHRyYW5zZm9ybWVyLmNhbGwoY29udGV4dCwgc3JjKTtcbiAgaWYgKCFkc3QgfHwgIWRzdC5jaGlsZHJlbikge1xuICAgIHJldHVybiBkc3Q7XG4gIH1cblxuICBjb25zdCBjaGlsZHJlbiA9IFtdO1xuICBmb3IgKGxldCBpIGluIGRzdC5jaGlsZHJlbikge1xuICAgIGxldCBuID0gZHN0LmNoaWxkcmVuW2ldO1xuICAgIGlmIChuKSB7XG4gICAgICBuID0gdHJlZVRvcERvd24obiwgdHJhbnNmb3JtZXIsIGNvbnRleHQpO1xuICAgICAgaWYgKG4pIHtcbiAgICAgICAgY2hpbGRyZW4ucHVzaChuKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAoY2hpbGRyZW4ubGVuZ3RoID09IDApIHtcbiAgICBkc3QuY2hpbGRyZW4gPSBudWxsO1xuICB9IGVsc2Uge1xuICAgIGRzdC5jaGlsZHJlbiA9IGNoaWxkcmVuO1xuICB9XG5cbiAgcmV0dXJuIGRzdDtcbn1cblxuLy8gVHJhdmVyc2UgdGhlIHRyZWUgYm90dG9tLXVwOiBhcHBseSBmb3JtYXR0ZXIgdG8gZXZlcnkgbm9kZS5cbi8vIFRoZSBmb3JtYXR0ZXIgbXVzdCBtYWludGFpbiBpdHMgc3RhdGUgdGhyb3VnaCBjb250ZXh0LlxuZnVuY3Rpb24gdHJlZUJvdHRvbVVwKHNyYywgZm9ybWF0dGVyLCBpbmRleCwgc3RhY2ssIGNvbnRleHQpIHtcbiAgaWYgKCFzcmMpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGlmIChzdGFjayAmJiBzcmMudHlwZSkge1xuICAgIHN0YWNrLnB1c2goc3JjLnR5cGUpO1xuICB9XG5cbiAgbGV0IHZhbHVlcyA9IFtdO1xuICBmb3IgKGxldCBpIGluIHNyYy5jaGlsZHJlbikge1xuICAgIGNvbnN0IG4gPSB0cmVlQm90dG9tVXAoc3JjLmNoaWxkcmVuW2ldLCBmb3JtYXR0ZXIsIGksIHN0YWNrLCBjb250ZXh0KTtcbiAgICBpZiAobikge1xuICAgICAgdmFsdWVzLnB1c2gobik7XG4gICAgfVxuICB9XG4gIGlmICh2YWx1ZXMubGVuZ3RoID09IDApIHtcbiAgICBpZiAoc3JjLnRleHQpIHtcbiAgICAgIHZhbHVlcyA9IFtzcmMudGV4dF07XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbHVlcyA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgaWYgKHN0YWNrICYmIHNyYy50eXBlKSB7XG4gICAgc3RhY2sucG9wKCk7XG4gIH1cblxuICByZXR1cm4gZm9ybWF0dGVyLmNhbGwoY29udGV4dCwgc3JjLnR5cGUsIHNyYy5kYXRhLCB2YWx1ZXMsIGluZGV4LCBzdGFjayk7XG59XG5cbi8vIENsaXAgdHJlZSB0byB0aGUgcHJvdmlkZWQgbGltaXQuXG5mdW5jdGlvbiBzaG9ydGVuVHJlZSh0cmVlLCBsaW1pdCwgdGFpbCkge1xuICBpZiAoIXRyZWUpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGlmICh0YWlsKSB7XG4gICAgbGltaXQgLT0gdGFpbC5sZW5ndGg7XG4gIH1cblxuICBjb25zdCBzaG9ydGVuZXIgPSBmdW5jdGlvbihub2RlKSB7XG4gICAgaWYgKGxpbWl0IDw9IC0xKSB7XG4gICAgICAvLyBMaW1pdCAtMSBtZWFucyB0aGUgZG9jIHdhcyBhbHJlYWR5IGNsaXBwZWQuXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAobm9kZS5hdHQpIHtcbiAgICAgIC8vIEF0dGFjaG1lbnRzIGFyZSB1bmNoYW5nZWQuXG4gICAgICByZXR1cm4gbm9kZTtcbiAgICB9XG4gICAgaWYgKGxpbWl0ID09IDApIHtcbiAgICAgIG5vZGUudGV4dCA9IHRhaWw7XG4gICAgICBsaW1pdCA9IC0xO1xuICAgIH0gZWxzZSBpZiAobm9kZS50ZXh0KSB7XG4gICAgICBjb25zdCBsZW4gPSBub2RlLnRleHQubGVuZ3RoO1xuICAgICAgaWYgKGxlbiA+IGxpbWl0KSB7XG4gICAgICAgIG5vZGUudGV4dCA9IG5vZGUudGV4dC5zdWJzdHJpbmcoMCwgbGltaXQpICsgdGFpbDtcbiAgICAgICAgbGltaXQgPSAtMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxpbWl0IC09IGxlbjtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cblxuICByZXR1cm4gdHJlZVRvcERvd24odHJlZSwgc2hvcnRlbmVyKTtcbn1cblxuLy8gU3RyaXAgaGVhdnkgZW50aXRpZXMgZnJvbSBhIHRyZWUuXG5mdW5jdGlvbiBsaWdodEVudGl0eSh0cmVlLCBhbGxvdykge1xuICBjb25zdCBsaWdodENvcHkgPSAobm9kZSkgPT4ge1xuICAgIGNvbnN0IGRhdGEgPSBjb3B5RW50RGF0YShub2RlLmRhdGEsIHRydWUsIGFsbG93ID8gYWxsb3cobm9kZSkgOiBudWxsKTtcbiAgICBpZiAoZGF0YSkge1xuICAgICAgbm9kZS5kYXRhID0gZGF0YTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVsZXRlIG5vZGUuZGF0YTtcbiAgICB9XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cbiAgcmV0dXJuIHRyZWVUb3BEb3duKHRyZWUsIGxpZ2h0Q29weSk7XG59XG5cbi8vIFJlbW92ZSBzcGFjZXMgYW5kIGJyZWFrcyBvbiB0aGUgbGVmdC5cbmZ1bmN0aW9uIGxUcmltKHRyZWUpIHtcbiAgaWYgKHRyZWUudHlwZSA9PSAnQlInKSB7XG4gICAgdHJlZSA9IG51bGw7XG4gIH0gZWxzZSBpZiAodHJlZS50ZXh0KSB7XG4gICAgaWYgKCF0cmVlLnR5cGUpIHtcbiAgICAgIHRyZWUudGV4dCA9IHRyZWUudGV4dC50cmltU3RhcnQoKTtcbiAgICAgIGlmICghdHJlZS50ZXh0KSB7XG4gICAgICAgIHRyZWUgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIGlmICghdHJlZS50eXBlICYmIHRyZWUuY2hpbGRyZW4gJiYgdHJlZS5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgY29uc3QgYyA9IGxUcmltKHRyZWUuY2hpbGRyZW5bMF0pO1xuICAgIGlmIChjKSB7XG4gICAgICB0cmVlLmNoaWxkcmVuWzBdID0gYztcbiAgICB9IGVsc2Uge1xuICAgICAgdHJlZS5jaGlsZHJlbi5zaGlmdCgpO1xuICAgICAgaWYgKCF0cmVlLnR5cGUgJiYgdHJlZS5jaGlsZHJlbi5sZW5ndGggPT0gMCkge1xuICAgICAgICB0cmVlID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRyZWU7XG59XG5cbi8vIE1vdmUgYXR0YWNobWVudHMgdG8gdGhlIGVuZC4gQXR0YWNobWVudHMgbXVzdCBiZSBhdCB0aGUgdG9wIGxldmVsLCBubyBuZWVkIHRvIHRyYXZlcnNlIHRoZSB0cmVlLlxuZnVuY3Rpb24gYXR0YWNobWVudHNUb0VuZCh0cmVlLCBsaW1pdCkge1xuICBpZiAoIXRyZWUpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGlmICh0cmVlLmF0dCkge1xuICAgIHRyZWUudGV4dCA9ICcgJztcbiAgICBkZWxldGUgdHJlZS5hdHQ7XG4gICAgZGVsZXRlIHRyZWUuY2hpbGRyZW47XG4gIH0gZWxzZSBpZiAodHJlZS5jaGlsZHJlbikge1xuICAgIGNvbnN0IGF0dGFjaG1lbnRzID0gW107XG4gICAgY29uc3QgY2hpbGRyZW4gPSBbXTtcbiAgICBmb3IgKGxldCBpIGluIHRyZWUuY2hpbGRyZW4pIHtcbiAgICAgIGNvbnN0IGMgPSB0cmVlLmNoaWxkcmVuW2ldO1xuICAgICAgaWYgKGMuYXR0KSB7XG4gICAgICAgIGlmIChhdHRhY2htZW50cy5sZW5ndGggPT0gbGltaXQpIHtcbiAgICAgICAgICAvLyBUb28gbWFueSBhdHRhY2htZW50cyB0byBwcmV2aWV3O1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjLmRhdGFbJ21pbWUnXSA9PSBKU09OX01JTUVfVFlQRSkge1xuICAgICAgICAgIC8vIEpTT04gYXR0YWNobWVudHMgYXJlIG5vdCBzaG93biBpbiBwcmV2aWV3LlxuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZGVsZXRlIGMuYXR0O1xuICAgICAgICBkZWxldGUgYy5jaGlsZHJlbjtcbiAgICAgICAgYy50ZXh0ID0gJyAnO1xuICAgICAgICBhdHRhY2htZW50cy5wdXNoKGMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2hpbGRyZW4ucHVzaChjKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdHJlZS5jaGlsZHJlbiA9IGNoaWxkcmVuLmNvbmNhdChhdHRhY2htZW50cyk7XG4gIH1cbiAgcmV0dXJuIHRyZWU7XG59XG5cbi8vIEdldCBhIGxpc3Qgb2YgZW50aXRpZXMgZnJvbSBhIHRleHQuXG5mdW5jdGlvbiBleHRyYWN0RW50aXRpZXMobGluZSkge1xuICBsZXQgbWF0Y2g7XG4gIGxldCBleHRyYWN0ZWQgPSBbXTtcbiAgRU5USVRZX1RZUEVTLmZvckVhY2goKGVudGl0eSkgPT4ge1xuICAgIHdoaWxlICgobWF0Y2ggPSBlbnRpdHkucmUuZXhlYyhsaW5lKSkgIT09IG51bGwpIHtcbiAgICAgIGV4dHJhY3RlZC5wdXNoKHtcbiAgICAgICAgb2Zmc2V0OiBtYXRjaFsnaW5kZXgnXSxcbiAgICAgICAgbGVuOiBtYXRjaFswXS5sZW5ndGgsXG4gICAgICAgIHVuaXF1ZTogbWF0Y2hbMF0sXG4gICAgICAgIGRhdGE6IGVudGl0eS5wYWNrKG1hdGNoWzBdKSxcbiAgICAgICAgdHlwZTogZW50aXR5Lm5hbWVcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG5cbiAgaWYgKGV4dHJhY3RlZC5sZW5ndGggPT0gMCkge1xuICAgIHJldHVybiBleHRyYWN0ZWQ7XG4gIH1cblxuICAvLyBSZW1vdmUgZW50aXRpZXMgZGV0ZWN0ZWQgaW5zaWRlIG90aGVyIGVudGl0aWVzLCBsaWtlICNoYXNodGFnIGluIGEgVVJMLlxuICBleHRyYWN0ZWQuc29ydCgoYSwgYikgPT4ge1xuICAgIHJldHVybiBhLm9mZnNldCAtIGIub2Zmc2V0O1xuICB9KTtcblxuICBsZXQgaWR4ID0gLTE7XG4gIGV4dHJhY3RlZCA9IGV4dHJhY3RlZC5maWx0ZXIoKGVsKSA9PiB7XG4gICAgY29uc3QgcmVzdWx0ID0gKGVsLm9mZnNldCA+IGlkeCk7XG4gICAgaWR4ID0gZWwub2Zmc2V0ICsgZWwubGVuO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH0pO1xuXG4gIHJldHVybiBleHRyYWN0ZWQ7XG59XG5cbi8vIENvbnZlcnQgdGhlIGNodW5rcyBpbnRvIGZvcm1hdCBzdWl0YWJsZSBmb3Igc2VyaWFsaXphdGlvbi5cbmZ1bmN0aW9uIGRyYWZ0aWZ5KGNodW5rcywgc3RhcnRBdCkge1xuICBsZXQgcGxhaW4gPSAnJztcbiAgbGV0IHJhbmdlcyA9IFtdO1xuICBmb3IgKGxldCBpIGluIGNodW5rcykge1xuICAgIGNvbnN0IGNodW5rID0gY2h1bmtzW2ldO1xuICAgIGlmICghY2h1bmsudHh0KSB7XG4gICAgICBjb25zdCBkcmFmdHkgPSBkcmFmdGlmeShjaHVuay5jaGlsZHJlbiwgcGxhaW4ubGVuZ3RoICsgc3RhcnRBdCk7XG4gICAgICBjaHVuay50eHQgPSBkcmFmdHkudHh0O1xuICAgICAgcmFuZ2VzID0gcmFuZ2VzLmNvbmNhdChkcmFmdHkuZm10KTtcbiAgICB9XG5cbiAgICBpZiAoY2h1bmsudHApIHtcbiAgICAgIHJhbmdlcy5wdXNoKHtcbiAgICAgICAgYXQ6IHBsYWluLmxlbmd0aCArIHN0YXJ0QXQsXG4gICAgICAgIGxlbjogY2h1bmsudHh0Lmxlbmd0aCxcbiAgICAgICAgdHA6IGNodW5rLnRwXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBwbGFpbiArPSBjaHVuay50eHQ7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICB0eHQ6IHBsYWluLFxuICAgIGZtdDogcmFuZ2VzXG4gIH07XG59XG5cbi8vIENyZWF0ZSBhIGNvcHkgb2YgZW50aXR5IGRhdGEgd2l0aCAobGlnaHQ9ZmFsc2UpIG9yIHdpdGhvdXQgKGxpZ2h0PXRydWUpIHRoZSBsYXJnZSBwYXlsb2FkLlxuLy8gVGhlIGFycmF5ICdhbGxvdycgY29udGFpbnMgYSBsaXN0IG9mIGZpZWxkcyBleGVtcHQgZnJvbSBzdHJpcHBpbmcuXG5mdW5jdGlvbiBjb3B5RW50RGF0YShkYXRhLCBsaWdodCwgYWxsb3cpIHtcbiAgaWYgKGRhdGEgJiYgT2JqZWN0LmVudHJpZXMoZGF0YSkubGVuZ3RoID4gMCkge1xuICAgIGFsbG93ID0gYWxsb3cgfHwgW107XG4gICAgY29uc3QgZGMgPSB7fTtcbiAgICBBTExPV0VEX0VOVF9GSUVMRFMuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICBpZiAoZGF0YVtrZXldKSB7XG4gICAgICAgIGlmIChsaWdodCAmJiAhYWxsb3cuaW5jbHVkZXMoa2V5KSAmJlxuICAgICAgICAgICh0eXBlb2YgZGF0YVtrZXldID09ICdzdHJpbmcnIHx8IEFycmF5LmlzQXJyYXkoZGF0YVtrZXldKSkgJiZcbiAgICAgICAgICBkYXRhW2tleV0ubGVuZ3RoID4gTUFYX1BSRVZJRVdfREFUQV9TSVpFKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgZGF0YVtrZXldID09ICdvYmplY3QnKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGRjW2tleV0gPSBkYXRhW2tleV07XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAoT2JqZWN0LmVudHJpZXMoZGMpLmxlbmd0aCAhPSAwKSB7XG4gICAgICByZXR1cm4gZGM7XG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG5pZiAodHlwZW9mIG1vZHVsZSAhPSAndW5kZWZpbmVkJykge1xuICBtb2R1bGUuZXhwb3J0cyA9IERyYWZ0eTtcbn1cbiIsIi8qKlxuICogQGZpbGUgVXRpbGl0aWVzIGZvciB1cGxvYWRpbmcgYW5kIGRvd25sb2FkaW5nIGZpbGVzLlxuICpcbiAqIEBjb3B5cmlnaHQgMjAxNS0yMDIyIFRpbm9kZSBMTEMuXG4gKi9cbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHtcbiAganNvblBhcnNlSGVscGVyXG59IGZyb20gJy4vdXRpbHMuanMnO1xuXG5sZXQgWEhSUHJvdmlkZXI7XG5cbi8qKlxuICogQGNsYXNzIExhcmdlRmlsZUhlbHBlciAtIHV0aWxpdGllcyBmb3IgdXBsb2FkaW5nIGFuZCBkb3dubG9hZGluZyBmaWxlcyBvdXQgb2YgYmFuZC5cbiAqIERvbid0IGluc3RhbnRpYXRlIHRoaXMgY2xhc3MgZGlyZWN0bHkuIFVzZSB7VGlub2RlLmdldExhcmdlRmlsZUhlbHBlcn0gaW5zdGVhZC5cbiAqIEBtZW1iZXJvZiBUaW5vZGVcbiAqXG4gKiBAcGFyYW0ge1Rpbm9kZX0gdGlub2RlIC0gdGhlIG1haW4gVGlub2RlIG9iamVjdC5cbiAqIEBwYXJhbSB7c3RyaW5nfSB2ZXJzaW9uIC0gcHJvdG9jb2wgdmVyc2lvbiwgaS5lLiAnMCcuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExhcmdlRmlsZUhlbHBlciB7XG4gIGNvbnN0cnVjdG9yKHRpbm9kZSwgdmVyc2lvbikge1xuICAgIHRoaXMuX3Rpbm9kZSA9IHRpbm9kZTtcbiAgICB0aGlzLl92ZXJzaW9uID0gdmVyc2lvbjtcblxuICAgIHRoaXMuX2FwaUtleSA9IHRpbm9kZS5fYXBpS2V5O1xuICAgIHRoaXMuX2F1dGhUb2tlbiA9IHRpbm9kZS5nZXRBdXRoVG9rZW4oKTtcbiAgICB0aGlzLl9yZXFJZCA9IHRpbm9kZS5nZXROZXh0VW5pcXVlSWQoKTtcbiAgICB0aGlzLnhociA9IG5ldyBYSFJQcm92aWRlcigpO1xuXG4gICAgLy8gUHJvbWlzZVxuICAgIHRoaXMudG9SZXNvbHZlID0gbnVsbDtcbiAgICB0aGlzLnRvUmVqZWN0ID0gbnVsbDtcblxuICAgIC8vIENhbGxiYWNrc1xuICAgIHRoaXMub25Qcm9ncmVzcyA9IG51bGw7XG4gICAgdGhpcy5vblN1Y2Nlc3MgPSBudWxsO1xuICAgIHRoaXMub25GYWlsdXJlID0gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydCB1cGxvYWRpbmcgdGhlIGZpbGUgdG8gYSBub24tZGVmYXVsdCBlbmRwb2ludC5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZS5MYXJnZUZpbGVIZWxwZXIjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBiYXNlVXJsIGFsdGVybmF0aXZlIGJhc2UgVVJMIG9mIHVwbG9hZCBzZXJ2ZXIuXG4gICAqIEBwYXJhbSB7RmlsZXxCbG9ifSBkYXRhIHRvIHVwbG9hZC5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGF2YXRhckZvciB0b3BpYyBuYW1lIGlmIHRoZSB1cGxvYWQgcmVwcmVzZW50cyBhbiBhdmF0YXIuXG4gICAqIEBwYXJhbSB7Q2FsbGJhY2t9IG9uUHJvZ3Jlc3MgY2FsbGJhY2suIFRha2VzIG9uZSB7ZmxvYXR9IHBhcmFtZXRlciAwLi4xXG4gICAqIEBwYXJhbSB7Q2FsbGJhY2t9IG9uU3VjY2VzcyBjYWxsYmFjay4gQ2FsbGVkIHdoZW4gdGhlIGZpbGUgaXMgc3VjY2Vzc2Z1bGx5IHVwbG9hZGVkLlxuICAgKiBAcGFyYW0ge0NhbGxiYWNrfSBvbkZhaWx1cmUgY2FsbGJhY2suIENhbGxlZCBpbiBjYXNlIG9mIGEgZmFpbHVyZS5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIHVwbG9hZCBpcyBjb21wbGV0ZWQvZmFpbGVkLlxuICAgKi9cbiAgdXBsb2FkV2l0aEJhc2VVcmwoYmFzZVVybCwgZGF0YSwgYXZhdGFyRm9yLCBvblByb2dyZXNzLCBvblN1Y2Nlc3MsIG9uRmFpbHVyZSkge1xuICAgIGlmICghdGhpcy5fYXV0aFRva2VuKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNdXN0IGF1dGhlbnRpY2F0ZSBmaXJzdFwiKTtcbiAgICB9XG4gICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzO1xuXG4gICAgbGV0IHVybCA9IGAvdiR7dGhpcy5fdmVyc2lvbn0vZmlsZS91L2A7XG4gICAgaWYgKGJhc2VVcmwpIHtcbiAgICAgIGxldCBiYXNlID0gYmFzZVVybDtcbiAgICAgIGlmIChiYXNlLmVuZHNXaXRoKCcvJykpIHtcbiAgICAgICAgLy8gUmVtb3ZpbmcgdHJhaWxpbmcgc2xhc2guXG4gICAgICAgIGJhc2UgPSBiYXNlLnNsaWNlKDAsIC0xKTtcbiAgICAgIH1cbiAgICAgIGlmIChiYXNlLnN0YXJ0c1dpdGgoJ2h0dHA6Ly8nKSB8fCBiYXNlLnN0YXJ0c1dpdGgoJ2h0dHBzOi8vJykpIHtcbiAgICAgICAgdXJsID0gYmFzZSArIHVybDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBiYXNlIFVSTCAnJHtiYXNlVXJsfSdgKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy54aHIub3BlbignUE9TVCcsIHVybCwgdHJ1ZSk7XG4gICAgdGhpcy54aHIuc2V0UmVxdWVzdEhlYWRlcignWC1UaW5vZGUtQVBJS2V5JywgdGhpcy5fYXBpS2V5KTtcbiAgICB0aGlzLnhoci5zZXRSZXF1ZXN0SGVhZGVyKCdYLVRpbm9kZS1BdXRoJywgYFRva2VuICR7dGhpcy5fYXV0aFRva2VuLnRva2VufWApO1xuICAgIGNvbnN0IHJlc3VsdCA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMudG9SZXNvbHZlID0gcmVzb2x2ZTtcbiAgICAgIHRoaXMudG9SZWplY3QgPSByZWplY3Q7XG4gICAgfSk7XG5cbiAgICB0aGlzLm9uUHJvZ3Jlc3MgPSBvblByb2dyZXNzO1xuICAgIHRoaXMub25TdWNjZXNzID0gb25TdWNjZXNzO1xuICAgIHRoaXMub25GYWlsdXJlID0gb25GYWlsdXJlO1xuXG4gICAgdGhpcy54aHIudXBsb2FkLm9ucHJvZ3Jlc3MgPSAoZSkgPT4ge1xuICAgICAgaWYgKGUubGVuZ3RoQ29tcHV0YWJsZSAmJiBpbnN0YW5jZS5vblByb2dyZXNzKSB7XG4gICAgICAgIGluc3RhbmNlLm9uUHJvZ3Jlc3MoZS5sb2FkZWQgLyBlLnRvdGFsKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy54aHIub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgcGt0O1xuICAgICAgdHJ5IHtcbiAgICAgICAgcGt0ID0gSlNPTi5wYXJzZSh0aGlzLnJlc3BvbnNlLCBqc29uUGFyc2VIZWxwZXIpO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGluc3RhbmNlLl90aW5vZGUubG9nZ2VyKFwiRVJST1I6IEludmFsaWQgc2VydmVyIHJlc3BvbnNlIGluIExhcmdlRmlsZUhlbHBlclwiLCB0aGlzLnJlc3BvbnNlKTtcbiAgICAgICAgcGt0ID0ge1xuICAgICAgICAgIGN0cmw6IHtcbiAgICAgICAgICAgIGNvZGU6IHRoaXMuc3RhdHVzLFxuICAgICAgICAgICAgdGV4dDogdGhpcy5zdGF0dXNUZXh0XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5zdGF0dXMgPj0gMjAwICYmIHRoaXMuc3RhdHVzIDwgMzAwKSB7XG4gICAgICAgIGlmIChpbnN0YW5jZS50b1Jlc29sdmUpIHtcbiAgICAgICAgICBpbnN0YW5jZS50b1Jlc29sdmUocGt0LmN0cmwucGFyYW1zLnVybCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGluc3RhbmNlLm9uU3VjY2Vzcykge1xuICAgICAgICAgIGluc3RhbmNlLm9uU3VjY2Vzcyhwa3QuY3RybCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0dXMgPj0gNDAwKSB7XG4gICAgICAgIGlmIChpbnN0YW5jZS50b1JlamVjdCkge1xuICAgICAgICAgIGluc3RhbmNlLnRvUmVqZWN0KG5ldyBFcnJvcihgJHtwa3QuY3RybC50ZXh0fSAoJHtwa3QuY3RybC5jb2RlfSlgKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGluc3RhbmNlLm9uRmFpbHVyZSkge1xuICAgICAgICAgIGluc3RhbmNlLm9uRmFpbHVyZShwa3QuY3RybCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGluc3RhbmNlLl90aW5vZGUubG9nZ2VyKFwiRVJST1I6IFVuZXhwZWN0ZWQgc2VydmVyIHJlc3BvbnNlIHN0YXR1c1wiLCB0aGlzLnN0YXR1cywgdGhpcy5yZXNwb25zZSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRoaXMueGhyLm9uZXJyb3IgPSBmdW5jdGlvbihlKSB7XG4gICAgICBpZiAoaW5zdGFuY2UudG9SZWplY3QpIHtcbiAgICAgICAgaW5zdGFuY2UudG9SZWplY3QobmV3IEVycm9yKFwiZmFpbGVkXCIpKTtcbiAgICAgIH1cbiAgICAgIGlmIChpbnN0YW5jZS5vbkZhaWx1cmUpIHtcbiAgICAgICAgaW5zdGFuY2Uub25GYWlsdXJlKG51bGwpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLnhoci5vbmFib3J0ID0gZnVuY3Rpb24oZSkge1xuICAgICAgaWYgKGluc3RhbmNlLnRvUmVqZWN0KSB7XG4gICAgICAgIGluc3RhbmNlLnRvUmVqZWN0KG5ldyBFcnJvcihcInVwbG9hZCBjYW5jZWxsZWQgYnkgdXNlclwiKSk7XG4gICAgICB9XG4gICAgICBpZiAoaW5zdGFuY2Uub25GYWlsdXJlKSB7XG4gICAgICAgIGluc3RhbmNlLm9uRmFpbHVyZShudWxsKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGZvcm0gPSBuZXcgRm9ybURhdGEoKTtcbiAgICAgIGZvcm0uYXBwZW5kKCdmaWxlJywgZGF0YSk7XG4gICAgICBmb3JtLnNldCgnaWQnLCB0aGlzLl9yZXFJZCk7XG4gICAgICBpZiAoYXZhdGFyRm9yKSB7XG4gICAgICAgIGZvcm0uc2V0KCd0b3BpYycsIGF2YXRhckZvcik7XG4gICAgICB9XG4gICAgICB0aGlzLnhoci5zZW5kKGZvcm0pO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgaWYgKHRoaXMudG9SZWplY3QpIHtcbiAgICAgICAgdGhpcy50b1JlamVjdChlcnIpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMub25GYWlsdXJlKSB7XG4gICAgICAgIHRoaXMub25GYWlsdXJlKG51bGwpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgLyoqXG4gICAqIFN0YXJ0IHVwbG9hZGluZyB0aGUgZmlsZSB0byBkZWZhdWx0IGVuZHBvaW50LlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkxhcmdlRmlsZUhlbHBlciNcbiAgICpcbiAgICogQHBhcmFtIHtGaWxlfEJsb2J9IGRhdGEgdG8gdXBsb2FkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBhdmF0YXJGb3IgdG9waWMgbmFtZSBpZiB0aGUgdXBsb2FkIHJlcHJlc2VudHMgYW4gYXZhdGFyLlxuICAgKiBAcGFyYW0ge0NhbGxiYWNrfSBvblByb2dyZXNzIGNhbGxiYWNrLiBUYWtlcyBvbmUge2Zsb2F0fSBwYXJhbWV0ZXIgMC4uMVxuICAgKiBAcGFyYW0ge0NhbGxiYWNrfSBvblN1Y2Nlc3MgY2FsbGJhY2suIENhbGxlZCB3aGVuIHRoZSBmaWxlIGlzIHN1Y2Nlc3NmdWxseSB1cGxvYWRlZC5cbiAgICogQHBhcmFtIHtDYWxsYmFja30gb25GYWlsdXJlIGNhbGxiYWNrLiBDYWxsZWQgaW4gY2FzZSBvZiBhIGZhaWx1cmUuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSB1cGxvYWQgaXMgY29tcGxldGVkL2ZhaWxlZC5cbiAgICovXG4gIHVwbG9hZChkYXRhLCBhdmF0YXJGb3IsIG9uUHJvZ3Jlc3MsIG9uU3VjY2Vzcywgb25GYWlsdXJlKSB7XG4gICAgY29uc3QgYmFzZVVybCA9ICh0aGlzLl90aW5vZGUuX3NlY3VyZSA/ICdodHRwczovLycgOiAnaHR0cDovLycpICsgdGhpcy5fdGlub2RlLl9ob3N0O1xuICAgIHJldHVybiB0aGlzLnVwbG9hZFdpdGhCYXNlVXJsKGJhc2VVcmwsIGRhdGEsIGF2YXRhckZvciwgb25Qcm9ncmVzcywgb25TdWNjZXNzLCBvbkZhaWx1cmUpO1xuICB9XG4gIC8qKlxuICAgKiBEb3dubG9hZCB0aGUgZmlsZSBmcm9tIGEgZ2l2ZW4gVVJMIHVzaW5nIEdFVCByZXF1ZXN0LiBUaGlzIG1ldGhvZCB3b3JrcyB3aXRoIHRoZSBUaW5vZGUgc2VydmVyIG9ubHkuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTGFyZ2VGaWxlSGVscGVyI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcmVsYXRpdmVVcmwgLSBVUkwgdG8gZG93bmxvYWQgdGhlIGZpbGUgZnJvbS4gTXVzdCBiZSByZWxhdGl2ZSB1cmwsIGkuZS4gbXVzdCBub3QgY29udGFpbiB0aGUgaG9zdC5cbiAgICogQHBhcmFtIHtzdHJpbmc9fSBmaWxlbmFtZSAtIGZpbGUgbmFtZSB0byB1c2UgZm9yIHRoZSBkb3dubG9hZGVkIGZpbGUuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBkb3dubG9hZCBpcyBjb21wbGV0ZWQvZmFpbGVkLlxuICAgKi9cbiAgZG93bmxvYWQocmVsYXRpdmVVcmwsIGZpbGVuYW1lLCBtaW1ldHlwZSwgb25Qcm9ncmVzcywgb25FcnJvcikge1xuICAgIGlmICghVGlub2RlLmlzUmVsYXRpdmVVUkwocmVsYXRpdmVVcmwpKSB7XG4gICAgICAvLyBBcyBhIHNlY3VyaXR5IG1lYXN1cmUgcmVmdXNlIHRvIGRvd25sb2FkIGZyb20gYW4gYWJzb2x1dGUgVVJMLlxuICAgICAgaWYgKG9uRXJyb3IpIHtcbiAgICAgICAgb25FcnJvcihgVGhlIFVSTCAnJHtyZWxhdGl2ZVVybH0nIG11c3QgYmUgcmVsYXRpdmUsIG5vdCBhYnNvbHV0ZWApO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuX2F1dGhUb2tlbikge1xuICAgICAgaWYgKG9uRXJyb3IpIHtcbiAgICAgICAgb25FcnJvcihcIk11c3QgYXV0aGVudGljYXRlIGZpcnN0XCIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXM7XG4gICAgLy8gR2V0IGRhdGEgYXMgYmxvYiAoc3RvcmVkIGJ5IHRoZSBicm93c2VyIGFzIGEgdGVtcG9yYXJ5IGZpbGUpLlxuICAgIHRoaXMueGhyLm9wZW4oJ0dFVCcsIHJlbGF0aXZlVXJsLCB0cnVlKTtcbiAgICB0aGlzLnhoci5zZXRSZXF1ZXN0SGVhZGVyKCdYLVRpbm9kZS1BUElLZXknLCB0aGlzLl9hcGlLZXkpO1xuICAgIHRoaXMueGhyLnNldFJlcXVlc3RIZWFkZXIoJ1gtVGlub2RlLUF1dGgnLCAnVG9rZW4gJyArIHRoaXMuX2F1dGhUb2tlbi50b2tlbik7XG4gICAgdGhpcy54aHIucmVzcG9uc2VUeXBlID0gJ2Jsb2InO1xuXG4gICAgdGhpcy5vblByb2dyZXNzID0gb25Qcm9ncmVzcztcbiAgICB0aGlzLnhoci5vbnByb2dyZXNzID0gZnVuY3Rpb24oZSkge1xuICAgICAgaWYgKGluc3RhbmNlLm9uUHJvZ3Jlc3MpIHtcbiAgICAgICAgLy8gUGFzc2luZyBlLmxvYWRlZCBpbnN0ZWFkIG9mIGUubG9hZGVkL2UudG90YWwgYmVjYXVzZSBlLnRvdGFsXG4gICAgICAgIC8vIGlzIGFsd2F5cyAwIHdpdGggZ3ppcCBjb21wcmVzc2lvbiBlbmFibGVkIGJ5IHRoZSBzZXJ2ZXIuXG4gICAgICAgIGluc3RhbmNlLm9uUHJvZ3Jlc3MoZS5sb2FkZWQpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCByZXN1bHQgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLnRvUmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgICB0aGlzLnRvUmVqZWN0ID0gcmVqZWN0O1xuICAgIH0pO1xuXG4gICAgLy8gVGhlIGJsb2IgbmVlZHMgdG8gYmUgc2F2ZWQgYXMgZmlsZS4gVGhlcmUgaXMgbm8ga25vd24gd2F5IHRvXG4gICAgLy8gc2F2ZSB0aGUgYmxvYiBhcyBmaWxlIG90aGVyIHRoYW4gdG8gZmFrZSBhIGNsaWNrIG9uIGFuIDxhIGhyZWYuLi4gZG93bmxvYWQ9Li4uPi5cbiAgICB0aGlzLnhoci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLnN0YXR1cyA9PSAyMDApIHtcbiAgICAgICAgY29uc3QgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICAgICAgLy8gVVJMLmNyZWF0ZU9iamVjdFVSTCBpcyBub3QgYXZhaWxhYmxlIGluIG5vbi1icm93c2VyIGVudmlyb25tZW50LiBUaGlzIGNhbGwgd2lsbCBmYWlsLlxuICAgICAgICBsaW5rLmhyZWYgPSB3aW5kb3cuVVJMLmNyZWF0ZU9iamVjdFVSTChuZXcgQmxvYihbdGhpcy5yZXNwb25zZV0sIHtcbiAgICAgICAgICB0eXBlOiBtaW1ldHlwZVxuICAgICAgICB9KSk7XG4gICAgICAgIGxpbmsuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgbGluay5zZXRBdHRyaWJ1dGUoJ2Rvd25sb2FkJywgZmlsZW5hbWUpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGxpbmspO1xuICAgICAgICBsaW5rLmNsaWNrKCk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQobGluayk7XG4gICAgICAgIHdpbmRvdy5VUkwucmV2b2tlT2JqZWN0VVJMKGxpbmsuaHJlZik7XG4gICAgICAgIGlmIChpbnN0YW5jZS50b1Jlc29sdmUpIHtcbiAgICAgICAgICBpbnN0YW5jZS50b1Jlc29sdmUoKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0aGlzLnN0YXR1cyA+PSA0MDAgJiYgaW5zdGFuY2UudG9SZWplY3QpIHtcbiAgICAgICAgLy8gVGhlIHRoaXMucmVzcG9uc2VUZXh0IGlzIHVuZGVmaW5lZCwgbXVzdCB1c2UgdGhpcy5yZXNwb25zZSB3aGljaCBpcyBhIGJsb2IuXG4gICAgICAgIC8vIE5lZWQgdG8gY29udmVydCB0aGlzLnJlc3BvbnNlIHRvIEpTT04uIFRoZSBibG9iIGNhbiBvbmx5IGJlIGFjY2Vzc2VkIGJ5IHRoZVxuICAgICAgICAvLyBGaWxlUmVhZGVyLlxuICAgICAgICBjb25zdCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgICAgICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHBrdCA9IEpTT04ucGFyc2UodGhpcy5yZXN1bHQsIGpzb25QYXJzZUhlbHBlcik7XG4gICAgICAgICAgICBpbnN0YW5jZS50b1JlamVjdChuZXcgRXJyb3IoYCR7cGt0LmN0cmwudGV4dH0gKCR7cGt0LmN0cmwuY29kZX0pYCkpO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgaW5zdGFuY2UuX3Rpbm9kZS5sb2dnZXIoXCJFUlJPUjogSW52YWxpZCBzZXJ2ZXIgcmVzcG9uc2UgaW4gTGFyZ2VGaWxlSGVscGVyXCIsIHRoaXMucmVzdWx0KTtcbiAgICAgICAgICAgIGluc3RhbmNlLnRvUmVqZWN0KGVycik7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICByZWFkZXIucmVhZEFzVGV4dCh0aGlzLnJlc3BvbnNlKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy54aHIub25lcnJvciA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgIGlmIChpbnN0YW5jZS50b1JlamVjdCkge1xuICAgICAgICBpbnN0YW5jZS50b1JlamVjdChuZXcgRXJyb3IoXCJmYWlsZWRcIikpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLnhoci5vbmFib3J0ID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoaW5zdGFuY2UudG9SZWplY3QpIHtcbiAgICAgICAgaW5zdGFuY2UudG9SZWplY3QobnVsbCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRyeSB7XG4gICAgICB0aGlzLnhoci5zZW5kKCk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBpZiAodGhpcy50b1JlamVjdCkge1xuICAgICAgICB0aGlzLnRvUmVqZWN0KGVycik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICAvKipcbiAgICogVHJ5IHRvIGNhbmNlbCBhbiBvbmdvaW5nIHVwbG9hZCBvciBkb3dubG9hZC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5MYXJnZUZpbGVIZWxwZXIjXG4gICAqL1xuICBjYW5jZWwoKSB7XG4gICAgaWYgKHRoaXMueGhyICYmIHRoaXMueGhyLnJlYWR5U3RhdGUgPCA0KSB7XG4gICAgICB0aGlzLnhoci5hYm9ydCgpO1xuICAgIH1cbiAgfVxuICAvKipcbiAgICogR2V0IHVuaXF1ZSBpZCBvZiB0aGlzIHJlcXVlc3QuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTGFyZ2VGaWxlSGVscGVyI1xuICAgKlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSB1bmlxdWUgaWRcbiAgICovXG4gIGdldElkKCkge1xuICAgIHJldHVybiB0aGlzLl9yZXFJZDtcbiAgfVxuICAvKipcbiAgICogVG8gdXNlIExhcmdlRmlsZUhlbHBlciBpbiBhIG5vbiBicm93c2VyIGNvbnRleHQsIHN1cHBseSBYTUxIdHRwUmVxdWVzdCBwcm92aWRlci5cbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyb2YgTGFyZ2VGaWxlSGVscGVyXG4gICAqIEBwYXJhbSB4aHJQcm92aWRlciBYTUxIdHRwUmVxdWVzdCBwcm92aWRlciwgZS5nLiBmb3Igbm9kZSA8Y29kZT5yZXF1aXJlKCd4aHInKTwvY29kZT4uXG4gICAqL1xuICBzdGF0aWMgc2V0TmV0d29ya1Byb3ZpZGVyKHhoclByb3ZpZGVyKSB7XG4gICAgWEhSUHJvdmlkZXIgPSB4aHJQcm92aWRlcjtcbiAgfVxufVxuIiwiLyoqXG4gKiBAZmlsZSBIZWxwZXIgY2xhc3MgZm9yIGNvbnN0cnVjdGluZyB7QGxpbmsgVGlub2RlLkdldFF1ZXJ5fS5cbiAqXG4gKiBAY29weXJpZ2h0IDIwMTUtMjAyMiBUaW5vZGUgTExDLlxuICovXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogSGVscGVyIGNsYXNzIGZvciBjb25zdHJ1Y3Rpbmcge0BsaW5rIFRpbm9kZS5HZXRRdWVyeX0uXG4gKlxuICogQGNsYXNzIE1ldGFHZXRCdWlsZGVyXG4gKiBAbWVtYmVyb2YgVGlub2RlXG4gKlxuICogQHBhcmFtIHtUaW5vZGUuVG9waWN9IHBhcmVudCB0b3BpYyB3aGljaCBpbnN0YW50aWF0ZWQgdGhpcyBidWlsZGVyLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNZXRhR2V0QnVpbGRlciB7XG4gIGNvbnN0cnVjdG9yKHBhcmVudCkge1xuICAgIHRoaXMudG9waWMgPSBwYXJlbnQ7XG4gICAgdGhpcy53aGF0ID0ge307XG4gIH1cblxuICAvLyBHZXQgdGltZXN0YW1wIG9mIHRoZSBtb3N0IHJlY2VudCBkZXNjIHVwZGF0ZS5cbiAgI2dldF9kZXNjX2ltcygpIHtcbiAgICByZXR1cm4gdGhpcy50b3BpYy51cGRhdGVkO1xuICB9XG5cbiAgLy8gR2V0IHRpbWVzdGFtcCBvZiB0aGUgbW9zdCByZWNlbnQgc3VicyB1cGRhdGUuXG4gICNnZXRfc3Vic19pbXMoKSB7XG4gICAgaWYgKHRoaXMudG9waWMuaXNQMlBUeXBlKCkpIHtcbiAgICAgIHJldHVybiB0aGlzLiNnZXRfZGVzY19pbXMoKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMudG9waWMuX2xhc3RTdWJzVXBkYXRlO1xuICB9XG4gIC8qKlxuICAgKiBBZGQgcXVlcnkgcGFyYW1ldGVycyB0byBmZXRjaCBtZXNzYWdlcyB3aXRoaW4gZXhwbGljaXQgbGltaXRzLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLk1ldGFHZXRCdWlsZGVyI1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcj19IHNpbmNlIC0gbWVzc2FnZXMgbmV3ZXIgdGhhbiB0aGlzIChpbmNsdXNpdmUpO1xuICAgKiBAcGFyYW0ge251bWJlcj19IGJlZm9yZSAtIG9sZGVyIHRoYW4gdGhpcyAoZXhjbHVzaXZlKVxuICAgKiBAcGFyYW0ge251bWJlcj19IGxpbWl0IC0gbnVtYmVyIG9mIG1lc3NhZ2VzIHRvIGZldGNoXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuTWV0YUdldEJ1aWxkZXJ9IDxjb2RlPnRoaXM8L2NvZGU+IG9iamVjdC5cbiAgICovXG4gIHdpdGhEYXRhKHNpbmNlLCBiZWZvcmUsIGxpbWl0KSB7XG4gICAgdGhpcy53aGF0WydkYXRhJ10gPSB7XG4gICAgICBzaW5jZTogc2luY2UsXG4gICAgICBiZWZvcmU6IGJlZm9yZSxcbiAgICAgIGxpbWl0OiBsaW1pdFxuICAgIH07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLyoqXG4gICAqIEFkZCBxdWVyeSBwYXJhbWV0ZXJzIHRvIGZldGNoIG1lc3NhZ2VzIG5ld2VyIHRoYW4gdGhlIGxhdGVzdCBzYXZlZCBtZXNzYWdlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLk1ldGFHZXRCdWlsZGVyI1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcj19IGxpbWl0IC0gbnVtYmVyIG9mIG1lc3NhZ2VzIHRvIGZldGNoXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuTWV0YUdldEJ1aWxkZXJ9IDxjb2RlPnRoaXM8L2NvZGU+IG9iamVjdC5cbiAgICovXG4gIHdpdGhMYXRlckRhdGEobGltaXQpIHtcbiAgICByZXR1cm4gdGhpcy53aXRoRGF0YSh0aGlzLnRvcGljLl9tYXhTZXEgPiAwID8gdGhpcy50b3BpYy5fbWF4U2VxICsgMSA6IHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBsaW1pdCk7XG4gIH1cbiAgLyoqXG4gICAqIEFkZCBxdWVyeSBwYXJhbWV0ZXJzIHRvIGZldGNoIG1lc3NhZ2VzIG9sZGVyIHRoYW4gdGhlIGVhcmxpZXN0IHNhdmVkIG1lc3NhZ2UuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTWV0YUdldEJ1aWxkZXIjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gbGltaXQgLSBtYXhpbXVtIG51bWJlciBvZiBtZXNzYWdlcyB0byBmZXRjaC5cbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5NZXRhR2V0QnVpbGRlcn0gPGNvZGU+dGhpczwvY29kZT4gb2JqZWN0LlxuICAgKi9cbiAgd2l0aEVhcmxpZXJEYXRhKGxpbWl0KSB7XG4gICAgcmV0dXJuIHRoaXMud2l0aERhdGEodW5kZWZpbmVkLCB0aGlzLnRvcGljLl9taW5TZXEgPiAwID8gdGhpcy50b3BpYy5fbWluU2VxIDogdW5kZWZpbmVkLCBsaW1pdCk7XG4gIH1cbiAgLyoqXG4gICAqIEFkZCBxdWVyeSBwYXJhbWV0ZXJzIHRvIGZldGNoIHRvcGljIGRlc2NyaXB0aW9uIGlmIGl0J3MgbmV3ZXIgdGhhbiB0aGUgZ2l2ZW4gdGltZXN0YW1wLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLk1ldGFHZXRCdWlsZGVyI1xuICAgKlxuICAgKiBAcGFyYW0ge0RhdGU9fSBpbXMgLSBmZXRjaCBtZXNzYWdlcyBuZXdlciB0aGFuIHRoaXMgdGltZXN0YW1wLlxuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLk1ldGFHZXRCdWlsZGVyfSA8Y29kZT50aGlzPC9jb2RlPiBvYmplY3QuXG4gICAqL1xuICB3aXRoRGVzYyhpbXMpIHtcbiAgICB0aGlzLndoYXRbJ2Rlc2MnXSA9IHtcbiAgICAgIGltczogaW1zXG4gICAgfTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICAvKipcbiAgICogQWRkIHF1ZXJ5IHBhcmFtZXRlcnMgdG8gZmV0Y2ggdG9waWMgZGVzY3JpcHRpb24gaWYgaXQncyBuZXdlciB0aGFuIHRoZSBsYXN0IHVwZGF0ZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5NZXRhR2V0QnVpbGRlciNcbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5NZXRhR2V0QnVpbGRlcn0gPGNvZGU+dGhpczwvY29kZT4gb2JqZWN0LlxuICAgKi9cbiAgd2l0aExhdGVyRGVzYygpIHtcbiAgICByZXR1cm4gdGhpcy53aXRoRGVzYyh0aGlzLiNnZXRfZGVzY19pbXMoKSk7XG4gIH1cbiAgLyoqXG4gICAqIEFkZCBxdWVyeSBwYXJhbWV0ZXJzIHRvIGZldGNoIHN1YnNjcmlwdGlvbnMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTWV0YUdldEJ1aWxkZXIjXG4gICAqXG4gICAqIEBwYXJhbSB7RGF0ZT19IGltcyAtIGZldGNoIHN1YnNjcmlwdGlvbnMgbW9kaWZpZWQgbW9yZSByZWNlbnRseSB0aGFuIHRoaXMgdGltZXN0YW1wXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gbGltaXQgLSBtYXhpbXVtIG51bWJlciBvZiBzdWJzY3JpcHRpb25zIHRvIGZldGNoLlxuICAgKiBAcGFyYW0ge3N0cmluZz19IHVzZXJPclRvcGljIC0gdXNlciBJRCBvciB0b3BpYyBuYW1lIHRvIGZldGNoIGZvciBmZXRjaGluZyBvbmUgc3Vic2NyaXB0aW9uLlxuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLk1ldGFHZXRCdWlsZGVyfSA8Y29kZT50aGlzPC9jb2RlPiBvYmplY3QuXG4gICAqL1xuICB3aXRoU3ViKGltcywgbGltaXQsIHVzZXJPclRvcGljKSB7XG4gICAgY29uc3Qgb3B0cyA9IHtcbiAgICAgIGltczogaW1zLFxuICAgICAgbGltaXQ6IGxpbWl0XG4gICAgfTtcbiAgICBpZiAodGhpcy50b3BpYy5nZXRUeXBlKCkgPT0gJ21lJykge1xuICAgICAgb3B0cy50b3BpYyA9IHVzZXJPclRvcGljO1xuICAgIH0gZWxzZSB7XG4gICAgICBvcHRzLnVzZXIgPSB1c2VyT3JUb3BpYztcbiAgICB9XG4gICAgdGhpcy53aGF0WydzdWInXSA9IG9wdHM7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLyoqXG4gICAqIEFkZCBxdWVyeSBwYXJhbWV0ZXJzIHRvIGZldGNoIGEgc2luZ2xlIHN1YnNjcmlwdGlvbi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5NZXRhR2V0QnVpbGRlciNcbiAgICpcbiAgICogQHBhcmFtIHtEYXRlPX0gaW1zIC0gZmV0Y2ggc3Vic2NyaXB0aW9ucyBtb2RpZmllZCBtb3JlIHJlY2VudGx5IHRoYW4gdGhpcyB0aW1lc3RhbXBcbiAgICogQHBhcmFtIHtzdHJpbmc9fSB1c2VyT3JUb3BpYyAtIHVzZXIgSUQgb3IgdG9waWMgbmFtZSB0byBmZXRjaCBmb3IgZmV0Y2hpbmcgb25lIHN1YnNjcmlwdGlvbi5cbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5NZXRhR2V0QnVpbGRlcn0gPGNvZGU+dGhpczwvY29kZT4gb2JqZWN0LlxuICAgKi9cbiAgd2l0aE9uZVN1YihpbXMsIHVzZXJPclRvcGljKSB7XG4gICAgcmV0dXJuIHRoaXMud2l0aFN1YihpbXMsIHVuZGVmaW5lZCwgdXNlck9yVG9waWMpO1xuICB9XG4gIC8qKlxuICAgKiBBZGQgcXVlcnkgcGFyYW1ldGVycyB0byBmZXRjaCBhIHNpbmdsZSBzdWJzY3JpcHRpb24gaWYgaXQncyBiZWVuIHVwZGF0ZWQgc2luY2UgdGhlIGxhc3QgdXBkYXRlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLk1ldGFHZXRCdWlsZGVyI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZz19IHVzZXJPclRvcGljIC0gdXNlciBJRCBvciB0b3BpYyBuYW1lIHRvIGZldGNoIGZvciBmZXRjaGluZyBvbmUgc3Vic2NyaXB0aW9uLlxuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLk1ldGFHZXRCdWlsZGVyfSA8Y29kZT50aGlzPC9jb2RlPiBvYmplY3QuXG4gICAqL1xuICB3aXRoTGF0ZXJPbmVTdWIodXNlck9yVG9waWMpIHtcbiAgICByZXR1cm4gdGhpcy53aXRoT25lU3ViKHRoaXMudG9waWMuX2xhc3RTdWJzVXBkYXRlLCB1c2VyT3JUb3BpYyk7XG4gIH1cbiAgLyoqXG4gICAqIEFkZCBxdWVyeSBwYXJhbWV0ZXJzIHRvIGZldGNoIHN1YnNjcmlwdGlvbnMgdXBkYXRlZCBzaW5jZSB0aGUgbGFzdCB1cGRhdGUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTWV0YUdldEJ1aWxkZXIjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gbGltaXQgLSBtYXhpbXVtIG51bWJlciBvZiBzdWJzY3JpcHRpb25zIHRvIGZldGNoLlxuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLk1ldGFHZXRCdWlsZGVyfSA8Y29kZT50aGlzPC9jb2RlPiBvYmplY3QuXG4gICAqL1xuICB3aXRoTGF0ZXJTdWIobGltaXQpIHtcbiAgICByZXR1cm4gdGhpcy53aXRoU3ViKHRoaXMuI2dldF9zdWJzX2ltcygpLCBsaW1pdCk7XG4gIH1cbiAgLyoqXG4gICAqIEFkZCBxdWVyeSBwYXJhbWV0ZXJzIHRvIGZldGNoIHRvcGljIHRhZ3MuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTWV0YUdldEJ1aWxkZXIjXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuTWV0YUdldEJ1aWxkZXJ9IDxjb2RlPnRoaXM8L2NvZGU+IG9iamVjdC5cbiAgICovXG4gIHdpdGhUYWdzKCkge1xuICAgIHRoaXMud2hhdFsndGFncyddID0gdHJ1ZTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICAvKipcbiAgICogQWRkIHF1ZXJ5IHBhcmFtZXRlcnMgdG8gZmV0Y2ggdXNlcidzIGNyZWRlbnRpYWxzLiA8Y29kZT4nbWUnPC9jb2RlPiB0b3BpYyBvbmx5LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLk1ldGFHZXRCdWlsZGVyI1xuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLk1ldGFHZXRCdWlsZGVyfSA8Y29kZT50aGlzPC9jb2RlPiBvYmplY3QuXG4gICAqL1xuICB3aXRoQ3JlZCgpIHtcbiAgICBpZiAodGhpcy50b3BpYy5nZXRUeXBlKCkgPT0gJ21lJykge1xuICAgICAgdGhpcy53aGF0WydjcmVkJ10gPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnRvcGljLl90aW5vZGUubG9nZ2VyKFwiRVJST1I6IEludmFsaWQgdG9waWMgdHlwZSBmb3IgTWV0YUdldEJ1aWxkZXI6d2l0aENyZWRzXCIsIHRoaXMudG9waWMuZ2V0VHlwZSgpKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLyoqXG4gICAqIEFkZCBxdWVyeSBwYXJhbWV0ZXJzIHRvIGZldGNoIGRlbGV0ZWQgbWVzc2FnZXMgd2l0aGluIGV4cGxpY2l0IGxpbWl0cy4gQW55L2FsbCBwYXJhbWV0ZXJzIGNhbiBiZSBudWxsLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLk1ldGFHZXRCdWlsZGVyI1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcj19IHNpbmNlIC0gaWRzIG9mIG1lc3NhZ2VzIGRlbGV0ZWQgc2luY2UgdGhpcyAnZGVsJyBpZCAoaW5jbHVzaXZlKVxuICAgKiBAcGFyYW0ge251bWJlcj19IGxpbWl0IC0gbnVtYmVyIG9mIGRlbGV0ZWQgbWVzc2FnZSBpZHMgdG8gZmV0Y2hcbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5NZXRhR2V0QnVpbGRlcn0gPGNvZGU+dGhpczwvY29kZT4gb2JqZWN0LlxuICAgKi9cbiAgd2l0aERlbChzaW5jZSwgbGltaXQpIHtcbiAgICBpZiAoc2luY2UgfHwgbGltaXQpIHtcbiAgICAgIHRoaXMud2hhdFsnZGVsJ10gPSB7XG4gICAgICAgIHNpbmNlOiBzaW5jZSxcbiAgICAgICAgbGltaXQ6IGxpbWl0XG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICAvKipcbiAgICogQWRkIHF1ZXJ5IHBhcmFtZXRlcnMgdG8gZmV0Y2ggbWVzc2FnZXMgZGVsZXRlZCBhZnRlciB0aGUgc2F2ZWQgPGNvZGU+J2RlbCc8L2NvZGU+IGlkLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLk1ldGFHZXRCdWlsZGVyI1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcj19IGxpbWl0IC0gbnVtYmVyIG9mIGRlbGV0ZWQgbWVzc2FnZSBpZHMgdG8gZmV0Y2hcbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5NZXRhR2V0QnVpbGRlcn0gPGNvZGU+dGhpczwvY29kZT4gb2JqZWN0LlxuICAgKi9cbiAgd2l0aExhdGVyRGVsKGxpbWl0KSB7XG4gICAgLy8gU3BlY2lmeSAnc2luY2UnIG9ubHkgaWYgd2UgaGF2ZSBhbHJlYWR5IHJlY2VpdmVkIHNvbWUgbWVzc2FnZXMuIElmXG4gICAgLy8gd2UgaGF2ZSBubyBsb2NhbGx5IGNhY2hlZCBtZXNzYWdlcyB0aGVuIHdlIGRvbid0IGNhcmUgaWYgYW55IG1lc3NhZ2VzIHdlcmUgZGVsZXRlZC5cbiAgICByZXR1cm4gdGhpcy53aXRoRGVsKHRoaXMudG9waWMuX21heFNlcSA+IDAgPyB0aGlzLnRvcGljLl9tYXhEZWwgKyAxIDogdW5kZWZpbmVkLCBsaW1pdCk7XG4gIH1cblxuICAvKipcbiAgICogRXh0cmFjdCBzdWJxdWVyeTogZ2V0IGFuIG9iamVjdCB0aGF0IGNvbnRhaW5zIHNwZWNpZmllZCBzdWJxdWVyeS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5NZXRhR2V0QnVpbGRlciNcbiAgICogQHBhcmFtIHtzdHJpbmd9IHdoYXQgLSBzdWJxdWVyeSB0byByZXR1cm46IG9uZSBvZiAnZGF0YScsICdzdWInLCAnZGVzYycsICd0YWdzJywgJ2NyZWQnLCAnZGVsJy5cbiAgICogQHJldHVybnMge09iamVjdH0gcmVxdWVzdGVkIHN1YnF1ZXJ5IG9yIDxjb2RlPnVuZGVmaW5lZDwvY29kZT4uXG4gICAqL1xuICBleHRyYWN0KHdoYXQpIHtcbiAgICByZXR1cm4gdGhpcy53aGF0W3doYXRdO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdCBwYXJhbWV0ZXJzLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLk1ldGFHZXRCdWlsZGVyI1xuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLkdldFF1ZXJ5fSBHZXQgcXVlcnlcbiAgICovXG4gIGJ1aWxkKCkge1xuICAgIGNvbnN0IHdoYXQgPSBbXTtcbiAgICBsZXQgcGFyYW1zID0ge307XG4gICAgWydkYXRhJywgJ3N1YicsICdkZXNjJywgJ3RhZ3MnLCAnY3JlZCcsICdkZWwnXS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgIGlmICh0aGlzLndoYXQuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICB3aGF0LnB1c2goa2V5KTtcbiAgICAgICAgaWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRoaXMud2hhdFtrZXldKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgcGFyYW1zW2tleV0gPSB0aGlzLndoYXRba2V5XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIGlmICh3aGF0Lmxlbmd0aCA+IDApIHtcbiAgICAgIHBhcmFtcy53aGF0ID0gd2hhdC5qb2luKCcgJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhcmFtcyA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgcmV0dXJuIHBhcmFtcztcbiAgfVxufVxuIiwiLyoqXG4gKiBAZmlsZSBTREsgdG8gY29ubmVjdCB0byBUaW5vZGUgY2hhdCBzZXJ2ZXIuXG4gKiBTZWUgPGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS90aW5vZGUvd2ViYXBwXCI+aHR0cHM6Ly9naXRodWIuY29tL3Rpbm9kZS93ZWJhcHA8L2E+IGZvciByZWFsLWxpZmUgdXNhZ2UuXG4gKlxuICogQGNvcHlyaWdodCAyMDE1LTIwMjIgVGlub2RlIExMQy5cbiAqIEBzdW1tYXJ5IEphdmFzY3JpcHQgYmluZGluZ3MgZm9yIFRpbm9kZS5cbiAqIEBsaWNlbnNlIEFwYWNoZSAyLjBcbiAqIEB2ZXJzaW9uIDAuMjBcbiAqXG4gKiBAZXhhbXBsZVxuICogPGhlYWQ+XG4gKiA8c2NyaXB0IHNyYz1cIi4uLi90aW5vZGUuanNcIj48L3NjcmlwdD5cbiAqIDwvaGVhZD5cbiAqXG4gKiA8Ym9keT5cbiAqICAuLi5cbiAqIDxzY3JpcHQ+XG4gKiAgLy8gSW5zdGFudGlhdGUgdGlub2RlLlxuICogIGNvbnN0IHRpbm9kZSA9IG5ldyBUaW5vZGUoY29uZmlnLCAoKSA9PiB7XG4gKiAgICAvLyBDYWxsZWQgb24gaW5pdCBjb21wbGV0aW9uLlxuICogIH0pO1xuICogIHRpbm9kZS5lbmFibGVMb2dnaW5nKHRydWUpO1xuICogIHRpbm9kZS5vbkRpc2Nvbm5lY3QgPSAoZXJyKSA9PiB7XG4gKiAgICAvLyBIYW5kbGUgZGlzY29ubmVjdC5cbiAqICB9O1xuICogIC8vIENvbm5lY3QgdG8gdGhlIHNlcnZlci5cbiAqICB0aW5vZGUuY29ubmVjdCgnaHR0cHM6Ly9leGFtcGxlLmNvbS8nKS50aGVuKCgpID0+IHtcbiAqICAgIC8vIENvbm5lY3RlZC4gTG9naW4gbm93LlxuICogICAgcmV0dXJuIHRpbm9kZS5sb2dpbkJhc2ljKGxvZ2luLCBwYXNzd29yZCk7XG4gKiAgfSkudGhlbigoY3RybCkgPT4ge1xuICogICAgLy8gTG9nZ2VkIGluIGZpbmUsIGF0dGFjaCBjYWxsYmFja3MsIHN1YnNjcmliZSB0byAnbWUnLlxuICogICAgY29uc3QgbWUgPSB0aW5vZGUuZ2V0TWVUb3BpYygpO1xuICogICAgbWUub25NZXRhRGVzYyA9IGZ1bmN0aW9uKG1ldGEpIHsgLi4uIH07XG4gKiAgICAvLyBTdWJzY3JpYmUsIGZldGNoIHRvcGljIGRlc2NyaXB0aW9uIGFuZCB0aGUgbGlzdCBvZiBjb250YWN0cy5cbiAqICAgIG1lLnN1YnNjcmliZSh7Z2V0OiB7ZGVzYzoge30sIHN1Yjoge319fSk7XG4gKiAgfSkuY2F0Y2goKGVycikgPT4ge1xuICogICAgLy8gTG9naW4gb3Igc3Vic2NyaXB0aW9uIGZhaWxlZCwgZG8gc29tZXRoaW5nLlxuICogICAgLi4uXG4gKiAgfSk7XG4gKiAgLi4uXG4gKiA8L3NjcmlwdD5cbiAqIDwvYm9keT5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG4vLyBOT1RFIFRPIERFVkVMT1BFUlM6XG4vLyBMb2NhbGl6YWJsZSBzdHJpbmdzIHNob3VsZCBiZSBkb3VibGUgcXVvdGVkIFwi0YHRgtGA0L7QutCwINC90LAg0LTRgNGD0LPQvtC8INGP0LfRi9C60LVcIixcbi8vIG5vbi1sb2NhbGl6YWJsZSBzdHJpbmdzIHNob3VsZCBiZSBzaW5nbGUgcXVvdGVkICdub24tbG9jYWxpemVkJy5cblxuaW1wb3J0IEFjY2Vzc01vZGUgZnJvbSAnLi9hY2Nlc3MtbW9kZS5qcyc7XG5pbXBvcnQgKiBhcyBDb25zdCBmcm9tICcuL2NvbmZpZy5qcyc7XG5pbXBvcnQgQ29ubmVjdGlvbiBmcm9tICcuL2Nvbm5lY3Rpb24uanMnO1xuaW1wb3J0IERCQ2FjaGUgZnJvbSAnLi9kYi5qcyc7XG5pbXBvcnQgRHJhZnR5IGZyb20gJy4vZHJhZnR5LmpzJztcbmltcG9ydCBMYXJnZUZpbGVIZWxwZXIgZnJvbSAnLi9sYXJnZS1maWxlLmpzJztcbmltcG9ydCBNZXRhR2V0QnVpbGRlciBmcm9tICcuL21ldGEtYnVpbGRlci5qcyc7XG5pbXBvcnQge1xuICBUb3BpYyxcbiAgVG9waWNNZSxcbiAgVG9waWNGbmRcbn0gZnJvbSAnLi90b3BpYy5qcyc7XG5cbmltcG9ydCB7XG4gIGpzb25QYXJzZUhlbHBlcixcbiAgbWVyZ2VPYmosXG4gIHJmYzMzMzlEYXRlU3RyaW5nLFxuICBzaW1wbGlmeVxufSBmcm9tICcuL3V0aWxzLmpzJztcblxubGV0IFdlYlNvY2tldFByb3ZpZGVyO1xuaWYgKHR5cGVvZiBXZWJTb2NrZXQgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgV2ViU29ja2V0UHJvdmlkZXIgPSBXZWJTb2NrZXQ7XG59XG5cbmxldCBYSFJQcm92aWRlcjtcbmlmICh0eXBlb2YgWE1MSHR0cFJlcXVlc3QgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgWEhSUHJvdmlkZXIgPSBYTUxIdHRwUmVxdWVzdDtcbn1cblxubGV0IEluZGV4ZWREQlByb3ZpZGVyO1xuaWYgKHR5cGVvZiBpbmRleGVkREIgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgSW5kZXhlZERCUHJvdmlkZXIgPSBpbmRleGVkREI7XG59XG5cbi8vIFJlLWV4cG9ydCBEcmFmdHkuXG5leHBvcnQge1xuICBEcmFmdHlcbn1cblxuaW5pdEZvck5vbkJyb3dzZXJBcHAoKTtcblxuLy8gVXRpbGl0eSBmdW5jdGlvbnNcblxuLy8gUG9seWZpbGwgZm9yIG5vbi1icm93c2VyIGNvbnRleHQsIGUuZy4gTm9kZUpzLlxuZnVuY3Rpb24gaW5pdEZvck5vbkJyb3dzZXJBcHAoKSB7XG4gIC8vIFRpbm9kZSByZXF1aXJlbWVudCBpbiBuYXRpdmUgbW9kZSBiZWNhdXNlIHJlYWN0IG5hdGl2ZSBkb2Vzbid0IHByb3ZpZGUgQmFzZTY0IG1ldGhvZFxuICBjb25zdCBjaGFycyA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvPSc7XG5cbiAgaWYgKHR5cGVvZiBidG9hID09ICd1bmRlZmluZWQnKSB7XG4gICAgZ2xvYmFsLmJ0b2EgPSBmdW5jdGlvbihpbnB1dCA9ICcnKSB7XG4gICAgICBsZXQgc3RyID0gaW5wdXQ7XG4gICAgICBsZXQgb3V0cHV0ID0gJyc7XG5cbiAgICAgIGZvciAobGV0IGJsb2NrID0gMCwgY2hhckNvZGUsIGkgPSAwLCBtYXAgPSBjaGFyczsgc3RyLmNoYXJBdChpIHwgMCkgfHwgKG1hcCA9ICc9JywgaSAlIDEpOyBvdXRwdXQgKz0gbWFwLmNoYXJBdCg2MyAmIGJsb2NrID4+IDggLSBpICUgMSAqIDgpKSB7XG5cbiAgICAgICAgY2hhckNvZGUgPSBzdHIuY2hhckNvZGVBdChpICs9IDMgLyA0KTtcblxuICAgICAgICBpZiAoY2hhckNvZGUgPiAweEZGKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiJ2J0b2EnIGZhaWxlZDogVGhlIHN0cmluZyB0byBiZSBlbmNvZGVkIGNvbnRhaW5zIGNoYXJhY3RlcnMgb3V0c2lkZSBvZiB0aGUgTGF0aW4xIHJhbmdlLlwiKTtcbiAgICAgICAgfVxuICAgICAgICBibG9jayA9IGJsb2NrIDw8IDggfCBjaGFyQ29kZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9O1xuICB9XG5cbiAgaWYgKHR5cGVvZiBhdG9iID09ICd1bmRlZmluZWQnKSB7XG4gICAgZ2xvYmFsLmF0b2IgPSBmdW5jdGlvbihpbnB1dCA9ICcnKSB7XG4gICAgICBsZXQgc3RyID0gaW5wdXQucmVwbGFjZSgvPSskLywgJycpO1xuICAgICAgbGV0IG91dHB1dCA9ICcnO1xuXG4gICAgICBpZiAoc3RyLmxlbmd0aCAlIDQgPT0gMSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCInYXRvYicgZmFpbGVkOiBUaGUgc3RyaW5nIHRvIGJlIGRlY29kZWQgaXMgbm90IGNvcnJlY3RseSBlbmNvZGVkLlwiKTtcbiAgICAgIH1cbiAgICAgIGZvciAobGV0IGJjID0gMCwgYnMgPSAwLCBidWZmZXIsIGkgPSAwOyBidWZmZXIgPSBzdHIuY2hhckF0KGkrKyk7XG5cbiAgICAgICAgfmJ1ZmZlciAmJiAoYnMgPSBiYyAlIDQgPyBicyAqIDY0ICsgYnVmZmVyIDogYnVmZmVyLFxuICAgICAgICAgIGJjKysgJSA0KSA/IG91dHB1dCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKDI1NSAmIGJzID4+ICgtMiAqIGJjICYgNikpIDogMFxuICAgICAgKSB7XG4gICAgICAgIGJ1ZmZlciA9IGNoYXJzLmluZGV4T2YoYnVmZmVyKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9O1xuICB9XG5cbiAgaWYgKHR5cGVvZiB3aW5kb3cgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBnbG9iYWwud2luZG93ID0ge1xuICAgICAgV2ViU29ja2V0OiBXZWJTb2NrZXRQcm92aWRlcixcbiAgICAgIFhNTEh0dHBSZXF1ZXN0OiBYSFJQcm92aWRlcixcbiAgICAgIGluZGV4ZWREQjogSW5kZXhlZERCUHJvdmlkZXIsXG4gICAgICBVUkw6IHtcbiAgICAgICAgY3JlYXRlT2JqZWN0VVJMOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmFibGUgdG8gdXNlIFVSTC5jcmVhdGVPYmplY3RVUkwgaW4gYSBub24tYnJvd3NlciBhcHBsaWNhdGlvblwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIENvbm5lY3Rpb24uc2V0TmV0d29ya1Byb3ZpZGVycyhXZWJTb2NrZXRQcm92aWRlciwgWEhSUHJvdmlkZXIpO1xuICBMYXJnZUZpbGVIZWxwZXIuc2V0TmV0d29ya1Byb3ZpZGVyKFhIUlByb3ZpZGVyKTtcbiAgREJDYWNoZS5zZXREYXRhYmFzZVByb3ZpZGVyKEluZGV4ZWREQlByb3ZpZGVyKTtcbn1cblxuLy8gRGV0ZWN0IGZpbmQgbW9zdCB1c2VmdWwgbmV0d29yayB0cmFuc3BvcnQuXG5mdW5jdGlvbiBkZXRlY3RUcmFuc3BvcnQoKSB7XG4gIGlmICh0eXBlb2Ygd2luZG93ID09ICdvYmplY3QnKSB7XG4gICAgaWYgKHdpbmRvd1snV2ViU29ja2V0J10pIHtcbiAgICAgIHJldHVybiAnd3MnO1xuICAgIH0gZWxzZSBpZiAod2luZG93WydYTUxIdHRwUmVxdWVzdCddKSB7XG4gICAgICAvLyBUaGUgYnJvd3NlciBvciBub2RlIGhhcyBubyB3ZWJzb2NrZXRzLCB1c2luZyBsb25nIHBvbGxpbmcuXG4gICAgICByZXR1cm4gJ2xwJztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbi8vIGJ0b2EgcmVwbGFjZW1lbnQuIFN0b2NrIGJ0b2EgZmFpbHMgb24gb24gbm9uLUxhdGluMSBzdHJpbmdzLlxuZnVuY3Rpb24gYjY0RW5jb2RlVW5pY29kZShzdHIpIHtcbiAgLy8gVGhlIGVuY29kZVVSSUNvbXBvbmVudCBwZXJjZW50LWVuY29kZXMgVVRGLTggc3RyaW5nLFxuICAvLyB0aGVuIHRoZSBwZXJjZW50IGVuY29kaW5nIGlzIGNvbnZlcnRlZCBpbnRvIHJhdyBieXRlcyB3aGljaFxuICAvLyBjYW4gYmUgZmVkIGludG8gYnRvYS5cbiAgcmV0dXJuIGJ0b2EoZW5jb2RlVVJJQ29tcG9uZW50KHN0cikucmVwbGFjZSgvJShbMC05QS1GXXsyfSkvZyxcbiAgICBmdW5jdGlvbiB0b1NvbGlkQnl0ZXMobWF0Y2gsIHAxKSB7XG4gICAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZSgnMHgnICsgcDEpO1xuICAgIH0pKTtcbn1cblxuLy8gSlNPTiBzdHJpbmdpZnkgaGVscGVyIC0gcHJlLXByb2Nlc3NvciBmb3IgSlNPTi5zdHJpbmdpZnlcbmZ1bmN0aW9uIGpzb25CdWlsZEhlbHBlcihrZXksIHZhbCkge1xuICBpZiAodmFsIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgIC8vIENvbnZlcnQgamF2YXNjcmlwdCBEYXRlIG9iamVjdHMgdG8gcmZjMzMzOSBzdHJpbmdzXG4gICAgdmFsID0gcmZjMzMzOURhdGVTdHJpbmcodmFsKTtcbiAgfSBlbHNlIGlmICh2YWwgaW5zdGFuY2VvZiBBY2Nlc3NNb2RlKSB7XG4gICAgdmFsID0gdmFsLmpzb25IZWxwZXIoKTtcbiAgfSBlbHNlIGlmICh2YWwgPT09IHVuZGVmaW5lZCB8fCB2YWwgPT09IG51bGwgfHwgdmFsID09PSBmYWxzZSB8fFxuICAgIChBcnJheS5pc0FycmF5KHZhbCkgJiYgdmFsLmxlbmd0aCA9PSAwKSB8fFxuICAgICgodHlwZW9mIHZhbCA9PSAnb2JqZWN0JykgJiYgKE9iamVjdC5rZXlzKHZhbCkubGVuZ3RoID09IDApKSkge1xuICAgIC8vIHN0cmlwIG91dCBlbXB0eSBlbGVtZW50cyB3aGlsZSBzZXJpYWxpemluZyBvYmplY3RzIHRvIEpTT05cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgcmV0dXJuIHZhbDtcbn07XG5cbi8vIFRyaW1zIHZlcnkgbG9uZyBzdHJpbmdzIChlbmNvZGVkIGltYWdlcykgdG8gbWFrZSBsb2dnZWQgcGFja2V0cyBtb3JlIHJlYWRhYmxlLlxuZnVuY3Rpb24ganNvbkxvZ2dlckhlbHBlcihrZXksIHZhbCkge1xuICBpZiAodHlwZW9mIHZhbCA9PSAnc3RyaW5nJyAmJiB2YWwubGVuZ3RoID4gMTI4KSB7XG4gICAgcmV0dXJuICc8JyArIHZhbC5sZW5ndGggKyAnLCBieXRlczogJyArIHZhbC5zdWJzdHJpbmcoMCwgMTIpICsgJy4uLicgKyB2YWwuc3Vic3RyaW5nKHZhbC5sZW5ndGggLSAxMikgKyAnPic7XG4gIH1cbiAgcmV0dXJuIGpzb25CdWlsZEhlbHBlcihrZXksIHZhbCk7XG59O1xuXG4vLyBQYXJzZSBicm93c2VyIHVzZXIgYWdlbnQgdG8gZXh0cmFjdCBicm93c2VyIG5hbWUgYW5kIHZlcnNpb24uXG5mdW5jdGlvbiBnZXRCcm93c2VySW5mbyh1YSwgcHJvZHVjdCkge1xuICB1YSA9IHVhIHx8ICcnO1xuICBsZXQgcmVhY3RuYXRpdmUgPSAnJztcbiAgLy8gQ2hlY2sgaWYgdGhpcyBpcyBhIFJlYWN0TmF0aXZlIGFwcC5cbiAgaWYgKC9yZWFjdG5hdGl2ZS9pLnRlc3QocHJvZHVjdCkpIHtcbiAgICByZWFjdG5hdGl2ZSA9ICdSZWFjdE5hdGl2ZTsgJztcbiAgfVxuICBsZXQgcmVzdWx0O1xuICAvLyBSZW1vdmUgdXNlbGVzcyBzdHJpbmcuXG4gIHVhID0gdWEucmVwbGFjZSgnIChLSFRNTCwgbGlrZSBHZWNrbyknLCAnJyk7XG4gIC8vIFRlc3QgZm9yIFdlYktpdC1iYXNlZCBicm93c2VyLlxuICBsZXQgbSA9IHVhLm1hdGNoKC8oQXBwbGVXZWJLaXRcXC9bLlxcZF0rKS9pKTtcbiAgaWYgKG0pIHtcbiAgICAvLyBMaXN0IG9mIGNvbW1vbiBzdHJpbmdzLCBmcm9tIG1vcmUgdXNlZnVsIHRvIGxlc3MgdXNlZnVsLlxuICAgIC8vIEFsbCB1bmtub3duIHN0cmluZ3MgZ2V0IHRoZSBoaWdoZXN0ICgtMSkgcHJpb3JpdHkuXG4gICAgY29uc3QgcHJpb3JpdHkgPSBbJ2VkZycsICdjaHJvbWUnLCAnc2FmYXJpJywgJ21vYmlsZScsICd2ZXJzaW9uJ107XG4gICAgbGV0IHRtcCA9IHVhLnN1YnN0cihtLmluZGV4ICsgbVswXS5sZW5ndGgpLnNwbGl0KCcgJyk7XG4gICAgbGV0IHRva2VucyA9IFtdO1xuICAgIGxldCB2ZXJzaW9uOyAvLyAxLjAgaW4gVmVyc2lvbi8xLjAgb3IgdW5kZWZpbmVkO1xuICAgIC8vIFNwbGl0IHN0cmluZyBsaWtlICdOYW1lLzAuMC4wJyBpbnRvIFsnTmFtZScsICcwLjAuMCcsIDNdIHdoZXJlIHRoZSBsYXN0IGVsZW1lbnQgaXMgdGhlIHByaW9yaXR5LlxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG1wLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgbTIgPSAvKFtcXHcuXSspW1xcL10oW1xcLlxcZF0rKS8uZXhlYyh0bXBbaV0pO1xuICAgICAgaWYgKG0yKSB7XG4gICAgICAgIC8vIFVua25vd24gdmFsdWVzIGFyZSBoaWdoZXN0IHByaW9yaXR5ICgtMSkuXG4gICAgICAgIHRva2Vucy5wdXNoKFttMlsxXSwgbTJbMl0sIHByaW9yaXR5LmZpbmRJbmRleCgoZSkgPT4ge1xuICAgICAgICAgIHJldHVybiBtMlsxXS50b0xvd2VyQ2FzZSgpLnN0YXJ0c1dpdGgoZSk7XG4gICAgICAgIH0pXSk7XG4gICAgICAgIGlmIChtMlsxXSA9PSAnVmVyc2lvbicpIHtcbiAgICAgICAgICB2ZXJzaW9uID0gbTJbMl07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgLy8gU29ydCBieSBwcmlvcml0eTogbW9yZSBpbnRlcmVzdGluZyBpcyBlYXJsaWVyIHRoYW4gbGVzcyBpbnRlcmVzdGluZy5cbiAgICB0b2tlbnMuc29ydCgoYSwgYikgPT4ge1xuICAgICAgcmV0dXJuIGFbMl0gLSBiWzJdO1xuICAgIH0pO1xuICAgIGlmICh0b2tlbnMubGVuZ3RoID4gMCkge1xuICAgICAgLy8gUmV0dXJuIHRoZSBsZWFzdCBjb21tb24gYnJvd3NlciBzdHJpbmcgYW5kIHZlcnNpb24uXG4gICAgICBpZiAodG9rZW5zWzBdWzBdLnRvTG93ZXJDYXNlKCkuc3RhcnRzV2l0aCgnZWRnJykpIHtcbiAgICAgICAgdG9rZW5zWzBdWzBdID0gJ0VkZ2UnO1xuICAgICAgfSBlbHNlIGlmICh0b2tlbnNbMF1bMF0gPT0gJ09QUicpIHtcbiAgICAgICAgdG9rZW5zWzBdWzBdID0gJ09wZXJhJztcbiAgICAgIH0gZWxzZSBpZiAodG9rZW5zWzBdWzBdID09ICdTYWZhcmknICYmIHZlcnNpb24pIHtcbiAgICAgICAgdG9rZW5zWzBdWzFdID0gdmVyc2lvbjtcbiAgICAgIH1cbiAgICAgIHJlc3VsdCA9IHRva2Vuc1swXVswXSArICcvJyArIHRva2Vuc1swXVsxXTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gRmFpbGVkIHRvIElEIHRoZSBicm93c2VyLiBSZXR1cm4gdGhlIHdlYmtpdCB2ZXJzaW9uLlxuICAgICAgcmVzdWx0ID0gbVsxXTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoL2ZpcmVmb3gvaS50ZXN0KHVhKSkge1xuICAgIG0gPSAvRmlyZWZveFxcLyhbLlxcZF0rKS9nLmV4ZWModWEpO1xuICAgIGlmIChtKSB7XG4gICAgICByZXN1bHQgPSAnRmlyZWZveC8nICsgbVsxXTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0ID0gJ0ZpcmVmb3gvPyc7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIC8vIE5laXRoZXIgQXBwbGVXZWJLaXQgbm9yIEZpcmVmb3guIFRyeSB0aGUgbGFzdCByZXNvcnQuXG4gICAgbSA9IC8oW1xcdy5dKylcXC8oWy5cXGRdKykvLmV4ZWModWEpO1xuICAgIGlmIChtKSB7XG4gICAgICByZXN1bHQgPSBtWzFdICsgJy8nICsgbVsyXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IHVhLnNwbGl0KCcgJyk7XG4gICAgICByZXN1bHQgPSBtWzBdO1xuICAgIH1cbiAgfVxuXG4gIC8vIFNob3J0ZW4gdGhlIHZlcnNpb24gdG8gb25lIGRvdCAnYS5iYi5jY2MuZCAtPiBhLmJiJyBhdCBtb3N0LlxuICBtID0gcmVzdWx0LnNwbGl0KCcvJyk7XG4gIGlmIChtLmxlbmd0aCA+IDEpIHtcbiAgICBjb25zdCB2ID0gbVsxXS5zcGxpdCgnLicpO1xuICAgIGNvbnN0IG1pbm9yID0gdlsxXSA/ICcuJyArIHZbMV0uc3Vic3RyKDAsIDIpIDogJyc7XG4gICAgcmVzdWx0ID0gYCR7bVswXX0vJHt2WzBdfSR7bWlub3J9YDtcbiAgfVxuICByZXR1cm4gcmVhY3RuYXRpdmUgKyByZXN1bHQ7XG59XG5cbi8qKlxuICogQGNsYXNzIFRpbm9kZVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgLSBjb25maWd1cmF0aW9uIHBhcmFtZXRlcnMuXG4gKiBAcGFyYW0ge3N0cmluZ30gY29uZmlnLmFwcE5hbWUgLSBOYW1lIG9mIHRoZSBjYWxsaW5nIGFwcGxpY2F0aW9uIHRvIGJlIHJlcG9ydGVkIGluIHRoZSBVc2VyIEFnZW50LlxuICogQHBhcmFtIHtzdHJpbmd9IGNvbmZpZy5ob3N0IC0gSG9zdCBuYW1lIGFuZCBvcHRpb25hbCBwb3J0IG51bWJlciB0byBjb25uZWN0IHRvLlxuICogQHBhcmFtIHtzdHJpbmd9IGNvbmZpZy5hcGlLZXkgLSBBUEkga2V5IGdlbmVyYXRlZCBieSA8Y29kZT5rZXlnZW48L2NvZGU+LlxuICogQHBhcmFtIHtzdHJpbmd9IGNvbmZpZy50cmFuc3BvcnQgLSBTZWUge0BsaW5rIFRpbm9kZS5Db25uZWN0aW9uI3RyYW5zcG9ydH0uXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGNvbmZpZy5zZWN1cmUgLSBVc2UgU2VjdXJlIFdlYlNvY2tldCBpZiA8Y29kZT50cnVlPC9jb2RlPi5cbiAqIEBwYXJhbSB7c3RyaW5nfSBjb25maWcucGxhdGZvcm0gLSBPcHRpb25hbCBwbGF0Zm9ybSBpZGVudGlmaWVyLCBvbmUgb2YgPGNvZGU+XCJpb3NcIjwvY29kZT4sIDxjb2RlPlwid2ViXCI8L2NvZGU+LCA8Y29kZT5cImFuZHJvaWRcIjwvY29kZT4uXG4gKiBAcGFyYW0ge2Jvb2xlbn0gY29uZmlnLnBlcnNpc3QgLSBVc2UgSW5kZXhlZERCIHBlcnNpc3RlbnQgc3RvcmFnZS5cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IG9uQ29tcGxldGUgLSBjYWxsYmFjayB0byBjYWxsIHdoZW4gaW5pdGlhbGl6YXRpb24gaXMgY29tcGxldGVkLlxuICovXG5leHBvcnQgY2xhc3MgVGlub2RlIHtcbiAgX2hvc3Q7XG4gIF9zZWN1cmU7XG5cbiAgX2FwcE5hbWU7XG5cbiAgLy8gQVBJIEtleS5cbiAgX2FwaUtleTtcblxuICAvLyBOYW1lIGFuZCB2ZXJzaW9uIG9mIHRoZSBicm93c2VyLlxuICBfYnJvd3NlciA9ICcnO1xuICBfcGxhdGZvcm07XG4gIC8vIEhhcmR3YXJlXG4gIF9od29zID0gJ3VuZGVmaW5lZCc7XG4gIF9odW1hbkxhbmd1YWdlID0gJ3h4JztcblxuICAvLyBMb2dnaW5nIHRvIGNvbnNvbGUgZW5hYmxlZFxuICBfbG9nZ2luZ0VuYWJsZWQgPSBmYWxzZTtcbiAgLy8gV2hlbiBsb2dnaW5nLCB0cmlwIGxvbmcgc3RyaW5ncyAoYmFzZTY0LWVuY29kZWQgaW1hZ2VzKSBmb3IgcmVhZGFiaWxpdHlcbiAgX3RyaW1Mb25nU3RyaW5ncyA9IGZhbHNlO1xuICAvLyBVSUQgb2YgdGhlIGN1cnJlbnRseSBhdXRoZW50aWNhdGVkIHVzZXIuXG4gIF9teVVJRCA9IG51bGw7XG4gIC8vIFN0YXR1cyBvZiBjb25uZWN0aW9uOiBhdXRoZW50aWNhdGVkIG9yIG5vdC5cbiAgX2F1dGhlbnRpY2F0ZWQgPSBmYWxzZTtcbiAgLy8gTG9naW4gdXNlZCBpbiB0aGUgbGFzdCBzdWNjZXNzZnVsIGJhc2ljIGF1dGhlbnRpY2F0aW9uXG4gIF9sb2dpbiA9IG51bGw7XG4gIC8vIFRva2VuIHdoaWNoIGNhbiBiZSB1c2VkIGZvciBsb2dpbiBpbnN0ZWFkIG9mIGxvZ2luL3Bhc3N3b3JkLlxuICBfYXV0aFRva2VuID0gbnVsbDtcbiAgLy8gQ291bnRlciBvZiByZWNlaXZlZCBwYWNrZXRzXG4gIF9pblBhY2tldENvdW50ID0gMDtcbiAgLy8gQ291bnRlciBmb3IgZ2VuZXJhdGluZyB1bmlxdWUgbWVzc2FnZSBJRHNcbiAgX21lc3NhZ2VJZCA9IE1hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkgKiAweEZGRkYpICsgMHhGRkZGKTtcbiAgLy8gSW5mb3JtYXRpb24gYWJvdXQgdGhlIHNlcnZlciwgaWYgY29ubmVjdGVkXG4gIF9zZXJ2ZXJJbmZvID0gbnVsbDtcbiAgLy8gUHVzaCBub3RpZmljYXRpb24gdG9rZW4uIENhbGxlZCBkZXZpY2VUb2tlbiBmb3IgY29uc2lzdGVuY3kgd2l0aCB0aGUgQW5kcm9pZCBTREsuXG4gIF9kZXZpY2VUb2tlbiA9IG51bGw7XG5cbiAgLy8gQ2FjaGUgb2YgcGVuZGluZyBwcm9taXNlcyBieSBtZXNzYWdlIGlkLlxuICBfcGVuZGluZ1Byb21pc2VzID0ge307XG4gIC8vIFRoZSBUaW1lb3V0IG9iamVjdCByZXR1cm5lZCBieSB0aGUgcmVqZWN0IGV4cGlyZWQgcHJvbWlzZXMgc2V0SW50ZXJ2YWwuXG4gIF9leHBpcmVQcm9taXNlcyA9IG51bGw7XG5cbiAgLy8gV2Vic29ja2V0IG9yIGxvbmcgcG9sbGluZyBjb25uZWN0aW9uLlxuICBfY29ubmVjdGlvbiA9IG51bGw7XG5cbiAgLy8gVXNlIGluZGV4REIgZm9yIGNhY2hpbmcgdG9waWNzIGFuZCBtZXNzYWdlcy5cbiAgX3BlcnNpc3QgPSBmYWxzZTtcbiAgLy8gSW5kZXhlZERCIHdyYXBwZXIgb2JqZWN0LlxuICBfZGIgPSBudWxsO1xuXG4gIC8vIFRpbm9kZSdzIGNhY2hlIG9mIG9iamVjdHNcbiAgX2NhY2hlID0ge307XG5cbiAgY29uc3RydWN0b3IoY29uZmlnLCBvbkNvbXBsZXRlKSB7XG4gICAgdGhpcy5faG9zdCA9IGNvbmZpZy5ob3N0O1xuICAgIHRoaXMuX3NlY3VyZSA9IGNvbmZpZy5zZWN1cmU7XG5cbiAgICAvLyBDbGllbnQtcHJvdmlkZWQgYXBwbGljYXRpb24gbmFtZSwgZm9ybWF0IDxOYW1lPi88dmVyc2lvbiBudW1iZXI+XG4gICAgdGhpcy5fYXBwTmFtZSA9IGNvbmZpZy5hcHBOYW1lIHx8IFwiVW5kZWZpbmVkXCI7XG5cbiAgICAvLyBBUEkgS2V5LlxuICAgIHRoaXMuX2FwaUtleSA9IGNvbmZpZy5hcGlLZXk7XG5cbiAgICAvLyBOYW1lIGFuZCB2ZXJzaW9uIG9mIHRoZSBicm93c2VyLlxuICAgIHRoaXMuX3BsYXRmb3JtID0gY29uZmlnLnBsYXRmb3JtIHx8ICd3ZWInO1xuICAgIC8vIFVuZGVybHlpbmcgT1MuXG4gICAgaWYgKHR5cGVvZiBuYXZpZ2F0b3IgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRoaXMuX2Jyb3dzZXIgPSBnZXRCcm93c2VySW5mbyhuYXZpZ2F0b3IudXNlckFnZW50LCBuYXZpZ2F0b3IucHJvZHVjdCk7XG4gICAgICB0aGlzLl9od29zID0gbmF2aWdhdG9yLnBsYXRmb3JtO1xuICAgICAgLy8gVGhpcyBpcyB0aGUgZGVmYXVsdCBsYW5ndWFnZS4gSXQgY291bGQgYmUgY2hhbmdlZCBieSBjbGllbnQuXG4gICAgICB0aGlzLl9odW1hbkxhbmd1YWdlID0gbmF2aWdhdG9yLmxhbmd1YWdlIHx8ICdlbi1VUyc7XG4gICAgfVxuXG4gICAgQ29ubmVjdGlvbi5sb2dnZXIgPSB0aGlzLmxvZ2dlcjtcbiAgICBEcmFmdHkubG9nZ2VyID0gdGhpcy5sb2dnZXI7XG5cbiAgICAvLyBXZWJTb2NrZXQgb3IgbG9uZyBwb2xsaW5nIG5ldHdvcmsgY29ubmVjdGlvbi5cbiAgICBpZiAoY29uZmlnLnRyYW5zcG9ydCAhPSAnbHAnICYmIGNvbmZpZy50cmFuc3BvcnQgIT0gJ3dzJykge1xuICAgICAgY29uZmlnLnRyYW5zcG9ydCA9IGRldGVjdFRyYW5zcG9ydCgpO1xuICAgIH1cbiAgICB0aGlzLl9jb25uZWN0aW9uID0gbmV3IENvbm5lY3Rpb24oY29uZmlnLCBDb25zdC5QUk9UT0NPTF9WRVJTSU9OLCAvKiBhdXRvcmVjb25uZWN0ICovIHRydWUpO1xuICAgIHRoaXMuX2Nvbm5lY3Rpb24ub25NZXNzYWdlID0gKGRhdGEpID0+IHtcbiAgICAgIC8vIENhbGwgdGhlIG1haW4gbWVzc2FnZSBkaXNwYXRjaGVyLlxuICAgICAgdGhpcy4jZGlzcGF0Y2hNZXNzYWdlKGRhdGEpO1xuICAgIH1cbiAgICB0aGlzLl9jb25uZWN0aW9uLm9uT3BlbiA9ICgpID0+IHtcbiAgICAgIC8vIFJlYWR5IHRvIHN0YXJ0IHNlbmRpbmcuXG4gICAgICB0aGlzLiNjb25uZWN0aW9uT3BlbigpO1xuICAgIH1cbiAgICB0aGlzLl9jb25uZWN0aW9uLm9uRGlzY29ubmVjdCA9IChlcnIsIGNvZGUpID0+IHtcbiAgICAgIHRoaXMuI2Rpc2Nvbm5lY3RlZChlcnIsIGNvZGUpO1xuICAgIH1cbiAgICAvLyBXcmFwcGVyIGZvciB0aGUgcmVjb25uZWN0IGl0ZXJhdG9yIGNhbGxiYWNrLlxuICAgIHRoaXMuX2Nvbm5lY3Rpb24ub25BdXRvcmVjb25uZWN0SXRlcmF0aW9uID0gKHRpbWVvdXQsIHByb21pc2UpID0+IHtcbiAgICAgIGlmICh0aGlzLm9uQXV0b3JlY29ubmVjdEl0ZXJhdGlvbikge1xuICAgICAgICB0aGlzLm9uQXV0b3JlY29ubmVjdEl0ZXJhdGlvbih0aW1lb3V0LCBwcm9taXNlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLl9wZXJzaXN0ID0gY29uZmlnLnBlcnNpc3Q7XG4gICAgLy8gSW5pdGlhbGl6ZSBvYmplY3QgcmVnYXJkbGVzcy4gSXQgc2ltcGxpZmllcyB0aGUgY29kZS5cbiAgICB0aGlzLl9kYiA9IG5ldyBEQkNhY2hlKGVyciA9PiB7XG4gICAgICB0aGlzLmxvZ2dlcignREInLCBlcnIpO1xuICAgIH0sIHRoaXMubG9nZ2VyKTtcblxuICAgIGlmICh0aGlzLl9wZXJzaXN0KSB7XG4gICAgICAvLyBDcmVhdGUgdGhlIHBlcnNpc3RlbnQgY2FjaGUuXG4gICAgICAvLyBTdG9yZSBwcm9taXNlcyB0byBiZSByZXNvbHZlZCB3aGVuIG1lc3NhZ2VzIGxvYWQgaW50byBtZW1vcnkuXG4gICAgICBjb25zdCBwcm9tID0gW107XG4gICAgICB0aGlzLl9kYi5pbml0RGF0YWJhc2UoKS50aGVuKF8gPT4ge1xuICAgICAgICAvLyBGaXJzdCBsb2FkIHRvcGljcyBpbnRvIG1lbW9yeS5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2RiLm1hcFRvcGljcygoZGF0YSkgPT4ge1xuICAgICAgICAgIGxldCB0b3BpYyA9IHRoaXMuI2NhY2hlR2V0KCd0b3BpYycsIGRhdGEubmFtZSk7XG4gICAgICAgICAgaWYgKHRvcGljKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChkYXRhLm5hbWUgPT0gQ29uc3QuVE9QSUNfTUUpIHtcbiAgICAgICAgICAgIHRvcGljID0gbmV3IFRvcGljTWUoKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGRhdGEubmFtZSA9PSBDb25zdC5UT1BJQ19GTkQpIHtcbiAgICAgICAgICAgIHRvcGljID0gbmV3IFRvcGljRm5kKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRvcGljID0gbmV3IFRvcGljKGRhdGEubmFtZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuX2RiLmRlc2VyaWFsaXplVG9waWModG9waWMsIGRhdGEpO1xuICAgICAgICAgIHRoaXMuI2F0dGFjaENhY2hlVG9Ub3BpYyh0b3BpYyk7XG4gICAgICAgICAgdG9waWMuX2NhY2hlUHV0U2VsZigpO1xuICAgICAgICAgIC8vIFRvcGljIGxvYWRlZCBmcm9tIERCIGlzIG5vdCBuZXcuXG4gICAgICAgICAgZGVsZXRlIHRvcGljLl9uZXc7XG4gICAgICAgICAgLy8gUmVxdWVzdCB0byBsb2FkIG1lc3NhZ2VzIGFuZCBzYXZlIHRoZSBwcm9taXNlLlxuICAgICAgICAgIHByb20ucHVzaCh0b3BpYy5fbG9hZE1lc3NhZ2VzKHRoaXMuX2RiKSk7XG4gICAgICAgIH0pO1xuICAgICAgfSkudGhlbihfID0+IHtcbiAgICAgICAgLy8gVGhlbiBsb2FkIHVzZXJzLlxuICAgICAgICByZXR1cm4gdGhpcy5fZGIubWFwVXNlcnMoKGRhdGEpID0+IHtcbiAgICAgICAgICB0aGlzLiNjYWNoZVB1dCgndXNlcicsIGRhdGEudWlkLCBtZXJnZU9iaih7fSwgZGF0YS5wdWJsaWMpKTtcbiAgICAgICAgfSk7XG4gICAgICB9KS50aGVuKF8gPT4ge1xuICAgICAgICAvLyBOb3cgd2FpdCBmb3IgYWxsIG1lc3NhZ2VzIHRvIGZpbmlzaCBsb2FkaW5nLlxuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbSk7XG4gICAgICB9KS50aGVuKF8gPT4ge1xuICAgICAgICBpZiAob25Db21wbGV0ZSkge1xuICAgICAgICAgIG9uQ29tcGxldGUoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxvZ2dlcihcIlBlcnNpc3RlbnQgY2FjaGUgaW5pdGlhbGl6ZWQuXCIpO1xuICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICBpZiAob25Db21wbGV0ZSkge1xuICAgICAgICAgIG9uQ29tcGxldGUoZXJyKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxvZ2dlcihcIkZhaWxlZCB0byBpbml0aWFsaXplIHBlcnNpc3RlbnQgY2FjaGU6XCIsIGVycik7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fZGIuZGVsZXRlRGF0YWJhc2UoKS50aGVuKF8gPT4ge1xuICAgICAgICBpZiAob25Db21wbGV0ZSkge1xuICAgICAgICAgIG9uQ29tcGxldGUoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLy8gUHJpdmF0ZSBtZXRob2RzLlxuXG4gIC8vIENvbnNvbGUgbG9nZ2VyLiBCYWJlbCBzb21laG93IGZhaWxzIHRvIHBhcnNlICcuLi5yZXN0JyBwYXJhbWV0ZXIuXG4gIGxvZ2dlcihzdHIsIC4uLmFyZ3MpIHtcbiAgICBpZiAodGhpcy5fbG9nZ2luZ0VuYWJsZWQpIHtcbiAgICAgIGNvbnN0IGQgPSBuZXcgRGF0ZSgpO1xuICAgICAgY29uc3QgZGF0ZVN0cmluZyA9ICgnMCcgKyBkLmdldFVUQ0hvdXJzKCkpLnNsaWNlKC0yKSArICc6JyArXG4gICAgICAgICgnMCcgKyBkLmdldFVUQ01pbnV0ZXMoKSkuc2xpY2UoLTIpICsgJzonICtcbiAgICAgICAgKCcwJyArIGQuZ2V0VVRDU2Vjb25kcygpKS5zbGljZSgtMikgKyAnLicgK1xuICAgICAgICAoJzAwJyArIGQuZ2V0VVRDTWlsbGlzZWNvbmRzKCkpLnNsaWNlKC0zKTtcblxuICAgICAgY29uc29sZS5sb2coJ1snICsgZGF0ZVN0cmluZyArICddJywgc3RyLCBhcmdzLmpvaW4oJyAnKSk7XG4gICAgfVxuICB9XG5cbiAgLy8gR2VuZXJhdG9yIG9mIGRlZmF1bHQgcHJvbWlzZXMgZm9yIHNlbnQgcGFja2V0cy5cbiAgI21ha2VQcm9taXNlKGlkKSB7XG4gICAgbGV0IHByb21pc2UgPSBudWxsO1xuICAgIGlmIChpZCkge1xuICAgICAgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgLy8gU3RvcmVkIGNhbGxiYWNrcyB3aWxsIGJlIGNhbGxlZCB3aGVuIHRoZSByZXNwb25zZSBwYWNrZXQgd2l0aCB0aGlzIElkIGFycml2ZXNcbiAgICAgICAgdGhpcy5fcGVuZGluZ1Byb21pc2VzW2lkXSA9IHtcbiAgICAgICAgICAncmVzb2x2ZSc6IHJlc29sdmUsXG4gICAgICAgICAgJ3JlamVjdCc6IHJlamVjdCxcbiAgICAgICAgICAndHMnOiBuZXcgRGF0ZSgpXG4gICAgICAgIH07XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH07XG5cbiAgLy8gUmVzb2x2ZSBvciByZWplY3QgYSBwZW5kaW5nIHByb21pc2UuXG4gIC8vIFVucmVzb2x2ZWQgcHJvbWlzZXMgYXJlIHN0b3JlZCBpbiBfcGVuZGluZ1Byb21pc2VzLlxuICAjZXhlY1Byb21pc2UoaWQsIGNvZGUsIG9uT0ssIGVycm9yVGV4dCkge1xuICAgIGNvbnN0IGNhbGxiYWNrcyA9IHRoaXMuX3BlbmRpbmdQcm9taXNlc1tpZF07XG4gICAgaWYgKGNhbGxiYWNrcykge1xuICAgICAgZGVsZXRlIHRoaXMuX3BlbmRpbmdQcm9taXNlc1tpZF07XG4gICAgICBpZiAoY29kZSA+PSAyMDAgJiYgY29kZSA8IDQwMCkge1xuICAgICAgICBpZiAoY2FsbGJhY2tzLnJlc29sdmUpIHtcbiAgICAgICAgICBjYWxsYmFja3MucmVzb2x2ZShvbk9LKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChjYWxsYmFja3MucmVqZWN0KSB7XG4gICAgICAgIGNhbGxiYWNrcy5yZWplY3QobmV3IEVycm9yKGAke2Vycm9yVGV4dH0gKCR7Y29kZX0pYCkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIFNlbmQgYSBwYWNrZXQuIElmIHBhY2tldCBpZCBpcyBwcm92aWRlZCByZXR1cm4gYSBwcm9taXNlLlxuICAjc2VuZChwa3QsIGlkKSB7XG4gICAgbGV0IHByb21pc2U7XG4gICAgaWYgKGlkKSB7XG4gICAgICBwcm9taXNlID0gdGhpcy4jbWFrZVByb21pc2UoaWQpO1xuICAgIH1cbiAgICBwa3QgPSBzaW1wbGlmeShwa3QpO1xuICAgIGxldCBtc2cgPSBKU09OLnN0cmluZ2lmeShwa3QpO1xuICAgIHRoaXMubG9nZ2VyKFwib3V0OiBcIiArICh0aGlzLl90cmltTG9uZ1N0cmluZ3MgPyBKU09OLnN0cmluZ2lmeShwa3QsIGpzb25Mb2dnZXJIZWxwZXIpIDogbXNnKSk7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uc2VuZFRleHQobXNnKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIC8vIElmIHNlbmRUZXh0IHRocm93cywgd3JhcCB0aGUgZXJyb3IgaW4gYSBwcm9taXNlIG9yIHJldGhyb3cuXG4gICAgICBpZiAoaWQpIHtcbiAgICAgICAgdGhpcy4jZXhlY1Byb21pc2UoaWQsIENvbm5lY3Rpb24uTkVUV09SS19FUlJPUiwgbnVsbCwgZXJyLm1lc3NhZ2UpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIC8vIFRoZSBtYWluIG1lc3NhZ2UgZGlzcGF0Y2hlci5cbiAgI2Rpc3BhdGNoTWVzc2FnZShkYXRhKSB7XG4gICAgLy8gU2tpcCBlbXB0eSByZXNwb25zZS4gVGhpcyBoYXBwZW5zIHdoZW4gTFAgdGltZXMgb3V0LlxuICAgIGlmICghZGF0YSlcbiAgICAgIHJldHVybjtcblxuICAgIHRoaXMuX2luUGFja2V0Q291bnQrKztcblxuICAgIC8vIFNlbmQgcmF3IG1lc3NhZ2UgdG8gbGlzdGVuZXJcbiAgICBpZiAodGhpcy5vblJhd01lc3NhZ2UpIHtcbiAgICAgIHRoaXMub25SYXdNZXNzYWdlKGRhdGEpO1xuICAgIH1cblxuICAgIGlmIChkYXRhID09PSAnMCcpIHtcbiAgICAgIC8vIFNlcnZlciByZXNwb25zZSB0byBhIG5ldHdvcmsgcHJvYmUuXG4gICAgICBpZiAodGhpcy5vbk5ldHdvcmtQcm9iZSkge1xuICAgICAgICB0aGlzLm9uTmV0d29ya1Byb2JlKCk7XG4gICAgICB9XG4gICAgICAvLyBObyBwcm9jZXNzaW5nIGlzIG5lY2Vzc2FyeS5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgcGt0ID0gSlNPTi5wYXJzZShkYXRhLCBqc29uUGFyc2VIZWxwZXIpO1xuICAgIGlmICghcGt0KSB7XG4gICAgICB0aGlzLmxvZ2dlcihcImluOiBcIiArIGRhdGEpO1xuICAgICAgdGhpcy5sb2dnZXIoXCJFUlJPUjogZmFpbGVkIHRvIHBhcnNlIGRhdGFcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubG9nZ2VyKFwiaW46IFwiICsgKHRoaXMuX3RyaW1Mb25nU3RyaW5ncyA/IEpTT04uc3RyaW5naWZ5KHBrdCwganNvbkxvZ2dlckhlbHBlcikgOiBkYXRhKSk7XG5cbiAgICAgIC8vIFNlbmQgY29tcGxldGUgcGFja2V0IHRvIGxpc3RlbmVyXG4gICAgICBpZiAodGhpcy5vbk1lc3NhZ2UpIHtcbiAgICAgICAgdGhpcy5vbk1lc3NhZ2UocGt0KTtcbiAgICAgIH1cblxuICAgICAgaWYgKHBrdC5jdHJsKSB7XG4gICAgICAgIC8vIEhhbmRsaW5nIHtjdHJsfSBtZXNzYWdlXG4gICAgICAgIGlmICh0aGlzLm9uQ3RybE1lc3NhZ2UpIHtcbiAgICAgICAgICB0aGlzLm9uQ3RybE1lc3NhZ2UocGt0LmN0cmwpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmVzb2x2ZSBvciByZWplY3QgYSBwZW5kaW5nIHByb21pc2UsIGlmIGFueVxuICAgICAgICBpZiAocGt0LmN0cmwuaWQpIHtcbiAgICAgICAgICB0aGlzLiNleGVjUHJvbWlzZShwa3QuY3RybC5pZCwgcGt0LmN0cmwuY29kZSwgcGt0LmN0cmwsIHBrdC5jdHJsLnRleHQpO1xuICAgICAgICB9XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIGlmIChwa3QuY3RybC5jb2RlID09IDIwNSAmJiBwa3QuY3RybC50ZXh0ID09ICdldmljdGVkJykge1xuICAgICAgICAgICAgLy8gVXNlciBldmljdGVkIGZyb20gdG9waWMuXG4gICAgICAgICAgICBjb25zdCB0b3BpYyA9IHRoaXMuI2NhY2hlR2V0KCd0b3BpYycsIHBrdC5jdHJsLnRvcGljKTtcbiAgICAgICAgICAgIGlmICh0b3BpYykge1xuICAgICAgICAgICAgICB0b3BpYy5fcmVzZXRTdWIoKTtcbiAgICAgICAgICAgICAgaWYgKHBrdC5jdHJsLnBhcmFtcyAmJiBwa3QuY3RybC5wYXJhbXMudW5zdWIpIHtcbiAgICAgICAgICAgICAgICB0b3BpYy5fZ29uZSgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChwa3QuY3RybC5jb2RlIDwgMzAwICYmIHBrdC5jdHJsLnBhcmFtcykge1xuICAgICAgICAgICAgaWYgKHBrdC5jdHJsLnBhcmFtcy53aGF0ID09ICdkYXRhJykge1xuICAgICAgICAgICAgICAvLyBjb2RlPTIwOCwgYWxsIG1lc3NhZ2VzIHJlY2VpdmVkOiBcInBhcmFtc1wiOntcImNvdW50XCI6MTEsXCJ3aGF0XCI6XCJkYXRhXCJ9LFxuICAgICAgICAgICAgICBjb25zdCB0b3BpYyA9IHRoaXMuI2NhY2hlR2V0KCd0b3BpYycsIHBrdC5jdHJsLnRvcGljKTtcbiAgICAgICAgICAgICAgaWYgKHRvcGljKSB7XG4gICAgICAgICAgICAgICAgdG9waWMuX2FsbE1lc3NhZ2VzUmVjZWl2ZWQocGt0LmN0cmwucGFyYW1zLmNvdW50KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChwa3QuY3RybC5wYXJhbXMud2hhdCA9PSAnc3ViJykge1xuICAgICAgICAgICAgICAvLyBjb2RlPTIwNCwgdGhlIHRvcGljIGhhcyBubyAocmVmcmVzaGVkKSBzdWJzY3JpcHRpb25zLlxuICAgICAgICAgICAgICBjb25zdCB0b3BpYyA9IHRoaXMuI2NhY2hlR2V0KCd0b3BpYycsIHBrdC5jdHJsLnRvcGljKTtcbiAgICAgICAgICAgICAgaWYgKHRvcGljKSB7XG4gICAgICAgICAgICAgICAgLy8gVHJpZ2dlciB0b3BpYy5vblN1YnNVcGRhdGVkLlxuICAgICAgICAgICAgICAgIHRvcGljLl9wcm9jZXNzTWV0YVN1YihbXSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sIDApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgaWYgKHBrdC5tZXRhKSB7XG4gICAgICAgICAgICAvLyBIYW5kbGluZyBhIHttZXRhfSBtZXNzYWdlLlxuICAgICAgICAgICAgLy8gUHJlZmVycmVkIEFQSTogUm91dGUgbWV0YSB0byB0b3BpYywgaWYgb25lIGlzIHJlZ2lzdGVyZWRcbiAgICAgICAgICAgIGNvbnN0IHRvcGljID0gdGhpcy4jY2FjaGVHZXQoJ3RvcGljJywgcGt0Lm1ldGEudG9waWMpO1xuICAgICAgICAgICAgaWYgKHRvcGljKSB7XG4gICAgICAgICAgICAgIHRvcGljLl9yb3V0ZU1ldGEocGt0Lm1ldGEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocGt0Lm1ldGEuaWQpIHtcbiAgICAgICAgICAgICAgdGhpcy4jZXhlY1Byb21pc2UocGt0Lm1ldGEuaWQsIDIwMCwgcGt0Lm1ldGEsICdNRVRBJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFNlY29uZGFyeSBBUEk6IGNhbGxiYWNrXG4gICAgICAgICAgICBpZiAodGhpcy5vbk1ldGFNZXNzYWdlKSB7XG4gICAgICAgICAgICAgIHRoaXMub25NZXRhTWVzc2FnZShwa3QubWV0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChwa3QuZGF0YSkge1xuICAgICAgICAgICAgLy8gSGFuZGxpbmcge2RhdGF9IG1lc3NhZ2VcbiAgICAgICAgICAgIC8vIFByZWZlcnJlZCBBUEk6IFJvdXRlIGRhdGEgdG8gdG9waWMsIGlmIG9uZSBpcyByZWdpc3RlcmVkXG4gICAgICAgICAgICBjb25zdCB0b3BpYyA9IHRoaXMuI2NhY2hlR2V0KCd0b3BpYycsIHBrdC5kYXRhLnRvcGljKTtcbiAgICAgICAgICAgIGlmICh0b3BpYykge1xuICAgICAgICAgICAgICB0b3BpYy5fcm91dGVEYXRhKHBrdC5kYXRhKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gU2Vjb25kYXJ5IEFQSTogQ2FsbCBjYWxsYmFja1xuICAgICAgICAgICAgaWYgKHRoaXMub25EYXRhTWVzc2FnZSkge1xuICAgICAgICAgICAgICB0aGlzLm9uRGF0YU1lc3NhZ2UocGt0LmRhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAocGt0LnByZXMpIHtcbiAgICAgICAgICAgIC8vIEhhbmRsaW5nIHtwcmVzfSBtZXNzYWdlXG4gICAgICAgICAgICAvLyBQcmVmZXJyZWQgQVBJOiBSb3V0ZSBwcmVzZW5jZSB0byB0b3BpYywgaWYgb25lIGlzIHJlZ2lzdGVyZWRcbiAgICAgICAgICAgIGNvbnN0IHRvcGljID0gdGhpcy4jY2FjaGVHZXQoJ3RvcGljJywgcGt0LnByZXMudG9waWMpO1xuICAgICAgICAgICAgaWYgKHRvcGljKSB7XG4gICAgICAgICAgICAgIHRvcGljLl9yb3V0ZVByZXMocGt0LnByZXMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBTZWNvbmRhcnkgQVBJIC0gY2FsbGJhY2tcbiAgICAgICAgICAgIGlmICh0aGlzLm9uUHJlc01lc3NhZ2UpIHtcbiAgICAgICAgICAgICAgdGhpcy5vblByZXNNZXNzYWdlKHBrdC5wcmVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKHBrdC5pbmZvKSB7XG4gICAgICAgICAgICAvLyB7aW5mb30gbWVzc2FnZSAtIHJlYWQvcmVjZWl2ZWQgbm90aWZpY2F0aW9ucyBhbmQga2V5IHByZXNzZXNcbiAgICAgICAgICAgIC8vIFByZWZlcnJlZCBBUEk6IFJvdXRlIHtpbmZvfX0gdG8gdG9waWMsIGlmIG9uZSBpcyByZWdpc3RlcmVkXG4gICAgICAgICAgICBjb25zdCB0b3BpYyA9IHRoaXMuI2NhY2hlR2V0KCd0b3BpYycsIHBrdC5pbmZvLnRvcGljKTtcbiAgICAgICAgICAgIGlmICh0b3BpYykge1xuICAgICAgICAgICAgICB0b3BpYy5fcm91dGVJbmZvKHBrdC5pbmZvKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gU2Vjb25kYXJ5IEFQSSAtIGNhbGxiYWNrXG4gICAgICAgICAgICBpZiAodGhpcy5vbkluZm9NZXNzYWdlKSB7XG4gICAgICAgICAgICAgIHRoaXMub25JbmZvTWVzc2FnZShwa3QuaW5mbyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyKFwiRVJST1I6IFVua25vd24gcGFja2V0IHJlY2VpdmVkLlwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIDApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIENvbm5lY3Rpb24gb3BlbiwgcmVhZHkgdG8gc3RhcnQgc2VuZGluZy5cbiAgI2Nvbm5lY3Rpb25PcGVuKCkge1xuICAgIGlmICghdGhpcy5fZXhwaXJlUHJvbWlzZXMpIHtcbiAgICAgIC8vIFJlamVjdCBwcm9taXNlcyB3aGljaCBoYXZlIG5vdCBiZWVuIHJlc29sdmVkIGZvciB0b28gbG9uZy5cbiAgICAgIHRoaXMuX2V4cGlyZVByb21pc2VzID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICBjb25zdCBlcnIgPSBuZXcgRXJyb3IoXCJUaW1lb3V0ICg1MDQpXCIpO1xuICAgICAgICBjb25zdCBleHBpcmVzID0gbmV3IERhdGUobmV3IERhdGUoKS5nZXRUaW1lKCkgLSBDb25zdC5FWFBJUkVfUFJPTUlTRVNfVElNRU9VVCk7XG4gICAgICAgIGZvciAobGV0IGlkIGluIHRoaXMuX3BlbmRpbmdQcm9taXNlcykge1xuICAgICAgICAgIGxldCBjYWxsYmFja3MgPSB0aGlzLl9wZW5kaW5nUHJvbWlzZXNbaWRdO1xuICAgICAgICAgIGlmIChjYWxsYmFja3MgJiYgY2FsbGJhY2tzLnRzIDwgZXhwaXJlcykge1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIoXCJQcm9taXNlIGV4cGlyZWRcIiwgaWQpO1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMuX3BlbmRpbmdQcm9taXNlc1tpZF07XG4gICAgICAgICAgICBpZiAoY2FsbGJhY2tzLnJlamVjdCkge1xuICAgICAgICAgICAgICBjYWxsYmFja3MucmVqZWN0KGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LCBDb25zdC5FWFBJUkVfUFJPTUlTRVNfUEVSSU9EKTtcbiAgICB9XG4gICAgdGhpcy5oZWxsbygpO1xuICB9XG5cbiAgI2Rpc2Nvbm5lY3RlZChlcnIsIGNvZGUpIHtcbiAgICB0aGlzLl9pblBhY2tldENvdW50ID0gMDtcbiAgICB0aGlzLl9zZXJ2ZXJJbmZvID0gbnVsbDtcbiAgICB0aGlzLl9hdXRoZW50aWNhdGVkID0gZmFsc2U7XG5cbiAgICBpZiAodGhpcy5fZXhwaXJlUHJvbWlzZXMpIHtcbiAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5fZXhwaXJlUHJvbWlzZXMpO1xuICAgICAgdGhpcy5fZXhwaXJlUHJvbWlzZXMgPSBudWxsO1xuICAgIH1cblxuICAgIC8vIE1hcmsgYWxsIHRvcGljcyBhcyB1bnN1YnNjcmliZWRcbiAgICB0aGlzLiNjYWNoZU1hcCgndG9waWMnLCAodG9waWMsIGtleSkgPT4ge1xuICAgICAgdG9waWMuX3Jlc2V0U3ViKCk7XG4gICAgfSk7XG5cbiAgICAvLyBSZWplY3QgYWxsIHBlbmRpbmcgcHJvbWlzZXNcbiAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5fcGVuZGluZ1Byb21pc2VzKSB7XG4gICAgICBjb25zdCBjYWxsYmFja3MgPSB0aGlzLl9wZW5kaW5nUHJvbWlzZXNba2V5XTtcbiAgICAgIGlmIChjYWxsYmFja3MgJiYgY2FsbGJhY2tzLnJlamVjdCkge1xuICAgICAgICBjYWxsYmFja3MucmVqZWN0KGVycik7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuX3BlbmRpbmdQcm9taXNlcyA9IHt9O1xuXG4gICAgaWYgKHRoaXMub25EaXNjb25uZWN0KSB7XG4gICAgICB0aGlzLm9uRGlzY29ubmVjdChlcnIpO1xuICAgIH1cbiAgfVxuXG4gIC8vIEdldCBVc2VyIEFnZW50IHN0cmluZ1xuICAjZ2V0VXNlckFnZW50KCkge1xuICAgIHJldHVybiB0aGlzLl9hcHBOYW1lICsgJyAoJyArICh0aGlzLl9icm93c2VyID8gdGhpcy5fYnJvd3NlciArICc7ICcgOiAnJykgKyB0aGlzLl9od29zICsgJyk7ICcgKyBDb25zdC5MSUJSQVJZO1xuICB9XG5cbiAgLy8gR2VuZXJhdG9yIG9mIHBhY2tldHMgc3R1YnNcbiAgI2luaXRQYWNrZXQodHlwZSwgdG9waWMpIHtcbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgIGNhc2UgJ2hpJzpcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAnaGknOiB7XG4gICAgICAgICAgICAnaWQnOiB0aGlzLmdldE5leHRVbmlxdWVJZCgpLFxuICAgICAgICAgICAgJ3Zlcic6IENvbnN0LlZFUlNJT04sXG4gICAgICAgICAgICAndWEnOiB0aGlzLiNnZXRVc2VyQWdlbnQoKSxcbiAgICAgICAgICAgICdkZXYnOiB0aGlzLl9kZXZpY2VUb2tlbixcbiAgICAgICAgICAgICdsYW5nJzogdGhpcy5faHVtYW5MYW5ndWFnZSxcbiAgICAgICAgICAgICdwbGF0Zic6IHRoaXMuX3BsYXRmb3JtXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICBjYXNlICdhY2MnOlxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICdhY2MnOiB7XG4gICAgICAgICAgICAnaWQnOiB0aGlzLmdldE5leHRVbmlxdWVJZCgpLFxuICAgICAgICAgICAgJ3VzZXInOiBudWxsLFxuICAgICAgICAgICAgJ3NjaGVtZSc6IG51bGwsXG4gICAgICAgICAgICAnc2VjcmV0JzogbnVsbCxcbiAgICAgICAgICAgICdsb2dpbic6IGZhbHNlLFxuICAgICAgICAgICAgJ3RhZ3MnOiBudWxsLFxuICAgICAgICAgICAgJ2Rlc2MnOiB7fSxcbiAgICAgICAgICAgICdjcmVkJzoge31cbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgIGNhc2UgJ2xvZ2luJzpcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAnbG9naW4nOiB7XG4gICAgICAgICAgICAnaWQnOiB0aGlzLmdldE5leHRVbmlxdWVJZCgpLFxuICAgICAgICAgICAgJ3NjaGVtZSc6IG51bGwsXG4gICAgICAgICAgICAnc2VjcmV0JzogbnVsbFxuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgY2FzZSAnc3ViJzpcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAnc3ViJzoge1xuICAgICAgICAgICAgJ2lkJzogdGhpcy5nZXROZXh0VW5pcXVlSWQoKSxcbiAgICAgICAgICAgICd0b3BpYyc6IHRvcGljLFxuICAgICAgICAgICAgJ3NldCc6IHt9LFxuICAgICAgICAgICAgJ2dldCc6IHt9XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICBjYXNlICdsZWF2ZSc6XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgJ2xlYXZlJzoge1xuICAgICAgICAgICAgJ2lkJzogdGhpcy5nZXROZXh0VW5pcXVlSWQoKSxcbiAgICAgICAgICAgICd0b3BpYyc6IHRvcGljLFxuICAgICAgICAgICAgJ3Vuc3ViJzogZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgIGNhc2UgJ3B1Yic6XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgJ3B1Yic6IHtcbiAgICAgICAgICAgICdpZCc6IHRoaXMuZ2V0TmV4dFVuaXF1ZUlkKCksXG4gICAgICAgICAgICAndG9waWMnOiB0b3BpYyxcbiAgICAgICAgICAgICdub2VjaG8nOiBmYWxzZSxcbiAgICAgICAgICAgICdoZWFkJzogbnVsbCxcbiAgICAgICAgICAgICdjb250ZW50Jzoge31cbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgIGNhc2UgJ2dldCc6XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgJ2dldCc6IHtcbiAgICAgICAgICAgICdpZCc6IHRoaXMuZ2V0TmV4dFVuaXF1ZUlkKCksXG4gICAgICAgICAgICAndG9waWMnOiB0b3BpYyxcbiAgICAgICAgICAgICd3aGF0JzogbnVsbCxcbiAgICAgICAgICAgICdkZXNjJzoge30sXG4gICAgICAgICAgICAnc3ViJzoge30sXG4gICAgICAgICAgICAnZGF0YSc6IHt9XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICBjYXNlICdzZXQnOlxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICdzZXQnOiB7XG4gICAgICAgICAgICAnaWQnOiB0aGlzLmdldE5leHRVbmlxdWVJZCgpLFxuICAgICAgICAgICAgJ3RvcGljJzogdG9waWMsXG4gICAgICAgICAgICAnZGVzYyc6IHt9LFxuICAgICAgICAgICAgJ3N1Yic6IHt9LFxuICAgICAgICAgICAgJ3RhZ3MnOiBbXSxcbiAgICAgICAgICAgICdlcGhlbWVyYWwnOiB7fVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgY2FzZSAnZGVsJzpcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAnZGVsJzoge1xuICAgICAgICAgICAgJ2lkJzogdGhpcy5nZXROZXh0VW5pcXVlSWQoKSxcbiAgICAgICAgICAgICd0b3BpYyc6IHRvcGljLFxuICAgICAgICAgICAgJ3doYXQnOiBudWxsLFxuICAgICAgICAgICAgJ2RlbHNlcSc6IG51bGwsXG4gICAgICAgICAgICAndXNlcic6IG51bGwsXG4gICAgICAgICAgICAnaGFyZCc6IGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICBjYXNlICdub3RlJzpcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAnbm90ZSc6IHtcbiAgICAgICAgICAgIC8vIG5vIGlkIGJ5IGRlc2lnbiAoZXhjZXB0IGNhbGxzKS5cbiAgICAgICAgICAgICd0b3BpYyc6IHRvcGljLFxuICAgICAgICAgICAgJ3doYXQnOiBudWxsLCAvLyBvbmUgb2YgXCJyZWN2XCIsIFwicmVhZFwiLCBcImtwXCIsIFwiY2FsbFwiXG4gICAgICAgICAgICAnc2VxJzogdW5kZWZpbmVkIC8vIHRoZSBzZXJ2ZXItc2lkZSBtZXNzYWdlIGlkIGFja25vd2xlZGdlZCBhcyByZWNlaXZlZCBvciByZWFkLlxuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmtub3duIHBhY2tldCB0eXBlIHJlcXVlc3RlZDogJHt0eXBlfWApO1xuICAgIH1cbiAgfVxuXG4gIC8vIENhY2hlIG1hbmFnZW1lbnRcbiAgI2NhY2hlUHV0KHR5cGUsIG5hbWUsIG9iaikge1xuICAgIHRoaXMuX2NhY2hlW3R5cGUgKyAnOicgKyBuYW1lXSA9IG9iajtcbiAgfVxuICAjY2FjaGVHZXQodHlwZSwgbmFtZSkge1xuICAgIHJldHVybiB0aGlzLl9jYWNoZVt0eXBlICsgJzonICsgbmFtZV07XG4gIH1cbiAgI2NhY2hlRGVsKHR5cGUsIG5hbWUpIHtcbiAgICBkZWxldGUgdGhpcy5fY2FjaGVbdHlwZSArICc6JyArIG5hbWVdO1xuICB9XG5cbiAgLy8gRW51bWVyYXRlIGFsbCBpdGVtcyBpbiBjYWNoZSwgY2FsbCBmdW5jIGZvciBlYWNoIGl0ZW0uXG4gIC8vIEVudW1lcmF0aW9uIHN0b3BzIGlmIGZ1bmMgcmV0dXJucyB0cnVlLlxuICAjY2FjaGVNYXAodHlwZSwgZnVuYywgY29udGV4dCkge1xuICAgIGNvbnN0IGtleSA9IHR5cGUgPyB0eXBlICsgJzonIDogdW5kZWZpbmVkO1xuICAgIGZvciAobGV0IGlkeCBpbiB0aGlzLl9jYWNoZSkge1xuICAgICAgaWYgKCFrZXkgfHwgaWR4LmluZGV4T2Yoa2V5KSA9PSAwKSB7XG4gICAgICAgIGlmIChmdW5jLmNhbGwoY29udGV4dCwgdGhpcy5fY2FjaGVbaWR4XSwgaWR4KSkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gTWFrZSBsaW1pdGVkIGNhY2hlIG1hbmFnZW1lbnQgYXZhaWxhYmxlIHRvIHRvcGljLlxuICAvLyBDYWNoaW5nIHVzZXIucHVibGljIG9ubHkuIEV2ZXJ5dGhpbmcgZWxzZSBpcyBwZXItdG9waWMuXG4gICNhdHRhY2hDYWNoZVRvVG9waWModG9waWMpIHtcbiAgICB0b3BpYy5fdGlub2RlID0gdGhpcztcblxuICAgIHRvcGljLl9jYWNoZUdldFVzZXIgPSAodWlkKSA9PiB7XG4gICAgICBjb25zdCBwdWIgPSB0aGlzLiNjYWNoZUdldCgndXNlcicsIHVpZCk7XG4gICAgICBpZiAocHViKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdXNlcjogdWlkLFxuICAgICAgICAgIHB1YmxpYzogbWVyZ2VPYmooe30sIHB1YilcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfTtcbiAgICB0b3BpYy5fY2FjaGVQdXRVc2VyID0gKHVpZCwgdXNlcikgPT4ge1xuICAgICAgdGhpcy4jY2FjaGVQdXQoJ3VzZXInLCB1aWQsIG1lcmdlT2JqKHt9LCB1c2VyLnB1YmxpYykpO1xuICAgIH07XG4gICAgdG9waWMuX2NhY2hlRGVsVXNlciA9ICh1aWQpID0+IHtcbiAgICAgIHRoaXMuI2NhY2hlRGVsKCd1c2VyJywgdWlkKTtcbiAgICB9O1xuICAgIHRvcGljLl9jYWNoZVB1dFNlbGYgPSBfID0+IHtcbiAgICAgIHRoaXMuI2NhY2hlUHV0KCd0b3BpYycsIHRvcGljLm5hbWUsIHRvcGljKTtcbiAgICB9O1xuICAgIHRvcGljLl9jYWNoZURlbFNlbGYgPSBfID0+IHtcbiAgICAgIHRoaXMuI2NhY2hlRGVsKCd0b3BpYycsIHRvcGljLm5hbWUpO1xuICAgIH07XG4gIH1cblxuICAvLyBPbiBzdWNjZXNzZnVsIGxvZ2luIHNhdmUgc2VydmVyLXByb3ZpZGVkIGRhdGEuXG4gICNsb2dpblN1Y2Nlc3NmdWwoY3RybCkge1xuICAgIGlmICghY3RybC5wYXJhbXMgfHwgIWN0cmwucGFyYW1zLnVzZXIpIHtcbiAgICAgIHJldHVybiBjdHJsO1xuICAgIH1cbiAgICAvLyBUaGlzIGlzIGEgcmVzcG9uc2UgdG8gYSBzdWNjZXNzZnVsIGxvZ2luLFxuICAgIC8vIGV4dHJhY3QgVUlEIGFuZCBzZWN1cml0eSB0b2tlbiwgc2F2ZSBpdCBpbiBUaW5vZGUgbW9kdWxlXG4gICAgdGhpcy5fbXlVSUQgPSBjdHJsLnBhcmFtcy51c2VyO1xuICAgIHRoaXMuX2F1dGhlbnRpY2F0ZWQgPSAoY3RybCAmJiBjdHJsLmNvZGUgPj0gMjAwICYmIGN0cmwuY29kZSA8IDMwMCk7XG4gICAgaWYgKGN0cmwucGFyYW1zICYmIGN0cmwucGFyYW1zLnRva2VuICYmIGN0cmwucGFyYW1zLmV4cGlyZXMpIHtcbiAgICAgIHRoaXMuX2F1dGhUb2tlbiA9IHtcbiAgICAgICAgdG9rZW46IGN0cmwucGFyYW1zLnRva2VuLFxuICAgICAgICBleHBpcmVzOiBjdHJsLnBhcmFtcy5leHBpcmVzXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9hdXRoVG9rZW4gPSBudWxsO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm9uTG9naW4pIHtcbiAgICAgIHRoaXMub25Mb2dpbihjdHJsLmNvZGUsIGN0cmwudGV4dCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGN0cmw7XG4gIH1cblxuICAvLyBTdGF0aWMgbWV0aG9kcy5cbiAgLyoqXG4gICAqIEhlbHBlciBtZXRob2QgdG8gcGFja2FnZSBhY2NvdW50IGNyZWRlbnRpYWwuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZyB8IENyZWRlbnRpYWx9IG1ldGggLSB2YWxpZGF0aW9uIG1ldGhvZCBvciBvYmplY3Qgd2l0aCB2YWxpZGF0aW9uIGRhdGEuXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gdmFsIC0gdmFsaWRhdGlvbiB2YWx1ZSAoZS5nLiBlbWFpbCBvciBwaG9uZSBudW1iZXIpLlxuICAgKiBAcGFyYW0ge09iamVjdD19IHBhcmFtcyAtIHZhbGlkYXRpb24gcGFyYW1ldGVycy5cbiAgICogQHBhcmFtIHtzdHJpbmc9fSByZXNwIC0gdmFsaWRhdGlvbiByZXNwb25zZS5cbiAgICpcbiAgICogQHJldHVybnMge0FycmF5LjxDcmVkZW50aWFsPn0gYXJyYXkgd2l0aCBhIHNpbmdsZSBjcmVkZW50aWFsIG9yIDxjb2RlPm51bGw8L2NvZGU+IGlmIG5vIHZhbGlkIGNyZWRlbnRpYWxzIHdlcmUgZ2l2ZW4uXG4gICAqL1xuICBzdGF0aWMgY3JlZGVudGlhbChtZXRoLCB2YWwsIHBhcmFtcywgcmVzcCkge1xuICAgIGlmICh0eXBlb2YgbWV0aCA9PSAnb2JqZWN0Jykge1xuICAgICAgKHtcbiAgICAgICAgdmFsLFxuICAgICAgICBwYXJhbXMsXG4gICAgICAgIHJlc3AsXG4gICAgICAgIG1ldGhcbiAgICAgIH0gPSBtZXRoKTtcbiAgICB9XG4gICAgaWYgKG1ldGggJiYgKHZhbCB8fCByZXNwKSkge1xuICAgICAgcmV0dXJuIFt7XG4gICAgICAgICdtZXRoJzogbWV0aCxcbiAgICAgICAgJ3ZhbCc6IHZhbCxcbiAgICAgICAgJ3Jlc3AnOiByZXNwLFxuICAgICAgICAncGFyYW1zJzogcGFyYW1zXG4gICAgICB9XTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lIHRvcGljIHR5cGUgZnJvbSB0b3BpYydzIG5hbWU6IGdycCwgcDJwLCBtZSwgZm5kLCBzeXMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIHRlc3QuXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IE9uZSBvZiA8Y29kZT5cIm1lXCI8L2NvZGU+LCA8Y29kZT5cImZuZFwiPC9jb2RlPiwgPGNvZGU+XCJzeXNcIjwvY29kZT4sIDxjb2RlPlwiZ3JwXCI8L2NvZGU+LFxuICAgKiAgICA8Y29kZT5cInAycFwiPC9jb2RlPiBvciA8Y29kZT51bmRlZmluZWQ8L2NvZGU+LlxuICAgKi9cbiAgc3RhdGljIHRvcGljVHlwZShuYW1lKSB7XG4gICAgcmV0dXJuIFRvcGljLnRvcGljVHlwZShuYW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgZ2l2ZW4gdG9waWMgbmFtZSBpcyBhIG5hbWUgb2YgYSAnbWUnIHRvcGljLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byB0ZXN0LlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgdGhlIG5hbWUgaXMgYSBuYW1lIG9mIGEgJ21lJyB0b3BpYywgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIHN0YXRpYyBpc01lVG9waWNOYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gVG9waWMuaXNNZVRvcGljTmFtZShuYW1lKTtcbiAgfVxuICAvKipcbiAgICogQ2hlY2sgaWYgdGhlIGdpdmVuIHRvcGljIG5hbWUgaXMgYSBuYW1lIG9mIGEgZ3JvdXAgdG9waWMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIHRlc3QuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0aGUgbmFtZSBpcyBhIG5hbWUgb2YgYSBncm91cCB0b3BpYywgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIHN0YXRpYyBpc0dyb3VwVG9waWNOYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gVG9waWMuaXNHcm91cFRvcGljTmFtZShuYW1lKTtcbiAgfVxuICAvKipcbiAgICogQ2hlY2sgaWYgdGhlIGdpdmVuIHRvcGljIG5hbWUgaXMgYSBuYW1lIG9mIGEgcDJwIHRvcGljLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byB0ZXN0LlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgdGhlIG5hbWUgaXMgYSBuYW1lIG9mIGEgcDJwIHRvcGljLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgc3RhdGljIGlzUDJQVG9waWNOYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gVG9waWMuaXNQMlBUb3BpY05hbWUobmFtZSk7XG4gIH1cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSBnaXZlbiB0b3BpYyBuYW1lIGlzIGEgbmFtZSBvZiBhIGNvbW11bmljYXRpb24gdG9waWMsIGkuZS4gUDJQIG9yIGdyb3VwLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byB0ZXN0LlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgdGhlIG5hbWUgaXMgYSBuYW1lIG9mIGEgcDJwIG9yIGdyb3VwIHRvcGljLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgc3RhdGljIGlzQ29tbVRvcGljTmFtZShuYW1lKSB7XG4gICAgcmV0dXJuIFRvcGljLmlzQ29tbVRvcGljTmFtZShuYW1lKTtcbiAgfVxuICAvKipcbiAgICogQ2hlY2sgaWYgdGhlIHRvcGljIG5hbWUgaXMgYSBuYW1lIG9mIGEgbmV3IHRvcGljLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSB0b3BpYyBuYW1lIHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgdGhlIG5hbWUgaXMgYSBuYW1lIG9mIGEgbmV3IHRvcGljLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgc3RhdGljIGlzTmV3R3JvdXBUb3BpY05hbWUobmFtZSkge1xuICAgIHJldHVybiBUb3BpYy5pc05ld0dyb3VwVG9waWNOYW1lKG5hbWUpO1xuICB9XG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgdG9waWMgbmFtZSBpcyBhIG5hbWUgb2YgYSBjaGFubmVsLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSB0b3BpYyBuYW1lIHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgdGhlIG5hbWUgaXMgYSBuYW1lIG9mIGEgY2hhbm5lbCwgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIHN0YXRpYyBpc0NoYW5uZWxUb3BpY05hbWUobmFtZSkge1xuICAgIHJldHVybiBUb3BpYy5pc0NoYW5uZWxUb3BpY05hbWUobmFtZSk7XG4gIH1cbiAgLyoqXG4gICAqIFJldHVybiBpbmZvcm1hdGlvbiBhYm91dCB0aGUgY3VycmVudCB2ZXJzaW9uIG9mIHRoaXMgVGlub2RlIGNsaWVudCBsaWJyYXJ5LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHJldHVybnMge3N0cmluZ30gc2VtYW50aWMgdmVyc2lvbiBvZiB0aGUgbGlicmFyeSwgZS5nLiA8Y29kZT5cIjAuMTUuNS1yYzFcIjwvY29kZT4uXG4gICAqL1xuICBzdGF0aWMgZ2V0VmVyc2lvbigpIHtcbiAgICByZXR1cm4gQ29uc3QuVkVSU0lPTjtcbiAgfVxuICAvKipcbiAgICogVG8gdXNlIFRpbm9kZSBpbiBhIG5vbiBicm93c2VyIGNvbnRleHQsIHN1cHBseSBXZWJTb2NrZXQgYW5kIFhNTEh0dHBSZXF1ZXN0IHByb3ZpZGVycy5cbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBwYXJhbSB3c1Byb3ZpZGVyIDxjb2RlPldlYlNvY2tldDwvY29kZT4gcHJvdmlkZXIsIGUuZy4gZm9yIG5vZGVKUyAsIDxjb2RlPnJlcXVpcmUoJ3dzJyk8L2NvZGU+LlxuICAgKiBAcGFyYW0geGhyUHJvdmlkZXIgPGNvZGU+WE1MSHR0cFJlcXVlc3Q8L2NvZGU+IHByb3ZpZGVyLCBlLmcuIGZvciBub2RlIDxjb2RlPnJlcXVpcmUoJ3hocicpPC9jb2RlPi5cbiAgICovXG4gIHN0YXRpYyBzZXROZXR3b3JrUHJvdmlkZXJzKHdzUHJvdmlkZXIsIHhoclByb3ZpZGVyKSB7XG4gICAgV2ViU29ja2V0UHJvdmlkZXIgPSB3c1Byb3ZpZGVyO1xuICAgIFhIUlByb3ZpZGVyID0geGhyUHJvdmlkZXI7XG5cbiAgICBDb25uZWN0aW9uLnNldE5ldHdvcmtQcm92aWRlcnMoV2ViU29ja2V0UHJvdmlkZXIsIFhIUlByb3ZpZGVyKTtcbiAgICBMYXJnZUZpbGVIZWxwZXIuc2V0TmV0d29ya1Byb3ZpZGVyKFhIUlByb3ZpZGVyKTtcbiAgfVxuICAvKipcbiAgICogVG8gdXNlIFRpbm9kZSBpbiBhIG5vbiBicm93c2VyIGNvbnRleHQsIHN1cHBseSA8Y29kZT5pbmRleGVkREI8L2NvZGU+IHByb3ZpZGVyLlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQHBhcmFtIGlkYlByb3ZpZGVyIDxjb2RlPmluZGV4ZWREQjwvY29kZT4gcHJvdmlkZXIsIGUuZy4gZm9yIG5vZGVKUyAsIDxjb2RlPnJlcXVpcmUoJ2Zha2UtaW5kZXhlZGRiJyk8L2NvZGU+LlxuICAgKi9cbiAgc3RhdGljIHNldERhdGFiYXNlUHJvdmlkZXIoaWRiUHJvdmlkZXIpIHtcbiAgICBJbmRleGVkREJQcm92aWRlciA9IGlkYlByb3ZpZGVyO1xuXG4gICAgREJDYWNoZS5zZXREYXRhYmFzZVByb3ZpZGVyKEluZGV4ZWREQlByb3ZpZGVyKTtcbiAgfVxuICAvKipcbiAgICogUmV0dXJuIGluZm9ybWF0aW9uIGFib3V0IHRoZSBjdXJyZW50IG5hbWUgYW5kIHZlcnNpb24gb2YgdGhpcyBUaW5vZGUgbGlicmFyeS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IHRoZSBuYW1lIG9mIHRoZSBsaWJyYXJ5IGFuZCBpdCdzIHZlcnNpb24uXG4gICAqL1xuICBzdGF0aWMgZ2V0TGlicmFyeSgpIHtcbiAgICByZXR1cm4gQ29uc3QuTElCUkFSWTtcbiAgfVxuICAvKipcbiAgICogQ2hlY2sgaWYgdGhlIGdpdmVuIHN0cmluZyByZXByZXNlbnRzIDxjb2RlPk5VTEw8L2NvZGU+IHZhbHVlIGFzIGRlZmluZWQgYnkgVGlub2RlICg8Y29kZT4nXFx1MjQyMSc8L2NvZGU+KS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHIgLSBzdHJpbmcgdG8gY2hlY2sgZm9yIDxjb2RlPk5VTEw8L2NvZGU+IHZhbHVlLlxuICAgKlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgc3RyaW5nIHJlcHJlc2VudHMgPGNvZGU+TlVMTDwvY29kZT4gdmFsdWUsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBzdGF0aWMgaXNOdWxsVmFsdWUoc3RyKSB7XG4gICAgcmV0dXJuIHN0ciA9PT0gQ29uc3QuREVMX0NIQVI7XG4gIH1cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSBnaXZlbiBVUkwgc3RyaW5nIGlzIGEgcmVsYXRpdmUgVVJMLlxuICAgKiBDaGVjayBmb3IgY2FzZXMgbGlrZTpcbiAgICogIDxjb2RlPidodHRwOi8vZXhhbXBsZS5jb20nPC9jb2RlPlxuICAgKiAgPGNvZGU+JyBodHRwOi8vZXhhbXBsZS5jb20nPC9jb2RlPlxuICAgKiAgPGNvZGU+Jy8vZXhhbXBsZS5jb20vJzwvY29kZT5cbiAgICogIDxjb2RlPidodHRwOmV4YW1wbGUuY29tJzwvY29kZT5cbiAgICogIDxjb2RlPidodHRwOi9leGFtcGxlLmNvbSc8L2NvZGU+XG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdXJsIC0gVVJMIHN0cmluZyB0byBjaGVjay5cbiAgICpcbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIHRoZSBVUkwgaXMgcmVsYXRpdmUsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBzdGF0aWMgaXNSZWxhdGl2ZVVSTCh1cmwpIHtcbiAgICByZXR1cm4gIS9eXFxzKihbYS16XVthLXowLTkrLi1dKjp8XFwvXFwvKS9pbS50ZXN0KHVybCk7XG4gIH1cblxuICAvLyBJbnN0YW5jZSBtZXRob2RzLlxuXG4gIC8vIEdlbmVyYXRlcyB1bmlxdWUgbWVzc2FnZSBJRHNcbiAgZ2V0TmV4dFVuaXF1ZUlkKCkge1xuICAgIHJldHVybiAodGhpcy5fbWVzc2FnZUlkICE9IDApID8gJycgKyB0aGlzLl9tZXNzYWdlSWQrKyA6IHVuZGVmaW5lZDtcbiAgfTtcblxuICAvKipcbiAgICogQ29ubmVjdCB0byB0aGUgc2VydmVyLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gaG9zdF8gLSBuYW1lIG9mIHRoZSBob3N0IHRvIGNvbm5lY3QgdG8uXG4gICAqXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IFByb21pc2UgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgY29ubmVjdGlvbiBjYWxsIGNvbXBsZXRlczpcbiAgICogICAgPGNvZGU+cmVzb2x2ZSgpPC9jb2RlPiBpcyBjYWxsZWQgd2l0aG91dCBwYXJhbWV0ZXJzLCA8Y29kZT5yZWplY3QoKTwvY29kZT4gcmVjZWl2ZXMgdGhlXG4gICAqICAgIDxjb2RlPkVycm9yPC9jb2RlPiBhcyBhIHNpbmdsZSBwYXJhbWV0ZXIuXG4gICAqL1xuICBjb25uZWN0KGhvc3RfKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Nvbm5lY3Rpb24uY29ubmVjdChob3N0Xyk7XG4gIH1cblxuICAvKipcbiAgICogQXR0ZW1wdCB0byByZWNvbm5lY3QgdG8gdGhlIHNlcnZlciBpbW1lZGlhdGVseS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGZvcmNlIC0gcmVjb25uZWN0IGV2ZW4gaWYgdGhlcmUgaXMgYSBjb25uZWN0aW9uIGFscmVhZHkuXG4gICAqL1xuICByZWNvbm5lY3QoZm9yY2UpIHtcbiAgICB0aGlzLl9jb25uZWN0aW9uLnJlY29ubmVjdChmb3JjZSk7XG4gIH1cblxuICAvKipcbiAgICogRGlzY29ubmVjdCBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqL1xuICBkaXNjb25uZWN0KCkge1xuICAgIHRoaXMuX2Nvbm5lY3Rpb24uZGlzY29ubmVjdCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIENsZWFyIHBlcnNpc3RlbnQgY2FjaGU6IHJlbW92ZSBJbmRleGVkREIuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IFByb21pc2UgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgb3BlcmF0aW9uIGlzIGNvbXBsZXRlZC5cbiAgICovXG4gIGNsZWFyU3RvcmFnZSgpIHtcbiAgICBpZiAodGhpcy5fZGIuaXNSZWFkeSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5fZGIuZGVsZXRlRGF0YWJhc2UoKTtcbiAgICB9XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgcGVyc2lzdGVudCBjYWNoZTogY3JlYXRlIEluZGV4ZWREQiBjYWNoZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICogQHJldHVybiB7UHJvbWlzZX0gUHJvbWlzZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBvcGVyYXRpb24gaXMgY29tcGxldGVkLlxuICAgKi9cbiAgaW5pdFN0b3JhZ2UoKSB7XG4gICAgaWYgKCF0aGlzLl9kYi5pc1JlYWR5KCkpIHtcbiAgICAgIHJldHVybiB0aGlzLl9kYi5pbml0RGF0YWJhc2UoKTtcbiAgICB9XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgYSBuZXR3b3JrIHByb2JlIG1lc3NhZ2UgdG8gbWFrZSBzdXJlIHRoZSBjb25uZWN0aW9uIGlzIGFsaXZlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKi9cbiAgbmV0d29ya1Byb2JlKCkge1xuICAgIHRoaXMuX2Nvbm5lY3Rpb24ucHJvYmUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBmb3IgbGl2ZSBjb25uZWN0aW9uIHRvIHNlcnZlci5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIHRoZXJlIGlzIGEgbGl2ZSBjb25uZWN0aW9uLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgaXNDb25uZWN0ZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Nvbm5lY3Rpb24uaXNDb25uZWN0ZWQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBjb25uZWN0aW9uIGlzIGF1dGhlbnRpY2F0ZWQgKGxhc3QgbG9naW4gd2FzIHN1Y2Nlc3NmdWwpLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgYXV0aGVudGljYXRlZCwgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIGlzQXV0aGVudGljYXRlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fYXV0aGVudGljYXRlZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgQVBJIGtleSBhbmQgYXV0aCB0b2tlbiB0byB0aGUgcmVsYXRpdmUgVVJMIG1ha2luZyBpdCB1c2FibGUgZm9yIGdldHRpbmcgZGF0YVxuICAgKiBmcm9tIHRoZSBzZXJ2ZXIgaW4gYSBzaW1wbGUgPGNvZGU+SFRUUCBHRVQ8L2NvZGU+IHJlcXVlc3QuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBVUkwgLSBVUkwgdG8gd3JhcC5cbiAgICogQHJldHVybnMge3N0cmluZ30gVVJMIHdpdGggYXBwZW5kZWQgQVBJIGtleSBhbmQgdG9rZW4sIGlmIHZhbGlkIHRva2VuIGlzIHByZXNlbnQuXG4gICAqL1xuICBhdXRob3JpemVVUkwodXJsKSB7XG4gICAgaWYgKHR5cGVvZiB1cmwgIT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiB1cmw7XG4gICAgfVxuXG4gICAgaWYgKFRpbm9kZS5pc1JlbGF0aXZlVVJMKHVybCkpIHtcbiAgICAgIC8vIEZha2UgYmFzZSB0byBtYWtlIHRoZSByZWxhdGl2ZSBVUkwgcGFyc2VhYmxlLlxuICAgICAgY29uc3QgYmFzZSA9ICdzY2hlbWU6Ly9ob3N0Lyc7XG4gICAgICBjb25zdCBwYXJzZWQgPSBuZXcgVVJMKHVybCwgYmFzZSk7XG4gICAgICBpZiAodGhpcy5fYXBpS2V5KSB7XG4gICAgICAgIHBhcnNlZC5zZWFyY2hQYXJhbXMuYXBwZW5kKCdhcGlrZXknLCB0aGlzLl9hcGlLZXkpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuX2F1dGhUb2tlbiAmJiB0aGlzLl9hdXRoVG9rZW4udG9rZW4pIHtcbiAgICAgICAgcGFyc2VkLnNlYXJjaFBhcmFtcy5hcHBlbmQoJ2F1dGgnLCAndG9rZW4nKTtcbiAgICAgICAgcGFyc2VkLnNlYXJjaFBhcmFtcy5hcHBlbmQoJ3NlY3JldCcsIHRoaXMuX2F1dGhUb2tlbi50b2tlbik7XG4gICAgICB9XG4gICAgICAvLyBDb252ZXJ0IGJhY2sgdG8gc3RyaW5nIGFuZCBzdHJpcCBmYWtlIGJhc2UgVVJMIGV4Y2VwdCBmb3IgdGhlIHJvb3Qgc2xhc2guXG4gICAgICB1cmwgPSBwYXJzZWQudG9TdHJpbmcoKS5zdWJzdHJpbmcoYmFzZS5sZW5ndGggLSAxKTtcbiAgICB9XG4gICAgcmV0dXJuIHVybDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAdHlwZWRlZiBBY2NvdW50UGFyYW1zXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHByb3BlcnR5IHtUaW5vZGUuRGVmQWNzPX0gZGVmYWNzIC0gRGVmYXVsdCBhY2Nlc3MgcGFyYW1ldGVycyBmb3IgdXNlcidzIDxjb2RlPm1lPC9jb2RlPiB0b3BpYy5cbiAgICogQHByb3BlcnR5IHtPYmplY3Q9fSBwdWJsaWMgLSBQdWJsaWMgYXBwbGljYXRpb24tZGVmaW5lZCBkYXRhIGV4cG9zZWQgb24gPGNvZGU+bWU8L2NvZGU+IHRvcGljLlxuICAgKiBAcHJvcGVydHkge09iamVjdD19IHByaXZhdGUgLSBQcml2YXRlIGFwcGxpY2F0aW9uLWRlZmluZWQgZGF0YSBhY2Nlc3NpYmxlIG9uIDxjb2RlPm1lPC9jb2RlPiB0b3BpYy5cbiAgICogQHByb3BlcnR5IHtPYmplY3Q9fSB0cnVzdGVkIC0gVHJ1c3RlZCB1c2VyIGRhdGEgd2hpY2ggY2FuIGJlIHNldCBieSBhIHJvb3QgdXNlciBvbmx5LlxuICAgKiBAcHJvcGVydHkge0FycmF5LjxzdHJpbmc+fSB0YWdzIC0gYXJyYXkgb2Ygc3RyaW5nIHRhZ3MgZm9yIHVzZXIgZGlzY292ZXJ5LlxuICAgKiBAcHJvcGVydHkge3N0cmluZz19IHRva2VuIC0gYXV0aGVudGljYXRpb24gdG9rZW4gdG8gdXNlLlxuICAgKiBAcHJvcGVydHkge0FycmF5LjxzdHJpbmc+PX0gYXR0YWNobWVudHMgLSBBcnJheSBvZiByZWZlcmVuY2VzIHRvIG91dCBvZiBiYW5kIGF0dGFjaG1lbnRzIHVzZWQgaW4gYWNjb3VudCBkZXNjcmlwdGlvbi5cbiAgICovXG4gIC8qKlxuICAgKiBAdHlwZWRlZiBEZWZBY3NcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAcHJvcGVydHkge3N0cmluZz19IGF1dGggLSBBY2Nlc3MgbW9kZSBmb3IgPGNvZGU+bWU8L2NvZGU+IGZvciBhdXRoZW50aWNhdGVkIHVzZXJzLlxuICAgKiBAcHJvcGVydHkge3N0cmluZz19IGFub24gLSBBY2Nlc3MgbW9kZSBmb3IgPGNvZGU+bWU8L2NvZGU+IGZvciBhbm9ueW1vdXMgdXNlcnMuXG4gICAqL1xuXG4gIC8qKlxuICAgKiBDcmVhdGUgb3IgdXBkYXRlIGFuIGFjY291bnQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1aWQgLSBVc2VyIGlkIHRvIHVwZGF0ZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2NoZW1lIC0gQXV0aGVudGljYXRpb24gc2NoZW1lOyA8Y29kZT5cImJhc2ljXCI8L2NvZGU+IGFuZCA8Y29kZT5cImFub255bW91c1wiPC9jb2RlPiBhcmUgdGhlIGN1cnJlbnRseSBzdXBwb3J0ZWQgc2NoZW1lcy5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHNlY3JldCAtIEF1dGhlbnRpY2F0aW9uIHNlY3JldCwgYXNzdW1lZCB0byBiZSBhbHJlYWR5IGJhc2U2NCBlbmNvZGVkLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBsb2dpbiAtIFVzZSBuZXcgYWNjb3VudCB0byBhdXRoZW50aWNhdGUgY3VycmVudCBzZXNzaW9uXG4gICAqIEBwYXJhbSB7VGlub2RlLkFjY291bnRQYXJhbXM9fSBwYXJhbXMgLSBVc2VyIGRhdGEgdG8gcGFzcyB0byB0aGUgc2VydmVyLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gc2VydmVyIHJlcGx5IGlzIHJlY2VpdmVkLlxuICAgKi9cbiAgYWNjb3VudCh1aWQsIHNjaGVtZSwgc2VjcmV0LCBsb2dpbiwgcGFyYW1zKSB7XG4gICAgY29uc3QgcGt0ID0gdGhpcy4jaW5pdFBhY2tldCgnYWNjJyk7XG4gICAgcGt0LmFjYy51c2VyID0gdWlkO1xuICAgIHBrdC5hY2Muc2NoZW1lID0gc2NoZW1lO1xuICAgIHBrdC5hY2Muc2VjcmV0ID0gc2VjcmV0O1xuICAgIC8vIExvZyBpbiB0byB0aGUgbmV3IGFjY291bnQgdXNpbmcgc2VsZWN0ZWQgc2NoZW1lXG4gICAgcGt0LmFjYy5sb2dpbiA9IGxvZ2luO1xuXG4gICAgaWYgKHBhcmFtcykge1xuICAgICAgcGt0LmFjYy5kZXNjLmRlZmFjcyA9IHBhcmFtcy5kZWZhY3M7XG4gICAgICBwa3QuYWNjLmRlc2MucHVibGljID0gcGFyYW1zLnB1YmxpYztcbiAgICAgIHBrdC5hY2MuZGVzYy5wcml2YXRlID0gcGFyYW1zLnByaXZhdGU7XG4gICAgICBwa3QuYWNjLmRlc2MudHJ1c3RlZCA9IHBhcmFtcy50cnVzdGVkO1xuXG4gICAgICBwa3QuYWNjLnRhZ3MgPSBwYXJhbXMudGFncztcbiAgICAgIHBrdC5hY2MuY3JlZCA9IHBhcmFtcy5jcmVkO1xuXG4gICAgICBwa3QuYWNjLnRva2VuID0gcGFyYW1zLnRva2VuO1xuXG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShwYXJhbXMuYXR0YWNobWVudHMpICYmIHBhcmFtcy5hdHRhY2htZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHBrdC5leHRyYSA9IHtcbiAgICAgICAgICBhdHRhY2htZW50czogcGFyYW1zLmF0dGFjaG1lbnRzLmZpbHRlcihyZWYgPT4gVGlub2RlLmlzUmVsYXRpdmVVUkwocmVmKSlcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy4jc2VuZChwa3QsIHBrdC5hY2MuaWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyB1c2VyLiBXcmFwcGVyIGZvciB7QGxpbmsgVGlub2RlI2FjY291bnR9LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2NoZW1lIC0gQXV0aGVudGljYXRpb24gc2NoZW1lOyA8Y29kZT5cImJhc2ljXCI8L2NvZGU+IGlzIHRoZSBvbmx5IGN1cnJlbnRseSBzdXBwb3J0ZWQgc2NoZW1lLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2VjcmV0IC0gQXV0aGVudGljYXRpb24uXG4gICAqIEBwYXJhbSB7Ym9vbGVhbj19IGxvZ2luIC0gVXNlIG5ldyBhY2NvdW50IHRvIGF1dGhlbnRpY2F0ZSBjdXJyZW50IHNlc3Npb25cbiAgICogQHBhcmFtIHtUaW5vZGUuQWNjb3VudFBhcmFtcz19IHBhcmFtcyAtIFVzZXIgZGF0YSB0byBwYXNzIHRvIHRoZSBzZXJ2ZXIuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiBzZXJ2ZXIgcmVwbHkgaXMgcmVjZWl2ZWQuXG4gICAqL1xuICBjcmVhdGVBY2NvdW50KHNjaGVtZSwgc2VjcmV0LCBsb2dpbiwgcGFyYW1zKSB7XG4gICAgbGV0IHByb21pc2UgPSB0aGlzLmFjY291bnQoQ29uc3QuVVNFUl9ORVcsIHNjaGVtZSwgc2VjcmV0LCBsb2dpbiwgcGFyYW1zKTtcbiAgICBpZiAobG9naW4pIHtcbiAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKGN0cmwpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI2xvZ2luU3VjY2Vzc2Z1bChjdHJsKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgdXNlciB3aXRoIDxjb2RlPidiYXNpYyc8L2NvZGU+IGF1dGhlbnRpY2F0aW9uIHNjaGVtZSBhbmQgaW1tZWRpYXRlbHlcbiAgICogdXNlIGl0IGZvciBhdXRoZW50aWNhdGlvbi4gV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNhY2NvdW50fS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVzZXJuYW1lIC0gTG9naW4gdG8gdXNlIGZvciB0aGUgbmV3IGFjY291bnQuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXNzd29yZCAtIFVzZXIncyBwYXNzd29yZC5cbiAgICogQHBhcmFtIHtUaW5vZGUuQWNjb3VudFBhcmFtcz19IHBhcmFtcyAtIFVzZXIgZGF0YSB0byBwYXNzIHRvIHRoZSBzZXJ2ZXIuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiBzZXJ2ZXIgcmVwbHkgaXMgcmVjZWl2ZWQuXG4gICAqL1xuICBjcmVhdGVBY2NvdW50QmFzaWModXNlcm5hbWUsIHBhc3N3b3JkLCBwYXJhbXMpIHtcbiAgICAvLyBNYWtlIHN1cmUgd2UgYXJlIG5vdCB1c2luZyAnbnVsbCcgb3IgJ3VuZGVmaW5lZCc7XG4gICAgdXNlcm5hbWUgPSB1c2VybmFtZSB8fCAnJztcbiAgICBwYXNzd29yZCA9IHBhc3N3b3JkIHx8ICcnO1xuICAgIHJldHVybiB0aGlzLmNyZWF0ZUFjY291bnQoJ2Jhc2ljJyxcbiAgICAgIGI2NEVuY29kZVVuaWNvZGUodXNlcm5hbWUgKyAnOicgKyBwYXNzd29yZCksIHRydWUsIHBhcmFtcyk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlIHVzZXIncyBjcmVkZW50aWFscyBmb3IgPGNvZGU+J2Jhc2ljJzwvY29kZT4gYXV0aGVudGljYXRpb24gc2NoZW1lLiBXcmFwcGVyIGZvciB7QGxpbmsgVGlub2RlI2FjY291bnR9LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdWlkIC0gVXNlciBJRCB0byB1cGRhdGUuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1c2VybmFtZSAtIExvZ2luIHRvIHVzZSBmb3IgdGhlIG5ldyBhY2NvdW50LlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGFzc3dvcmQgLSBVc2VyJ3MgcGFzc3dvcmQuXG4gICAqIEBwYXJhbSB7VGlub2RlLkFjY291bnRQYXJhbXM9fSBwYXJhbXMgLSBkYXRhIHRvIHBhc3MgdG8gdGhlIHNlcnZlci5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHNlcnZlciByZXBseSBpcyByZWNlaXZlZC5cbiAgICovXG4gIHVwZGF0ZUFjY291bnRCYXNpYyh1aWQsIHVzZXJuYW1lLCBwYXNzd29yZCwgcGFyYW1zKSB7XG4gICAgLy8gTWFrZSBzdXJlIHdlIGFyZSBub3QgdXNpbmcgJ251bGwnIG9yICd1bmRlZmluZWQnO1xuICAgIHVzZXJuYW1lID0gdXNlcm5hbWUgfHwgJyc7XG4gICAgcGFzc3dvcmQgPSBwYXNzd29yZCB8fCAnJztcbiAgICByZXR1cm4gdGhpcy5hY2NvdW50KHVpZCwgJ2Jhc2ljJyxcbiAgICAgIGI2NEVuY29kZVVuaWNvZGUodXNlcm5hbWUgKyAnOicgKyBwYXNzd29yZCksIGZhbHNlLCBwYXJhbXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgaGFuZHNoYWtlIHRvIHRoZSBzZXJ2ZXIuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiBzZXJ2ZXIgcmVwbHkgaXMgcmVjZWl2ZWQuXG4gICAqL1xuICBoZWxsbygpIHtcbiAgICBjb25zdCBwa3QgPSB0aGlzLiNpbml0UGFja2V0KCdoaScpO1xuXG4gICAgcmV0dXJuIHRoaXMuI3NlbmQocGt0LCBwa3QuaGkuaWQpXG4gICAgICAudGhlbigoY3RybCkgPT4ge1xuICAgICAgICAvLyBSZXNldCBiYWNrb2ZmIGNvdW50ZXIgb24gc3VjY2Vzc2Z1bCBjb25uZWN0aW9uLlxuICAgICAgICB0aGlzLl9jb25uZWN0aW9uLmJhY2tvZmZSZXNldCgpO1xuXG4gICAgICAgIC8vIFNlcnZlciByZXNwb25zZSBjb250YWlucyBzZXJ2ZXIgcHJvdG9jb2wgdmVyc2lvbiwgYnVpbGQsIGNvbnN0cmFpbnRzLFxuICAgICAgICAvLyBzZXNzaW9uIElEIGZvciBsb25nIHBvbGxpbmcuIFNhdmUgdGhlbS5cbiAgICAgICAgaWYgKGN0cmwucGFyYW1zKSB7XG4gICAgICAgICAgdGhpcy5fc2VydmVySW5mbyA9IGN0cmwucGFyYW1zO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMub25Db25uZWN0KSB7XG4gICAgICAgICAgdGhpcy5vbkNvbm5lY3QoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjdHJsO1xuICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICB0aGlzLl9jb25uZWN0aW9uLnJlY29ubmVjdCh0cnVlKTtcblxuICAgICAgICBpZiAodGhpcy5vbkRpc2Nvbm5lY3QpIHtcbiAgICAgICAgICB0aGlzLm9uRGlzY29ubmVjdChlcnIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgb3IgcmVmcmVzaCB0aGUgcHVzaCBub3RpZmljYXRpb25zL2RldmljZSB0b2tlbi4gSWYgdGhlIGNsaWVudCBpcyBjb25uZWN0ZWQsXG4gICAqIHRoZSBkZXZpY2VUb2tlbiBjYW4gYmUgc2VudCB0byB0aGUgc2VydmVyLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKiBAcGFyYW0ge3N0cmluZ30gZHQgLSB0b2tlbiBvYnRhaW5lZCBmcm9tIHRoZSBwcm92aWRlciBvciA8Y29kZT5mYWxzZTwvY29kZT4sXG4gICAqICAgIDxjb2RlPm51bGw8L2NvZGU+IG9yIDxjb2RlPnVuZGVmaW5lZDwvY29kZT4gdG8gY2xlYXIgdGhlIHRva2VuLlxuICAgKlxuICAgKiBAcmV0dXJucyA8Y29kZT50cnVlPC9jb2RlPiBpZiBhdHRlbXB0IHdhcyBtYWRlIHRvIHNlbmQgdGhlIHVwZGF0ZSB0byB0aGUgc2VydmVyLlxuICAgKi9cbiAgc2V0RGV2aWNlVG9rZW4oZHQpIHtcbiAgICBsZXQgc2VudCA9IGZhbHNlO1xuICAgIC8vIENvbnZlcnQgYW55IGZhbHNpc2ggdmFsdWUgdG8gbnVsbC5cbiAgICBkdCA9IGR0IHx8IG51bGw7XG4gICAgaWYgKGR0ICE9IHRoaXMuX2RldmljZVRva2VuKSB7XG4gICAgICB0aGlzLl9kZXZpY2VUb2tlbiA9IGR0O1xuICAgICAgaWYgKHRoaXMuaXNDb25uZWN0ZWQoKSAmJiB0aGlzLmlzQXV0aGVudGljYXRlZCgpKSB7XG4gICAgICAgIHRoaXMuI3NlbmQoe1xuICAgICAgICAgICdoaSc6IHtcbiAgICAgICAgICAgICdkZXYnOiBkdCB8fCBUaW5vZGUuREVMX0NIQVJcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBzZW50ID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHNlbnQ7XG4gIH1cblxuICAvKipcbiAgICogQHR5cGVkZWYgQ3JlZGVudGlhbFxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAcHJvcGVydHkge3N0cmluZ30gbWV0aCAtIHZhbGlkYXRpb24gbWV0aG9kLlxuICAgKiBAcHJvcGVydHkge3N0cmluZ30gdmFsIC0gdmFsdWUgdG8gdmFsaWRhdGUgKGUuZy4gZW1haWwgb3IgcGhvbmUgbnVtYmVyKS5cbiAgICogQHByb3BlcnR5IHtzdHJpbmd9IHJlc3AgLSB2YWxpZGF0aW9uIHJlc3BvbnNlLlxuICAgKiBAcHJvcGVydHkge09iamVjdH0gcGFyYW1zIC0gdmFsaWRhdGlvbiBwYXJhbWV0ZXJzLlxuICAgKi9cbiAgLyoqXG4gICAqIEF1dGhlbnRpY2F0ZSBjdXJyZW50IHNlc3Npb24uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzY2hlbWUgLSBBdXRoZW50aWNhdGlvbiBzY2hlbWU7IDxjb2RlPlwiYmFzaWNcIjwvY29kZT4gaXMgdGhlIG9ubHkgY3VycmVudGx5IHN1cHBvcnRlZCBzY2hlbWUuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzZWNyZXQgLSBBdXRoZW50aWNhdGlvbiBzZWNyZXQsIGFzc3VtZWQgdG8gYmUgYWxyZWFkeSBiYXNlNjQgZW5jb2RlZC5cbiAgICogQHBhcmFtIHtDcmVkZW50aWFsPX0gY3JlZCAtIGNyZWRlbnRpYWwgY29uZmlybWF0aW9uLCBpZiByZXF1aXJlZC5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHNlcnZlciByZXBseSBpcyByZWNlaXZlZC5cbiAgICovXG4gIGxvZ2luKHNjaGVtZSwgc2VjcmV0LCBjcmVkKSB7XG4gICAgY29uc3QgcGt0ID0gdGhpcy4jaW5pdFBhY2tldCgnbG9naW4nKTtcbiAgICBwa3QubG9naW4uc2NoZW1lID0gc2NoZW1lO1xuICAgIHBrdC5sb2dpbi5zZWNyZXQgPSBzZWNyZXQ7XG4gICAgcGt0LmxvZ2luLmNyZWQgPSBjcmVkO1xuXG4gICAgcmV0dXJuIHRoaXMuI3NlbmQocGt0LCBwa3QubG9naW4uaWQpXG4gICAgICAudGhlbigoY3RybCkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy4jbG9naW5TdWNjZXNzZnVsKGN0cmwpO1xuICAgICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNsb2dpbn0gd2l0aCBiYXNpYyBhdXRoZW50aWNhdGlvblxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdW5hbWUgLSBVc2VyIG5hbWUuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXNzd29yZCAgLSBQYXNzd29yZC5cbiAgICogQHBhcmFtIHtDcmVkZW50aWFsPX0gY3JlZCAtIGNyZWRlbnRpYWwgY29uZmlybWF0aW9uLCBpZiByZXF1aXJlZC5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCBvbiByZWNlaXZpbmcgc2VydmVyIHJlcGx5LlxuICAgKi9cbiAgbG9naW5CYXNpYyh1bmFtZSwgcGFzc3dvcmQsIGNyZWQpIHtcbiAgICByZXR1cm4gdGhpcy5sb2dpbignYmFzaWMnLCBiNjRFbmNvZGVVbmljb2RlKHVuYW1lICsgJzonICsgcGFzc3dvcmQpLCBjcmVkKVxuICAgICAgLnRoZW4oKGN0cmwpID0+IHtcbiAgICAgICAgdGhpcy5fbG9naW4gPSB1bmFtZTtcbiAgICAgICAgcmV0dXJuIGN0cmw7XG4gICAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXcmFwcGVyIGZvciB7QGxpbmsgVGlub2RlI2xvZ2lufSB3aXRoIHRva2VuIGF1dGhlbnRpY2F0aW9uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b2tlbiAtIFRva2VuIHJlY2VpdmVkIGluIHJlc3BvbnNlIHRvIGVhcmxpZXIgbG9naW4uXG4gICAqIEBwYXJhbSB7Q3JlZGVudGlhbD19IGNyZWQgLSBjcmVkZW50aWFsIGNvbmZpcm1hdGlvbiwgaWYgcmVxdWlyZWQuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gcmVjZWl2aW5nIHNlcnZlciByZXBseS5cbiAgICovXG4gIGxvZ2luVG9rZW4odG9rZW4sIGNyZWQpIHtcbiAgICByZXR1cm4gdGhpcy5sb2dpbigndG9rZW4nLCB0b2tlbiwgY3JlZCk7XG4gIH1cblxuICAvKipcbiAgICogU2VuZCBhIHJlcXVlc3QgZm9yIHJlc2V0dGluZyBhbiBhdXRoZW50aWNhdGlvbiBzZWNyZXQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzY2hlbWUgLSBhdXRoZW50aWNhdGlvbiBzY2hlbWUgdG8gcmVzZXQuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtZXRob2QgLSBtZXRob2QgdG8gdXNlIGZvciByZXNldHRpbmcgdGhlIHNlY3JldCwgc3VjaCBhcyBcImVtYWlsXCIgb3IgXCJ0ZWxcIi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIC0gdmFsdWUgb2YgdGhlIGNyZWRlbnRpYWwgdG8gdXNlLCBhIHNwZWNpZmljIGVtYWlsIGFkZHJlc3Mgb3IgYSBwaG9uZSBudW1iZXIuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gcmVjZWl2aW5nIHRoZSBzZXJ2ZXIgcmVwbHkuXG4gICAqL1xuICByZXF1ZXN0UmVzZXRBdXRoU2VjcmV0KHNjaGVtZSwgbWV0aG9kLCB2YWx1ZSkge1xuICAgIHJldHVybiB0aGlzLmxvZ2luKCdyZXNldCcsIGI2NEVuY29kZVVuaWNvZGUoc2NoZW1lICsgJzonICsgbWV0aG9kICsgJzonICsgdmFsdWUpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAdHlwZWRlZiBBdXRoVG9rZW5cbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAcHJvcGVydHkge3N0cmluZ30gdG9rZW4gLSBUb2tlbiB2YWx1ZS5cbiAgICogQHByb3BlcnR5IHtEYXRlfSBleHBpcmVzIC0gVG9rZW4gZXhwaXJhdGlvbiB0aW1lLlxuICAgKi9cbiAgLyoqXG4gICAqIEdldCBzdG9yZWQgYXV0aGVudGljYXRpb24gdG9rZW4uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuQXV0aFRva2VufSBhdXRoZW50aWNhdGlvbiB0b2tlbi5cbiAgICovXG4gIGdldEF1dGhUb2tlbigpIHtcbiAgICBpZiAodGhpcy5fYXV0aFRva2VuICYmICh0aGlzLl9hdXRoVG9rZW4uZXhwaXJlcy5nZXRUaW1lKCkgPiBEYXRlLm5vdygpKSkge1xuICAgICAgcmV0dXJuIHRoaXMuX2F1dGhUb2tlbjtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fYXV0aFRva2VuID0gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvKipcbiAgICogQXBwbGljYXRpb24gbWF5IHByb3ZpZGUgYSBzYXZlZCBhdXRoZW50aWNhdGlvbiB0b2tlbi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtUaW5vZGUuQXV0aFRva2VufSB0b2tlbiAtIGF1dGhlbnRpY2F0aW9uIHRva2VuLlxuICAgKi9cbiAgc2V0QXV0aFRva2VuKHRva2VuKSB7XG4gICAgdGhpcy5fYXV0aFRva2VuID0gdG9rZW47XG4gIH1cblxuICAvKipcbiAgICogQHR5cGVkZWYgU2V0UGFyYW1zXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQHByb3BlcnR5IHtUaW5vZGUuU2V0RGVzYz19IGRlc2MgLSBUb3BpYyBpbml0aWFsaXphdGlvbiBwYXJhbWV0ZXJzIHdoZW4gY3JlYXRpbmcgYSBuZXcgdG9waWMgb3IgYSBuZXcgc3Vic2NyaXB0aW9uLlxuICAgKiBAcHJvcGVydHkge1Rpbm9kZS5TZXRTdWI9fSBzdWIgLSBTdWJzY3JpcHRpb24gaW5pdGlhbGl6YXRpb24gcGFyYW1ldGVycy5cbiAgICogQHByb3BlcnR5IHtBcnJheS48c3RyaW5nPj19IGF0dGFjaG1lbnRzIC0gVVJMcyBvZiBvdXQgb2YgYmFuZCBhdHRhY2htZW50cyB1c2VkIGluIHBhcmFtZXRlcnMuXG4gICAqL1xuICAvKipcbiAgICogQHR5cGVkZWYgU2V0RGVzY1xuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBwcm9wZXJ0eSB7VGlub2RlLkRlZkFjcz19IGRlZmFjcyAtIERlZmF1bHQgYWNjZXNzIG1vZGUuXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0PX0gcHVibGljIC0gRnJlZS1mb3JtIHRvcGljIGRlc2NyaXB0aW9uLCBwdWJsaWNhbGx5IGFjY2Vzc2libGUuXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0PX0gcHJpdmF0ZSAtIEZyZWUtZm9ybSB0b3BpYyBkZXNjcmlwdGlvbiBhY2Nlc3NpYmxlIG9ubHkgdG8gdGhlIG93bmVyLlxuICAgKiBAcHJvcGVydHkge09iamVjdD19IHRydXN0ZWQgLSBUcnVzdGVkIHVzZXIgZGF0YSB3aGljaCBjYW4gYmUgc2V0IGJ5IGEgcm9vdCB1c2VyIG9ubHkuXG4gICAqL1xuICAvKipcbiAgICogQHR5cGVkZWYgU2V0U3ViXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQHByb3BlcnR5IHtzdHJpbmc9fSB1c2VyIC0gVUlEIG9mIHRoZSB1c2VyIGFmZmVjdGVkIGJ5IHRoZSByZXF1ZXN0LiBEZWZhdWx0IChlbXB0eSkgLSBjdXJyZW50IHVzZXIuXG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nPX0gbW9kZSAtIFVzZXIgYWNjZXNzIG1vZGUsIGVpdGhlciByZXF1ZXN0ZWQgb3IgYXNzaWduZWQgZGVwZW5kZW50IG9uIGNvbnRleHQuXG4gICAqL1xuICAvKipcbiAgICogUGFyYW1ldGVycyBwYXNzZWQgdG8ge0BsaW5rIFRpbm9kZSNzdWJzY3JpYmV9LlxuICAgKlxuICAgKiBAdHlwZWRlZiBTdWJzY3JpcHRpb25QYXJhbXNcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAcHJvcGVydHkge1Rpbm9kZS5TZXRQYXJhbXM9fSBzZXQgLSBQYXJhbWV0ZXJzIHVzZWQgdG8gaW5pdGlhbGl6ZSB0b3BpY1xuICAgKiBAcHJvcGVydHkge1Rpbm9kZS5HZXRRdWVyeT19IGdldCAtIFF1ZXJ5IGZvciBmZXRjaGluZyBkYXRhIGZyb20gdG9waWMuXG4gICAqL1xuXG4gIC8qKlxuICAgKiBTZW5kIGEgdG9waWMgc3Vic2NyaXB0aW9uIHJlcXVlc3QuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpYyAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIHN1YnNjcmliZSB0by5cbiAgICogQHBhcmFtIHtUaW5vZGUuR2V0UXVlcnk9fSBnZXRQYXJhbXMgLSBPcHRpb25hbCBzdWJzY3JpcHRpb24gbWV0YWRhdGEgcXVlcnlcbiAgICogQHBhcmFtIHtUaW5vZGUuU2V0UGFyYW1zPX0gc2V0UGFyYW1zIC0gT3B0aW9uYWwgaW5pdGlhbGl6YXRpb24gcGFyYW1ldGVyc1xuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIG9uIHJlY2VpdmluZyBzZXJ2ZXIgcmVwbHkuXG4gICAqL1xuICBzdWJzY3JpYmUodG9waWNOYW1lLCBnZXRQYXJhbXMsIHNldFBhcmFtcykge1xuICAgIGNvbnN0IHBrdCA9IHRoaXMuI2luaXRQYWNrZXQoJ3N1YicsIHRvcGljTmFtZSlcbiAgICBpZiAoIXRvcGljTmFtZSkge1xuICAgICAgdG9waWNOYW1lID0gQ29uc3QuVE9QSUNfTkVXO1xuICAgIH1cblxuICAgIHBrdC5zdWIuZ2V0ID0gZ2V0UGFyYW1zO1xuXG4gICAgaWYgKHNldFBhcmFtcykge1xuICAgICAgaWYgKHNldFBhcmFtcy5zdWIpIHtcbiAgICAgICAgcGt0LnN1Yi5zZXQuc3ViID0gc2V0UGFyYW1zLnN1YjtcbiAgICAgIH1cblxuICAgICAgaWYgKHNldFBhcmFtcy5kZXNjKSB7XG4gICAgICAgIGNvbnN0IGRlc2MgPSBzZXRQYXJhbXMuZGVzYztcbiAgICAgICAgaWYgKFRpbm9kZS5pc05ld0dyb3VwVG9waWNOYW1lKHRvcGljTmFtZSkpIHtcbiAgICAgICAgICAvLyBGdWxsIHNldC5kZXNjIHBhcmFtcyBhcmUgdXNlZCBmb3IgbmV3IHRvcGljcyBvbmx5XG4gICAgICAgICAgcGt0LnN1Yi5zZXQuZGVzYyA9IGRlc2M7XG4gICAgICAgIH0gZWxzZSBpZiAoVGlub2RlLmlzUDJQVG9waWNOYW1lKHRvcGljTmFtZSkgJiYgZGVzYy5kZWZhY3MpIHtcbiAgICAgICAgICAvLyBVc2Ugb3B0aW9uYWwgZGVmYXVsdCBwZXJtaXNzaW9ucyBvbmx5LlxuICAgICAgICAgIHBrdC5zdWIuc2V0LmRlc2MgPSB7XG4gICAgICAgICAgICBkZWZhY3M6IGRlc2MuZGVmYWNzXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBTZWUgaWYgZXh0ZXJuYWwgb2JqZWN0cyB3ZXJlIHVzZWQgaW4gdG9waWMgZGVzY3JpcHRpb24uXG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShzZXRQYXJhbXMuYXR0YWNobWVudHMpICYmIHNldFBhcmFtcy5hdHRhY2htZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHBrdC5leHRyYSA9IHtcbiAgICAgICAgICBhdHRhY2htZW50czogc2V0UGFyYW1zLmF0dGFjaG1lbnRzLmZpbHRlcihyZWYgPT4gVGlub2RlLmlzUmVsYXRpdmVVUkwocmVmKSlcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgaWYgKHNldFBhcmFtcy50YWdzKSB7XG4gICAgICAgIHBrdC5zdWIuc2V0LnRhZ3MgPSBzZXRQYXJhbXMudGFncztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuI3NlbmQocGt0LCBwa3Quc3ViLmlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXRhY2ggYW5kIG9wdGlvbmFsbHkgdW5zdWJzY3JpYmUgZnJvbSB0aGUgdG9waWNcbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljIC0gVG9waWMgdG8gZGV0YWNoIGZyb20uXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gdW5zdWIgLSBJZiA8Y29kZT50cnVlPC9jb2RlPiwgZGV0YWNoIGFuZCB1bnN1YnNjcmliZSwgb3RoZXJ3aXNlIGp1c3QgZGV0YWNoLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIG9uIHJlY2VpdmluZyBzZXJ2ZXIgcmVwbHkuXG4gICAqL1xuICBsZWF2ZSh0b3BpYywgdW5zdWIpIHtcbiAgICBjb25zdCBwa3QgPSB0aGlzLiNpbml0UGFja2V0KCdsZWF2ZScsIHRvcGljKTtcbiAgICBwa3QubGVhdmUudW5zdWIgPSB1bnN1YjtcblxuICAgIHJldHVybiB0aGlzLiNzZW5kKHBrdCwgcGt0LmxlYXZlLmlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgbWVzc2FnZSBkcmFmdCB3aXRob3V0IHNlbmRpbmcgaXQgdG8gdGhlIHNlcnZlci5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gcHVibGlzaCB0by5cbiAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRlbnQgLSBQYXlsb2FkIHRvIHB1Ymxpc2guXG4gICAqIEBwYXJhbSB7Ym9vbGVhbj19IG5vRWNobyAtIElmIDxjb2RlPnRydWU8L2NvZGU+LCB0ZWxsIHRoZSBzZXJ2ZXIgbm90IHRvIGVjaG8gdGhlIG1lc3NhZ2UgdG8gdGhlIG9yaWdpbmFsIHNlc3Npb24uXG4gICAqXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IG5ldyBtZXNzYWdlIHdoaWNoIGNhbiBiZSBzZW50IHRvIHRoZSBzZXJ2ZXIgb3Igb3RoZXJ3aXNlIHVzZWQuXG4gICAqL1xuICBjcmVhdGVNZXNzYWdlKHRvcGljLCBjb250ZW50LCBub0VjaG8pIHtcbiAgICBjb25zdCBwa3QgPSB0aGlzLiNpbml0UGFja2V0KCdwdWInLCB0b3BpYyk7XG5cbiAgICBsZXQgZGZ0ID0gdHlwZW9mIGNvbnRlbnQgPT0gJ3N0cmluZycgPyBEcmFmdHkucGFyc2UoY29udGVudCkgOiBjb250ZW50O1xuICAgIGlmIChkZnQgJiYgIURyYWZ0eS5pc1BsYWluVGV4dChkZnQpKSB7XG4gICAgICBwa3QucHViLmhlYWQgPSB7XG4gICAgICAgIG1pbWU6IERyYWZ0eS5nZXRDb250ZW50VHlwZSgpXG4gICAgICB9O1xuICAgICAgY29udGVudCA9IGRmdDtcbiAgICB9XG4gICAgcGt0LnB1Yi5ub2VjaG8gPSBub0VjaG87XG4gICAgcGt0LnB1Yi5jb250ZW50ID0gY29udGVudDtcblxuICAgIHJldHVybiBwa3QucHViO1xuICB9XG5cbiAgLyoqXG4gICAqIFB1Ymxpc2gge2RhdGF9IG1lc3NhZ2UgdG8gdG9waWMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpY05hbWUgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byBwdWJsaXNoIHRvLlxuICAgKiBAcGFyYW0ge09iamVjdH0gY29udGVudCAtIFBheWxvYWQgdG8gcHVibGlzaC5cbiAgICogQHBhcmFtIHtib29sZWFuPX0gbm9FY2hvIC0gSWYgPGNvZGU+dHJ1ZTwvY29kZT4sIHRlbGwgdGhlIHNlcnZlciBub3QgdG8gZWNobyB0aGUgbWVzc2FnZSB0byB0aGUgb3JpZ2luYWwgc2Vzc2lvbi5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCBvbiByZWNlaXZpbmcgc2VydmVyIHJlcGx5LlxuICAgKi9cbiAgcHVibGlzaCh0b3BpY05hbWUsIGNvbnRlbnQsIG5vRWNobykge1xuICAgIHJldHVybiB0aGlzLnB1Ymxpc2hNZXNzYWdlKFxuICAgICAgdGhpcy5jcmVhdGVNZXNzYWdlKHRvcGljTmFtZSwgY29udGVudCwgbm9FY2hvKVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogUHVibGlzaCBtZXNzYWdlIHRvIHRvcGljLiBUaGUgbWVzc2FnZSBzaG91bGQgYmUgY3JlYXRlZCBieSB7QGxpbmsgVGlub2RlI2NyZWF0ZU1lc3NhZ2V9LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcHViIC0gTWVzc2FnZSB0byBwdWJsaXNoLlxuICAgKiBAcGFyYW0ge0FycmF5LjxzdHJpbmc+PX0gYXR0YWNobWVudHMgLSBhcnJheSBvZiBVUkxzIHdpdGggYXR0YWNobWVudHMuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gcmVjZWl2aW5nIHNlcnZlciByZXBseS5cbiAgICovXG4gIHB1Ymxpc2hNZXNzYWdlKHB1YiwgYXR0YWNobWVudHMpIHtcbiAgICAvLyBNYWtlIGEgc2hhbGxvdyBjb3B5LiBOZWVkZWQgaW4gb3JkZXIgdG8gY2xlYXIgbG9jYWxseS1hc3NpZ25lZCB0ZW1wIHZhbHVlcztcbiAgICBwdWIgPSBPYmplY3QuYXNzaWduKHt9LCBwdWIpO1xuICAgIHB1Yi5zZXEgPSB1bmRlZmluZWQ7XG4gICAgcHViLmZyb20gPSB1bmRlZmluZWQ7XG4gICAgcHViLnRzID0gdW5kZWZpbmVkO1xuICAgIGNvbnN0IG1zZyA9IHtcbiAgICAgIHB1YjogcHViLFxuICAgIH07XG4gICAgaWYgKGF0dGFjaG1lbnRzKSB7XG4gICAgICBtc2cuZXh0cmEgPSB7XG4gICAgICAgIGF0dGFjaG1lbnRzOiBhdHRhY2htZW50cy5maWx0ZXIocmVmID0+IFRpbm9kZS5pc1JlbGF0aXZlVVJMKHJlZikpXG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy4jc2VuZChtc2csIHB1Yi5pZCk7XG4gIH1cblxuICAvKipcbiAgICogT3V0IG9mIGJhbmQgbm90aWZpY2F0aW9uOiBub3RpZnkgdG9waWMgdGhhdCBhbiBleHRlcm5hbCAocHVzaCkgbm90aWZpY2F0aW9uIHdhcyByZWNpdmVkIGJ5IHRoZSBjbGllbnQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBkYXRhIC0gbm90aWZpY2F0aW9uIHBheWxvYWQuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBkYXRhLndoYXQgLSBub3RpZmljYXRpb24gdHlwZSwgJ21zZycsICdyZWFkJywgJ3N1YicuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBkYXRhLnRvcGljIC0gbmFtZSBvZiB0aGUgdXBkYXRlZCB0b3BpYy5cbiAgICogQHBhcmFtIHtudW1iZXI9fSBkYXRhLnNlcSAtIHNlcSBJRCBvZiB0aGUgYWZmZWN0ZWQgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtzdHJpbmc9fSBkYXRhLnhmcm9tIC0gVUlEIG9mIHRoZSBzZW5kZXIuXG4gICAqIEBwYXJhbSB7b2JqZWN0PX0gZGF0YS5naXZlbiAtIG5ldyBzdWJzY3JpcHRpb24gJ2dpdmVuJywgZS5nLiAnQVNXUC4uLicuXG4gICAqIEBwYXJhbSB7b2JqZWN0PX0gZGF0YS53YW50IC0gbmV3IHN1YnNjcmlwdGlvbiAnd2FudCcsIGUuZy4gJ1JXSi4uLicuXG4gICAqL1xuICBvb2JOb3RpZmljYXRpb24oZGF0YSkge1xuICAgIHN3aXRjaCAoZGF0YS53aGF0KSB7XG4gICAgICBjYXNlICdtc2cnOlxuICAgICAgICBpZiAoIWRhdGEgfHwgIWRhdGEuc2VxIHx8IGRhdGEuc2VxIDwgMSB8fCAhZGF0YS50b3BpYykge1xuICAgICAgICAgIC8vIFNlcnZlciBzZW50IGludmFsaWQgZGF0YS5cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5pc0Nvbm5lY3RlZCgpKSB7XG4gICAgICAgICAgLy8gTGV0J3MgaWdub3JlIHRoZSBtZXNzYWdlIGlzIHRoZXJlIGlzIG5vIGNvbm5lY3Rpb246IG5vIGNvbm5lY3Rpb24gbWVhbnMgdGhlcmUgYXJlIG5vIG9wZW5cbiAgICAgICAgICAvLyB0YWJzIHdpdGggVGlub2RlLlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdG9waWMgPSB0aGlzLiNjYWNoZUdldCgndG9waWMnLCBkYXRhLnRvcGljKTtcbiAgICAgICAgaWYgKCF0b3BpYykge1xuICAgICAgICAgIC8vIFRPRE86IGNoZWNrIGlmIHRoZXJlIGlzIGEgY2FzZSB3aGVuIGEgbWVzc2FnZSBjYW4gYXJyaXZlIGZyb20gYW4gdW5rbm93biB0b3BpYy5cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0b3BpYy5pc1N1YnNjcmliZWQoKSkge1xuICAgICAgICAgIC8vIE5vIG5lZWQgdG8gZmV0Y2g6IHRvcGljIGlzIGFscmVhZHkgc3Vic2NyaWJlZCBhbmQgZ290IGRhdGEgdGhyb3VnaCBub3JtYWwgY2hhbm5lbC5cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0b3BpYy5tYXhNc2dTZXEoKSA8IGRhdGEuc2VxKSB7XG4gICAgICAgICAgaWYgKHRvcGljLmlzQ2hhbm5lbFR5cGUoKSkge1xuICAgICAgICAgICAgdG9waWMuX3VwZGF0ZVJlY2VpdmVkKGRhdGEuc2VxLCAnZmFrZS11aWQnKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBOZXcgbWVzc2FnZS5cbiAgICAgICAgICBpZiAoZGF0YS54ZnJvbSAmJiAhdGhpcy4jY2FjaGVHZXQoJ3VzZXInLCBkYXRhLnhmcm9tKSkge1xuICAgICAgICAgICAgLy8gTWVzc2FnZSBmcm9tIHVua25vd24gc2VuZGVyLCBmZXRjaCBkZXNjcmlwdGlvbiBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAgICAgICAgICAvLyBTZW5kaW5nIGFzeW5jaHJvbm91c2x5IHdpdGhvdXQgYSBzdWJzY3JpcHRpb24uXG4gICAgICAgICAgICB0aGlzLmdldE1ldGEoZGF0YS54ZnJvbSwgbmV3IE1ldGFHZXRCdWlsZGVyKCkud2l0aERlc2MoKS5idWlsZCgpKS5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmxvZ2dlcihcIkZhaWxlZCB0byBnZXQgdGhlIG5hbWUgb2YgYSBuZXcgc2VuZGVyXCIsIGVycik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0b3BpYy5zdWJzY3JpYmUobnVsbCkudGhlbihfID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0b3BpYy5nZXRNZXRhKG5ldyBNZXRhR2V0QnVpbGRlcih0b3BpYykud2l0aExhdGVyRGF0YSgyNCkud2l0aExhdGVyRGVsKDI0KS5idWlsZCgpKTtcbiAgICAgICAgICB9KS50aGVuKF8gPT4ge1xuICAgICAgICAgICAgLy8gQWxsb3cgZGF0YSBmZXRjaCB0byBjb21wbGV0ZSBhbmQgZ2V0IHByb2Nlc3NlZCBzdWNjZXNzZnVsbHkuXG4gICAgICAgICAgICB0b3BpYy5sZWF2ZURlbGF5ZWQoZmFsc2UsIDEwMDApO1xuICAgICAgICAgIH0pLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlcihcIk9uIHB1c2ggZGF0YSBmZXRjaCBmYWlsZWRcIiwgZXJyKTtcbiAgICAgICAgICB9KS5maW5hbGx5KF8gPT4ge1xuICAgICAgICAgICAgdGhpcy5nZXRNZVRvcGljKCkuX3JlZnJlc2hDb250YWN0KCdtc2cnLCB0b3BpYyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ3JlYWQnOlxuICAgICAgICB0aGlzLmdldE1lVG9waWMoKS5fcm91dGVQcmVzKHtcbiAgICAgICAgICB3aGF0OiAncmVhZCcsXG4gICAgICAgICAgc2VxOiBkYXRhLnNlcVxuICAgICAgICB9KTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ3N1Yic6XG4gICAgICAgIGxldCBtb2RlID0ge1xuICAgICAgICAgIGdpdmVuOiBkYXRhLm1vZGVHaXZlbixcbiAgICAgICAgICB3YW50OiBkYXRhLm1vZGVXYW50XG4gICAgICAgIH07XG4gICAgICAgIGxldCBhY3MgPSBuZXcgQWNjZXNzTW9kZShtb2RlKTtcbiAgICAgICAgbGV0IHByZXMgPSAoIWFjcy5tb2RlIHx8IGFjcy5tb2RlID09IEFjY2Vzc01vZGUuX05PTkUpID9cbiAgICAgICAgICAvLyBTdWJzY3JpcHRpb24gZGVsZXRlZC5cbiAgICAgICAgICB7XG4gICAgICAgICAgICB3aGF0OiAnZ29uZScsXG4gICAgICAgICAgICBzcmM6IGRhdGEudG9waWNcbiAgICAgICAgICB9IDpcbiAgICAgICAgICAvLyBOZXcgc3Vic2NyaXB0aW9uIG9yIHN1YnNjcmlwdGlvbiB1cGRhdGVkLlxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHdoYXQ6ICdhY3MnLFxuICAgICAgICAgICAgc3JjOiBkYXRhLnRvcGljLFxuICAgICAgICAgICAgZGFjczogbW9kZVxuICAgICAgICAgIH07XG4gICAgICAgIHRoaXMuZ2V0TWVUb3BpYygpLl9yb3V0ZVByZXMocHJlcyk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aGlzLmxvZ2dlcihcIlVua25vd24gcHVzaCB0eXBlIGlnbm9yZWRcIiwgZGF0YS53aGF0KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHR5cGVkZWYgR2V0UXVlcnlcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAcHJvcGVydHkge1Rpbm9kZS5HZXRPcHRzVHlwZT19IGRlc2MgLSBJZiBwcm92aWRlZCAoZXZlbiBpZiBlbXB0eSksIGZldGNoIHRvcGljIGRlc2NyaXB0aW9uLlxuICAgKiBAcHJvcGVydHkge1Rpbm9kZS5HZXRPcHRzVHlwZT19IHN1YiAtIElmIHByb3ZpZGVkIChldmVuIGlmIGVtcHR5KSwgZmV0Y2ggdG9waWMgc3Vic2NyaXB0aW9ucy5cbiAgICogQHByb3BlcnR5IHtUaW5vZGUuR2V0RGF0YVR5cGU9fSBkYXRhIC0gSWYgcHJvdmlkZWQgKGV2ZW4gaWYgZW1wdHkpLCBnZXQgbWVzc2FnZXMuXG4gICAqL1xuXG4gIC8qKlxuICAgKiBAdHlwZWRlZiBHZXRPcHRzVHlwZVxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBwcm9wZXJ0eSB7RGF0ZT19IGltcyAtIFwiSWYgbW9kaWZpZWQgc2luY2VcIiwgZmV0Y2ggZGF0YSBvbmx5IGl0IHdhcyB3YXMgbW9kaWZpZWQgc2luY2Ugc3RhdGVkIGRhdGUuXG4gICAqIEBwcm9wZXJ0eSB7bnVtYmVyPX0gbGltaXQgLSBNYXhpbXVtIG51bWJlciBvZiByZXN1bHRzIHRvIHJldHVybi4gSWdub3JlZCB3aGVuIHF1ZXJ5aW5nIHRvcGljIGRlc2NyaXB0aW9uLlxuICAgKi9cblxuICAvKipcbiAgICogQHR5cGVkZWYgR2V0RGF0YVR5cGVcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAcHJvcGVydHkge251bWJlcj19IHNpbmNlIC0gTG9hZCBtZXNzYWdlcyB3aXRoIHNlcSBpZCBlcXVhbCBvciBncmVhdGVyIHRoYW4gdGhpcyB2YWx1ZS5cbiAgICogQHByb3BlcnR5IHtudW1iZXI9fSBiZWZvcmUgLSBMb2FkIG1lc3NhZ2VzIHdpdGggc2VxIGlkIGxvd2VyIHRoYW4gdGhpcyBudW1iZXIuXG4gICAqIEBwcm9wZXJ0eSB7bnVtYmVyPX0gbGltaXQgLSBNYXhpbXVtIG51bWJlciBvZiByZXN1bHRzIHRvIHJldHVybi5cbiAgICovXG5cbiAgLyoqXG4gICAqIFJlcXVlc3QgdG9waWMgbWV0YWRhdGFcbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gcXVlcnkuXG4gICAqIEBwYXJhbSB7VGlub2RlLkdldFF1ZXJ5fSBwYXJhbXMgLSBQYXJhbWV0ZXJzIG9mIHRoZSBxdWVyeS4gVXNlIHtAbGluayBUaW5vZGUuTWV0YUdldEJ1aWxkZXJ9IHRvIGdlbmVyYXRlLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIG9uIHJlY2VpdmluZyBzZXJ2ZXIgcmVwbHkuXG4gICAqL1xuICBnZXRNZXRhKHRvcGljLCBwYXJhbXMpIHtcbiAgICBjb25zdCBwa3QgPSB0aGlzLiNpbml0UGFja2V0KCdnZXQnLCB0b3BpYyk7XG5cbiAgICBwa3QuZ2V0ID0gbWVyZ2VPYmoocGt0LmdldCwgcGFyYW1zKTtcblxuICAgIHJldHVybiB0aGlzLiNzZW5kKHBrdCwgcGt0LmdldC5pZCk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlIHRvcGljJ3MgbWV0YWRhdGE6IGRlc2NyaXB0aW9uLCBzdWJzY3JpYnRpb25zLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWMgLSBUb3BpYyB0byB1cGRhdGUuXG4gICAqIEBwYXJhbSB7VGlub2RlLlNldFBhcmFtc30gcGFyYW1zIC0gdG9waWMgbWV0YWRhdGEgdG8gdXBkYXRlLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIG9uIHJlY2VpdmluZyBzZXJ2ZXIgcmVwbHkuXG4gICAqL1xuICBzZXRNZXRhKHRvcGljLCBwYXJhbXMpIHtcbiAgICBjb25zdCBwa3QgPSB0aGlzLiNpbml0UGFja2V0KCdzZXQnLCB0b3BpYyk7XG4gICAgY29uc3Qgd2hhdCA9IFtdO1xuXG4gICAgaWYgKHBhcmFtcykge1xuICAgICAgWydkZXNjJywgJ3N1YicsICd0YWdzJywgJ2NyZWQnLCAnZXBoZW1lcmFsJ10uZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgaWYgKHBhcmFtcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgd2hhdC5wdXNoKGtleSk7XG4gICAgICAgICAgcGt0LnNldFtrZXldID0gcGFyYW1zW2tleV07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShwYXJhbXMuYXR0YWNobWVudHMpICYmIHBhcmFtcy5hdHRhY2htZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHBrdC5leHRyYSA9IHtcbiAgICAgICAgICBhdHRhY2htZW50czogcGFyYW1zLmF0dGFjaG1lbnRzLmZpbHRlcihyZWYgPT4gVGlub2RlLmlzUmVsYXRpdmVVUkwocmVmKSlcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAod2hhdC5sZW5ndGggPT0gMCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIkludmFsaWQge3NldH0gcGFyYW1ldGVyc1wiKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuI3NlbmQocGt0LCBwa3Quc2V0LmlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSYW5nZSBvZiBtZXNzYWdlIElEcyB0byBkZWxldGUuXG4gICAqXG4gICAqIEB0eXBlZGVmIERlbFJhbmdlXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQHByb3BlcnR5IHtudW1iZXJ9IGxvdyAtIGxvdyBlbmQgb2YgdGhlIHJhbmdlLCBpbmNsdXNpdmUgKGNsb3NlZCkuXG4gICAqIEBwcm9wZXJ0eSB7bnVtYmVyPX0gaGkgLSBoaWdoIGVuZCBvZiB0aGUgcmFuZ2UsIGV4Y2x1c2l2ZSAob3BlbikuXG4gICAqL1xuICAvKipcbiAgICogRGVsZXRlIHNvbWUgb3IgYWxsIG1lc3NhZ2VzIGluIGEgdG9waWMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpYyAtIFRvcGljIG5hbWUgdG8gZGVsZXRlIG1lc3NhZ2VzIGZyb20uXG4gICAqIEBwYXJhbSB7VGlub2RlLkRlbFJhbmdlW119IGxpc3QgLSBSYW5nZXMgb2YgbWVzc2FnZSBJRHMgdG8gZGVsZXRlLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBoYXJkIC0gSGFyZCBvciBzb2Z0IGRlbGV0ZVxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIG9uIHJlY2VpdmluZyBzZXJ2ZXIgcmVwbHkuXG4gICAqL1xuICBkZWxNZXNzYWdlcyh0b3BpYywgcmFuZ2VzLCBoYXJkKSB7XG4gICAgY29uc3QgcGt0ID0gdGhpcy4jaW5pdFBhY2tldCgnZGVsJywgdG9waWMpO1xuXG4gICAgcGt0LmRlbC53aGF0ID0gJ21zZyc7XG4gICAgcGt0LmRlbC5kZWxzZXEgPSByYW5nZXM7XG4gICAgcGt0LmRlbC5oYXJkID0gaGFyZDtcblxuICAgIHJldHVybiB0aGlzLiNzZW5kKHBrdCwgcGt0LmRlbC5pZCk7XG4gIH1cblxuICAvKipcbiAgICogRGVsZXRlIHRoZSB0b3BpYyBhbGx0b2dldGhlci4gUmVxdWlyZXMgT3duZXIgcGVybWlzc2lvbi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljTmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIGRlbGV0ZVxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGhhcmQgLSBoYXJkLWRlbGV0ZSB0b3BpYy5cbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCBvbiByZWNlaXZpbmcgc2VydmVyIHJlcGx5LlxuICAgKi9cbiAgZGVsVG9waWModG9waWNOYW1lLCBoYXJkKSB7XG4gICAgY29uc3QgcGt0ID0gdGhpcy4jaW5pdFBhY2tldCgnZGVsJywgdG9waWNOYW1lKTtcbiAgICBwa3QuZGVsLndoYXQgPSAndG9waWMnO1xuICAgIHBrdC5kZWwuaGFyZCA9IGhhcmQ7XG5cbiAgICByZXR1cm4gdGhpcy4jc2VuZChwa3QsIHBrdC5kZWwuaWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIERlbGV0ZSBzdWJzY3JpcHRpb24uIFJlcXVpcmVzIFNoYXJlIHBlcm1pc3Npb24uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpY05hbWUgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byBkZWxldGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVzZXIgLSBVc2VyIElEIHRvIHJlbW92ZS5cbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCBvbiByZWNlaXZpbmcgc2VydmVyIHJlcGx5LlxuICAgKi9cbiAgZGVsU3Vic2NyaXB0aW9uKHRvcGljTmFtZSwgdXNlcikge1xuICAgIGNvbnN0IHBrdCA9IHRoaXMuI2luaXRQYWNrZXQoJ2RlbCcsIHRvcGljTmFtZSk7XG4gICAgcGt0LmRlbC53aGF0ID0gJ3N1Yic7XG4gICAgcGt0LmRlbC51c2VyID0gdXNlcjtcblxuICAgIHJldHVybiB0aGlzLiNzZW5kKHBrdCwgcGt0LmRlbC5pZCk7XG4gIH1cblxuICAvKipcbiAgICogRGVsZXRlIGNyZWRlbnRpYWwuIEFsd2F5cyBzZW50IG9uIDxjb2RlPidtZSc8L2NvZGU+IHRvcGljLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWV0aG9kIC0gdmFsaWRhdGlvbiBtZXRob2Qgc3VjaCBhcyA8Y29kZT4nZW1haWwnPC9jb2RlPiBvciA8Y29kZT4ndGVsJzwvY29kZT4uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSAtIHZhbGlkYXRpb24gdmFsdWUsIGkuZS4gPGNvZGU+J2FsaWNlQGV4YW1wbGUuY29tJzwvY29kZT4uXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gcmVjZWl2aW5nIHNlcnZlciByZXBseS5cbiAgICovXG4gIGRlbENyZWRlbnRpYWwobWV0aG9kLCB2YWx1ZSkge1xuICAgIGNvbnN0IHBrdCA9IHRoaXMuI2luaXRQYWNrZXQoJ2RlbCcsIENvbnN0LlRPUElDX01FKTtcbiAgICBwa3QuZGVsLndoYXQgPSAnY3JlZCc7XG4gICAgcGt0LmRlbC5jcmVkID0ge1xuICAgICAgbWV0aDogbWV0aG9kLFxuICAgICAgdmFsOiB2YWx1ZVxuICAgIH07XG5cbiAgICByZXR1cm4gdGhpcy4jc2VuZChwa3QsIHBrdC5kZWwuaWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcXVlc3QgdG8gZGVsZXRlIGFjY291bnQgb2YgdGhlIGN1cnJlbnQgdXNlci5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSBoYXJkIC0gaGFyZC1kZWxldGUgdXNlci5cbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCBvbiByZWNlaXZpbmcgc2VydmVyIHJlcGx5LlxuICAgKi9cbiAgZGVsQ3VycmVudFVzZXIoaGFyZCkge1xuICAgIGNvbnN0IHBrdCA9IHRoaXMuI2luaXRQYWNrZXQoJ2RlbCcsIG51bGwpO1xuICAgIHBrdC5kZWwud2hhdCA9ICd1c2VyJztcbiAgICBwa3QuZGVsLmhhcmQgPSBoYXJkO1xuXG4gICAgcmV0dXJuIHRoaXMuI3NlbmQocGt0LCBwa3QuZGVsLmlkKS50aGVuKChjdHJsKSA9PiB7XG4gICAgICB0aGlzLl9teVVJRCA9IG51bGw7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogTm90aWZ5IHNlcnZlciB0aGF0IGEgbWVzc2FnZSBvciBtZXNzYWdlcyB3ZXJlIHJlYWQgb3IgcmVjZWl2ZWQuIERvZXMgTk9UIHJldHVybiBwcm9taXNlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWNOYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgd2hlcmUgdGhlIG1lc2FnZSBpcyBiZWluZyBha25vd2xlZGdlZC5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHdoYXQgLSBBY3Rpb24gYmVpbmcgYWtub3dsZWRnZWQsIGVpdGhlciA8Y29kZT5cInJlYWRcIjwvY29kZT4gb3IgPGNvZGU+XCJyZWN2XCI8L2NvZGU+LlxuICAgKiBAcGFyYW0ge251bWJlcn0gc2VxIC0gTWF4aW11bSBpZCBvZiB0aGUgbWVzc2FnZSBiZWluZyBhY2tub3dsZWRnZWQuXG4gICAqL1xuICBub3RlKHRvcGljTmFtZSwgd2hhdCwgc2VxKSB7XG4gICAgaWYgKHNlcSA8PSAwIHx8IHNlcSA+PSBDb25zdC5MT0NBTF9TRVFJRCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIG1lc3NhZ2UgaWQgJHtzZXF9YCk7XG4gICAgfVxuXG4gICAgY29uc3QgcGt0ID0gdGhpcy4jaW5pdFBhY2tldCgnbm90ZScsIHRvcGljTmFtZSk7XG4gICAgcGt0Lm5vdGUud2hhdCA9IHdoYXQ7XG4gICAgcGt0Lm5vdGUuc2VxID0gc2VxO1xuICAgIHRoaXMuI3NlbmQocGt0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBCcm9hZGNhc3QgYSBrZXktcHJlc3Mgbm90aWZpY2F0aW9uIHRvIHRvcGljIHN1YnNjcmliZXJzLiBVc2VkIHRvIHNob3dcbiAgICogdHlwaW5nIG5vdGlmaWNhdGlvbnMgXCJ1c2VyIFggaXMgdHlwaW5nLi4uXCIuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpY05hbWUgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byBicm9hZGNhc3QgdG8uXG4gICAqL1xuICBub3RlS2V5UHJlc3ModG9waWNOYW1lKSB7XG4gICAgY29uc3QgcGt0ID0gdGhpcy4jaW5pdFBhY2tldCgnbm90ZScsIHRvcGljTmFtZSk7XG4gICAgcGt0Lm5vdGUud2hhdCA9ICdrcCc7XG4gICAgdGhpcy4jc2VuZChwa3QpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgYSB2aWRlbyBjYWxsIG5vdGlmaWNhdGlvbiB0byB0b3BpYyBzdWJzY3JpYmVycyAoaW5jbHVkaW5nIGRpYWxpbmcsXG4gICAqIGhhbmd1cCwgZXRjLikuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpY05hbWUgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byBicm9hZGNhc3QgdG8uXG4gICAqIEBwYXJhbSB7aW50fSBzZXEgLSBJRCBvZiB0aGUgY2FsbCBtZXNzYWdlIHRoZSBldmVudCBwZXJ0YWlucyB0by5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGV2dCAtIENhbGwgZXZlbnQuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXlsb2FkIC0gUGF5bG9hZCBhc3NvY2lhdGVkIHdpdGggdGhpcyBldmVudCAoZS5nLiBTRFAgc3RyaW5nKS5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgKGZvciBzb21lIGNhbGwgZXZlbnRzKSB3aGljaCB3aWxsXG4gICAqICAgICAgICAgICAgICAgICAgICBiZSByZXNvbHZlZC9yZWplY3RlZCBvbiByZWNlaXZpbmcgc2VydmVyIHJlcGx5XG4gICAqL1xuICB2aWRlb0NhbGwodG9waWNOYW1lLCBzZXEsIGV2dCwgcGF5bG9hZCkge1xuICAgIGNvbnN0IHBrdCA9IHRoaXMuI2luaXRQYWNrZXQoJ25vdGUnLCB0b3BpY05hbWUpO1xuICAgIHBrdC5ub3RlLnNlcSA9IHNlcTtcbiAgICBwa3Qubm90ZS53aGF0ID0gJ2NhbGwnO1xuICAgIHBrdC5ub3RlLmV2ZW50ID0gZXZ0O1xuICAgIHBrdC5ub3RlLnBheWxvYWQgPSBwYXlsb2FkO1xuICAgIHRoaXMuI3NlbmQocGt0LCBwa3Qubm90ZS5pZCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGEgbmFtZWQgdG9waWMsIGVpdGhlciBwdWxsIGl0IGZyb20gY2FjaGUgb3IgY3JlYXRlIGEgbmV3IGluc3RhbmNlLlxuICAgKiBUaGVyZSBpcyBhIHNpbmdsZSBpbnN0YW5jZSBvZiB0b3BpYyBmb3IgZWFjaCBuYW1lLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWNOYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gZ2V0LlxuICAgKiBAcmV0dXJucyB7VGlub2RlLlRvcGljfSBSZXF1ZXN0ZWQgb3IgbmV3bHkgY3JlYXRlZCB0b3BpYyBvciA8Y29kZT51bmRlZmluZWQ8L2NvZGU+IGlmIHRvcGljIG5hbWUgaXMgaW52YWxpZC5cbiAgICovXG4gIGdldFRvcGljKHRvcGljTmFtZSkge1xuICAgIGxldCB0b3BpYyA9IHRoaXMuI2NhY2hlR2V0KCd0b3BpYycsIHRvcGljTmFtZSk7XG4gICAgaWYgKCF0b3BpYyAmJiB0b3BpY05hbWUpIHtcbiAgICAgIGlmICh0b3BpY05hbWUgPT0gQ29uc3QuVE9QSUNfTUUpIHtcbiAgICAgICAgdG9waWMgPSBuZXcgVG9waWNNZSgpO1xuICAgICAgfSBlbHNlIGlmICh0b3BpY05hbWUgPT0gQ29uc3QuVE9QSUNfRk5EKSB7XG4gICAgICAgIHRvcGljID0gbmV3IFRvcGljRm5kKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0b3BpYyA9IG5ldyBUb3BpYyh0b3BpY05hbWUpO1xuICAgICAgfVxuICAgICAgLy8gQ2FjaGUgbWFuYWdlbWVudC5cbiAgICAgIHRoaXMuI2F0dGFjaENhY2hlVG9Ub3BpYyh0b3BpYyk7XG4gICAgICB0b3BpYy5fY2FjaGVQdXRTZWxmKCk7XG4gICAgICAvLyBEb24ndCBzYXZlIHRvIERCIGhlcmU6IGEgcmVjb3JkIHdpbGwgYmUgYWRkZWQgd2hlbiB0aGUgdG9waWMgaXMgc3Vic2NyaWJlZC5cbiAgICB9XG4gICAgcmV0dXJuIHRvcGljO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhIG5hbWVkIHRvcGljIGZyb20gY2FjaGUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpY05hbWUgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byBnZXQuXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuVG9waWN9IFJlcXVlc3RlZCB0b3BpYyBvciA8Y29kZT51bmRlZmluZWQ8L2NvZGU+IGlmIHRvcGljIGlzIG5vdCBmb3VuZCBpbiBjYWNoZS5cbiAgICovXG4gIGNhY2hlR2V0VG9waWModG9waWNOYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuI2NhY2hlR2V0KCd0b3BpYycsIHRvcGljTmFtZSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIG5hbWVkIHRvcGljIGZyb20gY2FjaGUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpY05hbWUgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byByZW1vdmUgZnJvbSBjYWNoZS5cbiAgICovXG4gIGNhY2hlUmVtVG9waWModG9waWNOYW1lKSB7XG4gICAgdGhpcy4jY2FjaGVEZWwoJ3RvcGljJywgdG9waWNOYW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJdGVyYXRlIG92ZXIgY2FjaGVkIHRvcGljcy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyAtIGNhbGxiYWNrIHRvIGNhbGwgZm9yIGVhY2ggdG9waWMuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZXh0IC0gJ3RoaXMnIGluc2lkZSB0aGUgJ2Z1bmMnLlxuICAgKi9cbiAgbWFwVG9waWNzKGZ1bmMsIGNvbnRleHQpIHtcbiAgICB0aGlzLiNjYWNoZU1hcCgndG9waWMnLCBmdW5jLCBjb250ZXh0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBuYW1lZCB0b3BpYyBpcyBhbHJlYWR5IHByZXNlbnQgaW4gY2FjaGUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpY05hbWUgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byBjaGVjay5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgdG9waWMgaXMgZm91bmQgaW4gY2FjaGUsIGZhbHNlIG90aGVyd2lzZS5cbiAgICovXG4gIGlzVG9waWNDYWNoZWQodG9waWNOYW1lKSB7XG4gICAgcmV0dXJuICEhdGhpcy4jY2FjaGVHZXQoJ3RvcGljJywgdG9waWNOYW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZSB1bmlxdWUgbmFtZSBsaWtlIDxjb2RlPiduZXcxMjM0NTYnPC9jb2RlPiBzdWl0YWJsZSBmb3IgY3JlYXRpbmcgYSBuZXcgZ3JvdXAgdG9waWMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNDaGFuIC0gaWYgdGhlIHRvcGljIGlzIGNoYW5uZWwtZW5hYmxlZC5cbiAgICogQHJldHVybnMge3N0cmluZ30gbmFtZSB3aGljaCBjYW4gYmUgdXNlZCBmb3IgY3JlYXRpbmcgYSBuZXcgZ3JvdXAgdG9waWMuXG4gICAqL1xuICBuZXdHcm91cFRvcGljTmFtZShpc0NoYW4pIHtcbiAgICByZXR1cm4gKGlzQ2hhbiA/IENvbnN0LlRPUElDX05FV19DSEFOIDogQ29uc3QuVE9QSUNfTkVXKSArIHRoaXMuZ2V0TmV4dFVuaXF1ZUlkKCk7XG4gIH1cblxuICAvKipcbiAgICogSW5zdGFudGlhdGUgPGNvZGU+J21lJzwvY29kZT4gdG9waWMgb3IgZ2V0IGl0IGZyb20gY2FjaGUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuVG9waWNNZX0gSW5zdGFuY2Ugb2YgPGNvZGU+J21lJzwvY29kZT4gdG9waWMuXG4gICAqL1xuICBnZXRNZVRvcGljKCkge1xuICAgIHJldHVybiB0aGlzLmdldFRvcGljKENvbnN0LlRPUElDX01FKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnN0YW50aWF0ZSA8Y29kZT4nZm5kJzwvY29kZT4gKGZpbmQpIHRvcGljIG9yIGdldCBpdCBmcm9tIGNhY2hlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLlRvcGljfSBJbnN0YW5jZSBvZiA8Y29kZT4nZm5kJzwvY29kZT4gdG9waWMuXG4gICAqL1xuICBnZXRGbmRUb3BpYygpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRUb3BpYyhDb25zdC5UT1BJQ19GTkQpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyB7QGxpbmsgTGFyZ2VGaWxlSGVscGVyfSBpbnN0YW5jZVxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLkxhcmdlRmlsZUhlbHBlcn0gaW5zdGFuY2Ugb2YgYSB7QGxpbmsgVGlub2RlLkxhcmdlRmlsZUhlbHBlcn0uXG4gICAqL1xuICBnZXRMYXJnZUZpbGVIZWxwZXIoKSB7XG4gICAgcmV0dXJuIG5ldyBMYXJnZUZpbGVIZWxwZXIodGhpcywgQ29uc3QuUFJPVE9DT0xfVkVSU0lPTik7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBVSUQgb2YgdGhlIHRoZSBjdXJyZW50IGF1dGhlbnRpY2F0ZWQgdXNlci5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICogQHJldHVybnMge3N0cmluZ30gVUlEIG9mIHRoZSBjdXJyZW50IHVzZXIgb3IgPGNvZGU+dW5kZWZpbmVkPC9jb2RlPiBpZiB0aGUgc2Vzc2lvbiBpcyBub3QgeWV0IGF1dGhlbnRpY2F0ZWQgb3IgaWYgdGhlcmUgaXMgbm8gc2Vzc2lvbi5cbiAgICovXG4gIGdldEN1cnJlbnRVc2VySUQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX215VUlEO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSBnaXZlbiB1c2VyIElEIGlzIGVxdWFsIHRvIHRoZSBjdXJyZW50IHVzZXIncyBVSUQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1aWQgLSBVSUQgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIHRoZSBnaXZlbiBVSUQgYmVsb25ncyB0byB0aGUgY3VycmVudCBsb2dnZWQgaW4gdXNlci5cbiAgICovXG4gIGlzTWUodWlkKSB7XG4gICAgcmV0dXJuIHRoaXMuX215VUlEID09PSB1aWQ7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGxvZ2luIHVzZWQgZm9yIGxhc3Qgc3VjY2Vzc2Z1bCBhdXRoZW50aWNhdGlvbi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICogQHJldHVybnMge3N0cmluZ30gbG9naW4gbGFzdCB1c2VkIHN1Y2Nlc3NmdWxseSBvciA8Y29kZT51bmRlZmluZWQ8L2NvZGU+LlxuICAgKi9cbiAgZ2V0Q3VycmVudExvZ2luKCkge1xuICAgIHJldHVybiB0aGlzLl9sb2dpbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gaW5mb3JtYXRpb24gYWJvdXQgdGhlIHNlcnZlcjogcHJvdG9jb2wgdmVyc2lvbiBhbmQgYnVpbGQgdGltZXN0YW1wLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKiBAcmV0dXJucyB7T2JqZWN0fSBidWlsZCBhbmQgdmVyc2lvbiBvZiB0aGUgc2VydmVyIG9yIDxjb2RlPm51bGw8L2NvZGU+IGlmIHRoZXJlIGlzIG5vIGNvbm5lY3Rpb24gb3IgaWYgdGhlIGZpcnN0IHNlcnZlciByZXNwb25zZSBoYXMgbm90IGJlZW4gcmVjZWl2ZWQgeWV0LlxuICAgKi9cbiAgZ2V0U2VydmVySW5mbygpIHtcbiAgICByZXR1cm4gdGhpcy5fc2VydmVySW5mbztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXBvcnQgYSB0b3BpYyBmb3IgYWJ1c2UuIFdyYXBwZXIgZm9yIHtAbGluayBUaW5vZGUjcHVibGlzaH0uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBhY3Rpb24gLSB0aGUgb25seSBzdXBwb3J0ZWQgYWN0aW9uIGlzICdyZXBvcnQnLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGFyZ2V0IC0gbmFtZSBvZiB0aGUgdG9waWMgYmVpbmcgcmVwb3J0ZWQuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHRvIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIHNlcnZlciByZXNwb25kcyB0byByZXF1ZXN0LlxuICAgKi9cbiAgcmVwb3J0KGFjdGlvbiwgdGFyZ2V0KSB7XG4gICAgcmV0dXJuIHRoaXMucHVibGlzaChDb25zdC5UT1BJQ19TWVMsIERyYWZ0eS5hdHRhY2hKU09OKG51bGwsIHtcbiAgICAgICdhY3Rpb24nOiBhY3Rpb24sXG4gICAgICAndGFyZ2V0JzogdGFyZ2V0XG4gICAgfSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiBzZXJ2ZXItcHJvdmlkZWQgY29uZmlndXJhdGlvbiB2YWx1ZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgb2YgdGhlIHZhbHVlIHRvIHJldHVybi5cbiAgICogQHBhcmFtIHtPYmplY3R9IGRlZmF1bHRWYWx1ZSB0byByZXR1cm4gaW4gY2FzZSB0aGUgcGFyYW1ldGVyIGlzIG5vdCBzZXQgb3Igbm90IGZvdW5kLlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSBuYW1lZCB2YWx1ZS5cbiAgICovXG4gIGdldFNlcnZlclBhcmFtKG5hbWUsIGRlZmF1bHRWYWx1ZSkge1xuICAgIHJldHVybiB0aGlzLl9zZXJ2ZXJJbmZvICYmIHRoaXMuX3NlcnZlckluZm9bbmFtZV0gfHwgZGVmYXVsdFZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFRvZ2dsZSBjb25zb2xlIGxvZ2dpbmcuIExvZ2dpbmcgaXMgb2ZmIGJ5IGRlZmF1bHQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gZW5hYmxlZCAtIFNldCB0byA8Y29kZT50cnVlPC9jb2RlPiB0byBlbmFibGUgbG9nZ2luZyB0byBjb25zb2xlLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHRyaW1Mb25nU3RyaW5ncyAtIFNldCB0byA8Y29kZT50cnVlPC9jb2RlPiB0byB0cmltIGxvbmcgc3RyaW5ncy5cbiAgICovXG4gIGVuYWJsZUxvZ2dpbmcoZW5hYmxlZCwgdHJpbUxvbmdTdHJpbmdzKSB7XG4gICAgdGhpcy5fbG9nZ2luZ0VuYWJsZWQgPSBlbmFibGVkO1xuICAgIHRoaXMuX3RyaW1Mb25nU3RyaW5ncyA9IGVuYWJsZWQgJiYgdHJpbUxvbmdTdHJpbmdzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCBVSSBsYW5ndWFnZSB0byByZXBvcnQgdG8gdGhlIHNlcnZlci4gTXVzdCBiZSBjYWxsZWQgYmVmb3JlIDxjb2RlPidoaSc8L2NvZGU+IGlzIHNlbnQsIG90aGVyd2lzZSBpdCB3aWxsIG5vdCBiZSB1c2VkLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gaGwgLSBodW1hbiAoVUkpIGxhbmd1YWdlLCBsaWtlIDxjb2RlPlwiZW5fVVNcIjwvY29kZT4gb3IgPGNvZGU+XCJ6aC1IYW5zXCI8L2NvZGU+LlxuICAgKi9cbiAgc2V0SHVtYW5MYW5ndWFnZShobCkge1xuICAgIGlmIChobCkge1xuICAgICAgdGhpcy5faHVtYW5MYW5ndWFnZSA9IGhsO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBnaXZlbiB0b3BpYyBpcyBvbmxpbmUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIG9mIHRoZSB0b3BpYyB0byB0ZXN0LlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiB0b3BpYyBpcyBvbmxpbmUsIGZhbHNlIG90aGVyd2lzZS5cbiAgICovXG4gIGlzVG9waWNPbmxpbmUobmFtZSkge1xuICAgIGNvbnN0IHRvcGljID0gdGhpcy4jY2FjaGVHZXQoJ3RvcGljJywgbmFtZSk7XG4gICAgcmV0dXJuIHRvcGljICYmIHRvcGljLm9ubGluZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYWNjZXNzIG1vZGUgZm9yIHRoZSBnaXZlbiBjb250YWN0LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBvZiB0aGUgdG9waWMgdG8gcXVlcnkuXG4gICAqIEByZXR1cm5zIHtBY2Nlc3NNb2RlfSBhY2Nlc3MgbW9kZSBpZiB0b3BpYyBpcyBmb3VuZCwgbnVsbCBvdGhlcndpc2UuXG4gICAqL1xuICBnZXRUb3BpY0FjY2Vzc01vZGUobmFtZSkge1xuICAgIGNvbnN0IHRvcGljID0gdGhpcy4jY2FjaGVHZXQoJ3RvcGljJywgbmFtZSk7XG4gICAgcmV0dXJuIHRvcGljID8gdG9waWMuYWNzIDogbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbmNsdWRlIG1lc3NhZ2UgSUQgaW50byBhbGwgc3Vic2VxdWVzdCBtZXNzYWdlcyB0byBzZXJ2ZXIgaW5zdHJ1Y3RpbiBpdCB0byBzZW5kIGFrbm93bGVkZ2VtZW5zLlxuICAgKiBSZXF1aXJlZCBmb3IgcHJvbWlzZXMgdG8gZnVuY3Rpb24uIERlZmF1bHQgaXMgPGNvZGU+XCJvblwiPC9jb2RlPi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSBzdGF0dXMgLSBUdXJuIGFrbm93bGVkZ2VtZW5zIG9uIG9yIG9mZi5cbiAgICogQGRlcHJlY2F0ZWRcbiAgICovXG4gIHdhbnRBa24oc3RhdHVzKSB7XG4gICAgaWYgKHN0YXR1cykge1xuICAgICAgdGhpcy5fbWVzc2FnZUlkID0gTWF0aC5mbG9vcigoTWF0aC5yYW5kb20oKSAqIDB4RkZGRkZGKSArIDB4RkZGRkZGKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fbWVzc2FnZUlkID0gMDtcbiAgICB9XG4gIH1cblxuICAvLyBDYWxsYmFja3M6XG4gIC8qKlxuICAgKiBDYWxsYmFjayB0byByZXBvcnQgd2hlbiB0aGUgd2Vic29ja2V0IGlzIG9wZW5lZC4gVGhlIGNhbGxiYWNrIGhhcyBubyBwYXJhbWV0ZXJzLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKiBAdHlwZSB7VGlub2RlLm9uV2Vic29ja2V0T3Blbn1cbiAgICovXG4gIG9uV2Vic29ja2V0T3BlbiA9IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQHR5cGVkZWYgVGlub2RlLlNlcnZlclBhcmFtc1xuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB2ZXIgLSBTZXJ2ZXIgdmVyc2lvblxuICAgKiBAcHJvcGVydHkge3N0cmluZ30gYnVpbGQgLSBTZXJ2ZXIgYnVpbGRcbiAgICogQHByb3BlcnR5IHtzdHJpbmc9fSBzaWQgLSBTZXNzaW9uIElELCBsb25nIHBvbGxpbmcgY29ubmVjdGlvbnMgb25seS5cbiAgICovXG5cbiAgLyoqXG4gICAqIEBjYWxsYmFjayBUaW5vZGUub25Db25uZWN0XG4gICAqIEBwYXJhbSB7bnVtYmVyfSBjb2RlIC0gUmVzdWx0IGNvZGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRleHQgLSBUZXh0IGVweHBsYWluaW5nIHRoZSBjb21wbGV0aW9uLCBpLmUgXCJPS1wiIG9yIGFuIGVycm9yIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7VGlub2RlLlNlcnZlclBhcmFtc30gcGFyYW1zIC0gUGFyYW1ldGVycyByZXR1cm5lZCBieSB0aGUgc2VydmVyLlxuICAgKi9cbiAgLyoqXG4gICAqIENhbGxiYWNrIHRvIHJlcG9ydCB3aGVuIGNvbm5lY3Rpb24gd2l0aCBUaW5vZGUgc2VydmVyIGlzIGVzdGFibGlzaGVkLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKiBAdHlwZSB7VGlub2RlLm9uQ29ubmVjdH1cbiAgICovXG4gIG9uQ29ubmVjdCA9IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQ2FsbGJhY2sgdG8gcmVwb3J0IHdoZW4gY29ubmVjdGlvbiBpcyBsb3N0LiBUaGUgY2FsbGJhY2sgaGFzIG5vIHBhcmFtZXRlcnMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqIEB0eXBlIHtUaW5vZGUub25EaXNjb25uZWN0fVxuICAgKi9cbiAgb25EaXNjb25uZWN0ID0gdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBAY2FsbGJhY2sgVGlub2RlLm9uTG9naW5cbiAgICogQHBhcmFtIHtudW1iZXJ9IGNvZGUgLSBOVW1lcmljIGNvbXBsZXRpb24gY29kZSwgc2FtZSBhcyBIVFRQIHN0YXR1cyBjb2Rlcy5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHRleHQgLSBFeHBsYW5hdGlvbiBvZiB0aGUgY29tcGxldGlvbiBjb2RlLlxuICAgKi9cbiAgLyoqXG4gICAqIENhbGxiYWNrIHRvIHJlcG9ydCBsb2dpbiBjb21wbGV0aW9uLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKiBAdHlwZSB7VGlub2RlLm9uTG9naW59XG4gICAqL1xuICBvbkxvZ2luID0gdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBDYWxsYmFjayB0byByZWNlaXZlIDxjb2RlPntjdHJsfTwvY29kZT4gKGNvbnRyb2wpIG1lc3NhZ2VzLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKiBAdHlwZSB7VGlub2RlLm9uQ3RybE1lc3NhZ2V9XG4gICAqL1xuICBvbkN0cmxNZXNzYWdlID0gdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBDYWxsYmFjayB0byByZWNpZXZlIDxjb2RlPntkYXRhfTwvY29kZT4gKGNvbnRlbnQpIG1lc3NhZ2VzLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKiBAdHlwZSB7VGlub2RlLm9uRGF0YU1lc3NhZ2V9XG4gICAqL1xuICBvbkRhdGFNZXNzYWdlID0gdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBDYWxsYmFjayB0byByZWNlaXZlIDxjb2RlPntwcmVzfTwvY29kZT4gKHByZXNlbmNlKSBtZXNzYWdlcy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICogQHR5cGUge1Rpbm9kZS5vblByZXNNZXNzYWdlfVxuICAgKi9cbiAgb25QcmVzTWVzc2FnZSA9IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQ2FsbGJhY2sgdG8gcmVjZWl2ZSBhbGwgbWVzc2FnZXMgYXMgb2JqZWN0cy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICogQHR5cGUge1Rpbm9kZS5vbk1lc3NhZ2V9XG4gICAqL1xuICBvbk1lc3NhZ2UgPSB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIHRvIHJlY2VpdmUgYWxsIG1lc3NhZ2VzIGFzIHVucGFyc2VkIHRleHQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqIEB0eXBlIHtUaW5vZGUub25SYXdNZXNzYWdlfVxuICAgKi9cbiAgb25SYXdNZXNzYWdlID0gdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBDYWxsYmFjayB0byByZWNlaXZlIHNlcnZlciByZXNwb25zZXMgdG8gbmV0d29yayBwcm9iZXMuIFNlZSB7QGxpbmsgVGlub2RlI25ldHdvcmtQcm9iZX1cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICogQHR5cGUge1Rpbm9kZS5vbk5ldHdvcmtQcm9iZX1cbiAgICovXG4gIG9uTmV0d29ya1Byb2JlID0gdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBDYWxsYmFjayB0byBiZSBub3RpZmllZCB3aGVuIGV4cG9uZW50aWFsIGJhY2tvZmYgaXMgaXRlcmF0aW5nLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKiBAdHlwZSB7VGlub2RlLm9uQXV0b3JlY29ubmVjdEl0ZXJhdGlvbn1cbiAgICovXG4gIG9uQXV0b3JlY29ubmVjdEl0ZXJhdGlvbiA9IHVuZGVmaW5lZDtcbn07XG5cbi8vIEV4cG9ydGVkIGNvbnN0YW50c1xuVGlub2RlLk1FU1NBR0VfU1RBVFVTX05PTkUgPSBDb25zdC5NRVNTQUdFX1NUQVRVU19OT05FO1xuVGlub2RlLk1FU1NBR0VfU1RBVFVTX1FVRVVFRCA9IENvbnN0Lk1FU1NBR0VfU1RBVFVTX1FVRVVFRDtcblRpbm9kZS5NRVNTQUdFX1NUQVRVU19TRU5ESU5HID0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfU0VORElORztcblRpbm9kZS5NRVNTQUdFX1NUQVRVU19GQUlMRUQgPSBDb25zdC5NRVNTQUdFX1NUQVRVU19GQUlMRUQ7XG5UaW5vZGUuTUVTU0FHRV9TVEFUVVNfU0VOVCA9IENvbnN0Lk1FU1NBR0VfU1RBVFVTX1NFTlQ7XG5UaW5vZGUuTUVTU0FHRV9TVEFUVVNfUkVDRUlWRUQgPSBDb25zdC5NRVNTQUdFX1NUQVRVU19SRUNFSVZFRDtcblRpbm9kZS5NRVNTQUdFX1NUQVRVU19SRUFEID0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfUkVBRDtcblRpbm9kZS5NRVNTQUdFX1NUQVRVU19UT19NRSA9IENvbnN0Lk1FU1NBR0VfU1RBVFVTX1RPX01FO1xuVGlub2RlLk1FU1NBR0VfU1RBVFVTX0RFTF9SQU5HRSA9IENvbnN0Lk1FU1NBR0VfU1RBVFVTX0RFTF9SQU5HRTtcblxuLy8gVW5pY29kZSBbZGVsXSBzeW1ib2wuXG5UaW5vZGUuREVMX0NIQVIgPSBDb25zdC5ERUxfQ0hBUjtcblxuLy8gTmFtZXMgb2Yga2V5cyB0byBzZXJ2ZXItcHJvdmlkZWQgY29uZmlndXJhdGlvbiBsaW1pdHMuXG5UaW5vZGUuTUFYX01FU1NBR0VfU0laRSA9ICdtYXhNZXNzYWdlU2l6ZSc7XG5UaW5vZGUuTUFYX1NVQlNDUklCRVJfQ09VTlQgPSAnbWF4U3Vic2NyaWJlckNvdW50JztcblRpbm9kZS5NQVhfVEFHX0NPVU5UID0gJ21heFRhZ0NvdW50JztcblRpbm9kZS5NQVhfRklMRV9VUExPQURfU0laRSA9ICdtYXhGaWxlVXBsb2FkU2l6ZSc7XG4iLCIvKipcbiAqIEBmaWxlIFRvcGljIG1hbmFnZW1lbnQuXG4gKlxuICogQGNvcHlyaWdodCAyMDE1LTIwMjIgVGlub2RlIExMQy5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgQWNjZXNzTW9kZSBmcm9tICcuL2FjY2Vzcy1tb2RlLmpzJztcbmltcG9ydCBDQnVmZmVyIGZyb20gJy4vY2J1ZmZlci5qcyc7XG5pbXBvcnQgKiBhcyBDb25zdCBmcm9tICcuL2NvbmZpZy5qcyc7XG5pbXBvcnQgRHJhZnR5IGZyb20gJy4vZHJhZnR5LmpzJztcbmltcG9ydCBNZXRhR2V0QnVpbGRlciBmcm9tICcuL21ldGEtYnVpbGRlci5qcyc7XG5pbXBvcnQge1xuICBtZXJnZU9iaixcbiAgbWVyZ2VUb0NhY2hlLFxuICBub3JtYWxpemVBcnJheVxufSBmcm9tICcuL3V0aWxzLmpzJztcblxuZXhwb3J0IGNsYXNzIFRvcGljIHtcbiAgLyoqXG4gICAqIEBjYWxsYmFjayBUaW5vZGUuVG9waWMub25EYXRhXG4gICAqIEBwYXJhbSB7RGF0YX0gZGF0YSAtIERhdGEgcGFja2V0XG4gICAqL1xuICAvKipcbiAgICogVG9waWMgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgYSBsb2dpY2FsIGNvbW11bmljYXRpb24gY2hhbm5lbC5cbiAgICogQGNsYXNzIFRvcGljXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byBjcmVhdGUuXG4gICAqIEBwYXJhbSB7T2JqZWN0PX0gY2FsbGJhY2tzIC0gT2JqZWN0IHdpdGggdmFyaW91cyBldmVudCBjYWxsYmFja3MuXG4gICAqIEBwYXJhbSB7VGlub2RlLlRvcGljLm9uRGF0YX0gY2FsbGJhY2tzLm9uRGF0YSAtIENhbGxiYWNrIHdoaWNoIHJlY2VpdmVzIGEgPGNvZGU+e2RhdGF9PC9jb2RlPiBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge2NhbGxiYWNrfSBjYWxsYmFja3Mub25NZXRhIC0gQ2FsbGJhY2sgd2hpY2ggcmVjZWl2ZXMgYSA8Y29kZT57bWV0YX08L2NvZGU+IG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7Y2FsbGJhY2t9IGNhbGxiYWNrcy5vblByZXMgLSBDYWxsYmFjayB3aGljaCByZWNlaXZlcyBhIDxjb2RlPntwcmVzfTwvY29kZT4gbWVzc2FnZS5cbiAgICogQHBhcmFtIHtjYWxsYmFja30gY2FsbGJhY2tzLm9uSW5mbyAtIENhbGxiYWNrIHdoaWNoIHJlY2VpdmVzIGFuIDxjb2RlPntpbmZvfTwvY29kZT4gbWVzc2FnZS5cbiAgICogQHBhcmFtIHtjYWxsYmFja30gY2FsbGJhY2tzLm9uTWV0YURlc2MgLSBDYWxsYmFjayB3aGljaCByZWNlaXZlcyBjaGFuZ2VzIHRvIHRvcGljIGRlc2N0aW9wdGlvbiB7QGxpbmsgZGVzY30uXG4gICAqIEBwYXJhbSB7Y2FsbGJhY2t9IGNhbGxiYWNrcy5vbk1ldGFTdWIgLSBDYWxsZWQgZm9yIGEgc2luZ2xlIHN1YnNjcmlwdGlvbiByZWNvcmQgY2hhbmdlLlxuICAgKiBAcGFyYW0ge2NhbGxiYWNrfSBjYWxsYmFja3Mub25TdWJzVXBkYXRlZCAtIENhbGxlZCBhZnRlciBhIGJhdGNoIG9mIHN1YnNjcmlwdGlvbiBjaGFuZ2VzIGhhdmUgYmVlbiByZWNpZXZlZCBhbmQgY2FjaGVkLlxuICAgKiBAcGFyYW0ge2NhbGxiYWNrfSBjYWxsYmFja3Mub25EZWxldGVUb3BpYyAtIENhbGxlZCBhZnRlciB0aGUgdG9waWMgaXMgZGVsZXRlZC5cbiAgICogQHBhcmFtIHtjYWxsYmFja30gY2FsbGJhY2xzLm9uQWxsTWVzc2FnZXNSZWNlaXZlZCAtIENhbGxlZCB3aGVuIGFsbCByZXF1ZXN0ZWQgPGNvZGU+e2RhdGF9PC9jb2RlPiBtZXNzYWdlcyBoYXZlIGJlZW4gcmVjaXZlZC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG5hbWUsIGNhbGxiYWNrcykge1xuICAgIC8vIFBhcmVudCBUaW5vZGUgb2JqZWN0LlxuICAgIHRoaXMuX3Rpbm9kZSA9IG51bGw7XG5cbiAgICAvLyBTZXJ2ZXItcHJvdmlkZWQgZGF0YSwgbG9jYWxseSBpbW11dGFibGUuXG4gICAgLy8gdG9waWMgbmFtZVxuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgLy8gVGltZXN0YW1wIHdoZW4gdGhlIHRvcGljIHdhcyBjcmVhdGVkLlxuICAgIHRoaXMuY3JlYXRlZCA9IG51bGw7XG4gICAgLy8gVGltZXN0YW1wIHdoZW4gdGhlIHRvcGljIHdhcyBsYXN0IHVwZGF0ZWQuXG4gICAgdGhpcy51cGRhdGVkID0gbnVsbDtcbiAgICAvLyBUaW1lc3RhbXAgb2YgdGhlIGxhc3QgbWVzc2FnZXNcbiAgICB0aGlzLnRvdWNoZWQgPSBuZXcgRGF0ZSgwKTtcbiAgICAvLyBBY2Nlc3MgbW9kZSwgc2VlIEFjY2Vzc01vZGVcbiAgICB0aGlzLmFjcyA9IG5ldyBBY2Nlc3NNb2RlKG51bGwpO1xuICAgIC8vIFBlci10b3BpYyBwcml2YXRlIGRhdGEgKGFjY2Vzc2libGUgYnkgY3VycmVudCB1c2VyIG9ubHkpLlxuICAgIHRoaXMucHJpdmF0ZSA9IG51bGw7XG4gICAgLy8gUGVyLXRvcGljIHB1YmxpYyBkYXRhIChhY2Nlc3NpYmxlIGJ5IGFsbCB1c2VycykuXG4gICAgdGhpcy5wdWJsaWMgPSBudWxsO1xuICAgIC8vIFBlci10b3BpYyBzeXN0ZW0tcHJvdmlkZWQgZGF0YSAoYWNjZXNzaWJsZSBieSBhbGwgdXNlcnMpLlxuICAgIHRoaXMudHJ1c3RlZCA9IG51bGw7XG5cbiAgICAvLyBMb2NhbGx5IGNhY2hlZCBkYXRhXG4gICAgLy8gU3Vic2NyaWJlZCB1c2VycywgZm9yIHRyYWNraW5nIHJlYWQvcmVjdi9tc2cgbm90aWZpY2F0aW9ucy5cbiAgICB0aGlzLl91c2VycyA9IHt9O1xuXG4gICAgLy8gQ3VycmVudCB2YWx1ZSBvZiBsb2NhbGx5IGlzc3VlZCBzZXFJZCwgdXNlZCBmb3IgcGVuZGluZyBtZXNzYWdlcy5cbiAgICB0aGlzLl9xdWV1ZWRTZXFJZCA9IENvbnN0LkxPQ0FMX1NFUUlEO1xuXG4gICAgLy8gVGhlIG1heGltdW0ga25vd24ge2RhdGEuc2VxfSB2YWx1ZS5cbiAgICB0aGlzLl9tYXhTZXEgPSAwO1xuICAgIC8vIFRoZSBtaW5pbXVtIGtub3duIHtkYXRhLnNlcX0gdmFsdWUuXG4gICAgdGhpcy5fbWluU2VxID0gMDtcbiAgICAvLyBJbmRpY2F0b3IgdGhhdCB0aGUgbGFzdCByZXF1ZXN0IGZvciBlYXJsaWVyIG1lc3NhZ2VzIHJldHVybmVkIDAuXG4gICAgdGhpcy5fbm9FYXJsaWVyTXNncyA9IGZhbHNlO1xuICAgIC8vIFRoZSBtYXhpbXVtIGtub3duIGRlbGV0aW9uIElELlxuICAgIHRoaXMuX21heERlbCA9IDA7XG4gICAgLy8gVGltZXIgb2JqZWN0IHVzZWQgdG8gc2VuZCAncmVjdicgbm90aWZpY2F0aW9ucy5cbiAgICB0aGlzLl9yZWN2Tm90aWZpY2F0aW9uVGltZXIgPSBudWxsO1xuXG4gICAgLy8gVXNlciBkaXNjb3ZlcnkgdGFnc1xuICAgIHRoaXMuX3RhZ3MgPSBbXTtcbiAgICAvLyBDcmVkZW50aWFscyBzdWNoIGFzIGVtYWlsIG9yIHBob25lIG51bWJlci5cbiAgICB0aGlzLl9jcmVkZW50aWFscyA9IFtdO1xuICAgIC8vIE1lc3NhZ2UgdmVyc2lvbnMgY2FjaGUgKGUuZy4gZm9yIGVkaXRlZCBtZXNzYWdlcykuXG4gICAgLy8gS2V5czogb3JpZ2luYWwgbWVzc2FnZSBzZXEgaWRzLlxuICAgIC8vIFZhbHVlczogQ0J1ZmZlcnMgY29udGFpbmluZyBuZXdlciB2ZXJzaW9ucyBvZiB0aGUgb3JpZ2luYWwgbWVzc2FnZVxuICAgIC8vIG9yZGVyZWQgYnkgc2VxIGlkLlxuICAgIHRoaXMuX21lc3NhZ2VWZXJzaW9ucyA9IHt9O1xuICAgIC8vIE1lc3NhZ2UgY2FjaGUsIHNvcnRlZCBieSBtZXNzYWdlIHNlcSB2YWx1ZXMsIGZyb20gb2xkIHRvIG5ldy5cbiAgICB0aGlzLl9tZXNzYWdlcyA9IG5ldyBDQnVmZmVyKChhLCBiKSA9PiB7XG4gICAgICByZXR1cm4gYS5zZXEgLSBiLnNlcTtcbiAgICB9LCB0cnVlKTtcbiAgICAvLyBCb29sZWFuLCB0cnVlIGlmIHRoZSB0b3BpYyBpcyBjdXJyZW50bHkgbGl2ZVxuICAgIHRoaXMuX2F0dGFjaGVkID0gZmFsc2U7XG4gICAgLy8gVGltZXN0YXAgb2YgdGhlIG1vc3QgcmVjZW50bHkgdXBkYXRlZCBzdWJzY3JpcHRpb24uXG4gICAgdGhpcy5fbGFzdFN1YnNVcGRhdGUgPSBuZXcgRGF0ZSgwKTtcbiAgICAvLyBUb3BpYyBjcmVhdGVkIGJ1dCBub3QgeWV0IHN5bmNlZCB3aXRoIHRoZSBzZXJ2ZXIuIFVzZWQgb25seSBkdXJpbmcgaW5pdGlhbGl6YXRpb24uXG4gICAgdGhpcy5fbmV3ID0gdHJ1ZTtcbiAgICAvLyBUaGUgdG9waWMgaXMgZGVsZXRlZCBhdCB0aGUgc2VydmVyLCB0aGlzIGlzIGEgbG9jYWwgY29weS5cbiAgICB0aGlzLl9kZWxldGVkID0gZmFsc2U7XG5cbiAgICAvLyBUaW1lciB1c2VkIHRvIHRyZ2dlciB7bGVhdmV9IHJlcXVlc3QgYWZ0ZXIgYSBkZWxheS5cbiAgICB0aGlzLl9kZWxheWVkTGVhdmVUaW1lciA9IG51bGw7XG5cbiAgICAvLyBDYWxsYmFja3NcbiAgICBpZiAoY2FsbGJhY2tzKSB7XG4gICAgICB0aGlzLm9uRGF0YSA9IGNhbGxiYWNrcy5vbkRhdGE7XG4gICAgICB0aGlzLm9uTWV0YSA9IGNhbGxiYWNrcy5vbk1ldGE7XG4gICAgICB0aGlzLm9uUHJlcyA9IGNhbGxiYWNrcy5vblByZXM7XG4gICAgICB0aGlzLm9uSW5mbyA9IGNhbGxiYWNrcy5vbkluZm87XG4gICAgICAvLyBBIHNpbmdsZSBkZXNjIHVwZGF0ZTtcbiAgICAgIHRoaXMub25NZXRhRGVzYyA9IGNhbGxiYWNrcy5vbk1ldGFEZXNjO1xuICAgICAgLy8gQSBzaW5nbGUgc3Vic2NyaXB0aW9uIHJlY29yZDtcbiAgICAgIHRoaXMub25NZXRhU3ViID0gY2FsbGJhY2tzLm9uTWV0YVN1YjtcbiAgICAgIC8vIEFsbCBzdWJzY3JpcHRpb24gcmVjb3JkcyByZWNlaXZlZDtcbiAgICAgIHRoaXMub25TdWJzVXBkYXRlZCA9IGNhbGxiYWNrcy5vblN1YnNVcGRhdGVkO1xuICAgICAgdGhpcy5vblRhZ3NVcGRhdGVkID0gY2FsbGJhY2tzLm9uVGFnc1VwZGF0ZWQ7XG4gICAgICB0aGlzLm9uQ3JlZHNVcGRhdGVkID0gY2FsbGJhY2tzLm9uQ3JlZHNVcGRhdGVkO1xuICAgICAgdGhpcy5vbkRlbGV0ZVRvcGljID0gY2FsbGJhY2tzLm9uRGVsZXRlVG9waWM7XG4gICAgICB0aGlzLm9uQWxsTWVzc2FnZXNSZWNlaXZlZCA9IGNhbGxiYWNrcy5vbkFsbE1lc3NhZ2VzUmVjZWl2ZWQ7XG4gICAgfVxuICB9XG5cbiAgLy8gU3RhdGljIG1ldGhvZHMuXG5cbiAgLyoqXG4gICAqIERldGVybWluZSB0b3BpYyB0eXBlIGZyb20gdG9waWMncyBuYW1lOiBncnAsIHAycCwgbWUsIGZuZCwgc3lzLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gdGVzdC5cbiAgICogQHJldHVybnMge3N0cmluZ30gT25lIG9mIDxjb2RlPlwibWVcIjwvY29kZT4sIDxjb2RlPlwiZm5kXCI8L2NvZGU+LCA8Y29kZT5cInN5c1wiPC9jb2RlPiwgPGNvZGU+XCJncnBcIjwvY29kZT4sXG4gICAqICAgIDxjb2RlPlwicDJwXCI8L2NvZGU+IG9yIDxjb2RlPnVuZGVmaW5lZDwvY29kZT4uXG4gICAqL1xuICBzdGF0aWMgdG9waWNUeXBlKG5hbWUpIHtcbiAgICBjb25zdCB0eXBlcyA9IHtcbiAgICAgICdtZSc6IENvbnN0LlRPUElDX01FLFxuICAgICAgJ2ZuZCc6IENvbnN0LlRPUElDX0ZORCxcbiAgICAgICdncnAnOiBDb25zdC5UT1BJQ19HUlAsXG4gICAgICAnbmV3JzogQ29uc3QuVE9QSUNfR1JQLFxuICAgICAgJ25jaCc6IENvbnN0LlRPUElDX0dSUCxcbiAgICAgICdjaG4nOiBDb25zdC5UT1BJQ19HUlAsXG4gICAgICAndXNyJzogQ29uc3QuVE9QSUNfUDJQLFxuICAgICAgJ3N5cyc6IENvbnN0LlRPUElDX1NZU1xuICAgIH07XG4gICAgcmV0dXJuIHR5cGVzWyh0eXBlb2YgbmFtZSA9PSAnc3RyaW5nJykgPyBuYW1lLnN1YnN0cmluZygwLCAzKSA6ICd4eHgnXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgZ2l2ZW4gdG9waWMgbmFtZSBpcyBhIG5hbWUgb2YgYSAnbWUnIHRvcGljLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gdGVzdC5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIHRoZSBuYW1lIGlzIGEgbmFtZSBvZiBhICdtZScgdG9waWMsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBzdGF0aWMgaXNNZVRvcGljTmFtZShuYW1lKSB7XG4gICAgcmV0dXJuIFRvcGljLnRvcGljVHlwZShuYW1lKSA9PSBDb25zdC5UT1BJQ19NRTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgZ2l2ZW4gdG9waWMgbmFtZSBpcyBhIG5hbWUgb2YgYSBncm91cCB0b3BpYy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIHRlc3QuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0aGUgbmFtZSBpcyBhIG5hbWUgb2YgYSBncm91cCB0b3BpYywgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIHN0YXRpYyBpc0dyb3VwVG9waWNOYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gVG9waWMudG9waWNUeXBlKG5hbWUpID09IENvbnN0LlRPUElDX0dSUDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgZ2l2ZW4gdG9waWMgbmFtZSBpcyBhIG5hbWUgb2YgYSBwMnAgdG9waWMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byB0ZXN0LlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgdGhlIG5hbWUgaXMgYSBuYW1lIG9mIGEgcDJwIHRvcGljLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgc3RhdGljIGlzUDJQVG9waWNOYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gVG9waWMudG9waWNUeXBlKG5hbWUpID09IENvbnN0LlRPUElDX1AyUDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgZ2l2ZW4gdG9waWMgbmFtZSBpcyBhIG5hbWUgb2YgYSBjb21tdW5pY2F0aW9uIHRvcGljLCBpLmUuIFAyUCBvciBncm91cC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIHRlc3QuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0aGUgbmFtZSBpcyBhIG5hbWUgb2YgYSBwMnAgb3IgZ3JvdXAgdG9waWMsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBzdGF0aWMgaXNDb21tVG9waWNOYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gVG9waWMuaXNQMlBUb3BpY05hbWUobmFtZSkgfHwgVG9waWMuaXNHcm91cFRvcGljTmFtZShuYW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgdG9waWMgbmFtZSBpcyBhIG5hbWUgb2YgYSBuZXcgdG9waWMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSB0b3BpYyBuYW1lIHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgdGhlIG5hbWUgaXMgYSBuYW1lIG9mIGEgbmV3IHRvcGljLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgc3RhdGljIGlzTmV3R3JvdXBUb3BpY05hbWUobmFtZSkge1xuICAgIHJldHVybiAodHlwZW9mIG5hbWUgPT0gJ3N0cmluZycpICYmXG4gICAgICAobmFtZS5zdWJzdHJpbmcoMCwgMykgPT0gQ29uc3QuVE9QSUNfTkVXIHx8IG5hbWUuc3Vic3RyaW5nKDAsIDMpID09IENvbnN0LlRPUElDX05FV19DSEFOKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgdG9waWMgbmFtZSBpcyBhIG5hbWUgb2YgYSBjaGFubmVsLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gdG9waWMgbmFtZSB0byBjaGVjay5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIHRoZSBuYW1lIGlzIGEgbmFtZSBvZiBhIGNoYW5uZWwsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBzdGF0aWMgaXNDaGFubmVsVG9waWNOYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gKHR5cGVvZiBuYW1lID09ICdzdHJpbmcnKSAmJlxuICAgICAgKG5hbWUuc3Vic3RyaW5nKDAsIDMpID09IENvbnN0LlRPUElDX0NIQU4gfHwgbmFtZS5zdWJzdHJpbmcoMCwgMykgPT0gQ29uc3QuVE9QSUNfTkVXX0NIQU4pO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSB0b3BpYyBpcyBzdWJzY3JpYmVkLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpcyB0b3BpYyBpcyBhdHRhY2hlZC9zdWJzY3JpYmVkLCBmYWxzZSBvdGhlcndpc2UuXG4gICAqL1xuICBpc1N1YnNjcmliZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2F0dGFjaGVkO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcXVlc3QgdG9waWMgdG8gc3Vic2NyaWJlLiBXcmFwcGVyIGZvciB7QGxpbmsgVGlub2RlI3N1YnNjcmliZX0uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7VGlub2RlLkdldFF1ZXJ5PX0gZ2V0UGFyYW1zIC0gZ2V0IHF1ZXJ5IHBhcmFtZXRlcnMuXG4gICAqIEBwYXJhbSB7VGlub2RlLlNldFBhcmFtcz19IHNldFBhcmFtcyAtIHNldCBwYXJhbWV0ZXJzLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBzZXJ2ZXIgcmVzcG9uZHMgdG8gdGhlIHJlcXVlc3QuXG4gICAqL1xuICBzdWJzY3JpYmUoZ2V0UGFyYW1zLCBzZXRQYXJhbXMpIHtcbiAgICAvLyBDbGVhciByZXF1ZXN0IHRvIGxlYXZlIHRvcGljLlxuICAgIGNsZWFyVGltZW91dCh0aGlzLl9kZWxheWVkTGVhdmVUaW1lcik7XG4gICAgdGhpcy5fZGVsYXllZExlYXZlVGltZXIgPSBudWxsO1xuXG4gICAgLy8gSWYgdGhlIHRvcGljIGlzIGFscmVhZHkgc3Vic2NyaWJlZCwgcmV0dXJuIHJlc29sdmVkIHByb21pc2VcbiAgICBpZiAodGhpcy5fYXR0YWNoZWQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcyk7XG4gICAgfVxuXG4gICAgLy8gSWYgdGhlIHRvcGljIGlzIGRlbGV0ZWQsIHJlamVjdCBzdWJzY3JpcHRpb24gcmVxdWVzdHMuXG4gICAgaWYgKHRoaXMuX2RlbGV0ZWQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJDb252ZXJzYXRpb24gZGVsZXRlZFwiKSk7XG4gICAgfVxuXG4gICAgLy8gU2VuZCBzdWJzY3JpYmUgbWVzc2FnZSwgaGFuZGxlIGFzeW5jIHJlc3BvbnNlLlxuICAgIC8vIElmIHRvcGljIG5hbWUgaXMgZXhwbGljaXRseSBwcm92aWRlZCwgdXNlIGl0LiBJZiBubyBuYW1lLCB0aGVuIGl0J3MgYSBuZXcgZ3JvdXAgdG9waWMsXG4gICAgLy8gdXNlIFwibmV3XCIuXG4gICAgcmV0dXJuIHRoaXMuX3Rpbm9kZS5zdWJzY3JpYmUodGhpcy5uYW1lIHx8IENvbnN0LlRPUElDX05FVywgZ2V0UGFyYW1zLCBzZXRQYXJhbXMpLnRoZW4oKGN0cmwpID0+IHtcbiAgICAgIGlmIChjdHJsLmNvZGUgPj0gMzAwKSB7XG4gICAgICAgIC8vIERvIG5vdGhpbmcgaWYgc3Vic2NyaXB0aW9uIHN0YXR1cyBoYXMgbm90IGNoYW5nZWQuXG4gICAgICAgIHJldHVybiBjdHJsO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9hdHRhY2hlZCA9IHRydWU7XG4gICAgICB0aGlzLl9kZWxldGVkID0gZmFsc2U7XG4gICAgICB0aGlzLmFjcyA9IChjdHJsLnBhcmFtcyAmJiBjdHJsLnBhcmFtcy5hY3MpID8gY3RybC5wYXJhbXMuYWNzIDogdGhpcy5hY3M7XG5cbiAgICAgIC8vIFNldCB0b3BpYyBuYW1lIGZvciBuZXcgdG9waWNzIGFuZCBhZGQgaXQgdG8gY2FjaGUuXG4gICAgICBpZiAodGhpcy5fbmV3KSB7XG4gICAgICAgIGRlbGV0ZSB0aGlzLl9uZXc7XG5cbiAgICAgICAgaWYgKHRoaXMubmFtZSAhPSBjdHJsLnRvcGljKSB7XG4gICAgICAgICAgLy8gTmFtZSBtYXkgY2hhbmdlIG5ldzEyMzQ1NiAtPiBncnBBYkNkRWYuIFJlbW92ZSBmcm9tIGNhY2hlIHVuZGVyIHRoZSBvbGQgbmFtZS5cbiAgICAgICAgICB0aGlzLl9jYWNoZURlbFNlbGYoKTtcbiAgICAgICAgICB0aGlzLm5hbWUgPSBjdHJsLnRvcGljO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2NhY2hlUHV0U2VsZigpO1xuXG4gICAgICAgIHRoaXMuY3JlYXRlZCA9IGN0cmwudHM7XG4gICAgICAgIHRoaXMudXBkYXRlZCA9IGN0cmwudHM7XG5cbiAgICAgICAgaWYgKHRoaXMubmFtZSAhPSBDb25zdC5UT1BJQ19NRSAmJiB0aGlzLm5hbWUgIT0gQ29uc3QuVE9QSUNfRk5EKSB7XG4gICAgICAgICAgLy8gQWRkIHRoZSBuZXcgdG9waWMgdG8gdGhlIGxpc3Qgb2YgY29udGFjdHMgbWFpbnRhaW5lZCBieSB0aGUgJ21lJyB0b3BpYy5cbiAgICAgICAgICBjb25zdCBtZSA9IHRoaXMuX3Rpbm9kZS5nZXRNZVRvcGljKCk7XG4gICAgICAgICAgaWYgKG1lLm9uTWV0YVN1Yikge1xuICAgICAgICAgICAgbWUub25NZXRhU3ViKHRoaXMpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAobWUub25TdWJzVXBkYXRlZCkge1xuICAgICAgICAgICAgbWUub25TdWJzVXBkYXRlZChbdGhpcy5uYW1lXSwgMSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNldFBhcmFtcyAmJiBzZXRQYXJhbXMuZGVzYykge1xuICAgICAgICAgIHNldFBhcmFtcy5kZXNjLl9ub0ZvcndhcmRpbmcgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuX3Byb2Nlc3NNZXRhRGVzYyhzZXRQYXJhbXMuZGVzYyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBjdHJsO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIGRyYWZ0IG9mIGEgbWVzc2FnZSB3aXRob3V0IHNlbmRpbmcgaXQgdG8gdGhlIHNlcnZlci5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmcgfCBPYmplY3R9IGRhdGEgLSBDb250ZW50IHRvIHdyYXAgaW4gYSBkcmFmdC5cbiAgICogQHBhcmFtIHtib29sZWFuPX0gbm9FY2hvIC0gSWYgPGNvZGU+dHJ1ZTwvY29kZT4gc2VydmVyIHdpbGwgbm90IGVjaG8gbWVzc2FnZSBiYWNrIHRvIG9yaWdpbmF0aW5nXG4gICAqIHNlc3Npb24uIE90aGVyd2lzZSB0aGUgc2VydmVyIHdpbGwgc2VuZCBhIGNvcHkgb2YgdGhlIG1lc3NhZ2UgdG8gc2VuZGVyLlxuICAgKlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSBtZXNzYWdlIGRyYWZ0LlxuICAgKi9cbiAgY3JlYXRlTWVzc2FnZShkYXRhLCBub0VjaG8pIHtcbiAgICByZXR1cm4gdGhpcy5fdGlub2RlLmNyZWF0ZU1lc3NhZ2UodGhpcy5uYW1lLCBkYXRhLCBub0VjaG8pO1xuICB9XG4gIC8qKlxuICAgKiBJbW1lZGlhdGVseSBwdWJsaXNoIGRhdGEgdG8gdG9waWMuIFdyYXBwZXIgZm9yIHtAbGluayBUaW5vZGUjcHVibGlzaH0uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nIHwgT2JqZWN0fSBkYXRhIC0gRGF0YSB0byBwdWJsaXNoLCBlaXRoZXIgcGxhaW4gc3RyaW5nIG9yIGEgRHJhZnR5IG9iamVjdC5cbiAgICogQHBhcmFtIHtib29sZWFuPX0gbm9FY2hvIC0gSWYgPGNvZGU+dHJ1ZTwvY29kZT4gc2VydmVyIHdpbGwgbm90IGVjaG8gbWVzc2FnZSBiYWNrIHRvIG9yaWdpbmF0aW5nXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHRvIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIHNlcnZlciByZXNwb25kcyB0byB0aGUgcmVxdWVzdC5cbiAgICovXG4gIHB1Ymxpc2goZGF0YSwgbm9FY2hvKSB7XG4gICAgcmV0dXJuIHRoaXMucHVibGlzaE1lc3NhZ2UodGhpcy5jcmVhdGVNZXNzYWdlKGRhdGEsIG5vRWNobykpO1xuICB9XG4gIC8qKlxuICAgKiBQdWJsaXNoIG1lc3NhZ2UgY3JlYXRlZCBieSB7QGxpbmsgVGlub2RlLlRvcGljI2NyZWF0ZU1lc3NhZ2V9LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcHViIC0ge2RhdGF9IG9iamVjdCB0byBwdWJsaXNoLiBNdXN0IGJlIGNyZWF0ZWQgYnkge0BsaW5rIFRpbm9kZS5Ub3BpYyNjcmVhdGVNZXNzYWdlfVxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBzZXJ2ZXIgcmVzcG9uZHMgdG8gdGhlIHJlcXVlc3QuXG4gICAqL1xuICBwdWJsaXNoTWVzc2FnZShwdWIpIHtcbiAgICBpZiAoIXRoaXMuX2F0dGFjaGVkKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiQ2Fubm90IHB1Ymxpc2ggb24gaW5hY3RpdmUgdG9waWNcIikpO1xuICAgIH1cbiAgICBpZiAodGhpcy5fc2VuZGluZykge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIlRoZSBtZXNzYWdlIGlzIGFscmVhZHkgYmVpbmcgc2VudFwiKSk7XG4gICAgfVxuXG4gICAgLy8gU2VuZCBkYXRhLlxuICAgIHB1Yi5fc2VuZGluZyA9IHRydWU7XG4gICAgcHViLl9mYWlsZWQgPSBmYWxzZTtcblxuICAgIC8vIEV4dHJhY3QgcmVmZXJlY2VzIHRvIGF0dGFjaG1lbnRzIGFuZCBvdXQgb2YgYmFuZCBpbWFnZSByZWNvcmRzLlxuICAgIGxldCBhdHRhY2htZW50cyA9IG51bGw7XG4gICAgaWYgKERyYWZ0eS5oYXNFbnRpdGllcyhwdWIuY29udGVudCkpIHtcbiAgICAgIGF0dGFjaG1lbnRzID0gW107XG4gICAgICBEcmFmdHkuZW50aXRpZXMocHViLmNvbnRlbnQsIChkYXRhKSA9PiB7XG4gICAgICAgIGlmIChkYXRhICYmIGRhdGEucmVmKSB7XG4gICAgICAgICAgYXR0YWNobWVudHMucHVzaChkYXRhLnJlZik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgaWYgKGF0dGFjaG1lbnRzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgIGF0dGFjaG1lbnRzID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fdGlub2RlLnB1Ymxpc2hNZXNzYWdlKHB1YiwgYXR0YWNobWVudHMpLnRoZW4oKGN0cmwpID0+IHtcbiAgICAgIHB1Yi5fc2VuZGluZyA9IGZhbHNlO1xuICAgICAgcHViLnRzID0gY3RybC50cztcbiAgICAgIHRoaXMuc3dhcE1lc3NhZ2VJZChwdWIsIGN0cmwucGFyYW1zLnNlcSk7XG4gICAgICB0aGlzLl9yb3V0ZURhdGEocHViKTtcbiAgICAgIHJldHVybiBjdHJsO1xuICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgIHRoaXMuX3Rpbm9kZS5sb2dnZXIoXCJXQVJOSU5HOiBNZXNzYWdlIHJlamVjdGVkIGJ5IHRoZSBzZXJ2ZXJcIiwgZXJyKTtcbiAgICAgIHB1Yi5fc2VuZGluZyA9IGZhbHNlO1xuICAgICAgcHViLl9mYWlsZWQgPSB0cnVlO1xuICAgICAgaWYgKHRoaXMub25EYXRhKSB7XG4gICAgICAgIHRoaXMub25EYXRhKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgLyoqXG4gICAqIEFkZCBtZXNzYWdlIHRvIGxvY2FsIG1lc3NhZ2UgY2FjaGUsIHNlbmQgdG8gdGhlIHNlcnZlciB3aGVuIHRoZSBwcm9taXNlIGlzIHJlc29sdmVkLlxuICAgKiBJZiBwcm9taXNlIGlzIG51bGwgb3IgdW5kZWZpbmVkLCB0aGUgbWVzc2FnZSB3aWxsIGJlIHNlbnQgaW1tZWRpYXRlbHkuXG4gICAqIFRoZSBtZXNzYWdlIGlzIHNlbnQgd2hlbiB0aGVcbiAgICogVGhlIG1lc3NhZ2Ugc2hvdWxkIGJlIGNyZWF0ZWQgYnkge0BsaW5rIFRpbm9kZS5Ub3BpYyNjcmVhdGVNZXNzYWdlfS5cbiAgICogVGhpcyBpcyBwcm9iYWJseSBub3QgdGhlIGZpbmFsIEFQSS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHB1YiAtIE1lc3NhZ2UgdG8gdXNlIGFzIGEgZHJhZnQuXG4gICAqIEBwYXJhbSB7UHJvbWlzZX0gcHJvbSAtIE1lc3NhZ2Ugd2lsbCBiZSBzZW50IHdoZW4gdGhpcyBwcm9taXNlIGlzIHJlc29sdmVkLCBkaXNjYXJkZWQgaWYgcmVqZWN0ZWQuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBkZXJpdmVkIHByb21pc2UuXG4gICAqL1xuICBwdWJsaXNoRHJhZnQocHViLCBwcm9tKSB7XG4gICAgY29uc3Qgc2VxID0gcHViLnNlcSB8fCB0aGlzLl9nZXRRdWV1ZWRTZXFJZCgpO1xuICAgIGlmICghcHViLl9ub0ZvcndhcmRpbmcpIHtcbiAgICAgIC8vIFRoZSAnc2VxJywgJ3RzJywgYW5kICdmcm9tJyBhcmUgYWRkZWQgdG8gbWltaWMge2RhdGF9LiBUaGV5IGFyZSByZW1vdmVkIGxhdGVyXG4gICAgICAvLyBiZWZvcmUgdGhlIG1lc3NhZ2UgaXMgc2VudC5cbiAgICAgIHB1Yi5fbm9Gb3J3YXJkaW5nID0gdHJ1ZTtcbiAgICAgIHB1Yi5zZXEgPSBzZXE7XG4gICAgICBwdWIudHMgPSBuZXcgRGF0ZSgpO1xuICAgICAgcHViLmZyb20gPSB0aGlzLl90aW5vZGUuZ2V0Q3VycmVudFVzZXJJRCgpO1xuXG4gICAgICAvLyBEb24ndCBuZWVkIGFuIGVjaG8gbWVzc2FnZSBiZWNhdXNlIHRoZSBtZXNzYWdlIGlzIGFkZGVkIHRvIGxvY2FsIGNhY2hlIHJpZ2h0IGF3YXkuXG4gICAgICBwdWIubm9lY2hvID0gdHJ1ZTtcbiAgICAgIC8vIEFkZCB0byBjYWNoZS5cbiAgICAgIHRoaXMuX21lc3NhZ2VzLnB1dChwdWIpO1xuICAgICAgdGhpcy5fdGlub2RlLl9kYi5hZGRNZXNzYWdlKHB1Yik7XG5cbiAgICAgIGlmICh0aGlzLm9uRGF0YSkge1xuICAgICAgICB0aGlzLm9uRGF0YShwdWIpO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBJZiBwcm9taXNlIGlzIHByb3ZpZGVkLCBzZW5kIHRoZSBxdWV1ZWQgbWVzc2FnZSB3aGVuIGl0J3MgcmVzb2x2ZWQuXG4gICAgLy8gSWYgbm8gcHJvbWlzZSBpcyBwcm92aWRlZCwgY3JlYXRlIGEgcmVzb2x2ZWQgb25lIGFuZCBzZW5kIGltbWVkaWF0ZWx5LlxuICAgIHJldHVybiAocHJvbSB8fCBQcm9taXNlLnJlc29sdmUoKSlcbiAgICAgIC50aGVuKF8gPT4ge1xuICAgICAgICBpZiAocHViLl9jYW5jZWxsZWQpIHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY29kZTogMzAwLFxuICAgICAgICAgICAgdGV4dDogXCJjYW5jZWxsZWRcIlxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMucHVibGlzaE1lc3NhZ2UocHViKTtcbiAgICAgIH0pLmNhdGNoKGVyciA9PiB7XG4gICAgICAgIHRoaXMuX3Rpbm9kZS5sb2dnZXIoXCJXQVJOSU5HOiBNZXNzYWdlIGRyYWZ0IHJlamVjdGVkXCIsIGVycik7XG4gICAgICAgIHB1Yi5fc2VuZGluZyA9IGZhbHNlO1xuICAgICAgICBwdWIuX2ZhaWxlZCA9IHRydWU7XG4gICAgICAgIGlmICh0aGlzLm9uRGF0YSkge1xuICAgICAgICAgIHRoaXMub25EYXRhKCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gUmV0aHJvdyB0byBsZXQgY2FsbGVyIGtub3cgdGhhdCB0aGUgb3BlcmF0aW9uIGZhaWxlZC5cbiAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogTGVhdmUgdGhlIHRvcGljLCBvcHRpb25hbGx5IHVuc2lic2NyaWJlLiBMZWF2aW5nIHRoZSB0b3BpYyBtZWFucyB0aGUgdG9waWMgd2lsbCBzdG9wXG4gICAqIHJlY2VpdmluZyB1cGRhdGVzIGZyb20gdGhlIHNlcnZlci4gVW5zdWJzY3JpYmluZyB3aWxsIHRlcm1pbmF0ZSB1c2VyJ3MgcmVsYXRpb25zaGlwIHdpdGggdGhlIHRvcGljLlxuICAgKiBXcmFwcGVyIGZvciB7QGxpbmsgVGlub2RlI2xlYXZlfS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFuPX0gdW5zdWIgLSBJZiB0cnVlLCB1bnN1YnNjcmliZSwgb3RoZXJ3aXNlIGp1c3QgbGVhdmUuXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHRvIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIHNlcnZlciByZXNwb25kcyB0byB0aGUgcmVxdWVzdC5cbiAgICovXG4gIGxlYXZlKHVuc3ViKSB7XG4gICAgLy8gSXQncyBwb3NzaWJsZSB0byB1bnN1YnNjcmliZSAodW5zdWI9PXRydWUpIGZyb20gaW5hY3RpdmUgdG9waWMuXG4gICAgaWYgKCF0aGlzLl9hdHRhY2hlZCAmJiAhdW5zdWIpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJDYW5ub3QgbGVhdmUgaW5hY3RpdmUgdG9waWNcIikpO1xuICAgIH1cblxuICAgIC8vIFNlbmQgYSAnbGVhdmUnIG1lc3NhZ2UsIGhhbmRsZSBhc3luYyByZXNwb25zZVxuICAgIHJldHVybiB0aGlzLl90aW5vZGUubGVhdmUodGhpcy5uYW1lLCB1bnN1YikudGhlbigoY3RybCkgPT4ge1xuICAgICAgdGhpcy5fcmVzZXRTdWIoKTtcbiAgICAgIGlmICh1bnN1Yikge1xuICAgICAgICB0aGlzLl9nb25lKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY3RybDtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMZWF2ZSB0aGUgdG9waWMsIG9wdGlvbmFsbHkgdW5zaWJzY3JpYmUgYWZ0ZXIgYSBkZWxheS4gTGVhdmluZyB0aGUgdG9waWMgbWVhbnMgdGhlIHRvcGljIHdpbGwgc3RvcFxuICAgKiByZWNlaXZpbmcgdXBkYXRlcyBmcm9tIHRoZSBzZXJ2ZXIuIFVuc3Vic2NyaWJpbmcgd2lsbCB0ZXJtaW5hdGUgdXNlcidzIHJlbGF0aW9uc2hpcCB3aXRoIHRoZSB0b3BpYy5cbiAgICogV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNsZWF2ZX0uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gdW5zdWIgLSBJZiB0cnVlLCB1bnN1YnNjcmliZSwgb3RoZXJ3aXNlIGp1c3QgbGVhdmUuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBkZWxheSAtIHRpbWUgaW4gbWlsbGlzZWNvbmRzIHRvIGRlbGF5IGxlYXZlIHJlcXVlc3QuXG4gICAqL1xuICBsZWF2ZURlbGF5ZWQodW5zdWIsIGRlbGF5KSB7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuX2RlbGF5ZWRMZWF2ZVRpbWVyKTtcbiAgICB0aGlzLl9kZWxheWVkTGVhdmVUaW1lciA9IHNldFRpbWVvdXQoXyA9PiB7XG4gICAgICB0aGlzLl9kZWxheWVkTGVhdmVUaW1lciA9IG51bGw7XG4gICAgICB0aGlzLmxlYXZlKHVuc3ViKVxuICAgIH0sIGRlbGF5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXF1ZXN0IHRvcGljIG1ldGFkYXRhIGZyb20gdGhlIHNlcnZlci5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtUaW5vZGUuR2V0UXVlcnl9IHJlcXVlc3QgcGFyYW1ldGVyc1xuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBzZXJ2ZXIgcmVzcG9uZHMgdG8gcmVxdWVzdC5cbiAgICovXG4gIGdldE1ldGEocGFyYW1zKSB7XG4gICAgLy8gU2VuZCB7Z2V0fSBtZXNzYWdlLCByZXR1cm4gcHJvbWlzZS5cbiAgICByZXR1cm4gdGhpcy5fdGlub2RlLmdldE1ldGEodGhpcy5uYW1lLCBwYXJhbXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcXVlc3QgbW9yZSBtZXNzYWdlcyBmcm9tIHRoZSBzZXJ2ZXJcbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IGxpbWl0IG51bWJlciBvZiBtZXNzYWdlcyB0byBnZXQuXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gZm9yd2FyZCBpZiB0cnVlLCByZXF1ZXN0IG5ld2VyIG1lc3NhZ2VzLlxuICAgKi9cbiAgZ2V0TWVzc2FnZXNQYWdlKGxpbWl0LCBmb3J3YXJkKSB7XG4gICAgbGV0IHF1ZXJ5ID0gZm9yd2FyZCA/XG4gICAgICB0aGlzLnN0YXJ0TWV0YVF1ZXJ5KCkud2l0aExhdGVyRGF0YShsaW1pdCkgOlxuICAgICAgdGhpcy5zdGFydE1ldGFRdWVyeSgpLndpdGhFYXJsaWVyRGF0YShsaW1pdCk7XG5cbiAgICAvLyBGaXJzdCB0cnkgZmV0Y2hpbmcgZnJvbSBEQiwgdGhlbiBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAgcmV0dXJuIHRoaXMuX2xvYWRNZXNzYWdlcyh0aGlzLl90aW5vZGUuX2RiLCBxdWVyeS5leHRyYWN0KCdkYXRhJykpXG4gICAgICAudGhlbigoY291bnQpID0+IHtcbiAgICAgICAgaWYgKGNvdW50ID09IGxpbWl0KSB7XG4gICAgICAgICAgLy8gR290IGVub3VnaCBtZXNzYWdlcyBmcm9tIGxvY2FsIGNhY2hlLlxuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoe1xuICAgICAgICAgICAgdG9waWM6IHRoaXMubmFtZSxcbiAgICAgICAgICAgIGNvZGU6IDIwMCxcbiAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICBjb3VudDogY291bnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJlZHVjZSB0aGUgY291bnQgb2YgcmVxdWVzdGVkIG1lc3NhZ2VzLlxuICAgICAgICBsaW1pdCAtPSBjb3VudDtcbiAgICAgICAgLy8gVXBkYXRlIHF1ZXJ5IHdpdGggbmV3IHZhbHVlcyBsb2FkZWQgZnJvbSBEQi5cbiAgICAgICAgcXVlcnkgPSBmb3J3YXJkID8gdGhpcy5zdGFydE1ldGFRdWVyeSgpLndpdGhMYXRlckRhdGEobGltaXQpIDpcbiAgICAgICAgICB0aGlzLnN0YXJ0TWV0YVF1ZXJ5KCkud2l0aEVhcmxpZXJEYXRhKGxpbWl0KTtcbiAgICAgICAgbGV0IHByb21pc2UgPSB0aGlzLmdldE1ldGEocXVlcnkuYnVpbGQoKSk7XG4gICAgICAgIGlmICghZm9yd2FyZCkge1xuICAgICAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKGN0cmwpID0+IHtcbiAgICAgICAgICAgIGlmIChjdHJsICYmIGN0cmwucGFyYW1zICYmICFjdHJsLnBhcmFtcy5jb3VudCkge1xuICAgICAgICAgICAgICB0aGlzLl9ub0VhcmxpZXJNc2dzID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgIH0pO1xuICB9XG4gIC8qKlxuICAgKiBVcGRhdGUgdG9waWMgbWV0YWRhdGEuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7VGlub2RlLlNldFBhcmFtc30gcGFyYW1zIHBhcmFtZXRlcnMgdG8gdXBkYXRlLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBzZXJ2ZXIgcmVzcG9uZHMgdG8gcmVxdWVzdC5cbiAgICovXG4gIHNldE1ldGEocGFyYW1zKSB7XG4gICAgaWYgKHBhcmFtcy50YWdzKSB7XG4gICAgICBwYXJhbXMudGFncyA9IG5vcm1hbGl6ZUFycmF5KHBhcmFtcy50YWdzKTtcbiAgICB9XG4gICAgLy8gU2VuZCBTZXQgbWVzc2FnZSwgaGFuZGxlIGFzeW5jIHJlc3BvbnNlLlxuICAgIHJldHVybiB0aGlzLl90aW5vZGUuc2V0TWV0YSh0aGlzLm5hbWUsIHBhcmFtcylcbiAgICAgIC50aGVuKChjdHJsKSA9PiB7XG4gICAgICAgIGlmIChjdHJsICYmIGN0cmwuY29kZSA+PSAzMDApIHtcbiAgICAgICAgICAvLyBOb3QgbW9kaWZpZWRcbiAgICAgICAgICByZXR1cm4gY3RybDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwYXJhbXMuc3ViKSB7XG4gICAgICAgICAgcGFyYW1zLnN1Yi50b3BpYyA9IHRoaXMubmFtZTtcbiAgICAgICAgICBpZiAoY3RybC5wYXJhbXMgJiYgY3RybC5wYXJhbXMuYWNzKSB7XG4gICAgICAgICAgICBwYXJhbXMuc3ViLmFjcyA9IGN0cmwucGFyYW1zLmFjcztcbiAgICAgICAgICAgIHBhcmFtcy5zdWIudXBkYXRlZCA9IGN0cmwudHM7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICghcGFyYW1zLnN1Yi51c2VyKSB7XG4gICAgICAgICAgICAvLyBUaGlzIGlzIGEgc3Vic2NyaXB0aW9uIHVwZGF0ZSBvZiB0aGUgY3VycmVudCB1c2VyLlxuICAgICAgICAgICAgLy8gQXNzaWduIHVzZXIgSUQgb3RoZXJ3aXNlIHRoZSB1cGRhdGUgd2lsbCBiZSBpZ25vcmVkIGJ5IF9wcm9jZXNzTWV0YVN1Yi5cbiAgICAgICAgICAgIHBhcmFtcy5zdWIudXNlciA9IHRoaXMuX3Rpbm9kZS5nZXRDdXJyZW50VXNlcklEKCk7XG4gICAgICAgICAgICBpZiAoIXBhcmFtcy5kZXNjKSB7XG4gICAgICAgICAgICAgIC8vIEZvcmNlIHVwZGF0ZSB0byB0b3BpYydzIGFzYy5cbiAgICAgICAgICAgICAgcGFyYW1zLmRlc2MgPSB7fTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcGFyYW1zLnN1Yi5fbm9Gb3J3YXJkaW5nID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLl9wcm9jZXNzTWV0YVN1YihbcGFyYW1zLnN1Yl0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHBhcmFtcy5kZXNjKSB7XG4gICAgICAgICAgaWYgKGN0cmwucGFyYW1zICYmIGN0cmwucGFyYW1zLmFjcykge1xuICAgICAgICAgICAgcGFyYW1zLmRlc2MuYWNzID0gY3RybC5wYXJhbXMuYWNzO1xuICAgICAgICAgICAgcGFyYW1zLmRlc2MudXBkYXRlZCA9IGN0cmwudHM7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuX3Byb2Nlc3NNZXRhRGVzYyhwYXJhbXMuZGVzYyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocGFyYW1zLnRhZ3MpIHtcbiAgICAgICAgICB0aGlzLl9wcm9jZXNzTWV0YVRhZ3MocGFyYW1zLnRhZ3MpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwYXJhbXMuY3JlZCkge1xuICAgICAgICAgIHRoaXMuX3Byb2Nlc3NNZXRhQ3JlZHMoW3BhcmFtcy5jcmVkXSwgdHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY3RybDtcbiAgICAgIH0pO1xuICB9XG4gIC8qKlxuICAgKiBVcGRhdGUgYWNjZXNzIG1vZGUgb2YgdGhlIGN1cnJlbnQgdXNlciBvciBvZiBhbm90aGVyIHRvcGljIHN1YnNyaWJlci5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVpZCAtIFVJRCBvZiB0aGUgdXNlciB0byB1cGRhdGUgb3IgbnVsbCB0byB1cGRhdGUgY3VycmVudCB1c2VyLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdXBkYXRlIC0gdGhlIHVwZGF0ZSB2YWx1ZSwgZnVsbCBvciBkZWx0YS5cbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgdG8gYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgc2VydmVyIHJlc3BvbmRzIHRvIHJlcXVlc3QuXG4gICAqL1xuICB1cGRhdGVNb2RlKHVpZCwgdXBkYXRlKSB7XG4gICAgY29uc3QgdXNlciA9IHVpZCA/IHRoaXMuc3Vic2NyaWJlcih1aWQpIDogbnVsbDtcbiAgICBjb25zdCBhbSA9IHVzZXIgP1xuICAgICAgdXNlci5hY3MudXBkYXRlR2l2ZW4odXBkYXRlKS5nZXRHaXZlbigpIDpcbiAgICAgIHRoaXMuZ2V0QWNjZXNzTW9kZSgpLnVwZGF0ZVdhbnQodXBkYXRlKS5nZXRXYW50KCk7XG5cbiAgICByZXR1cm4gdGhpcy5zZXRNZXRhKHtcbiAgICAgIHN1Yjoge1xuICAgICAgICB1c2VyOiB1aWQsXG4gICAgICAgIG1vZGU6IGFtXG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgLyoqXG4gICAqIENyZWF0ZSBuZXcgdG9waWMgc3Vic2NyaXB0aW9uLiBXcmFwcGVyIGZvciB7QGxpbmsgVGlub2RlI3NldE1ldGF9LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdWlkIC0gSUQgb2YgdGhlIHVzZXIgdG8gaW52aXRlXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gbW9kZSAtIEFjY2VzcyBtb2RlLiA8Y29kZT5udWxsPC9jb2RlPiBtZWFucyB0byB1c2UgZGVmYXVsdC5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgdG8gYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgc2VydmVyIHJlc3BvbmRzIHRvIHJlcXVlc3QuXG4gICAqL1xuICBpbnZpdGUodWlkLCBtb2RlKSB7XG4gICAgcmV0dXJuIHRoaXMuc2V0TWV0YSh7XG4gICAgICBzdWI6IHtcbiAgICAgICAgdXNlcjogdWlkLFxuICAgICAgICBtb2RlOiBtb2RlXG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgLyoqXG4gICAqIEFyY2hpdmUgb3IgdW4tYXJjaGl2ZSB0aGUgdG9waWMuIFdyYXBwZXIgZm9yIHtAbGluayBUaW5vZGUjc2V0TWV0YX0uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gYXJjaCAtIHRydWUgdG8gYXJjaGl2ZSB0aGUgdG9waWMsIGZhbHNlIG90aGVyd2lzZS5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgdG8gYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgc2VydmVyIHJlc3BvbmRzIHRvIHJlcXVlc3QuXG4gICAqL1xuICBhcmNoaXZlKGFyY2gpIHtcbiAgICBpZiAodGhpcy5wcml2YXRlICYmICghdGhpcy5wcml2YXRlLmFyY2ggPT0gIWFyY2gpKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGFyY2gpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zZXRNZXRhKHtcbiAgICAgIGRlc2M6IHtcbiAgICAgICAgcHJpdmF0ZToge1xuICAgICAgICAgIGFyY2g6IGFyY2ggPyB0cnVlIDogQ29uc3QuREVMX0NIQVJcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIC8qKlxuICAgKiBEZWxldGUgbWVzc2FnZXMuIEhhcmQtZGVsZXRpbmcgbWVzc2FnZXMgcmVxdWlyZXMgT3duZXIgcGVybWlzc2lvbi5cbiAgICogV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNkZWxNZXNzYWdlc30uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7VGlub2RlLkRlbFJhbmdlW119IHJhbmdlcyAtIFJhbmdlcyBvZiBtZXNzYWdlIElEcyB0byBkZWxldGUuXG4gICAqIEBwYXJhbSB7Ym9vbGVhbj19IGhhcmQgLSBIYXJkIG9yIHNvZnQgZGVsZXRlXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHRvIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIHNlcnZlciByZXNwb25kcyB0byByZXF1ZXN0LlxuICAgKi9cbiAgZGVsTWVzc2FnZXMocmFuZ2VzLCBoYXJkKSB7XG4gICAgaWYgKCF0aGlzLl9hdHRhY2hlZCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIkNhbm5vdCBkZWxldGUgbWVzc2FnZXMgaW4gaW5hY3RpdmUgdG9waWNcIikpO1xuICAgIH1cblxuICAgIC8vIFNvcnQgcmFuZ2VzIGluIGFjY2VuZGluZyBvcmRlciBieSBsb3csIHRoZSBkZXNjZW5kaW5nIGJ5IGhpLlxuICAgIHJhbmdlcy5zb3J0KChyMSwgcjIpID0+IHtcbiAgICAgIGlmIChyMS5sb3cgPCByMi5sb3cpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBpZiAocjEubG93ID09IHIyLmxvdykge1xuICAgICAgICByZXR1cm4gIXIyLmhpIHx8IChyMS5oaSA+PSByMi5oaSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSk7XG5cbiAgICAvLyBSZW1vdmUgcGVuZGluZyBtZXNzYWdlcyBmcm9tIHJhbmdlcyBwb3NzaWJseSBjbGlwcGluZyBzb21lIHJhbmdlcy5cbiAgICBsZXQgdG9zZW5kID0gcmFuZ2VzLnJlZHVjZSgob3V0LCByKSA9PiB7XG4gICAgICBpZiAoci5sb3cgPCBDb25zdC5MT0NBTF9TRVFJRCkge1xuICAgICAgICBpZiAoIXIuaGkgfHwgci5oaSA8IENvbnN0LkxPQ0FMX1NFUUlEKSB7XG4gICAgICAgICAgb3V0LnB1c2gocik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gQ2xpcCBoaSB0byBtYXggYWxsb3dlZCB2YWx1ZS5cbiAgICAgICAgICBvdXQucHVzaCh7XG4gICAgICAgICAgICBsb3c6IHIubG93LFxuICAgICAgICAgICAgaGk6IHRoaXMuX21heFNlcSArIDFcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG91dDtcbiAgICB9LCBbXSk7XG5cbiAgICAvLyBTZW5kIHtkZWx9IG1lc3NhZ2UsIHJldHVybiBwcm9taXNlXG4gICAgbGV0IHJlc3VsdDtcbiAgICBpZiAodG9zZW5kLmxlbmd0aCA+IDApIHtcbiAgICAgIHJlc3VsdCA9IHRoaXMuX3Rpbm9kZS5kZWxNZXNzYWdlcyh0aGlzLm5hbWUsIHRvc2VuZCwgaGFyZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdCA9IFByb21pc2UucmVzb2x2ZSh7XG4gICAgICAgIHBhcmFtczoge1xuICAgICAgICAgIGRlbDogMFxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgLy8gVXBkYXRlIGxvY2FsIGNhY2hlLlxuICAgIHJldHVybiByZXN1bHQudGhlbigoY3RybCkgPT4ge1xuICAgICAgaWYgKGN0cmwucGFyYW1zLmRlbCA+IHRoaXMuX21heERlbCkge1xuICAgICAgICB0aGlzLl9tYXhEZWwgPSBjdHJsLnBhcmFtcy5kZWw7XG4gICAgICB9XG5cbiAgICAgIHJhbmdlcy5mb3JFYWNoKChyKSA9PiB7XG4gICAgICAgIGlmIChyLmhpKSB7XG4gICAgICAgICAgdGhpcy5mbHVzaE1lc3NhZ2VSYW5nZShyLmxvdywgci5oaSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5mbHVzaE1lc3NhZ2Uoci5sb3cpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5fdXBkYXRlRGVsZXRlZFJhbmdlcygpO1xuXG4gICAgICBpZiAodGhpcy5vbkRhdGEpIHtcbiAgICAgICAgLy8gQ2FsbGluZyB3aXRoIG5vIHBhcmFtZXRlcnMgdG8gaW5kaWNhdGUgdGhlIG1lc3NhZ2VzIHdlcmUgZGVsZXRlZC5cbiAgICAgICAgdGhpcy5vbkRhdGEoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjdHJsO1xuICAgIH0pO1xuICB9XG4gIC8qKlxuICAgKiBEZWxldGUgYWxsIG1lc3NhZ2VzLiBIYXJkLWRlbGV0aW5nIG1lc3NhZ2VzIHJlcXVpcmVzIE93bmVyIHBlcm1pc3Npb24uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gaGFyZERlbCAtIHRydWUgaWYgbWVzc2FnZXMgc2hvdWxkIGJlIGhhcmQtZGVsZXRlZC5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgdG8gYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgc2VydmVyIHJlc3BvbmRzIHRvIHJlcXVlc3QuXG4gICAqL1xuICBkZWxNZXNzYWdlc0FsbChoYXJkRGVsKSB7XG4gICAgaWYgKCF0aGlzLl9tYXhTZXEgfHwgdGhpcy5fbWF4U2VxIDw9IDApIHtcbiAgICAgIC8vIFRoZXJlIGFyZSBubyBtZXNzYWdlcyB0byBkZWxldGUuXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmRlbE1lc3NhZ2VzKFt7XG4gICAgICBsb3c6IDEsXG4gICAgICBoaTogdGhpcy5fbWF4U2VxICsgMSxcbiAgICAgIF9hbGw6IHRydWVcbiAgICB9XSwgaGFyZERlbCk7XG4gIH1cbiAgLyoqXG4gICAqIERlbGV0ZSBtdWx0aXBsZSBtZXNzYWdlcyBkZWZpbmVkIGJ5IHRoZWlyIElEcy4gSGFyZC1kZWxldGluZyBtZXNzYWdlcyByZXF1aXJlcyBPd25lciBwZXJtaXNzaW9uLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge1Rpbm9kZS5EZWxSYW5nZVtdfSBsaXN0IC0gbGlzdCBvZiBzZXEgSURzIHRvIGRlbGV0ZVxuICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBoYXJkRGVsIC0gdHJ1ZSBpZiBtZXNzYWdlcyBzaG91bGQgYmUgaGFyZC1kZWxldGVkLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBzZXJ2ZXIgcmVzcG9uZHMgdG8gcmVxdWVzdC5cbiAgICovXG4gIGRlbE1lc3NhZ2VzTGlzdChsaXN0LCBoYXJkRGVsKSB7XG4gICAgLy8gU29ydCB0aGUgbGlzdCBpbiBhc2NlbmRpbmcgb3JkZXJcbiAgICBsaXN0LnNvcnQoKGEsIGIpID0+IGEgLSBiKTtcbiAgICAvLyBDb252ZXJ0IHRoZSBhcnJheSBvZiBJRHMgdG8gcmFuZ2VzLlxuICAgIGxldCByYW5nZXMgPSBsaXN0LnJlZHVjZSgob3V0LCBpZCkgPT4ge1xuICAgICAgaWYgKG91dC5sZW5ndGggPT0gMCkge1xuICAgICAgICAvLyBGaXJzdCBlbGVtZW50LlxuICAgICAgICBvdXQucHVzaCh7XG4gICAgICAgICAgbG93OiBpZFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBwcmV2ID0gb3V0W291dC5sZW5ndGggLSAxXTtcbiAgICAgICAgaWYgKCghcHJldi5oaSAmJiAoaWQgIT0gcHJldi5sb3cgKyAxKSkgfHwgKGlkID4gcHJldi5oaSkpIHtcbiAgICAgICAgICAvLyBOZXcgcmFuZ2UuXG4gICAgICAgICAgb3V0LnB1c2goe1xuICAgICAgICAgICAgbG93OiBpZFxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIEV4cGFuZCBleGlzdGluZyByYW5nZS5cbiAgICAgICAgICBwcmV2LmhpID0gcHJldi5oaSA/IE1hdGgubWF4KHByZXYuaGksIGlkICsgMSkgOiBpZCArIDE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBvdXQ7XG4gICAgfSwgW10pO1xuICAgIC8vIFNlbmQge2RlbH0gbWVzc2FnZSwgcmV0dXJuIHByb21pc2VcbiAgICByZXR1cm4gdGhpcy5kZWxNZXNzYWdlcyhyYW5nZXMsIGhhcmREZWwpO1xuICB9XG4gIC8qKlxuICAgKiBEZWxldGUgdG9waWMuIFJlcXVpcmVzIE93bmVyIHBlcm1pc3Npb24uIFdyYXBwZXIgZm9yIHtAbGluayBUaW5vZGUjZGVsVG9waWN9LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGhhcmQgLSBoYWQtZGVsZXRlIHRvcGljLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBzZXJ2ZXIgcmVzcG9uZHMgdG8gdGhlIHJlcXVlc3QuXG4gICAqL1xuICBkZWxUb3BpYyhoYXJkKSB7XG4gICAgaWYgKHRoaXMuX2RlbGV0ZWQpIHtcbiAgICAgIC8vIFRoZSB0b3BpYyBpcyBhbHJlYWR5IGRlbGV0ZWQgYXQgdGhlIHNlcnZlciwganVzdCByZW1vdmUgZnJvbSBEQi5cbiAgICAgIHRoaXMuX2dvbmUoKTtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobnVsbCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3Rpbm9kZS5kZWxUb3BpYyh0aGlzLm5hbWUsIGhhcmQpLnRoZW4oKGN0cmwpID0+IHtcbiAgICAgIHRoaXMuX2RlbGV0ZWQgPSB0cnVlO1xuICAgICAgdGhpcy5fcmVzZXRTdWIoKTtcbiAgICAgIHRoaXMuX2dvbmUoKTtcbiAgICAgIHJldHVybiBjdHJsO1xuICAgIH0pO1xuICB9XG4gIC8qKlxuICAgKiBEZWxldGUgc3Vic2NyaXB0aW9uLiBSZXF1aXJlcyBTaGFyZSBwZXJtaXNzaW9uLiBXcmFwcGVyIGZvciB7QGxpbmsgVGlub2RlI2RlbFN1YnNjcmlwdGlvbn0uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1c2VyIC0gSUQgb2YgdGhlIHVzZXIgdG8gcmVtb3ZlIHN1YnNjcmlwdGlvbiBmb3IuXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHRvIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIHNlcnZlciByZXNwb25kcyB0byByZXF1ZXN0LlxuICAgKi9cbiAgZGVsU3Vic2NyaXB0aW9uKHVzZXIpIHtcbiAgICBpZiAoIXRoaXMuX2F0dGFjaGVkKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiQ2Fubm90IGRlbGV0ZSBzdWJzY3JpcHRpb24gaW4gaW5hY3RpdmUgdG9waWNcIikpO1xuICAgIH1cbiAgICAvLyBTZW5kIHtkZWx9IG1lc3NhZ2UsIHJldHVybiBwcm9taXNlXG4gICAgcmV0dXJuIHRoaXMuX3Rpbm9kZS5kZWxTdWJzY3JpcHRpb24odGhpcy5uYW1lLCB1c2VyKS50aGVuKChjdHJsKSA9PiB7XG4gICAgICAvLyBSZW1vdmUgdGhlIG9iamVjdCBmcm9tIHRoZSBzdWJzY3JpcHRpb24gY2FjaGU7XG4gICAgICBkZWxldGUgdGhpcy5fdXNlcnNbdXNlcl07XG4gICAgICAvLyBOb3RpZnkgbGlzdGVuZXJzXG4gICAgICBpZiAodGhpcy5vblN1YnNVcGRhdGVkKSB7XG4gICAgICAgIHRoaXMub25TdWJzVXBkYXRlZChPYmplY3Qua2V5cyh0aGlzLl91c2VycykpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGN0cmw7XG4gICAgfSk7XG4gIH1cbiAgLyoqXG4gICAqIFNlbmQgYSByZWFkL3JlY3Ygbm90aWZpY2F0aW9uLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gd2hhdCAtIHdoYXQgbm90aWZpY2F0aW9uIHRvIHNlbmQ6IDxjb2RlPnJlY3Y8L2NvZGU+LCA8Y29kZT5yZWFkPC9jb2RlPi5cbiAgICogQHBhcmFtIHtudW1iZXJ9IHNlcSAtIElEIG9yIHRoZSBtZXNzYWdlIHJlYWQgb3IgcmVjZWl2ZWQuXG4gICAqL1xuICBub3RlKHdoYXQsIHNlcSkge1xuICAgIGlmICghdGhpcy5fYXR0YWNoZWQpIHtcbiAgICAgIC8vIENhbm5vdCBzZW5kaW5nIHtub3RlfSBvbiBhbiBpbmFjdGl2ZSB0b3BpY1wiLlxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFVwZGF0ZSBsb2NhbCBjYWNoZSB3aXRoIHRoZSBuZXcgY291bnQuXG4gICAgY29uc3QgdXNlciA9IHRoaXMuX3VzZXJzW3RoaXMuX3Rpbm9kZS5nZXRDdXJyZW50VXNlcklEKCldO1xuICAgIGxldCB1cGRhdGUgPSBmYWxzZTtcbiAgICBpZiAodXNlcikge1xuICAgICAgLy8gU2VsZi1zdWJzY3JpcHRpb24gaXMgZm91bmQuXG4gICAgICBpZiAoIXVzZXJbd2hhdF0gfHwgdXNlclt3aGF0XSA8IHNlcSkge1xuICAgICAgICB1c2VyW3doYXRdID0gc2VxO1xuICAgICAgICB1cGRhdGUgPSB0cnVlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBTZWxmLXN1YnNjcmlwdGlvbiBpcyBub3QgZm91bmQuXG4gICAgICB1cGRhdGUgPSAodGhpc1t3aGF0XSB8IDApIDwgc2VxO1xuICAgIH1cblxuICAgIGlmICh1cGRhdGUpIHtcbiAgICAgIC8vIFNlbmQgbm90aWZpY2F0aW9uIHRvIHRoZSBzZXJ2ZXIuXG4gICAgICB0aGlzLl90aW5vZGUubm90ZSh0aGlzLm5hbWUsIHdoYXQsIHNlcSk7XG4gICAgICAvLyBVcGRhdGUgbG9jYWxseSBjYWNoZWQgY29udGFjdCB3aXRoIHRoZSBuZXcgY291bnQuXG4gICAgICB0aGlzLl91cGRhdGVSZWFkUmVjdih3aGF0LCBzZXEpO1xuXG4gICAgICBpZiAodGhpcy5hY3MgIT0gbnVsbCAmJiAhdGhpcy5hY3MuaXNNdXRlZCgpKSB7XG4gICAgICAgIGNvbnN0IG1lID0gdGhpcy5fdGlub2RlLmdldE1lVG9waWMoKTtcbiAgICAgICAgLy8gU2VudCBhIG5vdGlmaWNhdGlvbiB0byAnbWUnIGxpc3RlbmVycy5cbiAgICAgICAgbWUuX3JlZnJlc2hDb250YWN0KHdoYXQsIHRoaXMpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kIGEgJ3JlY3YnIHJlY2VpcHQuIFdyYXBwZXIgZm9yIHtAbGluayBUaW5vZGUjbm90ZVJlY3Z9LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gc2VxIC0gSUQgb2YgdGhlIG1lc3NhZ2UgdG8gYWtub3dsZWRnZS5cbiAgICovXG4gIG5vdGVSZWN2KHNlcSkge1xuICAgIHRoaXMubm90ZSgncmVjdicsIHNlcSk7XG4gIH1cbiAgLyoqXG4gICAqIFNlbmQgYSAncmVhZCcgcmVjZWlwdC4gV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNub3RlUmVhZH0uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzZXEgLSBJRCBvZiB0aGUgbWVzc2FnZSB0byBha25vd2xlZGdlIG9yIDAvdW5kZWZpbmVkIHRvIGFja25vd2xlZGdlIHRoZSBsYXRlc3QgbWVzc2FnZXMuXG4gICAqL1xuICBub3RlUmVhZChzZXEpIHtcbiAgICBzZXEgPSBzZXEgfHwgdGhpcy5fbWF4U2VxO1xuICAgIGlmIChzZXEgPiAwKSB7XG4gICAgICB0aGlzLm5vdGUoJ3JlYWQnLCBzZXEpO1xuICAgIH1cbiAgfVxuICAvKipcbiAgICogU2VuZCBhIGtleS1wcmVzcyBub3RpZmljYXRpb24uIFdyYXBwZXIgZm9yIHtAbGluayBUaW5vZGUjbm90ZUtleVByZXNzfS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICovXG4gIG5vdGVLZXlQcmVzcygpIHtcbiAgICBpZiAodGhpcy5fYXR0YWNoZWQpIHtcbiAgICAgIHRoaXMuX3Rpbm9kZS5ub3RlS2V5UHJlc3ModGhpcy5uYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fdGlub2RlLmxvZ2dlcihcIklORk86IENhbm5vdCBzZW5kIG5vdGlmaWNhdGlvbiBpbiBpbmFjdGl2ZSB0b3BpY1wiKTtcbiAgICB9XG4gIH1cbiAgLyoqXG4gICAqIFNlbmQgYSB7bm90ZSB3aGF0PSdjYWxsJ30uIFdyYXBwZXIgZm9yIHtAbGluayBUaW5vZGUjdmlkZW9DYWxsfS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGV2dCAtIENhbGwgZXZlbnQuXG4gICAqIEBwYXJhbSB7aW50fSBzZXEgLSBJRCBvZiB0aGUgY2FsbCBtZXNzYWdlIHRoZSBldmVudCBwZXJ0YWlucyB0by5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHBheWxvYWQgLSBQYXlsb2FkIGFzc29jaWF0ZWQgd2l0aCB0aGlzIGV2ZW50IChlLmcuIFNEUCBzdHJpbmcpLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSAoZm9yIHNvbWUgY2FsbCBldmVudHMpIHdoaWNoIHdpbGxcbiAgICogICAgICAgICAgICAgICAgICAgIGJlIHJlc29sdmVkL3JlamVjdGVkIG9uIHJlY2VpdmluZyBzZXJ2ZXIgcmVwbHlcbiAgICovXG4gIHZpZGVvQ2FsbChldnQsIHNlcSwgcGF5bG9hZCkge1xuICAgIGlmICghdGhpcy5fYXR0YWNoZWQgJiYgIVsncmluZ2luZycsICdoYW5nLXVwJ10uaW5jbHVkZXMoZXZ0KSkge1xuICAgICAgLy8gQ2Fubm90IHtjYWxsfSBvbiBhbiBpbmFjdGl2ZSB0b3BpY1wiLlxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fdGlub2RlLnZpZGVvQ2FsbCh0aGlzLm5hbWUsIHNlcSwgZXZ0LCBwYXlsb2FkKTtcbiAgfVxuXG4gIC8vIFVwZGF0ZSBjYWNoZWQgcmVhZC9yZWN2L3VucmVhZCBjb3VudHMuXG4gIF91cGRhdGVSZWFkUmVjdih3aGF0LCBzZXEsIHRzKSB7XG4gICAgbGV0IG9sZFZhbCwgZG9VcGRhdGUgPSBmYWxzZTtcblxuICAgIHNlcSA9IHNlcSB8IDA7XG4gICAgdGhpcy5zZXEgPSB0aGlzLnNlcSB8IDA7XG4gICAgdGhpcy5yZWFkID0gdGhpcy5yZWFkIHwgMDtcbiAgICB0aGlzLnJlY3YgPSB0aGlzLnJlY3YgfCAwO1xuICAgIHN3aXRjaCAod2hhdCkge1xuICAgICAgY2FzZSAncmVjdic6XG4gICAgICAgIG9sZFZhbCA9IHRoaXMucmVjdjtcbiAgICAgICAgdGhpcy5yZWN2ID0gTWF0aC5tYXgodGhpcy5yZWN2LCBzZXEpO1xuICAgICAgICBkb1VwZGF0ZSA9IChvbGRWYWwgIT0gdGhpcy5yZWN2KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdyZWFkJzpcbiAgICAgICAgb2xkVmFsID0gdGhpcy5yZWFkO1xuICAgICAgICB0aGlzLnJlYWQgPSBNYXRoLm1heCh0aGlzLnJlYWQsIHNlcSk7XG4gICAgICAgIGRvVXBkYXRlID0gKG9sZFZhbCAhPSB0aGlzLnJlYWQpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21zZyc6XG4gICAgICAgIG9sZFZhbCA9IHRoaXMuc2VxO1xuICAgICAgICB0aGlzLnNlcSA9IE1hdGgubWF4KHRoaXMuc2VxLCBzZXEpO1xuICAgICAgICBpZiAoIXRoaXMudG91Y2hlZCB8fCB0aGlzLnRvdWNoZWQgPCB0cykge1xuICAgICAgICAgIHRoaXMudG91Y2hlZCA9IHRzO1xuICAgICAgICB9XG4gICAgICAgIGRvVXBkYXRlID0gKG9sZFZhbCAhPSB0aGlzLnNlcSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIC8vIFNhbml0eSBjaGVja3MuXG4gICAgaWYgKHRoaXMucmVjdiA8IHRoaXMucmVhZCkge1xuICAgICAgdGhpcy5yZWN2ID0gdGhpcy5yZWFkO1xuICAgICAgZG9VcGRhdGUgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAodGhpcy5zZXEgPCB0aGlzLnJlY3YpIHtcbiAgICAgIHRoaXMuc2VxID0gdGhpcy5yZWN2O1xuICAgICAgaWYgKCF0aGlzLnRvdWNoZWQgfHwgdGhpcy50b3VjaGVkIDwgdHMpIHtcbiAgICAgICAgdGhpcy50b3VjaGVkID0gdHM7XG4gICAgICB9XG4gICAgICBkb1VwZGF0ZSA9IHRydWU7XG4gICAgfVxuICAgIHRoaXMudW5yZWFkID0gdGhpcy5zZXEgLSB0aGlzLnJlYWQ7XG4gICAgcmV0dXJuIGRvVXBkYXRlO1xuICB9XG4gIC8qKlxuICAgKiBHZXQgdXNlciBkZXNjcmlwdGlvbiBmcm9tIGdsb2JhbCBjYWNoZS4gVGhlIHVzZXIgZG9lcyBub3QgbmVlZCB0byBiZSBhXG4gICAqIHN1YnNjcmliZXIgb2YgdGhpcyB0b3BpYy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVpZCAtIElEIG9mIHRoZSB1c2VyIHRvIGZldGNoLlxuICAgKiBAcmV0dXJuIHtPYmplY3R9IHVzZXIgZGVzY3JpcHRpb24gb3IgdW5kZWZpbmVkLlxuICAgKi9cbiAgdXNlckRlc2ModWlkKSB7XG4gICAgLy8gVE9ETzogaGFuZGxlIGFzeW5jaHJvbm91cyByZXF1ZXN0c1xuICAgIGNvbnN0IHVzZXIgPSB0aGlzLl9jYWNoZUdldFVzZXIodWlkKTtcbiAgICBpZiAodXNlcikge1xuICAgICAgcmV0dXJuIHVzZXI7IC8vIFByb21pc2UucmVzb2x2ZSh1c2VyKVxuICAgIH1cbiAgfVxuICAvKipcbiAgICogR2V0IGRlc2NyaXB0aW9uIG9mIHRoZSBwMnAgcGVlciBmcm9tIHN1YnNjcmlwdGlvbiBjYWNoZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHJldHVybiB7T2JqZWN0fSBwZWVyJ3MgZGVzY3JpcHRpb24gb3IgdW5kZWZpbmVkLlxuICAgKi9cbiAgcDJwUGVlckRlc2MoKSB7XG4gICAgaWYgKCF0aGlzLmlzUDJQVHlwZSgpKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fdXNlcnNbdGhpcy5uYW1lXTtcbiAgfVxuICAvKipcbiAgICogSXRlcmF0ZSBvdmVyIGNhY2hlZCBzdWJzY3JpYmVycy4gSWYgY2FsbGJhY2sgaXMgdW5kZWZpbmVkLCB1c2UgdGhpcy5vbk1ldGFTdWIuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIC0gQ2FsbGJhY2sgd2hpY2ggd2lsbCByZWNlaXZlIHN1YnNjcmliZXJzIG9uZSBieSBvbmUuXG4gICAqIEBwYXJhbSB7T2JqZWN0PX0gY29udGV4dCAtIFZhbHVlIG9mIGB0aGlzYCBpbnNpZGUgdGhlIGBjYWxsYmFja2AuXG4gICAqL1xuICBzdWJzY3JpYmVycyhjYWxsYmFjaywgY29udGV4dCkge1xuICAgIGNvbnN0IGNiID0gKGNhbGxiYWNrIHx8IHRoaXMub25NZXRhU3ViKTtcbiAgICBpZiAoY2IpIHtcbiAgICAgIGZvciAobGV0IGlkeCBpbiB0aGlzLl91c2Vycykge1xuICAgICAgICBjYi5jYWxsKGNvbnRleHQsIHRoaXMuX3VzZXJzW2lkeF0sIGlkeCwgdGhpcy5fdXNlcnMpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICAvKipcbiAgICogR2V0IGEgY29weSBvZiBjYWNoZWQgdGFncy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHJldHVybiB7QXJyYXkuPHN0cmluZz59IGEgY29weSBvZiB0YWdzXG4gICAqL1xuICB0YWdzKCkge1xuICAgIC8vIFJldHVybiBhIGNvcHkuXG4gICAgcmV0dXJuIHRoaXMuX3RhZ3Muc2xpY2UoMCk7XG4gIH1cbiAgLyoqXG4gICAqIEdldCBjYWNoZWQgc3Vic2NyaXB0aW9uIGZvciB0aGUgZ2l2ZW4gdXNlciBJRC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVpZCAtIGlkIG9mIHRoZSB1c2VyIHRvIHF1ZXJ5IGZvclxuICAgKiBAcmV0dXJuIHVzZXIgZGVzY3JpcHRpb24gb3IgdW5kZWZpbmVkLlxuICAgKi9cbiAgc3Vic2NyaWJlcih1aWQpIHtcbiAgICByZXR1cm4gdGhpcy5fdXNlcnNbdWlkXTtcbiAgfVxuICAvKipcbiAgICogSXRlcmF0ZSBvdmVyIHZlcnNpb25zIG9mIDxjb2RlPm1lc3NhZ2U8L2NvZGU+OiBjYWxsIDxjb2RlPmNhbGxiYWNrPC9jb2RlPiBmb3IgZWFjaCBtZXNzYWdlLlxuICAgKiBJZiA8Y29kZT5jYWxsYmFjazwvY29kZT4gaXMgdW5kZWZpbmVkLCBkb2VzIG5vdGhpbmcuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7VGlub2RlLkZvckVhY2hDYWxsYmFja1R5cGV9IGNhbGxiYWNrIC0gQ2FsbGJhY2sgd2hpY2ggd2lsbCByZWNlaXZlIG1lc3NhZ2VzIG9uZSBieSBvbmUuIFNlZSB7QGxpbmsgVGlub2RlLkNCdWZmZXIjZm9yRWFjaH1cbiAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHQgLSBWYWx1ZSBvZiBgdGhpc2AgaW5zaWRlIHRoZSBgY2FsbGJhY2tgLlxuICAgKi9cbiAgbWVzc2FnZVZlcnNpb25zKG1lc3NhZ2UsIGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgaWYgKCFjYWxsYmFjaykge1xuICAgICAgLy8gTm8gY2FsbGJhY2s/IFdlIGFyZSBkb25lIHRoZW4uXG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG9yaWdTZXEgPSB0aGlzLl9pc1JlcGxhY2VtZW50TXNnKG1lc3NhZ2UpID8gcGFyc2VJbnQobWVzc2FnZS5oZWFkLnJlcGxhY2Uuc3BsaXQoJzonKVsxXSkgOiBtZXNzYWdlLnNlcTtcbiAgICBjb25zdCB2ZXJzaW9ucyA9IHRoaXMuX21lc3NhZ2VWZXJzaW9uc1tvcmlnU2VxXTtcbiAgICBpZiAoIXZlcnNpb25zKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHZlcnNpb25zLmZvckVhY2goY2FsbGJhY2ssIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBjb250ZXh0KTtcbiAgfVxuICAvKipcbiAgICogSXRlcmF0ZSBvdmVyIGNhY2hlZCBtZXNzYWdlczogY2FsbCA8Y29kZT5jYWxsYmFjazwvY29kZT4gZm9yIGVhY2ggbWVzc2FnZSBpbiB0aGUgcmFuZ2UgW3NpbmRlSWR4LCBiZWZvcmVJZHgpLlxuICAgKiBJZiA8Y29kZT5jYWxsYmFjazwvY29kZT4gaXMgdW5kZWZpbmVkLCB1c2UgPGNvZGU+dGhpcy5vbkRhdGE8L2NvZGU+LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge1Rpbm9kZS5Gb3JFYWNoQ2FsbGJhY2tUeXBlfSBjYWxsYmFjayAtIENhbGxiYWNrIHdoaWNoIHdpbGwgcmVjZWl2ZSBtZXNzYWdlcyBvbmUgYnkgb25lLiBTZWUge0BsaW5rIFRpbm9kZS5DQnVmZmVyI2ZvckVhY2h9XG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzaW5jZUlkIC0gT3B0aW9uYWwgc2VxSWQgdG8gc3RhcnQgaXRlcmF0aW5nIGZyb20gKGluY2x1c2l2ZSkuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBiZWZvcmVJZCAtIE9wdGlvbmFsIHNlcUlkIHRvIHN0b3AgaXRlcmF0aW5nIGJlZm9yZSBpdCBpcyByZWFjaGVkIChleGNsdXNpdmUpLlxuICAgKiBAcGFyYW0ge09iamVjdH0gY29udGV4dCAtIFZhbHVlIG9mIGB0aGlzYCBpbnNpZGUgdGhlIGBjYWxsYmFja2AuXG4gICAqL1xuICBtZXNzYWdlcyhjYWxsYmFjaywgc2luY2VJZCwgYmVmb3JlSWQsIGNvbnRleHQpIHtcbiAgICBjb25zdCBjYiA9IChjYWxsYmFjayB8fCB0aGlzLm9uRGF0YSk7XG4gICAgaWYgKGNiKSB7XG4gICAgICBjb25zdCBzdGFydElkeCA9IHR5cGVvZiBzaW5jZUlkID09ICdudW1iZXInID8gdGhpcy5fbWVzc2FnZXMuZmluZCh7XG4gICAgICAgIHNlcTogc2luY2VJZFxuICAgICAgfSwgdHJ1ZSkgOiB1bmRlZmluZWQ7XG4gICAgICBjb25zdCBiZWZvcmVJZHggPSB0eXBlb2YgYmVmb3JlSWQgPT0gJ251bWJlcicgPyB0aGlzLl9tZXNzYWdlcy5maW5kKHtcbiAgICAgICAgc2VxOiBiZWZvcmVJZFxuICAgICAgfSwgdHJ1ZSkgOiB1bmRlZmluZWQ7XG4gICAgICBpZiAoc3RhcnRJZHggIT0gLTEgJiYgYmVmb3JlSWR4ICE9IC0xKSB7XG4gICAgICAgIC8vIFN0ZXAgMS4gRmlsdGVyIG91dCBhbGwgcmVwbGFjZW1lbnQgbWVzc2FnZXMgYW5kXG4gICAgICAgIC8vIHNhdmUgZGlzcGxheWFibGUgbWVzc2FnZXMgaW4gYSB0ZW1wb3JhcnkgYnVmZmVyLlxuICAgICAgICBsZXQgbXNncyA9IFtdO1xuICAgICAgICB0aGlzLl9tZXNzYWdlcy5mb3JFYWNoKChtc2csIHVudXNlZDEsIHVudXNlZDIsIGkpID0+IHtcbiAgICAgICAgICBpZiAodGhpcy5faXNSZXBsYWNlbWVudE1zZyhtc2cpKSB7XG4gICAgICAgICAgICAvLyBTa2lwIHJlcGxhY2VtZW50cy5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgbXNncy5wdXNoKHtcbiAgICAgICAgICAgIGRhdGE6IHRoaXMuX2dldExhdGVzdE1zZ1ZlcnNpb24obXNnKSxcbiAgICAgICAgICAgIGlkeDogaVxuICAgICAgICAgIH0pO1xuICAgICAgICB9LCBzdGFydElkeCwgYmVmb3JlSWR4LCB7fSk7XG4gICAgICAgIC8vIFN0ZXAgMi4gTG9vcCBvdmVyIGRpc3BsYXlibGUgbWVzc2FnZXMgaW52b2tpbmcgY2Igb24gZWFjaCBvZiB0aGVtLlxuICAgICAgICBtc2dzLmZvckVhY2goKHZhbCwgaSkgPT4ge1xuICAgICAgICAgIGNiLmNhbGwoY29udGV4dCwgdmFsLmRhdGEsXG4gICAgICAgICAgICAoaSA+IDAgPyBtc2dzW2kgLSAxXS5kYXRhIDogdW5kZWZpbmVkKSxcbiAgICAgICAgICAgIChpIDwgbXNncy5sZW5ndGggLSAxID8gbXNnc1tpICsgMV0uZGF0YSA6IHVuZGVmaW5lZCksIHZhbC5pZHgpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgLyoqXG4gICAqIEdldCB0aGUgbWVzc2FnZSBmcm9tIGNhY2hlIGJ5IDxjb2RlPnNlcTwvY29kZT4uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzZXEgLSBtZXNzYWdlIHNlcUlkIHRvIHNlYXJjaCBmb3IuXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IHRoZSBtZXNzYWdlIHdpdGggdGhlIGdpdmVuIDxjb2RlPnNlcTwvY29kZT4gb3IgPGNvZGU+dW5kZWZpbmVkPC9jb2RlPiwgaWYgbm8gc3VjaCBtZXNzYWdlIGlzIGZvdW5kLlxuICAgKi9cbiAgZmluZE1lc3NhZ2Uoc2VxKSB7XG4gICAgY29uc3QgaWR4ID0gdGhpcy5fbWVzc2FnZXMuZmluZCh7XG4gICAgICBzZXE6IHNlcVxuICAgIH0pO1xuICAgIGlmIChpZHggPj0gMCkge1xuICAgICAgcmV0dXJuIHRoaXMuX21lc3NhZ2VzLmdldEF0KGlkeCk7XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgLyoqXG4gICAqIEdldCB0aGUgbW9zdCByZWNlbnQgbWVzc2FnZSBmcm9tIGNhY2hlLiBUaGlzIG1ldGhvZCBjb3VudHMgYWxsIG1lc3NhZ2VzLCBpbmNsdWRpbmcgZGVsZXRlZCByYW5nZXMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVufSBza2lwRGVsZXRlZCAtIGlmIHRoZSBsYXN0IG1lc3NhZ2UgaXMgYSBkZWxldGVkIHJhbmdlLCBnZXQgdGhlIG9uZSBiZWZvcmUgaXQuXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IHRoZSBtb3N0IHJlY2VudCBjYWNoZWQgbWVzc2FnZSBvciA8Y29kZT51bmRlZmluZWQ8L2NvZGU+LCBpZiBubyBtZXNzYWdlcyBhcmUgY2FjaGVkLlxuICAgKi9cbiAgbGF0ZXN0TWVzc2FnZShza2lwRGVsZXRlZCkge1xuICAgIGNvbnN0IG1zZyA9IHRoaXMuX21lc3NhZ2VzLmdldExhc3QoKTtcbiAgICBpZiAoIXNraXBEZWxldGVkIHx8ICFtc2cgfHwgbXNnLl9zdGF0dXMgIT0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfREVMX1JBTkdFKSB7XG4gICAgICByZXR1cm4gbXNnO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fbWVzc2FnZXMuZ2V0TGFzdCgxKTtcbiAgfVxuICAvKipcbiAgICogR2V0IHRoZSBtYXhpbXVtIGNhY2hlZCBzZXEgSUQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IHRoZSBncmVhdGVzdCBzZXEgSUQgaW4gY2FjaGUuXG4gICAqL1xuICBtYXhNc2dTZXEoKSB7XG4gICAgcmV0dXJuIHRoaXMuX21heFNlcTtcbiAgfVxuICAvKipcbiAgICogR2V0IHRoZSBtYXhpbXVtIGRlbGV0aW9uIElELlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSB0aGUgZ3JlYXRlc3QgZGVsZXRpb24gSUQuXG4gICAqL1xuICBtYXhDbGVhcklkKCkge1xuICAgIHJldHVybiB0aGlzLl9tYXhEZWw7XG4gIH1cbiAgLyoqXG4gICAqIEdldCB0aGUgbnVtYmVyIG9mIG1lc3NhZ2VzIGluIHRoZSBjYWNoZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHJldHVybnMge251bWJlcn0gY291bnQgb2YgY2FjaGVkIG1lc3NhZ2VzLlxuICAgKi9cbiAgbWVzc2FnZUNvdW50KCkge1xuICAgIHJldHVybiB0aGlzLl9tZXNzYWdlcy5sZW5ndGgoKTtcbiAgfVxuICAvKipcbiAgICogSXRlcmF0ZSBvdmVyIGNhY2hlZCB1bnNlbnQgbWVzc2FnZXMuIFdyYXBzIHtAbGluayBUaW5vZGUuVG9waWMjbWVzc2FnZXN9LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayAtIENhbGxiYWNrIHdoaWNoIHdpbGwgcmVjZWl2ZSBtZXNzYWdlcyBvbmUgYnkgb25lLiBTZWUge0BsaW5rIFRpbm9kZS5DQnVmZmVyI2ZvckVhY2h9XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZXh0IC0gVmFsdWUgb2YgPGNvZGU+dGhpczwvY29kZT4gaW5zaWRlIHRoZSA8Y29kZT5jYWxsYmFjazwvY29kZT4uXG4gICAqL1xuICBxdWV1ZWRNZXNzYWdlcyhjYWxsYmFjaywgY29udGV4dCkge1xuICAgIGlmICghY2FsbGJhY2spIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbGxiYWNrIG11c3QgYmUgcHJvdmlkZWRcIik7XG4gICAgfVxuICAgIHRoaXMubWVzc2FnZXMoY2FsbGJhY2ssIENvbnN0LkxPQ0FMX1NFUUlELCB1bmRlZmluZWQsIGNvbnRleHQpO1xuICB9XG4gIC8qKlxuICAgKiBHZXQgdGhlIG51bWJlciBvZiB0b3BpYyBzdWJzY3JpYmVycyB3aG8gbWFya2VkIHRoaXMgbWVzc2FnZSBhcyBlaXRoZXIgcmVjdiBvciByZWFkXG4gICAqIEN1cnJlbnQgdXNlciBpcyBleGNsdWRlZCBmcm9tIHRoZSBjb3VudC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHdoYXQgLSB3aGF0IGFjdGlvbiB0byBjb25zaWRlcjogcmVjZWl2ZWQgPGNvZGU+XCJyZWN2XCI8L2NvZGU+IG9yIHJlYWQgPGNvZGU+XCJyZWFkXCI8L2NvZGU+LlxuICAgKiBAcGFyYW0ge251bWJlcn0gc2VxIC0gSUQgb3IgdGhlIG1lc3NhZ2UgcmVhZCBvciByZWNlaXZlZC5cbiAgICpcbiAgICogQHJldHVybnMge251bWJlcn0gdGhlIG51bWJlciBvZiBzdWJzY3JpYmVycyB3aG8gbWFya2VkIHRoZSBtZXNzYWdlIHdpdGggdGhlIGdpdmVuIElEIGFzIHJlYWQgb3IgcmVjZWl2ZWQuXG4gICAqL1xuICBtc2dSZWNlaXB0Q291bnQod2hhdCwgc2VxKSB7XG4gICAgbGV0IGNvdW50ID0gMDtcbiAgICBpZiAoc2VxID4gMCkge1xuICAgICAgY29uc3QgbWUgPSB0aGlzLl90aW5vZGUuZ2V0Q3VycmVudFVzZXJJRCgpO1xuICAgICAgZm9yIChsZXQgaWR4IGluIHRoaXMuX3VzZXJzKSB7XG4gICAgICAgIGNvbnN0IHVzZXIgPSB0aGlzLl91c2Vyc1tpZHhdO1xuICAgICAgICBpZiAodXNlci51c2VyICE9PSBtZSAmJiB1c2VyW3doYXRdID49IHNlcSkge1xuICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvdW50O1xuICB9XG4gIC8qKlxuICAgKiBHZXQgdGhlIG51bWJlciBvZiB0b3BpYyBzdWJzY3JpYmVycyB3aG8gbWFya2VkIHRoaXMgbWVzc2FnZSAoYW5kIGFsbCBvbGRlciBtZXNzYWdlcykgYXMgcmVhZC5cbiAgICogVGhlIGN1cnJlbnQgdXNlciBpcyBleGNsdWRlZCBmcm9tIHRoZSBjb3VudC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IHNlcSAtIG1lc3NhZ2UgaWQgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IG51bWJlciBvZiBzdWJzY3JpYmVycyB3aG8gY2xhaW0gdG8gaGF2ZSByZWNlaXZlZCB0aGUgbWVzc2FnZS5cbiAgICovXG4gIG1zZ1JlYWRDb3VudChzZXEpIHtcbiAgICByZXR1cm4gdGhpcy5tc2dSZWNlaXB0Q291bnQoJ3JlYWQnLCBzZXEpO1xuICB9XG4gIC8qKlxuICAgKiBHZXQgdGhlIG51bWJlciBvZiB0b3BpYyBzdWJzY3JpYmVycyB3aG8gbWFya2VkIHRoaXMgbWVzc2FnZSAoYW5kIGFsbCBvbGRlciBtZXNzYWdlcykgYXMgcmVjZWl2ZWQuXG4gICAqIFRoZSBjdXJyZW50IHVzZXIgaXMgZXhjbHVkZWQgZnJvbSB0aGUgY291bnQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzZXEgLSBNZXNzYWdlIGlkIHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSBOdW1iZXIgb2Ygc3Vic2NyaWJlcnMgd2hvIGNsYWltIHRvIGhhdmUgcmVjZWl2ZWQgdGhlIG1lc3NhZ2UuXG4gICAqL1xuICBtc2dSZWN2Q291bnQoc2VxKSB7XG4gICAgcmV0dXJuIHRoaXMubXNnUmVjZWlwdENvdW50KCdyZWN2Jywgc2VxKTtcbiAgfVxuICAvKipcbiAgICogQ2hlY2sgaWYgY2FjaGVkIG1lc3NhZ2UgSURzIGluZGljYXRlIHRoYXQgdGhlIHNlcnZlciBtYXkgaGF2ZSBtb3JlIG1lc3NhZ2VzLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IG5ld2VyIC0gaWYgPGNvZGU+dHJ1ZTwvY29kZT4sIGNoZWNrIGZvciBuZXdlciBtZXNzYWdlcyBvbmx5LlxuICAgKi9cbiAgbXNnSGFzTW9yZU1lc3NhZ2VzKG5ld2VyKSB7XG4gICAgcmV0dXJuIG5ld2VyID8gdGhpcy5zZXEgPiB0aGlzLl9tYXhTZXEgOlxuICAgICAgLy8gX21pblNlcSBjb3VsZCBiZSBtb3JlIHRoYW4gMSwgYnV0IGVhcmxpZXIgbWVzc2FnZXMgY291bGQgaGF2ZSBiZWVuIGRlbGV0ZWQuXG4gICAgICAodGhpcy5fbWluU2VxID4gMSAmJiAhdGhpcy5fbm9FYXJsaWVyTXNncyk7XG4gIH1cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSBnaXZlbiBzZXEgSWQgaXMgaWQgb2YgdGhlIG1vc3QgcmVjZW50IG1lc3NhZ2UuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzZXFJZCBpZCBvZiB0aGUgbWVzc2FnZSB0byBjaGVja1xuICAgKi9cbiAgaXNOZXdNZXNzYWdlKHNlcUlkKSB7XG4gICAgcmV0dXJuIHRoaXMuX21heFNlcSA8PSBzZXFJZDtcbiAgfVxuICAvKipcbiAgICogUmVtb3ZlIG9uZSBtZXNzYWdlIGZyb20gbG9jYWwgY2FjaGUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzZXFJZCBpZCBvZiB0aGUgbWVzc2FnZSB0byByZW1vdmUgZnJvbSBjYWNoZS5cbiAgICogQHJldHVybnMge01lc3NhZ2V9IHJlbW92ZWQgbWVzc2FnZSBvciB1bmRlZmluZWQgaWYgc3VjaCBtZXNzYWdlIHdhcyBub3QgZm91bmQuXG4gICAqL1xuICBmbHVzaE1lc3NhZ2Uoc2VxSWQpIHtcbiAgICBjb25zdCBpZHggPSB0aGlzLl9tZXNzYWdlcy5maW5kKHtcbiAgICAgIHNlcTogc2VxSWRcbiAgICB9KTtcbiAgICBpZiAoaWR4ID49IDApIHtcbiAgICAgIHRoaXMuX3Rpbm9kZS5fZGIucmVtTWVzc2FnZXModGhpcy5uYW1lLCBzZXFJZCk7XG4gICAgICByZXR1cm4gdGhpcy5fbWVzc2FnZXMuZGVsQXQoaWR4KTtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuICAvKipcbiAgICogVXBkYXRlIG1lc3NhZ2UncyBzZXFJZC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHB1YiBtZXNzYWdlIG9iamVjdC5cbiAgICogQHBhcmFtIHtudW1iZXJ9IG5ld1NlcUlkIG5ldyBzZXEgaWQgZm9yIHB1Yi5cbiAgICovXG4gIHN3YXBNZXNzYWdlSWQocHViLCBuZXdTZXFJZCkge1xuICAgIGNvbnN0IGlkeCA9IHRoaXMuX21lc3NhZ2VzLmZpbmQocHViKTtcbiAgICBjb25zdCBudW1NZXNzYWdlcyA9IHRoaXMuX21lc3NhZ2VzLmxlbmd0aCgpO1xuICAgIGlmICgwIDw9IGlkeCAmJiBpZHggPCBudW1NZXNzYWdlcykge1xuICAgICAgLy8gUmVtb3ZlIG1lc3NhZ2Ugd2l0aCB0aGUgb2xkIHNlcSBJRC5cbiAgICAgIHRoaXMuX21lc3NhZ2VzLmRlbEF0KGlkeCk7XG4gICAgICB0aGlzLl90aW5vZGUuX2RiLnJlbU1lc3NhZ2VzKHRoaXMubmFtZSwgcHViLnNlcSk7XG4gICAgICAvLyBBZGQgbWVzc2FnZSB3aXRoIHRoZSBuZXcgc2VxIElELlxuICAgICAgcHViLnNlcSA9IG5ld1NlcUlkO1xuICAgICAgdGhpcy5fbWVzc2FnZXMucHV0KHB1Yik7XG4gICAgICB0aGlzLl90aW5vZGUuX2RiLmFkZE1lc3NhZ2UocHViKTtcbiAgICB9XG4gIH1cbiAgLyoqXG4gICAqIFJlbW92ZSBhIHJhbmdlIG9mIG1lc3NhZ2VzIGZyb20gdGhlIGxvY2FsIGNhY2hlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gZnJvbUlkIHNlcSBJRCBvZiB0aGUgZmlyc3QgbWVzc2FnZSB0byByZW1vdmUgKGluY2x1c2l2ZSkuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB1bnRpbElkIHNlcUlEIG9mIHRoZSBsYXN0IG1lc3NhZ2UgdG8gcmVtb3ZlIChleGNsdXNpdmUpLlxuICAgKlxuICAgKiBAcmV0dXJucyB7TWVzc2FnZVtdfSBhcnJheSBvZiByZW1vdmVkIG1lc3NhZ2VzIChjb3VsZCBiZSBlbXB0eSkuXG4gICAqL1xuICBmbHVzaE1lc3NhZ2VSYW5nZShmcm9tSWQsIHVudGlsSWQpIHtcbiAgICAvLyBSZW1vdmUgcmFuZ2UgZnJvbSBwZXJzaXN0ZW50IGNhY2hlLlxuICAgIHRoaXMuX3Rpbm9kZS5fZGIucmVtTWVzc2FnZXModGhpcy5uYW1lLCBmcm9tSWQsIHVudGlsSWQpO1xuICAgIC8vIHN0YXJ0LCBlbmQ6IGZpbmQgaW5zZXJ0aW9uIHBvaW50cyAobmVhcmVzdCA9PSB0cnVlKS5cbiAgICBjb25zdCBzaW5jZSA9IHRoaXMuX21lc3NhZ2VzLmZpbmQoe1xuICAgICAgc2VxOiBmcm9tSWRcbiAgICB9LCB0cnVlKTtcbiAgICByZXR1cm4gc2luY2UgPj0gMCA/IHRoaXMuX21lc3NhZ2VzLmRlbFJhbmdlKHNpbmNlLCB0aGlzLl9tZXNzYWdlcy5maW5kKHtcbiAgICAgIHNlcTogdW50aWxJZFxuICAgIH0sIHRydWUpKSA6IFtdO1xuICB9XG4gIC8qKlxuICAgKiBBdHRlbXB0IHRvIHN0b3AgbWVzc2FnZSBmcm9tIGJlaW5nIHNlbnQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzZXFJZCBpZCBvZiB0aGUgbWVzc2FnZSB0byBzdG9wIHNlbmRpbmcgYW5kIHJlbW92ZSBmcm9tIGNhY2hlLlxuICAgKlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgbWVzc2FnZSB3YXMgY2FuY2VsbGVkLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgY2FuY2VsU2VuZChzZXFJZCkge1xuICAgIGNvbnN0IGlkeCA9IHRoaXMuX21lc3NhZ2VzLmZpbmQoe1xuICAgICAgc2VxOiBzZXFJZFxuICAgIH0pO1xuICAgIGlmIChpZHggPj0gMCkge1xuICAgICAgY29uc3QgbXNnID0gdGhpcy5fbWVzc2FnZXMuZ2V0QXQoaWR4KTtcbiAgICAgIGNvbnN0IHN0YXR1cyA9IHRoaXMubXNnU3RhdHVzKG1zZyk7XG4gICAgICBpZiAoc3RhdHVzID09IENvbnN0Lk1FU1NBR0VfU1RBVFVTX1FVRVVFRCB8fCBzdGF0dXMgPT0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfRkFJTEVEKSB7XG4gICAgICAgIHRoaXMuX3Rpbm9kZS5fZGIucmVtTWVzc2FnZXModGhpcy5uYW1lLCBzZXFJZCk7XG4gICAgICAgIG1zZy5fY2FuY2VsbGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fbWVzc2FnZXMuZGVsQXQoaWR4KTtcbiAgICAgICAgaWYgKHRoaXMub25EYXRhKSB7XG4gICAgICAgICAgLy8gQ2FsbGluZyB3aXRoIG5vIHBhcmFtZXRlcnMgdG8gaW5kaWNhdGUgdGhlIG1lc3NhZ2Ugd2FzIGRlbGV0ZWQuXG4gICAgICAgICAgdGhpcy5vbkRhdGEoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIC8qKlxuICAgKiBHZXQgdHlwZSBvZiB0aGUgdG9waWM6IG1lLCBwMnAsIGdycCwgZm5kLi4uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IE9uZSBvZiAnbWUnLCAncDJwJywgJ2dycCcsICdmbmQnLCAnc3lzJyBvciA8Y29kZT51bmRlZmluZWQ8L2NvZGU+LlxuICAgKi9cbiAgZ2V0VHlwZSgpIHtcbiAgICByZXR1cm4gVG9waWMudG9waWNUeXBlKHRoaXMubmFtZSk7XG4gIH1cbiAgLyoqXG4gICAqIEdldCBjdXJyZW50IHVzZXIncyBhY2Nlc3MgbW9kZSBvZiB0aGUgdG9waWMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuQWNjZXNzTW9kZX0gLSB1c2VyJ3MgYWNjZXNzIG1vZGVcbiAgICovXG4gIGdldEFjY2Vzc01vZGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuYWNzO1xuICB9XG4gIC8qKlxuICAgKiBTZXQgY3VycmVudCB1c2VyJ3MgYWNjZXNzIG1vZGUgb2YgdGhlIHRvcGljLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge0FjY2Vzc01vZGUgfCBPYmplY3R9IGFjcyAtIGFjY2VzcyBtb2RlIHRvIHNldC5cbiAgICovXG4gIHNldEFjY2Vzc01vZGUoYWNzKSB7XG4gICAgcmV0dXJuIHRoaXMuYWNzID0gbmV3IEFjY2Vzc01vZGUoYWNzKTtcbiAgfVxuICAvKipcbiAgICogR2V0IHRvcGljJ3MgZGVmYXVsdCBhY2Nlc3MgbW9kZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5EZWZBY3N9IC0gYWNjZXNzIG1vZGUsIHN1Y2ggYXMge2F1dGg6IGBSV1BgLCBhbm9uOiBgTmB9LlxuICAgKi9cbiAgZ2V0RGVmYXVsdEFjY2VzcygpIHtcbiAgICByZXR1cm4gdGhpcy5kZWZhY3M7XG4gIH1cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgbmV3IG1ldGEge0BsaW5rIFRpbm9kZS5HZXRRdWVyeX0gYnVpbGRlci4gVGhlIHF1ZXJ5IGlzIGF0dGNoZWQgdG8gdGhlIGN1cnJlbnQgdG9waWMuXG4gICAqIEl0IHdpbGwgbm90IHdvcmsgY29ycmVjdGx5IGlmIHVzZWQgd2l0aCBhIGRpZmZlcmVudCB0b3BpYy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5NZXRhR2V0QnVpbGRlcn0gcXVlcnkgYXR0YWNoZWQgdG8gdGhlIGN1cnJlbnQgdG9waWMuXG4gICAqL1xuICBzdGFydE1ldGFRdWVyeSgpIHtcbiAgICByZXR1cm4gbmV3IE1ldGFHZXRCdWlsZGVyKHRoaXMpO1xuICB9XG4gIC8qKlxuICAgKiBDaGVjayBpZiB0b3BpYyBpcyBhcmNoaXZlZCwgaS5lLiBwcml2YXRlLmFyY2ggPT0gdHJ1ZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHJldHVybnMge2Jvb2xlYW59IC0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgdG9waWMgaXMgYXJjaGl2ZWQsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBpc0FyY2hpdmVkKCkge1xuICAgIHJldHVybiB0aGlzLnByaXZhdGUgJiYgISF0aGlzLnByaXZhdGUuYXJjaDtcbiAgfVxuICAvKipcbiAgICogQ2hlY2sgaWYgdG9waWMgaXMgYSAnbWUnIHRvcGljLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0b3BpYyBpcyBhICdtZScgdG9waWMsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBpc01lVHlwZSgpIHtcbiAgICByZXR1cm4gVG9waWMuaXNNZVRvcGljTmFtZSh0aGlzLm5hbWUpO1xuICB9XG4gIC8qKlxuICAgKiBDaGVjayBpZiB0b3BpYyBpcyBhIGNoYW5uZWwuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIDxjb2RlPnRydWU8L2NvZGU+IGlmIHRvcGljIGlzIGEgY2hhbm5lbCwgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIGlzQ2hhbm5lbFR5cGUoKSB7XG4gICAgcmV0dXJuIFRvcGljLmlzQ2hhbm5lbFRvcGljTmFtZSh0aGlzLm5hbWUpO1xuICB9XG4gIC8qKlxuICAgKiBDaGVjayBpZiB0b3BpYyBpcyBhIGdyb3VwIHRvcGljLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0b3BpYyBpcyBhIGdyb3VwLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgaXNHcm91cFR5cGUoKSB7XG4gICAgcmV0dXJuIFRvcGljLmlzR3JvdXBUb3BpY05hbWUodGhpcy5uYW1lKTtcbiAgfVxuICAvKipcbiAgICogQ2hlY2sgaWYgdG9waWMgaXMgYSBwMnAgdG9waWMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIDxjb2RlPnRydWU8L2NvZGU+IGlmIHRvcGljIGlzIGEgcDJwIHRvcGljLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgaXNQMlBUeXBlKCkge1xuICAgIHJldHVybiBUb3BpYy5pc1AyUFRvcGljTmFtZSh0aGlzLm5hbWUpO1xuICB9XG4gIC8qKlxuICAgKiBDaGVjayBpZiB0b3BpYyBpcyBhIGNvbW11bmljYXRpb24gdG9waWMsIGkuZS4gYSBncm91cCBvciBwMnAgdG9waWMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIDxjb2RlPnRydWU8L2NvZGU+IGlmIHRvcGljIGlzIGEgcDJwIG9yIGdyb3VwIHRvcGljLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgaXNDb21tVHlwZSgpIHtcbiAgICByZXR1cm4gVG9waWMuaXNDb21tVG9waWNOYW1lKHRoaXMubmFtZSk7XG4gIH1cbiAgLyoqXG4gICAqIEdldCBzdGF0dXMgKHF1ZXVlZCwgc2VudCwgcmVjZWl2ZWQgZXRjKSBvZiBhIGdpdmVuIG1lc3NhZ2UgaW4gdGhlIGNvbnRleHRcbiAgICogb2YgdGhpcyB0b3BpYy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtNZXNzYWdlfSBtc2cgLSBtZXNzYWdlIHRvIGNoZWNrIGZvciBzdGF0dXMuXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gdXBkIC0gdXBkYXRlIGNoYWNoZWQgbWVzc2FnZSBzdGF0dXMuXG4gICAqXG4gICAqIEByZXR1cm5zIG1lc3NhZ2Ugc3RhdHVzIGNvbnN0YW50LlxuICAgKi9cbiAgbXNnU3RhdHVzKG1zZywgdXBkKSB7XG4gICAgbGV0IHN0YXR1cyA9IENvbnN0Lk1FU1NBR0VfU1RBVFVTX05PTkU7XG4gICAgaWYgKHRoaXMuX3Rpbm9kZS5pc01lKG1zZy5mcm9tKSkge1xuICAgICAgaWYgKG1zZy5fc2VuZGluZykge1xuICAgICAgICBzdGF0dXMgPSBDb25zdC5NRVNTQUdFX1NUQVRVU19TRU5ESU5HO1xuICAgICAgfSBlbHNlIGlmIChtc2cuX2ZhaWxlZCB8fCBtc2cuX2NhbmNlbGxlZCkge1xuICAgICAgICBzdGF0dXMgPSBDb25zdC5NRVNTQUdFX1NUQVRVU19GQUlMRUQ7XG4gICAgICB9IGVsc2UgaWYgKG1zZy5zZXEgPj0gQ29uc3QuTE9DQUxfU0VRSUQpIHtcbiAgICAgICAgc3RhdHVzID0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfUVVFVUVEO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLm1zZ1JlYWRDb3VudChtc2cuc2VxKSA+IDApIHtcbiAgICAgICAgc3RhdHVzID0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfUkVBRDtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5tc2dSZWN2Q291bnQobXNnLnNlcSkgPiAwKSB7XG4gICAgICAgIHN0YXR1cyA9IENvbnN0Lk1FU1NBR0VfU1RBVFVTX1JFQ0VJVkVEO1xuICAgICAgfSBlbHNlIGlmIChtc2cuc2VxID4gMCkge1xuICAgICAgICBzdGF0dXMgPSBDb25zdC5NRVNTQUdFX1NUQVRVU19TRU5UO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAobXNnLl9zdGF0dXMgPT0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfREVMX1JBTkdFKSB7XG4gICAgICBzdGF0dXMgPT0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfREVMX1JBTkdFO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdGF0dXMgPSBDb25zdC5NRVNTQUdFX1NUQVRVU19UT19NRTtcbiAgICB9XG5cbiAgICBpZiAodXBkICYmIG1zZy5fc3RhdHVzICE9IHN0YXR1cykge1xuICAgICAgbXNnLl9zdGF0dXMgPSBzdGF0dXM7XG4gICAgICB0aGlzLl90aW5vZGUuX2RiLnVwZE1lc3NhZ2VTdGF0dXModGhpcy5uYW1lLCBtc2cuc2VxLCBzdGF0dXMpO1xuICAgIH1cblxuICAgIHJldHVybiBzdGF0dXM7XG4gIH1cblxuICAvLyBSZXR1cm5zIHRydWUgaWYgcHViIGlzIG1lYW50IHRvIHJlcGxhY2UgYW5vdGhlciBtZXNzYWdlIChlLmcuIG9yaWdpbmFsIG1lc3NhZ2Ugd2FzIGVkaXRlZCkuXG4gIF9pc1JlcGxhY2VtZW50TXNnKHB1Yikge1xuICAgIHJldHVybiBwdWIuaGVhZCAmJiBwdWIuaGVhZC5yZXBsYWNlO1xuICB9XG5cbiAgLy8gSWYgbXNnIGlzIGEgcmVwbGFjZW1lbnQgZm9yIGFub3RoZXIgbWVzc2FnZSwgc2F2ZXMgbXNnIGluIHRoZSBtZXNzYWdlIHZlcnNpb25zIGNhY2hlXG4gIC8vIGFzIGEgbmV3ZXIgdmVyc2lvbiBmb3IgdGhlIG1lc3NhZ2UgaXQncyBzdXBwb3NlZCB0byByZXBsYWNlLlxuICBfbWF5YmVVcGRhdGVNZXNzYWdlVmVyc2lvbnNDYWNoZShtc2cpIHtcbiAgICBpZiAoIXRoaXMuX2lzUmVwbGFjZW1lbnRNc2cobXNnKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCB0YXJnZXRTZXEgPSBwYXJzZUludChtc2cuaGVhZC5yZXBsYWNlLnNwbGl0KCc6JylbMV0pO1xuICAgIGlmICh0YXJnZXRTZXEgPiBtc2cuc2VxKSB7XG4gICAgICAvLyBTdWJzdGl0dXRlcyBhcmUgc3VwcG9zZWQgdG8gaGF2ZSBoaWdoZXIgc2VxIGlkcy5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgbGV0IHZlcnNpb25zID0gdGhpcy5fbWVzc2FnZVZlcnNpb25zW3RhcmdldFNlcV0gfHwgbmV3IENCdWZmZXIoKGEsIGIpID0+IHtcbiAgICAgIHJldHVybiBhLnNlcSAtIGIuc2VxO1xuICAgIH0sIHRydWUpO1xuICAgIHZlcnNpb25zLnB1dChtc2cpO1xuICAgIHRoaXMuX21lc3NhZ2VWZXJzaW9uc1t0YXJnZXRTZXFdID0gdmVyc2lvbnM7XG4gIH1cblxuICAvLyBSZXR1cm5zIHRoZSBsYXRlc3QgdmVyc2lvbiBmb3IgYG1zZ2AgbWVzc2FnZS5cbiAgX2dldExhdGVzdE1zZ1ZlcnNpb24obXNnKSB7XG4gICAgY29uc3QgdmVyc2lvbnMgPSB0aGlzLl9tZXNzYWdlVmVyc2lvbnNbbXNnLnNlcV07XG4gICAgcmV0dXJuIHZlcnNpb25zID8gdmVyc2lvbnMuZ2V0TGFzdCgpIDogbXNnO1xuICB9XG5cbiAgLy8gUHJvY2VzcyBkYXRhIG1lc3NhZ2VcbiAgX3JvdXRlRGF0YShkYXRhKSB7XG4gICAgaWYgKGRhdGEuY29udGVudCkge1xuICAgICAgaWYgKCF0aGlzLnRvdWNoZWQgfHwgdGhpcy50b3VjaGVkIDwgZGF0YS50cykge1xuICAgICAgICB0aGlzLnRvdWNoZWQgPSBkYXRhLnRzO1xuICAgICAgICB0aGlzLl90aW5vZGUuX2RiLnVwZFRvcGljKHRoaXMpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChkYXRhLnNlcSA+IHRoaXMuX21heFNlcSkge1xuICAgICAgdGhpcy5fbWF4U2VxID0gZGF0YS5zZXE7XG4gICAgICB0aGlzLm1zZ1N0YXR1cyhkYXRhLCB0cnVlKTtcbiAgICAgIC8vIEFja24gcmVjZWl2aW5nIHRoZSBtZXNzYWdlLlxuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX3JlY3ZOb3RpZmljYXRpb25UaW1lcik7XG4gICAgICB0aGlzLl9yZWN2Tm90aWZpY2F0aW9uVGltZXIgPSBzZXRUaW1lb3V0KF8gPT4ge1xuICAgICAgICB0aGlzLl9yZWN2Tm90aWZpY2F0aW9uVGltZXIgPSBudWxsO1xuICAgICAgICB0aGlzLm5vdGVSZWN2KHRoaXMuX21heFNlcSk7XG4gICAgICB9LCBDb25zdC5SRUNWX1RJTUVPVVQpO1xuICAgIH1cblxuICAgIGlmIChkYXRhLnNlcSA8IHRoaXMuX21pblNlcSB8fCB0aGlzLl9taW5TZXEgPT0gMCkge1xuICAgICAgdGhpcy5fbWluU2VxID0gZGF0YS5zZXE7XG4gICAgfVxuXG4gICAgY29uc3Qgb3V0Z29pbmcgPSAoKCF0aGlzLmlzQ2hhbm5lbFR5cGUoKSAmJiAhZGF0YS5mcm9tKSB8fCB0aGlzLl90aW5vZGUuaXNNZShkYXRhLmZyb20pKTtcblxuICAgIGlmIChkYXRhLmhlYWQgJiYgZGF0YS5oZWFkLndlYnJ0YyAmJiBkYXRhLmhlYWQubWltZSA9PSBEcmFmdHkuZ2V0Q29udGVudFR5cGUoKSAmJiBkYXRhLmNvbnRlbnQpIHtcbiAgICAgIC8vIFJld3JpdGUgVkMgYm9keSB3aXRoIGluZm8gZnJvbSB0aGUgaGVhZGVycy5cbiAgICAgIGRhdGEuY29udGVudCA9IERyYWZ0eS51cGRhdGVWaWRlb0VudChkYXRhLmNvbnRlbnQsIHtcbiAgICAgICAgc3RhdGU6IGRhdGEuaGVhZC53ZWJydGMsXG4gICAgICAgIGR1cmF0aW9uOiBkYXRhLmhlYWRbJ3dlYnJ0Yy1kdXJhdGlvbiddLFxuICAgICAgICBpbmNvbWluZzogIW91dGdvaW5nLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKCFkYXRhLl9ub0ZvcndhcmRpbmcpIHtcbiAgICAgIHRoaXMuX21lc3NhZ2VzLnB1dChkYXRhKTtcbiAgICAgIHRoaXMuX3Rpbm9kZS5fZGIuYWRkTWVzc2FnZShkYXRhKTtcbiAgICAgIHRoaXMuX21heWJlVXBkYXRlTWVzc2FnZVZlcnNpb25zQ2FjaGUoZGF0YSk7XG4gICAgICB0aGlzLl91cGRhdGVEZWxldGVkUmFuZ2VzKCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMub25EYXRhKSB7XG4gICAgICB0aGlzLm9uRGF0YShkYXRhKTtcbiAgICB9XG5cbiAgICAvLyBVcGRhdGUgbG9jYWxseSBjYWNoZWQgY29udGFjdCB3aXRoIHRoZSBuZXcgbWVzc2FnZSBjb3VudC5cbiAgICBjb25zdCB3aGF0ID0gb3V0Z29pbmcgPyAncmVhZCcgOiAnbXNnJztcbiAgICB0aGlzLl91cGRhdGVSZWFkUmVjdih3aGF0LCBkYXRhLnNlcSwgZGF0YS50cyk7XG4gICAgLy8gTm90aWZ5ICdtZScgbGlzdGVuZXJzIG9mIHRoZSBjaGFuZ2UuXG4gICAgdGhpcy5fdGlub2RlLmdldE1lVG9waWMoKS5fcmVmcmVzaENvbnRhY3Qod2hhdCwgdGhpcyk7XG4gIH1cblxuICAvLyBQcm9jZXNzIG1ldGFkYXRhIG1lc3NhZ2VcbiAgX3JvdXRlTWV0YShtZXRhKSB7XG4gICAgaWYgKG1ldGEuZGVzYykge1xuICAgICAgdGhpcy5fcHJvY2Vzc01ldGFEZXNjKG1ldGEuZGVzYyk7XG4gICAgfVxuICAgIGlmIChtZXRhLnN1YiAmJiBtZXRhLnN1Yi5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLl9wcm9jZXNzTWV0YVN1YihtZXRhLnN1Yik7XG4gICAgfVxuICAgIGlmIChtZXRhLmRlbCkge1xuICAgICAgdGhpcy5fcHJvY2Vzc0RlbE1lc3NhZ2VzKG1ldGEuZGVsLmNsZWFyLCBtZXRhLmRlbC5kZWxzZXEpO1xuICAgIH1cbiAgICBpZiAobWV0YS50YWdzKSB7XG4gICAgICB0aGlzLl9wcm9jZXNzTWV0YVRhZ3MobWV0YS50YWdzKTtcbiAgICB9XG4gICAgaWYgKG1ldGEuY3JlZCkge1xuICAgICAgdGhpcy5fcHJvY2Vzc01ldGFDcmVkcyhtZXRhLmNyZWQpO1xuICAgIH1cbiAgICBpZiAodGhpcy5vbk1ldGEpIHtcbiAgICAgIHRoaXMub25NZXRhKG1ldGEpO1xuICAgIH1cbiAgfVxuICAvLyBQcm9jZXNzIHByZXNlbmNlIGNoYW5nZSBtZXNzYWdlXG4gIF9yb3V0ZVByZXMocHJlcykge1xuICAgIGxldCB1c2VyLCB1aWQ7XG4gICAgc3dpdGNoIChwcmVzLndoYXQpIHtcbiAgICAgIGNhc2UgJ2RlbCc6XG4gICAgICAgIC8vIERlbGV0ZSBjYWNoZWQgbWVzc2FnZXMuXG4gICAgICAgIHRoaXMuX3Byb2Nlc3NEZWxNZXNzYWdlcyhwcmVzLmNsZWFyLCBwcmVzLmRlbHNlcSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnb24nOlxuICAgICAgY2FzZSAnb2ZmJzpcbiAgICAgICAgLy8gVXBkYXRlIG9ubGluZSBzdGF0dXMgb2YgYSBzdWJzY3JpcHRpb24uXG4gICAgICAgIHVzZXIgPSB0aGlzLl91c2Vyc1twcmVzLnNyY107XG4gICAgICAgIGlmICh1c2VyKSB7XG4gICAgICAgICAgdXNlci5vbmxpbmUgPSBwcmVzLndoYXQgPT0gJ29uJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl90aW5vZGUubG9nZ2VyKFwiV0FSTklORzogUHJlc2VuY2UgdXBkYXRlIGZvciBhbiB1bmtub3duIHVzZXJcIiwgdGhpcy5uYW1lLCBwcmVzLnNyYyk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd0ZXJtJzpcbiAgICAgICAgLy8gQXR0YWNobWVudCB0byB0b3BpYyBpcyB0ZXJtaW5hdGVkIHByb2JhYmx5IGR1ZSB0byBjbHVzdGVyIHJlaGFzaGluZy5cbiAgICAgICAgdGhpcy5fcmVzZXRTdWIoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd1cGQnOlxuICAgICAgICAvLyBBIHRvcGljIHN1YnNjcmliZXIgaGFzIHVwZGF0ZWQgaGlzIGRlc2NyaXB0aW9uLlxuICAgICAgICAvLyBJc3N1ZSB7Z2V0IHN1Yn0gb25seSBpZiB0aGUgY3VycmVudCB1c2VyIGhhcyBubyBwMnAgdG9waWNzIHdpdGggdGhlIHVwZGF0ZWQgdXNlciAocDJwIG5hbWUgaXMgbm90IGluIGNhY2hlKS5cbiAgICAgICAgLy8gT3RoZXJ3aXNlICdtZScgd2lsbCBpc3N1ZSBhIHtnZXQgZGVzY30gcmVxdWVzdC5cbiAgICAgICAgaWYgKHByZXMuc3JjICYmICF0aGlzLl90aW5vZGUuaXNUb3BpY0NhY2hlZChwcmVzLnNyYykpIHtcbiAgICAgICAgICB0aGlzLmdldE1ldGEodGhpcy5zdGFydE1ldGFRdWVyeSgpLndpdGhMYXRlck9uZVN1YihwcmVzLnNyYykuYnVpbGQoKSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdhY3MnOlxuICAgICAgICB1aWQgPSBwcmVzLnNyYyB8fCB0aGlzLl90aW5vZGUuZ2V0Q3VycmVudFVzZXJJRCgpO1xuICAgICAgICB1c2VyID0gdGhpcy5fdXNlcnNbdWlkXTtcbiAgICAgICAgaWYgKCF1c2VyKSB7XG4gICAgICAgICAgLy8gVXBkYXRlIGZvciBhbiB1bmtub3duIHVzZXI6IG5vdGlmaWNhdGlvbiBvZiBhIG5ldyBzdWJzY3JpcHRpb24uXG4gICAgICAgICAgY29uc3QgYWNzID0gbmV3IEFjY2Vzc01vZGUoKS51cGRhdGVBbGwocHJlcy5kYWNzKTtcbiAgICAgICAgICBpZiAoYWNzICYmIGFjcy5tb2RlICE9IEFjY2Vzc01vZGUuX05PTkUpIHtcbiAgICAgICAgICAgIHVzZXIgPSB0aGlzLl9jYWNoZUdldFVzZXIodWlkKTtcbiAgICAgICAgICAgIGlmICghdXNlcikge1xuICAgICAgICAgICAgICB1c2VyID0ge1xuICAgICAgICAgICAgICAgIHVzZXI6IHVpZCxcbiAgICAgICAgICAgICAgICBhY3M6IGFjc1xuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICB0aGlzLmdldE1ldGEodGhpcy5zdGFydE1ldGFRdWVyeSgpLndpdGhPbmVTdWIodW5kZWZpbmVkLCB1aWQpLmJ1aWxkKCkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdXNlci5hY3MgPSBhY3M7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB1c2VyLnVwZGF0ZWQgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5fcHJvY2Vzc01ldGFTdWIoW3VzZXJdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gS25vd24gdXNlclxuICAgICAgICAgIHVzZXIuYWNzLnVwZGF0ZUFsbChwcmVzLmRhY3MpO1xuICAgICAgICAgIC8vIFVwZGF0ZSB1c2VyJ3MgYWNjZXNzIG1vZGUuXG4gICAgICAgICAgdGhpcy5fcHJvY2Vzc01ldGFTdWIoW3tcbiAgICAgICAgICAgIHVzZXI6IHVpZCxcbiAgICAgICAgICAgIHVwZGF0ZWQ6IG5ldyBEYXRlKCksXG4gICAgICAgICAgICBhY3M6IHVzZXIuYWNzXG4gICAgICAgICAgfV0pO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhpcy5fdGlub2RlLmxvZ2dlcihcIklORk86IElnbm9yZWQgcHJlc2VuY2UgdXBkYXRlXCIsIHByZXMud2hhdCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMub25QcmVzKSB7XG4gICAgICB0aGlzLm9uUHJlcyhwcmVzKTtcbiAgICB9XG4gIH1cbiAgLy8gUHJvY2VzcyB7aW5mb30gbWVzc2FnZVxuICBfcm91dGVJbmZvKGluZm8pIHtcbiAgICBpZiAoaW5mby53aGF0ICE9PSAna3AnKSB7XG4gICAgICBjb25zdCB1c2VyID0gdGhpcy5fdXNlcnNbaW5mby5mcm9tXTtcbiAgICAgIGlmICh1c2VyKSB7XG4gICAgICAgIHVzZXJbaW5mby53aGF0XSA9IGluZm8uc2VxO1xuICAgICAgICBpZiAodXNlci5yZWN2IDwgdXNlci5yZWFkKSB7XG4gICAgICAgICAgdXNlci5yZWN2ID0gdXNlci5yZWFkO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjb25zdCBtc2cgPSB0aGlzLmxhdGVzdE1lc3NhZ2UoKTtcbiAgICAgIGlmIChtc2cpIHtcbiAgICAgICAgdGhpcy5tc2dTdGF0dXMobXNnLCB0cnVlKTtcbiAgICAgIH1cblxuICAgICAgLy8gSWYgdGhpcyBpcyBhbiB1cGRhdGUgZnJvbSB0aGUgY3VycmVudCB1c2VyLCB1cGRhdGUgdGhlIGNhY2hlIHdpdGggdGhlIG5ldyBjb3VudC5cbiAgICAgIGlmICh0aGlzLl90aW5vZGUuaXNNZShpbmZvLmZyb20pKSB7XG4gICAgICAgIHRoaXMuX3VwZGF0ZVJlYWRSZWN2KGluZm8ud2hhdCwgaW5mby5zZXEpO1xuICAgICAgfVxuXG4gICAgICAvLyBOb3RpZnkgJ21lJyBsaXN0ZW5lciBvZiB0aGUgc3RhdHVzIGNoYW5nZS5cbiAgICAgIHRoaXMuX3Rpbm9kZS5nZXRNZVRvcGljKCkuX3JlZnJlc2hDb250YWN0KGluZm8ud2hhdCwgdGhpcyk7XG4gICAgfVxuICAgIGlmICh0aGlzLm9uSW5mbykge1xuICAgICAgdGhpcy5vbkluZm8oaW5mbyk7XG4gICAgfVxuICB9XG4gIC8vIENhbGxlZCBieSBUaW5vZGUgd2hlbiBtZXRhLmRlc2MgcGFja2V0IGlzIHJlY2VpdmVkLlxuICAvLyBDYWxsZWQgYnkgJ21lJyB0b3BpYyBvbiBjb250YWN0IHVwZGF0ZSAoZGVzYy5fbm9Gb3J3YXJkaW5nIGlzIHRydWUpLlxuICBfcHJvY2Vzc01ldGFEZXNjKGRlc2MpIHtcbiAgICBpZiAodGhpcy5pc1AyUFR5cGUoKSkge1xuICAgICAgLy8gU3ludGhldGljIGRlc2MgbWF5IGluY2x1ZGUgZGVmYWNzIGZvciBwMnAgdG9waWNzIHdoaWNoIGlzIHVzZWxlc3MuXG4gICAgICAvLyBSZW1vdmUgaXQuXG4gICAgICBkZWxldGUgZGVzYy5kZWZhY3M7XG5cbiAgICAgIC8vIFVwZGF0ZSB0byBwMnAgZGVzYyBpcyB0aGUgc2FtZSBhcyB1c2VyIHVwZGF0ZS4gVXBkYXRlIGNhY2hlZCB1c2VyLlxuICAgICAgdGhpcy5fdGlub2RlLl9kYi51cGRVc2VyKHRoaXMubmFtZSwgZGVzYy5wdWJsaWMpO1xuICAgIH1cblxuICAgIC8vIENvcHkgcGFyYW1ldGVycyBmcm9tIGRlc2Mgb2JqZWN0IHRvIHRoaXMgdG9waWMuXG4gICAgbWVyZ2VPYmoodGhpcywgZGVzYyk7XG4gICAgLy8gVXBkYXRlIHBlcnNpc3RlbnQgY2FjaGUuXG4gICAgdGhpcy5fdGlub2RlLl9kYi51cGRUb3BpYyh0aGlzKTtcblxuICAgIC8vIE5vdGlmeSAnbWUnIGxpc3RlbmVyLCBpZiBhdmFpbGFibGU6XG4gICAgaWYgKHRoaXMubmFtZSAhPT0gQ29uc3QuVE9QSUNfTUUgJiYgIWRlc2MuX25vRm9yd2FyZGluZykge1xuICAgICAgY29uc3QgbWUgPSB0aGlzLl90aW5vZGUuZ2V0TWVUb3BpYygpO1xuICAgICAgaWYgKG1lLm9uTWV0YVN1Yikge1xuICAgICAgICBtZS5vbk1ldGFTdWIodGhpcyk7XG4gICAgICB9XG4gICAgICBpZiAobWUub25TdWJzVXBkYXRlZCkge1xuICAgICAgICBtZS5vblN1YnNVcGRhdGVkKFt0aGlzLm5hbWVdLCAxKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5vbk1ldGFEZXNjKSB7XG4gICAgICB0aGlzLm9uTWV0YURlc2ModGhpcyk7XG4gICAgfVxuICB9XG4gIC8vIENhbGxlZCBieSBUaW5vZGUgd2hlbiBtZXRhLnN1YiBpcyByZWNpdmVkIG9yIGluIHJlc3BvbnNlIHRvIHJlY2VpdmVkXG4gIC8vIHtjdHJsfSBhZnRlciBzZXRNZXRhLXN1Yi5cbiAgX3Byb2Nlc3NNZXRhU3ViKHN1YnMpIHtcbiAgICBmb3IgKGxldCBpZHggaW4gc3Vicykge1xuICAgICAgY29uc3Qgc3ViID0gc3Vic1tpZHhdO1xuXG4gICAgICAvLyBGaWxsIGRlZmF1bHRzLlxuICAgICAgc3ViLm9ubGluZSA9ICEhc3ViLm9ubGluZTtcbiAgICAgIC8vIFVwZGF0ZSB0aW1lc3RhbXAgb2YgdGhlIG1vc3QgcmVjZW50IHN1YnNjcmlwdGlvbiB1cGRhdGUuXG4gICAgICB0aGlzLl9sYXN0U3Vic1VwZGF0ZSA9IG5ldyBEYXRlKE1hdGgubWF4KHRoaXMuX2xhc3RTdWJzVXBkYXRlLCBzdWIudXBkYXRlZCkpO1xuXG4gICAgICBsZXQgdXNlciA9IG51bGw7XG4gICAgICBpZiAoIXN1Yi5kZWxldGVkKSB7XG4gICAgICAgIC8vIElmIHRoaXMgaXMgYSBjaGFuZ2UgdG8gdXNlcidzIG93biBwZXJtaXNzaW9ucywgdXBkYXRlIHRoZW0gaW4gdG9waWMgdG9vLlxuICAgICAgICAvLyBEZXNjIHdpbGwgdXBkYXRlICdtZScgdG9waWMuXG4gICAgICAgIGlmICh0aGlzLl90aW5vZGUuaXNNZShzdWIudXNlcikgJiYgc3ViLmFjcykge1xuICAgICAgICAgIHRoaXMuX3Byb2Nlc3NNZXRhRGVzYyh7XG4gICAgICAgICAgICB1cGRhdGVkOiBzdWIudXBkYXRlZCxcbiAgICAgICAgICAgIHRvdWNoZWQ6IHN1Yi50b3VjaGVkLFxuICAgICAgICAgICAgYWNzOiBzdWIuYWNzXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdXNlciA9IHRoaXMuX3VwZGF0ZUNhY2hlZFVzZXIoc3ViLnVzZXIsIHN1Yik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBTdWJzY3JpcHRpb24gaXMgZGVsZXRlZCwgcmVtb3ZlIGl0IGZyb20gdG9waWMgKGJ1dCBsZWF2ZSBpbiBVc2VycyBjYWNoZSlcbiAgICAgICAgZGVsZXRlIHRoaXMuX3VzZXJzW3N1Yi51c2VyXTtcbiAgICAgICAgdXNlciA9IHN1YjtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMub25NZXRhU3ViKSB7XG4gICAgICAgIHRoaXMub25NZXRhU3ViKHVzZXIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLm9uU3Vic1VwZGF0ZWQpIHtcbiAgICAgIHRoaXMub25TdWJzVXBkYXRlZChPYmplY3Qua2V5cyh0aGlzLl91c2VycykpO1xuICAgIH1cbiAgfVxuICAvLyBDYWxsZWQgYnkgVGlub2RlIHdoZW4gbWV0YS50YWdzIGlzIHJlY2l2ZWQuXG4gIF9wcm9jZXNzTWV0YVRhZ3ModGFncykge1xuICAgIGlmICh0YWdzLmxlbmd0aCA9PSAxICYmIHRhZ3NbMF0gPT0gQ29uc3QuREVMX0NIQVIpIHtcbiAgICAgIHRhZ3MgPSBbXTtcbiAgICB9XG4gICAgdGhpcy5fdGFncyA9IHRhZ3M7XG4gICAgaWYgKHRoaXMub25UYWdzVXBkYXRlZCkge1xuICAgICAgdGhpcy5vblRhZ3NVcGRhdGVkKHRhZ3MpO1xuICAgIH1cbiAgfVxuICAvLyBEbyBub3RoaW5nIGZvciB0b3BpY3Mgb3RoZXIgdGhhbiAnbWUnXG4gIF9wcm9jZXNzTWV0YUNyZWRzKGNyZWRzKSB7fVxuICAvLyBEZWxldGUgY2FjaGVkIG1lc3NhZ2VzIGFuZCB1cGRhdGUgY2FjaGVkIHRyYW5zYWN0aW9uIElEc1xuICBfcHJvY2Vzc0RlbE1lc3NhZ2VzKGNsZWFyLCBkZWxzZXEpIHtcbiAgICB0aGlzLl9tYXhEZWwgPSBNYXRoLm1heChjbGVhciwgdGhpcy5fbWF4RGVsKTtcbiAgICB0aGlzLmNsZWFyID0gTWF0aC5tYXgoY2xlYXIsIHRoaXMuY2xlYXIpO1xuICAgIGNvbnN0IHRvcGljID0gdGhpcztcbiAgICBsZXQgY291bnQgPSAwO1xuICAgIGlmIChBcnJheS5pc0FycmF5KGRlbHNlcSkpIHtcbiAgICAgIGRlbHNlcS5mb3JFYWNoKGZ1bmN0aW9uKHJhbmdlKSB7XG4gICAgICAgIGlmICghcmFuZ2UuaGkpIHtcbiAgICAgICAgICBjb3VudCsrO1xuICAgICAgICAgIHRvcGljLmZsdXNoTWVzc2FnZShyYW5nZS5sb3cpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZvciAobGV0IGkgPSByYW5nZS5sb3c7IGkgPCByYW5nZS5oaTsgaSsrKSB7XG4gICAgICAgICAgICBjb3VudCsrO1xuICAgICAgICAgICAgdG9waWMuZmx1c2hNZXNzYWdlKGkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKGNvdW50ID4gMCkge1xuICAgICAgdGhpcy5fdXBkYXRlRGVsZXRlZFJhbmdlcygpO1xuXG4gICAgICBpZiAodGhpcy5vbkRhdGEpIHtcbiAgICAgICAgdGhpcy5vbkRhdGEoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgLy8gVG9waWMgaXMgaW5mb3JtZWQgdGhhdCB0aGUgZW50aXJlIHJlc3BvbnNlIHRvIHtnZXQgd2hhdD1kYXRhfSBoYXMgYmVlbiByZWNlaXZlZC5cbiAgX2FsbE1lc3NhZ2VzUmVjZWl2ZWQoY291bnQpIHtcbiAgICB0aGlzLl91cGRhdGVEZWxldGVkUmFuZ2VzKCk7XG5cbiAgICBpZiAodGhpcy5vbkFsbE1lc3NhZ2VzUmVjZWl2ZWQpIHtcbiAgICAgIHRoaXMub25BbGxNZXNzYWdlc1JlY2VpdmVkKGNvdW50KTtcbiAgICB9XG4gIH1cbiAgLy8gUmVzZXQgc3Vic2NyaWJlZCBzdGF0ZVxuICBfcmVzZXRTdWIoKSB7XG4gICAgdGhpcy5fYXR0YWNoZWQgPSBmYWxzZTtcbiAgfVxuICAvLyBUaGlzIHRvcGljIGlzIGVpdGhlciBkZWxldGVkIG9yIHVuc3Vic2NyaWJlZCBmcm9tLlxuICBfZ29uZSgpIHtcbiAgICB0aGlzLl9tZXNzYWdlcy5yZXNldCgpO1xuICAgIHRoaXMuX3Rpbm9kZS5fZGIucmVtTWVzc2FnZXModGhpcy5uYW1lKTtcbiAgICB0aGlzLl91c2VycyA9IHt9O1xuICAgIHRoaXMuYWNzID0gbmV3IEFjY2Vzc01vZGUobnVsbCk7XG4gICAgdGhpcy5wcml2YXRlID0gbnVsbDtcbiAgICB0aGlzLnB1YmxpYyA9IG51bGw7XG4gICAgdGhpcy50cnVzdGVkID0gbnVsbDtcbiAgICB0aGlzLl9tYXhTZXEgPSAwO1xuICAgIHRoaXMuX21pblNlcSA9IDA7XG4gICAgdGhpcy5fYXR0YWNoZWQgPSBmYWxzZTtcblxuICAgIGNvbnN0IG1lID0gdGhpcy5fdGlub2RlLmdldE1lVG9waWMoKTtcbiAgICBpZiAobWUpIHtcbiAgICAgIG1lLl9yb3V0ZVByZXMoe1xuICAgICAgICBfbm9Gb3J3YXJkaW5nOiB0cnVlLFxuICAgICAgICB3aGF0OiAnZ29uZScsXG4gICAgICAgIHRvcGljOiBDb25zdC5UT1BJQ19NRSxcbiAgICAgICAgc3JjOiB0aGlzLm5hbWVcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAodGhpcy5vbkRlbGV0ZVRvcGljKSB7XG4gICAgICB0aGlzLm9uRGVsZXRlVG9waWMoKTtcbiAgICB9XG4gIH1cbiAgLy8gVXBkYXRlIGdsb2JhbCB1c2VyIGNhY2hlIGFuZCBsb2NhbCBzdWJzY3JpYmVycyBjYWNoZS5cbiAgLy8gRG9uJ3QgY2FsbCB0aGlzIG1ldGhvZCBmb3Igbm9uLXN1YnNjcmliZXJzLlxuICBfdXBkYXRlQ2FjaGVkVXNlcih1aWQsIG9iaikge1xuICAgIC8vIEZldGNoIHVzZXIgb2JqZWN0IGZyb20gdGhlIGdsb2JhbCBjYWNoZS5cbiAgICAvLyBUaGlzIGlzIGEgY2xvbmUgb2YgdGhlIHN0b3JlZCBvYmplY3RcbiAgICBsZXQgY2FjaGVkID0gdGhpcy5fY2FjaGVHZXRVc2VyKHVpZCk7XG4gICAgY2FjaGVkID0gbWVyZ2VPYmooY2FjaGVkIHx8IHt9LCBvYmopO1xuICAgIC8vIFNhdmUgdG8gZ2xvYmFsIGNhY2hlXG4gICAgdGhpcy5fY2FjaGVQdXRVc2VyKHVpZCwgY2FjaGVkKTtcbiAgICAvLyBTYXZlIHRvIHRoZSBsaXN0IG9mIHRvcGljIHN1YnNyaWJlcnMuXG4gICAgcmV0dXJuIG1lcmdlVG9DYWNoZSh0aGlzLl91c2VycywgdWlkLCBjYWNoZWQpO1xuICB9XG4gIC8vIEdldCBsb2NhbCBzZXFJZCBmb3IgYSBxdWV1ZWQgbWVzc2FnZS5cbiAgX2dldFF1ZXVlZFNlcUlkKCkge1xuICAgIHJldHVybiB0aGlzLl9xdWV1ZWRTZXFJZCsrO1xuICB9XG4gIC8vIENhbGN1bGF0ZSByYW5nZXMgb2YgbWlzc2luZyBtZXNzYWdlcy5cbiAgX3VwZGF0ZURlbGV0ZWRSYW5nZXMoKSB7XG4gICAgY29uc3QgcmFuZ2VzID0gW107XG5cbiAgICAvLyBHYXAgbWFya2VyLCBwb3NzaWJseSBlbXB0eS5cbiAgICBsZXQgcHJldiA9IG51bGw7XG5cbiAgICAvLyBDaGVjayBmb3IgZ2FwIGluIHRoZSBiZWdpbm5pbmcsIGJlZm9yZSB0aGUgZmlyc3QgbWVzc2FnZS5cbiAgICBjb25zdCBmaXJzdCA9IHRoaXMuX21lc3NhZ2VzLmdldEF0KDApO1xuICAgIGlmIChmaXJzdCAmJiB0aGlzLl9taW5TZXEgPiAxICYmICF0aGlzLl9ub0VhcmxpZXJNc2dzKSB7XG4gICAgICAvLyBTb21lIG1lc3NhZ2VzIGFyZSBtaXNzaW5nIGluIHRoZSBiZWdpbm5pbmcuXG4gICAgICBpZiAoZmlyc3QuaGkpIHtcbiAgICAgICAgLy8gVGhlIGZpcnN0IG1lc3NhZ2UgYWxyZWFkeSByZXByZXNlbnRzIGEgZ2FwLlxuICAgICAgICBpZiAoZmlyc3Quc2VxID4gMSkge1xuICAgICAgICAgIGZpcnN0LnNlcSA9IDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZpcnN0LmhpIDwgdGhpcy5fbWluU2VxIC0gMSkge1xuICAgICAgICAgIGZpcnN0LmhpID0gdGhpcy5fbWluU2VxIC0gMTtcbiAgICAgICAgfVxuICAgICAgICBwcmV2ID0gZmlyc3Q7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBDcmVhdGUgbmV3IGdhcC5cbiAgICAgICAgcHJldiA9IHtcbiAgICAgICAgICBzZXE6IDEsXG4gICAgICAgICAgaGk6IHRoaXMuX21pblNlcSAtIDFcbiAgICAgICAgfTtcbiAgICAgICAgcmFuZ2VzLnB1c2gocHJldik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIE5vIGdhcCBpbiB0aGUgYmVnaW5uaW5nLlxuICAgICAgcHJldiA9IHtcbiAgICAgICAgc2VxOiAwLFxuICAgICAgICBoaTogMFxuICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBGaW5kIG5ldyBnYXBzIGluIHRoZSBsaXN0IG9mIHJlY2VpdmVkIG1lc3NhZ2VzLiBUaGUgbGlzdCBjb250YWlucyBtZXNzYWdlcy1wcm9wZXIgYXMgd2VsbFxuICAgIC8vIGFzIHBsYWNlaG9sZGVycyBmb3IgZGVsZXRlZCByYW5nZXMuXG4gICAgLy8gVGhlIG1lc3NhZ2VzIGFyZSBpdGVyYXRlZCBieSBzZXEgSUQgaW4gYXNjZW5kaW5nIG9yZGVyLlxuICAgIHRoaXMuX21lc3NhZ2VzLmZpbHRlcigoZGF0YSkgPT4ge1xuICAgICAgLy8gRG8gbm90IGNyZWF0ZSBhIGdhcCBiZXR3ZWVuIHRoZSBsYXN0IHNlbnQgbWVzc2FnZSBhbmQgdGhlIGZpcnN0IHVuc2VudCBhcyB3ZWxsIGFzIGJldHdlZW4gdW5zZW50IG1lc3NhZ2VzLlxuICAgICAgaWYgKGRhdGEuc2VxID49IENvbnN0LkxPQ0FMX1NFUUlEKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBDaGVjayBmb3IgYSBnYXAgYmV0d2VlbiB0aGUgcHJldmlvdXMgbWVzc2FnZS9tYXJrZXIgYW5kIHRoaXMgbWVzc2FnZS9tYXJrZXIuXG4gICAgICBpZiAoZGF0YS5zZXEgPT0gKHByZXYuaGkgfHwgcHJldi5zZXEpICsgMSkge1xuICAgICAgICAvLyBObyBnYXAgYmV0d2VlbiB0aGlzIG1lc3NhZ2UgYW5kIHRoZSBwcmV2aW91cy5cbiAgICAgICAgaWYgKGRhdGEuaGkgJiYgcHJldi5oaSkge1xuICAgICAgICAgIC8vIFR3byBnYXAgbWFya2VycyBpbiBhIHJvdy4gRXh0ZW5kIHRoZSBwcmV2aW91cyBvbmUsIGRpc2NhcmQgdGhlIGN1cnJlbnQuXG4gICAgICAgICAgcHJldi5oaSA9IGRhdGEuaGk7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHByZXYgPSBkYXRhO1xuXG4gICAgICAgIC8vIEtlZXAgY3VycmVudC5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIC8vIEZvdW5kIGEgbmV3IGdhcC5cbiAgICAgIC8vIENoZWNrIGlmIHRoZSBwcmV2aW91cyBpcyBhbHNvIGEgZ2FwIG1hcmtlci5cbiAgICAgIGlmIChwcmV2LmhpKSB7XG4gICAgICAgIC8vIEFsdGVyIGl0IGluc3RlYWQgb2YgY3JlYXRpbmcgYSBuZXcgb25lLlxuICAgICAgICBwcmV2LmhpID0gZGF0YS5oaSB8fCBkYXRhLnNlcTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFByZXZpb3VzIGlzIG5vdCBhIGdhcCBtYXJrZXIuIENyZWF0ZSBhIG5ldyBvbmUuXG4gICAgICAgIHByZXYgPSB7XG4gICAgICAgICAgc2VxOiBwcmV2LnNlcSArIDEsXG4gICAgICAgICAgaGk6IGRhdGEuaGkgfHwgZGF0YS5zZXFcbiAgICAgICAgfTtcbiAgICAgICAgcmFuZ2VzLnB1c2gocHJldik7XG4gICAgICB9XG5cbiAgICAgIC8vIElmIG1hcmtlciwgcmVtb3ZlOyBrZWVwIGlmIHJlZ3VsYXIgbWVzc2FnZS5cbiAgICAgIGlmICghZGF0YS5oaSkge1xuICAgICAgICAvLyBLZWVwaW5nIHRoZSBjdXJyZW50IHJlZ3VsYXIgbWVzc2FnZSwgc2F2ZSBpdCBhcyBwcmV2aW91cy5cbiAgICAgICAgcHJldiA9IGRhdGE7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBEaXNjYXJkIHRoZSBjdXJyZW50IGdhcCBtYXJrZXI6IHdlIGVpdGhlciBjcmVhdGVkIGFuIGVhcmxpZXIgZ2FwLCBvciBleHRlbmRlZCB0aGUgcHJldm91cyBvbmUuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSk7XG5cbiAgICAvLyBDaGVjayBmb3IgbWlzc2luZyBtZXNzYWdlcyBhdCB0aGUgZW5kLlxuICAgIC8vIEFsbCBtZXNzYWdlcyBjb3VsZCBiZSBtaXNzaW5nIG9yIGl0IGNvdWxkIGJlIGEgbmV3IHRvcGljIHdpdGggbm8gbWVzc2FnZXMuXG4gICAgY29uc3QgbGFzdCA9IHRoaXMuX21lc3NhZ2VzLmdldExhc3QoKTtcbiAgICBjb25zdCBtYXhTZXEgPSBNYXRoLm1heCh0aGlzLnNlcSwgdGhpcy5fbWF4U2VxKSB8fCAwO1xuICAgIGlmICgobWF4U2VxID4gMCAmJiAhbGFzdCkgfHwgKGxhc3QgJiYgKChsYXN0LmhpIHx8IGxhc3Quc2VxKSA8IG1heFNlcSkpKSB7XG4gICAgICBpZiAobGFzdCAmJiBsYXN0LmhpKSB7XG4gICAgICAgIC8vIEV4dGVuZCBleGlzdGluZyBnYXBcbiAgICAgICAgbGFzdC5oaSA9IG1heFNlcTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIENyZWF0ZSBuZXcgZ2FwLlxuICAgICAgICByYW5nZXMucHVzaCh7XG4gICAgICAgICAgc2VxOiBsYXN0ID8gbGFzdC5zZXEgKyAxIDogMSxcbiAgICAgICAgICBoaTogbWF4U2VxXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEluc2VydCBuZXcgZ2FwcyBpbnRvIGNhY2hlLlxuICAgIHJhbmdlcy5mb3JFYWNoKChnYXApID0+IHtcbiAgICAgIGdhcC5fc3RhdHVzID0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfREVMX1JBTkdFO1xuICAgICAgdGhpcy5fbWVzc2FnZXMucHV0KGdhcCk7XG4gICAgfSk7XG4gIH1cbiAgLy8gTG9hZCBtb3N0IHJlY2VudCBtZXNzYWdlcyBmcm9tIHBlcnNpc3RlbnQgY2FjaGUuXG4gIF9sb2FkTWVzc2FnZXMoZGIsIHBhcmFtcykge1xuICAgIGNvbnN0IHtcbiAgICAgIHNpbmNlLFxuICAgICAgYmVmb3JlLFxuICAgICAgbGltaXRcbiAgICB9ID0gcGFyYW1zIHx8IHt9O1xuICAgIHJldHVybiBkYi5yZWFkTWVzc2FnZXModGhpcy5uYW1lLCB7XG4gICAgICAgIHNpbmNlOiBzaW5jZSxcbiAgICAgICAgYmVmb3JlOiBiZWZvcmUsXG4gICAgICAgIGxpbWl0OiBsaW1pdCB8fCBDb25zdC5ERUZBVUxUX01FU1NBR0VTX1BBR0VcbiAgICAgIH0pXG4gICAgICAudGhlbigobXNncykgPT4ge1xuICAgICAgICBtc2dzLmZvckVhY2goKGRhdGEpID0+IHtcbiAgICAgICAgICBpZiAoZGF0YS5zZXEgPiB0aGlzLl9tYXhTZXEpIHtcbiAgICAgICAgICAgIHRoaXMuX21heFNlcSA9IGRhdGEuc2VxO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZGF0YS5zZXEgPCB0aGlzLl9taW5TZXEgfHwgdGhpcy5fbWluU2VxID09IDApIHtcbiAgICAgICAgICAgIHRoaXMuX21pblNlcSA9IGRhdGEuc2VxO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLl9tZXNzYWdlcy5wdXQoZGF0YSk7XG4gICAgICAgICAgdGhpcy5fbWF5YmVVcGRhdGVNZXNzYWdlVmVyc2lvbnNDYWNoZShkYXRhKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChtc2dzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICB0aGlzLl91cGRhdGVEZWxldGVkUmFuZ2VzKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1zZ3MubGVuZ3RoO1xuICAgICAgfSk7XG4gIH1cbiAgLy8gUHVzaCBvciB7cHJlc306IG1lc3NhZ2UgcmVjZWl2ZWQuXG4gIF91cGRhdGVSZWNlaXZlZChzZXEsIGFjdCkge1xuICAgIHRoaXMudG91Y2hlZCA9IG5ldyBEYXRlKCk7XG4gICAgdGhpcy5zZXEgPSBzZXEgfCAwO1xuICAgIC8vIENoZWNrIGlmIG1lc3NhZ2UgaXMgc2VudCBieSB0aGUgY3VycmVudCB1c2VyLiBJZiBzbyBpdCdzIGJlZW4gcmVhZCBhbHJlYWR5LlxuICAgIGlmICghYWN0IHx8IHRoaXMuX3Rpbm9kZS5pc01lKGFjdCkpIHtcbiAgICAgIHRoaXMucmVhZCA9IHRoaXMucmVhZCA/IE1hdGgubWF4KHRoaXMucmVhZCwgdGhpcy5zZXEpIDogdGhpcy5zZXE7XG4gICAgICB0aGlzLnJlY3YgPSB0aGlzLnJlY3YgPyBNYXRoLm1heCh0aGlzLnJlYWQsIHRoaXMucmVjdikgOiB0aGlzLnJlYWQ7XG4gICAgfVxuICAgIHRoaXMudW5yZWFkID0gdGhpcy5zZXEgLSAodGhpcy5yZWFkIHwgMCk7XG4gICAgdGhpcy5fdGlub2RlLl9kYi51cGRUb3BpYyh0aGlzKTtcbiAgfVxufVxuXG5cbi8qKlxuICogQGNsYXNzIFRvcGljTWUgLSBzcGVjaWFsIGNhc2Ugb2Yge0BsaW5rIFRpbm9kZS5Ub3BpY30gZm9yXG4gKiBtYW5hZ2luZyBkYXRhIG9mIHRoZSBjdXJyZW50IHVzZXIsIGluY2x1ZGluZyBjb250YWN0IGxpc3QuXG4gKiBAZXh0ZW5kcyBUaW5vZGUuVG9waWNcbiAqIEBtZW1iZXJvZiBUaW5vZGVcbiAqXG4gKiBAcGFyYW0ge1RvcGljTWUuQ2FsbGJhY2tzfSBjYWxsYmFja3MgLSBDYWxsYmFja3MgdG8gcmVjZWl2ZSB2YXJpb3VzIGV2ZW50cy5cbiAqL1xuLyoqXG4gKiBAY2xhc3MgVG9waWNNZSAtIHNwZWNpYWwgY2FzZSBvZiB7QGxpbmsgVGlub2RlLlRvcGljfSBmb3JcbiAqIG1hbmFnaW5nIGRhdGEgb2YgdGhlIGN1cnJlbnQgdXNlciwgaW5jbHVkaW5nIGNvbnRhY3QgbGlzdC5cbiAqIEBleHRlbmRzIFRpbm9kZS5Ub3BpY1xuICogQG1lbWJlcm9mIFRpbm9kZVxuICpcbiAqIEBwYXJhbSB7VG9waWNNZS5DYWxsYmFja3N9IGNhbGxiYWNrcyAtIENhbGxiYWNrcyB0byByZWNlaXZlIHZhcmlvdXMgZXZlbnRzLlxuICovXG5leHBvcnQgY2xhc3MgVG9waWNNZSBleHRlbmRzIFRvcGljIHtcbiAgb25Db250YWN0VXBkYXRlO1xuXG4gIGNvbnN0cnVjdG9yKGNhbGxiYWNrcykge1xuICAgIHN1cGVyKENvbnN0LlRPUElDX01FLCBjYWxsYmFja3MpO1xuXG4gICAgLy8gbWUtc3BlY2lmaWMgY2FsbGJhY2tzXG4gICAgaWYgKGNhbGxiYWNrcykge1xuICAgICAgdGhpcy5vbkNvbnRhY3RVcGRhdGUgPSBjYWxsYmFja3Mub25Db250YWN0VXBkYXRlO1xuICAgIH1cbiAgfVxuXG4gIC8vIE92ZXJyaWRlIHRoZSBvcmlnaW5hbCBUb3BpYy5fcHJvY2Vzc01ldGFEZXNjLlxuICBfcHJvY2Vzc01ldGFEZXNjKGRlc2MpIHtcbiAgICAvLyBDaGVjayBpZiBvbmxpbmUgY29udGFjdHMgbmVlZCB0byBiZSB0dXJuZWQgb2ZmIGJlY2F1c2UgUCBwZXJtaXNzaW9uIHdhcyByZW1vdmVkLlxuICAgIGNvbnN0IHR1cm5PZmYgPSAoZGVzYy5hY3MgJiYgIWRlc2MuYWNzLmlzUHJlc2VuY2VyKCkpICYmICh0aGlzLmFjcyAmJiB0aGlzLmFjcy5pc1ByZXNlbmNlcigpKTtcblxuICAgIC8vIENvcHkgcGFyYW1ldGVycyBmcm9tIGRlc2Mgb2JqZWN0IHRvIHRoaXMgdG9waWMuXG4gICAgbWVyZ2VPYmoodGhpcywgZGVzYyk7XG4gICAgdGhpcy5fdGlub2RlLl9kYi51cGRUb3BpYyh0aGlzKTtcbiAgICAvLyBVcGRhdGUgY3VycmVudCB1c2VyJ3MgcmVjb3JkIGluIHRoZSBnbG9iYWwgY2FjaGUuXG4gICAgdGhpcy5fdXBkYXRlQ2FjaGVkVXNlcih0aGlzLl90aW5vZGUuX215VUlELCBkZXNjKTtcblxuICAgIC8vICdQJyBwZXJtaXNzaW9uIHdhcyByZW1vdmVkLiBBbGwgdG9waWNzIGFyZSBvZmZsaW5lIG5vdy5cbiAgICBpZiAodHVybk9mZikge1xuICAgICAgdGhpcy5fdGlub2RlLm1hcFRvcGljcygoY29udCkgPT4ge1xuICAgICAgICBpZiAoY29udC5vbmxpbmUpIHtcbiAgICAgICAgICBjb250Lm9ubGluZSA9IGZhbHNlO1xuICAgICAgICAgIGNvbnQuc2VlbiA9IE9iamVjdC5hc3NpZ24oY29udC5zZWVuIHx8IHt9LCB7XG4gICAgICAgICAgICB3aGVuOiBuZXcgRGF0ZSgpXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdGhpcy5fcmVmcmVzaENvbnRhY3QoJ29mZicsIGNvbnQpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vbk1ldGFEZXNjKSB7XG4gICAgICB0aGlzLm9uTWV0YURlc2ModGhpcyk7XG4gICAgfVxuICB9XG5cbiAgLy8gT3ZlcnJpZGUgdGhlIG9yaWdpbmFsIFRvcGljLl9wcm9jZXNzTWV0YVN1YlxuICBfcHJvY2Vzc01ldGFTdWIoc3Vicykge1xuICAgIGxldCB1cGRhdGVDb3VudCA9IDA7XG4gICAgc3Vicy5mb3JFYWNoKChzdWIpID0+IHtcbiAgICAgIGNvbnN0IHRvcGljTmFtZSA9IHN1Yi50b3BpYztcbiAgICAgIC8vIERvbid0IHNob3cgJ21lJyBhbmQgJ2ZuZCcgdG9waWNzIGluIHRoZSBsaXN0IG9mIGNvbnRhY3RzLlxuICAgICAgaWYgKHRvcGljTmFtZSA9PSBDb25zdC5UT1BJQ19GTkQgfHwgdG9waWNOYW1lID09IENvbnN0LlRPUElDX01FKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHN1Yi5vbmxpbmUgPSAhIXN1Yi5vbmxpbmU7XG5cbiAgICAgIGxldCBjb250ID0gbnVsbDtcbiAgICAgIGlmIChzdWIuZGVsZXRlZCkge1xuICAgICAgICBjb250ID0gc3ViO1xuICAgICAgICB0aGlzLl90aW5vZGUuY2FjaGVSZW1Ub3BpYyh0b3BpY05hbWUpO1xuICAgICAgICB0aGlzLl90aW5vZGUuX2RiLnJlbVRvcGljKHRvcGljTmFtZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBFbnN1cmUgdGhlIHZhbHVlcyBhcmUgZGVmaW5lZCBhbmQgYXJlIGludGVnZXJzLlxuICAgICAgICBpZiAodHlwZW9mIHN1Yi5zZXEgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICBzdWIuc2VxID0gc3ViLnNlcSB8IDA7XG4gICAgICAgICAgc3ViLnJlY3YgPSBzdWIucmVjdiB8IDA7XG4gICAgICAgICAgc3ViLnJlYWQgPSBzdWIucmVhZCB8IDA7XG4gICAgICAgICAgc3ViLnVucmVhZCA9IHN1Yi5zZXEgLSBzdWIucmVhZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHRvcGljID0gdGhpcy5fdGlub2RlLmdldFRvcGljKHRvcGljTmFtZSk7XG4gICAgICAgIGlmICh0b3BpYy5fbmV3KSB7XG4gICAgICAgICAgZGVsZXRlIHRvcGljLl9uZXc7XG4gICAgICAgIH1cblxuICAgICAgICBjb250ID0gbWVyZ2VPYmoodG9waWMsIHN1Yik7XG4gICAgICAgIHRoaXMuX3Rpbm9kZS5fZGIudXBkVG9waWMoY29udCk7XG5cbiAgICAgICAgaWYgKFRvcGljLmlzUDJQVG9waWNOYW1lKHRvcGljTmFtZSkpIHtcbiAgICAgICAgICB0aGlzLl9jYWNoZVB1dFVzZXIodG9waWNOYW1lLCBjb250KTtcbiAgICAgICAgICB0aGlzLl90aW5vZGUuX2RiLnVwZFVzZXIodG9waWNOYW1lLCBjb250LnB1YmxpYyk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gTm90aWZ5IHRvcGljIG9mIHRoZSB1cGRhdGUgaWYgaXQncyBhbiBleHRlcm5hbCB1cGRhdGUuXG4gICAgICAgIGlmICghc3ViLl9ub0ZvcndhcmRpbmcgJiYgdG9waWMpIHtcbiAgICAgICAgICBzdWIuX25vRm9yd2FyZGluZyA9IHRydWU7XG4gICAgICAgICAgdG9waWMuX3Byb2Nlc3NNZXRhRGVzYyhzdWIpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHVwZGF0ZUNvdW50Kys7XG5cbiAgICAgIGlmICh0aGlzLm9uTWV0YVN1Yikge1xuICAgICAgICB0aGlzLm9uTWV0YVN1Yihjb250KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmICh0aGlzLm9uU3Vic1VwZGF0ZWQgJiYgdXBkYXRlQ291bnQgPiAwKSB7XG4gICAgICBjb25zdCBrZXlzID0gW107XG4gICAgICBzdWJzLmZvckVhY2goKHMpID0+IHtcbiAgICAgICAga2V5cy5wdXNoKHMudG9waWMpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLm9uU3Vic1VwZGF0ZWQoa2V5cywgdXBkYXRlQ291bnQpO1xuICAgIH1cbiAgfVxuXG4gIC8vIENhbGxlZCBieSBUaW5vZGUgd2hlbiBtZXRhLnN1YiBpcyByZWNpdmVkLlxuICBfcHJvY2Vzc01ldGFDcmVkcyhjcmVkcywgdXBkKSB7XG4gICAgaWYgKGNyZWRzLmxlbmd0aCA9PSAxICYmIGNyZWRzWzBdID09IENvbnN0LkRFTF9DSEFSKSB7XG4gICAgICBjcmVkcyA9IFtdO1xuICAgIH1cbiAgICBpZiAodXBkKSB7XG4gICAgICBjcmVkcy5mb3JFYWNoKChjcikgPT4ge1xuICAgICAgICBpZiAoY3IudmFsKSB7XG4gICAgICAgICAgLy8gQWRkaW5nIGEgY3JlZGVudGlhbC5cbiAgICAgICAgICBsZXQgaWR4ID0gdGhpcy5fY3JlZGVudGlhbHMuZmluZEluZGV4KChlbCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGVsLm1ldGggPT0gY3IubWV0aCAmJiBlbC52YWwgPT0gY3IudmFsO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmIChpZHggPCAwKSB7XG4gICAgICAgICAgICAvLyBOb3QgZm91bmQuXG4gICAgICAgICAgICBpZiAoIWNyLmRvbmUpIHtcbiAgICAgICAgICAgICAgLy8gVW5jb25maXJtZWQgY3JlZGVudGlhbCByZXBsYWNlcyBwcmV2aW91cyB1bmNvbmZpcm1lZCBjcmVkZW50aWFsIG9mIHRoZSBzYW1lIG1ldGhvZC5cbiAgICAgICAgICAgICAgaWR4ID0gdGhpcy5fY3JlZGVudGlhbHMuZmluZEluZGV4KChlbCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBlbC5tZXRoID09IGNyLm1ldGggJiYgIWVsLmRvbmU7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBpZiAoaWR4ID49IDApIHtcbiAgICAgICAgICAgICAgICAvLyBSZW1vdmUgcHJldmlvdXMgdW5jb25maXJtZWQgY3JlZGVudGlhbC5cbiAgICAgICAgICAgICAgICB0aGlzLl9jcmVkZW50aWFscy5zcGxpY2UoaWR4LCAxKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fY3JlZGVudGlhbHMucHVzaChjcik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIEZvdW5kLiBNYXliZSBjaGFuZ2UgJ2RvbmUnIHN0YXR1cy5cbiAgICAgICAgICAgIHRoaXMuX2NyZWRlbnRpYWxzW2lkeF0uZG9uZSA9IGNyLmRvbmU7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGNyLnJlc3ApIHtcbiAgICAgICAgICAvLyBIYW5kbGUgY3JlZGVudGlhbCBjb25maXJtYXRpb24uXG4gICAgICAgICAgY29uc3QgaWR4ID0gdGhpcy5fY3JlZGVudGlhbHMuZmluZEluZGV4KChlbCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGVsLm1ldGggPT0gY3IubWV0aCAmJiAhZWwuZG9uZTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAoaWR4ID49IDApIHtcbiAgICAgICAgICAgIHRoaXMuX2NyZWRlbnRpYWxzW2lkeF0uZG9uZSA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fY3JlZGVudGlhbHMgPSBjcmVkcztcbiAgICB9XG4gICAgaWYgKHRoaXMub25DcmVkc1VwZGF0ZWQpIHtcbiAgICAgIHRoaXMub25DcmVkc1VwZGF0ZWQodGhpcy5fY3JlZGVudGlhbHMpO1xuICAgIH1cbiAgfVxuXG4gIC8vIFByb2Nlc3MgcHJlc2VuY2UgY2hhbmdlIG1lc3NhZ2VcbiAgX3JvdXRlUHJlcyhwcmVzKSB7XG4gICAgaWYgKHByZXMud2hhdCA9PSAndGVybScpIHtcbiAgICAgIC8vIFRoZSAnbWUnIHRvcGljIGl0c2VsZiBpcyBkZXRhY2hlZC4gTWFyayBhcyB1bnN1YnNjcmliZWQuXG4gICAgICB0aGlzLl9yZXNldFN1YigpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChwcmVzLndoYXQgPT0gJ3VwZCcgJiYgcHJlcy5zcmMgPT0gQ29uc3QuVE9QSUNfTUUpIHtcbiAgICAgIC8vIFVwZGF0ZSB0byBtZSdzIGRlc2NyaXB0aW9uLiBSZXF1ZXN0IHVwZGF0ZWQgdmFsdWUuXG4gICAgICB0aGlzLmdldE1ldGEodGhpcy5zdGFydE1ldGFRdWVyeSgpLndpdGhEZXNjKCkuYnVpbGQoKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgY29udCA9IHRoaXMuX3Rpbm9kZS5jYWNoZUdldFRvcGljKHByZXMuc3JjKTtcbiAgICBpZiAoY29udCkge1xuICAgICAgc3dpdGNoIChwcmVzLndoYXQpIHtcbiAgICAgICAgY2FzZSAnb24nOiAvLyB0b3BpYyBjYW1lIG9ubGluZVxuICAgICAgICAgIGNvbnQub25saW5lID0gdHJ1ZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnb2ZmJzogLy8gdG9waWMgd2VudCBvZmZsaW5lXG4gICAgICAgICAgaWYgKGNvbnQub25saW5lKSB7XG4gICAgICAgICAgICBjb250Lm9ubGluZSA9IGZhbHNlO1xuICAgICAgICAgICAgY29udC5zZWVuID0gT2JqZWN0LmFzc2lnbihjb250LnNlZW4gfHwge30sIHtcbiAgICAgICAgICAgICAgd2hlbjogbmV3IERhdGUoKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdtc2cnOiAvLyBuZXcgbWVzc2FnZSByZWNlaXZlZFxuICAgICAgICAgIGNvbnQuX3VwZGF0ZVJlY2VpdmVkKHByZXMuc2VxLCBwcmVzLmFjdCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3VwZCc6IC8vIGRlc2MgdXBkYXRlZFxuICAgICAgICAgIC8vIFJlcXVlc3QgdXBkYXRlZCBzdWJzY3JpcHRpb24uXG4gICAgICAgICAgdGhpcy5nZXRNZXRhKHRoaXMuc3RhcnRNZXRhUXVlcnkoKS53aXRoTGF0ZXJPbmVTdWIocHJlcy5zcmMpLmJ1aWxkKCkpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdhY3MnOiAvLyBhY2Nlc3MgbW9kZSBjaGFuZ2VkXG4gICAgICAgICAgaWYgKGNvbnQuYWNzKSB7XG4gICAgICAgICAgICBjb250LmFjcy51cGRhdGVBbGwocHJlcy5kYWNzKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29udC5hY3MgPSBuZXcgQWNjZXNzTW9kZSgpLnVwZGF0ZUFsbChwcmVzLmRhY3MpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb250LnRvdWNoZWQgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICd1YSc6XG4gICAgICAgICAgLy8gdXNlciBhZ2VudCBjaGFuZ2VkLlxuICAgICAgICAgIGNvbnQuc2VlbiA9IHtcbiAgICAgICAgICAgIHdoZW46IG5ldyBEYXRlKCksXG4gICAgICAgICAgICB1YTogcHJlcy51YVxuICAgICAgICAgIH07XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3JlY3YnOlxuICAgICAgICAgIC8vIHVzZXIncyBvdGhlciBzZXNzaW9uIG1hcmtlZCBzb21lIG1lc3NnZXMgYXMgcmVjZWl2ZWQuXG4gICAgICAgICAgcHJlcy5zZXEgPSBwcmVzLnNlcSB8IDA7XG4gICAgICAgICAgY29udC5yZWN2ID0gY29udC5yZWN2ID8gTWF0aC5tYXgoY29udC5yZWN2LCBwcmVzLnNlcSkgOiBwcmVzLnNlcTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAncmVhZCc6XG4gICAgICAgICAgLy8gdXNlcidzIG90aGVyIHNlc3Npb24gbWFya2VkIHNvbWUgbWVzc2FnZXMgYXMgcmVhZC5cbiAgICAgICAgICBwcmVzLnNlcSA9IHByZXMuc2VxIHwgMDtcbiAgICAgICAgICBjb250LnJlYWQgPSBjb250LnJlYWQgPyBNYXRoLm1heChjb250LnJlYWQsIHByZXMuc2VxKSA6IHByZXMuc2VxO1xuICAgICAgICAgIGNvbnQucmVjdiA9IGNvbnQucmVjdiA/IE1hdGgubWF4KGNvbnQucmVhZCwgY29udC5yZWN2KSA6IGNvbnQucmVjdjtcbiAgICAgICAgICBjb250LnVucmVhZCA9IGNvbnQuc2VxIC0gY29udC5yZWFkO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdnb25lJzpcbiAgICAgICAgICAvLyB0b3BpYyBkZWxldGVkIG9yIHVuc3Vic2NyaWJlZCBmcm9tLlxuICAgICAgICAgIGlmICghY29udC5fZGVsZXRlZCkge1xuICAgICAgICAgICAgY29udC5fZGVsZXRlZCA9IHRydWU7XG4gICAgICAgICAgICBjb250Ll9hdHRhY2hlZCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5fdGlub2RlLl9kYi5tYXJrVG9waWNBc0RlbGV0ZWQocHJlcy5zcmMpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl90aW5vZGUuX2RiLnJlbVRvcGljKHByZXMuc3JjKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2RlbCc6XG4gICAgICAgICAgLy8gVXBkYXRlIHRvcGljLmRlbCB2YWx1ZS5cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICB0aGlzLl90aW5vZGUubG9nZ2VyKFwiSU5GTzogVW5zdXBwb3J0ZWQgcHJlc2VuY2UgdXBkYXRlIGluICdtZSdcIiwgcHJlcy53aGF0KTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fcmVmcmVzaENvbnRhY3QocHJlcy53aGF0LCBjb250KTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHByZXMud2hhdCA9PSAnYWNzJykge1xuICAgICAgICAvLyBOZXcgc3Vic2NyaXB0aW9ucyBhbmQgZGVsZXRlZC9iYW5uZWQgc3Vic2NyaXB0aW9ucyBoYXZlIGZ1bGxcbiAgICAgICAgLy8gYWNjZXNzIG1vZGUgKG5vICsgb3IgLSBpbiB0aGUgZGFjcyBzdHJpbmcpLiBDaGFuZ2VzIHRvIGtub3duIHN1YnNjcmlwdGlvbnMgYXJlIHNlbnQgYXNcbiAgICAgICAgLy8gZGVsdGFzLCBidXQgdGhleSBzaG91bGQgbm90IGhhcHBlbiBoZXJlLlxuICAgICAgICBjb25zdCBhY3MgPSBuZXcgQWNjZXNzTW9kZShwcmVzLmRhY3MpO1xuICAgICAgICBpZiAoIWFjcyB8fCBhY3MubW9kZSA9PSBBY2Nlc3NNb2RlLl9JTlZBTElEKSB7XG4gICAgICAgICAgdGhpcy5fdGlub2RlLmxvZ2dlcihcIkVSUk9SOiBJbnZhbGlkIGFjY2VzcyBtb2RlIHVwZGF0ZVwiLCBwcmVzLnNyYywgcHJlcy5kYWNzKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gZWxzZSBpZiAoYWNzLm1vZGUgPT0gQWNjZXNzTW9kZS5fTk9ORSkge1xuICAgICAgICAgIHRoaXMuX3Rpbm9kZS5sb2dnZXIoXCJXQVJOSU5HOiBSZW1vdmluZyBub24tZXhpc3RlbnQgc3Vic2NyaXB0aW9uXCIsIHByZXMuc3JjLCBwcmVzLmRhY3MpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBOZXcgc3Vic2NyaXB0aW9uLiBTZW5kIHJlcXVlc3QgZm9yIHRoZSBmdWxsIGRlc2NyaXB0aW9uLlxuICAgICAgICAgIC8vIFVzaW5nIC53aXRoT25lU3ViIChub3QgLndpdGhMYXRlck9uZVN1YikgdG8gbWFrZSBzdXJlIElmTW9kaWZpZWRTaW5jZSBpcyBub3Qgc2V0LlxuICAgICAgICAgIHRoaXMuZ2V0TWV0YSh0aGlzLnN0YXJ0TWV0YVF1ZXJ5KCkud2l0aE9uZVN1Yih1bmRlZmluZWQsIHByZXMuc3JjKS5idWlsZCgpKTtcbiAgICAgICAgICAvLyBDcmVhdGUgYSBkdW1teSBlbnRyeSB0byBjYXRjaCBvbmxpbmUgc3RhdHVzIHVwZGF0ZS5cbiAgICAgICAgICBjb25zdCBkdW1teSA9IHRoaXMuX3Rpbm9kZS5nZXRUb3BpYyhwcmVzLnNyYyk7XG4gICAgICAgICAgZHVtbXkudG9waWMgPSBwcmVzLnNyYztcbiAgICAgICAgICBkdW1teS5vbmxpbmUgPSBmYWxzZTtcbiAgICAgICAgICBkdW1teS5hY3MgPSBhY3M7XG4gICAgICAgICAgdGhpcy5fdGlub2RlLl9kYi51cGRUb3BpYyhkdW1teSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAocHJlcy53aGF0ID09ICd0YWdzJykge1xuICAgICAgICB0aGlzLmdldE1ldGEodGhpcy5zdGFydE1ldGFRdWVyeSgpLndpdGhUYWdzKCkuYnVpbGQoKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMub25QcmVzKSB7XG4gICAgICB0aGlzLm9uUHJlcyhwcmVzKTtcbiAgICB9XG4gIH1cblxuICAvLyBDb250YWN0IGlzIHVwZGF0ZWQsIGV4ZWN1dGUgY2FsbGJhY2tzLlxuICBfcmVmcmVzaENvbnRhY3Qod2hhdCwgY29udCkge1xuICAgIGlmICh0aGlzLm9uQ29udGFjdFVwZGF0ZSkge1xuICAgICAgdGhpcy5vbkNvbnRhY3RVcGRhdGUod2hhdCwgY29udCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFB1Ymxpc2hpbmcgdG8gVG9waWNNZSBpcyBub3Qgc3VwcG9ydGVkLiB7QGxpbmsgVG9waWMjcHVibGlzaH0gaXMgb3ZlcnJpZGVuIGFuZCB0aG93cyBhbiB7RXJyb3J9IGlmIGNhbGxlZC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpY01lI1xuICAgKiBAdGhyb3dzIHtFcnJvcn0gQWx3YXlzIHRocm93cyBhbiBlcnJvci5cbiAgICovXG4gIHB1Ymxpc2goKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIlB1Ymxpc2hpbmcgdG8gJ21lJyBpcyBub3Qgc3VwcG9ydGVkXCIpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWxldGUgdmFsaWRhdGlvbiBjcmVkZW50aWFsLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljTWUjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpYyAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIGRlbGV0ZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdXNlciAtIFVzZXIgSUQgdG8gcmVtb3ZlLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIG9uIHJlY2VpdmluZyBzZXJ2ZXIgcmVwbHkuXG4gICAqL1xuICBkZWxDcmVkZW50aWFsKG1ldGhvZCwgdmFsdWUpIHtcbiAgICBpZiAoIXRoaXMuX2F0dGFjaGVkKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiQ2Fubm90IGRlbGV0ZSBjcmVkZW50aWFsIGluIGluYWN0aXZlICdtZScgdG9waWNcIikpO1xuICAgIH1cbiAgICAvLyBTZW5kIHtkZWx9IG1lc3NhZ2UsIHJldHVybiBwcm9taXNlXG4gICAgcmV0dXJuIHRoaXMuX3Rpbm9kZS5kZWxDcmVkZW50aWFsKG1ldGhvZCwgdmFsdWUpLnRoZW4oKGN0cmwpID0+IHtcbiAgICAgIC8vIFJlbW92ZSBkZWxldGVkIGNyZWRlbnRpYWwgZnJvbSB0aGUgY2FjaGUuXG4gICAgICBjb25zdCBpbmRleCA9IHRoaXMuX2NyZWRlbnRpYWxzLmZpbmRJbmRleCgoZWwpID0+IHtcbiAgICAgICAgcmV0dXJuIGVsLm1ldGggPT0gbWV0aG9kICYmIGVsLnZhbCA9PSB2YWx1ZTtcbiAgICAgIH0pO1xuICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgdGhpcy5fY3JlZGVudGlhbHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIH1cbiAgICAgIC8vIE5vdGlmeSBsaXN0ZW5lcnNcbiAgICAgIGlmICh0aGlzLm9uQ3JlZHNVcGRhdGVkKSB7XG4gICAgICAgIHRoaXMub25DcmVkc1VwZGF0ZWQodGhpcy5fY3JlZGVudGlhbHMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGN0cmw7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQGNhbGxiYWNrIGNvbnRhY3RGaWx0ZXJcbiAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRhY3QgdG8gY2hlY2sgZm9yIGluY2x1c2lvbi5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIGNvbnRhY3Qgc2hvdWxkIGJlIHByb2Nlc3NlZCwgPGNvZGU+ZmFsc2U8L2NvZGU+IHRvIGV4Y2x1ZGUgaXQuXG4gICAqL1xuICAvKipcbiAgICogSXRlcmF0ZSBvdmVyIGNhY2hlZCBjb250YWN0cy5cbiAgICpcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWNNZSNcbiAgICogQHBhcmFtIHtUb3BpY01lLkNvbnRhY3RDYWxsYmFja30gY2FsbGJhY2sgLSBDYWxsYmFjayB0byBjYWxsIGZvciBlYWNoIGNvbnRhY3QuXG4gICAqIEBwYXJhbSB7Y29udGFjdEZpbHRlcj19IGZpbHRlciAtIE9wdGlvbmFsbHkgZmlsdGVyIGNvbnRhY3RzOyBpbmNsdWRlIGFsbCBpZiBmaWx0ZXIgaXMgZmFsc2UtaXNoLCBvdGhlcndpc2VcbiAgICogICAgICBpbmNsdWRlIHRob3NlIGZvciB3aGljaCBmaWx0ZXIgcmV0dXJucyB0cnVlLWlzaC5cbiAgICogQHBhcmFtIHtPYmplY3Q9fSBjb250ZXh0IC0gQ29udGV4dCB0byB1c2UgZm9yIGNhbGxpbmcgdGhlIGBjYWxsYmFja2AsIGkuZS4gdGhlIHZhbHVlIG9mIGB0aGlzYCBpbnNpZGUgdGhlIGNhbGxiYWNrLlxuICAgKi9cbiAgY29udGFjdHMoY2FsbGJhY2ssIGZpbHRlciwgY29udGV4dCkge1xuICAgIHRoaXMuX3Rpbm9kZS5tYXBUb3BpY3MoKGMsIGlkeCkgPT4ge1xuICAgICAgaWYgKGMuaXNDb21tVHlwZSgpICYmICghZmlsdGVyIHx8IGZpbHRlcihjKSkpIHtcbiAgICAgICAgY2FsbGJhY2suY2FsbChjb250ZXh0LCBjLCBpZHgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhIGNvbnRhY3QgZnJvbSBjYWNoZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpY01lI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIGNvbnRhY3QgdG8gZ2V0LCBlaXRoZXIgYSBVSUQgKGZvciBwMnAgdG9waWNzKSBvciBhIHRvcGljIG5hbWUuXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuQ29udGFjdH0gLSBDb250YWN0IG9yIGB1bmRlZmluZWRgLlxuICAgKi9cbiAgZ2V0Q29udGFjdChuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuX3Rpbm9kZS5jYWNoZUdldFRvcGljKG5hbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhY2Nlc3MgbW9kZSBvZiBhIGdpdmVuIGNvbnRhY3QgZnJvbSBjYWNoZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpY01lI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIGNvbnRhY3QgdG8gZ2V0IGFjY2VzcyBtb2RlIGZvciwgZWl0aGVyIGEgVUlEIChmb3IgcDJwIHRvcGljcylcbiAgICogICAgICAgIG9yIGEgdG9waWMgbmFtZTsgaWYgbWlzc2luZywgYWNjZXNzIG1vZGUgZm9yIHRoZSAnbWUnIHRvcGljIGl0c2VsZi5cbiAgICogQHJldHVybnMge3N0cmluZ30gLSBhY2Nlc3MgbW9kZSwgc3VjaCBhcyBgUldQYC5cbiAgICovXG4gIGdldEFjY2Vzc01vZGUobmFtZSkge1xuICAgIGlmIChuYW1lKSB7XG4gICAgICBjb25zdCBjb250ID0gdGhpcy5fdGlub2RlLmNhY2hlR2V0VG9waWMobmFtZSk7XG4gICAgICByZXR1cm4gY29udCA/IGNvbnQuYWNzIDogbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuYWNzO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGNvbnRhY3QgaXMgYXJjaGl2ZWQsIGkuZS4gY29udGFjdC5wcml2YXRlLmFyY2ggPT0gdHJ1ZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpY01lI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIGNvbnRhY3QgdG8gY2hlY2sgYXJjaGl2ZWQgc3RhdHVzLCBlaXRoZXIgYSBVSUQgKGZvciBwMnAgdG9waWNzKSBvciBhIHRvcGljIG5hbWUuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIHRydWUgaWYgY29udGFjdCBpcyBhcmNoaXZlZCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgKi9cbiAgaXNBcmNoaXZlZChuYW1lKSB7XG4gICAgY29uc3QgY29udCA9IHRoaXMuX3Rpbm9kZS5jYWNoZUdldFRvcGljKG5hbWUpO1xuICAgIHJldHVybiBjb250ICYmIGNvbnQucHJpdmF0ZSAmJiAhIWNvbnQucHJpdmF0ZS5hcmNoO1xuICB9XG5cbiAgLyoqXG4gICAqIEB0eXBlZGVmIFRpbm9kZS5DcmVkZW50aWFsXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQHR5cGUgT2JqZWN0XG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBtZXRoIC0gdmFsaWRhdGlvbiBtZXRob2Qgc3VjaCBhcyAnZW1haWwnIG9yICd0ZWwnLlxuICAgKiBAcHJvcGVydHkge3N0cmluZ30gdmFsIC0gY3JlZGVudGlhbCB2YWx1ZSwgaS5lLiAnamRvZUBleGFtcGxlLmNvbScgb3IgJysxNzAyNTU1MTIzNCdcbiAgICogQHByb3BlcnR5IHtib29sZWFufSBkb25lIC0gdHJ1ZSBpZiBjcmVkZW50aWFsIGlzIHZhbGlkYXRlZC5cbiAgICovXG4gIC8qKlxuICAgKiBHZXQgdGhlIHVzZXIncyBjcmVkZW50aWFsczogZW1haWwsIHBob25lLCBldGMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWNNZSNcbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5DcmVkZW50aWFsW119IC0gYXJyYXkgb2YgY3JlZGVudGlhbHMuXG4gICAqL1xuICBnZXRDcmVkZW50aWFscygpIHtcbiAgICByZXR1cm4gdGhpcy5fY3JlZGVudGlhbHM7XG4gIH1cbn1cblxuLyoqXG4gKiBAY2xhc3MgVG9waWNGbmQgLSBzcGVjaWFsIGNhc2Ugb2Yge0BsaW5rIFRpbm9kZS5Ub3BpY30gZm9yIHNlYXJjaGluZyBmb3JcbiAqIGNvbnRhY3RzIGFuZCBncm91cCB0b3BpY3MuXG4gKiBAZXh0ZW5kcyBUaW5vZGUuVG9waWNcbiAqIEBtZW1iZXJvZiBUaW5vZGVcbiAqXG4gKiBAcGFyYW0ge1RvcGljRm5kLkNhbGxiYWNrc30gY2FsbGJhY2tzIC0gQ2FsbGJhY2tzIHRvIHJlY2VpdmUgdmFyaW91cyBldmVudHMuXG4gKi9cbmV4cG9ydCBjbGFzcyBUb3BpY0ZuZCBleHRlbmRzIFRvcGljIHtcbiAgLy8gTGlzdCBvZiB1c2VycyBhbmQgdG9waWNzIHVpZCBvciB0b3BpY19uYW1lIC0+IENvbnRhY3Qgb2JqZWN0KVxuICBfY29udGFjdHMgPSB7fTtcblxuICBjb25zdHJ1Y3RvcihjYWxsYmFja3MpIHtcbiAgICBzdXBlcihDb25zdC5UT1BJQ19GTkQsIGNhbGxiYWNrcyk7XG4gIH1cblxuICAvLyBPdmVycmlkZSB0aGUgb3JpZ2luYWwgVG9waWMuX3Byb2Nlc3NNZXRhU3ViXG4gIF9wcm9jZXNzTWV0YVN1YihzdWJzKSB7XG4gICAgbGV0IHVwZGF0ZUNvdW50ID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGhpcy5fY29udGFjdHMpLmxlbmd0aDtcbiAgICAvLyBSZXNldCBjb250YWN0IGxpc3QuXG4gICAgdGhpcy5fY29udGFjdHMgPSB7fTtcbiAgICBmb3IgKGxldCBpZHggaW4gc3Vicykge1xuICAgICAgbGV0IHN1YiA9IHN1YnNbaWR4XTtcbiAgICAgIGNvbnN0IGluZGV4QnkgPSBzdWIudG9waWMgPyBzdWIudG9waWMgOiBzdWIudXNlcjtcblxuICAgICAgc3ViID0gbWVyZ2VUb0NhY2hlKHRoaXMuX2NvbnRhY3RzLCBpbmRleEJ5LCBzdWIpO1xuICAgICAgdXBkYXRlQ291bnQrKztcblxuICAgICAgaWYgKHRoaXMub25NZXRhU3ViKSB7XG4gICAgICAgIHRoaXMub25NZXRhU3ViKHN1Yik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHVwZGF0ZUNvdW50ID4gMCAmJiB0aGlzLm9uU3Vic1VwZGF0ZWQpIHtcbiAgICAgIHRoaXMub25TdWJzVXBkYXRlZChPYmplY3Qua2V5cyh0aGlzLl9jb250YWN0cykpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBQdWJsaXNoaW5nIHRvIFRvcGljRm5kIGlzIG5vdCBzdXBwb3J0ZWQuIHtAbGluayBUb3BpYyNwdWJsaXNofSBpcyBvdmVycmlkZW4gYW5kIHRob3dzIGFuIHtFcnJvcn0gaWYgY2FsbGVkLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljRm5kI1xuICAgKiBAdGhyb3dzIHtFcnJvcn0gQWx3YXlzIHRocm93cyBhbiBlcnJvci5cbiAgICovXG4gIHB1Ymxpc2goKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIlB1Ymxpc2hpbmcgdG8gJ2ZuZCcgaXMgbm90IHN1cHBvcnRlZFwiKSk7XG4gIH1cblxuICAvKipcbiAgICogc2V0TWV0YSB0byBUb3BpY0ZuZCByZXNldHMgY29udGFjdCBsaXN0IGluIGFkZGl0aW9uIHRvIHNlbmRpbmcgdGhlIG1lc3NhZ2UuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWNGbmQjXG4gICAqIEBwYXJhbSB7VGlub2RlLlNldFBhcmFtc30gcGFyYW1zIHBhcmFtZXRlcnMgdG8gdXBkYXRlLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBzZXJ2ZXIgcmVzcG9uZHMgdG8gcmVxdWVzdC5cbiAgICovXG4gIHNldE1ldGEocGFyYW1zKSB7XG4gICAgcmV0dXJuIE9iamVjdC5nZXRQcm90b3R5cGVPZihUb3BpY0ZuZC5wcm90b3R5cGUpLnNldE1ldGEuY2FsbCh0aGlzLCBwYXJhbXMpLnRoZW4oKCkgPT4ge1xuICAgICAgaWYgKE9iamVjdC5rZXlzKHRoaXMuX2NvbnRhY3RzKS5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRoaXMuX2NvbnRhY3RzID0ge307XG4gICAgICAgIGlmICh0aGlzLm9uU3Vic1VwZGF0ZWQpIHtcbiAgICAgICAgICB0aGlzLm9uU3Vic1VwZGF0ZWQoW10pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogSXRlcmF0ZSBvdmVyIGZvdW5kIGNvbnRhY3RzLiBJZiBjYWxsYmFjayBpcyB1bmRlZmluZWQsIHVzZSB7QGxpbmsgdGhpcy5vbk1ldGFTdWJ9LlxuICAgKiBAZnVuY3Rpb25cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpY0ZuZCNcbiAgICogQHBhcmFtIHtUb3BpY0ZuZC5Db250YWN0Q2FsbGJhY2t9IGNhbGxiYWNrIC0gQ2FsbGJhY2sgdG8gY2FsbCBmb3IgZWFjaCBjb250YWN0LlxuICAgKiBAcGFyYW0ge09iamVjdH0gY29udGV4dCAtIENvbnRleHQgdG8gdXNlIGZvciBjYWxsaW5nIHRoZSBgY2FsbGJhY2tgLCBpLmUuIHRoZSB2YWx1ZSBvZiBgdGhpc2AgaW5zaWRlIHRoZSBjYWxsYmFjay5cbiAgICovXG4gIGNvbnRhY3RzKGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgY29uc3QgY2IgPSAoY2FsbGJhY2sgfHwgdGhpcy5vbk1ldGFTdWIpO1xuICAgIGlmIChjYikge1xuICAgICAgZm9yIChsZXQgaWR4IGluIHRoaXMuX2NvbnRhY3RzKSB7XG4gICAgICAgIGNiLmNhbGwoY29udGV4dCwgdGhpcy5fY29udGFjdHNbaWR4XSwgaWR4LCB0aGlzLl9jb250YWN0cyk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iLCIvKipcbiAqIEBmaWxlIFV0aWxpdGllcyB1c2VkIGluIG11bHRpcGxlIHBsYWNlcy5cbiAqXG4gKiBAY29weXJpZ2h0IDIwMTUtMjAyMiBUaW5vZGUgTExDLlxuICovXG4ndXNlIHN0cmljdCc7XG5cbmltcG9ydCBBY2Nlc3NNb2RlIGZyb20gJy4vYWNjZXNzLW1vZGUuanMnO1xuaW1wb3J0IERFTF9DSEFSIGZyb20gJy4vY29uZmlnLmpzJztcblxuLy8gQXR0ZW1wdCB0byBjb252ZXJ0IGRhdGUgYW5kIEFjY2Vzc01vZGUgc3RyaW5ncyB0byBvYmplY3RzLlxuZXhwb3J0IGZ1bmN0aW9uIGpzb25QYXJzZUhlbHBlcihrZXksIHZhbCkge1xuICAvLyBUcnkgdG8gY29udmVydCBzdHJpbmcgdGltZXN0YW1wcyB3aXRoIG9wdGlvbmFsIG1pbGxpc2Vjb25kcyB0byBEYXRlLFxuICAvLyBlLmcuIDIwMTUtMDktMDJUMDE6NDU6NDNbLjEyM11aXG4gIGlmICh0eXBlb2YgdmFsID09ICdzdHJpbmcnICYmIHZhbC5sZW5ndGggPj0gMjAgJiYgdmFsLmxlbmd0aCA8PSAyNCAmJiBbJ3RzJywgJ3RvdWNoZWQnLCAndXBkYXRlZCcsICdjcmVhdGVkJywgJ3doZW4nLCAnZGVsZXRlZCcsICdleHBpcmVzJ10uaW5jbHVkZXMoa2V5KSkge1xuXG4gICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKHZhbCk7XG4gICAgaWYgKCFpc05hTihkYXRlKSkge1xuICAgICAgcmV0dXJuIGRhdGU7XG4gICAgfVxuICB9IGVsc2UgaWYgKGtleSA9PT0gJ2FjcycgJiYgdHlwZW9mIHZhbCA9PT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gbmV3IEFjY2Vzc01vZGUodmFsKTtcbiAgfVxuICByZXR1cm4gdmFsO1xufVxuXG4vLyBDaGVja3MgaWYgVVJMIGlzIGEgcmVsYXRpdmUgdXJsLCBpLmUuIGhhcyBubyAnc2NoZW1lOi8vJywgaW5jbHVkaW5nIHRoZSBjYXNlIG9mIG1pc3Npbmcgc2NoZW1lICcvLycuXG4vLyBUaGUgc2NoZW1lIGlzIGV4cGVjdGVkIHRvIGJlIFJGQy1jb21wbGlhbnQsIGUuZy4gW2Etel1bYS16MC05Ky4tXSpcbi8vIGV4YW1wbGUuaHRtbCAtIG9rXG4vLyBodHRwczpleGFtcGxlLmNvbSAtIG5vdCBvay5cbi8vIGh0dHA6L2V4YW1wbGUuY29tIC0gbm90IG9rLlxuLy8gJyDihrIgaHR0cHM6Ly9leGFtcGxlLmNvbScgLSBub3Qgb2suICjihrIgbWVhbnMgY2FycmlhZ2UgcmV0dXJuKVxuZXhwb3J0IGZ1bmN0aW9uIGlzVXJsUmVsYXRpdmUodXJsKSB7XG4gIHJldHVybiB1cmwgJiYgIS9eXFxzKihbYS16XVthLXowLTkrLi1dKjp8XFwvXFwvKS9pbS50ZXN0KHVybCk7XG59XG5cbmZ1bmN0aW9uIGlzVmFsaWREYXRlKGQpIHtcbiAgcmV0dXJuIChkIGluc3RhbmNlb2YgRGF0ZSkgJiYgIWlzTmFOKGQpICYmIChkLmdldFRpbWUoKSAhPSAwKTtcbn1cblxuLy8gUkZDMzMzOSBmb3JtYXRlciBvZiBEYXRlXG5leHBvcnQgZnVuY3Rpb24gcmZjMzMzOURhdGVTdHJpbmcoZCkge1xuICBpZiAoIWlzVmFsaWREYXRlKGQpKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIGNvbnN0IHBhZCA9IGZ1bmN0aW9uKHZhbCwgc3ApIHtcbiAgICBzcCA9IHNwIHx8IDI7XG4gICAgcmV0dXJuICcwJy5yZXBlYXQoc3AgLSAoJycgKyB2YWwpLmxlbmd0aCkgKyB2YWw7XG4gIH07XG5cbiAgY29uc3QgbWlsbGlzID0gZC5nZXRVVENNaWxsaXNlY29uZHMoKTtcbiAgcmV0dXJuIGQuZ2V0VVRDRnVsbFllYXIoKSArICctJyArIHBhZChkLmdldFVUQ01vbnRoKCkgKyAxKSArICctJyArIHBhZChkLmdldFVUQ0RhdGUoKSkgK1xuICAgICdUJyArIHBhZChkLmdldFVUQ0hvdXJzKCkpICsgJzonICsgcGFkKGQuZ2V0VVRDTWludXRlcygpKSArICc6JyArIHBhZChkLmdldFVUQ1NlY29uZHMoKSkgK1xuICAgIChtaWxsaXMgPyAnLicgKyBwYWQobWlsbGlzLCAzKSA6ICcnKSArICdaJztcbn1cblxuLy8gUmVjdXJzaXZlbHkgbWVyZ2Ugc3JjJ3Mgb3duIHByb3BlcnRpZXMgdG8gZHN0LlxuLy8gSWdub3JlIHByb3BlcnRpZXMgd2hlcmUgaWdub3JlW3Byb3BlcnR5XSBpcyB0cnVlLlxuLy8gQXJyYXkgYW5kIERhdGUgb2JqZWN0cyBhcmUgc2hhbGxvdy1jb3BpZWQuXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VPYmooZHN0LCBzcmMsIGlnbm9yZSkge1xuICBpZiAodHlwZW9mIHNyYyAhPSAnb2JqZWN0Jykge1xuICAgIGlmIChzcmMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIGRzdDtcbiAgICB9XG4gICAgaWYgKHNyYyA9PT0gREVMX0NIQVIpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHJldHVybiBzcmM7XG4gIH1cbiAgLy8gSlMgaXMgY3Jhenk6IHR5cGVvZiBudWxsIGlzICdvYmplY3QnLlxuICBpZiAoc3JjID09PSBudWxsKSB7XG4gICAgcmV0dXJuIHNyYztcbiAgfVxuXG4gIC8vIEhhbmRsZSBEYXRlXG4gIGlmIChzcmMgaW5zdGFuY2VvZiBEYXRlICYmICFpc05hTihzcmMpKSB7XG4gICAgcmV0dXJuICghZHN0IHx8ICEoZHN0IGluc3RhbmNlb2YgRGF0ZSkgfHwgaXNOYU4oZHN0KSB8fCBkc3QgPCBzcmMpID8gc3JjIDogZHN0O1xuICB9XG5cbiAgLy8gQWNjZXNzIG1vZGVcbiAgaWYgKHNyYyBpbnN0YW5jZW9mIEFjY2Vzc01vZGUpIHtcbiAgICByZXR1cm4gbmV3IEFjY2Vzc01vZGUoc3JjKTtcbiAgfVxuXG4gIC8vIEhhbmRsZSBBcnJheVxuICBpZiAoc3JjIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICByZXR1cm4gc3JjO1xuICB9XG5cbiAgaWYgKCFkc3QgfHwgZHN0ID09PSBERUxfQ0hBUikge1xuICAgIGRzdCA9IHNyYy5jb25zdHJ1Y3RvcigpO1xuICB9XG5cbiAgZm9yIChsZXQgcHJvcCBpbiBzcmMpIHtcbiAgICBpZiAoc3JjLmhhc093blByb3BlcnR5KHByb3ApICYmICghaWdub3JlIHx8ICFpZ25vcmVbcHJvcF0pICYmIChwcm9wICE9ICdfbm9Gb3J3YXJkaW5nJykpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGRzdFtwcm9wXSA9IG1lcmdlT2JqKGRzdFtwcm9wXSwgc3JjW3Byb3BdKTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAvLyBGSVhNRTogcHJvYmFibHkgbmVlZCB0byBsb2cgc29tZXRoaW5nIGhlcmUuXG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBkc3Q7XG59XG5cbi8vIFVwZGF0ZSBvYmplY3Qgc3RvcmVkIGluIGEgY2FjaGUuIFJldHVybnMgdXBkYXRlZCB2YWx1ZS5cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZVRvQ2FjaGUoY2FjaGUsIGtleSwgbmV3dmFsLCBpZ25vcmUpIHtcbiAgY2FjaGVba2V5XSA9IG1lcmdlT2JqKGNhY2hlW2tleV0sIG5ld3ZhbCwgaWdub3JlKTtcbiAgcmV0dXJuIGNhY2hlW2tleV07XG59XG5cbi8vIFN0cmlwcyBhbGwgdmFsdWVzIGZyb20gYW4gb2JqZWN0IG9mIHRoZXkgZXZhbHVhdGUgdG8gZmFsc2Ugb3IgaWYgdGhlaXIgbmFtZSBzdGFydHMgd2l0aCAnXycuXG4vLyBVc2VkIG9uIGFsbCBvdXRnb2luZyBvYmplY3QgYmVmb3JlIHNlcmlhbGl6YXRpb24gdG8gc3RyaW5nLlxuZXhwb3J0IGZ1bmN0aW9uIHNpbXBsaWZ5KG9iaikge1xuICBPYmplY3Qua2V5cyhvYmopLmZvckVhY2goKGtleSkgPT4ge1xuICAgIGlmIChrZXlbMF0gPT0gJ18nKSB7XG4gICAgICAvLyBTdHJpcCBmaWVsZHMgbGlrZSBcIm9iai5fa2V5XCIuXG4gICAgICBkZWxldGUgb2JqW2tleV07XG4gICAgfSBlbHNlIGlmICghb2JqW2tleV0pIHtcbiAgICAgIC8vIFN0cmlwIGZpZWxkcyB3aGljaCBldmFsdWF0ZSB0byBmYWxzZS5cbiAgICAgIGRlbGV0ZSBvYmpba2V5XTtcbiAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkob2JqW2tleV0pICYmIG9ialtrZXldLmxlbmd0aCA9PSAwKSB7XG4gICAgICAvLyBTdHJpcCBlbXB0eSBhcnJheXMuXG4gICAgICBkZWxldGUgb2JqW2tleV07XG4gICAgfSBlbHNlIGlmICghb2JqW2tleV0pIHtcbiAgICAgIC8vIFN0cmlwIGZpZWxkcyB3aGljaCBldmFsdWF0ZSB0byBmYWxzZS5cbiAgICAgIGRlbGV0ZSBvYmpba2V5XTtcbiAgICB9IGVsc2UgaWYgKG9ialtrZXldIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgLy8gU3RyaXAgaW52YWxpZCBvciB6ZXJvIGRhdGUuXG4gICAgICBpZiAoIWlzVmFsaWREYXRlKG9ialtrZXldKSkge1xuICAgICAgICBkZWxldGUgb2JqW2tleV07XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0eXBlb2Ygb2JqW2tleV0gPT0gJ29iamVjdCcpIHtcbiAgICAgIHNpbXBsaWZ5KG9ialtrZXldKTtcbiAgICAgIC8vIFN0cmlwIGVtcHR5IG9iamVjdHMuXG4gICAgICBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMob2JqW2tleV0pLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgIGRlbGV0ZSBvYmpba2V5XTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gb2JqO1xufTtcblxuXG4vLyBUcmltIHdoaXRlc3BhY2UsIHN0cmlwIGVtcHR5IGFuZCBkdXBsaWNhdGUgZWxlbWVudHMgZWxlbWVudHMuXG4vLyBJZiB0aGUgcmVzdWx0IGlzIGFuIGVtcHR5IGFycmF5LCBhZGQgYSBzaW5nbGUgZWxlbWVudCBcIlxcdTI0MjFcIiAoVW5pY29kZSBEZWwgY2hhcmFjdGVyKS5cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVBcnJheShhcnIpIHtcbiAgbGV0IG91dCA9IFtdO1xuICBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSB7XG4gICAgLy8gVHJpbSwgdGhyb3cgYXdheSB2ZXJ5IHNob3J0IGFuZCBlbXB0eSB0YWdzLlxuICAgIGZvciAobGV0IGkgPSAwLCBsID0gYXJyLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgbGV0IHQgPSBhcnJbaV07XG4gICAgICBpZiAodCkge1xuICAgICAgICB0ID0gdC50cmltKCkudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgaWYgKHQubGVuZ3RoID4gMSkge1xuICAgICAgICAgIG91dC5wdXNoKHQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIG91dC5zb3J0KCkuZmlsdGVyKGZ1bmN0aW9uKGl0ZW0sIHBvcywgYXJ5KSB7XG4gICAgICByZXR1cm4gIXBvcyB8fCBpdGVtICE9IGFyeVtwb3MgLSAxXTtcbiAgICB9KTtcbiAgfVxuICBpZiAob3V0Lmxlbmd0aCA9PSAwKSB7XG4gICAgLy8gQWRkIHNpbmdsZSB0YWcgd2l0aCBhIFVuaWNvZGUgRGVsIGNoYXJhY3Rlciwgb3RoZXJ3aXNlIGFuIGFtcHR5IGFycmF5XG4gICAgLy8gaXMgYW1iaWd1b3MuIFRoZSBEZWwgdGFnIHdpbGwgYmUgc3RyaXBwZWQgYnkgdGhlIHNlcnZlci5cbiAgICBvdXQucHVzaChERUxfQ0hBUik7XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cbiIsIm1vZHVsZS5leHBvcnRzPXtcInZlcnNpb25cIjogXCIwLjIwLjAtYmV0YTJcIn1cbiJdfQ==

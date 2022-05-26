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

  oobNotification(data) {
    switch (data.what) {
      case 'msg':
        const topic = _classPrivateMethodGet(this, _cacheGet, _cacheGet2).call(this, 'topic', data.topic);

        if (topic && topic.isChan()) {
          topic._updateReceived(data.seq, 'fake-uid');

          this.getMeTopic()._refreshContact('msg', topic);
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
    this._messageVersions = {};
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

  videoCall(evt, seq, payload) {
    if (!this._attached && !['ringing', 'hang-up'].includes(evt)) {
      return;
    }

    return this._tinode.videoCall(this.name, seq, evt, payload);
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
    }

    if (data.seq < this._minSeq || this._minSeq == 0) {
      this._minSeq = data.seq;
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
module.exports={"version": "0.20.0-alpha1"}

},{}]},{},[9])(9)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYWNjZXNzLW1vZGUuanMiLCJzcmMvY2J1ZmZlci5qcyIsInNyYy9jb25maWcuanMiLCJzcmMvY29ubmVjdGlvbi5qcyIsInNyYy9kYi5qcyIsInNyYy9kcmFmdHkuanMiLCJzcmMvbGFyZ2UtZmlsZS5qcyIsInNyYy9tZXRhLWJ1aWxkZXIuanMiLCJzcmMvdGlub2RlLmpzIiwic3JjL3RvcGljLmpzIiwic3JjL3V0aWxzLmpzIiwidmVyc2lvbi5qc29uIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDS0E7Ozs7Ozs7Ozs7O0FBY2UsTUFBTSxVQUFOLENBQWlCO0VBQzlCLFdBQVcsQ0FBQyxHQUFELEVBQU07SUFDZixJQUFJLEdBQUosRUFBUztNQUNQLEtBQUssS0FBTCxHQUFhLE9BQU8sR0FBRyxDQUFDLEtBQVgsSUFBb0IsUUFBcEIsR0FBK0IsR0FBRyxDQUFDLEtBQW5DLEdBQTJDLFVBQVUsQ0FBQyxNQUFYLENBQWtCLEdBQUcsQ0FBQyxLQUF0QixDQUF4RDtNQUNBLEtBQUssSUFBTCxHQUFZLE9BQU8sR0FBRyxDQUFDLElBQVgsSUFBbUIsUUFBbkIsR0FBOEIsR0FBRyxDQUFDLElBQWxDLEdBQXlDLFVBQVUsQ0FBQyxNQUFYLENBQWtCLEdBQUcsQ0FBQyxJQUF0QixDQUFyRDtNQUNBLEtBQUssSUFBTCxHQUFZLEdBQUcsQ0FBQyxJQUFKLEdBQVksT0FBTyxHQUFHLENBQUMsSUFBWCxJQUFtQixRQUFuQixHQUE4QixHQUFHLENBQUMsSUFBbEMsR0FBeUMsVUFBVSxDQUFDLE1BQVgsQ0FBa0IsR0FBRyxDQUFDLElBQXRCLENBQXJELEdBQ1QsS0FBSyxLQUFMLEdBQWEsS0FBSyxJQURyQjtJQUVEO0VBQ0Y7O0VBaUJZLE9BQU4sTUFBTSxDQUFDLEdBQUQsRUFBTTtJQUNqQixJQUFJLENBQUMsR0FBTCxFQUFVO01BQ1IsT0FBTyxJQUFQO0lBQ0QsQ0FGRCxNQUVPLElB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QUNGLElBQUksRUFBRSxRQURKO0lBRUYsTUFBTSxFQUFFO0VBRk4sQ0FMWTtFQVNoQixFQUFFLEVBQUU7SUFDRixJQUFJLEVBQUUsSUFESjtJQUVGLE1BQU0sRUFBRTtFQUZOLENBVFk7RUFhaEIsRUFBRSxFQUFFO0lBQ0YsSUFBSSxFQUFFLElBREo7SUFFRixNQUFNLEVBQUU7RUFGTixDQWJZO0VBaUJoQixFQUFFLEVBQUU7SUFDRixJQUFJLEVBQUUsS0FESjtJQUVGLE1BQU0sRUFBRTtFQUZOLENBakJZO0VBcUJoQixFQUFFLEVBQUU7SUFDRixJQUFJLEVBQUUsR0FESjtJQUVGLE1BQU0sRUFBRTtFQUZOLENBckJZO0VBeUJoQixFQUFFLEVBQUU7SUFDRixJQUFJLEVBQUUsRUFESjtJQUVGLE1BQU0sRUFBRTtFQUZOLENBekJZO0VBNkJoQixFQUFFLEVBQUU7SUFDRixJQUFJLEVBQUUsS0FESjtJQUVGLE1BQU0sRUFBRTtFQUZOLENBN0JZO0VBaUNoQixFQUFFLEVBQUU7SUFDRixJQUFJLEVBQUUsRUFESjtJQUVGLE1BQU0sRUFBRTtFQUZOLENBakNZO0VBcUNoQixFQUFFLEVBQUU7SUFDRixJQUFJLEVBQUUsTUFESjtJQUVGLE1BQU0sRUFBRTtFQUZOLENBckNZO0VBeUNoQixFQUFFLEVBQUU7SUFDRixJQUFJLEVBQUUsR0FESjtJQUVGLE1BQU0sRUFBRTtFQUZOLENBekNZO0VBNkNoQixFQUFFLEVBQUU7SUFDRixJQUFJLEVBQUUsS0FESjtJQUVGLE1BQU0sRUFBRTtFQUZOLENBN0NZO0VBaURoQixFQUFFLEVBQUU7SUFDRixJQUFJLEVBQUUsR0FESjtJQUVGLE1BQU0sRUFBRTtFQUZOLENBakRZO0VBcURoQixFQUFFLEVBQUU7SUFDRixJQUFJLEVBQUUsR0FESjtJQUVGLE1BQU0sRUFBRTtFQUZOLENBckRZO0VBeURoQixFQUFFLEVBQUU7SUFDRixJQUFJLEVBQUUsS0FESjtJQUVGLE1BQU0sRUFBRTtFQUZOLENBekRZO0VBNkRoQixFQUFFLEVBQUU7SUFDRixJQUFJLEVBQUUsS0FESjtJQUVG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QUNGOztJQUNELEdBQUcsQ0FBQyxJQUFKLEdBQVcsTUFBWCxDQUFrQixVQUFTLElBQVQsRUFBZSxHQUFmLEVBQW9CLEdBQXBCLEVBQXlCO01BQ3pDLE9BQU8sQ0FBQyxHQUFELElBQVEsSUFBSSxJQUFJLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBUCxDQUExQjtJQUNELENBRkQ7RUFHRDs7RUFDRCxJQUFJLEdBQUcsQ0FBQyxNQUFKLElBQWMsQ0FBbEIsRUFBcUI7SUFHbkIsR0FBRyxDQUFDLElBQUosQ0FBUyxlQUFUO0VBQ0Q7O0VBQ0QsT0FBTyxHQUFQO0FBQ0Q7OztBQzFLRDtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLyoqXG4gKiBAZmlsZSBBY2Nlc3MgY29udHJvbCBtb2RlbC5cbiAqXG4gKiBAY29weXJpZ2h0IDIwMTUtMjAyMiBUaW5vZGUgTExDLlxuICovXG4ndXNlIHN0cmljdCc7XG5cbi8vIE5PVEUgVE8gREVWRUxPUEVSUzpcbi8vIExvY2FsaXphYmxlIHN0cmluZ3Mgc2hvdWxkIGJlIGRvdWJsZSBxdW90ZWQgXCLRgdGC0YDQvtC60LAg0L3QsCDQtNGA0YPQs9C+0Lwg0Y/Qt9GL0LrQtVwiLFxuLy8gbm9uLWxvY2FsaXphYmxlIHN0cmluZ3Mgc2hvdWxkIGJlIHNpbmdsZSBxdW90ZWQgJ25vbi1sb2NhbGl6ZWQnLlxuXG4vKipcbiAqIEhlbHBlciBjbGFzcyBmb3IgaGFuZGxpbmcgYWNjZXNzIG1vZGUuXG4gKlxuICogQGNsYXNzIEFjY2Vzc01vZGVcbiAqIEBtZW1iZXJvZiBUaW5vZGVcbiAqXG4gKiBAcGFyYW0ge0FjY2Vzc01vZGV8T2JqZWN0PX0gYWNzIC0gQWNjZXNzTW9kZSB0byBjb3B5IG9yIGFjY2VzcyBtb2RlIG9iamVjdCByZWNlaXZlZCBmcm9tIHRoZSBzZXJ2ZXIuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFjY2Vzc01vZGUge1xuICBjb25zdHJ1Y3RvcihhY3MpIHtcbiAgICBpZiAoYWNzKSB7XG4gICAgICB0aGlzLmdpdmVuID0gdHlwZW9mIGFjcy5naXZlbiA9PSAnbnVtYmVyJyA/IGFjcy5naXZlbiA6IEFjY2Vzc01vZGUuZGVjb2RlKGFjcy5naXZlbik7XG4gICAgICB0aGlzLndhbnQgPSB0eXBlb2YgYWNzLndhbnQgPT0gJ251bWJlcicgPyBhY3Mud2FudCA6IEFjY2Vzc01vZGUuZGVjb2RlKGFjcy53YW50KTtcbiAgICAgIHRoaXMubW9kZSA9IGFjcy5tb2RlID8gKHR5cGVvZiBhY3MubW9kZSA9PSAnbnVtYmVyJyA/IGFjcy5tb2RlIDogQWNjZXNzTW9kZS5kZWNvZGUoYWNzLm1vZGUpKSA6XG4gICAgICAgICh0aGlzLmdpdmVuICYgdGhpcy53YW50KTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgI2NoZWNrRmxhZyh2YWwsIHNpZGUsIGZsYWcpIHtcbiAgICBzaWRlID0gc2lkZSB8fCAnbW9kZSc7XG4gICAgaWYgKFsnZ2l2ZW4nLCAnd2FudCcsICdtb2RlJ10uaW5jbHVkZXMoc2lkZSkpIHtcbiAgICAgIHJldHVybiAoKHZhbFtzaWRlXSAmIGZsYWcpICE9IDApO1xuICAgIH1cbiAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgQWNjZXNzTW9kZSBjb21wb25lbnQgJyR7c2lkZX0nYCk7XG4gIH1cbiAgLyoqXG4gICAqIFBhcnNlIHN0cmluZyBpbnRvIGFuIGFjY2VzcyBtb2RlIHZhbHVlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZyB8IE51bWJlcn0gbW9kZSAtIGVpdGhlciBhIFN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgYWNjZXNzIG1vZGUgdG8gcGFyc2Ugb3IgYSBzZXQgb2YgYml0cyB0byBhc3NpZ24uXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IC0gQWNjZXNzIG1vZGUgYXMgYSBudW1lcmljIHZhbHVlLlxuICAgKi9cbiAgc3RhdGljIGRlY29kZShzdHIpIHtcbiAgICBpZiAoIXN0cikge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSBlbHNlIGlmICh0eXBlb2Ygc3RyID09ICdudW1iZXInKSB7XG4gICAgICByZXR1cm4gc3RyICYgQWNjZXNzTW9kZS5fQklUTUFTSztcbiAgICB9IGVsc2UgaWYgKHN0ciA9PT0gJ04nIHx8IHN0ciA9PT0gJ24nKSB7XG4gICAgICByZXR1cm4gQWNjZXNzTW9kZS5fTk9ORTtcbiAgICB9XG5cbiAgICBjb25zdCBiaXRtYXNrID0ge1xuICAgICAgJ0onOiBBY2Nlc3NNb2RlLl9KT0lOLFxuICAgICAgJ1InOiBBY2Nlc3NNb2RlLl9SRUFELFxuICAgICAgJ1cnOiBBY2Nlc3NNb2RlLl9XUklURSxcbiAgICAgICdQJzogQWNjZXNzTW9kZS5fUFJFUyxcbiAgICAgICdBJzogQWNjZXNzTW9kZS5fQVBQUk9WRSxcbiAgICAgICdTJzogQWNjZXNzTW9kZS5fU0hBUkUsXG4gICAgICAnRCc6IEFjY2Vzc01vZGUuX0RFTEVURSxcbiAgICAgICdPJzogQWNjZXNzTW9kZS5fT1dORVJcbiAgICB9O1xuXG4gICAgbGV0IG0wID0gQWNjZXNzTW9kZS5fTk9ORTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBiaXQgPSBiaXRtYXNrW3N0ci5jaGFyQXQoaSkudG9VcHBlckNhc2UoKV07XG4gICAgICBpZiAoIWJpdCkge1xuICAgICAgICAvLyBVbnJlY29nbml6ZWQgYml0LCBza2lwLlxuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIG0wIHw9IGJpdDtcbiAgICB9XG4gICAgcmV0dXJuIG0wO1xuICB9XG4gIC8qKlxuICAgKiBDb252ZXJ0IG51bWVyaWMgcmVwcmVzZW50YXRpb24gb2YgdGhlIGFjY2VzcyBtb2RlIGludG8gYSBzdHJpbmcuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB2YWwgLSBhY2Nlc3MgbW9kZSB2YWx1ZSB0byBjb252ZXJ0IHRvIGEgc3RyaW5nLlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSAtIEFjY2VzcyBtb2RlIGFzIGEgc3RyaW5nLlxuICAgKi9cbiAgc3RhdGljIGVuY29kZSh2YWwpIHtcbiAgICBpZiAodmFsID09PSBudWxsIHx8IHZhbCA9PT0gQWNjZXNzTW9kZS5fSU5WQUxJRCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSBlbHNlIGlmICh2YWwgPT09IEFjY2Vzc01vZGUuX05PTkUpIHtcbiAgICAgIHJldHVybiAnTic7XG4gICAgfVxuXG4gICAgY29uc3QgYml0bWFzayA9IFsnSicsICdSJywgJ1cnLCAnUCcsICdBJywgJ1MnLCAnRCcsICdPJ107XG4gICAgbGV0IHJlcyA9ICcnO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYml0bWFzay5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKCh2YWwgJiAoMSA8PCBpKSkgIT0gMCkge1xuICAgICAgICByZXMgPSByZXMgKyBiaXRtYXNrW2ldO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzO1xuICB9XG4gIC8qKlxuICAgKiBVcGRhdGUgbnVtZXJpYyByZXByZXNlbnRhdGlvbiBvZiBhY2Nlc3MgbW9kZSB3aXRoIHRoZSBuZXcgdmFsdWUuIFRoZSB2YWx1ZVxuICAgKiBpcyBvbmUgb2YgdGhlIGZvbGxvd2luZzpcbiAgICogIC0gYSBzdHJpbmcgc3RhcnRpbmcgd2l0aCA8Y29kZT4nKyc8L2NvZGU+IG9yIDxjb2RlPictJzwvY29kZT4gdGhlbiB0aGUgYml0cyB0byBhZGQgb3IgcmVtb3ZlLCBlLmcuIDxjb2RlPicrUi1XJzwvY29kZT4gb3IgPGNvZGU+Jy1QUyc8L2NvZGU+LlxuICAgKiAgLSBhIG5ldyB2YWx1ZSBvZiBhY2Nlc3MgbW9kZVxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gdmFsIC0gYWNjZXNzIG1vZGUgdmFsdWUgdG8gdXBkYXRlLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdXBkIC0gdXBkYXRlIHRvIGFwcGx5IHRvIHZhbC5cbiAgICogQHJldHVybnMge251bWJlcn0gLSB1cGRhdGVkIGFjY2VzcyBtb2RlLlxuICAgKi9cbiAgc3RhdGljIHVwZGF0ZSh2YWwsIHVwZCkge1xuICAgIGlmICghdXBkIHx8IHR5cGVvZiB1cGQgIT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiB2YWw7XG4gICAgfVxuXG4gICAgbGV0IGFjdGlvbiA9IHVwZC5jaGFyQXQoMCk7XG4gICAgaWYgKGFjdGlvbiA9PSAnKycgfHwgYWN0aW9uID09ICctJykge1xuICAgICAgbGV0IHZhbDAgPSB2YWw7XG4gICAgICAvLyBTcGxpdCBkZWx0YS1zdHJpbmcgbGlrZSAnK0FCQy1ERUYrWicgaW50byBhbiBhcnJheSBvZiBwYXJ0cyBpbmNsdWRpbmcgKyBhbmQgLS5cbiAgICAgIGNvbnN0IHBhcnRzID0gdXBkLnNwbGl0KC8oWy0rXSkvKTtcbiAgICAgIC8vIFN0YXJ0aW5nIGl0ZXJhdGlvbiBmcm9tIDEgYmVjYXVzZSBTdHJpbmcuc3BsaXQoKSBjcmVhdGVzIGFuIGFycmF5IHdpdGggdGhlIGZpcnN0IGVtcHR5IGVsZW1lbnQuXG4gICAgICAvLyBJdGVyYXRpbmcgYnkgMiBiZWNhdXNlIHdlIHBhcnNlIHBhaXJzICsvLSB0aGVuIGRhdGEuXG4gICAgICBmb3IgKGxldCBpID0gMTsgaSA8IHBhcnRzLmxlbmd0aCAtIDE7IGkgKz0gMikge1xuICAgICAgICBhY3Rpb24gPSBwYXJ0c1tpXTtcbiAgICAgICAgY29uc3QgbTAgPSBBY2Nlc3NNb2RlLmRlY29kZShwYXJ0c1tpICsgMV0pO1xuICAgICAgICBpZiAobTAgPT0gQWNjZXNzTW9kZS5fSU5WQUxJRCkge1xuICAgICAgICAgIHJldHVybiB2YWw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG0wID09IG51bGwpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYWN0aW9uID09PSAnKycpIHtcbiAgICAgICAgICB2YWwwIHw9IG0wO1xuICAgICAgICB9IGVsc2UgaWYgKGFjdGlvbiA9PT0gJy0nKSB7XG4gICAgICAgICAgdmFsMCAmPSB+bTA7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHZhbCA9IHZhbDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFRoZSBzdHJpbmcgaXMgYW4gZXhwbGljaXQgbmV3IHZhbHVlICdBQkMnIHJhdGhlciB0aGFuIGRlbHRhLlxuICAgICAgY29uc3QgdmFsMCA9IEFjY2Vzc01vZGUuZGVjb2RlKHVwZCk7XG4gICAgICBpZiAodmFsMCAhPSBBY2Nlc3NNb2RlLl9JTlZBTElEKSB7XG4gICAgICAgIHZhbCA9IHZhbDA7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbDtcbiAgfVxuICAvKipcbiAgICogQml0cyBwcmVzZW50IGluIGExIGJ1dCBtaXNzaW5nIGluIGEyLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXIgfCBzdHJpbmd9IGExIC0gYWNjZXNzIG1vZGUgdG8gc3VidHJhY3QgZnJvbS5cbiAgICogQHBhcmFtIHtudW1iZXIgfCBzdHJpbmd9IGEyIC0gYWNjZXNzIG1vZGUgdG8gc3VidHJhY3QuXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IGFjY2VzcyBtb2RlIHdpdGggYml0cyBwcmVzZW50IGluIDxjb2RlPmExPC9jb2RlPiBidXQgbWlzc2luZyBpbiA8Y29kZT5hMjwvY29kZT4uXG4gICAqL1xuICBzdGF0aWMgZGlmZihhMSwgYTIpIHtcbiAgICBhMSA9IEFjY2Vzc01vZGUuZGVjb2RlKGExKTtcbiAgICBhMiA9IEFjY2Vzc01vZGUuZGVjb2RlKGEyKTtcblxuICAgIGlmIChhMSA9PSBBY2Nlc3NNb2RlLl9JTlZBTElEIHx8IGEyID09IEFjY2Vzc01vZGUuX0lOVkFMSUQpIHtcbiAgICAgIHJldHVybiBBY2Nlc3NNb2RlLl9JTlZBTElEO1xuICAgIH1cbiAgICByZXR1cm4gYTEgJiB+YTI7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBDdXN0b20gZm9ybWF0dGVyXG4gICAqL1xuICB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gJ3tcIm1vZGVcIjogXCInICsgQWNjZXNzTW9kZS5lbmNvZGUodGhpcy5tb2RlKSArXG4gICAgICAnXCIsIFwiZ2l2ZW5cIjogXCInICsgQWNjZXNzTW9kZS5lbmNvZGUodGhpcy5naXZlbikgK1xuICAgICAgJ1wiLCBcIndhbnRcIjogXCInICsgQWNjZXNzTW9kZS5lbmNvZGUodGhpcy53YW50KSArICdcIn0nO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogQ29udmVydHMgbnVtZXJpYyB2YWx1ZXMgdG8gc3RyaW5ncy5cbiAgICovXG4gIGpzb25IZWxwZXIoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG1vZGU6IEFjY2Vzc01vZGUuZW5jb2RlKHRoaXMubW9kZSksXG4gICAgICBnaXZlbjogQWNjZXNzTW9kZS5lbmNvZGUodGhpcy5naXZlbiksXG4gICAgICB3YW50OiBBY2Nlc3NNb2RlLmVuY29kZSh0aGlzLndhbnQpXG4gICAgfTtcbiAgfVxuICAvKipcbiAgICogQWNjZXNzTW9kZSBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyB0b3BpYyBhY2Nlc3MgbW9kZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAY2xhc3MgQWNjZXNzTW9kZVxuICAgKi9cbiAgLyoqXG4gICAqIEFzc2lnbiB2YWx1ZSB0byAnbW9kZScuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZyB8IE51bWJlcn0gbSAtIGVpdGhlciBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgYWNjZXNzIG1vZGUgb3IgYSBzZXQgb2YgYml0cy5cbiAgICogQHJldHVybnMge0FjY2Vzc01vZGV9IC0gPGNvZGU+dGhpczwvY29kZT4gQWNjZXNzTW9kZS5cbiAgICovXG4gIHNldE1vZGUobSkge1xuICAgIHRoaXMubW9kZSA9IEFjY2Vzc01vZGUuZGVjb2RlKG0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogVXBkYXRlIDxjb2RlPm1vZGU8L2NvZGU+IHZhbHVlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHUgLSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIGNoYW5nZXMgdG8gYXBwbHkgdG8gYWNjZXNzIG1vZGUuXG4gICAqIEByZXR1cm5zIHtBY2Nlc3NNb2RlfSAtIDxjb2RlPnRoaXM8L2NvZGU+IEFjY2Vzc01vZGUuXG4gICAqL1xuICB1cGRhdGVNb2RlKHUpIHtcbiAgICB0aGlzLm1vZGUgPSBBY2Nlc3NNb2RlLnVwZGF0ZSh0aGlzLm1vZGUsIHUpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogR2V0IDxjb2RlPm1vZGU8L2NvZGU+IHZhbHVlIGFzIGEgc3RyaW5nLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICpcbiAgICogQHJldHVybnMge3N0cmluZ30gLSA8Y29kZT5tb2RlPC9jb2RlPiB2YWx1ZS5cbiAgICovXG4gIGdldE1vZGUoKSB7XG4gICAgcmV0dXJuIEFjY2Vzc01vZGUuZW5jb2RlKHRoaXMubW9kZSk7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBBc3NpZ24gPGNvZGU+Z2l2ZW48L2NvZGU+ICB2YWx1ZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nIHwgTnVtYmVyfSBnIC0gZWl0aGVyIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBhY2Nlc3MgbW9kZSBvciBhIHNldCBvZiBiaXRzLlxuICAgKiBAcmV0dXJucyB7QWNjZXNzTW9kZX0gLSA8Y29kZT50aGlzPC9jb2RlPiBBY2Nlc3NNb2RlLlxuICAgKi9cbiAgc2V0R2l2ZW4oZykge1xuICAgIHRoaXMuZ2l2ZW4gPSBBY2Nlc3NNb2RlLmRlY29kZShnKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICAvKipcbiAgICogQWNjZXNzTW9kZSBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyB0b3BpYyBhY2Nlc3MgbW9kZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAY2xhc3MgQWNjZXNzTW9kZVxuICAgKi9cbiAgLyoqXG4gICAqIFVwZGF0ZSAnZ2l2ZW4nIHZhbHVlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHUgLSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIGNoYW5nZXMgdG8gYXBwbHkgdG8gYWNjZXNzIG1vZGUuXG4gICAqIEByZXR1cm5zIHtBY2Nlc3NNb2RlfSAtIDxjb2RlPnRoaXM8L2NvZGU+IEFjY2Vzc01vZGUuXG4gICAqL1xuICB1cGRhdGVHaXZlbih1KSB7XG4gICAgdGhpcy5naXZlbiA9IEFjY2Vzc01vZGUudXBkYXRlKHRoaXMuZ2l2ZW4sIHUpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogR2V0ICdnaXZlbicgdmFsdWUgYXMgYSBzdHJpbmcuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSAtIDxiPmdpdmVuPC9iPiB2YWx1ZS5cbiAgICovXG4gIGdldEdpdmVuKCkge1xuICAgIHJldHVybiBBY2Nlc3NNb2RlLmVuY29kZSh0aGlzLmdpdmVuKTtcbiAgfVxuICAvKipcbiAgICogQWNjZXNzTW9kZSBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyB0b3BpYyBhY2Nlc3MgbW9kZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAY2xhc3MgQWNjZXNzTW9kZVxuICAgKi9cbiAgLyoqXG4gICAqIEFzc2lnbiAnd2FudCcgdmFsdWUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZyB8IE51bWJlcn0gdyAtIGVpdGhlciBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgYWNjZXNzIG1vZGUgb3IgYSBzZXQgb2YgYml0cy5cbiAgICogQHJldHVybnMge0FjY2Vzc01vZGV9IC0gPGNvZGU+dGhpczwvY29kZT4gQWNjZXNzTW9kZS5cbiAgICovXG4gIHNldFdhbnQodykge1xuICAgIHRoaXMud2FudCA9IEFjY2Vzc01vZGUuZGVjb2RlKHcpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogVXBkYXRlICd3YW50JyB2YWx1ZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1IC0gc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBjaGFuZ2VzIHRvIGFwcGx5IHRvIGFjY2VzcyBtb2RlLlxuICAgKiBAcmV0dXJucyB7QWNjZXNzTW9kZX0gLSA8Y29kZT50aGlzPC9jb2RlPiBBY2Nlc3NNb2RlLlxuICAgKi9cbiAgdXBkYXRlV2FudCh1KSB7XG4gICAgdGhpcy53YW50ID0gQWNjZXNzTW9kZS51cGRhdGUodGhpcy53YW50LCB1KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICAvKipcbiAgICogQWNjZXNzTW9kZSBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyB0b3BpYyBhY2Nlc3MgbW9kZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAY2xhc3MgQWNjZXNzTW9kZVxuICAgKi9cbiAgLyoqXG4gICAqIEdldCAnd2FudCcgdmFsdWUgYXMgYSBzdHJpbmcuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSAtIDxiPndhbnQ8L2I+IHZhbHVlLlxuICAgKi9cbiAgZ2V0V2FudCgpIHtcbiAgICByZXR1cm4gQWNjZXNzTW9kZS5lbmNvZGUodGhpcy53YW50KTtcbiAgfVxuICAvKipcbiAgICogQWNjZXNzTW9kZSBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyB0b3BpYyBhY2Nlc3MgbW9kZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAY2xhc3MgQWNjZXNzTW9kZVxuICAgKi9cbiAgLyoqXG4gICAqIEdldCBwZXJtaXNzaW9ucyBwcmVzZW50IGluICd3YW50JyBidXQgbWlzc2luZyBpbiAnZ2l2ZW4nLlxuICAgKiBJbnZlcnNlIG9mIHtAbGluayBUaW5vZGUuQWNjZXNzTW9kZSNnZXRFeGNlc3NpdmV9XG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBwZXJtaXNzaW9ucyBwcmVzZW50IGluIDxiPndhbnQ8L2I+IGJ1dCBtaXNzaW5nIGluIDxiPmdpdmVuPC9iPi5cbiAgICovXG4gIGdldE1pc3NpbmcoKSB7XG4gICAgcmV0dXJuIEFjY2Vzc01vZGUuZW5jb2RlKHRoaXMud2FudCAmIH50aGlzLmdpdmVuKTtcbiAgfVxuICAvKipcbiAgICogQWNjZXNzTW9kZSBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyB0b3BpYyBhY2Nlc3MgbW9kZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAY2xhc3MgQWNjZXNzTW9kZVxuICAgKi9cbiAgLyoqXG4gICAqIEdldCBwZXJtaXNzaW9ucyBwcmVzZW50IGluICdnaXZlbicgYnV0IG1pc3NpbmcgaW4gJ3dhbnQnLlxuICAgKiBJbnZlcnNlIG9mIHtAbGluayBUaW5vZGUuQWNjZXNzTW9kZSNnZXRNaXNzaW5nfVxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICpcbiAgICogQHJldHVybnMge3N0cmluZ30gcGVybWlzc2lvbnMgcHJlc2VudCBpbiA8Yj5naXZlbjwvYj4gYnV0IG1pc3NpbmcgaW4gPGI+d2FudDwvYj4uXG4gICAqL1xuICBnZXRFeGNlc3NpdmUoKSB7XG4gICAgcmV0dXJuIEFjY2Vzc01vZGUuZW5jb2RlKHRoaXMuZ2l2ZW4gJiB+dGhpcy53YW50KTtcbiAgfVxuICAvKipcbiAgICogQWNjZXNzTW9kZSBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyB0b3BpYyBhY2Nlc3MgbW9kZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAY2xhc3MgQWNjZXNzTW9kZVxuICAgKi9cbiAgLyoqXG4gICAqIFVwZGF0ZSAnd2FudCcsICdnaXZlJywgYW5kICdtb2RlJyB2YWx1ZXMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKlxuICAgKiBAcGFyYW0ge0FjY2Vzc01vZGV9IHZhbCAtIG5ldyBhY2Nlc3MgbW9kZSB2YWx1ZS5cbiAgICogQHJldHVybnMge0FjY2Vzc01vZGV9IC0gPGNvZGU+dGhpczwvY29kZT4gQWNjZXNzTW9kZS5cbiAgICovXG4gIHVwZGF0ZUFsbCh2YWwpIHtcbiAgICBpZiAodmFsKSB7XG4gICAgICB0aGlzLnVwZGF0ZUdpdmVuKHZhbC5naXZlbik7XG4gICAgICB0aGlzLnVwZGF0ZVdhbnQodmFsLndhbnQpO1xuICAgICAgdGhpcy5tb2RlID0gdGhpcy5naXZlbiAmIHRoaXMud2FudDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBDaGVjayBpZiBPd25lciAoTykgZmxhZyBpcyBzZXQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKiBAcGFyYW0ge3N0cmluZz19IHNpZGUgLSB3aGljaCBwZXJtaXNzaW9uIHRvIGNoZWNrOiBnaXZlbiwgd2FudCwgbW9kZTsgZGVmYXVsdDogbW9kZS5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IC0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgZmxhZyBpcyBzZXQuXG4gICAqL1xuICBpc093bmVyKHNpZGUpIHtcbiAgICByZXR1cm4gQWNjZXNzTW9kZS4jY2hlY2tGbGFnKHRoaXMsIHNpZGUsIEFjY2Vzc01vZGUuX09XTkVSKTtcbiAgfVxuICAvKipcbiAgICogQWNjZXNzTW9kZSBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyB0b3BpYyBhY2Nlc3MgbW9kZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAY2xhc3MgQWNjZXNzTW9kZVxuICAgKi9cbiAgLyoqXG4gICAqIENoZWNrIGlmIFByZXNlbmNlIChQKSBmbGFnIGlzIHNldC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gc2lkZSAtIHdoaWNoIHBlcm1pc3Npb24gdG8gY2hlY2s6IGdpdmVuLCB3YW50LCBtb2RlOyBkZWZhdWx0OiBtb2RlLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSA8Y29kZT50cnVlPC9jb2RlPiBpZiBmbGFnIGlzIHNldC5cbiAgICovXG4gIGlzUHJlc2VuY2VyKHNpZGUpIHtcbiAgICByZXR1cm4gQWNjZXNzTW9kZS4jY2hlY2tGbGFnKHRoaXMsIHNpZGUsIEFjY2Vzc01vZGUuX1BSRVMpO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogQ2hlY2sgaWYgUHJlc2VuY2UgKFApIGZsYWcgaXMgTk9UIHNldC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gc2lkZSAtIHdoaWNoIHBlcm1pc3Npb24gdG8gY2hlY2s6IGdpdmVuLCB3YW50LCBtb2RlOyBkZWZhdWx0OiBtb2RlLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSA8Y29kZT50cnVlPC9jb2RlPiBpZiBmbGFnIGlzIHNldC5cbiAgICovXG4gIGlzTXV0ZWQoc2lkZSkge1xuICAgIHJldHVybiAhdGhpcy5pc1ByZXNlbmNlcihzaWRlKTtcbiAgfVxuICAvKipcbiAgICogQWNjZXNzTW9kZSBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyB0b3BpYyBhY2Nlc3MgbW9kZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAY2xhc3MgQWNjZXNzTW9kZVxuICAgKi9cbiAgLyoqXG4gICAqIENoZWNrIGlmIEpvaW4gKEopIGZsYWcgaXMgc2V0LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICogQHBhcmFtIHtzdHJpbmc9fSBzaWRlIC0gd2hpY2ggcGVybWlzc2lvbiB0byBjaGVjazogZ2l2ZW4sIHdhbnQsIG1vZGU7IGRlZmF1bHQ6IG1vZGUuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIDxjb2RlPnRydWU8L2NvZGU+IGlmIGZsYWcgaXMgc2V0LlxuICAgKi9cbiAgaXNKb2luZXIoc2lkZSkge1xuICAgIHJldHVybiBBY2Nlc3NNb2RlLiNjaGVja0ZsYWcodGhpcywgc2lkZSwgQWNjZXNzTW9kZS5fSk9JTik7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBDaGVjayBpZiBSZWFkZXIgKFIpIGZsYWcgaXMgc2V0LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICogQHBhcmFtIHtzdHJpbmc9fSBzaWRlIC0gd2hpY2ggcGVybWlzc2lvbiB0byBjaGVjazogZ2l2ZW4sIHdhbnQsIG1vZGU7IGRlZmF1bHQ6IG1vZGUuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIDxjb2RlPnRydWU8L2NvZGU+IGlmIGZsYWcgaXMgc2V0LlxuICAgKi9cbiAgaXNSZWFkZXIoc2lkZSkge1xuICAgIHJldHVybiBBY2Nlc3NNb2RlLiNjaGVja0ZsYWcodGhpcywgc2lkZSwgQWNjZXNzTW9kZS5fUkVBRCk7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBDaGVjayBpZiBXcml0ZXIgKFcpIGZsYWcgaXMgc2V0LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICogQHBhcmFtIHtzdHJpbmc9fSBzaWRlIC0gd2hpY2ggcGVybWlzc2lvbiB0byBjaGVjazogZ2l2ZW4sIHdhbnQsIG1vZGU7IGRlZmF1bHQ6IG1vZGUuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIDxjb2RlPnRydWU8L2NvZGU+IGlmIGZsYWcgaXMgc2V0LlxuICAgKi9cbiAgaXNXcml0ZXIoc2lkZSkge1xuICAgIHJldHVybiBBY2Nlc3NNb2RlLiNjaGVja0ZsYWcodGhpcywgc2lkZSwgQWNjZXNzTW9kZS5fV1JJVEUpO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogQ2hlY2sgaWYgQXBwcm92ZXIgKEEpIGZsYWcgaXMgc2V0LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICogQHBhcmFtIHtzdHJpbmc9fSBzaWRlIC0gd2hpY2ggcGVybWlzc2lvbiB0byBjaGVjazogZ2l2ZW4sIHdhbnQsIG1vZGU7IGRlZmF1bHQ6IG1vZGUuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIDxjb2RlPnRydWU8L2NvZGU+IGlmIGZsYWcgaXMgc2V0LlxuICAgKi9cbiAgaXNBcHByb3ZlcihzaWRlKSB7XG4gICAgcmV0dXJuIEFjY2Vzc01vZGUuI2NoZWNrRmxhZyh0aGlzLCBzaWRlLCBBY2Nlc3NNb2RlLl9BUFBST1ZFKTtcbiAgfVxuICAvKipcbiAgICogQWNjZXNzTW9kZSBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyB0b3BpYyBhY2Nlc3MgbW9kZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAY2xhc3MgQWNjZXNzTW9kZVxuICAgKi9cbiAgLyoqXG4gICAqIENoZWNrIGlmIGVpdGhlciBvbmUgb2YgT3duZXIgKE8pIG9yIEFwcHJvdmVyIChBKSBmbGFncyBpcyBzZXQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKiBAcGFyYW0ge3N0cmluZz19IHNpZGUgLSB3aGljaCBwZXJtaXNzaW9uIHRvIGNoZWNrOiBnaXZlbiwgd2FudCwgbW9kZTsgZGVmYXVsdDogbW9kZS5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IC0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgZmxhZyBpcyBzZXQuXG4gICAqL1xuICBpc0FkbWluKHNpZGUpIHtcbiAgICByZXR1cm4gdGhpcy5pc093bmVyKHNpZGUpIHx8IHRoaXMuaXNBcHByb3ZlcihzaWRlKTtcbiAgfVxuICAvKipcbiAgICogQWNjZXNzTW9kZSBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyB0b3BpYyBhY2Nlc3MgbW9kZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAY2xhc3MgQWNjZXNzTW9kZVxuICAgKi9cbiAgLyoqXG4gICAqIENoZWNrIGlmIGVpdGhlciBvbmUgb2YgT3duZXIgKE8pLCBBcHByb3ZlciAoQSksIG9yIFNoYXJlciAoUykgZmxhZ3MgaXMgc2V0LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICogQHBhcmFtIHtzdHJpbmc9fSBzaWRlIC0gd2hpY2ggcGVybWlzc2lvbiB0byBjaGVjazogZ2l2ZW4sIHdhbnQsIG1vZGU7IGRlZmF1bHQ6IG1vZGUuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIDxjb2RlPnRydWU8L2NvZGU+IGlmIGZsYWcgaXMgc2V0LlxuICAgKi9cbiAgaXNTaGFyZXIoc2lkZSkge1xuICAgIHJldHVybiB0aGlzLmlzQWRtaW4oc2lkZSkgfHwgQWNjZXNzTW9kZS4jY2hlY2tGbGFnKHRoaXMsIHNpZGUsIEFjY2Vzc01vZGUuX1NIQVJFKTtcbiAgfVxuICAvKipcbiAgICogQWNjZXNzTW9kZSBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyB0b3BpYyBhY2Nlc3MgbW9kZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAY2xhc3MgQWNjZXNzTW9kZVxuICAgKi9cbiAgLyoqXG4gICAqIENoZWNrIGlmIERlbGV0ZXIgKEQpIGZsYWcgaXMgc2V0LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICogQHBhcmFtIHtzdHJpbmc9fSBzaWRlIC0gd2hpY2ggcGVybWlzc2lvbiB0byBjaGVjazogZ2l2ZW4sIHdhbnQsIG1vZGU7IGRlZmF1bHQ6IG1vZGUuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIDxjb2RlPnRydWU8L2NvZGU+IGlmIGZsYWcgaXMgc2V0LlxuICAgKi9cbiAgaXNEZWxldGVyKHNpZGUpIHtcbiAgICByZXR1cm4gQWNjZXNzTW9kZS4jY2hlY2tGbGFnKHRoaXMsIHNpZGUsIEFjY2Vzc01vZGUuX0RFTEVURSk7XG4gIH1cbn1cblxuQWNjZXNzTW9kZS5fTk9ORSA9IDB4MDA7XG5BY2Nlc3NNb2RlLl9KT0lOID0gMHgwMTtcbkFjY2Vzc01vZGUuX1JFQUQgPSAweDAyO1xuQWNjZXNzTW9kZS5fV1JJVEUgPSAweDA0O1xuQWNjZXNzTW9kZS5fUFJFUyA9IDB4MDg7XG5BY2Nlc3NNb2RlLl9BUFBST1ZFID0gMHgxMDtcbkFjY2Vzc01vZGUuX1NIQVJFID0gMHgyMDtcbkFjY2Vzc01vZGUuX0RFTEVURSA9IDB4NDA7XG5BY2Nlc3NNb2RlLl9PV05FUiA9IDB4ODA7XG5cbkFjY2Vzc01vZGUuX0JJVE1BU0sgPSBBY2Nlc3NNb2RlLl9KT0lOIHwgQWNjZXNzTW9kZS5fUkVBRCB8IEFjY2Vzc01vZGUuX1dSSVRFIHwgQWNjZXNzTW9kZS5fUFJFUyB8XG4gIEFjY2Vzc01vZGUuX0FQUFJPVkUgfCBBY2Nlc3NNb2RlLl9TSEFSRSB8IEFjY2Vzc01vZGUuX0RFTEVURSB8IEFjY2Vzc01vZGUuX09XTkVSO1xuQWNjZXNzTW9kZS5fSU5WQUxJRCA9IDB4MTAwMDAwO1xuIiwiLyoqXG4gKiBAZmlsZSBJbi1tZW1vcnkgc29ydGVkIGNhY2hlIG9mIG9iamVjdHMuXG4gKlxuICogQGNvcHlyaWdodCAyMDE1LTIwMjIgVGlub2RlIExMQy5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEluLW1lbW9yeSBzb3J0ZWQgY2FjaGUgb2Ygb2JqZWN0cy5cbiAqXG4gKiBAY2xhc3MgQ0J1ZmZlclxuICogQG1lbWJlcm9mIFRpbm9kZVxuICogQHByb3RlY3RlZFxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNvbXBhcmUgY3VzdG9tIGNvbXBhcmF0b3Igb2Ygb2JqZWN0cy4gVGFrZXMgdHdvIHBhcmFtZXRlcnMgPGNvZGU+YTwvY29kZT4gYW5kIDxjb2RlPmI8L2NvZGU+O1xuICogICAgcmV0dXJucyA8Y29kZT4tMTwvY29kZT4gaWYgPGNvZGU+YSA8IGI8L2NvZGU+LCA8Y29kZT4wPC9jb2RlPiBpZiA8Y29kZT5hID09IGI8L2NvZGU+LCA8Y29kZT4xPC9jb2RlPiBvdGhlcndpc2UuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IHVuaXF1ZSBlbmZvcmNlIGVsZW1lbnQgdW5pcXVlbmVzczogd2hlbiA8Y29kZT50cnVlPC9jb2RlPiByZXBsYWNlIGV4aXN0aW5nIGVsZW1lbnQgd2l0aCBhIG5ld1xuICogICAgb25lIG9uIGNvbmZsaWN0OyB3aGVuIDxjb2RlPmZhbHNlPC9jb2RlPiBrZWVwIGJvdGggZWxlbWVudHMuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENCdWZmZXIge1xuICAjY29tcGFyYXRvciA9IHVuZGVmaW5lZDtcbiAgI3VuaXF1ZSA9IGZhbHNlO1xuICBidWZmZXIgPSBbXTtcblxuICBjb25zdHJ1Y3Rvcihjb21wYXJlXywgdW5pcXVlXykge1xuICAgIHRoaXMuI2NvbXBhcmF0b3IgPSBjb21wYXJlXyB8fCAoKGEsIGIpID0+IHtcbiAgICAgIHJldHVybiBhID09PSBiID8gMCA6IGEgPCBiID8gLTEgOiAxO1xuICAgIH0pO1xuICAgIHRoaXMuI3VuaXF1ZSA9IHVuaXF1ZV87XG4gIH1cblxuICAjZmluZE5lYXJlc3QoZWxlbSwgYXJyLCBleGFjdCkge1xuICAgIGxldCBzdGFydCA9IDA7XG4gICAgbGV0IGVuZCA9IGFyci5sZW5ndGggLSAxO1xuICAgIGxldCBwaXZvdCA9IDA7XG4gICAgbGV0IGRpZmYgPSAwO1xuICAgIGxldCBmb3VuZCA9IGZhbHNlO1xuXG4gICAgd2hpbGUgKHN0YXJ0IDw9IGVuZCkge1xuICAgICAgcGl2b3QgPSAoc3RhcnQgKyBlbmQpIC8gMiB8IDA7XG4gICAgICBkaWZmID0gdGhpcy4jY29tcGFyYXRvcihhcnJbcGl2b3RdLCBlbGVtKTtcbiAgICAgIGlmIChkaWZmIDwgMCkge1xuICAgICAgICBzdGFydCA9IHBpdm90ICsgMTtcbiAgICAgIH0gZWxzZSBpZiAoZGlmZiA+IDApIHtcbiAgICAgICAgZW5kID0gcGl2b3QgLSAxO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGZvdW5kKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpZHg6IHBpdm90LFxuICAgICAgICBleGFjdDogdHJ1ZVxuICAgICAgfTtcbiAgICB9XG4gICAgaWYgKGV4YWN0KSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpZHg6IC0xXG4gICAgICB9O1xuICAgIH1cbiAgICAvLyBOb3QgZXhhY3QgLSBpbnNlcnRpb24gcG9pbnRcbiAgICByZXR1cm4ge1xuICAgICAgaWR4OiBkaWZmIDwgMCA/IHBpdm90ICsgMSA6IHBpdm90XG4gICAgfTtcbiAgfVxuXG4gIC8vIEluc2VydCBlbGVtZW50IGludG8gYSBzb3J0ZWQgYXJyYXkuXG4gICNpbnNlcnRTb3J0ZWQoZWxlbSwgYXJyKSB7XG4gICAgY29uc3QgZm91bmQgPSB0aGlzLiNmaW5kTmVhcmVzdChlbGVtLCBhcnIsIGZhbHNlKTtcbiAgICBjb25zdCBjb3VudCA9IChmb3VuZC5leGFjdCAmJiB0aGlzLiN1bmlxdWUpID8gMSA6IDA7XG4gICAgYXJyLnNwbGljZShmb3VuZC5pZHgsIGNvdW50LCBlbGVtKTtcbiAgICByZXR1cm4gYXJyO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhbiBlbGVtZW50IGF0IHRoZSBnaXZlbiBwb3NpdGlvbi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5DQnVmZmVyI1xuICAgKiBAcGFyYW0ge251bWJlcn0gYXQgLSBQb3NpdGlvbiB0byBmZXRjaCBmcm9tLlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSBFbGVtZW50IGF0IHRoZSBnaXZlbiBwb3NpdGlvbiBvciA8Y29kZT51bmRlZmluZWQ8L2NvZGU+LlxuICAgKi9cbiAgZ2V0QXQoYXQpIHtcbiAgICByZXR1cm4gdGhpcy5idWZmZXJbYXRdO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlbmllbmNlIG1ldGhvZCBmb3IgZ2V0dGluZyB0aGUgZWxlbWVudCBmcm9tIHRoZSBlbmQgb2YgdGhlIGJ1ZmZlci5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5DQnVmZmVyI1xuICAgKiBAcGFyYW0ge251bWJlcn0gYXQgLSBwb3NpdGlvbiB0byBmZXRjaCBmcm9tLCBjb3VudGluZyBmcm9tIHRoZSBlbmQ7XG4gICAqICAgIDxjb2RlPnVuZGVmaW5lZDwvY29kZT4gb3IgPGNvZGU+bnVsbDwvY29kZT4gIG1lYW4gXCJsYXN0XCIuXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBsYXN0IGVsZW1lbnQgaW4gdGhlIGJ1ZmZlciBvciA8Y29kZT51bmRlZmluZWQ8L2NvZGU+IGlmIGJ1ZmZlciBpcyBlbXB0eS5cbiAgICovXG4gIGdldExhc3QoYXQpIHtcbiAgICBhdCB8PSAwO1xuICAgIHJldHVybiB0aGlzLmJ1ZmZlci5sZW5ndGggPiBhdCA/IHRoaXMuYnVmZmVyW3RoaXMuYnVmZmVyLmxlbmd0aCAtIDEgLSBhdF0gOiB1bmRlZmluZWQ7XG4gIH1cblxuICAvKipcbiAgICogQWRkIG5ldyBlbGVtZW50KHMpIHRvIHRoZSBidWZmZXIuIFZhcmlhZGljOiB0YWtlcyBvbmUgb3IgbW9yZSBhcmd1bWVudHMuIElmIGFuIGFycmF5IGlzIHBhc3NlZCBhcyBhIHNpbmdsZVxuICAgKiBhcmd1bWVudCwgaXRzIGVsZW1lbnRzIGFyZSBpbnNlcnRlZCBpbmRpdmlkdWFsbHkuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ0J1ZmZlciNcbiAgICpcbiAgICogQHBhcmFtIHsuLi5PYmplY3R8QXJyYXl9IC0gT25lIG9yIG1vcmUgb2JqZWN0cyB0byBpbnNlcnQuXG4gICAqL1xuICBwdXQoKSB7XG4gICAgbGV0IGluc2VydDtcbiAgICAvLyBpbnNwZWN0IGFyZ3VtZW50czogaWYgYXJyYXksIGluc2VydCBpdHMgZWxlbWVudHMsIGlmIG9uZSBvciBtb3JlIG5vbi1hcnJheSBhcmd1bWVudHMsIGluc2VydCB0aGVtIG9uZSBieSBvbmVcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSAxICYmIEFycmF5LmlzQXJyYXkoYXJndW1lbnRzWzBdKSkge1xuICAgICAgaW5zZXJ0ID0gYXJndW1lbnRzWzBdO1xuICAgIH0gZWxzZSB7XG4gICAgICBpbnNlcnQgPSBhcmd1bWVudHM7XG4gICAgfVxuICAgIGZvciAobGV0IGlkeCBpbiBpbnNlcnQpIHtcbiAgICAgIHRoaXMuI2luc2VydFNvcnRlZChpbnNlcnRbaWR4XSwgdGhpcy5idWZmZXIpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgZWxlbWVudCBhdCB0aGUgZ2l2ZW4gcG9zaXRpb24uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ0J1ZmZlciNcbiAgICogQHBhcmFtIHtudW1iZXJ9IGF0IC0gUG9zaXRpb24gdG8gZGVsZXRlIGF0LlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSBFbGVtZW50IGF0IHRoZSBnaXZlbiBwb3NpdGlvbiBvciA8Y29kZT51bmRlZmluZWQ8L2NvZGU+LlxuICAgKi9cbiAgZGVsQXQoYXQpIHtcbiAgICBhdCB8PSAwO1xuICAgIGxldCByID0gdGhpcy5idWZmZXIuc3BsaWNlKGF0LCAxKTtcbiAgICBpZiAociAmJiByLmxlbmd0aCA+IDApIHtcbiAgICAgIHJldHVybiByWzBdO1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBlbGVtZW50cyBiZXR3ZWVuIHR3byBwb3NpdGlvbnMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ0J1ZmZlciNcbiAgICogQHBhcmFtIHtudW1iZXJ9IHNpbmNlIC0gUG9zaXRpb24gdG8gZGVsZXRlIGZyb20gKGluY2x1c2l2ZSkuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBiZWZvcmUgLSBQb3NpdGlvbiB0byBkZWxldGUgdG8gKGV4Y2x1c2l2ZSkuXG4gICAqXG4gICAqIEByZXR1cm5zIHtBcnJheX0gYXJyYXkgb2YgcmVtb3ZlZCBlbGVtZW50cyAoY291bGQgYmUgemVybyBsZW5ndGgpLlxuICAgKi9cbiAgZGVsUmFuZ2Uoc2luY2UsIGJlZm9yZSkge1xuICAgIHJldHVybiB0aGlzLmJ1ZmZlci5zcGxpY2Uoc2luY2UsIGJlZm9yZSAtIHNpbmNlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIG51bWJlciBvZiBlbGVtZW50cyB0aGUgYnVmZmVyIGhvbGRzLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNCdWZmZXIjXG4gICAqIEByZXR1cm4ge251bWJlcn0gTnVtYmVyIG9mIGVsZW1lbnRzIGluIHRoZSBidWZmZXIuXG4gICAqL1xuICBsZW5ndGgoKSB7XG4gICAgcmV0dXJuIHRoaXMuYnVmZmVyLmxlbmd0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldCB0aGUgYnVmZmVyIGRpc2NhcmRpbmcgYWxsIGVsZW1lbnRzXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ0J1ZmZlciNcbiAgICovXG4gIHJlc2V0KCkge1xuICAgIHRoaXMuYnVmZmVyID0gW107XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGJhY2sgZm9yIGl0ZXJhdGluZyBjb250ZW50cyBvZiBidWZmZXIuIFNlZSB7QGxpbmsgVGlub2RlLkNCdWZmZXIjZm9yRWFjaH0uXG4gICAqIEBjYWxsYmFjayBGb3JFYWNoQ2FsbGJhY2tUeXBlXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ0J1ZmZlciNcbiAgICogQHBhcmFtIHtPYmplY3R9IGVsZW0gLSBDdXJyZW50IGVsZW1lbnQgb2YgdGhlIGJ1ZmZlci5cbiAgICogQHBhcmFtIHtPYmplY3R9IHByZXYgLSBQcmV2aW91cyBlbGVtZW50IG9mIHRoZSBidWZmZXIuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBuZXh0IC0gTmV4dCBlbGVtZW50IG9mIHRoZSBidWZmZXIuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCAtIEluZGV4IG9mIHRoZSBjdXJyZW50IGVsZW1lbnQuXG4gICAqL1xuXG4gIC8qKlxuICAgKiBBcHBseSBnaXZlbiA8Y29kZT5jYWxsYmFjazwvY29kZT4gdG8gYWxsIGVsZW1lbnRzIG9mIHRoZSBidWZmZXIuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ0J1ZmZlciNcbiAgICpcbiAgICogQHBhcmFtIHtUaW5vZGUuRm9yRWFjaENhbGxiYWNrVHlwZX0gY2FsbGJhY2sgLSBGdW5jdGlvbiB0byBjYWxsIGZvciBlYWNoIGVsZW1lbnQuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzdGFydElkeCAtIE9wdGlvbmFsIGluZGV4IHRvIHN0YXJ0IGl0ZXJhdGluZyBmcm9tIChpbmNsdXNpdmUpLlxuICAgKiBAcGFyYW0ge251bWJlcn0gYmVmb3JlSWR4IC0gT3B0aW9uYWwgaW5kZXggdG8gc3RvcCBpdGVyYXRpbmcgYmVmb3JlIChleGNsdXNpdmUpLlxuICAgKiBAcGFyYW0ge09iamVjdH0gY29udGV4dCAtIGNhbGxpbmcgY29udGV4dCAoaS5lLiB2YWx1ZSBvZiA8Y29kZT50aGlzPC9jb2RlPiBpbiBjYWxsYmFjaylcbiAgICovXG4gIGZvckVhY2goY2FsbGJhY2ssIHN0YXJ0SWR4LCBiZWZvcmVJZHgsIGNvbnRleHQpIHtcbiAgICBzdGFydElkeCA9IHN0YXJ0SWR4IHwgMDtcbiAgICBiZWZvcmVJZHggPSBiZWZvcmVJZHggfHwgdGhpcy5idWZmZXIubGVuZ3RoO1xuXG4gICAgZm9yIChsZXQgaSA9IHN0YXJ0SWR4OyBpIDwgYmVmb3JlSWR4OyBpKyspIHtcbiAgICAgIGNhbGxiYWNrLmNhbGwoY29udGV4dCwgdGhpcy5idWZmZXJbaV0sXG4gICAgICAgIChpID4gc3RhcnRJZHggPyB0aGlzLmJ1ZmZlcltpIC0gMV0gOiB1bmRlZmluZWQpLFxuICAgICAgICAoaSA8IGJlZm9yZUlkeCAtIDEgPyB0aGlzLmJ1ZmZlcltpICsgMV0gOiB1bmRlZmluZWQpLCBpKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRmluZCBlbGVtZW50IGluIGJ1ZmZlciB1c2luZyBidWZmZXIncyBjb21wYXJpc29uIGZ1bmN0aW9uLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNCdWZmZXIjXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBlbGVtIC0gZWxlbWVudCB0byBmaW5kLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBuZWFyZXN0IC0gd2hlbiB0cnVlIGFuZCBleGFjdCBtYXRjaCBpcyBub3QgZm91bmQsIHJldHVybiB0aGUgbmVhcmVzdCBlbGVtZW50IChpbnNlcnRpb24gcG9pbnQpLlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSBpbmRleCBvZiB0aGUgZWxlbWVudCBpbiB0aGUgYnVmZmVyIG9yIC0xLlxuICAgKi9cbiAgZmluZChlbGVtLCBuZWFyZXN0KSB7XG4gICAgY29uc3Qge1xuICAgICAgaWR4XG4gICAgfSA9IHRoaXMuI2ZpbmROZWFyZXN0KGVsZW0sIHRoaXMuYnVmZmVyLCAhbmVhcmVzdCk7XG4gICAgcmV0dXJuIGlkeDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsYmFjayBmb3IgZmlsdGVyaW5nIHRoZSBidWZmZXIuIFNlZSB7QGxpbmsgVGlub2RlLkNCdWZmZXIjZmlsdGVyfS5cbiAgICogQGNhbGxiYWNrIEZvckVhY2hDYWxsYmFja1R5cGVcbiAgICogQG1lbWJlcm9mIFRpbm9kZS5DQnVmZmVyI1xuICAgKiBAcGFyYW0ge09iamVjdH0gZWxlbSAtIEN1cnJlbnQgZWxlbWVudCBvZiB0aGUgYnVmZmVyLlxuICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXggLSBJbmRleCBvZiB0aGUgY3VycmVudCBlbGVtZW50LlxuICAgKiBAcmV0dXJucyB7Ym9vbGVufSA8Y29kZT50cnVlPC9jb2RlPiB0byBrZWVwIHRoZSBlbGVtZW50LCA8Y29kZT5mYWxzZTwvY29kZT4gdG8gcmVtb3ZlLlxuICAgKi9cblxuICAvKipcbiAgICogUmVtb3ZlIGFsbCBlbGVtZW50cyB0aGF0IGRvIG5vdCBwYXNzIHRoZSB0ZXN0IGltcGxlbWVudGVkIGJ5IHRoZSBwcm92aWRlZCBjYWxsYmFjayBmdW5jdGlvbi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5DQnVmZmVyI1xuICAgKlxuICAgKiBAcGFyYW0ge1Rpbm9kZS5GaWx0ZXJDYWxsYmFja1R5cGV9IGNhbGxiYWNrIC0gRnVuY3Rpb24gdG8gY2FsbCBmb3IgZWFjaCBlbGVtZW50LlxuICAgKiBAcGFyYW0ge09iamVjdH0gY29udGV4dCAtIGNhbGxpbmcgY29udGV4dCAoaS5lLiB2YWx1ZSBvZiA8Y29kZT50aGlzPC9jb2RlPiBpbiB0aGUgY2FsbGJhY2spXG4gICAqL1xuICBmaWx0ZXIoY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICBsZXQgY291bnQgPSAwO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5idWZmZXIubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChjYWxsYmFjay5jYWxsKGNvbnRleHQsIHRoaXMuYnVmZmVyW2ldLCBpKSkge1xuICAgICAgICB0aGlzLmJ1ZmZlcltjb3VudF0gPSB0aGlzLmJ1ZmZlcltpXTtcbiAgICAgICAgY291bnQrKztcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmJ1ZmZlci5zcGxpY2UoY291bnQpO1xuICB9XG59XG4iLCIvKipcbiAqIEBmaWxlIEdsb2JhbCBjb25zdGFudHMgYW5kIGNvbmZpZ3VyYXRpb24gcGFyYW1ldGVycy5cbiAqXG4gKiBAY29weXJpZ2h0IDIwMTUtMjAyMiBUaW5vZGUgTExDXG4gKi9cbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHtcbiAgdmVyc2lvbiBhcyBwYWNrYWdlX3ZlcnNpb25cbn0gZnJvbSAnLi4vdmVyc2lvbi5qc29uJztcblxuLy8gR2xvYmFsIGNvbnN0YW50c1xuZXhwb3J0IGNvbnN0IFBST1RPQ09MX1ZFUlNJT04gPSAnMCc7IC8vIE1ham9yIGNvbXBvbmVudCBvZiB0aGUgdmVyc2lvbiwgZS5nLiAnMCcgaW4gJzAuMTcuMScuXG5leHBvcnQgY29uc3QgVkVSU0lPTiA9IHBhY2thZ2VfdmVyc2lvbiB8fCAnMC4xOCc7XG5leHBvcnQgY29uc3QgTElCUkFSWSA9ICd0aW5vZGVqcy8nICsgVkVSU0lPTjtcblxuLy8gVG9waWMgbmFtZSBwcmVmaXhlcy5cbmV4cG9ydCBjb25zdCBUT1BJQ19ORVcgPSAnbmV3JztcbmV4cG9ydCBjb25zdCBUT1BJQ19ORVdfQ0hBTiA9ICduY2gnO1xuZXhwb3J0IGNvbnN0IFRPUElDX01FID0gJ21lJztcbmV4cG9ydCBjb25zdCBUT1BJQ19GTkQgPSAnZm5kJztcbmV4cG9ydCBjb25zdCBUT1BJQ19TWVMgPSAnc3lzJztcbmV4cG9ydCBjb25zdCBUT1BJQ19DSEFOID0gJ2Nobic7XG5leHBvcnQgY29uc3QgVE9QSUNfR1JQID0gJ2dycDsnXG5leHBvcnQgY29uc3QgVE9QSUNfUDJQID0gJ3AycCc7XG5leHBvcnQgY29uc3QgVVNFUl9ORVcgPSAnbmV3JztcblxuLy8gU3RhcnRpbmcgdmFsdWUgb2YgYSBsb2NhbGx5LWdlbmVyYXRlZCBzZXFJZCB1c2VkIGZvciBwZW5kaW5nIG1lc3NhZ2VzLlxuZXhwb3J0IGNvbnN0IExPQ0FMX1NFUUlEID0gMHhGRkZGRkZGO1xuXG4vLyBTdGF0dXMgY29kZXMuXG5leHBvcnQgY29uc3QgTUVTU0FHRV9TVEFUVVNfTk9ORSA9IDA7IC8vIFN0YXR1cyBub3QgYXNzaWduZWQuXG5leHBvcnQgY29uc3QgTUVTU0FHRV9TVEFUVVNfUVVFVUVEID0gMTsgLy8gTG9jYWwgSUQgYXNzaWduZWQsIGluIHByb2dyZXNzIHRvIGJlIHNlbnQuXG5leHBvcnQgY29uc3QgTUVTU0FHRV9TVEFUVVNfU0VORElORyA9IDI7IC8vIFRyYW5zbWlzc2lvbiBzdGFydGVkLlxuZXhwb3J0IGNvbnN0IE1FU1NBR0VfU1RBVFVTX0ZBSUxFRCA9IDM7IC8vIEF0IGxlYXN0IG9uZSBhdHRlbXB0IHdhcyBtYWRlIHRvIHNlbmQgdGhlIG1lc3NhZ2UuXG5leHBvcnQgY29uc3QgTUVTU0FHRV9TVEFUVVNfU0VOVCA9IDQ7IC8vIERlbGl2ZXJlZCB0byB0aGUgc2VydmVyLlxuZXhwb3J0IGNvbnN0IE1FU1NBR0VfU1RBVFVTX1JFQ0VJVkVEID0gNTsgLy8gUmVjZWl2ZWQgYnkgdGhlIGNsaWVudC5cbmV4cG9ydCBjb25zdCBNRVNTQUdFX1NUQVRVU19SRUFEID0gNjsgLy8gUmVhZCBieSB0aGUgdXNlci5cbmV4cG9ydCBjb25zdCBNRVNTQUdFX1NUQVRVU19UT19NRSA9IDc7IC8vIFRoZSBtZXNzYWdlIGlzIHJlY2VpdmVkIGZyb20gYW5vdGhlciB1c2VyLlxuZXhwb3J0IGNvbnN0IE1FU1NBR0VfU1RBVFVTX0RFTF9SQU5HRSA9IDg7IC8vIFRoZSBtZXNzYWdlIHJlcHJlc2VudHMgYSBkZWxldGVkIHJhbmdlLlxuXG4vLyBSZWplY3QgdW5yZXNvbHZlZCBmdXR1cmVzIGFmdGVyIHRoaXMgbWFueSBtaWxsaXNlY29uZHMuXG5leHBvcnQgY29uc3QgRVhQSVJFX1BST01JU0VTX1RJTUVPVVQgPSA1MDAwO1xuLy8gUGVyaW9kaWNpdHkgb2YgZ2FyYmFnZSBjb2xsZWN0aW9uIG9mIHVucmVzb2x2ZWQgZnV0dXJlcy5cbmV4cG9ydCBjb25zdCBFWFBJUkVfUFJPTUlTRVNfUEVSSU9EID0gMTAwMDtcblxuLy8gRGVmYXVsdCBudW1iZXIgb2YgbWVzc2FnZXMgdG8gcHVsbCBpbnRvIG1lbW9yeSBmcm9tIHBlcnNpc3RlbnQgY2FjaGUuXG5leHBvcnQgY29uc3QgREVGQVVMVF9NRVNTQUdFU19QQUdFID0gMjQ7XG5cbi8vIFVuaWNvZGUgREVMIGNoYXJhY3RlciBpbmRpY2F0aW5nIGRhdGEgd2FzIGRlbGV0ZWQuXG5leHBvcnQgY29uc3QgREVMX0NIQVIgPSAnXFx1MjQyMSc7XG4iLCIvKipcbiAqIEBmaWxlIEFic3RyYWN0aW9uIGxheWVyIGZvciB3ZWJzb2NrZXQgYW5kIGxvbmcgcG9sbGluZyBjb25uZWN0aW9ucy5cbiAqXG4gKiBAY29weXJpZ2h0IDIwMTUtMjAyMiBUaW5vZGUgTExDLlxuICovXG4ndXNlIHN0cmljdCc7XG5cbmltcG9ydCB7XG4gIGpzb25QYXJzZUhlbHBlclxufSBmcm9tICcuL3V0aWxzLmpzJztcblxubGV0IFdlYlNvY2tldFByb3ZpZGVyO1xubGV0IFhIUlByb3ZpZGVyO1xuXG4vLyBFcnJvciBjb2RlIHRvIHJldHVybiBpbiBjYXNlIG9mIGEgbmV0d29yayBwcm9ibGVtLlxuY29uc3QgTkVUV09SS19FUlJPUiA9IDUwMztcbmNvbnN0IE5FVFdPUktfRVJST1JfVEVYVCA9IFwiQ29ubmVjdGlvbiBmYWlsZWRcIjtcblxuLy8gRXJyb3IgY29kZSB0byByZXR1cm4gd2hlbiB1c2VyIGRpc2Nvbm5lY3RlZCBmcm9tIHNlcnZlci5cbmNvbnN0IE5FVFdPUktfVVNFUiA9IDQxODtcbmNvbnN0IE5FVFdPUktfVVNFUl9URVhUID0gXCJEaXNjb25uZWN0ZWQgYnkgY2xpZW50XCI7XG5cbi8vIFNldHRpbmdzIGZvciBleHBvbmVudGlhbCBiYWNrb2ZmXG5jb25zdCBfQk9GRl9CQVNFID0gMjAwMDsgLy8gMjAwMCBtaWxsaXNlY29uZHMsIG1pbmltdW0gZGVsYXkgYmV0d2VlbiByZWNvbm5lY3RzXG5jb25zdCBfQk9GRl9NQVhfSVRFUiA9IDEwOyAvLyBNYXhpbXVtIGRlbGF5IGJldHdlZW4gcmVjb25uZWN0cyAyXjEwICogMjAwMCB+IDM0IG1pbnV0ZXNcbmNvbnN0IF9CT0ZGX0pJVFRFUiA9IDAuMzsgLy8gQWRkIHJhbmRvbSBkZWxheVxuXG4vLyBIZWxwZXIgZnVuY3Rpb24gZm9yIGNyZWF0aW5nIGFuIGVuZHBvaW50IFVSTC5cbmZ1bmN0aW9uIG1ha2VCYXNlVXJsKGhvc3QsIHByb3RvY29sLCB2ZXJzaW9uLCBhcGlLZXkpIHtcbiAgbGV0IHVybCA9IG51bGw7XG5cbiAgaWYgKFsnaHR0cCcsICdodHRwcycsICd3cycsICd3c3MnXS5pbmNsdWRlcyhwcm90b2NvbCkpIHtcbiAgICB1cmwgPSBgJHtwcm90b2NvbH06Ly8ke2hvc3R9YDtcbiAgICBpZiAodXJsLmNoYXJBdCh1cmwubGVuZ3RoIC0gMSkgIT09ICcvJykge1xuICAgICAgdXJsICs9ICcvJztcbiAgICB9XG4gICAgdXJsICs9ICd2JyArIHZlcnNpb24gKyAnL2NoYW5uZWxzJztcbiAgICBpZiAoWydodHRwJywgJ2h0dHBzJ10uaW5jbHVkZXMocHJvdG9jb2wpKSB7XG4gICAgICAvLyBMb25nIHBvbGxpbmcgZW5kcG9pbnQgZW5kcyB3aXRoIFwibHBcIiwgaS5lLlxuICAgICAgLy8gJy92MC9jaGFubmVscy9scCcgdnMganVzdCAnL3YwL2NoYW5uZWxzJyBmb3Igd3NcbiAgICAgIHVybCArPSAnL2xwJztcbiAgICB9XG4gICAgdXJsICs9ICc/YXBpa2V5PScgKyBhcGlLZXk7XG4gIH1cbiAgcmV0dXJuIHVybDtcbn1cblxuLyoqXG4gKiBBbiBhYnN0cmFjdGlvbiBmb3IgYSB3ZWJzb2NrZXQgb3IgYSBsb25nIHBvbGxpbmcgY29ubmVjdGlvbi5cbiAqXG4gKiBAY2xhc3MgQ29ubmVjdGlvblxuICogQG1lbWJlcm9mIFRpbm9kZVxuXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnIC0gY29uZmlndXJhdGlvbiBwYXJhbWV0ZXJzLlxuICogQHBhcmFtIHtzdHJpbmd9IGNvbmZpZy5ob3N0IC0gSG9zdCBuYW1lIGFuZCBvcHRpb25hbCBwb3J0IG51bWJlciB0byBjb25uZWN0IHRvLlxuICogQHBhcmFtIHtzdHJpbmd9IGNvbmZpZy5hcGlLZXkgLSBBUEkga2V5IGdlbmVyYXRlZCBieSA8Y29kZT5rZXlnZW48L2NvZGU+LlxuICogQHBhcmFtIHtzdHJpbmd9IGNvbmZpZy50cmFuc3BvcnQgLSBOZXR3b3JrIHRyYW5zcG9ydCB0byB1c2UsIGVpdGhlciA8Y29kZT5cIndzXCI8Y29kZT4vPGNvZGU+XCJ3c3NcIjwvY29kZT4gZm9yIHdlYnNvY2tldCBvclxuICogICAgICA8Y29kZT5scDwvY29kZT4gZm9yIGxvbmcgcG9sbGluZy5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gY29uZmlnLnNlY3VyZSAtIFVzZSBTZWN1cmUgV2ViU29ja2V0IGlmIDxjb2RlPnRydWU8L2NvZGU+LlxuICogQHBhcmFtIHtzdHJpbmd9IHZlcnNpb25fIC0gTWFqb3IgdmFsdWUgb2YgdGhlIHByb3RvY29sIHZlcnNpb24sIGUuZy4gJzAnIGluICcwLjE3LjEnLlxuICogQHBhcmFtIHtib29sZWFufSBhdXRvcmVjb25uZWN0XyAtIElmIGNvbm5lY3Rpb24gaXMgbG9zdCwgdHJ5IHRvIHJlY29ubmVjdCBhdXRvbWF0aWNhbGx5LlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb25uZWN0aW9uIHtcbiAgLy8gTG9nZ2VyLCBkb2VzIG5vdGhpbmcgYnkgZGVmYXVsdC5cbiAgc3RhdGljICNsb2cgPSBfID0+IHt9O1xuXG4gICNib2ZmVGltZXIgPSBudWxsO1xuICAjYm9mZkl0ZXJhdGlvbiA9IDA7XG4gICNib2ZmQ2xvc2VkID0gZmFsc2U7IC8vIEluZGljYXRvciBpZiB0aGUgc29ja2V0IHdhcyBtYW51YWxseSBjbG9zZWQgLSBkb24ndCBhdXRvcmVjb25uZWN0IGlmIHRydWUuXG5cbiAgLy8gV2Vic29ja2V0LlxuICAjc29ja2V0ID0gbnVsbDtcblxuICBob3N0O1xuICBzZWN1cmU7XG4gIGFwaUtleTtcblxuICB2ZXJzaW9uO1xuICBhdXRvcmVjb25uZWN0O1xuXG4gIGluaXRpYWxpemVkO1xuXG4gIC8vIChjb25maWcuaG9zdCwgY29uZmlnLmFwaUtleSwgY29uZmlnLnRyYW5zcG9ydCwgY29uZmlnLnNlY3VyZSksIFBST1RPQ09MX1ZFUlNJT04sIHRydWVcbiAgY29uc3RydWN0b3IoY29uZmlnLCB2ZXJzaW9uXywgYXV0b3JlY29ubmVjdF8pIHtcbiAgICB0aGlzLmhvc3QgPSBjb25maWcuaG9zdDtcbiAgICB0aGlzLnNlY3VyZSA9IGNvbmZpZy5zZWN1cmU7XG4gICAgdGhpcy5hcGlLZXkgPSBjb25maWcuYXBpS2V5O1xuXG4gICAgdGhpcy52ZXJzaW9uID0gdmVyc2lvbl87XG4gICAgdGhpcy5hdXRvcmVjb25uZWN0ID0gYXV0b3JlY29ubmVjdF87XG5cbiAgICBpZiAoY29uZmlnLnRyYW5zcG9ydCA9PT0gJ2xwJykge1xuICAgICAgLy8gZXhwbGljaXQgcmVxdWVzdCB0byB1c2UgbG9uZyBwb2xsaW5nXG4gICAgICB0aGlzLiNpbml0X2xwKCk7XG4gICAgICB0aGlzLmluaXRpYWxpemVkID0gJ2xwJztcbiAgICB9IGVsc2UgaWYgKGNvbmZpZy50cmFuc3BvcnQgPT09ICd3cycpIHtcbiAgICAgIC8vIGV4cGxpY2l0IHJlcXVlc3QgdG8gdXNlIHdlYiBzb2NrZXRcbiAgICAgIC8vIGlmIHdlYnNvY2tldHMgYXJlIG5vdCBhdmFpbGFibGUsIGhvcnJpYmxlIHRoaW5ncyB3aWxsIGhhcHBlblxuICAgICAgdGhpcy4jaW5pdF93cygpO1xuICAgICAgdGhpcy5pbml0aWFsaXplZCA9ICd3cyc7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmluaXRpYWxpemVkKSB7XG4gICAgICAvLyBJbnZhbGlkIG9yIHVuZGVmaW5lZCBuZXR3b3JrIHRyYW5zcG9ydC5cbiAgICAgIENvbm5lY3Rpb24uI2xvZyhcIlVua25vd24gb3IgaW52YWxpZCBuZXR3b3JrIHRyYW5zcG9ydC4gUnVubmluZyB1bmRlciBOb2RlPyBDYWxsICdUaW5vZGUuc2V0TmV0d29ya1Byb3ZpZGVycygpJy5cIik7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duIG9yIGludmFsaWQgbmV0d29yayB0cmFuc3BvcnQuIFJ1bm5pbmcgdW5kZXIgTm9kZT8gQ2FsbCAnVGlub2RlLnNldE5ldHdvcmtQcm92aWRlcnMoKScuXCIpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUbyB1c2UgQ29ubmVjdGlvbiBpbiBhIG5vbiBicm93c2VyIGNvbnRleHQsIHN1cHBseSBXZWJTb2NrZXQgYW5kIFhNTEh0dHBSZXF1ZXN0IHByb3ZpZGVycy5cbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyb2YgQ29ubmVjdGlvblxuICAgKiBAcGFyYW0gd3NQcm92aWRlciBXZWJTb2NrZXQgcHJvdmlkZXIsIGUuZy4gZm9yIG5vZGVKUyAsIDxjb2RlPnJlcXVpcmUoJ3dzJyk8L2NvZGU+LlxuICAgKiBAcGFyYW0geGhyUHJvdmlkZXIgWE1MSHR0cFJlcXVlc3QgcHJvdmlkZXIsIGUuZy4gZm9yIG5vZGUgPGNvZGU+cmVxdWlyZSgneGhyJyk8L2NvZGU+LlxuICAgKi9cbiAgc3RhdGljIHNldE5ldHdvcmtQcm92aWRlcnMod3NQcm92aWRlciwgeGhyUHJvdmlkZXIpIHtcbiAgICBXZWJTb2NrZXRQcm92aWRlciA9IHdzUHJvdmlkZXI7XG4gICAgWEhSUHJvdmlkZXIgPSB4aHJQcm92aWRlcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBBc3NpZ24gYSBub24tZGVmYXVsdCBsb2dnZXIuXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlcm9mIENvbm5lY3Rpb25cbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gbCB2YXJpYWRpYyBsb2dnaW5nIGZ1bmN0aW9uLlxuICAgKi9cbiAgc3RhdGljIHNldCBsb2dnZXIobCkge1xuICAgIENvbm5lY3Rpb24uI2xvZyA9IGw7XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhdGUgYSBuZXcgY29ubmVjdGlvblxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNvbm5lY3Rpb24jXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBob3N0XyBIb3N0IG5hbWUgdG8gY29ubmVjdCB0bzsgaWYgPGNvZGU+bnVsbDwvY29kZT4gdGhlIG9sZCBob3N0IG5hbWUgd2lsbCBiZSB1c2VkLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGZvcmNlIEZvcmNlIG5ldyBjb25uZWN0aW9uIGV2ZW4gaWYgb25lIGFscmVhZHkgZXhpc3RzLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBQcm9taXNlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIGNvbm5lY3Rpb24gY2FsbCBjb21wbGV0ZXMsIHJlc29sdXRpb24gaXMgY2FsbGVkIHdpdGhvdXRcbiAgICogIHBhcmFtZXRlcnMsIHJlamVjdGlvbiBwYXNzZXMgdGhlIHtFcnJvcn0gYXMgcGFyYW1ldGVyLlxuICAgKi9cbiAgY29ubmVjdChob3N0XywgZm9yY2UpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobnVsbCk7XG4gIH1cblxuICAvKipcbiAgICogVHJ5IHRvIHJlc3RvcmUgYSBuZXR3b3JrIGNvbm5lY3Rpb24sIGFsc28gcmVzZXQgYmFja29mZi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Db25uZWN0aW9uI1xuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGZvcmNlIC0gcmVjb25uZWN0IGV2ZW4gaWYgdGhlcmUgaXMgYSBsaXZlIGNvbm5lY3Rpb24gYWxyZWFkeS5cbiAgICovXG4gIHJlY29ubmVjdChmb3JjZSkge31cblxuICAvKipcbiAgICogVGVybWluYXRlIHRoZSBuZXR3b3JrIGNvbm5lY3Rpb25cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Db25uZWN0aW9uI1xuICAgKi9cbiAgZGlzY29ubmVjdCgpIHt9XG5cbiAgLyoqXG4gICAqIFNlbmQgYSBzdHJpbmcgdG8gdGhlIHNlcnZlci5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Db25uZWN0aW9uI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbXNnIC0gU3RyaW5nIHRvIHNlbmQuXG4gICAqIEB0aHJvd3MgVGhyb3dzIGFuIGV4Y2VwdGlvbiBpZiB0aGUgdW5kZXJseWluZyBjb25uZWN0aW9uIGlzIG5vdCBsaXZlLlxuICAgKi9cbiAgc2VuZFRleHQobXNnKSB7fVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBjb25uZWN0aW9uIGlzIGFsaXZlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNvbm5lY3Rpb24jXG4gICAqIEByZXR1cm5zIHtib29sZWFufSA8Y29kZT50cnVlPC9jb2RlPiBpZiBjb25uZWN0aW9uIGlzIGxpdmUsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBpc0Nvbm5lY3RlZCgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBuYW1lIG9mIHRoZSBjdXJyZW50IG5ldHdvcmsgdHJhbnNwb3J0LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNvbm5lY3Rpb24jXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IG5hbWUgb2YgdGhlIHRyYW5zcG9ydCBzdWNoIGFzIDxjb2RlPlwid3NcIjwvY29kZT4gb3IgPGNvZGU+XCJscFwiPC9jb2RlPi5cbiAgICovXG4gIHRyYW5zcG9ydCgpIHtcbiAgICByZXR1cm4gdGhpcy5pbml0aWFsaXplZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kIG5ldHdvcmsgcHJvYmUgdG8gY2hlY2sgaWYgY29ubmVjdGlvbiBpcyBpbmRlZWQgbGl2ZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Db25uZWN0aW9uI1xuICAgKi9cbiAgcHJvYmUoKSB7XG4gICAgdGhpcy5zZW5kVGV4dCgnMScpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0IGF1dG9yZWNvbm5lY3QgY291bnRlciB0byB6ZXJvLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNvbm5lY3Rpb24jXG4gICAqL1xuICBiYWNrb2ZmUmVzZXQoKSB7XG4gICAgdGhpcy4jYm9mZlJlc2V0KCk7XG4gIH1cblxuICAvLyBCYWNrb2ZmIGltcGxlbWVudGF0aW9uIC0gcmVjb25uZWN0IGFmdGVyIGEgdGltZW91dC5cbiAgI2JvZmZSZWNvbm5lY3QoKSB7XG4gICAgLy8gQ2xlYXIgdGltZXJcbiAgICBjbGVhclRpbWVvdXQodGhpcy4jYm9mZlRpbWVyKTtcbiAgICAvLyBDYWxjdWxhdGUgd2hlbiB0byBmaXJlIHRoZSByZWNvbm5lY3QgYXR0ZW1wdFxuICAgIGNvbnN0IHRpbWVvdXQgPSBfQk9GRl9CQVNFICogKE1hdGgucG93KDIsIHRoaXMuI2JvZmZJdGVyYXRpb24pICogKDEuMCArIF9CT0ZGX0pJVFRFUiAqIE1hdGgucmFuZG9tKCkpKTtcbiAgICAvLyBVcGRhdGUgaXRlcmF0aW9uIGNvdW50ZXIgZm9yIGZ1dHVyZSB1c2VcbiAgICB0aGlzLiNib2ZmSXRlcmF0aW9uID0gKHRoaXMuI2JvZmZJdGVyYXRpb24gPj0gX0JPRkZfTUFYX0lURVIgPyB0aGlzLiNib2ZmSXRlcmF0aW9uIDogdGhpcy4jYm9mZkl0ZXJhdGlvbiArIDEpO1xuICAgIGlmICh0aGlzLm9uQXV0b3JlY29ubmVjdEl0ZXJhdGlvbikge1xuICAgICAgdGhpcy5vbkF1dG9yZWNvbm5lY3RJdGVyYXRpb24odGltZW91dCk7XG4gICAgfVxuXG4gICAgdGhpcy4jYm9mZlRpbWVyID0gc2V0VGltZW91dChfID0+IHtcbiAgICAgIENvbm5lY3Rpb24uI2xvZyhgUmVjb25uZWN0aW5nLCBpdGVyPSR7dGhpcy4jYm9mZkl0ZXJhdGlvbn0sIHRpbWVvdXQ9JHt0aW1lb3V0fWApO1xuICAgICAgLy8gTWF5YmUgdGhlIHNvY2tldCB3YXMgY2xvc2VkIHdoaWxlIHdlIHdhaXRlZCBmb3IgdGhlIHRpbWVyP1xuICAgICAgaWYgKCF0aGlzLiNib2ZmQ2xvc2VkKSB7XG4gICAgICAgIGNvbnN0IHByb20gPSB0aGlzLmNvbm5lY3QoKTtcbiAgICAgICAgaWYgKHRoaXMub25BdXRvcmVjb25uZWN0SXRlcmF0aW9uKSB7XG4gICAgICAgICAgdGhpcy5vbkF1dG9yZWNvbm5lY3RJdGVyYXRpb24oMCwgcHJvbSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gU3VwcHJlc3MgZXJyb3IgaWYgaXQncyBub3QgdXNlZC5cbiAgICAgICAgICBwcm9tLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgIC8qIGRvIG5vdGhpbmcgKi9cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0aGlzLm9uQXV0b3JlY29ubmVjdEl0ZXJhdGlvbikge1xuICAgICAgICB0aGlzLm9uQXV0b3JlY29ubmVjdEl0ZXJhdGlvbigtMSk7XG4gICAgICB9XG4gICAgfSwgdGltZW91dCk7XG4gIH1cblxuICAvLyBUZXJtaW5hdGUgYXV0by1yZWNvbm5lY3QgcHJvY2Vzcy5cbiAgI2JvZmZTdG9wKCkge1xuICAgIGNsZWFyVGltZW91dCh0aGlzLiNib2ZmVGltZXIpO1xuICAgIHRoaXMuI2JvZmZUaW1lciA9IG51bGw7XG4gIH1cblxuICAvLyBSZXNldCBhdXRvLXJlY29ubmVjdCBpdGVyYXRpb24gY291bnRlci5cbiAgI2JvZmZSZXNldCgpIHtcbiAgICB0aGlzLiNib2ZmSXRlcmF0aW9uID0gMDtcbiAgfVxuXG4gIC8vIEluaXRpYWxpemF0aW9uIGZvciBsb25nIHBvbGxpbmcuXG4gICNpbml0X2xwKCkge1xuICAgIGNvbnN0IFhEUl9VTlNFTlQgPSAwOyAvLyBDbGllbnQgaGFzIGJlZW4gY3JlYXRlZC4gb3BlbigpIG5vdCBjYWxsZWQgeWV0LlxuICAgIGNvbnN0IFhEUl9PUEVORUQgPSAxOyAvLyBvcGVuKCkgaGFzIGJlZW4gY2FsbGVkLlxuICAgIGNvbnN0IFhEUl9IRUFERVJTX1JFQ0VJVkVEID0gMjsgLy8gc2VuZCgpIGhhcyBiZWVuIGNhbGxlZCwgYW5kIGhlYWRlcnMgYW5kIHN0YXR1cyBhcmUgYXZhaWxhYmxlLlxuICAgIGNvbnN0IFhEUl9MT0FESU5HID0gMzsgLy8gRG93bmxvYWRpbmc7IHJlc3BvbnNlVGV4dCBob2xkcyBwYXJ0aWFsIGRhdGEuXG4gICAgY29uc3QgWERSX0RPTkUgPSA0OyAvLyBUaGUgb3BlcmF0aW9uIGlzIGNvbXBsZXRlLlxuXG4gICAgLy8gRnVsbHkgY29tcG9zZWQgZW5kcG9pbnQgVVJMLCB3aXRoIEFQSSBrZXkgJiBTSURcbiAgICBsZXQgX2xwVVJMID0gbnVsbDtcblxuICAgIGxldCBfcG9sbGVyID0gbnVsbDtcbiAgICBsZXQgX3NlbmRlciA9IG51bGw7XG5cbiAgICBsZXQgbHBfc2VuZGVyID0gKHVybF8pID0+IHtcbiAgICAgIGNvbnN0IHNlbmRlciA9IG5ldyBYSFJQcm92aWRlcigpO1xuICAgICAgc2VuZGVyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IChldnQpID0+IHtcbiAgICAgICAgaWYgKHNlbmRlci5yZWFkeVN0YXRlID09IFhEUl9ET05FICYmIHNlbmRlci5zdGF0dXMgPj0gNDAwKSB7XG4gICAgICAgICAgLy8gU29tZSBzb3J0IG9mIGVycm9yIHJlc3BvbnNlXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBMUCBzZW5kZXIgZmFpbGVkLCAke3NlbmRlci5zdGF0dXN9YCk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHNlbmRlci5vcGVuKCdQT1NUJywgdXJsXywgdHJ1ZSk7XG4gICAgICByZXR1cm4gc2VuZGVyO1xuICAgIH1cblxuICAgIGxldCBscF9wb2xsZXIgPSAodXJsXywgcmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBsZXQgcG9sbGVyID0gbmV3IFhIUlByb3ZpZGVyKCk7XG4gICAgICBsZXQgcHJvbWlzZUNvbXBsZXRlZCA9IGZhbHNlO1xuXG4gICAgICBwb2xsZXIub25yZWFkeXN0YXRlY2hhbmdlID0gKGV2dCkgPT4ge1xuICAgICAgICBpZiAocG9sbGVyLnJlYWR5U3RhdGUgPT0gWERSX0RPTkUpIHtcbiAgICAgICAgICBpZiAocG9sbGVyLnN0YXR1cyA9PSAyMDEpIHsgLy8gMjAxID09IEhUVFAuQ3JlYXRlZCwgZ2V0IFNJRFxuICAgICAgICAgICAgbGV0IHBrdCA9IEpTT04ucGFyc2UocG9sbGVyLnJlc3BvbnNlVGV4dCwganNvblBhcnNlSGVscGVyKTtcbiAgICAgICAgICAgIF9scFVSTCA9IHVybF8gKyAnJnNpZD0nICsgcGt0LmN0cmwucGFyYW1zLnNpZDtcbiAgICAgICAgICAgIHBvbGxlciA9IGxwX3BvbGxlcihfbHBVUkwpO1xuICAgICAgICAgICAgcG9sbGVyLnNlbmQobnVsbCk7XG4gICAgICAgICAgICBpZiAodGhpcy5vbk9wZW4pIHtcbiAgICAgICAgICAgICAgdGhpcy5vbk9wZW4oKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHJlc29sdmUpIHtcbiAgICAgICAgICAgICAgcHJvbWlzZUNvbXBsZXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuYXV0b3JlY29ubmVjdCkge1xuICAgICAgICAgICAgICB0aGlzLiNib2ZmU3RvcCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAocG9sbGVyLnN0YXR1cyA8IDQwMCkgeyAvLyA0MDAgPSBIVFRQLkJhZFJlcXVlc3RcbiAgICAgICAgICAgIGlmICh0aGlzLm9uTWVzc2FnZSkge1xuICAgICAgICAgICAgICB0aGlzLm9uTWVzc2FnZShwb2xsZXIucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBvbGxlciA9IGxwX3BvbGxlcihfbHBVUkwpO1xuICAgICAgICAgICAgcG9sbGVyLnNlbmQobnVsbCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIERvbid0IHRocm93IGFuIGVycm9yIGhlcmUsIGdyYWNlZnVsbHkgaGFuZGxlIHNlcnZlciBlcnJvcnNcbiAgICAgICAgICAgIGlmIChyZWplY3QgJiYgIXByb21pc2VDb21wbGV0ZWQpIHtcbiAgICAgICAgICAgICAgcHJvbWlzZUNvbXBsZXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgIHJlamVjdChwb2xsZXIucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLm9uTWVzc2FnZSAmJiBwb2xsZXIucmVzcG9uc2VUZXh0KSB7XG4gICAgICAgICAgICAgIHRoaXMub25NZXNzYWdlKHBvbGxlci5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMub25EaXNjb25uZWN0KSB7XG4gICAgICAgICAgICAgIGNvbnN0IGNvZGUgPSBwb2xsZXIuc3RhdHVzIHx8ICh0aGlzLiNib2ZmQ2xvc2VkID8gTkVUV09SS19VU0VSIDogTkVUV09SS19FUlJPUik7XG4gICAgICAgICAgICAgIGNvbnN0IHRleHQgPSBwb2xsZXIucmVzcG9uc2VUZXh0IHx8ICh0aGlzLiNib2ZmQ2xvc2VkID8gTkVUV09SS19VU0VSX1RFWFQgOiBORVRXT1JLX0VSUk9SX1RFWFQpO1xuICAgICAgICAgICAgICB0aGlzLm9uRGlzY29ubmVjdChuZXcgRXJyb3IodGV4dCArICcgKCcgKyBjb2RlICsgJyknKSwgY29kZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFBvbGxpbmcgaGFzIHN0b3BwZWQuIEluZGljYXRlIGl0IGJ5IHNldHRpbmcgcG9sbGVyIHRvIG51bGwuXG4gICAgICAgICAgICBwb2xsZXIgPSBudWxsO1xuICAgICAgICAgICAgaWYgKCF0aGlzLiNib2ZmQ2xvc2VkICYmIHRoaXMuYXV0b3JlY29ubmVjdCkge1xuICAgICAgICAgICAgICB0aGlzLiNib2ZmUmVjb25uZWN0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgLy8gVXNpbmcgUE9TVCB0byBhdm9pZCBjYWNoaW5nIHJlc3BvbnNlIGJ5IHNlcnZpY2Ugd29ya2VyLlxuICAgICAgcG9sbGVyLm9wZW4oJ1BPU1QnLCB1cmxfLCB0cnVlKTtcbiAgICAgIHJldHVybiBwb2xsZXI7XG4gICAgfVxuXG4gICAgdGhpcy5jb25uZWN0ID0gKGhvc3RfLCBmb3JjZSkgPT4ge1xuICAgICAgdGhpcy4jYm9mZkNsb3NlZCA9IGZhbHNlO1xuXG4gICAgICBpZiAoX3BvbGxlcikge1xuICAgICAgICBpZiAoIWZvcmNlKSB7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICB9XG4gICAgICAgIF9wb2xsZXIub25yZWFkeXN0YXRlY2hhbmdlID0gdW5kZWZpbmVkO1xuICAgICAgICBfcG9sbGVyLmFib3J0KCk7XG4gICAgICAgIF9wb2xsZXIgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICBpZiAoaG9zdF8pIHtcbiAgICAgICAgdGhpcy5ob3N0ID0gaG9zdF87XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGNvbnN0IHVybCA9IG1ha2VCYXNlVXJsKHRoaXMuaG9zdCwgdGhpcy5zZWN1cmUgPyAnaHR0cHMnIDogJ2h0dHAnLCB0aGlzLnZlcnNpb24sIHRoaXMuYXBpS2V5KTtcbiAgICAgICAgQ29ubmVjdGlvbi4jbG9nKFwiTFAgY29ubmVjdGluZyB0bzpcIiwgdXJsKTtcbiAgICAgICAgX3BvbGxlciA9IGxwX3BvbGxlcih1cmwsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgIF9wb2xsZXIuc2VuZChudWxsKTtcbiAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgQ29ubmVjdGlvbi4jbG9nKFwiTFAgY29ubmVjdGlvbiBmYWlsZWQ6XCIsIGVycik7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgdGhpcy5yZWNvbm5lY3QgPSAoZm9yY2UpID0+IHtcbiAgICAgIHRoaXMuI2JvZmZTdG9wKCk7XG4gICAgICB0aGlzLmNvbm5lY3QobnVsbCwgZm9yY2UpO1xuICAgIH07XG5cbiAgICB0aGlzLmRpc2Nvbm5lY3QgPSAoKSA9PiB7XG4gICAgICB0aGlzLiNib2ZmQ2xvc2VkID0gdHJ1ZTtcbiAgICAgIHRoaXMuI2JvZmZTdG9wKCk7XG5cbiAgICAgIGlmIChfc2VuZGVyKSB7XG4gICAgICAgIF9zZW5kZXIub25yZWFkeXN0YXRlY2hhbmdlID0gdW5kZWZpbmVkO1xuICAgICAgICBfc2VuZGVyLmFib3J0KCk7XG4gICAgICAgIF9zZW5kZXIgPSBudWxsO1xuICAgICAgfVxuICAgICAgaWYgKF9wb2xsZXIpIHtcbiAgICAgICAgX3BvbGxlci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSB1bmRlZmluZWQ7XG4gICAgICAgIF9wb2xsZXIuYWJvcnQoKTtcbiAgICAgICAgX3BvbGxlciA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLm9uRGlzY29ubmVjdCkge1xuICAgICAgICB0aGlzLm9uRGlzY29ubmVjdChuZXcgRXJyb3IoTkVUV09SS19VU0VSX1RFWFQgKyAnICgnICsgTkVUV09SS19VU0VSICsgJyknKSwgTkVUV09SS19VU0VSKTtcbiAgICAgIH1cbiAgICAgIC8vIEVuc3VyZSBpdCdzIHJlY29uc3RydWN0ZWRcbiAgICAgIF9scFVSTCA9IG51bGw7XG4gICAgfTtcblxuICAgIHRoaXMuc2VuZFRleHQgPSAobXNnKSA9PiB7XG4gICAgICBfc2VuZGVyID0gbHBfc2VuZGVyKF9scFVSTCk7XG4gICAgICBpZiAoX3NlbmRlciAmJiAoX3NlbmRlci5yZWFkeVN0YXRlID09IFhEUl9PUEVORUQpKSB7IC8vIDEgPT0gT1BFTkVEXG4gICAgICAgIF9zZW5kZXIuc2VuZChtc2cpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTG9uZyBwb2xsZXIgZmFpbGVkIHRvIGNvbm5lY3RcIik7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRoaXMuaXNDb25uZWN0ZWQgPSAoKSA9PiB7XG4gICAgICByZXR1cm4gKF9wb2xsZXIgJiYgdHJ1ZSk7XG4gICAgfTtcbiAgfVxuXG4gIC8vIEluaXRpYWxpemF0aW9uIGZvciBXZWJzb2NrZXRcbiAgI2luaXRfd3MoKSB7XG4gICAgdGhpcy5jb25uZWN0ID0gKGhvc3RfLCBmb3JjZSkgPT4ge1xuICAgICAgdGhpcy4jYm9mZkNsb3NlZCA9IGZhbHNlO1xuXG4gICAgICBpZiAodGhpcy4jc29ja2V0KSB7XG4gICAgICAgIGlmICghZm9yY2UgJiYgdGhpcy4jc29ja2V0LnJlYWR5U3RhdGUgPT0gdGhpcy4jc29ja2V0Lk9QRU4pIHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy4jc29ja2V0LmNsb3NlKCk7XG4gICAgICAgIHRoaXMuI3NvY2tldCA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIGlmIChob3N0Xykge1xuICAgICAgICB0aGlzLmhvc3QgPSBob3N0XztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgY29uc3QgdXJsID0gbWFrZUJhc2VVcmwodGhpcy5ob3N0LCB0aGlzLnNlY3VyZSA/ICd3c3MnIDogJ3dzJywgdGhpcy52ZXJzaW9uLCB0aGlzLmFwaUtleSk7XG5cbiAgICAgICAgQ29ubmVjdGlvbi4jbG9nKFwiV1MgY29ubmVjdGluZyB0bzogXCIsIHVybCk7XG5cbiAgICAgICAgLy8gSXQgdGhyb3dzIHdoZW4gdGhlIHNlcnZlciBpcyBub3QgYWNjZXNzaWJsZSBidXQgdGhlIGV4Y2VwdGlvbiBjYW5ub3QgYmUgY2F1Z2h0OlxuICAgICAgICAvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8zMTAwMjU5Mi9qYXZhc2NyaXB0LWRvZXNudC1jYXRjaC1lcnJvci1pbi13ZWJzb2NrZXQtaW5zdGFudGlhdGlvbi8zMTAwMzA1N1xuICAgICAgICBjb25zdCBjb25uID0gbmV3IFdlYlNvY2tldFByb3ZpZGVyKHVybCk7XG5cbiAgICAgICAgY29ubi5vbmVycm9yID0gKGVycikgPT4ge1xuICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbm4ub25vcGVuID0gKGV2dCkgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLmF1dG9yZWNvbm5lY3QpIHtcbiAgICAgICAgICAgIHRoaXMuI2JvZmZTdG9wKCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHRoaXMub25PcGVuKSB7XG4gICAgICAgICAgICB0aGlzLm9uT3BlbigpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICBjb25uLm9uY2xvc2UgPSAoZXZ0KSA9PiB7XG4gICAgICAgICAgdGhpcy4jc29ja2V0ID0gbnVsbDtcblxuICAgICAgICAgIGlmICh0aGlzLm9uRGlzY29ubmVjdCkge1xuICAgICAgICAgICAgY29uc3QgY29kZSA9IHRoaXMuI2JvZmZDbG9zZWQgPyBORVRXT1JLX1VTRVIgOiBORVRXT1JLX0VSUk9SO1xuICAgICAgICAgICAgdGhpcy5vbkRpc2Nvbm5lY3QobmV3IEVycm9yKHRoaXMuI2JvZmZDbG9zZWQgPyBORVRXT1JLX1VTRVJfVEVYVCA6IE5FVFdPUktfRVJST1JfVEVYVCArXG4gICAgICAgICAgICAgICcgKCcgKyBjb2RlICsgJyknKSwgY29kZSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKCF0aGlzLiNib2ZmQ2xvc2VkICYmIHRoaXMuYXV0b3JlY29ubmVjdCkge1xuICAgICAgICAgICAgdGhpcy4jYm9mZlJlY29ubmVjdCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBjb25uLm9ubWVzc2FnZSA9IChldnQpID0+IHtcbiAgICAgICAgICBpZiAodGhpcy5vbk1lc3NhZ2UpIHtcbiAgICAgICAgICAgIHRoaXMub25NZXNzYWdlKGV2dC5kYXRhKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy4jc29ja2V0ID0gY29ubjtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMucmVjb25uZWN0ID0gKGZvcmNlKSA9PiB7XG4gICAgICB0aGlzLiNib2ZmU3RvcCgpO1xuICAgICAgdGhpcy5jb25uZWN0KG51bGwsIGZvcmNlKTtcbiAgICB9O1xuXG4gICAgdGhpcy5kaXNjb25uZWN0ID0gKCkgPT4ge1xuICAgICAgdGhpcy4jYm9mZkNsb3NlZCA9IHRydWU7XG4gICAgICB0aGlzLiNib2ZmU3RvcCgpO1xuXG4gICAgICBpZiAoIXRoaXMuI3NvY2tldCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0aGlzLiNzb2NrZXQuY2xvc2UoKTtcbiAgICAgIHRoaXMuI3NvY2tldCA9IG51bGw7XG4gICAgfTtcblxuICAgIHRoaXMuc2VuZFRleHQgPSAobXNnKSA9PiB7XG4gICAgICBpZiAodGhpcy4jc29ja2V0ICYmICh0aGlzLiNzb2NrZXQucmVhZHlTdGF0ZSA9PSB0aGlzLiNzb2NrZXQuT1BFTikpIHtcbiAgICAgICAgdGhpcy4jc29ja2V0LnNlbmQobXNnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIldlYnNvY2tldCBpcyBub3QgY29ubmVjdGVkXCIpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLmlzQ29ubmVjdGVkID0gKCkgPT4ge1xuICAgICAgcmV0dXJuICh0aGlzLiNzb2NrZXQgJiYgKHRoaXMuI3NvY2tldC5yZWFkeVN0YXRlID09IHRoaXMuI3NvY2tldC5PUEVOKSk7XG4gICAgfTtcbiAgfVxuXG4gIC8vIENhbGxiYWNrczpcblxuICAvKipcbiAgICogQSBjYWxsYmFjayB0byBwYXNzIGluY29taW5nIG1lc3NhZ2VzIHRvLiBTZWUge0BsaW5rIFRpbm9kZS5Db25uZWN0aW9uI29uTWVzc2FnZX0uXG4gICAqIEBjYWxsYmFjayBUaW5vZGUuQ29ubmVjdGlvbi5Pbk1lc3NhZ2VcbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Db25uZWN0aW9uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlIC0gTWVzc2FnZSB0byBwcm9jZXNzLlxuICAgKi9cbiAgb25NZXNzYWdlID0gdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBBIGNhbGxiYWNrIGZvciByZXBvcnRpbmcgYSBkcm9wcGVkIGNvbm5lY3Rpb24uXG4gICAqIEB0eXBlIHtmdW5jdGlvbn1cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Db25uZWN0aW9uI1xuICAgKi9cbiAgb25EaXNjb25uZWN0ID0gdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBBIGNhbGxiYWNrIGNhbGxlZCB3aGVuIHRoZSBjb25uZWN0aW9uIGlzIHJlYWR5IHRvIGJlIHVzZWQgZm9yIHNlbmRpbmcuIEZvciB3ZWJzb2NrZXRzIGl0J3Mgc29ja2V0IG9wZW4sXG4gICAqIGZvciBsb25nIHBvbGxpbmcgaXQncyA8Y29kZT5yZWFkeVN0YXRlPTE8L2NvZGU+IChPUEVORUQpXG4gICAqIEB0eXBlIHtmdW5jdGlvbn1cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Db25uZWN0aW9uI1xuICAgKi9cbiAgb25PcGVuID0gdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBBIGNhbGxiYWNrIHRvIG5vdGlmeSBvZiByZWNvbm5lY3Rpb24gYXR0ZW1wdHMuIFNlZSB7QGxpbmsgVGlub2RlLkNvbm5lY3Rpb24jb25BdXRvcmVjb25uZWN0SXRlcmF0aW9ufS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Db25uZWN0aW9uXG4gICAqIEBjYWxsYmFjayBBdXRvcmVjb25uZWN0SXRlcmF0aW9uVHlwZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGltZW91dCAtIHRpbWUgdGlsbCB0aGUgbmV4dCByZWNvbm5lY3QgYXR0ZW1wdCBpbiBtaWxsaXNlY29uZHMuIDxjb2RlPi0xPC9jb2RlPiBtZWFucyByZWNvbm5lY3Qgd2FzIHNraXBwZWQuXG4gICAqIEBwYXJhbSB7UHJvbWlzZX0gcHJvbWlzZSByZXNvbHZlZCBvciByZWplY3RlZCB3aGVuIHRoZSByZWNvbm5lY3QgYXR0ZW1wIGNvbXBsZXRlcy5cbiAgICpcbiAgICovXG4gIC8qKlxuICAgKiBBIGNhbGxiYWNrIHRvIGluZm9ybSB3aGVuIHRoZSBuZXh0IGF0dGFtcHQgdG8gcmVjb25uZWN0IHdpbGwgaGFwcGVuIGFuZCB0byByZWNlaXZlIGNvbm5lY3Rpb24gcHJvbWlzZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Db25uZWN0aW9uI1xuICAgKiBAdHlwZSB7VGlub2RlLkNvbm5lY3Rpb24uQXV0b3JlY29ubmVjdEl0ZXJhdGlvblR5cGV9XG4gICAqL1xuICBvbkF1dG9yZWNvbm5lY3RJdGVyYXRpb24gPSB1bmRlZmluZWQ7XG59XG5cbkNvbm5lY3Rpb24uTkVUV09SS19FUlJPUiA9IE5FVFdPUktfRVJST1I7XG5Db25uZWN0aW9uLk5FVFdPUktfRVJST1JfVEVYVCA9IE5FVFdPUktfRVJST1JfVEVYVDtcbkNvbm5lY3Rpb24uTkVUV09SS19VU0VSID0gTkVUV09SS19VU0VSO1xuQ29ubmVjdGlvbi5ORVRXT1JLX1VTRVJfVEVYVCA9IE5FVFdPUktfVVNFUl9URVhUO1xuIiwiLyoqXG4gKiBAZmlsZSBIZWxwZXIgbWV0aG9kcyBmb3IgZGVhbGluZyB3aXRoIEluZGV4ZWREQiBjYWNoZSBvZiBtZXNzYWdlcywgdXNlcnMsIGFuZCB0b3BpY3MuXG4gKlxuICogQGNvcHlyaWdodCAyMDE1LTIwMjIgVGlub2RlIExMQy5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG4vLyBOT1RFIFRPIERFVkVMT1BFUlM6XG4vLyBMb2NhbGl6YWJsZSBzdHJpbmdzIHNob3VsZCBiZSBkb3VibGUgcXVvdGVkIFwi0YHRgtGA0L7QutCwINC90LAg0LTRgNGD0LPQvtC8INGP0LfRi9C60LVcIixcbi8vIG5vbi1sb2NhbGl6YWJsZSBzdHJpbmdzIHNob3VsZCBiZSBzaW5nbGUgcXVvdGVkICdub24tbG9jYWxpemVkJy5cblxuY29uc3QgREJfVkVSU0lPTiA9IDE7XG5jb25zdCBEQl9OQU1FID0gJ3Rpbm9kZS13ZWInO1xuXG5sZXQgSURCUHJvdmlkZXI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERCIHtcbiAgI29uRXJyb3IgPSBfID0+IHt9O1xuICAjbG9nZ2VyID0gXyA9PiB7fTtcblxuICAvLyBJbnN0YW5jZSBvZiBJbmRleERCLlxuICBkYiA9IG51bGw7XG4gIC8vIEluZGljYXRvciB0aGF0IHRoZSBjYWNoZSBpcyBkaXNhYmxlZC5cbiAgZGlzYWJsZWQgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihvbkVycm9yLCBsb2dnZXIpIHtcbiAgICB0aGlzLiNvbkVycm9yID0gb25FcnJvciB8fCB0aGlzLiNvbkVycm9yO1xuICAgIHRoaXMuI2xvZ2dlciA9IGxvZ2dlciB8fCB0aGlzLiNsb2dnZXI7XG4gIH1cblxuICAjbWFwT2JqZWN0cyhzb3VyY2UsIGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgaWYgKCF0aGlzLmRiKSB7XG4gICAgICByZXR1cm4gZGlzYWJsZWQgP1xuICAgICAgICBQcm9taXNlLnJlc29sdmUoW10pIDpcbiAgICAgICAgUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwibm90IGluaXRpYWxpemVkXCIpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgdHJ4ID0gdGhpcy5kYi50cmFuc2FjdGlvbihbc291cmNlXSk7XG4gICAgICB0cngub25lcnJvciA9IChldmVudCkgPT4ge1xuICAgICAgICB0aGlzLiNsb2dnZXIoJ1BDYWNoZScsICdtYXBPYmplY3RzJywgc291cmNlLCBldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgICByZWplY3QoZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgIH07XG4gICAgICB0cngub2JqZWN0U3RvcmUoc291cmNlKS5nZXRBbGwoKS5vbnN1Y2Nlc3MgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgZXZlbnQudGFyZ2V0LnJlc3VsdC5mb3JFYWNoKCh0b3BpYykgPT4ge1xuICAgICAgICAgICAgY2FsbGJhY2suY2FsbChjb250ZXh0LCB0b3BpYyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmVzb2x2ZShldmVudC50YXJnZXQucmVzdWx0KTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSBwZXJzaXN0ZW50IGNhY2hlOiBvcGVuIG9yIGNyZWF0ZS91cGdyYWRlIGlmIG5lZWRlZC5cbiAgICogQHJldHVybnMge1Byb21pc2V9IHByb21pc2UgdG8gYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgREIgaXMgaW5pdGlhbGl6ZWQuXG4gICAqL1xuICBpbml0RGF0YWJhc2UoKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIC8vIE9wZW4gdGhlIGRhdGFiYXNlIGFuZCBpbml0aWFsaXplIGNhbGxiYWNrcy5cbiAgICAgIGNvbnN0IHJlcSA9IElEQlByb3ZpZGVyLm9wZW4oREJfTkFNRSwgREJfVkVSU0lPTik7XG4gICAgICByZXEub25zdWNjZXNzID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuZGIgPSBldmVudC50YXJnZXQucmVzdWx0O1xuICAgICAgICB0aGlzLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIHJlc29sdmUodGhpcy5kYik7XG4gICAgICB9O1xuICAgICAgcmVxLm9uZXJyb3IgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy4jbG9nZ2VyKCdQQ2FjaGUnLCBcImZhaWxlZCB0byBpbml0aWFsaXplXCIsIGV2ZW50KTtcbiAgICAgICAgcmVqZWN0KGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICAgIHRoaXMuI29uRXJyb3IoZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgIH07XG4gICAgICByZXEub251cGdyYWRlbmVlZGVkID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgdGhpcy5kYiA9IGV2ZW50LnRhcmdldC5yZXN1bHQ7XG5cbiAgICAgICAgdGhpcy5kYi5vbmVycm9yID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICB0aGlzLiNsb2dnZXIoJ1BDYWNoZScsIFwiZmFpbGVkIHRvIGNyZWF0ZSBzdG9yYWdlXCIsIGV2ZW50KTtcbiAgICAgICAgICB0aGlzLiNvbkVycm9yKGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gSW5kaXZpZHVhbCBvYmplY3Qgc3RvcmVzLlxuICAgICAgICAvLyBPYmplY3Qgc3RvcmUgKHRhYmxlKSBmb3IgdG9waWNzLiBUaGUgcHJpbWFyeSBrZXkgaXMgdG9waWMgbmFtZS5cbiAgICAgICAgdGhpcy5kYi5jcmVhdGVPYmplY3RTdG9yZSgndG9waWMnLCB7XG4gICAgICAgICAga2V5UGF0aDogJ25hbWUnXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFVzZXJzIG9iamVjdCBzdG9yZS4gVUlEIGlzIHRoZSBwcmltYXJ5IGtleS5cbiAgICAgICAgdGhpcy5kYi5jcmVhdGVPYmplY3RTdG9yZSgndXNlcicsIHtcbiAgICAgICAgICBrZXlQYXRoOiAndWlkJ1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBTdWJzY3JpcHRpb25zIG9iamVjdCBzdG9yZSB0b3BpYyA8LT4gdXNlci4gVG9waWMgbmFtZSArIFVJRCBpcyB0aGUgcHJpbWFyeSBrZXkuXG4gICAgICAgIHRoaXMuZGIuY3JlYXRlT2JqZWN0U3RvcmUoJ3N1YnNjcmlwdGlvbicsIHtcbiAgICAgICAgICBrZXlQYXRoOiBbJ3RvcGljJywgJ3VpZCddXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIE1lc3NhZ2VzIG9iamVjdCBzdG9yZS4gVGhlIHByaW1hcnkga2V5IGlzIHRvcGljIG5hbWUgKyBzZXEuXG4gICAgICAgIHRoaXMuZGIuY3JlYXRlT2JqZWN0U3RvcmUoJ21lc3NhZ2UnLCB7XG4gICAgICAgICAga2V5UGF0aDogWyd0b3BpYycsICdzZXEnXVxuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogRGVsZXRlIHBlcnNpc3RlbnQgY2FjaGUuXG4gICAqL1xuICBkZWxldGVEYXRhYmFzZSgpIHtcbiAgICAvLyBDbG9zZSBjb25uZWN0aW9uLCBvdGhlcndpc2Ugb3BlcmF0aW9ucyB3aWxsIGZhaWwgd2l0aCAnb25ibG9ja2VkJy5cbiAgICBpZiAodGhpcy5kYikge1xuICAgICAgdGhpcy5kYi5jbG9zZSgpO1xuICAgICAgdGhpcy5kYiA9IG51bGw7XG4gICAgfVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCByZXEgPSBJREJQcm92aWRlci5kZWxldGVEYXRhYmFzZShEQl9OQU1FKTtcbiAgICAgIHJlcS5vbmJsb2NrZWQgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBpZiAodGhpcy5kYikge1xuICAgICAgICAgIHRoaXMuZGIuY2xvc2UoKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBlcnIgPSBuZXcgRXJyb3IoXCJibG9ja2VkXCIpO1xuICAgICAgICB0aGlzLiNsb2dnZXIoJ1BDYWNoZScsICdkZWxldGVEYXRhYmFzZScsIGVycik7XG4gICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgfTtcbiAgICAgIHJlcS5vbnN1Y2Nlc3MgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy5kYiA9IG51bGw7XG4gICAgICAgIHRoaXMuZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICByZXNvbHZlKHRydWUpO1xuICAgICAgfTtcbiAgICAgIHJlcS5vbmVycm9yID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuI2xvZ2dlcignUENhY2hlJywgJ2RlbGV0ZURhdGFiYXNlJywgZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgICAgcmVqZWN0KGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHBlcnNpc3RlbnQgY2FjaGUgaXMgcmVhZHkgZm9yIHVzZS5cbiAgICogQG1lbWJlck9mIERCXG4gICAqIEByZXR1cm5zIHtib29sZWFufSA8Y29kZT50cnVlPC9jb2RlPiBpZiBjYWNoZSBpcyByZWFkeSwgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIGlzUmVhZHkoKSB7XG4gICAgcmV0dXJuICEhdGhpcy5kYjtcbiAgfVxuXG4gIC8vIFRvcGljcy5cblxuICAvKipcbiAgICogU2F2ZSB0byBjYWNoZSBvciB1cGRhdGUgdG9waWMgaW4gcGVyc2lzdGVudCBjYWNoZS5cbiAgICogQG1lbWJlck9mIERCXG4gICAqIEBwYXJhbSB7VG9waWN9IHRvcGljIC0gdG9waWMgdG8gYmUgYWRkZWQgb3IgdXBkYXRlZC5cbiAgICogQHJldHVybnMge1Byb21pc2V9IHByb21pc2UgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gb3BlcmF0aW9uIGNvbXBsZXRpb24uXG4gICAqL1xuICB1cGRUb3BpYyh0b3BpYykge1xuICAgIGlmICghdGhpcy5pc1JlYWR5KCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmRpc2FibGVkID9cbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkgOlxuICAgICAgICBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJub3QgaW5pdGlhbGl6ZWRcIikpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgdHJ4ID0gdGhpcy5kYi50cmFuc2FjdGlvbihbJ3RvcGljJ10sICdyZWFkd3JpdGUnKTtcbiAgICAgIHRyeC5vbmNvbXBsZXRlID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHJlc29sdmUoZXZlbnQudGFyZ2V0LnJlc3VsdCk7XG4gICAgICB9O1xuICAgICAgdHJ4Lm9uZXJyb3IgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy4jbG9nZ2VyKCdQQ2FjaGUnLCAndXBkVG9waWMnLCBldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgICByZWplY3QoZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgIH07XG4gICAgICBjb25zdCByZXEgPSB0cngub2JqZWN0U3RvcmUoJ3RvcGljJykuZ2V0KHRvcGljLm5hbWUpO1xuICAgICAgcmVxLm9uc3VjY2VzcyA9IChldmVudCkgPT4ge1xuICAgICAgICB0cngub2JqZWN0U3RvcmUoJ3RvcGljJykucHV0KERCLiNzZXJpYWxpemVUb3BpYyhyZXEucmVzdWx0LCB0b3BpYykpO1xuICAgICAgICB0cnguY29tbWl0KCk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hcmsgb3IgdW5tYXJrIHRvcGljIGFzIGRlbGV0ZWQuXG4gICAqIEBtZW1iZXJPZiBEQlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIG5hbWUgb2YgdGhlIHRvcGljIHRvIG1hcmsgb3IgdW5tYXJrLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBwcm9taXNlIHJlc29sdmVkL3JlamVjdGVkIG9uIG9wZXJhdGlvbiBjb21wbGV0aW9uLlxuICAgKi9cbiAgbWFya1RvcGljQXNEZWxldGVkKG5hbWUpIHtcbiAgICBpZiAoIXRoaXMuaXNSZWFkeSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5kaXNhYmxlZCA/XG4gICAgICAgIFByb21pc2UucmVzb2x2ZSgpIDpcbiAgICAgICAgUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwibm90IGluaXRpYWxpemVkXCIpKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IHRyeCA9IHRoaXMuZGIudHJhbnNhY3Rpb24oWyd0b3BpYyddLCAncmVhZHdyaXRlJyk7XG4gICAgICB0cngub25jb21wbGV0ZSA9IChldmVudCkgPT4ge1xuICAgICAgICByZXNvbHZlKGV2ZW50LnRhcmdldC5yZXN1bHQpO1xuICAgICAgfTtcbiAgICAgIHRyeC5vbmVycm9yID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuI2xvZ2dlcignUENhY2hlJywgJ21hcmtUb3BpY0FzRGVsZXRlZCcsIGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICAgIHJlamVjdChldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgfTtcbiAgICAgIGNvbnN0IHJlcSA9IHRyeC5vYmplY3RTdG9yZSgndG9waWMnKS5nZXQobmFtZSk7XG4gICAgICByZXEub25zdWNjZXNzID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIGNvbnN0IHRvcGljID0gZXZlbnQudGFyZ2V0LnJlc3VsdDtcbiAgICAgICAgdG9waWMuX2RlbGV0ZWQgPSB0cnVlO1xuICAgICAgICB0cngub2JqZWN0U3RvcmUoJ3RvcGljJykucHV0KHRvcGljKTtcbiAgICAgICAgdHJ4LmNvbW1pdCgpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgdG9waWMgZnJvbSBwZXJzaXN0ZW50IGNhY2hlLlxuICAgKiBAbWVtYmVyT2YgREJcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBuYW1lIG9mIHRoZSB0b3BpYyB0byByZW1vdmUgZnJvbSBkYXRhYmFzZS5cbiAgICogQHJldHVybiB7UHJvbWlzZX0gcHJvbWlzZSByZXNvbHZlZC9yZWplY3RlZCBvbiBvcGVyYXRpb24gY29tcGxldGlvbi5cbiAgICovXG4gIHJlbVRvcGljKG5hbWUpIHtcbiAgICBpZiAoIXRoaXMuaXNSZWFkeSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5kaXNhYmxlZCA/XG4gICAgICAgIFByb21pc2UucmVzb2x2ZSgpIDpcbiAgICAgICAgUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwibm90IGluaXRpYWxpemVkXCIpKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IHRyeCA9IHRoaXMuZGIudHJhbnNhY3Rpb24oWyd0b3BpYycsICdzdWJzY3JpcHRpb24nLCAnbWVzc2FnZSddLCAncmVhZHdyaXRlJyk7XG4gICAgICB0cngub25jb21wbGV0ZSA9IChldmVudCkgPT4ge1xuICAgICAgICByZXNvbHZlKGV2ZW50LnRhcmdldC5yZXN1bHQpO1xuICAgICAgfTtcbiAgICAgIHRyeC5vbmVycm9yID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuI2xvZ2dlcignUENhY2hlJywgJ3JlbVRvcGljJywgZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgICAgcmVqZWN0KGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICB9O1xuICAgICAgdHJ4Lm9iamVjdFN0b3JlKCd0b3BpYycpLmRlbGV0ZShJREJLZXlSYW5nZS5vbmx5KG5hbWUpKTtcbiAgICAgIHRyeC5vYmplY3RTdG9yZSgnc3Vic2NyaXB0aW9uJykuZGVsZXRlKElEQktleVJhbmdlLmJvdW5kKFtuYW1lLCAnLSddLCBbbmFtZSwgJ34nXSkpO1xuICAgICAgdHJ4Lm9iamVjdFN0b3JlKCdtZXNzYWdlJykuZGVsZXRlKElEQktleVJhbmdlLmJvdW5kKFtuYW1lLCAwXSwgW25hbWUsIE51bWJlci5NQVhfU0FGRV9JTlRFR0VSXSkpO1xuICAgICAgdHJ4LmNvbW1pdCgpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4ZWN1dGUgYSBjYWxsYmFjayBmb3IgZWFjaCBzdG9yZWQgdG9waWMuXG4gICAqIEBtZW1iZXJPZiBEQlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayAtIGZ1bmN0aW9uIHRvIGNhbGwgZm9yIGVhY2ggdG9waWMuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZXh0IC0gdGhlIHZhbHVlIG9yIDxjb2RlPnRoaXM8L2NvZGU+IGluc2lkZSB0aGUgY2FsbGJhY2suXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IHByb21pc2UgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gb3BlcmF0aW9uIGNvbXBsZXRpb24uXG4gICAqL1xuICBtYXBUb3BpY3MoY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICByZXR1cm4gdGhpcy4jbWFwT2JqZWN0cygndG9waWMnLCBjYWxsYmFjaywgY29udGV4dCk7XG4gIH1cblxuICAvKipcbiAgICogQ29weSBkYXRhIGZyb20gc2VyaWFsaXplZCBvYmplY3QgdG8gdG9waWMuXG4gICAqIEBtZW1iZXJPZiBEQlxuICAgKiBAcGFyYW0ge1RvcGljfSB0b3BpYyAtIHRhcmdldCB0byBkZXNlcmlhbGl6ZSB0by5cbiAgICogQHBhcmFtIHtPYmplY3R9IHNyYyAtIHNlcmlhbGl6ZWQgZGF0YSB0byBjb3B5IGZyb20uXG4gICAqL1xuICBkZXNlcmlhbGl6ZVRvcGljKHRvcGljLCBzcmMpIHtcbiAgICBEQi4jZGVzZXJpYWxpemVUb3BpYyh0b3BpYywgc3JjKTtcbiAgfVxuXG4gIC8vIFVzZXJzLlxuICAvKipcbiAgICogQWRkIG9yIHVwZGF0ZSB1c2VyIG9iamVjdCBpbiB0aGUgcGVyc2lzdGVudCBjYWNoZS5cbiAgICogQG1lbWJlck9mIERCXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1aWQgLSBJRCBvZiB0aGUgdXNlciB0byBzYXZlIG9yIHVwZGF0ZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IHB1YiAtIHVzZXIncyA8Y29kZT5wdWJsaWM8L2NvZGU+IGluZm9ybWF0aW9uLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gcHJvbWlzZSByZXNvbHZlZC9yZWplY3RlZCBvbiBvcGVyYXRpb24gY29tcGxldGlvbi5cbiAgICovXG4gIHVwZFVzZXIodWlkLCBwdWIpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIgfHwgcHViID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIE5vIHBvaW50IGludXBkYXRpbmcgdXNlciB3aXRoIGludmFsaWQgZGF0YS5cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCF0aGlzLmlzUmVhZHkoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZGlzYWJsZWQgP1xuICAgICAgICBQcm9taXNlLnJlc29sdmUoKSA6XG4gICAgICAgIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIm5vdCBpbml0aWFsaXplZFwiKSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCB0cnggPSB0aGlzLmRiLnRyYW5zYWN0aW9uKFsndXNlciddLCAncmVhZHdyaXRlJyk7XG4gICAgICB0cngub25jb21wbGV0ZSA9IChldmVudCkgPT4ge1xuICAgICAgICByZXNvbHZlKGV2ZW50LnRhcmdldC5yZXN1bHQpO1xuICAgICAgfTtcbiAgICAgIHRyeC5vbmVycm9yID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuI2xvZ2dlcignUENhY2hlJywgJ3VwZFVzZXInLCBldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgICByZWplY3QoZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgIH07XG4gICAgICB0cngub2JqZWN0U3RvcmUoJ3VzZXInKS5wdXQoe1xuICAgICAgICB1aWQ6IHVpZCxcbiAgICAgICAgcHVibGljOiBwdWJcbiAgICAgIH0pO1xuICAgICAgdHJ4LmNvbW1pdCgpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSB1c2VyIGZyb20gcGVyc2lzdGVudCBjYWNoZS5cbiAgICogQG1lbWJlck9mIERCXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1aWQgLSBJRCBvZiB0aGUgdXNlciB0byByZW1vdmUgZnJvbSB0aGUgY2FjaGUuXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IHByb21pc2UgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gb3BlcmF0aW9uIGNvbXBsZXRpb24uXG4gICAqL1xuICByZW1Vc2VyKHVpZCkge1xuICAgIGlmICghdGhpcy5pc1JlYWR5KCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmRpc2FibGVkID9cbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkgOlxuICAgICAgICBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJub3QgaW5pdGlhbGl6ZWRcIikpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgdHJ4ID0gdGhpcy5kYi50cmFuc2FjdGlvbihbJ3VzZXInXSwgJ3JlYWR3cml0ZScpO1xuICAgICAgdHJ4Lm9uY29tcGxldGUgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgcmVzb2x2ZShldmVudC50YXJnZXQucmVzdWx0KTtcbiAgICAgIH07XG4gICAgICB0cngub25lcnJvciA9IChldmVudCkgPT4ge1xuICAgICAgICB0aGlzLiNsb2dnZXIoJ1BDYWNoZScsICdyZW1Vc2VyJywgZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgICAgcmVqZWN0KGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICB9O1xuICAgICAgdHJ4Lm9iamVjdFN0b3JlKCd1c2VyJykuZGVsZXRlKElEQktleVJhbmdlLm9ubHkodWlkKSk7XG4gICAgICB0cnguY29tbWl0KCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogRXhlY3V0ZSBhIGNhbGxiYWNrIGZvciBlYWNoIHN0b3JlZCB1c2VyLlxuICAgKiBAbWVtYmVyT2YgREJcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgLSBmdW5jdGlvbiB0byBjYWxsIGZvciBlYWNoIHRvcGljLlxuICAgKiBAcGFyYW0ge09iamVjdH0gY29udGV4dCAtIHRoZSB2YWx1ZSBvciA8Y29kZT50aGlzPC9jb2RlPiBpbnNpZGUgdGhlIGNhbGxiYWNrLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBwcm9taXNlIHJlc29sdmVkL3JlamVjdGVkIG9uIG9wZXJhdGlvbiBjb21wbGV0aW9uLlxuICAgKi9cbiAgbWFwVXNlcnMoY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICByZXR1cm4gdGhpcy4jbWFwT2JqZWN0cygndXNlcicsIGNhbGxiYWNrLCBjb250ZXh0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWFkIGEgc2luZ2xlIHVzZXIgZnJvbSBwZXJzaXN0ZW50IGNhY2hlLlxuICAgKiBAbWVtYmVyT2YgREJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVpZCAtIElEIG9mIHRoZSB1c2VyIHRvIGZldGNoIGZyb20gY2FjaGUuXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IHByb21pc2UgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gb3BlcmF0aW9uIGNvbXBsZXRpb24uXG4gICAqL1xuICBnZXRVc2VyKHVpZCkge1xuICAgIGlmICghdGhpcy5pc1JlYWR5KCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmRpc2FibGVkID9cbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkgOlxuICAgICAgICBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJub3QgaW5pdGlhbGl6ZWRcIikpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgdHJ4ID0gdGhpcy5kYi50cmFuc2FjdGlvbihbJ3VzZXInXSk7XG4gICAgICB0cngub25jb21wbGV0ZSA9IChldmVudCkgPT4ge1xuICAgICAgICBjb25zdCB1c2VyID0gZXZlbnQudGFyZ2V0LnJlc3VsdDtcbiAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgdXNlcjogdXNlci51aWQsXG4gICAgICAgICAgcHVibGljOiB1c2VyLnB1YmxpY1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgICB0cngub25lcnJvciA9IChldmVudCkgPT4ge1xuICAgICAgICB0aGlzLiNsb2dnZXIoJ1BDYWNoZScsICdnZXRVc2VyJywgZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgICAgcmVqZWN0KGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICB9O1xuICAgICAgdHJ4Lm9iamVjdFN0b3JlKCd1c2VyJykuZ2V0KHVpZCk7XG4gICAgfSk7XG4gIH1cblxuICAvLyBTdWJzY3JpcHRpb25zLlxuICAvKipcbiAgICogQWRkIG9yIHVwZGF0ZSBzdWJzY3JpcHRpb24gaW4gcGVyc2lzdGVudCBjYWNoZS5cbiAgICogQG1lbWJlck9mIERCXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpY05hbWUgLSBuYW1lIG9mIHRoZSB0b3BpYyB3aGljaCBvd25zIHRoZSBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdWlkIC0gSUQgb2YgdGhlIHN1YnNjcmliZWQgdXNlci5cbiAgICogQHBhcmFtIHtPYmplY3R9IHN1YiAtIHN1YnNjcmlwdGlvbiB0byBzYXZlLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBwcm9taXNlIHJlc29sdmVkL3JlamVjdGVkIG9uIG9wZXJhdGlvbiBjb21wbGV0aW9uLlxuICAgKi9cbiAgdXBkU3Vic2NyaXB0aW9uKHRvcGljTmFtZSwgdWlkLCBzdWIpIHtcbiAgICBpZiAoIXRoaXMuaXNSZWFkeSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5kaXNhYmxlZCA/XG4gICAgICAgIFByb21pc2UucmVzb2x2ZSgpIDpcbiAgICAgICAgUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwibm90IGluaXRpYWxpemVkXCIpKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IHRyeCA9IHRoaXMuZGIudHJhbnNhY3Rpb24oWydzdWJzY3JpcHRpb24nXSwgJ3JlYWR3cml0ZScpO1xuICAgICAgdHJ4Lm9uY29tcGxldGUgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgcmVzb2x2ZShldmVudC50YXJnZXQucmVzdWx0KTtcbiAgICAgIH07XG4gICAgICB0cngub25lcnJvciA9IChldmVudCkgPT4ge1xuICAgICAgICB0aGlzLiNsb2dnZXIoJ1BDYWNoZScsICd1cGRTdWJzY3JpcHRpb24nLCBldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgICByZWplY3QoZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgIH07XG4gICAgICB0cngub2JqZWN0U3RvcmUoJ3N1YnNjcmlwdGlvbicpLmdldChbdG9waWNOYW1lLCB1aWRdKS5vbnN1Y2Nlc3MgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgdHJ4Lm9iamVjdFN0b3JlKCdzdWJzY3JpcHRpb24nKS5wdXQoREIuI3NlcmlhbGl6ZVN1YnNjcmlwdGlvbihldmVudC50YXJnZXQucmVzdWx0LCB0b3BpY05hbWUsIHVpZCwgc3ViKSk7XG4gICAgICAgIHRyeC5jb21taXQoKTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogRXhlY3V0ZSBhIGNhbGxiYWNrIGZvciBlYWNoIGNhY2hlZCBzdWJzY3JpcHRpb24gaW4gYSBnaXZlbiB0b3BpYy5cbiAgICogQG1lbWJlck9mIERCXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpY05hbWUgLSBuYW1lIG9mIHRoZSB0b3BpYyB3aGljaCBvd25zIHRoZSBzdWJzY3JpcHRpb25zLlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayAtIGZ1bmN0aW9uIHRvIGNhbGwgZm9yIGVhY2ggc3Vic2NyaXB0aW9uLlxuICAgKiBAcGFyYW0ge09iamVjdH0gY29udGV4dCAtIHRoZSB2YWx1ZSBvciA8Y29kZT50aGlzPC9jb2RlPiBpbnNpZGUgdGhlIGNhbGxiYWNrLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBwcm9taXNlIHJlc29sdmVkL3JlamVjdGVkIG9uIG9wZXJhdGlvbiBjb21wbGV0aW9uLlxuICAgKi9cbiAgbWFwU3Vic2NyaXB0aW9ucyh0b3BpY05hbWUsIGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgaWYgKCF0aGlzLmlzUmVhZHkoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZGlzYWJsZWQgP1xuICAgICAgICBQcm9taXNlLnJlc29sdmUoW10pIDpcbiAgICAgICAgUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwibm90IGluaXRpYWxpemVkXCIpKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IHRyeCA9IHRoaXMuZGIudHJhbnNhY3Rpb24oWydzdWJzY3JpcHRpb24nXSk7XG4gICAgICB0cngub25lcnJvciA9IChldmVudCkgPT4ge1xuICAgICAgICB0aGlzLiNsb2dnZXIoJ1BDYWNoZScsICdtYXBTdWJzY3JpcHRpb25zJywgZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgICAgcmVqZWN0KGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICB9O1xuICAgICAgdHJ4Lm9iamVjdFN0b3JlKCdzdWJzY3JpcHRpb24nKS5nZXRBbGwoSURCS2V5UmFuZ2UuYm91bmQoW3RvcGljTmFtZSwgJy0nXSwgW3RvcGljTmFtZSwgJ34nXSkpLm9uc3VjY2VzcyA9IChldmVudCkgPT4ge1xuICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICBldmVudC50YXJnZXQucmVzdWx0LmZvckVhY2goKHRvcGljKSA9PiB7XG4gICAgICAgICAgICBjYWxsYmFjay5jYWxsKGNvbnRleHQsIHRvcGljKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXNvbHZlKGV2ZW50LnRhcmdldC5yZXN1bHQpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIE1lc3NhZ2VzLlxuXG4gIC8qKlxuICAgKiBTYXZlIG1lc3NhZ2UgdG8gcGVyc2lzdGVudCBjYWNoZS5cbiAgICogQG1lbWJlck9mIERCXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpY05hbWUgLSBuYW1lIG9mIHRoZSB0b3BpYyB3aGljaCBvd25zIHRoZSBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gbXNnIC0gbWVzc2FnZSB0byBzYXZlLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBwcm9taXNlIHJlc29sdmVkL3JlamVjdGVkIG9uIG9wZXJhdGlvbiBjb21wbGV0aW9uLlxuICAgKi9cbiAgYWRkTWVzc2FnZShtc2cpIHtcbiAgICBpZiAoIXRoaXMuaXNSZWFkeSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5kaXNhYmxlZCA/XG4gICAgICAgIFByb21pc2UucmVzb2x2ZSgpIDpcbiAgICAgICAgUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwibm90IGluaXRpYWxpemVkXCIpKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IHRyeCA9IHRoaXMuZGIudHJhbnNhY3Rpb24oWydtZXNzYWdlJ10sICdyZWFkd3JpdGUnKTtcbiAgICAgIHRyeC5vbnN1Y2Nlc3MgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgcmVzb2x2ZShldmVudC50YXJnZXQucmVzdWx0KTtcbiAgICAgIH07XG4gICAgICB0cngub25lcnJvciA9IChldmVudCkgPT4ge1xuICAgICAgICB0aGlzLiNsb2dnZXIoJ1BDYWNoZScsICdhZGRNZXNzYWdlJywgZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgICAgcmVqZWN0KGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICB9O1xuICAgICAgdHJ4Lm9iamVjdFN0b3JlKCdtZXNzYWdlJykuYWRkKERCLiNzZXJpYWxpemVNZXNzYWdlKG51bGwsIG1zZykpO1xuICAgICAgdHJ4LmNvbW1pdCgpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSBkZWxpdmVyeSBzdGF0dXMgb2YgYSBtZXNzYWdlIHN0b3JlZCBpbiBwZXJzaXN0ZW50IGNhY2hlLlxuICAgKiBAbWVtYmVyT2YgREJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljTmFtZSAtIG5hbWUgb2YgdGhlIHRvcGljIHdoaWNoIG93bnMgdGhlIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzZXEgLSBJRCBvZiB0aGUgbWVzc2FnZSB0byB1cGRhdGVcbiAgICogQHBhcmFtIHtudW1iZXJ9IHN0YXR1cyAtIG5ldyBkZWxpdmVyeSBzdGF0dXMgb2YgdGhlIG1lc3NhZ2UuXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IHByb21pc2UgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gb3BlcmF0aW9uIGNvbXBsZXRpb24uXG4gICAqL1xuICB1cGRNZXNzYWdlU3RhdHVzKHRvcGljTmFtZSwgc2VxLCBzdGF0dXMpIHtcbiAgICBpZiAoIXRoaXMuaXNSZWFkeSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5kaXNhYmxlZCA/XG4gICAgICAgIFByb21pc2UucmVzb2x2ZSgpIDpcbiAgICAgICAgUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwibm90IGluaXRpYWxpemVkXCIpKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IHRyeCA9IHRoaXMuZGIudHJhbnNhY3Rpb24oWydtZXNzYWdlJ10sICdyZWFkd3JpdGUnKTtcbiAgICAgIHRyeC5vbnN1Y2Nlc3MgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgcmVzb2x2ZShldmVudC50YXJnZXQucmVzdWx0KTtcbiAgICAgIH07XG4gICAgICB0cngub25lcnJvciA9IChldmVudCkgPT4ge1xuICAgICAgICB0aGlzLiNsb2dnZXIoJ1BDYWNoZScsICd1cGRNZXNzYWdlU3RhdHVzJywgZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgICAgcmVqZWN0KGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICB9O1xuICAgICAgY29uc3QgcmVxID0gdHJ4Lm9iamVjdFN0b3JlKCdtZXNzYWdlJykuZ2V0KElEQktleVJhbmdlLm9ubHkoW3RvcGljTmFtZSwgc2VxXSkpO1xuICAgICAgcmVxLm9uc3VjY2VzcyA9IChldmVudCkgPT4ge1xuICAgICAgICBjb25zdCBzcmMgPSByZXEucmVzdWx0IHx8IGV2ZW50LnRhcmdldC5yZXN1bHQ7XG4gICAgICAgIGlmICghc3JjIHx8IHNyYy5fc3RhdHVzID09IHN0YXR1cykge1xuICAgICAgICAgIHRyeC5jb21taXQoKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdHJ4Lm9iamVjdFN0b3JlKCdtZXNzYWdlJykucHV0KERCLiNzZXJpYWxpemVNZXNzYWdlKHNyYywge1xuICAgICAgICAgIHRvcGljOiB0b3BpY05hbWUsXG4gICAgICAgICAgc2VxOiBzZXEsXG4gICAgICAgICAgX3N0YXR1czogc3RhdHVzXG4gICAgICAgIH0pKTtcbiAgICAgICAgdHJ4LmNvbW1pdCgpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgb25lIG9yIG1vcmUgbWVzc2FnZXMgZnJvbSBwZXJzaXN0ZW50IGNhY2hlLlxuICAgKiBAbWVtYmVyT2YgREJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljTmFtZSAtIG5hbWUgb2YgdGhlIHRvcGljIHdoaWNoIG93bnMgdGhlIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBmcm9tIC0gaWQgb2YgdGhlIG1lc3NhZ2UgdG8gcmVtb3ZlIG9yIGxvd2VyIGJvdW5kYXJ5IHdoZW4gcmVtb3ZpbmcgcmFuZ2UgKGluY2x1c2l2ZSkuXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gdG8gLSB1cHBlciBib3VuZGFyeSAoZXhjbHVzaXZlKSB3aGVuIHJlbW92aW5nIGEgcmFuZ2Ugb2YgbWVzc2FnZXMuXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IHByb21pc2UgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gb3BlcmF0aW9uIGNvbXBsZXRpb24uXG4gICAqL1xuICByZW1NZXNzYWdlcyh0b3BpY05hbWUsIGZyb20sIHRvKSB7XG4gICAgaWYgKCF0aGlzLmlzUmVhZHkoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZGlzYWJsZWQgP1xuICAgICAgICBQcm9taXNlLnJlc29sdmUoKSA6XG4gICAgICAgIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIm5vdCBpbml0aWFsaXplZFwiKSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBpZiAoIWZyb20gJiYgIXRvKSB7XG4gICAgICAgIGZyb20gPSAwO1xuICAgICAgICB0byA9IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSO1xuICAgICAgfVxuICAgICAgY29uc3QgcmFuZ2UgPSB0byA+IDAgPyBJREJLZXlSYW5nZS5ib3VuZChbdG9waWNOYW1lLCBmcm9tXSwgW3RvcGljTmFtZSwgdG9dLCBmYWxzZSwgdHJ1ZSkgOlxuICAgICAgICBJREJLZXlSYW5nZS5vbmx5KFt0b3BpY05hbWUsIGZyb21dKTtcbiAgICAgIGNvbnN0IHRyeCA9IHRoaXMuZGIudHJhbnNhY3Rpb24oWydtZXNzYWdlJ10sICdyZWFkd3JpdGUnKTtcbiAgICAgIHRyeC5vbnN1Y2Nlc3MgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgcmVzb2x2ZShldmVudC50YXJnZXQucmVzdWx0KTtcbiAgICAgIH07XG4gICAgICB0cngub25lcnJvciA9IChldmVudCkgPT4ge1xuICAgICAgICB0aGlzLiNsb2dnZXIoJ1BDYWNoZScsICdyZW1NZXNzYWdlcycsIGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICAgIHJlamVjdChldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgfTtcbiAgICAgIHRyeC5vYmplY3RTdG9yZSgnbWVzc2FnZScpLmRlbGV0ZShyYW5nZSk7XG4gICAgICB0cnguY29tbWl0KCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmUgbWVzc2FnZXMgZnJvbSBwZXJzaXN0ZW50IHN0b3JlLlxuICAgKiBAbWVtYmVyT2YgREJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljTmFtZSAtIG5hbWUgb2YgdGhlIHRvcGljIHRvIHJldHJpZXZlIG1lc3NhZ2VzIGZyb20uXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIHRvIGNhbGwgZm9yIGVhY2ggcmV0cmlldmVkIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBxdWVyeSAtIHBhcmFtZXRlcnMgb2YgdGhlIG1lc3NhZ2UgcmFuZ2UgdG8gcmV0cmlldmUuXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gcXVlcnkuc2luY2UgLSB0aGUgbGVhc3QgbWVzc2FnZSBJRCB0byByZXRyaWV2ZSAoaW5jbHVzaXZlKS5cbiAgICogQHBhcmFtIHtudW1iZXI9fSBxdWVyeS5iZWZvcmUgLSB0aGUgZ3JlYXRlc3QgbWVzc2FnZSBJRCB0byByZXRyaWV2ZSAoZXhjbHVzaXZlKS5cbiAgICogQHBhcmFtIHtudW1iZXI9fSBxdWVyeS5saW1pdCAtIHRoZSBtYXhpbXVtIG51bWJlciBvZiBtZXNzYWdlcyB0byByZXRyaWV2ZS5cbiAgICogQHJldHVybiB7UHJvbWlzZX0gcHJvbWlzZSByZXNvbHZlZC9yZWplY3RlZCBvbiBvcGVyYXRpb24gY29tcGxldGlvbi5cbiAgICovXG4gIHJlYWRNZXNzYWdlcyh0b3BpY05hbWUsIHF1ZXJ5LCBjYWxsYmFjaywgY29udGV4dCkge1xuICAgIGlmICghdGhpcy5pc1JlYWR5KCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmRpc2FibGVkID9cbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKFtdKSA6XG4gICAgICAgIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIm5vdCBpbml0aWFsaXplZFwiKSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBxdWVyeSA9IHF1ZXJ5IHx8IHt9O1xuICAgICAgY29uc3Qgc2luY2UgPSBxdWVyeS5zaW5jZSA+IDAgPyBxdWVyeS5zaW5jZSA6IDA7XG4gICAgICBjb25zdCBiZWZvcmUgPSBxdWVyeS5iZWZvcmUgPiAwID8gcXVlcnkuYmVmb3JlIDogTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XG4gICAgICBjb25zdCBsaW1pdCA9IHF1ZXJ5LmxpbWl0IHwgMDtcblxuICAgICAgY29uc3QgcmVzdWx0ID0gW107XG4gICAgICBjb25zdCByYW5nZSA9IElEQktleVJhbmdlLmJvdW5kKFt0b3BpY05hbWUsIHNpbmNlXSwgW3RvcGljTmFtZSwgYmVmb3JlXSwgZmFsc2UsIHRydWUpO1xuICAgICAgY29uc3QgdHJ4ID0gdGhpcy5kYi50cmFuc2FjdGlvbihbJ21lc3NhZ2UnXSk7XG4gICAgICB0cngub25lcnJvciA9IChldmVudCkgPT4ge1xuICAgICAgICB0aGlzLiNsb2dnZXIoJ1BDYWNoZScsICdyZWFkTWVzc2FnZXMnLCBldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgICByZWplY3QoZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgIH07XG4gICAgICAvLyBJdGVyYXRlIGluIGRlc2NlbmRpbmcgb3JkZXIuXG4gICAgICB0cngub2JqZWN0U3RvcmUoJ21lc3NhZ2UnKS5vcGVuQ3Vyc29yKHJhbmdlLCAncHJldicpLm9uc3VjY2VzcyA9IChldmVudCkgPT4ge1xuICAgICAgICBjb25zdCBjdXJzb3IgPSBldmVudC50YXJnZXQucmVzdWx0O1xuICAgICAgICBpZiAoY3Vyc29yKSB7XG4gICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBjYWxsYmFjay5jYWxsKGNvbnRleHQsIGN1cnNvci52YWx1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJlc3VsdC5wdXNoKGN1cnNvci52YWx1ZSk7XG4gICAgICAgICAgaWYgKGxpbWl0IDw9IDAgfHwgcmVzdWx0Lmxlbmd0aCA8IGxpbWl0KSB7XG4gICAgICAgICAgICBjdXJzb3IuY29udGludWUoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICAvLyBQcml2YXRlIG1ldGhvZHMuXG5cbiAgLy8gU2VyaWFsaXphYmxlIHRvcGljIGZpZWxkcy5cbiAgc3RhdGljICN0b3BpY19maWVsZHMgPSBbJ2NyZWF0ZWQnLCAndXBkYXRlZCcsICdkZWxldGVkJywgJ3JlYWQnLCAncmVjdicsICdzZXEnLCAnY2xlYXInLCAnZGVmYWNzJyxcbiAgICAnY3JlZHMnLCAncHVibGljJywgJ3RydXN0ZWQnLCAncHJpdmF0ZScsICd0b3VjaGVkJywgJ19kZWxldGVkJ1xuICBdO1xuXG4gIC8vIENvcHkgZGF0YSBmcm9tIHNyYyB0byBUb3BpYyBvYmplY3QuXG4gIHN0YXRpYyAjZGVzZXJpYWxpemVUb3BpYyh0b3BpYywgc3JjKSB7XG4gICAgREIuI3RvcGljX2ZpZWxkcy5mb3JFYWNoKChmKSA9PiB7XG4gICAgICBpZiAoc3JjLmhhc093blByb3BlcnR5KGYpKSB7XG4gICAgICAgIHRvcGljW2ZdID0gc3JjW2ZdO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChBcnJheS5pc0FycmF5KHNyYy50YWdzKSkge1xuICAgICAgdG9waWMuX3RhZ3MgPSBzcmMudGFncztcbiAgICB9XG4gICAgaWYgKHNyYy5hY3MpIHtcbiAgICAgIHRvcGljLnNldEFjY2Vzc01vZGUoc3JjLmFjcyk7XG4gICAgfVxuICAgIHRvcGljLnNlcSB8PSAwO1xuICAgIHRvcGljLnJlYWQgfD0gMDtcbiAgICB0b3BpYy51bnJlYWQgPSBNYXRoLm1heCgwLCB0b3BpYy5zZXEgLSB0b3BpYy5yZWFkKTtcbiAgfVxuXG4gIC8vIENvcHkgdmFsdWVzIGZyb20gJ3NyYycgdG8gJ2RzdCcuIEFsbG9jYXRlIGRzdCBpZiBpdCdzIG51bGwgb3IgdW5kZWZpbmVkLlxuICBzdGF0aWMgI3NlcmlhbGl6ZVRvcGljKGRzdCwgc3JjKSB7XG4gICAgY29uc3QgcmVzID0gZHN0IHx8IHtcbiAgICAgIG5hbWU6IHNyYy5uYW1lXG4gICAgfTtcbiAgICBEQi4jdG9waWNfZmllbGRzLmZvckVhY2goKGYpID0+IHtcbiAgICAgIGlmIChzcmMuaGFzT3duUHJvcGVydHkoZikpIHtcbiAgICAgICAgcmVzW2ZdID0gc3JjW2ZdO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChBcnJheS5pc0FycmF5KHNyYy5fdGFncykpIHtcbiAgICAgIHJlcy50YWdzID0gc3JjLl90YWdzO1xuICAgIH1cbiAgICBpZiAoc3JjLmFjcykge1xuICAgICAgcmVzLmFjcyA9IHNyYy5nZXRBY2Nlc3NNb2RlKCkuanNvbkhlbHBlcigpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzO1xuICB9XG5cbiAgc3RhdGljICNzZXJpYWxpemVTdWJzY3JpcHRpb24oZHN0LCB0b3BpY05hbWUsIHVpZCwgc3ViKSB7XG4gICAgY29uc3QgZmllbGRzID0gWyd1cGRhdGVkJywgJ21vZGUnLCAncmVhZCcsICdyZWN2JywgJ2NsZWFyJywgJ2xhc3RTZWVuJywgJ3VzZXJBZ2VudCddO1xuICAgIGNvbnN0IHJlcyA9IGRzdCB8fCB7XG4gICAgICB0b3BpYzogdG9waWNOYW1lLFxuICAgICAgdWlkOiB1aWRcbiAgICB9O1xuXG4gICAgZmllbGRzLmZvckVhY2goKGYpID0+IHtcbiAgICAgIGlmIChzdWIuaGFzT3duUHJvcGVydHkoZikpIHtcbiAgICAgICAgcmVzW2ZdID0gc3ViW2ZdO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlcztcbiAgfVxuXG4gIHN0YXRpYyAjc2VyaWFsaXplTWVzc2FnZShkc3QsIG1zZykge1xuICAgIC8vIFNlcmlhbGl6YWJsZSBmaWVsZHMuXG4gICAgY29uc3QgZmllbGRzID0gWyd0b3BpYycsICdzZXEnLCAndHMnLCAnX3N0YXR1cycsICdmcm9tJywgJ2hlYWQnLCAnY29udGVudCddO1xuICAgIGNvbnN0IHJlcyA9IGRzdCB8fCB7fTtcbiAgICBmaWVsZHMuZm9yRWFjaCgoZikgPT4ge1xuICAgICAgaWYgKG1zZy5oYXNPd25Qcm9wZXJ0eShmKSkge1xuICAgICAgICByZXNbZl0gPSBtc2dbZl07XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlcztcbiAgfVxuXG4gIC8qKlxuICAgKiBUbyB1c2UgREIgaW4gYSBub24gYnJvd3NlciBjb250ZXh0LCBzdXBwbHkgaW5kZXhlZERCIHByb3ZpZGVyLlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJvZiBEQlxuICAgKiBAcGFyYW0gaWRiUHJvdmlkZXIgaW5kZXhlZERCIHByb3ZpZGVyLCBlLmcuIGZvciBub2RlIDxjb2RlPnJlcXVpcmUoJ2Zha2UtaW5kZXhlZGRiJyk8L2NvZGU+LlxuICAgKi9cbiAgc3RhdGljIHNldERhdGFiYXNlUHJvdmlkZXIoaWRiUHJvdmlkZXIpIHtcbiAgICBJREJQcm92aWRlciA9IGlkYlByb3ZpZGVyO1xuICB9XG59XG4iLCIvKipcbiAqIEBjb3B5cmlnaHQgMjAxNS0yMDIyIFRpbm9kZSBMTEMuXG4gKiBAc3VtbWFyeSBNaW5pbWFsbHkgcmljaCB0ZXh0IHJlcHJlc2VudGF0aW9uIGFuZCBmb3JtYXR0aW5nIGZvciBUaW5vZGUuXG4gKiBAbGljZW5zZSBBcGFjaGUgMi4wXG4gKlxuICogQGZpbGUgQmFzaWMgcGFyc2VyIGFuZCBmb3JtYXR0ZXIgZm9yIHZlcnkgc2ltcGxlIHRleHQgbWFya3VwLiBNb3N0bHkgdGFyZ2V0ZWQgYXRcbiAqIG1vYmlsZSB1c2UgY2FzZXMgc2ltaWxhciB0byBUZWxlZ3JhbSwgV2hhdHNBcHAsIGFuZCBGQiBNZXNzZW5nZXIuXG4gKlxuICogPHA+U3VwcG9ydHMgY29udmVyc2lvbiBvZiB1c2VyIGtleWJvYXJkIGlucHV0IHRvIGZvcm1hdHRlZCB0ZXh0OjwvcD5cbiAqIDx1bD5cbiAqICAgPGxpPiphYmMqICZyYXJyOyA8Yj5hYmM8L2I+PC9saT5cbiAqICAgPGxpPl9hYmNfICZyYXJyOyA8aT5hYmM8L2k+PC9saT5cbiAqICAgPGxpPn5hYmN+ICZyYXJyOyA8ZGVsPmFiYzwvZGVsPjwvbGk+XG4gKiAgIDxsaT5gYWJjYCAmcmFycjsgPHR0PmFiYzwvdHQ+PC9saT5cbiAqIDwvdWw+XG4gKiBBbHNvIHN1cHBvcnRzIGZvcm1zIGFuZCBidXR0b25zLlxuICpcbiAqIE5lc3RlZCBmb3JtYXR0aW5nIGlzIHN1cHBvcnRlZCwgZS5nLiAqYWJjIF9kZWZfKiAtPiA8Yj5hYmMgPGk+ZGVmPC9pPjwvYj5cbiAqIFVSTHMsIEBtZW50aW9ucywgYW5kICNoYXNodGFncyBhcmUgZXh0cmFjdGVkIGFuZCBjb252ZXJ0ZWQgaW50byBsaW5rcy5cbiAqIEZvcm1zIGFuZCBidXR0b25zIGNhbiBiZSBhZGRlZCBwcm9jZWR1cmFsbHkuXG4gKiBKU09OIGRhdGEgcmVwcmVzZW50YXRpb24gaXMgaW5zcGlyZWQgYnkgRHJhZnQuanMgcmF3IGZvcm1hdHRpbmcuXG4gKlxuICpcbiAqIEBleGFtcGxlXG4gKiBUZXh0OlxuICogPHByZT5cbiAqICAgICB0aGlzIGlzICpib2xkKiwgYGNvZGVgIGFuZCBfaXRhbGljXywgfnN0cmlrZX5cbiAqICAgICBjb21iaW5lZCAqYm9sZCBhbmQgX2l0YWxpY18qXG4gKiAgICAgYW4gdXJsOiBodHRwczovL3d3dy5leGFtcGxlLmNvbS9hYmMjZnJhZ21lbnQgYW5kIGFub3RoZXIgX3d3dy50aW5vZGUuY29fXG4gKiAgICAgdGhpcyBpcyBhIEBtZW50aW9uIGFuZCBhICNoYXNodGFnIGluIGEgc3RyaW5nXG4gKiAgICAgc2Vjb25kICNoYXNodGFnXG4gKiA8L3ByZT5cbiAqXG4gKiAgU2FtcGxlIEpTT04gcmVwcmVzZW50YXRpb24gb2YgdGhlIHRleHQgYWJvdmU6XG4gKiAge1xuICogICAgIFwidHh0XCI6IFwidGhpcyBpcyBib2xkLCBjb2RlIGFuZCBpdGFsaWMsIHN0cmlrZSBjb21iaW5lZCBib2xkIGFuZCBpdGFsaWMgYW4gdXJsOiBodHRwczovL3d3dy5leGFtcGxlLmNvbS9hYmMjZnJhZ21lbnQgXCIgK1xuICogICAgICAgICAgICAgXCJhbmQgYW5vdGhlciB3d3cudGlub2RlLmNvIHRoaXMgaXMgYSBAbWVudGlvbiBhbmQgYSAjaGFzaHRhZyBpbiBhIHN0cmluZyBzZWNvbmQgI2hhc2h0YWdcIixcbiAqICAgICBcImZtdFwiOiBbXG4gKiAgICAgICAgIHsgXCJhdFwiOjgsIFwibGVuXCI6NCxcInRwXCI6XCJTVFwiIH0seyBcImF0XCI6MTQsIFwibGVuXCI6NCwgXCJ0cFwiOlwiQ09cIiB9LHsgXCJhdFwiOjIzLCBcImxlblwiOjYsIFwidHBcIjpcIkVNXCJ9LFxuICogICAgICAgICB7IFwiYXRcIjozMSwgXCJsZW5cIjo2LCBcInRwXCI6XCJETFwiIH0seyBcInRwXCI6XCJCUlwiLCBcImxlblwiOjEsIFwiYXRcIjozNyB9LHsgXCJhdFwiOjU2LCBcImxlblwiOjYsIFwidHBcIjpcIkVNXCIgfSxcbiAqICAgICAgICAgeyBcImF0XCI6NDcsIFwibGVuXCI6MTUsIFwidHBcIjpcIlNUXCIgfSx7IFwidHBcIjpcIkJSXCIsIFwibGVuXCI6MSwgXCJhdFwiOjYyIH0seyBcImF0XCI6MTIwLCBcImxlblwiOjEzLCBcInRwXCI6XCJFTVwiIH0sXG4gKiAgICAgICAgIHsgXCJhdFwiOjcxLCBcImxlblwiOjM2LCBcImtleVwiOjAgfSx7IFwiYXRcIjoxMjAsIFwibGVuXCI6MTMsIFwia2V5XCI6MSB9LHsgXCJ0cFwiOlwiQlJcIiwgXCJsZW5cIjoxLCBcImF0XCI6MTMzIH0sXG4gKiAgICAgICAgIHsgXCJhdFwiOjE0NCwgXCJsZW5cIjo4LCBcImtleVwiOjIgfSx7IFwiYXRcIjoxNTksIFwibGVuXCI6OCwgXCJrZXlcIjozIH0seyBcInRwXCI6XCJCUlwiLCBcImxlblwiOjEsIFwiYXRcIjoxNzkgfSxcbiAqICAgICAgICAgeyBcImF0XCI6MTg3LCBcImxlblwiOjgsIFwia2V5XCI6MyB9LHsgXCJ0cFwiOlwiQlJcIiwgXCJsZW5cIjoxLCBcImF0XCI6MTk1IH1cbiAqICAgICBdLFxuICogICAgIFwiZW50XCI6IFtcbiAqICAgICAgICAgeyBcInRwXCI6XCJMTlwiLCBcImRhdGFcIjp7IFwidXJsXCI6XCJodHRwczovL3d3dy5leGFtcGxlLmNvbS9hYmMjZnJhZ21lbnRcIiB9IH0sXG4gKiAgICAgICAgIHsgXCJ0cFwiOlwiTE5cIiwgXCJkYXRhXCI6eyBcInVybFwiOlwiaHR0cDovL3d3dy50aW5vZGUuY29cIiB9IH0sXG4gKiAgICAgICAgIHsgXCJ0cFwiOlwiTU5cIiwgXCJkYXRhXCI6eyBcInZhbFwiOlwibWVudGlvblwiIH0gfSxcbiAqICAgICAgICAgeyBcInRwXCI6XCJIVFwiLCBcImRhdGFcIjp7IFwidmFsXCI6XCJoYXNodGFnXCIgfSB9XG4gKiAgICAgXVxuICogIH1cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8vIE5PVEUgVE8gREVWRUxPUEVSUzpcbi8vIExvY2FsaXphYmxlIHN0cmluZ3Mgc2hvdWxkIGJlIGRvdWJsZSBxdW90ZWQgXCLRgdGC0YDQvtC60LAg0L3QsCDQtNGA0YPQs9C+0Lwg0Y/Qt9GL0LrQtVwiLFxuLy8gbm9uLWxvY2FsaXphYmxlIHN0cmluZ3Mgc2hvdWxkIGJlIHNpbmdsZSBxdW90ZWQgJ25vbi1sb2NhbGl6ZWQnLlxuXG5jb25zdCBNQVhfRk9STV9FTEVNRU5UUyA9IDg7XG5jb25zdCBNQVhfUFJFVklFV19BVFRBQ0hNRU5UUyA9IDM7XG5jb25zdCBNQVhfUFJFVklFV19EQVRBX1NJWkUgPSA2NDtcbmNvbnN0IEpTT05fTUlNRV9UWVBFID0gJ2FwcGxpY2F0aW9uL2pzb24nO1xuY29uc3QgRFJBRlRZX01JTUVfVFlQRSA9ICd0ZXh0L3gtZHJhZnR5JztcbmNvbnN0IEFMTE9XRURfRU5UX0ZJRUxEUyA9IFsnYWN0JywgJ2hlaWdodCcsICdkdXJhdGlvbicsICdtaW1lJywgJ25hbWUnLCAncHJldmlldycsICdyZWYnLCAnc2l6ZScsICd1cmwnLCAndmFsJywgJ3dpZHRoJ107XG5cbi8vIFJlZ3VsYXIgZXhwcmVzc2lvbnMgZm9yIHBhcnNpbmcgaW5saW5lIGZvcm1hdHMuIEphdmFzY3JpcHQgZG9lcyBub3Qgc3VwcG9ydCBsb29rYmVoaW5kLFxuLy8gc28gaXQncyBhIGJpdCBtZXNzeS5cbmNvbnN0IElOTElORV9TVFlMRVMgPSBbXG4gIC8vIFN0cm9uZyA9IGJvbGQsICpib2xkIHRleHQqXG4gIHtcbiAgICBuYW1lOiAnU1QnLFxuICAgIHN0YXJ0OiAvKD86XnxbXFxXX10pKFxcKilbXlxccypdLyxcbiAgICBlbmQ6IC9bXlxccypdKFxcKikoPz0kfFtcXFdfXSkvXG4gIH0sXG4gIC8vIEVtcGhlc2l6ZWQgPSBpdGFsaWMsIF9pdGFsaWMgdGV4dF9cbiAge1xuICAgIG5hbWU6ICdFTScsXG4gICAgc3RhcnQ6IC8oPzpefFxcVykoXylbXlxcc19dLyxcbiAgICBlbmQ6IC9bXlxcc19dKF8pKD89JHxcXFcpL1xuICB9LFxuICAvLyBEZWxldGVkLCB+c3RyaWtlIHRoaXMgdGhvdWdoflxuICB7XG4gICAgbmFtZTogJ0RMJyxcbiAgICBzdGFydDogLyg/Ol58W1xcV19dKSh+KVteXFxzfl0vLFxuICAgIGVuZDogL1teXFxzfl0ofikoPz0kfFtcXFdfXSkvXG4gIH0sXG4gIC8vIENvZGUgYmxvY2sgYHRoaXMgaXMgbW9ub3NwYWNlYFxuICB7XG4gICAgbmFtZTogJ0NPJyxcbiAgICBzdGFydDogLyg/Ol58XFxXKShgKVteYF0vLFxuICAgIGVuZDogL1teYF0oYCkoPz0kfFxcVykvXG4gIH1cbl07XG5cbi8vIFJlbGF0aXZlIHdlaWdodHMgb2YgZm9ybWF0dGluZyBzcGFucy4gR3JlYXRlciBpbmRleCBpbiBhcnJheSBtZWFucyBncmVhdGVyIHdlaWdodC5cbmNvbnN0IEZNVF9XRUlHSFQgPSBbJ1FRJ107XG5cbi8vIFJlZ0V4cHMgZm9yIGVudGl0eSBleHRyYWN0aW9uIChSRiA9IHJlZmVyZW5jZSlcbmNvbnN0IEVOVElUWV9UWVBFUyA9IFtcbiAgLy8gVVJMc1xuICB7XG4gICAgbmFtZTogJ0xOJyxcbiAgICBkYXRhTmFtZTogJ3VybCcsXG4gICAgcGFjazogZnVuY3Rpb24odmFsKSB7XG4gICAgICAvLyBDaGVjayBpZiB0aGUgcHJvdG9jb2wgaXMgc3BlY2lmaWVkLCBpZiBub3QgdXNlIGh0dHBcbiAgICAgIGlmICghL15bYS16XSs6XFwvXFwvL2kudGVzdCh2YWwpKSB7XG4gICAgICAgIHZhbCA9ICdodHRwOi8vJyArIHZhbDtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHVybDogdmFsXG4gICAgICB9O1xuICAgIH0sXG4gICAgcmU6IC8oPzooPzpodHRwcz98ZnRwKTpcXC9cXC98d3d3XFwufGZ0cFxcLilbLUEtWjAtOSsmQCNcXC8lPX5ffCQ/ITosLl0qW0EtWjAtOSsmQCNcXC8lPX5ffCRdL2lnXG4gIH0sXG4gIC8vIE1lbnRpb25zIEB1c2VyIChtdXN0IGJlIDIgb3IgbW9yZSBjaGFyYWN0ZXJzKVxuICB7XG4gICAgbmFtZTogJ01OJyxcbiAgICBkYXRhTmFtZTogJ3ZhbCcsXG4gICAgcGFjazogZnVuY3Rpb24odmFsKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB2YWw6IHZhbC5zbGljZSgxKVxuICAgICAgfTtcbiAgICB9LFxuICAgIHJlOiAvXFxCQChbXFxwe0x9XFxwe059XVsuX1xccHtMfVxccHtOfV0qW1xccHtMfVxccHtOfV0pL3VnXG4gIH0sXG4gIC8vIEhhc2h0YWdzICNoYXNodGFnLCBsaWtlIG1ldGlvbiAyIG9yIG1vcmUgY2hhcmFjdGVycy5cbiAge1xuICAgIG5hbWU6ICdIVCcsXG4gICAgZGF0YU5hbWU6ICd2YWwnLFxuICAgIHBhY2s6IGZ1bmN0aW9uKHZhbCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdmFsOiB2YWwuc2xpY2UoMSlcbiAgICAgIH07XG4gICAgfSxcbiAgICByZTogL1xcQiMoW1xccHtMfVxccHtOfV1bLl9cXHB7TH1cXHB7Tn1dKltcXHB7TH1cXHB7Tn1dKS91Z1xuICB9XG5dO1xuXG4vLyBIVE1MIHRhZyBuYW1lIHN1Z2dlc3Rpb25zXG5jb25zdCBIVE1MX1RBR1MgPSB7XG4gIEFVOiB7XG4gICAgbmFtZTogJ2F1ZGlvJyxcbiAgICBpc1ZvaWQ6IGZhbHNlXG4gIH0sXG4gIEJOOiB7XG4gICAgbmFtZTogJ2J1dHRvbicsXG4gICAgaXNWb2lkOiBmYWxzZVxuICB9LFxuICBCUjoge1xuICAgIG5hbWU6ICdicicsXG4gICAgaXNWb2lkOiB0cnVlXG4gIH0sXG4gIENPOiB7XG4gICAgbmFtZTogJ3R0JyxcbiAgICBpc1ZvaWQ6IGZhbHNlXG4gIH0sXG4gIERMOiB7XG4gICAgbmFtZTogJ2RlbCcsXG4gICAgaXNWb2lkOiBmYWxzZVxuICB9LFxuICBFTToge1xuICAgIG5hbWU6ICdpJyxcbiAgICBpc1ZvaWQ6IGZhbHNlXG4gIH0sXG4gIEVYOiB7XG4gICAgbmFtZTogJycsXG4gICAgaXNWb2lkOiB0cnVlXG4gIH0sXG4gIEZNOiB7XG4gICAgbmFtZTogJ2RpdicsXG4gICAgaXNWb2lkOiBmYWxzZVxuICB9LFxuICBIRDoge1xuICAgIG5hbWU6ICcnLFxuICAgIGlzVm9pZDogZmFsc2VcbiAgfSxcbiAgSEw6IHtcbiAgICBuYW1lOiAnc3BhbicsXG4gICAgaXNWb2lkOiBmYWxzZVxuICB9LFxuICBIVDoge1xuICAgIG5hbWU6ICdhJyxcbiAgICBpc1ZvaWQ6IGZhbHNlXG4gIH0sXG4gIElNOiB7XG4gICAgbmFtZTogJ2ltZycsXG4gICAgaXNWb2lkOiBmYWxzZVxuICB9LFxuICBMTjoge1xuICAgIG5hbWU6ICdhJyxcbiAgICBpc1ZvaWQ6IGZhbHNlXG4gIH0sXG4gIE1OOiB7XG4gICAgbmFtZTogJ2EnLFxuICAgIGlzVm9pZDogZmFsc2VcbiAgfSxcbiAgUlc6IHtcbiAgICBuYW1lOiAnZGl2JyxcbiAgICBpc1ZvaWQ6IGZhbHNlLFxuICB9LFxuICBRUToge1xuICAgIG5hbWU6ICdkaXYnLFxuICAgIGlzVm9pZDogZmFsc2VcbiAgfSxcbiAgU1Q6IHtcbiAgICBuYW1lOiAnYicsXG4gICAgaXNWb2lkOiBmYWxzZVxuICB9LFxufTtcblxuLy8gQ29udmVydCBiYXNlNjQtZW5jb2RlZCBzdHJpbmcgaW50byBCbG9iLlxuZnVuY3Rpb24gYmFzZTY0dG9PYmplY3RVcmwoYjY0LCBjb250ZW50VHlwZSwgbG9nZ2VyKSB7XG4gIGlmICghYjY0KSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICB0cnkge1xuICAgIGNvbnN0IGJpbiA9IGF0b2IoYjY0KTtcbiAgICBjb25zdCBsZW5ndGggPSBiaW4ubGVuZ3RoO1xuICAgIGNvbnN0IGJ1ZiA9IG5ldyBBcnJheUJ1ZmZlcihsZW5ndGgpO1xuICAgIGNvbnN0IGFyciA9IG5ldyBVaW50OEFycmF5KGJ1Zik7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgYXJyW2ldID0gYmluLmNoYXJDb2RlQXQoaSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFVSTC5jcmVhdGVPYmplY3RVUkwobmV3IEJsb2IoW2J1Zl0sIHtcbiAgICAgIHR5cGU6IGNvbnRlbnRUeXBlXG4gICAgfSkpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBpZiAobG9nZ2VyKSB7XG4gICAgICBsb2dnZXIoXCJEcmFmdHk6IGZhaWxlZCB0byBjb252ZXJ0IG9iamVjdC5cIiwgZXJyLm1lc3NhZ2UpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBudWxsO1xufVxuXG5mdW5jdGlvbiBiYXNlNjR0b0RhdGFVcmwoYjY0LCBjb250ZW50VHlwZSkge1xuICBpZiAoIWI2NCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIGNvbnRlbnRUeXBlID0gY29udGVudFR5cGUgfHwgJ2ltYWdlL2pwZWcnO1xuICByZXR1cm4gJ2RhdGE6JyArIGNvbnRlbnRUeXBlICsgJztiYXNlNjQsJyArIGI2NDtcbn1cblxuLy8gSGVscGVycyBmb3IgY29udmVydGluZyBEcmFmdHkgdG8gSFRNTC5cbmNvbnN0IERFQ09SQVRPUlMgPSB7XG4gIC8vIFZpc2lhbCBzdHlsZXNcbiAgU1Q6IHtcbiAgICBvcGVuOiBfID0+ICc8Yj4nLFxuICAgIGNsb3NlOiBfID0+ICc8L2I+J1xuICB9LFxuICBFTToge1xuICAgIG9wZW46IF8gPT4gJzxpPicsXG4gICAgY2xvc2U6IF8gPT4gJzwvaT4nXG4gIH0sXG4gIERMOiB7XG4gICAgb3BlbjogXyA9PiAnPGRlbD4nLFxuICAgIGNsb3NlOiBfID0+ICc8L2RlbD4nXG4gIH0sXG4gIENPOiB7XG4gICAgb3BlbjogXyA9PiAnPHR0PicsXG4gICAgY2xvc2U6IF8gPT4gJzwvdHQ+J1xuICB9LFxuICAvLyBMaW5lIGJyZWFrXG4gIEJSOiB7XG4gICAgb3BlbjogXyA9PiAnPGJyLz4nLFxuICAgIGNsb3NlOiBfID0+ICcnXG4gIH0sXG4gIC8vIEhpZGRlbiBlbGVtZW50XG4gIEhEOiB7XG4gICAgb3BlbjogXyA9PiAnJyxcbiAgICBjbG9zZTogXyA9PiAnJ1xuICB9LFxuICAvLyBIaWdobGlnaHRlZCBlbGVtZW50LlxuICBITDoge1xuICAgIG9wZW46IF8gPT4gJzxzcGFuIHN0eWxlPVwiY29sb3I6dGVhbFwiPicsXG4gICAgY2xvc2U6IF8gPT4gJzwvc3Bhbj4nXG4gIH0sXG4gIC8vIExpbmsgKFVSTClcbiAgTE46IHtcbiAgICBvcGVuOiAoZGF0YSkgPT4ge1xuICAgICAgcmV0dXJuICc8YSBocmVmPVwiJyArIGRhdGEudXJsICsgJ1wiPic7XG4gICAgfSxcbiAgICBjbG9zZTogXyA9PiAnPC9hPicsXG4gICAgcHJvcHM6IChkYXRhKSA9PiB7XG4gICAgICByZXR1cm4gZGF0YSA/IHtcbiAgICAgICAgaHJlZjogZGF0YS51cmwsXG4gICAgICAgIHRhcmdldDogJ19ibGFuaydcbiAgICAgIH0gOiBudWxsO1xuICAgIH0sXG4gIH0sXG4gIC8vIE1lbnRpb25cbiAgTU46IHtcbiAgICBvcGVuOiAoZGF0YSkgPT4ge1xuICAgICAgcmV0dXJuICc8YSBocmVmPVwiIycgKyBkYXRhLnZhbCArICdcIj4nO1xuICAgIH0sXG4gICAgY2xvc2U6IF8gPT4gJzwvYT4nLFxuICAgIHByb3BzOiAoZGF0YSkgPT4ge1xuICAgICAgcmV0dXJuIGRhdGEgPyB7XG4gICAgICAgIGlkOiBkYXRhLnZhbFxuICAgICAgfSA6IG51bGw7XG4gICAgfSxcbiAgfSxcbiAgLy8gSGFzaHRhZ1xuICBIVDoge1xuICAgIG9wZW46IChkYXRhKSA9PiB7XG4gICAgICByZXR1cm4gJzxhIGhyZWY9XCIjJyArIGRhdGEudmFsICsgJ1wiPic7XG4gICAgfSxcbiAgICBjbG9zZTogXyA9PiAnPC9hPicsXG4gICAgcHJvcHM6IChkYXRhKSA9PiB7XG4gICAgICByZXR1cm4gZGF0YSA/IHtcbiAgICAgICAgaWQ6IGRhdGEudmFsXG4gICAgICB9IDogbnVsbDtcbiAgICB9LFxuICB9LFxuICAvLyBCdXR0b25cbiAgQk46IHtcbiAgICBvcGVuOiBfID0+ICc8YnV0dG9uPicsXG4gICAgY2xvc2U6IF8gPT4gJzwvYnV0dG9uPicsXG4gICAgcHJvcHM6IChkYXRhKSA9PiB7XG4gICAgICByZXR1cm4gZGF0YSA/IHtcbiAgICAgICAgJ2RhdGEtYWN0JzogZGF0YS5hY3QsXG4gICAgICAgICdkYXRhLXZhbCc6IGRhdGEudmFsLFxuICAgICAgICAnZGF0YS1uYW1lJzogZGF0YS5uYW1lLFxuICAgICAgICAnZGF0YS1yZWYnOiBkYXRhLnJlZlxuICAgICAgfSA6IG51bGw7XG4gICAgfSxcbiAgfSxcbiAgLy8gQXVkaW8gcmVjb3JkaW5nXG4gIEFVOiB7XG4gICAgb3BlbjogKGRhdGEpID0+IHtcbiAgICAgIGNvbnN0IHVybCA9IGRhdGEucmVmIHx8IGJhc2U2NHRvT2JqZWN0VXJsKGRhdGEudmFsLCBkYXRhLm1pbWUsIERyYWZ0eS5sb2dnZXIpO1xuICAgICAgcmV0dXJuICc8YXVkaW8gY29udHJvbHMgc3JjPVwiJyArIHVybCArICdcIj4nO1xuICAgIH0sXG4gICAgY2xvc2U6IF8gPT4gJzwvYXVkaW8+JyxcbiAgICBwcm9wczogKGRhdGEpID0+IHtcbiAgICAgIGlmICghZGF0YSkgcmV0dXJuIG51bGw7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAvLyBFbWJlZGRlZCBkYXRhIG9yIGV4dGVybmFsIGxpbmsuXG4gICAgICAgIHNyYzogZGF0YS5yZWYgfHwgYmFzZTY0dG9PYmplY3RVcmwoZGF0YS52YWwsIGRhdGEubWltZSwgRHJhZnR5LmxvZ2dlciksXG4gICAgICAgICdkYXRhLXByZWxvYWQnOiBkYXRhLnJlZiA/ICdtZXRhZGF0YScgOiAnYXV0bycsXG4gICAgICAgICdkYXRhLWR1cmF0aW9uJzogZGF0YS5kdXJhdGlvbixcbiAgICAgICAgJ2RhdGEtbmFtZSc6IGRhdGEubmFtZSxcbiAgICAgICAgJ2RhdGEtc2l6ZSc6IGRhdGEudmFsID8gKChkYXRhLnZhbC5sZW5ndGggKiAwLjc1KSB8IDApIDogKGRhdGEuc2l6ZSB8IDApLFxuICAgICAgICAnZGF0YS1taW1lJzogZGF0YS5taW1lLFxuICAgICAgfTtcbiAgICB9XG4gIH0sXG4gIC8vIEltYWdlXG4gIElNOiB7XG4gICAgb3BlbjogKGRhdGEpID0+IHtcbiAgICAgIC8vIERvbid0IHVzZSBkYXRhLnJlZiBmb3IgcHJldmlldzogaXQncyBhIHNlY3VyaXR5IHJpc2suXG4gICAgICBjb25zdCB0bXBQcmV2aWV3VXJsID0gYmFzZTY0dG9EYXRhVXJsKGRhdGEuX3RlbXBQcmV2aWV3LCBkYXRhLm1pbWUpO1xuICAgICAgY29uc3QgcHJldmlld1VybCA9IGJhc2U2NHRvT2JqZWN0VXJsKGRhdGEudmFsLCBkYXRhLm1pbWUsIERyYWZ0eS5sb2dnZXIpO1xuICAgICAgY29uc3QgZG93bmxvYWRVcmwgPSBkYXRhLnJlZiB8fCBwcmV2aWV3VXJsO1xuICAgICAgcmV0dXJuIChkYXRhLm5hbWUgPyAnPGEgaHJlZj1cIicgKyBkb3dubG9hZFVybCArICdcIiBkb3dubG9hZD1cIicgKyBkYXRhLm5hbWUgKyAnXCI+JyA6ICcnKSArXG4gICAgICAgICc8aW1nIHNyYz1cIicgKyAodG1wUHJldmlld1VybCB8fCBwcmV2aWV3VXJsKSArICdcIicgK1xuICAgICAgICAoZGF0YS53aWR0aCA/ICcgd2lkdGg9XCInICsgZGF0YS53aWR0aCArICdcIicgOiAnJykgK1xuICAgICAgICAoZGF0YS5oZWlnaHQgPyAnIGhlaWdodD1cIicgKyBkYXRhLmhlaWdodCArICdcIicgOiAnJykgKyAnIGJvcmRlcj1cIjBcIiAvPic7XG4gICAgfSxcbiAgICBjbG9zZTogKGRhdGEpID0+IHtcbiAgICAgIHJldHVybiAoZGF0YS5uYW1lID8gJzwvYT4nIDogJycpO1xuICAgIH0sXG4gICAgcHJvcHM6IChkYXRhKSA9PiB7XG4gICAgICBpZiAoIWRhdGEpIHJldHVybiBudWxsO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLy8gVGVtcG9yYXJ5IHByZXZpZXcsIG9yIHBlcm1hbmVudCBwcmV2aWV3LCBvciBleHRlcm5hbCBsaW5rLlxuICAgICAgICBzcmM6IGJhc2U2NHRvRGF0YVVybChkYXRhLl90ZW1wUHJldmlldywgZGF0YS5taW1lKSB8fFxuICAgICAgICAgIGRhdGEucmVmIHx8IGJhc2U2NHRvT2JqZWN0VXJsKGRhdGEudmFsLCBkYXRhLm1pbWUsIERyYWZ0eS5sb2dnZXIpLFxuICAgICAgICB0aXRsZTogZGF0YS5uYW1lLFxuICAgICAgICBhbHQ6IGRhdGEubmFtZSxcbiAgICAgICAgJ2RhdGEtd2lkdGgnOiBkYXRhLndpZHRoLFxuICAgICAgICAnZGF0YS1oZWlnaHQnOiBkYXRhLmhlaWdodCxcbiAgICAgICAgJ2RhdGEtbmFtZSc6IGRhdGEubmFtZSxcbiAgICAgICAgJ2RhdGEtc2l6ZSc6IGRhdGEudmFsID8gKChkYXRhLnZhbC5sZW5ndGggKiAwLjc1KSB8IDApIDogKGRhdGEuc2l6ZSB8IDApLFxuICAgICAgICAnZGF0YS1taW1lJzogZGF0YS5taW1lLFxuICAgICAgfTtcbiAgICB9LFxuICB9LFxuICAvLyBGb3JtIC0gc3RydWN0dXJlZCBsYXlvdXQgb2YgZWxlbWVudHMuXG4gIEZNOiB7XG4gICAgb3BlbjogXyA9PiAnPGRpdj4nLFxuICAgIGNsb3NlOiBfID0+ICc8L2Rpdj4nXG4gIH0sXG4gIC8vIFJvdzogbG9naWMgZ3JvdXBpbmcgb2YgZWxlbWVudHNcbiAgUlc6IHtcbiAgICBvcGVuOiBfID0+ICc8ZGl2PicsXG4gICAgY2xvc2U6IF8gPT4gJzwvZGl2PidcbiAgfSxcbiAgLy8gUXVvdGVkIGJsb2NrLlxuICBRUToge1xuICAgIG9wZW46IF8gPT4gJzxkaXY+JyxcbiAgICBjbG9zZTogXyA9PiAnPC9kaXY+JyxcbiAgICBwcm9wczogKGRhdGEpID0+IHtcbiAgICAgIHJldHVybiBkYXRhID8ge30gOiBudWxsO1xuICAgIH0sXG4gIH1cbn07XG5cbi8qKlxuICogVGhlIG1haW4gb2JqZWN0IHdoaWNoIHBlcmZvcm1zIGFsbCB0aGUgZm9ybWF0dGluZyBhY3Rpb25zLlxuICogQGNsYXNzIERyYWZ0eVxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmNvbnN0IERyYWZ0eSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnR4dCA9ICcnO1xuICB0aGlzLmZtdCA9IFtdO1xuICB0aGlzLmVudCA9IFtdO1xufVxuXG4vKipcbiAqIEluaXRpYWxpemUgRHJhZnR5IGRvY3VtZW50IHRvIGEgcGxhaW4gdGV4dCBzdHJpbmcuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHBsYWluVGV4dCAtIHN0cmluZyB0byB1c2UgYXMgRHJhZnR5IGNvbnRlbnQuXG4gKlxuICogQHJldHVybnMgbmV3IERyYWZ0eSBkb2N1bWVudCBvciBudWxsIGlzIHBsYWluVGV4dCBpcyBub3QgYSBzdHJpbmcgb3IgdW5kZWZpbmVkLlxuICovXG5EcmFmdHkuaW5pdCA9IGZ1bmN0aW9uKHBsYWluVGV4dCkge1xuICBpZiAodHlwZW9mIHBsYWluVGV4dCA9PSAndW5kZWZpbmVkJykge1xuICAgIHBsYWluVGV4dCA9ICcnO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBwbGFpblRleHQgIT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgdHh0OiBwbGFpblRleHRcbiAgfTtcbn1cblxuLyoqXG4gKiBQYXJzZSBwbGFpbiB0ZXh0IGludG8gRHJhZnR5IGRvY3VtZW50LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBjb250ZW50IC0gcGxhaW4tdGV4dCBjb250ZW50IHRvIHBhcnNlLlxuICogQHJldHVybiB7RHJhZnR5fSBwYXJzZWQgZG9jdW1lbnQgb3IgbnVsbCBpZiB0aGUgc291cmNlIGlzIG5vdCBwbGFpbiB0ZXh0LlxuICovXG5EcmFmdHkucGFyc2UgPSBmdW5jdGlvbihjb250ZW50KSB7XG4gIC8vIE1ha2Ugc3VyZSB3ZSBhcmUgcGFyc2luZyBzdHJpbmdzIG9ubHkuXG4gIGlmICh0eXBlb2YgY29udGVudCAhPSAnc3RyaW5nJykge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLy8gU3BsaXQgdGV4dCBpbnRvIGxpbmVzLiBJdCBtYWtlcyBmdXJ0aGVyIHByb2Nlc3NpbmcgZWFzaWVyLlxuICBjb25zdCBsaW5lcyA9IGNvbnRlbnQuc3BsaXQoL1xccj9cXG4vKTtcblxuICAvLyBIb2xkcyBlbnRpdGllcyByZWZlcmVuY2VkIGZyb20gdGV4dFxuICBjb25zdCBlbnRpdHlNYXAgPSBbXTtcbiAgY29uc3QgZW50aXR5SW5kZXggPSB7fTtcblxuICAvLyBQcm9jZXNzaW5nIGxpbmVzIG9uZSBieSBvbmUsIGhvbGQgaW50ZXJtZWRpYXRlIHJlc3VsdCBpbiBibHguXG4gIGNvbnN0IGJseCA9IFtdO1xuICBsaW5lcy5mb3JFYWNoKChsaW5lKSA9PiB7XG4gICAgbGV0IHNwYW5zID0gW107XG4gICAgbGV0IGVudGl0aWVzO1xuXG4gICAgLy8gRmluZCBmb3JtYXR0ZWQgc3BhbnMgaW4gdGhlIHN0cmluZy5cbiAgICAvLyBUcnkgdG8gbWF0Y2ggZWFjaCBzdHlsZS5cbiAgICBJTkxJTkVfU1RZTEVTLmZvckVhY2goKHRhZykgPT4ge1xuICAgICAgLy8gRWFjaCBzdHlsZSBjb3VsZCBiZSBtYXRjaGVkIG11bHRpcGxlIHRpbWVzLlxuICAgICAgc3BhbnMgPSBzcGFucy5jb25jYXQoc3Bhbm5pZnkobGluZSwgdGFnLnN0YXJ0LCB0YWcuZW5kLCB0YWcubmFtZSkpO1xuICAgIH0pO1xuXG4gICAgbGV0IGJsb2NrO1xuICAgIGlmIChzcGFucy5sZW5ndGggPT0gMCkge1xuICAgICAgYmxvY2sgPSB7XG4gICAgICAgIHR4dDogbGluZVxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gU29ydCBzcGFucyBieSBzdHlsZSBvY2N1cmVuY2UgZWFybHkgLT4gbGF0ZSwgdGhlbiBieSBsZW5ndGg6IGZpcnN0IGxvbmcgdGhlbiBzaG9ydC5cbiAgICAgIHNwYW5zLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgY29uc3QgZGlmZiA9IGEuYXQgLSBiLmF0O1xuICAgICAgICByZXR1cm4gZGlmZiAhPSAwID8gZGlmZiA6IGIuZW5kIC0gYS5lbmQ7XG4gICAgICB9KTtcblxuICAgICAgLy8gQ29udmVydCBhbiBhcnJheSBvZiBwb3NzaWJseSBvdmVybGFwcGluZyBzcGFucyBpbnRvIGEgdHJlZS5cbiAgICAgIHNwYW5zID0gdG9TcGFuVHJlZShzcGFucyk7XG5cbiAgICAgIC8vIEJ1aWxkIGEgdHJlZSByZXByZXNlbnRhdGlvbiBvZiB0aGUgZW50aXJlIHN0cmluZywgbm90XG4gICAgICAvLyBqdXN0IHRoZSBmb3JtYXR0ZWQgcGFydHMuXG4gICAgICBjb25zdCBjaHVua3MgPSBjaHVua2lmeShsaW5lLCAwLCBsaW5lLmxlbmd0aCwgc3BhbnMpO1xuXG4gICAgICBjb25zdCBkcmFmdHkgPSBkcmFmdGlmeShjaHVua3MsIDApO1xuXG4gICAgICBibG9jayA9IHtcbiAgICAgICAgdHh0OiBkcmFmdHkudHh0LFxuICAgICAgICBmbXQ6IGRyYWZ0eS5mbXRcbiAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gRXh0cmFjdCBlbnRpdGllcyBmcm9tIHRoZSBjbGVhbmVkIHVwIHN0cmluZy5cbiAgICBlbnRpdGllcyA9IGV4dHJhY3RFbnRpdGllcyhibG9jay50eHQpO1xuICAgIGlmIChlbnRpdGllcy5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCByYW5nZXMgPSBbXTtcbiAgICAgIGZvciAobGV0IGkgaW4gZW50aXRpZXMpIHtcbiAgICAgICAgLy8ge29mZnNldDogbWF0Y2hbJ2luZGV4J10sIHVuaXF1ZTogbWF0Y2hbMF0sIGxlbjogbWF0Y2hbMF0ubGVuZ3RoLCBkYXRhOiBlbnQucGFja2VyKCksIHR5cGU6IGVudC5uYW1lfVxuICAgICAgICBjb25zdCBlbnRpdHkgPSBlbnRpdGllc1tpXTtcbiAgICAgICAgbGV0IGluZGV4ID0gZW50aXR5SW5kZXhbZW50aXR5LnVuaXF1ZV07XG4gICAgICAgIGlmICghaW5kZXgpIHtcbiAgICAgICAgICBpbmRleCA9IGVudGl0eU1hcC5sZW5ndGg7XG4gICAgICAgICAgZW50aXR5SW5kZXhbZW50aXR5LnVuaXF1ZV0gPSBpbmRleDtcbiAgICAgICAgICBlbnRpdHlNYXAucHVzaCh7XG4gICAgICAgICAgICB0cDogZW50aXR5LnR5cGUsXG4gICAgICAgICAgICBkYXRhOiBlbnRpdHkuZGF0YVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJhbmdlcy5wdXNoKHtcbiAgICAgICAgICBhdDogZW50aXR5Lm9mZnNldCxcbiAgICAgICAgICBsZW46IGVudGl0eS5sZW4sXG4gICAgICAgICAga2V5OiBpbmRleFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGJsb2NrLmVudCA9IHJhbmdlcztcbiAgICB9XG5cbiAgICBibHgucHVzaChibG9jayk7XG4gIH0pO1xuXG4gIGNvbnN0IHJlc3VsdCA9IHtcbiAgICB0eHQ6ICcnXG4gIH07XG5cbiAgLy8gTWVyZ2UgbGluZXMgYW5kIHNhdmUgbGluZSBicmVha3MgYXMgQlIgaW5saW5lIGZvcm1hdHRpbmcuXG4gIGlmIChibHgubGVuZ3RoID4gMCkge1xuICAgIHJlc3VsdC50eHQgPSBibHhbMF0udHh0O1xuICAgIHJlc3VsdC5mbXQgPSAoYmx4WzBdLmZtdCB8fCBbXSkuY29uY2F0KGJseFswXS5lbnQgfHwgW10pO1xuXG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCBibHgubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGJsb2NrID0gYmx4W2ldO1xuICAgICAgY29uc3Qgb2Zmc2V0ID0gcmVzdWx0LnR4dC5sZW5ndGggKyAxO1xuXG4gICAgICByZXN1bHQuZm10LnB1c2goe1xuICAgICAgICB0cDogJ0JSJyxcbiAgICAgICAgbGVuOiAxLFxuICAgICAgICBhdDogb2Zmc2V0IC0gMVxuICAgICAgfSk7XG5cbiAgICAgIHJlc3VsdC50eHQgKz0gJyAnICsgYmxvY2sudHh0O1xuICAgICAgaWYgKGJsb2NrLmZtdCkge1xuICAgICAgICByZXN1bHQuZm10ID0gcmVzdWx0LmZtdC5jb25jYXQoYmxvY2suZm10Lm1hcCgocykgPT4ge1xuICAgICAgICAgIHMuYXQgKz0gb2Zmc2V0O1xuICAgICAgICAgIHJldHVybiBzO1xuICAgICAgICB9KSk7XG4gICAgICB9XG4gICAgICBpZiAoYmxvY2suZW50KSB7XG4gICAgICAgIHJlc3VsdC5mbXQgPSByZXN1bHQuZm10LmNvbmNhdChibG9jay5lbnQubWFwKChzKSA9PiB7XG4gICAgICAgICAgcy5hdCArPSBvZmZzZXQ7XG4gICAgICAgICAgcmV0dXJuIHM7XG4gICAgICAgIH0pKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocmVzdWx0LmZtdC5sZW5ndGggPT0gMCkge1xuICAgICAgZGVsZXRlIHJlc3VsdC5mbXQ7XG4gICAgfVxuXG4gICAgaWYgKGVudGl0eU1hcC5sZW5ndGggPiAwKSB7XG4gICAgICByZXN1bHQuZW50ID0gZW50aXR5TWFwO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEFwcGVuZCBvbmUgRHJhZnR5IGRvY3VtZW50IHRvIGFub3RoZXIuXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGZpcnN0IC0gRHJhZnR5IGRvY3VtZW50IHRvIGFwcGVuZCB0by5cbiAqIEBwYXJhbSB7RHJhZnR5fHN0cmluZ30gc2Vjb25kIC0gRHJhZnR5IGRvY3VtZW50IG9yIHN0cmluZyBiZWluZyBhcHBlbmRlZC5cbiAqXG4gKiBAcmV0dXJuIHtEcmFmdHl9IGZpcnN0IGRvY3VtZW50IHdpdGggdGhlIHNlY29uZCBhcHBlbmRlZCB0byBpdC5cbiAqL1xuRHJhZnR5LmFwcGVuZCA9IGZ1bmN0aW9uKGZpcnN0LCBzZWNvbmQpIHtcbiAgaWYgKCFmaXJzdCkge1xuICAgIHJldHVybiBzZWNvbmQ7XG4gIH1cbiAgaWYgKCFzZWNvbmQpIHtcbiAgICByZXR1cm4gZmlyc3Q7XG4gIH1cblxuICBmaXJzdC50eHQgPSBmaXJzdC50eHQgfHwgJyc7XG4gIGNvbnN0IGxlbiA9IGZpcnN0LnR4dC5sZW5ndGg7XG5cbiAgaWYgKHR5cGVvZiBzZWNvbmQgPT0gJ3N0cmluZycpIHtcbiAgICBmaXJzdC50eHQgKz0gc2Vjb25kO1xuICB9IGVsc2UgaWYgKHNlY29uZC50eHQpIHtcbiAgICBmaXJzdC50eHQgKz0gc2Vjb25kLnR4dDtcbiAgfVxuXG4gIGlmIChBcnJheS5pc0FycmF5KHNlY29uZC5mbXQpKSB7XG4gICAgZmlyc3QuZm10ID0gZmlyc3QuZm10IHx8IFtdO1xuICAgIGlmIChBcnJheS5pc0FycmF5KHNlY29uZC5lbnQpKSB7XG4gICAgICBmaXJzdC5lbnQgPSBmaXJzdC5lbnQgfHwgW107XG4gICAgfVxuICAgIHNlY29uZC5mbXQuZm9yRWFjaChzcmMgPT4ge1xuICAgICAgY29uc3QgZm10ID0ge1xuICAgICAgICBhdDogKHNyYy5hdCB8IDApICsgbGVuLFxuICAgICAgICBsZW46IHNyYy5sZW4gfCAwXG4gICAgICB9O1xuICAgICAgLy8gU3BlY2lhbCBjYXNlIGZvciB0aGUgb3V0c2lkZSBvZiB0aGUgbm9ybWFsIHJlbmRlcmluZyBmbG93IHN0eWxlcy5cbiAgICAgIGlmIChzcmMuYXQgPT0gLTEpIHtcbiAgICAgICAgZm10LmF0ID0gLTE7XG4gICAgICAgIGZtdC5sZW4gPSAwO1xuICAgICAgfVxuICAgICAgaWYgKHNyYy50cCkge1xuICAgICAgICBmbXQudHAgPSBzcmMudHA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmbXQua2V5ID0gZmlyc3QuZW50Lmxlbmd0aDtcbiAgICAgICAgZmlyc3QuZW50LnB1c2goc2Vjb25kLmVudFtzcmMua2V5IHx8IDBdKTtcbiAgICAgIH1cbiAgICAgIGZpcnN0LmZtdC5wdXNoKGZtdCk7XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gZmlyc3Q7XG59XG5cbi8qKlxuICogQHR5cGVkZWYgRHJhZnR5LkltYWdlRGVzY1xuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHR5cGUgT2JqZWN0XG4gKiBAcGFyYW0ge3N0cmluZ30gbWltZSAtIG1pbWUtdHlwZSBvZiB0aGUgaW1hZ2UsIGUuZy4gXCJpbWFnZS9wbmdcIlxuICogQHBhcmFtIHtzdHJpbmd9IHByZXZpZXcgLSBiYXNlNjQtZW5jb2RlZCBpbWFnZSBjb250ZW50IChvciBwcmV2aWV3LCBpZiBsYXJnZSBpbWFnZSBpcyBhdHRhY2hlZCkuIENvdWxkIGJlIG51bGwvdW5kZWZpbmVkLlxuICogQHBhcmFtIHtpbnRlZ2VyfSB3aWR0aCAtIHdpZHRoIG9mIHRoZSBpbWFnZVxuICogQHBhcmFtIHtpbnRlZ2VyfSBoZWlnaHQgLSBoZWlnaHQgb2YgdGhlIGltYWdlXG4gKiBAcGFyYW0ge3N0cmluZ30gZmlsZW5hbWUgLSBmaWxlIG5hbWUgc3VnZ2VzdGlvbiBmb3IgZG93bmxvYWRpbmcgdGhlIGltYWdlLlxuICogQHBhcmFtIHtpbnRlZ2VyfSBzaXplIC0gc2l6ZSBvZiB0aGUgaW1hZ2UgaW4gYnl0ZXMuIFRyZWF0IGlzIGFzIGFuIHVudHJ1c3RlZCBoaW50LlxuICogQHBhcmFtIHtzdHJpbmd9IHJlZnVybCAtIHJlZmVyZW5jZSB0byB0aGUgY29udGVudC4gQ291bGQgYmUgbnVsbC91bmRlZmluZWQuXG4gKiBAcGFyYW0ge3N0cmluZ30gX3RlbXBQcmV2aWV3IC0gYmFzZTY0LWVuY29kZWQgaW1hZ2UgcHJldmlldyB1c2VkIGR1cmluZyB1cGxvYWQgcHJvY2Vzczsgbm90IHNlcmlhbGl6YWJsZS5cbiAqIEBwYXJhbSB7UHJvbWlzZX0gdXJsUHJvbWlzZSAtIFByb21pc2Ugd2hpY2ggcmV0dXJucyBjb250ZW50IFVSTCB3aGVuIHJlc29sdmVkLlxuICovXG5cbi8qKlxuICogSW5zZXJ0IGlubGluZSBpbWFnZSBpbnRvIERyYWZ0eSBkb2N1bWVudC5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eX0gY29udGVudCAtIGRvY3VtZW50IHRvIGFkZCBpbWFnZSB0by5cbiAqIEBwYXJhbSB7aW50ZWdlcn0gYXQgLSBpbmRleCB3aGVyZSB0aGUgb2JqZWN0IGlzIGluc2VydGVkLiBUaGUgbGVuZ3RoIG9mIHRoZSBpbWFnZSBpcyBhbHdheXMgMS5cbiAqIEBwYXJhbSB7SW1hZ2VEZXNjfSBpbWFnZURlc2MgLSBvYmplY3Qgd2l0aCBpbWFnZSBwYXJhbWVuZXRzIGFuZCBkYXRhLlxuICpcbiAqIEByZXR1cm4ge0RyYWZ0eX0gdXBkYXRlZCBkb2N1bWVudC5cbiAqL1xuRHJhZnR5Lmluc2VydEltYWdlID0gZnVuY3Rpb24oY29udGVudCwgYXQsIGltYWdlRGVzYykge1xuICBjb250ZW50ID0gY29udGVudCB8fCB7XG4gICAgdHh0OiAnICdcbiAgfTtcbiAgY29udGVudC5lbnQgPSBjb250ZW50LmVudCB8fCBbXTtcbiAgY29udGVudC5mbXQgPSBjb250ZW50LmZtdCB8fCBbXTtcblxuICBjb250ZW50LmZtdC5wdXNoKHtcbiAgICBhdDogYXQgfCAwLFxuICAgIGxlbjogMSxcbiAgICBrZXk6IGNvbnRlbnQuZW50Lmxlbmd0aFxuICB9KTtcblxuICBjb25zdCBleCA9IHtcbiAgICB0cDogJ0lNJyxcbiAgICBkYXRhOiB7XG4gICAgICBtaW1lOiBpbWFnZURlc2MubWltZSxcbiAgICAgIHZhbDogaW1hZ2VEZXNjLnByZXZpZXcsXG4gICAgICB3aWR0aDogaW1hZ2VEZXNjLndpZHRoLFxuICAgICAgaGVpZ2h0OiBpbWFnZURlc2MuaGVpZ2h0LFxuICAgICAgbmFtZTogaW1hZ2VEZXNjLmZpbGVuYW1lLFxuICAgICAgc2l6ZTogaW1hZ2VEZXNjLnNpemUgfCAwLFxuICAgICAgcmVmOiBpbWFnZURlc2MucmVmdXJsXG4gICAgfVxuICB9O1xuXG4gIGlmIChpbWFnZURlc2MudXJsUHJvbWlzZSkge1xuICAgIGV4LmRhdGEuX3RlbXBQcmV2aWV3ID0gaW1hZ2VEZXNjLl90ZW1wUHJldmlldztcbiAgICBleC5kYXRhLl9wcm9jZXNzaW5nID0gdHJ1ZTtcbiAgICBpbWFnZURlc2MudXJsUHJvbWlzZS50aGVuKFxuICAgICAgdXJsID0+IHtcbiAgICAgICAgZXguZGF0YS5yZWYgPSB1cmw7XG4gICAgICAgIGV4LmRhdGEuX3RlbXBQcmV2aWV3ID0gdW5kZWZpbmVkO1xuICAgICAgICBleC5kYXRhLl9wcm9jZXNzaW5nID0gdW5kZWZpbmVkO1xuICAgICAgfSxcbiAgICAgIF8gPT4ge1xuICAgICAgICAvLyBDYXRjaCB0aGUgZXJyb3IsIG90aGVyd2lzZSBpdCB3aWxsIGFwcGVhciBpbiB0aGUgY29uc29sZS5cbiAgICAgICAgZXguZGF0YS5fcHJvY2Vzc2luZyA9IHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICApO1xuICB9XG5cbiAgY29udGVudC5lbnQucHVzaChleCk7XG5cbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cbi8qKlxuICogQHR5cGVkZWYgRHJhZnR5LkF1ZGlvRGVzY1xuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHR5cGUgT2JqZWN0XG4gKiBAcGFyYW0ge3N0cmluZ30gbWltZSAtIG1pbWUtdHlwZSBvZiB0aGUgYXVkaW8sIGUuZy4gXCJhdWRpby9vZ2dcIi5cbiAqIEBwYXJhbSB7c3RyaW5nfSBkYXRhIC0gYmFzZTY0LWVuY29kZWQgYXVkaW8gY29udGVudC4gQ291bGQgYmUgbnVsbC91bmRlZmluZWQuXG4gKiBAcGFyYW0ge2ludGVnZXJ9IGR1cmF0aW9uIC0gZHVyYXRpb24gb2YgdGhlIHJlY29yZCBpbiBtaWxsaXNlY29uZHMuXG4gKiBAcGFyYW0ge3N0cmluZ30gcHJldmlldyAtIGJhc2U2NCBlbmNvZGVkIHNob3J0IGFycmF5IG9mIGFtcGxpdHVkZSB2YWx1ZXMgMC4uMTAwLlxuICogQHBhcmFtIHtzdHJpbmd9IGZpbGVuYW1lIC0gZmlsZSBuYW1lIHN1Z2dlc3Rpb24gZm9yIGRvd25sb2FkaW5nIHRoZSBhdWRpby5cbiAqIEBwYXJhbSB7aW50ZWdlcn0gc2l6ZSAtIHNpemUgb2YgdGhlIHJlY29yZGluZyBpbiBieXRlcy4gVHJlYXQgaXMgYXMgYW4gdW50cnVzdGVkIGhpbnQuXG4gKiBAcGFyYW0ge3N0cmluZ30gcmVmdXJsIC0gcmVmZXJlbmNlIHRvIHRoZSBjb250ZW50LiBDb3VsZCBiZSBudWxsL3VuZGVmaW5lZC5cbiAqIEBwYXJhbSB7UHJvbWlzZX0gdXJsUHJvbWlzZSAtIFByb21pc2Ugd2hpY2ggcmV0dXJucyBjb250ZW50IFVSTCB3aGVuIHJlc29sdmVkLlxuICovXG5cbi8qKlxuICogSW5zZXJ0IGF1ZGlvIHJlY29yZGluZyBpbnRvIERyYWZ0eSBkb2N1bWVudC5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eX0gY29udGVudCAtIGRvY3VtZW50IHRvIGFkZCBhdWRpbyByZWNvcmQgdG8uXG4gKiBAcGFyYW0ge2ludGVnZXJ9IGF0IC0gaW5kZXggd2hlcmUgdGhlIG9iamVjdCBpcyBpbnNlcnRlZC4gVGhlIGxlbmd0aCBvZiB0aGUgcmVjb3JkIGlzIGFsd2F5cyAxLlxuICogQHBhcmFtIHtBdWRpb0Rlc2N9IGF1ZGlvRGVzYyAtIG9iamVjdCB3aXRoIHRoZSBhdWRpbyBwYXJhbWVuZXRzIGFuZCBkYXRhLlxuICpcbiAqIEByZXR1cm4ge0RyYWZ0eX0gdXBkYXRlZCBkb2N1bWVudC5cbiAqL1xuRHJhZnR5Lmluc2VydEF1ZGlvID0gZnVuY3Rpb24oY29udGVudCwgYXQsIGF1ZGlvRGVzYykge1xuICBjb250ZW50ID0gY29udGVudCB8fCB7XG4gICAgdHh0OiAnICdcbiAgfTtcbiAgY29udGVudC5lbnQgPSBjb250ZW50LmVudCB8fCBbXTtcbiAgY29udGVudC5mbXQgPSBjb250ZW50LmZtdCB8fCBbXTtcblxuICBjb250ZW50LmZtdC5wdXNoKHtcbiAgICBhdDogYXQgfCAwLFxuICAgIGxlbjogMSxcbiAgICBrZXk6IGNvbnRlbnQuZW50Lmxlbmd0aFxuICB9KTtcblxuICBjb25zdCBleCA9IHtcbiAgICB0cDogJ0FVJyxcbiAgICBkYXRhOiB7XG4gICAgICBtaW1lOiBhdWRpb0Rlc2MubWltZSxcbiAgICAgIHZhbDogYXVkaW9EZXNjLmRhdGEsXG4gICAgICBkdXJhdGlvbjogYXVkaW9EZXNjLmR1cmF0aW9uIHwgMCxcbiAgICAgIHByZXZpZXc6IGF1ZGlvRGVzYy5wcmV2aWV3LFxuICAgICAgbmFtZTogYXVkaW9EZXNjLmZpbGVuYW1lLFxuICAgICAgc2l6ZTogYXVkaW9EZXNjLnNpemUgfCAwLFxuICAgICAgcmVmOiBhdWRpb0Rlc2MucmVmdXJsXG4gICAgfVxuICB9O1xuXG4gIGlmIChhdWRpb0Rlc2MudXJsUHJvbWlzZSkge1xuICAgIGV4LmRhdGEuX3Byb2Nlc3NpbmcgPSB0cnVlO1xuICAgIGF1ZGlvRGVzYy51cmxQcm9taXNlLnRoZW4oXG4gICAgICB1cmwgPT4ge1xuICAgICAgICBleC5kYXRhLnJlZiA9IHVybDtcbiAgICAgICAgZXguZGF0YS5fcHJvY2Vzc2luZyA9IHVuZGVmaW5lZDtcbiAgICAgIH0sXG4gICAgICBfID0+IHtcbiAgICAgICAgLy8gQ2F0Y2ggdGhlIGVycm9yLCBvdGhlcndpc2UgaXQgd2lsbCBhcHBlYXIgaW4gdGhlIGNvbnNvbGUuXG4gICAgICAgIGV4LmRhdGEuX3Byb2Nlc3NpbmcgPSB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgKTtcbiAgfVxuXG4gIGNvbnRlbnQuZW50LnB1c2goZXgpO1xuXG4gIHJldHVybiBjb250ZW50O1xufVxuXG4vKipcbiAqIENyZWF0ZSBhIHF1b3RlIHRvIERyYWZ0eSBkb2N1bWVudC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gaGVhZGVyIC0gUXVvdGUgaGVhZGVyICh0aXRsZSwgZXRjLikuXG4gKiBAcGFyYW0ge3N0cmluZ30gdWlkIC0gVUlEIG9mIHRoZSBhdXRob3IgdG8gbWVudGlvbi5cbiAqIEBwYXJhbSB7RHJhZnR5fSBib2R5IC0gQm9keSBvZiB0aGUgcXVvdGVkIG1lc3NhZ2UuXG4gKlxuICogQHJldHVybnMgUmVwbHkgcXVvdGUgRHJhZnR5IGRvYyB3aXRoIHRoZSBxdW90ZSBmb3JtYXR0aW5nLlxuICovXG5EcmFmdHkucXVvdGUgPSBmdW5jdGlvbihoZWFkZXIsIHVpZCwgYm9keSkge1xuICBjb25zdCBxdW90ZSA9IERyYWZ0eS5hcHBlbmQoRHJhZnR5LmFwcGVuZExpbmVCcmVhayhEcmFmdHkubWVudGlvbihoZWFkZXIsIHVpZCkpLCBib2R5KTtcblxuICAvLyBXcmFwIGludG8gYSBxdW90ZS5cbiAgcXVvdGUuZm10LnB1c2goe1xuICAgIGF0OiAwLFxuICAgIGxlbjogcXVvdGUudHh0Lmxlbmd0aCxcbiAgICB0cDogJ1FRJ1xuICB9KTtcblxuICByZXR1cm4gcXVvdGU7XG59XG5cbi8qKlxuICogQ3JlYXRlIGEgRHJhZnR5IGRvY3VtZW50IHdpdGggYSBtZW50aW9uLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gbWVudGlvbmVkIG5hbWUuXG4gKiBAcGFyYW0ge3N0cmluZ30gdWlkIC0gbWVudGlvbmVkIHVzZXIgSUQuXG4gKlxuICogQHJldHVybnMge0RyYWZ0eX0gZG9jdW1lbnQgd2l0aCB0aGUgbWVudGlvbi5cbiAqL1xuRHJhZnR5Lm1lbnRpb24gPSBmdW5jdGlvbihuYW1lLCB1aWQpIHtcbiAgcmV0dXJuIHtcbiAgICB0eHQ6IG5hbWUgfHwgJycsXG4gICAgZm10OiBbe1xuICAgICAgYXQ6IDAsXG4gICAgICBsZW46IChuYW1lIHx8ICcnKS5sZW5ndGgsXG4gICAgICBrZXk6IDBcbiAgICB9XSxcbiAgICBlbnQ6IFt7XG4gICAgICB0cDogJ01OJyxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgdmFsOiB1aWRcbiAgICAgIH1cbiAgICB9XVxuICB9O1xufVxuXG4vKipcbiAqIEFwcGVuZCBhIGxpbmsgdG8gYSBEcmFmdHkgZG9jdW1lbnQuXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGNvbnRlbnQgLSBEcmFmdHkgZG9jdW1lbnQgdG8gYXBwZW5kIGxpbmsgdG8uXG4gKiBAcGFyYW0ge09iamVjdH0gbGlua0RhdGEgLSBMaW5rIGluZm8gaW4gZm9ybWF0IDxjb2RlPnt0eHQ6ICdhbmtvciB0ZXh0JywgdXJsOiAnaHR0cDovLy4uLid9PC9jb2RlPi5cbiAqXG4gKiBAcmV0dXJucyB7RHJhZnR5fSB0aGUgc2FtZSBkb2N1bWVudCBhcyA8Y29kZT5jb250ZW50PC9jb2RlPi5cbiAqL1xuRHJhZnR5LmFwcGVuZExpbmsgPSBmdW5jdGlvbihjb250ZW50LCBsaW5rRGF0YSkge1xuICBjb250ZW50ID0gY29udGVudCB8fCB7XG4gICAgdHh0OiAnJ1xuICB9O1xuXG4gIGNvbnRlbnQuZW50ID0gY29udGVudC5lbnQgfHwgW107XG4gIGNvbnRlbnQuZm10ID0gY29udGVudC5mbXQgfHwgW107XG5cbiAgY29udGVudC5mbXQucHVzaCh7XG4gICAgYXQ6IGNvbnRlbnQudHh0Lmxlbmd0aCxcbiAgICBsZW46IGxpbmtEYXRhLnR4dC5sZW5ndGgsXG4gICAga2V5OiBjb250ZW50LmVudC5sZW5ndGhcbiAgfSk7XG4gIGNvbnRlbnQudHh0ICs9IGxpbmtEYXRhLnR4dDtcblxuICBjb25zdCBleCA9IHtcbiAgICB0cDogJ0xOJyxcbiAgICBkYXRhOiB7XG4gICAgICB1cmw6IGxpbmtEYXRhLnVybFxuICAgIH1cbiAgfVxuICBjb250ZW50LmVudC5wdXNoKGV4KTtcblxuICByZXR1cm4gY29udGVudDtcbn1cblxuLyoqXG4gKiBBcHBlbmQgaW1hZ2UgdG8gRHJhZnR5IGRvY3VtZW50LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fSBjb250ZW50IC0gZG9jdW1lbnQgdG8gYWRkIGltYWdlIHRvLlxuICogQHBhcmFtIHtJbWFnZURlc2N9IGltYWdlRGVzYyAtIG9iamVjdCB3aXRoIGltYWdlIHBhcmFtZW5ldHMuXG4gKlxuICogQHJldHVybiB7RHJhZnR5fSB1cGRhdGVkIGRvY3VtZW50LlxuICovXG5EcmFmdHkuYXBwZW5kSW1hZ2UgPSBmdW5jdGlvbihjb250ZW50LCBpbWFnZURlc2MpIHtcbiAgY29udGVudCA9IGNvbnRlbnQgfHwge1xuICAgIHR4dDogJydcbiAgfTtcbiAgY29udGVudC50eHQgKz0gJyAnO1xuICByZXR1cm4gRHJhZnR5Lmluc2VydEltYWdlKGNvbnRlbnQsIGNvbnRlbnQudHh0Lmxlbmd0aCAtIDEsIGltYWdlRGVzYyk7XG59XG5cbi8qKlxuICogQXBwZW5kIGF1ZGlvIHJlY29kcmluZyB0byBEcmFmdHkgZG9jdW1lbnQuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGNvbnRlbnQgLSBkb2N1bWVudCB0byBhZGQgcmVjb3JkaW5nIHRvLlxuICogQHBhcmFtIHtBdWRpb0Rlc2N9IGF1ZGlvRGVzYyAtIG9iamVjdCB3aXRoIGF1ZGlvIGRhdGEuXG4gKlxuICogQHJldHVybiB7RHJhZnR5fSB1cGRhdGVkIGRvY3VtZW50LlxuICovXG5EcmFmdHkuYXBwZW5kQXVkaW8gPSBmdW5jdGlvbihjb250ZW50LCBhdWRpb0Rlc2MpIHtcbiAgY29udGVudCA9IGNvbnRlbnQgfHwge1xuICAgIHR4dDogJydcbiAgfTtcbiAgY29udGVudC50eHQgKz0gJyAnO1xuICByZXR1cm4gRHJhZnR5Lmluc2VydEF1ZGlvKGNvbnRlbnQsIGNvbnRlbnQudHh0Lmxlbmd0aCAtIDEsIGF1ZGlvRGVzYyk7XG59XG5cbi8qKlxuICogQHR5cGVkZWYgRHJhZnR5LkF0dGFjaG1lbnREZXNjXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAdHlwZSBPYmplY3RcbiAqIEBwYXJhbSB7c3RyaW5nfSBtaW1lIC0gbWltZS10eXBlIG9mIHRoZSBhdHRhY2htZW50LCBlLmcuIFwiYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtXCJcbiAqIEBwYXJhbSB7c3RyaW5nfSBkYXRhIC0gYmFzZTY0LWVuY29kZWQgaW4tYmFuZCBjb250ZW50IG9mIHNtYWxsIGF0dGFjaG1lbnRzLiBDb3VsZCBiZSBudWxsL3VuZGVmaW5lZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlbmFtZSAtIGZpbGUgbmFtZSBzdWdnZXN0aW9uIGZvciBkb3dubG9hZGluZyB0aGUgYXR0YWNobWVudC5cbiAqIEBwYXJhbSB7aW50ZWdlcn0gc2l6ZSAtIHNpemUgb2YgdGhlIGZpbGUgaW4gYnl0ZXMuIFRyZWF0IGlzIGFzIGFuIHVudHJ1c3RlZCBoaW50LlxuICogQHBhcmFtIHtzdHJpbmd9IHJlZnVybCAtIHJlZmVyZW5jZSB0byB0aGUgb3V0LW9mLWJhbmQgY29udGVudC4gQ291bGQgYmUgbnVsbC91bmRlZmluZWQuXG4gKiBAcGFyYW0ge1Byb21pc2V9IHVybFByb21pc2UgLSBQcm9taXNlIHdoaWNoIHJldHVybnMgY29udGVudCBVUkwgd2hlbiByZXNvbHZlZC5cbiAqL1xuXG4vKipcbiAqIEF0dGFjaCBmaWxlIHRvIERyYWZ0eSBjb250ZW50LiBFaXRoZXIgYXMgYSBibG9iIG9yIGFzIGEgcmVmZXJlbmNlLlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fSBjb250ZW50IC0gZG9jdW1lbnQgdG8gYXR0YWNoIGZpbGUgdG8uXG4gKiBAcGFyYW0ge0F0dGFjaG1lbnREZXNjfSBvYmplY3QgLSBjb250YWluaW5nIGF0dGFjaG1lbnQgZGVzY3JpcHRpb24gYW5kIGRhdGEuXG4gKlxuICogQHJldHVybiB7RHJhZnR5fSB1cGRhdGVkIGRvY3VtZW50LlxuICovXG5EcmFmdHkuYXR0YWNoRmlsZSA9IGZ1bmN0aW9uKGNvbnRlbnQsIGF0dGFjaG1lbnREZXNjKSB7XG4gIGNvbnRlbnQgPSBjb250ZW50IHx8IHtcbiAgICB0eHQ6ICcnXG4gIH07XG5cbiAgY29udGVudC5lbnQgPSBjb250ZW50LmVudCB8fCBbXTtcbiAgY29udGVudC5mbXQgPSBjb250ZW50LmZtdCB8fCBbXTtcblxuICBjb250ZW50LmZtdC5wdXNoKHtcbiAgICBhdDogLTEsXG4gICAgbGVuOiAwLFxuICAgIGtleTogY29udGVudC5lbnQubGVuZ3RoXG4gIH0pO1xuXG4gIGNvbnN0IGV4ID0ge1xuICAgIHRwOiAnRVgnLFxuICAgIGRhdGE6IHtcbiAgICAgIG1pbWU6IGF0dGFjaG1lbnREZXNjLm1pbWUsXG4gICAgICB2YWw6IGF0dGFjaG1lbnREZXNjLmRhdGEsXG4gICAgICBuYW1lOiBhdHRhY2htZW50RGVzYy5maWxlbmFtZSxcbiAgICAgIHJlZjogYXR0YWNobWVudERlc2MucmVmdXJsLFxuICAgICAgc2l6ZTogYXR0YWNobWVudERlc2Muc2l6ZSB8IDBcbiAgICB9XG4gIH1cbiAgaWYgKGF0dGFjaG1lbnREZXNjLnVybFByb21pc2UpIHtcbiAgICBleC5kYXRhLl9wcm9jZXNzaW5nID0gdHJ1ZTtcbiAgICBhdHRhY2htZW50RGVzYy51cmxQcm9taXNlLnRoZW4oXG4gICAgICAodXJsKSA9PiB7XG4gICAgICAgIGV4LmRhdGEucmVmID0gdXJsO1xuICAgICAgICBleC5kYXRhLl9wcm9jZXNzaW5nID0gdW5kZWZpbmVkO1xuICAgICAgfSxcbiAgICAgIChlcnIpID0+IHtcbiAgICAgICAgLyogY2F0Y2ggdGhlIGVycm9yLCBvdGhlcndpc2UgaXQgd2lsbCBhcHBlYXIgaW4gdGhlIGNvbnNvbGUuICovXG4gICAgICAgIGV4LmRhdGEuX3Byb2Nlc3NpbmcgPSB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgKTtcbiAgfVxuICBjb250ZW50LmVudC5wdXNoKGV4KTtcblxuICByZXR1cm4gY29udGVudDtcbn1cblxuLyoqXG4gKiBXcmFwcyBkcmFmdHkgZG9jdW1lbnQgaW50byBhIHNpbXBsZSBmb3JtYXR0aW5nIHN0eWxlLlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fHN0cmluZ30gY29udGVudCAtIGRvY3VtZW50IG9yIHN0cmluZyB0byB3cmFwIGludG8gYSBzdHlsZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHlsZSAtIHR3by1sZXR0ZXIgc3R5bGUgdG8gd3JhcCBpbnRvLlxuICogQHBhcmFtIHtudW1iZXJ9IGF0IC0gaW5kZXggd2hlcmUgdGhlIHN0eWxlIHN0YXJ0cywgZGVmYXVsdCAwLlxuICogQHBhcmFtIHtudW1iZXJ9IGxlbiAtIGxlbmd0aCBvZiB0aGUgZm9ybSBjb250ZW50LCBkZWZhdWx0IGFsbCBvZiBpdC5cbiAqXG4gKiBAcmV0dXJuIHtEcmFmdHl9IHVwZGF0ZWQgZG9jdW1lbnQuXG4gKi9cbkRyYWZ0eS53cmFwSW50byA9IGZ1bmN0aW9uKGNvbnRlbnQsIHN0eWxlLCBhdCwgbGVuKSB7XG4gIGlmICh0eXBlb2YgY29udGVudCA9PSAnc3RyaW5nJykge1xuICAgIGNvbnRlbnQgPSB7XG4gICAgICB0eHQ6IGNvbnRlbnRcbiAgICB9O1xuICB9XG4gIGNvbnRlbnQuZm10ID0gY29udGVudC5mbXQgfHwgW107XG5cbiAgY29udGVudC5mbXQucHVzaCh7XG4gICAgYXQ6IGF0IHx8IDAsXG4gICAgbGVuOiBsZW4gfHwgY29udGVudC50eHQubGVuZ3RoLFxuICAgIHRwOiBzdHlsZSxcbiAgfSk7XG5cbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cbi8qKlxuICogV3JhcHMgY29udGVudCBpbnRvIGFuIGludGVyYWN0aXZlIGZvcm0uXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl8c3RyaW5nfSBjb250ZW50IC0gdG8gd3JhcCBpbnRvIGEgZm9ybS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBhdCAtIGluZGV4IHdoZXJlIHRoZSBmb3JtcyBzdGFydHMuXG4gKiBAcGFyYW0ge251bWJlcn0gbGVuIC0gbGVuZ3RoIG9mIHRoZSBmb3JtIGNvbnRlbnQuXG4gKlxuICogQHJldHVybiB7RHJhZnR5fSB1cGRhdGVkIGRvY3VtZW50LlxuICovXG5EcmFmdHkud3JhcEFzRm9ybSA9IGZ1bmN0aW9uKGNvbnRlbnQsIGF0LCBsZW4pIHtcbiAgcmV0dXJuIERyYWZ0eS53cmFwSW50byhjb250ZW50LCAnRk0nLCBhdCwgbGVuKTtcbn1cblxuLyoqXG4gKiBJbnNlcnQgY2xpY2thYmxlIGJ1dHRvbiBpbnRvIERyYWZ0eSBkb2N1bWVudC5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eXxzdHJpbmd9IGNvbnRlbnQgLSBEcmFmdHkgZG9jdW1lbnQgdG8gaW5zZXJ0IGJ1dHRvbiB0byBvciBhIHN0cmluZyB0byBiZSB1c2VkIGFzIGJ1dHRvbiB0ZXh0LlxuICogQHBhcmFtIHtudW1iZXJ9IGF0IC0gbG9jYXRpb24gd2hlcmUgdGhlIGJ1dHRvbiBpcyBpbnNlcnRlZC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBsZW4gLSB0aGUgbGVuZ3RoIG9mIHRoZSB0ZXh0IHRvIGJlIHVzZWQgYXMgYnV0dG9uIHRpdGxlLlxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSB0aGUgYnV0dG9uLiBDbGllbnQgc2hvdWxkIHJldHVybiBpdCB0byB0aGUgc2VydmVyIHdoZW4gdGhlIGJ1dHRvbiBpcyBjbGlja2VkLlxuICogQHBhcmFtIHtzdHJpbmd9IGFjdGlvblR5cGUgLSB0aGUgdHlwZSBvZiB0aGUgYnV0dG9uLCBvbmUgb2YgJ3VybCcgb3IgJ3B1YicuXG4gKiBAcGFyYW0ge3N0cmluZ30gYWN0aW9uVmFsdWUgLSB0aGUgdmFsdWUgdG8gcmV0dXJuIG9uIGNsaWNrOlxuICogQHBhcmFtIHtzdHJpbmd9IHJlZlVybCAtIHRoZSBVUkwgdG8gZ28gdG8gd2hlbiB0aGUgJ3VybCcgYnV0dG9uIGlzIGNsaWNrZWQuXG4gKlxuICogQHJldHVybiB7RHJhZnR5fSB1cGRhdGVkIGRvY3VtZW50LlxuICovXG5EcmFmdHkuaW5zZXJ0QnV0dG9uID0gZnVuY3Rpb24oY29udGVudCwgYXQsIGxlbiwgbmFtZSwgYWN0aW9uVHlwZSwgYWN0aW9uVmFsdWUsIHJlZlVybCkge1xuICBpZiAodHlwZW9mIGNvbnRlbnQgPT0gJ3N0cmluZycpIHtcbiAgICBjb250ZW50ID0ge1xuICAgICAgdHh0OiBjb250ZW50XG4gICAgfTtcbiAgfVxuXG4gIGlmICghY29udGVudCB8fCAhY29udGVudC50eHQgfHwgY29udGVudC50eHQubGVuZ3RoIDwgYXQgKyBsZW4pIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGlmIChsZW4gPD0gMCB8fCBbJ3VybCcsICdwdWInXS5pbmRleE9mKGFjdGlvblR5cGUpID09IC0xKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgLy8gRW5zdXJlIHJlZlVybCBpcyBhIHN0cmluZy5cbiAgaWYgKGFjdGlvblR5cGUgPT0gJ3VybCcgJiYgIXJlZlVybCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHJlZlVybCA9ICcnICsgcmVmVXJsO1xuXG4gIGNvbnRlbnQuZW50ID0gY29udGVudC5lbnQgfHwgW107XG4gIGNvbnRlbnQuZm10ID0gY29udGVudC5mbXQgfHwgW107XG5cbiAgY29udGVudC5mbXQucHVzaCh7XG4gICAgYXQ6IGF0IHwgMCxcbiAgICBsZW46IGxlbixcbiAgICBrZXk6IGNvbnRlbnQuZW50Lmxlbmd0aFxuICB9KTtcbiAgY29udGVudC5lbnQucHVzaCh7XG4gICAgdHA6ICdCTicsXG4gICAgZGF0YToge1xuICAgICAgYWN0OiBhY3Rpb25UeXBlLFxuICAgICAgdmFsOiBhY3Rpb25WYWx1ZSxcbiAgICAgIHJlZjogcmVmVXJsLFxuICAgICAgbmFtZTogbmFtZVxuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cbi8qKlxuICogQXBwZW5kIGNsaWNrYWJsZSBidXR0b24gdG8gRHJhZnR5IGRvY3VtZW50LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fHN0cmluZ30gY29udGVudCAtIERyYWZ0eSBkb2N1bWVudCB0byBpbnNlcnQgYnV0dG9uIHRvIG9yIGEgc3RyaW5nIHRvIGJlIHVzZWQgYXMgYnV0dG9uIHRleHQuXG4gKiBAcGFyYW0ge3N0cmluZ30gdGl0bGUgLSB0aGUgdGV4dCB0byBiZSB1c2VkIGFzIGJ1dHRvbiB0aXRsZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gdGhlIGJ1dHRvbi4gQ2xpZW50IHNob3VsZCByZXR1cm4gaXQgdG8gdGhlIHNlcnZlciB3aGVuIHRoZSBidXR0b24gaXMgY2xpY2tlZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBhY3Rpb25UeXBlIC0gdGhlIHR5cGUgb2YgdGhlIGJ1dHRvbiwgb25lIG9mICd1cmwnIG9yICdwdWInLlxuICogQHBhcmFtIHtzdHJpbmd9IGFjdGlvblZhbHVlIC0gdGhlIHZhbHVlIHRvIHJldHVybiBvbiBjbGljazpcbiAqIEBwYXJhbSB7c3RyaW5nfSByZWZVcmwgLSB0aGUgVVJMIHRvIGdvIHRvIHdoZW4gdGhlICd1cmwnIGJ1dHRvbiBpcyBjbGlja2VkLlxuICpcbiAqIEByZXR1cm4ge0RyYWZ0eX0gdXBkYXRlZCBkb2N1bWVudC5cbiAqL1xuRHJhZnR5LmFwcGVuZEJ1dHRvbiA9IGZ1bmN0aW9uKGNvbnRlbnQsIHRpdGxlLCBuYW1lLCBhY3Rpb25UeXBlLCBhY3Rpb25WYWx1ZSwgcmVmVXJsKSB7XG4gIGNvbnRlbnQgPSBjb250ZW50IHx8IHtcbiAgICB0eHQ6ICcnXG4gIH07XG4gIGNvbnN0IGF0ID0gY29udGVudC50eHQubGVuZ3RoO1xuICBjb250ZW50LnR4dCArPSB0aXRsZTtcbiAgcmV0dXJuIERyYWZ0eS5pbnNlcnRCdXR0b24oY29udGVudCwgYXQsIHRpdGxlLmxlbmd0aCwgbmFtZSwgYWN0aW9uVHlwZSwgYWN0aW9uVmFsdWUsIHJlZlVybCk7XG59XG5cbi8qKlxuICogQXR0YWNoIGEgZ2VuZXJpYyBKUyBvYmplY3QuIFRoZSBvYmplY3QgaXMgYXR0YWNoZWQgYXMgYSBqc29uIHN0cmluZy5cbiAqIEludGVuZGVkIGZvciByZXByZXNlbnRpbmcgYSBmb3JtIHJlc3BvbnNlLlxuICpcbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eX0gY29udGVudCAtIERyYWZ0eSBkb2N1bWVudCB0byBhdHRhY2ggZmlsZSB0by5cbiAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIC0gZGF0YSB0byBjb252ZXJ0IHRvIGpzb24gc3RyaW5nIGFuZCBhdHRhY2guXG4gKiBAcmV0dXJucyB7RHJhZnR5fSB0aGUgc2FtZSBkb2N1bWVudCBhcyA8Y29kZT5jb250ZW50PC9jb2RlPi5cbiAqL1xuRHJhZnR5LmF0dGFjaEpTT04gPSBmdW5jdGlvbihjb250ZW50LCBkYXRhKSB7XG4gIGNvbnRlbnQgPSBjb250ZW50IHx8IHtcbiAgICB0eHQ6ICcnXG4gIH07XG4gIGNvbnRlbnQuZW50ID0gY29udGVudC5lbnQgfHwgW107XG4gIGNvbnRlbnQuZm10ID0gY29udGVudC5mbXQgfHwgW107XG5cbiAgY29udGVudC5mbXQucHVzaCh7XG4gICAgYXQ6IC0xLFxuICAgIGxlbjogMCxcbiAgICBrZXk6IGNvbnRlbnQuZW50Lmxlbmd0aFxuICB9KTtcblxuICBjb250ZW50LmVudC5wdXNoKHtcbiAgICB0cDogJ0VYJyxcbiAgICBkYXRhOiB7XG4gICAgICBtaW1lOiBKU09OX01JTUVfVFlQRSxcbiAgICAgIHZhbDogZGF0YVxuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG4vKipcbiAqIEFwcGVuZCBsaW5lIGJyZWFrIHRvIGEgRHJhZnR5IGRvY3VtZW50LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fSBjb250ZW50IC0gRHJhZnR5IGRvY3VtZW50IHRvIGFwcGVuZCBsaW5lYnJlYWsgdG8uXG4gKiBAcmV0dXJucyB7RHJhZnR5fSB0aGUgc2FtZSBkb2N1bWVudCBhcyA8Y29kZT5jb250ZW50PC9jb2RlPi5cbiAqL1xuRHJhZnR5LmFwcGVuZExpbmVCcmVhayA9IGZ1bmN0aW9uKGNvbnRlbnQpIHtcbiAgY29udGVudCA9IGNvbnRlbnQgfHwge1xuICAgIHR4dDogJydcbiAgfTtcbiAgY29udGVudC5mbXQgPSBjb250ZW50LmZtdCB8fCBbXTtcbiAgY29udGVudC5mbXQucHVzaCh7XG4gICAgYXQ6IGNvbnRlbnQudHh0Lmxlbmd0aCxcbiAgICBsZW46IDEsXG4gICAgdHA6ICdCUidcbiAgfSk7XG4gIGNvbnRlbnQudHh0ICs9ICcgJztcblxuICByZXR1cm4gY29udGVudDtcbn1cbi8qKlxuICogR2l2ZW4gRHJhZnR5IGRvY3VtZW50LCBjb252ZXJ0IGl0IHRvIEhUTUwuXG4gKiBObyBhdHRlbXB0IGlzIG1hZGUgdG8gc3RyaXAgcHJlLWV4aXN0aW5nIGh0bWwgbWFya3VwLlxuICogVGhpcyBpcyBwb3RlbnRpYWxseSB1bnNhZmUgYmVjYXVzZSA8Y29kZT5jb250ZW50LnR4dDwvY29kZT4gbWF5IGNvbnRhaW4gbWFsaWNpb3VzIEhUTUxcbiAqIG1hcmt1cC5cbiAqIEBtZW1iZXJvZiBUaW5vZGUuRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGRvYyAtIGRvY3VtZW50IHRvIGNvbnZlcnQuXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gSFRNTC1yZXByZXNlbnRhdGlvbiBvZiBjb250ZW50LlxuICovXG5EcmFmdHkuVU5TQUZFX3RvSFRNTCA9IGZ1bmN0aW9uKGRvYykge1xuICBsZXQgdHJlZSA9IGRyYWZ0eVRvVHJlZShkb2MpO1xuICBjb25zdCBodG1sRm9ybWF0dGVyID0gZnVuY3Rpb24odHlwZSwgZGF0YSwgdmFsdWVzKSB7XG4gICAgY29uc3QgdGFnID0gREVDT1JBVE9SU1t0eXBlXTtcbiAgICBsZXQgcmVzdWx0ID0gdmFsdWVzID8gdmFsdWVzLmpvaW4oJycpIDogJyc7XG4gICAgaWYgKHRhZykge1xuICAgICAgcmVzdWx0ID0gdGFnLm9wZW4oZGF0YSkgKyByZXN1bHQgKyB0YWcuY2xvc2UoZGF0YSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG4gIHJldHVybiB0cmVlQm90dG9tVXAodHJlZSwgaHRtbEZvcm1hdHRlciwgMCk7XG59XG5cbi8qKlxuICogQ2FsbGJhY2sgZm9yIGFwcGx5aW5nIGN1c3RvbSBmb3JtYXR0aW5nIHRvIGEgRHJhZnR5IGRvY3VtZW50LlxuICogQ2FsbGVkIG9uY2UgZm9yIGVhY2ggc3R5bGUgc3Bhbi5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAY2FsbGJhY2sgRm9ybWF0dGVyXG4gKiBAcGFyYW0ge3N0cmluZ30gc3R5bGUgLSBzdHlsZSBjb2RlIHN1Y2ggYXMgXCJTVFwiIG9yIFwiSU1cIi5cbiAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIC0gZW50aXR5J3MgZGF0YS5cbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWx1ZXMgLSBwb3NzaWJseSBzdHlsZWQgc3Vic3BhbnMgY29udGFpbmVkIGluIHRoaXMgc3R5bGUgc3Bhbi5cbiAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCAtIGluZGV4IG9mIHRoZSBlbGVtZW50IGd1YXJhbnRlZWQgdG8gYmUgdW5pcXVlLlxuICovXG5cbi8qKlxuICogQ29udmVydCBEcmFmdHkgZG9jdW1lbnQgdG8gYSByZXByZXNlbnRhdGlvbiBzdWl0YWJsZSBmb3IgZGlzcGxheS5cbiAqIFRoZSA8Y29kZT5jb250ZXh0PC9jb2RlPiBtYXkgZXhwb3NlIGEgZnVuY3Rpb24gPGNvZGU+Z2V0Rm9ybWF0dGVyKHN0eWxlKTwvY29kZT4uIElmIGl0J3MgYXZhaWxhYmxlXG4gKiBpdCB3aWxsIGNhbGwgaXQgdG8gb2J0YWluIGEgPGNvZGU+Zm9ybWF0dGVyPC9jb2RlPiBmb3IgYSBzdWJ0cmVlIG9mIHN0eWxlcyB1bmRlciB0aGUgPGNvZGU+c3R5bGU8L2NvZGU+LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fE9iamVjdH0gY29udGVudCAtIERyYWZ0eSBkb2N1bWVudCB0byB0cmFuc2Zvcm0uXG4gKiBAcGFyYW0ge0Zvcm1hdHRlcn0gZm9ybWF0dGVyIC0gY2FsbGJhY2sgd2hpY2ggZm9ybWF0cyBpbmRpdmlkdWFsIGVsZW1lbnRzLlxuICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHQgLSBjb250ZXh0IHByb3ZpZGVkIHRvIGZvcm1hdHRlciBhcyA8Y29kZT50aGlzPC9jb2RlPi5cbiAqXG4gKiBAcmV0dXJuIHtPYmplY3R9IHRyYW5zZm9ybWVkIG9iamVjdFxuICovXG5EcmFmdHkuZm9ybWF0ID0gZnVuY3Rpb24ob3JpZ2luYWwsIGZvcm1hdHRlciwgY29udGV4dCkge1xuICByZXR1cm4gdHJlZUJvdHRvbVVwKGRyYWZ0eVRvVHJlZShvcmlnaW5hbCksIGZvcm1hdHRlciwgMCwgW10sIGNvbnRleHQpO1xufVxuXG4vKipcbiAqIFNob3J0ZW4gRHJhZnR5IGRvY3VtZW50IG1ha2luZyB0aGUgZHJhZnR5IHRleHQgbm8gbG9uZ2VyIHRoYW4gdGhlIGxpbWl0LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fHN0cmluZ30gb3JpZ2luYWwgLSBEcmFmdHkgb2JqZWN0IHRvIHNob3J0ZW4uXG4gKiBAcGFyYW0ge251bWJlcn0gbGltaXQgLSBsZW5ndGggaW4gY2hhcmFjcmV0cyB0byBzaG9ydGVuIHRvLlxuICogQHBhcmFtIHtib29sZWFufSBsaWdodCAtIHJlbW92ZSBoZWF2eSBkYXRhIGZyb20gZW50aXRpZXMuXG4gKiBAcmV0dXJucyBuZXcgc2hvcnRlbmVkIERyYWZ0eSBvYmplY3QgbGVhdmluZyB0aGUgb3JpZ2luYWwgaW50YWN0LlxuICovXG5EcmFmdHkuc2hvcnRlbiA9IGZ1bmN0aW9uKG9yaWdpbmFsLCBsaW1pdCwgbGlnaHQpIHtcbiAgbGV0IHRyZWUgPSBkcmFmdHlUb1RyZWUob3JpZ2luYWwpO1xuICB0cmVlID0gc2hvcnRlblRyZWUodHJlZSwgbGltaXQsICfigKYnKTtcbiAgaWYgKHRyZWUgJiYgbGlnaHQpIHtcbiAgICB0cmVlID0gbGlnaHRFbnRpdHkodHJlZSk7XG4gIH1cbiAgcmV0dXJuIHRyZWVUb0RyYWZ0eSh7fSwgdHJlZSwgW10pO1xufVxuXG4vKipcbiAqIFRyYW5zZm9ybSBEcmFmdHkgZG9jIGZvciBmb3J3YXJkaW5nOiBzdHJpcCBsZWFkaW5nIEBtZW50aW9uIGFuZCBhbnkgbGVhZGluZyBsaW5lIGJyZWFrcyBvciB3aGl0ZXNwYWNlLlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fHN0cmluZ30gb3JpZ2luYWwgLSBEcmFmdHkgb2JqZWN0IHRvIHNob3J0ZW4uXG4gKiBAcmV0dXJucyBjb252ZXJ0ZWQgRHJhZnR5IG9iamVjdCBsZWF2aW5nIHRoZSBvcmlnaW5hbCBpbnRhY3QuXG4gKi9cbkRyYWZ0eS5mb3J3YXJkZWRDb250ZW50ID0gZnVuY3Rpb24ob3JpZ2luYWwpIHtcbiAgbGV0IHRyZWUgPSBkcmFmdHlUb1RyZWUob3JpZ2luYWwpO1xuICBjb25zdCBybU1lbnRpb24gPSBmdW5jdGlvbihub2RlKSB7XG4gICAgaWYgKG5vZGUudHlwZSA9PSAnTU4nKSB7XG4gICAgICBpZiAoIW5vZGUucGFyZW50IHx8ICFub2RlLnBhcmVudC50eXBlKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuICAvLyBTdHJpcCBsZWFkaW5nIG1lbnRpb24uXG4gIHRyZWUgPSB0cmVlVG9wRG93bih0cmVlLCBybU1lbnRpb24pO1xuICAvLyBSZW1vdmUgbGVhZGluZyB3aGl0ZXNwYWNlLlxuICB0cmVlID0gbFRyaW0odHJlZSk7XG4gIC8vIENvbnZlcnQgYmFjayB0byBEcmFmdHkuXG4gIHJldHVybiB0cmVlVG9EcmFmdHkoe30sIHRyZWUsIFtdKTtcbn1cblxuLyoqXG4gKiBQcmVwYXJlIERyYWZ0eSBkb2MgZm9yIHdyYXBwaW5nIGludG8gUVEgYXMgYSByZXBseTpcbiAqICAtIFJlcGxhY2UgZm9yd2FyZGluZyBtZW50aW9uIHdpdGggc3ltYm9sICfinqYnIGFuZCByZW1vdmUgZGF0YSAoVUlEKS5cbiAqICAtIFJlbW92ZSBxdW90ZWQgdGV4dCBjb21wbGV0ZWx5LlxuICogIC0gUmVwbGFjZSBsaW5lIGJyZWFrcyB3aXRoIHNwYWNlcy5cbiAqICAtIFN0cmlwIGVudGl0aWVzIG9mIGhlYXZ5IGNvbnRlbnQuXG4gKiAgLSBNb3ZlIGF0dGFjaG1lbnRzIHRvIHRoZSBlbmQgb2YgdGhlIGRvY3VtZW50LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fHN0cmluZ30gb3JpZ2luYWwgLSBEcmFmdHkgb2JqZWN0IHRvIHNob3J0ZW4uXG4gKiBAcGFyYW0ge251bWJlcn0gbGltaXQgLSBsZW5ndGggaW4gY2hhcmFjdGVycyB0byBzaG9ydGVuIHRvLlxuICogQHJldHVybnMgY29udmVydGVkIERyYWZ0eSBvYmplY3QgbGVhdmluZyB0aGUgb3JpZ2luYWwgaW50YWN0LlxuICovXG5EcmFmdHkucmVwbHlDb250ZW50ID0gZnVuY3Rpb24ob3JpZ2luYWwsIGxpbWl0KSB7XG4gIGNvbnN0IGNvbnZNTm5RUW5CUiA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICBpZiAobm9kZS50eXBlID09ICdRUScpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0gZWxzZSBpZiAobm9kZS50eXBlID09ICdNTicpIHtcbiAgICAgIGlmICgoIW5vZGUucGFyZW50IHx8ICFub2RlLnBhcmVudC50eXBlKSAmJiAobm9kZS50ZXh0IHx8ICcnKS5zdGFydHNXaXRoKCfinqYnKSkge1xuICAgICAgICBub2RlLnRleHQgPSAn4p6mJztcbiAgICAgICAgZGVsZXRlIG5vZGUuY2hpbGRyZW47XG4gICAgICAgIGRlbGV0ZSBub2RlLmRhdGE7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChub2RlLnR5cGUgPT0gJ0JSJykge1xuICAgICAgbm9kZS50ZXh0ID0gJyAnO1xuICAgICAgZGVsZXRlIG5vZGUudHlwZTtcbiAgICAgIGRlbGV0ZSBub2RlLmNoaWxkcmVuO1xuICAgIH1cbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuXG4gIGxldCB0cmVlID0gZHJhZnR5VG9UcmVlKG9yaWdpbmFsKTtcbiAgaWYgKCF0cmVlKSB7XG4gICAgcmV0dXJuIG9yaWdpbmFsO1xuICB9XG5cbiAgLy8gU3RyaXAgbGVhZGluZyBtZW50aW9uLlxuICB0cmVlID0gdHJlZVRvcERvd24odHJlZSwgY29udk1OblFRbkJSKTtcbiAgLy8gTW92ZSBhdHRhY2htZW50cyB0byB0aGUgZW5kIG9mIHRoZSBkb2MuXG4gIHRyZWUgPSBhdHRhY2htZW50c1RvRW5kKHRyZWUsIE1BWF9QUkVWSUVXX0FUVEFDSE1FTlRTKTtcbiAgLy8gU2hvcnRlbiB0aGUgZG9jLlxuICB0cmVlID0gc2hvcnRlblRyZWUodHJlZSwgbGltaXQsICfigKYnKTtcbiAgLy8gU3RyaXAgaGVhdnkgZWxlbWVudHMgZXhjZXB0IElNLmRhdGFbJ3ZhbCddIChoYXZlIHRvIGtlZXAgdGhlbSB0byBnZW5lcmF0ZSBwcmV2aWV3cyBsYXRlcikuXG4gIHRyZWUgPSBsaWdodEVudGl0eSh0cmVlLCBub2RlID0+IChub2RlLnR5cGUgPT0gJ0lNJyA/IFsndmFsJ10gOiBudWxsKSk7XG4gIC8vIENvbnZlcnQgYmFjayB0byBEcmFmdHkuXG4gIHJldHVybiB0cmVlVG9EcmFmdHkoe30sIHRyZWUsIFtdKTtcbn1cblxuXG4vKipcbiAqIEdlbmVyYXRlIGRyYWZ0eSBwcmV2aWV3OlxuICogIC0gU2hvcnRlbiB0aGUgZG9jdW1lbnQuXG4gKiAgLSBTdHJpcCBhbGwgaGVhdnkgZW50aXR5IGRhdGEgbGVhdmluZyBqdXN0IGlubGluZSBzdHlsZXMgYW5kIGVudGl0eSByZWZlcmVuY2VzLlxuICogIC0gUmVwbGFjZSBsaW5lIGJyZWFrcyB3aXRoIHNwYWNlcy5cbiAqICAtIFJlcGxhY2UgY29udGVudCBvZiBRUSB3aXRoIGEgc3BhY2UuXG4gKiAgLSBSZXBsYWNlIGZvcndhcmRpbmcgbWVudGlvbiB3aXRoIHN5bWJvbCAn4p6mJy5cbiAqIG1vdmUgYWxsIGF0dGFjaG1lbnRzIHRvIHRoZSBlbmQgb2YgdGhlIGRvY3VtZW50IGFuZCBtYWtlIHRoZW0gdmlzaWJsZS5cbiAqIFRoZSA8Y29kZT5jb250ZXh0PC9jb2RlPiBtYXkgZXhwb3NlIGEgZnVuY3Rpb24gPGNvZGU+Z2V0Rm9ybWF0dGVyKHN0eWxlKTwvY29kZT4uIElmIGl0J3MgYXZhaWxhYmxlXG4gKiBpdCB3aWxsIGNhbGwgaXQgdG8gb2J0YWluIGEgPGNvZGU+Zm9ybWF0dGVyPC9jb2RlPiBmb3IgYSBzdWJ0cmVlIG9mIHN0eWxlcyB1bmRlciB0aGUgPGNvZGU+c3R5bGU8L2NvZGU+LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fHN0cmluZ30gb3JpZ2luYWwgLSBEcmFmdHkgb2JqZWN0IHRvIHNob3J0ZW4uXG4gKiBAcGFyYW0ge251bWJlcn0gbGltaXQgLSBsZW5ndGggaW4gY2hhcmFjdGVycyB0byBzaG9ydGVuIHRvLlxuICogQHBhcmFtIHtib29sZWFufSBmb3J3YXJkaW5nIC0gdGhpcyBhIGZvcndhcmRpbmcgbWVzc2FnZSBwcmV2aWV3LlxuICogQHJldHVybnMgbmV3IHNob3J0ZW5lZCBEcmFmdHkgb2JqZWN0IGxlYXZpbmcgdGhlIG9yaWdpbmFsIGludGFjdC5cbiAqL1xuRHJhZnR5LnByZXZpZXcgPSBmdW5jdGlvbihvcmlnaW5hbCwgbGltaXQsIGZvcndhcmRpbmcpIHtcbiAgbGV0IHRyZWUgPSBkcmFmdHlUb1RyZWUob3JpZ2luYWwpO1xuXG4gIC8vIE1vdmUgYXR0YWNobWVudHMgdG8gdGhlIGVuZC5cbiAgdHJlZSA9IGF0dGFjaG1lbnRzVG9FbmQodHJlZSwgTUFYX1BSRVZJRVdfQVRUQUNITUVOVFMpO1xuXG4gIC8vIENvbnZlcnQgbGVhZGluZyBtZW50aW9uIHRvICfinqYnIGFuZCByZXBsYWNlIFFRIGFuZCBCUiB3aXRoIGEgc3BhY2UgJyAnLlxuICBjb25zdCBjb252TU5uUVFuQlIgPSBmdW5jdGlvbihub2RlKSB7XG4gICAgaWYgKG5vZGUudHlwZSA9PSAnTU4nKSB7XG4gICAgICBpZiAoKCFub2RlLnBhcmVudCB8fCAhbm9kZS5wYXJlbnQudHlwZSkgJiYgKG5vZGUudGV4dCB8fCAnJykuc3RhcnRzV2l0aCgn4p6mJykpIHtcbiAgICAgICAgbm9kZS50ZXh0ID0gJ+Kepic7XG4gICAgICAgIGRlbGV0ZSBub2RlLmNoaWxkcmVuO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAobm9kZS50eXBlID09ICdRUScpIHtcbiAgICAgIG5vZGUudGV4dCA9ICcgJztcbiAgICAgIGRlbGV0ZSBub2RlLmNoaWxkcmVuO1xuICAgIH0gZWxzZSBpZiAobm9kZS50eXBlID09ICdCUicpIHtcbiAgICAgIG5vZGUudGV4dCA9ICcgJztcbiAgICAgIGRlbGV0ZSBub2RlLmNoaWxkcmVuO1xuICAgICAgZGVsZXRlIG5vZGUudHlwZTtcbiAgICB9XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cbiAgdHJlZSA9IHRyZWVUb3BEb3duKHRyZWUsIGNvbnZNTm5RUW5CUik7XG5cbiAgdHJlZSA9IHNob3J0ZW5UcmVlKHRyZWUsIGxpbWl0LCAn4oCmJyk7XG4gIGlmIChmb3J3YXJkaW5nKSB7XG4gICAgLy8gS2VlcCBJTSBkYXRhIGZvciBwcmV2aWV3LlxuICAgIHRyZWUgPSBsaWdodEVudGl0eSh0cmVlLCBub2RlID0+IChub2RlLnR5cGUgPT0gJ0lNJyA/IFsndmFsJ10gOiBudWxsKSk7XG4gIH0gZWxzZSB7XG4gICAgdHJlZSA9IGxpZ2h0RW50aXR5KHRyZWUpO1xuICB9XG5cbiAgLy8gQ29udmVydCBiYWNrIHRvIERyYWZ0eS5cbiAgcmV0dXJuIHRyZWVUb0RyYWZ0eSh7fSwgdHJlZSwgW10pO1xufVxuXG4vKipcbiAqIEdpdmVuIERyYWZ0eSBkb2N1bWVudCwgY29udmVydCBpdCB0byBwbGFpbiB0ZXh0LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fSBjb250ZW50IC0gZG9jdW1lbnQgdG8gY29udmVydCB0byBwbGFpbiB0ZXh0LlxuICogQHJldHVybnMge3N0cmluZ30gcGxhaW4tdGV4dCByZXByZXNlbnRhdGlvbiBvZiB0aGUgZHJhZnR5IGRvY3VtZW50LlxuICovXG5EcmFmdHkudG9QbGFpblRleHQgPSBmdW5jdGlvbihjb250ZW50KSB7XG4gIHJldHVybiB0eXBlb2YgY29udGVudCA9PSAnc3RyaW5nJyA/IGNvbnRlbnQgOiBjb250ZW50LnR4dDtcbn1cblxuLyoqXG4gKiBDaGVjayBpZiB0aGUgZG9jdW1lbnQgaGFzIG5vIG1hcmt1cCBhbmQgbm8gZW50aXRpZXMuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGNvbnRlbnQgLSBjb250ZW50IHRvIGNoZWNrIGZvciBwcmVzZW5jZSBvZiBtYXJrdXAuXG4gKiBAcmV0dXJucyA8Y29kZT50cnVlPC9jb2RlPiBpcyBjb250ZW50IGlzIHBsYWluIHRleHQsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gKi9cbkRyYWZ0eS5pc1BsYWluVGV4dCA9IGZ1bmN0aW9uKGNvbnRlbnQpIHtcbiAgcmV0dXJuIHR5cGVvZiBjb250ZW50ID09ICdzdHJpbmcnIHx8ICEoY29udGVudC5mbXQgfHwgY29udGVudC5lbnQpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiB0aGUgb2JqZWN0IHJlcHJlc2V0cyBpcyBhIHZhbGlkIERyYWZ0eSBkb2N1bWVudC5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eX0gY29udGVudCAtIGNvbnRlbnQgdG8gY2hlY2sgZm9yIHZhbGlkaXR5LlxuICogQHJldHVybnMgPGNvZGU+dHJ1ZTwvY29kZT4gaXMgY29udGVudCBpcyB2YWxpZCwgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAqL1xuRHJhZnR5LmlzVmFsaWQgPSBmdW5jdGlvbihjb250ZW50KSB7XG4gIGlmICghY29udGVudCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IHtcbiAgICB0eHQsXG4gICAgZm10LFxuICAgIGVudFxuICB9ID0gY29udGVudDtcblxuICBpZiAoIXR4dCAmJiB0eHQgIT09ICcnICYmICFmbXQgJiYgIWVudCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IHR4dF90eXBlID0gdHlwZW9mIHR4dDtcbiAgaWYgKHR4dF90eXBlICE9ICdzdHJpbmcnICYmIHR4dF90eXBlICE9ICd1bmRlZmluZWQnICYmIHR4dCAhPT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgZm10ICE9ICd1bmRlZmluZWQnICYmICFBcnJheS5pc0FycmF5KGZtdCkgJiYgZm10ICE9PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBlbnQgIT0gJ3VuZGVmaW5lZCcgJiYgIUFycmF5LmlzQXJyYXkoZW50KSAmJiBlbnQgIT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8qKlxuICogQ2hlY2sgaWYgdGhlIGRyYWZ0eSBkb2N1bWVudCBoYXMgYXR0YWNobWVudHM6IHN0eWxlIEVYIGFuZCBvdXRzaWRlIG9mIG5vcm1hbCByZW5kZXJpbmcgZmxvdyxcbiAqIGkuZS4gPGNvZGU+YXQgPSAtMTwvY29kZT4uXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGNvbnRlbnQgLSBkb2N1bWVudCB0byBjaGVjayBmb3IgYXR0YWNobWVudHMuXG4gKiBAcmV0dXJucyA8Y29kZT50cnVlPC9jb2RlPiBpZiB0aGVyZSBhcmUgYXR0YWNobWVudHMuXG4gKi9cbkRyYWZ0eS5oYXNBdHRhY2htZW50cyA9IGZ1bmN0aW9uKGNvbnRlbnQpIHtcbiAgaWYgKCFBcnJheS5pc0FycmF5KGNvbnRlbnQuZm10KSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBmb3IgKGxldCBpIGluIGNvbnRlbnQuZm10KSB7XG4gICAgY29uc3QgZm10ID0gY29udGVudC5mbXRbaV07XG4gICAgaWYgKGZtdCAmJiBmbXQuYXQgPCAwKSB7XG4gICAgICBjb25zdCBlbnQgPSBjb250ZW50LmVudFtmbXQua2V5IHwgMF07XG4gICAgICByZXR1cm4gZW50ICYmIGVudC50cCA9PSAnRVgnICYmIGVudC5kYXRhO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogQ2FsbGJhY2sgZm9yIGFwcGx5aW5nIGN1c3RvbSBmb3JtYXR0aW5nL3RyYW5zZm9ybWF0aW9uIHRvIGEgRHJhZnR5IGRvY3VtZW50LlxuICogQ2FsbGVkIG9uY2UgZm9yIGVhY2ggZW50aXR5LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBjYWxsYmFjayBFbnRpdHlDYWxsYmFja1xuICogQHBhcmFtIHtPYmplY3R9IGRhdGEgZW50aXR5IGRhdGEuXG4gKiBAcGFyYW0ge3N0cmluZ30gZW50aXR5IHR5cGUuXG4gKiBAcGFyYW0ge251bWJlcn0gaW5kZXggZW50aXR5J3MgaW5kZXggaW4gYGNvbnRlbnQuZW50YC5cbiAqL1xuXG4vKipcbiAqIEVudW1lcmF0ZSBhdHRhY2htZW50czogc3R5bGUgRVggYW5kIG91dHNpZGUgb2Ygbm9ybWFsIHJlbmRlcmluZyBmbG93LCBpLmUuIDxjb2RlPmF0ID0gLTE8L2NvZGU+LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fSBjb250ZW50IC0gZG9jdW1lbnQgdG8gcHJvY2VzcyBmb3IgYXR0YWNobWVudHMuXG4gKiBAcGFyYW0ge0VudGl0eUNhbGxiYWNrfSBjYWxsYmFjayAtIGNhbGxiYWNrIHRvIGNhbGwgZm9yIGVhY2ggYXR0YWNobWVudC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZXh0IC0gdmFsdWUgb2YgXCJ0aGlzXCIgZm9yIGNhbGxiYWNrLlxuICovXG5EcmFmdHkuYXR0YWNobWVudHMgPSBmdW5jdGlvbihjb250ZW50LCBjYWxsYmFjaywgY29udGV4dCkge1xuICBpZiAoIUFycmF5LmlzQXJyYXkoY29udGVudC5mbXQpKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGxldCBpID0gMDtcbiAgY29udGVudC5mbXQuZm9yRWFjaChmbXQgPT4ge1xuICAgIGlmIChmbXQgJiYgZm10LmF0IDwgMCkge1xuICAgICAgY29uc3QgZW50ID0gY29udGVudC5lbnRbZm10LmtleSB8IDBdO1xuICAgICAgaWYgKGVudCAmJiBlbnQudHAgPT0gJ0VYJyAmJiBlbnQuZGF0YSkge1xuICAgICAgICBjYWxsYmFjay5jYWxsKGNvbnRleHQsIGVudC5kYXRhLCBpKyssICdFWCcpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59XG5cbi8qKlxuICogQ2hlY2sgaWYgdGhlIGRyYWZ0eSBkb2N1bWVudCBoYXMgZW50aXRpZXMuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGNvbnRlbnQgLSBkb2N1bWVudCB0byBjaGVjayBmb3IgZW50aXRpZXMuXG4gKiBAcmV0dXJucyA8Y29kZT50cnVlPC9jb2RlPiBpZiB0aGVyZSBhcmUgZW50aXRpZXMuXG4gKi9cbkRyYWZ0eS5oYXNFbnRpdGllcyA9IGZ1bmN0aW9uKGNvbnRlbnQpIHtcbiAgcmV0dXJuIGNvbnRlbnQuZW50ICYmIGNvbnRlbnQuZW50Lmxlbmd0aCA+IDA7XG59XG5cbi8qKlxuICogRW51bWVyYXRlIGVudGl0aWVzLlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fSBjb250ZW50IC0gZG9jdW1lbnQgd2l0aCBlbnRpdGllcyB0byBlbnVtZXJhdGUuXG4gKiBAcGFyYW0ge0VudGl0eUNhbGxiYWNrfSBjYWxsYmFjayAtIGNhbGxiYWNrIHRvIGNhbGwgZm9yIGVhY2ggZW50aXR5LlxuICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHQgLSB2YWx1ZSBvZiBcInRoaXNcIiBmb3IgY2FsbGJhY2suXG4gKi9cbkRyYWZ0eS5lbnRpdGllcyA9IGZ1bmN0aW9uKGNvbnRlbnQsIGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gIGlmIChjb250ZW50LmVudCAmJiBjb250ZW50LmVudC5sZW5ndGggPiAwKSB7XG4gICAgZm9yIChsZXQgaSBpbiBjb250ZW50LmVudCkge1xuICAgICAgaWYgKGNvbnRlbnQuZW50W2ldKSB7XG4gICAgICAgIGNhbGxiYWNrLmNhbGwoY29udGV4dCwgY29udGVudC5lbnRbaV0uZGF0YSwgaSwgY29udGVudC5lbnRbaV0udHApO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFJlbW92ZSB1bnJlY29nbml6ZWQgZmllbGRzIGZyb20gZW50aXR5IGRhdGFcbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eX0gY29udGVudCAtIGRvY3VtZW50IHdpdGggZW50aXRpZXMgdG8gZW51bWVyYXRlLlxuICogQHJldHVybnMgY29udGVudC5cbiAqL1xuRHJhZnR5LnNhbml0aXplRW50aXRpZXMgPSBmdW5jdGlvbihjb250ZW50KSB7XG4gIGlmIChjb250ZW50ICYmIGNvbnRlbnQuZW50ICYmIGNvbnRlbnQuZW50Lmxlbmd0aCA+IDApIHtcbiAgICBmb3IgKGxldCBpIGluIGNvbnRlbnQuZW50KSB7XG4gICAgICBjb25zdCBlbnQgPSBjb250ZW50LmVudFtpXTtcbiAgICAgIGlmIChlbnQgJiYgZW50LmRhdGEpIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IGNvcHlFbnREYXRhKGVudC5kYXRhKTtcbiAgICAgICAgaWYgKGRhdGEpIHtcbiAgICAgICAgICBjb250ZW50LmVudFtpXS5kYXRhID0gZGF0YTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkZWxldGUgY29udGVudC5lbnRbaV0uZGF0YTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gY29udGVudDtcbn1cblxuLyoqXG4gKiBHaXZlbiB0aGUgZW50aXR5LCBnZXQgVVJMIHdoaWNoIGNhbiBiZSB1c2VkIGZvciBkb3dubG9hZGluZ1xuICogZW50aXR5IGRhdGEuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGVudERhdGEgLSBlbnRpdHkuZGF0YSB0byBnZXQgdGhlIFVSbCBmcm9tLlxuICogQHJldHVybnMge3N0cmluZ30gVVJMIHRvIGRvd25sb2FkIGVudGl0eSBkYXRhIG9yIDxjb2RlPm51bGw8L2NvZGU+LlxuICovXG5EcmFmdHkuZ2V0RG93bmxvYWRVcmwgPSBmdW5jdGlvbihlbnREYXRhKSB7XG4gIGxldCB1cmwgPSBudWxsO1xuICBpZiAoZW50RGF0YS5taW1lICE9IEpTT05fTUlNRV9UWVBFICYmIGVudERhdGEudmFsKSB7XG4gICAgdXJsID0gYmFzZTY0dG9PYmplY3RVcmwoZW50RGF0YS52YWwsIGVudERhdGEubWltZSwgRHJhZnR5LmxvZ2dlcik7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGVudERhdGEucmVmID09ICdzdHJpbmcnKSB7XG4gICAgdXJsID0gZW50RGF0YS5yZWY7XG4gIH1cbiAgcmV0dXJuIHVybDtcbn1cblxuLyoqXG4gKiBDaGVjayBpZiB0aGUgZW50aXR5IGRhdGEgaXMgbm90IHJlYWR5IGZvciBzZW5kaW5nLCBzdWNoIGFzIGJlaW5nIHVwbG9hZGVkIHRvIHRoZSBzZXJ2ZXIuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGVudGl0eS5kYXRhIHRvIGdldCB0aGUgVVJsIGZyb20uXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiB1cGxvYWQgaXMgaW4gcHJvZ3Jlc3MsIGZhbHNlIG90aGVyd2lzZS5cbiAqL1xuRHJhZnR5LmlzUHJvY2Vzc2luZyA9IGZ1bmN0aW9uKGVudERhdGEpIHtcbiAgcmV0dXJuICEhZW50RGF0YS5fcHJvY2Vzc2luZztcbn1cblxuLyoqXG4gKiBHaXZlbiB0aGUgZW50aXR5LCBnZXQgVVJMIHdoaWNoIGNhbiBiZSB1c2VkIGZvciBwcmV2aWV3aW5nXG4gKiB0aGUgZW50aXR5LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBlbnRpdHkuZGF0YSB0byBnZXQgdGhlIFVSbCBmcm9tLlxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9IHVybCBmb3IgcHJldmlld2luZyBvciBudWxsIGlmIG5vIHN1Y2ggdXJsIGlzIGF2YWlsYWJsZS5cbiAqL1xuRHJhZnR5LmdldFByZXZpZXdVcmwgPSBmdW5jdGlvbihlbnREYXRhKSB7XG4gIHJldHVybiBlbnREYXRhLnZhbCA/IGJhc2U2NHRvT2JqZWN0VXJsKGVudERhdGEudmFsLCBlbnREYXRhLm1pbWUsIERyYWZ0eS5sb2dnZXIpIDogbnVsbDtcbn1cblxuLyoqXG4gKiBHZXQgYXBwcm94aW1hdGUgc2l6ZSBvZiB0aGUgZW50aXR5LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBlbnREYXRhIC0gZW50aXR5LmRhdGEgdG8gZ2V0IHRoZSBzaXplIGZvci5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IHNpemUgb2YgZW50aXR5IGRhdGEgaW4gYnl0ZXMuXG4gKi9cbkRyYWZ0eS5nZXRFbnRpdHlTaXplID0gZnVuY3Rpb24oZW50RGF0YSkge1xuICAvLyBFaXRoZXIgc2l6ZSBoaW50IG9yIGxlbmd0aCBvZiB2YWx1ZS4gVGhlIHZhbHVlIGlzIGJhc2U2NCBlbmNvZGVkLFxuICAvLyB0aGUgYWN0dWFsIG9iamVjdCBzaXplIGlzIHNtYWxsZXIgdGhhbiB0aGUgZW5jb2RlZCBsZW5ndGguXG4gIHJldHVybiBlbnREYXRhLnNpemUgPyBlbnREYXRhLnNpemUgOiBlbnREYXRhLnZhbCA/IChlbnREYXRhLnZhbC5sZW5ndGggKiAwLjc1KSB8IDAgOiAwO1xufVxuXG4vKipcbiAqIEdldCBlbnRpdHkgbWltZSB0eXBlLlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBlbnREYXRhIC0gZW50aXR5LmRhdGEgdG8gZ2V0IHRoZSB0eXBlIGZvci5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IG1pbWUgdHlwZSBvZiBlbnRpdHkuXG4gKi9cbkRyYWZ0eS5nZXRFbnRpdHlNaW1lVHlwZSA9IGZ1bmN0aW9uKGVudERhdGEpIHtcbiAgcmV0dXJuIGVudERhdGEubWltZSB8fCAndGV4dC9wbGFpbic7XG59XG5cbi8qKlxuICogR2V0IEhUTUwgdGFnIGZvciBhIGdpdmVuIHR3by1sZXR0ZXIgc3R5bGUgbmFtZS5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gc3R5bGUgLSB0d28tbGV0dGVyIHN0eWxlLCBsaWtlIFNUIG9yIExOLlxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9IEhUTUwgdGFnIG5hbWUgaWYgc3R5bGUgaXMgZm91bmQsICdfVU5LTicgaWYgbm90IGZvdW5kLCB7Y29kZTogdW5kZWZpbmVkfSBpZiBzdHlsZSBpcyBmYWxzaXNoLlxuICovXG5EcmFmdHkudGFnTmFtZSA9IGZ1bmN0aW9uKHN0eWxlKSB7XG4gIHJldHVybiBzdHlsZSA/IChIVE1MX1RBR1Nbc3R5bGVdID8gSFRNTF9UQUdTW3N0eWxlXS5uYW1lIDogJ19VTktOJykgOiB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogRm9yIGEgZ2l2ZW4gZGF0YSBidW5kbGUgZ2VuZXJhdGUgYW4gb2JqZWN0IHdpdGggSFRNTCBhdHRyaWJ1dGVzLFxuICogZm9yIGluc3RhbmNlLCBnaXZlbiB7dXJsOiBcImh0dHA6Ly93d3cuZXhhbXBsZS5jb20vXCJ9IHJldHVyblxuICoge2hyZWY6IFwiaHR0cDovL3d3dy5leGFtcGxlLmNvbS9cIn1cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gc3R5bGUgLSB0d28tbGV0dGVyIHN0eWxlIHRvIGdlbmVyYXRlIGF0dHJpYnV0ZXMgZm9yLlxuICogQHBhcmFtIHtPYmplY3R9IGRhdGEgLSBkYXRhIGJ1bmRsZSB0byBjb252ZXJ0IHRvIGF0dHJpYnV0ZXNcbiAqXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBvYmplY3Qgd2l0aCBIVE1MIGF0dHJpYnV0ZXMuXG4gKi9cbkRyYWZ0eS5hdHRyVmFsdWUgPSBmdW5jdGlvbihzdHlsZSwgZGF0YSkge1xuICBpZiAoZGF0YSAmJiBERUNPUkFUT1JTW3N0eWxlXSkge1xuICAgIHJldHVybiBERUNPUkFUT1JTW3N0eWxlXS5wcm9wcyhkYXRhKTtcbiAgfVxuXG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogRHJhZnR5IE1JTUUgdHlwZS5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBjb250ZW50LVR5cGUgXCJ0ZXh0L3gtZHJhZnR5XCIuXG4gKi9cbkRyYWZ0eS5nZXRDb250ZW50VHlwZSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gRFJBRlRZX01JTUVfVFlQRTtcbn1cblxuLy8gPT09PT09PT09PT09PT09PT1cbi8vIFV0aWxpdHkgbWV0aG9kcy5cbi8vID09PT09PT09PT09PT09PT09XG5cbi8vIFRha2UgYSBzdHJpbmcgYW5kIGRlZmluZWQgZWFybGllciBzdHlsZSBzcGFucywgcmUtY29tcG9zZSB0aGVtIGludG8gYSB0cmVlIHdoZXJlIGVhY2ggbGVhZiBpc1xuLy8gYSBzYW1lLXN0eWxlIChpbmNsdWRpbmcgdW5zdHlsZWQpIHN0cmluZy4gSS5lLiAnaGVsbG8gKmJvbGQgX2l0YWxpY18qIGFuZCB+bW9yZX4gd29ybGQnIC0+XG4vLyAoJ2hlbGxvICcsIChiOiAnYm9sZCAnLCAoaTogJ2l0YWxpYycpKSwgJyBhbmQgJywgKHM6ICdtb3JlJyksICcgd29ybGQnKTtcbi8vXG4vLyBUaGlzIGlzIG5lZWRlZCBpbiBvcmRlciB0byBjbGVhciBtYXJrdXAsIGkuZS4gJ2hlbGxvICp3b3JsZConIC0+ICdoZWxsbyB3b3JsZCcgYW5kIGNvbnZlcnRcbi8vIHJhbmdlcyBmcm9tIG1hcmt1cC1lZCBvZmZzZXRzIHRvIHBsYWluIHRleHQgb2Zmc2V0cy5cbmZ1bmN0aW9uIGNodW5raWZ5KGxpbmUsIHN0YXJ0LCBlbmQsIHNwYW5zKSB7XG4gIGNvbnN0IGNodW5rcyA9IFtdO1xuXG4gIGlmIChzcGFucy5sZW5ndGggPT0gMCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGZvciAobGV0IGkgaW4gc3BhbnMpIHtcbiAgICAvLyBHZXQgdGhlIG5leHQgY2h1bmsgZnJvbSB0aGUgcXVldWVcbiAgICBjb25zdCBzcGFuID0gc3BhbnNbaV07XG5cbiAgICAvLyBHcmFiIHRoZSBpbml0aWFsIHVuc3R5bGVkIGNodW5rXG4gICAgaWYgKHNwYW4uYXQgPiBzdGFydCkge1xuICAgICAgY2h1bmtzLnB1c2goe1xuICAgICAgICB0eHQ6IGxpbmUuc2xpY2Uoc3RhcnQsIHNwYW4uYXQpXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBHcmFiIHRoZSBzdHlsZWQgY2h1bmsuIEl0IG1heSBpbmNsdWRlIHN1YmNodW5rcy5cbiAgICBjb25zdCBjaHVuayA9IHtcbiAgICAgIHRwOiBzcGFuLnRwXG4gICAgfTtcbiAgICBjb25zdCBjaGxkID0gY2h1bmtpZnkobGluZSwgc3Bhbi5hdCArIDEsIHNwYW4uZW5kLCBzcGFuLmNoaWxkcmVuKTtcbiAgICBpZiAoY2hsZC5sZW5ndGggPiAwKSB7XG4gICAgICBjaHVuay5jaGlsZHJlbiA9IGNobGQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNodW5rLnR4dCA9IHNwYW4udHh0O1xuICAgIH1cbiAgICBjaHVua3MucHVzaChjaHVuayk7XG4gICAgc3RhcnQgPSBzcGFuLmVuZCArIDE7IC8vICcrMScgaXMgdG8gc2tpcCB0aGUgZm9ybWF0dGluZyBjaGFyYWN0ZXJcbiAgfVxuXG4gIC8vIEdyYWIgdGhlIHJlbWFpbmluZyB1bnN0eWxlZCBjaHVuaywgYWZ0ZXIgdGhlIGxhc3Qgc3BhblxuICBpZiAoc3RhcnQgPCBlbmQpIHtcbiAgICBjaHVua3MucHVzaCh7XG4gICAgICB0eHQ6IGxpbmUuc2xpY2Uoc3RhcnQsIGVuZClcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBjaHVua3M7XG59XG5cbi8vIERldGVjdCBzdGFydHMgYW5kIGVuZHMgb2YgZm9ybWF0dGluZyBzcGFucy4gVW5mb3JtYXR0ZWQgc3BhbnMgYXJlXG4vLyBpZ25vcmVkIGF0IHRoaXMgc3RhZ2UuXG5mdW5jdGlvbiBzcGFubmlmeShvcmlnaW5hbCwgcmVfc3RhcnQsIHJlX2VuZCwgdHlwZSkge1xuICBjb25zdCByZXN1bHQgPSBbXTtcbiAgbGV0IGluZGV4ID0gMDtcbiAgbGV0IGxpbmUgPSBvcmlnaW5hbC5zbGljZSgwKTsgLy8gbWFrZSBhIGNvcHk7XG5cbiAgd2hpbGUgKGxpbmUubGVuZ3RoID4gMCkge1xuICAgIC8vIG1hdGNoWzBdOyAvLyBtYXRjaCwgbGlrZSAnKmFiYyonXG4gICAgLy8gbWF0Y2hbMV07IC8vIG1hdGNoIGNhcHR1cmVkIGluIHBhcmVudGhlc2lzLCBsaWtlICdhYmMnXG4gICAgLy8gbWF0Y2hbJ2luZGV4J107IC8vIG9mZnNldCB3aGVyZSB0aGUgbWF0Y2ggc3RhcnRlZC5cblxuICAgIC8vIEZpbmQgdGhlIG9wZW5pbmcgdG9rZW4uXG4gICAgY29uc3Qgc3RhcnQgPSByZV9zdGFydC5leGVjKGxpbmUpO1xuICAgIGlmIChzdGFydCA9PSBudWxsKSB7XG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICAvLyBCZWNhdXNlIGphdmFzY3JpcHQgUmVnRXhwIGRvZXMgbm90IHN1cHBvcnQgbG9va2JlaGluZCwgdGhlIGFjdHVhbCBvZmZzZXQgbWF5IG5vdCBwb2ludFxuICAgIC8vIGF0IHRoZSBtYXJrdXAgY2hhcmFjdGVyLiBGaW5kIGl0IGluIHRoZSBtYXRjaGVkIHN0cmluZy5cbiAgICBsZXQgc3RhcnRfb2Zmc2V0ID0gc3RhcnRbJ2luZGV4J10gKyBzdGFydFswXS5sYXN0SW5kZXhPZihzdGFydFsxXSk7XG4gICAgLy8gQ2xpcCB0aGUgcHJvY2Vzc2VkIHBhcnQgb2YgdGhlIHN0cmluZy5cbiAgICBsaW5lID0gbGluZS5zbGljZShzdGFydF9vZmZzZXQgKyAxKTtcbiAgICAvLyBzdGFydF9vZmZzZXQgaXMgYW4gb2Zmc2V0IHdpdGhpbiB0aGUgY2xpcHBlZCBzdHJpbmcuIENvbnZlcnQgdG8gb3JpZ2luYWwgaW5kZXguXG4gICAgc3RhcnRfb2Zmc2V0ICs9IGluZGV4O1xuICAgIC8vIEluZGV4IG5vdyBwb2ludCB0byB0aGUgYmVnaW5uaW5nIG9mICdsaW5lJyB3aXRoaW4gdGhlICdvcmlnaW5hbCcgc3RyaW5nLlxuICAgIGluZGV4ID0gc3RhcnRfb2Zmc2V0ICsgMTtcblxuICAgIC8vIEZpbmQgdGhlIG1hdGNoaW5nIGNsb3NpbmcgdG9rZW4uXG4gICAgY29uc3QgZW5kID0gcmVfZW5kID8gcmVfZW5kLmV4ZWMobGluZSkgOiBudWxsO1xuICAgIGlmIChlbmQgPT0gbnVsbCkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGxldCBlbmRfb2Zmc2V0ID0gZW5kWydpbmRleCddICsgZW5kWzBdLmluZGV4T2YoZW5kWzFdKTtcbiAgICAvLyBDbGlwIHRoZSBwcm9jZXNzZWQgcGFydCBvZiB0aGUgc3RyaW5nLlxuICAgIGxpbmUgPSBsaW5lLnNsaWNlKGVuZF9vZmZzZXQgKyAxKTtcbiAgICAvLyBVcGRhdGUgb2Zmc2V0c1xuICAgIGVuZF9vZmZzZXQgKz0gaW5kZXg7XG4gICAgLy8gSW5kZXggbm93IHBvaW50cyB0byB0aGUgYmVnaW5uaW5nIG9mICdsaW5lJyB3aXRoaW4gdGhlICdvcmlnaW5hbCcgc3RyaW5nLlxuICAgIGluZGV4ID0gZW5kX29mZnNldCArIDE7XG5cbiAgICByZXN1bHQucHVzaCh7XG4gICAgICB0eHQ6IG9yaWdpbmFsLnNsaWNlKHN0YXJ0X29mZnNldCArIDEsIGVuZF9vZmZzZXQpLFxuICAgICAgY2hpbGRyZW46IFtdLFxuICAgICAgYXQ6IHN0YXJ0X29mZnNldCxcbiAgICAgIGVuZDogZW5kX29mZnNldCxcbiAgICAgIHRwOiB0eXBlXG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vLyBDb252ZXJ0IGxpbmVhciBhcnJheSBvciBzcGFucyBpbnRvIGEgdHJlZSByZXByZXNlbnRhdGlvbi5cbi8vIEtlZXAgc3RhbmRhbG9uZSBhbmQgbmVzdGVkIHNwYW5zLCB0aHJvdyBhd2F5IHBhcnRpYWxseSBvdmVybGFwcGluZyBzcGFucy5cbmZ1bmN0aW9uIHRvU3BhblRyZWUoc3BhbnMpIHtcbiAgaWYgKHNwYW5zLmxlbmd0aCA9PSAwKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgY29uc3QgdHJlZSA9IFtzcGFuc1swXV07XG4gIGxldCBsYXN0ID0gc3BhbnNbMF07XG4gIGZvciAobGV0IGkgPSAxOyBpIDwgc3BhbnMubGVuZ3RoOyBpKyspIHtcbiAgICAvLyBLZWVwIHNwYW5zIHdoaWNoIHN0YXJ0IGFmdGVyIHRoZSBlbmQgb2YgdGhlIHByZXZpb3VzIHNwYW4gb3IgdGhvc2Ugd2hpY2hcbiAgICAvLyBhcmUgY29tcGxldGUgd2l0aGluIHRoZSBwcmV2aW91cyBzcGFuLlxuICAgIGlmIChzcGFuc1tpXS5hdCA+IGxhc3QuZW5kKSB7XG4gICAgICAvLyBTcGFuIGlzIGNvbXBsZXRlbHkgb3V0c2lkZSBvZiB0aGUgcHJldmlvdXMgc3Bhbi5cbiAgICAgIHRyZWUucHVzaChzcGFuc1tpXSk7XG4gICAgICBsYXN0ID0gc3BhbnNbaV07XG4gICAgfSBlbHNlIGlmIChzcGFuc1tpXS5lbmQgPD0gbGFzdC5lbmQpIHtcbiAgICAgIC8vIFNwYW4gaXMgZnVsbHkgaW5zaWRlIG9mIHRoZSBwcmV2aW91cyBzcGFuLiBQdXNoIHRvIHN1Ym5vZGUuXG4gICAgICBsYXN0LmNoaWxkcmVuLnB1c2goc3BhbnNbaV0pO1xuICAgIH1cbiAgICAvLyBTcGFuIGNvdWxkIHBhcnRpYWxseSBvdmVybGFwLCBpZ25vcmluZyBpdCBhcyBpbnZhbGlkLlxuICB9XG5cbiAgLy8gUmVjdXJzaXZlbHkgcmVhcnJhbmdlIHRoZSBzdWJub2Rlcy5cbiAgZm9yIChsZXQgaSBpbiB0cmVlKSB7XG4gICAgdHJlZVtpXS5jaGlsZHJlbiA9IHRvU3BhblRyZWUodHJlZVtpXS5jaGlsZHJlbik7XG4gIH1cblxuICByZXR1cm4gdHJlZTtcbn1cblxuLy8gQ29udmVydCBkcmFmdHkgZG9jdW1lbnQgdG8gYSB0cmVlLlxuZnVuY3Rpb24gZHJhZnR5VG9UcmVlKGRvYykge1xuICBpZiAoIWRvYykge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgZG9jID0gKHR5cGVvZiBkb2MgPT0gJ3N0cmluZycpID8ge1xuICAgIHR4dDogZG9jXG4gIH0gOiBkb2M7XG4gIGxldCB7XG4gICAgdHh0LFxuICAgIGZtdCxcbiAgICBlbnRcbiAgfSA9IGRvYztcblxuICB0eHQgPSB0eHQgfHwgJyc7XG4gIGlmICghQXJyYXkuaXNBcnJheShlbnQpKSB7XG4gICAgZW50ID0gW107XG4gIH1cblxuICBpZiAoIUFycmF5LmlzQXJyYXkoZm10KSB8fCBmbXQubGVuZ3RoID09IDApIHtcbiAgICBpZiAoZW50Lmxlbmd0aCA9PSAwKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0ZXh0OiB0eHRcbiAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gSGFuZGxlIHNwZWNpYWwgY2FzZSB3aGVuIGFsbCB2YWx1ZXMgaW4gZm10IGFyZSAwIGFuZCBmbXQgdGhlcmVmb3JlIGlzIHNraXBwZWQuXG4gICAgZm10ID0gW3tcbiAgICAgIGF0OiAwLFxuICAgICAgbGVuOiAwLFxuICAgICAga2V5OiAwXG4gICAgfV07XG4gIH1cblxuICAvLyBTYW5pdGl6ZSBzcGFucy5cbiAgY29uc3Qgc3BhbnMgPSBbXTtcbiAgY29uc3QgYXR0YWNobWVudHMgPSBbXTtcbiAgZm10LmZvckVhY2goKHNwYW4pID0+IHtcbiAgICBpZiAoIXNwYW4gfHwgdHlwZW9mIHNwYW4gIT0gJ29iamVjdCcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIVsndW5kZWZpbmVkJywgJ251bWJlciddLmluY2x1ZGVzKHR5cGVvZiBzcGFuLmF0KSkge1xuICAgICAgLy8gUHJlc2VudCwgYnV0IG5vbi1udW1lcmljICdhdCcuXG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghWyd1bmRlZmluZWQnLCAnbnVtYmVyJ10uaW5jbHVkZXModHlwZW9mIHNwYW4ubGVuKSkge1xuICAgICAgLy8gUHJlc2VudCwgYnV0IG5vbi1udW1lcmljICdsZW4nLlxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBsZXQgYXQgPSBzcGFuLmF0IHwgMDtcbiAgICBsZXQgbGVuID0gc3Bhbi5sZW4gfCAwO1xuICAgIGlmIChsZW4gPCAwKSB7XG4gICAgICAvLyBJbnZhbGlkIHNwYW4gbGVuZ3RoLlxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBrZXkgPSBzcGFuLmtleSB8fCAwO1xuICAgIGlmIChlbnQubGVuZ3RoID4gMCAmJiAodHlwZW9mIGtleSAhPSAnbnVtYmVyJyB8fCBrZXkgPCAwIHx8IGtleSA+PSBlbnQubGVuZ3RoKSkge1xuICAgICAgLy8gSW52YWxpZCBrZXkgdmFsdWUuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGF0IDw9IC0xKSB7XG4gICAgICAvLyBBdHRhY2htZW50LiBTdG9yZSBhdHRhY2htZW50cyBzZXBhcmF0ZWx5LlxuICAgICAgYXR0YWNobWVudHMucHVzaCh7XG4gICAgICAgIHN0YXJ0OiAtMSxcbiAgICAgICAgZW5kOiAwLFxuICAgICAgICBrZXk6IGtleVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfSBlbHNlIGlmIChhdCArIGxlbiA+IHR4dC5sZW5ndGgpIHtcbiAgICAgIC8vIFNwYW4gaXMgb3V0IG9mIGJvdW5kcy5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIXNwYW4udHApIHtcbiAgICAgIGlmIChlbnQubGVuZ3RoID4gMCAmJiAodHlwZW9mIGVudFtrZXldID09ICdvYmplY3QnKSkge1xuICAgICAgICBzcGFucy5wdXNoKHtcbiAgICAgICAgICBzdGFydDogYXQsXG4gICAgICAgICAgZW5kOiBhdCArIGxlbixcbiAgICAgICAgICBrZXk6IGtleVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgc3BhbnMucHVzaCh7XG4gICAgICAgIHR5cGU6IHNwYW4udHAsXG4gICAgICAgIHN0YXJ0OiBhdCxcbiAgICAgICAgZW5kOiBhdCArIGxlblxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcblxuICAvLyBTb3J0IHNwYW5zIGZpcnN0IGJ5IHN0YXJ0IGluZGV4IChhc2MpIHRoZW4gYnkgbGVuZ3RoIChkZXNjKSwgdGhlbiBieSB3ZWlnaHQuXG4gIHNwYW5zLnNvcnQoKGEsIGIpID0+IHtcbiAgICBsZXQgZGlmZiA9IGEuc3RhcnQgLSBiLnN0YXJ0O1xuICAgIGlmIChkaWZmICE9IDApIHtcbiAgICAgIHJldHVybiBkaWZmO1xuICAgIH1cbiAgICBkaWZmID0gYi5lbmQgLSBhLmVuZDtcbiAgICBpZiAoZGlmZiAhPSAwKSB7XG4gICAgICByZXR1cm4gZGlmZjtcbiAgICB9XG4gICAgcmV0dXJuIEZNVF9XRUlHSFQuaW5kZXhPZihiLnR5cGUpIC0gRk1UX1dFSUdIVC5pbmRleE9mKGEudHlwZSk7XG4gIH0pO1xuXG4gIC8vIE1vdmUgYXR0YWNobWVudHMgdG8gdGhlIGVuZCBvZiB0aGUgbGlzdC5cbiAgaWYgKGF0dGFjaG1lbnRzLmxlbmd0aCA+IDApIHtcbiAgICBzcGFucy5wdXNoKC4uLmF0dGFjaG1lbnRzKTtcbiAgfVxuXG4gIHNwYW5zLmZvckVhY2goKHNwYW4pID0+IHtcbiAgICBpZiAoZW50Lmxlbmd0aCA+IDAgJiYgIXNwYW4udHlwZSAmJiBlbnRbc3Bhbi5rZXldICYmIHR5cGVvZiBlbnRbc3Bhbi5rZXldID09ICdvYmplY3QnKSB7XG4gICAgICBzcGFuLnR5cGUgPSBlbnRbc3Bhbi5rZXldLnRwO1xuICAgICAgc3Bhbi5kYXRhID0gZW50W3NwYW4ua2V5XS5kYXRhO1xuICAgIH1cblxuICAgIC8vIElzIHR5cGUgc3RpbGwgdW5kZWZpbmVkPyBIaWRlIHRoZSBpbnZhbGlkIGVsZW1lbnQhXG4gICAgaWYgKCFzcGFuLnR5cGUpIHtcbiAgICAgIHNwYW4udHlwZSA9ICdIRCc7XG4gICAgfVxuICB9KTtcblxuICBsZXQgdHJlZSA9IHNwYW5zVG9UcmVlKHt9LCB0eHQsIDAsIHR4dC5sZW5ndGgsIHNwYW5zKTtcblxuICAvLyBGbGF0dGVuIHRyZWUgbm9kZXMuXG4gIGNvbnN0IGZsYXR0ZW4gPSBmdW5jdGlvbihub2RlKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkobm9kZS5jaGlsZHJlbikgJiYgbm9kZS5jaGlsZHJlbi5sZW5ndGggPT0gMSkge1xuICAgICAgLy8gVW53cmFwLlxuICAgICAgY29uc3QgY2hpbGQgPSBub2RlLmNoaWxkcmVuWzBdO1xuICAgICAgaWYgKCFub2RlLnR5cGUpIHtcbiAgICAgICAgY29uc3QgcGFyZW50ID0gbm9kZS5wYXJlbnQ7XG4gICAgICAgIG5vZGUgPSBjaGlsZDtcbiAgICAgICAgbm9kZS5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgICB9IGVsc2UgaWYgKCFjaGlsZC50eXBlICYmICFjaGlsZC5jaGlsZHJlbikge1xuICAgICAgICBub2RlLnRleHQgPSBjaGlsZC50ZXh0O1xuICAgICAgICBkZWxldGUgbm9kZS5jaGlsZHJlbjtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cbiAgdHJlZSA9IHRyZWVUb3BEb3duKHRyZWUsIGZsYXR0ZW4pO1xuXG4gIHJldHVybiB0cmVlO1xufVxuXG4vLyBBZGQgdHJlZSBub2RlIHRvIGEgcGFyZW50IHRyZWUuXG5mdW5jdGlvbiBhZGROb2RlKHBhcmVudCwgbikge1xuICBpZiAoIW4pIHtcbiAgICByZXR1cm4gcGFyZW50O1xuICB9XG5cbiAgaWYgKCFwYXJlbnQuY2hpbGRyZW4pIHtcbiAgICBwYXJlbnQuY2hpbGRyZW4gPSBbXTtcbiAgfVxuXG4gIC8vIElmIHRleHQgaXMgcHJlc2VudCwgbW92ZSBpdCB0byBhIHN1Ym5vZGUuXG4gIGlmIChwYXJlbnQudGV4dCkge1xuICAgIHBhcmVudC5jaGlsZHJlbi5wdXNoKHtcbiAgICAgIHRleHQ6IHBhcmVudC50ZXh0LFxuICAgICAgcGFyZW50OiBwYXJlbnRcbiAgICB9KTtcbiAgICBkZWxldGUgcGFyZW50LnRleHQ7XG4gIH1cblxuICBuLnBhcmVudCA9IHBhcmVudDtcbiAgcGFyZW50LmNoaWxkcmVuLnB1c2gobik7XG5cbiAgcmV0dXJuIHBhcmVudDtcbn1cblxuLy8gUmV0dXJucyBhIHRyZWUgb2Ygbm9kZXMuXG5mdW5jdGlvbiBzcGFuc1RvVHJlZShwYXJlbnQsIHRleHQsIHN0YXJ0LCBlbmQsIHNwYW5zKSB7XG4gIGlmICghc3BhbnMgfHwgc3BhbnMubGVuZ3RoID09IDApIHtcbiAgICBpZiAoc3RhcnQgPCBlbmQpIHtcbiAgICAgIGFkZE5vZGUocGFyZW50LCB7XG4gICAgICAgIHRleHQ6IHRleHQuc3Vic3RyaW5nKHN0YXJ0LCBlbmQpXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHBhcmVudDtcbiAgfVxuXG4gIC8vIFByb2Nlc3Mgc3Vic3BhbnMuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc3BhbnMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBzcGFuID0gc3BhbnNbaV07XG4gICAgaWYgKHNwYW4uc3RhcnQgPCAwICYmIHNwYW4udHlwZSA9PSAnRVgnKSB7XG4gICAgICBhZGROb2RlKHBhcmVudCwge1xuICAgICAgICB0eXBlOiBzcGFuLnR5cGUsXG4gICAgICAgIGRhdGE6IHNwYW4uZGF0YSxcbiAgICAgICAga2V5OiBzcGFuLmtleSxcbiAgICAgICAgYXR0OiB0cnVlXG4gICAgICB9KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIEFkZCB1bi1zdHlsZWQgcmFuZ2UgYmVmb3JlIHRoZSBzdHlsZWQgc3BhbiBzdGFydHMuXG4gICAgaWYgKHN0YXJ0IDwgc3Bhbi5zdGFydCkge1xuICAgICAgYWRkTm9kZShwYXJlbnQsIHtcbiAgICAgICAgdGV4dDogdGV4dC5zdWJzdHJpbmcoc3RhcnQsIHNwYW4uc3RhcnQpXG4gICAgICB9KTtcbiAgICAgIHN0YXJ0ID0gc3Bhbi5zdGFydDtcbiAgICB9XG5cbiAgICAvLyBHZXQgYWxsIHNwYW5zIHdoaWNoIGFyZSB3aXRoaW4gdGhlIGN1cnJlbnQgc3Bhbi5cbiAgICBjb25zdCBzdWJzcGFucyA9IFtdO1xuICAgIHdoaWxlIChpIDwgc3BhbnMubGVuZ3RoIC0gMSkge1xuICAgICAgY29uc3QgaW5uZXIgPSBzcGFuc1tpICsgMV07XG4gICAgICBpZiAoaW5uZXIuc3RhcnQgPCAwKSB7XG4gICAgICAgIC8vIEF0dGFjaG1lbnRzIGFyZSBpbiB0aGUgZW5kLiBTdG9wLlxuICAgICAgICBicmVhaztcbiAgICAgIH0gZWxzZSBpZiAoaW5uZXIuc3RhcnQgPCBzcGFuLmVuZCkge1xuICAgICAgICBpZiAoaW5uZXIuZW5kIDw9IHNwYW4uZW5kKSB7XG4gICAgICAgICAgY29uc3QgdGFnID0gSFRNTF9UQUdTW2lubmVyLnRwXSB8fCB7fTtcbiAgICAgICAgICBpZiAoaW5uZXIuc3RhcnQgPCBpbm5lci5lbmQgfHwgdGFnLmlzVm9pZCkge1xuICAgICAgICAgICAgLy8gVmFsaWQgc3Vic3BhbjogY29tcGxldGVseSB3aXRoaW4gdGhlIGN1cnJlbnQgc3BhbiBhbmRcbiAgICAgICAgICAgIC8vIGVpdGhlciBub24temVybyBsZW5ndGggb3IgemVybyBsZW5ndGggaXMgYWNjZXB0YWJsZS5cbiAgICAgICAgICAgIHN1YnNwYW5zLnB1c2goaW5uZXIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpKys7XG4gICAgICAgIC8vIE92ZXJsYXBwaW5nIHN1YnNwYW5zIGFyZSBpZ25vcmVkLlxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gUGFzdCB0aGUgZW5kIG9mIHRoZSBjdXJyZW50IHNwYW4uIFN0b3AuXG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGFkZE5vZGUocGFyZW50LCBzcGFuc1RvVHJlZSh7XG4gICAgICB0eXBlOiBzcGFuLnR5cGUsXG4gICAgICBkYXRhOiBzcGFuLmRhdGEsXG4gICAgICBrZXk6IHNwYW4ua2V5XG4gICAgfSwgdGV4dCwgc3RhcnQsIHNwYW4uZW5kLCBzdWJzcGFucykpO1xuICAgIHN0YXJ0ID0gc3Bhbi5lbmQ7XG4gIH1cblxuICAvLyBBZGQgdGhlIGxhc3QgdW5mb3JtYXR0ZWQgcmFuZ2UuXG4gIGlmIChzdGFydCA8IGVuZCkge1xuICAgIGFkZE5vZGUocGFyZW50LCB7XG4gICAgICB0ZXh0OiB0ZXh0LnN1YnN0cmluZyhzdGFydCwgZW5kKVxuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIHBhcmVudDtcbn1cblxuLy8gQXBwZW5kIGEgdHJlZSB0byBhIERyYWZ0eSBkb2MuXG5mdW5jdGlvbiB0cmVlVG9EcmFmdHkoZG9jLCB0cmVlLCBrZXltYXApIHtcbiAgaWYgKCF0cmVlKSB7XG4gICAgcmV0dXJuIGRvYztcbiAgfVxuXG4gIGRvYy50eHQgPSBkb2MudHh0IHx8ICcnO1xuXG4gIC8vIENoZWNrcG9pbnQgdG8gbWVhc3VyZSBsZW5ndGggb2YgdGhlIGN1cnJlbnQgdHJlZSBub2RlLlxuICBjb25zdCBzdGFydCA9IGRvYy50eHQubGVuZ3RoO1xuXG4gIGlmICh0cmVlLnRleHQpIHtcbiAgICBkb2MudHh0ICs9IHRyZWUudGV4dDtcbiAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHRyZWUuY2hpbGRyZW4pKSB7XG4gICAgdHJlZS5jaGlsZHJlbi5mb3JFYWNoKChjKSA9PiB7XG4gICAgICB0cmVlVG9EcmFmdHkoZG9jLCBjLCBrZXltYXApO1xuICAgIH0pO1xuICB9XG5cbiAgaWYgKHRyZWUudHlwZSkge1xuICAgIGNvbnN0IGxlbiA9IGRvYy50eHQubGVuZ3RoIC0gc3RhcnQ7XG4gICAgZG9jLmZtdCA9IGRvYy5mbXQgfHwgW107XG4gICAgaWYgKE9iamVjdC5rZXlzKHRyZWUuZGF0YSB8fCB7fSkubGVuZ3RoID4gMCkge1xuICAgICAgZG9jLmVudCA9IGRvYy5lbnQgfHwgW107XG4gICAgICBjb25zdCBuZXdLZXkgPSAodHlwZW9mIGtleW1hcFt0cmVlLmtleV0gPT0gJ3VuZGVmaW5lZCcpID8gZG9jLmVudC5sZW5ndGggOiBrZXltYXBbdHJlZS5rZXldO1xuICAgICAga2V5bWFwW3RyZWUua2V5XSA9IG5ld0tleTtcbiAgICAgIGRvYy5lbnRbbmV3S2V5XSA9IHtcbiAgICAgICAgdHA6IHRyZWUudHlwZSxcbiAgICAgICAgZGF0YTogdHJlZS5kYXRhXG4gICAgICB9O1xuICAgICAgaWYgKHRyZWUuYXR0KSB7XG4gICAgICAgIC8vIEF0dGFjaG1lbnQuXG4gICAgICAgIGRvYy5mbXQucHVzaCh7XG4gICAgICAgICAgYXQ6IC0xLFxuICAgICAgICAgIGxlbjogMCxcbiAgICAgICAgICBrZXk6IG5ld0tleVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRvYy5mbXQucHVzaCh7XG4gICAgICAgICAgYXQ6IHN0YXJ0LFxuICAgICAgICAgIGxlbjogbGVuLFxuICAgICAgICAgIGtleTogbmV3S2V5XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBkb2MuZm10LnB1c2goe1xuICAgICAgICB0cDogdHJlZS50eXBlLFxuICAgICAgICBhdDogc3RhcnQsXG4gICAgICAgIGxlbjogbGVuXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRvYztcbn1cblxuLy8gVHJhdmVyc2UgdGhlIHRyZWUgdG9wIGRvd24gdHJhbnNmb3JtaW5nIHRoZSBub2RlczogYXBwbHkgdHJhbnNmb3JtZXIgdG8gZXZlcnkgdHJlZSBub2RlLlxuZnVuY3Rpb24gdHJlZVRvcERvd24oc3JjLCB0cmFuc2Zvcm1lciwgY29udGV4dCkge1xuICBpZiAoIXNyYykge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgbGV0IGRzdCA9IHRyYW5zZm9ybWVyLmNhbGwoY29udGV4dCwgc3JjKTtcbiAgaWYgKCFkc3QgfHwgIWRzdC5jaGlsZHJlbikge1xuICAgIHJldHVybiBkc3Q7XG4gIH1cblxuICBjb25zdCBjaGlsZHJlbiA9IFtdO1xuICBmb3IgKGxldCBpIGluIGRzdC5jaGlsZHJlbikge1xuICAgIGxldCBuID0gZHN0LmNoaWxkcmVuW2ldO1xuICAgIGlmIChuKSB7XG4gICAgICBuID0gdHJlZVRvcERvd24obiwgdHJhbnNmb3JtZXIsIGNvbnRleHQpO1xuICAgICAgaWYgKG4pIHtcbiAgICAgICAgY2hpbGRyZW4ucHVzaChuKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAoY2hpbGRyZW4ubGVuZ3RoID09IDApIHtcbiAgICBkc3QuY2hpbGRyZW4gPSBudWxsO1xuICB9IGVsc2Uge1xuICAgIGRzdC5jaGlsZHJlbiA9IGNoaWxkcmVuO1xuICB9XG5cbiAgcmV0dXJuIGRzdDtcbn1cblxuLy8gVHJhdmVyc2UgdGhlIHRyZWUgYm90dG9tLXVwOiBhcHBseSBmb3JtYXR0ZXIgdG8gZXZlcnkgbm9kZS5cbi8vIFRoZSBmb3JtYXR0ZXIgbXVzdCBtYWludGFpbiBpdHMgc3RhdGUgdGhyb3VnaCBjb250ZXh0LlxuZnVuY3Rpb24gdHJlZUJvdHRvbVVwKHNyYywgZm9ybWF0dGVyLCBpbmRleCwgc3RhY2ssIGNvbnRleHQpIHtcbiAgaWYgKCFzcmMpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGlmIChzdGFjayAmJiBzcmMudHlwZSkge1xuICAgIHN0YWNrLnB1c2goc3JjLnR5cGUpO1xuICB9XG5cbiAgbGV0IHZhbHVlcyA9IFtdO1xuICBmb3IgKGxldCBpIGluIHNyYy5jaGlsZHJlbikge1xuICAgIGNvbnN0IG4gPSB0cmVlQm90dG9tVXAoc3JjLmNoaWxkcmVuW2ldLCBmb3JtYXR0ZXIsIGksIHN0YWNrLCBjb250ZXh0KTtcbiAgICBpZiAobikge1xuICAgICAgdmFsdWVzLnB1c2gobik7XG4gICAgfVxuICB9XG4gIGlmICh2YWx1ZXMubGVuZ3RoID09IDApIHtcbiAgICBpZiAoc3JjLnRleHQpIHtcbiAgICAgIHZhbHVlcyA9IFtzcmMudGV4dF07XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbHVlcyA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgaWYgKHN0YWNrICYmIHNyYy50eXBlKSB7XG4gICAgc3RhY2sucG9wKCk7XG4gIH1cblxuICByZXR1cm4gZm9ybWF0dGVyLmNhbGwoY29udGV4dCwgc3JjLnR5cGUsIHNyYy5kYXRhLCB2YWx1ZXMsIGluZGV4LCBzdGFjayk7XG59XG5cbi8vIENsaXAgdHJlZSB0byB0aGUgcHJvdmlkZWQgbGltaXQuXG5mdW5jdGlvbiBzaG9ydGVuVHJlZSh0cmVlLCBsaW1pdCwgdGFpbCkge1xuICBpZiAoIXRyZWUpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGlmICh0YWlsKSB7XG4gICAgbGltaXQgLT0gdGFpbC5sZW5ndGg7XG4gIH1cblxuICBjb25zdCBzaG9ydGVuZXIgPSBmdW5jdGlvbihub2RlKSB7XG4gICAgaWYgKGxpbWl0IDw9IC0xKSB7XG4gICAgICAvLyBMaW1pdCAtMSBtZWFucyB0aGUgZG9jIHdhcyBhbHJlYWR5IGNsaXBwZWQuXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAobm9kZS5hdHQpIHtcbiAgICAgIC8vIEF0dGFjaG1lbnRzIGFyZSB1bmNoYW5nZWQuXG4gICAgICByZXR1cm4gbm9kZTtcbiAgICB9XG4gICAgaWYgKGxpbWl0ID09IDApIHtcbiAgICAgIG5vZGUudGV4dCA9IHRhaWw7XG4gICAgICBsaW1pdCA9IC0xO1xuICAgIH0gZWxzZSBpZiAobm9kZS50ZXh0KSB7XG4gICAgICBjb25zdCBsZW4gPSBub2RlLnRleHQubGVuZ3RoO1xuICAgICAgaWYgKGxlbiA+IGxpbWl0KSB7XG4gICAgICAgIG5vZGUudGV4dCA9IG5vZGUudGV4dC5zdWJzdHJpbmcoMCwgbGltaXQpICsgdGFpbDtcbiAgICAgICAgbGltaXQgPSAtMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxpbWl0IC09IGxlbjtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cblxuICByZXR1cm4gdHJlZVRvcERvd24odHJlZSwgc2hvcnRlbmVyKTtcbn1cblxuLy8gU3RyaXAgaGVhdnkgZW50aXRpZXMgZnJvbSBhIHRyZWUuXG5mdW5jdGlvbiBsaWdodEVudGl0eSh0cmVlLCBhbGxvdykge1xuICBjb25zdCBsaWdodENvcHkgPSAobm9kZSkgPT4ge1xuICAgIGNvbnN0IGRhdGEgPSBjb3B5RW50RGF0YShub2RlLmRhdGEsIHRydWUsIGFsbG93ID8gYWxsb3cobm9kZSkgOiBudWxsKTtcbiAgICBpZiAoZGF0YSkge1xuICAgICAgbm9kZS5kYXRhID0gZGF0YTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVsZXRlIG5vZGUuZGF0YTtcbiAgICB9XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cbiAgcmV0dXJuIHRyZWVUb3BEb3duKHRyZWUsIGxpZ2h0Q29weSk7XG59XG5cbi8vIFJlbW92ZSBzcGFjZXMgYW5kIGJyZWFrcyBvbiB0aGUgbGVmdC5cbmZ1bmN0aW9uIGxUcmltKHRyZWUpIHtcbiAgaWYgKHRyZWUudHlwZSA9PSAnQlInKSB7XG4gICAgdHJlZSA9IG51bGw7XG4gIH0gZWxzZSBpZiAodHJlZS50ZXh0KSB7XG4gICAgaWYgKCF0cmVlLnR5cGUpIHtcbiAgICAgIHRyZWUudGV4dCA9IHRyZWUudGV4dC50cmltU3RhcnQoKTtcbiAgICAgIGlmICghdHJlZS50ZXh0KSB7XG4gICAgICAgIHRyZWUgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIGlmICghdHJlZS50eXBlICYmIHRyZWUuY2hpbGRyZW4gJiYgdHJlZS5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgY29uc3QgYyA9IGxUcmltKHRyZWUuY2hpbGRyZW5bMF0pO1xuICAgIGlmIChjKSB7XG4gICAgICB0cmVlLmNoaWxkcmVuWzBdID0gYztcbiAgICB9IGVsc2Uge1xuICAgICAgdHJlZS5jaGlsZHJlbi5zaGlmdCgpO1xuICAgICAgaWYgKCF0cmVlLnR5cGUgJiYgdHJlZS5jaGlsZHJlbi5sZW5ndGggPT0gMCkge1xuICAgICAgICB0cmVlID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRyZWU7XG59XG5cbi8vIE1vdmUgYXR0YWNobWVudHMgdG8gdGhlIGVuZC4gQXR0YWNobWVudHMgbXVzdCBiZSBhdCB0aGUgdG9wIGxldmVsLCBubyBuZWVkIHRvIHRyYXZlcnNlIHRoZSB0cmVlLlxuZnVuY3Rpb24gYXR0YWNobWVudHNUb0VuZCh0cmVlLCBsaW1pdCkge1xuICBpZiAoIXRyZWUpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGlmICh0cmVlLmF0dCkge1xuICAgIHRyZWUudGV4dCA9ICcgJztcbiAgICBkZWxldGUgdHJlZS5hdHQ7XG4gICAgZGVsZXRlIHRyZWUuY2hpbGRyZW47XG4gIH0gZWxzZSBpZiAodHJlZS5jaGlsZHJlbikge1xuICAgIGNvbnN0IGF0dGFjaG1lbnRzID0gW107XG4gICAgY29uc3QgY2hpbGRyZW4gPSBbXTtcbiAgICBmb3IgKGxldCBpIGluIHRyZWUuY2hpbGRyZW4pIHtcbiAgICAgIGNvbnN0IGMgPSB0cmVlLmNoaWxkcmVuW2ldO1xuICAgICAgaWYgKGMuYXR0KSB7XG4gICAgICAgIGlmIChhdHRhY2htZW50cy5sZW5ndGggPT0gbGltaXQpIHtcbiAgICAgICAgICAvLyBUb28gbWFueSBhdHRhY2htZW50cyB0byBwcmV2aWV3O1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjLmRhdGFbJ21pbWUnXSA9PSBKU09OX01JTUVfVFlQRSkge1xuICAgICAgICAgIC8vIEpTT04gYXR0YWNobWVudHMgYXJlIG5vdCBzaG93biBpbiBwcmV2aWV3LlxuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZGVsZXRlIGMuYXR0O1xuICAgICAgICBkZWxldGUgYy5jaGlsZHJlbjtcbiAgICAgICAgYy50ZXh0ID0gJyAnO1xuICAgICAgICBhdHRhY2htZW50cy5wdXNoKGMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2hpbGRyZW4ucHVzaChjKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdHJlZS5jaGlsZHJlbiA9IGNoaWxkcmVuLmNvbmNhdChhdHRhY2htZW50cyk7XG4gIH1cbiAgcmV0dXJuIHRyZWU7XG59XG5cbi8vIEdldCBhIGxpc3Qgb2YgZW50aXRpZXMgZnJvbSBhIHRleHQuXG5mdW5jdGlvbiBleHRyYWN0RW50aXRpZXMobGluZSkge1xuICBsZXQgbWF0Y2g7XG4gIGxldCBleHRyYWN0ZWQgPSBbXTtcbiAgRU5USVRZX1RZUEVTLmZvckVhY2goKGVudGl0eSkgPT4ge1xuICAgIHdoaWxlICgobWF0Y2ggPSBlbnRpdHkucmUuZXhlYyhsaW5lKSkgIT09IG51bGwpIHtcbiAgICAgIGV4dHJhY3RlZC5wdXNoKHtcbiAgICAgICAgb2Zmc2V0OiBtYXRjaFsnaW5kZXgnXSxcbiAgICAgICAgbGVuOiBtYXRjaFswXS5sZW5ndGgsXG4gICAgICAgIHVuaXF1ZTogbWF0Y2hbMF0sXG4gICAgICAgIGRhdGE6IGVudGl0eS5wYWNrKG1hdGNoWzBdKSxcbiAgICAgICAgdHlwZTogZW50aXR5Lm5hbWVcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG5cbiAgaWYgKGV4dHJhY3RlZC5sZW5ndGggPT0gMCkge1xuICAgIHJldHVybiBleHRyYWN0ZWQ7XG4gIH1cblxuICAvLyBSZW1vdmUgZW50aXRpZXMgZGV0ZWN0ZWQgaW5zaWRlIG90aGVyIGVudGl0aWVzLCBsaWtlICNoYXNodGFnIGluIGEgVVJMLlxuICBleHRyYWN0ZWQuc29ydCgoYSwgYikgPT4ge1xuICAgIHJldHVybiBhLm9mZnNldCAtIGIub2Zmc2V0O1xuICB9KTtcblxuICBsZXQgaWR4ID0gLTE7XG4gIGV4dHJhY3RlZCA9IGV4dHJhY3RlZC5maWx0ZXIoKGVsKSA9PiB7XG4gICAgY29uc3QgcmVzdWx0ID0gKGVsLm9mZnNldCA+IGlkeCk7XG4gICAgaWR4ID0gZWwub2Zmc2V0ICsgZWwubGVuO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH0pO1xuXG4gIHJldHVybiBleHRyYWN0ZWQ7XG59XG5cbi8vIENvbnZlcnQgdGhlIGNodW5rcyBpbnRvIGZvcm1hdCBzdWl0YWJsZSBmb3Igc2VyaWFsaXphdGlvbi5cbmZ1bmN0aW9uIGRyYWZ0aWZ5KGNodW5rcywgc3RhcnRBdCkge1xuICBsZXQgcGxhaW4gPSAnJztcbiAgbGV0IHJhbmdlcyA9IFtdO1xuICBmb3IgKGxldCBpIGluIGNodW5rcykge1xuICAgIGNvbnN0IGNodW5rID0gY2h1bmtzW2ldO1xuICAgIGlmICghY2h1bmsudHh0KSB7XG4gICAgICBjb25zdCBkcmFmdHkgPSBkcmFmdGlmeShjaHVuay5jaGlsZHJlbiwgcGxhaW4ubGVuZ3RoICsgc3RhcnRBdCk7XG4gICAgICBjaHVuay50eHQgPSBkcmFmdHkudHh0O1xuICAgICAgcmFuZ2VzID0gcmFuZ2VzLmNvbmNhdChkcmFmdHkuZm10KTtcbiAgICB9XG5cbiAgICBpZiAoY2h1bmsudHApIHtcbiAgICAgIHJhbmdlcy5wdXNoKHtcbiAgICAgICAgYXQ6IHBsYWluLmxlbmd0aCArIHN0YXJ0QXQsXG4gICAgICAgIGxlbjogY2h1bmsudHh0Lmxlbmd0aCxcbiAgICAgICAgdHA6IGNodW5rLnRwXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBwbGFpbiArPSBjaHVuay50eHQ7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICB0eHQ6IHBsYWluLFxuICAgIGZtdDogcmFuZ2VzXG4gIH07XG59XG5cbi8vIENyZWF0ZSBhIGNvcHkgb2YgZW50aXR5IGRhdGEgd2l0aCAobGlnaHQ9ZmFsc2UpIG9yIHdpdGhvdXQgKGxpZ2h0PXRydWUpIHRoZSBsYXJnZSBwYXlsb2FkLlxuLy8gVGhlIGFycmF5ICdhbGxvdycgY29udGFpbnMgYSBsaXN0IG9mIGZpZWxkcyBleGVtcHQgZnJvbSBzdHJpcHBpbmcuXG5mdW5jdGlvbiBjb3B5RW50RGF0YShkYXRhLCBsaWdodCwgYWxsb3cpIHtcbiAgaWYgKGRhdGEgJiYgT2JqZWN0LmVudHJpZXMoZGF0YSkubGVuZ3RoID4gMCkge1xuICAgIGFsbG93ID0gYWxsb3cgfHwgW107XG4gICAgY29uc3QgZGMgPSB7fTtcbiAgICBBTExPV0VEX0VOVF9GSUVMRFMuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICBpZiAoZGF0YVtrZXldKSB7XG4gICAgICAgIGlmIChsaWdodCAmJiAhYWxsb3cuaW5jbHVkZXMoa2V5KSAmJlxuICAgICAgICAgICh0eXBlb2YgZGF0YVtrZXldID09ICdzdHJpbmcnIHx8IEFycmF5LmlzQXJyYXkoZGF0YVtrZXldKSkgJiZcbiAgICAgICAgICBkYXRhW2tleV0ubGVuZ3RoID4gTUFYX1BSRVZJRVdfREFUQV9TSVpFKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgZGF0YVtrZXldID09ICdvYmplY3QnKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGRjW2tleV0gPSBkYXRhW2tleV07XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAoT2JqZWN0LmVudHJpZXMoZGMpLmxlbmd0aCAhPSAwKSB7XG4gICAgICByZXR1cm4gZGM7XG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG5pZiAodHlwZW9mIG1vZHVsZSAhPSAndW5kZWZpbmVkJykge1xuICBtb2R1bGUuZXhwb3J0cyA9IERyYWZ0eTtcbn1cbiIsIi8qKlxuICogQGZpbGUgVXRpbGl0aWVzIGZvciB1cGxvYWRpbmcgYW5kIGRvd25sb2FkaW5nIGZpbGVzLlxuICpcbiAqIEBjb3B5cmlnaHQgMjAxNS0yMDIyIFRpbm9kZSBMTEMuXG4gKi9cbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHtcbiAganNvblBhcnNlSGVscGVyXG59IGZyb20gJy4vdXRpbHMuanMnO1xuXG5sZXQgWEhSUHJvdmlkZXI7XG5cbi8qKlxuICogQGNsYXNzIExhcmdlRmlsZUhlbHBlciAtIHV0aWxpdGllcyBmb3IgdXBsb2FkaW5nIGFuZCBkb3dubG9hZGluZyBmaWxlcyBvdXQgb2YgYmFuZC5cbiAqIERvbid0IGluc3RhbnRpYXRlIHRoaXMgY2xhc3MgZGlyZWN0bHkuIFVzZSB7VGlub2RlLmdldExhcmdlRmlsZUhlbHBlcn0gaW5zdGVhZC5cbiAqIEBtZW1iZXJvZiBUaW5vZGVcbiAqXG4gKiBAcGFyYW0ge1Rpbm9kZX0gdGlub2RlIC0gdGhlIG1haW4gVGlub2RlIG9iamVjdC5cbiAqIEBwYXJhbSB7c3RyaW5nfSB2ZXJzaW9uIC0gcHJvdG9jb2wgdmVyc2lvbiwgaS5lLiAnMCcuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExhcmdlRmlsZUhlbHBlciB7XG4gIGNvbnN0cnVjdG9yKHRpbm9kZSwgdmVyc2lvbikge1xuICAgIHRoaXMuX3Rpbm9kZSA9IHRpbm9kZTtcbiAgICB0aGlzLl92ZXJzaW9uID0gdmVyc2lvbjtcblxuICAgIHRoaXMuX2FwaUtleSA9IHRpbm9kZS5fYXBpS2V5O1xuICAgIHRoaXMuX2F1dGhUb2tlbiA9IHRpbm9kZS5nZXRBdXRoVG9rZW4oKTtcbiAgICB0aGlzLl9yZXFJZCA9IHRpbm9kZS5nZXROZXh0VW5pcXVlSWQoKTtcbiAgICB0aGlzLnhociA9IG5ldyBYSFJQcm92aWRlcigpO1xuXG4gICAgLy8gUHJvbWlzZVxuICAgIHRoaXMudG9SZXNvbHZlID0gbnVsbDtcbiAgICB0aGlzLnRvUmVqZWN0ID0gbnVsbDtcblxuICAgIC8vIENhbGxiYWNrc1xuICAgIHRoaXMub25Qcm9ncmVzcyA9IG51bGw7XG4gICAgdGhpcy5vblN1Y2Nlc3MgPSBudWxsO1xuICAgIHRoaXMub25GYWlsdXJlID0gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydCB1cGxvYWRpbmcgdGhlIGZpbGUgdG8gYSBub24tZGVmYXVsdCBlbmRwb2ludC5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZS5MYXJnZUZpbGVIZWxwZXIjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBiYXNlVXJsIGFsdGVybmF0aXZlIGJhc2UgVVJMIG9mIHVwbG9hZCBzZXJ2ZXIuXG4gICAqIEBwYXJhbSB7RmlsZXxCbG9ifSBkYXRhIHRvIHVwbG9hZC5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGF2YXRhckZvciB0b3BpYyBuYW1lIGlmIHRoZSB1cGxvYWQgcmVwcmVzZW50cyBhbiBhdmF0YXIuXG4gICAqIEBwYXJhbSB7Q2FsbGJhY2t9IG9uUHJvZ3Jlc3MgY2FsbGJhY2suIFRha2VzIG9uZSB7ZmxvYXR9IHBhcmFtZXRlciAwLi4xXG4gICAqIEBwYXJhbSB7Q2FsbGJhY2t9IG9uU3VjY2VzcyBjYWxsYmFjay4gQ2FsbGVkIHdoZW4gdGhlIGZpbGUgaXMgc3VjY2Vzc2Z1bGx5IHVwbG9hZGVkLlxuICAgKiBAcGFyYW0ge0NhbGxiYWNrfSBvbkZhaWx1cmUgY2FsbGJhY2suIENhbGxlZCBpbiBjYXNlIG9mIGEgZmFpbHVyZS5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIHVwbG9hZCBpcyBjb21wbGV0ZWQvZmFpbGVkLlxuICAgKi9cbiAgdXBsb2FkV2l0aEJhc2VVcmwoYmFzZVVybCwgZGF0YSwgYXZhdGFyRm9yLCBvblByb2dyZXNzLCBvblN1Y2Nlc3MsIG9uRmFpbHVyZSkge1xuICAgIGlmICghdGhpcy5fYXV0aFRva2VuKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNdXN0IGF1dGhlbnRpY2F0ZSBmaXJzdFwiKTtcbiAgICB9XG4gICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzO1xuXG4gICAgbGV0IHVybCA9IGAvdiR7dGhpcy5fdmVyc2lvbn0vZmlsZS91L2A7XG4gICAgaWYgKGJhc2VVcmwpIHtcbiAgICAgIGxldCBiYXNlID0gYmFzZVVybDtcbiAgICAgIGlmIChiYXNlLmVuZHNXaXRoKCcvJykpIHtcbiAgICAgICAgLy8gUmVtb3ZpbmcgdHJhaWxpbmcgc2xhc2guXG4gICAgICAgIGJhc2UgPSBiYXNlLnNsaWNlKDAsIC0xKTtcbiAgICAgIH1cbiAgICAgIGlmIChiYXNlLnN0YXJ0c1dpdGgoJ2h0dHA6Ly8nKSB8fCBiYXNlLnN0YXJ0c1dpdGgoJ2h0dHBzOi8vJykpIHtcbiAgICAgICAgdXJsID0gYmFzZSArIHVybDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBiYXNlIFVSTCAnJHtiYXNlVXJsfSdgKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy54aHIub3BlbignUE9TVCcsIHVybCwgdHJ1ZSk7XG4gICAgdGhpcy54aHIuc2V0UmVxdWVzdEhlYWRlcignWC1UaW5vZGUtQVBJS2V5JywgdGhpcy5fYXBpS2V5KTtcbiAgICB0aGlzLnhoci5zZXRSZXF1ZXN0SGVhZGVyKCdYLVRpbm9kZS1BdXRoJywgYFRva2VuICR7dGhpcy5fYXV0aFRva2VuLnRva2VufWApO1xuICAgIGNvbnN0IHJlc3VsdCA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMudG9SZXNvbHZlID0gcmVzb2x2ZTtcbiAgICAgIHRoaXMudG9SZWplY3QgPSByZWplY3Q7XG4gICAgfSk7XG5cbiAgICB0aGlzLm9uUHJvZ3Jlc3MgPSBvblByb2dyZXNzO1xuICAgIHRoaXMub25TdWNjZXNzID0gb25TdWNjZXNzO1xuICAgIHRoaXMub25GYWlsdXJlID0gb25GYWlsdXJlO1xuXG4gICAgdGhpcy54aHIudXBsb2FkLm9ucHJvZ3Jlc3MgPSAoZSkgPT4ge1xuICAgICAgaWYgKGUubGVuZ3RoQ29tcHV0YWJsZSAmJiBpbnN0YW5jZS5vblByb2dyZXNzKSB7XG4gICAgICAgIGluc3RhbmNlLm9uUHJvZ3Jlc3MoZS5sb2FkZWQgLyBlLnRvdGFsKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy54aHIub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgcGt0O1xuICAgICAgdHJ5IHtcbiAgICAgICAgcGt0ID0gSlNPTi5wYXJzZSh0aGlzLnJlc3BvbnNlLCBqc29uUGFyc2VIZWxwZXIpO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGluc3RhbmNlLl90aW5vZGUubG9nZ2VyKFwiRVJST1I6IEludmFsaWQgc2VydmVyIHJlc3BvbnNlIGluIExhcmdlRmlsZUhlbHBlclwiLCB0aGlzLnJlc3BvbnNlKTtcbiAgICAgICAgcGt0ID0ge1xuICAgICAgICAgIGN0cmw6IHtcbiAgICAgICAgICAgIGNvZGU6IHRoaXMuc3RhdHVzLFxuICAgICAgICAgICAgdGV4dDogdGhpcy5zdGF0dXNUZXh0XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5zdGF0dXMgPj0gMjAwICYmIHRoaXMuc3RhdHVzIDwgMzAwKSB7XG4gICAgICAgIGlmIChpbnN0YW5jZS50b1Jlc29sdmUpIHtcbiAgICAgICAgICBpbnN0YW5jZS50b1Jlc29sdmUocGt0LmN0cmwucGFyYW1zLnVybCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGluc3RhbmNlLm9uU3VjY2Vzcykge1xuICAgICAgICAgIGluc3RhbmNlLm9uU3VjY2Vzcyhwa3QuY3RybCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0dXMgPj0gNDAwKSB7XG4gICAgICAgIGlmIChpbnN0YW5jZS50b1JlamVjdCkge1xuICAgICAgICAgIGluc3RhbmNlLnRvUmVqZWN0KG5ldyBFcnJvcihgJHtwa3QuY3RybC50ZXh0fSAoJHtwa3QuY3RybC5jb2RlfSlgKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGluc3RhbmNlLm9uRmFpbHVyZSkge1xuICAgICAgICAgIGluc3RhbmNlLm9uRmFpbHVyZShwa3QuY3RybCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGluc3RhbmNlLl90aW5vZGUubG9nZ2VyKFwiRVJST1I6IFVuZXhwZWN0ZWQgc2VydmVyIHJlc3BvbnNlIHN0YXR1c1wiLCB0aGlzLnN0YXR1cywgdGhpcy5yZXNwb25zZSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRoaXMueGhyLm9uZXJyb3IgPSBmdW5jdGlvbihlKSB7XG4gICAgICBpZiAoaW5zdGFuY2UudG9SZWplY3QpIHtcbiAgICAgICAgaW5zdGFuY2UudG9SZWplY3QobmV3IEVycm9yKFwiZmFpbGVkXCIpKTtcbiAgICAgIH1cbiAgICAgIGlmIChpbnN0YW5jZS5vbkZhaWx1cmUpIHtcbiAgICAgICAgaW5zdGFuY2Uub25GYWlsdXJlKG51bGwpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLnhoci5vbmFib3J0ID0gZnVuY3Rpb24oZSkge1xuICAgICAgaWYgKGluc3RhbmNlLnRvUmVqZWN0KSB7XG4gICAgICAgIGluc3RhbmNlLnRvUmVqZWN0KG5ldyBFcnJvcihcInVwbG9hZCBjYW5jZWxsZWQgYnkgdXNlclwiKSk7XG4gICAgICB9XG4gICAgICBpZiAoaW5zdGFuY2Uub25GYWlsdXJlKSB7XG4gICAgICAgIGluc3RhbmNlLm9uRmFpbHVyZShudWxsKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGZvcm0gPSBuZXcgRm9ybURhdGEoKTtcbiAgICAgIGZvcm0uYXBwZW5kKCdmaWxlJywgZGF0YSk7XG4gICAgICBmb3JtLnNldCgnaWQnLCB0aGlzLl9yZXFJZCk7XG4gICAgICBpZiAoYXZhdGFyRm9yKSB7XG4gICAgICAgIGZvcm0uc2V0KCd0b3BpYycsIGF2YXRhckZvcik7XG4gICAgICB9XG4gICAgICB0aGlzLnhoci5zZW5kKGZvcm0pO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgaWYgKHRoaXMudG9SZWplY3QpIHtcbiAgICAgICAgdGhpcy50b1JlamVjdChlcnIpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMub25GYWlsdXJlKSB7XG4gICAgICAgIHRoaXMub25GYWlsdXJlKG51bGwpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgLyoqXG4gICAqIFN0YXJ0IHVwbG9hZGluZyB0aGUgZmlsZSB0byBkZWZhdWx0IGVuZHBvaW50LlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkxhcmdlRmlsZUhlbHBlciNcbiAgICpcbiAgICogQHBhcmFtIHtGaWxlfEJsb2J9IGRhdGEgdG8gdXBsb2FkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBhdmF0YXJGb3IgdG9waWMgbmFtZSBpZiB0aGUgdXBsb2FkIHJlcHJlc2VudHMgYW4gYXZhdGFyLlxuICAgKiBAcGFyYW0ge0NhbGxiYWNrfSBvblByb2dyZXNzIGNhbGxiYWNrLiBUYWtlcyBvbmUge2Zsb2F0fSBwYXJhbWV0ZXIgMC4uMVxuICAgKiBAcGFyYW0ge0NhbGxiYWNrfSBvblN1Y2Nlc3MgY2FsbGJhY2suIENhbGxlZCB3aGVuIHRoZSBmaWxlIGlzIHN1Y2Nlc3NmdWxseSB1cGxvYWRlZC5cbiAgICogQHBhcmFtIHtDYWxsYmFja30gb25GYWlsdXJlIGNhbGxiYWNrLiBDYWxsZWQgaW4gY2FzZSBvZiBhIGZhaWx1cmUuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSB1cGxvYWQgaXMgY29tcGxldGVkL2ZhaWxlZC5cbiAgICovXG4gIHVwbG9hZChkYXRhLCBhdmF0YXJGb3IsIG9uUHJvZ3Jlc3MsIG9uU3VjY2Vzcywgb25GYWlsdXJlKSB7XG4gICAgY29uc3QgYmFzZVVybCA9ICh0aGlzLl90aW5vZGUuX3NlY3VyZSA/ICdodHRwczovLycgOiAnaHR0cDovLycpICsgdGhpcy5fdGlub2RlLl9ob3N0O1xuICAgIHJldHVybiB0aGlzLnVwbG9hZFdpdGhCYXNlVXJsKGJhc2VVcmwsIGRhdGEsIGF2YXRhckZvciwgb25Qcm9ncmVzcywgb25TdWNjZXNzLCBvbkZhaWx1cmUpO1xuICB9XG4gIC8qKlxuICAgKiBEb3dubG9hZCB0aGUgZmlsZSBmcm9tIGEgZ2l2ZW4gVVJMIHVzaW5nIEdFVCByZXF1ZXN0LiBUaGlzIG1ldGhvZCB3b3JrcyB3aXRoIHRoZSBUaW5vZGUgc2VydmVyIG9ubHkuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTGFyZ2VGaWxlSGVscGVyI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcmVsYXRpdmVVcmwgLSBVUkwgdG8gZG93bmxvYWQgdGhlIGZpbGUgZnJvbS4gTXVzdCBiZSByZWxhdGl2ZSB1cmwsIGkuZS4gbXVzdCBub3QgY29udGFpbiB0aGUgaG9zdC5cbiAgICogQHBhcmFtIHtzdHJpbmc9fSBmaWxlbmFtZSAtIGZpbGUgbmFtZSB0byB1c2UgZm9yIHRoZSBkb3dubG9hZGVkIGZpbGUuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBkb3dubG9hZCBpcyBjb21wbGV0ZWQvZmFpbGVkLlxuICAgKi9cbiAgZG93bmxvYWQocmVsYXRpdmVVcmwsIGZpbGVuYW1lLCBtaW1ldHlwZSwgb25Qcm9ncmVzcywgb25FcnJvcikge1xuICAgIGlmICghVGlub2RlLmlzUmVsYXRpdmVVUkwocmVsYXRpdmVVcmwpKSB7XG4gICAgICAvLyBBcyBhIHNlY3VyaXR5IG1lYXN1cmUgcmVmdXNlIHRvIGRvd25sb2FkIGZyb20gYW4gYWJzb2x1dGUgVVJMLlxuICAgICAgaWYgKG9uRXJyb3IpIHtcbiAgICAgICAgb25FcnJvcihgVGhlIFVSTCAnJHtyZWxhdGl2ZVVybH0nIG11c3QgYmUgcmVsYXRpdmUsIG5vdCBhYnNvbHV0ZWApO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuX2F1dGhUb2tlbikge1xuICAgICAgaWYgKG9uRXJyb3IpIHtcbiAgICAgICAgb25FcnJvcihcIk11c3QgYXV0aGVudGljYXRlIGZpcnN0XCIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXM7XG4gICAgLy8gR2V0IGRhdGEgYXMgYmxvYiAoc3RvcmVkIGJ5IHRoZSBicm93c2VyIGFzIGEgdGVtcG9yYXJ5IGZpbGUpLlxuICAgIHRoaXMueGhyLm9wZW4oJ0dFVCcsIHJlbGF0aXZlVXJsLCB0cnVlKTtcbiAgICB0aGlzLnhoci5zZXRSZXF1ZXN0SGVhZGVyKCdYLVRpbm9kZS1BUElLZXknLCB0aGlzLl9hcGlLZXkpO1xuICAgIHRoaXMueGhyLnNldFJlcXVlc3RIZWFkZXIoJ1gtVGlub2RlLUF1dGgnLCAnVG9rZW4gJyArIHRoaXMuX2F1dGhUb2tlbi50b2tlbik7XG4gICAgdGhpcy54aHIucmVzcG9uc2VUeXBlID0gJ2Jsb2InO1xuXG4gICAgdGhpcy5vblByb2dyZXNzID0gb25Qcm9ncmVzcztcbiAgICB0aGlzLnhoci5vbnByb2dyZXNzID0gZnVuY3Rpb24oZSkge1xuICAgICAgaWYgKGluc3RhbmNlLm9uUHJvZ3Jlc3MpIHtcbiAgICAgICAgLy8gUGFzc2luZyBlLmxvYWRlZCBpbnN0ZWFkIG9mIGUubG9hZGVkL2UudG90YWwgYmVjYXVzZSBlLnRvdGFsXG4gICAgICAgIC8vIGlzIGFsd2F5cyAwIHdpdGggZ3ppcCBjb21wcmVzc2lvbiBlbmFibGVkIGJ5IHRoZSBzZXJ2ZXIuXG4gICAgICAgIGluc3RhbmNlLm9uUHJvZ3Jlc3MoZS5sb2FkZWQpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCByZXN1bHQgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLnRvUmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgICB0aGlzLnRvUmVqZWN0ID0gcmVqZWN0O1xuICAgIH0pO1xuXG4gICAgLy8gVGhlIGJsb2IgbmVlZHMgdG8gYmUgc2F2ZWQgYXMgZmlsZS4gVGhlcmUgaXMgbm8ga25vd24gd2F5IHRvXG4gICAgLy8gc2F2ZSB0aGUgYmxvYiBhcyBmaWxlIG90aGVyIHRoYW4gdG8gZmFrZSBhIGNsaWNrIG9uIGFuIDxhIGhyZWYuLi4gZG93bmxvYWQ9Li4uPi5cbiAgICB0aGlzLnhoci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLnN0YXR1cyA9PSAyMDApIHtcbiAgICAgICAgY29uc3QgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICAgICAgLy8gVVJMLmNyZWF0ZU9iamVjdFVSTCBpcyBub3QgYXZhaWxhYmxlIGluIG5vbi1icm93c2VyIGVudmlyb25tZW50LiBUaGlzIGNhbGwgd2lsbCBmYWlsLlxuICAgICAgICBsaW5rLmhyZWYgPSB3aW5kb3cuVVJMLmNyZWF0ZU9iamVjdFVSTChuZXcgQmxvYihbdGhpcy5yZXNwb25zZV0sIHtcbiAgICAgICAgICB0eXBlOiBtaW1ldHlwZVxuICAgICAgICB9KSk7XG4gICAgICAgIGxpbmsuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgbGluay5zZXRBdHRyaWJ1dGUoJ2Rvd25sb2FkJywgZmlsZW5hbWUpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGxpbmspO1xuICAgICAgICBsaW5rLmNsaWNrKCk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQobGluayk7XG4gICAgICAgIHdpbmRvdy5VUkwucmV2b2tlT2JqZWN0VVJMKGxpbmsuaHJlZik7XG4gICAgICAgIGlmIChpbnN0YW5jZS50b1Jlc29sdmUpIHtcbiAgICAgICAgICBpbnN0YW5jZS50b1Jlc29sdmUoKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0aGlzLnN0YXR1cyA+PSA0MDAgJiYgaW5zdGFuY2UudG9SZWplY3QpIHtcbiAgICAgICAgLy8gVGhlIHRoaXMucmVzcG9uc2VUZXh0IGlzIHVuZGVmaW5lZCwgbXVzdCB1c2UgdGhpcy5yZXNwb25zZSB3aGljaCBpcyBhIGJsb2IuXG4gICAgICAgIC8vIE5lZWQgdG8gY29udmVydCB0aGlzLnJlc3BvbnNlIHRvIEpTT04uIFRoZSBibG9iIGNhbiBvbmx5IGJlIGFjY2Vzc2VkIGJ5IHRoZVxuICAgICAgICAvLyBGaWxlUmVhZGVyLlxuICAgICAgICBjb25zdCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgICAgICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHBrdCA9IEpTT04ucGFyc2UodGhpcy5yZXN1bHQsIGpzb25QYXJzZUhlbHBlcik7XG4gICAgICAgICAgICBpbnN0YW5jZS50b1JlamVjdChuZXcgRXJyb3IoYCR7cGt0LmN0cmwudGV4dH0gKCR7cGt0LmN0cmwuY29kZX0pYCkpO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgaW5zdGFuY2UuX3Rpbm9kZS5sb2dnZXIoXCJFUlJPUjogSW52YWxpZCBzZXJ2ZXIgcmVzcG9uc2UgaW4gTGFyZ2VGaWxlSGVscGVyXCIsIHRoaXMucmVzdWx0KTtcbiAgICAgICAgICAgIGluc3RhbmNlLnRvUmVqZWN0KGVycik7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICByZWFkZXIucmVhZEFzVGV4dCh0aGlzLnJlc3BvbnNlKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy54aHIub25lcnJvciA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgIGlmIChpbnN0YW5jZS50b1JlamVjdCkge1xuICAgICAgICBpbnN0YW5jZS50b1JlamVjdChuZXcgRXJyb3IoXCJmYWlsZWRcIikpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLnhoci5vbmFib3J0ID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoaW5zdGFuY2UudG9SZWplY3QpIHtcbiAgICAgICAgaW5zdGFuY2UudG9SZWplY3QobnVsbCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRyeSB7XG4gICAgICB0aGlzLnhoci5zZW5kKCk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBpZiAodGhpcy50b1JlamVjdCkge1xuICAgICAgICB0aGlzLnRvUmVqZWN0KGVycik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICAvKipcbiAgICogVHJ5IHRvIGNhbmNlbCBhbiBvbmdvaW5nIHVwbG9hZCBvciBkb3dubG9hZC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5MYXJnZUZpbGVIZWxwZXIjXG4gICAqL1xuICBjYW5jZWwoKSB7XG4gICAgaWYgKHRoaXMueGhyICYmIHRoaXMueGhyLnJlYWR5U3RhdGUgPCA0KSB7XG4gICAgICB0aGlzLnhoci5hYm9ydCgpO1xuICAgIH1cbiAgfVxuICAvKipcbiAgICogR2V0IHVuaXF1ZSBpZCBvZiB0aGlzIHJlcXVlc3QuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTGFyZ2VGaWxlSGVscGVyI1xuICAgKlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSB1bmlxdWUgaWRcbiAgICovXG4gIGdldElkKCkge1xuICAgIHJldHVybiB0aGlzLl9yZXFJZDtcbiAgfVxuICAvKipcbiAgICogVG8gdXNlIExhcmdlRmlsZUhlbHBlciBpbiBhIG5vbiBicm93c2VyIGNvbnRleHQsIHN1cHBseSBYTUxIdHRwUmVxdWVzdCBwcm92aWRlci5cbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyb2YgTGFyZ2VGaWxlSGVscGVyXG4gICAqIEBwYXJhbSB4aHJQcm92aWRlciBYTUxIdHRwUmVxdWVzdCBwcm92aWRlciwgZS5nLiBmb3Igbm9kZSA8Y29kZT5yZXF1aXJlKCd4aHInKTwvY29kZT4uXG4gICAqL1xuICBzdGF0aWMgc2V0TmV0d29ya1Byb3ZpZGVyKHhoclByb3ZpZGVyKSB7XG4gICAgWEhSUHJvdmlkZXIgPSB4aHJQcm92aWRlcjtcbiAgfVxufVxuIiwiLyoqXG4gKiBAZmlsZSBIZWxwZXIgY2xhc3MgZm9yIGNvbnN0cnVjdGluZyB7QGxpbmsgVGlub2RlLkdldFF1ZXJ5fS5cbiAqXG4gKiBAY29weXJpZ2h0IDIwMTUtMjAyMiBUaW5vZGUgTExDLlxuICovXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogSGVscGVyIGNsYXNzIGZvciBjb25zdHJ1Y3Rpbmcge0BsaW5rIFRpbm9kZS5HZXRRdWVyeX0uXG4gKlxuICogQGNsYXNzIE1ldGFHZXRCdWlsZGVyXG4gKiBAbWVtYmVyb2YgVGlub2RlXG4gKlxuICogQHBhcmFtIHtUaW5vZGUuVG9waWN9IHBhcmVudCB0b3BpYyB3aGljaCBpbnN0YW50aWF0ZWQgdGhpcyBidWlsZGVyLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNZXRhR2V0QnVpbGRlciB7XG4gIGNvbnN0cnVjdG9yKHBhcmVudCkge1xuICAgIHRoaXMudG9waWMgPSBwYXJlbnQ7XG4gICAgdGhpcy53aGF0ID0ge307XG4gIH1cblxuICAvLyBHZXQgdGltZXN0YW1wIG9mIHRoZSBtb3N0IHJlY2VudCBkZXNjIHVwZGF0ZS5cbiAgI2dldF9kZXNjX2ltcygpIHtcbiAgICByZXR1cm4gdGhpcy50b3BpYy51cGRhdGVkO1xuICB9XG5cbiAgLy8gR2V0IHRpbWVzdGFtcCBvZiB0aGUgbW9zdCByZWNlbnQgc3VicyB1cGRhdGUuXG4gICNnZXRfc3Vic19pbXMoKSB7XG4gICAgaWYgKHRoaXMudG9waWMuaXNQMlBUeXBlKCkpIHtcbiAgICAgIHJldHVybiB0aGlzLiNnZXRfZGVzY19pbXMoKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMudG9waWMuX2xhc3RTdWJzVXBkYXRlO1xuICB9XG4gIC8qKlxuICAgKiBBZGQgcXVlcnkgcGFyYW1ldGVycyB0byBmZXRjaCBtZXNzYWdlcyB3aXRoaW4gZXhwbGljaXQgbGltaXRzLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLk1ldGFHZXRCdWlsZGVyI1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcj19IHNpbmNlIC0gbWVzc2FnZXMgbmV3ZXIgdGhhbiB0aGlzIChpbmNsdXNpdmUpO1xuICAgKiBAcGFyYW0ge251bWJlcj19IGJlZm9yZSAtIG9sZGVyIHRoYW4gdGhpcyAoZXhjbHVzaXZlKVxuICAgKiBAcGFyYW0ge251bWJlcj19IGxpbWl0IC0gbnVtYmVyIG9mIG1lc3NhZ2VzIHRvIGZldGNoXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuTWV0YUdldEJ1aWxkZXJ9IDxjb2RlPnRoaXM8L2NvZGU+IG9iamVjdC5cbiAgICovXG4gIHdpdGhEYXRhKHNpbmNlLCBiZWZvcmUsIGxpbWl0KSB7XG4gICAgdGhpcy53aGF0WydkYXRhJ10gPSB7XG4gICAgICBzaW5jZTogc2luY2UsXG4gICAgICBiZWZvcmU6IGJlZm9yZSxcbiAgICAgIGxpbWl0OiBsaW1pdFxuICAgIH07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLyoqXG4gICAqIEFkZCBxdWVyeSBwYXJhbWV0ZXJzIHRvIGZldGNoIG1lc3NhZ2VzIG5ld2VyIHRoYW4gdGhlIGxhdGVzdCBzYXZlZCBtZXNzYWdlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLk1ldGFHZXRCdWlsZGVyI1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcj19IGxpbWl0IC0gbnVtYmVyIG9mIG1lc3NhZ2VzIHRvIGZldGNoXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuTWV0YUdldEJ1aWxkZXJ9IDxjb2RlPnRoaXM8L2NvZGU+IG9iamVjdC5cbiAgICovXG4gIHdpdGhMYXRlckRhdGEobGltaXQpIHtcbiAgICByZXR1cm4gdGhpcy53aXRoRGF0YSh0aGlzLnRvcGljLl9tYXhTZXEgPiAwID8gdGhpcy50b3BpYy5fbWF4U2VxICsgMSA6IHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBsaW1pdCk7XG4gIH1cbiAgLyoqXG4gICAqIEFkZCBxdWVyeSBwYXJhbWV0ZXJzIHRvIGZldGNoIG1lc3NhZ2VzIG9sZGVyIHRoYW4gdGhlIGVhcmxpZXN0IHNhdmVkIG1lc3NhZ2UuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTWV0YUdldEJ1aWxkZXIjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gbGltaXQgLSBtYXhpbXVtIG51bWJlciBvZiBtZXNzYWdlcyB0byBmZXRjaC5cbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5NZXRhR2V0QnVpbGRlcn0gPGNvZGU+dGhpczwvY29kZT4gb2JqZWN0LlxuICAgKi9cbiAgd2l0aEVhcmxpZXJEYXRhKGxpbWl0KSB7XG4gICAgcmV0dXJuIHRoaXMud2l0aERhdGEodW5kZWZpbmVkLCB0aGlzLnRvcGljLl9taW5TZXEgPiAwID8gdGhpcy50b3BpYy5fbWluU2VxIDogdW5kZWZpbmVkLCBsaW1pdCk7XG4gIH1cbiAgLyoqXG4gICAqIEFkZCBxdWVyeSBwYXJhbWV0ZXJzIHRvIGZldGNoIHRvcGljIGRlc2NyaXB0aW9uIGlmIGl0J3MgbmV3ZXIgdGhhbiB0aGUgZ2l2ZW4gdGltZXN0YW1wLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLk1ldGFHZXRCdWlsZGVyI1xuICAgKlxuICAgKiBAcGFyYW0ge0RhdGU9fSBpbXMgLSBmZXRjaCBtZXNzYWdlcyBuZXdlciB0aGFuIHRoaXMgdGltZXN0YW1wLlxuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLk1ldGFHZXRCdWlsZGVyfSA8Y29kZT50aGlzPC9jb2RlPiBvYmplY3QuXG4gICAqL1xuICB3aXRoRGVzYyhpbXMpIHtcbiAgICB0aGlzLndoYXRbJ2Rlc2MnXSA9IHtcbiAgICAgIGltczogaW1zXG4gICAgfTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICAvKipcbiAgICogQWRkIHF1ZXJ5IHBhcmFtZXRlcnMgdG8gZmV0Y2ggdG9waWMgZGVzY3JpcHRpb24gaWYgaXQncyBuZXdlciB0aGFuIHRoZSBsYXN0IHVwZGF0ZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5NZXRhR2V0QnVpbGRlciNcbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5NZXRhR2V0QnVpbGRlcn0gPGNvZGU+dGhpczwvY29kZT4gb2JqZWN0LlxuICAgKi9cbiAgd2l0aExhdGVyRGVzYygpIHtcbiAgICByZXR1cm4gdGhpcy53aXRoRGVzYyh0aGlzLiNnZXRfZGVzY19pbXMoKSk7XG4gIH1cbiAgLyoqXG4gICAqIEFkZCBxdWVyeSBwYXJhbWV0ZXJzIHRvIGZldGNoIHN1YnNjcmlwdGlvbnMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTWV0YUdldEJ1aWxkZXIjXG4gICAqXG4gICAqIEBwYXJhbSB7RGF0ZT19IGltcyAtIGZldGNoIHN1YnNjcmlwdGlvbnMgbW9kaWZpZWQgbW9yZSByZWNlbnRseSB0aGFuIHRoaXMgdGltZXN0YW1wXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gbGltaXQgLSBtYXhpbXVtIG51bWJlciBvZiBzdWJzY3JpcHRpb25zIHRvIGZldGNoLlxuICAgKiBAcGFyYW0ge3N0cmluZz19IHVzZXJPclRvcGljIC0gdXNlciBJRCBvciB0b3BpYyBuYW1lIHRvIGZldGNoIGZvciBmZXRjaGluZyBvbmUgc3Vic2NyaXB0aW9uLlxuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLk1ldGFHZXRCdWlsZGVyfSA8Y29kZT50aGlzPC9jb2RlPiBvYmplY3QuXG4gICAqL1xuICB3aXRoU3ViKGltcywgbGltaXQsIHVzZXJPclRvcGljKSB7XG4gICAgY29uc3Qgb3B0cyA9IHtcbiAgICAgIGltczogaW1zLFxuICAgICAgbGltaXQ6IGxpbWl0XG4gICAgfTtcbiAgICBpZiAodGhpcy50b3BpYy5nZXRUeXBlKCkgPT0gJ21lJykge1xuICAgICAgb3B0cy50b3BpYyA9IHVzZXJPclRvcGljO1xuICAgIH0gZWxzZSB7XG4gICAgICBvcHRzLnVzZXIgPSB1c2VyT3JUb3BpYztcbiAgICB9XG4gICAgdGhpcy53aGF0WydzdWInXSA9IG9wdHM7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLyoqXG4gICAqIEFkZCBxdWVyeSBwYXJhbWV0ZXJzIHRvIGZldGNoIGEgc2luZ2xlIHN1YnNjcmlwdGlvbi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5NZXRhR2V0QnVpbGRlciNcbiAgICpcbiAgICogQHBhcmFtIHtEYXRlPX0gaW1zIC0gZmV0Y2ggc3Vic2NyaXB0aW9ucyBtb2RpZmllZCBtb3JlIHJlY2VudGx5IHRoYW4gdGhpcyB0aW1lc3RhbXBcbiAgICogQHBhcmFtIHtzdHJpbmc9fSB1c2VyT3JUb3BpYyAtIHVzZXIgSUQgb3IgdG9waWMgbmFtZSB0byBmZXRjaCBmb3IgZmV0Y2hpbmcgb25lIHN1YnNjcmlwdGlvbi5cbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5NZXRhR2V0QnVpbGRlcn0gPGNvZGU+dGhpczwvY29kZT4gb2JqZWN0LlxuICAgKi9cbiAgd2l0aE9uZVN1YihpbXMsIHVzZXJPclRvcGljKSB7XG4gICAgcmV0dXJuIHRoaXMud2l0aFN1YihpbXMsIHVuZGVmaW5lZCwgdXNlck9yVG9waWMpO1xuICB9XG4gIC8qKlxuICAgKiBBZGQgcXVlcnkgcGFyYW1ldGVycyB0byBmZXRjaCBhIHNpbmdsZSBzdWJzY3JpcHRpb24gaWYgaXQncyBiZWVuIHVwZGF0ZWQgc2luY2UgdGhlIGxhc3QgdXBkYXRlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLk1ldGFHZXRCdWlsZGVyI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZz19IHVzZXJPclRvcGljIC0gdXNlciBJRCBvciB0b3BpYyBuYW1lIHRvIGZldGNoIGZvciBmZXRjaGluZyBvbmUgc3Vic2NyaXB0aW9uLlxuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLk1ldGFHZXRCdWlsZGVyfSA8Y29kZT50aGlzPC9jb2RlPiBvYmplY3QuXG4gICAqL1xuICB3aXRoTGF0ZXJPbmVTdWIodXNlck9yVG9waWMpIHtcbiAgICByZXR1cm4gdGhpcy53aXRoT25lU3ViKHRoaXMudG9waWMuX2xhc3RTdWJzVXBkYXRlLCB1c2VyT3JUb3BpYyk7XG4gIH1cbiAgLyoqXG4gICAqIEFkZCBxdWVyeSBwYXJhbWV0ZXJzIHRvIGZldGNoIHN1YnNjcmlwdGlvbnMgdXBkYXRlZCBzaW5jZSB0aGUgbGFzdCB1cGRhdGUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTWV0YUdldEJ1aWxkZXIjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gbGltaXQgLSBtYXhpbXVtIG51bWJlciBvZiBzdWJzY3JpcHRpb25zIHRvIGZldGNoLlxuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLk1ldGFHZXRCdWlsZGVyfSA8Y29kZT50aGlzPC9jb2RlPiBvYmplY3QuXG4gICAqL1xuICB3aXRoTGF0ZXJTdWIobGltaXQpIHtcbiAgICByZXR1cm4gdGhpcy53aXRoU3ViKHRoaXMuI2dldF9zdWJzX2ltcygpLCBsaW1pdCk7XG4gIH1cbiAgLyoqXG4gICAqIEFkZCBxdWVyeSBwYXJhbWV0ZXJzIHRvIGZldGNoIHRvcGljIHRhZ3MuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTWV0YUdldEJ1aWxkZXIjXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuTWV0YUdldEJ1aWxkZXJ9IDxjb2RlPnRoaXM8L2NvZGU+IG9iamVjdC5cbiAgICovXG4gIHdpdGhUYWdzKCkge1xuICAgIHRoaXMud2hhdFsndGFncyddID0gdHJ1ZTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICAvKipcbiAgICogQWRkIHF1ZXJ5IHBhcmFtZXRlcnMgdG8gZmV0Y2ggdXNlcidzIGNyZWRlbnRpYWxzLiA8Y29kZT4nbWUnPC9jb2RlPiB0b3BpYyBvbmx5LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLk1ldGFHZXRCdWlsZGVyI1xuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLk1ldGFHZXRCdWlsZGVyfSA8Y29kZT50aGlzPC9jb2RlPiBvYmplY3QuXG4gICAqL1xuICB3aXRoQ3JlZCgpIHtcbiAgICBpZiAodGhpcy50b3BpYy5nZXRUeXBlKCkgPT0gJ21lJykge1xuICAgICAgdGhpcy53aGF0WydjcmVkJ10gPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnRvcGljLl90aW5vZGUubG9nZ2VyKFwiRVJST1I6IEludmFsaWQgdG9waWMgdHlwZSBmb3IgTWV0YUdldEJ1aWxkZXI6d2l0aENyZWRzXCIsIHRoaXMudG9waWMuZ2V0VHlwZSgpKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLyoqXG4gICAqIEFkZCBxdWVyeSBwYXJhbWV0ZXJzIHRvIGZldGNoIGRlbGV0ZWQgbWVzc2FnZXMgd2l0aGluIGV4cGxpY2l0IGxpbWl0cy4gQW55L2FsbCBwYXJhbWV0ZXJzIGNhbiBiZSBudWxsLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLk1ldGFHZXRCdWlsZGVyI1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcj19IHNpbmNlIC0gaWRzIG9mIG1lc3NhZ2VzIGRlbGV0ZWQgc2luY2UgdGhpcyAnZGVsJyBpZCAoaW5jbHVzaXZlKVxuICAgKiBAcGFyYW0ge251bWJlcj19IGxpbWl0IC0gbnVtYmVyIG9mIGRlbGV0ZWQgbWVzc2FnZSBpZHMgdG8gZmV0Y2hcbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5NZXRhR2V0QnVpbGRlcn0gPGNvZGU+dGhpczwvY29kZT4gb2JqZWN0LlxuICAgKi9cbiAgd2l0aERlbChzaW5jZSwgbGltaXQpIHtcbiAgICBpZiAoc2luY2UgfHwgbGltaXQpIHtcbiAgICAgIHRoaXMud2hhdFsnZGVsJ10gPSB7XG4gICAgICAgIHNpbmNlOiBzaW5jZSxcbiAgICAgICAgbGltaXQ6IGxpbWl0XG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICAvKipcbiAgICogQWRkIHF1ZXJ5IHBhcmFtZXRlcnMgdG8gZmV0Y2ggbWVzc2FnZXMgZGVsZXRlZCBhZnRlciB0aGUgc2F2ZWQgPGNvZGU+J2RlbCc8L2NvZGU+IGlkLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLk1ldGFHZXRCdWlsZGVyI1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcj19IGxpbWl0IC0gbnVtYmVyIG9mIGRlbGV0ZWQgbWVzc2FnZSBpZHMgdG8gZmV0Y2hcbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5NZXRhR2V0QnVpbGRlcn0gPGNvZGU+dGhpczwvY29kZT4gb2JqZWN0LlxuICAgKi9cbiAgd2l0aExhdGVyRGVsKGxpbWl0KSB7XG4gICAgLy8gU3BlY2lmeSAnc2luY2UnIG9ubHkgaWYgd2UgaGF2ZSBhbHJlYWR5IHJlY2VpdmVkIHNvbWUgbWVzc2FnZXMuIElmXG4gICAgLy8gd2UgaGF2ZSBubyBsb2NhbGx5IGNhY2hlZCBtZXNzYWdlcyB0aGVuIHdlIGRvbid0IGNhcmUgaWYgYW55IG1lc3NhZ2VzIHdlcmUgZGVsZXRlZC5cbiAgICByZXR1cm4gdGhpcy53aXRoRGVsKHRoaXMudG9waWMuX21heFNlcSA+IDAgPyB0aGlzLnRvcGljLl9tYXhEZWwgKyAxIDogdW5kZWZpbmVkLCBsaW1pdCk7XG4gIH1cblxuICAvKipcbiAgICogRXh0cmFjdCBzdWJxdWVyeTogZ2V0IGFuIG9iamVjdCB0aGF0IGNvbnRhaW5zIHNwZWNpZmllZCBzdWJxdWVyeS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5NZXRhR2V0QnVpbGRlciNcbiAgICogQHBhcmFtIHtzdHJpbmd9IHdoYXQgLSBzdWJxdWVyeSB0byByZXR1cm46IG9uZSBvZiAnZGF0YScsICdzdWInLCAnZGVzYycsICd0YWdzJywgJ2NyZWQnLCAnZGVsJy5cbiAgICogQHJldHVybnMge09iamVjdH0gcmVxdWVzdGVkIHN1YnF1ZXJ5IG9yIDxjb2RlPnVuZGVmaW5lZDwvY29kZT4uXG4gICAqL1xuICBleHRyYWN0KHdoYXQpIHtcbiAgICByZXR1cm4gdGhpcy53aGF0W3doYXRdO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdCBwYXJhbWV0ZXJzLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLk1ldGFHZXRCdWlsZGVyI1xuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLkdldFF1ZXJ5fSBHZXQgcXVlcnlcbiAgICovXG4gIGJ1aWxkKCkge1xuICAgIGNvbnN0IHdoYXQgPSBbXTtcbiAgICBsZXQgcGFyYW1zID0ge307XG4gICAgWydkYXRhJywgJ3N1YicsICdkZXNjJywgJ3RhZ3MnLCAnY3JlZCcsICdkZWwnXS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgIGlmICh0aGlzLndoYXQuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICB3aGF0LnB1c2goa2V5KTtcbiAgICAgICAgaWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRoaXMud2hhdFtrZXldKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgcGFyYW1zW2tleV0gPSB0aGlzLndoYXRba2V5XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIGlmICh3aGF0Lmxlbmd0aCA+IDApIHtcbiAgICAgIHBhcmFtcy53aGF0ID0gd2hhdC5qb2luKCcgJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhcmFtcyA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgcmV0dXJuIHBhcmFtcztcbiAgfVxufVxuIiwiLyoqXG4gKiBAZmlsZSBTREsgdG8gY29ubmVjdCB0byBUaW5vZGUgY2hhdCBzZXJ2ZXIuXG4gKiBTZWUgPGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS90aW5vZGUvd2ViYXBwXCI+aHR0cHM6Ly9naXRodWIuY29tL3Rpbm9kZS93ZWJhcHA8L2E+IGZvciByZWFsLWxpZmUgdXNhZ2UuXG4gKlxuICogQGNvcHlyaWdodCAyMDE1LTIwMjIgVGlub2RlIExMQy5cbiAqIEBzdW1tYXJ5IEphdmFzY3JpcHQgYmluZGluZ3MgZm9yIFRpbm9kZS5cbiAqIEBsaWNlbnNlIEFwYWNoZSAyLjBcbiAqIEB2ZXJzaW9uIDAuMTlcbiAqXG4gKiBAZXhhbXBsZVxuICogPGhlYWQ+XG4gKiA8c2NyaXB0IHNyYz1cIi4uLi90aW5vZGUuanNcIj48L3NjcmlwdD5cbiAqIDwvaGVhZD5cbiAqXG4gKiA8Ym9keT5cbiAqICAuLi5cbiAqIDxzY3JpcHQ+XG4gKiAgLy8gSW5zdGFudGlhdGUgdGlub2RlLlxuICogIGNvbnN0IHRpbm9kZSA9IG5ldyBUaW5vZGUoY29uZmlnLCAoKSA9PiB7XG4gKiAgICAvLyBDYWxsZWQgb24gaW5pdCBjb21wbGV0aW9uLlxuICogIH0pO1xuICogIHRpbm9kZS5lbmFibGVMb2dnaW5nKHRydWUpO1xuICogIHRpbm9kZS5vbkRpc2Nvbm5lY3QgPSAoZXJyKSA9PiB7XG4gKiAgICAvLyBIYW5kbGUgZGlzY29ubmVjdC5cbiAqICB9O1xuICogIC8vIENvbm5lY3QgdG8gdGhlIHNlcnZlci5cbiAqICB0aW5vZGUuY29ubmVjdCgnaHR0cHM6Ly9leGFtcGxlLmNvbS8nKS50aGVuKCgpID0+IHtcbiAqICAgIC8vIENvbm5lY3RlZC4gTG9naW4gbm93LlxuICogICAgcmV0dXJuIHRpbm9kZS5sb2dpbkJhc2ljKGxvZ2luLCBwYXNzd29yZCk7XG4gKiAgfSkudGhlbigoY3RybCkgPT4ge1xuICogICAgLy8gTG9nZ2VkIGluIGZpbmUsIGF0dGFjaCBjYWxsYmFja3MsIHN1YnNjcmliZSB0byAnbWUnLlxuICogICAgY29uc3QgbWUgPSB0aW5vZGUuZ2V0TWVUb3BpYygpO1xuICogICAgbWUub25NZXRhRGVzYyA9IGZ1bmN0aW9uKG1ldGEpIHsgLi4uIH07XG4gKiAgICAvLyBTdWJzY3JpYmUsIGZldGNoIHRvcGljIGRlc2NyaXB0aW9uIGFuZCB0aGUgbGlzdCBvZiBjb250YWN0cy5cbiAqICAgIG1lLnN1YnNjcmliZSh7Z2V0OiB7ZGVzYzoge30sIHN1Yjoge319fSk7XG4gKiAgfSkuY2F0Y2goKGVycikgPT4ge1xuICogICAgLy8gTG9naW4gb3Igc3Vic2NyaXB0aW9uIGZhaWxlZCwgZG8gc29tZXRoaW5nLlxuICogICAgLi4uXG4gKiAgfSk7XG4gKiAgLi4uXG4gKiA8L3NjcmlwdD5cbiAqIDwvYm9keT5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG4vLyBOT1RFIFRPIERFVkVMT1BFUlM6XG4vLyBMb2NhbGl6YWJsZSBzdHJpbmdzIHNob3VsZCBiZSBkb3VibGUgcXVvdGVkIFwi0YHRgtGA0L7QutCwINC90LAg0LTRgNGD0LPQvtC8INGP0LfRi9C60LVcIixcbi8vIG5vbi1sb2NhbGl6YWJsZSBzdHJpbmdzIHNob3VsZCBiZSBzaW5nbGUgcXVvdGVkICdub24tbG9jYWxpemVkJy5cblxuaW1wb3J0IEFjY2Vzc01vZGUgZnJvbSAnLi9hY2Nlc3MtbW9kZS5qcyc7XG5pbXBvcnQgKiBhcyBDb25zdCBmcm9tICcuL2NvbmZpZy5qcyc7XG5pbXBvcnQgQ29ubmVjdGlvbiBmcm9tICcuL2Nvbm5lY3Rpb24uanMnO1xuaW1wb3J0IERCQ2FjaGUgZnJvbSAnLi9kYi5qcyc7XG5pbXBvcnQgRHJhZnR5IGZyb20gJy4vZHJhZnR5LmpzJztcbmltcG9ydCBMYXJnZUZpbGVIZWxwZXIgZnJvbSAnLi9sYXJnZS1maWxlLmpzJztcbmltcG9ydCB7XG4gIFRvcGljLFxuICBUb3BpY01lLFxuICBUb3BpY0ZuZFxufSBmcm9tICcuL3RvcGljLmpzJztcblxuaW1wb3J0IHtcbiAganNvblBhcnNlSGVscGVyLFxuICBtZXJnZU9iaixcbiAgcmZjMzMzOURhdGVTdHJpbmcsXG4gIHNpbXBsaWZ5XG59IGZyb20gJy4vdXRpbHMuanMnO1xuXG5sZXQgV2ViU29ja2V0UHJvdmlkZXI7XG5pZiAodHlwZW9mIFdlYlNvY2tldCAhPSAndW5kZWZpbmVkJykge1xuICBXZWJTb2NrZXRQcm92aWRlciA9IFdlYlNvY2tldDtcbn1cblxubGV0IFhIUlByb3ZpZGVyO1xuaWYgKHR5cGVvZiBYTUxIdHRwUmVxdWVzdCAhPSAndW5kZWZpbmVkJykge1xuICBYSFJQcm92aWRlciA9IFhNTEh0dHBSZXF1ZXN0O1xufVxuXG5sZXQgSW5kZXhlZERCUHJvdmlkZXI7XG5pZiAodHlwZW9mIGluZGV4ZWREQiAhPSAndW5kZWZpbmVkJykge1xuICBJbmRleGVkREJQcm92aWRlciA9IGluZGV4ZWREQjtcbn1cblxuLy8gUmUtZXhwb3J0IERyYWZ0eS5cbmV4cG9ydCB7XG4gIERyYWZ0eVxufVxuXG5pbml0Rm9yTm9uQnJvd3NlckFwcCgpO1xuXG4vLyBVdGlsaXR5IGZ1bmN0aW9uc1xuXG4vLyBQb2x5ZmlsbCBmb3Igbm9uLWJyb3dzZXIgY29udGV4dCwgZS5nLiBOb2RlSnMuXG5mdW5jdGlvbiBpbml0Rm9yTm9uQnJvd3NlckFwcCgpIHtcbiAgLy8gVGlub2RlIHJlcXVpcmVtZW50IGluIG5hdGl2ZSBtb2RlIGJlY2F1c2UgcmVhY3QgbmF0aXZlIGRvZXNuJ3QgcHJvdmlkZSBCYXNlNjQgbWV0aG9kXG4gIGNvbnN0IGNoYXJzID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky89JztcblxuICBpZiAodHlwZW9mIGJ0b2EgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBnbG9iYWwuYnRvYSA9IGZ1bmN0aW9uKGlucHV0ID0gJycpIHtcbiAgICAgIGxldCBzdHIgPSBpbnB1dDtcbiAgICAgIGxldCBvdXRwdXQgPSAnJztcblxuICAgICAgZm9yIChsZXQgYmxvY2sgPSAwLCBjaGFyQ29kZSwgaSA9IDAsIG1hcCA9IGNoYXJzOyBzdHIuY2hhckF0KGkgfCAwKSB8fCAobWFwID0gJz0nLCBpICUgMSk7IG91dHB1dCArPSBtYXAuY2hhckF0KDYzICYgYmxvY2sgPj4gOCAtIGkgJSAxICogOCkpIHtcblxuICAgICAgICBjaGFyQ29kZSA9IHN0ci5jaGFyQ29kZUF0KGkgKz0gMyAvIDQpO1xuXG4gICAgICAgIGlmIChjaGFyQ29kZSA+IDB4RkYpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCInYnRvYScgZmFpbGVkOiBUaGUgc3RyaW5nIHRvIGJlIGVuY29kZWQgY29udGFpbnMgY2hhcmFjdGVycyBvdXRzaWRlIG9mIHRoZSBMYXRpbjEgcmFuZ2UuXCIpO1xuICAgICAgICB9XG4gICAgICAgIGJsb2NrID0gYmxvY2sgPDwgOCB8IGNoYXJDb2RlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH07XG4gIH1cblxuICBpZiAodHlwZW9mIGF0b2IgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBnbG9iYWwuYXRvYiA9IGZ1bmN0aW9uKGlucHV0ID0gJycpIHtcbiAgICAgIGxldCBzdHIgPSBpbnB1dC5yZXBsYWNlKC89KyQvLCAnJyk7XG4gICAgICBsZXQgb3V0cHV0ID0gJyc7XG5cbiAgICAgIGlmIChzdHIubGVuZ3RoICUgNCA9PSAxKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIidhdG9iJyBmYWlsZWQ6IFRoZSBzdHJpbmcgdG8gYmUgZGVjb2RlZCBpcyBub3QgY29ycmVjdGx5IGVuY29kZWQuXCIpO1xuICAgICAgfVxuICAgICAgZm9yIChsZXQgYmMgPSAwLCBicyA9IDAsIGJ1ZmZlciwgaSA9IDA7IGJ1ZmZlciA9IHN0ci5jaGFyQXQoaSsrKTtcblxuICAgICAgICB+YnVmZmVyICYmIChicyA9IGJjICUgNCA/IGJzICogNjQgKyBidWZmZXIgOiBidWZmZXIsXG4gICAgICAgICAgYmMrKyAlIDQpID8gb3V0cHV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoMjU1ICYgYnMgPj4gKC0yICogYmMgJiA2KSkgOiAwXG4gICAgICApIHtcbiAgICAgICAgYnVmZmVyID0gY2hhcnMuaW5kZXhPZihidWZmZXIpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH07XG4gIH1cblxuICBpZiAodHlwZW9mIHdpbmRvdyA9PSAndW5kZWZpbmVkJykge1xuICAgIGdsb2JhbC53aW5kb3cgPSB7XG4gICAgICBXZWJTb2NrZXQ6IFdlYlNvY2tldFByb3ZpZGVyLFxuICAgICAgWE1MSHR0cFJlcXVlc3Q6IFhIUlByb3ZpZGVyLFxuICAgICAgaW5kZXhlZERCOiBJbmRleGVkREJQcm92aWRlcixcbiAgICAgIFVSTDoge1xuICAgICAgICBjcmVhdGVPYmplY3RVUkw6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVuYWJsZSB0byB1c2UgVVJMLmNyZWF0ZU9iamVjdFVSTCBpbiBhIG5vbi1icm93c2VyIGFwcGxpY2F0aW9uXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgQ29ubmVjdGlvbi5zZXROZXR3b3JrUHJvdmlkZXJzKFdlYlNvY2tldFByb3ZpZGVyLCBYSFJQcm92aWRlcik7XG4gIExhcmdlRmlsZUhlbHBlci5zZXROZXR3b3JrUHJvdmlkZXIoWEhSUHJvdmlkZXIpO1xuICBEQkNhY2hlLnNldERhdGFiYXNlUHJvdmlkZXIoSW5kZXhlZERCUHJvdmlkZXIpO1xufVxuXG4vLyBEZXRlY3QgZmluZCBtb3N0IHVzZWZ1bCBuZXR3b3JrIHRyYW5zcG9ydC5cbmZ1bmN0aW9uIGRldGVjdFRyYW5zcG9ydCgpIHtcbiAgaWYgKHR5cGVvZiB3aW5kb3cgPT0gJ29iamVjdCcpIHtcbiAgICBpZiAod2luZG93WydXZWJTb2NrZXQnXSkge1xuICAgICAgcmV0dXJuICd3cyc7XG4gICAgfSBlbHNlIGlmICh3aW5kb3dbJ1hNTEh0dHBSZXF1ZXN0J10pIHtcbiAgICAgIC8vIFRoZSBicm93c2VyIG9yIG5vZGUgaGFzIG5vIHdlYnNvY2tldHMsIHVzaW5nIGxvbmcgcG9sbGluZy5cbiAgICAgIHJldHVybiAnbHAnO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuLy8gYnRvYSByZXBsYWNlbWVudC4gU3RvY2sgYnRvYSBmYWlscyBvbiBvbiBub24tTGF0aW4xIHN0cmluZ3MuXG5mdW5jdGlvbiBiNjRFbmNvZGVVbmljb2RlKHN0cikge1xuICAvLyBUaGUgZW5jb2RlVVJJQ29tcG9uZW50IHBlcmNlbnQtZW5jb2RlcyBVVEYtOCBzdHJpbmcsXG4gIC8vIHRoZW4gdGhlIHBlcmNlbnQgZW5jb2RpbmcgaXMgY29udmVydGVkIGludG8gcmF3IGJ5dGVzIHdoaWNoXG4gIC8vIGNhbiBiZSBmZWQgaW50byBidG9hLlxuICByZXR1cm4gYnRvYShlbmNvZGVVUklDb21wb25lbnQoc3RyKS5yZXBsYWNlKC8lKFswLTlBLUZdezJ9KS9nLFxuICAgIGZ1bmN0aW9uIHRvU29saWRCeXRlcyhtYXRjaCwgcDEpIHtcbiAgICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKCcweCcgKyBwMSk7XG4gICAgfSkpO1xufVxuXG4vLyBKU09OIHN0cmluZ2lmeSBoZWxwZXIgLSBwcmUtcHJvY2Vzc29yIGZvciBKU09OLnN0cmluZ2lmeVxuZnVuY3Rpb24ganNvbkJ1aWxkSGVscGVyKGtleSwgdmFsKSB7XG4gIGlmICh2YWwgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgLy8gQ29udmVydCBqYXZhc2NyaXB0IERhdGUgb2JqZWN0cyB0byByZmMzMzM5IHN0cmluZ3NcbiAgICB2YWwgPSByZmMzMzM5RGF0ZVN0cmluZyh2YWwpO1xuICB9IGVsc2UgaWYgKHZhbCBpbnN0YW5jZW9mIEFjY2Vzc01vZGUpIHtcbiAgICB2YWwgPSB2YWwuanNvbkhlbHBlcigpO1xuICB9IGVsc2UgaWYgKHZhbCA9PT0gdW5kZWZpbmVkIHx8IHZhbCA9PT0gbnVsbCB8fCB2YWwgPT09IGZhbHNlIHx8XG4gICAgKEFycmF5LmlzQXJyYXkodmFsKSAmJiB2YWwubGVuZ3RoID09IDApIHx8XG4gICAgKCh0eXBlb2YgdmFsID09ICdvYmplY3QnKSAmJiAoT2JqZWN0LmtleXModmFsKS5sZW5ndGggPT0gMCkpKSB7XG4gICAgLy8gc3RyaXAgb3V0IGVtcHR5IGVsZW1lbnRzIHdoaWxlIHNlcmlhbGl6aW5nIG9iamVjdHMgdG8gSlNPTlxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICByZXR1cm4gdmFsO1xufTtcblxuLy8gVHJpbXMgdmVyeSBsb25nIHN0cmluZ3MgKGVuY29kZWQgaW1hZ2VzKSB0byBtYWtlIGxvZ2dlZCBwYWNrZXRzIG1vcmUgcmVhZGFibGUuXG5mdW5jdGlvbiBqc29uTG9nZ2VySGVscGVyKGtleSwgdmFsKSB7XG4gIGlmICh0eXBlb2YgdmFsID09ICdzdHJpbmcnICYmIHZhbC5sZW5ndGggPiAxMjgpIHtcbiAgICByZXR1cm4gJzwnICsgdmFsLmxlbmd0aCArICcsIGJ5dGVzOiAnICsgdmFsLnN1YnN0cmluZygwLCAxMikgKyAnLi4uJyArIHZhbC5zdWJzdHJpbmcodmFsLmxlbmd0aCAtIDEyKSArICc+JztcbiAgfVxuICByZXR1cm4ganNvbkJ1aWxkSGVscGVyKGtleSwgdmFsKTtcbn07XG5cbi8vIFBhcnNlIGJyb3dzZXIgdXNlciBhZ2VudCB0byBleHRyYWN0IGJyb3dzZXIgbmFtZSBhbmQgdmVyc2lvbi5cbmZ1bmN0aW9uIGdldEJyb3dzZXJJbmZvKHVhLCBwcm9kdWN0KSB7XG4gIHVhID0gdWEgfHwgJyc7XG4gIGxldCByZWFjdG5hdGl2ZSA9ICcnO1xuICAvLyBDaGVjayBpZiB0aGlzIGlzIGEgUmVhY3ROYXRpdmUgYXBwLlxuICBpZiAoL3JlYWN0bmF0aXZlL2kudGVzdChwcm9kdWN0KSkge1xuICAgIHJlYWN0bmF0aXZlID0gJ1JlYWN0TmF0aXZlOyAnO1xuICB9XG4gIGxldCByZXN1bHQ7XG4gIC8vIFJlbW92ZSB1c2VsZXNzIHN0cmluZy5cbiAgdWEgPSB1YS5yZXBsYWNlKCcgKEtIVE1MLCBsaWtlIEdlY2tvKScsICcnKTtcbiAgLy8gVGVzdCBmb3IgV2ViS2l0LWJhc2VkIGJyb3dzZXIuXG4gIGxldCBtID0gdWEubWF0Y2goLyhBcHBsZVdlYktpdFxcL1suXFxkXSspL2kpO1xuICBpZiAobSkge1xuICAgIC8vIExpc3Qgb2YgY29tbW9uIHN0cmluZ3MsIGZyb20gbW9yZSB1c2VmdWwgdG8gbGVzcyB1c2VmdWwuXG4gICAgLy8gQWxsIHVua25vd24gc3RyaW5ncyBnZXQgdGhlIGhpZ2hlc3QgKC0xKSBwcmlvcml0eS5cbiAgICBjb25zdCBwcmlvcml0eSA9IFsnZWRnJywgJ2Nocm9tZScsICdzYWZhcmknLCAnbW9iaWxlJywgJ3ZlcnNpb24nXTtcbiAgICBsZXQgdG1wID0gdWEuc3Vic3RyKG0uaW5kZXggKyBtWzBdLmxlbmd0aCkuc3BsaXQoJyAnKTtcbiAgICBsZXQgdG9rZW5zID0gW107XG4gICAgbGV0IHZlcnNpb247IC8vIDEuMCBpbiBWZXJzaW9uLzEuMCBvciB1bmRlZmluZWQ7XG4gICAgLy8gU3BsaXQgc3RyaW5nIGxpa2UgJ05hbWUvMC4wLjAnIGludG8gWydOYW1lJywgJzAuMC4wJywgM10gd2hlcmUgdGhlIGxhc3QgZWxlbWVudCBpcyB0aGUgcHJpb3JpdHkuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0bXAubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBtMiA9IC8oW1xcdy5dKylbXFwvXShbXFwuXFxkXSspLy5leGVjKHRtcFtpXSk7XG4gICAgICBpZiAobTIpIHtcbiAgICAgICAgLy8gVW5rbm93biB2YWx1ZXMgYXJlIGhpZ2hlc3QgcHJpb3JpdHkgKC0xKS5cbiAgICAgICAgdG9rZW5zLnB1c2goW20yWzFdLCBtMlsyXSwgcHJpb3JpdHkuZmluZEluZGV4KChlKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIG0yWzFdLnRvTG93ZXJDYXNlKCkuc3RhcnRzV2l0aChlKTtcbiAgICAgICAgfSldKTtcbiAgICAgICAgaWYgKG0yWzFdID09ICdWZXJzaW9uJykge1xuICAgICAgICAgIHZlcnNpb24gPSBtMlsyXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICAvLyBTb3J0IGJ5IHByaW9yaXR5OiBtb3JlIGludGVyZXN0aW5nIGlzIGVhcmxpZXIgdGhhbiBsZXNzIGludGVyZXN0aW5nLlxuICAgIHRva2Vucy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICByZXR1cm4gYVsyXSAtIGJbMl07XG4gICAgfSk7XG4gICAgaWYgKHRva2Vucy5sZW5ndGggPiAwKSB7XG4gICAgICAvLyBSZXR1cm4gdGhlIGxlYXN0IGNvbW1vbiBicm93c2VyIHN0cmluZyBhbmQgdmVyc2lvbi5cbiAgICAgIGlmICh0b2tlbnNbMF1bMF0udG9Mb3dlckNhc2UoKS5zdGFydHNXaXRoKCdlZGcnKSkge1xuICAgICAgICB0b2tlbnNbMF1bMF0gPSAnRWRnZSc7XG4gICAgICB9IGVsc2UgaWYgKHRva2Vuc1swXVswXSA9PSAnT1BSJykge1xuICAgICAgICB0b2tlbnNbMF1bMF0gPSAnT3BlcmEnO1xuICAgICAgfSBlbHNlIGlmICh0b2tlbnNbMF1bMF0gPT0gJ1NhZmFyaScgJiYgdmVyc2lvbikge1xuICAgICAgICB0b2tlbnNbMF1bMV0gPSB2ZXJzaW9uO1xuICAgICAgfVxuICAgICAgcmVzdWx0ID0gdG9rZW5zWzBdWzBdICsgJy8nICsgdG9rZW5zWzBdWzFdO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBGYWlsZWQgdG8gSUQgdGhlIGJyb3dzZXIuIFJldHVybiB0aGUgd2Via2l0IHZlcnNpb24uXG4gICAgICByZXN1bHQgPSBtWzFdO1xuICAgIH1cbiAgfSBlbHNlIGlmICgvZmlyZWZveC9pLnRlc3QodWEpKSB7XG4gICAgbSA9IC9GaXJlZm94XFwvKFsuXFxkXSspL2cuZXhlYyh1YSk7XG4gICAgaWYgKG0pIHtcbiAgICAgIHJlc3VsdCA9ICdGaXJlZm94LycgKyBtWzFdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHQgPSAnRmlyZWZveC8/JztcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gTmVpdGhlciBBcHBsZVdlYktpdCBub3IgRmlyZWZveC4gVHJ5IHRoZSBsYXN0IHJlc29ydC5cbiAgICBtID0gLyhbXFx3Ll0rKVxcLyhbLlxcZF0rKS8uZXhlYyh1YSk7XG4gICAgaWYgKG0pIHtcbiAgICAgIHJlc3VsdCA9IG1bMV0gKyAnLycgKyBtWzJdO1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gdWEuc3BsaXQoJyAnKTtcbiAgICAgIHJlc3VsdCA9IG1bMF07XG4gICAgfVxuICB9XG5cbiAgLy8gU2hvcnRlbiB0aGUgdmVyc2lvbiB0byBvbmUgZG90ICdhLmJiLmNjYy5kIC0+IGEuYmInIGF0IG1vc3QuXG4gIG0gPSByZXN1bHQuc3BsaXQoJy8nKTtcbiAgaWYgKG0ubGVuZ3RoID4gMSkge1xuICAgIGNvbnN0IHYgPSBtWzFdLnNwbGl0KCcuJyk7XG4gICAgY29uc3QgbWlub3IgPSB2WzFdID8gJy4nICsgdlsxXS5zdWJzdHIoMCwgMikgOiAnJztcbiAgICByZXN1bHQgPSBgJHttWzBdfS8ke3ZbMF19JHttaW5vcn1gO1xuICB9XG4gIHJldHVybiByZWFjdG5hdGl2ZSArIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBAY2xhc3MgVGlub2RlXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyAtIGNvbmZpZ3VyYXRpb24gcGFyYW1ldGVycy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBjb25maWcuYXBwTmFtZSAtIE5hbWUgb2YgdGhlIGNhbGxpbmcgYXBwbGljYXRpb24gdG8gYmUgcmVwb3J0ZWQgaW4gdGhlIFVzZXIgQWdlbnQuXG4gKiBAcGFyYW0ge3N0cmluZ30gY29uZmlnLmhvc3QgLSBIb3N0IG5hbWUgYW5kIG9wdGlvbmFsIHBvcnQgbnVtYmVyIHRvIGNvbm5lY3QgdG8uXG4gKiBAcGFyYW0ge3N0cmluZ30gY29uZmlnLmFwaUtleSAtIEFQSSBrZXkgZ2VuZXJhdGVkIGJ5IDxjb2RlPmtleWdlbjwvY29kZT4uXG4gKiBAcGFyYW0ge3N0cmluZ30gY29uZmlnLnRyYW5zcG9ydCAtIFNlZSB7QGxpbmsgVGlub2RlLkNvbm5lY3Rpb24jdHJhbnNwb3J0fS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gY29uZmlnLnNlY3VyZSAtIFVzZSBTZWN1cmUgV2ViU29ja2V0IGlmIDxjb2RlPnRydWU8L2NvZGU+LlxuICogQHBhcmFtIHtzdHJpbmd9IGNvbmZpZy5wbGF0Zm9ybSAtIE9wdGlvbmFsIHBsYXRmb3JtIGlkZW50aWZpZXIsIG9uZSBvZiA8Y29kZT5cImlvc1wiPC9jb2RlPiwgPGNvZGU+XCJ3ZWJcIjwvY29kZT4sIDxjb2RlPlwiYW5kcm9pZFwiPC9jb2RlPi5cbiAqIEBwYXJhbSB7Ym9vbGVufSBjb25maWcucGVyc2lzdCAtIFVzZSBJbmRleGVkREIgcGVyc2lzdGVudCBzdG9yYWdlLlxuICogQHBhcmFtIHtmdW5jdGlvbn0gb25Db21wbGV0ZSAtIGNhbGxiYWNrIHRvIGNhbGwgd2hlbiBpbml0aWFsaXphdGlvbiBpcyBjb21wbGV0ZWQuXG4gKi9cbmV4cG9ydCBjbGFzcyBUaW5vZGUge1xuICBfaG9zdDtcbiAgX3NlY3VyZTtcblxuICBfYXBwTmFtZTtcblxuICAvLyBBUEkgS2V5LlxuICBfYXBpS2V5O1xuXG4gIC8vIE5hbWUgYW5kIHZlcnNpb24gb2YgdGhlIGJyb3dzZXIuXG4gIF9icm93c2VyID0gJyc7XG4gIF9wbGF0Zm9ybTtcbiAgLy8gSGFyZHdhcmVcbiAgX2h3b3MgPSAndW5kZWZpbmVkJztcbiAgX2h1bWFuTGFuZ3VhZ2UgPSAneHgnO1xuXG4gIC8vIExvZ2dpbmcgdG8gY29uc29sZSBlbmFibGVkXG4gIF9sb2dnaW5nRW5hYmxlZCA9IGZhbHNlO1xuICAvLyBXaGVuIGxvZ2dpbmcsIHRyaXAgbG9uZyBzdHJpbmdzIChiYXNlNjQtZW5jb2RlZCBpbWFnZXMpIGZvciByZWFkYWJpbGl0eVxuICBfdHJpbUxvbmdTdHJpbmdzID0gZmFsc2U7XG4gIC8vIFVJRCBvZiB0aGUgY3VycmVudGx5IGF1dGhlbnRpY2F0ZWQgdXNlci5cbiAgX215VUlEID0gbnVsbDtcbiAgLy8gU3RhdHVzIG9mIGNvbm5lY3Rpb246IGF1dGhlbnRpY2F0ZWQgb3Igbm90LlxuICBfYXV0aGVudGljYXRlZCA9IGZhbHNlO1xuICAvLyBMb2dpbiB1c2VkIGluIHRoZSBsYXN0IHN1Y2Nlc3NmdWwgYmFzaWMgYXV0aGVudGljYXRpb25cbiAgX2xvZ2luID0gbnVsbDtcbiAgLy8gVG9rZW4gd2hpY2ggY2FuIGJlIHVzZWQgZm9yIGxvZ2luIGluc3RlYWQgb2YgbG9naW4vcGFzc3dvcmQuXG4gIF9hdXRoVG9rZW4gPSBudWxsO1xuICAvLyBDb3VudGVyIG9mIHJlY2VpdmVkIHBhY2tldHNcbiAgX2luUGFja2V0Q291bnQgPSAwO1xuICAvLyBDb3VudGVyIGZvciBnZW5lcmF0aW5nIHVuaXF1ZSBtZXNzYWdlIElEc1xuICBfbWVzc2FnZUlkID0gTWF0aC5mbG9vcigoTWF0aC5yYW5kb20oKSAqIDB4RkZGRikgKyAweEZGRkYpO1xuICAvLyBJbmZvcm1hdGlvbiBhYm91dCB0aGUgc2VydmVyLCBpZiBjb25uZWN0ZWRcbiAgX3NlcnZlckluZm8gPSBudWxsO1xuICAvLyBQdXNoIG5vdGlmaWNhdGlvbiB0b2tlbi4gQ2FsbGVkIGRldmljZVRva2VuIGZvciBjb25zaXN0ZW5jeSB3aXRoIHRoZSBBbmRyb2lkIFNESy5cbiAgX2RldmljZVRva2VuID0gbnVsbDtcblxuICAvLyBDYWNoZSBvZiBwZW5kaW5nIHByb21pc2VzIGJ5IG1lc3NhZ2UgaWQuXG4gIF9wZW5kaW5nUHJvbWlzZXMgPSB7fTtcbiAgLy8gVGhlIFRpbWVvdXQgb2JqZWN0IHJldHVybmVkIGJ5IHRoZSByZWplY3QgZXhwaXJlZCBwcm9taXNlcyBzZXRJbnRlcnZhbC5cbiAgX2V4cGlyZVByb21pc2VzID0gbnVsbDtcblxuICAvLyBXZWJzb2NrZXQgb3IgbG9uZyBwb2xsaW5nIGNvbm5lY3Rpb24uXG4gIF9jb25uZWN0aW9uID0gbnVsbDtcblxuICAvLyBVc2UgaW5kZXhEQiBmb3IgY2FjaGluZyB0b3BpY3MgYW5kIG1lc3NhZ2VzLlxuICBfcGVyc2lzdCA9IGZhbHNlO1xuICAvLyBJbmRleGVkREIgd3JhcHBlciBvYmplY3QuXG4gIF9kYiA9IG51bGw7XG5cbiAgLy8gVGlub2RlJ3MgY2FjaGUgb2Ygb2JqZWN0c1xuICBfY2FjaGUgPSB7fTtcblxuICBjb25zdHJ1Y3Rvcihjb25maWcsIG9uQ29tcGxldGUpIHtcbiAgICB0aGlzLl9ob3N0ID0gY29uZmlnLmhvc3Q7XG4gICAgdGhpcy5fc2VjdXJlID0gY29uZmlnLnNlY3VyZTtcblxuICAgIC8vIENsaWVudC1wcm92aWRlZCBhcHBsaWNhdGlvbiBuYW1lLCBmb3JtYXQgPE5hbWU+Lzx2ZXJzaW9uIG51bWJlcj5cbiAgICB0aGlzLl9hcHBOYW1lID0gY29uZmlnLmFwcE5hbWUgfHwgXCJVbmRlZmluZWRcIjtcblxuICAgIC8vIEFQSSBLZXkuXG4gICAgdGhpcy5fYXBpS2V5ID0gY29uZmlnLmFwaUtleTtcblxuICAgIC8vIE5hbWUgYW5kIHZlcnNpb24gb2YgdGhlIGJyb3dzZXIuXG4gICAgdGhpcy5fcGxhdGZvcm0gPSBjb25maWcucGxhdGZvcm0gfHwgJ3dlYic7XG4gICAgLy8gVW5kZXJseWluZyBPUy5cbiAgICBpZiAodHlwZW9mIG5hdmlnYXRvciAhPSAndW5kZWZpbmVkJykge1xuICAgICAgdGhpcy5fYnJvd3NlciA9IGdldEJyb3dzZXJJbmZvKG5hdmlnYXRvci51c2VyQWdlbnQsIG5hdmlnYXRvci5wcm9kdWN0KTtcbiAgICAgIHRoaXMuX2h3b3MgPSBuYXZpZ2F0b3IucGxhdGZvcm07XG4gICAgICAvLyBUaGlzIGlzIHRoZSBkZWZhdWx0IGxhbmd1YWdlLiBJdCBjb3VsZCBiZSBjaGFuZ2VkIGJ5IGNsaWVudC5cbiAgICAgIHRoaXMuX2h1bWFuTGFuZ3VhZ2UgPSBuYXZpZ2F0b3IubGFuZ3VhZ2UgfHwgJ2VuLVVTJztcbiAgICB9XG5cbiAgICBDb25uZWN0aW9uLmxvZ2dlciA9IHRoaXMubG9nZ2VyO1xuICAgIERyYWZ0eS5sb2dnZXIgPSB0aGlzLmxvZ2dlcjtcblxuICAgIC8vIFdlYlNvY2tldCBvciBsb25nIHBvbGxpbmcgbmV0d29yayBjb25uZWN0aW9uLlxuICAgIGlmIChjb25maWcudHJhbnNwb3J0ICE9ICdscCcgJiYgY29uZmlnLnRyYW5zcG9ydCAhPSAnd3MnKSB7XG4gICAgICBjb25maWcudHJhbnNwb3J0ID0gZGV0ZWN0VHJhbnNwb3J0KCk7XG4gICAgfVxuICAgIHRoaXMuX2Nvbm5lY3Rpb24gPSBuZXcgQ29ubmVjdGlvbihjb25maWcsIENvbnN0LlBST1RPQ09MX1ZFUlNJT04sIC8qIGF1dG9yZWNvbm5lY3QgKi8gdHJ1ZSk7XG4gICAgdGhpcy5fY29ubmVjdGlvbi5vbk1lc3NhZ2UgPSAoZGF0YSkgPT4ge1xuICAgICAgLy8gQ2FsbCB0aGUgbWFpbiBtZXNzYWdlIGRpc3BhdGNoZXIuXG4gICAgICB0aGlzLiNkaXNwYXRjaE1lc3NhZ2UoZGF0YSk7XG4gICAgfVxuICAgIHRoaXMuX2Nvbm5lY3Rpb24ub25PcGVuID0gKCkgPT4ge1xuICAgICAgLy8gUmVhZHkgdG8gc3RhcnQgc2VuZGluZy5cbiAgICAgIHRoaXMuI2Nvbm5lY3Rpb25PcGVuKCk7XG4gICAgfVxuICAgIHRoaXMuX2Nvbm5lY3Rpb24ub25EaXNjb25uZWN0ID0gKGVyciwgY29kZSkgPT4ge1xuICAgICAgdGhpcy4jZGlzY29ubmVjdGVkKGVyciwgY29kZSk7XG4gICAgfVxuICAgIC8vIFdyYXBwZXIgZm9yIHRoZSByZWNvbm5lY3QgaXRlcmF0b3IgY2FsbGJhY2suXG4gICAgdGhpcy5fY29ubmVjdGlvbi5vbkF1dG9yZWNvbm5lY3RJdGVyYXRpb24gPSAodGltZW91dCwgcHJvbWlzZSkgPT4ge1xuICAgICAgaWYgKHRoaXMub25BdXRvcmVjb25uZWN0SXRlcmF0aW9uKSB7XG4gICAgICAgIHRoaXMub25BdXRvcmVjb25uZWN0SXRlcmF0aW9uKHRpbWVvdXQsIHByb21pc2UpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuX3BlcnNpc3QgPSBjb25maWcucGVyc2lzdDtcbiAgICAvLyBJbml0aWFsaXplIG9iamVjdCByZWdhcmRsZXNzLiBJdCBzaW1wbGlmaWVzIHRoZSBjb2RlLlxuICAgIHRoaXMuX2RiID0gbmV3IERCQ2FjaGUoZXJyID0+IHtcbiAgICAgIHRoaXMubG9nZ2VyKCdEQicsIGVycik7XG4gICAgfSwgdGhpcy5sb2dnZXIpO1xuXG4gICAgaWYgKHRoaXMuX3BlcnNpc3QpIHtcbiAgICAgIC8vIENyZWF0ZSB0aGUgcGVyc2lzdGVudCBjYWNoZS5cbiAgICAgIC8vIFN0b3JlIHByb21pc2VzIHRvIGJlIHJlc29sdmVkIHdoZW4gbWVzc2FnZXMgbG9hZCBpbnRvIG1lbW9yeS5cbiAgICAgIGNvbnN0IHByb20gPSBbXTtcbiAgICAgIHRoaXMuX2RiLmluaXREYXRhYmFzZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAvLyBGaXJzdCBsb2FkIHRvcGljcyBpbnRvIG1lbW9yeS5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2RiLm1hcFRvcGljcygoZGF0YSkgPT4ge1xuICAgICAgICAgIGxldCB0b3BpYyA9IHRoaXMuI2NhY2hlR2V0KCd0b3BpYycsIGRhdGEubmFtZSk7XG4gICAgICAgICAgaWYgKHRvcGljKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChkYXRhLm5hbWUgPT0gQ29uc3QuVE9QSUNfTUUpIHtcbiAgICAgICAgICAgIHRvcGljID0gbmV3IFRvcGljTWUoKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGRhdGEubmFtZSA9PSBDb25zdC5UT1BJQ19GTkQpIHtcbiAgICAgICAgICAgIHRvcGljID0gbmV3IFRvcGljRm5kKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRvcGljID0gbmV3IFRvcGljKGRhdGEubmFtZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuX2RiLmRlc2VyaWFsaXplVG9waWModG9waWMsIGRhdGEpO1xuICAgICAgICAgIHRoaXMuI2F0dGFjaENhY2hlVG9Ub3BpYyh0b3BpYyk7XG4gICAgICAgICAgdG9waWMuX2NhY2hlUHV0U2VsZigpO1xuICAgICAgICAgIC8vIFRvcGljIGxvYWRlZCBmcm9tIERCIGlzIG5vdCBuZXcuXG4gICAgICAgICAgZGVsZXRlIHRvcGljLl9uZXc7XG4gICAgICAgICAgLy8gUmVxdWVzdCB0byBsb2FkIG1lc3NhZ2VzIGFuZCBzYXZlIHRoZSBwcm9taXNlLlxuICAgICAgICAgIHByb20ucHVzaCh0b3BpYy5fbG9hZE1lc3NhZ2VzKHRoaXMuX2RiKSk7XG4gICAgICAgIH0pO1xuICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgIC8vIFRoZW4gbG9hZCB1c2Vycy5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2RiLm1hcFVzZXJzKChkYXRhKSA9PiB7XG4gICAgICAgICAgdGhpcy4jY2FjaGVQdXQoJ3VzZXInLCBkYXRhLnVpZCwgbWVyZ2VPYmooe30sIGRhdGEucHVibGljKSk7XG4gICAgICAgIH0pO1xuICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgIC8vIE5vdyB3YWl0IGZvciBhbGwgbWVzc2FnZXMgdG8gZmluaXNoIGxvYWRpbmcuXG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9tKTtcbiAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICBpZiAob25Db21wbGV0ZSkge1xuICAgICAgICAgIG9uQ29tcGxldGUoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxvZ2dlcihcIlBlcnNpc3RlbnQgY2FjaGUgaW5pdGlhbGl6ZWQuXCIpO1xuICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICBpZiAob25Db21wbGV0ZSkge1xuICAgICAgICAgIG9uQ29tcGxldGUoZXJyKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxvZ2dlcihcIkZhaWxlZCB0byBpbml0aWFsaXplIHBlcnNpc3RlbnQgY2FjaGU6XCIsIGVycik7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fZGIuZGVsZXRlRGF0YWJhc2UoKS50aGVuKCgpID0+IHtcbiAgICAgICAgaWYgKG9uQ29tcGxldGUpIHtcbiAgICAgICAgICBvbkNvbXBsZXRlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8vIFByaXZhdGUgbWV0aG9kcy5cblxuICAvLyBDb25zb2xlIGxvZ2dlci4gQmFiZWwgc29tZWhvdyBmYWlscyB0byBwYXJzZSAnLi4ucmVzdCcgcGFyYW1ldGVyLlxuICBsb2dnZXIoc3RyLCAuLi5hcmdzKSB7XG4gICAgaWYgKHRoaXMuX2xvZ2dpbmdFbmFibGVkKSB7XG4gICAgICBjb25zdCBkID0gbmV3IERhdGUoKTtcbiAgICAgIGNvbnN0IGRhdGVTdHJpbmcgPSAoJzAnICsgZC5nZXRVVENIb3VycygpKS5zbGljZSgtMikgKyAnOicgK1xuICAgICAgICAoJzAnICsgZC5nZXRVVENNaW51dGVzKCkpLnNsaWNlKC0yKSArICc6JyArXG4gICAgICAgICgnMCcgKyBkLmdldFVUQ1NlY29uZHMoKSkuc2xpY2UoLTIpICsgJy4nICtcbiAgICAgICAgKCcwMCcgKyBkLmdldFVUQ01pbGxpc2Vjb25kcygpKS5zbGljZSgtMyk7XG5cbiAgICAgIGNvbnNvbGUubG9nKCdbJyArIGRhdGVTdHJpbmcgKyAnXScsIHN0ciwgYXJncy5qb2luKCcgJykpO1xuICAgIH1cbiAgfVxuXG4gIC8vIEdlbmVyYXRvciBvZiBkZWZhdWx0IHByb21pc2VzIGZvciBzZW50IHBhY2tldHMuXG4gICNtYWtlUHJvbWlzZShpZCkge1xuICAgIGxldCBwcm9taXNlID0gbnVsbDtcbiAgICBpZiAoaWQpIHtcbiAgICAgIHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIC8vIFN0b3JlZCBjYWxsYmFja3Mgd2lsbCBiZSBjYWxsZWQgd2hlbiB0aGUgcmVzcG9uc2UgcGFja2V0IHdpdGggdGhpcyBJZCBhcnJpdmVzXG4gICAgICAgIHRoaXMuX3BlbmRpbmdQcm9taXNlc1tpZF0gPSB7XG4gICAgICAgICAgJ3Jlc29sdmUnOiByZXNvbHZlLFxuICAgICAgICAgICdyZWplY3QnOiByZWplY3QsXG4gICAgICAgICAgJ3RzJzogbmV3IERhdGUoKVxuICAgICAgICB9O1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBwcm9taXNlO1xuICB9O1xuXG4gIC8vIFJlc29sdmUgb3IgcmVqZWN0IGEgcGVuZGluZyBwcm9taXNlLlxuICAvLyBVbnJlc29sdmVkIHByb21pc2VzIGFyZSBzdG9yZWQgaW4gX3BlbmRpbmdQcm9taXNlcy5cbiAgI2V4ZWNQcm9taXNlKGlkLCBjb2RlLCBvbk9LLCBlcnJvclRleHQpIHtcbiAgICBjb25zdCBjYWxsYmFja3MgPSB0aGlzLl9wZW5kaW5nUHJvbWlzZXNbaWRdO1xuICAgIGlmIChjYWxsYmFja3MpIHtcbiAgICAgIGRlbGV0ZSB0aGlzLl9wZW5kaW5nUHJvbWlzZXNbaWRdO1xuICAgICAgaWYgKGNvZGUgPj0gMjAwICYmIGNvZGUgPCA0MDApIHtcbiAgICAgICAgaWYgKGNhbGxiYWNrcy5yZXNvbHZlKSB7XG4gICAgICAgICAgY2FsbGJhY2tzLnJlc29sdmUob25PSyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoY2FsbGJhY2tzLnJlamVjdCkge1xuICAgICAgICBjYWxsYmFja3MucmVqZWN0KG5ldyBFcnJvcihgJHtlcnJvclRleHR9ICgke2NvZGV9KWApKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBTZW5kIGEgcGFja2V0LiBJZiBwYWNrZXQgaWQgaXMgcHJvdmlkZWQgcmV0dXJuIGEgcHJvbWlzZS5cbiAgI3NlbmQocGt0LCBpZCkge1xuICAgIGxldCBwcm9taXNlO1xuICAgIGlmIChpZCkge1xuICAgICAgcHJvbWlzZSA9IHRoaXMuI21ha2VQcm9taXNlKGlkKTtcbiAgICB9XG4gICAgcGt0ID0gc2ltcGxpZnkocGt0KTtcbiAgICBsZXQgbXNnID0gSlNPTi5zdHJpbmdpZnkocGt0KTtcbiAgICB0aGlzLmxvZ2dlcihcIm91dDogXCIgKyAodGhpcy5fdHJpbUxvbmdTdHJpbmdzID8gSlNPTi5zdHJpbmdpZnkocGt0LCBqc29uTG9nZ2VySGVscGVyKSA6IG1zZykpO1xuICAgIHRyeSB7XG4gICAgICB0aGlzLl9jb25uZWN0aW9uLnNlbmRUZXh0KG1zZyk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAvLyBJZiBzZW5kVGV4dCB0aHJvd3MsIHdyYXAgdGhlIGVycm9yIGluIGEgcHJvbWlzZSBvciByZXRocm93LlxuICAgICAgaWYgKGlkKSB7XG4gICAgICAgIHRoaXMuI2V4ZWNQcm9taXNlKGlkLCBDb25uZWN0aW9uLk5FVFdPUktfRVJST1IsIG51bGwsIGVyci5tZXNzYWdlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IGVycjtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICAvLyBUaGUgbWFpbiBtZXNzYWdlIGRpc3BhdGNoZXIuXG4gICNkaXNwYXRjaE1lc3NhZ2UoZGF0YSkge1xuICAgIC8vIFNraXAgZW1wdHkgcmVzcG9uc2UuIFRoaXMgaGFwcGVucyB3aGVuIExQIHRpbWVzIG91dC5cbiAgICBpZiAoIWRhdGEpXG4gICAgICByZXR1cm47XG5cbiAgICB0aGlzLl9pblBhY2tldENvdW50Kys7XG5cbiAgICAvLyBTZW5kIHJhdyBtZXNzYWdlIHRvIGxpc3RlbmVyXG4gICAgaWYgKHRoaXMub25SYXdNZXNzYWdlKSB7XG4gICAgICB0aGlzLm9uUmF3TWVzc2FnZShkYXRhKTtcbiAgICB9XG5cbiAgICBpZiAoZGF0YSA9PT0gJzAnKSB7XG4gICAgICAvLyBTZXJ2ZXIgcmVzcG9uc2UgdG8gYSBuZXR3b3JrIHByb2JlLlxuICAgICAgaWYgKHRoaXMub25OZXR3b3JrUHJvYmUpIHtcbiAgICAgICAgdGhpcy5vbk5ldHdvcmtQcm9iZSgpO1xuICAgICAgfVxuICAgICAgLy8gTm8gcHJvY2Vzc2luZyBpcyBuZWNlc3NhcnkuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IHBrdCA9IEpTT04ucGFyc2UoZGF0YSwganNvblBhcnNlSGVscGVyKTtcbiAgICBpZiAoIXBrdCkge1xuICAgICAgdGhpcy5sb2dnZXIoXCJpbjogXCIgKyBkYXRhKTtcbiAgICAgIHRoaXMubG9nZ2VyKFwiRVJST1I6IGZhaWxlZCB0byBwYXJzZSBkYXRhXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmxvZ2dlcihcImluOiBcIiArICh0aGlzLl90cmltTG9uZ1N0cmluZ3MgPyBKU09OLnN0cmluZ2lmeShwa3QsIGpzb25Mb2dnZXJIZWxwZXIpIDogZGF0YSkpO1xuXG4gICAgICAvLyBTZW5kIGNvbXBsZXRlIHBhY2tldCB0byBsaXN0ZW5lclxuICAgICAgaWYgKHRoaXMub25NZXNzYWdlKSB7XG4gICAgICAgIHRoaXMub25NZXNzYWdlKHBrdCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChwa3QuY3RybCkge1xuICAgICAgICAvLyBIYW5kbGluZyB7Y3RybH0gbWVzc2FnZVxuICAgICAgICBpZiAodGhpcy5vbkN0cmxNZXNzYWdlKSB7XG4gICAgICAgICAgdGhpcy5vbkN0cmxNZXNzYWdlKHBrdC5jdHJsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJlc29sdmUgb3IgcmVqZWN0IGEgcGVuZGluZyBwcm9taXNlLCBpZiBhbnlcbiAgICAgICAgaWYgKHBrdC5jdHJsLmlkKSB7XG4gICAgICAgICAgdGhpcy4jZXhlY1Byb21pc2UocGt0LmN0cmwuaWQsIHBrdC5jdHJsLmNvZGUsIHBrdC5jdHJsLCBwa3QuY3RybC50ZXh0KTtcbiAgICAgICAgfVxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBpZiAocGt0LmN0cmwuY29kZSA9PSAyMDUgJiYgcGt0LmN0cmwudGV4dCA9PSAnZXZpY3RlZCcpIHtcbiAgICAgICAgICAgIC8vIFVzZXIgZXZpY3RlZCBmcm9tIHRvcGljLlxuICAgICAgICAgICAgY29uc3QgdG9waWMgPSB0aGlzLiNjYWNoZUdldCgndG9waWMnLCBwa3QuY3RybC50b3BpYyk7XG4gICAgICAgICAgICBpZiAodG9waWMpIHtcbiAgICAgICAgICAgICAgdG9waWMuX3Jlc2V0U3ViKCk7XG4gICAgICAgICAgICAgIGlmIChwa3QuY3RybC5wYXJhbXMgJiYgcGt0LmN0cmwucGFyYW1zLnVuc3ViKSB7XG4gICAgICAgICAgICAgICAgdG9waWMuX2dvbmUoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAocGt0LmN0cmwuY29kZSA8IDMwMCAmJiBwa3QuY3RybC5wYXJhbXMpIHtcbiAgICAgICAgICAgIGlmIChwa3QuY3RybC5wYXJhbXMud2hhdCA9PSAnZGF0YScpIHtcbiAgICAgICAgICAgICAgLy8gY29kZT0yMDgsIGFsbCBtZXNzYWdlcyByZWNlaXZlZDogXCJwYXJhbXNcIjp7XCJjb3VudFwiOjExLFwid2hhdFwiOlwiZGF0YVwifSxcbiAgICAgICAgICAgICAgY29uc3QgdG9waWMgPSB0aGlzLiNjYWNoZUdldCgndG9waWMnLCBwa3QuY3RybC50b3BpYyk7XG4gICAgICAgICAgICAgIGlmICh0b3BpYykge1xuICAgICAgICAgICAgICAgIHRvcGljLl9hbGxNZXNzYWdlc1JlY2VpdmVkKHBrdC5jdHJsLnBhcmFtcy5jb3VudCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAocGt0LmN0cmwucGFyYW1zLndoYXQgPT0gJ3N1YicpIHtcbiAgICAgICAgICAgICAgLy8gY29kZT0yMDQsIHRoZSB0b3BpYyBoYXMgbm8gKHJlZnJlc2hlZCkgc3Vic2NyaXB0aW9ucy5cbiAgICAgICAgICAgICAgY29uc3QgdG9waWMgPSB0aGlzLiNjYWNoZUdldCgndG9waWMnLCBwa3QuY3RybC50b3BpYyk7XG4gICAgICAgICAgICAgIGlmICh0b3BpYykge1xuICAgICAgICAgICAgICAgIC8vIFRyaWdnZXIgdG9waWMub25TdWJzVXBkYXRlZC5cbiAgICAgICAgICAgICAgICB0b3BpYy5fcHJvY2Vzc01ldGFTdWIoW10pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LCAwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIGlmIChwa3QubWV0YSkge1xuICAgICAgICAgICAgLy8gSGFuZGxpbmcgYSB7bWV0YX0gbWVzc2FnZS5cbiAgICAgICAgICAgIC8vIFByZWZlcnJlZCBBUEk6IFJvdXRlIG1ldGEgdG8gdG9waWMsIGlmIG9uZSBpcyByZWdpc3RlcmVkXG4gICAgICAgICAgICBjb25zdCB0b3BpYyA9IHRoaXMuI2NhY2hlR2V0KCd0b3BpYycsIHBrdC5tZXRhLnRvcGljKTtcbiAgICAgICAgICAgIGlmICh0b3BpYykge1xuICAgICAgICAgICAgICB0b3BpYy5fcm91dGVNZXRhKHBrdC5tZXRhKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHBrdC5tZXRhLmlkKSB7XG4gICAgICAgICAgICAgIHRoaXMuI2V4ZWNQcm9taXNlKHBrdC5tZXRhLmlkLCAyMDAsIHBrdC5tZXRhLCAnTUVUQScpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBTZWNvbmRhcnkgQVBJOiBjYWxsYmFja1xuICAgICAgICAgICAgaWYgKHRoaXMub25NZXRhTWVzc2FnZSkge1xuICAgICAgICAgICAgICB0aGlzLm9uTWV0YU1lc3NhZ2UocGt0Lm1ldGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAocGt0LmRhdGEpIHtcbiAgICAgICAgICAgIC8vIEhhbmRsaW5nIHtkYXRhfSBtZXNzYWdlXG4gICAgICAgICAgICAvLyBQcmVmZXJyZWQgQVBJOiBSb3V0ZSBkYXRhIHRvIHRvcGljLCBpZiBvbmUgaXMgcmVnaXN0ZXJlZFxuICAgICAgICAgICAgY29uc3QgdG9waWMgPSB0aGlzLiNjYWNoZUdldCgndG9waWMnLCBwa3QuZGF0YS50b3BpYyk7XG4gICAgICAgICAgICBpZiAodG9waWMpIHtcbiAgICAgICAgICAgICAgdG9waWMuX3JvdXRlRGF0YShwa3QuZGF0YSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFNlY29uZGFyeSBBUEk6IENhbGwgY2FsbGJhY2tcbiAgICAgICAgICAgIGlmICh0aGlzLm9uRGF0YU1lc3NhZ2UpIHtcbiAgICAgICAgICAgICAgdGhpcy5vbkRhdGFNZXNzYWdlKHBrdC5kYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKHBrdC5wcmVzKSB7XG4gICAgICAgICAgICAvLyBIYW5kbGluZyB7cHJlc30gbWVzc2FnZVxuICAgICAgICAgICAgLy8gUHJlZmVycmVkIEFQSTogUm91dGUgcHJlc2VuY2UgdG8gdG9waWMsIGlmIG9uZSBpcyByZWdpc3RlcmVkXG4gICAgICAgICAgICBjb25zdCB0b3BpYyA9IHRoaXMuI2NhY2hlR2V0KCd0b3BpYycsIHBrdC5wcmVzLnRvcGljKTtcbiAgICAgICAgICAgIGlmICh0b3BpYykge1xuICAgICAgICAgICAgICB0b3BpYy5fcm91dGVQcmVzKHBrdC5wcmVzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gU2Vjb25kYXJ5IEFQSSAtIGNhbGxiYWNrXG4gICAgICAgICAgICBpZiAodGhpcy5vblByZXNNZXNzYWdlKSB7XG4gICAgICAgICAgICAgIHRoaXMub25QcmVzTWVzc2FnZShwa3QucHJlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChwa3QuaW5mbykge1xuICAgICAgICAgICAgLy8ge2luZm99IG1lc3NhZ2UgLSByZWFkL3JlY2VpdmVkIG5vdGlmaWNhdGlvbnMgYW5kIGtleSBwcmVzc2VzXG4gICAgICAgICAgICAvLyBQcmVmZXJyZWQgQVBJOiBSb3V0ZSB7aW5mb319IHRvIHRvcGljLCBpZiBvbmUgaXMgcmVnaXN0ZXJlZFxuICAgICAgICAgICAgY29uc3QgdG9waWMgPSB0aGlzLiNjYWNoZUdldCgndG9waWMnLCBwa3QuaW5mby50b3BpYyk7XG4gICAgICAgICAgICBpZiAodG9waWMpIHtcbiAgICAgICAgICAgICAgdG9waWMuX3JvdXRlSW5mbyhwa3QuaW5mbyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFNlY29uZGFyeSBBUEkgLSBjYWxsYmFja1xuICAgICAgICAgICAgaWYgKHRoaXMub25JbmZvTWVzc2FnZSkge1xuICAgICAgICAgICAgICB0aGlzLm9uSW5mb01lc3NhZ2UocGt0LmluZm8pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlcihcIkVSUk9SOiBVbmtub3duIHBhY2tldCByZWNlaXZlZC5cIik7XG4gICAgICAgICAgfVxuICAgICAgICB9LCAwKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBDb25uZWN0aW9uIG9wZW4sIHJlYWR5IHRvIHN0YXJ0IHNlbmRpbmcuXG4gICNjb25uZWN0aW9uT3BlbigpIHtcbiAgICBpZiAoIXRoaXMuX2V4cGlyZVByb21pc2VzKSB7XG4gICAgICAvLyBSZWplY3QgcHJvbWlzZXMgd2hpY2ggaGF2ZSBub3QgYmVlbiByZXNvbHZlZCBmb3IgdG9vIGxvbmcuXG4gICAgICB0aGlzLl9leHBpcmVQcm9taXNlcyA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgY29uc3QgZXJyID0gbmV3IEVycm9yKFwiVGltZW91dCAoNTA0KVwiKTtcbiAgICAgICAgY29uc3QgZXhwaXJlcyA9IG5ldyBEYXRlKG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gQ29uc3QuRVhQSVJFX1BST01JU0VTX1RJTUVPVVQpO1xuICAgICAgICBmb3IgKGxldCBpZCBpbiB0aGlzLl9wZW5kaW5nUHJvbWlzZXMpIHtcbiAgICAgICAgICBsZXQgY2FsbGJhY2tzID0gdGhpcy5fcGVuZGluZ1Byb21pc2VzW2lkXTtcbiAgICAgICAgICBpZiAoY2FsbGJhY2tzICYmIGNhbGxiYWNrcy50cyA8IGV4cGlyZXMpIHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyKFwiUHJvbWlzZSBleHBpcmVkXCIsIGlkKTtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9wZW5kaW5nUHJvbWlzZXNbaWRdO1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrcy5yZWplY3QpIHtcbiAgICAgICAgICAgICAgY2FsbGJhY2tzLnJlamVjdChlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwgQ29uc3QuRVhQSVJFX1BST01JU0VTX1BFUklPRCk7XG4gICAgfVxuICAgIHRoaXMuaGVsbG8oKTtcbiAgfVxuXG4gICNkaXNjb25uZWN0ZWQoZXJyLCBjb2RlKSB7XG4gICAgdGhpcy5faW5QYWNrZXRDb3VudCA9IDA7XG4gICAgdGhpcy5fc2VydmVySW5mbyA9IG51bGw7XG4gICAgdGhpcy5fYXV0aGVudGljYXRlZCA9IGZhbHNlO1xuXG4gICAgaWYgKHRoaXMuX2V4cGlyZVByb21pc2VzKSB7XG4gICAgICBjbGVhckludGVydmFsKHRoaXMuX2V4cGlyZVByb21pc2VzKTtcbiAgICAgIHRoaXMuX2V4cGlyZVByb21pc2VzID0gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBNYXJrIGFsbCB0b3BpY3MgYXMgdW5zdWJzY3JpYmVkXG4gICAgdGhpcy4jY2FjaGVNYXAoJ3RvcGljJywgKHRvcGljLCBrZXkpID0+IHtcbiAgICAgIHRvcGljLl9yZXNldFN1YigpO1xuICAgIH0pO1xuXG4gICAgLy8gUmVqZWN0IGFsbCBwZW5kaW5nIHByb21pc2VzXG4gICAgZm9yIChsZXQga2V5IGluIHRoaXMuX3BlbmRpbmdQcm9taXNlcykge1xuICAgICAgY29uc3QgY2FsbGJhY2tzID0gdGhpcy5fcGVuZGluZ1Byb21pc2VzW2tleV07XG4gICAgICBpZiAoY2FsbGJhY2tzICYmIGNhbGxiYWNrcy5yZWplY3QpIHtcbiAgICAgICAgY2FsbGJhY2tzLnJlamVjdChlcnIpO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLl9wZW5kaW5nUHJvbWlzZXMgPSB7fTtcblxuICAgIGlmICh0aGlzLm9uRGlzY29ubmVjdCkge1xuICAgICAgdGhpcy5vbkRpc2Nvbm5lY3QoZXJyKTtcbiAgICB9XG4gIH1cblxuICAvLyBHZXQgVXNlciBBZ2VudCBzdHJpbmdcbiAgI2dldFVzZXJBZ2VudCgpIHtcbiAgICByZXR1cm4gdGhpcy5fYXBwTmFtZSArICcgKCcgKyAodGhpcy5fYnJvd3NlciA/IHRoaXMuX2Jyb3dzZXIgKyAnOyAnIDogJycpICsgdGhpcy5faHdvcyArICcpOyAnICsgQ29uc3QuTElCUkFSWTtcbiAgfVxuXG4gIC8vIEdlbmVyYXRvciBvZiBwYWNrZXRzIHN0dWJzXG4gICNpbml0UGFja2V0KHR5cGUsIHRvcGljKSB7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICBjYXNlICdoaSc6XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgJ2hpJzoge1xuICAgICAgICAgICAgJ2lkJzogdGhpcy5nZXROZXh0VW5pcXVlSWQoKSxcbiAgICAgICAgICAgICd2ZXInOiBDb25zdC5WRVJTSU9OLFxuICAgICAgICAgICAgJ3VhJzogdGhpcy4jZ2V0VXNlckFnZW50KCksXG4gICAgICAgICAgICAnZGV2JzogdGhpcy5fZGV2aWNlVG9rZW4sXG4gICAgICAgICAgICAnbGFuZyc6IHRoaXMuX2h1bWFuTGFuZ3VhZ2UsXG4gICAgICAgICAgICAncGxhdGYnOiB0aGlzLl9wbGF0Zm9ybVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgY2FzZSAnYWNjJzpcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAnYWNjJzoge1xuICAgICAgICAgICAgJ2lkJzogdGhpcy5nZXROZXh0VW5pcXVlSWQoKSxcbiAgICAgICAgICAgICd1c2VyJzogbnVsbCxcbiAgICAgICAgICAgICdzY2hlbWUnOiBudWxsLFxuICAgICAgICAgICAgJ3NlY3JldCc6IG51bGwsXG4gICAgICAgICAgICAnbG9naW4nOiBmYWxzZSxcbiAgICAgICAgICAgICd0YWdzJzogbnVsbCxcbiAgICAgICAgICAgICdkZXNjJzoge30sXG4gICAgICAgICAgICAnY3JlZCc6IHt9XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICBjYXNlICdsb2dpbic6XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgJ2xvZ2luJzoge1xuICAgICAgICAgICAgJ2lkJzogdGhpcy5nZXROZXh0VW5pcXVlSWQoKSxcbiAgICAgICAgICAgICdzY2hlbWUnOiBudWxsLFxuICAgICAgICAgICAgJ3NlY3JldCc6IG51bGxcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgIGNhc2UgJ3N1Yic6XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgJ3N1Yic6IHtcbiAgICAgICAgICAgICdpZCc6IHRoaXMuZ2V0TmV4dFVuaXF1ZUlkKCksXG4gICAgICAgICAgICAndG9waWMnOiB0b3BpYyxcbiAgICAgICAgICAgICdzZXQnOiB7fSxcbiAgICAgICAgICAgICdnZXQnOiB7fVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgY2FzZSAnbGVhdmUnOlxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICdsZWF2ZSc6IHtcbiAgICAgICAgICAgICdpZCc6IHRoaXMuZ2V0TmV4dFVuaXF1ZUlkKCksXG4gICAgICAgICAgICAndG9waWMnOiB0b3BpYyxcbiAgICAgICAgICAgICd1bnN1Yic6IGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICBjYXNlICdwdWInOlxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICdwdWInOiB7XG4gICAgICAgICAgICAnaWQnOiB0aGlzLmdldE5leHRVbmlxdWVJZCgpLFxuICAgICAgICAgICAgJ3RvcGljJzogdG9waWMsXG4gICAgICAgICAgICAnbm9lY2hvJzogZmFsc2UsXG4gICAgICAgICAgICAnaGVhZCc6IG51bGwsXG4gICAgICAgICAgICAnY29udGVudCc6IHt9XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICBjYXNlICdnZXQnOlxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICdnZXQnOiB7XG4gICAgICAgICAgICAnaWQnOiB0aGlzLmdldE5leHRVbmlxdWVJZCgpLFxuICAgICAgICAgICAgJ3RvcGljJzogdG9waWMsXG4gICAgICAgICAgICAnd2hhdCc6IG51bGwsXG4gICAgICAgICAgICAnZGVzYyc6IHt9LFxuICAgICAgICAgICAgJ3N1Yic6IHt9LFxuICAgICAgICAgICAgJ2RhdGEnOiB7fVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgY2FzZSAnc2V0JzpcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAnc2V0Jzoge1xuICAgICAgICAgICAgJ2lkJzogdGhpcy5nZXROZXh0VW5pcXVlSWQoKSxcbiAgICAgICAgICAgICd0b3BpYyc6IHRvcGljLFxuICAgICAgICAgICAgJ2Rlc2MnOiB7fSxcbiAgICAgICAgICAgICdzdWInOiB7fSxcbiAgICAgICAgICAgICd0YWdzJzogW10sXG4gICAgICAgICAgICAnZXBoZW1lcmFsJzoge31cbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgIGNhc2UgJ2RlbCc6XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgJ2RlbCc6IHtcbiAgICAgICAgICAgICdpZCc6IHRoaXMuZ2V0TmV4dFVuaXF1ZUlkKCksXG4gICAgICAgICAgICAndG9waWMnOiB0b3BpYyxcbiAgICAgICAgICAgICd3aGF0JzogbnVsbCxcbiAgICAgICAgICAgICdkZWxzZXEnOiBudWxsLFxuICAgICAgICAgICAgJ3VzZXInOiBudWxsLFxuICAgICAgICAgICAgJ2hhcmQnOiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgY2FzZSAnbm90ZSc6XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgJ25vdGUnOiB7XG4gICAgICAgICAgICAvLyBubyBpZCBieSBkZXNpZ24gKGV4Y2VwdCBjYWxscykuXG4gICAgICAgICAgICAndG9waWMnOiB0b3BpYyxcbiAgICAgICAgICAgICd3aGF0JzogbnVsbCwgLy8gb25lIG9mIFwicmVjdlwiLCBcInJlYWRcIiwgXCJrcFwiLCBcImNhbGxcIlxuICAgICAgICAgICAgJ3NlcSc6IHVuZGVmaW5lZCAvLyB0aGUgc2VydmVyLXNpZGUgbWVzc2FnZSBpZCBhY2tub3dsZWRnZWQgYXMgcmVjZWl2ZWQgb3IgcmVhZC5cbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5rbm93biBwYWNrZXQgdHlwZSByZXF1ZXN0ZWQ6ICR7dHlwZX1gKTtcbiAgICB9XG4gIH1cblxuICAvLyBDYWNoZSBtYW5hZ2VtZW50XG4gICNjYWNoZVB1dCh0eXBlLCBuYW1lLCBvYmopIHtcbiAgICB0aGlzLl9jYWNoZVt0eXBlICsgJzonICsgbmFtZV0gPSBvYmo7XG4gIH1cbiAgI2NhY2hlR2V0KHR5cGUsIG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5fY2FjaGVbdHlwZSArICc6JyArIG5hbWVdO1xuICB9XG4gICNjYWNoZURlbCh0eXBlLCBuYW1lKSB7XG4gICAgZGVsZXRlIHRoaXMuX2NhY2hlW3R5cGUgKyAnOicgKyBuYW1lXTtcbiAgfVxuXG4gIC8vIEVudW1lcmF0ZSBhbGwgaXRlbXMgaW4gY2FjaGUsIGNhbGwgZnVuYyBmb3IgZWFjaCBpdGVtLlxuICAvLyBFbnVtZXJhdGlvbiBzdG9wcyBpZiBmdW5jIHJldHVybnMgdHJ1ZS5cbiAgI2NhY2hlTWFwKHR5cGUsIGZ1bmMsIGNvbnRleHQpIHtcbiAgICBjb25zdCBrZXkgPSB0eXBlID8gdHlwZSArICc6JyA6IHVuZGVmaW5lZDtcbiAgICBmb3IgKGxldCBpZHggaW4gdGhpcy5fY2FjaGUpIHtcbiAgICAgIGlmICgha2V5IHx8IGlkeC5pbmRleE9mKGtleSkgPT0gMCkge1xuICAgICAgICBpZiAoZnVuYy5jYWxsKGNvbnRleHQsIHRoaXMuX2NhY2hlW2lkeF0sIGlkeCkpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIE1ha2UgbGltaXRlZCBjYWNoZSBtYW5hZ2VtZW50IGF2YWlsYWJsZSB0byB0b3BpYy5cbiAgLy8gQ2FjaGluZyB1c2VyLnB1YmxpYyBvbmx5LiBFdmVyeXRoaW5nIGVsc2UgaXMgcGVyLXRvcGljLlxuICAjYXR0YWNoQ2FjaGVUb1RvcGljKHRvcGljKSB7XG4gICAgdG9waWMuX3Rpbm9kZSA9IHRoaXM7XG5cbiAgICB0b3BpYy5fY2FjaGVHZXRVc2VyID0gKHVpZCkgPT4ge1xuICAgICAgY29uc3QgcHViID0gdGhpcy4jY2FjaGVHZXQoJ3VzZXInLCB1aWQpO1xuICAgICAgaWYgKHB1Yikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHVzZXI6IHVpZCxcbiAgICAgICAgICBwdWJsaWM6IG1lcmdlT2JqKHt9LCBwdWIpXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH07XG4gICAgdG9waWMuX2NhY2hlUHV0VXNlciA9ICh1aWQsIHVzZXIpID0+IHtcbiAgICAgIHRoaXMuI2NhY2hlUHV0KCd1c2VyJywgdWlkLCBtZXJnZU9iaih7fSwgdXNlci5wdWJsaWMpKTtcbiAgICB9O1xuICAgIHRvcGljLl9jYWNoZURlbFVzZXIgPSAodWlkKSA9PiB7XG4gICAgICB0aGlzLiNjYWNoZURlbCgndXNlcicsIHVpZCk7XG4gICAgfTtcbiAgICB0b3BpYy5fY2FjaGVQdXRTZWxmID0gXyA9PiB7XG4gICAgICB0aGlzLiNjYWNoZVB1dCgndG9waWMnLCB0b3BpYy5uYW1lLCB0b3BpYyk7XG4gICAgfTtcbiAgICB0b3BpYy5fY2FjaGVEZWxTZWxmID0gXyA9PiB7XG4gICAgICB0aGlzLiNjYWNoZURlbCgndG9waWMnLCB0b3BpYy5uYW1lKTtcbiAgICB9O1xuICB9XG5cbiAgLy8gT24gc3VjY2Vzc2Z1bCBsb2dpbiBzYXZlIHNlcnZlci1wcm92aWRlZCBkYXRhLlxuICAjbG9naW5TdWNjZXNzZnVsKGN0cmwpIHtcbiAgICBpZiAoIWN0cmwucGFyYW1zIHx8ICFjdHJsLnBhcmFtcy51c2VyKSB7XG4gICAgICByZXR1cm4gY3RybDtcbiAgICB9XG4gICAgLy8gVGhpcyBpcyBhIHJlc3BvbnNlIHRvIGEgc3VjY2Vzc2Z1bCBsb2dpbixcbiAgICAvLyBleHRyYWN0IFVJRCBhbmQgc2VjdXJpdHkgdG9rZW4sIHNhdmUgaXQgaW4gVGlub2RlIG1vZHVsZVxuICAgIHRoaXMuX215VUlEID0gY3RybC5wYXJhbXMudXNlcjtcbiAgICB0aGlzLl9hdXRoZW50aWNhdGVkID0gKGN0cmwgJiYgY3RybC5jb2RlID49IDIwMCAmJiBjdHJsLmNvZGUgPCAzMDApO1xuICAgIGlmIChjdHJsLnBhcmFtcyAmJiBjdHJsLnBhcmFtcy50b2tlbiAmJiBjdHJsLnBhcmFtcy5leHBpcmVzKSB7XG4gICAgICB0aGlzLl9hdXRoVG9rZW4gPSB7XG4gICAgICAgIHRva2VuOiBjdHJsLnBhcmFtcy50b2tlbixcbiAgICAgICAgZXhwaXJlczogY3RybC5wYXJhbXMuZXhwaXJlc1xuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fYXV0aFRva2VuID0gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vbkxvZ2luKSB7XG4gICAgICB0aGlzLm9uTG9naW4oY3RybC5jb2RlLCBjdHJsLnRleHQpO1xuICAgIH1cblxuICAgIHJldHVybiBjdHJsO1xuICB9XG5cbiAgLy8gU3RhdGljIG1ldGhvZHMuXG4gIC8qKlxuICAgKiBIZWxwZXIgbWV0aG9kIHRvIHBhY2thZ2UgYWNjb3VudCBjcmVkZW50aWFsLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmcgfCBDcmVkZW50aWFsfSBtZXRoIC0gdmFsaWRhdGlvbiBtZXRob2Qgb3Igb2JqZWN0IHdpdGggdmFsaWRhdGlvbiBkYXRhLlxuICAgKiBAcGFyYW0ge3N0cmluZz19IHZhbCAtIHZhbGlkYXRpb24gdmFsdWUgKGUuZy4gZW1haWwgb3IgcGhvbmUgbnVtYmVyKS5cbiAgICogQHBhcmFtIHtPYmplY3Q9fSBwYXJhbXMgLSB2YWxpZGF0aW9uIHBhcmFtZXRlcnMuXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gcmVzcCAtIHZhbGlkYXRpb24gcmVzcG9uc2UuXG4gICAqXG4gICAqIEByZXR1cm5zIHtBcnJheS48Q3JlZGVudGlhbD59IGFycmF5IHdpdGggYSBzaW5nbGUgY3JlZGVudGlhbCBvciA8Y29kZT5udWxsPC9jb2RlPiBpZiBubyB2YWxpZCBjcmVkZW50aWFscyB3ZXJlIGdpdmVuLlxuICAgKi9cbiAgc3RhdGljIGNyZWRlbnRpYWwobWV0aCwgdmFsLCBwYXJhbXMsIHJlc3ApIHtcbiAgICBpZiAodHlwZW9mIG1ldGggPT0gJ29iamVjdCcpIHtcbiAgICAgICh7XG4gICAgICAgIHZhbCxcbiAgICAgICAgcGFyYW1zLFxuICAgICAgICByZXNwLFxuICAgICAgICBtZXRoXG4gICAgICB9ID0gbWV0aCk7XG4gICAgfVxuICAgIGlmIChtZXRoICYmICh2YWwgfHwgcmVzcCkpIHtcbiAgICAgIHJldHVybiBbe1xuICAgICAgICAnbWV0aCc6IG1ldGgsXG4gICAgICAgICd2YWwnOiB2YWwsXG4gICAgICAgICdyZXNwJzogcmVzcCxcbiAgICAgICAgJ3BhcmFtcyc6IHBhcmFtc1xuICAgICAgfV07XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIERldGVybWluZSB0b3BpYyB0eXBlIGZyb20gdG9waWMncyBuYW1lOiBncnAsIHAycCwgbWUsIGZuZCwgc3lzLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byB0ZXN0LlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBPbmUgb2YgPGNvZGU+XCJtZVwiPC9jb2RlPiwgPGNvZGU+XCJmbmRcIjwvY29kZT4sIDxjb2RlPlwic3lzXCI8L2NvZGU+LCA8Y29kZT5cImdycFwiPC9jb2RlPixcbiAgICogICAgPGNvZGU+XCJwMnBcIjwvY29kZT4gb3IgPGNvZGU+dW5kZWZpbmVkPC9jb2RlPi5cbiAgICovXG4gIHN0YXRpYyB0b3BpY1R5cGUobmFtZSkge1xuICAgIHJldHVybiBUb3BpYy50b3BpY1R5cGUobmFtZSk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgdGhlIGdpdmVuIHRvcGljIG5hbWUgaXMgYSBuYW1lIG9mIGEgJ21lJyB0b3BpYy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gdGVzdC5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIHRoZSBuYW1lIGlzIGEgbmFtZSBvZiBhICdtZScgdG9waWMsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBzdGF0aWMgaXNNZVRvcGljTmFtZShuYW1lKSB7XG4gICAgcmV0dXJuIFRvcGljLmlzTWVUb3BpY05hbWUobmFtZSk7XG4gIH1cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSBnaXZlbiB0b3BpYyBuYW1lIGlzIGEgbmFtZSBvZiBhIGdyb3VwIHRvcGljLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byB0ZXN0LlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgdGhlIG5hbWUgaXMgYSBuYW1lIG9mIGEgZ3JvdXAgdG9waWMsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBzdGF0aWMgaXNHcm91cFRvcGljTmFtZShuYW1lKSB7XG4gICAgcmV0dXJuIFRvcGljLmlzR3JvdXBUb3BpY05hbWUobmFtZSk7XG4gIH1cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSBnaXZlbiB0b3BpYyBuYW1lIGlzIGEgbmFtZSBvZiBhIHAycCB0b3BpYy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gdGVzdC5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIHRoZSBuYW1lIGlzIGEgbmFtZSBvZiBhIHAycCB0b3BpYywgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIHN0YXRpYyBpc1AyUFRvcGljTmFtZShuYW1lKSB7XG4gICAgcmV0dXJuIFRvcGljLmlzUDJQVG9waWNOYW1lKG5hbWUpO1xuICB9XG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgZ2l2ZW4gdG9waWMgbmFtZSBpcyBhIG5hbWUgb2YgYSBjb21tdW5pY2F0aW9uIHRvcGljLCBpLmUuIFAyUCBvciBncm91cC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gdGVzdC5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIHRoZSBuYW1lIGlzIGEgbmFtZSBvZiBhIHAycCBvciBncm91cCB0b3BpYywgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIHN0YXRpYyBpc0NvbW1Ub3BpY05hbWUobmFtZSkge1xuICAgIHJldHVybiBUb3BpYy5pc0NvbW1Ub3BpY05hbWUobmFtZSk7XG4gIH1cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSB0b3BpYyBuYW1lIGlzIGEgbmFtZSBvZiBhIG5ldyB0b3BpYy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gdG9waWMgbmFtZSB0byBjaGVjay5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIHRoZSBuYW1lIGlzIGEgbmFtZSBvZiBhIG5ldyB0b3BpYywgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIHN0YXRpYyBpc05ld0dyb3VwVG9waWNOYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gVG9waWMuaXNOZXdHcm91cFRvcGljTmFtZShuYW1lKTtcbiAgfVxuICAvKipcbiAgICogQ2hlY2sgaWYgdGhlIHRvcGljIG5hbWUgaXMgYSBuYW1lIG9mIGEgY2hhbm5lbC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gdG9waWMgbmFtZSB0byBjaGVjay5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIHRoZSBuYW1lIGlzIGEgbmFtZSBvZiBhIGNoYW5uZWwsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBzdGF0aWMgaXNDaGFubmVsVG9waWNOYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gVG9waWMuaXNDaGFubmVsVG9waWNOYW1lKG5hbWUpO1xuICB9XG4gIC8qKlxuICAgKiBSZXR1cm4gaW5mb3JtYXRpb24gYWJvdXQgdGhlIGN1cnJlbnQgdmVyc2lvbiBvZiB0aGlzIFRpbm9kZSBjbGllbnQgbGlicmFyeS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IHNlbWFudGljIHZlcnNpb24gb2YgdGhlIGxpYnJhcnksIGUuZy4gPGNvZGU+XCIwLjE1LjUtcmMxXCI8L2NvZGU+LlxuICAgKi9cbiAgc3RhdGljIGdldFZlcnNpb24oKSB7XG4gICAgcmV0dXJuIENvbnN0LlZFUlNJT047XG4gIH1cbiAgLyoqXG4gICAqIFRvIHVzZSBUaW5vZGUgaW4gYSBub24gYnJvd3NlciBjb250ZXh0LCBzdXBwbHkgV2ViU29ja2V0IGFuZCBYTUxIdHRwUmVxdWVzdCBwcm92aWRlcnMuXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAcGFyYW0gd3NQcm92aWRlciA8Y29kZT5XZWJTb2NrZXQ8L2NvZGU+IHByb3ZpZGVyLCBlLmcuIGZvciBub2RlSlMgLCA8Y29kZT5yZXF1aXJlKCd3cycpPC9jb2RlPi5cbiAgICogQHBhcmFtIHhoclByb3ZpZGVyIDxjb2RlPlhNTEh0dHBSZXF1ZXN0PC9jb2RlPiBwcm92aWRlciwgZS5nLiBmb3Igbm9kZSA8Y29kZT5yZXF1aXJlKCd4aHInKTwvY29kZT4uXG4gICAqL1xuICBzdGF0aWMgc2V0TmV0d29ya1Byb3ZpZGVycyh3c1Byb3ZpZGVyLCB4aHJQcm92aWRlcikge1xuICAgIFdlYlNvY2tldFByb3ZpZGVyID0gd3NQcm92aWRlcjtcbiAgICBYSFJQcm92aWRlciA9IHhoclByb3ZpZGVyO1xuXG4gICAgQ29ubmVjdGlvbi5zZXROZXR3b3JrUHJvdmlkZXJzKFdlYlNvY2tldFByb3ZpZGVyLCBYSFJQcm92aWRlcik7XG4gICAgTGFyZ2VGaWxlSGVscGVyLnNldE5ldHdvcmtQcm92aWRlcihYSFJQcm92aWRlcik7XG4gIH1cbiAgLyoqXG4gICAqIFRvIHVzZSBUaW5vZGUgaW4gYSBub24gYnJvd3NlciBjb250ZXh0LCBzdXBwbHkgPGNvZGU+aW5kZXhlZERCPC9jb2RlPiBwcm92aWRlci5cbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBwYXJhbSBpZGJQcm92aWRlciA8Y29kZT5pbmRleGVkREI8L2NvZGU+IHByb3ZpZGVyLCBlLmcuIGZvciBub2RlSlMgLCA8Y29kZT5yZXF1aXJlKCdmYWtlLWluZGV4ZWRkYicpPC9jb2RlPi5cbiAgICovXG4gIHN0YXRpYyBzZXREYXRhYmFzZVByb3ZpZGVyKGlkYlByb3ZpZGVyKSB7XG4gICAgSW5kZXhlZERCUHJvdmlkZXIgPSBpZGJQcm92aWRlcjtcblxuICAgIERCQ2FjaGUuc2V0RGF0YWJhc2VQcm92aWRlcihJbmRleGVkREJQcm92aWRlcik7XG4gIH1cbiAgLyoqXG4gICAqIFJldHVybiBpbmZvcm1hdGlvbiBhYm91dCB0aGUgY3VycmVudCBuYW1lIGFuZCB2ZXJzaW9uIG9mIHRoaXMgVGlub2RlIGxpYnJhcnkuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSB0aGUgbmFtZSBvZiB0aGUgbGlicmFyeSBhbmQgaXQncyB2ZXJzaW9uLlxuICAgKi9cbiAgc3RhdGljIGdldExpYnJhcnkoKSB7XG4gICAgcmV0dXJuIENvbnN0LkxJQlJBUlk7XG4gIH1cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSBnaXZlbiBzdHJpbmcgcmVwcmVzZW50cyA8Y29kZT5OVUxMPC9jb2RlPiB2YWx1ZSBhcyBkZWZpbmVkIGJ5IFRpbm9kZSAoPGNvZGU+J1xcdTI0MjEnPC9jb2RlPikuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyIC0gc3RyaW5nIHRvIGNoZWNrIGZvciA8Y29kZT5OVUxMPC9jb2RlPiB2YWx1ZS5cbiAgICpcbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIHN0cmluZyByZXByZXNlbnRzIDxjb2RlPk5VTEw8L2NvZGU+IHZhbHVlLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgc3RhdGljIGlzTnVsbFZhbHVlKHN0cikge1xuICAgIHJldHVybiBzdHIgPT09IENvbnN0LkRFTF9DSEFSO1xuICB9XG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgZ2l2ZW4gVVJMIHN0cmluZyBpcyBhIHJlbGF0aXZlIFVSTC5cbiAgICogQ2hlY2sgZm9yIGNhc2VzIGxpa2U6XG4gICAqICA8Y29kZT4naHR0cDovL2V4YW1wbGUuY29tJzwvY29kZT5cbiAgICogIDxjb2RlPicgaHR0cDovL2V4YW1wbGUuY29tJzwvY29kZT5cbiAgICogIDxjb2RlPicvL2V4YW1wbGUuY29tLyc8L2NvZGU+XG4gICAqICA8Y29kZT4naHR0cDpleGFtcGxlLmNvbSc8L2NvZGU+XG4gICAqICA8Y29kZT4naHR0cDovZXhhbXBsZS5jb20nPC9jb2RlPlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVybCAtIFVSTCBzdHJpbmcgdG8gY2hlY2suXG4gICAqXG4gICAqIEByZXR1cm5zIHtib29sZWFufSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0aGUgVVJMIGlzIHJlbGF0aXZlLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgc3RhdGljIGlzUmVsYXRpdmVVUkwodXJsKSB7XG4gICAgcmV0dXJuICEvXlxccyooW2Etel1bYS16MC05Ky4tXSo6fFxcL1xcLykvaW0udGVzdCh1cmwpO1xuICB9XG5cbiAgLy8gSW5zdGFuY2UgbWV0aG9kcy5cblxuICAvLyBHZW5lcmF0ZXMgdW5pcXVlIG1lc3NhZ2UgSURzXG4gIGdldE5leHRVbmlxdWVJZCgpIHtcbiAgICByZXR1cm4gKHRoaXMuX21lc3NhZ2VJZCAhPSAwKSA/ICcnICsgdGhpcy5fbWVzc2FnZUlkKysgOiB1bmRlZmluZWQ7XG4gIH07XG5cbiAgLyoqXG4gICAqIENvbm5lY3QgdG8gdGhlIHNlcnZlci5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGhvc3RfIC0gbmFtZSBvZiB0aGUgaG9zdCB0byBjb25uZWN0IHRvLlxuICAgKlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBQcm9taXNlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIGNvbm5lY3Rpb24gY2FsbCBjb21wbGV0ZXM6XG4gICAqICAgIDxjb2RlPnJlc29sdmUoKTwvY29kZT4gaXMgY2FsbGVkIHdpdGhvdXQgcGFyYW1ldGVycywgPGNvZGU+cmVqZWN0KCk8L2NvZGU+IHJlY2VpdmVzIHRoZVxuICAgKiAgICA8Y29kZT5FcnJvcjwvY29kZT4gYXMgYSBzaW5nbGUgcGFyYW1ldGVyLlxuICAgKi9cbiAgY29ubmVjdChob3N0Xykge1xuICAgIHJldHVybiB0aGlzLl9jb25uZWN0aW9uLmNvbm5lY3QoaG9zdF8pO1xuICB9XG5cbiAgLyoqXG4gICAqIEF0dGVtcHQgdG8gcmVjb25uZWN0IHRvIHRoZSBzZXJ2ZXIgaW1tZWRpYXRlbHkuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBmb3JjZSAtIHJlY29ubmVjdCBldmVuIGlmIHRoZXJlIGlzIGEgY29ubmVjdGlvbiBhbHJlYWR5LlxuICAgKi9cbiAgcmVjb25uZWN0KGZvcmNlKSB7XG4gICAgdGhpcy5fY29ubmVjdGlvbi5yZWNvbm5lY3QoZm9yY2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc2Nvbm5lY3QgZnJvbSB0aGUgc2VydmVyLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKi9cbiAgZGlzY29ubmVjdCgpIHtcbiAgICB0aGlzLl9jb25uZWN0aW9uLmRpc2Nvbm5lY3QoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbGVhciBwZXJzaXN0ZW50IGNhY2hlOiByZW1vdmUgSW5kZXhlZERCLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBQcm9taXNlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIG9wZXJhdGlvbiBpcyBjb21wbGV0ZWQuXG4gICAqL1xuICBjbGVhclN0b3JhZ2UoKSB7XG4gICAgaWYgKHRoaXMuX2RiLmlzUmVhZHkoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuX2RiLmRlbGV0ZURhdGFiYXNlKCk7XG4gICAgfVxuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIHBlcnNpc3RlbnQgY2FjaGU6IGNyZWF0ZSBJbmRleGVkREIgY2FjaGUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IFByb21pc2UgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgb3BlcmF0aW9uIGlzIGNvbXBsZXRlZC5cbiAgICovXG4gIGluaXRTdG9yYWdlKCkge1xuICAgIGlmICghdGhpcy5fZGIuaXNSZWFkeSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5fZGIuaW5pdERhdGFiYXNlKCk7XG4gICAgfVxuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kIGEgbmV0d29yayBwcm9iZSBtZXNzYWdlIHRvIG1ha2Ugc3VyZSB0aGUgY29ubmVjdGlvbiBpcyBhbGl2ZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICovXG4gIG5ldHdvcmtQcm9iZSgpIHtcbiAgICB0aGlzLl9jb25uZWN0aW9uLnByb2JlKCk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgZm9yIGxpdmUgY29ubmVjdGlvbiB0byBzZXJ2ZXIuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEByZXR1cm5zIHtib29sZWFufSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0aGVyZSBpcyBhIGxpdmUgY29ubmVjdGlvbiwgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIGlzQ29ubmVjdGVkKCkge1xuICAgIHJldHVybiB0aGlzLl9jb25uZWN0aW9uLmlzQ29ubmVjdGVkKCk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgY29ubmVjdGlvbiBpcyBhdXRoZW50aWNhdGVkIChsYXN0IGxvZ2luIHdhcyBzdWNjZXNzZnVsKS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIGF1dGhlbnRpY2F0ZWQsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBpc0F1dGhlbnRpY2F0ZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2F1dGhlbnRpY2F0ZWQ7XG4gIH1cblxuICAvKipcbiAgICogQWRkIEFQSSBrZXkgYW5kIGF1dGggdG9rZW4gdG8gdGhlIHJlbGF0aXZlIFVSTCBtYWtpbmcgaXQgdXNhYmxlIGZvciBnZXR0aW5nIGRhdGFcbiAgICogZnJvbSB0aGUgc2VydmVyIGluIGEgc2ltcGxlIDxjb2RlPkhUVFAgR0VUPC9jb2RlPiByZXF1ZXN0LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gVVJMIC0gVVJMIHRvIHdyYXAuXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IFVSTCB3aXRoIGFwcGVuZGVkIEFQSSBrZXkgYW5kIHRva2VuLCBpZiB2YWxpZCB0b2tlbiBpcyBwcmVzZW50LlxuICAgKi9cbiAgYXV0aG9yaXplVVJMKHVybCkge1xuICAgIGlmICh0eXBlb2YgdXJsICE9ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gdXJsO1xuICAgIH1cblxuICAgIGlmIChUaW5vZGUuaXNSZWxhdGl2ZVVSTCh1cmwpKSB7XG4gICAgICAvLyBGYWtlIGJhc2UgdG8gbWFrZSB0aGUgcmVsYXRpdmUgVVJMIHBhcnNlYWJsZS5cbiAgICAgIGNvbnN0IGJhc2UgPSAnc2NoZW1lOi8vaG9zdC8nO1xuICAgICAgY29uc3QgcGFyc2VkID0gbmV3IFVSTCh1cmwsIGJhc2UpO1xuICAgICAgaWYgKHRoaXMuX2FwaUtleSkge1xuICAgICAgICBwYXJzZWQuc2VhcmNoUGFyYW1zLmFwcGVuZCgnYXBpa2V5JywgdGhpcy5fYXBpS2V5KTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLl9hdXRoVG9rZW4gJiYgdGhpcy5fYXV0aFRva2VuLnRva2VuKSB7XG4gICAgICAgIHBhcnNlZC5zZWFyY2hQYXJhbXMuYXBwZW5kKCdhdXRoJywgJ3Rva2VuJyk7XG4gICAgICAgIHBhcnNlZC5zZWFyY2hQYXJhbXMuYXBwZW5kKCdzZWNyZXQnLCB0aGlzLl9hdXRoVG9rZW4udG9rZW4pO1xuICAgICAgfVxuICAgICAgLy8gQ29udmVydCBiYWNrIHRvIHN0cmluZyBhbmQgc3RyaXAgZmFrZSBiYXNlIFVSTCBleGNlcHQgZm9yIHRoZSByb290IHNsYXNoLlxuICAgICAgdXJsID0gcGFyc2VkLnRvU3RyaW5nKCkuc3Vic3RyaW5nKGJhc2UubGVuZ3RoIC0gMSk7XG4gICAgfVxuICAgIHJldHVybiB1cmw7XG4gIH1cblxuICAvKipcbiAgICogQHR5cGVkZWYgQWNjb3VudFBhcmFtc1xuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBwcm9wZXJ0eSB7VGlub2RlLkRlZkFjcz19IGRlZmFjcyAtIERlZmF1bHQgYWNjZXNzIHBhcmFtZXRlcnMgZm9yIHVzZXIncyA8Y29kZT5tZTwvY29kZT4gdG9waWMuXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0PX0gcHVibGljIC0gUHVibGljIGFwcGxpY2F0aW9uLWRlZmluZWQgZGF0YSBleHBvc2VkIG9uIDxjb2RlPm1lPC9jb2RlPiB0b3BpYy5cbiAgICogQHByb3BlcnR5IHtPYmplY3Q9fSBwcml2YXRlIC0gUHJpdmF0ZSBhcHBsaWNhdGlvbi1kZWZpbmVkIGRhdGEgYWNjZXNzaWJsZSBvbiA8Y29kZT5tZTwvY29kZT4gdG9waWMuXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0PX0gdHJ1c3RlZCAtIFRydXN0ZWQgdXNlciBkYXRhIHdoaWNoIGNhbiBiZSBzZXQgYnkgYSByb290IHVzZXIgb25seS5cbiAgICogQHByb3BlcnR5IHtBcnJheS48c3RyaW5nPn0gdGFncyAtIGFycmF5IG9mIHN0cmluZyB0YWdzIGZvciB1c2VyIGRpc2NvdmVyeS5cbiAgICogQHByb3BlcnR5IHtzdHJpbmc9fSB0b2tlbiAtIGF1dGhlbnRpY2F0aW9uIHRva2VuIHRvIHVzZS5cbiAgICogQHByb3BlcnR5IHtBcnJheS48c3RyaW5nPj19IGF0dGFjaG1lbnRzIC0gQXJyYXkgb2YgcmVmZXJlbmNlcyB0byBvdXQgb2YgYmFuZCBhdHRhY2htZW50cyB1c2VkIGluIGFjY291bnQgZGVzY3JpcHRpb24uXG4gICAqL1xuICAvKipcbiAgICogQHR5cGVkZWYgRGVmQWNzXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHByb3BlcnR5IHtzdHJpbmc9fSBhdXRoIC0gQWNjZXNzIG1vZGUgZm9yIDxjb2RlPm1lPC9jb2RlPiBmb3IgYXV0aGVudGljYXRlZCB1c2Vycy5cbiAgICogQHByb3BlcnR5IHtzdHJpbmc9fSBhbm9uIC0gQWNjZXNzIG1vZGUgZm9yIDxjb2RlPm1lPC9jb2RlPiBmb3IgYW5vbnltb3VzIHVzZXJzLlxuICAgKi9cblxuICAvKipcbiAgICogQ3JlYXRlIG9yIHVwZGF0ZSBhbiBhY2NvdW50LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdWlkIC0gVXNlciBpZCB0byB1cGRhdGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNjaGVtZSAtIEF1dGhlbnRpY2F0aW9uIHNjaGVtZTsgPGNvZGU+XCJiYXNpY1wiPC9jb2RlPiBhbmQgPGNvZGU+XCJhbm9ueW1vdXNcIjwvY29kZT4gYXJlIHRoZSBjdXJyZW50bHkgc3VwcG9ydGVkIHNjaGVtZXMuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzZWNyZXQgLSBBdXRoZW50aWNhdGlvbiBzZWNyZXQsIGFzc3VtZWQgdG8gYmUgYWxyZWFkeSBiYXNlNjQgZW5jb2RlZC5cbiAgICogQHBhcmFtIHtib29sZWFuPX0gbG9naW4gLSBVc2UgbmV3IGFjY291bnQgdG8gYXV0aGVudGljYXRlIGN1cnJlbnQgc2Vzc2lvblxuICAgKiBAcGFyYW0ge1Rpbm9kZS5BY2NvdW50UGFyYW1zPX0gcGFyYW1zIC0gVXNlciBkYXRhIHRvIHBhc3MgdG8gdGhlIHNlcnZlci5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHNlcnZlciByZXBseSBpcyByZWNlaXZlZC5cbiAgICovXG4gIGFjY291bnQodWlkLCBzY2hlbWUsIHNlY3JldCwgbG9naW4sIHBhcmFtcykge1xuICAgIGNvbnN0IHBrdCA9IHRoaXMuI2luaXRQYWNrZXQoJ2FjYycpO1xuICAgIHBrdC5hY2MudXNlciA9IHVpZDtcbiAgICBwa3QuYWNjLnNjaGVtZSA9IHNjaGVtZTtcbiAgICBwa3QuYWNjLnNlY3JldCA9IHNlY3JldDtcbiAgICAvLyBMb2cgaW4gdG8gdGhlIG5ldyBhY2NvdW50IHVzaW5nIHNlbGVjdGVkIHNjaGVtZVxuICAgIHBrdC5hY2MubG9naW4gPSBsb2dpbjtcblxuICAgIGlmIChwYXJhbXMpIHtcbiAgICAgIHBrdC5hY2MuZGVzYy5kZWZhY3MgPSBwYXJhbXMuZGVmYWNzO1xuICAgICAgcGt0LmFjYy5kZXNjLnB1YmxpYyA9IHBhcmFtcy5wdWJsaWM7XG4gICAgICBwa3QuYWNjLmRlc2MucHJpdmF0ZSA9IHBhcmFtcy5wcml2YXRlO1xuICAgICAgcGt0LmFjYy5kZXNjLnRydXN0ZWQgPSBwYXJhbXMudHJ1c3RlZDtcblxuICAgICAgcGt0LmFjYy50YWdzID0gcGFyYW1zLnRhZ3M7XG4gICAgICBwa3QuYWNjLmNyZWQgPSBwYXJhbXMuY3JlZDtcblxuICAgICAgcGt0LmFjYy50b2tlbiA9IHBhcmFtcy50b2tlbjtcblxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkocGFyYW1zLmF0dGFjaG1lbnRzKSAmJiBwYXJhbXMuYXR0YWNobWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgICBwa3QuZXh0cmEgPSB7XG4gICAgICAgICAgYXR0YWNobWVudHM6IHBhcmFtcy5hdHRhY2htZW50cy5maWx0ZXIocmVmID0+IFRpbm9kZS5pc1JlbGF0aXZlVVJMKHJlZikpXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuI3NlbmQocGt0LCBwa3QuYWNjLmlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBuZXcgdXNlci4gV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNhY2NvdW50fS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNjaGVtZSAtIEF1dGhlbnRpY2F0aW9uIHNjaGVtZTsgPGNvZGU+XCJiYXNpY1wiPC9jb2RlPiBpcyB0aGUgb25seSBjdXJyZW50bHkgc3VwcG9ydGVkIHNjaGVtZS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHNlY3JldCAtIEF1dGhlbnRpY2F0aW9uLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBsb2dpbiAtIFVzZSBuZXcgYWNjb3VudCB0byBhdXRoZW50aWNhdGUgY3VycmVudCBzZXNzaW9uXG4gICAqIEBwYXJhbSB7VGlub2RlLkFjY291bnRQYXJhbXM9fSBwYXJhbXMgLSBVc2VyIGRhdGEgdG8gcGFzcyB0byB0aGUgc2VydmVyLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gc2VydmVyIHJlcGx5IGlzIHJlY2VpdmVkLlxuICAgKi9cbiAgY3JlYXRlQWNjb3VudChzY2hlbWUsIHNlY3JldCwgbG9naW4sIHBhcmFtcykge1xuICAgIGxldCBwcm9taXNlID0gdGhpcy5hY2NvdW50KFVTRVJfTkVXLCBzY2hlbWUsIHNlY3JldCwgbG9naW4sIHBhcmFtcyk7XG4gICAgaWYgKGxvZ2luKSB7XG4gICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKChjdHJsKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLiNsb2dpblN1Y2Nlc3NmdWwoY3RybCk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIHVzZXIgd2l0aCA8Y29kZT4nYmFzaWMnPC9jb2RlPiBhdXRoZW50aWNhdGlvbiBzY2hlbWUgYW5kIGltbWVkaWF0ZWx5XG4gICAqIHVzZSBpdCBmb3IgYXV0aGVudGljYXRpb24uIFdyYXBwZXIgZm9yIHtAbGluayBUaW5vZGUjYWNjb3VudH0uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1c2VybmFtZSAtIExvZ2luIHRvIHVzZSBmb3IgdGhlIG5ldyBhY2NvdW50LlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGFzc3dvcmQgLSBVc2VyJ3MgcGFzc3dvcmQuXG4gICAqIEBwYXJhbSB7VGlub2RlLkFjY291bnRQYXJhbXM9fSBwYXJhbXMgLSBVc2VyIGRhdGEgdG8gcGFzcyB0byB0aGUgc2VydmVyLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gc2VydmVyIHJlcGx5IGlzIHJlY2VpdmVkLlxuICAgKi9cbiAgY3JlYXRlQWNjb3VudEJhc2ljKHVzZXJuYW1lLCBwYXNzd29yZCwgcGFyYW1zKSB7XG4gICAgLy8gTWFrZSBzdXJlIHdlIGFyZSBub3QgdXNpbmcgJ251bGwnIG9yICd1bmRlZmluZWQnO1xuICAgIHVzZXJuYW1lID0gdXNlcm5hbWUgfHwgJyc7XG4gICAgcGFzc3dvcmQgPSBwYXNzd29yZCB8fCAnJztcbiAgICByZXR1cm4gdGhpcy5jcmVhdGVBY2NvdW50KCdiYXNpYycsXG4gICAgICBiNjRFbmNvZGVVbmljb2RlKHVzZXJuYW1lICsgJzonICsgcGFzc3dvcmQpLCB0cnVlLCBwYXJhbXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSB1c2VyJ3MgY3JlZGVudGlhbHMgZm9yIDxjb2RlPidiYXNpYyc8L2NvZGU+IGF1dGhlbnRpY2F0aW9uIHNjaGVtZS4gV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNhY2NvdW50fS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVpZCAtIFVzZXIgSUQgdG8gdXBkYXRlLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdXNlcm5hbWUgLSBMb2dpbiB0byB1c2UgZm9yIHRoZSBuZXcgYWNjb3VudC5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhc3N3b3JkIC0gVXNlcidzIHBhc3N3b3JkLlxuICAgKiBAcGFyYW0ge1Rpbm9kZS5BY2NvdW50UGFyYW1zPX0gcGFyYW1zIC0gZGF0YSB0byBwYXNzIHRvIHRoZSBzZXJ2ZXIuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiBzZXJ2ZXIgcmVwbHkgaXMgcmVjZWl2ZWQuXG4gICAqL1xuICB1cGRhdGVBY2NvdW50QmFzaWModWlkLCB1c2VybmFtZSwgcGFzc3dvcmQsIHBhcmFtcykge1xuICAgIC8vIE1ha2Ugc3VyZSB3ZSBhcmUgbm90IHVzaW5nICdudWxsJyBvciAndW5kZWZpbmVkJztcbiAgICB1c2VybmFtZSA9IHVzZXJuYW1lIHx8ICcnO1xuICAgIHBhc3N3b3JkID0gcGFzc3dvcmQgfHwgJyc7XG4gICAgcmV0dXJuIHRoaXMuYWNjb3VudCh1aWQsICdiYXNpYycsXG4gICAgICBiNjRFbmNvZGVVbmljb2RlKHVzZXJuYW1lICsgJzonICsgcGFzc3dvcmQpLCBmYWxzZSwgcGFyYW1zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kIGhhbmRzaGFrZSB0byB0aGUgc2VydmVyLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gc2VydmVyIHJlcGx5IGlzIHJlY2VpdmVkLlxuICAgKi9cbiAgaGVsbG8oKSB7XG4gICAgY29uc3QgcGt0ID0gdGhpcy4jaW5pdFBhY2tldCgnaGknKTtcblxuICAgIHJldHVybiB0aGlzLiNzZW5kKHBrdCwgcGt0LmhpLmlkKVxuICAgICAgLnRoZW4oKGN0cmwpID0+IHtcbiAgICAgICAgLy8gUmVzZXQgYmFja29mZiBjb3VudGVyIG9uIHN1Y2Nlc3NmdWwgY29ubmVjdGlvbi5cbiAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5iYWNrb2ZmUmVzZXQoKTtcblxuICAgICAgICAvLyBTZXJ2ZXIgcmVzcG9uc2UgY29udGFpbnMgc2VydmVyIHByb3RvY29sIHZlcnNpb24sIGJ1aWxkLCBjb25zdHJhaW50cyxcbiAgICAgICAgLy8gc2Vzc2lvbiBJRCBmb3IgbG9uZyBwb2xsaW5nLiBTYXZlIHRoZW0uXG4gICAgICAgIGlmIChjdHJsLnBhcmFtcykge1xuICAgICAgICAgIHRoaXMuX3NlcnZlckluZm8gPSBjdHJsLnBhcmFtcztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm9uQ29ubmVjdCkge1xuICAgICAgICAgIHRoaXMub25Db25uZWN0KCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY3RybDtcbiAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5yZWNvbm5lY3QodHJ1ZSk7XG5cbiAgICAgICAgaWYgKHRoaXMub25EaXNjb25uZWN0KSB7XG4gICAgICAgICAgdGhpcy5vbkRpc2Nvbm5lY3QoZXJyKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogU2V0IG9yIHJlZnJlc2ggdGhlIHB1c2ggbm90aWZpY2F0aW9ucy9kZXZpY2UgdG9rZW4uIElmIHRoZSBjbGllbnQgaXMgY29ubmVjdGVkLFxuICAgKiB0aGUgZGV2aWNlVG9rZW4gY2FuIGJlIHNlbnQgdG8gdGhlIHNlcnZlci5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICogQHBhcmFtIHtzdHJpbmd9IGR0IC0gdG9rZW4gb2J0YWluZWQgZnJvbSB0aGUgcHJvdmlkZXIgb3IgPGNvZGU+ZmFsc2U8L2NvZGU+LFxuICAgKiAgICA8Y29kZT5udWxsPC9jb2RlPiBvciA8Y29kZT51bmRlZmluZWQ8L2NvZGU+IHRvIGNsZWFyIHRoZSB0b2tlbi5cbiAgICpcbiAgICogQHJldHVybnMgPGNvZGU+dHJ1ZTwvY29kZT4gaWYgYXR0ZW1wdCB3YXMgbWFkZSB0byBzZW5kIHRoZSB1cGRhdGUgdG8gdGhlIHNlcnZlci5cbiAgICovXG4gIHNldERldmljZVRva2VuKGR0KSB7XG4gICAgbGV0IHNlbnQgPSBmYWxzZTtcbiAgICAvLyBDb252ZXJ0IGFueSBmYWxzaXNoIHZhbHVlIHRvIG51bGwuXG4gICAgZHQgPSBkdCB8fCBudWxsO1xuICAgIGlmIChkdCAhPSB0aGlzLl9kZXZpY2VUb2tlbikge1xuICAgICAgdGhpcy5fZGV2aWNlVG9rZW4gPSBkdDtcbiAgICAgIGlmICh0aGlzLmlzQ29ubmVjdGVkKCkgJiYgdGhpcy5pc0F1dGhlbnRpY2F0ZWQoKSkge1xuICAgICAgICB0aGlzLiNzZW5kKHtcbiAgICAgICAgICAnaGknOiB7XG4gICAgICAgICAgICAnZGV2JzogZHQgfHwgVGlub2RlLkRFTF9DSEFSXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgc2VudCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzZW50O1xuICB9XG5cbiAgLyoqXG4gICAqIEB0eXBlZGVmIENyZWRlbnRpYWxcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHByb3BlcnR5IHtzdHJpbmd9IG1ldGggLSB2YWxpZGF0aW9uIG1ldGhvZC5cbiAgICogQHByb3BlcnR5IHtzdHJpbmd9IHZhbCAtIHZhbHVlIHRvIHZhbGlkYXRlIChlLmcuIGVtYWlsIG9yIHBob25lIG51bWJlcikuXG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSByZXNwIC0gdmFsaWRhdGlvbiByZXNwb25zZS5cbiAgICogQHByb3BlcnR5IHtPYmplY3R9IHBhcmFtcyAtIHZhbGlkYXRpb24gcGFyYW1ldGVycy5cbiAgICovXG4gIC8qKlxuICAgKiBBdXRoZW50aWNhdGUgY3VycmVudCBzZXNzaW9uLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2NoZW1lIC0gQXV0aGVudGljYXRpb24gc2NoZW1lOyA8Y29kZT5cImJhc2ljXCI8L2NvZGU+IGlzIHRoZSBvbmx5IGN1cnJlbnRseSBzdXBwb3J0ZWQgc2NoZW1lLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2VjcmV0IC0gQXV0aGVudGljYXRpb24gc2VjcmV0LCBhc3N1bWVkIHRvIGJlIGFscmVhZHkgYmFzZTY0IGVuY29kZWQuXG4gICAqIEBwYXJhbSB7Q3JlZGVudGlhbD19IGNyZWQgLSBjcmVkZW50aWFsIGNvbmZpcm1hdGlvbiwgaWYgcmVxdWlyZWQuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiBzZXJ2ZXIgcmVwbHkgaXMgcmVjZWl2ZWQuXG4gICAqL1xuICBsb2dpbihzY2hlbWUsIHNlY3JldCwgY3JlZCkge1xuICAgIGNvbnN0IHBrdCA9IHRoaXMuI2luaXRQYWNrZXQoJ2xvZ2luJyk7XG4gICAgcGt0LmxvZ2luLnNjaGVtZSA9IHNjaGVtZTtcbiAgICBwa3QubG9naW4uc2VjcmV0ID0gc2VjcmV0O1xuICAgIHBrdC5sb2dpbi5jcmVkID0gY3JlZDtcblxuICAgIHJldHVybiB0aGlzLiNzZW5kKHBrdCwgcGt0LmxvZ2luLmlkKVxuICAgICAgLnRoZW4oKGN0cmwpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI2xvZ2luU3VjY2Vzc2Z1bChjdHJsKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFdyYXBwZXIgZm9yIHtAbGluayBUaW5vZGUjbG9naW59IHdpdGggYmFzaWMgYXV0aGVudGljYXRpb25cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVuYW1lIC0gVXNlciBuYW1lLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGFzc3dvcmQgIC0gUGFzc3dvcmQuXG4gICAqIEBwYXJhbSB7Q3JlZGVudGlhbD19IGNyZWQgLSBjcmVkZW50aWFsIGNvbmZpcm1hdGlvbiwgaWYgcmVxdWlyZWQuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gcmVjZWl2aW5nIHNlcnZlciByZXBseS5cbiAgICovXG4gIGxvZ2luQmFzaWModW5hbWUsIHBhc3N3b3JkLCBjcmVkKSB7XG4gICAgcmV0dXJuIHRoaXMubG9naW4oJ2Jhc2ljJywgYjY0RW5jb2RlVW5pY29kZSh1bmFtZSArICc6JyArIHBhc3N3b3JkKSwgY3JlZClcbiAgICAgIC50aGVuKChjdHJsKSA9PiB7XG4gICAgICAgIHRoaXMuX2xvZ2luID0gdW5hbWU7XG4gICAgICAgIHJldHVybiBjdHJsO1xuICAgICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNsb2dpbn0gd2l0aCB0b2tlbiBhdXRoZW50aWNhdGlvblxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9rZW4gLSBUb2tlbiByZWNlaXZlZCBpbiByZXNwb25zZSB0byBlYXJsaWVyIGxvZ2luLlxuICAgKiBAcGFyYW0ge0NyZWRlbnRpYWw9fSBjcmVkIC0gY3JlZGVudGlhbCBjb25maXJtYXRpb24sIGlmIHJlcXVpcmVkLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIG9uIHJlY2VpdmluZyBzZXJ2ZXIgcmVwbHkuXG4gICAqL1xuICBsb2dpblRva2VuKHRva2VuLCBjcmVkKSB7XG4gICAgcmV0dXJuIHRoaXMubG9naW4oJ3Rva2VuJywgdG9rZW4sIGNyZWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgYSByZXF1ZXN0IGZvciByZXNldHRpbmcgYW4gYXV0aGVudGljYXRpb24gc2VjcmV0LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2NoZW1lIC0gYXV0aGVudGljYXRpb24gc2NoZW1lIHRvIHJlc2V0LlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWV0aG9kIC0gbWV0aG9kIHRvIHVzZSBmb3IgcmVzZXR0aW5nIHRoZSBzZWNyZXQsIHN1Y2ggYXMgXCJlbWFpbFwiIG9yIFwidGVsXCIuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSAtIHZhbHVlIG9mIHRoZSBjcmVkZW50aWFsIHRvIHVzZSwgYSBzcGVjaWZpYyBlbWFpbCBhZGRyZXNzIG9yIGEgcGhvbmUgbnVtYmVyLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIG9uIHJlY2VpdmluZyB0aGUgc2VydmVyIHJlcGx5LlxuICAgKi9cbiAgcmVxdWVzdFJlc2V0QXV0aFNlY3JldChzY2hlbWUsIG1ldGhvZCwgdmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5sb2dpbigncmVzZXQnLCBiNjRFbmNvZGVVbmljb2RlKHNjaGVtZSArICc6JyArIG1ldGhvZCArICc6JyArIHZhbHVlKSk7XG4gIH1cblxuICAvKipcbiAgICogQHR5cGVkZWYgQXV0aFRva2VuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHByb3BlcnR5IHtzdHJpbmd9IHRva2VuIC0gVG9rZW4gdmFsdWUuXG4gICAqIEBwcm9wZXJ0eSB7RGF0ZX0gZXhwaXJlcyAtIFRva2VuIGV4cGlyYXRpb24gdGltZS5cbiAgICovXG4gIC8qKlxuICAgKiBHZXQgc3RvcmVkIGF1dGhlbnRpY2F0aW9uIHRva2VuLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLkF1dGhUb2tlbn0gYXV0aGVudGljYXRpb24gdG9rZW4uXG4gICAqL1xuICBnZXRBdXRoVG9rZW4oKSB7XG4gICAgaWYgKHRoaXMuX2F1dGhUb2tlbiAmJiAodGhpcy5fYXV0aFRva2VuLmV4cGlyZXMuZ2V0VGltZSgpID4gRGF0ZS5ub3coKSkpIHtcbiAgICAgIHJldHVybiB0aGlzLl9hdXRoVG9rZW47XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2F1dGhUb2tlbiA9IG51bGw7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGxpY2F0aW9uIG1heSBwcm92aWRlIGEgc2F2ZWQgYXV0aGVudGljYXRpb24gdG9rZW4uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7VGlub2RlLkF1dGhUb2tlbn0gdG9rZW4gLSBhdXRoZW50aWNhdGlvbiB0b2tlbi5cbiAgICovXG4gIHNldEF1dGhUb2tlbih0b2tlbikge1xuICAgIHRoaXMuX2F1dGhUb2tlbiA9IHRva2VuO1xuICB9XG5cbiAgLyoqXG4gICAqIEB0eXBlZGVmIFNldFBhcmFtc1xuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBwcm9wZXJ0eSB7VGlub2RlLlNldERlc2M9fSBkZXNjIC0gVG9waWMgaW5pdGlhbGl6YXRpb24gcGFyYW1ldGVycyB3aGVuIGNyZWF0aW5nIGEgbmV3IHRvcGljIG9yIGEgbmV3IHN1YnNjcmlwdGlvbi5cbiAgICogQHByb3BlcnR5IHtUaW5vZGUuU2V0U3ViPX0gc3ViIC0gU3Vic2NyaXB0aW9uIGluaXRpYWxpemF0aW9uIHBhcmFtZXRlcnMuXG4gICAqIEBwcm9wZXJ0eSB7QXJyYXkuPHN0cmluZz49fSBhdHRhY2htZW50cyAtIFVSTHMgb2Ygb3V0IG9mIGJhbmQgYXR0YWNobWVudHMgdXNlZCBpbiBwYXJhbWV0ZXJzLlxuICAgKi9cbiAgLyoqXG4gICAqIEB0eXBlZGVmIFNldERlc2NcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAcHJvcGVydHkge1Rpbm9kZS5EZWZBY3M9fSBkZWZhY3MgLSBEZWZhdWx0IGFjY2VzcyBtb2RlLlxuICAgKiBAcHJvcGVydHkge09iamVjdD19IHB1YmxpYyAtIEZyZWUtZm9ybSB0b3BpYyBkZXNjcmlwdGlvbiwgcHVibGljYWxseSBhY2Nlc3NpYmxlLlxuICAgKiBAcHJvcGVydHkge09iamVjdD19IHByaXZhdGUgLSBGcmVlLWZvcm0gdG9waWMgZGVzY3JpcHRpb24gYWNjZXNzaWJsZSBvbmx5IHRvIHRoZSBvd25lci5cbiAgICogQHByb3BlcnR5IHtPYmplY3Q9fSB0cnVzdGVkIC0gVHJ1c3RlZCB1c2VyIGRhdGEgd2hpY2ggY2FuIGJlIHNldCBieSBhIHJvb3QgdXNlciBvbmx5LlxuICAgKi9cbiAgLyoqXG4gICAqIEB0eXBlZGVmIFNldFN1YlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nPX0gdXNlciAtIFVJRCBvZiB0aGUgdXNlciBhZmZlY3RlZCBieSB0aGUgcmVxdWVzdC4gRGVmYXVsdCAoZW1wdHkpIC0gY3VycmVudCB1c2VyLlxuICAgKiBAcHJvcGVydHkge3N0cmluZz19IG1vZGUgLSBVc2VyIGFjY2VzcyBtb2RlLCBlaXRoZXIgcmVxdWVzdGVkIG9yIGFzc2lnbmVkIGRlcGVuZGVudCBvbiBjb250ZXh0LlxuICAgKi9cbiAgLyoqXG4gICAqIFBhcmFtZXRlcnMgcGFzc2VkIHRvIHtAbGluayBUaW5vZGUjc3Vic2NyaWJlfS5cbiAgICpcbiAgICogQHR5cGVkZWYgU3Vic2NyaXB0aW9uUGFyYW1zXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQHByb3BlcnR5IHtUaW5vZGUuU2V0UGFyYW1zPX0gc2V0IC0gUGFyYW1ldGVycyB1c2VkIHRvIGluaXRpYWxpemUgdG9waWNcbiAgICogQHByb3BlcnR5IHtUaW5vZGUuR2V0UXVlcnk9fSBnZXQgLSBRdWVyeSBmb3IgZmV0Y2hpbmcgZGF0YSBmcm9tIHRvcGljLlxuICAgKi9cblxuICAvKipcbiAgICogU2VuZCBhIHRvcGljIHN1YnNjcmlwdGlvbiByZXF1ZXN0LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWMgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byBzdWJzY3JpYmUgdG8uXG4gICAqIEBwYXJhbSB7VGlub2RlLkdldFF1ZXJ5PX0gZ2V0UGFyYW1zIC0gT3B0aW9uYWwgc3Vic2NyaXB0aW9uIG1ldGFkYXRhIHF1ZXJ5XG4gICAqIEBwYXJhbSB7VGlub2RlLlNldFBhcmFtcz19IHNldFBhcmFtcyAtIE9wdGlvbmFsIGluaXRpYWxpemF0aW9uIHBhcmFtZXRlcnNcbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCBvbiByZWNlaXZpbmcgc2VydmVyIHJlcGx5LlxuICAgKi9cbiAgc3Vic2NyaWJlKHRvcGljTmFtZSwgZ2V0UGFyYW1zLCBzZXRQYXJhbXMpIHtcbiAgICBjb25zdCBwa3QgPSB0aGlzLiNpbml0UGFja2V0KCdzdWInLCB0b3BpY05hbWUpXG4gICAgaWYgKCF0b3BpY05hbWUpIHtcbiAgICAgIHRvcGljTmFtZSA9IENvbnN0LlRPUElDX05FVztcbiAgICB9XG5cbiAgICBwa3Quc3ViLmdldCA9IGdldFBhcmFtcztcblxuICAgIGlmIChzZXRQYXJhbXMpIHtcbiAgICAgIGlmIChzZXRQYXJhbXMuc3ViKSB7XG4gICAgICAgIHBrdC5zdWIuc2V0LnN1YiA9IHNldFBhcmFtcy5zdWI7XG4gICAgICB9XG5cbiAgICAgIGlmIChzZXRQYXJhbXMuZGVzYykge1xuICAgICAgICBjb25zdCBkZXNjID0gc2V0UGFyYW1zLmRlc2M7XG4gICAgICAgIGlmIChUaW5vZGUuaXNOZXdHcm91cFRvcGljTmFtZSh0b3BpY05hbWUpKSB7XG4gICAgICAgICAgLy8gRnVsbCBzZXQuZGVzYyBwYXJhbXMgYXJlIHVzZWQgZm9yIG5ldyB0b3BpY3Mgb25seVxuICAgICAgICAgIHBrdC5zdWIuc2V0LmRlc2MgPSBkZXNjO1xuICAgICAgICB9IGVsc2UgaWYgKFRpbm9kZS5pc1AyUFRvcGljTmFtZSh0b3BpY05hbWUpICYmIGRlc2MuZGVmYWNzKSB7XG4gICAgICAgICAgLy8gVXNlIG9wdGlvbmFsIGRlZmF1bHQgcGVybWlzc2lvbnMgb25seS5cbiAgICAgICAgICBwa3Quc3ViLnNldC5kZXNjID0ge1xuICAgICAgICAgICAgZGVmYWNzOiBkZXNjLmRlZmFjc1xuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gU2VlIGlmIGV4dGVybmFsIG9iamVjdHMgd2VyZSB1c2VkIGluIHRvcGljIGRlc2NyaXB0aW9uLlxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkoc2V0UGFyYW1zLmF0dGFjaG1lbnRzKSAmJiBzZXRQYXJhbXMuYXR0YWNobWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgICBwa3QuZXh0cmEgPSB7XG4gICAgICAgICAgYXR0YWNobWVudHM6IHNldFBhcmFtcy5hdHRhY2htZW50cy5maWx0ZXIocmVmID0+IFRpbm9kZS5pc1JlbGF0aXZlVVJMKHJlZikpXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIGlmIChzZXRQYXJhbXMudGFncykge1xuICAgICAgICBwa3Quc3ViLnNldC50YWdzID0gc2V0UGFyYW1zLnRhZ3M7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzLiNzZW5kKHBrdCwgcGt0LnN1Yi5pZCk7XG4gIH1cblxuICAvKipcbiAgICogRGV0YWNoIGFuZCBvcHRpb25hbGx5IHVuc3Vic2NyaWJlIGZyb20gdGhlIHRvcGljXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpYyAtIFRvcGljIHRvIGRldGFjaCBmcm9tLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHVuc3ViIC0gSWYgPGNvZGU+dHJ1ZTwvY29kZT4sIGRldGFjaCBhbmQgdW5zdWJzY3JpYmUsIG90aGVyd2lzZSBqdXN0IGRldGFjaC5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCBvbiByZWNlaXZpbmcgc2VydmVyIHJlcGx5LlxuICAgKi9cbiAgbGVhdmUodG9waWMsIHVuc3ViKSB7XG4gICAgY29uc3QgcGt0ID0gdGhpcy4jaW5pdFBhY2tldCgnbGVhdmUnLCB0b3BpYyk7XG4gICAgcGt0LmxlYXZlLnVuc3ViID0gdW5zdWI7XG5cbiAgICByZXR1cm4gdGhpcy4jc2VuZChwa3QsIHBrdC5sZWF2ZS5pZCk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIG1lc3NhZ2UgZHJhZnQgd2l0aG91dCBzZW5kaW5nIGl0IHRvIHRoZSBzZXJ2ZXIuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpYyAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIHB1Ymxpc2ggdG8uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZW50IC0gUGF5bG9hZCB0byBwdWJsaXNoLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBub0VjaG8gLSBJZiA8Y29kZT50cnVlPC9jb2RlPiwgdGVsbCB0aGUgc2VydmVyIG5vdCB0byBlY2hvIHRoZSBtZXNzYWdlIHRvIHRoZSBvcmlnaW5hbCBzZXNzaW9uLlxuICAgKlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSBuZXcgbWVzc2FnZSB3aGljaCBjYW4gYmUgc2VudCB0byB0aGUgc2VydmVyIG9yIG90aGVyd2lzZSB1c2VkLlxuICAgKi9cbiAgY3JlYXRlTWVzc2FnZSh0b3BpYywgY29udGVudCwgbm9FY2hvKSB7XG4gICAgY29uc3QgcGt0ID0gdGhpcy4jaW5pdFBhY2tldCgncHViJywgdG9waWMpO1xuXG4gICAgbGV0IGRmdCA9IHR5cGVvZiBjb250ZW50ID09ICdzdHJpbmcnID8gRHJhZnR5LnBhcnNlKGNvbnRlbnQpIDogY29udGVudDtcbiAgICBpZiAoZGZ0ICYmICFEcmFmdHkuaXNQbGFpblRleHQoZGZ0KSkge1xuICAgICAgcGt0LnB1Yi5oZWFkID0ge1xuICAgICAgICBtaW1lOiBEcmFmdHkuZ2V0Q29udGVudFR5cGUoKVxuICAgICAgfTtcbiAgICAgIGNvbnRlbnQgPSBkZnQ7XG4gICAgfVxuICAgIHBrdC5wdWIubm9lY2hvID0gbm9FY2hvO1xuICAgIHBrdC5wdWIuY29udGVudCA9IGNvbnRlbnQ7XG5cbiAgICByZXR1cm4gcGt0LnB1YjtcbiAgfVxuXG4gIC8qKlxuICAgKiBQdWJsaXNoIHtkYXRhfSBtZXNzYWdlIHRvIHRvcGljLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWNOYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gcHVibGlzaCB0by5cbiAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRlbnQgLSBQYXlsb2FkIHRvIHB1Ymxpc2guXG4gICAqIEBwYXJhbSB7Ym9vbGVhbj19IG5vRWNobyAtIElmIDxjb2RlPnRydWU8L2NvZGU+LCB0ZWxsIHRoZSBzZXJ2ZXIgbm90IHRvIGVjaG8gdGhlIG1lc3NhZ2UgdG8gdGhlIG9yaWdpbmFsIHNlc3Npb24uXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gcmVjZWl2aW5nIHNlcnZlciByZXBseS5cbiAgICovXG4gIHB1Ymxpc2godG9waWNOYW1lLCBjb250ZW50LCBub0VjaG8pIHtcbiAgICByZXR1cm4gdGhpcy5wdWJsaXNoTWVzc2FnZShcbiAgICAgIHRoaXMuY3JlYXRlTWVzc2FnZSh0b3BpY05hbWUsIGNvbnRlbnQsIG5vRWNobylcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIFB1Ymxpc2ggbWVzc2FnZSB0byB0b3BpYy4gVGhlIG1lc3NhZ2Ugc2hvdWxkIGJlIGNyZWF0ZWQgYnkge0BsaW5rIFRpbm9kZSNjcmVhdGVNZXNzYWdlfS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHB1YiAtIE1lc3NhZ2UgdG8gcHVibGlzaC5cbiAgICogQHBhcmFtIHtBcnJheS48c3RyaW5nPj19IGF0dGFjaG1lbnRzIC0gYXJyYXkgb2YgVVJMcyB3aXRoIGF0dGFjaG1lbnRzLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIG9uIHJlY2VpdmluZyBzZXJ2ZXIgcmVwbHkuXG4gICAqL1xuICBwdWJsaXNoTWVzc2FnZShwdWIsIGF0dGFjaG1lbnRzKSB7XG4gICAgLy8gTWFrZSBhIHNoYWxsb3cgY29weS4gTmVlZGVkIGluIG9yZGVyIHRvIGNsZWFyIGxvY2FsbHktYXNzaWduZWQgdGVtcCB2YWx1ZXM7XG4gICAgcHViID0gT2JqZWN0LmFzc2lnbih7fSwgcHViKTtcbiAgICBwdWIuc2VxID0gdW5kZWZpbmVkO1xuICAgIHB1Yi5mcm9tID0gdW5kZWZpbmVkO1xuICAgIHB1Yi50cyA9IHVuZGVmaW5lZDtcbiAgICBjb25zdCBtc2cgPSB7XG4gICAgICBwdWI6IHB1YixcbiAgICB9O1xuICAgIGlmIChhdHRhY2htZW50cykge1xuICAgICAgbXNnLmV4dHJhID0ge1xuICAgICAgICBhdHRhY2htZW50czogYXR0YWNobWVudHMuZmlsdGVyKHJlZiA9PiBUaW5vZGUuaXNSZWxhdGl2ZVVSTChyZWYpKVxuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuI3NlbmQobXNnLCBwdWIuaWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIE91dCBvZiBiYW5kIG5vdGlmaWNhdGlvbjogbm90aWZ5IHRvcGljIHRoYXQgYW4gZXh0ZXJuYWwgKHB1c2gpIG5vdGlmaWNhdGlvbiB3YXMgcmVjaXZlZCBieSB0aGUgY2xpZW50LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gZGF0YSAtIG5vdGlmaWNhdGlvbiBwYXlsb2FkLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZGF0YS53aGF0IC0gbm90aWZpY2F0aW9uIHR5cGUsICdtc2cnLCAncmVhZCcsICdzdWInLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZGF0YS50b3BpYyAtIG5hbWUgb2YgdGhlIHVwZGF0ZWQgdG9waWMuXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gZGF0YS5zZXEgLSBzZXEgSUQgb2YgdGhlIGFmZmVjdGVkIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gZGF0YS54ZnJvbSAtIFVJRCBvZiB0aGUgc2VuZGVyLlxuICAgKiBAcGFyYW0ge29iamVjdD19IGRhdGEuZ2l2ZW4gLSBuZXcgc3Vic2NyaXB0aW9uICdnaXZlbicsIGUuZy4gJ0FTV1AuLi4nLlxuICAgKiBAcGFyYW0ge29iamVjdD19IGRhdGEud2FudCAtIG5ldyBzdWJzY3JpcHRpb24gJ3dhbnQnLCBlLmcuICdSV0ouLi4nLlxuICAgKi9cbiAgb29iTm90aWZpY2F0aW9uKGRhdGEpIHtcbiAgICBzd2l0Y2ggKGRhdGEud2hhdCkge1xuICAgICAgY2FzZSAnbXNnJzpcbiAgICAgICAgY29uc3QgdG9waWMgPSB0aGlzLiNjYWNoZUdldCgndG9waWMnLCBkYXRhLnRvcGljKTtcbiAgICAgICAgaWYgKHRvcGljICYmIHRvcGljLmlzQ2hhbigpKSB7XG4gICAgICAgICAgdG9waWMuX3VwZGF0ZVJlY2VpdmVkKGRhdGEuc2VxLCAnZmFrZS11aWQnKTtcbiAgICAgICAgICB0aGlzLmdldE1lVG9waWMoKS5fcmVmcmVzaENvbnRhY3QoJ21zZycsIHRvcGljKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3JlYWQnOlxuICAgICAgICB0aGlzLmdldE1lVG9waWMoKS5fcm91dGVQcmVzKHtcbiAgICAgICAgICB3aGF0OiAncmVhZCcsXG4gICAgICAgICAgc2VxOiBkYXRhLnNlcVxuICAgICAgICB9KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdzdWInOlxuICAgICAgICBsZXQgbW9kZSA9IHtcbiAgICAgICAgICBnaXZlbjogZGF0YS5tb2RlR2l2ZW4sXG4gICAgICAgICAgd2FudDogZGF0YS5tb2RlV2FudFxuICAgICAgICB9O1xuICAgICAgICBsZXQgYWNzID0gbmV3IEFjY2Vzc01vZGUobW9kZSk7XG4gICAgICAgIGxldCBwcmVzID0gKCFhY3MubW9kZSB8fCBhY3MubW9kZSA9PSBBY2Nlc3NNb2RlLl9OT05FKSA/XG4gICAgICAgICAgLy8gU3Vic2NyaXB0aW9uIGRlbGV0ZWQuXG4gICAgICAgICAge1xuICAgICAgICAgICAgd2hhdDogJ2dvbmUnLFxuICAgICAgICAgICAgc3JjOiBkYXRhLnRvcGljXG4gICAgICAgICAgfSA6XG4gICAgICAgICAgLy8gTmV3IHN1YnNjcmlwdGlvbiBvciBzdWJzY3JpcHRpb24gdXBkYXRlZC5cbiAgICAgICAgICB7XG4gICAgICAgICAgICB3aGF0OiAnYWNzJyxcbiAgICAgICAgICAgIHNyYzogZGF0YS50b3BpYyxcbiAgICAgICAgICAgIGRhY3M6IG1vZGVcbiAgICAgICAgICB9O1xuICAgICAgICB0aGlzLmdldE1lVG9waWMoKS5fcm91dGVQcmVzKHByZXMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRoaXMubG9nZ2VyKFwiVW5rbm93biBwdXNoIHR5cGUgaWdub3JlZFwiLCBkYXRhLndoYXQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAdHlwZWRlZiBHZXRRdWVyeVxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBwcm9wZXJ0eSB7VGlub2RlLkdldE9wdHNUeXBlPX0gZGVzYyAtIElmIHByb3ZpZGVkIChldmVuIGlmIGVtcHR5KSwgZmV0Y2ggdG9waWMgZGVzY3JpcHRpb24uXG4gICAqIEBwcm9wZXJ0eSB7VGlub2RlLkdldE9wdHNUeXBlPX0gc3ViIC0gSWYgcHJvdmlkZWQgKGV2ZW4gaWYgZW1wdHkpLCBmZXRjaCB0b3BpYyBzdWJzY3JpcHRpb25zLlxuICAgKiBAcHJvcGVydHkge1Rpbm9kZS5HZXREYXRhVHlwZT19IGRhdGEgLSBJZiBwcm92aWRlZCAoZXZlbiBpZiBlbXB0eSksIGdldCBtZXNzYWdlcy5cbiAgICovXG5cbiAgLyoqXG4gICAqIEB0eXBlZGVmIEdldE9wdHNUeXBlXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQHByb3BlcnR5IHtEYXRlPX0gaW1zIC0gXCJJZiBtb2RpZmllZCBzaW5jZVwiLCBmZXRjaCBkYXRhIG9ubHkgaXQgd2FzIHdhcyBtb2RpZmllZCBzaW5jZSBzdGF0ZWQgZGF0ZS5cbiAgICogQHByb3BlcnR5IHtudW1iZXI9fSBsaW1pdCAtIE1heGltdW0gbnVtYmVyIG9mIHJlc3VsdHMgdG8gcmV0dXJuLiBJZ25vcmVkIHdoZW4gcXVlcnlpbmcgdG9waWMgZGVzY3JpcHRpb24uXG4gICAqL1xuXG4gIC8qKlxuICAgKiBAdHlwZWRlZiBHZXREYXRhVHlwZVxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBwcm9wZXJ0eSB7bnVtYmVyPX0gc2luY2UgLSBMb2FkIG1lc3NhZ2VzIHdpdGggc2VxIGlkIGVxdWFsIG9yIGdyZWF0ZXIgdGhhbiB0aGlzIHZhbHVlLlxuICAgKiBAcHJvcGVydHkge251bWJlcj19IGJlZm9yZSAtIExvYWQgbWVzc2FnZXMgd2l0aCBzZXEgaWQgbG93ZXIgdGhhbiB0aGlzIG51bWJlci5cbiAgICogQHByb3BlcnR5IHtudW1iZXI9fSBsaW1pdCAtIE1heGltdW0gbnVtYmVyIG9mIHJlc3VsdHMgdG8gcmV0dXJuLlxuICAgKi9cblxuICAvKipcbiAgICogUmVxdWVzdCB0b3BpYyBtZXRhZGF0YVxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWMgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byBxdWVyeS5cbiAgICogQHBhcmFtIHtUaW5vZGUuR2V0UXVlcnl9IHBhcmFtcyAtIFBhcmFtZXRlcnMgb2YgdGhlIHF1ZXJ5LiBVc2Uge0BsaW5rIFRpbm9kZS5NZXRhR2V0QnVpbGRlcn0gdG8gZ2VuZXJhdGUuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gcmVjZWl2aW5nIHNlcnZlciByZXBseS5cbiAgICovXG4gIGdldE1ldGEodG9waWMsIHBhcmFtcykge1xuICAgIGNvbnN0IHBrdCA9IHRoaXMuI2luaXRQYWNrZXQoJ2dldCcsIHRvcGljKTtcblxuICAgIHBrdC5nZXQgPSBtZXJnZU9iaihwa3QuZ2V0LCBwYXJhbXMpO1xuXG4gICAgcmV0dXJuIHRoaXMuI3NlbmQocGt0LCBwa3QuZ2V0LmlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgdG9waWMncyBtZXRhZGF0YTogZGVzY3JpcHRpb24sIHN1YnNjcmlidGlvbnMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpYyAtIFRvcGljIHRvIHVwZGF0ZS5cbiAgICogQHBhcmFtIHtUaW5vZGUuU2V0UGFyYW1zfSBwYXJhbXMgLSB0b3BpYyBtZXRhZGF0YSB0byB1cGRhdGUuXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gcmVjZWl2aW5nIHNlcnZlciByZXBseS5cbiAgICovXG4gIHNldE1ldGEodG9waWMsIHBhcmFtcykge1xuICAgIGNvbnN0IHBrdCA9IHRoaXMuI2luaXRQYWNrZXQoJ3NldCcsIHRvcGljKTtcbiAgICBjb25zdCB3aGF0ID0gW107XG5cbiAgICBpZiAocGFyYW1zKSB7XG4gICAgICBbJ2Rlc2MnLCAnc3ViJywgJ3RhZ3MnLCAnY3JlZCcsICdlcGhlbWVyYWwnXS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgICBpZiAocGFyYW1zLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICB3aGF0LnB1c2goa2V5KTtcbiAgICAgICAgICBwa3Quc2V0W2tleV0gPSBwYXJhbXNba2V5XTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHBhcmFtcy5hdHRhY2htZW50cykgJiYgcGFyYW1zLmF0dGFjaG1lbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcGt0LmV4dHJhID0ge1xuICAgICAgICAgIGF0dGFjaG1lbnRzOiBwYXJhbXMuYXR0YWNobWVudHMuZmlsdGVyKHJlZiA9PiBUaW5vZGUuaXNSZWxhdGl2ZVVSTChyZWYpKVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh3aGF0Lmxlbmd0aCA9PSAwKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiSW52YWxpZCB7c2V0fSBwYXJhbWV0ZXJzXCIpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy4jc2VuZChwa3QsIHBrdC5zZXQuaWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJhbmdlIG9mIG1lc3NhZ2UgSURzIHRvIGRlbGV0ZS5cbiAgICpcbiAgICogQHR5cGVkZWYgRGVsUmFuZ2VcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAcHJvcGVydHkge251bWJlcn0gbG93IC0gbG93IGVuZCBvZiB0aGUgcmFuZ2UsIGluY2x1c2l2ZSAoY2xvc2VkKS5cbiAgICogQHByb3BlcnR5IHtudW1iZXI9fSBoaSAtIGhpZ2ggZW5kIG9mIHRoZSByYW5nZSwgZXhjbHVzaXZlIChvcGVuKS5cbiAgICovXG4gIC8qKlxuICAgKiBEZWxldGUgc29tZSBvciBhbGwgbWVzc2FnZXMgaW4gYSB0b3BpYy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljIC0gVG9waWMgbmFtZSB0byBkZWxldGUgbWVzc2FnZXMgZnJvbS5cbiAgICogQHBhcmFtIHtUaW5vZGUuRGVsUmFuZ2VbXX0gbGlzdCAtIFJhbmdlcyBvZiBtZXNzYWdlIElEcyB0byBkZWxldGUuXG4gICAqIEBwYXJhbSB7Ym9vbGVhbj19IGhhcmQgLSBIYXJkIG9yIHNvZnQgZGVsZXRlXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gcmVjZWl2aW5nIHNlcnZlciByZXBseS5cbiAgICovXG4gIGRlbE1lc3NhZ2VzKHRvcGljLCByYW5nZXMsIGhhcmQpIHtcbiAgICBjb25zdCBwa3QgPSB0aGlzLiNpbml0UGFja2V0KCdkZWwnLCB0b3BpYyk7XG5cbiAgICBwa3QuZGVsLndoYXQgPSAnbXNnJztcbiAgICBwa3QuZGVsLmRlbHNlcSA9IHJhbmdlcztcbiAgICBwa3QuZGVsLmhhcmQgPSBoYXJkO1xuXG4gICAgcmV0dXJuIHRoaXMuI3NlbmQocGt0LCBwa3QuZGVsLmlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWxldGUgdGhlIHRvcGljIGFsbHRvZ2V0aGVyLiBSZXF1aXJlcyBPd25lciBwZXJtaXNzaW9uLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWNOYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gZGVsZXRlXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gaGFyZCAtIGhhcmQtZGVsZXRlIHRvcGljLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIG9uIHJlY2VpdmluZyBzZXJ2ZXIgcmVwbHkuXG4gICAqL1xuICBkZWxUb3BpYyh0b3BpY05hbWUsIGhhcmQpIHtcbiAgICBjb25zdCBwa3QgPSB0aGlzLiNpbml0UGFja2V0KCdkZWwnLCB0b3BpY05hbWUpO1xuICAgIHBrdC5kZWwud2hhdCA9ICd0b3BpYyc7XG4gICAgcGt0LmRlbC5oYXJkID0gaGFyZDtcblxuICAgIHJldHVybiB0aGlzLiNzZW5kKHBrdCwgcGt0LmRlbC5pZCk7XG4gIH1cblxuICAvKipcbiAgICogRGVsZXRlIHN1YnNjcmlwdGlvbi4gUmVxdWlyZXMgU2hhcmUgcGVybWlzc2lvbi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljTmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIGRlbGV0ZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdXNlciAtIFVzZXIgSUQgdG8gcmVtb3ZlLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIG9uIHJlY2VpdmluZyBzZXJ2ZXIgcmVwbHkuXG4gICAqL1xuICBkZWxTdWJzY3JpcHRpb24odG9waWNOYW1lLCB1c2VyKSB7XG4gICAgY29uc3QgcGt0ID0gdGhpcy4jaW5pdFBhY2tldCgnZGVsJywgdG9waWNOYW1lKTtcbiAgICBwa3QuZGVsLndoYXQgPSAnc3ViJztcbiAgICBwa3QuZGVsLnVzZXIgPSB1c2VyO1xuXG4gICAgcmV0dXJuIHRoaXMuI3NlbmQocGt0LCBwa3QuZGVsLmlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWxldGUgY3JlZGVudGlhbC4gQWx3YXlzIHNlbnQgb24gPGNvZGU+J21lJzwvY29kZT4gdG9waWMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtZXRob2QgLSB2YWxpZGF0aW9uIG1ldGhvZCBzdWNoIGFzIDxjb2RlPidlbWFpbCc8L2NvZGU+IG9yIDxjb2RlPid0ZWwnPC9jb2RlPi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIC0gdmFsaWRhdGlvbiB2YWx1ZSwgaS5lLiA8Y29kZT4nYWxpY2VAZXhhbXBsZS5jb20nPC9jb2RlPi5cbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCBvbiByZWNlaXZpbmcgc2VydmVyIHJlcGx5LlxuICAgKi9cbiAgZGVsQ3JlZGVudGlhbChtZXRob2QsIHZhbHVlKSB7XG4gICAgY29uc3QgcGt0ID0gdGhpcy4jaW5pdFBhY2tldCgnZGVsJywgQ29uc3QuVE9QSUNfTUUpO1xuICAgIHBrdC5kZWwud2hhdCA9ICdjcmVkJztcbiAgICBwa3QuZGVsLmNyZWQgPSB7XG4gICAgICBtZXRoOiBtZXRob2QsXG4gICAgICB2YWw6IHZhbHVlXG4gICAgfTtcblxuICAgIHJldHVybiB0aGlzLiNzZW5kKHBrdCwgcGt0LmRlbC5pZCk7XG4gIH1cblxuICAvKipcbiAgICogUmVxdWVzdCB0byBkZWxldGUgYWNjb3VudCBvZiB0aGUgY3VycmVudCB1c2VyLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGhhcmQgLSBoYXJkLWRlbGV0ZSB1c2VyLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIG9uIHJlY2VpdmluZyBzZXJ2ZXIgcmVwbHkuXG4gICAqL1xuICBkZWxDdXJyZW50VXNlcihoYXJkKSB7XG4gICAgY29uc3QgcGt0ID0gdGhpcy4jaW5pdFBhY2tldCgnZGVsJywgbnVsbCk7XG4gICAgcGt0LmRlbC53aGF0ID0gJ3VzZXInO1xuICAgIHBrdC5kZWwuaGFyZCA9IGhhcmQ7XG5cbiAgICByZXR1cm4gdGhpcy4jc2VuZChwa3QsIHBrdC5kZWwuaWQpLnRoZW4oKGN0cmwpID0+IHtcbiAgICAgIHRoaXMuX215VUlEID0gbnVsbDtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBOb3RpZnkgc2VydmVyIHRoYXQgYSBtZXNzYWdlIG9yIG1lc3NhZ2VzIHdlcmUgcmVhZCBvciByZWNlaXZlZC4gRG9lcyBOT1QgcmV0dXJuIHByb21pc2UuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpY05hbWUgLSBOYW1lIG9mIHRoZSB0b3BpYyB3aGVyZSB0aGUgbWVzYWdlIGlzIGJlaW5nIGFrbm93bGVkZ2VkLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gd2hhdCAtIEFjdGlvbiBiZWluZyBha25vd2xlZGdlZCwgZWl0aGVyIDxjb2RlPlwicmVhZFwiPC9jb2RlPiBvciA8Y29kZT5cInJlY3ZcIjwvY29kZT4uXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzZXEgLSBNYXhpbXVtIGlkIG9mIHRoZSBtZXNzYWdlIGJlaW5nIGFja25vd2xlZGdlZC5cbiAgICovXG4gIG5vdGUodG9waWNOYW1lLCB3aGF0LCBzZXEpIHtcbiAgICBpZiAoc2VxIDw9IDAgfHwgc2VxID49IENvbnN0LkxPQ0FMX1NFUUlEKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgbWVzc2FnZSBpZCAke3NlcX1gKTtcbiAgICB9XG5cbiAgICBjb25zdCBwa3QgPSB0aGlzLiNpbml0UGFja2V0KCdub3RlJywgdG9waWNOYW1lKTtcbiAgICBwa3Qubm90ZS53aGF0ID0gd2hhdDtcbiAgICBwa3Qubm90ZS5zZXEgPSBzZXE7XG4gICAgdGhpcy4jc2VuZChwa3QpO1xuICB9XG5cbiAgLyoqXG4gICAqIEJyb2FkY2FzdCBhIGtleS1wcmVzcyBub3RpZmljYXRpb24gdG8gdG9waWMgc3Vic2NyaWJlcnMuIFVzZWQgdG8gc2hvd1xuICAgKiB0eXBpbmcgbm90aWZpY2F0aW9ucyBcInVzZXIgWCBpcyB0eXBpbmcuLi5cIi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljTmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIGJyb2FkY2FzdCB0by5cbiAgICovXG4gIG5vdGVLZXlQcmVzcyh0b3BpY05hbWUpIHtcbiAgICBjb25zdCBwa3QgPSB0aGlzLiNpbml0UGFja2V0KCdub3RlJywgdG9waWNOYW1lKTtcbiAgICBwa3Qubm90ZS53aGF0ID0gJ2twJztcbiAgICB0aGlzLiNzZW5kKHBrdCk7XG4gIH1cblxuICAvKipcbiAgICogU2VuZCBhIHZpZGVvIGNhbGwgbm90aWZpY2F0aW9uIHRvIHRvcGljIHN1YnNjcmliZXJzIChpbmNsdWRpbmcgZGlhbGluZyxcbiAgICogaGFuZ3VwLCBldGMuKS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljTmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIGJyb2FkY2FzdCB0by5cbiAgICogQHBhcmFtIHtpbnR9IHNlcSAtIElEIG9mIHRoZSBjYWxsIG1lc3NhZ2UgdGhlIGV2ZW50IHBlcnRhaW5zIHRvLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXZ0IC0gQ2FsbCBldmVudC5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHBheWxvYWQgLSBQYXlsb2FkIGFzc29jaWF0ZWQgd2l0aCB0aGlzIGV2ZW50IChlLmcuIFNEUCBzdHJpbmcpLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSAoZm9yIHNvbWUgY2FsbCBldmVudHMpIHdoaWNoIHdpbGxcbiAgICogICAgICAgICAgICAgICAgICAgIGJlIHJlc29sdmVkL3JlamVjdGVkIG9uIHJlY2VpdmluZyBzZXJ2ZXIgcmVwbHlcbiAgICovXG4gIHZpZGVvQ2FsbCh0b3BpY05hbWUsIHNlcSwgZXZ0LCBwYXlsb2FkKSB7XG4gICAgY29uc3QgcGt0ID0gdGhpcy4jaW5pdFBhY2tldCgnbm90ZScsIHRvcGljTmFtZSk7XG4gICAgcGt0Lm5vdGUuc2VxID0gc2VxO1xuICAgIHBrdC5ub3RlLndoYXQgPSAnY2FsbCc7XG4gICAgcGt0Lm5vdGUuZXZlbnQgPSBldnQ7XG4gICAgcGt0Lm5vdGUucGF5bG9hZCA9IHBheWxvYWQ7XG4gICAgdGhpcy4jc2VuZChwa3QsIHBrdC5ub3RlLmlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYSBuYW1lZCB0b3BpYywgZWl0aGVyIHB1bGwgaXQgZnJvbSBjYWNoZSBvciBjcmVhdGUgYSBuZXcgaW5zdGFuY2UuXG4gICAqIFRoZXJlIGlzIGEgc2luZ2xlIGluc3RhbmNlIG9mIHRvcGljIGZvciBlYWNoIG5hbWUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpY05hbWUgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byBnZXQuXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuVG9waWN9IFJlcXVlc3RlZCBvciBuZXdseSBjcmVhdGVkIHRvcGljIG9yIDxjb2RlPnVuZGVmaW5lZDwvY29kZT4gaWYgdG9waWMgbmFtZSBpcyBpbnZhbGlkLlxuICAgKi9cbiAgZ2V0VG9waWModG9waWNOYW1lKSB7XG4gICAgbGV0IHRvcGljID0gdGhpcy4jY2FjaGVHZXQoJ3RvcGljJywgdG9waWNOYW1lKTtcbiAgICBpZiAoIXRvcGljICYmIHRvcGljTmFtZSkge1xuICAgICAgaWYgKHRvcGljTmFtZSA9PSBDb25zdC5UT1BJQ19NRSkge1xuICAgICAgICB0b3BpYyA9IG5ldyBUb3BpY01lKCk7XG4gICAgICB9IGVsc2UgaWYgKHRvcGljTmFtZSA9PSBDb25zdC5UT1BJQ19GTkQpIHtcbiAgICAgICAgdG9waWMgPSBuZXcgVG9waWNGbmQoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRvcGljID0gbmV3IFRvcGljKHRvcGljTmFtZSk7XG4gICAgICB9XG4gICAgICAvLyBDYWNoZSBtYW5hZ2VtZW50LlxuICAgICAgdGhpcy4jYXR0YWNoQ2FjaGVUb1RvcGljKHRvcGljKTtcbiAgICAgIHRvcGljLl9jYWNoZVB1dFNlbGYoKTtcbiAgICAgIC8vIERvbid0IHNhdmUgdG8gREIgaGVyZTogYSByZWNvcmQgd2lsbCBiZSBhZGRlZCB3aGVuIHRoZSB0b3BpYyBpcyBzdWJzY3JpYmVkLlxuICAgIH1cbiAgICByZXR1cm4gdG9waWM7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGEgbmFtZWQgdG9waWMgZnJvbSBjYWNoZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljTmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIGdldC5cbiAgICogQHJldHVybnMge1Rpbm9kZS5Ub3BpY30gUmVxdWVzdGVkIHRvcGljIG9yIDxjb2RlPnVuZGVmaW5lZDwvY29kZT4gaWYgdG9waWMgaXMgbm90IGZvdW5kIGluIGNhY2hlLlxuICAgKi9cbiAgY2FjaGVHZXRUb3BpYyh0b3BpY05hbWUpIHtcbiAgICByZXR1cm4gdGhpcy4jY2FjaGVHZXQoJ3RvcGljJywgdG9waWNOYW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgbmFtZWQgdG9waWMgZnJvbSBjYWNoZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljTmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIHJlbW92ZSBmcm9tIGNhY2hlLlxuICAgKi9cbiAgY2FjaGVSZW1Ub3BpYyh0b3BpY05hbWUpIHtcbiAgICB0aGlzLiNjYWNoZURlbCgndG9waWMnLCB0b3BpY05hbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEl0ZXJhdGUgb3ZlciBjYWNoZWQgdG9waWNzLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIC0gY2FsbGJhY2sgdG8gY2FsbCBmb3IgZWFjaCB0b3BpYy5cbiAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHQgLSAndGhpcycgaW5zaWRlIHRoZSAnZnVuYycuXG4gICAqL1xuICBtYXBUb3BpY3MoZnVuYywgY29udGV4dCkge1xuICAgIHRoaXMuI2NhY2hlTWFwKCd0b3BpYycsIGZ1bmMsIGNvbnRleHQpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIG5hbWVkIHRvcGljIGlzIGFscmVhZHkgcHJlc2VudCBpbiBjYWNoZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljTmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiB0b3BpYyBpcyBmb3VuZCBpbiBjYWNoZSwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgKi9cbiAgaXNUb3BpY0NhY2hlZCh0b3BpY05hbWUpIHtcbiAgICByZXR1cm4gISF0aGlzLiNjYWNoZUdldCgndG9waWMnLCB0b3BpY05hbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlIHVuaXF1ZSBuYW1lIGxpa2UgPGNvZGU+J25ldzEyMzQ1Nic8L2NvZGU+IHN1aXRhYmxlIGZvciBjcmVhdGluZyBhIG5ldyBncm91cCB0b3BpYy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSBpc0NoYW4gLSBpZiB0aGUgdG9waWMgaXMgY2hhbm5lbC1lbmFibGVkLlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBuYW1lIHdoaWNoIGNhbiBiZSB1c2VkIGZvciBjcmVhdGluZyBhIG5ldyBncm91cCB0b3BpYy5cbiAgICovXG4gIG5ld0dyb3VwVG9waWNOYW1lKGlzQ2hhbikge1xuICAgIHJldHVybiAoaXNDaGFuID8gQ29uc3QuVE9QSUNfTkVXX0NIQU4gOiBDb25zdC5UT1BJQ19ORVcpICsgdGhpcy5nZXROZXh0VW5pcXVlSWQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnN0YW50aWF0ZSA8Y29kZT4nbWUnPC9jb2RlPiB0b3BpYyBvciBnZXQgaXQgZnJvbSBjYWNoZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5Ub3BpY01lfSBJbnN0YW5jZSBvZiA8Y29kZT4nbWUnPC9jb2RlPiB0b3BpYy5cbiAgICovXG4gIGdldE1lVG9waWMoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0VG9waWMoQ29uc3QuVE9QSUNfTUUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluc3RhbnRpYXRlIDxjb2RlPidmbmQnPC9jb2RlPiAoZmluZCkgdG9waWMgb3IgZ2V0IGl0IGZyb20gY2FjaGUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuVG9waWN9IEluc3RhbmNlIG9mIDxjb2RlPidmbmQnPC9jb2RlPiB0b3BpYy5cbiAgICovXG4gIGdldEZuZFRvcGljKCkge1xuICAgIHJldHVybiB0aGlzLmdldFRvcGljKENvbnN0LlRPUElDX0ZORCk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgbmV3IHtAbGluayBMYXJnZUZpbGVIZWxwZXJ9IGluc3RhbmNlXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuTGFyZ2VGaWxlSGVscGVyfSBpbnN0YW5jZSBvZiBhIHtAbGluayBUaW5vZGUuTGFyZ2VGaWxlSGVscGVyfS5cbiAgICovXG4gIGdldExhcmdlRmlsZUhlbHBlcigpIHtcbiAgICByZXR1cm4gbmV3IExhcmdlRmlsZUhlbHBlcih0aGlzLCBDb25zdC5QUk9UT0NPTF9WRVJTSU9OKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIFVJRCBvZiB0aGUgdGhlIGN1cnJlbnQgYXV0aGVudGljYXRlZCB1c2VyLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBVSUQgb2YgdGhlIGN1cnJlbnQgdXNlciBvciA8Y29kZT51bmRlZmluZWQ8L2NvZGU+IGlmIHRoZSBzZXNzaW9uIGlzIG5vdCB5ZXQgYXV0aGVudGljYXRlZCBvciBpZiB0aGVyZSBpcyBubyBzZXNzaW9uLlxuICAgKi9cbiAgZ2V0Q3VycmVudFVzZXJJRCgpIHtcbiAgICByZXR1cm4gdGhpcy5fbXlVSUQ7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgdGhlIGdpdmVuIHVzZXIgSUQgaXMgZXF1YWwgdG8gdGhlIGN1cnJlbnQgdXNlcidzIFVJRC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVpZCAtIFVJRCB0byBjaGVjay5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgdGhlIGdpdmVuIFVJRCBiZWxvbmdzIHRvIHRoZSBjdXJyZW50IGxvZ2dlZCBpbiB1c2VyLlxuICAgKi9cbiAgaXNNZSh1aWQpIHtcbiAgICByZXR1cm4gdGhpcy5fbXlVSUQgPT09IHVpZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgbG9naW4gdXNlZCBmb3IgbGFzdCBzdWNjZXNzZnVsIGF1dGhlbnRpY2F0aW9uLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBsb2dpbiBsYXN0IHVzZWQgc3VjY2Vzc2Z1bGx5IG9yIDxjb2RlPnVuZGVmaW5lZDwvY29kZT4uXG4gICAqL1xuICBnZXRDdXJyZW50TG9naW4oKSB7XG4gICAgcmV0dXJuIHRoaXMuX2xvZ2luO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiBpbmZvcm1hdGlvbiBhYm91dCB0aGUgc2VydmVyOiBwcm90b2NvbCB2ZXJzaW9uIGFuZCBidWlsZCB0aW1lc3RhbXAuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IGJ1aWxkIGFuZCB2ZXJzaW9uIG9mIHRoZSBzZXJ2ZXIgb3IgPGNvZGU+bnVsbDwvY29kZT4gaWYgdGhlcmUgaXMgbm8gY29ubmVjdGlvbiBvciBpZiB0aGUgZmlyc3Qgc2VydmVyIHJlc3BvbnNlIGhhcyBub3QgYmVlbiByZWNlaXZlZCB5ZXQuXG4gICAqL1xuICBnZXRTZXJ2ZXJJbmZvKCkge1xuICAgIHJldHVybiB0aGlzLl9zZXJ2ZXJJbmZvO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcG9ydCBhIHRvcGljIGZvciBhYnVzZS4gV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNwdWJsaXNofS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGFjdGlvbiAtIHRoZSBvbmx5IHN1cHBvcnRlZCBhY3Rpb24gaXMgJ3JlcG9ydCcuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0YXJnZXQgLSBuYW1lIG9mIHRoZSB0b3BpYyBiZWluZyByZXBvcnRlZC5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgdG8gYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgc2VydmVyIHJlc3BvbmRzIHRvIHJlcXVlc3QuXG4gICAqL1xuICByZXBvcnQoYWN0aW9uLCB0YXJnZXQpIHtcbiAgICByZXR1cm4gdGhpcy5wdWJsaXNoKENvbnN0LlRPUElDX1NZUywgRHJhZnR5LmF0dGFjaEpTT04obnVsbCwge1xuICAgICAgJ2FjdGlvbic6IGFjdGlvbixcbiAgICAgICd0YXJnZXQnOiB0YXJnZXRcbiAgICB9KSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHNlcnZlci1wcm92aWRlZCBjb25maWd1cmF0aW9uIHZhbHVlIChsb25nIGludGVnZXIpLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBvZiB0aGUgdmFsdWUgdG8gcmV0dXJuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkZWZhdWx0VmFsdWUgdG8gcmV0dXJuIGluIGNhc2Ugc2VydmVyIGxpbWl0IGlzIG5vdCBzZXQgb3Igbm90IGZvdW5kLlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSBuYW1lZCB2YWx1ZS5cbiAgICovXG4gIGdldFNlcnZlckxpbWl0KG5hbWUsIGRlZmF1bHRWYWx1ZSkge1xuICAgIHJldHVybiAodGhpcy5fc2VydmVySW5mbyA/IHRoaXMuX3NlcnZlckluZm9bbmFtZV0gOiBudWxsKSB8fCBkZWZhdWx0VmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogVG9nZ2xlIGNvbnNvbGUgbG9nZ2luZy4gTG9nZ2luZyBpcyBvZmYgYnkgZGVmYXVsdC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICogQHBhcmFtIHtib29sZWFufSBlbmFibGVkIC0gU2V0IHRvIDxjb2RlPnRydWU8L2NvZGU+IHRvIGVuYWJsZSBsb2dnaW5nIHRvIGNvbnNvbGUuXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gdHJpbUxvbmdTdHJpbmdzIC0gU2V0IHRvIDxjb2RlPnRydWU8L2NvZGU+IHRvIHRyaW0gbG9uZyBzdHJpbmdzLlxuICAgKi9cbiAgZW5hYmxlTG9nZ2luZyhlbmFibGVkLCB0cmltTG9uZ1N0cmluZ3MpIHtcbiAgICB0aGlzLl9sb2dnaW5nRW5hYmxlZCA9IGVuYWJsZWQ7XG4gICAgdGhpcy5fdHJpbUxvbmdTdHJpbmdzID0gZW5hYmxlZCAmJiB0cmltTG9uZ1N0cmluZ3M7XG4gIH1cblxuICAvKipcbiAgICogU2V0IFVJIGxhbmd1YWdlIHRvIHJlcG9ydCB0byB0aGUgc2VydmVyLiBNdXN0IGJlIGNhbGxlZCBiZWZvcmUgPGNvZGU+J2hpJzwvY29kZT4gaXMgc2VudCwgb3RoZXJ3aXNlIGl0IHdpbGwgbm90IGJlIHVzZWQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBobCAtIGh1bWFuIChVSSkgbGFuZ3VhZ2UsIGxpa2UgPGNvZGU+XCJlbl9VU1wiPC9jb2RlPiBvciA8Y29kZT5cInpoLUhhbnNcIjwvY29kZT4uXG4gICAqL1xuICBzZXRIdW1hbkxhbmd1YWdlKGhsKSB7XG4gICAgaWYgKGhsKSB7XG4gICAgICB0aGlzLl9odW1hbkxhbmd1YWdlID0gaGw7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGdpdmVuIHRvcGljIGlzIG9ubGluZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgb2YgdGhlIHRvcGljIHRvIHRlc3QuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIHRvcGljIGlzIG9ubGluZSwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgKi9cbiAgaXNUb3BpY09ubGluZShuYW1lKSB7XG4gICAgY29uc3QgdG9waWMgPSB0aGlzLiNjYWNoZUdldCgndG9waWMnLCBuYW1lKTtcbiAgICByZXR1cm4gdG9waWMgJiYgdG9waWMub25saW5lO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhY2Nlc3MgbW9kZSBmb3IgdGhlIGdpdmVuIGNvbnRhY3QuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIG9mIHRoZSB0b3BpYyB0byBxdWVyeS5cbiAgICogQHJldHVybnMge0FjY2Vzc01vZGV9IGFjY2VzcyBtb2RlIGlmIHRvcGljIGlzIGZvdW5kLCBudWxsIG90aGVyd2lzZS5cbiAgICovXG4gIGdldFRvcGljQWNjZXNzTW9kZShuYW1lKSB7XG4gICAgY29uc3QgdG9waWMgPSB0aGlzLiNjYWNoZUdldCgndG9waWMnLCBuYW1lKTtcbiAgICByZXR1cm4gdG9waWMgPyB0b3BpYy5hY3MgOiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEluY2x1ZGUgbWVzc2FnZSBJRCBpbnRvIGFsbCBzdWJzZXF1ZXN0IG1lc3NhZ2VzIHRvIHNlcnZlciBpbnN0cnVjdGluIGl0IHRvIHNlbmQgYWtub3dsZWRnZW1lbnMuXG4gICAqIFJlcXVpcmVkIGZvciBwcm9taXNlcyB0byBmdW5jdGlvbi4gRGVmYXVsdCBpcyA8Y29kZT5cIm9uXCI8L2NvZGU+LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHN0YXR1cyAtIFR1cm4gYWtub3dsZWRnZW1lbnMgb24gb3Igb2ZmLlxuICAgKiBAZGVwcmVjYXRlZFxuICAgKi9cbiAgd2FudEFrbihzdGF0dXMpIHtcbiAgICBpZiAoc3RhdHVzKSB7XG4gICAgICB0aGlzLl9tZXNzYWdlSWQgPSBNYXRoLmZsb29yKChNYXRoLnJhbmRvbSgpICogMHhGRkZGRkYpICsgMHhGRkZGRkYpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9tZXNzYWdlSWQgPSAwO1xuICAgIH1cbiAgfVxuXG4gIC8vIENhbGxiYWNrczpcbiAgLyoqXG4gICAqIENhbGxiYWNrIHRvIHJlcG9ydCB3aGVuIHRoZSB3ZWJzb2NrZXQgaXMgb3BlbmVkLiBUaGUgY2FsbGJhY2sgaGFzIG5vIHBhcmFtZXRlcnMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqIEB0eXBlIHtUaW5vZGUub25XZWJzb2NrZXRPcGVufVxuICAgKi9cbiAgb25XZWJzb2NrZXRPcGVuID0gdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBAdHlwZWRlZiBUaW5vZGUuU2VydmVyUGFyYW1zXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHByb3BlcnR5IHtzdHJpbmd9IHZlciAtIFNlcnZlciB2ZXJzaW9uXG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBidWlsZCAtIFNlcnZlciBidWlsZFxuICAgKiBAcHJvcGVydHkge3N0cmluZz19IHNpZCAtIFNlc3Npb24gSUQsIGxvbmcgcG9sbGluZyBjb25uZWN0aW9ucyBvbmx5LlxuICAgKi9cblxuICAvKipcbiAgICogQGNhbGxiYWNrIFRpbm9kZS5vbkNvbm5lY3RcbiAgICogQHBhcmFtIHtudW1iZXJ9IGNvZGUgLSBSZXN1bHQgY29kZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGV4dCAtIFRleHQgZXB4cGxhaW5pbmcgdGhlIGNvbXBsZXRpb24sIGkuZSBcIk9LXCIgb3IgYW4gZXJyb3IgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtUaW5vZGUuU2VydmVyUGFyYW1zfSBwYXJhbXMgLSBQYXJhbWV0ZXJzIHJldHVybmVkIGJ5IHRoZSBzZXJ2ZXIuXG4gICAqL1xuICAvKipcbiAgICogQ2FsbGJhY2sgdG8gcmVwb3J0IHdoZW4gY29ubmVjdGlvbiB3aXRoIFRpbm9kZSBzZXJ2ZXIgaXMgZXN0YWJsaXNoZWQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqIEB0eXBlIHtUaW5vZGUub25Db25uZWN0fVxuICAgKi9cbiAgb25Db25uZWN0ID0gdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBDYWxsYmFjayB0byByZXBvcnQgd2hlbiBjb25uZWN0aW9uIGlzIGxvc3QuIFRoZSBjYWxsYmFjayBoYXMgbm8gcGFyYW1ldGVycy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICogQHR5cGUge1Rpbm9kZS5vbkRpc2Nvbm5lY3R9XG4gICAqL1xuICBvbkRpc2Nvbm5lY3QgPSB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIEBjYWxsYmFjayBUaW5vZGUub25Mb2dpblxuICAgKiBAcGFyYW0ge251bWJlcn0gY29kZSAtIE5VbWVyaWMgY29tcGxldGlvbiBjb2RlLCBzYW1lIGFzIEhUVFAgc3RhdHVzIGNvZGVzLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGV4dCAtIEV4cGxhbmF0aW9uIG9mIHRoZSBjb21wbGV0aW9uIGNvZGUuXG4gICAqL1xuICAvKipcbiAgICogQ2FsbGJhY2sgdG8gcmVwb3J0IGxvZ2luIGNvbXBsZXRpb24uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqIEB0eXBlIHtUaW5vZGUub25Mb2dpbn1cbiAgICovXG4gIG9uTG9naW4gPSB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIHRvIHJlY2VpdmUgPGNvZGU+e2N0cmx9PC9jb2RlPiAoY29udHJvbCkgbWVzc2FnZXMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqIEB0eXBlIHtUaW5vZGUub25DdHJsTWVzc2FnZX1cbiAgICovXG4gIG9uQ3RybE1lc3NhZ2UgPSB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIHRvIHJlY2lldmUgPGNvZGU+e2RhdGF9PC9jb2RlPiAoY29udGVudCkgbWVzc2FnZXMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqIEB0eXBlIHtUaW5vZGUub25EYXRhTWVzc2FnZX1cbiAgICovXG4gIG9uRGF0YU1lc3NhZ2UgPSB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIHRvIHJlY2VpdmUgPGNvZGU+e3ByZXN9PC9jb2RlPiAocHJlc2VuY2UpIG1lc3NhZ2VzLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKiBAdHlwZSB7VGlub2RlLm9uUHJlc01lc3NhZ2V9XG4gICAqL1xuICBvblByZXNNZXNzYWdlID0gdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBDYWxsYmFjayB0byByZWNlaXZlIGFsbCBtZXNzYWdlcyBhcyBvYmplY3RzLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKiBAdHlwZSB7VGlub2RlLm9uTWVzc2FnZX1cbiAgICovXG4gIG9uTWVzc2FnZSA9IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQ2FsbGJhY2sgdG8gcmVjZWl2ZSBhbGwgbWVzc2FnZXMgYXMgdW5wYXJzZWQgdGV4dC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICogQHR5cGUge1Rpbm9kZS5vblJhd01lc3NhZ2V9XG4gICAqL1xuICBvblJhd01lc3NhZ2UgPSB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIHRvIHJlY2VpdmUgc2VydmVyIHJlc3BvbnNlcyB0byBuZXR3b3JrIHByb2Jlcy4gU2VlIHtAbGluayBUaW5vZGUjbmV0d29ya1Byb2JlfVxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKiBAdHlwZSB7VGlub2RlLm9uTmV0d29ya1Byb2JlfVxuICAgKi9cbiAgb25OZXR3b3JrUHJvYmUgPSB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIHRvIGJlIG5vdGlmaWVkIHdoZW4gZXhwb25lbnRpYWwgYmFja29mZiBpcyBpdGVyYXRpbmcuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqIEB0eXBlIHtUaW5vZGUub25BdXRvcmVjb25uZWN0SXRlcmF0aW9ufVxuICAgKi9cbiAgb25BdXRvcmVjb25uZWN0SXRlcmF0aW9uID0gdW5kZWZpbmVkO1xufTtcblxuLy8gRXhwb3J0ZWQgY29uc3RhbnRzXG5UaW5vZGUuTUVTU0FHRV9TVEFUVVNfTk9ORSA9IENvbnN0Lk1FU1NBR0VfU1RBVFVTX05PTkU7XG5UaW5vZGUuTUVTU0FHRV9TVEFUVVNfUVVFVUVEID0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfUVVFVUVEO1xuVGlub2RlLk1FU1NBR0VfU1RBVFVTX1NFTkRJTkcgPSBDb25zdC5NRVNTQUdFX1NUQVRVU19TRU5ESU5HO1xuVGlub2RlLk1FU1NBR0VfU1RBVFVTX0ZBSUxFRCA9IENvbnN0Lk1FU1NBR0VfU1RBVFVTX0ZBSUxFRDtcblRpbm9kZS5NRVNTQUdFX1NUQVRVU19TRU5UID0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfU0VOVDtcblRpbm9kZS5NRVNTQUdFX1NUQVRVU19SRUNFSVZFRCA9IENvbnN0Lk1FU1NBR0VfU1RBVFVTX1JFQ0VJVkVEO1xuVGlub2RlLk1FU1NBR0VfU1RBVFVTX1JFQUQgPSBDb25zdC5NRVNTQUdFX1NUQVRVU19SRUFEO1xuVGlub2RlLk1FU1NBR0VfU1RBVFVTX1RPX01FID0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfVE9fTUU7XG5UaW5vZGUuTUVTU0FHRV9TVEFUVVNfREVMX1JBTkdFID0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfREVMX1JBTkdFO1xuXG4vLyBVbmljb2RlIFtkZWxdIHN5bWJvbC5cblRpbm9kZS5ERUxfQ0hBUiA9IENvbnN0LkRFTF9DSEFSO1xuXG4vLyBOYW1lcyBvZiBrZXlzIHRvIHNlcnZlci1wcm92aWRlZCBjb25maWd1cmF0aW9uIGxpbWl0cy5cblRpbm9kZS5NQVhfTUVTU0FHRV9TSVpFID0gJ21heE1lc3NhZ2VTaXplJztcblRpbm9kZS5NQVhfU1VCU0NSSUJFUl9DT1VOVCA9ICdtYXhTdWJzY3JpYmVyQ291bnQnO1xuVGlub2RlLk1BWF9UQUdfQ09VTlQgPSAnbWF4VGFnQ291bnQnO1xuVGlub2RlLk1BWF9GSUxFX1VQTE9BRF9TSVpFID0gJ21heEZpbGVVcGxvYWRTaXplJztcbiIsIi8qKlxuICogQGZpbGUgVG9waWMgbWFuYWdlbWVudC5cbiAqXG4gKiBAY29weXJpZ2h0IDIwMTUtMjAyMiBUaW5vZGUgTExDLlxuICovXG4ndXNlIHN0cmljdCc7XG5cbmltcG9ydCBBY2Nlc3NNb2RlIGZyb20gJy4vYWNjZXNzLW1vZGUuanMnO1xuaW1wb3J0IENCdWZmZXIgZnJvbSAnLi9jYnVmZmVyLmpzJztcbmltcG9ydCAqIGFzIENvbnN0IGZyb20gJy4vY29uZmlnLmpzJztcbmltcG9ydCBEcmFmdHkgZnJvbSAnLi9kcmFmdHkuanMnO1xuaW1wb3J0IE1ldGFHZXRCdWlsZGVyIGZyb20gJy4vbWV0YS1idWlsZGVyLmpzJztcbmltcG9ydCB7XG4gIG1lcmdlT2JqLFxuICBtZXJnZVRvQ2FjaGUsXG4gIG5vcm1hbGl6ZUFycmF5XG59IGZyb20gJy4vdXRpbHMuanMnO1xuXG5leHBvcnQgY2xhc3MgVG9waWMge1xuICAvKipcbiAgICogQGNhbGxiYWNrIFRpbm9kZS5Ub3BpYy5vbkRhdGFcbiAgICogQHBhcmFtIHtEYXRhfSBkYXRhIC0gRGF0YSBwYWNrZXRcbiAgICovXG4gIC8qKlxuICAgKiBUb3BpYyBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyBhIGxvZ2ljYWwgY29tbXVuaWNhdGlvbiBjaGFubmVsLlxuICAgKiBAY2xhc3MgVG9waWNcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIGNyZWF0ZS5cbiAgICogQHBhcmFtIHtPYmplY3Q9fSBjYWxsYmFja3MgLSBPYmplY3Qgd2l0aCB2YXJpb3VzIGV2ZW50IGNhbGxiYWNrcy5cbiAgICogQHBhcmFtIHtUaW5vZGUuVG9waWMub25EYXRhfSBjYWxsYmFja3Mub25EYXRhIC0gQ2FsbGJhY2sgd2hpY2ggcmVjZWl2ZXMgYSA8Y29kZT57ZGF0YX08L2NvZGU+IG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7Y2FsbGJhY2t9IGNhbGxiYWNrcy5vbk1ldGEgLSBDYWxsYmFjayB3aGljaCByZWNlaXZlcyBhIDxjb2RlPnttZXRhfTwvY29kZT4gbWVzc2FnZS5cbiAgICogQHBhcmFtIHtjYWxsYmFja30gY2FsbGJhY2tzLm9uUHJlcyAtIENhbGxiYWNrIHdoaWNoIHJlY2VpdmVzIGEgPGNvZGU+e3ByZXN9PC9jb2RlPiBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge2NhbGxiYWNrfSBjYWxsYmFja3Mub25JbmZvIC0gQ2FsbGJhY2sgd2hpY2ggcmVjZWl2ZXMgYW4gPGNvZGU+e2luZm99PC9jb2RlPiBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge2NhbGxiYWNrfSBjYWxsYmFja3Mub25NZXRhRGVzYyAtIENhbGxiYWNrIHdoaWNoIHJlY2VpdmVzIGNoYW5nZXMgdG8gdG9waWMgZGVzY3Rpb3B0aW9uIHtAbGluayBkZXNjfS5cbiAgICogQHBhcmFtIHtjYWxsYmFja30gY2FsbGJhY2tzLm9uTWV0YVN1YiAtIENhbGxlZCBmb3IgYSBzaW5nbGUgc3Vic2NyaXB0aW9uIHJlY29yZCBjaGFuZ2UuXG4gICAqIEBwYXJhbSB7Y2FsbGJhY2t9IGNhbGxiYWNrcy5vblN1YnNVcGRhdGVkIC0gQ2FsbGVkIGFmdGVyIGEgYmF0Y2ggb2Ygc3Vic2NyaXB0aW9uIGNoYW5nZXMgaGF2ZSBiZWVuIHJlY2lldmVkIGFuZCBjYWNoZWQuXG4gICAqIEBwYXJhbSB7Y2FsbGJhY2t9IGNhbGxiYWNrcy5vbkRlbGV0ZVRvcGljIC0gQ2FsbGVkIGFmdGVyIHRoZSB0b3BpYyBpcyBkZWxldGVkLlxuICAgKiBAcGFyYW0ge2NhbGxiYWNrfSBjYWxsYmFjbHMub25BbGxNZXNzYWdlc1JlY2VpdmVkIC0gQ2FsbGVkIHdoZW4gYWxsIHJlcXVlc3RlZCA8Y29kZT57ZGF0YX08L2NvZGU+IG1lc3NhZ2VzIGhhdmUgYmVlbiByZWNpdmVkLlxuICAgKi9cbiAgY29uc3RydWN0b3IobmFtZSwgY2FsbGJhY2tzKSB7XG4gICAgLy8gUGFyZW50IFRpbm9kZSBvYmplY3QuXG4gICAgdGhpcy5fdGlub2RlID0gbnVsbDtcblxuICAgIC8vIFNlcnZlci1wcm92aWRlZCBkYXRhLCBsb2NhbGx5IGltbXV0YWJsZS5cbiAgICAvLyB0b3BpYyBuYW1lXG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAvLyBUaW1lc3RhbXAgd2hlbiB0aGUgdG9waWMgd2FzIGNyZWF0ZWQuXG4gICAgdGhpcy5jcmVhdGVkID0gbnVsbDtcbiAgICAvLyBUaW1lc3RhbXAgd2hlbiB0aGUgdG9waWMgd2FzIGxhc3QgdXBkYXRlZC5cbiAgICB0aGlzLnVwZGF0ZWQgPSBudWxsO1xuICAgIC8vIFRpbWVzdGFtcCBvZiB0aGUgbGFzdCBtZXNzYWdlc1xuICAgIHRoaXMudG91Y2hlZCA9IG5ldyBEYXRlKDApO1xuICAgIC8vIEFjY2VzcyBtb2RlLCBzZWUgQWNjZXNzTW9kZVxuICAgIHRoaXMuYWNzID0gbmV3IEFjY2Vzc01vZGUobnVsbCk7XG4gICAgLy8gUGVyLXRvcGljIHByaXZhdGUgZGF0YSAoYWNjZXNzaWJsZSBieSBjdXJyZW50IHVzZXIgb25seSkuXG4gICAgdGhpcy5wcml2YXRlID0gbnVsbDtcbiAgICAvLyBQZXItdG9waWMgcHVibGljIGRhdGEgKGFjY2Vzc2libGUgYnkgYWxsIHVzZXJzKS5cbiAgICB0aGlzLnB1YmxpYyA9IG51bGw7XG4gICAgLy8gUGVyLXRvcGljIHN5c3RlbS1wcm92aWRlZCBkYXRhIChhY2Nlc3NpYmxlIGJ5IGFsbCB1c2VycykuXG4gICAgdGhpcy50cnVzdGVkID0gbnVsbDtcblxuICAgIC8vIExvY2FsbHkgY2FjaGVkIGRhdGFcbiAgICAvLyBTdWJzY3JpYmVkIHVzZXJzLCBmb3IgdHJhY2tpbmcgcmVhZC9yZWN2L21zZyBub3RpZmljYXRpb25zLlxuICAgIHRoaXMuX3VzZXJzID0ge307XG5cbiAgICAvLyBDdXJyZW50IHZhbHVlIG9mIGxvY2FsbHkgaXNzdWVkIHNlcUlkLCB1c2VkIGZvciBwZW5kaW5nIG1lc3NhZ2VzLlxuICAgIHRoaXMuX3F1ZXVlZFNlcUlkID0gQ29uc3QuTE9DQUxfU0VRSUQ7XG5cbiAgICAvLyBUaGUgbWF4aW11bSBrbm93biB7ZGF0YS5zZXF9IHZhbHVlLlxuICAgIHRoaXMuX21heFNlcSA9IDA7XG4gICAgLy8gVGhlIG1pbmltdW0ga25vd24ge2RhdGEuc2VxfSB2YWx1ZS5cbiAgICB0aGlzLl9taW5TZXEgPSAwO1xuICAgIC8vIEluZGljYXRvciB0aGF0IHRoZSBsYXN0IHJlcXVlc3QgZm9yIGVhcmxpZXIgbWVzc2FnZXMgcmV0dXJuZWQgMC5cbiAgICB0aGlzLl9ub0VhcmxpZXJNc2dzID0gZmFsc2U7XG4gICAgLy8gVGhlIG1heGltdW0ga25vd24gZGVsZXRpb24gSUQuXG4gICAgdGhpcy5fbWF4RGVsID0gMDtcbiAgICAvLyBVc2VyIGRpc2NvdmVyeSB0YWdzXG4gICAgdGhpcy5fdGFncyA9IFtdO1xuICAgIC8vIENyZWRlbnRpYWxzIHN1Y2ggYXMgZW1haWwgb3IgcGhvbmUgbnVtYmVyLlxuICAgIHRoaXMuX2NyZWRlbnRpYWxzID0gW107XG4gICAgLy8gTWVzc2FnZSB2ZXJzaW9ucyBjYWNoZSAoZS5nLiBmb3IgZWRpdGVkIG1lc3NhZ2VzKS5cbiAgICAvLyBLZXlzOiBvcmlnaW5hbCBtZXNzYWdlIHNlcSBpZHMuXG4gICAgLy8gVmFsdWVzOiBDQnVmZmVycyBjb250YWluaW5nIG5ld2VyIHZlcnNpb25zIG9mIHRoZSBvcmlnaW5hbCBtZXNzYWdlXG4gICAgLy8gb3JkZXJlZCBieSBzZXEgaWQuXG4gICAgdGhpcy5fbWVzc2FnZVZlcnNpb25zID0ge307XG4gICAgLy8gTWVzc2FnZSBjYWNoZSwgc29ydGVkIGJ5IG1lc3NhZ2Ugc2VxIHZhbHVlcywgZnJvbSBvbGQgdG8gbmV3LlxuICAgIHRoaXMuX21lc3NhZ2VzID0gbmV3IENCdWZmZXIoKGEsIGIpID0+IHtcbiAgICAgIHJldHVybiBhLnNlcSAtIGIuc2VxO1xuICAgIH0sIHRydWUpO1xuICAgIC8vIEJvb2xlYW4sIHRydWUgaWYgdGhlIHRvcGljIGlzIGN1cnJlbnRseSBsaXZlXG4gICAgdGhpcy5fYXR0YWNoZWQgPSBmYWxzZTtcbiAgICAvLyBUaW1lc3RhcCBvZiB0aGUgbW9zdCByZWNlbnRseSB1cGRhdGVkIHN1YnNjcmlwdGlvbi5cbiAgICB0aGlzLl9sYXN0U3Vic1VwZGF0ZSA9IG5ldyBEYXRlKDApO1xuICAgIC8vIFRvcGljIGNyZWF0ZWQgYnV0IG5vdCB5ZXQgc3luY2VkIHdpdGggdGhlIHNlcnZlci4gVXNlZCBvbmx5IGR1cmluZyBpbml0aWFsaXphdGlvbi5cbiAgICB0aGlzLl9uZXcgPSB0cnVlO1xuICAgIC8vIFRoZSB0b3BpYyBpcyBkZWxldGVkIGF0IHRoZSBzZXJ2ZXIsIHRoaXMgaXMgYSBsb2NhbCBjb3B5LlxuICAgIHRoaXMuX2RlbGV0ZWQgPSBmYWxzZTtcblxuICAgIC8vIENhbGxiYWNrc1xuICAgIGlmIChjYWxsYmFja3MpIHtcbiAgICAgIHRoaXMub25EYXRhID0gY2FsbGJhY2tzLm9uRGF0YTtcbiAgICAgIHRoaXMub25NZXRhID0gY2FsbGJhY2tzLm9uTWV0YTtcbiAgICAgIHRoaXMub25QcmVzID0gY2FsbGJhY2tzLm9uUHJlcztcbiAgICAgIHRoaXMub25JbmZvID0gY2FsbGJhY2tzLm9uSW5mbztcbiAgICAgIC8vIEEgc2luZ2xlIGRlc2MgdXBkYXRlO1xuICAgICAgdGhpcy5vbk1ldGFEZXNjID0gY2FsbGJhY2tzLm9uTWV0YURlc2M7XG4gICAgICAvLyBBIHNpbmdsZSBzdWJzY3JpcHRpb24gcmVjb3JkO1xuICAgICAgdGhpcy5vbk1ldGFTdWIgPSBjYWxsYmFja3Mub25NZXRhU3ViO1xuICAgICAgLy8gQWxsIHN1YnNjcmlwdGlvbiByZWNvcmRzIHJlY2VpdmVkO1xuICAgICAgdGhpcy5vblN1YnNVcGRhdGVkID0gY2FsbGJhY2tzLm9uU3Vic1VwZGF0ZWQ7XG4gICAgICB0aGlzLm9uVGFnc1VwZGF0ZWQgPSBjYWxsYmFja3Mub25UYWdzVXBkYXRlZDtcbiAgICAgIHRoaXMub25DcmVkc1VwZGF0ZWQgPSBjYWxsYmFja3Mub25DcmVkc1VwZGF0ZWQ7XG4gICAgICB0aGlzLm9uRGVsZXRlVG9waWMgPSBjYWxsYmFja3Mub25EZWxldGVUb3BpYztcbiAgICAgIHRoaXMub25BbGxNZXNzYWdlc1JlY2VpdmVkID0gY2FsbGJhY2tzLm9uQWxsTWVzc2FnZXNSZWNlaXZlZDtcbiAgICB9XG4gIH1cblxuICAvLyBTdGF0aWMgbWV0aG9kcy5cblxuICAvKipcbiAgICogRGV0ZXJtaW5lIHRvcGljIHR5cGUgZnJvbSB0b3BpYydzIG5hbWU6IGdycCwgcDJwLCBtZSwgZm5kLCBzeXMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byB0ZXN0LlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBPbmUgb2YgPGNvZGU+XCJtZVwiPC9jb2RlPiwgPGNvZGU+XCJmbmRcIjwvY29kZT4sIDxjb2RlPlwic3lzXCI8L2NvZGU+LCA8Y29kZT5cImdycFwiPC9jb2RlPixcbiAgICogICAgPGNvZGU+XCJwMnBcIjwvY29kZT4gb3IgPGNvZGU+dW5kZWZpbmVkPC9jb2RlPi5cbiAgICovXG4gIHN0YXRpYyB0b3BpY1R5cGUobmFtZSkge1xuICAgIGNvbnN0IHR5cGVzID0ge1xuICAgICAgJ21lJzogQ29uc3QuVE9QSUNfTUUsXG4gICAgICAnZm5kJzogQ29uc3QuVE9QSUNfRk5ELFxuICAgICAgJ2dycCc6IENvbnN0LlRPUElDX0dSUCxcbiAgICAgICduZXcnOiBDb25zdC5UT1BJQ19HUlAsXG4gICAgICAnbmNoJzogQ29uc3QuVE9QSUNfR1JQLFxuICAgICAgJ2Nobic6IENvbnN0LlRPUElDX0dSUCxcbiAgICAgICd1c3InOiBDb25zdC5UT1BJQ19QMlAsXG4gICAgICAnc3lzJzogQ29uc3QuVE9QSUNfU1lTXG4gICAgfTtcbiAgICByZXR1cm4gdHlwZXNbKHR5cGVvZiBuYW1lID09ICdzdHJpbmcnKSA/IG5hbWUuc3Vic3RyaW5nKDAsIDMpIDogJ3h4eCddO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSBnaXZlbiB0b3BpYyBuYW1lIGlzIGEgbmFtZSBvZiBhICdtZScgdG9waWMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byB0ZXN0LlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgdGhlIG5hbWUgaXMgYSBuYW1lIG9mIGEgJ21lJyB0b3BpYywgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIHN0YXRpYyBpc01lVG9waWNOYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gVG9waWMudG9waWNUeXBlKG5hbWUpID09IENvbnN0LlRPUElDX01FO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSBnaXZlbiB0b3BpYyBuYW1lIGlzIGEgbmFtZSBvZiBhIGdyb3VwIHRvcGljLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gdGVzdC5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIHRoZSBuYW1lIGlzIGEgbmFtZSBvZiBhIGdyb3VwIHRvcGljLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgc3RhdGljIGlzR3JvdXBUb3BpY05hbWUobmFtZSkge1xuICAgIHJldHVybiBUb3BpYy50b3BpY1R5cGUobmFtZSkgPT0gQ29uc3QuVE9QSUNfR1JQO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSBnaXZlbiB0b3BpYyBuYW1lIGlzIGEgbmFtZSBvZiBhIHAycCB0b3BpYy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIHRlc3QuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0aGUgbmFtZSBpcyBhIG5hbWUgb2YgYSBwMnAgdG9waWMsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBzdGF0aWMgaXNQMlBUb3BpY05hbWUobmFtZSkge1xuICAgIHJldHVybiBUb3BpYy50b3BpY1R5cGUobmFtZSkgPT0gQ29uc3QuVE9QSUNfUDJQO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSBnaXZlbiB0b3BpYyBuYW1lIGlzIGEgbmFtZSBvZiBhIGNvbW11bmljYXRpb24gdG9waWMsIGkuZS4gUDJQIG9yIGdyb3VwLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gdGVzdC5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIHRoZSBuYW1lIGlzIGEgbmFtZSBvZiBhIHAycCBvciBncm91cCB0b3BpYywgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIHN0YXRpYyBpc0NvbW1Ub3BpY05hbWUobmFtZSkge1xuICAgIHJldHVybiBUb3BpYy5pc1AyUFRvcGljTmFtZShuYW1lKSB8fCBUb3BpYy5pc0dyb3VwVG9waWNOYW1lKG5hbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSB0b3BpYyBuYW1lIGlzIGEgbmFtZSBvZiBhIG5ldyB0b3BpYy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIHRvcGljIG5hbWUgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIHtib29sZWFufSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0aGUgbmFtZSBpcyBhIG5hbWUgb2YgYSBuZXcgdG9waWMsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBzdGF0aWMgaXNOZXdHcm91cFRvcGljTmFtZShuYW1lKSB7XG4gICAgcmV0dXJuICh0eXBlb2YgbmFtZSA9PSAnc3RyaW5nJykgJiZcbiAgICAgIChuYW1lLnN1YnN0cmluZygwLCAzKSA9PSBDb25zdC5UT1BJQ19ORVcgfHwgbmFtZS5zdWJzdHJpbmcoMCwgMykgPT0gQ29uc3QuVE9QSUNfTkVXX0NIQU4pO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSB0b3BpYyBuYW1lIGlzIGEgbmFtZSBvZiBhIGNoYW5uZWwuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSB0b3BpYyBuYW1lIHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgdGhlIG5hbWUgaXMgYSBuYW1lIG9mIGEgY2hhbm5lbCwgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIHN0YXRpYyBpc0NoYW5uZWxUb3BpY05hbWUobmFtZSkge1xuICAgIHJldHVybiAodHlwZW9mIG5hbWUgPT0gJ3N0cmluZycpICYmXG4gICAgICAobmFtZS5zdWJzdHJpbmcoMCwgMykgPT0gQ29uc3QuVE9QSUNfQ0hBTiB8fCBuYW1lLnN1YnN0cmluZygwLCAzKSA9PSBDb25zdC5UT1BJQ19ORVdfQ0hBTik7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgdGhlIHRvcGljIGlzIHN1YnNjcmliZWQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlzIHRvcGljIGlzIGF0dGFjaGVkL3N1YnNjcmliZWQsIGZhbHNlIG90aGVyd2lzZS5cbiAgICovXG4gIGlzU3Vic2NyaWJlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fYXR0YWNoZWQ7XG4gIH1cblxuICAvKipcbiAgICogUmVxdWVzdCB0b3BpYyB0byBzdWJzY3JpYmUuIFdyYXBwZXIgZm9yIHtAbGluayBUaW5vZGUjc3Vic2NyaWJlfS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtUaW5vZGUuR2V0UXVlcnk9fSBnZXRQYXJhbXMgLSBnZXQgcXVlcnkgcGFyYW1ldGVycy5cbiAgICogQHBhcmFtIHtUaW5vZGUuU2V0UGFyYW1zPX0gc2V0UGFyYW1zIC0gc2V0IHBhcmFtZXRlcnMuXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHRvIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIHNlcnZlciByZXNwb25kcyB0byB0aGUgcmVxdWVzdC5cbiAgICovXG4gIHN1YnNjcmliZShnZXRQYXJhbXMsIHNldFBhcmFtcykge1xuICAgIC8vIElmIHRoZSB0b3BpYyBpcyBhbHJlYWR5IHN1YnNjcmliZWQsIHJldHVybiByZXNvbHZlZCBwcm9taXNlXG4gICAgaWYgKHRoaXMuX2F0dGFjaGVkKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMpO1xuICAgIH1cblxuICAgIC8vIElmIHRoZSB0b3BpYyBpcyBkZWxldGVkLCByZWplY3Qgc3Vic2NyaXB0aW9uIHJlcXVlc3RzLlxuICAgIGlmICh0aGlzLl9kZWxldGVkKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiQ29udmVyc2F0aW9uIGRlbGV0ZWRcIikpO1xuICAgIH1cblxuICAgIC8vIFNlbmQgc3Vic2NyaWJlIG1lc3NhZ2UsIGhhbmRsZSBhc3luYyByZXNwb25zZS5cbiAgICAvLyBJZiB0b3BpYyBuYW1lIGlzIGV4cGxpY2l0bHkgcHJvdmlkZWQsIHVzZSBpdC4gSWYgbm8gbmFtZSwgdGhlbiBpdCdzIGEgbmV3IGdyb3VwIHRvcGljLFxuICAgIC8vIHVzZSBcIm5ld1wiLlxuICAgIHJldHVybiB0aGlzLl90aW5vZGUuc3Vic2NyaWJlKHRoaXMubmFtZSB8fCBDb25zdC5UT1BJQ19ORVcsIGdldFBhcmFtcywgc2V0UGFyYW1zKS50aGVuKChjdHJsKSA9PiB7XG4gICAgICBpZiAoY3RybC5jb2RlID49IDMwMCkge1xuICAgICAgICAvLyBEbyBub3RoaW5nIGlmIHN1YnNjcmlwdGlvbiBzdGF0dXMgaGFzIG5vdCBjaGFuZ2VkLlxuICAgICAgICByZXR1cm4gY3RybDtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fYXR0YWNoZWQgPSB0cnVlO1xuICAgICAgdGhpcy5fZGVsZXRlZCA9IGZhbHNlO1xuICAgICAgdGhpcy5hY3MgPSAoY3RybC5wYXJhbXMgJiYgY3RybC5wYXJhbXMuYWNzKSA/IGN0cmwucGFyYW1zLmFjcyA6IHRoaXMuYWNzO1xuXG4gICAgICAvLyBTZXQgdG9waWMgbmFtZSBmb3IgbmV3IHRvcGljcyBhbmQgYWRkIGl0IHRvIGNhY2hlLlxuICAgICAgaWYgKHRoaXMuX25ldykge1xuICAgICAgICBkZWxldGUgdGhpcy5fbmV3O1xuXG4gICAgICAgIGlmICh0aGlzLm5hbWUgIT0gY3RybC50b3BpYykge1xuICAgICAgICAgIC8vIE5hbWUgbWF5IGNoYW5nZSBuZXcxMjM0NTYgLT4gZ3JwQWJDZEVmLiBSZW1vdmUgZnJvbSBjYWNoZSB1bmRlciB0aGUgb2xkIG5hbWUuXG4gICAgICAgICAgdGhpcy5fY2FjaGVEZWxTZWxmKCk7XG4gICAgICAgICAgdGhpcy5uYW1lID0gY3RybC50b3BpYztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9jYWNoZVB1dFNlbGYoKTtcblxuICAgICAgICB0aGlzLmNyZWF0ZWQgPSBjdHJsLnRzO1xuICAgICAgICB0aGlzLnVwZGF0ZWQgPSBjdHJsLnRzO1xuXG4gICAgICAgIGlmICh0aGlzLm5hbWUgIT0gQ29uc3QuVE9QSUNfTUUgJiYgdGhpcy5uYW1lICE9IENvbnN0LlRPUElDX0ZORCkge1xuICAgICAgICAgIC8vIEFkZCB0aGUgbmV3IHRvcGljIHRvIHRoZSBsaXN0IG9mIGNvbnRhY3RzIG1haW50YWluZWQgYnkgdGhlICdtZScgdG9waWMuXG4gICAgICAgICAgY29uc3QgbWUgPSB0aGlzLl90aW5vZGUuZ2V0TWVUb3BpYygpO1xuICAgICAgICAgIGlmIChtZS5vbk1ldGFTdWIpIHtcbiAgICAgICAgICAgIG1lLm9uTWV0YVN1Yih0aGlzKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKG1lLm9uU3Vic1VwZGF0ZWQpIHtcbiAgICAgICAgICAgIG1lLm9uU3Vic1VwZGF0ZWQoW3RoaXMubmFtZV0sIDEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzZXRQYXJhbXMgJiYgc2V0UGFyYW1zLmRlc2MpIHtcbiAgICAgICAgICBzZXRQYXJhbXMuZGVzYy5fbm9Gb3J3YXJkaW5nID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLl9wcm9jZXNzTWV0YURlc2Moc2V0UGFyYW1zLmRlc2MpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gY3RybDtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBkcmFmdCBvZiBhIG1lc3NhZ2Ugd2l0aG91dCBzZW5kaW5nIGl0IHRvIHRoZSBzZXJ2ZXIuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nIHwgT2JqZWN0fSBkYXRhIC0gQ29udGVudCB0byB3cmFwIGluIGEgZHJhZnQuXG4gICAqIEBwYXJhbSB7Ym9vbGVhbj19IG5vRWNobyAtIElmIDxjb2RlPnRydWU8L2NvZGU+IHNlcnZlciB3aWxsIG5vdCBlY2hvIG1lc3NhZ2UgYmFjayB0byBvcmlnaW5hdGluZ1xuICAgKiBzZXNzaW9uLiBPdGhlcndpc2UgdGhlIHNlcnZlciB3aWxsIHNlbmQgYSBjb3B5IG9mIHRoZSBtZXNzYWdlIHRvIHNlbmRlci5cbiAgICpcbiAgICogQHJldHVybnMge09iamVjdH0gbWVzc2FnZSBkcmFmdC5cbiAgICovXG4gIGNyZWF0ZU1lc3NhZ2UoZGF0YSwgbm9FY2hvKSB7XG4gICAgcmV0dXJuIHRoaXMuX3Rpbm9kZS5jcmVhdGVNZXNzYWdlKHRoaXMubmFtZSwgZGF0YSwgbm9FY2hvKTtcbiAgfVxuICAvKipcbiAgICogSW1tZWRpYXRlbHkgcHVibGlzaCBkYXRhIHRvIHRvcGljLiBXcmFwcGVyIGZvciB7QGxpbmsgVGlub2RlI3B1Ymxpc2h9LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZyB8IE9iamVjdH0gZGF0YSAtIERhdGEgdG8gcHVibGlzaCwgZWl0aGVyIHBsYWluIHN0cmluZyBvciBhIERyYWZ0eSBvYmplY3QuXG4gICAqIEBwYXJhbSB7Ym9vbGVhbj19IG5vRWNobyAtIElmIDxjb2RlPnRydWU8L2NvZGU+IHNlcnZlciB3aWxsIG5vdCBlY2hvIG1lc3NhZ2UgYmFjayB0byBvcmlnaW5hdGluZ1xuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBzZXJ2ZXIgcmVzcG9uZHMgdG8gdGhlIHJlcXVlc3QuXG4gICAqL1xuICBwdWJsaXNoKGRhdGEsIG5vRWNobykge1xuICAgIHJldHVybiB0aGlzLnB1Ymxpc2hNZXNzYWdlKHRoaXMuY3JlYXRlTWVzc2FnZShkYXRhLCBub0VjaG8pKTtcbiAgfVxuICAvKipcbiAgICogUHVibGlzaCBtZXNzYWdlIGNyZWF0ZWQgYnkge0BsaW5rIFRpbm9kZS5Ub3BpYyNjcmVhdGVNZXNzYWdlfS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHB1YiAtIHtkYXRhfSBvYmplY3QgdG8gcHVibGlzaC4gTXVzdCBiZSBjcmVhdGVkIGJ5IHtAbGluayBUaW5vZGUuVG9waWMjY3JlYXRlTWVzc2FnZX1cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgdG8gYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgc2VydmVyIHJlc3BvbmRzIHRvIHRoZSByZXF1ZXN0LlxuICAgKi9cbiAgcHVibGlzaE1lc3NhZ2UocHViKSB7XG4gICAgaWYgKCF0aGlzLl9hdHRhY2hlZCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIkNhbm5vdCBwdWJsaXNoIG9uIGluYWN0aXZlIHRvcGljXCIpKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuX3NlbmRpbmcpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJUaGUgbWVzc2FnZSBpcyBhbHJlYWR5IGJlaW5nIHNlbnRcIikpO1xuICAgIH1cblxuICAgIC8vIFNlbmQgZGF0YS5cbiAgICBwdWIuX3NlbmRpbmcgPSB0cnVlO1xuICAgIHB1Yi5fZmFpbGVkID0gZmFsc2U7XG5cbiAgICAvLyBFeHRyYWN0IHJlZmVyZWNlcyB0byBhdHRhY2htZW50cyBhbmQgb3V0IG9mIGJhbmQgaW1hZ2UgcmVjb3Jkcy5cbiAgICBsZXQgYXR0YWNobWVudHMgPSBudWxsO1xuICAgIGlmIChEcmFmdHkuaGFzRW50aXRpZXMocHViLmNvbnRlbnQpKSB7XG4gICAgICBhdHRhY2htZW50cyA9IFtdO1xuICAgICAgRHJhZnR5LmVudGl0aWVzKHB1Yi5jb250ZW50LCAoZGF0YSkgPT4ge1xuICAgICAgICBpZiAoZGF0YSAmJiBkYXRhLnJlZikge1xuICAgICAgICAgIGF0dGFjaG1lbnRzLnB1c2goZGF0YS5yZWYpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGlmIChhdHRhY2htZW50cy5sZW5ndGggPT0gMCkge1xuICAgICAgICBhdHRhY2htZW50cyA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3Rpbm9kZS5wdWJsaXNoTWVzc2FnZShwdWIsIGF0dGFjaG1lbnRzKS50aGVuKChjdHJsKSA9PiB7XG4gICAgICBwdWIuX3NlbmRpbmcgPSBmYWxzZTtcbiAgICAgIHB1Yi50cyA9IGN0cmwudHM7XG4gICAgICB0aGlzLnN3YXBNZXNzYWdlSWQocHViLCBjdHJsLnBhcmFtcy5zZXEpO1xuICAgICAgdGhpcy5fcm91dGVEYXRhKHB1Yik7XG4gICAgICByZXR1cm4gY3RybDtcbiAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICB0aGlzLl90aW5vZGUubG9nZ2VyKFwiV0FSTklORzogTWVzc2FnZSByZWplY3RlZCBieSB0aGUgc2VydmVyXCIsIGVycik7XG4gICAgICBwdWIuX3NlbmRpbmcgPSBmYWxzZTtcbiAgICAgIHB1Yi5fZmFpbGVkID0gdHJ1ZTtcbiAgICAgIGlmICh0aGlzLm9uRGF0YSkge1xuICAgICAgICB0aGlzLm9uRGF0YSgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIC8qKlxuICAgKiBBZGQgbWVzc2FnZSB0byBsb2NhbCBtZXNzYWdlIGNhY2hlLCBzZW5kIHRvIHRoZSBzZXJ2ZXIgd2hlbiB0aGUgcHJvbWlzZSBpcyByZXNvbHZlZC5cbiAgICogSWYgcHJvbWlzZSBpcyBudWxsIG9yIHVuZGVmaW5lZCwgdGhlIG1lc3NhZ2Ugd2lsbCBiZSBzZW50IGltbWVkaWF0ZWx5LlxuICAgKiBUaGUgbWVzc2FnZSBpcyBzZW50IHdoZW4gdGhlXG4gICAqIFRoZSBtZXNzYWdlIHNob3VsZCBiZSBjcmVhdGVkIGJ5IHtAbGluayBUaW5vZGUuVG9waWMjY3JlYXRlTWVzc2FnZX0uXG4gICAqIFRoaXMgaXMgcHJvYmFibHkgbm90IHRoZSBmaW5hbCBBUEkuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwdWIgLSBNZXNzYWdlIHRvIHVzZSBhcyBhIGRyYWZ0LlxuICAgKiBAcGFyYW0ge1Byb21pc2V9IHByb20gLSBNZXNzYWdlIHdpbGwgYmUgc2VudCB3aGVuIHRoaXMgcHJvbWlzZSBpcyByZXNvbHZlZCwgZGlzY2FyZGVkIGlmIHJlamVjdGVkLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gZGVyaXZlZCBwcm9taXNlLlxuICAgKi9cbiAgcHVibGlzaERyYWZ0KHB1YiwgcHJvbSkge1xuICAgIGNvbnN0IHNlcSA9IHB1Yi5zZXEgfHwgdGhpcy5fZ2V0UXVldWVkU2VxSWQoKTtcbiAgICBpZiAoIXB1Yi5fbm9Gb3J3YXJkaW5nKSB7XG4gICAgICAvLyBUaGUgJ3NlcScsICd0cycsIGFuZCAnZnJvbScgYXJlIGFkZGVkIHRvIG1pbWljIHtkYXRhfS4gVGhleSBhcmUgcmVtb3ZlZCBsYXRlclxuICAgICAgLy8gYmVmb3JlIHRoZSBtZXNzYWdlIGlzIHNlbnQuXG4gICAgICBwdWIuX25vRm9yd2FyZGluZyA9IHRydWU7XG4gICAgICBwdWIuc2VxID0gc2VxO1xuICAgICAgcHViLnRzID0gbmV3IERhdGUoKTtcbiAgICAgIHB1Yi5mcm9tID0gdGhpcy5fdGlub2RlLmdldEN1cnJlbnRVc2VySUQoKTtcblxuICAgICAgLy8gRG9uJ3QgbmVlZCBhbiBlY2hvIG1lc3NhZ2UgYmVjYXVzZSB0aGUgbWVzc2FnZSBpcyBhZGRlZCB0byBsb2NhbCBjYWNoZSByaWdodCBhd2F5LlxuICAgICAgcHViLm5vZWNobyA9IHRydWU7XG4gICAgICAvLyBBZGQgdG8gY2FjaGUuXG4gICAgICB0aGlzLl9tZXNzYWdlcy5wdXQocHViKTtcbiAgICAgIHRoaXMuX3Rpbm9kZS5fZGIuYWRkTWVzc2FnZShwdWIpO1xuXG4gICAgICBpZiAodGhpcy5vbkRhdGEpIHtcbiAgICAgICAgdGhpcy5vbkRhdGEocHViKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gSWYgcHJvbWlzZSBpcyBwcm92aWRlZCwgc2VuZCB0aGUgcXVldWVkIG1lc3NhZ2Ugd2hlbiBpdCdzIHJlc29sdmVkLlxuICAgIC8vIElmIG5vIHByb21pc2UgaXMgcHJvdmlkZWQsIGNyZWF0ZSBhIHJlc29sdmVkIG9uZSBhbmQgc2VuZCBpbW1lZGlhdGVseS5cbiAgICByZXR1cm4gKHByb20gfHwgUHJvbWlzZS5yZXNvbHZlKCkpXG4gICAgICAudGhlbihfID0+IHtcbiAgICAgICAgaWYgKHB1Yi5fY2FuY2VsbGVkKSB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNvZGU6IDMwMCxcbiAgICAgICAgICAgIHRleHQ6IFwiY2FuY2VsbGVkXCJcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnB1Ymxpc2hNZXNzYWdlKHB1Yik7XG4gICAgICB9KS5jYXRjaChlcnIgPT4ge1xuICAgICAgICB0aGlzLl90aW5vZGUubG9nZ2VyKFwiV0FSTklORzogTWVzc2FnZSBkcmFmdCByZWplY3RlZFwiLCBlcnIpO1xuICAgICAgICBwdWIuX3NlbmRpbmcgPSBmYWxzZTtcbiAgICAgICAgcHViLl9mYWlsZWQgPSB0cnVlO1xuICAgICAgICBpZiAodGhpcy5vbkRhdGEpIHtcbiAgICAgICAgICB0aGlzLm9uRGF0YSgpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFJldGhyb3cgdG8gbGV0IGNhbGxlciBrbm93IHRoYXQgdGhlIG9wZXJhdGlvbiBmYWlsZWQuXG4gICAgICAgIHRocm93IGVycjtcbiAgICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIExlYXZlIHRoZSB0b3BpYywgb3B0aW9uYWxseSB1bnNpYnNjcmliZS4gTGVhdmluZyB0aGUgdG9waWMgbWVhbnMgdGhlIHRvcGljIHdpbGwgc3RvcFxuICAgKiByZWNlaXZpbmcgdXBkYXRlcyBmcm9tIHRoZSBzZXJ2ZXIuIFVuc3Vic2NyaWJpbmcgd2lsbCB0ZXJtaW5hdGUgdXNlcidzIHJlbGF0aW9uc2hpcCB3aXRoIHRoZSB0b3BpYy5cbiAgICogV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNsZWF2ZX0uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbj19IHVuc3ViIC0gSWYgdHJ1ZSwgdW5zdWJzY3JpYmUsIG90aGVyd2lzZSBqdXN0IGxlYXZlLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBzZXJ2ZXIgcmVzcG9uZHMgdG8gdGhlIHJlcXVlc3QuXG4gICAqL1xuICBsZWF2ZSh1bnN1Yikge1xuICAgIC8vIEl0J3MgcG9zc2libGUgdG8gdW5zdWJzY3JpYmUgKHVuc3ViPT10cnVlKSBmcm9tIGluYWN0aXZlIHRvcGljLlxuICAgIGlmICghdGhpcy5fYXR0YWNoZWQgJiYgIXVuc3ViKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiQ2Fubm90IGxlYXZlIGluYWN0aXZlIHRvcGljXCIpKTtcbiAgICB9XG5cbiAgICAvLyBTZW5kIGEgJ2xlYXZlJyBtZXNzYWdlLCBoYW5kbGUgYXN5bmMgcmVzcG9uc2VcbiAgICByZXR1cm4gdGhpcy5fdGlub2RlLmxlYXZlKHRoaXMubmFtZSwgdW5zdWIpLnRoZW4oKGN0cmwpID0+IHtcbiAgICAgIHRoaXMuX3Jlc2V0U3ViKCk7XG4gICAgICBpZiAodW5zdWIpIHtcbiAgICAgICAgdGhpcy5fZ29uZSgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGN0cmw7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmVxdWVzdCB0b3BpYyBtZXRhZGF0YSBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7VGlub2RlLkdldFF1ZXJ5fSByZXF1ZXN0IHBhcmFtZXRlcnNcbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgdG8gYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgc2VydmVyIHJlc3BvbmRzIHRvIHJlcXVlc3QuXG4gICAqL1xuICBnZXRNZXRhKHBhcmFtcykge1xuICAgIC8vIFNlbmQge2dldH0gbWVzc2FnZSwgcmV0dXJuIHByb21pc2UuXG4gICAgcmV0dXJuIHRoaXMuX3Rpbm9kZS5nZXRNZXRhKHRoaXMubmFtZSwgcGFyYW1zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXF1ZXN0IG1vcmUgbWVzc2FnZXMgZnJvbSB0aGUgc2VydmVyXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBsaW1pdCBudW1iZXIgb2YgbWVzc2FnZXMgdG8gZ2V0LlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGZvcndhcmQgaWYgdHJ1ZSwgcmVxdWVzdCBuZXdlciBtZXNzYWdlcy5cbiAgICovXG4gIGdldE1lc3NhZ2VzUGFnZShsaW1pdCwgZm9yd2FyZCkge1xuICAgIGxldCBxdWVyeSA9IGZvcndhcmQgP1xuICAgICAgdGhpcy5zdGFydE1ldGFRdWVyeSgpLndpdGhMYXRlckRhdGEobGltaXQpIDpcbiAgICAgIHRoaXMuc3RhcnRNZXRhUXVlcnkoKS53aXRoRWFybGllckRhdGEobGltaXQpO1xuXG4gICAgLy8gRmlyc3QgdHJ5IGZldGNoaW5nIGZyb20gREIsIHRoZW4gZnJvbSB0aGUgc2VydmVyLlxuICAgIHJldHVybiB0aGlzLl9sb2FkTWVzc2FnZXModGhpcy5fdGlub2RlLl9kYiwgcXVlcnkuZXh0cmFjdCgnZGF0YScpKVxuICAgICAgLnRoZW4oKGNvdW50KSA9PiB7XG4gICAgICAgIGlmIChjb3VudCA9PSBsaW1pdCkge1xuICAgICAgICAgIC8vIEdvdCBlbm91Z2ggbWVzc2FnZXMgZnJvbSBsb2NhbCBjYWNoZS5cbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHtcbiAgICAgICAgICAgIHRvcGljOiB0aGlzLm5hbWUsXG4gICAgICAgICAgICBjb2RlOiAyMDAsXG4gICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgY291bnQ6IGNvdW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZWR1Y2UgdGhlIGNvdW50IG9mIHJlcXVlc3RlZCBtZXNzYWdlcy5cbiAgICAgICAgbGltaXQgLT0gY291bnQ7XG4gICAgICAgIC8vIFVwZGF0ZSBxdWVyeSB3aXRoIG5ldyB2YWx1ZXMgbG9hZGVkIGZyb20gREIuXG4gICAgICAgIHF1ZXJ5ID0gZm9yd2FyZCA/IHRoaXMuc3RhcnRNZXRhUXVlcnkoKS53aXRoTGF0ZXJEYXRhKGxpbWl0KSA6XG4gICAgICAgICAgdGhpcy5zdGFydE1ldGFRdWVyeSgpLndpdGhFYXJsaWVyRGF0YShsaW1pdCk7XG4gICAgICAgIGxldCBwcm9taXNlID0gdGhpcy5nZXRNZXRhKHF1ZXJ5LmJ1aWxkKCkpO1xuICAgICAgICBpZiAoIWZvcndhcmQpIHtcbiAgICAgICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKChjdHJsKSA9PiB7XG4gICAgICAgICAgICBpZiAoY3RybCAmJiBjdHJsLnBhcmFtcyAmJiAhY3RybC5wYXJhbXMuY291bnQpIHtcbiAgICAgICAgICAgICAgdGhpcy5fbm9FYXJsaWVyTXNncyA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICB9KTtcbiAgfVxuICAvKipcbiAgICogVXBkYXRlIHRvcGljIG1ldGFkYXRhLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge1Rpbm9kZS5TZXRQYXJhbXN9IHBhcmFtcyBwYXJhbWV0ZXJzIHRvIHVwZGF0ZS5cbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgdG8gYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgc2VydmVyIHJlc3BvbmRzIHRvIHJlcXVlc3QuXG4gICAqL1xuICBzZXRNZXRhKHBhcmFtcykge1xuICAgIGlmIChwYXJhbXMudGFncykge1xuICAgICAgcGFyYW1zLnRhZ3MgPSBub3JtYWxpemVBcnJheShwYXJhbXMudGFncyk7XG4gICAgfVxuICAgIC8vIFNlbmQgU2V0IG1lc3NhZ2UsIGhhbmRsZSBhc3luYyByZXNwb25zZS5cbiAgICByZXR1cm4gdGhpcy5fdGlub2RlLnNldE1ldGEodGhpcy5uYW1lLCBwYXJhbXMpXG4gICAgICAudGhlbigoY3RybCkgPT4ge1xuICAgICAgICBpZiAoY3RybCAmJiBjdHJsLmNvZGUgPj0gMzAwKSB7XG4gICAgICAgICAgLy8gTm90IG1vZGlmaWVkXG4gICAgICAgICAgcmV0dXJuIGN0cmw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocGFyYW1zLnN1Yikge1xuICAgICAgICAgIHBhcmFtcy5zdWIudG9waWMgPSB0aGlzLm5hbWU7XG4gICAgICAgICAgaWYgKGN0cmwucGFyYW1zICYmIGN0cmwucGFyYW1zLmFjcykge1xuICAgICAgICAgICAgcGFyYW1zLnN1Yi5hY3MgPSBjdHJsLnBhcmFtcy5hY3M7XG4gICAgICAgICAgICBwYXJhbXMuc3ViLnVwZGF0ZWQgPSBjdHJsLnRzO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoIXBhcmFtcy5zdWIudXNlcikge1xuICAgICAgICAgICAgLy8gVGhpcyBpcyBhIHN1YnNjcmlwdGlvbiB1cGRhdGUgb2YgdGhlIGN1cnJlbnQgdXNlci5cbiAgICAgICAgICAgIC8vIEFzc2lnbiB1c2VyIElEIG90aGVyd2lzZSB0aGUgdXBkYXRlIHdpbGwgYmUgaWdub3JlZCBieSBfcHJvY2Vzc01ldGFTdWIuXG4gICAgICAgICAgICBwYXJhbXMuc3ViLnVzZXIgPSB0aGlzLl90aW5vZGUuZ2V0Q3VycmVudFVzZXJJRCgpO1xuICAgICAgICAgICAgaWYgKCFwYXJhbXMuZGVzYykge1xuICAgICAgICAgICAgICAvLyBGb3JjZSB1cGRhdGUgdG8gdG9waWMncyBhc2MuXG4gICAgICAgICAgICAgIHBhcmFtcy5kZXNjID0ge307XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHBhcmFtcy5zdWIuX25vRm9yd2FyZGluZyA9IHRydWU7XG4gICAgICAgICAgdGhpcy5fcHJvY2Vzc01ldGFTdWIoW3BhcmFtcy5zdWJdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwYXJhbXMuZGVzYykge1xuICAgICAgICAgIGlmIChjdHJsLnBhcmFtcyAmJiBjdHJsLnBhcmFtcy5hY3MpIHtcbiAgICAgICAgICAgIHBhcmFtcy5kZXNjLmFjcyA9IGN0cmwucGFyYW1zLmFjcztcbiAgICAgICAgICAgIHBhcmFtcy5kZXNjLnVwZGF0ZWQgPSBjdHJsLnRzO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLl9wcm9jZXNzTWV0YURlc2MocGFyYW1zLmRlc2MpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHBhcmFtcy50YWdzKSB7XG4gICAgICAgICAgdGhpcy5fcHJvY2Vzc01ldGFUYWdzKHBhcmFtcy50YWdzKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocGFyYW1zLmNyZWQpIHtcbiAgICAgICAgICB0aGlzLl9wcm9jZXNzTWV0YUNyZWRzKFtwYXJhbXMuY3JlZF0sIHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGN0cmw7XG4gICAgICB9KTtcbiAgfVxuICAvKipcbiAgICogVXBkYXRlIGFjY2VzcyBtb2RlIG9mIHRoZSBjdXJyZW50IHVzZXIgb3Igb2YgYW5vdGhlciB0b3BpYyBzdWJzcmliZXIuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1aWQgLSBVSUQgb2YgdGhlIHVzZXIgdG8gdXBkYXRlIG9yIG51bGwgdG8gdXBkYXRlIGN1cnJlbnQgdXNlci5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHVwZGF0ZSAtIHRoZSB1cGRhdGUgdmFsdWUsIGZ1bGwgb3IgZGVsdGEuXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHRvIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIHNlcnZlciByZXNwb25kcyB0byByZXF1ZXN0LlxuICAgKi9cbiAgdXBkYXRlTW9kZSh1aWQsIHVwZGF0ZSkge1xuICAgIGNvbnN0IHVzZXIgPSB1aWQgPyB0aGlzLnN1YnNjcmliZXIodWlkKSA6IG51bGw7XG4gICAgY29uc3QgYW0gPSB1c2VyID9cbiAgICAgIHVzZXIuYWNzLnVwZGF0ZUdpdmVuKHVwZGF0ZSkuZ2V0R2l2ZW4oKSA6XG4gICAgICB0aGlzLmdldEFjY2Vzc01vZGUoKS51cGRhdGVXYW50KHVwZGF0ZSkuZ2V0V2FudCgpO1xuXG4gICAgcmV0dXJuIHRoaXMuc2V0TWV0YSh7XG4gICAgICBzdWI6IHtcbiAgICAgICAgdXNlcjogdWlkLFxuICAgICAgICBtb2RlOiBhbVxuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIC8qKlxuICAgKiBDcmVhdGUgbmV3IHRvcGljIHN1YnNjcmlwdGlvbi4gV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNzZXRNZXRhfS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVpZCAtIElEIG9mIHRoZSB1c2VyIHRvIGludml0ZVxuICAgKiBAcGFyYW0ge3N0cmluZz19IG1vZGUgLSBBY2Nlc3MgbW9kZS4gPGNvZGU+bnVsbDwvY29kZT4gbWVhbnMgdG8gdXNlIGRlZmF1bHQuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHRvIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIHNlcnZlciByZXNwb25kcyB0byByZXF1ZXN0LlxuICAgKi9cbiAgaW52aXRlKHVpZCwgbW9kZSkge1xuICAgIHJldHVybiB0aGlzLnNldE1ldGEoe1xuICAgICAgc3ViOiB7XG4gICAgICAgIHVzZXI6IHVpZCxcbiAgICAgICAgbW9kZTogbW9kZVxuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIC8qKlxuICAgKiBBcmNoaXZlIG9yIHVuLWFyY2hpdmUgdGhlIHRvcGljLiBXcmFwcGVyIGZvciB7QGxpbmsgVGlub2RlI3NldE1ldGF9LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGFyY2ggLSB0cnVlIHRvIGFyY2hpdmUgdGhlIHRvcGljLCBmYWxzZSBvdGhlcndpc2UuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHRvIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIHNlcnZlciByZXNwb25kcyB0byByZXF1ZXN0LlxuICAgKi9cbiAgYXJjaGl2ZShhcmNoKSB7XG4gICAgaWYgKHRoaXMucHJpdmF0ZSAmJiAoIXRoaXMucHJpdmF0ZS5hcmNoID09ICFhcmNoKSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShhcmNoKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc2V0TWV0YSh7XG4gICAgICBkZXNjOiB7XG4gICAgICAgIHByaXZhdGU6IHtcbiAgICAgICAgICBhcmNoOiBhcmNoID8gdHJ1ZSA6IENvbnN0LkRFTF9DSEFSXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICAvKipcbiAgICogRGVsZXRlIG1lc3NhZ2VzLiBIYXJkLWRlbGV0aW5nIG1lc3NhZ2VzIHJlcXVpcmVzIE93bmVyIHBlcm1pc3Npb24uXG4gICAqIFdyYXBwZXIgZm9yIHtAbGluayBUaW5vZGUjZGVsTWVzc2FnZXN9LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge1Rpbm9kZS5EZWxSYW5nZVtdfSByYW5nZXMgLSBSYW5nZXMgb2YgbWVzc2FnZSBJRHMgdG8gZGVsZXRlLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBoYXJkIC0gSGFyZCBvciBzb2Z0IGRlbGV0ZVxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBzZXJ2ZXIgcmVzcG9uZHMgdG8gcmVxdWVzdC5cbiAgICovXG4gIGRlbE1lc3NhZ2VzKHJhbmdlcywgaGFyZCkge1xuICAgIGlmICghdGhpcy5fYXR0YWNoZWQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJDYW5ub3QgZGVsZXRlIG1lc3NhZ2VzIGluIGluYWN0aXZlIHRvcGljXCIpKTtcbiAgICB9XG5cbiAgICAvLyBTb3J0IHJhbmdlcyBpbiBhY2NlbmRpbmcgb3JkZXIgYnkgbG93LCB0aGUgZGVzY2VuZGluZyBieSBoaS5cbiAgICByYW5nZXMuc29ydCgocjEsIHIyKSA9PiB7XG4gICAgICBpZiAocjEubG93IDwgcjIubG93KSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgaWYgKHIxLmxvdyA9PSByMi5sb3cpIHtcbiAgICAgICAgcmV0dXJuICFyMi5oaSB8fCAocjEuaGkgPj0gcjIuaGkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0pO1xuXG4gICAgLy8gUmVtb3ZlIHBlbmRpbmcgbWVzc2FnZXMgZnJvbSByYW5nZXMgcG9zc2libHkgY2xpcHBpbmcgc29tZSByYW5nZXMuXG4gICAgbGV0IHRvc2VuZCA9IHJhbmdlcy5yZWR1Y2UoKG91dCwgcikgPT4ge1xuICAgICAgaWYgKHIubG93IDwgQ29uc3QuTE9DQUxfU0VRSUQpIHtcbiAgICAgICAgaWYgKCFyLmhpIHx8IHIuaGkgPCBDb25zdC5MT0NBTF9TRVFJRCkge1xuICAgICAgICAgIG91dC5wdXNoKHIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIENsaXAgaGkgdG8gbWF4IGFsbG93ZWQgdmFsdWUuXG4gICAgICAgICAgb3V0LnB1c2goe1xuICAgICAgICAgICAgbG93OiByLmxvdyxcbiAgICAgICAgICAgIGhpOiB0aGlzLl9tYXhTZXEgKyAxXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBvdXQ7XG4gICAgfSwgW10pO1xuXG4gICAgLy8gU2VuZCB7ZGVsfSBtZXNzYWdlLCByZXR1cm4gcHJvbWlzZVxuICAgIGxldCByZXN1bHQ7XG4gICAgaWYgKHRvc2VuZC5sZW5ndGggPiAwKSB7XG4gICAgICByZXN1bHQgPSB0aGlzLl90aW5vZGUuZGVsTWVzc2FnZXModGhpcy5uYW1lLCB0b3NlbmQsIGhhcmQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHQgPSBQcm9taXNlLnJlc29sdmUoe1xuICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICBkZWw6IDBcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIC8vIFVwZGF0ZSBsb2NhbCBjYWNoZS5cbiAgICByZXR1cm4gcmVzdWx0LnRoZW4oKGN0cmwpID0+IHtcbiAgICAgIGlmIChjdHJsLnBhcmFtcy5kZWwgPiB0aGlzLl9tYXhEZWwpIHtcbiAgICAgICAgdGhpcy5fbWF4RGVsID0gY3RybC5wYXJhbXMuZGVsO1xuICAgICAgfVxuXG4gICAgICByYW5nZXMuZm9yRWFjaCgocikgPT4ge1xuICAgICAgICBpZiAoci5oaSkge1xuICAgICAgICAgIHRoaXMuZmx1c2hNZXNzYWdlUmFuZ2Uoci5sb3csIHIuaGkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuZmx1c2hNZXNzYWdlKHIubG93KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuX3VwZGF0ZURlbGV0ZWRSYW5nZXMoKTtcblxuICAgICAgaWYgKHRoaXMub25EYXRhKSB7XG4gICAgICAgIC8vIENhbGxpbmcgd2l0aCBubyBwYXJhbWV0ZXJzIHRvIGluZGljYXRlIHRoZSBtZXNzYWdlcyB3ZXJlIGRlbGV0ZWQuXG4gICAgICAgIHRoaXMub25EYXRhKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY3RybDtcbiAgICB9KTtcbiAgfVxuICAvKipcbiAgICogRGVsZXRlIGFsbCBtZXNzYWdlcy4gSGFyZC1kZWxldGluZyBtZXNzYWdlcyByZXF1aXJlcyBPd25lciBwZXJtaXNzaW9uLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGhhcmREZWwgLSB0cnVlIGlmIG1lc3NhZ2VzIHNob3VsZCBiZSBoYXJkLWRlbGV0ZWQuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHRvIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIHNlcnZlciByZXNwb25kcyB0byByZXF1ZXN0LlxuICAgKi9cbiAgZGVsTWVzc2FnZXNBbGwoaGFyZERlbCkge1xuICAgIGlmICghdGhpcy5fbWF4U2VxIHx8IHRoaXMuX21heFNlcSA8PSAwKSB7XG4gICAgICAvLyBUaGVyZSBhcmUgbm8gbWVzc2FnZXMgdG8gZGVsZXRlLlxuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5kZWxNZXNzYWdlcyhbe1xuICAgICAgbG93OiAxLFxuICAgICAgaGk6IHRoaXMuX21heFNlcSArIDEsXG4gICAgICBfYWxsOiB0cnVlXG4gICAgfV0sIGhhcmREZWwpO1xuICB9XG4gIC8qKlxuICAgKiBEZWxldGUgbXVsdGlwbGUgbWVzc2FnZXMgZGVmaW5lZCBieSB0aGVpciBJRHMuIEhhcmQtZGVsZXRpbmcgbWVzc2FnZXMgcmVxdWlyZXMgT3duZXIgcGVybWlzc2lvbi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtUaW5vZGUuRGVsUmFuZ2VbXX0gbGlzdCAtIGxpc3Qgb2Ygc2VxIElEcyB0byBkZWxldGVcbiAgICogQHBhcmFtIHtib29sZWFuPX0gaGFyZERlbCAtIHRydWUgaWYgbWVzc2FnZXMgc2hvdWxkIGJlIGhhcmQtZGVsZXRlZC5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgdG8gYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgc2VydmVyIHJlc3BvbmRzIHRvIHJlcXVlc3QuXG4gICAqL1xuICBkZWxNZXNzYWdlc0xpc3QobGlzdCwgaGFyZERlbCkge1xuICAgIC8vIFNvcnQgdGhlIGxpc3QgaW4gYXNjZW5kaW5nIG9yZGVyXG4gICAgbGlzdC5zb3J0KChhLCBiKSA9PiBhIC0gYik7XG4gICAgLy8gQ29udmVydCB0aGUgYXJyYXkgb2YgSURzIHRvIHJhbmdlcy5cbiAgICBsZXQgcmFuZ2VzID0gbGlzdC5yZWR1Y2UoKG91dCwgaWQpID0+IHtcbiAgICAgIGlmIChvdXQubGVuZ3RoID09IDApIHtcbiAgICAgICAgLy8gRmlyc3QgZWxlbWVudC5cbiAgICAgICAgb3V0LnB1c2goe1xuICAgICAgICAgIGxvdzogaWRcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgcHJldiA9IG91dFtvdXQubGVuZ3RoIC0gMV07XG4gICAgICAgIGlmICgoIXByZXYuaGkgJiYgKGlkICE9IHByZXYubG93ICsgMSkpIHx8IChpZCA+IHByZXYuaGkpKSB7XG4gICAgICAgICAgLy8gTmV3IHJhbmdlLlxuICAgICAgICAgIG91dC5wdXNoKHtcbiAgICAgICAgICAgIGxvdzogaWRcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBFeHBhbmQgZXhpc3RpbmcgcmFuZ2UuXG4gICAgICAgICAgcHJldi5oaSA9IHByZXYuaGkgPyBNYXRoLm1heChwcmV2LmhpLCBpZCArIDEpIDogaWQgKyAxO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gb3V0O1xuICAgIH0sIFtdKTtcbiAgICAvLyBTZW5kIHtkZWx9IG1lc3NhZ2UsIHJldHVybiBwcm9taXNlXG4gICAgcmV0dXJuIHRoaXMuZGVsTWVzc2FnZXMocmFuZ2VzLCBoYXJkRGVsKTtcbiAgfVxuICAvKipcbiAgICogRGVsZXRlIHRvcGljLiBSZXF1aXJlcyBPd25lciBwZXJtaXNzaW9uLiBXcmFwcGVyIGZvciB7QGxpbmsgVGlub2RlI2RlbFRvcGljfS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSBoYXJkIC0gaGFkLWRlbGV0ZSB0b3BpYy5cbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgdG8gYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgc2VydmVyIHJlc3BvbmRzIHRvIHRoZSByZXF1ZXN0LlxuICAgKi9cbiAgZGVsVG9waWMoaGFyZCkge1xuICAgIGlmICh0aGlzLl9kZWxldGVkKSB7XG4gICAgICAvLyBUaGUgdG9waWMgaXMgYWxyZWFkeSBkZWxldGVkIGF0IHRoZSBzZXJ2ZXIsIGp1c3QgcmVtb3ZlIGZyb20gREIuXG4gICAgICB0aGlzLl9nb25lKCk7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG51bGwpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl90aW5vZGUuZGVsVG9waWModGhpcy5uYW1lLCBoYXJkKS50aGVuKChjdHJsKSA9PiB7XG4gICAgICB0aGlzLl9kZWxldGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMuX3Jlc2V0U3ViKCk7XG4gICAgICB0aGlzLl9nb25lKCk7XG4gICAgICByZXR1cm4gY3RybDtcbiAgICB9KTtcbiAgfVxuICAvKipcbiAgICogRGVsZXRlIHN1YnNjcmlwdGlvbi4gUmVxdWlyZXMgU2hhcmUgcGVybWlzc2lvbi4gV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNkZWxTdWJzY3JpcHRpb259LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdXNlciAtIElEIG9mIHRoZSB1c2VyIHRvIHJlbW92ZSBzdWJzY3JpcHRpb24gZm9yLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBzZXJ2ZXIgcmVzcG9uZHMgdG8gcmVxdWVzdC5cbiAgICovXG4gIGRlbFN1YnNjcmlwdGlvbih1c2VyKSB7XG4gICAgaWYgKCF0aGlzLl9hdHRhY2hlZCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIkNhbm5vdCBkZWxldGUgc3Vic2NyaXB0aW9uIGluIGluYWN0aXZlIHRvcGljXCIpKTtcbiAgICB9XG4gICAgLy8gU2VuZCB7ZGVsfSBtZXNzYWdlLCByZXR1cm4gcHJvbWlzZVxuICAgIHJldHVybiB0aGlzLl90aW5vZGUuZGVsU3Vic2NyaXB0aW9uKHRoaXMubmFtZSwgdXNlcikudGhlbigoY3RybCkgPT4ge1xuICAgICAgLy8gUmVtb3ZlIHRoZSBvYmplY3QgZnJvbSB0aGUgc3Vic2NyaXB0aW9uIGNhY2hlO1xuICAgICAgZGVsZXRlIHRoaXMuX3VzZXJzW3VzZXJdO1xuICAgICAgLy8gTm90aWZ5IGxpc3RlbmVyc1xuICAgICAgaWYgKHRoaXMub25TdWJzVXBkYXRlZCkge1xuICAgICAgICB0aGlzLm9uU3Vic1VwZGF0ZWQoT2JqZWN0LmtleXModGhpcy5fdXNlcnMpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjdHJsO1xuICAgIH0pO1xuICB9XG4gIC8qKlxuICAgKiBTZW5kIGEgcmVhZC9yZWN2IG5vdGlmaWNhdGlvbi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHdoYXQgLSB3aGF0IG5vdGlmaWNhdGlvbiB0byBzZW5kOiA8Y29kZT5yZWN2PC9jb2RlPiwgPGNvZGU+cmVhZDwvY29kZT4uXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzZXEgLSBJRCBvciB0aGUgbWVzc2FnZSByZWFkIG9yIHJlY2VpdmVkLlxuICAgKi9cbiAgbm90ZSh3aGF0LCBzZXEpIHtcbiAgICBpZiAoIXRoaXMuX2F0dGFjaGVkKSB7XG4gICAgICAvLyBDYW5ub3Qgc2VuZGluZyB7bm90ZX0gb24gYW4gaW5hY3RpdmUgdG9waWNcIi5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBVcGRhdGUgbG9jYWwgY2FjaGUgd2l0aCB0aGUgbmV3IGNvdW50LlxuICAgIGNvbnN0IHVzZXIgPSB0aGlzLl91c2Vyc1t0aGlzLl90aW5vZGUuZ2V0Q3VycmVudFVzZXJJRCgpXTtcbiAgICBsZXQgdXBkYXRlID0gZmFsc2U7XG4gICAgaWYgKHVzZXIpIHtcbiAgICAgIC8vIFNlbGYtc3Vic2NyaXB0aW9uIGlzIGZvdW5kLlxuICAgICAgaWYgKCF1c2VyW3doYXRdIHx8IHVzZXJbd2hhdF0gPCBzZXEpIHtcbiAgICAgICAgdXNlclt3aGF0XSA9IHNlcTtcbiAgICAgICAgdXBkYXRlID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gU2VsZi1zdWJzY3JpcHRpb24gaXMgbm90IGZvdW5kLlxuICAgICAgdXBkYXRlID0gKHRoaXNbd2hhdF0gfCAwKSA8IHNlcTtcbiAgICB9XG5cbiAgICBpZiAodXBkYXRlKSB7XG4gICAgICAvLyBTZW5kIG5vdGlmaWNhdGlvbiB0byB0aGUgc2VydmVyLlxuICAgICAgdGhpcy5fdGlub2RlLm5vdGUodGhpcy5uYW1lLCB3aGF0LCBzZXEpO1xuICAgICAgLy8gVXBkYXRlIGxvY2FsbHkgY2FjaGVkIGNvbnRhY3Qgd2l0aCB0aGUgbmV3IGNvdW50LlxuICAgICAgdGhpcy5fdXBkYXRlUmVhZFJlY3Yod2hhdCwgc2VxKTtcblxuICAgICAgaWYgKHRoaXMuYWNzICE9IG51bGwgJiYgIXRoaXMuYWNzLmlzTXV0ZWQoKSkge1xuICAgICAgICBjb25zdCBtZSA9IHRoaXMuX3Rpbm9kZS5nZXRNZVRvcGljKCk7XG4gICAgICAgIC8vIFNlbnQgYSBub3RpZmljYXRpb24gdG8gJ21lJyBsaXN0ZW5lcnMuXG4gICAgICAgIG1lLl9yZWZyZXNoQ29udGFjdCh3aGF0LCB0aGlzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2VuZCBhIHtub3RlIHdoYXQ9J2NhbGwnfS4gV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSN2aWRlb0NhbGx9LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXZ0IC0gQ2FsbCBldmVudC5cbiAgICogQHBhcmFtIHtpbnR9IHNlcSAtIElEIG9mIHRoZSBjYWxsIG1lc3NhZ2UgdGhlIGV2ZW50IHBlcnRhaW5zIHRvLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGF5bG9hZCAtIFBheWxvYWQgYXNzb2NpYXRlZCB3aXRoIHRoaXMgZXZlbnQgKGUuZy4gU0RQIHN0cmluZykuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIChmb3Igc29tZSBjYWxsIGV2ZW50cykgd2hpY2ggd2lsbFxuICAgKiAgICAgICAgICAgICAgICAgICAgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gcmVjZWl2aW5nIHNlcnZlciByZXBseVxuICAgKi9cbiAgdmlkZW9DYWxsKGV2dCwgc2VxLCBwYXlsb2FkKSB7XG4gICAgaWYgKCF0aGlzLl9hdHRhY2hlZCAmJiAhWydyaW5naW5nJywgJ2hhbmctdXAnXS5pbmNsdWRlcyhldnQpKSB7XG4gICAgICAvLyBDYW5ub3Qge2NhbGx9IG9uIGFuIGluYWN0aXZlIHRvcGljXCIuXG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl90aW5vZGUudmlkZW9DYWxsKHRoaXMubmFtZSwgc2VxLCBldnQsIHBheWxvYWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgYSAncmVjdicgcmVjZWlwdC4gV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNub3RlUmVjdn0uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzZXEgLSBJRCBvZiB0aGUgbWVzc2FnZSB0byBha25vd2xlZGdlLlxuICAgKi9cbiAgbm90ZVJlY3Yoc2VxKSB7XG4gICAgdGhpcy5ub3RlKCdyZWN2Jywgc2VxKTtcbiAgfVxuICAvKipcbiAgICogU2VuZCBhICdyZWFkJyByZWNlaXB0LiBXcmFwcGVyIGZvciB7QGxpbmsgVGlub2RlI25vdGVSZWFkfS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IHNlcSAtIElEIG9mIHRoZSBtZXNzYWdlIHRvIGFrbm93bGVkZ2Ugb3IgMC91bmRlZmluZWQgdG8gYWNrbm93bGVkZ2UgdGhlIGxhdGVzdCBtZXNzYWdlcy5cbiAgICovXG4gIG5vdGVSZWFkKHNlcSkge1xuICAgIHNlcSA9IHNlcSB8fCB0aGlzLl9tYXhTZXE7XG4gICAgaWYgKHNlcSA+IDApIHtcbiAgICAgIHRoaXMubm90ZSgncmVhZCcsIHNlcSk7XG4gICAgfVxuICB9XG4gIC8qKlxuICAgKiBTZW5kIGEga2V5LXByZXNzIG5vdGlmaWNhdGlvbi4gV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNub3RlS2V5UHJlc3N9LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKi9cbiAgbm90ZUtleVByZXNzKCkge1xuICAgIGlmICh0aGlzLl9hdHRhY2hlZCkge1xuICAgICAgdGhpcy5fdGlub2RlLm5vdGVLZXlQcmVzcyh0aGlzLm5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl90aW5vZGUubG9nZ2VyKFwiSU5GTzogQ2Fubm90IHNlbmQgbm90aWZpY2F0aW9uIGluIGluYWN0aXZlIHRvcGljXCIpO1xuICAgIH1cbiAgfVxuICAvLyBVcGRhdGUgY2FjaGVkIHJlYWQvcmVjdi91bnJlYWQgY291bnRzLlxuICBfdXBkYXRlUmVhZFJlY3Yod2hhdCwgc2VxLCB0cykge1xuICAgIGxldCBvbGRWYWwsIGRvVXBkYXRlID0gZmFsc2U7XG5cbiAgICBzZXEgPSBzZXEgfCAwO1xuICAgIHRoaXMuc2VxID0gdGhpcy5zZXEgfCAwO1xuICAgIHRoaXMucmVhZCA9IHRoaXMucmVhZCB8IDA7XG4gICAgdGhpcy5yZWN2ID0gdGhpcy5yZWN2IHwgMDtcbiAgICBzd2l0Y2ggKHdoYXQpIHtcbiAgICAgIGNhc2UgJ3JlY3YnOlxuICAgICAgICBvbGRWYWwgPSB0aGlzLnJlY3Y7XG4gICAgICAgIHRoaXMucmVjdiA9IE1hdGgubWF4KHRoaXMucmVjdiwgc2VxKTtcbiAgICAgICAgZG9VcGRhdGUgPSAob2xkVmFsICE9IHRoaXMucmVjdik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAncmVhZCc6XG4gICAgICAgIG9sZFZhbCA9IHRoaXMucmVhZDtcbiAgICAgICAgdGhpcy5yZWFkID0gTWF0aC5tYXgodGhpcy5yZWFkLCBzZXEpO1xuICAgICAgICBkb1VwZGF0ZSA9IChvbGRWYWwgIT0gdGhpcy5yZWFkKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtc2cnOlxuICAgICAgICBvbGRWYWwgPSB0aGlzLnNlcTtcbiAgICAgICAgdGhpcy5zZXEgPSBNYXRoLm1heCh0aGlzLnNlcSwgc2VxKTtcbiAgICAgICAgaWYgKCF0aGlzLnRvdWNoZWQgfHwgdGhpcy50b3VjaGVkIDwgdHMpIHtcbiAgICAgICAgICB0aGlzLnRvdWNoZWQgPSB0cztcbiAgICAgICAgfVxuICAgICAgICBkb1VwZGF0ZSA9IChvbGRWYWwgIT0gdGhpcy5zZXEpO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICAvLyBTYW5pdHkgY2hlY2tzLlxuICAgIGlmICh0aGlzLnJlY3YgPCB0aGlzLnJlYWQpIHtcbiAgICAgIHRoaXMucmVjdiA9IHRoaXMucmVhZDtcbiAgICAgIGRvVXBkYXRlID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKHRoaXMuc2VxIDwgdGhpcy5yZWN2KSB7XG4gICAgICB0aGlzLnNlcSA9IHRoaXMucmVjdjtcbiAgICAgIGlmICghdGhpcy50b3VjaGVkIHx8IHRoaXMudG91Y2hlZCA8IHRzKSB7XG4gICAgICAgIHRoaXMudG91Y2hlZCA9IHRzO1xuICAgICAgfVxuICAgICAgZG9VcGRhdGUgPSB0cnVlO1xuICAgIH1cbiAgICB0aGlzLnVucmVhZCA9IHRoaXMuc2VxIC0gdGhpcy5yZWFkO1xuICAgIHJldHVybiBkb1VwZGF0ZTtcbiAgfVxuICAvKipcbiAgICogR2V0IHVzZXIgZGVzY3JpcHRpb24gZnJvbSBnbG9iYWwgY2FjaGUuIFRoZSB1c2VyIGRvZXMgbm90IG5lZWQgdG8gYmUgYVxuICAgKiBzdWJzY3JpYmVyIG9mIHRoaXMgdG9waWMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1aWQgLSBJRCBvZiB0aGUgdXNlciB0byBmZXRjaC5cbiAgICogQHJldHVybiB7T2JqZWN0fSB1c2VyIGRlc2NyaXB0aW9uIG9yIHVuZGVmaW5lZC5cbiAgICovXG4gIHVzZXJEZXNjKHVpZCkge1xuICAgIC8vIFRPRE86IGhhbmRsZSBhc3luY2hyb25vdXMgcmVxdWVzdHNcbiAgICBjb25zdCB1c2VyID0gdGhpcy5fY2FjaGVHZXRVc2VyKHVpZCk7XG4gICAgaWYgKHVzZXIpIHtcbiAgICAgIHJldHVybiB1c2VyOyAvLyBQcm9taXNlLnJlc29sdmUodXNlcilcbiAgICB9XG4gIH1cbiAgLyoqXG4gICAqIEdldCBkZXNjcmlwdGlvbiBvZiB0aGUgcDJwIHBlZXIgZnJvbSBzdWJzY3JpcHRpb24gY2FjaGUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEByZXR1cm4ge09iamVjdH0gcGVlcidzIGRlc2NyaXB0aW9uIG9yIHVuZGVmaW5lZC5cbiAgICovXG4gIHAycFBlZXJEZXNjKCkge1xuICAgIGlmICghdGhpcy5pc1AyUFR5cGUoKSkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3VzZXJzW3RoaXMubmFtZV07XG4gIH1cbiAgLyoqXG4gICAqIEl0ZXJhdGUgb3ZlciBjYWNoZWQgc3Vic2NyaWJlcnMuIElmIGNhbGxiYWNrIGlzIHVuZGVmaW5lZCwgdXNlIHRoaXMub25NZXRhU3ViLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayAtIENhbGxiYWNrIHdoaWNoIHdpbGwgcmVjZWl2ZSBzdWJzY3JpYmVycyBvbmUgYnkgb25lLlxuICAgKiBAcGFyYW0ge09iamVjdD19IGNvbnRleHQgLSBWYWx1ZSBvZiBgdGhpc2AgaW5zaWRlIHRoZSBgY2FsbGJhY2tgLlxuICAgKi9cbiAgc3Vic2NyaWJlcnMoY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICBjb25zdCBjYiA9IChjYWxsYmFjayB8fCB0aGlzLm9uTWV0YVN1Yik7XG4gICAgaWYgKGNiKSB7XG4gICAgICBmb3IgKGxldCBpZHggaW4gdGhpcy5fdXNlcnMpIHtcbiAgICAgICAgY2IuY2FsbChjb250ZXh0LCB0aGlzLl91c2Vyc1tpZHhdLCBpZHgsIHRoaXMuX3VzZXJzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgLyoqXG4gICAqIEdldCBhIGNvcHkgb2YgY2FjaGVkIHRhZ3MuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEByZXR1cm4ge0FycmF5LjxzdHJpbmc+fSBhIGNvcHkgb2YgdGFnc1xuICAgKi9cbiAgdGFncygpIHtcbiAgICAvLyBSZXR1cm4gYSBjb3B5LlxuICAgIHJldHVybiB0aGlzLl90YWdzLnNsaWNlKDApO1xuICB9XG4gIC8qKlxuICAgKiBHZXQgY2FjaGVkIHN1YnNjcmlwdGlvbiBmb3IgdGhlIGdpdmVuIHVzZXIgSUQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1aWQgLSBpZCBvZiB0aGUgdXNlciB0byBxdWVyeSBmb3JcbiAgICogQHJldHVybiB1c2VyIGRlc2NyaXB0aW9uIG9yIHVuZGVmaW5lZC5cbiAgICovXG4gIHN1YnNjcmliZXIodWlkKSB7XG4gICAgcmV0dXJuIHRoaXMuX3VzZXJzW3VpZF07XG4gIH1cbiAgLyoqXG4gICAqIEl0ZXJhdGUgb3ZlciB2ZXJzaW9ucyBvZiA8Y29kZT5tZXNzYWdlPC9jb2RlPjogY2FsbCA8Y29kZT5jYWxsYmFjazwvY29kZT4gZm9yIGVhY2ggbWVzc2FnZS5cbiAgICogSWYgPGNvZGU+Y2FsbGJhY2s8L2NvZGU+IGlzIHVuZGVmaW5lZCwgZG9lcyBub3RoaW5nLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge1Rpbm9kZS5Gb3JFYWNoQ2FsbGJhY2tUeXBlfSBjYWxsYmFjayAtIENhbGxiYWNrIHdoaWNoIHdpbGwgcmVjZWl2ZSBtZXNzYWdlcyBvbmUgYnkgb25lLiBTZWUge0BsaW5rIFRpbm9kZS5DQnVmZmVyI2ZvckVhY2h9XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZXh0IC0gVmFsdWUgb2YgYHRoaXNgIGluc2lkZSB0aGUgYGNhbGxiYWNrYC5cbiAgICovXG4gIG1lc3NhZ2VWZXJzaW9ucyhtZXNzYWdlLCBjYWxsYmFjaywgY29udGV4dCkge1xuICAgIGlmICghY2FsbGJhY2spIHtcbiAgICAgIC8vIE5vIGNhbGxiYWNrPyBXZSBhcmUgZG9uZSB0aGVuLlxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBvcmlnU2VxID0gdGhpcy5faXNSZXBsYWNlbWVudE1zZyhtZXNzYWdlKSA/IHBhcnNlSW50KG1lc3NhZ2UuaGVhZC5yZXBsYWNlLnNwbGl0KCc6JylbMV0pIDogbWVzc2FnZS5zZXE7XG4gICAgY29uc3QgdmVyc2lvbnMgPSB0aGlzLl9tZXNzYWdlVmVyc2lvbnNbb3JpZ1NlcV07XG4gICAgaWYgKCF2ZXJzaW9ucykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2ZXJzaW9ucy5mb3JFYWNoKGNhbGxiYWNrLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgY29udGV4dCk7XG4gIH1cbiAgLyoqXG4gICAqIEl0ZXJhdGUgb3ZlciBjYWNoZWQgbWVzc2FnZXM6IGNhbGwgPGNvZGU+Y2FsbGJhY2s8L2NvZGU+IGZvciBlYWNoIG1lc3NhZ2UgaW4gdGhlIHJhbmdlIFtzaW5kZUlkeCwgYmVmb3JlSWR4KS5cbiAgICogSWYgPGNvZGU+Y2FsbGJhY2s8L2NvZGU+IGlzIHVuZGVmaW5lZCwgdXNlIDxjb2RlPnRoaXMub25EYXRhPC9jb2RlPi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtUaW5vZGUuRm9yRWFjaENhbGxiYWNrVHlwZX0gY2FsbGJhY2sgLSBDYWxsYmFjayB3aGljaCB3aWxsIHJlY2VpdmUgbWVzc2FnZXMgb25lIGJ5IG9uZS4gU2VlIHtAbGluayBUaW5vZGUuQ0J1ZmZlciNmb3JFYWNofVxuICAgKiBAcGFyYW0ge251bWJlcn0gc2luY2VJZCAtIE9wdGlvbmFsIHNlcUlkIHRvIHN0YXJ0IGl0ZXJhdGluZyBmcm9tIChpbmNsdXNpdmUpLlxuICAgKiBAcGFyYW0ge251bWJlcn0gYmVmb3JlSWQgLSBPcHRpb25hbCBzZXFJZCB0byBzdG9wIGl0ZXJhdGluZyBiZWZvcmUgaXQgaXMgcmVhY2hlZCAoZXhjbHVzaXZlKS5cbiAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHQgLSBWYWx1ZSBvZiBgdGhpc2AgaW5zaWRlIHRoZSBgY2FsbGJhY2tgLlxuICAgKi9cbiAgbWVzc2FnZXMoY2FsbGJhY2ssIHNpbmNlSWQsIGJlZm9yZUlkLCBjb250ZXh0KSB7XG4gICAgY29uc3QgY2IgPSAoY2FsbGJhY2sgfHwgdGhpcy5vbkRhdGEpO1xuICAgIGlmIChjYikge1xuICAgICAgY29uc3Qgc3RhcnRJZHggPSB0eXBlb2Ygc2luY2VJZCA9PSAnbnVtYmVyJyA/IHRoaXMuX21lc3NhZ2VzLmZpbmQoe1xuICAgICAgICBzZXE6IHNpbmNlSWRcbiAgICAgIH0sIHRydWUpIDogdW5kZWZpbmVkO1xuICAgICAgY29uc3QgYmVmb3JlSWR4ID0gdHlwZW9mIGJlZm9yZUlkID09ICdudW1iZXInID8gdGhpcy5fbWVzc2FnZXMuZmluZCh7XG4gICAgICAgIHNlcTogYmVmb3JlSWRcbiAgICAgIH0sIHRydWUpIDogdW5kZWZpbmVkO1xuICAgICAgaWYgKHN0YXJ0SWR4ICE9IC0xICYmIGJlZm9yZUlkeCAhPSAtMSkge1xuICAgICAgICAvLyBTdGVwIDEuIEZpbHRlciBvdXQgYWxsIHJlcGxhY2VtZW50IG1lc3NhZ2VzIGFuZFxuICAgICAgICAvLyBzYXZlIGRpc3BsYXlhYmxlIG1lc3NhZ2VzIGluIGEgdGVtcG9yYXJ5IGJ1ZmZlci5cbiAgICAgICAgbGV0IG1zZ3MgPSBbXTtcbiAgICAgICAgdGhpcy5fbWVzc2FnZXMuZm9yRWFjaCgobXNnLCB1bnVzZWQxLCB1bnVzZWQyLCBpKSA9PiB7XG4gICAgICAgICAgaWYgKHRoaXMuX2lzUmVwbGFjZW1lbnRNc2cobXNnKSkge1xuICAgICAgICAgICAgLy8gU2tpcCByZXBsYWNlbWVudHMuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIG1zZ3MucHVzaCh7XG4gICAgICAgICAgICBkYXRhOiB0aGlzLl9nZXRMYXRlc3RNc2dWZXJzaW9uKG1zZyksXG4gICAgICAgICAgICBpZHg6IGlcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSwgc3RhcnRJZHgsIGJlZm9yZUlkeCwge30pO1xuICAgICAgICAvLyBTdGVwIDIuIExvb3Agb3ZlciBkaXNwbGF5YmxlIG1lc3NhZ2VzIGludm9raW5nIGNiIG9uIGVhY2ggb2YgdGhlbS5cbiAgICAgICAgbXNncy5mb3JFYWNoKCh2YWwsIGkpID0+IHtcbiAgICAgICAgICBjYi5jYWxsKGNvbnRleHQsIHZhbC5kYXRhLFxuICAgICAgICAgICAgKGkgPiAwID8gbXNnc1tpIC0gMV0uZGF0YSA6IHVuZGVmaW5lZCksXG4gICAgICAgICAgICAoaSA8IG1zZ3MubGVuZ3RoIC0gMSA/IG1zZ3NbaSArIDFdLmRhdGEgOiB1bmRlZmluZWQpLCB2YWwuaWR4KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIC8qKlxuICAgKiBHZXQgdGhlIG1lc3NhZ2UgZnJvbSBjYWNoZSBieSA8Y29kZT5zZXE8L2NvZGU+LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gc2VxIC0gbWVzc2FnZSBzZXFJZCB0byBzZWFyY2ggZm9yLlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSB0aGUgbWVzc2FnZSB3aXRoIHRoZSBnaXZlbiA8Y29kZT5zZXE8L2NvZGU+IG9yIDxjb2RlPnVuZGVmaW5lZDwvY29kZT4sIGlmIG5vIHN1Y2ggbWVzc2FnZSBpcyBmb3VuZC5cbiAgICovXG4gIGZpbmRNZXNzYWdlKHNlcSkge1xuICAgIGNvbnN0IGlkeCA9IHRoaXMuX21lc3NhZ2VzLmZpbmQoe1xuICAgICAgc2VxOiBzZXFcbiAgICB9KTtcbiAgICBpZiAoaWR4ID49IDApIHtcbiAgICAgIHJldHVybiB0aGlzLl9tZXNzYWdlcy5nZXRBdChpZHgpO1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG4gIC8qKlxuICAgKiBHZXQgdGhlIG1vc3QgcmVjZW50IG1lc3NhZ2UgZnJvbSBjYWNoZS4gVGhpcyBtZXRob2QgY291bnRzIGFsbCBtZXNzYWdlcywgaW5jbHVkaW5nIGRlbGV0ZWQgcmFuZ2VzLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlbn0gc2tpcERlbGV0ZWQgLSBpZiB0aGUgbGFzdCBtZXNzYWdlIGlzIGEgZGVsZXRlZCByYW5nZSwgZ2V0IHRoZSBvbmUgYmVmb3JlIGl0LlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSB0aGUgbW9zdCByZWNlbnQgY2FjaGVkIG1lc3NhZ2Ugb3IgPGNvZGU+dW5kZWZpbmVkPC9jb2RlPiwgaWYgbm8gbWVzc2FnZXMgYXJlIGNhY2hlZC5cbiAgICovXG4gIGxhdGVzdE1lc3NhZ2Uoc2tpcERlbGV0ZWQpIHtcbiAgICBjb25zdCBtc2cgPSB0aGlzLl9tZXNzYWdlcy5nZXRMYXN0KCk7XG4gICAgaWYgKCFza2lwRGVsZXRlZCB8fCAhbXNnIHx8IG1zZy5fc3RhdHVzICE9IENvbnN0Lk1FU1NBR0VfU1RBVFVTX0RFTF9SQU5HRSkge1xuICAgICAgcmV0dXJuIG1zZztcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX21lc3NhZ2VzLmdldExhc3QoMSk7XG4gIH1cbiAgLyoqXG4gICAqIEdldCB0aGUgbWF4aW11bSBjYWNoZWQgc2VxIElELlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSB0aGUgZ3JlYXRlc3Qgc2VxIElEIGluIGNhY2hlLlxuICAgKi9cbiAgbWF4TXNnU2VxKCkge1xuICAgIHJldHVybiB0aGlzLl9tYXhTZXE7XG4gIH1cbiAgLyoqXG4gICAqIEdldCB0aGUgbWF4aW11bSBkZWxldGlvbiBJRC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHJldHVybnMge251bWJlcn0gdGhlIGdyZWF0ZXN0IGRlbGV0aW9uIElELlxuICAgKi9cbiAgbWF4Q2xlYXJJZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fbWF4RGVsO1xuICB9XG4gIC8qKlxuICAgKiBHZXQgdGhlIG51bWJlciBvZiBtZXNzYWdlcyBpbiB0aGUgY2FjaGUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IGNvdW50IG9mIGNhY2hlZCBtZXNzYWdlcy5cbiAgICovXG4gIG1lc3NhZ2VDb3VudCgpIHtcbiAgICByZXR1cm4gdGhpcy5fbWVzc2FnZXMubGVuZ3RoKCk7XG4gIH1cbiAgLyoqXG4gICAqIEl0ZXJhdGUgb3ZlciBjYWNoZWQgdW5zZW50IG1lc3NhZ2VzLiBXcmFwcyB7QGxpbmsgVGlub2RlLlRvcGljI21lc3NhZ2VzfS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgLSBDYWxsYmFjayB3aGljaCB3aWxsIHJlY2VpdmUgbWVzc2FnZXMgb25lIGJ5IG9uZS4gU2VlIHtAbGluayBUaW5vZGUuQ0J1ZmZlciNmb3JFYWNofVxuICAgKiBAcGFyYW0ge09iamVjdH0gY29udGV4dCAtIFZhbHVlIG9mIDxjb2RlPnRoaXM8L2NvZGU+IGluc2lkZSB0aGUgPGNvZGU+Y2FsbGJhY2s8L2NvZGU+LlxuICAgKi9cbiAgcXVldWVkTWVzc2FnZXMoY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICBpZiAoIWNhbGxiYWNrKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYWxsYmFjayBtdXN0IGJlIHByb3ZpZGVkXCIpO1xuICAgIH1cbiAgICB0aGlzLm1lc3NhZ2VzKGNhbGxiYWNrLCBDb25zdC5MT0NBTF9TRVFJRCwgdW5kZWZpbmVkLCBjb250ZXh0KTtcbiAgfVxuICAvKipcbiAgICogR2V0IHRoZSBudW1iZXIgb2YgdG9waWMgc3Vic2NyaWJlcnMgd2hvIG1hcmtlZCB0aGlzIG1lc3NhZ2UgYXMgZWl0aGVyIHJlY3Ygb3IgcmVhZFxuICAgKiBDdXJyZW50IHVzZXIgaXMgZXhjbHVkZWQgZnJvbSB0aGUgY291bnQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB3aGF0IC0gd2hhdCBhY3Rpb24gdG8gY29uc2lkZXI6IHJlY2VpdmVkIDxjb2RlPlwicmVjdlwiPC9jb2RlPiBvciByZWFkIDxjb2RlPlwicmVhZFwiPC9jb2RlPi5cbiAgICogQHBhcmFtIHtudW1iZXJ9IHNlcSAtIElEIG9yIHRoZSBtZXNzYWdlIHJlYWQgb3IgcmVjZWl2ZWQuXG4gICAqXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IHRoZSBudW1iZXIgb2Ygc3Vic2NyaWJlcnMgd2hvIG1hcmtlZCB0aGUgbWVzc2FnZSB3aXRoIHRoZSBnaXZlbiBJRCBhcyByZWFkIG9yIHJlY2VpdmVkLlxuICAgKi9cbiAgbXNnUmVjZWlwdENvdW50KHdoYXQsIHNlcSkge1xuICAgIGxldCBjb3VudCA9IDA7XG4gICAgaWYgKHNlcSA+IDApIHtcbiAgICAgIGNvbnN0IG1lID0gdGhpcy5fdGlub2RlLmdldEN1cnJlbnRVc2VySUQoKTtcbiAgICAgIGZvciAobGV0IGlkeCBpbiB0aGlzLl91c2Vycykge1xuICAgICAgICBjb25zdCB1c2VyID0gdGhpcy5fdXNlcnNbaWR4XTtcbiAgICAgICAgaWYgKHVzZXIudXNlciAhPT0gbWUgJiYgdXNlclt3aGF0XSA+PSBzZXEpIHtcbiAgICAgICAgICBjb3VudCsrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjb3VudDtcbiAgfVxuICAvKipcbiAgICogR2V0IHRoZSBudW1iZXIgb2YgdG9waWMgc3Vic2NyaWJlcnMgd2hvIG1hcmtlZCB0aGlzIG1lc3NhZ2UgKGFuZCBhbGwgb2xkZXIgbWVzc2FnZXMpIGFzIHJlYWQuXG4gICAqIFRoZSBjdXJyZW50IHVzZXIgaXMgZXhjbHVkZWQgZnJvbSB0aGUgY291bnQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzZXEgLSBtZXNzYWdlIGlkIHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSBudW1iZXIgb2Ygc3Vic2NyaWJlcnMgd2hvIGNsYWltIHRvIGhhdmUgcmVjZWl2ZWQgdGhlIG1lc3NhZ2UuXG4gICAqL1xuICBtc2dSZWFkQ291bnQoc2VxKSB7XG4gICAgcmV0dXJuIHRoaXMubXNnUmVjZWlwdENvdW50KCdyZWFkJywgc2VxKTtcbiAgfVxuICAvKipcbiAgICogR2V0IHRoZSBudW1iZXIgb2YgdG9waWMgc3Vic2NyaWJlcnMgd2hvIG1hcmtlZCB0aGlzIG1lc3NhZ2UgKGFuZCBhbGwgb2xkZXIgbWVzc2FnZXMpIGFzIHJlY2VpdmVkLlxuICAgKiBUaGUgY3VycmVudCB1c2VyIGlzIGV4Y2x1ZGVkIGZyb20gdGhlIGNvdW50LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gc2VxIC0gTWVzc2FnZSBpZCB0byBjaGVjay5cbiAgICogQHJldHVybnMge251bWJlcn0gTnVtYmVyIG9mIHN1YnNjcmliZXJzIHdobyBjbGFpbSB0byBoYXZlIHJlY2VpdmVkIHRoZSBtZXNzYWdlLlxuICAgKi9cbiAgbXNnUmVjdkNvdW50KHNlcSkge1xuICAgIHJldHVybiB0aGlzLm1zZ1JlY2VpcHRDb3VudCgncmVjdicsIHNlcSk7XG4gIH1cbiAgLyoqXG4gICAqIENoZWNrIGlmIGNhY2hlZCBtZXNzYWdlIElEcyBpbmRpY2F0ZSB0aGF0IHRoZSBzZXJ2ZXIgbWF5IGhhdmUgbW9yZSBtZXNzYWdlcy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSBuZXdlciAtIGlmIDxjb2RlPnRydWU8L2NvZGU+LCBjaGVjayBmb3IgbmV3ZXIgbWVzc2FnZXMgb25seS5cbiAgICovXG4gIG1zZ0hhc01vcmVNZXNzYWdlcyhuZXdlcikge1xuICAgIHJldHVybiBuZXdlciA/IHRoaXMuc2VxID4gdGhpcy5fbWF4U2VxIDpcbiAgICAgIC8vIF9taW5TZXEgY291bGQgYmUgbW9yZSB0aGFuIDEsIGJ1dCBlYXJsaWVyIG1lc3NhZ2VzIGNvdWxkIGhhdmUgYmVlbiBkZWxldGVkLlxuICAgICAgKHRoaXMuX21pblNlcSA+IDEgJiYgIXRoaXMuX25vRWFybGllck1zZ3MpO1xuICB9XG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgZ2l2ZW4gc2VxIElkIGlzIGlkIG9mIHRoZSBtb3N0IHJlY2VudCBtZXNzYWdlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gc2VxSWQgaWQgb2YgdGhlIG1lc3NhZ2UgdG8gY2hlY2tcbiAgICovXG4gIGlzTmV3TWVzc2FnZShzZXFJZCkge1xuICAgIHJldHVybiB0aGlzLl9tYXhTZXEgPD0gc2VxSWQ7XG4gIH1cbiAgLyoqXG4gICAqIFJlbW92ZSBvbmUgbWVzc2FnZSBmcm9tIGxvY2FsIGNhY2hlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gc2VxSWQgaWQgb2YgdGhlIG1lc3NhZ2UgdG8gcmVtb3ZlIGZyb20gY2FjaGUuXG4gICAqIEByZXR1cm5zIHtNZXNzYWdlfSByZW1vdmVkIG1lc3NhZ2Ugb3IgdW5kZWZpbmVkIGlmIHN1Y2ggbWVzc2FnZSB3YXMgbm90IGZvdW5kLlxuICAgKi9cbiAgZmx1c2hNZXNzYWdlKHNlcUlkKSB7XG4gICAgY29uc3QgaWR4ID0gdGhpcy5fbWVzc2FnZXMuZmluZCh7XG4gICAgICBzZXE6IHNlcUlkXG4gICAgfSk7XG4gICAgaWYgKGlkeCA+PSAwKSB7XG4gICAgICB0aGlzLl90aW5vZGUuX2RiLnJlbU1lc3NhZ2VzKHRoaXMubmFtZSwgc2VxSWQpO1xuICAgICAgcmV0dXJuIHRoaXMuX21lc3NhZ2VzLmRlbEF0KGlkeCk7XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgLyoqXG4gICAqIFVwZGF0ZSBtZXNzYWdlJ3Mgc2VxSWQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwdWIgbWVzc2FnZSBvYmplY3QuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBuZXdTZXFJZCBuZXcgc2VxIGlkIGZvciBwdWIuXG4gICAqL1xuICBzd2FwTWVzc2FnZUlkKHB1YiwgbmV3U2VxSWQpIHtcbiAgICBjb25zdCBpZHggPSB0aGlzLl9tZXNzYWdlcy5maW5kKHB1Yik7XG4gICAgY29uc3QgbnVtTWVzc2FnZXMgPSB0aGlzLl9tZXNzYWdlcy5sZW5ndGgoKTtcbiAgICBpZiAoMCA8PSBpZHggJiYgaWR4IDwgbnVtTWVzc2FnZXMpIHtcbiAgICAgIC8vIFJlbW92ZSBtZXNzYWdlIHdpdGggdGhlIG9sZCBzZXEgSUQuXG4gICAgICB0aGlzLl9tZXNzYWdlcy5kZWxBdChpZHgpO1xuICAgICAgdGhpcy5fdGlub2RlLl9kYi5yZW1NZXNzYWdlcyh0aGlzLm5hbWUsIHB1Yi5zZXEpO1xuICAgICAgLy8gQWRkIG1lc3NhZ2Ugd2l0aCB0aGUgbmV3IHNlcSBJRC5cbiAgICAgIHB1Yi5zZXEgPSBuZXdTZXFJZDtcbiAgICAgIHRoaXMuX21lc3NhZ2VzLnB1dChwdWIpO1xuICAgICAgdGhpcy5fdGlub2RlLl9kYi5hZGRNZXNzYWdlKHB1Yik7XG4gICAgfVxuICB9XG4gIC8qKlxuICAgKiBSZW1vdmUgYSByYW5nZSBvZiBtZXNzYWdlcyBmcm9tIHRoZSBsb2NhbCBjYWNoZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IGZyb21JZCBzZXEgSUQgb2YgdGhlIGZpcnN0IG1lc3NhZ2UgdG8gcmVtb3ZlIChpbmNsdXNpdmUpLlxuICAgKiBAcGFyYW0ge251bWJlcn0gdW50aWxJZCBzZXFJRCBvZiB0aGUgbGFzdCBtZXNzYWdlIHRvIHJlbW92ZSAoZXhjbHVzaXZlKS5cbiAgICpcbiAgICogQHJldHVybnMge01lc3NhZ2VbXX0gYXJyYXkgb2YgcmVtb3ZlZCBtZXNzYWdlcyAoY291bGQgYmUgZW1wdHkpLlxuICAgKi9cbiAgZmx1c2hNZXNzYWdlUmFuZ2UoZnJvbUlkLCB1bnRpbElkKSB7XG4gICAgLy8gUmVtb3ZlIHJhbmdlIGZyb20gcGVyc2lzdGVudCBjYWNoZS5cbiAgICB0aGlzLl90aW5vZGUuX2RiLnJlbU1lc3NhZ2VzKHRoaXMubmFtZSwgZnJvbUlkLCB1bnRpbElkKTtcbiAgICAvLyBzdGFydCwgZW5kOiBmaW5kIGluc2VydGlvbiBwb2ludHMgKG5lYXJlc3QgPT0gdHJ1ZSkuXG4gICAgY29uc3Qgc2luY2UgPSB0aGlzLl9tZXNzYWdlcy5maW5kKHtcbiAgICAgIHNlcTogZnJvbUlkXG4gICAgfSwgdHJ1ZSk7XG4gICAgcmV0dXJuIHNpbmNlID49IDAgPyB0aGlzLl9tZXNzYWdlcy5kZWxSYW5nZShzaW5jZSwgdGhpcy5fbWVzc2FnZXMuZmluZCh7XG4gICAgICBzZXE6IHVudGlsSWRcbiAgICB9LCB0cnVlKSkgOiBbXTtcbiAgfVxuICAvKipcbiAgICogQXR0ZW1wdCB0byBzdG9wIG1lc3NhZ2UgZnJvbSBiZWluZyBzZW50LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gc2VxSWQgaWQgb2YgdGhlIG1lc3NhZ2UgdG8gc3RvcCBzZW5kaW5nIGFuZCByZW1vdmUgZnJvbSBjYWNoZS5cbiAgICpcbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIG1lc3NhZ2Ugd2FzIGNhbmNlbGxlZCwgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIGNhbmNlbFNlbmQoc2VxSWQpIHtcbiAgICBjb25zdCBpZHggPSB0aGlzLl9tZXNzYWdlcy5maW5kKHtcbiAgICAgIHNlcTogc2VxSWRcbiAgICB9KTtcbiAgICBpZiAoaWR4ID49IDApIHtcbiAgICAgIGNvbnN0IG1zZyA9IHRoaXMuX21lc3NhZ2VzLmdldEF0KGlkeCk7XG4gICAgICBjb25zdCBzdGF0dXMgPSB0aGlzLm1zZ1N0YXR1cyhtc2cpO1xuICAgICAgaWYgKHN0YXR1cyA9PSBDb25zdC5NRVNTQUdFX1NUQVRVU19RVUVVRUQgfHwgc3RhdHVzID09IENvbnN0Lk1FU1NBR0VfU1RBVFVTX0ZBSUxFRCkge1xuICAgICAgICB0aGlzLl90aW5vZGUuX2RiLnJlbU1lc3NhZ2VzKHRoaXMubmFtZSwgc2VxSWQpO1xuICAgICAgICBtc2cuX2NhbmNlbGxlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuX21lc3NhZ2VzLmRlbEF0KGlkeCk7XG4gICAgICAgIGlmICh0aGlzLm9uRGF0YSkge1xuICAgICAgICAgIC8vIENhbGxpbmcgd2l0aCBubyBwYXJhbWV0ZXJzIHRvIGluZGljYXRlIHRoZSBtZXNzYWdlIHdhcyBkZWxldGVkLlxuICAgICAgICAgIHRoaXMub25EYXRhKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICAvKipcbiAgICogR2V0IHR5cGUgb2YgdGhlIHRvcGljOiBtZSwgcDJwLCBncnAsIGZuZC4uLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBPbmUgb2YgJ21lJywgJ3AycCcsICdncnAnLCAnZm5kJywgJ3N5cycgb3IgPGNvZGU+dW5kZWZpbmVkPC9jb2RlPi5cbiAgICovXG4gIGdldFR5cGUoKSB7XG4gICAgcmV0dXJuIFRvcGljLnRvcGljVHlwZSh0aGlzLm5hbWUpO1xuICB9XG4gIC8qKlxuICAgKiBHZXQgY3VycmVudCB1c2VyJ3MgYWNjZXNzIG1vZGUgb2YgdGhlIHRvcGljLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLkFjY2Vzc01vZGV9IC0gdXNlcidzIGFjY2VzcyBtb2RlXG4gICAqL1xuICBnZXRBY2Nlc3NNb2RlKCkge1xuICAgIHJldHVybiB0aGlzLmFjcztcbiAgfVxuICAvKipcbiAgICogU2V0IGN1cnJlbnQgdXNlcidzIGFjY2VzcyBtb2RlIG9mIHRoZSB0b3BpYy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtBY2Nlc3NNb2RlIHwgT2JqZWN0fSBhY3MgLSBhY2Nlc3MgbW9kZSB0byBzZXQuXG4gICAqL1xuICBzZXRBY2Nlc3NNb2RlKGFjcykge1xuICAgIHJldHVybiB0aGlzLmFjcyA9IG5ldyBBY2Nlc3NNb2RlKGFjcyk7XG4gIH1cbiAgLyoqXG4gICAqIEdldCB0b3BpYydzIGRlZmF1bHQgYWNjZXNzIG1vZGUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuRGVmQWNzfSAtIGFjY2VzcyBtb2RlLCBzdWNoIGFzIHthdXRoOiBgUldQYCwgYW5vbjogYE5gfS5cbiAgICovXG4gIGdldERlZmF1bHRBY2Nlc3MoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGVmYWNzO1xuICB9XG4gIC8qKlxuICAgKiBJbml0aWFsaXplIG5ldyBtZXRhIHtAbGluayBUaW5vZGUuR2V0UXVlcnl9IGJ1aWxkZXIuIFRoZSBxdWVyeSBpcyBhdHRjaGVkIHRvIHRoZSBjdXJyZW50IHRvcGljLlxuICAgKiBJdCB3aWxsIG5vdCB3b3JrIGNvcnJlY3RseSBpZiB1c2VkIHdpdGggYSBkaWZmZXJlbnQgdG9waWMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuTWV0YUdldEJ1aWxkZXJ9IHF1ZXJ5IGF0dGFjaGVkIHRvIHRoZSBjdXJyZW50IHRvcGljLlxuICAgKi9cbiAgc3RhcnRNZXRhUXVlcnkoKSB7XG4gICAgcmV0dXJuIG5ldyBNZXRhR2V0QnVpbGRlcih0aGlzKTtcbiAgfVxuICAvKipcbiAgICogQ2hlY2sgaWYgdG9waWMgaXMgYXJjaGl2ZWQsIGkuZS4gcHJpdmF0ZS5hcmNoID09IHRydWUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIDxjb2RlPnRydWU8L2NvZGU+IGlmIHRvcGljIGlzIGFyY2hpdmVkLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgaXNBcmNoaXZlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5wcml2YXRlICYmICEhdGhpcy5wcml2YXRlLmFyY2g7XG4gIH1cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRvcGljIGlzIGEgJ21lJyB0b3BpYy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHJldHVybnMge2Jvb2xlYW59IC0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgdG9waWMgaXMgYSAnbWUnIHRvcGljLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgaXNNZVR5cGUoKSB7XG4gICAgcmV0dXJuIFRvcGljLmlzTWVUb3BpY05hbWUodGhpcy5uYW1lKTtcbiAgfVxuICAvKipcbiAgICogQ2hlY2sgaWYgdG9waWMgaXMgYSBjaGFubmVsLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0b3BpYyBpcyBhIGNoYW5uZWwsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBpc0NoYW5uZWxUeXBlKCkge1xuICAgIHJldHVybiBUb3BpYy5pc0NoYW5uZWxUb3BpY05hbWUodGhpcy5uYW1lKTtcbiAgfVxuICAvKipcbiAgICogQ2hlY2sgaWYgdG9waWMgaXMgYSBncm91cCB0b3BpYy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHJldHVybnMge2Jvb2xlYW59IC0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgdG9waWMgaXMgYSBncm91cCwgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIGlzR3JvdXBUeXBlKCkge1xuICAgIHJldHVybiBUb3BpYy5pc0dyb3VwVG9waWNOYW1lKHRoaXMubmFtZSk7XG4gIH1cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRvcGljIGlzIGEgcDJwIHRvcGljLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0b3BpYyBpcyBhIHAycCB0b3BpYywgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIGlzUDJQVHlwZSgpIHtcbiAgICByZXR1cm4gVG9waWMuaXNQMlBUb3BpY05hbWUodGhpcy5uYW1lKTtcbiAgfVxuICAvKipcbiAgICogQ2hlY2sgaWYgdG9waWMgaXMgYSBjb21tdW5pY2F0aW9uIHRvcGljLCBpLmUuIGEgZ3JvdXAgb3IgcDJwIHRvcGljLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0b3BpYyBpcyBhIHAycCBvciBncm91cCB0b3BpYywgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIGlzQ29tbVR5cGUoKSB7XG4gICAgcmV0dXJuIFRvcGljLmlzQ29tbVRvcGljTmFtZSh0aGlzLm5hbWUpO1xuICB9XG4gIC8qKlxuICAgKiBHZXQgc3RhdHVzIChxdWV1ZWQsIHNlbnQsIHJlY2VpdmVkIGV0Yykgb2YgYSBnaXZlbiBtZXNzYWdlIGluIHRoZSBjb250ZXh0XG4gICAqIG9mIHRoaXMgdG9waWMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7TWVzc2FnZX0gbXNnIC0gbWVzc2FnZSB0byBjaGVjayBmb3Igc3RhdHVzLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHVwZCAtIHVwZGF0ZSBjaGFjaGVkIG1lc3NhZ2Ugc3RhdHVzLlxuICAgKlxuICAgKiBAcmV0dXJucyBtZXNzYWdlIHN0YXR1cyBjb25zdGFudC5cbiAgICovXG4gIG1zZ1N0YXR1cyhtc2csIHVwZCkge1xuICAgIGxldCBzdGF0dXMgPSBDb25zdC5NRVNTQUdFX1NUQVRVU19OT05FO1xuICAgIGlmICh0aGlzLl90aW5vZGUuaXNNZShtc2cuZnJvbSkpIHtcbiAgICAgIGlmIChtc2cuX3NlbmRpbmcpIHtcbiAgICAgICAgc3RhdHVzID0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfU0VORElORztcbiAgICAgIH0gZWxzZSBpZiAobXNnLl9mYWlsZWQgfHwgbXNnLl9jYW5jZWxsZWQpIHtcbiAgICAgICAgc3RhdHVzID0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfRkFJTEVEO1xuICAgICAgfSBlbHNlIGlmIChtc2cuc2VxID49IENvbnN0LkxPQ0FMX1NFUUlEKSB7XG4gICAgICAgIHN0YXR1cyA9IENvbnN0Lk1FU1NBR0VfU1RBVFVTX1FVRVVFRDtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5tc2dSZWFkQ291bnQobXNnLnNlcSkgPiAwKSB7XG4gICAgICAgIHN0YXR1cyA9IENvbnN0Lk1FU1NBR0VfU1RBVFVTX1JFQUQ7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMubXNnUmVjdkNvdW50KG1zZy5zZXEpID4gMCkge1xuICAgICAgICBzdGF0dXMgPSBDb25zdC5NRVNTQUdFX1NUQVRVU19SRUNFSVZFRDtcbiAgICAgIH0gZWxzZSBpZiAobXNnLnNlcSA+IDApIHtcbiAgICAgICAgc3RhdHVzID0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfU0VOVDtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG1zZy5fc3RhdHVzID09IENvbnN0Lk1FU1NBR0VfU1RBVFVTX0RFTF9SQU5HRSkge1xuICAgICAgc3RhdHVzID09IENvbnN0Lk1FU1NBR0VfU1RBVFVTX0RFTF9SQU5HRTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RhdHVzID0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfVE9fTUU7XG4gICAgfVxuXG4gICAgaWYgKHVwZCAmJiBtc2cuX3N0YXR1cyAhPSBzdGF0dXMpIHtcbiAgICAgIG1zZy5fc3RhdHVzID0gc3RhdHVzO1xuICAgICAgdGhpcy5fdGlub2RlLl9kYi51cGRNZXNzYWdlU3RhdHVzKHRoaXMubmFtZSwgbXNnLnNlcSwgc3RhdHVzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc3RhdHVzO1xuICB9XG5cbiAgLy8gUmV0dXJucyB0cnVlIGlmIHB1YiBpcyBtZWFudCB0byByZXBsYWNlIGFub3RoZXIgbWVzc2FnZSAoZS5nLiBvcmlnaW5hbCBtZXNzYWdlIHdhcyBlZGl0ZWQpLlxuICBfaXNSZXBsYWNlbWVudE1zZyhwdWIpIHtcbiAgICByZXR1cm4gcHViLmhlYWQgJiYgcHViLmhlYWQucmVwbGFjZTtcbiAgfVxuXG4gIC8vIElmIG1zZyBpcyBhIHJlcGxhY2VtZW50IGZvciBhbm90aGVyIG1lc3NhZ2UsIHNhdmVzIG1zZyBpbiB0aGUgbWVzc2FnZSB2ZXJzaW9ucyBjYWNoZVxuICAvLyBhcyBhIG5ld2VyIHZlcnNpb24gZm9yIHRoZSBtZXNzYWdlIGl0J3Mgc3VwcG9zZWQgdG8gcmVwbGFjZS5cbiAgX21heWJlVXBkYXRlTWVzc2FnZVZlcnNpb25zQ2FjaGUobXNnKSB7XG4gICAgaWYgKCF0aGlzLl9pc1JlcGxhY2VtZW50TXNnKG1zZykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgdGFyZ2V0U2VxID0gcGFyc2VJbnQobXNnLmhlYWQucmVwbGFjZS5zcGxpdCgnOicpWzFdKTtcbiAgICBpZiAodGFyZ2V0U2VxID4gbXNnLnNlcSkge1xuICAgICAgLy8gU3Vic3RpdHV0ZXMgYXJlIHN1cHBvc2VkIHRvIGhhdmUgaGlnaGVyIHNlcSBpZHMuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGxldCB2ZXJzaW9ucyA9IHRoaXMuX21lc3NhZ2VWZXJzaW9uc1t0YXJnZXRTZXFdIHx8IG5ldyBDQnVmZmVyKChhLCBiKSA9PiB7XG4gICAgICByZXR1cm4gYS5zZXEgLSBiLnNlcTtcbiAgICB9LCB0cnVlKTtcbiAgICB2ZXJzaW9ucy5wdXQobXNnKTtcbiAgICB0aGlzLl9tZXNzYWdlVmVyc2lvbnNbdGFyZ2V0U2VxXSA9IHZlcnNpb25zO1xuICB9XG5cbiAgLy8gUmV0dXJucyB0aGUgbGF0ZXN0IHZlcnNpb24gZm9yIGBtc2dgIG1lc3NhZ2UuXG4gIF9nZXRMYXRlc3RNc2dWZXJzaW9uKG1zZykge1xuICAgIGNvbnN0IHZlcnNpb25zID0gdGhpcy5fbWVzc2FnZVZlcnNpb25zW21zZy5zZXFdO1xuICAgIHJldHVybiB2ZXJzaW9ucyA/IHZlcnNpb25zLmdldExhc3QoKSA6IG1zZztcbiAgfVxuXG4gIC8vIFByb2Nlc3MgZGF0YSBtZXNzYWdlXG4gIF9yb3V0ZURhdGEoZGF0YSkge1xuICAgIGlmIChkYXRhLmNvbnRlbnQpIHtcbiAgICAgIGlmICghdGhpcy50b3VjaGVkIHx8IHRoaXMudG91Y2hlZCA8IGRhdGEudHMpIHtcbiAgICAgICAgdGhpcy50b3VjaGVkID0gZGF0YS50cztcbiAgICAgICAgdGhpcy5fdGlub2RlLl9kYi51cGRUb3BpYyh0aGlzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZGF0YS5zZXEgPiB0aGlzLl9tYXhTZXEpIHtcbiAgICAgIHRoaXMuX21heFNlcSA9IGRhdGEuc2VxO1xuICAgIH1cbiAgICBpZiAoZGF0YS5zZXEgPCB0aGlzLl9taW5TZXEgfHwgdGhpcy5fbWluU2VxID09IDApIHtcbiAgICAgIHRoaXMuX21pblNlcSA9IGRhdGEuc2VxO1xuICAgIH1cblxuICAgIGlmICghZGF0YS5fbm9Gb3J3YXJkaW5nKSB7XG4gICAgICB0aGlzLl9tZXNzYWdlcy5wdXQoZGF0YSk7XG4gICAgICB0aGlzLl90aW5vZGUuX2RiLmFkZE1lc3NhZ2UoZGF0YSk7XG4gICAgICB0aGlzLl9tYXliZVVwZGF0ZU1lc3NhZ2VWZXJzaW9uc0NhY2hlKGRhdGEpO1xuICAgICAgdGhpcy5fdXBkYXRlRGVsZXRlZFJhbmdlcygpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm9uRGF0YSkge1xuICAgICAgdGhpcy5vbkRhdGEoZGF0YSk7XG4gICAgfVxuXG4gICAgLy8gVXBkYXRlIGxvY2FsbHkgY2FjaGVkIGNvbnRhY3Qgd2l0aCB0aGUgbmV3IG1lc3NhZ2UgY291bnQuXG4gICAgY29uc3Qgd2hhdCA9ICgoIXRoaXMuaXNDaGFubmVsVHlwZSgpICYmICFkYXRhLmZyb20pIHx8IHRoaXMuX3Rpbm9kZS5pc01lKGRhdGEuZnJvbSkpID8gJ3JlYWQnIDogJ21zZyc7XG4gICAgdGhpcy5fdXBkYXRlUmVhZFJlY3Yod2hhdCwgZGF0YS5zZXEsIGRhdGEudHMpO1xuICAgIC8vIE5vdGlmeSAnbWUnIGxpc3RlbmVycyBvZiB0aGUgY2hhbmdlLlxuICAgIHRoaXMuX3Rpbm9kZS5nZXRNZVRvcGljKCkuX3JlZnJlc2hDb250YWN0KHdoYXQsIHRoaXMpO1xuICB9XG4gIC8vIFByb2Nlc3MgbWV0YWRhdGEgbWVzc2FnZVxuICBfcm91dGVNZXRhKG1ldGEpIHtcbiAgICBpZiAobWV0YS5kZXNjKSB7XG4gICAgICB0aGlzLl9wcm9jZXNzTWV0YURlc2MobWV0YS5kZXNjKTtcbiAgICB9XG4gICAgaWYgKG1ldGEuc3ViICYmIG1ldGEuc3ViLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMuX3Byb2Nlc3NNZXRhU3ViKG1ldGEuc3ViKTtcbiAgICB9XG4gICAgaWYgKG1ldGEuZGVsKSB7XG4gICAgICB0aGlzLl9wcm9jZXNzRGVsTWVzc2FnZXMobWV0YS5kZWwuY2xlYXIsIG1ldGEuZGVsLmRlbHNlcSk7XG4gICAgfVxuICAgIGlmIChtZXRhLnRhZ3MpIHtcbiAgICAgIHRoaXMuX3Byb2Nlc3NNZXRhVGFncyhtZXRhLnRhZ3MpO1xuICAgIH1cbiAgICBpZiAobWV0YS5jcmVkKSB7XG4gICAgICB0aGlzLl9wcm9jZXNzTWV0YUNyZWRzKG1ldGEuY3JlZCk7XG4gICAgfVxuICAgIGlmICh0aGlzLm9uTWV0YSkge1xuICAgICAgdGhpcy5vbk1ldGEobWV0YSk7XG4gICAgfVxuICB9XG4gIC8vIFByb2Nlc3MgcHJlc2VuY2UgY2hhbmdlIG1lc3NhZ2VcbiAgX3JvdXRlUHJlcyhwcmVzKSB7XG4gICAgbGV0IHVzZXIsIHVpZDtcbiAgICBzd2l0Y2ggKHByZXMud2hhdCkge1xuICAgICAgY2FzZSAnZGVsJzpcbiAgICAgICAgLy8gRGVsZXRlIGNhY2hlZCBtZXNzYWdlcy5cbiAgICAgICAgdGhpcy5fcHJvY2Vzc0RlbE1lc3NhZ2VzKHByZXMuY2xlYXIsIHByZXMuZGVsc2VxKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdvbic6XG4gICAgICBjYXNlICdvZmYnOlxuICAgICAgICAvLyBVcGRhdGUgb25saW5lIHN0YXR1cyBvZiBhIHN1YnNjcmlwdGlvbi5cbiAgICAgICAgdXNlciA9IHRoaXMuX3VzZXJzW3ByZXMuc3JjXTtcbiAgICAgICAgaWYgKHVzZXIpIHtcbiAgICAgICAgICB1c2VyLm9ubGluZSA9IHByZXMud2hhdCA9PSAnb24nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX3Rpbm9kZS5sb2dnZXIoXCJXQVJOSU5HOiBQcmVzZW5jZSB1cGRhdGUgZm9yIGFuIHVua25vd24gdXNlclwiLCB0aGlzLm5hbWUsIHByZXMuc3JjKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3Rlcm0nOlxuICAgICAgICAvLyBBdHRhY2htZW50IHRvIHRvcGljIGlzIHRlcm1pbmF0ZWQgcHJvYmFibHkgZHVlIHRvIGNsdXN0ZXIgcmVoYXNoaW5nLlxuICAgICAgICB0aGlzLl9yZXNldFN1YigpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3VwZCc6XG4gICAgICAgIC8vIEEgdG9waWMgc3Vic2NyaWJlciBoYXMgdXBkYXRlZCBoaXMgZGVzY3JpcHRpb24uXG4gICAgICAgIC8vIElzc3VlIHtnZXQgc3VifSBvbmx5IGlmIHRoZSBjdXJyZW50IHVzZXIgaGFzIG5vIHAycCB0b3BpY3Mgd2l0aCB0aGUgdXBkYXRlZCB1c2VyIChwMnAgbmFtZSBpcyBub3QgaW4gY2FjaGUpLlxuICAgICAgICAvLyBPdGhlcndpc2UgJ21lJyB3aWxsIGlzc3VlIGEge2dldCBkZXNjfSByZXF1ZXN0LlxuICAgICAgICBpZiAocHJlcy5zcmMgJiYgIXRoaXMuX3Rpbm9kZS5pc1RvcGljQ2FjaGVkKHByZXMuc3JjKSkge1xuICAgICAgICAgIHRoaXMuZ2V0TWV0YSh0aGlzLnN0YXJ0TWV0YVF1ZXJ5KCkud2l0aExhdGVyT25lU3ViKHByZXMuc3JjKS5idWlsZCgpKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2Fjcyc6XG4gICAgICAgIHVpZCA9IHByZXMuc3JjIHx8IHRoaXMuX3Rpbm9kZS5nZXRDdXJyZW50VXNlcklEKCk7XG4gICAgICAgIHVzZXIgPSB0aGlzLl91c2Vyc1t1aWRdO1xuICAgICAgICBpZiAoIXVzZXIpIHtcbiAgICAgICAgICAvLyBVcGRhdGUgZm9yIGFuIHVua25vd24gdXNlcjogbm90aWZpY2F0aW9uIG9mIGEgbmV3IHN1YnNjcmlwdGlvbi5cbiAgICAgICAgICBjb25zdCBhY3MgPSBuZXcgQWNjZXNzTW9kZSgpLnVwZGF0ZUFsbChwcmVzLmRhY3MpO1xuICAgICAgICAgIGlmIChhY3MgJiYgYWNzLm1vZGUgIT0gQWNjZXNzTW9kZS5fTk9ORSkge1xuICAgICAgICAgICAgdXNlciA9IHRoaXMuX2NhY2hlR2V0VXNlcih1aWQpO1xuICAgICAgICAgICAgaWYgKCF1c2VyKSB7XG4gICAgICAgICAgICAgIHVzZXIgPSB7XG4gICAgICAgICAgICAgICAgdXNlcjogdWlkLFxuICAgICAgICAgICAgICAgIGFjczogYWNzXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIHRoaXMuZ2V0TWV0YSh0aGlzLnN0YXJ0TWV0YVF1ZXJ5KCkud2l0aE9uZVN1Yih1bmRlZmluZWQsIHVpZCkuYnVpbGQoKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB1c2VyLmFjcyA9IGFjcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHVzZXIudXBkYXRlZCA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9wcm9jZXNzTWV0YVN1YihbdXNlcl0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBLbm93biB1c2VyXG4gICAgICAgICAgdXNlci5hY3MudXBkYXRlQWxsKHByZXMuZGFjcyk7XG4gICAgICAgICAgLy8gVXBkYXRlIHVzZXIncyBhY2Nlc3MgbW9kZS5cbiAgICAgICAgICB0aGlzLl9wcm9jZXNzTWV0YVN1Yihbe1xuICAgICAgICAgICAgdXNlcjogdWlkLFxuICAgICAgICAgICAgdXBkYXRlZDogbmV3IERhdGUoKSxcbiAgICAgICAgICAgIGFjczogdXNlci5hY3NcbiAgICAgICAgICB9XSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aGlzLl90aW5vZGUubG9nZ2VyKFwiSU5GTzogSWdub3JlZCBwcmVzZW5jZSB1cGRhdGVcIiwgcHJlcy53aGF0KTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vblByZXMpIHtcbiAgICAgIHRoaXMub25QcmVzKHByZXMpO1xuICAgIH1cbiAgfVxuICAvLyBQcm9jZXNzIHtpbmZvfSBtZXNzYWdlXG4gIF9yb3V0ZUluZm8oaW5mbykge1xuICAgIGlmIChpbmZvLndoYXQgIT09ICdrcCcpIHtcbiAgICAgIGNvbnN0IHVzZXIgPSB0aGlzLl91c2Vyc1tpbmZvLmZyb21dO1xuICAgICAgaWYgKHVzZXIpIHtcbiAgICAgICAgdXNlcltpbmZvLndoYXRdID0gaW5mby5zZXE7XG4gICAgICAgIGlmICh1c2VyLnJlY3YgPCB1c2VyLnJlYWQpIHtcbiAgICAgICAgICB1c2VyLnJlY3YgPSB1c2VyLnJlYWQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNvbnN0IG1zZyA9IHRoaXMubGF0ZXN0TWVzc2FnZSgpO1xuICAgICAgaWYgKG1zZykge1xuICAgICAgICB0aGlzLm1zZ1N0YXR1cyhtc2csIHRydWUpO1xuICAgICAgfVxuXG4gICAgICAvLyBJZiB0aGlzIGlzIGFuIHVwZGF0ZSBmcm9tIHRoZSBjdXJyZW50IHVzZXIsIHVwZGF0ZSB0aGUgY2FjaGUgd2l0aCB0aGUgbmV3IGNvdW50LlxuICAgICAgaWYgKHRoaXMuX3Rpbm9kZS5pc01lKGluZm8uZnJvbSkpIHtcbiAgICAgICAgdGhpcy5fdXBkYXRlUmVhZFJlY3YoaW5mby53aGF0LCBpbmZvLnNlcSk7XG4gICAgICB9XG5cbiAgICAgIC8vIE5vdGlmeSAnbWUnIGxpc3RlbmVyIG9mIHRoZSBzdGF0dXMgY2hhbmdlLlxuICAgICAgdGhpcy5fdGlub2RlLmdldE1lVG9waWMoKS5fcmVmcmVzaENvbnRhY3QoaW5mby53aGF0LCB0aGlzKTtcbiAgICB9XG4gICAgaWYgKHRoaXMub25JbmZvKSB7XG4gICAgICB0aGlzLm9uSW5mbyhpbmZvKTtcbiAgICB9XG4gIH1cbiAgLy8gQ2FsbGVkIGJ5IFRpbm9kZSB3aGVuIG1ldGEuZGVzYyBwYWNrZXQgaXMgcmVjZWl2ZWQuXG4gIC8vIENhbGxlZCBieSAnbWUnIHRvcGljIG9uIGNvbnRhY3QgdXBkYXRlIChkZXNjLl9ub0ZvcndhcmRpbmcgaXMgdHJ1ZSkuXG4gIF9wcm9jZXNzTWV0YURlc2MoZGVzYykge1xuICAgIGlmICh0aGlzLmlzUDJQVHlwZSgpKSB7XG4gICAgICAvLyBTeW50aGV0aWMgZGVzYyBtYXkgaW5jbHVkZSBkZWZhY3MgZm9yIHAycCB0b3BpY3Mgd2hpY2ggaXMgdXNlbGVzcy5cbiAgICAgIC8vIFJlbW92ZSBpdC5cbiAgICAgIGRlbGV0ZSBkZXNjLmRlZmFjcztcblxuICAgICAgLy8gVXBkYXRlIHRvIHAycCBkZXNjIGlzIHRoZSBzYW1lIGFzIHVzZXIgdXBkYXRlLiBVcGRhdGUgY2FjaGVkIHVzZXIuXG4gICAgICB0aGlzLl90aW5vZGUuX2RiLnVwZFVzZXIodGhpcy5uYW1lLCBkZXNjLnB1YmxpYyk7XG4gICAgfVxuXG4gICAgLy8gQ29weSBwYXJhbWV0ZXJzIGZyb20gZGVzYyBvYmplY3QgdG8gdGhpcyB0b3BpYy5cbiAgICBtZXJnZU9iaih0aGlzLCBkZXNjKTtcbiAgICAvLyBVcGRhdGUgcGVyc2lzdGVudCBjYWNoZS5cbiAgICB0aGlzLl90aW5vZGUuX2RiLnVwZFRvcGljKHRoaXMpO1xuXG4gICAgLy8gTm90aWZ5ICdtZScgbGlzdGVuZXIsIGlmIGF2YWlsYWJsZTpcbiAgICBpZiAodGhpcy5uYW1lICE9PSBDb25zdC5UT1BJQ19NRSAmJiAhZGVzYy5fbm9Gb3J3YXJkaW5nKSB7XG4gICAgICBjb25zdCBtZSA9IHRoaXMuX3Rpbm9kZS5nZXRNZVRvcGljKCk7XG4gICAgICBpZiAobWUub25NZXRhU3ViKSB7XG4gICAgICAgIG1lLm9uTWV0YVN1Yih0aGlzKTtcbiAgICAgIH1cbiAgICAgIGlmIChtZS5vblN1YnNVcGRhdGVkKSB7XG4gICAgICAgIG1lLm9uU3Vic1VwZGF0ZWQoW3RoaXMubmFtZV0sIDEpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLm9uTWV0YURlc2MpIHtcbiAgICAgIHRoaXMub25NZXRhRGVzYyh0aGlzKTtcbiAgICB9XG4gIH1cbiAgLy8gQ2FsbGVkIGJ5IFRpbm9kZSB3aGVuIG1ldGEuc3ViIGlzIHJlY2l2ZWQgb3IgaW4gcmVzcG9uc2UgdG8gcmVjZWl2ZWRcbiAgLy8ge2N0cmx9IGFmdGVyIHNldE1ldGEtc3ViLlxuICBfcHJvY2Vzc01ldGFTdWIoc3Vicykge1xuICAgIGZvciAobGV0IGlkeCBpbiBzdWJzKSB7XG4gICAgICBjb25zdCBzdWIgPSBzdWJzW2lkeF07XG5cbiAgICAgIC8vIEZpbGwgZGVmYXVsdHMuXG4gICAgICBzdWIub25saW5lID0gISFzdWIub25saW5lO1xuICAgICAgLy8gVXBkYXRlIHRpbWVzdGFtcCBvZiB0aGUgbW9zdCByZWNlbnQgc3Vic2NyaXB0aW9uIHVwZGF0ZS5cbiAgICAgIHRoaXMuX2xhc3RTdWJzVXBkYXRlID0gbmV3IERhdGUoTWF0aC5tYXgodGhpcy5fbGFzdFN1YnNVcGRhdGUsIHN1Yi51cGRhdGVkKSk7XG5cbiAgICAgIGxldCB1c2VyID0gbnVsbDtcbiAgICAgIGlmICghc3ViLmRlbGV0ZWQpIHtcbiAgICAgICAgLy8gSWYgdGhpcyBpcyBhIGNoYW5nZSB0byB1c2VyJ3Mgb3duIHBlcm1pc3Npb25zLCB1cGRhdGUgdGhlbSBpbiB0b3BpYyB0b28uXG4gICAgICAgIC8vIERlc2Mgd2lsbCB1cGRhdGUgJ21lJyB0b3BpYy5cbiAgICAgICAgaWYgKHRoaXMuX3Rpbm9kZS5pc01lKHN1Yi51c2VyKSAmJiBzdWIuYWNzKSB7XG4gICAgICAgICAgdGhpcy5fcHJvY2Vzc01ldGFEZXNjKHtcbiAgICAgICAgICAgIHVwZGF0ZWQ6IHN1Yi51cGRhdGVkLFxuICAgICAgICAgICAgdG91Y2hlZDogc3ViLnRvdWNoZWQsXG4gICAgICAgICAgICBhY3M6IHN1Yi5hY3NcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB1c2VyID0gdGhpcy5fdXBkYXRlQ2FjaGVkVXNlcihzdWIudXNlciwgc3ViKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFN1YnNjcmlwdGlvbiBpcyBkZWxldGVkLCByZW1vdmUgaXQgZnJvbSB0b3BpYyAoYnV0IGxlYXZlIGluIFVzZXJzIGNhY2hlKVxuICAgICAgICBkZWxldGUgdGhpcy5fdXNlcnNbc3ViLnVzZXJdO1xuICAgICAgICB1c2VyID0gc3ViO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5vbk1ldGFTdWIpIHtcbiAgICAgICAgdGhpcy5vbk1ldGFTdWIodXNlcik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMub25TdWJzVXBkYXRlZCkge1xuICAgICAgdGhpcy5vblN1YnNVcGRhdGVkKE9iamVjdC5rZXlzKHRoaXMuX3VzZXJzKSk7XG4gICAgfVxuICB9XG4gIC8vIENhbGxlZCBieSBUaW5vZGUgd2hlbiBtZXRhLnRhZ3MgaXMgcmVjaXZlZC5cbiAgX3Byb2Nlc3NNZXRhVGFncyh0YWdzKSB7XG4gICAgaWYgKHRhZ3MubGVuZ3RoID09IDEgJiYgdGFnc1swXSA9PSBDb25zdC5ERUxfQ0hBUikge1xuICAgICAgdGFncyA9IFtdO1xuICAgIH1cbiAgICB0aGlzLl90YWdzID0gdGFncztcbiAgICBpZiAodGhpcy5vblRhZ3NVcGRhdGVkKSB7XG4gICAgICB0aGlzLm9uVGFnc1VwZGF0ZWQodGFncyk7XG4gICAgfVxuICB9XG4gIC8vIERvIG5vdGhpbmcgZm9yIHRvcGljcyBvdGhlciB0aGFuICdtZSdcbiAgX3Byb2Nlc3NNZXRhQ3JlZHMoY3JlZHMpIHt9XG4gIC8vIERlbGV0ZSBjYWNoZWQgbWVzc2FnZXMgYW5kIHVwZGF0ZSBjYWNoZWQgdHJhbnNhY3Rpb24gSURzXG4gIF9wcm9jZXNzRGVsTWVzc2FnZXMoY2xlYXIsIGRlbHNlcSkge1xuICAgIHRoaXMuX21heERlbCA9IE1hdGgubWF4KGNsZWFyLCB0aGlzLl9tYXhEZWwpO1xuICAgIHRoaXMuY2xlYXIgPSBNYXRoLm1heChjbGVhciwgdGhpcy5jbGVhcik7XG4gICAgY29uc3QgdG9waWMgPSB0aGlzO1xuICAgIGxldCBjb3VudCA9IDA7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoZGVsc2VxKSkge1xuICAgICAgZGVsc2VxLmZvckVhY2goZnVuY3Rpb24ocmFuZ2UpIHtcbiAgICAgICAgaWYgKCFyYW5nZS5oaSkge1xuICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgICAgdG9waWMuZmx1c2hNZXNzYWdlKHJhbmdlLmxvdyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZm9yIChsZXQgaSA9IHJhbmdlLmxvdzsgaSA8IHJhbmdlLmhpOyBpKyspIHtcbiAgICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgICAgICB0b3BpYy5mbHVzaE1lc3NhZ2UoaSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoY291bnQgPiAwKSB7XG4gICAgICB0aGlzLl91cGRhdGVEZWxldGVkUmFuZ2VzKCk7XG5cbiAgICAgIGlmICh0aGlzLm9uRGF0YSkge1xuICAgICAgICB0aGlzLm9uRGF0YSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICAvLyBUb3BpYyBpcyBpbmZvcm1lZCB0aGF0IHRoZSBlbnRpcmUgcmVzcG9uc2UgdG8ge2dldCB3aGF0PWRhdGF9IGhhcyBiZWVuIHJlY2VpdmVkLlxuICBfYWxsTWVzc2FnZXNSZWNlaXZlZChjb3VudCkge1xuICAgIHRoaXMuX3VwZGF0ZURlbGV0ZWRSYW5nZXMoKTtcblxuICAgIGlmICh0aGlzLm9uQWxsTWVzc2FnZXNSZWNlaXZlZCkge1xuICAgICAgdGhpcy5vbkFsbE1lc3NhZ2VzUmVjZWl2ZWQoY291bnQpO1xuICAgIH1cbiAgfVxuICAvLyBSZXNldCBzdWJzY3JpYmVkIHN0YXRlXG4gIF9yZXNldFN1YigpIHtcbiAgICB0aGlzLl9hdHRhY2hlZCA9IGZhbHNlO1xuICB9XG4gIC8vIFRoaXMgdG9waWMgaXMgZWl0aGVyIGRlbGV0ZWQgb3IgdW5zdWJzY3JpYmVkIGZyb20uXG4gIF9nb25lKCkge1xuICAgIHRoaXMuX21lc3NhZ2VzLnJlc2V0KCk7XG4gICAgdGhpcy5fdGlub2RlLl9kYi5yZW1NZXNzYWdlcyh0aGlzLm5hbWUpO1xuICAgIHRoaXMuX3VzZXJzID0ge307XG4gICAgdGhpcy5hY3MgPSBuZXcgQWNjZXNzTW9kZShudWxsKTtcbiAgICB0aGlzLnByaXZhdGUgPSBudWxsO1xuICAgIHRoaXMucHVibGljID0gbnVsbDtcbiAgICB0aGlzLnRydXN0ZWQgPSBudWxsO1xuICAgIHRoaXMuX21heFNlcSA9IDA7XG4gICAgdGhpcy5fbWluU2VxID0gMDtcbiAgICB0aGlzLl9hdHRhY2hlZCA9IGZhbHNlO1xuXG4gICAgY29uc3QgbWUgPSB0aGlzLl90aW5vZGUuZ2V0TWVUb3BpYygpO1xuICAgIGlmIChtZSkge1xuICAgICAgbWUuX3JvdXRlUHJlcyh7XG4gICAgICAgIF9ub0ZvcndhcmRpbmc6IHRydWUsXG4gICAgICAgIHdoYXQ6ICdnb25lJyxcbiAgICAgICAgdG9waWM6IENvbnN0LlRPUElDX01FLFxuICAgICAgICBzcmM6IHRoaXMubmFtZVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlmICh0aGlzLm9uRGVsZXRlVG9waWMpIHtcbiAgICAgIHRoaXMub25EZWxldGVUb3BpYygpO1xuICAgIH1cbiAgfVxuICAvLyBVcGRhdGUgZ2xvYmFsIHVzZXIgY2FjaGUgYW5kIGxvY2FsIHN1YnNjcmliZXJzIGNhY2hlLlxuICAvLyBEb24ndCBjYWxsIHRoaXMgbWV0aG9kIGZvciBub24tc3Vic2NyaWJlcnMuXG4gIF91cGRhdGVDYWNoZWRVc2VyKHVpZCwgb2JqKSB7XG4gICAgLy8gRmV0Y2ggdXNlciBvYmplY3QgZnJvbSB0aGUgZ2xvYmFsIGNhY2hlLlxuICAgIC8vIFRoaXMgaXMgYSBjbG9uZSBvZiB0aGUgc3RvcmVkIG9iamVjdFxuICAgIGxldCBjYWNoZWQgPSB0aGlzLl9jYWNoZUdldFVzZXIodWlkKTtcbiAgICBjYWNoZWQgPSBtZXJnZU9iaihjYWNoZWQgfHwge30sIG9iaik7XG4gICAgLy8gU2F2ZSB0byBnbG9iYWwgY2FjaGVcbiAgICB0aGlzLl9jYWNoZVB1dFVzZXIodWlkLCBjYWNoZWQpO1xuICAgIC8vIFNhdmUgdG8gdGhlIGxpc3Qgb2YgdG9waWMgc3Vic3JpYmVycy5cbiAgICByZXR1cm4gbWVyZ2VUb0NhY2hlKHRoaXMuX3VzZXJzLCB1aWQsIGNhY2hlZCk7XG4gIH1cbiAgLy8gR2V0IGxvY2FsIHNlcUlkIGZvciBhIHF1ZXVlZCBtZXNzYWdlLlxuICBfZ2V0UXVldWVkU2VxSWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3F1ZXVlZFNlcUlkKys7XG4gIH1cbiAgLy8gQ2FsY3VsYXRlIHJhbmdlcyBvZiBtaXNzaW5nIG1lc3NhZ2VzLlxuICBfdXBkYXRlRGVsZXRlZFJhbmdlcygpIHtcbiAgICBjb25zdCByYW5nZXMgPSBbXTtcblxuICAgIC8vIEdhcCBtYXJrZXIsIHBvc3NpYmx5IGVtcHR5LlxuICAgIGxldCBwcmV2ID0gbnVsbDtcblxuICAgIC8vIENoZWNrIGZvciBnYXAgaW4gdGhlIGJlZ2lubmluZywgYmVmb3JlIHRoZSBmaXJzdCBtZXNzYWdlLlxuICAgIGNvbnN0IGZpcnN0ID0gdGhpcy5fbWVzc2FnZXMuZ2V0QXQoMCk7XG4gICAgaWYgKGZpcnN0ICYmIHRoaXMuX21pblNlcSA+IDEgJiYgIXRoaXMuX25vRWFybGllck1zZ3MpIHtcbiAgICAgIC8vIFNvbWUgbWVzc2FnZXMgYXJlIG1pc3NpbmcgaW4gdGhlIGJlZ2lubmluZy5cbiAgICAgIGlmIChmaXJzdC5oaSkge1xuICAgICAgICAvLyBUaGUgZmlyc3QgbWVzc2FnZSBhbHJlYWR5IHJlcHJlc2VudHMgYSBnYXAuXG4gICAgICAgIGlmIChmaXJzdC5zZXEgPiAxKSB7XG4gICAgICAgICAgZmlyc3Quc2VxID0gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZmlyc3QuaGkgPCB0aGlzLl9taW5TZXEgLSAxKSB7XG4gICAgICAgICAgZmlyc3QuaGkgPSB0aGlzLl9taW5TZXEgLSAxO1xuICAgICAgICB9XG4gICAgICAgIHByZXYgPSBmaXJzdDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIENyZWF0ZSBuZXcgZ2FwLlxuICAgICAgICBwcmV2ID0ge1xuICAgICAgICAgIHNlcTogMSxcbiAgICAgICAgICBoaTogdGhpcy5fbWluU2VxIC0gMVxuICAgICAgICB9O1xuICAgICAgICByYW5nZXMucHVzaChwcmV2KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gTm8gZ2FwIGluIHRoZSBiZWdpbm5pbmcuXG4gICAgICBwcmV2ID0ge1xuICAgICAgICBzZXE6IDAsXG4gICAgICAgIGhpOiAwXG4gICAgICB9O1xuICAgIH1cblxuICAgIC8vIEZpbmQgbmV3IGdhcHMgaW4gdGhlIGxpc3Qgb2YgcmVjZWl2ZWQgbWVzc2FnZXMuIFRoZSBsaXN0IGNvbnRhaW5zIG1lc3NhZ2VzLXByb3BlciBhcyB3ZWxsXG4gICAgLy8gYXMgcGxhY2Vob2xkZXJzIGZvciBkZWxldGVkIHJhbmdlcy5cbiAgICAvLyBUaGUgbWVzc2FnZXMgYXJlIGl0ZXJhdGVkIGJ5IHNlcSBJRCBpbiBhc2NlbmRpbmcgb3JkZXIuXG4gICAgdGhpcy5fbWVzc2FnZXMuZmlsdGVyKChkYXRhKSA9PiB7XG4gICAgICAvLyBEbyBub3QgY3JlYXRlIGEgZ2FwIGJldHdlZW4gdGhlIGxhc3Qgc2VudCBtZXNzYWdlIGFuZCB0aGUgZmlyc3QgdW5zZW50IGFzIHdlbGwgYXMgYmV0d2VlbiB1bnNlbnQgbWVzc2FnZXMuXG4gICAgICBpZiAoZGF0YS5zZXEgPj0gQ29uc3QuTE9DQUxfU0VRSUQpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIC8vIENoZWNrIGZvciBhIGdhcCBiZXR3ZWVuIHRoZSBwcmV2aW91cyBtZXNzYWdlL21hcmtlciBhbmQgdGhpcyBtZXNzYWdlL21hcmtlci5cbiAgICAgIGlmIChkYXRhLnNlcSA9PSAocHJldi5oaSB8fCBwcmV2LnNlcSkgKyAxKSB7XG4gICAgICAgIC8vIE5vIGdhcCBiZXR3ZWVuIHRoaXMgbWVzc2FnZSBhbmQgdGhlIHByZXZpb3VzLlxuICAgICAgICBpZiAoZGF0YS5oaSAmJiBwcmV2LmhpKSB7XG4gICAgICAgICAgLy8gVHdvIGdhcCBtYXJrZXJzIGluIGEgcm93LiBFeHRlbmQgdGhlIHByZXZpb3VzIG9uZSwgZGlzY2FyZCB0aGUgY3VycmVudC5cbiAgICAgICAgICBwcmV2LmhpID0gZGF0YS5oaTtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcHJldiA9IGRhdGE7XG5cbiAgICAgICAgLy8gS2VlcCBjdXJyZW50LlxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgLy8gRm91bmQgYSBuZXcgZ2FwLlxuICAgICAgLy8gQ2hlY2sgaWYgdGhlIHByZXZpb3VzIGlzIGFsc28gYSBnYXAgbWFya2VyLlxuICAgICAgaWYgKHByZXYuaGkpIHtcbiAgICAgICAgLy8gQWx0ZXIgaXQgaW5zdGVhZCBvZiBjcmVhdGluZyBhIG5ldyBvbmUuXG4gICAgICAgIHByZXYuaGkgPSBkYXRhLmhpIHx8IGRhdGEuc2VxO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gUHJldmlvdXMgaXMgbm90IGEgZ2FwIG1hcmtlci4gQ3JlYXRlIGEgbmV3IG9uZS5cbiAgICAgICAgcHJldiA9IHtcbiAgICAgICAgICBzZXE6IHByZXYuc2VxICsgMSxcbiAgICAgICAgICBoaTogZGF0YS5oaSB8fCBkYXRhLnNlcVxuICAgICAgICB9O1xuICAgICAgICByYW5nZXMucHVzaChwcmV2KTtcbiAgICAgIH1cblxuICAgICAgLy8gSWYgbWFya2VyLCByZW1vdmU7IGtlZXAgaWYgcmVndWxhciBtZXNzYWdlLlxuICAgICAgaWYgKCFkYXRhLmhpKSB7XG4gICAgICAgIC8vIEtlZXBpbmcgdGhlIGN1cnJlbnQgcmVndWxhciBtZXNzYWdlLCBzYXZlIGl0IGFzIHByZXZpb3VzLlxuICAgICAgICBwcmV2ID0gZGF0YTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIC8vIERpc2NhcmQgdGhlIGN1cnJlbnQgZ2FwIG1hcmtlcjogd2UgZWl0aGVyIGNyZWF0ZWQgYW4gZWFybGllciBnYXAsIG9yIGV4dGVuZGVkIHRoZSBwcmV2b3VzIG9uZS5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KTtcblxuICAgIC8vIENoZWNrIGZvciBtaXNzaW5nIG1lc3NhZ2VzIGF0IHRoZSBlbmQuXG4gICAgLy8gQWxsIG1lc3NhZ2VzIGNvdWxkIGJlIG1pc3Npbmcgb3IgaXQgY291bGQgYmUgYSBuZXcgdG9waWMgd2l0aCBubyBtZXNzYWdlcy5cbiAgICBjb25zdCBsYXN0ID0gdGhpcy5fbWVzc2FnZXMuZ2V0TGFzdCgpO1xuICAgIGNvbnN0IG1heFNlcSA9IE1hdGgubWF4KHRoaXMuc2VxLCB0aGlzLl9tYXhTZXEpIHx8IDA7XG4gICAgaWYgKChtYXhTZXEgPiAwICYmICFsYXN0KSB8fCAobGFzdCAmJiAoKGxhc3QuaGkgfHwgbGFzdC5zZXEpIDwgbWF4U2VxKSkpIHtcbiAgICAgIGlmIChsYXN0ICYmIGxhc3QuaGkpIHtcbiAgICAgICAgLy8gRXh0ZW5kIGV4aXN0aW5nIGdhcFxuICAgICAgICBsYXN0LmhpID0gbWF4U2VxO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQ3JlYXRlIG5ldyBnYXAuXG4gICAgICAgIHJhbmdlcy5wdXNoKHtcbiAgICAgICAgICBzZXE6IGxhc3QgPyBsYXN0LnNlcSArIDEgOiAxLFxuICAgICAgICAgIGhpOiBtYXhTZXFcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gSW5zZXJ0IG5ldyBnYXBzIGludG8gY2FjaGUuXG4gICAgcmFuZ2VzLmZvckVhY2goKGdhcCkgPT4ge1xuICAgICAgZ2FwLl9zdGF0dXMgPSBDb25zdC5NRVNTQUdFX1NUQVRVU19ERUxfUkFOR0U7XG4gICAgICB0aGlzLl9tZXNzYWdlcy5wdXQoZ2FwKTtcbiAgICB9KTtcbiAgfVxuICAvLyBMb2FkIG1vc3QgcmVjZW50IG1lc3NhZ2VzIGZyb20gcGVyc2lzdGVudCBjYWNoZS5cbiAgX2xvYWRNZXNzYWdlcyhkYiwgcGFyYW1zKSB7XG4gICAgY29uc3Qge1xuICAgICAgc2luY2UsXG4gICAgICBiZWZvcmUsXG4gICAgICBsaW1pdFxuICAgIH0gPSBwYXJhbXMgfHwge307XG4gICAgcmV0dXJuIGRiLnJlYWRNZXNzYWdlcyh0aGlzLm5hbWUsIHtcbiAgICAgICAgc2luY2U6IHNpbmNlLFxuICAgICAgICBiZWZvcmU6IGJlZm9yZSxcbiAgICAgICAgbGltaXQ6IGxpbWl0IHx8IENvbnN0LkRFRkFVTFRfTUVTU0FHRVNfUEFHRVxuICAgICAgfSlcbiAgICAgIC50aGVuKChtc2dzKSA9PiB7XG4gICAgICAgIG1zZ3MuZm9yRWFjaCgoZGF0YSkgPT4ge1xuICAgICAgICAgIGlmIChkYXRhLnNlcSA+IHRoaXMuX21heFNlcSkge1xuICAgICAgICAgICAgdGhpcy5fbWF4U2VxID0gZGF0YS5zZXE7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChkYXRhLnNlcSA8IHRoaXMuX21pblNlcSB8fCB0aGlzLl9taW5TZXEgPT0gMCkge1xuICAgICAgICAgICAgdGhpcy5fbWluU2VxID0gZGF0YS5zZXE7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuX21lc3NhZ2VzLnB1dChkYXRhKTtcbiAgICAgICAgICB0aGlzLl9tYXliZVVwZGF0ZU1lc3NhZ2VWZXJzaW9uc0NhY2hlKGRhdGEpO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKG1zZ3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHRoaXMuX3VwZGF0ZURlbGV0ZWRSYW5nZXMoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbXNncy5sZW5ndGg7XG4gICAgICB9KTtcbiAgfVxuICAvLyBQdXNoIG9yIHtwcmVzfTogbWVzc2FnZSByZWNlaXZlZC5cbiAgX3VwZGF0ZVJlY2VpdmVkKHNlcSwgYWN0KSB7XG4gICAgdGhpcy50b3VjaGVkID0gbmV3IERhdGUoKTtcbiAgICB0aGlzLnNlcSA9IHNlcSB8IDA7XG4gICAgLy8gQ2hlY2sgaWYgbWVzc2FnZSBpcyBzZW50IGJ5IHRoZSBjdXJyZW50IHVzZXIuIElmIHNvIGl0J3MgYmVlbiByZWFkIGFscmVhZHkuXG4gICAgaWYgKCFhY3QgfHwgdGhpcy5fdGlub2RlLmlzTWUoYWN0KSkge1xuICAgICAgdGhpcy5yZWFkID0gdGhpcy5yZWFkID8gTWF0aC5tYXgodGhpcy5yZWFkLCB0aGlzLnNlcSkgOiB0aGlzLnNlcTtcbiAgICAgIHRoaXMucmVjdiA9IHRoaXMucmVjdiA/IE1hdGgubWF4KHRoaXMucmVhZCwgdGhpcy5yZWN2KSA6IHRoaXMucmVhZDtcbiAgICB9XG4gICAgdGhpcy51bnJlYWQgPSB0aGlzLnNlcSAtICh0aGlzLnJlYWQgfCAwKTtcbiAgICB0aGlzLl90aW5vZGUuX2RiLnVwZFRvcGljKHRoaXMpO1xuICB9XG59XG5cblxuLyoqXG4gKiBAY2xhc3MgVG9waWNNZSAtIHNwZWNpYWwgY2FzZSBvZiB7QGxpbmsgVGlub2RlLlRvcGljfSBmb3JcbiAqIG1hbmFnaW5nIGRhdGEgb2YgdGhlIGN1cnJlbnQgdXNlciwgaW5jbHVkaW5nIGNvbnRhY3QgbGlzdC5cbiAqIEBleHRlbmRzIFRpbm9kZS5Ub3BpY1xuICogQG1lbWJlcm9mIFRpbm9kZVxuICpcbiAqIEBwYXJhbSB7VG9waWNNZS5DYWxsYmFja3N9IGNhbGxiYWNrcyAtIENhbGxiYWNrcyB0byByZWNlaXZlIHZhcmlvdXMgZXZlbnRzLlxuICovXG4vKipcbiAqIEBjbGFzcyBUb3BpY01lIC0gc3BlY2lhbCBjYXNlIG9mIHtAbGluayBUaW5vZGUuVG9waWN9IGZvclxuICogbWFuYWdpbmcgZGF0YSBvZiB0aGUgY3VycmVudCB1c2VyLCBpbmNsdWRpbmcgY29udGFjdCBsaXN0LlxuICogQGV4dGVuZHMgVGlub2RlLlRvcGljXG4gKiBAbWVtYmVyb2YgVGlub2RlXG4gKlxuICogQHBhcmFtIHtUb3BpY01lLkNhbGxiYWNrc30gY2FsbGJhY2tzIC0gQ2FsbGJhY2tzIHRvIHJlY2VpdmUgdmFyaW91cyBldmVudHMuXG4gKi9cbmV4cG9ydCBjbGFzcyBUb3BpY01lIGV4dGVuZHMgVG9waWMge1xuICBvbkNvbnRhY3RVcGRhdGU7XG5cbiAgY29uc3RydWN0b3IoY2FsbGJhY2tzKSB7XG4gICAgc3VwZXIoQ29uc3QuVE9QSUNfTUUsIGNhbGxiYWNrcyk7XG5cbiAgICAvLyBtZS1zcGVjaWZpYyBjYWxsYmFja3NcbiAgICBpZiAoY2FsbGJhY2tzKSB7XG4gICAgICB0aGlzLm9uQ29udGFjdFVwZGF0ZSA9IGNhbGxiYWNrcy5vbkNvbnRhY3RVcGRhdGU7XG4gICAgfVxuICB9XG5cbiAgLy8gT3ZlcnJpZGUgdGhlIG9yaWdpbmFsIFRvcGljLl9wcm9jZXNzTWV0YURlc2MuXG4gIF9wcm9jZXNzTWV0YURlc2MoZGVzYykge1xuICAgIC8vIENoZWNrIGlmIG9ubGluZSBjb250YWN0cyBuZWVkIHRvIGJlIHR1cm5lZCBvZmYgYmVjYXVzZSBQIHBlcm1pc3Npb24gd2FzIHJlbW92ZWQuXG4gICAgY29uc3QgdHVybk9mZiA9IChkZXNjLmFjcyAmJiAhZGVzYy5hY3MuaXNQcmVzZW5jZXIoKSkgJiYgKHRoaXMuYWNzICYmIHRoaXMuYWNzLmlzUHJlc2VuY2VyKCkpO1xuXG4gICAgLy8gQ29weSBwYXJhbWV0ZXJzIGZyb20gZGVzYyBvYmplY3QgdG8gdGhpcyB0b3BpYy5cbiAgICBtZXJnZU9iaih0aGlzLCBkZXNjKTtcbiAgICB0aGlzLl90aW5vZGUuX2RiLnVwZFRvcGljKHRoaXMpO1xuICAgIC8vIFVwZGF0ZSBjdXJyZW50IHVzZXIncyByZWNvcmQgaW4gdGhlIGdsb2JhbCBjYWNoZS5cbiAgICB0aGlzLl91cGRhdGVDYWNoZWRVc2VyKHRoaXMuX3Rpbm9kZS5fbXlVSUQsIGRlc2MpO1xuXG4gICAgLy8gJ1AnIHBlcm1pc3Npb24gd2FzIHJlbW92ZWQuIEFsbCB0b3BpY3MgYXJlIG9mZmxpbmUgbm93LlxuICAgIGlmICh0dXJuT2ZmKSB7XG4gICAgICB0aGlzLl90aW5vZGUubWFwVG9waWNzKChjb250KSA9PiB7XG4gICAgICAgIGlmIChjb250Lm9ubGluZSkge1xuICAgICAgICAgIGNvbnQub25saW5lID0gZmFsc2U7XG4gICAgICAgICAgY29udC5zZWVuID0gT2JqZWN0LmFzc2lnbihjb250LnNlZW4gfHwge30sIHtcbiAgICAgICAgICAgIHdoZW46IG5ldyBEYXRlKClcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0aGlzLl9yZWZyZXNoQ29udGFjdCgnb2ZmJywgY29udCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm9uTWV0YURlc2MpIHtcbiAgICAgIHRoaXMub25NZXRhRGVzYyh0aGlzKTtcbiAgICB9XG4gIH1cblxuICAvLyBPdmVycmlkZSB0aGUgb3JpZ2luYWwgVG9waWMuX3Byb2Nlc3NNZXRhU3ViXG4gIF9wcm9jZXNzTWV0YVN1YihzdWJzKSB7XG4gICAgbGV0IHVwZGF0ZUNvdW50ID0gMDtcbiAgICBzdWJzLmZvckVhY2goKHN1YikgPT4ge1xuICAgICAgY29uc3QgdG9waWNOYW1lID0gc3ViLnRvcGljO1xuICAgICAgLy8gRG9uJ3Qgc2hvdyAnbWUnIGFuZCAnZm5kJyB0b3BpY3MgaW4gdGhlIGxpc3Qgb2YgY29udGFjdHMuXG4gICAgICBpZiAodG9waWNOYW1lID09IENvbnN0LlRPUElDX0ZORCB8fCB0b3BpY05hbWUgPT0gQ29uc3QuVE9QSUNfTUUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgc3ViLm9ubGluZSA9ICEhc3ViLm9ubGluZTtcblxuICAgICAgbGV0IGNvbnQgPSBudWxsO1xuICAgICAgaWYgKHN1Yi5kZWxldGVkKSB7XG4gICAgICAgIGNvbnQgPSBzdWI7XG4gICAgICAgIHRoaXMuX3Rpbm9kZS5jYWNoZVJlbVRvcGljKHRvcGljTmFtZSk7XG4gICAgICAgIHRoaXMuX3Rpbm9kZS5fZGIucmVtVG9waWModG9waWNOYW1lKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEVuc3VyZSB0aGUgdmFsdWVzIGFyZSBkZWZpbmVkIGFuZCBhcmUgaW50ZWdlcnMuXG4gICAgICAgIGlmICh0eXBlb2Ygc3ViLnNlcSAhPSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIHN1Yi5zZXEgPSBzdWIuc2VxIHwgMDtcbiAgICAgICAgICBzdWIucmVjdiA9IHN1Yi5yZWN2IHwgMDtcbiAgICAgICAgICBzdWIucmVhZCA9IHN1Yi5yZWFkIHwgMDtcbiAgICAgICAgICBzdWIudW5yZWFkID0gc3ViLnNlcSAtIHN1Yi5yZWFkO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdG9waWMgPSB0aGlzLl90aW5vZGUuZ2V0VG9waWModG9waWNOYW1lKTtcbiAgICAgICAgaWYgKHRvcGljLl9uZXcpIHtcbiAgICAgICAgICBkZWxldGUgdG9waWMuX25ldztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnQgPSBtZXJnZU9iaih0b3BpYywgc3ViKTtcbiAgICAgICAgdGhpcy5fdGlub2RlLl9kYi51cGRUb3BpYyhjb250KTtcblxuICAgICAgICBpZiAoVG9waWMuaXNQMlBUb3BpY05hbWUodG9waWNOYW1lKSkge1xuICAgICAgICAgIHRoaXMuX2NhY2hlUHV0VXNlcih0b3BpY05hbWUsIGNvbnQpO1xuICAgICAgICAgIHRoaXMuX3Rpbm9kZS5fZGIudXBkVXNlcih0b3BpY05hbWUsIGNvbnQucHVibGljKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBOb3RpZnkgdG9waWMgb2YgdGhlIHVwZGF0ZSBpZiBpdCdzIGFuIGV4dGVybmFsIHVwZGF0ZS5cbiAgICAgICAgaWYgKCFzdWIuX25vRm9yd2FyZGluZyAmJiB0b3BpYykge1xuICAgICAgICAgIHN1Yi5fbm9Gb3J3YXJkaW5nID0gdHJ1ZTtcbiAgICAgICAgICB0b3BpYy5fcHJvY2Vzc01ldGFEZXNjKHN1Yik7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdXBkYXRlQ291bnQrKztcblxuICAgICAgaWYgKHRoaXMub25NZXRhU3ViKSB7XG4gICAgICAgIHRoaXMub25NZXRhU3ViKGNvbnQpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMub25TdWJzVXBkYXRlZCAmJiB1cGRhdGVDb3VudCA+IDApIHtcbiAgICAgIGNvbnN0IGtleXMgPSBbXTtcbiAgICAgIHN1YnMuZm9yRWFjaCgocykgPT4ge1xuICAgICAgICBrZXlzLnB1c2gocy50b3BpYyk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMub25TdWJzVXBkYXRlZChrZXlzLCB1cGRhdGVDb3VudCk7XG4gICAgfVxuICB9XG5cbiAgLy8gQ2FsbGVkIGJ5IFRpbm9kZSB3aGVuIG1ldGEuc3ViIGlzIHJlY2l2ZWQuXG4gIF9wcm9jZXNzTWV0YUNyZWRzKGNyZWRzLCB1cGQpIHtcbiAgICBpZiAoY3JlZHMubGVuZ3RoID09IDEgJiYgY3JlZHNbMF0gPT0gQ29uc3QuREVMX0NIQVIpIHtcbiAgICAgIGNyZWRzID0gW107XG4gICAgfVxuICAgIGlmICh1cGQpIHtcbiAgICAgIGNyZWRzLmZvckVhY2goKGNyKSA9PiB7XG4gICAgICAgIGlmIChjci52YWwpIHtcbiAgICAgICAgICAvLyBBZGRpbmcgYSBjcmVkZW50aWFsLlxuICAgICAgICAgIGxldCBpZHggPSB0aGlzLl9jcmVkZW50aWFscy5maW5kSW5kZXgoKGVsKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gZWwubWV0aCA9PSBjci5tZXRoICYmIGVsLnZhbCA9PSBjci52YWw7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKGlkeCA8IDApIHtcbiAgICAgICAgICAgIC8vIE5vdCBmb3VuZC5cbiAgICAgICAgICAgIGlmICghY3IuZG9uZSkge1xuICAgICAgICAgICAgICAvLyBVbmNvbmZpcm1lZCBjcmVkZW50aWFsIHJlcGxhY2VzIHByZXZpb3VzIHVuY29uZmlybWVkIGNyZWRlbnRpYWwgb2YgdGhlIHNhbWUgbWV0aG9kLlxuICAgICAgICAgICAgICBpZHggPSB0aGlzLl9jcmVkZW50aWFscy5maW5kSW5kZXgoKGVsKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVsLm1ldGggPT0gY3IubWV0aCAmJiAhZWwuZG9uZTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIGlmIChpZHggPj0gMCkge1xuICAgICAgICAgICAgICAgIC8vIFJlbW92ZSBwcmV2aW91cyB1bmNvbmZpcm1lZCBjcmVkZW50aWFsLlxuICAgICAgICAgICAgICAgIHRoaXMuX2NyZWRlbnRpYWxzLnNwbGljZShpZHgsIDEpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9jcmVkZW50aWFscy5wdXNoKGNyKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gRm91bmQuIE1heWJlIGNoYW5nZSAnZG9uZScgc3RhdHVzLlxuICAgICAgICAgICAgdGhpcy5fY3JlZGVudGlhbHNbaWR4XS5kb25lID0gY3IuZG9uZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoY3IucmVzcCkge1xuICAgICAgICAgIC8vIEhhbmRsZSBjcmVkZW50aWFsIGNvbmZpcm1hdGlvbi5cbiAgICAgICAgICBjb25zdCBpZHggPSB0aGlzLl9jcmVkZW50aWFscy5maW5kSW5kZXgoKGVsKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gZWwubWV0aCA9PSBjci5tZXRoICYmICFlbC5kb25lO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmIChpZHggPj0gMCkge1xuICAgICAgICAgICAgdGhpcy5fY3JlZGVudGlhbHNbaWR4XS5kb25lID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9jcmVkZW50aWFscyA9IGNyZWRzO1xuICAgIH1cbiAgICBpZiAodGhpcy5vbkNyZWRzVXBkYXRlZCkge1xuICAgICAgdGhpcy5vbkNyZWRzVXBkYXRlZCh0aGlzLl9jcmVkZW50aWFscyk7XG4gICAgfVxuICB9XG5cbiAgLy8gUHJvY2VzcyBwcmVzZW5jZSBjaGFuZ2UgbWVzc2FnZVxuICBfcm91dGVQcmVzKHByZXMpIHtcbiAgICBpZiAocHJlcy53aGF0ID09ICd0ZXJtJykge1xuICAgICAgLy8gVGhlICdtZScgdG9waWMgaXRzZWxmIGlzIGRldGFjaGVkLiBNYXJrIGFzIHVuc3Vic2NyaWJlZC5cbiAgICAgIHRoaXMuX3Jlc2V0U3ViKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHByZXMud2hhdCA9PSAndXBkJyAmJiBwcmVzLnNyYyA9PSBDb25zdC5UT1BJQ19NRSkge1xuICAgICAgLy8gVXBkYXRlIHRvIG1lJ3MgZGVzY3JpcHRpb24uIFJlcXVlc3QgdXBkYXRlZCB2YWx1ZS5cbiAgICAgIHRoaXMuZ2V0TWV0YSh0aGlzLnN0YXJ0TWV0YVF1ZXJ5KCkud2l0aERlc2MoKS5idWlsZCgpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBjb250ID0gdGhpcy5fdGlub2RlLmNhY2hlR2V0VG9waWMocHJlcy5zcmMpO1xuICAgIGlmIChjb250KSB7XG4gICAgICBzd2l0Y2ggKHByZXMud2hhdCkge1xuICAgICAgICBjYXNlICdvbic6IC8vIHRvcGljIGNhbWUgb25saW5lXG4gICAgICAgICAgY29udC5vbmxpbmUgPSB0cnVlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdvZmYnOiAvLyB0b3BpYyB3ZW50IG9mZmxpbmVcbiAgICAgICAgICBpZiAoY29udC5vbmxpbmUpIHtcbiAgICAgICAgICAgIGNvbnQub25saW5lID0gZmFsc2U7XG4gICAgICAgICAgICBjb250LnNlZW4gPSBPYmplY3QuYXNzaWduKGNvbnQuc2VlbiB8fCB7fSwge1xuICAgICAgICAgICAgICB3aGVuOiBuZXcgRGF0ZSgpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ21zZyc6IC8vIG5ldyBtZXNzYWdlIHJlY2VpdmVkXG4gICAgICAgICAgY29udC5fdXBkYXRlUmVjZWl2ZWQocHJlcy5zZXEsIHByZXMuYWN0KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAndXBkJzogLy8gZGVzYyB1cGRhdGVkXG4gICAgICAgICAgLy8gUmVxdWVzdCB1cGRhdGVkIHN1YnNjcmlwdGlvbi5cbiAgICAgICAgICB0aGlzLmdldE1ldGEodGhpcy5zdGFydE1ldGFRdWVyeSgpLndpdGhMYXRlck9uZVN1YihwcmVzLnNyYykuYnVpbGQoKSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2Fjcyc6IC8vIGFjY2VzcyBtb2RlIGNoYW5nZWRcbiAgICAgICAgICBpZiAoY29udC5hY3MpIHtcbiAgICAgICAgICAgIGNvbnQuYWNzLnVwZGF0ZUFsbChwcmVzLmRhY3MpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb250LmFjcyA9IG5ldyBBY2Nlc3NNb2RlKCkudXBkYXRlQWxsKHByZXMuZGFjcyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnQudG91Y2hlZCA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3VhJzpcbiAgICAgICAgICAvLyB1c2VyIGFnZW50IGNoYW5nZWQuXG4gICAgICAgICAgY29udC5zZWVuID0ge1xuICAgICAgICAgICAgd2hlbjogbmV3IERhdGUoKSxcbiAgICAgICAgICAgIHVhOiBwcmVzLnVhXG4gICAgICAgICAgfTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAncmVjdic6XG4gICAgICAgICAgLy8gdXNlcidzIG90aGVyIHNlc3Npb24gbWFya2VkIHNvbWUgbWVzc2dlcyBhcyByZWNlaXZlZC5cbiAgICAgICAgICBwcmVzLnNlcSA9IHByZXMuc2VxIHwgMDtcbiAgICAgICAgICBjb250LnJlY3YgPSBjb250LnJlY3YgPyBNYXRoLm1heChjb250LnJlY3YsIHByZXMuc2VxKSA6IHByZXMuc2VxO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdyZWFkJzpcbiAgICAgICAgICAvLyB1c2VyJ3Mgb3RoZXIgc2Vzc2lvbiBtYXJrZWQgc29tZSBtZXNzYWdlcyBhcyByZWFkLlxuICAgICAgICAgIHByZXMuc2VxID0gcHJlcy5zZXEgfCAwO1xuICAgICAgICAgIGNvbnQucmVhZCA9IGNvbnQucmVhZCA/IE1hdGgubWF4KGNvbnQucmVhZCwgcHJlcy5zZXEpIDogcHJlcy5zZXE7XG4gICAgICAgICAgY29udC5yZWN2ID0gY29udC5yZWN2ID8gTWF0aC5tYXgoY29udC5yZWFkLCBjb250LnJlY3YpIDogY29udC5yZWN2O1xuICAgICAgICAgIGNvbnQudW5yZWFkID0gY29udC5zZXEgLSBjb250LnJlYWQ7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2dvbmUnOlxuICAgICAgICAgIC8vIHRvcGljIGRlbGV0ZWQgb3IgdW5zdWJzY3JpYmVkIGZyb20uXG4gICAgICAgICAgaWYgKCFjb250Ll9kZWxldGVkKSB7XG4gICAgICAgICAgICBjb250Ll9kZWxldGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIGNvbnQuX2F0dGFjaGVkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLl90aW5vZGUuX2RiLm1hcmtUb3BpY0FzRGVsZXRlZChwcmVzLnNyYyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3Rpbm9kZS5fZGIucmVtVG9waWMocHJlcy5zcmMpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnZGVsJzpcbiAgICAgICAgICAvLyBVcGRhdGUgdG9waWMuZGVsIHZhbHVlLlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHRoaXMuX3Rpbm9kZS5sb2dnZXIoXCJJTkZPOiBVbnN1cHBvcnRlZCBwcmVzZW5jZSB1cGRhdGUgaW4gJ21lJ1wiLCBwcmVzLndoYXQpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9yZWZyZXNoQ29udGFjdChwcmVzLndoYXQsIGNvbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAocHJlcy53aGF0ID09ICdhY3MnKSB7XG4gICAgICAgIC8vIE5ldyBzdWJzY3JpcHRpb25zIGFuZCBkZWxldGVkL2Jhbm5lZCBzdWJzY3JpcHRpb25zIGhhdmUgZnVsbFxuICAgICAgICAvLyBhY2Nlc3MgbW9kZSAobm8gKyBvciAtIGluIHRoZSBkYWNzIHN0cmluZykuIENoYW5nZXMgdG8ga25vd24gc3Vic2NyaXB0aW9ucyBhcmUgc2VudCBhc1xuICAgICAgICAvLyBkZWx0YXMsIGJ1dCB0aGV5IHNob3VsZCBub3QgaGFwcGVuIGhlcmUuXG4gICAgICAgIGNvbnN0IGFjcyA9IG5ldyBBY2Nlc3NNb2RlKHByZXMuZGFjcyk7XG4gICAgICAgIGlmICghYWNzIHx8IGFjcy5tb2RlID09IEFjY2Vzc01vZGUuX0lOVkFMSUQpIHtcbiAgICAgICAgICB0aGlzLl90aW5vZGUubG9nZ2VyKFwiRVJST1I6IEludmFsaWQgYWNjZXNzIG1vZGUgdXBkYXRlXCIsIHByZXMuc3JjLCBwcmVzLmRhY3MpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIGlmIChhY3MubW9kZSA9PSBBY2Nlc3NNb2RlLl9OT05FKSB7XG4gICAgICAgICAgdGhpcy5fdGlub2RlLmxvZ2dlcihcIldBUk5JTkc6IFJlbW92aW5nIG5vbi1leGlzdGVudCBzdWJzY3JpcHRpb25cIiwgcHJlcy5zcmMsIHByZXMuZGFjcyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIE5ldyBzdWJzY3JpcHRpb24uIFNlbmQgcmVxdWVzdCBmb3IgdGhlIGZ1bGwgZGVzY3JpcHRpb24uXG4gICAgICAgICAgLy8gVXNpbmcgLndpdGhPbmVTdWIgKG5vdCAud2l0aExhdGVyT25lU3ViKSB0byBtYWtlIHN1cmUgSWZNb2RpZmllZFNpbmNlIGlzIG5vdCBzZXQuXG4gICAgICAgICAgdGhpcy5nZXRNZXRhKHRoaXMuc3RhcnRNZXRhUXVlcnkoKS53aXRoT25lU3ViKHVuZGVmaW5lZCwgcHJlcy5zcmMpLmJ1aWxkKCkpO1xuICAgICAgICAgIC8vIENyZWF0ZSBhIGR1bW15IGVudHJ5IHRvIGNhdGNoIG9ubGluZSBzdGF0dXMgdXBkYXRlLlxuICAgICAgICAgIGNvbnN0IGR1bW15ID0gdGhpcy5fdGlub2RlLmdldFRvcGljKHByZXMuc3JjKTtcbiAgICAgICAgICBkdW1teS50b3BpYyA9IHByZXMuc3JjO1xuICAgICAgICAgIGR1bW15Lm9ubGluZSA9IGZhbHNlO1xuICAgICAgICAgIGR1bW15LmFjcyA9IGFjcztcbiAgICAgICAgICB0aGlzLl90aW5vZGUuX2RiLnVwZFRvcGljKGR1bW15KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChwcmVzLndoYXQgPT0gJ3RhZ3MnKSB7XG4gICAgICAgIHRoaXMuZ2V0TWV0YSh0aGlzLnN0YXJ0TWV0YVF1ZXJ5KCkud2l0aFRhZ3MoKS5idWlsZCgpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5vblByZXMpIHtcbiAgICAgIHRoaXMub25QcmVzKHByZXMpO1xuICAgIH1cbiAgfVxuXG4gIC8vIENvbnRhY3QgaXMgdXBkYXRlZCwgZXhlY3V0ZSBjYWxsYmFja3MuXG4gIF9yZWZyZXNoQ29udGFjdCh3aGF0LCBjb250KSB7XG4gICAgaWYgKHRoaXMub25Db250YWN0VXBkYXRlKSB7XG4gICAgICB0aGlzLm9uQ29udGFjdFVwZGF0ZSh3aGF0LCBjb250KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUHVibGlzaGluZyB0byBUb3BpY01lIGlzIG5vdCBzdXBwb3J0ZWQuIHtAbGluayBUb3BpYyNwdWJsaXNofSBpcyBvdmVycmlkZW4gYW5kIHRob3dzIGFuIHtFcnJvcn0gaWYgY2FsbGVkLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljTWUjXG4gICAqIEB0aHJvd3Mge0Vycm9yfSBBbHdheXMgdGhyb3dzIGFuIGVycm9yLlxuICAgKi9cbiAgcHVibGlzaCgpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiUHVibGlzaGluZyB0byAnbWUnIGlzIG5vdCBzdXBwb3J0ZWRcIikpO1xuICB9XG5cbiAgLyoqXG4gICAqIERlbGV0ZSB2YWxpZGF0aW9uIGNyZWRlbnRpYWwuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWNNZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gZGVsZXRlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1c2VyIC0gVXNlciBJRCB0byByZW1vdmUuXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gcmVjZWl2aW5nIHNlcnZlciByZXBseS5cbiAgICovXG4gIGRlbENyZWRlbnRpYWwobWV0aG9kLCB2YWx1ZSkge1xuICAgIGlmICghdGhpcy5fYXR0YWNoZWQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJDYW5ub3QgZGVsZXRlIGNyZWRlbnRpYWwgaW4gaW5hY3RpdmUgJ21lJyB0b3BpY1wiKSk7XG4gICAgfVxuICAgIC8vIFNlbmQge2RlbH0gbWVzc2FnZSwgcmV0dXJuIHByb21pc2VcbiAgICByZXR1cm4gdGhpcy5fdGlub2RlLmRlbENyZWRlbnRpYWwobWV0aG9kLCB2YWx1ZSkudGhlbigoY3RybCkgPT4ge1xuICAgICAgLy8gUmVtb3ZlIGRlbGV0ZWQgY3JlZGVudGlhbCBmcm9tIHRoZSBjYWNoZS5cbiAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5fY3JlZGVudGlhbHMuZmluZEluZGV4KChlbCkgPT4ge1xuICAgICAgICByZXR1cm4gZWwubWV0aCA9PSBtZXRob2QgJiYgZWwudmFsID09IHZhbHVlO1xuICAgICAgfSk7XG4gICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICB0aGlzLl9jcmVkZW50aWFscy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgfVxuICAgICAgLy8gTm90aWZ5IGxpc3RlbmVyc1xuICAgICAgaWYgKHRoaXMub25DcmVkc1VwZGF0ZWQpIHtcbiAgICAgICAgdGhpcy5vbkNyZWRzVXBkYXRlZCh0aGlzLl9jcmVkZW50aWFscyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY3RybDtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAY2FsbGJhY2sgY29udGFjdEZpbHRlclxuICAgKiBAcGFyYW0ge09iamVjdH0gY29udGFjdCB0byBjaGVjayBmb3IgaW5jbHVzaW9uLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgY29udGFjdCBzaG91bGQgYmUgcHJvY2Vzc2VkLCA8Y29kZT5mYWxzZTwvY29kZT4gdG8gZXhjbHVkZSBpdC5cbiAgICovXG4gIC8qKlxuICAgKiBJdGVyYXRlIG92ZXIgY2FjaGVkIGNvbnRhY3RzLlxuICAgKlxuICAgKiBAZnVuY3Rpb25cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpY01lI1xuICAgKiBAcGFyYW0ge1RvcGljTWUuQ29udGFjdENhbGxiYWNrfSBjYWxsYmFjayAtIENhbGxiYWNrIHRvIGNhbGwgZm9yIGVhY2ggY29udGFjdC5cbiAgICogQHBhcmFtIHtjb250YWN0RmlsdGVyPX0gZmlsdGVyIC0gT3B0aW9uYWxseSBmaWx0ZXIgY29udGFjdHM7IGluY2x1ZGUgYWxsIGlmIGZpbHRlciBpcyBmYWxzZS1pc2gsIG90aGVyd2lzZVxuICAgKiAgICAgIGluY2x1ZGUgdGhvc2UgZm9yIHdoaWNoIGZpbHRlciByZXR1cm5zIHRydWUtaXNoLlxuICAgKiBAcGFyYW0ge09iamVjdD19IGNvbnRleHQgLSBDb250ZXh0IHRvIHVzZSBmb3IgY2FsbGluZyB0aGUgYGNhbGxiYWNrYCwgaS5lLiB0aGUgdmFsdWUgb2YgYHRoaXNgIGluc2lkZSB0aGUgY2FsbGJhY2suXG4gICAqL1xuICBjb250YWN0cyhjYWxsYmFjaywgZmlsdGVyLCBjb250ZXh0KSB7XG4gICAgdGhpcy5fdGlub2RlLm1hcFRvcGljcygoYywgaWR4KSA9PiB7XG4gICAgICBpZiAoYy5pc0NvbW1UeXBlKCkgJiYgKCFmaWx0ZXIgfHwgZmlsdGVyKGMpKSkge1xuICAgICAgICBjYWxsYmFjay5jYWxsKGNvbnRleHQsIGMsIGlkeCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGEgY29udGFjdCBmcm9tIGNhY2hlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljTWUjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgY29udGFjdCB0byBnZXQsIGVpdGhlciBhIFVJRCAoZm9yIHAycCB0b3BpY3MpIG9yIGEgdG9waWMgbmFtZS5cbiAgICogQHJldHVybnMge1Rpbm9kZS5Db250YWN0fSAtIENvbnRhY3Qgb3IgYHVuZGVmaW5lZGAuXG4gICAqL1xuICBnZXRDb250YWN0KG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5fdGlub2RlLmNhY2hlR2V0VG9waWMobmFtZSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGFjY2VzcyBtb2RlIG9mIGEgZ2l2ZW4gY29udGFjdCBmcm9tIGNhY2hlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljTWUjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgY29udGFjdCB0byBnZXQgYWNjZXNzIG1vZGUgZm9yLCBlaXRoZXIgYSBVSUQgKGZvciBwMnAgdG9waWNzKVxuICAgKiAgICAgICAgb3IgYSB0b3BpYyBuYW1lOyBpZiBtaXNzaW5nLCBhY2Nlc3MgbW9kZSBmb3IgdGhlICdtZScgdG9waWMgaXRzZWxmLlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSAtIGFjY2VzcyBtb2RlLCBzdWNoIGFzIGBSV1BgLlxuICAgKi9cbiAgZ2V0QWNjZXNzTW9kZShuYW1lKSB7XG4gICAgaWYgKG5hbWUpIHtcbiAgICAgIGNvbnN0IGNvbnQgPSB0aGlzLl90aW5vZGUuY2FjaGVHZXRUb3BpYyhuYW1lKTtcbiAgICAgIHJldHVybiBjb250ID8gY29udC5hY3MgOiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5hY3M7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgY29udGFjdCBpcyBhcmNoaXZlZCwgaS5lLiBjb250YWN0LnByaXZhdGUuYXJjaCA9PSB0cnVlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljTWUjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgY29udGFjdCB0byBjaGVjayBhcmNoaXZlZCBzdGF0dXMsIGVpdGhlciBhIFVJRCAoZm9yIHAycCB0b3BpY3MpIG9yIGEgdG9waWMgbmFtZS5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IC0gdHJ1ZSBpZiBjb250YWN0IGlzIGFyY2hpdmVkLCBmYWxzZSBvdGhlcndpc2UuXG4gICAqL1xuICBpc0FyY2hpdmVkKG5hbWUpIHtcbiAgICBjb25zdCBjb250ID0gdGhpcy5fdGlub2RlLmNhY2hlR2V0VG9waWMobmFtZSk7XG4gICAgcmV0dXJuIGNvbnQgJiYgY29udC5wcml2YXRlICYmICEhY29udC5wcml2YXRlLmFyY2g7XG4gIH1cblxuICAvKipcbiAgICogQHR5cGVkZWYgVGlub2RlLkNyZWRlbnRpYWxcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAdHlwZSBPYmplY3RcbiAgICogQHByb3BlcnR5IHtzdHJpbmd9IG1ldGggLSB2YWxpZGF0aW9uIG1ldGhvZCBzdWNoIGFzICdlbWFpbCcgb3IgJ3RlbCcuXG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB2YWwgLSBjcmVkZW50aWFsIHZhbHVlLCBpLmUuICdqZG9lQGV4YW1wbGUuY29tJyBvciAnKzE3MDI1NTUxMjM0J1xuICAgKiBAcHJvcGVydHkge2Jvb2xlYW59IGRvbmUgLSB0cnVlIGlmIGNyZWRlbnRpYWwgaXMgdmFsaWRhdGVkLlxuICAgKi9cbiAgLyoqXG4gICAqIEdldCB0aGUgdXNlcidzIGNyZWRlbnRpYWxzOiBlbWFpbCwgcGhvbmUsIGV0Yy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpY01lI1xuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLkNyZWRlbnRpYWxbXX0gLSBhcnJheSBvZiBjcmVkZW50aWFscy5cbiAgICovXG4gIGdldENyZWRlbnRpYWxzKCkge1xuICAgIHJldHVybiB0aGlzLl9jcmVkZW50aWFscztcbiAgfVxufVxuXG4vKipcbiAqIEBjbGFzcyBUb3BpY0ZuZCAtIHNwZWNpYWwgY2FzZSBvZiB7QGxpbmsgVGlub2RlLlRvcGljfSBmb3Igc2VhcmNoaW5nIGZvclxuICogY29udGFjdHMgYW5kIGdyb3VwIHRvcGljcy5cbiAqIEBleHRlbmRzIFRpbm9kZS5Ub3BpY1xuICogQG1lbWJlcm9mIFRpbm9kZVxuICpcbiAqIEBwYXJhbSB7VG9waWNGbmQuQ2FsbGJhY2tzfSBjYWxsYmFja3MgLSBDYWxsYmFja3MgdG8gcmVjZWl2ZSB2YXJpb3VzIGV2ZW50cy5cbiAqL1xuZXhwb3J0IGNsYXNzIFRvcGljRm5kIGV4dGVuZHMgVG9waWMge1xuICAvLyBMaXN0IG9mIHVzZXJzIGFuZCB0b3BpY3MgdWlkIG9yIHRvcGljX25hbWUgLT4gQ29udGFjdCBvYmplY3QpXG4gIF9jb250YWN0cyA9IHt9O1xuXG4gIGNvbnN0cnVjdG9yKGNhbGxiYWNrcykge1xuICAgIHN1cGVyKENvbnN0LlRPUElDX0ZORCwgY2FsbGJhY2tzKTtcbiAgfVxuXG4gIC8vIE92ZXJyaWRlIHRoZSBvcmlnaW5hbCBUb3BpYy5fcHJvY2Vzc01ldGFTdWJcbiAgX3Byb2Nlc3NNZXRhU3ViKHN1YnMpIHtcbiAgICBsZXQgdXBkYXRlQ291bnQgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0aGlzLl9jb250YWN0cykubGVuZ3RoO1xuICAgIC8vIFJlc2V0IGNvbnRhY3QgbGlzdC5cbiAgICB0aGlzLl9jb250YWN0cyA9IHt9O1xuICAgIGZvciAobGV0IGlkeCBpbiBzdWJzKSB7XG4gICAgICBsZXQgc3ViID0gc3Vic1tpZHhdO1xuICAgICAgY29uc3QgaW5kZXhCeSA9IHN1Yi50b3BpYyA/IHN1Yi50b3BpYyA6IHN1Yi51c2VyO1xuXG4gICAgICBzdWIgPSBtZXJnZVRvQ2FjaGUodGhpcy5fY29udGFjdHMsIGluZGV4QnksIHN1Yik7XG4gICAgICB1cGRhdGVDb3VudCsrO1xuXG4gICAgICBpZiAodGhpcy5vbk1ldGFTdWIpIHtcbiAgICAgICAgdGhpcy5vbk1ldGFTdWIoc3ViKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodXBkYXRlQ291bnQgPiAwICYmIHRoaXMub25TdWJzVXBkYXRlZCkge1xuICAgICAgdGhpcy5vblN1YnNVcGRhdGVkKE9iamVjdC5rZXlzKHRoaXMuX2NvbnRhY3RzKSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFB1Ymxpc2hpbmcgdG8gVG9waWNGbmQgaXMgbm90IHN1cHBvcnRlZC4ge0BsaW5rIFRvcGljI3B1Ymxpc2h9IGlzIG92ZXJyaWRlbiBhbmQgdGhvd3MgYW4ge0Vycm9yfSBpZiBjYWxsZWQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWNGbmQjXG4gICAqIEB0aHJvd3Mge0Vycm9yfSBBbHdheXMgdGhyb3dzIGFuIGVycm9yLlxuICAgKi9cbiAgcHVibGlzaCgpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiUHVibGlzaGluZyB0byAnZm5kJyBpcyBub3Qgc3VwcG9ydGVkXCIpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBzZXRNZXRhIHRvIFRvcGljRm5kIHJlc2V0cyBjb250YWN0IGxpc3QgaW4gYWRkaXRpb24gdG8gc2VuZGluZyB0aGUgbWVzc2FnZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpY0ZuZCNcbiAgICogQHBhcmFtIHtUaW5vZGUuU2V0UGFyYW1zfSBwYXJhbXMgcGFyYW1ldGVycyB0byB1cGRhdGUuXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHRvIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIHNlcnZlciByZXNwb25kcyB0byByZXF1ZXN0LlxuICAgKi9cbiAgc2V0TWV0YShwYXJhbXMpIHtcbiAgICByZXR1cm4gT2JqZWN0LmdldFByb3RvdHlwZU9mKFRvcGljRm5kLnByb3RvdHlwZSkuc2V0TWV0YS5jYWxsKHRoaXMsIHBhcmFtcykudGhlbigoKSA9PiB7XG4gICAgICBpZiAoT2JqZWN0LmtleXModGhpcy5fY29udGFjdHMpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdGhpcy5fY29udGFjdHMgPSB7fTtcbiAgICAgICAgaWYgKHRoaXMub25TdWJzVXBkYXRlZCkge1xuICAgICAgICAgIHRoaXMub25TdWJzVXBkYXRlZChbXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJdGVyYXRlIG92ZXIgZm91bmQgY29udGFjdHMuIElmIGNhbGxiYWNrIGlzIHVuZGVmaW5lZCwgdXNlIHtAbGluayB0aGlzLm9uTWV0YVN1Yn0uXG4gICAqIEBmdW5jdGlvblxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljRm5kI1xuICAgKiBAcGFyYW0ge1RvcGljRm5kLkNvbnRhY3RDYWxsYmFja30gY2FsbGJhY2sgLSBDYWxsYmFjayB0byBjYWxsIGZvciBlYWNoIGNvbnRhY3QuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZXh0IC0gQ29udGV4dCB0byB1c2UgZm9yIGNhbGxpbmcgdGhlIGBjYWxsYmFja2AsIGkuZS4gdGhlIHZhbHVlIG9mIGB0aGlzYCBpbnNpZGUgdGhlIGNhbGxiYWNrLlxuICAgKi9cbiAgY29udGFjdHMoY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICBjb25zdCBjYiA9IChjYWxsYmFjayB8fCB0aGlzLm9uTWV0YVN1Yik7XG4gICAgaWYgKGNiKSB7XG4gICAgICBmb3IgKGxldCBpZHggaW4gdGhpcy5fY29udGFjdHMpIHtcbiAgICAgICAgY2IuY2FsbChjb250ZXh0LCB0aGlzLl9jb250YWN0c1tpZHhdLCBpZHgsIHRoaXMuX2NvbnRhY3RzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiIsIi8qKlxuICogQGZpbGUgVXRpbGl0aWVzIHVzZWQgaW4gbXVsdGlwbGUgcGxhY2VzLlxuICpcbiAqIEBjb3B5cmlnaHQgMjAxNS0yMDIyIFRpbm9kZSBMTEMuXG4gKi9cbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IEFjY2Vzc01vZGUgZnJvbSAnLi9hY2Nlc3MtbW9kZS5qcyc7XG5pbXBvcnQgREVMX0NIQVIgZnJvbSAnLi9jb25maWcuanMnO1xuXG4vLyBBdHRlbXB0IHRvIGNvbnZlcnQgZGF0ZSBhbmQgQWNjZXNzTW9kZSBzdHJpbmdzIHRvIG9iamVjdHMuXG5leHBvcnQgZnVuY3Rpb24ganNvblBhcnNlSGVscGVyKGtleSwgdmFsKSB7XG4gIC8vIFRyeSB0byBjb252ZXJ0IHN0cmluZyB0aW1lc3RhbXBzIHdpdGggb3B0aW9uYWwgbWlsbGlzZWNvbmRzIHRvIERhdGUsXG4gIC8vIGUuZy4gMjAxNS0wOS0wMlQwMTo0NTo0M1suMTIzXVpcbiAgaWYgKHR5cGVvZiB2YWwgPT0gJ3N0cmluZycgJiYgdmFsLmxlbmd0aCA+PSAyMCAmJiB2YWwubGVuZ3RoIDw9IDI0ICYmIFsndHMnLCAndG91Y2hlZCcsICd1cGRhdGVkJywgJ2NyZWF0ZWQnLCAnd2hlbicsICdkZWxldGVkJywgJ2V4cGlyZXMnXS5pbmNsdWRlcyhrZXkpKSB7XG5cbiAgICBjb25zdCBkYXRlID0gbmV3IERhdGUodmFsKTtcbiAgICBpZiAoIWlzTmFOKGRhdGUpKSB7XG4gICAgICByZXR1cm4gZGF0ZTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoa2V5ID09PSAnYWNzJyAmJiB0eXBlb2YgdmFsID09PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBuZXcgQWNjZXNzTW9kZSh2YWwpO1xuICB9XG4gIHJldHVybiB2YWw7XG59XG5cbi8vIENoZWNrcyBpZiBVUkwgaXMgYSByZWxhdGl2ZSB1cmwsIGkuZS4gaGFzIG5vICdzY2hlbWU6Ly8nLCBpbmNsdWRpbmcgdGhlIGNhc2Ugb2YgbWlzc2luZyBzY2hlbWUgJy8vJy5cbi8vIFRoZSBzY2hlbWUgaXMgZXhwZWN0ZWQgdG8gYmUgUkZDLWNvbXBsaWFudCwgZS5nLiBbYS16XVthLXowLTkrLi1dKlxuLy8gZXhhbXBsZS5odG1sIC0gb2tcbi8vIGh0dHBzOmV4YW1wbGUuY29tIC0gbm90IG9rLlxuLy8gaHR0cDovZXhhbXBsZS5jb20gLSBub3Qgb2suXG4vLyAnIOKGsiBodHRwczovL2V4YW1wbGUuY29tJyAtIG5vdCBvay4gKOKGsiBtZWFucyBjYXJyaWFnZSByZXR1cm4pXG5leHBvcnQgZnVuY3Rpb24gaXNVcmxSZWxhdGl2ZSh1cmwpIHtcbiAgcmV0dXJuIHVybCAmJiAhL15cXHMqKFthLXpdW2EtejAtOSsuLV0qOnxcXC9cXC8pL2ltLnRlc3QodXJsKTtcbn1cblxuZnVuY3Rpb24gaXNWYWxpZERhdGUoZCkge1xuICByZXR1cm4gKGQgaW5zdGFuY2VvZiBEYXRlKSAmJiAhaXNOYU4oZCkgJiYgKGQuZ2V0VGltZSgpICE9IDApO1xufVxuXG4vLyBSRkMzMzM5IGZvcm1hdGVyIG9mIERhdGVcbmV4cG9ydCBmdW5jdGlvbiByZmMzMzM5RGF0ZVN0cmluZyhkKSB7XG4gIGlmICghaXNWYWxpZERhdGUoZCkpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgY29uc3QgcGFkID0gZnVuY3Rpb24odmFsLCBzcCkge1xuICAgIHNwID0gc3AgfHwgMjtcbiAgICByZXR1cm4gJzAnLnJlcGVhdChzcCAtICgnJyArIHZhbCkubGVuZ3RoKSArIHZhbDtcbiAgfTtcblxuICBjb25zdCBtaWxsaXMgPSBkLmdldFVUQ01pbGxpc2Vjb25kcygpO1xuICByZXR1cm4gZC5nZXRVVENGdWxsWWVhcigpICsgJy0nICsgcGFkKGQuZ2V0VVRDTW9udGgoKSArIDEpICsgJy0nICsgcGFkKGQuZ2V0VVRDRGF0ZSgpKSArXG4gICAgJ1QnICsgcGFkKGQuZ2V0VVRDSG91cnMoKSkgKyAnOicgKyBwYWQoZC5nZXRVVENNaW51dGVzKCkpICsgJzonICsgcGFkKGQuZ2V0VVRDU2Vjb25kcygpKSArXG4gICAgKG1pbGxpcyA/ICcuJyArIHBhZChtaWxsaXMsIDMpIDogJycpICsgJ1onO1xufVxuXG4vLyBSZWN1cnNpdmVseSBtZXJnZSBzcmMncyBvd24gcHJvcGVydGllcyB0byBkc3QuXG4vLyBJZ25vcmUgcHJvcGVydGllcyB3aGVyZSBpZ25vcmVbcHJvcGVydHldIGlzIHRydWUuXG4vLyBBcnJheSBhbmQgRGF0ZSBvYmplY3RzIGFyZSBzaGFsbG93LWNvcGllZC5cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZU9iaihkc3QsIHNyYywgaWdub3JlKSB7XG4gIGlmICh0eXBlb2Ygc3JjICE9ICdvYmplY3QnKSB7XG4gICAgaWYgKHNyYyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gZHN0O1xuICAgIH1cbiAgICBpZiAoc3JjID09PSBERUxfQ0hBUikge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgcmV0dXJuIHNyYztcbiAgfVxuICAvLyBKUyBpcyBjcmF6eTogdHlwZW9mIG51bGwgaXMgJ29iamVjdCcuXG4gIGlmIChzcmMgPT09IG51bGwpIHtcbiAgICByZXR1cm4gc3JjO1xuICB9XG5cbiAgLy8gSGFuZGxlIERhdGVcbiAgaWYgKHNyYyBpbnN0YW5jZW9mIERhdGUgJiYgIWlzTmFOKHNyYykpIHtcbiAgICByZXR1cm4gKCFkc3QgfHwgIShkc3QgaW5zdGFuY2VvZiBEYXRlKSB8fCBpc05hTihkc3QpIHx8IGRzdCA8IHNyYykgPyBzcmMgOiBkc3Q7XG4gIH1cblxuICAvLyBBY2Nlc3MgbW9kZVxuICBpZiAoc3JjIGluc3RhbmNlb2YgQWNjZXNzTW9kZSkge1xuICAgIHJldHVybiBuZXcgQWNjZXNzTW9kZShzcmMpO1xuICB9XG5cbiAgLy8gSGFuZGxlIEFycmF5XG4gIGlmIChzcmMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgIHJldHVybiBzcmM7XG4gIH1cblxuICBpZiAoIWRzdCB8fCBkc3QgPT09IERFTF9DSEFSKSB7XG4gICAgZHN0ID0gc3JjLmNvbnN0cnVjdG9yKCk7XG4gIH1cblxuICBmb3IgKGxldCBwcm9wIGluIHNyYykge1xuICAgIGlmIChzcmMuaGFzT3duUHJvcGVydHkocHJvcCkgJiYgKCFpZ25vcmUgfHwgIWlnbm9yZVtwcm9wXSkgJiYgKHByb3AgIT0gJ19ub0ZvcndhcmRpbmcnKSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgZHN0W3Byb3BdID0gbWVyZ2VPYmooZHN0W3Byb3BdLCBzcmNbcHJvcF0pO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIC8vIEZJWE1FOiBwcm9iYWJseSBuZWVkIHRvIGxvZyBzb21ldGhpbmcgaGVyZS5cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRzdDtcbn1cblxuLy8gVXBkYXRlIG9iamVjdCBzdG9yZWQgaW4gYSBjYWNoZS4gUmV0dXJucyB1cGRhdGVkIHZhbHVlLlxuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlVG9DYWNoZShjYWNoZSwga2V5LCBuZXd2YWwsIGlnbm9yZSkge1xuICBjYWNoZVtrZXldID0gbWVyZ2VPYmooY2FjaGVba2V5XSwgbmV3dmFsLCBpZ25vcmUpO1xuICByZXR1cm4gY2FjaGVba2V5XTtcbn1cblxuLy8gU3RyaXBzIGFsbCB2YWx1ZXMgZnJvbSBhbiBvYmplY3Qgb2YgdGhleSBldmFsdWF0ZSB0byBmYWxzZSBvciBpZiB0aGVpciBuYW1lIHN0YXJ0cyB3aXRoICdfJy5cbi8vIFVzZWQgb24gYWxsIG91dGdvaW5nIG9iamVjdCBiZWZvcmUgc2VyaWFsaXphdGlvbiB0byBzdHJpbmcuXG5leHBvcnQgZnVuY3Rpb24gc2ltcGxpZnkob2JqKSB7XG4gIE9iamVjdC5rZXlzKG9iaikuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgaWYgKGtleVswXSA9PSAnXycpIHtcbiAgICAgIC8vIFN0cmlwIGZpZWxkcyBsaWtlIFwib2JqLl9rZXlcIi5cbiAgICAgIGRlbGV0ZSBvYmpba2V5XTtcbiAgICB9IGVsc2UgaWYgKCFvYmpba2V5XSkge1xuICAgICAgLy8gU3RyaXAgZmllbGRzIHdoaWNoIGV2YWx1YXRlIHRvIGZhbHNlLlxuICAgICAgZGVsZXRlIG9ialtrZXldO1xuICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShvYmpba2V5XSkgJiYgb2JqW2tleV0ubGVuZ3RoID09IDApIHtcbiAgICAgIC8vIFN0cmlwIGVtcHR5IGFycmF5cy5cbiAgICAgIGRlbGV0ZSBvYmpba2V5XTtcbiAgICB9IGVsc2UgaWYgKCFvYmpba2V5XSkge1xuICAgICAgLy8gU3RyaXAgZmllbGRzIHdoaWNoIGV2YWx1YXRlIHRvIGZhbHNlLlxuICAgICAgZGVsZXRlIG9ialtrZXldO1xuICAgIH0gZWxzZSBpZiAob2JqW2tleV0gaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICAvLyBTdHJpcCBpbnZhbGlkIG9yIHplcm8gZGF0ZS5cbiAgICAgIGlmICghaXNWYWxpZERhdGUob2JqW2tleV0pKSB7XG4gICAgICAgIGRlbGV0ZSBvYmpba2V5XTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBvYmpba2V5XSA9PSAnb2JqZWN0Jykge1xuICAgICAgc2ltcGxpZnkob2JqW2tleV0pO1xuICAgICAgLy8gU3RyaXAgZW1wdHkgb2JqZWN0cy5cbiAgICAgIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhvYmpba2V5XSkubGVuZ3RoID09IDApIHtcbiAgICAgICAgZGVsZXRlIG9ialtrZXldO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBvYmo7XG59O1xuXG5cbi8vIFRyaW0gd2hpdGVzcGFjZSwgc3RyaXAgZW1wdHkgYW5kIGR1cGxpY2F0ZSBlbGVtZW50cyBlbGVtZW50cy5cbi8vIElmIHRoZSByZXN1bHQgaXMgYW4gZW1wdHkgYXJyYXksIGFkZCBhIHNpbmdsZSBlbGVtZW50IFwiXFx1MjQyMVwiIChVbmljb2RlIERlbCBjaGFyYWN0ZXIpLlxuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZUFycmF5KGFycikge1xuICBsZXQgb3V0ID0gW107XG4gIGlmIChBcnJheS5pc0FycmF5KGFycikpIHtcbiAgICAvLyBUcmltLCB0aHJvdyBhd2F5IHZlcnkgc2hvcnQgYW5kIGVtcHR5IHRhZ3MuXG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSBhcnIubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBsZXQgdCA9IGFycltpXTtcbiAgICAgIGlmICh0KSB7XG4gICAgICAgIHQgPSB0LnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBpZiAodC5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgb3V0LnB1c2godCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgb3V0LnNvcnQoKS5maWx0ZXIoZnVuY3Rpb24oaXRlbSwgcG9zLCBhcnkpIHtcbiAgICAgIHJldHVybiAhcG9zIHx8IGl0ZW0gIT0gYXJ5W3BvcyAtIDFdO1xuICAgIH0pO1xuICB9XG4gIGlmIChvdXQubGVuZ3RoID09IDApIHtcbiAgICAvLyBBZGQgc2luZ2xlIHRhZyB3aXRoIGEgVW5pY29kZSBEZWwgY2hhcmFjdGVyLCBvdGhlcndpc2UgYW4gYW1wdHkgYXJyYXlcbiAgICAvLyBpcyBhbWJpZ3Vvcy4gVGhlIERlbCB0YWcgd2lsbCBiZSBzdHJpcHBlZCBieSB0aGUgc2VydmVyLlxuICAgIG91dC5wdXNoKERFTF9DSEFSKTtcbiAgfVxuICByZXR1cm4gb3V0O1xufVxuIiwibW9kdWxlLmV4cG9ydHM9e1widmVyc2lvblwiOiBcIjAuMjAuMC1hbHBoYTFcIn1cbiJdfQ==

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
  throw new Error(`Invalid AccessMode component '${side}'`);
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
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
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
const VERSION = _version.version || '0.20';
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
const TOPIC_GRP = 'grp';
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
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
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
    _classStaticPrivateFieldSpecGet(Connection, Connection, _log).call(Connection, `Reconnecting, iter=${_classPrivateFieldGet(this, _boffIteration)}, timeout=${timeout}`);
    if (!_classPrivateFieldGet(this, _boffClosed)) {
      const prom = this.connect();
      if (this.onAutoreconnectIteration) {
        this.onAutoreconnectIteration(0, prom);
      } else {
        prom.catch(_ => {});
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
        throw new Error(`LP sender failed, ${sender.status}`);
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
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
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
      req.onupgradeneeded = event => {
        this.db = event.target.result;
        this.db.onerror = event => {
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
      req.onblocked = event => {
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
  return HTML_TAGS[style] && HTML_TAGS[style].name;
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
    const instance = this;
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
    this.xhr.open('POST', url, true);
    this.xhr.setRequestHeader('X-Tinode-APIKey', this._apiKey);
    if (this._authToken) {
      this.xhr.setRequestHeader('X-Tinode-Auth', `Token ${this._authToken.token}`);
    }
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
          instance.toReject(new Error(`${pkt.ctrl.text} (${pkt.ctrl.code})`));
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
    if (!(0, _utils.isUrlRelative)(relativeUrl)) {
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
            instance.toReject(new Error(`${pkt.ctrl.text} (${pkt.ctrl.code})`));
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
 * @module tinode-sdk
 *
 * @copyright 2015-2022 Tinode LLC.
 * @summary Javascript bindings for Tinode.
 * @license Apache 2.0
 * @version 0.20
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
Object.defineProperty(exports, "AccessMode", {
  enumerable: true,
  get: function () {
    return _accessMode.default;
  }
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
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
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
    result = `${m[0]}/${v[0]}${minor}`;
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
    if ((0, _utils.isUrlRelative)(url)) {
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
          attachments: params.attachments.filter(ref => (0, _utils.isUrlRelative)(ref))
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
          attachments: setParams.attachments.filter(ref => (0, _utils.isUrlRelative)(ref))
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
        attachments: attachments.filter(ref => (0, _utils.isUrlRelative)(ref))
      };
    }
    return _classPrivateMethodGet(this, _send, _send2).call(this, msg, pub.id);
  }
  oobNotification(data) {
    this.logger("oob: " + (this._trimLongStrings ? JSON.stringify(data, jsonLoggerHelper) : data));
    switch (data.what) {
      case 'msg':
        if (!data.seq || data.seq < 1 || !data.topic) {
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
        if (!this.isMe(data.xfrom)) {
          break;
        }
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
          attachments: params.attachments.filter(ref => (0, _utils.isUrlRelative)(ref))
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
      throw new Error(`Invalid message id ${seq}`);
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
      callbacks.reject(new Error(`${errorText} (${code})`));
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
      throw new Error(`Unknown packet type requested: ${type}`);
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
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
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
            data: this.latestMsgVersion(msg.seq) || msg,
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
  latestMsgVersion(seq) {
    const versions = this._messageVersions[seq];
    return versions ? versions.getLast() : null;
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
        if (this._tinode.isMe(info.from)) {
          this._updateReadRecv(info.what, info.seq);
        }
        this._tinode.getMeTopic()._refreshContact(info.what, this);
        break;
      case 'kp':
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
var _config = require("./config.js");
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
    if (src === _config.DEL_CHAR) {
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
  if (!dst || dst === _config.DEL_CHAR) {
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
    out.push(_config.DEL_CHAR);
  }
  return out;
}

},{"./access-mode.js":1,"./config.js":3}],12:[function(require,module,exports){
module.exports={"version": "0.20.3"}

},{}]},{},[9])(9)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYWNjZXNzLW1vZGUuanMiLCJzcmMvY2J1ZmZlci5qcyIsInNyYy9jb25maWcuanMiLCJzcmMvY29ubmVjdGlvbi5qcyIsInNyYy9kYi5qcyIsInNyYy9kcmFmdHkuanMiLCJzcmMvbGFyZ2UtZmlsZS5qcyIsInNyYy9tZXRhLWJ1aWxkZXIuanMiLCJzcmMvdGlub2RlLmpzIiwic3JjL3RvcGljLmpzIiwic3JjL3V0aWxzLmpzIiwidmVyc2lvbi5qc29uIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDS0EsWUFBWTtBQUFDO0VBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQWNFLE1BQU0sVUFBVSxDQUFDO0VBQzlCLFdBQVcsQ0FBQyxHQUFHLEVBQUU7SUFDZixJQUFJLEdBQUcsRUFBRTtNQUNQLElBQUksQ0FBQyxLQUFLLEdBQUcsT0FBTyxHQUFHLENBQUMsS0FBSyxJQUFJLFFBQVEsR0FBRyxHQUFHLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQztNQUNwRixJQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sR0FBRyxDQUFDLElBQUksSUFBSSxRQUFRLEdBQUcsR0FBRyxDQUFDLElBQUksR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUM7TUFDaEYsSUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxHQUFJLE9BQU8sR0FBRyxDQUFDLElBQUksSUFBSSxRQUFRLEdBQUcsR0FBRyxDQUFDLElBQUksR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FDekYsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSztJQUM1QjtFQUNGO0VBaUJBLE9BQU8sTUFBTSxDQUFDLEdBQUcsRUFBRTtJQUNqQixJQUFJLENBQUMsR0FBRyxFQUFFO01BQ1Is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RSxFQUFFO0lBQ0YsSUFBSSxFQUFFLEdBQUc7SUFDVCxNQUFNLEVBQUU7RUFDVixDQUFDO0VBQ0QsRUFBRSxFQUFFO0lBQ0YsSUFBSSxFQUFFLEVBQUU7SUFDUixNQUFNLEVBQUU7RUFDVixDQUFDO0VBQ0QsRUFBRSxFQUFFO0lBQ0YsSUFBSSxFQUFFLEtBQUs7SUFDWCxNQUFNLEVBQUU7RUFDVixDQUFDO0VBQ0QsRUFBRSxFQUFFO0lBQ0YsSUFBSSxFQUFFLEVBQUU7SUFDUixNQUFNLEVBQUU7RUFDVixDQUFDO0VBQ0QsRUFBRSxFQUFFO0lBQ0YsSUFBSSxFQUFFLE1BQU07SUFDWixNQUFNLEVBQUU7RUFDVixDQUFDO0VBQ0QsRUFBRSxFQUFFO0lBQ0YsSUFBSSxFQUFFLEdBQUc7SUFDVCxNQUFNLEVBQUU7RUFDVixDQUFDO0VBQ0QsRUFBRSxFQUFFO0lBQ0YsSUFBSSxFQUFFLEtBQUs7SUFDWCxNQUFNLEVBQUU7RUFDVixDQUFDO0VBQ0QsRUFBRSxFQUFFO0lBQ0YsSUFBSSxFQUFFLEdBQUc7SUFDVCxNQUFNLEVBQUU7RUFDVixDQUFDO0VBQ0QsRUFBRSxFQUFFO0lBQ0YsSUFBSSxFQUFFLEdBQUc7SUFDVCxNQUFNLEVBQUU7RUFDVixDQUFDO0VBQ0QsRUFBRSxFQUFFO0lBQ0YsSUFBSSxFQUFFLEtBQUs7SUFDWCxNQUFNLEVBQUU7RUFDVixDQUFDO0VBQ0QsRUFBRSxFQUFFO0lBQ0YsSUFBSSxFQUFFLEtBQUs7SUFDWCxNQUFNLEVBQUU7RUFDVixDQUFDO0VBQ0QsRUFBRSxFQUFFO0lBQ0YsSUFBSSxFQUFFLEdBQUc7SUFDVCxNQUFNLEVBQUU7RUFDVixDQUFDO0VBQ0QsRUFBRSxFQUFFO0lBQ0YsSUFBSSxFQUFFLEtBQUs7SUFDWCxNQUFNLEVBQUU7RUFDVjtBQUNGLENBQUM7QUFHRCxTQUFTLGlCQUFpQixDQUFDLEdBQUcsRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFO0VBQ25ELElBQUksQ0FBQyxHQUFHLEVBQUU7SUFDUixPQUFPLElBQUk7RUFDYjtFQUVBLElBQUk7SUFDRixNQUFNLEdBQUcs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R0FBRyxDQUFDLEVBQUU7SUFDMUIsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLFdBQVcsQ0FBQztFQUM1QjtFQUVBLEtBQUssQ0FBQyxPQUFPLENBQUUsSUFBSSxJQUFLO0lBQ3RCLElBQUksR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLFFBQVEsRUFBRTtNQUNyRixJQUFJLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTtNQUM1QixJQUFJLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSTtJQUNoQztJQUdBLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFO01BQ2QsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJO0lBQ2xCO0VBQ0YsQ0FBQyxDQUFDO0VBRUYsSUFBSSxJQUFJLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUM7RUFHckQsTUFBTSxPQUFPLEdBQUcsVUFBUyxJQUFJLEVBQUU7SUFDN0IsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7TUFFN0QsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7TUFDOUIsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUU7UUFDZCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTTtRQUMxQixJQUFJLEdBQUcsS0FBSztRQUNaLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTTtNQUN0QixDQUFDLE1BQU0sSUFBSSxDQUFDLEtB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QUNMLE9BQU8sRUFBRTtVQUNQLElBQUksRUFBRSxJQUFJLENBQUMsZUFBZSxFQUFFO1VBQzVCLFFBQVEsRUFBRSxJQUFJO1VBQ2QsUUFBUSxFQUFFO1FBQ1o7TUFDRixDQUFDO0lBRUgsS0FBSyxLQUFLO01BQ1IsT0FBTztRQUNMLEtBQUssRUFBRTtVQUNMLElBQUksRUFBRSxJQUFJLENBQUMsZUFBZSxFQUFFO1VBQzVCLE9BQU8sRUFBRSxLQUFLO1VBQ2QsS0FBSyxFQUFFLENBQUMsQ0FBQztVQUNULEtBQUssRUFBRSxDQUFDO1FBQ1Y7TUFDRixDQUFDO0lBRUgsS0FBSyxPQUFPO01BQ1YsT0FBTztRQUNMLE9BQU8sRUFBRTtVQUNQLElBQUksRUFBRSxJQUFJLENBQUMsZUFBZSxFQUFFO1VBQzVCLE9BQU8sRUFBRSxLQUFLO1VBQ2QsT0FBTyxFQUFFO1FBQ1g7TUFDRixDQUFDO0lBRUgsS0FBSyxLQUFLO01BQ1IsT0FBTztRQUNMLEtBQUssRUFBRTtVQUNMLElBQUksRUFBRSxJQUFJLENBQUMsZUFBZSxFQUFFO1VBQzVCLE9BQU8sRUFBRSxLQUFLO1VBQ2QsUUFBUSxFQUFFLEtBQUs7VUFDZixNQUFNLEVBQUUsSUFBSTtVQUNaLFNBQVMsRUFBRSxDQUFDO1FBQ2Q7TUFDRixDQUFDO0lBRUgsS0FBSyxLQUFLO01BQ1IsT0FBTztRQUNMLEtBQUssRUFBRTtVQUNMLElBQUksRUFBRSxJQUFJLENBQUMsZUFBZSxFQUFFO1VBQzVCLE9BQU8sRUFBRSxLQUFLO1VBQ2QsTUFBTSxFQUFFLElBQUk7VUFDWixNQUFNLEVBQUUsQ0FBQyxDQUFDO1VBQ1YsS0FBSyxFQUFFLENBQUMsQ0FBQztVQUNULE1BQU0sRUFBRSxDQUFDO1FBQ1g7TUFDRixDQUFDO0lBRUgsS0FBSyxLQUFLO01BQ1IsT0FBTztRQUNMLEtBQUssRUFBRTtVQUNMLElBQUksRUFBRSxJQUFJLENBQUMsZUFBZSxFQUFFO1VBQzVCLE9BQU8sRUFBRSxLQUFLO1VBQ2QsTUFBTSxFQUFFLENBQUMsQ0FBQztVQUNWLEtBQUssRUFBRSxDQUFDLENBQUM7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QyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRTtNQUU1RDtJQUNGO0lBQ0EsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsT0FBTyxDQUFDO0VBQzdEO0VBR0EsZUFBZSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFO0lBQzdCLElBQUksTUFBTTtNQUFFLFFBQVEsR0FBRyxLQUFLO0lBRTVCLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQztJQUNiLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDO0lBQ3ZCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDO0lBQ3pCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDO0lBQ3pCLFFBQVEsSUFBSTtNQUNWLEtBQUssTUFBTTtRQUNULE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSTtRQUNsQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUM7UUFDcEMsUUFBUSxHQUFJLE1BQU0sSUFBSSxJQUFJLENBQUMsSUFBSztRQUNoQztNQUNGLEtBQUssTUFBTTtRQUNULE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSTtRQUNsQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUM7UUFDcEMsUUFBUSxHQUFJLE1BQU0sSUFBSSxJQUFJLENBQUMsSUFBSztRQUNoQztNQUNGLEtBQUssS0FBSztRQUNSLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRztRQUNqQixJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUM7UUFDbEMsSUFBSSxDQUFDLElBQUksQ0FB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LENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1VBQ2hCLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2I7TUFDRjtJQUNGO0lBQ0EsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxVQUFTLElBQUksRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFO01BQ3pDLE9BQU8sQ0FBQyxHQUFHLElBQUksSUFBSSxJQUFJLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO0lBQ3JDLENBQUMsQ0FBQztFQUNKO0VBQ0EsSUFBSSxHQUFHLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtJQUduQixHQUFHLENBQUMsSUFBSSxDQUFDLGdCQUFRLENBQUM7RUFDcEI7RUFDQSxPQUFPLEdBQUc7QUFDWjs7O0FDNUtBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvKipcbiAqIEBmaWxlIEFjY2VzcyBjb250cm9sIG1vZGVsLlxuICpcbiAqIEBjb3B5cmlnaHQgMjAxNS0yMDIyIFRpbm9kZSBMTEMuXG4gKi9cbid1c2Ugc3RyaWN0JztcblxuLy8gTk9URSBUTyBERVZFTE9QRVJTOlxuLy8gTG9jYWxpemFibGUgc3RyaW5ncyBzaG91bGQgYmUgZG91YmxlIHF1b3RlZCBcItGB0YLRgNC+0LrQsCDQvdCwINC00YDRg9Cz0L7QvCDRj9C30YvQutC1XCIsXG4vLyBub24tbG9jYWxpemFibGUgc3RyaW5ncyBzaG91bGQgYmUgc2luZ2xlIHF1b3RlZCAnbm9uLWxvY2FsaXplZCcuXG5cbi8qKlxuICogSGVscGVyIGNsYXNzIGZvciBoYW5kbGluZyBhY2Nlc3MgbW9kZS5cbiAqXG4gKiBAY2xhc3MgQWNjZXNzTW9kZVxuICogQG1lbWJlcm9mIFRpbm9kZVxuICpcbiAqIEBwYXJhbSB7QWNjZXNzTW9kZXxPYmplY3Q9fSBhY3MgLSBBY2Nlc3NNb2RlIHRvIGNvcHkgb3IgYWNjZXNzIG1vZGUgb2JqZWN0IHJlY2VpdmVkIGZyb20gdGhlIHNlcnZlci5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQWNjZXNzTW9kZSB7XG4gIGNvbnN0cnVjdG9yKGFjcykge1xuICAgIGlmIChhY3MpIHtcbiAgICAgIHRoaXMuZ2l2ZW4gPSB0eXBlb2YgYWNzLmdpdmVuID09ICdudW1iZXInID8gYWNzLmdpdmVuIDogQWNjZXNzTW9kZS5kZWNvZGUoYWNzLmdpdmVuKTtcbiAgICAgIHRoaXMud2FudCA9IHR5cGVvZiBhY3Mud2FudCA9PSAnbnVtYmVyJyA/IGFjcy53YW50IDogQWNjZXNzTW9kZS5kZWNvZGUoYWNzLndhbnQpO1xuICAgICAgdGhpcy5tb2RlID0gYWNzLm1vZGUgPyAodHlwZW9mIGFjcy5tb2RlID09ICdudW1iZXInID8gYWNzLm1vZGUgOiBBY2Nlc3NNb2RlLmRlY29kZShhY3MubW9kZSkpIDpcbiAgICAgICAgKHRoaXMuZ2l2ZW4gJiB0aGlzLndhbnQpO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyAjY2hlY2tGbGFnKHZhbCwgc2lkZSwgZmxhZykge1xuICAgIHNpZGUgPSBzaWRlIHx8ICdtb2RlJztcbiAgICBpZiAoWydnaXZlbicsICd3YW50JywgJ21vZGUnXS5pbmNsdWRlcyhzaWRlKSkge1xuICAgICAgcmV0dXJuICgodmFsW3NpZGVdICYgZmxhZykgIT0gMCk7XG4gICAgfVxuICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBBY2Nlc3NNb2RlIGNvbXBvbmVudCAnJHtzaWRlfSdgKTtcbiAgfVxuICAvKipcbiAgICogUGFyc2Ugc3RyaW5nIGludG8gYW4gYWNjZXNzIG1vZGUgdmFsdWUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nIHwgTnVtYmVyfSBtb2RlIC0gZWl0aGVyIGEgU3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBhY2Nlc3MgbW9kZSB0byBwYXJzZSBvciBhIHNldCBvZiBiaXRzIHRvIGFzc2lnbi5cbiAgICogQHJldHVybnMge251bWJlcn0gLSBBY2Nlc3MgbW9kZSBhcyBhIG51bWVyaWMgdmFsdWUuXG4gICAqL1xuICBzdGF0aWMgZGVjb2RlKHN0cikge1xuICAgIGlmICghc3RyKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBzdHIgPT0gJ251bWJlcicpIHtcbiAgICAgIHJldHVybiBzdHIgJiBBY2Nlc3NNb2RlLl9CSVRNQVNLO1xuICAgIH0gZWxzZSBpZiAoc3RyID09PSAnTicgfHwgc3RyID09PSAnbicpIHtcbiAgICAgIHJldHVybiBBY2Nlc3NNb2RlLl9OT05FO1xuICAgIH1cblxuICAgIGNvbnN0IGJpdG1hc2sgPSB7XG4gICAgICAnSic6IEFjY2Vzc01vZGUuX0pPSU4sXG4gICAgICAnUic6IEFjY2Vzc01vZGUuX1JFQUQsXG4gICAgICAnVyc6IEFjY2Vzc01vZGUuX1dSSVRFLFxuICAgICAgJ1AnOiBBY2Nlc3NNb2RlLl9QUkVTLFxuICAgICAgJ0EnOiBBY2Nlc3NNb2RlLl9BUFBST1ZFLFxuICAgICAgJ1MnOiBBY2Nlc3NNb2RlLl9TSEFSRSxcbiAgICAgICdEJzogQWNjZXNzTW9kZS5fREVMRVRFLFxuICAgICAgJ08nOiBBY2Nlc3NNb2RlLl9PV05FUlxuICAgIH07XG5cbiAgICBsZXQgbTAgPSBBY2Nlc3NNb2RlLl9OT05FO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGJpdCA9IGJpdG1hc2tbc3RyLmNoYXJBdChpKS50b1VwcGVyQ2FzZSgpXTtcbiAgICAgIGlmICghYml0KSB7XG4gICAgICAgIC8vIFVucmVjb2duaXplZCBiaXQsIHNraXAuXG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgbTAgfD0gYml0O1xuICAgIH1cbiAgICByZXR1cm4gbTA7XG4gIH1cbiAgLyoqXG4gICAqIENvbnZlcnQgbnVtZXJpYyByZXByZXNlbnRhdGlvbiBvZiB0aGUgYWNjZXNzIG1vZGUgaW50byBhIHN0cmluZy5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IHZhbCAtIGFjY2VzcyBtb2RlIHZhbHVlIHRvIGNvbnZlcnQgdG8gYSBzdHJpbmcuXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IC0gQWNjZXNzIG1vZGUgYXMgYSBzdHJpbmcuXG4gICAqL1xuICBzdGF0aWMgZW5jb2RlKHZhbCkge1xuICAgIGlmICh2YWwgPT09IG51bGwgfHwgdmFsID09PSBBY2Nlc3NNb2RlLl9JTlZBTElEKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9IGVsc2UgaWYgKHZhbCA9PT0gQWNjZXNzTW9kZS5fTk9ORSkge1xuICAgICAgcmV0dXJuICdOJztcbiAgICB9XG5cbiAgICBjb25zdCBiaXRtYXNrID0gWydKJywgJ1InLCAnVycsICdQJywgJ0EnLCAnUycsICdEJywgJ08nXTtcbiAgICBsZXQgcmVzID0gJyc7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBiaXRtYXNrLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoKHZhbCAmICgxIDw8IGkpKSAhPSAwKSB7XG4gICAgICAgIHJlcyA9IHJlcyArIGJpdG1hc2tbaV07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXM7XG4gIH1cbiAgLyoqXG4gICAqIFVwZGF0ZSBudW1lcmljIHJlcHJlc2VudGF0aW9uIG9mIGFjY2VzcyBtb2RlIHdpdGggdGhlIG5ldyB2YWx1ZS4gVGhlIHZhbHVlXG4gICAqIGlzIG9uZSBvZiB0aGUgZm9sbG93aW5nOlxuICAgKiAgLSBhIHN0cmluZyBzdGFydGluZyB3aXRoIDxjb2RlPicrJzwvY29kZT4gb3IgPGNvZGU+Jy0nPC9jb2RlPiB0aGVuIHRoZSBiaXRzIHRvIGFkZCBvciByZW1vdmUsIGUuZy4gPGNvZGU+JytSLVcnPC9jb2RlPiBvciA8Y29kZT4nLVBTJzwvY29kZT4uXG4gICAqICAtIGEgbmV3IHZhbHVlIG9mIGFjY2VzcyBtb2RlXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB2YWwgLSBhY2Nlc3MgbW9kZSB2YWx1ZSB0byB1cGRhdGUuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1cGQgLSB1cGRhdGUgdG8gYXBwbHkgdG8gdmFsLlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSAtIHVwZGF0ZWQgYWNjZXNzIG1vZGUuXG4gICAqL1xuICBzdGF0aWMgdXBkYXRlKHZhbCwgdXBkKSB7XG4gICAgaWYgKCF1cGQgfHwgdHlwZW9mIHVwZCAhPSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIHZhbDtcbiAgICB9XG5cbiAgICBsZXQgYWN0aW9uID0gdXBkLmNoYXJBdCgwKTtcbiAgICBpZiAoYWN0aW9uID09ICcrJyB8fCBhY3Rpb24gPT0gJy0nKSB7XG4gICAgICBsZXQgdmFsMCA9IHZhbDtcbiAgICAgIC8vIFNwbGl0IGRlbHRhLXN0cmluZyBsaWtlICcrQUJDLURFRitaJyBpbnRvIGFuIGFycmF5IG9mIHBhcnRzIGluY2x1ZGluZyArIGFuZCAtLlxuICAgICAgY29uc3QgcGFydHMgPSB1cGQuc3BsaXQoLyhbLStdKS8pO1xuICAgICAgLy8gU3RhcnRpbmcgaXRlcmF0aW9uIGZyb20gMSBiZWNhdXNlIFN0cmluZy5zcGxpdCgpIGNyZWF0ZXMgYW4gYXJyYXkgd2l0aCB0aGUgZmlyc3QgZW1wdHkgZWxlbWVudC5cbiAgICAgIC8vIEl0ZXJhdGluZyBieSAyIGJlY2F1c2Ugd2UgcGFyc2UgcGFpcnMgKy8tIHRoZW4gZGF0YS5cbiAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgcGFydHMubGVuZ3RoIC0gMTsgaSArPSAyKSB7XG4gICAgICAgIGFjdGlvbiA9IHBhcnRzW2ldO1xuICAgICAgICBjb25zdCBtMCA9IEFjY2Vzc01vZGUuZGVjb2RlKHBhcnRzW2kgKyAxXSk7XG4gICAgICAgIGlmIChtMCA9PSBBY2Nlc3NNb2RlLl9JTlZBTElEKSB7XG4gICAgICAgICAgcmV0dXJuIHZhbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAobTAgPT0gbnVsbCkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhY3Rpb24gPT09ICcrJykge1xuICAgICAgICAgIHZhbDAgfD0gbTA7XG4gICAgICAgIH0gZWxzZSBpZiAoYWN0aW9uID09PSAnLScpIHtcbiAgICAgICAgICB2YWwwICY9IH5tMDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdmFsID0gdmFsMDtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVGhlIHN0cmluZyBpcyBhbiBleHBsaWNpdCBuZXcgdmFsdWUgJ0FCQycgcmF0aGVyIHRoYW4gZGVsdGEuXG4gICAgICBjb25zdCB2YWwwID0gQWNjZXNzTW9kZS5kZWNvZGUodXBkKTtcbiAgICAgIGlmICh2YWwwICE9IEFjY2Vzc01vZGUuX0lOVkFMSUQpIHtcbiAgICAgICAgdmFsID0gdmFsMDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdmFsO1xuICB9XG4gIC8qKlxuICAgKiBCaXRzIHByZXNlbnQgaW4gYTEgYnV0IG1pc3NpbmcgaW4gYTIuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlciB8IHN0cmluZ30gYTEgLSBhY2Nlc3MgbW9kZSB0byBzdWJ0cmFjdCBmcm9tLlxuICAgKiBAcGFyYW0ge251bWJlciB8IHN0cmluZ30gYTIgLSBhY2Nlc3MgbW9kZSB0byBzdWJ0cmFjdC5cbiAgICogQHJldHVybnMge251bWJlcn0gYWNjZXNzIG1vZGUgd2l0aCBiaXRzIHByZXNlbnQgaW4gPGNvZGU+YTE8L2NvZGU+IGJ1dCBtaXNzaW5nIGluIDxjb2RlPmEyPC9jb2RlPi5cbiAgICovXG4gIHN0YXRpYyBkaWZmKGExLCBhMikge1xuICAgIGExID0gQWNjZXNzTW9kZS5kZWNvZGUoYTEpO1xuICAgIGEyID0gQWNjZXNzTW9kZS5kZWNvZGUoYTIpO1xuXG4gICAgaWYgKGExID09IEFjY2Vzc01vZGUuX0lOVkFMSUQgfHwgYTIgPT0gQWNjZXNzTW9kZS5fSU5WQUxJRCkge1xuICAgICAgcmV0dXJuIEFjY2Vzc01vZGUuX0lOVkFMSUQ7XG4gICAgfVxuICAgIHJldHVybiBhMSAmIH5hMjtcbiAgfVxuICAvKipcbiAgICogQWNjZXNzTW9kZSBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyB0b3BpYyBhY2Nlc3MgbW9kZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAY2xhc3MgQWNjZXNzTW9kZVxuICAgKi9cbiAgLyoqXG4gICAqIEN1c3RvbSBmb3JtYXR0ZXJcbiAgICovXG4gIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiAne1wibW9kZVwiOiBcIicgKyBBY2Nlc3NNb2RlLmVuY29kZSh0aGlzLm1vZGUpICtcbiAgICAgICdcIiwgXCJnaXZlblwiOiBcIicgKyBBY2Nlc3NNb2RlLmVuY29kZSh0aGlzLmdpdmVuKSArXG4gICAgICAnXCIsIFwid2FudFwiOiBcIicgKyBBY2Nlc3NNb2RlLmVuY29kZSh0aGlzLndhbnQpICsgJ1wifSc7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBDb252ZXJ0cyBudW1lcmljIHZhbHVlcyB0byBzdHJpbmdzLlxuICAgKi9cbiAganNvbkhlbHBlcigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbW9kZTogQWNjZXNzTW9kZS5lbmNvZGUodGhpcy5tb2RlKSxcbiAgICAgIGdpdmVuOiBBY2Nlc3NNb2RlLmVuY29kZSh0aGlzLmdpdmVuKSxcbiAgICAgIHdhbnQ6IEFjY2Vzc01vZGUuZW5jb2RlKHRoaXMud2FudClcbiAgICB9O1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogQXNzaWduIHZhbHVlIHRvICdtb2RlJy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nIHwgTnVtYmVyfSBtIC0gZWl0aGVyIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBhY2Nlc3MgbW9kZSBvciBhIHNldCBvZiBiaXRzLlxuICAgKiBAcmV0dXJucyB7QWNjZXNzTW9kZX0gLSA8Y29kZT50aGlzPC9jb2RlPiBBY2Nlc3NNb2RlLlxuICAgKi9cbiAgc2V0TW9kZShtKSB7XG4gICAgdGhpcy5tb2RlID0gQWNjZXNzTW9kZS5kZWNvZGUobSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBVcGRhdGUgPGNvZGU+bW9kZTwvY29kZT4gdmFsdWUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdSAtIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgY2hhbmdlcyB0byBhcHBseSB0byBhY2Nlc3MgbW9kZS5cbiAgICogQHJldHVybnMge0FjY2Vzc01vZGV9IC0gPGNvZGU+dGhpczwvY29kZT4gQWNjZXNzTW9kZS5cbiAgICovXG4gIHVwZGF0ZU1vZGUodSkge1xuICAgIHRoaXMubW9kZSA9IEFjY2Vzc01vZGUudXBkYXRlKHRoaXMubW9kZSwgdSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBHZXQgPGNvZGU+bW9kZTwvY29kZT4gdmFsdWUgYXMgYSBzdHJpbmcuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSAtIDxjb2RlPm1vZGU8L2NvZGU+IHZhbHVlLlxuICAgKi9cbiAgZ2V0TW9kZSgpIHtcbiAgICByZXR1cm4gQWNjZXNzTW9kZS5lbmNvZGUodGhpcy5tb2RlKTtcbiAgfVxuICAvKipcbiAgICogQWNjZXNzTW9kZSBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyB0b3BpYyBhY2Nlc3MgbW9kZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAY2xhc3MgQWNjZXNzTW9kZVxuICAgKi9cbiAgLyoqXG4gICAqIEFzc2lnbiA8Y29kZT5naXZlbjwvY29kZT4gIHZhbHVlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmcgfCBOdW1iZXJ9IGcgLSBlaXRoZXIgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIGFjY2VzcyBtb2RlIG9yIGEgc2V0IG9mIGJpdHMuXG4gICAqIEByZXR1cm5zIHtBY2Nlc3NNb2RlfSAtIDxjb2RlPnRoaXM8L2NvZGU+IEFjY2Vzc01vZGUuXG4gICAqL1xuICBzZXRHaXZlbihnKSB7XG4gICAgdGhpcy5naXZlbiA9IEFjY2Vzc01vZGUuZGVjb2RlKGcpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogVXBkYXRlICdnaXZlbicgdmFsdWUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdSAtIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgY2hhbmdlcyB0byBhcHBseSB0byBhY2Nlc3MgbW9kZS5cbiAgICogQHJldHVybnMge0FjY2Vzc01vZGV9IC0gPGNvZGU+dGhpczwvY29kZT4gQWNjZXNzTW9kZS5cbiAgICovXG4gIHVwZGF0ZUdpdmVuKHUpIHtcbiAgICB0aGlzLmdpdmVuID0gQWNjZXNzTW9kZS51cGRhdGUodGhpcy5naXZlbiwgdSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBHZXQgJ2dpdmVuJyB2YWx1ZSBhcyBhIHN0cmluZy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IC0gPGI+Z2l2ZW48L2I+IHZhbHVlLlxuICAgKi9cbiAgZ2V0R2l2ZW4oKSB7XG4gICAgcmV0dXJuIEFjY2Vzc01vZGUuZW5jb2RlKHRoaXMuZ2l2ZW4pO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogQXNzaWduICd3YW50JyB2YWx1ZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nIHwgTnVtYmVyfSB3IC0gZWl0aGVyIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBhY2Nlc3MgbW9kZSBvciBhIHNldCBvZiBiaXRzLlxuICAgKiBAcmV0dXJucyB7QWNjZXNzTW9kZX0gLSA8Y29kZT50aGlzPC9jb2RlPiBBY2Nlc3NNb2RlLlxuICAgKi9cbiAgc2V0V2FudCh3KSB7XG4gICAgdGhpcy53YW50ID0gQWNjZXNzTW9kZS5kZWNvZGUodyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBVcGRhdGUgJ3dhbnQnIHZhbHVlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHUgLSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIGNoYW5nZXMgdG8gYXBwbHkgdG8gYWNjZXNzIG1vZGUuXG4gICAqIEByZXR1cm5zIHtBY2Nlc3NNb2RlfSAtIDxjb2RlPnRoaXM8L2NvZGU+IEFjY2Vzc01vZGUuXG4gICAqL1xuICB1cGRhdGVXYW50KHUpIHtcbiAgICB0aGlzLndhbnQgPSBBY2Nlc3NNb2RlLnVwZGF0ZSh0aGlzLndhbnQsIHUpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogR2V0ICd3YW50JyB2YWx1ZSBhcyBhIHN0cmluZy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IC0gPGI+d2FudDwvYj4gdmFsdWUuXG4gICAqL1xuICBnZXRXYW50KCkge1xuICAgIHJldHVybiBBY2Nlc3NNb2RlLmVuY29kZSh0aGlzLndhbnQpO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogR2V0IHBlcm1pc3Npb25zIHByZXNlbnQgaW4gJ3dhbnQnIGJ1dCBtaXNzaW5nIGluICdnaXZlbicuXG4gICAqIEludmVyc2Ugb2Yge0BsaW5rIFRpbm9kZS5BY2Nlc3NNb2RlI2dldEV4Y2Vzc2l2ZX1cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IHBlcm1pc3Npb25zIHByZXNlbnQgaW4gPGI+d2FudDwvYj4gYnV0IG1pc3NpbmcgaW4gPGI+Z2l2ZW48L2I+LlxuICAgKi9cbiAgZ2V0TWlzc2luZygpIHtcbiAgICByZXR1cm4gQWNjZXNzTW9kZS5lbmNvZGUodGhpcy53YW50ICYgfnRoaXMuZ2l2ZW4pO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogR2V0IHBlcm1pc3Npb25zIHByZXNlbnQgaW4gJ2dpdmVuJyBidXQgbWlzc2luZyBpbiAnd2FudCcuXG4gICAqIEludmVyc2Ugb2Yge0BsaW5rIFRpbm9kZS5BY2Nlc3NNb2RlI2dldE1pc3Npbmd9XG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBwZXJtaXNzaW9ucyBwcmVzZW50IGluIDxiPmdpdmVuPC9iPiBidXQgbWlzc2luZyBpbiA8Yj53YW50PC9iPi5cbiAgICovXG4gIGdldEV4Y2Vzc2l2ZSgpIHtcbiAgICByZXR1cm4gQWNjZXNzTW9kZS5lbmNvZGUodGhpcy5naXZlbiAmIH50aGlzLndhbnQpO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogVXBkYXRlICd3YW50JywgJ2dpdmUnLCBhbmQgJ21vZGUnIHZhbHVlcy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqXG4gICAqIEBwYXJhbSB7QWNjZXNzTW9kZX0gdmFsIC0gbmV3IGFjY2VzcyBtb2RlIHZhbHVlLlxuICAgKiBAcmV0dXJucyB7QWNjZXNzTW9kZX0gLSA8Y29kZT50aGlzPC9jb2RlPiBBY2Nlc3NNb2RlLlxuICAgKi9cbiAgdXBkYXRlQWxsKHZhbCkge1xuICAgIGlmICh2YWwpIHtcbiAgICAgIHRoaXMudXBkYXRlR2l2ZW4odmFsLmdpdmVuKTtcbiAgICAgIHRoaXMudXBkYXRlV2FudCh2YWwud2FudCk7XG4gICAgICB0aGlzLm1vZGUgPSB0aGlzLmdpdmVuICYgdGhpcy53YW50O1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICAvKipcbiAgICogQWNjZXNzTW9kZSBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyB0b3BpYyBhY2Nlc3MgbW9kZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAY2xhc3MgQWNjZXNzTW9kZVxuICAgKi9cbiAgLyoqXG4gICAqIENoZWNrIGlmIE93bmVyIChPKSBmbGFnIGlzIHNldC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gc2lkZSAtIHdoaWNoIHBlcm1pc3Npb24gdG8gY2hlY2s6IGdpdmVuLCB3YW50LCBtb2RlOyBkZWZhdWx0OiBtb2RlLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSA8Y29kZT50cnVlPC9jb2RlPiBpZiBmbGFnIGlzIHNldC5cbiAgICovXG4gIGlzT3duZXIoc2lkZSkge1xuICAgIHJldHVybiBBY2Nlc3NNb2RlLiNjaGVja0ZsYWcodGhpcywgc2lkZSwgQWNjZXNzTW9kZS5fT1dORVIpO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogQ2hlY2sgaWYgUHJlc2VuY2UgKFApIGZsYWcgaXMgc2V0LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICogQHBhcmFtIHtzdHJpbmc9fSBzaWRlIC0gd2hpY2ggcGVybWlzc2lvbiB0byBjaGVjazogZ2l2ZW4sIHdhbnQsIG1vZGU7IGRlZmF1bHQ6IG1vZGUuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIDxjb2RlPnRydWU8L2NvZGU+IGlmIGZsYWcgaXMgc2V0LlxuICAgKi9cbiAgaXNQcmVzZW5jZXIoc2lkZSkge1xuICAgIHJldHVybiBBY2Nlc3NNb2RlLiNjaGVja0ZsYWcodGhpcywgc2lkZSwgQWNjZXNzTW9kZS5fUFJFUyk7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBDaGVjayBpZiBQcmVzZW5jZSAoUCkgZmxhZyBpcyBOT1Qgc2V0LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICogQHBhcmFtIHtzdHJpbmc9fSBzaWRlIC0gd2hpY2ggcGVybWlzc2lvbiB0byBjaGVjazogZ2l2ZW4sIHdhbnQsIG1vZGU7IGRlZmF1bHQ6IG1vZGUuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIDxjb2RlPnRydWU8L2NvZGU+IGlmIGZsYWcgaXMgc2V0LlxuICAgKi9cbiAgaXNNdXRlZChzaWRlKSB7XG4gICAgcmV0dXJuICF0aGlzLmlzUHJlc2VuY2VyKHNpZGUpO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogQ2hlY2sgaWYgSm9pbiAoSikgZmxhZyBpcyBzZXQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKiBAcGFyYW0ge3N0cmluZz19IHNpZGUgLSB3aGljaCBwZXJtaXNzaW9uIHRvIGNoZWNrOiBnaXZlbiwgd2FudCwgbW9kZTsgZGVmYXVsdDogbW9kZS5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IC0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgZmxhZyBpcyBzZXQuXG4gICAqL1xuICBpc0pvaW5lcihzaWRlKSB7XG4gICAgcmV0dXJuIEFjY2Vzc01vZGUuI2NoZWNrRmxhZyh0aGlzLCBzaWRlLCBBY2Nlc3NNb2RlLl9KT0lOKTtcbiAgfVxuICAvKipcbiAgICogQWNjZXNzTW9kZSBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyB0b3BpYyBhY2Nlc3MgbW9kZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAY2xhc3MgQWNjZXNzTW9kZVxuICAgKi9cbiAgLyoqXG4gICAqIENoZWNrIGlmIFJlYWRlciAoUikgZmxhZyBpcyBzZXQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKiBAcGFyYW0ge3N0cmluZz19IHNpZGUgLSB3aGljaCBwZXJtaXNzaW9uIHRvIGNoZWNrOiBnaXZlbiwgd2FudCwgbW9kZTsgZGVmYXVsdDogbW9kZS5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IC0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgZmxhZyBpcyBzZXQuXG4gICAqL1xuICBpc1JlYWRlcihzaWRlKSB7XG4gICAgcmV0dXJuIEFjY2Vzc01vZGUuI2NoZWNrRmxhZyh0aGlzLCBzaWRlLCBBY2Nlc3NNb2RlLl9SRUFEKTtcbiAgfVxuICAvKipcbiAgICogQWNjZXNzTW9kZSBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyB0b3BpYyBhY2Nlc3MgbW9kZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAY2xhc3MgQWNjZXNzTW9kZVxuICAgKi9cbiAgLyoqXG4gICAqIENoZWNrIGlmIFdyaXRlciAoVykgZmxhZyBpcyBzZXQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKiBAcGFyYW0ge3N0cmluZz19IHNpZGUgLSB3aGljaCBwZXJtaXNzaW9uIHRvIGNoZWNrOiBnaXZlbiwgd2FudCwgbW9kZTsgZGVmYXVsdDogbW9kZS5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IC0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgZmxhZyBpcyBzZXQuXG4gICAqL1xuICBpc1dyaXRlcihzaWRlKSB7XG4gICAgcmV0dXJuIEFjY2Vzc01vZGUuI2NoZWNrRmxhZyh0aGlzLCBzaWRlLCBBY2Nlc3NNb2RlLl9XUklURSk7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBDaGVjayBpZiBBcHByb3ZlciAoQSkgZmxhZyBpcyBzZXQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKiBAcGFyYW0ge3N0cmluZz19IHNpZGUgLSB3aGljaCBwZXJtaXNzaW9uIHRvIGNoZWNrOiBnaXZlbiwgd2FudCwgbW9kZTsgZGVmYXVsdDogbW9kZS5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IC0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgZmxhZyBpcyBzZXQuXG4gICAqL1xuICBpc0FwcHJvdmVyKHNpZGUpIHtcbiAgICByZXR1cm4gQWNjZXNzTW9kZS4jY2hlY2tGbGFnKHRoaXMsIHNpZGUsIEFjY2Vzc01vZGUuX0FQUFJPVkUpO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogQ2hlY2sgaWYgZWl0aGVyIG9uZSBvZiBPd25lciAoTykgb3IgQXBwcm92ZXIgKEEpIGZsYWdzIGlzIHNldC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gc2lkZSAtIHdoaWNoIHBlcm1pc3Npb24gdG8gY2hlY2s6IGdpdmVuLCB3YW50LCBtb2RlOyBkZWZhdWx0OiBtb2RlLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSA8Y29kZT50cnVlPC9jb2RlPiBpZiBmbGFnIGlzIHNldC5cbiAgICovXG4gIGlzQWRtaW4oc2lkZSkge1xuICAgIHJldHVybiB0aGlzLmlzT3duZXIoc2lkZSkgfHwgdGhpcy5pc0FwcHJvdmVyKHNpZGUpO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogQ2hlY2sgaWYgZWl0aGVyIG9uZSBvZiBPd25lciAoTyksIEFwcHJvdmVyIChBKSwgb3IgU2hhcmVyIChTKSBmbGFncyBpcyBzZXQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKiBAcGFyYW0ge3N0cmluZz19IHNpZGUgLSB3aGljaCBwZXJtaXNzaW9uIHRvIGNoZWNrOiBnaXZlbiwgd2FudCwgbW9kZTsgZGVmYXVsdDogbW9kZS5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IC0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgZmxhZyBpcyBzZXQuXG4gICAqL1xuICBpc1NoYXJlcihzaWRlKSB7XG4gICAgcmV0dXJuIHRoaXMuaXNBZG1pbihzaWRlKSB8fCBBY2Nlc3NNb2RlLiNjaGVja0ZsYWcodGhpcywgc2lkZSwgQWNjZXNzTW9kZS5fU0hBUkUpO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogQ2hlY2sgaWYgRGVsZXRlciAoRCkgZmxhZyBpcyBzZXQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKiBAcGFyYW0ge3N0cmluZz19IHNpZGUgLSB3aGljaCBwZXJtaXNzaW9uIHRvIGNoZWNrOiBnaXZlbiwgd2FudCwgbW9kZTsgZGVmYXVsdDogbW9kZS5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IC0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgZmxhZyBpcyBzZXQuXG4gICAqL1xuICBpc0RlbGV0ZXIoc2lkZSkge1xuICAgIHJldHVybiBBY2Nlc3NNb2RlLiNjaGVja0ZsYWcodGhpcywgc2lkZSwgQWNjZXNzTW9kZS5fREVMRVRFKTtcbiAgfVxufVxuXG5BY2Nlc3NNb2RlLl9OT05FID0gMHgwMDtcbkFjY2Vzc01vZGUuX0pPSU4gPSAweDAxO1xuQWNjZXNzTW9kZS5fUkVBRCA9IDB4MDI7XG5BY2Nlc3NNb2RlLl9XUklURSA9IDB4MDQ7XG5BY2Nlc3NNb2RlLl9QUkVTID0gMHgwODtcbkFjY2Vzc01vZGUuX0FQUFJPVkUgPSAweDEwO1xuQWNjZXNzTW9kZS5fU0hBUkUgPSAweDIwO1xuQWNjZXNzTW9kZS5fREVMRVRFID0gMHg0MDtcbkFjY2Vzc01vZGUuX09XTkVSID0gMHg4MDtcblxuQWNjZXNzTW9kZS5fQklUTUFTSyA9IEFjY2Vzc01vZGUuX0pPSU4gfCBBY2Nlc3NNb2RlLl9SRUFEIHwgQWNjZXNzTW9kZS5fV1JJVEUgfCBBY2Nlc3NNb2RlLl9QUkVTIHxcbiAgQWNjZXNzTW9kZS5fQVBQUk9WRSB8IEFjY2Vzc01vZGUuX1NIQVJFIHwgQWNjZXNzTW9kZS5fREVMRVRFIHwgQWNjZXNzTW9kZS5fT1dORVI7XG5BY2Nlc3NNb2RlLl9JTlZBTElEID0gMHgxMDAwMDA7XG4iLCIvKipcbiAqIEBmaWxlIEluLW1lbW9yeSBzb3J0ZWQgY2FjaGUgb2Ygb2JqZWN0cy5cbiAqXG4gKiBAY29weXJpZ2h0IDIwMTUtMjAyMiBUaW5vZGUgTExDLlxuICovXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogSW4tbWVtb3J5IHNvcnRlZCBjYWNoZSBvZiBvYmplY3RzLlxuICpcbiAqIEBjbGFzcyBDQnVmZmVyXG4gKiBAbWVtYmVyb2YgVGlub2RlXG4gKiBAcHJvdGVjdGVkXG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbn0gY29tcGFyZSBjdXN0b20gY29tcGFyYXRvciBvZiBvYmplY3RzLiBUYWtlcyB0d28gcGFyYW1ldGVycyA8Y29kZT5hPC9jb2RlPiBhbmQgPGNvZGU+YjwvY29kZT47XG4gKiAgICByZXR1cm5zIDxjb2RlPi0xPC9jb2RlPiBpZiA8Y29kZT5hIDwgYjwvY29kZT4sIDxjb2RlPjA8L2NvZGU+IGlmIDxjb2RlPmEgPT0gYjwvY29kZT4sIDxjb2RlPjE8L2NvZGU+IG90aGVyd2lzZS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gdW5pcXVlIGVuZm9yY2UgZWxlbWVudCB1bmlxdWVuZXNzOiB3aGVuIDxjb2RlPnRydWU8L2NvZGU+IHJlcGxhY2UgZXhpc3RpbmcgZWxlbWVudCB3aXRoIGEgbmV3XG4gKiAgICBvbmUgb24gY29uZmxpY3Q7IHdoZW4gPGNvZGU+ZmFsc2U8L2NvZGU+IGtlZXAgYm90aCBlbGVtZW50cy5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ0J1ZmZlciB7XG4gICNjb21wYXJhdG9yID0gdW5kZWZpbmVkO1xuICAjdW5pcXVlID0gZmFsc2U7XG4gIGJ1ZmZlciA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKGNvbXBhcmVfLCB1bmlxdWVfKSB7XG4gICAgdGhpcy4jY29tcGFyYXRvciA9IGNvbXBhcmVfIHx8ICgoYSwgYikgPT4ge1xuICAgICAgcmV0dXJuIGEgPT09IGIgPyAwIDogYSA8IGIgPyAtMSA6IDE7XG4gICAgfSk7XG4gICAgdGhpcy4jdW5pcXVlID0gdW5pcXVlXztcbiAgfVxuXG4gICNmaW5kTmVhcmVzdChlbGVtLCBhcnIsIGV4YWN0KSB7XG4gICAgbGV0IHN0YXJ0ID0gMDtcbiAgICBsZXQgZW5kID0gYXJyLmxlbmd0aCAtIDE7XG4gICAgbGV0IHBpdm90ID0gMDtcbiAgICBsZXQgZGlmZiA9IDA7XG4gICAgbGV0IGZvdW5kID0gZmFsc2U7XG5cbiAgICB3aGlsZSAoc3RhcnQgPD0gZW5kKSB7XG4gICAgICBwaXZvdCA9IChzdGFydCArIGVuZCkgLyAyIHwgMDtcbiAgICAgIGRpZmYgPSB0aGlzLiNjb21wYXJhdG9yKGFycltwaXZvdF0sIGVsZW0pO1xuICAgICAgaWYgKGRpZmYgPCAwKSB7XG4gICAgICAgIHN0YXJ0ID0gcGl2b3QgKyAxO1xuICAgICAgfSBlbHNlIGlmIChkaWZmID4gMCkge1xuICAgICAgICBlbmQgPSBwaXZvdCAtIDE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZm91bmQpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlkeDogcGl2b3QsXG4gICAgICAgIGV4YWN0OiB0cnVlXG4gICAgICB9O1xuICAgIH1cbiAgICBpZiAoZXhhY3QpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlkeDogLTFcbiAgICAgIH07XG4gICAgfVxuICAgIC8vIE5vdCBleGFjdCAtIGluc2VydGlvbiBwb2ludFxuICAgIHJldHVybiB7XG4gICAgICBpZHg6IGRpZmYgPCAwID8gcGl2b3QgKyAxIDogcGl2b3RcbiAgICB9O1xuICB9XG5cbiAgLy8gSW5zZXJ0IGVsZW1lbnQgaW50byBhIHNvcnRlZCBhcnJheS5cbiAgI2luc2VydFNvcnRlZChlbGVtLCBhcnIpIHtcbiAgICBjb25zdCBmb3VuZCA9IHRoaXMuI2ZpbmROZWFyZXN0KGVsZW0sIGFyciwgZmFsc2UpO1xuICAgIGNvbnN0IGNvdW50ID0gKGZvdW5kLmV4YWN0ICYmIHRoaXMuI3VuaXF1ZSkgPyAxIDogMDtcbiAgICBhcnIuc3BsaWNlKGZvdW5kLmlkeCwgY291bnQsIGVsZW0pO1xuICAgIHJldHVybiBhcnI7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGFuIGVsZW1lbnQgYXQgdGhlIGdpdmVuIHBvc2l0aW9uLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNCdWZmZXIjXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBhdCAtIFBvc2l0aW9uIHRvIGZldGNoIGZyb20uXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IEVsZW1lbnQgYXQgdGhlIGdpdmVuIHBvc2l0aW9uIG9yIDxjb2RlPnVuZGVmaW5lZDwvY29kZT4uXG4gICAqL1xuICBnZXRBdChhdCkge1xuICAgIHJldHVybiB0aGlzLmJ1ZmZlclthdF07XG4gIH1cblxuICAvKipcbiAgICogQ29udmVuaWVuY2UgbWV0aG9kIGZvciBnZXR0aW5nIHRoZSBlbGVtZW50IGZyb20gdGhlIGVuZCBvZiB0aGUgYnVmZmVyLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNCdWZmZXIjXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBhdCAtIHBvc2l0aW9uIHRvIGZldGNoIGZyb20sIGNvdW50aW5nIGZyb20gdGhlIGVuZDtcbiAgICogICAgPGNvZGU+dW5kZWZpbmVkPC9jb2RlPiBvciA8Y29kZT5udWxsPC9jb2RlPiAgbWVhbiBcImxhc3RcIi5cbiAgICogQHJldHVybnMge09iamVjdH0gVGhlIGxhc3QgZWxlbWVudCBpbiB0aGUgYnVmZmVyIG9yIDxjb2RlPnVuZGVmaW5lZDwvY29kZT4gaWYgYnVmZmVyIGlzIGVtcHR5LlxuICAgKi9cbiAgZ2V0TGFzdChhdCkge1xuICAgIGF0IHw9IDA7XG4gICAgcmV0dXJuIHRoaXMuYnVmZmVyLmxlbmd0aCA+IGF0ID8gdGhpcy5idWZmZXJbdGhpcy5idWZmZXIubGVuZ3RoIC0gMSAtIGF0XSA6IHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgbmV3IGVsZW1lbnQocykgdG8gdGhlIGJ1ZmZlci4gVmFyaWFkaWM6IHRha2VzIG9uZSBvciBtb3JlIGFyZ3VtZW50cy4gSWYgYW4gYXJyYXkgaXMgcGFzc2VkIGFzIGEgc2luZ2xlXG4gICAqIGFyZ3VtZW50LCBpdHMgZWxlbWVudHMgYXJlIGluc2VydGVkIGluZGl2aWR1YWxseS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5DQnVmZmVyI1xuICAgKlxuICAgKiBAcGFyYW0gey4uLk9iamVjdHxBcnJheX0gLSBPbmUgb3IgbW9yZSBvYmplY3RzIHRvIGluc2VydC5cbiAgICovXG4gIHB1dCgpIHtcbiAgICBsZXQgaW5zZXJ0O1xuICAgIC8vIGluc3BlY3QgYXJndW1lbnRzOiBpZiBhcnJheSwgaW5zZXJ0IGl0cyBlbGVtZW50cywgaWYgb25lIG9yIG1vcmUgbm9uLWFycmF5IGFyZ3VtZW50cywgaW5zZXJ0IHRoZW0gb25lIGJ5IG9uZVxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDEgJiYgQXJyYXkuaXNBcnJheShhcmd1bWVudHNbMF0pKSB7XG4gICAgICBpbnNlcnQgPSBhcmd1bWVudHNbMF07XG4gICAgfSBlbHNlIHtcbiAgICAgIGluc2VydCA9IGFyZ3VtZW50cztcbiAgICB9XG4gICAgZm9yIChsZXQgaWR4IGluIGluc2VydCkge1xuICAgICAgdGhpcy4jaW5zZXJ0U29ydGVkKGluc2VydFtpZHhdLCB0aGlzLmJ1ZmZlcik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBlbGVtZW50IGF0IHRoZSBnaXZlbiBwb3NpdGlvbi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5DQnVmZmVyI1xuICAgKiBAcGFyYW0ge251bWJlcn0gYXQgLSBQb3NpdGlvbiB0byBkZWxldGUgYXQuXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IEVsZW1lbnQgYXQgdGhlIGdpdmVuIHBvc2l0aW9uIG9yIDxjb2RlPnVuZGVmaW5lZDwvY29kZT4uXG4gICAqL1xuICBkZWxBdChhdCkge1xuICAgIGF0IHw9IDA7XG4gICAgbGV0IHIgPSB0aGlzLmJ1ZmZlci5zcGxpY2UoYXQsIDEpO1xuICAgIGlmIChyICYmIHIubGVuZ3RoID4gMCkge1xuICAgICAgcmV0dXJuIHJbMF07XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGVsZW1lbnRzIGJldHdlZW4gdHdvIHBvc2l0aW9ucy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5DQnVmZmVyI1xuICAgKiBAcGFyYW0ge251bWJlcn0gc2luY2UgLSBQb3NpdGlvbiB0byBkZWxldGUgZnJvbSAoaW5jbHVzaXZlKS5cbiAgICogQHBhcmFtIHtudW1iZXJ9IGJlZm9yZSAtIFBvc2l0aW9uIHRvIGRlbGV0ZSB0byAoZXhjbHVzaXZlKS5cbiAgICpcbiAgICogQHJldHVybnMge0FycmF5fSBhcnJheSBvZiByZW1vdmVkIGVsZW1lbnRzIChjb3VsZCBiZSB6ZXJvIGxlbmd0aCkuXG4gICAqL1xuICBkZWxSYW5nZShzaW5jZSwgYmVmb3JlKSB7XG4gICAgcmV0dXJuIHRoaXMuYnVmZmVyLnNwbGljZShzaW5jZSwgYmVmb3JlIC0gc2luY2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgbnVtYmVyIG9mIGVsZW1lbnRzIHRoZSBidWZmZXIgaG9sZHMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ0J1ZmZlciNcbiAgICogQHJldHVybiB7bnVtYmVyfSBOdW1iZXIgb2YgZWxlbWVudHMgaW4gdGhlIGJ1ZmZlci5cbiAgICovXG4gIGxlbmd0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5idWZmZXIubGVuZ3RoO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0IHRoZSBidWZmZXIgZGlzY2FyZGluZyBhbGwgZWxlbWVudHNcbiAgICogQG1lbWJlcm9mIFRpbm9kZS5DQnVmZmVyI1xuICAgKi9cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5idWZmZXIgPSBbXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsYmFjayBmb3IgaXRlcmF0aW5nIGNvbnRlbnRzIG9mIGJ1ZmZlci4gU2VlIHtAbGluayBUaW5vZGUuQ0J1ZmZlciNmb3JFYWNofS5cbiAgICogQGNhbGxiYWNrIEZvckVhY2hDYWxsYmFja1R5cGVcbiAgICogQG1lbWJlcm9mIFRpbm9kZS5DQnVmZmVyI1xuICAgKiBAcGFyYW0ge09iamVjdH0gZWxlbSAtIEN1cnJlbnQgZWxlbWVudCBvZiB0aGUgYnVmZmVyLlxuICAgKiBAcGFyYW0ge09iamVjdH0gcHJldiAtIFByZXZpb3VzIGVsZW1lbnQgb2YgdGhlIGJ1ZmZlci5cbiAgICogQHBhcmFtIHtPYmplY3R9IG5leHQgLSBOZXh0IGVsZW1lbnQgb2YgdGhlIGJ1ZmZlci5cbiAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IC0gSW5kZXggb2YgdGhlIGN1cnJlbnQgZWxlbWVudC5cbiAgICovXG5cbiAgLyoqXG4gICAqIEFwcGx5IGdpdmVuIDxjb2RlPmNhbGxiYWNrPC9jb2RlPiB0byBhbGwgZWxlbWVudHMgb2YgdGhlIGJ1ZmZlci5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5DQnVmZmVyI1xuICAgKlxuICAgKiBAcGFyYW0ge1Rpbm9kZS5Gb3JFYWNoQ2FsbGJhY2tUeXBlfSBjYWxsYmFjayAtIEZ1bmN0aW9uIHRvIGNhbGwgZm9yIGVhY2ggZWxlbWVudC5cbiAgICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0SWR4IC0gT3B0aW9uYWwgaW5kZXggdG8gc3RhcnQgaXRlcmF0aW5nIGZyb20gKGluY2x1c2l2ZSkuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBiZWZvcmVJZHggLSBPcHRpb25hbCBpbmRleCB0byBzdG9wIGl0ZXJhdGluZyBiZWZvcmUgKGV4Y2x1c2l2ZSkuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZXh0IC0gY2FsbGluZyBjb250ZXh0IChpLmUuIHZhbHVlIG9mIDxjb2RlPnRoaXM8L2NvZGU+IGluIGNhbGxiYWNrKVxuICAgKi9cbiAgZm9yRWFjaChjYWxsYmFjaywgc3RhcnRJZHgsIGJlZm9yZUlkeCwgY29udGV4dCkge1xuICAgIHN0YXJ0SWR4ID0gc3RhcnRJZHggfCAwO1xuICAgIGJlZm9yZUlkeCA9IGJlZm9yZUlkeCB8fCB0aGlzLmJ1ZmZlci5sZW5ndGg7XG5cbiAgICBmb3IgKGxldCBpID0gc3RhcnRJZHg7IGkgPCBiZWZvcmVJZHg7IGkrKykge1xuICAgICAgY2FsbGJhY2suY2FsbChjb250ZXh0LCB0aGlzLmJ1ZmZlcltpXSxcbiAgICAgICAgKGkgPiBzdGFydElkeCA/IHRoaXMuYnVmZmVyW2kgLSAxXSA6IHVuZGVmaW5lZCksXG4gICAgICAgIChpIDwgYmVmb3JlSWR4IC0gMSA/IHRoaXMuYnVmZmVyW2kgKyAxXSA6IHVuZGVmaW5lZCksIGkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5kIGVsZW1lbnQgaW4gYnVmZmVyIHVzaW5nIGJ1ZmZlcidzIGNvbXBhcmlzb24gZnVuY3Rpb24uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ0J1ZmZlciNcbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IGVsZW0gLSBlbGVtZW50IHRvIGZpbmQuXG4gICAqIEBwYXJhbSB7Ym9vbGVhbj19IG5lYXJlc3QgLSB3aGVuIHRydWUgYW5kIGV4YWN0IG1hdGNoIGlzIG5vdCBmb3VuZCwgcmV0dXJuIHRoZSBuZWFyZXN0IGVsZW1lbnQgKGluc2VydGlvbiBwb2ludCkuXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IGluZGV4IG9mIHRoZSBlbGVtZW50IGluIHRoZSBidWZmZXIgb3IgLTEuXG4gICAqL1xuICBmaW5kKGVsZW0sIG5lYXJlc3QpIHtcbiAgICBjb25zdCB7XG4gICAgICBpZHhcbiAgICB9ID0gdGhpcy4jZmluZE5lYXJlc3QoZWxlbSwgdGhpcy5idWZmZXIsICFuZWFyZXN0KTtcbiAgICByZXR1cm4gaWR4O1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIGZvciBmaWx0ZXJpbmcgdGhlIGJ1ZmZlci4gU2VlIHtAbGluayBUaW5vZGUuQ0J1ZmZlciNmaWx0ZXJ9LlxuICAgKiBAY2FsbGJhY2sgRm9yRWFjaENhbGxiYWNrVHlwZVxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNCdWZmZXIjXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBlbGVtIC0gQ3VycmVudCBlbGVtZW50IG9mIHRoZSBidWZmZXIuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCAtIEluZGV4IG9mIHRoZSBjdXJyZW50IGVsZW1lbnQuXG4gICAqIEByZXR1cm5zIHtib29sZW59IDxjb2RlPnRydWU8L2NvZGU+IHRvIGtlZXAgdGhlIGVsZW1lbnQsIDxjb2RlPmZhbHNlPC9jb2RlPiB0byByZW1vdmUuXG4gICAqL1xuXG4gIC8qKlxuICAgKiBSZW1vdmUgYWxsIGVsZW1lbnRzIHRoYXQgZG8gbm90IHBhc3MgdGhlIHRlc3QgaW1wbGVtZW50ZWQgYnkgdGhlIHByb3ZpZGVkIGNhbGxiYWNrIGZ1bmN0aW9uLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNCdWZmZXIjXG4gICAqXG4gICAqIEBwYXJhbSB7VGlub2RlLkZpbHRlckNhbGxiYWNrVHlwZX0gY2FsbGJhY2sgLSBGdW5jdGlvbiB0byBjYWxsIGZvciBlYWNoIGVsZW1lbnQuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZXh0IC0gY2FsbGluZyBjb250ZXh0IChpLmUuIHZhbHVlIG9mIDxjb2RlPnRoaXM8L2NvZGU+IGluIHRoZSBjYWxsYmFjaylcbiAgICovXG4gIGZpbHRlcihjYWxsYmFjaywgY29udGV4dCkge1xuICAgIGxldCBjb3VudCA9IDA7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmJ1ZmZlci5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGNhbGxiYWNrLmNhbGwoY29udGV4dCwgdGhpcy5idWZmZXJbaV0sIGkpKSB7XG4gICAgICAgIHRoaXMuYnVmZmVyW2NvdW50XSA9IHRoaXMuYnVmZmVyW2ldO1xuICAgICAgICBjb3VudCsrO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuYnVmZmVyLnNwbGljZShjb3VudCk7XG4gIH1cbn1cbiIsIi8qKlxuICogQGZpbGUgR2xvYmFsIGNvbnN0YW50cyBhbmQgY29uZmlndXJhdGlvbiBwYXJhbWV0ZXJzLlxuICpcbiAqIEBjb3B5cmlnaHQgMjAxNS0yMDIyIFRpbm9kZSBMTENcbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQge1xuICB2ZXJzaW9uIGFzIHBhY2thZ2VfdmVyc2lvblxufSBmcm9tICcuLi92ZXJzaW9uLmpzb24nO1xuXG4vLyBHbG9iYWwgY29uc3RhbnRzXG5leHBvcnQgY29uc3QgUFJPVE9DT0xfVkVSU0lPTiA9ICcwJzsgLy8gTWFqb3IgY29tcG9uZW50IG9mIHRoZSB2ZXJzaW9uLCBlLmcuICcwJyBpbiAnMC4xNy4xJy5cbmV4cG9ydCBjb25zdCBWRVJTSU9OID0gcGFja2FnZV92ZXJzaW9uIHx8ICcwLjIwJztcbmV4cG9ydCBjb25zdCBMSUJSQVJZID0gJ3Rpbm9kZWpzLycgKyBWRVJTSU9OO1xuXG4vLyBUb3BpYyBuYW1lIHByZWZpeGVzLlxuZXhwb3J0IGNvbnN0IFRPUElDX05FVyA9ICduZXcnO1xuZXhwb3J0IGNvbnN0IFRPUElDX05FV19DSEFOID0gJ25jaCc7XG5leHBvcnQgY29uc3QgVE9QSUNfTUUgPSAnbWUnO1xuZXhwb3J0IGNvbnN0IFRPUElDX0ZORCA9ICdmbmQnO1xuZXhwb3J0IGNvbnN0IFRPUElDX1NZUyA9ICdzeXMnO1xuZXhwb3J0IGNvbnN0IFRPUElDX0NIQU4gPSAnY2huJztcbmV4cG9ydCBjb25zdCBUT1BJQ19HUlAgPSAnZ3JwJztcbmV4cG9ydCBjb25zdCBUT1BJQ19QMlAgPSAncDJwJztcbmV4cG9ydCBjb25zdCBVU0VSX05FVyA9ICduZXcnO1xuXG4vLyBTdGFydGluZyB2YWx1ZSBvZiBhIGxvY2FsbHktZ2VuZXJhdGVkIHNlcUlkIHVzZWQgZm9yIHBlbmRpbmcgbWVzc2FnZXMuXG5leHBvcnQgY29uc3QgTE9DQUxfU0VRSUQgPSAweEZGRkZGRkY7XG5cbi8vIFN0YXR1cyBjb2Rlcy5cbmV4cG9ydCBjb25zdCBNRVNTQUdFX1NUQVRVU19OT05FID0gMDsgLy8gU3RhdHVzIG5vdCBhc3NpZ25lZC5cbmV4cG9ydCBjb25zdCBNRVNTQUdFX1NUQVRVU19RVUVVRUQgPSAxOyAvLyBMb2NhbCBJRCBhc3NpZ25lZCwgaW4gcHJvZ3Jlc3MgdG8gYmUgc2VudC5cbmV4cG9ydCBjb25zdCBNRVNTQUdFX1NUQVRVU19TRU5ESU5HID0gMjsgLy8gVHJhbnNtaXNzaW9uIHN0YXJ0ZWQuXG5leHBvcnQgY29uc3QgTUVTU0FHRV9TVEFUVVNfRkFJTEVEID0gMzsgLy8gQXQgbGVhc3Qgb25lIGF0dGVtcHQgd2FzIG1hZGUgdG8gc2VuZCB0aGUgbWVzc2FnZS5cbmV4cG9ydCBjb25zdCBNRVNTQUdFX1NUQVRVU19TRU5UID0gNDsgLy8gRGVsaXZlcmVkIHRvIHRoZSBzZXJ2ZXIuXG5leHBvcnQgY29uc3QgTUVTU0FHRV9TVEFUVVNfUkVDRUlWRUQgPSA1OyAvLyBSZWNlaXZlZCBieSB0aGUgY2xpZW50LlxuZXhwb3J0IGNvbnN0IE1FU1NBR0VfU1RBVFVTX1JFQUQgPSA2OyAvLyBSZWFkIGJ5IHRoZSB1c2VyLlxuZXhwb3J0IGNvbnN0IE1FU1NBR0VfU1RBVFVTX1RPX01FID0gNzsgLy8gVGhlIG1lc3NhZ2UgaXMgcmVjZWl2ZWQgZnJvbSBhbm90aGVyIHVzZXIuXG5leHBvcnQgY29uc3QgTUVTU0FHRV9TVEFUVVNfREVMX1JBTkdFID0gODsgLy8gVGhlIG1lc3NhZ2UgcmVwcmVzZW50cyBhIGRlbGV0ZWQgcmFuZ2UuXG5cbi8vIFJlamVjdCB1bnJlc29sdmVkIGZ1dHVyZXMgYWZ0ZXIgdGhpcyBtYW55IG1pbGxpc2Vjb25kcy5cbmV4cG9ydCBjb25zdCBFWFBJUkVfUFJPTUlTRVNfVElNRU9VVCA9IDVfMDAwO1xuLy8gUGVyaW9kaWNpdHkgb2YgZ2FyYmFnZSBjb2xsZWN0aW9uIG9mIHVucmVzb2x2ZWQgZnV0dXJlcy5cbmV4cG9ydCBjb25zdCBFWFBJUkVfUFJPTUlTRVNfUEVSSU9EID0gMV8wMDA7XG5cbi8vIERlbGF5IGJlZm9yZSBhY2tub3dsZWRnaW5nIHRoYXQgYSBtZXNzYWdlIHdhcyByZWNpdmVkLlxuZXhwb3J0IGNvbnN0IFJFQ1ZfVElNRU9VVCA9IDEwMDtcblxuLy8gRGVmYXVsdCBudW1iZXIgb2YgbWVzc2FnZXMgdG8gcHVsbCBpbnRvIG1lbW9yeSBmcm9tIHBlcnNpc3RlbnQgY2FjaGUuXG5leHBvcnQgY29uc3QgREVGQVVMVF9NRVNTQUdFU19QQUdFID0gMjQ7XG5cbi8vIFVuaWNvZGUgREVMIGNoYXJhY3RlciBpbmRpY2F0aW5nIGRhdGEgd2FzIGRlbGV0ZWQuXG5leHBvcnQgY29uc3QgREVMX0NIQVIgPSAnXFx1MjQyMSc7XG4iLCIvKipcbiAqIEBmaWxlIEFic3RyYWN0aW9uIGxheWVyIGZvciB3ZWJzb2NrZXQgYW5kIGxvbmcgcG9sbGluZyBjb25uZWN0aW9ucy5cbiAqXG4gKiBAY29weXJpZ2h0IDIwMTUtMjAyMiBUaW5vZGUgTExDLlxuICovXG4ndXNlIHN0cmljdCc7XG5cbmltcG9ydCB7XG4gIGpzb25QYXJzZUhlbHBlclxufSBmcm9tICcuL3V0aWxzLmpzJztcblxubGV0IFdlYlNvY2tldFByb3ZpZGVyO1xubGV0IFhIUlByb3ZpZGVyO1xuXG4vLyBFcnJvciBjb2RlIHRvIHJldHVybiBpbiBjYXNlIG9mIGEgbmV0d29yayBwcm9ibGVtLlxuY29uc3QgTkVUV09SS19FUlJPUiA9IDUwMztcbmNvbnN0IE5FVFdPUktfRVJST1JfVEVYVCA9IFwiQ29ubmVjdGlvbiBmYWlsZWRcIjtcblxuLy8gRXJyb3IgY29kZSB0byByZXR1cm4gd2hlbiB1c2VyIGRpc2Nvbm5lY3RlZCBmcm9tIHNlcnZlci5cbmNvbnN0IE5FVFdPUktfVVNFUiA9IDQxODtcbmNvbnN0IE5FVFdPUktfVVNFUl9URVhUID0gXCJEaXNjb25uZWN0ZWQgYnkgY2xpZW50XCI7XG5cbi8vIFNldHRpbmdzIGZvciBleHBvbmVudGlhbCBiYWNrb2ZmXG5jb25zdCBfQk9GRl9CQVNFID0gMjAwMDsgLy8gMjAwMCBtaWxsaXNlY29uZHMsIG1pbmltdW0gZGVsYXkgYmV0d2VlbiByZWNvbm5lY3RzXG5jb25zdCBfQk9GRl9NQVhfSVRFUiA9IDEwOyAvLyBNYXhpbXVtIGRlbGF5IGJldHdlZW4gcmVjb25uZWN0cyAyXjEwICogMjAwMCB+IDM0IG1pbnV0ZXNcbmNvbnN0IF9CT0ZGX0pJVFRFUiA9IDAuMzsgLy8gQWRkIHJhbmRvbSBkZWxheVxuXG4vLyBIZWxwZXIgZnVuY3Rpb24gZm9yIGNyZWF0aW5nIGFuIGVuZHBvaW50IFVSTC5cbmZ1bmN0aW9uIG1ha2VCYXNlVXJsKGhvc3QsIHByb3RvY29sLCB2ZXJzaW9uLCBhcGlLZXkpIHtcbiAgbGV0IHVybCA9IG51bGw7XG5cbiAgaWYgKFsnaHR0cCcsICdodHRwcycsICd3cycsICd3c3MnXS5pbmNsdWRlcyhwcm90b2NvbCkpIHtcbiAgICB1cmwgPSBgJHtwcm90b2NvbH06Ly8ke2hvc3R9YDtcbiAgICBpZiAodXJsLmNoYXJBdCh1cmwubGVuZ3RoIC0gMSkgIT09ICcvJykge1xuICAgICAgdXJsICs9ICcvJztcbiAgICB9XG4gICAgdXJsICs9ICd2JyArIHZlcnNpb24gKyAnL2NoYW5uZWxzJztcbiAgICBpZiAoWydodHRwJywgJ2h0dHBzJ10uaW5jbHVkZXMocHJvdG9jb2wpKSB7XG4gICAgICAvLyBMb25nIHBvbGxpbmcgZW5kcG9pbnQgZW5kcyB3aXRoIFwibHBcIiwgaS5lLlxuICAgICAgLy8gJy92MC9jaGFubmVscy9scCcgdnMganVzdCAnL3YwL2NoYW5uZWxzJyBmb3Igd3NcbiAgICAgIHVybCArPSAnL2xwJztcbiAgICB9XG4gICAgdXJsICs9ICc/YXBpa2V5PScgKyBhcGlLZXk7XG4gIH1cbiAgcmV0dXJuIHVybDtcbn1cblxuLyoqXG4gKiBBbiBhYnN0cmFjdGlvbiBmb3IgYSB3ZWJzb2NrZXQgb3IgYSBsb25nIHBvbGxpbmcgY29ubmVjdGlvbi5cbiAqXG4gKiBAY2xhc3MgQ29ubmVjdGlvblxuICogQG1lbWJlcm9mIFRpbm9kZVxuXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnIC0gY29uZmlndXJhdGlvbiBwYXJhbWV0ZXJzLlxuICogQHBhcmFtIHtzdHJpbmd9IGNvbmZpZy5ob3N0IC0gSG9zdCBuYW1lIGFuZCBvcHRpb25hbCBwb3J0IG51bWJlciB0byBjb25uZWN0IHRvLlxuICogQHBhcmFtIHtzdHJpbmd9IGNvbmZpZy5hcGlLZXkgLSBBUEkga2V5IGdlbmVyYXRlZCBieSA8Y29kZT5rZXlnZW48L2NvZGU+LlxuICogQHBhcmFtIHtzdHJpbmd9IGNvbmZpZy50cmFuc3BvcnQgLSBOZXR3b3JrIHRyYW5zcG9ydCB0byB1c2UsIGVpdGhlciA8Y29kZT5cIndzXCI8Y29kZT4vPGNvZGU+XCJ3c3NcIjwvY29kZT4gZm9yIHdlYnNvY2tldCBvclxuICogICAgICA8Y29kZT5scDwvY29kZT4gZm9yIGxvbmcgcG9sbGluZy5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gY29uZmlnLnNlY3VyZSAtIFVzZSBTZWN1cmUgV2ViU29ja2V0IGlmIDxjb2RlPnRydWU8L2NvZGU+LlxuICogQHBhcmFtIHtzdHJpbmd9IHZlcnNpb25fIC0gTWFqb3IgdmFsdWUgb2YgdGhlIHByb3RvY29sIHZlcnNpb24sIGUuZy4gJzAnIGluICcwLjE3LjEnLlxuICogQHBhcmFtIHtib29sZWFufSBhdXRvcmVjb25uZWN0XyAtIElmIGNvbm5lY3Rpb24gaXMgbG9zdCwgdHJ5IHRvIHJlY29ubmVjdCBhdXRvbWF0aWNhbGx5LlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb25uZWN0aW9uIHtcbiAgLy8gTG9nZ2VyLCBkb2VzIG5vdGhpbmcgYnkgZGVmYXVsdC5cbiAgc3RhdGljICNsb2cgPSBfID0+IHt9O1xuXG4gICNib2ZmVGltZXIgPSBudWxsO1xuICAjYm9mZkl0ZXJhdGlvbiA9IDA7XG4gICNib2ZmQ2xvc2VkID0gZmFsc2U7IC8vIEluZGljYXRvciBpZiB0aGUgc29ja2V0IHdhcyBtYW51YWxseSBjbG9zZWQgLSBkb24ndCBhdXRvcmVjb25uZWN0IGlmIHRydWUuXG5cbiAgLy8gV2Vic29ja2V0LlxuICAjc29ja2V0ID0gbnVsbDtcblxuICBob3N0O1xuICBzZWN1cmU7XG4gIGFwaUtleTtcblxuICB2ZXJzaW9uO1xuICBhdXRvcmVjb25uZWN0O1xuXG4gIGluaXRpYWxpemVkO1xuXG4gIC8vIChjb25maWcuaG9zdCwgY29uZmlnLmFwaUtleSwgY29uZmlnLnRyYW5zcG9ydCwgY29uZmlnLnNlY3VyZSksIFBST1RPQ09MX1ZFUlNJT04sIHRydWVcbiAgY29uc3RydWN0b3IoY29uZmlnLCB2ZXJzaW9uXywgYXV0b3JlY29ubmVjdF8pIHtcbiAgICB0aGlzLmhvc3QgPSBjb25maWcuaG9zdDtcbiAgICB0aGlzLnNlY3VyZSA9IGNvbmZpZy5zZWN1cmU7XG4gICAgdGhpcy5hcGlLZXkgPSBjb25maWcuYXBpS2V5O1xuXG4gICAgdGhpcy52ZXJzaW9uID0gdmVyc2lvbl87XG4gICAgdGhpcy5hdXRvcmVjb25uZWN0ID0gYXV0b3JlY29ubmVjdF87XG5cbiAgICBpZiAoY29uZmlnLnRyYW5zcG9ydCA9PT0gJ2xwJykge1xuICAgICAgLy8gZXhwbGljaXQgcmVxdWVzdCB0byB1c2UgbG9uZyBwb2xsaW5nXG4gICAgICB0aGlzLiNpbml0X2xwKCk7XG4gICAgICB0aGlzLmluaXRpYWxpemVkID0gJ2xwJztcbiAgICB9IGVsc2UgaWYgKGNvbmZpZy50cmFuc3BvcnQgPT09ICd3cycpIHtcbiAgICAgIC8vIGV4cGxpY2l0IHJlcXVlc3QgdG8gdXNlIHdlYiBzb2NrZXRcbiAgICAgIC8vIGlmIHdlYnNvY2tldHMgYXJlIG5vdCBhdmFpbGFibGUsIGhvcnJpYmxlIHRoaW5ncyB3aWxsIGhhcHBlblxuICAgICAgdGhpcy4jaW5pdF93cygpO1xuICAgICAgdGhpcy5pbml0aWFsaXplZCA9ICd3cyc7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmluaXRpYWxpemVkKSB7XG4gICAgICAvLyBJbnZhbGlkIG9yIHVuZGVmaW5lZCBuZXR3b3JrIHRyYW5zcG9ydC5cbiAgICAgIENvbm5lY3Rpb24uI2xvZyhcIlVua25vd24gb3IgaW52YWxpZCBuZXR3b3JrIHRyYW5zcG9ydC4gUnVubmluZyB1bmRlciBOb2RlPyBDYWxsICdUaW5vZGUuc2V0TmV0d29ya1Byb3ZpZGVycygpJy5cIik7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duIG9yIGludmFsaWQgbmV0d29yayB0cmFuc3BvcnQuIFJ1bm5pbmcgdW5kZXIgTm9kZT8gQ2FsbCAnVGlub2RlLnNldE5ldHdvcmtQcm92aWRlcnMoKScuXCIpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUbyB1c2UgQ29ubmVjdGlvbiBpbiBhIG5vbiBicm93c2VyIGNvbnRleHQsIHN1cHBseSBXZWJTb2NrZXQgYW5kIFhNTEh0dHBSZXF1ZXN0IHByb3ZpZGVycy5cbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyb2YgQ29ubmVjdGlvblxuICAgKiBAcGFyYW0gd3NQcm92aWRlciBXZWJTb2NrZXQgcHJvdmlkZXIsIGUuZy4gZm9yIG5vZGVKUyAsIDxjb2RlPnJlcXVpcmUoJ3dzJyk8L2NvZGU+LlxuICAgKiBAcGFyYW0geGhyUHJvdmlkZXIgWE1MSHR0cFJlcXVlc3QgcHJvdmlkZXIsIGUuZy4gZm9yIG5vZGUgPGNvZGU+cmVxdWlyZSgneGhyJyk8L2NvZGU+LlxuICAgKi9cbiAgc3RhdGljIHNldE5ldHdvcmtQcm92aWRlcnMod3NQcm92aWRlciwgeGhyUHJvdmlkZXIpIHtcbiAgICBXZWJTb2NrZXRQcm92aWRlciA9IHdzUHJvdmlkZXI7XG4gICAgWEhSUHJvdmlkZXIgPSB4aHJQcm92aWRlcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBBc3NpZ24gYSBub24tZGVmYXVsdCBsb2dnZXIuXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlcm9mIENvbm5lY3Rpb25cbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gbCB2YXJpYWRpYyBsb2dnaW5nIGZ1bmN0aW9uLlxuICAgKi9cbiAgc3RhdGljIHNldCBsb2dnZXIobCkge1xuICAgIENvbm5lY3Rpb24uI2xvZyA9IGw7XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhdGUgYSBuZXcgY29ubmVjdGlvblxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNvbm5lY3Rpb24jXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBob3N0XyBIb3N0IG5hbWUgdG8gY29ubmVjdCB0bzsgaWYgPGNvZGU+bnVsbDwvY29kZT4gdGhlIG9sZCBob3N0IG5hbWUgd2lsbCBiZSB1c2VkLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGZvcmNlIEZvcmNlIG5ldyBjb25uZWN0aW9uIGV2ZW4gaWYgb25lIGFscmVhZHkgZXhpc3RzLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBQcm9taXNlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIGNvbm5lY3Rpb24gY2FsbCBjb21wbGV0ZXMsIHJlc29sdXRpb24gaXMgY2FsbGVkIHdpdGhvdXRcbiAgICogIHBhcmFtZXRlcnMsIHJlamVjdGlvbiBwYXNzZXMgdGhlIHtFcnJvcn0gYXMgcGFyYW1ldGVyLlxuICAgKi9cbiAgY29ubmVjdChob3N0XywgZm9yY2UpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobnVsbCk7XG4gIH1cblxuICAvKipcbiAgICogVHJ5IHRvIHJlc3RvcmUgYSBuZXR3b3JrIGNvbm5lY3Rpb24sIGFsc28gcmVzZXQgYmFja29mZi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Db25uZWN0aW9uI1xuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGZvcmNlIC0gcmVjb25uZWN0IGV2ZW4gaWYgdGhlcmUgaXMgYSBsaXZlIGNvbm5lY3Rpb24gYWxyZWFkeS5cbiAgICovXG4gIHJlY29ubmVjdChmb3JjZSkge31cblxuICAvKipcbiAgICogVGVybWluYXRlIHRoZSBuZXR3b3JrIGNvbm5lY3Rpb25cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Db25uZWN0aW9uI1xuICAgKi9cbiAgZGlzY29ubmVjdCgpIHt9XG5cbiAgLyoqXG4gICAqIFNlbmQgYSBzdHJpbmcgdG8gdGhlIHNlcnZlci5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Db25uZWN0aW9uI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbXNnIC0gU3RyaW5nIHRvIHNlbmQuXG4gICAqIEB0aHJvd3MgVGhyb3dzIGFuIGV4Y2VwdGlvbiBpZiB0aGUgdW5kZXJseWluZyBjb25uZWN0aW9uIGlzIG5vdCBsaXZlLlxuICAgKi9cbiAgc2VuZFRleHQobXNnKSB7fVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBjb25uZWN0aW9uIGlzIGFsaXZlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNvbm5lY3Rpb24jXG4gICAqIEByZXR1cm5zIHtib29sZWFufSA8Y29kZT50cnVlPC9jb2RlPiBpZiBjb25uZWN0aW9uIGlzIGxpdmUsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBpc0Nvbm5lY3RlZCgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBuYW1lIG9mIHRoZSBjdXJyZW50IG5ldHdvcmsgdHJhbnNwb3J0LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNvbm5lY3Rpb24jXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IG5hbWUgb2YgdGhlIHRyYW5zcG9ydCBzdWNoIGFzIDxjb2RlPlwid3NcIjwvY29kZT4gb3IgPGNvZGU+XCJscFwiPC9jb2RlPi5cbiAgICovXG4gIHRyYW5zcG9ydCgpIHtcbiAgICByZXR1cm4gdGhpcy5pbml0aWFsaXplZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kIG5ldHdvcmsgcHJvYmUgdG8gY2hlY2sgaWYgY29ubmVjdGlvbiBpcyBpbmRlZWQgbGl2ZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Db25uZWN0aW9uI1xuICAgKi9cbiAgcHJvYmUoKSB7XG4gICAgdGhpcy5zZW5kVGV4dCgnMScpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0IGF1dG9yZWNvbm5lY3QgY291bnRlciB0byB6ZXJvLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNvbm5lY3Rpb24jXG4gICAqL1xuICBiYWNrb2ZmUmVzZXQoKSB7XG4gICAgdGhpcy4jYm9mZlJlc2V0KCk7XG4gIH1cblxuICAvLyBCYWNrb2ZmIGltcGxlbWVudGF0aW9uIC0gcmVjb25uZWN0IGFmdGVyIGEgdGltZW91dC5cbiAgI2JvZmZSZWNvbm5lY3QoKSB7XG4gICAgLy8gQ2xlYXIgdGltZXJcbiAgICBjbGVhclRpbWVvdXQodGhpcy4jYm9mZlRpbWVyKTtcbiAgICAvLyBDYWxjdWxhdGUgd2hlbiB0byBmaXJlIHRoZSByZWNvbm5lY3QgYXR0ZW1wdFxuICAgIGNvbnN0IHRpbWVvdXQgPSBfQk9GRl9CQVNFICogKE1hdGgucG93KDIsIHRoaXMuI2JvZmZJdGVyYXRpb24pICogKDEuMCArIF9CT0ZGX0pJVFRFUiAqIE1hdGgucmFuZG9tKCkpKTtcbiAgICAvLyBVcGRhdGUgaXRlcmF0aW9uIGNvdW50ZXIgZm9yIGZ1dHVyZSB1c2VcbiAgICB0aGlzLiNib2ZmSXRlcmF0aW9uID0gKHRoaXMuI2JvZmZJdGVyYXRpb24gPj0gX0JPRkZfTUFYX0lURVIgPyB0aGlzLiNib2ZmSXRlcmF0aW9uIDogdGhpcy4jYm9mZkl0ZXJhdGlvbiArIDEpO1xuICAgIGlmICh0aGlzLm9uQXV0b3JlY29ubmVjdEl0ZXJhdGlvbikge1xuICAgICAgdGhpcy5vbkF1dG9yZWNvbm5lY3RJdGVyYXRpb24odGltZW91dCk7XG4gICAgfVxuXG4gICAgdGhpcy4jYm9mZlRpbWVyID0gc2V0VGltZW91dChfID0+IHtcbiAgICAgIENvbm5lY3Rpb24uI2xvZyhgUmVjb25uZWN0aW5nLCBpdGVyPSR7dGhpcy4jYm9mZkl0ZXJhdGlvbn0sIHRpbWVvdXQ9JHt0aW1lb3V0fWApO1xuICAgICAgLy8gTWF5YmUgdGhlIHNvY2tldCB3YXMgY2xvc2VkIHdoaWxlIHdlIHdhaXRlZCBmb3IgdGhlIHRpbWVyP1xuICAgICAgaWYgKCF0aGlzLiNib2ZmQ2xvc2VkKSB7XG4gICAgICAgIGNvbnN0IHByb20gPSB0aGlzLmNvbm5lY3QoKTtcbiAgICAgICAgaWYgKHRoaXMub25BdXRvcmVjb25uZWN0SXRlcmF0aW9uKSB7XG4gICAgICAgICAgdGhpcy5vbkF1dG9yZWNvbm5lY3RJdGVyYXRpb24oMCwgcHJvbSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gU3VwcHJlc3MgZXJyb3IgaWYgaXQncyBub3QgdXNlZC5cbiAgICAgICAgICBwcm9tLmNhdGNoKF8gPT4ge1xuICAgICAgICAgICAgLyogZG8gbm90aGluZyAqL1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHRoaXMub25BdXRvcmVjb25uZWN0SXRlcmF0aW9uKSB7XG4gICAgICAgIHRoaXMub25BdXRvcmVjb25uZWN0SXRlcmF0aW9uKC0xKTtcbiAgICAgIH1cbiAgICB9LCB0aW1lb3V0KTtcbiAgfVxuXG4gIC8vIFRlcm1pbmF0ZSBhdXRvLXJlY29ubmVjdCBwcm9jZXNzLlxuICAjYm9mZlN0b3AoKSB7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuI2JvZmZUaW1lcik7XG4gICAgdGhpcy4jYm9mZlRpbWVyID0gbnVsbDtcbiAgfVxuXG4gIC8vIFJlc2V0IGF1dG8tcmVjb25uZWN0IGl0ZXJhdGlvbiBjb3VudGVyLlxuICAjYm9mZlJlc2V0KCkge1xuICAgIHRoaXMuI2JvZmZJdGVyYXRpb24gPSAwO1xuICB9XG5cbiAgLy8gSW5pdGlhbGl6YXRpb24gZm9yIGxvbmcgcG9sbGluZy5cbiAgI2luaXRfbHAoKSB7XG4gICAgY29uc3QgWERSX1VOU0VOVCA9IDA7IC8vIENsaWVudCBoYXMgYmVlbiBjcmVhdGVkLiBvcGVuKCkgbm90IGNhbGxlZCB5ZXQuXG4gICAgY29uc3QgWERSX09QRU5FRCA9IDE7IC8vIG9wZW4oKSBoYXMgYmVlbiBjYWxsZWQuXG4gICAgY29uc3QgWERSX0hFQURFUlNfUkVDRUlWRUQgPSAyOyAvLyBzZW5kKCkgaGFzIGJlZW4gY2FsbGVkLCBhbmQgaGVhZGVycyBhbmQgc3RhdHVzIGFyZSBhdmFpbGFibGUuXG4gICAgY29uc3QgWERSX0xPQURJTkcgPSAzOyAvLyBEb3dubG9hZGluZzsgcmVzcG9uc2VUZXh0IGhvbGRzIHBhcnRpYWwgZGF0YS5cbiAgICBjb25zdCBYRFJfRE9ORSA9IDQ7IC8vIFRoZSBvcGVyYXRpb24gaXMgY29tcGxldGUuXG5cbiAgICAvLyBGdWxseSBjb21wb3NlZCBlbmRwb2ludCBVUkwsIHdpdGggQVBJIGtleSAmIFNJRFxuICAgIGxldCBfbHBVUkwgPSBudWxsO1xuXG4gICAgbGV0IF9wb2xsZXIgPSBudWxsO1xuICAgIGxldCBfc2VuZGVyID0gbnVsbDtcblxuICAgIGxldCBscF9zZW5kZXIgPSAodXJsXykgPT4ge1xuICAgICAgY29uc3Qgc2VuZGVyID0gbmV3IFhIUlByb3ZpZGVyKCk7XG4gICAgICBzZW5kZXIub25yZWFkeXN0YXRlY2hhbmdlID0gKGV2dCkgPT4ge1xuICAgICAgICBpZiAoc2VuZGVyLnJlYWR5U3RhdGUgPT0gWERSX0RPTkUgJiYgc2VuZGVyLnN0YXR1cyA+PSA0MDApIHtcbiAgICAgICAgICAvLyBTb21lIHNvcnQgb2YgZXJyb3IgcmVzcG9uc2VcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYExQIHNlbmRlciBmYWlsZWQsICR7c2VuZGVyLnN0YXR1c31gKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgc2VuZGVyLm9wZW4oJ1BPU1QnLCB1cmxfLCB0cnVlKTtcbiAgICAgIHJldHVybiBzZW5kZXI7XG4gICAgfVxuXG4gICAgbGV0IGxwX3BvbGxlciA9ICh1cmxfLCByZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGxldCBwb2xsZXIgPSBuZXcgWEhSUHJvdmlkZXIoKTtcbiAgICAgIGxldCBwcm9taXNlQ29tcGxldGVkID0gZmFsc2U7XG5cbiAgICAgIHBvbGxlci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoZXZ0KSA9PiB7XG4gICAgICAgIGlmIChwb2xsZXIucmVhZHlTdGF0ZSA9PSBYRFJfRE9ORSkge1xuICAgICAgICAgIGlmIChwb2xsZXIuc3RhdHVzID09IDIwMSkgeyAvLyAyMDEgPT0gSFRUUC5DcmVhdGVkLCBnZXQgU0lEXG4gICAgICAgICAgICBsZXQgcGt0ID0gSlNPTi5wYXJzZShwb2xsZXIucmVzcG9uc2VUZXh0LCBqc29uUGFyc2VIZWxwZXIpO1xuICAgICAgICAgICAgX2xwVVJMID0gdXJsXyArICcmc2lkPScgKyBwa3QuY3RybC5wYXJhbXMuc2lkO1xuICAgICAgICAgICAgcG9sbGVyID0gbHBfcG9sbGVyKF9scFVSTCk7XG4gICAgICAgICAgICBwb2xsZXIuc2VuZChudWxsKTtcbiAgICAgICAgICAgIGlmICh0aGlzLm9uT3Blbikge1xuICAgICAgICAgICAgICB0aGlzLm9uT3BlbigpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocmVzb2x2ZSkge1xuICAgICAgICAgICAgICBwcm9taXNlQ29tcGxldGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5hdXRvcmVjb25uZWN0KSB7XG4gICAgICAgICAgICAgIHRoaXMuI2JvZmZTdG9wKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChwb2xsZXIuc3RhdHVzIDwgNDAwKSB7IC8vIDQwMCA9IEhUVFAuQmFkUmVxdWVzdFxuICAgICAgICAgICAgaWYgKHRoaXMub25NZXNzYWdlKSB7XG4gICAgICAgICAgICAgIHRoaXMub25NZXNzYWdlKHBvbGxlci5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcG9sbGVyID0gbHBfcG9sbGVyKF9scFVSTCk7XG4gICAgICAgICAgICBwb2xsZXIuc2VuZChudWxsKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gRG9uJ3QgdGhyb3cgYW4gZXJyb3IgaGVyZSwgZ3JhY2VmdWxseSBoYW5kbGUgc2VydmVyIGVycm9yc1xuICAgICAgICAgICAgaWYgKHJlamVjdCAmJiAhcHJvbWlzZUNvbXBsZXRlZCkge1xuICAgICAgICAgICAgICBwcm9taXNlQ29tcGxldGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgcmVqZWN0KHBvbGxlci5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMub25NZXNzYWdlICYmIHBvbGxlci5yZXNwb25zZVRleHQpIHtcbiAgICAgICAgICAgICAgdGhpcy5vbk1lc3NhZ2UocG9sbGVyLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5vbkRpc2Nvbm5lY3QpIHtcbiAgICAgICAgICAgICAgY29uc3QgY29kZSA9IHBvbGxlci5zdGF0dXMgfHwgKHRoaXMuI2JvZmZDbG9zZWQgPyBORVRXT1JLX1VTRVIgOiBORVRXT1JLX0VSUk9SKTtcbiAgICAgICAgICAgICAgY29uc3QgdGV4dCA9IHBvbGxlci5yZXNwb25zZVRleHQgfHwgKHRoaXMuI2JvZmZDbG9zZWQgPyBORVRXT1JLX1VTRVJfVEVYVCA6IE5FVFdPUktfRVJST1JfVEVYVCk7XG4gICAgICAgICAgICAgIHRoaXMub25EaXNjb25uZWN0KG5ldyBFcnJvcih0ZXh0ICsgJyAoJyArIGNvZGUgKyAnKScpLCBjb2RlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gUG9sbGluZyBoYXMgc3RvcHBlZC4gSW5kaWNhdGUgaXQgYnkgc2V0dGluZyBwb2xsZXIgdG8gbnVsbC5cbiAgICAgICAgICAgIHBvbGxlciA9IG51bGw7XG4gICAgICAgICAgICBpZiAoIXRoaXMuI2JvZmZDbG9zZWQgJiYgdGhpcy5hdXRvcmVjb25uZWN0KSB7XG4gICAgICAgICAgICAgIHRoaXMuI2JvZmZSZWNvbm5lY3QoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICAvLyBVc2luZyBQT1NUIHRvIGF2b2lkIGNhY2hpbmcgcmVzcG9uc2UgYnkgc2VydmljZSB3b3JrZXIuXG4gICAgICBwb2xsZXIub3BlbignUE9TVCcsIHVybF8sIHRydWUpO1xuICAgICAgcmV0dXJuIHBvbGxlcjtcbiAgICB9XG5cbiAgICB0aGlzLmNvbm5lY3QgPSAoaG9zdF8sIGZvcmNlKSA9PiB7XG4gICAgICB0aGlzLiNib2ZmQ2xvc2VkID0gZmFsc2U7XG5cbiAgICAgIGlmIChfcG9sbGVyKSB7XG4gICAgICAgIGlmICghZm9yY2UpIHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgICAgICAgX3BvbGxlci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSB1bmRlZmluZWQ7XG4gICAgICAgIF9wb2xsZXIuYWJvcnQoKTtcbiAgICAgICAgX3BvbGxlciA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIGlmIChob3N0Xykge1xuICAgICAgICB0aGlzLmhvc3QgPSBob3N0XztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgY29uc3QgdXJsID0gbWFrZUJhc2VVcmwodGhpcy5ob3N0LCB0aGlzLnNlY3VyZSA/ICdodHRwcycgOiAnaHR0cCcsIHRoaXMudmVyc2lvbiwgdGhpcy5hcGlLZXkpO1xuICAgICAgICBDb25uZWN0aW9uLiNsb2coXCJMUCBjb25uZWN0aW5nIHRvOlwiLCB1cmwpO1xuICAgICAgICBfcG9sbGVyID0gbHBfcG9sbGVyKHVybCwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgX3BvbGxlci5zZW5kKG51bGwpO1xuICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICBDb25uZWN0aW9uLiNsb2coXCJMUCBjb25uZWN0aW9uIGZhaWxlZDpcIiwgZXJyKTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICB0aGlzLnJlY29ubmVjdCA9IChmb3JjZSkgPT4ge1xuICAgICAgdGhpcy4jYm9mZlN0b3AoKTtcbiAgICAgIHRoaXMuY29ubmVjdChudWxsLCBmb3JjZSk7XG4gICAgfTtcblxuICAgIHRoaXMuZGlzY29ubmVjdCA9ICgpID0+IHtcbiAgICAgIHRoaXMuI2JvZmZDbG9zZWQgPSB0cnVlO1xuICAgICAgdGhpcy4jYm9mZlN0b3AoKTtcblxuICAgICAgaWYgKF9zZW5kZXIpIHtcbiAgICAgICAgX3NlbmRlci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSB1bmRlZmluZWQ7XG4gICAgICAgIF9zZW5kZXIuYWJvcnQoKTtcbiAgICAgICAgX3NlbmRlciA9IG51bGw7XG4gICAgICB9XG4gICAgICBpZiAoX3BvbGxlcikge1xuICAgICAgICBfcG9sbGVyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgX3BvbGxlci5hYm9ydCgpO1xuICAgICAgICBfcG9sbGVyID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMub25EaXNjb25uZWN0KSB7XG4gICAgICAgIHRoaXMub25EaXNjb25uZWN0KG5ldyBFcnJvcihORVRXT1JLX1VTRVJfVEVYVCArICcgKCcgKyBORVRXT1JLX1VTRVIgKyAnKScpLCBORVRXT1JLX1VTRVIpO1xuICAgICAgfVxuICAgICAgLy8gRW5zdXJlIGl0J3MgcmVjb25zdHJ1Y3RlZFxuICAgICAgX2xwVVJMID0gbnVsbDtcbiAgICB9O1xuXG4gICAgdGhpcy5zZW5kVGV4dCA9IChtc2cpID0+IHtcbiAgICAgIF9zZW5kZXIgPSBscF9zZW5kZXIoX2xwVVJMKTtcbiAgICAgIGlmIChfc2VuZGVyICYmIChfc2VuZGVyLnJlYWR5U3RhdGUgPT0gWERSX09QRU5FRCkpIHsgLy8gMSA9PSBPUEVORURcbiAgICAgICAgX3NlbmRlci5zZW5kKG1zZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJMb25nIHBvbGxlciBmYWlsZWQgdG8gY29ubmVjdFwiKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy5pc0Nvbm5lY3RlZCA9ICgpID0+IHtcbiAgICAgIHJldHVybiAoX3BvbGxlciAmJiB0cnVlKTtcbiAgICB9O1xuICB9XG5cbiAgLy8gSW5pdGlhbGl6YXRpb24gZm9yIFdlYnNvY2tldFxuICAjaW5pdF93cygpIHtcbiAgICB0aGlzLmNvbm5lY3QgPSAoaG9zdF8sIGZvcmNlKSA9PiB7XG4gICAgICB0aGlzLiNib2ZmQ2xvc2VkID0gZmFsc2U7XG5cbiAgICAgIGlmICh0aGlzLiNzb2NrZXQpIHtcbiAgICAgICAgaWYgKCFmb3JjZSAmJiB0aGlzLiNzb2NrZXQucmVhZHlTdGF0ZSA9PSB0aGlzLiNzb2NrZXQuT1BFTikge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLiNzb2NrZXQuY2xvc2UoKTtcbiAgICAgICAgdGhpcy4jc29ja2V0ID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgaWYgKGhvc3RfKSB7XG4gICAgICAgIHRoaXMuaG9zdCA9IGhvc3RfO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBjb25zdCB1cmwgPSBtYWtlQmFzZVVybCh0aGlzLmhvc3QsIHRoaXMuc2VjdXJlID8gJ3dzcycgOiAnd3MnLCB0aGlzLnZlcnNpb24sIHRoaXMuYXBpS2V5KTtcblxuICAgICAgICBDb25uZWN0aW9uLiNsb2coXCJXUyBjb25uZWN0aW5nIHRvOiBcIiwgdXJsKTtcblxuICAgICAgICAvLyBJdCB0aHJvd3Mgd2hlbiB0aGUgc2VydmVyIGlzIG5vdCBhY2Nlc3NpYmxlIGJ1dCB0aGUgZXhjZXB0aW9uIGNhbm5vdCBiZSBjYXVnaHQ6XG4gICAgICAgIC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzMxMDAyNTkyL2phdmFzY3JpcHQtZG9lc250LWNhdGNoLWVycm9yLWluLXdlYnNvY2tldC1pbnN0YW50aWF0aW9uLzMxMDAzMDU3XG4gICAgICAgIGNvbnN0IGNvbm4gPSBuZXcgV2ViU29ja2V0UHJvdmlkZXIodXJsKTtcblxuICAgICAgICBjb25uLm9uZXJyb3IgPSAoZXJyKSA9PiB7XG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29ubi5vbm9wZW4gPSAoZXZ0KSA9PiB7XG4gICAgICAgICAgaWYgKHRoaXMuYXV0b3JlY29ubmVjdCkge1xuICAgICAgICAgICAgdGhpcy4jYm9mZlN0b3AoKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodGhpcy5vbk9wZW4pIHtcbiAgICAgICAgICAgIHRoaXMub25PcGVuKCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbm4ub25jbG9zZSA9IChldnQpID0+IHtcbiAgICAgICAgICB0aGlzLiNzb2NrZXQgPSBudWxsO1xuXG4gICAgICAgICAgaWYgKHRoaXMub25EaXNjb25uZWN0KSB7XG4gICAgICAgICAgICBjb25zdCBjb2RlID0gdGhpcy4jYm9mZkNsb3NlZCA/IE5FVFdPUktfVVNFUiA6IE5FVFdPUktfRVJST1I7XG4gICAgICAgICAgICB0aGlzLm9uRGlzY29ubmVjdChuZXcgRXJyb3IodGhpcy4jYm9mZkNsb3NlZCA/IE5FVFdPUktfVVNFUl9URVhUIDogTkVUV09SS19FUlJPUl9URVhUICtcbiAgICAgICAgICAgICAgJyAoJyArIGNvZGUgKyAnKScpLCBjb2RlKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoIXRoaXMuI2JvZmZDbG9zZWQgJiYgdGhpcy5hdXRvcmVjb25uZWN0KSB7XG4gICAgICAgICAgICB0aGlzLiNib2ZmUmVjb25uZWN0KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbm4ub25tZXNzYWdlID0gKGV2dCkgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLm9uTWVzc2FnZSkge1xuICAgICAgICAgICAgdGhpcy5vbk1lc3NhZ2UoZXZ0LmRhdGEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLiNzb2NrZXQgPSBjb25uO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5yZWNvbm5lY3QgPSAoZm9yY2UpID0+IHtcbiAgICAgIHRoaXMuI2JvZmZTdG9wKCk7XG4gICAgICB0aGlzLmNvbm5lY3QobnVsbCwgZm9yY2UpO1xuICAgIH07XG5cbiAgICB0aGlzLmRpc2Nvbm5lY3QgPSAoKSA9PiB7XG4gICAgICB0aGlzLiNib2ZmQ2xvc2VkID0gdHJ1ZTtcbiAgICAgIHRoaXMuI2JvZmZTdG9wKCk7XG5cbiAgICAgIGlmICghdGhpcy4jc29ja2V0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHRoaXMuI3NvY2tldC5jbG9zZSgpO1xuICAgICAgdGhpcy4jc29ja2V0ID0gbnVsbDtcbiAgICB9O1xuXG4gICAgdGhpcy5zZW5kVGV4dCA9IChtc2cpID0+IHtcbiAgICAgIGlmICh0aGlzLiNzb2NrZXQgJiYgKHRoaXMuI3NvY2tldC5yZWFkeVN0YXRlID09IHRoaXMuI3NvY2tldC5PUEVOKSkge1xuICAgICAgICB0aGlzLiNzb2NrZXQuc2VuZChtc2cpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiV2Vic29ja2V0IGlzIG5vdCBjb25uZWN0ZWRcIik7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRoaXMuaXNDb25uZWN0ZWQgPSAoKSA9PiB7XG4gICAgICByZXR1cm4gKHRoaXMuI3NvY2tldCAmJiAodGhpcy4jc29ja2V0LnJlYWR5U3RhdGUgPT0gdGhpcy4jc29ja2V0Lk9QRU4pKTtcbiAgICB9O1xuICB9XG5cbiAgLy8gQ2FsbGJhY2tzOlxuXG4gIC8qKlxuICAgKiBBIGNhbGxiYWNrIHRvIHBhc3MgaW5jb21pbmcgbWVzc2FnZXMgdG8uIFNlZSB7QGxpbmsgVGlub2RlLkNvbm5lY3Rpb24jb25NZXNzYWdlfS5cbiAgICogQGNhbGxiYWNrIFRpbm9kZS5Db25uZWN0aW9uLk9uTWVzc2FnZVxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNvbm5lY3Rpb25cbiAgICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2UgLSBNZXNzYWdlIHRvIHByb2Nlc3MuXG4gICAqL1xuICBvbk1lc3NhZ2UgPSB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIEEgY2FsbGJhY2sgZm9yIHJlcG9ydGluZyBhIGRyb3BwZWQgY29ubmVjdGlvbi5cbiAgICogQHR5cGUge2Z1bmN0aW9ufVxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNvbm5lY3Rpb24jXG4gICAqL1xuICBvbkRpc2Nvbm5lY3QgPSB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIEEgY2FsbGJhY2sgY2FsbGVkIHdoZW4gdGhlIGNvbm5lY3Rpb24gaXMgcmVhZHkgdG8gYmUgdXNlZCBmb3Igc2VuZGluZy4gRm9yIHdlYnNvY2tldHMgaXQncyBzb2NrZXQgb3BlbixcbiAgICogZm9yIGxvbmcgcG9sbGluZyBpdCdzIDxjb2RlPnJlYWR5U3RhdGU9MTwvY29kZT4gKE9QRU5FRClcbiAgICogQHR5cGUge2Z1bmN0aW9ufVxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNvbm5lY3Rpb24jXG4gICAqL1xuICBvbk9wZW4gPSB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIEEgY2FsbGJhY2sgdG8gbm90aWZ5IG9mIHJlY29ubmVjdGlvbiBhdHRlbXB0cy4gU2VlIHtAbGluayBUaW5vZGUuQ29ubmVjdGlvbiNvbkF1dG9yZWNvbm5lY3RJdGVyYXRpb259LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNvbm5lY3Rpb25cbiAgICogQGNhbGxiYWNrIEF1dG9yZWNvbm5lY3RJdGVyYXRpb25UeXBlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0aW1lb3V0IC0gdGltZSB0aWxsIHRoZSBuZXh0IHJlY29ubmVjdCBhdHRlbXB0IGluIG1pbGxpc2Vjb25kcy4gPGNvZGU+LTE8L2NvZGU+IG1lYW5zIHJlY29ubmVjdCB3YXMgc2tpcHBlZC5cbiAgICogQHBhcmFtIHtQcm9taXNlfSBwcm9taXNlIHJlc29sdmVkIG9yIHJlamVjdGVkIHdoZW4gdGhlIHJlY29ubmVjdCBhdHRlbXAgY29tcGxldGVzLlxuICAgKlxuICAgKi9cbiAgLyoqXG4gICAqIEEgY2FsbGJhY2sgdG8gaW5mb3JtIHdoZW4gdGhlIG5leHQgYXR0YW1wdCB0byByZWNvbm5lY3Qgd2lsbCBoYXBwZW4gYW5kIHRvIHJlY2VpdmUgY29ubmVjdGlvbiBwcm9taXNlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNvbm5lY3Rpb24jXG4gICAqIEB0eXBlIHtUaW5vZGUuQ29ubmVjdGlvbi5BdXRvcmVjb25uZWN0SXRlcmF0aW9uVHlwZX1cbiAgICovXG4gIG9uQXV0b3JlY29ubmVjdEl0ZXJhdGlvbiA9IHVuZGVmaW5lZDtcbn1cblxuQ29ubmVjdGlvbi5ORVRXT1JLX0VSUk9SID0gTkVUV09SS19FUlJPUjtcbkNvbm5lY3Rpb24uTkVUV09SS19FUlJPUl9URVhUID0gTkVUV09SS19FUlJPUl9URVhUO1xuQ29ubmVjdGlvbi5ORVRXT1JLX1VTRVIgPSBORVRXT1JLX1VTRVI7XG5Db25uZWN0aW9uLk5FVFdPUktfVVNFUl9URVhUID0gTkVUV09SS19VU0VSX1RFWFQ7XG4iLCIvKipcbiAqIEBmaWxlIEhlbHBlciBtZXRob2RzIGZvciBkZWFsaW5nIHdpdGggSW5kZXhlZERCIGNhY2hlIG9mIG1lc3NhZ2VzLCB1c2VycywgYW5kIHRvcGljcy5cbiAqXG4gKiBAY29weXJpZ2h0IDIwMTUtMjAyMiBUaW5vZGUgTExDLlxuICovXG4ndXNlIHN0cmljdCc7XG5cbi8vIE5PVEUgVE8gREVWRUxPUEVSUzpcbi8vIExvY2FsaXphYmxlIHN0cmluZ3Mgc2hvdWxkIGJlIGRvdWJsZSBxdW90ZWQgXCLRgdGC0YDQvtC60LAg0L3QsCDQtNGA0YPQs9C+0Lwg0Y/Qt9GL0LrQtVwiLFxuLy8gbm9uLWxvY2FsaXphYmxlIHN0cmluZ3Mgc2hvdWxkIGJlIHNpbmdsZSBxdW90ZWQgJ25vbi1sb2NhbGl6ZWQnLlxuXG5jb25zdCBEQl9WRVJTSU9OID0gMTtcbmNvbnN0IERCX05BTUUgPSAndGlub2RlLXdlYic7XG5cbmxldCBJREJQcm92aWRlcjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgREIge1xuICAjb25FcnJvciA9IF8gPT4ge307XG4gICNsb2dnZXIgPSBfID0+IHt9O1xuXG4gIC8vIEluc3RhbmNlIG9mIEluZGV4REIuXG4gIGRiID0gbnVsbDtcbiAgLy8gSW5kaWNhdG9yIHRoYXQgdGhlIGNhY2hlIGlzIGRpc2FibGVkLlxuICBkaXNhYmxlZCA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKG9uRXJyb3IsIGxvZ2dlcikge1xuICAgIHRoaXMuI29uRXJyb3IgPSBvbkVycm9yIHx8IHRoaXMuI29uRXJyb3I7XG4gICAgdGhpcy4jbG9nZ2VyID0gbG9nZ2VyIHx8IHRoaXMuI2xvZ2dlcjtcbiAgfVxuXG4gICNtYXBPYmplY3RzKHNvdXJjZSwgY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICBpZiAoIXRoaXMuZGIpIHtcbiAgICAgIHJldHVybiBkaXNhYmxlZCA/XG4gICAgICAgIFByb21pc2UucmVzb2x2ZShbXSkgOlxuICAgICAgICBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJub3QgaW5pdGlhbGl6ZWRcIikpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCB0cnggPSB0aGlzLmRiLnRyYW5zYWN0aW9uKFtzb3VyY2VdKTtcbiAgICAgIHRyeC5vbmVycm9yID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuI2xvZ2dlcignUENhY2hlJywgJ21hcE9iamVjdHMnLCBzb3VyY2UsIGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICAgIHJlamVjdChldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgfTtcbiAgICAgIHRyeC5vYmplY3RTdG9yZShzb3VyY2UpLmdldEFsbCgpLm9uc3VjY2VzcyA9IChldmVudCkgPT4ge1xuICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICBldmVudC50YXJnZXQucmVzdWx0LmZvckVhY2goKHRvcGljKSA9PiB7XG4gICAgICAgICAgICBjYWxsYmFjay5jYWxsKGNvbnRleHQsIHRvcGljKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXNvbHZlKGV2ZW50LnRhcmdldC5yZXN1bHQpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIHBlcnNpc3RlbnQgY2FjaGU6IG9wZW4gb3IgY3JlYXRlL3VwZ3JhZGUgaWYgbmVlZGVkLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gcHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBEQiBpcyBpbml0aWFsaXplZC5cbiAgICovXG4gIGluaXREYXRhYmFzZSgpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgLy8gT3BlbiB0aGUgZGF0YWJhc2UgYW5kIGluaXRpYWxpemUgY2FsbGJhY2tzLlxuICAgICAgY29uc3QgcmVxID0gSURCUHJvdmlkZXIub3BlbihEQl9OQU1FLCBEQl9WRVJTSU9OKTtcbiAgICAgIHJlcS5vbnN1Y2Nlc3MgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy5kYiA9IGV2ZW50LnRhcmdldC5yZXN1bHQ7XG4gICAgICAgIHRoaXMuZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgcmVzb2x2ZSh0aGlzLmRiKTtcbiAgICAgIH07XG4gICAgICByZXEub25lcnJvciA9IChldmVudCkgPT4ge1xuICAgICAgICB0aGlzLiNsb2dnZXIoJ1BDYWNoZScsIFwiZmFpbGVkIHRvIGluaXRpYWxpemVcIiwgZXZlbnQpO1xuICAgICAgICByZWplY3QoZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgICAgdGhpcy4jb25FcnJvcihldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgfTtcbiAgICAgIHJlcS5vbnVwZ3JhZGVuZWVkZWQgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy5kYiA9IGV2ZW50LnRhcmdldC5yZXN1bHQ7XG5cbiAgICAgICAgdGhpcy5kYi5vbmVycm9yID0gKGV2ZW50KSA9PiB7XG4gICAgICAgICAgdGhpcy4jbG9nZ2VyKCdQQ2FjaGUnLCBcImZhaWxlZCB0byBjcmVhdGUgc3RvcmFnZVwiLCBldmVudCk7XG4gICAgICAgICAgdGhpcy4jb25FcnJvcihldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIEluZGl2aWR1YWwgb2JqZWN0IHN0b3Jlcy5cbiAgICAgICAgLy8gT2JqZWN0IHN0b3JlICh0YWJsZSkgZm9yIHRvcGljcy4gVGhlIHByaW1hcnkga2V5IGlzIHRvcGljIG5hbWUuXG4gICAgICAgIHRoaXMuZGIuY3JlYXRlT2JqZWN0U3RvcmUoJ3RvcGljJywge1xuICAgICAgICAgIGtleVBhdGg6ICduYW1lJ1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBVc2VycyBvYmplY3Qgc3RvcmUuIFVJRCBpcyB0aGUgcHJpbWFyeSBrZXkuXG4gICAgICAgIHRoaXMuZGIuY3JlYXRlT2JqZWN0U3RvcmUoJ3VzZXInLCB7XG4gICAgICAgICAga2V5UGF0aDogJ3VpZCdcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gU3Vic2NyaXB0aW9ucyBvYmplY3Qgc3RvcmUgdG9waWMgPC0+IHVzZXIuIFRvcGljIG5hbWUgKyBVSUQgaXMgdGhlIHByaW1hcnkga2V5LlxuICAgICAgICB0aGlzLmRiLmNyZWF0ZU9iamVjdFN0b3JlKCdzdWJzY3JpcHRpb24nLCB7XG4gICAgICAgICAga2V5UGF0aDogWyd0b3BpYycsICd1aWQnXVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBNZXNzYWdlcyBvYmplY3Qgc3RvcmUuIFRoZSBwcmltYXJ5IGtleSBpcyB0b3BpYyBuYW1lICsgc2VxLlxuICAgICAgICB0aGlzLmRiLmNyZWF0ZU9iamVjdFN0b3JlKCdtZXNzYWdlJywge1xuICAgICAgICAgIGtleVBhdGg6IFsndG9waWMnLCAnc2VxJ11cbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIERlbGV0ZSBwZXJzaXN0ZW50IGNhY2hlLlxuICAgKi9cbiAgZGVsZXRlRGF0YWJhc2UoKSB7XG4gICAgLy8gQ2xvc2UgY29ubmVjdGlvbiwgb3RoZXJ3aXNlIG9wZXJhdGlvbnMgd2lsbCBmYWlsIHdpdGggJ29uYmxvY2tlZCcuXG4gICAgaWYgKHRoaXMuZGIpIHtcbiAgICAgIHRoaXMuZGIuY2xvc2UoKTtcbiAgICAgIHRoaXMuZGIgPSBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgcmVxID0gSURCUHJvdmlkZXIuZGVsZXRlRGF0YWJhc2UoREJfTkFNRSk7XG4gICAgICByZXEub25ibG9ja2VkID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmRiKSB7XG4gICAgICAgICAgdGhpcy5kYi5jbG9zZSgpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGVyciA9IG5ldyBFcnJvcihcImJsb2NrZWRcIik7XG4gICAgICAgIHRoaXMuI2xvZ2dlcignUENhY2hlJywgJ2RlbGV0ZURhdGFiYXNlJywgZXJyKTtcbiAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICB9O1xuICAgICAgcmVxLm9uc3VjY2VzcyA9IChldmVudCkgPT4ge1xuICAgICAgICB0aGlzLmRiID0gbnVsbDtcbiAgICAgICAgdGhpcy5kaXNhYmxlZCA9IHRydWU7XG4gICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICB9O1xuICAgICAgcmVxLm9uZXJyb3IgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy4jbG9nZ2VyKCdQQ2FjaGUnLCAnZGVsZXRlRGF0YWJhc2UnLCBldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgICByZWplY3QoZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgcGVyc2lzdGVudCBjYWNoZSBpcyByZWFkeSBmb3IgdXNlLlxuICAgKiBAbWVtYmVyT2YgREJcbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIGNhY2hlIGlzIHJlYWR5LCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgaXNSZWFkeSgpIHtcbiAgICByZXR1cm4gISF0aGlzLmRiO1xuICB9XG5cbiAgLy8gVG9waWNzLlxuXG4gIC8qKlxuICAgKiBTYXZlIHRvIGNhY2hlIG9yIHVwZGF0ZSB0b3BpYyBpbiBwZXJzaXN0ZW50IGNhY2hlLlxuICAgKiBAbWVtYmVyT2YgREJcbiAgICogQHBhcmFtIHtUb3BpY30gdG9waWMgLSB0b3BpYyB0byBiZSBhZGRlZCBvciB1cGRhdGVkLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gcHJvbWlzZSByZXNvbHZlZC9yZWplY3RlZCBvbiBvcGVyYXRpb24gY29tcGxldGlvbi5cbiAgICovXG4gIHVwZFRvcGljKHRvcGljKSB7XG4gICAgaWYgKCF0aGlzLmlzUmVhZHkoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZGlzYWJsZWQgP1xuICAgICAgICBQcm9taXNlLnJlc29sdmUoKSA6XG4gICAgICAgIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIm5vdCBpbml0aWFsaXplZFwiKSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCB0cnggPSB0aGlzLmRiLnRyYW5zYWN0aW9uKFsndG9waWMnXSwgJ3JlYWR3cml0ZScpO1xuICAgICAgdHJ4Lm9uY29tcGxldGUgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgcmVzb2x2ZShldmVudC50YXJnZXQucmVzdWx0KTtcbiAgICAgIH07XG4gICAgICB0cngub25lcnJvciA9IChldmVudCkgPT4ge1xuICAgICAgICB0aGlzLiNsb2dnZXIoJ1BDYWNoZScsICd1cGRUb3BpYycsIGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICAgIHJlamVjdChldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgfTtcbiAgICAgIGNvbnN0IHJlcSA9IHRyeC5vYmplY3RTdG9yZSgndG9waWMnKS5nZXQodG9waWMubmFtZSk7XG4gICAgICByZXEub25zdWNjZXNzID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHRyeC5vYmplY3RTdG9yZSgndG9waWMnKS5wdXQoREIuI3NlcmlhbGl6ZVRvcGljKHJlcS5yZXN1bHQsIHRvcGljKSk7XG4gICAgICAgIHRyeC5jb21taXQoKTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogTWFyayBvciB1bm1hcmsgdG9waWMgYXMgZGVsZXRlZC5cbiAgICogQG1lbWJlck9mIERCXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gbmFtZSBvZiB0aGUgdG9waWMgdG8gbWFyayBvciB1bm1hcmsuXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IHByb21pc2UgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gb3BlcmF0aW9uIGNvbXBsZXRpb24uXG4gICAqL1xuICBtYXJrVG9waWNBc0RlbGV0ZWQobmFtZSkge1xuICAgIGlmICghdGhpcy5pc1JlYWR5KCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmRpc2FibGVkID9cbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkgOlxuICAgICAgICBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJub3QgaW5pdGlhbGl6ZWRcIikpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgdHJ4ID0gdGhpcy5kYi50cmFuc2FjdGlvbihbJ3RvcGljJ10sICdyZWFkd3JpdGUnKTtcbiAgICAgIHRyeC5vbmNvbXBsZXRlID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHJlc29sdmUoZXZlbnQudGFyZ2V0LnJlc3VsdCk7XG4gICAgICB9O1xuICAgICAgdHJ4Lm9uZXJyb3IgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy4jbG9nZ2VyKCdQQ2FjaGUnLCAnbWFya1RvcGljQXNEZWxldGVkJywgZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgICAgcmVqZWN0KGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICB9O1xuICAgICAgY29uc3QgcmVxID0gdHJ4Lm9iamVjdFN0b3JlKCd0b3BpYycpLmdldChuYW1lKTtcbiAgICAgIHJlcS5vbnN1Y2Nlc3MgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgY29uc3QgdG9waWMgPSBldmVudC50YXJnZXQucmVzdWx0O1xuICAgICAgICB0b3BpYy5fZGVsZXRlZCA9IHRydWU7XG4gICAgICAgIHRyeC5vYmplY3RTdG9yZSgndG9waWMnKS5wdXQodG9waWMpO1xuICAgICAgICB0cnguY29tbWl0KCk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSB0b3BpYyBmcm9tIHBlcnNpc3RlbnQgY2FjaGUuXG4gICAqIEBtZW1iZXJPZiBEQlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIG5hbWUgb2YgdGhlIHRvcGljIHRvIHJlbW92ZSBmcm9tIGRhdGFiYXNlLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBwcm9taXNlIHJlc29sdmVkL3JlamVjdGVkIG9uIG9wZXJhdGlvbiBjb21wbGV0aW9uLlxuICAgKi9cbiAgcmVtVG9waWMobmFtZSkge1xuICAgIGlmICghdGhpcy5pc1JlYWR5KCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmRpc2FibGVkID9cbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkgOlxuICAgICAgICBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJub3QgaW5pdGlhbGl6ZWRcIikpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgdHJ4ID0gdGhpcy5kYi50cmFuc2FjdGlvbihbJ3RvcGljJywgJ3N1YnNjcmlwdGlvbicsICdtZXNzYWdlJ10sICdyZWFkd3JpdGUnKTtcbiAgICAgIHRyeC5vbmNvbXBsZXRlID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHJlc29sdmUoZXZlbnQudGFyZ2V0LnJlc3VsdCk7XG4gICAgICB9O1xuICAgICAgdHJ4Lm9uZXJyb3IgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy4jbG9nZ2VyKCdQQ2FjaGUnLCAncmVtVG9waWMnLCBldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgICByZWplY3QoZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgIH07XG4gICAgICB0cngub2JqZWN0U3RvcmUoJ3RvcGljJykuZGVsZXRlKElEQktleVJhbmdlLm9ubHkobmFtZSkpO1xuICAgICAgdHJ4Lm9iamVjdFN0b3JlKCdzdWJzY3JpcHRpb24nKS5kZWxldGUoSURCS2V5UmFuZ2UuYm91bmQoW25hbWUsICctJ10sIFtuYW1lLCAnfiddKSk7XG4gICAgICB0cngub2JqZWN0U3RvcmUoJ21lc3NhZ2UnKS5kZWxldGUoSURCS2V5UmFuZ2UuYm91bmQoW25hbWUsIDBdLCBbbmFtZSwgTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVJdKSk7XG4gICAgICB0cnguY29tbWl0KCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogRXhlY3V0ZSBhIGNhbGxiYWNrIGZvciBlYWNoIHN0b3JlZCB0b3BpYy5cbiAgICogQG1lbWJlck9mIERCXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIC0gZnVuY3Rpb24gdG8gY2FsbCBmb3IgZWFjaCB0b3BpYy5cbiAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHQgLSB0aGUgdmFsdWUgb3IgPGNvZGU+dGhpczwvY29kZT4gaW5zaWRlIHRoZSBjYWxsYmFjay5cbiAgICogQHJldHVybiB7UHJvbWlzZX0gcHJvbWlzZSByZXNvbHZlZC9yZWplY3RlZCBvbiBvcGVyYXRpb24gY29tcGxldGlvbi5cbiAgICovXG4gIG1hcFRvcGljcyhjYWxsYmFjaywgY29udGV4dCkge1xuICAgIHJldHVybiB0aGlzLiNtYXBPYmplY3RzKCd0b3BpYycsIGNhbGxiYWNrLCBjb250ZXh0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb3B5IGRhdGEgZnJvbSBzZXJpYWxpemVkIG9iamVjdCB0byB0b3BpYy5cbiAgICogQG1lbWJlck9mIERCXG4gICAqIEBwYXJhbSB7VG9waWN9IHRvcGljIC0gdGFyZ2V0IHRvIGRlc2VyaWFsaXplIHRvLlxuICAgKiBAcGFyYW0ge09iamVjdH0gc3JjIC0gc2VyaWFsaXplZCBkYXRhIHRvIGNvcHkgZnJvbS5cbiAgICovXG4gIGRlc2VyaWFsaXplVG9waWModG9waWMsIHNyYykge1xuICAgIERCLiNkZXNlcmlhbGl6ZVRvcGljKHRvcGljLCBzcmMpO1xuICB9XG5cbiAgLy8gVXNlcnMuXG4gIC8qKlxuICAgKiBBZGQgb3IgdXBkYXRlIHVzZXIgb2JqZWN0IGluIHRoZSBwZXJzaXN0ZW50IGNhY2hlLlxuICAgKiBAbWVtYmVyT2YgREJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVpZCAtIElEIG9mIHRoZSB1c2VyIHRvIHNhdmUgb3IgdXBkYXRlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gcHViIC0gdXNlcidzIDxjb2RlPnB1YmxpYzwvY29kZT4gaW5mb3JtYXRpb24uXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBwcm9taXNlIHJlc29sdmVkL3JlamVjdGVkIG9uIG9wZXJhdGlvbiBjb21wbGV0aW9uLlxuICAgKi9cbiAgdXBkVXNlcih1aWQsIHB1Yikge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMiB8fCBwdWIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gTm8gcG9pbnQgaW51cGRhdGluZyB1c2VyIHdpdGggaW52YWxpZCBkYXRhLlxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuaXNSZWFkeSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5kaXNhYmxlZCA/XG4gICAgICAgIFByb21pc2UucmVzb2x2ZSgpIDpcbiAgICAgICAgUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwibm90IGluaXRpYWxpemVkXCIpKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IHRyeCA9IHRoaXMuZGIudHJhbnNhY3Rpb24oWyd1c2VyJ10sICdyZWFkd3JpdGUnKTtcbiAgICAgIHRyeC5vbmNvbXBsZXRlID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHJlc29sdmUoZXZlbnQudGFyZ2V0LnJlc3VsdCk7XG4gICAgICB9O1xuICAgICAgdHJ4Lm9uZXJyb3IgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy4jbG9nZ2VyKCdQQ2FjaGUnLCAndXBkVXNlcicsIGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICAgIHJlamVjdChldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgfTtcbiAgICAgIHRyeC5vYmplY3RTdG9yZSgndXNlcicpLnB1dCh7XG4gICAgICAgIHVpZDogdWlkLFxuICAgICAgICBwdWJsaWM6IHB1YlxuICAgICAgfSk7XG4gICAgICB0cnguY29tbWl0KCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIHVzZXIgZnJvbSBwZXJzaXN0ZW50IGNhY2hlLlxuICAgKiBAbWVtYmVyT2YgREJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVpZCAtIElEIG9mIHRoZSB1c2VyIHRvIHJlbW92ZSBmcm9tIHRoZSBjYWNoZS5cbiAgICogQHJldHVybiB7UHJvbWlzZX0gcHJvbWlzZSByZXNvbHZlZC9yZWplY3RlZCBvbiBvcGVyYXRpb24gY29tcGxldGlvbi5cbiAgICovXG4gIHJlbVVzZXIodWlkKSB7XG4gICAgaWYgKCF0aGlzLmlzUmVhZHkoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZGlzYWJsZWQgP1xuICAgICAgICBQcm9taXNlLnJlc29sdmUoKSA6XG4gICAgICAgIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIm5vdCBpbml0aWFsaXplZFwiKSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCB0cnggPSB0aGlzLmRiLnRyYW5zYWN0aW9uKFsndXNlciddLCAncmVhZHdyaXRlJyk7XG4gICAgICB0cngub25jb21wbGV0ZSA9IChldmVudCkgPT4ge1xuICAgICAgICByZXNvbHZlKGV2ZW50LnRhcmdldC5yZXN1bHQpO1xuICAgICAgfTtcbiAgICAgIHRyeC5vbmVycm9yID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuI2xvZ2dlcignUENhY2hlJywgJ3JlbVVzZXInLCBldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgICByZWplY3QoZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgIH07XG4gICAgICB0cngub2JqZWN0U3RvcmUoJ3VzZXInKS5kZWxldGUoSURCS2V5UmFuZ2Uub25seSh1aWQpKTtcbiAgICAgIHRyeC5jb21taXQoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeGVjdXRlIGEgY2FsbGJhY2sgZm9yIGVhY2ggc3RvcmVkIHVzZXIuXG4gICAqIEBtZW1iZXJPZiBEQlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayAtIGZ1bmN0aW9uIHRvIGNhbGwgZm9yIGVhY2ggdG9waWMuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZXh0IC0gdGhlIHZhbHVlIG9yIDxjb2RlPnRoaXM8L2NvZGU+IGluc2lkZSB0aGUgY2FsbGJhY2suXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IHByb21pc2UgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gb3BlcmF0aW9uIGNvbXBsZXRpb24uXG4gICAqL1xuICBtYXBVc2VycyhjYWxsYmFjaywgY29udGV4dCkge1xuICAgIHJldHVybiB0aGlzLiNtYXBPYmplY3RzKCd1c2VyJywgY2FsbGJhY2ssIGNvbnRleHQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlYWQgYSBzaW5nbGUgdXNlciBmcm9tIHBlcnNpc3RlbnQgY2FjaGUuXG4gICAqIEBtZW1iZXJPZiBEQlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdWlkIC0gSUQgb2YgdGhlIHVzZXIgdG8gZmV0Y2ggZnJvbSBjYWNoZS5cbiAgICogQHJldHVybiB7UHJvbWlzZX0gcHJvbWlzZSByZXNvbHZlZC9yZWplY3RlZCBvbiBvcGVyYXRpb24gY29tcGxldGlvbi5cbiAgICovXG4gIGdldFVzZXIodWlkKSB7XG4gICAgaWYgKCF0aGlzLmlzUmVhZHkoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZGlzYWJsZWQgP1xuICAgICAgICBQcm9taXNlLnJlc29sdmUoKSA6XG4gICAgICAgIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIm5vdCBpbml0aWFsaXplZFwiKSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCB0cnggPSB0aGlzLmRiLnRyYW5zYWN0aW9uKFsndXNlciddKTtcbiAgICAgIHRyeC5vbmNvbXBsZXRlID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIGNvbnN0IHVzZXIgPSBldmVudC50YXJnZXQucmVzdWx0O1xuICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICB1c2VyOiB1c2VyLnVpZCxcbiAgICAgICAgICBwdWJsaWM6IHVzZXIucHVibGljXG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIHRyeC5vbmVycm9yID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuI2xvZ2dlcignUENhY2hlJywgJ2dldFVzZXInLCBldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgICByZWplY3QoZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgIH07XG4gICAgICB0cngub2JqZWN0U3RvcmUoJ3VzZXInKS5nZXQodWlkKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIFN1YnNjcmlwdGlvbnMuXG4gIC8qKlxuICAgKiBBZGQgb3IgdXBkYXRlIHN1YnNjcmlwdGlvbiBpbiBwZXJzaXN0ZW50IGNhY2hlLlxuICAgKiBAbWVtYmVyT2YgREJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljTmFtZSAtIG5hbWUgb2YgdGhlIHRvcGljIHdoaWNoIG93bnMgdGhlIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1aWQgLSBJRCBvZiB0aGUgc3Vic2NyaWJlZCB1c2VyLlxuICAgKiBAcGFyYW0ge09iamVjdH0gc3ViIC0gc3Vic2NyaXB0aW9uIHRvIHNhdmUuXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IHByb21pc2UgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gb3BlcmF0aW9uIGNvbXBsZXRpb24uXG4gICAqL1xuICB1cGRTdWJzY3JpcHRpb24odG9waWNOYW1lLCB1aWQsIHN1Yikge1xuICAgIGlmICghdGhpcy5pc1JlYWR5KCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmRpc2FibGVkID9cbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkgOlxuICAgICAgICBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJub3QgaW5pdGlhbGl6ZWRcIikpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgdHJ4ID0gdGhpcy5kYi50cmFuc2FjdGlvbihbJ3N1YnNjcmlwdGlvbiddLCAncmVhZHdyaXRlJyk7XG4gICAgICB0cngub25jb21wbGV0ZSA9IChldmVudCkgPT4ge1xuICAgICAgICByZXNvbHZlKGV2ZW50LnRhcmdldC5yZXN1bHQpO1xuICAgICAgfTtcbiAgICAgIHRyeC5vbmVycm9yID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuI2xvZ2dlcignUENhY2hlJywgJ3VwZFN1YnNjcmlwdGlvbicsIGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICAgIHJlamVjdChldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgfTtcbiAgICAgIHRyeC5vYmplY3RTdG9yZSgnc3Vic2NyaXB0aW9uJykuZ2V0KFt0b3BpY05hbWUsIHVpZF0pLm9uc3VjY2VzcyA9IChldmVudCkgPT4ge1xuICAgICAgICB0cngub2JqZWN0U3RvcmUoJ3N1YnNjcmlwdGlvbicpLnB1dChEQi4jc2VyaWFsaXplU3Vic2NyaXB0aW9uKGV2ZW50LnRhcmdldC5yZXN1bHQsIHRvcGljTmFtZSwgdWlkLCBzdWIpKTtcbiAgICAgICAgdHJ4LmNvbW1pdCgpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeGVjdXRlIGEgY2FsbGJhY2sgZm9yIGVhY2ggY2FjaGVkIHN1YnNjcmlwdGlvbiBpbiBhIGdpdmVuIHRvcGljLlxuICAgKiBAbWVtYmVyT2YgREJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljTmFtZSAtIG5hbWUgb2YgdGhlIHRvcGljIHdoaWNoIG93bnMgdGhlIHN1YnNjcmlwdGlvbnMuXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIC0gZnVuY3Rpb24gdG8gY2FsbCBmb3IgZWFjaCBzdWJzY3JpcHRpb24uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZXh0IC0gdGhlIHZhbHVlIG9yIDxjb2RlPnRoaXM8L2NvZGU+IGluc2lkZSB0aGUgY2FsbGJhY2suXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IHByb21pc2UgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gb3BlcmF0aW9uIGNvbXBsZXRpb24uXG4gICAqL1xuICBtYXBTdWJzY3JpcHRpb25zKHRvcGljTmFtZSwgY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICBpZiAoIXRoaXMuaXNSZWFkeSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5kaXNhYmxlZCA/XG4gICAgICAgIFByb21pc2UucmVzb2x2ZShbXSkgOlxuICAgICAgICBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJub3QgaW5pdGlhbGl6ZWRcIikpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgdHJ4ID0gdGhpcy5kYi50cmFuc2FjdGlvbihbJ3N1YnNjcmlwdGlvbiddKTtcbiAgICAgIHRyeC5vbmVycm9yID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuI2xvZ2dlcignUENhY2hlJywgJ21hcFN1YnNjcmlwdGlvbnMnLCBldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgICByZWplY3QoZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgIH07XG4gICAgICB0cngub2JqZWN0U3RvcmUoJ3N1YnNjcmlwdGlvbicpLmdldEFsbChJREJLZXlSYW5nZS5ib3VuZChbdG9waWNOYW1lLCAnLSddLCBbdG9waWNOYW1lLCAnfiddKSkub25zdWNjZXNzID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgIGV2ZW50LnRhcmdldC5yZXN1bHQuZm9yRWFjaCgodG9waWMpID0+IHtcbiAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwoY29udGV4dCwgdG9waWMpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJlc29sdmUoZXZlbnQudGFyZ2V0LnJlc3VsdCk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgLy8gTWVzc2FnZXMuXG5cbiAgLyoqXG4gICAqIFNhdmUgbWVzc2FnZSB0byBwZXJzaXN0ZW50IGNhY2hlLlxuICAgKiBAbWVtYmVyT2YgREJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljTmFtZSAtIG5hbWUgb2YgdGhlIHRvcGljIHdoaWNoIG93bnMgdGhlIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBtc2cgLSBtZXNzYWdlIHRvIHNhdmUuXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IHByb21pc2UgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gb3BlcmF0aW9uIGNvbXBsZXRpb24uXG4gICAqL1xuICBhZGRNZXNzYWdlKG1zZykge1xuICAgIGlmICghdGhpcy5pc1JlYWR5KCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmRpc2FibGVkID9cbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkgOlxuICAgICAgICBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJub3QgaW5pdGlhbGl6ZWRcIikpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgdHJ4ID0gdGhpcy5kYi50cmFuc2FjdGlvbihbJ21lc3NhZ2UnXSwgJ3JlYWR3cml0ZScpO1xuICAgICAgdHJ4Lm9uc3VjY2VzcyA9IChldmVudCkgPT4ge1xuICAgICAgICByZXNvbHZlKGV2ZW50LnRhcmdldC5yZXN1bHQpO1xuICAgICAgfTtcbiAgICAgIHRyeC5vbmVycm9yID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuI2xvZ2dlcignUENhY2hlJywgJ2FkZE1lc3NhZ2UnLCBldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgICByZWplY3QoZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgIH07XG4gICAgICB0cngub2JqZWN0U3RvcmUoJ21lc3NhZ2UnKS5hZGQoREIuI3NlcmlhbGl6ZU1lc3NhZ2UobnVsbCwgbXNnKSk7XG4gICAgICB0cnguY29tbWl0KCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlIGRlbGl2ZXJ5IHN0YXR1cyBvZiBhIG1lc3NhZ2Ugc3RvcmVkIGluIHBlcnNpc3RlbnQgY2FjaGUuXG4gICAqIEBtZW1iZXJPZiBEQlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWNOYW1lIC0gbmFtZSBvZiB0aGUgdG9waWMgd2hpY2ggb3ducyB0aGUgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtudW1iZXJ9IHNlcSAtIElEIG9mIHRoZSBtZXNzYWdlIHRvIHVwZGF0ZVxuICAgKiBAcGFyYW0ge251bWJlcn0gc3RhdHVzIC0gbmV3IGRlbGl2ZXJ5IHN0YXR1cyBvZiB0aGUgbWVzc2FnZS5cbiAgICogQHJldHVybiB7UHJvbWlzZX0gcHJvbWlzZSByZXNvbHZlZC9yZWplY3RlZCBvbiBvcGVyYXRpb24gY29tcGxldGlvbi5cbiAgICovXG4gIHVwZE1lc3NhZ2VTdGF0dXModG9waWNOYW1lLCBzZXEsIHN0YXR1cykge1xuICAgIGlmICghdGhpcy5pc1JlYWR5KCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmRpc2FibGVkID9cbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkgOlxuICAgICAgICBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJub3QgaW5pdGlhbGl6ZWRcIikpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgdHJ4ID0gdGhpcy5kYi50cmFuc2FjdGlvbihbJ21lc3NhZ2UnXSwgJ3JlYWR3cml0ZScpO1xuICAgICAgdHJ4Lm9uc3VjY2VzcyA9IChldmVudCkgPT4ge1xuICAgICAgICByZXNvbHZlKGV2ZW50LnRhcmdldC5yZXN1bHQpO1xuICAgICAgfTtcbiAgICAgIHRyeC5vbmVycm9yID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuI2xvZ2dlcignUENhY2hlJywgJ3VwZE1lc3NhZ2VTdGF0dXMnLCBldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgICByZWplY3QoZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgIH07XG4gICAgICBjb25zdCByZXEgPSB0cngub2JqZWN0U3RvcmUoJ21lc3NhZ2UnKS5nZXQoSURCS2V5UmFuZ2Uub25seShbdG9waWNOYW1lLCBzZXFdKSk7XG4gICAgICByZXEub25zdWNjZXNzID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIGNvbnN0IHNyYyA9IHJlcS5yZXN1bHQgfHwgZXZlbnQudGFyZ2V0LnJlc3VsdDtcbiAgICAgICAgaWYgKCFzcmMgfHwgc3JjLl9zdGF0dXMgPT0gc3RhdHVzKSB7XG4gICAgICAgICAgdHJ4LmNvbW1pdCgpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0cngub2JqZWN0U3RvcmUoJ21lc3NhZ2UnKS5wdXQoREIuI3NlcmlhbGl6ZU1lc3NhZ2Uoc3JjLCB7XG4gICAgICAgICAgdG9waWM6IHRvcGljTmFtZSxcbiAgICAgICAgICBzZXE6IHNlcSxcbiAgICAgICAgICBfc3RhdHVzOiBzdGF0dXNcbiAgICAgICAgfSkpO1xuICAgICAgICB0cnguY29tbWl0KCk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBvbmUgb3IgbW9yZSBtZXNzYWdlcyBmcm9tIHBlcnNpc3RlbnQgY2FjaGUuXG4gICAqIEBtZW1iZXJPZiBEQlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWNOYW1lIC0gbmFtZSBvZiB0aGUgdG9waWMgd2hpY2ggb3ducyB0aGUgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtudW1iZXJ9IGZyb20gLSBpZCBvZiB0aGUgbWVzc2FnZSB0byByZW1vdmUgb3IgbG93ZXIgYm91bmRhcnkgd2hlbiByZW1vdmluZyByYW5nZSAoaW5jbHVzaXZlKS5cbiAgICogQHBhcmFtIHtudW1iZXI9fSB0byAtIHVwcGVyIGJvdW5kYXJ5IChleGNsdXNpdmUpIHdoZW4gcmVtb3ZpbmcgYSByYW5nZSBvZiBtZXNzYWdlcy5cbiAgICogQHJldHVybiB7UHJvbWlzZX0gcHJvbWlzZSByZXNvbHZlZC9yZWplY3RlZCBvbiBvcGVyYXRpb24gY29tcGxldGlvbi5cbiAgICovXG4gIHJlbU1lc3NhZ2VzKHRvcGljTmFtZSwgZnJvbSwgdG8pIHtcbiAgICBpZiAoIXRoaXMuaXNSZWFkeSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5kaXNhYmxlZCA/XG4gICAgICAgIFByb21pc2UucmVzb2x2ZSgpIDpcbiAgICAgICAgUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwibm90IGluaXRpYWxpemVkXCIpKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGlmICghZnJvbSAmJiAhdG8pIHtcbiAgICAgICAgZnJvbSA9IDA7XG4gICAgICAgIHRvID0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XG4gICAgICB9XG4gICAgICBjb25zdCByYW5nZSA9IHRvID4gMCA/IElEQktleVJhbmdlLmJvdW5kKFt0b3BpY05hbWUsIGZyb21dLCBbdG9waWNOYW1lLCB0b10sIGZhbHNlLCB0cnVlKSA6XG4gICAgICAgIElEQktleVJhbmdlLm9ubHkoW3RvcGljTmFtZSwgZnJvbV0pO1xuICAgICAgY29uc3QgdHJ4ID0gdGhpcy5kYi50cmFuc2FjdGlvbihbJ21lc3NhZ2UnXSwgJ3JlYWR3cml0ZScpO1xuICAgICAgdHJ4Lm9uc3VjY2VzcyA9IChldmVudCkgPT4ge1xuICAgICAgICByZXNvbHZlKGV2ZW50LnRhcmdldC5yZXN1bHQpO1xuICAgICAgfTtcbiAgICAgIHRyeC5vbmVycm9yID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuI2xvZ2dlcignUENhY2hlJywgJ3JlbU1lc3NhZ2VzJywgZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgICAgcmVqZWN0KGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICB9O1xuICAgICAgdHJ4Lm9iamVjdFN0b3JlKCdtZXNzYWdlJykuZGVsZXRlKHJhbmdlKTtcbiAgICAgIHRyeC5jb21taXQoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSBtZXNzYWdlcyBmcm9tIHBlcnNpc3RlbnQgc3RvcmUuXG4gICAqIEBtZW1iZXJPZiBEQlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWNOYW1lIC0gbmFtZSBvZiB0aGUgdG9waWMgdG8gcmV0cmlldmUgbWVzc2FnZXMgZnJvbS5cbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgdG8gY2FsbCBmb3IgZWFjaCByZXRyaWV2ZWQgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IHF1ZXJ5IC0gcGFyYW1ldGVycyBvZiB0aGUgbWVzc2FnZSByYW5nZSB0byByZXRyaWV2ZS5cbiAgICogQHBhcmFtIHtudW1iZXI9fSBxdWVyeS5zaW5jZSAtIHRoZSBsZWFzdCBtZXNzYWdlIElEIHRvIHJldHJpZXZlIChpbmNsdXNpdmUpLlxuICAgKiBAcGFyYW0ge251bWJlcj19IHF1ZXJ5LmJlZm9yZSAtIHRoZSBncmVhdGVzdCBtZXNzYWdlIElEIHRvIHJldHJpZXZlIChleGNsdXNpdmUpLlxuICAgKiBAcGFyYW0ge251bWJlcj19IHF1ZXJ5LmxpbWl0IC0gdGhlIG1heGltdW0gbnVtYmVyIG9mIG1lc3NhZ2VzIHRvIHJldHJpZXZlLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBwcm9taXNlIHJlc29sdmVkL3JlamVjdGVkIG9uIG9wZXJhdGlvbiBjb21wbGV0aW9uLlxuICAgKi9cbiAgcmVhZE1lc3NhZ2VzKHRvcGljTmFtZSwgcXVlcnksIGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgaWYgKCF0aGlzLmlzUmVhZHkoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZGlzYWJsZWQgP1xuICAgICAgICBQcm9taXNlLnJlc29sdmUoW10pIDpcbiAgICAgICAgUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwibm90IGluaXRpYWxpemVkXCIpKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHF1ZXJ5ID0gcXVlcnkgfHwge307XG4gICAgICBjb25zdCBzaW5jZSA9IHF1ZXJ5LnNpbmNlID4gMCA/IHF1ZXJ5LnNpbmNlIDogMDtcbiAgICAgIGNvbnN0IGJlZm9yZSA9IHF1ZXJ5LmJlZm9yZSA+IDAgPyBxdWVyeS5iZWZvcmUgOiBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcbiAgICAgIGNvbnN0IGxpbWl0ID0gcXVlcnkubGltaXQgfCAwO1xuXG4gICAgICBjb25zdCByZXN1bHQgPSBbXTtcbiAgICAgIGNvbnN0IHJhbmdlID0gSURCS2V5UmFuZ2UuYm91bmQoW3RvcGljTmFtZSwgc2luY2VdLCBbdG9waWNOYW1lLCBiZWZvcmVdLCBmYWxzZSwgdHJ1ZSk7XG4gICAgICBjb25zdCB0cnggPSB0aGlzLmRiLnRyYW5zYWN0aW9uKFsnbWVzc2FnZSddKTtcbiAgICAgIHRyeC5vbmVycm9yID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuI2xvZ2dlcignUENhY2hlJywgJ3JlYWRNZXNzYWdlcycsIGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICAgIHJlamVjdChldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgfTtcbiAgICAgIC8vIEl0ZXJhdGUgaW4gZGVzY2VuZGluZyBvcmRlci5cbiAgICAgIHRyeC5vYmplY3RTdG9yZSgnbWVzc2FnZScpLm9wZW5DdXJzb3IocmFuZ2UsICdwcmV2Jykub25zdWNjZXNzID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIGNvbnN0IGN1cnNvciA9IGV2ZW50LnRhcmdldC5yZXN1bHQ7XG4gICAgICAgIGlmIChjdXJzb3IpIHtcbiAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwoY29udGV4dCwgY3Vyc29yLnZhbHVlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVzdWx0LnB1c2goY3Vyc29yLnZhbHVlKTtcbiAgICAgICAgICBpZiAobGltaXQgPD0gMCB8fCByZXN1bHQubGVuZ3RoIDwgbGltaXQpIHtcbiAgICAgICAgICAgIGN1cnNvci5jb250aW51ZSgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIFByaXZhdGUgbWV0aG9kcy5cblxuICAvLyBTZXJpYWxpemFibGUgdG9waWMgZmllbGRzLlxuICBzdGF0aWMgI3RvcGljX2ZpZWxkcyA9IFsnY3JlYXRlZCcsICd1cGRhdGVkJywgJ2RlbGV0ZWQnLCAncmVhZCcsICdyZWN2JywgJ3NlcScsICdjbGVhcicsICdkZWZhY3MnLFxuICAgICdjcmVkcycsICdwdWJsaWMnLCAndHJ1c3RlZCcsICdwcml2YXRlJywgJ3RvdWNoZWQnLCAnX2RlbGV0ZWQnXG4gIF07XG5cbiAgLy8gQ29weSBkYXRhIGZyb20gc3JjIHRvIFRvcGljIG9iamVjdC5cbiAgc3RhdGljICNkZXNlcmlhbGl6ZVRvcGljKHRvcGljLCBzcmMpIHtcbiAgICBEQi4jdG9waWNfZmllbGRzLmZvckVhY2goKGYpID0+IHtcbiAgICAgIGlmIChzcmMuaGFzT3duUHJvcGVydHkoZikpIHtcbiAgICAgICAgdG9waWNbZl0gPSBzcmNbZl07XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoc3JjLnRhZ3MpKSB7XG4gICAgICB0b3BpYy5fdGFncyA9IHNyYy50YWdzO1xuICAgIH1cbiAgICBpZiAoc3JjLmFjcykge1xuICAgICAgdG9waWMuc2V0QWNjZXNzTW9kZShzcmMuYWNzKTtcbiAgICB9XG4gICAgdG9waWMuc2VxIHw9IDA7XG4gICAgdG9waWMucmVhZCB8PSAwO1xuICAgIHRvcGljLnVucmVhZCA9IE1hdGgubWF4KDAsIHRvcGljLnNlcSAtIHRvcGljLnJlYWQpO1xuICB9XG5cbiAgLy8gQ29weSB2YWx1ZXMgZnJvbSAnc3JjJyB0byAnZHN0Jy4gQWxsb2NhdGUgZHN0IGlmIGl0J3MgbnVsbCBvciB1bmRlZmluZWQuXG4gIHN0YXRpYyAjc2VyaWFsaXplVG9waWMoZHN0LCBzcmMpIHtcbiAgICBjb25zdCByZXMgPSBkc3QgfHwge1xuICAgICAgbmFtZTogc3JjLm5hbWVcbiAgICB9O1xuICAgIERCLiN0b3BpY19maWVsZHMuZm9yRWFjaCgoZikgPT4ge1xuICAgICAgaWYgKHNyYy5oYXNPd25Qcm9wZXJ0eShmKSkge1xuICAgICAgICByZXNbZl0gPSBzcmNbZl07XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoc3JjLl90YWdzKSkge1xuICAgICAgcmVzLnRhZ3MgPSBzcmMuX3RhZ3M7XG4gICAgfVxuICAgIGlmIChzcmMuYWNzKSB7XG4gICAgICByZXMuYWNzID0gc3JjLmdldEFjY2Vzc01vZGUoKS5qc29uSGVscGVyKCk7XG4gICAgfVxuICAgIHJldHVybiByZXM7XG4gIH1cblxuICBzdGF0aWMgI3NlcmlhbGl6ZVN1YnNjcmlwdGlvbihkc3QsIHRvcGljTmFtZSwgdWlkLCBzdWIpIHtcbiAgICBjb25zdCBmaWVsZHMgPSBbJ3VwZGF0ZWQnLCAnbW9kZScsICdyZWFkJywgJ3JlY3YnLCAnY2xlYXInLCAnbGFzdFNlZW4nLCAndXNlckFnZW50J107XG4gICAgY29uc3QgcmVzID0gZHN0IHx8IHtcbiAgICAgIHRvcGljOiB0b3BpY05hbWUsXG4gICAgICB1aWQ6IHVpZFxuICAgIH07XG5cbiAgICBmaWVsZHMuZm9yRWFjaCgoZikgPT4ge1xuICAgICAgaWYgKHN1Yi5oYXNPd25Qcm9wZXJ0eShmKSkge1xuICAgICAgICByZXNbZl0gPSBzdWJbZl07XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVzO1xuICB9XG5cbiAgc3RhdGljICNzZXJpYWxpemVNZXNzYWdlKGRzdCwgbXNnKSB7XG4gICAgLy8gU2VyaWFsaXphYmxlIGZpZWxkcy5cbiAgICBjb25zdCBmaWVsZHMgPSBbJ3RvcGljJywgJ3NlcScsICd0cycsICdfc3RhdHVzJywgJ2Zyb20nLCAnaGVhZCcsICdjb250ZW50J107XG4gICAgY29uc3QgcmVzID0gZHN0IHx8IHt9O1xuICAgIGZpZWxkcy5mb3JFYWNoKChmKSA9PiB7XG4gICAgICBpZiAobXNnLmhhc093blByb3BlcnR5KGYpKSB7XG4gICAgICAgIHJlc1tmXSA9IG1zZ1tmXTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcmVzO1xuICB9XG5cbiAgLyoqXG4gICAqIFRvIHVzZSBEQiBpbiBhIG5vbiBicm93c2VyIGNvbnRleHQsIHN1cHBseSBpbmRleGVkREIgcHJvdmlkZXIuXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlcm9mIERCXG4gICAqIEBwYXJhbSBpZGJQcm92aWRlciBpbmRleGVkREIgcHJvdmlkZXIsIGUuZy4gZm9yIG5vZGUgPGNvZGU+cmVxdWlyZSgnZmFrZS1pbmRleGVkZGInKTwvY29kZT4uXG4gICAqL1xuICBzdGF0aWMgc2V0RGF0YWJhc2VQcm92aWRlcihpZGJQcm92aWRlcikge1xuICAgIElEQlByb3ZpZGVyID0gaWRiUHJvdmlkZXI7XG4gIH1cbn1cbiIsIi8qKlxuICogQGNvcHlyaWdodCAyMDE1LTIwMjIgVGlub2RlIExMQy5cbiAqIEBzdW1tYXJ5IE1pbmltYWxseSByaWNoIHRleHQgcmVwcmVzZW50YXRpb24gYW5kIGZvcm1hdHRpbmcgZm9yIFRpbm9kZS5cbiAqIEBsaWNlbnNlIEFwYWNoZSAyLjBcbiAqXG4gKiBAZmlsZSBCYXNpYyBwYXJzZXIgYW5kIGZvcm1hdHRlciBmb3IgdmVyeSBzaW1wbGUgdGV4dCBtYXJrdXAuIE1vc3RseSB0YXJnZXRlZCBhdFxuICogbW9iaWxlIHVzZSBjYXNlcyBzaW1pbGFyIHRvIFRlbGVncmFtLCBXaGF0c0FwcCwgYW5kIEZCIE1lc3Nlbmdlci5cbiAqXG4gKiA8cD5TdXBwb3J0cyBjb252ZXJzaW9uIG9mIHVzZXIga2V5Ym9hcmQgaW5wdXQgdG8gZm9ybWF0dGVkIHRleHQ6PC9wPlxuICogPHVsPlxuICogICA8bGk+KmFiYyogJnJhcnI7IDxiPmFiYzwvYj48L2xpPlxuICogICA8bGk+X2FiY18gJnJhcnI7IDxpPmFiYzwvaT48L2xpPlxuICogICA8bGk+fmFiY34gJnJhcnI7IDxkZWw+YWJjPC9kZWw+PC9saT5cbiAqICAgPGxpPmBhYmNgICZyYXJyOyA8dHQ+YWJjPC90dD48L2xpPlxuICogPC91bD5cbiAqIEFsc28gc3VwcG9ydHMgZm9ybXMgYW5kIGJ1dHRvbnMuXG4gKlxuICogTmVzdGVkIGZvcm1hdHRpbmcgaXMgc3VwcG9ydGVkLCBlLmcuICphYmMgX2RlZl8qIC0+IDxiPmFiYyA8aT5kZWY8L2k+PC9iPlxuICogVVJMcywgQG1lbnRpb25zLCBhbmQgI2hhc2h0YWdzIGFyZSBleHRyYWN0ZWQgYW5kIGNvbnZlcnRlZCBpbnRvIGxpbmtzLlxuICogRm9ybXMgYW5kIGJ1dHRvbnMgY2FuIGJlIGFkZGVkIHByb2NlZHVyYWxseS5cbiAqIEpTT04gZGF0YSByZXByZXNlbnRhdGlvbiBpcyBpbnNwaXJlZCBieSBEcmFmdC5qcyByYXcgZm9ybWF0dGluZy5cbiAqXG4gKlxuICogQGV4YW1wbGVcbiAqIFRleHQ6XG4gKiA8cHJlPlxuICogICAgIHRoaXMgaXMgKmJvbGQqLCBgY29kZWAgYW5kIF9pdGFsaWNfLCB+c3RyaWtlflxuICogICAgIGNvbWJpbmVkICpib2xkIGFuZCBfaXRhbGljXypcbiAqICAgICBhbiB1cmw6IGh0dHBzOi8vd3d3LmV4YW1wbGUuY29tL2FiYyNmcmFnbWVudCBhbmQgYW5vdGhlciBfd3d3LnRpbm9kZS5jb19cbiAqICAgICB0aGlzIGlzIGEgQG1lbnRpb24gYW5kIGEgI2hhc2h0YWcgaW4gYSBzdHJpbmdcbiAqICAgICBzZWNvbmQgI2hhc2h0YWdcbiAqIDwvcHJlPlxuICpcbiAqICBTYW1wbGUgSlNPTiByZXByZXNlbnRhdGlvbiBvZiB0aGUgdGV4dCBhYm92ZTpcbiAqICB7XG4gKiAgICAgXCJ0eHRcIjogXCJ0aGlzIGlzIGJvbGQsIGNvZGUgYW5kIGl0YWxpYywgc3RyaWtlIGNvbWJpbmVkIGJvbGQgYW5kIGl0YWxpYyBhbiB1cmw6IGh0dHBzOi8vd3d3LmV4YW1wbGUuY29tL2FiYyNmcmFnbWVudCBcIiArXG4gKiAgICAgICAgICAgICBcImFuZCBhbm90aGVyIHd3dy50aW5vZGUuY28gdGhpcyBpcyBhIEBtZW50aW9uIGFuZCBhICNoYXNodGFnIGluIGEgc3RyaW5nIHNlY29uZCAjaGFzaHRhZ1wiLFxuICogICAgIFwiZm10XCI6IFtcbiAqICAgICAgICAgeyBcImF0XCI6OCwgXCJsZW5cIjo0LFwidHBcIjpcIlNUXCIgfSx7IFwiYXRcIjoxNCwgXCJsZW5cIjo0LCBcInRwXCI6XCJDT1wiIH0seyBcImF0XCI6MjMsIFwibGVuXCI6NiwgXCJ0cFwiOlwiRU1cIn0sXG4gKiAgICAgICAgIHsgXCJhdFwiOjMxLCBcImxlblwiOjYsIFwidHBcIjpcIkRMXCIgfSx7IFwidHBcIjpcIkJSXCIsIFwibGVuXCI6MSwgXCJhdFwiOjM3IH0seyBcImF0XCI6NTYsIFwibGVuXCI6NiwgXCJ0cFwiOlwiRU1cIiB9LFxuICogICAgICAgICB7IFwiYXRcIjo0NywgXCJsZW5cIjoxNSwgXCJ0cFwiOlwiU1RcIiB9LHsgXCJ0cFwiOlwiQlJcIiwgXCJsZW5cIjoxLCBcImF0XCI6NjIgfSx7IFwiYXRcIjoxMjAsIFwibGVuXCI6MTMsIFwidHBcIjpcIkVNXCIgfSxcbiAqICAgICAgICAgeyBcImF0XCI6NzEsIFwibGVuXCI6MzYsIFwia2V5XCI6MCB9LHsgXCJhdFwiOjEyMCwgXCJsZW5cIjoxMywgXCJrZXlcIjoxIH0seyBcInRwXCI6XCJCUlwiLCBcImxlblwiOjEsIFwiYXRcIjoxMzMgfSxcbiAqICAgICAgICAgeyBcImF0XCI6MTQ0LCBcImxlblwiOjgsIFwia2V5XCI6MiB9LHsgXCJhdFwiOjE1OSwgXCJsZW5cIjo4LCBcImtleVwiOjMgfSx7IFwidHBcIjpcIkJSXCIsIFwibGVuXCI6MSwgXCJhdFwiOjE3OSB9LFxuICogICAgICAgICB7IFwiYXRcIjoxODcsIFwibGVuXCI6OCwgXCJrZXlcIjozIH0seyBcInRwXCI6XCJCUlwiLCBcImxlblwiOjEsIFwiYXRcIjoxOTUgfVxuICogICAgIF0sXG4gKiAgICAgXCJlbnRcIjogW1xuICogICAgICAgICB7IFwidHBcIjpcIkxOXCIsIFwiZGF0YVwiOnsgXCJ1cmxcIjpcImh0dHBzOi8vd3d3LmV4YW1wbGUuY29tL2FiYyNmcmFnbWVudFwiIH0gfSxcbiAqICAgICAgICAgeyBcInRwXCI6XCJMTlwiLCBcImRhdGFcIjp7IFwidXJsXCI6XCJodHRwOi8vd3d3LnRpbm9kZS5jb1wiIH0gfSxcbiAqICAgICAgICAgeyBcInRwXCI6XCJNTlwiLCBcImRhdGFcIjp7IFwidmFsXCI6XCJtZW50aW9uXCIgfSB9LFxuICogICAgICAgICB7IFwidHBcIjpcIkhUXCIsIFwiZGF0YVwiOnsgXCJ2YWxcIjpcImhhc2h0YWdcIiB9IH1cbiAqICAgICBdXG4gKiAgfVxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuLy8gTk9URSBUTyBERVZFTE9QRVJTOlxuLy8gTG9jYWxpemFibGUgc3RyaW5ncyBzaG91bGQgYmUgZG91YmxlIHF1b3RlZCBcItGB0YLRgNC+0LrQsCDQvdCwINC00YDRg9Cz0L7QvCDRj9C30YvQutC1XCIsXG4vLyBub24tbG9jYWxpemFibGUgc3RyaW5ncyBzaG91bGQgYmUgc2luZ2xlIHF1b3RlZCAnbm9uLWxvY2FsaXplZCcuXG5cbmNvbnN0IE1BWF9GT1JNX0VMRU1FTlRTID0gODtcbmNvbnN0IE1BWF9QUkVWSUVXX0FUVEFDSE1FTlRTID0gMztcbmNvbnN0IE1BWF9QUkVWSUVXX0RBVEFfU0laRSA9IDY0O1xuY29uc3QgSlNPTl9NSU1FX1RZUEUgPSAnYXBwbGljYXRpb24vanNvbic7XG5jb25zdCBEUkFGVFlfTUlNRV9UWVBFID0gJ3RleHQveC1kcmFmdHknO1xuY29uc3QgQUxMT1dFRF9FTlRfRklFTERTID0gWydhY3QnLCAnaGVpZ2h0JywgJ2R1cmF0aW9uJywgJ2luY29taW5nJywgJ21pbWUnLCAnbmFtZScsICdwcmV2aWV3JyxcbiAgJ3JlZicsICdzaXplJywgJ3N0YXRlJywgJ3VybCcsICd2YWwnLCAnd2lkdGgnXG5dO1xuXG4vLyBSZWd1bGFyIGV4cHJlc3Npb25zIGZvciBwYXJzaW5nIGlubGluZSBmb3JtYXRzLiBKYXZhc2NyaXB0IGRvZXMgbm90IHN1cHBvcnQgbG9va2JlaGluZCxcbi8vIHNvIGl0J3MgYSBiaXQgbWVzc3kuXG5jb25zdCBJTkxJTkVfU1RZTEVTID0gW1xuICAvLyBTdHJvbmcgPSBib2xkLCAqYm9sZCB0ZXh0KlxuICB7XG4gICAgbmFtZTogJ1NUJyxcbiAgICBzdGFydDogLyg/Ol58W1xcV19dKShcXCopW15cXHMqXS8sXG4gICAgZW5kOiAvW15cXHMqXShcXCopKD89JHxbXFxXX10pL1xuICB9LFxuICAvLyBFbXBoZXNpemVkID0gaXRhbGljLCBfaXRhbGljIHRleHRfXG4gIHtcbiAgICBuYW1lOiAnRU0nLFxuICAgIHN0YXJ0OiAvKD86XnxcXFcpKF8pW15cXHNfXS8sXG4gICAgZW5kOiAvW15cXHNfXShfKSg/PSR8XFxXKS9cbiAgfSxcbiAgLy8gRGVsZXRlZCwgfnN0cmlrZSB0aGlzIHRob3VnaH5cbiAge1xuICAgIG5hbWU6ICdETCcsXG4gICAgc3RhcnQ6IC8oPzpefFtcXFdfXSkofilbXlxcc35dLyxcbiAgICBlbmQ6IC9bXlxcc35dKH4pKD89JHxbXFxXX10pL1xuICB9LFxuICAvLyBDb2RlIGJsb2NrIGB0aGlzIGlzIG1vbm9zcGFjZWBcbiAge1xuICAgIG5hbWU6ICdDTycsXG4gICAgc3RhcnQ6IC8oPzpefFxcVykoYClbXmBdLyxcbiAgICBlbmQ6IC9bXmBdKGApKD89JHxcXFcpL1xuICB9XG5dO1xuXG4vLyBSZWxhdGl2ZSB3ZWlnaHRzIG9mIGZvcm1hdHRpbmcgc3BhbnMuIEdyZWF0ZXIgaW5kZXggaW4gYXJyYXkgbWVhbnMgZ3JlYXRlciB3ZWlnaHQuXG5jb25zdCBGTVRfV0VJR0hUID0gWydRUSddO1xuXG4vLyBSZWdFeHBzIGZvciBlbnRpdHkgZXh0cmFjdGlvbiAoUkYgPSByZWZlcmVuY2UpXG5jb25zdCBFTlRJVFlfVFlQRVMgPSBbXG4gIC8vIFVSTHNcbiAge1xuICAgIG5hbWU6ICdMTicsXG4gICAgZGF0YU5hbWU6ICd1cmwnLFxuICAgIHBhY2s6IGZ1bmN0aW9uKHZhbCkge1xuICAgICAgLy8gQ2hlY2sgaWYgdGhlIHByb3RvY29sIGlzIHNwZWNpZmllZCwgaWYgbm90IHVzZSBodHRwXG4gICAgICBpZiAoIS9eW2Etel0rOlxcL1xcLy9pLnRlc3QodmFsKSkge1xuICAgICAgICB2YWwgPSAnaHR0cDovLycgKyB2YWw7XG4gICAgICB9XG4gICAgICByZXR1cm4ge1xuICAgICAgICB1cmw6IHZhbFxuICAgICAgfTtcbiAgICB9LFxuICAgIHJlOiAvKD86KD86aHR0cHM/fGZ0cCk6XFwvXFwvfHd3d1xcLnxmdHBcXC4pWy1BLVowLTkrJkAjXFwvJT1+X3wkPyE6LC5dKltBLVowLTkrJkAjXFwvJT1+X3wkXS9pZ1xuICB9LFxuICAvLyBNZW50aW9ucyBAdXNlciAobXVzdCBiZSAyIG9yIG1vcmUgY2hhcmFjdGVycylcbiAge1xuICAgIG5hbWU6ICdNTicsXG4gICAgZGF0YU5hbWU6ICd2YWwnLFxuICAgIHBhY2s6IGZ1bmN0aW9uKHZhbCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdmFsOiB2YWwuc2xpY2UoMSlcbiAgICAgIH07XG4gICAgfSxcbiAgICByZTogL1xcQkAoW1xccHtMfVxccHtOfV1bLl9cXHB7TH1cXHB7Tn1dKltcXHB7TH1cXHB7Tn1dKS91Z1xuICB9LFxuICAvLyBIYXNodGFncyAjaGFzaHRhZywgbGlrZSBtZXRpb24gMiBvciBtb3JlIGNoYXJhY3RlcnMuXG4gIHtcbiAgICBuYW1lOiAnSFQnLFxuICAgIGRhdGFOYW1lOiAndmFsJyxcbiAgICBwYWNrOiBmdW5jdGlvbih2YWwpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHZhbDogdmFsLnNsaWNlKDEpXG4gICAgICB9O1xuICAgIH0sXG4gICAgcmU6IC9cXEIjKFtcXHB7TH1cXHB7Tn1dWy5fXFxwe0x9XFxwe059XSpbXFxwe0x9XFxwe059XSkvdWdcbiAgfVxuXTtcblxuLy8gSFRNTCB0YWcgbmFtZSBzdWdnZXN0aW9uc1xuY29uc3QgSFRNTF9UQUdTID0ge1xuICBBVToge1xuICAgIG5hbWU6ICdhdWRpbycsXG4gICAgaXNWb2lkOiBmYWxzZVxuICB9LFxuICBCTjoge1xuICAgIG5hbWU6ICdidXR0b24nLFxuICAgIGlzVm9pZDogZmFsc2VcbiAgfSxcbiAgQlI6IHtcbiAgICBuYW1lOiAnYnInLFxuICAgIGlzVm9pZDogdHJ1ZVxuICB9LFxuICBDTzoge1xuICAgIG5hbWU6ICd0dCcsXG4gICAgaXNWb2lkOiBmYWxzZVxuICB9LFxuICBETDoge1xuICAgIG5hbWU6ICdkZWwnLFxuICAgIGlzVm9pZDogZmFsc2VcbiAgfSxcbiAgRU06IHtcbiAgICBuYW1lOiAnaScsXG4gICAgaXNWb2lkOiBmYWxzZVxuICB9LFxuICBFWDoge1xuICAgIG5hbWU6ICcnLFxuICAgIGlzVm9pZDogdHJ1ZVxuICB9LFxuICBGTToge1xuICAgIG5hbWU6ICdkaXYnLFxuICAgIGlzVm9pZDogZmFsc2VcbiAgfSxcbiAgSEQ6IHtcbiAgICBuYW1lOiAnJyxcbiAgICBpc1ZvaWQ6IGZhbHNlXG4gIH0sXG4gIEhMOiB7XG4gICAgbmFtZTogJ3NwYW4nLFxuICAgIGlzVm9pZDogZmFsc2VcbiAgfSxcbiAgSFQ6IHtcbiAgICBuYW1lOiAnYScsXG4gICAgaXNWb2lkOiBmYWxzZVxuICB9LFxuICBJTToge1xuICAgIG5hbWU6ICdpbWcnLFxuICAgIGlzVm9pZDogZmFsc2VcbiAgfSxcbiAgTE46IHtcbiAgICBuYW1lOiAnYScsXG4gICAgaXNWb2lkOiBmYWxzZVxuICB9LFxuICBNTjoge1xuICAgIG5hbWU6ICdhJyxcbiAgICBpc1ZvaWQ6IGZhbHNlXG4gIH0sXG4gIFJXOiB7XG4gICAgbmFtZTogJ2RpdicsXG4gICAgaXNWb2lkOiBmYWxzZSxcbiAgfSxcbiAgUVE6IHtcbiAgICBuYW1lOiAnZGl2JyxcbiAgICBpc1ZvaWQ6IGZhbHNlXG4gIH0sXG4gIFNUOiB7XG4gICAgbmFtZTogJ2InLFxuICAgIGlzVm9pZDogZmFsc2VcbiAgfSxcbiAgVkM6IHtcbiAgICBuYW1lOiAnZGl2JyxcbiAgICBpc1ZvaWQ6IGZhbHNlXG4gIH0sXG59O1xuXG4vLyBDb252ZXJ0IGJhc2U2NC1lbmNvZGVkIHN0cmluZyBpbnRvIEJsb2IuXG5mdW5jdGlvbiBiYXNlNjR0b09iamVjdFVybChiNjQsIGNvbnRlbnRUeXBlLCBsb2dnZXIpIHtcbiAgaWYgKCFiNjQpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHRyeSB7XG4gICAgY29uc3QgYmluID0gYXRvYihiNjQpO1xuICAgIGNvbnN0IGxlbmd0aCA9IGJpbi5sZW5ndGg7XG4gICAgY29uc3QgYnVmID0gbmV3IEFycmF5QnVmZmVyKGxlbmd0aCk7XG4gICAgY29uc3QgYXJyID0gbmV3IFVpbnQ4QXJyYXkoYnVmKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBhcnJbaV0gPSBiaW4uY2hhckNvZGVBdChpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gVVJMLmNyZWF0ZU9iamVjdFVSTChuZXcgQmxvYihbYnVmXSwge1xuICAgICAgdHlwZTogY29udGVudFR5cGVcbiAgICB9KSk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGlmIChsb2dnZXIpIHtcbiAgICAgIGxvZ2dlcihcIkRyYWZ0eTogZmFpbGVkIHRvIGNvbnZlcnQgb2JqZWN0LlwiLCBlcnIubWVzc2FnZSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG5cbmZ1bmN0aW9uIGJhc2U2NHRvRGF0YVVybChiNjQsIGNvbnRlbnRUeXBlKSB7XG4gIGlmICghYjY0KSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgY29udGVudFR5cGUgPSBjb250ZW50VHlwZSB8fCAnaW1hZ2UvanBlZyc7XG4gIHJldHVybiAnZGF0YTonICsgY29udGVudFR5cGUgKyAnO2Jhc2U2NCwnICsgYjY0O1xufVxuXG4vLyBIZWxwZXJzIGZvciBjb252ZXJ0aW5nIERyYWZ0eSB0byBIVE1MLlxuY29uc3QgREVDT1JBVE9SUyA9IHtcbiAgLy8gVmlzaWFsIHN0eWxlc1xuICBTVDoge1xuICAgIG9wZW46IF8gPT4gJzxiPicsXG4gICAgY2xvc2U6IF8gPT4gJzwvYj4nXG4gIH0sXG4gIEVNOiB7XG4gICAgb3BlbjogXyA9PiAnPGk+JyxcbiAgICBjbG9zZTogXyA9PiAnPC9pPidcbiAgfSxcbiAgREw6IHtcbiAgICBvcGVuOiBfID0+ICc8ZGVsPicsXG4gICAgY2xvc2U6IF8gPT4gJzwvZGVsPidcbiAgfSxcbiAgQ086IHtcbiAgICBvcGVuOiBfID0+ICc8dHQ+JyxcbiAgICBjbG9zZTogXyA9PiAnPC90dD4nXG4gIH0sXG4gIC8vIExpbmUgYnJlYWtcbiAgQlI6IHtcbiAgICBvcGVuOiBfID0+ICc8YnIvPicsXG4gICAgY2xvc2U6IF8gPT4gJydcbiAgfSxcbiAgLy8gSGlkZGVuIGVsZW1lbnRcbiAgSEQ6IHtcbiAgICBvcGVuOiBfID0+ICcnLFxuICAgIGNsb3NlOiBfID0+ICcnXG4gIH0sXG4gIC8vIEhpZ2hsaWdodGVkIGVsZW1lbnQuXG4gIEhMOiB7XG4gICAgb3BlbjogXyA9PiAnPHNwYW4gc3R5bGU9XCJjb2xvcjp0ZWFsXCI+JyxcbiAgICBjbG9zZTogXyA9PiAnPC9zcGFuPidcbiAgfSxcbiAgLy8gTGluayAoVVJMKVxuICBMTjoge1xuICAgIG9wZW46IChkYXRhKSA9PiB7XG4gICAgICByZXR1cm4gJzxhIGhyZWY9XCInICsgZGF0YS51cmwgKyAnXCI+JztcbiAgICB9LFxuICAgIGNsb3NlOiBfID0+ICc8L2E+JyxcbiAgICBwcm9wczogKGRhdGEpID0+IHtcbiAgICAgIHJldHVybiBkYXRhID8ge1xuICAgICAgICBocmVmOiBkYXRhLnVybCxcbiAgICAgICAgdGFyZ2V0OiAnX2JsYW5rJ1xuICAgICAgfSA6IG51bGw7XG4gICAgfSxcbiAgfSxcbiAgLy8gTWVudGlvblxuICBNTjoge1xuICAgIG9wZW46IChkYXRhKSA9PiB7XG4gICAgICByZXR1cm4gJzxhIGhyZWY9XCIjJyArIGRhdGEudmFsICsgJ1wiPic7XG4gICAgfSxcbiAgICBjbG9zZTogXyA9PiAnPC9hPicsXG4gICAgcHJvcHM6IChkYXRhKSA9PiB7XG4gICAgICByZXR1cm4gZGF0YSA/IHtcbiAgICAgICAgaWQ6IGRhdGEudmFsXG4gICAgICB9IDogbnVsbDtcbiAgICB9LFxuICB9LFxuICAvLyBIYXNodGFnXG4gIEhUOiB7XG4gICAgb3BlbjogKGRhdGEpID0+IHtcbiAgICAgIHJldHVybiAnPGEgaHJlZj1cIiMnICsgZGF0YS52YWwgKyAnXCI+JztcbiAgICB9LFxuICAgIGNsb3NlOiBfID0+ICc8L2E+JyxcbiAgICBwcm9wczogKGRhdGEpID0+IHtcbiAgICAgIHJldHVybiBkYXRhID8ge1xuICAgICAgICBpZDogZGF0YS52YWxcbiAgICAgIH0gOiBudWxsO1xuICAgIH0sXG4gIH0sXG4gIC8vIEJ1dHRvblxuICBCTjoge1xuICAgIG9wZW46IF8gPT4gJzxidXR0b24+JyxcbiAgICBjbG9zZTogXyA9PiAnPC9idXR0b24+JyxcbiAgICBwcm9wczogKGRhdGEpID0+IHtcbiAgICAgIHJldHVybiBkYXRhID8ge1xuICAgICAgICAnZGF0YS1hY3QnOiBkYXRhLmFjdCxcbiAgICAgICAgJ2RhdGEtdmFsJzogZGF0YS52YWwsXG4gICAgICAgICdkYXRhLW5hbWUnOiBkYXRhLm5hbWUsXG4gICAgICAgICdkYXRhLXJlZic6IGRhdGEucmVmXG4gICAgICB9IDogbnVsbDtcbiAgICB9LFxuICB9LFxuICAvLyBBdWRpbyByZWNvcmRpbmdcbiAgQVU6IHtcbiAgICBvcGVuOiAoZGF0YSkgPT4ge1xuICAgICAgY29uc3QgdXJsID0gZGF0YS5yZWYgfHwgYmFzZTY0dG9PYmplY3RVcmwoZGF0YS52YWwsIGRhdGEubWltZSwgRHJhZnR5LmxvZ2dlcik7XG4gICAgICByZXR1cm4gJzxhdWRpbyBjb250cm9scyBzcmM9XCInICsgdXJsICsgJ1wiPic7XG4gICAgfSxcbiAgICBjbG9zZTogXyA9PiAnPC9hdWRpbz4nLFxuICAgIHByb3BzOiAoZGF0YSkgPT4ge1xuICAgICAgaWYgKCFkYXRhKSByZXR1cm4gbnVsbDtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC8vIEVtYmVkZGVkIGRhdGEgb3IgZXh0ZXJuYWwgbGluay5cbiAgICAgICAgc3JjOiBkYXRhLnJlZiB8fCBiYXNlNjR0b09iamVjdFVybChkYXRhLnZhbCwgZGF0YS5taW1lLCBEcmFmdHkubG9nZ2VyKSxcbiAgICAgICAgJ2RhdGEtcHJlbG9hZCc6IGRhdGEucmVmID8gJ21ldGFkYXRhJyA6ICdhdXRvJyxcbiAgICAgICAgJ2RhdGEtZHVyYXRpb24nOiBkYXRhLmR1cmF0aW9uLFxuICAgICAgICAnZGF0YS1uYW1lJzogZGF0YS5uYW1lLFxuICAgICAgICAnZGF0YS1zaXplJzogZGF0YS52YWwgPyAoKGRhdGEudmFsLmxlbmd0aCAqIDAuNzUpIHwgMCkgOiAoZGF0YS5zaXplIHwgMCksXG4gICAgICAgICdkYXRhLW1pbWUnOiBkYXRhLm1pbWUsXG4gICAgICB9O1xuICAgIH1cbiAgfSxcbiAgLy8gSW1hZ2VcbiAgSU06IHtcbiAgICBvcGVuOiAoZGF0YSkgPT4ge1xuICAgICAgLy8gRG9uJ3QgdXNlIGRhdGEucmVmIGZvciBwcmV2aWV3OiBpdCdzIGEgc2VjdXJpdHkgcmlzay5cbiAgICAgIGNvbnN0IHRtcFByZXZpZXdVcmwgPSBiYXNlNjR0b0RhdGFVcmwoZGF0YS5fdGVtcFByZXZpZXcsIGRhdGEubWltZSk7XG4gICAgICBjb25zdCBwcmV2aWV3VXJsID0gYmFzZTY0dG9PYmplY3RVcmwoZGF0YS52YWwsIGRhdGEubWltZSwgRHJhZnR5LmxvZ2dlcik7XG4gICAgICBjb25zdCBkb3dubG9hZFVybCA9IGRhdGEucmVmIHx8IHByZXZpZXdVcmw7XG4gICAgICByZXR1cm4gKGRhdGEubmFtZSA/ICc8YSBocmVmPVwiJyArIGRvd25sb2FkVXJsICsgJ1wiIGRvd25sb2FkPVwiJyArIGRhdGEubmFtZSArICdcIj4nIDogJycpICtcbiAgICAgICAgJzxpbWcgc3JjPVwiJyArICh0bXBQcmV2aWV3VXJsIHx8IHByZXZpZXdVcmwpICsgJ1wiJyArXG4gICAgICAgIChkYXRhLndpZHRoID8gJyB3aWR0aD1cIicgKyBkYXRhLndpZHRoICsgJ1wiJyA6ICcnKSArXG4gICAgICAgIChkYXRhLmhlaWdodCA/ICcgaGVpZ2h0PVwiJyArIGRhdGEuaGVpZ2h0ICsgJ1wiJyA6ICcnKSArICcgYm9yZGVyPVwiMFwiIC8+JztcbiAgICB9LFxuICAgIGNsb3NlOiAoZGF0YSkgPT4ge1xuICAgICAgcmV0dXJuIChkYXRhLm5hbWUgPyAnPC9hPicgOiAnJyk7XG4gICAgfSxcbiAgICBwcm9wczogKGRhdGEpID0+IHtcbiAgICAgIGlmICghZGF0YSkgcmV0dXJuIG51bGw7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAvLyBUZW1wb3JhcnkgcHJldmlldywgb3IgcGVybWFuZW50IHByZXZpZXcsIG9yIGV4dGVybmFsIGxpbmsuXG4gICAgICAgIHNyYzogYmFzZTY0dG9EYXRhVXJsKGRhdGEuX3RlbXBQcmV2aWV3LCBkYXRhLm1pbWUpIHx8XG4gICAgICAgICAgZGF0YS5yZWYgfHwgYmFzZTY0dG9PYmplY3RVcmwoZGF0YS52YWwsIGRhdGEubWltZSwgRHJhZnR5LmxvZ2dlciksXG4gICAgICAgIHRpdGxlOiBkYXRhLm5hbWUsXG4gICAgICAgIGFsdDogZGF0YS5uYW1lLFxuICAgICAgICAnZGF0YS13aWR0aCc6IGRhdGEud2lkdGgsXG4gICAgICAgICdkYXRhLWhlaWdodCc6IGRhdGEuaGVpZ2h0LFxuICAgICAgICAnZGF0YS1uYW1lJzogZGF0YS5uYW1lLFxuICAgICAgICAnZGF0YS1zaXplJzogZGF0YS52YWwgPyAoKGRhdGEudmFsLmxlbmd0aCAqIDAuNzUpIHwgMCkgOiAoZGF0YS5zaXplIHwgMCksXG4gICAgICAgICdkYXRhLW1pbWUnOiBkYXRhLm1pbWUsXG4gICAgICB9O1xuICAgIH0sXG4gIH0sXG4gIC8vIEZvcm0gLSBzdHJ1Y3R1cmVkIGxheW91dCBvZiBlbGVtZW50cy5cbiAgRk06IHtcbiAgICBvcGVuOiBfID0+ICc8ZGl2PicsXG4gICAgY2xvc2U6IF8gPT4gJzwvZGl2PidcbiAgfSxcbiAgLy8gUm93OiBsb2dpYyBncm91cGluZyBvZiBlbGVtZW50c1xuICBSVzoge1xuICAgIG9wZW46IF8gPT4gJzxkaXY+JyxcbiAgICBjbG9zZTogXyA9PiAnPC9kaXY+J1xuICB9LFxuICAvLyBRdW90ZWQgYmxvY2suXG4gIFFROiB7XG4gICAgb3BlbjogXyA9PiAnPGRpdj4nLFxuICAgIGNsb3NlOiBfID0+ICc8L2Rpdj4nLFxuICAgIHByb3BzOiAoZGF0YSkgPT4ge1xuICAgICAgcmV0dXJuIGRhdGEgPyB7fSA6IG51bGw7XG4gICAgfSxcbiAgfSxcbiAgLy8gVmlkZW8gY2FsbFxuICBWQzoge1xuICAgIG9wZW46IF8gPT4gJzxkaXY+JyxcbiAgICBjbG9zZTogXyA9PiAnPC9kaXY+JyxcbiAgICBwcm9wczogZGF0YSA9PiB7XG4gICAgICBpZiAoIWRhdGEpIHJldHVybiB7fTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgICdkYXRhLWR1cmF0aW9uJzogZGF0YS5kdXJhdGlvbixcbiAgICAgICAgJ2RhdGEtc3RhdGUnOiBkYXRhLnN0YXRlLFxuICAgICAgfTtcbiAgICB9XG4gIH0sXG59O1xuXG4vKipcbiAqIFRoZSBtYWluIG9iamVjdCB3aGljaCBwZXJmb3JtcyBhbGwgdGhlIGZvcm1hdHRpbmcgYWN0aW9ucy5cbiAqIEBjbGFzcyBEcmFmdHlcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5jb25zdCBEcmFmdHkgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy50eHQgPSAnJztcbiAgdGhpcy5mbXQgPSBbXTtcbiAgdGhpcy5lbnQgPSBbXTtcbn1cblxuLyoqXG4gKiBJbml0aWFsaXplIERyYWZ0eSBkb2N1bWVudCB0byBhIHBsYWluIHRleHQgc3RyaW5nLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBwbGFpblRleHQgLSBzdHJpbmcgdG8gdXNlIGFzIERyYWZ0eSBjb250ZW50LlxuICpcbiAqIEByZXR1cm5zIG5ldyBEcmFmdHkgZG9jdW1lbnQgb3IgbnVsbCBpcyBwbGFpblRleHQgaXMgbm90IGEgc3RyaW5nIG9yIHVuZGVmaW5lZC5cbiAqL1xuRHJhZnR5LmluaXQgPSBmdW5jdGlvbihwbGFpblRleHQpIHtcbiAgaWYgKHR5cGVvZiBwbGFpblRleHQgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBwbGFpblRleHQgPSAnJztcbiAgfSBlbHNlIGlmICh0eXBlb2YgcGxhaW5UZXh0ICE9ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHR4dDogcGxhaW5UZXh0XG4gIH07XG59XG5cbi8qKlxuICogUGFyc2UgcGxhaW4gdGV4dCBpbnRvIERyYWZ0eSBkb2N1bWVudC5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gY29udGVudCAtIHBsYWluLXRleHQgY29udGVudCB0byBwYXJzZS5cbiAqIEByZXR1cm4ge0RyYWZ0eX0gcGFyc2VkIGRvY3VtZW50IG9yIG51bGwgaWYgdGhlIHNvdXJjZSBpcyBub3QgcGxhaW4gdGV4dC5cbiAqL1xuRHJhZnR5LnBhcnNlID0gZnVuY3Rpb24oY29udGVudCkge1xuICAvLyBNYWtlIHN1cmUgd2UgYXJlIHBhcnNpbmcgc3RyaW5ncyBvbmx5LlxuICBpZiAodHlwZW9mIGNvbnRlbnQgIT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8vIFNwbGl0IHRleHQgaW50byBsaW5lcy4gSXQgbWFrZXMgZnVydGhlciBwcm9jZXNzaW5nIGVhc2llci5cbiAgY29uc3QgbGluZXMgPSBjb250ZW50LnNwbGl0KC9cXHI/XFxuLyk7XG5cbiAgLy8gSG9sZHMgZW50aXRpZXMgcmVmZXJlbmNlZCBmcm9tIHRleHRcbiAgY29uc3QgZW50aXR5TWFwID0gW107XG4gIGNvbnN0IGVudGl0eUluZGV4ID0ge307XG5cbiAgLy8gUHJvY2Vzc2luZyBsaW5lcyBvbmUgYnkgb25lLCBob2xkIGludGVybWVkaWF0ZSByZXN1bHQgaW4gYmx4LlxuICBjb25zdCBibHggPSBbXTtcbiAgbGluZXMuZm9yRWFjaCgobGluZSkgPT4ge1xuICAgIGxldCBzcGFucyA9IFtdO1xuICAgIGxldCBlbnRpdGllcztcblxuICAgIC8vIEZpbmQgZm9ybWF0dGVkIHNwYW5zIGluIHRoZSBzdHJpbmcuXG4gICAgLy8gVHJ5IHRvIG1hdGNoIGVhY2ggc3R5bGUuXG4gICAgSU5MSU5FX1NUWUxFUy5mb3JFYWNoKCh0YWcpID0+IHtcbiAgICAgIC8vIEVhY2ggc3R5bGUgY291bGQgYmUgbWF0Y2hlZCBtdWx0aXBsZSB0aW1lcy5cbiAgICAgIHNwYW5zID0gc3BhbnMuY29uY2F0KHNwYW5uaWZ5KGxpbmUsIHRhZy5zdGFydCwgdGFnLmVuZCwgdGFnLm5hbWUpKTtcbiAgICB9KTtcblxuICAgIGxldCBibG9jaztcbiAgICBpZiAoc3BhbnMubGVuZ3RoID09IDApIHtcbiAgICAgIGJsb2NrID0ge1xuICAgICAgICB0eHQ6IGxpbmVcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFNvcnQgc3BhbnMgYnkgc3R5bGUgb2NjdXJlbmNlIGVhcmx5IC0+IGxhdGUsIHRoZW4gYnkgbGVuZ3RoOiBmaXJzdCBsb25nIHRoZW4gc2hvcnQuXG4gICAgICBzcGFucy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgIGNvbnN0IGRpZmYgPSBhLmF0IC0gYi5hdDtcbiAgICAgICAgcmV0dXJuIGRpZmYgIT0gMCA/IGRpZmYgOiBiLmVuZCAtIGEuZW5kO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIENvbnZlcnQgYW4gYXJyYXkgb2YgcG9zc2libHkgb3ZlcmxhcHBpbmcgc3BhbnMgaW50byBhIHRyZWUuXG4gICAgICBzcGFucyA9IHRvU3BhblRyZWUoc3BhbnMpO1xuXG4gICAgICAvLyBCdWlsZCBhIHRyZWUgcmVwcmVzZW50YXRpb24gb2YgdGhlIGVudGlyZSBzdHJpbmcsIG5vdFxuICAgICAgLy8ganVzdCB0aGUgZm9ybWF0dGVkIHBhcnRzLlxuICAgICAgY29uc3QgY2h1bmtzID0gY2h1bmtpZnkobGluZSwgMCwgbGluZS5sZW5ndGgsIHNwYW5zKTtcblxuICAgICAgY29uc3QgZHJhZnR5ID0gZHJhZnRpZnkoY2h1bmtzLCAwKTtcblxuICAgICAgYmxvY2sgPSB7XG4gICAgICAgIHR4dDogZHJhZnR5LnR4dCxcbiAgICAgICAgZm10OiBkcmFmdHkuZm10XG4gICAgICB9O1xuICAgIH1cblxuICAgIC8vIEV4dHJhY3QgZW50aXRpZXMgZnJvbSB0aGUgY2xlYW5lZCB1cCBzdHJpbmcuXG4gICAgZW50aXRpZXMgPSBleHRyYWN0RW50aXRpZXMoYmxvY2sudHh0KTtcbiAgICBpZiAoZW50aXRpZXMubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgcmFuZ2VzID0gW107XG4gICAgICBmb3IgKGxldCBpIGluIGVudGl0aWVzKSB7XG4gICAgICAgIC8vIHtvZmZzZXQ6IG1hdGNoWydpbmRleCddLCB1bmlxdWU6IG1hdGNoWzBdLCBsZW46IG1hdGNoWzBdLmxlbmd0aCwgZGF0YTogZW50LnBhY2tlcigpLCB0eXBlOiBlbnQubmFtZX1cbiAgICAgICAgY29uc3QgZW50aXR5ID0gZW50aXRpZXNbaV07XG4gICAgICAgIGxldCBpbmRleCA9IGVudGl0eUluZGV4W2VudGl0eS51bmlxdWVdO1xuICAgICAgICBpZiAoIWluZGV4KSB7XG4gICAgICAgICAgaW5kZXggPSBlbnRpdHlNYXAubGVuZ3RoO1xuICAgICAgICAgIGVudGl0eUluZGV4W2VudGl0eS51bmlxdWVdID0gaW5kZXg7XG4gICAgICAgICAgZW50aXR5TWFwLnB1c2goe1xuICAgICAgICAgICAgdHA6IGVudGl0eS50eXBlLFxuICAgICAgICAgICAgZGF0YTogZW50aXR5LmRhdGFcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByYW5nZXMucHVzaCh7XG4gICAgICAgICAgYXQ6IGVudGl0eS5vZmZzZXQsXG4gICAgICAgICAgbGVuOiBlbnRpdHkubGVuLFxuICAgICAgICAgIGtleTogaW5kZXhcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBibG9jay5lbnQgPSByYW5nZXM7XG4gICAgfVxuXG4gICAgYmx4LnB1c2goYmxvY2spO1xuICB9KTtcblxuICBjb25zdCByZXN1bHQgPSB7XG4gICAgdHh0OiAnJ1xuICB9O1xuXG4gIC8vIE1lcmdlIGxpbmVzIGFuZCBzYXZlIGxpbmUgYnJlYWtzIGFzIEJSIGlubGluZSBmb3JtYXR0aW5nLlxuICBpZiAoYmx4Lmxlbmd0aCA+IDApIHtcbiAgICByZXN1bHQudHh0ID0gYmx4WzBdLnR4dDtcbiAgICByZXN1bHQuZm10ID0gKGJseFswXS5mbXQgfHwgW10pLmNvbmNhdChibHhbMF0uZW50IHx8IFtdKTtcblxuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgYmx4Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBibG9jayA9IGJseFtpXTtcbiAgICAgIGNvbnN0IG9mZnNldCA9IHJlc3VsdC50eHQubGVuZ3RoICsgMTtcblxuICAgICAgcmVzdWx0LmZtdC5wdXNoKHtcbiAgICAgICAgdHA6ICdCUicsXG4gICAgICAgIGxlbjogMSxcbiAgICAgICAgYXQ6IG9mZnNldCAtIDFcbiAgICAgIH0pO1xuXG4gICAgICByZXN1bHQudHh0ICs9ICcgJyArIGJsb2NrLnR4dDtcbiAgICAgIGlmIChibG9jay5mbXQpIHtcbiAgICAgICAgcmVzdWx0LmZtdCA9IHJlc3VsdC5mbXQuY29uY2F0KGJsb2NrLmZtdC5tYXAoKHMpID0+IHtcbiAgICAgICAgICBzLmF0ICs9IG9mZnNldDtcbiAgICAgICAgICByZXR1cm4gcztcbiAgICAgICAgfSkpO1xuICAgICAgfVxuICAgICAgaWYgKGJsb2NrLmVudCkge1xuICAgICAgICByZXN1bHQuZm10ID0gcmVzdWx0LmZtdC5jb25jYXQoYmxvY2suZW50Lm1hcCgocykgPT4ge1xuICAgICAgICAgIHMuYXQgKz0gb2Zmc2V0O1xuICAgICAgICAgIHJldHVybiBzO1xuICAgICAgICB9KSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHJlc3VsdC5mbXQubGVuZ3RoID09IDApIHtcbiAgICAgIGRlbGV0ZSByZXN1bHQuZm10O1xuICAgIH1cblxuICAgIGlmIChlbnRpdHlNYXAubGVuZ3RoID4gMCkge1xuICAgICAgcmVzdWx0LmVudCA9IGVudGl0eU1hcDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBBcHBlbmQgb25lIERyYWZ0eSBkb2N1bWVudCB0byBhbm90aGVyLlxuICpcbiAqIEBwYXJhbSB7RHJhZnR5fSBmaXJzdCAtIERyYWZ0eSBkb2N1bWVudCB0byBhcHBlbmQgdG8uXG4gKiBAcGFyYW0ge0RyYWZ0eXxzdHJpbmd9IHNlY29uZCAtIERyYWZ0eSBkb2N1bWVudCBvciBzdHJpbmcgYmVpbmcgYXBwZW5kZWQuXG4gKlxuICogQHJldHVybiB7RHJhZnR5fSBmaXJzdCBkb2N1bWVudCB3aXRoIHRoZSBzZWNvbmQgYXBwZW5kZWQgdG8gaXQuXG4gKi9cbkRyYWZ0eS5hcHBlbmQgPSBmdW5jdGlvbihmaXJzdCwgc2Vjb25kKSB7XG4gIGlmICghZmlyc3QpIHtcbiAgICByZXR1cm4gc2Vjb25kO1xuICB9XG4gIGlmICghc2Vjb25kKSB7XG4gICAgcmV0dXJuIGZpcnN0O1xuICB9XG5cbiAgZmlyc3QudHh0ID0gZmlyc3QudHh0IHx8ICcnO1xuICBjb25zdCBsZW4gPSBmaXJzdC50eHQubGVuZ3RoO1xuXG4gIGlmICh0eXBlb2Ygc2Vjb25kID09ICdzdHJpbmcnKSB7XG4gICAgZmlyc3QudHh0ICs9IHNlY29uZDtcbiAgfSBlbHNlIGlmIChzZWNvbmQudHh0KSB7XG4gICAgZmlyc3QudHh0ICs9IHNlY29uZC50eHQ7XG4gIH1cblxuICBpZiAoQXJyYXkuaXNBcnJheShzZWNvbmQuZm10KSkge1xuICAgIGZpcnN0LmZtdCA9IGZpcnN0LmZtdCB8fCBbXTtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShzZWNvbmQuZW50KSkge1xuICAgICAgZmlyc3QuZW50ID0gZmlyc3QuZW50IHx8IFtdO1xuICAgIH1cbiAgICBzZWNvbmQuZm10LmZvckVhY2goc3JjID0+IHtcbiAgICAgIGNvbnN0IGZtdCA9IHtcbiAgICAgICAgYXQ6IChzcmMuYXQgfCAwKSArIGxlbixcbiAgICAgICAgbGVuOiBzcmMubGVuIHwgMFxuICAgICAgfTtcbiAgICAgIC8vIFNwZWNpYWwgY2FzZSBmb3IgdGhlIG91dHNpZGUgb2YgdGhlIG5vcm1hbCByZW5kZXJpbmcgZmxvdyBzdHlsZXMuXG4gICAgICBpZiAoc3JjLmF0ID09IC0xKSB7XG4gICAgICAgIGZtdC5hdCA9IC0xO1xuICAgICAgICBmbXQubGVuID0gMDtcbiAgICAgIH1cbiAgICAgIGlmIChzcmMudHApIHtcbiAgICAgICAgZm10LnRwID0gc3JjLnRwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm10LmtleSA9IGZpcnN0LmVudC5sZW5ndGg7XG4gICAgICAgIGZpcnN0LmVudC5wdXNoKHNlY29uZC5lbnRbc3JjLmtleSB8fCAwXSk7XG4gICAgICB9XG4gICAgICBmaXJzdC5mbXQucHVzaChmbXQpO1xuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIGZpcnN0O1xufVxuXG4vKipcbiAqIEB0eXBlZGVmIERyYWZ0eS5JbWFnZURlc2NcbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEB0eXBlIE9iamVjdFxuICogQHBhcmFtIHtzdHJpbmd9IG1pbWUgLSBtaW1lLXR5cGUgb2YgdGhlIGltYWdlLCBlLmcuIFwiaW1hZ2UvcG5nXCJcbiAqIEBwYXJhbSB7c3RyaW5nfSBwcmV2aWV3IC0gYmFzZTY0LWVuY29kZWQgaW1hZ2UgY29udGVudCAob3IgcHJldmlldywgaWYgbGFyZ2UgaW1hZ2UgaXMgYXR0YWNoZWQpLiBDb3VsZCBiZSBudWxsL3VuZGVmaW5lZC5cbiAqIEBwYXJhbSB7aW50ZWdlcn0gd2lkdGggLSB3aWR0aCBvZiB0aGUgaW1hZ2VcbiAqIEBwYXJhbSB7aW50ZWdlcn0gaGVpZ2h0IC0gaGVpZ2h0IG9mIHRoZSBpbWFnZVxuICogQHBhcmFtIHtzdHJpbmd9IGZpbGVuYW1lIC0gZmlsZSBuYW1lIHN1Z2dlc3Rpb24gZm9yIGRvd25sb2FkaW5nIHRoZSBpbWFnZS5cbiAqIEBwYXJhbSB7aW50ZWdlcn0gc2l6ZSAtIHNpemUgb2YgdGhlIGltYWdlIGluIGJ5dGVzLiBUcmVhdCBpcyBhcyBhbiB1bnRydXN0ZWQgaGludC5cbiAqIEBwYXJhbSB7c3RyaW5nfSByZWZ1cmwgLSByZWZlcmVuY2UgdG8gdGhlIGNvbnRlbnQuIENvdWxkIGJlIG51bGwvdW5kZWZpbmVkLlxuICogQHBhcmFtIHtzdHJpbmd9IF90ZW1wUHJldmlldyAtIGJhc2U2NC1lbmNvZGVkIGltYWdlIHByZXZpZXcgdXNlZCBkdXJpbmcgdXBsb2FkIHByb2Nlc3M7IG5vdCBzZXJpYWxpemFibGUuXG4gKiBAcGFyYW0ge1Byb21pc2V9IHVybFByb21pc2UgLSBQcm9taXNlIHdoaWNoIHJldHVybnMgY29udGVudCBVUkwgd2hlbiByZXNvbHZlZC5cbiAqL1xuXG4vKipcbiAqIEluc2VydCBpbmxpbmUgaW1hZ2UgaW50byBEcmFmdHkgZG9jdW1lbnQuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGNvbnRlbnQgLSBkb2N1bWVudCB0byBhZGQgaW1hZ2UgdG8uXG4gKiBAcGFyYW0ge2ludGVnZXJ9IGF0IC0gaW5kZXggd2hlcmUgdGhlIG9iamVjdCBpcyBpbnNlcnRlZC4gVGhlIGxlbmd0aCBvZiB0aGUgaW1hZ2UgaXMgYWx3YXlzIDEuXG4gKiBAcGFyYW0ge0ltYWdlRGVzY30gaW1hZ2VEZXNjIC0gb2JqZWN0IHdpdGggaW1hZ2UgcGFyYW1lbmV0cyBhbmQgZGF0YS5cbiAqXG4gKiBAcmV0dXJuIHtEcmFmdHl9IHVwZGF0ZWQgZG9jdW1lbnQuXG4gKi9cbkRyYWZ0eS5pbnNlcnRJbWFnZSA9IGZ1bmN0aW9uKGNvbnRlbnQsIGF0LCBpbWFnZURlc2MpIHtcbiAgY29udGVudCA9IGNvbnRlbnQgfHwge1xuICAgIHR4dDogJyAnXG4gIH07XG4gIGNvbnRlbnQuZW50ID0gY29udGVudC5lbnQgfHwgW107XG4gIGNvbnRlbnQuZm10ID0gY29udGVudC5mbXQgfHwgW107XG5cbiAgY29udGVudC5mbXQucHVzaCh7XG4gICAgYXQ6IGF0IHwgMCxcbiAgICBsZW46IDEsXG4gICAga2V5OiBjb250ZW50LmVudC5sZW5ndGhcbiAgfSk7XG5cbiAgY29uc3QgZXggPSB7XG4gICAgdHA6ICdJTScsXG4gICAgZGF0YToge1xuICAgICAgbWltZTogaW1hZ2VEZXNjLm1pbWUsXG4gICAgICB2YWw6IGltYWdlRGVzYy5wcmV2aWV3LFxuICAgICAgd2lkdGg6IGltYWdlRGVzYy53aWR0aCxcbiAgICAgIGhlaWdodDogaW1hZ2VEZXNjLmhlaWdodCxcbiAgICAgIG5hbWU6IGltYWdlRGVzYy5maWxlbmFtZSxcbiAgICAgIHNpemU6IGltYWdlRGVzYy5zaXplIHwgMCxcbiAgICAgIHJlZjogaW1hZ2VEZXNjLnJlZnVybFxuICAgIH1cbiAgfTtcblxuICBpZiAoaW1hZ2VEZXNjLnVybFByb21pc2UpIHtcbiAgICBleC5kYXRhLl90ZW1wUHJldmlldyA9IGltYWdlRGVzYy5fdGVtcFByZXZpZXc7XG4gICAgZXguZGF0YS5fcHJvY2Vzc2luZyA9IHRydWU7XG4gICAgaW1hZ2VEZXNjLnVybFByb21pc2UudGhlbihcbiAgICAgIHVybCA9PiB7XG4gICAgICAgIGV4LmRhdGEucmVmID0gdXJsO1xuICAgICAgICBleC5kYXRhLl90ZW1wUHJldmlldyA9IHVuZGVmaW5lZDtcbiAgICAgICAgZXguZGF0YS5fcHJvY2Vzc2luZyA9IHVuZGVmaW5lZDtcbiAgICAgIH0sXG4gICAgICBfID0+IHtcbiAgICAgICAgLy8gQ2F0Y2ggdGhlIGVycm9yLCBvdGhlcndpc2UgaXQgd2lsbCBhcHBlYXIgaW4gdGhlIGNvbnNvbGUuXG4gICAgICAgIGV4LmRhdGEuX3Byb2Nlc3NpbmcgPSB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgKTtcbiAgfVxuXG4gIGNvbnRlbnQuZW50LnB1c2goZXgpO1xuXG4gIHJldHVybiBjb250ZW50O1xufVxuXG4vKipcbiAqIEB0eXBlZGVmIERyYWZ0eS5BdWRpb0Rlc2NcbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEB0eXBlIE9iamVjdFxuICogQHBhcmFtIHtzdHJpbmd9IG1pbWUgLSBtaW1lLXR5cGUgb2YgdGhlIGF1ZGlvLCBlLmcuIFwiYXVkaW8vb2dnXCIuXG4gKiBAcGFyYW0ge3N0cmluZ30gZGF0YSAtIGJhc2U2NC1lbmNvZGVkIGF1ZGlvIGNvbnRlbnQuIENvdWxkIGJlIG51bGwvdW5kZWZpbmVkLlxuICogQHBhcmFtIHtpbnRlZ2VyfSBkdXJhdGlvbiAtIGR1cmF0aW9uIG9mIHRoZSByZWNvcmQgaW4gbWlsbGlzZWNvbmRzLlxuICogQHBhcmFtIHtzdHJpbmd9IHByZXZpZXcgLSBiYXNlNjQgZW5jb2RlZCBzaG9ydCBhcnJheSBvZiBhbXBsaXR1ZGUgdmFsdWVzIDAuLjEwMC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlbmFtZSAtIGZpbGUgbmFtZSBzdWdnZXN0aW9uIGZvciBkb3dubG9hZGluZyB0aGUgYXVkaW8uXG4gKiBAcGFyYW0ge2ludGVnZXJ9IHNpemUgLSBzaXplIG9mIHRoZSByZWNvcmRpbmcgaW4gYnl0ZXMuIFRyZWF0IGlzIGFzIGFuIHVudHJ1c3RlZCBoaW50LlxuICogQHBhcmFtIHtzdHJpbmd9IHJlZnVybCAtIHJlZmVyZW5jZSB0byB0aGUgY29udGVudC4gQ291bGQgYmUgbnVsbC91bmRlZmluZWQuXG4gKiBAcGFyYW0ge1Byb21pc2V9IHVybFByb21pc2UgLSBQcm9taXNlIHdoaWNoIHJldHVybnMgY29udGVudCBVUkwgd2hlbiByZXNvbHZlZC5cbiAqL1xuXG4vKipcbiAqIEluc2VydCBhdWRpbyByZWNvcmRpbmcgaW50byBEcmFmdHkgZG9jdW1lbnQuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGNvbnRlbnQgLSBkb2N1bWVudCB0byBhZGQgYXVkaW8gcmVjb3JkIHRvLlxuICogQHBhcmFtIHtpbnRlZ2VyfSBhdCAtIGluZGV4IHdoZXJlIHRoZSBvYmplY3QgaXMgaW5zZXJ0ZWQuIFRoZSBsZW5ndGggb2YgdGhlIHJlY29yZCBpcyBhbHdheXMgMS5cbiAqIEBwYXJhbSB7QXVkaW9EZXNjfSBhdWRpb0Rlc2MgLSBvYmplY3Qgd2l0aCB0aGUgYXVkaW8gcGFyYW1lbmV0cyBhbmQgZGF0YS5cbiAqXG4gKiBAcmV0dXJuIHtEcmFmdHl9IHVwZGF0ZWQgZG9jdW1lbnQuXG4gKi9cbkRyYWZ0eS5pbnNlcnRBdWRpbyA9IGZ1bmN0aW9uKGNvbnRlbnQsIGF0LCBhdWRpb0Rlc2MpIHtcbiAgY29udGVudCA9IGNvbnRlbnQgfHwge1xuICAgIHR4dDogJyAnXG4gIH07XG4gIGNvbnRlbnQuZW50ID0gY29udGVudC5lbnQgfHwgW107XG4gIGNvbnRlbnQuZm10ID0gY29udGVudC5mbXQgfHwgW107XG5cbiAgY29udGVudC5mbXQucHVzaCh7XG4gICAgYXQ6IGF0IHwgMCxcbiAgICBsZW46IDEsXG4gICAga2V5OiBjb250ZW50LmVudC5sZW5ndGhcbiAgfSk7XG5cbiAgY29uc3QgZXggPSB7XG4gICAgdHA6ICdBVScsXG4gICAgZGF0YToge1xuICAgICAgbWltZTogYXVkaW9EZXNjLm1pbWUsXG4gICAgICB2YWw6IGF1ZGlvRGVzYy5kYXRhLFxuICAgICAgZHVyYXRpb246IGF1ZGlvRGVzYy5kdXJhdGlvbiB8IDAsXG4gICAgICBwcmV2aWV3OiBhdWRpb0Rlc2MucHJldmlldyxcbiAgICAgIG5hbWU6IGF1ZGlvRGVzYy5maWxlbmFtZSxcbiAgICAgIHNpemU6IGF1ZGlvRGVzYy5zaXplIHwgMCxcbiAgICAgIHJlZjogYXVkaW9EZXNjLnJlZnVybFxuICAgIH1cbiAgfTtcblxuICBpZiAoYXVkaW9EZXNjLnVybFByb21pc2UpIHtcbiAgICBleC5kYXRhLl9wcm9jZXNzaW5nID0gdHJ1ZTtcbiAgICBhdWRpb0Rlc2MudXJsUHJvbWlzZS50aGVuKFxuICAgICAgdXJsID0+IHtcbiAgICAgICAgZXguZGF0YS5yZWYgPSB1cmw7XG4gICAgICAgIGV4LmRhdGEuX3Byb2Nlc3NpbmcgPSB1bmRlZmluZWQ7XG4gICAgICB9LFxuICAgICAgXyA9PiB7XG4gICAgICAgIC8vIENhdGNoIHRoZSBlcnJvciwgb3RoZXJ3aXNlIGl0IHdpbGwgYXBwZWFyIGluIHRoZSBjb25zb2xlLlxuICAgICAgICBleC5kYXRhLl9wcm9jZXNzaW5nID0gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgICk7XG4gIH1cblxuICBjb250ZW50LmVudC5wdXNoKGV4KTtcblxuICByZXR1cm4gY29udGVudDtcbn1cblxuLyoqXG4gKiBDcmVhdGUgYSAoc2VsZi1jb250YWluZWQpIHZpZGVvIGNhbGwgRHJhZnR5IGRvY3VtZW50LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEByZXR1cm5zIFZpZGVvIENhbGwgZHJhZnR5IGRvY3VtZW50LlxuICovXG5EcmFmdHkudmlkZW9DYWxsID0gZnVuY3Rpb24oKSB7XG4gIGNvbnN0IGNvbnRlbnQgPSB7XG4gICAgdHh0OiAnICcsXG4gICAgZm10OiBbe1xuICAgICAgYXQ6IDAsXG4gICAgICBsZW46IDEsXG4gICAgICBrZXk6IDBcbiAgICB9XSxcbiAgICBlbnQ6IFt7XG4gICAgICB0cDogJ1ZDJ1xuICAgIH1dXG4gIH07XG4gIHJldHVybiBjb250ZW50O1xufVxuXG4vKipcbiAqIFVwZGF0ZSB2aWRlbyBjYWxsIChWQykgZW50aXR5IHdpdGggdGhlIG5ldyBzdGF0dXMgYW5kIGR1cmF0aW9uLlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fSBjb250ZW50IC0gVkMgZG9jdW1lbnQgdG8gdXBkYXRlLlxuICogQHBhcmFtIHtvYmplY3R9IHBhcmFtcyAtIG5ldyB2aWRlbyBjYWxsIHBhcmFtZXRlcnMuXG4gKiBAcGFyYW0ge3N0cmluZ30gcGFyYW1zLnN0YXRlIC0gc3RhdGUgb2YgdmlkZW8gY2FsbC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBwYXJhbXMuZHVyYXRpb24gLSBkdXJhdGlvbiBvZiB0aGUgdmlkZW8gY2FsbCBpbiBtaWxsaXNlY29uZHMuXG4gKlxuICogQHJldHVybnMgdGhlIHNhbWUgZG9jdW1lbnQgd2l0aCB1cGRhdGUgYXBwbGllZC5cbiAqL1xuRHJhZnR5LnVwZGF0ZVZpZGVvRW50ID0gZnVuY3Rpb24oY29udGVudCwgcGFyYW1zKSB7XG4gIC8vIFRoZSB2aWRlbyBlbGVtZW50IGNvdWxkIGJlIGp1c3QgYSBmb3JtYXQgb3IgYSBmb3JtYXQgKyBlbnRpdHkuXG4gIC8vIE11c3QgZW5zdXJlIGl0J3MgdGhlIGxhdHRlciBmaXJzdC5cbiAgY29uc3QgZm10ID0gKChjb250ZW50IHx8IHt9KS5mbXQgfHwgW10pWzBdO1xuICBpZiAoIWZtdCkge1xuICAgIC8vIFVucmVjb2duaXplZCBjb250ZW50LlxuICAgIHJldHVybiBjb250ZW50O1xuICB9XG5cbiAgbGV0IGVudDtcbiAgaWYgKGZtdC50cCA9PSAnVkMnKSB7XG4gICAgLy8gSnVzdCBhIGZvcm1hdCwgY29udmVydCB0byBmb3JtYXQgKyBlbnRpdHkuXG4gICAgZGVsZXRlIGZtdC50cDtcbiAgICBmbXQua2V5ID0gMDtcbiAgICBlbnQgPSB7XG4gICAgICB0cDogJ1ZDJ1xuICAgIH07XG4gICAgY29udGVudC5lbnQgPSBbZW50XTtcbiAgfSBlbHNlIHtcbiAgICBlbnQgPSAoY29udGVudC5lbnQgfHwgW10pW2ZtdC5rZXkgfCAwXTtcbiAgICBpZiAoIWVudCB8fCBlbnQudHAgIT0gJ1ZDJykge1xuICAgICAgLy8gTm90IGEgVkMgZW50aXR5LlxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfVxuICB9XG4gIGVudC5kYXRhID0gZW50LmRhdGEgfHwge307XG4gIE9iamVjdC5hc3NpZ24oZW50LmRhdGEsIHBhcmFtcyk7XG4gIHJldHVybiBjb250ZW50O1xufVxuXG4vKipcbiAqIENyZWF0ZSBhIHF1b3RlIHRvIERyYWZ0eSBkb2N1bWVudC5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gaGVhZGVyIC0gUXVvdGUgaGVhZGVyICh0aXRsZSwgZXRjLikuXG4gKiBAcGFyYW0ge3N0cmluZ30gdWlkIC0gVUlEIG9mIHRoZSBhdXRob3IgdG8gbWVudGlvbi5cbiAqIEBwYXJhbSB7RHJhZnR5fSBib2R5IC0gQm9keSBvZiB0aGUgcXVvdGVkIG1lc3NhZ2UuXG4gKlxuICogQHJldHVybnMgUmVwbHkgcXVvdGUgRHJhZnR5IGRvYyB3aXRoIHRoZSBxdW90ZSBmb3JtYXR0aW5nLlxuICovXG5EcmFmdHkucXVvdGUgPSBmdW5jdGlvbihoZWFkZXIsIHVpZCwgYm9keSkge1xuICBjb25zdCBxdW90ZSA9IERyYWZ0eS5hcHBlbmQoRHJhZnR5LmFwcGVuZExpbmVCcmVhayhEcmFmdHkubWVudGlvbihoZWFkZXIsIHVpZCkpLCBib2R5KTtcblxuICAvLyBXcmFwIGludG8gYSBxdW90ZS5cbiAgcXVvdGUuZm10LnB1c2goe1xuICAgIGF0OiAwLFxuICAgIGxlbjogcXVvdGUudHh0Lmxlbmd0aCxcbiAgICB0cDogJ1FRJ1xuICB9KTtcblxuICByZXR1cm4gcXVvdGU7XG59XG5cbi8qKlxuICogQ3JlYXRlIGEgRHJhZnR5IGRvY3VtZW50IHdpdGggYSBtZW50aW9uLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gbWVudGlvbmVkIG5hbWUuXG4gKiBAcGFyYW0ge3N0cmluZ30gdWlkIC0gbWVudGlvbmVkIHVzZXIgSUQuXG4gKlxuICogQHJldHVybnMge0RyYWZ0eX0gZG9jdW1lbnQgd2l0aCB0aGUgbWVudGlvbi5cbiAqL1xuRHJhZnR5Lm1lbnRpb24gPSBmdW5jdGlvbihuYW1lLCB1aWQpIHtcbiAgcmV0dXJuIHtcbiAgICB0eHQ6IG5hbWUgfHwgJycsXG4gICAgZm10OiBbe1xuICAgICAgYXQ6IDAsXG4gICAgICBsZW46IChuYW1lIHx8ICcnKS5sZW5ndGgsXG4gICAgICBrZXk6IDBcbiAgICB9XSxcbiAgICBlbnQ6IFt7XG4gICAgICB0cDogJ01OJyxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgdmFsOiB1aWRcbiAgICAgIH1cbiAgICB9XVxuICB9O1xufVxuXG4vKipcbiAqIEFwcGVuZCBhIGxpbmsgdG8gYSBEcmFmdHkgZG9jdW1lbnQuXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGNvbnRlbnQgLSBEcmFmdHkgZG9jdW1lbnQgdG8gYXBwZW5kIGxpbmsgdG8uXG4gKiBAcGFyYW0ge09iamVjdH0gbGlua0RhdGEgLSBMaW5rIGluZm8gaW4gZm9ybWF0IDxjb2RlPnt0eHQ6ICdhbmtvciB0ZXh0JywgdXJsOiAnaHR0cDovLy4uLid9PC9jb2RlPi5cbiAqXG4gKiBAcmV0dXJucyB7RHJhZnR5fSB0aGUgc2FtZSBkb2N1bWVudCBhcyA8Y29kZT5jb250ZW50PC9jb2RlPi5cbiAqL1xuRHJhZnR5LmFwcGVuZExpbmsgPSBmdW5jdGlvbihjb250ZW50LCBsaW5rRGF0YSkge1xuICBjb250ZW50ID0gY29udGVudCB8fCB7XG4gICAgdHh0OiAnJ1xuICB9O1xuXG4gIGNvbnRlbnQuZW50ID0gY29udGVudC5lbnQgfHwgW107XG4gIGNvbnRlbnQuZm10ID0gY29udGVudC5mbXQgfHwgW107XG5cbiAgY29udGVudC5mbXQucHVzaCh7XG4gICAgYXQ6IGNvbnRlbnQudHh0Lmxlbmd0aCxcbiAgICBsZW46IGxpbmtEYXRhLnR4dC5sZW5ndGgsXG4gICAga2V5OiBjb250ZW50LmVudC5sZW5ndGhcbiAgfSk7XG4gIGNvbnRlbnQudHh0ICs9IGxpbmtEYXRhLnR4dDtcblxuICBjb25zdCBleCA9IHtcbiAgICB0cDogJ0xOJyxcbiAgICBkYXRhOiB7XG4gICAgICB1cmw6IGxpbmtEYXRhLnVybFxuICAgIH1cbiAgfVxuICBjb250ZW50LmVudC5wdXNoKGV4KTtcblxuICByZXR1cm4gY29udGVudDtcbn1cblxuLyoqXG4gKiBBcHBlbmQgaW1hZ2UgdG8gRHJhZnR5IGRvY3VtZW50LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fSBjb250ZW50IC0gZG9jdW1lbnQgdG8gYWRkIGltYWdlIHRvLlxuICogQHBhcmFtIHtJbWFnZURlc2N9IGltYWdlRGVzYyAtIG9iamVjdCB3aXRoIGltYWdlIHBhcmFtZW5ldHMuXG4gKlxuICogQHJldHVybiB7RHJhZnR5fSB1cGRhdGVkIGRvY3VtZW50LlxuICovXG5EcmFmdHkuYXBwZW5kSW1hZ2UgPSBmdW5jdGlvbihjb250ZW50LCBpbWFnZURlc2MpIHtcbiAgY29udGVudCA9IGNvbnRlbnQgfHwge1xuICAgIHR4dDogJydcbiAgfTtcbiAgY29udGVudC50eHQgKz0gJyAnO1xuICByZXR1cm4gRHJhZnR5Lmluc2VydEltYWdlKGNvbnRlbnQsIGNvbnRlbnQudHh0Lmxlbmd0aCAtIDEsIGltYWdlRGVzYyk7XG59XG5cbi8qKlxuICogQXBwZW5kIGF1ZGlvIHJlY29kcmluZyB0byBEcmFmdHkgZG9jdW1lbnQuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGNvbnRlbnQgLSBkb2N1bWVudCB0byBhZGQgcmVjb3JkaW5nIHRvLlxuICogQHBhcmFtIHtBdWRpb0Rlc2N9IGF1ZGlvRGVzYyAtIG9iamVjdCB3aXRoIGF1ZGlvIGRhdGEuXG4gKlxuICogQHJldHVybiB7RHJhZnR5fSB1cGRhdGVkIGRvY3VtZW50LlxuICovXG5EcmFmdHkuYXBwZW5kQXVkaW8gPSBmdW5jdGlvbihjb250ZW50LCBhdWRpb0Rlc2MpIHtcbiAgY29udGVudCA9IGNvbnRlbnQgfHwge1xuICAgIHR4dDogJydcbiAgfTtcbiAgY29udGVudC50eHQgKz0gJyAnO1xuICByZXR1cm4gRHJhZnR5Lmluc2VydEF1ZGlvKGNvbnRlbnQsIGNvbnRlbnQudHh0Lmxlbmd0aCAtIDEsIGF1ZGlvRGVzYyk7XG59XG5cbi8qKlxuICogQHR5cGVkZWYgRHJhZnR5LkF0dGFjaG1lbnREZXNjXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAdHlwZSBPYmplY3RcbiAqIEBwYXJhbSB7c3RyaW5nfSBtaW1lIC0gbWltZS10eXBlIG9mIHRoZSBhdHRhY2htZW50LCBlLmcuIFwiYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtXCJcbiAqIEBwYXJhbSB7c3RyaW5nfSBkYXRhIC0gYmFzZTY0LWVuY29kZWQgaW4tYmFuZCBjb250ZW50IG9mIHNtYWxsIGF0dGFjaG1lbnRzLiBDb3VsZCBiZSBudWxsL3VuZGVmaW5lZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlbmFtZSAtIGZpbGUgbmFtZSBzdWdnZXN0aW9uIGZvciBkb3dubG9hZGluZyB0aGUgYXR0YWNobWVudC5cbiAqIEBwYXJhbSB7aW50ZWdlcn0gc2l6ZSAtIHNpemUgb2YgdGhlIGZpbGUgaW4gYnl0ZXMuIFRyZWF0IGlzIGFzIGFuIHVudHJ1c3RlZCBoaW50LlxuICogQHBhcmFtIHtzdHJpbmd9IHJlZnVybCAtIHJlZmVyZW5jZSB0byB0aGUgb3V0LW9mLWJhbmQgY29udGVudC4gQ291bGQgYmUgbnVsbC91bmRlZmluZWQuXG4gKiBAcGFyYW0ge1Byb21pc2V9IHVybFByb21pc2UgLSBQcm9taXNlIHdoaWNoIHJldHVybnMgY29udGVudCBVUkwgd2hlbiByZXNvbHZlZC5cbiAqL1xuXG4vKipcbiAqIEF0dGFjaCBmaWxlIHRvIERyYWZ0eSBjb250ZW50LiBFaXRoZXIgYXMgYSBibG9iIG9yIGFzIGEgcmVmZXJlbmNlLlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fSBjb250ZW50IC0gZG9jdW1lbnQgdG8gYXR0YWNoIGZpbGUgdG8uXG4gKiBAcGFyYW0ge0F0dGFjaG1lbnREZXNjfSBvYmplY3QgLSBjb250YWluaW5nIGF0dGFjaG1lbnQgZGVzY3JpcHRpb24gYW5kIGRhdGEuXG4gKlxuICogQHJldHVybiB7RHJhZnR5fSB1cGRhdGVkIGRvY3VtZW50LlxuICovXG5EcmFmdHkuYXR0YWNoRmlsZSA9IGZ1bmN0aW9uKGNvbnRlbnQsIGF0dGFjaG1lbnREZXNjKSB7XG4gIGNvbnRlbnQgPSBjb250ZW50IHx8IHtcbiAgICB0eHQ6ICcnXG4gIH07XG5cbiAgY29udGVudC5lbnQgPSBjb250ZW50LmVudCB8fCBbXTtcbiAgY29udGVudC5mbXQgPSBjb250ZW50LmZtdCB8fCBbXTtcblxuICBjb250ZW50LmZtdC5wdXNoKHtcbiAgICBhdDogLTEsXG4gICAgbGVuOiAwLFxuICAgIGtleTogY29udGVudC5lbnQubGVuZ3RoXG4gIH0pO1xuXG4gIGNvbnN0IGV4ID0ge1xuICAgIHRwOiAnRVgnLFxuICAgIGRhdGE6IHtcbiAgICAgIG1pbWU6IGF0dGFjaG1lbnREZXNjLm1pbWUsXG4gICAgICB2YWw6IGF0dGFjaG1lbnREZXNjLmRhdGEsXG4gICAgICBuYW1lOiBhdHRhY2htZW50RGVzYy5maWxlbmFtZSxcbiAgICAgIHJlZjogYXR0YWNobWVudERlc2MucmVmdXJsLFxuICAgICAgc2l6ZTogYXR0YWNobWVudERlc2Muc2l6ZSB8IDBcbiAgICB9XG4gIH1cbiAgaWYgKGF0dGFjaG1lbnREZXNjLnVybFByb21pc2UpIHtcbiAgICBleC5kYXRhLl9wcm9jZXNzaW5nID0gdHJ1ZTtcbiAgICBhdHRhY2htZW50RGVzYy51cmxQcm9taXNlLnRoZW4oXG4gICAgICAodXJsKSA9PiB7XG4gICAgICAgIGV4LmRhdGEucmVmID0gdXJsO1xuICAgICAgICBleC5kYXRhLl9wcm9jZXNzaW5nID0gdW5kZWZpbmVkO1xuICAgICAgfSxcbiAgICAgIChlcnIpID0+IHtcbiAgICAgICAgLyogY2F0Y2ggdGhlIGVycm9yLCBvdGhlcndpc2UgaXQgd2lsbCBhcHBlYXIgaW4gdGhlIGNvbnNvbGUuICovXG4gICAgICAgIGV4LmRhdGEuX3Byb2Nlc3NpbmcgPSB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgKTtcbiAgfVxuICBjb250ZW50LmVudC5wdXNoKGV4KTtcblxuICByZXR1cm4gY29udGVudDtcbn1cblxuLyoqXG4gKiBXcmFwcyBkcmFmdHkgZG9jdW1lbnQgaW50byBhIHNpbXBsZSBmb3JtYXR0aW5nIHN0eWxlLlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fHN0cmluZ30gY29udGVudCAtIGRvY3VtZW50IG9yIHN0cmluZyB0byB3cmFwIGludG8gYSBzdHlsZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHlsZSAtIHR3by1sZXR0ZXIgc3R5bGUgdG8gd3JhcCBpbnRvLlxuICogQHBhcmFtIHtudW1iZXJ9IGF0IC0gaW5kZXggd2hlcmUgdGhlIHN0eWxlIHN0YXJ0cywgZGVmYXVsdCAwLlxuICogQHBhcmFtIHtudW1iZXJ9IGxlbiAtIGxlbmd0aCBvZiB0aGUgZm9ybSBjb250ZW50LCBkZWZhdWx0IGFsbCBvZiBpdC5cbiAqXG4gKiBAcmV0dXJuIHtEcmFmdHl9IHVwZGF0ZWQgZG9jdW1lbnQuXG4gKi9cbkRyYWZ0eS53cmFwSW50byA9IGZ1bmN0aW9uKGNvbnRlbnQsIHN0eWxlLCBhdCwgbGVuKSB7XG4gIGlmICh0eXBlb2YgY29udGVudCA9PSAnc3RyaW5nJykge1xuICAgIGNvbnRlbnQgPSB7XG4gICAgICB0eHQ6IGNvbnRlbnRcbiAgICB9O1xuICB9XG4gIGNvbnRlbnQuZm10ID0gY29udGVudC5mbXQgfHwgW107XG5cbiAgY29udGVudC5mbXQucHVzaCh7XG4gICAgYXQ6IGF0IHx8IDAsXG4gICAgbGVuOiBsZW4gfHwgY29udGVudC50eHQubGVuZ3RoLFxuICAgIHRwOiBzdHlsZSxcbiAgfSk7XG5cbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cbi8qKlxuICogV3JhcHMgY29udGVudCBpbnRvIGFuIGludGVyYWN0aXZlIGZvcm0uXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl8c3RyaW5nfSBjb250ZW50IC0gdG8gd3JhcCBpbnRvIGEgZm9ybS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBhdCAtIGluZGV4IHdoZXJlIHRoZSBmb3JtcyBzdGFydHMuXG4gKiBAcGFyYW0ge251bWJlcn0gbGVuIC0gbGVuZ3RoIG9mIHRoZSBmb3JtIGNvbnRlbnQuXG4gKlxuICogQHJldHVybiB7RHJhZnR5fSB1cGRhdGVkIGRvY3VtZW50LlxuICovXG5EcmFmdHkud3JhcEFzRm9ybSA9IGZ1bmN0aW9uKGNvbnRlbnQsIGF0LCBsZW4pIHtcbiAgcmV0dXJuIERyYWZ0eS53cmFwSW50byhjb250ZW50LCAnRk0nLCBhdCwgbGVuKTtcbn1cblxuLyoqXG4gKiBJbnNlcnQgY2xpY2thYmxlIGJ1dHRvbiBpbnRvIERyYWZ0eSBkb2N1bWVudC5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eXxzdHJpbmd9IGNvbnRlbnQgLSBEcmFmdHkgZG9jdW1lbnQgdG8gaW5zZXJ0IGJ1dHRvbiB0byBvciBhIHN0cmluZyB0byBiZSB1c2VkIGFzIGJ1dHRvbiB0ZXh0LlxuICogQHBhcmFtIHtudW1iZXJ9IGF0IC0gbG9jYXRpb24gd2hlcmUgdGhlIGJ1dHRvbiBpcyBpbnNlcnRlZC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBsZW4gLSB0aGUgbGVuZ3RoIG9mIHRoZSB0ZXh0IHRvIGJlIHVzZWQgYXMgYnV0dG9uIHRpdGxlLlxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSB0aGUgYnV0dG9uLiBDbGllbnQgc2hvdWxkIHJldHVybiBpdCB0byB0aGUgc2VydmVyIHdoZW4gdGhlIGJ1dHRvbiBpcyBjbGlja2VkLlxuICogQHBhcmFtIHtzdHJpbmd9IGFjdGlvblR5cGUgLSB0aGUgdHlwZSBvZiB0aGUgYnV0dG9uLCBvbmUgb2YgJ3VybCcgb3IgJ3B1YicuXG4gKiBAcGFyYW0ge3N0cmluZ30gYWN0aW9uVmFsdWUgLSB0aGUgdmFsdWUgdG8gcmV0dXJuIG9uIGNsaWNrOlxuICogQHBhcmFtIHtzdHJpbmd9IHJlZlVybCAtIHRoZSBVUkwgdG8gZ28gdG8gd2hlbiB0aGUgJ3VybCcgYnV0dG9uIGlzIGNsaWNrZWQuXG4gKlxuICogQHJldHVybiB7RHJhZnR5fSB1cGRhdGVkIGRvY3VtZW50LlxuICovXG5EcmFmdHkuaW5zZXJ0QnV0dG9uID0gZnVuY3Rpb24oY29udGVudCwgYXQsIGxlbiwgbmFtZSwgYWN0aW9uVHlwZSwgYWN0aW9uVmFsdWUsIHJlZlVybCkge1xuICBpZiAodHlwZW9mIGNvbnRlbnQgPT0gJ3N0cmluZycpIHtcbiAgICBjb250ZW50ID0ge1xuICAgICAgdHh0OiBjb250ZW50XG4gICAgfTtcbiAgfVxuXG4gIGlmICghY29udGVudCB8fCAhY29udGVudC50eHQgfHwgY29udGVudC50eHQubGVuZ3RoIDwgYXQgKyBsZW4pIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGlmIChsZW4gPD0gMCB8fCBbJ3VybCcsICdwdWInXS5pbmRleE9mKGFjdGlvblR5cGUpID09IC0xKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgLy8gRW5zdXJlIHJlZlVybCBpcyBhIHN0cmluZy5cbiAgaWYgKGFjdGlvblR5cGUgPT0gJ3VybCcgJiYgIXJlZlVybCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHJlZlVybCA9ICcnICsgcmVmVXJsO1xuXG4gIGNvbnRlbnQuZW50ID0gY29udGVudC5lbnQgfHwgW107XG4gIGNvbnRlbnQuZm10ID0gY29udGVudC5mbXQgfHwgW107XG5cbiAgY29udGVudC5mbXQucHVzaCh7XG4gICAgYXQ6IGF0IHwgMCxcbiAgICBsZW46IGxlbixcbiAgICBrZXk6IGNvbnRlbnQuZW50Lmxlbmd0aFxuICB9KTtcbiAgY29udGVudC5lbnQucHVzaCh7XG4gICAgdHA6ICdCTicsXG4gICAgZGF0YToge1xuICAgICAgYWN0OiBhY3Rpb25UeXBlLFxuICAgICAgdmFsOiBhY3Rpb25WYWx1ZSxcbiAgICAgIHJlZjogcmVmVXJsLFxuICAgICAgbmFtZTogbmFtZVxuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cbi8qKlxuICogQXBwZW5kIGNsaWNrYWJsZSBidXR0b24gdG8gRHJhZnR5IGRvY3VtZW50LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fHN0cmluZ30gY29udGVudCAtIERyYWZ0eSBkb2N1bWVudCB0byBpbnNlcnQgYnV0dG9uIHRvIG9yIGEgc3RyaW5nIHRvIGJlIHVzZWQgYXMgYnV0dG9uIHRleHQuXG4gKiBAcGFyYW0ge3N0cmluZ30gdGl0bGUgLSB0aGUgdGV4dCB0byBiZSB1c2VkIGFzIGJ1dHRvbiB0aXRsZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gdGhlIGJ1dHRvbi4gQ2xpZW50IHNob3VsZCByZXR1cm4gaXQgdG8gdGhlIHNlcnZlciB3aGVuIHRoZSBidXR0b24gaXMgY2xpY2tlZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBhY3Rpb25UeXBlIC0gdGhlIHR5cGUgb2YgdGhlIGJ1dHRvbiwgb25lIG9mICd1cmwnIG9yICdwdWInLlxuICogQHBhcmFtIHtzdHJpbmd9IGFjdGlvblZhbHVlIC0gdGhlIHZhbHVlIHRvIHJldHVybiBvbiBjbGljazpcbiAqIEBwYXJhbSB7c3RyaW5nfSByZWZVcmwgLSB0aGUgVVJMIHRvIGdvIHRvIHdoZW4gdGhlICd1cmwnIGJ1dHRvbiBpcyBjbGlja2VkLlxuICpcbiAqIEByZXR1cm4ge0RyYWZ0eX0gdXBkYXRlZCBkb2N1bWVudC5cbiAqL1xuRHJhZnR5LmFwcGVuZEJ1dHRvbiA9IGZ1bmN0aW9uKGNvbnRlbnQsIHRpdGxlLCBuYW1lLCBhY3Rpb25UeXBlLCBhY3Rpb25WYWx1ZSwgcmVmVXJsKSB7XG4gIGNvbnRlbnQgPSBjb250ZW50IHx8IHtcbiAgICB0eHQ6ICcnXG4gIH07XG4gIGNvbnN0IGF0ID0gY29udGVudC50eHQubGVuZ3RoO1xuICBjb250ZW50LnR4dCArPSB0aXRsZTtcbiAgcmV0dXJuIERyYWZ0eS5pbnNlcnRCdXR0b24oY29udGVudCwgYXQsIHRpdGxlLmxlbmd0aCwgbmFtZSwgYWN0aW9uVHlwZSwgYWN0aW9uVmFsdWUsIHJlZlVybCk7XG59XG5cbi8qKlxuICogQXR0YWNoIGEgZ2VuZXJpYyBKUyBvYmplY3QuIFRoZSBvYmplY3QgaXMgYXR0YWNoZWQgYXMgYSBqc29uIHN0cmluZy5cbiAqIEludGVuZGVkIGZvciByZXByZXNlbnRpbmcgYSBmb3JtIHJlc3BvbnNlLlxuICpcbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eX0gY29udGVudCAtIERyYWZ0eSBkb2N1bWVudCB0byBhdHRhY2ggZmlsZSB0by5cbiAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIC0gZGF0YSB0byBjb252ZXJ0IHRvIGpzb24gc3RyaW5nIGFuZCBhdHRhY2guXG4gKiBAcmV0dXJucyB7RHJhZnR5fSB0aGUgc2FtZSBkb2N1bWVudCBhcyA8Y29kZT5jb250ZW50PC9jb2RlPi5cbiAqL1xuRHJhZnR5LmF0dGFjaEpTT04gPSBmdW5jdGlvbihjb250ZW50LCBkYXRhKSB7XG4gIGNvbnRlbnQgPSBjb250ZW50IHx8IHtcbiAgICB0eHQ6ICcnXG4gIH07XG4gIGNvbnRlbnQuZW50ID0gY29udGVudC5lbnQgfHwgW107XG4gIGNvbnRlbnQuZm10ID0gY29udGVudC5mbXQgfHwgW107XG5cbiAgY29udGVudC5mbXQucHVzaCh7XG4gICAgYXQ6IC0xLFxuICAgIGxlbjogMCxcbiAgICBrZXk6IGNvbnRlbnQuZW50Lmxlbmd0aFxuICB9KTtcblxuICBjb250ZW50LmVudC5wdXNoKHtcbiAgICB0cDogJ0VYJyxcbiAgICBkYXRhOiB7XG4gICAgICBtaW1lOiBKU09OX01JTUVfVFlQRSxcbiAgICAgIHZhbDogZGF0YVxuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG4vKipcbiAqIEFwcGVuZCBsaW5lIGJyZWFrIHRvIGEgRHJhZnR5IGRvY3VtZW50LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fSBjb250ZW50IC0gRHJhZnR5IGRvY3VtZW50IHRvIGFwcGVuZCBsaW5lYnJlYWsgdG8uXG4gKiBAcmV0dXJucyB7RHJhZnR5fSB0aGUgc2FtZSBkb2N1bWVudCBhcyA8Y29kZT5jb250ZW50PC9jb2RlPi5cbiAqL1xuRHJhZnR5LmFwcGVuZExpbmVCcmVhayA9IGZ1bmN0aW9uKGNvbnRlbnQpIHtcbiAgY29udGVudCA9IGNvbnRlbnQgfHwge1xuICAgIHR4dDogJydcbiAgfTtcbiAgY29udGVudC5mbXQgPSBjb250ZW50LmZtdCB8fCBbXTtcbiAgY29udGVudC5mbXQucHVzaCh7XG4gICAgYXQ6IGNvbnRlbnQudHh0Lmxlbmd0aCxcbiAgICBsZW46IDEsXG4gICAgdHA6ICdCUidcbiAgfSk7XG4gIGNvbnRlbnQudHh0ICs9ICcgJztcblxuICByZXR1cm4gY29udGVudDtcbn1cbi8qKlxuICogR2l2ZW4gRHJhZnR5IGRvY3VtZW50LCBjb252ZXJ0IGl0IHRvIEhUTUwuXG4gKiBObyBhdHRlbXB0IGlzIG1hZGUgdG8gc3RyaXAgcHJlLWV4aXN0aW5nIGh0bWwgbWFya3VwLlxuICogVGhpcyBpcyBwb3RlbnRpYWxseSB1bnNhZmUgYmVjYXVzZSA8Y29kZT5jb250ZW50LnR4dDwvY29kZT4gbWF5IGNvbnRhaW4gbWFsaWNpb3VzIEhUTUxcbiAqIG1hcmt1cC5cbiAqIEBtZW1iZXJvZiBUaW5vZGUuRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGRvYyAtIGRvY3VtZW50IHRvIGNvbnZlcnQuXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gSFRNTC1yZXByZXNlbnRhdGlvbiBvZiBjb250ZW50LlxuICovXG5EcmFmdHkuVU5TQUZFX3RvSFRNTCA9IGZ1bmN0aW9uKGRvYykge1xuICBsZXQgdHJlZSA9IGRyYWZ0eVRvVHJlZShkb2MpO1xuICBjb25zdCBodG1sRm9ybWF0dGVyID0gZnVuY3Rpb24odHlwZSwgZGF0YSwgdmFsdWVzKSB7XG4gICAgY29uc3QgdGFnID0gREVDT1JBVE9SU1t0eXBlXTtcbiAgICBsZXQgcmVzdWx0ID0gdmFsdWVzID8gdmFsdWVzLmpvaW4oJycpIDogJyc7XG4gICAgaWYgKHRhZykge1xuICAgICAgcmVzdWx0ID0gdGFnLm9wZW4oZGF0YSkgKyByZXN1bHQgKyB0YWcuY2xvc2UoZGF0YSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG4gIHJldHVybiB0cmVlQm90dG9tVXAodHJlZSwgaHRtbEZvcm1hdHRlciwgMCk7XG59XG5cbi8qKlxuICogQ2FsbGJhY2sgZm9yIGFwcGx5aW5nIGN1c3RvbSBmb3JtYXR0aW5nIHRvIGEgRHJhZnR5IGRvY3VtZW50LlxuICogQ2FsbGVkIG9uY2UgZm9yIGVhY2ggc3R5bGUgc3Bhbi5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAY2FsbGJhY2sgRm9ybWF0dGVyXG4gKiBAcGFyYW0ge3N0cmluZ30gc3R5bGUgLSBzdHlsZSBjb2RlIHN1Y2ggYXMgXCJTVFwiIG9yIFwiSU1cIi5cbiAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIC0gZW50aXR5J3MgZGF0YS5cbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWx1ZXMgLSBwb3NzaWJseSBzdHlsZWQgc3Vic3BhbnMgY29udGFpbmVkIGluIHRoaXMgc3R5bGUgc3Bhbi5cbiAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCAtIGluZGV4IG9mIHRoZSBlbGVtZW50IGd1YXJhbnRlZWQgdG8gYmUgdW5pcXVlLlxuICovXG5cbi8qKlxuICogQ29udmVydCBEcmFmdHkgZG9jdW1lbnQgdG8gYSByZXByZXNlbnRhdGlvbiBzdWl0YWJsZSBmb3IgZGlzcGxheS5cbiAqIFRoZSA8Y29kZT5jb250ZXh0PC9jb2RlPiBtYXkgZXhwb3NlIGEgZnVuY3Rpb24gPGNvZGU+Z2V0Rm9ybWF0dGVyKHN0eWxlKTwvY29kZT4uIElmIGl0J3MgYXZhaWxhYmxlXG4gKiBpdCB3aWxsIGNhbGwgaXQgdG8gb2J0YWluIGEgPGNvZGU+Zm9ybWF0dGVyPC9jb2RlPiBmb3IgYSBzdWJ0cmVlIG9mIHN0eWxlcyB1bmRlciB0aGUgPGNvZGU+c3R5bGU8L2NvZGU+LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fE9iamVjdH0gY29udGVudCAtIERyYWZ0eSBkb2N1bWVudCB0byB0cmFuc2Zvcm0uXG4gKiBAcGFyYW0ge0Zvcm1hdHRlcn0gZm9ybWF0dGVyIC0gY2FsbGJhY2sgd2hpY2ggZm9ybWF0cyBpbmRpdmlkdWFsIGVsZW1lbnRzLlxuICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHQgLSBjb250ZXh0IHByb3ZpZGVkIHRvIGZvcm1hdHRlciBhcyA8Y29kZT50aGlzPC9jb2RlPi5cbiAqXG4gKiBAcmV0dXJuIHtPYmplY3R9IHRyYW5zZm9ybWVkIG9iamVjdFxuICovXG5EcmFmdHkuZm9ybWF0ID0gZnVuY3Rpb24ob3JpZ2luYWwsIGZvcm1hdHRlciwgY29udGV4dCkge1xuICByZXR1cm4gdHJlZUJvdHRvbVVwKGRyYWZ0eVRvVHJlZShvcmlnaW5hbCksIGZvcm1hdHRlciwgMCwgW10sIGNvbnRleHQpO1xufVxuXG4vKipcbiAqIFNob3J0ZW4gRHJhZnR5IGRvY3VtZW50IG1ha2luZyB0aGUgZHJhZnR5IHRleHQgbm8gbG9uZ2VyIHRoYW4gdGhlIGxpbWl0LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fHN0cmluZ30gb3JpZ2luYWwgLSBEcmFmdHkgb2JqZWN0IHRvIHNob3J0ZW4uXG4gKiBAcGFyYW0ge251bWJlcn0gbGltaXQgLSBsZW5ndGggaW4gY2hhcmFjcmV0cyB0byBzaG9ydGVuIHRvLlxuICogQHBhcmFtIHtib29sZWFufSBsaWdodCAtIHJlbW92ZSBoZWF2eSBkYXRhIGZyb20gZW50aXRpZXMuXG4gKiBAcmV0dXJucyBuZXcgc2hvcnRlbmVkIERyYWZ0eSBvYmplY3QgbGVhdmluZyB0aGUgb3JpZ2luYWwgaW50YWN0LlxuICovXG5EcmFmdHkuc2hvcnRlbiA9IGZ1bmN0aW9uKG9yaWdpbmFsLCBsaW1pdCwgbGlnaHQpIHtcbiAgbGV0IHRyZWUgPSBkcmFmdHlUb1RyZWUob3JpZ2luYWwpO1xuICB0cmVlID0gc2hvcnRlblRyZWUodHJlZSwgbGltaXQsICfigKYnKTtcbiAgaWYgKHRyZWUgJiYgbGlnaHQpIHtcbiAgICB0cmVlID0gbGlnaHRFbnRpdHkodHJlZSk7XG4gIH1cbiAgcmV0dXJuIHRyZWVUb0RyYWZ0eSh7fSwgdHJlZSwgW10pO1xufVxuXG4vKipcbiAqIFRyYW5zZm9ybSBEcmFmdHkgZG9jIGZvciBmb3J3YXJkaW5nOiBzdHJpcCBsZWFkaW5nIEBtZW50aW9uIGFuZCBhbnkgbGVhZGluZyBsaW5lIGJyZWFrcyBvciB3aGl0ZXNwYWNlLlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fHN0cmluZ30gb3JpZ2luYWwgLSBEcmFmdHkgb2JqZWN0IHRvIHNob3J0ZW4uXG4gKiBAcmV0dXJucyBjb252ZXJ0ZWQgRHJhZnR5IG9iamVjdCBsZWF2aW5nIHRoZSBvcmlnaW5hbCBpbnRhY3QuXG4gKi9cbkRyYWZ0eS5mb3J3YXJkZWRDb250ZW50ID0gZnVuY3Rpb24ob3JpZ2luYWwpIHtcbiAgbGV0IHRyZWUgPSBkcmFmdHlUb1RyZWUob3JpZ2luYWwpO1xuICBjb25zdCBybU1lbnRpb24gPSBmdW5jdGlvbihub2RlKSB7XG4gICAgaWYgKG5vZGUudHlwZSA9PSAnTU4nKSB7XG4gICAgICBpZiAoIW5vZGUucGFyZW50IHx8ICFub2RlLnBhcmVudC50eXBlKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuICAvLyBTdHJpcCBsZWFkaW5nIG1lbnRpb24uXG4gIHRyZWUgPSB0cmVlVG9wRG93bih0cmVlLCBybU1lbnRpb24pO1xuICAvLyBSZW1vdmUgbGVhZGluZyB3aGl0ZXNwYWNlLlxuICB0cmVlID0gbFRyaW0odHJlZSk7XG4gIC8vIENvbnZlcnQgYmFjayB0byBEcmFmdHkuXG4gIHJldHVybiB0cmVlVG9EcmFmdHkoe30sIHRyZWUsIFtdKTtcbn1cblxuLyoqXG4gKiBQcmVwYXJlIERyYWZ0eSBkb2MgZm9yIHdyYXBwaW5nIGludG8gUVEgYXMgYSByZXBseTpcbiAqICAtIFJlcGxhY2UgZm9yd2FyZGluZyBtZW50aW9uIHdpdGggc3ltYm9sICfinqYnIGFuZCByZW1vdmUgZGF0YSAoVUlEKS5cbiAqICAtIFJlbW92ZSBxdW90ZWQgdGV4dCBjb21wbGV0ZWx5LlxuICogIC0gUmVwbGFjZSBsaW5lIGJyZWFrcyB3aXRoIHNwYWNlcy5cbiAqICAtIFN0cmlwIGVudGl0aWVzIG9mIGhlYXZ5IGNvbnRlbnQuXG4gKiAgLSBNb3ZlIGF0dGFjaG1lbnRzIHRvIHRoZSBlbmQgb2YgdGhlIGRvY3VtZW50LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fHN0cmluZ30gb3JpZ2luYWwgLSBEcmFmdHkgb2JqZWN0IHRvIHNob3J0ZW4uXG4gKiBAcGFyYW0ge251bWJlcn0gbGltaXQgLSBsZW5ndGggaW4gY2hhcmFjdGVycyB0byBzaG9ydGVuIHRvLlxuICogQHJldHVybnMgY29udmVydGVkIERyYWZ0eSBvYmplY3QgbGVhdmluZyB0aGUgb3JpZ2luYWwgaW50YWN0LlxuICovXG5EcmFmdHkucmVwbHlDb250ZW50ID0gZnVuY3Rpb24ob3JpZ2luYWwsIGxpbWl0KSB7XG4gIGNvbnN0IGNvbnZNTm5RUW5CUiA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICBpZiAobm9kZS50eXBlID09ICdRUScpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0gZWxzZSBpZiAobm9kZS50eXBlID09ICdNTicpIHtcbiAgICAgIGlmICgoIW5vZGUucGFyZW50IHx8ICFub2RlLnBhcmVudC50eXBlKSAmJiAobm9kZS50ZXh0IHx8ICcnKS5zdGFydHNXaXRoKCfinqYnKSkge1xuICAgICAgICBub2RlLnRleHQgPSAn4p6mJztcbiAgICAgICAgZGVsZXRlIG5vZGUuY2hpbGRyZW47XG4gICAgICAgIGRlbGV0ZSBub2RlLmRhdGE7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChub2RlLnR5cGUgPT0gJ0JSJykge1xuICAgICAgbm9kZS50ZXh0ID0gJyAnO1xuICAgICAgZGVsZXRlIG5vZGUudHlwZTtcbiAgICAgIGRlbGV0ZSBub2RlLmNoaWxkcmVuO1xuICAgIH1cbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuXG4gIGxldCB0cmVlID0gZHJhZnR5VG9UcmVlKG9yaWdpbmFsKTtcbiAgaWYgKCF0cmVlKSB7XG4gICAgcmV0dXJuIG9yaWdpbmFsO1xuICB9XG5cbiAgLy8gU3RyaXAgbGVhZGluZyBtZW50aW9uLlxuICB0cmVlID0gdHJlZVRvcERvd24odHJlZSwgY29udk1OblFRbkJSKTtcbiAgLy8gTW92ZSBhdHRhY2htZW50cyB0byB0aGUgZW5kIG9mIHRoZSBkb2MuXG4gIHRyZWUgPSBhdHRhY2htZW50c1RvRW5kKHRyZWUsIE1BWF9QUkVWSUVXX0FUVEFDSE1FTlRTKTtcbiAgLy8gU2hvcnRlbiB0aGUgZG9jLlxuICB0cmVlID0gc2hvcnRlblRyZWUodHJlZSwgbGltaXQsICfigKYnKTtcbiAgLy8gU3RyaXAgaGVhdnkgZWxlbWVudHMgZXhjZXB0IElNLmRhdGFbJ3ZhbCddIChoYXZlIHRvIGtlZXAgdGhlbSB0byBnZW5lcmF0ZSBwcmV2aWV3cyBsYXRlcikuXG4gIHRyZWUgPSBsaWdodEVudGl0eSh0cmVlLCBub2RlID0+IChub2RlLnR5cGUgPT0gJ0lNJyA/IFsndmFsJ10gOiBudWxsKSk7XG4gIC8vIENvbnZlcnQgYmFjayB0byBEcmFmdHkuXG4gIHJldHVybiB0cmVlVG9EcmFmdHkoe30sIHRyZWUsIFtdKTtcbn1cblxuXG4vKipcbiAqIEdlbmVyYXRlIGRyYWZ0eSBwcmV2aWV3OlxuICogIC0gU2hvcnRlbiB0aGUgZG9jdW1lbnQuXG4gKiAgLSBTdHJpcCBhbGwgaGVhdnkgZW50aXR5IGRhdGEgbGVhdmluZyBqdXN0IGlubGluZSBzdHlsZXMgYW5kIGVudGl0eSByZWZlcmVuY2VzLlxuICogIC0gUmVwbGFjZSBsaW5lIGJyZWFrcyB3aXRoIHNwYWNlcy5cbiAqICAtIFJlcGxhY2UgY29udGVudCBvZiBRUSB3aXRoIGEgc3BhY2UuXG4gKiAgLSBSZXBsYWNlIGZvcndhcmRpbmcgbWVudGlvbiB3aXRoIHN5bWJvbCAn4p6mJy5cbiAqIG1vdmUgYWxsIGF0dGFjaG1lbnRzIHRvIHRoZSBlbmQgb2YgdGhlIGRvY3VtZW50IGFuZCBtYWtlIHRoZW0gdmlzaWJsZS5cbiAqIFRoZSA8Y29kZT5jb250ZXh0PC9jb2RlPiBtYXkgZXhwb3NlIGEgZnVuY3Rpb24gPGNvZGU+Z2V0Rm9ybWF0dGVyKHN0eWxlKTwvY29kZT4uIElmIGl0J3MgYXZhaWxhYmxlXG4gKiBpdCB3aWxsIGNhbGwgaXQgdG8gb2J0YWluIGEgPGNvZGU+Zm9ybWF0dGVyPC9jb2RlPiBmb3IgYSBzdWJ0cmVlIG9mIHN0eWxlcyB1bmRlciB0aGUgPGNvZGU+c3R5bGU8L2NvZGU+LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fHN0cmluZ30gb3JpZ2luYWwgLSBEcmFmdHkgb2JqZWN0IHRvIHNob3J0ZW4uXG4gKiBAcGFyYW0ge251bWJlcn0gbGltaXQgLSBsZW5ndGggaW4gY2hhcmFjdGVycyB0byBzaG9ydGVuIHRvLlxuICogQHBhcmFtIHtib29sZWFufSBmb3J3YXJkaW5nIC0gdGhpcyBhIGZvcndhcmRpbmcgbWVzc2FnZSBwcmV2aWV3LlxuICogQHJldHVybnMgbmV3IHNob3J0ZW5lZCBEcmFmdHkgb2JqZWN0IGxlYXZpbmcgdGhlIG9yaWdpbmFsIGludGFjdC5cbiAqL1xuRHJhZnR5LnByZXZpZXcgPSBmdW5jdGlvbihvcmlnaW5hbCwgbGltaXQsIGZvcndhcmRpbmcpIHtcbiAgbGV0IHRyZWUgPSBkcmFmdHlUb1RyZWUob3JpZ2luYWwpO1xuXG4gIC8vIE1vdmUgYXR0YWNobWVudHMgdG8gdGhlIGVuZC5cbiAgdHJlZSA9IGF0dGFjaG1lbnRzVG9FbmQodHJlZSwgTUFYX1BSRVZJRVdfQVRUQUNITUVOVFMpO1xuXG4gIC8vIENvbnZlcnQgbGVhZGluZyBtZW50aW9uIHRvICfinqYnIGFuZCByZXBsYWNlIFFRIGFuZCBCUiB3aXRoIGEgc3BhY2UgJyAnLlxuICBjb25zdCBjb252TU5uUVFuQlIgPSBmdW5jdGlvbihub2RlKSB7XG4gICAgaWYgKG5vZGUudHlwZSA9PSAnTU4nKSB7XG4gICAgICBpZiAoKCFub2RlLnBhcmVudCB8fCAhbm9kZS5wYXJlbnQudHlwZSkgJiYgKG5vZGUudGV4dCB8fCAnJykuc3RhcnRzV2l0aCgn4p6mJykpIHtcbiAgICAgICAgbm9kZS50ZXh0ID0gJ+Kepic7XG4gICAgICAgIGRlbGV0ZSBub2RlLmNoaWxkcmVuO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAobm9kZS50eXBlID09ICdRUScpIHtcbiAgICAgIG5vZGUudGV4dCA9ICcgJztcbiAgICAgIGRlbGV0ZSBub2RlLmNoaWxkcmVuO1xuICAgIH0gZWxzZSBpZiAobm9kZS50eXBlID09ICdCUicpIHtcbiAgICAgIG5vZGUudGV4dCA9ICcgJztcbiAgICAgIGRlbGV0ZSBub2RlLmNoaWxkcmVuO1xuICAgICAgZGVsZXRlIG5vZGUudHlwZTtcbiAgICB9XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cbiAgdHJlZSA9IHRyZWVUb3BEb3duKHRyZWUsIGNvbnZNTm5RUW5CUik7XG5cbiAgdHJlZSA9IHNob3J0ZW5UcmVlKHRyZWUsIGxpbWl0LCAn4oCmJyk7XG4gIGlmIChmb3J3YXJkaW5nKSB7XG4gICAgLy8gS2VlcCBJTSBkYXRhIGZvciBwcmV2aWV3LlxuICAgIHRyZWUgPSBsaWdodEVudGl0eSh0cmVlLCBub2RlID0+IChub2RlLnR5cGUgPT0gJ0lNJyA/IFsndmFsJ10gOiBudWxsKSk7XG4gIH0gZWxzZSB7XG4gICAgdHJlZSA9IGxpZ2h0RW50aXR5KHRyZWUpO1xuICB9XG5cbiAgLy8gQ29udmVydCBiYWNrIHRvIERyYWZ0eS5cbiAgcmV0dXJuIHRyZWVUb0RyYWZ0eSh7fSwgdHJlZSwgW10pO1xufVxuXG4vKipcbiAqIEdpdmVuIERyYWZ0eSBkb2N1bWVudCwgY29udmVydCBpdCB0byBwbGFpbiB0ZXh0LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fSBjb250ZW50IC0gZG9jdW1lbnQgdG8gY29udmVydCB0byBwbGFpbiB0ZXh0LlxuICogQHJldHVybnMge3N0cmluZ30gcGxhaW4tdGV4dCByZXByZXNlbnRhdGlvbiBvZiB0aGUgZHJhZnR5IGRvY3VtZW50LlxuICovXG5EcmFmdHkudG9QbGFpblRleHQgPSBmdW5jdGlvbihjb250ZW50KSB7XG4gIHJldHVybiB0eXBlb2YgY29udGVudCA9PSAnc3RyaW5nJyA/IGNvbnRlbnQgOiBjb250ZW50LnR4dDtcbn1cblxuLyoqXG4gKiBDaGVjayBpZiB0aGUgZG9jdW1lbnQgaGFzIG5vIG1hcmt1cCBhbmQgbm8gZW50aXRpZXMuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGNvbnRlbnQgLSBjb250ZW50IHRvIGNoZWNrIGZvciBwcmVzZW5jZSBvZiBtYXJrdXAuXG4gKiBAcmV0dXJucyA8Y29kZT50cnVlPC9jb2RlPiBpcyBjb250ZW50IGlzIHBsYWluIHRleHQsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gKi9cbkRyYWZ0eS5pc1BsYWluVGV4dCA9IGZ1bmN0aW9uKGNvbnRlbnQpIHtcbiAgcmV0dXJuIHR5cGVvZiBjb250ZW50ID09ICdzdHJpbmcnIHx8ICEoY29udGVudC5mbXQgfHwgY29udGVudC5lbnQpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiB0aGUgb2JqZWN0IHJlcHJlc2V0cyBpcyBhIHZhbGlkIERyYWZ0eSBkb2N1bWVudC5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eX0gY29udGVudCAtIGNvbnRlbnQgdG8gY2hlY2sgZm9yIHZhbGlkaXR5LlxuICogQHJldHVybnMgPGNvZGU+dHJ1ZTwvY29kZT4gaXMgY29udGVudCBpcyB2YWxpZCwgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAqL1xuRHJhZnR5LmlzVmFsaWQgPSBmdW5jdGlvbihjb250ZW50KSB7XG4gIGlmICghY29udGVudCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IHtcbiAgICB0eHQsXG4gICAgZm10LFxuICAgIGVudFxuICB9ID0gY29udGVudDtcblxuICBpZiAoIXR4dCAmJiB0eHQgIT09ICcnICYmICFmbXQgJiYgIWVudCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IHR4dF90eXBlID0gdHlwZW9mIHR4dDtcbiAgaWYgKHR4dF90eXBlICE9ICdzdHJpbmcnICYmIHR4dF90eXBlICE9ICd1bmRlZmluZWQnICYmIHR4dCAhPT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgZm10ICE9ICd1bmRlZmluZWQnICYmICFBcnJheS5pc0FycmF5KGZtdCkgJiYgZm10ICE9PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBlbnQgIT0gJ3VuZGVmaW5lZCcgJiYgIUFycmF5LmlzQXJyYXkoZW50KSAmJiBlbnQgIT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8qKlxuICogQ2hlY2sgaWYgdGhlIGRyYWZ0eSBkb2N1bWVudCBoYXMgYXR0YWNobWVudHM6IHN0eWxlIEVYIGFuZCBvdXRzaWRlIG9mIG5vcm1hbCByZW5kZXJpbmcgZmxvdyxcbiAqIGkuZS4gPGNvZGU+YXQgPSAtMTwvY29kZT4uXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGNvbnRlbnQgLSBkb2N1bWVudCB0byBjaGVjayBmb3IgYXR0YWNobWVudHMuXG4gKiBAcmV0dXJucyA8Y29kZT50cnVlPC9jb2RlPiBpZiB0aGVyZSBhcmUgYXR0YWNobWVudHMuXG4gKi9cbkRyYWZ0eS5oYXNBdHRhY2htZW50cyA9IGZ1bmN0aW9uKGNvbnRlbnQpIHtcbiAgaWYgKCFBcnJheS5pc0FycmF5KGNvbnRlbnQuZm10KSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBmb3IgKGxldCBpIGluIGNvbnRlbnQuZm10KSB7XG4gICAgY29uc3QgZm10ID0gY29udGVudC5mbXRbaV07XG4gICAgaWYgKGZtdCAmJiBmbXQuYXQgPCAwKSB7XG4gICAgICBjb25zdCBlbnQgPSBjb250ZW50LmVudFtmbXQua2V5IHwgMF07XG4gICAgICByZXR1cm4gZW50ICYmIGVudC50cCA9PSAnRVgnICYmIGVudC5kYXRhO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogQ2FsbGJhY2sgZm9yIGFwcGx5aW5nIGN1c3RvbSBmb3JtYXR0aW5nL3RyYW5zZm9ybWF0aW9uIHRvIGEgRHJhZnR5IGRvY3VtZW50LlxuICogQ2FsbGVkIG9uY2UgZm9yIGVhY2ggZW50aXR5LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBjYWxsYmFjayBFbnRpdHlDYWxsYmFja1xuICogQHBhcmFtIHtPYmplY3R9IGRhdGEgZW50aXR5IGRhdGEuXG4gKiBAcGFyYW0ge3N0cmluZ30gZW50aXR5IHR5cGUuXG4gKiBAcGFyYW0ge251bWJlcn0gaW5kZXggZW50aXR5J3MgaW5kZXggaW4gYGNvbnRlbnQuZW50YC5cbiAqL1xuXG4vKipcbiAqIEVudW1lcmF0ZSBhdHRhY2htZW50czogc3R5bGUgRVggYW5kIG91dHNpZGUgb2Ygbm9ybWFsIHJlbmRlcmluZyBmbG93LCBpLmUuIDxjb2RlPmF0ID0gLTE8L2NvZGU+LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fSBjb250ZW50IC0gZG9jdW1lbnQgdG8gcHJvY2VzcyBmb3IgYXR0YWNobWVudHMuXG4gKiBAcGFyYW0ge0VudGl0eUNhbGxiYWNrfSBjYWxsYmFjayAtIGNhbGxiYWNrIHRvIGNhbGwgZm9yIGVhY2ggYXR0YWNobWVudC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZXh0IC0gdmFsdWUgb2YgXCJ0aGlzXCIgZm9yIGNhbGxiYWNrLlxuICovXG5EcmFmdHkuYXR0YWNobWVudHMgPSBmdW5jdGlvbihjb250ZW50LCBjYWxsYmFjaywgY29udGV4dCkge1xuICBpZiAoIUFycmF5LmlzQXJyYXkoY29udGVudC5mbXQpKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGxldCBpID0gMDtcbiAgY29udGVudC5mbXQuZm9yRWFjaChmbXQgPT4ge1xuICAgIGlmIChmbXQgJiYgZm10LmF0IDwgMCkge1xuICAgICAgY29uc3QgZW50ID0gY29udGVudC5lbnRbZm10LmtleSB8IDBdO1xuICAgICAgaWYgKGVudCAmJiBlbnQudHAgPT0gJ0VYJyAmJiBlbnQuZGF0YSkge1xuICAgICAgICBjYWxsYmFjay5jYWxsKGNvbnRleHQsIGVudC5kYXRhLCBpKyssICdFWCcpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59XG5cbi8qKlxuICogQ2hlY2sgaWYgdGhlIGRyYWZ0eSBkb2N1bWVudCBoYXMgZW50aXRpZXMuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGNvbnRlbnQgLSBkb2N1bWVudCB0byBjaGVjayBmb3IgZW50aXRpZXMuXG4gKiBAcmV0dXJucyA8Y29kZT50cnVlPC9jb2RlPiBpZiB0aGVyZSBhcmUgZW50aXRpZXMuXG4gKi9cbkRyYWZ0eS5oYXNFbnRpdGllcyA9IGZ1bmN0aW9uKGNvbnRlbnQpIHtcbiAgcmV0dXJuIGNvbnRlbnQuZW50ICYmIGNvbnRlbnQuZW50Lmxlbmd0aCA+IDA7XG59XG5cbi8qKlxuICogRW51bWVyYXRlIGVudGl0aWVzLlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fSBjb250ZW50IC0gZG9jdW1lbnQgd2l0aCBlbnRpdGllcyB0byBlbnVtZXJhdGUuXG4gKiBAcGFyYW0ge0VudGl0eUNhbGxiYWNrfSBjYWxsYmFjayAtIGNhbGxiYWNrIHRvIGNhbGwgZm9yIGVhY2ggZW50aXR5LlxuICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHQgLSB2YWx1ZSBvZiBcInRoaXNcIiBmb3IgY2FsbGJhY2suXG4gKi9cbkRyYWZ0eS5lbnRpdGllcyA9IGZ1bmN0aW9uKGNvbnRlbnQsIGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gIGlmIChjb250ZW50LmVudCAmJiBjb250ZW50LmVudC5sZW5ndGggPiAwKSB7XG4gICAgZm9yIChsZXQgaSBpbiBjb250ZW50LmVudCkge1xuICAgICAgaWYgKGNvbnRlbnQuZW50W2ldKSB7XG4gICAgICAgIGNhbGxiYWNrLmNhbGwoY29udGV4dCwgY29udGVudC5lbnRbaV0uZGF0YSwgaSwgY29udGVudC5lbnRbaV0udHApO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFJlbW92ZSB1bnJlY29nbml6ZWQgZmllbGRzIGZyb20gZW50aXR5IGRhdGFcbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eX0gY29udGVudCAtIGRvY3VtZW50IHdpdGggZW50aXRpZXMgdG8gZW51bWVyYXRlLlxuICogQHJldHVybnMgY29udGVudC5cbiAqL1xuRHJhZnR5LnNhbml0aXplRW50aXRpZXMgPSBmdW5jdGlvbihjb250ZW50KSB7XG4gIGlmIChjb250ZW50ICYmIGNvbnRlbnQuZW50ICYmIGNvbnRlbnQuZW50Lmxlbmd0aCA+IDApIHtcbiAgICBmb3IgKGxldCBpIGluIGNvbnRlbnQuZW50KSB7XG4gICAgICBjb25zdCBlbnQgPSBjb250ZW50LmVudFtpXTtcbiAgICAgIGlmIChlbnQgJiYgZW50LmRhdGEpIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IGNvcHlFbnREYXRhKGVudC5kYXRhKTtcbiAgICAgICAgaWYgKGRhdGEpIHtcbiAgICAgICAgICBjb250ZW50LmVudFtpXS5kYXRhID0gZGF0YTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkZWxldGUgY29udGVudC5lbnRbaV0uZGF0YTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gY29udGVudDtcbn1cblxuLyoqXG4gKiBHaXZlbiB0aGUgZW50aXR5LCBnZXQgVVJMIHdoaWNoIGNhbiBiZSB1c2VkIGZvciBkb3dubG9hZGluZ1xuICogZW50aXR5IGRhdGEuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGVudERhdGEgLSBlbnRpdHkuZGF0YSB0byBnZXQgdGhlIFVSbCBmcm9tLlxuICogQHJldHVybnMge3N0cmluZ30gVVJMIHRvIGRvd25sb2FkIGVudGl0eSBkYXRhIG9yIDxjb2RlPm51bGw8L2NvZGU+LlxuICovXG5EcmFmdHkuZ2V0RG93bmxvYWRVcmwgPSBmdW5jdGlvbihlbnREYXRhKSB7XG4gIGxldCB1cmwgPSBudWxsO1xuICBpZiAoZW50RGF0YS5taW1lICE9IEpTT05fTUlNRV9UWVBFICYmIGVudERhdGEudmFsKSB7XG4gICAgdXJsID0gYmFzZTY0dG9PYmplY3RVcmwoZW50RGF0YS52YWwsIGVudERhdGEubWltZSwgRHJhZnR5LmxvZ2dlcik7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGVudERhdGEucmVmID09ICdzdHJpbmcnKSB7XG4gICAgdXJsID0gZW50RGF0YS5yZWY7XG4gIH1cbiAgcmV0dXJuIHVybDtcbn1cblxuLyoqXG4gKiBDaGVjayBpZiB0aGUgZW50aXR5IGRhdGEgaXMgbm90IHJlYWR5IGZvciBzZW5kaW5nLCBzdWNoIGFzIGJlaW5nIHVwbG9hZGVkIHRvIHRoZSBzZXJ2ZXIuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGVudGl0eS5kYXRhIHRvIGdldCB0aGUgVVJsIGZyb20uXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiB1cGxvYWQgaXMgaW4gcHJvZ3Jlc3MsIGZhbHNlIG90aGVyd2lzZS5cbiAqL1xuRHJhZnR5LmlzUHJvY2Vzc2luZyA9IGZ1bmN0aW9uKGVudERhdGEpIHtcbiAgcmV0dXJuICEhZW50RGF0YS5fcHJvY2Vzc2luZztcbn1cblxuLyoqXG4gKiBHaXZlbiB0aGUgZW50aXR5LCBnZXQgVVJMIHdoaWNoIGNhbiBiZSB1c2VkIGZvciBwcmV2aWV3aW5nXG4gKiB0aGUgZW50aXR5LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBlbnRpdHkuZGF0YSB0byBnZXQgdGhlIFVSbCBmcm9tLlxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9IHVybCBmb3IgcHJldmlld2luZyBvciBudWxsIGlmIG5vIHN1Y2ggdXJsIGlzIGF2YWlsYWJsZS5cbiAqL1xuRHJhZnR5LmdldFByZXZpZXdVcmwgPSBmdW5jdGlvbihlbnREYXRhKSB7XG4gIHJldHVybiBlbnREYXRhLnZhbCA/IGJhc2U2NHRvT2JqZWN0VXJsKGVudERhdGEudmFsLCBlbnREYXRhLm1pbWUsIERyYWZ0eS5sb2dnZXIpIDogbnVsbDtcbn1cblxuLyoqXG4gKiBHZXQgYXBwcm94aW1hdGUgc2l6ZSBvZiB0aGUgZW50aXR5LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBlbnREYXRhIC0gZW50aXR5LmRhdGEgdG8gZ2V0IHRoZSBzaXplIGZvci5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IHNpemUgb2YgZW50aXR5IGRhdGEgaW4gYnl0ZXMuXG4gKi9cbkRyYWZ0eS5nZXRFbnRpdHlTaXplID0gZnVuY3Rpb24oZW50RGF0YSkge1xuICAvLyBFaXRoZXIgc2l6ZSBoaW50IG9yIGxlbmd0aCBvZiB2YWx1ZS4gVGhlIHZhbHVlIGlzIGJhc2U2NCBlbmNvZGVkLFxuICAvLyB0aGUgYWN0dWFsIG9iamVjdCBzaXplIGlzIHNtYWxsZXIgdGhhbiB0aGUgZW5jb2RlZCBsZW5ndGguXG4gIHJldHVybiBlbnREYXRhLnNpemUgPyBlbnREYXRhLnNpemUgOiBlbnREYXRhLnZhbCA/IChlbnREYXRhLnZhbC5sZW5ndGggKiAwLjc1KSB8IDAgOiAwO1xufVxuXG4vKipcbiAqIEdldCBlbnRpdHkgbWltZSB0eXBlLlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBlbnREYXRhIC0gZW50aXR5LmRhdGEgdG8gZ2V0IHRoZSB0eXBlIGZvci5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IG1pbWUgdHlwZSBvZiBlbnRpdHkuXG4gKi9cbkRyYWZ0eS5nZXRFbnRpdHlNaW1lVHlwZSA9IGZ1bmN0aW9uKGVudERhdGEpIHtcbiAgcmV0dXJuIGVudERhdGEubWltZSB8fCAndGV4dC9wbGFpbic7XG59XG5cbi8qKlxuICogR2V0IEhUTUwgdGFnIGZvciBhIGdpdmVuIHR3by1sZXR0ZXIgc3R5bGUgbmFtZS5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gc3R5bGUgLSB0d28tbGV0dGVyIHN0eWxlLCBsaWtlIFNUIG9yIExOLlxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9IEhUTUwgdGFnIG5hbWUgaWYgc3R5bGUgaXMgZm91bmQsIHtjb2RlOiB1bmRlZmluZWR9IGlmIHN0eWxlIGlzIGZhbHNpc2ggb3Igbm90IGZvdW5kLlxuICovXG5EcmFmdHkudGFnTmFtZSA9IGZ1bmN0aW9uKHN0eWxlKSB7XG4gIHJldHVybiBIVE1MX1RBR1Nbc3R5bGVdICYmIEhUTUxfVEFHU1tzdHlsZV0ubmFtZTtcbn1cblxuLyoqXG4gKiBGb3IgYSBnaXZlbiBkYXRhIGJ1bmRsZSBnZW5lcmF0ZSBhbiBvYmplY3Qgd2l0aCBIVE1MIGF0dHJpYnV0ZXMsXG4gKiBmb3IgaW5zdGFuY2UsIGdpdmVuIHt1cmw6IFwiaHR0cDovL3d3dy5leGFtcGxlLmNvbS9cIn0gcmV0dXJuXG4gKiB7aHJlZjogXCJodHRwOi8vd3d3LmV4YW1wbGUuY29tL1wifVxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHlsZSAtIHR3by1sZXR0ZXIgc3R5bGUgdG8gZ2VuZXJhdGUgYXR0cmlidXRlcyBmb3IuXG4gKiBAcGFyYW0ge09iamVjdH0gZGF0YSAtIGRhdGEgYnVuZGxlIHRvIGNvbnZlcnQgdG8gYXR0cmlidXRlc1xuICpcbiAqIEByZXR1cm5zIHtPYmplY3R9IG9iamVjdCB3aXRoIEhUTUwgYXR0cmlidXRlcy5cbiAqL1xuRHJhZnR5LmF0dHJWYWx1ZSA9IGZ1bmN0aW9uKHN0eWxlLCBkYXRhKSB7XG4gIGlmIChkYXRhICYmIERFQ09SQVRPUlNbc3R5bGVdKSB7XG4gICAgcmV0dXJuIERFQ09SQVRPUlNbc3R5bGVdLnByb3BzKGRhdGEpO1xuICB9XG5cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBEcmFmdHkgTUlNRSB0eXBlLlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9IGNvbnRlbnQtVHlwZSBcInRleHQveC1kcmFmdHlcIi5cbiAqL1xuRHJhZnR5LmdldENvbnRlbnRUeXBlID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBEUkFGVFlfTUlNRV9UWVBFO1xufVxuXG4vLyA9PT09PT09PT09PT09PT09PVxuLy8gVXRpbGl0eSBtZXRob2RzLlxuLy8gPT09PT09PT09PT09PT09PT1cblxuLy8gVGFrZSBhIHN0cmluZyBhbmQgZGVmaW5lZCBlYXJsaWVyIHN0eWxlIHNwYW5zLCByZS1jb21wb3NlIHRoZW0gaW50byBhIHRyZWUgd2hlcmUgZWFjaCBsZWFmIGlzXG4vLyBhIHNhbWUtc3R5bGUgKGluY2x1ZGluZyB1bnN0eWxlZCkgc3RyaW5nLiBJLmUuICdoZWxsbyAqYm9sZCBfaXRhbGljXyogYW5kIH5tb3JlfiB3b3JsZCcgLT5cbi8vICgnaGVsbG8gJywgKGI6ICdib2xkICcsIChpOiAnaXRhbGljJykpLCAnIGFuZCAnLCAoczogJ21vcmUnKSwgJyB3b3JsZCcpO1xuLy9cbi8vIFRoaXMgaXMgbmVlZGVkIGluIG9yZGVyIHRvIGNsZWFyIG1hcmt1cCwgaS5lLiAnaGVsbG8gKndvcmxkKicgLT4gJ2hlbGxvIHdvcmxkJyBhbmQgY29udmVydFxuLy8gcmFuZ2VzIGZyb20gbWFya3VwLWVkIG9mZnNldHMgdG8gcGxhaW4gdGV4dCBvZmZzZXRzLlxuZnVuY3Rpb24gY2h1bmtpZnkobGluZSwgc3RhcnQsIGVuZCwgc3BhbnMpIHtcbiAgY29uc3QgY2h1bmtzID0gW107XG5cbiAgaWYgKHNwYW5zLmxlbmd0aCA9PSAwKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgZm9yIChsZXQgaSBpbiBzcGFucykge1xuICAgIC8vIEdldCB0aGUgbmV4dCBjaHVuayBmcm9tIHRoZSBxdWV1ZVxuICAgIGNvbnN0IHNwYW4gPSBzcGFuc1tpXTtcblxuICAgIC8vIEdyYWIgdGhlIGluaXRpYWwgdW5zdHlsZWQgY2h1bmtcbiAgICBpZiAoc3Bhbi5hdCA+IHN0YXJ0KSB7XG4gICAgICBjaHVua3MucHVzaCh7XG4gICAgICAgIHR4dDogbGluZS5zbGljZShzdGFydCwgc3Bhbi5hdClcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIEdyYWIgdGhlIHN0eWxlZCBjaHVuay4gSXQgbWF5IGluY2x1ZGUgc3ViY2h1bmtzLlxuICAgIGNvbnN0IGNodW5rID0ge1xuICAgICAgdHA6IHNwYW4udHBcbiAgICB9O1xuICAgIGNvbnN0IGNobGQgPSBjaHVua2lmeShsaW5lLCBzcGFuLmF0ICsgMSwgc3Bhbi5lbmQsIHNwYW4uY2hpbGRyZW4pO1xuICAgIGlmIChjaGxkLmxlbmd0aCA+IDApIHtcbiAgICAgIGNodW5rLmNoaWxkcmVuID0gY2hsZDtcbiAgICB9IGVsc2Uge1xuICAgICAgY2h1bmsudHh0ID0gc3Bhbi50eHQ7XG4gICAgfVxuICAgIGNodW5rcy5wdXNoKGNodW5rKTtcbiAgICBzdGFydCA9IHNwYW4uZW5kICsgMTsgLy8gJysxJyBpcyB0byBza2lwIHRoZSBmb3JtYXR0aW5nIGNoYXJhY3RlclxuICB9XG5cbiAgLy8gR3JhYiB0aGUgcmVtYWluaW5nIHVuc3R5bGVkIGNodW5rLCBhZnRlciB0aGUgbGFzdCBzcGFuXG4gIGlmIChzdGFydCA8IGVuZCkge1xuICAgIGNodW5rcy5wdXNoKHtcbiAgICAgIHR4dDogbGluZS5zbGljZShzdGFydCwgZW5kKVxuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIGNodW5rcztcbn1cblxuLy8gRGV0ZWN0IHN0YXJ0cyBhbmQgZW5kcyBvZiBmb3JtYXR0aW5nIHNwYW5zLiBVbmZvcm1hdHRlZCBzcGFucyBhcmVcbi8vIGlnbm9yZWQgYXQgdGhpcyBzdGFnZS5cbmZ1bmN0aW9uIHNwYW5uaWZ5KG9yaWdpbmFsLCByZV9zdGFydCwgcmVfZW5kLCB0eXBlKSB7XG4gIGNvbnN0IHJlc3VsdCA9IFtdO1xuICBsZXQgaW5kZXggPSAwO1xuICBsZXQgbGluZSA9IG9yaWdpbmFsLnNsaWNlKDApOyAvLyBtYWtlIGEgY29weTtcblxuICB3aGlsZSAobGluZS5sZW5ndGggPiAwKSB7XG4gICAgLy8gbWF0Y2hbMF07IC8vIG1hdGNoLCBsaWtlICcqYWJjKidcbiAgICAvLyBtYXRjaFsxXTsgLy8gbWF0Y2ggY2FwdHVyZWQgaW4gcGFyZW50aGVzaXMsIGxpa2UgJ2FiYydcbiAgICAvLyBtYXRjaFsnaW5kZXgnXTsgLy8gb2Zmc2V0IHdoZXJlIHRoZSBtYXRjaCBzdGFydGVkLlxuXG4gICAgLy8gRmluZCB0aGUgb3BlbmluZyB0b2tlbi5cbiAgICBjb25zdCBzdGFydCA9IHJlX3N0YXJ0LmV4ZWMobGluZSk7XG4gICAgaWYgKHN0YXJ0ID09IG51bGwpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIC8vIEJlY2F1c2UgamF2YXNjcmlwdCBSZWdFeHAgZG9lcyBub3Qgc3VwcG9ydCBsb29rYmVoaW5kLCB0aGUgYWN0dWFsIG9mZnNldCBtYXkgbm90IHBvaW50XG4gICAgLy8gYXQgdGhlIG1hcmt1cCBjaGFyYWN0ZXIuIEZpbmQgaXQgaW4gdGhlIG1hdGNoZWQgc3RyaW5nLlxuICAgIGxldCBzdGFydF9vZmZzZXQgPSBzdGFydFsnaW5kZXgnXSArIHN0YXJ0WzBdLmxhc3RJbmRleE9mKHN0YXJ0WzFdKTtcbiAgICAvLyBDbGlwIHRoZSBwcm9jZXNzZWQgcGFydCBvZiB0aGUgc3RyaW5nLlxuICAgIGxpbmUgPSBsaW5lLnNsaWNlKHN0YXJ0X29mZnNldCArIDEpO1xuICAgIC8vIHN0YXJ0X29mZnNldCBpcyBhbiBvZmZzZXQgd2l0aGluIHRoZSBjbGlwcGVkIHN0cmluZy4gQ29udmVydCB0byBvcmlnaW5hbCBpbmRleC5cbiAgICBzdGFydF9vZmZzZXQgKz0gaW5kZXg7XG4gICAgLy8gSW5kZXggbm93IHBvaW50IHRvIHRoZSBiZWdpbm5pbmcgb2YgJ2xpbmUnIHdpdGhpbiB0aGUgJ29yaWdpbmFsJyBzdHJpbmcuXG4gICAgaW5kZXggPSBzdGFydF9vZmZzZXQgKyAxO1xuXG4gICAgLy8gRmluZCB0aGUgbWF0Y2hpbmcgY2xvc2luZyB0b2tlbi5cbiAgICBjb25zdCBlbmQgPSByZV9lbmQgPyByZV9lbmQuZXhlYyhsaW5lKSA6IG51bGw7XG4gICAgaWYgKGVuZCA9PSBudWxsKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgbGV0IGVuZF9vZmZzZXQgPSBlbmRbJ2luZGV4J10gKyBlbmRbMF0uaW5kZXhPZihlbmRbMV0pO1xuICAgIC8vIENsaXAgdGhlIHByb2Nlc3NlZCBwYXJ0IG9mIHRoZSBzdHJpbmcuXG4gICAgbGluZSA9IGxpbmUuc2xpY2UoZW5kX29mZnNldCArIDEpO1xuICAgIC8vIFVwZGF0ZSBvZmZzZXRzXG4gICAgZW5kX29mZnNldCArPSBpbmRleDtcbiAgICAvLyBJbmRleCBub3cgcG9pbnRzIHRvIHRoZSBiZWdpbm5pbmcgb2YgJ2xpbmUnIHdpdGhpbiB0aGUgJ29yaWdpbmFsJyBzdHJpbmcuXG4gICAgaW5kZXggPSBlbmRfb2Zmc2V0ICsgMTtcblxuICAgIHJlc3VsdC5wdXNoKHtcbiAgICAgIHR4dDogb3JpZ2luYWwuc2xpY2Uoc3RhcnRfb2Zmc2V0ICsgMSwgZW5kX29mZnNldCksXG4gICAgICBjaGlsZHJlbjogW10sXG4gICAgICBhdDogc3RhcnRfb2Zmc2V0LFxuICAgICAgZW5kOiBlbmRfb2Zmc2V0LFxuICAgICAgdHA6IHR5cGVcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8vIENvbnZlcnQgbGluZWFyIGFycmF5IG9yIHNwYW5zIGludG8gYSB0cmVlIHJlcHJlc2VudGF0aW9uLlxuLy8gS2VlcCBzdGFuZGFsb25lIGFuZCBuZXN0ZWQgc3BhbnMsIHRocm93IGF3YXkgcGFydGlhbGx5IG92ZXJsYXBwaW5nIHNwYW5zLlxuZnVuY3Rpb24gdG9TcGFuVHJlZShzcGFucykge1xuICBpZiAoc3BhbnMubGVuZ3RoID09IDApIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBjb25zdCB0cmVlID0gW3NwYW5zWzBdXTtcbiAgbGV0IGxhc3QgPSBzcGFuc1swXTtcbiAgZm9yIChsZXQgaSA9IDE7IGkgPCBzcGFucy5sZW5ndGg7IGkrKykge1xuICAgIC8vIEtlZXAgc3BhbnMgd2hpY2ggc3RhcnQgYWZ0ZXIgdGhlIGVuZCBvZiB0aGUgcHJldmlvdXMgc3BhbiBvciB0aG9zZSB3aGljaFxuICAgIC8vIGFyZSBjb21wbGV0ZSB3aXRoaW4gdGhlIHByZXZpb3VzIHNwYW4uXG4gICAgaWYgKHNwYW5zW2ldLmF0ID4gbGFzdC5lbmQpIHtcbiAgICAgIC8vIFNwYW4gaXMgY29tcGxldGVseSBvdXRzaWRlIG9mIHRoZSBwcmV2aW91cyBzcGFuLlxuICAgICAgdHJlZS5wdXNoKHNwYW5zW2ldKTtcbiAgICAgIGxhc3QgPSBzcGFuc1tpXTtcbiAgICB9IGVsc2UgaWYgKHNwYW5zW2ldLmVuZCA8PSBsYXN0LmVuZCkge1xuICAgICAgLy8gU3BhbiBpcyBmdWxseSBpbnNpZGUgb2YgdGhlIHByZXZpb3VzIHNwYW4uIFB1c2ggdG8gc3Vibm9kZS5cbiAgICAgIGxhc3QuY2hpbGRyZW4ucHVzaChzcGFuc1tpXSk7XG4gICAgfVxuICAgIC8vIFNwYW4gY291bGQgcGFydGlhbGx5IG92ZXJsYXAsIGlnbm9yaW5nIGl0IGFzIGludmFsaWQuXG4gIH1cblxuICAvLyBSZWN1cnNpdmVseSByZWFycmFuZ2UgdGhlIHN1Ym5vZGVzLlxuICBmb3IgKGxldCBpIGluIHRyZWUpIHtcbiAgICB0cmVlW2ldLmNoaWxkcmVuID0gdG9TcGFuVHJlZSh0cmVlW2ldLmNoaWxkcmVuKTtcbiAgfVxuXG4gIHJldHVybiB0cmVlO1xufVxuXG4vLyBDb252ZXJ0IGRyYWZ0eSBkb2N1bWVudCB0byBhIHRyZWUuXG5mdW5jdGlvbiBkcmFmdHlUb1RyZWUoZG9jKSB7XG4gIGlmICghZG9jKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBkb2MgPSAodHlwZW9mIGRvYyA9PSAnc3RyaW5nJykgPyB7XG4gICAgdHh0OiBkb2NcbiAgfSA6IGRvYztcbiAgbGV0IHtcbiAgICB0eHQsXG4gICAgZm10LFxuICAgIGVudFxuICB9ID0gZG9jO1xuXG4gIHR4dCA9IHR4dCB8fCAnJztcbiAgaWYgKCFBcnJheS5pc0FycmF5KGVudCkpIHtcbiAgICBlbnQgPSBbXTtcbiAgfVxuXG4gIGlmICghQXJyYXkuaXNBcnJheShmbXQpIHx8IGZtdC5sZW5ndGggPT0gMCkge1xuICAgIGlmIChlbnQubGVuZ3RoID09IDApIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHRleHQ6IHR4dFxuICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBIYW5kbGUgc3BlY2lhbCBjYXNlIHdoZW4gYWxsIHZhbHVlcyBpbiBmbXQgYXJlIDAgYW5kIGZtdCB0aGVyZWZvcmUgaXMgc2tpcHBlZC5cbiAgICBmbXQgPSBbe1xuICAgICAgYXQ6IDAsXG4gICAgICBsZW46IDAsXG4gICAgICBrZXk6IDBcbiAgICB9XTtcbiAgfVxuXG4gIC8vIFNhbml0aXplIHNwYW5zLlxuICBjb25zdCBzcGFucyA9IFtdO1xuICBjb25zdCBhdHRhY2htZW50cyA9IFtdO1xuICBmbXQuZm9yRWFjaCgoc3BhbikgPT4ge1xuICAgIGlmICghc3BhbiB8fCB0eXBlb2Ygc3BhbiAhPSAnb2JqZWN0Jykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghWyd1bmRlZmluZWQnLCAnbnVtYmVyJ10uaW5jbHVkZXModHlwZW9mIHNwYW4uYXQpKSB7XG4gICAgICAvLyBQcmVzZW50LCBidXQgbm9uLW51bWVyaWMgJ2F0Jy5cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFbJ3VuZGVmaW5lZCcsICdudW1iZXInXS5pbmNsdWRlcyh0eXBlb2Ygc3Bhbi5sZW4pKSB7XG4gICAgICAvLyBQcmVzZW50LCBidXQgbm9uLW51bWVyaWMgJ2xlbicuXG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGxldCBhdCA9IHNwYW4uYXQgfCAwO1xuICAgIGxldCBsZW4gPSBzcGFuLmxlbiB8IDA7XG4gICAgaWYgKGxlbiA8IDApIHtcbiAgICAgIC8vIEludmFsaWQgc3BhbiBsZW5ndGguXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IGtleSA9IHNwYW4ua2V5IHx8IDA7XG4gICAgaWYgKGVudC5sZW5ndGggPiAwICYmICh0eXBlb2Yga2V5ICE9ICdudW1iZXInIHx8IGtleSA8IDAgfHwga2V5ID49IGVudC5sZW5ndGgpKSB7XG4gICAgICAvLyBJbnZhbGlkIGtleSB2YWx1ZS5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoYXQgPD0gLTEpIHtcbiAgICAgIC8vIEF0dGFjaG1lbnQuIFN0b3JlIGF0dGFjaG1lbnRzIHNlcGFyYXRlbHkuXG4gICAgICBhdHRhY2htZW50cy5wdXNoKHtcbiAgICAgICAgc3RhcnQ6IC0xLFxuICAgICAgICBlbmQ6IDAsXG4gICAgICAgIGtleToga2V5XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9IGVsc2UgaWYgKGF0ICsgbGVuID4gdHh0Lmxlbmd0aCkge1xuICAgICAgLy8gU3BhbiBpcyBvdXQgb2YgYm91bmRzLlxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghc3Bhbi50cCkge1xuICAgICAgaWYgKGVudC5sZW5ndGggPiAwICYmICh0eXBlb2YgZW50W2tleV0gPT0gJ29iamVjdCcpKSB7XG4gICAgICAgIHNwYW5zLnB1c2goe1xuICAgICAgICAgIHN0YXJ0OiBhdCxcbiAgICAgICAgICBlbmQ6IGF0ICsgbGVuLFxuICAgICAgICAgIGtleToga2V5XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzcGFucy5wdXNoKHtcbiAgICAgICAgdHlwZTogc3Bhbi50cCxcbiAgICAgICAgc3RhcnQ6IGF0LFxuICAgICAgICBlbmQ6IGF0ICsgbGVuXG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vIFNvcnQgc3BhbnMgZmlyc3QgYnkgc3RhcnQgaW5kZXggKGFzYykgdGhlbiBieSBsZW5ndGggKGRlc2MpLCB0aGVuIGJ5IHdlaWdodC5cbiAgc3BhbnMuc29ydCgoYSwgYikgPT4ge1xuICAgIGxldCBkaWZmID0gYS5zdGFydCAtIGIuc3RhcnQ7XG4gICAgaWYgKGRpZmYgIT0gMCkge1xuICAgICAgcmV0dXJuIGRpZmY7XG4gICAgfVxuICAgIGRpZmYgPSBiLmVuZCAtIGEuZW5kO1xuICAgIGlmIChkaWZmICE9IDApIHtcbiAgICAgIHJldHVybiBkaWZmO1xuICAgIH1cbiAgICByZXR1cm4gRk1UX1dFSUdIVC5pbmRleE9mKGIudHlwZSkgLSBGTVRfV0VJR0hULmluZGV4T2YoYS50eXBlKTtcbiAgfSk7XG5cbiAgLy8gTW92ZSBhdHRhY2htZW50cyB0byB0aGUgZW5kIG9mIHRoZSBsaXN0LlxuICBpZiAoYXR0YWNobWVudHMubGVuZ3RoID4gMCkge1xuICAgIHNwYW5zLnB1c2goLi4uYXR0YWNobWVudHMpO1xuICB9XG5cbiAgc3BhbnMuZm9yRWFjaCgoc3BhbikgPT4ge1xuICAgIGlmIChlbnQubGVuZ3RoID4gMCAmJiAhc3Bhbi50eXBlICYmIGVudFtzcGFuLmtleV0gJiYgdHlwZW9mIGVudFtzcGFuLmtleV0gPT0gJ29iamVjdCcpIHtcbiAgICAgIHNwYW4udHlwZSA9IGVudFtzcGFuLmtleV0udHA7XG4gICAgICBzcGFuLmRhdGEgPSBlbnRbc3Bhbi5rZXldLmRhdGE7XG4gICAgfVxuXG4gICAgLy8gSXMgdHlwZSBzdGlsbCB1bmRlZmluZWQ/IEhpZGUgdGhlIGludmFsaWQgZWxlbWVudCFcbiAgICBpZiAoIXNwYW4udHlwZSkge1xuICAgICAgc3Bhbi50eXBlID0gJ0hEJztcbiAgICB9XG4gIH0pO1xuXG4gIGxldCB0cmVlID0gc3BhbnNUb1RyZWUoe30sIHR4dCwgMCwgdHh0Lmxlbmd0aCwgc3BhbnMpO1xuXG4gIC8vIEZsYXR0ZW4gdHJlZSBub2Rlcy5cbiAgY29uc3QgZmxhdHRlbiA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShub2RlLmNoaWxkcmVuKSAmJiBub2RlLmNoaWxkcmVuLmxlbmd0aCA9PSAxKSB7XG4gICAgICAvLyBVbndyYXAuXG4gICAgICBjb25zdCBjaGlsZCA9IG5vZGUuY2hpbGRyZW5bMF07XG4gICAgICBpZiAoIW5vZGUudHlwZSkge1xuICAgICAgICBjb25zdCBwYXJlbnQgPSBub2RlLnBhcmVudDtcbiAgICAgICAgbm9kZSA9IGNoaWxkO1xuICAgICAgICBub2RlLnBhcmVudCA9IHBhcmVudDtcbiAgICAgIH0gZWxzZSBpZiAoIWNoaWxkLnR5cGUgJiYgIWNoaWxkLmNoaWxkcmVuKSB7XG4gICAgICAgIG5vZGUudGV4dCA9IGNoaWxkLnRleHQ7XG4gICAgICAgIGRlbGV0ZSBub2RlLmNoaWxkcmVuO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuICB0cmVlID0gdHJlZVRvcERvd24odHJlZSwgZmxhdHRlbik7XG5cbiAgcmV0dXJuIHRyZWU7XG59XG5cbi8vIEFkZCB0cmVlIG5vZGUgdG8gYSBwYXJlbnQgdHJlZS5cbmZ1bmN0aW9uIGFkZE5vZGUocGFyZW50LCBuKSB7XG4gIGlmICghbikge1xuICAgIHJldHVybiBwYXJlbnQ7XG4gIH1cblxuICBpZiAoIXBhcmVudC5jaGlsZHJlbikge1xuICAgIHBhcmVudC5jaGlsZHJlbiA9IFtdO1xuICB9XG5cbiAgLy8gSWYgdGV4dCBpcyBwcmVzZW50LCBtb3ZlIGl0IHRvIGEgc3Vibm9kZS5cbiAgaWYgKHBhcmVudC50ZXh0KSB7XG4gICAgcGFyZW50LmNoaWxkcmVuLnB1c2goe1xuICAgICAgdGV4dDogcGFyZW50LnRleHQsXG4gICAgICBwYXJlbnQ6IHBhcmVudFxuICAgIH0pO1xuICAgIGRlbGV0ZSBwYXJlbnQudGV4dDtcbiAgfVxuXG4gIG4ucGFyZW50ID0gcGFyZW50O1xuICBwYXJlbnQuY2hpbGRyZW4ucHVzaChuKTtcblxuICByZXR1cm4gcGFyZW50O1xufVxuXG4vLyBSZXR1cm5zIGEgdHJlZSBvZiBub2Rlcy5cbmZ1bmN0aW9uIHNwYW5zVG9UcmVlKHBhcmVudCwgdGV4dCwgc3RhcnQsIGVuZCwgc3BhbnMpIHtcbiAgaWYgKCFzcGFucyB8fCBzcGFucy5sZW5ndGggPT0gMCkge1xuICAgIGlmIChzdGFydCA8IGVuZCkge1xuICAgICAgYWRkTm9kZShwYXJlbnQsIHtcbiAgICAgICAgdGV4dDogdGV4dC5zdWJzdHJpbmcoc3RhcnQsIGVuZClcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gcGFyZW50O1xuICB9XG5cbiAgLy8gUHJvY2VzcyBzdWJzcGFucy5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzcGFucy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHNwYW4gPSBzcGFuc1tpXTtcbiAgICBpZiAoc3Bhbi5zdGFydCA8IDAgJiYgc3Bhbi50eXBlID09ICdFWCcpIHtcbiAgICAgIGFkZE5vZGUocGFyZW50LCB7XG4gICAgICAgIHR5cGU6IHNwYW4udHlwZSxcbiAgICAgICAgZGF0YTogc3Bhbi5kYXRhLFxuICAgICAgICBrZXk6IHNwYW4ua2V5LFxuICAgICAgICBhdHQ6IHRydWVcbiAgICAgIH0pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gQWRkIHVuLXN0eWxlZCByYW5nZSBiZWZvcmUgdGhlIHN0eWxlZCBzcGFuIHN0YXJ0cy5cbiAgICBpZiAoc3RhcnQgPCBzcGFuLnN0YXJ0KSB7XG4gICAgICBhZGROb2RlKHBhcmVudCwge1xuICAgICAgICB0ZXh0OiB0ZXh0LnN1YnN0cmluZyhzdGFydCwgc3Bhbi5zdGFydClcbiAgICAgIH0pO1xuICAgICAgc3RhcnQgPSBzcGFuLnN0YXJ0O1xuICAgIH1cblxuICAgIC8vIEdldCBhbGwgc3BhbnMgd2hpY2ggYXJlIHdpdGhpbiB0aGUgY3VycmVudCBzcGFuLlxuICAgIGNvbnN0IHN1YnNwYW5zID0gW107XG4gICAgd2hpbGUgKGkgPCBzcGFucy5sZW5ndGggLSAxKSB7XG4gICAgICBjb25zdCBpbm5lciA9IHNwYW5zW2kgKyAxXTtcbiAgICAgIGlmIChpbm5lci5zdGFydCA8IDApIHtcbiAgICAgICAgLy8gQXR0YWNobWVudHMgYXJlIGluIHRoZSBlbmQuIFN0b3AuXG4gICAgICAgIGJyZWFrO1xuICAgICAgfSBlbHNlIGlmIChpbm5lci5zdGFydCA8IHNwYW4uZW5kKSB7XG4gICAgICAgIGlmIChpbm5lci5lbmQgPD0gc3Bhbi5lbmQpIHtcbiAgICAgICAgICBjb25zdCB0YWcgPSBIVE1MX1RBR1NbaW5uZXIudHBdIHx8IHt9O1xuICAgICAgICAgIGlmIChpbm5lci5zdGFydCA8IGlubmVyLmVuZCB8fCB0YWcuaXNWb2lkKSB7XG4gICAgICAgICAgICAvLyBWYWxpZCBzdWJzcGFuOiBjb21wbGV0ZWx5IHdpdGhpbiB0aGUgY3VycmVudCBzcGFuIGFuZFxuICAgICAgICAgICAgLy8gZWl0aGVyIG5vbi16ZXJvIGxlbmd0aCBvciB6ZXJvIGxlbmd0aCBpcyBhY2NlcHRhYmxlLlxuICAgICAgICAgICAgc3Vic3BhbnMucHVzaChpbm5lcik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGkrKztcbiAgICAgICAgLy8gT3ZlcmxhcHBpbmcgc3Vic3BhbnMgYXJlIGlnbm9yZWQuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBQYXN0IHRoZSBlbmQgb2YgdGhlIGN1cnJlbnQgc3Bhbi4gU3RvcC5cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgYWRkTm9kZShwYXJlbnQsIHNwYW5zVG9UcmVlKHtcbiAgICAgIHR5cGU6IHNwYW4udHlwZSxcbiAgICAgIGRhdGE6IHNwYW4uZGF0YSxcbiAgICAgIGtleTogc3Bhbi5rZXlcbiAgICB9LCB0ZXh0LCBzdGFydCwgc3Bhbi5lbmQsIHN1YnNwYW5zKSk7XG4gICAgc3RhcnQgPSBzcGFuLmVuZDtcbiAgfVxuXG4gIC8vIEFkZCB0aGUgbGFzdCB1bmZvcm1hdHRlZCByYW5nZS5cbiAgaWYgKHN0YXJ0IDwgZW5kKSB7XG4gICAgYWRkTm9kZShwYXJlbnQsIHtcbiAgICAgIHRleHQ6IHRleHQuc3Vic3RyaW5nKHN0YXJ0LCBlbmQpXG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gcGFyZW50O1xufVxuXG4vLyBBcHBlbmQgYSB0cmVlIHRvIGEgRHJhZnR5IGRvYy5cbmZ1bmN0aW9uIHRyZWVUb0RyYWZ0eShkb2MsIHRyZWUsIGtleW1hcCkge1xuICBpZiAoIXRyZWUpIHtcbiAgICByZXR1cm4gZG9jO1xuICB9XG5cbiAgZG9jLnR4dCA9IGRvYy50eHQgfHwgJyc7XG5cbiAgLy8gQ2hlY2twb2ludCB0byBtZWFzdXJlIGxlbmd0aCBvZiB0aGUgY3VycmVudCB0cmVlIG5vZGUuXG4gIGNvbnN0IHN0YXJ0ID0gZG9jLnR4dC5sZW5ndGg7XG5cbiAgaWYgKHRyZWUudGV4dCkge1xuICAgIGRvYy50eHQgKz0gdHJlZS50ZXh0O1xuICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkodHJlZS5jaGlsZHJlbikpIHtcbiAgICB0cmVlLmNoaWxkcmVuLmZvckVhY2goKGMpID0+IHtcbiAgICAgIHRyZWVUb0RyYWZ0eShkb2MsIGMsIGtleW1hcCk7XG4gICAgfSk7XG4gIH1cblxuICBpZiAodHJlZS50eXBlKSB7XG4gICAgY29uc3QgbGVuID0gZG9jLnR4dC5sZW5ndGggLSBzdGFydDtcbiAgICBkb2MuZm10ID0gZG9jLmZtdCB8fCBbXTtcbiAgICBpZiAoT2JqZWN0LmtleXModHJlZS5kYXRhIHx8IHt9KS5sZW5ndGggPiAwKSB7XG4gICAgICBkb2MuZW50ID0gZG9jLmVudCB8fCBbXTtcbiAgICAgIGNvbnN0IG5ld0tleSA9ICh0eXBlb2Yga2V5bWFwW3RyZWUua2V5XSA9PSAndW5kZWZpbmVkJykgPyBkb2MuZW50Lmxlbmd0aCA6IGtleW1hcFt0cmVlLmtleV07XG4gICAgICBrZXltYXBbdHJlZS5rZXldID0gbmV3S2V5O1xuICAgICAgZG9jLmVudFtuZXdLZXldID0ge1xuICAgICAgICB0cDogdHJlZS50eXBlLFxuICAgICAgICBkYXRhOiB0cmVlLmRhdGFcbiAgICAgIH07XG4gICAgICBpZiAodHJlZS5hdHQpIHtcbiAgICAgICAgLy8gQXR0YWNobWVudC5cbiAgICAgICAgZG9jLmZtdC5wdXNoKHtcbiAgICAgICAgICBhdDogLTEsXG4gICAgICAgICAgbGVuOiAwLFxuICAgICAgICAgIGtleTogbmV3S2V5XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZG9jLmZtdC5wdXNoKHtcbiAgICAgICAgICBhdDogc3RhcnQsXG4gICAgICAgICAgbGVuOiBsZW4sXG4gICAgICAgICAga2V5OiBuZXdLZXlcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGRvYy5mbXQucHVzaCh7XG4gICAgICAgIHRwOiB0cmVlLnR5cGUsXG4gICAgICAgIGF0OiBzdGFydCxcbiAgICAgICAgbGVuOiBsZW5cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZG9jO1xufVxuXG4vLyBUcmF2ZXJzZSB0aGUgdHJlZSB0b3AgZG93biB0cmFuc2Zvcm1pbmcgdGhlIG5vZGVzOiBhcHBseSB0cmFuc2Zvcm1lciB0byBldmVyeSB0cmVlIG5vZGUuXG5mdW5jdGlvbiB0cmVlVG9wRG93bihzcmMsIHRyYW5zZm9ybWVyLCBjb250ZXh0KSB7XG4gIGlmICghc3JjKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBsZXQgZHN0ID0gdHJhbnNmb3JtZXIuY2FsbChjb250ZXh0LCBzcmMpO1xuICBpZiAoIWRzdCB8fCAhZHN0LmNoaWxkcmVuKSB7XG4gICAgcmV0dXJuIGRzdDtcbiAgfVxuXG4gIGNvbnN0IGNoaWxkcmVuID0gW107XG4gIGZvciAobGV0IGkgaW4gZHN0LmNoaWxkcmVuKSB7XG4gICAgbGV0IG4gPSBkc3QuY2hpbGRyZW5baV07XG4gICAgaWYgKG4pIHtcbiAgICAgIG4gPSB0cmVlVG9wRG93bihuLCB0cmFuc2Zvcm1lciwgY29udGV4dCk7XG4gICAgICBpZiAobikge1xuICAgICAgICBjaGlsZHJlbi5wdXNoKG4pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmIChjaGlsZHJlbi5sZW5ndGggPT0gMCkge1xuICAgIGRzdC5jaGlsZHJlbiA9IG51bGw7XG4gIH0gZWxzZSB7XG4gICAgZHN0LmNoaWxkcmVuID0gY2hpbGRyZW47XG4gIH1cblxuICByZXR1cm4gZHN0O1xufVxuXG4vLyBUcmF2ZXJzZSB0aGUgdHJlZSBib3R0b20tdXA6IGFwcGx5IGZvcm1hdHRlciB0byBldmVyeSBub2RlLlxuLy8gVGhlIGZvcm1hdHRlciBtdXN0IG1haW50YWluIGl0cyBzdGF0ZSB0aHJvdWdoIGNvbnRleHQuXG5mdW5jdGlvbiB0cmVlQm90dG9tVXAoc3JjLCBmb3JtYXR0ZXIsIGluZGV4LCBzdGFjaywgY29udGV4dCkge1xuICBpZiAoIXNyYykge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgaWYgKHN0YWNrICYmIHNyYy50eXBlKSB7XG4gICAgc3RhY2sucHVzaChzcmMudHlwZSk7XG4gIH1cblxuICBsZXQgdmFsdWVzID0gW107XG4gIGZvciAobGV0IGkgaW4gc3JjLmNoaWxkcmVuKSB7XG4gICAgY29uc3QgbiA9IHRyZWVCb3R0b21VcChzcmMuY2hpbGRyZW5baV0sIGZvcm1hdHRlciwgaSwgc3RhY2ssIGNvbnRleHQpO1xuICAgIGlmIChuKSB7XG4gICAgICB2YWx1ZXMucHVzaChuKTtcbiAgICB9XG4gIH1cbiAgaWYgKHZhbHVlcy5sZW5ndGggPT0gMCkge1xuICAgIGlmIChzcmMudGV4dCkge1xuICAgICAgdmFsdWVzID0gW3NyYy50ZXh0XTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFsdWVzID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBpZiAoc3RhY2sgJiYgc3JjLnR5cGUpIHtcbiAgICBzdGFjay5wb3AoKTtcbiAgfVxuXG4gIHJldHVybiBmb3JtYXR0ZXIuY2FsbChjb250ZXh0LCBzcmMudHlwZSwgc3JjLmRhdGEsIHZhbHVlcywgaW5kZXgsIHN0YWNrKTtcbn1cblxuLy8gQ2xpcCB0cmVlIHRvIHRoZSBwcm92aWRlZCBsaW1pdC5cbmZ1bmN0aW9uIHNob3J0ZW5UcmVlKHRyZWUsIGxpbWl0LCB0YWlsKSB7XG4gIGlmICghdHJlZSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgaWYgKHRhaWwpIHtcbiAgICBsaW1pdCAtPSB0YWlsLmxlbmd0aDtcbiAgfVxuXG4gIGNvbnN0IHNob3J0ZW5lciA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICBpZiAobGltaXQgPD0gLTEpIHtcbiAgICAgIC8vIExpbWl0IC0xIG1lYW5zIHRoZSBkb2Mgd2FzIGFscmVhZHkgY2xpcHBlZC5cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGlmIChub2RlLmF0dCkge1xuICAgICAgLy8gQXR0YWNobWVudHMgYXJlIHVuY2hhbmdlZC5cbiAgICAgIHJldHVybiBub2RlO1xuICAgIH1cbiAgICBpZiAobGltaXQgPT0gMCkge1xuICAgICAgbm9kZS50ZXh0ID0gdGFpbDtcbiAgICAgIGxpbWl0ID0gLTE7XG4gICAgfSBlbHNlIGlmIChub2RlLnRleHQpIHtcbiAgICAgIGNvbnN0IGxlbiA9IG5vZGUudGV4dC5sZW5ndGg7XG4gICAgICBpZiAobGVuID4gbGltaXQpIHtcbiAgICAgICAgbm9kZS50ZXh0ID0gbm9kZS50ZXh0LnN1YnN0cmluZygwLCBsaW1pdCkgKyB0YWlsO1xuICAgICAgICBsaW1pdCA9IC0xO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGltaXQgLT0gbGVuO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuXG4gIHJldHVybiB0cmVlVG9wRG93bih0cmVlLCBzaG9ydGVuZXIpO1xufVxuXG4vLyBTdHJpcCBoZWF2eSBlbnRpdGllcyBmcm9tIGEgdHJlZS5cbmZ1bmN0aW9uIGxpZ2h0RW50aXR5KHRyZWUsIGFsbG93KSB7XG4gIGNvbnN0IGxpZ2h0Q29weSA9IChub2RlKSA9PiB7XG4gICAgY29uc3QgZGF0YSA9IGNvcHlFbnREYXRhKG5vZGUuZGF0YSwgdHJ1ZSwgYWxsb3cgPyBhbGxvdyhub2RlKSA6IG51bGwpO1xuICAgIGlmIChkYXRhKSB7XG4gICAgICBub2RlLmRhdGEgPSBkYXRhO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWxldGUgbm9kZS5kYXRhO1xuICAgIH1cbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuICByZXR1cm4gdHJlZVRvcERvd24odHJlZSwgbGlnaHRDb3B5KTtcbn1cblxuLy8gUmVtb3ZlIHNwYWNlcyBhbmQgYnJlYWtzIG9uIHRoZSBsZWZ0LlxuZnVuY3Rpb24gbFRyaW0odHJlZSkge1xuICBpZiAodHJlZS50eXBlID09ICdCUicpIHtcbiAgICB0cmVlID0gbnVsbDtcbiAgfSBlbHNlIGlmICh0cmVlLnRleHQpIHtcbiAgICBpZiAoIXRyZWUudHlwZSkge1xuICAgICAgdHJlZS50ZXh0ID0gdHJlZS50ZXh0LnRyaW1TdGFydCgpO1xuICAgICAgaWYgKCF0cmVlLnRleHQpIHtcbiAgICAgICAgdHJlZSA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKCF0cmVlLnR5cGUgJiYgdHJlZS5jaGlsZHJlbiAmJiB0cmVlLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICBjb25zdCBjID0gbFRyaW0odHJlZS5jaGlsZHJlblswXSk7XG4gICAgaWYgKGMpIHtcbiAgICAgIHRyZWUuY2hpbGRyZW5bMF0gPSBjO1xuICAgIH0gZWxzZSB7XG4gICAgICB0cmVlLmNoaWxkcmVuLnNoaWZ0KCk7XG4gICAgICBpZiAoIXRyZWUudHlwZSAmJiB0cmVlLmNoaWxkcmVuLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgIHRyZWUgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gdHJlZTtcbn1cblxuLy8gTW92ZSBhdHRhY2htZW50cyB0byB0aGUgZW5kLiBBdHRhY2htZW50cyBtdXN0IGJlIGF0IHRoZSB0b3AgbGV2ZWwsIG5vIG5lZWQgdG8gdHJhdmVyc2UgdGhlIHRyZWUuXG5mdW5jdGlvbiBhdHRhY2htZW50c1RvRW5kKHRyZWUsIGxpbWl0KSB7XG4gIGlmICghdHJlZSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgaWYgKHRyZWUuYXR0KSB7XG4gICAgdHJlZS50ZXh0ID0gJyAnO1xuICAgIGRlbGV0ZSB0cmVlLmF0dDtcbiAgICBkZWxldGUgdHJlZS5jaGlsZHJlbjtcbiAgfSBlbHNlIGlmICh0cmVlLmNoaWxkcmVuKSB7XG4gICAgY29uc3QgYXR0YWNobWVudHMgPSBbXTtcbiAgICBjb25zdCBjaGlsZHJlbiA9IFtdO1xuICAgIGZvciAobGV0IGkgaW4gdHJlZS5jaGlsZHJlbikge1xuICAgICAgY29uc3QgYyA9IHRyZWUuY2hpbGRyZW5baV07XG4gICAgICBpZiAoYy5hdHQpIHtcbiAgICAgICAgaWYgKGF0dGFjaG1lbnRzLmxlbmd0aCA9PSBsaW1pdCkge1xuICAgICAgICAgIC8vIFRvbyBtYW55IGF0dGFjaG1lbnRzIHRvIHByZXZpZXc7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGMuZGF0YVsnbWltZSddID09IEpTT05fTUlNRV9UWVBFKSB7XG4gICAgICAgICAgLy8gSlNPTiBhdHRhY2htZW50cyBhcmUgbm90IHNob3duIGluIHByZXZpZXcuXG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBkZWxldGUgYy5hdHQ7XG4gICAgICAgIGRlbGV0ZSBjLmNoaWxkcmVuO1xuICAgICAgICBjLnRleHQgPSAnICc7XG4gICAgICAgIGF0dGFjaG1lbnRzLnB1c2goYyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjaGlsZHJlbi5wdXNoKGMpO1xuICAgICAgfVxuICAgIH1cbiAgICB0cmVlLmNoaWxkcmVuID0gY2hpbGRyZW4uY29uY2F0KGF0dGFjaG1lbnRzKTtcbiAgfVxuICByZXR1cm4gdHJlZTtcbn1cblxuLy8gR2V0IGEgbGlzdCBvZiBlbnRpdGllcyBmcm9tIGEgdGV4dC5cbmZ1bmN0aW9uIGV4dHJhY3RFbnRpdGllcyhsaW5lKSB7XG4gIGxldCBtYXRjaDtcbiAgbGV0IGV4dHJhY3RlZCA9IFtdO1xuICBFTlRJVFlfVFlQRVMuZm9yRWFjaCgoZW50aXR5KSA9PiB7XG4gICAgd2hpbGUgKChtYXRjaCA9IGVudGl0eS5yZS5leGVjKGxpbmUpKSAhPT0gbnVsbCkge1xuICAgICAgZXh0cmFjdGVkLnB1c2goe1xuICAgICAgICBvZmZzZXQ6IG1hdGNoWydpbmRleCddLFxuICAgICAgICBsZW46IG1hdGNoWzBdLmxlbmd0aCxcbiAgICAgICAgdW5pcXVlOiBtYXRjaFswXSxcbiAgICAgICAgZGF0YTogZW50aXR5LnBhY2sobWF0Y2hbMF0pLFxuICAgICAgICB0eXBlOiBlbnRpdHkubmFtZVxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcblxuICBpZiAoZXh0cmFjdGVkLmxlbmd0aCA9PSAwKSB7XG4gICAgcmV0dXJuIGV4dHJhY3RlZDtcbiAgfVxuXG4gIC8vIFJlbW92ZSBlbnRpdGllcyBkZXRlY3RlZCBpbnNpZGUgb3RoZXIgZW50aXRpZXMsIGxpa2UgI2hhc2h0YWcgaW4gYSBVUkwuXG4gIGV4dHJhY3RlZC5zb3J0KChhLCBiKSA9PiB7XG4gICAgcmV0dXJuIGEub2Zmc2V0IC0gYi5vZmZzZXQ7XG4gIH0pO1xuXG4gIGxldCBpZHggPSAtMTtcbiAgZXh0cmFjdGVkID0gZXh0cmFjdGVkLmZpbHRlcigoZWwpID0+IHtcbiAgICBjb25zdCByZXN1bHQgPSAoZWwub2Zmc2V0ID4gaWR4KTtcbiAgICBpZHggPSBlbC5vZmZzZXQgKyBlbC5sZW47XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSk7XG5cbiAgcmV0dXJuIGV4dHJhY3RlZDtcbn1cblxuLy8gQ29udmVydCB0aGUgY2h1bmtzIGludG8gZm9ybWF0IHN1aXRhYmxlIGZvciBzZXJpYWxpemF0aW9uLlxuZnVuY3Rpb24gZHJhZnRpZnkoY2h1bmtzLCBzdGFydEF0KSB7XG4gIGxldCBwbGFpbiA9ICcnO1xuICBsZXQgcmFuZ2VzID0gW107XG4gIGZvciAobGV0IGkgaW4gY2h1bmtzKSB7XG4gICAgY29uc3QgY2h1bmsgPSBjaHVua3NbaV07XG4gICAgaWYgKCFjaHVuay50eHQpIHtcbiAgICAgIGNvbnN0IGRyYWZ0eSA9IGRyYWZ0aWZ5KGNodW5rLmNoaWxkcmVuLCBwbGFpbi5sZW5ndGggKyBzdGFydEF0KTtcbiAgICAgIGNodW5rLnR4dCA9IGRyYWZ0eS50eHQ7XG4gICAgICByYW5nZXMgPSByYW5nZXMuY29uY2F0KGRyYWZ0eS5mbXQpO1xuICAgIH1cblxuICAgIGlmIChjaHVuay50cCkge1xuICAgICAgcmFuZ2VzLnB1c2goe1xuICAgICAgICBhdDogcGxhaW4ubGVuZ3RoICsgc3RhcnRBdCxcbiAgICAgICAgbGVuOiBjaHVuay50eHQubGVuZ3RoLFxuICAgICAgICB0cDogY2h1bmsudHBcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHBsYWluICs9IGNodW5rLnR4dDtcbiAgfVxuICByZXR1cm4ge1xuICAgIHR4dDogcGxhaW4sXG4gICAgZm10OiByYW5nZXNcbiAgfTtcbn1cblxuLy8gQ3JlYXRlIGEgY29weSBvZiBlbnRpdHkgZGF0YSB3aXRoIChsaWdodD1mYWxzZSkgb3Igd2l0aG91dCAobGlnaHQ9dHJ1ZSkgdGhlIGxhcmdlIHBheWxvYWQuXG4vLyBUaGUgYXJyYXkgJ2FsbG93JyBjb250YWlucyBhIGxpc3Qgb2YgZmllbGRzIGV4ZW1wdCBmcm9tIHN0cmlwcGluZy5cbmZ1bmN0aW9uIGNvcHlFbnREYXRhKGRhdGEsIGxpZ2h0LCBhbGxvdykge1xuICBpZiAoZGF0YSAmJiBPYmplY3QuZW50cmllcyhkYXRhKS5sZW5ndGggPiAwKSB7XG4gICAgYWxsb3cgPSBhbGxvdyB8fCBbXTtcbiAgICBjb25zdCBkYyA9IHt9O1xuICAgIEFMTE9XRURfRU5UX0ZJRUxEUy5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgIGlmIChkYXRhW2tleV0pIHtcbiAgICAgICAgaWYgKGxpZ2h0ICYmICFhbGxvdy5pbmNsdWRlcyhrZXkpICYmXG4gICAgICAgICAgKHR5cGVvZiBkYXRhW2tleV0gPT0gJ3N0cmluZycgfHwgQXJyYXkuaXNBcnJheShkYXRhW2tleV0pKSAmJlxuICAgICAgICAgIGRhdGFba2V5XS5sZW5ndGggPiBNQVhfUFJFVklFV19EQVRBX1NJWkUpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBkYXRhW2tleV0gPT0gJ29iamVjdCcpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZGNba2V5XSA9IGRhdGFba2V5XTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChPYmplY3QuZW50cmllcyhkYykubGVuZ3RoICE9IDApIHtcbiAgICAgIHJldHVybiBkYztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbmlmICh0eXBlb2YgbW9kdWxlICE9ICd1bmRlZmluZWQnKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gRHJhZnR5O1xufVxuIiwiLyoqXG4gKiBAZmlsZSBVdGlsaXRpZXMgZm9yIHVwbG9hZGluZyBhbmQgZG93bmxvYWRpbmcgZmlsZXMuXG4gKlxuICogQGNvcHlyaWdodCAyMDE1LTIwMjIgVGlub2RlIExMQy5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQge1xuICBpc1VybFJlbGF0aXZlLFxuICBqc29uUGFyc2VIZWxwZXJcbn0gZnJvbSAnLi91dGlscy5qcyc7XG5cbmxldCBYSFJQcm92aWRlcjtcblxuLyoqXG4gKiBAY2xhc3MgTGFyZ2VGaWxlSGVscGVyIC0gdXRpbGl0aWVzIGZvciB1cGxvYWRpbmcgYW5kIGRvd25sb2FkaW5nIGZpbGVzIG91dCBvZiBiYW5kLlxuICogRG9uJ3QgaW5zdGFudGlhdGUgdGhpcyBjbGFzcyBkaXJlY3RseS4gVXNlIHtUaW5vZGUuZ2V0TGFyZ2VGaWxlSGVscGVyfSBpbnN0ZWFkLlxuICogQG1lbWJlcm9mIFRpbm9kZVxuICpcbiAqIEBwYXJhbSB7VGlub2RlfSB0aW5vZGUgLSB0aGUgbWFpbiBUaW5vZGUgb2JqZWN0LlxuICogQHBhcmFtIHtzdHJpbmd9IHZlcnNpb24gLSBwcm90b2NvbCB2ZXJzaW9uLCBpLmUuICcwJy5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGFyZ2VGaWxlSGVscGVyIHtcbiAgY29uc3RydWN0b3IodGlub2RlLCB2ZXJzaW9uKSB7XG4gICAgdGhpcy5fdGlub2RlID0gdGlub2RlO1xuICAgIHRoaXMuX3ZlcnNpb24gPSB2ZXJzaW9uO1xuXG4gICAgdGhpcy5fYXBpS2V5ID0gdGlub2RlLl9hcGlLZXk7XG4gICAgdGhpcy5fYXV0aFRva2VuID0gdGlub2RlLmdldEF1dGhUb2tlbigpO1xuICAgIHRoaXMuX3JlcUlkID0gdGlub2RlLmdldE5leHRVbmlxdWVJZCgpO1xuICAgIHRoaXMueGhyID0gbmV3IFhIUlByb3ZpZGVyKCk7XG5cbiAgICAvLyBQcm9taXNlXG4gICAgdGhpcy50b1Jlc29sdmUgPSBudWxsO1xuICAgIHRoaXMudG9SZWplY3QgPSBudWxsO1xuXG4gICAgLy8gQ2FsbGJhY2tzXG4gICAgdGhpcy5vblByb2dyZXNzID0gbnVsbDtcbiAgICB0aGlzLm9uU3VjY2VzcyA9IG51bGw7XG4gICAgdGhpcy5vbkZhaWx1cmUgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0IHVwbG9hZGluZyB0aGUgZmlsZSB0byBhIG5vbi1kZWZhdWx0IGVuZHBvaW50LlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkxhcmdlRmlsZUhlbHBlciNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGJhc2VVcmwgYWx0ZXJuYXRpdmUgYmFzZSBVUkwgb2YgdXBsb2FkIHNlcnZlci5cbiAgICogQHBhcmFtIHtGaWxlfEJsb2J9IGRhdGEgdG8gdXBsb2FkLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gYXZhdGFyRm9yIHRvcGljIG5hbWUgaWYgdGhlIHVwbG9hZCByZXByZXNlbnRzIGFuIGF2YXRhci5cbiAgICogQHBhcmFtIHtDYWxsYmFja30gb25Qcm9ncmVzcyBjYWxsYmFjay4gVGFrZXMgb25lIHtmbG9hdH0gcGFyYW1ldGVyIDAuLjFcbiAgICogQHBhcmFtIHtDYWxsYmFja30gb25TdWNjZXNzIGNhbGxiYWNrLiBDYWxsZWQgd2hlbiB0aGUgZmlsZSBpcyBzdWNjZXNzZnVsbHkgdXBsb2FkZWQuXG4gICAqIEBwYXJhbSB7Q2FsbGJhY2t9IG9uRmFpbHVyZSBjYWxsYmFjay4gQ2FsbGVkIGluIGNhc2Ugb2YgYSBmYWlsdXJlLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgdXBsb2FkIGlzIGNvbXBsZXRlZC9mYWlsZWQuXG4gICAqL1xuICB1cGxvYWRXaXRoQmFzZVVybChiYXNlVXJsLCBkYXRhLCBhdmF0YXJGb3IsIG9uUHJvZ3Jlc3MsIG9uU3VjY2Vzcywgb25GYWlsdXJlKSB7XG4gICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzO1xuXG4gICAgbGV0IHVybCA9IGAvdiR7dGhpcy5fdmVyc2lvbn0vZmlsZS91L2A7XG4gICAgaWYgKGJhc2VVcmwpIHtcbiAgICAgIGxldCBiYXNlID0gYmFzZVVybDtcbiAgICAgIGlmIChiYXNlLmVuZHNXaXRoKCcvJykpIHtcbiAgICAgICAgLy8gUmVtb3ZpbmcgdHJhaWxpbmcgc2xhc2guXG4gICAgICAgIGJhc2UgPSBiYXNlLnNsaWNlKDAsIC0xKTtcbiAgICAgIH1cbiAgICAgIGlmIChiYXNlLnN0YXJ0c1dpdGgoJ2h0dHA6Ly8nKSB8fCBiYXNlLnN0YXJ0c1dpdGgoJ2h0dHBzOi8vJykpIHtcbiAgICAgICAgdXJsID0gYmFzZSArIHVybDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBiYXNlIFVSTCAnJHtiYXNlVXJsfSdgKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy54aHIub3BlbignUE9TVCcsIHVybCwgdHJ1ZSk7XG4gICAgdGhpcy54aHIuc2V0UmVxdWVzdEhlYWRlcignWC1UaW5vZGUtQVBJS2V5JywgdGhpcy5fYXBpS2V5KTtcbiAgICBpZiAodGhpcy5fYXV0aFRva2VuKSB7XG4gICAgICB0aGlzLnhoci5zZXRSZXF1ZXN0SGVhZGVyKCdYLVRpbm9kZS1BdXRoJywgYFRva2VuICR7dGhpcy5fYXV0aFRva2VuLnRva2VufWApO1xuICAgIH1cbiAgICBjb25zdCByZXN1bHQgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLnRvUmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgICB0aGlzLnRvUmVqZWN0ID0gcmVqZWN0O1xuICAgIH0pO1xuXG4gICAgdGhpcy5vblByb2dyZXNzID0gb25Qcm9ncmVzcztcbiAgICB0aGlzLm9uU3VjY2VzcyA9IG9uU3VjY2VzcztcbiAgICB0aGlzLm9uRmFpbHVyZSA9IG9uRmFpbHVyZTtcblxuICAgIHRoaXMueGhyLnVwbG9hZC5vbnByb2dyZXNzID0gKGUpID0+IHtcbiAgICAgIGlmIChlLmxlbmd0aENvbXB1dGFibGUgJiYgaW5zdGFuY2Uub25Qcm9ncmVzcykge1xuICAgICAgICBpbnN0YW5jZS5vblByb2dyZXNzKGUubG9hZGVkIC8gZS50b3RhbCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRoaXMueGhyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgbGV0IHBrdDtcbiAgICAgIHRyeSB7XG4gICAgICAgIHBrdCA9IEpTT04ucGFyc2UodGhpcy5yZXNwb25zZSwganNvblBhcnNlSGVscGVyKTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBpbnN0YW5jZS5fdGlub2RlLmxvZ2dlcihcIkVSUk9SOiBJbnZhbGlkIHNlcnZlciByZXNwb25zZSBpbiBMYXJnZUZpbGVIZWxwZXJcIiwgdGhpcy5yZXNwb25zZSk7XG4gICAgICAgIHBrdCA9IHtcbiAgICAgICAgICBjdHJsOiB7XG4gICAgICAgICAgICBjb2RlOiB0aGlzLnN0YXR1cyxcbiAgICAgICAgICAgIHRleHQ6IHRoaXMuc3RhdHVzVGV4dFxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuc3RhdHVzID49IDIwMCAmJiB0aGlzLnN0YXR1cyA8IDMwMCkge1xuICAgICAgICBpZiAoaW5zdGFuY2UudG9SZXNvbHZlKSB7XG4gICAgICAgICAgaW5zdGFuY2UudG9SZXNvbHZlKHBrdC5jdHJsLnBhcmFtcy51cmwpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpbnN0YW5jZS5vblN1Y2Nlc3MpIHtcbiAgICAgICAgICBpbnN0YW5jZS5vblN1Y2Nlc3MocGt0LmN0cmwpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdHVzID49IDQwMCkge1xuICAgICAgICBpZiAoaW5zdGFuY2UudG9SZWplY3QpIHtcbiAgICAgICAgICBpbnN0YW5jZS50b1JlamVjdChuZXcgRXJyb3IoYCR7cGt0LmN0cmwudGV4dH0gKCR7cGt0LmN0cmwuY29kZX0pYCkpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpbnN0YW5jZS5vbkZhaWx1cmUpIHtcbiAgICAgICAgICBpbnN0YW5jZS5vbkZhaWx1cmUocGt0LmN0cmwpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbnN0YW5jZS5fdGlub2RlLmxvZ2dlcihcIkVSUk9SOiBVbmV4cGVjdGVkIHNlcnZlciByZXNwb25zZSBzdGF0dXNcIiwgdGhpcy5zdGF0dXMsIHRoaXMucmVzcG9uc2UpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLnhoci5vbmVycm9yID0gZnVuY3Rpb24oZSkge1xuICAgICAgaWYgKGluc3RhbmNlLnRvUmVqZWN0KSB7XG4gICAgICAgIGluc3RhbmNlLnRvUmVqZWN0KG5ldyBFcnJvcihcImZhaWxlZFwiKSk7XG4gICAgICB9XG4gICAgICBpZiAoaW5zdGFuY2Uub25GYWlsdXJlKSB7XG4gICAgICAgIGluc3RhbmNlLm9uRmFpbHVyZShudWxsKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy54aHIub25hYm9ydCA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgIGlmIChpbnN0YW5jZS50b1JlamVjdCkge1xuICAgICAgICBpbnN0YW5jZS50b1JlamVjdChuZXcgRXJyb3IoXCJ1cGxvYWQgY2FuY2VsbGVkIGJ5IHVzZXJcIikpO1xuICAgICAgfVxuICAgICAgaWYgKGluc3RhbmNlLm9uRmFpbHVyZSkge1xuICAgICAgICBpbnN0YW5jZS5vbkZhaWx1cmUobnVsbCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCBmb3JtID0gbmV3IEZvcm1EYXRhKCk7XG4gICAgICBmb3JtLmFwcGVuZCgnZmlsZScsIGRhdGEpO1xuICAgICAgZm9ybS5zZXQoJ2lkJywgdGhpcy5fcmVxSWQpO1xuICAgICAgaWYgKGF2YXRhckZvcikge1xuICAgICAgICBmb3JtLnNldCgndG9waWMnLCBhdmF0YXJGb3IpO1xuICAgICAgfVxuICAgICAgdGhpcy54aHIuc2VuZChmb3JtKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGlmICh0aGlzLnRvUmVqZWN0KSB7XG4gICAgICAgIHRoaXMudG9SZWplY3QoZXJyKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLm9uRmFpbHVyZSkge1xuICAgICAgICB0aGlzLm9uRmFpbHVyZShudWxsKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIC8qKlxuICAgKiBTdGFydCB1cGxvYWRpbmcgdGhlIGZpbGUgdG8gZGVmYXVsdCBlbmRwb2ludC5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZS5MYXJnZUZpbGVIZWxwZXIjXG4gICAqXG4gICAqIEBwYXJhbSB7RmlsZXxCbG9ifSBkYXRhIHRvIHVwbG9hZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gYXZhdGFyRm9yIHRvcGljIG5hbWUgaWYgdGhlIHVwbG9hZCByZXByZXNlbnRzIGFuIGF2YXRhci5cbiAgICogQHBhcmFtIHtDYWxsYmFja30gb25Qcm9ncmVzcyBjYWxsYmFjay4gVGFrZXMgb25lIHtmbG9hdH0gcGFyYW1ldGVyIDAuLjFcbiAgICogQHBhcmFtIHtDYWxsYmFja30gb25TdWNjZXNzIGNhbGxiYWNrLiBDYWxsZWQgd2hlbiB0aGUgZmlsZSBpcyBzdWNjZXNzZnVsbHkgdXBsb2FkZWQuXG4gICAqIEBwYXJhbSB7Q2FsbGJhY2t9IG9uRmFpbHVyZSBjYWxsYmFjay4gQ2FsbGVkIGluIGNhc2Ugb2YgYSBmYWlsdXJlLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgdXBsb2FkIGlzIGNvbXBsZXRlZC9mYWlsZWQuXG4gICAqL1xuICB1cGxvYWQoZGF0YSwgYXZhdGFyRm9yLCBvblByb2dyZXNzLCBvblN1Y2Nlc3MsIG9uRmFpbHVyZSkge1xuICAgIGNvbnN0IGJhc2VVcmwgPSAodGhpcy5fdGlub2RlLl9zZWN1cmUgPyAnaHR0cHM6Ly8nIDogJ2h0dHA6Ly8nKSArIHRoaXMuX3Rpbm9kZS5faG9zdDtcbiAgICByZXR1cm4gdGhpcy51cGxvYWRXaXRoQmFzZVVybChiYXNlVXJsLCBkYXRhLCBhdmF0YXJGb3IsIG9uUHJvZ3Jlc3MsIG9uU3VjY2Vzcywgb25GYWlsdXJlKTtcbiAgfVxuICAvKipcbiAgICogRG93bmxvYWQgdGhlIGZpbGUgZnJvbSBhIGdpdmVuIFVSTCB1c2luZyBHRVQgcmVxdWVzdC4gVGhpcyBtZXRob2Qgd29ya3Mgd2l0aCB0aGUgVGlub2RlIHNlcnZlciBvbmx5LlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkxhcmdlRmlsZUhlbHBlciNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHJlbGF0aXZlVXJsIC0gVVJMIHRvIGRvd25sb2FkIHRoZSBmaWxlIGZyb20uIE11c3QgYmUgcmVsYXRpdmUgdXJsLCBpLmUuIG11c3Qgbm90IGNvbnRhaW4gdGhlIGhvc3QuXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gZmlsZW5hbWUgLSBmaWxlIG5hbWUgdG8gdXNlIGZvciB0aGUgZG93bmxvYWRlZCBmaWxlLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgZG93bmxvYWQgaXMgY29tcGxldGVkL2ZhaWxlZC5cbiAgICovXG4gIGRvd25sb2FkKHJlbGF0aXZlVXJsLCBmaWxlbmFtZSwgbWltZXR5cGUsIG9uUHJvZ3Jlc3MsIG9uRXJyb3IpIHtcbiAgICBpZiAoIWlzVXJsUmVsYXRpdmUocmVsYXRpdmVVcmwpKSB7XG4gICAgICAvLyBBcyBhIHNlY3VyaXR5IG1lYXN1cmUgcmVmdXNlIHRvIGRvd25sb2FkIGZyb20gYW4gYWJzb2x1dGUgVVJMLlxuICAgICAgaWYgKG9uRXJyb3IpIHtcbiAgICAgICAgb25FcnJvcihgVGhlIFVSTCAnJHtyZWxhdGl2ZVVybH0nIG11c3QgYmUgcmVsYXRpdmUsIG5vdCBhYnNvbHV0ZWApO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuX2F1dGhUb2tlbikge1xuICAgICAgaWYgKG9uRXJyb3IpIHtcbiAgICAgICAgb25FcnJvcihcIk11c3QgYXV0aGVudGljYXRlIGZpcnN0XCIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXM7XG4gICAgLy8gR2V0IGRhdGEgYXMgYmxvYiAoc3RvcmVkIGJ5IHRoZSBicm93c2VyIGFzIGEgdGVtcG9yYXJ5IGZpbGUpLlxuICAgIHRoaXMueGhyLm9wZW4oJ0dFVCcsIHJlbGF0aXZlVXJsLCB0cnVlKTtcbiAgICB0aGlzLnhoci5zZXRSZXF1ZXN0SGVhZGVyKCdYLVRpbm9kZS1BUElLZXknLCB0aGlzLl9hcGlLZXkpO1xuICAgIHRoaXMueGhyLnNldFJlcXVlc3RIZWFkZXIoJ1gtVGlub2RlLUF1dGgnLCAnVG9rZW4gJyArIHRoaXMuX2F1dGhUb2tlbi50b2tlbik7XG4gICAgdGhpcy54aHIucmVzcG9uc2VUeXBlID0gJ2Jsb2InO1xuXG4gICAgdGhpcy5vblByb2dyZXNzID0gb25Qcm9ncmVzcztcbiAgICB0aGlzLnhoci5vbnByb2dyZXNzID0gZnVuY3Rpb24oZSkge1xuICAgICAgaWYgKGluc3RhbmNlLm9uUHJvZ3Jlc3MpIHtcbiAgICAgICAgLy8gUGFzc2luZyBlLmxvYWRlZCBpbnN0ZWFkIG9mIGUubG9hZGVkL2UudG90YWwgYmVjYXVzZSBlLnRvdGFsXG4gICAgICAgIC8vIGlzIGFsd2F5cyAwIHdpdGggZ3ppcCBjb21wcmVzc2lvbiBlbmFibGVkIGJ5IHRoZSBzZXJ2ZXIuXG4gICAgICAgIGluc3RhbmNlLm9uUHJvZ3Jlc3MoZS5sb2FkZWQpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCByZXN1bHQgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLnRvUmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgICB0aGlzLnRvUmVqZWN0ID0gcmVqZWN0O1xuICAgIH0pO1xuXG4gICAgLy8gVGhlIGJsb2IgbmVlZHMgdG8gYmUgc2F2ZWQgYXMgZmlsZS4gVGhlcmUgaXMgbm8ga25vd24gd2F5IHRvXG4gICAgLy8gc2F2ZSB0aGUgYmxvYiBhcyBmaWxlIG90aGVyIHRoYW4gdG8gZmFrZSBhIGNsaWNrIG9uIGFuIDxhIGhyZWYuLi4gZG93bmxvYWQ9Li4uPi5cbiAgICB0aGlzLnhoci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLnN0YXR1cyA9PSAyMDApIHtcbiAgICAgICAgY29uc3QgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICAgICAgLy8gVVJMLmNyZWF0ZU9iamVjdFVSTCBpcyBub3QgYXZhaWxhYmxlIGluIG5vbi1icm93c2VyIGVudmlyb25tZW50LiBUaGlzIGNhbGwgd2lsbCBmYWlsLlxuICAgICAgICBsaW5rLmhyZWYgPSB3aW5kb3cuVVJMLmNyZWF0ZU9iamVjdFVSTChuZXcgQmxvYihbdGhpcy5yZXNwb25zZV0sIHtcbiAgICAgICAgICB0eXBlOiBtaW1ldHlwZVxuICAgICAgICB9KSk7XG4gICAgICAgIGxpbmsuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgbGluay5zZXRBdHRyaWJ1dGUoJ2Rvd25sb2FkJywgZmlsZW5hbWUpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGxpbmspO1xuICAgICAgICBsaW5rLmNsaWNrKCk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQobGluayk7XG4gICAgICAgIHdpbmRvdy5VUkwucmV2b2tlT2JqZWN0VVJMKGxpbmsuaHJlZik7XG4gICAgICAgIGlmIChpbnN0YW5jZS50b1Jlc29sdmUpIHtcbiAgICAgICAgICBpbnN0YW5jZS50b1Jlc29sdmUoKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0aGlzLnN0YXR1cyA+PSA0MDAgJiYgaW5zdGFuY2UudG9SZWplY3QpIHtcbiAgICAgICAgLy8gVGhlIHRoaXMucmVzcG9uc2VUZXh0IGlzIHVuZGVmaW5lZCwgbXVzdCB1c2UgdGhpcy5yZXNwb25zZSB3aGljaCBpcyBhIGJsb2IuXG4gICAgICAgIC8vIE5lZWQgdG8gY29udmVydCB0aGlzLnJlc3BvbnNlIHRvIEpTT04uIFRoZSBibG9iIGNhbiBvbmx5IGJlIGFjY2Vzc2VkIGJ5IHRoZVxuICAgICAgICAvLyBGaWxlUmVhZGVyLlxuICAgICAgICBjb25zdCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgICAgICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHBrdCA9IEpTT04ucGFyc2UodGhpcy5yZXN1bHQsIGpzb25QYXJzZUhlbHBlcik7XG4gICAgICAgICAgICBpbnN0YW5jZS50b1JlamVjdChuZXcgRXJyb3IoYCR7cGt0LmN0cmwudGV4dH0gKCR7cGt0LmN0cmwuY29kZX0pYCkpO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgaW5zdGFuY2UuX3Rpbm9kZS5sb2dnZXIoXCJFUlJPUjogSW52YWxpZCBzZXJ2ZXIgcmVzcG9uc2UgaW4gTGFyZ2VGaWxlSGVscGVyXCIsIHRoaXMucmVzdWx0KTtcbiAgICAgICAgICAgIGluc3RhbmNlLnRvUmVqZWN0KGVycik7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICByZWFkZXIucmVhZEFzVGV4dCh0aGlzLnJlc3BvbnNlKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy54aHIub25lcnJvciA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgIGlmIChpbnN0YW5jZS50b1JlamVjdCkge1xuICAgICAgICBpbnN0YW5jZS50b1JlamVjdChuZXcgRXJyb3IoXCJmYWlsZWRcIikpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLnhoci5vbmFib3J0ID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoaW5zdGFuY2UudG9SZWplY3QpIHtcbiAgICAgICAgaW5zdGFuY2UudG9SZWplY3QobnVsbCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRyeSB7XG4gICAgICB0aGlzLnhoci5zZW5kKCk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBpZiAodGhpcy50b1JlamVjdCkge1xuICAgICAgICB0aGlzLnRvUmVqZWN0KGVycik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICAvKipcbiAgICogVHJ5IHRvIGNhbmNlbCBhbiBvbmdvaW5nIHVwbG9hZCBvciBkb3dubG9hZC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5MYXJnZUZpbGVIZWxwZXIjXG4gICAqL1xuICBjYW5jZWwoKSB7XG4gICAgaWYgKHRoaXMueGhyICYmIHRoaXMueGhyLnJlYWR5U3RhdGUgPCA0KSB7XG4gICAgICB0aGlzLnhoci5hYm9ydCgpO1xuICAgIH1cbiAgfVxuICAvKipcbiAgICogR2V0IHVuaXF1ZSBpZCBvZiB0aGlzIHJlcXVlc3QuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTGFyZ2VGaWxlSGVscGVyI1xuICAgKlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSB1bmlxdWUgaWRcbiAgICovXG4gIGdldElkKCkge1xuICAgIHJldHVybiB0aGlzLl9yZXFJZDtcbiAgfVxuICAvKipcbiAgICogVG8gdXNlIExhcmdlRmlsZUhlbHBlciBpbiBhIG5vbiBicm93c2VyIGNvbnRleHQsIHN1cHBseSBYTUxIdHRwUmVxdWVzdCBwcm92aWRlci5cbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyb2YgTGFyZ2VGaWxlSGVscGVyXG4gICAqIEBwYXJhbSB4aHJQcm92aWRlciBYTUxIdHRwUmVxdWVzdCBwcm92aWRlciwgZS5nLiBmb3Igbm9kZSA8Y29kZT5yZXF1aXJlKCd4aHInKTwvY29kZT4uXG4gICAqL1xuICBzdGF0aWMgc2V0TmV0d29ya1Byb3ZpZGVyKHhoclByb3ZpZGVyKSB7XG4gICAgWEhSUHJvdmlkZXIgPSB4aHJQcm92aWRlcjtcbiAgfVxufVxuIiwiLyoqXG4gKiBAZmlsZSBIZWxwZXIgY2xhc3MgZm9yIGNvbnN0cnVjdGluZyB7QGxpbmsgVGlub2RlLkdldFF1ZXJ5fS5cbiAqXG4gKiBAY29weXJpZ2h0IDIwMTUtMjAyMiBUaW5vZGUgTExDLlxuICovXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogSGVscGVyIGNsYXNzIGZvciBjb25zdHJ1Y3Rpbmcge0BsaW5rIFRpbm9kZS5HZXRRdWVyeX0uXG4gKlxuICogQGNsYXNzIE1ldGFHZXRCdWlsZGVyXG4gKiBAbWVtYmVyb2YgVGlub2RlXG4gKlxuICogQHBhcmFtIHtUaW5vZGUuVG9waWN9IHBhcmVudCB0b3BpYyB3aGljaCBpbnN0YW50aWF0ZWQgdGhpcyBidWlsZGVyLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNZXRhR2V0QnVpbGRlciB7XG4gIGNvbnN0cnVjdG9yKHBhcmVudCkge1xuICAgIHRoaXMudG9waWMgPSBwYXJlbnQ7XG4gICAgdGhpcy53aGF0ID0ge307XG4gIH1cblxuICAvLyBHZXQgdGltZXN0YW1wIG9mIHRoZSBtb3N0IHJlY2VudCBkZXNjIHVwZGF0ZS5cbiAgI2dldF9kZXNjX2ltcygpIHtcbiAgICByZXR1cm4gdGhpcy50b3BpYy51cGRhdGVkO1xuICB9XG5cbiAgLy8gR2V0IHRpbWVzdGFtcCBvZiB0aGUgbW9zdCByZWNlbnQgc3VicyB1cGRhdGUuXG4gICNnZXRfc3Vic19pbXMoKSB7XG4gICAgaWYgKHRoaXMudG9waWMuaXNQMlBUeXBlKCkpIHtcbiAgICAgIHJldHVybiB0aGlzLiNnZXRfZGVzY19pbXMoKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMudG9waWMuX2xhc3RTdWJzVXBkYXRlO1xuICB9XG4gIC8qKlxuICAgKiBBZGQgcXVlcnkgcGFyYW1ldGVycyB0byBmZXRjaCBtZXNzYWdlcyB3aXRoaW4gZXhwbGljaXQgbGltaXRzLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLk1ldGFHZXRCdWlsZGVyI1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcj19IHNpbmNlIC0gbWVzc2FnZXMgbmV3ZXIgdGhhbiB0aGlzIChpbmNsdXNpdmUpO1xuICAgKiBAcGFyYW0ge251bWJlcj19IGJlZm9yZSAtIG9sZGVyIHRoYW4gdGhpcyAoZXhjbHVzaXZlKVxuICAgKiBAcGFyYW0ge251bWJlcj19IGxpbWl0IC0gbnVtYmVyIG9mIG1lc3NhZ2VzIHRvIGZldGNoXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuTWV0YUdldEJ1aWxkZXJ9IDxjb2RlPnRoaXM8L2NvZGU+IG9iamVjdC5cbiAgICovXG4gIHdpdGhEYXRhKHNpbmNlLCBiZWZvcmUsIGxpbWl0KSB7XG4gICAgdGhpcy53aGF0WydkYXRhJ10gPSB7XG4gICAgICBzaW5jZTogc2luY2UsXG4gICAgICBiZWZvcmU6IGJlZm9yZSxcbiAgICAgIGxpbWl0OiBsaW1pdFxuICAgIH07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLyoqXG4gICAqIEFkZCBxdWVyeSBwYXJhbWV0ZXJzIHRvIGZldGNoIG1lc3NhZ2VzIG5ld2VyIHRoYW4gdGhlIGxhdGVzdCBzYXZlZCBtZXNzYWdlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLk1ldGFHZXRCdWlsZGVyI1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcj19IGxpbWl0IC0gbnVtYmVyIG9mIG1lc3NhZ2VzIHRvIGZldGNoXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuTWV0YUdldEJ1aWxkZXJ9IDxjb2RlPnRoaXM8L2NvZGU+IG9iamVjdC5cbiAgICovXG4gIHdpdGhMYXRlckRhdGEobGltaXQpIHtcbiAgICByZXR1cm4gdGhpcy53aXRoRGF0YSh0aGlzLnRvcGljLl9tYXhTZXEgPiAwID8gdGhpcy50b3BpYy5fbWF4U2VxICsgMSA6IHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBsaW1pdCk7XG4gIH1cbiAgLyoqXG4gICAqIEFkZCBxdWVyeSBwYXJhbWV0ZXJzIHRvIGZldGNoIG1lc3NhZ2VzIG9sZGVyIHRoYW4gdGhlIGVhcmxpZXN0IHNhdmVkIG1lc3NhZ2UuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTWV0YUdldEJ1aWxkZXIjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gbGltaXQgLSBtYXhpbXVtIG51bWJlciBvZiBtZXNzYWdlcyB0byBmZXRjaC5cbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5NZXRhR2V0QnVpbGRlcn0gPGNvZGU+dGhpczwvY29kZT4gb2JqZWN0LlxuICAgKi9cbiAgd2l0aEVhcmxpZXJEYXRhKGxpbWl0KSB7XG4gICAgcmV0dXJuIHRoaXMud2l0aERhdGEodW5kZWZpbmVkLCB0aGlzLnRvcGljLl9taW5TZXEgPiAwID8gdGhpcy50b3BpYy5fbWluU2VxIDogdW5kZWZpbmVkLCBsaW1pdCk7XG4gIH1cbiAgLyoqXG4gICAqIEFkZCBxdWVyeSBwYXJhbWV0ZXJzIHRvIGZldGNoIHRvcGljIGRlc2NyaXB0aW9uIGlmIGl0J3MgbmV3ZXIgdGhhbiB0aGUgZ2l2ZW4gdGltZXN0YW1wLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLk1ldGFHZXRCdWlsZGVyI1xuICAgKlxuICAgKiBAcGFyYW0ge0RhdGU9fSBpbXMgLSBmZXRjaCBtZXNzYWdlcyBuZXdlciB0aGFuIHRoaXMgdGltZXN0YW1wLlxuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLk1ldGFHZXRCdWlsZGVyfSA8Y29kZT50aGlzPC9jb2RlPiBvYmplY3QuXG4gICAqL1xuICB3aXRoRGVzYyhpbXMpIHtcbiAgICB0aGlzLndoYXRbJ2Rlc2MnXSA9IHtcbiAgICAgIGltczogaW1zXG4gICAgfTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICAvKipcbiAgICogQWRkIHF1ZXJ5IHBhcmFtZXRlcnMgdG8gZmV0Y2ggdG9waWMgZGVzY3JpcHRpb24gaWYgaXQncyBuZXdlciB0aGFuIHRoZSBsYXN0IHVwZGF0ZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5NZXRhR2V0QnVpbGRlciNcbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5NZXRhR2V0QnVpbGRlcn0gPGNvZGU+dGhpczwvY29kZT4gb2JqZWN0LlxuICAgKi9cbiAgd2l0aExhdGVyRGVzYygpIHtcbiAgICByZXR1cm4gdGhpcy53aXRoRGVzYyh0aGlzLiNnZXRfZGVzY19pbXMoKSk7XG4gIH1cbiAgLyoqXG4gICAqIEFkZCBxdWVyeSBwYXJhbWV0ZXJzIHRvIGZldGNoIHN1YnNjcmlwdGlvbnMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTWV0YUdldEJ1aWxkZXIjXG4gICAqXG4gICAqIEBwYXJhbSB7RGF0ZT19IGltcyAtIGZldGNoIHN1YnNjcmlwdGlvbnMgbW9kaWZpZWQgbW9yZSByZWNlbnRseSB0aGFuIHRoaXMgdGltZXN0YW1wXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gbGltaXQgLSBtYXhpbXVtIG51bWJlciBvZiBzdWJzY3JpcHRpb25zIHRvIGZldGNoLlxuICAgKiBAcGFyYW0ge3N0cmluZz19IHVzZXJPclRvcGljIC0gdXNlciBJRCBvciB0b3BpYyBuYW1lIHRvIGZldGNoIGZvciBmZXRjaGluZyBvbmUgc3Vic2NyaXB0aW9uLlxuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLk1ldGFHZXRCdWlsZGVyfSA8Y29kZT50aGlzPC9jb2RlPiBvYmplY3QuXG4gICAqL1xuICB3aXRoU3ViKGltcywgbGltaXQsIHVzZXJPclRvcGljKSB7XG4gICAgY29uc3Qgb3B0cyA9IHtcbiAgICAgIGltczogaW1zLFxuICAgICAgbGltaXQ6IGxpbWl0XG4gICAgfTtcbiAgICBpZiAodGhpcy50b3BpYy5nZXRUeXBlKCkgPT0gJ21lJykge1xuICAgICAgb3B0cy50b3BpYyA9IHVzZXJPclRvcGljO1xuICAgIH0gZWxzZSB7XG4gICAgICBvcHRzLnVzZXIgPSB1c2VyT3JUb3BpYztcbiAgICB9XG4gICAgdGhpcy53aGF0WydzdWInXSA9IG9wdHM7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLyoqXG4gICAqIEFkZCBxdWVyeSBwYXJhbWV0ZXJzIHRvIGZldGNoIGEgc2luZ2xlIHN1YnNjcmlwdGlvbi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5NZXRhR2V0QnVpbGRlciNcbiAgICpcbiAgICogQHBhcmFtIHtEYXRlPX0gaW1zIC0gZmV0Y2ggc3Vic2NyaXB0aW9ucyBtb2RpZmllZCBtb3JlIHJlY2VudGx5IHRoYW4gdGhpcyB0aW1lc3RhbXBcbiAgICogQHBhcmFtIHtzdHJpbmc9fSB1c2VyT3JUb3BpYyAtIHVzZXIgSUQgb3IgdG9waWMgbmFtZSB0byBmZXRjaCBmb3IgZmV0Y2hpbmcgb25lIHN1YnNjcmlwdGlvbi5cbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5NZXRhR2V0QnVpbGRlcn0gPGNvZGU+dGhpczwvY29kZT4gb2JqZWN0LlxuICAgKi9cbiAgd2l0aE9uZVN1YihpbXMsIHVzZXJPclRvcGljKSB7XG4gICAgcmV0dXJuIHRoaXMud2l0aFN1YihpbXMsIHVuZGVmaW5lZCwgdXNlck9yVG9waWMpO1xuICB9XG4gIC8qKlxuICAgKiBBZGQgcXVlcnkgcGFyYW1ldGVycyB0byBmZXRjaCBhIHNpbmdsZSBzdWJzY3JpcHRpb24gaWYgaXQncyBiZWVuIHVwZGF0ZWQgc2luY2UgdGhlIGxhc3QgdXBkYXRlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLk1ldGFHZXRCdWlsZGVyI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZz19IHVzZXJPclRvcGljIC0gdXNlciBJRCBvciB0b3BpYyBuYW1lIHRvIGZldGNoIGZvciBmZXRjaGluZyBvbmUgc3Vic2NyaXB0aW9uLlxuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLk1ldGFHZXRCdWlsZGVyfSA8Y29kZT50aGlzPC9jb2RlPiBvYmplY3QuXG4gICAqL1xuICB3aXRoTGF0ZXJPbmVTdWIodXNlck9yVG9waWMpIHtcbiAgICByZXR1cm4gdGhpcy53aXRoT25lU3ViKHRoaXMudG9waWMuX2xhc3RTdWJzVXBkYXRlLCB1c2VyT3JUb3BpYyk7XG4gIH1cbiAgLyoqXG4gICAqIEFkZCBxdWVyeSBwYXJhbWV0ZXJzIHRvIGZldGNoIHN1YnNjcmlwdGlvbnMgdXBkYXRlZCBzaW5jZSB0aGUgbGFzdCB1cGRhdGUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTWV0YUdldEJ1aWxkZXIjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gbGltaXQgLSBtYXhpbXVtIG51bWJlciBvZiBzdWJzY3JpcHRpb25zIHRvIGZldGNoLlxuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLk1ldGFHZXRCdWlsZGVyfSA8Y29kZT50aGlzPC9jb2RlPiBvYmplY3QuXG4gICAqL1xuICB3aXRoTGF0ZXJTdWIobGltaXQpIHtcbiAgICByZXR1cm4gdGhpcy53aXRoU3ViKHRoaXMuI2dldF9zdWJzX2ltcygpLCBsaW1pdCk7XG4gIH1cbiAgLyoqXG4gICAqIEFkZCBxdWVyeSBwYXJhbWV0ZXJzIHRvIGZldGNoIHRvcGljIHRhZ3MuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTWV0YUdldEJ1aWxkZXIjXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuTWV0YUdldEJ1aWxkZXJ9IDxjb2RlPnRoaXM8L2NvZGU+IG9iamVjdC5cbiAgICovXG4gIHdpdGhUYWdzKCkge1xuICAgIHRoaXMud2hhdFsndGFncyddID0gdHJ1ZTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICAvKipcbiAgICogQWRkIHF1ZXJ5IHBhcmFtZXRlcnMgdG8gZmV0Y2ggdXNlcidzIGNyZWRlbnRpYWxzLiA8Y29kZT4nbWUnPC9jb2RlPiB0b3BpYyBvbmx5LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLk1ldGFHZXRCdWlsZGVyI1xuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLk1ldGFHZXRCdWlsZGVyfSA8Y29kZT50aGlzPC9jb2RlPiBvYmplY3QuXG4gICAqL1xuICB3aXRoQ3JlZCgpIHtcbiAgICBpZiAodGhpcy50b3BpYy5nZXRUeXBlKCkgPT0gJ21lJykge1xuICAgICAgdGhpcy53aGF0WydjcmVkJ10gPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnRvcGljLl90aW5vZGUubG9nZ2VyKFwiRVJST1I6IEludmFsaWQgdG9waWMgdHlwZSBmb3IgTWV0YUdldEJ1aWxkZXI6d2l0aENyZWRzXCIsIHRoaXMudG9waWMuZ2V0VHlwZSgpKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLyoqXG4gICAqIEFkZCBxdWVyeSBwYXJhbWV0ZXJzIHRvIGZldGNoIGRlbGV0ZWQgbWVzc2FnZXMgd2l0aGluIGV4cGxpY2l0IGxpbWl0cy4gQW55L2FsbCBwYXJhbWV0ZXJzIGNhbiBiZSBudWxsLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLk1ldGFHZXRCdWlsZGVyI1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcj19IHNpbmNlIC0gaWRzIG9mIG1lc3NhZ2VzIGRlbGV0ZWQgc2luY2UgdGhpcyAnZGVsJyBpZCAoaW5jbHVzaXZlKVxuICAgKiBAcGFyYW0ge251bWJlcj19IGxpbWl0IC0gbnVtYmVyIG9mIGRlbGV0ZWQgbWVzc2FnZSBpZHMgdG8gZmV0Y2hcbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5NZXRhR2V0QnVpbGRlcn0gPGNvZGU+dGhpczwvY29kZT4gb2JqZWN0LlxuICAgKi9cbiAgd2l0aERlbChzaW5jZSwgbGltaXQpIHtcbiAgICBpZiAoc2luY2UgfHwgbGltaXQpIHtcbiAgICAgIHRoaXMud2hhdFsnZGVsJ10gPSB7XG4gICAgICAgIHNpbmNlOiBzaW5jZSxcbiAgICAgICAgbGltaXQ6IGxpbWl0XG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICAvKipcbiAgICogQWRkIHF1ZXJ5IHBhcmFtZXRlcnMgdG8gZmV0Y2ggbWVzc2FnZXMgZGVsZXRlZCBhZnRlciB0aGUgc2F2ZWQgPGNvZGU+J2RlbCc8L2NvZGU+IGlkLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLk1ldGFHZXRCdWlsZGVyI1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcj19IGxpbWl0IC0gbnVtYmVyIG9mIGRlbGV0ZWQgbWVzc2FnZSBpZHMgdG8gZmV0Y2hcbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5NZXRhR2V0QnVpbGRlcn0gPGNvZGU+dGhpczwvY29kZT4gb2JqZWN0LlxuICAgKi9cbiAgd2l0aExhdGVyRGVsKGxpbWl0KSB7XG4gICAgLy8gU3BlY2lmeSAnc2luY2UnIG9ubHkgaWYgd2UgaGF2ZSBhbHJlYWR5IHJlY2VpdmVkIHNvbWUgbWVzc2FnZXMuIElmXG4gICAgLy8gd2UgaGF2ZSBubyBsb2NhbGx5IGNhY2hlZCBtZXNzYWdlcyB0aGVuIHdlIGRvbid0IGNhcmUgaWYgYW55IG1lc3NhZ2VzIHdlcmUgZGVsZXRlZC5cbiAgICByZXR1cm4gdGhpcy53aXRoRGVsKHRoaXMudG9waWMuX21heFNlcSA+IDAgPyB0aGlzLnRvcGljLl9tYXhEZWwgKyAxIDogdW5kZWZpbmVkLCBsaW1pdCk7XG4gIH1cblxuICAvKipcbiAgICogRXh0cmFjdCBzdWJxdWVyeTogZ2V0IGFuIG9iamVjdCB0aGF0IGNvbnRhaW5zIHNwZWNpZmllZCBzdWJxdWVyeS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5NZXRhR2V0QnVpbGRlciNcbiAgICogQHBhcmFtIHtzdHJpbmd9IHdoYXQgLSBzdWJxdWVyeSB0byByZXR1cm46IG9uZSBvZiAnZGF0YScsICdzdWInLCAnZGVzYycsICd0YWdzJywgJ2NyZWQnLCAnZGVsJy5cbiAgICogQHJldHVybnMge09iamVjdH0gcmVxdWVzdGVkIHN1YnF1ZXJ5IG9yIDxjb2RlPnVuZGVmaW5lZDwvY29kZT4uXG4gICAqL1xuICBleHRyYWN0KHdoYXQpIHtcbiAgICByZXR1cm4gdGhpcy53aGF0W3doYXRdO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdCBwYXJhbWV0ZXJzLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLk1ldGFHZXRCdWlsZGVyI1xuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLkdldFF1ZXJ5fSBHZXQgcXVlcnlcbiAgICovXG4gIGJ1aWxkKCkge1xuICAgIGNvbnN0IHdoYXQgPSBbXTtcbiAgICBsZXQgcGFyYW1zID0ge307XG4gICAgWydkYXRhJywgJ3N1YicsICdkZXNjJywgJ3RhZ3MnLCAnY3JlZCcsICdkZWwnXS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgIGlmICh0aGlzLndoYXQuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICB3aGF0LnB1c2goa2V5KTtcbiAgICAgICAgaWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRoaXMud2hhdFtrZXldKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgcGFyYW1zW2tleV0gPSB0aGlzLndoYXRba2V5XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIGlmICh3aGF0Lmxlbmd0aCA+IDApIHtcbiAgICAgIHBhcmFtcy53aGF0ID0gd2hhdC5qb2luKCcgJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhcmFtcyA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgcmV0dXJuIHBhcmFtcztcbiAgfVxufVxuIiwiLyoqXG4gKiBAbW9kdWxlIHRpbm9kZS1zZGtcbiAqXG4gKiBAY29weXJpZ2h0IDIwMTUtMjAyMiBUaW5vZGUgTExDLlxuICogQHN1bW1hcnkgSmF2YXNjcmlwdCBiaW5kaW5ncyBmb3IgVGlub2RlLlxuICogQGxpY2Vuc2UgQXBhY2hlIDIuMFxuICogQHZlcnNpb24gMC4yMFxuICpcbiAqIFNlZSA8YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL3Rpbm9kZS93ZWJhcHBcIj5odHRwczovL2dpdGh1Yi5jb20vdGlub2RlL3dlYmFwcDwvYT4gZm9yIHJlYWwtbGlmZSB1c2FnZS5cbiAqXG4gKiBAZXhhbXBsZVxuICogPGhlYWQ+XG4gKiA8c2NyaXB0IHNyYz1cIi4uLi90aW5vZGUuanNcIj48L3NjcmlwdD5cbiAqIDwvaGVhZD5cbiAqXG4gKiA8Ym9keT5cbiAqICAuLi5cbiAqIDxzY3JpcHQ+XG4gKiAgLy8gSW5zdGFudGlhdGUgdGlub2RlLlxuICogIGNvbnN0IHRpbm9kZSA9IG5ldyBUaW5vZGUoY29uZmlnLCAoKSA9PiB7XG4gKiAgICAvLyBDYWxsZWQgb24gaW5pdCBjb21wbGV0aW9uLlxuICogIH0pO1xuICogIHRpbm9kZS5lbmFibGVMb2dnaW5nKHRydWUpO1xuICogIHRpbm9kZS5vbkRpc2Nvbm5lY3QgPSAoZXJyKSA9PiB7XG4gKiAgICAvLyBIYW5kbGUgZGlzY29ubmVjdC5cbiAqICB9O1xuICogIC8vIENvbm5lY3QgdG8gdGhlIHNlcnZlci5cbiAqICB0aW5vZGUuY29ubmVjdCgnaHR0cHM6Ly9leGFtcGxlLmNvbS8nKS50aGVuKCgpID0+IHtcbiAqICAgIC8vIENvbm5lY3RlZC4gTG9naW4gbm93LlxuICogICAgcmV0dXJuIHRpbm9kZS5sb2dpbkJhc2ljKGxvZ2luLCBwYXNzd29yZCk7XG4gKiAgfSkudGhlbigoY3RybCkgPT4ge1xuICogICAgLy8gTG9nZ2VkIGluIGZpbmUsIGF0dGFjaCBjYWxsYmFja3MsIHN1YnNjcmliZSB0byAnbWUnLlxuICogICAgY29uc3QgbWUgPSB0aW5vZGUuZ2V0TWVUb3BpYygpO1xuICogICAgbWUub25NZXRhRGVzYyA9IGZ1bmN0aW9uKG1ldGEpIHsgLi4uIH07XG4gKiAgICAvLyBTdWJzY3JpYmUsIGZldGNoIHRvcGljIGRlc2NyaXB0aW9uIGFuZCB0aGUgbGlzdCBvZiBjb250YWN0cy5cbiAqICAgIG1lLnN1YnNjcmliZSh7Z2V0OiB7ZGVzYzoge30sIHN1Yjoge319fSk7XG4gKiAgfSkuY2F0Y2goKGVycikgPT4ge1xuICogICAgLy8gTG9naW4gb3Igc3Vic2NyaXB0aW9uIGZhaWxlZCwgZG8gc29tZXRoaW5nLlxuICogICAgLi4uXG4gKiAgfSk7XG4gKiAgLi4uXG4gKiA8L3NjcmlwdD5cbiAqIDwvYm9keT5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG4vLyBOT1RFIFRPIERFVkVMT1BFUlM6XG4vLyBMb2NhbGl6YWJsZSBzdHJpbmdzIHNob3VsZCBiZSBkb3VibGUgcXVvdGVkIFwi0YHRgtGA0L7QutCwINC90LAg0LTRgNGD0LPQvtC8INGP0LfRi9C60LVcIixcbi8vIG5vbi1sb2NhbGl6YWJsZSBzdHJpbmdzIHNob3VsZCBiZSBzaW5nbGUgcXVvdGVkICdub24tbG9jYWxpemVkJy5cblxuaW1wb3J0IEFjY2Vzc01vZGUgZnJvbSAnLi9hY2Nlc3MtbW9kZS5qcyc7XG5pbXBvcnQgKiBhcyBDb25zdCBmcm9tICcuL2NvbmZpZy5qcyc7XG5pbXBvcnQgQ29ubmVjdGlvbiBmcm9tICcuL2Nvbm5lY3Rpb24uanMnO1xuaW1wb3J0IERCQ2FjaGUgZnJvbSAnLi9kYi5qcyc7XG5pbXBvcnQgRHJhZnR5IGZyb20gJy4vZHJhZnR5LmpzJztcbmltcG9ydCBMYXJnZUZpbGVIZWxwZXIgZnJvbSAnLi9sYXJnZS1maWxlLmpzJztcbmltcG9ydCBNZXRhR2V0QnVpbGRlciBmcm9tICcuL21ldGEtYnVpbGRlci5qcyc7XG5pbXBvcnQge1xuICBUb3BpYyxcbiAgVG9waWNNZSxcbiAgVG9waWNGbmRcbn0gZnJvbSAnLi90b3BpYy5qcyc7XG5cbmltcG9ydCB7XG4gIGlzVXJsUmVsYXRpdmUsXG4gIGpzb25QYXJzZUhlbHBlcixcbiAgbWVyZ2VPYmosXG4gIHJmYzMzMzlEYXRlU3RyaW5nLFxuICBzaW1wbGlmeVxufSBmcm9tICcuL3V0aWxzLmpzJztcblxuLy8gUmUtZXhwb3J0IEFjY2Vzc01vZGVcbmV4cG9ydCB7XG4gIEFjY2Vzc01vZGVcbn07XG5cbmxldCBXZWJTb2NrZXRQcm92aWRlcjtcbmlmICh0eXBlb2YgV2ViU29ja2V0ICE9ICd1bmRlZmluZWQnKSB7XG4gIFdlYlNvY2tldFByb3ZpZGVyID0gV2ViU29ja2V0O1xufVxuXG5sZXQgWEhSUHJvdmlkZXI7XG5pZiAodHlwZW9mIFhNTEh0dHBSZXF1ZXN0ICE9ICd1bmRlZmluZWQnKSB7XG4gIFhIUlByb3ZpZGVyID0gWE1MSHR0cFJlcXVlc3Q7XG59XG5cbmxldCBJbmRleGVkREJQcm92aWRlcjtcbmlmICh0eXBlb2YgaW5kZXhlZERCICE9ICd1bmRlZmluZWQnKSB7XG4gIEluZGV4ZWREQlByb3ZpZGVyID0gaW5kZXhlZERCO1xufVxuXG4vLyBSZS1leHBvcnQgRHJhZnR5LlxuZXhwb3J0IHtcbiAgRHJhZnR5XG59XG5cbmluaXRGb3JOb25Ccm93c2VyQXBwKCk7XG5cbi8vIFV0aWxpdHkgZnVuY3Rpb25zXG5cbi8vIFBvbHlmaWxsIGZvciBub24tYnJvd3NlciBjb250ZXh0LCBlLmcuIE5vZGVKcy5cbmZ1bmN0aW9uIGluaXRGb3JOb25Ccm93c2VyQXBwKCkge1xuICAvLyBUaW5vZGUgcmVxdWlyZW1lbnQgaW4gbmF0aXZlIG1vZGUgYmVjYXVzZSByZWFjdCBuYXRpdmUgZG9lc24ndCBwcm92aWRlIEJhc2U2NCBtZXRob2RcbiAgY29uc3QgY2hhcnMgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLz0nO1xuXG4gIGlmICh0eXBlb2YgYnRvYSA9PSAndW5kZWZpbmVkJykge1xuICAgIGdsb2JhbC5idG9hID0gZnVuY3Rpb24oaW5wdXQgPSAnJykge1xuICAgICAgbGV0IHN0ciA9IGlucHV0O1xuICAgICAgbGV0IG91dHB1dCA9ICcnO1xuXG4gICAgICBmb3IgKGxldCBibG9jayA9IDAsIGNoYXJDb2RlLCBpID0gMCwgbWFwID0gY2hhcnM7IHN0ci5jaGFyQXQoaSB8IDApIHx8IChtYXAgPSAnPScsIGkgJSAxKTsgb3V0cHV0ICs9IG1hcC5jaGFyQXQoNjMgJiBibG9jayA+PiA4IC0gaSAlIDEgKiA4KSkge1xuXG4gICAgICAgIGNoYXJDb2RlID0gc3RyLmNoYXJDb2RlQXQoaSArPSAzIC8gNCk7XG5cbiAgICAgICAgaWYgKGNoYXJDb2RlID4gMHhGRikge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIididG9hJyBmYWlsZWQ6IFRoZSBzdHJpbmcgdG8gYmUgZW5jb2RlZCBjb250YWlucyBjaGFyYWN0ZXJzIG91dHNpZGUgb2YgdGhlIExhdGluMSByYW5nZS5cIik7XG4gICAgICAgIH1cbiAgICAgICAgYmxvY2sgPSBibG9jayA8PCA4IHwgY2hhckNvZGU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgYXRvYiA9PSAndW5kZWZpbmVkJykge1xuICAgIGdsb2JhbC5hdG9iID0gZnVuY3Rpb24oaW5wdXQgPSAnJykge1xuICAgICAgbGV0IHN0ciA9IGlucHV0LnJlcGxhY2UoLz0rJC8sICcnKTtcbiAgICAgIGxldCBvdXRwdXQgPSAnJztcblxuICAgICAgaWYgKHN0ci5sZW5ndGggJSA0ID09IDEpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiJ2F0b2InIGZhaWxlZDogVGhlIHN0cmluZyB0byBiZSBkZWNvZGVkIGlzIG5vdCBjb3JyZWN0bHkgZW5jb2RlZC5cIik7XG4gICAgICB9XG4gICAgICBmb3IgKGxldCBiYyA9IDAsIGJzID0gMCwgYnVmZmVyLCBpID0gMDsgYnVmZmVyID0gc3RyLmNoYXJBdChpKyspO1xuXG4gICAgICAgIH5idWZmZXIgJiYgKGJzID0gYmMgJSA0ID8gYnMgKiA2NCArIGJ1ZmZlciA6IGJ1ZmZlcixcbiAgICAgICAgICBiYysrICUgNCkgPyBvdXRwdXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZSgyNTUgJiBicyA+PiAoLTIgKiBiYyAmIDYpKSA6IDBcbiAgICAgICkge1xuICAgICAgICBidWZmZXIgPSBjaGFycy5pbmRleE9mKGJ1ZmZlcik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfTtcbiAgfVxuXG4gIGlmICh0eXBlb2Ygd2luZG93ID09ICd1bmRlZmluZWQnKSB7XG4gICAgZ2xvYmFsLndpbmRvdyA9IHtcbiAgICAgIFdlYlNvY2tldDogV2ViU29ja2V0UHJvdmlkZXIsXG4gICAgICBYTUxIdHRwUmVxdWVzdDogWEhSUHJvdmlkZXIsXG4gICAgICBpbmRleGVkREI6IEluZGV4ZWREQlByb3ZpZGVyLFxuICAgICAgVVJMOiB7XG4gICAgICAgIGNyZWF0ZU9iamVjdFVSTDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5hYmxlIHRvIHVzZSBVUkwuY3JlYXRlT2JqZWN0VVJMIGluIGEgbm9uLWJyb3dzZXIgYXBwbGljYXRpb25cIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBDb25uZWN0aW9uLnNldE5ldHdvcmtQcm92aWRlcnMoV2ViU29ja2V0UHJvdmlkZXIsIFhIUlByb3ZpZGVyKTtcbiAgTGFyZ2VGaWxlSGVscGVyLnNldE5ldHdvcmtQcm92aWRlcihYSFJQcm92aWRlcik7XG4gIERCQ2FjaGUuc2V0RGF0YWJhc2VQcm92aWRlcihJbmRleGVkREJQcm92aWRlcik7XG59XG5cbi8vIERldGVjdCBmaW5kIG1vc3QgdXNlZnVsIG5ldHdvcmsgdHJhbnNwb3J0LlxuZnVuY3Rpb24gZGV0ZWN0VHJhbnNwb3J0KCkge1xuICBpZiAodHlwZW9mIHdpbmRvdyA9PSAnb2JqZWN0Jykge1xuICAgIGlmICh3aW5kb3dbJ1dlYlNvY2tldCddKSB7XG4gICAgICByZXR1cm4gJ3dzJztcbiAgICB9IGVsc2UgaWYgKHdpbmRvd1snWE1MSHR0cFJlcXVlc3QnXSkge1xuICAgICAgLy8gVGhlIGJyb3dzZXIgb3Igbm9kZSBoYXMgbm8gd2Vic29ja2V0cywgdXNpbmcgbG9uZyBwb2xsaW5nLlxuICAgICAgcmV0dXJuICdscCc7XG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG4vLyBidG9hIHJlcGxhY2VtZW50LiBTdG9jayBidG9hIGZhaWxzIG9uIG9uIG5vbi1MYXRpbjEgc3RyaW5ncy5cbmZ1bmN0aW9uIGI2NEVuY29kZVVuaWNvZGUoc3RyKSB7XG4gIC8vIFRoZSBlbmNvZGVVUklDb21wb25lbnQgcGVyY2VudC1lbmNvZGVzIFVURi04IHN0cmluZyxcbiAgLy8gdGhlbiB0aGUgcGVyY2VudCBlbmNvZGluZyBpcyBjb252ZXJ0ZWQgaW50byByYXcgYnl0ZXMgd2hpY2hcbiAgLy8gY2FuIGJlIGZlZCBpbnRvIGJ0b2EuXG4gIHJldHVybiBidG9hKGVuY29kZVVSSUNvbXBvbmVudChzdHIpLnJlcGxhY2UoLyUoWzAtOUEtRl17Mn0pL2csXG4gICAgZnVuY3Rpb24gdG9Tb2xpZEJ5dGVzKG1hdGNoLCBwMSkge1xuICAgICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoJzB4JyArIHAxKTtcbiAgICB9KSk7XG59XG5cbi8vIEpTT04gc3RyaW5naWZ5IGhlbHBlciAtIHByZS1wcm9jZXNzb3IgZm9yIEpTT04uc3RyaW5naWZ5XG5mdW5jdGlvbiBqc29uQnVpbGRIZWxwZXIoa2V5LCB2YWwpIHtcbiAgaWYgKHZhbCBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAvLyBDb252ZXJ0IGphdmFzY3JpcHQgRGF0ZSBvYmplY3RzIHRvIHJmYzMzMzkgc3RyaW5nc1xuICAgIHZhbCA9IHJmYzMzMzlEYXRlU3RyaW5nKHZhbCk7XG4gIH0gZWxzZSBpZiAodmFsIGluc3RhbmNlb2YgQWNjZXNzTW9kZSkge1xuICAgIHZhbCA9IHZhbC5qc29uSGVscGVyKCk7XG4gIH0gZWxzZSBpZiAodmFsID09PSB1bmRlZmluZWQgfHwgdmFsID09PSBudWxsIHx8IHZhbCA9PT0gZmFsc2UgfHxcbiAgICAoQXJyYXkuaXNBcnJheSh2YWwpICYmIHZhbC5sZW5ndGggPT0gMCkgfHxcbiAgICAoKHR5cGVvZiB2YWwgPT0gJ29iamVjdCcpICYmIChPYmplY3Qua2V5cyh2YWwpLmxlbmd0aCA9PSAwKSkpIHtcbiAgICAvLyBzdHJpcCBvdXQgZW1wdHkgZWxlbWVudHMgd2hpbGUgc2VyaWFsaXppbmcgb2JqZWN0cyB0byBKU09OXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHJldHVybiB2YWw7XG59O1xuXG4vLyBUcmltcyB2ZXJ5IGxvbmcgc3RyaW5ncyAoZW5jb2RlZCBpbWFnZXMpIHRvIG1ha2UgbG9nZ2VkIHBhY2tldHMgbW9yZSByZWFkYWJsZS5cbmZ1bmN0aW9uIGpzb25Mb2dnZXJIZWxwZXIoa2V5LCB2YWwpIHtcbiAgaWYgKHR5cGVvZiB2YWwgPT0gJ3N0cmluZycgJiYgdmFsLmxlbmd0aCA+IDEyOCkge1xuICAgIHJldHVybiAnPCcgKyB2YWwubGVuZ3RoICsgJywgYnl0ZXM6ICcgKyB2YWwuc3Vic3RyaW5nKDAsIDEyKSArICcuLi4nICsgdmFsLnN1YnN0cmluZyh2YWwubGVuZ3RoIC0gMTIpICsgJz4nO1xuICB9XG4gIHJldHVybiBqc29uQnVpbGRIZWxwZXIoa2V5LCB2YWwpO1xufTtcblxuLy8gUGFyc2UgYnJvd3NlciB1c2VyIGFnZW50IHRvIGV4dHJhY3QgYnJvd3NlciBuYW1lIGFuZCB2ZXJzaW9uLlxuZnVuY3Rpb24gZ2V0QnJvd3NlckluZm8odWEsIHByb2R1Y3QpIHtcbiAgdWEgPSB1YSB8fCAnJztcbiAgbGV0IHJlYWN0bmF0aXZlID0gJyc7XG4gIC8vIENoZWNrIGlmIHRoaXMgaXMgYSBSZWFjdE5hdGl2ZSBhcHAuXG4gIGlmICgvcmVhY3RuYXRpdmUvaS50ZXN0KHByb2R1Y3QpKSB7XG4gICAgcmVhY3RuYXRpdmUgPSAnUmVhY3ROYXRpdmU7ICc7XG4gIH1cbiAgbGV0IHJlc3VsdDtcbiAgLy8gUmVtb3ZlIHVzZWxlc3Mgc3RyaW5nLlxuICB1YSA9IHVhLnJlcGxhY2UoJyAoS0hUTUwsIGxpa2UgR2Vja28pJywgJycpO1xuICAvLyBUZXN0IGZvciBXZWJLaXQtYmFzZWQgYnJvd3Nlci5cbiAgbGV0IG0gPSB1YS5tYXRjaCgvKEFwcGxlV2ViS2l0XFwvWy5cXGRdKykvaSk7XG4gIGlmIChtKSB7XG4gICAgLy8gTGlzdCBvZiBjb21tb24gc3RyaW5ncywgZnJvbSBtb3JlIHVzZWZ1bCB0byBsZXNzIHVzZWZ1bC5cbiAgICAvLyBBbGwgdW5rbm93biBzdHJpbmdzIGdldCB0aGUgaGlnaGVzdCAoLTEpIHByaW9yaXR5LlxuICAgIGNvbnN0IHByaW9yaXR5ID0gWydlZGcnLCAnY2hyb21lJywgJ3NhZmFyaScsICdtb2JpbGUnLCAndmVyc2lvbiddO1xuICAgIGxldCB0bXAgPSB1YS5zdWJzdHIobS5pbmRleCArIG1bMF0ubGVuZ3RoKS5zcGxpdCgnICcpO1xuICAgIGxldCB0b2tlbnMgPSBbXTtcbiAgICBsZXQgdmVyc2lvbjsgLy8gMS4wIGluIFZlcnNpb24vMS4wIG9yIHVuZGVmaW5lZDtcbiAgICAvLyBTcGxpdCBzdHJpbmcgbGlrZSAnTmFtZS8wLjAuMCcgaW50byBbJ05hbWUnLCAnMC4wLjAnLCAzXSB3aGVyZSB0aGUgbGFzdCBlbGVtZW50IGlzIHRoZSBwcmlvcml0eS5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRtcC5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IG0yID0gLyhbXFx3Ll0rKVtcXC9dKFtcXC5cXGRdKykvLmV4ZWModG1wW2ldKTtcbiAgICAgIGlmIChtMikge1xuICAgICAgICAvLyBVbmtub3duIHZhbHVlcyBhcmUgaGlnaGVzdCBwcmlvcml0eSAoLTEpLlxuICAgICAgICB0b2tlbnMucHVzaChbbTJbMV0sIG0yWzJdLCBwcmlvcml0eS5maW5kSW5kZXgoKGUpID0+IHtcbiAgICAgICAgICByZXR1cm4gbTJbMV0udG9Mb3dlckNhc2UoKS5zdGFydHNXaXRoKGUpO1xuICAgICAgICB9KV0pO1xuICAgICAgICBpZiAobTJbMV0gPT0gJ1ZlcnNpb24nKSB7XG4gICAgICAgICAgdmVyc2lvbiA9IG0yWzJdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIC8vIFNvcnQgYnkgcHJpb3JpdHk6IG1vcmUgaW50ZXJlc3RpbmcgaXMgZWFybGllciB0aGFuIGxlc3MgaW50ZXJlc3RpbmcuXG4gICAgdG9rZW5zLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgIHJldHVybiBhWzJdIC0gYlsyXTtcbiAgICB9KTtcbiAgICBpZiAodG9rZW5zLmxlbmd0aCA+IDApIHtcbiAgICAgIC8vIFJldHVybiB0aGUgbGVhc3QgY29tbW9uIGJyb3dzZXIgc3RyaW5nIGFuZCB2ZXJzaW9uLlxuICAgICAgaWYgKHRva2Vuc1swXVswXS50b0xvd2VyQ2FzZSgpLnN0YXJ0c1dpdGgoJ2VkZycpKSB7XG4gICAgICAgIHRva2Vuc1swXVswXSA9ICdFZGdlJztcbiAgICAgIH0gZWxzZSBpZiAodG9rZW5zWzBdWzBdID09ICdPUFInKSB7XG4gICAgICAgIHRva2Vuc1swXVswXSA9ICdPcGVyYSc7XG4gICAgICB9IGVsc2UgaWYgKHRva2Vuc1swXVswXSA9PSAnU2FmYXJpJyAmJiB2ZXJzaW9uKSB7XG4gICAgICAgIHRva2Vuc1swXVsxXSA9IHZlcnNpb247XG4gICAgICB9XG4gICAgICByZXN1bHQgPSB0b2tlbnNbMF1bMF0gKyAnLycgKyB0b2tlbnNbMF1bMV07XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEZhaWxlZCB0byBJRCB0aGUgYnJvd3Nlci4gUmV0dXJuIHRoZSB3ZWJraXQgdmVyc2lvbi5cbiAgICAgIHJlc3VsdCA9IG1bMV07XG4gICAgfVxuICB9IGVsc2UgaWYgKC9maXJlZm94L2kudGVzdCh1YSkpIHtcbiAgICBtID0gL0ZpcmVmb3hcXC8oWy5cXGRdKykvZy5leGVjKHVhKTtcbiAgICBpZiAobSkge1xuICAgICAgcmVzdWx0ID0gJ0ZpcmVmb3gvJyArIG1bMV07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdCA9ICdGaXJlZm94Lz8nO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvLyBOZWl0aGVyIEFwcGxlV2ViS2l0IG5vciBGaXJlZm94LiBUcnkgdGhlIGxhc3QgcmVzb3J0LlxuICAgIG0gPSAvKFtcXHcuXSspXFwvKFsuXFxkXSspLy5leGVjKHVhKTtcbiAgICBpZiAobSkge1xuICAgICAgcmVzdWx0ID0gbVsxXSArICcvJyArIG1bMl07XG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSB1YS5zcGxpdCgnICcpO1xuICAgICAgcmVzdWx0ID0gbVswXTtcbiAgICB9XG4gIH1cblxuICAvLyBTaG9ydGVuIHRoZSB2ZXJzaW9uIHRvIG9uZSBkb3QgJ2EuYmIuY2NjLmQgLT4gYS5iYicgYXQgbW9zdC5cbiAgbSA9IHJlc3VsdC5zcGxpdCgnLycpO1xuICBpZiAobS5sZW5ndGggPiAxKSB7XG4gICAgY29uc3QgdiA9IG1bMV0uc3BsaXQoJy4nKTtcbiAgICBjb25zdCBtaW5vciA9IHZbMV0gPyAnLicgKyB2WzFdLnN1YnN0cigwLCAyKSA6ICcnO1xuICAgIHJlc3VsdCA9IGAke21bMF19LyR7dlswXX0ke21pbm9yfWA7XG4gIH1cbiAgcmV0dXJuIHJlYWN0bmF0aXZlICsgcmVzdWx0O1xufVxuXG4vKipcbiAqIFRoZSBtYWluIGNsYXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIFRpbm9kZSBzZXJ2ZXIuXG4gKi9cbmV4cG9ydCBjbGFzcyBUaW5vZGUge1xuICBfaG9zdDtcbiAgX3NlY3VyZTtcblxuICBfYXBwTmFtZTtcblxuICAvLyBBUEkgS2V5LlxuICBfYXBpS2V5O1xuXG4gIC8vIE5hbWUgYW5kIHZlcnNpb24gb2YgdGhlIGJyb3dzZXIuXG4gIF9icm93c2VyID0gJyc7XG4gIF9wbGF0Zm9ybTtcbiAgLy8gSGFyZHdhcmVcbiAgX2h3b3MgPSAndW5kZWZpbmVkJztcbiAgX2h1bWFuTGFuZ3VhZ2UgPSAneHgnO1xuXG4gIC8vIExvZ2dpbmcgdG8gY29uc29sZSBlbmFibGVkXG4gIF9sb2dnaW5nRW5hYmxlZCA9IGZhbHNlO1xuICAvLyBXaGVuIGxvZ2dpbmcsIHRyaXAgbG9uZyBzdHJpbmdzIChiYXNlNjQtZW5jb2RlZCBpbWFnZXMpIGZvciByZWFkYWJpbGl0eVxuICBfdHJpbUxvbmdTdHJpbmdzID0gZmFsc2U7XG4gIC8vIFVJRCBvZiB0aGUgY3VycmVudGx5IGF1dGhlbnRpY2F0ZWQgdXNlci5cbiAgX215VUlEID0gbnVsbDtcbiAgLy8gU3RhdHVzIG9mIGNvbm5lY3Rpb246IGF1dGhlbnRpY2F0ZWQgb3Igbm90LlxuICBfYXV0aGVudGljYXRlZCA9IGZhbHNlO1xuICAvLyBMb2dpbiB1c2VkIGluIHRoZSBsYXN0IHN1Y2Nlc3NmdWwgYmFzaWMgYXV0aGVudGljYXRpb25cbiAgX2xvZ2luID0gbnVsbDtcbiAgLy8gVG9rZW4gd2hpY2ggY2FuIGJlIHVzZWQgZm9yIGxvZ2luIGluc3RlYWQgb2YgbG9naW4vcGFzc3dvcmQuXG4gIF9hdXRoVG9rZW4gPSBudWxsO1xuICAvLyBDb3VudGVyIG9mIHJlY2VpdmVkIHBhY2tldHNcbiAgX2luUGFja2V0Q291bnQgPSAwO1xuICAvLyBDb3VudGVyIGZvciBnZW5lcmF0aW5nIHVuaXF1ZSBtZXNzYWdlIElEc1xuICBfbWVzc2FnZUlkID0gTWF0aC5mbG9vcigoTWF0aC5yYW5kb20oKSAqIDB4RkZGRikgKyAweEZGRkYpO1xuICAvLyBJbmZvcm1hdGlvbiBhYm91dCB0aGUgc2VydmVyLCBpZiBjb25uZWN0ZWRcbiAgX3NlcnZlckluZm8gPSBudWxsO1xuICAvLyBQdXNoIG5vdGlmaWNhdGlvbiB0b2tlbi4gQ2FsbGVkIGRldmljZVRva2VuIGZvciBjb25zaXN0ZW5jeSB3aXRoIHRoZSBBbmRyb2lkIFNESy5cbiAgX2RldmljZVRva2VuID0gbnVsbDtcblxuICAvLyBDYWNoZSBvZiBwZW5kaW5nIHByb21pc2VzIGJ5IG1lc3NhZ2UgaWQuXG4gIF9wZW5kaW5nUHJvbWlzZXMgPSB7fTtcbiAgLy8gVGhlIFRpbWVvdXQgb2JqZWN0IHJldHVybmVkIGJ5IHRoZSByZWplY3QgZXhwaXJlZCBwcm9taXNlcyBzZXRJbnRlcnZhbC5cbiAgX2V4cGlyZVByb21pc2VzID0gbnVsbDtcblxuICAvLyBXZWJzb2NrZXQgb3IgbG9uZyBwb2xsaW5nIGNvbm5lY3Rpb24uXG4gIF9jb25uZWN0aW9uID0gbnVsbDtcblxuICAvLyBVc2UgaW5kZXhEQiBmb3IgY2FjaGluZyB0b3BpY3MgYW5kIG1lc3NhZ2VzLlxuICBfcGVyc2lzdCA9IGZhbHNlO1xuICAvLyBJbmRleGVkREIgd3JhcHBlciBvYmplY3QuXG4gIF9kYiA9IG51bGw7XG5cbiAgLy8gVGlub2RlJ3MgY2FjaGUgb2Ygb2JqZWN0c1xuICBfY2FjaGUgPSB7fTtcblxuICAvKipcbiAgICogQ3JlYXRlIFRpbm9kZSBvYmplY3QuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgLSBjb25maWd1cmF0aW9uIHBhcmFtZXRlcnMuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjb25maWcuYXBwTmFtZSAtIE5hbWUgb2YgdGhlIGNhbGxpbmcgYXBwbGljYXRpb24gdG8gYmUgcmVwb3J0ZWQgaW4gdGhlIFVzZXIgQWdlbnQuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjb25maWcuaG9zdCAtIEhvc3QgbmFtZSBhbmQgb3B0aW9uYWwgcG9ydCBudW1iZXIgdG8gY29ubmVjdCB0by5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGNvbmZpZy5hcGlLZXkgLSBBUEkga2V5IGdlbmVyYXRlZCBieSA8Y29kZT5rZXlnZW48L2NvZGU+LlxuICAgKiBAcGFyYW0ge3N0cmluZ30gY29uZmlnLnRyYW5zcG9ydCAtIFNlZSB7QGxpbmsgVGlub2RlLkNvbm5lY3Rpb24jdHJhbnNwb3J0fS5cbiAgICogQHBhcmFtIHtib29sZWFufSBjb25maWcuc2VjdXJlIC0gVXNlIFNlY3VyZSBXZWJTb2NrZXQgaWYgPGNvZGU+dHJ1ZTwvY29kZT4uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjb25maWcucGxhdGZvcm0gLSBPcHRpb25hbCBwbGF0Zm9ybSBpZGVudGlmaWVyLCBvbmUgb2YgPGNvZGU+XCJpb3NcIjwvY29kZT4sIDxjb2RlPlwid2ViXCI8L2NvZGU+LCA8Y29kZT5cImFuZHJvaWRcIjwvY29kZT4uXG4gICAqIEBwYXJhbSB7Ym9vbGVufSBjb25maWcucGVyc2lzdCAtIFVzZSBJbmRleGVkREIgcGVyc2lzdGVudCBzdG9yYWdlLlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBvbkNvbXBsZXRlIC0gY2FsbGJhY2sgdG8gY2FsbCB3aGVuIGluaXRpYWxpemF0aW9uIGlzIGNvbXBsZXRlZC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGNvbmZpZywgb25Db21wbGV0ZSkge1xuICAgIHRoaXMuX2hvc3QgPSBjb25maWcuaG9zdDtcbiAgICB0aGlzLl9zZWN1cmUgPSBjb25maWcuc2VjdXJlO1xuXG4gICAgLy8gQ2xpZW50LXByb3ZpZGVkIGFwcGxpY2F0aW9uIG5hbWUsIGZvcm1hdCA8TmFtZT4vPHZlcnNpb24gbnVtYmVyPlxuICAgIHRoaXMuX2FwcE5hbWUgPSBjb25maWcuYXBwTmFtZSB8fCBcIlVuZGVmaW5lZFwiO1xuXG4gICAgLy8gQVBJIEtleS5cbiAgICB0aGlzLl9hcGlLZXkgPSBjb25maWcuYXBpS2V5O1xuXG4gICAgLy8gTmFtZSBhbmQgdmVyc2lvbiBvZiB0aGUgYnJvd3Nlci5cbiAgICB0aGlzLl9wbGF0Zm9ybSA9IGNvbmZpZy5wbGF0Zm9ybSB8fCAnd2ViJztcbiAgICAvLyBVbmRlcmx5aW5nIE9TLlxuICAgIGlmICh0eXBlb2YgbmF2aWdhdG9yICE9ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aGlzLl9icm93c2VyID0gZ2V0QnJvd3NlckluZm8obmF2aWdhdG9yLnVzZXJBZ2VudCwgbmF2aWdhdG9yLnByb2R1Y3QpO1xuICAgICAgdGhpcy5faHdvcyA9IG5hdmlnYXRvci5wbGF0Zm9ybTtcbiAgICAgIC8vIFRoaXMgaXMgdGhlIGRlZmF1bHQgbGFuZ3VhZ2UuIEl0IGNvdWxkIGJlIGNoYW5nZWQgYnkgY2xpZW50LlxuICAgICAgdGhpcy5faHVtYW5MYW5ndWFnZSA9IG5hdmlnYXRvci5sYW5ndWFnZSB8fCAnZW4tVVMnO1xuICAgIH1cblxuICAgIENvbm5lY3Rpb24ubG9nZ2VyID0gdGhpcy5sb2dnZXI7XG4gICAgRHJhZnR5LmxvZ2dlciA9IHRoaXMubG9nZ2VyO1xuXG4gICAgLy8gV2ViU29ja2V0IG9yIGxvbmcgcG9sbGluZyBuZXR3b3JrIGNvbm5lY3Rpb24uXG4gICAgaWYgKGNvbmZpZy50cmFuc3BvcnQgIT0gJ2xwJyAmJiBjb25maWcudHJhbnNwb3J0ICE9ICd3cycpIHtcbiAgICAgIGNvbmZpZy50cmFuc3BvcnQgPSBkZXRlY3RUcmFuc3BvcnQoKTtcbiAgICB9XG4gICAgdGhpcy5fY29ubmVjdGlvbiA9IG5ldyBDb25uZWN0aW9uKGNvbmZpZywgQ29uc3QuUFJPVE9DT0xfVkVSU0lPTiwgLyogYXV0b3JlY29ubmVjdCAqLyB0cnVlKTtcbiAgICB0aGlzLl9jb25uZWN0aW9uLm9uTWVzc2FnZSA9IChkYXRhKSA9PiB7XG4gICAgICAvLyBDYWxsIHRoZSBtYWluIG1lc3NhZ2UgZGlzcGF0Y2hlci5cbiAgICAgIHRoaXMuI2Rpc3BhdGNoTWVzc2FnZShkYXRhKTtcbiAgICB9XG4gICAgdGhpcy5fY29ubmVjdGlvbi5vbk9wZW4gPSAoKSA9PiB7XG4gICAgICAvLyBSZWFkeSB0byBzdGFydCBzZW5kaW5nLlxuICAgICAgdGhpcy4jY29ubmVjdGlvbk9wZW4oKTtcbiAgICB9XG4gICAgdGhpcy5fY29ubmVjdGlvbi5vbkRpc2Nvbm5lY3QgPSAoZXJyLCBjb2RlKSA9PiB7XG4gICAgICB0aGlzLiNkaXNjb25uZWN0ZWQoZXJyLCBjb2RlKTtcbiAgICB9XG4gICAgLy8gV3JhcHBlciBmb3IgdGhlIHJlY29ubmVjdCBpdGVyYXRvciBjYWxsYmFjay5cbiAgICB0aGlzLl9jb25uZWN0aW9uLm9uQXV0b3JlY29ubmVjdEl0ZXJhdGlvbiA9ICh0aW1lb3V0LCBwcm9taXNlKSA9PiB7XG4gICAgICBpZiAodGhpcy5vbkF1dG9yZWNvbm5lY3RJdGVyYXRpb24pIHtcbiAgICAgICAgdGhpcy5vbkF1dG9yZWNvbm5lY3RJdGVyYXRpb24odGltZW91dCwgcHJvbWlzZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5fcGVyc2lzdCA9IGNvbmZpZy5wZXJzaXN0O1xuICAgIC8vIEluaXRpYWxpemUgb2JqZWN0IHJlZ2FyZGxlc3MuIEl0IHNpbXBsaWZpZXMgdGhlIGNvZGUuXG4gICAgdGhpcy5fZGIgPSBuZXcgREJDYWNoZShlcnIgPT4ge1xuICAgICAgdGhpcy5sb2dnZXIoJ0RCJywgZXJyKTtcbiAgICB9LCB0aGlzLmxvZ2dlcik7XG5cbiAgICBpZiAodGhpcy5fcGVyc2lzdCkge1xuICAgICAgLy8gQ3JlYXRlIHRoZSBwZXJzaXN0ZW50IGNhY2hlLlxuICAgICAgLy8gU3RvcmUgcHJvbWlzZXMgdG8gYmUgcmVzb2x2ZWQgd2hlbiBtZXNzYWdlcyBsb2FkIGludG8gbWVtb3J5LlxuICAgICAgY29uc3QgcHJvbSA9IFtdO1xuICAgICAgdGhpcy5fZGIuaW5pdERhdGFiYXNlKCkudGhlbihfID0+IHtcbiAgICAgICAgLy8gRmlyc3QgbG9hZCB0b3BpY3MgaW50byBtZW1vcnkuXG4gICAgICAgIHJldHVybiB0aGlzLl9kYi5tYXBUb3BpY3MoKGRhdGEpID0+IHtcbiAgICAgICAgICBsZXQgdG9waWMgPSB0aGlzLiNjYWNoZUdldCgndG9waWMnLCBkYXRhLm5hbWUpO1xuICAgICAgICAgIGlmICh0b3BpYykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZGF0YS5uYW1lID09IENvbnN0LlRPUElDX01FKSB7XG4gICAgICAgICAgICB0b3BpYyA9IG5ldyBUb3BpY01lKCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChkYXRhLm5hbWUgPT0gQ29uc3QuVE9QSUNfRk5EKSB7XG4gICAgICAgICAgICB0b3BpYyA9IG5ldyBUb3BpY0ZuZCgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0b3BpYyA9IG5ldyBUb3BpYyhkYXRhLm5hbWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLl9kYi5kZXNlcmlhbGl6ZVRvcGljKHRvcGljLCBkYXRhKTtcbiAgICAgICAgICB0aGlzLiNhdHRhY2hDYWNoZVRvVG9waWModG9waWMpO1xuICAgICAgICAgIHRvcGljLl9jYWNoZVB1dFNlbGYoKTtcbiAgICAgICAgICAvLyBUb3BpYyBsb2FkZWQgZnJvbSBEQiBpcyBub3QgbmV3LlxuICAgICAgICAgIGRlbGV0ZSB0b3BpYy5fbmV3O1xuICAgICAgICAgIC8vIFJlcXVlc3QgdG8gbG9hZCBtZXNzYWdlcyBhbmQgc2F2ZSB0aGUgcHJvbWlzZS5cbiAgICAgICAgICBwcm9tLnB1c2godG9waWMuX2xvYWRNZXNzYWdlcyh0aGlzLl9kYikpO1xuICAgICAgICB9KTtcbiAgICAgIH0pLnRoZW4oXyA9PiB7XG4gICAgICAgIC8vIFRoZW4gbG9hZCB1c2Vycy5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2RiLm1hcFVzZXJzKChkYXRhKSA9PiB7XG4gICAgICAgICAgdGhpcy4jY2FjaGVQdXQoJ3VzZXInLCBkYXRhLnVpZCwgbWVyZ2VPYmooe30sIGRhdGEucHVibGljKSk7XG4gICAgICAgIH0pO1xuICAgICAgfSkudGhlbihfID0+IHtcbiAgICAgICAgLy8gTm93IHdhaXQgZm9yIGFsbCBtZXNzYWdlcyB0byBmaW5pc2ggbG9hZGluZy5cbiAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKHByb20pO1xuICAgICAgfSkudGhlbihfID0+IHtcbiAgICAgICAgaWYgKG9uQ29tcGxldGUpIHtcbiAgICAgICAgICBvbkNvbXBsZXRlKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sb2dnZXIoXCJQZXJzaXN0ZW50IGNhY2hlIGluaXRpYWxpemVkLlwiKTtcbiAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgaWYgKG9uQ29tcGxldGUpIHtcbiAgICAgICAgICBvbkNvbXBsZXRlKGVycik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sb2dnZXIoXCJGYWlsZWQgdG8gaW5pdGlhbGl6ZSBwZXJzaXN0ZW50IGNhY2hlOlwiLCBlcnIpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2RiLmRlbGV0ZURhdGFiYXNlKCkudGhlbihfID0+IHtcbiAgICAgICAgaWYgKG9uQ29tcGxldGUpIHtcbiAgICAgICAgICBvbkNvbXBsZXRlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8vIFByaXZhdGUgbWV0aG9kcy5cblxuICAvLyBDb25zb2xlIGxvZ2dlci4gQmFiZWwgc29tZWhvdyBmYWlscyB0byBwYXJzZSAnLi4ucmVzdCcgcGFyYW1ldGVyLlxuICBsb2dnZXIoc3RyLCAuLi5hcmdzKSB7XG4gICAgaWYgKHRoaXMuX2xvZ2dpbmdFbmFibGVkKSB7XG4gICAgICBjb25zdCBkID0gbmV3IERhdGUoKTtcbiAgICAgIGNvbnN0IGRhdGVTdHJpbmcgPSAoJzAnICsgZC5nZXRVVENIb3VycygpKS5zbGljZSgtMikgKyAnOicgK1xuICAgICAgICAoJzAnICsgZC5nZXRVVENNaW51dGVzKCkpLnNsaWNlKC0yKSArICc6JyArXG4gICAgICAgICgnMCcgKyBkLmdldFVUQ1NlY29uZHMoKSkuc2xpY2UoLTIpICsgJy4nICtcbiAgICAgICAgKCcwMCcgKyBkLmdldFVUQ01pbGxpc2Vjb25kcygpKS5zbGljZSgtMyk7XG5cbiAgICAgIGNvbnNvbGUubG9nKCdbJyArIGRhdGVTdHJpbmcgKyAnXScsIHN0ciwgYXJncy5qb2luKCcgJykpO1xuICAgIH1cbiAgfVxuXG4gIC8vIEdlbmVyYXRvciBvZiBkZWZhdWx0IHByb21pc2VzIGZvciBzZW50IHBhY2tldHMuXG4gICNtYWtlUHJvbWlzZShpZCkge1xuICAgIGxldCBwcm9taXNlID0gbnVsbDtcbiAgICBpZiAoaWQpIHtcbiAgICAgIHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIC8vIFN0b3JlZCBjYWxsYmFja3Mgd2lsbCBiZSBjYWxsZWQgd2hlbiB0aGUgcmVzcG9uc2UgcGFja2V0IHdpdGggdGhpcyBJZCBhcnJpdmVzXG4gICAgICAgIHRoaXMuX3BlbmRpbmdQcm9taXNlc1tpZF0gPSB7XG4gICAgICAgICAgJ3Jlc29sdmUnOiByZXNvbHZlLFxuICAgICAgICAgICdyZWplY3QnOiByZWplY3QsXG4gICAgICAgICAgJ3RzJzogbmV3IERhdGUoKVxuICAgICAgICB9O1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBwcm9taXNlO1xuICB9O1xuXG4gIC8vIFJlc29sdmUgb3IgcmVqZWN0IGEgcGVuZGluZyBwcm9taXNlLlxuICAvLyBVbnJlc29sdmVkIHByb21pc2VzIGFyZSBzdG9yZWQgaW4gX3BlbmRpbmdQcm9taXNlcy5cbiAgI2V4ZWNQcm9taXNlKGlkLCBjb2RlLCBvbk9LLCBlcnJvclRleHQpIHtcbiAgICBjb25zdCBjYWxsYmFja3MgPSB0aGlzLl9wZW5kaW5nUHJvbWlzZXNbaWRdO1xuICAgIGlmIChjYWxsYmFja3MpIHtcbiAgICAgIGRlbGV0ZSB0aGlzLl9wZW5kaW5nUHJvbWlzZXNbaWRdO1xuICAgICAgaWYgKGNvZGUgPj0gMjAwICYmIGNvZGUgPCA0MDApIHtcbiAgICAgICAgaWYgKGNhbGxiYWNrcy5yZXNvbHZlKSB7XG4gICAgICAgICAgY2FsbGJhY2tzLnJlc29sdmUob25PSyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoY2FsbGJhY2tzLnJlamVjdCkge1xuICAgICAgICBjYWxsYmFja3MucmVqZWN0KG5ldyBFcnJvcihgJHtlcnJvclRleHR9ICgke2NvZGV9KWApKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBTZW5kIGEgcGFja2V0LiBJZiBwYWNrZXQgaWQgaXMgcHJvdmlkZWQgcmV0dXJuIGEgcHJvbWlzZS5cbiAgI3NlbmQocGt0LCBpZCkge1xuICAgIGxldCBwcm9taXNlO1xuICAgIGlmIChpZCkge1xuICAgICAgcHJvbWlzZSA9IHRoaXMuI21ha2VQcm9taXNlKGlkKTtcbiAgICB9XG4gICAgcGt0ID0gc2ltcGxpZnkocGt0KTtcbiAgICBsZXQgbXNnID0gSlNPTi5zdHJpbmdpZnkocGt0KTtcbiAgICB0aGlzLmxvZ2dlcihcIm91dDogXCIgKyAodGhpcy5fdHJpbUxvbmdTdHJpbmdzID8gSlNPTi5zdHJpbmdpZnkocGt0LCBqc29uTG9nZ2VySGVscGVyKSA6IG1zZykpO1xuICAgIHRyeSB7XG4gICAgICB0aGlzLl9jb25uZWN0aW9uLnNlbmRUZXh0KG1zZyk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAvLyBJZiBzZW5kVGV4dCB0aHJvd3MsIHdyYXAgdGhlIGVycm9yIGluIGEgcHJvbWlzZSBvciByZXRocm93LlxuICAgICAgaWYgKGlkKSB7XG4gICAgICAgIHRoaXMuI2V4ZWNQcm9taXNlKGlkLCBDb25uZWN0aW9uLk5FVFdPUktfRVJST1IsIG51bGwsIGVyci5tZXNzYWdlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IGVycjtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICAvLyBUaGUgbWFpbiBtZXNzYWdlIGRpc3BhdGNoZXIuXG4gICNkaXNwYXRjaE1lc3NhZ2UoZGF0YSkge1xuICAgIC8vIFNraXAgZW1wdHkgcmVzcG9uc2UuIFRoaXMgaGFwcGVucyB3aGVuIExQIHRpbWVzIG91dC5cbiAgICBpZiAoIWRhdGEpXG4gICAgICByZXR1cm47XG5cbiAgICB0aGlzLl9pblBhY2tldENvdW50Kys7XG5cbiAgICAvLyBTZW5kIHJhdyBtZXNzYWdlIHRvIGxpc3RlbmVyXG4gICAgaWYgKHRoaXMub25SYXdNZXNzYWdlKSB7XG4gICAgICB0aGlzLm9uUmF3TWVzc2FnZShkYXRhKTtcbiAgICB9XG5cbiAgICBpZiAoZGF0YSA9PT0gJzAnKSB7XG4gICAgICAvLyBTZXJ2ZXIgcmVzcG9uc2UgdG8gYSBuZXR3b3JrIHByb2JlLlxuICAgICAgaWYgKHRoaXMub25OZXR3b3JrUHJvYmUpIHtcbiAgICAgICAgdGhpcy5vbk5ldHdvcmtQcm9iZSgpO1xuICAgICAgfVxuICAgICAgLy8gTm8gcHJvY2Vzc2luZyBpcyBuZWNlc3NhcnkuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IHBrdCA9IEpTT04ucGFyc2UoZGF0YSwganNvblBhcnNlSGVscGVyKTtcbiAgICBpZiAoIXBrdCkge1xuICAgICAgdGhpcy5sb2dnZXIoXCJpbjogXCIgKyBkYXRhKTtcbiAgICAgIHRoaXMubG9nZ2VyKFwiRVJST1I6IGZhaWxlZCB0byBwYXJzZSBkYXRhXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmxvZ2dlcihcImluOiBcIiArICh0aGlzLl90cmltTG9uZ1N0cmluZ3MgPyBKU09OLnN0cmluZ2lmeShwa3QsIGpzb25Mb2dnZXJIZWxwZXIpIDogZGF0YSkpO1xuXG4gICAgICAvLyBTZW5kIGNvbXBsZXRlIHBhY2tldCB0byBsaXN0ZW5lclxuICAgICAgaWYgKHRoaXMub25NZXNzYWdlKSB7XG4gICAgICAgIHRoaXMub25NZXNzYWdlKHBrdCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChwa3QuY3RybCkge1xuICAgICAgICAvLyBIYW5kbGluZyB7Y3RybH0gbWVzc2FnZVxuICAgICAgICBpZiAodGhpcy5vbkN0cmxNZXNzYWdlKSB7XG4gICAgICAgICAgdGhpcy5vbkN0cmxNZXNzYWdlKHBrdC5jdHJsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJlc29sdmUgb3IgcmVqZWN0IGEgcGVuZGluZyBwcm9taXNlLCBpZiBhbnlcbiAgICAgICAgaWYgKHBrdC5jdHJsLmlkKSB7XG4gICAgICAgICAgdGhpcy4jZXhlY1Byb21pc2UocGt0LmN0cmwuaWQsIHBrdC5jdHJsLmNvZGUsIHBrdC5jdHJsLCBwa3QuY3RybC50ZXh0KTtcbiAgICAgICAgfVxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBpZiAocGt0LmN0cmwuY29kZSA9PSAyMDUgJiYgcGt0LmN0cmwudGV4dCA9PSAnZXZpY3RlZCcpIHtcbiAgICAgICAgICAgIC8vIFVzZXIgZXZpY3RlZCBmcm9tIHRvcGljLlxuICAgICAgICAgICAgY29uc3QgdG9waWMgPSB0aGlzLiNjYWNoZUdldCgndG9waWMnLCBwa3QuY3RybC50b3BpYyk7XG4gICAgICAgICAgICBpZiAodG9waWMpIHtcbiAgICAgICAgICAgICAgdG9waWMuX3Jlc2V0U3ViKCk7XG4gICAgICAgICAgICAgIGlmIChwa3QuY3RybC5wYXJhbXMgJiYgcGt0LmN0cmwucGFyYW1zLnVuc3ViKSB7XG4gICAgICAgICAgICAgICAgdG9waWMuX2dvbmUoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAocGt0LmN0cmwuY29kZSA8IDMwMCAmJiBwa3QuY3RybC5wYXJhbXMpIHtcbiAgICAgICAgICAgIGlmIChwa3QuY3RybC5wYXJhbXMud2hhdCA9PSAnZGF0YScpIHtcbiAgICAgICAgICAgICAgLy8gY29kZT0yMDgsIGFsbCBtZXNzYWdlcyByZWNlaXZlZDogXCJwYXJhbXNcIjp7XCJjb3VudFwiOjExLFwid2hhdFwiOlwiZGF0YVwifSxcbiAgICAgICAgICAgICAgY29uc3QgdG9waWMgPSB0aGlzLiNjYWNoZUdldCgndG9waWMnLCBwa3QuY3RybC50b3BpYyk7XG4gICAgICAgICAgICAgIGlmICh0b3BpYykge1xuICAgICAgICAgICAgICAgIHRvcGljLl9hbGxNZXNzYWdlc1JlY2VpdmVkKHBrdC5jdHJsLnBhcmFtcy5jb3VudCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAocGt0LmN0cmwucGFyYW1zLndoYXQgPT0gJ3N1YicpIHtcbiAgICAgICAgICAgICAgLy8gY29kZT0yMDQsIHRoZSB0b3BpYyBoYXMgbm8gKHJlZnJlc2hlZCkgc3Vic2NyaXB0aW9ucy5cbiAgICAgICAgICAgICAgY29uc3QgdG9waWMgPSB0aGlzLiNjYWNoZUdldCgndG9waWMnLCBwa3QuY3RybC50b3BpYyk7XG4gICAgICAgICAgICAgIGlmICh0b3BpYykge1xuICAgICAgICAgICAgICAgIC8vIFRyaWdnZXIgdG9waWMub25TdWJzVXBkYXRlZC5cbiAgICAgICAgICAgICAgICB0b3BpYy5fcHJvY2Vzc01ldGFTdWIoW10pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LCAwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIGlmIChwa3QubWV0YSkge1xuICAgICAgICAgICAgLy8gSGFuZGxpbmcgYSB7bWV0YX0gbWVzc2FnZS5cbiAgICAgICAgICAgIC8vIFByZWZlcnJlZCBBUEk6IFJvdXRlIG1ldGEgdG8gdG9waWMsIGlmIG9uZSBpcyByZWdpc3RlcmVkXG4gICAgICAgICAgICBjb25zdCB0b3BpYyA9IHRoaXMuI2NhY2hlR2V0KCd0b3BpYycsIHBrdC5tZXRhLnRvcGljKTtcbiAgICAgICAgICAgIGlmICh0b3BpYykge1xuICAgICAgICAgICAgICB0b3BpYy5fcm91dGVNZXRhKHBrdC5tZXRhKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHBrdC5tZXRhLmlkKSB7XG4gICAgICAgICAgICAgIHRoaXMuI2V4ZWNQcm9taXNlKHBrdC5tZXRhLmlkLCAyMDAsIHBrdC5tZXRhLCAnTUVUQScpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBTZWNvbmRhcnkgQVBJOiBjYWxsYmFja1xuICAgICAgICAgICAgaWYgKHRoaXMub25NZXRhTWVzc2FnZSkge1xuICAgICAgICAgICAgICB0aGlzLm9uTWV0YU1lc3NhZ2UocGt0Lm1ldGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAocGt0LmRhdGEpIHtcbiAgICAgICAgICAgIC8vIEhhbmRsaW5nIHtkYXRhfSBtZXNzYWdlXG4gICAgICAgICAgICAvLyBQcmVmZXJyZWQgQVBJOiBSb3V0ZSBkYXRhIHRvIHRvcGljLCBpZiBvbmUgaXMgcmVnaXN0ZXJlZFxuICAgICAgICAgICAgY29uc3QgdG9waWMgPSB0aGlzLiNjYWNoZUdldCgndG9waWMnLCBwa3QuZGF0YS50b3BpYyk7XG4gICAgICAgICAgICBpZiAodG9waWMpIHtcbiAgICAgICAgICAgICAgdG9waWMuX3JvdXRlRGF0YShwa3QuZGF0YSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFNlY29uZGFyeSBBUEk6IENhbGwgY2FsbGJhY2tcbiAgICAgICAgICAgIGlmICh0aGlzLm9uRGF0YU1lc3NhZ2UpIHtcbiAgICAgICAgICAgICAgdGhpcy5vbkRhdGFNZXNzYWdlKHBrdC5kYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKHBrdC5wcmVzKSB7XG4gICAgICAgICAgICAvLyBIYW5kbGluZyB7cHJlc30gbWVzc2FnZVxuICAgICAgICAgICAgLy8gUHJlZmVycmVkIEFQSTogUm91dGUgcHJlc2VuY2UgdG8gdG9waWMsIGlmIG9uZSBpcyByZWdpc3RlcmVkXG4gICAgICAgICAgICBjb25zdCB0b3BpYyA9IHRoaXMuI2NhY2hlR2V0KCd0b3BpYycsIHBrdC5wcmVzLnRvcGljKTtcbiAgICAgICAgICAgIGlmICh0b3BpYykge1xuICAgICAgICAgICAgICB0b3BpYy5fcm91dGVQcmVzKHBrdC5wcmVzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gU2Vjb25kYXJ5IEFQSSAtIGNhbGxiYWNrXG4gICAgICAgICAgICBpZiAodGhpcy5vblByZXNNZXNzYWdlKSB7XG4gICAgICAgICAgICAgIHRoaXMub25QcmVzTWVzc2FnZShwa3QucHJlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChwa3QuaW5mbykge1xuICAgICAgICAgICAgLy8ge2luZm99IG1lc3NhZ2UgLSByZWFkL3JlY2VpdmVkIG5vdGlmaWNhdGlvbnMgYW5kIGtleSBwcmVzc2VzXG4gICAgICAgICAgICAvLyBQcmVmZXJyZWQgQVBJOiBSb3V0ZSB7aW5mb319IHRvIHRvcGljLCBpZiBvbmUgaXMgcmVnaXN0ZXJlZFxuICAgICAgICAgICAgY29uc3QgdG9waWMgPSB0aGlzLiNjYWNoZUdldCgndG9waWMnLCBwa3QuaW5mby50b3BpYyk7XG4gICAgICAgICAgICBpZiAodG9waWMpIHtcbiAgICAgICAgICAgICAgdG9waWMuX3JvdXRlSW5mbyhwa3QuaW5mbyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFNlY29uZGFyeSBBUEkgLSBjYWxsYmFja1xuICAgICAgICAgICAgaWYgKHRoaXMub25JbmZvTWVzc2FnZSkge1xuICAgICAgICAgICAgICB0aGlzLm9uSW5mb01lc3NhZ2UocGt0LmluZm8pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlcihcIkVSUk9SOiBVbmtub3duIHBhY2tldCByZWNlaXZlZC5cIik7XG4gICAgICAgICAgfVxuICAgICAgICB9LCAwKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBDb25uZWN0aW9uIG9wZW4sIHJlYWR5IHRvIHN0YXJ0IHNlbmRpbmcuXG4gICNjb25uZWN0aW9uT3BlbigpIHtcbiAgICBpZiAoIXRoaXMuX2V4cGlyZVByb21pc2VzKSB7XG4gICAgICAvLyBSZWplY3QgcHJvbWlzZXMgd2hpY2ggaGF2ZSBub3QgYmVlbiByZXNvbHZlZCBmb3IgdG9vIGxvbmcuXG4gICAgICB0aGlzLl9leHBpcmVQcm9taXNlcyA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgY29uc3QgZXJyID0gbmV3IEVycm9yKFwiVGltZW91dCAoNTA0KVwiKTtcbiAgICAgICAgY29uc3QgZXhwaXJlcyA9IG5ldyBEYXRlKG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gQ29uc3QuRVhQSVJFX1BST01JU0VTX1RJTUVPVVQpO1xuICAgICAgICBmb3IgKGxldCBpZCBpbiB0aGlzLl9wZW5kaW5nUHJvbWlzZXMpIHtcbiAgICAgICAgICBsZXQgY2FsbGJhY2tzID0gdGhpcy5fcGVuZGluZ1Byb21pc2VzW2lkXTtcbiAgICAgICAgICBpZiAoY2FsbGJhY2tzICYmIGNhbGxiYWNrcy50cyA8IGV4cGlyZXMpIHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyKFwiUHJvbWlzZSBleHBpcmVkXCIsIGlkKTtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9wZW5kaW5nUHJvbWlzZXNbaWRdO1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrcy5yZWplY3QpIHtcbiAgICAgICAgICAgICAgY2FsbGJhY2tzLnJlamVjdChlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwgQ29uc3QuRVhQSVJFX1BST01JU0VTX1BFUklPRCk7XG4gICAgfVxuICAgIHRoaXMuaGVsbG8oKTtcbiAgfVxuXG4gICNkaXNjb25uZWN0ZWQoZXJyLCBjb2RlKSB7XG4gICAgdGhpcy5faW5QYWNrZXRDb3VudCA9IDA7XG4gICAgdGhpcy5fc2VydmVySW5mbyA9IG51bGw7XG4gICAgdGhpcy5fYXV0aGVudGljYXRlZCA9IGZhbHNlO1xuXG4gICAgaWYgKHRoaXMuX2V4cGlyZVByb21pc2VzKSB7XG4gICAgICBjbGVhckludGVydmFsKHRoaXMuX2V4cGlyZVByb21pc2VzKTtcbiAgICAgIHRoaXMuX2V4cGlyZVByb21pc2VzID0gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBNYXJrIGFsbCB0b3BpY3MgYXMgdW5zdWJzY3JpYmVkXG4gICAgdGhpcy4jY2FjaGVNYXAoJ3RvcGljJywgKHRvcGljLCBrZXkpID0+IHtcbiAgICAgIHRvcGljLl9yZXNldFN1YigpO1xuICAgIH0pO1xuXG4gICAgLy8gUmVqZWN0IGFsbCBwZW5kaW5nIHByb21pc2VzXG4gICAgZm9yIChsZXQga2V5IGluIHRoaXMuX3BlbmRpbmdQcm9taXNlcykge1xuICAgICAgY29uc3QgY2FsbGJhY2tzID0gdGhpcy5fcGVuZGluZ1Byb21pc2VzW2tleV07XG4gICAgICBpZiAoY2FsbGJhY2tzICYmIGNhbGxiYWNrcy5yZWplY3QpIHtcbiAgICAgICAgY2FsbGJhY2tzLnJlamVjdChlcnIpO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLl9wZW5kaW5nUHJvbWlzZXMgPSB7fTtcblxuICAgIGlmICh0aGlzLm9uRGlzY29ubmVjdCkge1xuICAgICAgdGhpcy5vbkRpc2Nvbm5lY3QoZXJyKTtcbiAgICB9XG4gIH1cblxuICAvLyBHZXQgVXNlciBBZ2VudCBzdHJpbmdcbiAgI2dldFVzZXJBZ2VudCgpIHtcbiAgICByZXR1cm4gdGhpcy5fYXBwTmFtZSArICcgKCcgKyAodGhpcy5fYnJvd3NlciA/IHRoaXMuX2Jyb3dzZXIgKyAnOyAnIDogJycpICsgdGhpcy5faHdvcyArICcpOyAnICsgQ29uc3QuTElCUkFSWTtcbiAgfVxuXG4gIC8vIEdlbmVyYXRvciBvZiBwYWNrZXRzIHN0dWJzXG4gICNpbml0UGFja2V0KHR5cGUsIHRvcGljKSB7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICBjYXNlICdoaSc6XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgJ2hpJzoge1xuICAgICAgICAgICAgJ2lkJzogdGhpcy5nZXROZXh0VW5pcXVlSWQoKSxcbiAgICAgICAgICAgICd2ZXInOiBDb25zdC5WRVJTSU9OLFxuICAgICAgICAgICAgJ3VhJzogdGhpcy4jZ2V0VXNlckFnZW50KCksXG4gICAgICAgICAgICAnZGV2JzogdGhpcy5fZGV2aWNlVG9rZW4sXG4gICAgICAgICAgICAnbGFuZyc6IHRoaXMuX2h1bWFuTGFuZ3VhZ2UsXG4gICAgICAgICAgICAncGxhdGYnOiB0aGlzLl9wbGF0Zm9ybVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgY2FzZSAnYWNjJzpcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAnYWNjJzoge1xuICAgICAgICAgICAgJ2lkJzogdGhpcy5nZXROZXh0VW5pcXVlSWQoKSxcbiAgICAgICAgICAgICd1c2VyJzogbnVsbCxcbiAgICAgICAgICAgICdzY2hlbWUnOiBudWxsLFxuICAgICAgICAgICAgJ3NlY3JldCc6IG51bGwsXG4gICAgICAgICAgICAnbG9naW4nOiBmYWxzZSxcbiAgICAgICAgICAgICd0YWdzJzogbnVsbCxcbiAgICAgICAgICAgICdkZXNjJzoge30sXG4gICAgICAgICAgICAnY3JlZCc6IHt9XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICBjYXNlICdsb2dpbic6XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgJ2xvZ2luJzoge1xuICAgICAgICAgICAgJ2lkJzogdGhpcy5nZXROZXh0VW5pcXVlSWQoKSxcbiAgICAgICAgICAgICdzY2hlbWUnOiBudWxsLFxuICAgICAgICAgICAgJ3NlY3JldCc6IG51bGxcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgIGNhc2UgJ3N1Yic6XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgJ3N1Yic6IHtcbiAgICAgICAgICAgICdpZCc6IHRoaXMuZ2V0TmV4dFVuaXF1ZUlkKCksXG4gICAgICAgICAgICAndG9waWMnOiB0b3BpYyxcbiAgICAgICAgICAgICdzZXQnOiB7fSxcbiAgICAgICAgICAgICdnZXQnOiB7fVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgY2FzZSAnbGVhdmUnOlxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICdsZWF2ZSc6IHtcbiAgICAgICAgICAgICdpZCc6IHRoaXMuZ2V0TmV4dFVuaXF1ZUlkKCksXG4gICAgICAgICAgICAndG9waWMnOiB0b3BpYyxcbiAgICAgICAgICAgICd1bnN1Yic6IGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICBjYXNlICdwdWInOlxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICdwdWInOiB7XG4gICAgICAgICAgICAnaWQnOiB0aGlzLmdldE5leHRVbmlxdWVJZCgpLFxuICAgICAgICAgICAgJ3RvcGljJzogdG9waWMsXG4gICAgICAgICAgICAnbm9lY2hvJzogZmFsc2UsXG4gICAgICAgICAgICAnaGVhZCc6IG51bGwsXG4gICAgICAgICAgICAnY29udGVudCc6IHt9XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICBjYXNlICdnZXQnOlxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICdnZXQnOiB7XG4gICAgICAgICAgICAnaWQnOiB0aGlzLmdldE5leHRVbmlxdWVJZCgpLFxuICAgICAgICAgICAgJ3RvcGljJzogdG9waWMsXG4gICAgICAgICAgICAnd2hhdCc6IG51bGwsXG4gICAgICAgICAgICAnZGVzYyc6IHt9LFxuICAgICAgICAgICAgJ3N1Yic6IHt9LFxuICAgICAgICAgICAgJ2RhdGEnOiB7fVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgY2FzZSAnc2V0JzpcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAnc2V0Jzoge1xuICAgICAgICAgICAgJ2lkJzogdGhpcy5nZXROZXh0VW5pcXVlSWQoKSxcbiAgICAgICAgICAgICd0b3BpYyc6IHRvcGljLFxuICAgICAgICAgICAgJ2Rlc2MnOiB7fSxcbiAgICAgICAgICAgICdzdWInOiB7fSxcbiAgICAgICAgICAgICd0YWdzJzogW10sXG4gICAgICAgICAgICAnZXBoZW1lcmFsJzoge31cbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgIGNhc2UgJ2RlbCc6XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgJ2RlbCc6IHtcbiAgICAgICAgICAgICdpZCc6IHRoaXMuZ2V0TmV4dFVuaXF1ZUlkKCksXG4gICAgICAgICAgICAndG9waWMnOiB0b3BpYyxcbiAgICAgICAgICAgICd3aGF0JzogbnVsbCxcbiAgICAgICAgICAgICdkZWxzZXEnOiBudWxsLFxuICAgICAgICAgICAgJ3VzZXInOiBudWxsLFxuICAgICAgICAgICAgJ2hhcmQnOiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgY2FzZSAnbm90ZSc6XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgJ25vdGUnOiB7XG4gICAgICAgICAgICAvLyBubyBpZCBieSBkZXNpZ24gKGV4Y2VwdCBjYWxscykuXG4gICAgICAgICAgICAndG9waWMnOiB0b3BpYyxcbiAgICAgICAgICAgICd3aGF0JzogbnVsbCwgLy8gb25lIG9mIFwicmVjdlwiLCBcInJlYWRcIiwgXCJrcFwiLCBcImNhbGxcIlxuICAgICAgICAgICAgJ3NlcSc6IHVuZGVmaW5lZCAvLyB0aGUgc2VydmVyLXNpZGUgbWVzc2FnZSBpZCBhY2tub3dsZWRnZWQgYXMgcmVjZWl2ZWQgb3IgcmVhZC5cbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5rbm93biBwYWNrZXQgdHlwZSByZXF1ZXN0ZWQ6ICR7dHlwZX1gKTtcbiAgICB9XG4gIH1cblxuICAvLyBDYWNoZSBtYW5hZ2VtZW50XG4gICNjYWNoZVB1dCh0eXBlLCBuYW1lLCBvYmopIHtcbiAgICB0aGlzLl9jYWNoZVt0eXBlICsgJzonICsgbmFtZV0gPSBvYmo7XG4gIH1cbiAgI2NhY2hlR2V0KHR5cGUsIG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5fY2FjaGVbdHlwZSArICc6JyArIG5hbWVdO1xuICB9XG4gICNjYWNoZURlbCh0eXBlLCBuYW1lKSB7XG4gICAgZGVsZXRlIHRoaXMuX2NhY2hlW3R5cGUgKyAnOicgKyBuYW1lXTtcbiAgfVxuXG4gIC8vIEVudW1lcmF0ZSBhbGwgaXRlbXMgaW4gY2FjaGUsIGNhbGwgZnVuYyBmb3IgZWFjaCBpdGVtLlxuICAvLyBFbnVtZXJhdGlvbiBzdG9wcyBpZiBmdW5jIHJldHVybnMgdHJ1ZS5cbiAgI2NhY2hlTWFwKHR5cGUsIGZ1bmMsIGNvbnRleHQpIHtcbiAgICBjb25zdCBrZXkgPSB0eXBlID8gdHlwZSArICc6JyA6IHVuZGVmaW5lZDtcbiAgICBmb3IgKGxldCBpZHggaW4gdGhpcy5fY2FjaGUpIHtcbiAgICAgIGlmICgha2V5IHx8IGlkeC5pbmRleE9mKGtleSkgPT0gMCkge1xuICAgICAgICBpZiAoZnVuYy5jYWxsKGNvbnRleHQsIHRoaXMuX2NhY2hlW2lkeF0sIGlkeCkpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIE1ha2UgbGltaXRlZCBjYWNoZSBtYW5hZ2VtZW50IGF2YWlsYWJsZSB0byB0b3BpYy5cbiAgLy8gQ2FjaGluZyB1c2VyLnB1YmxpYyBvbmx5LiBFdmVyeXRoaW5nIGVsc2UgaXMgcGVyLXRvcGljLlxuICAjYXR0YWNoQ2FjaGVUb1RvcGljKHRvcGljKSB7XG4gICAgdG9waWMuX3Rpbm9kZSA9IHRoaXM7XG5cbiAgICB0b3BpYy5fY2FjaGVHZXRVc2VyID0gKHVpZCkgPT4ge1xuICAgICAgY29uc3QgcHViID0gdGhpcy4jY2FjaGVHZXQoJ3VzZXInLCB1aWQpO1xuICAgICAgaWYgKHB1Yikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHVzZXI6IHVpZCxcbiAgICAgICAgICBwdWJsaWM6IG1lcmdlT2JqKHt9LCBwdWIpXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH07XG4gICAgdG9waWMuX2NhY2hlUHV0VXNlciA9ICh1aWQsIHVzZXIpID0+IHtcbiAgICAgIHRoaXMuI2NhY2hlUHV0KCd1c2VyJywgdWlkLCBtZXJnZU9iaih7fSwgdXNlci5wdWJsaWMpKTtcbiAgICB9O1xuICAgIHRvcGljLl9jYWNoZURlbFVzZXIgPSAodWlkKSA9PiB7XG4gICAgICB0aGlzLiNjYWNoZURlbCgndXNlcicsIHVpZCk7XG4gICAgfTtcbiAgICB0b3BpYy5fY2FjaGVQdXRTZWxmID0gXyA9PiB7XG4gICAgICB0aGlzLiNjYWNoZVB1dCgndG9waWMnLCB0b3BpYy5uYW1lLCB0b3BpYyk7XG4gICAgfTtcbiAgICB0b3BpYy5fY2FjaGVEZWxTZWxmID0gXyA9PiB7XG4gICAgICB0aGlzLiNjYWNoZURlbCgndG9waWMnLCB0b3BpYy5uYW1lKTtcbiAgICB9O1xuICB9XG5cbiAgLy8gT24gc3VjY2Vzc2Z1bCBsb2dpbiBzYXZlIHNlcnZlci1wcm92aWRlZCBkYXRhLlxuICAjbG9naW5TdWNjZXNzZnVsKGN0cmwpIHtcbiAgICBpZiAoIWN0cmwucGFyYW1zIHx8ICFjdHJsLnBhcmFtcy51c2VyKSB7XG4gICAgICByZXR1cm4gY3RybDtcbiAgICB9XG4gICAgLy8gVGhpcyBpcyBhIHJlc3BvbnNlIHRvIGEgc3VjY2Vzc2Z1bCBsb2dpbixcbiAgICAvLyBleHRyYWN0IFVJRCBhbmQgc2VjdXJpdHkgdG9rZW4sIHNhdmUgaXQgaW4gVGlub2RlIG1vZHVsZVxuICAgIHRoaXMuX215VUlEID0gY3RybC5wYXJhbXMudXNlcjtcbiAgICB0aGlzLl9hdXRoZW50aWNhdGVkID0gKGN0cmwgJiYgY3RybC5jb2RlID49IDIwMCAmJiBjdHJsLmNvZGUgPCAzMDApO1xuICAgIGlmIChjdHJsLnBhcmFtcyAmJiBjdHJsLnBhcmFtcy50b2tlbiAmJiBjdHJsLnBhcmFtcy5leHBpcmVzKSB7XG4gICAgICB0aGlzLl9hdXRoVG9rZW4gPSB7XG4gICAgICAgIHRva2VuOiBjdHJsLnBhcmFtcy50b2tlbixcbiAgICAgICAgZXhwaXJlczogY3RybC5wYXJhbXMuZXhwaXJlc1xuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fYXV0aFRva2VuID0gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vbkxvZ2luKSB7XG4gICAgICB0aGlzLm9uTG9naW4oY3RybC5jb2RlLCBjdHJsLnRleHQpO1xuICAgIH1cblxuICAgIHJldHVybiBjdHJsO1xuICB9XG5cbiAgLy8gU3RhdGljIG1ldGhvZHMuXG4gIC8qKlxuICAgKiBIZWxwZXIgbWV0aG9kIHRvIHBhY2thZ2UgYWNjb3VudCBjcmVkZW50aWFsLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZyB8IENyZWRlbnRpYWx9IG1ldGggLSB2YWxpZGF0aW9uIG1ldGhvZCBvciBvYmplY3Qgd2l0aCB2YWxpZGF0aW9uIGRhdGEuXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gdmFsIC0gdmFsaWRhdGlvbiB2YWx1ZSAoZS5nLiBlbWFpbCBvciBwaG9uZSBudW1iZXIpLlxuICAgKiBAcGFyYW0ge09iamVjdD19IHBhcmFtcyAtIHZhbGlkYXRpb24gcGFyYW1ldGVycy5cbiAgICogQHBhcmFtIHtzdHJpbmc9fSByZXNwIC0gdmFsaWRhdGlvbiByZXNwb25zZS5cbiAgICpcbiAgICogQHJldHVybnMge0FycmF5LjxDcmVkZW50aWFsPn0gYXJyYXkgd2l0aCBhIHNpbmdsZSBjcmVkZW50aWFsIG9yIDxjb2RlPm51bGw8L2NvZGU+IGlmIG5vIHZhbGlkIGNyZWRlbnRpYWxzIHdlcmUgZ2l2ZW4uXG4gICAqL1xuICBzdGF0aWMgY3JlZGVudGlhbChtZXRoLCB2YWwsIHBhcmFtcywgcmVzcCkge1xuICAgIGlmICh0eXBlb2YgbWV0aCA9PSAnb2JqZWN0Jykge1xuICAgICAgKHtcbiAgICAgICAgdmFsLFxuICAgICAgICBwYXJhbXMsXG4gICAgICAgIHJlc3AsXG4gICAgICAgIG1ldGhcbiAgICAgIH0gPSBtZXRoKTtcbiAgICB9XG4gICAgaWYgKG1ldGggJiYgKHZhbCB8fCByZXNwKSkge1xuICAgICAgcmV0dXJuIFt7XG4gICAgICAgICdtZXRoJzogbWV0aCxcbiAgICAgICAgJ3ZhbCc6IHZhbCxcbiAgICAgICAgJ3Jlc3AnOiByZXNwLFxuICAgICAgICAncGFyYW1zJzogcGFyYW1zXG4gICAgICB9XTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lIHRvcGljIHR5cGUgZnJvbSB0b3BpYydzIG5hbWU6IGdycCwgcDJwLCBtZSwgZm5kLCBzeXMuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gdGVzdC5cbiAgICogQHJldHVybnMge3N0cmluZ30gT25lIG9mIDxjb2RlPlwibWVcIjwvY29kZT4sIDxjb2RlPlwiZm5kXCI8L2NvZGU+LCA8Y29kZT5cInN5c1wiPC9jb2RlPiwgPGNvZGU+XCJncnBcIjwvY29kZT4sXG4gICAqICAgIDxjb2RlPlwicDJwXCI8L2NvZGU+IG9yIDxjb2RlPnVuZGVmaW5lZDwvY29kZT4uXG4gICAqL1xuICBzdGF0aWMgdG9waWNUeXBlKG5hbWUpIHtcbiAgICByZXR1cm4gVG9waWMudG9waWNUeXBlKG5hbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSBnaXZlbiB0b3BpYyBuYW1lIGlzIGEgbmFtZSBvZiBhICdtZScgdG9waWMuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gdGVzdC5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIHRoZSBuYW1lIGlzIGEgbmFtZSBvZiBhICdtZScgdG9waWMsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBzdGF0aWMgaXNNZVRvcGljTmFtZShuYW1lKSB7XG4gICAgcmV0dXJuIFRvcGljLmlzTWVUb3BpY05hbWUobmFtZSk7XG4gIH1cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSBnaXZlbiB0b3BpYyBuYW1lIGlzIGEgbmFtZSBvZiBhIGdyb3VwIHRvcGljLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIHRlc3QuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0aGUgbmFtZSBpcyBhIG5hbWUgb2YgYSBncm91cCB0b3BpYywgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIHN0YXRpYyBpc0dyb3VwVG9waWNOYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gVG9waWMuaXNHcm91cFRvcGljTmFtZShuYW1lKTtcbiAgfVxuICAvKipcbiAgICogQ2hlY2sgaWYgdGhlIGdpdmVuIHRvcGljIG5hbWUgaXMgYSBuYW1lIG9mIGEgcDJwIHRvcGljLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIHRlc3QuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0aGUgbmFtZSBpcyBhIG5hbWUgb2YgYSBwMnAgdG9waWMsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBzdGF0aWMgaXNQMlBUb3BpY05hbWUobmFtZSkge1xuICAgIHJldHVybiBUb3BpYy5pc1AyUFRvcGljTmFtZShuYW1lKTtcbiAgfVxuICAvKipcbiAgICogQ2hlY2sgaWYgdGhlIGdpdmVuIHRvcGljIG5hbWUgaXMgYSBuYW1lIG9mIGEgY29tbXVuaWNhdGlvbiB0b3BpYywgaS5lLiBQMlAgb3IgZ3JvdXAuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gdGVzdC5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIHRoZSBuYW1lIGlzIGEgbmFtZSBvZiBhIHAycCBvciBncm91cCB0b3BpYywgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIHN0YXRpYyBpc0NvbW1Ub3BpY05hbWUobmFtZSkge1xuICAgIHJldHVybiBUb3BpYy5pc0NvbW1Ub3BpY05hbWUobmFtZSk7XG4gIH1cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSB0b3BpYyBuYW1lIGlzIGEgbmFtZSBvZiBhIG5ldyB0b3BpYy5cbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSB0b3BpYyBuYW1lIHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgdGhlIG5hbWUgaXMgYSBuYW1lIG9mIGEgbmV3IHRvcGljLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgc3RhdGljIGlzTmV3R3JvdXBUb3BpY05hbWUobmFtZSkge1xuICAgIHJldHVybiBUb3BpYy5pc05ld0dyb3VwVG9waWNOYW1lKG5hbWUpO1xuICB9XG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgdG9waWMgbmFtZSBpcyBhIG5hbWUgb2YgYSBjaGFubmVsLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIHRvcGljIG5hbWUgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIHtib29sZWFufSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0aGUgbmFtZSBpcyBhIG5hbWUgb2YgYSBjaGFubmVsLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgc3RhdGljIGlzQ2hhbm5lbFRvcGljTmFtZShuYW1lKSB7XG4gICAgcmV0dXJuIFRvcGljLmlzQ2hhbm5lbFRvcGljTmFtZShuYW1lKTtcbiAgfVxuICAvKipcbiAgICogR2V0IGluZm9ybWF0aW9uIGFib3V0IHRoZSBjdXJyZW50IHZlcnNpb24gb2YgdGhpcyBUaW5vZGUgY2xpZW50IGxpYnJhcnkuXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IHNlbWFudGljIHZlcnNpb24gb2YgdGhlIGxpYnJhcnksIGUuZy4gPGNvZGU+XCIwLjE1LjUtcmMxXCI8L2NvZGU+LlxuICAgKi9cbiAgc3RhdGljIGdldFZlcnNpb24oKSB7XG4gICAgcmV0dXJuIENvbnN0LlZFUlNJT047XG4gIH1cbiAgLyoqXG4gICAqIFRvIHVzZSBUaW5vZGUgaW4gYSBub24gYnJvd3NlciBjb250ZXh0LCBzdXBwbHkgV2ViU29ja2V0IGFuZCBYTUxIdHRwUmVxdWVzdCBwcm92aWRlcnMuXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHdzUHJvdmlkZXIgPGNvZGU+V2ViU29ja2V0PC9jb2RlPiBwcm92aWRlciwgZS5nLiBmb3Igbm9kZUpTICwgPGNvZGU+cmVxdWlyZSgnd3MnKTwvY29kZT4uXG4gICAqIEBwYXJhbSB4aHJQcm92aWRlciA8Y29kZT5YTUxIdHRwUmVxdWVzdDwvY29kZT4gcHJvdmlkZXIsIGUuZy4gZm9yIG5vZGUgPGNvZGU+cmVxdWlyZSgneGhyJyk8L2NvZGU+LlxuICAgKi9cbiAgc3RhdGljIHNldE5ldHdvcmtQcm92aWRlcnMod3NQcm92aWRlciwgeGhyUHJvdmlkZXIpIHtcbiAgICBXZWJTb2NrZXRQcm92aWRlciA9IHdzUHJvdmlkZXI7XG4gICAgWEhSUHJvdmlkZXIgPSB4aHJQcm92aWRlcjtcblxuICAgIENvbm5lY3Rpb24uc2V0TmV0d29ya1Byb3ZpZGVycyhXZWJTb2NrZXRQcm92aWRlciwgWEhSUHJvdmlkZXIpO1xuICAgIExhcmdlRmlsZUhlbHBlci5zZXROZXR3b3JrUHJvdmlkZXIoWEhSUHJvdmlkZXIpO1xuICB9XG4gIC8qKlxuICAgKiBUbyB1c2UgVGlub2RlIGluIGEgbm9uIGJyb3dzZXIgY29udGV4dCwgc3VwcGx5IDxjb2RlPmluZGV4ZWREQjwvY29kZT4gcHJvdmlkZXIuXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIGlkYlByb3ZpZGVyIDxjb2RlPmluZGV4ZWREQjwvY29kZT4gcHJvdmlkZXIsIGUuZy4gZm9yIG5vZGVKUyAsIDxjb2RlPnJlcXVpcmUoJ2Zha2UtaW5kZXhlZGRiJyk8L2NvZGU+LlxuICAgKi9cbiAgc3RhdGljIHNldERhdGFiYXNlUHJvdmlkZXIoaWRiUHJvdmlkZXIpIHtcbiAgICBJbmRleGVkREJQcm92aWRlciA9IGlkYlByb3ZpZGVyO1xuXG4gICAgREJDYWNoZS5zZXREYXRhYmFzZVByb3ZpZGVyKEluZGV4ZWREQlByb3ZpZGVyKTtcbiAgfVxuICAvKipcbiAgICogUmV0dXJuIGluZm9ybWF0aW9uIGFib3V0IHRoZSBjdXJyZW50IG5hbWUgYW5kIHZlcnNpb24gb2YgdGhpcyBUaW5vZGUgbGlicmFyeS5cbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSB0aGUgbmFtZSBvZiB0aGUgbGlicmFyeSBhbmQgaXQncyB2ZXJzaW9uLlxuICAgKi9cbiAgc3RhdGljIGdldExpYnJhcnkoKSB7XG4gICAgcmV0dXJuIENvbnN0LkxJQlJBUlk7XG4gIH1cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSBnaXZlbiBzdHJpbmcgcmVwcmVzZW50cyA8Y29kZT5OVUxMPC9jb2RlPiB2YWx1ZSBhcyBkZWZpbmVkIGJ5IFRpbm9kZSAoPGNvZGU+J1xcdTI0MjEnPC9jb2RlPikuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHIgLSBzdHJpbmcgdG8gY2hlY2sgZm9yIDxjb2RlPk5VTEw8L2NvZGU+IHZhbHVlLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgc3RyaW5nIHJlcHJlc2VudHMgPGNvZGU+TlVMTDwvY29kZT4gdmFsdWUsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBzdGF0aWMgaXNOdWxsVmFsdWUoc3RyKSB7XG4gICAgcmV0dXJuIHN0ciA9PT0gQ29uc3QuREVMX0NIQVI7XG4gIH1cblxuICAvLyBJbnN0YW5jZSBtZXRob2RzLlxuXG4gIC8vIEdlbmVyYXRlcyB1bmlxdWUgbWVzc2FnZSBJRHNcbiAgZ2V0TmV4dFVuaXF1ZUlkKCkge1xuICAgIHJldHVybiAodGhpcy5fbWVzc2FnZUlkICE9IDApID8gJycgKyB0aGlzLl9tZXNzYWdlSWQrKyA6IHVuZGVmaW5lZDtcbiAgfTtcblxuICAvKipcbiAgICogQ29ubmVjdCB0byB0aGUgc2VydmVyLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gaG9zdF8gLSBuYW1lIG9mIHRoZSBob3N0IHRvIGNvbm5lY3QgdG8uXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IFByb21pc2UgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgY29ubmVjdGlvbiBjYWxsIGNvbXBsZXRlczpcbiAgICogICAgPGNvZGU+cmVzb2x2ZSgpPC9jb2RlPiBpcyBjYWxsZWQgd2l0aG91dCBwYXJhbWV0ZXJzLCA8Y29kZT5yZWplY3QoKTwvY29kZT4gcmVjZWl2ZXMgdGhlXG4gICAqICAgIDxjb2RlPkVycm9yPC9jb2RlPiBhcyBhIHNpbmdsZSBwYXJhbWV0ZXIuXG4gICAqL1xuICBjb25uZWN0KGhvc3RfKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Nvbm5lY3Rpb24uY29ubmVjdChob3N0Xyk7XG4gIH1cblxuICAvKipcbiAgICogQXR0ZW1wdCB0byByZWNvbm5lY3QgdG8gdGhlIHNlcnZlciBpbW1lZGlhdGVseS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGZvcmNlIC0gcmVjb25uZWN0IGV2ZW4gaWYgdGhlcmUgaXMgYSBjb25uZWN0aW9uIGFscmVhZHkuXG4gICAqL1xuICByZWNvbm5lY3QoZm9yY2UpIHtcbiAgICB0aGlzLl9jb25uZWN0aW9uLnJlY29ubmVjdChmb3JjZSk7XG4gIH1cblxuICAvKipcbiAgICogRGlzY29ubmVjdCBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAqL1xuICBkaXNjb25uZWN0KCkge1xuICAgIHRoaXMuX2Nvbm5lY3Rpb24uZGlzY29ubmVjdCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIENsZWFyIHBlcnNpc3RlbnQgY2FjaGU6IHJlbW92ZSBJbmRleGVkREIuXG4gICAqXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IFByb21pc2UgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgb3BlcmF0aW9uIGlzIGNvbXBsZXRlZC5cbiAgICovXG4gIGNsZWFyU3RvcmFnZSgpIHtcbiAgICBpZiAodGhpcy5fZGIuaXNSZWFkeSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5fZGIuZGVsZXRlRGF0YWJhc2UoKTtcbiAgICB9XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgcGVyc2lzdGVudCBjYWNoZTogY3JlYXRlIEluZGV4ZWREQiBjYWNoZS5cbiAgICpcbiAgICogQHJldHVybiB7UHJvbWlzZX0gUHJvbWlzZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBvcGVyYXRpb24gaXMgY29tcGxldGVkLlxuICAgKi9cbiAgaW5pdFN0b3JhZ2UoKSB7XG4gICAgaWYgKCF0aGlzLl9kYi5pc1JlYWR5KCkpIHtcbiAgICAgIHJldHVybiB0aGlzLl9kYi5pbml0RGF0YWJhc2UoKTtcbiAgICB9XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgYSBuZXR3b3JrIHByb2JlIG1lc3NhZ2UgdG8gbWFrZSBzdXJlIHRoZSBjb25uZWN0aW9uIGlzIGFsaXZlLlxuICAgKi9cbiAgbmV0d29ya1Byb2JlKCkge1xuICAgIHRoaXMuX2Nvbm5lY3Rpb24ucHJvYmUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBmb3IgbGl2ZSBjb25uZWN0aW9uIHRvIHNlcnZlci5cbiAgICpcbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIHRoZXJlIGlzIGEgbGl2ZSBjb25uZWN0aW9uLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgaXNDb25uZWN0ZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Nvbm5lY3Rpb24uaXNDb25uZWN0ZWQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBjb25uZWN0aW9uIGlzIGF1dGhlbnRpY2F0ZWQgKGxhc3QgbG9naW4gd2FzIHN1Y2Nlc3NmdWwpLlxuICAgKlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgYXV0aGVudGljYXRlZCwgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIGlzQXV0aGVudGljYXRlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fYXV0aGVudGljYXRlZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgQVBJIGtleSBhbmQgYXV0aCB0b2tlbiB0byB0aGUgcmVsYXRpdmUgVVJMIG1ha2luZyBpdCB1c2FibGUgZm9yIGdldHRpbmcgZGF0YVxuICAgKiBmcm9tIHRoZSBzZXJ2ZXIgaW4gYSBzaW1wbGUgPGNvZGU+SFRUUCBHRVQ8L2NvZGU+IHJlcXVlc3QuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBVUkwgLSBVUkwgdG8gd3JhcC5cbiAgICogQHJldHVybnMge3N0cmluZ30gVVJMIHdpdGggYXBwZW5kZWQgQVBJIGtleSBhbmQgdG9rZW4sIGlmIHZhbGlkIHRva2VuIGlzIHByZXNlbnQuXG4gICAqL1xuICBhdXRob3JpemVVUkwodXJsKSB7XG4gICAgaWYgKHR5cGVvZiB1cmwgIT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiB1cmw7XG4gICAgfVxuXG4gICAgaWYgKGlzVXJsUmVsYXRpdmUodXJsKSkge1xuICAgICAgLy8gRmFrZSBiYXNlIHRvIG1ha2UgdGhlIHJlbGF0aXZlIFVSTCBwYXJzZWFibGUuXG4gICAgICBjb25zdCBiYXNlID0gJ3NjaGVtZTovL2hvc3QvJztcbiAgICAgIGNvbnN0IHBhcnNlZCA9IG5ldyBVUkwodXJsLCBiYXNlKTtcbiAgICAgIGlmICh0aGlzLl9hcGlLZXkpIHtcbiAgICAgICAgcGFyc2VkLnNlYXJjaFBhcmFtcy5hcHBlbmQoJ2FwaWtleScsIHRoaXMuX2FwaUtleSk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5fYXV0aFRva2VuICYmIHRoaXMuX2F1dGhUb2tlbi50b2tlbikge1xuICAgICAgICBwYXJzZWQuc2VhcmNoUGFyYW1zLmFwcGVuZCgnYXV0aCcsICd0b2tlbicpO1xuICAgICAgICBwYXJzZWQuc2VhcmNoUGFyYW1zLmFwcGVuZCgnc2VjcmV0JywgdGhpcy5fYXV0aFRva2VuLnRva2VuKTtcbiAgICAgIH1cbiAgICAgIC8vIENvbnZlcnQgYmFjayB0byBzdHJpbmcgYW5kIHN0cmlwIGZha2UgYmFzZSBVUkwgZXhjZXB0IGZvciB0aGUgcm9vdCBzbGFzaC5cbiAgICAgIHVybCA9IHBhcnNlZC50b1N0cmluZygpLnN1YnN0cmluZyhiYXNlLmxlbmd0aCAtIDEpO1xuICAgIH1cbiAgICByZXR1cm4gdXJsO1xuICB9XG5cbiAgLyoqXG4gICAqIEB0eXBlZGVmIEFjY291bnRQYXJhbXNcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHByb3BlcnR5IHtEZWZBY3M9fSBkZWZhY3MgLSBEZWZhdWx0IGFjY2VzcyBwYXJhbWV0ZXJzIGZvciB1c2VyJ3MgPGNvZGU+bWU8L2NvZGU+IHRvcGljLlxuICAgKiBAcHJvcGVydHkge09iamVjdD19IHB1YmxpYyAtIFB1YmxpYyBhcHBsaWNhdGlvbi1kZWZpbmVkIGRhdGEgZXhwb3NlZCBvbiA8Y29kZT5tZTwvY29kZT4gdG9waWMuXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0PX0gcHJpdmF0ZSAtIFByaXZhdGUgYXBwbGljYXRpb24tZGVmaW5lZCBkYXRhIGFjY2Vzc2libGUgb24gPGNvZGU+bWU8L2NvZGU+IHRvcGljLlxuICAgKiBAcHJvcGVydHkge09iamVjdD19IHRydXN0ZWQgLSBUcnVzdGVkIHVzZXIgZGF0YSB3aGljaCBjYW4gYmUgc2V0IGJ5IGEgcm9vdCB1c2VyIG9ubHkuXG4gICAqIEBwcm9wZXJ0eSB7QXJyYXkuPHN0cmluZz59IHRhZ3MgLSBhcnJheSBvZiBzdHJpbmcgdGFncyBmb3IgdXNlciBkaXNjb3ZlcnkuXG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nPX0gdG9rZW4gLSBhdXRoZW50aWNhdGlvbiB0b2tlbiB0byB1c2UuXG4gICAqIEBwcm9wZXJ0eSB7QXJyYXkuPHN0cmluZz49fSBhdHRhY2htZW50cyAtIEFycmF5IG9mIHJlZmVyZW5jZXMgdG8gb3V0IG9mIGJhbmQgYXR0YWNobWVudHMgdXNlZCBpbiBhY2NvdW50IGRlc2NyaXB0aW9uLlxuICAgKi9cbiAgLyoqXG4gICAqIEB0eXBlZGVmIERlZkFjc1xuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAcHJvcGVydHkge3N0cmluZz19IGF1dGggLSBBY2Nlc3MgbW9kZSBmb3IgPGNvZGU+bWU8L2NvZGU+IGZvciBhdXRoZW50aWNhdGVkIHVzZXJzLlxuICAgKiBAcHJvcGVydHkge3N0cmluZz19IGFub24gLSBBY2Nlc3MgbW9kZSBmb3IgPGNvZGU+bWU8L2NvZGU+IGZvciBhbm9ueW1vdXMgdXNlcnMuXG4gICAqL1xuXG4gIC8qKlxuICAgKiBDcmVhdGUgb3IgdXBkYXRlIGFuIGFjY291bnQuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1aWQgLSBVc2VyIGlkIHRvIHVwZGF0ZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2NoZW1lIC0gQXV0aGVudGljYXRpb24gc2NoZW1lOyA8Y29kZT5cImJhc2ljXCI8L2NvZGU+IGFuZCA8Y29kZT5cImFub255bW91c1wiPC9jb2RlPiBhcmUgdGhlIGN1cnJlbnRseSBzdXBwb3J0ZWQgc2NoZW1lcy5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHNlY3JldCAtIEF1dGhlbnRpY2F0aW9uIHNlY3JldCwgYXNzdW1lZCB0byBiZSBhbHJlYWR5IGJhc2U2NCBlbmNvZGVkLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBsb2dpbiAtIFVzZSBuZXcgYWNjb3VudCB0byBhdXRoZW50aWNhdGUgY3VycmVudCBzZXNzaW9uXG4gICAqIEBwYXJhbSB7QWNjb3VudFBhcmFtcz19IHBhcmFtcyAtIFVzZXIgZGF0YSB0byBwYXNzIHRvIHRoZSBzZXJ2ZXIuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiBzZXJ2ZXIgcmVwbHkgaXMgcmVjZWl2ZWQuXG4gICAqL1xuICBhY2NvdW50KHVpZCwgc2NoZW1lLCBzZWNyZXQsIGxvZ2luLCBwYXJhbXMpIHtcbiAgICBjb25zdCBwa3QgPSB0aGlzLiNpbml0UGFja2V0KCdhY2MnKTtcbiAgICBwa3QuYWNjLnVzZXIgPSB1aWQ7XG4gICAgcGt0LmFjYy5zY2hlbWUgPSBzY2hlbWU7XG4gICAgcGt0LmFjYy5zZWNyZXQgPSBzZWNyZXQ7XG4gICAgLy8gTG9nIGluIHRvIHRoZSBuZXcgYWNjb3VudCB1c2luZyBzZWxlY3RlZCBzY2hlbWVcbiAgICBwa3QuYWNjLmxvZ2luID0gbG9naW47XG5cbiAgICBpZiAocGFyYW1zKSB7XG4gICAgICBwa3QuYWNjLmRlc2MuZGVmYWNzID0gcGFyYW1zLmRlZmFjcztcbiAgICAgIHBrdC5hY2MuZGVzYy5wdWJsaWMgPSBwYXJhbXMucHVibGljO1xuICAgICAgcGt0LmFjYy5kZXNjLnByaXZhdGUgPSBwYXJhbXMucHJpdmF0ZTtcbiAgICAgIHBrdC5hY2MuZGVzYy50cnVzdGVkID0gcGFyYW1zLnRydXN0ZWQ7XG5cbiAgICAgIHBrdC5hY2MudGFncyA9IHBhcmFtcy50YWdzO1xuICAgICAgcGt0LmFjYy5jcmVkID0gcGFyYW1zLmNyZWQ7XG5cbiAgICAgIHBrdC5hY2MudG9rZW4gPSBwYXJhbXMudG9rZW47XG5cbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHBhcmFtcy5hdHRhY2htZW50cykgJiYgcGFyYW1zLmF0dGFjaG1lbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcGt0LmV4dHJhID0ge1xuICAgICAgICAgIGF0dGFjaG1lbnRzOiBwYXJhbXMuYXR0YWNobWVudHMuZmlsdGVyKHJlZiA9PiBpc1VybFJlbGF0aXZlKHJlZikpXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuI3NlbmQocGt0LCBwa3QuYWNjLmlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBuZXcgdXNlci4gV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNhY2NvdW50fS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNjaGVtZSAtIEF1dGhlbnRpY2F0aW9uIHNjaGVtZTsgPGNvZGU+XCJiYXNpY1wiPC9jb2RlPiBpcyB0aGUgb25seSBjdXJyZW50bHkgc3VwcG9ydGVkIHNjaGVtZS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHNlY3JldCAtIEF1dGhlbnRpY2F0aW9uLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBsb2dpbiAtIFVzZSBuZXcgYWNjb3VudCB0byBhdXRoZW50aWNhdGUgY3VycmVudCBzZXNzaW9uXG4gICAqIEBwYXJhbSB7QWNjb3VudFBhcmFtcz19IHBhcmFtcyAtIFVzZXIgZGF0YSB0byBwYXNzIHRvIHRoZSBzZXJ2ZXIuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiBzZXJ2ZXIgcmVwbHkgaXMgcmVjZWl2ZWQuXG4gICAqL1xuICBjcmVhdGVBY2NvdW50KHNjaGVtZSwgc2VjcmV0LCBsb2dpbiwgcGFyYW1zKSB7XG4gICAgbGV0IHByb21pc2UgPSB0aGlzLmFjY291bnQoQ29uc3QuVVNFUl9ORVcsIHNjaGVtZSwgc2VjcmV0LCBsb2dpbiwgcGFyYW1zKTtcbiAgICBpZiAobG9naW4pIHtcbiAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKGN0cmwpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI2xvZ2luU3VjY2Vzc2Z1bChjdHJsKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgdXNlciB3aXRoIDxjb2RlPidiYXNpYyc8L2NvZGU+IGF1dGhlbnRpY2F0aW9uIHNjaGVtZSBhbmQgaW1tZWRpYXRlbHlcbiAgICogdXNlIGl0IGZvciBhdXRoZW50aWNhdGlvbi4gV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNhY2NvdW50fS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVzZXJuYW1lIC0gTG9naW4gdG8gdXNlIGZvciB0aGUgbmV3IGFjY291bnQuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXNzd29yZCAtIFVzZXIncyBwYXNzd29yZC5cbiAgICogQHBhcmFtIHtBY2NvdW50UGFyYW1zPX0gcGFyYW1zIC0gVXNlciBkYXRhIHRvIHBhc3MgdG8gdGhlIHNlcnZlci5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHNlcnZlciByZXBseSBpcyByZWNlaXZlZC5cbiAgICovXG4gIGNyZWF0ZUFjY291bnRCYXNpYyh1c2VybmFtZSwgcGFzc3dvcmQsIHBhcmFtcykge1xuICAgIC8vIE1ha2Ugc3VyZSB3ZSBhcmUgbm90IHVzaW5nICdudWxsJyBvciAndW5kZWZpbmVkJztcbiAgICB1c2VybmFtZSA9IHVzZXJuYW1lIHx8ICcnO1xuICAgIHBhc3N3b3JkID0gcGFzc3dvcmQgfHwgJyc7XG4gICAgcmV0dXJuIHRoaXMuY3JlYXRlQWNjb3VudCgnYmFzaWMnLFxuICAgICAgYjY0RW5jb2RlVW5pY29kZSh1c2VybmFtZSArICc6JyArIHBhc3N3b3JkKSwgdHJ1ZSwgcGFyYW1zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgdXNlcidzIGNyZWRlbnRpYWxzIGZvciA8Y29kZT4nYmFzaWMnPC9jb2RlPiBhdXRoZW50aWNhdGlvbiBzY2hlbWUuIFdyYXBwZXIgZm9yIHtAbGluayBUaW5vZGUjYWNjb3VudH0uXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1aWQgLSBVc2VyIElEIHRvIHVwZGF0ZS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHVzZXJuYW1lIC0gTG9naW4gdG8gdXNlIGZvciB0aGUgbmV3IGFjY291bnQuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXNzd29yZCAtIFVzZXIncyBwYXNzd29yZC5cbiAgICogQHBhcmFtIHtBY2NvdW50UGFyYW1zPX0gcGFyYW1zIC0gZGF0YSB0byBwYXNzIHRvIHRoZSBzZXJ2ZXIuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiBzZXJ2ZXIgcmVwbHkgaXMgcmVjZWl2ZWQuXG4gICAqL1xuICB1cGRhdGVBY2NvdW50QmFzaWModWlkLCB1c2VybmFtZSwgcGFzc3dvcmQsIHBhcmFtcykge1xuICAgIC8vIE1ha2Ugc3VyZSB3ZSBhcmUgbm90IHVzaW5nICdudWxsJyBvciAndW5kZWZpbmVkJztcbiAgICB1c2VybmFtZSA9IHVzZXJuYW1lIHx8ICcnO1xuICAgIHBhc3N3b3JkID0gcGFzc3dvcmQgfHwgJyc7XG4gICAgcmV0dXJuIHRoaXMuYWNjb3VudCh1aWQsICdiYXNpYycsXG4gICAgICBiNjRFbmNvZGVVbmljb2RlKHVzZXJuYW1lICsgJzonICsgcGFzc3dvcmQpLCBmYWxzZSwgcGFyYW1zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kIGhhbmRzaGFrZSB0byB0aGUgc2VydmVyLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gc2VydmVyIHJlcGx5IGlzIHJlY2VpdmVkLlxuICAgKi9cbiAgaGVsbG8oKSB7XG4gICAgY29uc3QgcGt0ID0gdGhpcy4jaW5pdFBhY2tldCgnaGknKTtcblxuICAgIHJldHVybiB0aGlzLiNzZW5kKHBrdCwgcGt0LmhpLmlkKVxuICAgICAgLnRoZW4oKGN0cmwpID0+IHtcbiAgICAgICAgLy8gUmVzZXQgYmFja29mZiBjb3VudGVyIG9uIHN1Y2Nlc3NmdWwgY29ubmVjdGlvbi5cbiAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5iYWNrb2ZmUmVzZXQoKTtcblxuICAgICAgICAvLyBTZXJ2ZXIgcmVzcG9uc2UgY29udGFpbnMgc2VydmVyIHByb3RvY29sIHZlcnNpb24sIGJ1aWxkLCBjb25zdHJhaW50cyxcbiAgICAgICAgLy8gc2Vzc2lvbiBJRCBmb3IgbG9uZyBwb2xsaW5nLiBTYXZlIHRoZW0uXG4gICAgICAgIGlmIChjdHJsLnBhcmFtcykge1xuICAgICAgICAgIHRoaXMuX3NlcnZlckluZm8gPSBjdHJsLnBhcmFtcztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm9uQ29ubmVjdCkge1xuICAgICAgICAgIHRoaXMub25Db25uZWN0KCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY3RybDtcbiAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5yZWNvbm5lY3QodHJ1ZSk7XG5cbiAgICAgICAgaWYgKHRoaXMub25EaXNjb25uZWN0KSB7XG4gICAgICAgICAgdGhpcy5vbkRpc2Nvbm5lY3QoZXJyKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogU2V0IG9yIHJlZnJlc2ggdGhlIHB1c2ggbm90aWZpY2F0aW9ucy9kZXZpY2UgdG9rZW4uIElmIHRoZSBjbGllbnQgaXMgY29ubmVjdGVkLFxuICAgKiB0aGUgZGV2aWNlVG9rZW4gY2FuIGJlIHNlbnQgdG8gdGhlIHNlcnZlci5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGR0IC0gdG9rZW4gb2J0YWluZWQgZnJvbSB0aGUgcHJvdmlkZXIgb3IgPGNvZGU+ZmFsc2U8L2NvZGU+LFxuICAgKiAgICA8Y29kZT5udWxsPC9jb2RlPiBvciA8Y29kZT51bmRlZmluZWQ8L2NvZGU+IHRvIGNsZWFyIHRoZSB0b2tlbi5cbiAgICpcbiAgICogQHJldHVybnMgPGNvZGU+dHJ1ZTwvY29kZT4gaWYgYXR0ZW1wdCB3YXMgbWFkZSB0byBzZW5kIHRoZSB1cGRhdGUgdG8gdGhlIHNlcnZlci5cbiAgICovXG4gIHNldERldmljZVRva2VuKGR0KSB7XG4gICAgbGV0IHNlbnQgPSBmYWxzZTtcbiAgICAvLyBDb252ZXJ0IGFueSBmYWxzaXNoIHZhbHVlIHRvIG51bGwuXG4gICAgZHQgPSBkdCB8fCBudWxsO1xuICAgIGlmIChkdCAhPSB0aGlzLl9kZXZpY2VUb2tlbikge1xuICAgICAgdGhpcy5fZGV2aWNlVG9rZW4gPSBkdDtcbiAgICAgIGlmICh0aGlzLmlzQ29ubmVjdGVkKCkgJiYgdGhpcy5pc0F1dGhlbnRpY2F0ZWQoKSkge1xuICAgICAgICB0aGlzLiNzZW5kKHtcbiAgICAgICAgICAnaGknOiB7XG4gICAgICAgICAgICAnZGV2JzogZHQgfHwgVGlub2RlLkRFTF9DSEFSXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgc2VudCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzZW50O1xuICB9XG5cbiAgLyoqXG4gICAqIEB0eXBlZGVmIENyZWRlbnRpYWxcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHByb3BlcnR5IHtzdHJpbmd9IG1ldGggLSB2YWxpZGF0aW9uIG1ldGhvZC5cbiAgICogQHByb3BlcnR5IHtzdHJpbmd9IHZhbCAtIHZhbHVlIHRvIHZhbGlkYXRlIChlLmcuIGVtYWlsIG9yIHBob25lIG51bWJlcikuXG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSByZXNwIC0gdmFsaWRhdGlvbiByZXNwb25zZS5cbiAgICogQHByb3BlcnR5IHtPYmplY3R9IHBhcmFtcyAtIHZhbGlkYXRpb24gcGFyYW1ldGVycy5cbiAgICovXG4gIC8qKlxuICAgKiBBdXRoZW50aWNhdGUgY3VycmVudCBzZXNzaW9uLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2NoZW1lIC0gQXV0aGVudGljYXRpb24gc2NoZW1lOyA8Y29kZT5cImJhc2ljXCI8L2NvZGU+IGlzIHRoZSBvbmx5IGN1cnJlbnRseSBzdXBwb3J0ZWQgc2NoZW1lLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2VjcmV0IC0gQXV0aGVudGljYXRpb24gc2VjcmV0LCBhc3N1bWVkIHRvIGJlIGFscmVhZHkgYmFzZTY0IGVuY29kZWQuXG4gICAqIEBwYXJhbSB7Q3JlZGVudGlhbD19IGNyZWQgLSBjcmVkZW50aWFsIGNvbmZpcm1hdGlvbiwgaWYgcmVxdWlyZWQuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiBzZXJ2ZXIgcmVwbHkgaXMgcmVjZWl2ZWQuXG4gICAqL1xuICBsb2dpbihzY2hlbWUsIHNlY3JldCwgY3JlZCkge1xuICAgIGNvbnN0IHBrdCA9IHRoaXMuI2luaXRQYWNrZXQoJ2xvZ2luJyk7XG4gICAgcGt0LmxvZ2luLnNjaGVtZSA9IHNjaGVtZTtcbiAgICBwa3QubG9naW4uc2VjcmV0ID0gc2VjcmV0O1xuICAgIHBrdC5sb2dpbi5jcmVkID0gY3JlZDtcblxuICAgIHJldHVybiB0aGlzLiNzZW5kKHBrdCwgcGt0LmxvZ2luLmlkKVxuICAgICAgLnRoZW4oKGN0cmwpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI2xvZ2luU3VjY2Vzc2Z1bChjdHJsKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFdyYXBwZXIgZm9yIHtAbGluayBUaW5vZGUjbG9naW59IHdpdGggYmFzaWMgYXV0aGVudGljYXRpb25cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVuYW1lIC0gVXNlciBuYW1lLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGFzc3dvcmQgIC0gUGFzc3dvcmQuXG4gICAqIEBwYXJhbSB7Q3JlZGVudGlhbD19IGNyZWQgLSBjcmVkZW50aWFsIGNvbmZpcm1hdGlvbiwgaWYgcmVxdWlyZWQuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gcmVjZWl2aW5nIHNlcnZlciByZXBseS5cbiAgICovXG4gIGxvZ2luQmFzaWModW5hbWUsIHBhc3N3b3JkLCBjcmVkKSB7XG4gICAgcmV0dXJuIHRoaXMubG9naW4oJ2Jhc2ljJywgYjY0RW5jb2RlVW5pY29kZSh1bmFtZSArICc6JyArIHBhc3N3b3JkKSwgY3JlZClcbiAgICAgIC50aGVuKChjdHJsKSA9PiB7XG4gICAgICAgIHRoaXMuX2xvZ2luID0gdW5hbWU7XG4gICAgICAgIHJldHVybiBjdHJsO1xuICAgICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNsb2dpbn0gd2l0aCB0b2tlbiBhdXRoZW50aWNhdGlvblxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9rZW4gLSBUb2tlbiByZWNlaXZlZCBpbiByZXNwb25zZSB0byBlYXJsaWVyIGxvZ2luLlxuICAgKiBAcGFyYW0ge0NyZWRlbnRpYWw9fSBjcmVkIC0gY3JlZGVudGlhbCBjb25maXJtYXRpb24sIGlmIHJlcXVpcmVkLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIG9uIHJlY2VpdmluZyBzZXJ2ZXIgcmVwbHkuXG4gICAqL1xuICBsb2dpblRva2VuKHRva2VuLCBjcmVkKSB7XG4gICAgcmV0dXJuIHRoaXMubG9naW4oJ3Rva2VuJywgdG9rZW4sIGNyZWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgYSByZXF1ZXN0IGZvciByZXNldHRpbmcgYW4gYXV0aGVudGljYXRpb24gc2VjcmV0LlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2NoZW1lIC0gYXV0aGVudGljYXRpb24gc2NoZW1lIHRvIHJlc2V0LlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWV0aG9kIC0gbWV0aG9kIHRvIHVzZSBmb3IgcmVzZXR0aW5nIHRoZSBzZWNyZXQsIHN1Y2ggYXMgXCJlbWFpbFwiIG9yIFwidGVsXCIuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSAtIHZhbHVlIG9mIHRoZSBjcmVkZW50aWFsIHRvIHVzZSwgYSBzcGVjaWZpYyBlbWFpbCBhZGRyZXNzIG9yIGEgcGhvbmUgbnVtYmVyLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIG9uIHJlY2VpdmluZyB0aGUgc2VydmVyIHJlcGx5LlxuICAgKi9cbiAgcmVxdWVzdFJlc2V0QXV0aFNlY3JldChzY2hlbWUsIG1ldGhvZCwgdmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5sb2dpbigncmVzZXQnLCBiNjRFbmNvZGVVbmljb2RlKHNjaGVtZSArICc6JyArIG1ldGhvZCArICc6JyArIHZhbHVlKSk7XG4gIH1cblxuICAvKipcbiAgICogQHR5cGVkZWYgQXV0aFRva2VuXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB0b2tlbiAtIFRva2VuIHZhbHVlLlxuICAgKiBAcHJvcGVydHkge0RhdGV9IGV4cGlyZXMgLSBUb2tlbiBleHBpcmF0aW9uIHRpbWUuXG4gICAqL1xuICAvKipcbiAgICogR2V0IHN0b3JlZCBhdXRoZW50aWNhdGlvbiB0b2tlbi5cbiAgICpcbiAgICogQHJldHVybnMge0F1dGhUb2tlbn0gYXV0aGVudGljYXRpb24gdG9rZW4uXG4gICAqL1xuICBnZXRBdXRoVG9rZW4oKSB7XG4gICAgaWYgKHRoaXMuX2F1dGhUb2tlbiAmJiAodGhpcy5fYXV0aFRva2VuLmV4cGlyZXMuZ2V0VGltZSgpID4gRGF0ZS5ub3coKSkpIHtcbiAgICAgIHJldHVybiB0aGlzLl9hdXRoVG9rZW47XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2F1dGhUb2tlbiA9IG51bGw7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGxpY2F0aW9uIG1heSBwcm92aWRlIGEgc2F2ZWQgYXV0aGVudGljYXRpb24gdG9rZW4uXG4gICAqXG4gICAqIEBwYXJhbSB7QXV0aFRva2VufSB0b2tlbiAtIGF1dGhlbnRpY2F0aW9uIHRva2VuLlxuICAgKi9cbiAgc2V0QXV0aFRva2VuKHRva2VuKSB7XG4gICAgdGhpcy5fYXV0aFRva2VuID0gdG9rZW47XG4gIH1cblxuICAvKipcbiAgICogQHR5cGVkZWYgU2V0UGFyYW1zXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBwcm9wZXJ0eSB7U2V0RGVzYz19IGRlc2MgLSBUb3BpYyBpbml0aWFsaXphdGlvbiBwYXJhbWV0ZXJzIHdoZW4gY3JlYXRpbmcgYSBuZXcgdG9waWMgb3IgYSBuZXcgc3Vic2NyaXB0aW9uLlxuICAgKiBAcHJvcGVydHkge1NldFN1Yj19IHN1YiAtIFN1YnNjcmlwdGlvbiBpbml0aWFsaXphdGlvbiBwYXJhbWV0ZXJzLlxuICAgKiBAcHJvcGVydHkge0FycmF5LjxzdHJpbmc+PX0gYXR0YWNobWVudHMgLSBVUkxzIG9mIG91dCBvZiBiYW5kIGF0dGFjaG1lbnRzIHVzZWQgaW4gcGFyYW1ldGVycy5cbiAgICovXG4gIC8qKlxuICAgKiBAdHlwZWRlZiBTZXREZXNjXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBwcm9wZXJ0eSB7RGVmQWNzPX0gZGVmYWNzIC0gRGVmYXVsdCBhY2Nlc3MgbW9kZS5cbiAgICogQHByb3BlcnR5IHtPYmplY3Q9fSBwdWJsaWMgLSBGcmVlLWZvcm0gdG9waWMgZGVzY3JpcHRpb24sIHB1YmxpY2FsbHkgYWNjZXNzaWJsZS5cbiAgICogQHByb3BlcnR5IHtPYmplY3Q9fSBwcml2YXRlIC0gRnJlZS1mb3JtIHRvcGljIGRlc2NyaXB0aW9uIGFjY2Vzc2libGUgb25seSB0byB0aGUgb3duZXIuXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0PX0gdHJ1c3RlZCAtIFRydXN0ZWQgdXNlciBkYXRhIHdoaWNoIGNhbiBiZSBzZXQgYnkgYSByb290IHVzZXIgb25seS5cbiAgICovXG4gIC8qKlxuICAgKiBAdHlwZWRlZiBTZXRTdWJcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHByb3BlcnR5IHtzdHJpbmc9fSB1c2VyIC0gVUlEIG9mIHRoZSB1c2VyIGFmZmVjdGVkIGJ5IHRoZSByZXF1ZXN0LiBEZWZhdWx0IChlbXB0eSkgLSBjdXJyZW50IHVzZXIuXG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nPX0gbW9kZSAtIFVzZXIgYWNjZXNzIG1vZGUsIGVpdGhlciByZXF1ZXN0ZWQgb3IgYXNzaWduZWQgZGVwZW5kZW50IG9uIGNvbnRleHQuXG4gICAqL1xuICAvKipcbiAgICogU2VuZCBhIHRvcGljIHN1YnNjcmlwdGlvbiByZXF1ZXN0LlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWMgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byBzdWJzY3JpYmUgdG8uXG4gICAqIEBwYXJhbSB7R2V0UXVlcnk9fSBnZXRQYXJhbXMgLSBPcHRpb25hbCBzdWJzY3JpcHRpb24gbWV0YWRhdGEgcXVlcnlcbiAgICogQHBhcmFtIHtTZXRQYXJhbXM9fSBzZXRQYXJhbXMgLSBPcHRpb25hbCBpbml0aWFsaXphdGlvbiBwYXJhbWV0ZXJzXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gcmVjZWl2aW5nIHNlcnZlciByZXBseS5cbiAgICovXG4gIHN1YnNjcmliZSh0b3BpY05hbWUsIGdldFBhcmFtcywgc2V0UGFyYW1zKSB7XG4gICAgY29uc3QgcGt0ID0gdGhpcy4jaW5pdFBhY2tldCgnc3ViJywgdG9waWNOYW1lKVxuICAgIGlmICghdG9waWNOYW1lKSB7XG4gICAgICB0b3BpY05hbWUgPSBDb25zdC5UT1BJQ19ORVc7XG4gICAgfVxuXG4gICAgcGt0LnN1Yi5nZXQgPSBnZXRQYXJhbXM7XG5cbiAgICBpZiAoc2V0UGFyYW1zKSB7XG4gICAgICBpZiAoc2V0UGFyYW1zLnN1Yikge1xuICAgICAgICBwa3Quc3ViLnNldC5zdWIgPSBzZXRQYXJhbXMuc3ViO1xuICAgICAgfVxuXG4gICAgICBpZiAoc2V0UGFyYW1zLmRlc2MpIHtcbiAgICAgICAgY29uc3QgZGVzYyA9IHNldFBhcmFtcy5kZXNjO1xuICAgICAgICBpZiAoVGlub2RlLmlzTmV3R3JvdXBUb3BpY05hbWUodG9waWNOYW1lKSkge1xuICAgICAgICAgIC8vIEZ1bGwgc2V0LmRlc2MgcGFyYW1zIGFyZSB1c2VkIGZvciBuZXcgdG9waWNzIG9ubHlcbiAgICAgICAgICBwa3Quc3ViLnNldC5kZXNjID0gZGVzYztcbiAgICAgICAgfSBlbHNlIGlmIChUaW5vZGUuaXNQMlBUb3BpY05hbWUodG9waWNOYW1lKSAmJiBkZXNjLmRlZmFjcykge1xuICAgICAgICAgIC8vIFVzZSBvcHRpb25hbCBkZWZhdWx0IHBlcm1pc3Npb25zIG9ubHkuXG4gICAgICAgICAgcGt0LnN1Yi5zZXQuZGVzYyA9IHtcbiAgICAgICAgICAgIGRlZmFjczogZGVzYy5kZWZhY3NcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFNlZSBpZiBleHRlcm5hbCBvYmplY3RzIHdlcmUgdXNlZCBpbiB0b3BpYyBkZXNjcmlwdGlvbi5cbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHNldFBhcmFtcy5hdHRhY2htZW50cykgJiYgc2V0UGFyYW1zLmF0dGFjaG1lbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcGt0LmV4dHJhID0ge1xuICAgICAgICAgIGF0dGFjaG1lbnRzOiBzZXRQYXJhbXMuYXR0YWNobWVudHMuZmlsdGVyKHJlZiA9PiBpc1VybFJlbGF0aXZlKHJlZikpXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIGlmIChzZXRQYXJhbXMudGFncykge1xuICAgICAgICBwa3Quc3ViLnNldC50YWdzID0gc2V0UGFyYW1zLnRhZ3M7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzLiNzZW5kKHBrdCwgcGt0LnN1Yi5pZCk7XG4gIH1cblxuICAvKipcbiAgICogRGV0YWNoIGFuZCBvcHRpb25hbGx5IHVuc3Vic2NyaWJlIGZyb20gdGhlIHRvcGljXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpYyAtIFRvcGljIHRvIGRldGFjaCBmcm9tLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHVuc3ViIC0gSWYgPGNvZGU+dHJ1ZTwvY29kZT4sIGRldGFjaCBhbmQgdW5zdWJzY3JpYmUsIG90aGVyd2lzZSBqdXN0IGRldGFjaC5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCBvbiByZWNlaXZpbmcgc2VydmVyIHJlcGx5LlxuICAgKi9cbiAgbGVhdmUodG9waWMsIHVuc3ViKSB7XG4gICAgY29uc3QgcGt0ID0gdGhpcy4jaW5pdFBhY2tldCgnbGVhdmUnLCB0b3BpYyk7XG4gICAgcGt0LmxlYXZlLnVuc3ViID0gdW5zdWI7XG5cbiAgICByZXR1cm4gdGhpcy4jc2VuZChwa3QsIHBrdC5sZWF2ZS5pZCk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIG1lc3NhZ2UgZHJhZnQgd2l0aG91dCBzZW5kaW5nIGl0IHRvIHRoZSBzZXJ2ZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpYyAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIHB1Ymxpc2ggdG8uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZW50IC0gUGF5bG9hZCB0byBwdWJsaXNoLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBub0VjaG8gLSBJZiA8Y29kZT50cnVlPC9jb2RlPiwgdGVsbCB0aGUgc2VydmVyIG5vdCB0byBlY2hvIHRoZSBtZXNzYWdlIHRvIHRoZSBvcmlnaW5hbCBzZXNzaW9uLlxuICAgKlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSBuZXcgbWVzc2FnZSB3aGljaCBjYW4gYmUgc2VudCB0byB0aGUgc2VydmVyIG9yIG90aGVyd2lzZSB1c2VkLlxuICAgKi9cbiAgY3JlYXRlTWVzc2FnZSh0b3BpYywgY29udGVudCwgbm9FY2hvKSB7XG4gICAgY29uc3QgcGt0ID0gdGhpcy4jaW5pdFBhY2tldCgncHViJywgdG9waWMpO1xuXG4gICAgbGV0IGRmdCA9IHR5cGVvZiBjb250ZW50ID09ICdzdHJpbmcnID8gRHJhZnR5LnBhcnNlKGNvbnRlbnQpIDogY29udGVudDtcbiAgICBpZiAoZGZ0ICYmICFEcmFmdHkuaXNQbGFpblRleHQoZGZ0KSkge1xuICAgICAgcGt0LnB1Yi5oZWFkID0ge1xuICAgICAgICBtaW1lOiBEcmFmdHkuZ2V0Q29udGVudFR5cGUoKVxuICAgICAgfTtcbiAgICAgIGNvbnRlbnQgPSBkZnQ7XG4gICAgfVxuICAgIHBrdC5wdWIubm9lY2hvID0gbm9FY2hvO1xuICAgIHBrdC5wdWIuY29udGVudCA9IGNvbnRlbnQ7XG5cbiAgICByZXR1cm4gcGt0LnB1YjtcbiAgfVxuXG4gIC8qKlxuICAgKiBQdWJsaXNoIHtkYXRhfSBtZXNzYWdlIHRvIHRvcGljLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWNOYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gcHVibGlzaCB0by5cbiAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRlbnQgLSBQYXlsb2FkIHRvIHB1Ymxpc2guXG4gICAqIEBwYXJhbSB7Ym9vbGVhbj19IG5vRWNobyAtIElmIDxjb2RlPnRydWU8L2NvZGU+LCB0ZWxsIHRoZSBzZXJ2ZXIgbm90IHRvIGVjaG8gdGhlIG1lc3NhZ2UgdG8gdGhlIG9yaWdpbmFsIHNlc3Npb24uXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gcmVjZWl2aW5nIHNlcnZlciByZXBseS5cbiAgICovXG4gIHB1Ymxpc2godG9waWNOYW1lLCBjb250ZW50LCBub0VjaG8pIHtcbiAgICByZXR1cm4gdGhpcy5wdWJsaXNoTWVzc2FnZShcbiAgICAgIHRoaXMuY3JlYXRlTWVzc2FnZSh0b3BpY05hbWUsIGNvbnRlbnQsIG5vRWNobylcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIFB1Ymxpc2ggbWVzc2FnZSB0byB0b3BpYy4gVGhlIG1lc3NhZ2Ugc2hvdWxkIGJlIGNyZWF0ZWQgYnkge0BsaW5rIFRpbm9kZSNjcmVhdGVNZXNzYWdlfS5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHB1YiAtIE1lc3NhZ2UgdG8gcHVibGlzaC5cbiAgICogQHBhcmFtIHtBcnJheS48c3RyaW5nPj19IGF0dGFjaG1lbnRzIC0gYXJyYXkgb2YgVVJMcyB3aXRoIGF0dGFjaG1lbnRzLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIG9uIHJlY2VpdmluZyBzZXJ2ZXIgcmVwbHkuXG4gICAqL1xuICBwdWJsaXNoTWVzc2FnZShwdWIsIGF0dGFjaG1lbnRzKSB7XG4gICAgLy8gTWFrZSBhIHNoYWxsb3cgY29weS4gTmVlZGVkIGluIG9yZGVyIHRvIGNsZWFyIGxvY2FsbHktYXNzaWduZWQgdGVtcCB2YWx1ZXM7XG4gICAgcHViID0gT2JqZWN0LmFzc2lnbih7fSwgcHViKTtcbiAgICBwdWIuc2VxID0gdW5kZWZpbmVkO1xuICAgIHB1Yi5mcm9tID0gdW5kZWZpbmVkO1xuICAgIHB1Yi50cyA9IHVuZGVmaW5lZDtcbiAgICBjb25zdCBtc2cgPSB7XG4gICAgICBwdWI6IHB1YixcbiAgICB9O1xuICAgIGlmIChhdHRhY2htZW50cykge1xuICAgICAgbXNnLmV4dHJhID0ge1xuICAgICAgICBhdHRhY2htZW50czogYXR0YWNobWVudHMuZmlsdGVyKHJlZiA9PiBpc1VybFJlbGF0aXZlKHJlZikpXG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy4jc2VuZChtc2csIHB1Yi5pZCk7XG4gIH1cblxuICAvKipcbiAgICogT3V0IG9mIGJhbmQgbm90aWZpY2F0aW9uOiBub3RpZnkgdG9waWMgdGhhdCBhbiBleHRlcm5hbCAocHVzaCkgbm90aWZpY2F0aW9uIHdhcyByZWNpdmVkIGJ5IHRoZSBjbGllbnQuXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBkYXRhIC0gbm90aWZpY2F0aW9uIHBheWxvYWQuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBkYXRhLndoYXQgLSBub3RpZmljYXRpb24gdHlwZSwgJ21zZycsICdyZWFkJywgJ3N1YicuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBkYXRhLnRvcGljIC0gbmFtZSBvZiB0aGUgdXBkYXRlZCB0b3BpYy5cbiAgICogQHBhcmFtIHtudW1iZXI9fSBkYXRhLnNlcSAtIHNlcSBJRCBvZiB0aGUgYWZmZWN0ZWQgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtzdHJpbmc9fSBkYXRhLnhmcm9tIC0gVUlEIG9mIHRoZSBzZW5kZXIuXG4gICAqIEBwYXJhbSB7b2JqZWN0PX0gZGF0YS5naXZlbiAtIG5ldyBzdWJzY3JpcHRpb24gJ2dpdmVuJywgZS5nLiAnQVNXUC4uLicuXG4gICAqIEBwYXJhbSB7b2JqZWN0PX0gZGF0YS53YW50IC0gbmV3IHN1YnNjcmlwdGlvbiAnd2FudCcsIGUuZy4gJ1JXSi4uLicuXG4gICAqL1xuICBvb2JOb3RpZmljYXRpb24oZGF0YSkge1xuICAgIHRoaXMubG9nZ2VyKFwib29iOiBcIiArICh0aGlzLl90cmltTG9uZ1N0cmluZ3MgPyBKU09OLnN0cmluZ2lmeShkYXRhLCBqc29uTG9nZ2VySGVscGVyKSA6IGRhdGEpKTtcblxuICAgIHN3aXRjaCAoZGF0YS53aGF0KSB7XG4gICAgICBjYXNlICdtc2cnOlxuICAgICAgICBpZiAoIWRhdGEuc2VxIHx8IGRhdGEuc2VxIDwgMSB8fCAhZGF0YS50b3BpYykge1xuICAgICAgICAgIC8vIFNlcnZlciBzZW50IGludmFsaWQgZGF0YS5cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5pc0Nvbm5lY3RlZCgpKSB7XG4gICAgICAgICAgLy8gTGV0J3MgaWdub3JlIHRoZSBtZXNzYWdlIGlzIHRoZXJlIGlzIG5vIGNvbm5lY3Rpb246IG5vIGNvbm5lY3Rpb24gbWVhbnMgdGhlcmUgYXJlIG5vIG9wZW5cbiAgICAgICAgICAvLyB0YWJzIHdpdGggVGlub2RlLlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdG9waWMgPSB0aGlzLiNjYWNoZUdldCgndG9waWMnLCBkYXRhLnRvcGljKTtcbiAgICAgICAgaWYgKCF0b3BpYykge1xuICAgICAgICAgIC8vIFRPRE86IGNoZWNrIGlmIHRoZXJlIGlzIGEgY2FzZSB3aGVuIGEgbWVzc2FnZSBjYW4gYXJyaXZlIGZyb20gYW4gdW5rbm93biB0b3BpYy5cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0b3BpYy5pc1N1YnNjcmliZWQoKSkge1xuICAgICAgICAgIC8vIE5vIG5lZWQgdG8gZmV0Y2g6IHRvcGljIGlzIGFscmVhZHkgc3Vic2NyaWJlZCBhbmQgZ290IGRhdGEgdGhyb3VnaCBub3JtYWwgY2hhbm5lbC5cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0b3BpYy5tYXhNc2dTZXEoKSA8IGRhdGEuc2VxKSB7XG4gICAgICAgICAgaWYgKHRvcGljLmlzQ2hhbm5lbFR5cGUoKSkge1xuICAgICAgICAgICAgdG9waWMuX3VwZGF0ZVJlY2VpdmVkKGRhdGEuc2VxLCAnZmFrZS11aWQnKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBOZXcgbWVzc2FnZS5cbiAgICAgICAgICBpZiAoZGF0YS54ZnJvbSAmJiAhdGhpcy4jY2FjaGVHZXQoJ3VzZXInLCBkYXRhLnhmcm9tKSkge1xuICAgICAgICAgICAgLy8gTWVzc2FnZSBmcm9tIHVua25vd24gc2VuZGVyLCBmZXRjaCBkZXNjcmlwdGlvbiBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAgICAgICAgICAvLyBTZW5kaW5nIGFzeW5jaHJvbm91c2x5IHdpdGhvdXQgYSBzdWJzY3JpcHRpb24uXG4gICAgICAgICAgICB0aGlzLmdldE1ldGEoZGF0YS54ZnJvbSwgbmV3IE1ldGFHZXRCdWlsZGVyKCkud2l0aERlc2MoKS5idWlsZCgpKS5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmxvZ2dlcihcIkZhaWxlZCB0byBnZXQgdGhlIG5hbWUgb2YgYSBuZXcgc2VuZGVyXCIsIGVycik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0b3BpYy5zdWJzY3JpYmUobnVsbCkudGhlbihfID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0b3BpYy5nZXRNZXRhKG5ldyBNZXRhR2V0QnVpbGRlcih0b3BpYykud2l0aExhdGVyRGF0YSgyNCkud2l0aExhdGVyRGVsKDI0KS5idWlsZCgpKTtcbiAgICAgICAgICB9KS50aGVuKF8gPT4ge1xuICAgICAgICAgICAgLy8gQWxsb3cgZGF0YSBmZXRjaCB0byBjb21wbGV0ZSBhbmQgZ2V0IHByb2Nlc3NlZCBzdWNjZXNzZnVsbHkuXG4gICAgICAgICAgICB0b3BpYy5sZWF2ZURlbGF5ZWQoZmFsc2UsIDEwMDApO1xuICAgICAgICAgIH0pLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlcihcIk9uIHB1c2ggZGF0YSBmZXRjaCBmYWlsZWRcIiwgZXJyKTtcbiAgICAgICAgICB9KS5maW5hbGx5KF8gPT4ge1xuICAgICAgICAgICAgdGhpcy5nZXRNZVRvcGljKCkuX3JlZnJlc2hDb250YWN0KCdtc2cnLCB0b3BpYyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ3JlYWQnOlxuICAgICAgICB0aGlzLmdldE1lVG9waWMoKS5fcm91dGVQcmVzKHtcbiAgICAgICAgICB3aGF0OiAncmVhZCcsXG4gICAgICAgICAgc2VxOiBkYXRhLnNlcVxuICAgICAgICB9KTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ3N1Yic6XG4gICAgICAgIGlmICghdGhpcy5pc01lKGRhdGEueGZyb20pKSB7XG4gICAgICAgICAgLy8gVE9ETzogaGFuZGxlIHVwZGF0ZXMgZnJvbSBvdGhlciB1c2Vycy5cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBtb2RlID0ge1xuICAgICAgICAgIGdpdmVuOiBkYXRhLm1vZGVHaXZlbixcbiAgICAgICAgICB3YW50OiBkYXRhLm1vZGVXYW50XG4gICAgICAgIH07XG4gICAgICAgIGxldCBhY3MgPSBuZXcgQWNjZXNzTW9kZShtb2RlKTtcbiAgICAgICAgbGV0IHByZXMgPSAoIWFjcy5tb2RlIHx8IGFjcy5tb2RlID09IEFjY2Vzc01vZGUuX05PTkUpID9cbiAgICAgICAgICAvLyBTdWJzY3JpcHRpb24gZGVsZXRlZC5cbiAgICAgICAgICB7XG4gICAgICAgICAgICB3aGF0OiAnZ29uZScsXG4gICAgICAgICAgICBzcmM6IGRhdGEudG9waWNcbiAgICAgICAgICB9IDpcbiAgICAgICAgICAvLyBOZXcgc3Vic2NyaXB0aW9uIG9yIHN1YnNjcmlwdGlvbiB1cGRhdGVkLlxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHdoYXQ6ICdhY3MnLFxuICAgICAgICAgICAgc3JjOiBkYXRhLnRvcGljLFxuICAgICAgICAgICAgZGFjczogbW9kZVxuICAgICAgICAgIH07XG4gICAgICAgIHRoaXMuZ2V0TWVUb3BpYygpLl9yb3V0ZVByZXMocHJlcyk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aGlzLmxvZ2dlcihcIlVua25vd24gcHVzaCB0eXBlIGlnbm9yZWRcIiwgZGF0YS53aGF0KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHR5cGVkZWYgR2V0UXVlcnlcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHByb3BlcnR5IHtHZXRPcHRzVHlwZT19IGRlc2MgLSBJZiBwcm92aWRlZCAoZXZlbiBpZiBlbXB0eSksIGZldGNoIHRvcGljIGRlc2NyaXB0aW9uLlxuICAgKiBAcHJvcGVydHkge0dldE9wdHNUeXBlPX0gc3ViIC0gSWYgcHJvdmlkZWQgKGV2ZW4gaWYgZW1wdHkpLCBmZXRjaCB0b3BpYyBzdWJzY3JpcHRpb25zLlxuICAgKiBAcHJvcGVydHkge0dldERhdGFUeXBlPX0gZGF0YSAtIElmIHByb3ZpZGVkIChldmVuIGlmIGVtcHR5KSwgZ2V0IG1lc3NhZ2VzLlxuICAgKi9cblxuICAvKipcbiAgICogQHR5cGVkZWYgR2V0T3B0c1R5cGVcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHByb3BlcnR5IHtEYXRlPX0gaW1zIC0gXCJJZiBtb2RpZmllZCBzaW5jZVwiLCBmZXRjaCBkYXRhIG9ubHkgaXQgd2FzIHdhcyBtb2RpZmllZCBzaW5jZSBzdGF0ZWQgZGF0ZS5cbiAgICogQHByb3BlcnR5IHtudW1iZXI9fSBsaW1pdCAtIE1heGltdW0gbnVtYmVyIG9mIHJlc3VsdHMgdG8gcmV0dXJuLiBJZ25vcmVkIHdoZW4gcXVlcnlpbmcgdG9waWMgZGVzY3JpcHRpb24uXG4gICAqL1xuXG4gIC8qKlxuICAgKiBAdHlwZWRlZiBHZXREYXRhVHlwZVxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAcHJvcGVydHkge251bWJlcj19IHNpbmNlIC0gTG9hZCBtZXNzYWdlcyB3aXRoIHNlcSBpZCBlcXVhbCBvciBncmVhdGVyIHRoYW4gdGhpcyB2YWx1ZS5cbiAgICogQHByb3BlcnR5IHtudW1iZXI9fSBiZWZvcmUgLSBMb2FkIG1lc3NhZ2VzIHdpdGggc2VxIGlkIGxvd2VyIHRoYW4gdGhpcyBudW1iZXIuXG4gICAqIEBwcm9wZXJ0eSB7bnVtYmVyPX0gbGltaXQgLSBNYXhpbXVtIG51bWJlciBvZiByZXN1bHRzIHRvIHJldHVybi5cbiAgICovXG5cbiAgLyoqXG4gICAqIFJlcXVlc3QgdG9waWMgbWV0YWRhdGFcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gcXVlcnkuXG4gICAqIEBwYXJhbSB7R2V0UXVlcnl9IHBhcmFtcyAtIFBhcmFtZXRlcnMgb2YgdGhlIHF1ZXJ5LiBVc2Uge0BsaW5rIFRpbm9kZS5NZXRhR2V0QnVpbGRlcn0gdG8gZ2VuZXJhdGUuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gcmVjZWl2aW5nIHNlcnZlciByZXBseS5cbiAgICovXG4gIGdldE1ldGEodG9waWMsIHBhcmFtcykge1xuICAgIGNvbnN0IHBrdCA9IHRoaXMuI2luaXRQYWNrZXQoJ2dldCcsIHRvcGljKTtcblxuICAgIHBrdC5nZXQgPSBtZXJnZU9iaihwa3QuZ2V0LCBwYXJhbXMpO1xuXG4gICAgcmV0dXJuIHRoaXMuI3NlbmQocGt0LCBwa3QuZ2V0LmlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgdG9waWMncyBtZXRhZGF0YTogZGVzY3JpcHRpb24sIHN1YnNjcmlidGlvbnMuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpYyAtIFRvcGljIHRvIHVwZGF0ZS5cbiAgICogQHBhcmFtIHtTZXRQYXJhbXN9IHBhcmFtcyAtIHRvcGljIG1ldGFkYXRhIHRvIHVwZGF0ZS5cbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCBvbiByZWNlaXZpbmcgc2VydmVyIHJlcGx5LlxuICAgKi9cbiAgc2V0TWV0YSh0b3BpYywgcGFyYW1zKSB7XG4gICAgY29uc3QgcGt0ID0gdGhpcy4jaW5pdFBhY2tldCgnc2V0JywgdG9waWMpO1xuICAgIGNvbnN0IHdoYXQgPSBbXTtcblxuICAgIGlmIChwYXJhbXMpIHtcbiAgICAgIFsnZGVzYycsICdzdWInLCAndGFncycsICdjcmVkJywgJ2VwaGVtZXJhbCddLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgIGlmIChwYXJhbXMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgIHdoYXQucHVzaChrZXkpO1xuICAgICAgICAgIHBrdC5zZXRba2V5XSA9IHBhcmFtc1trZXldO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkocGFyYW1zLmF0dGFjaG1lbnRzKSAmJiBwYXJhbXMuYXR0YWNobWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgICBwa3QuZXh0cmEgPSB7XG4gICAgICAgICAgYXR0YWNobWVudHM6IHBhcmFtcy5hdHRhY2htZW50cy5maWx0ZXIocmVmID0+IGlzVXJsUmVsYXRpdmUocmVmKSlcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAod2hhdC5sZW5ndGggPT0gMCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIkludmFsaWQge3NldH0gcGFyYW1ldGVyc1wiKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuI3NlbmQocGt0LCBwa3Quc2V0LmlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSYW5nZSBvZiBtZXNzYWdlIElEcyB0byBkZWxldGUuXG4gICAqXG4gICAqIEB0eXBlZGVmIERlbFJhbmdlXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBsb3cgLSBsb3cgZW5kIG9mIHRoZSByYW5nZSwgaW5jbHVzaXZlIChjbG9zZWQpLlxuICAgKiBAcHJvcGVydHkge251bWJlcj19IGhpIC0gaGlnaCBlbmQgb2YgdGhlIHJhbmdlLCBleGNsdXNpdmUgKG9wZW4pLlxuICAgKi9cbiAgLyoqXG4gICAqIERlbGV0ZSBzb21lIG9yIGFsbCBtZXNzYWdlcyBpbiBhIHRvcGljLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWMgLSBUb3BpYyBuYW1lIHRvIGRlbGV0ZSBtZXNzYWdlcyBmcm9tLlxuICAgKiBAcGFyYW0ge0RlbFJhbmdlW119IGxpc3QgLSBSYW5nZXMgb2YgbWVzc2FnZSBJRHMgdG8gZGVsZXRlLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBoYXJkIC0gSGFyZCBvciBzb2Z0IGRlbGV0ZVxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIG9uIHJlY2VpdmluZyBzZXJ2ZXIgcmVwbHkuXG4gICAqL1xuICBkZWxNZXNzYWdlcyh0b3BpYywgcmFuZ2VzLCBoYXJkKSB7XG4gICAgY29uc3QgcGt0ID0gdGhpcy4jaW5pdFBhY2tldCgnZGVsJywgdG9waWMpO1xuXG4gICAgcGt0LmRlbC53aGF0ID0gJ21zZyc7XG4gICAgcGt0LmRlbC5kZWxzZXEgPSByYW5nZXM7XG4gICAgcGt0LmRlbC5oYXJkID0gaGFyZDtcblxuICAgIHJldHVybiB0aGlzLiNzZW5kKHBrdCwgcGt0LmRlbC5pZCk7XG4gIH1cblxuICAvKipcbiAgICogRGVsZXRlIHRoZSB0b3BpYyBhbGx0b2dldGhlci4gUmVxdWlyZXMgT3duZXIgcGVybWlzc2lvbi5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljTmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIGRlbGV0ZVxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGhhcmQgLSBoYXJkLWRlbGV0ZSB0b3BpYy5cbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCBvbiByZWNlaXZpbmcgc2VydmVyIHJlcGx5LlxuICAgKi9cbiAgZGVsVG9waWModG9waWNOYW1lLCBoYXJkKSB7XG4gICAgY29uc3QgcGt0ID0gdGhpcy4jaW5pdFBhY2tldCgnZGVsJywgdG9waWNOYW1lKTtcbiAgICBwa3QuZGVsLndoYXQgPSAndG9waWMnO1xuICAgIHBrdC5kZWwuaGFyZCA9IGhhcmQ7XG5cbiAgICByZXR1cm4gdGhpcy4jc2VuZChwa3QsIHBrdC5kZWwuaWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIERlbGV0ZSBzdWJzY3JpcHRpb24uIFJlcXVpcmVzIFNoYXJlIHBlcm1pc3Npb24uXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpY05hbWUgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byBkZWxldGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVzZXIgLSBVc2VyIElEIHRvIHJlbW92ZS5cbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCBvbiByZWNlaXZpbmcgc2VydmVyIHJlcGx5LlxuICAgKi9cbiAgZGVsU3Vic2NyaXB0aW9uKHRvcGljTmFtZSwgdXNlcikge1xuICAgIGNvbnN0IHBrdCA9IHRoaXMuI2luaXRQYWNrZXQoJ2RlbCcsIHRvcGljTmFtZSk7XG4gICAgcGt0LmRlbC53aGF0ID0gJ3N1Yic7XG4gICAgcGt0LmRlbC51c2VyID0gdXNlcjtcblxuICAgIHJldHVybiB0aGlzLiNzZW5kKHBrdCwgcGt0LmRlbC5pZCk7XG4gIH1cblxuICAvKipcbiAgICogRGVsZXRlIGNyZWRlbnRpYWwuIEFsd2F5cyBzZW50IG9uIDxjb2RlPidtZSc8L2NvZGU+IHRvcGljLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWV0aG9kIC0gdmFsaWRhdGlvbiBtZXRob2Qgc3VjaCBhcyA8Y29kZT4nZW1haWwnPC9jb2RlPiBvciA8Y29kZT4ndGVsJzwvY29kZT4uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSAtIHZhbGlkYXRpb24gdmFsdWUsIGkuZS4gPGNvZGU+J2FsaWNlQGV4YW1wbGUuY29tJzwvY29kZT4uXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gcmVjZWl2aW5nIHNlcnZlciByZXBseS5cbiAgICovXG4gIGRlbENyZWRlbnRpYWwobWV0aG9kLCB2YWx1ZSkge1xuICAgIGNvbnN0IHBrdCA9IHRoaXMuI2luaXRQYWNrZXQoJ2RlbCcsIENvbnN0LlRPUElDX01FKTtcbiAgICBwa3QuZGVsLndoYXQgPSAnY3JlZCc7XG4gICAgcGt0LmRlbC5jcmVkID0ge1xuICAgICAgbWV0aDogbWV0aG9kLFxuICAgICAgdmFsOiB2YWx1ZVxuICAgIH07XG5cbiAgICByZXR1cm4gdGhpcy4jc2VuZChwa3QsIHBrdC5kZWwuaWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcXVlc3QgdG8gZGVsZXRlIGFjY291bnQgb2YgdGhlIGN1cnJlbnQgdXNlci5cbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSBoYXJkIC0gaGFyZC1kZWxldGUgdXNlci5cbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCBvbiByZWNlaXZpbmcgc2VydmVyIHJlcGx5LlxuICAgKi9cbiAgZGVsQ3VycmVudFVzZXIoaGFyZCkge1xuICAgIGNvbnN0IHBrdCA9IHRoaXMuI2luaXRQYWNrZXQoJ2RlbCcsIG51bGwpO1xuICAgIHBrdC5kZWwud2hhdCA9ICd1c2VyJztcbiAgICBwa3QuZGVsLmhhcmQgPSBoYXJkO1xuXG4gICAgcmV0dXJuIHRoaXMuI3NlbmQocGt0LCBwa3QuZGVsLmlkKS50aGVuKChjdHJsKSA9PiB7XG4gICAgICB0aGlzLl9teVVJRCA9IG51bGw7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogTm90aWZ5IHNlcnZlciB0aGF0IGEgbWVzc2FnZSBvciBtZXNzYWdlcyB3ZXJlIHJlYWQgb3IgcmVjZWl2ZWQuIERvZXMgTk9UIHJldHVybiBwcm9taXNlLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWNOYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgd2hlcmUgdGhlIG1lc2FnZSBpcyBiZWluZyBha25vd2xlZGdlZC5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHdoYXQgLSBBY3Rpb24gYmVpbmcgYWtub3dsZWRnZWQsIGVpdGhlciA8Y29kZT5cInJlYWRcIjwvY29kZT4gb3IgPGNvZGU+XCJyZWN2XCI8L2NvZGU+LlxuICAgKiBAcGFyYW0ge251bWJlcn0gc2VxIC0gTWF4aW11bSBpZCBvZiB0aGUgbWVzc2FnZSBiZWluZyBhY2tub3dsZWRnZWQuXG4gICAqL1xuICBub3RlKHRvcGljTmFtZSwgd2hhdCwgc2VxKSB7XG4gICAgaWYgKHNlcSA8PSAwIHx8IHNlcSA+PSBDb25zdC5MT0NBTF9TRVFJRCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIG1lc3NhZ2UgaWQgJHtzZXF9YCk7XG4gICAgfVxuXG4gICAgY29uc3QgcGt0ID0gdGhpcy4jaW5pdFBhY2tldCgnbm90ZScsIHRvcGljTmFtZSk7XG4gICAgcGt0Lm5vdGUud2hhdCA9IHdoYXQ7XG4gICAgcGt0Lm5vdGUuc2VxID0gc2VxO1xuICAgIHRoaXMuI3NlbmQocGt0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBCcm9hZGNhc3QgYSBrZXktcHJlc3Mgbm90aWZpY2F0aW9uIHRvIHRvcGljIHN1YnNjcmliZXJzLiBVc2VkIHRvIHNob3dcbiAgICogdHlwaW5nIG5vdGlmaWNhdGlvbnMgXCJ1c2VyIFggaXMgdHlwaW5nLi4uXCIuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpY05hbWUgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byBicm9hZGNhc3QgdG8uXG4gICAqL1xuICBub3RlS2V5UHJlc3ModG9waWNOYW1lKSB7XG4gICAgY29uc3QgcGt0ID0gdGhpcy4jaW5pdFBhY2tldCgnbm90ZScsIHRvcGljTmFtZSk7XG4gICAgcGt0Lm5vdGUud2hhdCA9ICdrcCc7XG4gICAgdGhpcy4jc2VuZChwa3QpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgYSB2aWRlbyBjYWxsIG5vdGlmaWNhdGlvbiB0byB0b3BpYyBzdWJzY3JpYmVycyAoaW5jbHVkaW5nIGRpYWxpbmcsXG4gICAqIGhhbmd1cCwgZXRjLikuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpY05hbWUgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byBicm9hZGNhc3QgdG8uXG4gICAqIEBwYXJhbSB7aW50fSBzZXEgLSBJRCBvZiB0aGUgY2FsbCBtZXNzYWdlIHRoZSBldmVudCBwZXJ0YWlucyB0by5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGV2dCAtIENhbGwgZXZlbnQuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXlsb2FkIC0gUGF5bG9hZCBhc3NvY2lhdGVkIHdpdGggdGhpcyBldmVudCAoZS5nLiBTRFAgc3RyaW5nKS5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgKGZvciBzb21lIGNhbGwgZXZlbnRzKSB3aGljaCB3aWxsXG4gICAqICAgICAgICAgICAgICAgICAgICBiZSByZXNvbHZlZC9yZWplY3RlZCBvbiByZWNlaXZpbmcgc2VydmVyIHJlcGx5XG4gICAqL1xuICB2aWRlb0NhbGwodG9waWNOYW1lLCBzZXEsIGV2dCwgcGF5bG9hZCkge1xuICAgIGNvbnN0IHBrdCA9IHRoaXMuI2luaXRQYWNrZXQoJ25vdGUnLCB0b3BpY05hbWUpO1xuICAgIHBrdC5ub3RlLnNlcSA9IHNlcTtcbiAgICBwa3Qubm90ZS53aGF0ID0gJ2NhbGwnO1xuICAgIHBrdC5ub3RlLmV2ZW50ID0gZXZ0O1xuICAgIHBrdC5ub3RlLnBheWxvYWQgPSBwYXlsb2FkO1xuICAgIHRoaXMuI3NlbmQocGt0LCBwa3Qubm90ZS5pZCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGEgbmFtZWQgdG9waWMsIGVpdGhlciBwdWxsIGl0IGZyb20gY2FjaGUgb3IgY3JlYXRlIGEgbmV3IGluc3RhbmNlLlxuICAgKiBUaGVyZSBpcyBhIHNpbmdsZSBpbnN0YW5jZSBvZiB0b3BpYyBmb3IgZWFjaCBuYW1lLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWNOYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gZ2V0LlxuICAgKlxuICAgKiBAcmV0dXJucyB7VG9waWN9IFJlcXVlc3RlZCBvciBuZXdseSBjcmVhdGVkIHRvcGljIG9yIDxjb2RlPnVuZGVmaW5lZDwvY29kZT4gaWYgdG9waWMgbmFtZSBpcyBpbnZhbGlkLlxuICAgKi9cbiAgZ2V0VG9waWModG9waWNOYW1lKSB7XG4gICAgbGV0IHRvcGljID0gdGhpcy4jY2FjaGVHZXQoJ3RvcGljJywgdG9waWNOYW1lKTtcbiAgICBpZiAoIXRvcGljICYmIHRvcGljTmFtZSkge1xuICAgICAgaWYgKHRvcGljTmFtZSA9PSBDb25zdC5UT1BJQ19NRSkge1xuICAgICAgICB0b3BpYyA9IG5ldyBUb3BpY01lKCk7XG4gICAgICB9IGVsc2UgaWYgKHRvcGljTmFtZSA9PSBDb25zdC5UT1BJQ19GTkQpIHtcbiAgICAgICAgdG9waWMgPSBuZXcgVG9waWNGbmQoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRvcGljID0gbmV3IFRvcGljKHRvcGljTmFtZSk7XG4gICAgICB9XG4gICAgICAvLyBDYWNoZSBtYW5hZ2VtZW50LlxuICAgICAgdGhpcy4jYXR0YWNoQ2FjaGVUb1RvcGljKHRvcGljKTtcbiAgICAgIHRvcGljLl9jYWNoZVB1dFNlbGYoKTtcbiAgICAgIC8vIERvbid0IHNhdmUgdG8gREIgaGVyZTogYSByZWNvcmQgd2lsbCBiZSBhZGRlZCB3aGVuIHRoZSB0b3BpYyBpcyBzdWJzY3JpYmVkLlxuICAgIH1cbiAgICByZXR1cm4gdG9waWM7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGEgbmFtZWQgdG9waWMgZnJvbSBjYWNoZS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljTmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIGdldC5cbiAgICpcbiAgICogQHJldHVybnMge1RvcGljfSBSZXF1ZXN0ZWQgdG9waWMgb3IgPGNvZGU+dW5kZWZpbmVkPC9jb2RlPiBpZiB0b3BpYyBpcyBub3QgZm91bmQgaW4gY2FjaGUuXG4gICAqL1xuICBjYWNoZUdldFRvcGljKHRvcGljTmFtZSkge1xuICAgIHJldHVybiB0aGlzLiNjYWNoZUdldCgndG9waWMnLCB0b3BpY05hbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBuYW1lZCB0b3BpYyBmcm9tIGNhY2hlLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWNOYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gcmVtb3ZlIGZyb20gY2FjaGUuXG4gICAqL1xuICBjYWNoZVJlbVRvcGljKHRvcGljTmFtZSkge1xuICAgIHRoaXMuI2NhY2hlRGVsKCd0b3BpYycsIHRvcGljTmFtZSk7XG4gIH1cblxuICAvKipcbiAgICogSXRlcmF0ZSBvdmVyIGNhY2hlZCB0b3BpY3MuXG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgLSBjYWxsYmFjayB0byBjYWxsIGZvciBlYWNoIHRvcGljLlxuICAgKiBAcGFyYW0ge09iamVjdH0gY29udGV4dCAtICd0aGlzJyBpbnNpZGUgdGhlICdmdW5jJy5cbiAgICovXG4gIG1hcFRvcGljcyhmdW5jLCBjb250ZXh0KSB7XG4gICAgdGhpcy4jY2FjaGVNYXAoJ3RvcGljJywgZnVuYywgY29udGV4dCk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgbmFtZWQgdG9waWMgaXMgYWxyZWFkeSBwcmVzZW50IGluIGNhY2hlLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWNOYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIHRvcGljIGlzIGZvdW5kIGluIGNhY2hlLCBmYWxzZSBvdGhlcndpc2UuXG4gICAqL1xuICBpc1RvcGljQ2FjaGVkKHRvcGljTmFtZSkge1xuICAgIHJldHVybiAhIXRoaXMuI2NhY2hlR2V0KCd0b3BpYycsIHRvcGljTmFtZSk7XG4gIH1cblxuICAvKipcbiAgICogR2VuZXJhdGUgdW5pcXVlIG5hbWUgbGlrZSA8Y29kZT4nbmV3MTIzNDU2JzwvY29kZT4gc3VpdGFibGUgZm9yIGNyZWF0aW5nIGEgbmV3IGdyb3VwIHRvcGljLlxuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGlzQ2hhbiAtIGlmIHRoZSB0b3BpYyBpcyBjaGFubmVsLWVuYWJsZWQuXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IG5hbWUgd2hpY2ggY2FuIGJlIHVzZWQgZm9yIGNyZWF0aW5nIGEgbmV3IGdyb3VwIHRvcGljLlxuICAgKi9cbiAgbmV3R3JvdXBUb3BpY05hbWUoaXNDaGFuKSB7XG4gICAgcmV0dXJuIChpc0NoYW4gPyBDb25zdC5UT1BJQ19ORVdfQ0hBTiA6IENvbnN0LlRPUElDX05FVykgKyB0aGlzLmdldE5leHRVbmlxdWVJZCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluc3RhbnRpYXRlIDxjb2RlPidtZSc8L2NvZGU+IHRvcGljIG9yIGdldCBpdCBmcm9tIGNhY2hlLlxuICAgKlxuICAgKiBAcmV0dXJucyB7VG9waWNNZX0gSW5zdGFuY2Ugb2YgPGNvZGU+J21lJzwvY29kZT4gdG9waWMuXG4gICAqL1xuICBnZXRNZVRvcGljKCkge1xuICAgIHJldHVybiB0aGlzLmdldFRvcGljKENvbnN0LlRPUElDX01FKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnN0YW50aWF0ZSA8Y29kZT4nZm5kJzwvY29kZT4gKGZpbmQpIHRvcGljIG9yIGdldCBpdCBmcm9tIGNhY2hlLlxuICAgKlxuICAgKiBAcmV0dXJucyB7VG9waWN9IEluc3RhbmNlIG9mIDxjb2RlPidmbmQnPC9jb2RlPiB0b3BpYy5cbiAgICovXG4gIGdldEZuZFRvcGljKCkge1xuICAgIHJldHVybiB0aGlzLmdldFRvcGljKENvbnN0LlRPUElDX0ZORCk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgbmV3IHtAbGluayBMYXJnZUZpbGVIZWxwZXJ9IGluc3RhbmNlXG4gICAqXG4gICAqIEByZXR1cm5zIHtMYXJnZUZpbGVIZWxwZXJ9IGluc3RhbmNlIG9mIGEge0BsaW5rIFRpbm9kZS5MYXJnZUZpbGVIZWxwZXJ9LlxuICAgKi9cbiAgZ2V0TGFyZ2VGaWxlSGVscGVyKCkge1xuICAgIHJldHVybiBuZXcgTGFyZ2VGaWxlSGVscGVyKHRoaXMsIENvbnN0LlBST1RPQ09MX1ZFUlNJT04pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgVUlEIG9mIHRoZSB0aGUgY3VycmVudCBhdXRoZW50aWNhdGVkIHVzZXIuXG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IFVJRCBvZiB0aGUgY3VycmVudCB1c2VyIG9yIDxjb2RlPnVuZGVmaW5lZDwvY29kZT4gaWYgdGhlIHNlc3Npb24gaXMgbm90IHlldFxuICAgKiBhdXRoZW50aWNhdGVkIG9yIGlmIHRoZXJlIGlzIG5vIHNlc3Npb24uXG4gICAqL1xuICBnZXRDdXJyZW50VXNlcklEKCkge1xuICAgIHJldHVybiB0aGlzLl9teVVJRDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgZ2l2ZW4gdXNlciBJRCBpcyBlcXVhbCB0byB0aGUgY3VycmVudCB1c2VyJ3MgVUlELlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdWlkIC0gVUlEIHRvIGNoZWNrLlxuICAgKlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGUgZ2l2ZW4gVUlEIGJlbG9uZ3MgdG8gdGhlIGN1cnJlbnQgbG9nZ2VkIGluIHVzZXIuXG4gICAqL1xuICBpc01lKHVpZCkge1xuICAgIHJldHVybiB0aGlzLl9teVVJRCA9PT0gdWlkO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBsb2dpbiB1c2VkIGZvciBsYXN0IHN1Y2Nlc3NmdWwgYXV0aGVudGljYXRpb24uXG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IGxvZ2luIGxhc3QgdXNlZCBzdWNjZXNzZnVsbHkgb3IgPGNvZGU+dW5kZWZpbmVkPC9jb2RlPi5cbiAgICovXG4gIGdldEN1cnJlbnRMb2dpbigpIHtcbiAgICByZXR1cm4gdGhpcy5fbG9naW47XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIGluZm9ybWF0aW9uIGFib3V0IHRoZSBzZXJ2ZXI6IHByb3RvY29sIHZlcnNpb24gYW5kIGJ1aWxkIHRpbWVzdGFtcC5cbiAgICpcbiAgICogQHJldHVybnMge09iamVjdH0gYnVpbGQgYW5kIHZlcnNpb24gb2YgdGhlIHNlcnZlciBvciA8Y29kZT5udWxsPC9jb2RlPiBpZiB0aGVyZSBpcyBubyBjb25uZWN0aW9uIG9yXG4gICAqIGlmIHRoZSBmaXJzdCBzZXJ2ZXIgcmVzcG9uc2UgaGFzIG5vdCBiZWVuIHJlY2VpdmVkIHlldC5cbiAgICovXG4gIGdldFNlcnZlckluZm8oKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NlcnZlckluZm87XG4gIH1cblxuICAvKipcbiAgICogUmVwb3J0IGEgdG9waWMgZm9yIGFidXNlLiBXcmFwcGVyIGZvciB7QGxpbmsgVGlub2RlI3B1Ymxpc2h9LlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gYWN0aW9uIC0gdGhlIG9ubHkgc3VwcG9ydGVkIGFjdGlvbiBpcyAncmVwb3J0Jy5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHRhcmdldCAtIG5hbWUgb2YgdGhlIHRvcGljIGJlaW5nIHJlcG9ydGVkLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBzZXJ2ZXIgcmVzcG9uZHMgdG8gcmVxdWVzdC5cbiAgICovXG4gIHJlcG9ydChhY3Rpb24sIHRhcmdldCkge1xuICAgIHJldHVybiB0aGlzLnB1Ymxpc2goQ29uc3QuVE9QSUNfU1lTLCBEcmFmdHkuYXR0YWNoSlNPTihudWxsLCB7XG4gICAgICAnYWN0aW9uJzogYWN0aW9uLFxuICAgICAgJ3RhcmdldCc6IHRhcmdldFxuICAgIH0pKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gc2VydmVyLXByb3ZpZGVkIGNvbmZpZ3VyYXRpb24gdmFsdWUuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIG9mIHRoZSB2YWx1ZSB0byByZXR1cm4uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkZWZhdWx0VmFsdWUgdG8gcmV0dXJuIGluIGNhc2UgdGhlIHBhcmFtZXRlciBpcyBub3Qgc2V0IG9yIG5vdCBmb3VuZC5cbiAgICpcbiAgICogQHJldHVybnMge09iamVjdH0gbmFtZWQgdmFsdWUuXG4gICAqL1xuICBnZXRTZXJ2ZXJQYXJhbShuYW1lLCBkZWZhdWx0VmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5fc2VydmVySW5mbyAmJiB0aGlzLl9zZXJ2ZXJJbmZvW25hbWVdIHx8IGRlZmF1bHRWYWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUb2dnbGUgY29uc29sZSBsb2dnaW5nLiBMb2dnaW5nIGlzIG9mZiBieSBkZWZhdWx0LlxuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGVuYWJsZWQgLSBTZXQgdG8gPGNvZGU+dHJ1ZTwvY29kZT4gdG8gZW5hYmxlIGxvZ2dpbmcgdG8gY29uc29sZS5cbiAgICogQHBhcmFtIHtib29sZWFufSB0cmltTG9uZ1N0cmluZ3MgLSBTZXQgdG8gPGNvZGU+dHJ1ZTwvY29kZT4gdG8gdHJpbSBsb25nIHN0cmluZ3MuXG4gICAqL1xuICBlbmFibGVMb2dnaW5nKGVuYWJsZWQsIHRyaW1Mb25nU3RyaW5ncykge1xuICAgIHRoaXMuX2xvZ2dpbmdFbmFibGVkID0gZW5hYmxlZDtcbiAgICB0aGlzLl90cmltTG9uZ1N0cmluZ3MgPSBlbmFibGVkICYmIHRyaW1Mb25nU3RyaW5ncztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgVUkgbGFuZ3VhZ2UgdG8gcmVwb3J0IHRvIHRoZSBzZXJ2ZXIuIE11c3QgYmUgY2FsbGVkIGJlZm9yZSA8Y29kZT4naGknPC9jb2RlPiBpcyBzZW50LCBvdGhlcndpc2UgaXQgd2lsbCBub3QgYmUgdXNlZC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGhsIC0gaHVtYW4gKFVJKSBsYW5ndWFnZSwgbGlrZSA8Y29kZT5cImVuX1VTXCI8L2NvZGU+IG9yIDxjb2RlPlwiemgtSGFuc1wiPC9jb2RlPi5cbiAgICovXG4gIHNldEh1bWFuTGFuZ3VhZ2UoaGwpIHtcbiAgICBpZiAoaGwpIHtcbiAgICAgIHRoaXMuX2h1bWFuTGFuZ3VhZ2UgPSBobDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgZ2l2ZW4gdG9waWMgaXMgb25saW5lLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBvZiB0aGUgdG9waWMgdG8gdGVzdC5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgdG9waWMgaXMgb25saW5lLCBmYWxzZSBvdGhlcndpc2UuXG4gICAqL1xuICBpc1RvcGljT25saW5lKG5hbWUpIHtcbiAgICBjb25zdCB0b3BpYyA9IHRoaXMuI2NhY2hlR2V0KCd0b3BpYycsIG5hbWUpO1xuICAgIHJldHVybiB0b3BpYyAmJiB0b3BpYy5vbmxpbmU7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGFjY2VzcyBtb2RlIGZvciB0aGUgZ2l2ZW4gY29udGFjdC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgb2YgdGhlIHRvcGljIHRvIHF1ZXJ5LlxuICAgKiBAcmV0dXJucyB7QWNjZXNzTW9kZX0gYWNjZXNzIG1vZGUgaWYgdG9waWMgaXMgZm91bmQsIG51bGwgb3RoZXJ3aXNlLlxuICAgKi9cbiAgZ2V0VG9waWNBY2Nlc3NNb2RlKG5hbWUpIHtcbiAgICBjb25zdCB0b3BpYyA9IHRoaXMuI2NhY2hlR2V0KCd0b3BpYycsIG5hbWUpO1xuICAgIHJldHVybiB0b3BpYyA/IHRvcGljLmFjcyA6IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogSW5jbHVkZSBtZXNzYWdlIElEIGludG8gYWxsIHN1YnNlcXVlc3QgbWVzc2FnZXMgdG8gc2VydmVyIGluc3RydWN0aW4gaXQgdG8gc2VuZCBha25vd2xlZGdlbWVucy5cbiAgICogUmVxdWlyZWQgZm9yIHByb21pc2VzIHRvIGZ1bmN0aW9uLiBEZWZhdWx0IGlzIDxjb2RlPlwib25cIjwvY29kZT4uXG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gc3RhdHVzIC0gVHVybiBha25vd2xlZGdlbWVucyBvbiBvciBvZmYuXG4gICAqIEBkZXByZWNhdGVkXG4gICAqL1xuICB3YW50QWtuKHN0YXR1cykge1xuICAgIGlmIChzdGF0dXMpIHtcbiAgICAgIHRoaXMuX21lc3NhZ2VJZCA9IE1hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkgKiAweEZGRkZGRikgKyAweEZGRkZGRik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX21lc3NhZ2VJZCA9IDA7XG4gICAgfVxuICB9XG5cbiAgLy8gQ2FsbGJhY2tzOlxuICAvKipcbiAgICogQ2FsbGJhY2sgdG8gcmVwb3J0IHdoZW4gdGhlIHdlYnNvY2tldCBpcyBvcGVuZWQuIFRoZSBjYWxsYmFjayBoYXMgbm8gcGFyYW1ldGVycy5cbiAgICpcbiAgICogQHR5cGUge29uV2Vic29ja2V0T3Blbn1cbiAgICovXG4gIG9uV2Vic29ja2V0T3BlbiA9IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQHR5cGVkZWYgU2VydmVyUGFyYW1zXG4gICAqXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB2ZXIgLSBTZXJ2ZXIgdmVyc2lvblxuICAgKiBAcHJvcGVydHkge3N0cmluZ30gYnVpbGQgLSBTZXJ2ZXIgYnVpbGRcbiAgICogQHByb3BlcnR5IHtzdHJpbmc9fSBzaWQgLSBTZXNzaW9uIElELCBsb25nIHBvbGxpbmcgY29ubmVjdGlvbnMgb25seS5cbiAgICovXG5cbiAgLyoqXG4gICAqIEBjYWxsYmFjayBvbkNvbm5lY3RcbiAgICogQHBhcmFtIHtudW1iZXJ9IGNvZGUgLSBSZXN1bHQgY29kZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGV4dCAtIFRleHQgZXB4cGxhaW5pbmcgdGhlIGNvbXBsZXRpb24sIGkuZSBcIk9LXCIgb3IgYW4gZXJyb3IgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtTZXJ2ZXJQYXJhbXN9IHBhcmFtcyAtIFBhcmFtZXRlcnMgcmV0dXJuZWQgYnkgdGhlIHNlcnZlci5cbiAgICovXG4gIC8qKlxuICAgKiBDYWxsYmFjayB0byByZXBvcnQgd2hlbiBjb25uZWN0aW9uIHdpdGggVGlub2RlIHNlcnZlciBpcyBlc3RhYmxpc2hlZC5cbiAgICogQHR5cGUge29uQ29ubmVjdH1cbiAgICovXG4gIG9uQ29ubmVjdCA9IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQ2FsbGJhY2sgdG8gcmVwb3J0IHdoZW4gY29ubmVjdGlvbiBpcyBsb3N0LiBUaGUgY2FsbGJhY2sgaGFzIG5vIHBhcmFtZXRlcnMuXG4gICAqIEB0eXBlIHtvbkRpc2Nvbm5lY3R9XG4gICAqL1xuICBvbkRpc2Nvbm5lY3QgPSB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIEBjYWxsYmFjayBvbkxvZ2luXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBjb2RlIC0gTlVtZXJpYyBjb21wbGV0aW9uIGNvZGUsIHNhbWUgYXMgSFRUUCBzdGF0dXMgY29kZXMuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IC0gRXhwbGFuYXRpb24gb2YgdGhlIGNvbXBsZXRpb24gY29kZS5cbiAgICovXG4gIC8qKlxuICAgKiBDYWxsYmFjayB0byByZXBvcnQgbG9naW4gY29tcGxldGlvbi5cbiAgICogQHR5cGUge29uTG9naW59XG4gICAqL1xuICBvbkxvZ2luID0gdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBDYWxsYmFjayB0byByZWNlaXZlIDxjb2RlPntjdHJsfTwvY29kZT4gKGNvbnRyb2wpIG1lc3NhZ2VzLlxuICAgKiBAdHlwZSB7b25DdHJsTWVzc2FnZX1cbiAgICovXG4gIG9uQ3RybE1lc3NhZ2UgPSB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIHRvIHJlY2lldmUgPGNvZGU+e2RhdGF9PC9jb2RlPiAoY29udGVudCkgbWVzc2FnZXMuXG4gICAqIEB0eXBlIHtvbkRhdGFNZXNzYWdlfVxuICAgKi9cbiAgb25EYXRhTWVzc2FnZSA9IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQ2FsbGJhY2sgdG8gcmVjZWl2ZSA8Y29kZT57cHJlc308L2NvZGU+IChwcmVzZW5jZSkgbWVzc2FnZXMuXG4gICAqIEB0eXBlIHtvblByZXNNZXNzYWdlfVxuICAgKi9cbiAgb25QcmVzTWVzc2FnZSA9IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQ2FsbGJhY2sgdG8gcmVjZWl2ZSBhbGwgbWVzc2FnZXMgYXMgb2JqZWN0cy5cbiAgICogQHR5cGUge29uTWVzc2FnZX1cbiAgICovXG4gIG9uTWVzc2FnZSA9IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQ2FsbGJhY2sgdG8gcmVjZWl2ZSBhbGwgbWVzc2FnZXMgYXMgdW5wYXJzZWQgdGV4dC5cbiAgICogQHR5cGUge29uUmF3TWVzc2FnZX1cbiAgICovXG4gIG9uUmF3TWVzc2FnZSA9IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQ2FsbGJhY2sgdG8gcmVjZWl2ZSBzZXJ2ZXIgcmVzcG9uc2VzIHRvIG5ldHdvcmsgcHJvYmVzLiBTZWUge0BsaW5rIFRpbm9kZSNuZXR3b3JrUHJvYmV9XG4gICAqIEB0eXBlIHtvbk5ldHdvcmtQcm9iZX1cbiAgICovXG4gIG9uTmV0d29ya1Byb2JlID0gdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBDYWxsYmFjayB0byBiZSBub3RpZmllZCB3aGVuIGV4cG9uZW50aWFsIGJhY2tvZmYgaXMgaXRlcmF0aW5nLlxuICAgKiBAdHlwZSB7b25BdXRvcmVjb25uZWN0SXRlcmF0aW9ufVxuICAgKi9cbiAgb25BdXRvcmVjb25uZWN0SXRlcmF0aW9uID0gdW5kZWZpbmVkO1xufTtcblxuLy8gRXhwb3J0ZWQgY29uc3RhbnRzXG5UaW5vZGUuTUVTU0FHRV9TVEFUVVNfTk9ORSA9IENvbnN0Lk1FU1NBR0VfU1RBVFVTX05PTkU7XG5UaW5vZGUuTUVTU0FHRV9TVEFUVVNfUVVFVUVEID0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfUVVFVUVEO1xuVGlub2RlLk1FU1NBR0VfU1RBVFVTX1NFTkRJTkcgPSBDb25zdC5NRVNTQUdFX1NUQVRVU19TRU5ESU5HO1xuVGlub2RlLk1FU1NBR0VfU1RBVFVTX0ZBSUxFRCA9IENvbnN0Lk1FU1NBR0VfU1RBVFVTX0ZBSUxFRDtcblRpbm9kZS5NRVNTQUdFX1NUQVRVU19TRU5UID0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfU0VOVDtcblRpbm9kZS5NRVNTQUdFX1NUQVRVU19SRUNFSVZFRCA9IENvbnN0Lk1FU1NBR0VfU1RBVFVTX1JFQ0VJVkVEO1xuVGlub2RlLk1FU1NBR0VfU1RBVFVTX1JFQUQgPSBDb25zdC5NRVNTQUdFX1NUQVRVU19SRUFEO1xuVGlub2RlLk1FU1NBR0VfU1RBVFVTX1RPX01FID0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfVE9fTUU7XG5UaW5vZGUuTUVTU0FHRV9TVEFUVVNfREVMX1JBTkdFID0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfREVMX1JBTkdFO1xuXG4vLyBVbmljb2RlIFtkZWxdIHN5bWJvbC5cblRpbm9kZS5ERUxfQ0hBUiA9IENvbnN0LkRFTF9DSEFSO1xuXG4vLyBOYW1lcyBvZiBrZXlzIHRvIHNlcnZlci1wcm92aWRlZCBjb25maWd1cmF0aW9uIGxpbWl0cy5cblRpbm9kZS5NQVhfTUVTU0FHRV9TSVpFID0gJ21heE1lc3NhZ2VTaXplJztcblRpbm9kZS5NQVhfU1VCU0NSSUJFUl9DT1VOVCA9ICdtYXhTdWJzY3JpYmVyQ291bnQnO1xuVGlub2RlLk1BWF9UQUdfQ09VTlQgPSAnbWF4VGFnQ291bnQnO1xuVGlub2RlLk1BWF9GSUxFX1VQTE9BRF9TSVpFID0gJ21heEZpbGVVcGxvYWRTaXplJztcbiIsIi8qKlxuICogQGZpbGUgVG9waWMgbWFuYWdlbWVudC5cbiAqXG4gKiBAY29weXJpZ2h0IDIwMTUtMjAyMiBUaW5vZGUgTExDLlxuICovXG4ndXNlIHN0cmljdCc7XG5cbmltcG9ydCBBY2Nlc3NNb2RlIGZyb20gJy4vYWNjZXNzLW1vZGUuanMnO1xuaW1wb3J0IENCdWZmZXIgZnJvbSAnLi9jYnVmZmVyLmpzJztcbmltcG9ydCAqIGFzIENvbnN0IGZyb20gJy4vY29uZmlnLmpzJztcbmltcG9ydCBEcmFmdHkgZnJvbSAnLi9kcmFmdHkuanMnO1xuaW1wb3J0IE1ldGFHZXRCdWlsZGVyIGZyb20gJy4vbWV0YS1idWlsZGVyLmpzJztcbmltcG9ydCB7XG4gIG1lcmdlT2JqLFxuICBtZXJnZVRvQ2FjaGUsXG4gIG5vcm1hbGl6ZUFycmF5XG59IGZyb20gJy4vdXRpbHMuanMnO1xuXG5leHBvcnQgY2xhc3MgVG9waWMge1xuICAvKipcbiAgICogQGNhbGxiYWNrIFRpbm9kZS5Ub3BpYy5vbkRhdGFcbiAgICogQHBhcmFtIHtEYXRhfSBkYXRhIC0gRGF0YSBwYWNrZXRcbiAgICovXG4gIC8qKlxuICAgKiBUb3BpYyBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyBhIGxvZ2ljYWwgY29tbXVuaWNhdGlvbiBjaGFubmVsLlxuICAgKiBAY2xhc3MgVG9waWNcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIGNyZWF0ZS5cbiAgICogQHBhcmFtIHtPYmplY3Q9fSBjYWxsYmFja3MgLSBPYmplY3Qgd2l0aCB2YXJpb3VzIGV2ZW50IGNhbGxiYWNrcy5cbiAgICogQHBhcmFtIHtUaW5vZGUuVG9waWMub25EYXRhfSBjYWxsYmFja3Mub25EYXRhIC0gQ2FsbGJhY2sgd2hpY2ggcmVjZWl2ZXMgYSA8Y29kZT57ZGF0YX08L2NvZGU+IG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7Y2FsbGJhY2t9IGNhbGxiYWNrcy5vbk1ldGEgLSBDYWxsYmFjayB3aGljaCByZWNlaXZlcyBhIDxjb2RlPnttZXRhfTwvY29kZT4gbWVzc2FnZS5cbiAgICogQHBhcmFtIHtjYWxsYmFja30gY2FsbGJhY2tzLm9uUHJlcyAtIENhbGxiYWNrIHdoaWNoIHJlY2VpdmVzIGEgPGNvZGU+e3ByZXN9PC9jb2RlPiBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge2NhbGxiYWNrfSBjYWxsYmFja3Mub25JbmZvIC0gQ2FsbGJhY2sgd2hpY2ggcmVjZWl2ZXMgYW4gPGNvZGU+e2luZm99PC9jb2RlPiBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge2NhbGxiYWNrfSBjYWxsYmFja3Mub25NZXRhRGVzYyAtIENhbGxiYWNrIHdoaWNoIHJlY2VpdmVzIGNoYW5nZXMgdG8gdG9waWMgZGVzY3Rpb3B0aW9uIHtAbGluayBkZXNjfS5cbiAgICogQHBhcmFtIHtjYWxsYmFja30gY2FsbGJhY2tzLm9uTWV0YVN1YiAtIENhbGxlZCBmb3IgYSBzaW5nbGUgc3Vic2NyaXB0aW9uIHJlY29yZCBjaGFuZ2UuXG4gICAqIEBwYXJhbSB7Y2FsbGJhY2t9IGNhbGxiYWNrcy5vblN1YnNVcGRhdGVkIC0gQ2FsbGVkIGFmdGVyIGEgYmF0Y2ggb2Ygc3Vic2NyaXB0aW9uIGNoYW5nZXMgaGF2ZSBiZWVuIHJlY2lldmVkIGFuZCBjYWNoZWQuXG4gICAqIEBwYXJhbSB7Y2FsbGJhY2t9IGNhbGxiYWNrcy5vbkRlbGV0ZVRvcGljIC0gQ2FsbGVkIGFmdGVyIHRoZSB0b3BpYyBpcyBkZWxldGVkLlxuICAgKiBAcGFyYW0ge2NhbGxiYWNrfSBjYWxsYmFjbHMub25BbGxNZXNzYWdlc1JlY2VpdmVkIC0gQ2FsbGVkIHdoZW4gYWxsIHJlcXVlc3RlZCA8Y29kZT57ZGF0YX08L2NvZGU+IG1lc3NhZ2VzIGhhdmUgYmVlbiByZWNpdmVkLlxuICAgKi9cbiAgY29uc3RydWN0b3IobmFtZSwgY2FsbGJhY2tzKSB7XG4gICAgLy8gUGFyZW50IFRpbm9kZSBvYmplY3QuXG4gICAgdGhpcy5fdGlub2RlID0gbnVsbDtcblxuICAgIC8vIFNlcnZlci1wcm92aWRlZCBkYXRhLCBsb2NhbGx5IGltbXV0YWJsZS5cbiAgICAvLyB0b3BpYyBuYW1lXG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAvLyBUaW1lc3RhbXAgd2hlbiB0aGUgdG9waWMgd2FzIGNyZWF0ZWQuXG4gICAgdGhpcy5jcmVhdGVkID0gbnVsbDtcbiAgICAvLyBUaW1lc3RhbXAgd2hlbiB0aGUgdG9waWMgd2FzIGxhc3QgdXBkYXRlZC5cbiAgICB0aGlzLnVwZGF0ZWQgPSBudWxsO1xuICAgIC8vIFRpbWVzdGFtcCBvZiB0aGUgbGFzdCBtZXNzYWdlc1xuICAgIHRoaXMudG91Y2hlZCA9IG5ldyBEYXRlKDApO1xuICAgIC8vIEFjY2VzcyBtb2RlLCBzZWUgQWNjZXNzTW9kZVxuICAgIHRoaXMuYWNzID0gbmV3IEFjY2Vzc01vZGUobnVsbCk7XG4gICAgLy8gUGVyLXRvcGljIHByaXZhdGUgZGF0YSAoYWNjZXNzaWJsZSBieSBjdXJyZW50IHVzZXIgb25seSkuXG4gICAgdGhpcy5wcml2YXRlID0gbnVsbDtcbiAgICAvLyBQZXItdG9waWMgcHVibGljIGRhdGEgKGFjY2Vzc2libGUgYnkgYWxsIHVzZXJzKS5cbiAgICB0aGlzLnB1YmxpYyA9IG51bGw7XG4gICAgLy8gUGVyLXRvcGljIHN5c3RlbS1wcm92aWRlZCBkYXRhIChhY2Nlc3NpYmxlIGJ5IGFsbCB1c2VycykuXG4gICAgdGhpcy50cnVzdGVkID0gbnVsbDtcblxuICAgIC8vIExvY2FsbHkgY2FjaGVkIGRhdGFcbiAgICAvLyBTdWJzY3JpYmVkIHVzZXJzLCBmb3IgdHJhY2tpbmcgcmVhZC9yZWN2L21zZyBub3RpZmljYXRpb25zLlxuICAgIHRoaXMuX3VzZXJzID0ge307XG5cbiAgICAvLyBDdXJyZW50IHZhbHVlIG9mIGxvY2FsbHkgaXNzdWVkIHNlcUlkLCB1c2VkIGZvciBwZW5kaW5nIG1lc3NhZ2VzLlxuICAgIHRoaXMuX3F1ZXVlZFNlcUlkID0gQ29uc3QuTE9DQUxfU0VRSUQ7XG5cbiAgICAvLyBUaGUgbWF4aW11bSBrbm93biB7ZGF0YS5zZXF9IHZhbHVlLlxuICAgIHRoaXMuX21heFNlcSA9IDA7XG4gICAgLy8gVGhlIG1pbmltdW0ga25vd24ge2RhdGEuc2VxfSB2YWx1ZS5cbiAgICB0aGlzLl9taW5TZXEgPSAwO1xuICAgIC8vIEluZGljYXRvciB0aGF0IHRoZSBsYXN0IHJlcXVlc3QgZm9yIGVhcmxpZXIgbWVzc2FnZXMgcmV0dXJuZWQgMC5cbiAgICB0aGlzLl9ub0VhcmxpZXJNc2dzID0gZmFsc2U7XG4gICAgLy8gVGhlIG1heGltdW0ga25vd24gZGVsZXRpb24gSUQuXG4gICAgdGhpcy5fbWF4RGVsID0gMDtcbiAgICAvLyBUaW1lciBvYmplY3QgdXNlZCB0byBzZW5kICdyZWN2JyBub3RpZmljYXRpb25zLlxuICAgIHRoaXMuX3JlY3ZOb3RpZmljYXRpb25UaW1lciA9IG51bGw7XG5cbiAgICAvLyBVc2VyIGRpc2NvdmVyeSB0YWdzXG4gICAgdGhpcy5fdGFncyA9IFtdO1xuICAgIC8vIENyZWRlbnRpYWxzIHN1Y2ggYXMgZW1haWwgb3IgcGhvbmUgbnVtYmVyLlxuICAgIHRoaXMuX2NyZWRlbnRpYWxzID0gW107XG4gICAgLy8gTWVzc2FnZSB2ZXJzaW9ucyBjYWNoZSAoZS5nLiBmb3IgZWRpdGVkIG1lc3NhZ2VzKS5cbiAgICAvLyBLZXlzOiBvcmlnaW5hbCBtZXNzYWdlIHNlcSBpZHMuXG4gICAgLy8gVmFsdWVzOiBDQnVmZmVycyBjb250YWluaW5nIG5ld2VyIHZlcnNpb25zIG9mIHRoZSBvcmlnaW5hbCBtZXNzYWdlXG4gICAgLy8gb3JkZXJlZCBieSBzZXEgaWQuXG4gICAgdGhpcy5fbWVzc2FnZVZlcnNpb25zID0ge307XG4gICAgLy8gTWVzc2FnZSBjYWNoZSwgc29ydGVkIGJ5IG1lc3NhZ2Ugc2VxIHZhbHVlcywgZnJvbSBvbGQgdG8gbmV3LlxuICAgIHRoaXMuX21lc3NhZ2VzID0gbmV3IENCdWZmZXIoKGEsIGIpID0+IHtcbiAgICAgIHJldHVybiBhLnNlcSAtIGIuc2VxO1xuICAgIH0sIHRydWUpO1xuICAgIC8vIEJvb2xlYW4sIHRydWUgaWYgdGhlIHRvcGljIGlzIGN1cnJlbnRseSBsaXZlXG4gICAgdGhpcy5fYXR0YWNoZWQgPSBmYWxzZTtcbiAgICAvLyBUaW1lc3RhcCBvZiB0aGUgbW9zdCByZWNlbnRseSB1cGRhdGVkIHN1YnNjcmlwdGlvbi5cbiAgICB0aGlzLl9sYXN0U3Vic1VwZGF0ZSA9IG5ldyBEYXRlKDApO1xuICAgIC8vIFRvcGljIGNyZWF0ZWQgYnV0IG5vdCB5ZXQgc3luY2VkIHdpdGggdGhlIHNlcnZlci4gVXNlZCBvbmx5IGR1cmluZyBpbml0aWFsaXphdGlvbi5cbiAgICB0aGlzLl9uZXcgPSB0cnVlO1xuICAgIC8vIFRoZSB0b3BpYyBpcyBkZWxldGVkIGF0IHRoZSBzZXJ2ZXIsIHRoaXMgaXMgYSBsb2NhbCBjb3B5LlxuICAgIHRoaXMuX2RlbGV0ZWQgPSBmYWxzZTtcblxuICAgIC8vIFRpbWVyIHVzZWQgdG8gdHJnZ2VyIHtsZWF2ZX0gcmVxdWVzdCBhZnRlciBhIGRlbGF5LlxuICAgIHRoaXMuX2RlbGF5ZWRMZWF2ZVRpbWVyID0gbnVsbDtcblxuICAgIC8vIENhbGxiYWNrc1xuICAgIGlmIChjYWxsYmFja3MpIHtcbiAgICAgIHRoaXMub25EYXRhID0gY2FsbGJhY2tzLm9uRGF0YTtcbiAgICAgIHRoaXMub25NZXRhID0gY2FsbGJhY2tzLm9uTWV0YTtcbiAgICAgIHRoaXMub25QcmVzID0gY2FsbGJhY2tzLm9uUHJlcztcbiAgICAgIHRoaXMub25JbmZvID0gY2FsbGJhY2tzLm9uSW5mbztcbiAgICAgIC8vIEEgc2luZ2xlIGRlc2MgdXBkYXRlO1xuICAgICAgdGhpcy5vbk1ldGFEZXNjID0gY2FsbGJhY2tzLm9uTWV0YURlc2M7XG4gICAgICAvLyBBIHNpbmdsZSBzdWJzY3JpcHRpb24gcmVjb3JkO1xuICAgICAgdGhpcy5vbk1ldGFTdWIgPSBjYWxsYmFja3Mub25NZXRhU3ViO1xuICAgICAgLy8gQWxsIHN1YnNjcmlwdGlvbiByZWNvcmRzIHJlY2VpdmVkO1xuICAgICAgdGhpcy5vblN1YnNVcGRhdGVkID0gY2FsbGJhY2tzLm9uU3Vic1VwZGF0ZWQ7XG4gICAgICB0aGlzLm9uVGFnc1VwZGF0ZWQgPSBjYWxsYmFja3Mub25UYWdzVXBkYXRlZDtcbiAgICAgIHRoaXMub25DcmVkc1VwZGF0ZWQgPSBjYWxsYmFja3Mub25DcmVkc1VwZGF0ZWQ7XG4gICAgICB0aGlzLm9uRGVsZXRlVG9waWMgPSBjYWxsYmFja3Mub25EZWxldGVUb3BpYztcbiAgICAgIHRoaXMub25BbGxNZXNzYWdlc1JlY2VpdmVkID0gY2FsbGJhY2tzLm9uQWxsTWVzc2FnZXNSZWNlaXZlZDtcbiAgICB9XG4gIH1cblxuICAvLyBTdGF0aWMgbWV0aG9kcy5cblxuICAvKipcbiAgICogRGV0ZXJtaW5lIHRvcGljIHR5cGUgZnJvbSB0b3BpYydzIG5hbWU6IGdycCwgcDJwLCBtZSwgZm5kLCBzeXMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byB0ZXN0LlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBPbmUgb2YgPGNvZGU+XCJtZVwiPC9jb2RlPiwgPGNvZGU+XCJmbmRcIjwvY29kZT4sIDxjb2RlPlwic3lzXCI8L2NvZGU+LCA8Y29kZT5cImdycFwiPC9jb2RlPixcbiAgICogICAgPGNvZGU+XCJwMnBcIjwvY29kZT4gb3IgPGNvZGU+dW5kZWZpbmVkPC9jb2RlPi5cbiAgICovXG4gIHN0YXRpYyB0b3BpY1R5cGUobmFtZSkge1xuICAgIGNvbnN0IHR5cGVzID0ge1xuICAgICAgJ21lJzogQ29uc3QuVE9QSUNfTUUsXG4gICAgICAnZm5kJzogQ29uc3QuVE9QSUNfRk5ELFxuICAgICAgJ2dycCc6IENvbnN0LlRPUElDX0dSUCxcbiAgICAgICduZXcnOiBDb25zdC5UT1BJQ19HUlAsXG4gICAgICAnbmNoJzogQ29uc3QuVE9QSUNfR1JQLFxuICAgICAgJ2Nobic6IENvbnN0LlRPUElDX0dSUCxcbiAgICAgICd1c3InOiBDb25zdC5UT1BJQ19QMlAsXG4gICAgICAnc3lzJzogQ29uc3QuVE9QSUNfU1lTXG4gICAgfTtcbiAgICByZXR1cm4gdHlwZXNbKHR5cGVvZiBuYW1lID09ICdzdHJpbmcnKSA/IG5hbWUuc3Vic3RyaW5nKDAsIDMpIDogJ3h4eCddO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSBnaXZlbiB0b3BpYyBuYW1lIGlzIGEgbmFtZSBvZiBhICdtZScgdG9waWMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byB0ZXN0LlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgdGhlIG5hbWUgaXMgYSBuYW1lIG9mIGEgJ21lJyB0b3BpYywgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIHN0YXRpYyBpc01lVG9waWNOYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gVG9waWMudG9waWNUeXBlKG5hbWUpID09IENvbnN0LlRPUElDX01FO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSBnaXZlbiB0b3BpYyBuYW1lIGlzIGEgbmFtZSBvZiBhIGdyb3VwIHRvcGljLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gdGVzdC5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIHRoZSBuYW1lIGlzIGEgbmFtZSBvZiBhIGdyb3VwIHRvcGljLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgc3RhdGljIGlzR3JvdXBUb3BpY05hbWUobmFtZSkge1xuICAgIHJldHVybiBUb3BpYy50b3BpY1R5cGUobmFtZSkgPT0gQ29uc3QuVE9QSUNfR1JQO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSBnaXZlbiB0b3BpYyBuYW1lIGlzIGEgbmFtZSBvZiBhIHAycCB0b3BpYy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIHRlc3QuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0aGUgbmFtZSBpcyBhIG5hbWUgb2YgYSBwMnAgdG9waWMsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBzdGF0aWMgaXNQMlBUb3BpY05hbWUobmFtZSkge1xuICAgIHJldHVybiBUb3BpYy50b3BpY1R5cGUobmFtZSkgPT0gQ29uc3QuVE9QSUNfUDJQO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSBnaXZlbiB0b3BpYyBuYW1lIGlzIGEgbmFtZSBvZiBhIGNvbW11bmljYXRpb24gdG9waWMsIGkuZS4gUDJQIG9yIGdyb3VwLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gdGVzdC5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIHRoZSBuYW1lIGlzIGEgbmFtZSBvZiBhIHAycCBvciBncm91cCB0b3BpYywgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIHN0YXRpYyBpc0NvbW1Ub3BpY05hbWUobmFtZSkge1xuICAgIHJldHVybiBUb3BpYy5pc1AyUFRvcGljTmFtZShuYW1lKSB8fCBUb3BpYy5pc0dyb3VwVG9waWNOYW1lKG5hbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSB0b3BpYyBuYW1lIGlzIGEgbmFtZSBvZiBhIG5ldyB0b3BpYy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIHRvcGljIG5hbWUgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIHtib29sZWFufSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0aGUgbmFtZSBpcyBhIG5hbWUgb2YgYSBuZXcgdG9waWMsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBzdGF0aWMgaXNOZXdHcm91cFRvcGljTmFtZShuYW1lKSB7XG4gICAgcmV0dXJuICh0eXBlb2YgbmFtZSA9PSAnc3RyaW5nJykgJiZcbiAgICAgIChuYW1lLnN1YnN0cmluZygwLCAzKSA9PSBDb25zdC5UT1BJQ19ORVcgfHwgbmFtZS5zdWJzdHJpbmcoMCwgMykgPT0gQ29uc3QuVE9QSUNfTkVXX0NIQU4pO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSB0b3BpYyBuYW1lIGlzIGEgbmFtZSBvZiBhIGNoYW5uZWwuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSB0b3BpYyBuYW1lIHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgdGhlIG5hbWUgaXMgYSBuYW1lIG9mIGEgY2hhbm5lbCwgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIHN0YXRpYyBpc0NoYW5uZWxUb3BpY05hbWUobmFtZSkge1xuICAgIHJldHVybiAodHlwZW9mIG5hbWUgPT0gJ3N0cmluZycpICYmXG4gICAgICAobmFtZS5zdWJzdHJpbmcoMCwgMykgPT0gQ29uc3QuVE9QSUNfQ0hBTiB8fCBuYW1lLnN1YnN0cmluZygwLCAzKSA9PSBDb25zdC5UT1BJQ19ORVdfQ0hBTik7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgdGhlIHRvcGljIGlzIHN1YnNjcmliZWQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlzIHRvcGljIGlzIGF0dGFjaGVkL3N1YnNjcmliZWQsIGZhbHNlIG90aGVyd2lzZS5cbiAgICovXG4gIGlzU3Vic2NyaWJlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fYXR0YWNoZWQ7XG4gIH1cblxuICAvKipcbiAgICogUmVxdWVzdCB0b3BpYyB0byBzdWJzY3JpYmUuIFdyYXBwZXIgZm9yIHtAbGluayBUaW5vZGUjc3Vic2NyaWJlfS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtUaW5vZGUuR2V0UXVlcnk9fSBnZXRQYXJhbXMgLSBnZXQgcXVlcnkgcGFyYW1ldGVycy5cbiAgICogQHBhcmFtIHtUaW5vZGUuU2V0UGFyYW1zPX0gc2V0UGFyYW1zIC0gc2V0IHBhcmFtZXRlcnMuXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHRvIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIHNlcnZlciByZXNwb25kcyB0byB0aGUgcmVxdWVzdC5cbiAgICovXG4gIHN1YnNjcmliZShnZXRQYXJhbXMsIHNldFBhcmFtcykge1xuICAgIC8vIENsZWFyIHJlcXVlc3QgdG8gbGVhdmUgdG9waWMuXG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuX2RlbGF5ZWRMZWF2ZVRpbWVyKTtcbiAgICB0aGlzLl9kZWxheWVkTGVhdmVUaW1lciA9IG51bGw7XG5cbiAgICAvLyBJZiB0aGUgdG9waWMgaXMgYWxyZWFkeSBzdWJzY3JpYmVkLCByZXR1cm4gcmVzb2x2ZWQgcHJvbWlzZVxuICAgIGlmICh0aGlzLl9hdHRhY2hlZCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzKTtcbiAgICB9XG5cbiAgICAvLyBJZiB0aGUgdG9waWMgaXMgZGVsZXRlZCwgcmVqZWN0IHN1YnNjcmlwdGlvbiByZXF1ZXN0cy5cbiAgICBpZiAodGhpcy5fZGVsZXRlZCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIkNvbnZlcnNhdGlvbiBkZWxldGVkXCIpKTtcbiAgICB9XG5cbiAgICAvLyBTZW5kIHN1YnNjcmliZSBtZXNzYWdlLCBoYW5kbGUgYXN5bmMgcmVzcG9uc2UuXG4gICAgLy8gSWYgdG9waWMgbmFtZSBpcyBleHBsaWNpdGx5IHByb3ZpZGVkLCB1c2UgaXQuIElmIG5vIG5hbWUsIHRoZW4gaXQncyBhIG5ldyBncm91cCB0b3BpYyxcbiAgICAvLyB1c2UgXCJuZXdcIi5cbiAgICByZXR1cm4gdGhpcy5fdGlub2RlLnN1YnNjcmliZSh0aGlzLm5hbWUgfHwgQ29uc3QuVE9QSUNfTkVXLCBnZXRQYXJhbXMsIHNldFBhcmFtcykudGhlbigoY3RybCkgPT4ge1xuICAgICAgaWYgKGN0cmwuY29kZSA+PSAzMDApIHtcbiAgICAgICAgLy8gRG8gbm90aGluZyBpZiBzdWJzY3JpcHRpb24gc3RhdHVzIGhhcyBub3QgY2hhbmdlZC5cbiAgICAgICAgcmV0dXJuIGN0cmw7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2F0dGFjaGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMuX2RlbGV0ZWQgPSBmYWxzZTtcbiAgICAgIHRoaXMuYWNzID0gKGN0cmwucGFyYW1zICYmIGN0cmwucGFyYW1zLmFjcykgPyBjdHJsLnBhcmFtcy5hY3MgOiB0aGlzLmFjcztcblxuICAgICAgLy8gU2V0IHRvcGljIG5hbWUgZm9yIG5ldyB0b3BpY3MgYW5kIGFkZCBpdCB0byBjYWNoZS5cbiAgICAgIGlmICh0aGlzLl9uZXcpIHtcbiAgICAgICAgZGVsZXRlIHRoaXMuX25ldztcblxuICAgICAgICBpZiAodGhpcy5uYW1lICE9IGN0cmwudG9waWMpIHtcbiAgICAgICAgICAvLyBOYW1lIG1heSBjaGFuZ2UgbmV3MTIzNDU2IC0+IGdycEFiQ2RFZi4gUmVtb3ZlIGZyb20gY2FjaGUgdW5kZXIgdGhlIG9sZCBuYW1lLlxuICAgICAgICAgIHRoaXMuX2NhY2hlRGVsU2VsZigpO1xuICAgICAgICAgIHRoaXMubmFtZSA9IGN0cmwudG9waWM7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fY2FjaGVQdXRTZWxmKCk7XG5cbiAgICAgICAgdGhpcy5jcmVhdGVkID0gY3RybC50cztcbiAgICAgICAgdGhpcy51cGRhdGVkID0gY3RybC50cztcblxuICAgICAgICBpZiAodGhpcy5uYW1lICE9IENvbnN0LlRPUElDX01FICYmIHRoaXMubmFtZSAhPSBDb25zdC5UT1BJQ19GTkQpIHtcbiAgICAgICAgICAvLyBBZGQgdGhlIG5ldyB0b3BpYyB0byB0aGUgbGlzdCBvZiBjb250YWN0cyBtYWludGFpbmVkIGJ5IHRoZSAnbWUnIHRvcGljLlxuICAgICAgICAgIGNvbnN0IG1lID0gdGhpcy5fdGlub2RlLmdldE1lVG9waWMoKTtcbiAgICAgICAgICBpZiAobWUub25NZXRhU3ViKSB7XG4gICAgICAgICAgICBtZS5vbk1ldGFTdWIodGhpcyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChtZS5vblN1YnNVcGRhdGVkKSB7XG4gICAgICAgICAgICBtZS5vblN1YnNVcGRhdGVkKFt0aGlzLm5hbWVdLCAxKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2V0UGFyYW1zICYmIHNldFBhcmFtcy5kZXNjKSB7XG4gICAgICAgICAgc2V0UGFyYW1zLmRlc2MuX25vRm9yd2FyZGluZyA9IHRydWU7XG4gICAgICAgICAgdGhpcy5fcHJvY2Vzc01ldGFEZXNjKHNldFBhcmFtcy5kZXNjKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGN0cmw7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgZHJhZnQgb2YgYSBtZXNzYWdlIHdpdGhvdXQgc2VuZGluZyBpdCB0byB0aGUgc2VydmVyLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZyB8IE9iamVjdH0gZGF0YSAtIENvbnRlbnQgdG8gd3JhcCBpbiBhIGRyYWZ0LlxuICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBub0VjaG8gLSBJZiA8Y29kZT50cnVlPC9jb2RlPiBzZXJ2ZXIgd2lsbCBub3QgZWNobyBtZXNzYWdlIGJhY2sgdG8gb3JpZ2luYXRpbmdcbiAgICogc2Vzc2lvbi4gT3RoZXJ3aXNlIHRoZSBzZXJ2ZXIgd2lsbCBzZW5kIGEgY29weSBvZiB0aGUgbWVzc2FnZSB0byBzZW5kZXIuXG4gICAqXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IG1lc3NhZ2UgZHJhZnQuXG4gICAqL1xuICBjcmVhdGVNZXNzYWdlKGRhdGEsIG5vRWNobykge1xuICAgIHJldHVybiB0aGlzLl90aW5vZGUuY3JlYXRlTWVzc2FnZSh0aGlzLm5hbWUsIGRhdGEsIG5vRWNobyk7XG4gIH1cbiAgLyoqXG4gICAqIEltbWVkaWF0ZWx5IHB1Ymxpc2ggZGF0YSB0byB0b3BpYy4gV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNwdWJsaXNofS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmcgfCBPYmplY3R9IGRhdGEgLSBEYXRhIHRvIHB1Ymxpc2gsIGVpdGhlciBwbGFpbiBzdHJpbmcgb3IgYSBEcmFmdHkgb2JqZWN0LlxuICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBub0VjaG8gLSBJZiA8Y29kZT50cnVlPC9jb2RlPiBzZXJ2ZXIgd2lsbCBub3QgZWNobyBtZXNzYWdlIGJhY2sgdG8gb3JpZ2luYXRpbmdcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgdG8gYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgc2VydmVyIHJlc3BvbmRzIHRvIHRoZSByZXF1ZXN0LlxuICAgKi9cbiAgcHVibGlzaChkYXRhLCBub0VjaG8pIHtcbiAgICByZXR1cm4gdGhpcy5wdWJsaXNoTWVzc2FnZSh0aGlzLmNyZWF0ZU1lc3NhZ2UoZGF0YSwgbm9FY2hvKSk7XG4gIH1cbiAgLyoqXG4gICAqIFB1Ymxpc2ggbWVzc2FnZSBjcmVhdGVkIGJ5IHtAbGluayBUaW5vZGUuVG9waWMjY3JlYXRlTWVzc2FnZX0uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwdWIgLSB7ZGF0YX0gb2JqZWN0IHRvIHB1Ymxpc2guIE11c3QgYmUgY3JlYXRlZCBieSB7QGxpbmsgVGlub2RlLlRvcGljI2NyZWF0ZU1lc3NhZ2V9XG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHRvIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIHNlcnZlciByZXNwb25kcyB0byB0aGUgcmVxdWVzdC5cbiAgICovXG4gIHB1Ymxpc2hNZXNzYWdlKHB1Yikge1xuICAgIGlmICghdGhpcy5fYXR0YWNoZWQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJDYW5ub3QgcHVibGlzaCBvbiBpbmFjdGl2ZSB0b3BpY1wiKSk7XG4gICAgfVxuICAgIGlmICh0aGlzLl9zZW5kaW5nKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiVGhlIG1lc3NhZ2UgaXMgYWxyZWFkeSBiZWluZyBzZW50XCIpKTtcbiAgICB9XG5cbiAgICAvLyBTZW5kIGRhdGEuXG4gICAgcHViLl9zZW5kaW5nID0gdHJ1ZTtcbiAgICBwdWIuX2ZhaWxlZCA9IGZhbHNlO1xuXG4gICAgLy8gRXh0cmFjdCByZWZlcmVjZXMgdG8gYXR0YWNobWVudHMgYW5kIG91dCBvZiBiYW5kIGltYWdlIHJlY29yZHMuXG4gICAgbGV0IGF0dGFjaG1lbnRzID0gbnVsbDtcbiAgICBpZiAoRHJhZnR5Lmhhc0VudGl0aWVzKHB1Yi5jb250ZW50KSkge1xuICAgICAgYXR0YWNobWVudHMgPSBbXTtcbiAgICAgIERyYWZ0eS5lbnRpdGllcyhwdWIuY29udGVudCwgKGRhdGEpID0+IHtcbiAgICAgICAgaWYgKGRhdGEgJiYgZGF0YS5yZWYpIHtcbiAgICAgICAgICBhdHRhY2htZW50cy5wdXNoKGRhdGEucmVmKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBpZiAoYXR0YWNobWVudHMubGVuZ3RoID09IDApIHtcbiAgICAgICAgYXR0YWNobWVudHMgPSBudWxsO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl90aW5vZGUucHVibGlzaE1lc3NhZ2UocHViLCBhdHRhY2htZW50cykudGhlbigoY3RybCkgPT4ge1xuICAgICAgcHViLl9zZW5kaW5nID0gZmFsc2U7XG4gICAgICBwdWIudHMgPSBjdHJsLnRzO1xuICAgICAgdGhpcy5zd2FwTWVzc2FnZUlkKHB1YiwgY3RybC5wYXJhbXMuc2VxKTtcbiAgICAgIHRoaXMuX3JvdXRlRGF0YShwdWIpO1xuICAgICAgcmV0dXJuIGN0cmw7XG4gICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgdGhpcy5fdGlub2RlLmxvZ2dlcihcIldBUk5JTkc6IE1lc3NhZ2UgcmVqZWN0ZWQgYnkgdGhlIHNlcnZlclwiLCBlcnIpO1xuICAgICAgcHViLl9zZW5kaW5nID0gZmFsc2U7XG4gICAgICBwdWIuX2ZhaWxlZCA9IHRydWU7XG4gICAgICBpZiAodGhpcy5vbkRhdGEpIHtcbiAgICAgICAgdGhpcy5vbkRhdGEoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICAvKipcbiAgICogQWRkIG1lc3NhZ2UgdG8gbG9jYWwgbWVzc2FnZSBjYWNoZSwgc2VuZCB0byB0aGUgc2VydmVyIHdoZW4gdGhlIHByb21pc2UgaXMgcmVzb2x2ZWQuXG4gICAqIElmIHByb21pc2UgaXMgbnVsbCBvciB1bmRlZmluZWQsIHRoZSBtZXNzYWdlIHdpbGwgYmUgc2VudCBpbW1lZGlhdGVseS5cbiAgICogVGhlIG1lc3NhZ2UgaXMgc2VudCB3aGVuIHRoZVxuICAgKiBUaGUgbWVzc2FnZSBzaG91bGQgYmUgY3JlYXRlZCBieSB7QGxpbmsgVGlub2RlLlRvcGljI2NyZWF0ZU1lc3NhZ2V9LlxuICAgKiBUaGlzIGlzIHByb2JhYmx5IG5vdCB0aGUgZmluYWwgQVBJLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcHViIC0gTWVzc2FnZSB0byB1c2UgYXMgYSBkcmFmdC5cbiAgICogQHBhcmFtIHtQcm9taXNlfSBwcm9tIC0gTWVzc2FnZSB3aWxsIGJlIHNlbnQgd2hlbiB0aGlzIHByb21pc2UgaXMgcmVzb2x2ZWQsIGRpc2NhcmRlZCBpZiByZWplY3RlZC5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IGRlcml2ZWQgcHJvbWlzZS5cbiAgICovXG4gIHB1Ymxpc2hEcmFmdChwdWIsIHByb20pIHtcbiAgICBjb25zdCBzZXEgPSBwdWIuc2VxIHx8IHRoaXMuX2dldFF1ZXVlZFNlcUlkKCk7XG4gICAgaWYgKCFwdWIuX25vRm9yd2FyZGluZykge1xuICAgICAgLy8gVGhlICdzZXEnLCAndHMnLCBhbmQgJ2Zyb20nIGFyZSBhZGRlZCB0byBtaW1pYyB7ZGF0YX0uIFRoZXkgYXJlIHJlbW92ZWQgbGF0ZXJcbiAgICAgIC8vIGJlZm9yZSB0aGUgbWVzc2FnZSBpcyBzZW50LlxuICAgICAgcHViLl9ub0ZvcndhcmRpbmcgPSB0cnVlO1xuICAgICAgcHViLnNlcSA9IHNlcTtcbiAgICAgIHB1Yi50cyA9IG5ldyBEYXRlKCk7XG4gICAgICBwdWIuZnJvbSA9IHRoaXMuX3Rpbm9kZS5nZXRDdXJyZW50VXNlcklEKCk7XG5cbiAgICAgIC8vIERvbid0IG5lZWQgYW4gZWNobyBtZXNzYWdlIGJlY2F1c2UgdGhlIG1lc3NhZ2UgaXMgYWRkZWQgdG8gbG9jYWwgY2FjaGUgcmlnaHQgYXdheS5cbiAgICAgIHB1Yi5ub2VjaG8gPSB0cnVlO1xuICAgICAgLy8gQWRkIHRvIGNhY2hlLlxuICAgICAgdGhpcy5fbWVzc2FnZXMucHV0KHB1Yik7XG4gICAgICB0aGlzLl90aW5vZGUuX2RiLmFkZE1lc3NhZ2UocHViKTtcblxuICAgICAgaWYgKHRoaXMub25EYXRhKSB7XG4gICAgICAgIHRoaXMub25EYXRhKHB1Yik7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIElmIHByb21pc2UgaXMgcHJvdmlkZWQsIHNlbmQgdGhlIHF1ZXVlZCBtZXNzYWdlIHdoZW4gaXQncyByZXNvbHZlZC5cbiAgICAvLyBJZiBubyBwcm9taXNlIGlzIHByb3ZpZGVkLCBjcmVhdGUgYSByZXNvbHZlZCBvbmUgYW5kIHNlbmQgaW1tZWRpYXRlbHkuXG4gICAgcmV0dXJuIChwcm9tIHx8IFByb21pc2UucmVzb2x2ZSgpKVxuICAgICAgLnRoZW4oXyA9PiB7XG4gICAgICAgIGlmIChwdWIuX2NhbmNlbGxlZCkge1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb2RlOiAzMDAsXG4gICAgICAgICAgICB0ZXh0OiBcImNhbmNlbGxlZFwiXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5wdWJsaXNoTWVzc2FnZShwdWIpO1xuICAgICAgfSkuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgdGhpcy5fdGlub2RlLmxvZ2dlcihcIldBUk5JTkc6IE1lc3NhZ2UgZHJhZnQgcmVqZWN0ZWRcIiwgZXJyKTtcbiAgICAgICAgcHViLl9zZW5kaW5nID0gZmFsc2U7XG4gICAgICAgIHB1Yi5fZmFpbGVkID0gdHJ1ZTtcbiAgICAgICAgaWYgKHRoaXMub25EYXRhKSB7XG4gICAgICAgICAgdGhpcy5vbkRhdGEoKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBSZXRocm93IHRvIGxldCBjYWxsZXIga25vdyB0aGF0IHRoZSBvcGVyYXRpb24gZmFpbGVkLlxuICAgICAgICB0aHJvdyBlcnI7XG4gICAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMZWF2ZSB0aGUgdG9waWMsIG9wdGlvbmFsbHkgdW5zaWJzY3JpYmUuIExlYXZpbmcgdGhlIHRvcGljIG1lYW5zIHRoZSB0b3BpYyB3aWxsIHN0b3BcbiAgICogcmVjZWl2aW5nIHVwZGF0ZXMgZnJvbSB0aGUgc2VydmVyLiBVbnN1YnNjcmliaW5nIHdpbGwgdGVybWluYXRlIHVzZXIncyByZWxhdGlvbnNoaXAgd2l0aCB0aGUgdG9waWMuXG4gICAqIFdyYXBwZXIgZm9yIHtAbGluayBUaW5vZGUjbGVhdmV9LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW49fSB1bnN1YiAtIElmIHRydWUsIHVuc3Vic2NyaWJlLCBvdGhlcndpc2UganVzdCBsZWF2ZS5cbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgdG8gYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgc2VydmVyIHJlc3BvbmRzIHRvIHRoZSByZXF1ZXN0LlxuICAgKi9cbiAgbGVhdmUodW5zdWIpIHtcbiAgICAvLyBJdCdzIHBvc3NpYmxlIHRvIHVuc3Vic2NyaWJlICh1bnN1Yj09dHJ1ZSkgZnJvbSBpbmFjdGl2ZSB0b3BpYy5cbiAgICBpZiAoIXRoaXMuX2F0dGFjaGVkICYmICF1bnN1Yikge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIkNhbm5vdCBsZWF2ZSBpbmFjdGl2ZSB0b3BpY1wiKSk7XG4gICAgfVxuXG4gICAgLy8gU2VuZCBhICdsZWF2ZScgbWVzc2FnZSwgaGFuZGxlIGFzeW5jIHJlc3BvbnNlXG4gICAgcmV0dXJuIHRoaXMuX3Rpbm9kZS5sZWF2ZSh0aGlzLm5hbWUsIHVuc3ViKS50aGVuKChjdHJsKSA9PiB7XG4gICAgICB0aGlzLl9yZXNldFN1YigpO1xuICAgICAgaWYgKHVuc3ViKSB7XG4gICAgICAgIHRoaXMuX2dvbmUoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjdHJsO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIExlYXZlIHRoZSB0b3BpYywgb3B0aW9uYWxseSB1bnNpYnNjcmliZSBhZnRlciBhIGRlbGF5LiBMZWF2aW5nIHRoZSB0b3BpYyBtZWFucyB0aGUgdG9waWMgd2lsbCBzdG9wXG4gICAqIHJlY2VpdmluZyB1cGRhdGVzIGZyb20gdGhlIHNlcnZlci4gVW5zdWJzY3JpYmluZyB3aWxsIHRlcm1pbmF0ZSB1c2VyJ3MgcmVsYXRpb25zaGlwIHdpdGggdGhlIHRvcGljLlxuICAgKiBXcmFwcGVyIGZvciB7QGxpbmsgVGlub2RlI2xlYXZlfS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSB1bnN1YiAtIElmIHRydWUsIHVuc3Vic2NyaWJlLCBvdGhlcndpc2UganVzdCBsZWF2ZS5cbiAgICogQHBhcmFtIHtudW1iZXJ9IGRlbGF5IC0gdGltZSBpbiBtaWxsaXNlY29uZHMgdG8gZGVsYXkgbGVhdmUgcmVxdWVzdC5cbiAgICovXG4gIGxlYXZlRGVsYXllZCh1bnN1YiwgZGVsYXkpIHtcbiAgICBjbGVhclRpbWVvdXQodGhpcy5fZGVsYXllZExlYXZlVGltZXIpO1xuICAgIHRoaXMuX2RlbGF5ZWRMZWF2ZVRpbWVyID0gc2V0VGltZW91dChfID0+IHtcbiAgICAgIHRoaXMuX2RlbGF5ZWRMZWF2ZVRpbWVyID0gbnVsbDtcbiAgICAgIHRoaXMubGVhdmUodW5zdWIpXG4gICAgfSwgZGVsYXkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcXVlc3QgdG9waWMgbWV0YWRhdGEgZnJvbSB0aGUgc2VydmVyLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge1Rpbm9kZS5HZXRRdWVyeX0gcmVxdWVzdCBwYXJhbWV0ZXJzXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHRvIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIHNlcnZlciByZXNwb25kcyB0byByZXF1ZXN0LlxuICAgKi9cbiAgZ2V0TWV0YShwYXJhbXMpIHtcbiAgICAvLyBTZW5kIHtnZXR9IG1lc3NhZ2UsIHJldHVybiBwcm9taXNlLlxuICAgIHJldHVybiB0aGlzLl90aW5vZGUuZ2V0TWV0YSh0aGlzLm5hbWUsIHBhcmFtcyk7XG4gIH1cblxuICAvKipcbiAgICogUmVxdWVzdCBtb3JlIG1lc3NhZ2VzIGZyb20gdGhlIHNlcnZlclxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gbGltaXQgbnVtYmVyIG9mIG1lc3NhZ2VzIHRvIGdldC5cbiAgICogQHBhcmFtIHtib29sZWFufSBmb3J3YXJkIGlmIHRydWUsIHJlcXVlc3QgbmV3ZXIgbWVzc2FnZXMuXG4gICAqL1xuICBnZXRNZXNzYWdlc1BhZ2UobGltaXQsIGZvcndhcmQpIHtcbiAgICBsZXQgcXVlcnkgPSBmb3J3YXJkID9cbiAgICAgIHRoaXMuc3RhcnRNZXRhUXVlcnkoKS53aXRoTGF0ZXJEYXRhKGxpbWl0KSA6XG4gICAgICB0aGlzLnN0YXJ0TWV0YVF1ZXJ5KCkud2l0aEVhcmxpZXJEYXRhKGxpbWl0KTtcblxuICAgIC8vIEZpcnN0IHRyeSBmZXRjaGluZyBmcm9tIERCLCB0aGVuIGZyb20gdGhlIHNlcnZlci5cbiAgICByZXR1cm4gdGhpcy5fbG9hZE1lc3NhZ2VzKHRoaXMuX3Rpbm9kZS5fZGIsIHF1ZXJ5LmV4dHJhY3QoJ2RhdGEnKSlcbiAgICAgIC50aGVuKChjb3VudCkgPT4ge1xuICAgICAgICBpZiAoY291bnQgPT0gbGltaXQpIHtcbiAgICAgICAgICAvLyBHb3QgZW5vdWdoIG1lc3NhZ2VzIGZyb20gbG9jYWwgY2FjaGUuXG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7XG4gICAgICAgICAgICB0b3BpYzogdGhpcy5uYW1lLFxuICAgICAgICAgICAgY29kZTogMjAwLFxuICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgIGNvdW50OiBjb3VudFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmVkdWNlIHRoZSBjb3VudCBvZiByZXF1ZXN0ZWQgbWVzc2FnZXMuXG4gICAgICAgIGxpbWl0IC09IGNvdW50O1xuICAgICAgICAvLyBVcGRhdGUgcXVlcnkgd2l0aCBuZXcgdmFsdWVzIGxvYWRlZCBmcm9tIERCLlxuICAgICAgICBxdWVyeSA9IGZvcndhcmQgPyB0aGlzLnN0YXJ0TWV0YVF1ZXJ5KCkud2l0aExhdGVyRGF0YShsaW1pdCkgOlxuICAgICAgICAgIHRoaXMuc3RhcnRNZXRhUXVlcnkoKS53aXRoRWFybGllckRhdGEobGltaXQpO1xuICAgICAgICBsZXQgcHJvbWlzZSA9IHRoaXMuZ2V0TWV0YShxdWVyeS5idWlsZCgpKTtcbiAgICAgICAgaWYgKCFmb3J3YXJkKSB7XG4gICAgICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoY3RybCkgPT4ge1xuICAgICAgICAgICAgaWYgKGN0cmwgJiYgY3RybC5wYXJhbXMgJiYgIWN0cmwucGFyYW1zLmNvdW50KSB7XG4gICAgICAgICAgICAgIHRoaXMuX25vRWFybGllck1zZ3MgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgfSk7XG4gIH1cbiAgLyoqXG4gICAqIFVwZGF0ZSB0b3BpYyBtZXRhZGF0YS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtUaW5vZGUuU2V0UGFyYW1zfSBwYXJhbXMgcGFyYW1ldGVycyB0byB1cGRhdGUuXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHRvIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIHNlcnZlciByZXNwb25kcyB0byByZXF1ZXN0LlxuICAgKi9cbiAgc2V0TWV0YShwYXJhbXMpIHtcbiAgICBpZiAocGFyYW1zLnRhZ3MpIHtcbiAgICAgIHBhcmFtcy50YWdzID0gbm9ybWFsaXplQXJyYXkocGFyYW1zLnRhZ3MpO1xuICAgIH1cbiAgICAvLyBTZW5kIFNldCBtZXNzYWdlLCBoYW5kbGUgYXN5bmMgcmVzcG9uc2UuXG4gICAgcmV0dXJuIHRoaXMuX3Rpbm9kZS5zZXRNZXRhKHRoaXMubmFtZSwgcGFyYW1zKVxuICAgICAgLnRoZW4oKGN0cmwpID0+IHtcbiAgICAgICAgaWYgKGN0cmwgJiYgY3RybC5jb2RlID49IDMwMCkge1xuICAgICAgICAgIC8vIE5vdCBtb2RpZmllZFxuICAgICAgICAgIHJldHVybiBjdHJsO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHBhcmFtcy5zdWIpIHtcbiAgICAgICAgICBwYXJhbXMuc3ViLnRvcGljID0gdGhpcy5uYW1lO1xuICAgICAgICAgIGlmIChjdHJsLnBhcmFtcyAmJiBjdHJsLnBhcmFtcy5hY3MpIHtcbiAgICAgICAgICAgIHBhcmFtcy5zdWIuYWNzID0gY3RybC5wYXJhbXMuYWNzO1xuICAgICAgICAgICAgcGFyYW1zLnN1Yi51cGRhdGVkID0gY3RybC50cztcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCFwYXJhbXMuc3ViLnVzZXIpIHtcbiAgICAgICAgICAgIC8vIFRoaXMgaXMgYSBzdWJzY3JpcHRpb24gdXBkYXRlIG9mIHRoZSBjdXJyZW50IHVzZXIuXG4gICAgICAgICAgICAvLyBBc3NpZ24gdXNlciBJRCBvdGhlcndpc2UgdGhlIHVwZGF0ZSB3aWxsIGJlIGlnbm9yZWQgYnkgX3Byb2Nlc3NNZXRhU3ViLlxuICAgICAgICAgICAgcGFyYW1zLnN1Yi51c2VyID0gdGhpcy5fdGlub2RlLmdldEN1cnJlbnRVc2VySUQoKTtcbiAgICAgICAgICAgIGlmICghcGFyYW1zLmRlc2MpIHtcbiAgICAgICAgICAgICAgLy8gRm9yY2UgdXBkYXRlIHRvIHRvcGljJ3MgYXNjLlxuICAgICAgICAgICAgICBwYXJhbXMuZGVzYyA9IHt9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBwYXJhbXMuc3ViLl9ub0ZvcndhcmRpbmcgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuX3Byb2Nlc3NNZXRhU3ViKFtwYXJhbXMuc3ViXSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocGFyYW1zLmRlc2MpIHtcbiAgICAgICAgICBpZiAoY3RybC5wYXJhbXMgJiYgY3RybC5wYXJhbXMuYWNzKSB7XG4gICAgICAgICAgICBwYXJhbXMuZGVzYy5hY3MgPSBjdHJsLnBhcmFtcy5hY3M7XG4gICAgICAgICAgICBwYXJhbXMuZGVzYy51cGRhdGVkID0gY3RybC50cztcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5fcHJvY2Vzc01ldGFEZXNjKHBhcmFtcy5kZXNjKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwYXJhbXMudGFncykge1xuICAgICAgICAgIHRoaXMuX3Byb2Nlc3NNZXRhVGFncyhwYXJhbXMudGFncyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhcmFtcy5jcmVkKSB7XG4gICAgICAgICAgdGhpcy5fcHJvY2Vzc01ldGFDcmVkcyhbcGFyYW1zLmNyZWRdLCB0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjdHJsO1xuICAgICAgfSk7XG4gIH1cbiAgLyoqXG4gICAqIFVwZGF0ZSBhY2Nlc3MgbW9kZSBvZiB0aGUgY3VycmVudCB1c2VyIG9yIG9mIGFub3RoZXIgdG9waWMgc3Vic3JpYmVyLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdWlkIC0gVUlEIG9mIHRoZSB1c2VyIHRvIHVwZGF0ZSBvciBudWxsIHRvIHVwZGF0ZSBjdXJyZW50IHVzZXIuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1cGRhdGUgLSB0aGUgdXBkYXRlIHZhbHVlLCBmdWxsIG9yIGRlbHRhLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBzZXJ2ZXIgcmVzcG9uZHMgdG8gcmVxdWVzdC5cbiAgICovXG4gIHVwZGF0ZU1vZGUodWlkLCB1cGRhdGUpIHtcbiAgICBjb25zdCB1c2VyID0gdWlkID8gdGhpcy5zdWJzY3JpYmVyKHVpZCkgOiBudWxsO1xuICAgIGNvbnN0IGFtID0gdXNlciA/XG4gICAgICB1c2VyLmFjcy51cGRhdGVHaXZlbih1cGRhdGUpLmdldEdpdmVuKCkgOlxuICAgICAgdGhpcy5nZXRBY2Nlc3NNb2RlKCkudXBkYXRlV2FudCh1cGRhdGUpLmdldFdhbnQoKTtcblxuICAgIHJldHVybiB0aGlzLnNldE1ldGEoe1xuICAgICAgc3ViOiB7XG4gICAgICAgIHVzZXI6IHVpZCxcbiAgICAgICAgbW9kZTogYW1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICAvKipcbiAgICogQ3JlYXRlIG5ldyB0b3BpYyBzdWJzY3JpcHRpb24uIFdyYXBwZXIgZm9yIHtAbGluayBUaW5vZGUjc2V0TWV0YX0uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1aWQgLSBJRCBvZiB0aGUgdXNlciB0byBpbnZpdGVcbiAgICogQHBhcmFtIHtzdHJpbmc9fSBtb2RlIC0gQWNjZXNzIG1vZGUuIDxjb2RlPm51bGw8L2NvZGU+IG1lYW5zIHRvIHVzZSBkZWZhdWx0LlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBzZXJ2ZXIgcmVzcG9uZHMgdG8gcmVxdWVzdC5cbiAgICovXG4gIGludml0ZSh1aWQsIG1vZGUpIHtcbiAgICByZXR1cm4gdGhpcy5zZXRNZXRhKHtcbiAgICAgIHN1Yjoge1xuICAgICAgICB1c2VyOiB1aWQsXG4gICAgICAgIG1vZGU6IG1vZGVcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICAvKipcbiAgICogQXJjaGl2ZSBvciB1bi1hcmNoaXZlIHRoZSB0b3BpYy4gV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNzZXRNZXRhfS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSBhcmNoIC0gdHJ1ZSB0byBhcmNoaXZlIHRoZSB0b3BpYywgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBzZXJ2ZXIgcmVzcG9uZHMgdG8gcmVxdWVzdC5cbiAgICovXG4gIGFyY2hpdmUoYXJjaCkge1xuICAgIGlmICh0aGlzLnByaXZhdGUgJiYgKCF0aGlzLnByaXZhdGUuYXJjaCA9PSAhYXJjaCkpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoYXJjaCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNldE1ldGEoe1xuICAgICAgZGVzYzoge1xuICAgICAgICBwcml2YXRlOiB7XG4gICAgICAgICAgYXJjaDogYXJjaCA/IHRydWUgOiBDb25zdC5ERUxfQ0hBUlxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgLyoqXG4gICAqIERlbGV0ZSBtZXNzYWdlcy4gSGFyZC1kZWxldGluZyBtZXNzYWdlcyByZXF1aXJlcyBPd25lciBwZXJtaXNzaW9uLlxuICAgKiBXcmFwcGVyIGZvciB7QGxpbmsgVGlub2RlI2RlbE1lc3NhZ2VzfS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtUaW5vZGUuRGVsUmFuZ2VbXX0gcmFuZ2VzIC0gUmFuZ2VzIG9mIG1lc3NhZ2UgSURzIHRvIGRlbGV0ZS5cbiAgICogQHBhcmFtIHtib29sZWFuPX0gaGFyZCAtIEhhcmQgb3Igc29mdCBkZWxldGVcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgdG8gYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgc2VydmVyIHJlc3BvbmRzIHRvIHJlcXVlc3QuXG4gICAqL1xuICBkZWxNZXNzYWdlcyhyYW5nZXMsIGhhcmQpIHtcbiAgICBpZiAoIXRoaXMuX2F0dGFjaGVkKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiQ2Fubm90IGRlbGV0ZSBtZXNzYWdlcyBpbiBpbmFjdGl2ZSB0b3BpY1wiKSk7XG4gICAgfVxuXG4gICAgLy8gU29ydCByYW5nZXMgaW4gYWNjZW5kaW5nIG9yZGVyIGJ5IGxvdywgdGhlIGRlc2NlbmRpbmcgYnkgaGkuXG4gICAgcmFuZ2VzLnNvcnQoKHIxLCByMikgPT4ge1xuICAgICAgaWYgKHIxLmxvdyA8IHIyLmxvdykge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGlmIChyMS5sb3cgPT0gcjIubG93KSB7XG4gICAgICAgIHJldHVybiAhcjIuaGkgfHwgKHIxLmhpID49IHIyLmhpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KTtcblxuICAgIC8vIFJlbW92ZSBwZW5kaW5nIG1lc3NhZ2VzIGZyb20gcmFuZ2VzIHBvc3NpYmx5IGNsaXBwaW5nIHNvbWUgcmFuZ2VzLlxuICAgIGxldCB0b3NlbmQgPSByYW5nZXMucmVkdWNlKChvdXQsIHIpID0+IHtcbiAgICAgIGlmIChyLmxvdyA8IENvbnN0LkxPQ0FMX1NFUUlEKSB7XG4gICAgICAgIGlmICghci5oaSB8fCByLmhpIDwgQ29uc3QuTE9DQUxfU0VRSUQpIHtcbiAgICAgICAgICBvdXQucHVzaChyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBDbGlwIGhpIHRvIG1heCBhbGxvd2VkIHZhbHVlLlxuICAgICAgICAgIG91dC5wdXNoKHtcbiAgICAgICAgICAgIGxvdzogci5sb3csXG4gICAgICAgICAgICBoaTogdGhpcy5fbWF4U2VxICsgMVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gb3V0O1xuICAgIH0sIFtdKTtcblxuICAgIC8vIFNlbmQge2RlbH0gbWVzc2FnZSwgcmV0dXJuIHByb21pc2VcbiAgICBsZXQgcmVzdWx0O1xuICAgIGlmICh0b3NlbmQubGVuZ3RoID4gMCkge1xuICAgICAgcmVzdWx0ID0gdGhpcy5fdGlub2RlLmRlbE1lc3NhZ2VzKHRoaXMubmFtZSwgdG9zZW5kLCBoYXJkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0ID0gUHJvbWlzZS5yZXNvbHZlKHtcbiAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgZGVsOiAwXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICAvLyBVcGRhdGUgbG9jYWwgY2FjaGUuXG4gICAgcmV0dXJuIHJlc3VsdC50aGVuKChjdHJsKSA9PiB7XG4gICAgICBpZiAoY3RybC5wYXJhbXMuZGVsID4gdGhpcy5fbWF4RGVsKSB7XG4gICAgICAgIHRoaXMuX21heERlbCA9IGN0cmwucGFyYW1zLmRlbDtcbiAgICAgIH1cblxuICAgICAgcmFuZ2VzLmZvckVhY2goKHIpID0+IHtcbiAgICAgICAgaWYgKHIuaGkpIHtcbiAgICAgICAgICB0aGlzLmZsdXNoTWVzc2FnZVJhbmdlKHIubG93LCByLmhpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmZsdXNoTWVzc2FnZShyLmxvdyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLl91cGRhdGVEZWxldGVkUmFuZ2VzKCk7XG5cbiAgICAgIGlmICh0aGlzLm9uRGF0YSkge1xuICAgICAgICAvLyBDYWxsaW5nIHdpdGggbm8gcGFyYW1ldGVycyB0byBpbmRpY2F0ZSB0aGUgbWVzc2FnZXMgd2VyZSBkZWxldGVkLlxuICAgICAgICB0aGlzLm9uRGF0YSgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGN0cmw7XG4gICAgfSk7XG4gIH1cbiAgLyoqXG4gICAqIERlbGV0ZSBhbGwgbWVzc2FnZXMuIEhhcmQtZGVsZXRpbmcgbWVzc2FnZXMgcmVxdWlyZXMgT3duZXIgcGVybWlzc2lvbi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSBoYXJkRGVsIC0gdHJ1ZSBpZiBtZXNzYWdlcyBzaG91bGQgYmUgaGFyZC1kZWxldGVkLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBzZXJ2ZXIgcmVzcG9uZHMgdG8gcmVxdWVzdC5cbiAgICovXG4gIGRlbE1lc3NhZ2VzQWxsKGhhcmREZWwpIHtcbiAgICBpZiAoIXRoaXMuX21heFNlcSB8fCB0aGlzLl9tYXhTZXEgPD0gMCkge1xuICAgICAgLy8gVGhlcmUgYXJlIG5vIG1lc3NhZ2VzIHRvIGRlbGV0ZS5cbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZGVsTWVzc2FnZXMoW3tcbiAgICAgIGxvdzogMSxcbiAgICAgIGhpOiB0aGlzLl9tYXhTZXEgKyAxLFxuICAgICAgX2FsbDogdHJ1ZVxuICAgIH1dLCBoYXJkRGVsKTtcbiAgfVxuICAvKipcbiAgICogRGVsZXRlIG11bHRpcGxlIG1lc3NhZ2VzIGRlZmluZWQgYnkgdGhlaXIgSURzLiBIYXJkLWRlbGV0aW5nIG1lc3NhZ2VzIHJlcXVpcmVzIE93bmVyIHBlcm1pc3Npb24uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7VGlub2RlLkRlbFJhbmdlW119IGxpc3QgLSBsaXN0IG9mIHNlcSBJRHMgdG8gZGVsZXRlXG4gICAqIEBwYXJhbSB7Ym9vbGVhbj19IGhhcmREZWwgLSB0cnVlIGlmIG1lc3NhZ2VzIHNob3VsZCBiZSBoYXJkLWRlbGV0ZWQuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHRvIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIHNlcnZlciByZXNwb25kcyB0byByZXF1ZXN0LlxuICAgKi9cbiAgZGVsTWVzc2FnZXNMaXN0KGxpc3QsIGhhcmREZWwpIHtcbiAgICAvLyBTb3J0IHRoZSBsaXN0IGluIGFzY2VuZGluZyBvcmRlclxuICAgIGxpc3Quc29ydCgoYSwgYikgPT4gYSAtIGIpO1xuICAgIC8vIENvbnZlcnQgdGhlIGFycmF5IG9mIElEcyB0byByYW5nZXMuXG4gICAgbGV0IHJhbmdlcyA9IGxpc3QucmVkdWNlKChvdXQsIGlkKSA9PiB7XG4gICAgICBpZiAob3V0Lmxlbmd0aCA9PSAwKSB7XG4gICAgICAgIC8vIEZpcnN0IGVsZW1lbnQuXG4gICAgICAgIG91dC5wdXNoKHtcbiAgICAgICAgICBsb3c6IGlkXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IHByZXYgPSBvdXRbb3V0Lmxlbmd0aCAtIDFdO1xuICAgICAgICBpZiAoKCFwcmV2LmhpICYmIChpZCAhPSBwcmV2LmxvdyArIDEpKSB8fCAoaWQgPiBwcmV2LmhpKSkge1xuICAgICAgICAgIC8vIE5ldyByYW5nZS5cbiAgICAgICAgICBvdXQucHVzaCh7XG4gICAgICAgICAgICBsb3c6IGlkXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gRXhwYW5kIGV4aXN0aW5nIHJhbmdlLlxuICAgICAgICAgIHByZXYuaGkgPSBwcmV2LmhpID8gTWF0aC5tYXgocHJldi5oaSwgaWQgKyAxKSA6IGlkICsgMTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG91dDtcbiAgICB9LCBbXSk7XG4gICAgLy8gU2VuZCB7ZGVsfSBtZXNzYWdlLCByZXR1cm4gcHJvbWlzZVxuICAgIHJldHVybiB0aGlzLmRlbE1lc3NhZ2VzKHJhbmdlcywgaGFyZERlbCk7XG4gIH1cbiAgLyoqXG4gICAqIERlbGV0ZSB0b3BpYy4gUmVxdWlyZXMgT3duZXIgcGVybWlzc2lvbi4gV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNkZWxUb3BpY30uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gaGFyZCAtIGhhZC1kZWxldGUgdG9waWMuXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHRvIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIHNlcnZlciByZXNwb25kcyB0byB0aGUgcmVxdWVzdC5cbiAgICovXG4gIGRlbFRvcGljKGhhcmQpIHtcbiAgICBpZiAodGhpcy5fZGVsZXRlZCkge1xuICAgICAgLy8gVGhlIHRvcGljIGlzIGFscmVhZHkgZGVsZXRlZCBhdCB0aGUgc2VydmVyLCBqdXN0IHJlbW92ZSBmcm9tIERCLlxuICAgICAgdGhpcy5fZ29uZSgpO1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShudWxsKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fdGlub2RlLmRlbFRvcGljKHRoaXMubmFtZSwgaGFyZCkudGhlbigoY3RybCkgPT4ge1xuICAgICAgdGhpcy5fZGVsZXRlZCA9IHRydWU7XG4gICAgICB0aGlzLl9yZXNldFN1YigpO1xuICAgICAgdGhpcy5fZ29uZSgpO1xuICAgICAgcmV0dXJuIGN0cmw7XG4gICAgfSk7XG4gIH1cbiAgLyoqXG4gICAqIERlbGV0ZSBzdWJzY3JpcHRpb24uIFJlcXVpcmVzIFNoYXJlIHBlcm1pc3Npb24uIFdyYXBwZXIgZm9yIHtAbGluayBUaW5vZGUjZGVsU3Vic2NyaXB0aW9ufS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVzZXIgLSBJRCBvZiB0aGUgdXNlciB0byByZW1vdmUgc3Vic2NyaXB0aW9uIGZvci5cbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgdG8gYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgc2VydmVyIHJlc3BvbmRzIHRvIHJlcXVlc3QuXG4gICAqL1xuICBkZWxTdWJzY3JpcHRpb24odXNlcikge1xuICAgIGlmICghdGhpcy5fYXR0YWNoZWQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJDYW5ub3QgZGVsZXRlIHN1YnNjcmlwdGlvbiBpbiBpbmFjdGl2ZSB0b3BpY1wiKSk7XG4gICAgfVxuICAgIC8vIFNlbmQge2RlbH0gbWVzc2FnZSwgcmV0dXJuIHByb21pc2VcbiAgICByZXR1cm4gdGhpcy5fdGlub2RlLmRlbFN1YnNjcmlwdGlvbih0aGlzLm5hbWUsIHVzZXIpLnRoZW4oKGN0cmwpID0+IHtcbiAgICAgIC8vIFJlbW92ZSB0aGUgb2JqZWN0IGZyb20gdGhlIHN1YnNjcmlwdGlvbiBjYWNoZTtcbiAgICAgIGRlbGV0ZSB0aGlzLl91c2Vyc1t1c2VyXTtcbiAgICAgIC8vIE5vdGlmeSBsaXN0ZW5lcnNcbiAgICAgIGlmICh0aGlzLm9uU3Vic1VwZGF0ZWQpIHtcbiAgICAgICAgdGhpcy5vblN1YnNVcGRhdGVkKE9iamVjdC5rZXlzKHRoaXMuX3VzZXJzKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY3RybDtcbiAgICB9KTtcbiAgfVxuICAvKipcbiAgICogU2VuZCBhIHJlYWQvcmVjdiBub3RpZmljYXRpb24uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB3aGF0IC0gd2hhdCBub3RpZmljYXRpb24gdG8gc2VuZDogPGNvZGU+cmVjdjwvY29kZT4sIDxjb2RlPnJlYWQ8L2NvZGU+LlxuICAgKiBAcGFyYW0ge251bWJlcn0gc2VxIC0gSUQgb3IgdGhlIG1lc3NhZ2UgcmVhZCBvciByZWNlaXZlZC5cbiAgICovXG4gIG5vdGUod2hhdCwgc2VxKSB7XG4gICAgaWYgKCF0aGlzLl9hdHRhY2hlZCkge1xuICAgICAgLy8gQ2Fubm90IHNlbmRpbmcge25vdGV9IG9uIGFuIGluYWN0aXZlIHRvcGljXCIuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gVXBkYXRlIGxvY2FsIGNhY2hlIHdpdGggdGhlIG5ldyBjb3VudC5cbiAgICBjb25zdCB1c2VyID0gdGhpcy5fdXNlcnNbdGhpcy5fdGlub2RlLmdldEN1cnJlbnRVc2VySUQoKV07XG4gICAgbGV0IHVwZGF0ZSA9IGZhbHNlO1xuICAgIGlmICh1c2VyKSB7XG4gICAgICAvLyBTZWxmLXN1YnNjcmlwdGlvbiBpcyBmb3VuZC5cbiAgICAgIGlmICghdXNlclt3aGF0XSB8fCB1c2VyW3doYXRdIDwgc2VxKSB7XG4gICAgICAgIHVzZXJbd2hhdF0gPSBzZXE7XG4gICAgICAgIHVwZGF0ZSA9IHRydWU7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFNlbGYtc3Vic2NyaXB0aW9uIGlzIG5vdCBmb3VuZC5cbiAgICAgIHVwZGF0ZSA9ICh0aGlzW3doYXRdIHwgMCkgPCBzZXE7XG4gICAgfVxuXG4gICAgaWYgKHVwZGF0ZSkge1xuICAgICAgLy8gU2VuZCBub3RpZmljYXRpb24gdG8gdGhlIHNlcnZlci5cbiAgICAgIHRoaXMuX3Rpbm9kZS5ub3RlKHRoaXMubmFtZSwgd2hhdCwgc2VxKTtcbiAgICAgIC8vIFVwZGF0ZSBsb2NhbGx5IGNhY2hlZCBjb250YWN0IHdpdGggdGhlIG5ldyBjb3VudC5cbiAgICAgIHRoaXMuX3VwZGF0ZVJlYWRSZWN2KHdoYXQsIHNlcSk7XG5cbiAgICAgIGlmICh0aGlzLmFjcyAhPSBudWxsICYmICF0aGlzLmFjcy5pc011dGVkKCkpIHtcbiAgICAgICAgY29uc3QgbWUgPSB0aGlzLl90aW5vZGUuZ2V0TWVUb3BpYygpO1xuICAgICAgICAvLyBTZW50IGEgbm90aWZpY2F0aW9uIHRvICdtZScgbGlzdGVuZXJzLlxuICAgICAgICBtZS5fcmVmcmVzaENvbnRhY3Qod2hhdCwgdGhpcyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgYSAncmVjdicgcmVjZWlwdC4gV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNub3RlUmVjdn0uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzZXEgLSBJRCBvZiB0aGUgbWVzc2FnZSB0byBha25vd2xlZGdlLlxuICAgKi9cbiAgbm90ZVJlY3Yoc2VxKSB7XG4gICAgdGhpcy5ub3RlKCdyZWN2Jywgc2VxKTtcbiAgfVxuICAvKipcbiAgICogU2VuZCBhICdyZWFkJyByZWNlaXB0LiBXcmFwcGVyIGZvciB7QGxpbmsgVGlub2RlI25vdGVSZWFkfS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IHNlcSAtIElEIG9mIHRoZSBtZXNzYWdlIHRvIGFrbm93bGVkZ2Ugb3IgMC91bmRlZmluZWQgdG8gYWNrbm93bGVkZ2UgdGhlIGxhdGVzdCBtZXNzYWdlcy5cbiAgICovXG4gIG5vdGVSZWFkKHNlcSkge1xuICAgIHNlcSA9IHNlcSB8fCB0aGlzLl9tYXhTZXE7XG4gICAgaWYgKHNlcSA+IDApIHtcbiAgICAgIHRoaXMubm90ZSgncmVhZCcsIHNlcSk7XG4gICAgfVxuICB9XG4gIC8qKlxuICAgKiBTZW5kIGEga2V5LXByZXNzIG5vdGlmaWNhdGlvbi4gV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNub3RlS2V5UHJlc3N9LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKi9cbiAgbm90ZUtleVByZXNzKCkge1xuICAgIGlmICh0aGlzLl9hdHRhY2hlZCkge1xuICAgICAgdGhpcy5fdGlub2RlLm5vdGVLZXlQcmVzcyh0aGlzLm5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl90aW5vZGUubG9nZ2VyKFwiSU5GTzogQ2Fubm90IHNlbmQgbm90aWZpY2F0aW9uIGluIGluYWN0aXZlIHRvcGljXCIpO1xuICAgIH1cbiAgfVxuICAvKipcbiAgICogU2VuZCBhIHtub3RlIHdoYXQ9J2NhbGwnfS4gV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSN2aWRlb0NhbGx9LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXZ0IC0gQ2FsbCBldmVudC5cbiAgICogQHBhcmFtIHtpbnR9IHNlcSAtIElEIG9mIHRoZSBjYWxsIG1lc3NhZ2UgdGhlIGV2ZW50IHBlcnRhaW5zIHRvLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGF5bG9hZCAtIFBheWxvYWQgYXNzb2NpYXRlZCB3aXRoIHRoaXMgZXZlbnQgKGUuZy4gU0RQIHN0cmluZykuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIChmb3Igc29tZSBjYWxsIGV2ZW50cykgd2hpY2ggd2lsbFxuICAgKiAgICAgICAgICAgICAgICAgICAgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gcmVjZWl2aW5nIHNlcnZlciByZXBseVxuICAgKi9cbiAgdmlkZW9DYWxsKGV2dCwgc2VxLCBwYXlsb2FkKSB7XG4gICAgaWYgKCF0aGlzLl9hdHRhY2hlZCAmJiAhWydyaW5naW5nJywgJ2hhbmctdXAnXS5pbmNsdWRlcyhldnQpKSB7XG4gICAgICAvLyBDYW5ub3Qge2NhbGx9IG9uIGFuIGluYWN0aXZlIHRvcGljXCIuXG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl90aW5vZGUudmlkZW9DYWxsKHRoaXMubmFtZSwgc2VxLCBldnQsIHBheWxvYWQpO1xuICB9XG5cbiAgLy8gVXBkYXRlIGNhY2hlZCByZWFkL3JlY3YvdW5yZWFkIGNvdW50cy5cbiAgX3VwZGF0ZVJlYWRSZWN2KHdoYXQsIHNlcSwgdHMpIHtcbiAgICBsZXQgb2xkVmFsLCBkb1VwZGF0ZSA9IGZhbHNlO1xuXG4gICAgc2VxID0gc2VxIHwgMDtcbiAgICB0aGlzLnNlcSA9IHRoaXMuc2VxIHwgMDtcbiAgICB0aGlzLnJlYWQgPSB0aGlzLnJlYWQgfCAwO1xuICAgIHRoaXMucmVjdiA9IHRoaXMucmVjdiB8IDA7XG4gICAgc3dpdGNoICh3aGF0KSB7XG4gICAgICBjYXNlICdyZWN2JzpcbiAgICAgICAgb2xkVmFsID0gdGhpcy5yZWN2O1xuICAgICAgICB0aGlzLnJlY3YgPSBNYXRoLm1heCh0aGlzLnJlY3YsIHNlcSk7XG4gICAgICAgIGRvVXBkYXRlID0gKG9sZFZhbCAhPSB0aGlzLnJlY3YpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3JlYWQnOlxuICAgICAgICBvbGRWYWwgPSB0aGlzLnJlYWQ7XG4gICAgICAgIHRoaXMucmVhZCA9IE1hdGgubWF4KHRoaXMucmVhZCwgc2VxKTtcbiAgICAgICAgZG9VcGRhdGUgPSAob2xkVmFsICE9IHRoaXMucmVhZCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbXNnJzpcbiAgICAgICAgb2xkVmFsID0gdGhpcy5zZXE7XG4gICAgICAgIHRoaXMuc2VxID0gTWF0aC5tYXgodGhpcy5zZXEsIHNlcSk7XG4gICAgICAgIGlmICghdGhpcy50b3VjaGVkIHx8IHRoaXMudG91Y2hlZCA8IHRzKSB7XG4gICAgICAgICAgdGhpcy50b3VjaGVkID0gdHM7XG4gICAgICAgIH1cbiAgICAgICAgZG9VcGRhdGUgPSAob2xkVmFsICE9IHRoaXMuc2VxKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgLy8gU2FuaXR5IGNoZWNrcy5cbiAgICBpZiAodGhpcy5yZWN2IDwgdGhpcy5yZWFkKSB7XG4gICAgICB0aGlzLnJlY3YgPSB0aGlzLnJlYWQ7XG4gICAgICBkb1VwZGF0ZSA9IHRydWU7XG4gICAgfVxuICAgIGlmICh0aGlzLnNlcSA8IHRoaXMucmVjdikge1xuICAgICAgdGhpcy5zZXEgPSB0aGlzLnJlY3Y7XG4gICAgICBpZiAoIXRoaXMudG91Y2hlZCB8fCB0aGlzLnRvdWNoZWQgPCB0cykge1xuICAgICAgICB0aGlzLnRvdWNoZWQgPSB0cztcbiAgICAgIH1cbiAgICAgIGRvVXBkYXRlID0gdHJ1ZTtcbiAgICB9XG4gICAgdGhpcy51bnJlYWQgPSB0aGlzLnNlcSAtIHRoaXMucmVhZDtcbiAgICByZXR1cm4gZG9VcGRhdGU7XG4gIH1cbiAgLyoqXG4gICAqIEdldCB1c2VyIGRlc2NyaXB0aW9uIGZyb20gZ2xvYmFsIGNhY2hlLiBUaGUgdXNlciBkb2VzIG5vdCBuZWVkIHRvIGJlIGFcbiAgICogc3Vic2NyaWJlciBvZiB0aGlzIHRvcGljLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdWlkIC0gSUQgb2YgdGhlIHVzZXIgdG8gZmV0Y2guXG4gICAqIEByZXR1cm4ge09iamVjdH0gdXNlciBkZXNjcmlwdGlvbiBvciB1bmRlZmluZWQuXG4gICAqL1xuICB1c2VyRGVzYyh1aWQpIHtcbiAgICAvLyBUT0RPOiBoYW5kbGUgYXN5bmNocm9ub3VzIHJlcXVlc3RzXG4gICAgY29uc3QgdXNlciA9IHRoaXMuX2NhY2hlR2V0VXNlcih1aWQpO1xuICAgIGlmICh1c2VyKSB7XG4gICAgICByZXR1cm4gdXNlcjsgLy8gUHJvbWlzZS5yZXNvbHZlKHVzZXIpXG4gICAgfVxuICB9XG4gIC8qKlxuICAgKiBHZXQgZGVzY3JpcHRpb24gb2YgdGhlIHAycCBwZWVyIGZyb20gc3Vic2NyaXB0aW9uIGNhY2hlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcmV0dXJuIHtPYmplY3R9IHBlZXIncyBkZXNjcmlwdGlvbiBvciB1bmRlZmluZWQuXG4gICAqL1xuICBwMnBQZWVyRGVzYygpIHtcbiAgICBpZiAoIXRoaXMuaXNQMlBUeXBlKCkpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl91c2Vyc1t0aGlzLm5hbWVdO1xuICB9XG4gIC8qKlxuICAgKiBJdGVyYXRlIG92ZXIgY2FjaGVkIHN1YnNjcmliZXJzLiBJZiBjYWxsYmFjayBpcyB1bmRlZmluZWQsIHVzZSB0aGlzLm9uTWV0YVN1Yi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgLSBDYWxsYmFjayB3aGljaCB3aWxsIHJlY2VpdmUgc3Vic2NyaWJlcnMgb25lIGJ5IG9uZS5cbiAgICogQHBhcmFtIHtPYmplY3Q9fSBjb250ZXh0IC0gVmFsdWUgb2YgYHRoaXNgIGluc2lkZSB0aGUgYGNhbGxiYWNrYC5cbiAgICovXG4gIHN1YnNjcmliZXJzKGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgY29uc3QgY2IgPSAoY2FsbGJhY2sgfHwgdGhpcy5vbk1ldGFTdWIpO1xuICAgIGlmIChjYikge1xuICAgICAgZm9yIChsZXQgaWR4IGluIHRoaXMuX3VzZXJzKSB7XG4gICAgICAgIGNiLmNhbGwoY29udGV4dCwgdGhpcy5fdXNlcnNbaWR4XSwgaWR4LCB0aGlzLl91c2Vycyk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIC8qKlxuICAgKiBHZXQgYSBjb3B5IG9mIGNhY2hlZCB0YWdzLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcmV0dXJuIHtBcnJheS48c3RyaW5nPn0gYSBjb3B5IG9mIHRhZ3NcbiAgICovXG4gIHRhZ3MoKSB7XG4gICAgLy8gUmV0dXJuIGEgY29weS5cbiAgICByZXR1cm4gdGhpcy5fdGFncy5zbGljZSgwKTtcbiAgfVxuICAvKipcbiAgICogR2V0IGNhY2hlZCBzdWJzY3JpcHRpb24gZm9yIHRoZSBnaXZlbiB1c2VyIElELlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdWlkIC0gaWQgb2YgdGhlIHVzZXIgdG8gcXVlcnkgZm9yXG4gICAqIEByZXR1cm4gdXNlciBkZXNjcmlwdGlvbiBvciB1bmRlZmluZWQuXG4gICAqL1xuICBzdWJzY3JpYmVyKHVpZCkge1xuICAgIHJldHVybiB0aGlzLl91c2Vyc1t1aWRdO1xuICB9XG4gIC8qKlxuICAgKiBJdGVyYXRlIG92ZXIgdmVyc2lvbnMgb2YgPGNvZGU+bWVzc2FnZTwvY29kZT46IGNhbGwgPGNvZGU+Y2FsbGJhY2s8L2NvZGU+IGZvciBlYWNoIG1lc3NhZ2UuXG4gICAqIElmIDxjb2RlPmNhbGxiYWNrPC9jb2RlPiBpcyB1bmRlZmluZWQsIGRvZXMgbm90aGluZy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtUaW5vZGUuRm9yRWFjaENhbGxiYWNrVHlwZX0gY2FsbGJhY2sgLSBDYWxsYmFjayB3aGljaCB3aWxsIHJlY2VpdmUgbWVzc2FnZXMgb25lIGJ5IG9uZS4gU2VlIHtAbGluayBUaW5vZGUuQ0J1ZmZlciNmb3JFYWNofVxuICAgKiBAcGFyYW0ge09iamVjdH0gY29udGV4dCAtIFZhbHVlIG9mIGB0aGlzYCBpbnNpZGUgdGhlIGBjYWxsYmFja2AuXG4gICAqL1xuICBtZXNzYWdlVmVyc2lvbnMobWVzc2FnZSwgY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICBpZiAoIWNhbGxiYWNrKSB7XG4gICAgICAvLyBObyBjYWxsYmFjaz8gV2UgYXJlIGRvbmUgdGhlbi5cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3Qgb3JpZ1NlcSA9IHRoaXMuX2lzUmVwbGFjZW1lbnRNc2cobWVzc2FnZSkgPyBwYXJzZUludChtZXNzYWdlLmhlYWQucmVwbGFjZS5zcGxpdCgnOicpWzFdKSA6IG1lc3NhZ2Uuc2VxO1xuICAgIGNvbnN0IHZlcnNpb25zID0gdGhpcy5fbWVzc2FnZVZlcnNpb25zW29yaWdTZXFdO1xuICAgIGlmICghdmVyc2lvbnMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmVyc2lvbnMuZm9yRWFjaChjYWxsYmFjaywgdW5kZWZpbmVkLCB1bmRlZmluZWQsIGNvbnRleHQpO1xuICB9XG4gIC8qKlxuICAgKiBJdGVyYXRlIG92ZXIgY2FjaGVkIG1lc3NhZ2VzOiBjYWxsIDxjb2RlPmNhbGxiYWNrPC9jb2RlPiBmb3IgZWFjaCBtZXNzYWdlIGluIHRoZSByYW5nZSBbc2luY2VJZHgsIGJlZm9yZUlkeCkuXG4gICAqIElmIDxjb2RlPmNhbGxiYWNrPC9jb2RlPiBpcyB1bmRlZmluZWQsIHVzZSA8Y29kZT50aGlzLm9uRGF0YTwvY29kZT4uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7VGlub2RlLkZvckVhY2hDYWxsYmFja1R5cGV9IGNhbGxiYWNrIC0gQ2FsbGJhY2sgd2hpY2ggd2lsbCByZWNlaXZlIG1lc3NhZ2VzIG9uZSBieSBvbmUuIFNlZSB7QGxpbmsgVGlub2RlLkNCdWZmZXIjZm9yRWFjaH1cbiAgICogQHBhcmFtIHtudW1iZXJ9IHNpbmNlSWQgLSBPcHRpb25hbCBzZXFJZCB0byBzdGFydCBpdGVyYXRpbmcgZnJvbSAoaW5jbHVzaXZlKS5cbiAgICogQHBhcmFtIHtudW1iZXJ9IGJlZm9yZUlkIC0gT3B0aW9uYWwgc2VxSWQgdG8gc3RvcCBpdGVyYXRpbmcgYmVmb3JlIGl0IGlzIHJlYWNoZWQgKGV4Y2x1c2l2ZSkuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZXh0IC0gVmFsdWUgb2YgYHRoaXNgIGluc2lkZSB0aGUgYGNhbGxiYWNrYC5cbiAgICovXG4gIG1lc3NhZ2VzKGNhbGxiYWNrLCBzaW5jZUlkLCBiZWZvcmVJZCwgY29udGV4dCkge1xuICAgIGNvbnN0IGNiID0gKGNhbGxiYWNrIHx8IHRoaXMub25EYXRhKTtcbiAgICBpZiAoY2IpIHtcbiAgICAgIGNvbnN0IHN0YXJ0SWR4ID0gdHlwZW9mIHNpbmNlSWQgPT0gJ251bWJlcicgPyB0aGlzLl9tZXNzYWdlcy5maW5kKHtcbiAgICAgICAgc2VxOiBzaW5jZUlkXG4gICAgICB9LCB0cnVlKSA6IHVuZGVmaW5lZDtcbiAgICAgIGNvbnN0IGJlZm9yZUlkeCA9IHR5cGVvZiBiZWZvcmVJZCA9PSAnbnVtYmVyJyA/IHRoaXMuX21lc3NhZ2VzLmZpbmQoe1xuICAgICAgICBzZXE6IGJlZm9yZUlkXG4gICAgICB9LCB0cnVlKSA6IHVuZGVmaW5lZDtcbiAgICAgIGlmIChzdGFydElkeCAhPSAtMSAmJiBiZWZvcmVJZHggIT0gLTEpIHtcbiAgICAgICAgLy8gU3RlcCAxLiBGaWx0ZXIgb3V0IGFsbCByZXBsYWNlbWVudCBtZXNzYWdlcyBhbmRcbiAgICAgICAgLy8gc2F2ZSBkaXNwbGF5YWJsZSBtZXNzYWdlcyBpbiBhIHRlbXBvcmFyeSBidWZmZXIuXG4gICAgICAgIGxldCBtc2dzID0gW107XG4gICAgICAgIHRoaXMuX21lc3NhZ2VzLmZvckVhY2goKG1zZywgdW51c2VkMSwgdW51c2VkMiwgaSkgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLl9pc1JlcGxhY2VtZW50TXNnKG1zZykpIHtcbiAgICAgICAgICAgIC8vIFNraXAgcmVwbGFjZW1lbnRzLlxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBtc2dzLnB1c2goe1xuICAgICAgICAgICAgZGF0YTogdGhpcy5sYXRlc3RNc2dWZXJzaW9uKG1zZy5zZXEpIHx8IG1zZyxcbiAgICAgICAgICAgIGlkeDogaVxuICAgICAgICAgIH0pO1xuICAgICAgICB9LCBzdGFydElkeCwgYmVmb3JlSWR4LCB7fSk7XG4gICAgICAgIC8vIFN0ZXAgMi4gTG9vcCBvdmVyIGRpc3BsYXlibGUgbWVzc2FnZXMgaW52b2tpbmcgY2Igb24gZWFjaCBvZiB0aGVtLlxuICAgICAgICBtc2dzLmZvckVhY2goKHZhbCwgaSkgPT4ge1xuICAgICAgICAgIGNiLmNhbGwoY29udGV4dCwgdmFsLmRhdGEsXG4gICAgICAgICAgICAoaSA+IDAgPyBtc2dzW2kgLSAxXS5kYXRhIDogdW5kZWZpbmVkKSxcbiAgICAgICAgICAgIChpIDwgbXNncy5sZW5ndGggLSAxID8gbXNnc1tpICsgMV0uZGF0YSA6IHVuZGVmaW5lZCksIHZhbC5pZHgpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgLyoqXG4gICAqIEdldCB0aGUgbWVzc2FnZSBmcm9tIGNhY2hlIGJ5IDxjb2RlPnNlcTwvY29kZT4uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzZXEgLSBtZXNzYWdlIHNlcUlkIHRvIHNlYXJjaCBmb3IuXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IHRoZSBtZXNzYWdlIHdpdGggdGhlIGdpdmVuIDxjb2RlPnNlcTwvY29kZT4gb3IgPGNvZGU+dW5kZWZpbmVkPC9jb2RlPiwgaWYgbm8gc3VjaCBtZXNzYWdlIGlzIGZvdW5kLlxuICAgKi9cbiAgZmluZE1lc3NhZ2Uoc2VxKSB7XG4gICAgY29uc3QgaWR4ID0gdGhpcy5fbWVzc2FnZXMuZmluZCh7XG4gICAgICBzZXE6IHNlcVxuICAgIH0pO1xuICAgIGlmIChpZHggPj0gMCkge1xuICAgICAgcmV0dXJuIHRoaXMuX21lc3NhZ2VzLmdldEF0KGlkeCk7XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgLyoqXG4gICAqIEdldCB0aGUgbW9zdCByZWNlbnQgbWVzc2FnZSBmcm9tIGNhY2hlLiBUaGlzIG1ldGhvZCBjb3VudHMgYWxsIG1lc3NhZ2VzLCBpbmNsdWRpbmcgZGVsZXRlZCByYW5nZXMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVufSBza2lwRGVsZXRlZCAtIGlmIHRoZSBsYXN0IG1lc3NhZ2UgaXMgYSBkZWxldGVkIHJhbmdlLCBnZXQgdGhlIG9uZSBiZWZvcmUgaXQuXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IHRoZSBtb3N0IHJlY2VudCBjYWNoZWQgbWVzc2FnZSBvciA8Y29kZT51bmRlZmluZWQ8L2NvZGU+LCBpZiBubyBtZXNzYWdlcyBhcmUgY2FjaGVkLlxuICAgKi9cbiAgbGF0ZXN0TWVzc2FnZShza2lwRGVsZXRlZCkge1xuICAgIGNvbnN0IG1zZyA9IHRoaXMuX21lc3NhZ2VzLmdldExhc3QoKTtcbiAgICBpZiAoIXNraXBEZWxldGVkIHx8ICFtc2cgfHwgbXNnLl9zdGF0dXMgIT0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfREVMX1JBTkdFKSB7XG4gICAgICByZXR1cm4gbXNnO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fbWVzc2FnZXMuZ2V0TGFzdCgxKTtcbiAgfVxuICAvKipcbiAgICogR2V0IHRoZSBsYXRlc3QgdmVyc2lvbiBmb3IgbWVzc2FnZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IHNlcSAtIG9yaWdpbmFsIHNlcSBJRCBvZiB0aGUgbWVzc2FnZS5cbiAgICogQHJldHVybnMge09iamVjdH0gdGhlIGxhdGVzdCB2ZXJzaW9uIG9mIHRoZSBtZXNzYWdlIG9yIG51bGwgaWYgbWVzc2FnZSBub3QgZm91bmQuXG4gICAqL1xuICBsYXRlc3RNc2dWZXJzaW9uKHNlcSkge1xuICAgIGNvbnN0IHZlcnNpb25zID0gdGhpcy5fbWVzc2FnZVZlcnNpb25zW3NlcV07XG4gICAgcmV0dXJuIHZlcnNpb25zID8gdmVyc2lvbnMuZ2V0TGFzdCgpIDogbnVsbDtcbiAgfVxuICAvKipcbiAgICogR2V0IHRoZSBtYXhpbXVtIGNhY2hlZCBzZXEgSUQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IHRoZSBncmVhdGVzdCBzZXEgSUQgaW4gY2FjaGUuXG4gICAqL1xuICBtYXhNc2dTZXEoKSB7XG4gICAgcmV0dXJuIHRoaXMuX21heFNlcTtcbiAgfVxuICAvKipcbiAgICogR2V0IHRoZSBtYXhpbXVtIGRlbGV0aW9uIElELlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSB0aGUgZ3JlYXRlc3QgZGVsZXRpb24gSUQuXG4gICAqL1xuICBtYXhDbGVhcklkKCkge1xuICAgIHJldHVybiB0aGlzLl9tYXhEZWw7XG4gIH1cbiAgLyoqXG4gICAqIEdldCB0aGUgbnVtYmVyIG9mIG1lc3NhZ2VzIGluIHRoZSBjYWNoZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHJldHVybnMge251bWJlcn0gY291bnQgb2YgY2FjaGVkIG1lc3NhZ2VzLlxuICAgKi9cbiAgbWVzc2FnZUNvdW50KCkge1xuICAgIHJldHVybiB0aGlzLl9tZXNzYWdlcy5sZW5ndGgoKTtcbiAgfVxuICAvKipcbiAgICogSXRlcmF0ZSBvdmVyIGNhY2hlZCB1bnNlbnQgbWVzc2FnZXMuIFdyYXBzIHtAbGluayBUaW5vZGUuVG9waWMjbWVzc2FnZXN9LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayAtIENhbGxiYWNrIHdoaWNoIHdpbGwgcmVjZWl2ZSBtZXNzYWdlcyBvbmUgYnkgb25lLiBTZWUge0BsaW5rIFRpbm9kZS5DQnVmZmVyI2ZvckVhY2h9XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZXh0IC0gVmFsdWUgb2YgPGNvZGU+dGhpczwvY29kZT4gaW5zaWRlIHRoZSA8Y29kZT5jYWxsYmFjazwvY29kZT4uXG4gICAqL1xuICBxdWV1ZWRNZXNzYWdlcyhjYWxsYmFjaywgY29udGV4dCkge1xuICAgIGlmICghY2FsbGJhY2spIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbGxiYWNrIG11c3QgYmUgcHJvdmlkZWRcIik7XG4gICAgfVxuICAgIHRoaXMubWVzc2FnZXMoY2FsbGJhY2ssIENvbnN0LkxPQ0FMX1NFUUlELCB1bmRlZmluZWQsIGNvbnRleHQpO1xuICB9XG4gIC8qKlxuICAgKiBHZXQgdGhlIG51bWJlciBvZiB0b3BpYyBzdWJzY3JpYmVycyB3aG8gbWFya2VkIHRoaXMgbWVzc2FnZSBhcyBlaXRoZXIgcmVjdiBvciByZWFkXG4gICAqIEN1cnJlbnQgdXNlciBpcyBleGNsdWRlZCBmcm9tIHRoZSBjb3VudC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHdoYXQgLSB3aGF0IGFjdGlvbiB0byBjb25zaWRlcjogcmVjZWl2ZWQgPGNvZGU+XCJyZWN2XCI8L2NvZGU+IG9yIHJlYWQgPGNvZGU+XCJyZWFkXCI8L2NvZGU+LlxuICAgKiBAcGFyYW0ge251bWJlcn0gc2VxIC0gSUQgb3IgdGhlIG1lc3NhZ2UgcmVhZCBvciByZWNlaXZlZC5cbiAgICpcbiAgICogQHJldHVybnMge251bWJlcn0gdGhlIG51bWJlciBvZiBzdWJzY3JpYmVycyB3aG8gbWFya2VkIHRoZSBtZXNzYWdlIHdpdGggdGhlIGdpdmVuIElEIGFzIHJlYWQgb3IgcmVjZWl2ZWQuXG4gICAqL1xuICBtc2dSZWNlaXB0Q291bnQod2hhdCwgc2VxKSB7XG4gICAgbGV0IGNvdW50ID0gMDtcbiAgICBpZiAoc2VxID4gMCkge1xuICAgICAgY29uc3QgbWUgPSB0aGlzLl90aW5vZGUuZ2V0Q3VycmVudFVzZXJJRCgpO1xuICAgICAgZm9yIChsZXQgaWR4IGluIHRoaXMuX3VzZXJzKSB7XG4gICAgICAgIGNvbnN0IHVzZXIgPSB0aGlzLl91c2Vyc1tpZHhdO1xuICAgICAgICBpZiAodXNlci51c2VyICE9PSBtZSAmJiB1c2VyW3doYXRdID49IHNlcSkge1xuICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvdW50O1xuICB9XG4gIC8qKlxuICAgKiBHZXQgdGhlIG51bWJlciBvZiB0b3BpYyBzdWJzY3JpYmVycyB3aG8gbWFya2VkIHRoaXMgbWVzc2FnZSAoYW5kIGFsbCBvbGRlciBtZXNzYWdlcykgYXMgcmVhZC5cbiAgICogVGhlIGN1cnJlbnQgdXNlciBpcyBleGNsdWRlZCBmcm9tIHRoZSBjb3VudC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IHNlcSAtIG1lc3NhZ2UgaWQgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IG51bWJlciBvZiBzdWJzY3JpYmVycyB3aG8gY2xhaW0gdG8gaGF2ZSByZWNlaXZlZCB0aGUgbWVzc2FnZS5cbiAgICovXG4gIG1zZ1JlYWRDb3VudChzZXEpIHtcbiAgICByZXR1cm4gdGhpcy5tc2dSZWNlaXB0Q291bnQoJ3JlYWQnLCBzZXEpO1xuICB9XG4gIC8qKlxuICAgKiBHZXQgdGhlIG51bWJlciBvZiB0b3BpYyBzdWJzY3JpYmVycyB3aG8gbWFya2VkIHRoaXMgbWVzc2FnZSAoYW5kIGFsbCBvbGRlciBtZXNzYWdlcykgYXMgcmVjZWl2ZWQuXG4gICAqIFRoZSBjdXJyZW50IHVzZXIgaXMgZXhjbHVkZWQgZnJvbSB0aGUgY291bnQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzZXEgLSBNZXNzYWdlIGlkIHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSBOdW1iZXIgb2Ygc3Vic2NyaWJlcnMgd2hvIGNsYWltIHRvIGhhdmUgcmVjZWl2ZWQgdGhlIG1lc3NhZ2UuXG4gICAqL1xuICBtc2dSZWN2Q291bnQoc2VxKSB7XG4gICAgcmV0dXJuIHRoaXMubXNnUmVjZWlwdENvdW50KCdyZWN2Jywgc2VxKTtcbiAgfVxuICAvKipcbiAgICogQ2hlY2sgaWYgY2FjaGVkIG1lc3NhZ2UgSURzIGluZGljYXRlIHRoYXQgdGhlIHNlcnZlciBtYXkgaGF2ZSBtb3JlIG1lc3NhZ2VzLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IG5ld2VyIC0gaWYgPGNvZGU+dHJ1ZTwvY29kZT4sIGNoZWNrIGZvciBuZXdlciBtZXNzYWdlcyBvbmx5LlxuICAgKi9cbiAgbXNnSGFzTW9yZU1lc3NhZ2VzKG5ld2VyKSB7XG4gICAgcmV0dXJuIG5ld2VyID8gdGhpcy5zZXEgPiB0aGlzLl9tYXhTZXEgOlxuICAgICAgLy8gX21pblNlcSBjb3VsZCBiZSBtb3JlIHRoYW4gMSwgYnV0IGVhcmxpZXIgbWVzc2FnZXMgY291bGQgaGF2ZSBiZWVuIGRlbGV0ZWQuXG4gICAgICAodGhpcy5fbWluU2VxID4gMSAmJiAhdGhpcy5fbm9FYXJsaWVyTXNncyk7XG4gIH1cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSBnaXZlbiBzZXEgSWQgaXMgaWQgb2YgdGhlIG1vc3QgcmVjZW50IG1lc3NhZ2UuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzZXFJZCBpZCBvZiB0aGUgbWVzc2FnZSB0byBjaGVja1xuICAgKi9cbiAgaXNOZXdNZXNzYWdlKHNlcUlkKSB7XG4gICAgcmV0dXJuIHRoaXMuX21heFNlcSA8PSBzZXFJZDtcbiAgfVxuICAvKipcbiAgICogUmVtb3ZlIG9uZSBtZXNzYWdlIGZyb20gbG9jYWwgY2FjaGUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzZXFJZCBpZCBvZiB0aGUgbWVzc2FnZSB0byByZW1vdmUgZnJvbSBjYWNoZS5cbiAgICogQHJldHVybnMge01lc3NhZ2V9IHJlbW92ZWQgbWVzc2FnZSBvciB1bmRlZmluZWQgaWYgc3VjaCBtZXNzYWdlIHdhcyBub3QgZm91bmQuXG4gICAqL1xuICBmbHVzaE1lc3NhZ2Uoc2VxSWQpIHtcbiAgICBjb25zdCBpZHggPSB0aGlzLl9tZXNzYWdlcy5maW5kKHtcbiAgICAgIHNlcTogc2VxSWRcbiAgICB9KTtcbiAgICBpZiAoaWR4ID49IDApIHtcbiAgICAgIHRoaXMuX3Rpbm9kZS5fZGIucmVtTWVzc2FnZXModGhpcy5uYW1lLCBzZXFJZCk7XG4gICAgICByZXR1cm4gdGhpcy5fbWVzc2FnZXMuZGVsQXQoaWR4KTtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuICAvKipcbiAgICogVXBkYXRlIG1lc3NhZ2UncyBzZXFJZC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHB1YiBtZXNzYWdlIG9iamVjdC5cbiAgICogQHBhcmFtIHtudW1iZXJ9IG5ld1NlcUlkIG5ldyBzZXEgaWQgZm9yIHB1Yi5cbiAgICovXG4gIHN3YXBNZXNzYWdlSWQocHViLCBuZXdTZXFJZCkge1xuICAgIGNvbnN0IGlkeCA9IHRoaXMuX21lc3NhZ2VzLmZpbmQocHViKTtcbiAgICBjb25zdCBudW1NZXNzYWdlcyA9IHRoaXMuX21lc3NhZ2VzLmxlbmd0aCgpO1xuICAgIGlmICgwIDw9IGlkeCAmJiBpZHggPCBudW1NZXNzYWdlcykge1xuICAgICAgLy8gUmVtb3ZlIG1lc3NhZ2Ugd2l0aCB0aGUgb2xkIHNlcSBJRC5cbiAgICAgIHRoaXMuX21lc3NhZ2VzLmRlbEF0KGlkeCk7XG4gICAgICB0aGlzLl90aW5vZGUuX2RiLnJlbU1lc3NhZ2VzKHRoaXMubmFtZSwgcHViLnNlcSk7XG4gICAgICAvLyBBZGQgbWVzc2FnZSB3aXRoIHRoZSBuZXcgc2VxIElELlxuICAgICAgcHViLnNlcSA9IG5ld1NlcUlkO1xuICAgICAgdGhpcy5fbWVzc2FnZXMucHV0KHB1Yik7XG4gICAgICB0aGlzLl90aW5vZGUuX2RiLmFkZE1lc3NhZ2UocHViKTtcbiAgICB9XG4gIH1cbiAgLyoqXG4gICAqIFJlbW92ZSBhIHJhbmdlIG9mIG1lc3NhZ2VzIGZyb20gdGhlIGxvY2FsIGNhY2hlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gZnJvbUlkIHNlcSBJRCBvZiB0aGUgZmlyc3QgbWVzc2FnZSB0byByZW1vdmUgKGluY2x1c2l2ZSkuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB1bnRpbElkIHNlcUlEIG9mIHRoZSBsYXN0IG1lc3NhZ2UgdG8gcmVtb3ZlIChleGNsdXNpdmUpLlxuICAgKlxuICAgKiBAcmV0dXJucyB7TWVzc2FnZVtdfSBhcnJheSBvZiByZW1vdmVkIG1lc3NhZ2VzIChjb3VsZCBiZSBlbXB0eSkuXG4gICAqL1xuICBmbHVzaE1lc3NhZ2VSYW5nZShmcm9tSWQsIHVudGlsSWQpIHtcbiAgICAvLyBSZW1vdmUgcmFuZ2UgZnJvbSBwZXJzaXN0ZW50IGNhY2hlLlxuICAgIHRoaXMuX3Rpbm9kZS5fZGIucmVtTWVzc2FnZXModGhpcy5uYW1lLCBmcm9tSWQsIHVudGlsSWQpO1xuICAgIC8vIHN0YXJ0LCBlbmQ6IGZpbmQgaW5zZXJ0aW9uIHBvaW50cyAobmVhcmVzdCA9PSB0cnVlKS5cbiAgICBjb25zdCBzaW5jZSA9IHRoaXMuX21lc3NhZ2VzLmZpbmQoe1xuICAgICAgc2VxOiBmcm9tSWRcbiAgICB9LCB0cnVlKTtcbiAgICByZXR1cm4gc2luY2UgPj0gMCA/IHRoaXMuX21lc3NhZ2VzLmRlbFJhbmdlKHNpbmNlLCB0aGlzLl9tZXNzYWdlcy5maW5kKHtcbiAgICAgIHNlcTogdW50aWxJZFxuICAgIH0sIHRydWUpKSA6IFtdO1xuICB9XG4gIC8qKlxuICAgKiBBdHRlbXB0IHRvIHN0b3AgbWVzc2FnZSBmcm9tIGJlaW5nIHNlbnQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzZXFJZCBpZCBvZiB0aGUgbWVzc2FnZSB0byBzdG9wIHNlbmRpbmcgYW5kIHJlbW92ZSBmcm9tIGNhY2hlLlxuICAgKlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgbWVzc2FnZSB3YXMgY2FuY2VsbGVkLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgY2FuY2VsU2VuZChzZXFJZCkge1xuICAgIGNvbnN0IGlkeCA9IHRoaXMuX21lc3NhZ2VzLmZpbmQoe1xuICAgICAgc2VxOiBzZXFJZFxuICAgIH0pO1xuICAgIGlmIChpZHggPj0gMCkge1xuICAgICAgY29uc3QgbXNnID0gdGhpcy5fbWVzc2FnZXMuZ2V0QXQoaWR4KTtcbiAgICAgIGNvbnN0IHN0YXR1cyA9IHRoaXMubXNnU3RhdHVzKG1zZyk7XG4gICAgICBpZiAoc3RhdHVzID09IENvbnN0Lk1FU1NBR0VfU1RBVFVTX1FVRVVFRCB8fCBzdGF0dXMgPT0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfRkFJTEVEKSB7XG4gICAgICAgIHRoaXMuX3Rpbm9kZS5fZGIucmVtTWVzc2FnZXModGhpcy5uYW1lLCBzZXFJZCk7XG4gICAgICAgIG1zZy5fY2FuY2VsbGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fbWVzc2FnZXMuZGVsQXQoaWR4KTtcbiAgICAgICAgaWYgKHRoaXMub25EYXRhKSB7XG4gICAgICAgICAgLy8gQ2FsbGluZyB3aXRoIG5vIHBhcmFtZXRlcnMgdG8gaW5kaWNhdGUgdGhlIG1lc3NhZ2Ugd2FzIGRlbGV0ZWQuXG4gICAgICAgICAgdGhpcy5vbkRhdGEoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIC8qKlxuICAgKiBHZXQgdHlwZSBvZiB0aGUgdG9waWM6IG1lLCBwMnAsIGdycCwgZm5kLi4uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IE9uZSBvZiAnbWUnLCAncDJwJywgJ2dycCcsICdmbmQnLCAnc3lzJyBvciA8Y29kZT51bmRlZmluZWQ8L2NvZGU+LlxuICAgKi9cbiAgZ2V0VHlwZSgpIHtcbiAgICByZXR1cm4gVG9waWMudG9waWNUeXBlKHRoaXMubmFtZSk7XG4gIH1cbiAgLyoqXG4gICAqIEdldCBjdXJyZW50IHVzZXIncyBhY2Nlc3MgbW9kZSBvZiB0aGUgdG9waWMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuQWNjZXNzTW9kZX0gLSB1c2VyJ3MgYWNjZXNzIG1vZGVcbiAgICovXG4gIGdldEFjY2Vzc01vZGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuYWNzO1xuICB9XG4gIC8qKlxuICAgKiBTZXQgY3VycmVudCB1c2VyJ3MgYWNjZXNzIG1vZGUgb2YgdGhlIHRvcGljLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge0FjY2Vzc01vZGUgfCBPYmplY3R9IGFjcyAtIGFjY2VzcyBtb2RlIHRvIHNldC5cbiAgICovXG4gIHNldEFjY2Vzc01vZGUoYWNzKSB7XG4gICAgcmV0dXJuIHRoaXMuYWNzID0gbmV3IEFjY2Vzc01vZGUoYWNzKTtcbiAgfVxuICAvKipcbiAgICogR2V0IHRvcGljJ3MgZGVmYXVsdCBhY2Nlc3MgbW9kZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5EZWZBY3N9IC0gYWNjZXNzIG1vZGUsIHN1Y2ggYXMge2F1dGg6IGBSV1BgLCBhbm9uOiBgTmB9LlxuICAgKi9cbiAgZ2V0RGVmYXVsdEFjY2VzcygpIHtcbiAgICByZXR1cm4gdGhpcy5kZWZhY3M7XG4gIH1cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgbmV3IG1ldGEge0BsaW5rIFRpbm9kZS5HZXRRdWVyeX0gYnVpbGRlci4gVGhlIHF1ZXJ5IGlzIGF0dGNoZWQgdG8gdGhlIGN1cnJlbnQgdG9waWMuXG4gICAqIEl0IHdpbGwgbm90IHdvcmsgY29ycmVjdGx5IGlmIHVzZWQgd2l0aCBhIGRpZmZlcmVudCB0b3BpYy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5NZXRhR2V0QnVpbGRlcn0gcXVlcnkgYXR0YWNoZWQgdG8gdGhlIGN1cnJlbnQgdG9waWMuXG4gICAqL1xuICBzdGFydE1ldGFRdWVyeSgpIHtcbiAgICByZXR1cm4gbmV3IE1ldGFHZXRCdWlsZGVyKHRoaXMpO1xuICB9XG4gIC8qKlxuICAgKiBDaGVjayBpZiB0b3BpYyBpcyBhcmNoaXZlZCwgaS5lLiBwcml2YXRlLmFyY2ggPT0gdHJ1ZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHJldHVybnMge2Jvb2xlYW59IC0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgdG9waWMgaXMgYXJjaGl2ZWQsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBpc0FyY2hpdmVkKCkge1xuICAgIHJldHVybiB0aGlzLnByaXZhdGUgJiYgISF0aGlzLnByaXZhdGUuYXJjaDtcbiAgfVxuICAvKipcbiAgICogQ2hlY2sgaWYgdG9waWMgaXMgYSAnbWUnIHRvcGljLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0b3BpYyBpcyBhICdtZScgdG9waWMsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBpc01lVHlwZSgpIHtcbiAgICByZXR1cm4gVG9waWMuaXNNZVRvcGljTmFtZSh0aGlzLm5hbWUpO1xuICB9XG4gIC8qKlxuICAgKiBDaGVjayBpZiB0b3BpYyBpcyBhIGNoYW5uZWwuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIDxjb2RlPnRydWU8L2NvZGU+IGlmIHRvcGljIGlzIGEgY2hhbm5lbCwgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIGlzQ2hhbm5lbFR5cGUoKSB7XG4gICAgcmV0dXJuIFRvcGljLmlzQ2hhbm5lbFRvcGljTmFtZSh0aGlzLm5hbWUpO1xuICB9XG4gIC8qKlxuICAgKiBDaGVjayBpZiB0b3BpYyBpcyBhIGdyb3VwIHRvcGljLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0b3BpYyBpcyBhIGdyb3VwLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgaXNHcm91cFR5cGUoKSB7XG4gICAgcmV0dXJuIFRvcGljLmlzR3JvdXBUb3BpY05hbWUodGhpcy5uYW1lKTtcbiAgfVxuICAvKipcbiAgICogQ2hlY2sgaWYgdG9waWMgaXMgYSBwMnAgdG9waWMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIDxjb2RlPnRydWU8L2NvZGU+IGlmIHRvcGljIGlzIGEgcDJwIHRvcGljLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgaXNQMlBUeXBlKCkge1xuICAgIHJldHVybiBUb3BpYy5pc1AyUFRvcGljTmFtZSh0aGlzLm5hbWUpO1xuICB9XG4gIC8qKlxuICAgKiBDaGVjayBpZiB0b3BpYyBpcyBhIGNvbW11bmljYXRpb24gdG9waWMsIGkuZS4gYSBncm91cCBvciBwMnAgdG9waWMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIDxjb2RlPnRydWU8L2NvZGU+IGlmIHRvcGljIGlzIGEgcDJwIG9yIGdyb3VwIHRvcGljLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgaXNDb21tVHlwZSgpIHtcbiAgICByZXR1cm4gVG9waWMuaXNDb21tVG9waWNOYW1lKHRoaXMubmFtZSk7XG4gIH1cbiAgLyoqXG4gICAqIEdldCBzdGF0dXMgKHF1ZXVlZCwgc2VudCwgcmVjZWl2ZWQgZXRjKSBvZiBhIGdpdmVuIG1lc3NhZ2UgaW4gdGhlIGNvbnRleHRcbiAgICogb2YgdGhpcyB0b3BpYy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtNZXNzYWdlfSBtc2cgLSBtZXNzYWdlIHRvIGNoZWNrIGZvciBzdGF0dXMuXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gdXBkIC0gdXBkYXRlIGNoYWNoZWQgbWVzc2FnZSBzdGF0dXMuXG4gICAqXG4gICAqIEByZXR1cm5zIG1lc3NhZ2Ugc3RhdHVzIGNvbnN0YW50LlxuICAgKi9cbiAgbXNnU3RhdHVzKG1zZywgdXBkKSB7XG4gICAgbGV0IHN0YXR1cyA9IENvbnN0Lk1FU1NBR0VfU1RBVFVTX05PTkU7XG4gICAgaWYgKHRoaXMuX3Rpbm9kZS5pc01lKG1zZy5mcm9tKSkge1xuICAgICAgaWYgKG1zZy5fc2VuZGluZykge1xuICAgICAgICBzdGF0dXMgPSBDb25zdC5NRVNTQUdFX1NUQVRVU19TRU5ESU5HO1xuICAgICAgfSBlbHNlIGlmIChtc2cuX2ZhaWxlZCB8fCBtc2cuX2NhbmNlbGxlZCkge1xuICAgICAgICBzdGF0dXMgPSBDb25zdC5NRVNTQUdFX1NUQVRVU19GQUlMRUQ7XG4gICAgICB9IGVsc2UgaWYgKG1zZy5zZXEgPj0gQ29uc3QuTE9DQUxfU0VRSUQpIHtcbiAgICAgICAgc3RhdHVzID0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfUVVFVUVEO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLm1zZ1JlYWRDb3VudChtc2cuc2VxKSA+IDApIHtcbiAgICAgICAgc3RhdHVzID0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfUkVBRDtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5tc2dSZWN2Q291bnQobXNnLnNlcSkgPiAwKSB7XG4gICAgICAgIHN0YXR1cyA9IENvbnN0Lk1FU1NBR0VfU1RBVFVTX1JFQ0VJVkVEO1xuICAgICAgfSBlbHNlIGlmIChtc2cuc2VxID4gMCkge1xuICAgICAgICBzdGF0dXMgPSBDb25zdC5NRVNTQUdFX1NUQVRVU19TRU5UO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAobXNnLl9zdGF0dXMgPT0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfREVMX1JBTkdFKSB7XG4gICAgICBzdGF0dXMgPT0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfREVMX1JBTkdFO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdGF0dXMgPSBDb25zdC5NRVNTQUdFX1NUQVRVU19UT19NRTtcbiAgICB9XG5cbiAgICBpZiAodXBkICYmIG1zZy5fc3RhdHVzICE9IHN0YXR1cykge1xuICAgICAgbXNnLl9zdGF0dXMgPSBzdGF0dXM7XG4gICAgICB0aGlzLl90aW5vZGUuX2RiLnVwZE1lc3NhZ2VTdGF0dXModGhpcy5uYW1lLCBtc2cuc2VxLCBzdGF0dXMpO1xuICAgIH1cblxuICAgIHJldHVybiBzdGF0dXM7XG4gIH1cblxuICAvLyBSZXR1cm5zIHRydWUgaWYgcHViIGlzIG1lYW50IHRvIHJlcGxhY2UgYW5vdGhlciBtZXNzYWdlIChlLmcuIG9yaWdpbmFsIG1lc3NhZ2Ugd2FzIGVkaXRlZCkuXG4gIF9pc1JlcGxhY2VtZW50TXNnKHB1Yikge1xuICAgIHJldHVybiBwdWIuaGVhZCAmJiBwdWIuaGVhZC5yZXBsYWNlO1xuICB9XG5cbiAgLy8gSWYgbXNnIGlzIGEgcmVwbGFjZW1lbnQgZm9yIGFub3RoZXIgbWVzc2FnZSwgc2F2ZXMgbXNnIGluIHRoZSBtZXNzYWdlIHZlcnNpb25zIGNhY2hlXG4gIC8vIGFzIGEgbmV3ZXIgdmVyc2lvbiBmb3IgdGhlIG1lc3NhZ2UgaXQncyBzdXBwb3NlZCB0byByZXBsYWNlLlxuICBfbWF5YmVVcGRhdGVNZXNzYWdlVmVyc2lvbnNDYWNoZShtc2cpIHtcbiAgICBpZiAoIXRoaXMuX2lzUmVwbGFjZW1lbnRNc2cobXNnKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCB0YXJnZXRTZXEgPSBwYXJzZUludChtc2cuaGVhZC5yZXBsYWNlLnNwbGl0KCc6JylbMV0pO1xuICAgIGlmICh0YXJnZXRTZXEgPiBtc2cuc2VxKSB7XG4gICAgICAvLyBTdWJzdGl0dXRlcyBhcmUgc3VwcG9zZWQgdG8gaGF2ZSBoaWdoZXIgc2VxIGlkcy5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgbGV0IHZlcnNpb25zID0gdGhpcy5fbWVzc2FnZVZlcnNpb25zW3RhcmdldFNlcV0gfHwgbmV3IENCdWZmZXIoKGEsIGIpID0+IHtcbiAgICAgIHJldHVybiBhLnNlcSAtIGIuc2VxO1xuICAgIH0sIHRydWUpO1xuICAgIHZlcnNpb25zLnB1dChtc2cpO1xuICAgIHRoaXMuX21lc3NhZ2VWZXJzaW9uc1t0YXJnZXRTZXFdID0gdmVyc2lvbnM7XG4gIH1cblxuICAvLyBQcm9jZXNzIGRhdGEgbWVzc2FnZVxuICBfcm91dGVEYXRhKGRhdGEpIHtcbiAgICBpZiAoZGF0YS5jb250ZW50KSB7XG4gICAgICBpZiAoIXRoaXMudG91Y2hlZCB8fCB0aGlzLnRvdWNoZWQgPCBkYXRhLnRzKSB7XG4gICAgICAgIHRoaXMudG91Y2hlZCA9IGRhdGEudHM7XG4gICAgICAgIHRoaXMuX3Rpbm9kZS5fZGIudXBkVG9waWModGhpcyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGRhdGEuc2VxID4gdGhpcy5fbWF4U2VxKSB7XG4gICAgICB0aGlzLl9tYXhTZXEgPSBkYXRhLnNlcTtcbiAgICAgIHRoaXMubXNnU3RhdHVzKGRhdGEsIHRydWUpO1xuICAgICAgLy8gQWNrbiByZWNlaXZpbmcgdGhlIG1lc3NhZ2UuXG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5fcmVjdk5vdGlmaWNhdGlvblRpbWVyKTtcbiAgICAgIHRoaXMuX3JlY3ZOb3RpZmljYXRpb25UaW1lciA9IHNldFRpbWVvdXQoXyA9PiB7XG4gICAgICAgIHRoaXMuX3JlY3ZOb3RpZmljYXRpb25UaW1lciA9IG51bGw7XG4gICAgICAgIHRoaXMubm90ZVJlY3YodGhpcy5fbWF4U2VxKTtcbiAgICAgIH0sIENvbnN0LlJFQ1ZfVElNRU9VVCk7XG4gICAgfVxuXG4gICAgaWYgKGRhdGEuc2VxIDwgdGhpcy5fbWluU2VxIHx8IHRoaXMuX21pblNlcSA9PSAwKSB7XG4gICAgICB0aGlzLl9taW5TZXEgPSBkYXRhLnNlcTtcbiAgICB9XG5cbiAgICBjb25zdCBvdXRnb2luZyA9ICgoIXRoaXMuaXNDaGFubmVsVHlwZSgpICYmICFkYXRhLmZyb20pIHx8IHRoaXMuX3Rpbm9kZS5pc01lKGRhdGEuZnJvbSkpO1xuXG4gICAgaWYgKGRhdGEuaGVhZCAmJiBkYXRhLmhlYWQud2VicnRjICYmIGRhdGEuaGVhZC5taW1lID09IERyYWZ0eS5nZXRDb250ZW50VHlwZSgpICYmIGRhdGEuY29udGVudCkge1xuICAgICAgLy8gUmV3cml0ZSBWQyBib2R5IHdpdGggaW5mbyBmcm9tIHRoZSBoZWFkZXJzLlxuICAgICAgZGF0YS5jb250ZW50ID0gRHJhZnR5LnVwZGF0ZVZpZGVvRW50KGRhdGEuY29udGVudCwge1xuICAgICAgICBzdGF0ZTogZGF0YS5oZWFkLndlYnJ0YyxcbiAgICAgICAgZHVyYXRpb246IGRhdGEuaGVhZFsnd2VicnRjLWR1cmF0aW9uJ10sXG4gICAgICAgIGluY29taW5nOiAhb3V0Z29pbmcsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoIWRhdGEuX25vRm9yd2FyZGluZykge1xuICAgICAgdGhpcy5fbWVzc2FnZXMucHV0KGRhdGEpO1xuICAgICAgdGhpcy5fdGlub2RlLl9kYi5hZGRNZXNzYWdlKGRhdGEpO1xuICAgICAgdGhpcy5fbWF5YmVVcGRhdGVNZXNzYWdlVmVyc2lvbnNDYWNoZShkYXRhKTtcbiAgICAgIHRoaXMuX3VwZGF0ZURlbGV0ZWRSYW5nZXMoKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vbkRhdGEpIHtcbiAgICAgIHRoaXMub25EYXRhKGRhdGEpO1xuICAgIH1cblxuICAgIC8vIFVwZGF0ZSBsb2NhbGx5IGNhY2hlZCBjb250YWN0IHdpdGggdGhlIG5ldyBtZXNzYWdlIGNvdW50LlxuICAgIGNvbnN0IHdoYXQgPSBvdXRnb2luZyA/ICdyZWFkJyA6ICdtc2cnO1xuICAgIHRoaXMuX3VwZGF0ZVJlYWRSZWN2KHdoYXQsIGRhdGEuc2VxLCBkYXRhLnRzKTtcbiAgICAvLyBOb3RpZnkgJ21lJyBsaXN0ZW5lcnMgb2YgdGhlIGNoYW5nZS5cbiAgICB0aGlzLl90aW5vZGUuZ2V0TWVUb3BpYygpLl9yZWZyZXNoQ29udGFjdCh3aGF0LCB0aGlzKTtcbiAgfVxuXG4gIC8vIFByb2Nlc3MgbWV0YWRhdGEgbWVzc2FnZVxuICBfcm91dGVNZXRhKG1ldGEpIHtcbiAgICBpZiAobWV0YS5kZXNjKSB7XG4gICAgICB0aGlzLl9wcm9jZXNzTWV0YURlc2MobWV0YS5kZXNjKTtcbiAgICB9XG4gICAgaWYgKG1ldGEuc3ViICYmIG1ldGEuc3ViLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMuX3Byb2Nlc3NNZXRhU3ViKG1ldGEuc3ViKTtcbiAgICB9XG4gICAgaWYgKG1ldGEuZGVsKSB7XG4gICAgICB0aGlzLl9wcm9jZXNzRGVsTWVzc2FnZXMobWV0YS5kZWwuY2xlYXIsIG1ldGEuZGVsLmRlbHNlcSk7XG4gICAgfVxuICAgIGlmIChtZXRhLnRhZ3MpIHtcbiAgICAgIHRoaXMuX3Byb2Nlc3NNZXRhVGFncyhtZXRhLnRhZ3MpO1xuICAgIH1cbiAgICBpZiAobWV0YS5jcmVkKSB7XG4gICAgICB0aGlzLl9wcm9jZXNzTWV0YUNyZWRzKG1ldGEuY3JlZCk7XG4gICAgfVxuICAgIGlmICh0aGlzLm9uTWV0YSkge1xuICAgICAgdGhpcy5vbk1ldGEobWV0YSk7XG4gICAgfVxuICB9XG4gIC8vIFByb2Nlc3MgcHJlc2VuY2UgY2hhbmdlIG1lc3NhZ2VcbiAgX3JvdXRlUHJlcyhwcmVzKSB7XG4gICAgbGV0IHVzZXIsIHVpZDtcbiAgICBzd2l0Y2ggKHByZXMud2hhdCkge1xuICAgICAgY2FzZSAnZGVsJzpcbiAgICAgICAgLy8gRGVsZXRlIGNhY2hlZCBtZXNzYWdlcy5cbiAgICAgICAgdGhpcy5fcHJvY2Vzc0RlbE1lc3NhZ2VzKHByZXMuY2xlYXIsIHByZXMuZGVsc2VxKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdvbic6XG4gICAgICBjYXNlICdvZmYnOlxuICAgICAgICAvLyBVcGRhdGUgb25saW5lIHN0YXR1cyBvZiBhIHN1YnNjcmlwdGlvbi5cbiAgICAgICAgdXNlciA9IHRoaXMuX3VzZXJzW3ByZXMuc3JjXTtcbiAgICAgICAgaWYgKHVzZXIpIHtcbiAgICAgICAgICB1c2VyLm9ubGluZSA9IHByZXMud2hhdCA9PSAnb24nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX3Rpbm9kZS5sb2dnZXIoXCJXQVJOSU5HOiBQcmVzZW5jZSB1cGRhdGUgZm9yIGFuIHVua25vd24gdXNlclwiLCB0aGlzLm5hbWUsIHByZXMuc3JjKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3Rlcm0nOlxuICAgICAgICAvLyBBdHRhY2htZW50IHRvIHRvcGljIGlzIHRlcm1pbmF0ZWQgcHJvYmFibHkgZHVlIHRvIGNsdXN0ZXIgcmVoYXNoaW5nLlxuICAgICAgICB0aGlzLl9yZXNldFN1YigpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3VwZCc6XG4gICAgICAgIC8vIEEgdG9waWMgc3Vic2NyaWJlciBoYXMgdXBkYXRlZCBoaXMgZGVzY3JpcHRpb24uXG4gICAgICAgIC8vIElzc3VlIHtnZXQgc3VifSBvbmx5IGlmIHRoZSBjdXJyZW50IHVzZXIgaGFzIG5vIHAycCB0b3BpY3Mgd2l0aCB0aGUgdXBkYXRlZCB1c2VyIChwMnAgbmFtZSBpcyBub3QgaW4gY2FjaGUpLlxuICAgICAgICAvLyBPdGhlcndpc2UgJ21lJyB3aWxsIGlzc3VlIGEge2dldCBkZXNjfSByZXF1ZXN0LlxuICAgICAgICBpZiAocHJlcy5zcmMgJiYgIXRoaXMuX3Rpbm9kZS5pc1RvcGljQ2FjaGVkKHByZXMuc3JjKSkge1xuICAgICAgICAgIHRoaXMuZ2V0TWV0YSh0aGlzLnN0YXJ0TWV0YVF1ZXJ5KCkud2l0aExhdGVyT25lU3ViKHByZXMuc3JjKS5idWlsZCgpKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2Fjcyc6XG4gICAgICAgIHVpZCA9IHByZXMuc3JjIHx8IHRoaXMuX3Rpbm9kZS5nZXRDdXJyZW50VXNlcklEKCk7XG4gICAgICAgIHVzZXIgPSB0aGlzLl91c2Vyc1t1aWRdO1xuICAgICAgICBpZiAoIXVzZXIpIHtcbiAgICAgICAgICAvLyBVcGRhdGUgZm9yIGFuIHVua25vd24gdXNlcjogbm90aWZpY2F0aW9uIG9mIGEgbmV3IHN1YnNjcmlwdGlvbi5cbiAgICAgICAgICBjb25zdCBhY3MgPSBuZXcgQWNjZXNzTW9kZSgpLnVwZGF0ZUFsbChwcmVzLmRhY3MpO1xuICAgICAgICAgIGlmIChhY3MgJiYgYWNzLm1vZGUgIT0gQWNjZXNzTW9kZS5fTk9ORSkge1xuICAgICAgICAgICAgdXNlciA9IHRoaXMuX2NhY2hlR2V0VXNlcih1aWQpO1xuICAgICAgICAgICAgaWYgKCF1c2VyKSB7XG4gICAgICAgICAgICAgIHVzZXIgPSB7XG4gICAgICAgICAgICAgICAgdXNlcjogdWlkLFxuICAgICAgICAgICAgICAgIGFjczogYWNzXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIHRoaXMuZ2V0TWV0YSh0aGlzLnN0YXJ0TWV0YVF1ZXJ5KCkud2l0aE9uZVN1Yih1bmRlZmluZWQsIHVpZCkuYnVpbGQoKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB1c2VyLmFjcyA9IGFjcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHVzZXIudXBkYXRlZCA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9wcm9jZXNzTWV0YVN1YihbdXNlcl0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBLbm93biB1c2VyXG4gICAgICAgICAgdXNlci5hY3MudXBkYXRlQWxsKHByZXMuZGFjcyk7XG4gICAgICAgICAgLy8gVXBkYXRlIHVzZXIncyBhY2Nlc3MgbW9kZS5cbiAgICAgICAgICB0aGlzLl9wcm9jZXNzTWV0YVN1Yihbe1xuICAgICAgICAgICAgdXNlcjogdWlkLFxuICAgICAgICAgICAgdXBkYXRlZDogbmV3IERhdGUoKSxcbiAgICAgICAgICAgIGFjczogdXNlci5hY3NcbiAgICAgICAgICB9XSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aGlzLl90aW5vZGUubG9nZ2VyKFwiSU5GTzogSWdub3JlZCBwcmVzZW5jZSB1cGRhdGVcIiwgcHJlcy53aGF0KTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vblByZXMpIHtcbiAgICAgIHRoaXMub25QcmVzKHByZXMpO1xuICAgIH1cbiAgfVxuICAvLyBQcm9jZXNzIHtpbmZvfSBtZXNzYWdlXG4gIF9yb3V0ZUluZm8oaW5mbykge1xuICAgIHN3aXRjaCAoaW5mby53aGF0KSB7XG4gICAgICBjYXNlICdyZWN2JzpcbiAgICAgIGNhc2UgJ3JlYWQnOlxuICAgICAgICBjb25zdCB1c2VyID0gdGhpcy5fdXNlcnNbaW5mby5mcm9tXTtcbiAgICAgICAgaWYgKHVzZXIpIHtcbiAgICAgICAgICB1c2VyW2luZm8ud2hhdF0gPSBpbmZvLnNlcTtcbiAgICAgICAgICBpZiAodXNlci5yZWN2IDwgdXNlci5yZWFkKSB7XG4gICAgICAgICAgICB1c2VyLnJlY3YgPSB1c2VyLnJlYWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG1zZyA9IHRoaXMubGF0ZXN0TWVzc2FnZSgpO1xuICAgICAgICBpZiAobXNnKSB7XG4gICAgICAgICAgdGhpcy5tc2dTdGF0dXMobXNnLCB0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIHRoaXMgaXMgYW4gdXBkYXRlIGZyb20gdGhlIGN1cnJlbnQgdXNlciwgdXBkYXRlIHRoZSBjYWNoZSB3aXRoIHRoZSBuZXcgY291bnQuXG4gICAgICAgIGlmICh0aGlzLl90aW5vZGUuaXNNZShpbmZvLmZyb20pKSB7XG4gICAgICAgICAgdGhpcy5fdXBkYXRlUmVhZFJlY3YoaW5mby53aGF0LCBpbmZvLnNlcSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBOb3RpZnkgJ21lJyBsaXN0ZW5lciBvZiB0aGUgc3RhdHVzIGNoYW5nZS5cbiAgICAgICAgdGhpcy5fdGlub2RlLmdldE1lVG9waWMoKS5fcmVmcmVzaENvbnRhY3QoaW5mby53aGF0LCB0aGlzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdrcCc6XG4gICAgICAgIC8vIERvIG5vdGhpbmcuXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnY2FsbCc6XG4gICAgICAgIC8vIERvIG5vdGhpbmcgaGVyZS5cbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aGlzLl90aW5vZGUubG9nZ2VyKFwiSU5GTzogSWdub3JlZCBpbmZvIHVwZGF0ZVwiLCBpbmZvLndoYXQpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm9uSW5mbykge1xuICAgICAgdGhpcy5vbkluZm8oaW5mbyk7XG4gICAgfVxuICB9XG4gIC8vIENhbGxlZCBieSBUaW5vZGUgd2hlbiBtZXRhLmRlc2MgcGFja2V0IGlzIHJlY2VpdmVkLlxuICAvLyBDYWxsZWQgYnkgJ21lJyB0b3BpYyBvbiBjb250YWN0IHVwZGF0ZSAoZGVzYy5fbm9Gb3J3YXJkaW5nIGlzIHRydWUpLlxuICBfcHJvY2Vzc01ldGFEZXNjKGRlc2MpIHtcbiAgICBpZiAodGhpcy5pc1AyUFR5cGUoKSkge1xuICAgICAgLy8gU3ludGhldGljIGRlc2MgbWF5IGluY2x1ZGUgZGVmYWNzIGZvciBwMnAgdG9waWNzIHdoaWNoIGlzIHVzZWxlc3MuXG4gICAgICAvLyBSZW1vdmUgaXQuXG4gICAgICBkZWxldGUgZGVzYy5kZWZhY3M7XG5cbiAgICAgIC8vIFVwZGF0ZSB0byBwMnAgZGVzYyBpcyB0aGUgc2FtZSBhcyB1c2VyIHVwZGF0ZS4gVXBkYXRlIGNhY2hlZCB1c2VyLlxuICAgICAgdGhpcy5fdGlub2RlLl9kYi51cGRVc2VyKHRoaXMubmFtZSwgZGVzYy5wdWJsaWMpO1xuICAgIH1cblxuICAgIC8vIENvcHkgcGFyYW1ldGVycyBmcm9tIGRlc2Mgb2JqZWN0IHRvIHRoaXMgdG9waWMuXG4gICAgbWVyZ2VPYmoodGhpcywgZGVzYyk7XG4gICAgLy8gVXBkYXRlIHBlcnNpc3RlbnQgY2FjaGUuXG4gICAgdGhpcy5fdGlub2RlLl9kYi51cGRUb3BpYyh0aGlzKTtcblxuICAgIC8vIE5vdGlmeSAnbWUnIGxpc3RlbmVyLCBpZiBhdmFpbGFibGU6XG4gICAgaWYgKHRoaXMubmFtZSAhPT0gQ29uc3QuVE9QSUNfTUUgJiYgIWRlc2MuX25vRm9yd2FyZGluZykge1xuICAgICAgY29uc3QgbWUgPSB0aGlzLl90aW5vZGUuZ2V0TWVUb3BpYygpO1xuICAgICAgaWYgKG1lLm9uTWV0YVN1Yikge1xuICAgICAgICBtZS5vbk1ldGFTdWIodGhpcyk7XG4gICAgICB9XG4gICAgICBpZiAobWUub25TdWJzVXBkYXRlZCkge1xuICAgICAgICBtZS5vblN1YnNVcGRhdGVkKFt0aGlzLm5hbWVdLCAxKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5vbk1ldGFEZXNjKSB7XG4gICAgICB0aGlzLm9uTWV0YURlc2ModGhpcyk7XG4gICAgfVxuICB9XG4gIC8vIENhbGxlZCBieSBUaW5vZGUgd2hlbiBtZXRhLnN1YiBpcyByZWNpdmVkIG9yIGluIHJlc3BvbnNlIHRvIHJlY2VpdmVkXG4gIC8vIHtjdHJsfSBhZnRlciBzZXRNZXRhLXN1Yi5cbiAgX3Byb2Nlc3NNZXRhU3ViKHN1YnMpIHtcbiAgICBmb3IgKGxldCBpZHggaW4gc3Vicykge1xuICAgICAgY29uc3Qgc3ViID0gc3Vic1tpZHhdO1xuXG4gICAgICAvLyBGaWxsIGRlZmF1bHRzLlxuICAgICAgc3ViLm9ubGluZSA9ICEhc3ViLm9ubGluZTtcbiAgICAgIC8vIFVwZGF0ZSB0aW1lc3RhbXAgb2YgdGhlIG1vc3QgcmVjZW50IHN1YnNjcmlwdGlvbiB1cGRhdGUuXG4gICAgICB0aGlzLl9sYXN0U3Vic1VwZGF0ZSA9IG5ldyBEYXRlKE1hdGgubWF4KHRoaXMuX2xhc3RTdWJzVXBkYXRlLCBzdWIudXBkYXRlZCkpO1xuXG4gICAgICBsZXQgdXNlciA9IG51bGw7XG4gICAgICBpZiAoIXN1Yi5kZWxldGVkKSB7XG4gICAgICAgIC8vIElmIHRoaXMgaXMgYSBjaGFuZ2UgdG8gdXNlcidzIG93biBwZXJtaXNzaW9ucywgdXBkYXRlIHRoZW0gaW4gdG9waWMgdG9vLlxuICAgICAgICAvLyBEZXNjIHdpbGwgdXBkYXRlICdtZScgdG9waWMuXG4gICAgICAgIGlmICh0aGlzLl90aW5vZGUuaXNNZShzdWIudXNlcikgJiYgc3ViLmFjcykge1xuICAgICAgICAgIHRoaXMuX3Byb2Nlc3NNZXRhRGVzYyh7XG4gICAgICAgICAgICB1cGRhdGVkOiBzdWIudXBkYXRlZCxcbiAgICAgICAgICAgIHRvdWNoZWQ6IHN1Yi50b3VjaGVkLFxuICAgICAgICAgICAgYWNzOiBzdWIuYWNzXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdXNlciA9IHRoaXMuX3VwZGF0ZUNhY2hlZFVzZXIoc3ViLnVzZXIsIHN1Yik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBTdWJzY3JpcHRpb24gaXMgZGVsZXRlZCwgcmVtb3ZlIGl0IGZyb20gdG9waWMgKGJ1dCBsZWF2ZSBpbiBVc2VycyBjYWNoZSlcbiAgICAgICAgZGVsZXRlIHRoaXMuX3VzZXJzW3N1Yi51c2VyXTtcbiAgICAgICAgdXNlciA9IHN1YjtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMub25NZXRhU3ViKSB7XG4gICAgICAgIHRoaXMub25NZXRhU3ViKHVzZXIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLm9uU3Vic1VwZGF0ZWQpIHtcbiAgICAgIHRoaXMub25TdWJzVXBkYXRlZChPYmplY3Qua2V5cyh0aGlzLl91c2VycykpO1xuICAgIH1cbiAgfVxuICAvLyBDYWxsZWQgYnkgVGlub2RlIHdoZW4gbWV0YS50YWdzIGlzIHJlY2l2ZWQuXG4gIF9wcm9jZXNzTWV0YVRhZ3ModGFncykge1xuICAgIGlmICh0YWdzLmxlbmd0aCA9PSAxICYmIHRhZ3NbMF0gPT0gQ29uc3QuREVMX0NIQVIpIHtcbiAgICAgIHRhZ3MgPSBbXTtcbiAgICB9XG4gICAgdGhpcy5fdGFncyA9IHRhZ3M7XG4gICAgaWYgKHRoaXMub25UYWdzVXBkYXRlZCkge1xuICAgICAgdGhpcy5vblRhZ3NVcGRhdGVkKHRhZ3MpO1xuICAgIH1cbiAgfVxuICAvLyBEbyBub3RoaW5nIGZvciB0b3BpY3Mgb3RoZXIgdGhhbiAnbWUnXG4gIF9wcm9jZXNzTWV0YUNyZWRzKGNyZWRzKSB7fVxuICAvLyBEZWxldGUgY2FjaGVkIG1lc3NhZ2VzIGFuZCB1cGRhdGUgY2FjaGVkIHRyYW5zYWN0aW9uIElEc1xuICBfcHJvY2Vzc0RlbE1lc3NhZ2VzKGNsZWFyLCBkZWxzZXEpIHtcbiAgICB0aGlzLl9tYXhEZWwgPSBNYXRoLm1heChjbGVhciwgdGhpcy5fbWF4RGVsKTtcbiAgICB0aGlzLmNsZWFyID0gTWF0aC5tYXgoY2xlYXIsIHRoaXMuY2xlYXIpO1xuICAgIGNvbnN0IHRvcGljID0gdGhpcztcbiAgICBsZXQgY291bnQgPSAwO1xuICAgIGlmIChBcnJheS5pc0FycmF5KGRlbHNlcSkpIHtcbiAgICAgIGRlbHNlcS5mb3JFYWNoKGZ1bmN0aW9uKHJhbmdlKSB7XG4gICAgICAgIGlmICghcmFuZ2UuaGkpIHtcbiAgICAgICAgICBjb3VudCsrO1xuICAgICAgICAgIHRvcGljLmZsdXNoTWVzc2FnZShyYW5nZS5sb3cpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZvciAobGV0IGkgPSByYW5nZS5sb3c7IGkgPCByYW5nZS5oaTsgaSsrKSB7XG4gICAgICAgICAgICBjb3VudCsrO1xuICAgICAgICAgICAgdG9waWMuZmx1c2hNZXNzYWdlKGkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKGNvdW50ID4gMCkge1xuICAgICAgdGhpcy5fdXBkYXRlRGVsZXRlZFJhbmdlcygpO1xuXG4gICAgICBpZiAodGhpcy5vbkRhdGEpIHtcbiAgICAgICAgdGhpcy5vbkRhdGEoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgLy8gVG9waWMgaXMgaW5mb3JtZWQgdGhhdCB0aGUgZW50aXJlIHJlc3BvbnNlIHRvIHtnZXQgd2hhdD1kYXRhfSBoYXMgYmVlbiByZWNlaXZlZC5cbiAgX2FsbE1lc3NhZ2VzUmVjZWl2ZWQoY291bnQpIHtcbiAgICB0aGlzLl91cGRhdGVEZWxldGVkUmFuZ2VzKCk7XG5cbiAgICBpZiAodGhpcy5vbkFsbE1lc3NhZ2VzUmVjZWl2ZWQpIHtcbiAgICAgIHRoaXMub25BbGxNZXNzYWdlc1JlY2VpdmVkKGNvdW50KTtcbiAgICB9XG4gIH1cbiAgLy8gUmVzZXQgc3Vic2NyaWJlZCBzdGF0ZVxuICBfcmVzZXRTdWIoKSB7XG4gICAgdGhpcy5fYXR0YWNoZWQgPSBmYWxzZTtcbiAgfVxuICAvLyBUaGlzIHRvcGljIGlzIGVpdGhlciBkZWxldGVkIG9yIHVuc3Vic2NyaWJlZCBmcm9tLlxuICBfZ29uZSgpIHtcbiAgICB0aGlzLl9tZXNzYWdlcy5yZXNldCgpO1xuICAgIHRoaXMuX3Rpbm9kZS5fZGIucmVtTWVzc2FnZXModGhpcy5uYW1lKTtcbiAgICB0aGlzLl91c2VycyA9IHt9O1xuICAgIHRoaXMuYWNzID0gbmV3IEFjY2Vzc01vZGUobnVsbCk7XG4gICAgdGhpcy5wcml2YXRlID0gbnVsbDtcbiAgICB0aGlzLnB1YmxpYyA9IG51bGw7XG4gICAgdGhpcy50cnVzdGVkID0gbnVsbDtcbiAgICB0aGlzLl9tYXhTZXEgPSAwO1xuICAgIHRoaXMuX21pblNlcSA9IDA7XG4gICAgdGhpcy5fYXR0YWNoZWQgPSBmYWxzZTtcblxuICAgIGNvbnN0IG1lID0gdGhpcy5fdGlub2RlLmdldE1lVG9waWMoKTtcbiAgICBpZiAobWUpIHtcbiAgICAgIG1lLl9yb3V0ZVByZXMoe1xuICAgICAgICBfbm9Gb3J3YXJkaW5nOiB0cnVlLFxuICAgICAgICB3aGF0OiAnZ29uZScsXG4gICAgICAgIHRvcGljOiBDb25zdC5UT1BJQ19NRSxcbiAgICAgICAgc3JjOiB0aGlzLm5hbWVcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAodGhpcy5vbkRlbGV0ZVRvcGljKSB7XG4gICAgICB0aGlzLm9uRGVsZXRlVG9waWMoKTtcbiAgICB9XG4gIH1cbiAgLy8gVXBkYXRlIGdsb2JhbCB1c2VyIGNhY2hlIGFuZCBsb2NhbCBzdWJzY3JpYmVycyBjYWNoZS5cbiAgLy8gRG9uJ3QgY2FsbCB0aGlzIG1ldGhvZCBmb3Igbm9uLXN1YnNjcmliZXJzLlxuICBfdXBkYXRlQ2FjaGVkVXNlcih1aWQsIG9iaikge1xuICAgIC8vIEZldGNoIHVzZXIgb2JqZWN0IGZyb20gdGhlIGdsb2JhbCBjYWNoZS5cbiAgICAvLyBUaGlzIGlzIGEgY2xvbmUgb2YgdGhlIHN0b3JlZCBvYmplY3RcbiAgICBsZXQgY2FjaGVkID0gdGhpcy5fY2FjaGVHZXRVc2VyKHVpZCk7XG4gICAgY2FjaGVkID0gbWVyZ2VPYmooY2FjaGVkIHx8IHt9LCBvYmopO1xuICAgIC8vIFNhdmUgdG8gZ2xvYmFsIGNhY2hlXG4gICAgdGhpcy5fY2FjaGVQdXRVc2VyKHVpZCwgY2FjaGVkKTtcbiAgICAvLyBTYXZlIHRvIHRoZSBsaXN0IG9mIHRvcGljIHN1YnNyaWJlcnMuXG4gICAgcmV0dXJuIG1lcmdlVG9DYWNoZSh0aGlzLl91c2VycywgdWlkLCBjYWNoZWQpO1xuICB9XG4gIC8vIEdldCBsb2NhbCBzZXFJZCBmb3IgYSBxdWV1ZWQgbWVzc2FnZS5cbiAgX2dldFF1ZXVlZFNlcUlkKCkge1xuICAgIHJldHVybiB0aGlzLl9xdWV1ZWRTZXFJZCsrO1xuICB9XG4gIC8vIENhbGN1bGF0ZSByYW5nZXMgb2YgbWlzc2luZyBtZXNzYWdlcy5cbiAgX3VwZGF0ZURlbGV0ZWRSYW5nZXMoKSB7XG4gICAgY29uc3QgcmFuZ2VzID0gW107XG5cbiAgICAvLyBHYXAgbWFya2VyLCBwb3NzaWJseSBlbXB0eS5cbiAgICBsZXQgcHJldiA9IG51bGw7XG5cbiAgICAvLyBDaGVjayBmb3IgZ2FwIGluIHRoZSBiZWdpbm5pbmcsIGJlZm9yZSB0aGUgZmlyc3QgbWVzc2FnZS5cbiAgICBjb25zdCBmaXJzdCA9IHRoaXMuX21lc3NhZ2VzLmdldEF0KDApO1xuICAgIGlmIChmaXJzdCAmJiB0aGlzLl9taW5TZXEgPiAxICYmICF0aGlzLl9ub0VhcmxpZXJNc2dzKSB7XG4gICAgICAvLyBTb21lIG1lc3NhZ2VzIGFyZSBtaXNzaW5nIGluIHRoZSBiZWdpbm5pbmcuXG4gICAgICBpZiAoZmlyc3QuaGkpIHtcbiAgICAgICAgLy8gVGhlIGZpcnN0IG1lc3NhZ2UgYWxyZWFkeSByZXByZXNlbnRzIGEgZ2FwLlxuICAgICAgICBpZiAoZmlyc3Quc2VxID4gMSkge1xuICAgICAgICAgIGZpcnN0LnNlcSA9IDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZpcnN0LmhpIDwgdGhpcy5fbWluU2VxIC0gMSkge1xuICAgICAgICAgIGZpcnN0LmhpID0gdGhpcy5fbWluU2VxIC0gMTtcbiAgICAgICAgfVxuICAgICAgICBwcmV2ID0gZmlyc3Q7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBDcmVhdGUgbmV3IGdhcC5cbiAgICAgICAgcHJldiA9IHtcbiAgICAgICAgICBzZXE6IDEsXG4gICAgICAgICAgaGk6IHRoaXMuX21pblNlcSAtIDFcbiAgICAgICAgfTtcbiAgICAgICAgcmFuZ2VzLnB1c2gocHJldik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIE5vIGdhcCBpbiB0aGUgYmVnaW5uaW5nLlxuICAgICAgcHJldiA9IHtcbiAgICAgICAgc2VxOiAwLFxuICAgICAgICBoaTogMFxuICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBGaW5kIG5ldyBnYXBzIGluIHRoZSBsaXN0IG9mIHJlY2VpdmVkIG1lc3NhZ2VzLiBUaGUgbGlzdCBjb250YWlucyBtZXNzYWdlcy1wcm9wZXIgYXMgd2VsbFxuICAgIC8vIGFzIHBsYWNlaG9sZGVycyBmb3IgZGVsZXRlZCByYW5nZXMuXG4gICAgLy8gVGhlIG1lc3NhZ2VzIGFyZSBpdGVyYXRlZCBieSBzZXEgSUQgaW4gYXNjZW5kaW5nIG9yZGVyLlxuICAgIHRoaXMuX21lc3NhZ2VzLmZpbHRlcigoZGF0YSkgPT4ge1xuICAgICAgLy8gRG8gbm90IGNyZWF0ZSBhIGdhcCBiZXR3ZWVuIHRoZSBsYXN0IHNlbnQgbWVzc2FnZSBhbmQgdGhlIGZpcnN0IHVuc2VudCBhcyB3ZWxsIGFzIGJldHdlZW4gdW5zZW50IG1lc3NhZ2VzLlxuICAgICAgaWYgKGRhdGEuc2VxID49IENvbnN0LkxPQ0FMX1NFUUlEKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBDaGVjayBmb3IgYSBnYXAgYmV0d2VlbiB0aGUgcHJldmlvdXMgbWVzc2FnZS9tYXJrZXIgYW5kIHRoaXMgbWVzc2FnZS9tYXJrZXIuXG4gICAgICBpZiAoZGF0YS5zZXEgPT0gKHByZXYuaGkgfHwgcHJldi5zZXEpICsgMSkge1xuICAgICAgICAvLyBObyBnYXAgYmV0d2VlbiB0aGlzIG1lc3NhZ2UgYW5kIHRoZSBwcmV2aW91cy5cbiAgICAgICAgaWYgKGRhdGEuaGkgJiYgcHJldi5oaSkge1xuICAgICAgICAgIC8vIFR3byBnYXAgbWFya2VycyBpbiBhIHJvdy4gRXh0ZW5kIHRoZSBwcmV2aW91cyBvbmUsIGRpc2NhcmQgdGhlIGN1cnJlbnQuXG4gICAgICAgICAgcHJldi5oaSA9IGRhdGEuaGk7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHByZXYgPSBkYXRhO1xuXG4gICAgICAgIC8vIEtlZXAgY3VycmVudC5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIC8vIEZvdW5kIGEgbmV3IGdhcC5cbiAgICAgIC8vIENoZWNrIGlmIHRoZSBwcmV2aW91cyBpcyBhbHNvIGEgZ2FwIG1hcmtlci5cbiAgICAgIGlmIChwcmV2LmhpKSB7XG4gICAgICAgIC8vIEFsdGVyIGl0IGluc3RlYWQgb2YgY3JlYXRpbmcgYSBuZXcgb25lLlxuICAgICAgICBwcmV2LmhpID0gZGF0YS5oaSB8fCBkYXRhLnNlcTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFByZXZpb3VzIGlzIG5vdCBhIGdhcCBtYXJrZXIuIENyZWF0ZSBhIG5ldyBvbmUuXG4gICAgICAgIHByZXYgPSB7XG4gICAgICAgICAgc2VxOiBwcmV2LnNlcSArIDEsXG4gICAgICAgICAgaGk6IGRhdGEuaGkgfHwgZGF0YS5zZXFcbiAgICAgICAgfTtcbiAgICAgICAgcmFuZ2VzLnB1c2gocHJldik7XG4gICAgICB9XG5cbiAgICAgIC8vIElmIG1hcmtlciwgcmVtb3ZlOyBrZWVwIGlmIHJlZ3VsYXIgbWVzc2FnZS5cbiAgICAgIGlmICghZGF0YS5oaSkge1xuICAgICAgICAvLyBLZWVwaW5nIHRoZSBjdXJyZW50IHJlZ3VsYXIgbWVzc2FnZSwgc2F2ZSBpdCBhcyBwcmV2aW91cy5cbiAgICAgICAgcHJldiA9IGRhdGE7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBEaXNjYXJkIHRoZSBjdXJyZW50IGdhcCBtYXJrZXI6IHdlIGVpdGhlciBjcmVhdGVkIGFuIGVhcmxpZXIgZ2FwLCBvciBleHRlbmRlZCB0aGUgcHJldm91cyBvbmUuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSk7XG5cbiAgICAvLyBDaGVjayBmb3IgbWlzc2luZyBtZXNzYWdlcyBhdCB0aGUgZW5kLlxuICAgIC8vIEFsbCBtZXNzYWdlcyBjb3VsZCBiZSBtaXNzaW5nIG9yIGl0IGNvdWxkIGJlIGEgbmV3IHRvcGljIHdpdGggbm8gbWVzc2FnZXMuXG4gICAgY29uc3QgbGFzdCA9IHRoaXMuX21lc3NhZ2VzLmdldExhc3QoKTtcbiAgICBjb25zdCBtYXhTZXEgPSBNYXRoLm1heCh0aGlzLnNlcSwgdGhpcy5fbWF4U2VxKSB8fCAwO1xuICAgIGlmICgobWF4U2VxID4gMCAmJiAhbGFzdCkgfHwgKGxhc3QgJiYgKChsYXN0LmhpIHx8IGxhc3Quc2VxKSA8IG1heFNlcSkpKSB7XG4gICAgICBpZiAobGFzdCAmJiBsYXN0LmhpKSB7XG4gICAgICAgIC8vIEV4dGVuZCBleGlzdGluZyBnYXBcbiAgICAgICAgbGFzdC5oaSA9IG1heFNlcTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIENyZWF0ZSBuZXcgZ2FwLlxuICAgICAgICByYW5nZXMucHVzaCh7XG4gICAgICAgICAgc2VxOiBsYXN0ID8gbGFzdC5zZXEgKyAxIDogMSxcbiAgICAgICAgICBoaTogbWF4U2VxXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEluc2VydCBuZXcgZ2FwcyBpbnRvIGNhY2hlLlxuICAgIHJhbmdlcy5mb3JFYWNoKChnYXApID0+IHtcbiAgICAgIGdhcC5fc3RhdHVzID0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfREVMX1JBTkdFO1xuICAgICAgdGhpcy5fbWVzc2FnZXMucHV0KGdhcCk7XG4gICAgfSk7XG4gIH1cbiAgLy8gTG9hZCBtb3N0IHJlY2VudCBtZXNzYWdlcyBmcm9tIHBlcnNpc3RlbnQgY2FjaGUuXG4gIF9sb2FkTWVzc2FnZXMoZGIsIHBhcmFtcykge1xuICAgIGNvbnN0IHtcbiAgICAgIHNpbmNlLFxuICAgICAgYmVmb3JlLFxuICAgICAgbGltaXRcbiAgICB9ID0gcGFyYW1zIHx8IHt9O1xuICAgIHJldHVybiBkYi5yZWFkTWVzc2FnZXModGhpcy5uYW1lLCB7XG4gICAgICAgIHNpbmNlOiBzaW5jZSxcbiAgICAgICAgYmVmb3JlOiBiZWZvcmUsXG4gICAgICAgIGxpbWl0OiBsaW1pdCB8fCBDb25zdC5ERUZBVUxUX01FU1NBR0VTX1BBR0VcbiAgICAgIH0pXG4gICAgICAudGhlbigobXNncykgPT4ge1xuICAgICAgICBtc2dzLmZvckVhY2goKGRhdGEpID0+IHtcbiAgICAgICAgICBpZiAoZGF0YS5zZXEgPiB0aGlzLl9tYXhTZXEpIHtcbiAgICAgICAgICAgIHRoaXMuX21heFNlcSA9IGRhdGEuc2VxO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZGF0YS5zZXEgPCB0aGlzLl9taW5TZXEgfHwgdGhpcy5fbWluU2VxID09IDApIHtcbiAgICAgICAgICAgIHRoaXMuX21pblNlcSA9IGRhdGEuc2VxO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLl9tZXNzYWdlcy5wdXQoZGF0YSk7XG4gICAgICAgICAgdGhpcy5fbWF5YmVVcGRhdGVNZXNzYWdlVmVyc2lvbnNDYWNoZShkYXRhKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChtc2dzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICB0aGlzLl91cGRhdGVEZWxldGVkUmFuZ2VzKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1zZ3MubGVuZ3RoO1xuICAgICAgfSk7XG4gIH1cbiAgLy8gUHVzaCBvciB7cHJlc306IG1lc3NhZ2UgcmVjZWl2ZWQuXG4gIF91cGRhdGVSZWNlaXZlZChzZXEsIGFjdCkge1xuICAgIHRoaXMudG91Y2hlZCA9IG5ldyBEYXRlKCk7XG4gICAgdGhpcy5zZXEgPSBzZXEgfCAwO1xuICAgIC8vIENoZWNrIGlmIG1lc3NhZ2UgaXMgc2VudCBieSB0aGUgY3VycmVudCB1c2VyLiBJZiBzbyBpdCdzIGJlZW4gcmVhZCBhbHJlYWR5LlxuICAgIGlmICghYWN0IHx8IHRoaXMuX3Rpbm9kZS5pc01lKGFjdCkpIHtcbiAgICAgIHRoaXMucmVhZCA9IHRoaXMucmVhZCA/IE1hdGgubWF4KHRoaXMucmVhZCwgdGhpcy5zZXEpIDogdGhpcy5zZXE7XG4gICAgICB0aGlzLnJlY3YgPSB0aGlzLnJlY3YgPyBNYXRoLm1heCh0aGlzLnJlYWQsIHRoaXMucmVjdikgOiB0aGlzLnJlYWQ7XG4gICAgfVxuICAgIHRoaXMudW5yZWFkID0gdGhpcy5zZXEgLSAodGhpcy5yZWFkIHwgMCk7XG4gICAgdGhpcy5fdGlub2RlLl9kYi51cGRUb3BpYyh0aGlzKTtcbiAgfVxufVxuXG5cbi8qKlxuICogQGNsYXNzIFRvcGljTWUgLSBzcGVjaWFsIGNhc2Ugb2Yge0BsaW5rIFRpbm9kZS5Ub3BpY30gZm9yXG4gKiBtYW5hZ2luZyBkYXRhIG9mIHRoZSBjdXJyZW50IHVzZXIsIGluY2x1ZGluZyBjb250YWN0IGxpc3QuXG4gKiBAZXh0ZW5kcyBUaW5vZGUuVG9waWNcbiAqIEBtZW1iZXJvZiBUaW5vZGVcbiAqXG4gKiBAcGFyYW0ge1RvcGljTWUuQ2FsbGJhY2tzfSBjYWxsYmFja3MgLSBDYWxsYmFja3MgdG8gcmVjZWl2ZSB2YXJpb3VzIGV2ZW50cy5cbiAqL1xuLyoqXG4gKiBAY2xhc3MgVG9waWNNZSAtIHNwZWNpYWwgY2FzZSBvZiB7QGxpbmsgVGlub2RlLlRvcGljfSBmb3JcbiAqIG1hbmFnaW5nIGRhdGEgb2YgdGhlIGN1cnJlbnQgdXNlciwgaW5jbHVkaW5nIGNvbnRhY3QgbGlzdC5cbiAqIEBleHRlbmRzIFRpbm9kZS5Ub3BpY1xuICogQG1lbWJlcm9mIFRpbm9kZVxuICpcbiAqIEBwYXJhbSB7VG9waWNNZS5DYWxsYmFja3N9IGNhbGxiYWNrcyAtIENhbGxiYWNrcyB0byByZWNlaXZlIHZhcmlvdXMgZXZlbnRzLlxuICovXG5leHBvcnQgY2xhc3MgVG9waWNNZSBleHRlbmRzIFRvcGljIHtcbiAgb25Db250YWN0VXBkYXRlO1xuXG4gIGNvbnN0cnVjdG9yKGNhbGxiYWNrcykge1xuICAgIHN1cGVyKENvbnN0LlRPUElDX01FLCBjYWxsYmFja3MpO1xuXG4gICAgLy8gbWUtc3BlY2lmaWMgY2FsbGJhY2tzXG4gICAgaWYgKGNhbGxiYWNrcykge1xuICAgICAgdGhpcy5vbkNvbnRhY3RVcGRhdGUgPSBjYWxsYmFja3Mub25Db250YWN0VXBkYXRlO1xuICAgIH1cbiAgfVxuXG4gIC8vIE92ZXJyaWRlIHRoZSBvcmlnaW5hbCBUb3BpYy5fcHJvY2Vzc01ldGFEZXNjLlxuICBfcHJvY2Vzc01ldGFEZXNjKGRlc2MpIHtcbiAgICAvLyBDaGVjayBpZiBvbmxpbmUgY29udGFjdHMgbmVlZCB0byBiZSB0dXJuZWQgb2ZmIGJlY2F1c2UgUCBwZXJtaXNzaW9uIHdhcyByZW1vdmVkLlxuICAgIGNvbnN0IHR1cm5PZmYgPSAoZGVzYy5hY3MgJiYgIWRlc2MuYWNzLmlzUHJlc2VuY2VyKCkpICYmICh0aGlzLmFjcyAmJiB0aGlzLmFjcy5pc1ByZXNlbmNlcigpKTtcblxuICAgIC8vIENvcHkgcGFyYW1ldGVycyBmcm9tIGRlc2Mgb2JqZWN0IHRvIHRoaXMgdG9waWMuXG4gICAgbWVyZ2VPYmoodGhpcywgZGVzYyk7XG4gICAgdGhpcy5fdGlub2RlLl9kYi51cGRUb3BpYyh0aGlzKTtcbiAgICAvLyBVcGRhdGUgY3VycmVudCB1c2VyJ3MgcmVjb3JkIGluIHRoZSBnbG9iYWwgY2FjaGUuXG4gICAgdGhpcy5fdXBkYXRlQ2FjaGVkVXNlcih0aGlzLl90aW5vZGUuX215VUlELCBkZXNjKTtcblxuICAgIC8vICdQJyBwZXJtaXNzaW9uIHdhcyByZW1vdmVkLiBBbGwgdG9waWNzIGFyZSBvZmZsaW5lIG5vdy5cbiAgICBpZiAodHVybk9mZikge1xuICAgICAgdGhpcy5fdGlub2RlLm1hcFRvcGljcygoY29udCkgPT4ge1xuICAgICAgICBpZiAoY29udC5vbmxpbmUpIHtcbiAgICAgICAgICBjb250Lm9ubGluZSA9IGZhbHNlO1xuICAgICAgICAgIGNvbnQuc2VlbiA9IE9iamVjdC5hc3NpZ24oY29udC5zZWVuIHx8IHt9LCB7XG4gICAgICAgICAgICB3aGVuOiBuZXcgRGF0ZSgpXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdGhpcy5fcmVmcmVzaENvbnRhY3QoJ29mZicsIGNvbnQpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vbk1ldGFEZXNjKSB7XG4gICAgICB0aGlzLm9uTWV0YURlc2ModGhpcyk7XG4gICAgfVxuICB9XG5cbiAgLy8gT3ZlcnJpZGUgdGhlIG9yaWdpbmFsIFRvcGljLl9wcm9jZXNzTWV0YVN1YlxuICBfcHJvY2Vzc01ldGFTdWIoc3Vicykge1xuICAgIGxldCB1cGRhdGVDb3VudCA9IDA7XG4gICAgc3Vicy5mb3JFYWNoKChzdWIpID0+IHtcbiAgICAgIGNvbnN0IHRvcGljTmFtZSA9IHN1Yi50b3BpYztcbiAgICAgIC8vIERvbid0IHNob3cgJ21lJyBhbmQgJ2ZuZCcgdG9waWNzIGluIHRoZSBsaXN0IG9mIGNvbnRhY3RzLlxuICAgICAgaWYgKHRvcGljTmFtZSA9PSBDb25zdC5UT1BJQ19GTkQgfHwgdG9waWNOYW1lID09IENvbnN0LlRPUElDX01FKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHN1Yi5vbmxpbmUgPSAhIXN1Yi5vbmxpbmU7XG5cbiAgICAgIGxldCBjb250ID0gbnVsbDtcbiAgICAgIGlmIChzdWIuZGVsZXRlZCkge1xuICAgICAgICBjb250ID0gc3ViO1xuICAgICAgICB0aGlzLl90aW5vZGUuY2FjaGVSZW1Ub3BpYyh0b3BpY05hbWUpO1xuICAgICAgICB0aGlzLl90aW5vZGUuX2RiLnJlbVRvcGljKHRvcGljTmFtZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBFbnN1cmUgdGhlIHZhbHVlcyBhcmUgZGVmaW5lZCBhbmQgYXJlIGludGVnZXJzLlxuICAgICAgICBpZiAodHlwZW9mIHN1Yi5zZXEgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICBzdWIuc2VxID0gc3ViLnNlcSB8IDA7XG4gICAgICAgICAgc3ViLnJlY3YgPSBzdWIucmVjdiB8IDA7XG4gICAgICAgICAgc3ViLnJlYWQgPSBzdWIucmVhZCB8IDA7XG4gICAgICAgICAgc3ViLnVucmVhZCA9IHN1Yi5zZXEgLSBzdWIucmVhZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHRvcGljID0gdGhpcy5fdGlub2RlLmdldFRvcGljKHRvcGljTmFtZSk7XG4gICAgICAgIGlmICh0b3BpYy5fbmV3KSB7XG4gICAgICAgICAgZGVsZXRlIHRvcGljLl9uZXc7XG4gICAgICAgIH1cblxuICAgICAgICBjb250ID0gbWVyZ2VPYmoodG9waWMsIHN1Yik7XG4gICAgICAgIHRoaXMuX3Rpbm9kZS5fZGIudXBkVG9waWMoY29udCk7XG5cbiAgICAgICAgaWYgKFRvcGljLmlzUDJQVG9waWNOYW1lKHRvcGljTmFtZSkpIHtcbiAgICAgICAgICB0aGlzLl9jYWNoZVB1dFVzZXIodG9waWNOYW1lLCBjb250KTtcbiAgICAgICAgICB0aGlzLl90aW5vZGUuX2RiLnVwZFVzZXIodG9waWNOYW1lLCBjb250LnB1YmxpYyk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gTm90aWZ5IHRvcGljIG9mIHRoZSB1cGRhdGUgaWYgaXQncyBhbiBleHRlcm5hbCB1cGRhdGUuXG4gICAgICAgIGlmICghc3ViLl9ub0ZvcndhcmRpbmcgJiYgdG9waWMpIHtcbiAgICAgICAgICBzdWIuX25vRm9yd2FyZGluZyA9IHRydWU7XG4gICAgICAgICAgdG9waWMuX3Byb2Nlc3NNZXRhRGVzYyhzdWIpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHVwZGF0ZUNvdW50Kys7XG5cbiAgICAgIGlmICh0aGlzLm9uTWV0YVN1Yikge1xuICAgICAgICB0aGlzLm9uTWV0YVN1Yihjb250KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmICh0aGlzLm9uU3Vic1VwZGF0ZWQgJiYgdXBkYXRlQ291bnQgPiAwKSB7XG4gICAgICBjb25zdCBrZXlzID0gW107XG4gICAgICBzdWJzLmZvckVhY2goKHMpID0+IHtcbiAgICAgICAga2V5cy5wdXNoKHMudG9waWMpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLm9uU3Vic1VwZGF0ZWQoa2V5cywgdXBkYXRlQ291bnQpO1xuICAgIH1cbiAgfVxuXG4gIC8vIENhbGxlZCBieSBUaW5vZGUgd2hlbiBtZXRhLnN1YiBpcyByZWNpdmVkLlxuICBfcHJvY2Vzc01ldGFDcmVkcyhjcmVkcywgdXBkKSB7XG4gICAgaWYgKGNyZWRzLmxlbmd0aCA9PSAxICYmIGNyZWRzWzBdID09IENvbnN0LkRFTF9DSEFSKSB7XG4gICAgICBjcmVkcyA9IFtdO1xuICAgIH1cbiAgICBpZiAodXBkKSB7XG4gICAgICBjcmVkcy5mb3JFYWNoKChjcikgPT4ge1xuICAgICAgICBpZiAoY3IudmFsKSB7XG4gICAgICAgICAgLy8gQWRkaW5nIGEgY3JlZGVudGlhbC5cbiAgICAgICAgICBsZXQgaWR4ID0gdGhpcy5fY3JlZGVudGlhbHMuZmluZEluZGV4KChlbCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGVsLm1ldGggPT0gY3IubWV0aCAmJiBlbC52YWwgPT0gY3IudmFsO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmIChpZHggPCAwKSB7XG4gICAgICAgICAgICAvLyBOb3QgZm91bmQuXG4gICAgICAgICAgICBpZiAoIWNyLmRvbmUpIHtcbiAgICAgICAgICAgICAgLy8gVW5jb25maXJtZWQgY3JlZGVudGlhbCByZXBsYWNlcyBwcmV2aW91cyB1bmNvbmZpcm1lZCBjcmVkZW50aWFsIG9mIHRoZSBzYW1lIG1ldGhvZC5cbiAgICAgICAgICAgICAgaWR4ID0gdGhpcy5fY3JlZGVudGlhbHMuZmluZEluZGV4KChlbCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBlbC5tZXRoID09IGNyLm1ldGggJiYgIWVsLmRvbmU7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBpZiAoaWR4ID49IDApIHtcbiAgICAgICAgICAgICAgICAvLyBSZW1vdmUgcHJldmlvdXMgdW5jb25maXJtZWQgY3JlZGVudGlhbC5cbiAgICAgICAgICAgICAgICB0aGlzLl9jcmVkZW50aWFscy5zcGxpY2UoaWR4LCAxKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fY3JlZGVudGlhbHMucHVzaChjcik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIEZvdW5kLiBNYXliZSBjaGFuZ2UgJ2RvbmUnIHN0YXR1cy5cbiAgICAgICAgICAgIHRoaXMuX2NyZWRlbnRpYWxzW2lkeF0uZG9uZSA9IGNyLmRvbmU7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGNyLnJlc3ApIHtcbiAgICAgICAgICAvLyBIYW5kbGUgY3JlZGVudGlhbCBjb25maXJtYXRpb24uXG4gICAgICAgICAgY29uc3QgaWR4ID0gdGhpcy5fY3JlZGVudGlhbHMuZmluZEluZGV4KChlbCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGVsLm1ldGggPT0gY3IubWV0aCAmJiAhZWwuZG9uZTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAoaWR4ID49IDApIHtcbiAgICAgICAgICAgIHRoaXMuX2NyZWRlbnRpYWxzW2lkeF0uZG9uZSA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fY3JlZGVudGlhbHMgPSBjcmVkcztcbiAgICB9XG4gICAgaWYgKHRoaXMub25DcmVkc1VwZGF0ZWQpIHtcbiAgICAgIHRoaXMub25DcmVkc1VwZGF0ZWQodGhpcy5fY3JlZGVudGlhbHMpO1xuICAgIH1cbiAgfVxuXG4gIC8vIFByb2Nlc3MgcHJlc2VuY2UgY2hhbmdlIG1lc3NhZ2VcbiAgX3JvdXRlUHJlcyhwcmVzKSB7XG4gICAgaWYgKHByZXMud2hhdCA9PSAndGVybScpIHtcbiAgICAgIC8vIFRoZSAnbWUnIHRvcGljIGl0c2VsZiBpcyBkZXRhY2hlZC4gTWFyayBhcyB1bnN1YnNjcmliZWQuXG4gICAgICB0aGlzLl9yZXNldFN1YigpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChwcmVzLndoYXQgPT0gJ3VwZCcgJiYgcHJlcy5zcmMgPT0gQ29uc3QuVE9QSUNfTUUpIHtcbiAgICAgIC8vIFVwZGF0ZSB0byBtZSdzIGRlc2NyaXB0aW9uLiBSZXF1ZXN0IHVwZGF0ZWQgdmFsdWUuXG4gICAgICB0aGlzLmdldE1ldGEodGhpcy5zdGFydE1ldGFRdWVyeSgpLndpdGhEZXNjKCkuYnVpbGQoKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgY29udCA9IHRoaXMuX3Rpbm9kZS5jYWNoZUdldFRvcGljKHByZXMuc3JjKTtcbiAgICBpZiAoY29udCkge1xuICAgICAgc3dpdGNoIChwcmVzLndoYXQpIHtcbiAgICAgICAgY2FzZSAnb24nOiAvLyB0b3BpYyBjYW1lIG9ubGluZVxuICAgICAgICAgIGNvbnQub25saW5lID0gdHJ1ZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnb2ZmJzogLy8gdG9waWMgd2VudCBvZmZsaW5lXG4gICAgICAgICAgaWYgKGNvbnQub25saW5lKSB7XG4gICAgICAgICAgICBjb250Lm9ubGluZSA9IGZhbHNlO1xuICAgICAgICAgICAgY29udC5zZWVuID0gT2JqZWN0LmFzc2lnbihjb250LnNlZW4gfHwge30sIHtcbiAgICAgICAgICAgICAgd2hlbjogbmV3IERhdGUoKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdtc2cnOiAvLyBuZXcgbWVzc2FnZSByZWNlaXZlZFxuICAgICAgICAgIGNvbnQuX3VwZGF0ZVJlY2VpdmVkKHByZXMuc2VxLCBwcmVzLmFjdCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3VwZCc6IC8vIGRlc2MgdXBkYXRlZFxuICAgICAgICAgIC8vIFJlcXVlc3QgdXBkYXRlZCBzdWJzY3JpcHRpb24uXG4gICAgICAgICAgdGhpcy5nZXRNZXRhKHRoaXMuc3RhcnRNZXRhUXVlcnkoKS53aXRoTGF0ZXJPbmVTdWIocHJlcy5zcmMpLmJ1aWxkKCkpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdhY3MnOiAvLyBhY2Nlc3MgbW9kZSBjaGFuZ2VkXG4gICAgICAgICAgaWYgKGNvbnQuYWNzKSB7XG4gICAgICAgICAgICBjb250LmFjcy51cGRhdGVBbGwocHJlcy5kYWNzKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29udC5hY3MgPSBuZXcgQWNjZXNzTW9kZSgpLnVwZGF0ZUFsbChwcmVzLmRhY3MpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb250LnRvdWNoZWQgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICd1YSc6XG4gICAgICAgICAgLy8gdXNlciBhZ2VudCBjaGFuZ2VkLlxuICAgICAgICAgIGNvbnQuc2VlbiA9IHtcbiAgICAgICAgICAgIHdoZW46IG5ldyBEYXRlKCksXG4gICAgICAgICAgICB1YTogcHJlcy51YVxuICAgICAgICAgIH07XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3JlY3YnOlxuICAgICAgICAgIC8vIHVzZXIncyBvdGhlciBzZXNzaW9uIG1hcmtlZCBzb21lIG1lc3NnZXMgYXMgcmVjZWl2ZWQuXG4gICAgICAgICAgcHJlcy5zZXEgPSBwcmVzLnNlcSB8IDA7XG4gICAgICAgICAgY29udC5yZWN2ID0gY29udC5yZWN2ID8gTWF0aC5tYXgoY29udC5yZWN2LCBwcmVzLnNlcSkgOiBwcmVzLnNlcTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAncmVhZCc6XG4gICAgICAgICAgLy8gdXNlcidzIG90aGVyIHNlc3Npb24gbWFya2VkIHNvbWUgbWVzc2FnZXMgYXMgcmVhZC5cbiAgICAgICAgICBwcmVzLnNlcSA9IHByZXMuc2VxIHwgMDtcbiAgICAgICAgICBjb250LnJlYWQgPSBjb250LnJlYWQgPyBNYXRoLm1heChjb250LnJlYWQsIHByZXMuc2VxKSA6IHByZXMuc2VxO1xuICAgICAgICAgIGNvbnQucmVjdiA9IGNvbnQucmVjdiA/IE1hdGgubWF4KGNvbnQucmVhZCwgY29udC5yZWN2KSA6IGNvbnQucmVjdjtcbiAgICAgICAgICBjb250LnVucmVhZCA9IGNvbnQuc2VxIC0gY29udC5yZWFkO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdnb25lJzpcbiAgICAgICAgICAvLyB0b3BpYyBkZWxldGVkIG9yIHVuc3Vic2NyaWJlZCBmcm9tLlxuICAgICAgICAgIGlmICghY29udC5fZGVsZXRlZCkge1xuICAgICAgICAgICAgY29udC5fZGVsZXRlZCA9IHRydWU7XG4gICAgICAgICAgICBjb250Ll9hdHRhY2hlZCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5fdGlub2RlLl9kYi5tYXJrVG9waWNBc0RlbGV0ZWQocHJlcy5zcmMpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl90aW5vZGUuX2RiLnJlbVRvcGljKHByZXMuc3JjKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2RlbCc6XG4gICAgICAgICAgLy8gVXBkYXRlIHRvcGljLmRlbCB2YWx1ZS5cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICB0aGlzLl90aW5vZGUubG9nZ2VyKFwiSU5GTzogVW5zdXBwb3J0ZWQgcHJlc2VuY2UgdXBkYXRlIGluICdtZSdcIiwgcHJlcy53aGF0KTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fcmVmcmVzaENvbnRhY3QocHJlcy53aGF0LCBjb250KTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHByZXMud2hhdCA9PSAnYWNzJykge1xuICAgICAgICAvLyBOZXcgc3Vic2NyaXB0aW9ucyBhbmQgZGVsZXRlZC9iYW5uZWQgc3Vic2NyaXB0aW9ucyBoYXZlIGZ1bGxcbiAgICAgICAgLy8gYWNjZXNzIG1vZGUgKG5vICsgb3IgLSBpbiB0aGUgZGFjcyBzdHJpbmcpLiBDaGFuZ2VzIHRvIGtub3duIHN1YnNjcmlwdGlvbnMgYXJlIHNlbnQgYXNcbiAgICAgICAgLy8gZGVsdGFzLCBidXQgdGhleSBzaG91bGQgbm90IGhhcHBlbiBoZXJlLlxuICAgICAgICBjb25zdCBhY3MgPSBuZXcgQWNjZXNzTW9kZShwcmVzLmRhY3MpO1xuICAgICAgICBpZiAoIWFjcyB8fCBhY3MubW9kZSA9PSBBY2Nlc3NNb2RlLl9JTlZBTElEKSB7XG4gICAgICAgICAgdGhpcy5fdGlub2RlLmxvZ2dlcihcIkVSUk9SOiBJbnZhbGlkIGFjY2VzcyBtb2RlIHVwZGF0ZVwiLCBwcmVzLnNyYywgcHJlcy5kYWNzKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gZWxzZSBpZiAoYWNzLm1vZGUgPT0gQWNjZXNzTW9kZS5fTk9ORSkge1xuICAgICAgICAgIHRoaXMuX3Rpbm9kZS5sb2dnZXIoXCJXQVJOSU5HOiBSZW1vdmluZyBub24tZXhpc3RlbnQgc3Vic2NyaXB0aW9uXCIsIHByZXMuc3JjLCBwcmVzLmRhY3MpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBOZXcgc3Vic2NyaXB0aW9uLiBTZW5kIHJlcXVlc3QgZm9yIHRoZSBmdWxsIGRlc2NyaXB0aW9uLlxuICAgICAgICAgIC8vIFVzaW5nIC53aXRoT25lU3ViIChub3QgLndpdGhMYXRlck9uZVN1YikgdG8gbWFrZSBzdXJlIElmTW9kaWZpZWRTaW5jZSBpcyBub3Qgc2V0LlxuICAgICAgICAgIHRoaXMuZ2V0TWV0YSh0aGlzLnN0YXJ0TWV0YVF1ZXJ5KCkud2l0aE9uZVN1Yih1bmRlZmluZWQsIHByZXMuc3JjKS5idWlsZCgpKTtcbiAgICAgICAgICAvLyBDcmVhdGUgYSBkdW1teSBlbnRyeSB0byBjYXRjaCBvbmxpbmUgc3RhdHVzIHVwZGF0ZS5cbiAgICAgICAgICBjb25zdCBkdW1teSA9IHRoaXMuX3Rpbm9kZS5nZXRUb3BpYyhwcmVzLnNyYyk7XG4gICAgICAgICAgZHVtbXkudG9waWMgPSBwcmVzLnNyYztcbiAgICAgICAgICBkdW1teS5vbmxpbmUgPSBmYWxzZTtcbiAgICAgICAgICBkdW1teS5hY3MgPSBhY3M7XG4gICAgICAgICAgdGhpcy5fdGlub2RlLl9kYi51cGRUb3BpYyhkdW1teSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAocHJlcy53aGF0ID09ICd0YWdzJykge1xuICAgICAgICB0aGlzLmdldE1ldGEodGhpcy5zdGFydE1ldGFRdWVyeSgpLndpdGhUYWdzKCkuYnVpbGQoKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMub25QcmVzKSB7XG4gICAgICB0aGlzLm9uUHJlcyhwcmVzKTtcbiAgICB9XG4gIH1cblxuICAvLyBDb250YWN0IGlzIHVwZGF0ZWQsIGV4ZWN1dGUgY2FsbGJhY2tzLlxuICBfcmVmcmVzaENvbnRhY3Qod2hhdCwgY29udCkge1xuICAgIGlmICh0aGlzLm9uQ29udGFjdFVwZGF0ZSkge1xuICAgICAgdGhpcy5vbkNvbnRhY3RVcGRhdGUod2hhdCwgY29udCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFB1Ymxpc2hpbmcgdG8gVG9waWNNZSBpcyBub3Qgc3VwcG9ydGVkLiB7QGxpbmsgVG9waWMjcHVibGlzaH0gaXMgb3ZlcnJpZGVuIGFuZCB0aG93cyBhbiB7RXJyb3J9IGlmIGNhbGxlZC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpY01lI1xuICAgKiBAdGhyb3dzIHtFcnJvcn0gQWx3YXlzIHRocm93cyBhbiBlcnJvci5cbiAgICovXG4gIHB1Ymxpc2goKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIlB1Ymxpc2hpbmcgdG8gJ21lJyBpcyBub3Qgc3VwcG9ydGVkXCIpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWxldGUgdmFsaWRhdGlvbiBjcmVkZW50aWFsLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljTWUjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpYyAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIGRlbGV0ZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdXNlciAtIFVzZXIgSUQgdG8gcmVtb3ZlLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIG9uIHJlY2VpdmluZyBzZXJ2ZXIgcmVwbHkuXG4gICAqL1xuICBkZWxDcmVkZW50aWFsKG1ldGhvZCwgdmFsdWUpIHtcbiAgICBpZiAoIXRoaXMuX2F0dGFjaGVkKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiQ2Fubm90IGRlbGV0ZSBjcmVkZW50aWFsIGluIGluYWN0aXZlICdtZScgdG9waWNcIikpO1xuICAgIH1cbiAgICAvLyBTZW5kIHtkZWx9IG1lc3NhZ2UsIHJldHVybiBwcm9taXNlXG4gICAgcmV0dXJuIHRoaXMuX3Rpbm9kZS5kZWxDcmVkZW50aWFsKG1ldGhvZCwgdmFsdWUpLnRoZW4oKGN0cmwpID0+IHtcbiAgICAgIC8vIFJlbW92ZSBkZWxldGVkIGNyZWRlbnRpYWwgZnJvbSB0aGUgY2FjaGUuXG4gICAgICBjb25zdCBpbmRleCA9IHRoaXMuX2NyZWRlbnRpYWxzLmZpbmRJbmRleCgoZWwpID0+IHtcbiAgICAgICAgcmV0dXJuIGVsLm1ldGggPT0gbWV0aG9kICYmIGVsLnZhbCA9PSB2YWx1ZTtcbiAgICAgIH0pO1xuICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgdGhpcy5fY3JlZGVudGlhbHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIH1cbiAgICAgIC8vIE5vdGlmeSBsaXN0ZW5lcnNcbiAgICAgIGlmICh0aGlzLm9uQ3JlZHNVcGRhdGVkKSB7XG4gICAgICAgIHRoaXMub25DcmVkc1VwZGF0ZWQodGhpcy5fY3JlZGVudGlhbHMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGN0cmw7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQGNhbGxiYWNrIGNvbnRhY3RGaWx0ZXJcbiAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRhY3QgdG8gY2hlY2sgZm9yIGluY2x1c2lvbi5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIGNvbnRhY3Qgc2hvdWxkIGJlIHByb2Nlc3NlZCwgPGNvZGU+ZmFsc2U8L2NvZGU+IHRvIGV4Y2x1ZGUgaXQuXG4gICAqL1xuICAvKipcbiAgICogSXRlcmF0ZSBvdmVyIGNhY2hlZCBjb250YWN0cy5cbiAgICpcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWNNZSNcbiAgICogQHBhcmFtIHtUb3BpY01lLkNvbnRhY3RDYWxsYmFja30gY2FsbGJhY2sgLSBDYWxsYmFjayB0byBjYWxsIGZvciBlYWNoIGNvbnRhY3QuXG4gICAqIEBwYXJhbSB7Y29udGFjdEZpbHRlcj19IGZpbHRlciAtIE9wdGlvbmFsbHkgZmlsdGVyIGNvbnRhY3RzOyBpbmNsdWRlIGFsbCBpZiBmaWx0ZXIgaXMgZmFsc2UtaXNoLCBvdGhlcndpc2VcbiAgICogICAgICBpbmNsdWRlIHRob3NlIGZvciB3aGljaCBmaWx0ZXIgcmV0dXJucyB0cnVlLWlzaC5cbiAgICogQHBhcmFtIHtPYmplY3Q9fSBjb250ZXh0IC0gQ29udGV4dCB0byB1c2UgZm9yIGNhbGxpbmcgdGhlIGBjYWxsYmFja2AsIGkuZS4gdGhlIHZhbHVlIG9mIGB0aGlzYCBpbnNpZGUgdGhlIGNhbGxiYWNrLlxuICAgKi9cbiAgY29udGFjdHMoY2FsbGJhY2ssIGZpbHRlciwgY29udGV4dCkge1xuICAgIHRoaXMuX3Rpbm9kZS5tYXBUb3BpY3MoKGMsIGlkeCkgPT4ge1xuICAgICAgaWYgKGMuaXNDb21tVHlwZSgpICYmICghZmlsdGVyIHx8IGZpbHRlcihjKSkpIHtcbiAgICAgICAgY2FsbGJhY2suY2FsbChjb250ZXh0LCBjLCBpZHgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhIGNvbnRhY3QgZnJvbSBjYWNoZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpY01lI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIGNvbnRhY3QgdG8gZ2V0LCBlaXRoZXIgYSBVSUQgKGZvciBwMnAgdG9waWNzKSBvciBhIHRvcGljIG5hbWUuXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuQ29udGFjdH0gLSBDb250YWN0IG9yIGB1bmRlZmluZWRgLlxuICAgKi9cbiAgZ2V0Q29udGFjdChuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuX3Rpbm9kZS5jYWNoZUdldFRvcGljKG5hbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhY2Nlc3MgbW9kZSBvZiBhIGdpdmVuIGNvbnRhY3QgZnJvbSBjYWNoZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpY01lI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIGNvbnRhY3QgdG8gZ2V0IGFjY2VzcyBtb2RlIGZvciwgZWl0aGVyIGEgVUlEIChmb3IgcDJwIHRvcGljcylcbiAgICogICAgICAgIG9yIGEgdG9waWMgbmFtZTsgaWYgbWlzc2luZywgYWNjZXNzIG1vZGUgZm9yIHRoZSAnbWUnIHRvcGljIGl0c2VsZi5cbiAgICogQHJldHVybnMge3N0cmluZ30gLSBhY2Nlc3MgbW9kZSwgc3VjaCBhcyBgUldQYC5cbiAgICovXG4gIGdldEFjY2Vzc01vZGUobmFtZSkge1xuICAgIGlmIChuYW1lKSB7XG4gICAgICBjb25zdCBjb250ID0gdGhpcy5fdGlub2RlLmNhY2hlR2V0VG9waWMobmFtZSk7XG4gICAgICByZXR1cm4gY29udCA/IGNvbnQuYWNzIDogbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuYWNzO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGNvbnRhY3QgaXMgYXJjaGl2ZWQsIGkuZS4gY29udGFjdC5wcml2YXRlLmFyY2ggPT0gdHJ1ZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpY01lI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIGNvbnRhY3QgdG8gY2hlY2sgYXJjaGl2ZWQgc3RhdHVzLCBlaXRoZXIgYSBVSUQgKGZvciBwMnAgdG9waWNzKSBvciBhIHRvcGljIG5hbWUuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIHRydWUgaWYgY29udGFjdCBpcyBhcmNoaXZlZCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgKi9cbiAgaXNBcmNoaXZlZChuYW1lKSB7XG4gICAgY29uc3QgY29udCA9IHRoaXMuX3Rpbm9kZS5jYWNoZUdldFRvcGljKG5hbWUpO1xuICAgIHJldHVybiBjb250ICYmIGNvbnQucHJpdmF0ZSAmJiAhIWNvbnQucHJpdmF0ZS5hcmNoO1xuICB9XG5cbiAgLyoqXG4gICAqIEB0eXBlZGVmIFRpbm9kZS5DcmVkZW50aWFsXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQHR5cGUgT2JqZWN0XG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBtZXRoIC0gdmFsaWRhdGlvbiBtZXRob2Qgc3VjaCBhcyAnZW1haWwnIG9yICd0ZWwnLlxuICAgKiBAcHJvcGVydHkge3N0cmluZ30gdmFsIC0gY3JlZGVudGlhbCB2YWx1ZSwgaS5lLiAnamRvZUBleGFtcGxlLmNvbScgb3IgJysxNzAyNTU1MTIzNCdcbiAgICogQHByb3BlcnR5IHtib29sZWFufSBkb25lIC0gdHJ1ZSBpZiBjcmVkZW50aWFsIGlzIHZhbGlkYXRlZC5cbiAgICovXG4gIC8qKlxuICAgKiBHZXQgdGhlIHVzZXIncyBjcmVkZW50aWFsczogZW1haWwsIHBob25lLCBldGMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWNNZSNcbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5DcmVkZW50aWFsW119IC0gYXJyYXkgb2YgY3JlZGVudGlhbHMuXG4gICAqL1xuICBnZXRDcmVkZW50aWFscygpIHtcbiAgICByZXR1cm4gdGhpcy5fY3JlZGVudGlhbHM7XG4gIH1cbn1cblxuLyoqXG4gKiBAY2xhc3MgVG9waWNGbmQgLSBzcGVjaWFsIGNhc2Ugb2Yge0BsaW5rIFRpbm9kZS5Ub3BpY30gZm9yIHNlYXJjaGluZyBmb3JcbiAqIGNvbnRhY3RzIGFuZCBncm91cCB0b3BpY3MuXG4gKiBAZXh0ZW5kcyBUaW5vZGUuVG9waWNcbiAqIEBtZW1iZXJvZiBUaW5vZGVcbiAqXG4gKiBAcGFyYW0ge1RvcGljRm5kLkNhbGxiYWNrc30gY2FsbGJhY2tzIC0gQ2FsbGJhY2tzIHRvIHJlY2VpdmUgdmFyaW91cyBldmVudHMuXG4gKi9cbmV4cG9ydCBjbGFzcyBUb3BpY0ZuZCBleHRlbmRzIFRvcGljIHtcbiAgLy8gTGlzdCBvZiB1c2VycyBhbmQgdG9waWNzIHVpZCBvciB0b3BpY19uYW1lIC0+IENvbnRhY3Qgb2JqZWN0KVxuICBfY29udGFjdHMgPSB7fTtcblxuICBjb25zdHJ1Y3RvcihjYWxsYmFja3MpIHtcbiAgICBzdXBlcihDb25zdC5UT1BJQ19GTkQsIGNhbGxiYWNrcyk7XG4gIH1cblxuICAvLyBPdmVycmlkZSB0aGUgb3JpZ2luYWwgVG9waWMuX3Byb2Nlc3NNZXRhU3ViXG4gIF9wcm9jZXNzTWV0YVN1YihzdWJzKSB7XG4gICAgbGV0IHVwZGF0ZUNvdW50ID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGhpcy5fY29udGFjdHMpLmxlbmd0aDtcbiAgICAvLyBSZXNldCBjb250YWN0IGxpc3QuXG4gICAgdGhpcy5fY29udGFjdHMgPSB7fTtcbiAgICBmb3IgKGxldCBpZHggaW4gc3Vicykge1xuICAgICAgbGV0IHN1YiA9IHN1YnNbaWR4XTtcbiAgICAgIGNvbnN0IGluZGV4QnkgPSBzdWIudG9waWMgPyBzdWIudG9waWMgOiBzdWIudXNlcjtcblxuICAgICAgc3ViID0gbWVyZ2VUb0NhY2hlKHRoaXMuX2NvbnRhY3RzLCBpbmRleEJ5LCBzdWIpO1xuICAgICAgdXBkYXRlQ291bnQrKztcblxuICAgICAgaWYgKHRoaXMub25NZXRhU3ViKSB7XG4gICAgICAgIHRoaXMub25NZXRhU3ViKHN1Yik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHVwZGF0ZUNvdW50ID4gMCAmJiB0aGlzLm9uU3Vic1VwZGF0ZWQpIHtcbiAgICAgIHRoaXMub25TdWJzVXBkYXRlZChPYmplY3Qua2V5cyh0aGlzLl9jb250YWN0cykpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBQdWJsaXNoaW5nIHRvIFRvcGljRm5kIGlzIG5vdCBzdXBwb3J0ZWQuIHtAbGluayBUb3BpYyNwdWJsaXNofSBpcyBvdmVycmlkZW4gYW5kIHRob3dzIGFuIHtFcnJvcn0gaWYgY2FsbGVkLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljRm5kI1xuICAgKiBAdGhyb3dzIHtFcnJvcn0gQWx3YXlzIHRocm93cyBhbiBlcnJvci5cbiAgICovXG4gIHB1Ymxpc2goKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIlB1Ymxpc2hpbmcgdG8gJ2ZuZCcgaXMgbm90IHN1cHBvcnRlZFwiKSk7XG4gIH1cblxuICAvKipcbiAgICogc2V0TWV0YSB0byBUb3BpY0ZuZCByZXNldHMgY29udGFjdCBsaXN0IGluIGFkZGl0aW9uIHRvIHNlbmRpbmcgdGhlIG1lc3NhZ2UuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWNGbmQjXG4gICAqIEBwYXJhbSB7VGlub2RlLlNldFBhcmFtc30gcGFyYW1zIHBhcmFtZXRlcnMgdG8gdXBkYXRlLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBzZXJ2ZXIgcmVzcG9uZHMgdG8gcmVxdWVzdC5cbiAgICovXG4gIHNldE1ldGEocGFyYW1zKSB7XG4gICAgcmV0dXJuIE9iamVjdC5nZXRQcm90b3R5cGVPZihUb3BpY0ZuZC5wcm90b3R5cGUpLnNldE1ldGEuY2FsbCh0aGlzLCBwYXJhbXMpLnRoZW4oKCkgPT4ge1xuICAgICAgaWYgKE9iamVjdC5rZXlzKHRoaXMuX2NvbnRhY3RzKS5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRoaXMuX2NvbnRhY3RzID0ge307XG4gICAgICAgIGlmICh0aGlzLm9uU3Vic1VwZGF0ZWQpIHtcbiAgICAgICAgICB0aGlzLm9uU3Vic1VwZGF0ZWQoW10pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogSXRlcmF0ZSBvdmVyIGZvdW5kIGNvbnRhY3RzLiBJZiBjYWxsYmFjayBpcyB1bmRlZmluZWQsIHVzZSB7QGxpbmsgdGhpcy5vbk1ldGFTdWJ9LlxuICAgKiBAZnVuY3Rpb25cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpY0ZuZCNcbiAgICogQHBhcmFtIHtUb3BpY0ZuZC5Db250YWN0Q2FsbGJhY2t9IGNhbGxiYWNrIC0gQ2FsbGJhY2sgdG8gY2FsbCBmb3IgZWFjaCBjb250YWN0LlxuICAgKiBAcGFyYW0ge09iamVjdH0gY29udGV4dCAtIENvbnRleHQgdG8gdXNlIGZvciBjYWxsaW5nIHRoZSBgY2FsbGJhY2tgLCBpLmUuIHRoZSB2YWx1ZSBvZiBgdGhpc2AgaW5zaWRlIHRoZSBjYWxsYmFjay5cbiAgICovXG4gIGNvbnRhY3RzKGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgY29uc3QgY2IgPSAoY2FsbGJhY2sgfHwgdGhpcy5vbk1ldGFTdWIpO1xuICAgIGlmIChjYikge1xuICAgICAgZm9yIChsZXQgaWR4IGluIHRoaXMuX2NvbnRhY3RzKSB7XG4gICAgICAgIGNiLmNhbGwoY29udGV4dCwgdGhpcy5fY29udGFjdHNbaWR4XSwgaWR4LCB0aGlzLl9jb250YWN0cyk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iLCIvKipcbiAqIEBmaWxlIFV0aWxpdGllcyB1c2VkIGluIG11bHRpcGxlIHBsYWNlcy5cbiAqXG4gKiBAY29weXJpZ2h0IDIwMTUtMjAyMiBUaW5vZGUgTExDLlxuICovXG4ndXNlIHN0cmljdCc7XG5cbmltcG9ydCBBY2Nlc3NNb2RlIGZyb20gJy4vYWNjZXNzLW1vZGUuanMnO1xuaW1wb3J0IHtcbiAgREVMX0NIQVJcbn0gZnJvbSAnLi9jb25maWcuanMnO1xuXG4vLyBBdHRlbXB0IHRvIGNvbnZlcnQgZGF0ZSBhbmQgQWNjZXNzTW9kZSBzdHJpbmdzIHRvIG9iamVjdHMuXG5leHBvcnQgZnVuY3Rpb24ganNvblBhcnNlSGVscGVyKGtleSwgdmFsKSB7XG4gIC8vIFRyeSB0byBjb252ZXJ0IHN0cmluZyB0aW1lc3RhbXBzIHdpdGggb3B0aW9uYWwgbWlsbGlzZWNvbmRzIHRvIERhdGUsXG4gIC8vIGUuZy4gMjAxNS0wOS0wMlQwMTo0NTo0M1suMTIzXVpcbiAgaWYgKHR5cGVvZiB2YWwgPT0gJ3N0cmluZycgJiYgdmFsLmxlbmd0aCA+PSAyMCAmJiB2YWwubGVuZ3RoIDw9IDI0ICYmIFsndHMnLCAndG91Y2hlZCcsICd1cGRhdGVkJywgJ2NyZWF0ZWQnLCAnd2hlbicsICdkZWxldGVkJywgJ2V4cGlyZXMnXS5pbmNsdWRlcyhrZXkpKSB7XG5cbiAgICBjb25zdCBkYXRlID0gbmV3IERhdGUodmFsKTtcbiAgICBpZiAoIWlzTmFOKGRhdGUpKSB7XG4gICAgICByZXR1cm4gZGF0ZTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoa2V5ID09PSAnYWNzJyAmJiB0eXBlb2YgdmFsID09PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBuZXcgQWNjZXNzTW9kZSh2YWwpO1xuICB9XG4gIHJldHVybiB2YWw7XG59XG5cbi8vIENoZWNrcyBpZiBVUkwgaXMgYSByZWxhdGl2ZSB1cmwsIGkuZS4gaGFzIG5vICdzY2hlbWU6Ly8nLCBpbmNsdWRpbmcgdGhlIGNhc2Ugb2YgbWlzc2luZyBzY2hlbWUgJy8vJy5cbi8vIFRoZSBzY2hlbWUgaXMgZXhwZWN0ZWQgdG8gYmUgUkZDLWNvbXBsaWFudCwgZS5nLiBbYS16XVthLXowLTkrLi1dKlxuLy8gZXhhbXBsZS5odG1sIC0gb2tcbi8vIGh0dHBzOmV4YW1wbGUuY29tIC0gbm90IG9rLlxuLy8gaHR0cDovZXhhbXBsZS5jb20gLSBub3Qgb2suXG4vLyAnIOKGsiBodHRwczovL2V4YW1wbGUuY29tJyAtIG5vdCBvay4gKOKGsiBtZWFucyBjYXJyaWFnZSByZXR1cm4pXG5leHBvcnQgZnVuY3Rpb24gaXNVcmxSZWxhdGl2ZSh1cmwpIHtcbiAgcmV0dXJuIHVybCAmJiAhL15cXHMqKFthLXpdW2EtejAtOSsuLV0qOnxcXC9cXC8pL2ltLnRlc3QodXJsKTtcbn1cblxuZnVuY3Rpb24gaXNWYWxpZERhdGUoZCkge1xuICByZXR1cm4gKGQgaW5zdGFuY2VvZiBEYXRlKSAmJiAhaXNOYU4oZCkgJiYgKGQuZ2V0VGltZSgpICE9IDApO1xufVxuXG4vLyBSRkMzMzM5IGZvcm1hdGVyIG9mIERhdGVcbmV4cG9ydCBmdW5jdGlvbiByZmMzMzM5RGF0ZVN0cmluZyhkKSB7XG4gIGlmICghaXNWYWxpZERhdGUoZCkpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgY29uc3QgcGFkID0gZnVuY3Rpb24odmFsLCBzcCkge1xuICAgIHNwID0gc3AgfHwgMjtcbiAgICByZXR1cm4gJzAnLnJlcGVhdChzcCAtICgnJyArIHZhbCkubGVuZ3RoKSArIHZhbDtcbiAgfTtcblxuICBjb25zdCBtaWxsaXMgPSBkLmdldFVUQ01pbGxpc2Vjb25kcygpO1xuICByZXR1cm4gZC5nZXRVVENGdWxsWWVhcigpICsgJy0nICsgcGFkKGQuZ2V0VVRDTW9udGgoKSArIDEpICsgJy0nICsgcGFkKGQuZ2V0VVRDRGF0ZSgpKSArXG4gICAgJ1QnICsgcGFkKGQuZ2V0VVRDSG91cnMoKSkgKyAnOicgKyBwYWQoZC5nZXRVVENNaW51dGVzKCkpICsgJzonICsgcGFkKGQuZ2V0VVRDU2Vjb25kcygpKSArXG4gICAgKG1pbGxpcyA/ICcuJyArIHBhZChtaWxsaXMsIDMpIDogJycpICsgJ1onO1xufVxuXG4vLyBSZWN1cnNpdmVseSBtZXJnZSBzcmMncyBvd24gcHJvcGVydGllcyB0byBkc3QuXG4vLyBJZ25vcmUgcHJvcGVydGllcyB3aGVyZSBpZ25vcmVbcHJvcGVydHldIGlzIHRydWUuXG4vLyBBcnJheSBhbmQgRGF0ZSBvYmplY3RzIGFyZSBzaGFsbG93LWNvcGllZC5cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZU9iaihkc3QsIHNyYywgaWdub3JlKSB7XG4gIGlmICh0eXBlb2Ygc3JjICE9ICdvYmplY3QnKSB7XG4gICAgaWYgKHNyYyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gZHN0O1xuICAgIH1cbiAgICBpZiAoc3JjID09PSBERUxfQ0hBUikge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgcmV0dXJuIHNyYztcbiAgfVxuICAvLyBKUyBpcyBjcmF6eTogdHlwZW9mIG51bGwgaXMgJ29iamVjdCcuXG4gIGlmIChzcmMgPT09IG51bGwpIHtcbiAgICByZXR1cm4gc3JjO1xuICB9XG5cbiAgLy8gSGFuZGxlIERhdGVcbiAgaWYgKHNyYyBpbnN0YW5jZW9mIERhdGUgJiYgIWlzTmFOKHNyYykpIHtcbiAgICByZXR1cm4gKCFkc3QgfHwgIShkc3QgaW5zdGFuY2VvZiBEYXRlKSB8fCBpc05hTihkc3QpIHx8IGRzdCA8IHNyYykgPyBzcmMgOiBkc3Q7XG4gIH1cblxuICAvLyBBY2Nlc3MgbW9kZVxuICBpZiAoc3JjIGluc3RhbmNlb2YgQWNjZXNzTW9kZSkge1xuICAgIHJldHVybiBuZXcgQWNjZXNzTW9kZShzcmMpO1xuICB9XG5cbiAgLy8gSGFuZGxlIEFycmF5XG4gIGlmIChzcmMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgIHJldHVybiBzcmM7XG4gIH1cblxuICBpZiAoIWRzdCB8fCBkc3QgPT09IERFTF9DSEFSKSB7XG4gICAgZHN0ID0gc3JjLmNvbnN0cnVjdG9yKCk7XG4gIH1cblxuICBmb3IgKGxldCBwcm9wIGluIHNyYykge1xuICAgIGlmIChzcmMuaGFzT3duUHJvcGVydHkocHJvcCkgJiYgKCFpZ25vcmUgfHwgIWlnbm9yZVtwcm9wXSkgJiYgKHByb3AgIT0gJ19ub0ZvcndhcmRpbmcnKSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgZHN0W3Byb3BdID0gbWVyZ2VPYmooZHN0W3Byb3BdLCBzcmNbcHJvcF0pO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIC8vIEZJWE1FOiBwcm9iYWJseSBuZWVkIHRvIGxvZyBzb21ldGhpbmcgaGVyZS5cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRzdDtcbn1cblxuLy8gVXBkYXRlIG9iamVjdCBzdG9yZWQgaW4gYSBjYWNoZS4gUmV0dXJucyB1cGRhdGVkIHZhbHVlLlxuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlVG9DYWNoZShjYWNoZSwga2V5LCBuZXd2YWwsIGlnbm9yZSkge1xuICBjYWNoZVtrZXldID0gbWVyZ2VPYmooY2FjaGVba2V5XSwgbmV3dmFsLCBpZ25vcmUpO1xuICByZXR1cm4gY2FjaGVba2V5XTtcbn1cblxuLy8gU3RyaXBzIGFsbCB2YWx1ZXMgZnJvbSBhbiBvYmplY3Qgb2YgdGhleSBldmFsdWF0ZSB0byBmYWxzZSBvciBpZiB0aGVpciBuYW1lIHN0YXJ0cyB3aXRoICdfJy5cbi8vIFVzZWQgb24gYWxsIG91dGdvaW5nIG9iamVjdCBiZWZvcmUgc2VyaWFsaXphdGlvbiB0byBzdHJpbmcuXG5leHBvcnQgZnVuY3Rpb24gc2ltcGxpZnkob2JqKSB7XG4gIE9iamVjdC5rZXlzKG9iaikuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgaWYgKGtleVswXSA9PSAnXycpIHtcbiAgICAgIC8vIFN0cmlwIGZpZWxkcyBsaWtlIFwib2JqLl9rZXlcIi5cbiAgICAgIGRlbGV0ZSBvYmpba2V5XTtcbiAgICB9IGVsc2UgaWYgKCFvYmpba2V5XSkge1xuICAgICAgLy8gU3RyaXAgZmllbGRzIHdoaWNoIGV2YWx1YXRlIHRvIGZhbHNlLlxuICAgICAgZGVsZXRlIG9ialtrZXldO1xuICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShvYmpba2V5XSkgJiYgb2JqW2tleV0ubGVuZ3RoID09IDApIHtcbiAgICAgIC8vIFN0cmlwIGVtcHR5IGFycmF5cy5cbiAgICAgIGRlbGV0ZSBvYmpba2V5XTtcbiAgICB9IGVsc2UgaWYgKCFvYmpba2V5XSkge1xuICAgICAgLy8gU3RyaXAgZmllbGRzIHdoaWNoIGV2YWx1YXRlIHRvIGZhbHNlLlxuICAgICAgZGVsZXRlIG9ialtrZXldO1xuICAgIH0gZWxzZSBpZiAob2JqW2tleV0gaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICAvLyBTdHJpcCBpbnZhbGlkIG9yIHplcm8gZGF0ZS5cbiAgICAgIGlmICghaXNWYWxpZERhdGUob2JqW2tleV0pKSB7XG4gICAgICAgIGRlbGV0ZSBvYmpba2V5XTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBvYmpba2V5XSA9PSAnb2JqZWN0Jykge1xuICAgICAgc2ltcGxpZnkob2JqW2tleV0pO1xuICAgICAgLy8gU3RyaXAgZW1wdHkgb2JqZWN0cy5cbiAgICAgIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhvYmpba2V5XSkubGVuZ3RoID09IDApIHtcbiAgICAgICAgZGVsZXRlIG9ialtrZXldO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBvYmo7XG59O1xuXG5cbi8vIFRyaW0gd2hpdGVzcGFjZSwgc3RyaXAgZW1wdHkgYW5kIGR1cGxpY2F0ZSBlbGVtZW50cyBlbGVtZW50cy5cbi8vIElmIHRoZSByZXN1bHQgaXMgYW4gZW1wdHkgYXJyYXksIGFkZCBhIHNpbmdsZSBlbGVtZW50IFwiXFx1MjQyMVwiIChVbmljb2RlIERlbCBjaGFyYWN0ZXIpLlxuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZUFycmF5KGFycikge1xuICBsZXQgb3V0ID0gW107XG4gIGlmIChBcnJheS5pc0FycmF5KGFycikpIHtcbiAgICAvLyBUcmltLCB0aHJvdyBhd2F5IHZlcnkgc2hvcnQgYW5kIGVtcHR5IHRhZ3MuXG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSBhcnIubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBsZXQgdCA9IGFycltpXTtcbiAgICAgIGlmICh0KSB7XG4gICAgICAgIHQgPSB0LnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBpZiAodC5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgb3V0LnB1c2godCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgb3V0LnNvcnQoKS5maWx0ZXIoZnVuY3Rpb24oaXRlbSwgcG9zLCBhcnkpIHtcbiAgICAgIHJldHVybiAhcG9zIHx8IGl0ZW0gIT0gYXJ5W3BvcyAtIDFdO1xuICAgIH0pO1xuICB9XG4gIGlmIChvdXQubGVuZ3RoID09IDApIHtcbiAgICAvLyBBZGQgc2luZ2xlIHRhZyB3aXRoIGEgVW5pY29kZSBEZWwgY2hhcmFjdGVyLCBvdGhlcndpc2UgYW4gYW1wdHkgYXJyYXlcbiAgICAvLyBpcyBhbWJpZ3Vvcy4gVGhlIERlbCB0YWcgd2lsbCBiZSBzdHJpcHBlZCBieSB0aGUgc2VydmVyLlxuICAgIG91dC5wdXNoKERFTF9DSEFSKTtcbiAgfVxuICByZXR1cm4gb3V0O1xufVxuIiwibW9kdWxlLmV4cG9ydHM9e1widmVyc2lvblwiOiBcIjAuMjAuM1wifVxuIl19

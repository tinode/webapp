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
  isEmpty() {
    return this.buffer.length == 0;
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
exports.VERSION = exports.USER_NEW = exports.TOPIC_SYS = exports.TOPIC_P2P = exports.TOPIC_NEW_CHAN = exports.TOPIC_NEW = exports.TOPIC_ME = exports.TOPIC_GRP = exports.TOPIC_FND = exports.TOPIC_CHAN = exports.RECV_TIMEOUT = exports.PROTOCOL_VERSION = exports.MESSAGE_STATUS_TO_ME = exports.MESSAGE_STATUS_SENT = exports.MESSAGE_STATUS_SENDING = exports.MESSAGE_STATUS_RECEIVED = exports.MESSAGE_STATUS_READ = exports.MESSAGE_STATUS_QUEUED = exports.MESSAGE_STATUS_NONE = exports.MESSAGE_STATUS_FAILED = exports.LOCAL_SEQID = exports.LIBRARY = exports.EXPIRE_PROMISES_TIMEOUT = exports.EXPIRE_PROMISES_PERIOD = exports.DEL_CHAR = exports.DEFAULT_MESSAGES_PAGE = void 0;
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
  this.disconnect = _ => {
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
  this.isConnected = _ => {
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
      conn.onopen = _ => {
        if (this.autoreconnect) {
          _classPrivateMethodGet(this, _boffStop, _boffStop2).call(this);
        }
        if (this.onOpen) {
          this.onOpen();
        }
        resolve();
      };
      conn.onclose = _ => {
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
  this.disconnect = _ => {
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
  this.isConnected = _ => {
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
      req.onblocked = _ => {
        if (this.db) {
          this.db.close();
        }
        const err = new Error("blocked");
        _classPrivateFieldGet(this, _logger).call(this, 'PCache', 'deleteDatabase', err);
        reject(err);
      };
      req.onsuccess = _ => {
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
      req.onsuccess = _ => {
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
const ALLOWED_ENT_FIELDS = ['act', 'height', 'duration', 'incoming', 'mime', 'name', 'premime', 'preref', 'preview', 'ref', 'size', 'state', 'url', 'val', 'width'];
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
  },
  VD: {
    open: data => {
      const tmpPreviewUrl = base64toDataUrl(data._tempPreview, data.mime);
      const previewUrl = data.ref || base64toObjectUrl(data.preview, data.premime || 'image/json', Drafty.logger);
      return '<img src="' + (tmpPreviewUrl || previewUrl) + '"' + (data.width ? ' width="' + data.width + '"' : '') + (data.height ? ' height="' + data.height + '"' : '') + ' border="0" />';
    },
    close: _ => '',
    props: data => {
      if (!data) return null;
      return {
        src: data.preref || base64toObjectUrl(data.preview, data.premime || 'image/json', Drafty.logger),
        'data-src': data.ref || base64toObjectUrl(data.val, data.mime, Drafty.logger),
        'data-width': data.width,
        'data-height': data.height,
        'data-preload': data.ref ? 'metadata' : 'auto',
        'data-preview': base64toObjectUrl(data.preview, data.premime || 'image/json', Drafty.logger),
        'data-duration': data.duration | 0,
        'data-name': data.name,
        'data-size': data.val ? data.val.length * 0.75 | 0 : data.size | 0,
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
    at: content.txt.length,
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
  for (let i in content.ent) {
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
    this._connection.onOpen = _ => _classPrivateMethodGet(this, _connectionOpen, _connectionOpen2).call(this);
    this._connection.onDisconnect = (err, code) => _classPrivateMethodGet(this, _disconnected, _disconnected2).call(this, err, code);
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
      promise = promise.then(ctrl => _classPrivateMethodGet(this, _loginSuccessful, _loginSuccessful2).call(this, ctrl));
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
    return _classPrivateMethodGet(this, _send, _send2).call(this, pkt, pkt.login.id).then(ctrl => _classPrivateMethodGet(this, _loginSuccessful, _loginSuccessful2).call(this, ctrl));
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
    return _classPrivateMethodGet(this, _send, _send2).call(this, pkt, pkt.del.id).then(_ => {
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
  noteKeyPress(topicName, type) {
    const pkt = _classPrivateMethodGet(this, _initPacket, _initPacket2).call(this, 'note', topicName);
    pkt.note.what = type || 'kp';
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
      setTimeout(_ => {
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
      setTimeout(_ => {
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
    this._expirePromises = setInterval(_ => {
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
          if (this._isReplacementMsg(msg)) {
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
    return this._messages.getLast();
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
    const versions = this._messageVersions[targetSeq] || new _cbuffer.default((a, b) => {
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
      data.content = _drafty.default.updateVideoCall(data.content, {
        state: data.head.webrtc,
        duration: data.head['webrtc-duration'],
        incoming: !outgoing
      });
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
    return Object.getPrototypeOf(TopicFnd.prototype).setMeta.call(this, params).then(_ => {
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
module.exports={"version": "0.21.0-beta1"}

},{}]},{},[9])(9)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYWNjZXNzLW1vZGUuanMiLCJzcmMvY2J1ZmZlci5qcyIsInNyYy9jb25maWcuanMiLCJzcmMvY29ubmVjdGlvbi5qcyIsInNyYy9kYi5qcyIsInNyYy9kcmFmdHkuanMiLCJzcmMvbGFyZ2UtZmlsZS5qcyIsInNyYy9tZXRhLWJ1aWxkZXIuanMiLCJzcmMvdGlub2RlLmpzIiwic3JjL3RvcGljLmpzIiwic3JjL3V0aWxzLmpzIiwidmVyc2lvbi5qc29uIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDS0EsWUFBWTtBQUFDO0VBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQWNFLE1BQU0sVUFBVSxDQUFDO0VBQzlCLFdBQVcsQ0FBQyxHQUFHLEVBQUU7SUFDZixJQUFJLEdBQUcsRUFBRTtNQUNQLElBQUksQ0FBQyxLQUFLLEdBQUcsT0FBTyxHQUFHLENBQUMsS0FBSyxJQUFJLFFBQVEsR0FBRyxHQUFHLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQztNQUNwRixJQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sR0FBRyxDQUFDLElBQUksSUFBSSxRQUFRLEdBQUcsR0FBRyxDQUFDLElBQUksR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUM7TUFDaEYsSUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxHQUFJLE9BQU8sR0FBRyxDQUFDLElBQUksSUFBSSxRQUFRLEdBQUcsR0FBRyxDQUFDLElBQUksR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FDekYsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSztJQUM1QjtFQUNGO0VBaUJBLE9BQU8sTUFBTSxDQUFDLEdBQUcsRUFBRTtJQUNqQixJQUFJLENBQUMsR0FBRyxFQUFFO01BQ1Is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QUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7SUFFdEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtNQUMxQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO01BQ2QsSUFBSSxDQUFDLEVBQUU7UUFDTCxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLFdBQVcsRUFBRTtRQUMxQixJQUFJLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1VBQ2hCLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2I7TUFDRjtJQUNGO0lBQ0EsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxVQUFTLElBQUksRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFO01BQ3pDLE9BQU8sQ0FBQyxHQUFHLElBQUksSUFBSSxJQUFJLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO0lBQ3JDLENBQUMsQ0FBQztFQUNKO0VBQ0EsSUFBSSxHQUFHLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtJQUduQixHQUFHLENBQUMsSUFBSSxDQUFDLGdCQUFRLENBQUM7RUFDcEI7RUFDQSxPQUFPLEdBQUc7QUFDWjs7O0FDM0tBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvKipcbiAqIEBmaWxlIEFjY2VzcyBjb250cm9sIG1vZGVsLlxuICpcbiAqIEBjb3B5cmlnaHQgMjAxNS0yMDIyIFRpbm9kZSBMTEMuXG4gKi9cbid1c2Ugc3RyaWN0JztcblxuLy8gTk9URSBUTyBERVZFTE9QRVJTOlxuLy8gTG9jYWxpemFibGUgc3RyaW5ncyBzaG91bGQgYmUgZG91YmxlIHF1b3RlZCBcItGB0YLRgNC+0LrQsCDQvdCwINC00YDRg9Cz0L7QvCDRj9C30YvQutC1XCIsXG4vLyBub24tbG9jYWxpemFibGUgc3RyaW5ncyBzaG91bGQgYmUgc2luZ2xlIHF1b3RlZCAnbm9uLWxvY2FsaXplZCcuXG5cbi8qKlxuICogSGVscGVyIGNsYXNzIGZvciBoYW5kbGluZyBhY2Nlc3MgbW9kZS5cbiAqXG4gKiBAY2xhc3MgQWNjZXNzTW9kZVxuICogQG1lbWJlcm9mIFRpbm9kZVxuICpcbiAqIEBwYXJhbSB7QWNjZXNzTW9kZXxPYmplY3Q9fSBhY3MgLSBBY2Nlc3NNb2RlIHRvIGNvcHkgb3IgYWNjZXNzIG1vZGUgb2JqZWN0IHJlY2VpdmVkIGZyb20gdGhlIHNlcnZlci5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQWNjZXNzTW9kZSB7XG4gIGNvbnN0cnVjdG9yKGFjcykge1xuICAgIGlmIChhY3MpIHtcbiAgICAgIHRoaXMuZ2l2ZW4gPSB0eXBlb2YgYWNzLmdpdmVuID09ICdudW1iZXInID8gYWNzLmdpdmVuIDogQWNjZXNzTW9kZS5kZWNvZGUoYWNzLmdpdmVuKTtcbiAgICAgIHRoaXMud2FudCA9IHR5cGVvZiBhY3Mud2FudCA9PSAnbnVtYmVyJyA/IGFjcy53YW50IDogQWNjZXNzTW9kZS5kZWNvZGUoYWNzLndhbnQpO1xuICAgICAgdGhpcy5tb2RlID0gYWNzLm1vZGUgPyAodHlwZW9mIGFjcy5tb2RlID09ICdudW1iZXInID8gYWNzLm1vZGUgOiBBY2Nlc3NNb2RlLmRlY29kZShhY3MubW9kZSkpIDpcbiAgICAgICAgKHRoaXMuZ2l2ZW4gJiB0aGlzLndhbnQpO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyAjY2hlY2tGbGFnKHZhbCwgc2lkZSwgZmxhZykge1xuICAgIHNpZGUgPSBzaWRlIHx8ICdtb2RlJztcbiAgICBpZiAoWydnaXZlbicsICd3YW50JywgJ21vZGUnXS5pbmNsdWRlcyhzaWRlKSkge1xuICAgICAgcmV0dXJuICgodmFsW3NpZGVdICYgZmxhZykgIT0gMCk7XG4gICAgfVxuICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBBY2Nlc3NNb2RlIGNvbXBvbmVudCAnJHtzaWRlfSdgKTtcbiAgfVxuICAvKipcbiAgICogUGFyc2Ugc3RyaW5nIGludG8gYW4gYWNjZXNzIG1vZGUgdmFsdWUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nIHwgTnVtYmVyfSBtb2RlIC0gZWl0aGVyIGEgU3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBhY2Nlc3MgbW9kZSB0byBwYXJzZSBvciBhIHNldCBvZiBiaXRzIHRvIGFzc2lnbi5cbiAgICogQHJldHVybnMge251bWJlcn0gLSBBY2Nlc3MgbW9kZSBhcyBhIG51bWVyaWMgdmFsdWUuXG4gICAqL1xuICBzdGF0aWMgZGVjb2RlKHN0cikge1xuICAgIGlmICghc3RyKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBzdHIgPT0gJ251bWJlcicpIHtcbiAgICAgIHJldHVybiBzdHIgJiBBY2Nlc3NNb2RlLl9CSVRNQVNLO1xuICAgIH0gZWxzZSBpZiAoc3RyID09PSAnTicgfHwgc3RyID09PSAnbicpIHtcbiAgICAgIHJldHVybiBBY2Nlc3NNb2RlLl9OT05FO1xuICAgIH1cblxuICAgIGNvbnN0IGJpdG1hc2sgPSB7XG4gICAgICAnSic6IEFjY2Vzc01vZGUuX0pPSU4sXG4gICAgICAnUic6IEFjY2Vzc01vZGUuX1JFQUQsXG4gICAgICAnVyc6IEFjY2Vzc01vZGUuX1dSSVRFLFxuICAgICAgJ1AnOiBBY2Nlc3NNb2RlLl9QUkVTLFxuICAgICAgJ0EnOiBBY2Nlc3NNb2RlLl9BUFBST1ZFLFxuICAgICAgJ1MnOiBBY2Nlc3NNb2RlLl9TSEFSRSxcbiAgICAgICdEJzogQWNjZXNzTW9kZS5fREVMRVRFLFxuICAgICAgJ08nOiBBY2Nlc3NNb2RlLl9PV05FUlxuICAgIH07XG5cbiAgICBsZXQgbTAgPSBBY2Nlc3NNb2RlLl9OT05FO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGJpdCA9IGJpdG1hc2tbc3RyLmNoYXJBdChpKS50b1VwcGVyQ2FzZSgpXTtcbiAgICAgIGlmICghYml0KSB7XG4gICAgICAgIC8vIFVucmVjb2duaXplZCBiaXQsIHNraXAuXG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgbTAgfD0gYml0O1xuICAgIH1cbiAgICByZXR1cm4gbTA7XG4gIH1cbiAgLyoqXG4gICAqIENvbnZlcnQgbnVtZXJpYyByZXByZXNlbnRhdGlvbiBvZiB0aGUgYWNjZXNzIG1vZGUgaW50byBhIHN0cmluZy5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IHZhbCAtIGFjY2VzcyBtb2RlIHZhbHVlIHRvIGNvbnZlcnQgdG8gYSBzdHJpbmcuXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IC0gQWNjZXNzIG1vZGUgYXMgYSBzdHJpbmcuXG4gICAqL1xuICBzdGF0aWMgZW5jb2RlKHZhbCkge1xuICAgIGlmICh2YWwgPT09IG51bGwgfHwgdmFsID09PSBBY2Nlc3NNb2RlLl9JTlZBTElEKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9IGVsc2UgaWYgKHZhbCA9PT0gQWNjZXNzTW9kZS5fTk9ORSkge1xuICAgICAgcmV0dXJuICdOJztcbiAgICB9XG5cbiAgICBjb25zdCBiaXRtYXNrID0gWydKJywgJ1InLCAnVycsICdQJywgJ0EnLCAnUycsICdEJywgJ08nXTtcbiAgICBsZXQgcmVzID0gJyc7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBiaXRtYXNrLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoKHZhbCAmICgxIDw8IGkpKSAhPSAwKSB7XG4gICAgICAgIHJlcyA9IHJlcyArIGJpdG1hc2tbaV07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXM7XG4gIH1cbiAgLyoqXG4gICAqIFVwZGF0ZSBudW1lcmljIHJlcHJlc2VudGF0aW9uIG9mIGFjY2VzcyBtb2RlIHdpdGggdGhlIG5ldyB2YWx1ZS4gVGhlIHZhbHVlXG4gICAqIGlzIG9uZSBvZiB0aGUgZm9sbG93aW5nOlxuICAgKiAgLSBhIHN0cmluZyBzdGFydGluZyB3aXRoIDxjb2RlPicrJzwvY29kZT4gb3IgPGNvZGU+Jy0nPC9jb2RlPiB0aGVuIHRoZSBiaXRzIHRvIGFkZCBvciByZW1vdmUsIGUuZy4gPGNvZGU+JytSLVcnPC9jb2RlPiBvciA8Y29kZT4nLVBTJzwvY29kZT4uXG4gICAqICAtIGEgbmV3IHZhbHVlIG9mIGFjY2VzcyBtb2RlXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB2YWwgLSBhY2Nlc3MgbW9kZSB2YWx1ZSB0byB1cGRhdGUuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1cGQgLSB1cGRhdGUgdG8gYXBwbHkgdG8gdmFsLlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSAtIHVwZGF0ZWQgYWNjZXNzIG1vZGUuXG4gICAqL1xuICBzdGF0aWMgdXBkYXRlKHZhbCwgdXBkKSB7XG4gICAgaWYgKCF1cGQgfHwgdHlwZW9mIHVwZCAhPSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIHZhbDtcbiAgICB9XG5cbiAgICBsZXQgYWN0aW9uID0gdXBkLmNoYXJBdCgwKTtcbiAgICBpZiAoYWN0aW9uID09ICcrJyB8fCBhY3Rpb24gPT0gJy0nKSB7XG4gICAgICBsZXQgdmFsMCA9IHZhbDtcbiAgICAgIC8vIFNwbGl0IGRlbHRhLXN0cmluZyBsaWtlICcrQUJDLURFRitaJyBpbnRvIGFuIGFycmF5IG9mIHBhcnRzIGluY2x1ZGluZyArIGFuZCAtLlxuICAgICAgY29uc3QgcGFydHMgPSB1cGQuc3BsaXQoLyhbLStdKS8pO1xuICAgICAgLy8gU3RhcnRpbmcgaXRlcmF0aW9uIGZyb20gMSBiZWNhdXNlIFN0cmluZy5zcGxpdCgpIGNyZWF0ZXMgYW4gYXJyYXkgd2l0aCB0aGUgZmlyc3QgZW1wdHkgZWxlbWVudC5cbiAgICAgIC8vIEl0ZXJhdGluZyBieSAyIGJlY2F1c2Ugd2UgcGFyc2UgcGFpcnMgKy8tIHRoZW4gZGF0YS5cbiAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgcGFydHMubGVuZ3RoIC0gMTsgaSArPSAyKSB7XG4gICAgICAgIGFjdGlvbiA9IHBhcnRzW2ldO1xuICAgICAgICBjb25zdCBtMCA9IEFjY2Vzc01vZGUuZGVjb2RlKHBhcnRzW2kgKyAxXSk7XG4gICAgICAgIGlmIChtMCA9PSBBY2Nlc3NNb2RlLl9JTlZBTElEKSB7XG4gICAgICAgICAgcmV0dXJuIHZhbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAobTAgPT0gbnVsbCkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhY3Rpb24gPT09ICcrJykge1xuICAgICAgICAgIHZhbDAgfD0gbTA7XG4gICAgICAgIH0gZWxzZSBpZiAoYWN0aW9uID09PSAnLScpIHtcbiAgICAgICAgICB2YWwwICY9IH5tMDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdmFsID0gdmFsMDtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVGhlIHN0cmluZyBpcyBhbiBleHBsaWNpdCBuZXcgdmFsdWUgJ0FCQycgcmF0aGVyIHRoYW4gZGVsdGEuXG4gICAgICBjb25zdCB2YWwwID0gQWNjZXNzTW9kZS5kZWNvZGUodXBkKTtcbiAgICAgIGlmICh2YWwwICE9IEFjY2Vzc01vZGUuX0lOVkFMSUQpIHtcbiAgICAgICAgdmFsID0gdmFsMDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdmFsO1xuICB9XG4gIC8qKlxuICAgKiBCaXRzIHByZXNlbnQgaW4gYTEgYnV0IG1pc3NpbmcgaW4gYTIuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlciB8IHN0cmluZ30gYTEgLSBhY2Nlc3MgbW9kZSB0byBzdWJ0cmFjdCBmcm9tLlxuICAgKiBAcGFyYW0ge251bWJlciB8IHN0cmluZ30gYTIgLSBhY2Nlc3MgbW9kZSB0byBzdWJ0cmFjdC5cbiAgICogQHJldHVybnMge251bWJlcn0gYWNjZXNzIG1vZGUgd2l0aCBiaXRzIHByZXNlbnQgaW4gPGNvZGU+YTE8L2NvZGU+IGJ1dCBtaXNzaW5nIGluIDxjb2RlPmEyPC9jb2RlPi5cbiAgICovXG4gIHN0YXRpYyBkaWZmKGExLCBhMikge1xuICAgIGExID0gQWNjZXNzTW9kZS5kZWNvZGUoYTEpO1xuICAgIGEyID0gQWNjZXNzTW9kZS5kZWNvZGUoYTIpO1xuXG4gICAgaWYgKGExID09IEFjY2Vzc01vZGUuX0lOVkFMSUQgfHwgYTIgPT0gQWNjZXNzTW9kZS5fSU5WQUxJRCkge1xuICAgICAgcmV0dXJuIEFjY2Vzc01vZGUuX0lOVkFMSUQ7XG4gICAgfVxuICAgIHJldHVybiBhMSAmIH5hMjtcbiAgfVxuICAvKipcbiAgICogQWNjZXNzTW9kZSBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyB0b3BpYyBhY2Nlc3MgbW9kZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAY2xhc3MgQWNjZXNzTW9kZVxuICAgKi9cbiAgLyoqXG4gICAqIEN1c3RvbSBmb3JtYXR0ZXJcbiAgICovXG4gIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiAne1wibW9kZVwiOiBcIicgKyBBY2Nlc3NNb2RlLmVuY29kZSh0aGlzLm1vZGUpICtcbiAgICAgICdcIiwgXCJnaXZlblwiOiBcIicgKyBBY2Nlc3NNb2RlLmVuY29kZSh0aGlzLmdpdmVuKSArXG4gICAgICAnXCIsIFwid2FudFwiOiBcIicgKyBBY2Nlc3NNb2RlLmVuY29kZSh0aGlzLndhbnQpICsgJ1wifSc7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBDb252ZXJ0cyBudW1lcmljIHZhbHVlcyB0byBzdHJpbmdzLlxuICAgKi9cbiAganNvbkhlbHBlcigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbW9kZTogQWNjZXNzTW9kZS5lbmNvZGUodGhpcy5tb2RlKSxcbiAgICAgIGdpdmVuOiBBY2Nlc3NNb2RlLmVuY29kZSh0aGlzLmdpdmVuKSxcbiAgICAgIHdhbnQ6IEFjY2Vzc01vZGUuZW5jb2RlKHRoaXMud2FudClcbiAgICB9O1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogQXNzaWduIHZhbHVlIHRvICdtb2RlJy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nIHwgTnVtYmVyfSBtIC0gZWl0aGVyIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBhY2Nlc3MgbW9kZSBvciBhIHNldCBvZiBiaXRzLlxuICAgKiBAcmV0dXJucyB7QWNjZXNzTW9kZX0gLSA8Y29kZT50aGlzPC9jb2RlPiBBY2Nlc3NNb2RlLlxuICAgKi9cbiAgc2V0TW9kZShtKSB7XG4gICAgdGhpcy5tb2RlID0gQWNjZXNzTW9kZS5kZWNvZGUobSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBVcGRhdGUgPGNvZGU+bW9kZTwvY29kZT4gdmFsdWUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdSAtIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgY2hhbmdlcyB0byBhcHBseSB0byBhY2Nlc3MgbW9kZS5cbiAgICogQHJldHVybnMge0FjY2Vzc01vZGV9IC0gPGNvZGU+dGhpczwvY29kZT4gQWNjZXNzTW9kZS5cbiAgICovXG4gIHVwZGF0ZU1vZGUodSkge1xuICAgIHRoaXMubW9kZSA9IEFjY2Vzc01vZGUudXBkYXRlKHRoaXMubW9kZSwgdSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBHZXQgPGNvZGU+bW9kZTwvY29kZT4gdmFsdWUgYXMgYSBzdHJpbmcuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSAtIDxjb2RlPm1vZGU8L2NvZGU+IHZhbHVlLlxuICAgKi9cbiAgZ2V0TW9kZSgpIHtcbiAgICByZXR1cm4gQWNjZXNzTW9kZS5lbmNvZGUodGhpcy5tb2RlKTtcbiAgfVxuICAvKipcbiAgICogQWNjZXNzTW9kZSBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyB0b3BpYyBhY2Nlc3MgbW9kZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAY2xhc3MgQWNjZXNzTW9kZVxuICAgKi9cbiAgLyoqXG4gICAqIEFzc2lnbiA8Y29kZT5naXZlbjwvY29kZT4gIHZhbHVlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmcgfCBOdW1iZXJ9IGcgLSBlaXRoZXIgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIGFjY2VzcyBtb2RlIG9yIGEgc2V0IG9mIGJpdHMuXG4gICAqIEByZXR1cm5zIHtBY2Nlc3NNb2RlfSAtIDxjb2RlPnRoaXM8L2NvZGU+IEFjY2Vzc01vZGUuXG4gICAqL1xuICBzZXRHaXZlbihnKSB7XG4gICAgdGhpcy5naXZlbiA9IEFjY2Vzc01vZGUuZGVjb2RlKGcpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogVXBkYXRlICdnaXZlbicgdmFsdWUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdSAtIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgY2hhbmdlcyB0byBhcHBseSB0byBhY2Nlc3MgbW9kZS5cbiAgICogQHJldHVybnMge0FjY2Vzc01vZGV9IC0gPGNvZGU+dGhpczwvY29kZT4gQWNjZXNzTW9kZS5cbiAgICovXG4gIHVwZGF0ZUdpdmVuKHUpIHtcbiAgICB0aGlzLmdpdmVuID0gQWNjZXNzTW9kZS51cGRhdGUodGhpcy5naXZlbiwgdSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBHZXQgJ2dpdmVuJyB2YWx1ZSBhcyBhIHN0cmluZy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IC0gPGI+Z2l2ZW48L2I+IHZhbHVlLlxuICAgKi9cbiAgZ2V0R2l2ZW4oKSB7XG4gICAgcmV0dXJuIEFjY2Vzc01vZGUuZW5jb2RlKHRoaXMuZ2l2ZW4pO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogQXNzaWduICd3YW50JyB2YWx1ZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nIHwgTnVtYmVyfSB3IC0gZWl0aGVyIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBhY2Nlc3MgbW9kZSBvciBhIHNldCBvZiBiaXRzLlxuICAgKiBAcmV0dXJucyB7QWNjZXNzTW9kZX0gLSA8Y29kZT50aGlzPC9jb2RlPiBBY2Nlc3NNb2RlLlxuICAgKi9cbiAgc2V0V2FudCh3KSB7XG4gICAgdGhpcy53YW50ID0gQWNjZXNzTW9kZS5kZWNvZGUodyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBVcGRhdGUgJ3dhbnQnIHZhbHVlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHUgLSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIGNoYW5nZXMgdG8gYXBwbHkgdG8gYWNjZXNzIG1vZGUuXG4gICAqIEByZXR1cm5zIHtBY2Nlc3NNb2RlfSAtIDxjb2RlPnRoaXM8L2NvZGU+IEFjY2Vzc01vZGUuXG4gICAqL1xuICB1cGRhdGVXYW50KHUpIHtcbiAgICB0aGlzLndhbnQgPSBBY2Nlc3NNb2RlLnVwZGF0ZSh0aGlzLndhbnQsIHUpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogR2V0ICd3YW50JyB2YWx1ZSBhcyBhIHN0cmluZy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IC0gPGI+d2FudDwvYj4gdmFsdWUuXG4gICAqL1xuICBnZXRXYW50KCkge1xuICAgIHJldHVybiBBY2Nlc3NNb2RlLmVuY29kZSh0aGlzLndhbnQpO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogR2V0IHBlcm1pc3Npb25zIHByZXNlbnQgaW4gJ3dhbnQnIGJ1dCBtaXNzaW5nIGluICdnaXZlbicuXG4gICAqIEludmVyc2Ugb2Yge0BsaW5rIFRpbm9kZS5BY2Nlc3NNb2RlI2dldEV4Y2Vzc2l2ZX1cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IHBlcm1pc3Npb25zIHByZXNlbnQgaW4gPGI+d2FudDwvYj4gYnV0IG1pc3NpbmcgaW4gPGI+Z2l2ZW48L2I+LlxuICAgKi9cbiAgZ2V0TWlzc2luZygpIHtcbiAgICByZXR1cm4gQWNjZXNzTW9kZS5lbmNvZGUodGhpcy53YW50ICYgfnRoaXMuZ2l2ZW4pO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogR2V0IHBlcm1pc3Npb25zIHByZXNlbnQgaW4gJ2dpdmVuJyBidXQgbWlzc2luZyBpbiAnd2FudCcuXG4gICAqIEludmVyc2Ugb2Yge0BsaW5rIFRpbm9kZS5BY2Nlc3NNb2RlI2dldE1pc3Npbmd9XG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBwZXJtaXNzaW9ucyBwcmVzZW50IGluIDxiPmdpdmVuPC9iPiBidXQgbWlzc2luZyBpbiA8Yj53YW50PC9iPi5cbiAgICovXG4gIGdldEV4Y2Vzc2l2ZSgpIHtcbiAgICByZXR1cm4gQWNjZXNzTW9kZS5lbmNvZGUodGhpcy5naXZlbiAmIH50aGlzLndhbnQpO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogVXBkYXRlICd3YW50JywgJ2dpdmUnLCBhbmQgJ21vZGUnIHZhbHVlcy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqXG4gICAqIEBwYXJhbSB7QWNjZXNzTW9kZX0gdmFsIC0gbmV3IGFjY2VzcyBtb2RlIHZhbHVlLlxuICAgKiBAcmV0dXJucyB7QWNjZXNzTW9kZX0gLSA8Y29kZT50aGlzPC9jb2RlPiBBY2Nlc3NNb2RlLlxuICAgKi9cbiAgdXBkYXRlQWxsKHZhbCkge1xuICAgIGlmICh2YWwpIHtcbiAgICAgIHRoaXMudXBkYXRlR2l2ZW4odmFsLmdpdmVuKTtcbiAgICAgIHRoaXMudXBkYXRlV2FudCh2YWwud2FudCk7XG4gICAgICB0aGlzLm1vZGUgPSB0aGlzLmdpdmVuICYgdGhpcy53YW50O1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICAvKipcbiAgICogQWNjZXNzTW9kZSBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyB0b3BpYyBhY2Nlc3MgbW9kZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAY2xhc3MgQWNjZXNzTW9kZVxuICAgKi9cbiAgLyoqXG4gICAqIENoZWNrIGlmIE93bmVyIChPKSBmbGFnIGlzIHNldC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gc2lkZSAtIHdoaWNoIHBlcm1pc3Npb24gdG8gY2hlY2s6IGdpdmVuLCB3YW50LCBtb2RlOyBkZWZhdWx0OiBtb2RlLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSA8Y29kZT50cnVlPC9jb2RlPiBpZiBmbGFnIGlzIHNldC5cbiAgICovXG4gIGlzT3duZXIoc2lkZSkge1xuICAgIHJldHVybiBBY2Nlc3NNb2RlLiNjaGVja0ZsYWcodGhpcywgc2lkZSwgQWNjZXNzTW9kZS5fT1dORVIpO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogQ2hlY2sgaWYgUHJlc2VuY2UgKFApIGZsYWcgaXMgc2V0LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICogQHBhcmFtIHtzdHJpbmc9fSBzaWRlIC0gd2hpY2ggcGVybWlzc2lvbiB0byBjaGVjazogZ2l2ZW4sIHdhbnQsIG1vZGU7IGRlZmF1bHQ6IG1vZGUuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIDxjb2RlPnRydWU8L2NvZGU+IGlmIGZsYWcgaXMgc2V0LlxuICAgKi9cbiAgaXNQcmVzZW5jZXIoc2lkZSkge1xuICAgIHJldHVybiBBY2Nlc3NNb2RlLiNjaGVja0ZsYWcodGhpcywgc2lkZSwgQWNjZXNzTW9kZS5fUFJFUyk7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBDaGVjayBpZiBQcmVzZW5jZSAoUCkgZmxhZyBpcyBOT1Qgc2V0LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICogQHBhcmFtIHtzdHJpbmc9fSBzaWRlIC0gd2hpY2ggcGVybWlzc2lvbiB0byBjaGVjazogZ2l2ZW4sIHdhbnQsIG1vZGU7IGRlZmF1bHQ6IG1vZGUuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIDxjb2RlPnRydWU8L2NvZGU+IGlmIGZsYWcgaXMgc2V0LlxuICAgKi9cbiAgaXNNdXRlZChzaWRlKSB7XG4gICAgcmV0dXJuICF0aGlzLmlzUHJlc2VuY2VyKHNpZGUpO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogQ2hlY2sgaWYgSm9pbiAoSikgZmxhZyBpcyBzZXQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKiBAcGFyYW0ge3N0cmluZz19IHNpZGUgLSB3aGljaCBwZXJtaXNzaW9uIHRvIGNoZWNrOiBnaXZlbiwgd2FudCwgbW9kZTsgZGVmYXVsdDogbW9kZS5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IC0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgZmxhZyBpcyBzZXQuXG4gICAqL1xuICBpc0pvaW5lcihzaWRlKSB7XG4gICAgcmV0dXJuIEFjY2Vzc01vZGUuI2NoZWNrRmxhZyh0aGlzLCBzaWRlLCBBY2Nlc3NNb2RlLl9KT0lOKTtcbiAgfVxuICAvKipcbiAgICogQWNjZXNzTW9kZSBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyB0b3BpYyBhY2Nlc3MgbW9kZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAY2xhc3MgQWNjZXNzTW9kZVxuICAgKi9cbiAgLyoqXG4gICAqIENoZWNrIGlmIFJlYWRlciAoUikgZmxhZyBpcyBzZXQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKiBAcGFyYW0ge3N0cmluZz19IHNpZGUgLSB3aGljaCBwZXJtaXNzaW9uIHRvIGNoZWNrOiBnaXZlbiwgd2FudCwgbW9kZTsgZGVmYXVsdDogbW9kZS5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IC0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgZmxhZyBpcyBzZXQuXG4gICAqL1xuICBpc1JlYWRlcihzaWRlKSB7XG4gICAgcmV0dXJuIEFjY2Vzc01vZGUuI2NoZWNrRmxhZyh0aGlzLCBzaWRlLCBBY2Nlc3NNb2RlLl9SRUFEKTtcbiAgfVxuICAvKipcbiAgICogQWNjZXNzTW9kZSBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyB0b3BpYyBhY2Nlc3MgbW9kZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAY2xhc3MgQWNjZXNzTW9kZVxuICAgKi9cbiAgLyoqXG4gICAqIENoZWNrIGlmIFdyaXRlciAoVykgZmxhZyBpcyBzZXQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKiBAcGFyYW0ge3N0cmluZz19IHNpZGUgLSB3aGljaCBwZXJtaXNzaW9uIHRvIGNoZWNrOiBnaXZlbiwgd2FudCwgbW9kZTsgZGVmYXVsdDogbW9kZS5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IC0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgZmxhZyBpcyBzZXQuXG4gICAqL1xuICBpc1dyaXRlcihzaWRlKSB7XG4gICAgcmV0dXJuIEFjY2Vzc01vZGUuI2NoZWNrRmxhZyh0aGlzLCBzaWRlLCBBY2Nlc3NNb2RlLl9XUklURSk7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBDaGVjayBpZiBBcHByb3ZlciAoQSkgZmxhZyBpcyBzZXQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKiBAcGFyYW0ge3N0cmluZz19IHNpZGUgLSB3aGljaCBwZXJtaXNzaW9uIHRvIGNoZWNrOiBnaXZlbiwgd2FudCwgbW9kZTsgZGVmYXVsdDogbW9kZS5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IC0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgZmxhZyBpcyBzZXQuXG4gICAqL1xuICBpc0FwcHJvdmVyKHNpZGUpIHtcbiAgICByZXR1cm4gQWNjZXNzTW9kZS4jY2hlY2tGbGFnKHRoaXMsIHNpZGUsIEFjY2Vzc01vZGUuX0FQUFJPVkUpO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogQ2hlY2sgaWYgZWl0aGVyIG9uZSBvZiBPd25lciAoTykgb3IgQXBwcm92ZXIgKEEpIGZsYWdzIGlzIHNldC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gc2lkZSAtIHdoaWNoIHBlcm1pc3Npb24gdG8gY2hlY2s6IGdpdmVuLCB3YW50LCBtb2RlOyBkZWZhdWx0OiBtb2RlLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSA8Y29kZT50cnVlPC9jb2RlPiBpZiBmbGFnIGlzIHNldC5cbiAgICovXG4gIGlzQWRtaW4oc2lkZSkge1xuICAgIHJldHVybiB0aGlzLmlzT3duZXIoc2lkZSkgfHwgdGhpcy5pc0FwcHJvdmVyKHNpZGUpO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogQ2hlY2sgaWYgZWl0aGVyIG9uZSBvZiBPd25lciAoTyksIEFwcHJvdmVyIChBKSwgb3IgU2hhcmVyIChTKSBmbGFncyBpcyBzZXQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKiBAcGFyYW0ge3N0cmluZz19IHNpZGUgLSB3aGljaCBwZXJtaXNzaW9uIHRvIGNoZWNrOiBnaXZlbiwgd2FudCwgbW9kZTsgZGVmYXVsdDogbW9kZS5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IC0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgZmxhZyBpcyBzZXQuXG4gICAqL1xuICBpc1NoYXJlcihzaWRlKSB7XG4gICAgcmV0dXJuIHRoaXMuaXNBZG1pbihzaWRlKSB8fCBBY2Nlc3NNb2RlLiNjaGVja0ZsYWcodGhpcywgc2lkZSwgQWNjZXNzTW9kZS5fU0hBUkUpO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogQ2hlY2sgaWYgRGVsZXRlciAoRCkgZmxhZyBpcyBzZXQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKiBAcGFyYW0ge3N0cmluZz19IHNpZGUgLSB3aGljaCBwZXJtaXNzaW9uIHRvIGNoZWNrOiBnaXZlbiwgd2FudCwgbW9kZTsgZGVmYXVsdDogbW9kZS5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IC0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgZmxhZyBpcyBzZXQuXG4gICAqL1xuICBpc0RlbGV0ZXIoc2lkZSkge1xuICAgIHJldHVybiBBY2Nlc3NNb2RlLiNjaGVja0ZsYWcodGhpcywgc2lkZSwgQWNjZXNzTW9kZS5fREVMRVRFKTtcbiAgfVxufVxuXG5BY2Nlc3NNb2RlLl9OT05FID0gMHgwMDtcbkFjY2Vzc01vZGUuX0pPSU4gPSAweDAxO1xuQWNjZXNzTW9kZS5fUkVBRCA9IDB4MDI7XG5BY2Nlc3NNb2RlLl9XUklURSA9IDB4MDQ7XG5BY2Nlc3NNb2RlLl9QUkVTID0gMHgwODtcbkFjY2Vzc01vZGUuX0FQUFJPVkUgPSAweDEwO1xuQWNjZXNzTW9kZS5fU0hBUkUgPSAweDIwO1xuQWNjZXNzTW9kZS5fREVMRVRFID0gMHg0MDtcbkFjY2Vzc01vZGUuX09XTkVSID0gMHg4MDtcblxuQWNjZXNzTW9kZS5fQklUTUFTSyA9IEFjY2Vzc01vZGUuX0pPSU4gfCBBY2Nlc3NNb2RlLl9SRUFEIHwgQWNjZXNzTW9kZS5fV1JJVEUgfCBBY2Nlc3NNb2RlLl9QUkVTIHxcbiAgQWNjZXNzTW9kZS5fQVBQUk9WRSB8IEFjY2Vzc01vZGUuX1NIQVJFIHwgQWNjZXNzTW9kZS5fREVMRVRFIHwgQWNjZXNzTW9kZS5fT1dORVI7XG5BY2Nlc3NNb2RlLl9JTlZBTElEID0gMHgxMDAwMDA7XG4iLCIvKipcbiAqIEBmaWxlIEluLW1lbW9yeSBzb3J0ZWQgY2FjaGUgb2Ygb2JqZWN0cy5cbiAqXG4gKiBAY29weXJpZ2h0IDIwMTUtMjAyMiBUaW5vZGUgTExDLlxuICovXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogSW4tbWVtb3J5IHNvcnRlZCBjYWNoZSBvZiBvYmplY3RzLlxuICpcbiAqIEBjbGFzcyBDQnVmZmVyXG4gKiBAbWVtYmVyb2YgVGlub2RlXG4gKiBAcHJvdGVjdGVkXG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbn0gY29tcGFyZSBjdXN0b20gY29tcGFyYXRvciBvZiBvYmplY3RzLiBUYWtlcyB0d28gcGFyYW1ldGVycyA8Y29kZT5hPC9jb2RlPiBhbmQgPGNvZGU+YjwvY29kZT47XG4gKiAgICByZXR1cm5zIDxjb2RlPi0xPC9jb2RlPiBpZiA8Y29kZT5hIDwgYjwvY29kZT4sIDxjb2RlPjA8L2NvZGU+IGlmIDxjb2RlPmEgPT0gYjwvY29kZT4sIDxjb2RlPjE8L2NvZGU+IG90aGVyd2lzZS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gdW5pcXVlIGVuZm9yY2UgZWxlbWVudCB1bmlxdWVuZXNzOiB3aGVuIDxjb2RlPnRydWU8L2NvZGU+IHJlcGxhY2UgZXhpc3RpbmcgZWxlbWVudCB3aXRoIGEgbmV3XG4gKiAgICBvbmUgb24gY29uZmxpY3Q7IHdoZW4gPGNvZGU+ZmFsc2U8L2NvZGU+IGtlZXAgYm90aCBlbGVtZW50cy5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ0J1ZmZlciB7XG4gICNjb21wYXJhdG9yID0gdW5kZWZpbmVkO1xuICAjdW5pcXVlID0gZmFsc2U7XG4gIGJ1ZmZlciA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKGNvbXBhcmVfLCB1bmlxdWVfKSB7XG4gICAgdGhpcy4jY29tcGFyYXRvciA9IGNvbXBhcmVfIHx8ICgoYSwgYikgPT4ge1xuICAgICAgcmV0dXJuIGEgPT09IGIgPyAwIDogYSA8IGIgPyAtMSA6IDE7XG4gICAgfSk7XG4gICAgdGhpcy4jdW5pcXVlID0gdW5pcXVlXztcbiAgfVxuXG4gICNmaW5kTmVhcmVzdChlbGVtLCBhcnIsIGV4YWN0KSB7XG4gICAgbGV0IHN0YXJ0ID0gMDtcbiAgICBsZXQgZW5kID0gYXJyLmxlbmd0aCAtIDE7XG4gICAgbGV0IHBpdm90ID0gMDtcbiAgICBsZXQgZGlmZiA9IDA7XG4gICAgbGV0IGZvdW5kID0gZmFsc2U7XG5cbiAgICB3aGlsZSAoc3RhcnQgPD0gZW5kKSB7XG4gICAgICBwaXZvdCA9IChzdGFydCArIGVuZCkgLyAyIHwgMDtcbiAgICAgIGRpZmYgPSB0aGlzLiNjb21wYXJhdG9yKGFycltwaXZvdF0sIGVsZW0pO1xuICAgICAgaWYgKGRpZmYgPCAwKSB7XG4gICAgICAgIHN0YXJ0ID0gcGl2b3QgKyAxO1xuICAgICAgfSBlbHNlIGlmIChkaWZmID4gMCkge1xuICAgICAgICBlbmQgPSBwaXZvdCAtIDE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZm91bmQpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlkeDogcGl2b3QsXG4gICAgICAgIGV4YWN0OiB0cnVlXG4gICAgICB9O1xuICAgIH1cbiAgICBpZiAoZXhhY3QpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlkeDogLTFcbiAgICAgIH07XG4gICAgfVxuICAgIC8vIE5vdCBleGFjdCAtIGluc2VydGlvbiBwb2ludFxuICAgIHJldHVybiB7XG4gICAgICBpZHg6IGRpZmYgPCAwID8gcGl2b3QgKyAxIDogcGl2b3RcbiAgICB9O1xuICB9XG5cbiAgLy8gSW5zZXJ0IGVsZW1lbnQgaW50byBhIHNvcnRlZCBhcnJheS5cbiAgI2luc2VydFNvcnRlZChlbGVtLCBhcnIpIHtcbiAgICBjb25zdCBmb3VuZCA9IHRoaXMuI2ZpbmROZWFyZXN0KGVsZW0sIGFyciwgZmFsc2UpO1xuICAgIGNvbnN0IGNvdW50ID0gKGZvdW5kLmV4YWN0ICYmIHRoaXMuI3VuaXF1ZSkgPyAxIDogMDtcbiAgICBhcnIuc3BsaWNlKGZvdW5kLmlkeCwgY291bnQsIGVsZW0pO1xuICAgIHJldHVybiBhcnI7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGFuIGVsZW1lbnQgYXQgdGhlIGdpdmVuIHBvc2l0aW9uLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNCdWZmZXIjXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBhdCAtIFBvc2l0aW9uIHRvIGZldGNoIGZyb20uXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IEVsZW1lbnQgYXQgdGhlIGdpdmVuIHBvc2l0aW9uIG9yIDxjb2RlPnVuZGVmaW5lZDwvY29kZT4uXG4gICAqL1xuICBnZXRBdChhdCkge1xuICAgIHJldHVybiB0aGlzLmJ1ZmZlclthdF07XG4gIH1cblxuICAvKipcbiAgICogQ29udmVuaWVuY2UgbWV0aG9kIGZvciBnZXR0aW5nIHRoZSBlbGVtZW50IGZyb20gdGhlIGVuZCBvZiB0aGUgYnVmZmVyLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNCdWZmZXIjXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBhdCAtIHBvc2l0aW9uIHRvIGZldGNoIGZyb20sIGNvdW50aW5nIGZyb20gdGhlIGVuZDtcbiAgICogICAgPGNvZGU+dW5kZWZpbmVkPC9jb2RlPiBvciA8Y29kZT5udWxsPC9jb2RlPiAgbWVhbiBcImxhc3RcIi5cbiAgICogQHJldHVybnMge09iamVjdH0gVGhlIGxhc3QgZWxlbWVudCBpbiB0aGUgYnVmZmVyIG9yIDxjb2RlPnVuZGVmaW5lZDwvY29kZT4gaWYgYnVmZmVyIGlzIGVtcHR5LlxuICAgKi9cbiAgZ2V0TGFzdChhdCkge1xuICAgIGF0IHw9IDA7XG4gICAgcmV0dXJuIHRoaXMuYnVmZmVyLmxlbmd0aCA+IGF0ID8gdGhpcy5idWZmZXJbdGhpcy5idWZmZXIubGVuZ3RoIC0gMSAtIGF0XSA6IHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgbmV3IGVsZW1lbnQocykgdG8gdGhlIGJ1ZmZlci4gVmFyaWFkaWM6IHRha2VzIG9uZSBvciBtb3JlIGFyZ3VtZW50cy4gSWYgYW4gYXJyYXkgaXMgcGFzc2VkIGFzIGEgc2luZ2xlXG4gICAqIGFyZ3VtZW50LCBpdHMgZWxlbWVudHMgYXJlIGluc2VydGVkIGluZGl2aWR1YWxseS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5DQnVmZmVyI1xuICAgKlxuICAgKiBAcGFyYW0gey4uLk9iamVjdHxBcnJheX0gLSBPbmUgb3IgbW9yZSBvYmplY3RzIHRvIGluc2VydC5cbiAgICovXG4gIHB1dCgpIHtcbiAgICBsZXQgaW5zZXJ0O1xuICAgIC8vIGluc3BlY3QgYXJndW1lbnRzOiBpZiBhcnJheSwgaW5zZXJ0IGl0cyBlbGVtZW50cywgaWYgb25lIG9yIG1vcmUgbm9uLWFycmF5IGFyZ3VtZW50cywgaW5zZXJ0IHRoZW0gb25lIGJ5IG9uZVxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDEgJiYgQXJyYXkuaXNBcnJheShhcmd1bWVudHNbMF0pKSB7XG4gICAgICBpbnNlcnQgPSBhcmd1bWVudHNbMF07XG4gICAgfSBlbHNlIHtcbiAgICAgIGluc2VydCA9IGFyZ3VtZW50cztcbiAgICB9XG4gICAgZm9yIChsZXQgaWR4IGluIGluc2VydCkge1xuICAgICAgdGhpcy4jaW5zZXJ0U29ydGVkKGluc2VydFtpZHhdLCB0aGlzLmJ1ZmZlcik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBlbGVtZW50IGF0IHRoZSBnaXZlbiBwb3NpdGlvbi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5DQnVmZmVyI1xuICAgKiBAcGFyYW0ge251bWJlcn0gYXQgLSBQb3NpdGlvbiB0byBkZWxldGUgYXQuXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IEVsZW1lbnQgYXQgdGhlIGdpdmVuIHBvc2l0aW9uIG9yIDxjb2RlPnVuZGVmaW5lZDwvY29kZT4uXG4gICAqL1xuICBkZWxBdChhdCkge1xuICAgIGF0IHw9IDA7XG4gICAgbGV0IHIgPSB0aGlzLmJ1ZmZlci5zcGxpY2UoYXQsIDEpO1xuICAgIGlmIChyICYmIHIubGVuZ3RoID4gMCkge1xuICAgICAgcmV0dXJuIHJbMF07XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGVsZW1lbnRzIGJldHdlZW4gdHdvIHBvc2l0aW9ucy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5DQnVmZmVyI1xuICAgKiBAcGFyYW0ge251bWJlcn0gc2luY2UgLSBQb3NpdGlvbiB0byBkZWxldGUgZnJvbSAoaW5jbHVzaXZlKS5cbiAgICogQHBhcmFtIHtudW1iZXJ9IGJlZm9yZSAtIFBvc2l0aW9uIHRvIGRlbGV0ZSB0byAoZXhjbHVzaXZlKS5cbiAgICpcbiAgICogQHJldHVybnMge0FycmF5fSBhcnJheSBvZiByZW1vdmVkIGVsZW1lbnRzIChjb3VsZCBiZSB6ZXJvIGxlbmd0aCkuXG4gICAqL1xuICBkZWxSYW5nZShzaW5jZSwgYmVmb3JlKSB7XG4gICAgcmV0dXJuIHRoaXMuYnVmZmVyLnNwbGljZShzaW5jZSwgYmVmb3JlIC0gc2luY2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgbnVtYmVyIG9mIGVsZW1lbnRzIHRoZSBidWZmZXIgaG9sZHMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ0J1ZmZlciNcbiAgICogQHJldHVybiB7bnVtYmVyfSBOdW1iZXIgb2YgZWxlbWVudHMgaW4gdGhlIGJ1ZmZlci5cbiAgICovXG4gIGxlbmd0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5idWZmZXIubGVuZ3RoO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0IHRoZSBidWZmZXIgZGlzY2FyZGluZyBhbGwgZWxlbWVudHNcbiAgICogQG1lbWJlcm9mIFRpbm9kZS5DQnVmZmVyI1xuICAgKi9cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5idWZmZXIgPSBbXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsYmFjayBmb3IgaXRlcmF0aW5nIGNvbnRlbnRzIG9mIGJ1ZmZlci4gU2VlIHtAbGluayBUaW5vZGUuQ0J1ZmZlciNmb3JFYWNofS5cbiAgICogQGNhbGxiYWNrIEZvckVhY2hDYWxsYmFja1R5cGVcbiAgICogQG1lbWJlcm9mIFRpbm9kZS5DQnVmZmVyI1xuICAgKiBAcGFyYW0ge09iamVjdH0gZWxlbSAtIEN1cnJlbnQgZWxlbWVudCBvZiB0aGUgYnVmZmVyLlxuICAgKiBAcGFyYW0ge09iamVjdH0gcHJldiAtIFByZXZpb3VzIGVsZW1lbnQgb2YgdGhlIGJ1ZmZlci5cbiAgICogQHBhcmFtIHtPYmplY3R9IG5leHQgLSBOZXh0IGVsZW1lbnQgb2YgdGhlIGJ1ZmZlci5cbiAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IC0gSW5kZXggb2YgdGhlIGN1cnJlbnQgZWxlbWVudC5cbiAgICovXG5cbiAgLyoqXG4gICAqIEFwcGx5IGdpdmVuIDxjb2RlPmNhbGxiYWNrPC9jb2RlPiB0byBhbGwgZWxlbWVudHMgb2YgdGhlIGJ1ZmZlci5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5DQnVmZmVyI1xuICAgKlxuICAgKiBAcGFyYW0ge1Rpbm9kZS5Gb3JFYWNoQ2FsbGJhY2tUeXBlfSBjYWxsYmFjayAtIEZ1bmN0aW9uIHRvIGNhbGwgZm9yIGVhY2ggZWxlbWVudC5cbiAgICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0SWR4IC0gT3B0aW9uYWwgaW5kZXggdG8gc3RhcnQgaXRlcmF0aW5nIGZyb20gKGluY2x1c2l2ZSkuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBiZWZvcmVJZHggLSBPcHRpb25hbCBpbmRleCB0byBzdG9wIGl0ZXJhdGluZyBiZWZvcmUgKGV4Y2x1c2l2ZSkuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZXh0IC0gY2FsbGluZyBjb250ZXh0IChpLmUuIHZhbHVlIG9mIDxjb2RlPnRoaXM8L2NvZGU+IGluIGNhbGxiYWNrKVxuICAgKi9cbiAgZm9yRWFjaChjYWxsYmFjaywgc3RhcnRJZHgsIGJlZm9yZUlkeCwgY29udGV4dCkge1xuICAgIHN0YXJ0SWR4ID0gc3RhcnRJZHggfCAwO1xuICAgIGJlZm9yZUlkeCA9IGJlZm9yZUlkeCB8fCB0aGlzLmJ1ZmZlci5sZW5ndGg7XG5cbiAgICBmb3IgKGxldCBpID0gc3RhcnRJZHg7IGkgPCBiZWZvcmVJZHg7IGkrKykge1xuICAgICAgY2FsbGJhY2suY2FsbChjb250ZXh0LCB0aGlzLmJ1ZmZlcltpXSxcbiAgICAgICAgKGkgPiBzdGFydElkeCA/IHRoaXMuYnVmZmVyW2kgLSAxXSA6IHVuZGVmaW5lZCksXG4gICAgICAgIChpIDwgYmVmb3JlSWR4IC0gMSA/IHRoaXMuYnVmZmVyW2kgKyAxXSA6IHVuZGVmaW5lZCksIGkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5kIGVsZW1lbnQgaW4gYnVmZmVyIHVzaW5nIGJ1ZmZlcidzIGNvbXBhcmlzb24gZnVuY3Rpb24uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ0J1ZmZlciNcbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IGVsZW0gLSBlbGVtZW50IHRvIGZpbmQuXG4gICAqIEBwYXJhbSB7Ym9vbGVhbj19IG5lYXJlc3QgLSB3aGVuIHRydWUgYW5kIGV4YWN0IG1hdGNoIGlzIG5vdCBmb3VuZCwgcmV0dXJuIHRoZSBuZWFyZXN0IGVsZW1lbnQgKGluc2VydGlvbiBwb2ludCkuXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IGluZGV4IG9mIHRoZSBlbGVtZW50IGluIHRoZSBidWZmZXIgb3IgLTEuXG4gICAqL1xuICBmaW5kKGVsZW0sIG5lYXJlc3QpIHtcbiAgICBjb25zdCB7XG4gICAgICBpZHhcbiAgICB9ID0gdGhpcy4jZmluZE5lYXJlc3QoZWxlbSwgdGhpcy5idWZmZXIsICFuZWFyZXN0KTtcbiAgICByZXR1cm4gaWR4O1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIGZvciBmaWx0ZXJpbmcgdGhlIGJ1ZmZlci4gU2VlIHtAbGluayBUaW5vZGUuQ0J1ZmZlciNmaWx0ZXJ9LlxuICAgKiBAY2FsbGJhY2sgRmlsdGVyQ2FsbGJhY2tUeXBlXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ0J1ZmZlciNcbiAgICogQHBhcmFtIHtPYmplY3R9IGVsZW0gLSBDdXJyZW50IGVsZW1lbnQgb2YgdGhlIGJ1ZmZlci5cbiAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IC0gSW5kZXggb2YgdGhlIGN1cnJlbnQgZWxlbWVudC5cbiAgICogQHJldHVybnMge2Jvb2xlbn0gPGNvZGU+dHJ1ZTwvY29kZT4gdG8ga2VlcCB0aGUgZWxlbWVudCwgPGNvZGU+ZmFsc2U8L2NvZGU+IHRvIHJlbW92ZS5cbiAgICovXG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhbGwgZWxlbWVudHMgdGhhdCBkbyBub3QgcGFzcyB0aGUgdGVzdCBpbXBsZW1lbnRlZCBieSB0aGUgcHJvdmlkZWQgY2FsbGJhY2sgZnVuY3Rpb24uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ0J1ZmZlciNcbiAgICpcbiAgICogQHBhcmFtIHtUaW5vZGUuRmlsdGVyQ2FsbGJhY2tUeXBlfSBjYWxsYmFjayAtIEZ1bmN0aW9uIHRvIGNhbGwgZm9yIGVhY2ggZWxlbWVudC5cbiAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHQgLSBjYWxsaW5nIGNvbnRleHQgKGkuZS4gdmFsdWUgb2YgPGNvZGU+dGhpczwvY29kZT4gaW4gdGhlIGNhbGxiYWNrKVxuICAgKi9cbiAgZmlsdGVyKGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgbGV0IGNvdW50ID0gMDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYnVmZmVyLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoY2FsbGJhY2suY2FsbChjb250ZXh0LCB0aGlzLmJ1ZmZlcltpXSwgaSkpIHtcbiAgICAgICAgdGhpcy5idWZmZXJbY291bnRdID0gdGhpcy5idWZmZXJbaV07XG4gICAgICAgIGNvdW50Kys7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5idWZmZXIuc3BsaWNlKGNvdW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBidWZmZXIgaXMgZW1wdHkuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0aGUgYnVmZmVyIGlzIGVtcHR5LCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgaXNFbXB0eSgpIHtcbiAgICByZXR1cm4gdGhpcy5idWZmZXIubGVuZ3RoID09IDA7XG4gIH1cbn1cbiIsIi8qKlxuICogQGZpbGUgR2xvYmFsIGNvbnN0YW50cyBhbmQgY29uZmlndXJhdGlvbiBwYXJhbWV0ZXJzLlxuICpcbiAqIEBjb3B5cmlnaHQgMjAxNS0yMDIyIFRpbm9kZSBMTENcbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQge1xuICB2ZXJzaW9uIGFzIHBhY2thZ2VfdmVyc2lvblxufSBmcm9tICcuLi92ZXJzaW9uLmpzb24nO1xuXG4vLyBHbG9iYWwgY29uc3RhbnRzXG5leHBvcnQgY29uc3QgUFJPVE9DT0xfVkVSU0lPTiA9ICcwJzsgLy8gTWFqb3IgY29tcG9uZW50IG9mIHRoZSB2ZXJzaW9uLCBlLmcuICcwJyBpbiAnMC4xNy4xJy5cbmV4cG9ydCBjb25zdCBWRVJTSU9OID0gcGFja2FnZV92ZXJzaW9uIHx8ICcwLjIwJztcbmV4cG9ydCBjb25zdCBMSUJSQVJZID0gJ3Rpbm9kZWpzLycgKyBWRVJTSU9OO1xuXG4vLyBUb3BpYyBuYW1lIHByZWZpeGVzLlxuZXhwb3J0IGNvbnN0IFRPUElDX05FVyA9ICduZXcnO1xuZXhwb3J0IGNvbnN0IFRPUElDX05FV19DSEFOID0gJ25jaCc7XG5leHBvcnQgY29uc3QgVE9QSUNfTUUgPSAnbWUnO1xuZXhwb3J0IGNvbnN0IFRPUElDX0ZORCA9ICdmbmQnO1xuZXhwb3J0IGNvbnN0IFRPUElDX1NZUyA9ICdzeXMnO1xuZXhwb3J0IGNvbnN0IFRPUElDX0NIQU4gPSAnY2huJztcbmV4cG9ydCBjb25zdCBUT1BJQ19HUlAgPSAnZ3JwJztcbmV4cG9ydCBjb25zdCBUT1BJQ19QMlAgPSAncDJwJztcbmV4cG9ydCBjb25zdCBVU0VSX05FVyA9ICduZXcnO1xuXG4vLyBTdGFydGluZyB2YWx1ZSBvZiBhIGxvY2FsbHktZ2VuZXJhdGVkIHNlcUlkIHVzZWQgZm9yIHBlbmRpbmcgbWVzc2FnZXMuXG5leHBvcnQgY29uc3QgTE9DQUxfU0VRSUQgPSAweEZGRkZGRkY7XG5cbi8vIFN0YXR1cyBjb2Rlcy5cbmV4cG9ydCBjb25zdCBNRVNTQUdFX1NUQVRVU19OT05FID0gMDsgLy8gU3RhdHVzIG5vdCBhc3NpZ25lZC5cbmV4cG9ydCBjb25zdCBNRVNTQUdFX1NUQVRVU19RVUVVRUQgPSAxOyAvLyBMb2NhbCBJRCBhc3NpZ25lZCwgaW4gcHJvZ3Jlc3MgdG8gYmUgc2VudC5cbmV4cG9ydCBjb25zdCBNRVNTQUdFX1NUQVRVU19TRU5ESU5HID0gMjsgLy8gVHJhbnNtaXNzaW9uIHN0YXJ0ZWQuXG5leHBvcnQgY29uc3QgTUVTU0FHRV9TVEFUVVNfRkFJTEVEID0gMzsgLy8gQXQgbGVhc3Qgb25lIGF0dGVtcHQgd2FzIG1hZGUgdG8gc2VuZCB0aGUgbWVzc2FnZS5cbmV4cG9ydCBjb25zdCBNRVNTQUdFX1NUQVRVU19TRU5UID0gNDsgLy8gRGVsaXZlcmVkIHRvIHRoZSBzZXJ2ZXIuXG5leHBvcnQgY29uc3QgTUVTU0FHRV9TVEFUVVNfUkVDRUlWRUQgPSA1OyAvLyBSZWNlaXZlZCBieSB0aGUgY2xpZW50LlxuZXhwb3J0IGNvbnN0IE1FU1NBR0VfU1RBVFVTX1JFQUQgPSA2OyAvLyBSZWFkIGJ5IHRoZSB1c2VyLlxuZXhwb3J0IGNvbnN0IE1FU1NBR0VfU1RBVFVTX1RPX01FID0gNzsgLy8gVGhlIG1lc3NhZ2UgaXMgcmVjZWl2ZWQgZnJvbSBhbm90aGVyIHVzZXIuXG5cbi8vIFJlamVjdCB1bnJlc29sdmVkIGZ1dHVyZXMgYWZ0ZXIgdGhpcyBtYW55IG1pbGxpc2Vjb25kcy5cbmV4cG9ydCBjb25zdCBFWFBJUkVfUFJPTUlTRVNfVElNRU9VVCA9IDVfMDAwO1xuLy8gUGVyaW9kaWNpdHkgb2YgZ2FyYmFnZSBjb2xsZWN0aW9uIG9mIHVucmVzb2x2ZWQgZnV0dXJlcy5cbmV4cG9ydCBjb25zdCBFWFBJUkVfUFJPTUlTRVNfUEVSSU9EID0gMV8wMDA7XG5cbi8vIERlbGF5IGJlZm9yZSBhY2tub3dsZWRnaW5nIHRoYXQgYSBtZXNzYWdlIHdhcyByZWNpdmVkLlxuZXhwb3J0IGNvbnN0IFJFQ1ZfVElNRU9VVCA9IDEwMDtcblxuLy8gRGVmYXVsdCBudW1iZXIgb2YgbWVzc2FnZXMgdG8gcHVsbCBpbnRvIG1lbW9yeSBmcm9tIHBlcnNpc3RlbnQgY2FjaGUuXG5leHBvcnQgY29uc3QgREVGQVVMVF9NRVNTQUdFU19QQUdFID0gMjQ7XG5cbi8vIFVuaWNvZGUgREVMIGNoYXJhY3RlciBpbmRpY2F0aW5nIGRhdGEgd2FzIGRlbGV0ZWQuXG5leHBvcnQgY29uc3QgREVMX0NIQVIgPSAnXFx1MjQyMSc7XG4iLCIvKipcbiAqIEBmaWxlIEFic3RyYWN0aW9uIGxheWVyIGZvciB3ZWJzb2NrZXQgYW5kIGxvbmcgcG9sbGluZyBjb25uZWN0aW9ucy5cbiAqXG4gKiBAY29weXJpZ2h0IDIwMTUtMjAyMiBUaW5vZGUgTExDLlxuICovXG4ndXNlIHN0cmljdCc7XG5cbmltcG9ydCB7XG4gIGpzb25QYXJzZUhlbHBlclxufSBmcm9tICcuL3V0aWxzLmpzJztcblxubGV0IFdlYlNvY2tldFByb3ZpZGVyO1xubGV0IFhIUlByb3ZpZGVyO1xuXG4vLyBFcnJvciBjb2RlIHRvIHJldHVybiBpbiBjYXNlIG9mIGEgbmV0d29yayBwcm9ibGVtLlxuY29uc3QgTkVUV09SS19FUlJPUiA9IDUwMztcbmNvbnN0IE5FVFdPUktfRVJST1JfVEVYVCA9IFwiQ29ubmVjdGlvbiBmYWlsZWRcIjtcblxuLy8gRXJyb3IgY29kZSB0byByZXR1cm4gd2hlbiB1c2VyIGRpc2Nvbm5lY3RlZCBmcm9tIHNlcnZlci5cbmNvbnN0IE5FVFdPUktfVVNFUiA9IDQxODtcbmNvbnN0IE5FVFdPUktfVVNFUl9URVhUID0gXCJEaXNjb25uZWN0ZWQgYnkgY2xpZW50XCI7XG5cbi8vIFNldHRpbmdzIGZvciBleHBvbmVudGlhbCBiYWNrb2ZmXG5jb25zdCBfQk9GRl9CQVNFID0gMjAwMDsgLy8gMjAwMCBtaWxsaXNlY29uZHMsIG1pbmltdW0gZGVsYXkgYmV0d2VlbiByZWNvbm5lY3RzXG5jb25zdCBfQk9GRl9NQVhfSVRFUiA9IDEwOyAvLyBNYXhpbXVtIGRlbGF5IGJldHdlZW4gcmVjb25uZWN0cyAyXjEwICogMjAwMCB+IDM0IG1pbnV0ZXNcbmNvbnN0IF9CT0ZGX0pJVFRFUiA9IDAuMzsgLy8gQWRkIHJhbmRvbSBkZWxheVxuXG4vLyBIZWxwZXIgZnVuY3Rpb24gZm9yIGNyZWF0aW5nIGFuIGVuZHBvaW50IFVSTC5cbmZ1bmN0aW9uIG1ha2VCYXNlVXJsKGhvc3QsIHByb3RvY29sLCB2ZXJzaW9uLCBhcGlLZXkpIHtcbiAgbGV0IHVybCA9IG51bGw7XG5cbiAgaWYgKFsnaHR0cCcsICdodHRwcycsICd3cycsICd3c3MnXS5pbmNsdWRlcyhwcm90b2NvbCkpIHtcbiAgICB1cmwgPSBgJHtwcm90b2NvbH06Ly8ke2hvc3R9YDtcbiAgICBpZiAodXJsLmNoYXJBdCh1cmwubGVuZ3RoIC0gMSkgIT09ICcvJykge1xuICAgICAgdXJsICs9ICcvJztcbiAgICB9XG4gICAgdXJsICs9ICd2JyArIHZlcnNpb24gKyAnL2NoYW5uZWxzJztcbiAgICBpZiAoWydodHRwJywgJ2h0dHBzJ10uaW5jbHVkZXMocHJvdG9jb2wpKSB7XG4gICAgICAvLyBMb25nIHBvbGxpbmcgZW5kcG9pbnQgZW5kcyB3aXRoIFwibHBcIiwgaS5lLlxuICAgICAgLy8gJy92MC9jaGFubmVscy9scCcgdnMganVzdCAnL3YwL2NoYW5uZWxzJyBmb3Igd3NcbiAgICAgIHVybCArPSAnL2xwJztcbiAgICB9XG4gICAgdXJsICs9ICc/YXBpa2V5PScgKyBhcGlLZXk7XG4gIH1cbiAgcmV0dXJuIHVybDtcbn1cblxuLyoqXG4gKiBBbiBhYnN0cmFjdGlvbiBmb3IgYSB3ZWJzb2NrZXQgb3IgYSBsb25nIHBvbGxpbmcgY29ubmVjdGlvbi5cbiAqXG4gKiBAY2xhc3MgQ29ubmVjdGlvblxuICogQG1lbWJlcm9mIFRpbm9kZVxuXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnIC0gY29uZmlndXJhdGlvbiBwYXJhbWV0ZXJzLlxuICogQHBhcmFtIHtzdHJpbmd9IGNvbmZpZy5ob3N0IC0gSG9zdCBuYW1lIGFuZCBvcHRpb25hbCBwb3J0IG51bWJlciB0byBjb25uZWN0IHRvLlxuICogQHBhcmFtIHtzdHJpbmd9IGNvbmZpZy5hcGlLZXkgLSBBUEkga2V5IGdlbmVyYXRlZCBieSA8Y29kZT5rZXlnZW48L2NvZGU+LlxuICogQHBhcmFtIHtzdHJpbmd9IGNvbmZpZy50cmFuc3BvcnQgLSBOZXR3b3JrIHRyYW5zcG9ydCB0byB1c2UsIGVpdGhlciA8Y29kZT5cIndzXCI8Y29kZT4vPGNvZGU+XCJ3c3NcIjwvY29kZT4gZm9yIHdlYnNvY2tldCBvclxuICogICAgICA8Y29kZT5scDwvY29kZT4gZm9yIGxvbmcgcG9sbGluZy5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gY29uZmlnLnNlY3VyZSAtIFVzZSBTZWN1cmUgV2ViU29ja2V0IGlmIDxjb2RlPnRydWU8L2NvZGU+LlxuICogQHBhcmFtIHtzdHJpbmd9IHZlcnNpb25fIC0gTWFqb3IgdmFsdWUgb2YgdGhlIHByb3RvY29sIHZlcnNpb24sIGUuZy4gJzAnIGluICcwLjE3LjEnLlxuICogQHBhcmFtIHtib29sZWFufSBhdXRvcmVjb25uZWN0XyAtIElmIGNvbm5lY3Rpb24gaXMgbG9zdCwgdHJ5IHRvIHJlY29ubmVjdCBhdXRvbWF0aWNhbGx5LlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb25uZWN0aW9uIHtcbiAgLy8gTG9nZ2VyLCBkb2VzIG5vdGhpbmcgYnkgZGVmYXVsdC5cbiAgc3RhdGljICNsb2cgPSBfID0+IHt9O1xuXG4gICNib2ZmVGltZXIgPSBudWxsO1xuICAjYm9mZkl0ZXJhdGlvbiA9IDA7XG4gICNib2ZmQ2xvc2VkID0gZmFsc2U7IC8vIEluZGljYXRvciBpZiB0aGUgc29ja2V0IHdhcyBtYW51YWxseSBjbG9zZWQgLSBkb24ndCBhdXRvcmVjb25uZWN0IGlmIHRydWUuXG5cbiAgLy8gV2Vic29ja2V0LlxuICAjc29ja2V0ID0gbnVsbDtcblxuICBob3N0O1xuICBzZWN1cmU7XG4gIGFwaUtleTtcblxuICB2ZXJzaW9uO1xuICBhdXRvcmVjb25uZWN0O1xuXG4gIGluaXRpYWxpemVkO1xuXG4gIC8vIChjb25maWcuaG9zdCwgY29uZmlnLmFwaUtleSwgY29uZmlnLnRyYW5zcG9ydCwgY29uZmlnLnNlY3VyZSksIFBST1RPQ09MX1ZFUlNJT04sIHRydWVcbiAgY29uc3RydWN0b3IoY29uZmlnLCB2ZXJzaW9uXywgYXV0b3JlY29ubmVjdF8pIHtcbiAgICB0aGlzLmhvc3QgPSBjb25maWcuaG9zdDtcbiAgICB0aGlzLnNlY3VyZSA9IGNvbmZpZy5zZWN1cmU7XG4gICAgdGhpcy5hcGlLZXkgPSBjb25maWcuYXBpS2V5O1xuXG4gICAgdGhpcy52ZXJzaW9uID0gdmVyc2lvbl87XG4gICAgdGhpcy5hdXRvcmVjb25uZWN0ID0gYXV0b3JlY29ubmVjdF87XG5cbiAgICBpZiAoY29uZmlnLnRyYW5zcG9ydCA9PT0gJ2xwJykge1xuICAgICAgLy8gZXhwbGljaXQgcmVxdWVzdCB0byB1c2UgbG9uZyBwb2xsaW5nXG4gICAgICB0aGlzLiNpbml0X2xwKCk7XG4gICAgICB0aGlzLmluaXRpYWxpemVkID0gJ2xwJztcbiAgICB9IGVsc2UgaWYgKGNvbmZpZy50cmFuc3BvcnQgPT09ICd3cycpIHtcbiAgICAgIC8vIGV4cGxpY2l0IHJlcXVlc3QgdG8gdXNlIHdlYiBzb2NrZXRcbiAgICAgIC8vIGlmIHdlYnNvY2tldHMgYXJlIG5vdCBhdmFpbGFibGUsIGhvcnJpYmxlIHRoaW5ncyB3aWxsIGhhcHBlblxuICAgICAgdGhpcy4jaW5pdF93cygpO1xuICAgICAgdGhpcy5pbml0aWFsaXplZCA9ICd3cyc7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmluaXRpYWxpemVkKSB7XG4gICAgICAvLyBJbnZhbGlkIG9yIHVuZGVmaW5lZCBuZXR3b3JrIHRyYW5zcG9ydC5cbiAgICAgIENvbm5lY3Rpb24uI2xvZyhcIlVua25vd24gb3IgaW52YWxpZCBuZXR3b3JrIHRyYW5zcG9ydC4gUnVubmluZyB1bmRlciBOb2RlPyBDYWxsICdUaW5vZGUuc2V0TmV0d29ya1Byb3ZpZGVycygpJy5cIik7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duIG9yIGludmFsaWQgbmV0d29yayB0cmFuc3BvcnQuIFJ1bm5pbmcgdW5kZXIgTm9kZT8gQ2FsbCAnVGlub2RlLnNldE5ldHdvcmtQcm92aWRlcnMoKScuXCIpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUbyB1c2UgQ29ubmVjdGlvbiBpbiBhIG5vbiBicm93c2VyIGNvbnRleHQsIHN1cHBseSBXZWJTb2NrZXQgYW5kIFhNTEh0dHBSZXF1ZXN0IHByb3ZpZGVycy5cbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyb2YgQ29ubmVjdGlvblxuICAgKiBAcGFyYW0gd3NQcm92aWRlciBXZWJTb2NrZXQgcHJvdmlkZXIsIGUuZy4gZm9yIG5vZGVKUyAsIDxjb2RlPnJlcXVpcmUoJ3dzJyk8L2NvZGU+LlxuICAgKiBAcGFyYW0geGhyUHJvdmlkZXIgWE1MSHR0cFJlcXVlc3QgcHJvdmlkZXIsIGUuZy4gZm9yIG5vZGUgPGNvZGU+cmVxdWlyZSgneGhyJyk8L2NvZGU+LlxuICAgKi9cbiAgc3RhdGljIHNldE5ldHdvcmtQcm92aWRlcnMod3NQcm92aWRlciwgeGhyUHJvdmlkZXIpIHtcbiAgICBXZWJTb2NrZXRQcm92aWRlciA9IHdzUHJvdmlkZXI7XG4gICAgWEhSUHJvdmlkZXIgPSB4aHJQcm92aWRlcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBBc3NpZ24gYSBub24tZGVmYXVsdCBsb2dnZXIuXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlcm9mIENvbm5lY3Rpb25cbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gbCB2YXJpYWRpYyBsb2dnaW5nIGZ1bmN0aW9uLlxuICAgKi9cbiAgc3RhdGljIHNldCBsb2dnZXIobCkge1xuICAgIENvbm5lY3Rpb24uI2xvZyA9IGw7XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhdGUgYSBuZXcgY29ubmVjdGlvblxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNvbm5lY3Rpb24jXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBob3N0XyBIb3N0IG5hbWUgdG8gY29ubmVjdCB0bzsgaWYgPGNvZGU+bnVsbDwvY29kZT4gdGhlIG9sZCBob3N0IG5hbWUgd2lsbCBiZSB1c2VkLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGZvcmNlIEZvcmNlIG5ldyBjb25uZWN0aW9uIGV2ZW4gaWYgb25lIGFscmVhZHkgZXhpc3RzLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBQcm9taXNlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIGNvbm5lY3Rpb24gY2FsbCBjb21wbGV0ZXMsIHJlc29sdXRpb24gaXMgY2FsbGVkIHdpdGhvdXRcbiAgICogIHBhcmFtZXRlcnMsIHJlamVjdGlvbiBwYXNzZXMgdGhlIHtFcnJvcn0gYXMgcGFyYW1ldGVyLlxuICAgKi9cbiAgY29ubmVjdChob3N0XywgZm9yY2UpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobnVsbCk7XG4gIH1cblxuICAvKipcbiAgICogVHJ5IHRvIHJlc3RvcmUgYSBuZXR3b3JrIGNvbm5lY3Rpb24sIGFsc28gcmVzZXQgYmFja29mZi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Db25uZWN0aW9uI1xuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGZvcmNlIC0gcmVjb25uZWN0IGV2ZW4gaWYgdGhlcmUgaXMgYSBsaXZlIGNvbm5lY3Rpb24gYWxyZWFkeS5cbiAgICovXG4gIHJlY29ubmVjdChmb3JjZSkge31cblxuICAvKipcbiAgICogVGVybWluYXRlIHRoZSBuZXR3b3JrIGNvbm5lY3Rpb25cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Db25uZWN0aW9uI1xuICAgKi9cbiAgZGlzY29ubmVjdCgpIHt9XG5cbiAgLyoqXG4gICAqIFNlbmQgYSBzdHJpbmcgdG8gdGhlIHNlcnZlci5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Db25uZWN0aW9uI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbXNnIC0gU3RyaW5nIHRvIHNlbmQuXG4gICAqIEB0aHJvd3MgVGhyb3dzIGFuIGV4Y2VwdGlvbiBpZiB0aGUgdW5kZXJseWluZyBjb25uZWN0aW9uIGlzIG5vdCBsaXZlLlxuICAgKi9cbiAgc2VuZFRleHQobXNnKSB7fVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBjb25uZWN0aW9uIGlzIGFsaXZlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNvbm5lY3Rpb24jXG4gICAqIEByZXR1cm5zIHtib29sZWFufSA8Y29kZT50cnVlPC9jb2RlPiBpZiBjb25uZWN0aW9uIGlzIGxpdmUsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBpc0Nvbm5lY3RlZCgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBuYW1lIG9mIHRoZSBjdXJyZW50IG5ldHdvcmsgdHJhbnNwb3J0LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNvbm5lY3Rpb24jXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IG5hbWUgb2YgdGhlIHRyYW5zcG9ydCBzdWNoIGFzIDxjb2RlPlwid3NcIjwvY29kZT4gb3IgPGNvZGU+XCJscFwiPC9jb2RlPi5cbiAgICovXG4gIHRyYW5zcG9ydCgpIHtcbiAgICByZXR1cm4gdGhpcy5pbml0aWFsaXplZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kIG5ldHdvcmsgcHJvYmUgdG8gY2hlY2sgaWYgY29ubmVjdGlvbiBpcyBpbmRlZWQgbGl2ZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Db25uZWN0aW9uI1xuICAgKi9cbiAgcHJvYmUoKSB7XG4gICAgdGhpcy5zZW5kVGV4dCgnMScpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0IGF1dG9yZWNvbm5lY3QgY291bnRlciB0byB6ZXJvLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNvbm5lY3Rpb24jXG4gICAqL1xuICBiYWNrb2ZmUmVzZXQoKSB7XG4gICAgdGhpcy4jYm9mZlJlc2V0KCk7XG4gIH1cblxuICAvLyBCYWNrb2ZmIGltcGxlbWVudGF0aW9uIC0gcmVjb25uZWN0IGFmdGVyIGEgdGltZW91dC5cbiAgI2JvZmZSZWNvbm5lY3QoKSB7XG4gICAgLy8gQ2xlYXIgdGltZXJcbiAgICBjbGVhclRpbWVvdXQodGhpcy4jYm9mZlRpbWVyKTtcbiAgICAvLyBDYWxjdWxhdGUgd2hlbiB0byBmaXJlIHRoZSByZWNvbm5lY3QgYXR0ZW1wdFxuICAgIGNvbnN0IHRpbWVvdXQgPSBfQk9GRl9CQVNFICogKE1hdGgucG93KDIsIHRoaXMuI2JvZmZJdGVyYXRpb24pICogKDEuMCArIF9CT0ZGX0pJVFRFUiAqIE1hdGgucmFuZG9tKCkpKTtcbiAgICAvLyBVcGRhdGUgaXRlcmF0aW9uIGNvdW50ZXIgZm9yIGZ1dHVyZSB1c2VcbiAgICB0aGlzLiNib2ZmSXRlcmF0aW9uID0gKHRoaXMuI2JvZmZJdGVyYXRpb24gPj0gX0JPRkZfTUFYX0lURVIgPyB0aGlzLiNib2ZmSXRlcmF0aW9uIDogdGhpcy4jYm9mZkl0ZXJhdGlvbiArIDEpO1xuICAgIGlmICh0aGlzLm9uQXV0b3JlY29ubmVjdEl0ZXJhdGlvbikge1xuICAgICAgdGhpcy5vbkF1dG9yZWNvbm5lY3RJdGVyYXRpb24odGltZW91dCk7XG4gICAgfVxuXG4gICAgdGhpcy4jYm9mZlRpbWVyID0gc2V0VGltZW91dChfID0+IHtcbiAgICAgIENvbm5lY3Rpb24uI2xvZyhgUmVjb25uZWN0aW5nLCBpdGVyPSR7dGhpcy4jYm9mZkl0ZXJhdGlvbn0sIHRpbWVvdXQ9JHt0aW1lb3V0fWApO1xuICAgICAgLy8gTWF5YmUgdGhlIHNvY2tldCB3YXMgY2xvc2VkIHdoaWxlIHdlIHdhaXRlZCBmb3IgdGhlIHRpbWVyP1xuICAgICAgaWYgKCF0aGlzLiNib2ZmQ2xvc2VkKSB7XG4gICAgICAgIGNvbnN0IHByb20gPSB0aGlzLmNvbm5lY3QoKTtcbiAgICAgICAgaWYgKHRoaXMub25BdXRvcmVjb25uZWN0SXRlcmF0aW9uKSB7XG4gICAgICAgICAgdGhpcy5vbkF1dG9yZWNvbm5lY3RJdGVyYXRpb24oMCwgcHJvbSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gU3VwcHJlc3MgZXJyb3IgaWYgaXQncyBub3QgdXNlZC5cbiAgICAgICAgICBwcm9tLmNhdGNoKF8gPT4ge1xuICAgICAgICAgICAgLyogZG8gbm90aGluZyAqL1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHRoaXMub25BdXRvcmVjb25uZWN0SXRlcmF0aW9uKSB7XG4gICAgICAgIHRoaXMub25BdXRvcmVjb25uZWN0SXRlcmF0aW9uKC0xKTtcbiAgICAgIH1cbiAgICB9LCB0aW1lb3V0KTtcbiAgfVxuXG4gIC8vIFRlcm1pbmF0ZSBhdXRvLXJlY29ubmVjdCBwcm9jZXNzLlxuICAjYm9mZlN0b3AoKSB7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuI2JvZmZUaW1lcik7XG4gICAgdGhpcy4jYm9mZlRpbWVyID0gbnVsbDtcbiAgfVxuXG4gIC8vIFJlc2V0IGF1dG8tcmVjb25uZWN0IGl0ZXJhdGlvbiBjb3VudGVyLlxuICAjYm9mZlJlc2V0KCkge1xuICAgIHRoaXMuI2JvZmZJdGVyYXRpb24gPSAwO1xuICB9XG5cbiAgLy8gSW5pdGlhbGl6YXRpb24gZm9yIGxvbmcgcG9sbGluZy5cbiAgI2luaXRfbHAoKSB7XG4gICAgY29uc3QgWERSX1VOU0VOVCA9IDA7IC8vIENsaWVudCBoYXMgYmVlbiBjcmVhdGVkLiBvcGVuKCkgbm90IGNhbGxlZCB5ZXQuXG4gICAgY29uc3QgWERSX09QRU5FRCA9IDE7IC8vIG9wZW4oKSBoYXMgYmVlbiBjYWxsZWQuXG4gICAgY29uc3QgWERSX0hFQURFUlNfUkVDRUlWRUQgPSAyOyAvLyBzZW5kKCkgaGFzIGJlZW4gY2FsbGVkLCBhbmQgaGVhZGVycyBhbmQgc3RhdHVzIGFyZSBhdmFpbGFibGUuXG4gICAgY29uc3QgWERSX0xPQURJTkcgPSAzOyAvLyBEb3dubG9hZGluZzsgcmVzcG9uc2VUZXh0IGhvbGRzIHBhcnRpYWwgZGF0YS5cbiAgICBjb25zdCBYRFJfRE9ORSA9IDQ7IC8vIFRoZSBvcGVyYXRpb24gaXMgY29tcGxldGUuXG5cbiAgICAvLyBGdWxseSBjb21wb3NlZCBlbmRwb2ludCBVUkwsIHdpdGggQVBJIGtleSAmIFNJRFxuICAgIGxldCBfbHBVUkwgPSBudWxsO1xuXG4gICAgbGV0IF9wb2xsZXIgPSBudWxsO1xuICAgIGxldCBfc2VuZGVyID0gbnVsbDtcblxuICAgIGxldCBscF9zZW5kZXIgPSAodXJsXykgPT4ge1xuICAgICAgY29uc3Qgc2VuZGVyID0gbmV3IFhIUlByb3ZpZGVyKCk7XG4gICAgICBzZW5kZXIub25yZWFkeXN0YXRlY2hhbmdlID0gKGV2dCkgPT4ge1xuICAgICAgICBpZiAoc2VuZGVyLnJlYWR5U3RhdGUgPT0gWERSX0RPTkUgJiYgc2VuZGVyLnN0YXR1cyA+PSA0MDApIHtcbiAgICAgICAgICAvLyBTb21lIHNvcnQgb2YgZXJyb3IgcmVzcG9uc2VcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYExQIHNlbmRlciBmYWlsZWQsICR7c2VuZGVyLnN0YXR1c31gKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgc2VuZGVyLm9wZW4oJ1BPU1QnLCB1cmxfLCB0cnVlKTtcbiAgICAgIHJldHVybiBzZW5kZXI7XG4gICAgfVxuXG4gICAgbGV0IGxwX3BvbGxlciA9ICh1cmxfLCByZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGxldCBwb2xsZXIgPSBuZXcgWEhSUHJvdmlkZXIoKTtcbiAgICAgIGxldCBwcm9taXNlQ29tcGxldGVkID0gZmFsc2U7XG5cbiAgICAgIHBvbGxlci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoZXZ0KSA9PiB7XG4gICAgICAgIGlmIChwb2xsZXIucmVhZHlTdGF0ZSA9PSBYRFJfRE9ORSkge1xuICAgICAgICAgIGlmIChwb2xsZXIuc3RhdHVzID09IDIwMSkgeyAvLyAyMDEgPT0gSFRUUC5DcmVhdGVkLCBnZXQgU0lEXG4gICAgICAgICAgICBsZXQgcGt0ID0gSlNPTi5wYXJzZShwb2xsZXIucmVzcG9uc2VUZXh0LCBqc29uUGFyc2VIZWxwZXIpO1xuICAgICAgICAgICAgX2xwVVJMID0gdXJsXyArICcmc2lkPScgKyBwa3QuY3RybC5wYXJhbXMuc2lkO1xuICAgICAgICAgICAgcG9sbGVyID0gbHBfcG9sbGVyKF9scFVSTCk7XG4gICAgICAgICAgICBwb2xsZXIuc2VuZChudWxsKTtcbiAgICAgICAgICAgIGlmICh0aGlzLm9uT3Blbikge1xuICAgICAgICAgICAgICB0aGlzLm9uT3BlbigpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocmVzb2x2ZSkge1xuICAgICAgICAgICAgICBwcm9taXNlQ29tcGxldGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5hdXRvcmVjb25uZWN0KSB7XG4gICAgICAgICAgICAgIHRoaXMuI2JvZmZTdG9wKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChwb2xsZXIuc3RhdHVzIDwgNDAwKSB7IC8vIDQwMCA9IEhUVFAuQmFkUmVxdWVzdFxuICAgICAgICAgICAgaWYgKHRoaXMub25NZXNzYWdlKSB7XG4gICAgICAgICAgICAgIHRoaXMub25NZXNzYWdlKHBvbGxlci5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcG9sbGVyID0gbHBfcG9sbGVyKF9scFVSTCk7XG4gICAgICAgICAgICBwb2xsZXIuc2VuZChudWxsKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gRG9uJ3QgdGhyb3cgYW4gZXJyb3IgaGVyZSwgZ3JhY2VmdWxseSBoYW5kbGUgc2VydmVyIGVycm9yc1xuICAgICAgICAgICAgaWYgKHJlamVjdCAmJiAhcHJvbWlzZUNvbXBsZXRlZCkge1xuICAgICAgICAgICAgICBwcm9taXNlQ29tcGxldGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgcmVqZWN0KHBvbGxlci5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMub25NZXNzYWdlICYmIHBvbGxlci5yZXNwb25zZVRleHQpIHtcbiAgICAgICAgICAgICAgdGhpcy5vbk1lc3NhZ2UocG9sbGVyLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5vbkRpc2Nvbm5lY3QpIHtcbiAgICAgICAgICAgICAgY29uc3QgY29kZSA9IHBvbGxlci5zdGF0dXMgfHwgKHRoaXMuI2JvZmZDbG9zZWQgPyBORVRXT1JLX1VTRVIgOiBORVRXT1JLX0VSUk9SKTtcbiAgICAgICAgICAgICAgY29uc3QgdGV4dCA9IHBvbGxlci5yZXNwb25zZVRleHQgfHwgKHRoaXMuI2JvZmZDbG9zZWQgPyBORVRXT1JLX1VTRVJfVEVYVCA6IE5FVFdPUktfRVJST1JfVEVYVCk7XG4gICAgICAgICAgICAgIHRoaXMub25EaXNjb25uZWN0KG5ldyBFcnJvcih0ZXh0ICsgJyAoJyArIGNvZGUgKyAnKScpLCBjb2RlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gUG9sbGluZyBoYXMgc3RvcHBlZC4gSW5kaWNhdGUgaXQgYnkgc2V0dGluZyBwb2xsZXIgdG8gbnVsbC5cbiAgICAgICAgICAgIHBvbGxlciA9IG51bGw7XG4gICAgICAgICAgICBpZiAoIXRoaXMuI2JvZmZDbG9zZWQgJiYgdGhpcy5hdXRvcmVjb25uZWN0KSB7XG4gICAgICAgICAgICAgIHRoaXMuI2JvZmZSZWNvbm5lY3QoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICAvLyBVc2luZyBQT1NUIHRvIGF2b2lkIGNhY2hpbmcgcmVzcG9uc2UgYnkgc2VydmljZSB3b3JrZXIuXG4gICAgICBwb2xsZXIub3BlbignUE9TVCcsIHVybF8sIHRydWUpO1xuICAgICAgcmV0dXJuIHBvbGxlcjtcbiAgICB9XG5cbiAgICB0aGlzLmNvbm5lY3QgPSAoaG9zdF8sIGZvcmNlKSA9PiB7XG4gICAgICB0aGlzLiNib2ZmQ2xvc2VkID0gZmFsc2U7XG5cbiAgICAgIGlmIChfcG9sbGVyKSB7XG4gICAgICAgIGlmICghZm9yY2UpIHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgICAgICAgX3BvbGxlci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSB1bmRlZmluZWQ7XG4gICAgICAgIF9wb2xsZXIuYWJvcnQoKTtcbiAgICAgICAgX3BvbGxlciA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIGlmIChob3N0Xykge1xuICAgICAgICB0aGlzLmhvc3QgPSBob3N0XztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgY29uc3QgdXJsID0gbWFrZUJhc2VVcmwodGhpcy5ob3N0LCB0aGlzLnNlY3VyZSA/ICdodHRwcycgOiAnaHR0cCcsIHRoaXMudmVyc2lvbiwgdGhpcy5hcGlLZXkpO1xuICAgICAgICBDb25uZWN0aW9uLiNsb2coXCJMUCBjb25uZWN0aW5nIHRvOlwiLCB1cmwpO1xuICAgICAgICBfcG9sbGVyID0gbHBfcG9sbGVyKHVybCwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgX3BvbGxlci5zZW5kKG51bGwpO1xuICAgICAgfSkuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgQ29ubmVjdGlvbi4jbG9nKFwiTFAgY29ubmVjdGlvbiBmYWlsZWQ6XCIsIGVycik7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgdGhpcy5yZWNvbm5lY3QgPSBmb3JjZSA9PiB7XG4gICAgICB0aGlzLiNib2ZmU3RvcCgpO1xuICAgICAgdGhpcy5jb25uZWN0KG51bGwsIGZvcmNlKTtcbiAgICB9O1xuXG4gICAgdGhpcy5kaXNjb25uZWN0ID0gXyA9PiB7XG4gICAgICB0aGlzLiNib2ZmQ2xvc2VkID0gdHJ1ZTtcbiAgICAgIHRoaXMuI2JvZmZTdG9wKCk7XG5cbiAgICAgIGlmIChfc2VuZGVyKSB7XG4gICAgICAgIF9zZW5kZXIub25yZWFkeXN0YXRlY2hhbmdlID0gdW5kZWZpbmVkO1xuICAgICAgICBfc2VuZGVyLmFib3J0KCk7XG4gICAgICAgIF9zZW5kZXIgPSBudWxsO1xuICAgICAgfVxuICAgICAgaWYgKF9wb2xsZXIpIHtcbiAgICAgICAgX3BvbGxlci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSB1bmRlZmluZWQ7XG4gICAgICAgIF9wb2xsZXIuYWJvcnQoKTtcbiAgICAgICAgX3BvbGxlciA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLm9uRGlzY29ubmVjdCkge1xuICAgICAgICB0aGlzLm9uRGlzY29ubmVjdChuZXcgRXJyb3IoTkVUV09SS19VU0VSX1RFWFQgKyAnICgnICsgTkVUV09SS19VU0VSICsgJyknKSwgTkVUV09SS19VU0VSKTtcbiAgICAgIH1cbiAgICAgIC8vIEVuc3VyZSBpdCdzIHJlY29uc3RydWN0ZWRcbiAgICAgIF9scFVSTCA9IG51bGw7XG4gICAgfTtcblxuICAgIHRoaXMuc2VuZFRleHQgPSAobXNnKSA9PiB7XG4gICAgICBfc2VuZGVyID0gbHBfc2VuZGVyKF9scFVSTCk7XG4gICAgICBpZiAoX3NlbmRlciAmJiAoX3NlbmRlci5yZWFkeVN0YXRlID09IFhEUl9PUEVORUQpKSB7IC8vIDEgPT0gT1BFTkVEXG4gICAgICAgIF9zZW5kZXIuc2VuZChtc2cpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTG9uZyBwb2xsZXIgZmFpbGVkIHRvIGNvbm5lY3RcIik7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRoaXMuaXNDb25uZWN0ZWQgPSBfID0+IHtcbiAgICAgIHJldHVybiAoX3BvbGxlciAmJiB0cnVlKTtcbiAgICB9O1xuICB9XG5cbiAgLy8gSW5pdGlhbGl6YXRpb24gZm9yIFdlYnNvY2tldFxuICAjaW5pdF93cygpIHtcbiAgICB0aGlzLmNvbm5lY3QgPSAoaG9zdF8sIGZvcmNlKSA9PiB7XG4gICAgICB0aGlzLiNib2ZmQ2xvc2VkID0gZmFsc2U7XG5cbiAgICAgIGlmICh0aGlzLiNzb2NrZXQpIHtcbiAgICAgICAgaWYgKCFmb3JjZSAmJiB0aGlzLiNzb2NrZXQucmVhZHlTdGF0ZSA9PSB0aGlzLiNzb2NrZXQuT1BFTikge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLiNzb2NrZXQuY2xvc2UoKTtcbiAgICAgICAgdGhpcy4jc29ja2V0ID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgaWYgKGhvc3RfKSB7XG4gICAgICAgIHRoaXMuaG9zdCA9IGhvc3RfO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBjb25zdCB1cmwgPSBtYWtlQmFzZVVybCh0aGlzLmhvc3QsIHRoaXMuc2VjdXJlID8gJ3dzcycgOiAnd3MnLCB0aGlzLnZlcnNpb24sIHRoaXMuYXBpS2V5KTtcblxuICAgICAgICBDb25uZWN0aW9uLiNsb2coXCJXUyBjb25uZWN0aW5nIHRvOiBcIiwgdXJsKTtcblxuICAgICAgICAvLyBJdCB0aHJvd3Mgd2hlbiB0aGUgc2VydmVyIGlzIG5vdCBhY2Nlc3NpYmxlIGJ1dCB0aGUgZXhjZXB0aW9uIGNhbm5vdCBiZSBjYXVnaHQ6XG4gICAgICAgIC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzMxMDAyNTkyL2phdmFzY3JpcHQtZG9lc250LWNhdGNoLWVycm9yLWluLXdlYnNvY2tldC1pbnN0YW50aWF0aW9uLzMxMDAzMDU3XG4gICAgICAgIGNvbnN0IGNvbm4gPSBuZXcgV2ViU29ja2V0UHJvdmlkZXIodXJsKTtcblxuICAgICAgICBjb25uLm9uZXJyb3IgPSBlcnIgPT4ge1xuICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbm4ub25vcGVuID0gXyA9PiB7XG4gICAgICAgICAgaWYgKHRoaXMuYXV0b3JlY29ubmVjdCkge1xuICAgICAgICAgICAgdGhpcy4jYm9mZlN0b3AoKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodGhpcy5vbk9wZW4pIHtcbiAgICAgICAgICAgIHRoaXMub25PcGVuKCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbm4ub25jbG9zZSA9IF8gPT4ge1xuICAgICAgICAgIHRoaXMuI3NvY2tldCA9IG51bGw7XG5cbiAgICAgICAgICBpZiAodGhpcy5vbkRpc2Nvbm5lY3QpIHtcbiAgICAgICAgICAgIGNvbnN0IGNvZGUgPSB0aGlzLiNib2ZmQ2xvc2VkID8gTkVUV09SS19VU0VSIDogTkVUV09SS19FUlJPUjtcbiAgICAgICAgICAgIHRoaXMub25EaXNjb25uZWN0KG5ldyBFcnJvcih0aGlzLiNib2ZmQ2xvc2VkID8gTkVUV09SS19VU0VSX1RFWFQgOiBORVRXT1JLX0VSUk9SX1RFWFQgK1xuICAgICAgICAgICAgICAnICgnICsgY29kZSArICcpJyksIGNvZGUpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICghdGhpcy4jYm9mZkNsb3NlZCAmJiB0aGlzLmF1dG9yZWNvbm5lY3QpIHtcbiAgICAgICAgICAgIHRoaXMuI2JvZmZSZWNvbm5lY3QoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgY29ubi5vbm1lc3NhZ2UgPSBldnQgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLm9uTWVzc2FnZSkge1xuICAgICAgICAgICAgdGhpcy5vbk1lc3NhZ2UoZXZ0LmRhdGEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLiNzb2NrZXQgPSBjb25uO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5yZWNvbm5lY3QgPSBmb3JjZSA9PiB7XG4gICAgICB0aGlzLiNib2ZmU3RvcCgpO1xuICAgICAgdGhpcy5jb25uZWN0KG51bGwsIGZvcmNlKTtcbiAgICB9O1xuXG4gICAgdGhpcy5kaXNjb25uZWN0ID0gXyA9PiB7XG4gICAgICB0aGlzLiNib2ZmQ2xvc2VkID0gdHJ1ZTtcbiAgICAgIHRoaXMuI2JvZmZTdG9wKCk7XG5cbiAgICAgIGlmICghdGhpcy4jc29ja2V0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHRoaXMuI3NvY2tldC5jbG9zZSgpO1xuICAgICAgdGhpcy4jc29ja2V0ID0gbnVsbDtcbiAgICB9O1xuXG4gICAgdGhpcy5zZW5kVGV4dCA9IG1zZyA9PiB7XG4gICAgICBpZiAodGhpcy4jc29ja2V0ICYmICh0aGlzLiNzb2NrZXQucmVhZHlTdGF0ZSA9PSB0aGlzLiNzb2NrZXQuT1BFTikpIHtcbiAgICAgICAgdGhpcy4jc29ja2V0LnNlbmQobXNnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIldlYnNvY2tldCBpcyBub3QgY29ubmVjdGVkXCIpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLmlzQ29ubmVjdGVkID0gXyA9PiB7XG4gICAgICByZXR1cm4gKHRoaXMuI3NvY2tldCAmJiAodGhpcy4jc29ja2V0LnJlYWR5U3RhdGUgPT0gdGhpcy4jc29ja2V0Lk9QRU4pKTtcbiAgICB9O1xuICB9XG5cbiAgLy8gQ2FsbGJhY2tzOlxuXG4gIC8qKlxuICAgKiBBIGNhbGxiYWNrIHRvIHBhc3MgaW5jb21pbmcgbWVzc2FnZXMgdG8uIFNlZSB7QGxpbmsgVGlub2RlLkNvbm5lY3Rpb24jb25NZXNzYWdlfS5cbiAgICogQGNhbGxiYWNrIFRpbm9kZS5Db25uZWN0aW9uLk9uTWVzc2FnZVxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNvbm5lY3Rpb25cbiAgICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2UgLSBNZXNzYWdlIHRvIHByb2Nlc3MuXG4gICAqL1xuICBvbk1lc3NhZ2UgPSB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIEEgY2FsbGJhY2sgZm9yIHJlcG9ydGluZyBhIGRyb3BwZWQgY29ubmVjdGlvbi5cbiAgICogQHR5cGUge2Z1bmN0aW9ufVxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNvbm5lY3Rpb24jXG4gICAqL1xuICBvbkRpc2Nvbm5lY3QgPSB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIEEgY2FsbGJhY2sgY2FsbGVkIHdoZW4gdGhlIGNvbm5lY3Rpb24gaXMgcmVhZHkgdG8gYmUgdXNlZCBmb3Igc2VuZGluZy4gRm9yIHdlYnNvY2tldHMgaXQncyBzb2NrZXQgb3BlbixcbiAgICogZm9yIGxvbmcgcG9sbGluZyBpdCdzIDxjb2RlPnJlYWR5U3RhdGU9MTwvY29kZT4gKE9QRU5FRClcbiAgICogQHR5cGUge2Z1bmN0aW9ufVxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNvbm5lY3Rpb24jXG4gICAqL1xuICBvbk9wZW4gPSB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIEEgY2FsbGJhY2sgdG8gbm90aWZ5IG9mIHJlY29ubmVjdGlvbiBhdHRlbXB0cy4gU2VlIHtAbGluayBUaW5vZGUuQ29ubmVjdGlvbiNvbkF1dG9yZWNvbm5lY3RJdGVyYXRpb259LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNvbm5lY3Rpb25cbiAgICogQGNhbGxiYWNrIEF1dG9yZWNvbm5lY3RJdGVyYXRpb25UeXBlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0aW1lb3V0IC0gdGltZSB0aWxsIHRoZSBuZXh0IHJlY29ubmVjdCBhdHRlbXB0IGluIG1pbGxpc2Vjb25kcy4gPGNvZGU+LTE8L2NvZGU+IG1lYW5zIHJlY29ubmVjdCB3YXMgc2tpcHBlZC5cbiAgICogQHBhcmFtIHtQcm9taXNlfSBwcm9taXNlIHJlc29sdmVkIG9yIHJlamVjdGVkIHdoZW4gdGhlIHJlY29ubmVjdCBhdHRlbXAgY29tcGxldGVzLlxuICAgKlxuICAgKi9cbiAgLyoqXG4gICAqIEEgY2FsbGJhY2sgdG8gaW5mb3JtIHdoZW4gdGhlIG5leHQgYXR0YW1wdCB0byByZWNvbm5lY3Qgd2lsbCBoYXBwZW4gYW5kIHRvIHJlY2VpdmUgY29ubmVjdGlvbiBwcm9taXNlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNvbm5lY3Rpb24jXG4gICAqIEB0eXBlIHtUaW5vZGUuQ29ubmVjdGlvbi5BdXRvcmVjb25uZWN0SXRlcmF0aW9uVHlwZX1cbiAgICovXG4gIG9uQXV0b3JlY29ubmVjdEl0ZXJhdGlvbiA9IHVuZGVmaW5lZDtcbn1cblxuQ29ubmVjdGlvbi5ORVRXT1JLX0VSUk9SID0gTkVUV09SS19FUlJPUjtcbkNvbm5lY3Rpb24uTkVUV09SS19FUlJPUl9URVhUID0gTkVUV09SS19FUlJPUl9URVhUO1xuQ29ubmVjdGlvbi5ORVRXT1JLX1VTRVIgPSBORVRXT1JLX1VTRVI7XG5Db25uZWN0aW9uLk5FVFdPUktfVVNFUl9URVhUID0gTkVUV09SS19VU0VSX1RFWFQ7XG4iLCIvKipcbiAqIEBmaWxlIEhlbHBlciBtZXRob2RzIGZvciBkZWFsaW5nIHdpdGggSW5kZXhlZERCIGNhY2hlIG9mIG1lc3NhZ2VzLCB1c2VycywgYW5kIHRvcGljcy5cbiAqXG4gKiBAY29weXJpZ2h0IDIwMTUtMjAyMiBUaW5vZGUgTExDLlxuICovXG4ndXNlIHN0cmljdCc7XG5cbi8vIE5PVEUgVE8gREVWRUxPUEVSUzpcbi8vIExvY2FsaXphYmxlIHN0cmluZ3Mgc2hvdWxkIGJlIGRvdWJsZSBxdW90ZWQgXCLRgdGC0YDQvtC60LAg0L3QsCDQtNGA0YPQs9C+0Lwg0Y/Qt9GL0LrQtVwiLFxuLy8gbm9uLWxvY2FsaXphYmxlIHN0cmluZ3Mgc2hvdWxkIGJlIHNpbmdsZSBxdW90ZWQgJ25vbi1sb2NhbGl6ZWQnLlxuXG5jb25zdCBEQl9WRVJTSU9OID0gMTtcbmNvbnN0IERCX05BTUUgPSAndGlub2RlLXdlYic7XG5cbmxldCBJREJQcm92aWRlcjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgREIge1xuICAjb25FcnJvciA9IF8gPT4ge307XG4gICNsb2dnZXIgPSBfID0+IHt9O1xuXG4gIC8vIEluc3RhbmNlIG9mIEluZGV4REIuXG4gIGRiID0gbnVsbDtcbiAgLy8gSW5kaWNhdG9yIHRoYXQgdGhlIGNhY2hlIGlzIGRpc2FibGVkLlxuICBkaXNhYmxlZCA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKG9uRXJyb3IsIGxvZ2dlcikge1xuICAgIHRoaXMuI29uRXJyb3IgPSBvbkVycm9yIHx8IHRoaXMuI29uRXJyb3I7XG4gICAgdGhpcy4jbG9nZ2VyID0gbG9nZ2VyIHx8IHRoaXMuI2xvZ2dlcjtcbiAgfVxuXG4gICNtYXBPYmplY3RzKHNvdXJjZSwgY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICBpZiAoIXRoaXMuZGIpIHtcbiAgICAgIHJldHVybiBkaXNhYmxlZCA/XG4gICAgICAgIFByb21pc2UucmVzb2x2ZShbXSkgOlxuICAgICAgICBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJub3QgaW5pdGlhbGl6ZWRcIikpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCB0cnggPSB0aGlzLmRiLnRyYW5zYWN0aW9uKFtzb3VyY2VdKTtcbiAgICAgIHRyeC5vbmVycm9yID0gZXZlbnQgPT4ge1xuICAgICAgICB0aGlzLiNsb2dnZXIoJ1BDYWNoZScsICdtYXBPYmplY3RzJywgc291cmNlLCBldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgICByZWplY3QoZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgIH07XG4gICAgICB0cngub2JqZWN0U3RvcmUoc291cmNlKS5nZXRBbGwoKS5vbnN1Y2Nlc3MgPSBldmVudCA9PiB7XG4gICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgIGV2ZW50LnRhcmdldC5yZXN1bHQuZm9yRWFjaCh0b3BpYyA9PiB7XG4gICAgICAgICAgICBjYWxsYmFjay5jYWxsKGNvbnRleHQsIHRvcGljKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXNvbHZlKGV2ZW50LnRhcmdldC5yZXN1bHQpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIHBlcnNpc3RlbnQgY2FjaGU6IG9wZW4gb3IgY3JlYXRlL3VwZ3JhZGUgaWYgbmVlZGVkLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gcHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBEQiBpcyBpbml0aWFsaXplZC5cbiAgICovXG4gIGluaXREYXRhYmFzZSgpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgLy8gT3BlbiB0aGUgZGF0YWJhc2UgYW5kIGluaXRpYWxpemUgY2FsbGJhY2tzLlxuICAgICAgY29uc3QgcmVxID0gSURCUHJvdmlkZXIub3BlbihEQl9OQU1FLCBEQl9WRVJTSU9OKTtcbiAgICAgIHJlcS5vbnN1Y2Nlc3MgPSBldmVudCA9PiB7XG4gICAgICAgIHRoaXMuZGIgPSBldmVudC50YXJnZXQucmVzdWx0O1xuICAgICAgICB0aGlzLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIHJlc29sdmUodGhpcy5kYik7XG4gICAgICB9O1xuICAgICAgcmVxLm9uZXJyb3IgPSBldmVudCA9PiB7XG4gICAgICAgIHRoaXMuI2xvZ2dlcignUENhY2hlJywgXCJmYWlsZWQgdG8gaW5pdGlhbGl6ZVwiLCBldmVudCk7XG4gICAgICAgIHJlamVjdChldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgICB0aGlzLiNvbkVycm9yKGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICB9O1xuICAgICAgcmVxLm9udXBncmFkZW5lZWRlZCA9IGV2ZW50ID0+IHtcbiAgICAgICAgdGhpcy5kYiA9IGV2ZW50LnRhcmdldC5yZXN1bHQ7XG5cbiAgICAgICAgdGhpcy5kYi5vbmVycm9yID0gZXZlbnQgPT4ge1xuICAgICAgICAgIHRoaXMuI2xvZ2dlcignUENhY2hlJywgXCJmYWlsZWQgdG8gY3JlYXRlIHN0b3JhZ2VcIiwgZXZlbnQpO1xuICAgICAgICAgIHRoaXMuI29uRXJyb3IoZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBJbmRpdmlkdWFsIG9iamVjdCBzdG9yZXMuXG4gICAgICAgIC8vIE9iamVjdCBzdG9yZSAodGFibGUpIGZvciB0b3BpY3MuIFRoZSBwcmltYXJ5IGtleSBpcyB0b3BpYyBuYW1lLlxuICAgICAgICB0aGlzLmRiLmNyZWF0ZU9iamVjdFN0b3JlKCd0b3BpYycsIHtcbiAgICAgICAgICBrZXlQYXRoOiAnbmFtZSdcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gVXNlcnMgb2JqZWN0IHN0b3JlLiBVSUQgaXMgdGhlIHByaW1hcnkga2V5LlxuICAgICAgICB0aGlzLmRiLmNyZWF0ZU9iamVjdFN0b3JlKCd1c2VyJywge1xuICAgICAgICAgIGtleVBhdGg6ICd1aWQnXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFN1YnNjcmlwdGlvbnMgb2JqZWN0IHN0b3JlIHRvcGljIDwtPiB1c2VyLiBUb3BpYyBuYW1lICsgVUlEIGlzIHRoZSBwcmltYXJ5IGtleS5cbiAgICAgICAgdGhpcy5kYi5jcmVhdGVPYmplY3RTdG9yZSgnc3Vic2NyaXB0aW9uJywge1xuICAgICAgICAgIGtleVBhdGg6IFsndG9waWMnLCAndWlkJ11cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gTWVzc2FnZXMgb2JqZWN0IHN0b3JlLiBUaGUgcHJpbWFyeSBrZXkgaXMgdG9waWMgbmFtZSArIHNlcS5cbiAgICAgICAgdGhpcy5kYi5jcmVhdGVPYmplY3RTdG9yZSgnbWVzc2FnZScsIHtcbiAgICAgICAgICBrZXlQYXRoOiBbJ3RvcGljJywgJ3NlcSddXG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWxldGUgcGVyc2lzdGVudCBjYWNoZS5cbiAgICovXG4gIGRlbGV0ZURhdGFiYXNlKCkge1xuICAgIC8vIENsb3NlIGNvbm5lY3Rpb24sIG90aGVyd2lzZSBvcGVyYXRpb25zIHdpbGwgZmFpbCB3aXRoICdvbmJsb2NrZWQnLlxuICAgIGlmICh0aGlzLmRiKSB7XG4gICAgICB0aGlzLmRiLmNsb3NlKCk7XG4gICAgICB0aGlzLmRiID0gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IHJlcSA9IElEQlByb3ZpZGVyLmRlbGV0ZURhdGFiYXNlKERCX05BTUUpO1xuICAgICAgcmVxLm9uYmxvY2tlZCA9IF8gPT4ge1xuICAgICAgICBpZiAodGhpcy5kYikge1xuICAgICAgICAgIHRoaXMuZGIuY2xvc2UoKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBlcnIgPSBuZXcgRXJyb3IoXCJibG9ja2VkXCIpO1xuICAgICAgICB0aGlzLiNsb2dnZXIoJ1BDYWNoZScsICdkZWxldGVEYXRhYmFzZScsIGVycik7XG4gICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgfTtcbiAgICAgIHJlcS5vbnN1Y2Nlc3MgPSBfID0+IHtcbiAgICAgICAgdGhpcy5kYiA9IG51bGw7XG4gICAgICAgIHRoaXMuZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICByZXNvbHZlKHRydWUpO1xuICAgICAgfTtcbiAgICAgIHJlcS5vbmVycm9yID0gZXZlbnQgPT4ge1xuICAgICAgICB0aGlzLiNsb2dnZXIoJ1BDYWNoZScsICdkZWxldGVEYXRhYmFzZScsIGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICAgIHJlamVjdChldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBwZXJzaXN0ZW50IGNhY2hlIGlzIHJlYWR5IGZvciB1c2UuXG4gICAqIEBtZW1iZXJPZiBEQlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgY2FjaGUgaXMgcmVhZHksIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBpc1JlYWR5KCkge1xuICAgIHJldHVybiAhIXRoaXMuZGI7XG4gIH1cblxuICAvLyBUb3BpY3MuXG5cbiAgLyoqXG4gICAqIFNhdmUgdG8gY2FjaGUgb3IgdXBkYXRlIHRvcGljIGluIHBlcnNpc3RlbnQgY2FjaGUuXG4gICAqIEBtZW1iZXJPZiBEQlxuICAgKiBAcGFyYW0ge1RvcGljfSB0b3BpYyAtIHRvcGljIHRvIGJlIGFkZGVkIG9yIHVwZGF0ZWQuXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBwcm9taXNlIHJlc29sdmVkL3JlamVjdGVkIG9uIG9wZXJhdGlvbiBjb21wbGV0aW9uLlxuICAgKi9cbiAgdXBkVG9waWModG9waWMpIHtcbiAgICBpZiAoIXRoaXMuaXNSZWFkeSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5kaXNhYmxlZCA/XG4gICAgICAgIFByb21pc2UucmVzb2x2ZSgpIDpcbiAgICAgICAgUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwibm90IGluaXRpYWxpemVkXCIpKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IHRyeCA9IHRoaXMuZGIudHJhbnNhY3Rpb24oWyd0b3BpYyddLCAncmVhZHdyaXRlJyk7XG4gICAgICB0cngub25jb21wbGV0ZSA9IGV2ZW50ID0+IHtcbiAgICAgICAgcmVzb2x2ZShldmVudC50YXJnZXQucmVzdWx0KTtcbiAgICAgIH07XG4gICAgICB0cngub25lcnJvciA9IGV2ZW50ID0+IHtcbiAgICAgICAgdGhpcy4jbG9nZ2VyKCdQQ2FjaGUnLCAndXBkVG9waWMnLCBldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgICByZWplY3QoZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgIH07XG4gICAgICBjb25zdCByZXEgPSB0cngub2JqZWN0U3RvcmUoJ3RvcGljJykuZ2V0KHRvcGljLm5hbWUpO1xuICAgICAgcmVxLm9uc3VjY2VzcyA9IF8gPT4ge1xuICAgICAgICB0cngub2JqZWN0U3RvcmUoJ3RvcGljJykucHV0KERCLiNzZXJpYWxpemVUb3BpYyhyZXEucmVzdWx0LCB0b3BpYykpO1xuICAgICAgICB0cnguY29tbWl0KCk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hcmsgb3IgdW5tYXJrIHRvcGljIGFzIGRlbGV0ZWQuXG4gICAqIEBtZW1iZXJPZiBEQlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIG5hbWUgb2YgdGhlIHRvcGljIHRvIG1hcmsgb3IgdW5tYXJrLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBwcm9taXNlIHJlc29sdmVkL3JlamVjdGVkIG9uIG9wZXJhdGlvbiBjb21wbGV0aW9uLlxuICAgKi9cbiAgbWFya1RvcGljQXNEZWxldGVkKG5hbWUpIHtcbiAgICBpZiAoIXRoaXMuaXNSZWFkeSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5kaXNhYmxlZCA/XG4gICAgICAgIFByb21pc2UucmVzb2x2ZSgpIDpcbiAgICAgICAgUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwibm90IGluaXRpYWxpemVkXCIpKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IHRyeCA9IHRoaXMuZGIudHJhbnNhY3Rpb24oWyd0b3BpYyddLCAncmVhZHdyaXRlJyk7XG4gICAgICB0cngub25jb21wbGV0ZSA9IGV2ZW50ID0+IHtcbiAgICAgICAgcmVzb2x2ZShldmVudC50YXJnZXQucmVzdWx0KTtcbiAgICAgIH07XG4gICAgICB0cngub25lcnJvciA9IGV2ZW50ID0+IHtcbiAgICAgICAgdGhpcy4jbG9nZ2VyKCdQQ2FjaGUnLCAnbWFya1RvcGljQXNEZWxldGVkJywgZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgICAgcmVqZWN0KGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICB9O1xuICAgICAgY29uc3QgcmVxID0gdHJ4Lm9iamVjdFN0b3JlKCd0b3BpYycpLmdldChuYW1lKTtcbiAgICAgIHJlcS5vbnN1Y2Nlc3MgPSBldmVudCA9PiB7XG4gICAgICAgIGNvbnN0IHRvcGljID0gZXZlbnQudGFyZ2V0LnJlc3VsdDtcbiAgICAgICAgdG9waWMuX2RlbGV0ZWQgPSB0cnVlO1xuICAgICAgICB0cngub2JqZWN0U3RvcmUoJ3RvcGljJykucHV0KHRvcGljKTtcbiAgICAgICAgdHJ4LmNvbW1pdCgpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgdG9waWMgZnJvbSBwZXJzaXN0ZW50IGNhY2hlLlxuICAgKiBAbWVtYmVyT2YgREJcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBuYW1lIG9mIHRoZSB0b3BpYyB0byByZW1vdmUgZnJvbSBkYXRhYmFzZS5cbiAgICogQHJldHVybiB7UHJvbWlzZX0gcHJvbWlzZSByZXNvbHZlZC9yZWplY3RlZCBvbiBvcGVyYXRpb24gY29tcGxldGlvbi5cbiAgICovXG4gIHJlbVRvcGljKG5hbWUpIHtcbiAgICBpZiAoIXRoaXMuaXNSZWFkeSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5kaXNhYmxlZCA/XG4gICAgICAgIFByb21pc2UucmVzb2x2ZSgpIDpcbiAgICAgICAgUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwibm90IGluaXRpYWxpemVkXCIpKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IHRyeCA9IHRoaXMuZGIudHJhbnNhY3Rpb24oWyd0b3BpYycsICdzdWJzY3JpcHRpb24nLCAnbWVzc2FnZSddLCAncmVhZHdyaXRlJyk7XG4gICAgICB0cngub25jb21wbGV0ZSA9IGV2ZW50ID0+IHtcbiAgICAgICAgcmVzb2x2ZShldmVudC50YXJnZXQucmVzdWx0KTtcbiAgICAgIH07XG4gICAgICB0cngub25lcnJvciA9IGV2ZW50ID0+IHtcbiAgICAgICAgdGhpcy4jbG9nZ2VyKCdQQ2FjaGUnLCAncmVtVG9waWMnLCBldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgICByZWplY3QoZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgIH07XG4gICAgICB0cngub2JqZWN0U3RvcmUoJ3RvcGljJykuZGVsZXRlKElEQktleVJhbmdlLm9ubHkobmFtZSkpO1xuICAgICAgdHJ4Lm9iamVjdFN0b3JlKCdzdWJzY3JpcHRpb24nKS5kZWxldGUoSURCS2V5UmFuZ2UuYm91bmQoW25hbWUsICctJ10sIFtuYW1lLCAnfiddKSk7XG4gICAgICB0cngub2JqZWN0U3RvcmUoJ21lc3NhZ2UnKS5kZWxldGUoSURCS2V5UmFuZ2UuYm91bmQoW25hbWUsIDBdLCBbbmFtZSwgTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVJdKSk7XG4gICAgICB0cnguY29tbWl0KCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogRXhlY3V0ZSBhIGNhbGxiYWNrIGZvciBlYWNoIHN0b3JlZCB0b3BpYy5cbiAgICogQG1lbWJlck9mIERCXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIC0gZnVuY3Rpb24gdG8gY2FsbCBmb3IgZWFjaCB0b3BpYy5cbiAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHQgLSB0aGUgdmFsdWUgb3IgPGNvZGU+dGhpczwvY29kZT4gaW5zaWRlIHRoZSBjYWxsYmFjay5cbiAgICogQHJldHVybiB7UHJvbWlzZX0gcHJvbWlzZSByZXNvbHZlZC9yZWplY3RlZCBvbiBvcGVyYXRpb24gY29tcGxldGlvbi5cbiAgICovXG4gIG1hcFRvcGljcyhjYWxsYmFjaywgY29udGV4dCkge1xuICAgIHJldHVybiB0aGlzLiNtYXBPYmplY3RzKCd0b3BpYycsIGNhbGxiYWNrLCBjb250ZXh0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb3B5IGRhdGEgZnJvbSBzZXJpYWxpemVkIG9iamVjdCB0byB0b3BpYy5cbiAgICogQG1lbWJlck9mIERCXG4gICAqIEBwYXJhbSB7VG9waWN9IHRvcGljIC0gdGFyZ2V0IHRvIGRlc2VyaWFsaXplIHRvLlxuICAgKiBAcGFyYW0ge09iamVjdH0gc3JjIC0gc2VyaWFsaXplZCBkYXRhIHRvIGNvcHkgZnJvbS5cbiAgICovXG4gIGRlc2VyaWFsaXplVG9waWModG9waWMsIHNyYykge1xuICAgIERCLiNkZXNlcmlhbGl6ZVRvcGljKHRvcGljLCBzcmMpO1xuICB9XG5cbiAgLy8gVXNlcnMuXG4gIC8qKlxuICAgKiBBZGQgb3IgdXBkYXRlIHVzZXIgb2JqZWN0IGluIHRoZSBwZXJzaXN0ZW50IGNhY2hlLlxuICAgKiBAbWVtYmVyT2YgREJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVpZCAtIElEIG9mIHRoZSB1c2VyIHRvIHNhdmUgb3IgdXBkYXRlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gcHViIC0gdXNlcidzIDxjb2RlPnB1YmxpYzwvY29kZT4gaW5mb3JtYXRpb24uXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBwcm9taXNlIHJlc29sdmVkL3JlamVjdGVkIG9uIG9wZXJhdGlvbiBjb21wbGV0aW9uLlxuICAgKi9cbiAgdXBkVXNlcih1aWQsIHB1Yikge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMiB8fCBwdWIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gTm8gcG9pbnQgaW51cGRhdGluZyB1c2VyIHdpdGggaW52YWxpZCBkYXRhLlxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuaXNSZWFkeSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5kaXNhYmxlZCA/XG4gICAgICAgIFByb21pc2UucmVzb2x2ZSgpIDpcbiAgICAgICAgUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwibm90IGluaXRpYWxpemVkXCIpKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IHRyeCA9IHRoaXMuZGIudHJhbnNhY3Rpb24oWyd1c2VyJ10sICdyZWFkd3JpdGUnKTtcbiAgICAgIHRyeC5vbmNvbXBsZXRlID0gZXZlbnQgPT4ge1xuICAgICAgICByZXNvbHZlKGV2ZW50LnRhcmdldC5yZXN1bHQpO1xuICAgICAgfTtcbiAgICAgIHRyeC5vbmVycm9yID0gZXZlbnQgPT4ge1xuICAgICAgICB0aGlzLiNsb2dnZXIoJ1BDYWNoZScsICd1cGRVc2VyJywgZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgICAgcmVqZWN0KGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICB9O1xuICAgICAgdHJ4Lm9iamVjdFN0b3JlKCd1c2VyJykucHV0KHtcbiAgICAgICAgdWlkOiB1aWQsXG4gICAgICAgIHB1YmxpYzogcHViXG4gICAgICB9KTtcbiAgICAgIHRyeC5jb21taXQoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgdXNlciBmcm9tIHBlcnNpc3RlbnQgY2FjaGUuXG4gICAqIEBtZW1iZXJPZiBEQlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdWlkIC0gSUQgb2YgdGhlIHVzZXIgdG8gcmVtb3ZlIGZyb20gdGhlIGNhY2hlLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBwcm9taXNlIHJlc29sdmVkL3JlamVjdGVkIG9uIG9wZXJhdGlvbiBjb21wbGV0aW9uLlxuICAgKi9cbiAgcmVtVXNlcih1aWQpIHtcbiAgICBpZiAoIXRoaXMuaXNSZWFkeSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5kaXNhYmxlZCA/XG4gICAgICAgIFByb21pc2UucmVzb2x2ZSgpIDpcbiAgICAgICAgUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwibm90IGluaXRpYWxpemVkXCIpKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IHRyeCA9IHRoaXMuZGIudHJhbnNhY3Rpb24oWyd1c2VyJ10sICdyZWFkd3JpdGUnKTtcbiAgICAgIHRyeC5vbmNvbXBsZXRlID0gZXZlbnQgPT4ge1xuICAgICAgICByZXNvbHZlKGV2ZW50LnRhcmdldC5yZXN1bHQpO1xuICAgICAgfTtcbiAgICAgIHRyeC5vbmVycm9yID0gZXZlbnQgPT4ge1xuICAgICAgICB0aGlzLiNsb2dnZXIoJ1BDYWNoZScsICdyZW1Vc2VyJywgZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgICAgcmVqZWN0KGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICB9O1xuICAgICAgdHJ4Lm9iamVjdFN0b3JlKCd1c2VyJykuZGVsZXRlKElEQktleVJhbmdlLm9ubHkodWlkKSk7XG4gICAgICB0cnguY29tbWl0KCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogRXhlY3V0ZSBhIGNhbGxiYWNrIGZvciBlYWNoIHN0b3JlZCB1c2VyLlxuICAgKiBAbWVtYmVyT2YgREJcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgLSBmdW5jdGlvbiB0byBjYWxsIGZvciBlYWNoIHRvcGljLlxuICAgKiBAcGFyYW0ge09iamVjdH0gY29udGV4dCAtIHRoZSB2YWx1ZSBvciA8Y29kZT50aGlzPC9jb2RlPiBpbnNpZGUgdGhlIGNhbGxiYWNrLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBwcm9taXNlIHJlc29sdmVkL3JlamVjdGVkIG9uIG9wZXJhdGlvbiBjb21wbGV0aW9uLlxuICAgKi9cbiAgbWFwVXNlcnMoY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICByZXR1cm4gdGhpcy4jbWFwT2JqZWN0cygndXNlcicsIGNhbGxiYWNrLCBjb250ZXh0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWFkIGEgc2luZ2xlIHVzZXIgZnJvbSBwZXJzaXN0ZW50IGNhY2hlLlxuICAgKiBAbWVtYmVyT2YgREJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVpZCAtIElEIG9mIHRoZSB1c2VyIHRvIGZldGNoIGZyb20gY2FjaGUuXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IHByb21pc2UgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gb3BlcmF0aW9uIGNvbXBsZXRpb24uXG4gICAqL1xuICBnZXRVc2VyKHVpZCkge1xuICAgIGlmICghdGhpcy5pc1JlYWR5KCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmRpc2FibGVkID9cbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkgOlxuICAgICAgICBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJub3QgaW5pdGlhbGl6ZWRcIikpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgdHJ4ID0gdGhpcy5kYi50cmFuc2FjdGlvbihbJ3VzZXInXSk7XG4gICAgICB0cngub25jb21wbGV0ZSA9IGV2ZW50ID0+IHtcbiAgICAgICAgY29uc3QgdXNlciA9IGV2ZW50LnRhcmdldC5yZXN1bHQ7XG4gICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgIHVzZXI6IHVzZXIudWlkLFxuICAgICAgICAgIHB1YmxpYzogdXNlci5wdWJsaWNcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgICAgdHJ4Lm9uZXJyb3IgPSBldmVudCA9PiB7XG4gICAgICAgIHRoaXMuI2xvZ2dlcignUENhY2hlJywgJ2dldFVzZXInLCBldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgICByZWplY3QoZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgIH07XG4gICAgICB0cngub2JqZWN0U3RvcmUoJ3VzZXInKS5nZXQodWlkKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIFN1YnNjcmlwdGlvbnMuXG4gIC8qKlxuICAgKiBBZGQgb3IgdXBkYXRlIHN1YnNjcmlwdGlvbiBpbiBwZXJzaXN0ZW50IGNhY2hlLlxuICAgKiBAbWVtYmVyT2YgREJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljTmFtZSAtIG5hbWUgb2YgdGhlIHRvcGljIHdoaWNoIG93bnMgdGhlIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1aWQgLSBJRCBvZiB0aGUgc3Vic2NyaWJlZCB1c2VyLlxuICAgKiBAcGFyYW0ge09iamVjdH0gc3ViIC0gc3Vic2NyaXB0aW9uIHRvIHNhdmUuXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IHByb21pc2UgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gb3BlcmF0aW9uIGNvbXBsZXRpb24uXG4gICAqL1xuICB1cGRTdWJzY3JpcHRpb24odG9waWNOYW1lLCB1aWQsIHN1Yikge1xuICAgIGlmICghdGhpcy5pc1JlYWR5KCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmRpc2FibGVkID9cbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkgOlxuICAgICAgICBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJub3QgaW5pdGlhbGl6ZWRcIikpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgdHJ4ID0gdGhpcy5kYi50cmFuc2FjdGlvbihbJ3N1YnNjcmlwdGlvbiddLCAncmVhZHdyaXRlJyk7XG4gICAgICB0cngub25jb21wbGV0ZSA9IGV2ZW50ID0+IHtcbiAgICAgICAgcmVzb2x2ZShldmVudC50YXJnZXQucmVzdWx0KTtcbiAgICAgIH07XG4gICAgICB0cngub25lcnJvciA9IGV2ZW50ID0+IHtcbiAgICAgICAgdGhpcy4jbG9nZ2VyKCdQQ2FjaGUnLCAndXBkU3Vic2NyaXB0aW9uJywgZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgICAgcmVqZWN0KGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICB9O1xuICAgICAgdHJ4Lm9iamVjdFN0b3JlKCdzdWJzY3JpcHRpb24nKS5nZXQoW3RvcGljTmFtZSwgdWlkXSkub25zdWNjZXNzID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHRyeC5vYmplY3RTdG9yZSgnc3Vic2NyaXB0aW9uJykucHV0KERCLiNzZXJpYWxpemVTdWJzY3JpcHRpb24oZXZlbnQudGFyZ2V0LnJlc3VsdCwgdG9waWNOYW1lLCB1aWQsIHN1YikpO1xuICAgICAgICB0cnguY29tbWl0KCk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4ZWN1dGUgYSBjYWxsYmFjayBmb3IgZWFjaCBjYWNoZWQgc3Vic2NyaXB0aW9uIGluIGEgZ2l2ZW4gdG9waWMuXG4gICAqIEBtZW1iZXJPZiBEQlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWNOYW1lIC0gbmFtZSBvZiB0aGUgdG9waWMgd2hpY2ggb3ducyB0aGUgc3Vic2NyaXB0aW9ucy5cbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgLSBmdW5jdGlvbiB0byBjYWxsIGZvciBlYWNoIHN1YnNjcmlwdGlvbi5cbiAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHQgLSB0aGUgdmFsdWUgb3IgPGNvZGU+dGhpczwvY29kZT4gaW5zaWRlIHRoZSBjYWxsYmFjay5cbiAgICogQHJldHVybiB7UHJvbWlzZX0gcHJvbWlzZSByZXNvbHZlZC9yZWplY3RlZCBvbiBvcGVyYXRpb24gY29tcGxldGlvbi5cbiAgICovXG4gIG1hcFN1YnNjcmlwdGlvbnModG9waWNOYW1lLCBjYWxsYmFjaywgY29udGV4dCkge1xuICAgIGlmICghdGhpcy5pc1JlYWR5KCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmRpc2FibGVkID9cbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKFtdKSA6XG4gICAgICAgIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIm5vdCBpbml0aWFsaXplZFwiKSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCB0cnggPSB0aGlzLmRiLnRyYW5zYWN0aW9uKFsnc3Vic2NyaXB0aW9uJ10pO1xuICAgICAgdHJ4Lm9uZXJyb3IgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy4jbG9nZ2VyKCdQQ2FjaGUnLCAnbWFwU3Vic2NyaXB0aW9ucycsIGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICAgIHJlamVjdChldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgfTtcbiAgICAgIHRyeC5vYmplY3RTdG9yZSgnc3Vic2NyaXB0aW9uJykuZ2V0QWxsKElEQktleVJhbmdlLmJvdW5kKFt0b3BpY05hbWUsICctJ10sIFt0b3BpY05hbWUsICd+J10pKS5vbnN1Y2Nlc3MgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgZXZlbnQudGFyZ2V0LnJlc3VsdC5mb3JFYWNoKCh0b3BpYykgPT4ge1xuICAgICAgICAgICAgY2FsbGJhY2suY2FsbChjb250ZXh0LCB0b3BpYyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmVzb2x2ZShldmVudC50YXJnZXQucmVzdWx0KTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICAvLyBNZXNzYWdlcy5cblxuICAvKipcbiAgICogU2F2ZSBtZXNzYWdlIHRvIHBlcnNpc3RlbnQgY2FjaGUuXG4gICAqIEBtZW1iZXJPZiBEQlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWNOYW1lIC0gbmFtZSBvZiB0aGUgdG9waWMgd2hpY2ggb3ducyB0aGUgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IG1zZyAtIG1lc3NhZ2UgdG8gc2F2ZS5cbiAgICogQHJldHVybiB7UHJvbWlzZX0gcHJvbWlzZSByZXNvbHZlZC9yZWplY3RlZCBvbiBvcGVyYXRpb24gY29tcGxldGlvbi5cbiAgICovXG4gIGFkZE1lc3NhZ2UobXNnKSB7XG4gICAgaWYgKCF0aGlzLmlzUmVhZHkoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZGlzYWJsZWQgP1xuICAgICAgICBQcm9taXNlLnJlc29sdmUoKSA6XG4gICAgICAgIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIm5vdCBpbml0aWFsaXplZFwiKSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCB0cnggPSB0aGlzLmRiLnRyYW5zYWN0aW9uKFsnbWVzc2FnZSddLCAncmVhZHdyaXRlJyk7XG4gICAgICB0cngub25zdWNjZXNzID0gZXZlbnQgPT4ge1xuICAgICAgICByZXNvbHZlKGV2ZW50LnRhcmdldC5yZXN1bHQpO1xuICAgICAgfTtcbiAgICAgIHRyeC5vbmVycm9yID0gZXZlbnQgPT4ge1xuICAgICAgICB0aGlzLiNsb2dnZXIoJ1BDYWNoZScsICdhZGRNZXNzYWdlJywgZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgICAgcmVqZWN0KGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICB9O1xuICAgICAgdHJ4Lm9iamVjdFN0b3JlKCdtZXNzYWdlJykuYWRkKERCLiNzZXJpYWxpemVNZXNzYWdlKG51bGwsIG1zZykpO1xuICAgICAgdHJ4LmNvbW1pdCgpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSBkZWxpdmVyeSBzdGF0dXMgb2YgYSBtZXNzYWdlIHN0b3JlZCBpbiBwZXJzaXN0ZW50IGNhY2hlLlxuICAgKiBAbWVtYmVyT2YgREJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljTmFtZSAtIG5hbWUgb2YgdGhlIHRvcGljIHdoaWNoIG93bnMgdGhlIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzZXEgLSBJRCBvZiB0aGUgbWVzc2FnZSB0byB1cGRhdGVcbiAgICogQHBhcmFtIHtudW1iZXJ9IHN0YXR1cyAtIG5ldyBkZWxpdmVyeSBzdGF0dXMgb2YgdGhlIG1lc3NhZ2UuXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IHByb21pc2UgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gb3BlcmF0aW9uIGNvbXBsZXRpb24uXG4gICAqL1xuICB1cGRNZXNzYWdlU3RhdHVzKHRvcGljTmFtZSwgc2VxLCBzdGF0dXMpIHtcbiAgICBpZiAoIXRoaXMuaXNSZWFkeSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5kaXNhYmxlZCA/XG4gICAgICAgIFByb21pc2UucmVzb2x2ZSgpIDpcbiAgICAgICAgUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwibm90IGluaXRpYWxpemVkXCIpKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IHRyeCA9IHRoaXMuZGIudHJhbnNhY3Rpb24oWydtZXNzYWdlJ10sICdyZWFkd3JpdGUnKTtcbiAgICAgIHRyeC5vbnN1Y2Nlc3MgPSBldmVudCA9PiB7XG4gICAgICAgIHJlc29sdmUoZXZlbnQudGFyZ2V0LnJlc3VsdCk7XG4gICAgICB9O1xuICAgICAgdHJ4Lm9uZXJyb3IgPSBldmVudCA9PiB7XG4gICAgICAgIHRoaXMuI2xvZ2dlcignUENhY2hlJywgJ3VwZE1lc3NhZ2VTdGF0dXMnLCBldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgICByZWplY3QoZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgIH07XG4gICAgICBjb25zdCByZXEgPSB0cngub2JqZWN0U3RvcmUoJ21lc3NhZ2UnKS5nZXQoSURCS2V5UmFuZ2Uub25seShbdG9waWNOYW1lLCBzZXFdKSk7XG4gICAgICByZXEub25zdWNjZXNzID0gZXZlbnQgPT4ge1xuICAgICAgICBjb25zdCBzcmMgPSByZXEucmVzdWx0IHx8IGV2ZW50LnRhcmdldC5yZXN1bHQ7XG4gICAgICAgIGlmICghc3JjIHx8IHNyYy5fc3RhdHVzID09IHN0YXR1cykge1xuICAgICAgICAgIHRyeC5jb21taXQoKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdHJ4Lm9iamVjdFN0b3JlKCdtZXNzYWdlJykucHV0KERCLiNzZXJpYWxpemVNZXNzYWdlKHNyYywge1xuICAgICAgICAgIHRvcGljOiB0b3BpY05hbWUsXG4gICAgICAgICAgc2VxOiBzZXEsXG4gICAgICAgICAgX3N0YXR1czogc3RhdHVzXG4gICAgICAgIH0pKTtcbiAgICAgICAgdHJ4LmNvbW1pdCgpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgb25lIG9yIG1vcmUgbWVzc2FnZXMgZnJvbSBwZXJzaXN0ZW50IGNhY2hlLlxuICAgKiBAbWVtYmVyT2YgREJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljTmFtZSAtIG5hbWUgb2YgdGhlIHRvcGljIHdoaWNoIG93bnMgdGhlIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBmcm9tIC0gaWQgb2YgdGhlIG1lc3NhZ2UgdG8gcmVtb3ZlIG9yIGxvd2VyIGJvdW5kYXJ5IHdoZW4gcmVtb3ZpbmcgcmFuZ2UgKGluY2x1c2l2ZSkuXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gdG8gLSB1cHBlciBib3VuZGFyeSAoZXhjbHVzaXZlKSB3aGVuIHJlbW92aW5nIGEgcmFuZ2Ugb2YgbWVzc2FnZXMuXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IHByb21pc2UgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gb3BlcmF0aW9uIGNvbXBsZXRpb24uXG4gICAqL1xuICByZW1NZXNzYWdlcyh0b3BpY05hbWUsIGZyb20sIHRvKSB7XG4gICAgaWYgKCF0aGlzLmlzUmVhZHkoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZGlzYWJsZWQgP1xuICAgICAgICBQcm9taXNlLnJlc29sdmUoKSA6XG4gICAgICAgIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIm5vdCBpbml0aWFsaXplZFwiKSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBpZiAoIWZyb20gJiYgIXRvKSB7XG4gICAgICAgIGZyb20gPSAwO1xuICAgICAgICB0byA9IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSO1xuICAgICAgfVxuICAgICAgY29uc3QgcmFuZ2UgPSB0byA+IDAgPyBJREJLZXlSYW5nZS5ib3VuZChbdG9waWNOYW1lLCBmcm9tXSwgW3RvcGljTmFtZSwgdG9dLCBmYWxzZSwgdHJ1ZSkgOlxuICAgICAgICBJREJLZXlSYW5nZS5vbmx5KFt0b3BpY05hbWUsIGZyb21dKTtcbiAgICAgIGNvbnN0IHRyeCA9IHRoaXMuZGIudHJhbnNhY3Rpb24oWydtZXNzYWdlJ10sICdyZWFkd3JpdGUnKTtcbiAgICAgIHRyeC5vbnN1Y2Nlc3MgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgcmVzb2x2ZShldmVudC50YXJnZXQucmVzdWx0KTtcbiAgICAgIH07XG4gICAgICB0cngub25lcnJvciA9IChldmVudCkgPT4ge1xuICAgICAgICB0aGlzLiNsb2dnZXIoJ1BDYWNoZScsICdyZW1NZXNzYWdlcycsIGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICAgIHJlamVjdChldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgfTtcbiAgICAgIHRyeC5vYmplY3RTdG9yZSgnbWVzc2FnZScpLmRlbGV0ZShyYW5nZSk7XG4gICAgICB0cnguY29tbWl0KCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmUgbWVzc2FnZXMgZnJvbSBwZXJzaXN0ZW50IHN0b3JlLlxuICAgKiBAbWVtYmVyT2YgREJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljTmFtZSAtIG5hbWUgb2YgdGhlIHRvcGljIHRvIHJldHJpZXZlIG1lc3NhZ2VzIGZyb20uXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIHRvIGNhbGwgZm9yIGVhY2ggcmV0cmlldmVkIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBxdWVyeSAtIHBhcmFtZXRlcnMgb2YgdGhlIG1lc3NhZ2UgcmFuZ2UgdG8gcmV0cmlldmUuXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gcXVlcnkuc2luY2UgLSB0aGUgbGVhc3QgbWVzc2FnZSBJRCB0byByZXRyaWV2ZSAoaW5jbHVzaXZlKS5cbiAgICogQHBhcmFtIHtudW1iZXI9fSBxdWVyeS5iZWZvcmUgLSB0aGUgZ3JlYXRlc3QgbWVzc2FnZSBJRCB0byByZXRyaWV2ZSAoZXhjbHVzaXZlKS5cbiAgICogQHBhcmFtIHtudW1iZXI9fSBxdWVyeS5saW1pdCAtIHRoZSBtYXhpbXVtIG51bWJlciBvZiBtZXNzYWdlcyB0byByZXRyaWV2ZS5cbiAgICogQHJldHVybiB7UHJvbWlzZX0gcHJvbWlzZSByZXNvbHZlZC9yZWplY3RlZCBvbiBvcGVyYXRpb24gY29tcGxldGlvbi5cbiAgICovXG4gIHJlYWRNZXNzYWdlcyh0b3BpY05hbWUsIHF1ZXJ5LCBjYWxsYmFjaywgY29udGV4dCkge1xuICAgIGlmICghdGhpcy5pc1JlYWR5KCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmRpc2FibGVkID9cbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKFtdKSA6XG4gICAgICAgIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIm5vdCBpbml0aWFsaXplZFwiKSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBxdWVyeSA9IHF1ZXJ5IHx8IHt9O1xuICAgICAgY29uc3Qgc2luY2UgPSBxdWVyeS5zaW5jZSA+IDAgPyBxdWVyeS5zaW5jZSA6IDA7XG4gICAgICBjb25zdCBiZWZvcmUgPSBxdWVyeS5iZWZvcmUgPiAwID8gcXVlcnkuYmVmb3JlIDogTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XG4gICAgICBjb25zdCBsaW1pdCA9IHF1ZXJ5LmxpbWl0IHwgMDtcblxuICAgICAgY29uc3QgcmVzdWx0ID0gW107XG4gICAgICBjb25zdCByYW5nZSA9IElEQktleVJhbmdlLmJvdW5kKFt0b3BpY05hbWUsIHNpbmNlXSwgW3RvcGljTmFtZSwgYmVmb3JlXSwgZmFsc2UsIHRydWUpO1xuICAgICAgY29uc3QgdHJ4ID0gdGhpcy5kYi50cmFuc2FjdGlvbihbJ21lc3NhZ2UnXSk7XG4gICAgICB0cngub25lcnJvciA9IChldmVudCkgPT4ge1xuICAgICAgICB0aGlzLiNsb2dnZXIoJ1BDYWNoZScsICdyZWFkTWVzc2FnZXMnLCBldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgICByZWplY3QoZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgIH07XG4gICAgICAvLyBJdGVyYXRlIGluIGRlc2NlbmRpbmcgb3JkZXIuXG4gICAgICB0cngub2JqZWN0U3RvcmUoJ21lc3NhZ2UnKS5vcGVuQ3Vyc29yKHJhbmdlLCAncHJldicpLm9uc3VjY2VzcyA9IChldmVudCkgPT4ge1xuICAgICAgICBjb25zdCBjdXJzb3IgPSBldmVudC50YXJnZXQucmVzdWx0O1xuICAgICAgICBpZiAoY3Vyc29yKSB7XG4gICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBjYWxsYmFjay5jYWxsKGNvbnRleHQsIGN1cnNvci52YWx1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJlc3VsdC5wdXNoKGN1cnNvci52YWx1ZSk7XG4gICAgICAgICAgaWYgKGxpbWl0IDw9IDAgfHwgcmVzdWx0Lmxlbmd0aCA8IGxpbWl0KSB7XG4gICAgICAgICAgICBjdXJzb3IuY29udGludWUoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICAvLyBQcml2YXRlIG1ldGhvZHMuXG5cbiAgLy8gU2VyaWFsaXphYmxlIHRvcGljIGZpZWxkcy5cbiAgc3RhdGljICN0b3BpY19maWVsZHMgPSBbJ2NyZWF0ZWQnLCAndXBkYXRlZCcsICdkZWxldGVkJywgJ3JlYWQnLCAncmVjdicsICdzZXEnLCAnY2xlYXInLCAnZGVmYWNzJyxcbiAgICAnY3JlZHMnLCAncHVibGljJywgJ3RydXN0ZWQnLCAncHJpdmF0ZScsICd0b3VjaGVkJywgJ19kZWxldGVkJ1xuICBdO1xuXG4gIC8vIENvcHkgZGF0YSBmcm9tIHNyYyB0byBUb3BpYyBvYmplY3QuXG4gIHN0YXRpYyAjZGVzZXJpYWxpemVUb3BpYyh0b3BpYywgc3JjKSB7XG4gICAgREIuI3RvcGljX2ZpZWxkcy5mb3JFYWNoKChmKSA9PiB7XG4gICAgICBpZiAoc3JjLmhhc093blByb3BlcnR5KGYpKSB7XG4gICAgICAgIHRvcGljW2ZdID0gc3JjW2ZdO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChBcnJheS5pc0FycmF5KHNyYy50YWdzKSkge1xuICAgICAgdG9waWMuX3RhZ3MgPSBzcmMudGFncztcbiAgICB9XG4gICAgaWYgKHNyYy5hY3MpIHtcbiAgICAgIHRvcGljLnNldEFjY2Vzc01vZGUoc3JjLmFjcyk7XG4gICAgfVxuICAgIHRvcGljLnNlcSB8PSAwO1xuICAgIHRvcGljLnJlYWQgfD0gMDtcbiAgICB0b3BpYy51bnJlYWQgPSBNYXRoLm1heCgwLCB0b3BpYy5zZXEgLSB0b3BpYy5yZWFkKTtcbiAgfVxuXG4gIC8vIENvcHkgdmFsdWVzIGZyb20gJ3NyYycgdG8gJ2RzdCcuIEFsbG9jYXRlIGRzdCBpZiBpdCdzIG51bGwgb3IgdW5kZWZpbmVkLlxuICBzdGF0aWMgI3NlcmlhbGl6ZVRvcGljKGRzdCwgc3JjKSB7XG4gICAgY29uc3QgcmVzID0gZHN0IHx8IHtcbiAgICAgIG5hbWU6IHNyYy5uYW1lXG4gICAgfTtcbiAgICBEQi4jdG9waWNfZmllbGRzLmZvckVhY2goKGYpID0+IHtcbiAgICAgIGlmIChzcmMuaGFzT3duUHJvcGVydHkoZikpIHtcbiAgICAgICAgcmVzW2ZdID0gc3JjW2ZdO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChBcnJheS5pc0FycmF5KHNyYy5fdGFncykpIHtcbiAgICAgIHJlcy50YWdzID0gc3JjLl90YWdzO1xuICAgIH1cbiAgICBpZiAoc3JjLmFjcykge1xuICAgICAgcmVzLmFjcyA9IHNyYy5nZXRBY2Nlc3NNb2RlKCkuanNvbkhlbHBlcigpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzO1xuICB9XG5cbiAgc3RhdGljICNzZXJpYWxpemVTdWJzY3JpcHRpb24oZHN0LCB0b3BpY05hbWUsIHVpZCwgc3ViKSB7XG4gICAgY29uc3QgZmllbGRzID0gWyd1cGRhdGVkJywgJ21vZGUnLCAncmVhZCcsICdyZWN2JywgJ2NsZWFyJywgJ2xhc3RTZWVuJywgJ3VzZXJBZ2VudCddO1xuICAgIGNvbnN0IHJlcyA9IGRzdCB8fCB7XG4gICAgICB0b3BpYzogdG9waWNOYW1lLFxuICAgICAgdWlkOiB1aWRcbiAgICB9O1xuXG4gICAgZmllbGRzLmZvckVhY2goKGYpID0+IHtcbiAgICAgIGlmIChzdWIuaGFzT3duUHJvcGVydHkoZikpIHtcbiAgICAgICAgcmVzW2ZdID0gc3ViW2ZdO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlcztcbiAgfVxuXG4gIHN0YXRpYyAjc2VyaWFsaXplTWVzc2FnZShkc3QsIG1zZykge1xuICAgIC8vIFNlcmlhbGl6YWJsZSBmaWVsZHMuXG4gICAgY29uc3QgZmllbGRzID0gWyd0b3BpYycsICdzZXEnLCAndHMnLCAnX3N0YXR1cycsICdmcm9tJywgJ2hlYWQnLCAnY29udGVudCddO1xuICAgIGNvbnN0IHJlcyA9IGRzdCB8fCB7fTtcbiAgICBmaWVsZHMuZm9yRWFjaCgoZikgPT4ge1xuICAgICAgaWYgKG1zZy5oYXNPd25Qcm9wZXJ0eShmKSkge1xuICAgICAgICByZXNbZl0gPSBtc2dbZl07XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlcztcbiAgfVxuXG4gIC8qKlxuICAgKiBUbyB1c2UgREIgaW4gYSBub24gYnJvd3NlciBjb250ZXh0LCBzdXBwbHkgaW5kZXhlZERCIHByb3ZpZGVyLlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJvZiBEQlxuICAgKiBAcGFyYW0gaWRiUHJvdmlkZXIgaW5kZXhlZERCIHByb3ZpZGVyLCBlLmcuIGZvciBub2RlIDxjb2RlPnJlcXVpcmUoJ2Zha2UtaW5kZXhlZGRiJyk8L2NvZGU+LlxuICAgKi9cbiAgc3RhdGljIHNldERhdGFiYXNlUHJvdmlkZXIoaWRiUHJvdmlkZXIpIHtcbiAgICBJREJQcm92aWRlciA9IGlkYlByb3ZpZGVyO1xuICB9XG59XG4iLCIvKipcbiAqIEBjb3B5cmlnaHQgMjAxNS0yMDIyIFRpbm9kZSBMTEMuXG4gKiBAc3VtbWFyeSBNaW5pbWFsbHkgcmljaCB0ZXh0IHJlcHJlc2VudGF0aW9uIGFuZCBmb3JtYXR0aW5nIGZvciBUaW5vZGUuXG4gKiBAbGljZW5zZSBBcGFjaGUgMi4wXG4gKlxuICogQGZpbGUgQmFzaWMgcGFyc2VyIGFuZCBmb3JtYXR0ZXIgZm9yIHZlcnkgc2ltcGxlIHRleHQgbWFya3VwLiBNb3N0bHkgdGFyZ2V0ZWQgYXRcbiAqIG1vYmlsZSB1c2UgY2FzZXMgc2ltaWxhciB0byBUZWxlZ3JhbSwgV2hhdHNBcHAsIGFuZCBGQiBNZXNzZW5nZXIuXG4gKlxuICogPHA+U3VwcG9ydHMgY29udmVyc2lvbiBvZiB1c2VyIGtleWJvYXJkIGlucHV0IHRvIGZvcm1hdHRlZCB0ZXh0OjwvcD5cbiAqIDx1bD5cbiAqICAgPGxpPiphYmMqICZyYXJyOyA8Yj5hYmM8L2I+PC9saT5cbiAqICAgPGxpPl9hYmNfICZyYXJyOyA8aT5hYmM8L2k+PC9saT5cbiAqICAgPGxpPn5hYmN+ICZyYXJyOyA8ZGVsPmFiYzwvZGVsPjwvbGk+XG4gKiAgIDxsaT5gYWJjYCAmcmFycjsgPHR0PmFiYzwvdHQ+PC9saT5cbiAqIDwvdWw+XG4gKiBBbHNvIHN1cHBvcnRzIGZvcm1zIGFuZCBidXR0b25zLlxuICpcbiAqIE5lc3RlZCBmb3JtYXR0aW5nIGlzIHN1cHBvcnRlZCwgZS5nLiAqYWJjIF9kZWZfKiAtPiA8Yj5hYmMgPGk+ZGVmPC9pPjwvYj5cbiAqIFVSTHMsIEBtZW50aW9ucywgYW5kICNoYXNodGFncyBhcmUgZXh0cmFjdGVkIGFuZCBjb252ZXJ0ZWQgaW50byBsaW5rcy5cbiAqIEZvcm1zIGFuZCBidXR0b25zIGNhbiBiZSBhZGRlZCBwcm9jZWR1cmFsbHkuXG4gKiBKU09OIGRhdGEgcmVwcmVzZW50YXRpb24gaXMgaW5zcGlyZWQgYnkgRHJhZnQuanMgcmF3IGZvcm1hdHRpbmcuXG4gKlxuICpcbiAqIEBleGFtcGxlXG4gKiBUZXh0OlxuICogPHByZT5cbiAqICAgICB0aGlzIGlzICpib2xkKiwgYGNvZGVgIGFuZCBfaXRhbGljXywgfnN0cmlrZX5cbiAqICAgICBjb21iaW5lZCAqYm9sZCBhbmQgX2l0YWxpY18qXG4gKiAgICAgYW4gdXJsOiBodHRwczovL3d3dy5leGFtcGxlLmNvbS9hYmMjZnJhZ21lbnQgYW5kIGFub3RoZXIgX3d3dy50aW5vZGUuY29fXG4gKiAgICAgdGhpcyBpcyBhIEBtZW50aW9uIGFuZCBhICNoYXNodGFnIGluIGEgc3RyaW5nXG4gKiAgICAgc2Vjb25kICNoYXNodGFnXG4gKiA8L3ByZT5cbiAqXG4gKiAgU2FtcGxlIEpTT04gcmVwcmVzZW50YXRpb24gb2YgdGhlIHRleHQgYWJvdmU6XG4gKiAge1xuICogICAgIFwidHh0XCI6IFwidGhpcyBpcyBib2xkLCBjb2RlIGFuZCBpdGFsaWMsIHN0cmlrZSBjb21iaW5lZCBib2xkIGFuZCBpdGFsaWMgYW4gdXJsOiBodHRwczovL3d3dy5leGFtcGxlLmNvbS9hYmMjZnJhZ21lbnQgXCIgK1xuICogICAgICAgICAgICAgXCJhbmQgYW5vdGhlciB3d3cudGlub2RlLmNvIHRoaXMgaXMgYSBAbWVudGlvbiBhbmQgYSAjaGFzaHRhZyBpbiBhIHN0cmluZyBzZWNvbmQgI2hhc2h0YWdcIixcbiAqICAgICBcImZtdFwiOiBbXG4gKiAgICAgICAgIHsgXCJhdFwiOjgsIFwibGVuXCI6NCxcInRwXCI6XCJTVFwiIH0seyBcImF0XCI6MTQsIFwibGVuXCI6NCwgXCJ0cFwiOlwiQ09cIiB9LHsgXCJhdFwiOjIzLCBcImxlblwiOjYsIFwidHBcIjpcIkVNXCJ9LFxuICogICAgICAgICB7IFwiYXRcIjozMSwgXCJsZW5cIjo2LCBcInRwXCI6XCJETFwiIH0seyBcInRwXCI6XCJCUlwiLCBcImxlblwiOjEsIFwiYXRcIjozNyB9LHsgXCJhdFwiOjU2LCBcImxlblwiOjYsIFwidHBcIjpcIkVNXCIgfSxcbiAqICAgICAgICAgeyBcImF0XCI6NDcsIFwibGVuXCI6MTUsIFwidHBcIjpcIlNUXCIgfSx7IFwidHBcIjpcIkJSXCIsIFwibGVuXCI6MSwgXCJhdFwiOjYyIH0seyBcImF0XCI6MTIwLCBcImxlblwiOjEzLCBcInRwXCI6XCJFTVwiIH0sXG4gKiAgICAgICAgIHsgXCJhdFwiOjcxLCBcImxlblwiOjM2LCBcImtleVwiOjAgfSx7IFwiYXRcIjoxMjAsIFwibGVuXCI6MTMsIFwia2V5XCI6MSB9LHsgXCJ0cFwiOlwiQlJcIiwgXCJsZW5cIjoxLCBcImF0XCI6MTMzIH0sXG4gKiAgICAgICAgIHsgXCJhdFwiOjE0NCwgXCJsZW5cIjo4LCBcImtleVwiOjIgfSx7IFwiYXRcIjoxNTksIFwibGVuXCI6OCwgXCJrZXlcIjozIH0seyBcInRwXCI6XCJCUlwiLCBcImxlblwiOjEsIFwiYXRcIjoxNzkgfSxcbiAqICAgICAgICAgeyBcImF0XCI6MTg3LCBcImxlblwiOjgsIFwia2V5XCI6MyB9LHsgXCJ0cFwiOlwiQlJcIiwgXCJsZW5cIjoxLCBcImF0XCI6MTk1IH1cbiAqICAgICBdLFxuICogICAgIFwiZW50XCI6IFtcbiAqICAgICAgICAgeyBcInRwXCI6XCJMTlwiLCBcImRhdGFcIjp7IFwidXJsXCI6XCJodHRwczovL3d3dy5leGFtcGxlLmNvbS9hYmMjZnJhZ21lbnRcIiB9IH0sXG4gKiAgICAgICAgIHsgXCJ0cFwiOlwiTE5cIiwgXCJkYXRhXCI6eyBcInVybFwiOlwiaHR0cDovL3d3dy50aW5vZGUuY29cIiB9IH0sXG4gKiAgICAgICAgIHsgXCJ0cFwiOlwiTU5cIiwgXCJkYXRhXCI6eyBcInZhbFwiOlwibWVudGlvblwiIH0gfSxcbiAqICAgICAgICAgeyBcInRwXCI6XCJIVFwiLCBcImRhdGFcIjp7IFwidmFsXCI6XCJoYXNodGFnXCIgfSB9XG4gKiAgICAgXVxuICogIH1cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8vIE5PVEUgVE8gREVWRUxPUEVSUzpcbi8vIExvY2FsaXphYmxlIHN0cmluZ3Mgc2hvdWxkIGJlIGRvdWJsZSBxdW90ZWQgXCLRgdGC0YDQvtC60LAg0L3QsCDQtNGA0YPQs9C+0Lwg0Y/Qt9GL0LrQtVwiLFxuLy8gbm9uLWxvY2FsaXphYmxlIHN0cmluZ3Mgc2hvdWxkIGJlIHNpbmdsZSBxdW90ZWQgJ25vbi1sb2NhbGl6ZWQnLlxuXG5jb25zdCBNQVhfRk9STV9FTEVNRU5UUyA9IDg7XG5jb25zdCBNQVhfUFJFVklFV19BVFRBQ0hNRU5UUyA9IDM7XG5jb25zdCBNQVhfUFJFVklFV19EQVRBX1NJWkUgPSA2NDtcbmNvbnN0IEpTT05fTUlNRV9UWVBFID0gJ2FwcGxpY2F0aW9uL2pzb24nO1xuY29uc3QgRFJBRlRZX01JTUVfVFlQRSA9ICd0ZXh0L3gtZHJhZnR5JztcbmNvbnN0IEFMTE9XRURfRU5UX0ZJRUxEUyA9IFsnYWN0JywgJ2hlaWdodCcsICdkdXJhdGlvbicsICdpbmNvbWluZycsICdtaW1lJywgJ25hbWUnLCAncHJlbWltZScsICdwcmVyZWYnLCAncHJldmlldycsXG4gICdyZWYnLCAnc2l6ZScsICdzdGF0ZScsICd1cmwnLCAndmFsJywgJ3dpZHRoJ1xuXTtcblxuLy8gUmVndWxhciBleHByZXNzaW9ucyBmb3IgcGFyc2luZyBpbmxpbmUgZm9ybWF0cy4gSmF2YXNjcmlwdCBkb2VzIG5vdCBzdXBwb3J0IGxvb2tiZWhpbmQsXG4vLyBzbyBpdCdzIGEgYml0IG1lc3N5LlxuY29uc3QgSU5MSU5FX1NUWUxFUyA9IFtcbiAgLy8gU3Ryb25nID0gYm9sZCwgKmJvbGQgdGV4dCpcbiAge1xuICAgIG5hbWU6ICdTVCcsXG4gICAgc3RhcnQ6IC8oPzpefFtcXFdfXSkoXFwqKVteXFxzKl0vLFxuICAgIGVuZDogL1teXFxzKl0oXFwqKSg/PSR8W1xcV19dKS9cbiAgfSxcbiAgLy8gRW1waGVzaXplZCA9IGl0YWxpYywgX2l0YWxpYyB0ZXh0X1xuICB7XG4gICAgbmFtZTogJ0VNJyxcbiAgICBzdGFydDogLyg/Ol58XFxXKShfKVteXFxzX10vLFxuICAgIGVuZDogL1teXFxzX10oXykoPz0kfFxcVykvXG4gIH0sXG4gIC8vIERlbGV0ZWQsIH5zdHJpa2UgdGhpcyB0aG91Z2h+XG4gIHtcbiAgICBuYW1lOiAnREwnLFxuICAgIHN0YXJ0OiAvKD86XnxbXFxXX10pKH4pW15cXHN+XS8sXG4gICAgZW5kOiAvW15cXHN+XSh+KSg/PSR8W1xcV19dKS9cbiAgfSxcbiAgLy8gQ29kZSBibG9jayBgdGhpcyBpcyBtb25vc3BhY2VgXG4gIHtcbiAgICBuYW1lOiAnQ08nLFxuICAgIHN0YXJ0OiAvKD86XnxcXFcpKGApW15gXS8sXG4gICAgZW5kOiAvW15gXShgKSg/PSR8XFxXKS9cbiAgfVxuXTtcblxuLy8gUmVsYXRpdmUgd2VpZ2h0cyBvZiBmb3JtYXR0aW5nIHNwYW5zLiBHcmVhdGVyIGluZGV4IGluIGFycmF5IG1lYW5zIGdyZWF0ZXIgd2VpZ2h0LlxuY29uc3QgRk1UX1dFSUdIVCA9IFsnUVEnXTtcblxuLy8gUmVnRXhwcyBmb3IgZW50aXR5IGV4dHJhY3Rpb24gKFJGID0gcmVmZXJlbmNlKVxuY29uc3QgRU5USVRZX1RZUEVTID0gW1xuICAvLyBVUkxzXG4gIHtcbiAgICBuYW1lOiAnTE4nLFxuICAgIGRhdGFOYW1lOiAndXJsJyxcbiAgICBwYWNrOiBmdW5jdGlvbih2YWwpIHtcbiAgICAgIC8vIENoZWNrIGlmIHRoZSBwcm90b2NvbCBpcyBzcGVjaWZpZWQsIGlmIG5vdCB1c2UgaHR0cFxuICAgICAgaWYgKCEvXlthLXpdKzpcXC9cXC8vaS50ZXN0KHZhbCkpIHtcbiAgICAgICAgdmFsID0gJ2h0dHA6Ly8nICsgdmFsO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdXJsOiB2YWxcbiAgICAgIH07XG4gICAgfSxcbiAgICByZTogLyg/Oig/Omh0dHBzP3xmdHApOlxcL1xcL3x3d3dcXC58ZnRwXFwuKVstQS1aMC05KyZAI1xcLyU9fl98JD8hOiwuXSpbQS1aMC05KyZAI1xcLyU9fl98JF0vaWdcbiAgfSxcbiAgLy8gTWVudGlvbnMgQHVzZXIgKG11c3QgYmUgMiBvciBtb3JlIGNoYXJhY3RlcnMpXG4gIHtcbiAgICBuYW1lOiAnTU4nLFxuICAgIGRhdGFOYW1lOiAndmFsJyxcbiAgICBwYWNrOiBmdW5jdGlvbih2YWwpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHZhbDogdmFsLnNsaWNlKDEpXG4gICAgICB9O1xuICAgIH0sXG4gICAgcmU6IC9cXEJAKFtcXHB7TH1cXHB7Tn1dWy5fXFxwe0x9XFxwe059XSpbXFxwe0x9XFxwe059XSkvdWdcbiAgfSxcbiAgLy8gSGFzaHRhZ3MgI2hhc2h0YWcsIGxpa2UgbWV0aW9uIDIgb3IgbW9yZSBjaGFyYWN0ZXJzLlxuICB7XG4gICAgbmFtZTogJ0hUJyxcbiAgICBkYXRhTmFtZTogJ3ZhbCcsXG4gICAgcGFjazogZnVuY3Rpb24odmFsKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB2YWw6IHZhbC5zbGljZSgxKVxuICAgICAgfTtcbiAgICB9LFxuICAgIHJlOiAvXFxCIyhbXFxwe0x9XFxwe059XVsuX1xccHtMfVxccHtOfV0qW1xccHtMfVxccHtOfV0pL3VnXG4gIH1cbl07XG5cbi8vIEhUTUwgdGFnIG5hbWUgc3VnZ2VzdGlvbnNcbmNvbnN0IEZPUk1BVF9UQUdTID0ge1xuICBBVToge1xuICAgIGh0bWxfdGFnOiAnYXVkaW8nLFxuICAgIG1kX3RhZzogdW5kZWZpbmVkLFxuICAgIGlzVm9pZDogZmFsc2VcbiAgfSxcbiAgQk46IHtcbiAgICBodG1sX3RhZzogJ2J1dHRvbicsXG4gICAgbWRfdGFnOiB1bmRlZmluZWQsXG4gICAgaXNWb2lkOiBmYWxzZVxuICB9LFxuICBCUjoge1xuICAgIGh0bWxfdGFnOiAnYnInLFxuICAgIG1kX3RhZzogJ1xcbicsXG4gICAgaXNWb2lkOiB0cnVlXG4gIH0sXG4gIENPOiB7XG4gICAgaHRtbF90YWc6ICd0dCcsXG4gICAgbWRfdGFnOiAnYCcsXG4gICAgaXNWb2lkOiBmYWxzZVxuICB9LFxuICBETDoge1xuICAgIGh0bWxfdGFnOiAnZGVsJyxcbiAgICBtZF90YWc6ICd+JyxcbiAgICBpc1ZvaWQ6IGZhbHNlXG4gIH0sXG4gIEVNOiB7XG4gICAgaHRtbF90YWc6ICdpJyxcbiAgICBtZF90YWc6ICdfJyxcbiAgICBpc1ZvaWQ6IGZhbHNlXG4gIH0sXG4gIEVYOiB7XG4gICAgaHRtbF90YWc6ICcnLFxuICAgIG1kX3RhZzogdW5kZWZpbmVkLFxuICAgIGlzVm9pZDogdHJ1ZVxuICB9LFxuICBGTToge1xuICAgIGh0bWxfdGFnOiAnZGl2JyxcbiAgICBtZF90YWc6IHVuZGVmaW5lZCxcbiAgICBpc1ZvaWQ6IGZhbHNlXG4gIH0sXG4gIEhEOiB7XG4gICAgaHRtbF90YWc6ICcnLFxuICAgIG1kX3RhZzogdW5kZWZpbmVkLFxuICAgIGlzVm9pZDogZmFsc2VcbiAgfSxcbiAgSEw6IHtcbiAgICBodG1sX3RhZzogJ3NwYW4nLFxuICAgIG1kX3RhZzogdW5kZWZpbmVkLFxuICAgIGlzVm9pZDogZmFsc2VcbiAgfSxcbiAgSFQ6IHtcbiAgICBodG1sX3RhZzogJ2EnLFxuICAgIG1kX3RhZzogdW5kZWZpbmVkLFxuICAgIGlzVm9pZDogZmFsc2VcbiAgfSxcbiAgSU06IHtcbiAgICBodG1sX3RhZzogJ2ltZycsXG4gICAgbWRfdGFnOiB1bmRlZmluZWQsXG4gICAgaXNWb2lkOiBmYWxzZVxuICB9LFxuICBMTjoge1xuICAgIGh0bWxfdGFnOiAnYScsXG4gICAgbWRfdGFnOiB1bmRlZmluZWQsXG4gICAgaXNWb2lkOiBmYWxzZVxuICB9LFxuICBNTjoge1xuICAgIGh0bWxfdGFnOiAnYScsXG4gICAgbWRfdGFnOiB1bmRlZmluZWQsXG4gICAgaXNWb2lkOiBmYWxzZVxuICB9LFxuICBSVzoge1xuICAgIGh0bWxfdGFnOiAnZGl2JyxcbiAgICBtZF90YWc6IHVuZGVmaW5lZCxcbiAgICBpc1ZvaWQ6IGZhbHNlLFxuICB9LFxuICBRUToge1xuICAgIGh0bWxfdGFnOiAnZGl2JyxcbiAgICBtZF90YWc6IHVuZGVmaW5lZCxcbiAgICBpc1ZvaWQ6IGZhbHNlXG4gIH0sXG4gIFNUOiB7XG4gICAgaHRtbF90YWc6ICdiJyxcbiAgICBtZF90YWc6ICcqJyxcbiAgICBpc1ZvaWQ6IGZhbHNlXG4gIH0sXG4gIFZDOiB7XG4gICAgaHRtbF90YWc6ICdkaXYnLFxuICAgIG1kX3RhZzogdW5kZWZpbmVkLFxuICAgIGlzVm9pZDogZmFsc2VcbiAgfSxcbiAgVkQ6IHtcbiAgICBodG1sX3RhZzogJ3ZpZGVvJyxcbiAgICBtZF90YWc6IHVuZGVmaW5lZCxcbiAgICBpc1ZvaWQ6IGZhbHNlXG4gIH1cbn07XG5cbi8vIENvbnZlcnQgYmFzZTY0LWVuY29kZWQgc3RyaW5nIGludG8gQmxvYi5cbmZ1bmN0aW9uIGJhc2U2NHRvT2JqZWN0VXJsKGI2NCwgY29udGVudFR5cGUsIGxvZ2dlcikge1xuICBpZiAoIWI2NCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgdHJ5IHtcbiAgICBjb25zdCBiaW4gPSBhdG9iKGI2NCk7XG4gICAgY29uc3QgbGVuZ3RoID0gYmluLmxlbmd0aDtcbiAgICBjb25zdCBidWYgPSBuZXcgQXJyYXlCdWZmZXIobGVuZ3RoKTtcbiAgICBjb25zdCBhcnIgPSBuZXcgVWludDhBcnJheShidWYpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGFycltpXSA9IGJpbi5jaGFyQ29kZUF0KGkpO1xuICAgIH1cblxuICAgIHJldHVybiBVUkwuY3JlYXRlT2JqZWN0VVJMKG5ldyBCbG9iKFtidWZdLCB7XG4gICAgICB0eXBlOiBjb250ZW50VHlwZVxuICAgIH0pKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgaWYgKGxvZ2dlcikge1xuICAgICAgbG9nZ2VyKFwiRHJhZnR5OiBmYWlsZWQgdG8gY29udmVydCBvYmplY3QuXCIsIGVyci5tZXNzYWdlKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cblxuZnVuY3Rpb24gYmFzZTY0dG9EYXRhVXJsKGI2NCwgY29udGVudFR5cGUpIHtcbiAgaWYgKCFiNjQpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBjb250ZW50VHlwZSA9IGNvbnRlbnRUeXBlIHx8ICdpbWFnZS9qcGVnJztcbiAgcmV0dXJuICdkYXRhOicgKyBjb250ZW50VHlwZSArICc7YmFzZTY0LCcgKyBiNjQ7XG59XG5cbi8vIEhlbHBlcnMgZm9yIGNvbnZlcnRpbmcgRHJhZnR5IHRvIEhUTUwuXG5jb25zdCBERUNPUkFUT1JTID0ge1xuICAvLyBWaXNpYWwgc3R5bGVzXG4gIFNUOiB7XG4gICAgb3BlbjogXyA9PiAnPGI+JyxcbiAgICBjbG9zZTogXyA9PiAnPC9iPidcbiAgfSxcbiAgRU06IHtcbiAgICBvcGVuOiBfID0+ICc8aT4nLFxuICAgIGNsb3NlOiBfID0+ICc8L2k+J1xuICB9LFxuICBETDoge1xuICAgIG9wZW46IF8gPT4gJzxkZWw+JyxcbiAgICBjbG9zZTogXyA9PiAnPC9kZWw+J1xuICB9LFxuICBDTzoge1xuICAgIG9wZW46IF8gPT4gJzx0dD4nLFxuICAgIGNsb3NlOiBfID0+ICc8L3R0PidcbiAgfSxcbiAgLy8gTGluZSBicmVha1xuICBCUjoge1xuICAgIG9wZW46IF8gPT4gJzxici8+JyxcbiAgICBjbG9zZTogXyA9PiAnJ1xuICB9LFxuICAvLyBIaWRkZW4gZWxlbWVudFxuICBIRDoge1xuICAgIG9wZW46IF8gPT4gJycsXG4gICAgY2xvc2U6IF8gPT4gJydcbiAgfSxcbiAgLy8gSGlnaGxpZ2h0ZWQgZWxlbWVudC5cbiAgSEw6IHtcbiAgICBvcGVuOiBfID0+ICc8c3BhbiBzdHlsZT1cImNvbG9yOnRlYWxcIj4nLFxuICAgIGNsb3NlOiBfID0+ICc8L3NwYW4+J1xuICB9LFxuICAvLyBMaW5rIChVUkwpXG4gIExOOiB7XG4gICAgb3BlbjogKGRhdGEpID0+IHtcbiAgICAgIHJldHVybiAnPGEgaHJlZj1cIicgKyBkYXRhLnVybCArICdcIj4nO1xuICAgIH0sXG4gICAgY2xvc2U6IF8gPT4gJzwvYT4nLFxuICAgIHByb3BzOiAoZGF0YSkgPT4ge1xuICAgICAgcmV0dXJuIGRhdGEgPyB7XG4gICAgICAgIGhyZWY6IGRhdGEudXJsLFxuICAgICAgICB0YXJnZXQ6ICdfYmxhbmsnXG4gICAgICB9IDogbnVsbDtcbiAgICB9LFxuICB9LFxuICAvLyBNZW50aW9uXG4gIE1OOiB7XG4gICAgb3BlbjogKGRhdGEpID0+IHtcbiAgICAgIHJldHVybiAnPGEgaHJlZj1cIiMnICsgZGF0YS52YWwgKyAnXCI+JztcbiAgICB9LFxuICAgIGNsb3NlOiBfID0+ICc8L2E+JyxcbiAgICBwcm9wczogKGRhdGEpID0+IHtcbiAgICAgIHJldHVybiBkYXRhID8ge1xuICAgICAgICBpZDogZGF0YS52YWxcbiAgICAgIH0gOiBudWxsO1xuICAgIH0sXG4gIH0sXG4gIC8vIEhhc2h0YWdcbiAgSFQ6IHtcbiAgICBvcGVuOiAoZGF0YSkgPT4ge1xuICAgICAgcmV0dXJuICc8YSBocmVmPVwiIycgKyBkYXRhLnZhbCArICdcIj4nO1xuICAgIH0sXG4gICAgY2xvc2U6IF8gPT4gJzwvYT4nLFxuICAgIHByb3BzOiAoZGF0YSkgPT4ge1xuICAgICAgcmV0dXJuIGRhdGEgPyB7XG4gICAgICAgIGlkOiBkYXRhLnZhbFxuICAgICAgfSA6IG51bGw7XG4gICAgfSxcbiAgfSxcbiAgLy8gQnV0dG9uXG4gIEJOOiB7XG4gICAgb3BlbjogXyA9PiAnPGJ1dHRvbj4nLFxuICAgIGNsb3NlOiBfID0+ICc8L2J1dHRvbj4nLFxuICAgIHByb3BzOiAoZGF0YSkgPT4ge1xuICAgICAgcmV0dXJuIGRhdGEgPyB7XG4gICAgICAgICdkYXRhLWFjdCc6IGRhdGEuYWN0LFxuICAgICAgICAnZGF0YS12YWwnOiBkYXRhLnZhbCxcbiAgICAgICAgJ2RhdGEtbmFtZSc6IGRhdGEubmFtZSxcbiAgICAgICAgJ2RhdGEtcmVmJzogZGF0YS5yZWZcbiAgICAgIH0gOiBudWxsO1xuICAgIH0sXG4gIH0sXG4gIC8vIEF1ZGlvIHJlY29yZGluZ1xuICBBVToge1xuICAgIG9wZW46IChkYXRhKSA9PiB7XG4gICAgICBjb25zdCB1cmwgPSBkYXRhLnJlZiB8fCBiYXNlNjR0b09iamVjdFVybChkYXRhLnZhbCwgZGF0YS5taW1lLCBEcmFmdHkubG9nZ2VyKTtcbiAgICAgIHJldHVybiAnPGF1ZGlvIGNvbnRyb2xzIHNyYz1cIicgKyB1cmwgKyAnXCI+JztcbiAgICB9LFxuICAgIGNsb3NlOiBfID0+ICc8L2F1ZGlvPicsXG4gICAgcHJvcHM6IChkYXRhKSA9PiB7XG4gICAgICBpZiAoIWRhdGEpIHJldHVybiBudWxsO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLy8gRW1iZWRkZWQgZGF0YSBvciBleHRlcm5hbCBsaW5rLlxuICAgICAgICBzcmM6IGRhdGEucmVmIHx8IGJhc2U2NHRvT2JqZWN0VXJsKGRhdGEudmFsLCBkYXRhLm1pbWUsIERyYWZ0eS5sb2dnZXIpLFxuICAgICAgICAnZGF0YS1wcmVsb2FkJzogZGF0YS5yZWYgPyAnbWV0YWRhdGEnIDogJ2F1dG8nLFxuICAgICAgICAnZGF0YS1kdXJhdGlvbic6IGRhdGEuZHVyYXRpb24sXG4gICAgICAgICdkYXRhLW5hbWUnOiBkYXRhLm5hbWUsXG4gICAgICAgICdkYXRhLXNpemUnOiBkYXRhLnZhbCA/ICgoZGF0YS52YWwubGVuZ3RoICogMC43NSkgfCAwKSA6IChkYXRhLnNpemUgfCAwKSxcbiAgICAgICAgJ2RhdGEtbWltZSc6IGRhdGEubWltZSxcbiAgICAgIH07XG4gICAgfVxuICB9LFxuICAvLyBJbWFnZVxuICBJTToge1xuICAgIG9wZW46IGRhdGEgPT4ge1xuICAgICAgLy8gRG9uJ3QgdXNlIGRhdGEucmVmIGZvciBwcmV2aWV3OiBpdCdzIGEgc2VjdXJpdHkgcmlzay5cbiAgICAgIGNvbnN0IHRtcFByZXZpZXdVcmwgPSBiYXNlNjR0b0RhdGFVcmwoZGF0YS5fdGVtcFByZXZpZXcsIGRhdGEubWltZSk7XG4gICAgICBjb25zdCBwcmV2aWV3VXJsID0gYmFzZTY0dG9PYmplY3RVcmwoZGF0YS52YWwsIGRhdGEubWltZSwgRHJhZnR5LmxvZ2dlcik7XG4gICAgICBjb25zdCBkb3dubG9hZFVybCA9IGRhdGEucmVmIHx8IHByZXZpZXdVcmw7XG4gICAgICByZXR1cm4gKGRhdGEubmFtZSA/ICc8YSBocmVmPVwiJyArIGRvd25sb2FkVXJsICsgJ1wiIGRvd25sb2FkPVwiJyArIGRhdGEubmFtZSArICdcIj4nIDogJycpICtcbiAgICAgICAgJzxpbWcgc3JjPVwiJyArICh0bXBQcmV2aWV3VXJsIHx8IHByZXZpZXdVcmwpICsgJ1wiJyArXG4gICAgICAgIChkYXRhLndpZHRoID8gJyB3aWR0aD1cIicgKyBkYXRhLndpZHRoICsgJ1wiJyA6ICcnKSArXG4gICAgICAgIChkYXRhLmhlaWdodCA/ICcgaGVpZ2h0PVwiJyArIGRhdGEuaGVpZ2h0ICsgJ1wiJyA6ICcnKSArICcgYm9yZGVyPVwiMFwiIC8+JztcbiAgICB9LFxuICAgIGNsb3NlOiBkYXRhID0+IHtcbiAgICAgIHJldHVybiAoZGF0YS5uYW1lID8gJzwvYT4nIDogJycpO1xuICAgIH0sXG4gICAgcHJvcHM6IGRhdGEgPT4ge1xuICAgICAgaWYgKCFkYXRhKSByZXR1cm4gbnVsbDtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC8vIFRlbXBvcmFyeSBwcmV2aWV3LCBvciBwZXJtYW5lbnQgcHJldmlldywgb3IgZXh0ZXJuYWwgbGluay5cbiAgICAgICAgc3JjOiBiYXNlNjR0b0RhdGFVcmwoZGF0YS5fdGVtcFByZXZpZXcsIGRhdGEubWltZSkgfHxcbiAgICAgICAgICBkYXRhLnJlZiB8fCBiYXNlNjR0b09iamVjdFVybChkYXRhLnZhbCwgZGF0YS5taW1lLCBEcmFmdHkubG9nZ2VyKSxcbiAgICAgICAgdGl0bGU6IGRhdGEubmFtZSxcbiAgICAgICAgYWx0OiBkYXRhLm5hbWUsXG4gICAgICAgICdkYXRhLXdpZHRoJzogZGF0YS53aWR0aCxcbiAgICAgICAgJ2RhdGEtaGVpZ2h0JzogZGF0YS5oZWlnaHQsXG4gICAgICAgICdkYXRhLW5hbWUnOiBkYXRhLm5hbWUsXG4gICAgICAgICdkYXRhLXNpemUnOiBkYXRhLnZhbCA/ICgoZGF0YS52YWwubGVuZ3RoICogMC43NSkgfCAwKSA6IChkYXRhLnNpemUgfCAwKSxcbiAgICAgICAgJ2RhdGEtbWltZSc6IGRhdGEubWltZSxcbiAgICAgIH07XG4gICAgfSxcbiAgfSxcbiAgLy8gRm9ybSAtIHN0cnVjdHVyZWQgbGF5b3V0IG9mIGVsZW1lbnRzLlxuICBGTToge1xuICAgIG9wZW46IF8gPT4gJzxkaXY+JyxcbiAgICBjbG9zZTogXyA9PiAnPC9kaXY+J1xuICB9LFxuICAvLyBSb3c6IGxvZ2ljIGdyb3VwaW5nIG9mIGVsZW1lbnRzXG4gIFJXOiB7XG4gICAgb3BlbjogXyA9PiAnPGRpdj4nLFxuICAgIGNsb3NlOiBfID0+ICc8L2Rpdj4nXG4gIH0sXG4gIC8vIFF1b3RlZCBibG9jay5cbiAgUVE6IHtcbiAgICBvcGVuOiBfID0+ICc8ZGl2PicsXG4gICAgY2xvc2U6IF8gPT4gJzwvZGl2PicsXG4gICAgcHJvcHM6IChkYXRhKSA9PiB7XG4gICAgICByZXR1cm4gZGF0YSA/IHt9IDogbnVsbDtcbiAgICB9LFxuICB9LFxuICAvLyBWaWRlbyBjYWxsXG4gIFZDOiB7XG4gICAgb3BlbjogXyA9PiAnPGRpdj4nLFxuICAgIGNsb3NlOiBfID0+ICc8L2Rpdj4nLFxuICAgIHByb3BzOiBkYXRhID0+IHtcbiAgICAgIGlmICghZGF0YSkgcmV0dXJuIHt9O1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgJ2RhdGEtZHVyYXRpb24nOiBkYXRhLmR1cmF0aW9uLFxuICAgICAgICAnZGF0YS1zdGF0ZSc6IGRhdGEuc3RhdGUsXG4gICAgICB9O1xuICAgIH1cbiAgfSxcbiAgLy8gVmlkZW8uXG4gIFZEOiB7XG4gICAgb3BlbjogZGF0YSA9PiB7XG4gICAgICBjb25zdCB0bXBQcmV2aWV3VXJsID0gYmFzZTY0dG9EYXRhVXJsKGRhdGEuX3RlbXBQcmV2aWV3LCBkYXRhLm1pbWUpO1xuICAgICAgY29uc3QgcHJldmlld1VybCA9IGRhdGEucmVmIHx8IGJhc2U2NHRvT2JqZWN0VXJsKGRhdGEucHJldmlldywgZGF0YS5wcmVtaW1lIHx8ICdpbWFnZS9qc29uJywgRHJhZnR5LmxvZ2dlcik7XG4gICAgICByZXR1cm4gJzxpbWcgc3JjPVwiJyArICh0bXBQcmV2aWV3VXJsIHx8IHByZXZpZXdVcmwpICsgJ1wiJyArXG4gICAgICAgIChkYXRhLndpZHRoID8gJyB3aWR0aD1cIicgKyBkYXRhLndpZHRoICsgJ1wiJyA6ICcnKSArXG4gICAgICAgIChkYXRhLmhlaWdodCA/ICcgaGVpZ2h0PVwiJyArIGRhdGEuaGVpZ2h0ICsgJ1wiJyA6ICcnKSArICcgYm9yZGVyPVwiMFwiIC8+JztcbiAgICB9LFxuICAgIGNsb3NlOiBfID0+ICcnLFxuICAgIHByb3BzOiBkYXRhID0+IHtcbiAgICAgIGlmICghZGF0YSkgcmV0dXJuIG51bGw7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAvLyBFbWJlZGRlZCBkYXRhIG9yIGV4dGVybmFsIGxpbmsuXG4gICAgICAgIHNyYzogZGF0YS5wcmVyZWYgfHwgYmFzZTY0dG9PYmplY3RVcmwoZGF0YS5wcmV2aWV3LCBkYXRhLnByZW1pbWUgfHwgJ2ltYWdlL2pzb24nLCBEcmFmdHkubG9nZ2VyKSxcbiAgICAgICAgJ2RhdGEtc3JjJzogZGF0YS5yZWYgfHwgYmFzZTY0dG9PYmplY3RVcmwoZGF0YS52YWwsIGRhdGEubWltZSwgRHJhZnR5LmxvZ2dlciksXG4gICAgICAgICdkYXRhLXdpZHRoJzogZGF0YS53aWR0aCxcbiAgICAgICAgJ2RhdGEtaGVpZ2h0JzogZGF0YS5oZWlnaHQsXG4gICAgICAgICdkYXRhLXByZWxvYWQnOiBkYXRhLnJlZiA/ICdtZXRhZGF0YScgOiAnYXV0bycsXG4gICAgICAgICdkYXRhLXByZXZpZXcnOiBiYXNlNjR0b09iamVjdFVybChkYXRhLnByZXZpZXcsIGRhdGEucHJlbWltZSB8fCAnaW1hZ2UvanNvbicsIERyYWZ0eS5sb2dnZXIpLFxuICAgICAgICAnZGF0YS1kdXJhdGlvbic6IGRhdGEuZHVyYXRpb24gfCAwLFxuICAgICAgICAnZGF0YS1uYW1lJzogZGF0YS5uYW1lLFxuICAgICAgICAnZGF0YS1zaXplJzogZGF0YS52YWwgPyAoKGRhdGEudmFsLmxlbmd0aCAqIDAuNzUpIHwgMCkgOiAoZGF0YS5zaXplIHwgMCksXG4gICAgICAgICdkYXRhLW1pbWUnOiBkYXRhLm1pbWUsXG4gICAgICB9O1xuICAgIH1cbiAgfSxcbn07XG5cbi8qKlxuICogVGhlIG1haW4gb2JqZWN0IHdoaWNoIHBlcmZvcm1zIGFsbCB0aGUgZm9ybWF0dGluZyBhY3Rpb25zLlxuICogQGNsYXNzIERyYWZ0eVxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmNvbnN0IERyYWZ0eSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnR4dCA9ICcnO1xuICB0aGlzLmZtdCA9IFtdO1xuICB0aGlzLmVudCA9IFtdO1xufVxuXG4vKipcbiAqIEluaXRpYWxpemUgRHJhZnR5IGRvY3VtZW50IHRvIGEgcGxhaW4gdGV4dCBzdHJpbmcuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHBsYWluVGV4dCAtIHN0cmluZyB0byB1c2UgYXMgRHJhZnR5IGNvbnRlbnQuXG4gKlxuICogQHJldHVybnMgbmV3IERyYWZ0eSBkb2N1bWVudCBvciBudWxsIGlzIHBsYWluVGV4dCBpcyBub3QgYSBzdHJpbmcgb3IgdW5kZWZpbmVkLlxuICovXG5EcmFmdHkuaW5pdCA9IGZ1bmN0aW9uKHBsYWluVGV4dCkge1xuICBpZiAodHlwZW9mIHBsYWluVGV4dCA9PSAndW5kZWZpbmVkJykge1xuICAgIHBsYWluVGV4dCA9ICcnO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBwbGFpblRleHQgIT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgdHh0OiBwbGFpblRleHRcbiAgfTtcbn1cblxuLyoqXG4gKiBQYXJzZSBwbGFpbiB0ZXh0IGludG8gRHJhZnR5IGRvY3VtZW50LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBjb250ZW50IC0gcGxhaW4tdGV4dCBjb250ZW50IHRvIHBhcnNlLlxuICogQHJldHVybiB7RHJhZnR5fSBwYXJzZWQgZG9jdW1lbnQgb3IgbnVsbCBpZiB0aGUgc291cmNlIGlzIG5vdCBwbGFpbiB0ZXh0LlxuICovXG5EcmFmdHkucGFyc2UgPSBmdW5jdGlvbihjb250ZW50KSB7XG4gIC8vIE1ha2Ugc3VyZSB3ZSBhcmUgcGFyc2luZyBzdHJpbmdzIG9ubHkuXG4gIGlmICh0eXBlb2YgY29udGVudCAhPSAnc3RyaW5nJykge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLy8gU3BsaXQgdGV4dCBpbnRvIGxpbmVzLiBJdCBtYWtlcyBmdXJ0aGVyIHByb2Nlc3NpbmcgZWFzaWVyLlxuICBjb25zdCBsaW5lcyA9IGNvbnRlbnQuc3BsaXQoL1xccj9cXG4vKTtcblxuICAvLyBIb2xkcyBlbnRpdGllcyByZWZlcmVuY2VkIGZyb20gdGV4dFxuICBjb25zdCBlbnRpdHlNYXAgPSBbXTtcbiAgY29uc3QgZW50aXR5SW5kZXggPSB7fTtcblxuICAvLyBQcm9jZXNzaW5nIGxpbmVzIG9uZSBieSBvbmUsIGhvbGQgaW50ZXJtZWRpYXRlIHJlc3VsdCBpbiBibHguXG4gIGNvbnN0IGJseCA9IFtdO1xuICBsaW5lcy5mb3JFYWNoKChsaW5lKSA9PiB7XG4gICAgbGV0IHNwYW5zID0gW107XG4gICAgbGV0IGVudGl0aWVzO1xuXG4gICAgLy8gRmluZCBmb3JtYXR0ZWQgc3BhbnMgaW4gdGhlIHN0cmluZy5cbiAgICAvLyBUcnkgdG8gbWF0Y2ggZWFjaCBzdHlsZS5cbiAgICBJTkxJTkVfU1RZTEVTLmZvckVhY2goKHRhZykgPT4ge1xuICAgICAgLy8gRWFjaCBzdHlsZSBjb3VsZCBiZSBtYXRjaGVkIG11bHRpcGxlIHRpbWVzLlxuICAgICAgc3BhbnMgPSBzcGFucy5jb25jYXQoc3Bhbm5pZnkobGluZSwgdGFnLnN0YXJ0LCB0YWcuZW5kLCB0YWcubmFtZSkpO1xuICAgIH0pO1xuXG4gICAgbGV0IGJsb2NrO1xuICAgIGlmIChzcGFucy5sZW5ndGggPT0gMCkge1xuICAgICAgYmxvY2sgPSB7XG4gICAgICAgIHR4dDogbGluZVxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gU29ydCBzcGFucyBieSBzdHlsZSBvY2N1cmVuY2UgZWFybHkgLT4gbGF0ZSwgdGhlbiBieSBsZW5ndGg6IGZpcnN0IGxvbmcgdGhlbiBzaG9ydC5cbiAgICAgIHNwYW5zLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgY29uc3QgZGlmZiA9IGEuYXQgLSBiLmF0O1xuICAgICAgICByZXR1cm4gZGlmZiAhPSAwID8gZGlmZiA6IGIuZW5kIC0gYS5lbmQ7XG4gICAgICB9KTtcblxuICAgICAgLy8gQ29udmVydCBhbiBhcnJheSBvZiBwb3NzaWJseSBvdmVybGFwcGluZyBzcGFucyBpbnRvIGEgdHJlZS5cbiAgICAgIHNwYW5zID0gdG9TcGFuVHJlZShzcGFucyk7XG5cbiAgICAgIC8vIEJ1aWxkIGEgdHJlZSByZXByZXNlbnRhdGlvbiBvZiB0aGUgZW50aXJlIHN0cmluZywgbm90XG4gICAgICAvLyBqdXN0IHRoZSBmb3JtYXR0ZWQgcGFydHMuXG4gICAgICBjb25zdCBjaHVua3MgPSBjaHVua2lmeShsaW5lLCAwLCBsaW5lLmxlbmd0aCwgc3BhbnMpO1xuXG4gICAgICBjb25zdCBkcmFmdHkgPSBkcmFmdGlmeShjaHVua3MsIDApO1xuXG4gICAgICBibG9jayA9IHtcbiAgICAgICAgdHh0OiBkcmFmdHkudHh0LFxuICAgICAgICBmbXQ6IGRyYWZ0eS5mbXRcbiAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gRXh0cmFjdCBlbnRpdGllcyBmcm9tIHRoZSBjbGVhbmVkIHVwIHN0cmluZy5cbiAgICBlbnRpdGllcyA9IGV4dHJhY3RFbnRpdGllcyhibG9jay50eHQpO1xuICAgIGlmIChlbnRpdGllcy5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCByYW5nZXMgPSBbXTtcbiAgICAgIGZvciAobGV0IGkgaW4gZW50aXRpZXMpIHtcbiAgICAgICAgLy8ge29mZnNldDogbWF0Y2hbJ2luZGV4J10sIHVuaXF1ZTogbWF0Y2hbMF0sIGxlbjogbWF0Y2hbMF0ubGVuZ3RoLCBkYXRhOiBlbnQucGFja2VyKCksIHR5cGU6IGVudC5uYW1lfVxuICAgICAgICBjb25zdCBlbnRpdHkgPSBlbnRpdGllc1tpXTtcbiAgICAgICAgbGV0IGluZGV4ID0gZW50aXR5SW5kZXhbZW50aXR5LnVuaXF1ZV07XG4gICAgICAgIGlmICghaW5kZXgpIHtcbiAgICAgICAgICBpbmRleCA9IGVudGl0eU1hcC5sZW5ndGg7XG4gICAgICAgICAgZW50aXR5SW5kZXhbZW50aXR5LnVuaXF1ZV0gPSBpbmRleDtcbiAgICAgICAgICBlbnRpdHlNYXAucHVzaCh7XG4gICAgICAgICAgICB0cDogZW50aXR5LnR5cGUsXG4gICAgICAgICAgICBkYXRhOiBlbnRpdHkuZGF0YVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJhbmdlcy5wdXNoKHtcbiAgICAgICAgICBhdDogZW50aXR5Lm9mZnNldCxcbiAgICAgICAgICBsZW46IGVudGl0eS5sZW4sXG4gICAgICAgICAga2V5OiBpbmRleFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGJsb2NrLmVudCA9IHJhbmdlcztcbiAgICB9XG5cbiAgICBibHgucHVzaChibG9jayk7XG4gIH0pO1xuXG4gIGNvbnN0IHJlc3VsdCA9IHtcbiAgICB0eHQ6ICcnXG4gIH07XG5cbiAgLy8gTWVyZ2UgbGluZXMgYW5kIHNhdmUgbGluZSBicmVha3MgYXMgQlIgaW5saW5lIGZvcm1hdHRpbmcuXG4gIGlmIChibHgubGVuZ3RoID4gMCkge1xuICAgIHJlc3VsdC50eHQgPSBibHhbMF0udHh0O1xuICAgIHJlc3VsdC5mbXQgPSAoYmx4WzBdLmZtdCB8fCBbXSkuY29uY2F0KGJseFswXS5lbnQgfHwgW10pO1xuXG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCBibHgubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGJsb2NrID0gYmx4W2ldO1xuICAgICAgY29uc3Qgb2Zmc2V0ID0gcmVzdWx0LnR4dC5sZW5ndGggKyAxO1xuXG4gICAgICByZXN1bHQuZm10LnB1c2goe1xuICAgICAgICB0cDogJ0JSJyxcbiAgICAgICAgbGVuOiAxLFxuICAgICAgICBhdDogb2Zmc2V0IC0gMVxuICAgICAgfSk7XG5cbiAgICAgIHJlc3VsdC50eHQgKz0gJyAnICsgYmxvY2sudHh0O1xuICAgICAgaWYgKGJsb2NrLmZtdCkge1xuICAgICAgICByZXN1bHQuZm10ID0gcmVzdWx0LmZtdC5jb25jYXQoYmxvY2suZm10Lm1hcCgocykgPT4ge1xuICAgICAgICAgIHMuYXQgKz0gb2Zmc2V0O1xuICAgICAgICAgIHJldHVybiBzO1xuICAgICAgICB9KSk7XG4gICAgICB9XG4gICAgICBpZiAoYmxvY2suZW50KSB7XG4gICAgICAgIHJlc3VsdC5mbXQgPSByZXN1bHQuZm10LmNvbmNhdChibG9jay5lbnQubWFwKChzKSA9PiB7XG4gICAgICAgICAgcy5hdCArPSBvZmZzZXQ7XG4gICAgICAgICAgcmV0dXJuIHM7XG4gICAgICAgIH0pKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocmVzdWx0LmZtdC5sZW5ndGggPT0gMCkge1xuICAgICAgZGVsZXRlIHJlc3VsdC5mbXQ7XG4gICAgfVxuXG4gICAgaWYgKGVudGl0eU1hcC5sZW5ndGggPiAwKSB7XG4gICAgICByZXN1bHQuZW50ID0gZW50aXR5TWFwO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEFwcGVuZCBvbmUgRHJhZnR5IGRvY3VtZW50IHRvIGFub3RoZXIuXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGZpcnN0IC0gRHJhZnR5IGRvY3VtZW50IHRvIGFwcGVuZCB0by5cbiAqIEBwYXJhbSB7RHJhZnR5fHN0cmluZ30gc2Vjb25kIC0gRHJhZnR5IGRvY3VtZW50IG9yIHN0cmluZyBiZWluZyBhcHBlbmRlZC5cbiAqXG4gKiBAcmV0dXJuIHtEcmFmdHl9IGZpcnN0IGRvY3VtZW50IHdpdGggdGhlIHNlY29uZCBhcHBlbmRlZCB0byBpdC5cbiAqL1xuRHJhZnR5LmFwcGVuZCA9IGZ1bmN0aW9uKGZpcnN0LCBzZWNvbmQpIHtcbiAgaWYgKCFmaXJzdCkge1xuICAgIHJldHVybiBzZWNvbmQ7XG4gIH1cbiAgaWYgKCFzZWNvbmQpIHtcbiAgICByZXR1cm4gZmlyc3Q7XG4gIH1cblxuICBmaXJzdC50eHQgPSBmaXJzdC50eHQgfHwgJyc7XG4gIGNvbnN0IGxlbiA9IGZpcnN0LnR4dC5sZW5ndGg7XG5cbiAgaWYgKHR5cGVvZiBzZWNvbmQgPT0gJ3N0cmluZycpIHtcbiAgICBmaXJzdC50eHQgKz0gc2Vjb25kO1xuICB9IGVsc2UgaWYgKHNlY29uZC50eHQpIHtcbiAgICBmaXJzdC50eHQgKz0gc2Vjb25kLnR4dDtcbiAgfVxuXG4gIGlmIChBcnJheS5pc0FycmF5KHNlY29uZC5mbXQpKSB7XG4gICAgZmlyc3QuZm10ID0gZmlyc3QuZm10IHx8IFtdO1xuICAgIGlmIChBcnJheS5pc0FycmF5KHNlY29uZC5lbnQpKSB7XG4gICAgICBmaXJzdC5lbnQgPSBmaXJzdC5lbnQgfHwgW107XG4gICAgfVxuICAgIHNlY29uZC5mbXQuZm9yRWFjaChzcmMgPT4ge1xuICAgICAgY29uc3QgZm10ID0ge1xuICAgICAgICBhdDogKHNyYy5hdCB8IDApICsgbGVuLFxuICAgICAgICBsZW46IHNyYy5sZW4gfCAwXG4gICAgICB9O1xuICAgICAgLy8gU3BlY2lhbCBjYXNlIGZvciB0aGUgb3V0c2lkZSBvZiB0aGUgbm9ybWFsIHJlbmRlcmluZyBmbG93IHN0eWxlcy5cbiAgICAgIGlmIChzcmMuYXQgPT0gLTEpIHtcbiAgICAgICAgZm10LmF0ID0gLTE7XG4gICAgICAgIGZtdC5sZW4gPSAwO1xuICAgICAgfVxuICAgICAgaWYgKHNyYy50cCkge1xuICAgICAgICBmbXQudHAgPSBzcmMudHA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmbXQua2V5ID0gZmlyc3QuZW50Lmxlbmd0aDtcbiAgICAgICAgZmlyc3QuZW50LnB1c2goc2Vjb25kLmVudFtzcmMua2V5IHx8IDBdKTtcbiAgICAgIH1cbiAgICAgIGZpcnN0LmZtdC5wdXNoKGZtdCk7XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gZmlyc3Q7XG59XG5cbi8qKlxuICogQHR5cGVkZWYgRHJhZnR5LkltYWdlRGVzY1xuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHR5cGUgT2JqZWN0XG4gKiBAcGFyYW0ge3N0cmluZ30gbWltZSAtIG1pbWUtdHlwZSBvZiB0aGUgaW1hZ2UsIGUuZy4gXCJpbWFnZS9wbmdcIi5cbiAqIEBwYXJhbSB7c3RyaW5nfSByZWZ1cmwgLSByZWZlcmVuY2UgdG8gdGhlIGNvbnRlbnQuIENvdWxkIGJlIG51bGwvdW5kZWZpbmVkLlxuICogQHBhcmFtIHtzdHJpbmd9IGJpdHMgLSBiYXNlNjQtZW5jb2RlZCBpbWFnZSBjb250ZW50LiBDb3VsZCBiZSBudWxsL3VuZGVmaW5lZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBwcmV2aWV3IC0gYmFzZTY0LWVuY29kZWQgdGh1bWJuYWlsIG9mIHRoZSBpbWFnZS5cbiAqIEBwYXJhbSB7aW50ZWdlcn0gd2lkdGggLSB3aWR0aCBvZiB0aGUgaW1hZ2UuXG4gKiBAcGFyYW0ge2ludGVnZXJ9IGhlaWdodCAtIGhlaWdodCBvZiB0aGUgaW1hZ2UuXG4gKiBAcGFyYW0ge3N0cmluZ30gZmlsZW5hbWUgLSBmaWxlIG5hbWUgc3VnZ2VzdGlvbiBmb3IgZG93bmxvYWRpbmcgdGhlIGltYWdlLlxuICogQHBhcmFtIHtpbnRlZ2VyfSBzaXplIC0gc2l6ZSBvZiB0aGUgaW1hZ2UgaW4gYnl0ZXMuIFRyZWF0IGlzIGFzIGFuIHVudHJ1c3RlZCBoaW50LlxuICogQHBhcmFtIHtzdHJpbmd9IF90ZW1wUHJldmlldyAtIGJhc2U2NC1lbmNvZGVkIGltYWdlIHByZXZpZXcgdXNlZCBkdXJpbmcgdXBsb2FkIHByb2Nlc3M7IG5vdCBzZXJpYWxpemFibGUuXG4gKiBAcGFyYW0ge1Byb21pc2V9IHVybFByb21pc2UgLSBQcm9taXNlIHdoaWNoIHJldHVybnMgY29udGVudCBVUkwgd2hlbiByZXNvbHZlZC5cbiAqL1xuXG4vKipcbiAqIEluc2VydCBpbmxpbmUgaW1hZ2UgaW50byBEcmFmdHkgZG9jdW1lbnQuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGNvbnRlbnQgLSBkb2N1bWVudCB0byBhZGQgaW1hZ2UgdG8uXG4gKiBAcGFyYW0ge2ludGVnZXJ9IGF0IC0gaW5kZXggd2hlcmUgdGhlIG9iamVjdCBpcyBpbnNlcnRlZC4gVGhlIGxlbmd0aCBvZiB0aGUgaW1hZ2UgaXMgYWx3YXlzIDEuXG4gKiBAcGFyYW0ge0ltYWdlRGVzY30gaW1hZ2VEZXNjIC0gb2JqZWN0IHdpdGggaW1hZ2UgcGFyYW1lbmV0cyBhbmQgZGF0YS5cbiAqXG4gKiBAcmV0dXJuIHtEcmFmdHl9IHVwZGF0ZWQgZG9jdW1lbnQuXG4gKi9cbkRyYWZ0eS5pbnNlcnRJbWFnZSA9IGZ1bmN0aW9uKGNvbnRlbnQsIGF0LCBpbWFnZURlc2MpIHtcbiAgY29udGVudCA9IGNvbnRlbnQgfHwge1xuICAgIHR4dDogJyAnXG4gIH07XG4gIGNvbnRlbnQuZW50ID0gY29udGVudC5lbnQgfHwgW107XG4gIGNvbnRlbnQuZm10ID0gY29udGVudC5mbXQgfHwgW107XG5cbiAgY29udGVudC5mbXQucHVzaCh7XG4gICAgYXQ6IGF0IHwgMCxcbiAgICBsZW46IDEsXG4gICAga2V5OiBjb250ZW50LmVudC5sZW5ndGhcbiAgfSk7XG5cbiAgY29uc3QgZXggPSB7XG4gICAgdHA6ICdJTScsXG4gICAgZGF0YToge1xuICAgICAgbWltZTogaW1hZ2VEZXNjLm1pbWUsXG4gICAgICByZWY6IGltYWdlRGVzYy5yZWZ1cmwsXG4gICAgICB2YWw6IGltYWdlRGVzYy5iaXRzIHx8IGltYWdlRGVzYy5wcmV2aWV3LFxuICAgICAgd2lkdGg6IGltYWdlRGVzYy53aWR0aCxcbiAgICAgIGhlaWdodDogaW1hZ2VEZXNjLmhlaWdodCxcbiAgICAgIG5hbWU6IGltYWdlRGVzYy5maWxlbmFtZSxcbiAgICAgIHNpemU6IGltYWdlRGVzYy5zaXplIHwgMCxcbiAgICB9XG4gIH07XG5cbiAgaWYgKGltYWdlRGVzYy51cmxQcm9taXNlKSB7XG4gICAgZXguZGF0YS5fdGVtcFByZXZpZXcgPSBpbWFnZURlc2MuX3RlbXBQcmV2aWV3O1xuICAgIGV4LmRhdGEuX3Byb2Nlc3NpbmcgPSB0cnVlO1xuICAgIGltYWdlRGVzYy51cmxQcm9taXNlLnRoZW4oXG4gICAgICB1cmwgPT4ge1xuICAgICAgICBleC5kYXRhLnJlZiA9IHVybDtcbiAgICAgICAgZXguZGF0YS5fdGVtcFByZXZpZXcgPSB1bmRlZmluZWQ7XG4gICAgICAgIGV4LmRhdGEuX3Byb2Nlc3NpbmcgPSB1bmRlZmluZWQ7XG4gICAgICB9LFxuICAgICAgXyA9PiB7XG4gICAgICAgIC8vIENhdGNoIHRoZSBlcnJvciwgb3RoZXJ3aXNlIGl0IHdpbGwgYXBwZWFyIGluIHRoZSBjb25zb2xlLlxuICAgICAgICBleC5kYXRhLl9wcm9jZXNzaW5nID0gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgICk7XG4gIH1cblxuICBjb250ZW50LmVudC5wdXNoKGV4KTtcblxuICByZXR1cm4gY29udGVudDtcbn1cblxuLyoqXG4gKiBAdHlwZWRlZiBEcmFmdHkuVmlkZW9EZXNjXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAdHlwZSBPYmplY3RcbiAqIEBwYXJhbSB7c3RyaW5nfSBtaW1lIC0gbWltZS10eXBlIG9mIHRoZSB2aWRlbywgZS5nLiBcInZpZGVvL21wZWdcIi5cbiAqIEBwYXJhbSB7c3RyaW5nfSByZWZ1cmwgLSByZWZlcmVuY2UgdG8gdGhlIGNvbnRlbnQuIENvdWxkIGJlIG51bGwvdW5kZWZpbmVkLlxuICogQHBhcmFtIHtzdHJpbmd9IGJpdHMgLSBpbi1iYW5kIGJhc2U2NC1lbmNvZGVkIGltYWdlIGRhdGEuIENvdWxkIGJlIG51bGwvdW5kZWZpbmVkLlxuICogQHBhcmFtIHtzdHJpbmd9IHByZXZpZXcgLSBiYXNlNjQtZW5jb2RlZCBzY3JlZW5jYXB0dXJlIGZyb20gdGhlIHZpZGVvLiBDb3VsZCBiZSBudWxsL3VuZGVmaW5lZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBwcmVyZWYgLSByZWZlcmVuY2UgdG8gc2NyZWVuY2FwdHVyZSBmcm9tIHRoZSB2aWRlby4gQ291bGQgYmUgbnVsbC91bmRlZmluZWQuXG4gKiBAcGFyYW0ge2ludGVnZXJ9IHdpZHRoIC0gd2lkdGggb2YgdGhlIHZpZGVvLlxuICogQHBhcmFtIHtpbnRlZ2VyfSBoZWlnaHQgLSBoZWlnaHQgb2YgdGhlIHZpZGVvLlxuICogQHBhcmFtIHtpbnRlZ2VyfSBkdXJhdGlvbiAtIGR1cmF0aW9uIG9mIHRoZSB2aWRlby5cbiAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlbmFtZSAtIGZpbGUgbmFtZSBzdWdnZXN0aW9uIGZvciBkb3dubG9hZGluZyB0aGUgdmlkZW8uXG4gKiBAcGFyYW0ge2ludGVnZXJ9IHNpemUgLSBzaXplIG9mIHRoZSB2aWRlbyBpbiBieXRlcy4gVHJlYXQgaXMgYXMgYW4gdW50cnVzdGVkIGhpbnQuXG4gKiBAcGFyYW0ge3N0cmluZ30gX3RlbXBQcmV2aWV3IC0gYmFzZTY0LWVuY29kZWQgc2NyZWVuY2FwdHVyZSB1c2VkIGR1cmluZyB1cGxvYWQgcHJvY2Vzczsgbm90IHNlcmlhbGl6YWJsZS5cbiAqIEBwYXJhbSB7UHJvbWlzZX0gdXJsUHJvbWlzZSAtIGFycmF5IG9mIHR3byBwcm9taXNlcywgd2hpY2ggcmV0dXJuIFVSTHMgb2YgdmlkZW8gYW5kIHByZXZpZXcgdXBsb2FkcyBjb3JyZXNwb25kaW5nbHlcbiAqICAgICAgICAoZWl0aGVyIGNvdWxkIGJlIG51bGwpLlxuICovXG5cbi8qKlxuICogSW5zZXJ0IGlubGluZSBpbWFnZSBpbnRvIERyYWZ0eSBkb2N1bWVudC5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eX0gY29udGVudCAtIGRvY3VtZW50IHRvIGFkZCB2aWRlbyB0by5cbiAqIEBwYXJhbSB7aW50ZWdlcn0gYXQgLSBpbmRleCB3aGVyZSB0aGUgb2JqZWN0IGlzIGluc2VydGVkLiBUaGUgbGVuZ3RoIG9mIHRoZSB2aWRlbyBpcyBhbHdheXMgMS5cbiAqIEBwYXJhbSB7VmlkZW9EZXNjfSB2aWRlb0Rlc2MgLSBvYmplY3Qgd2l0aCB2aWRlbyBwYXJhbWVuZXRzIGFuZCBkYXRhLlxuICpcbiAqIEByZXR1cm4ge0RyYWZ0eX0gdXBkYXRlZCBkb2N1bWVudC5cbiAqL1xuRHJhZnR5Lmluc2VydFZpZGVvID0gZnVuY3Rpb24oY29udGVudCwgYXQsIHZpZGVvRGVzYykge1xuICBjb250ZW50ID0gY29udGVudCB8fCB7XG4gICAgdHh0OiAnICdcbiAgfTtcbiAgY29udGVudC5lbnQgPSBjb250ZW50LmVudCB8fCBbXTtcbiAgY29udGVudC5mbXQgPSBjb250ZW50LmZtdCB8fCBbXTtcblxuICBjb250ZW50LmZtdC5wdXNoKHtcbiAgICBhdDogYXQgfCAwLFxuICAgIGxlbjogMSxcbiAgICBrZXk6IGNvbnRlbnQuZW50Lmxlbmd0aFxuICB9KTtcblxuICBjb25zdCBleCA9IHtcbiAgICB0cDogJ1ZEJyxcbiAgICBkYXRhOiB7XG4gICAgICBtaW1lOiB2aWRlb0Rlc2MubWltZSxcbiAgICAgIHJlZjogdmlkZW9EZXNjLnJlZnVybCxcbiAgICAgIHZhbDogdmlkZW9EZXNjLmJpdHMsXG4gICAgICBwcmVyZWY6IHZpZGVvRGVzYy5wcmVyZWYsXG4gICAgICBwcmV2aWV3OiB2aWRlb0Rlc2MucHJldmlldyxcbiAgICAgIHdpZHRoOiB2aWRlb0Rlc2Mud2lkdGgsXG4gICAgICBoZWlnaHQ6IHZpZGVvRGVzYy5oZWlnaHQsXG4gICAgICBkdXJhdGlvbjogdmlkZW9EZXNjLmR1cmF0aW9uIHwgMCxcbiAgICAgIG5hbWU6IHZpZGVvRGVzYy5maWxlbmFtZSxcbiAgICAgIHNpemU6IHZpZGVvRGVzYy5zaXplIHwgMCxcbiAgICB9XG4gIH07XG5cbiAgaWYgKHZpZGVvRGVzYy51cmxQcm9taXNlKSB7XG4gICAgZXguZGF0YS5fdGVtcFByZXZpZXcgPSB2aWRlb0Rlc2MuX3RlbXBQcmV2aWV3O1xuICAgIGV4LmRhdGEuX3Byb2Nlc3NpbmcgPSB0cnVlO1xuICAgIHZpZGVvRGVzYy51cmxQcm9taXNlLnRoZW4oXG4gICAgICB1cmxzID0+IHtcbiAgICAgICAgZXguZGF0YS5yZWYgPSB1cmxzWzBdO1xuICAgICAgICBleC5kYXRhLnByZXJlZiA9IHVybHNbMV07XG4gICAgICAgIGV4LmRhdGEuX3RlbXBQcmV2aWV3ID0gdW5kZWZpbmVkO1xuICAgICAgICBleC5kYXRhLl9wcm9jZXNzaW5nID0gdW5kZWZpbmVkO1xuICAgICAgfSxcbiAgICAgIF8gPT4ge1xuICAgICAgICAvLyBDYXRjaCB0aGUgZXJyb3IsIG90aGVyd2lzZSBpdCB3aWxsIGFwcGVhciBpbiB0aGUgY29uc29sZS5cbiAgICAgICAgZXguZGF0YS5fcHJvY2Vzc2luZyA9IHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICApO1xuICB9XG5cbiAgY29udGVudC5lbnQucHVzaChleCk7XG5cbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cbi8qKlxuICogQHR5cGVkZWYgRHJhZnR5LkF1ZGlvRGVzY1xuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHR5cGUgT2JqZWN0XG4gKiBAcGFyYW0ge3N0cmluZ30gbWltZSAtIG1pbWUtdHlwZSBvZiB0aGUgYXVkaW8sIGUuZy4gXCJhdWRpby9vZ2dcIi5cbiAqIEBwYXJhbSB7c3RyaW5nfSByZWZ1cmwgLSByZWZlcmVuY2UgdG8gdGhlIGNvbnRlbnQuIENvdWxkIGJlIG51bGwvdW5kZWZpbmVkLlxuICogQHBhcmFtIHtzdHJpbmd9IGJpdHMgLSBiYXNlNjQtZW5jb2RlZCBhdWRpbyBjb250ZW50LiBDb3VsZCBiZSBudWxsL3VuZGVmaW5lZC5cbiAqIEBwYXJhbSB7aW50ZWdlcn0gZHVyYXRpb24gLSBkdXJhdGlvbiBvZiB0aGUgcmVjb3JkIGluIG1pbGxpc2Vjb25kcy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBwcmV2aWV3IC0gYmFzZTY0IGVuY29kZWQgc2hvcnQgYXJyYXkgb2YgYW1wbGl0dWRlIHZhbHVlcyAwLi4xMDAuXG4gKiBAcGFyYW0ge3N0cmluZ30gZmlsZW5hbWUgLSBmaWxlIG5hbWUgc3VnZ2VzdGlvbiBmb3IgZG93bmxvYWRpbmcgdGhlIGF1ZGlvLlxuICogQHBhcmFtIHtpbnRlZ2VyfSBzaXplIC0gc2l6ZSBvZiB0aGUgcmVjb3JkaW5nIGluIGJ5dGVzLiBUcmVhdCBpcyBhcyBhbiB1bnRydXN0ZWQgaGludC5cbiAqIEBwYXJhbSB7UHJvbWlzZX0gdXJsUHJvbWlzZSAtIFByb21pc2Ugd2hpY2ggcmV0dXJucyBjb250ZW50IFVSTCB3aGVuIHJlc29sdmVkLlxuICovXG5cbi8qKlxuICogSW5zZXJ0IGF1ZGlvIHJlY29yZGluZyBpbnRvIERyYWZ0eSBkb2N1bWVudC5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eX0gY29udGVudCAtIGRvY3VtZW50IHRvIGFkZCBhdWRpbyByZWNvcmQgdG8uXG4gKiBAcGFyYW0ge2ludGVnZXJ9IGF0IC0gaW5kZXggd2hlcmUgdGhlIG9iamVjdCBpcyBpbnNlcnRlZC4gVGhlIGxlbmd0aCBvZiB0aGUgcmVjb3JkIGlzIGFsd2F5cyAxLlxuICogQHBhcmFtIHtBdWRpb0Rlc2N9IGF1ZGlvRGVzYyAtIG9iamVjdCB3aXRoIHRoZSBhdWRpbyBwYXJhbWVuZXRzIGFuZCBkYXRhLlxuICpcbiAqIEByZXR1cm4ge0RyYWZ0eX0gdXBkYXRlZCBkb2N1bWVudC5cbiAqL1xuRHJhZnR5Lmluc2VydEF1ZGlvID0gZnVuY3Rpb24oY29udGVudCwgYXQsIGF1ZGlvRGVzYykge1xuICBjb250ZW50ID0gY29udGVudCB8fCB7XG4gICAgdHh0OiAnICdcbiAgfTtcbiAgY29udGVudC5lbnQgPSBjb250ZW50LmVudCB8fCBbXTtcbiAgY29udGVudC5mbXQgPSBjb250ZW50LmZtdCB8fCBbXTtcblxuICBjb250ZW50LmZtdC5wdXNoKHtcbiAgICBhdDogYXQgfCAwLFxuICAgIGxlbjogMSxcbiAgICBrZXk6IGNvbnRlbnQuZW50Lmxlbmd0aFxuICB9KTtcblxuICBjb25zdCBleCA9IHtcbiAgICB0cDogJ0FVJyxcbiAgICBkYXRhOiB7XG4gICAgICBtaW1lOiBhdWRpb0Rlc2MubWltZSxcbiAgICAgIHZhbDogYXVkaW9EZXNjLmJpdHMsXG4gICAgICBkdXJhdGlvbjogYXVkaW9EZXNjLmR1cmF0aW9uIHwgMCxcbiAgICAgIHByZXZpZXc6IGF1ZGlvRGVzYy5wcmV2aWV3LFxuICAgICAgbmFtZTogYXVkaW9EZXNjLmZpbGVuYW1lLFxuICAgICAgc2l6ZTogYXVkaW9EZXNjLnNpemUgfCAwLFxuICAgICAgcmVmOiBhdWRpb0Rlc2MucmVmdXJsXG4gICAgfVxuICB9O1xuXG4gIGlmIChhdWRpb0Rlc2MudXJsUHJvbWlzZSkge1xuICAgIGV4LmRhdGEuX3Byb2Nlc3NpbmcgPSB0cnVlO1xuICAgIGF1ZGlvRGVzYy51cmxQcm9taXNlLnRoZW4oXG4gICAgICB1cmwgPT4ge1xuICAgICAgICBleC5kYXRhLnJlZiA9IHVybDtcbiAgICAgICAgZXguZGF0YS5fcHJvY2Vzc2luZyA9IHVuZGVmaW5lZDtcbiAgICAgIH0sXG4gICAgICBfID0+IHtcbiAgICAgICAgLy8gQ2F0Y2ggdGhlIGVycm9yLCBvdGhlcndpc2UgaXQgd2lsbCBhcHBlYXIgaW4gdGhlIGNvbnNvbGUuXG4gICAgICAgIGV4LmRhdGEuX3Byb2Nlc3NpbmcgPSB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgKTtcbiAgfVxuXG4gIGNvbnRlbnQuZW50LnB1c2goZXgpO1xuXG4gIHJldHVybiBjb250ZW50O1xufVxuXG4vKipcbiAqIENyZWF0ZSBhIChzZWxmLWNvbnRhaW5lZCkgdmlkZW8gY2FsbCBEcmFmdHkgZG9jdW1lbnQuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGF1ZGlvT25seSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0aGUgY2FsbCBpcyBpbml0aWFsbHkgYXVkaW8tb25seS5cbiAqIEByZXR1cm5zIFZpZGVvIENhbGwgZHJhZnR5IGRvY3VtZW50LlxuICovXG5EcmFmdHkudmlkZW9DYWxsID0gZnVuY3Rpb24oYXVkaW9Pbmx5KSB7XG4gIGNvbnN0IGNvbnRlbnQgPSB7XG4gICAgdHh0OiAnICcsXG4gICAgZm10OiBbe1xuICAgICAgYXQ6IDAsXG4gICAgICBsZW46IDEsXG4gICAgICBrZXk6IDBcbiAgICB9XSxcbiAgICBlbnQ6IFt7XG4gICAgICB0cDogJ1ZDJyxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgYW9ubHk6IGF1ZGlvT25seVxuICAgICAgfSxcbiAgICB9XVxuICB9O1xuICByZXR1cm4gY29udGVudDtcbn1cblxuLyoqXG4gKiBVcGRhdGUgdmlkZW8gY2FsbCAoVkMpIGVudGl0eSB3aXRoIHRoZSBuZXcgc3RhdHVzIGFuZCBkdXJhdGlvbi5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eX0gY29udGVudCAtIFZDIGRvY3VtZW50IHRvIHVwZGF0ZS5cbiAqIEBwYXJhbSB7b2JqZWN0fSBwYXJhbXMgLSBuZXcgdmlkZW8gY2FsbCBwYXJhbWV0ZXJzLlxuICogQHBhcmFtIHtzdHJpbmd9IHBhcmFtcy5zdGF0ZSAtIHN0YXRlIG9mIHZpZGVvIGNhbGwuXG4gKiBAcGFyYW0ge251bWJlcn0gcGFyYW1zLmR1cmF0aW9uIC0gZHVyYXRpb24gb2YgdGhlIHZpZGVvIGNhbGwgaW4gbWlsbGlzZWNvbmRzLlxuICpcbiAqIEByZXR1cm5zIHRoZSBzYW1lIGRvY3VtZW50IHdpdGggdXBkYXRlIGFwcGxpZWQuXG4gKi9cbkRyYWZ0eS51cGRhdGVWaWRlb0NhbGwgPSBmdW5jdGlvbihjb250ZW50LCBwYXJhbXMpIHtcbiAgLy8gVGhlIHZpZGVvIGVsZW1lbnQgY291bGQgYmUganVzdCBhIGZvcm1hdCBvciBhIGZvcm1hdCArIGVudGl0eS5cbiAgLy8gTXVzdCBlbnN1cmUgaXQncyB0aGUgbGF0dGVyIGZpcnN0LlxuICBjb25zdCBmbXQgPSAoKGNvbnRlbnQgfHwge30pLmZtdCB8fCBbXSlbMF07XG4gIGlmICghZm10KSB7XG4gICAgLy8gVW5yZWNvZ25pemVkIGNvbnRlbnQuXG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH1cblxuICBsZXQgZW50O1xuICBpZiAoZm10LnRwID09ICdWQycpIHtcbiAgICAvLyBKdXN0IGEgZm9ybWF0LCBjb252ZXJ0IHRvIGZvcm1hdCArIGVudGl0eS5cbiAgICBkZWxldGUgZm10LnRwO1xuICAgIGZtdC5rZXkgPSAwO1xuICAgIGVudCA9IHtcbiAgICAgIHRwOiAnVkMnXG4gICAgfTtcbiAgICBjb250ZW50LmVudCA9IFtlbnRdO1xuICB9IGVsc2Uge1xuICAgIGVudCA9IChjb250ZW50LmVudCB8fCBbXSlbZm10LmtleSB8IDBdO1xuICAgIGlmICghZW50IHx8IGVudC50cCAhPSAnVkMnKSB7XG4gICAgICAvLyBOb3QgYSBWQyBlbnRpdHkuXG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9XG4gIH1cbiAgZW50LmRhdGEgPSBlbnQuZGF0YSB8fCB7fTtcbiAgT2JqZWN0LmFzc2lnbihlbnQuZGF0YSwgcGFyYW1zKTtcbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cbi8qKlxuICogQ3JlYXRlIGEgcXVvdGUgdG8gRHJhZnR5IGRvY3VtZW50LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBoZWFkZXIgLSBRdW90ZSBoZWFkZXIgKHRpdGxlLCBldGMuKS5cbiAqIEBwYXJhbSB7c3RyaW5nfSB1aWQgLSBVSUQgb2YgdGhlIGF1dGhvciB0byBtZW50aW9uLlxuICogQHBhcmFtIHtEcmFmdHl9IGJvZHkgLSBCb2R5IG9mIHRoZSBxdW90ZWQgbWVzc2FnZS5cbiAqXG4gKiBAcmV0dXJucyBSZXBseSBxdW90ZSBEcmFmdHkgZG9jIHdpdGggdGhlIHF1b3RlIGZvcm1hdHRpbmcuXG4gKi9cbkRyYWZ0eS5xdW90ZSA9IGZ1bmN0aW9uKGhlYWRlciwgdWlkLCBib2R5KSB7XG4gIGNvbnN0IHF1b3RlID0gRHJhZnR5LmFwcGVuZChEcmFmdHkuYXBwZW5kTGluZUJyZWFrKERyYWZ0eS5tZW50aW9uKGhlYWRlciwgdWlkKSksIGJvZHkpO1xuXG4gIC8vIFdyYXAgaW50byBhIHF1b3RlLlxuICBxdW90ZS5mbXQucHVzaCh7XG4gICAgYXQ6IDAsXG4gICAgbGVuOiBxdW90ZS50eHQubGVuZ3RoLFxuICAgIHRwOiAnUVEnXG4gIH0pO1xuXG4gIHJldHVybiBxdW90ZTtcbn1cblxuLyoqXG4gKiBDcmVhdGUgYSBEcmFmdHkgZG9jdW1lbnQgd2l0aCBhIG1lbnRpb24uXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBtZW50aW9uZWQgbmFtZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSB1aWQgLSBtZW50aW9uZWQgdXNlciBJRC5cbiAqXG4gKiBAcmV0dXJucyB7RHJhZnR5fSBkb2N1bWVudCB3aXRoIHRoZSBtZW50aW9uLlxuICovXG5EcmFmdHkubWVudGlvbiA9IGZ1bmN0aW9uKG5hbWUsIHVpZCkge1xuICByZXR1cm4ge1xuICAgIHR4dDogbmFtZSB8fCAnJyxcbiAgICBmbXQ6IFt7XG4gICAgICBhdDogMCxcbiAgICAgIGxlbjogKG5hbWUgfHwgJycpLmxlbmd0aCxcbiAgICAgIGtleTogMFxuICAgIH1dLFxuICAgIGVudDogW3tcbiAgICAgIHRwOiAnTU4nLFxuICAgICAgZGF0YToge1xuICAgICAgICB2YWw6IHVpZFxuICAgICAgfVxuICAgIH1dXG4gIH07XG59XG5cbi8qKlxuICogQXBwZW5kIGEgbGluayB0byBhIERyYWZ0eSBkb2N1bWVudC5cbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eX0gY29udGVudCAtIERyYWZ0eSBkb2N1bWVudCB0byBhcHBlbmQgbGluayB0by5cbiAqIEBwYXJhbSB7T2JqZWN0fSBsaW5rRGF0YSAtIExpbmsgaW5mbyBpbiBmb3JtYXQgPGNvZGU+e3R4dDogJ2Fua29yIHRleHQnLCB1cmw6ICdodHRwOi8vLi4uJ308L2NvZGU+LlxuICpcbiAqIEByZXR1cm5zIHtEcmFmdHl9IHRoZSBzYW1lIGRvY3VtZW50IGFzIDxjb2RlPmNvbnRlbnQ8L2NvZGU+LlxuICovXG5EcmFmdHkuYXBwZW5kTGluayA9IGZ1bmN0aW9uKGNvbnRlbnQsIGxpbmtEYXRhKSB7XG4gIGNvbnRlbnQgPSBjb250ZW50IHx8IHtcbiAgICB0eHQ6ICcnXG4gIH07XG5cbiAgY29udGVudC5lbnQgPSBjb250ZW50LmVudCB8fCBbXTtcbiAgY29udGVudC5mbXQgPSBjb250ZW50LmZtdCB8fCBbXTtcblxuICBjb250ZW50LmZtdC5wdXNoKHtcbiAgICBhdDogY29udGVudC50eHQubGVuZ3RoLFxuICAgIGxlbjogbGlua0RhdGEudHh0Lmxlbmd0aCxcbiAgICBrZXk6IGNvbnRlbnQuZW50Lmxlbmd0aFxuICB9KTtcbiAgY29udGVudC50eHQgKz0gbGlua0RhdGEudHh0O1xuXG4gIGNvbnN0IGV4ID0ge1xuICAgIHRwOiAnTE4nLFxuICAgIGRhdGE6IHtcbiAgICAgIHVybDogbGlua0RhdGEudXJsXG4gICAgfVxuICB9XG4gIGNvbnRlbnQuZW50LnB1c2goZXgpO1xuXG4gIHJldHVybiBjb250ZW50O1xufVxuXG4vKipcbiAqIEFwcGVuZCBpbWFnZSB0byBEcmFmdHkgZG9jdW1lbnQuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGNvbnRlbnQgLSBkb2N1bWVudCB0byBhZGQgaW1hZ2UgdG8uXG4gKiBAcGFyYW0ge0ltYWdlRGVzY30gaW1hZ2VEZXNjIC0gb2JqZWN0IHdpdGggaW1hZ2UgcGFyYW1lbmV0cy5cbiAqXG4gKiBAcmV0dXJuIHtEcmFmdHl9IHVwZGF0ZWQgZG9jdW1lbnQuXG4gKi9cbkRyYWZ0eS5hcHBlbmRJbWFnZSA9IGZ1bmN0aW9uKGNvbnRlbnQsIGltYWdlRGVzYykge1xuICBjb250ZW50ID0gY29udGVudCB8fCB7XG4gICAgdHh0OiAnJ1xuICB9O1xuICBjb250ZW50LnR4dCArPSAnICc7XG4gIHJldHVybiBEcmFmdHkuaW5zZXJ0SW1hZ2UoY29udGVudCwgY29udGVudC50eHQubGVuZ3RoIC0gMSwgaW1hZ2VEZXNjKTtcbn1cblxuLyoqXG4gKiBBcHBlbmQgYXVkaW8gcmVjb2RyaW5nIHRvIERyYWZ0eSBkb2N1bWVudC5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eX0gY29udGVudCAtIGRvY3VtZW50IHRvIGFkZCByZWNvcmRpbmcgdG8uXG4gKiBAcGFyYW0ge0F1ZGlvRGVzY30gYXVkaW9EZXNjIC0gb2JqZWN0IHdpdGggYXVkaW8gZGF0YS5cbiAqXG4gKiBAcmV0dXJuIHtEcmFmdHl9IHVwZGF0ZWQgZG9jdW1lbnQuXG4gKi9cbkRyYWZ0eS5hcHBlbmRBdWRpbyA9IGZ1bmN0aW9uKGNvbnRlbnQsIGF1ZGlvRGVzYykge1xuICBjb250ZW50ID0gY29udGVudCB8fCB7XG4gICAgdHh0OiAnJ1xuICB9O1xuICBjb250ZW50LnR4dCArPSAnICc7XG4gIHJldHVybiBEcmFmdHkuaW5zZXJ0QXVkaW8oY29udGVudCwgY29udGVudC50eHQubGVuZ3RoIC0gMSwgYXVkaW9EZXNjKTtcbn1cblxuLyoqXG4gKiBAdHlwZWRlZiBEcmFmdHkuQXR0YWNobWVudERlc2NcbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEB0eXBlIE9iamVjdFxuICogQHBhcmFtIHtzdHJpbmd9IG1pbWUgLSBtaW1lLXR5cGUgb2YgdGhlIGF0dGFjaG1lbnQsIGUuZy4gXCJhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW1cIlxuICogQHBhcmFtIHtzdHJpbmd9IGRhdGEgLSBiYXNlNjQtZW5jb2RlZCBpbi1iYW5kIGNvbnRlbnQgb2Ygc21hbGwgYXR0YWNobWVudHMuIENvdWxkIGJlIG51bGwvdW5kZWZpbmVkLlxuICogQHBhcmFtIHtzdHJpbmd9IGZpbGVuYW1lIC0gZmlsZSBuYW1lIHN1Z2dlc3Rpb24gZm9yIGRvd25sb2FkaW5nIHRoZSBhdHRhY2htZW50LlxuICogQHBhcmFtIHtpbnRlZ2VyfSBzaXplIC0gc2l6ZSBvZiB0aGUgZmlsZSBpbiBieXRlcy4gVHJlYXQgaXMgYXMgYW4gdW50cnVzdGVkIGhpbnQuXG4gKiBAcGFyYW0ge3N0cmluZ30gcmVmdXJsIC0gcmVmZXJlbmNlIHRvIHRoZSBvdXQtb2YtYmFuZCBjb250ZW50LiBDb3VsZCBiZSBudWxsL3VuZGVmaW5lZC5cbiAqIEBwYXJhbSB7UHJvbWlzZX0gdXJsUHJvbWlzZSAtIFByb21pc2Ugd2hpY2ggcmV0dXJucyBjb250ZW50IFVSTCB3aGVuIHJlc29sdmVkLlxuICovXG5cbi8qKlxuICogQXR0YWNoIGZpbGUgdG8gRHJhZnR5IGNvbnRlbnQuIEVpdGhlciBhcyBhIGJsb2Igb3IgYXMgYSByZWZlcmVuY2UuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGNvbnRlbnQgLSBkb2N1bWVudCB0byBhdHRhY2ggZmlsZSB0by5cbiAqIEBwYXJhbSB7QXR0YWNobWVudERlc2N9IG9iamVjdCAtIGNvbnRhaW5pbmcgYXR0YWNobWVudCBkZXNjcmlwdGlvbiBhbmQgZGF0YS5cbiAqXG4gKiBAcmV0dXJuIHtEcmFmdHl9IHVwZGF0ZWQgZG9jdW1lbnQuXG4gKi9cbkRyYWZ0eS5hdHRhY2hGaWxlID0gZnVuY3Rpb24oY29udGVudCwgYXR0YWNobWVudERlc2MpIHtcbiAgY29udGVudCA9IGNvbnRlbnQgfHwge1xuICAgIHR4dDogJydcbiAgfTtcblxuICBjb250ZW50LmVudCA9IGNvbnRlbnQuZW50IHx8IFtdO1xuICBjb250ZW50LmZtdCA9IGNvbnRlbnQuZm10IHx8IFtdO1xuXG4gIGNvbnRlbnQuZm10LnB1c2goe1xuICAgIGF0OiAtMSxcbiAgICBsZW46IDAsXG4gICAga2V5OiBjb250ZW50LmVudC5sZW5ndGhcbiAgfSk7XG5cbiAgY29uc3QgZXggPSB7XG4gICAgdHA6ICdFWCcsXG4gICAgZGF0YToge1xuICAgICAgbWltZTogYXR0YWNobWVudERlc2MubWltZSxcbiAgICAgIHZhbDogYXR0YWNobWVudERlc2MuZGF0YSxcbiAgICAgIG5hbWU6IGF0dGFjaG1lbnREZXNjLmZpbGVuYW1lLFxuICAgICAgcmVmOiBhdHRhY2htZW50RGVzYy5yZWZ1cmwsXG4gICAgICBzaXplOiBhdHRhY2htZW50RGVzYy5zaXplIHwgMFxuICAgIH1cbiAgfVxuICBpZiAoYXR0YWNobWVudERlc2MudXJsUHJvbWlzZSkge1xuICAgIGV4LmRhdGEuX3Byb2Nlc3NpbmcgPSB0cnVlO1xuICAgIGF0dGFjaG1lbnREZXNjLnVybFByb21pc2UudGhlbihcbiAgICAgIHVybCA9PiB7XG4gICAgICAgIGV4LmRhdGEucmVmID0gdXJsO1xuICAgICAgICBleC5kYXRhLl9wcm9jZXNzaW5nID0gdW5kZWZpbmVkO1xuICAgICAgfSxcbiAgICAgIF8gPT4ge1xuICAgICAgICAvKiBjYXRjaCB0aGUgZXJyb3IsIG90aGVyd2lzZSBpdCB3aWxsIGFwcGVhciBpbiB0aGUgY29uc29sZS4gKi9cbiAgICAgICAgZXguZGF0YS5fcHJvY2Vzc2luZyA9IHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICApO1xuICB9XG4gIGNvbnRlbnQuZW50LnB1c2goZXgpO1xuXG4gIHJldHVybiBjb250ZW50O1xufVxuXG4vKipcbiAqIFdyYXBzIGRyYWZ0eSBkb2N1bWVudCBpbnRvIGEgc2ltcGxlIGZvcm1hdHRpbmcgc3R5bGUuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl8c3RyaW5nfSBjb250ZW50IC0gZG9jdW1lbnQgb3Igc3RyaW5nIHRvIHdyYXAgaW50byBhIHN0eWxlLlxuICogQHBhcmFtIHtzdHJpbmd9IHN0eWxlIC0gdHdvLWxldHRlciBzdHlsZSB0byB3cmFwIGludG8uXG4gKiBAcGFyYW0ge251bWJlcn0gYXQgLSBpbmRleCB3aGVyZSB0aGUgc3R5bGUgc3RhcnRzLCBkZWZhdWx0IDAuXG4gKiBAcGFyYW0ge251bWJlcn0gbGVuIC0gbGVuZ3RoIG9mIHRoZSBmb3JtIGNvbnRlbnQsIGRlZmF1bHQgYWxsIG9mIGl0LlxuICpcbiAqIEByZXR1cm4ge0RyYWZ0eX0gdXBkYXRlZCBkb2N1bWVudC5cbiAqL1xuRHJhZnR5LndyYXBJbnRvID0gZnVuY3Rpb24oY29udGVudCwgc3R5bGUsIGF0LCBsZW4pIHtcbiAgaWYgKHR5cGVvZiBjb250ZW50ID09ICdzdHJpbmcnKSB7XG4gICAgY29udGVudCA9IHtcbiAgICAgIHR4dDogY29udGVudFxuICAgIH07XG4gIH1cbiAgY29udGVudC5mbXQgPSBjb250ZW50LmZtdCB8fCBbXTtcblxuICBjb250ZW50LmZtdC5wdXNoKHtcbiAgICBhdDogYXQgfHwgMCxcbiAgICBsZW46IGxlbiB8fCBjb250ZW50LnR4dC5sZW5ndGgsXG4gICAgdHA6IHN0eWxlLFxuICB9KTtcblxuICByZXR1cm4gY29udGVudDtcbn1cblxuLyoqXG4gKiBXcmFwcyBjb250ZW50IGludG8gYW4gaW50ZXJhY3RpdmUgZm9ybS5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eXxzdHJpbmd9IGNvbnRlbnQgLSB0byB3cmFwIGludG8gYSBmb3JtLlxuICogQHBhcmFtIHtudW1iZXJ9IGF0IC0gaW5kZXggd2hlcmUgdGhlIGZvcm1zIHN0YXJ0cy5cbiAqIEBwYXJhbSB7bnVtYmVyfSBsZW4gLSBsZW5ndGggb2YgdGhlIGZvcm0gY29udGVudC5cbiAqXG4gKiBAcmV0dXJuIHtEcmFmdHl9IHVwZGF0ZWQgZG9jdW1lbnQuXG4gKi9cbkRyYWZ0eS53cmFwQXNGb3JtID0gZnVuY3Rpb24oY29udGVudCwgYXQsIGxlbikge1xuICByZXR1cm4gRHJhZnR5LndyYXBJbnRvKGNvbnRlbnQsICdGTScsIGF0LCBsZW4pO1xufVxuXG4vKipcbiAqIEluc2VydCBjbGlja2FibGUgYnV0dG9uIGludG8gRHJhZnR5IGRvY3VtZW50LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fHN0cmluZ30gY29udGVudCAtIERyYWZ0eSBkb2N1bWVudCB0byBpbnNlcnQgYnV0dG9uIHRvIG9yIGEgc3RyaW5nIHRvIGJlIHVzZWQgYXMgYnV0dG9uIHRleHQuXG4gKiBAcGFyYW0ge251bWJlcn0gYXQgLSBsb2NhdGlvbiB3aGVyZSB0aGUgYnV0dG9uIGlzIGluc2VydGVkLlxuICogQHBhcmFtIHtudW1iZXJ9IGxlbiAtIHRoZSBsZW5ndGggb2YgdGhlIHRleHQgdG8gYmUgdXNlZCBhcyBidXR0b24gdGl0bGUuXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIHRoZSBidXR0b24uIENsaWVudCBzaG91bGQgcmV0dXJuIGl0IHRvIHRoZSBzZXJ2ZXIgd2hlbiB0aGUgYnV0dG9uIGlzIGNsaWNrZWQuXG4gKiBAcGFyYW0ge3N0cmluZ30gYWN0aW9uVHlwZSAtIHRoZSB0eXBlIG9mIHRoZSBidXR0b24sIG9uZSBvZiAndXJsJyBvciAncHViJy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBhY3Rpb25WYWx1ZSAtIHRoZSB2YWx1ZSB0byByZXR1cm4gb24gY2xpY2s6XG4gKiBAcGFyYW0ge3N0cmluZ30gcmVmVXJsIC0gdGhlIFVSTCB0byBnbyB0byB3aGVuIHRoZSAndXJsJyBidXR0b24gaXMgY2xpY2tlZC5cbiAqXG4gKiBAcmV0dXJuIHtEcmFmdHl9IHVwZGF0ZWQgZG9jdW1lbnQuXG4gKi9cbkRyYWZ0eS5pbnNlcnRCdXR0b24gPSBmdW5jdGlvbihjb250ZW50LCBhdCwgbGVuLCBuYW1lLCBhY3Rpb25UeXBlLCBhY3Rpb25WYWx1ZSwgcmVmVXJsKSB7XG4gIGlmICh0eXBlb2YgY29udGVudCA9PSAnc3RyaW5nJykge1xuICAgIGNvbnRlbnQgPSB7XG4gICAgICB0eHQ6IGNvbnRlbnRcbiAgICB9O1xuICB9XG5cbiAgaWYgKCFjb250ZW50IHx8ICFjb250ZW50LnR4dCB8fCBjb250ZW50LnR4dC5sZW5ndGggPCBhdCArIGxlbikge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgaWYgKGxlbiA8PSAwIHx8IFsndXJsJywgJ3B1YiddLmluZGV4T2YoYWN0aW9uVHlwZSkgPT0gLTEpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICAvLyBFbnN1cmUgcmVmVXJsIGlzIGEgc3RyaW5nLlxuICBpZiAoYWN0aW9uVHlwZSA9PSAndXJsJyAmJiAhcmVmVXJsKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgcmVmVXJsID0gJycgKyByZWZVcmw7XG5cbiAgY29udGVudC5lbnQgPSBjb250ZW50LmVudCB8fCBbXTtcbiAgY29udGVudC5mbXQgPSBjb250ZW50LmZtdCB8fCBbXTtcblxuICBjb250ZW50LmZtdC5wdXNoKHtcbiAgICBhdDogYXQgfCAwLFxuICAgIGxlbjogbGVuLFxuICAgIGtleTogY29udGVudC5lbnQubGVuZ3RoXG4gIH0pO1xuICBjb250ZW50LmVudC5wdXNoKHtcbiAgICB0cDogJ0JOJyxcbiAgICBkYXRhOiB7XG4gICAgICBhY3Q6IGFjdGlvblR5cGUsXG4gICAgICB2YWw6IGFjdGlvblZhbHVlLFxuICAgICAgcmVmOiByZWZVcmwsXG4gICAgICBuYW1lOiBuYW1lXG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gY29udGVudDtcbn1cblxuLyoqXG4gKiBBcHBlbmQgY2xpY2thYmxlIGJ1dHRvbiB0byBEcmFmdHkgZG9jdW1lbnQuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl8c3RyaW5nfSBjb250ZW50IC0gRHJhZnR5IGRvY3VtZW50IHRvIGluc2VydCBidXR0b24gdG8gb3IgYSBzdHJpbmcgdG8gYmUgdXNlZCBhcyBidXR0b24gdGV4dC5cbiAqIEBwYXJhbSB7c3RyaW5nfSB0aXRsZSAtIHRoZSB0ZXh0IHRvIGJlIHVzZWQgYXMgYnV0dG9uIHRpdGxlLlxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSB0aGUgYnV0dG9uLiBDbGllbnQgc2hvdWxkIHJldHVybiBpdCB0byB0aGUgc2VydmVyIHdoZW4gdGhlIGJ1dHRvbiBpcyBjbGlja2VkLlxuICogQHBhcmFtIHtzdHJpbmd9IGFjdGlvblR5cGUgLSB0aGUgdHlwZSBvZiB0aGUgYnV0dG9uLCBvbmUgb2YgJ3VybCcgb3IgJ3B1YicuXG4gKiBAcGFyYW0ge3N0cmluZ30gYWN0aW9uVmFsdWUgLSB0aGUgdmFsdWUgdG8gcmV0dXJuIG9uIGNsaWNrOlxuICogQHBhcmFtIHtzdHJpbmd9IHJlZlVybCAtIHRoZSBVUkwgdG8gZ28gdG8gd2hlbiB0aGUgJ3VybCcgYnV0dG9uIGlzIGNsaWNrZWQuXG4gKlxuICogQHJldHVybiB7RHJhZnR5fSB1cGRhdGVkIGRvY3VtZW50LlxuICovXG5EcmFmdHkuYXBwZW5kQnV0dG9uID0gZnVuY3Rpb24oY29udGVudCwgdGl0bGUsIG5hbWUsIGFjdGlvblR5cGUsIGFjdGlvblZhbHVlLCByZWZVcmwpIHtcbiAgY29udGVudCA9IGNvbnRlbnQgfHwge1xuICAgIHR4dDogJydcbiAgfTtcbiAgY29uc3QgYXQgPSBjb250ZW50LnR4dC5sZW5ndGg7XG4gIGNvbnRlbnQudHh0ICs9IHRpdGxlO1xuICByZXR1cm4gRHJhZnR5Lmluc2VydEJ1dHRvbihjb250ZW50LCBhdCwgdGl0bGUubGVuZ3RoLCBuYW1lLCBhY3Rpb25UeXBlLCBhY3Rpb25WYWx1ZSwgcmVmVXJsKTtcbn1cblxuLyoqXG4gKiBBdHRhY2ggYSBnZW5lcmljIEpTIG9iamVjdC4gVGhlIG9iamVjdCBpcyBhdHRhY2hlZCBhcyBhIGpzb24gc3RyaW5nLlxuICogSW50ZW5kZWQgZm9yIHJlcHJlc2VudGluZyBhIGZvcm0gcmVzcG9uc2UuXG4gKlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fSBjb250ZW50IC0gRHJhZnR5IGRvY3VtZW50IHRvIGF0dGFjaCBmaWxlIHRvLlxuICogQHBhcmFtIHtPYmplY3R9IGRhdGEgLSBkYXRhIHRvIGNvbnZlcnQgdG8ganNvbiBzdHJpbmcgYW5kIGF0dGFjaC5cbiAqIEByZXR1cm5zIHtEcmFmdHl9IHRoZSBzYW1lIGRvY3VtZW50IGFzIDxjb2RlPmNvbnRlbnQ8L2NvZGU+LlxuICovXG5EcmFmdHkuYXR0YWNoSlNPTiA9IGZ1bmN0aW9uKGNvbnRlbnQsIGRhdGEpIHtcbiAgY29udGVudCA9IGNvbnRlbnQgfHwge1xuICAgIHR4dDogJydcbiAgfTtcbiAgY29udGVudC5lbnQgPSBjb250ZW50LmVudCB8fCBbXTtcbiAgY29udGVudC5mbXQgPSBjb250ZW50LmZtdCB8fCBbXTtcblxuICBjb250ZW50LmZtdC5wdXNoKHtcbiAgICBhdDogLTEsXG4gICAgbGVuOiAwLFxuICAgIGtleTogY29udGVudC5lbnQubGVuZ3RoXG4gIH0pO1xuXG4gIGNvbnRlbnQuZW50LnB1c2goe1xuICAgIHRwOiAnRVgnLFxuICAgIGRhdGE6IHtcbiAgICAgIG1pbWU6IEpTT05fTUlNRV9UWVBFLFxuICAgICAgdmFsOiBkYXRhXG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gY29udGVudDtcbn1cbi8qKlxuICogQXBwZW5kIGxpbmUgYnJlYWsgdG8gYSBEcmFmdHkgZG9jdW1lbnQuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGNvbnRlbnQgLSBEcmFmdHkgZG9jdW1lbnQgdG8gYXBwZW5kIGxpbmVicmVhayB0by5cbiAqIEByZXR1cm5zIHtEcmFmdHl9IHRoZSBzYW1lIGRvY3VtZW50IGFzIDxjb2RlPmNvbnRlbnQ8L2NvZGU+LlxuICovXG5EcmFmdHkuYXBwZW5kTGluZUJyZWFrID0gZnVuY3Rpb24oY29udGVudCkge1xuICBjb250ZW50ID0gY29udGVudCB8fCB7XG4gICAgdHh0OiAnJ1xuICB9O1xuICBjb250ZW50LmZtdCA9IGNvbnRlbnQuZm10IHx8IFtdO1xuICBjb250ZW50LmZtdC5wdXNoKHtcbiAgICBhdDogY29udGVudC50eHQubGVuZ3RoLFxuICAgIGxlbjogMSxcbiAgICB0cDogJ0JSJ1xuICB9KTtcbiAgY29udGVudC50eHQgKz0gJyAnO1xuXG4gIHJldHVybiBjb250ZW50O1xufVxuLyoqXG4gKiBHaXZlbiBEcmFmdHkgZG9jdW1lbnQsIGNvbnZlcnQgaXQgdG8gSFRNTC5cbiAqIE5vIGF0dGVtcHQgaXMgbWFkZSB0byBzdHJpcCBwcmUtZXhpc3RpbmcgaHRtbCBtYXJrdXAuXG4gKiBUaGlzIGlzIHBvdGVudGlhbGx5IHVuc2FmZSBiZWNhdXNlIDxjb2RlPmNvbnRlbnQudHh0PC9jb2RlPiBtYXkgY29udGFpbiBtYWxpY2lvdXMgSFRNTFxuICogbWFya3VwLlxuICogQG1lbWJlcm9mIFRpbm9kZS5EcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eX0gZG9jIC0gZG9jdW1lbnQgdG8gY29udmVydC5cbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBIVE1MLXJlcHJlc2VudGF0aW9uIG9mIGNvbnRlbnQuXG4gKi9cbkRyYWZ0eS5VTlNBRkVfdG9IVE1MID0gZnVuY3Rpb24oZG9jKSB7XG4gIGNvbnN0IHRyZWUgPSBkcmFmdHlUb1RyZWUoZG9jKTtcbiAgY29uc3QgaHRtbEZvcm1hdHRlciA9IGZ1bmN0aW9uKHR5cGUsIGRhdGEsIHZhbHVlcykge1xuICAgIGNvbnN0IHRhZyA9IERFQ09SQVRPUlNbdHlwZV07XG4gICAgbGV0IHJlc3VsdCA9IHZhbHVlcyA/IHZhbHVlcy5qb2luKCcnKSA6ICcnO1xuICAgIGlmICh0YWcpIHtcbiAgICAgIHJlc3VsdCA9IHRhZy5vcGVuKGRhdGEpICsgcmVzdWx0ICsgdGFnLmNsb3NlKGRhdGEpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuICByZXR1cm4gdHJlZUJvdHRvbVVwKHRyZWUsIGh0bWxGb3JtYXR0ZXIsIDApO1xufVxuXG4vKipcbiAqIENhbGxiYWNrIGZvciBhcHBseWluZyBjdXN0b20gZm9ybWF0dGluZyB0byBhIERyYWZ0eSBkb2N1bWVudC5cbiAqIENhbGxlZCBvbmNlIGZvciBlYWNoIHN0eWxlIHNwYW4uXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQGNhbGxiYWNrIEZvcm1hdHRlclxuICogQHBhcmFtIHtzdHJpbmd9IHN0eWxlIC0gc3R5bGUgY29kZSBzdWNoIGFzIFwiU1RcIiBvciBcIklNXCIuXG4gKiBAcGFyYW0ge09iamVjdH0gZGF0YSAtIGVudGl0eSdzIGRhdGEuXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsdWVzIC0gcG9zc2libHkgc3R5bGVkIHN1YnNwYW5zIGNvbnRhaW5lZCBpbiB0aGlzIHN0eWxlIHNwYW4uXG4gKiBAcGFyYW0ge251bWJlcn0gaW5kZXggLSBpbmRleCBvZiB0aGUgZWxlbWVudCBndWFyYW50ZWVkIHRvIGJlIHVuaXF1ZS5cbiAqL1xuXG4vKipcbiAqIENvbnZlcnQgRHJhZnR5IGRvY3VtZW50IHRvIGEgcmVwcmVzZW50YXRpb24gc3VpdGFibGUgZm9yIGRpc3BsYXkuXG4gKiBUaGUgPGNvZGU+Y29udGV4dDwvY29kZT4gbWF5IGV4cG9zZSBhIGZ1bmN0aW9uIDxjb2RlPmdldEZvcm1hdHRlcihzdHlsZSk8L2NvZGU+LiBJZiBpdCdzIGF2YWlsYWJsZVxuICogaXQgd2lsbCBjYWxsIGl0IHRvIG9idGFpbiBhIDxjb2RlPmZvcm1hdHRlcjwvY29kZT4gZm9yIGEgc3VidHJlZSBvZiBzdHlsZXMgdW5kZXIgdGhlIDxjb2RlPnN0eWxlPC9jb2RlPi5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eXxPYmplY3R9IGNvbnRlbnQgLSBEcmFmdHkgZG9jdW1lbnQgdG8gdHJhbnNmb3JtLlxuICogQHBhcmFtIHtGb3JtYXR0ZXJ9IGZvcm1hdHRlciAtIGNhbGxiYWNrIHdoaWNoIGZvcm1hdHMgaW5kaXZpZHVhbCBlbGVtZW50cy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZXh0IC0gY29udGV4dCBwcm92aWRlZCB0byBmb3JtYXR0ZXIgYXMgPGNvZGU+dGhpczwvY29kZT4uXG4gKlxuICogQHJldHVybiB7T2JqZWN0fSB0cmFuc2Zvcm1lZCBvYmplY3RcbiAqL1xuRHJhZnR5LmZvcm1hdCA9IGZ1bmN0aW9uKG9yaWdpbmFsLCBmb3JtYXR0ZXIsIGNvbnRleHQpIHtcbiAgcmV0dXJuIHRyZWVCb3R0b21VcChkcmFmdHlUb1RyZWUob3JpZ2luYWwpLCBmb3JtYXR0ZXIsIDAsIFtdLCBjb250ZXh0KTtcbn1cblxuLyoqXG4gKiBTaG9ydGVuIERyYWZ0eSBkb2N1bWVudCBtYWtpbmcgdGhlIGRyYWZ0eSB0ZXh0IG5vIGxvbmdlciB0aGFuIHRoZSBsaW1pdC5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eXxzdHJpbmd9IG9yaWdpbmFsIC0gRHJhZnR5IG9iamVjdCB0byBzaG9ydGVuLlxuICogQHBhcmFtIHtudW1iZXJ9IGxpbWl0IC0gbGVuZ3RoIGluIGNoYXJhY3JldHMgdG8gc2hvcnRlbiB0by5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gbGlnaHQgLSByZW1vdmUgaGVhdnkgZGF0YSBmcm9tIGVudGl0aWVzLlxuICogQHJldHVybnMgbmV3IHNob3J0ZW5lZCBEcmFmdHkgb2JqZWN0IGxlYXZpbmcgdGhlIG9yaWdpbmFsIGludGFjdC5cbiAqL1xuRHJhZnR5LnNob3J0ZW4gPSBmdW5jdGlvbihvcmlnaW5hbCwgbGltaXQsIGxpZ2h0KSB7XG4gIGxldCB0cmVlID0gZHJhZnR5VG9UcmVlKG9yaWdpbmFsKTtcbiAgdHJlZSA9IHNob3J0ZW5UcmVlKHRyZWUsIGxpbWl0LCAn4oCmJyk7XG4gIGlmICh0cmVlICYmIGxpZ2h0KSB7XG4gICAgdHJlZSA9IGxpZ2h0RW50aXR5KHRyZWUpO1xuICB9XG4gIHJldHVybiB0cmVlVG9EcmFmdHkoe30sIHRyZWUsIFtdKTtcbn1cblxuLyoqXG4gKiBUcmFuc2Zvcm0gRHJhZnR5IGRvYyBmb3IgZm9yd2FyZGluZzogc3RyaXAgbGVhZGluZyBAbWVudGlvbiBhbmQgYW55IGxlYWRpbmcgbGluZSBicmVha3Mgb3Igd2hpdGVzcGFjZS5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eXxzdHJpbmd9IG9yaWdpbmFsIC0gRHJhZnR5IG9iamVjdCB0byBzaG9ydGVuLlxuICogQHJldHVybnMgY29udmVydGVkIERyYWZ0eSBvYmplY3QgbGVhdmluZyB0aGUgb3JpZ2luYWwgaW50YWN0LlxuICovXG5EcmFmdHkuZm9yd2FyZGVkQ29udGVudCA9IGZ1bmN0aW9uKG9yaWdpbmFsKSB7XG4gIGxldCB0cmVlID0gZHJhZnR5VG9UcmVlKG9yaWdpbmFsKTtcbiAgY29uc3Qgcm1NZW50aW9uID0gZnVuY3Rpb24obm9kZSkge1xuICAgIGlmIChub2RlLnR5cGUgPT0gJ01OJykge1xuICAgICAgaWYgKCFub2RlLnBhcmVudCB8fCAhbm9kZS5wYXJlbnQudHlwZSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cbiAgLy8gU3RyaXAgbGVhZGluZyBtZW50aW9uLlxuICB0cmVlID0gdHJlZVRvcERvd24odHJlZSwgcm1NZW50aW9uKTtcbiAgLy8gUmVtb3ZlIGxlYWRpbmcgd2hpdGVzcGFjZS5cbiAgdHJlZSA9IGxUcmltKHRyZWUpO1xuICAvLyBDb252ZXJ0IGJhY2sgdG8gRHJhZnR5LlxuICByZXR1cm4gdHJlZVRvRHJhZnR5KHt9LCB0cmVlLCBbXSk7XG59XG5cbi8qKlxuICogUHJlcGFyZSBEcmFmdHkgZG9jIGZvciB3cmFwcGluZyBpbnRvIFFRIGFzIGEgcmVwbHk6XG4gKiAgLSBSZXBsYWNlIGZvcndhcmRpbmcgbWVudGlvbiB3aXRoIHN5bWJvbCAn4p6mJyBhbmQgcmVtb3ZlIGRhdGEgKFVJRCkuXG4gKiAgLSBSZW1vdmUgcXVvdGVkIHRleHQgY29tcGxldGVseS5cbiAqICAtIFJlcGxhY2UgbGluZSBicmVha3Mgd2l0aCBzcGFjZXMuXG4gKiAgLSBTdHJpcCBlbnRpdGllcyBvZiBoZWF2eSBjb250ZW50LlxuICogIC0gTW92ZSBhdHRhY2htZW50cyB0byB0aGUgZW5kIG9mIHRoZSBkb2N1bWVudC5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eXxzdHJpbmd9IG9yaWdpbmFsIC0gRHJhZnR5IG9iamVjdCB0byBzaG9ydGVuLlxuICogQHBhcmFtIHtudW1iZXJ9IGxpbWl0IC0gbGVuZ3RoIGluIGNoYXJhY3RlcnMgdG8gc2hvcnRlbiB0by5cbiAqIEByZXR1cm5zIGNvbnZlcnRlZCBEcmFmdHkgb2JqZWN0IGxlYXZpbmcgdGhlIG9yaWdpbmFsIGludGFjdC5cbiAqL1xuRHJhZnR5LnJlcGx5Q29udGVudCA9IGZ1bmN0aW9uKG9yaWdpbmFsLCBsaW1pdCkge1xuICBjb25zdCBjb252TU5uUVFuQlIgPSBmdW5jdGlvbihub2RlKSB7XG4gICAgaWYgKG5vZGUudHlwZSA9PSAnUVEnKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9IGVsc2UgaWYgKG5vZGUudHlwZSA9PSAnTU4nKSB7XG4gICAgICBpZiAoKCFub2RlLnBhcmVudCB8fCAhbm9kZS5wYXJlbnQudHlwZSkgJiYgKG5vZGUudGV4dCB8fCAnJykuc3RhcnRzV2l0aCgn4p6mJykpIHtcbiAgICAgICAgbm9kZS50ZXh0ID0gJ+Kepic7XG4gICAgICAgIGRlbGV0ZSBub2RlLmNoaWxkcmVuO1xuICAgICAgICBkZWxldGUgbm9kZS5kYXRhO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAobm9kZS50eXBlID09ICdCUicpIHtcbiAgICAgIG5vZGUudGV4dCA9ICcgJztcbiAgICAgIGRlbGV0ZSBub2RlLnR5cGU7XG4gICAgICBkZWxldGUgbm9kZS5jaGlsZHJlbjtcbiAgICB9XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cblxuICBsZXQgdHJlZSA9IGRyYWZ0eVRvVHJlZShvcmlnaW5hbCk7XG4gIGlmICghdHJlZSkge1xuICAgIHJldHVybiBvcmlnaW5hbDtcbiAgfVxuXG4gIC8vIFN0cmlwIGxlYWRpbmcgbWVudGlvbi5cbiAgdHJlZSA9IHRyZWVUb3BEb3duKHRyZWUsIGNvbnZNTm5RUW5CUik7XG4gIC8vIE1vdmUgYXR0YWNobWVudHMgdG8gdGhlIGVuZCBvZiB0aGUgZG9jLlxuICB0cmVlID0gYXR0YWNobWVudHNUb0VuZCh0cmVlLCBNQVhfUFJFVklFV19BVFRBQ0hNRU5UUyk7XG4gIC8vIFNob3J0ZW4gdGhlIGRvYy5cbiAgdHJlZSA9IHNob3J0ZW5UcmVlKHRyZWUsIGxpbWl0LCAn4oCmJyk7XG4gIC8vIFN0cmlwIGhlYXZ5IGVsZW1lbnRzIGV4Y2VwdCBJTS5kYXRhWyd2YWwnXSBhbmQgVkQuZGF0YVsncHJldmlldyddIChoYXZlIHRvIGtlZXAgdGhlbSB0byBnZW5lcmF0ZSBwcmV2aWV3cyBsYXRlcikuXG4gIGNvbnN0IGZpbHRlciA9IG5vZGUgPT4ge1xuICAgIHN3aXRjaCAobm9kZS50eXBlKSB7XG4gICAgICBjYXNlICdJTSc6XG4gICAgICAgIHJldHVybiBbJ3ZhbCddO1xuICAgICAgY2FzZSAnVkQnOlxuICAgICAgICByZXR1cm4gWydwcmV2aWV3J107XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9O1xuICB0cmVlID0gbGlnaHRFbnRpdHkodHJlZSwgZmlsdGVyKTtcbiAgLy8gQ29udmVydCBiYWNrIHRvIERyYWZ0eS5cbiAgcmV0dXJuIHRyZWVUb0RyYWZ0eSh7fSwgdHJlZSwgW10pO1xufVxuXG5cbi8qKlxuICogR2VuZXJhdGUgZHJhZnR5IHByZXZpZXc6XG4gKiAgLSBTaG9ydGVuIHRoZSBkb2N1bWVudC5cbiAqICAtIFN0cmlwIGFsbCBoZWF2eSBlbnRpdHkgZGF0YSBsZWF2aW5nIGp1c3QgaW5saW5lIHN0eWxlcyBhbmQgZW50aXR5IHJlZmVyZW5jZXMuXG4gKiAgLSBSZXBsYWNlIGxpbmUgYnJlYWtzIHdpdGggc3BhY2VzLlxuICogIC0gUmVwbGFjZSBjb250ZW50IG9mIFFRIHdpdGggYSBzcGFjZS5cbiAqICAtIFJlcGxhY2UgZm9yd2FyZGluZyBtZW50aW9uIHdpdGggc3ltYm9sICfinqYnLlxuICogbW92ZSBhbGwgYXR0YWNobWVudHMgdG8gdGhlIGVuZCBvZiB0aGUgZG9jdW1lbnQgYW5kIG1ha2UgdGhlbSB2aXNpYmxlLlxuICogVGhlIDxjb2RlPmNvbnRleHQ8L2NvZGU+IG1heSBleHBvc2UgYSBmdW5jdGlvbiA8Y29kZT5nZXRGb3JtYXR0ZXIoc3R5bGUpPC9jb2RlPi4gSWYgaXQncyBhdmFpbGFibGVcbiAqIGl0IHdpbGwgY2FsbCBpdCB0byBvYnRhaW4gYSA8Y29kZT5mb3JtYXR0ZXI8L2NvZGU+IGZvciBhIHN1YnRyZWUgb2Ygc3R5bGVzIHVuZGVyIHRoZSA8Y29kZT5zdHlsZTwvY29kZT4uXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl8c3RyaW5nfSBvcmlnaW5hbCAtIERyYWZ0eSBvYmplY3QgdG8gc2hvcnRlbi5cbiAqIEBwYXJhbSB7bnVtYmVyfSBsaW1pdCAtIGxlbmd0aCBpbiBjaGFyYWN0ZXJzIHRvIHNob3J0ZW4gdG8uXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGZvcndhcmRpbmcgLSB0aGlzIGEgZm9yd2FyZGluZyBtZXNzYWdlIHByZXZpZXcuXG4gKiBAcmV0dXJucyBuZXcgc2hvcnRlbmVkIERyYWZ0eSBvYmplY3QgbGVhdmluZyB0aGUgb3JpZ2luYWwgaW50YWN0LlxuICovXG5EcmFmdHkucHJldmlldyA9IGZ1bmN0aW9uKG9yaWdpbmFsLCBsaW1pdCwgZm9yd2FyZGluZykge1xuICBsZXQgdHJlZSA9IGRyYWZ0eVRvVHJlZShvcmlnaW5hbCk7XG5cbiAgLy8gTW92ZSBhdHRhY2htZW50cyB0byB0aGUgZW5kLlxuICB0cmVlID0gYXR0YWNobWVudHNUb0VuZCh0cmVlLCBNQVhfUFJFVklFV19BVFRBQ0hNRU5UUyk7XG5cbiAgLy8gQ29udmVydCBsZWFkaW5nIG1lbnRpb24gdG8gJ+KepicgYW5kIHJlcGxhY2UgUVEgYW5kIEJSIHdpdGggYSBzcGFjZSAnICcuXG4gIGNvbnN0IGNvbnZNTm5RUW5CUiA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICBpZiAobm9kZS50eXBlID09ICdNTicpIHtcbiAgICAgIGlmICgoIW5vZGUucGFyZW50IHx8ICFub2RlLnBhcmVudC50eXBlKSAmJiAobm9kZS50ZXh0IHx8ICcnKS5zdGFydHNXaXRoKCfinqYnKSkge1xuICAgICAgICBub2RlLnRleHQgPSAn4p6mJztcbiAgICAgICAgZGVsZXRlIG5vZGUuY2hpbGRyZW47XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChub2RlLnR5cGUgPT0gJ1FRJykge1xuICAgICAgbm9kZS50ZXh0ID0gJyAnO1xuICAgICAgZGVsZXRlIG5vZGUuY2hpbGRyZW47XG4gICAgfSBlbHNlIGlmIChub2RlLnR5cGUgPT0gJ0JSJykge1xuICAgICAgbm9kZS50ZXh0ID0gJyAnO1xuICAgICAgZGVsZXRlIG5vZGUuY2hpbGRyZW47XG4gICAgICBkZWxldGUgbm9kZS50eXBlO1xuICAgIH1cbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuICB0cmVlID0gdHJlZVRvcERvd24odHJlZSwgY29udk1OblFRbkJSKTtcblxuICB0cmVlID0gc2hvcnRlblRyZWUodHJlZSwgbGltaXQsICfigKYnKTtcbiAgaWYgKGZvcndhcmRpbmcpIHtcbiAgICAvLyBLZWVwIHNvbWUgSU0gYW5kIFZEIGRhdGEgZm9yIHByZXZpZXcuXG4gICAgY29uc3QgZmlsdGVyID0ge1xuICAgICAgSU06IFsndmFsJ10sXG4gICAgICBWRDogWydwcmV2aWV3J11cbiAgICB9O1xuICAgIHRyZWUgPSBsaWdodEVudGl0eSh0cmVlLCBub2RlID0+IHtcbiAgICAgIHJldHVybiBmaWx0ZXJbbm9kZS50eXBlXTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICB0cmVlID0gbGlnaHRFbnRpdHkodHJlZSk7XG4gIH1cblxuICAvLyBDb252ZXJ0IGJhY2sgdG8gRHJhZnR5LlxuICByZXR1cm4gdHJlZVRvRHJhZnR5KHt9LCB0cmVlLCBbXSk7XG59XG5cbi8qKlxuICogR2l2ZW4gRHJhZnR5IGRvY3VtZW50LCBjb252ZXJ0IGl0IHRvIHBsYWluIHRleHQuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGNvbnRlbnQgLSBkb2N1bWVudCB0byBjb252ZXJ0IHRvIHBsYWluIHRleHQuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBwbGFpbi10ZXh0IHJlcHJlc2VudGF0aW9uIG9mIHRoZSBkcmFmdHkgZG9jdW1lbnQuXG4gKi9cbkRyYWZ0eS50b1BsYWluVGV4dCA9IGZ1bmN0aW9uKGNvbnRlbnQpIHtcbiAgcmV0dXJuIHR5cGVvZiBjb250ZW50ID09ICdzdHJpbmcnID8gY29udGVudCA6IGNvbnRlbnQudHh0O1xufVxuXG4vKipcbiAqIENoZWNrIGlmIHRoZSBkb2N1bWVudCBoYXMgbm8gbWFya3VwIGFuZCBubyBlbnRpdGllcy5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eX0gY29udGVudCAtIGNvbnRlbnQgdG8gY2hlY2sgZm9yIHByZXNlbmNlIG9mIG1hcmt1cC5cbiAqIEByZXR1cm5zIDxjb2RlPnRydWU8L2NvZGU+IGlzIGNvbnRlbnQgaXMgcGxhaW4gdGV4dCwgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAqL1xuRHJhZnR5LmlzUGxhaW5UZXh0ID0gZnVuY3Rpb24oY29udGVudCkge1xuICByZXR1cm4gdHlwZW9mIGNvbnRlbnQgPT0gJ3N0cmluZycgfHwgIShjb250ZW50LmZtdCB8fCBjb250ZW50LmVudCk7XG59XG5cbi8qKlxuICogQ29udmVydCBkb2N1bWVudCB0byBwbGFpbiB0ZXh0IHdpdGggbWFya2Rvd24uIEFsbCBlbGVtZW50cyB3aGljaCBjYW5ub3RcbiAqIGJlIHJlcHJlc2VudGVkIGluIG1hcmtkb3duIGFyZSBzdHJpcHBlZC5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eX0gY29udGVudCAtIGRvY3VtZW50IHRvIGNvbnZlcnQgdG8gcGxhaW4gdGV4dCB3aXRoIG1hcmtkb3duLlxuICovXG5EcmFmdHkudG9NYXJrZG93biA9IGZ1bmN0aW9uKGNvbnRlbnQpIHtcbiAgbGV0IHRyZWUgPSBkcmFmdHlUb1RyZWUoY29udGVudCk7XG4gIGNvbnN0IG1kRm9ybWF0dGVyID0gZnVuY3Rpb24odHlwZSwgXywgdmFsdWVzKSB7XG4gICAgY29uc3QgZGVmID0gRk9STUFUX1RBR1NbdHlwZV07XG4gICAgbGV0IHJlc3VsdCA9ICh2YWx1ZXMgPyB2YWx1ZXMuam9pbignJykgOiAnJyk7XG4gICAgaWYgKGRlZikge1xuICAgICAgaWYgKGRlZi5pc1ZvaWQpIHtcbiAgICAgICAgcmVzdWx0ID0gZGVmLm1kX3RhZyB8fCAnJztcbiAgICAgIH0gZWxzZSBpZiAoZGVmLm1kX3RhZykge1xuICAgICAgICByZXN1bHQgPSBkZWYubWRfdGFnICsgcmVzdWx0ICsgZGVmLm1kX3RhZztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbiAgcmV0dXJuIHRyZWVCb3R0b21VcCh0cmVlLCBtZEZvcm1hdHRlciwgMCk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIHRoZSBvYmplY3QgcmVwcmVzZXRzIGlzIGEgdmFsaWQgRHJhZnR5IGRvY3VtZW50LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fSBjb250ZW50IC0gY29udGVudCB0byBjaGVjayBmb3IgdmFsaWRpdHkuXG4gKiBAcmV0dXJucyA8Y29kZT50cnVlPC9jb2RlPiBpcyBjb250ZW50IGlzIHZhbGlkLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICovXG5EcmFmdHkuaXNWYWxpZCA9IGZ1bmN0aW9uKGNvbnRlbnQpIHtcbiAgaWYgKCFjb250ZW50KSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3Qge1xuICAgIHR4dCxcbiAgICBmbXQsXG4gICAgZW50XG4gIH0gPSBjb250ZW50O1xuXG4gIGlmICghdHh0ICYmIHR4dCAhPT0gJycgJiYgIWZtdCAmJiAhZW50KSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3QgdHh0X3R5cGUgPSB0eXBlb2YgdHh0O1xuICBpZiAodHh0X3R5cGUgIT0gJ3N0cmluZycgJiYgdHh0X3R5cGUgIT0gJ3VuZGVmaW5lZCcgJiYgdHh0ICE9PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBmbXQgIT0gJ3VuZGVmaW5lZCcgJiYgIUFycmF5LmlzQXJyYXkoZm10KSAmJiBmbXQgIT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAodHlwZW9mIGVudCAhPSAndW5kZWZpbmVkJyAmJiAhQXJyYXkuaXNBcnJheShlbnQpICYmIGVudCAhPT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLyoqXG4gKiBDaGVjayBpZiB0aGUgZHJhZnR5IGRvY3VtZW50IGhhcyBhdHRhY2htZW50czogc3R5bGUgRVggYW5kIG91dHNpZGUgb2Ygbm9ybWFsIHJlbmRlcmluZyBmbG93LFxuICogaS5lLiA8Y29kZT5hdCA9IC0xPC9jb2RlPi5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eX0gY29udGVudCAtIGRvY3VtZW50IHRvIGNoZWNrIGZvciBhdHRhY2htZW50cy5cbiAqIEByZXR1cm5zIDxjb2RlPnRydWU8L2NvZGU+IGlmIHRoZXJlIGFyZSBhdHRhY2htZW50cy5cbiAqL1xuRHJhZnR5Lmhhc0F0dGFjaG1lbnRzID0gZnVuY3Rpb24oY29udGVudCkge1xuICBpZiAoIUFycmF5LmlzQXJyYXkoY29udGVudC5mbXQpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGZvciAobGV0IGkgaW4gY29udGVudC5mbXQpIHtcbiAgICBjb25zdCBmbXQgPSBjb250ZW50LmZtdFtpXTtcbiAgICBpZiAoZm10ICYmIGZtdC5hdCA8IDApIHtcbiAgICAgIGNvbnN0IGVudCA9IGNvbnRlbnQuZW50W2ZtdC5rZXkgfCAwXTtcbiAgICAgIHJldHVybiBlbnQgJiYgZW50LnRwID09ICdFWCcgJiYgZW50LmRhdGE7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBDYWxsYmFjayBmb3IgZW51bWVyYXRpbmcgZW50aXRpZXMgaW4gYSBEcmFmdHkgZG9jdW1lbnQuXG4gKiBDYWxsZWQgb25jZSBmb3IgZWFjaCBlbnRpdHkuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQGNhbGxiYWNrIEVudGl0eUNhbGxiYWNrXG4gKiBAcGFyYW0ge09iamVjdH0gZGF0YSBlbnRpdHkgZGF0YS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBlbnRpdHkgdHlwZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCBlbnRpdHkncyBpbmRleCBpbiBgY29udGVudC5lbnRgLlxuICpcbiAqIEByZXR1cm4gJ3RydWUtaXNoJyB0byBzdG9wIHByb2Nlc3NpbmcsICdmYWxzZS1pc2gnIG90aGVyd2lzZS5cbiAqL1xuXG4vKipcbiAqIEVudW1lcmF0ZSBhdHRhY2htZW50czogc3R5bGUgRVggYW5kIG91dHNpZGUgb2Ygbm9ybWFsIHJlbmRlcmluZyBmbG93LCBpLmUuIDxjb2RlPmF0ID0gLTE8L2NvZGU+LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fSBjb250ZW50IC0gZG9jdW1lbnQgdG8gcHJvY2VzcyBmb3IgYXR0YWNobWVudHMuXG4gKiBAcGFyYW0ge0VudGl0eUNhbGxiYWNrfSBjYWxsYmFjayAtIGNhbGxiYWNrIHRvIGNhbGwgZm9yIGVhY2ggYXR0YWNobWVudC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZXh0IC0gdmFsdWUgb2YgXCJ0aGlzXCIgZm9yIGNhbGxiYWNrLlxuICovXG5EcmFmdHkuYXR0YWNobWVudHMgPSBmdW5jdGlvbihjb250ZW50LCBjYWxsYmFjaywgY29udGV4dCkge1xuICBpZiAoIUFycmF5LmlzQXJyYXkoY29udGVudC5mbXQpKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGxldCBjb3VudCA9IDA7XG4gIGZvciAobGV0IGkgaW4gY29udGVudC5lbnQpIHtcbiAgICBsZXQgZm10ID0gY29udGVudC5mbXRbaV07XG4gICAgaWYgKGZtdCAmJiBmbXQuYXQgPCAwKSB7XG4gICAgICBjb25zdCBlbnQgPSBjb250ZW50LmVudFtmbXQua2V5IHwgMF07XG4gICAgICBpZiAoZW50ICYmIGVudC50cCA9PSAnRVgnICYmIGVudC5kYXRhKSB7XG4gICAgICAgIGlmIChjYWxsYmFjay5jYWxsKGNvbnRleHQsIGVudC5kYXRhLCBjb3VudCsrLCAnRVgnKSkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xufVxuXG4vKipcbiAqIENoZWNrIGlmIHRoZSBkcmFmdHkgZG9jdW1lbnQgaGFzIGVudGl0aWVzLlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fSBjb250ZW50IC0gZG9jdW1lbnQgdG8gY2hlY2sgZm9yIGVudGl0aWVzLlxuICogQHJldHVybnMgPGNvZGU+dHJ1ZTwvY29kZT4gaWYgdGhlcmUgYXJlIGVudGl0aWVzLlxuICovXG5EcmFmdHkuaGFzRW50aXRpZXMgPSBmdW5jdGlvbihjb250ZW50KSB7XG4gIHJldHVybiBjb250ZW50LmVudCAmJiBjb250ZW50LmVudC5sZW5ndGggPiAwO1xufVxuXG4vKipcbiAqIEVudW1lcmF0ZSBlbnRpdGllcy4gRW51bWVyYXRpb24gc3RvcHMgaWYgY2FsbGJhY2sgcmV0dXJucyAndHJ1ZScuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGNvbnRlbnQgLSBkb2N1bWVudCB3aXRoIGVudGl0aWVzIHRvIGVudW1lcmF0ZS5cbiAqIEBwYXJhbSB7RW50aXR5Q2FsbGJhY2t9IGNhbGxiYWNrIC0gY2FsbGJhY2sgdG8gY2FsbCBmb3IgZWFjaCBlbnRpdHkuXG4gKiBAcGFyYW0ge09iamVjdH0gY29udGV4dCAtIHZhbHVlIG9mIFwidGhpc1wiIGZvciBjYWxsYmFjay5cbiAqXG4gKi9cbkRyYWZ0eS5lbnRpdGllcyA9IGZ1bmN0aW9uKGNvbnRlbnQsIGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gIGlmIChjb250ZW50LmVudCAmJiBjb250ZW50LmVudC5sZW5ndGggPiAwKSB7XG4gICAgZm9yIChsZXQgaSBpbiBjb250ZW50LmVudCkge1xuICAgICAgaWYgKGNvbnRlbnQuZW50W2ldKSB7XG4gICAgICAgIGlmIChjYWxsYmFjay5jYWxsKGNvbnRleHQsIGNvbnRlbnQuZW50W2ldLmRhdGEsIGksIGNvbnRlbnQuZW50W2ldLnRwKSkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQ2FsbGJhY2sgZm9yIGVudW1lcmF0aW5nIHN0eWxlcyAoaW5saW5lIGZvcm1hdHMpIGluIGEgRHJhZnR5IGRvY3VtZW50LlxuICogQ2FsbGVkIG9uY2UgZm9yIGVhY2ggc3R5bGUuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQGNhbGxiYWNrIFN0eWxlQ2FsbGJhY2tcbiAqIEBwYXJhbSB7c3RyaW5nfSB0cCAtIGZvcm1hdCB0eXBlLlxuICogQHBhcmFtIHtudW1iZXJ9IGF0IC0gc3RhcnRpbmcgcG9zaXRpb24gb2YgdGhlIGZvcm1hdCBpbiB0ZXh0LlxuICogQHBhcmFtIHtudW1iZXJ9IGxlbiAtIGV4dGVudCBvZiB0aGUgZm9ybWF0IGluIGNoYXJhY3RlcnMuXG4gKiBAcGFyYW0ge251bWJlcn0ga2V5IC0gaW5kZXggb2YgdGhlIGVudGl0eSBpZiBmb3JtYXQgaXMgYSByZWZlcmVuY2UuXG4gKiBAcGFyYW0ge251bWJlcn0gaW5kZXggLSBzdHlsZSdzIGluZGV4IGluIGBjb250ZW50LmZtdGAuXG4gKlxuICogQHJldHVybiAndHJ1ZS1pc2gnIHRvIHN0b3AgcHJvY2Vzc2luZywgJ2ZhbHNlLWlzaCcgb3RoZXJ3aXNlLlxuICovXG5cbi8qKlxuICogRW51bWVyYXRlIHN0eWxlcyAoaW5saW5lIGZvcm1hdHMpLiBFbnVtZXJhdGlvbiBzdG9wcyBpZiBjYWxsYmFjayByZXR1cm5zICd0cnVlJy5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eX0gY29udGVudCAtIGRvY3VtZW50IHdpdGggc3R5bGVzIChmb3JtYXRzKSB0byBlbnVtZXJhdGUuXG4gKiBAcGFyYW0ge1N0eWxlQ2FsbGJhY2t9IGNhbGxiYWNrIC0gY2FsbGJhY2sgdG8gY2FsbCBmb3IgZWFjaCBmb3JtYXQuXG4gKiBAcGFyYW0ge09iamVjdH0gY29udGV4dCAtIHZhbHVlIG9mIFwidGhpc1wiIGZvciBjYWxsYmFjay5cbiAqL1xuRHJhZnR5LnN0eWxlcyA9IGZ1bmN0aW9uKGNvbnRlbnQsIGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gIGlmIChjb250ZW50LmZtdCAmJiBjb250ZW50LmZtdC5sZW5ndGggPiAwKSB7XG4gICAgZm9yIChsZXQgaSBpbiBjb250ZW50LmZtdCkge1xuICAgICAgY29uc3QgZm10ID0gY29udGVudC5mbXRbaV07XG4gICAgICBpZiAoZm10KSB7XG4gICAgICAgIGlmIChjYWxsYmFjay5jYWxsKGNvbnRleHQsIGZtdC50cCwgZm10LmF0LCBmbXQubGVuLCBmbXQua2V5LCBpKSkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogUmVtb3ZlIHVucmVjb2duaXplZCBmaWVsZHMgZnJvbSBlbnRpdHkgZGF0YVxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fSBjb250ZW50IC0gZG9jdW1lbnQgd2l0aCBlbnRpdGllcyB0byBlbnVtZXJhdGUuXG4gKiBAcmV0dXJucyBjb250ZW50LlxuICovXG5EcmFmdHkuc2FuaXRpemVFbnRpdGllcyA9IGZ1bmN0aW9uKGNvbnRlbnQpIHtcbiAgaWYgKGNvbnRlbnQgJiYgY29udGVudC5lbnQgJiYgY29udGVudC5lbnQubGVuZ3RoID4gMCkge1xuICAgIGZvciAobGV0IGkgaW4gY29udGVudC5lbnQpIHtcbiAgICAgIGNvbnN0IGVudCA9IGNvbnRlbnQuZW50W2ldO1xuICAgICAgaWYgKGVudCAmJiBlbnQuZGF0YSkge1xuICAgICAgICBjb25zdCBkYXRhID0gY29weUVudERhdGEoZW50LmRhdGEpO1xuICAgICAgICBpZiAoZGF0YSkge1xuICAgICAgICAgIGNvbnRlbnQuZW50W2ldLmRhdGEgPSBkYXRhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRlbGV0ZSBjb250ZW50LmVudFtpXS5kYXRhO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBjb250ZW50O1xufVxuXG4vKipcbiAqIEdpdmVuIHRoZSBlbnRpdHksIGdldCBVUkwgd2hpY2ggY2FuIGJlIHVzZWQgZm9yIGRvd25sb2FkaW5nXG4gKiBlbnRpdHkgZGF0YS5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZW50RGF0YSAtIGVudGl0eS5kYXRhIHRvIGdldCB0aGUgVVJsIGZyb20uXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBVUkwgdG8gZG93bmxvYWQgZW50aXR5IGRhdGEgb3IgPGNvZGU+bnVsbDwvY29kZT4uXG4gKi9cbkRyYWZ0eS5nZXREb3dubG9hZFVybCA9IGZ1bmN0aW9uKGVudERhdGEpIHtcbiAgbGV0IHVybCA9IG51bGw7XG4gIGlmIChlbnREYXRhLm1pbWUgIT0gSlNPTl9NSU1FX1RZUEUgJiYgZW50RGF0YS52YWwpIHtcbiAgICB1cmwgPSBiYXNlNjR0b09iamVjdFVybChlbnREYXRhLnZhbCwgZW50RGF0YS5taW1lLCBEcmFmdHkubG9nZ2VyKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZW50RGF0YS5yZWYgPT0gJ3N0cmluZycpIHtcbiAgICB1cmwgPSBlbnREYXRhLnJlZjtcbiAgfVxuICByZXR1cm4gdXJsO1xufVxuXG4vKipcbiAqIENoZWNrIGlmIHRoZSBlbnRpdHkgZGF0YSBpcyBub3QgcmVhZHkgZm9yIHNlbmRpbmcsIHN1Y2ggYXMgYmVpbmcgdXBsb2FkZWQgdG8gdGhlIHNlcnZlci5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZW50aXR5LmRhdGEgdG8gZ2V0IHRoZSBVUmwgZnJvbS5cbiAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIHVwbG9hZCBpcyBpbiBwcm9ncmVzcywgZmFsc2Ugb3RoZXJ3aXNlLlxuICovXG5EcmFmdHkuaXNQcm9jZXNzaW5nID0gZnVuY3Rpb24oZW50RGF0YSkge1xuICByZXR1cm4gISFlbnREYXRhLl9wcm9jZXNzaW5nO1xufVxuXG4vKipcbiAqIEdpdmVuIHRoZSBlbnRpdHksIGdldCBVUkwgd2hpY2ggY2FuIGJlIHVzZWQgZm9yIHByZXZpZXdpbmdcbiAqIHRoZSBlbnRpdHkuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGVudGl0eS5kYXRhIHRvIGdldCB0aGUgVVJsIGZyb20uXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gdXJsIGZvciBwcmV2aWV3aW5nIG9yIG51bGwgaWYgbm8gc3VjaCB1cmwgaXMgYXZhaWxhYmxlLlxuICovXG5EcmFmdHkuZ2V0UHJldmlld1VybCA9IGZ1bmN0aW9uKGVudERhdGEpIHtcbiAgcmV0dXJuIGVudERhdGEudmFsID8gYmFzZTY0dG9PYmplY3RVcmwoZW50RGF0YS52YWwsIGVudERhdGEubWltZSwgRHJhZnR5LmxvZ2dlcikgOiBudWxsO1xufVxuXG4vKipcbiAqIEdldCBhcHByb3hpbWF0ZSBzaXplIG9mIHRoZSBlbnRpdHkuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGVudERhdGEgLSBlbnRpdHkuZGF0YSB0byBnZXQgdGhlIHNpemUgZm9yLlxuICogQHJldHVybnMge251bWJlcn0gc2l6ZSBvZiBlbnRpdHkgZGF0YSBpbiBieXRlcy5cbiAqL1xuRHJhZnR5LmdldEVudGl0eVNpemUgPSBmdW5jdGlvbihlbnREYXRhKSB7XG4gIC8vIEVpdGhlciBzaXplIGhpbnQgb3IgbGVuZ3RoIG9mIHZhbHVlLiBUaGUgdmFsdWUgaXMgYmFzZTY0IGVuY29kZWQsXG4gIC8vIHRoZSBhY3R1YWwgb2JqZWN0IHNpemUgaXMgc21hbGxlciB0aGFuIHRoZSBlbmNvZGVkIGxlbmd0aC5cbiAgcmV0dXJuIGVudERhdGEuc2l6ZSA/IGVudERhdGEuc2l6ZSA6IGVudERhdGEudmFsID8gKGVudERhdGEudmFsLmxlbmd0aCAqIDAuNzUpIHwgMCA6IDA7XG59XG5cbi8qKlxuICogR2V0IGVudGl0eSBtaW1lIHR5cGUuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGVudERhdGEgLSBlbnRpdHkuZGF0YSB0byBnZXQgdGhlIHR5cGUgZm9yLlxuICogQHJldHVybnMge3N0cmluZ30gbWltZSB0eXBlIG9mIGVudGl0eS5cbiAqL1xuRHJhZnR5LmdldEVudGl0eU1pbWVUeXBlID0gZnVuY3Rpb24oZW50RGF0YSkge1xuICByZXR1cm4gZW50RGF0YS5taW1lIHx8ICd0ZXh0L3BsYWluJztcbn1cblxuLyoqXG4gKiBHZXQgSFRNTCB0YWcgZm9yIGEgZ2l2ZW4gdHdvLWxldHRlciBzdHlsZSBuYW1lLlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHlsZSAtIHR3by1sZXR0ZXIgc3R5bGUsIGxpa2UgU1Qgb3IgTE4uXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gSFRNTCB0YWcgbmFtZSBpZiBzdHlsZSBpcyBmb3VuZCwge2NvZGU6IHVuZGVmaW5lZH0gaWYgc3R5bGUgaXMgZmFsc2lzaCBvciBub3QgZm91bmQuXG4gKi9cbkRyYWZ0eS50YWdOYW1lID0gZnVuY3Rpb24oc3R5bGUpIHtcbiAgcmV0dXJuIEZPUk1BVF9UQUdTW3N0eWxlXSAmJiBGT1JNQVRfVEFHU1tzdHlsZV0uaHRtbF90YWc7XG59XG5cbi8qKlxuICogRm9yIGEgZ2l2ZW4gZGF0YSBidW5kbGUgZ2VuZXJhdGUgYW4gb2JqZWN0IHdpdGggSFRNTCBhdHRyaWJ1dGVzLFxuICogZm9yIGluc3RhbmNlLCBnaXZlbiB7dXJsOiBcImh0dHA6Ly93d3cuZXhhbXBsZS5jb20vXCJ9IHJldHVyblxuICoge2hyZWY6IFwiaHR0cDovL3d3dy5leGFtcGxlLmNvbS9cIn1cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gc3R5bGUgLSB0d28tbGV0dGVyIHN0eWxlIHRvIGdlbmVyYXRlIGF0dHJpYnV0ZXMgZm9yLlxuICogQHBhcmFtIHtPYmplY3R9IGRhdGEgLSBkYXRhIGJ1bmRsZSB0byBjb252ZXJ0IHRvIGF0dHJpYnV0ZXNcbiAqXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBvYmplY3Qgd2l0aCBIVE1MIGF0dHJpYnV0ZXMuXG4gKi9cbkRyYWZ0eS5hdHRyVmFsdWUgPSBmdW5jdGlvbihzdHlsZSwgZGF0YSkge1xuICBpZiAoZGF0YSAmJiBERUNPUkFUT1JTW3N0eWxlXSkge1xuICAgIHJldHVybiBERUNPUkFUT1JTW3N0eWxlXS5wcm9wcyhkYXRhKTtcbiAgfVxuXG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogRHJhZnR5IE1JTUUgdHlwZS5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBjb250ZW50LVR5cGUgXCJ0ZXh0L3gtZHJhZnR5XCIuXG4gKi9cbkRyYWZ0eS5nZXRDb250ZW50VHlwZSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gRFJBRlRZX01JTUVfVFlQRTtcbn1cblxuLy8gPT09PT09PT09PT09PT09PT1cbi8vIFV0aWxpdHkgbWV0aG9kcy5cbi8vID09PT09PT09PT09PT09PT09XG5cbi8vIFRha2UgYSBzdHJpbmcgYW5kIGRlZmluZWQgZWFybGllciBzdHlsZSBzcGFucywgcmUtY29tcG9zZSB0aGVtIGludG8gYSB0cmVlIHdoZXJlIGVhY2ggbGVhZiBpc1xuLy8gYSBzYW1lLXN0eWxlIChpbmNsdWRpbmcgdW5zdHlsZWQpIHN0cmluZy4gSS5lLiAnaGVsbG8gKmJvbGQgX2l0YWxpY18qIGFuZCB+bW9yZX4gd29ybGQnIC0+XG4vLyAoJ2hlbGxvICcsIChiOiAnYm9sZCAnLCAoaTogJ2l0YWxpYycpKSwgJyBhbmQgJywgKHM6ICdtb3JlJyksICcgd29ybGQnKTtcbi8vXG4vLyBUaGlzIGlzIG5lZWRlZCBpbiBvcmRlciB0byBjbGVhciBtYXJrdXAsIGkuZS4gJ2hlbGxvICp3b3JsZConIC0+ICdoZWxsbyB3b3JsZCcgYW5kIGNvbnZlcnRcbi8vIHJhbmdlcyBmcm9tIG1hcmt1cC1lZCBvZmZzZXRzIHRvIHBsYWluIHRleHQgb2Zmc2V0cy5cbmZ1bmN0aW9uIGNodW5raWZ5KGxpbmUsIHN0YXJ0LCBlbmQsIHNwYW5zKSB7XG4gIGNvbnN0IGNodW5rcyA9IFtdO1xuXG4gIGlmIChzcGFucy5sZW5ndGggPT0gMCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGZvciAobGV0IGkgaW4gc3BhbnMpIHtcbiAgICAvLyBHZXQgdGhlIG5leHQgY2h1bmsgZnJvbSB0aGUgcXVldWVcbiAgICBjb25zdCBzcGFuID0gc3BhbnNbaV07XG5cbiAgICAvLyBHcmFiIHRoZSBpbml0aWFsIHVuc3R5bGVkIGNodW5rXG4gICAgaWYgKHNwYW4uYXQgPiBzdGFydCkge1xuICAgICAgY2h1bmtzLnB1c2goe1xuICAgICAgICB0eHQ6IGxpbmUuc2xpY2Uoc3RhcnQsIHNwYW4uYXQpXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBHcmFiIHRoZSBzdHlsZWQgY2h1bmsuIEl0IG1heSBpbmNsdWRlIHN1YmNodW5rcy5cbiAgICBjb25zdCBjaHVuayA9IHtcbiAgICAgIHRwOiBzcGFuLnRwXG4gICAgfTtcbiAgICBjb25zdCBjaGxkID0gY2h1bmtpZnkobGluZSwgc3Bhbi5hdCArIDEsIHNwYW4uZW5kLCBzcGFuLmNoaWxkcmVuKTtcbiAgICBpZiAoY2hsZC5sZW5ndGggPiAwKSB7XG4gICAgICBjaHVuay5jaGlsZHJlbiA9IGNobGQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNodW5rLnR4dCA9IHNwYW4udHh0O1xuICAgIH1cbiAgICBjaHVua3MucHVzaChjaHVuayk7XG4gICAgc3RhcnQgPSBzcGFuLmVuZCArIDE7IC8vICcrMScgaXMgdG8gc2tpcCB0aGUgZm9ybWF0dGluZyBjaGFyYWN0ZXJcbiAgfVxuXG4gIC8vIEdyYWIgdGhlIHJlbWFpbmluZyB1bnN0eWxlZCBjaHVuaywgYWZ0ZXIgdGhlIGxhc3Qgc3BhblxuICBpZiAoc3RhcnQgPCBlbmQpIHtcbiAgICBjaHVua3MucHVzaCh7XG4gICAgICB0eHQ6IGxpbmUuc2xpY2Uoc3RhcnQsIGVuZClcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBjaHVua3M7XG59XG5cbi8vIERldGVjdCBzdGFydHMgYW5kIGVuZHMgb2YgZm9ybWF0dGluZyBzcGFucy4gVW5mb3JtYXR0ZWQgc3BhbnMgYXJlXG4vLyBpZ25vcmVkIGF0IHRoaXMgc3RhZ2UuXG5mdW5jdGlvbiBzcGFubmlmeShvcmlnaW5hbCwgcmVfc3RhcnQsIHJlX2VuZCwgdHlwZSkge1xuICBjb25zdCByZXN1bHQgPSBbXTtcbiAgbGV0IGluZGV4ID0gMDtcbiAgbGV0IGxpbmUgPSBvcmlnaW5hbC5zbGljZSgwKTsgLy8gbWFrZSBhIGNvcHk7XG5cbiAgd2hpbGUgKGxpbmUubGVuZ3RoID4gMCkge1xuICAgIC8vIG1hdGNoWzBdOyAvLyBtYXRjaCwgbGlrZSAnKmFiYyonXG4gICAgLy8gbWF0Y2hbMV07IC8vIG1hdGNoIGNhcHR1cmVkIGluIHBhcmVudGhlc2lzLCBsaWtlICdhYmMnXG4gICAgLy8gbWF0Y2hbJ2luZGV4J107IC8vIG9mZnNldCB3aGVyZSB0aGUgbWF0Y2ggc3RhcnRlZC5cblxuICAgIC8vIEZpbmQgdGhlIG9wZW5pbmcgdG9rZW4uXG4gICAgY29uc3Qgc3RhcnQgPSByZV9zdGFydC5leGVjKGxpbmUpO1xuICAgIGlmIChzdGFydCA9PSBudWxsKSB7XG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICAvLyBCZWNhdXNlIGphdmFzY3JpcHQgUmVnRXhwIGRvZXMgbm90IHN1cHBvcnQgbG9va2JlaGluZCwgdGhlIGFjdHVhbCBvZmZzZXQgbWF5IG5vdCBwb2ludFxuICAgIC8vIGF0IHRoZSBtYXJrdXAgY2hhcmFjdGVyLiBGaW5kIGl0IGluIHRoZSBtYXRjaGVkIHN0cmluZy5cbiAgICBsZXQgc3RhcnRfb2Zmc2V0ID0gc3RhcnRbJ2luZGV4J10gKyBzdGFydFswXS5sYXN0SW5kZXhPZihzdGFydFsxXSk7XG4gICAgLy8gQ2xpcCB0aGUgcHJvY2Vzc2VkIHBhcnQgb2YgdGhlIHN0cmluZy5cbiAgICBsaW5lID0gbGluZS5zbGljZShzdGFydF9vZmZzZXQgKyAxKTtcbiAgICAvLyBzdGFydF9vZmZzZXQgaXMgYW4gb2Zmc2V0IHdpdGhpbiB0aGUgY2xpcHBlZCBzdHJpbmcuIENvbnZlcnQgdG8gb3JpZ2luYWwgaW5kZXguXG4gICAgc3RhcnRfb2Zmc2V0ICs9IGluZGV4O1xuICAgIC8vIEluZGV4IG5vdyBwb2ludCB0byB0aGUgYmVnaW5uaW5nIG9mICdsaW5lJyB3aXRoaW4gdGhlICdvcmlnaW5hbCcgc3RyaW5nLlxuICAgIGluZGV4ID0gc3RhcnRfb2Zmc2V0ICsgMTtcblxuICAgIC8vIEZpbmQgdGhlIG1hdGNoaW5nIGNsb3NpbmcgdG9rZW4uXG4gICAgY29uc3QgZW5kID0gcmVfZW5kID8gcmVfZW5kLmV4ZWMobGluZSkgOiBudWxsO1xuICAgIGlmIChlbmQgPT0gbnVsbCkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGxldCBlbmRfb2Zmc2V0ID0gZW5kWydpbmRleCddICsgZW5kWzBdLmluZGV4T2YoZW5kWzFdKTtcbiAgICAvLyBDbGlwIHRoZSBwcm9jZXNzZWQgcGFydCBvZiB0aGUgc3RyaW5nLlxuICAgIGxpbmUgPSBsaW5lLnNsaWNlKGVuZF9vZmZzZXQgKyAxKTtcbiAgICAvLyBVcGRhdGUgb2Zmc2V0c1xuICAgIGVuZF9vZmZzZXQgKz0gaW5kZXg7XG4gICAgLy8gSW5kZXggbm93IHBvaW50cyB0byB0aGUgYmVnaW5uaW5nIG9mICdsaW5lJyB3aXRoaW4gdGhlICdvcmlnaW5hbCcgc3RyaW5nLlxuICAgIGluZGV4ID0gZW5kX29mZnNldCArIDE7XG5cbiAgICByZXN1bHQucHVzaCh7XG4gICAgICB0eHQ6IG9yaWdpbmFsLnNsaWNlKHN0YXJ0X29mZnNldCArIDEsIGVuZF9vZmZzZXQpLFxuICAgICAgY2hpbGRyZW46IFtdLFxuICAgICAgYXQ6IHN0YXJ0X29mZnNldCxcbiAgICAgIGVuZDogZW5kX29mZnNldCxcbiAgICAgIHRwOiB0eXBlXG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vLyBDb252ZXJ0IGxpbmVhciBhcnJheSBvciBzcGFucyBpbnRvIGEgdHJlZSByZXByZXNlbnRhdGlvbi5cbi8vIEtlZXAgc3RhbmRhbG9uZSBhbmQgbmVzdGVkIHNwYW5zLCB0aHJvdyBhd2F5IHBhcnRpYWxseSBvdmVybGFwcGluZyBzcGFucy5cbmZ1bmN0aW9uIHRvU3BhblRyZWUoc3BhbnMpIHtcbiAgaWYgKHNwYW5zLmxlbmd0aCA9PSAwKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgY29uc3QgdHJlZSA9IFtzcGFuc1swXV07XG4gIGxldCBsYXN0ID0gc3BhbnNbMF07XG4gIGZvciAobGV0IGkgPSAxOyBpIDwgc3BhbnMubGVuZ3RoOyBpKyspIHtcbiAgICAvLyBLZWVwIHNwYW5zIHdoaWNoIHN0YXJ0IGFmdGVyIHRoZSBlbmQgb2YgdGhlIHByZXZpb3VzIHNwYW4gb3IgdGhvc2Ugd2hpY2hcbiAgICAvLyBhcmUgY29tcGxldGUgd2l0aGluIHRoZSBwcmV2aW91cyBzcGFuLlxuICAgIGlmIChzcGFuc1tpXS5hdCA+IGxhc3QuZW5kKSB7XG4gICAgICAvLyBTcGFuIGlzIGNvbXBsZXRlbHkgb3V0c2lkZSBvZiB0aGUgcHJldmlvdXMgc3Bhbi5cbiAgICAgIHRyZWUucHVzaChzcGFuc1tpXSk7XG4gICAgICBsYXN0ID0gc3BhbnNbaV07XG4gICAgfSBlbHNlIGlmIChzcGFuc1tpXS5lbmQgPD0gbGFzdC5lbmQpIHtcbiAgICAgIC8vIFNwYW4gaXMgZnVsbHkgaW5zaWRlIG9mIHRoZSBwcmV2aW91cyBzcGFuLiBQdXNoIHRvIHN1Ym5vZGUuXG4gICAgICBsYXN0LmNoaWxkcmVuLnB1c2goc3BhbnNbaV0pO1xuICAgIH1cbiAgICAvLyBTcGFuIGNvdWxkIHBhcnRpYWxseSBvdmVybGFwLCBpZ25vcmluZyBpdCBhcyBpbnZhbGlkLlxuICB9XG5cbiAgLy8gUmVjdXJzaXZlbHkgcmVhcnJhbmdlIHRoZSBzdWJub2Rlcy5cbiAgZm9yIChsZXQgaSBpbiB0cmVlKSB7XG4gICAgdHJlZVtpXS5jaGlsZHJlbiA9IHRvU3BhblRyZWUodHJlZVtpXS5jaGlsZHJlbik7XG4gIH1cblxuICByZXR1cm4gdHJlZTtcbn1cblxuLy8gQ29udmVydCBkcmFmdHkgZG9jdW1lbnQgdG8gYSB0cmVlLlxuZnVuY3Rpb24gZHJhZnR5VG9UcmVlKGRvYykge1xuICBpZiAoIWRvYykge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgZG9jID0gKHR5cGVvZiBkb2MgPT0gJ3N0cmluZycpID8ge1xuICAgIHR4dDogZG9jXG4gIH0gOiBkb2M7XG4gIGxldCB7XG4gICAgdHh0LFxuICAgIGZtdCxcbiAgICBlbnRcbiAgfSA9IGRvYztcblxuICB0eHQgPSB0eHQgfHwgJyc7XG4gIGlmICghQXJyYXkuaXNBcnJheShlbnQpKSB7XG4gICAgZW50ID0gW107XG4gIH1cblxuICBpZiAoIUFycmF5LmlzQXJyYXkoZm10KSB8fCBmbXQubGVuZ3RoID09IDApIHtcbiAgICBpZiAoZW50Lmxlbmd0aCA9PSAwKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0ZXh0OiB0eHRcbiAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gSGFuZGxlIHNwZWNpYWwgY2FzZSB3aGVuIGFsbCB2YWx1ZXMgaW4gZm10IGFyZSAwIGFuZCBmbXQgdGhlcmVmb3JlIGlzIHNraXBwZWQuXG4gICAgZm10ID0gW3tcbiAgICAgIGF0OiAwLFxuICAgICAgbGVuOiAwLFxuICAgICAga2V5OiAwXG4gICAgfV07XG4gIH1cblxuICAvLyBTYW5pdGl6ZSBzcGFucy5cbiAgY29uc3Qgc3BhbnMgPSBbXTtcbiAgY29uc3QgYXR0YWNobWVudHMgPSBbXTtcbiAgZm10LmZvckVhY2goKHNwYW4pID0+IHtcbiAgICBpZiAoIXNwYW4gfHwgdHlwZW9mIHNwYW4gIT0gJ29iamVjdCcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIVsndW5kZWZpbmVkJywgJ251bWJlciddLmluY2x1ZGVzKHR5cGVvZiBzcGFuLmF0KSkge1xuICAgICAgLy8gUHJlc2VudCwgYnV0IG5vbi1udW1lcmljICdhdCcuXG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghWyd1bmRlZmluZWQnLCAnbnVtYmVyJ10uaW5jbHVkZXModHlwZW9mIHNwYW4ubGVuKSkge1xuICAgICAgLy8gUHJlc2VudCwgYnV0IG5vbi1udW1lcmljICdsZW4nLlxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBsZXQgYXQgPSBzcGFuLmF0IHwgMDtcbiAgICBsZXQgbGVuID0gc3Bhbi5sZW4gfCAwO1xuICAgIGlmIChsZW4gPCAwKSB7XG4gICAgICAvLyBJbnZhbGlkIHNwYW4gbGVuZ3RoLlxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBrZXkgPSBzcGFuLmtleSB8fCAwO1xuICAgIGlmIChlbnQubGVuZ3RoID4gMCAmJiAodHlwZW9mIGtleSAhPSAnbnVtYmVyJyB8fCBrZXkgPCAwIHx8IGtleSA+PSBlbnQubGVuZ3RoKSkge1xuICAgICAgLy8gSW52YWxpZCBrZXkgdmFsdWUuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGF0IDw9IC0xKSB7XG4gICAgICAvLyBBdHRhY2htZW50LiBTdG9yZSBhdHRhY2htZW50cyBzZXBhcmF0ZWx5LlxuICAgICAgYXR0YWNobWVudHMucHVzaCh7XG4gICAgICAgIHN0YXJ0OiAtMSxcbiAgICAgICAgZW5kOiAwLFxuICAgICAgICBrZXk6IGtleVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfSBlbHNlIGlmIChhdCArIGxlbiA+IHR4dC5sZW5ndGgpIHtcbiAgICAgIC8vIFNwYW4gaXMgb3V0IG9mIGJvdW5kcy5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIXNwYW4udHApIHtcbiAgICAgIGlmIChlbnQubGVuZ3RoID4gMCAmJiAodHlwZW9mIGVudFtrZXldID09ICdvYmplY3QnKSkge1xuICAgICAgICBzcGFucy5wdXNoKHtcbiAgICAgICAgICBzdGFydDogYXQsXG4gICAgICAgICAgZW5kOiBhdCArIGxlbixcbiAgICAgICAgICBrZXk6IGtleVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgc3BhbnMucHVzaCh7XG4gICAgICAgIHR5cGU6IHNwYW4udHAsXG4gICAgICAgIHN0YXJ0OiBhdCxcbiAgICAgICAgZW5kOiBhdCArIGxlblxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcblxuICAvLyBTb3J0IHNwYW5zIGZpcnN0IGJ5IHN0YXJ0IGluZGV4IChhc2MpIHRoZW4gYnkgbGVuZ3RoIChkZXNjKSwgdGhlbiBieSB3ZWlnaHQuXG4gIHNwYW5zLnNvcnQoKGEsIGIpID0+IHtcbiAgICBsZXQgZGlmZiA9IGEuc3RhcnQgLSBiLnN0YXJ0O1xuICAgIGlmIChkaWZmICE9IDApIHtcbiAgICAgIHJldHVybiBkaWZmO1xuICAgIH1cbiAgICBkaWZmID0gYi5lbmQgLSBhLmVuZDtcbiAgICBpZiAoZGlmZiAhPSAwKSB7XG4gICAgICByZXR1cm4gZGlmZjtcbiAgICB9XG4gICAgcmV0dXJuIEZNVF9XRUlHSFQuaW5kZXhPZihiLnR5cGUpIC0gRk1UX1dFSUdIVC5pbmRleE9mKGEudHlwZSk7XG4gIH0pO1xuXG4gIC8vIE1vdmUgYXR0YWNobWVudHMgdG8gdGhlIGVuZCBvZiB0aGUgbGlzdC5cbiAgaWYgKGF0dGFjaG1lbnRzLmxlbmd0aCA+IDApIHtcbiAgICBzcGFucy5wdXNoKC4uLmF0dGFjaG1lbnRzKTtcbiAgfVxuXG4gIHNwYW5zLmZvckVhY2goKHNwYW4pID0+IHtcbiAgICBpZiAoZW50Lmxlbmd0aCA+IDAgJiYgIXNwYW4udHlwZSAmJiBlbnRbc3Bhbi5rZXldICYmIHR5cGVvZiBlbnRbc3Bhbi5rZXldID09ICdvYmplY3QnKSB7XG4gICAgICBzcGFuLnR5cGUgPSBlbnRbc3Bhbi5rZXldLnRwO1xuICAgICAgc3Bhbi5kYXRhID0gZW50W3NwYW4ua2V5XS5kYXRhO1xuICAgIH1cblxuICAgIC8vIElzIHR5cGUgc3RpbGwgdW5kZWZpbmVkPyBIaWRlIHRoZSBpbnZhbGlkIGVsZW1lbnQhXG4gICAgaWYgKCFzcGFuLnR5cGUpIHtcbiAgICAgIHNwYW4udHlwZSA9ICdIRCc7XG4gICAgfVxuICB9KTtcblxuICBsZXQgdHJlZSA9IHNwYW5zVG9UcmVlKHt9LCB0eHQsIDAsIHR4dC5sZW5ndGgsIHNwYW5zKTtcblxuICAvLyBGbGF0dGVuIHRyZWUgbm9kZXMuXG4gIGNvbnN0IGZsYXR0ZW4gPSBmdW5jdGlvbihub2RlKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkobm9kZS5jaGlsZHJlbikgJiYgbm9kZS5jaGlsZHJlbi5sZW5ndGggPT0gMSkge1xuICAgICAgLy8gVW53cmFwLlxuICAgICAgY29uc3QgY2hpbGQgPSBub2RlLmNoaWxkcmVuWzBdO1xuICAgICAgaWYgKCFub2RlLnR5cGUpIHtcbiAgICAgICAgY29uc3QgcGFyZW50ID0gbm9kZS5wYXJlbnQ7XG4gICAgICAgIG5vZGUgPSBjaGlsZDtcbiAgICAgICAgbm9kZS5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgICB9IGVsc2UgaWYgKCFjaGlsZC50eXBlICYmICFjaGlsZC5jaGlsZHJlbikge1xuICAgICAgICBub2RlLnRleHQgPSBjaGlsZC50ZXh0O1xuICAgICAgICBkZWxldGUgbm9kZS5jaGlsZHJlbjtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cbiAgdHJlZSA9IHRyZWVUb3BEb3duKHRyZWUsIGZsYXR0ZW4pO1xuXG4gIHJldHVybiB0cmVlO1xufVxuXG4vLyBBZGQgdHJlZSBub2RlIHRvIGEgcGFyZW50IHRyZWUuXG5mdW5jdGlvbiBhZGROb2RlKHBhcmVudCwgbikge1xuICBpZiAoIW4pIHtcbiAgICByZXR1cm4gcGFyZW50O1xuICB9XG5cbiAgaWYgKCFwYXJlbnQuY2hpbGRyZW4pIHtcbiAgICBwYXJlbnQuY2hpbGRyZW4gPSBbXTtcbiAgfVxuXG4gIC8vIElmIHRleHQgaXMgcHJlc2VudCwgbW92ZSBpdCB0byBhIHN1Ym5vZGUuXG4gIGlmIChwYXJlbnQudGV4dCkge1xuICAgIHBhcmVudC5jaGlsZHJlbi5wdXNoKHtcbiAgICAgIHRleHQ6IHBhcmVudC50ZXh0LFxuICAgICAgcGFyZW50OiBwYXJlbnRcbiAgICB9KTtcbiAgICBkZWxldGUgcGFyZW50LnRleHQ7XG4gIH1cblxuICBuLnBhcmVudCA9IHBhcmVudDtcbiAgcGFyZW50LmNoaWxkcmVuLnB1c2gobik7XG5cbiAgcmV0dXJuIHBhcmVudDtcbn1cblxuLy8gUmV0dXJucyBhIHRyZWUgb2Ygbm9kZXMuXG5mdW5jdGlvbiBzcGFuc1RvVHJlZShwYXJlbnQsIHRleHQsIHN0YXJ0LCBlbmQsIHNwYW5zKSB7XG4gIGlmICghc3BhbnMgfHwgc3BhbnMubGVuZ3RoID09IDApIHtcbiAgICBpZiAoc3RhcnQgPCBlbmQpIHtcbiAgICAgIGFkZE5vZGUocGFyZW50LCB7XG4gICAgICAgIHRleHQ6IHRleHQuc3Vic3RyaW5nKHN0YXJ0LCBlbmQpXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHBhcmVudDtcbiAgfVxuXG4gIC8vIFByb2Nlc3Mgc3Vic3BhbnMuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc3BhbnMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBzcGFuID0gc3BhbnNbaV07XG4gICAgaWYgKHNwYW4uc3RhcnQgPCAwICYmIHNwYW4udHlwZSA9PSAnRVgnKSB7XG4gICAgICBhZGROb2RlKHBhcmVudCwge1xuICAgICAgICB0eXBlOiBzcGFuLnR5cGUsXG4gICAgICAgIGRhdGE6IHNwYW4uZGF0YSxcbiAgICAgICAga2V5OiBzcGFuLmtleSxcbiAgICAgICAgYXR0OiB0cnVlXG4gICAgICB9KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIEFkZCB1bi1zdHlsZWQgcmFuZ2UgYmVmb3JlIHRoZSBzdHlsZWQgc3BhbiBzdGFydHMuXG4gICAgaWYgKHN0YXJ0IDwgc3Bhbi5zdGFydCkge1xuICAgICAgYWRkTm9kZShwYXJlbnQsIHtcbiAgICAgICAgdGV4dDogdGV4dC5zdWJzdHJpbmcoc3RhcnQsIHNwYW4uc3RhcnQpXG4gICAgICB9KTtcbiAgICAgIHN0YXJ0ID0gc3Bhbi5zdGFydDtcbiAgICB9XG5cbiAgICAvLyBHZXQgYWxsIHNwYW5zIHdoaWNoIGFyZSB3aXRoaW4gdGhlIGN1cnJlbnQgc3Bhbi5cbiAgICBjb25zdCBzdWJzcGFucyA9IFtdO1xuICAgIHdoaWxlIChpIDwgc3BhbnMubGVuZ3RoIC0gMSkge1xuICAgICAgY29uc3QgaW5uZXIgPSBzcGFuc1tpICsgMV07XG4gICAgICBpZiAoaW5uZXIuc3RhcnQgPCAwKSB7XG4gICAgICAgIC8vIEF0dGFjaG1lbnRzIGFyZSBpbiB0aGUgZW5kLiBTdG9wLlxuICAgICAgICBicmVhaztcbiAgICAgIH0gZWxzZSBpZiAoaW5uZXIuc3RhcnQgPCBzcGFuLmVuZCkge1xuICAgICAgICBpZiAoaW5uZXIuZW5kIDw9IHNwYW4uZW5kKSB7XG4gICAgICAgICAgY29uc3QgdGFnID0gRk9STUFUX1RBR1NbaW5uZXIudHBdIHx8IHt9O1xuICAgICAgICAgIGlmIChpbm5lci5zdGFydCA8IGlubmVyLmVuZCB8fCB0YWcuaXNWb2lkKSB7XG4gICAgICAgICAgICAvLyBWYWxpZCBzdWJzcGFuOiBjb21wbGV0ZWx5IHdpdGhpbiB0aGUgY3VycmVudCBzcGFuIGFuZFxuICAgICAgICAgICAgLy8gZWl0aGVyIG5vbi16ZXJvIGxlbmd0aCBvciB6ZXJvIGxlbmd0aCBpcyBhY2NlcHRhYmxlLlxuICAgICAgICAgICAgc3Vic3BhbnMucHVzaChpbm5lcik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGkrKztcbiAgICAgICAgLy8gT3ZlcmxhcHBpbmcgc3Vic3BhbnMgYXJlIGlnbm9yZWQuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBQYXN0IHRoZSBlbmQgb2YgdGhlIGN1cnJlbnQgc3Bhbi4gU3RvcC5cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgYWRkTm9kZShwYXJlbnQsIHNwYW5zVG9UcmVlKHtcbiAgICAgIHR5cGU6IHNwYW4udHlwZSxcbiAgICAgIGRhdGE6IHNwYW4uZGF0YSxcbiAgICAgIGtleTogc3Bhbi5rZXlcbiAgICB9LCB0ZXh0LCBzdGFydCwgc3Bhbi5lbmQsIHN1YnNwYW5zKSk7XG4gICAgc3RhcnQgPSBzcGFuLmVuZDtcbiAgfVxuXG4gIC8vIEFkZCB0aGUgbGFzdCB1bmZvcm1hdHRlZCByYW5nZS5cbiAgaWYgKHN0YXJ0IDwgZW5kKSB7XG4gICAgYWRkTm9kZShwYXJlbnQsIHtcbiAgICAgIHRleHQ6IHRleHQuc3Vic3RyaW5nKHN0YXJ0LCBlbmQpXG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gcGFyZW50O1xufVxuXG4vLyBBcHBlbmQgYSB0cmVlIHRvIGEgRHJhZnR5IGRvYy5cbmZ1bmN0aW9uIHRyZWVUb0RyYWZ0eShkb2MsIHRyZWUsIGtleW1hcCkge1xuICBpZiAoIXRyZWUpIHtcbiAgICByZXR1cm4gZG9jO1xuICB9XG5cbiAgZG9jLnR4dCA9IGRvYy50eHQgfHwgJyc7XG5cbiAgLy8gQ2hlY2twb2ludCB0byBtZWFzdXJlIGxlbmd0aCBvZiB0aGUgY3VycmVudCB0cmVlIG5vZGUuXG4gIGNvbnN0IHN0YXJ0ID0gZG9jLnR4dC5sZW5ndGg7XG5cbiAgaWYgKHRyZWUudGV4dCkge1xuICAgIGRvYy50eHQgKz0gdHJlZS50ZXh0O1xuICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkodHJlZS5jaGlsZHJlbikpIHtcbiAgICB0cmVlLmNoaWxkcmVuLmZvckVhY2goKGMpID0+IHtcbiAgICAgIHRyZWVUb0RyYWZ0eShkb2MsIGMsIGtleW1hcCk7XG4gICAgfSk7XG4gIH1cblxuICBpZiAodHJlZS50eXBlKSB7XG4gICAgY29uc3QgbGVuID0gZG9jLnR4dC5sZW5ndGggLSBzdGFydDtcbiAgICBkb2MuZm10ID0gZG9jLmZtdCB8fCBbXTtcbiAgICBpZiAoT2JqZWN0LmtleXModHJlZS5kYXRhIHx8IHt9KS5sZW5ndGggPiAwKSB7XG4gICAgICBkb2MuZW50ID0gZG9jLmVudCB8fCBbXTtcbiAgICAgIGNvbnN0IG5ld0tleSA9ICh0eXBlb2Yga2V5bWFwW3RyZWUua2V5XSA9PSAndW5kZWZpbmVkJykgPyBkb2MuZW50Lmxlbmd0aCA6IGtleW1hcFt0cmVlLmtleV07XG4gICAgICBrZXltYXBbdHJlZS5rZXldID0gbmV3S2V5O1xuICAgICAgZG9jLmVudFtuZXdLZXldID0ge1xuICAgICAgICB0cDogdHJlZS50eXBlLFxuICAgICAgICBkYXRhOiB0cmVlLmRhdGFcbiAgICAgIH07XG4gICAgICBpZiAodHJlZS5hdHQpIHtcbiAgICAgICAgLy8gQXR0YWNobWVudC5cbiAgICAgICAgZG9jLmZtdC5wdXNoKHtcbiAgICAgICAgICBhdDogLTEsXG4gICAgICAgICAgbGVuOiAwLFxuICAgICAgICAgIGtleTogbmV3S2V5XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZG9jLmZtdC5wdXNoKHtcbiAgICAgICAgICBhdDogc3RhcnQsXG4gICAgICAgICAgbGVuOiBsZW4sXG4gICAgICAgICAga2V5OiBuZXdLZXlcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGRvYy5mbXQucHVzaCh7XG4gICAgICAgIHRwOiB0cmVlLnR5cGUsXG4gICAgICAgIGF0OiBzdGFydCxcbiAgICAgICAgbGVuOiBsZW5cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZG9jO1xufVxuXG4vLyBUcmF2ZXJzZSB0aGUgdHJlZSB0b3AgZG93biB0cmFuc2Zvcm1pbmcgdGhlIG5vZGVzOiBhcHBseSB0cmFuc2Zvcm1lciB0byBldmVyeSB0cmVlIG5vZGUuXG5mdW5jdGlvbiB0cmVlVG9wRG93bihzcmMsIHRyYW5zZm9ybWVyLCBjb250ZXh0KSB7XG4gIGlmICghc3JjKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBsZXQgZHN0ID0gdHJhbnNmb3JtZXIuY2FsbChjb250ZXh0LCBzcmMpO1xuICBpZiAoIWRzdCB8fCAhZHN0LmNoaWxkcmVuKSB7XG4gICAgcmV0dXJuIGRzdDtcbiAgfVxuXG4gIGNvbnN0IGNoaWxkcmVuID0gW107XG4gIGZvciAobGV0IGkgaW4gZHN0LmNoaWxkcmVuKSB7XG4gICAgbGV0IG4gPSBkc3QuY2hpbGRyZW5baV07XG4gICAgaWYgKG4pIHtcbiAgICAgIG4gPSB0cmVlVG9wRG93bihuLCB0cmFuc2Zvcm1lciwgY29udGV4dCk7XG4gICAgICBpZiAobikge1xuICAgICAgICBjaGlsZHJlbi5wdXNoKG4pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmIChjaGlsZHJlbi5sZW5ndGggPT0gMCkge1xuICAgIGRzdC5jaGlsZHJlbiA9IG51bGw7XG4gIH0gZWxzZSB7XG4gICAgZHN0LmNoaWxkcmVuID0gY2hpbGRyZW47XG4gIH1cblxuICByZXR1cm4gZHN0O1xufVxuXG4vLyBUcmF2ZXJzZSB0aGUgdHJlZSBib3R0b20tdXA6IGFwcGx5IGZvcm1hdHRlciB0byBldmVyeSBub2RlLlxuLy8gVGhlIGZvcm1hdHRlciBtdXN0IG1haW50YWluIGl0cyBzdGF0ZSB0aHJvdWdoIGNvbnRleHQuXG5mdW5jdGlvbiB0cmVlQm90dG9tVXAoc3JjLCBmb3JtYXR0ZXIsIGluZGV4LCBzdGFjaywgY29udGV4dCkge1xuICBpZiAoIXNyYykge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgaWYgKHN0YWNrICYmIHNyYy50eXBlKSB7XG4gICAgc3RhY2sucHVzaChzcmMudHlwZSk7XG4gIH1cblxuICBsZXQgdmFsdWVzID0gW107XG4gIGZvciAobGV0IGkgaW4gc3JjLmNoaWxkcmVuKSB7XG4gICAgY29uc3QgbiA9IHRyZWVCb3R0b21VcChzcmMuY2hpbGRyZW5baV0sIGZvcm1hdHRlciwgaSwgc3RhY2ssIGNvbnRleHQpO1xuICAgIGlmIChuKSB7XG4gICAgICB2YWx1ZXMucHVzaChuKTtcbiAgICB9XG4gIH1cbiAgaWYgKHZhbHVlcy5sZW5ndGggPT0gMCkge1xuICAgIGlmIChzcmMudGV4dCkge1xuICAgICAgdmFsdWVzID0gW3NyYy50ZXh0XTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFsdWVzID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBpZiAoc3RhY2sgJiYgc3JjLnR5cGUpIHtcbiAgICBzdGFjay5wb3AoKTtcbiAgfVxuXG4gIHJldHVybiBmb3JtYXR0ZXIuY2FsbChjb250ZXh0LCBzcmMudHlwZSwgc3JjLmRhdGEsIHZhbHVlcywgaW5kZXgsIHN0YWNrKTtcbn1cblxuLy8gQ2xpcCB0cmVlIHRvIHRoZSBwcm92aWRlZCBsaW1pdC5cbmZ1bmN0aW9uIHNob3J0ZW5UcmVlKHRyZWUsIGxpbWl0LCB0YWlsKSB7XG4gIGlmICghdHJlZSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgaWYgKHRhaWwpIHtcbiAgICBsaW1pdCAtPSB0YWlsLmxlbmd0aDtcbiAgfVxuXG4gIGNvbnN0IHNob3J0ZW5lciA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICBpZiAobGltaXQgPD0gLTEpIHtcbiAgICAgIC8vIExpbWl0IC0xIG1lYW5zIHRoZSBkb2Mgd2FzIGFscmVhZHkgY2xpcHBlZC5cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGlmIChub2RlLmF0dCkge1xuICAgICAgLy8gQXR0YWNobWVudHMgYXJlIHVuY2hhbmdlZC5cbiAgICAgIHJldHVybiBub2RlO1xuICAgIH1cbiAgICBpZiAobGltaXQgPT0gMCkge1xuICAgICAgbm9kZS50ZXh0ID0gdGFpbDtcbiAgICAgIGxpbWl0ID0gLTE7XG4gICAgfSBlbHNlIGlmIChub2RlLnRleHQpIHtcbiAgICAgIGNvbnN0IGxlbiA9IG5vZGUudGV4dC5sZW5ndGg7XG4gICAgICBpZiAobGVuID4gbGltaXQpIHtcbiAgICAgICAgbm9kZS50ZXh0ID0gbm9kZS50ZXh0LnN1YnN0cmluZygwLCBsaW1pdCkgKyB0YWlsO1xuICAgICAgICBsaW1pdCA9IC0xO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGltaXQgLT0gbGVuO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuXG4gIHJldHVybiB0cmVlVG9wRG93bih0cmVlLCBzaG9ydGVuZXIpO1xufVxuXG4vLyBTdHJpcCBoZWF2eSBlbnRpdGllcyBmcm9tIGEgdHJlZS5cbmZ1bmN0aW9uIGxpZ2h0RW50aXR5KHRyZWUsIGFsbG93KSB7XG4gIGNvbnN0IGxpZ2h0Q29weSA9IG5vZGUgPT4ge1xuICAgIGNvbnN0IGRhdGEgPSBjb3B5RW50RGF0YShub2RlLmRhdGEsIHRydWUsIGFsbG93ID8gYWxsb3cobm9kZSkgOiBudWxsKTtcbiAgICBpZiAoZGF0YSkge1xuICAgICAgbm9kZS5kYXRhID0gZGF0YTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVsZXRlIG5vZGUuZGF0YTtcbiAgICB9XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cbiAgcmV0dXJuIHRyZWVUb3BEb3duKHRyZWUsIGxpZ2h0Q29weSk7XG59XG5cbi8vIFJlbW92ZSBzcGFjZXMgYW5kIGJyZWFrcyBvbiB0aGUgbGVmdC5cbmZ1bmN0aW9uIGxUcmltKHRyZWUpIHtcbiAgaWYgKHRyZWUudHlwZSA9PSAnQlInKSB7XG4gICAgdHJlZSA9IG51bGw7XG4gIH0gZWxzZSBpZiAodHJlZS50ZXh0KSB7XG4gICAgaWYgKCF0cmVlLnR5cGUpIHtcbiAgICAgIHRyZWUudGV4dCA9IHRyZWUudGV4dC50cmltU3RhcnQoKTtcbiAgICAgIGlmICghdHJlZS50ZXh0KSB7XG4gICAgICAgIHRyZWUgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIGlmICghdHJlZS50eXBlICYmIHRyZWUuY2hpbGRyZW4gJiYgdHJlZS5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgY29uc3QgYyA9IGxUcmltKHRyZWUuY2hpbGRyZW5bMF0pO1xuICAgIGlmIChjKSB7XG4gICAgICB0cmVlLmNoaWxkcmVuWzBdID0gYztcbiAgICB9IGVsc2Uge1xuICAgICAgdHJlZS5jaGlsZHJlbi5zaGlmdCgpO1xuICAgICAgaWYgKCF0cmVlLnR5cGUgJiYgdHJlZS5jaGlsZHJlbi5sZW5ndGggPT0gMCkge1xuICAgICAgICB0cmVlID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRyZWU7XG59XG5cbi8vIE1vdmUgYXR0YWNobWVudHMgdG8gdGhlIGVuZC4gQXR0YWNobWVudHMgbXVzdCBiZSBhdCB0aGUgdG9wIGxldmVsLCBubyBuZWVkIHRvIHRyYXZlcnNlIHRoZSB0cmVlLlxuZnVuY3Rpb24gYXR0YWNobWVudHNUb0VuZCh0cmVlLCBsaW1pdCkge1xuICBpZiAoIXRyZWUpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGlmICh0cmVlLmF0dCkge1xuICAgIHRyZWUudGV4dCA9ICcgJztcbiAgICBkZWxldGUgdHJlZS5hdHQ7XG4gICAgZGVsZXRlIHRyZWUuY2hpbGRyZW47XG4gIH0gZWxzZSBpZiAodHJlZS5jaGlsZHJlbikge1xuICAgIGNvbnN0IGF0dGFjaG1lbnRzID0gW107XG4gICAgY29uc3QgY2hpbGRyZW4gPSBbXTtcbiAgICBmb3IgKGxldCBpIGluIHRyZWUuY2hpbGRyZW4pIHtcbiAgICAgIGNvbnN0IGMgPSB0cmVlLmNoaWxkcmVuW2ldO1xuICAgICAgaWYgKGMuYXR0KSB7XG4gICAgICAgIGlmIChhdHRhY2htZW50cy5sZW5ndGggPT0gbGltaXQpIHtcbiAgICAgICAgICAvLyBUb28gbWFueSBhdHRhY2htZW50cyB0byBwcmV2aWV3O1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjLmRhdGFbJ21pbWUnXSA9PSBKU09OX01JTUVfVFlQRSkge1xuICAgICAgICAgIC8vIEpTT04gYXR0YWNobWVudHMgYXJlIG5vdCBzaG93biBpbiBwcmV2aWV3LlxuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZGVsZXRlIGMuYXR0O1xuICAgICAgICBkZWxldGUgYy5jaGlsZHJlbjtcbiAgICAgICAgYy50ZXh0ID0gJyAnO1xuICAgICAgICBhdHRhY2htZW50cy5wdXNoKGMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2hpbGRyZW4ucHVzaChjKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdHJlZS5jaGlsZHJlbiA9IGNoaWxkcmVuLmNvbmNhdChhdHRhY2htZW50cyk7XG4gIH1cbiAgcmV0dXJuIHRyZWU7XG59XG5cbi8vIEdldCBhIGxpc3Qgb2YgZW50aXRpZXMgZnJvbSBhIHRleHQuXG5mdW5jdGlvbiBleHRyYWN0RW50aXRpZXMobGluZSkge1xuICBsZXQgbWF0Y2g7XG4gIGxldCBleHRyYWN0ZWQgPSBbXTtcbiAgRU5USVRZX1RZUEVTLmZvckVhY2goKGVudGl0eSkgPT4ge1xuICAgIHdoaWxlICgobWF0Y2ggPSBlbnRpdHkucmUuZXhlYyhsaW5lKSkgIT09IG51bGwpIHtcbiAgICAgIGV4dHJhY3RlZC5wdXNoKHtcbiAgICAgICAgb2Zmc2V0OiBtYXRjaFsnaW5kZXgnXSxcbiAgICAgICAgbGVuOiBtYXRjaFswXS5sZW5ndGgsXG4gICAgICAgIHVuaXF1ZTogbWF0Y2hbMF0sXG4gICAgICAgIGRhdGE6IGVudGl0eS5wYWNrKG1hdGNoWzBdKSxcbiAgICAgICAgdHlwZTogZW50aXR5Lm5hbWVcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG5cbiAgaWYgKGV4dHJhY3RlZC5sZW5ndGggPT0gMCkge1xuICAgIHJldHVybiBleHRyYWN0ZWQ7XG4gIH1cblxuICAvLyBSZW1vdmUgZW50aXRpZXMgZGV0ZWN0ZWQgaW5zaWRlIG90aGVyIGVudGl0aWVzLCBsaWtlICNoYXNodGFnIGluIGEgVVJMLlxuICBleHRyYWN0ZWQuc29ydCgoYSwgYikgPT4ge1xuICAgIHJldHVybiBhLm9mZnNldCAtIGIub2Zmc2V0O1xuICB9KTtcblxuICBsZXQgaWR4ID0gLTE7XG4gIGV4dHJhY3RlZCA9IGV4dHJhY3RlZC5maWx0ZXIoKGVsKSA9PiB7XG4gICAgY29uc3QgcmVzdWx0ID0gKGVsLm9mZnNldCA+IGlkeCk7XG4gICAgaWR4ID0gZWwub2Zmc2V0ICsgZWwubGVuO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH0pO1xuXG4gIHJldHVybiBleHRyYWN0ZWQ7XG59XG5cbi8vIENvbnZlcnQgdGhlIGNodW5rcyBpbnRvIGZvcm1hdCBzdWl0YWJsZSBmb3Igc2VyaWFsaXphdGlvbi5cbmZ1bmN0aW9uIGRyYWZ0aWZ5KGNodW5rcywgc3RhcnRBdCkge1xuICBsZXQgcGxhaW4gPSAnJztcbiAgbGV0IHJhbmdlcyA9IFtdO1xuICBmb3IgKGxldCBpIGluIGNodW5rcykge1xuICAgIGNvbnN0IGNodW5rID0gY2h1bmtzW2ldO1xuICAgIGlmICghY2h1bmsudHh0KSB7XG4gICAgICBjb25zdCBkcmFmdHkgPSBkcmFmdGlmeShjaHVuay5jaGlsZHJlbiwgcGxhaW4ubGVuZ3RoICsgc3RhcnRBdCk7XG4gICAgICBjaHVuay50eHQgPSBkcmFmdHkudHh0O1xuICAgICAgcmFuZ2VzID0gcmFuZ2VzLmNvbmNhdChkcmFmdHkuZm10KTtcbiAgICB9XG5cbiAgICBpZiAoY2h1bmsudHApIHtcbiAgICAgIHJhbmdlcy5wdXNoKHtcbiAgICAgICAgYXQ6IHBsYWluLmxlbmd0aCArIHN0YXJ0QXQsXG4gICAgICAgIGxlbjogY2h1bmsudHh0Lmxlbmd0aCxcbiAgICAgICAgdHA6IGNodW5rLnRwXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBwbGFpbiArPSBjaHVuay50eHQ7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICB0eHQ6IHBsYWluLFxuICAgIGZtdDogcmFuZ2VzXG4gIH07XG59XG5cbi8vIENyZWF0ZSBhIGNvcHkgb2YgZW50aXR5IGRhdGEgd2l0aCAobGlnaHQ9ZmFsc2UpIG9yIHdpdGhvdXQgKGxpZ2h0PXRydWUpIHRoZSBsYXJnZSBwYXlsb2FkLlxuLy8gVGhlIGFycmF5ICdhbGxvdycgY29udGFpbnMgYSBsaXN0IG9mIGZpZWxkcyBleGVtcHQgZnJvbSBzdHJpcHBpbmcuXG5mdW5jdGlvbiBjb3B5RW50RGF0YShkYXRhLCBsaWdodCwgYWxsb3cpIHtcbiAgaWYgKGRhdGEgJiYgT2JqZWN0LmVudHJpZXMoZGF0YSkubGVuZ3RoID4gMCkge1xuICAgIGFsbG93ID0gYWxsb3cgfHwgW107XG4gICAgY29uc3QgZGMgPSB7fTtcbiAgICBBTExPV0VEX0VOVF9GSUVMRFMuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgaWYgKGRhdGFba2V5XSkge1xuICAgICAgICBpZiAobGlnaHQgJiYgIWFsbG93LmluY2x1ZGVzKGtleSkgJiZcbiAgICAgICAgICAodHlwZW9mIGRhdGFba2V5XSA9PSAnc3RyaW5nJyB8fCBBcnJheS5pc0FycmF5KGRhdGFba2V5XSkpICYmXG4gICAgICAgICAgZGF0YVtrZXldLmxlbmd0aCA+IE1BWF9QUkVWSUVXX0RBVEFfU0laRSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGRhdGFba2V5XSA9PSAnb2JqZWN0Jykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBkY1trZXldID0gZGF0YVtrZXldO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKE9iamVjdC5lbnRyaWVzKGRjKS5sZW5ndGggIT0gMCkge1xuICAgICAgcmV0dXJuIGRjO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuaWYgKHR5cGVvZiBtb2R1bGUgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBEcmFmdHk7XG59XG4iLCIvKipcbiAqIEBmaWxlIFV0aWxpdGllcyBmb3IgdXBsb2FkaW5nIGFuZCBkb3dubG9hZGluZyBmaWxlcy5cbiAqXG4gKiBAY29weXJpZ2h0IDIwMTUtMjAyMiBUaW5vZGUgTExDLlxuICovXG4ndXNlIHN0cmljdCc7XG5cbmltcG9ydCB7XG4gIGlzVXJsUmVsYXRpdmUsXG4gIGpzb25QYXJzZUhlbHBlclxufSBmcm9tICcuL3V0aWxzLmpzJztcblxubGV0IFhIUlByb3ZpZGVyO1xuXG4vKipcbiAqIEBjbGFzcyBMYXJnZUZpbGVIZWxwZXIgLSB1dGlsaXRpZXMgZm9yIHVwbG9hZGluZyBhbmQgZG93bmxvYWRpbmcgZmlsZXMgb3V0IG9mIGJhbmQuXG4gKiBEb24ndCBpbnN0YW50aWF0ZSB0aGlzIGNsYXNzIGRpcmVjdGx5LiBVc2Uge1Rpbm9kZS5nZXRMYXJnZUZpbGVIZWxwZXJ9IGluc3RlYWQuXG4gKiBAbWVtYmVyb2YgVGlub2RlXG4gKlxuICogQHBhcmFtIHtUaW5vZGV9IHRpbm9kZSAtIHRoZSBtYWluIFRpbm9kZSBvYmplY3QuXG4gKiBAcGFyYW0ge3N0cmluZ30gdmVyc2lvbiAtIHByb3RvY29sIHZlcnNpb24sIGkuZS4gJzAnLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMYXJnZUZpbGVIZWxwZXIge1xuICBjb25zdHJ1Y3Rvcih0aW5vZGUsIHZlcnNpb24pIHtcbiAgICB0aGlzLl90aW5vZGUgPSB0aW5vZGU7XG4gICAgdGhpcy5fdmVyc2lvbiA9IHZlcnNpb247XG5cbiAgICB0aGlzLl9hcGlLZXkgPSB0aW5vZGUuX2FwaUtleTtcbiAgICB0aGlzLl9hdXRoVG9rZW4gPSB0aW5vZGUuZ2V0QXV0aFRva2VuKCk7XG4gICAgdGhpcy5fcmVxSWQgPSB0aW5vZGUuZ2V0TmV4dFVuaXF1ZUlkKCk7XG4gICAgdGhpcy54aHIgPSBuZXcgWEhSUHJvdmlkZXIoKTtcblxuICAgIC8vIFByb21pc2VcbiAgICB0aGlzLnRvUmVzb2x2ZSA9IG51bGw7XG4gICAgdGhpcy50b1JlamVjdCA9IG51bGw7XG5cbiAgICAvLyBDYWxsYmFja3NcbiAgICB0aGlzLm9uUHJvZ3Jlc3MgPSBudWxsO1xuICAgIHRoaXMub25TdWNjZXNzID0gbnVsbDtcbiAgICB0aGlzLm9uRmFpbHVyZSA9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogU3RhcnQgdXBsb2FkaW5nIHRoZSBmaWxlIHRvIGEgbm9uLWRlZmF1bHQgZW5kcG9pbnQuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTGFyZ2VGaWxlSGVscGVyI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gYmFzZVVybCBhbHRlcm5hdGl2ZSBiYXNlIFVSTCBvZiB1cGxvYWQgc2VydmVyLlxuICAgKiBAcGFyYW0ge0ZpbGV8QmxvYn0gZGF0YSB0byB1cGxvYWQuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBhdmF0YXJGb3IgdG9waWMgbmFtZSBpZiB0aGUgdXBsb2FkIHJlcHJlc2VudHMgYW4gYXZhdGFyLlxuICAgKiBAcGFyYW0ge0NhbGxiYWNrfSBvblByb2dyZXNzIGNhbGxiYWNrLiBUYWtlcyBvbmUge2Zsb2F0fSBwYXJhbWV0ZXIgMC4uMVxuICAgKiBAcGFyYW0ge0NhbGxiYWNrfSBvblN1Y2Nlc3MgY2FsbGJhY2suIENhbGxlZCB3aGVuIHRoZSBmaWxlIGlzIHN1Y2Nlc3NmdWxseSB1cGxvYWRlZC5cbiAgICogQHBhcmFtIHtDYWxsYmFja30gb25GYWlsdXJlIGNhbGxiYWNrLiBDYWxsZWQgaW4gY2FzZSBvZiBhIGZhaWx1cmUuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSB1cGxvYWQgaXMgY29tcGxldGVkL2ZhaWxlZC5cbiAgICovXG4gIHVwbG9hZFdpdGhCYXNlVXJsKGJhc2VVcmwsIGRhdGEsIGF2YXRhckZvciwgb25Qcm9ncmVzcywgb25TdWNjZXNzLCBvbkZhaWx1cmUpIHtcbiAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXM7XG5cbiAgICBsZXQgdXJsID0gYC92JHt0aGlzLl92ZXJzaW9ufS9maWxlL3UvYDtcbiAgICBpZiAoYmFzZVVybCkge1xuICAgICAgbGV0IGJhc2UgPSBiYXNlVXJsO1xuICAgICAgaWYgKGJhc2UuZW5kc1dpdGgoJy8nKSkge1xuICAgICAgICAvLyBSZW1vdmluZyB0cmFpbGluZyBzbGFzaC5cbiAgICAgICAgYmFzZSA9IGJhc2Uuc2xpY2UoMCwgLTEpO1xuICAgICAgfVxuICAgICAgaWYgKGJhc2Uuc3RhcnRzV2l0aCgnaHR0cDovLycpIHx8IGJhc2Uuc3RhcnRzV2l0aCgnaHR0cHM6Ly8nKSkge1xuICAgICAgICB1cmwgPSBiYXNlICsgdXJsO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGJhc2UgVVJMICcke2Jhc2VVcmx9J2ApO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnhoci5vcGVuKCdQT1NUJywgdXJsLCB0cnVlKTtcbiAgICB0aGlzLnhoci5zZXRSZXF1ZXN0SGVhZGVyKCdYLVRpbm9kZS1BUElLZXknLCB0aGlzLl9hcGlLZXkpO1xuICAgIGlmICh0aGlzLl9hdXRoVG9rZW4pIHtcbiAgICAgIHRoaXMueGhyLnNldFJlcXVlc3RIZWFkZXIoJ1gtVGlub2RlLUF1dGgnLCBgVG9rZW4gJHt0aGlzLl9hdXRoVG9rZW4udG9rZW59YCk7XG4gICAgfVxuICAgIGNvbnN0IHJlc3VsdCA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMudG9SZXNvbHZlID0gcmVzb2x2ZTtcbiAgICAgIHRoaXMudG9SZWplY3QgPSByZWplY3Q7XG4gICAgfSk7XG5cbiAgICB0aGlzLm9uUHJvZ3Jlc3MgPSBvblByb2dyZXNzO1xuICAgIHRoaXMub25TdWNjZXNzID0gb25TdWNjZXNzO1xuICAgIHRoaXMub25GYWlsdXJlID0gb25GYWlsdXJlO1xuXG4gICAgdGhpcy54aHIudXBsb2FkLm9ucHJvZ3Jlc3MgPSAoZSkgPT4ge1xuICAgICAgaWYgKGUubGVuZ3RoQ29tcHV0YWJsZSAmJiBpbnN0YW5jZS5vblByb2dyZXNzKSB7XG4gICAgICAgIGluc3RhbmNlLm9uUHJvZ3Jlc3MoZS5sb2FkZWQgLyBlLnRvdGFsKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy54aHIub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgcGt0O1xuICAgICAgdHJ5IHtcbiAgICAgICAgcGt0ID0gSlNPTi5wYXJzZSh0aGlzLnJlc3BvbnNlLCBqc29uUGFyc2VIZWxwZXIpO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGluc3RhbmNlLl90aW5vZGUubG9nZ2VyKFwiRVJST1I6IEludmFsaWQgc2VydmVyIHJlc3BvbnNlIGluIExhcmdlRmlsZUhlbHBlclwiLCB0aGlzLnJlc3BvbnNlKTtcbiAgICAgICAgcGt0ID0ge1xuICAgICAgICAgIGN0cmw6IHtcbiAgICAgICAgICAgIGNvZGU6IHRoaXMuc3RhdHVzLFxuICAgICAgICAgICAgdGV4dDogdGhpcy5zdGF0dXNUZXh0XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5zdGF0dXMgPj0gMjAwICYmIHRoaXMuc3RhdHVzIDwgMzAwKSB7XG4gICAgICAgIGlmIChpbnN0YW5jZS50b1Jlc29sdmUpIHtcbiAgICAgICAgICBpbnN0YW5jZS50b1Jlc29sdmUocGt0LmN0cmwucGFyYW1zLnVybCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGluc3RhbmNlLm9uU3VjY2Vzcykge1xuICAgICAgICAgIGluc3RhbmNlLm9uU3VjY2Vzcyhwa3QuY3RybCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0dXMgPj0gNDAwKSB7XG4gICAgICAgIGlmIChpbnN0YW5jZS50b1JlamVjdCkge1xuICAgICAgICAgIGluc3RhbmNlLnRvUmVqZWN0KG5ldyBFcnJvcihgJHtwa3QuY3RybC50ZXh0fSAoJHtwa3QuY3RybC5jb2RlfSlgKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGluc3RhbmNlLm9uRmFpbHVyZSkge1xuICAgICAgICAgIGluc3RhbmNlLm9uRmFpbHVyZShwa3QuY3RybCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGluc3RhbmNlLl90aW5vZGUubG9nZ2VyKFwiRVJST1I6IFVuZXhwZWN0ZWQgc2VydmVyIHJlc3BvbnNlIHN0YXR1c1wiLCB0aGlzLnN0YXR1cywgdGhpcy5yZXNwb25zZSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRoaXMueGhyLm9uZXJyb3IgPSBmdW5jdGlvbihlKSB7XG4gICAgICBpZiAoaW5zdGFuY2UudG9SZWplY3QpIHtcbiAgICAgICAgaW5zdGFuY2UudG9SZWplY3QobmV3IEVycm9yKFwiZmFpbGVkXCIpKTtcbiAgICAgIH1cbiAgICAgIGlmIChpbnN0YW5jZS5vbkZhaWx1cmUpIHtcbiAgICAgICAgaW5zdGFuY2Uub25GYWlsdXJlKG51bGwpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLnhoci5vbmFib3J0ID0gZnVuY3Rpb24oZSkge1xuICAgICAgaWYgKGluc3RhbmNlLnRvUmVqZWN0KSB7XG4gICAgICAgIGluc3RhbmNlLnRvUmVqZWN0KG5ldyBFcnJvcihcInVwbG9hZCBjYW5jZWxsZWQgYnkgdXNlclwiKSk7XG4gICAgICB9XG4gICAgICBpZiAoaW5zdGFuY2Uub25GYWlsdXJlKSB7XG4gICAgICAgIGluc3RhbmNlLm9uRmFpbHVyZShudWxsKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGZvcm0gPSBuZXcgRm9ybURhdGEoKTtcbiAgICAgIGZvcm0uYXBwZW5kKCdmaWxlJywgZGF0YSk7XG4gICAgICBmb3JtLnNldCgnaWQnLCB0aGlzLl9yZXFJZCk7XG4gICAgICBpZiAoYXZhdGFyRm9yKSB7XG4gICAgICAgIGZvcm0uc2V0KCd0b3BpYycsIGF2YXRhckZvcik7XG4gICAgICB9XG4gICAgICB0aGlzLnhoci5zZW5kKGZvcm0pO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgaWYgKHRoaXMudG9SZWplY3QpIHtcbiAgICAgICAgdGhpcy50b1JlamVjdChlcnIpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMub25GYWlsdXJlKSB7XG4gICAgICAgIHRoaXMub25GYWlsdXJlKG51bGwpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgLyoqXG4gICAqIFN0YXJ0IHVwbG9hZGluZyB0aGUgZmlsZSB0byBkZWZhdWx0IGVuZHBvaW50LlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkxhcmdlRmlsZUhlbHBlciNcbiAgICpcbiAgICogQHBhcmFtIHtGaWxlfEJsb2J9IGRhdGEgdG8gdXBsb2FkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBhdmF0YXJGb3IgdG9waWMgbmFtZSBpZiB0aGUgdXBsb2FkIHJlcHJlc2VudHMgYW4gYXZhdGFyLlxuICAgKiBAcGFyYW0ge0NhbGxiYWNrfSBvblByb2dyZXNzIGNhbGxiYWNrLiBUYWtlcyBvbmUge2Zsb2F0fSBwYXJhbWV0ZXIgMC4uMVxuICAgKiBAcGFyYW0ge0NhbGxiYWNrfSBvblN1Y2Nlc3MgY2FsbGJhY2suIENhbGxlZCB3aGVuIHRoZSBmaWxlIGlzIHN1Y2Nlc3NmdWxseSB1cGxvYWRlZC5cbiAgICogQHBhcmFtIHtDYWxsYmFja30gb25GYWlsdXJlIGNhbGxiYWNrLiBDYWxsZWQgaW4gY2FzZSBvZiBhIGZhaWx1cmUuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSB1cGxvYWQgaXMgY29tcGxldGVkL2ZhaWxlZC5cbiAgICovXG4gIHVwbG9hZChkYXRhLCBhdmF0YXJGb3IsIG9uUHJvZ3Jlc3MsIG9uU3VjY2Vzcywgb25GYWlsdXJlKSB7XG4gICAgY29uc3QgYmFzZVVybCA9ICh0aGlzLl90aW5vZGUuX3NlY3VyZSA/ICdodHRwczovLycgOiAnaHR0cDovLycpICsgdGhpcy5fdGlub2RlLl9ob3N0O1xuICAgIHJldHVybiB0aGlzLnVwbG9hZFdpdGhCYXNlVXJsKGJhc2VVcmwsIGRhdGEsIGF2YXRhckZvciwgb25Qcm9ncmVzcywgb25TdWNjZXNzLCBvbkZhaWx1cmUpO1xuICB9XG4gIC8qKlxuICAgKiBEb3dubG9hZCB0aGUgZmlsZSBmcm9tIGEgZ2l2ZW4gVVJMIHVzaW5nIEdFVCByZXF1ZXN0LiBUaGlzIG1ldGhvZCB3b3JrcyB3aXRoIHRoZSBUaW5vZGUgc2VydmVyIG9ubHkuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTGFyZ2VGaWxlSGVscGVyI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcmVsYXRpdmVVcmwgLSBVUkwgdG8gZG93bmxvYWQgdGhlIGZpbGUgZnJvbS4gTXVzdCBiZSByZWxhdGl2ZSB1cmwsIGkuZS4gbXVzdCBub3QgY29udGFpbiB0aGUgaG9zdC5cbiAgICogQHBhcmFtIHtzdHJpbmc9fSBmaWxlbmFtZSAtIGZpbGUgbmFtZSB0byB1c2UgZm9yIHRoZSBkb3dubG9hZGVkIGZpbGUuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBkb3dubG9hZCBpcyBjb21wbGV0ZWQvZmFpbGVkLlxuICAgKi9cbiAgZG93bmxvYWQocmVsYXRpdmVVcmwsIGZpbGVuYW1lLCBtaW1ldHlwZSwgb25Qcm9ncmVzcywgb25FcnJvcikge1xuICAgIGlmICghaXNVcmxSZWxhdGl2ZShyZWxhdGl2ZVVybCkpIHtcbiAgICAgIC8vIEFzIGEgc2VjdXJpdHkgbWVhc3VyZSByZWZ1c2UgdG8gZG93bmxvYWQgZnJvbSBhbiBhYnNvbHV0ZSBVUkwuXG4gICAgICBpZiAob25FcnJvcikge1xuICAgICAgICBvbkVycm9yKGBUaGUgVVJMICcke3JlbGF0aXZlVXJsfScgbXVzdCBiZSByZWxhdGl2ZSwgbm90IGFic29sdXRlYCk7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghdGhpcy5fYXV0aFRva2VuKSB7XG4gICAgICBpZiAob25FcnJvcikge1xuICAgICAgICBvbkVycm9yKFwiTXVzdCBhdXRoZW50aWNhdGUgZmlyc3RcIik7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcztcbiAgICAvLyBHZXQgZGF0YSBhcyBibG9iIChzdG9yZWQgYnkgdGhlIGJyb3dzZXIgYXMgYSB0ZW1wb3JhcnkgZmlsZSkuXG4gICAgdGhpcy54aHIub3BlbignR0VUJywgcmVsYXRpdmVVcmwsIHRydWUpO1xuICAgIHRoaXMueGhyLnNldFJlcXVlc3RIZWFkZXIoJ1gtVGlub2RlLUFQSUtleScsIHRoaXMuX2FwaUtleSk7XG4gICAgdGhpcy54aHIuc2V0UmVxdWVzdEhlYWRlcignWC1UaW5vZGUtQXV0aCcsICdUb2tlbiAnICsgdGhpcy5fYXV0aFRva2VuLnRva2VuKTtcbiAgICB0aGlzLnhoci5yZXNwb25zZVR5cGUgPSAnYmxvYic7XG5cbiAgICB0aGlzLm9uUHJvZ3Jlc3MgPSBvblByb2dyZXNzO1xuICAgIHRoaXMueGhyLm9ucHJvZ3Jlc3MgPSBmdW5jdGlvbihlKSB7XG4gICAgICBpZiAoaW5zdGFuY2Uub25Qcm9ncmVzcykge1xuICAgICAgICAvLyBQYXNzaW5nIGUubG9hZGVkIGluc3RlYWQgb2YgZS5sb2FkZWQvZS50b3RhbCBiZWNhdXNlIGUudG90YWxcbiAgICAgICAgLy8gaXMgYWx3YXlzIDAgd2l0aCBnemlwIGNvbXByZXNzaW9uIGVuYWJsZWQgYnkgdGhlIHNlcnZlci5cbiAgICAgICAgaW5zdGFuY2Uub25Qcm9ncmVzcyhlLmxvYWRlZCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IHJlc3VsdCA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMudG9SZXNvbHZlID0gcmVzb2x2ZTtcbiAgICAgIHRoaXMudG9SZWplY3QgPSByZWplY3Q7XG4gICAgfSk7XG5cbiAgICAvLyBUaGUgYmxvYiBuZWVkcyB0byBiZSBzYXZlZCBhcyBmaWxlLiBUaGVyZSBpcyBubyBrbm93biB3YXkgdG9cbiAgICAvLyBzYXZlIHRoZSBibG9iIGFzIGZpbGUgb3RoZXIgdGhhbiB0byBmYWtlIGEgY2xpY2sgb24gYW4gPGEgaHJlZi4uLiBkb3dubG9hZD0uLi4+LlxuICAgIHRoaXMueGhyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHRoaXMuc3RhdHVzID09IDIwMCkge1xuICAgICAgICBjb25zdCBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgICAgICAvLyBVUkwuY3JlYXRlT2JqZWN0VVJMIGlzIG5vdCBhdmFpbGFibGUgaW4gbm9uLWJyb3dzZXIgZW52aXJvbm1lbnQuIFRoaXMgY2FsbCB3aWxsIGZhaWwuXG4gICAgICAgIGxpbmsuaHJlZiA9IHdpbmRvdy5VUkwuY3JlYXRlT2JqZWN0VVJMKG5ldyBCbG9iKFt0aGlzLnJlc3BvbnNlXSwge1xuICAgICAgICAgIHR5cGU6IG1pbWV0eXBlXG4gICAgICAgIH0pKTtcbiAgICAgICAgbGluay5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICBsaW5rLnNldEF0dHJpYnV0ZSgnZG93bmxvYWQnLCBmaWxlbmFtZSk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobGluayk7XG4gICAgICAgIGxpbmsuY2xpY2soKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChsaW5rKTtcbiAgICAgICAgd2luZG93LlVSTC5yZXZva2VPYmplY3RVUkwobGluay5ocmVmKTtcbiAgICAgICAgaWYgKGluc3RhbmNlLnRvUmVzb2x2ZSkge1xuICAgICAgICAgIGluc3RhbmNlLnRvUmVzb2x2ZSgpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdHVzID49IDQwMCAmJiBpbnN0YW5jZS50b1JlamVjdCkge1xuICAgICAgICAvLyBUaGUgdGhpcy5yZXNwb25zZVRleHQgaXMgdW5kZWZpbmVkLCBtdXN0IHVzZSB0aGlzLnJlc3BvbnNlIHdoaWNoIGlzIGEgYmxvYi5cbiAgICAgICAgLy8gTmVlZCB0byBjb252ZXJ0IHRoaXMucmVzcG9uc2UgdG8gSlNPTi4gVGhlIGJsb2IgY2FuIG9ubHkgYmUgYWNjZXNzZWQgYnkgdGhlXG4gICAgICAgIC8vIEZpbGVSZWFkZXIuXG4gICAgICAgIGNvbnN0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gICAgICAgIHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcGt0ID0gSlNPTi5wYXJzZSh0aGlzLnJlc3VsdCwganNvblBhcnNlSGVscGVyKTtcbiAgICAgICAgICAgIGluc3RhbmNlLnRvUmVqZWN0KG5ldyBFcnJvcihgJHtwa3QuY3RybC50ZXh0fSAoJHtwa3QuY3RybC5jb2RlfSlgKSk7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBpbnN0YW5jZS5fdGlub2RlLmxvZ2dlcihcIkVSUk9SOiBJbnZhbGlkIHNlcnZlciByZXNwb25zZSBpbiBMYXJnZUZpbGVIZWxwZXJcIiwgdGhpcy5yZXN1bHQpO1xuICAgICAgICAgICAgaW5zdGFuY2UudG9SZWplY3QoZXJyKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHJlYWRlci5yZWFkQXNUZXh0KHRoaXMucmVzcG9uc2UpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLnhoci5vbmVycm9yID0gZnVuY3Rpb24oZSkge1xuICAgICAgaWYgKGluc3RhbmNlLnRvUmVqZWN0KSB7XG4gICAgICAgIGluc3RhbmNlLnRvUmVqZWN0KG5ldyBFcnJvcihcImZhaWxlZFwiKSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRoaXMueGhyLm9uYWJvcnQgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmIChpbnN0YW5jZS50b1JlamVjdCkge1xuICAgICAgICBpbnN0YW5jZS50b1JlamVjdChudWxsKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdHJ5IHtcbiAgICAgIHRoaXMueGhyLnNlbmQoKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGlmICh0aGlzLnRvUmVqZWN0KSB7XG4gICAgICAgIHRoaXMudG9SZWplY3QoZXJyKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIC8qKlxuICAgKiBUcnkgdG8gY2FuY2VsIGFuIG9uZ29pbmcgdXBsb2FkIG9yIGRvd25sb2FkLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkxhcmdlRmlsZUhlbHBlciNcbiAgICovXG4gIGNhbmNlbCgpIHtcbiAgICBpZiAodGhpcy54aHIgJiYgdGhpcy54aHIucmVhZHlTdGF0ZSA8IDQpIHtcbiAgICAgIHRoaXMueGhyLmFib3J0KCk7XG4gICAgfVxuICB9XG4gIC8qKlxuICAgKiBHZXQgdW5pcXVlIGlkIG9mIHRoaXMgcmVxdWVzdC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5MYXJnZUZpbGVIZWxwZXIjXG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IHVuaXF1ZSBpZFxuICAgKi9cbiAgZ2V0SWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3JlcUlkO1xuICB9XG4gIC8qKlxuICAgKiBUbyB1c2UgTGFyZ2VGaWxlSGVscGVyIGluIGEgbm9uIGJyb3dzZXIgY29udGV4dCwgc3VwcGx5IFhNTEh0dHBSZXF1ZXN0IHByb3ZpZGVyLlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJvZiBMYXJnZUZpbGVIZWxwZXJcbiAgICogQHBhcmFtIHhoclByb3ZpZGVyIFhNTEh0dHBSZXF1ZXN0IHByb3ZpZGVyLCBlLmcuIGZvciBub2RlIDxjb2RlPnJlcXVpcmUoJ3hocicpPC9jb2RlPi5cbiAgICovXG4gIHN0YXRpYyBzZXROZXR3b3JrUHJvdmlkZXIoeGhyUHJvdmlkZXIpIHtcbiAgICBYSFJQcm92aWRlciA9IHhoclByb3ZpZGVyO1xuICB9XG59XG4iLCIvKipcbiAqIEBmaWxlIEhlbHBlciBjbGFzcyBmb3IgY29uc3RydWN0aW5nIHtAbGluayBUaW5vZGUuR2V0UXVlcnl9LlxuICpcbiAqIEBjb3B5cmlnaHQgMjAxNS0yMDIyIFRpbm9kZSBMTEMuXG4gKi9cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBIZWxwZXIgY2xhc3MgZm9yIGNvbnN0cnVjdGluZyB7QGxpbmsgVGlub2RlLkdldFF1ZXJ5fS5cbiAqXG4gKiBAY2xhc3MgTWV0YUdldEJ1aWxkZXJcbiAqIEBtZW1iZXJvZiBUaW5vZGVcbiAqXG4gKiBAcGFyYW0ge1Rpbm9kZS5Ub3BpY30gcGFyZW50IHRvcGljIHdoaWNoIGluc3RhbnRpYXRlZCB0aGlzIGJ1aWxkZXIuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1ldGFHZXRCdWlsZGVyIHtcbiAgY29uc3RydWN0b3IocGFyZW50KSB7XG4gICAgdGhpcy50b3BpYyA9IHBhcmVudDtcbiAgICB0aGlzLndoYXQgPSB7fTtcbiAgfVxuXG4gIC8vIEdldCB0aW1lc3RhbXAgb2YgdGhlIG1vc3QgcmVjZW50IGRlc2MgdXBkYXRlLlxuICAjZ2V0X2Rlc2NfaW1zKCkge1xuICAgIHJldHVybiB0aGlzLnRvcGljLnVwZGF0ZWQ7XG4gIH1cblxuICAvLyBHZXQgdGltZXN0YW1wIG9mIHRoZSBtb3N0IHJlY2VudCBzdWJzIHVwZGF0ZS5cbiAgI2dldF9zdWJzX2ltcygpIHtcbiAgICBpZiAodGhpcy50b3BpYy5pc1AyUFR5cGUoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuI2dldF9kZXNjX2ltcygpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy50b3BpYy5fbGFzdFN1YnNVcGRhdGU7XG4gIH1cbiAgLyoqXG4gICAqIEFkZCBxdWVyeSBwYXJhbWV0ZXJzIHRvIGZldGNoIG1lc3NhZ2VzIHdpdGhpbiBleHBsaWNpdCBsaW1pdHMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTWV0YUdldEJ1aWxkZXIjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gc2luY2UgLSBtZXNzYWdlcyBuZXdlciB0aGFuIHRoaXMgKGluY2x1c2l2ZSk7XG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gYmVmb3JlIC0gb2xkZXIgdGhhbiB0aGlzIChleGNsdXNpdmUpXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gbGltaXQgLSBudW1iZXIgb2YgbWVzc2FnZXMgdG8gZmV0Y2hcbiAgICogQHJldHVybnMge1Rpbm9kZS5NZXRhR2V0QnVpbGRlcn0gPGNvZGU+dGhpczwvY29kZT4gb2JqZWN0LlxuICAgKi9cbiAgd2l0aERhdGEoc2luY2UsIGJlZm9yZSwgbGltaXQpIHtcbiAgICB0aGlzLndoYXRbJ2RhdGEnXSA9IHtcbiAgICAgIHNpbmNlOiBzaW5jZSxcbiAgICAgIGJlZm9yZTogYmVmb3JlLFxuICAgICAgbGltaXQ6IGxpbWl0XG4gICAgfTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICAvKipcbiAgICogQWRkIHF1ZXJ5IHBhcmFtZXRlcnMgdG8gZmV0Y2ggbWVzc2FnZXMgbmV3ZXIgdGhhbiB0aGUgbGF0ZXN0IHNhdmVkIG1lc3NhZ2UuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTWV0YUdldEJ1aWxkZXIjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gbGltaXQgLSBudW1iZXIgb2YgbWVzc2FnZXMgdG8gZmV0Y2hcbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5NZXRhR2V0QnVpbGRlcn0gPGNvZGU+dGhpczwvY29kZT4gb2JqZWN0LlxuICAgKi9cbiAgd2l0aExhdGVyRGF0YShsaW1pdCkge1xuICAgIHJldHVybiB0aGlzLndpdGhEYXRhKHRoaXMudG9waWMuX21heFNlcSA+IDAgPyB0aGlzLnRvcGljLl9tYXhTZXEgKyAxIDogdW5kZWZpbmVkLCB1bmRlZmluZWQsIGxpbWl0KTtcbiAgfVxuICAvKipcbiAgICogQWRkIHF1ZXJ5IHBhcmFtZXRlcnMgdG8gZmV0Y2ggbWVzc2FnZXMgb2xkZXIgdGhhbiB0aGUgZWFybGllc3Qgc2F2ZWQgbWVzc2FnZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5NZXRhR2V0QnVpbGRlciNcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXI9fSBsaW1pdCAtIG1heGltdW0gbnVtYmVyIG9mIG1lc3NhZ2VzIHRvIGZldGNoLlxuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLk1ldGFHZXRCdWlsZGVyfSA8Y29kZT50aGlzPC9jb2RlPiBvYmplY3QuXG4gICAqL1xuICB3aXRoRWFybGllckRhdGEobGltaXQpIHtcbiAgICByZXR1cm4gdGhpcy53aXRoRGF0YSh1bmRlZmluZWQsIHRoaXMudG9waWMuX21pblNlcSA+IDAgPyB0aGlzLnRvcGljLl9taW5TZXEgOiB1bmRlZmluZWQsIGxpbWl0KTtcbiAgfVxuICAvKipcbiAgICogQWRkIHF1ZXJ5IHBhcmFtZXRlcnMgdG8gZmV0Y2ggdG9waWMgZGVzY3JpcHRpb24gaWYgaXQncyBuZXdlciB0aGFuIHRoZSBnaXZlbiB0aW1lc3RhbXAuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTWV0YUdldEJ1aWxkZXIjXG4gICAqXG4gICAqIEBwYXJhbSB7RGF0ZT19IGltcyAtIGZldGNoIG1lc3NhZ2VzIG5ld2VyIHRoYW4gdGhpcyB0aW1lc3RhbXAuXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuTWV0YUdldEJ1aWxkZXJ9IDxjb2RlPnRoaXM8L2NvZGU+IG9iamVjdC5cbiAgICovXG4gIHdpdGhEZXNjKGltcykge1xuICAgIHRoaXMud2hhdFsnZGVzYyddID0ge1xuICAgICAgaW1zOiBpbXNcbiAgICB9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIC8qKlxuICAgKiBBZGQgcXVlcnkgcGFyYW1ldGVycyB0byBmZXRjaCB0b3BpYyBkZXNjcmlwdGlvbiBpZiBpdCdzIG5ld2VyIHRoYW4gdGhlIGxhc3QgdXBkYXRlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLk1ldGFHZXRCdWlsZGVyI1xuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLk1ldGFHZXRCdWlsZGVyfSA8Y29kZT50aGlzPC9jb2RlPiBvYmplY3QuXG4gICAqL1xuICB3aXRoTGF0ZXJEZXNjKCkge1xuICAgIHJldHVybiB0aGlzLndpdGhEZXNjKHRoaXMuI2dldF9kZXNjX2ltcygpKTtcbiAgfVxuICAvKipcbiAgICogQWRkIHF1ZXJ5IHBhcmFtZXRlcnMgdG8gZmV0Y2ggc3Vic2NyaXB0aW9ucy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5NZXRhR2V0QnVpbGRlciNcbiAgICpcbiAgICogQHBhcmFtIHtEYXRlPX0gaW1zIC0gZmV0Y2ggc3Vic2NyaXB0aW9ucyBtb2RpZmllZCBtb3JlIHJlY2VudGx5IHRoYW4gdGhpcyB0aW1lc3RhbXBcbiAgICogQHBhcmFtIHtudW1iZXI9fSBsaW1pdCAtIG1heGltdW0gbnVtYmVyIG9mIHN1YnNjcmlwdGlvbnMgdG8gZmV0Y2guXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gdXNlck9yVG9waWMgLSB1c2VyIElEIG9yIHRvcGljIG5hbWUgdG8gZmV0Y2ggZm9yIGZldGNoaW5nIG9uZSBzdWJzY3JpcHRpb24uXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuTWV0YUdldEJ1aWxkZXJ9IDxjb2RlPnRoaXM8L2NvZGU+IG9iamVjdC5cbiAgICovXG4gIHdpdGhTdWIoaW1zLCBsaW1pdCwgdXNlck9yVG9waWMpIHtcbiAgICBjb25zdCBvcHRzID0ge1xuICAgICAgaW1zOiBpbXMsXG4gICAgICBsaW1pdDogbGltaXRcbiAgICB9O1xuICAgIGlmICh0aGlzLnRvcGljLmdldFR5cGUoKSA9PSAnbWUnKSB7XG4gICAgICBvcHRzLnRvcGljID0gdXNlck9yVG9waWM7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9wdHMudXNlciA9IHVzZXJPclRvcGljO1xuICAgIH1cbiAgICB0aGlzLndoYXRbJ3N1YiddID0gb3B0cztcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICAvKipcbiAgICogQWRkIHF1ZXJ5IHBhcmFtZXRlcnMgdG8gZmV0Y2ggYSBzaW5nbGUgc3Vic2NyaXB0aW9uLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLk1ldGFHZXRCdWlsZGVyI1xuICAgKlxuICAgKiBAcGFyYW0ge0RhdGU9fSBpbXMgLSBmZXRjaCBzdWJzY3JpcHRpb25zIG1vZGlmaWVkIG1vcmUgcmVjZW50bHkgdGhhbiB0aGlzIHRpbWVzdGFtcFxuICAgKiBAcGFyYW0ge3N0cmluZz19IHVzZXJPclRvcGljIC0gdXNlciBJRCBvciB0b3BpYyBuYW1lIHRvIGZldGNoIGZvciBmZXRjaGluZyBvbmUgc3Vic2NyaXB0aW9uLlxuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLk1ldGFHZXRCdWlsZGVyfSA8Y29kZT50aGlzPC9jb2RlPiBvYmplY3QuXG4gICAqL1xuICB3aXRoT25lU3ViKGltcywgdXNlck9yVG9waWMpIHtcbiAgICByZXR1cm4gdGhpcy53aXRoU3ViKGltcywgdW5kZWZpbmVkLCB1c2VyT3JUb3BpYyk7XG4gIH1cbiAgLyoqXG4gICAqIEFkZCBxdWVyeSBwYXJhbWV0ZXJzIHRvIGZldGNoIGEgc2luZ2xlIHN1YnNjcmlwdGlvbiBpZiBpdCdzIGJlZW4gdXBkYXRlZCBzaW5jZSB0aGUgbGFzdCB1cGRhdGUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTWV0YUdldEJ1aWxkZXIjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gdXNlck9yVG9waWMgLSB1c2VyIElEIG9yIHRvcGljIG5hbWUgdG8gZmV0Y2ggZm9yIGZldGNoaW5nIG9uZSBzdWJzY3JpcHRpb24uXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuTWV0YUdldEJ1aWxkZXJ9IDxjb2RlPnRoaXM8L2NvZGU+IG9iamVjdC5cbiAgICovXG4gIHdpdGhMYXRlck9uZVN1Yih1c2VyT3JUb3BpYykge1xuICAgIHJldHVybiB0aGlzLndpdGhPbmVTdWIodGhpcy50b3BpYy5fbGFzdFN1YnNVcGRhdGUsIHVzZXJPclRvcGljKTtcbiAgfVxuICAvKipcbiAgICogQWRkIHF1ZXJ5IHBhcmFtZXRlcnMgdG8gZmV0Y2ggc3Vic2NyaXB0aW9ucyB1cGRhdGVkIHNpbmNlIHRoZSBsYXN0IHVwZGF0ZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5NZXRhR2V0QnVpbGRlciNcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXI9fSBsaW1pdCAtIG1heGltdW0gbnVtYmVyIG9mIHN1YnNjcmlwdGlvbnMgdG8gZmV0Y2guXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuTWV0YUdldEJ1aWxkZXJ9IDxjb2RlPnRoaXM8L2NvZGU+IG9iamVjdC5cbiAgICovXG4gIHdpdGhMYXRlclN1YihsaW1pdCkge1xuICAgIHJldHVybiB0aGlzLndpdGhTdWIodGhpcy4jZ2V0X3N1YnNfaW1zKCksIGxpbWl0KTtcbiAgfVxuICAvKipcbiAgICogQWRkIHF1ZXJ5IHBhcmFtZXRlcnMgdG8gZmV0Y2ggdG9waWMgdGFncy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5NZXRhR2V0QnVpbGRlciNcbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5NZXRhR2V0QnVpbGRlcn0gPGNvZGU+dGhpczwvY29kZT4gb2JqZWN0LlxuICAgKi9cbiAgd2l0aFRhZ3MoKSB7XG4gICAgdGhpcy53aGF0Wyd0YWdzJ10gPSB0cnVlO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIC8qKlxuICAgKiBBZGQgcXVlcnkgcGFyYW1ldGVycyB0byBmZXRjaCB1c2VyJ3MgY3JlZGVudGlhbHMuIDxjb2RlPidtZSc8L2NvZGU+IHRvcGljIG9ubHkuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTWV0YUdldEJ1aWxkZXIjXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuTWV0YUdldEJ1aWxkZXJ9IDxjb2RlPnRoaXM8L2NvZGU+IG9iamVjdC5cbiAgICovXG4gIHdpdGhDcmVkKCkge1xuICAgIGlmICh0aGlzLnRvcGljLmdldFR5cGUoKSA9PSAnbWUnKSB7XG4gICAgICB0aGlzLndoYXRbJ2NyZWQnXSA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudG9waWMuX3Rpbm9kZS5sb2dnZXIoXCJFUlJPUjogSW52YWxpZCB0b3BpYyB0eXBlIGZvciBNZXRhR2V0QnVpbGRlcjp3aXRoQ3JlZHNcIiwgdGhpcy50b3BpYy5nZXRUeXBlKCkpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICAvKipcbiAgICogQWRkIHF1ZXJ5IHBhcmFtZXRlcnMgdG8gZmV0Y2ggZGVsZXRlZCBtZXNzYWdlcyB3aXRoaW4gZXhwbGljaXQgbGltaXRzLiBBbnkvYWxsIHBhcmFtZXRlcnMgY2FuIGJlIG51bGwuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTWV0YUdldEJ1aWxkZXIjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gc2luY2UgLSBpZHMgb2YgbWVzc2FnZXMgZGVsZXRlZCBzaW5jZSB0aGlzICdkZWwnIGlkIChpbmNsdXNpdmUpXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gbGltaXQgLSBudW1iZXIgb2YgZGVsZXRlZCBtZXNzYWdlIGlkcyB0byBmZXRjaFxuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLk1ldGFHZXRCdWlsZGVyfSA8Y29kZT50aGlzPC9jb2RlPiBvYmplY3QuXG4gICAqL1xuICB3aXRoRGVsKHNpbmNlLCBsaW1pdCkge1xuICAgIGlmIChzaW5jZSB8fCBsaW1pdCkge1xuICAgICAgdGhpcy53aGF0WydkZWwnXSA9IHtcbiAgICAgICAgc2luY2U6IHNpbmNlLFxuICAgICAgICBsaW1pdDogbGltaXRcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIC8qKlxuICAgKiBBZGQgcXVlcnkgcGFyYW1ldGVycyB0byBmZXRjaCBtZXNzYWdlcyBkZWxldGVkIGFmdGVyIHRoZSBzYXZlZCA8Y29kZT4nZGVsJzwvY29kZT4gaWQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTWV0YUdldEJ1aWxkZXIjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gbGltaXQgLSBudW1iZXIgb2YgZGVsZXRlZCBtZXNzYWdlIGlkcyB0byBmZXRjaFxuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLk1ldGFHZXRCdWlsZGVyfSA8Y29kZT50aGlzPC9jb2RlPiBvYmplY3QuXG4gICAqL1xuICB3aXRoTGF0ZXJEZWwobGltaXQpIHtcbiAgICAvLyBTcGVjaWZ5ICdzaW5jZScgb25seSBpZiB3ZSBoYXZlIGFscmVhZHkgcmVjZWl2ZWQgc29tZSBtZXNzYWdlcy4gSWZcbiAgICAvLyB3ZSBoYXZlIG5vIGxvY2FsbHkgY2FjaGVkIG1lc3NhZ2VzIHRoZW4gd2UgZG9uJ3QgY2FyZSBpZiBhbnkgbWVzc2FnZXMgd2VyZSBkZWxldGVkLlxuICAgIHJldHVybiB0aGlzLndpdGhEZWwodGhpcy50b3BpYy5fbWF4U2VxID4gMCA/IHRoaXMudG9waWMuX21heERlbCArIDEgOiB1bmRlZmluZWQsIGxpbWl0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeHRyYWN0IHN1YnF1ZXJ5OiBnZXQgYW4gb2JqZWN0IHRoYXQgY29udGFpbnMgc3BlY2lmaWVkIHN1YnF1ZXJ5LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLk1ldGFHZXRCdWlsZGVyI1xuICAgKiBAcGFyYW0ge3N0cmluZ30gd2hhdCAtIHN1YnF1ZXJ5IHRvIHJldHVybjogb25lIG9mICdkYXRhJywgJ3N1YicsICdkZXNjJywgJ3RhZ3MnLCAnY3JlZCcsICdkZWwnLlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSByZXF1ZXN0ZWQgc3VicXVlcnkgb3IgPGNvZGU+dW5kZWZpbmVkPC9jb2RlPi5cbiAgICovXG4gIGV4dHJhY3Qod2hhdCkge1xuICAgIHJldHVybiB0aGlzLndoYXRbd2hhdF07XG4gIH1cblxuICAvKipcbiAgICogQ29uc3RydWN0IHBhcmFtZXRlcnMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTWV0YUdldEJ1aWxkZXIjXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuR2V0UXVlcnl9IEdldCBxdWVyeVxuICAgKi9cbiAgYnVpbGQoKSB7XG4gICAgY29uc3Qgd2hhdCA9IFtdO1xuICAgIGxldCBwYXJhbXMgPSB7fTtcbiAgICBbJ2RhdGEnLCAnc3ViJywgJ2Rlc2MnLCAndGFncycsICdjcmVkJywgJ2RlbCddLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgaWYgKHRoaXMud2hhdC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgIHdoYXQucHVzaChrZXkpO1xuICAgICAgICBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGhpcy53aGF0W2tleV0pLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBwYXJhbXNba2V5XSA9IHRoaXMud2hhdFtrZXldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKHdoYXQubGVuZ3RoID4gMCkge1xuICAgICAgcGFyYW1zLndoYXQgPSB3aGF0LmpvaW4oJyAnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGFyYW1zID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICByZXR1cm4gcGFyYW1zO1xuICB9XG59XG4iLCIvKipcbiAqIEBtb2R1bGUgdGlub2RlLXNka1xuICpcbiAqIEBjb3B5cmlnaHQgMjAxNS0yMDIyIFRpbm9kZSBMTEMuXG4gKiBAc3VtbWFyeSBKYXZhc2NyaXB0IGJpbmRpbmdzIGZvciBUaW5vZGUuXG4gKiBAbGljZW5zZSBBcGFjaGUgMi4wXG4gKiBAdmVyc2lvbiAwLjIwXG4gKlxuICogU2VlIDxhIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vdGlub2RlL3dlYmFwcFwiPmh0dHBzOi8vZ2l0aHViLmNvbS90aW5vZGUvd2ViYXBwPC9hPiBmb3IgcmVhbC1saWZlIHVzYWdlLlxuICpcbiAqIEBleGFtcGxlXG4gKiA8aGVhZD5cbiAqIDxzY3JpcHQgc3JjPVwiLi4uL3Rpbm9kZS5qc1wiPjwvc2NyaXB0PlxuICogPC9oZWFkPlxuICpcbiAqIDxib2R5PlxuICogIC4uLlxuICogPHNjcmlwdD5cbiAqICAvLyBJbnN0YW50aWF0ZSB0aW5vZGUuXG4gKiAgY29uc3QgdGlub2RlID0gbmV3IFRpbm9kZShjb25maWcsIF8gPT4ge1xuICogICAgLy8gQ2FsbGVkIG9uIGluaXQgY29tcGxldGlvbi5cbiAqICB9KTtcbiAqICB0aW5vZGUuZW5hYmxlTG9nZ2luZyh0cnVlKTtcbiAqICB0aW5vZGUub25EaXNjb25uZWN0ID0gZXJyID0+IHtcbiAqICAgIC8vIEhhbmRsZSBkaXNjb25uZWN0LlxuICogIH07XG4gKiAgLy8gQ29ubmVjdCB0byB0aGUgc2VydmVyLlxuICogIHRpbm9kZS5jb25uZWN0KCdodHRwczovL2V4YW1wbGUuY29tLycpLnRoZW4oXyA9PiB7XG4gKiAgICAvLyBDb25uZWN0ZWQuIExvZ2luIG5vdy5cbiAqICAgIHJldHVybiB0aW5vZGUubG9naW5CYXNpYyhsb2dpbiwgcGFzc3dvcmQpO1xuICogIH0pLnRoZW4oY3RybCA9PiB7XG4gKiAgICAvLyBMb2dnZWQgaW4gZmluZSwgYXR0YWNoIGNhbGxiYWNrcywgc3Vic2NyaWJlIHRvICdtZScuXG4gKiAgICBjb25zdCBtZSA9IHRpbm9kZS5nZXRNZVRvcGljKCk7XG4gKiAgICBtZS5vbk1ldGFEZXNjID0gZnVuY3Rpb24obWV0YSkgeyAuLi4gfTtcbiAqICAgIC8vIFN1YnNjcmliZSwgZmV0Y2ggdG9waWMgZGVzY3JpcHRpb24gYW5kIHRoZSBsaXN0IG9mIGNvbnRhY3RzLlxuICogICAgbWUuc3Vic2NyaWJlKHtnZXQ6IHtkZXNjOiB7fSwgc3ViOiB7fX19KTtcbiAqICB9KS5jYXRjaChlcnIgPT4ge1xuICogICAgLy8gTG9naW4gb3Igc3Vic2NyaXB0aW9uIGZhaWxlZCwgZG8gc29tZXRoaW5nLlxuICogICAgLi4uXG4gKiAgfSk7XG4gKiAgLi4uXG4gKiA8L3NjcmlwdD5cbiAqIDwvYm9keT5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG4vLyBOT1RFIFRPIERFVkVMT1BFUlM6XG4vLyBMb2NhbGl6YWJsZSBzdHJpbmdzIHNob3VsZCBiZSBkb3VibGUgcXVvdGVkIFwi0YHRgtGA0L7QutCwINC90LAg0LTRgNGD0LPQvtC8INGP0LfRi9C60LVcIixcbi8vIG5vbi1sb2NhbGl6YWJsZSBzdHJpbmdzIHNob3VsZCBiZSBzaW5nbGUgcXVvdGVkICdub24tbG9jYWxpemVkJy5cblxuaW1wb3J0IEFjY2Vzc01vZGUgZnJvbSAnLi9hY2Nlc3MtbW9kZS5qcyc7XG5pbXBvcnQgKiBhcyBDb25zdCBmcm9tICcuL2NvbmZpZy5qcyc7XG5pbXBvcnQgQ29ubmVjdGlvbiBmcm9tICcuL2Nvbm5lY3Rpb24uanMnO1xuaW1wb3J0IERCQ2FjaGUgZnJvbSAnLi9kYi5qcyc7XG5pbXBvcnQgRHJhZnR5IGZyb20gJy4vZHJhZnR5LmpzJztcbmltcG9ydCBMYXJnZUZpbGVIZWxwZXIgZnJvbSAnLi9sYXJnZS1maWxlLmpzJztcbmltcG9ydCBNZXRhR2V0QnVpbGRlciBmcm9tICcuL21ldGEtYnVpbGRlci5qcyc7XG5pbXBvcnQge1xuICBUb3BpYyxcbiAgVG9waWNNZSxcbiAgVG9waWNGbmRcbn0gZnJvbSAnLi90b3BpYy5qcyc7XG5cbmltcG9ydCB7XG4gIGlzVXJsUmVsYXRpdmUsXG4gIGpzb25QYXJzZUhlbHBlcixcbiAgbWVyZ2VPYmosXG4gIHJmYzMzMzlEYXRlU3RyaW5nLFxuICBzaW1wbGlmeVxufSBmcm9tICcuL3V0aWxzLmpzJztcblxuLy8gUmUtZXhwb3J0IEFjY2Vzc01vZGVcbmV4cG9ydCB7XG4gIEFjY2Vzc01vZGVcbn07XG5cbmxldCBXZWJTb2NrZXRQcm92aWRlcjtcbmlmICh0eXBlb2YgV2ViU29ja2V0ICE9ICd1bmRlZmluZWQnKSB7XG4gIFdlYlNvY2tldFByb3ZpZGVyID0gV2ViU29ja2V0O1xufVxuXG5sZXQgWEhSUHJvdmlkZXI7XG5pZiAodHlwZW9mIFhNTEh0dHBSZXF1ZXN0ICE9ICd1bmRlZmluZWQnKSB7XG4gIFhIUlByb3ZpZGVyID0gWE1MSHR0cFJlcXVlc3Q7XG59XG5cbmxldCBJbmRleGVkREJQcm92aWRlcjtcbmlmICh0eXBlb2YgaW5kZXhlZERCICE9ICd1bmRlZmluZWQnKSB7XG4gIEluZGV4ZWREQlByb3ZpZGVyID0gaW5kZXhlZERCO1xufVxuXG4vLyBSZS1leHBvcnQgRHJhZnR5LlxuZXhwb3J0IHtcbiAgRHJhZnR5XG59XG5cbmluaXRGb3JOb25Ccm93c2VyQXBwKCk7XG5cbi8vIFV0aWxpdHkgZnVuY3Rpb25zXG5cbi8vIFBvbHlmaWxsIGZvciBub24tYnJvd3NlciBjb250ZXh0LCBlLmcuIE5vZGVKcy5cbmZ1bmN0aW9uIGluaXRGb3JOb25Ccm93c2VyQXBwKCkge1xuICAvLyBUaW5vZGUgcmVxdWlyZW1lbnQgaW4gbmF0aXZlIG1vZGUgYmVjYXVzZSByZWFjdCBuYXRpdmUgZG9lc24ndCBwcm92aWRlIEJhc2U2NCBtZXRob2RcbiAgY29uc3QgY2hhcnMgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLz0nO1xuXG4gIGlmICh0eXBlb2YgYnRvYSA9PSAndW5kZWZpbmVkJykge1xuICAgIGdsb2JhbC5idG9hID0gZnVuY3Rpb24oaW5wdXQgPSAnJykge1xuICAgICAgbGV0IHN0ciA9IGlucHV0O1xuICAgICAgbGV0IG91dHB1dCA9ICcnO1xuXG4gICAgICBmb3IgKGxldCBibG9jayA9IDAsIGNoYXJDb2RlLCBpID0gMCwgbWFwID0gY2hhcnM7IHN0ci5jaGFyQXQoaSB8IDApIHx8IChtYXAgPSAnPScsIGkgJSAxKTsgb3V0cHV0ICs9IG1hcC5jaGFyQXQoNjMgJiBibG9jayA+PiA4IC0gaSAlIDEgKiA4KSkge1xuXG4gICAgICAgIGNoYXJDb2RlID0gc3RyLmNoYXJDb2RlQXQoaSArPSAzIC8gNCk7XG5cbiAgICAgICAgaWYgKGNoYXJDb2RlID4gMHhGRikge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIididG9hJyBmYWlsZWQ6IFRoZSBzdHJpbmcgdG8gYmUgZW5jb2RlZCBjb250YWlucyBjaGFyYWN0ZXJzIG91dHNpZGUgb2YgdGhlIExhdGluMSByYW5nZS5cIik7XG4gICAgICAgIH1cbiAgICAgICAgYmxvY2sgPSBibG9jayA8PCA4IHwgY2hhckNvZGU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgYXRvYiA9PSAndW5kZWZpbmVkJykge1xuICAgIGdsb2JhbC5hdG9iID0gZnVuY3Rpb24oaW5wdXQgPSAnJykge1xuICAgICAgbGV0IHN0ciA9IGlucHV0LnJlcGxhY2UoLz0rJC8sICcnKTtcbiAgICAgIGxldCBvdXRwdXQgPSAnJztcblxuICAgICAgaWYgKHN0ci5sZW5ndGggJSA0ID09IDEpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiJ2F0b2InIGZhaWxlZDogVGhlIHN0cmluZyB0byBiZSBkZWNvZGVkIGlzIG5vdCBjb3JyZWN0bHkgZW5jb2RlZC5cIik7XG4gICAgICB9XG4gICAgICBmb3IgKGxldCBiYyA9IDAsIGJzID0gMCwgYnVmZmVyLCBpID0gMDsgYnVmZmVyID0gc3RyLmNoYXJBdChpKyspO1xuXG4gICAgICAgIH5idWZmZXIgJiYgKGJzID0gYmMgJSA0ID8gYnMgKiA2NCArIGJ1ZmZlciA6IGJ1ZmZlcixcbiAgICAgICAgICBiYysrICUgNCkgPyBvdXRwdXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZSgyNTUgJiBicyA+PiAoLTIgKiBiYyAmIDYpKSA6IDBcbiAgICAgICkge1xuICAgICAgICBidWZmZXIgPSBjaGFycy5pbmRleE9mKGJ1ZmZlcik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfTtcbiAgfVxuXG4gIGlmICh0eXBlb2Ygd2luZG93ID09ICd1bmRlZmluZWQnKSB7XG4gICAgZ2xvYmFsLndpbmRvdyA9IHtcbiAgICAgIFdlYlNvY2tldDogV2ViU29ja2V0UHJvdmlkZXIsXG4gICAgICBYTUxIdHRwUmVxdWVzdDogWEhSUHJvdmlkZXIsXG4gICAgICBpbmRleGVkREI6IEluZGV4ZWREQlByb3ZpZGVyLFxuICAgICAgVVJMOiB7XG4gICAgICAgIGNyZWF0ZU9iamVjdFVSTDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5hYmxlIHRvIHVzZSBVUkwuY3JlYXRlT2JqZWN0VVJMIGluIGEgbm9uLWJyb3dzZXIgYXBwbGljYXRpb25cIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBDb25uZWN0aW9uLnNldE5ldHdvcmtQcm92aWRlcnMoV2ViU29ja2V0UHJvdmlkZXIsIFhIUlByb3ZpZGVyKTtcbiAgTGFyZ2VGaWxlSGVscGVyLnNldE5ldHdvcmtQcm92aWRlcihYSFJQcm92aWRlcik7XG4gIERCQ2FjaGUuc2V0RGF0YWJhc2VQcm92aWRlcihJbmRleGVkREJQcm92aWRlcik7XG59XG5cbi8vIERldGVjdCBmaW5kIG1vc3QgdXNlZnVsIG5ldHdvcmsgdHJhbnNwb3J0LlxuZnVuY3Rpb24gZGV0ZWN0VHJhbnNwb3J0KCkge1xuICBpZiAodHlwZW9mIHdpbmRvdyA9PSAnb2JqZWN0Jykge1xuICAgIGlmICh3aW5kb3dbJ1dlYlNvY2tldCddKSB7XG4gICAgICByZXR1cm4gJ3dzJztcbiAgICB9IGVsc2UgaWYgKHdpbmRvd1snWE1MSHR0cFJlcXVlc3QnXSkge1xuICAgICAgLy8gVGhlIGJyb3dzZXIgb3Igbm9kZSBoYXMgbm8gd2Vic29ja2V0cywgdXNpbmcgbG9uZyBwb2xsaW5nLlxuICAgICAgcmV0dXJuICdscCc7XG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG4vLyBidG9hIHJlcGxhY2VtZW50LiBTdG9jayBidG9hIGZhaWxzIG9uIG9uIG5vbi1MYXRpbjEgc3RyaW5ncy5cbmZ1bmN0aW9uIGI2NEVuY29kZVVuaWNvZGUoc3RyKSB7XG4gIC8vIFRoZSBlbmNvZGVVUklDb21wb25lbnQgcGVyY2VudC1lbmNvZGVzIFVURi04IHN0cmluZyxcbiAgLy8gdGhlbiB0aGUgcGVyY2VudCBlbmNvZGluZyBpcyBjb252ZXJ0ZWQgaW50byByYXcgYnl0ZXMgd2hpY2hcbiAgLy8gY2FuIGJlIGZlZCBpbnRvIGJ0b2EuXG4gIHJldHVybiBidG9hKGVuY29kZVVSSUNvbXBvbmVudChzdHIpLnJlcGxhY2UoLyUoWzAtOUEtRl17Mn0pL2csXG4gICAgZnVuY3Rpb24gdG9Tb2xpZEJ5dGVzKG1hdGNoLCBwMSkge1xuICAgICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoJzB4JyArIHAxKTtcbiAgICB9KSk7XG59XG5cbi8vIEpTT04gc3RyaW5naWZ5IGhlbHBlciAtIHByZS1wcm9jZXNzb3IgZm9yIEpTT04uc3RyaW5naWZ5XG5mdW5jdGlvbiBqc29uQnVpbGRIZWxwZXIoa2V5LCB2YWwpIHtcbiAgaWYgKHZhbCBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAvLyBDb252ZXJ0IGphdmFzY3JpcHQgRGF0ZSBvYmplY3RzIHRvIHJmYzMzMzkgc3RyaW5nc1xuICAgIHZhbCA9IHJmYzMzMzlEYXRlU3RyaW5nKHZhbCk7XG4gIH0gZWxzZSBpZiAodmFsIGluc3RhbmNlb2YgQWNjZXNzTW9kZSkge1xuICAgIHZhbCA9IHZhbC5qc29uSGVscGVyKCk7XG4gIH0gZWxzZSBpZiAodmFsID09PSB1bmRlZmluZWQgfHwgdmFsID09PSBudWxsIHx8IHZhbCA9PT0gZmFsc2UgfHxcbiAgICAoQXJyYXkuaXNBcnJheSh2YWwpICYmIHZhbC5sZW5ndGggPT0gMCkgfHxcbiAgICAoKHR5cGVvZiB2YWwgPT0gJ29iamVjdCcpICYmIChPYmplY3Qua2V5cyh2YWwpLmxlbmd0aCA9PSAwKSkpIHtcbiAgICAvLyBzdHJpcCBvdXQgZW1wdHkgZWxlbWVudHMgd2hpbGUgc2VyaWFsaXppbmcgb2JqZWN0cyB0byBKU09OXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHJldHVybiB2YWw7XG59O1xuXG4vLyBUcmltcyB2ZXJ5IGxvbmcgc3RyaW5ncyAoZW5jb2RlZCBpbWFnZXMpIHRvIG1ha2UgbG9nZ2VkIHBhY2tldHMgbW9yZSByZWFkYWJsZS5cbmZ1bmN0aW9uIGpzb25Mb2dnZXJIZWxwZXIoa2V5LCB2YWwpIHtcbiAgaWYgKHR5cGVvZiB2YWwgPT0gJ3N0cmluZycgJiYgdmFsLmxlbmd0aCA+IDEyOCkge1xuICAgIHJldHVybiAnPCcgKyB2YWwubGVuZ3RoICsgJywgYnl0ZXM6ICcgKyB2YWwuc3Vic3RyaW5nKDAsIDEyKSArICcuLi4nICsgdmFsLnN1YnN0cmluZyh2YWwubGVuZ3RoIC0gMTIpICsgJz4nO1xuICB9XG4gIHJldHVybiBqc29uQnVpbGRIZWxwZXIoa2V5LCB2YWwpO1xufTtcblxuLy8gUGFyc2UgYnJvd3NlciB1c2VyIGFnZW50IHRvIGV4dHJhY3QgYnJvd3NlciBuYW1lIGFuZCB2ZXJzaW9uLlxuZnVuY3Rpb24gZ2V0QnJvd3NlckluZm8odWEsIHByb2R1Y3QpIHtcbiAgdWEgPSB1YSB8fCAnJztcbiAgbGV0IHJlYWN0bmF0aXZlID0gJyc7XG4gIC8vIENoZWNrIGlmIHRoaXMgaXMgYSBSZWFjdE5hdGl2ZSBhcHAuXG4gIGlmICgvcmVhY3RuYXRpdmUvaS50ZXN0KHByb2R1Y3QpKSB7XG4gICAgcmVhY3RuYXRpdmUgPSAnUmVhY3ROYXRpdmU7ICc7XG4gIH1cbiAgbGV0IHJlc3VsdDtcbiAgLy8gUmVtb3ZlIHVzZWxlc3Mgc3RyaW5nLlxuICB1YSA9IHVhLnJlcGxhY2UoJyAoS0hUTUwsIGxpa2UgR2Vja28pJywgJycpO1xuICAvLyBUZXN0IGZvciBXZWJLaXQtYmFzZWQgYnJvd3Nlci5cbiAgbGV0IG0gPSB1YS5tYXRjaCgvKEFwcGxlV2ViS2l0XFwvWy5cXGRdKykvaSk7XG4gIGlmIChtKSB7XG4gICAgLy8gTGlzdCBvZiBjb21tb24gc3RyaW5ncywgZnJvbSBtb3JlIHVzZWZ1bCB0byBsZXNzIHVzZWZ1bC5cbiAgICAvLyBBbGwgdW5rbm93biBzdHJpbmdzIGdldCB0aGUgaGlnaGVzdCAoLTEpIHByaW9yaXR5LlxuICAgIGNvbnN0IHByaW9yaXR5ID0gWydlZGcnLCAnY2hyb21lJywgJ3NhZmFyaScsICdtb2JpbGUnLCAndmVyc2lvbiddO1xuICAgIGxldCB0bXAgPSB1YS5zdWJzdHIobS5pbmRleCArIG1bMF0ubGVuZ3RoKS5zcGxpdCgnICcpO1xuICAgIGxldCB0b2tlbnMgPSBbXTtcbiAgICBsZXQgdmVyc2lvbjsgLy8gMS4wIGluIFZlcnNpb24vMS4wIG9yIHVuZGVmaW5lZDtcbiAgICAvLyBTcGxpdCBzdHJpbmcgbGlrZSAnTmFtZS8wLjAuMCcgaW50byBbJ05hbWUnLCAnMC4wLjAnLCAzXSB3aGVyZSB0aGUgbGFzdCBlbGVtZW50IGlzIHRoZSBwcmlvcml0eS5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRtcC5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IG0yID0gLyhbXFx3Ll0rKVtcXC9dKFtcXC5cXGRdKykvLmV4ZWModG1wW2ldKTtcbiAgICAgIGlmIChtMikge1xuICAgICAgICAvLyBVbmtub3duIHZhbHVlcyBhcmUgaGlnaGVzdCBwcmlvcml0eSAoLTEpLlxuICAgICAgICB0b2tlbnMucHVzaChbbTJbMV0sIG0yWzJdLCBwcmlvcml0eS5maW5kSW5kZXgoKGUpID0+IHtcbiAgICAgICAgICByZXR1cm4gbTJbMV0udG9Mb3dlckNhc2UoKS5zdGFydHNXaXRoKGUpO1xuICAgICAgICB9KV0pO1xuICAgICAgICBpZiAobTJbMV0gPT0gJ1ZlcnNpb24nKSB7XG4gICAgICAgICAgdmVyc2lvbiA9IG0yWzJdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIC8vIFNvcnQgYnkgcHJpb3JpdHk6IG1vcmUgaW50ZXJlc3RpbmcgaXMgZWFybGllciB0aGFuIGxlc3MgaW50ZXJlc3RpbmcuXG4gICAgdG9rZW5zLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgIHJldHVybiBhWzJdIC0gYlsyXTtcbiAgICB9KTtcbiAgICBpZiAodG9rZW5zLmxlbmd0aCA+IDApIHtcbiAgICAgIC8vIFJldHVybiB0aGUgbGVhc3QgY29tbW9uIGJyb3dzZXIgc3RyaW5nIGFuZCB2ZXJzaW9uLlxuICAgICAgaWYgKHRva2Vuc1swXVswXS50b0xvd2VyQ2FzZSgpLnN0YXJ0c1dpdGgoJ2VkZycpKSB7XG4gICAgICAgIHRva2Vuc1swXVswXSA9ICdFZGdlJztcbiAgICAgIH0gZWxzZSBpZiAodG9rZW5zWzBdWzBdID09ICdPUFInKSB7XG4gICAgICAgIHRva2Vuc1swXVswXSA9ICdPcGVyYSc7XG4gICAgICB9IGVsc2UgaWYgKHRva2Vuc1swXVswXSA9PSAnU2FmYXJpJyAmJiB2ZXJzaW9uKSB7XG4gICAgICAgIHRva2Vuc1swXVsxXSA9IHZlcnNpb247XG4gICAgICB9XG4gICAgICByZXN1bHQgPSB0b2tlbnNbMF1bMF0gKyAnLycgKyB0b2tlbnNbMF1bMV07XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEZhaWxlZCB0byBJRCB0aGUgYnJvd3Nlci4gUmV0dXJuIHRoZSB3ZWJraXQgdmVyc2lvbi5cbiAgICAgIHJlc3VsdCA9IG1bMV07XG4gICAgfVxuICB9IGVsc2UgaWYgKC9maXJlZm94L2kudGVzdCh1YSkpIHtcbiAgICBtID0gL0ZpcmVmb3hcXC8oWy5cXGRdKykvZy5leGVjKHVhKTtcbiAgICBpZiAobSkge1xuICAgICAgcmVzdWx0ID0gJ0ZpcmVmb3gvJyArIG1bMV07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdCA9ICdGaXJlZm94Lz8nO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvLyBOZWl0aGVyIEFwcGxlV2ViS2l0IG5vciBGaXJlZm94LiBUcnkgdGhlIGxhc3QgcmVzb3J0LlxuICAgIG0gPSAvKFtcXHcuXSspXFwvKFsuXFxkXSspLy5leGVjKHVhKTtcbiAgICBpZiAobSkge1xuICAgICAgcmVzdWx0ID0gbVsxXSArICcvJyArIG1bMl07XG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSB1YS5zcGxpdCgnICcpO1xuICAgICAgcmVzdWx0ID0gbVswXTtcbiAgICB9XG4gIH1cblxuICAvLyBTaG9ydGVuIHRoZSB2ZXJzaW9uIHRvIG9uZSBkb3QgJ2EuYmIuY2NjLmQgLT4gYS5iYicgYXQgbW9zdC5cbiAgbSA9IHJlc3VsdC5zcGxpdCgnLycpO1xuICBpZiAobS5sZW5ndGggPiAxKSB7XG4gICAgY29uc3QgdiA9IG1bMV0uc3BsaXQoJy4nKTtcbiAgICBjb25zdCBtaW5vciA9IHZbMV0gPyAnLicgKyB2WzFdLnN1YnN0cigwLCAyKSA6ICcnO1xuICAgIHJlc3VsdCA9IGAke21bMF19LyR7dlswXX0ke21pbm9yfWA7XG4gIH1cbiAgcmV0dXJuIHJlYWN0bmF0aXZlICsgcmVzdWx0O1xufVxuXG4vKipcbiAqIFRoZSBtYWluIGNsYXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIFRpbm9kZSBzZXJ2ZXIuXG4gKi9cbmV4cG9ydCBjbGFzcyBUaW5vZGUge1xuICBfaG9zdDtcbiAgX3NlY3VyZTtcblxuICBfYXBwTmFtZTtcblxuICAvLyBBUEkgS2V5LlxuICBfYXBpS2V5O1xuXG4gIC8vIE5hbWUgYW5kIHZlcnNpb24gb2YgdGhlIGJyb3dzZXIuXG4gIF9icm93c2VyID0gJyc7XG4gIF9wbGF0Zm9ybTtcbiAgLy8gSGFyZHdhcmVcbiAgX2h3b3MgPSAndW5kZWZpbmVkJztcbiAgX2h1bWFuTGFuZ3VhZ2UgPSAneHgnO1xuXG4gIC8vIExvZ2dpbmcgdG8gY29uc29sZSBlbmFibGVkXG4gIF9sb2dnaW5nRW5hYmxlZCA9IGZhbHNlO1xuICAvLyBXaGVuIGxvZ2dpbmcsIHRyaXAgbG9uZyBzdHJpbmdzIChiYXNlNjQtZW5jb2RlZCBpbWFnZXMpIGZvciByZWFkYWJpbGl0eVxuICBfdHJpbUxvbmdTdHJpbmdzID0gZmFsc2U7XG4gIC8vIFVJRCBvZiB0aGUgY3VycmVudGx5IGF1dGhlbnRpY2F0ZWQgdXNlci5cbiAgX215VUlEID0gbnVsbDtcbiAgLy8gU3RhdHVzIG9mIGNvbm5lY3Rpb246IGF1dGhlbnRpY2F0ZWQgb3Igbm90LlxuICBfYXV0aGVudGljYXRlZCA9IGZhbHNlO1xuICAvLyBMb2dpbiB1c2VkIGluIHRoZSBsYXN0IHN1Y2Nlc3NmdWwgYmFzaWMgYXV0aGVudGljYXRpb25cbiAgX2xvZ2luID0gbnVsbDtcbiAgLy8gVG9rZW4gd2hpY2ggY2FuIGJlIHVzZWQgZm9yIGxvZ2luIGluc3RlYWQgb2YgbG9naW4vcGFzc3dvcmQuXG4gIF9hdXRoVG9rZW4gPSBudWxsO1xuICAvLyBDb3VudGVyIG9mIHJlY2VpdmVkIHBhY2tldHNcbiAgX2luUGFja2V0Q291bnQgPSAwO1xuICAvLyBDb3VudGVyIGZvciBnZW5lcmF0aW5nIHVuaXF1ZSBtZXNzYWdlIElEc1xuICBfbWVzc2FnZUlkID0gTWF0aC5mbG9vcigoTWF0aC5yYW5kb20oKSAqIDB4RkZGRikgKyAweEZGRkYpO1xuICAvLyBJbmZvcm1hdGlvbiBhYm91dCB0aGUgc2VydmVyLCBpZiBjb25uZWN0ZWRcbiAgX3NlcnZlckluZm8gPSBudWxsO1xuICAvLyBQdXNoIG5vdGlmaWNhdGlvbiB0b2tlbi4gQ2FsbGVkIGRldmljZVRva2VuIGZvciBjb25zaXN0ZW5jeSB3aXRoIHRoZSBBbmRyb2lkIFNESy5cbiAgX2RldmljZVRva2VuID0gbnVsbDtcblxuICAvLyBDYWNoZSBvZiBwZW5kaW5nIHByb21pc2VzIGJ5IG1lc3NhZ2UgaWQuXG4gIF9wZW5kaW5nUHJvbWlzZXMgPSB7fTtcbiAgLy8gVGhlIFRpbWVvdXQgb2JqZWN0IHJldHVybmVkIGJ5IHRoZSByZWplY3QgZXhwaXJlZCBwcm9taXNlcyBzZXRJbnRlcnZhbC5cbiAgX2V4cGlyZVByb21pc2VzID0gbnVsbDtcblxuICAvLyBXZWJzb2NrZXQgb3IgbG9uZyBwb2xsaW5nIGNvbm5lY3Rpb24uXG4gIF9jb25uZWN0aW9uID0gbnVsbDtcblxuICAvLyBVc2UgaW5kZXhEQiBmb3IgY2FjaGluZyB0b3BpY3MgYW5kIG1lc3NhZ2VzLlxuICBfcGVyc2lzdCA9IGZhbHNlO1xuICAvLyBJbmRleGVkREIgd3JhcHBlciBvYmplY3QuXG4gIF9kYiA9IG51bGw7XG5cbiAgLy8gVGlub2RlJ3MgY2FjaGUgb2Ygb2JqZWN0c1xuICBfY2FjaGUgPSB7fTtcblxuICAvKipcbiAgICogQ3JlYXRlIFRpbm9kZSBvYmplY3QuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgLSBjb25maWd1cmF0aW9uIHBhcmFtZXRlcnMuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjb25maWcuYXBwTmFtZSAtIE5hbWUgb2YgdGhlIGNhbGxpbmcgYXBwbGljYXRpb24gdG8gYmUgcmVwb3J0ZWQgaW4gdGhlIFVzZXIgQWdlbnQuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjb25maWcuaG9zdCAtIEhvc3QgbmFtZSBhbmQgb3B0aW9uYWwgcG9ydCBudW1iZXIgdG8gY29ubmVjdCB0by5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGNvbmZpZy5hcGlLZXkgLSBBUEkga2V5IGdlbmVyYXRlZCBieSA8Y29kZT5rZXlnZW48L2NvZGU+LlxuICAgKiBAcGFyYW0ge3N0cmluZ30gY29uZmlnLnRyYW5zcG9ydCAtIFNlZSB7QGxpbmsgVGlub2RlLkNvbm5lY3Rpb24jdHJhbnNwb3J0fS5cbiAgICogQHBhcmFtIHtib29sZWFufSBjb25maWcuc2VjdXJlIC0gVXNlIFNlY3VyZSBXZWJTb2NrZXQgaWYgPGNvZGU+dHJ1ZTwvY29kZT4uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjb25maWcucGxhdGZvcm0gLSBPcHRpb25hbCBwbGF0Zm9ybSBpZGVudGlmaWVyLCBvbmUgb2YgPGNvZGU+XCJpb3NcIjwvY29kZT4sIDxjb2RlPlwid2ViXCI8L2NvZGU+LCA8Y29kZT5cImFuZHJvaWRcIjwvY29kZT4uXG4gICAqIEBwYXJhbSB7Ym9vbGVufSBjb25maWcucGVyc2lzdCAtIFVzZSBJbmRleGVkREIgcGVyc2lzdGVudCBzdG9yYWdlLlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBvbkNvbXBsZXRlIC0gY2FsbGJhY2sgdG8gY2FsbCB3aGVuIGluaXRpYWxpemF0aW9uIGlzIGNvbXBsZXRlZC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGNvbmZpZywgb25Db21wbGV0ZSkge1xuICAgIHRoaXMuX2hvc3QgPSBjb25maWcuaG9zdDtcbiAgICB0aGlzLl9zZWN1cmUgPSBjb25maWcuc2VjdXJlO1xuXG4gICAgLy8gQ2xpZW50LXByb3ZpZGVkIGFwcGxpY2F0aW9uIG5hbWUsIGZvcm1hdCA8TmFtZT4vPHZlcnNpb24gbnVtYmVyPlxuICAgIHRoaXMuX2FwcE5hbWUgPSBjb25maWcuYXBwTmFtZSB8fCBcIlVuZGVmaW5lZFwiO1xuXG4gICAgLy8gQVBJIEtleS5cbiAgICB0aGlzLl9hcGlLZXkgPSBjb25maWcuYXBpS2V5O1xuXG4gICAgLy8gTmFtZSBhbmQgdmVyc2lvbiBvZiB0aGUgYnJvd3Nlci5cbiAgICB0aGlzLl9wbGF0Zm9ybSA9IGNvbmZpZy5wbGF0Zm9ybSB8fCAnd2ViJztcbiAgICAvLyBVbmRlcmx5aW5nIE9TLlxuICAgIGlmICh0eXBlb2YgbmF2aWdhdG9yICE9ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aGlzLl9icm93c2VyID0gZ2V0QnJvd3NlckluZm8obmF2aWdhdG9yLnVzZXJBZ2VudCwgbmF2aWdhdG9yLnByb2R1Y3QpO1xuICAgICAgdGhpcy5faHdvcyA9IG5hdmlnYXRvci5wbGF0Zm9ybTtcbiAgICAgIC8vIFRoaXMgaXMgdGhlIGRlZmF1bHQgbGFuZ3VhZ2UuIEl0IGNvdWxkIGJlIGNoYW5nZWQgYnkgY2xpZW50LlxuICAgICAgdGhpcy5faHVtYW5MYW5ndWFnZSA9IG5hdmlnYXRvci5sYW5ndWFnZSB8fCAnZW4tVVMnO1xuICAgIH1cblxuICAgIENvbm5lY3Rpb24ubG9nZ2VyID0gdGhpcy5sb2dnZXI7XG4gICAgRHJhZnR5LmxvZ2dlciA9IHRoaXMubG9nZ2VyO1xuXG4gICAgLy8gV2ViU29ja2V0IG9yIGxvbmcgcG9sbGluZyBuZXR3b3JrIGNvbm5lY3Rpb24uXG4gICAgaWYgKGNvbmZpZy50cmFuc3BvcnQgIT0gJ2xwJyAmJiBjb25maWcudHJhbnNwb3J0ICE9ICd3cycpIHtcbiAgICAgIGNvbmZpZy50cmFuc3BvcnQgPSBkZXRlY3RUcmFuc3BvcnQoKTtcbiAgICB9XG4gICAgdGhpcy5fY29ubmVjdGlvbiA9IG5ldyBDb25uZWN0aW9uKGNvbmZpZywgQ29uc3QuUFJPVE9DT0xfVkVSU0lPTiwgLyogYXV0b3JlY29ubmVjdCAqLyB0cnVlKTtcbiAgICB0aGlzLl9jb25uZWN0aW9uLm9uTWVzc2FnZSA9IChkYXRhKSA9PiB7XG4gICAgICAvLyBDYWxsIHRoZSBtYWluIG1lc3NhZ2UgZGlzcGF0Y2hlci5cbiAgICAgIHRoaXMuI2Rpc3BhdGNoTWVzc2FnZShkYXRhKTtcbiAgICB9XG5cbiAgICAvLyBSZWFkeSB0byBzdGFydCBzZW5kaW5nLlxuICAgIHRoaXMuX2Nvbm5lY3Rpb24ub25PcGVuID0gXyA9PiB0aGlzLiNjb25uZWN0aW9uT3BlbigpO1xuICAgIHRoaXMuX2Nvbm5lY3Rpb24ub25EaXNjb25uZWN0ID0gKGVyciwgY29kZSkgPT4gdGhpcy4jZGlzY29ubmVjdGVkKGVyciwgY29kZSk7XG5cbiAgICAvLyBXcmFwcGVyIGZvciB0aGUgcmVjb25uZWN0IGl0ZXJhdG9yIGNhbGxiYWNrLlxuICAgIHRoaXMuX2Nvbm5lY3Rpb24ub25BdXRvcmVjb25uZWN0SXRlcmF0aW9uID0gKHRpbWVvdXQsIHByb21pc2UpID0+IHtcbiAgICAgIGlmICh0aGlzLm9uQXV0b3JlY29ubmVjdEl0ZXJhdGlvbikge1xuICAgICAgICB0aGlzLm9uQXV0b3JlY29ubmVjdEl0ZXJhdGlvbih0aW1lb3V0LCBwcm9taXNlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLl9wZXJzaXN0ID0gY29uZmlnLnBlcnNpc3Q7XG4gICAgLy8gSW5pdGlhbGl6ZSBvYmplY3QgcmVnYXJkbGVzcy4gSXQgc2ltcGxpZmllcyB0aGUgY29kZS5cbiAgICB0aGlzLl9kYiA9IG5ldyBEQkNhY2hlKGVyciA9PiB7XG4gICAgICB0aGlzLmxvZ2dlcignREInLCBlcnIpO1xuICAgIH0sIHRoaXMubG9nZ2VyKTtcblxuICAgIGlmICh0aGlzLl9wZXJzaXN0KSB7XG4gICAgICAvLyBDcmVhdGUgdGhlIHBlcnNpc3RlbnQgY2FjaGUuXG4gICAgICAvLyBTdG9yZSBwcm9taXNlcyB0byBiZSByZXNvbHZlZCB3aGVuIG1lc3NhZ2VzIGxvYWQgaW50byBtZW1vcnkuXG4gICAgICBjb25zdCBwcm9tID0gW107XG4gICAgICB0aGlzLl9kYi5pbml0RGF0YWJhc2UoKS50aGVuKF8gPT4ge1xuICAgICAgICAvLyBGaXJzdCBsb2FkIHRvcGljcyBpbnRvIG1lbW9yeS5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2RiLm1hcFRvcGljcygoZGF0YSkgPT4ge1xuICAgICAgICAgIGxldCB0b3BpYyA9IHRoaXMuI2NhY2hlR2V0KCd0b3BpYycsIGRhdGEubmFtZSk7XG4gICAgICAgICAgaWYgKHRvcGljKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChkYXRhLm5hbWUgPT0gQ29uc3QuVE9QSUNfTUUpIHtcbiAgICAgICAgICAgIHRvcGljID0gbmV3IFRvcGljTWUoKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGRhdGEubmFtZSA9PSBDb25zdC5UT1BJQ19GTkQpIHtcbiAgICAgICAgICAgIHRvcGljID0gbmV3IFRvcGljRm5kKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRvcGljID0gbmV3IFRvcGljKGRhdGEubmFtZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuX2RiLmRlc2VyaWFsaXplVG9waWModG9waWMsIGRhdGEpO1xuICAgICAgICAgIHRoaXMuI2F0dGFjaENhY2hlVG9Ub3BpYyh0b3BpYyk7XG4gICAgICAgICAgdG9waWMuX2NhY2hlUHV0U2VsZigpO1xuICAgICAgICAgIC8vIFRvcGljIGxvYWRlZCBmcm9tIERCIGlzIG5vdCBuZXcuXG4gICAgICAgICAgZGVsZXRlIHRvcGljLl9uZXc7XG4gICAgICAgICAgLy8gUmVxdWVzdCB0byBsb2FkIG1lc3NhZ2VzIGFuZCBzYXZlIHRoZSBwcm9taXNlLlxuICAgICAgICAgIHByb20ucHVzaCh0b3BpYy5fbG9hZE1lc3NhZ2VzKHRoaXMuX2RiKSk7XG4gICAgICAgIH0pO1xuICAgICAgfSkudGhlbihfID0+IHtcbiAgICAgICAgLy8gVGhlbiBsb2FkIHVzZXJzLlxuICAgICAgICByZXR1cm4gdGhpcy5fZGIubWFwVXNlcnMoKGRhdGEpID0+IHtcbiAgICAgICAgICB0aGlzLiNjYWNoZVB1dCgndXNlcicsIGRhdGEudWlkLCBtZXJnZU9iaih7fSwgZGF0YS5wdWJsaWMpKTtcbiAgICAgICAgfSk7XG4gICAgICB9KS50aGVuKF8gPT4ge1xuICAgICAgICAvLyBOb3cgd2FpdCBmb3IgYWxsIG1lc3NhZ2VzIHRvIGZpbmlzaCBsb2FkaW5nLlxuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbSk7XG4gICAgICB9KS50aGVuKF8gPT4ge1xuICAgICAgICBpZiAob25Db21wbGV0ZSkge1xuICAgICAgICAgIG9uQ29tcGxldGUoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxvZ2dlcihcIlBlcnNpc3RlbnQgY2FjaGUgaW5pdGlhbGl6ZWQuXCIpO1xuICAgICAgfSkuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgaWYgKG9uQ29tcGxldGUpIHtcbiAgICAgICAgICBvbkNvbXBsZXRlKGVycik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sb2dnZXIoXCJGYWlsZWQgdG8gaW5pdGlhbGl6ZSBwZXJzaXN0ZW50IGNhY2hlOlwiLCBlcnIpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2RiLmRlbGV0ZURhdGFiYXNlKCkudGhlbihfID0+IHtcbiAgICAgICAgaWYgKG9uQ29tcGxldGUpIHtcbiAgICAgICAgICBvbkNvbXBsZXRlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8vIFByaXZhdGUgbWV0aG9kcy5cblxuICAvLyBDb25zb2xlIGxvZ2dlci4gQmFiZWwgc29tZWhvdyBmYWlscyB0byBwYXJzZSAnLi4ucmVzdCcgcGFyYW1ldGVyLlxuICBsb2dnZXIoc3RyLCAuLi5hcmdzKSB7XG4gICAgaWYgKHRoaXMuX2xvZ2dpbmdFbmFibGVkKSB7XG4gICAgICBjb25zdCBkID0gbmV3IERhdGUoKTtcbiAgICAgIGNvbnN0IGRhdGVTdHJpbmcgPSAoJzAnICsgZC5nZXRVVENIb3VycygpKS5zbGljZSgtMikgKyAnOicgK1xuICAgICAgICAoJzAnICsgZC5nZXRVVENNaW51dGVzKCkpLnNsaWNlKC0yKSArICc6JyArXG4gICAgICAgICgnMCcgKyBkLmdldFVUQ1NlY29uZHMoKSkuc2xpY2UoLTIpICsgJy4nICtcbiAgICAgICAgKCcwMCcgKyBkLmdldFVUQ01pbGxpc2Vjb25kcygpKS5zbGljZSgtMyk7XG5cbiAgICAgIGNvbnNvbGUubG9nKCdbJyArIGRhdGVTdHJpbmcgKyAnXScsIHN0ciwgYXJncy5qb2luKCcgJykpO1xuICAgIH1cbiAgfVxuXG4gIC8vIEdlbmVyYXRvciBvZiBkZWZhdWx0IHByb21pc2VzIGZvciBzZW50IHBhY2tldHMuXG4gICNtYWtlUHJvbWlzZShpZCkge1xuICAgIGxldCBwcm9taXNlID0gbnVsbDtcbiAgICBpZiAoaWQpIHtcbiAgICAgIHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIC8vIFN0b3JlZCBjYWxsYmFja3Mgd2lsbCBiZSBjYWxsZWQgd2hlbiB0aGUgcmVzcG9uc2UgcGFja2V0IHdpdGggdGhpcyBJZCBhcnJpdmVzXG4gICAgICAgIHRoaXMuX3BlbmRpbmdQcm9taXNlc1tpZF0gPSB7XG4gICAgICAgICAgJ3Jlc29sdmUnOiByZXNvbHZlLFxuICAgICAgICAgICdyZWplY3QnOiByZWplY3QsXG4gICAgICAgICAgJ3RzJzogbmV3IERhdGUoKVxuICAgICAgICB9O1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBwcm9taXNlO1xuICB9O1xuXG4gIC8vIFJlc29sdmUgb3IgcmVqZWN0IGEgcGVuZGluZyBwcm9taXNlLlxuICAvLyBVbnJlc29sdmVkIHByb21pc2VzIGFyZSBzdG9yZWQgaW4gX3BlbmRpbmdQcm9taXNlcy5cbiAgI2V4ZWNQcm9taXNlKGlkLCBjb2RlLCBvbk9LLCBlcnJvclRleHQpIHtcbiAgICBjb25zdCBjYWxsYmFja3MgPSB0aGlzLl9wZW5kaW5nUHJvbWlzZXNbaWRdO1xuICAgIGlmIChjYWxsYmFja3MpIHtcbiAgICAgIGRlbGV0ZSB0aGlzLl9wZW5kaW5nUHJvbWlzZXNbaWRdO1xuICAgICAgaWYgKGNvZGUgPj0gMjAwICYmIGNvZGUgPCA0MDApIHtcbiAgICAgICAgaWYgKGNhbGxiYWNrcy5yZXNvbHZlKSB7XG4gICAgICAgICAgY2FsbGJhY2tzLnJlc29sdmUob25PSyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoY2FsbGJhY2tzLnJlamVjdCkge1xuICAgICAgICBjYWxsYmFja3MucmVqZWN0KG5ldyBFcnJvcihgJHtlcnJvclRleHR9ICgke2NvZGV9KWApKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBTZW5kIGEgcGFja2V0LiBJZiBwYWNrZXQgaWQgaXMgcHJvdmlkZWQgcmV0dXJuIGEgcHJvbWlzZS5cbiAgI3NlbmQocGt0LCBpZCkge1xuICAgIGxldCBwcm9taXNlO1xuICAgIGlmIChpZCkge1xuICAgICAgcHJvbWlzZSA9IHRoaXMuI21ha2VQcm9taXNlKGlkKTtcbiAgICB9XG4gICAgcGt0ID0gc2ltcGxpZnkocGt0KTtcbiAgICBsZXQgbXNnID0gSlNPTi5zdHJpbmdpZnkocGt0KTtcbiAgICB0aGlzLmxvZ2dlcihcIm91dDogXCIgKyAodGhpcy5fdHJpbUxvbmdTdHJpbmdzID8gSlNPTi5zdHJpbmdpZnkocGt0LCBqc29uTG9nZ2VySGVscGVyKSA6IG1zZykpO1xuICAgIHRyeSB7XG4gICAgICB0aGlzLl9jb25uZWN0aW9uLnNlbmRUZXh0KG1zZyk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAvLyBJZiBzZW5kVGV4dCB0aHJvd3MsIHdyYXAgdGhlIGVycm9yIGluIGEgcHJvbWlzZSBvciByZXRocm93LlxuICAgICAgaWYgKGlkKSB7XG4gICAgICAgIHRoaXMuI2V4ZWNQcm9taXNlKGlkLCBDb25uZWN0aW9uLk5FVFdPUktfRVJST1IsIG51bGwsIGVyci5tZXNzYWdlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IGVycjtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICAvLyBUaGUgbWFpbiBtZXNzYWdlIGRpc3BhdGNoZXIuXG4gICNkaXNwYXRjaE1lc3NhZ2UoZGF0YSkge1xuICAgIC8vIFNraXAgZW1wdHkgcmVzcG9uc2UuIFRoaXMgaGFwcGVucyB3aGVuIExQIHRpbWVzIG91dC5cbiAgICBpZiAoIWRhdGEpXG4gICAgICByZXR1cm47XG5cbiAgICB0aGlzLl9pblBhY2tldENvdW50Kys7XG5cbiAgICAvLyBTZW5kIHJhdyBtZXNzYWdlIHRvIGxpc3RlbmVyXG4gICAgaWYgKHRoaXMub25SYXdNZXNzYWdlKSB7XG4gICAgICB0aGlzLm9uUmF3TWVzc2FnZShkYXRhKTtcbiAgICB9XG5cbiAgICBpZiAoZGF0YSA9PT0gJzAnKSB7XG4gICAgICAvLyBTZXJ2ZXIgcmVzcG9uc2UgdG8gYSBuZXR3b3JrIHByb2JlLlxuICAgICAgaWYgKHRoaXMub25OZXR3b3JrUHJvYmUpIHtcbiAgICAgICAgdGhpcy5vbk5ldHdvcmtQcm9iZSgpO1xuICAgICAgfVxuICAgICAgLy8gTm8gcHJvY2Vzc2luZyBpcyBuZWNlc3NhcnkuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IHBrdCA9IEpTT04ucGFyc2UoZGF0YSwganNvblBhcnNlSGVscGVyKTtcbiAgICBpZiAoIXBrdCkge1xuICAgICAgdGhpcy5sb2dnZXIoXCJpbjogXCIgKyBkYXRhKTtcbiAgICAgIHRoaXMubG9nZ2VyKFwiRVJST1I6IGZhaWxlZCB0byBwYXJzZSBkYXRhXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmxvZ2dlcihcImluOiBcIiArICh0aGlzLl90cmltTG9uZ1N0cmluZ3MgPyBKU09OLnN0cmluZ2lmeShwa3QsIGpzb25Mb2dnZXJIZWxwZXIpIDogZGF0YSkpO1xuXG4gICAgICAvLyBTZW5kIGNvbXBsZXRlIHBhY2tldCB0byBsaXN0ZW5lclxuICAgICAgaWYgKHRoaXMub25NZXNzYWdlKSB7XG4gICAgICAgIHRoaXMub25NZXNzYWdlKHBrdCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChwa3QuY3RybCkge1xuICAgICAgICAvLyBIYW5kbGluZyB7Y3RybH0gbWVzc2FnZVxuICAgICAgICBpZiAodGhpcy5vbkN0cmxNZXNzYWdlKSB7XG4gICAgICAgICAgdGhpcy5vbkN0cmxNZXNzYWdlKHBrdC5jdHJsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJlc29sdmUgb3IgcmVqZWN0IGEgcGVuZGluZyBwcm9taXNlLCBpZiBhbnlcbiAgICAgICAgaWYgKHBrdC5jdHJsLmlkKSB7XG4gICAgICAgICAgdGhpcy4jZXhlY1Byb21pc2UocGt0LmN0cmwuaWQsIHBrdC5jdHJsLmNvZGUsIHBrdC5jdHJsLCBwa3QuY3RybC50ZXh0KTtcbiAgICAgICAgfVxuICAgICAgICBzZXRUaW1lb3V0KF8gPT4ge1xuICAgICAgICAgIGlmIChwa3QuY3RybC5jb2RlID09IDIwNSAmJiBwa3QuY3RybC50ZXh0ID09ICdldmljdGVkJykge1xuICAgICAgICAgICAgLy8gVXNlciBldmljdGVkIGZyb20gdG9waWMuXG4gICAgICAgICAgICBjb25zdCB0b3BpYyA9IHRoaXMuI2NhY2hlR2V0KCd0b3BpYycsIHBrdC5jdHJsLnRvcGljKTtcbiAgICAgICAgICAgIGlmICh0b3BpYykge1xuICAgICAgICAgICAgICB0b3BpYy5fcmVzZXRTdWIoKTtcbiAgICAgICAgICAgICAgaWYgKHBrdC5jdHJsLnBhcmFtcyAmJiBwa3QuY3RybC5wYXJhbXMudW5zdWIpIHtcbiAgICAgICAgICAgICAgICB0b3BpYy5fZ29uZSgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChwa3QuY3RybC5jb2RlIDwgMzAwICYmIHBrdC5jdHJsLnBhcmFtcykge1xuICAgICAgICAgICAgaWYgKHBrdC5jdHJsLnBhcmFtcy53aGF0ID09ICdkYXRhJykge1xuICAgICAgICAgICAgICAvLyBjb2RlPTIwOCwgYWxsIG1lc3NhZ2VzIHJlY2VpdmVkOiBcInBhcmFtc1wiOntcImNvdW50XCI6MTEsXCJ3aGF0XCI6XCJkYXRhXCJ9LFxuICAgICAgICAgICAgICBjb25zdCB0b3BpYyA9IHRoaXMuI2NhY2hlR2V0KCd0b3BpYycsIHBrdC5jdHJsLnRvcGljKTtcbiAgICAgICAgICAgICAgaWYgKHRvcGljKSB7XG4gICAgICAgICAgICAgICAgdG9waWMuX2FsbE1lc3NhZ2VzUmVjZWl2ZWQocGt0LmN0cmwucGFyYW1zLmNvdW50KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChwa3QuY3RybC5wYXJhbXMud2hhdCA9PSAnc3ViJykge1xuICAgICAgICAgICAgICAvLyBjb2RlPTIwNCwgdGhlIHRvcGljIGhhcyBubyAocmVmcmVzaGVkKSBzdWJzY3JpcHRpb25zLlxuICAgICAgICAgICAgICBjb25zdCB0b3BpYyA9IHRoaXMuI2NhY2hlR2V0KCd0b3BpYycsIHBrdC5jdHJsLnRvcGljKTtcbiAgICAgICAgICAgICAgaWYgKHRvcGljKSB7XG4gICAgICAgICAgICAgICAgLy8gVHJpZ2dlciB0b3BpYy5vblN1YnNVcGRhdGVkLlxuICAgICAgICAgICAgICAgIHRvcGljLl9wcm9jZXNzTWV0YVN1YihbXSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sIDApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2V0VGltZW91dChfID0+IHtcbiAgICAgICAgICBpZiAocGt0Lm1ldGEpIHtcbiAgICAgICAgICAgIC8vIEhhbmRsaW5nIGEge21ldGF9IG1lc3NhZ2UuXG4gICAgICAgICAgICAvLyBQcmVmZXJyZWQgQVBJOiBSb3V0ZSBtZXRhIHRvIHRvcGljLCBpZiBvbmUgaXMgcmVnaXN0ZXJlZFxuICAgICAgICAgICAgY29uc3QgdG9waWMgPSB0aGlzLiNjYWNoZUdldCgndG9waWMnLCBwa3QubWV0YS50b3BpYyk7XG4gICAgICAgICAgICBpZiAodG9waWMpIHtcbiAgICAgICAgICAgICAgdG9waWMuX3JvdXRlTWV0YShwa3QubWV0YSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChwa3QubWV0YS5pZCkge1xuICAgICAgICAgICAgICB0aGlzLiNleGVjUHJvbWlzZShwa3QubWV0YS5pZCwgMjAwLCBwa3QubWV0YSwgJ01FVEEnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gU2Vjb25kYXJ5IEFQSTogY2FsbGJhY2tcbiAgICAgICAgICAgIGlmICh0aGlzLm9uTWV0YU1lc3NhZ2UpIHtcbiAgICAgICAgICAgICAgdGhpcy5vbk1ldGFNZXNzYWdlKHBrdC5tZXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKHBrdC5kYXRhKSB7XG4gICAgICAgICAgICAvLyBIYW5kbGluZyB7ZGF0YX0gbWVzc2FnZVxuICAgICAgICAgICAgLy8gUHJlZmVycmVkIEFQSTogUm91dGUgZGF0YSB0byB0b3BpYywgaWYgb25lIGlzIHJlZ2lzdGVyZWRcbiAgICAgICAgICAgIGNvbnN0IHRvcGljID0gdGhpcy4jY2FjaGVHZXQoJ3RvcGljJywgcGt0LmRhdGEudG9waWMpO1xuICAgICAgICAgICAgaWYgKHRvcGljKSB7XG4gICAgICAgICAgICAgIHRvcGljLl9yb3V0ZURhdGEocGt0LmRhdGEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBTZWNvbmRhcnkgQVBJOiBDYWxsIGNhbGxiYWNrXG4gICAgICAgICAgICBpZiAodGhpcy5vbkRhdGFNZXNzYWdlKSB7XG4gICAgICAgICAgICAgIHRoaXMub25EYXRhTWVzc2FnZShwa3QuZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChwa3QucHJlcykge1xuICAgICAgICAgICAgLy8gSGFuZGxpbmcge3ByZXN9IG1lc3NhZ2VcbiAgICAgICAgICAgIC8vIFByZWZlcnJlZCBBUEk6IFJvdXRlIHByZXNlbmNlIHRvIHRvcGljLCBpZiBvbmUgaXMgcmVnaXN0ZXJlZFxuICAgICAgICAgICAgY29uc3QgdG9waWMgPSB0aGlzLiNjYWNoZUdldCgndG9waWMnLCBwa3QucHJlcy50b3BpYyk7XG4gICAgICAgICAgICBpZiAodG9waWMpIHtcbiAgICAgICAgICAgICAgdG9waWMuX3JvdXRlUHJlcyhwa3QucHJlcyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFNlY29uZGFyeSBBUEkgLSBjYWxsYmFja1xuICAgICAgICAgICAgaWYgKHRoaXMub25QcmVzTWVzc2FnZSkge1xuICAgICAgICAgICAgICB0aGlzLm9uUHJlc01lc3NhZ2UocGt0LnByZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAocGt0LmluZm8pIHtcbiAgICAgICAgICAgIC8vIHtpbmZvfSBtZXNzYWdlIC0gcmVhZC9yZWNlaXZlZCBub3RpZmljYXRpb25zIGFuZCBrZXkgcHJlc3Nlc1xuICAgICAgICAgICAgLy8gUHJlZmVycmVkIEFQSTogUm91dGUge2luZm99fSB0byB0b3BpYywgaWYgb25lIGlzIHJlZ2lzdGVyZWRcbiAgICAgICAgICAgIGNvbnN0IHRvcGljID0gdGhpcy4jY2FjaGVHZXQoJ3RvcGljJywgcGt0LmluZm8udG9waWMpO1xuICAgICAgICAgICAgaWYgKHRvcGljKSB7XG4gICAgICAgICAgICAgIHRvcGljLl9yb3V0ZUluZm8ocGt0LmluZm8pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBTZWNvbmRhcnkgQVBJIC0gY2FsbGJhY2tcbiAgICAgICAgICAgIGlmICh0aGlzLm9uSW5mb01lc3NhZ2UpIHtcbiAgICAgICAgICAgICAgdGhpcy5vbkluZm9NZXNzYWdlKHBrdC5pbmZvKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIoXCJFUlJPUjogVW5rbm93biBwYWNrZXQgcmVjZWl2ZWQuXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgMCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gQ29ubmVjdGlvbiBvcGVuLCByZWFkeSB0byBzdGFydCBzZW5kaW5nLlxuICAjY29ubmVjdGlvbk9wZW4oKSB7XG4gICAgaWYgKCF0aGlzLl9leHBpcmVQcm9taXNlcykge1xuICAgICAgLy8gUmVqZWN0IHByb21pc2VzIHdoaWNoIGhhdmUgbm90IGJlZW4gcmVzb2x2ZWQgZm9yIHRvbyBsb25nLlxuICAgICAgdGhpcy5fZXhwaXJlUHJvbWlzZXMgPSBzZXRJbnRlcnZhbChfID0+IHtcbiAgICAgICAgY29uc3QgZXJyID0gbmV3IEVycm9yKFwiVGltZW91dCAoNTA0KVwiKTtcbiAgICAgICAgY29uc3QgZXhwaXJlcyA9IG5ldyBEYXRlKG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gQ29uc3QuRVhQSVJFX1BST01JU0VTX1RJTUVPVVQpO1xuICAgICAgICBmb3IgKGxldCBpZCBpbiB0aGlzLl9wZW5kaW5nUHJvbWlzZXMpIHtcbiAgICAgICAgICBsZXQgY2FsbGJhY2tzID0gdGhpcy5fcGVuZGluZ1Byb21pc2VzW2lkXTtcbiAgICAgICAgICBpZiAoY2FsbGJhY2tzICYmIGNhbGxiYWNrcy50cyA8IGV4cGlyZXMpIHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyKFwiUHJvbWlzZSBleHBpcmVkXCIsIGlkKTtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9wZW5kaW5nUHJvbWlzZXNbaWRdO1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrcy5yZWplY3QpIHtcbiAgICAgICAgICAgICAgY2FsbGJhY2tzLnJlamVjdChlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwgQ29uc3QuRVhQSVJFX1BST01JU0VTX1BFUklPRCk7XG4gICAgfVxuICAgIHRoaXMuaGVsbG8oKTtcbiAgfVxuXG4gICNkaXNjb25uZWN0ZWQoZXJyLCBjb2RlKSB7XG4gICAgdGhpcy5faW5QYWNrZXRDb3VudCA9IDA7XG4gICAgdGhpcy5fc2VydmVySW5mbyA9IG51bGw7XG4gICAgdGhpcy5fYXV0aGVudGljYXRlZCA9IGZhbHNlO1xuXG4gICAgaWYgKHRoaXMuX2V4cGlyZVByb21pc2VzKSB7XG4gICAgICBjbGVhckludGVydmFsKHRoaXMuX2V4cGlyZVByb21pc2VzKTtcbiAgICAgIHRoaXMuX2V4cGlyZVByb21pc2VzID0gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBNYXJrIGFsbCB0b3BpY3MgYXMgdW5zdWJzY3JpYmVkXG4gICAgdGhpcy4jY2FjaGVNYXAoJ3RvcGljJywgKHRvcGljLCBrZXkpID0+IHtcbiAgICAgIHRvcGljLl9yZXNldFN1YigpO1xuICAgIH0pO1xuXG4gICAgLy8gUmVqZWN0IGFsbCBwZW5kaW5nIHByb21pc2VzXG4gICAgZm9yIChsZXQga2V5IGluIHRoaXMuX3BlbmRpbmdQcm9taXNlcykge1xuICAgICAgY29uc3QgY2FsbGJhY2tzID0gdGhpcy5fcGVuZGluZ1Byb21pc2VzW2tleV07XG4gICAgICBpZiAoY2FsbGJhY2tzICYmIGNhbGxiYWNrcy5yZWplY3QpIHtcbiAgICAgICAgY2FsbGJhY2tzLnJlamVjdChlcnIpO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLl9wZW5kaW5nUHJvbWlzZXMgPSB7fTtcblxuICAgIGlmICh0aGlzLm9uRGlzY29ubmVjdCkge1xuICAgICAgdGhpcy5vbkRpc2Nvbm5lY3QoZXJyKTtcbiAgICB9XG4gIH1cblxuICAvLyBHZXQgVXNlciBBZ2VudCBzdHJpbmdcbiAgI2dldFVzZXJBZ2VudCgpIHtcbiAgICByZXR1cm4gdGhpcy5fYXBwTmFtZSArICcgKCcgKyAodGhpcy5fYnJvd3NlciA/IHRoaXMuX2Jyb3dzZXIgKyAnOyAnIDogJycpICsgdGhpcy5faHdvcyArICcpOyAnICsgQ29uc3QuTElCUkFSWTtcbiAgfVxuXG4gIC8vIEdlbmVyYXRvciBvZiBwYWNrZXRzIHN0dWJzXG4gICNpbml0UGFja2V0KHR5cGUsIHRvcGljKSB7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICBjYXNlICdoaSc6XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgJ2hpJzoge1xuICAgICAgICAgICAgJ2lkJzogdGhpcy5nZXROZXh0VW5pcXVlSWQoKSxcbiAgICAgICAgICAgICd2ZXInOiBDb25zdC5WRVJTSU9OLFxuICAgICAgICAgICAgJ3VhJzogdGhpcy4jZ2V0VXNlckFnZW50KCksXG4gICAgICAgICAgICAnZGV2JzogdGhpcy5fZGV2aWNlVG9rZW4sXG4gICAgICAgICAgICAnbGFuZyc6IHRoaXMuX2h1bWFuTGFuZ3VhZ2UsXG4gICAgICAgICAgICAncGxhdGYnOiB0aGlzLl9wbGF0Zm9ybVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgY2FzZSAnYWNjJzpcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAnYWNjJzoge1xuICAgICAgICAgICAgJ2lkJzogdGhpcy5nZXROZXh0VW5pcXVlSWQoKSxcbiAgICAgICAgICAgICd1c2VyJzogbnVsbCxcbiAgICAgICAgICAgICdzY2hlbWUnOiBudWxsLFxuICAgICAgICAgICAgJ3NlY3JldCc6IG51bGwsXG4gICAgICAgICAgICAnbG9naW4nOiBmYWxzZSxcbiAgICAgICAgICAgICd0YWdzJzogbnVsbCxcbiAgICAgICAgICAgICdkZXNjJzoge30sXG4gICAgICAgICAgICAnY3JlZCc6IHt9XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICBjYXNlICdsb2dpbic6XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgJ2xvZ2luJzoge1xuICAgICAgICAgICAgJ2lkJzogdGhpcy5nZXROZXh0VW5pcXVlSWQoKSxcbiAgICAgICAgICAgICdzY2hlbWUnOiBudWxsLFxuICAgICAgICAgICAgJ3NlY3JldCc6IG51bGxcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgIGNhc2UgJ3N1Yic6XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgJ3N1Yic6IHtcbiAgICAgICAgICAgICdpZCc6IHRoaXMuZ2V0TmV4dFVuaXF1ZUlkKCksXG4gICAgICAgICAgICAndG9waWMnOiB0b3BpYyxcbiAgICAgICAgICAgICdzZXQnOiB7fSxcbiAgICAgICAgICAgICdnZXQnOiB7fVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgY2FzZSAnbGVhdmUnOlxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICdsZWF2ZSc6IHtcbiAgICAgICAgICAgICdpZCc6IHRoaXMuZ2V0TmV4dFVuaXF1ZUlkKCksXG4gICAgICAgICAgICAndG9waWMnOiB0b3BpYyxcbiAgICAgICAgICAgICd1bnN1Yic6IGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICBjYXNlICdwdWInOlxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICdwdWInOiB7XG4gICAgICAgICAgICAnaWQnOiB0aGlzLmdldE5leHRVbmlxdWVJZCgpLFxuICAgICAgICAgICAgJ3RvcGljJzogdG9waWMsXG4gICAgICAgICAgICAnbm9lY2hvJzogZmFsc2UsXG4gICAgICAgICAgICAnaGVhZCc6IG51bGwsXG4gICAgICAgICAgICAnY29udGVudCc6IHt9XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICBjYXNlICdnZXQnOlxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICdnZXQnOiB7XG4gICAgICAgICAgICAnaWQnOiB0aGlzLmdldE5leHRVbmlxdWVJZCgpLFxuICAgICAgICAgICAgJ3RvcGljJzogdG9waWMsXG4gICAgICAgICAgICAnd2hhdCc6IG51bGwsXG4gICAgICAgICAgICAnZGVzYyc6IHt9LFxuICAgICAgICAgICAgJ3N1Yic6IHt9LFxuICAgICAgICAgICAgJ2RhdGEnOiB7fVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgY2FzZSAnc2V0JzpcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAnc2V0Jzoge1xuICAgICAgICAgICAgJ2lkJzogdGhpcy5nZXROZXh0VW5pcXVlSWQoKSxcbiAgICAgICAgICAgICd0b3BpYyc6IHRvcGljLFxuICAgICAgICAgICAgJ2Rlc2MnOiB7fSxcbiAgICAgICAgICAgICdzdWInOiB7fSxcbiAgICAgICAgICAgICd0YWdzJzogW10sXG4gICAgICAgICAgICAnZXBoZW1lcmFsJzoge31cbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgIGNhc2UgJ2RlbCc6XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgJ2RlbCc6IHtcbiAgICAgICAgICAgICdpZCc6IHRoaXMuZ2V0TmV4dFVuaXF1ZUlkKCksXG4gICAgICAgICAgICAndG9waWMnOiB0b3BpYyxcbiAgICAgICAgICAgICd3aGF0JzogbnVsbCxcbiAgICAgICAgICAgICdkZWxzZXEnOiBudWxsLFxuICAgICAgICAgICAgJ3VzZXInOiBudWxsLFxuICAgICAgICAgICAgJ2hhcmQnOiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgY2FzZSAnbm90ZSc6XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgJ25vdGUnOiB7XG4gICAgICAgICAgICAvLyBubyBpZCBieSBkZXNpZ24gKGV4Y2VwdCBjYWxscykuXG4gICAgICAgICAgICAndG9waWMnOiB0b3BpYyxcbiAgICAgICAgICAgICd3aGF0JzogbnVsbCwgLy8gb25lIG9mIFwicmVjdlwiLCBcInJlYWRcIiwgXCJrcFwiLCBcImNhbGxcIlxuICAgICAgICAgICAgJ3NlcSc6IHVuZGVmaW5lZCAvLyB0aGUgc2VydmVyLXNpZGUgbWVzc2FnZSBpZCBhY2tub3dsZWRnZWQgYXMgcmVjZWl2ZWQgb3IgcmVhZC5cbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5rbm93biBwYWNrZXQgdHlwZSByZXF1ZXN0ZWQ6ICR7dHlwZX1gKTtcbiAgICB9XG4gIH1cblxuICAvLyBDYWNoZSBtYW5hZ2VtZW50XG4gICNjYWNoZVB1dCh0eXBlLCBuYW1lLCBvYmopIHtcbiAgICB0aGlzLl9jYWNoZVt0eXBlICsgJzonICsgbmFtZV0gPSBvYmo7XG4gIH1cbiAgI2NhY2hlR2V0KHR5cGUsIG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5fY2FjaGVbdHlwZSArICc6JyArIG5hbWVdO1xuICB9XG4gICNjYWNoZURlbCh0eXBlLCBuYW1lKSB7XG4gICAgZGVsZXRlIHRoaXMuX2NhY2hlW3R5cGUgKyAnOicgKyBuYW1lXTtcbiAgfVxuXG4gIC8vIEVudW1lcmF0ZSBhbGwgaXRlbXMgaW4gY2FjaGUsIGNhbGwgZnVuYyBmb3IgZWFjaCBpdGVtLlxuICAvLyBFbnVtZXJhdGlvbiBzdG9wcyBpZiBmdW5jIHJldHVybnMgdHJ1ZS5cbiAgI2NhY2hlTWFwKHR5cGUsIGZ1bmMsIGNvbnRleHQpIHtcbiAgICBjb25zdCBrZXkgPSB0eXBlID8gdHlwZSArICc6JyA6IHVuZGVmaW5lZDtcbiAgICBmb3IgKGxldCBpZHggaW4gdGhpcy5fY2FjaGUpIHtcbiAgICAgIGlmICgha2V5IHx8IGlkeC5pbmRleE9mKGtleSkgPT0gMCkge1xuICAgICAgICBpZiAoZnVuYy5jYWxsKGNvbnRleHQsIHRoaXMuX2NhY2hlW2lkeF0sIGlkeCkpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIE1ha2UgbGltaXRlZCBjYWNoZSBtYW5hZ2VtZW50IGF2YWlsYWJsZSB0byB0b3BpYy5cbiAgLy8gQ2FjaGluZyB1c2VyLnB1YmxpYyBvbmx5LiBFdmVyeXRoaW5nIGVsc2UgaXMgcGVyLXRvcGljLlxuICAjYXR0YWNoQ2FjaGVUb1RvcGljKHRvcGljKSB7XG4gICAgdG9waWMuX3Rpbm9kZSA9IHRoaXM7XG5cbiAgICB0b3BpYy5fY2FjaGVHZXRVc2VyID0gKHVpZCkgPT4ge1xuICAgICAgY29uc3QgcHViID0gdGhpcy4jY2FjaGVHZXQoJ3VzZXInLCB1aWQpO1xuICAgICAgaWYgKHB1Yikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHVzZXI6IHVpZCxcbiAgICAgICAgICBwdWJsaWM6IG1lcmdlT2JqKHt9LCBwdWIpXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH07XG4gICAgdG9waWMuX2NhY2hlUHV0VXNlciA9ICh1aWQsIHVzZXIpID0+IHtcbiAgICAgIHRoaXMuI2NhY2hlUHV0KCd1c2VyJywgdWlkLCBtZXJnZU9iaih7fSwgdXNlci5wdWJsaWMpKTtcbiAgICB9O1xuICAgIHRvcGljLl9jYWNoZURlbFVzZXIgPSAodWlkKSA9PiB7XG4gICAgICB0aGlzLiNjYWNoZURlbCgndXNlcicsIHVpZCk7XG4gICAgfTtcbiAgICB0b3BpYy5fY2FjaGVQdXRTZWxmID0gXyA9PiB7XG4gICAgICB0aGlzLiNjYWNoZVB1dCgndG9waWMnLCB0b3BpYy5uYW1lLCB0b3BpYyk7XG4gICAgfTtcbiAgICB0b3BpYy5fY2FjaGVEZWxTZWxmID0gXyA9PiB7XG4gICAgICB0aGlzLiNjYWNoZURlbCgndG9waWMnLCB0b3BpYy5uYW1lKTtcbiAgICB9O1xuICB9XG5cbiAgLy8gT24gc3VjY2Vzc2Z1bCBsb2dpbiBzYXZlIHNlcnZlci1wcm92aWRlZCBkYXRhLlxuICAjbG9naW5TdWNjZXNzZnVsKGN0cmwpIHtcbiAgICBpZiAoIWN0cmwucGFyYW1zIHx8ICFjdHJsLnBhcmFtcy51c2VyKSB7XG4gICAgICByZXR1cm4gY3RybDtcbiAgICB9XG4gICAgLy8gVGhpcyBpcyBhIHJlc3BvbnNlIHRvIGEgc3VjY2Vzc2Z1bCBsb2dpbixcbiAgICAvLyBleHRyYWN0IFVJRCBhbmQgc2VjdXJpdHkgdG9rZW4sIHNhdmUgaXQgaW4gVGlub2RlIG1vZHVsZVxuICAgIHRoaXMuX215VUlEID0gY3RybC5wYXJhbXMudXNlcjtcbiAgICB0aGlzLl9hdXRoZW50aWNhdGVkID0gKGN0cmwgJiYgY3RybC5jb2RlID49IDIwMCAmJiBjdHJsLmNvZGUgPCAzMDApO1xuICAgIGlmIChjdHJsLnBhcmFtcyAmJiBjdHJsLnBhcmFtcy50b2tlbiAmJiBjdHJsLnBhcmFtcy5leHBpcmVzKSB7XG4gICAgICB0aGlzLl9hdXRoVG9rZW4gPSB7XG4gICAgICAgIHRva2VuOiBjdHJsLnBhcmFtcy50b2tlbixcbiAgICAgICAgZXhwaXJlczogY3RybC5wYXJhbXMuZXhwaXJlc1xuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fYXV0aFRva2VuID0gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vbkxvZ2luKSB7XG4gICAgICB0aGlzLm9uTG9naW4oY3RybC5jb2RlLCBjdHJsLnRleHQpO1xuICAgIH1cblxuICAgIHJldHVybiBjdHJsO1xuICB9XG5cbiAgLy8gU3RhdGljIG1ldGhvZHMuXG4gIC8qKlxuICAgKiBIZWxwZXIgbWV0aG9kIHRvIHBhY2thZ2UgYWNjb3VudCBjcmVkZW50aWFsLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZyB8IENyZWRlbnRpYWx9IG1ldGggLSB2YWxpZGF0aW9uIG1ldGhvZCBvciBvYmplY3Qgd2l0aCB2YWxpZGF0aW9uIGRhdGEuXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gdmFsIC0gdmFsaWRhdGlvbiB2YWx1ZSAoZS5nLiBlbWFpbCBvciBwaG9uZSBudW1iZXIpLlxuICAgKiBAcGFyYW0ge09iamVjdD19IHBhcmFtcyAtIHZhbGlkYXRpb24gcGFyYW1ldGVycy5cbiAgICogQHBhcmFtIHtzdHJpbmc9fSByZXNwIC0gdmFsaWRhdGlvbiByZXNwb25zZS5cbiAgICpcbiAgICogQHJldHVybnMge0FycmF5LjxDcmVkZW50aWFsPn0gYXJyYXkgd2l0aCBhIHNpbmdsZSBjcmVkZW50aWFsIG9yIDxjb2RlPm51bGw8L2NvZGU+IGlmIG5vIHZhbGlkIGNyZWRlbnRpYWxzIHdlcmUgZ2l2ZW4uXG4gICAqL1xuICBzdGF0aWMgY3JlZGVudGlhbChtZXRoLCB2YWwsIHBhcmFtcywgcmVzcCkge1xuICAgIGlmICh0eXBlb2YgbWV0aCA9PSAnb2JqZWN0Jykge1xuICAgICAgKHtcbiAgICAgICAgdmFsLFxuICAgICAgICBwYXJhbXMsXG4gICAgICAgIHJlc3AsXG4gICAgICAgIG1ldGhcbiAgICAgIH0gPSBtZXRoKTtcbiAgICB9XG4gICAgaWYgKG1ldGggJiYgKHZhbCB8fCByZXNwKSkge1xuICAgICAgcmV0dXJuIFt7XG4gICAgICAgICdtZXRoJzogbWV0aCxcbiAgICAgICAgJ3ZhbCc6IHZhbCxcbiAgICAgICAgJ3Jlc3AnOiByZXNwLFxuICAgICAgICAncGFyYW1zJzogcGFyYW1zXG4gICAgICB9XTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lIHRvcGljIHR5cGUgZnJvbSB0b3BpYydzIG5hbWU6IGdycCwgcDJwLCBtZSwgZm5kLCBzeXMuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gdGVzdC5cbiAgICogQHJldHVybnMge3N0cmluZ30gT25lIG9mIDxjb2RlPlwibWVcIjwvY29kZT4sIDxjb2RlPlwiZm5kXCI8L2NvZGU+LCA8Y29kZT5cInN5c1wiPC9jb2RlPiwgPGNvZGU+XCJncnBcIjwvY29kZT4sXG4gICAqICAgIDxjb2RlPlwicDJwXCI8L2NvZGU+IG9yIDxjb2RlPnVuZGVmaW5lZDwvY29kZT4uXG4gICAqL1xuICBzdGF0aWMgdG9waWNUeXBlKG5hbWUpIHtcbiAgICByZXR1cm4gVG9waWMudG9waWNUeXBlKG5hbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSBnaXZlbiB0b3BpYyBuYW1lIGlzIGEgbmFtZSBvZiBhICdtZScgdG9waWMuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gdGVzdC5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIHRoZSBuYW1lIGlzIGEgbmFtZSBvZiBhICdtZScgdG9waWMsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBzdGF0aWMgaXNNZVRvcGljTmFtZShuYW1lKSB7XG4gICAgcmV0dXJuIFRvcGljLmlzTWVUb3BpY05hbWUobmFtZSk7XG4gIH1cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSBnaXZlbiB0b3BpYyBuYW1lIGlzIGEgbmFtZSBvZiBhIGdyb3VwIHRvcGljLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIHRlc3QuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0aGUgbmFtZSBpcyBhIG5hbWUgb2YgYSBncm91cCB0b3BpYywgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIHN0YXRpYyBpc0dyb3VwVG9waWNOYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gVG9waWMuaXNHcm91cFRvcGljTmFtZShuYW1lKTtcbiAgfVxuICAvKipcbiAgICogQ2hlY2sgaWYgdGhlIGdpdmVuIHRvcGljIG5hbWUgaXMgYSBuYW1lIG9mIGEgcDJwIHRvcGljLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIHRlc3QuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0aGUgbmFtZSBpcyBhIG5hbWUgb2YgYSBwMnAgdG9waWMsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBzdGF0aWMgaXNQMlBUb3BpY05hbWUobmFtZSkge1xuICAgIHJldHVybiBUb3BpYy5pc1AyUFRvcGljTmFtZShuYW1lKTtcbiAgfVxuICAvKipcbiAgICogQ2hlY2sgaWYgdGhlIGdpdmVuIHRvcGljIG5hbWUgaXMgYSBuYW1lIG9mIGEgY29tbXVuaWNhdGlvbiB0b3BpYywgaS5lLiBQMlAgb3IgZ3JvdXAuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gdGVzdC5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIHRoZSBuYW1lIGlzIGEgbmFtZSBvZiBhIHAycCBvciBncm91cCB0b3BpYywgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIHN0YXRpYyBpc0NvbW1Ub3BpY05hbWUobmFtZSkge1xuICAgIHJldHVybiBUb3BpYy5pc0NvbW1Ub3BpY05hbWUobmFtZSk7XG4gIH1cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSB0b3BpYyBuYW1lIGlzIGEgbmFtZSBvZiBhIG5ldyB0b3BpYy5cbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSB0b3BpYyBuYW1lIHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgdGhlIG5hbWUgaXMgYSBuYW1lIG9mIGEgbmV3IHRvcGljLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgc3RhdGljIGlzTmV3R3JvdXBUb3BpY05hbWUobmFtZSkge1xuICAgIHJldHVybiBUb3BpYy5pc05ld0dyb3VwVG9waWNOYW1lKG5hbWUpO1xuICB9XG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgdG9waWMgbmFtZSBpcyBhIG5hbWUgb2YgYSBjaGFubmVsLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIHRvcGljIG5hbWUgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIHtib29sZWFufSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0aGUgbmFtZSBpcyBhIG5hbWUgb2YgYSBjaGFubmVsLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgc3RhdGljIGlzQ2hhbm5lbFRvcGljTmFtZShuYW1lKSB7XG4gICAgcmV0dXJuIFRvcGljLmlzQ2hhbm5lbFRvcGljTmFtZShuYW1lKTtcbiAgfVxuICAvKipcbiAgICogR2V0IGluZm9ybWF0aW9uIGFib3V0IHRoZSBjdXJyZW50IHZlcnNpb24gb2YgdGhpcyBUaW5vZGUgY2xpZW50IGxpYnJhcnkuXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IHNlbWFudGljIHZlcnNpb24gb2YgdGhlIGxpYnJhcnksIGUuZy4gPGNvZGU+XCIwLjE1LjUtcmMxXCI8L2NvZGU+LlxuICAgKi9cbiAgc3RhdGljIGdldFZlcnNpb24oKSB7XG4gICAgcmV0dXJuIENvbnN0LlZFUlNJT047XG4gIH1cbiAgLyoqXG4gICAqIFRvIHVzZSBUaW5vZGUgaW4gYSBub24gYnJvd3NlciBjb250ZXh0LCBzdXBwbHkgV2ViU29ja2V0IGFuZCBYTUxIdHRwUmVxdWVzdCBwcm92aWRlcnMuXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHdzUHJvdmlkZXIgPGNvZGU+V2ViU29ja2V0PC9jb2RlPiBwcm92aWRlciwgZS5nLiBmb3Igbm9kZUpTICwgPGNvZGU+cmVxdWlyZSgnd3MnKTwvY29kZT4uXG4gICAqIEBwYXJhbSB4aHJQcm92aWRlciA8Y29kZT5YTUxIdHRwUmVxdWVzdDwvY29kZT4gcHJvdmlkZXIsIGUuZy4gZm9yIG5vZGUgPGNvZGU+cmVxdWlyZSgneGhyJyk8L2NvZGU+LlxuICAgKi9cbiAgc3RhdGljIHNldE5ldHdvcmtQcm92aWRlcnMod3NQcm92aWRlciwgeGhyUHJvdmlkZXIpIHtcbiAgICBXZWJTb2NrZXRQcm92aWRlciA9IHdzUHJvdmlkZXI7XG4gICAgWEhSUHJvdmlkZXIgPSB4aHJQcm92aWRlcjtcblxuICAgIENvbm5lY3Rpb24uc2V0TmV0d29ya1Byb3ZpZGVycyhXZWJTb2NrZXRQcm92aWRlciwgWEhSUHJvdmlkZXIpO1xuICAgIExhcmdlRmlsZUhlbHBlci5zZXROZXR3b3JrUHJvdmlkZXIoWEhSUHJvdmlkZXIpO1xuICB9XG4gIC8qKlxuICAgKiBUbyB1c2UgVGlub2RlIGluIGEgbm9uIGJyb3dzZXIgY29udGV4dCwgc3VwcGx5IDxjb2RlPmluZGV4ZWREQjwvY29kZT4gcHJvdmlkZXIuXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIGlkYlByb3ZpZGVyIDxjb2RlPmluZGV4ZWREQjwvY29kZT4gcHJvdmlkZXIsIGUuZy4gZm9yIG5vZGVKUyAsIDxjb2RlPnJlcXVpcmUoJ2Zha2UtaW5kZXhlZGRiJyk8L2NvZGU+LlxuICAgKi9cbiAgc3RhdGljIHNldERhdGFiYXNlUHJvdmlkZXIoaWRiUHJvdmlkZXIpIHtcbiAgICBJbmRleGVkREJQcm92aWRlciA9IGlkYlByb3ZpZGVyO1xuXG4gICAgREJDYWNoZS5zZXREYXRhYmFzZVByb3ZpZGVyKEluZGV4ZWREQlByb3ZpZGVyKTtcbiAgfVxuICAvKipcbiAgICogUmV0dXJuIGluZm9ybWF0aW9uIGFib3V0IHRoZSBjdXJyZW50IG5hbWUgYW5kIHZlcnNpb24gb2YgdGhpcyBUaW5vZGUgbGlicmFyeS5cbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSB0aGUgbmFtZSBvZiB0aGUgbGlicmFyeSBhbmQgaXQncyB2ZXJzaW9uLlxuICAgKi9cbiAgc3RhdGljIGdldExpYnJhcnkoKSB7XG4gICAgcmV0dXJuIENvbnN0LkxJQlJBUlk7XG4gIH1cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSBnaXZlbiBzdHJpbmcgcmVwcmVzZW50cyA8Y29kZT5OVUxMPC9jb2RlPiB2YWx1ZSBhcyBkZWZpbmVkIGJ5IFRpbm9kZSAoPGNvZGU+J1xcdTI0MjEnPC9jb2RlPikuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHIgLSBzdHJpbmcgdG8gY2hlY2sgZm9yIDxjb2RlPk5VTEw8L2NvZGU+IHZhbHVlLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgc3RyaW5nIHJlcHJlc2VudHMgPGNvZGU+TlVMTDwvY29kZT4gdmFsdWUsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBzdGF0aWMgaXNOdWxsVmFsdWUoc3RyKSB7XG4gICAgcmV0dXJuIHN0ciA9PT0gQ29uc3QuREVMX0NIQVI7XG4gIH1cblxuICAvLyBJbnN0YW5jZSBtZXRob2RzLlxuXG4gIC8vIEdlbmVyYXRlcyB1bmlxdWUgbWVzc2FnZSBJRHNcbiAgZ2V0TmV4dFVuaXF1ZUlkKCkge1xuICAgIHJldHVybiAodGhpcy5fbWVzc2FnZUlkICE9IDApID8gJycgKyB0aGlzLl9tZXNzYWdlSWQrKyA6IHVuZGVmaW5lZDtcbiAgfTtcblxuICAvKipcbiAgICogQ29ubmVjdCB0byB0aGUgc2VydmVyLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gaG9zdF8gLSBuYW1lIG9mIHRoZSBob3N0IHRvIGNvbm5lY3QgdG8uXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IFByb21pc2UgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgY29ubmVjdGlvbiBjYWxsIGNvbXBsZXRlczpcbiAgICogICAgPGNvZGU+cmVzb2x2ZSgpPC9jb2RlPiBpcyBjYWxsZWQgd2l0aG91dCBwYXJhbWV0ZXJzLCA8Y29kZT5yZWplY3QoKTwvY29kZT4gcmVjZWl2ZXMgdGhlXG4gICAqICAgIDxjb2RlPkVycm9yPC9jb2RlPiBhcyBhIHNpbmdsZSBwYXJhbWV0ZXIuXG4gICAqL1xuICBjb25uZWN0KGhvc3RfKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Nvbm5lY3Rpb24uY29ubmVjdChob3N0Xyk7XG4gIH1cblxuICAvKipcbiAgICogQXR0ZW1wdCB0byByZWNvbm5lY3QgdG8gdGhlIHNlcnZlciBpbW1lZGlhdGVseS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGZvcmNlIC0gcmVjb25uZWN0IGV2ZW4gaWYgdGhlcmUgaXMgYSBjb25uZWN0aW9uIGFscmVhZHkuXG4gICAqL1xuICByZWNvbm5lY3QoZm9yY2UpIHtcbiAgICB0aGlzLl9jb25uZWN0aW9uLnJlY29ubmVjdChmb3JjZSk7XG4gIH1cblxuICAvKipcbiAgICogRGlzY29ubmVjdCBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAqL1xuICBkaXNjb25uZWN0KCkge1xuICAgIHRoaXMuX2Nvbm5lY3Rpb24uZGlzY29ubmVjdCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIENsZWFyIHBlcnNpc3RlbnQgY2FjaGU6IHJlbW92ZSBJbmRleGVkREIuXG4gICAqXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IFByb21pc2UgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgb3BlcmF0aW9uIGlzIGNvbXBsZXRlZC5cbiAgICovXG4gIGNsZWFyU3RvcmFnZSgpIHtcbiAgICBpZiAodGhpcy5fZGIuaXNSZWFkeSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5fZGIuZGVsZXRlRGF0YWJhc2UoKTtcbiAgICB9XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgcGVyc2lzdGVudCBjYWNoZTogY3JlYXRlIEluZGV4ZWREQiBjYWNoZS5cbiAgICpcbiAgICogQHJldHVybiB7UHJvbWlzZX0gUHJvbWlzZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBvcGVyYXRpb24gaXMgY29tcGxldGVkLlxuICAgKi9cbiAgaW5pdFN0b3JhZ2UoKSB7XG4gICAgaWYgKCF0aGlzLl9kYi5pc1JlYWR5KCkpIHtcbiAgICAgIHJldHVybiB0aGlzLl9kYi5pbml0RGF0YWJhc2UoKTtcbiAgICB9XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgYSBuZXR3b3JrIHByb2JlIG1lc3NhZ2UgdG8gbWFrZSBzdXJlIHRoZSBjb25uZWN0aW9uIGlzIGFsaXZlLlxuICAgKi9cbiAgbmV0d29ya1Byb2JlKCkge1xuICAgIHRoaXMuX2Nvbm5lY3Rpb24ucHJvYmUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBmb3IgbGl2ZSBjb25uZWN0aW9uIHRvIHNlcnZlci5cbiAgICpcbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIHRoZXJlIGlzIGEgbGl2ZSBjb25uZWN0aW9uLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgaXNDb25uZWN0ZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Nvbm5lY3Rpb24uaXNDb25uZWN0ZWQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBjb25uZWN0aW9uIGlzIGF1dGhlbnRpY2F0ZWQgKGxhc3QgbG9naW4gd2FzIHN1Y2Nlc3NmdWwpLlxuICAgKlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgYXV0aGVudGljYXRlZCwgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIGlzQXV0aGVudGljYXRlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fYXV0aGVudGljYXRlZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgQVBJIGtleSBhbmQgYXV0aCB0b2tlbiB0byB0aGUgcmVsYXRpdmUgVVJMIG1ha2luZyBpdCB1c2FibGUgZm9yIGdldHRpbmcgZGF0YVxuICAgKiBmcm9tIHRoZSBzZXJ2ZXIgaW4gYSBzaW1wbGUgPGNvZGU+SFRUUCBHRVQ8L2NvZGU+IHJlcXVlc3QuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBVUkwgLSBVUkwgdG8gd3JhcC5cbiAgICogQHJldHVybnMge3N0cmluZ30gVVJMIHdpdGggYXBwZW5kZWQgQVBJIGtleSBhbmQgdG9rZW4sIGlmIHZhbGlkIHRva2VuIGlzIHByZXNlbnQuXG4gICAqL1xuICBhdXRob3JpemVVUkwodXJsKSB7XG4gICAgaWYgKHR5cGVvZiB1cmwgIT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiB1cmw7XG4gICAgfVxuXG4gICAgaWYgKGlzVXJsUmVsYXRpdmUodXJsKSkge1xuICAgICAgLy8gRmFrZSBiYXNlIHRvIG1ha2UgdGhlIHJlbGF0aXZlIFVSTCBwYXJzZWFibGUuXG4gICAgICBjb25zdCBiYXNlID0gJ3NjaGVtZTovL2hvc3QvJztcbiAgICAgIGNvbnN0IHBhcnNlZCA9IG5ldyBVUkwodXJsLCBiYXNlKTtcbiAgICAgIGlmICh0aGlzLl9hcGlLZXkpIHtcbiAgICAgICAgcGFyc2VkLnNlYXJjaFBhcmFtcy5hcHBlbmQoJ2FwaWtleScsIHRoaXMuX2FwaUtleSk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5fYXV0aFRva2VuICYmIHRoaXMuX2F1dGhUb2tlbi50b2tlbikge1xuICAgICAgICBwYXJzZWQuc2VhcmNoUGFyYW1zLmFwcGVuZCgnYXV0aCcsICd0b2tlbicpO1xuICAgICAgICBwYXJzZWQuc2VhcmNoUGFyYW1zLmFwcGVuZCgnc2VjcmV0JywgdGhpcy5fYXV0aFRva2VuLnRva2VuKTtcbiAgICAgIH1cbiAgICAgIC8vIENvbnZlcnQgYmFjayB0byBzdHJpbmcgYW5kIHN0cmlwIGZha2UgYmFzZSBVUkwgZXhjZXB0IGZvciB0aGUgcm9vdCBzbGFzaC5cbiAgICAgIHVybCA9IHBhcnNlZC50b1N0cmluZygpLnN1YnN0cmluZyhiYXNlLmxlbmd0aCAtIDEpO1xuICAgIH1cbiAgICByZXR1cm4gdXJsO1xuICB9XG5cbiAgLyoqXG4gICAqIEB0eXBlZGVmIEFjY291bnRQYXJhbXNcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHByb3BlcnR5IHtEZWZBY3M9fSBkZWZhY3MgLSBEZWZhdWx0IGFjY2VzcyBwYXJhbWV0ZXJzIGZvciB1c2VyJ3MgPGNvZGU+bWU8L2NvZGU+IHRvcGljLlxuICAgKiBAcHJvcGVydHkge09iamVjdD19IHB1YmxpYyAtIFB1YmxpYyBhcHBsaWNhdGlvbi1kZWZpbmVkIGRhdGEgZXhwb3NlZCBvbiA8Y29kZT5tZTwvY29kZT4gdG9waWMuXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0PX0gcHJpdmF0ZSAtIFByaXZhdGUgYXBwbGljYXRpb24tZGVmaW5lZCBkYXRhIGFjY2Vzc2libGUgb24gPGNvZGU+bWU8L2NvZGU+IHRvcGljLlxuICAgKiBAcHJvcGVydHkge09iamVjdD19IHRydXN0ZWQgLSBUcnVzdGVkIHVzZXIgZGF0YSB3aGljaCBjYW4gYmUgc2V0IGJ5IGEgcm9vdCB1c2VyIG9ubHkuXG4gICAqIEBwcm9wZXJ0eSB7QXJyYXkuPHN0cmluZz59IHRhZ3MgLSBhcnJheSBvZiBzdHJpbmcgdGFncyBmb3IgdXNlciBkaXNjb3ZlcnkuXG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nPX0gdG9rZW4gLSBhdXRoZW50aWNhdGlvbiB0b2tlbiB0byB1c2UuXG4gICAqIEBwcm9wZXJ0eSB7QXJyYXkuPHN0cmluZz49fSBhdHRhY2htZW50cyAtIEFycmF5IG9mIHJlZmVyZW5jZXMgdG8gb3V0IG9mIGJhbmQgYXR0YWNobWVudHMgdXNlZCBpbiBhY2NvdW50IGRlc2NyaXB0aW9uLlxuICAgKi9cbiAgLyoqXG4gICAqIEB0eXBlZGVmIERlZkFjc1xuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAcHJvcGVydHkge3N0cmluZz19IGF1dGggLSBBY2Nlc3MgbW9kZSBmb3IgPGNvZGU+bWU8L2NvZGU+IGZvciBhdXRoZW50aWNhdGVkIHVzZXJzLlxuICAgKiBAcHJvcGVydHkge3N0cmluZz19IGFub24gLSBBY2Nlc3MgbW9kZSBmb3IgPGNvZGU+bWU8L2NvZGU+IGZvciBhbm9ueW1vdXMgdXNlcnMuXG4gICAqL1xuXG4gIC8qKlxuICAgKiBDcmVhdGUgb3IgdXBkYXRlIGFuIGFjY291bnQuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1aWQgLSBVc2VyIGlkIHRvIHVwZGF0ZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2NoZW1lIC0gQXV0aGVudGljYXRpb24gc2NoZW1lOyA8Y29kZT5cImJhc2ljXCI8L2NvZGU+IGFuZCA8Y29kZT5cImFub255bW91c1wiPC9jb2RlPiBhcmUgdGhlIGN1cnJlbnRseSBzdXBwb3J0ZWQgc2NoZW1lcy5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHNlY3JldCAtIEF1dGhlbnRpY2F0aW9uIHNlY3JldCwgYXNzdW1lZCB0byBiZSBhbHJlYWR5IGJhc2U2NCBlbmNvZGVkLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBsb2dpbiAtIFVzZSBuZXcgYWNjb3VudCB0byBhdXRoZW50aWNhdGUgY3VycmVudCBzZXNzaW9uXG4gICAqIEBwYXJhbSB7QWNjb3VudFBhcmFtcz19IHBhcmFtcyAtIFVzZXIgZGF0YSB0byBwYXNzIHRvIHRoZSBzZXJ2ZXIuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiBzZXJ2ZXIgcmVwbHkgaXMgcmVjZWl2ZWQuXG4gICAqL1xuICBhY2NvdW50KHVpZCwgc2NoZW1lLCBzZWNyZXQsIGxvZ2luLCBwYXJhbXMpIHtcbiAgICBjb25zdCBwa3QgPSB0aGlzLiNpbml0UGFja2V0KCdhY2MnKTtcbiAgICBwa3QuYWNjLnVzZXIgPSB1aWQ7XG4gICAgcGt0LmFjYy5zY2hlbWUgPSBzY2hlbWU7XG4gICAgcGt0LmFjYy5zZWNyZXQgPSBzZWNyZXQ7XG4gICAgLy8gTG9nIGluIHRvIHRoZSBuZXcgYWNjb3VudCB1c2luZyBzZWxlY3RlZCBzY2hlbWVcbiAgICBwa3QuYWNjLmxvZ2luID0gbG9naW47XG5cbiAgICBpZiAocGFyYW1zKSB7XG4gICAgICBwa3QuYWNjLmRlc2MuZGVmYWNzID0gcGFyYW1zLmRlZmFjcztcbiAgICAgIHBrdC5hY2MuZGVzYy5wdWJsaWMgPSBwYXJhbXMucHVibGljO1xuICAgICAgcGt0LmFjYy5kZXNjLnByaXZhdGUgPSBwYXJhbXMucHJpdmF0ZTtcbiAgICAgIHBrdC5hY2MuZGVzYy50cnVzdGVkID0gcGFyYW1zLnRydXN0ZWQ7XG5cbiAgICAgIHBrdC5hY2MudGFncyA9IHBhcmFtcy50YWdzO1xuICAgICAgcGt0LmFjYy5jcmVkID0gcGFyYW1zLmNyZWQ7XG5cbiAgICAgIHBrdC5hY2MudG9rZW4gPSBwYXJhbXMudG9rZW47XG5cbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHBhcmFtcy5hdHRhY2htZW50cykgJiYgcGFyYW1zLmF0dGFjaG1lbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcGt0LmV4dHJhID0ge1xuICAgICAgICAgIGF0dGFjaG1lbnRzOiBwYXJhbXMuYXR0YWNobWVudHMuZmlsdGVyKHJlZiA9PiBpc1VybFJlbGF0aXZlKHJlZikpXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuI3NlbmQocGt0LCBwa3QuYWNjLmlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBuZXcgdXNlci4gV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNhY2NvdW50fS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNjaGVtZSAtIEF1dGhlbnRpY2F0aW9uIHNjaGVtZTsgPGNvZGU+XCJiYXNpY1wiPC9jb2RlPiBpcyB0aGUgb25seSBjdXJyZW50bHkgc3VwcG9ydGVkIHNjaGVtZS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHNlY3JldCAtIEF1dGhlbnRpY2F0aW9uLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBsb2dpbiAtIFVzZSBuZXcgYWNjb3VudCB0byBhdXRoZW50aWNhdGUgY3VycmVudCBzZXNzaW9uXG4gICAqIEBwYXJhbSB7QWNjb3VudFBhcmFtcz19IHBhcmFtcyAtIFVzZXIgZGF0YSB0byBwYXNzIHRvIHRoZSBzZXJ2ZXIuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiBzZXJ2ZXIgcmVwbHkgaXMgcmVjZWl2ZWQuXG4gICAqL1xuICBjcmVhdGVBY2NvdW50KHNjaGVtZSwgc2VjcmV0LCBsb2dpbiwgcGFyYW1zKSB7XG4gICAgbGV0IHByb21pc2UgPSB0aGlzLmFjY291bnQoQ29uc3QuVVNFUl9ORVcsIHNjaGVtZSwgc2VjcmV0LCBsb2dpbiwgcGFyYW1zKTtcbiAgICBpZiAobG9naW4pIHtcbiAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oY3RybCA9PiB0aGlzLiNsb2dpblN1Y2Nlc3NmdWwoY3RybCkpO1xuICAgIH1cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgdXNlciB3aXRoIDxjb2RlPidiYXNpYyc8L2NvZGU+IGF1dGhlbnRpY2F0aW9uIHNjaGVtZSBhbmQgaW1tZWRpYXRlbHlcbiAgICogdXNlIGl0IGZvciBhdXRoZW50aWNhdGlvbi4gV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNhY2NvdW50fS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVzZXJuYW1lIC0gTG9naW4gdG8gdXNlIGZvciB0aGUgbmV3IGFjY291bnQuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXNzd29yZCAtIFVzZXIncyBwYXNzd29yZC5cbiAgICogQHBhcmFtIHtBY2NvdW50UGFyYW1zPX0gcGFyYW1zIC0gVXNlciBkYXRhIHRvIHBhc3MgdG8gdGhlIHNlcnZlci5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHNlcnZlciByZXBseSBpcyByZWNlaXZlZC5cbiAgICovXG4gIGNyZWF0ZUFjY291bnRCYXNpYyh1c2VybmFtZSwgcGFzc3dvcmQsIHBhcmFtcykge1xuICAgIC8vIE1ha2Ugc3VyZSB3ZSBhcmUgbm90IHVzaW5nICdudWxsJyBvciAndW5kZWZpbmVkJztcbiAgICB1c2VybmFtZSA9IHVzZXJuYW1lIHx8ICcnO1xuICAgIHBhc3N3b3JkID0gcGFzc3dvcmQgfHwgJyc7XG4gICAgcmV0dXJuIHRoaXMuY3JlYXRlQWNjb3VudCgnYmFzaWMnLFxuICAgICAgYjY0RW5jb2RlVW5pY29kZSh1c2VybmFtZSArICc6JyArIHBhc3N3b3JkKSwgdHJ1ZSwgcGFyYW1zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgdXNlcidzIGNyZWRlbnRpYWxzIGZvciA8Y29kZT4nYmFzaWMnPC9jb2RlPiBhdXRoZW50aWNhdGlvbiBzY2hlbWUuIFdyYXBwZXIgZm9yIHtAbGluayBUaW5vZGUjYWNjb3VudH0uXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1aWQgLSBVc2VyIElEIHRvIHVwZGF0ZS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHVzZXJuYW1lIC0gTG9naW4gdG8gdXNlIGZvciB0aGUgbmV3IGFjY291bnQuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXNzd29yZCAtIFVzZXIncyBwYXNzd29yZC5cbiAgICogQHBhcmFtIHtBY2NvdW50UGFyYW1zPX0gcGFyYW1zIC0gZGF0YSB0byBwYXNzIHRvIHRoZSBzZXJ2ZXIuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiBzZXJ2ZXIgcmVwbHkgaXMgcmVjZWl2ZWQuXG4gICAqL1xuICB1cGRhdGVBY2NvdW50QmFzaWModWlkLCB1c2VybmFtZSwgcGFzc3dvcmQsIHBhcmFtcykge1xuICAgIC8vIE1ha2Ugc3VyZSB3ZSBhcmUgbm90IHVzaW5nICdudWxsJyBvciAndW5kZWZpbmVkJztcbiAgICB1c2VybmFtZSA9IHVzZXJuYW1lIHx8ICcnO1xuICAgIHBhc3N3b3JkID0gcGFzc3dvcmQgfHwgJyc7XG4gICAgcmV0dXJuIHRoaXMuYWNjb3VudCh1aWQsICdiYXNpYycsXG4gICAgICBiNjRFbmNvZGVVbmljb2RlKHVzZXJuYW1lICsgJzonICsgcGFzc3dvcmQpLCBmYWxzZSwgcGFyYW1zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kIGhhbmRzaGFrZSB0byB0aGUgc2VydmVyLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gc2VydmVyIHJlcGx5IGlzIHJlY2VpdmVkLlxuICAgKi9cbiAgaGVsbG8oKSB7XG4gICAgY29uc3QgcGt0ID0gdGhpcy4jaW5pdFBhY2tldCgnaGknKTtcblxuICAgIHJldHVybiB0aGlzLiNzZW5kKHBrdCwgcGt0LmhpLmlkKVxuICAgICAgLnRoZW4oY3RybCA9PiB7XG4gICAgICAgIC8vIFJlc2V0IGJhY2tvZmYgY291bnRlciBvbiBzdWNjZXNzZnVsIGNvbm5lY3Rpb24uXG4gICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uYmFja29mZlJlc2V0KCk7XG5cbiAgICAgICAgLy8gU2VydmVyIHJlc3BvbnNlIGNvbnRhaW5zIHNlcnZlciBwcm90b2NvbCB2ZXJzaW9uLCBidWlsZCwgY29uc3RyYWludHMsXG4gICAgICAgIC8vIHNlc3Npb24gSUQgZm9yIGxvbmcgcG9sbGluZy4gU2F2ZSB0aGVtLlxuICAgICAgICBpZiAoY3RybC5wYXJhbXMpIHtcbiAgICAgICAgICB0aGlzLl9zZXJ2ZXJJbmZvID0gY3RybC5wYXJhbXM7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5vbkNvbm5lY3QpIHtcbiAgICAgICAgICB0aGlzLm9uQ29ubmVjdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGN0cmw7XG4gICAgICB9KS5jYXRjaChlcnIgPT4ge1xuICAgICAgICB0aGlzLl9jb25uZWN0aW9uLnJlY29ubmVjdCh0cnVlKTtcblxuICAgICAgICBpZiAodGhpcy5vbkRpc2Nvbm5lY3QpIHtcbiAgICAgICAgICB0aGlzLm9uRGlzY29ubmVjdChlcnIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgb3IgcmVmcmVzaCB0aGUgcHVzaCBub3RpZmljYXRpb25zL2RldmljZSB0b2tlbi4gSWYgdGhlIGNsaWVudCBpcyBjb25uZWN0ZWQsXG4gICAqIHRoZSBkZXZpY2VUb2tlbiBjYW4gYmUgc2VudCB0byB0aGUgc2VydmVyLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZHQgLSB0b2tlbiBvYnRhaW5lZCBmcm9tIHRoZSBwcm92aWRlciBvciA8Y29kZT5mYWxzZTwvY29kZT4sXG4gICAqICAgIDxjb2RlPm51bGw8L2NvZGU+IG9yIDxjb2RlPnVuZGVmaW5lZDwvY29kZT4gdG8gY2xlYXIgdGhlIHRva2VuLlxuICAgKlxuICAgKiBAcmV0dXJucyA8Y29kZT50cnVlPC9jb2RlPiBpZiBhdHRlbXB0IHdhcyBtYWRlIHRvIHNlbmQgdGhlIHVwZGF0ZSB0byB0aGUgc2VydmVyLlxuICAgKi9cbiAgc2V0RGV2aWNlVG9rZW4oZHQpIHtcbiAgICBsZXQgc2VudCA9IGZhbHNlO1xuICAgIC8vIENvbnZlcnQgYW55IGZhbHNpc2ggdmFsdWUgdG8gbnVsbC5cbiAgICBkdCA9IGR0IHx8IG51bGw7XG4gICAgaWYgKGR0ICE9IHRoaXMuX2RldmljZVRva2VuKSB7XG4gICAgICB0aGlzLl9kZXZpY2VUb2tlbiA9IGR0O1xuICAgICAgaWYgKHRoaXMuaXNDb25uZWN0ZWQoKSAmJiB0aGlzLmlzQXV0aGVudGljYXRlZCgpKSB7XG4gICAgICAgIHRoaXMuI3NlbmQoe1xuICAgICAgICAgICdoaSc6IHtcbiAgICAgICAgICAgICdkZXYnOiBkdCB8fCBUaW5vZGUuREVMX0NIQVJcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBzZW50ID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHNlbnQ7XG4gIH1cblxuICAvKipcbiAgICogQHR5cGVkZWYgQ3JlZGVudGlhbFxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAcHJvcGVydHkge3N0cmluZ30gbWV0aCAtIHZhbGlkYXRpb24gbWV0aG9kLlxuICAgKiBAcHJvcGVydHkge3N0cmluZ30gdmFsIC0gdmFsdWUgdG8gdmFsaWRhdGUgKGUuZy4gZW1haWwgb3IgcGhvbmUgbnVtYmVyKS5cbiAgICogQHByb3BlcnR5IHtzdHJpbmd9IHJlc3AgLSB2YWxpZGF0aW9uIHJlc3BvbnNlLlxuICAgKiBAcHJvcGVydHkge09iamVjdH0gcGFyYW1zIC0gdmFsaWRhdGlvbiBwYXJhbWV0ZXJzLlxuICAgKi9cbiAgLyoqXG4gICAqIEF1dGhlbnRpY2F0ZSBjdXJyZW50IHNlc3Npb24uXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzY2hlbWUgLSBBdXRoZW50aWNhdGlvbiBzY2hlbWU7IDxjb2RlPlwiYmFzaWNcIjwvY29kZT4gaXMgdGhlIG9ubHkgY3VycmVudGx5IHN1cHBvcnRlZCBzY2hlbWUuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzZWNyZXQgLSBBdXRoZW50aWNhdGlvbiBzZWNyZXQsIGFzc3VtZWQgdG8gYmUgYWxyZWFkeSBiYXNlNjQgZW5jb2RlZC5cbiAgICogQHBhcmFtIHtDcmVkZW50aWFsPX0gY3JlZCAtIGNyZWRlbnRpYWwgY29uZmlybWF0aW9uLCBpZiByZXF1aXJlZC5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHNlcnZlciByZXBseSBpcyByZWNlaXZlZC5cbiAgICovXG4gIGxvZ2luKHNjaGVtZSwgc2VjcmV0LCBjcmVkKSB7XG4gICAgY29uc3QgcGt0ID0gdGhpcy4jaW5pdFBhY2tldCgnbG9naW4nKTtcbiAgICBwa3QubG9naW4uc2NoZW1lID0gc2NoZW1lO1xuICAgIHBrdC5sb2dpbi5zZWNyZXQgPSBzZWNyZXQ7XG4gICAgcGt0LmxvZ2luLmNyZWQgPSBjcmVkO1xuXG4gICAgcmV0dXJuIHRoaXMuI3NlbmQocGt0LCBwa3QubG9naW4uaWQpXG4gICAgICAudGhlbihjdHJsID0+IHRoaXMuI2xvZ2luU3VjY2Vzc2Z1bChjdHJsKSk7XG4gIH1cblxuICAvKipcbiAgICogV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNsb2dpbn0gd2l0aCBiYXNpYyBhdXRoZW50aWNhdGlvblxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdW5hbWUgLSBVc2VyIG5hbWUuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXNzd29yZCAgLSBQYXNzd29yZC5cbiAgICogQHBhcmFtIHtDcmVkZW50aWFsPX0gY3JlZCAtIGNyZWRlbnRpYWwgY29uZmlybWF0aW9uLCBpZiByZXF1aXJlZC5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCBvbiByZWNlaXZpbmcgc2VydmVyIHJlcGx5LlxuICAgKi9cbiAgbG9naW5CYXNpYyh1bmFtZSwgcGFzc3dvcmQsIGNyZWQpIHtcbiAgICByZXR1cm4gdGhpcy5sb2dpbignYmFzaWMnLCBiNjRFbmNvZGVVbmljb2RlKHVuYW1lICsgJzonICsgcGFzc3dvcmQpLCBjcmVkKVxuICAgICAgLnRoZW4oY3RybCA9PiB7XG4gICAgICAgIHRoaXMuX2xvZ2luID0gdW5hbWU7XG4gICAgICAgIHJldHVybiBjdHJsO1xuICAgICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNsb2dpbn0gd2l0aCB0b2tlbiBhdXRoZW50aWNhdGlvblxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9rZW4gLSBUb2tlbiByZWNlaXZlZCBpbiByZXNwb25zZSB0byBlYXJsaWVyIGxvZ2luLlxuICAgKiBAcGFyYW0ge0NyZWRlbnRpYWw9fSBjcmVkIC0gY3JlZGVudGlhbCBjb25maXJtYXRpb24sIGlmIHJlcXVpcmVkLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIG9uIHJlY2VpdmluZyBzZXJ2ZXIgcmVwbHkuXG4gICAqL1xuICBsb2dpblRva2VuKHRva2VuLCBjcmVkKSB7XG4gICAgcmV0dXJuIHRoaXMubG9naW4oJ3Rva2VuJywgdG9rZW4sIGNyZWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgYSByZXF1ZXN0IGZvciByZXNldHRpbmcgYW4gYXV0aGVudGljYXRpb24gc2VjcmV0LlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2NoZW1lIC0gYXV0aGVudGljYXRpb24gc2NoZW1lIHRvIHJlc2V0LlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWV0aG9kIC0gbWV0aG9kIHRvIHVzZSBmb3IgcmVzZXR0aW5nIHRoZSBzZWNyZXQsIHN1Y2ggYXMgXCJlbWFpbFwiIG9yIFwidGVsXCIuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSAtIHZhbHVlIG9mIHRoZSBjcmVkZW50aWFsIHRvIHVzZSwgYSBzcGVjaWZpYyBlbWFpbCBhZGRyZXNzIG9yIGEgcGhvbmUgbnVtYmVyLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIG9uIHJlY2VpdmluZyB0aGUgc2VydmVyIHJlcGx5LlxuICAgKi9cbiAgcmVxdWVzdFJlc2V0QXV0aFNlY3JldChzY2hlbWUsIG1ldGhvZCwgdmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5sb2dpbigncmVzZXQnLCBiNjRFbmNvZGVVbmljb2RlKHNjaGVtZSArICc6JyArIG1ldGhvZCArICc6JyArIHZhbHVlKSk7XG4gIH1cblxuICAvKipcbiAgICogQHR5cGVkZWYgQXV0aFRva2VuXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB0b2tlbiAtIFRva2VuIHZhbHVlLlxuICAgKiBAcHJvcGVydHkge0RhdGV9IGV4cGlyZXMgLSBUb2tlbiBleHBpcmF0aW9uIHRpbWUuXG4gICAqL1xuICAvKipcbiAgICogR2V0IHN0b3JlZCBhdXRoZW50aWNhdGlvbiB0b2tlbi5cbiAgICpcbiAgICogQHJldHVybnMge0F1dGhUb2tlbn0gYXV0aGVudGljYXRpb24gdG9rZW4uXG4gICAqL1xuICBnZXRBdXRoVG9rZW4oKSB7XG4gICAgaWYgKHRoaXMuX2F1dGhUb2tlbiAmJiAodGhpcy5fYXV0aFRva2VuLmV4cGlyZXMuZ2V0VGltZSgpID4gRGF0ZS5ub3coKSkpIHtcbiAgICAgIHJldHVybiB0aGlzLl9hdXRoVG9rZW47XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2F1dGhUb2tlbiA9IG51bGw7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGxpY2F0aW9uIG1heSBwcm92aWRlIGEgc2F2ZWQgYXV0aGVudGljYXRpb24gdG9rZW4uXG4gICAqXG4gICAqIEBwYXJhbSB7QXV0aFRva2VufSB0b2tlbiAtIGF1dGhlbnRpY2F0aW9uIHRva2VuLlxuICAgKi9cbiAgc2V0QXV0aFRva2VuKHRva2VuKSB7XG4gICAgdGhpcy5fYXV0aFRva2VuID0gdG9rZW47XG4gIH1cblxuICAvKipcbiAgICogQHR5cGVkZWYgU2V0UGFyYW1zXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBwcm9wZXJ0eSB7U2V0RGVzYz19IGRlc2MgLSBUb3BpYyBpbml0aWFsaXphdGlvbiBwYXJhbWV0ZXJzIHdoZW4gY3JlYXRpbmcgYSBuZXcgdG9waWMgb3IgYSBuZXcgc3Vic2NyaXB0aW9uLlxuICAgKiBAcHJvcGVydHkge1NldFN1Yj19IHN1YiAtIFN1YnNjcmlwdGlvbiBpbml0aWFsaXphdGlvbiBwYXJhbWV0ZXJzLlxuICAgKiBAcHJvcGVydHkge0FycmF5LjxzdHJpbmc+PX0gYXR0YWNobWVudHMgLSBVUkxzIG9mIG91dCBvZiBiYW5kIGF0dGFjaG1lbnRzIHVzZWQgaW4gcGFyYW1ldGVycy5cbiAgICovXG4gIC8qKlxuICAgKiBAdHlwZWRlZiBTZXREZXNjXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBwcm9wZXJ0eSB7RGVmQWNzPX0gZGVmYWNzIC0gRGVmYXVsdCBhY2Nlc3MgbW9kZS5cbiAgICogQHByb3BlcnR5IHtPYmplY3Q9fSBwdWJsaWMgLSBGcmVlLWZvcm0gdG9waWMgZGVzY3JpcHRpb24sIHB1YmxpY2FsbHkgYWNjZXNzaWJsZS5cbiAgICogQHByb3BlcnR5IHtPYmplY3Q9fSBwcml2YXRlIC0gRnJlZS1mb3JtIHRvcGljIGRlc2NyaXB0aW9uIGFjY2Vzc2libGUgb25seSB0byB0aGUgb3duZXIuXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0PX0gdHJ1c3RlZCAtIFRydXN0ZWQgdXNlciBkYXRhIHdoaWNoIGNhbiBiZSBzZXQgYnkgYSByb290IHVzZXIgb25seS5cbiAgICovXG4gIC8qKlxuICAgKiBAdHlwZWRlZiBTZXRTdWJcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHByb3BlcnR5IHtzdHJpbmc9fSB1c2VyIC0gVUlEIG9mIHRoZSB1c2VyIGFmZmVjdGVkIGJ5IHRoZSByZXF1ZXN0LiBEZWZhdWx0IChlbXB0eSkgLSBjdXJyZW50IHVzZXIuXG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nPX0gbW9kZSAtIFVzZXIgYWNjZXNzIG1vZGUsIGVpdGhlciByZXF1ZXN0ZWQgb3IgYXNzaWduZWQgZGVwZW5kZW50IG9uIGNvbnRleHQuXG4gICAqL1xuICAvKipcbiAgICogU2VuZCBhIHRvcGljIHN1YnNjcmlwdGlvbiByZXF1ZXN0LlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWMgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byBzdWJzY3JpYmUgdG8uXG4gICAqIEBwYXJhbSB7R2V0UXVlcnk9fSBnZXRQYXJhbXMgLSBPcHRpb25hbCBzdWJzY3JpcHRpb24gbWV0YWRhdGEgcXVlcnlcbiAgICogQHBhcmFtIHtTZXRQYXJhbXM9fSBzZXRQYXJhbXMgLSBPcHRpb25hbCBpbml0aWFsaXphdGlvbiBwYXJhbWV0ZXJzXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gcmVjZWl2aW5nIHNlcnZlciByZXBseS5cbiAgICovXG4gIHN1YnNjcmliZSh0b3BpY05hbWUsIGdldFBhcmFtcywgc2V0UGFyYW1zKSB7XG4gICAgY29uc3QgcGt0ID0gdGhpcy4jaW5pdFBhY2tldCgnc3ViJywgdG9waWNOYW1lKVxuICAgIGlmICghdG9waWNOYW1lKSB7XG4gICAgICB0b3BpY05hbWUgPSBDb25zdC5UT1BJQ19ORVc7XG4gICAgfVxuXG4gICAgcGt0LnN1Yi5nZXQgPSBnZXRQYXJhbXM7XG5cbiAgICBpZiAoc2V0UGFyYW1zKSB7XG4gICAgICBpZiAoc2V0UGFyYW1zLnN1Yikge1xuICAgICAgICBwa3Quc3ViLnNldC5zdWIgPSBzZXRQYXJhbXMuc3ViO1xuICAgICAgfVxuXG4gICAgICBpZiAoc2V0UGFyYW1zLmRlc2MpIHtcbiAgICAgICAgY29uc3QgZGVzYyA9IHNldFBhcmFtcy5kZXNjO1xuICAgICAgICBpZiAoVGlub2RlLmlzTmV3R3JvdXBUb3BpY05hbWUodG9waWNOYW1lKSkge1xuICAgICAgICAgIC8vIEZ1bGwgc2V0LmRlc2MgcGFyYW1zIGFyZSB1c2VkIGZvciBuZXcgdG9waWNzIG9ubHlcbiAgICAgICAgICBwa3Quc3ViLnNldC5kZXNjID0gZGVzYztcbiAgICAgICAgfSBlbHNlIGlmIChUaW5vZGUuaXNQMlBUb3BpY05hbWUodG9waWNOYW1lKSAmJiBkZXNjLmRlZmFjcykge1xuICAgICAgICAgIC8vIFVzZSBvcHRpb25hbCBkZWZhdWx0IHBlcm1pc3Npb25zIG9ubHkuXG4gICAgICAgICAgcGt0LnN1Yi5zZXQuZGVzYyA9IHtcbiAgICAgICAgICAgIGRlZmFjczogZGVzYy5kZWZhY3NcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFNlZSBpZiBleHRlcm5hbCBvYmplY3RzIHdlcmUgdXNlZCBpbiB0b3BpYyBkZXNjcmlwdGlvbi5cbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHNldFBhcmFtcy5hdHRhY2htZW50cykgJiYgc2V0UGFyYW1zLmF0dGFjaG1lbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcGt0LmV4dHJhID0ge1xuICAgICAgICAgIGF0dGFjaG1lbnRzOiBzZXRQYXJhbXMuYXR0YWNobWVudHMuZmlsdGVyKHJlZiA9PiBpc1VybFJlbGF0aXZlKHJlZikpXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIGlmIChzZXRQYXJhbXMudGFncykge1xuICAgICAgICBwa3Quc3ViLnNldC50YWdzID0gc2V0UGFyYW1zLnRhZ3M7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzLiNzZW5kKHBrdCwgcGt0LnN1Yi5pZCk7XG4gIH1cblxuICAvKipcbiAgICogRGV0YWNoIGFuZCBvcHRpb25hbGx5IHVuc3Vic2NyaWJlIGZyb20gdGhlIHRvcGljXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpYyAtIFRvcGljIHRvIGRldGFjaCBmcm9tLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHVuc3ViIC0gSWYgPGNvZGU+dHJ1ZTwvY29kZT4sIGRldGFjaCBhbmQgdW5zdWJzY3JpYmUsIG90aGVyd2lzZSBqdXN0IGRldGFjaC5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCBvbiByZWNlaXZpbmcgc2VydmVyIHJlcGx5LlxuICAgKi9cbiAgbGVhdmUodG9waWMsIHVuc3ViKSB7XG4gICAgY29uc3QgcGt0ID0gdGhpcy4jaW5pdFBhY2tldCgnbGVhdmUnLCB0b3BpYyk7XG4gICAgcGt0LmxlYXZlLnVuc3ViID0gdW5zdWI7XG5cbiAgICByZXR1cm4gdGhpcy4jc2VuZChwa3QsIHBrdC5sZWF2ZS5pZCk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIG1lc3NhZ2UgZHJhZnQgd2l0aG91dCBzZW5kaW5nIGl0IHRvIHRoZSBzZXJ2ZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpYyAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIHB1Ymxpc2ggdG8uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZW50IC0gUGF5bG9hZCB0byBwdWJsaXNoLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBub0VjaG8gLSBJZiA8Y29kZT50cnVlPC9jb2RlPiwgdGVsbCB0aGUgc2VydmVyIG5vdCB0byBlY2hvIHRoZSBtZXNzYWdlIHRvIHRoZSBvcmlnaW5hbCBzZXNzaW9uLlxuICAgKlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSBuZXcgbWVzc2FnZSB3aGljaCBjYW4gYmUgc2VudCB0byB0aGUgc2VydmVyIG9yIG90aGVyd2lzZSB1c2VkLlxuICAgKi9cbiAgY3JlYXRlTWVzc2FnZSh0b3BpYywgY29udGVudCwgbm9FY2hvKSB7XG4gICAgY29uc3QgcGt0ID0gdGhpcy4jaW5pdFBhY2tldCgncHViJywgdG9waWMpO1xuXG4gICAgbGV0IGRmdCA9IHR5cGVvZiBjb250ZW50ID09ICdzdHJpbmcnID8gRHJhZnR5LnBhcnNlKGNvbnRlbnQpIDogY29udGVudDtcbiAgICBpZiAoZGZ0ICYmICFEcmFmdHkuaXNQbGFpblRleHQoZGZ0KSkge1xuICAgICAgcGt0LnB1Yi5oZWFkID0ge1xuICAgICAgICBtaW1lOiBEcmFmdHkuZ2V0Q29udGVudFR5cGUoKVxuICAgICAgfTtcbiAgICAgIGNvbnRlbnQgPSBkZnQ7XG4gICAgfVxuICAgIHBrdC5wdWIubm9lY2hvID0gbm9FY2hvO1xuICAgIHBrdC5wdWIuY29udGVudCA9IGNvbnRlbnQ7XG5cbiAgICByZXR1cm4gcGt0LnB1YjtcbiAgfVxuXG4gIC8qKlxuICAgKiBQdWJsaXNoIHtkYXRhfSBtZXNzYWdlIHRvIHRvcGljLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWNOYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gcHVibGlzaCB0by5cbiAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRlbnQgLSBQYXlsb2FkIHRvIHB1Ymxpc2guXG4gICAqIEBwYXJhbSB7Ym9vbGVhbj19IG5vRWNobyAtIElmIDxjb2RlPnRydWU8L2NvZGU+LCB0ZWxsIHRoZSBzZXJ2ZXIgbm90IHRvIGVjaG8gdGhlIG1lc3NhZ2UgdG8gdGhlIG9yaWdpbmFsIHNlc3Npb24uXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gcmVjZWl2aW5nIHNlcnZlciByZXBseS5cbiAgICovXG4gIHB1Ymxpc2godG9waWNOYW1lLCBjb250ZW50LCBub0VjaG8pIHtcbiAgICByZXR1cm4gdGhpcy5wdWJsaXNoTWVzc2FnZShcbiAgICAgIHRoaXMuY3JlYXRlTWVzc2FnZSh0b3BpY05hbWUsIGNvbnRlbnQsIG5vRWNobylcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIFB1Ymxpc2ggbWVzc2FnZSB0byB0b3BpYy4gVGhlIG1lc3NhZ2Ugc2hvdWxkIGJlIGNyZWF0ZWQgYnkge0BsaW5rIFRpbm9kZSNjcmVhdGVNZXNzYWdlfS5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHB1YiAtIE1lc3NhZ2UgdG8gcHVibGlzaC5cbiAgICogQHBhcmFtIHtBcnJheS48c3RyaW5nPj19IGF0dGFjaG1lbnRzIC0gYXJyYXkgb2YgVVJMcyB3aXRoIGF0dGFjaG1lbnRzLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIG9uIHJlY2VpdmluZyBzZXJ2ZXIgcmVwbHkuXG4gICAqL1xuICBwdWJsaXNoTWVzc2FnZShwdWIsIGF0dGFjaG1lbnRzKSB7XG4gICAgLy8gTWFrZSBhIHNoYWxsb3cgY29weS4gTmVlZGVkIGluIG9yZGVyIHRvIGNsZWFyIGxvY2FsbHktYXNzaWduZWQgdGVtcCB2YWx1ZXM7XG4gICAgcHViID0gT2JqZWN0LmFzc2lnbih7fSwgcHViKTtcbiAgICBwdWIuc2VxID0gdW5kZWZpbmVkO1xuICAgIHB1Yi5mcm9tID0gdW5kZWZpbmVkO1xuICAgIHB1Yi50cyA9IHVuZGVmaW5lZDtcbiAgICBjb25zdCBtc2cgPSB7XG4gICAgICBwdWI6IHB1YixcbiAgICB9O1xuICAgIGlmIChhdHRhY2htZW50cykge1xuICAgICAgbXNnLmV4dHJhID0ge1xuICAgICAgICBhdHRhY2htZW50czogYXR0YWNobWVudHMuZmlsdGVyKHJlZiA9PiBpc1VybFJlbGF0aXZlKHJlZikpXG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy4jc2VuZChtc2csIHB1Yi5pZCk7XG4gIH1cblxuICAvKipcbiAgICogT3V0IG9mIGJhbmQgbm90aWZpY2F0aW9uOiBub3RpZnkgdG9waWMgdGhhdCBhbiBleHRlcm5hbCAocHVzaCkgbm90aWZpY2F0aW9uIHdhcyByZWNpdmVkIGJ5IHRoZSBjbGllbnQuXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBkYXRhIC0gbm90aWZpY2F0aW9uIHBheWxvYWQuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBkYXRhLndoYXQgLSBub3RpZmljYXRpb24gdHlwZSwgJ21zZycsICdyZWFkJywgJ3N1YicuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBkYXRhLnRvcGljIC0gbmFtZSBvZiB0aGUgdXBkYXRlZCB0b3BpYy5cbiAgICogQHBhcmFtIHtudW1iZXI9fSBkYXRhLnNlcSAtIHNlcSBJRCBvZiB0aGUgYWZmZWN0ZWQgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtzdHJpbmc9fSBkYXRhLnhmcm9tIC0gVUlEIG9mIHRoZSBzZW5kZXIuXG4gICAqIEBwYXJhbSB7b2JqZWN0PX0gZGF0YS5naXZlbiAtIG5ldyBzdWJzY3JpcHRpb24gJ2dpdmVuJywgZS5nLiAnQVNXUC4uLicuXG4gICAqIEBwYXJhbSB7b2JqZWN0PX0gZGF0YS53YW50IC0gbmV3IHN1YnNjcmlwdGlvbiAnd2FudCcsIGUuZy4gJ1JXSi4uLicuXG4gICAqL1xuICBvb2JOb3RpZmljYXRpb24oZGF0YSkge1xuICAgIHRoaXMubG9nZ2VyKFwib29iOiBcIiArICh0aGlzLl90cmltTG9uZ1N0cmluZ3MgPyBKU09OLnN0cmluZ2lmeShkYXRhLCBqc29uTG9nZ2VySGVscGVyKSA6IGRhdGEpKTtcblxuICAgIHN3aXRjaCAoZGF0YS53aGF0KSB7XG4gICAgICBjYXNlICdtc2cnOlxuICAgICAgICBpZiAoIWRhdGEuc2VxIHx8IGRhdGEuc2VxIDwgMSB8fCAhZGF0YS50b3BpYykge1xuICAgICAgICAgIC8vIFNlcnZlciBzZW50IGludmFsaWQgZGF0YS5cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5pc0Nvbm5lY3RlZCgpKSB7XG4gICAgICAgICAgLy8gTGV0J3MgaWdub3JlIHRoZSBtZXNzYWdlIGlzIHRoZXJlIGlzIG5vIGNvbm5lY3Rpb246IG5vIGNvbm5lY3Rpb24gbWVhbnMgdGhlcmUgYXJlIG5vIG9wZW5cbiAgICAgICAgICAvLyB0YWJzIHdpdGggVGlub2RlLlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdG9waWMgPSB0aGlzLiNjYWNoZUdldCgndG9waWMnLCBkYXRhLnRvcGljKTtcbiAgICAgICAgaWYgKCF0b3BpYykge1xuICAgICAgICAgIC8vIFRPRE86IGNoZWNrIGlmIHRoZXJlIGlzIGEgY2FzZSB3aGVuIGEgbWVzc2FnZSBjYW4gYXJyaXZlIGZyb20gYW4gdW5rbm93biB0b3BpYy5cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0b3BpYy5pc1N1YnNjcmliZWQoKSkge1xuICAgICAgICAgIC8vIE5vIG5lZWQgdG8gZmV0Y2g6IHRvcGljIGlzIGFscmVhZHkgc3Vic2NyaWJlZCBhbmQgZ290IGRhdGEgdGhyb3VnaCBub3JtYWwgY2hhbm5lbC5cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0b3BpYy5tYXhNc2dTZXEoKSA8IGRhdGEuc2VxKSB7XG4gICAgICAgICAgaWYgKHRvcGljLmlzQ2hhbm5lbFR5cGUoKSkge1xuICAgICAgICAgICAgdG9waWMuX3VwZGF0ZVJlY2VpdmVkKGRhdGEuc2VxLCAnZmFrZS11aWQnKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBOZXcgbWVzc2FnZS5cbiAgICAgICAgICBpZiAoZGF0YS54ZnJvbSAmJiAhdGhpcy4jY2FjaGVHZXQoJ3VzZXInLCBkYXRhLnhmcm9tKSkge1xuICAgICAgICAgICAgLy8gTWVzc2FnZSBmcm9tIHVua25vd24gc2VuZGVyLCBmZXRjaCBkZXNjcmlwdGlvbiBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAgICAgICAgICAvLyBTZW5kaW5nIGFzeW5jaHJvbm91c2x5IHdpdGhvdXQgYSBzdWJzY3JpcHRpb24uXG4gICAgICAgICAgICB0aGlzLmdldE1ldGEoZGF0YS54ZnJvbSwgbmV3IE1ldGFHZXRCdWlsZGVyKCkud2l0aERlc2MoKS5idWlsZCgpKS5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmxvZ2dlcihcIkZhaWxlZCB0byBnZXQgdGhlIG5hbWUgb2YgYSBuZXcgc2VuZGVyXCIsIGVycik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0b3BpYy5zdWJzY3JpYmUobnVsbCkudGhlbihfID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0b3BpYy5nZXRNZXRhKG5ldyBNZXRhR2V0QnVpbGRlcih0b3BpYykud2l0aExhdGVyRGF0YSgyNCkud2l0aExhdGVyRGVsKDI0KS5idWlsZCgpKTtcbiAgICAgICAgICB9KS50aGVuKF8gPT4ge1xuICAgICAgICAgICAgLy8gQWxsb3cgZGF0YSBmZXRjaCB0byBjb21wbGV0ZSBhbmQgZ2V0IHByb2Nlc3NlZCBzdWNjZXNzZnVsbHkuXG4gICAgICAgICAgICB0b3BpYy5sZWF2ZURlbGF5ZWQoZmFsc2UsIDEwMDApO1xuICAgICAgICAgIH0pLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlcihcIk9uIHB1c2ggZGF0YSBmZXRjaCBmYWlsZWRcIiwgZXJyKTtcbiAgICAgICAgICB9KS5maW5hbGx5KF8gPT4ge1xuICAgICAgICAgICAgdGhpcy5nZXRNZVRvcGljKCkuX3JlZnJlc2hDb250YWN0KCdtc2cnLCB0b3BpYyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ3JlYWQnOlxuICAgICAgICB0aGlzLmdldE1lVG9waWMoKS5fcm91dGVQcmVzKHtcbiAgICAgICAgICB3aGF0OiAncmVhZCcsXG4gICAgICAgICAgc2VxOiBkYXRhLnNlcVxuICAgICAgICB9KTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ3N1Yic6XG4gICAgICAgIGlmICghdGhpcy5pc01lKGRhdGEueGZyb20pKSB7XG4gICAgICAgICAgLy8gVE9ETzogaGFuZGxlIHVwZGF0ZXMgZnJvbSBvdGhlciB1c2Vycy5cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBtb2RlID0ge1xuICAgICAgICAgIGdpdmVuOiBkYXRhLm1vZGVHaXZlbixcbiAgICAgICAgICB3YW50OiBkYXRhLm1vZGVXYW50XG4gICAgICAgIH07XG4gICAgICAgIGxldCBhY3MgPSBuZXcgQWNjZXNzTW9kZShtb2RlKTtcbiAgICAgICAgbGV0IHByZXMgPSAoIWFjcy5tb2RlIHx8IGFjcy5tb2RlID09IEFjY2Vzc01vZGUuX05PTkUpID9cbiAgICAgICAgICAvLyBTdWJzY3JpcHRpb24gZGVsZXRlZC5cbiAgICAgICAgICB7XG4gICAgICAgICAgICB3aGF0OiAnZ29uZScsXG4gICAgICAgICAgICBzcmM6IGRhdGEudG9waWNcbiAgICAgICAgICB9IDpcbiAgICAgICAgICAvLyBOZXcgc3Vic2NyaXB0aW9uIG9yIHN1YnNjcmlwdGlvbiB1cGRhdGVkLlxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHdoYXQ6ICdhY3MnLFxuICAgICAgICAgICAgc3JjOiBkYXRhLnRvcGljLFxuICAgICAgICAgICAgZGFjczogbW9kZVxuICAgICAgICAgIH07XG4gICAgICAgIHRoaXMuZ2V0TWVUb3BpYygpLl9yb3V0ZVByZXMocHJlcyk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aGlzLmxvZ2dlcihcIlVua25vd24gcHVzaCB0eXBlIGlnbm9yZWRcIiwgZGF0YS53aGF0KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHR5cGVkZWYgR2V0UXVlcnlcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHByb3BlcnR5IHtHZXRPcHRzVHlwZT19IGRlc2MgLSBJZiBwcm92aWRlZCAoZXZlbiBpZiBlbXB0eSksIGZldGNoIHRvcGljIGRlc2NyaXB0aW9uLlxuICAgKiBAcHJvcGVydHkge0dldE9wdHNUeXBlPX0gc3ViIC0gSWYgcHJvdmlkZWQgKGV2ZW4gaWYgZW1wdHkpLCBmZXRjaCB0b3BpYyBzdWJzY3JpcHRpb25zLlxuICAgKiBAcHJvcGVydHkge0dldERhdGFUeXBlPX0gZGF0YSAtIElmIHByb3ZpZGVkIChldmVuIGlmIGVtcHR5KSwgZ2V0IG1lc3NhZ2VzLlxuICAgKi9cblxuICAvKipcbiAgICogQHR5cGVkZWYgR2V0T3B0c1R5cGVcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHByb3BlcnR5IHtEYXRlPX0gaW1zIC0gXCJJZiBtb2RpZmllZCBzaW5jZVwiLCBmZXRjaCBkYXRhIG9ubHkgaXQgd2FzIHdhcyBtb2RpZmllZCBzaW5jZSBzdGF0ZWQgZGF0ZS5cbiAgICogQHByb3BlcnR5IHtudW1iZXI9fSBsaW1pdCAtIE1heGltdW0gbnVtYmVyIG9mIHJlc3VsdHMgdG8gcmV0dXJuLiBJZ25vcmVkIHdoZW4gcXVlcnlpbmcgdG9waWMgZGVzY3JpcHRpb24uXG4gICAqL1xuXG4gIC8qKlxuICAgKiBAdHlwZWRlZiBHZXREYXRhVHlwZVxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAcHJvcGVydHkge251bWJlcj19IHNpbmNlIC0gTG9hZCBtZXNzYWdlcyB3aXRoIHNlcSBpZCBlcXVhbCBvciBncmVhdGVyIHRoYW4gdGhpcyB2YWx1ZS5cbiAgICogQHByb3BlcnR5IHtudW1iZXI9fSBiZWZvcmUgLSBMb2FkIG1lc3NhZ2VzIHdpdGggc2VxIGlkIGxvd2VyIHRoYW4gdGhpcyBudW1iZXIuXG4gICAqIEBwcm9wZXJ0eSB7bnVtYmVyPX0gbGltaXQgLSBNYXhpbXVtIG51bWJlciBvZiByZXN1bHRzIHRvIHJldHVybi5cbiAgICovXG5cbiAgLyoqXG4gICAqIFJlcXVlc3QgdG9waWMgbWV0YWRhdGFcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gcXVlcnkuXG4gICAqIEBwYXJhbSB7R2V0UXVlcnl9IHBhcmFtcyAtIFBhcmFtZXRlcnMgb2YgdGhlIHF1ZXJ5LiBVc2Uge0BsaW5rIFRpbm9kZS5NZXRhR2V0QnVpbGRlcn0gdG8gZ2VuZXJhdGUuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gcmVjZWl2aW5nIHNlcnZlciByZXBseS5cbiAgICovXG4gIGdldE1ldGEodG9waWMsIHBhcmFtcykge1xuICAgIGNvbnN0IHBrdCA9IHRoaXMuI2luaXRQYWNrZXQoJ2dldCcsIHRvcGljKTtcblxuICAgIHBrdC5nZXQgPSBtZXJnZU9iaihwa3QuZ2V0LCBwYXJhbXMpO1xuXG4gICAgcmV0dXJuIHRoaXMuI3NlbmQocGt0LCBwa3QuZ2V0LmlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgdG9waWMncyBtZXRhZGF0YTogZGVzY3JpcHRpb24sIHN1YnNjcmlidGlvbnMuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpYyAtIFRvcGljIHRvIHVwZGF0ZS5cbiAgICogQHBhcmFtIHtTZXRQYXJhbXN9IHBhcmFtcyAtIHRvcGljIG1ldGFkYXRhIHRvIHVwZGF0ZS5cbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCBvbiByZWNlaXZpbmcgc2VydmVyIHJlcGx5LlxuICAgKi9cbiAgc2V0TWV0YSh0b3BpYywgcGFyYW1zKSB7XG4gICAgY29uc3QgcGt0ID0gdGhpcy4jaW5pdFBhY2tldCgnc2V0JywgdG9waWMpO1xuICAgIGNvbnN0IHdoYXQgPSBbXTtcblxuICAgIGlmIChwYXJhbXMpIHtcbiAgICAgIFsnZGVzYycsICdzdWInLCAndGFncycsICdjcmVkJywgJ2VwaGVtZXJhbCddLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgIGlmIChwYXJhbXMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgIHdoYXQucHVzaChrZXkpO1xuICAgICAgICAgIHBrdC5zZXRba2V5XSA9IHBhcmFtc1trZXldO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkocGFyYW1zLmF0dGFjaG1lbnRzKSAmJiBwYXJhbXMuYXR0YWNobWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgICBwa3QuZXh0cmEgPSB7XG4gICAgICAgICAgYXR0YWNobWVudHM6IHBhcmFtcy5hdHRhY2htZW50cy5maWx0ZXIocmVmID0+IGlzVXJsUmVsYXRpdmUocmVmKSlcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAod2hhdC5sZW5ndGggPT0gMCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIkludmFsaWQge3NldH0gcGFyYW1ldGVyc1wiKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuI3NlbmQocGt0LCBwa3Quc2V0LmlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSYW5nZSBvZiBtZXNzYWdlIElEcyB0byBkZWxldGUuXG4gICAqXG4gICAqIEB0eXBlZGVmIERlbFJhbmdlXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBsb3cgLSBsb3cgZW5kIG9mIHRoZSByYW5nZSwgaW5jbHVzaXZlIChjbG9zZWQpLlxuICAgKiBAcHJvcGVydHkge251bWJlcj19IGhpIC0gaGlnaCBlbmQgb2YgdGhlIHJhbmdlLCBleGNsdXNpdmUgKG9wZW4pLlxuICAgKi9cbiAgLyoqXG4gICAqIERlbGV0ZSBzb21lIG9yIGFsbCBtZXNzYWdlcyBpbiBhIHRvcGljLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWMgLSBUb3BpYyBuYW1lIHRvIGRlbGV0ZSBtZXNzYWdlcyBmcm9tLlxuICAgKiBAcGFyYW0ge0RlbFJhbmdlW119IGxpc3QgLSBSYW5nZXMgb2YgbWVzc2FnZSBJRHMgdG8gZGVsZXRlLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBoYXJkIC0gSGFyZCBvciBzb2Z0IGRlbGV0ZVxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIG9uIHJlY2VpdmluZyBzZXJ2ZXIgcmVwbHkuXG4gICAqL1xuICBkZWxNZXNzYWdlcyh0b3BpYywgcmFuZ2VzLCBoYXJkKSB7XG4gICAgY29uc3QgcGt0ID0gdGhpcy4jaW5pdFBhY2tldCgnZGVsJywgdG9waWMpO1xuXG4gICAgcGt0LmRlbC53aGF0ID0gJ21zZyc7XG4gICAgcGt0LmRlbC5kZWxzZXEgPSByYW5nZXM7XG4gICAgcGt0LmRlbC5oYXJkID0gaGFyZDtcblxuICAgIHJldHVybiB0aGlzLiNzZW5kKHBrdCwgcGt0LmRlbC5pZCk7XG4gIH1cblxuICAvKipcbiAgICogRGVsZXRlIHRoZSB0b3BpYyBhbGx0b2dldGhlci4gUmVxdWlyZXMgT3duZXIgcGVybWlzc2lvbi5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljTmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIGRlbGV0ZVxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGhhcmQgLSBoYXJkLWRlbGV0ZSB0b3BpYy5cbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCBvbiByZWNlaXZpbmcgc2VydmVyIHJlcGx5LlxuICAgKi9cbiAgZGVsVG9waWModG9waWNOYW1lLCBoYXJkKSB7XG4gICAgY29uc3QgcGt0ID0gdGhpcy4jaW5pdFBhY2tldCgnZGVsJywgdG9waWNOYW1lKTtcbiAgICBwa3QuZGVsLndoYXQgPSAndG9waWMnO1xuICAgIHBrdC5kZWwuaGFyZCA9IGhhcmQ7XG5cbiAgICByZXR1cm4gdGhpcy4jc2VuZChwa3QsIHBrdC5kZWwuaWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIERlbGV0ZSBzdWJzY3JpcHRpb24uIFJlcXVpcmVzIFNoYXJlIHBlcm1pc3Npb24uXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpY05hbWUgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byBkZWxldGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVzZXIgLSBVc2VyIElEIHRvIHJlbW92ZS5cbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCBvbiByZWNlaXZpbmcgc2VydmVyIHJlcGx5LlxuICAgKi9cbiAgZGVsU3Vic2NyaXB0aW9uKHRvcGljTmFtZSwgdXNlcikge1xuICAgIGNvbnN0IHBrdCA9IHRoaXMuI2luaXRQYWNrZXQoJ2RlbCcsIHRvcGljTmFtZSk7XG4gICAgcGt0LmRlbC53aGF0ID0gJ3N1Yic7XG4gICAgcGt0LmRlbC51c2VyID0gdXNlcjtcblxuICAgIHJldHVybiB0aGlzLiNzZW5kKHBrdCwgcGt0LmRlbC5pZCk7XG4gIH1cblxuICAvKipcbiAgICogRGVsZXRlIGNyZWRlbnRpYWwuIEFsd2F5cyBzZW50IG9uIDxjb2RlPidtZSc8L2NvZGU+IHRvcGljLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWV0aG9kIC0gdmFsaWRhdGlvbiBtZXRob2Qgc3VjaCBhcyA8Y29kZT4nZW1haWwnPC9jb2RlPiBvciA8Y29kZT4ndGVsJzwvY29kZT4uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSAtIHZhbGlkYXRpb24gdmFsdWUsIGkuZS4gPGNvZGU+J2FsaWNlQGV4YW1wbGUuY29tJzwvY29kZT4uXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gcmVjZWl2aW5nIHNlcnZlciByZXBseS5cbiAgICovXG4gIGRlbENyZWRlbnRpYWwobWV0aG9kLCB2YWx1ZSkge1xuICAgIGNvbnN0IHBrdCA9IHRoaXMuI2luaXRQYWNrZXQoJ2RlbCcsIENvbnN0LlRPUElDX01FKTtcbiAgICBwa3QuZGVsLndoYXQgPSAnY3JlZCc7XG4gICAgcGt0LmRlbC5jcmVkID0ge1xuICAgICAgbWV0aDogbWV0aG9kLFxuICAgICAgdmFsOiB2YWx1ZVxuICAgIH07XG5cbiAgICByZXR1cm4gdGhpcy4jc2VuZChwa3QsIHBrdC5kZWwuaWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcXVlc3QgdG8gZGVsZXRlIGFjY291bnQgb2YgdGhlIGN1cnJlbnQgdXNlci5cbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSBoYXJkIC0gaGFyZC1kZWxldGUgdXNlci5cbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCBvbiByZWNlaXZpbmcgc2VydmVyIHJlcGx5LlxuICAgKi9cbiAgZGVsQ3VycmVudFVzZXIoaGFyZCkge1xuICAgIGNvbnN0IHBrdCA9IHRoaXMuI2luaXRQYWNrZXQoJ2RlbCcsIG51bGwpO1xuICAgIHBrdC5kZWwud2hhdCA9ICd1c2VyJztcbiAgICBwa3QuZGVsLmhhcmQgPSBoYXJkO1xuXG4gICAgcmV0dXJuIHRoaXMuI3NlbmQocGt0LCBwa3QuZGVsLmlkKS50aGVuKF8gPT4ge1xuICAgICAgdGhpcy5fbXlVSUQgPSBudWxsO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIE5vdGlmeSBzZXJ2ZXIgdGhhdCBhIG1lc3NhZ2Ugb3IgbWVzc2FnZXMgd2VyZSByZWFkIG9yIHJlY2VpdmVkLiBEb2VzIE5PVCByZXR1cm4gcHJvbWlzZS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljTmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHdoZXJlIHRoZSBtZXNhZ2UgaXMgYmVpbmcgYWtub3dsZWRnZWQuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB3aGF0IC0gQWN0aW9uIGJlaW5nIGFrbm93bGVkZ2VkLCBlaXRoZXIgPGNvZGU+XCJyZWFkXCI8L2NvZGU+IG9yIDxjb2RlPlwicmVjdlwiPC9jb2RlPi5cbiAgICogQHBhcmFtIHtudW1iZXJ9IHNlcSAtIE1heGltdW0gaWQgb2YgdGhlIG1lc3NhZ2UgYmVpbmcgYWNrbm93bGVkZ2VkLlxuICAgKi9cbiAgbm90ZSh0b3BpY05hbWUsIHdoYXQsIHNlcSkge1xuICAgIGlmIChzZXEgPD0gMCB8fCBzZXEgPj0gQ29uc3QuTE9DQUxfU0VRSUQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBtZXNzYWdlIGlkICR7c2VxfWApO1xuICAgIH1cblxuICAgIGNvbnN0IHBrdCA9IHRoaXMuI2luaXRQYWNrZXQoJ25vdGUnLCB0b3BpY05hbWUpO1xuICAgIHBrdC5ub3RlLndoYXQgPSB3aGF0O1xuICAgIHBrdC5ub3RlLnNlcSA9IHNlcTtcbiAgICB0aGlzLiNzZW5kKHBrdCk7XG4gIH1cblxuICAvKipcbiAgICogQnJvYWRjYXN0IGEga2V5LXByZXNzIG5vdGlmaWNhdGlvbiB0byB0b3BpYyBzdWJzY3JpYmVycy4gVXNlZCB0byBzaG93XG4gICAqIHR5cGluZyBub3RpZmljYXRpb25zIFwidXNlciBYIGlzIHR5cGluZy4uLlwiLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWNOYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gYnJvYWRjYXN0IHRvLlxuICAgKiBAcGFyYW0ge3N0cmluZz19IHR5cGUgLSBub3RpZmljYXRpb24gdG8gc2VuZCwgZGVmYXVsdCBpcyAna3AnLlxuICAgKi9cbiAgbm90ZUtleVByZXNzKHRvcGljTmFtZSwgdHlwZSkge1xuICAgIGNvbnN0IHBrdCA9IHRoaXMuI2luaXRQYWNrZXQoJ25vdGUnLCB0b3BpY05hbWUpO1xuICAgIHBrdC5ub3RlLndoYXQgPSB0eXBlIHx8ICdrcCc7XG4gICAgdGhpcy4jc2VuZChwa3QpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgYSB2aWRlbyBjYWxsIG5vdGlmaWNhdGlvbiB0byB0b3BpYyBzdWJzY3JpYmVycyAoaW5jbHVkaW5nIGRpYWxpbmcsXG4gICAqIGhhbmd1cCwgZXRjLikuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpY05hbWUgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byBicm9hZGNhc3QgdG8uXG4gICAqIEBwYXJhbSB7aW50fSBzZXEgLSBJRCBvZiB0aGUgY2FsbCBtZXNzYWdlIHRoZSBldmVudCBwZXJ0YWlucyB0by5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGV2dCAtIENhbGwgZXZlbnQuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXlsb2FkIC0gUGF5bG9hZCBhc3NvY2lhdGVkIHdpdGggdGhpcyBldmVudCAoZS5nLiBTRFAgc3RyaW5nKS5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgKGZvciBzb21lIGNhbGwgZXZlbnRzKSB3aGljaCB3aWxsXG4gICAqICAgICAgICAgICAgICAgICAgICBiZSByZXNvbHZlZC9yZWplY3RlZCBvbiByZWNlaXZpbmcgc2VydmVyIHJlcGx5XG4gICAqL1xuICB2aWRlb0NhbGwodG9waWNOYW1lLCBzZXEsIGV2dCwgcGF5bG9hZCkge1xuICAgIGNvbnN0IHBrdCA9IHRoaXMuI2luaXRQYWNrZXQoJ25vdGUnLCB0b3BpY05hbWUpO1xuICAgIHBrdC5ub3RlLnNlcSA9IHNlcTtcbiAgICBwa3Qubm90ZS53aGF0ID0gJ2NhbGwnO1xuICAgIHBrdC5ub3RlLmV2ZW50ID0gZXZ0O1xuICAgIHBrdC5ub3RlLnBheWxvYWQgPSBwYXlsb2FkO1xuICAgIHRoaXMuI3NlbmQocGt0LCBwa3Qubm90ZS5pZCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGEgbmFtZWQgdG9waWMsIGVpdGhlciBwdWxsIGl0IGZyb20gY2FjaGUgb3IgY3JlYXRlIGEgbmV3IGluc3RhbmNlLlxuICAgKiBUaGVyZSBpcyBhIHNpbmdsZSBpbnN0YW5jZSBvZiB0b3BpYyBmb3IgZWFjaCBuYW1lLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWNOYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gZ2V0LlxuICAgKlxuICAgKiBAcmV0dXJucyB7VG9waWN9IFJlcXVlc3RlZCBvciBuZXdseSBjcmVhdGVkIHRvcGljIG9yIDxjb2RlPnVuZGVmaW5lZDwvY29kZT4gaWYgdG9waWMgbmFtZSBpcyBpbnZhbGlkLlxuICAgKi9cbiAgZ2V0VG9waWModG9waWNOYW1lKSB7XG4gICAgbGV0IHRvcGljID0gdGhpcy4jY2FjaGVHZXQoJ3RvcGljJywgdG9waWNOYW1lKTtcbiAgICBpZiAoIXRvcGljICYmIHRvcGljTmFtZSkge1xuICAgICAgaWYgKHRvcGljTmFtZSA9PSBDb25zdC5UT1BJQ19NRSkge1xuICAgICAgICB0b3BpYyA9IG5ldyBUb3BpY01lKCk7XG4gICAgICB9IGVsc2UgaWYgKHRvcGljTmFtZSA9PSBDb25zdC5UT1BJQ19GTkQpIHtcbiAgICAgICAgdG9waWMgPSBuZXcgVG9waWNGbmQoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRvcGljID0gbmV3IFRvcGljKHRvcGljTmFtZSk7XG4gICAgICB9XG4gICAgICAvLyBDYWNoZSBtYW5hZ2VtZW50LlxuICAgICAgdGhpcy4jYXR0YWNoQ2FjaGVUb1RvcGljKHRvcGljKTtcbiAgICAgIHRvcGljLl9jYWNoZVB1dFNlbGYoKTtcbiAgICAgIC8vIERvbid0IHNhdmUgdG8gREIgaGVyZTogYSByZWNvcmQgd2lsbCBiZSBhZGRlZCB3aGVuIHRoZSB0b3BpYyBpcyBzdWJzY3JpYmVkLlxuICAgIH1cbiAgICByZXR1cm4gdG9waWM7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGEgbmFtZWQgdG9waWMgZnJvbSBjYWNoZS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljTmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIGdldC5cbiAgICpcbiAgICogQHJldHVybnMge1RvcGljfSBSZXF1ZXN0ZWQgdG9waWMgb3IgPGNvZGU+dW5kZWZpbmVkPC9jb2RlPiBpZiB0b3BpYyBpcyBub3QgZm91bmQgaW4gY2FjaGUuXG4gICAqL1xuICBjYWNoZUdldFRvcGljKHRvcGljTmFtZSkge1xuICAgIHJldHVybiB0aGlzLiNjYWNoZUdldCgndG9waWMnLCB0b3BpY05hbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBuYW1lZCB0b3BpYyBmcm9tIGNhY2hlLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWNOYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gcmVtb3ZlIGZyb20gY2FjaGUuXG4gICAqL1xuICBjYWNoZVJlbVRvcGljKHRvcGljTmFtZSkge1xuICAgIHRoaXMuI2NhY2hlRGVsKCd0b3BpYycsIHRvcGljTmFtZSk7XG4gIH1cblxuICAvKipcbiAgICogSXRlcmF0ZSBvdmVyIGNhY2hlZCB0b3BpY3MuXG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgLSBjYWxsYmFjayB0byBjYWxsIGZvciBlYWNoIHRvcGljLlxuICAgKiBAcGFyYW0ge09iamVjdH0gY29udGV4dCAtICd0aGlzJyBpbnNpZGUgdGhlICdmdW5jJy5cbiAgICovXG4gIG1hcFRvcGljcyhmdW5jLCBjb250ZXh0KSB7XG4gICAgdGhpcy4jY2FjaGVNYXAoJ3RvcGljJywgZnVuYywgY29udGV4dCk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgbmFtZWQgdG9waWMgaXMgYWxyZWFkeSBwcmVzZW50IGluIGNhY2hlLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWNOYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIHRvcGljIGlzIGZvdW5kIGluIGNhY2hlLCBmYWxzZSBvdGhlcndpc2UuXG4gICAqL1xuICBpc1RvcGljQ2FjaGVkKHRvcGljTmFtZSkge1xuICAgIHJldHVybiAhIXRoaXMuI2NhY2hlR2V0KCd0b3BpYycsIHRvcGljTmFtZSk7XG4gIH1cblxuICAvKipcbiAgICogR2VuZXJhdGUgdW5pcXVlIG5hbWUgbGlrZSA8Y29kZT4nbmV3MTIzNDU2JzwvY29kZT4gc3VpdGFibGUgZm9yIGNyZWF0aW5nIGEgbmV3IGdyb3VwIHRvcGljLlxuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGlzQ2hhbiAtIGlmIHRoZSB0b3BpYyBpcyBjaGFubmVsLWVuYWJsZWQuXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IG5hbWUgd2hpY2ggY2FuIGJlIHVzZWQgZm9yIGNyZWF0aW5nIGEgbmV3IGdyb3VwIHRvcGljLlxuICAgKi9cbiAgbmV3R3JvdXBUb3BpY05hbWUoaXNDaGFuKSB7XG4gICAgcmV0dXJuIChpc0NoYW4gPyBDb25zdC5UT1BJQ19ORVdfQ0hBTiA6IENvbnN0LlRPUElDX05FVykgKyB0aGlzLmdldE5leHRVbmlxdWVJZCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluc3RhbnRpYXRlIDxjb2RlPidtZSc8L2NvZGU+IHRvcGljIG9yIGdldCBpdCBmcm9tIGNhY2hlLlxuICAgKlxuICAgKiBAcmV0dXJucyB7VG9waWNNZX0gSW5zdGFuY2Ugb2YgPGNvZGU+J21lJzwvY29kZT4gdG9waWMuXG4gICAqL1xuICBnZXRNZVRvcGljKCkge1xuICAgIHJldHVybiB0aGlzLmdldFRvcGljKENvbnN0LlRPUElDX01FKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnN0YW50aWF0ZSA8Y29kZT4nZm5kJzwvY29kZT4gKGZpbmQpIHRvcGljIG9yIGdldCBpdCBmcm9tIGNhY2hlLlxuICAgKlxuICAgKiBAcmV0dXJucyB7VG9waWN9IEluc3RhbmNlIG9mIDxjb2RlPidmbmQnPC9jb2RlPiB0b3BpYy5cbiAgICovXG4gIGdldEZuZFRvcGljKCkge1xuICAgIHJldHVybiB0aGlzLmdldFRvcGljKENvbnN0LlRPUElDX0ZORCk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgbmV3IHtAbGluayBMYXJnZUZpbGVIZWxwZXJ9IGluc3RhbmNlXG4gICAqXG4gICAqIEByZXR1cm5zIHtMYXJnZUZpbGVIZWxwZXJ9IGluc3RhbmNlIG9mIGEge0BsaW5rIFRpbm9kZS5MYXJnZUZpbGVIZWxwZXJ9LlxuICAgKi9cbiAgZ2V0TGFyZ2VGaWxlSGVscGVyKCkge1xuICAgIHJldHVybiBuZXcgTGFyZ2VGaWxlSGVscGVyKHRoaXMsIENvbnN0LlBST1RPQ09MX1ZFUlNJT04pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgVUlEIG9mIHRoZSB0aGUgY3VycmVudCBhdXRoZW50aWNhdGVkIHVzZXIuXG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IFVJRCBvZiB0aGUgY3VycmVudCB1c2VyIG9yIDxjb2RlPnVuZGVmaW5lZDwvY29kZT4gaWYgdGhlIHNlc3Npb24gaXMgbm90IHlldFxuICAgKiBhdXRoZW50aWNhdGVkIG9yIGlmIHRoZXJlIGlzIG5vIHNlc3Npb24uXG4gICAqL1xuICBnZXRDdXJyZW50VXNlcklEKCkge1xuICAgIHJldHVybiB0aGlzLl9teVVJRDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgZ2l2ZW4gdXNlciBJRCBpcyBlcXVhbCB0byB0aGUgY3VycmVudCB1c2VyJ3MgVUlELlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdWlkIC0gVUlEIHRvIGNoZWNrLlxuICAgKlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGUgZ2l2ZW4gVUlEIGJlbG9uZ3MgdG8gdGhlIGN1cnJlbnQgbG9nZ2VkIGluIHVzZXIuXG4gICAqL1xuICBpc01lKHVpZCkge1xuICAgIHJldHVybiB0aGlzLl9teVVJRCA9PT0gdWlkO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBsb2dpbiB1c2VkIGZvciBsYXN0IHN1Y2Nlc3NmdWwgYXV0aGVudGljYXRpb24uXG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IGxvZ2luIGxhc3QgdXNlZCBzdWNjZXNzZnVsbHkgb3IgPGNvZGU+dW5kZWZpbmVkPC9jb2RlPi5cbiAgICovXG4gIGdldEN1cnJlbnRMb2dpbigpIHtcbiAgICByZXR1cm4gdGhpcy5fbG9naW47XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIGluZm9ybWF0aW9uIGFib3V0IHRoZSBzZXJ2ZXI6IHByb3RvY29sIHZlcnNpb24gYW5kIGJ1aWxkIHRpbWVzdGFtcC5cbiAgICpcbiAgICogQHJldHVybnMge09iamVjdH0gYnVpbGQgYW5kIHZlcnNpb24gb2YgdGhlIHNlcnZlciBvciA8Y29kZT5udWxsPC9jb2RlPiBpZiB0aGVyZSBpcyBubyBjb25uZWN0aW9uIG9yXG4gICAqIGlmIHRoZSBmaXJzdCBzZXJ2ZXIgcmVzcG9uc2UgaGFzIG5vdCBiZWVuIHJlY2VpdmVkIHlldC5cbiAgICovXG4gIGdldFNlcnZlckluZm8oKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NlcnZlckluZm87XG4gIH1cblxuICAvKipcbiAgICogUmVwb3J0IGEgdG9waWMgZm9yIGFidXNlLiBXcmFwcGVyIGZvciB7QGxpbmsgVGlub2RlI3B1Ymxpc2h9LlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gYWN0aW9uIC0gdGhlIG9ubHkgc3VwcG9ydGVkIGFjdGlvbiBpcyAncmVwb3J0Jy5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHRhcmdldCAtIG5hbWUgb2YgdGhlIHRvcGljIGJlaW5nIHJlcG9ydGVkLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBzZXJ2ZXIgcmVzcG9uZHMgdG8gcmVxdWVzdC5cbiAgICovXG4gIHJlcG9ydChhY3Rpb24sIHRhcmdldCkge1xuICAgIHJldHVybiB0aGlzLnB1Ymxpc2goQ29uc3QuVE9QSUNfU1lTLCBEcmFmdHkuYXR0YWNoSlNPTihudWxsLCB7XG4gICAgICAnYWN0aW9uJzogYWN0aW9uLFxuICAgICAgJ3RhcmdldCc6IHRhcmdldFxuICAgIH0pKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gc2VydmVyLXByb3ZpZGVkIGNvbmZpZ3VyYXRpb24gdmFsdWUuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIG9mIHRoZSB2YWx1ZSB0byByZXR1cm4uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkZWZhdWx0VmFsdWUgdG8gcmV0dXJuIGluIGNhc2UgdGhlIHBhcmFtZXRlciBpcyBub3Qgc2V0IG9yIG5vdCBmb3VuZC5cbiAgICpcbiAgICogQHJldHVybnMge09iamVjdH0gbmFtZWQgdmFsdWUuXG4gICAqL1xuICBnZXRTZXJ2ZXJQYXJhbShuYW1lLCBkZWZhdWx0VmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5fc2VydmVySW5mbyAmJiB0aGlzLl9zZXJ2ZXJJbmZvW25hbWVdIHx8IGRlZmF1bHRWYWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUb2dnbGUgY29uc29sZSBsb2dnaW5nLiBMb2dnaW5nIGlzIG9mZiBieSBkZWZhdWx0LlxuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGVuYWJsZWQgLSBTZXQgdG8gPGNvZGU+dHJ1ZTwvY29kZT4gdG8gZW5hYmxlIGxvZ2dpbmcgdG8gY29uc29sZS5cbiAgICogQHBhcmFtIHtib29sZWFufSB0cmltTG9uZ1N0cmluZ3MgLSBTZXQgdG8gPGNvZGU+dHJ1ZTwvY29kZT4gdG8gdHJpbSBsb25nIHN0cmluZ3MuXG4gICAqL1xuICBlbmFibGVMb2dnaW5nKGVuYWJsZWQsIHRyaW1Mb25nU3RyaW5ncykge1xuICAgIHRoaXMuX2xvZ2dpbmdFbmFibGVkID0gZW5hYmxlZDtcbiAgICB0aGlzLl90cmltTG9uZ1N0cmluZ3MgPSBlbmFibGVkICYmIHRyaW1Mb25nU3RyaW5ncztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgVUkgbGFuZ3VhZ2UgdG8gcmVwb3J0IHRvIHRoZSBzZXJ2ZXIuIE11c3QgYmUgY2FsbGVkIGJlZm9yZSA8Y29kZT4naGknPC9jb2RlPiBpcyBzZW50LCBvdGhlcndpc2UgaXQgd2lsbCBub3QgYmUgdXNlZC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGhsIC0gaHVtYW4gKFVJKSBsYW5ndWFnZSwgbGlrZSA8Y29kZT5cImVuX1VTXCI8L2NvZGU+IG9yIDxjb2RlPlwiemgtSGFuc1wiPC9jb2RlPi5cbiAgICovXG4gIHNldEh1bWFuTGFuZ3VhZ2UoaGwpIHtcbiAgICBpZiAoaGwpIHtcbiAgICAgIHRoaXMuX2h1bWFuTGFuZ3VhZ2UgPSBobDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgZ2l2ZW4gdG9waWMgaXMgb25saW5lLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBvZiB0aGUgdG9waWMgdG8gdGVzdC5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgdG9waWMgaXMgb25saW5lLCBmYWxzZSBvdGhlcndpc2UuXG4gICAqL1xuICBpc1RvcGljT25saW5lKG5hbWUpIHtcbiAgICBjb25zdCB0b3BpYyA9IHRoaXMuI2NhY2hlR2V0KCd0b3BpYycsIG5hbWUpO1xuICAgIHJldHVybiB0b3BpYyAmJiB0b3BpYy5vbmxpbmU7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGFjY2VzcyBtb2RlIGZvciB0aGUgZ2l2ZW4gY29udGFjdC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgb2YgdGhlIHRvcGljIHRvIHF1ZXJ5LlxuICAgKiBAcmV0dXJucyB7QWNjZXNzTW9kZX0gYWNjZXNzIG1vZGUgaWYgdG9waWMgaXMgZm91bmQsIG51bGwgb3RoZXJ3aXNlLlxuICAgKi9cbiAgZ2V0VG9waWNBY2Nlc3NNb2RlKG5hbWUpIHtcbiAgICBjb25zdCB0b3BpYyA9IHRoaXMuI2NhY2hlR2V0KCd0b3BpYycsIG5hbWUpO1xuICAgIHJldHVybiB0b3BpYyA/IHRvcGljLmFjcyA6IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogSW5jbHVkZSBtZXNzYWdlIElEIGludG8gYWxsIHN1YnNlcXVlc3QgbWVzc2FnZXMgdG8gc2VydmVyIGluc3RydWN0aW4gaXQgdG8gc2VuZCBha25vd2xlZGdlbWVucy5cbiAgICogUmVxdWlyZWQgZm9yIHByb21pc2VzIHRvIGZ1bmN0aW9uLiBEZWZhdWx0IGlzIDxjb2RlPlwib25cIjwvY29kZT4uXG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gc3RhdHVzIC0gVHVybiBha25vd2xlZGdlbWVucyBvbiBvciBvZmYuXG4gICAqIEBkZXByZWNhdGVkXG4gICAqL1xuICB3YW50QWtuKHN0YXR1cykge1xuICAgIGlmIChzdGF0dXMpIHtcbiAgICAgIHRoaXMuX21lc3NhZ2VJZCA9IE1hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkgKiAweEZGRkZGRikgKyAweEZGRkZGRik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX21lc3NhZ2VJZCA9IDA7XG4gICAgfVxuICB9XG5cbiAgLy8gQ2FsbGJhY2tzOlxuICAvKipcbiAgICogQ2FsbGJhY2sgdG8gcmVwb3J0IHdoZW4gdGhlIHdlYnNvY2tldCBpcyBvcGVuZWQuIFRoZSBjYWxsYmFjayBoYXMgbm8gcGFyYW1ldGVycy5cbiAgICpcbiAgICogQHR5cGUge29uV2Vic29ja2V0T3Blbn1cbiAgICovXG4gIG9uV2Vic29ja2V0T3BlbiA9IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQHR5cGVkZWYgU2VydmVyUGFyYW1zXG4gICAqXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB2ZXIgLSBTZXJ2ZXIgdmVyc2lvblxuICAgKiBAcHJvcGVydHkge3N0cmluZ30gYnVpbGQgLSBTZXJ2ZXIgYnVpbGRcbiAgICogQHByb3BlcnR5IHtzdHJpbmc9fSBzaWQgLSBTZXNzaW9uIElELCBsb25nIHBvbGxpbmcgY29ubmVjdGlvbnMgb25seS5cbiAgICovXG5cbiAgLyoqXG4gICAqIEBjYWxsYmFjayBvbkNvbm5lY3RcbiAgICogQHBhcmFtIHtudW1iZXJ9IGNvZGUgLSBSZXN1bHQgY29kZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGV4dCAtIFRleHQgZXB4cGxhaW5pbmcgdGhlIGNvbXBsZXRpb24sIGkuZSBcIk9LXCIgb3IgYW4gZXJyb3IgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtTZXJ2ZXJQYXJhbXN9IHBhcmFtcyAtIFBhcmFtZXRlcnMgcmV0dXJuZWQgYnkgdGhlIHNlcnZlci5cbiAgICovXG4gIC8qKlxuICAgKiBDYWxsYmFjayB0byByZXBvcnQgd2hlbiBjb25uZWN0aW9uIHdpdGggVGlub2RlIHNlcnZlciBpcyBlc3RhYmxpc2hlZC5cbiAgICogQHR5cGUge29uQ29ubmVjdH1cbiAgICovXG4gIG9uQ29ubmVjdCA9IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQ2FsbGJhY2sgdG8gcmVwb3J0IHdoZW4gY29ubmVjdGlvbiBpcyBsb3N0LiBUaGUgY2FsbGJhY2sgaGFzIG5vIHBhcmFtZXRlcnMuXG4gICAqIEB0eXBlIHtvbkRpc2Nvbm5lY3R9XG4gICAqL1xuICBvbkRpc2Nvbm5lY3QgPSB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIEBjYWxsYmFjayBvbkxvZ2luXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBjb2RlIC0gTlVtZXJpYyBjb21wbGV0aW9uIGNvZGUsIHNhbWUgYXMgSFRUUCBzdGF0dXMgY29kZXMuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IC0gRXhwbGFuYXRpb24gb2YgdGhlIGNvbXBsZXRpb24gY29kZS5cbiAgICovXG4gIC8qKlxuICAgKiBDYWxsYmFjayB0byByZXBvcnQgbG9naW4gY29tcGxldGlvbi5cbiAgICogQHR5cGUge29uTG9naW59XG4gICAqL1xuICBvbkxvZ2luID0gdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBDYWxsYmFjayB0byByZWNlaXZlIDxjb2RlPntjdHJsfTwvY29kZT4gKGNvbnRyb2wpIG1lc3NhZ2VzLlxuICAgKiBAdHlwZSB7b25DdHJsTWVzc2FnZX1cbiAgICovXG4gIG9uQ3RybE1lc3NhZ2UgPSB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIHRvIHJlY2lldmUgPGNvZGU+e2RhdGF9PC9jb2RlPiAoY29udGVudCkgbWVzc2FnZXMuXG4gICAqIEB0eXBlIHtvbkRhdGFNZXNzYWdlfVxuICAgKi9cbiAgb25EYXRhTWVzc2FnZSA9IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQ2FsbGJhY2sgdG8gcmVjZWl2ZSA8Y29kZT57cHJlc308L2NvZGU+IChwcmVzZW5jZSkgbWVzc2FnZXMuXG4gICAqIEB0eXBlIHtvblByZXNNZXNzYWdlfVxuICAgKi9cbiAgb25QcmVzTWVzc2FnZSA9IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQ2FsbGJhY2sgdG8gcmVjZWl2ZSBhbGwgbWVzc2FnZXMgYXMgb2JqZWN0cy5cbiAgICogQHR5cGUge29uTWVzc2FnZX1cbiAgICovXG4gIG9uTWVzc2FnZSA9IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQ2FsbGJhY2sgdG8gcmVjZWl2ZSBhbGwgbWVzc2FnZXMgYXMgdW5wYXJzZWQgdGV4dC5cbiAgICogQHR5cGUge29uUmF3TWVzc2FnZX1cbiAgICovXG4gIG9uUmF3TWVzc2FnZSA9IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQ2FsbGJhY2sgdG8gcmVjZWl2ZSBzZXJ2ZXIgcmVzcG9uc2VzIHRvIG5ldHdvcmsgcHJvYmVzLiBTZWUge0BsaW5rIFRpbm9kZSNuZXR3b3JrUHJvYmV9XG4gICAqIEB0eXBlIHtvbk5ldHdvcmtQcm9iZX1cbiAgICovXG4gIG9uTmV0d29ya1Byb2JlID0gdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBDYWxsYmFjayB0byBiZSBub3RpZmllZCB3aGVuIGV4cG9uZW50aWFsIGJhY2tvZmYgaXMgaXRlcmF0aW5nLlxuICAgKiBAdHlwZSB7b25BdXRvcmVjb25uZWN0SXRlcmF0aW9ufVxuICAgKi9cbiAgb25BdXRvcmVjb25uZWN0SXRlcmF0aW9uID0gdW5kZWZpbmVkO1xufTtcblxuLy8gRXhwb3J0ZWQgY29uc3RhbnRzXG5UaW5vZGUuTUVTU0FHRV9TVEFUVVNfTk9ORSA9IENvbnN0Lk1FU1NBR0VfU1RBVFVTX05PTkU7XG5UaW5vZGUuTUVTU0FHRV9TVEFUVVNfUVVFVUVEID0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfUVVFVUVEO1xuVGlub2RlLk1FU1NBR0VfU1RBVFVTX1NFTkRJTkcgPSBDb25zdC5NRVNTQUdFX1NUQVRVU19TRU5ESU5HO1xuVGlub2RlLk1FU1NBR0VfU1RBVFVTX0ZBSUxFRCA9IENvbnN0Lk1FU1NBR0VfU1RBVFVTX0ZBSUxFRDtcblRpbm9kZS5NRVNTQUdFX1NUQVRVU19TRU5UID0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfU0VOVDtcblRpbm9kZS5NRVNTQUdFX1NUQVRVU19SRUNFSVZFRCA9IENvbnN0Lk1FU1NBR0VfU1RBVFVTX1JFQ0VJVkVEO1xuVGlub2RlLk1FU1NBR0VfU1RBVFVTX1JFQUQgPSBDb25zdC5NRVNTQUdFX1NUQVRVU19SRUFEO1xuVGlub2RlLk1FU1NBR0VfU1RBVFVTX1RPX01FID0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfVE9fTUU7XG5cbi8vIFVuaWNvZGUgW2RlbF0gc3ltYm9sLlxuVGlub2RlLkRFTF9DSEFSID0gQ29uc3QuREVMX0NIQVI7XG5cbi8vIE5hbWVzIG9mIGtleXMgdG8gc2VydmVyLXByb3ZpZGVkIGNvbmZpZ3VyYXRpb24gbGltaXRzLlxuVGlub2RlLk1BWF9NRVNTQUdFX1NJWkUgPSAnbWF4TWVzc2FnZVNpemUnO1xuVGlub2RlLk1BWF9TVUJTQ1JJQkVSX0NPVU5UID0gJ21heFN1YnNjcmliZXJDb3VudCc7XG5UaW5vZGUuTUFYX1RBR19DT1VOVCA9ICdtYXhUYWdDb3VudCc7XG5UaW5vZGUuTUFYX0ZJTEVfVVBMT0FEX1NJWkUgPSAnbWF4RmlsZVVwbG9hZFNpemUnO1xuIiwiLyoqXG4gKiBAZmlsZSBUb3BpYyBtYW5hZ2VtZW50LlxuICpcbiAqIEBjb3B5cmlnaHQgMjAxNS0yMDIyIFRpbm9kZSBMTEMuXG4gKi9cbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IEFjY2Vzc01vZGUgZnJvbSAnLi9hY2Nlc3MtbW9kZS5qcyc7XG5pbXBvcnQgQ0J1ZmZlciBmcm9tICcuL2NidWZmZXIuanMnO1xuaW1wb3J0ICogYXMgQ29uc3QgZnJvbSAnLi9jb25maWcuanMnO1xuaW1wb3J0IERyYWZ0eSBmcm9tICcuL2RyYWZ0eS5qcyc7XG5pbXBvcnQgTWV0YUdldEJ1aWxkZXIgZnJvbSAnLi9tZXRhLWJ1aWxkZXIuanMnO1xuaW1wb3J0IHtcbiAgbWVyZ2VPYmosXG4gIG1lcmdlVG9DYWNoZSxcbiAgbm9ybWFsaXplQXJyYXlcbn0gZnJvbSAnLi91dGlscy5qcyc7XG5cbmV4cG9ydCBjbGFzcyBUb3BpYyB7XG4gIC8qKlxuICAgKiBAY2FsbGJhY2sgVGlub2RlLlRvcGljLm9uRGF0YVxuICAgKiBAcGFyYW0ge0RhdGF9IGRhdGEgLSBEYXRhIHBhY2tldFxuICAgKi9cbiAgLyoqXG4gICAqIFRvcGljIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIGEgbG9naWNhbCBjb21tdW5pY2F0aW9uIGNoYW5uZWwuXG4gICAqIEBjbGFzcyBUb3BpY1xuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gY3JlYXRlLlxuICAgKiBAcGFyYW0ge09iamVjdD19IGNhbGxiYWNrcyAtIE9iamVjdCB3aXRoIHZhcmlvdXMgZXZlbnQgY2FsbGJhY2tzLlxuICAgKiBAcGFyYW0ge1Rpbm9kZS5Ub3BpYy5vbkRhdGF9IGNhbGxiYWNrcy5vbkRhdGEgLSBDYWxsYmFjayB3aGljaCByZWNlaXZlcyBhIDxjb2RlPntkYXRhfTwvY29kZT4gbWVzc2FnZS5cbiAgICogQHBhcmFtIHtjYWxsYmFja30gY2FsbGJhY2tzLm9uTWV0YSAtIENhbGxiYWNrIHdoaWNoIHJlY2VpdmVzIGEgPGNvZGU+e21ldGF9PC9jb2RlPiBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge2NhbGxiYWNrfSBjYWxsYmFja3Mub25QcmVzIC0gQ2FsbGJhY2sgd2hpY2ggcmVjZWl2ZXMgYSA8Y29kZT57cHJlc308L2NvZGU+IG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7Y2FsbGJhY2t9IGNhbGxiYWNrcy5vbkluZm8gLSBDYWxsYmFjayB3aGljaCByZWNlaXZlcyBhbiA8Y29kZT57aW5mb308L2NvZGU+IG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7Y2FsbGJhY2t9IGNhbGxiYWNrcy5vbk1ldGFEZXNjIC0gQ2FsbGJhY2sgd2hpY2ggcmVjZWl2ZXMgY2hhbmdlcyB0byB0b3BpYyBkZXNjdGlvcHRpb24ge0BsaW5rIGRlc2N9LlxuICAgKiBAcGFyYW0ge2NhbGxiYWNrfSBjYWxsYmFja3Mub25NZXRhU3ViIC0gQ2FsbGVkIGZvciBhIHNpbmdsZSBzdWJzY3JpcHRpb24gcmVjb3JkIGNoYW5nZS5cbiAgICogQHBhcmFtIHtjYWxsYmFja30gY2FsbGJhY2tzLm9uU3Vic1VwZGF0ZWQgLSBDYWxsZWQgYWZ0ZXIgYSBiYXRjaCBvZiBzdWJzY3JpcHRpb24gY2hhbmdlcyBoYXZlIGJlZW4gcmVjaWV2ZWQgYW5kIGNhY2hlZC5cbiAgICogQHBhcmFtIHtjYWxsYmFja30gY2FsbGJhY2tzLm9uRGVsZXRlVG9waWMgLSBDYWxsZWQgYWZ0ZXIgdGhlIHRvcGljIGlzIGRlbGV0ZWQuXG4gICAqIEBwYXJhbSB7Y2FsbGJhY2t9IGNhbGxiYWNscy5vbkFsbE1lc3NhZ2VzUmVjZWl2ZWQgLSBDYWxsZWQgd2hlbiBhbGwgcmVxdWVzdGVkIDxjb2RlPntkYXRhfTwvY29kZT4gbWVzc2FnZXMgaGF2ZSBiZWVuIHJlY2l2ZWQuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihuYW1lLCBjYWxsYmFja3MpIHtcbiAgICAvLyBQYXJlbnQgVGlub2RlIG9iamVjdC5cbiAgICB0aGlzLl90aW5vZGUgPSBudWxsO1xuXG4gICAgLy8gU2VydmVyLXByb3ZpZGVkIGRhdGEsIGxvY2FsbHkgaW1tdXRhYmxlLlxuICAgIC8vIHRvcGljIG5hbWVcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIC8vIFRpbWVzdGFtcCB3aGVuIHRoZSB0b3BpYyB3YXMgY3JlYXRlZC5cbiAgICB0aGlzLmNyZWF0ZWQgPSBudWxsO1xuICAgIC8vIFRpbWVzdGFtcCB3aGVuIHRoZSB0b3BpYyB3YXMgbGFzdCB1cGRhdGVkLlxuICAgIHRoaXMudXBkYXRlZCA9IG51bGw7XG4gICAgLy8gVGltZXN0YW1wIG9mIHRoZSBsYXN0IG1lc3NhZ2VzXG4gICAgdGhpcy50b3VjaGVkID0gbmV3IERhdGUoMCk7XG4gICAgLy8gQWNjZXNzIG1vZGUsIHNlZSBBY2Nlc3NNb2RlXG4gICAgdGhpcy5hY3MgPSBuZXcgQWNjZXNzTW9kZShudWxsKTtcbiAgICAvLyBQZXItdG9waWMgcHJpdmF0ZSBkYXRhIChhY2Nlc3NpYmxlIGJ5IGN1cnJlbnQgdXNlciBvbmx5KS5cbiAgICB0aGlzLnByaXZhdGUgPSBudWxsO1xuICAgIC8vIFBlci10b3BpYyBwdWJsaWMgZGF0YSAoYWNjZXNzaWJsZSBieSBhbGwgdXNlcnMpLlxuICAgIHRoaXMucHVibGljID0gbnVsbDtcbiAgICAvLyBQZXItdG9waWMgc3lzdGVtLXByb3ZpZGVkIGRhdGEgKGFjY2Vzc2libGUgYnkgYWxsIHVzZXJzKS5cbiAgICB0aGlzLnRydXN0ZWQgPSBudWxsO1xuXG4gICAgLy8gTG9jYWxseSBjYWNoZWQgZGF0YVxuICAgIC8vIFN1YnNjcmliZWQgdXNlcnMsIGZvciB0cmFja2luZyByZWFkL3JlY3YvbXNnIG5vdGlmaWNhdGlvbnMuXG4gICAgdGhpcy5fdXNlcnMgPSB7fTtcblxuICAgIC8vIEN1cnJlbnQgdmFsdWUgb2YgbG9jYWxseSBpc3N1ZWQgc2VxSWQsIHVzZWQgZm9yIHBlbmRpbmcgbWVzc2FnZXMuXG4gICAgdGhpcy5fcXVldWVkU2VxSWQgPSBDb25zdC5MT0NBTF9TRVFJRDtcblxuICAgIC8vIFRoZSBtYXhpbXVtIGtub3duIHtkYXRhLnNlcX0gdmFsdWUuXG4gICAgdGhpcy5fbWF4U2VxID0gMDtcbiAgICAvLyBUaGUgbWluaW11bSBrbm93biB7ZGF0YS5zZXF9IHZhbHVlLlxuICAgIHRoaXMuX21pblNlcSA9IDA7XG4gICAgLy8gSW5kaWNhdG9yIHRoYXQgdGhlIGxhc3QgcmVxdWVzdCBmb3IgZWFybGllciBtZXNzYWdlcyByZXR1cm5lZCAwLlxuICAgIHRoaXMuX25vRWFybGllck1zZ3MgPSBmYWxzZTtcbiAgICAvLyBUaGUgbWF4aW11bSBrbm93biBkZWxldGlvbiBJRC5cbiAgICB0aGlzLl9tYXhEZWwgPSAwO1xuICAgIC8vIFRpbWVyIG9iamVjdCB1c2VkIHRvIHNlbmQgJ3JlY3YnIG5vdGlmaWNhdGlvbnMuXG4gICAgdGhpcy5fcmVjdk5vdGlmaWNhdGlvblRpbWVyID0gbnVsbDtcblxuICAgIC8vIFVzZXIgZGlzY292ZXJ5IHRhZ3NcbiAgICB0aGlzLl90YWdzID0gW107XG4gICAgLy8gQ3JlZGVudGlhbHMgc3VjaCBhcyBlbWFpbCBvciBwaG9uZSBudW1iZXIuXG4gICAgdGhpcy5fY3JlZGVudGlhbHMgPSBbXTtcbiAgICAvLyBNZXNzYWdlIHZlcnNpb25zIGNhY2hlIChlLmcuIGZvciBlZGl0ZWQgbWVzc2FnZXMpLlxuICAgIC8vIEtleXM6IG9yaWdpbmFsIG1lc3NhZ2Ugc2VxIElELlxuICAgIC8vIFZhbHVlczogQ0J1ZmZlcnMgY29udGFpbmluZyBuZXdlciB2ZXJzaW9ucyBvZiB0aGUgb3JpZ2luYWwgbWVzc2FnZVxuICAgIC8vIG9yZGVyZWQgYnkgc2VxIGlkLlxuICAgIHRoaXMuX21lc3NhZ2VWZXJzaW9ucyA9IHt9O1xuICAgIC8vIE1lc3NhZ2UgY2FjaGUsIHNvcnRlZCBieSBtZXNzYWdlIHNlcSB2YWx1ZXMsIGZyb20gb2xkIHRvIG5ldy5cbiAgICB0aGlzLl9tZXNzYWdlcyA9IG5ldyBDQnVmZmVyKChhLCBiKSA9PiB7XG4gICAgICByZXR1cm4gYS5zZXEgLSBiLnNlcTtcbiAgICB9LCB0cnVlKTtcbiAgICAvLyBCb29sZWFuLCB0cnVlIGlmIHRoZSB0b3BpYyBpcyBjdXJyZW50bHkgbGl2ZVxuICAgIHRoaXMuX2F0dGFjaGVkID0gZmFsc2U7XG4gICAgLy8gVGltZXN0YXAgb2YgdGhlIG1vc3QgcmVjZW50bHkgdXBkYXRlZCBzdWJzY3JpcHRpb24uXG4gICAgdGhpcy5fbGFzdFN1YnNVcGRhdGUgPSBuZXcgRGF0ZSgwKTtcbiAgICAvLyBUb3BpYyBjcmVhdGVkIGJ1dCBub3QgeWV0IHN5bmNlZCB3aXRoIHRoZSBzZXJ2ZXIuIFVzZWQgb25seSBkdXJpbmcgaW5pdGlhbGl6YXRpb24uXG4gICAgdGhpcy5fbmV3ID0gdHJ1ZTtcbiAgICAvLyBUaGUgdG9waWMgaXMgZGVsZXRlZCBhdCB0aGUgc2VydmVyLCB0aGlzIGlzIGEgbG9jYWwgY29weS5cbiAgICB0aGlzLl9kZWxldGVkID0gZmFsc2U7XG5cbiAgICAvLyBUaW1lciB1c2VkIHRvIHRyZ2dlciB7bGVhdmV9IHJlcXVlc3QgYWZ0ZXIgYSBkZWxheS5cbiAgICB0aGlzLl9kZWxheWVkTGVhdmVUaW1lciA9IG51bGw7XG5cbiAgICAvLyBDYWxsYmFja3NcbiAgICBpZiAoY2FsbGJhY2tzKSB7XG4gICAgICB0aGlzLm9uRGF0YSA9IGNhbGxiYWNrcy5vbkRhdGE7XG4gICAgICB0aGlzLm9uTWV0YSA9IGNhbGxiYWNrcy5vbk1ldGE7XG4gICAgICB0aGlzLm9uUHJlcyA9IGNhbGxiYWNrcy5vblByZXM7XG4gICAgICB0aGlzLm9uSW5mbyA9IGNhbGxiYWNrcy5vbkluZm87XG4gICAgICAvLyBBIHNpbmdsZSBkZXNjIHVwZGF0ZTtcbiAgICAgIHRoaXMub25NZXRhRGVzYyA9IGNhbGxiYWNrcy5vbk1ldGFEZXNjO1xuICAgICAgLy8gQSBzaW5nbGUgc3Vic2NyaXB0aW9uIHJlY29yZDtcbiAgICAgIHRoaXMub25NZXRhU3ViID0gY2FsbGJhY2tzLm9uTWV0YVN1YjtcbiAgICAgIC8vIEFsbCBzdWJzY3JpcHRpb24gcmVjb3JkcyByZWNlaXZlZDtcbiAgICAgIHRoaXMub25TdWJzVXBkYXRlZCA9IGNhbGxiYWNrcy5vblN1YnNVcGRhdGVkO1xuICAgICAgdGhpcy5vblRhZ3NVcGRhdGVkID0gY2FsbGJhY2tzLm9uVGFnc1VwZGF0ZWQ7XG4gICAgICB0aGlzLm9uQ3JlZHNVcGRhdGVkID0gY2FsbGJhY2tzLm9uQ3JlZHNVcGRhdGVkO1xuICAgICAgdGhpcy5vbkRlbGV0ZVRvcGljID0gY2FsbGJhY2tzLm9uRGVsZXRlVG9waWM7XG4gICAgICB0aGlzLm9uQWxsTWVzc2FnZXNSZWNlaXZlZCA9IGNhbGxiYWNrcy5vbkFsbE1lc3NhZ2VzUmVjZWl2ZWQ7XG4gICAgfVxuICB9XG5cbiAgLy8gU3RhdGljIG1ldGhvZHMuXG5cbiAgLyoqXG4gICAqIERldGVybWluZSB0b3BpYyB0eXBlIGZyb20gdG9waWMncyBuYW1lOiBncnAsIHAycCwgbWUsIGZuZCwgc3lzLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gdGVzdC5cbiAgICogQHJldHVybnMge3N0cmluZ30gT25lIG9mIDxjb2RlPlwibWVcIjwvY29kZT4sIDxjb2RlPlwiZm5kXCI8L2NvZGU+LCA8Y29kZT5cInN5c1wiPC9jb2RlPiwgPGNvZGU+XCJncnBcIjwvY29kZT4sXG4gICAqICAgIDxjb2RlPlwicDJwXCI8L2NvZGU+IG9yIDxjb2RlPnVuZGVmaW5lZDwvY29kZT4uXG4gICAqL1xuICBzdGF0aWMgdG9waWNUeXBlKG5hbWUpIHtcbiAgICBjb25zdCB0eXBlcyA9IHtcbiAgICAgICdtZSc6IENvbnN0LlRPUElDX01FLFxuICAgICAgJ2ZuZCc6IENvbnN0LlRPUElDX0ZORCxcbiAgICAgICdncnAnOiBDb25zdC5UT1BJQ19HUlAsXG4gICAgICAnbmV3JzogQ29uc3QuVE9QSUNfR1JQLFxuICAgICAgJ25jaCc6IENvbnN0LlRPUElDX0dSUCxcbiAgICAgICdjaG4nOiBDb25zdC5UT1BJQ19HUlAsXG4gICAgICAndXNyJzogQ29uc3QuVE9QSUNfUDJQLFxuICAgICAgJ3N5cyc6IENvbnN0LlRPUElDX1NZU1xuICAgIH07XG4gICAgcmV0dXJuIHR5cGVzWyh0eXBlb2YgbmFtZSA9PSAnc3RyaW5nJykgPyBuYW1lLnN1YnN0cmluZygwLCAzKSA6ICd4eHgnXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgZ2l2ZW4gdG9waWMgbmFtZSBpcyBhIG5hbWUgb2YgYSAnbWUnIHRvcGljLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gdGVzdC5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIHRoZSBuYW1lIGlzIGEgbmFtZSBvZiBhICdtZScgdG9waWMsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBzdGF0aWMgaXNNZVRvcGljTmFtZShuYW1lKSB7XG4gICAgcmV0dXJuIFRvcGljLnRvcGljVHlwZShuYW1lKSA9PSBDb25zdC5UT1BJQ19NRTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgZ2l2ZW4gdG9waWMgbmFtZSBpcyBhIG5hbWUgb2YgYSBncm91cCB0b3BpYy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIHRlc3QuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0aGUgbmFtZSBpcyBhIG5hbWUgb2YgYSBncm91cCB0b3BpYywgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIHN0YXRpYyBpc0dyb3VwVG9waWNOYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gVG9waWMudG9waWNUeXBlKG5hbWUpID09IENvbnN0LlRPUElDX0dSUDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgZ2l2ZW4gdG9waWMgbmFtZSBpcyBhIG5hbWUgb2YgYSBwMnAgdG9waWMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byB0ZXN0LlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgdGhlIG5hbWUgaXMgYSBuYW1lIG9mIGEgcDJwIHRvcGljLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgc3RhdGljIGlzUDJQVG9waWNOYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gVG9waWMudG9waWNUeXBlKG5hbWUpID09IENvbnN0LlRPUElDX1AyUDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgZ2l2ZW4gdG9waWMgbmFtZSBpcyBhIG5hbWUgb2YgYSBjb21tdW5pY2F0aW9uIHRvcGljLCBpLmUuIFAyUCBvciBncm91cC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIHRlc3QuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0aGUgbmFtZSBpcyBhIG5hbWUgb2YgYSBwMnAgb3IgZ3JvdXAgdG9waWMsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBzdGF0aWMgaXNDb21tVG9waWNOYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gVG9waWMuaXNQMlBUb3BpY05hbWUobmFtZSkgfHwgVG9waWMuaXNHcm91cFRvcGljTmFtZShuYW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgdG9waWMgbmFtZSBpcyBhIG5hbWUgb2YgYSBuZXcgdG9waWMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSB0b3BpYyBuYW1lIHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgdGhlIG5hbWUgaXMgYSBuYW1lIG9mIGEgbmV3IHRvcGljLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgc3RhdGljIGlzTmV3R3JvdXBUb3BpY05hbWUobmFtZSkge1xuICAgIHJldHVybiAodHlwZW9mIG5hbWUgPT0gJ3N0cmluZycpICYmXG4gICAgICAobmFtZS5zdWJzdHJpbmcoMCwgMykgPT0gQ29uc3QuVE9QSUNfTkVXIHx8IG5hbWUuc3Vic3RyaW5nKDAsIDMpID09IENvbnN0LlRPUElDX05FV19DSEFOKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgdG9waWMgbmFtZSBpcyBhIG5hbWUgb2YgYSBjaGFubmVsLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gdG9waWMgbmFtZSB0byBjaGVjay5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIHRoZSBuYW1lIGlzIGEgbmFtZSBvZiBhIGNoYW5uZWwsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBzdGF0aWMgaXNDaGFubmVsVG9waWNOYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gKHR5cGVvZiBuYW1lID09ICdzdHJpbmcnKSAmJlxuICAgICAgKG5hbWUuc3Vic3RyaW5nKDAsIDMpID09IENvbnN0LlRPUElDX0NIQU4gfHwgbmFtZS5zdWJzdHJpbmcoMCwgMykgPT0gQ29uc3QuVE9QSUNfTkVXX0NIQU4pO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSB0b3BpYyBpcyBzdWJzY3JpYmVkLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpcyB0b3BpYyBpcyBhdHRhY2hlZC9zdWJzY3JpYmVkLCBmYWxzZSBvdGhlcndpc2UuXG4gICAqL1xuICBpc1N1YnNjcmliZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2F0dGFjaGVkO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcXVlc3QgdG9waWMgdG8gc3Vic2NyaWJlLiBXcmFwcGVyIGZvciB7QGxpbmsgVGlub2RlI3N1YnNjcmliZX0uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7VGlub2RlLkdldFF1ZXJ5PX0gZ2V0UGFyYW1zIC0gZ2V0IHF1ZXJ5IHBhcmFtZXRlcnMuXG4gICAqIEBwYXJhbSB7VGlub2RlLlNldFBhcmFtcz19IHNldFBhcmFtcyAtIHNldCBwYXJhbWV0ZXJzLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBzZXJ2ZXIgcmVzcG9uZHMgdG8gdGhlIHJlcXVlc3QuXG4gICAqL1xuICBzdWJzY3JpYmUoZ2V0UGFyYW1zLCBzZXRQYXJhbXMpIHtcbiAgICAvLyBDbGVhciByZXF1ZXN0IHRvIGxlYXZlIHRvcGljLlxuICAgIGNsZWFyVGltZW91dCh0aGlzLl9kZWxheWVkTGVhdmVUaW1lcik7XG4gICAgdGhpcy5fZGVsYXllZExlYXZlVGltZXIgPSBudWxsO1xuXG4gICAgLy8gSWYgdGhlIHRvcGljIGlzIGFscmVhZHkgc3Vic2NyaWJlZCwgcmV0dXJuIHJlc29sdmVkIHByb21pc2VcbiAgICBpZiAodGhpcy5fYXR0YWNoZWQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcyk7XG4gICAgfVxuXG4gICAgLy8gSWYgdGhlIHRvcGljIGlzIGRlbGV0ZWQsIHJlamVjdCBzdWJzY3JpcHRpb24gcmVxdWVzdHMuXG4gICAgaWYgKHRoaXMuX2RlbGV0ZWQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJDb252ZXJzYXRpb24gZGVsZXRlZFwiKSk7XG4gICAgfVxuXG4gICAgLy8gU2VuZCBzdWJzY3JpYmUgbWVzc2FnZSwgaGFuZGxlIGFzeW5jIHJlc3BvbnNlLlxuICAgIC8vIElmIHRvcGljIG5hbWUgaXMgZXhwbGljaXRseSBwcm92aWRlZCwgdXNlIGl0LiBJZiBubyBuYW1lLCB0aGVuIGl0J3MgYSBuZXcgZ3JvdXAgdG9waWMsXG4gICAgLy8gdXNlIFwibmV3XCIuXG4gICAgcmV0dXJuIHRoaXMuX3Rpbm9kZS5zdWJzY3JpYmUodGhpcy5uYW1lIHx8IENvbnN0LlRPUElDX05FVywgZ2V0UGFyYW1zLCBzZXRQYXJhbXMpLnRoZW4oY3RybCA9PiB7XG4gICAgICBpZiAoY3RybC5jb2RlID49IDMwMCkge1xuICAgICAgICAvLyBEbyBub3RoaW5nIGlmIHN1YnNjcmlwdGlvbiBzdGF0dXMgaGFzIG5vdCBjaGFuZ2VkLlxuICAgICAgICByZXR1cm4gY3RybDtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fYXR0YWNoZWQgPSB0cnVlO1xuICAgICAgdGhpcy5fZGVsZXRlZCA9IGZhbHNlO1xuICAgICAgdGhpcy5hY3MgPSAoY3RybC5wYXJhbXMgJiYgY3RybC5wYXJhbXMuYWNzKSA/IGN0cmwucGFyYW1zLmFjcyA6IHRoaXMuYWNzO1xuXG4gICAgICAvLyBTZXQgdG9waWMgbmFtZSBmb3IgbmV3IHRvcGljcyBhbmQgYWRkIGl0IHRvIGNhY2hlLlxuICAgICAgaWYgKHRoaXMuX25ldykge1xuICAgICAgICBkZWxldGUgdGhpcy5fbmV3O1xuXG4gICAgICAgIGlmICh0aGlzLm5hbWUgIT0gY3RybC50b3BpYykge1xuICAgICAgICAgIC8vIE5hbWUgbWF5IGNoYW5nZSBuZXcxMjM0NTYgLT4gZ3JwQWJDZEVmLiBSZW1vdmUgZnJvbSBjYWNoZSB1bmRlciB0aGUgb2xkIG5hbWUuXG4gICAgICAgICAgdGhpcy5fY2FjaGVEZWxTZWxmKCk7XG4gICAgICAgICAgdGhpcy5uYW1lID0gY3RybC50b3BpYztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9jYWNoZVB1dFNlbGYoKTtcblxuICAgICAgICB0aGlzLmNyZWF0ZWQgPSBjdHJsLnRzO1xuICAgICAgICB0aGlzLnVwZGF0ZWQgPSBjdHJsLnRzO1xuXG4gICAgICAgIGlmICh0aGlzLm5hbWUgIT0gQ29uc3QuVE9QSUNfTUUgJiYgdGhpcy5uYW1lICE9IENvbnN0LlRPUElDX0ZORCkge1xuICAgICAgICAgIC8vIEFkZCB0aGUgbmV3IHRvcGljIHRvIHRoZSBsaXN0IG9mIGNvbnRhY3RzIG1haW50YWluZWQgYnkgdGhlICdtZScgdG9waWMuXG4gICAgICAgICAgY29uc3QgbWUgPSB0aGlzLl90aW5vZGUuZ2V0TWVUb3BpYygpO1xuICAgICAgICAgIGlmIChtZS5vbk1ldGFTdWIpIHtcbiAgICAgICAgICAgIG1lLm9uTWV0YVN1Yih0aGlzKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKG1lLm9uU3Vic1VwZGF0ZWQpIHtcbiAgICAgICAgICAgIG1lLm9uU3Vic1VwZGF0ZWQoW3RoaXMubmFtZV0sIDEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzZXRQYXJhbXMgJiYgc2V0UGFyYW1zLmRlc2MpIHtcbiAgICAgICAgICBzZXRQYXJhbXMuZGVzYy5fbm9Gb3J3YXJkaW5nID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLl9wcm9jZXNzTWV0YURlc2Moc2V0UGFyYW1zLmRlc2MpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gY3RybDtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBkcmFmdCBvZiBhIG1lc3NhZ2Ugd2l0aG91dCBzZW5kaW5nIGl0IHRvIHRoZSBzZXJ2ZXIuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nIHwgT2JqZWN0fSBkYXRhIC0gQ29udGVudCB0byB3cmFwIGluIGEgZHJhZnQuXG4gICAqIEBwYXJhbSB7Ym9vbGVhbj19IG5vRWNobyAtIElmIDxjb2RlPnRydWU8L2NvZGU+IHNlcnZlciB3aWxsIG5vdCBlY2hvIG1lc3NhZ2UgYmFjayB0byBvcmlnaW5hdGluZ1xuICAgKiBzZXNzaW9uLiBPdGhlcndpc2UgdGhlIHNlcnZlciB3aWxsIHNlbmQgYSBjb3B5IG9mIHRoZSBtZXNzYWdlIHRvIHNlbmRlci5cbiAgICpcbiAgICogQHJldHVybnMge09iamVjdH0gbWVzc2FnZSBkcmFmdC5cbiAgICovXG4gIGNyZWF0ZU1lc3NhZ2UoZGF0YSwgbm9FY2hvKSB7XG4gICAgcmV0dXJuIHRoaXMuX3Rpbm9kZS5jcmVhdGVNZXNzYWdlKHRoaXMubmFtZSwgZGF0YSwgbm9FY2hvKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbW1lZGlhdGVseSBwdWJsaXNoIGRhdGEgdG8gdG9waWMuIFdyYXBwZXIgZm9yIHtAbGluayBUaW5vZGUjcHVibGlzaH0uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nIHwgT2JqZWN0fSBkYXRhIC0gTWVzc2FnZSB0byBwdWJsaXNoLCBlaXRoZXIgcGxhaW4gc3RyaW5nIG9yIGEgRHJhZnR5IG9iamVjdC5cbiAgICogQHBhcmFtIHtib29sZWFuPX0gbm9FY2hvIC0gSWYgPGNvZGU+dHJ1ZTwvY29kZT4gc2VydmVyIHdpbGwgbm90IGVjaG8gbWVzc2FnZSBiYWNrIHRvIG9yaWdpbmF0aW5nXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHRvIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIHNlcnZlciByZXNwb25kcyB0byB0aGUgcmVxdWVzdC5cbiAgICovXG4gIHB1Ymxpc2goZGF0YSwgbm9FY2hvKSB7XG4gICAgcmV0dXJuIHRoaXMucHVibGlzaE1lc3NhZ2UodGhpcy5jcmVhdGVNZXNzYWdlKGRhdGEsIG5vRWNobykpO1xuICB9XG5cbiAgLyoqXG4gICAqIFB1Ymxpc2ggbWVzc2FnZSBjcmVhdGVkIGJ5IHtAbGluayBUaW5vZGUuVG9waWMjY3JlYXRlTWVzc2FnZX0uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwdWIgLSB7ZGF0YX0gb2JqZWN0IHRvIHB1Ymxpc2guIE11c3QgYmUgY3JlYXRlZCBieSB7QGxpbmsgVGlub2RlLlRvcGljI2NyZWF0ZU1lc3NhZ2V9XG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHRvIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIHNlcnZlciByZXNwb25kcyB0byB0aGUgcmVxdWVzdC5cbiAgICovXG4gIHB1Ymxpc2hNZXNzYWdlKHB1Yikge1xuICAgIGlmICghdGhpcy5fYXR0YWNoZWQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJDYW5ub3QgcHVibGlzaCBvbiBpbmFjdGl2ZSB0b3BpY1wiKSk7XG4gICAgfVxuICAgIGlmICh0aGlzLl9zZW5kaW5nKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiVGhlIG1lc3NhZ2UgaXMgYWxyZWFkeSBiZWluZyBzZW50XCIpKTtcbiAgICB9XG5cbiAgICAvLyBTZW5kIGRhdGEuXG4gICAgcHViLl9zZW5kaW5nID0gdHJ1ZTtcbiAgICBwdWIuX2ZhaWxlZCA9IGZhbHNlO1xuXG4gICAgLy8gRXh0cmFjdCByZWZlcmVjZXMgdG8gYXR0YWNobWVudHMgYW5kIG91dCBvZiBiYW5kIGltYWdlIHJlY29yZHMuXG4gICAgbGV0IGF0dGFjaG1lbnRzID0gbnVsbDtcbiAgICBpZiAoRHJhZnR5Lmhhc0VudGl0aWVzKHB1Yi5jb250ZW50KSkge1xuICAgICAgYXR0YWNobWVudHMgPSBbXTtcbiAgICAgIERyYWZ0eS5lbnRpdGllcyhwdWIuY29udGVudCwgZGF0YSA9PiB7XG4gICAgICAgIGlmIChkYXRhICYmIGRhdGEucmVmKSB7XG4gICAgICAgICAgYXR0YWNobWVudHMucHVzaChkYXRhLnJlZik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgaWYgKGF0dGFjaG1lbnRzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgIGF0dGFjaG1lbnRzID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fdGlub2RlLnB1Ymxpc2hNZXNzYWdlKHB1YiwgYXR0YWNobWVudHMpLnRoZW4oY3RybCA9PiB7XG4gICAgICBwdWIuX3NlbmRpbmcgPSBmYWxzZTtcbiAgICAgIHB1Yi50cyA9IGN0cmwudHM7XG4gICAgICB0aGlzLnN3YXBNZXNzYWdlSWQocHViLCBjdHJsLnBhcmFtcy5zZXEpO1xuICAgICAgdGhpcy5fbWF5YmVVcGRhdGVNZXNzYWdlVmVyc2lvbnNDYWNoZShwdWIpO1xuICAgICAgdGhpcy5fcm91dGVEYXRhKHB1Yik7XG4gICAgICByZXR1cm4gY3RybDtcbiAgICB9KS5jYXRjaChlcnIgPT4ge1xuICAgICAgdGhpcy5fdGlub2RlLmxvZ2dlcihcIldBUk5JTkc6IE1lc3NhZ2UgcmVqZWN0ZWQgYnkgdGhlIHNlcnZlclwiLCBlcnIpO1xuICAgICAgcHViLl9zZW5kaW5nID0gZmFsc2U7XG4gICAgICBwdWIuX2ZhaWxlZCA9IHRydWU7XG4gICAgICBpZiAodGhpcy5vbkRhdGEpIHtcbiAgICAgICAgdGhpcy5vbkRhdGEoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgbWVzc2FnZSB0byBsb2NhbCBtZXNzYWdlIGNhY2hlLCBzZW5kIHRvIHRoZSBzZXJ2ZXIgd2hlbiB0aGUgcHJvbWlzZSBpcyByZXNvbHZlZC5cbiAgICogSWYgcHJvbWlzZSBpcyBudWxsIG9yIHVuZGVmaW5lZCwgdGhlIG1lc3NhZ2Ugd2lsbCBiZSBzZW50IGltbWVkaWF0ZWx5LlxuICAgKiBUaGUgbWVzc2FnZSBpcyBzZW50IHdoZW4gdGhlXG4gICAqIFRoZSBtZXNzYWdlIHNob3VsZCBiZSBjcmVhdGVkIGJ5IHtAbGluayBUaW5vZGUuVG9waWMjY3JlYXRlTWVzc2FnZX0uXG4gICAqIFRoaXMgaXMgcHJvYmFibHkgbm90IHRoZSBmaW5hbCBBUEkuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwdWIgLSBNZXNzYWdlIHRvIHVzZSBhcyBhIGRyYWZ0LlxuICAgKiBAcGFyYW0ge1Byb21pc2V9IHByb20gLSBNZXNzYWdlIHdpbGwgYmUgc2VudCB3aGVuIHRoaXMgcHJvbWlzZSBpcyByZXNvbHZlZCwgZGlzY2FyZGVkIGlmIHJlamVjdGVkLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gZGVyaXZlZCBwcm9taXNlLlxuICAgKi9cbiAgcHVibGlzaERyYWZ0KHB1YiwgcHJvbSkge1xuICAgIGNvbnN0IHNlcSA9IHB1Yi5zZXEgfHwgdGhpcy5fZ2V0UXVldWVkU2VxSWQoKTtcbiAgICBpZiAoIXB1Yi5fbm9Gb3J3YXJkaW5nKSB7XG4gICAgICAvLyBUaGUgJ3NlcScsICd0cycsIGFuZCAnZnJvbScgYXJlIGFkZGVkIHRvIG1pbWljIHtkYXRhfS4gVGhleSBhcmUgcmVtb3ZlZCBsYXRlclxuICAgICAgLy8gYmVmb3JlIHRoZSBtZXNzYWdlIGlzIHNlbnQuXG4gICAgICBwdWIuX25vRm9yd2FyZGluZyA9IHRydWU7XG4gICAgICBwdWIuc2VxID0gc2VxO1xuICAgICAgcHViLnRzID0gbmV3IERhdGUoKTtcbiAgICAgIHB1Yi5mcm9tID0gdGhpcy5fdGlub2RlLmdldEN1cnJlbnRVc2VySUQoKTtcblxuICAgICAgLy8gRG9uJ3QgbmVlZCBhbiBlY2hvIG1lc3NhZ2UgYmVjYXVzZSB0aGUgbWVzc2FnZSBpcyBhZGRlZCB0byBsb2NhbCBjYWNoZSByaWdodCBhd2F5LlxuICAgICAgcHViLm5vZWNobyA9IHRydWU7XG4gICAgICAvLyBBZGQgdG8gY2FjaGUuXG4gICAgICB0aGlzLl9tZXNzYWdlcy5wdXQocHViKTtcbiAgICAgIHRoaXMuX3Rpbm9kZS5fZGIuYWRkTWVzc2FnZShwdWIpO1xuXG4gICAgICBpZiAodGhpcy5vbkRhdGEpIHtcbiAgICAgICAgdGhpcy5vbkRhdGEocHViKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gSWYgcHJvbWlzZSBpcyBwcm92aWRlZCwgc2VuZCB0aGUgcXVldWVkIG1lc3NhZ2Ugd2hlbiBpdCdzIHJlc29sdmVkLlxuICAgIC8vIElmIG5vIHByb21pc2UgaXMgcHJvdmlkZWQsIGNyZWF0ZSBhIHJlc29sdmVkIG9uZSBhbmQgc2VuZCBpbW1lZGlhdGVseS5cbiAgICByZXR1cm4gKHByb20gfHwgUHJvbWlzZS5yZXNvbHZlKCkpXG4gICAgICAudGhlbihfID0+IHtcbiAgICAgICAgaWYgKHB1Yi5fY2FuY2VsbGVkKSB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNvZGU6IDMwMCxcbiAgICAgICAgICAgIHRleHQ6IFwiY2FuY2VsbGVkXCJcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnB1Ymxpc2hNZXNzYWdlKHB1Yik7XG4gICAgICB9KS5jYXRjaChlcnIgPT4ge1xuICAgICAgICB0aGlzLl90aW5vZGUubG9nZ2VyKFwiV0FSTklORzogTWVzc2FnZSBkcmFmdCByZWplY3RlZFwiLCBlcnIpO1xuICAgICAgICBwdWIuX3NlbmRpbmcgPSBmYWxzZTtcbiAgICAgICAgcHViLl9mYWlsZWQgPSB0cnVlO1xuICAgICAgICBpZiAodGhpcy5vbkRhdGEpIHtcbiAgICAgICAgICB0aGlzLm9uRGF0YSgpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFJldGhyb3cgdG8gbGV0IGNhbGxlciBrbm93IHRoYXQgdGhlIG9wZXJhdGlvbiBmYWlsZWQuXG4gICAgICAgIHRocm93IGVycjtcbiAgICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIExlYXZlIHRoZSB0b3BpYywgb3B0aW9uYWxseSB1bnNpYnNjcmliZS4gTGVhdmluZyB0aGUgdG9waWMgbWVhbnMgdGhlIHRvcGljIHdpbGwgc3RvcFxuICAgKiByZWNlaXZpbmcgdXBkYXRlcyBmcm9tIHRoZSBzZXJ2ZXIuIFVuc3Vic2NyaWJpbmcgd2lsbCB0ZXJtaW5hdGUgdXNlcidzIHJlbGF0aW9uc2hpcCB3aXRoIHRoZSB0b3BpYy5cbiAgICogV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNsZWF2ZX0uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbj19IHVuc3ViIC0gSWYgdHJ1ZSwgdW5zdWJzY3JpYmUsIG90aGVyd2lzZSBqdXN0IGxlYXZlLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBzZXJ2ZXIgcmVzcG9uZHMgdG8gdGhlIHJlcXVlc3QuXG4gICAqL1xuICBsZWF2ZSh1bnN1Yikge1xuICAgIC8vIEl0J3MgcG9zc2libGUgdG8gdW5zdWJzY3JpYmUgKHVuc3ViPT10cnVlKSBmcm9tIGluYWN0aXZlIHRvcGljLlxuICAgIGlmICghdGhpcy5fYXR0YWNoZWQgJiYgIXVuc3ViKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiQ2Fubm90IGxlYXZlIGluYWN0aXZlIHRvcGljXCIpKTtcbiAgICB9XG5cbiAgICAvLyBTZW5kIGEgJ2xlYXZlJyBtZXNzYWdlLCBoYW5kbGUgYXN5bmMgcmVzcG9uc2VcbiAgICByZXR1cm4gdGhpcy5fdGlub2RlLmxlYXZlKHRoaXMubmFtZSwgdW5zdWIpLnRoZW4oY3RybCA9PiB7XG4gICAgICB0aGlzLl9yZXNldFN1YigpO1xuICAgICAgaWYgKHVuc3ViKSB7XG4gICAgICAgIHRoaXMuX2dvbmUoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjdHJsO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIExlYXZlIHRoZSB0b3BpYywgb3B0aW9uYWxseSB1bnNpYnNjcmliZSBhZnRlciBhIGRlbGF5LiBMZWF2aW5nIHRoZSB0b3BpYyBtZWFucyB0aGUgdG9waWMgd2lsbCBzdG9wXG4gICAqIHJlY2VpdmluZyB1cGRhdGVzIGZyb20gdGhlIHNlcnZlci4gVW5zdWJzY3JpYmluZyB3aWxsIHRlcm1pbmF0ZSB1c2VyJ3MgcmVsYXRpb25zaGlwIHdpdGggdGhlIHRvcGljLlxuICAgKiBXcmFwcGVyIGZvciB7QGxpbmsgVGlub2RlI2xlYXZlfS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSB1bnN1YiAtIElmIHRydWUsIHVuc3Vic2NyaWJlLCBvdGhlcndpc2UganVzdCBsZWF2ZS5cbiAgICogQHBhcmFtIHtudW1iZXJ9IGRlbGF5IC0gdGltZSBpbiBtaWxsaXNlY29uZHMgdG8gZGVsYXkgbGVhdmUgcmVxdWVzdC5cbiAgICovXG4gIGxlYXZlRGVsYXllZCh1bnN1YiwgZGVsYXkpIHtcbiAgICBjbGVhclRpbWVvdXQodGhpcy5fZGVsYXllZExlYXZlVGltZXIpO1xuICAgIHRoaXMuX2RlbGF5ZWRMZWF2ZVRpbWVyID0gc2V0VGltZW91dChfID0+IHtcbiAgICAgIHRoaXMuX2RlbGF5ZWRMZWF2ZVRpbWVyID0gbnVsbDtcbiAgICAgIHRoaXMubGVhdmUodW5zdWIpXG4gICAgfSwgZGVsYXkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcXVlc3QgdG9waWMgbWV0YWRhdGEgZnJvbSB0aGUgc2VydmVyLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge1Rpbm9kZS5HZXRRdWVyeX0gcmVxdWVzdCBwYXJhbWV0ZXJzXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHRvIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIHNlcnZlciByZXNwb25kcyB0byByZXF1ZXN0LlxuICAgKi9cbiAgZ2V0TWV0YShwYXJhbXMpIHtcbiAgICAvLyBTZW5kIHtnZXR9IG1lc3NhZ2UsIHJldHVybiBwcm9taXNlLlxuICAgIHJldHVybiB0aGlzLl90aW5vZGUuZ2V0TWV0YSh0aGlzLm5hbWUsIHBhcmFtcyk7XG4gIH1cblxuICAvKipcbiAgICogUmVxdWVzdCBtb3JlIG1lc3NhZ2VzIGZyb20gdGhlIHNlcnZlclxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gbGltaXQgbnVtYmVyIG9mIG1lc3NhZ2VzIHRvIGdldC5cbiAgICogQHBhcmFtIHtib29sZWFufSBmb3J3YXJkIGlmIHRydWUsIHJlcXVlc3QgbmV3ZXIgbWVzc2FnZXMuXG4gICAqL1xuICBnZXRNZXNzYWdlc1BhZ2UobGltaXQsIGZvcndhcmQpIHtcbiAgICBsZXQgcXVlcnkgPSBmb3J3YXJkID9cbiAgICAgIHRoaXMuc3RhcnRNZXRhUXVlcnkoKS53aXRoTGF0ZXJEYXRhKGxpbWl0KSA6XG4gICAgICB0aGlzLnN0YXJ0TWV0YVF1ZXJ5KCkud2l0aEVhcmxpZXJEYXRhKGxpbWl0KTtcblxuICAgIC8vIEZpcnN0IHRyeSBmZXRjaGluZyBmcm9tIERCLCB0aGVuIGZyb20gdGhlIHNlcnZlci5cbiAgICByZXR1cm4gdGhpcy5fbG9hZE1lc3NhZ2VzKHRoaXMuX3Rpbm9kZS5fZGIsIHF1ZXJ5LmV4dHJhY3QoJ2RhdGEnKSlcbiAgICAgIC50aGVuKChjb3VudCkgPT4ge1xuICAgICAgICBpZiAoY291bnQgPT0gbGltaXQpIHtcbiAgICAgICAgICAvLyBHb3QgZW5vdWdoIG1lc3NhZ2VzIGZyb20gbG9jYWwgY2FjaGUuXG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7XG4gICAgICAgICAgICB0b3BpYzogdGhpcy5uYW1lLFxuICAgICAgICAgICAgY29kZTogMjAwLFxuICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgIGNvdW50OiBjb3VudFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmVkdWNlIHRoZSBjb3VudCBvZiByZXF1ZXN0ZWQgbWVzc2FnZXMuXG4gICAgICAgIGxpbWl0IC09IGNvdW50O1xuICAgICAgICAvLyBVcGRhdGUgcXVlcnkgd2l0aCBuZXcgdmFsdWVzIGxvYWRlZCBmcm9tIERCLlxuICAgICAgICBxdWVyeSA9IGZvcndhcmQgPyB0aGlzLnN0YXJ0TWV0YVF1ZXJ5KCkud2l0aExhdGVyRGF0YShsaW1pdCkgOlxuICAgICAgICAgIHRoaXMuc3RhcnRNZXRhUXVlcnkoKS53aXRoRWFybGllckRhdGEobGltaXQpO1xuICAgICAgICBsZXQgcHJvbWlzZSA9IHRoaXMuZ2V0TWV0YShxdWVyeS5idWlsZCgpKTtcbiAgICAgICAgaWYgKCFmb3J3YXJkKSB7XG4gICAgICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbihjdHJsID0+IHtcbiAgICAgICAgICAgIGlmIChjdHJsICYmIGN0cmwucGFyYW1zICYmICFjdHJsLnBhcmFtcy5jb3VudCkge1xuICAgICAgICAgICAgICB0aGlzLl9ub0VhcmxpZXJNc2dzID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgIH0pO1xuICB9XG4gIC8qKlxuICAgKiBVcGRhdGUgdG9waWMgbWV0YWRhdGEuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7VGlub2RlLlNldFBhcmFtc30gcGFyYW1zIHBhcmFtZXRlcnMgdG8gdXBkYXRlLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBzZXJ2ZXIgcmVzcG9uZHMgdG8gcmVxdWVzdC5cbiAgICovXG4gIHNldE1ldGEocGFyYW1zKSB7XG4gICAgaWYgKHBhcmFtcy50YWdzKSB7XG4gICAgICBwYXJhbXMudGFncyA9IG5vcm1hbGl6ZUFycmF5KHBhcmFtcy50YWdzKTtcbiAgICB9XG4gICAgLy8gU2VuZCBTZXQgbWVzc2FnZSwgaGFuZGxlIGFzeW5jIHJlc3BvbnNlLlxuICAgIHJldHVybiB0aGlzLl90aW5vZGUuc2V0TWV0YSh0aGlzLm5hbWUsIHBhcmFtcylcbiAgICAgIC50aGVuKGN0cmwgPT4ge1xuICAgICAgICBpZiAoY3RybCAmJiBjdHJsLmNvZGUgPj0gMzAwKSB7XG4gICAgICAgICAgLy8gTm90IG1vZGlmaWVkXG4gICAgICAgICAgcmV0dXJuIGN0cmw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocGFyYW1zLnN1Yikge1xuICAgICAgICAgIHBhcmFtcy5zdWIudG9waWMgPSB0aGlzLm5hbWU7XG4gICAgICAgICAgaWYgKGN0cmwucGFyYW1zICYmIGN0cmwucGFyYW1zLmFjcykge1xuICAgICAgICAgICAgcGFyYW1zLnN1Yi5hY3MgPSBjdHJsLnBhcmFtcy5hY3M7XG4gICAgICAgICAgICBwYXJhbXMuc3ViLnVwZGF0ZWQgPSBjdHJsLnRzO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoIXBhcmFtcy5zdWIudXNlcikge1xuICAgICAgICAgICAgLy8gVGhpcyBpcyBhIHN1YnNjcmlwdGlvbiB1cGRhdGUgb2YgdGhlIGN1cnJlbnQgdXNlci5cbiAgICAgICAgICAgIC8vIEFzc2lnbiB1c2VyIElEIG90aGVyd2lzZSB0aGUgdXBkYXRlIHdpbGwgYmUgaWdub3JlZCBieSBfcHJvY2Vzc01ldGFTdWIuXG4gICAgICAgICAgICBwYXJhbXMuc3ViLnVzZXIgPSB0aGlzLl90aW5vZGUuZ2V0Q3VycmVudFVzZXJJRCgpO1xuICAgICAgICAgICAgaWYgKCFwYXJhbXMuZGVzYykge1xuICAgICAgICAgICAgICAvLyBGb3JjZSB1cGRhdGUgdG8gdG9waWMncyBhc2MuXG4gICAgICAgICAgICAgIHBhcmFtcy5kZXNjID0ge307XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHBhcmFtcy5zdWIuX25vRm9yd2FyZGluZyA9IHRydWU7XG4gICAgICAgICAgdGhpcy5fcHJvY2Vzc01ldGFTdWIoW3BhcmFtcy5zdWJdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwYXJhbXMuZGVzYykge1xuICAgICAgICAgIGlmIChjdHJsLnBhcmFtcyAmJiBjdHJsLnBhcmFtcy5hY3MpIHtcbiAgICAgICAgICAgIHBhcmFtcy5kZXNjLmFjcyA9IGN0cmwucGFyYW1zLmFjcztcbiAgICAgICAgICAgIHBhcmFtcy5kZXNjLnVwZGF0ZWQgPSBjdHJsLnRzO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLl9wcm9jZXNzTWV0YURlc2MocGFyYW1zLmRlc2MpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHBhcmFtcy50YWdzKSB7XG4gICAgICAgICAgdGhpcy5fcHJvY2Vzc01ldGFUYWdzKHBhcmFtcy50YWdzKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocGFyYW1zLmNyZWQpIHtcbiAgICAgICAgICB0aGlzLl9wcm9jZXNzTWV0YUNyZWRzKFtwYXJhbXMuY3JlZF0sIHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGN0cmw7XG4gICAgICB9KTtcbiAgfVxuICAvKipcbiAgICogVXBkYXRlIGFjY2VzcyBtb2RlIG9mIHRoZSBjdXJyZW50IHVzZXIgb3Igb2YgYW5vdGhlciB0b3BpYyBzdWJzcmliZXIuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1aWQgLSBVSUQgb2YgdGhlIHVzZXIgdG8gdXBkYXRlIG9yIG51bGwgdG8gdXBkYXRlIGN1cnJlbnQgdXNlci5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHVwZGF0ZSAtIHRoZSB1cGRhdGUgdmFsdWUsIGZ1bGwgb3IgZGVsdGEuXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHRvIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIHNlcnZlciByZXNwb25kcyB0byByZXF1ZXN0LlxuICAgKi9cbiAgdXBkYXRlTW9kZSh1aWQsIHVwZGF0ZSkge1xuICAgIGNvbnN0IHVzZXIgPSB1aWQgPyB0aGlzLnN1YnNjcmliZXIodWlkKSA6IG51bGw7XG4gICAgY29uc3QgYW0gPSB1c2VyID9cbiAgICAgIHVzZXIuYWNzLnVwZGF0ZUdpdmVuKHVwZGF0ZSkuZ2V0R2l2ZW4oKSA6XG4gICAgICB0aGlzLmdldEFjY2Vzc01vZGUoKS51cGRhdGVXYW50KHVwZGF0ZSkuZ2V0V2FudCgpO1xuXG4gICAgcmV0dXJuIHRoaXMuc2V0TWV0YSh7XG4gICAgICBzdWI6IHtcbiAgICAgICAgdXNlcjogdWlkLFxuICAgICAgICBtb2RlOiBhbVxuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIC8qKlxuICAgKiBDcmVhdGUgbmV3IHRvcGljIHN1YnNjcmlwdGlvbi4gV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNzZXRNZXRhfS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVpZCAtIElEIG9mIHRoZSB1c2VyIHRvIGludml0ZVxuICAgKiBAcGFyYW0ge3N0cmluZz19IG1vZGUgLSBBY2Nlc3MgbW9kZS4gPGNvZGU+bnVsbDwvY29kZT4gbWVhbnMgdG8gdXNlIGRlZmF1bHQuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHRvIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIHNlcnZlciByZXNwb25kcyB0byByZXF1ZXN0LlxuICAgKi9cbiAgaW52aXRlKHVpZCwgbW9kZSkge1xuICAgIHJldHVybiB0aGlzLnNldE1ldGEoe1xuICAgICAgc3ViOiB7XG4gICAgICAgIHVzZXI6IHVpZCxcbiAgICAgICAgbW9kZTogbW9kZVxuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIC8qKlxuICAgKiBBcmNoaXZlIG9yIHVuLWFyY2hpdmUgdGhlIHRvcGljLiBXcmFwcGVyIGZvciB7QGxpbmsgVGlub2RlI3NldE1ldGF9LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGFyY2ggLSB0cnVlIHRvIGFyY2hpdmUgdGhlIHRvcGljLCBmYWxzZSBvdGhlcndpc2UuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHRvIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIHNlcnZlciByZXNwb25kcyB0byByZXF1ZXN0LlxuICAgKi9cbiAgYXJjaGl2ZShhcmNoKSB7XG4gICAgaWYgKHRoaXMucHJpdmF0ZSAmJiAoIXRoaXMucHJpdmF0ZS5hcmNoID09ICFhcmNoKSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShhcmNoKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc2V0TWV0YSh7XG4gICAgICBkZXNjOiB7XG4gICAgICAgIHByaXZhdGU6IHtcbiAgICAgICAgICBhcmNoOiBhcmNoID8gdHJ1ZSA6IENvbnN0LkRFTF9DSEFSXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICAvKipcbiAgICogRGVsZXRlIG1lc3NhZ2VzLiBIYXJkLWRlbGV0aW5nIG1lc3NhZ2VzIHJlcXVpcmVzIE93bmVyIHBlcm1pc3Npb24uXG4gICAqIFdyYXBwZXIgZm9yIHtAbGluayBUaW5vZGUjZGVsTWVzc2FnZXN9LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge1Rpbm9kZS5EZWxSYW5nZVtdfSByYW5nZXMgLSBSYW5nZXMgb2YgbWVzc2FnZSBJRHMgdG8gZGVsZXRlLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBoYXJkIC0gSGFyZCBvciBzb2Z0IGRlbGV0ZVxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBzZXJ2ZXIgcmVzcG9uZHMgdG8gcmVxdWVzdC5cbiAgICovXG4gIGRlbE1lc3NhZ2VzKHJhbmdlcywgaGFyZCkge1xuICAgIGlmICghdGhpcy5fYXR0YWNoZWQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJDYW5ub3QgZGVsZXRlIG1lc3NhZ2VzIGluIGluYWN0aXZlIHRvcGljXCIpKTtcbiAgICB9XG5cbiAgICAvLyBTb3J0IHJhbmdlcyBpbiBhY2NlbmRpbmcgb3JkZXIgYnkgbG93LCB0aGUgZGVzY2VuZGluZyBieSBoaS5cbiAgICByYW5nZXMuc29ydCgocjEsIHIyKSA9PiB7XG4gICAgICBpZiAocjEubG93IDwgcjIubG93KSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgaWYgKHIxLmxvdyA9PSByMi5sb3cpIHtcbiAgICAgICAgcmV0dXJuICFyMi5oaSB8fCAocjEuaGkgPj0gcjIuaGkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0pO1xuXG4gICAgLy8gUmVtb3ZlIHBlbmRpbmcgbWVzc2FnZXMgZnJvbSByYW5nZXMgcG9zc2libHkgY2xpcHBpbmcgc29tZSByYW5nZXMuXG4gICAgbGV0IHRvc2VuZCA9IHJhbmdlcy5yZWR1Y2UoKG91dCwgcikgPT4ge1xuICAgICAgaWYgKHIubG93IDwgQ29uc3QuTE9DQUxfU0VRSUQpIHtcbiAgICAgICAgaWYgKCFyLmhpIHx8IHIuaGkgPCBDb25zdC5MT0NBTF9TRVFJRCkge1xuICAgICAgICAgIG91dC5wdXNoKHIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIENsaXAgaGkgdG8gbWF4IGFsbG93ZWQgdmFsdWUuXG4gICAgICAgICAgb3V0LnB1c2goe1xuICAgICAgICAgICAgbG93OiByLmxvdyxcbiAgICAgICAgICAgIGhpOiB0aGlzLl9tYXhTZXEgKyAxXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBvdXQ7XG4gICAgfSwgW10pO1xuXG4gICAgLy8gU2VuZCB7ZGVsfSBtZXNzYWdlLCByZXR1cm4gcHJvbWlzZVxuICAgIGxldCByZXN1bHQ7XG4gICAgaWYgKHRvc2VuZC5sZW5ndGggPiAwKSB7XG4gICAgICByZXN1bHQgPSB0aGlzLl90aW5vZGUuZGVsTWVzc2FnZXModGhpcy5uYW1lLCB0b3NlbmQsIGhhcmQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHQgPSBQcm9taXNlLnJlc29sdmUoe1xuICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICBkZWw6IDBcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIC8vIFVwZGF0ZSBsb2NhbCBjYWNoZS5cbiAgICByZXR1cm4gcmVzdWx0LnRoZW4oY3RybCA9PiB7XG4gICAgICBpZiAoY3RybC5wYXJhbXMuZGVsID4gdGhpcy5fbWF4RGVsKSB7XG4gICAgICAgIHRoaXMuX21heERlbCA9IGN0cmwucGFyYW1zLmRlbDtcbiAgICAgIH1cblxuICAgICAgcmFuZ2VzLmZvckVhY2goKHIpID0+IHtcbiAgICAgICAgaWYgKHIuaGkpIHtcbiAgICAgICAgICB0aGlzLmZsdXNoTWVzc2FnZVJhbmdlKHIubG93LCByLmhpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmZsdXNoTWVzc2FnZShyLmxvdyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBpZiAodGhpcy5vbkRhdGEpIHtcbiAgICAgICAgLy8gQ2FsbGluZyB3aXRoIG5vIHBhcmFtZXRlcnMgdG8gaW5kaWNhdGUgdGhlIG1lc3NhZ2VzIHdlcmUgZGVsZXRlZC5cbiAgICAgICAgdGhpcy5vbkRhdGEoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjdHJsO1xuICAgIH0pO1xuICB9XG4gIC8qKlxuICAgKiBEZWxldGUgYWxsIG1lc3NhZ2VzLiBIYXJkLWRlbGV0aW5nIG1lc3NhZ2VzIHJlcXVpcmVzIERlbGV0ZXIgcGVybWlzc2lvbi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSBoYXJkRGVsIC0gdHJ1ZSBpZiBtZXNzYWdlcyBzaG91bGQgYmUgaGFyZC1kZWxldGVkLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBzZXJ2ZXIgcmVzcG9uZHMgdG8gcmVxdWVzdC5cbiAgICovXG4gIGRlbE1lc3NhZ2VzQWxsKGhhcmREZWwpIHtcbiAgICBpZiAoIXRoaXMuX21heFNlcSB8fCB0aGlzLl9tYXhTZXEgPD0gMCkge1xuICAgICAgLy8gVGhlcmUgYXJlIG5vIG1lc3NhZ2VzIHRvIGRlbGV0ZS5cbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZGVsTWVzc2FnZXMoW3tcbiAgICAgIGxvdzogMSxcbiAgICAgIGhpOiB0aGlzLl9tYXhTZXEgKyAxLFxuICAgICAgX2FsbDogdHJ1ZVxuICAgIH1dLCBoYXJkRGVsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWxldGUgbXVsdGlwbGUgbWVzc2FnZXMgZGVmaW5lZCBieSB0aGVpciBJRHMuIEhhcmQtZGVsZXRpbmcgbWVzc2FnZXMgcmVxdWlyZXMgRGVsZXRlciBwZXJtaXNzaW9uLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5LjxudW1iZXI+fSBsaXN0IC0gbGlzdCBvZiBzZXEgSURzIHRvIGRlbGV0ZS5cbiAgICogQHBhcmFtIHtib29sZWFuPX0gaGFyZERlbCAtIHRydWUgaWYgbWVzc2FnZXMgc2hvdWxkIGJlIGhhcmQtZGVsZXRlZC5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgdG8gYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgc2VydmVyIHJlc3BvbmRzIHRvIHJlcXVlc3QuXG4gICAqL1xuICBkZWxNZXNzYWdlc0xpc3QobGlzdCwgaGFyZERlbCkge1xuICAgIC8vIFNvcnQgdGhlIGxpc3QgaW4gYXNjZW5kaW5nIG9yZGVyXG4gICAgbGlzdC5zb3J0KChhLCBiKSA9PiBhIC0gYik7XG4gICAgLy8gQ29udmVydCB0aGUgYXJyYXkgb2YgSURzIHRvIHJhbmdlcy5cbiAgICBsZXQgcmFuZ2VzID0gbGlzdC5yZWR1Y2UoKG91dCwgaWQpID0+IHtcbiAgICAgIGlmIChvdXQubGVuZ3RoID09IDApIHtcbiAgICAgICAgLy8gRmlyc3QgZWxlbWVudC5cbiAgICAgICAgb3V0LnB1c2goe1xuICAgICAgICAgIGxvdzogaWRcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgcHJldiA9IG91dFtvdXQubGVuZ3RoIC0gMV07XG4gICAgICAgIGlmICgoIXByZXYuaGkgJiYgKGlkICE9IHByZXYubG93ICsgMSkpIHx8IChpZCA+IHByZXYuaGkpKSB7XG4gICAgICAgICAgLy8gTmV3IHJhbmdlLlxuICAgICAgICAgIG91dC5wdXNoKHtcbiAgICAgICAgICAgIGxvdzogaWRcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBFeHBhbmQgZXhpc3RpbmcgcmFuZ2UuXG4gICAgICAgICAgcHJldi5oaSA9IHByZXYuaGkgPyBNYXRoLm1heChwcmV2LmhpLCBpZCArIDEpIDogaWQgKyAxO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gb3V0O1xuICAgIH0sIFtdKTtcbiAgICAvLyBTZW5kIHtkZWx9IG1lc3NhZ2UsIHJldHVybiBwcm9taXNlXG4gICAgcmV0dXJuIHRoaXMuZGVsTWVzc2FnZXMocmFuZ2VzLCBoYXJkRGVsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWxldGUgb3JpZ2luYWwgbWVzc2FnZSBhbmQgZWRpdGVkIHZhcmlhbnRzLiBIYXJkLWRlbGV0aW5nIG1lc3NhZ2VzIHJlcXVpcmVzIERlbGV0ZXIgcGVybWlzc2lvbi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IHNlcSAtIG9yaWdpbmFsIHNlcSBJRCBvZiB0aGUgbWVzc2FnZSB0byBkZWxldGUuXG4gICAqIEBwYXJhbSB7Ym9vbGVhbj19IGhhcmREZWwgLSB0cnVlIGlmIG1lc3NhZ2VzIHNob3VsZCBiZSBoYXJkLWRlbGV0ZWQuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHRvIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIHNlcnZlciByZXNwb25kcyB0byB0aGUgcmVxdWVzdC5cbiAgICovXG4gIGRlbE1lc3NhZ2VzRWRpdHMoc2VxLCBoYXJkRGVsKSB7XG4gICAgY29uc3QgbGlzdCA9IFtzZXFdO1xuICAgIHRoaXMubWVzc2FnZVZlcnNpb25zKHNlcSwgbXNnID0+IGxpc3QucHVzaChtc2cuc2VxKSk7XG4gICAgLy8gU2VuZCB7ZGVsfSBtZXNzYWdlLCByZXR1cm4gcHJvbWlzZVxuICAgIHJldHVybiB0aGlzLmRlbE1lc3NhZ2VzTGlzdChsaXN0LCBoYXJkRGVsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWxldGUgdG9waWMuIFJlcXVpcmVzIE93bmVyIHBlcm1pc3Npb24uIFdyYXBwZXIgZm9yIHtAbGluayBUaW5vZGUjZGVsVG9waWN9LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGhhcmQgLSBoYWQtZGVsZXRlIHRvcGljLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBzZXJ2ZXIgcmVzcG9uZHMgdG8gdGhlIHJlcXVlc3QuXG4gICAqL1xuICBkZWxUb3BpYyhoYXJkKSB7XG4gICAgaWYgKHRoaXMuX2RlbGV0ZWQpIHtcbiAgICAgIC8vIFRoZSB0b3BpYyBpcyBhbHJlYWR5IGRlbGV0ZWQgYXQgdGhlIHNlcnZlciwganVzdCByZW1vdmUgZnJvbSBEQi5cbiAgICAgIHRoaXMuX2dvbmUoKTtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobnVsbCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3Rpbm9kZS5kZWxUb3BpYyh0aGlzLm5hbWUsIGhhcmQpLnRoZW4oY3RybCA9PiB7XG4gICAgICB0aGlzLl9kZWxldGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMuX3Jlc2V0U3ViKCk7XG4gICAgICB0aGlzLl9nb25lKCk7XG4gICAgICByZXR1cm4gY3RybDtcbiAgICB9KTtcbiAgfVxuICAvKipcbiAgICogRGVsZXRlIHN1YnNjcmlwdGlvbi4gUmVxdWlyZXMgU2hhcmUgcGVybWlzc2lvbi4gV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNkZWxTdWJzY3JpcHRpb259LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdXNlciAtIElEIG9mIHRoZSB1c2VyIHRvIHJlbW92ZSBzdWJzY3JpcHRpb24gZm9yLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBzZXJ2ZXIgcmVzcG9uZHMgdG8gcmVxdWVzdC5cbiAgICovXG4gIGRlbFN1YnNjcmlwdGlvbih1c2VyKSB7XG4gICAgaWYgKCF0aGlzLl9hdHRhY2hlZCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIkNhbm5vdCBkZWxldGUgc3Vic2NyaXB0aW9uIGluIGluYWN0aXZlIHRvcGljXCIpKTtcbiAgICB9XG4gICAgLy8gU2VuZCB7ZGVsfSBtZXNzYWdlLCByZXR1cm4gcHJvbWlzZVxuICAgIHJldHVybiB0aGlzLl90aW5vZGUuZGVsU3Vic2NyaXB0aW9uKHRoaXMubmFtZSwgdXNlcikudGhlbihjdHJsID0+IHtcbiAgICAgIC8vIFJlbW92ZSB0aGUgb2JqZWN0IGZyb20gdGhlIHN1YnNjcmlwdGlvbiBjYWNoZTtcbiAgICAgIGRlbGV0ZSB0aGlzLl91c2Vyc1t1c2VyXTtcbiAgICAgIC8vIE5vdGlmeSBsaXN0ZW5lcnNcbiAgICAgIGlmICh0aGlzLm9uU3Vic1VwZGF0ZWQpIHtcbiAgICAgICAgdGhpcy5vblN1YnNVcGRhdGVkKE9iamVjdC5rZXlzKHRoaXMuX3VzZXJzKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY3RybDtcbiAgICB9KTtcbiAgfVxuICAvKipcbiAgICogU2VuZCBhIHJlYWQvcmVjdiBub3RpZmljYXRpb24uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB3aGF0IC0gd2hhdCBub3RpZmljYXRpb24gdG8gc2VuZDogPGNvZGU+cmVjdjwvY29kZT4sIDxjb2RlPnJlYWQ8L2NvZGU+LlxuICAgKiBAcGFyYW0ge251bWJlcn0gc2VxIC0gSUQgb3IgdGhlIG1lc3NhZ2UgcmVhZCBvciByZWNlaXZlZC5cbiAgICovXG4gIG5vdGUod2hhdCwgc2VxKSB7XG4gICAgaWYgKCF0aGlzLl9hdHRhY2hlZCkge1xuICAgICAgLy8gQ2Fubm90IHNlbmRpbmcge25vdGV9IG9uIGFuIGluYWN0aXZlIHRvcGljXCIuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gVXBkYXRlIGxvY2FsIGNhY2hlIHdpdGggdGhlIG5ldyBjb3VudC5cbiAgICBjb25zdCB1c2VyID0gdGhpcy5fdXNlcnNbdGhpcy5fdGlub2RlLmdldEN1cnJlbnRVc2VySUQoKV07XG4gICAgbGV0IHVwZGF0ZSA9IGZhbHNlO1xuICAgIGlmICh1c2VyKSB7XG4gICAgICAvLyBTZWxmLXN1YnNjcmlwdGlvbiBpcyBmb3VuZC5cbiAgICAgIGlmICghdXNlclt3aGF0XSB8fCB1c2VyW3doYXRdIDwgc2VxKSB7XG4gICAgICAgIHVzZXJbd2hhdF0gPSBzZXE7XG4gICAgICAgIHVwZGF0ZSA9IHRydWU7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFNlbGYtc3Vic2NyaXB0aW9uIGlzIG5vdCBmb3VuZC5cbiAgICAgIHVwZGF0ZSA9ICh0aGlzW3doYXRdIHwgMCkgPCBzZXE7XG4gICAgfVxuXG4gICAgaWYgKHVwZGF0ZSkge1xuICAgICAgLy8gU2VuZCBub3RpZmljYXRpb24gdG8gdGhlIHNlcnZlci5cbiAgICAgIHRoaXMuX3Rpbm9kZS5ub3RlKHRoaXMubmFtZSwgd2hhdCwgc2VxKTtcbiAgICAgIC8vIFVwZGF0ZSBsb2NhbGx5IGNhY2hlZCBjb250YWN0IHdpdGggdGhlIG5ldyBjb3VudC5cbiAgICAgIHRoaXMuX3VwZGF0ZVJlYWRSZWN2KHdoYXQsIHNlcSk7XG5cbiAgICAgIGlmICh0aGlzLmFjcyAhPSBudWxsICYmICF0aGlzLmFjcy5pc011dGVkKCkpIHtcbiAgICAgICAgY29uc3QgbWUgPSB0aGlzLl90aW5vZGUuZ2V0TWVUb3BpYygpO1xuICAgICAgICAvLyBTZW50IGEgbm90aWZpY2F0aW9uIHRvICdtZScgbGlzdGVuZXJzLlxuICAgICAgICBtZS5fcmVmcmVzaENvbnRhY3Qod2hhdCwgdGhpcyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgYSAncmVjdicgcmVjZWlwdC4gV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNub3RlUmVjdn0uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzZXEgLSBJRCBvZiB0aGUgbWVzc2FnZSB0byBha25vd2xlZGdlLlxuICAgKi9cbiAgbm90ZVJlY3Yoc2VxKSB7XG4gICAgdGhpcy5ub3RlKCdyZWN2Jywgc2VxKTtcbiAgfVxuICAvKipcbiAgICogU2VuZCBhICdyZWFkJyByZWNlaXB0LiBXcmFwcGVyIGZvciB7QGxpbmsgVGlub2RlI25vdGVSZWFkfS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IHNlcSAtIElEIG9mIHRoZSBtZXNzYWdlIHRvIGFrbm93bGVkZ2Ugb3IgMC91bmRlZmluZWQgdG8gYWNrbm93bGVkZ2UgdGhlIGxhdGVzdCBtZXNzYWdlcy5cbiAgICovXG4gIG5vdGVSZWFkKHNlcSkge1xuICAgIHNlcSA9IHNlcSB8fCB0aGlzLl9tYXhTZXE7XG4gICAgaWYgKHNlcSA+IDApIHtcbiAgICAgIHRoaXMubm90ZSgncmVhZCcsIHNlcSk7XG4gICAgfVxuICB9XG4gIC8qKlxuICAgKiBTZW5kIGEga2V5LXByZXNzIG5vdGlmaWNhdGlvbi4gV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNub3RlS2V5UHJlc3N9LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKi9cbiAgbm90ZUtleVByZXNzKCkge1xuICAgIGlmICh0aGlzLl9hdHRhY2hlZCkge1xuICAgICAgdGhpcy5fdGlub2RlLm5vdGVLZXlQcmVzcyh0aGlzLm5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl90aW5vZGUubG9nZ2VyKFwiSU5GTzogQ2Fubm90IHNlbmQgbm90aWZpY2F0aW9uIGluIGluYWN0aXZlIHRvcGljXCIpO1xuICAgIH1cbiAgfVxuICAvKipcbiAgICogU2VuZCBhIG5vdGlmaWNhdGlvbiB0aGFuIGEgdmlkZW8gb3IgYXVkaW8gbWVzc2FnZSBpcyAuIFdyYXBwZXIgZm9yIHtAbGluayBUaW5vZGUjbm90ZUtleVByZXNzfS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICogQHBhcmFtIGF1ZGlvT25seSAtIHRydWUgaWYgdGhlIHJlY29yZGluZyBpcyBhdWRpby1vbmx5LCBmYWxzZSBpZiBpdCdzIGEgdmlkZW8gcmVjb3JkaW5nLlxuICAgKi9cbiAgbm90ZVJlY29yZGluZyhhdWRpb09ubHkpIHtcbiAgICBpZiAodGhpcy5fYXR0YWNoZWQpIHtcbiAgICAgIHRoaXMuX3Rpbm9kZS5ub3RlS2V5UHJlc3ModGhpcy5uYW1lLCBhdWRpb09ubHkgPyAna3BhJyA6ICdrcHYnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fdGlub2RlLmxvZ2dlcihcIklORk86IENhbm5vdCBzZW5kIG5vdGlmaWNhdGlvbiBpbiBpbmFjdGl2ZSB0b3BpY1wiKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2VuZCBhIHtub3RlIHdoYXQ9J2NhbGwnfS4gV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSN2aWRlb0NhbGx9LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXZ0IC0gQ2FsbCBldmVudC5cbiAgICogQHBhcmFtIHtpbnR9IHNlcSAtIElEIG9mIHRoZSBjYWxsIG1lc3NhZ2UgdGhlIGV2ZW50IHBlcnRhaW5zIHRvLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGF5bG9hZCAtIFBheWxvYWQgYXNzb2NpYXRlZCB3aXRoIHRoaXMgZXZlbnQgKGUuZy4gU0RQIHN0cmluZykuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIChmb3Igc29tZSBjYWxsIGV2ZW50cykgd2hpY2ggd2lsbFxuICAgKiAgICAgICAgICAgICAgICAgICAgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gcmVjZWl2aW5nIHNlcnZlciByZXBseVxuICAgKi9cbiAgdmlkZW9DYWxsKGV2dCwgc2VxLCBwYXlsb2FkKSB7XG4gICAgaWYgKCF0aGlzLl9hdHRhY2hlZCAmJiAhWydyaW5naW5nJywgJ2hhbmctdXAnXS5pbmNsdWRlcyhldnQpKSB7XG4gICAgICAvLyBDYW5ub3Qge2NhbGx9IG9uIGFuIGluYWN0aXZlIHRvcGljXCIuXG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl90aW5vZGUudmlkZW9DYWxsKHRoaXMubmFtZSwgc2VxLCBldnQsIHBheWxvYWQpO1xuICB9XG5cbiAgLy8gVXBkYXRlIGNhY2hlZCByZWFkL3JlY3YvdW5yZWFkIGNvdW50cy5cbiAgX3VwZGF0ZVJlYWRSZWN2KHdoYXQsIHNlcSwgdHMpIHtcbiAgICBsZXQgb2xkVmFsLCBkb1VwZGF0ZSA9IGZhbHNlO1xuXG4gICAgc2VxID0gc2VxIHwgMDtcbiAgICB0aGlzLnNlcSA9IHRoaXMuc2VxIHwgMDtcbiAgICB0aGlzLnJlYWQgPSB0aGlzLnJlYWQgfCAwO1xuICAgIHRoaXMucmVjdiA9IHRoaXMucmVjdiB8IDA7XG4gICAgc3dpdGNoICh3aGF0KSB7XG4gICAgICBjYXNlICdyZWN2JzpcbiAgICAgICAgb2xkVmFsID0gdGhpcy5yZWN2O1xuICAgICAgICB0aGlzLnJlY3YgPSBNYXRoLm1heCh0aGlzLnJlY3YsIHNlcSk7XG4gICAgICAgIGRvVXBkYXRlID0gKG9sZFZhbCAhPSB0aGlzLnJlY3YpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3JlYWQnOlxuICAgICAgICBvbGRWYWwgPSB0aGlzLnJlYWQ7XG4gICAgICAgIHRoaXMucmVhZCA9IE1hdGgubWF4KHRoaXMucmVhZCwgc2VxKTtcbiAgICAgICAgZG9VcGRhdGUgPSAob2xkVmFsICE9IHRoaXMucmVhZCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbXNnJzpcbiAgICAgICAgb2xkVmFsID0gdGhpcy5zZXE7XG4gICAgICAgIHRoaXMuc2VxID0gTWF0aC5tYXgodGhpcy5zZXEsIHNlcSk7XG4gICAgICAgIGlmICghdGhpcy50b3VjaGVkIHx8IHRoaXMudG91Y2hlZCA8IHRzKSB7XG4gICAgICAgICAgdGhpcy50b3VjaGVkID0gdHM7XG4gICAgICAgIH1cbiAgICAgICAgZG9VcGRhdGUgPSAob2xkVmFsICE9IHRoaXMuc2VxKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgLy8gU2FuaXR5IGNoZWNrcy5cbiAgICBpZiAodGhpcy5yZWN2IDwgdGhpcy5yZWFkKSB7XG4gICAgICB0aGlzLnJlY3YgPSB0aGlzLnJlYWQ7XG4gICAgICBkb1VwZGF0ZSA9IHRydWU7XG4gICAgfVxuICAgIGlmICh0aGlzLnNlcSA8IHRoaXMucmVjdikge1xuICAgICAgdGhpcy5zZXEgPSB0aGlzLnJlY3Y7XG4gICAgICBpZiAoIXRoaXMudG91Y2hlZCB8fCB0aGlzLnRvdWNoZWQgPCB0cykge1xuICAgICAgICB0aGlzLnRvdWNoZWQgPSB0cztcbiAgICAgIH1cbiAgICAgIGRvVXBkYXRlID0gdHJ1ZTtcbiAgICB9XG4gICAgdGhpcy51bnJlYWQgPSB0aGlzLnNlcSAtIHRoaXMucmVhZDtcbiAgICByZXR1cm4gZG9VcGRhdGU7XG4gIH1cbiAgLyoqXG4gICAqIEdldCB1c2VyIGRlc2NyaXB0aW9uIGZyb20gZ2xvYmFsIGNhY2hlLiBUaGUgdXNlciBkb2VzIG5vdCBuZWVkIHRvIGJlIGFcbiAgICogc3Vic2NyaWJlciBvZiB0aGlzIHRvcGljLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdWlkIC0gSUQgb2YgdGhlIHVzZXIgdG8gZmV0Y2guXG4gICAqIEByZXR1cm4ge09iamVjdH0gdXNlciBkZXNjcmlwdGlvbiBvciB1bmRlZmluZWQuXG4gICAqL1xuICB1c2VyRGVzYyh1aWQpIHtcbiAgICAvLyBUT0RPOiBoYW5kbGUgYXN5bmNocm9ub3VzIHJlcXVlc3RzXG4gICAgY29uc3QgdXNlciA9IHRoaXMuX2NhY2hlR2V0VXNlcih1aWQpO1xuICAgIGlmICh1c2VyKSB7XG4gICAgICByZXR1cm4gdXNlcjsgLy8gUHJvbWlzZS5yZXNvbHZlKHVzZXIpXG4gICAgfVxuICB9XG4gIC8qKlxuICAgKiBHZXQgZGVzY3JpcHRpb24gb2YgdGhlIHAycCBwZWVyIGZyb20gc3Vic2NyaXB0aW9uIGNhY2hlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcmV0dXJuIHtPYmplY3R9IHBlZXIncyBkZXNjcmlwdGlvbiBvciB1bmRlZmluZWQuXG4gICAqL1xuICBwMnBQZWVyRGVzYygpIHtcbiAgICBpZiAoIXRoaXMuaXNQMlBUeXBlKCkpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl91c2Vyc1t0aGlzLm5hbWVdO1xuICB9XG4gIC8qKlxuICAgKiBJdGVyYXRlIG92ZXIgY2FjaGVkIHN1YnNjcmliZXJzLiBJZiBjYWxsYmFjayBpcyB1bmRlZmluZWQsIHVzZSB0aGlzLm9uTWV0YVN1Yi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgLSBDYWxsYmFjayB3aGljaCB3aWxsIHJlY2VpdmUgc3Vic2NyaWJlcnMgb25lIGJ5IG9uZS5cbiAgICogQHBhcmFtIHtPYmplY3Q9fSBjb250ZXh0IC0gVmFsdWUgb2YgYHRoaXNgIGluc2lkZSB0aGUgYGNhbGxiYWNrYC5cbiAgICovXG4gIHN1YnNjcmliZXJzKGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgY29uc3QgY2IgPSAoY2FsbGJhY2sgfHwgdGhpcy5vbk1ldGFTdWIpO1xuICAgIGlmIChjYikge1xuICAgICAgZm9yIChsZXQgaWR4IGluIHRoaXMuX3VzZXJzKSB7XG4gICAgICAgIGNiLmNhbGwoY29udGV4dCwgdGhpcy5fdXNlcnNbaWR4XSwgaWR4LCB0aGlzLl91c2Vycyk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIC8qKlxuICAgKiBHZXQgYSBjb3B5IG9mIGNhY2hlZCB0YWdzLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcmV0dXJuIHtBcnJheS48c3RyaW5nPn0gYSBjb3B5IG9mIHRhZ3NcbiAgICovXG4gIHRhZ3MoKSB7XG4gICAgLy8gUmV0dXJuIGEgY29weS5cbiAgICByZXR1cm4gdGhpcy5fdGFncy5zbGljZSgwKTtcbiAgfVxuICAvKipcbiAgICogR2V0IGNhY2hlZCBzdWJzY3JpcHRpb24gZm9yIHRoZSBnaXZlbiB1c2VyIElELlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdWlkIC0gaWQgb2YgdGhlIHVzZXIgdG8gcXVlcnkgZm9yXG4gICAqIEByZXR1cm4gdXNlciBkZXNjcmlwdGlvbiBvciB1bmRlZmluZWQuXG4gICAqL1xuICBzdWJzY3JpYmVyKHVpZCkge1xuICAgIHJldHVybiB0aGlzLl91c2Vyc1t1aWRdO1xuICB9XG4gIC8qKlxuICAgKiBJdGVyYXRlIG92ZXIgdmVyc2lvbnMgb2YgYSBtZXNzYWdlOiBjYWxsIDxjb2RlPmNhbGxiYWNrPC9jb2RlPiBmb3IgZWFjaCB2ZXJzaW9uIChleGNsdWRpbmcgb3JpZ2luYWwpLlxuICAgKiBJZiA8Y29kZT5jYWxsYmFjazwvY29kZT4gaXMgdW5kZWZpbmVkLCBkb2VzIG5vdGhpbmcuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBvcmlnU2VxIC0gc2VxIElEIG9mIHRoZSBvcmlnaW5hbCBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge1Rpbm9kZS5Gb3JFYWNoQ2FsbGJhY2tUeXBlfSBjYWxsYmFjayAtIENhbGxiYWNrIHdoaWNoIHdpbGwgcmVjZWl2ZSBtZXNzYWdlcyBvbmUgYnkgb25lLiBTZWUge0BsaW5rIFRpbm9kZS5DQnVmZmVyI2ZvckVhY2h9XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZXh0IC0gVmFsdWUgb2YgYHRoaXNgIGluc2lkZSB0aGUgYGNhbGxiYWNrYC5cbiAgICovXG4gIG1lc3NhZ2VWZXJzaW9ucyhvcmlnU2VxLCBjYWxsYmFjaywgY29udGV4dCkge1xuICAgIGlmICghY2FsbGJhY2spIHtcbiAgICAgIC8vIE5vIGNhbGxiYWNrPyBXZSBhcmUgZG9uZSB0aGVuLlxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCB2ZXJzaW9ucyA9IHRoaXMuX21lc3NhZ2VWZXJzaW9uc1tvcmlnU2VxXTtcbiAgICBpZiAoIXZlcnNpb25zKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHZlcnNpb25zLmZvckVhY2goY2FsbGJhY2ssIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBjb250ZXh0KTtcbiAgfVxuICAvKipcbiAgICogSXRlcmF0ZSBvdmVyIGNhY2hlZCBtZXNzYWdlczogY2FsbCA8Y29kZT5jYWxsYmFjazwvY29kZT4gZm9yIGVhY2ggbWVzc2FnZSBpbiB0aGUgcmFuZ2UgW3NpbmNlSWR4LCBiZWZvcmVJZHgpLlxuICAgKiBJZiA8Y29kZT5jYWxsYmFjazwvY29kZT4gaXMgdW5kZWZpbmVkLCB1c2UgPGNvZGU+dGhpcy5vbkRhdGE8L2NvZGU+LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge1Rpbm9kZS5Gb3JFYWNoQ2FsbGJhY2tUeXBlfSBjYWxsYmFjayAtIENhbGxiYWNrIHdoaWNoIHdpbGwgcmVjZWl2ZSBtZXNzYWdlcyBvbmUgYnkgb25lLiBTZWUge0BsaW5rIFRpbm9kZS5DQnVmZmVyI2ZvckVhY2h9XG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzaW5jZUlkIC0gT3B0aW9uYWwgc2VxSWQgdG8gc3RhcnQgaXRlcmF0aW5nIGZyb20gKGluY2x1c2l2ZSkuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBiZWZvcmVJZCAtIE9wdGlvbmFsIHNlcUlkIHRvIHN0b3AgaXRlcmF0aW5nIGJlZm9yZSBpdCBpcyByZWFjaGVkIChleGNsdXNpdmUpLlxuICAgKiBAcGFyYW0ge09iamVjdH0gY29udGV4dCAtIFZhbHVlIG9mIGB0aGlzYCBpbnNpZGUgdGhlIGBjYWxsYmFja2AuXG4gICAqL1xuICBtZXNzYWdlcyhjYWxsYmFjaywgc2luY2VJZCwgYmVmb3JlSWQsIGNvbnRleHQpIHtcbiAgICBjb25zdCBjYiA9IChjYWxsYmFjayB8fCB0aGlzLm9uRGF0YSk7XG4gICAgaWYgKGNiKSB7XG4gICAgICBjb25zdCBzdGFydElkeCA9IHR5cGVvZiBzaW5jZUlkID09ICdudW1iZXInID8gdGhpcy5fbWVzc2FnZXMuZmluZCh7XG4gICAgICAgIHNlcTogc2luY2VJZFxuICAgICAgfSwgdHJ1ZSkgOiB1bmRlZmluZWQ7XG4gICAgICBjb25zdCBiZWZvcmVJZHggPSB0eXBlb2YgYmVmb3JlSWQgPT0gJ251bWJlcicgPyB0aGlzLl9tZXNzYWdlcy5maW5kKHtcbiAgICAgICAgc2VxOiBiZWZvcmVJZFxuICAgICAgfSwgdHJ1ZSkgOiB1bmRlZmluZWQ7XG4gICAgICBpZiAoc3RhcnRJZHggIT0gLTEgJiYgYmVmb3JlSWR4ICE9IC0xKSB7XG4gICAgICAgIC8vIFN0ZXAgMS4gRmlsdGVyIG91dCBhbGwgcmVwbGFjZW1lbnQgbWVzc2FnZXMgYW5kXG4gICAgICAgIC8vIHNhdmUgZGlzcGxheWFibGUgbWVzc2FnZXMgaW4gYSB0ZW1wb3JhcnkgYnVmZmVyLlxuICAgICAgICBsZXQgbXNncyA9IFtdO1xuICAgICAgICB0aGlzLl9tZXNzYWdlcy5mb3JFYWNoKChtc2csIHVudXNlZDEsIHVudXNlZDIsIGkpID0+IHtcbiAgICAgICAgICBpZiAodGhpcy5faXNSZXBsYWNlbWVudE1zZyhtc2cpKSB7XG4gICAgICAgICAgICAvLyBTa2lwIHJlcGxhY2VtZW50cy5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gSW4gY2FzZSB0aGUgbWFzc2FnZSB3YXMgZWRpdGVkLCByZXBsYWNlIHRpbWVzdGFtcCBvZiB0aGUgdmVyc2lvbiB3aXRoIHRoZSBvcmlnaW5hbCdzIHRpbWVzdGFtcC5cbiAgICAgICAgICBjb25zdCBsYXRlc3QgPSB0aGlzLmxhdGVzdE1zZ1ZlcnNpb24obXNnLnNlcSkgfHwgbXNnO1xuICAgICAgICAgIGlmICghbGF0ZXN0Ll9vcmlnVHMpIHtcbiAgICAgICAgICAgIGxhdGVzdC5fb3JpZ1RzID0gbGF0ZXN0LnRzO1xuICAgICAgICAgICAgbGF0ZXN0Ll9vcmlnU2VxID0gbGF0ZXN0LnNlcTtcbiAgICAgICAgICAgIGxhdGVzdC50cyA9IG1zZy50cztcbiAgICAgICAgICAgIGxhdGVzdC5zZXEgPSBtc2cuc2VxO1xuICAgICAgICAgIH1cbiAgICAgICAgICBtc2dzLnB1c2goe1xuICAgICAgICAgICAgZGF0YTogbGF0ZXN0LFxuICAgICAgICAgICAgaWR4OiBpXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sIHN0YXJ0SWR4LCBiZWZvcmVJZHgsIHt9KTtcbiAgICAgICAgLy8gU3RlcCAyLiBMb29wIG92ZXIgZGlzcGxheWJsZSBtZXNzYWdlcyBpbnZva2luZyBjYiBvbiBlYWNoIG9mIHRoZW0uXG4gICAgICAgIG1zZ3MuZm9yRWFjaCgodmFsLCBpKSA9PiB7XG4gICAgICAgICAgY2IuY2FsbChjb250ZXh0LCB2YWwuZGF0YSxcbiAgICAgICAgICAgIChpID4gMCA/IG1zZ3NbaSAtIDFdLmRhdGEgOiB1bmRlZmluZWQpLFxuICAgICAgICAgICAgKGkgPCBtc2dzLmxlbmd0aCAtIDEgPyBtc2dzW2kgKyAxXS5kYXRhIDogdW5kZWZpbmVkKSwgdmFsLmlkeCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICAvKipcbiAgICogR2V0IHRoZSBtZXNzYWdlIGZyb20gY2FjaGUgYnkgPGNvZGU+c2VxPC9jb2RlPi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IHNlcSAtIG1lc3NhZ2Ugc2VxSWQgdG8gc2VhcmNoIGZvci5cbiAgICogQHJldHVybnMge09iamVjdH0gdGhlIG1lc3NhZ2Ugd2l0aCB0aGUgZ2l2ZW4gPGNvZGU+c2VxPC9jb2RlPiBvciA8Y29kZT51bmRlZmluZWQ8L2NvZGU+LCBpZiBubyBzdWNoIG1lc3NhZ2UgaXMgZm91bmQuXG4gICAqL1xuICBmaW5kTWVzc2FnZShzZXEpIHtcbiAgICBjb25zdCBpZHggPSB0aGlzLl9tZXNzYWdlcy5maW5kKHtcbiAgICAgIHNlcTogc2VxXG4gICAgfSk7XG4gICAgaWYgKGlkeCA+PSAwKSB7XG4gICAgICByZXR1cm4gdGhpcy5fbWVzc2FnZXMuZ2V0QXQoaWR4KTtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuICAvKipcbiAgICogR2V0IHRoZSBtb3N0IHJlY2VudCBtZXNzYWdlIGZyb20gY2FjaGUuIFRoaXMgbWV0aG9kIGNvdW50cyBhbGwgbWVzc2FnZXMsIGluY2x1ZGluZyBkZWxldGVkIHJhbmdlcy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHJldHVybnMge09iamVjdH0gdGhlIG1vc3QgcmVjZW50IGNhY2hlZCBtZXNzYWdlIG9yIDxjb2RlPnVuZGVmaW5lZDwvY29kZT4sIGlmIG5vIG1lc3NhZ2VzIGFyZSBjYWNoZWQuXG4gICAqL1xuICBsYXRlc3RNZXNzYWdlKCkge1xuICAgIHJldHVybiB0aGlzLl9tZXNzYWdlcy5nZXRMYXN0KCk7XG4gIH1cbiAgLyoqXG4gICAqIEdldCB0aGUgbGF0ZXN0IHZlcnNpb24gZm9yIG1lc3NhZ2UuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzZXEgLSBvcmlnaW5hbCBzZXEgSUQgb2YgdGhlIG1lc3NhZ2UuXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IHRoZSBsYXRlc3QgdmVyc2lvbiBvZiB0aGUgbWVzc2FnZSBvciBudWxsIGlmIG1lc3NhZ2Ugbm90IGZvdW5kLlxuICAgKi9cbiAgbGF0ZXN0TXNnVmVyc2lvbihzZXEpIHtcbiAgICBjb25zdCB2ZXJzaW9ucyA9IHRoaXMuX21lc3NhZ2VWZXJzaW9uc1tzZXFdO1xuICAgIHJldHVybiB2ZXJzaW9ucyA/IHZlcnNpb25zLmdldExhc3QoKSA6IG51bGw7XG4gIH1cbiAgLyoqXG4gICAqIEdldCB0aGUgbWF4aW11bSBjYWNoZWQgc2VxIElELlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSB0aGUgZ3JlYXRlc3Qgc2VxIElEIGluIGNhY2hlLlxuICAgKi9cbiAgbWF4TXNnU2VxKCkge1xuICAgIHJldHVybiB0aGlzLl9tYXhTZXE7XG4gIH1cbiAgLyoqXG4gICAqIEdldCB0aGUgbWF4aW11bSBkZWxldGlvbiBJRC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHJldHVybnMge251bWJlcn0gdGhlIGdyZWF0ZXN0IGRlbGV0aW9uIElELlxuICAgKi9cbiAgbWF4Q2xlYXJJZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fbWF4RGVsO1xuICB9XG4gIC8qKlxuICAgKiBHZXQgdGhlIG51bWJlciBvZiBtZXNzYWdlcyBpbiB0aGUgY2FjaGUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IGNvdW50IG9mIGNhY2hlZCBtZXNzYWdlcy5cbiAgICovXG4gIG1lc3NhZ2VDb3VudCgpIHtcbiAgICByZXR1cm4gdGhpcy5fbWVzc2FnZXMubGVuZ3RoKCk7XG4gIH1cbiAgLyoqXG4gICAqIEl0ZXJhdGUgb3ZlciBjYWNoZWQgdW5zZW50IG1lc3NhZ2VzLiBXcmFwcyB7QGxpbmsgVGlub2RlLlRvcGljI21lc3NhZ2VzfS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgLSBDYWxsYmFjayB3aGljaCB3aWxsIHJlY2VpdmUgbWVzc2FnZXMgb25lIGJ5IG9uZS4gU2VlIHtAbGluayBUaW5vZGUuQ0J1ZmZlciNmb3JFYWNofVxuICAgKiBAcGFyYW0ge09iamVjdH0gY29udGV4dCAtIFZhbHVlIG9mIDxjb2RlPnRoaXM8L2NvZGU+IGluc2lkZSB0aGUgPGNvZGU+Y2FsbGJhY2s8L2NvZGU+LlxuICAgKi9cbiAgcXVldWVkTWVzc2FnZXMoY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICBpZiAoIWNhbGxiYWNrKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYWxsYmFjayBtdXN0IGJlIHByb3ZpZGVkXCIpO1xuICAgIH1cbiAgICB0aGlzLm1lc3NhZ2VzKGNhbGxiYWNrLCBDb25zdC5MT0NBTF9TRVFJRCwgdW5kZWZpbmVkLCBjb250ZXh0KTtcbiAgfVxuICAvKipcbiAgICogR2V0IHRoZSBudW1iZXIgb2YgdG9waWMgc3Vic2NyaWJlcnMgd2hvIG1hcmtlZCB0aGlzIG1lc3NhZ2UgYXMgZWl0aGVyIHJlY3Ygb3IgcmVhZFxuICAgKiBDdXJyZW50IHVzZXIgaXMgZXhjbHVkZWQgZnJvbSB0aGUgY291bnQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB3aGF0IC0gd2hhdCBhY3Rpb24gdG8gY29uc2lkZXI6IHJlY2VpdmVkIDxjb2RlPlwicmVjdlwiPC9jb2RlPiBvciByZWFkIDxjb2RlPlwicmVhZFwiPC9jb2RlPi5cbiAgICogQHBhcmFtIHtudW1iZXJ9IHNlcSAtIElEIG9yIHRoZSBtZXNzYWdlIHJlYWQgb3IgcmVjZWl2ZWQuXG4gICAqXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IHRoZSBudW1iZXIgb2Ygc3Vic2NyaWJlcnMgd2hvIG1hcmtlZCB0aGUgbWVzc2FnZSB3aXRoIHRoZSBnaXZlbiBJRCBhcyByZWFkIG9yIHJlY2VpdmVkLlxuICAgKi9cbiAgbXNnUmVjZWlwdENvdW50KHdoYXQsIHNlcSkge1xuICAgIGxldCBjb3VudCA9IDA7XG4gICAgaWYgKHNlcSA+IDApIHtcbiAgICAgIGNvbnN0IG1lID0gdGhpcy5fdGlub2RlLmdldEN1cnJlbnRVc2VySUQoKTtcbiAgICAgIGZvciAobGV0IGlkeCBpbiB0aGlzLl91c2Vycykge1xuICAgICAgICBjb25zdCB1c2VyID0gdGhpcy5fdXNlcnNbaWR4XTtcbiAgICAgICAgaWYgKHVzZXIudXNlciAhPT0gbWUgJiYgdXNlclt3aGF0XSA+PSBzZXEpIHtcbiAgICAgICAgICBjb3VudCsrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjb3VudDtcbiAgfVxuICAvKipcbiAgICogR2V0IHRoZSBudW1iZXIgb2YgdG9waWMgc3Vic2NyaWJlcnMgd2hvIG1hcmtlZCB0aGlzIG1lc3NhZ2UgKGFuZCBhbGwgb2xkZXIgbWVzc2FnZXMpIGFzIHJlYWQuXG4gICAqIFRoZSBjdXJyZW50IHVzZXIgaXMgZXhjbHVkZWQgZnJvbSB0aGUgY291bnQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzZXEgLSBtZXNzYWdlIGlkIHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSBudW1iZXIgb2Ygc3Vic2NyaWJlcnMgd2hvIGNsYWltIHRvIGhhdmUgcmVjZWl2ZWQgdGhlIG1lc3NhZ2UuXG4gICAqL1xuICBtc2dSZWFkQ291bnQoc2VxKSB7XG4gICAgcmV0dXJuIHRoaXMubXNnUmVjZWlwdENvdW50KCdyZWFkJywgc2VxKTtcbiAgfVxuICAvKipcbiAgICogR2V0IHRoZSBudW1iZXIgb2YgdG9waWMgc3Vic2NyaWJlcnMgd2hvIG1hcmtlZCB0aGlzIG1lc3NhZ2UgKGFuZCBhbGwgb2xkZXIgbWVzc2FnZXMpIGFzIHJlY2VpdmVkLlxuICAgKiBUaGUgY3VycmVudCB1c2VyIGlzIGV4Y2x1ZGVkIGZyb20gdGhlIGNvdW50LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gc2VxIC0gTWVzc2FnZSBpZCB0byBjaGVjay5cbiAgICogQHJldHVybnMge251bWJlcn0gTnVtYmVyIG9mIHN1YnNjcmliZXJzIHdobyBjbGFpbSB0byBoYXZlIHJlY2VpdmVkIHRoZSBtZXNzYWdlLlxuICAgKi9cbiAgbXNnUmVjdkNvdW50KHNlcSkge1xuICAgIHJldHVybiB0aGlzLm1zZ1JlY2VpcHRDb3VudCgncmVjdicsIHNlcSk7XG4gIH1cbiAgLyoqXG4gICAqIENoZWNrIGlmIGNhY2hlZCBtZXNzYWdlIElEcyBpbmRpY2F0ZSB0aGF0IHRoZSBzZXJ2ZXIgbWF5IGhhdmUgbW9yZSBtZXNzYWdlcy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSBuZXdlciAtIGlmIDxjb2RlPnRydWU8L2NvZGU+LCBjaGVjayBmb3IgbmV3ZXIgbWVzc2FnZXMgb25seS5cbiAgICovXG4gIG1zZ0hhc01vcmVNZXNzYWdlcyhuZXdlcikge1xuICAgIHJldHVybiBuZXdlciA/IHRoaXMuc2VxID4gdGhpcy5fbWF4U2VxIDpcbiAgICAgIC8vIF9taW5TZXEgY291bGQgYmUgbW9yZSB0aGFuIDEsIGJ1dCBlYXJsaWVyIG1lc3NhZ2VzIGNvdWxkIGhhdmUgYmVlbiBkZWxldGVkLlxuICAgICAgKHRoaXMuX21pblNlcSA+IDEgJiYgIXRoaXMuX25vRWFybGllck1zZ3MpO1xuICB9XG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgZ2l2ZW4gc2VxIElkIGlzIGlkIG9mIHRoZSBtb3N0IHJlY2VudCBtZXNzYWdlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gc2VxSWQgaWQgb2YgdGhlIG1lc3NhZ2UgdG8gY2hlY2tcbiAgICovXG4gIGlzTmV3TWVzc2FnZShzZXFJZCkge1xuICAgIHJldHVybiB0aGlzLl9tYXhTZXEgPD0gc2VxSWQ7XG4gIH1cbiAgLyoqXG4gICAqIFJlbW92ZSBvbmUgbWVzc2FnZSBmcm9tIGxvY2FsIGNhY2hlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gc2VxSWQgaWQgb2YgdGhlIG1lc3NhZ2UgdG8gcmVtb3ZlIGZyb20gY2FjaGUuXG4gICAqIEByZXR1cm5zIHtNZXNzYWdlfSByZW1vdmVkIG1lc3NhZ2Ugb3IgdW5kZWZpbmVkIGlmIHN1Y2ggbWVzc2FnZSB3YXMgbm90IGZvdW5kLlxuICAgKi9cbiAgZmx1c2hNZXNzYWdlKHNlcUlkKSB7XG4gICAgY29uc3QgaWR4ID0gdGhpcy5fbWVzc2FnZXMuZmluZCh7XG4gICAgICBzZXE6IHNlcUlkXG4gICAgfSk7XG4gICAgZGVsZXRlIHRoaXMuX21lc3NhZ2VWZXJzaW9uc1tzZXFJZF07XG4gICAgaWYgKGlkeCA+PSAwKSB7XG4gICAgICB0aGlzLl90aW5vZGUuX2RiLnJlbU1lc3NhZ2VzKHRoaXMubmFtZSwgc2VxSWQpO1xuICAgICAgcmV0dXJuIHRoaXMuX21lc3NhZ2VzLmRlbEF0KGlkeCk7XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgLyoqXG4gICAqIFJlbW92ZSBhIHJhbmdlIG9mIG1lc3NhZ2VzIGZyb20gdGhlIGxvY2FsIGNhY2hlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gZnJvbUlkIHNlcSBJRCBvZiB0aGUgZmlyc3QgbWVzc2FnZSB0byByZW1vdmUgKGluY2x1c2l2ZSkuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB1bnRpbElkIHNlcUlEIG9mIHRoZSBsYXN0IG1lc3NhZ2UgdG8gcmVtb3ZlIChleGNsdXNpdmUpLlxuICAgKlxuICAgKiBAcmV0dXJucyB7TWVzc2FnZVtdfSBhcnJheSBvZiByZW1vdmVkIG1lc3NhZ2VzIChjb3VsZCBiZSBlbXB0eSkuXG4gICAqL1xuICBmbHVzaE1lc3NhZ2VSYW5nZShmcm9tSWQsIHVudGlsSWQpIHtcbiAgICAvLyBSZW1vdmUgcmFuZ2UgZnJvbSBwZXJzaXN0ZW50IGNhY2hlLlxuICAgIHRoaXMuX3Rpbm9kZS5fZGIucmVtTWVzc2FnZXModGhpcy5uYW1lLCBmcm9tSWQsIHVudGlsSWQpO1xuXG4gICAgLy8gUmVtb3ZlIGFsbCB2ZXJzaW9ucyBrZXllZCBieSBJRHMgaW4gdGhlIHJhbmdlLlxuICAgIGZvciAobGV0IGkgPSBmcm9tSWQ7IGkgPCB1bnRpbElkOyBpKyspIHtcbiAgICAgIGRlbGV0ZSB0aGlzLl9tZXNzYWdlVmVyc2lvbnNbaV07XG4gICAgfVxuXG4gICAgLy8gc3RhcnQsIGVuZDogZmluZCBpbnNlcnRpb24gcG9pbnRzIChuZWFyZXN0ID09IHRydWUpLlxuICAgIGNvbnN0IHNpbmNlID0gdGhpcy5fbWVzc2FnZXMuZmluZCh7XG4gICAgICBzZXE6IGZyb21JZFxuICAgIH0sIHRydWUpO1xuICAgIHJldHVybiBzaW5jZSA+PSAwID8gdGhpcy5fbWVzc2FnZXMuZGVsUmFuZ2Uoc2luY2UsIHRoaXMuX21lc3NhZ2VzLmZpbmQoe1xuICAgICAgc2VxOiB1bnRpbElkXG4gICAgfSwgdHJ1ZSkpIDogW107XG4gIH1cbiAgLyoqXG4gICAqIFVwZGF0ZSBtZXNzYWdlJ3Mgc2VxSWQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwdWIgbWVzc2FnZSBvYmplY3QuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBuZXdTZXFJZCBuZXcgc2VxIGlkIGZvciBwdWIuXG4gICAqL1xuICBzd2FwTWVzc2FnZUlkKHB1YiwgbmV3U2VxSWQpIHtcbiAgICBjb25zdCBpZHggPSB0aGlzLl9tZXNzYWdlcy5maW5kKHB1Yik7XG4gICAgY29uc3QgbnVtTWVzc2FnZXMgPSB0aGlzLl9tZXNzYWdlcy5sZW5ndGgoKTtcbiAgICBpZiAoMCA8PSBpZHggJiYgaWR4IDwgbnVtTWVzc2FnZXMpIHtcbiAgICAgIC8vIFJlbW92ZSBtZXNzYWdlIHdpdGggdGhlIG9sZCBzZXEgSUQuXG4gICAgICB0aGlzLl9tZXNzYWdlcy5kZWxBdChpZHgpO1xuICAgICAgdGhpcy5fdGlub2RlLl9kYi5yZW1NZXNzYWdlcyh0aGlzLm5hbWUsIHB1Yi5zZXEpO1xuICAgICAgLy8gQWRkIG1lc3NhZ2Ugd2l0aCB0aGUgbmV3IHNlcSBJRC5cbiAgICAgIHB1Yi5zZXEgPSBuZXdTZXFJZDtcbiAgICAgIHRoaXMuX21lc3NhZ2VzLnB1dChwdWIpO1xuICAgICAgdGhpcy5fdGlub2RlLl9kYi5hZGRNZXNzYWdlKHB1Yik7XG4gICAgfVxuICB9XG4gIC8qKlxuICAgKiBBdHRlbXB0IHRvIHN0b3AgbWVzc2FnZSBmcm9tIGJlaW5nIHNlbnQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzZXFJZCBpZCBvZiB0aGUgbWVzc2FnZSB0byBzdG9wIHNlbmRpbmcgYW5kIHJlbW92ZSBmcm9tIGNhY2hlLlxuICAgKlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgbWVzc2FnZSB3YXMgY2FuY2VsbGVkLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgY2FuY2VsU2VuZChzZXFJZCkge1xuICAgIGNvbnN0IGlkeCA9IHRoaXMuX21lc3NhZ2VzLmZpbmQoe1xuICAgICAgc2VxOiBzZXFJZFxuICAgIH0pO1xuICAgIGlmIChpZHggPj0gMCkge1xuICAgICAgY29uc3QgbXNnID0gdGhpcy5fbWVzc2FnZXMuZ2V0QXQoaWR4KTtcbiAgICAgIGNvbnN0IHN0YXR1cyA9IHRoaXMubXNnU3RhdHVzKG1zZyk7XG4gICAgICBpZiAoc3RhdHVzID09IENvbnN0Lk1FU1NBR0VfU1RBVFVTX1FVRVVFRCB8fCBzdGF0dXMgPT0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfRkFJTEVEKSB7XG4gICAgICAgIHRoaXMuX3Rpbm9kZS5fZGIucmVtTWVzc2FnZXModGhpcy5uYW1lLCBzZXFJZCk7XG4gICAgICAgIG1zZy5fY2FuY2VsbGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fbWVzc2FnZXMuZGVsQXQoaWR4KTtcbiAgICAgICAgaWYgKHRoaXMub25EYXRhKSB7XG4gICAgICAgICAgLy8gQ2FsbGluZyB3aXRoIG5vIHBhcmFtZXRlcnMgdG8gaW5kaWNhdGUgdGhlIG1lc3NhZ2Ugd2FzIGRlbGV0ZWQuXG4gICAgICAgICAgdGhpcy5vbkRhdGEoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIC8qKlxuICAgKiBHZXQgdHlwZSBvZiB0aGUgdG9waWM6IG1lLCBwMnAsIGdycCwgZm5kLi4uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IE9uZSBvZiAnbWUnLCAncDJwJywgJ2dycCcsICdmbmQnLCAnc3lzJyBvciA8Y29kZT51bmRlZmluZWQ8L2NvZGU+LlxuICAgKi9cbiAgZ2V0VHlwZSgpIHtcbiAgICByZXR1cm4gVG9waWMudG9waWNUeXBlKHRoaXMubmFtZSk7XG4gIH1cbiAgLyoqXG4gICAqIEdldCBjdXJyZW50IHVzZXIncyBhY2Nlc3MgbW9kZSBvZiB0aGUgdG9waWMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuQWNjZXNzTW9kZX0gLSB1c2VyJ3MgYWNjZXNzIG1vZGVcbiAgICovXG4gIGdldEFjY2Vzc01vZGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuYWNzO1xuICB9XG4gIC8qKlxuICAgKiBTZXQgY3VycmVudCB1c2VyJ3MgYWNjZXNzIG1vZGUgb2YgdGhlIHRvcGljLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge0FjY2Vzc01vZGUgfCBPYmplY3R9IGFjcyAtIGFjY2VzcyBtb2RlIHRvIHNldC5cbiAgICovXG4gIHNldEFjY2Vzc01vZGUoYWNzKSB7XG4gICAgcmV0dXJuIHRoaXMuYWNzID0gbmV3IEFjY2Vzc01vZGUoYWNzKTtcbiAgfVxuICAvKipcbiAgICogR2V0IHRvcGljJ3MgZGVmYXVsdCBhY2Nlc3MgbW9kZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5EZWZBY3N9IC0gYWNjZXNzIG1vZGUsIHN1Y2ggYXMge2F1dGg6IGBSV1BgLCBhbm9uOiBgTmB9LlxuICAgKi9cbiAgZ2V0RGVmYXVsdEFjY2VzcygpIHtcbiAgICByZXR1cm4gdGhpcy5kZWZhY3M7XG4gIH1cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgbmV3IG1ldGEge0BsaW5rIFRpbm9kZS5HZXRRdWVyeX0gYnVpbGRlci4gVGhlIHF1ZXJ5IGlzIGF0dGNoZWQgdG8gdGhlIGN1cnJlbnQgdG9waWMuXG4gICAqIEl0IHdpbGwgbm90IHdvcmsgY29ycmVjdGx5IGlmIHVzZWQgd2l0aCBhIGRpZmZlcmVudCB0b3BpYy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5NZXRhR2V0QnVpbGRlcn0gcXVlcnkgYXR0YWNoZWQgdG8gdGhlIGN1cnJlbnQgdG9waWMuXG4gICAqL1xuICBzdGFydE1ldGFRdWVyeSgpIHtcbiAgICByZXR1cm4gbmV3IE1ldGFHZXRCdWlsZGVyKHRoaXMpO1xuICB9XG4gIC8qKlxuICAgKiBDaGVjayBpZiB0b3BpYyBpcyBhcmNoaXZlZCwgaS5lLiBwcml2YXRlLmFyY2ggPT0gdHJ1ZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHJldHVybnMge2Jvb2xlYW59IC0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgdG9waWMgaXMgYXJjaGl2ZWQsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBpc0FyY2hpdmVkKCkge1xuICAgIHJldHVybiB0aGlzLnByaXZhdGUgJiYgISF0aGlzLnByaXZhdGUuYXJjaDtcbiAgfVxuICAvKipcbiAgICogQ2hlY2sgaWYgdG9waWMgaXMgYSAnbWUnIHRvcGljLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0b3BpYyBpcyBhICdtZScgdG9waWMsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBpc01lVHlwZSgpIHtcbiAgICByZXR1cm4gVG9waWMuaXNNZVRvcGljTmFtZSh0aGlzLm5hbWUpO1xuICB9XG4gIC8qKlxuICAgKiBDaGVjayBpZiB0b3BpYyBpcyBhIGNoYW5uZWwuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIDxjb2RlPnRydWU8L2NvZGU+IGlmIHRvcGljIGlzIGEgY2hhbm5lbCwgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIGlzQ2hhbm5lbFR5cGUoKSB7XG4gICAgcmV0dXJuIFRvcGljLmlzQ2hhbm5lbFRvcGljTmFtZSh0aGlzLm5hbWUpO1xuICB9XG4gIC8qKlxuICAgKiBDaGVjayBpZiB0b3BpYyBpcyBhIGdyb3VwIHRvcGljLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0b3BpYyBpcyBhIGdyb3VwLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgaXNHcm91cFR5cGUoKSB7XG4gICAgcmV0dXJuIFRvcGljLmlzR3JvdXBUb3BpY05hbWUodGhpcy5uYW1lKTtcbiAgfVxuICAvKipcbiAgICogQ2hlY2sgaWYgdG9waWMgaXMgYSBwMnAgdG9waWMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIDxjb2RlPnRydWU8L2NvZGU+IGlmIHRvcGljIGlzIGEgcDJwIHRvcGljLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgaXNQMlBUeXBlKCkge1xuICAgIHJldHVybiBUb3BpYy5pc1AyUFRvcGljTmFtZSh0aGlzLm5hbWUpO1xuICB9XG4gIC8qKlxuICAgKiBDaGVjayBpZiB0b3BpYyBpcyBhIGNvbW11bmljYXRpb24gdG9waWMsIGkuZS4gYSBncm91cCBvciBwMnAgdG9waWMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIDxjb2RlPnRydWU8L2NvZGU+IGlmIHRvcGljIGlzIGEgcDJwIG9yIGdyb3VwIHRvcGljLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgaXNDb21tVHlwZSgpIHtcbiAgICByZXR1cm4gVG9waWMuaXNDb21tVG9waWNOYW1lKHRoaXMubmFtZSk7XG4gIH1cbiAgLyoqXG4gICAqIEdldCBzdGF0dXMgKHF1ZXVlZCwgc2VudCwgcmVjZWl2ZWQgZXRjKSBvZiBhIGdpdmVuIG1lc3NhZ2UgaW4gdGhlIGNvbnRleHRcbiAgICogb2YgdGhpcyB0b3BpYy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtNZXNzYWdlfSBtc2cgLSBtZXNzYWdlIHRvIGNoZWNrIGZvciBzdGF0dXMuXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gdXBkIC0gdXBkYXRlIGNoYWNoZWQgbWVzc2FnZSBzdGF0dXMuXG4gICAqXG4gICAqIEByZXR1cm5zIG1lc3NhZ2Ugc3RhdHVzIGNvbnN0YW50LlxuICAgKi9cbiAgbXNnU3RhdHVzKG1zZywgdXBkKSB7XG4gICAgbGV0IHN0YXR1cyA9IENvbnN0Lk1FU1NBR0VfU1RBVFVTX05PTkU7XG4gICAgaWYgKHRoaXMuX3Rpbm9kZS5pc01lKG1zZy5mcm9tKSkge1xuICAgICAgaWYgKG1zZy5fc2VuZGluZykge1xuICAgICAgICBzdGF0dXMgPSBDb25zdC5NRVNTQUdFX1NUQVRVU19TRU5ESU5HO1xuICAgICAgfSBlbHNlIGlmIChtc2cuX2ZhaWxlZCB8fCBtc2cuX2NhbmNlbGxlZCkge1xuICAgICAgICBzdGF0dXMgPSBDb25zdC5NRVNTQUdFX1NUQVRVU19GQUlMRUQ7XG4gICAgICB9IGVsc2UgaWYgKG1zZy5zZXEgPj0gQ29uc3QuTE9DQUxfU0VRSUQpIHtcbiAgICAgICAgc3RhdHVzID0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfUVVFVUVEO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLm1zZ1JlYWRDb3VudChtc2cuc2VxKSA+IDApIHtcbiAgICAgICAgc3RhdHVzID0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfUkVBRDtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5tc2dSZWN2Q291bnQobXNnLnNlcSkgPiAwKSB7XG4gICAgICAgIHN0YXR1cyA9IENvbnN0Lk1FU1NBR0VfU1RBVFVTX1JFQ0VJVkVEO1xuICAgICAgfSBlbHNlIGlmIChtc2cuc2VxID4gMCkge1xuICAgICAgICBzdGF0dXMgPSBDb25zdC5NRVNTQUdFX1NUQVRVU19TRU5UO1xuICAgICAgfVxuICAgICAgLy8gfSBlbHNlIGlmIChtc2cuX3N0YXR1cyA9PSBDb25zdC5NRVNTQUdFX1NUQVRVU19ERUxfUkFOR0UpIHtcbiAgICAgIC8vICAgc3RhdHVzID09IENvbnN0Lk1FU1NBR0VfU1RBVFVTX0RFTF9SQU5HRTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RhdHVzID0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfVE9fTUU7XG4gICAgfVxuXG4gICAgaWYgKHVwZCAmJiBtc2cuX3N0YXR1cyAhPSBzdGF0dXMpIHtcbiAgICAgIG1zZy5fc3RhdHVzID0gc3RhdHVzO1xuICAgICAgdGhpcy5fdGlub2RlLl9kYi51cGRNZXNzYWdlU3RhdHVzKHRoaXMubmFtZSwgbXNnLnNlcSwgc3RhdHVzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc3RhdHVzO1xuICB9XG5cbiAgLy8gUmV0dXJucyB0cnVlIGlmIHB1YiBpcyBtZWFudCB0byByZXBsYWNlIGFub3RoZXIgbWVzc2FnZSAoZS5nLiBvcmlnaW5hbCBtZXNzYWdlIHdhcyBlZGl0ZWQpLlxuICBfaXNSZXBsYWNlbWVudE1zZyhwdWIpIHtcbiAgICByZXR1cm4gcHViLmhlYWQgJiYgcHViLmhlYWQucmVwbGFjZTtcbiAgfVxuXG4gIC8vIElmIG1zZyBpcyBhIHJlcGxhY2VtZW50IGZvciBhbm90aGVyIG1lc3NhZ2UsIHNhdmUgdGhlIG1zZyBpbiB0aGUgbWVzc2FnZSB2ZXJzaW9ucyBjYWNoZVxuICAvLyBhcyBhIG5ld2VyIHZlcnNpb24gZm9yIHRoZSBtZXNzYWdlIGl0J3Mgc3VwcG9zZWQgdG8gcmVwbGFjZS5cbiAgX21heWJlVXBkYXRlTWVzc2FnZVZlcnNpb25zQ2FjaGUobXNnKSB7XG4gICAgaWYgKCF0aGlzLl9pc1JlcGxhY2VtZW50TXNnKG1zZykpIHtcbiAgICAgIC8vIENoZWNrIGlmIHRoaXMgbWVzc2FnZSBpcyB0aGUgb3JpZ2luYWwgaW4gdGhlIGNoYWluIG9mIGVkaXRzIGFuZCBpZiBzb1xuICAgICAgLy8gZW5zdXJlIGFsbCB2ZXJzaW9uIGhhdmUgdGhlIHNhbWUgc2VuZGVyLlxuICAgICAgaWYgKHRoaXMuX21lc3NhZ2VWZXJzaW9uc1ttc2cuc2VxXSkge1xuICAgICAgICAvLyBSZW1vdmUgdmVyc2lvbnMgd2l0aCBkaWZmZXJlbnQgJ2Zyb20nLlxuICAgICAgICB0aGlzLl9tZXNzYWdlVmVyc2lvbnNbbXNnLnNlcV0uZmlsdGVyKHZlcnNpb24gPT4gdmVyc2lvbi5mcm9tID09IG1zZy5mcm9tKTtcbiAgICAgICAgaWYgKHRoaXMuX21lc3NhZ2VWZXJzaW9uc1ttc2cuc2VxXS5pc0VtcHR5KCkpIHtcbiAgICAgICAgICBkZWxldGUgdGhpcy5fbWVzc2FnZVZlcnNpb25zW21zZy5zZXFdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgdGFyZ2V0U2VxID0gcGFyc2VJbnQobXNnLmhlYWQucmVwbGFjZS5zcGxpdCgnOicpWzFdKTtcbiAgICBpZiAodGFyZ2V0U2VxID4gbXNnLnNlcSkge1xuICAgICAgLy8gU3Vic3RpdHV0ZXMgYXJlIHN1cHBvc2VkIHRvIGhhdmUgaGlnaGVyIHNlcSBpZHMuXG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHRhcmdldE1zZyA9IHRoaXMuZmluZE1lc3NhZ2UodGFyZ2V0U2VxKTtcbiAgICBpZiAodGFyZ2V0TXNnICYmIHRhcmdldE1zZy5mcm9tICE9IG1zZy5mcm9tKSB7XG4gICAgICAvLyBTdWJzdGl0dXRlIGNhbm5vdCBjaGFuZ2UgdGhlIHNlbmRlci5cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgdmVyc2lvbnMgPSB0aGlzLl9tZXNzYWdlVmVyc2lvbnNbdGFyZ2V0U2VxXSB8fCBuZXcgQ0J1ZmZlcigoYSwgYikgPT4ge1xuICAgICAgcmV0dXJuIGEuc2VxIC0gYi5zZXE7XG4gICAgfSwgdHJ1ZSk7XG4gICAgdmVyc2lvbnMucHV0KG1zZyk7XG4gICAgdGhpcy5fbWVzc2FnZVZlcnNpb25zW3RhcmdldFNlcV0gPSB2ZXJzaW9ucztcbiAgfVxuXG4gIC8vIFByb2Nlc3MgZGF0YSBtZXNzYWdlXG4gIF9yb3V0ZURhdGEoZGF0YSkge1xuICAgIGlmIChkYXRhLmNvbnRlbnQpIHtcbiAgICAgIGlmICghdGhpcy50b3VjaGVkIHx8IHRoaXMudG91Y2hlZCA8IGRhdGEudHMpIHtcbiAgICAgICAgdGhpcy50b3VjaGVkID0gZGF0YS50cztcbiAgICAgICAgdGhpcy5fdGlub2RlLl9kYi51cGRUb3BpYyh0aGlzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZGF0YS5zZXEgPiB0aGlzLl9tYXhTZXEpIHtcbiAgICAgIHRoaXMuX21heFNlcSA9IGRhdGEuc2VxO1xuICAgICAgdGhpcy5tc2dTdGF0dXMoZGF0YSwgdHJ1ZSk7XG4gICAgICAvLyBBY2tuIHJlY2VpdmluZyB0aGUgbWVzc2FnZS5cbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLl9yZWN2Tm90aWZpY2F0aW9uVGltZXIpO1xuICAgICAgdGhpcy5fcmVjdk5vdGlmaWNhdGlvblRpbWVyID0gc2V0VGltZW91dChfID0+IHtcbiAgICAgICAgdGhpcy5fcmVjdk5vdGlmaWNhdGlvblRpbWVyID0gbnVsbDtcbiAgICAgICAgdGhpcy5ub3RlUmVjdih0aGlzLl9tYXhTZXEpO1xuICAgICAgfSwgQ29uc3QuUkVDVl9USU1FT1VUKTtcbiAgICB9XG5cbiAgICBpZiAoZGF0YS5zZXEgPCB0aGlzLl9taW5TZXEgfHwgdGhpcy5fbWluU2VxID09IDApIHtcbiAgICAgIHRoaXMuX21pblNlcSA9IGRhdGEuc2VxO1xuICAgIH1cblxuICAgIGNvbnN0IG91dGdvaW5nID0gKCghdGhpcy5pc0NoYW5uZWxUeXBlKCkgJiYgIWRhdGEuZnJvbSkgfHwgdGhpcy5fdGlub2RlLmlzTWUoZGF0YS5mcm9tKSk7XG5cbiAgICBpZiAoZGF0YS5oZWFkICYmIGRhdGEuaGVhZC53ZWJydGMgJiYgZGF0YS5oZWFkLm1pbWUgPT0gRHJhZnR5LmdldENvbnRlbnRUeXBlKCkgJiYgZGF0YS5jb250ZW50KSB7XG4gICAgICAvLyBSZXdyaXRlIFZDIGJvZHkgd2l0aCBpbmZvIGZyb20gdGhlIGhlYWRlcnMuXG4gICAgICBkYXRhLmNvbnRlbnQgPSBEcmFmdHkudXBkYXRlVmlkZW9DYWxsKGRhdGEuY29udGVudCwge1xuICAgICAgICBzdGF0ZTogZGF0YS5oZWFkLndlYnJ0YyxcbiAgICAgICAgZHVyYXRpb246IGRhdGEuaGVhZFsnd2VicnRjLWR1cmF0aW9uJ10sXG4gICAgICAgIGluY29taW5nOiAhb3V0Z29pbmcsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoIWRhdGEuX25vRm9yd2FyZGluZykge1xuICAgICAgdGhpcy5fbWVzc2FnZXMucHV0KGRhdGEpO1xuICAgICAgdGhpcy5fdGlub2RlLl9kYi5hZGRNZXNzYWdlKGRhdGEpO1xuICAgICAgdGhpcy5fbWF5YmVVcGRhdGVNZXNzYWdlVmVyc2lvbnNDYWNoZShkYXRhKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vbkRhdGEpIHtcbiAgICAgIHRoaXMub25EYXRhKGRhdGEpO1xuICAgIH1cblxuICAgIC8vIFVwZGF0ZSBsb2NhbGx5IGNhY2hlZCBjb250YWN0IHdpdGggdGhlIG5ldyBtZXNzYWdlIGNvdW50LlxuICAgIGNvbnN0IHdoYXQgPSBvdXRnb2luZyA/ICdyZWFkJyA6ICdtc2cnO1xuICAgIHRoaXMuX3VwZGF0ZVJlYWRSZWN2KHdoYXQsIGRhdGEuc2VxLCBkYXRhLnRzKTtcbiAgICAvLyBOb3RpZnkgJ21lJyBsaXN0ZW5lcnMgb2YgdGhlIGNoYW5nZS5cbiAgICB0aGlzLl90aW5vZGUuZ2V0TWVUb3BpYygpLl9yZWZyZXNoQ29udGFjdCh3aGF0LCB0aGlzKTtcbiAgfVxuXG4gIC8vIFByb2Nlc3MgbWV0YWRhdGEgbWVzc2FnZVxuICBfcm91dGVNZXRhKG1ldGEpIHtcbiAgICBpZiAobWV0YS5kZXNjKSB7XG4gICAgICB0aGlzLl9wcm9jZXNzTWV0YURlc2MobWV0YS5kZXNjKTtcbiAgICB9XG4gICAgaWYgKG1ldGEuc3ViICYmIG1ldGEuc3ViLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMuX3Byb2Nlc3NNZXRhU3ViKG1ldGEuc3ViKTtcbiAgICB9XG4gICAgaWYgKG1ldGEuZGVsKSB7XG4gICAgICB0aGlzLl9wcm9jZXNzRGVsTWVzc2FnZXMobWV0YS5kZWwuY2xlYXIsIG1ldGEuZGVsLmRlbHNlcSk7XG4gICAgfVxuICAgIGlmIChtZXRhLnRhZ3MpIHtcbiAgICAgIHRoaXMuX3Byb2Nlc3NNZXRhVGFncyhtZXRhLnRhZ3MpO1xuICAgIH1cbiAgICBpZiAobWV0YS5jcmVkKSB7XG4gICAgICB0aGlzLl9wcm9jZXNzTWV0YUNyZWRzKG1ldGEuY3JlZCk7XG4gICAgfVxuICAgIGlmICh0aGlzLm9uTWV0YSkge1xuICAgICAgdGhpcy5vbk1ldGEobWV0YSk7XG4gICAgfVxuICB9XG4gIC8vIFByb2Nlc3MgcHJlc2VuY2UgY2hhbmdlIG1lc3NhZ2VcbiAgX3JvdXRlUHJlcyhwcmVzKSB7XG4gICAgbGV0IHVzZXIsIHVpZDtcbiAgICBzd2l0Y2ggKHByZXMud2hhdCkge1xuICAgICAgY2FzZSAnZGVsJzpcbiAgICAgICAgLy8gRGVsZXRlIGNhY2hlZCBtZXNzYWdlcy5cbiAgICAgICAgdGhpcy5fcHJvY2Vzc0RlbE1lc3NhZ2VzKHByZXMuY2xlYXIsIHByZXMuZGVsc2VxKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdvbic6XG4gICAgICBjYXNlICdvZmYnOlxuICAgICAgICAvLyBVcGRhdGUgb25saW5lIHN0YXR1cyBvZiBhIHN1YnNjcmlwdGlvbi5cbiAgICAgICAgdXNlciA9IHRoaXMuX3VzZXJzW3ByZXMuc3JjXTtcbiAgICAgICAgaWYgKHVzZXIpIHtcbiAgICAgICAgICB1c2VyLm9ubGluZSA9IHByZXMud2hhdCA9PSAnb24nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX3Rpbm9kZS5sb2dnZXIoXCJXQVJOSU5HOiBQcmVzZW5jZSB1cGRhdGUgZm9yIGFuIHVua25vd24gdXNlclwiLCB0aGlzLm5hbWUsIHByZXMuc3JjKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3Rlcm0nOlxuICAgICAgICAvLyBBdHRhY2htZW50IHRvIHRvcGljIGlzIHRlcm1pbmF0ZWQgcHJvYmFibHkgZHVlIHRvIGNsdXN0ZXIgcmVoYXNoaW5nLlxuICAgICAgICB0aGlzLl9yZXNldFN1YigpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3VwZCc6XG4gICAgICAgIC8vIEEgdG9waWMgc3Vic2NyaWJlciBoYXMgdXBkYXRlZCBoaXMgZGVzY3JpcHRpb24uXG4gICAgICAgIC8vIElzc3VlIHtnZXQgc3VifSBvbmx5IGlmIHRoZSBjdXJyZW50IHVzZXIgaGFzIG5vIHAycCB0b3BpY3Mgd2l0aCB0aGUgdXBkYXRlZCB1c2VyIChwMnAgbmFtZSBpcyBub3QgaW4gY2FjaGUpLlxuICAgICAgICAvLyBPdGhlcndpc2UgJ21lJyB3aWxsIGlzc3VlIGEge2dldCBkZXNjfSByZXF1ZXN0LlxuICAgICAgICBpZiAocHJlcy5zcmMgJiYgIXRoaXMuX3Rpbm9kZS5pc1RvcGljQ2FjaGVkKHByZXMuc3JjKSkge1xuICAgICAgICAgIHRoaXMuZ2V0TWV0YSh0aGlzLnN0YXJ0TWV0YVF1ZXJ5KCkud2l0aExhdGVyT25lU3ViKHByZXMuc3JjKS5idWlsZCgpKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2Fjcyc6XG4gICAgICAgIHVpZCA9IHByZXMuc3JjIHx8IHRoaXMuX3Rpbm9kZS5nZXRDdXJyZW50VXNlcklEKCk7XG4gICAgICAgIHVzZXIgPSB0aGlzLl91c2Vyc1t1aWRdO1xuICAgICAgICBpZiAoIXVzZXIpIHtcbiAgICAgICAgICAvLyBVcGRhdGUgZm9yIGFuIHVua25vd24gdXNlcjogbm90aWZpY2F0aW9uIG9mIGEgbmV3IHN1YnNjcmlwdGlvbi5cbiAgICAgICAgICBjb25zdCBhY3MgPSBuZXcgQWNjZXNzTW9kZSgpLnVwZGF0ZUFsbChwcmVzLmRhY3MpO1xuICAgICAgICAgIGlmIChhY3MgJiYgYWNzLm1vZGUgIT0gQWNjZXNzTW9kZS5fTk9ORSkge1xuICAgICAgICAgICAgdXNlciA9IHRoaXMuX2NhY2hlR2V0VXNlcih1aWQpO1xuICAgICAgICAgICAgaWYgKCF1c2VyKSB7XG4gICAgICAgICAgICAgIHVzZXIgPSB7XG4gICAgICAgICAgICAgICAgdXNlcjogdWlkLFxuICAgICAgICAgICAgICAgIGFjczogYWNzXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIHRoaXMuZ2V0TWV0YSh0aGlzLnN0YXJ0TWV0YVF1ZXJ5KCkud2l0aE9uZVN1Yih1bmRlZmluZWQsIHVpZCkuYnVpbGQoKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB1c2VyLmFjcyA9IGFjcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHVzZXIudXBkYXRlZCA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9wcm9jZXNzTWV0YVN1YihbdXNlcl0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBLbm93biB1c2VyXG4gICAgICAgICAgdXNlci5hY3MudXBkYXRlQWxsKHByZXMuZGFjcyk7XG4gICAgICAgICAgLy8gVXBkYXRlIHVzZXIncyBhY2Nlc3MgbW9kZS5cbiAgICAgICAgICB0aGlzLl9wcm9jZXNzTWV0YVN1Yihbe1xuICAgICAgICAgICAgdXNlcjogdWlkLFxuICAgICAgICAgICAgdXBkYXRlZDogbmV3IERhdGUoKSxcbiAgICAgICAgICAgIGFjczogdXNlci5hY3NcbiAgICAgICAgICB9XSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aGlzLl90aW5vZGUubG9nZ2VyKFwiSU5GTzogSWdub3JlZCBwcmVzZW5jZSB1cGRhdGVcIiwgcHJlcy53aGF0KTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vblByZXMpIHtcbiAgICAgIHRoaXMub25QcmVzKHByZXMpO1xuICAgIH1cbiAgfVxuICAvLyBQcm9jZXNzIHtpbmZvfSBtZXNzYWdlXG4gIF9yb3V0ZUluZm8oaW5mbykge1xuICAgIHN3aXRjaCAoaW5mby53aGF0KSB7XG4gICAgICBjYXNlICdyZWN2JzpcbiAgICAgIGNhc2UgJ3JlYWQnOlxuICAgICAgICBjb25zdCB1c2VyID0gdGhpcy5fdXNlcnNbaW5mby5mcm9tXTtcbiAgICAgICAgaWYgKHVzZXIpIHtcbiAgICAgICAgICB1c2VyW2luZm8ud2hhdF0gPSBpbmZvLnNlcTtcbiAgICAgICAgICBpZiAodXNlci5yZWN2IDwgdXNlci5yZWFkKSB7XG4gICAgICAgICAgICB1c2VyLnJlY3YgPSB1c2VyLnJlYWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG1zZyA9IHRoaXMubGF0ZXN0TWVzc2FnZSgpO1xuICAgICAgICBpZiAobXNnKSB7XG4gICAgICAgICAgdGhpcy5tc2dTdGF0dXMobXNnLCB0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIHRoaXMgaXMgYW4gdXBkYXRlIGZyb20gdGhlIGN1cnJlbnQgdXNlciwgdXBkYXRlIHRoZSBjYWNoZSB3aXRoIHRoZSBuZXcgY291bnQuXG4gICAgICAgIGlmICh0aGlzLl90aW5vZGUuaXNNZShpbmZvLmZyb20pKSB7XG4gICAgICAgICAgdGhpcy5fdXBkYXRlUmVhZFJlY3YoaW5mby53aGF0LCBpbmZvLnNlcSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBOb3RpZnkgJ21lJyBsaXN0ZW5lciBvZiB0aGUgc3RhdHVzIGNoYW5nZS5cbiAgICAgICAgdGhpcy5fdGlub2RlLmdldE1lVG9waWMoKS5fcmVmcmVzaENvbnRhY3QoaW5mby53aGF0LCB0aGlzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdrcCc6XG4gICAgICAgIC8vIERvIG5vdGhpbmcuXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnY2FsbCc6XG4gICAgICAgIC8vIERvIG5vdGhpbmcgaGVyZS5cbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aGlzLl90aW5vZGUubG9nZ2VyKFwiSU5GTzogSWdub3JlZCBpbmZvIHVwZGF0ZVwiLCBpbmZvLndoYXQpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm9uSW5mbykge1xuICAgICAgdGhpcy5vbkluZm8oaW5mbyk7XG4gICAgfVxuICB9XG4gIC8vIENhbGxlZCBieSBUaW5vZGUgd2hlbiBtZXRhLmRlc2MgcGFja2V0IGlzIHJlY2VpdmVkLlxuICAvLyBDYWxsZWQgYnkgJ21lJyB0b3BpYyBvbiBjb250YWN0IHVwZGF0ZSAoZGVzYy5fbm9Gb3J3YXJkaW5nIGlzIHRydWUpLlxuICBfcHJvY2Vzc01ldGFEZXNjKGRlc2MpIHtcbiAgICBpZiAodGhpcy5pc1AyUFR5cGUoKSkge1xuICAgICAgLy8gU3ludGhldGljIGRlc2MgbWF5IGluY2x1ZGUgZGVmYWNzIGZvciBwMnAgdG9waWNzIHdoaWNoIGlzIHVzZWxlc3MuXG4gICAgICAvLyBSZW1vdmUgaXQuXG4gICAgICBkZWxldGUgZGVzYy5kZWZhY3M7XG5cbiAgICAgIC8vIFVwZGF0ZSB0byBwMnAgZGVzYyBpcyB0aGUgc2FtZSBhcyB1c2VyIHVwZGF0ZS4gVXBkYXRlIGNhY2hlZCB1c2VyLlxuICAgICAgdGhpcy5fdGlub2RlLl9kYi51cGRVc2VyKHRoaXMubmFtZSwgZGVzYy5wdWJsaWMpO1xuICAgIH1cblxuICAgIC8vIENvcHkgcGFyYW1ldGVycyBmcm9tIGRlc2Mgb2JqZWN0IHRvIHRoaXMgdG9waWMuXG4gICAgbWVyZ2VPYmoodGhpcywgZGVzYyk7XG4gICAgLy8gVXBkYXRlIHBlcnNpc3RlbnQgY2FjaGUuXG4gICAgdGhpcy5fdGlub2RlLl9kYi51cGRUb3BpYyh0aGlzKTtcblxuICAgIC8vIE5vdGlmeSAnbWUnIGxpc3RlbmVyLCBpZiBhdmFpbGFibGU6XG4gICAgaWYgKHRoaXMubmFtZSAhPT0gQ29uc3QuVE9QSUNfTUUgJiYgIWRlc2MuX25vRm9yd2FyZGluZykge1xuICAgICAgY29uc3QgbWUgPSB0aGlzLl90aW5vZGUuZ2V0TWVUb3BpYygpO1xuICAgICAgaWYgKG1lLm9uTWV0YVN1Yikge1xuICAgICAgICBtZS5vbk1ldGFTdWIodGhpcyk7XG4gICAgICB9XG4gICAgICBpZiAobWUub25TdWJzVXBkYXRlZCkge1xuICAgICAgICBtZS5vblN1YnNVcGRhdGVkKFt0aGlzLm5hbWVdLCAxKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5vbk1ldGFEZXNjKSB7XG4gICAgICB0aGlzLm9uTWV0YURlc2ModGhpcyk7XG4gICAgfVxuICB9XG4gIC8vIENhbGxlZCBieSBUaW5vZGUgd2hlbiBtZXRhLnN1YiBpcyByZWNpdmVkIG9yIGluIHJlc3BvbnNlIHRvIHJlY2VpdmVkXG4gIC8vIHtjdHJsfSBhZnRlciBzZXRNZXRhLXN1Yi5cbiAgX3Byb2Nlc3NNZXRhU3ViKHN1YnMpIHtcbiAgICBmb3IgKGxldCBpZHggaW4gc3Vicykge1xuICAgICAgY29uc3Qgc3ViID0gc3Vic1tpZHhdO1xuXG4gICAgICAvLyBGaWxsIGRlZmF1bHRzLlxuICAgICAgc3ViLm9ubGluZSA9ICEhc3ViLm9ubGluZTtcbiAgICAgIC8vIFVwZGF0ZSB0aW1lc3RhbXAgb2YgdGhlIG1vc3QgcmVjZW50IHN1YnNjcmlwdGlvbiB1cGRhdGUuXG4gICAgICB0aGlzLl9sYXN0U3Vic1VwZGF0ZSA9IG5ldyBEYXRlKE1hdGgubWF4KHRoaXMuX2xhc3RTdWJzVXBkYXRlLCBzdWIudXBkYXRlZCkpO1xuXG4gICAgICBsZXQgdXNlciA9IG51bGw7XG4gICAgICBpZiAoIXN1Yi5kZWxldGVkKSB7XG4gICAgICAgIC8vIElmIHRoaXMgaXMgYSBjaGFuZ2UgdG8gdXNlcidzIG93biBwZXJtaXNzaW9ucywgdXBkYXRlIHRoZW0gaW4gdG9waWMgdG9vLlxuICAgICAgICAvLyBEZXNjIHdpbGwgdXBkYXRlICdtZScgdG9waWMuXG4gICAgICAgIGlmICh0aGlzLl90aW5vZGUuaXNNZShzdWIudXNlcikgJiYgc3ViLmFjcykge1xuICAgICAgICAgIHRoaXMuX3Byb2Nlc3NNZXRhRGVzYyh7XG4gICAgICAgICAgICB1cGRhdGVkOiBzdWIudXBkYXRlZCxcbiAgICAgICAgICAgIHRvdWNoZWQ6IHN1Yi50b3VjaGVkLFxuICAgICAgICAgICAgYWNzOiBzdWIuYWNzXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdXNlciA9IHRoaXMuX3VwZGF0ZUNhY2hlZFVzZXIoc3ViLnVzZXIsIHN1Yik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBTdWJzY3JpcHRpb24gaXMgZGVsZXRlZCwgcmVtb3ZlIGl0IGZyb20gdG9waWMgKGJ1dCBsZWF2ZSBpbiBVc2VycyBjYWNoZSlcbiAgICAgICAgZGVsZXRlIHRoaXMuX3VzZXJzW3N1Yi51c2VyXTtcbiAgICAgICAgdXNlciA9IHN1YjtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMub25NZXRhU3ViKSB7XG4gICAgICAgIHRoaXMub25NZXRhU3ViKHVzZXIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLm9uU3Vic1VwZGF0ZWQpIHtcbiAgICAgIHRoaXMub25TdWJzVXBkYXRlZChPYmplY3Qua2V5cyh0aGlzLl91c2VycykpO1xuICAgIH1cbiAgfVxuICAvLyBDYWxsZWQgYnkgVGlub2RlIHdoZW4gbWV0YS50YWdzIGlzIHJlY2l2ZWQuXG4gIF9wcm9jZXNzTWV0YVRhZ3ModGFncykge1xuICAgIGlmICh0YWdzLmxlbmd0aCA9PSAxICYmIHRhZ3NbMF0gPT0gQ29uc3QuREVMX0NIQVIpIHtcbiAgICAgIHRhZ3MgPSBbXTtcbiAgICB9XG4gICAgdGhpcy5fdGFncyA9IHRhZ3M7XG4gICAgaWYgKHRoaXMub25UYWdzVXBkYXRlZCkge1xuICAgICAgdGhpcy5vblRhZ3NVcGRhdGVkKHRhZ3MpO1xuICAgIH1cbiAgfVxuICAvLyBEbyBub3RoaW5nIGZvciB0b3BpY3Mgb3RoZXIgdGhhbiAnbWUnXG4gIF9wcm9jZXNzTWV0YUNyZWRzKGNyZWRzKSB7fVxuICAvLyBEZWxldGUgY2FjaGVkIG1lc3NhZ2VzIGFuZCB1cGRhdGUgY2FjaGVkIHRyYW5zYWN0aW9uIElEc1xuICBfcHJvY2Vzc0RlbE1lc3NhZ2VzKGNsZWFyLCBkZWxzZXEpIHtcbiAgICB0aGlzLl9tYXhEZWwgPSBNYXRoLm1heChjbGVhciwgdGhpcy5fbWF4RGVsKTtcbiAgICB0aGlzLmNsZWFyID0gTWF0aC5tYXgoY2xlYXIsIHRoaXMuY2xlYXIpO1xuICAgIGNvbnN0IHRvcGljID0gdGhpcztcbiAgICBsZXQgY291bnQgPSAwO1xuICAgIGlmIChBcnJheS5pc0FycmF5KGRlbHNlcSkpIHtcbiAgICAgIGRlbHNlcS5mb3JFYWNoKGZ1bmN0aW9uKHJhbmdlKSB7XG4gICAgICAgIGlmICghcmFuZ2UuaGkpIHtcbiAgICAgICAgICBjb3VudCsrO1xuICAgICAgICAgIHRvcGljLmZsdXNoTWVzc2FnZShyYW5nZS5sb3cpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZvciAobGV0IGkgPSByYW5nZS5sb3c7IGkgPCByYW5nZS5oaTsgaSsrKSB7XG4gICAgICAgICAgICBjb3VudCsrO1xuICAgICAgICAgICAgdG9waWMuZmx1c2hNZXNzYWdlKGkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKGNvdW50ID4gMCkge1xuICAgICAgLy8gdGhpcy5fdXBkYXRlRGVsZXRlZFJhbmdlcygpO1xuXG4gICAgICBpZiAodGhpcy5vbkRhdGEpIHtcbiAgICAgICAgdGhpcy5vbkRhdGEoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgLy8gVG9waWMgaXMgaW5mb3JtZWQgdGhhdCB0aGUgZW50aXJlIHJlc3BvbnNlIHRvIHtnZXQgd2hhdD1kYXRhfSBoYXMgYmVlbiByZWNlaXZlZC5cbiAgX2FsbE1lc3NhZ2VzUmVjZWl2ZWQoY291bnQpIHtcblxuICAgIGlmICh0aGlzLm9uQWxsTWVzc2FnZXNSZWNlaXZlZCkge1xuICAgICAgdGhpcy5vbkFsbE1lc3NhZ2VzUmVjZWl2ZWQoY291bnQpO1xuICAgIH1cbiAgfVxuICAvLyBSZXNldCBzdWJzY3JpYmVkIHN0YXRlXG4gIF9yZXNldFN1YigpIHtcbiAgICB0aGlzLl9hdHRhY2hlZCA9IGZhbHNlO1xuICB9XG4gIC8vIFRoaXMgdG9waWMgaXMgZWl0aGVyIGRlbGV0ZWQgb3IgdW5zdWJzY3JpYmVkIGZyb20uXG4gIF9nb25lKCkge1xuICAgIHRoaXMuX21lc3NhZ2VzLnJlc2V0KCk7XG4gICAgdGhpcy5fdGlub2RlLl9kYi5yZW1NZXNzYWdlcyh0aGlzLm5hbWUpO1xuICAgIHRoaXMuX3VzZXJzID0ge307XG4gICAgdGhpcy5hY3MgPSBuZXcgQWNjZXNzTW9kZShudWxsKTtcbiAgICB0aGlzLnByaXZhdGUgPSBudWxsO1xuICAgIHRoaXMucHVibGljID0gbnVsbDtcbiAgICB0aGlzLnRydXN0ZWQgPSBudWxsO1xuICAgIHRoaXMuX21heFNlcSA9IDA7XG4gICAgdGhpcy5fbWluU2VxID0gMDtcbiAgICB0aGlzLl9hdHRhY2hlZCA9IGZhbHNlO1xuXG4gICAgY29uc3QgbWUgPSB0aGlzLl90aW5vZGUuZ2V0TWVUb3BpYygpO1xuICAgIGlmIChtZSkge1xuICAgICAgbWUuX3JvdXRlUHJlcyh7XG4gICAgICAgIF9ub0ZvcndhcmRpbmc6IHRydWUsXG4gICAgICAgIHdoYXQ6ICdnb25lJyxcbiAgICAgICAgdG9waWM6IENvbnN0LlRPUElDX01FLFxuICAgICAgICBzcmM6IHRoaXMubmFtZVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlmICh0aGlzLm9uRGVsZXRlVG9waWMpIHtcbiAgICAgIHRoaXMub25EZWxldGVUb3BpYygpO1xuICAgIH1cbiAgfVxuICAvLyBVcGRhdGUgZ2xvYmFsIHVzZXIgY2FjaGUgYW5kIGxvY2FsIHN1YnNjcmliZXJzIGNhY2hlLlxuICAvLyBEb24ndCBjYWxsIHRoaXMgbWV0aG9kIGZvciBub24tc3Vic2NyaWJlcnMuXG4gIF91cGRhdGVDYWNoZWRVc2VyKHVpZCwgb2JqKSB7XG4gICAgLy8gRmV0Y2ggdXNlciBvYmplY3QgZnJvbSB0aGUgZ2xvYmFsIGNhY2hlLlxuICAgIC8vIFRoaXMgaXMgYSBjbG9uZSBvZiB0aGUgc3RvcmVkIG9iamVjdFxuICAgIGxldCBjYWNoZWQgPSB0aGlzLl9jYWNoZUdldFVzZXIodWlkKTtcbiAgICBjYWNoZWQgPSBtZXJnZU9iaihjYWNoZWQgfHwge30sIG9iaik7XG4gICAgLy8gU2F2ZSB0byBnbG9iYWwgY2FjaGVcbiAgICB0aGlzLl9jYWNoZVB1dFVzZXIodWlkLCBjYWNoZWQpO1xuICAgIC8vIFNhdmUgdG8gdGhlIGxpc3Qgb2YgdG9waWMgc3Vic3JpYmVycy5cbiAgICByZXR1cm4gbWVyZ2VUb0NhY2hlKHRoaXMuX3VzZXJzLCB1aWQsIGNhY2hlZCk7XG4gIH1cbiAgLy8gR2V0IGxvY2FsIHNlcUlkIGZvciBhIHF1ZXVlZCBtZXNzYWdlLlxuICBfZ2V0UXVldWVkU2VxSWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3F1ZXVlZFNlcUlkKys7XG4gIH1cblxuICAvLyBMb2FkIG1vc3QgcmVjZW50IG1lc3NhZ2VzIGZyb20gcGVyc2lzdGVudCBjYWNoZS5cbiAgX2xvYWRNZXNzYWdlcyhkYiwgcGFyYW1zKSB7XG4gICAgY29uc3Qge1xuICAgICAgc2luY2UsXG4gICAgICBiZWZvcmUsXG4gICAgICBsaW1pdFxuICAgIH0gPSBwYXJhbXMgfHwge307XG4gICAgcmV0dXJuIGRiLnJlYWRNZXNzYWdlcyh0aGlzLm5hbWUsIHtcbiAgICAgICAgc2luY2U6IHNpbmNlLFxuICAgICAgICBiZWZvcmU6IGJlZm9yZSxcbiAgICAgICAgbGltaXQ6IGxpbWl0IHx8IENvbnN0LkRFRkFVTFRfTUVTU0FHRVNfUEFHRVxuICAgICAgfSlcbiAgICAgIC50aGVuKG1zZ3MgPT4ge1xuICAgICAgICBtc2dzLmZvckVhY2goKGRhdGEpID0+IHtcbiAgICAgICAgICBpZiAoZGF0YS5zZXEgPiB0aGlzLl9tYXhTZXEpIHtcbiAgICAgICAgICAgIHRoaXMuX21heFNlcSA9IGRhdGEuc2VxO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZGF0YS5zZXEgPCB0aGlzLl9taW5TZXEgfHwgdGhpcy5fbWluU2VxID09IDApIHtcbiAgICAgICAgICAgIHRoaXMuX21pblNlcSA9IGRhdGEuc2VxO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLl9tZXNzYWdlcy5wdXQoZGF0YSk7XG4gICAgICAgICAgdGhpcy5fbWF5YmVVcGRhdGVNZXNzYWdlVmVyc2lvbnNDYWNoZShkYXRhKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBtc2dzLmxlbmd0aDtcbiAgICAgIH0pO1xuICB9XG4gIC8vIFB1c2ggb3Ige3ByZXN9OiBtZXNzYWdlIHJlY2VpdmVkLlxuICBfdXBkYXRlUmVjZWl2ZWQoc2VxLCBhY3QpIHtcbiAgICB0aGlzLnRvdWNoZWQgPSBuZXcgRGF0ZSgpO1xuICAgIHRoaXMuc2VxID0gc2VxIHwgMDtcbiAgICAvLyBDaGVjayBpZiBtZXNzYWdlIGlzIHNlbnQgYnkgdGhlIGN1cnJlbnQgdXNlci4gSWYgc28gaXQncyBiZWVuIHJlYWQgYWxyZWFkeS5cbiAgICBpZiAoIWFjdCB8fCB0aGlzLl90aW5vZGUuaXNNZShhY3QpKSB7XG4gICAgICB0aGlzLnJlYWQgPSB0aGlzLnJlYWQgPyBNYXRoLm1heCh0aGlzLnJlYWQsIHRoaXMuc2VxKSA6IHRoaXMuc2VxO1xuICAgICAgdGhpcy5yZWN2ID0gdGhpcy5yZWN2ID8gTWF0aC5tYXgodGhpcy5yZWFkLCB0aGlzLnJlY3YpIDogdGhpcy5yZWFkO1xuICAgIH1cbiAgICB0aGlzLnVucmVhZCA9IHRoaXMuc2VxIC0gKHRoaXMucmVhZCB8IDApO1xuICAgIHRoaXMuX3Rpbm9kZS5fZGIudXBkVG9waWModGhpcyk7XG4gIH1cbn1cblxuLyoqXG4gKiBAY2xhc3MgVG9waWNNZSAtIHNwZWNpYWwgY2FzZSBvZiB7QGxpbmsgVGlub2RlLlRvcGljfSBmb3JcbiAqIG1hbmFnaW5nIGRhdGEgb2YgdGhlIGN1cnJlbnQgdXNlciwgaW5jbHVkaW5nIGNvbnRhY3QgbGlzdC5cbiAqIEBleHRlbmRzIFRpbm9kZS5Ub3BpY1xuICogQG1lbWJlcm9mIFRpbm9kZVxuICpcbiAqIEBwYXJhbSB7VG9waWNNZS5DYWxsYmFja3N9IGNhbGxiYWNrcyAtIENhbGxiYWNrcyB0byByZWNlaXZlIHZhcmlvdXMgZXZlbnRzLlxuICovXG4vKipcbiAqIEBjbGFzcyBUb3BpY01lIC0gc3BlY2lhbCBjYXNlIG9mIHtAbGluayBUaW5vZGUuVG9waWN9IGZvclxuICogbWFuYWdpbmcgZGF0YSBvZiB0aGUgY3VycmVudCB1c2VyLCBpbmNsdWRpbmcgY29udGFjdCBsaXN0LlxuICogQGV4dGVuZHMgVGlub2RlLlRvcGljXG4gKiBAbWVtYmVyb2YgVGlub2RlXG4gKlxuICogQHBhcmFtIHtUb3BpY01lLkNhbGxiYWNrc30gY2FsbGJhY2tzIC0gQ2FsbGJhY2tzIHRvIHJlY2VpdmUgdmFyaW91cyBldmVudHMuXG4gKi9cbmV4cG9ydCBjbGFzcyBUb3BpY01lIGV4dGVuZHMgVG9waWMge1xuICBvbkNvbnRhY3RVcGRhdGU7XG5cbiAgY29uc3RydWN0b3IoY2FsbGJhY2tzKSB7XG4gICAgc3VwZXIoQ29uc3QuVE9QSUNfTUUsIGNhbGxiYWNrcyk7XG5cbiAgICAvLyBtZS1zcGVjaWZpYyBjYWxsYmFja3NcbiAgICBpZiAoY2FsbGJhY2tzKSB7XG4gICAgICB0aGlzLm9uQ29udGFjdFVwZGF0ZSA9IGNhbGxiYWNrcy5vbkNvbnRhY3RVcGRhdGU7XG4gICAgfVxuICB9XG5cbiAgLy8gT3ZlcnJpZGUgdGhlIG9yaWdpbmFsIFRvcGljLl9wcm9jZXNzTWV0YURlc2MuXG4gIF9wcm9jZXNzTWV0YURlc2MoZGVzYykge1xuICAgIC8vIENoZWNrIGlmIG9ubGluZSBjb250YWN0cyBuZWVkIHRvIGJlIHR1cm5lZCBvZmYgYmVjYXVzZSBQIHBlcm1pc3Npb24gd2FzIHJlbW92ZWQuXG4gICAgY29uc3QgdHVybk9mZiA9IChkZXNjLmFjcyAmJiAhZGVzYy5hY3MuaXNQcmVzZW5jZXIoKSkgJiYgKHRoaXMuYWNzICYmIHRoaXMuYWNzLmlzUHJlc2VuY2VyKCkpO1xuXG4gICAgLy8gQ29weSBwYXJhbWV0ZXJzIGZyb20gZGVzYyBvYmplY3QgdG8gdGhpcyB0b3BpYy5cbiAgICBtZXJnZU9iaih0aGlzLCBkZXNjKTtcbiAgICB0aGlzLl90aW5vZGUuX2RiLnVwZFRvcGljKHRoaXMpO1xuICAgIC8vIFVwZGF0ZSBjdXJyZW50IHVzZXIncyByZWNvcmQgaW4gdGhlIGdsb2JhbCBjYWNoZS5cbiAgICB0aGlzLl91cGRhdGVDYWNoZWRVc2VyKHRoaXMuX3Rpbm9kZS5fbXlVSUQsIGRlc2MpO1xuXG4gICAgLy8gJ1AnIHBlcm1pc3Npb24gd2FzIHJlbW92ZWQuIEFsbCB0b3BpY3MgYXJlIG9mZmxpbmUgbm93LlxuICAgIGlmICh0dXJuT2ZmKSB7XG4gICAgICB0aGlzLl90aW5vZGUubWFwVG9waWNzKChjb250KSA9PiB7XG4gICAgICAgIGlmIChjb250Lm9ubGluZSkge1xuICAgICAgICAgIGNvbnQub25saW5lID0gZmFsc2U7XG4gICAgICAgICAgY29udC5zZWVuID0gT2JqZWN0LmFzc2lnbihjb250LnNlZW4gfHwge30sIHtcbiAgICAgICAgICAgIHdoZW46IG5ldyBEYXRlKClcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0aGlzLl9yZWZyZXNoQ29udGFjdCgnb2ZmJywgY29udCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm9uTWV0YURlc2MpIHtcbiAgICAgIHRoaXMub25NZXRhRGVzYyh0aGlzKTtcbiAgICB9XG4gIH1cblxuICAvLyBPdmVycmlkZSB0aGUgb3JpZ2luYWwgVG9waWMuX3Byb2Nlc3NNZXRhU3ViXG4gIF9wcm9jZXNzTWV0YVN1YihzdWJzKSB7XG4gICAgbGV0IHVwZGF0ZUNvdW50ID0gMDtcbiAgICBzdWJzLmZvckVhY2goKHN1YikgPT4ge1xuICAgICAgY29uc3QgdG9waWNOYW1lID0gc3ViLnRvcGljO1xuICAgICAgLy8gRG9uJ3Qgc2hvdyAnbWUnIGFuZCAnZm5kJyB0b3BpY3MgaW4gdGhlIGxpc3Qgb2YgY29udGFjdHMuXG4gICAgICBpZiAodG9waWNOYW1lID09IENvbnN0LlRPUElDX0ZORCB8fCB0b3BpY05hbWUgPT0gQ29uc3QuVE9QSUNfTUUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgc3ViLm9ubGluZSA9ICEhc3ViLm9ubGluZTtcblxuICAgICAgbGV0IGNvbnQgPSBudWxsO1xuICAgICAgaWYgKHN1Yi5kZWxldGVkKSB7XG4gICAgICAgIGNvbnQgPSBzdWI7XG4gICAgICAgIHRoaXMuX3Rpbm9kZS5jYWNoZVJlbVRvcGljKHRvcGljTmFtZSk7XG4gICAgICAgIHRoaXMuX3Rpbm9kZS5fZGIucmVtVG9waWModG9waWNOYW1lKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEVuc3VyZSB0aGUgdmFsdWVzIGFyZSBkZWZpbmVkIGFuZCBhcmUgaW50ZWdlcnMuXG4gICAgICAgIGlmICh0eXBlb2Ygc3ViLnNlcSAhPSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIHN1Yi5zZXEgPSBzdWIuc2VxIHwgMDtcbiAgICAgICAgICBzdWIucmVjdiA9IHN1Yi5yZWN2IHwgMDtcbiAgICAgICAgICBzdWIucmVhZCA9IHN1Yi5yZWFkIHwgMDtcbiAgICAgICAgICBzdWIudW5yZWFkID0gc3ViLnNlcSAtIHN1Yi5yZWFkO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdG9waWMgPSB0aGlzLl90aW5vZGUuZ2V0VG9waWModG9waWNOYW1lKTtcbiAgICAgICAgaWYgKHRvcGljLl9uZXcpIHtcbiAgICAgICAgICBkZWxldGUgdG9waWMuX25ldztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnQgPSBtZXJnZU9iaih0b3BpYywgc3ViKTtcbiAgICAgICAgdGhpcy5fdGlub2RlLl9kYi51cGRUb3BpYyhjb250KTtcblxuICAgICAgICBpZiAoVG9waWMuaXNQMlBUb3BpY05hbWUodG9waWNOYW1lKSkge1xuICAgICAgICAgIHRoaXMuX2NhY2hlUHV0VXNlcih0b3BpY05hbWUsIGNvbnQpO1xuICAgICAgICAgIHRoaXMuX3Rpbm9kZS5fZGIudXBkVXNlcih0b3BpY05hbWUsIGNvbnQucHVibGljKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBOb3RpZnkgdG9waWMgb2YgdGhlIHVwZGF0ZSBpZiBpdCdzIGFuIGV4dGVybmFsIHVwZGF0ZS5cbiAgICAgICAgaWYgKCFzdWIuX25vRm9yd2FyZGluZyAmJiB0b3BpYykge1xuICAgICAgICAgIHN1Yi5fbm9Gb3J3YXJkaW5nID0gdHJ1ZTtcbiAgICAgICAgICB0b3BpYy5fcHJvY2Vzc01ldGFEZXNjKHN1Yik7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdXBkYXRlQ291bnQrKztcblxuICAgICAgaWYgKHRoaXMub25NZXRhU3ViKSB7XG4gICAgICAgIHRoaXMub25NZXRhU3ViKGNvbnQpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMub25TdWJzVXBkYXRlZCAmJiB1cGRhdGVDb3VudCA+IDApIHtcbiAgICAgIGNvbnN0IGtleXMgPSBbXTtcbiAgICAgIHN1YnMuZm9yRWFjaCgocykgPT4ge1xuICAgICAgICBrZXlzLnB1c2gocy50b3BpYyk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMub25TdWJzVXBkYXRlZChrZXlzLCB1cGRhdGVDb3VudCk7XG4gICAgfVxuICB9XG5cbiAgLy8gQ2FsbGVkIGJ5IFRpbm9kZSB3aGVuIG1ldGEuc3ViIGlzIHJlY2l2ZWQuXG4gIF9wcm9jZXNzTWV0YUNyZWRzKGNyZWRzLCB1cGQpIHtcbiAgICBpZiAoY3JlZHMubGVuZ3RoID09IDEgJiYgY3JlZHNbMF0gPT0gQ29uc3QuREVMX0NIQVIpIHtcbiAgICAgIGNyZWRzID0gW107XG4gICAgfVxuICAgIGlmICh1cGQpIHtcbiAgICAgIGNyZWRzLmZvckVhY2goKGNyKSA9PiB7XG4gICAgICAgIGlmIChjci52YWwpIHtcbiAgICAgICAgICAvLyBBZGRpbmcgYSBjcmVkZW50aWFsLlxuICAgICAgICAgIGxldCBpZHggPSB0aGlzLl9jcmVkZW50aWFscy5maW5kSW5kZXgoKGVsKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gZWwubWV0aCA9PSBjci5tZXRoICYmIGVsLnZhbCA9PSBjci52YWw7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKGlkeCA8IDApIHtcbiAgICAgICAgICAgIC8vIE5vdCBmb3VuZC5cbiAgICAgICAgICAgIGlmICghY3IuZG9uZSkge1xuICAgICAgICAgICAgICAvLyBVbmNvbmZpcm1lZCBjcmVkZW50aWFsIHJlcGxhY2VzIHByZXZpb3VzIHVuY29uZmlybWVkIGNyZWRlbnRpYWwgb2YgdGhlIHNhbWUgbWV0aG9kLlxuICAgICAgICAgICAgICBpZHggPSB0aGlzLl9jcmVkZW50aWFscy5maW5kSW5kZXgoKGVsKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVsLm1ldGggPT0gY3IubWV0aCAmJiAhZWwuZG9uZTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIGlmIChpZHggPj0gMCkge1xuICAgICAgICAgICAgICAgIC8vIFJlbW92ZSBwcmV2aW91cyB1bmNvbmZpcm1lZCBjcmVkZW50aWFsLlxuICAgICAgICAgICAgICAgIHRoaXMuX2NyZWRlbnRpYWxzLnNwbGljZShpZHgsIDEpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9jcmVkZW50aWFscy5wdXNoKGNyKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gRm91bmQuIE1heWJlIGNoYW5nZSAnZG9uZScgc3RhdHVzLlxuICAgICAgICAgICAgdGhpcy5fY3JlZGVudGlhbHNbaWR4XS5kb25lID0gY3IuZG9uZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoY3IucmVzcCkge1xuICAgICAgICAgIC8vIEhhbmRsZSBjcmVkZW50aWFsIGNvbmZpcm1hdGlvbi5cbiAgICAgICAgICBjb25zdCBpZHggPSB0aGlzLl9jcmVkZW50aWFscy5maW5kSW5kZXgoKGVsKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gZWwubWV0aCA9PSBjci5tZXRoICYmICFlbC5kb25lO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmIChpZHggPj0gMCkge1xuICAgICAgICAgICAgdGhpcy5fY3JlZGVudGlhbHNbaWR4XS5kb25lID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9jcmVkZW50aWFscyA9IGNyZWRzO1xuICAgIH1cbiAgICBpZiAodGhpcy5vbkNyZWRzVXBkYXRlZCkge1xuICAgICAgdGhpcy5vbkNyZWRzVXBkYXRlZCh0aGlzLl9jcmVkZW50aWFscyk7XG4gICAgfVxuICB9XG5cbiAgLy8gUHJvY2VzcyBwcmVzZW5jZSBjaGFuZ2UgbWVzc2FnZVxuICBfcm91dGVQcmVzKHByZXMpIHtcbiAgICBpZiAocHJlcy53aGF0ID09ICd0ZXJtJykge1xuICAgICAgLy8gVGhlICdtZScgdG9waWMgaXRzZWxmIGlzIGRldGFjaGVkLiBNYXJrIGFzIHVuc3Vic2NyaWJlZC5cbiAgICAgIHRoaXMuX3Jlc2V0U3ViKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHByZXMud2hhdCA9PSAndXBkJyAmJiBwcmVzLnNyYyA9PSBDb25zdC5UT1BJQ19NRSkge1xuICAgICAgLy8gVXBkYXRlIHRvIG1lJ3MgZGVzY3JpcHRpb24uIFJlcXVlc3QgdXBkYXRlZCB2YWx1ZS5cbiAgICAgIHRoaXMuZ2V0TWV0YSh0aGlzLnN0YXJ0TWV0YVF1ZXJ5KCkud2l0aERlc2MoKS5idWlsZCgpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBjb250ID0gdGhpcy5fdGlub2RlLmNhY2hlR2V0VG9waWMocHJlcy5zcmMpO1xuICAgIGlmIChjb250KSB7XG4gICAgICBzd2l0Y2ggKHByZXMud2hhdCkge1xuICAgICAgICBjYXNlICdvbic6IC8vIHRvcGljIGNhbWUgb25saW5lXG4gICAgICAgICAgY29udC5vbmxpbmUgPSB0cnVlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdvZmYnOiAvLyB0b3BpYyB3ZW50IG9mZmxpbmVcbiAgICAgICAgICBpZiAoY29udC5vbmxpbmUpIHtcbiAgICAgICAgICAgIGNvbnQub25saW5lID0gZmFsc2U7XG4gICAgICAgICAgICBjb250LnNlZW4gPSBPYmplY3QuYXNzaWduKGNvbnQuc2VlbiB8fCB7fSwge1xuICAgICAgICAgICAgICB3aGVuOiBuZXcgRGF0ZSgpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ21zZyc6IC8vIG5ldyBtZXNzYWdlIHJlY2VpdmVkXG4gICAgICAgICAgY29udC5fdXBkYXRlUmVjZWl2ZWQocHJlcy5zZXEsIHByZXMuYWN0KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAndXBkJzogLy8gZGVzYyB1cGRhdGVkXG4gICAgICAgICAgLy8gUmVxdWVzdCB1cGRhdGVkIHN1YnNjcmlwdGlvbi5cbiAgICAgICAgICB0aGlzLmdldE1ldGEodGhpcy5zdGFydE1ldGFRdWVyeSgpLndpdGhMYXRlck9uZVN1YihwcmVzLnNyYykuYnVpbGQoKSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2Fjcyc6IC8vIGFjY2VzcyBtb2RlIGNoYW5nZWRcbiAgICAgICAgICBpZiAoY29udC5hY3MpIHtcbiAgICAgICAgICAgIGNvbnQuYWNzLnVwZGF0ZUFsbChwcmVzLmRhY3MpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb250LmFjcyA9IG5ldyBBY2Nlc3NNb2RlKCkudXBkYXRlQWxsKHByZXMuZGFjcyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnQudG91Y2hlZCA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3VhJzpcbiAgICAgICAgICAvLyB1c2VyIGFnZW50IGNoYW5nZWQuXG4gICAgICAgICAgY29udC5zZWVuID0ge1xuICAgICAgICAgICAgd2hlbjogbmV3IERhdGUoKSxcbiAgICAgICAgICAgIHVhOiBwcmVzLnVhXG4gICAgICAgICAgfTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAncmVjdic6XG4gICAgICAgICAgLy8gdXNlcidzIG90aGVyIHNlc3Npb24gbWFya2VkIHNvbWUgbWVzc2dlcyBhcyByZWNlaXZlZC5cbiAgICAgICAgICBwcmVzLnNlcSA9IHByZXMuc2VxIHwgMDtcbiAgICAgICAgICBjb250LnJlY3YgPSBjb250LnJlY3YgPyBNYXRoLm1heChjb250LnJlY3YsIHByZXMuc2VxKSA6IHByZXMuc2VxO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdyZWFkJzpcbiAgICAgICAgICAvLyB1c2VyJ3Mgb3RoZXIgc2Vzc2lvbiBtYXJrZWQgc29tZSBtZXNzYWdlcyBhcyByZWFkLlxuICAgICAgICAgIHByZXMuc2VxID0gcHJlcy5zZXEgfCAwO1xuICAgICAgICAgIGNvbnQucmVhZCA9IGNvbnQucmVhZCA/IE1hdGgubWF4KGNvbnQucmVhZCwgcHJlcy5zZXEpIDogcHJlcy5zZXE7XG4gICAgICAgICAgY29udC5yZWN2ID0gY29udC5yZWN2ID8gTWF0aC5tYXgoY29udC5yZWFkLCBjb250LnJlY3YpIDogY29udC5yZWN2O1xuICAgICAgICAgIGNvbnQudW5yZWFkID0gY29udC5zZXEgLSBjb250LnJlYWQ7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2dvbmUnOlxuICAgICAgICAgIC8vIHRvcGljIGRlbGV0ZWQgb3IgdW5zdWJzY3JpYmVkIGZyb20uXG4gICAgICAgICAgaWYgKCFjb250Ll9kZWxldGVkKSB7XG4gICAgICAgICAgICBjb250Ll9kZWxldGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIGNvbnQuX2F0dGFjaGVkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLl90aW5vZGUuX2RiLm1hcmtUb3BpY0FzRGVsZXRlZChwcmVzLnNyYyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3Rpbm9kZS5fZGIucmVtVG9waWMocHJlcy5zcmMpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnZGVsJzpcbiAgICAgICAgICAvLyBVcGRhdGUgdG9waWMuZGVsIHZhbHVlLlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHRoaXMuX3Rpbm9kZS5sb2dnZXIoXCJJTkZPOiBVbnN1cHBvcnRlZCBwcmVzZW5jZSB1cGRhdGUgaW4gJ21lJ1wiLCBwcmVzLndoYXQpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9yZWZyZXNoQ29udGFjdChwcmVzLndoYXQsIGNvbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAocHJlcy53aGF0ID09ICdhY3MnKSB7XG4gICAgICAgIC8vIE5ldyBzdWJzY3JpcHRpb25zIGFuZCBkZWxldGVkL2Jhbm5lZCBzdWJzY3JpcHRpb25zIGhhdmUgZnVsbFxuICAgICAgICAvLyBhY2Nlc3MgbW9kZSAobm8gKyBvciAtIGluIHRoZSBkYWNzIHN0cmluZykuIENoYW5nZXMgdG8ga25vd24gc3Vic2NyaXB0aW9ucyBhcmUgc2VudCBhc1xuICAgICAgICAvLyBkZWx0YXMsIGJ1dCB0aGV5IHNob3VsZCBub3QgaGFwcGVuIGhlcmUuXG4gICAgICAgIGNvbnN0IGFjcyA9IG5ldyBBY2Nlc3NNb2RlKHByZXMuZGFjcyk7XG4gICAgICAgIGlmICghYWNzIHx8IGFjcy5tb2RlID09IEFjY2Vzc01vZGUuX0lOVkFMSUQpIHtcbiAgICAgICAgICB0aGlzLl90aW5vZGUubG9nZ2VyKFwiRVJST1I6IEludmFsaWQgYWNjZXNzIG1vZGUgdXBkYXRlXCIsIHByZXMuc3JjLCBwcmVzLmRhY3MpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIGlmIChhY3MubW9kZSA9PSBBY2Nlc3NNb2RlLl9OT05FKSB7XG4gICAgICAgICAgdGhpcy5fdGlub2RlLmxvZ2dlcihcIldBUk5JTkc6IFJlbW92aW5nIG5vbi1leGlzdGVudCBzdWJzY3JpcHRpb25cIiwgcHJlcy5zcmMsIHByZXMuZGFjcyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIE5ldyBzdWJzY3JpcHRpb24uIFNlbmQgcmVxdWVzdCBmb3IgdGhlIGZ1bGwgZGVzY3JpcHRpb24uXG4gICAgICAgICAgLy8gVXNpbmcgLndpdGhPbmVTdWIgKG5vdCAud2l0aExhdGVyT25lU3ViKSB0byBtYWtlIHN1cmUgSWZNb2RpZmllZFNpbmNlIGlzIG5vdCBzZXQuXG4gICAgICAgICAgdGhpcy5nZXRNZXRhKHRoaXMuc3RhcnRNZXRhUXVlcnkoKS53aXRoT25lU3ViKHVuZGVmaW5lZCwgcHJlcy5zcmMpLmJ1aWxkKCkpO1xuICAgICAgICAgIC8vIENyZWF0ZSBhIGR1bW15IGVudHJ5IHRvIGNhdGNoIG9ubGluZSBzdGF0dXMgdXBkYXRlLlxuICAgICAgICAgIGNvbnN0IGR1bW15ID0gdGhpcy5fdGlub2RlLmdldFRvcGljKHByZXMuc3JjKTtcbiAgICAgICAgICBkdW1teS50b3BpYyA9IHByZXMuc3JjO1xuICAgICAgICAgIGR1bW15Lm9ubGluZSA9IGZhbHNlO1xuICAgICAgICAgIGR1bW15LmFjcyA9IGFjcztcbiAgICAgICAgICB0aGlzLl90aW5vZGUuX2RiLnVwZFRvcGljKGR1bW15KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChwcmVzLndoYXQgPT0gJ3RhZ3MnKSB7XG4gICAgICAgIHRoaXMuZ2V0TWV0YSh0aGlzLnN0YXJ0TWV0YVF1ZXJ5KCkud2l0aFRhZ3MoKS5idWlsZCgpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5vblByZXMpIHtcbiAgICAgIHRoaXMub25QcmVzKHByZXMpO1xuICAgIH1cbiAgfVxuXG4gIC8vIENvbnRhY3QgaXMgdXBkYXRlZCwgZXhlY3V0ZSBjYWxsYmFja3MuXG4gIF9yZWZyZXNoQ29udGFjdCh3aGF0LCBjb250KSB7XG4gICAgaWYgKHRoaXMub25Db250YWN0VXBkYXRlKSB7XG4gICAgICB0aGlzLm9uQ29udGFjdFVwZGF0ZSh3aGF0LCBjb250KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUHVibGlzaGluZyB0byBUb3BpY01lIGlzIG5vdCBzdXBwb3J0ZWQuIHtAbGluayBUb3BpYyNwdWJsaXNofSBpcyBvdmVycmlkZW4gYW5kIHRob3dzIGFuIHtFcnJvcn0gaWYgY2FsbGVkLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljTWUjXG4gICAqIEB0aHJvd3Mge0Vycm9yfSBBbHdheXMgdGhyb3dzIGFuIGVycm9yLlxuICAgKi9cbiAgcHVibGlzaCgpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiUHVibGlzaGluZyB0byAnbWUnIGlzIG5vdCBzdXBwb3J0ZWRcIikpO1xuICB9XG5cbiAgLyoqXG4gICAqIERlbGV0ZSB2YWxpZGF0aW9uIGNyZWRlbnRpYWwuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWNNZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gZGVsZXRlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1c2VyIC0gVXNlciBJRCB0byByZW1vdmUuXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gcmVjZWl2aW5nIHNlcnZlciByZXBseS5cbiAgICovXG4gIGRlbENyZWRlbnRpYWwobWV0aG9kLCB2YWx1ZSkge1xuICAgIGlmICghdGhpcy5fYXR0YWNoZWQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJDYW5ub3QgZGVsZXRlIGNyZWRlbnRpYWwgaW4gaW5hY3RpdmUgJ21lJyB0b3BpY1wiKSk7XG4gICAgfVxuICAgIC8vIFNlbmQge2RlbH0gbWVzc2FnZSwgcmV0dXJuIHByb21pc2VcbiAgICByZXR1cm4gdGhpcy5fdGlub2RlLmRlbENyZWRlbnRpYWwobWV0aG9kLCB2YWx1ZSkudGhlbihjdHJsID0+IHtcbiAgICAgIC8vIFJlbW92ZSBkZWxldGVkIGNyZWRlbnRpYWwgZnJvbSB0aGUgY2FjaGUuXG4gICAgICBjb25zdCBpbmRleCA9IHRoaXMuX2NyZWRlbnRpYWxzLmZpbmRJbmRleCgoZWwpID0+IHtcbiAgICAgICAgcmV0dXJuIGVsLm1ldGggPT0gbWV0aG9kICYmIGVsLnZhbCA9PSB2YWx1ZTtcbiAgICAgIH0pO1xuICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgdGhpcy5fY3JlZGVudGlhbHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIH1cbiAgICAgIC8vIE5vdGlmeSBsaXN0ZW5lcnNcbiAgICAgIGlmICh0aGlzLm9uQ3JlZHNVcGRhdGVkKSB7XG4gICAgICAgIHRoaXMub25DcmVkc1VwZGF0ZWQodGhpcy5fY3JlZGVudGlhbHMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGN0cmw7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQGNhbGxiYWNrIGNvbnRhY3RGaWx0ZXJcbiAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRhY3QgdG8gY2hlY2sgZm9yIGluY2x1c2lvbi5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIGNvbnRhY3Qgc2hvdWxkIGJlIHByb2Nlc3NlZCwgPGNvZGU+ZmFsc2U8L2NvZGU+IHRvIGV4Y2x1ZGUgaXQuXG4gICAqL1xuICAvKipcbiAgICogSXRlcmF0ZSBvdmVyIGNhY2hlZCBjb250YWN0cy5cbiAgICpcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWNNZSNcbiAgICogQHBhcmFtIHtUb3BpY01lLkNvbnRhY3RDYWxsYmFja30gY2FsbGJhY2sgLSBDYWxsYmFjayB0byBjYWxsIGZvciBlYWNoIGNvbnRhY3QuXG4gICAqIEBwYXJhbSB7Y29udGFjdEZpbHRlcj19IGZpbHRlciAtIE9wdGlvbmFsbHkgZmlsdGVyIGNvbnRhY3RzOyBpbmNsdWRlIGFsbCBpZiBmaWx0ZXIgaXMgZmFsc2UtaXNoLCBvdGhlcndpc2VcbiAgICogICAgICBpbmNsdWRlIHRob3NlIGZvciB3aGljaCBmaWx0ZXIgcmV0dXJucyB0cnVlLWlzaC5cbiAgICogQHBhcmFtIHtPYmplY3Q9fSBjb250ZXh0IC0gQ29udGV4dCB0byB1c2UgZm9yIGNhbGxpbmcgdGhlIGBjYWxsYmFja2AsIGkuZS4gdGhlIHZhbHVlIG9mIGB0aGlzYCBpbnNpZGUgdGhlIGNhbGxiYWNrLlxuICAgKi9cbiAgY29udGFjdHMoY2FsbGJhY2ssIGZpbHRlciwgY29udGV4dCkge1xuICAgIHRoaXMuX3Rpbm9kZS5tYXBUb3BpY3MoKGMsIGlkeCkgPT4ge1xuICAgICAgaWYgKGMuaXNDb21tVHlwZSgpICYmICghZmlsdGVyIHx8IGZpbHRlcihjKSkpIHtcbiAgICAgICAgY2FsbGJhY2suY2FsbChjb250ZXh0LCBjLCBpZHgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhIGNvbnRhY3QgZnJvbSBjYWNoZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpY01lI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIGNvbnRhY3QgdG8gZ2V0LCBlaXRoZXIgYSBVSUQgKGZvciBwMnAgdG9waWNzKSBvciBhIHRvcGljIG5hbWUuXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuQ29udGFjdH0gLSBDb250YWN0IG9yIGB1bmRlZmluZWRgLlxuICAgKi9cbiAgZ2V0Q29udGFjdChuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuX3Rpbm9kZS5jYWNoZUdldFRvcGljKG5hbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhY2Nlc3MgbW9kZSBvZiBhIGdpdmVuIGNvbnRhY3QgZnJvbSBjYWNoZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpY01lI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIGNvbnRhY3QgdG8gZ2V0IGFjY2VzcyBtb2RlIGZvciwgZWl0aGVyIGEgVUlEIChmb3IgcDJwIHRvcGljcylcbiAgICogICAgICAgIG9yIGEgdG9waWMgbmFtZTsgaWYgbWlzc2luZywgYWNjZXNzIG1vZGUgZm9yIHRoZSAnbWUnIHRvcGljIGl0c2VsZi5cbiAgICogQHJldHVybnMge3N0cmluZ30gLSBhY2Nlc3MgbW9kZSwgc3VjaCBhcyBgUldQYC5cbiAgICovXG4gIGdldEFjY2Vzc01vZGUobmFtZSkge1xuICAgIGlmIChuYW1lKSB7XG4gICAgICBjb25zdCBjb250ID0gdGhpcy5fdGlub2RlLmNhY2hlR2V0VG9waWMobmFtZSk7XG4gICAgICByZXR1cm4gY29udCA/IGNvbnQuYWNzIDogbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuYWNzO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGNvbnRhY3QgaXMgYXJjaGl2ZWQsIGkuZS4gY29udGFjdC5wcml2YXRlLmFyY2ggPT0gdHJ1ZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpY01lI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIGNvbnRhY3QgdG8gY2hlY2sgYXJjaGl2ZWQgc3RhdHVzLCBlaXRoZXIgYSBVSUQgKGZvciBwMnAgdG9waWNzKSBvciBhIHRvcGljIG5hbWUuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIHRydWUgaWYgY29udGFjdCBpcyBhcmNoaXZlZCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgKi9cbiAgaXNBcmNoaXZlZChuYW1lKSB7XG4gICAgY29uc3QgY29udCA9IHRoaXMuX3Rpbm9kZS5jYWNoZUdldFRvcGljKG5hbWUpO1xuICAgIHJldHVybiBjb250ICYmIGNvbnQucHJpdmF0ZSAmJiAhIWNvbnQucHJpdmF0ZS5hcmNoO1xuICB9XG5cbiAgLyoqXG4gICAqIEB0eXBlZGVmIFRpbm9kZS5DcmVkZW50aWFsXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQHR5cGUgT2JqZWN0XG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBtZXRoIC0gdmFsaWRhdGlvbiBtZXRob2Qgc3VjaCBhcyAnZW1haWwnIG9yICd0ZWwnLlxuICAgKiBAcHJvcGVydHkge3N0cmluZ30gdmFsIC0gY3JlZGVudGlhbCB2YWx1ZSwgaS5lLiAnamRvZUBleGFtcGxlLmNvbScgb3IgJysxNzAyNTU1MTIzNCdcbiAgICogQHByb3BlcnR5IHtib29sZWFufSBkb25lIC0gdHJ1ZSBpZiBjcmVkZW50aWFsIGlzIHZhbGlkYXRlZC5cbiAgICovXG4gIC8qKlxuICAgKiBHZXQgdGhlIHVzZXIncyBjcmVkZW50aWFsczogZW1haWwsIHBob25lLCBldGMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWNNZSNcbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5DcmVkZW50aWFsW119IC0gYXJyYXkgb2YgY3JlZGVudGlhbHMuXG4gICAqL1xuICBnZXRDcmVkZW50aWFscygpIHtcbiAgICByZXR1cm4gdGhpcy5fY3JlZGVudGlhbHM7XG4gIH1cbn1cblxuLyoqXG4gKiBAY2xhc3MgVG9waWNGbmQgLSBzcGVjaWFsIGNhc2Ugb2Yge0BsaW5rIFRpbm9kZS5Ub3BpY30gZm9yIHNlYXJjaGluZyBmb3JcbiAqIGNvbnRhY3RzIGFuZCBncm91cCB0b3BpY3MuXG4gKiBAZXh0ZW5kcyBUaW5vZGUuVG9waWNcbiAqIEBtZW1iZXJvZiBUaW5vZGVcbiAqXG4gKiBAcGFyYW0ge1RvcGljRm5kLkNhbGxiYWNrc30gY2FsbGJhY2tzIC0gQ2FsbGJhY2tzIHRvIHJlY2VpdmUgdmFyaW91cyBldmVudHMuXG4gKi9cbmV4cG9ydCBjbGFzcyBUb3BpY0ZuZCBleHRlbmRzIFRvcGljIHtcbiAgLy8gTGlzdCBvZiB1c2VycyBhbmQgdG9waWNzIHVpZCBvciB0b3BpY19uYW1lIC0+IENvbnRhY3Qgb2JqZWN0KVxuICBfY29udGFjdHMgPSB7fTtcblxuICBjb25zdHJ1Y3RvcihjYWxsYmFja3MpIHtcbiAgICBzdXBlcihDb25zdC5UT1BJQ19GTkQsIGNhbGxiYWNrcyk7XG4gIH1cblxuICAvLyBPdmVycmlkZSB0aGUgb3JpZ2luYWwgVG9waWMuX3Byb2Nlc3NNZXRhU3ViXG4gIF9wcm9jZXNzTWV0YVN1YihzdWJzKSB7XG4gICAgbGV0IHVwZGF0ZUNvdW50ID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGhpcy5fY29udGFjdHMpLmxlbmd0aDtcbiAgICAvLyBSZXNldCBjb250YWN0IGxpc3QuXG4gICAgdGhpcy5fY29udGFjdHMgPSB7fTtcbiAgICBmb3IgKGxldCBpZHggaW4gc3Vicykge1xuICAgICAgbGV0IHN1YiA9IHN1YnNbaWR4XTtcbiAgICAgIGNvbnN0IGluZGV4QnkgPSBzdWIudG9waWMgPyBzdWIudG9waWMgOiBzdWIudXNlcjtcblxuICAgICAgc3ViID0gbWVyZ2VUb0NhY2hlKHRoaXMuX2NvbnRhY3RzLCBpbmRleEJ5LCBzdWIpO1xuICAgICAgdXBkYXRlQ291bnQrKztcblxuICAgICAgaWYgKHRoaXMub25NZXRhU3ViKSB7XG4gICAgICAgIHRoaXMub25NZXRhU3ViKHN1Yik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHVwZGF0ZUNvdW50ID4gMCAmJiB0aGlzLm9uU3Vic1VwZGF0ZWQpIHtcbiAgICAgIHRoaXMub25TdWJzVXBkYXRlZChPYmplY3Qua2V5cyh0aGlzLl9jb250YWN0cykpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBQdWJsaXNoaW5nIHRvIFRvcGljRm5kIGlzIG5vdCBzdXBwb3J0ZWQuIHtAbGluayBUb3BpYyNwdWJsaXNofSBpcyBvdmVycmlkZW4gYW5kIHRob3dzIGFuIHtFcnJvcn0gaWYgY2FsbGVkLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljRm5kI1xuICAgKiBAdGhyb3dzIHtFcnJvcn0gQWx3YXlzIHRocm93cyBhbiBlcnJvci5cbiAgICovXG4gIHB1Ymxpc2goKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIlB1Ymxpc2hpbmcgdG8gJ2ZuZCcgaXMgbm90IHN1cHBvcnRlZFwiKSk7XG4gIH1cblxuICAvKipcbiAgICogc2V0TWV0YSB0byBUb3BpY0ZuZCByZXNldHMgY29udGFjdCBsaXN0IGluIGFkZGl0aW9uIHRvIHNlbmRpbmcgdGhlIG1lc3NhZ2UuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWNGbmQjXG4gICAqIEBwYXJhbSB7VGlub2RlLlNldFBhcmFtc30gcGFyYW1zIHBhcmFtZXRlcnMgdG8gdXBkYXRlLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBzZXJ2ZXIgcmVzcG9uZHMgdG8gcmVxdWVzdC5cbiAgICovXG4gIHNldE1ldGEocGFyYW1zKSB7XG4gICAgcmV0dXJuIE9iamVjdC5nZXRQcm90b3R5cGVPZihUb3BpY0ZuZC5wcm90b3R5cGUpLnNldE1ldGEuY2FsbCh0aGlzLCBwYXJhbXMpLnRoZW4oXyA9PiB7XG4gICAgICBpZiAoT2JqZWN0LmtleXModGhpcy5fY29udGFjdHMpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdGhpcy5fY29udGFjdHMgPSB7fTtcbiAgICAgICAgaWYgKHRoaXMub25TdWJzVXBkYXRlZCkge1xuICAgICAgICAgIHRoaXMub25TdWJzVXBkYXRlZChbXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJdGVyYXRlIG92ZXIgZm91bmQgY29udGFjdHMuIElmIGNhbGxiYWNrIGlzIHVuZGVmaW5lZCwgdXNlIHtAbGluayB0aGlzLm9uTWV0YVN1Yn0uXG4gICAqIEBmdW5jdGlvblxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljRm5kI1xuICAgKiBAcGFyYW0ge1RvcGljRm5kLkNvbnRhY3RDYWxsYmFja30gY2FsbGJhY2sgLSBDYWxsYmFjayB0byBjYWxsIGZvciBlYWNoIGNvbnRhY3QuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZXh0IC0gQ29udGV4dCB0byB1c2UgZm9yIGNhbGxpbmcgdGhlIGBjYWxsYmFja2AsIGkuZS4gdGhlIHZhbHVlIG9mIGB0aGlzYCBpbnNpZGUgdGhlIGNhbGxiYWNrLlxuICAgKi9cbiAgY29udGFjdHMoY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICBjb25zdCBjYiA9IChjYWxsYmFjayB8fCB0aGlzLm9uTWV0YVN1Yik7XG4gICAgaWYgKGNiKSB7XG4gICAgICBmb3IgKGxldCBpZHggaW4gdGhpcy5fY29udGFjdHMpIHtcbiAgICAgICAgY2IuY2FsbChjb250ZXh0LCB0aGlzLl9jb250YWN0c1tpZHhdLCBpZHgsIHRoaXMuX2NvbnRhY3RzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiIsIi8qKlxuICogQGZpbGUgVXRpbGl0aWVzIHVzZWQgaW4gbXVsdGlwbGUgcGxhY2VzLlxuICpcbiAqIEBjb3B5cmlnaHQgMjAxNS0yMDIyIFRpbm9kZSBMTEMuXG4gKi9cbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IEFjY2Vzc01vZGUgZnJvbSAnLi9hY2Nlc3MtbW9kZS5qcyc7XG5pbXBvcnQge1xuICBERUxfQ0hBUlxufSBmcm9tICcuL2NvbmZpZy5qcyc7XG5cbi8vIEF0dGVtcHQgdG8gY29udmVydCBkYXRlIGFuZCBBY2Nlc3NNb2RlIHN0cmluZ3MgdG8gb2JqZWN0cy5cbmV4cG9ydCBmdW5jdGlvbiBqc29uUGFyc2VIZWxwZXIoa2V5LCB2YWwpIHtcbiAgLy8gVHJ5IHRvIGNvbnZlcnQgc3RyaW5nIHRpbWVzdGFtcHMgd2l0aCBvcHRpb25hbCBtaWxsaXNlY29uZHMgdG8gRGF0ZSxcbiAgLy8gZS5nLiAyMDE1LTA5LTAyVDAxOjQ1OjQzWy4xMjNdWlxuICBpZiAodHlwZW9mIHZhbCA9PSAnc3RyaW5nJyAmJiB2YWwubGVuZ3RoID49IDIwICYmIHZhbC5sZW5ndGggPD0gMjQgJiYgWyd0cycsICd0b3VjaGVkJywgJ3VwZGF0ZWQnLCAnY3JlYXRlZCcsICd3aGVuJywgJ2RlbGV0ZWQnLCAnZXhwaXJlcyddLmluY2x1ZGVzKGtleSkpIHtcbiAgICBjb25zdCBkYXRlID0gbmV3IERhdGUodmFsKTtcbiAgICBpZiAoIWlzTmFOKGRhdGUpKSB7XG4gICAgICByZXR1cm4gZGF0ZTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoa2V5ID09PSAnYWNzJyAmJiB0eXBlb2YgdmFsID09PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBuZXcgQWNjZXNzTW9kZSh2YWwpO1xuICB9XG4gIHJldHVybiB2YWw7XG59XG5cbi8vIENoZWNrcyBpZiBVUkwgaXMgYSByZWxhdGl2ZSB1cmwsIGkuZS4gaGFzIG5vICdzY2hlbWU6Ly8nLCBpbmNsdWRpbmcgdGhlIGNhc2Ugb2YgbWlzc2luZyBzY2hlbWUgJy8vJy5cbi8vIFRoZSBzY2hlbWUgaXMgZXhwZWN0ZWQgdG8gYmUgUkZDLWNvbXBsaWFudCwgZS5nLiBbYS16XVthLXowLTkrLi1dKlxuLy8gZXhhbXBsZS5odG1sIC0gb2tcbi8vIGh0dHBzOmV4YW1wbGUuY29tIC0gbm90IG9rLlxuLy8gaHR0cDovZXhhbXBsZS5jb20gLSBub3Qgb2suXG4vLyAnIOKGsiBodHRwczovL2V4YW1wbGUuY29tJyAtIG5vdCBvay4gKOKGsiBtZWFucyBjYXJyaWFnZSByZXR1cm4pXG5leHBvcnQgZnVuY3Rpb24gaXNVcmxSZWxhdGl2ZSh1cmwpIHtcbiAgcmV0dXJuIHVybCAmJiAhL15cXHMqKFthLXpdW2EtejAtOSsuLV0qOnxcXC9cXC8pL2ltLnRlc3QodXJsKTtcbn1cblxuZnVuY3Rpb24gaXNWYWxpZERhdGUoZCkge1xuICByZXR1cm4gKGQgaW5zdGFuY2VvZiBEYXRlKSAmJiAhaXNOYU4oZCkgJiYgKGQuZ2V0VGltZSgpICE9IDApO1xufVxuXG4vLyBSRkMzMzM5IGZvcm1hdGVyIG9mIERhdGVcbmV4cG9ydCBmdW5jdGlvbiByZmMzMzM5RGF0ZVN0cmluZyhkKSB7XG4gIGlmICghaXNWYWxpZERhdGUoZCkpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgY29uc3QgcGFkID0gZnVuY3Rpb24odmFsLCBzcCkge1xuICAgIHNwID0gc3AgfHwgMjtcbiAgICByZXR1cm4gJzAnLnJlcGVhdChzcCAtICgnJyArIHZhbCkubGVuZ3RoKSArIHZhbDtcbiAgfTtcblxuICBjb25zdCBtaWxsaXMgPSBkLmdldFVUQ01pbGxpc2Vjb25kcygpO1xuICByZXR1cm4gZC5nZXRVVENGdWxsWWVhcigpICsgJy0nICsgcGFkKGQuZ2V0VVRDTW9udGgoKSArIDEpICsgJy0nICsgcGFkKGQuZ2V0VVRDRGF0ZSgpKSArXG4gICAgJ1QnICsgcGFkKGQuZ2V0VVRDSG91cnMoKSkgKyAnOicgKyBwYWQoZC5nZXRVVENNaW51dGVzKCkpICsgJzonICsgcGFkKGQuZ2V0VVRDU2Vjb25kcygpKSArXG4gICAgKG1pbGxpcyA/ICcuJyArIHBhZChtaWxsaXMsIDMpIDogJycpICsgJ1onO1xufVxuXG4vLyBSZWN1cnNpdmVseSBtZXJnZSBzcmMncyBvd24gcHJvcGVydGllcyB0byBkc3QuXG4vLyBJZ25vcmUgcHJvcGVydGllcyB3aGVyZSBpZ25vcmVbcHJvcGVydHldIGlzIHRydWUuXG4vLyBBcnJheSBhbmQgRGF0ZSBvYmplY3RzIGFyZSBzaGFsbG93LWNvcGllZC5cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZU9iaihkc3QsIHNyYywgaWdub3JlKSB7XG4gIGlmICh0eXBlb2Ygc3JjICE9ICdvYmplY3QnKSB7XG4gICAgaWYgKHNyYyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gZHN0O1xuICAgIH1cbiAgICBpZiAoc3JjID09PSBERUxfQ0hBUikge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgcmV0dXJuIHNyYztcbiAgfVxuICAvLyBKUyBpcyBjcmF6eTogdHlwZW9mIG51bGwgaXMgJ29iamVjdCcuXG4gIGlmIChzcmMgPT09IG51bGwpIHtcbiAgICByZXR1cm4gc3JjO1xuICB9XG5cbiAgLy8gSGFuZGxlIERhdGVcbiAgaWYgKHNyYyBpbnN0YW5jZW9mIERhdGUgJiYgIWlzTmFOKHNyYykpIHtcbiAgICByZXR1cm4gKCFkc3QgfHwgIShkc3QgaW5zdGFuY2VvZiBEYXRlKSB8fCBpc05hTihkc3QpIHx8IGRzdCA8IHNyYykgPyBzcmMgOiBkc3Q7XG4gIH1cblxuICAvLyBBY2Nlc3MgbW9kZVxuICBpZiAoc3JjIGluc3RhbmNlb2YgQWNjZXNzTW9kZSkge1xuICAgIHJldHVybiBuZXcgQWNjZXNzTW9kZShzcmMpO1xuICB9XG5cbiAgLy8gSGFuZGxlIEFycmF5XG4gIGlmIChzcmMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgIHJldHVybiBzcmM7XG4gIH1cblxuICBpZiAoIWRzdCB8fCBkc3QgPT09IERFTF9DSEFSKSB7XG4gICAgZHN0ID0gc3JjLmNvbnN0cnVjdG9yKCk7XG4gIH1cblxuICBmb3IgKGxldCBwcm9wIGluIHNyYykge1xuICAgIGlmIChzcmMuaGFzT3duUHJvcGVydHkocHJvcCkgJiYgKCFpZ25vcmUgfHwgIWlnbm9yZVtwcm9wXSkgJiYgKHByb3AgIT0gJ19ub0ZvcndhcmRpbmcnKSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgZHN0W3Byb3BdID0gbWVyZ2VPYmooZHN0W3Byb3BdLCBzcmNbcHJvcF0pO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIC8vIEZJWE1FOiBwcm9iYWJseSBuZWVkIHRvIGxvZyBzb21ldGhpbmcgaGVyZS5cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRzdDtcbn1cblxuLy8gVXBkYXRlIG9iamVjdCBzdG9yZWQgaW4gYSBjYWNoZS4gUmV0dXJucyB1cGRhdGVkIHZhbHVlLlxuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlVG9DYWNoZShjYWNoZSwga2V5LCBuZXd2YWwsIGlnbm9yZSkge1xuICBjYWNoZVtrZXldID0gbWVyZ2VPYmooY2FjaGVba2V5XSwgbmV3dmFsLCBpZ25vcmUpO1xuICByZXR1cm4gY2FjaGVba2V5XTtcbn1cblxuLy8gU3RyaXBzIGFsbCB2YWx1ZXMgZnJvbSBhbiBvYmplY3Qgb2YgdGhleSBldmFsdWF0ZSB0byBmYWxzZSBvciBpZiB0aGVpciBuYW1lIHN0YXJ0cyB3aXRoICdfJy5cbi8vIFVzZWQgb24gYWxsIG91dGdvaW5nIG9iamVjdCBiZWZvcmUgc2VyaWFsaXphdGlvbiB0byBzdHJpbmcuXG5leHBvcnQgZnVuY3Rpb24gc2ltcGxpZnkob2JqKSB7XG4gIE9iamVjdC5rZXlzKG9iaikuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgaWYgKGtleVswXSA9PSAnXycpIHtcbiAgICAgIC8vIFN0cmlwIGZpZWxkcyBsaWtlIFwib2JqLl9rZXlcIi5cbiAgICAgIGRlbGV0ZSBvYmpba2V5XTtcbiAgICB9IGVsc2UgaWYgKCFvYmpba2V5XSkge1xuICAgICAgLy8gU3RyaXAgZmllbGRzIHdoaWNoIGV2YWx1YXRlIHRvIGZhbHNlLlxuICAgICAgZGVsZXRlIG9ialtrZXldO1xuICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShvYmpba2V5XSkgJiYgb2JqW2tleV0ubGVuZ3RoID09IDApIHtcbiAgICAgIC8vIFN0cmlwIGVtcHR5IGFycmF5cy5cbiAgICAgIGRlbGV0ZSBvYmpba2V5XTtcbiAgICB9IGVsc2UgaWYgKCFvYmpba2V5XSkge1xuICAgICAgLy8gU3RyaXAgZmllbGRzIHdoaWNoIGV2YWx1YXRlIHRvIGZhbHNlLlxuICAgICAgZGVsZXRlIG9ialtrZXldO1xuICAgIH0gZWxzZSBpZiAob2JqW2tleV0gaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICAvLyBTdHJpcCBpbnZhbGlkIG9yIHplcm8gZGF0ZS5cbiAgICAgIGlmICghaXNWYWxpZERhdGUob2JqW2tleV0pKSB7XG4gICAgICAgIGRlbGV0ZSBvYmpba2V5XTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBvYmpba2V5XSA9PSAnb2JqZWN0Jykge1xuICAgICAgc2ltcGxpZnkob2JqW2tleV0pO1xuICAgICAgLy8gU3RyaXAgZW1wdHkgb2JqZWN0cy5cbiAgICAgIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhvYmpba2V5XSkubGVuZ3RoID09IDApIHtcbiAgICAgICAgZGVsZXRlIG9ialtrZXldO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBvYmo7XG59O1xuXG5cbi8vIFRyaW0gd2hpdGVzcGFjZSwgc3RyaXAgZW1wdHkgYW5kIGR1cGxpY2F0ZSBlbGVtZW50cyBlbGVtZW50cy5cbi8vIElmIHRoZSByZXN1bHQgaXMgYW4gZW1wdHkgYXJyYXksIGFkZCBhIHNpbmdsZSBlbGVtZW50IFwiXFx1MjQyMVwiIChVbmljb2RlIERlbCBjaGFyYWN0ZXIpLlxuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZUFycmF5KGFycikge1xuICBsZXQgb3V0ID0gW107XG4gIGlmIChBcnJheS5pc0FycmF5KGFycikpIHtcbiAgICAvLyBUcmltLCB0aHJvdyBhd2F5IHZlcnkgc2hvcnQgYW5kIGVtcHR5IHRhZ3MuXG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSBhcnIubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBsZXQgdCA9IGFycltpXTtcbiAgICAgIGlmICh0KSB7XG4gICAgICAgIHQgPSB0LnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBpZiAodC5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgb3V0LnB1c2godCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgb3V0LnNvcnQoKS5maWx0ZXIoZnVuY3Rpb24oaXRlbSwgcG9zLCBhcnkpIHtcbiAgICAgIHJldHVybiAhcG9zIHx8IGl0ZW0gIT0gYXJ5W3BvcyAtIDFdO1xuICAgIH0pO1xuICB9XG4gIGlmIChvdXQubGVuZ3RoID09IDApIHtcbiAgICAvLyBBZGQgc2luZ2xlIHRhZyB3aXRoIGEgVW5pY29kZSBEZWwgY2hhcmFjdGVyLCBvdGhlcndpc2UgYW4gYW1wdHkgYXJyYXlcbiAgICAvLyBpcyBhbWJpZ3Vvcy4gVGhlIERlbCB0YWcgd2lsbCBiZSBzdHJpcHBlZCBieSB0aGUgc2VydmVyLlxuICAgIG91dC5wdXNoKERFTF9DSEFSKTtcbiAgfVxuICByZXR1cm4gb3V0O1xufVxuIiwibW9kdWxlLmV4cG9ydHM9e1widmVyc2lvblwiOiBcIjAuMjEuMC1iZXRhMVwifVxuIl19

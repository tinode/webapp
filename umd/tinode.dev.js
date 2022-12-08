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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYWNjZXNzLW1vZGUuanMiLCJzcmMvY2J1ZmZlci5qcyIsInNyYy9jb25maWcuanMiLCJzcmMvY29ubmVjdGlvbi5qcyIsInNyYy9kYi5qcyIsInNyYy9kcmFmdHkuanMiLCJzcmMvbGFyZ2UtZmlsZS5qcyIsInNyYy9tZXRhLWJ1aWxkZXIuanMiLCJzcmMvdGlub2RlLmpzIiwic3JjL3RvcGljLmpzIiwic3JjL3V0aWxzLmpzIiwidmVyc2lvbi5qc29uIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDS0EsWUFBWTtBQUFDO0VBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQWNFLE1BQU0sVUFBVSxDQUFDO0VBQzlCLFdBQVcsQ0FBQyxHQUFHLEVBQUU7SUFDZixJQUFJLEdBQUcsRUFBRTtNQUNQLElBQUksQ0FBQyxLQUFLLEdBQUcsT0FBTyxHQUFHLENBQUMsS0FBSyxJQUFJLFFBQVEsR0FBRyxHQUFHLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQztNQUNwRixJQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sR0FBRyxDQUFDLElBQUksSUFBSSxRQUFRLEdBQUcsR0FBRyxDQUFDLElBQUksR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUM7TUFDaEYsSUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxHQUFJLE9BQU8sR0FBRyxDQUFDLElBQUksSUFBSSxRQUFRLEdBQUcsR0FBRyxDQUFDLElBQUksR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FDekYsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSztJQUM1QjtFQUNGO0VBaUJBLE9BQU8sTUFBTSxDQUFDLEdBQUcsRUFBRTtJQUNqQixJQUFJLENBQUMsR0FBRyxFQUFFO01BQ1Is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RUFBRSxHQUFHO0lBQ1gsTUFBTSxFQUFFO0VBQ1YsQ0FBQztFQUNELEVBQUUsRUFBRTtJQUNGLFFBQVEsRUFBRSxLQUFLO0lBQ2YsTUFBTSxFQUFFLEdBQUc7SUFDWCxNQUFNLEVBQUU7RUFDVixDQUFDO0VBQ0QsRUFBRSxFQUFFO0lBQ0YsUUFBUSxFQUFFLEdBQUc7SUFDYixNQUFNLEVBQUUsR0FBRztJQUNYLE1BQU0sRUFBRTtFQUNWLENBQUM7RUFDRCxFQUFFLEVBQUU7SUFDRixRQUFRLEVBQUUsRUFBRTtJQUNaLE1BQU0sRUFBRSxTQUFTO0lBQ2pCLE1BQU0sRUFBRTtFQUNWLENBQUM7RUFDRCxFQUFFLEVBQUU7SUFDRixRQUFRLEVBQUUsS0FBSztJQUNmLE1BQU0sRUFBRSxTQUFTO0lBQ2pCLE1BQU0sRUFBRTtFQUNWLENBQUM7RUFDRCxFQUFFLEVBQUU7SUFDRixRQUFRLEVBQUUsRUFBRTtJQUNaLE1BQU0sRUFBRSxTQUFTO0lBQ2pCLE1BQU0sRUFBRTtFQUNWLENBQUM7RUFDRCxFQUFFLEVBQUU7SUFDRixRQUFRLEVBQUUsTUFBTTtJQUNoQixNQUFNLEVBQUUsU0FBUztJQUNqQixNQUFNLEVBQUU7RUFDVixDQUFDO0VBQ0QsRUFBRSxFQUFFO0lBQ0YsUUFBUSxFQUFFLEdBQUc7SUFDYixNQUFNLEVBQUUsU0FBUztJQUNqQixNQUFNLEVBQUU7RUFDVixDQUFDO0VBQ0QsRUFBRSxFQUFFO0lBQ0YsUUFBUSxFQUFFLEtBQUs7SUFDZixNQUFNLEVBQUUsU0FBUztJQUNqQixNQUFNLEVBQUU7RUFDVixDQUFDO0VBQ0QsRUFBRSxFQUFFO0lBQ0YsUUFBUSxFQUFFLEdBQUc7SUFDYixNQUFNLEVBQUUsU0FBUztJQUNqQixNQUFNLEVBQUU7RUFDVixDQUFDO0VBQ0QsRUFBRSxFQUFFO0lBQ0YsUUFBUSxFQUFFLEdBQUc7SUFDYixNQUFNLEVBQUUsU0FBUztJQUNqQixNQUFNLEVBQUU7RUFDVixDQUFDO0VBQ0QsRUFBRSxFQUFFO0lBQ0YsUUFBUSxFQUFFLEtBQUs7SUFDZixNQUFNLEVBQUUsU0FBUztJ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QUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7SUFDbEIsTUFBTSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRztJQUN2QixNQUFNLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDO0lBRXhELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO01BQ25DLE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7TUFDcEIsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQztNQUVwQyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQztRQUNkLEVBQUUsRUFBRSxJQUFJO1FBQ1IsR0FBRyxFQUFFLENBQUM7UUFDTixFQUFFLEVBQUUsTUFBTSxHQUFHO01BQ2YsQ0FBQyxDQUFDO01BRUYsTUFBTSxDQUFDLEdBQUcsSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUc7TUFDN0IsSUFBSSxLQUFLLENBQUMsR0FBRyxFQUFFO1FBQ2IsTUFBTSxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBRSxDQUFDLElBQUs7VUFDbEQsQ0FBQyxDQUFDLEVBQUUsSUFBSSxNQUFNO1VBQ2QsT0FBTyxDQUFDO1FBQ1YsQ0FBQyxDQUFDLENBQUM7TUFDTDtNQUNBLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRTtRQUNiLE1BQU0sQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUUsQ0FBQyxJQUFLO1VBQ2xELENBQUMsQ0FBQyxFQUFFLElB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UUFDTCxPQUFPLEVBQUU7VUFDUCxJQUFJLEVBQUUsSUFBSSxDQUFDLGVBQWUsRUFBRTtVQUM1QixRQUFRLEVBQUUsSUFBSTtVQUNkLFFBQVEsRUFBRTtRQUNaO01BQ0YsQ0FBQztJQUVILEtBQUssS0FBSztNQUNSLE9BQU87UUFDTCxLQUFLLEVBQUU7VUFDTCxJQUFJLEVBQUUsSUFBSSxDQUFDLGVBQWUsRUFBRTtVQUM1QixPQUFPLEVBQUUsS0FBSztVQUNkLEtBQUssRUFBRSxDQUFDLENBQUM7VUFDVCxLQUFLLEVBQUUsQ0FBQztRQUNWO01BQ0YsQ0FBQztJQUVILEtBQUssT0FBTztNQUNWLE9BQU87UUFDTCxPQUFPLEVBQUU7VUFDUCxJQUFJLEVBQUUsSUFBSSxDQUFDLGVBQWUsRUFBRTtVQUM1QixPQUFPLEVBQUUsS0FBSztVQUNkLE9BQU8sRUFBRTtRQUNYO01BQ0YsQ0FBQztJQUVILEtBQUssS0FBSztNQUNSLE9BQU87UUFDTCxLQUFLLEVBQUU7VUFDTCxJQUFJLEVBQUUsSUFBSSxDQUFDLGVBQWUsRUFBRTtVQUM1QixPQUFPLEVBQUUsS0FBSztVQUNkLFFBQVEsRUFBRSxLQUFLO1VBQ2YsTUFBTSxFQUFFLElBQUk7VUFDWixTQUFTLEVBQUUsQ0FBQztRQUNkO01BQ0YsQ0FBQztJQUVILEtBQUssS0FBSztNQUNSLE9BQU87UUFDTCxLQUFLLEVBQUU7VUFDTCxJQUFJLEVBQUUsSUFBSSxDQUFDLGVBQWUsRUFBRTtVQUM1QixPQUFPLEVBQUUsS0FBSztVQUNkLE1BQU0sRUFBRSxJQUFJO1VBQ1osTUFBTSxFQUFFLENBQUMsQ0FBQztVQUNWLEtBQUssRUFBRSxDQUFDLENBQUM7VUFDVCxNQUFNLEVBQUUsQ0FBQztRQUNYO01BQ0YsQ0FBQztJQUVILEtBQUssS0FBSztNQUNSLE9BQU87UUFDTCxLQUFLLEVBQUU7VUFDTCxJQUFJLEVBQUUsSUFBSSxDQUFDLGVBQWUsRUFBRTtVQUM1QixPQUFPLEVBQUUsS0FBSztVQUNkLE1BQU0sRUFBRSxDQUFDLENBQUM7VUFDVixLQUFLLEVBQUUsQ0FBQyxDQUFD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O0VBQ1osSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO0lBRXRCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7TUFDMUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztNQUNkLElBQUksQ0FBQyxFQUFFO1FBQ0wsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxXQUFXLEVBQUU7UUFDMUIsSUFBSSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtVQUNoQixHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNiO01BQ0Y7SUFDRjtJQUNBLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsVUFBUyxJQUFJLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRTtNQUN6QyxPQUFPLENBQUMsR0FBRyxJQUFJLElBQUksSUFBSSxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztJQUNyQyxDQUFDLENBQUM7RUFDSjtFQUNBLElBQUksR0FBRyxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7SUFHbkIsR0FBRyxDQUFDLElBQUksQ0FBQyxnQkFBUSxDQUFDO0VBQ3BCO0VBQ0EsT0FBTyxHQUFHO0FBQ1o7OztBQzVLQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLyoqXG4gKiBAZmlsZSBBY2Nlc3MgY29udHJvbCBtb2RlbC5cbiAqXG4gKiBAY29weXJpZ2h0IDIwMTUtMjAyMiBUaW5vZGUgTExDLlxuICovXG4ndXNlIHN0cmljdCc7XG5cbi8vIE5PVEUgVE8gREVWRUxPUEVSUzpcbi8vIExvY2FsaXphYmxlIHN0cmluZ3Mgc2hvdWxkIGJlIGRvdWJsZSBxdW90ZWQgXCLRgdGC0YDQvtC60LAg0L3QsCDQtNGA0YPQs9C+0Lwg0Y/Qt9GL0LrQtVwiLFxuLy8gbm9uLWxvY2FsaXphYmxlIHN0cmluZ3Mgc2hvdWxkIGJlIHNpbmdsZSBxdW90ZWQgJ25vbi1sb2NhbGl6ZWQnLlxuXG4vKipcbiAqIEhlbHBlciBjbGFzcyBmb3IgaGFuZGxpbmcgYWNjZXNzIG1vZGUuXG4gKlxuICogQGNsYXNzIEFjY2Vzc01vZGVcbiAqIEBtZW1iZXJvZiBUaW5vZGVcbiAqXG4gKiBAcGFyYW0ge0FjY2Vzc01vZGV8T2JqZWN0PX0gYWNzIC0gQWNjZXNzTW9kZSB0byBjb3B5IG9yIGFjY2VzcyBtb2RlIG9iamVjdCByZWNlaXZlZCBmcm9tIHRoZSBzZXJ2ZXIuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFjY2Vzc01vZGUge1xuICBjb25zdHJ1Y3RvcihhY3MpIHtcbiAgICBpZiAoYWNzKSB7XG4gICAgICB0aGlzLmdpdmVuID0gdHlwZW9mIGFjcy5naXZlbiA9PSAnbnVtYmVyJyA/IGFjcy5naXZlbiA6IEFjY2Vzc01vZGUuZGVjb2RlKGFjcy5naXZlbik7XG4gICAgICB0aGlzLndhbnQgPSB0eXBlb2YgYWNzLndhbnQgPT0gJ251bWJlcicgPyBhY3Mud2FudCA6IEFjY2Vzc01vZGUuZGVjb2RlKGFjcy53YW50KTtcbiAgICAgIHRoaXMubW9kZSA9IGFjcy5tb2RlID8gKHR5cGVvZiBhY3MubW9kZSA9PSAnbnVtYmVyJyA/IGFjcy5tb2RlIDogQWNjZXNzTW9kZS5kZWNvZGUoYWNzLm1vZGUpKSA6XG4gICAgICAgICh0aGlzLmdpdmVuICYgdGhpcy53YW50KTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgI2NoZWNrRmxhZyh2YWwsIHNpZGUsIGZsYWcpIHtcbiAgICBzaWRlID0gc2lkZSB8fCAnbW9kZSc7XG4gICAgaWYgKFsnZ2l2ZW4nLCAnd2FudCcsICdtb2RlJ10uaW5jbHVkZXMoc2lkZSkpIHtcbiAgICAgIHJldHVybiAoKHZhbFtzaWRlXSAmIGZsYWcpICE9IDApO1xuICAgIH1cbiAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgQWNjZXNzTW9kZSBjb21wb25lbnQgJyR7c2lkZX0nYCk7XG4gIH1cbiAgLyoqXG4gICAqIFBhcnNlIHN0cmluZyBpbnRvIGFuIGFjY2VzcyBtb2RlIHZhbHVlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZyB8IE51bWJlcn0gbW9kZSAtIGVpdGhlciBhIFN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgYWNjZXNzIG1vZGUgdG8gcGFyc2Ugb3IgYSBzZXQgb2YgYml0cyB0byBhc3NpZ24uXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IC0gQWNjZXNzIG1vZGUgYXMgYSBudW1lcmljIHZhbHVlLlxuICAgKi9cbiAgc3RhdGljIGRlY29kZShzdHIpIHtcbiAgICBpZiAoIXN0cikge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSBlbHNlIGlmICh0eXBlb2Ygc3RyID09ICdudW1iZXInKSB7XG4gICAgICByZXR1cm4gc3RyICYgQWNjZXNzTW9kZS5fQklUTUFTSztcbiAgICB9IGVsc2UgaWYgKHN0ciA9PT0gJ04nIHx8IHN0ciA9PT0gJ24nKSB7XG4gICAgICByZXR1cm4gQWNjZXNzTW9kZS5fTk9ORTtcbiAgICB9XG5cbiAgICBjb25zdCBiaXRtYXNrID0ge1xuICAgICAgJ0onOiBBY2Nlc3NNb2RlLl9KT0lOLFxuICAgICAgJ1InOiBBY2Nlc3NNb2RlLl9SRUFELFxuICAgICAgJ1cnOiBBY2Nlc3NNb2RlLl9XUklURSxcbiAgICAgICdQJzogQWNjZXNzTW9kZS5fUFJFUyxcbiAgICAgICdBJzogQWNjZXNzTW9kZS5fQVBQUk9WRSxcbiAgICAgICdTJzogQWNjZXNzTW9kZS5fU0hBUkUsXG4gICAgICAnRCc6IEFjY2Vzc01vZGUuX0RFTEVURSxcbiAgICAgICdPJzogQWNjZXNzTW9kZS5fT1dORVJcbiAgICB9O1xuXG4gICAgbGV0IG0wID0gQWNjZXNzTW9kZS5fTk9ORTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBiaXQgPSBiaXRtYXNrW3N0ci5jaGFyQXQoaSkudG9VcHBlckNhc2UoKV07XG4gICAgICBpZiAoIWJpdCkge1xuICAgICAgICAvLyBVbnJlY29nbml6ZWQgYml0LCBza2lwLlxuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIG0wIHw9IGJpdDtcbiAgICB9XG4gICAgcmV0dXJuIG0wO1xuICB9XG4gIC8qKlxuICAgKiBDb252ZXJ0IG51bWVyaWMgcmVwcmVzZW50YXRpb24gb2YgdGhlIGFjY2VzcyBtb2RlIGludG8gYSBzdHJpbmcuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB2YWwgLSBhY2Nlc3MgbW9kZSB2YWx1ZSB0byBjb252ZXJ0IHRvIGEgc3RyaW5nLlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSAtIEFjY2VzcyBtb2RlIGFzIGEgc3RyaW5nLlxuICAgKi9cbiAgc3RhdGljIGVuY29kZSh2YWwpIHtcbiAgICBpZiAodmFsID09PSBudWxsIHx8IHZhbCA9PT0gQWNjZXNzTW9kZS5fSU5WQUxJRCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSBlbHNlIGlmICh2YWwgPT09IEFjY2Vzc01vZGUuX05PTkUpIHtcbiAgICAgIHJldHVybiAnTic7XG4gICAgfVxuXG4gICAgY29uc3QgYml0bWFzayA9IFsnSicsICdSJywgJ1cnLCAnUCcsICdBJywgJ1MnLCAnRCcsICdPJ107XG4gICAgbGV0IHJlcyA9ICcnO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYml0bWFzay5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKCh2YWwgJiAoMSA8PCBpKSkgIT0gMCkge1xuICAgICAgICByZXMgPSByZXMgKyBiaXRtYXNrW2ldO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzO1xuICB9XG4gIC8qKlxuICAgKiBVcGRhdGUgbnVtZXJpYyByZXByZXNlbnRhdGlvbiBvZiBhY2Nlc3MgbW9kZSB3aXRoIHRoZSBuZXcgdmFsdWUuIFRoZSB2YWx1ZVxuICAgKiBpcyBvbmUgb2YgdGhlIGZvbGxvd2luZzpcbiAgICogIC0gYSBzdHJpbmcgc3RhcnRpbmcgd2l0aCA8Y29kZT4nKyc8L2NvZGU+IG9yIDxjb2RlPictJzwvY29kZT4gdGhlbiB0aGUgYml0cyB0byBhZGQgb3IgcmVtb3ZlLCBlLmcuIDxjb2RlPicrUi1XJzwvY29kZT4gb3IgPGNvZGU+Jy1QUyc8L2NvZGU+LlxuICAgKiAgLSBhIG5ldyB2YWx1ZSBvZiBhY2Nlc3MgbW9kZVxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gdmFsIC0gYWNjZXNzIG1vZGUgdmFsdWUgdG8gdXBkYXRlLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdXBkIC0gdXBkYXRlIHRvIGFwcGx5IHRvIHZhbC5cbiAgICogQHJldHVybnMge251bWJlcn0gLSB1cGRhdGVkIGFjY2VzcyBtb2RlLlxuICAgKi9cbiAgc3RhdGljIHVwZGF0ZSh2YWwsIHVwZCkge1xuICAgIGlmICghdXBkIHx8IHR5cGVvZiB1cGQgIT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiB2YWw7XG4gICAgfVxuXG4gICAgbGV0IGFjdGlvbiA9IHVwZC5jaGFyQXQoMCk7XG4gICAgaWYgKGFjdGlvbiA9PSAnKycgfHwgYWN0aW9uID09ICctJykge1xuICAgICAgbGV0IHZhbDAgPSB2YWw7XG4gICAgICAvLyBTcGxpdCBkZWx0YS1zdHJpbmcgbGlrZSAnK0FCQy1ERUYrWicgaW50byBhbiBhcnJheSBvZiBwYXJ0cyBpbmNsdWRpbmcgKyBhbmQgLS5cbiAgICAgIGNvbnN0IHBhcnRzID0gdXBkLnNwbGl0KC8oWy0rXSkvKTtcbiAgICAgIC8vIFN0YXJ0aW5nIGl0ZXJhdGlvbiBmcm9tIDEgYmVjYXVzZSBTdHJpbmcuc3BsaXQoKSBjcmVhdGVzIGFuIGFycmF5IHdpdGggdGhlIGZpcnN0IGVtcHR5IGVsZW1lbnQuXG4gICAgICAvLyBJdGVyYXRpbmcgYnkgMiBiZWNhdXNlIHdlIHBhcnNlIHBhaXJzICsvLSB0aGVuIGRhdGEuXG4gICAgICBmb3IgKGxldCBpID0gMTsgaSA8IHBhcnRzLmxlbmd0aCAtIDE7IGkgKz0gMikge1xuICAgICAgICBhY3Rpb24gPSBwYXJ0c1tpXTtcbiAgICAgICAgY29uc3QgbTAgPSBBY2Nlc3NNb2RlLmRlY29kZShwYXJ0c1tpICsgMV0pO1xuICAgICAgICBpZiAobTAgPT0gQWNjZXNzTW9kZS5fSU5WQUxJRCkge1xuICAgICAgICAgIHJldHVybiB2YWw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG0wID09IG51bGwpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYWN0aW9uID09PSAnKycpIHtcbiAgICAgICAgICB2YWwwIHw9IG0wO1xuICAgICAgICB9IGVsc2UgaWYgKGFjdGlvbiA9PT0gJy0nKSB7XG4gICAgICAgICAgdmFsMCAmPSB+bTA7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHZhbCA9IHZhbDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFRoZSBzdHJpbmcgaXMgYW4gZXhwbGljaXQgbmV3IHZhbHVlICdBQkMnIHJhdGhlciB0aGFuIGRlbHRhLlxuICAgICAgY29uc3QgdmFsMCA9IEFjY2Vzc01vZGUuZGVjb2RlKHVwZCk7XG4gICAgICBpZiAodmFsMCAhPSBBY2Nlc3NNb2RlLl9JTlZBTElEKSB7XG4gICAgICAgIHZhbCA9IHZhbDA7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbDtcbiAgfVxuICAvKipcbiAgICogQml0cyBwcmVzZW50IGluIGExIGJ1dCBtaXNzaW5nIGluIGEyLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXIgfCBzdHJpbmd9IGExIC0gYWNjZXNzIG1vZGUgdG8gc3VidHJhY3QgZnJvbS5cbiAgICogQHBhcmFtIHtudW1iZXIgfCBzdHJpbmd9IGEyIC0gYWNjZXNzIG1vZGUgdG8gc3VidHJhY3QuXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IGFjY2VzcyBtb2RlIHdpdGggYml0cyBwcmVzZW50IGluIDxjb2RlPmExPC9jb2RlPiBidXQgbWlzc2luZyBpbiA8Y29kZT5hMjwvY29kZT4uXG4gICAqL1xuICBzdGF0aWMgZGlmZihhMSwgYTIpIHtcbiAgICBhMSA9IEFjY2Vzc01vZGUuZGVjb2RlKGExKTtcbiAgICBhMiA9IEFjY2Vzc01vZGUuZGVjb2RlKGEyKTtcblxuICAgIGlmIChhMSA9PSBBY2Nlc3NNb2RlLl9JTlZBTElEIHx8IGEyID09IEFjY2Vzc01vZGUuX0lOVkFMSUQpIHtcbiAgICAgIHJldHVybiBBY2Nlc3NNb2RlLl9JTlZBTElEO1xuICAgIH1cbiAgICByZXR1cm4gYTEgJiB+YTI7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBDdXN0b20gZm9ybWF0dGVyXG4gICAqL1xuICB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gJ3tcIm1vZGVcIjogXCInICsgQWNjZXNzTW9kZS5lbmNvZGUodGhpcy5tb2RlKSArXG4gICAgICAnXCIsIFwiZ2l2ZW5cIjogXCInICsgQWNjZXNzTW9kZS5lbmNvZGUodGhpcy5naXZlbikgK1xuICAgICAgJ1wiLCBcIndhbnRcIjogXCInICsgQWNjZXNzTW9kZS5lbmNvZGUodGhpcy53YW50KSArICdcIn0nO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogQ29udmVydHMgbnVtZXJpYyB2YWx1ZXMgdG8gc3RyaW5ncy5cbiAgICovXG4gIGpzb25IZWxwZXIoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG1vZGU6IEFjY2Vzc01vZGUuZW5jb2RlKHRoaXMubW9kZSksXG4gICAgICBnaXZlbjogQWNjZXNzTW9kZS5lbmNvZGUodGhpcy5naXZlbiksXG4gICAgICB3YW50OiBBY2Nlc3NNb2RlLmVuY29kZSh0aGlzLndhbnQpXG4gICAgfTtcbiAgfVxuICAvKipcbiAgICogQWNjZXNzTW9kZSBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyB0b3BpYyBhY2Nlc3MgbW9kZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAY2xhc3MgQWNjZXNzTW9kZVxuICAgKi9cbiAgLyoqXG4gICAqIEFzc2lnbiB2YWx1ZSB0byAnbW9kZScuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZyB8IE51bWJlcn0gbSAtIGVpdGhlciBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgYWNjZXNzIG1vZGUgb3IgYSBzZXQgb2YgYml0cy5cbiAgICogQHJldHVybnMge0FjY2Vzc01vZGV9IC0gPGNvZGU+dGhpczwvY29kZT4gQWNjZXNzTW9kZS5cbiAgICovXG4gIHNldE1vZGUobSkge1xuICAgIHRoaXMubW9kZSA9IEFjY2Vzc01vZGUuZGVjb2RlKG0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogVXBkYXRlIDxjb2RlPm1vZGU8L2NvZGU+IHZhbHVlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHUgLSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIGNoYW5nZXMgdG8gYXBwbHkgdG8gYWNjZXNzIG1vZGUuXG4gICAqIEByZXR1cm5zIHtBY2Nlc3NNb2RlfSAtIDxjb2RlPnRoaXM8L2NvZGU+IEFjY2Vzc01vZGUuXG4gICAqL1xuICB1cGRhdGVNb2RlKHUpIHtcbiAgICB0aGlzLm1vZGUgPSBBY2Nlc3NNb2RlLnVwZGF0ZSh0aGlzLm1vZGUsIHUpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogR2V0IDxjb2RlPm1vZGU8L2NvZGU+IHZhbHVlIGFzIGEgc3RyaW5nLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICpcbiAgICogQHJldHVybnMge3N0cmluZ30gLSA8Y29kZT5tb2RlPC9jb2RlPiB2YWx1ZS5cbiAgICovXG4gIGdldE1vZGUoKSB7XG4gICAgcmV0dXJuIEFjY2Vzc01vZGUuZW5jb2RlKHRoaXMubW9kZSk7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBBc3NpZ24gPGNvZGU+Z2l2ZW48L2NvZGU+ICB2YWx1ZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nIHwgTnVtYmVyfSBnIC0gZWl0aGVyIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBhY2Nlc3MgbW9kZSBvciBhIHNldCBvZiBiaXRzLlxuICAgKiBAcmV0dXJucyB7QWNjZXNzTW9kZX0gLSA8Y29kZT50aGlzPC9jb2RlPiBBY2Nlc3NNb2RlLlxuICAgKi9cbiAgc2V0R2l2ZW4oZykge1xuICAgIHRoaXMuZ2l2ZW4gPSBBY2Nlc3NNb2RlLmRlY29kZShnKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICAvKipcbiAgICogQWNjZXNzTW9kZSBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyB0b3BpYyBhY2Nlc3MgbW9kZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAY2xhc3MgQWNjZXNzTW9kZVxuICAgKi9cbiAgLyoqXG4gICAqIFVwZGF0ZSAnZ2l2ZW4nIHZhbHVlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHUgLSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIGNoYW5nZXMgdG8gYXBwbHkgdG8gYWNjZXNzIG1vZGUuXG4gICAqIEByZXR1cm5zIHtBY2Nlc3NNb2RlfSAtIDxjb2RlPnRoaXM8L2NvZGU+IEFjY2Vzc01vZGUuXG4gICAqL1xuICB1cGRhdGVHaXZlbih1KSB7XG4gICAgdGhpcy5naXZlbiA9IEFjY2Vzc01vZGUudXBkYXRlKHRoaXMuZ2l2ZW4sIHUpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogR2V0ICdnaXZlbicgdmFsdWUgYXMgYSBzdHJpbmcuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSAtIDxiPmdpdmVuPC9iPiB2YWx1ZS5cbiAgICovXG4gIGdldEdpdmVuKCkge1xuICAgIHJldHVybiBBY2Nlc3NNb2RlLmVuY29kZSh0aGlzLmdpdmVuKTtcbiAgfVxuICAvKipcbiAgICogQWNjZXNzTW9kZSBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyB0b3BpYyBhY2Nlc3MgbW9kZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAY2xhc3MgQWNjZXNzTW9kZVxuICAgKi9cbiAgLyoqXG4gICAqIEFzc2lnbiAnd2FudCcgdmFsdWUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZyB8IE51bWJlcn0gdyAtIGVpdGhlciBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgYWNjZXNzIG1vZGUgb3IgYSBzZXQgb2YgYml0cy5cbiAgICogQHJldHVybnMge0FjY2Vzc01vZGV9IC0gPGNvZGU+dGhpczwvY29kZT4gQWNjZXNzTW9kZS5cbiAgICovXG4gIHNldFdhbnQodykge1xuICAgIHRoaXMud2FudCA9IEFjY2Vzc01vZGUuZGVjb2RlKHcpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogVXBkYXRlICd3YW50JyB2YWx1ZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1IC0gc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBjaGFuZ2VzIHRvIGFwcGx5IHRvIGFjY2VzcyBtb2RlLlxuICAgKiBAcmV0dXJucyB7QWNjZXNzTW9kZX0gLSA8Y29kZT50aGlzPC9jb2RlPiBBY2Nlc3NNb2RlLlxuICAgKi9cbiAgdXBkYXRlV2FudCh1KSB7XG4gICAgdGhpcy53YW50ID0gQWNjZXNzTW9kZS51cGRhdGUodGhpcy53YW50LCB1KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICAvKipcbiAgICogQWNjZXNzTW9kZSBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyB0b3BpYyBhY2Nlc3MgbW9kZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAY2xhc3MgQWNjZXNzTW9kZVxuICAgKi9cbiAgLyoqXG4gICAqIEdldCAnd2FudCcgdmFsdWUgYXMgYSBzdHJpbmcuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSAtIDxiPndhbnQ8L2I+IHZhbHVlLlxuICAgKi9cbiAgZ2V0V2FudCgpIHtcbiAgICByZXR1cm4gQWNjZXNzTW9kZS5lbmNvZGUodGhpcy53YW50KTtcbiAgfVxuICAvKipcbiAgICogQWNjZXNzTW9kZSBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyB0b3BpYyBhY2Nlc3MgbW9kZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAY2xhc3MgQWNjZXNzTW9kZVxuICAgKi9cbiAgLyoqXG4gICAqIEdldCBwZXJtaXNzaW9ucyBwcmVzZW50IGluICd3YW50JyBidXQgbWlzc2luZyBpbiAnZ2l2ZW4nLlxuICAgKiBJbnZlcnNlIG9mIHtAbGluayBUaW5vZGUuQWNjZXNzTW9kZSNnZXRFeGNlc3NpdmV9XG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBwZXJtaXNzaW9ucyBwcmVzZW50IGluIDxiPndhbnQ8L2I+IGJ1dCBtaXNzaW5nIGluIDxiPmdpdmVuPC9iPi5cbiAgICovXG4gIGdldE1pc3NpbmcoKSB7XG4gICAgcmV0dXJuIEFjY2Vzc01vZGUuZW5jb2RlKHRoaXMud2FudCAmIH50aGlzLmdpdmVuKTtcbiAgfVxuICAvKipcbiAgICogQWNjZXNzTW9kZSBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyB0b3BpYyBhY2Nlc3MgbW9kZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAY2xhc3MgQWNjZXNzTW9kZVxuICAgKi9cbiAgLyoqXG4gICAqIEdldCBwZXJtaXNzaW9ucyBwcmVzZW50IGluICdnaXZlbicgYnV0IG1pc3NpbmcgaW4gJ3dhbnQnLlxuICAgKiBJbnZlcnNlIG9mIHtAbGluayBUaW5vZGUuQWNjZXNzTW9kZSNnZXRNaXNzaW5nfVxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICpcbiAgICogQHJldHVybnMge3N0cmluZ30gcGVybWlzc2lvbnMgcHJlc2VudCBpbiA8Yj5naXZlbjwvYj4gYnV0IG1pc3NpbmcgaW4gPGI+d2FudDwvYj4uXG4gICAqL1xuICBnZXRFeGNlc3NpdmUoKSB7XG4gICAgcmV0dXJuIEFjY2Vzc01vZGUuZW5jb2RlKHRoaXMuZ2l2ZW4gJiB+dGhpcy53YW50KTtcbiAgfVxuICAvKipcbiAgICogQWNjZXNzTW9kZSBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyB0b3BpYyBhY2Nlc3MgbW9kZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAY2xhc3MgQWNjZXNzTW9kZVxuICAgKi9cbiAgLyoqXG4gICAqIFVwZGF0ZSAnd2FudCcsICdnaXZlJywgYW5kICdtb2RlJyB2YWx1ZXMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKlxuICAgKiBAcGFyYW0ge0FjY2Vzc01vZGV9IHZhbCAtIG5ldyBhY2Nlc3MgbW9kZSB2YWx1ZS5cbiAgICogQHJldHVybnMge0FjY2Vzc01vZGV9IC0gPGNvZGU+dGhpczwvY29kZT4gQWNjZXNzTW9kZS5cbiAgICovXG4gIHVwZGF0ZUFsbCh2YWwpIHtcbiAgICBpZiAodmFsKSB7XG4gICAgICB0aGlzLnVwZGF0ZUdpdmVuKHZhbC5naXZlbik7XG4gICAgICB0aGlzLnVwZGF0ZVdhbnQodmFsLndhbnQpO1xuICAgICAgdGhpcy5tb2RlID0gdGhpcy5naXZlbiAmIHRoaXMud2FudDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBDaGVjayBpZiBPd25lciAoTykgZmxhZyBpcyBzZXQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKiBAcGFyYW0ge3N0cmluZz19IHNpZGUgLSB3aGljaCBwZXJtaXNzaW9uIHRvIGNoZWNrOiBnaXZlbiwgd2FudCwgbW9kZTsgZGVmYXVsdDogbW9kZS5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IC0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgZmxhZyBpcyBzZXQuXG4gICAqL1xuICBpc093bmVyKHNpZGUpIHtcbiAgICByZXR1cm4gQWNjZXNzTW9kZS4jY2hlY2tGbGFnKHRoaXMsIHNpZGUsIEFjY2Vzc01vZGUuX09XTkVSKTtcbiAgfVxuICAvKipcbiAgICogQWNjZXNzTW9kZSBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyB0b3BpYyBhY2Nlc3MgbW9kZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAY2xhc3MgQWNjZXNzTW9kZVxuICAgKi9cbiAgLyoqXG4gICAqIENoZWNrIGlmIFByZXNlbmNlIChQKSBmbGFnIGlzIHNldC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gc2lkZSAtIHdoaWNoIHBlcm1pc3Npb24gdG8gY2hlY2s6IGdpdmVuLCB3YW50LCBtb2RlOyBkZWZhdWx0OiBtb2RlLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSA8Y29kZT50cnVlPC9jb2RlPiBpZiBmbGFnIGlzIHNldC5cbiAgICovXG4gIGlzUHJlc2VuY2VyKHNpZGUpIHtcbiAgICByZXR1cm4gQWNjZXNzTW9kZS4jY2hlY2tGbGFnKHRoaXMsIHNpZGUsIEFjY2Vzc01vZGUuX1BSRVMpO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogQ2hlY2sgaWYgUHJlc2VuY2UgKFApIGZsYWcgaXMgTk9UIHNldC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gc2lkZSAtIHdoaWNoIHBlcm1pc3Npb24gdG8gY2hlY2s6IGdpdmVuLCB3YW50LCBtb2RlOyBkZWZhdWx0OiBtb2RlLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSA8Y29kZT50cnVlPC9jb2RlPiBpZiBmbGFnIGlzIHNldC5cbiAgICovXG4gIGlzTXV0ZWQoc2lkZSkge1xuICAgIHJldHVybiAhdGhpcy5pc1ByZXNlbmNlcihzaWRlKTtcbiAgfVxuICAvKipcbiAgICogQWNjZXNzTW9kZSBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyB0b3BpYyBhY2Nlc3MgbW9kZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAY2xhc3MgQWNjZXNzTW9kZVxuICAgKi9cbiAgLyoqXG4gICAqIENoZWNrIGlmIEpvaW4gKEopIGZsYWcgaXMgc2V0LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICogQHBhcmFtIHtzdHJpbmc9fSBzaWRlIC0gd2hpY2ggcGVybWlzc2lvbiB0byBjaGVjazogZ2l2ZW4sIHdhbnQsIG1vZGU7IGRlZmF1bHQ6IG1vZGUuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIDxjb2RlPnRydWU8L2NvZGU+IGlmIGZsYWcgaXMgc2V0LlxuICAgKi9cbiAgaXNKb2luZXIoc2lkZSkge1xuICAgIHJldHVybiBBY2Nlc3NNb2RlLiNjaGVja0ZsYWcodGhpcywgc2lkZSwgQWNjZXNzTW9kZS5fSk9JTik7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBDaGVjayBpZiBSZWFkZXIgKFIpIGZsYWcgaXMgc2V0LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICogQHBhcmFtIHtzdHJpbmc9fSBzaWRlIC0gd2hpY2ggcGVybWlzc2lvbiB0byBjaGVjazogZ2l2ZW4sIHdhbnQsIG1vZGU7IGRlZmF1bHQ6IG1vZGUuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIDxjb2RlPnRydWU8L2NvZGU+IGlmIGZsYWcgaXMgc2V0LlxuICAgKi9cbiAgaXNSZWFkZXIoc2lkZSkge1xuICAgIHJldHVybiBBY2Nlc3NNb2RlLiNjaGVja0ZsYWcodGhpcywgc2lkZSwgQWNjZXNzTW9kZS5fUkVBRCk7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBDaGVjayBpZiBXcml0ZXIgKFcpIGZsYWcgaXMgc2V0LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICogQHBhcmFtIHtzdHJpbmc9fSBzaWRlIC0gd2hpY2ggcGVybWlzc2lvbiB0byBjaGVjazogZ2l2ZW4sIHdhbnQsIG1vZGU7IGRlZmF1bHQ6IG1vZGUuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIDxjb2RlPnRydWU8L2NvZGU+IGlmIGZsYWcgaXMgc2V0LlxuICAgKi9cbiAgaXNXcml0ZXIoc2lkZSkge1xuICAgIHJldHVybiBBY2Nlc3NNb2RlLiNjaGVja0ZsYWcodGhpcywgc2lkZSwgQWNjZXNzTW9kZS5fV1JJVEUpO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogQ2hlY2sgaWYgQXBwcm92ZXIgKEEpIGZsYWcgaXMgc2V0LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICogQHBhcmFtIHtzdHJpbmc9fSBzaWRlIC0gd2hpY2ggcGVybWlzc2lvbiB0byBjaGVjazogZ2l2ZW4sIHdhbnQsIG1vZGU7IGRlZmF1bHQ6IG1vZGUuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIDxjb2RlPnRydWU8L2NvZGU+IGlmIGZsYWcgaXMgc2V0LlxuICAgKi9cbiAgaXNBcHByb3ZlcihzaWRlKSB7XG4gICAgcmV0dXJuIEFjY2Vzc01vZGUuI2NoZWNrRmxhZyh0aGlzLCBzaWRlLCBBY2Nlc3NNb2RlLl9BUFBST1ZFKTtcbiAgfVxuICAvKipcbiAgICogQWNjZXNzTW9kZSBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyB0b3BpYyBhY2Nlc3MgbW9kZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAY2xhc3MgQWNjZXNzTW9kZVxuICAgKi9cbiAgLyoqXG4gICAqIENoZWNrIGlmIGVpdGhlciBvbmUgb2YgT3duZXIgKE8pIG9yIEFwcHJvdmVyIChBKSBmbGFncyBpcyBzZXQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKiBAcGFyYW0ge3N0cmluZz19IHNpZGUgLSB3aGljaCBwZXJtaXNzaW9uIHRvIGNoZWNrOiBnaXZlbiwgd2FudCwgbW9kZTsgZGVmYXVsdDogbW9kZS5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IC0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgZmxhZyBpcyBzZXQuXG4gICAqL1xuICBpc0FkbWluKHNpZGUpIHtcbiAgICByZXR1cm4gdGhpcy5pc093bmVyKHNpZGUpIHx8IHRoaXMuaXNBcHByb3ZlcihzaWRlKTtcbiAgfVxuICAvKipcbiAgICogQWNjZXNzTW9kZSBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyB0b3BpYyBhY2Nlc3MgbW9kZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAY2xhc3MgQWNjZXNzTW9kZVxuICAgKi9cbiAgLyoqXG4gICAqIENoZWNrIGlmIGVpdGhlciBvbmUgb2YgT3duZXIgKE8pLCBBcHByb3ZlciAoQSksIG9yIFNoYXJlciAoUykgZmxhZ3MgaXMgc2V0LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICogQHBhcmFtIHtzdHJpbmc9fSBzaWRlIC0gd2hpY2ggcGVybWlzc2lvbiB0byBjaGVjazogZ2l2ZW4sIHdhbnQsIG1vZGU7IGRlZmF1bHQ6IG1vZGUuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIDxjb2RlPnRydWU8L2NvZGU+IGlmIGZsYWcgaXMgc2V0LlxuICAgKi9cbiAgaXNTaGFyZXIoc2lkZSkge1xuICAgIHJldHVybiB0aGlzLmlzQWRtaW4oc2lkZSkgfHwgQWNjZXNzTW9kZS4jY2hlY2tGbGFnKHRoaXMsIHNpZGUsIEFjY2Vzc01vZGUuX1NIQVJFKTtcbiAgfVxuICAvKipcbiAgICogQWNjZXNzTW9kZSBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyB0b3BpYyBhY2Nlc3MgbW9kZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAY2xhc3MgQWNjZXNzTW9kZVxuICAgKi9cbiAgLyoqXG4gICAqIENoZWNrIGlmIERlbGV0ZXIgKEQpIGZsYWcgaXMgc2V0LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICogQHBhcmFtIHtzdHJpbmc9fSBzaWRlIC0gd2hpY2ggcGVybWlzc2lvbiB0byBjaGVjazogZ2l2ZW4sIHdhbnQsIG1vZGU7IGRlZmF1bHQ6IG1vZGUuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIDxjb2RlPnRydWU8L2NvZGU+IGlmIGZsYWcgaXMgc2V0LlxuICAgKi9cbiAgaXNEZWxldGVyKHNpZGUpIHtcbiAgICByZXR1cm4gQWNjZXNzTW9kZS4jY2hlY2tGbGFnKHRoaXMsIHNpZGUsIEFjY2Vzc01vZGUuX0RFTEVURSk7XG4gIH1cbn1cblxuQWNjZXNzTW9kZS5fTk9ORSA9IDB4MDA7XG5BY2Nlc3NNb2RlLl9KT0lOID0gMHgwMTtcbkFjY2Vzc01vZGUuX1JFQUQgPSAweDAyO1xuQWNjZXNzTW9kZS5fV1JJVEUgPSAweDA0O1xuQWNjZXNzTW9kZS5fUFJFUyA9IDB4MDg7XG5BY2Nlc3NNb2RlLl9BUFBST1ZFID0gMHgxMDtcbkFjY2Vzc01vZGUuX1NIQVJFID0gMHgyMDtcbkFjY2Vzc01vZGUuX0RFTEVURSA9IDB4NDA7XG5BY2Nlc3NNb2RlLl9PV05FUiA9IDB4ODA7XG5cbkFjY2Vzc01vZGUuX0JJVE1BU0sgPSBBY2Nlc3NNb2RlLl9KT0lOIHwgQWNjZXNzTW9kZS5fUkVBRCB8IEFjY2Vzc01vZGUuX1dSSVRFIHwgQWNjZXNzTW9kZS5fUFJFUyB8XG4gIEFjY2Vzc01vZGUuX0FQUFJPVkUgfCBBY2Nlc3NNb2RlLl9TSEFSRSB8IEFjY2Vzc01vZGUuX0RFTEVURSB8IEFjY2Vzc01vZGUuX09XTkVSO1xuQWNjZXNzTW9kZS5fSU5WQUxJRCA9IDB4MTAwMDAwO1xuIiwiLyoqXG4gKiBAZmlsZSBJbi1tZW1vcnkgc29ydGVkIGNhY2hlIG9mIG9iamVjdHMuXG4gKlxuICogQGNvcHlyaWdodCAyMDE1LTIwMjIgVGlub2RlIExMQy5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEluLW1lbW9yeSBzb3J0ZWQgY2FjaGUgb2Ygb2JqZWN0cy5cbiAqXG4gKiBAY2xhc3MgQ0J1ZmZlclxuICogQG1lbWJlcm9mIFRpbm9kZVxuICogQHByb3RlY3RlZFxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNvbXBhcmUgY3VzdG9tIGNvbXBhcmF0b3Igb2Ygb2JqZWN0cy4gVGFrZXMgdHdvIHBhcmFtZXRlcnMgPGNvZGU+YTwvY29kZT4gYW5kIDxjb2RlPmI8L2NvZGU+O1xuICogICAgcmV0dXJucyA8Y29kZT4tMTwvY29kZT4gaWYgPGNvZGU+YSA8IGI8L2NvZGU+LCA8Y29kZT4wPC9jb2RlPiBpZiA8Y29kZT5hID09IGI8L2NvZGU+LCA8Y29kZT4xPC9jb2RlPiBvdGhlcndpc2UuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IHVuaXF1ZSBlbmZvcmNlIGVsZW1lbnQgdW5pcXVlbmVzczogd2hlbiA8Y29kZT50cnVlPC9jb2RlPiByZXBsYWNlIGV4aXN0aW5nIGVsZW1lbnQgd2l0aCBhIG5ld1xuICogICAgb25lIG9uIGNvbmZsaWN0OyB3aGVuIDxjb2RlPmZhbHNlPC9jb2RlPiBrZWVwIGJvdGggZWxlbWVudHMuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENCdWZmZXIge1xuICAjY29tcGFyYXRvciA9IHVuZGVmaW5lZDtcbiAgI3VuaXF1ZSA9IGZhbHNlO1xuICBidWZmZXIgPSBbXTtcblxuICBjb25zdHJ1Y3Rvcihjb21wYXJlXywgdW5pcXVlXykge1xuICAgIHRoaXMuI2NvbXBhcmF0b3IgPSBjb21wYXJlXyB8fCAoKGEsIGIpID0+IHtcbiAgICAgIHJldHVybiBhID09PSBiID8gMCA6IGEgPCBiID8gLTEgOiAxO1xuICAgIH0pO1xuICAgIHRoaXMuI3VuaXF1ZSA9IHVuaXF1ZV87XG4gIH1cblxuICAjZmluZE5lYXJlc3QoZWxlbSwgYXJyLCBleGFjdCkge1xuICAgIGxldCBzdGFydCA9IDA7XG4gICAgbGV0IGVuZCA9IGFyci5sZW5ndGggLSAxO1xuICAgIGxldCBwaXZvdCA9IDA7XG4gICAgbGV0IGRpZmYgPSAwO1xuICAgIGxldCBmb3VuZCA9IGZhbHNlO1xuXG4gICAgd2hpbGUgKHN0YXJ0IDw9IGVuZCkge1xuICAgICAgcGl2b3QgPSAoc3RhcnQgKyBlbmQpIC8gMiB8IDA7XG4gICAgICBkaWZmID0gdGhpcy4jY29tcGFyYXRvcihhcnJbcGl2b3RdLCBlbGVtKTtcbiAgICAgIGlmIChkaWZmIDwgMCkge1xuICAgICAgICBzdGFydCA9IHBpdm90ICsgMTtcbiAgICAgIH0gZWxzZSBpZiAoZGlmZiA+IDApIHtcbiAgICAgICAgZW5kID0gcGl2b3QgLSAxO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGZvdW5kKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpZHg6IHBpdm90LFxuICAgICAgICBleGFjdDogdHJ1ZVxuICAgICAgfTtcbiAgICB9XG4gICAgaWYgKGV4YWN0KSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpZHg6IC0xXG4gICAgICB9O1xuICAgIH1cbiAgICAvLyBOb3QgZXhhY3QgLSBpbnNlcnRpb24gcG9pbnRcbiAgICByZXR1cm4ge1xuICAgICAgaWR4OiBkaWZmIDwgMCA/IHBpdm90ICsgMSA6IHBpdm90XG4gICAgfTtcbiAgfVxuXG4gIC8vIEluc2VydCBlbGVtZW50IGludG8gYSBzb3J0ZWQgYXJyYXkuXG4gICNpbnNlcnRTb3J0ZWQoZWxlbSwgYXJyKSB7XG4gICAgY29uc3QgZm91bmQgPSB0aGlzLiNmaW5kTmVhcmVzdChlbGVtLCBhcnIsIGZhbHNlKTtcbiAgICBjb25zdCBjb3VudCA9IChmb3VuZC5leGFjdCAmJiB0aGlzLiN1bmlxdWUpID8gMSA6IDA7XG4gICAgYXJyLnNwbGljZShmb3VuZC5pZHgsIGNvdW50LCBlbGVtKTtcbiAgICByZXR1cm4gYXJyO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhbiBlbGVtZW50IGF0IHRoZSBnaXZlbiBwb3NpdGlvbi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5DQnVmZmVyI1xuICAgKiBAcGFyYW0ge251bWJlcn0gYXQgLSBQb3NpdGlvbiB0byBmZXRjaCBmcm9tLlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSBFbGVtZW50IGF0IHRoZSBnaXZlbiBwb3NpdGlvbiBvciA8Y29kZT51bmRlZmluZWQ8L2NvZGU+LlxuICAgKi9cbiAgZ2V0QXQoYXQpIHtcbiAgICByZXR1cm4gdGhpcy5idWZmZXJbYXRdO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlbmllbmNlIG1ldGhvZCBmb3IgZ2V0dGluZyB0aGUgZWxlbWVudCBmcm9tIHRoZSBlbmQgb2YgdGhlIGJ1ZmZlci5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5DQnVmZmVyI1xuICAgKiBAcGFyYW0ge251bWJlcn0gYXQgLSBwb3NpdGlvbiB0byBmZXRjaCBmcm9tLCBjb3VudGluZyBmcm9tIHRoZSBlbmQ7XG4gICAqICAgIDxjb2RlPnVuZGVmaW5lZDwvY29kZT4gb3IgPGNvZGU+bnVsbDwvY29kZT4gIG1lYW4gXCJsYXN0XCIuXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBsYXN0IGVsZW1lbnQgaW4gdGhlIGJ1ZmZlciBvciA8Y29kZT51bmRlZmluZWQ8L2NvZGU+IGlmIGJ1ZmZlciBpcyBlbXB0eS5cbiAgICovXG4gIGdldExhc3QoYXQpIHtcbiAgICBhdCB8PSAwO1xuICAgIHJldHVybiB0aGlzLmJ1ZmZlci5sZW5ndGggPiBhdCA/IHRoaXMuYnVmZmVyW3RoaXMuYnVmZmVyLmxlbmd0aCAtIDEgLSBhdF0gOiB1bmRlZmluZWQ7XG4gIH1cblxuICAvKipcbiAgICogQWRkIG5ldyBlbGVtZW50KHMpIHRvIHRoZSBidWZmZXIuIFZhcmlhZGljOiB0YWtlcyBvbmUgb3IgbW9yZSBhcmd1bWVudHMuIElmIGFuIGFycmF5IGlzIHBhc3NlZCBhcyBhIHNpbmdsZVxuICAgKiBhcmd1bWVudCwgaXRzIGVsZW1lbnRzIGFyZSBpbnNlcnRlZCBpbmRpdmlkdWFsbHkuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ0J1ZmZlciNcbiAgICpcbiAgICogQHBhcmFtIHsuLi5PYmplY3R8QXJyYXl9IC0gT25lIG9yIG1vcmUgb2JqZWN0cyB0byBpbnNlcnQuXG4gICAqL1xuICBwdXQoKSB7XG4gICAgbGV0IGluc2VydDtcbiAgICAvLyBpbnNwZWN0IGFyZ3VtZW50czogaWYgYXJyYXksIGluc2VydCBpdHMgZWxlbWVudHMsIGlmIG9uZSBvciBtb3JlIG5vbi1hcnJheSBhcmd1bWVudHMsIGluc2VydCB0aGVtIG9uZSBieSBvbmVcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSAxICYmIEFycmF5LmlzQXJyYXkoYXJndW1lbnRzWzBdKSkge1xuICAgICAgaW5zZXJ0ID0gYXJndW1lbnRzWzBdO1xuICAgIH0gZWxzZSB7XG4gICAgICBpbnNlcnQgPSBhcmd1bWVudHM7XG4gICAgfVxuICAgIGZvciAobGV0IGlkeCBpbiBpbnNlcnQpIHtcbiAgICAgIHRoaXMuI2luc2VydFNvcnRlZChpbnNlcnRbaWR4XSwgdGhpcy5idWZmZXIpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgZWxlbWVudCBhdCB0aGUgZ2l2ZW4gcG9zaXRpb24uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ0J1ZmZlciNcbiAgICogQHBhcmFtIHtudW1iZXJ9IGF0IC0gUG9zaXRpb24gdG8gZGVsZXRlIGF0LlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSBFbGVtZW50IGF0IHRoZSBnaXZlbiBwb3NpdGlvbiBvciA8Y29kZT51bmRlZmluZWQ8L2NvZGU+LlxuICAgKi9cbiAgZGVsQXQoYXQpIHtcbiAgICBhdCB8PSAwO1xuICAgIGxldCByID0gdGhpcy5idWZmZXIuc3BsaWNlKGF0LCAxKTtcbiAgICBpZiAociAmJiByLmxlbmd0aCA+IDApIHtcbiAgICAgIHJldHVybiByWzBdO1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBlbGVtZW50cyBiZXR3ZWVuIHR3byBwb3NpdGlvbnMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ0J1ZmZlciNcbiAgICogQHBhcmFtIHtudW1iZXJ9IHNpbmNlIC0gUG9zaXRpb24gdG8gZGVsZXRlIGZyb20gKGluY2x1c2l2ZSkuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBiZWZvcmUgLSBQb3NpdGlvbiB0byBkZWxldGUgdG8gKGV4Y2x1c2l2ZSkuXG4gICAqXG4gICAqIEByZXR1cm5zIHtBcnJheX0gYXJyYXkgb2YgcmVtb3ZlZCBlbGVtZW50cyAoY291bGQgYmUgemVybyBsZW5ndGgpLlxuICAgKi9cbiAgZGVsUmFuZ2Uoc2luY2UsIGJlZm9yZSkge1xuICAgIHJldHVybiB0aGlzLmJ1ZmZlci5zcGxpY2Uoc2luY2UsIGJlZm9yZSAtIHNpbmNlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIG51bWJlciBvZiBlbGVtZW50cyB0aGUgYnVmZmVyIGhvbGRzLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNCdWZmZXIjXG4gICAqIEByZXR1cm4ge251bWJlcn0gTnVtYmVyIG9mIGVsZW1lbnRzIGluIHRoZSBidWZmZXIuXG4gICAqL1xuICBsZW5ndGgoKSB7XG4gICAgcmV0dXJuIHRoaXMuYnVmZmVyLmxlbmd0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldCB0aGUgYnVmZmVyIGRpc2NhcmRpbmcgYWxsIGVsZW1lbnRzXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ0J1ZmZlciNcbiAgICovXG4gIHJlc2V0KCkge1xuICAgIHRoaXMuYnVmZmVyID0gW107XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGJhY2sgZm9yIGl0ZXJhdGluZyBjb250ZW50cyBvZiBidWZmZXIuIFNlZSB7QGxpbmsgVGlub2RlLkNCdWZmZXIjZm9yRWFjaH0uXG4gICAqIEBjYWxsYmFjayBGb3JFYWNoQ2FsbGJhY2tUeXBlXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ0J1ZmZlciNcbiAgICogQHBhcmFtIHtPYmplY3R9IGVsZW0gLSBDdXJyZW50IGVsZW1lbnQgb2YgdGhlIGJ1ZmZlci5cbiAgICogQHBhcmFtIHtPYmplY3R9IHByZXYgLSBQcmV2aW91cyBlbGVtZW50IG9mIHRoZSBidWZmZXIuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBuZXh0IC0gTmV4dCBlbGVtZW50IG9mIHRoZSBidWZmZXIuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCAtIEluZGV4IG9mIHRoZSBjdXJyZW50IGVsZW1lbnQuXG4gICAqL1xuXG4gIC8qKlxuICAgKiBBcHBseSBnaXZlbiA8Y29kZT5jYWxsYmFjazwvY29kZT4gdG8gYWxsIGVsZW1lbnRzIG9mIHRoZSBidWZmZXIuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ0J1ZmZlciNcbiAgICpcbiAgICogQHBhcmFtIHtUaW5vZGUuRm9yRWFjaENhbGxiYWNrVHlwZX0gY2FsbGJhY2sgLSBGdW5jdGlvbiB0byBjYWxsIGZvciBlYWNoIGVsZW1lbnQuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzdGFydElkeCAtIE9wdGlvbmFsIGluZGV4IHRvIHN0YXJ0IGl0ZXJhdGluZyBmcm9tIChpbmNsdXNpdmUpLlxuICAgKiBAcGFyYW0ge251bWJlcn0gYmVmb3JlSWR4IC0gT3B0aW9uYWwgaW5kZXggdG8gc3RvcCBpdGVyYXRpbmcgYmVmb3JlIChleGNsdXNpdmUpLlxuICAgKiBAcGFyYW0ge09iamVjdH0gY29udGV4dCAtIGNhbGxpbmcgY29udGV4dCAoaS5lLiB2YWx1ZSBvZiA8Y29kZT50aGlzPC9jb2RlPiBpbiBjYWxsYmFjaylcbiAgICovXG4gIGZvckVhY2goY2FsbGJhY2ssIHN0YXJ0SWR4LCBiZWZvcmVJZHgsIGNvbnRleHQpIHtcbiAgICBzdGFydElkeCA9IHN0YXJ0SWR4IHwgMDtcbiAgICBiZWZvcmVJZHggPSBiZWZvcmVJZHggfHwgdGhpcy5idWZmZXIubGVuZ3RoO1xuXG4gICAgZm9yIChsZXQgaSA9IHN0YXJ0SWR4OyBpIDwgYmVmb3JlSWR4OyBpKyspIHtcbiAgICAgIGNhbGxiYWNrLmNhbGwoY29udGV4dCwgdGhpcy5idWZmZXJbaV0sXG4gICAgICAgIChpID4gc3RhcnRJZHggPyB0aGlzLmJ1ZmZlcltpIC0gMV0gOiB1bmRlZmluZWQpLFxuICAgICAgICAoaSA8IGJlZm9yZUlkeCAtIDEgPyB0aGlzLmJ1ZmZlcltpICsgMV0gOiB1bmRlZmluZWQpLCBpKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRmluZCBlbGVtZW50IGluIGJ1ZmZlciB1c2luZyBidWZmZXIncyBjb21wYXJpc29uIGZ1bmN0aW9uLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNCdWZmZXIjXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBlbGVtIC0gZWxlbWVudCB0byBmaW5kLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBuZWFyZXN0IC0gd2hlbiB0cnVlIGFuZCBleGFjdCBtYXRjaCBpcyBub3QgZm91bmQsIHJldHVybiB0aGUgbmVhcmVzdCBlbGVtZW50IChpbnNlcnRpb24gcG9pbnQpLlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSBpbmRleCBvZiB0aGUgZWxlbWVudCBpbiB0aGUgYnVmZmVyIG9yIC0xLlxuICAgKi9cbiAgZmluZChlbGVtLCBuZWFyZXN0KSB7XG4gICAgY29uc3Qge1xuICAgICAgaWR4XG4gICAgfSA9IHRoaXMuI2ZpbmROZWFyZXN0KGVsZW0sIHRoaXMuYnVmZmVyLCAhbmVhcmVzdCk7XG4gICAgcmV0dXJuIGlkeDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsYmFjayBmb3IgZmlsdGVyaW5nIHRoZSBidWZmZXIuIFNlZSB7QGxpbmsgVGlub2RlLkNCdWZmZXIjZmlsdGVyfS5cbiAgICogQGNhbGxiYWNrIEZvckVhY2hDYWxsYmFja1R5cGVcbiAgICogQG1lbWJlcm9mIFRpbm9kZS5DQnVmZmVyI1xuICAgKiBAcGFyYW0ge09iamVjdH0gZWxlbSAtIEN1cnJlbnQgZWxlbWVudCBvZiB0aGUgYnVmZmVyLlxuICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXggLSBJbmRleCBvZiB0aGUgY3VycmVudCBlbGVtZW50LlxuICAgKiBAcmV0dXJucyB7Ym9vbGVufSA8Y29kZT50cnVlPC9jb2RlPiB0byBrZWVwIHRoZSBlbGVtZW50LCA8Y29kZT5mYWxzZTwvY29kZT4gdG8gcmVtb3ZlLlxuICAgKi9cblxuICAvKipcbiAgICogUmVtb3ZlIGFsbCBlbGVtZW50cyB0aGF0IGRvIG5vdCBwYXNzIHRoZSB0ZXN0IGltcGxlbWVudGVkIGJ5IHRoZSBwcm92aWRlZCBjYWxsYmFjayBmdW5jdGlvbi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5DQnVmZmVyI1xuICAgKlxuICAgKiBAcGFyYW0ge1Rpbm9kZS5GaWx0ZXJDYWxsYmFja1R5cGV9IGNhbGxiYWNrIC0gRnVuY3Rpb24gdG8gY2FsbCBmb3IgZWFjaCBlbGVtZW50LlxuICAgKiBAcGFyYW0ge09iamVjdH0gY29udGV4dCAtIGNhbGxpbmcgY29udGV4dCAoaS5lLiB2YWx1ZSBvZiA8Y29kZT50aGlzPC9jb2RlPiBpbiB0aGUgY2FsbGJhY2spXG4gICAqL1xuICBmaWx0ZXIoY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICBsZXQgY291bnQgPSAwO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5idWZmZXIubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChjYWxsYmFjay5jYWxsKGNvbnRleHQsIHRoaXMuYnVmZmVyW2ldLCBpKSkge1xuICAgICAgICB0aGlzLmJ1ZmZlcltjb3VudF0gPSB0aGlzLmJ1ZmZlcltpXTtcbiAgICAgICAgY291bnQrKztcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmJ1ZmZlci5zcGxpY2UoY291bnQpO1xuICB9XG59XG4iLCIvKipcbiAqIEBmaWxlIEdsb2JhbCBjb25zdGFudHMgYW5kIGNvbmZpZ3VyYXRpb24gcGFyYW1ldGVycy5cbiAqXG4gKiBAY29weXJpZ2h0IDIwMTUtMjAyMiBUaW5vZGUgTExDXG4gKi9cbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHtcbiAgdmVyc2lvbiBhcyBwYWNrYWdlX3ZlcnNpb25cbn0gZnJvbSAnLi4vdmVyc2lvbi5qc29uJztcblxuLy8gR2xvYmFsIGNvbnN0YW50c1xuZXhwb3J0IGNvbnN0IFBST1RPQ09MX1ZFUlNJT04gPSAnMCc7IC8vIE1ham9yIGNvbXBvbmVudCBvZiB0aGUgdmVyc2lvbiwgZS5nLiAnMCcgaW4gJzAuMTcuMScuXG5leHBvcnQgY29uc3QgVkVSU0lPTiA9IHBhY2thZ2VfdmVyc2lvbiB8fCAnMC4yMCc7XG5leHBvcnQgY29uc3QgTElCUkFSWSA9ICd0aW5vZGVqcy8nICsgVkVSU0lPTjtcblxuLy8gVG9waWMgbmFtZSBwcmVmaXhlcy5cbmV4cG9ydCBjb25zdCBUT1BJQ19ORVcgPSAnbmV3JztcbmV4cG9ydCBjb25zdCBUT1BJQ19ORVdfQ0hBTiA9ICduY2gnO1xuZXhwb3J0IGNvbnN0IFRPUElDX01FID0gJ21lJztcbmV4cG9ydCBjb25zdCBUT1BJQ19GTkQgPSAnZm5kJztcbmV4cG9ydCBjb25zdCBUT1BJQ19TWVMgPSAnc3lzJztcbmV4cG9ydCBjb25zdCBUT1BJQ19DSEFOID0gJ2Nobic7XG5leHBvcnQgY29uc3QgVE9QSUNfR1JQID0gJ2dycCc7XG5leHBvcnQgY29uc3QgVE9QSUNfUDJQID0gJ3AycCc7XG5leHBvcnQgY29uc3QgVVNFUl9ORVcgPSAnbmV3JztcblxuLy8gU3RhcnRpbmcgdmFsdWUgb2YgYSBsb2NhbGx5LWdlbmVyYXRlZCBzZXFJZCB1c2VkIGZvciBwZW5kaW5nIG1lc3NhZ2VzLlxuZXhwb3J0IGNvbnN0IExPQ0FMX1NFUUlEID0gMHhGRkZGRkZGO1xuXG4vLyBTdGF0dXMgY29kZXMuXG5leHBvcnQgY29uc3QgTUVTU0FHRV9TVEFUVVNfTk9ORSA9IDA7IC8vIFN0YXR1cyBub3QgYXNzaWduZWQuXG5leHBvcnQgY29uc3QgTUVTU0FHRV9TVEFUVVNfUVVFVUVEID0gMTsgLy8gTG9jYWwgSUQgYXNzaWduZWQsIGluIHByb2dyZXNzIHRvIGJlIHNlbnQuXG5leHBvcnQgY29uc3QgTUVTU0FHRV9TVEFUVVNfU0VORElORyA9IDI7IC8vIFRyYW5zbWlzc2lvbiBzdGFydGVkLlxuZXhwb3J0IGNvbnN0IE1FU1NBR0VfU1RBVFVTX0ZBSUxFRCA9IDM7IC8vIEF0IGxlYXN0IG9uZSBhdHRlbXB0IHdhcyBtYWRlIHRvIHNlbmQgdGhlIG1lc3NhZ2UuXG5leHBvcnQgY29uc3QgTUVTU0FHRV9TVEFUVVNfU0VOVCA9IDQ7IC8vIERlbGl2ZXJlZCB0byB0aGUgc2VydmVyLlxuZXhwb3J0IGNvbnN0IE1FU1NBR0VfU1RBVFVTX1JFQ0VJVkVEID0gNTsgLy8gUmVjZWl2ZWQgYnkgdGhlIGNsaWVudC5cbmV4cG9ydCBjb25zdCBNRVNTQUdFX1NUQVRVU19SRUFEID0gNjsgLy8gUmVhZCBieSB0aGUgdXNlci5cbmV4cG9ydCBjb25zdCBNRVNTQUdFX1NUQVRVU19UT19NRSA9IDc7IC8vIFRoZSBtZXNzYWdlIGlzIHJlY2VpdmVkIGZyb20gYW5vdGhlciB1c2VyLlxuZXhwb3J0IGNvbnN0IE1FU1NBR0VfU1RBVFVTX0RFTF9SQU5HRSA9IDg7IC8vIFRoZSBtZXNzYWdlIHJlcHJlc2VudHMgYSBkZWxldGVkIHJhbmdlLlxuXG4vLyBSZWplY3QgdW5yZXNvbHZlZCBmdXR1cmVzIGFmdGVyIHRoaXMgbWFueSBtaWxsaXNlY29uZHMuXG5leHBvcnQgY29uc3QgRVhQSVJFX1BST01JU0VTX1RJTUVPVVQgPSA1XzAwMDtcbi8vIFBlcmlvZGljaXR5IG9mIGdhcmJhZ2UgY29sbGVjdGlvbiBvZiB1bnJlc29sdmVkIGZ1dHVyZXMuXG5leHBvcnQgY29uc3QgRVhQSVJFX1BST01JU0VTX1BFUklPRCA9IDFfMDAwO1xuXG4vLyBEZWxheSBiZWZvcmUgYWNrbm93bGVkZ2luZyB0aGF0IGEgbWVzc2FnZSB3YXMgcmVjaXZlZC5cbmV4cG9ydCBjb25zdCBSRUNWX1RJTUVPVVQgPSAxMDA7XG5cbi8vIERlZmF1bHQgbnVtYmVyIG9mIG1lc3NhZ2VzIHRvIHB1bGwgaW50byBtZW1vcnkgZnJvbSBwZXJzaXN0ZW50IGNhY2hlLlxuZXhwb3J0IGNvbnN0IERFRkFVTFRfTUVTU0FHRVNfUEFHRSA9IDI0O1xuXG4vLyBVbmljb2RlIERFTCBjaGFyYWN0ZXIgaW5kaWNhdGluZyBkYXRhIHdhcyBkZWxldGVkLlxuZXhwb3J0IGNvbnN0IERFTF9DSEFSID0gJ1xcdTI0MjEnO1xuIiwiLyoqXG4gKiBAZmlsZSBBYnN0cmFjdGlvbiBsYXllciBmb3Igd2Vic29ja2V0IGFuZCBsb25nIHBvbGxpbmcgY29ubmVjdGlvbnMuXG4gKlxuICogQGNvcHlyaWdodCAyMDE1LTIwMjIgVGlub2RlIExMQy5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQge1xuICBqc29uUGFyc2VIZWxwZXJcbn0gZnJvbSAnLi91dGlscy5qcyc7XG5cbmxldCBXZWJTb2NrZXRQcm92aWRlcjtcbmxldCBYSFJQcm92aWRlcjtcblxuLy8gRXJyb3IgY29kZSB0byByZXR1cm4gaW4gY2FzZSBvZiBhIG5ldHdvcmsgcHJvYmxlbS5cbmNvbnN0IE5FVFdPUktfRVJST1IgPSA1MDM7XG5jb25zdCBORVRXT1JLX0VSUk9SX1RFWFQgPSBcIkNvbm5lY3Rpb24gZmFpbGVkXCI7XG5cbi8vIEVycm9yIGNvZGUgdG8gcmV0dXJuIHdoZW4gdXNlciBkaXNjb25uZWN0ZWQgZnJvbSBzZXJ2ZXIuXG5jb25zdCBORVRXT1JLX1VTRVIgPSA0MTg7XG5jb25zdCBORVRXT1JLX1VTRVJfVEVYVCA9IFwiRGlzY29ubmVjdGVkIGJ5IGNsaWVudFwiO1xuXG4vLyBTZXR0aW5ncyBmb3IgZXhwb25lbnRpYWwgYmFja29mZlxuY29uc3QgX0JPRkZfQkFTRSA9IDIwMDA7IC8vIDIwMDAgbWlsbGlzZWNvbmRzLCBtaW5pbXVtIGRlbGF5IGJldHdlZW4gcmVjb25uZWN0c1xuY29uc3QgX0JPRkZfTUFYX0lURVIgPSAxMDsgLy8gTWF4aW11bSBkZWxheSBiZXR3ZWVuIHJlY29ubmVjdHMgMl4xMCAqIDIwMDAgfiAzNCBtaW51dGVzXG5jb25zdCBfQk9GRl9KSVRURVIgPSAwLjM7IC8vIEFkZCByYW5kb20gZGVsYXlcblxuLy8gSGVscGVyIGZ1bmN0aW9uIGZvciBjcmVhdGluZyBhbiBlbmRwb2ludCBVUkwuXG5mdW5jdGlvbiBtYWtlQmFzZVVybChob3N0LCBwcm90b2NvbCwgdmVyc2lvbiwgYXBpS2V5KSB7XG4gIGxldCB1cmwgPSBudWxsO1xuXG4gIGlmIChbJ2h0dHAnLCAnaHR0cHMnLCAnd3MnLCAnd3NzJ10uaW5jbHVkZXMocHJvdG9jb2wpKSB7XG4gICAgdXJsID0gYCR7cHJvdG9jb2x9Oi8vJHtob3N0fWA7XG4gICAgaWYgKHVybC5jaGFyQXQodXJsLmxlbmd0aCAtIDEpICE9PSAnLycpIHtcbiAgICAgIHVybCArPSAnLyc7XG4gICAgfVxuICAgIHVybCArPSAndicgKyB2ZXJzaW9uICsgJy9jaGFubmVscyc7XG4gICAgaWYgKFsnaHR0cCcsICdodHRwcyddLmluY2x1ZGVzKHByb3RvY29sKSkge1xuICAgICAgLy8gTG9uZyBwb2xsaW5nIGVuZHBvaW50IGVuZHMgd2l0aCBcImxwXCIsIGkuZS5cbiAgICAgIC8vICcvdjAvY2hhbm5lbHMvbHAnIHZzIGp1c3QgJy92MC9jaGFubmVscycgZm9yIHdzXG4gICAgICB1cmwgKz0gJy9scCc7XG4gICAgfVxuICAgIHVybCArPSAnP2FwaWtleT0nICsgYXBpS2V5O1xuICB9XG4gIHJldHVybiB1cmw7XG59XG5cbi8qKlxuICogQW4gYWJzdHJhY3Rpb24gZm9yIGEgd2Vic29ja2V0IG9yIGEgbG9uZyBwb2xsaW5nIGNvbm5lY3Rpb24uXG4gKlxuICogQGNsYXNzIENvbm5lY3Rpb25cbiAqIEBtZW1iZXJvZiBUaW5vZGVcblxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyAtIGNvbmZpZ3VyYXRpb24gcGFyYW1ldGVycy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBjb25maWcuaG9zdCAtIEhvc3QgbmFtZSBhbmQgb3B0aW9uYWwgcG9ydCBudW1iZXIgdG8gY29ubmVjdCB0by5cbiAqIEBwYXJhbSB7c3RyaW5nfSBjb25maWcuYXBpS2V5IC0gQVBJIGtleSBnZW5lcmF0ZWQgYnkgPGNvZGU+a2V5Z2VuPC9jb2RlPi5cbiAqIEBwYXJhbSB7c3RyaW5nfSBjb25maWcudHJhbnNwb3J0IC0gTmV0d29yayB0cmFuc3BvcnQgdG8gdXNlLCBlaXRoZXIgPGNvZGU+XCJ3c1wiPGNvZGU+Lzxjb2RlPlwid3NzXCI8L2NvZGU+IGZvciB3ZWJzb2NrZXQgb3JcbiAqICAgICAgPGNvZGU+bHA8L2NvZGU+IGZvciBsb25nIHBvbGxpbmcuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGNvbmZpZy5zZWN1cmUgLSBVc2UgU2VjdXJlIFdlYlNvY2tldCBpZiA8Y29kZT50cnVlPC9jb2RlPi5cbiAqIEBwYXJhbSB7c3RyaW5nfSB2ZXJzaW9uXyAtIE1ham9yIHZhbHVlIG9mIHRoZSBwcm90b2NvbCB2ZXJzaW9uLCBlLmcuICcwJyBpbiAnMC4xNy4xJy5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gYXV0b3JlY29ubmVjdF8gLSBJZiBjb25uZWN0aW9uIGlzIGxvc3QsIHRyeSB0byByZWNvbm5lY3QgYXV0b21hdGljYWxseS5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29ubmVjdGlvbiB7XG4gIC8vIExvZ2dlciwgZG9lcyBub3RoaW5nIGJ5IGRlZmF1bHQuXG4gIHN0YXRpYyAjbG9nID0gXyA9PiB7fTtcblxuICAjYm9mZlRpbWVyID0gbnVsbDtcbiAgI2JvZmZJdGVyYXRpb24gPSAwO1xuICAjYm9mZkNsb3NlZCA9IGZhbHNlOyAvLyBJbmRpY2F0b3IgaWYgdGhlIHNvY2tldCB3YXMgbWFudWFsbHkgY2xvc2VkIC0gZG9uJ3QgYXV0b3JlY29ubmVjdCBpZiB0cnVlLlxuXG4gIC8vIFdlYnNvY2tldC5cbiAgI3NvY2tldCA9IG51bGw7XG5cbiAgaG9zdDtcbiAgc2VjdXJlO1xuICBhcGlLZXk7XG5cbiAgdmVyc2lvbjtcbiAgYXV0b3JlY29ubmVjdDtcblxuICBpbml0aWFsaXplZDtcblxuICAvLyAoY29uZmlnLmhvc3QsIGNvbmZpZy5hcGlLZXksIGNvbmZpZy50cmFuc3BvcnQsIGNvbmZpZy5zZWN1cmUpLCBQUk9UT0NPTF9WRVJTSU9OLCB0cnVlXG4gIGNvbnN0cnVjdG9yKGNvbmZpZywgdmVyc2lvbl8sIGF1dG9yZWNvbm5lY3RfKSB7XG4gICAgdGhpcy5ob3N0ID0gY29uZmlnLmhvc3Q7XG4gICAgdGhpcy5zZWN1cmUgPSBjb25maWcuc2VjdXJlO1xuICAgIHRoaXMuYXBpS2V5ID0gY29uZmlnLmFwaUtleTtcblxuICAgIHRoaXMudmVyc2lvbiA9IHZlcnNpb25fO1xuICAgIHRoaXMuYXV0b3JlY29ubmVjdCA9IGF1dG9yZWNvbm5lY3RfO1xuXG4gICAgaWYgKGNvbmZpZy50cmFuc3BvcnQgPT09ICdscCcpIHtcbiAgICAgIC8vIGV4cGxpY2l0IHJlcXVlc3QgdG8gdXNlIGxvbmcgcG9sbGluZ1xuICAgICAgdGhpcy4jaW5pdF9scCgpO1xuICAgICAgdGhpcy5pbml0aWFsaXplZCA9ICdscCc7XG4gICAgfSBlbHNlIGlmIChjb25maWcudHJhbnNwb3J0ID09PSAnd3MnKSB7XG4gICAgICAvLyBleHBsaWNpdCByZXF1ZXN0IHRvIHVzZSB3ZWIgc29ja2V0XG4gICAgICAvLyBpZiB3ZWJzb2NrZXRzIGFyZSBub3QgYXZhaWxhYmxlLCBob3JyaWJsZSB0aGluZ3Mgd2lsbCBoYXBwZW5cbiAgICAgIHRoaXMuI2luaXRfd3MoKTtcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSAnd3MnO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5pbml0aWFsaXplZCkge1xuICAgICAgLy8gSW52YWxpZCBvciB1bmRlZmluZWQgbmV0d29yayB0cmFuc3BvcnQuXG4gICAgICBDb25uZWN0aW9uLiNsb2coXCJVbmtub3duIG9yIGludmFsaWQgbmV0d29yayB0cmFuc3BvcnQuIFJ1bm5pbmcgdW5kZXIgTm9kZT8gQ2FsbCAnVGlub2RlLnNldE5ldHdvcmtQcm92aWRlcnMoKScuXCIpO1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5rbm93biBvciBpbnZhbGlkIG5ldHdvcmsgdHJhbnNwb3J0LiBSdW5uaW5nIHVuZGVyIE5vZGU/IENhbGwgJ1Rpbm9kZS5zZXROZXR3b3JrUHJvdmlkZXJzKCknLlwiKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVG8gdXNlIENvbm5lY3Rpb24gaW4gYSBub24gYnJvd3NlciBjb250ZXh0LCBzdXBwbHkgV2ViU29ja2V0IGFuZCBYTUxIdHRwUmVxdWVzdCBwcm92aWRlcnMuXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlcm9mIENvbm5lY3Rpb25cbiAgICogQHBhcmFtIHdzUHJvdmlkZXIgV2ViU29ja2V0IHByb3ZpZGVyLCBlLmcuIGZvciBub2RlSlMgLCA8Y29kZT5yZXF1aXJlKCd3cycpPC9jb2RlPi5cbiAgICogQHBhcmFtIHhoclByb3ZpZGVyIFhNTEh0dHBSZXF1ZXN0IHByb3ZpZGVyLCBlLmcuIGZvciBub2RlIDxjb2RlPnJlcXVpcmUoJ3hocicpPC9jb2RlPi5cbiAgICovXG4gIHN0YXRpYyBzZXROZXR3b3JrUHJvdmlkZXJzKHdzUHJvdmlkZXIsIHhoclByb3ZpZGVyKSB7XG4gICAgV2ViU29ja2V0UHJvdmlkZXIgPSB3c1Byb3ZpZGVyO1xuICAgIFhIUlByb3ZpZGVyID0geGhyUHJvdmlkZXI7XG4gIH1cblxuICAvKipcbiAgICogQXNzaWduIGEgbm9uLWRlZmF1bHQgbG9nZ2VyLlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJvZiBDb25uZWN0aW9uXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGwgdmFyaWFkaWMgbG9nZ2luZyBmdW5jdGlvbi5cbiAgICovXG4gIHN0YXRpYyBzZXQgbG9nZ2VyKGwpIHtcbiAgICBDb25uZWN0aW9uLiNsb2cgPSBsO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYXRlIGEgbmV3IGNvbm5lY3Rpb25cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Db25uZWN0aW9uI1xuICAgKiBAcGFyYW0ge3N0cmluZ30gaG9zdF8gSG9zdCBuYW1lIHRvIGNvbm5lY3QgdG87IGlmIDxjb2RlPm51bGw8L2NvZGU+IHRoZSBvbGQgaG9zdCBuYW1lIHdpbGwgYmUgdXNlZC5cbiAgICogQHBhcmFtIHtib29sZWFufSBmb3JjZSBGb3JjZSBuZXcgY29ubmVjdGlvbiBldmVuIGlmIG9uZSBhbHJlYWR5IGV4aXN0cy5cbiAgICogQHJldHVybiB7UHJvbWlzZX0gUHJvbWlzZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBjb25uZWN0aW9uIGNhbGwgY29tcGxldGVzLCByZXNvbHV0aW9uIGlzIGNhbGxlZCB3aXRob3V0XG4gICAqICBwYXJhbWV0ZXJzLCByZWplY3Rpb24gcGFzc2VzIHRoZSB7RXJyb3J9IGFzIHBhcmFtZXRlci5cbiAgICovXG4gIGNvbm5lY3QoaG9zdF8sIGZvcmNlKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG51bGwpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyeSB0byByZXN0b3JlIGEgbmV0d29yayBjb25uZWN0aW9uLCBhbHNvIHJlc2V0IGJhY2tvZmYuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ29ubmVjdGlvbiNcbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSBmb3JjZSAtIHJlY29ubmVjdCBldmVuIGlmIHRoZXJlIGlzIGEgbGl2ZSBjb25uZWN0aW9uIGFscmVhZHkuXG4gICAqL1xuICByZWNvbm5lY3QoZm9yY2UpIHt9XG5cbiAgLyoqXG4gICAqIFRlcm1pbmF0ZSB0aGUgbmV0d29yayBjb25uZWN0aW9uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ29ubmVjdGlvbiNcbiAgICovXG4gIGRpc2Nvbm5lY3QoKSB7fVxuXG4gIC8qKlxuICAgKiBTZW5kIGEgc3RyaW5nIHRvIHRoZSBzZXJ2ZXIuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ29ubmVjdGlvbiNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG1zZyAtIFN0cmluZyB0byBzZW5kLlxuICAgKiBAdGhyb3dzIFRocm93cyBhbiBleGNlcHRpb24gaWYgdGhlIHVuZGVybHlpbmcgY29ubmVjdGlvbiBpcyBub3QgbGl2ZS5cbiAgICovXG4gIHNlbmRUZXh0KG1zZykge31cblxuICAvKipcbiAgICogQ2hlY2sgaWYgY29ubmVjdGlvbiBpcyBhbGl2ZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Db25uZWN0aW9uI1xuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgY29ubmVjdGlvbiBpcyBsaXZlLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgaXNDb25uZWN0ZWQoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgbmFtZSBvZiB0aGUgY3VycmVudCBuZXR3b3JrIHRyYW5zcG9ydC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Db25uZWN0aW9uI1xuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBuYW1lIG9mIHRoZSB0cmFuc3BvcnQgc3VjaCBhcyA8Y29kZT5cIndzXCI8L2NvZGU+IG9yIDxjb2RlPlwibHBcIjwvY29kZT4uXG4gICAqL1xuICB0cmFuc3BvcnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5pdGlhbGl6ZWQ7XG4gIH1cblxuICAvKipcbiAgICogU2VuZCBuZXR3b3JrIHByb2JlIHRvIGNoZWNrIGlmIGNvbm5lY3Rpb24gaXMgaW5kZWVkIGxpdmUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ29ubmVjdGlvbiNcbiAgICovXG4gIHByb2JlKCkge1xuICAgIHRoaXMuc2VuZFRleHQoJzEnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldCBhdXRvcmVjb25uZWN0IGNvdW50ZXIgdG8gemVyby5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Db25uZWN0aW9uI1xuICAgKi9cbiAgYmFja29mZlJlc2V0KCkge1xuICAgIHRoaXMuI2JvZmZSZXNldCgpO1xuICB9XG5cbiAgLy8gQmFja29mZiBpbXBsZW1lbnRhdGlvbiAtIHJlY29ubmVjdCBhZnRlciBhIHRpbWVvdXQuXG4gICNib2ZmUmVjb25uZWN0KCkge1xuICAgIC8vIENsZWFyIHRpbWVyXG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuI2JvZmZUaW1lcik7XG4gICAgLy8gQ2FsY3VsYXRlIHdoZW4gdG8gZmlyZSB0aGUgcmVjb25uZWN0IGF0dGVtcHRcbiAgICBjb25zdCB0aW1lb3V0ID0gX0JPRkZfQkFTRSAqIChNYXRoLnBvdygyLCB0aGlzLiNib2ZmSXRlcmF0aW9uKSAqICgxLjAgKyBfQk9GRl9KSVRURVIgKiBNYXRoLnJhbmRvbSgpKSk7XG4gICAgLy8gVXBkYXRlIGl0ZXJhdGlvbiBjb3VudGVyIGZvciBmdXR1cmUgdXNlXG4gICAgdGhpcy4jYm9mZkl0ZXJhdGlvbiA9ICh0aGlzLiNib2ZmSXRlcmF0aW9uID49IF9CT0ZGX01BWF9JVEVSID8gdGhpcy4jYm9mZkl0ZXJhdGlvbiA6IHRoaXMuI2JvZmZJdGVyYXRpb24gKyAxKTtcbiAgICBpZiAodGhpcy5vbkF1dG9yZWNvbm5lY3RJdGVyYXRpb24pIHtcbiAgICAgIHRoaXMub25BdXRvcmVjb25uZWN0SXRlcmF0aW9uKHRpbWVvdXQpO1xuICAgIH1cblxuICAgIHRoaXMuI2JvZmZUaW1lciA9IHNldFRpbWVvdXQoXyA9PiB7XG4gICAgICBDb25uZWN0aW9uLiNsb2coYFJlY29ubmVjdGluZywgaXRlcj0ke3RoaXMuI2JvZmZJdGVyYXRpb259LCB0aW1lb3V0PSR7dGltZW91dH1gKTtcbiAgICAgIC8vIE1heWJlIHRoZSBzb2NrZXQgd2FzIGNsb3NlZCB3aGlsZSB3ZSB3YWl0ZWQgZm9yIHRoZSB0aW1lcj9cbiAgICAgIGlmICghdGhpcy4jYm9mZkNsb3NlZCkge1xuICAgICAgICBjb25zdCBwcm9tID0gdGhpcy5jb25uZWN0KCk7XG4gICAgICAgIGlmICh0aGlzLm9uQXV0b3JlY29ubmVjdEl0ZXJhdGlvbikge1xuICAgICAgICAgIHRoaXMub25BdXRvcmVjb25uZWN0SXRlcmF0aW9uKDAsIHByb20pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIFN1cHByZXNzIGVycm9yIGlmIGl0J3Mgbm90IHVzZWQuXG4gICAgICAgICAgcHJvbS5jYXRjaChfID0+IHtcbiAgICAgICAgICAgIC8qIGRvIG5vdGhpbmcgKi9cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0aGlzLm9uQXV0b3JlY29ubmVjdEl0ZXJhdGlvbikge1xuICAgICAgICB0aGlzLm9uQXV0b3JlY29ubmVjdEl0ZXJhdGlvbigtMSk7XG4gICAgICB9XG4gICAgfSwgdGltZW91dCk7XG4gIH1cblxuICAvLyBUZXJtaW5hdGUgYXV0by1yZWNvbm5lY3QgcHJvY2Vzcy5cbiAgI2JvZmZTdG9wKCkge1xuICAgIGNsZWFyVGltZW91dCh0aGlzLiNib2ZmVGltZXIpO1xuICAgIHRoaXMuI2JvZmZUaW1lciA9IG51bGw7XG4gIH1cblxuICAvLyBSZXNldCBhdXRvLXJlY29ubmVjdCBpdGVyYXRpb24gY291bnRlci5cbiAgI2JvZmZSZXNldCgpIHtcbiAgICB0aGlzLiNib2ZmSXRlcmF0aW9uID0gMDtcbiAgfVxuXG4gIC8vIEluaXRpYWxpemF0aW9uIGZvciBsb25nIHBvbGxpbmcuXG4gICNpbml0X2xwKCkge1xuICAgIGNvbnN0IFhEUl9VTlNFTlQgPSAwOyAvLyBDbGllbnQgaGFzIGJlZW4gY3JlYXRlZC4gb3BlbigpIG5vdCBjYWxsZWQgeWV0LlxuICAgIGNvbnN0IFhEUl9PUEVORUQgPSAxOyAvLyBvcGVuKCkgaGFzIGJlZW4gY2FsbGVkLlxuICAgIGNvbnN0IFhEUl9IRUFERVJTX1JFQ0VJVkVEID0gMjsgLy8gc2VuZCgpIGhhcyBiZWVuIGNhbGxlZCwgYW5kIGhlYWRlcnMgYW5kIHN0YXR1cyBhcmUgYXZhaWxhYmxlLlxuICAgIGNvbnN0IFhEUl9MT0FESU5HID0gMzsgLy8gRG93bmxvYWRpbmc7IHJlc3BvbnNlVGV4dCBob2xkcyBwYXJ0aWFsIGRhdGEuXG4gICAgY29uc3QgWERSX0RPTkUgPSA0OyAvLyBUaGUgb3BlcmF0aW9uIGlzIGNvbXBsZXRlLlxuXG4gICAgLy8gRnVsbHkgY29tcG9zZWQgZW5kcG9pbnQgVVJMLCB3aXRoIEFQSSBrZXkgJiBTSURcbiAgICBsZXQgX2xwVVJMID0gbnVsbDtcblxuICAgIGxldCBfcG9sbGVyID0gbnVsbDtcbiAgICBsZXQgX3NlbmRlciA9IG51bGw7XG5cbiAgICBsZXQgbHBfc2VuZGVyID0gKHVybF8pID0+IHtcbiAgICAgIGNvbnN0IHNlbmRlciA9IG5ldyBYSFJQcm92aWRlcigpO1xuICAgICAgc2VuZGVyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IChldnQpID0+IHtcbiAgICAgICAgaWYgKHNlbmRlci5yZWFkeVN0YXRlID09IFhEUl9ET05FICYmIHNlbmRlci5zdGF0dXMgPj0gNDAwKSB7XG4gICAgICAgICAgLy8gU29tZSBzb3J0IG9mIGVycm9yIHJlc3BvbnNlXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBMUCBzZW5kZXIgZmFpbGVkLCAke3NlbmRlci5zdGF0dXN9YCk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHNlbmRlci5vcGVuKCdQT1NUJywgdXJsXywgdHJ1ZSk7XG4gICAgICByZXR1cm4gc2VuZGVyO1xuICAgIH1cblxuICAgIGxldCBscF9wb2xsZXIgPSAodXJsXywgcmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBsZXQgcG9sbGVyID0gbmV3IFhIUlByb3ZpZGVyKCk7XG4gICAgICBsZXQgcHJvbWlzZUNvbXBsZXRlZCA9IGZhbHNlO1xuXG4gICAgICBwb2xsZXIub25yZWFkeXN0YXRlY2hhbmdlID0gKGV2dCkgPT4ge1xuICAgICAgICBpZiAocG9sbGVyLnJlYWR5U3RhdGUgPT0gWERSX0RPTkUpIHtcbiAgICAgICAgICBpZiAocG9sbGVyLnN0YXR1cyA9PSAyMDEpIHsgLy8gMjAxID09IEhUVFAuQ3JlYXRlZCwgZ2V0IFNJRFxuICAgICAgICAgICAgbGV0IHBrdCA9IEpTT04ucGFyc2UocG9sbGVyLnJlc3BvbnNlVGV4dCwganNvblBhcnNlSGVscGVyKTtcbiAgICAgICAgICAgIF9scFVSTCA9IHVybF8gKyAnJnNpZD0nICsgcGt0LmN0cmwucGFyYW1zLnNpZDtcbiAgICAgICAgICAgIHBvbGxlciA9IGxwX3BvbGxlcihfbHBVUkwpO1xuICAgICAgICAgICAgcG9sbGVyLnNlbmQobnVsbCk7XG4gICAgICAgICAgICBpZiAodGhpcy5vbk9wZW4pIHtcbiAgICAgICAgICAgICAgdGhpcy5vbk9wZW4oKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHJlc29sdmUpIHtcbiAgICAgICAgICAgICAgcHJvbWlzZUNvbXBsZXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuYXV0b3JlY29ubmVjdCkge1xuICAgICAgICAgICAgICB0aGlzLiNib2ZmU3RvcCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAocG9sbGVyLnN0YXR1cyA8IDQwMCkgeyAvLyA0MDAgPSBIVFRQLkJhZFJlcXVlc3RcbiAgICAgICAgICAgIGlmICh0aGlzLm9uTWVzc2FnZSkge1xuICAgICAgICAgICAgICB0aGlzLm9uTWVzc2FnZShwb2xsZXIucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBvbGxlciA9IGxwX3BvbGxlcihfbHBVUkwpO1xuICAgICAgICAgICAgcG9sbGVyLnNlbmQobnVsbCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIERvbid0IHRocm93IGFuIGVycm9yIGhlcmUsIGdyYWNlZnVsbHkgaGFuZGxlIHNlcnZlciBlcnJvcnNcbiAgICAgICAgICAgIGlmIChyZWplY3QgJiYgIXByb21pc2VDb21wbGV0ZWQpIHtcbiAgICAgICAgICAgICAgcHJvbWlzZUNvbXBsZXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgIHJlamVjdChwb2xsZXIucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLm9uTWVzc2FnZSAmJiBwb2xsZXIucmVzcG9uc2VUZXh0KSB7XG4gICAgICAgICAgICAgIHRoaXMub25NZXNzYWdlKHBvbGxlci5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMub25EaXNjb25uZWN0KSB7XG4gICAgICAgICAgICAgIGNvbnN0IGNvZGUgPSBwb2xsZXIuc3RhdHVzIHx8ICh0aGlzLiNib2ZmQ2xvc2VkID8gTkVUV09SS19VU0VSIDogTkVUV09SS19FUlJPUik7XG4gICAgICAgICAgICAgIGNvbnN0IHRleHQgPSBwb2xsZXIucmVzcG9uc2VUZXh0IHx8ICh0aGlzLiNib2ZmQ2xvc2VkID8gTkVUV09SS19VU0VSX1RFWFQgOiBORVRXT1JLX0VSUk9SX1RFWFQpO1xuICAgICAgICAgICAgICB0aGlzLm9uRGlzY29ubmVjdChuZXcgRXJyb3IodGV4dCArICcgKCcgKyBjb2RlICsgJyknKSwgY29kZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFBvbGxpbmcgaGFzIHN0b3BwZWQuIEluZGljYXRlIGl0IGJ5IHNldHRpbmcgcG9sbGVyIHRvIG51bGwuXG4gICAgICAgICAgICBwb2xsZXIgPSBudWxsO1xuICAgICAgICAgICAgaWYgKCF0aGlzLiNib2ZmQ2xvc2VkICYmIHRoaXMuYXV0b3JlY29ubmVjdCkge1xuICAgICAgICAgICAgICB0aGlzLiNib2ZmUmVjb25uZWN0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgLy8gVXNpbmcgUE9TVCB0byBhdm9pZCBjYWNoaW5nIHJlc3BvbnNlIGJ5IHNlcnZpY2Ugd29ya2VyLlxuICAgICAgcG9sbGVyLm9wZW4oJ1BPU1QnLCB1cmxfLCB0cnVlKTtcbiAgICAgIHJldHVybiBwb2xsZXI7XG4gICAgfVxuXG4gICAgdGhpcy5jb25uZWN0ID0gKGhvc3RfLCBmb3JjZSkgPT4ge1xuICAgICAgdGhpcy4jYm9mZkNsb3NlZCA9IGZhbHNlO1xuXG4gICAgICBpZiAoX3BvbGxlcikge1xuICAgICAgICBpZiAoIWZvcmNlKSB7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICB9XG4gICAgICAgIF9wb2xsZXIub25yZWFkeXN0YXRlY2hhbmdlID0gdW5kZWZpbmVkO1xuICAgICAgICBfcG9sbGVyLmFib3J0KCk7XG4gICAgICAgIF9wb2xsZXIgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICBpZiAoaG9zdF8pIHtcbiAgICAgICAgdGhpcy5ob3N0ID0gaG9zdF87XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGNvbnN0IHVybCA9IG1ha2VCYXNlVXJsKHRoaXMuaG9zdCwgdGhpcy5zZWN1cmUgPyAnaHR0cHMnIDogJ2h0dHAnLCB0aGlzLnZlcnNpb24sIHRoaXMuYXBpS2V5KTtcbiAgICAgICAgQ29ubmVjdGlvbi4jbG9nKFwiTFAgY29ubmVjdGluZyB0bzpcIiwgdXJsKTtcbiAgICAgICAgX3BvbGxlciA9IGxwX3BvbGxlcih1cmwsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgIF9wb2xsZXIuc2VuZChudWxsKTtcbiAgICAgIH0pLmNhdGNoKGVyciA9PiB7XG4gICAgICAgIENvbm5lY3Rpb24uI2xvZyhcIkxQIGNvbm5lY3Rpb24gZmFpbGVkOlwiLCBlcnIpO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIHRoaXMucmVjb25uZWN0ID0gZm9yY2UgPT4ge1xuICAgICAgdGhpcy4jYm9mZlN0b3AoKTtcbiAgICAgIHRoaXMuY29ubmVjdChudWxsLCBmb3JjZSk7XG4gICAgfTtcblxuICAgIHRoaXMuZGlzY29ubmVjdCA9IF8gPT4ge1xuICAgICAgdGhpcy4jYm9mZkNsb3NlZCA9IHRydWU7XG4gICAgICB0aGlzLiNib2ZmU3RvcCgpO1xuXG4gICAgICBpZiAoX3NlbmRlcikge1xuICAgICAgICBfc2VuZGVyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgX3NlbmRlci5hYm9ydCgpO1xuICAgICAgICBfc2VuZGVyID0gbnVsbDtcbiAgICAgIH1cbiAgICAgIGlmIChfcG9sbGVyKSB7XG4gICAgICAgIF9wb2xsZXIub25yZWFkeXN0YXRlY2hhbmdlID0gdW5kZWZpbmVkO1xuICAgICAgICBfcG9sbGVyLmFib3J0KCk7XG4gICAgICAgIF9wb2xsZXIgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5vbkRpc2Nvbm5lY3QpIHtcbiAgICAgICAgdGhpcy5vbkRpc2Nvbm5lY3QobmV3IEVycm9yKE5FVFdPUktfVVNFUl9URVhUICsgJyAoJyArIE5FVFdPUktfVVNFUiArICcpJyksIE5FVFdPUktfVVNFUik7XG4gICAgICB9XG4gICAgICAvLyBFbnN1cmUgaXQncyByZWNvbnN0cnVjdGVkXG4gICAgICBfbHBVUkwgPSBudWxsO1xuICAgIH07XG5cbiAgICB0aGlzLnNlbmRUZXh0ID0gKG1zZykgPT4ge1xuICAgICAgX3NlbmRlciA9IGxwX3NlbmRlcihfbHBVUkwpO1xuICAgICAgaWYgKF9zZW5kZXIgJiYgKF9zZW5kZXIucmVhZHlTdGF0ZSA9PSBYRFJfT1BFTkVEKSkgeyAvLyAxID09IE9QRU5FRFxuICAgICAgICBfc2VuZGVyLnNlbmQobXNnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkxvbmcgcG9sbGVyIGZhaWxlZCB0byBjb25uZWN0XCIpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLmlzQ29ubmVjdGVkID0gXyA9PiB7XG4gICAgICByZXR1cm4gKF9wb2xsZXIgJiYgdHJ1ZSk7XG4gICAgfTtcbiAgfVxuXG4gIC8vIEluaXRpYWxpemF0aW9uIGZvciBXZWJzb2NrZXRcbiAgI2luaXRfd3MoKSB7XG4gICAgdGhpcy5jb25uZWN0ID0gKGhvc3RfLCBmb3JjZSkgPT4ge1xuICAgICAgdGhpcy4jYm9mZkNsb3NlZCA9IGZhbHNlO1xuXG4gICAgICBpZiAodGhpcy4jc29ja2V0KSB7XG4gICAgICAgIGlmICghZm9yY2UgJiYgdGhpcy4jc29ja2V0LnJlYWR5U3RhdGUgPT0gdGhpcy4jc29ja2V0Lk9QRU4pIHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy4jc29ja2V0LmNsb3NlKCk7XG4gICAgICAgIHRoaXMuI3NvY2tldCA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIGlmIChob3N0Xykge1xuICAgICAgICB0aGlzLmhvc3QgPSBob3N0XztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgY29uc3QgdXJsID0gbWFrZUJhc2VVcmwodGhpcy5ob3N0LCB0aGlzLnNlY3VyZSA/ICd3c3MnIDogJ3dzJywgdGhpcy52ZXJzaW9uLCB0aGlzLmFwaUtleSk7XG5cbiAgICAgICAgQ29ubmVjdGlvbi4jbG9nKFwiV1MgY29ubmVjdGluZyB0bzogXCIsIHVybCk7XG5cbiAgICAgICAgLy8gSXQgdGhyb3dzIHdoZW4gdGhlIHNlcnZlciBpcyBub3QgYWNjZXNzaWJsZSBidXQgdGhlIGV4Y2VwdGlvbiBjYW5ub3QgYmUgY2F1Z2h0OlxuICAgICAgICAvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8zMTAwMjU5Mi9qYXZhc2NyaXB0LWRvZXNudC1jYXRjaC1lcnJvci1pbi13ZWJzb2NrZXQtaW5zdGFudGlhdGlvbi8zMTAwMzA1N1xuICAgICAgICBjb25zdCBjb25uID0gbmV3IFdlYlNvY2tldFByb3ZpZGVyKHVybCk7XG5cbiAgICAgICAgY29ubi5vbmVycm9yID0gZXJyID0+IHtcbiAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgfTtcblxuICAgICAgICBjb25uLm9ub3BlbiA9IF8gPT4ge1xuICAgICAgICAgIGlmICh0aGlzLmF1dG9yZWNvbm5lY3QpIHtcbiAgICAgICAgICAgIHRoaXMuI2JvZmZTdG9wKCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHRoaXMub25PcGVuKSB7XG4gICAgICAgICAgICB0aGlzLm9uT3BlbigpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICBjb25uLm9uY2xvc2UgPSBfID0+IHtcbiAgICAgICAgICB0aGlzLiNzb2NrZXQgPSBudWxsO1xuXG4gICAgICAgICAgaWYgKHRoaXMub25EaXNjb25uZWN0KSB7XG4gICAgICAgICAgICBjb25zdCBjb2RlID0gdGhpcy4jYm9mZkNsb3NlZCA/IE5FVFdPUktfVVNFUiA6IE5FVFdPUktfRVJST1I7XG4gICAgICAgICAgICB0aGlzLm9uRGlzY29ubmVjdChuZXcgRXJyb3IodGhpcy4jYm9mZkNsb3NlZCA/IE5FVFdPUktfVVNFUl9URVhUIDogTkVUV09SS19FUlJPUl9URVhUICtcbiAgICAgICAgICAgICAgJyAoJyArIGNvZGUgKyAnKScpLCBjb2RlKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoIXRoaXMuI2JvZmZDbG9zZWQgJiYgdGhpcy5hdXRvcmVjb25uZWN0KSB7XG4gICAgICAgICAgICB0aGlzLiNib2ZmUmVjb25uZWN0KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbm4ub25tZXNzYWdlID0gZXZ0ID0+IHtcbiAgICAgICAgICBpZiAodGhpcy5vbk1lc3NhZ2UpIHtcbiAgICAgICAgICAgIHRoaXMub25NZXNzYWdlKGV2dC5kYXRhKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy4jc29ja2V0ID0gY29ubjtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMucmVjb25uZWN0ID0gZm9yY2UgPT4ge1xuICAgICAgdGhpcy4jYm9mZlN0b3AoKTtcbiAgICAgIHRoaXMuY29ubmVjdChudWxsLCBmb3JjZSk7XG4gICAgfTtcblxuICAgIHRoaXMuZGlzY29ubmVjdCA9IF8gPT4ge1xuICAgICAgdGhpcy4jYm9mZkNsb3NlZCA9IHRydWU7XG4gICAgICB0aGlzLiNib2ZmU3RvcCgpO1xuXG4gICAgICBpZiAoIXRoaXMuI3NvY2tldCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0aGlzLiNzb2NrZXQuY2xvc2UoKTtcbiAgICAgIHRoaXMuI3NvY2tldCA9IG51bGw7XG4gICAgfTtcblxuICAgIHRoaXMuc2VuZFRleHQgPSBtc2cgPT4ge1xuICAgICAgaWYgKHRoaXMuI3NvY2tldCAmJiAodGhpcy4jc29ja2V0LnJlYWR5U3RhdGUgPT0gdGhpcy4jc29ja2V0Lk9QRU4pKSB7XG4gICAgICAgIHRoaXMuI3NvY2tldC5zZW5kKG1zZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJXZWJzb2NrZXQgaXMgbm90IGNvbm5lY3RlZFwiKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy5pc0Nvbm5lY3RlZCA9IF8gPT4ge1xuICAgICAgcmV0dXJuICh0aGlzLiNzb2NrZXQgJiYgKHRoaXMuI3NvY2tldC5yZWFkeVN0YXRlID09IHRoaXMuI3NvY2tldC5PUEVOKSk7XG4gICAgfTtcbiAgfVxuXG4gIC8vIENhbGxiYWNrczpcblxuICAvKipcbiAgICogQSBjYWxsYmFjayB0byBwYXNzIGluY29taW5nIG1lc3NhZ2VzIHRvLiBTZWUge0BsaW5rIFRpbm9kZS5Db25uZWN0aW9uI29uTWVzc2FnZX0uXG4gICAqIEBjYWxsYmFjayBUaW5vZGUuQ29ubmVjdGlvbi5Pbk1lc3NhZ2VcbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Db25uZWN0aW9uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlIC0gTWVzc2FnZSB0byBwcm9jZXNzLlxuICAgKi9cbiAgb25NZXNzYWdlID0gdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBBIGNhbGxiYWNrIGZvciByZXBvcnRpbmcgYSBkcm9wcGVkIGNvbm5lY3Rpb24uXG4gICAqIEB0eXBlIHtmdW5jdGlvbn1cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Db25uZWN0aW9uI1xuICAgKi9cbiAgb25EaXNjb25uZWN0ID0gdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBBIGNhbGxiYWNrIGNhbGxlZCB3aGVuIHRoZSBjb25uZWN0aW9uIGlzIHJlYWR5IHRvIGJlIHVzZWQgZm9yIHNlbmRpbmcuIEZvciB3ZWJzb2NrZXRzIGl0J3Mgc29ja2V0IG9wZW4sXG4gICAqIGZvciBsb25nIHBvbGxpbmcgaXQncyA8Y29kZT5yZWFkeVN0YXRlPTE8L2NvZGU+IChPUEVORUQpXG4gICAqIEB0eXBlIHtmdW5jdGlvbn1cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Db25uZWN0aW9uI1xuICAgKi9cbiAgb25PcGVuID0gdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBBIGNhbGxiYWNrIHRvIG5vdGlmeSBvZiByZWNvbm5lY3Rpb24gYXR0ZW1wdHMuIFNlZSB7QGxpbmsgVGlub2RlLkNvbm5lY3Rpb24jb25BdXRvcmVjb25uZWN0SXRlcmF0aW9ufS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Db25uZWN0aW9uXG4gICAqIEBjYWxsYmFjayBBdXRvcmVjb25uZWN0SXRlcmF0aW9uVHlwZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGltZW91dCAtIHRpbWUgdGlsbCB0aGUgbmV4dCByZWNvbm5lY3QgYXR0ZW1wdCBpbiBtaWxsaXNlY29uZHMuIDxjb2RlPi0xPC9jb2RlPiBtZWFucyByZWNvbm5lY3Qgd2FzIHNraXBwZWQuXG4gICAqIEBwYXJhbSB7UHJvbWlzZX0gcHJvbWlzZSByZXNvbHZlZCBvciByZWplY3RlZCB3aGVuIHRoZSByZWNvbm5lY3QgYXR0ZW1wIGNvbXBsZXRlcy5cbiAgICpcbiAgICovXG4gIC8qKlxuICAgKiBBIGNhbGxiYWNrIHRvIGluZm9ybSB3aGVuIHRoZSBuZXh0IGF0dGFtcHQgdG8gcmVjb25uZWN0IHdpbGwgaGFwcGVuIGFuZCB0byByZWNlaXZlIGNvbm5lY3Rpb24gcHJvbWlzZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Db25uZWN0aW9uI1xuICAgKiBAdHlwZSB7VGlub2RlLkNvbm5lY3Rpb24uQXV0b3JlY29ubmVjdEl0ZXJhdGlvblR5cGV9XG4gICAqL1xuICBvbkF1dG9yZWNvbm5lY3RJdGVyYXRpb24gPSB1bmRlZmluZWQ7XG59XG5cbkNvbm5lY3Rpb24uTkVUV09SS19FUlJPUiA9IE5FVFdPUktfRVJST1I7XG5Db25uZWN0aW9uLk5FVFdPUktfRVJST1JfVEVYVCA9IE5FVFdPUktfRVJST1JfVEVYVDtcbkNvbm5lY3Rpb24uTkVUV09SS19VU0VSID0gTkVUV09SS19VU0VSO1xuQ29ubmVjdGlvbi5ORVRXT1JLX1VTRVJfVEVYVCA9IE5FVFdPUktfVVNFUl9URVhUO1xuIiwiLyoqXG4gKiBAZmlsZSBIZWxwZXIgbWV0aG9kcyBmb3IgZGVhbGluZyB3aXRoIEluZGV4ZWREQiBjYWNoZSBvZiBtZXNzYWdlcywgdXNlcnMsIGFuZCB0b3BpY3MuXG4gKlxuICogQGNvcHlyaWdodCAyMDE1LTIwMjIgVGlub2RlIExMQy5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG4vLyBOT1RFIFRPIERFVkVMT1BFUlM6XG4vLyBMb2NhbGl6YWJsZSBzdHJpbmdzIHNob3VsZCBiZSBkb3VibGUgcXVvdGVkIFwi0YHRgtGA0L7QutCwINC90LAg0LTRgNGD0LPQvtC8INGP0LfRi9C60LVcIixcbi8vIG5vbi1sb2NhbGl6YWJsZSBzdHJpbmdzIHNob3VsZCBiZSBzaW5nbGUgcXVvdGVkICdub24tbG9jYWxpemVkJy5cblxuY29uc3QgREJfVkVSU0lPTiA9IDE7XG5jb25zdCBEQl9OQU1FID0gJ3Rpbm9kZS13ZWInO1xuXG5sZXQgSURCUHJvdmlkZXI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERCIHtcbiAgI29uRXJyb3IgPSBfID0+IHt9O1xuICAjbG9nZ2VyID0gXyA9PiB7fTtcblxuICAvLyBJbnN0YW5jZSBvZiBJbmRleERCLlxuICBkYiA9IG51bGw7XG4gIC8vIEluZGljYXRvciB0aGF0IHRoZSBjYWNoZSBpcyBkaXNhYmxlZC5cbiAgZGlzYWJsZWQgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihvbkVycm9yLCBsb2dnZXIpIHtcbiAgICB0aGlzLiNvbkVycm9yID0gb25FcnJvciB8fCB0aGlzLiNvbkVycm9yO1xuICAgIHRoaXMuI2xvZ2dlciA9IGxvZ2dlciB8fCB0aGlzLiNsb2dnZXI7XG4gIH1cblxuICAjbWFwT2JqZWN0cyhzb3VyY2UsIGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgaWYgKCF0aGlzLmRiKSB7XG4gICAgICByZXR1cm4gZGlzYWJsZWQgP1xuICAgICAgICBQcm9taXNlLnJlc29sdmUoW10pIDpcbiAgICAgICAgUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwibm90IGluaXRpYWxpemVkXCIpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgdHJ4ID0gdGhpcy5kYi50cmFuc2FjdGlvbihbc291cmNlXSk7XG4gICAgICB0cngub25lcnJvciA9IChldmVudCkgPT4ge1xuICAgICAgICB0aGlzLiNsb2dnZXIoJ1BDYWNoZScsICdtYXBPYmplY3RzJywgc291cmNlLCBldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgICByZWplY3QoZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgIH07XG4gICAgICB0cngub2JqZWN0U3RvcmUoc291cmNlKS5nZXRBbGwoKS5vbnN1Y2Nlc3MgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgZXZlbnQudGFyZ2V0LnJlc3VsdC5mb3JFYWNoKCh0b3BpYykgPT4ge1xuICAgICAgICAgICAgY2FsbGJhY2suY2FsbChjb250ZXh0LCB0b3BpYyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmVzb2x2ZShldmVudC50YXJnZXQucmVzdWx0KTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSBwZXJzaXN0ZW50IGNhY2hlOiBvcGVuIG9yIGNyZWF0ZS91cGdyYWRlIGlmIG5lZWRlZC5cbiAgICogQHJldHVybnMge1Byb21pc2V9IHByb21pc2UgdG8gYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgREIgaXMgaW5pdGlhbGl6ZWQuXG4gICAqL1xuICBpbml0RGF0YWJhc2UoKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIC8vIE9wZW4gdGhlIGRhdGFiYXNlIGFuZCBpbml0aWFsaXplIGNhbGxiYWNrcy5cbiAgICAgIGNvbnN0IHJlcSA9IElEQlByb3ZpZGVyLm9wZW4oREJfTkFNRSwgREJfVkVSU0lPTik7XG4gICAgICByZXEub25zdWNjZXNzID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuZGIgPSBldmVudC50YXJnZXQucmVzdWx0O1xuICAgICAgICB0aGlzLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIHJlc29sdmUodGhpcy5kYik7XG4gICAgICB9O1xuICAgICAgcmVxLm9uZXJyb3IgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy4jbG9nZ2VyKCdQQ2FjaGUnLCBcImZhaWxlZCB0byBpbml0aWFsaXplXCIsIGV2ZW50KTtcbiAgICAgICAgcmVqZWN0KGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICAgIHRoaXMuI29uRXJyb3IoZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgIH07XG4gICAgICByZXEub251cGdyYWRlbmVlZGVkID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuZGIgPSBldmVudC50YXJnZXQucmVzdWx0O1xuXG4gICAgICAgIHRoaXMuZGIub25lcnJvciA9IChldmVudCkgPT4ge1xuICAgICAgICAgIHRoaXMuI2xvZ2dlcignUENhY2hlJywgXCJmYWlsZWQgdG8gY3JlYXRlIHN0b3JhZ2VcIiwgZXZlbnQpO1xuICAgICAgICAgIHRoaXMuI29uRXJyb3IoZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBJbmRpdmlkdWFsIG9iamVjdCBzdG9yZXMuXG4gICAgICAgIC8vIE9iamVjdCBzdG9yZSAodGFibGUpIGZvciB0b3BpY3MuIFRoZSBwcmltYXJ5IGtleSBpcyB0b3BpYyBuYW1lLlxuICAgICAgICB0aGlzLmRiLmNyZWF0ZU9iamVjdFN0b3JlKCd0b3BpYycsIHtcbiAgICAgICAgICBrZXlQYXRoOiAnbmFtZSdcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gVXNlcnMgb2JqZWN0IHN0b3JlLiBVSUQgaXMgdGhlIHByaW1hcnkga2V5LlxuICAgICAgICB0aGlzLmRiLmNyZWF0ZU9iamVjdFN0b3JlKCd1c2VyJywge1xuICAgICAgICAgIGtleVBhdGg6ICd1aWQnXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFN1YnNjcmlwdGlvbnMgb2JqZWN0IHN0b3JlIHRvcGljIDwtPiB1c2VyLiBUb3BpYyBuYW1lICsgVUlEIGlzIHRoZSBwcmltYXJ5IGtleS5cbiAgICAgICAgdGhpcy5kYi5jcmVhdGVPYmplY3RTdG9yZSgnc3Vic2NyaXB0aW9uJywge1xuICAgICAgICAgIGtleVBhdGg6IFsndG9waWMnLCAndWlkJ11cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gTWVzc2FnZXMgb2JqZWN0IHN0b3JlLiBUaGUgcHJpbWFyeSBrZXkgaXMgdG9waWMgbmFtZSArIHNlcS5cbiAgICAgICAgdGhpcy5kYi5jcmVhdGVPYmplY3RTdG9yZSgnbWVzc2FnZScsIHtcbiAgICAgICAgICBrZXlQYXRoOiBbJ3RvcGljJywgJ3NlcSddXG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWxldGUgcGVyc2lzdGVudCBjYWNoZS5cbiAgICovXG4gIGRlbGV0ZURhdGFiYXNlKCkge1xuICAgIC8vIENsb3NlIGNvbm5lY3Rpb24sIG90aGVyd2lzZSBvcGVyYXRpb25zIHdpbGwgZmFpbCB3aXRoICdvbmJsb2NrZWQnLlxuICAgIGlmICh0aGlzLmRiKSB7XG4gICAgICB0aGlzLmRiLmNsb3NlKCk7XG4gICAgICB0aGlzLmRiID0gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IHJlcSA9IElEQlByb3ZpZGVyLmRlbGV0ZURhdGFiYXNlKERCX05BTUUpO1xuICAgICAgcmVxLm9uYmxvY2tlZCA9IChldmVudCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5kYikge1xuICAgICAgICAgIHRoaXMuZGIuY2xvc2UoKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBlcnIgPSBuZXcgRXJyb3IoXCJibG9ja2VkXCIpO1xuICAgICAgICB0aGlzLiNsb2dnZXIoJ1BDYWNoZScsICdkZWxldGVEYXRhYmFzZScsIGVycik7XG4gICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgfTtcbiAgICAgIHJlcS5vbnN1Y2Nlc3MgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy5kYiA9IG51bGw7XG4gICAgICAgIHRoaXMuZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICByZXNvbHZlKHRydWUpO1xuICAgICAgfTtcbiAgICAgIHJlcS5vbmVycm9yID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuI2xvZ2dlcignUENhY2hlJywgJ2RlbGV0ZURhdGFiYXNlJywgZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgICAgcmVqZWN0KGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHBlcnNpc3RlbnQgY2FjaGUgaXMgcmVhZHkgZm9yIHVzZS5cbiAgICogQG1lbWJlck9mIERCXG4gICAqIEByZXR1cm5zIHtib29sZWFufSA8Y29kZT50cnVlPC9jb2RlPiBpZiBjYWNoZSBpcyByZWFkeSwgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIGlzUmVhZHkoKSB7XG4gICAgcmV0dXJuICEhdGhpcy5kYjtcbiAgfVxuXG4gIC8vIFRvcGljcy5cblxuICAvKipcbiAgICogU2F2ZSB0byBjYWNoZSBvciB1cGRhdGUgdG9waWMgaW4gcGVyc2lzdGVudCBjYWNoZS5cbiAgICogQG1lbWJlck9mIERCXG4gICAqIEBwYXJhbSB7VG9waWN9IHRvcGljIC0gdG9waWMgdG8gYmUgYWRkZWQgb3IgdXBkYXRlZC5cbiAgICogQHJldHVybnMge1Byb21pc2V9IHByb21pc2UgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gb3BlcmF0aW9uIGNvbXBsZXRpb24uXG4gICAqL1xuICB1cGRUb3BpYyh0b3BpYykge1xuICAgIGlmICghdGhpcy5pc1JlYWR5KCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmRpc2FibGVkID9cbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkgOlxuICAgICAgICBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJub3QgaW5pdGlhbGl6ZWRcIikpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgdHJ4ID0gdGhpcy5kYi50cmFuc2FjdGlvbihbJ3RvcGljJ10sICdyZWFkd3JpdGUnKTtcbiAgICAgIHRyeC5vbmNvbXBsZXRlID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHJlc29sdmUoZXZlbnQudGFyZ2V0LnJlc3VsdCk7XG4gICAgICB9O1xuICAgICAgdHJ4Lm9uZXJyb3IgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy4jbG9nZ2VyKCdQQ2FjaGUnLCAndXBkVG9waWMnLCBldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgICByZWplY3QoZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgIH07XG4gICAgICBjb25zdCByZXEgPSB0cngub2JqZWN0U3RvcmUoJ3RvcGljJykuZ2V0KHRvcGljLm5hbWUpO1xuICAgICAgcmVxLm9uc3VjY2VzcyA9IChldmVudCkgPT4ge1xuICAgICAgICB0cngub2JqZWN0U3RvcmUoJ3RvcGljJykucHV0KERCLiNzZXJpYWxpemVUb3BpYyhyZXEucmVzdWx0LCB0b3BpYykpO1xuICAgICAgICB0cnguY29tbWl0KCk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hcmsgb3IgdW5tYXJrIHRvcGljIGFzIGRlbGV0ZWQuXG4gICAqIEBtZW1iZXJPZiBEQlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIG5hbWUgb2YgdGhlIHRvcGljIHRvIG1hcmsgb3IgdW5tYXJrLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBwcm9taXNlIHJlc29sdmVkL3JlamVjdGVkIG9uIG9wZXJhdGlvbiBjb21wbGV0aW9uLlxuICAgKi9cbiAgbWFya1RvcGljQXNEZWxldGVkKG5hbWUpIHtcbiAgICBpZiAoIXRoaXMuaXNSZWFkeSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5kaXNhYmxlZCA/XG4gICAgICAgIFByb21pc2UucmVzb2x2ZSgpIDpcbiAgICAgICAgUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwibm90IGluaXRpYWxpemVkXCIpKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IHRyeCA9IHRoaXMuZGIudHJhbnNhY3Rpb24oWyd0b3BpYyddLCAncmVhZHdyaXRlJyk7XG4gICAgICB0cngub25jb21wbGV0ZSA9IChldmVudCkgPT4ge1xuICAgICAgICByZXNvbHZlKGV2ZW50LnRhcmdldC5yZXN1bHQpO1xuICAgICAgfTtcbiAgICAgIHRyeC5vbmVycm9yID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuI2xvZ2dlcignUENhY2hlJywgJ21hcmtUb3BpY0FzRGVsZXRlZCcsIGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICAgIHJlamVjdChldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgfTtcbiAgICAgIGNvbnN0IHJlcSA9IHRyeC5vYmplY3RTdG9yZSgndG9waWMnKS5nZXQobmFtZSk7XG4gICAgICByZXEub25zdWNjZXNzID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIGNvbnN0IHRvcGljID0gZXZlbnQudGFyZ2V0LnJlc3VsdDtcbiAgICAgICAgdG9waWMuX2RlbGV0ZWQgPSB0cnVlO1xuICAgICAgICB0cngub2JqZWN0U3RvcmUoJ3RvcGljJykucHV0KHRvcGljKTtcbiAgICAgICAgdHJ4LmNvbW1pdCgpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgdG9waWMgZnJvbSBwZXJzaXN0ZW50IGNhY2hlLlxuICAgKiBAbWVtYmVyT2YgREJcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBuYW1lIG9mIHRoZSB0b3BpYyB0byByZW1vdmUgZnJvbSBkYXRhYmFzZS5cbiAgICogQHJldHVybiB7UHJvbWlzZX0gcHJvbWlzZSByZXNvbHZlZC9yZWplY3RlZCBvbiBvcGVyYXRpb24gY29tcGxldGlvbi5cbiAgICovXG4gIHJlbVRvcGljKG5hbWUpIHtcbiAgICBpZiAoIXRoaXMuaXNSZWFkeSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5kaXNhYmxlZCA/XG4gICAgICAgIFByb21pc2UucmVzb2x2ZSgpIDpcbiAgICAgICAgUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwibm90IGluaXRpYWxpemVkXCIpKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IHRyeCA9IHRoaXMuZGIudHJhbnNhY3Rpb24oWyd0b3BpYycsICdzdWJzY3JpcHRpb24nLCAnbWVzc2FnZSddLCAncmVhZHdyaXRlJyk7XG4gICAgICB0cngub25jb21wbGV0ZSA9IChldmVudCkgPT4ge1xuICAgICAgICByZXNvbHZlKGV2ZW50LnRhcmdldC5yZXN1bHQpO1xuICAgICAgfTtcbiAgICAgIHRyeC5vbmVycm9yID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuI2xvZ2dlcignUENhY2hlJywgJ3JlbVRvcGljJywgZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgICAgcmVqZWN0KGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICB9O1xuICAgICAgdHJ4Lm9iamVjdFN0b3JlKCd0b3BpYycpLmRlbGV0ZShJREJLZXlSYW5nZS5vbmx5KG5hbWUpKTtcbiAgICAgIHRyeC5vYmplY3RTdG9yZSgnc3Vic2NyaXB0aW9uJykuZGVsZXRlKElEQktleVJhbmdlLmJvdW5kKFtuYW1lLCAnLSddLCBbbmFtZSwgJ34nXSkpO1xuICAgICAgdHJ4Lm9iamVjdFN0b3JlKCdtZXNzYWdlJykuZGVsZXRlKElEQktleVJhbmdlLmJvdW5kKFtuYW1lLCAwXSwgW25hbWUsIE51bWJlci5NQVhfU0FGRV9JTlRFR0VSXSkpO1xuICAgICAgdHJ4LmNvbW1pdCgpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4ZWN1dGUgYSBjYWxsYmFjayBmb3IgZWFjaCBzdG9yZWQgdG9waWMuXG4gICAqIEBtZW1iZXJPZiBEQlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayAtIGZ1bmN0aW9uIHRvIGNhbGwgZm9yIGVhY2ggdG9waWMuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZXh0IC0gdGhlIHZhbHVlIG9yIDxjb2RlPnRoaXM8L2NvZGU+IGluc2lkZSB0aGUgY2FsbGJhY2suXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IHByb21pc2UgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gb3BlcmF0aW9uIGNvbXBsZXRpb24uXG4gICAqL1xuICBtYXBUb3BpY3MoY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICByZXR1cm4gdGhpcy4jbWFwT2JqZWN0cygndG9waWMnLCBjYWxsYmFjaywgY29udGV4dCk7XG4gIH1cblxuICAvKipcbiAgICogQ29weSBkYXRhIGZyb20gc2VyaWFsaXplZCBvYmplY3QgdG8gdG9waWMuXG4gICAqIEBtZW1iZXJPZiBEQlxuICAgKiBAcGFyYW0ge1RvcGljfSB0b3BpYyAtIHRhcmdldCB0byBkZXNlcmlhbGl6ZSB0by5cbiAgICogQHBhcmFtIHtPYmplY3R9IHNyYyAtIHNlcmlhbGl6ZWQgZGF0YSB0byBjb3B5IGZyb20uXG4gICAqL1xuICBkZXNlcmlhbGl6ZVRvcGljKHRvcGljLCBzcmMpIHtcbiAgICBEQi4jZGVzZXJpYWxpemVUb3BpYyh0b3BpYywgc3JjKTtcbiAgfVxuXG4gIC8vIFVzZXJzLlxuICAvKipcbiAgICogQWRkIG9yIHVwZGF0ZSB1c2VyIG9iamVjdCBpbiB0aGUgcGVyc2lzdGVudCBjYWNoZS5cbiAgICogQG1lbWJlck9mIERCXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1aWQgLSBJRCBvZiB0aGUgdXNlciB0byBzYXZlIG9yIHVwZGF0ZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IHB1YiAtIHVzZXIncyA8Y29kZT5wdWJsaWM8L2NvZGU+IGluZm9ybWF0aW9uLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gcHJvbWlzZSByZXNvbHZlZC9yZWplY3RlZCBvbiBvcGVyYXRpb24gY29tcGxldGlvbi5cbiAgICovXG4gIHVwZFVzZXIodWlkLCBwdWIpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIgfHwgcHViID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIE5vIHBvaW50IGludXBkYXRpbmcgdXNlciB3aXRoIGludmFsaWQgZGF0YS5cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCF0aGlzLmlzUmVhZHkoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZGlzYWJsZWQgP1xuICAgICAgICBQcm9taXNlLnJlc29sdmUoKSA6XG4gICAgICAgIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIm5vdCBpbml0aWFsaXplZFwiKSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCB0cnggPSB0aGlzLmRiLnRyYW5zYWN0aW9uKFsndXNlciddLCAncmVhZHdyaXRlJyk7XG4gICAgICB0cngub25jb21wbGV0ZSA9IChldmVudCkgPT4ge1xuICAgICAgICByZXNvbHZlKGV2ZW50LnRhcmdldC5yZXN1bHQpO1xuICAgICAgfTtcbiAgICAgIHRyeC5vbmVycm9yID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuI2xvZ2dlcignUENhY2hlJywgJ3VwZFVzZXInLCBldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgICByZWplY3QoZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgIH07XG4gICAgICB0cngub2JqZWN0U3RvcmUoJ3VzZXInKS5wdXQoe1xuICAgICAgICB1aWQ6IHVpZCxcbiAgICAgICAgcHVibGljOiBwdWJcbiAgICAgIH0pO1xuICAgICAgdHJ4LmNvbW1pdCgpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSB1c2VyIGZyb20gcGVyc2lzdGVudCBjYWNoZS5cbiAgICogQG1lbWJlck9mIERCXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1aWQgLSBJRCBvZiB0aGUgdXNlciB0byByZW1vdmUgZnJvbSB0aGUgY2FjaGUuXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IHByb21pc2UgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gb3BlcmF0aW9uIGNvbXBsZXRpb24uXG4gICAqL1xuICByZW1Vc2VyKHVpZCkge1xuICAgIGlmICghdGhpcy5pc1JlYWR5KCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmRpc2FibGVkID9cbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkgOlxuICAgICAgICBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJub3QgaW5pdGlhbGl6ZWRcIikpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgdHJ4ID0gdGhpcy5kYi50cmFuc2FjdGlvbihbJ3VzZXInXSwgJ3JlYWR3cml0ZScpO1xuICAgICAgdHJ4Lm9uY29tcGxldGUgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgcmVzb2x2ZShldmVudC50YXJnZXQucmVzdWx0KTtcbiAgICAgIH07XG4gICAgICB0cngub25lcnJvciA9IChldmVudCkgPT4ge1xuICAgICAgICB0aGlzLiNsb2dnZXIoJ1BDYWNoZScsICdyZW1Vc2VyJywgZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgICAgcmVqZWN0KGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICB9O1xuICAgICAgdHJ4Lm9iamVjdFN0b3JlKCd1c2VyJykuZGVsZXRlKElEQktleVJhbmdlLm9ubHkodWlkKSk7XG4gICAgICB0cnguY29tbWl0KCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogRXhlY3V0ZSBhIGNhbGxiYWNrIGZvciBlYWNoIHN0b3JlZCB1c2VyLlxuICAgKiBAbWVtYmVyT2YgREJcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgLSBmdW5jdGlvbiB0byBjYWxsIGZvciBlYWNoIHRvcGljLlxuICAgKiBAcGFyYW0ge09iamVjdH0gY29udGV4dCAtIHRoZSB2YWx1ZSBvciA8Y29kZT50aGlzPC9jb2RlPiBpbnNpZGUgdGhlIGNhbGxiYWNrLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBwcm9taXNlIHJlc29sdmVkL3JlamVjdGVkIG9uIG9wZXJhdGlvbiBjb21wbGV0aW9uLlxuICAgKi9cbiAgbWFwVXNlcnMoY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICByZXR1cm4gdGhpcy4jbWFwT2JqZWN0cygndXNlcicsIGNhbGxiYWNrLCBjb250ZXh0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWFkIGEgc2luZ2xlIHVzZXIgZnJvbSBwZXJzaXN0ZW50IGNhY2hlLlxuICAgKiBAbWVtYmVyT2YgREJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVpZCAtIElEIG9mIHRoZSB1c2VyIHRvIGZldGNoIGZyb20gY2FjaGUuXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IHByb21pc2UgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gb3BlcmF0aW9uIGNvbXBsZXRpb24uXG4gICAqL1xuICBnZXRVc2VyKHVpZCkge1xuICAgIGlmICghdGhpcy5pc1JlYWR5KCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmRpc2FibGVkID9cbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkgOlxuICAgICAgICBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJub3QgaW5pdGlhbGl6ZWRcIikpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgdHJ4ID0gdGhpcy5kYi50cmFuc2FjdGlvbihbJ3VzZXInXSk7XG4gICAgICB0cngub25jb21wbGV0ZSA9IChldmVudCkgPT4ge1xuICAgICAgICBjb25zdCB1c2VyID0gZXZlbnQudGFyZ2V0LnJlc3VsdDtcbiAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgdXNlcjogdXNlci51aWQsXG4gICAgICAgICAgcHVibGljOiB1c2VyLnB1YmxpY1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgICB0cngub25lcnJvciA9IChldmVudCkgPT4ge1xuICAgICAgICB0aGlzLiNsb2dnZXIoJ1BDYWNoZScsICdnZXRVc2VyJywgZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgICAgcmVqZWN0KGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICB9O1xuICAgICAgdHJ4Lm9iamVjdFN0b3JlKCd1c2VyJykuZ2V0KHVpZCk7XG4gICAgfSk7XG4gIH1cblxuICAvLyBTdWJzY3JpcHRpb25zLlxuICAvKipcbiAgICogQWRkIG9yIHVwZGF0ZSBzdWJzY3JpcHRpb24gaW4gcGVyc2lzdGVudCBjYWNoZS5cbiAgICogQG1lbWJlck9mIERCXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpY05hbWUgLSBuYW1lIG9mIHRoZSB0b3BpYyB3aGljaCBvd25zIHRoZSBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdWlkIC0gSUQgb2YgdGhlIHN1YnNjcmliZWQgdXNlci5cbiAgICogQHBhcmFtIHtPYmplY3R9IHN1YiAtIHN1YnNjcmlwdGlvbiB0byBzYXZlLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBwcm9taXNlIHJlc29sdmVkL3JlamVjdGVkIG9uIG9wZXJhdGlvbiBjb21wbGV0aW9uLlxuICAgKi9cbiAgdXBkU3Vic2NyaXB0aW9uKHRvcGljTmFtZSwgdWlkLCBzdWIpIHtcbiAgICBpZiAoIXRoaXMuaXNSZWFkeSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5kaXNhYmxlZCA/XG4gICAgICAgIFByb21pc2UucmVzb2x2ZSgpIDpcbiAgICAgICAgUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwibm90IGluaXRpYWxpemVkXCIpKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IHRyeCA9IHRoaXMuZGIudHJhbnNhY3Rpb24oWydzdWJzY3JpcHRpb24nXSwgJ3JlYWR3cml0ZScpO1xuICAgICAgdHJ4Lm9uY29tcGxldGUgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgcmVzb2x2ZShldmVudC50YXJnZXQucmVzdWx0KTtcbiAgICAgIH07XG4gICAgICB0cngub25lcnJvciA9IChldmVudCkgPT4ge1xuICAgICAgICB0aGlzLiNsb2dnZXIoJ1BDYWNoZScsICd1cGRTdWJzY3JpcHRpb24nLCBldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgICByZWplY3QoZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgIH07XG4gICAgICB0cngub2JqZWN0U3RvcmUoJ3N1YnNjcmlwdGlvbicpLmdldChbdG9waWNOYW1lLCB1aWRdKS5vbnN1Y2Nlc3MgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgdHJ4Lm9iamVjdFN0b3JlKCdzdWJzY3JpcHRpb24nKS5wdXQoREIuI3NlcmlhbGl6ZVN1YnNjcmlwdGlvbihldmVudC50YXJnZXQucmVzdWx0LCB0b3BpY05hbWUsIHVpZCwgc3ViKSk7XG4gICAgICAgIHRyeC5jb21taXQoKTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogRXhlY3V0ZSBhIGNhbGxiYWNrIGZvciBlYWNoIGNhY2hlZCBzdWJzY3JpcHRpb24gaW4gYSBnaXZlbiB0b3BpYy5cbiAgICogQG1lbWJlck9mIERCXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpY05hbWUgLSBuYW1lIG9mIHRoZSB0b3BpYyB3aGljaCBvd25zIHRoZSBzdWJzY3JpcHRpb25zLlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayAtIGZ1bmN0aW9uIHRvIGNhbGwgZm9yIGVhY2ggc3Vic2NyaXB0aW9uLlxuICAgKiBAcGFyYW0ge09iamVjdH0gY29udGV4dCAtIHRoZSB2YWx1ZSBvciA8Y29kZT50aGlzPC9jb2RlPiBpbnNpZGUgdGhlIGNhbGxiYWNrLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBwcm9taXNlIHJlc29sdmVkL3JlamVjdGVkIG9uIG9wZXJhdGlvbiBjb21wbGV0aW9uLlxuICAgKi9cbiAgbWFwU3Vic2NyaXB0aW9ucyh0b3BpY05hbWUsIGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgaWYgKCF0aGlzLmlzUmVhZHkoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZGlzYWJsZWQgP1xuICAgICAgICBQcm9taXNlLnJlc29sdmUoW10pIDpcbiAgICAgICAgUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwibm90IGluaXRpYWxpemVkXCIpKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IHRyeCA9IHRoaXMuZGIudHJhbnNhY3Rpb24oWydzdWJzY3JpcHRpb24nXSk7XG4gICAgICB0cngub25lcnJvciA9IChldmVudCkgPT4ge1xuICAgICAgICB0aGlzLiNsb2dnZXIoJ1BDYWNoZScsICdtYXBTdWJzY3JpcHRpb25zJywgZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgICAgcmVqZWN0KGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICB9O1xuICAgICAgdHJ4Lm9iamVjdFN0b3JlKCdzdWJzY3JpcHRpb24nKS5nZXRBbGwoSURCS2V5UmFuZ2UuYm91bmQoW3RvcGljTmFtZSwgJy0nXSwgW3RvcGljTmFtZSwgJ34nXSkpLm9uc3VjY2VzcyA9IChldmVudCkgPT4ge1xuICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICBldmVudC50YXJnZXQucmVzdWx0LmZvckVhY2goKHRvcGljKSA9PiB7XG4gICAgICAgICAgICBjYWxsYmFjay5jYWxsKGNvbnRleHQsIHRvcGljKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXNvbHZlKGV2ZW50LnRhcmdldC5yZXN1bHQpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIE1lc3NhZ2VzLlxuXG4gIC8qKlxuICAgKiBTYXZlIG1lc3NhZ2UgdG8gcGVyc2lzdGVudCBjYWNoZS5cbiAgICogQG1lbWJlck9mIERCXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpY05hbWUgLSBuYW1lIG9mIHRoZSB0b3BpYyB3aGljaCBvd25zIHRoZSBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gbXNnIC0gbWVzc2FnZSB0byBzYXZlLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBwcm9taXNlIHJlc29sdmVkL3JlamVjdGVkIG9uIG9wZXJhdGlvbiBjb21wbGV0aW9uLlxuICAgKi9cbiAgYWRkTWVzc2FnZShtc2cpIHtcbiAgICBpZiAoIXRoaXMuaXNSZWFkeSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5kaXNhYmxlZCA/XG4gICAgICAgIFByb21pc2UucmVzb2x2ZSgpIDpcbiAgICAgICAgUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwibm90IGluaXRpYWxpemVkXCIpKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IHRyeCA9IHRoaXMuZGIudHJhbnNhY3Rpb24oWydtZXNzYWdlJ10sICdyZWFkd3JpdGUnKTtcbiAgICAgIHRyeC5vbnN1Y2Nlc3MgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgcmVzb2x2ZShldmVudC50YXJnZXQucmVzdWx0KTtcbiAgICAgIH07XG4gICAgICB0cngub25lcnJvciA9IChldmVudCkgPT4ge1xuICAgICAgICB0aGlzLiNsb2dnZXIoJ1BDYWNoZScsICdhZGRNZXNzYWdlJywgZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgICAgcmVqZWN0KGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICB9O1xuICAgICAgdHJ4Lm9iamVjdFN0b3JlKCdtZXNzYWdlJykuYWRkKERCLiNzZXJpYWxpemVNZXNzYWdlKG51bGwsIG1zZykpO1xuICAgICAgdHJ4LmNvbW1pdCgpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSBkZWxpdmVyeSBzdGF0dXMgb2YgYSBtZXNzYWdlIHN0b3JlZCBpbiBwZXJzaXN0ZW50IGNhY2hlLlxuICAgKiBAbWVtYmVyT2YgREJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljTmFtZSAtIG5hbWUgb2YgdGhlIHRvcGljIHdoaWNoIG93bnMgdGhlIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzZXEgLSBJRCBvZiB0aGUgbWVzc2FnZSB0byB1cGRhdGVcbiAgICogQHBhcmFtIHtudW1iZXJ9IHN0YXR1cyAtIG5ldyBkZWxpdmVyeSBzdGF0dXMgb2YgdGhlIG1lc3NhZ2UuXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IHByb21pc2UgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gb3BlcmF0aW9uIGNvbXBsZXRpb24uXG4gICAqL1xuICB1cGRNZXNzYWdlU3RhdHVzKHRvcGljTmFtZSwgc2VxLCBzdGF0dXMpIHtcbiAgICBpZiAoIXRoaXMuaXNSZWFkeSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5kaXNhYmxlZCA/XG4gICAgICAgIFByb21pc2UucmVzb2x2ZSgpIDpcbiAgICAgICAgUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwibm90IGluaXRpYWxpemVkXCIpKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IHRyeCA9IHRoaXMuZGIudHJhbnNhY3Rpb24oWydtZXNzYWdlJ10sICdyZWFkd3JpdGUnKTtcbiAgICAgIHRyeC5vbnN1Y2Nlc3MgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgcmVzb2x2ZShldmVudC50YXJnZXQucmVzdWx0KTtcbiAgICAgIH07XG4gICAgICB0cngub25lcnJvciA9IChldmVudCkgPT4ge1xuICAgICAgICB0aGlzLiNsb2dnZXIoJ1BDYWNoZScsICd1cGRNZXNzYWdlU3RhdHVzJywgZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgICAgcmVqZWN0KGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICB9O1xuICAgICAgY29uc3QgcmVxID0gdHJ4Lm9iamVjdFN0b3JlKCdtZXNzYWdlJykuZ2V0KElEQktleVJhbmdlLm9ubHkoW3RvcGljTmFtZSwgc2VxXSkpO1xuICAgICAgcmVxLm9uc3VjY2VzcyA9IChldmVudCkgPT4ge1xuICAgICAgICBjb25zdCBzcmMgPSByZXEucmVzdWx0IHx8IGV2ZW50LnRhcmdldC5yZXN1bHQ7XG4gICAgICAgIGlmICghc3JjIHx8IHNyYy5fc3RhdHVzID09IHN0YXR1cykge1xuICAgICAgICAgIHRyeC5jb21taXQoKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdHJ4Lm9iamVjdFN0b3JlKCdtZXNzYWdlJykucHV0KERCLiNzZXJpYWxpemVNZXNzYWdlKHNyYywge1xuICAgICAgICAgIHRvcGljOiB0b3BpY05hbWUsXG4gICAgICAgICAgc2VxOiBzZXEsXG4gICAgICAgICAgX3N0YXR1czogc3RhdHVzXG4gICAgICAgIH0pKTtcbiAgICAgICAgdHJ4LmNvbW1pdCgpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgb25lIG9yIG1vcmUgbWVzc2FnZXMgZnJvbSBwZXJzaXN0ZW50IGNhY2hlLlxuICAgKiBAbWVtYmVyT2YgREJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljTmFtZSAtIG5hbWUgb2YgdGhlIHRvcGljIHdoaWNoIG93bnMgdGhlIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBmcm9tIC0gaWQgb2YgdGhlIG1lc3NhZ2UgdG8gcmVtb3ZlIG9yIGxvd2VyIGJvdW5kYXJ5IHdoZW4gcmVtb3ZpbmcgcmFuZ2UgKGluY2x1c2l2ZSkuXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gdG8gLSB1cHBlciBib3VuZGFyeSAoZXhjbHVzaXZlKSB3aGVuIHJlbW92aW5nIGEgcmFuZ2Ugb2YgbWVzc2FnZXMuXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IHByb21pc2UgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gb3BlcmF0aW9uIGNvbXBsZXRpb24uXG4gICAqL1xuICByZW1NZXNzYWdlcyh0b3BpY05hbWUsIGZyb20sIHRvKSB7XG4gICAgaWYgKCF0aGlzLmlzUmVhZHkoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZGlzYWJsZWQgP1xuICAgICAgICBQcm9taXNlLnJlc29sdmUoKSA6XG4gICAgICAgIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIm5vdCBpbml0aWFsaXplZFwiKSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBpZiAoIWZyb20gJiYgIXRvKSB7XG4gICAgICAgIGZyb20gPSAwO1xuICAgICAgICB0byA9IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSO1xuICAgICAgfVxuICAgICAgY29uc3QgcmFuZ2UgPSB0byA+IDAgPyBJREJLZXlSYW5nZS5ib3VuZChbdG9waWNOYW1lLCBmcm9tXSwgW3RvcGljTmFtZSwgdG9dLCBmYWxzZSwgdHJ1ZSkgOlxuICAgICAgICBJREJLZXlSYW5nZS5vbmx5KFt0b3BpY05hbWUsIGZyb21dKTtcbiAgICAgIGNvbnN0IHRyeCA9IHRoaXMuZGIudHJhbnNhY3Rpb24oWydtZXNzYWdlJ10sICdyZWFkd3JpdGUnKTtcbiAgICAgIHRyeC5vbnN1Y2Nlc3MgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgcmVzb2x2ZShldmVudC50YXJnZXQucmVzdWx0KTtcbiAgICAgIH07XG4gICAgICB0cngub25lcnJvciA9IChldmVudCkgPT4ge1xuICAgICAgICB0aGlzLiNsb2dnZXIoJ1BDYWNoZScsICdyZW1NZXNzYWdlcycsIGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICAgIHJlamVjdChldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgfTtcbiAgICAgIHRyeC5vYmplY3RTdG9yZSgnbWVzc2FnZScpLmRlbGV0ZShyYW5nZSk7XG4gICAgICB0cnguY29tbWl0KCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmUgbWVzc2FnZXMgZnJvbSBwZXJzaXN0ZW50IHN0b3JlLlxuICAgKiBAbWVtYmVyT2YgREJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljTmFtZSAtIG5hbWUgb2YgdGhlIHRvcGljIHRvIHJldHJpZXZlIG1lc3NhZ2VzIGZyb20uXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIHRvIGNhbGwgZm9yIGVhY2ggcmV0cmlldmVkIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBxdWVyeSAtIHBhcmFtZXRlcnMgb2YgdGhlIG1lc3NhZ2UgcmFuZ2UgdG8gcmV0cmlldmUuXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gcXVlcnkuc2luY2UgLSB0aGUgbGVhc3QgbWVzc2FnZSBJRCB0byByZXRyaWV2ZSAoaW5jbHVzaXZlKS5cbiAgICogQHBhcmFtIHtudW1iZXI9fSBxdWVyeS5iZWZvcmUgLSB0aGUgZ3JlYXRlc3QgbWVzc2FnZSBJRCB0byByZXRyaWV2ZSAoZXhjbHVzaXZlKS5cbiAgICogQHBhcmFtIHtudW1iZXI9fSBxdWVyeS5saW1pdCAtIHRoZSBtYXhpbXVtIG51bWJlciBvZiBtZXNzYWdlcyB0byByZXRyaWV2ZS5cbiAgICogQHJldHVybiB7UHJvbWlzZX0gcHJvbWlzZSByZXNvbHZlZC9yZWplY3RlZCBvbiBvcGVyYXRpb24gY29tcGxldGlvbi5cbiAgICovXG4gIHJlYWRNZXNzYWdlcyh0b3BpY05hbWUsIHF1ZXJ5LCBjYWxsYmFjaywgY29udGV4dCkge1xuICAgIGlmICghdGhpcy5pc1JlYWR5KCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmRpc2FibGVkID9cbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKFtdKSA6XG4gICAgICAgIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIm5vdCBpbml0aWFsaXplZFwiKSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBxdWVyeSA9IHF1ZXJ5IHx8IHt9O1xuICAgICAgY29uc3Qgc2luY2UgPSBxdWVyeS5zaW5jZSA+IDAgPyBxdWVyeS5zaW5jZSA6IDA7XG4gICAgICBjb25zdCBiZWZvcmUgPSBxdWVyeS5iZWZvcmUgPiAwID8gcXVlcnkuYmVmb3JlIDogTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XG4gICAgICBjb25zdCBsaW1pdCA9IHF1ZXJ5LmxpbWl0IHwgMDtcblxuICAgICAgY29uc3QgcmVzdWx0ID0gW107XG4gICAgICBjb25zdCByYW5nZSA9IElEQktleVJhbmdlLmJvdW5kKFt0b3BpY05hbWUsIHNpbmNlXSwgW3RvcGljTmFtZSwgYmVmb3JlXSwgZmFsc2UsIHRydWUpO1xuICAgICAgY29uc3QgdHJ4ID0gdGhpcy5kYi50cmFuc2FjdGlvbihbJ21lc3NhZ2UnXSk7XG4gICAgICB0cngub25lcnJvciA9IChldmVudCkgPT4ge1xuICAgICAgICB0aGlzLiNsb2dnZXIoJ1BDYWNoZScsICdyZWFkTWVzc2FnZXMnLCBldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgICByZWplY3QoZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgIH07XG4gICAgICAvLyBJdGVyYXRlIGluIGRlc2NlbmRpbmcgb3JkZXIuXG4gICAgICB0cngub2JqZWN0U3RvcmUoJ21lc3NhZ2UnKS5vcGVuQ3Vyc29yKHJhbmdlLCAncHJldicpLm9uc3VjY2VzcyA9IChldmVudCkgPT4ge1xuICAgICAgICBjb25zdCBjdXJzb3IgPSBldmVudC50YXJnZXQucmVzdWx0O1xuICAgICAgICBpZiAoY3Vyc29yKSB7XG4gICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBjYWxsYmFjay5jYWxsKGNvbnRleHQsIGN1cnNvci52YWx1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJlc3VsdC5wdXNoKGN1cnNvci52YWx1ZSk7XG4gICAgICAgICAgaWYgKGxpbWl0IDw9IDAgfHwgcmVzdWx0Lmxlbmd0aCA8IGxpbWl0KSB7XG4gICAgICAgICAgICBjdXJzb3IuY29udGludWUoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICAvLyBQcml2YXRlIG1ldGhvZHMuXG5cbiAgLy8gU2VyaWFsaXphYmxlIHRvcGljIGZpZWxkcy5cbiAgc3RhdGljICN0b3BpY19maWVsZHMgPSBbJ2NyZWF0ZWQnLCAndXBkYXRlZCcsICdkZWxldGVkJywgJ3JlYWQnLCAncmVjdicsICdzZXEnLCAnY2xlYXInLCAnZGVmYWNzJyxcbiAgICAnY3JlZHMnLCAncHVibGljJywgJ3RydXN0ZWQnLCAncHJpdmF0ZScsICd0b3VjaGVkJywgJ19kZWxldGVkJ1xuICBdO1xuXG4gIC8vIENvcHkgZGF0YSBmcm9tIHNyYyB0byBUb3BpYyBvYmplY3QuXG4gIHN0YXRpYyAjZGVzZXJpYWxpemVUb3BpYyh0b3BpYywgc3JjKSB7XG4gICAgREIuI3RvcGljX2ZpZWxkcy5mb3JFYWNoKChmKSA9PiB7XG4gICAgICBpZiAoc3JjLmhhc093blByb3BlcnR5KGYpKSB7XG4gICAgICAgIHRvcGljW2ZdID0gc3JjW2ZdO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChBcnJheS5pc0FycmF5KHNyYy50YWdzKSkge1xuICAgICAgdG9waWMuX3RhZ3MgPSBzcmMudGFncztcbiAgICB9XG4gICAgaWYgKHNyYy5hY3MpIHtcbiAgICAgIHRvcGljLnNldEFjY2Vzc01vZGUoc3JjLmFjcyk7XG4gICAgfVxuICAgIHRvcGljLnNlcSB8PSAwO1xuICAgIHRvcGljLnJlYWQgfD0gMDtcbiAgICB0b3BpYy51bnJlYWQgPSBNYXRoLm1heCgwLCB0b3BpYy5zZXEgLSB0b3BpYy5yZWFkKTtcbiAgfVxuXG4gIC8vIENvcHkgdmFsdWVzIGZyb20gJ3NyYycgdG8gJ2RzdCcuIEFsbG9jYXRlIGRzdCBpZiBpdCdzIG51bGwgb3IgdW5kZWZpbmVkLlxuICBzdGF0aWMgI3NlcmlhbGl6ZVRvcGljKGRzdCwgc3JjKSB7XG4gICAgY29uc3QgcmVzID0gZHN0IHx8IHtcbiAgICAgIG5hbWU6IHNyYy5uYW1lXG4gICAgfTtcbiAgICBEQi4jdG9waWNfZmllbGRzLmZvckVhY2goKGYpID0+IHtcbiAgICAgIGlmIChzcmMuaGFzT3duUHJvcGVydHkoZikpIHtcbiAgICAgICAgcmVzW2ZdID0gc3JjW2ZdO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChBcnJheS5pc0FycmF5KHNyYy5fdGFncykpIHtcbiAgICAgIHJlcy50YWdzID0gc3JjLl90YWdzO1xuICAgIH1cbiAgICBpZiAoc3JjLmFjcykge1xuICAgICAgcmVzLmFjcyA9IHNyYy5nZXRBY2Nlc3NNb2RlKCkuanNvbkhlbHBlcigpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzO1xuICB9XG5cbiAgc3RhdGljICNzZXJpYWxpemVTdWJzY3JpcHRpb24oZHN0LCB0b3BpY05hbWUsIHVpZCwgc3ViKSB7XG4gICAgY29uc3QgZmllbGRzID0gWyd1cGRhdGVkJywgJ21vZGUnLCAncmVhZCcsICdyZWN2JywgJ2NsZWFyJywgJ2xhc3RTZWVuJywgJ3VzZXJBZ2VudCddO1xuICAgIGNvbnN0IHJlcyA9IGRzdCB8fCB7XG4gICAgICB0b3BpYzogdG9waWNOYW1lLFxuICAgICAgdWlkOiB1aWRcbiAgICB9O1xuXG4gICAgZmllbGRzLmZvckVhY2goKGYpID0+IHtcbiAgICAgIGlmIChzdWIuaGFzT3duUHJvcGVydHkoZikpIHtcbiAgICAgICAgcmVzW2ZdID0gc3ViW2ZdO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlcztcbiAgfVxuXG4gIHN0YXRpYyAjc2VyaWFsaXplTWVzc2FnZShkc3QsIG1zZykge1xuICAgIC8vIFNlcmlhbGl6YWJsZSBmaWVsZHMuXG4gICAgY29uc3QgZmllbGRzID0gWyd0b3BpYycsICdzZXEnLCAndHMnLCAnX3N0YXR1cycsICdmcm9tJywgJ2hlYWQnLCAnY29udGVudCddO1xuICAgIGNvbnN0IHJlcyA9IGRzdCB8fCB7fTtcbiAgICBmaWVsZHMuZm9yRWFjaCgoZikgPT4ge1xuICAgICAgaWYgKG1zZy5oYXNPd25Qcm9wZXJ0eShmKSkge1xuICAgICAgICByZXNbZl0gPSBtc2dbZl07XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlcztcbiAgfVxuXG4gIC8qKlxuICAgKiBUbyB1c2UgREIgaW4gYSBub24gYnJvd3NlciBjb250ZXh0LCBzdXBwbHkgaW5kZXhlZERCIHByb3ZpZGVyLlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJvZiBEQlxuICAgKiBAcGFyYW0gaWRiUHJvdmlkZXIgaW5kZXhlZERCIHByb3ZpZGVyLCBlLmcuIGZvciBub2RlIDxjb2RlPnJlcXVpcmUoJ2Zha2UtaW5kZXhlZGRiJyk8L2NvZGU+LlxuICAgKi9cbiAgc3RhdGljIHNldERhdGFiYXNlUHJvdmlkZXIoaWRiUHJvdmlkZXIpIHtcbiAgICBJREJQcm92aWRlciA9IGlkYlByb3ZpZGVyO1xuICB9XG59XG4iLCIvKipcbiAqIEBjb3B5cmlnaHQgMjAxNS0yMDIyIFRpbm9kZSBMTEMuXG4gKiBAc3VtbWFyeSBNaW5pbWFsbHkgcmljaCB0ZXh0IHJlcHJlc2VudGF0aW9uIGFuZCBmb3JtYXR0aW5nIGZvciBUaW5vZGUuXG4gKiBAbGljZW5zZSBBcGFjaGUgMi4wXG4gKlxuICogQGZpbGUgQmFzaWMgcGFyc2VyIGFuZCBmb3JtYXR0ZXIgZm9yIHZlcnkgc2ltcGxlIHRleHQgbWFya3VwLiBNb3N0bHkgdGFyZ2V0ZWQgYXRcbiAqIG1vYmlsZSB1c2UgY2FzZXMgc2ltaWxhciB0byBUZWxlZ3JhbSwgV2hhdHNBcHAsIGFuZCBGQiBNZXNzZW5nZXIuXG4gKlxuICogPHA+U3VwcG9ydHMgY29udmVyc2lvbiBvZiB1c2VyIGtleWJvYXJkIGlucHV0IHRvIGZvcm1hdHRlZCB0ZXh0OjwvcD5cbiAqIDx1bD5cbiAqICAgPGxpPiphYmMqICZyYXJyOyA8Yj5hYmM8L2I+PC9saT5cbiAqICAgPGxpPl9hYmNfICZyYXJyOyA8aT5hYmM8L2k+PC9saT5cbiAqICAgPGxpPn5hYmN+ICZyYXJyOyA8ZGVsPmFiYzwvZGVsPjwvbGk+XG4gKiAgIDxsaT5gYWJjYCAmcmFycjsgPHR0PmFiYzwvdHQ+PC9saT5cbiAqIDwvdWw+XG4gKiBBbHNvIHN1cHBvcnRzIGZvcm1zIGFuZCBidXR0b25zLlxuICpcbiAqIE5lc3RlZCBmb3JtYXR0aW5nIGlzIHN1cHBvcnRlZCwgZS5nLiAqYWJjIF9kZWZfKiAtPiA8Yj5hYmMgPGk+ZGVmPC9pPjwvYj5cbiAqIFVSTHMsIEBtZW50aW9ucywgYW5kICNoYXNodGFncyBhcmUgZXh0cmFjdGVkIGFuZCBjb252ZXJ0ZWQgaW50byBsaW5rcy5cbiAqIEZvcm1zIGFuZCBidXR0b25zIGNhbiBiZSBhZGRlZCBwcm9jZWR1cmFsbHkuXG4gKiBKU09OIGRhdGEgcmVwcmVzZW50YXRpb24gaXMgaW5zcGlyZWQgYnkgRHJhZnQuanMgcmF3IGZvcm1hdHRpbmcuXG4gKlxuICpcbiAqIEBleGFtcGxlXG4gKiBUZXh0OlxuICogPHByZT5cbiAqICAgICB0aGlzIGlzICpib2xkKiwgYGNvZGVgIGFuZCBfaXRhbGljXywgfnN0cmlrZX5cbiAqICAgICBjb21iaW5lZCAqYm9sZCBhbmQgX2l0YWxpY18qXG4gKiAgICAgYW4gdXJsOiBodHRwczovL3d3dy5leGFtcGxlLmNvbS9hYmMjZnJhZ21lbnQgYW5kIGFub3RoZXIgX3d3dy50aW5vZGUuY29fXG4gKiAgICAgdGhpcyBpcyBhIEBtZW50aW9uIGFuZCBhICNoYXNodGFnIGluIGEgc3RyaW5nXG4gKiAgICAgc2Vjb25kICNoYXNodGFnXG4gKiA8L3ByZT5cbiAqXG4gKiAgU2FtcGxlIEpTT04gcmVwcmVzZW50YXRpb24gb2YgdGhlIHRleHQgYWJvdmU6XG4gKiAge1xuICogICAgIFwidHh0XCI6IFwidGhpcyBpcyBib2xkLCBjb2RlIGFuZCBpdGFsaWMsIHN0cmlrZSBjb21iaW5lZCBib2xkIGFuZCBpdGFsaWMgYW4gdXJsOiBodHRwczovL3d3dy5leGFtcGxlLmNvbS9hYmMjZnJhZ21lbnQgXCIgK1xuICogICAgICAgICAgICAgXCJhbmQgYW5vdGhlciB3d3cudGlub2RlLmNvIHRoaXMgaXMgYSBAbWVudGlvbiBhbmQgYSAjaGFzaHRhZyBpbiBhIHN0cmluZyBzZWNvbmQgI2hhc2h0YWdcIixcbiAqICAgICBcImZtdFwiOiBbXG4gKiAgICAgICAgIHsgXCJhdFwiOjgsIFwibGVuXCI6NCxcInRwXCI6XCJTVFwiIH0seyBcImF0XCI6MTQsIFwibGVuXCI6NCwgXCJ0cFwiOlwiQ09cIiB9LHsgXCJhdFwiOjIzLCBcImxlblwiOjYsIFwidHBcIjpcIkVNXCJ9LFxuICogICAgICAgICB7IFwiYXRcIjozMSwgXCJsZW5cIjo2LCBcInRwXCI6XCJETFwiIH0seyBcInRwXCI6XCJCUlwiLCBcImxlblwiOjEsIFwiYXRcIjozNyB9LHsgXCJhdFwiOjU2LCBcImxlblwiOjYsIFwidHBcIjpcIkVNXCIgfSxcbiAqICAgICAgICAgeyBcImF0XCI6NDcsIFwibGVuXCI6MTUsIFwidHBcIjpcIlNUXCIgfSx7IFwidHBcIjpcIkJSXCIsIFwibGVuXCI6MSwgXCJhdFwiOjYyIH0seyBcImF0XCI6MTIwLCBcImxlblwiOjEzLCBcInRwXCI6XCJFTVwiIH0sXG4gKiAgICAgICAgIHsgXCJhdFwiOjcxLCBcImxlblwiOjM2LCBcImtleVwiOjAgfSx7IFwiYXRcIjoxMjAsIFwibGVuXCI6MTMsIFwia2V5XCI6MSB9LHsgXCJ0cFwiOlwiQlJcIiwgXCJsZW5cIjoxLCBcImF0XCI6MTMzIH0sXG4gKiAgICAgICAgIHsgXCJhdFwiOjE0NCwgXCJsZW5cIjo4LCBcImtleVwiOjIgfSx7IFwiYXRcIjoxNTksIFwibGVuXCI6OCwgXCJrZXlcIjozIH0seyBcInRwXCI6XCJCUlwiLCBcImxlblwiOjEsIFwiYXRcIjoxNzkgfSxcbiAqICAgICAgICAgeyBcImF0XCI6MTg3LCBcImxlblwiOjgsIFwia2V5XCI6MyB9LHsgXCJ0cFwiOlwiQlJcIiwgXCJsZW5cIjoxLCBcImF0XCI6MTk1IH1cbiAqICAgICBdLFxuICogICAgIFwiZW50XCI6IFtcbiAqICAgICAgICAgeyBcInRwXCI6XCJMTlwiLCBcImRhdGFcIjp7IFwidXJsXCI6XCJodHRwczovL3d3dy5leGFtcGxlLmNvbS9hYmMjZnJhZ21lbnRcIiB9IH0sXG4gKiAgICAgICAgIHsgXCJ0cFwiOlwiTE5cIiwgXCJkYXRhXCI6eyBcInVybFwiOlwiaHR0cDovL3d3dy50aW5vZGUuY29cIiB9IH0sXG4gKiAgICAgICAgIHsgXCJ0cFwiOlwiTU5cIiwgXCJkYXRhXCI6eyBcInZhbFwiOlwibWVudGlvblwiIH0gfSxcbiAqICAgICAgICAgeyBcInRwXCI6XCJIVFwiLCBcImRhdGFcIjp7IFwidmFsXCI6XCJoYXNodGFnXCIgfSB9XG4gKiAgICAgXVxuICogIH1cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8vIE5PVEUgVE8gREVWRUxPUEVSUzpcbi8vIExvY2FsaXphYmxlIHN0cmluZ3Mgc2hvdWxkIGJlIGRvdWJsZSBxdW90ZWQgXCLRgdGC0YDQvtC60LAg0L3QsCDQtNGA0YPQs9C+0Lwg0Y/Qt9GL0LrQtVwiLFxuLy8gbm9uLWxvY2FsaXphYmxlIHN0cmluZ3Mgc2hvdWxkIGJlIHNpbmdsZSBxdW90ZWQgJ25vbi1sb2NhbGl6ZWQnLlxuXG5jb25zdCBNQVhfRk9STV9FTEVNRU5UUyA9IDg7XG5jb25zdCBNQVhfUFJFVklFV19BVFRBQ0hNRU5UUyA9IDM7XG5jb25zdCBNQVhfUFJFVklFV19EQVRBX1NJWkUgPSA2NDtcbmNvbnN0IEpTT05fTUlNRV9UWVBFID0gJ2FwcGxpY2F0aW9uL2pzb24nO1xuY29uc3QgRFJBRlRZX01JTUVfVFlQRSA9ICd0ZXh0L3gtZHJhZnR5JztcbmNvbnN0IEFMTE9XRURfRU5UX0ZJRUxEUyA9IFsnYWN0JywgJ2hlaWdodCcsICdkdXJhdGlvbicsICdpbmNvbWluZycsICdtaW1lJywgJ25hbWUnLCAncHJldmlldycsXG4gICdyZWYnLCAnc2l6ZScsICdzdGF0ZScsICd1cmwnLCAndmFsJywgJ3dpZHRoJ1xuXTtcblxuLy8gUmVndWxhciBleHByZXNzaW9ucyBmb3IgcGFyc2luZyBpbmxpbmUgZm9ybWF0cy4gSmF2YXNjcmlwdCBkb2VzIG5vdCBzdXBwb3J0IGxvb2tiZWhpbmQsXG4vLyBzbyBpdCdzIGEgYml0IG1lc3N5LlxuY29uc3QgSU5MSU5FX1NUWUxFUyA9IFtcbiAgLy8gU3Ryb25nID0gYm9sZCwgKmJvbGQgdGV4dCpcbiAge1xuICAgIG5hbWU6ICdTVCcsXG4gICAgc3RhcnQ6IC8oPzpefFtcXFdfXSkoXFwqKVteXFxzKl0vLFxuICAgIGVuZDogL1teXFxzKl0oXFwqKSg/PSR8W1xcV19dKS9cbiAgfSxcbiAgLy8gRW1waGVzaXplZCA9IGl0YWxpYywgX2l0YWxpYyB0ZXh0X1xuICB7XG4gICAgbmFtZTogJ0VNJyxcbiAgICBzdGFydDogLyg/Ol58XFxXKShfKVteXFxzX10vLFxuICAgIGVuZDogL1teXFxzX10oXykoPz0kfFxcVykvXG4gIH0sXG4gIC8vIERlbGV0ZWQsIH5zdHJpa2UgdGhpcyB0aG91Z2h+XG4gIHtcbiAgICBuYW1lOiAnREwnLFxuICAgIHN0YXJ0OiAvKD86XnxbXFxXX10pKH4pW15cXHN+XS8sXG4gICAgZW5kOiAvW15cXHN+XSh+KSg/PSR8W1xcV19dKS9cbiAgfSxcbiAgLy8gQ29kZSBibG9jayBgdGhpcyBpcyBtb25vc3BhY2VgXG4gIHtcbiAgICBuYW1lOiAnQ08nLFxuICAgIHN0YXJ0OiAvKD86XnxcXFcpKGApW15gXS8sXG4gICAgZW5kOiAvW15gXShgKSg/PSR8XFxXKS9cbiAgfVxuXTtcblxuLy8gUmVsYXRpdmUgd2VpZ2h0cyBvZiBmb3JtYXR0aW5nIHNwYW5zLiBHcmVhdGVyIGluZGV4IGluIGFycmF5IG1lYW5zIGdyZWF0ZXIgd2VpZ2h0LlxuY29uc3QgRk1UX1dFSUdIVCA9IFsnUVEnXTtcblxuLy8gUmVnRXhwcyBmb3IgZW50aXR5IGV4dHJhY3Rpb24gKFJGID0gcmVmZXJlbmNlKVxuY29uc3QgRU5USVRZX1RZUEVTID0gW1xuICAvLyBVUkxzXG4gIHtcbiAgICBuYW1lOiAnTE4nLFxuICAgIGRhdGFOYW1lOiAndXJsJyxcbiAgICBwYWNrOiBmdW5jdGlvbih2YWwpIHtcbiAgICAgIC8vIENoZWNrIGlmIHRoZSBwcm90b2NvbCBpcyBzcGVjaWZpZWQsIGlmIG5vdCB1c2UgaHR0cFxuICAgICAgaWYgKCEvXlthLXpdKzpcXC9cXC8vaS50ZXN0KHZhbCkpIHtcbiAgICAgICAgdmFsID0gJ2h0dHA6Ly8nICsgdmFsO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdXJsOiB2YWxcbiAgICAgIH07XG4gICAgfSxcbiAgICByZTogLyg/Oig/Omh0dHBzP3xmdHApOlxcL1xcL3x3d3dcXC58ZnRwXFwuKVstQS1aMC05KyZAI1xcLyU9fl98JD8hOiwuXSpbQS1aMC05KyZAI1xcLyU9fl98JF0vaWdcbiAgfSxcbiAgLy8gTWVudGlvbnMgQHVzZXIgKG11c3QgYmUgMiBvciBtb3JlIGNoYXJhY3RlcnMpXG4gIHtcbiAgICBuYW1lOiAnTU4nLFxuICAgIGRhdGFOYW1lOiAndmFsJyxcbiAgICBwYWNrOiBmdW5jdGlvbih2YWwpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHZhbDogdmFsLnNsaWNlKDEpXG4gICAgICB9O1xuICAgIH0sXG4gICAgcmU6IC9cXEJAKFtcXHB7TH1cXHB7Tn1dWy5fXFxwe0x9XFxwe059XSpbXFxwe0x9XFxwe059XSkvdWdcbiAgfSxcbiAgLy8gSGFzaHRhZ3MgI2hhc2h0YWcsIGxpa2UgbWV0aW9uIDIgb3IgbW9yZSBjaGFyYWN0ZXJzLlxuICB7XG4gICAgbmFtZTogJ0hUJyxcbiAgICBkYXRhTmFtZTogJ3ZhbCcsXG4gICAgcGFjazogZnVuY3Rpb24odmFsKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB2YWw6IHZhbC5zbGljZSgxKVxuICAgICAgfTtcbiAgICB9LFxuICAgIHJlOiAvXFxCIyhbXFxwe0x9XFxwe059XVsuX1xccHtMfVxccHtOfV0qW1xccHtMfVxccHtOfV0pL3VnXG4gIH1cbl07XG5cbi8vIEhUTUwgdGFnIG5hbWUgc3VnZ2VzdGlvbnNcbmNvbnN0IEZPUk1BVF9UQUdTID0ge1xuICBBVToge1xuICAgIGh0bWxfdGFnOiAnYXVkaW8nLFxuICAgIG1kX3RhZzogdW5kZWZpbmVkLFxuICAgIGlzVm9pZDogZmFsc2VcbiAgfSxcbiAgQk46IHtcbiAgICBodG1sX3RhZzogJ2J1dHRvbicsXG4gICAgbWRfdGFnOiB1bmRlZmluZWQsXG4gICAgaXNWb2lkOiBmYWxzZVxuICB9LFxuICBCUjoge1xuICAgIGh0bWxfdGFnOiAnYnInLFxuICAgIG1kX3RhZzogJ1xcbicsXG4gICAgaXNWb2lkOiB0cnVlXG4gIH0sXG4gIENPOiB7XG4gICAgaHRtbF90YWc6ICd0dCcsXG4gICAgbWRfdGFnOiAnYCcsXG4gICAgaXNWb2lkOiBmYWxzZVxuICB9LFxuICBETDoge1xuICAgIGh0bWxfdGFnOiAnZGVsJyxcbiAgICBtZF90YWc6ICd+JyxcbiAgICBpc1ZvaWQ6IGZhbHNlXG4gIH0sXG4gIEVNOiB7XG4gICAgaHRtbF90YWc6ICdpJyxcbiAgICBtZF90YWc6ICdfJyxcbiAgICBpc1ZvaWQ6IGZhbHNlXG4gIH0sXG4gIEVYOiB7XG4gICAgaHRtbF90YWc6ICcnLFxuICAgIG1kX3RhZzogdW5kZWZpbmVkLFxuICAgIGlzVm9pZDogdHJ1ZVxuICB9LFxuICBGTToge1xuICAgIGh0bWxfdGFnOiAnZGl2JyxcbiAgICBtZF90YWc6IHVuZGVmaW5lZCxcbiAgICBpc1ZvaWQ6IGZhbHNlXG4gIH0sXG4gIEhEOiB7XG4gICAgaHRtbF90YWc6ICcnLFxuICAgIG1kX3RhZzogdW5kZWZpbmVkLFxuICAgIGlzVm9pZDogZmFsc2VcbiAgfSxcbiAgSEw6IHtcbiAgICBodG1sX3RhZzogJ3NwYW4nLFxuICAgIG1kX3RhZzogdW5kZWZpbmVkLFxuICAgIGlzVm9pZDogZmFsc2VcbiAgfSxcbiAgSFQ6IHtcbiAgICBodG1sX3RhZzogJ2EnLFxuICAgIG1kX3RhZzogdW5kZWZpbmVkLFxuICAgIGlzVm9pZDogZmFsc2VcbiAgfSxcbiAgSU06IHtcbiAgICBodG1sX3RhZzogJ2ltZycsXG4gICAgbWRfdGFnOiB1bmRlZmluZWQsXG4gICAgaXNWb2lkOiBmYWxzZVxuICB9LFxuICBMTjoge1xuICAgIGh0bWxfdGFnOiAnYScsXG4gICAgbWRfdGFnOiB1bmRlZmluZWQsXG4gICAgaXNWb2lkOiBmYWxzZVxuICB9LFxuICBNTjoge1xuICAgIGh0bWxfdGFnOiAnYScsXG4gICAgbWRfdGFnOiB1bmRlZmluZWQsXG4gICAgaXNWb2lkOiBmYWxzZVxuICB9LFxuICBSVzoge1xuICAgIGh0bWxfdGFnOiAnZGl2JyxcbiAgICBtZF90YWc6IHVuZGVmaW5lZCxcbiAgICBpc1ZvaWQ6IGZhbHNlLFxuICB9LFxuICBRUToge1xuICAgIGh0bWxfdGFnOiAnZGl2JyxcbiAgICBtZF90YWc6IHVuZGVmaW5lZCxcbiAgICBpc1ZvaWQ6IGZhbHNlXG4gIH0sXG4gIFNUOiB7XG4gICAgaHRtbF90YWc6ICdiJyxcbiAgICBtZF90YWc6ICcqJyxcbiAgICBpc1ZvaWQ6IGZhbHNlXG4gIH0sXG4gIFZDOiB7XG4gICAgaHRtbF90YWc6ICdkaXYnLFxuICAgIG1kX3RhZzogdW5kZWZpbmVkLFxuICAgIGlzVm9pZDogZmFsc2VcbiAgfSxcbn07XG5cbi8vIENvbnZlcnQgYmFzZTY0LWVuY29kZWQgc3RyaW5nIGludG8gQmxvYi5cbmZ1bmN0aW9uIGJhc2U2NHRvT2JqZWN0VXJsKGI2NCwgY29udGVudFR5cGUsIGxvZ2dlcikge1xuICBpZiAoIWI2NCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgdHJ5IHtcbiAgICBjb25zdCBiaW4gPSBhdG9iKGI2NCk7XG4gICAgY29uc3QgbGVuZ3RoID0gYmluLmxlbmd0aDtcbiAgICBjb25zdCBidWYgPSBuZXcgQXJyYXlCdWZmZXIobGVuZ3RoKTtcbiAgICBjb25zdCBhcnIgPSBuZXcgVWludDhBcnJheShidWYpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGFycltpXSA9IGJpbi5jaGFyQ29kZUF0KGkpO1xuICAgIH1cblxuICAgIHJldHVybiBVUkwuY3JlYXRlT2JqZWN0VVJMKG5ldyBCbG9iKFtidWZdLCB7XG4gICAgICB0eXBlOiBjb250ZW50VHlwZVxuICAgIH0pKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgaWYgKGxvZ2dlcikge1xuICAgICAgbG9nZ2VyKFwiRHJhZnR5OiBmYWlsZWQgdG8gY29udmVydCBvYmplY3QuXCIsIGVyci5tZXNzYWdlKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cblxuZnVuY3Rpb24gYmFzZTY0dG9EYXRhVXJsKGI2NCwgY29udGVudFR5cGUpIHtcbiAgaWYgKCFiNjQpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBjb250ZW50VHlwZSA9IGNvbnRlbnRUeXBlIHx8ICdpbWFnZS9qcGVnJztcbiAgcmV0dXJuICdkYXRhOicgKyBjb250ZW50VHlwZSArICc7YmFzZTY0LCcgKyBiNjQ7XG59XG5cbi8vIEhlbHBlcnMgZm9yIGNvbnZlcnRpbmcgRHJhZnR5IHRvIEhUTUwuXG5jb25zdCBERUNPUkFUT1JTID0ge1xuICAvLyBWaXNpYWwgc3R5bGVzXG4gIFNUOiB7XG4gICAgb3BlbjogXyA9PiAnPGI+JyxcbiAgICBjbG9zZTogXyA9PiAnPC9iPidcbiAgfSxcbiAgRU06IHtcbiAgICBvcGVuOiBfID0+ICc8aT4nLFxuICAgIGNsb3NlOiBfID0+ICc8L2k+J1xuICB9LFxuICBETDoge1xuICAgIG9wZW46IF8gPT4gJzxkZWw+JyxcbiAgICBjbG9zZTogXyA9PiAnPC9kZWw+J1xuICB9LFxuICBDTzoge1xuICAgIG9wZW46IF8gPT4gJzx0dD4nLFxuICAgIGNsb3NlOiBfID0+ICc8L3R0PidcbiAgfSxcbiAgLy8gTGluZSBicmVha1xuICBCUjoge1xuICAgIG9wZW46IF8gPT4gJzxici8+JyxcbiAgICBjbG9zZTogXyA9PiAnJ1xuICB9LFxuICAvLyBIaWRkZW4gZWxlbWVudFxuICBIRDoge1xuICAgIG9wZW46IF8gPT4gJycsXG4gICAgY2xvc2U6IF8gPT4gJydcbiAgfSxcbiAgLy8gSGlnaGxpZ2h0ZWQgZWxlbWVudC5cbiAgSEw6IHtcbiAgICBvcGVuOiBfID0+ICc8c3BhbiBzdHlsZT1cImNvbG9yOnRlYWxcIj4nLFxuICAgIGNsb3NlOiBfID0+ICc8L3NwYW4+J1xuICB9LFxuICAvLyBMaW5rIChVUkwpXG4gIExOOiB7XG4gICAgb3BlbjogKGRhdGEpID0+IHtcbiAgICAgIHJldHVybiAnPGEgaHJlZj1cIicgKyBkYXRhLnVybCArICdcIj4nO1xuICAgIH0sXG4gICAgY2xvc2U6IF8gPT4gJzwvYT4nLFxuICAgIHByb3BzOiAoZGF0YSkgPT4ge1xuICAgICAgcmV0dXJuIGRhdGEgPyB7XG4gICAgICAgIGhyZWY6IGRhdGEudXJsLFxuICAgICAgICB0YXJnZXQ6ICdfYmxhbmsnXG4gICAgICB9IDogbnVsbDtcbiAgICB9LFxuICB9LFxuICAvLyBNZW50aW9uXG4gIE1OOiB7XG4gICAgb3BlbjogKGRhdGEpID0+IHtcbiAgICAgIHJldHVybiAnPGEgaHJlZj1cIiMnICsgZGF0YS52YWwgKyAnXCI+JztcbiAgICB9LFxuICAgIGNsb3NlOiBfID0+ICc8L2E+JyxcbiAgICBwcm9wczogKGRhdGEpID0+IHtcbiAgICAgIHJldHVybiBkYXRhID8ge1xuICAgICAgICBpZDogZGF0YS52YWxcbiAgICAgIH0gOiBudWxsO1xuICAgIH0sXG4gIH0sXG4gIC8vIEhhc2h0YWdcbiAgSFQ6IHtcbiAgICBvcGVuOiAoZGF0YSkgPT4ge1xuICAgICAgcmV0dXJuICc8YSBocmVmPVwiIycgKyBkYXRhLnZhbCArICdcIj4nO1xuICAgIH0sXG4gICAgY2xvc2U6IF8gPT4gJzwvYT4nLFxuICAgIHByb3BzOiAoZGF0YSkgPT4ge1xuICAgICAgcmV0dXJuIGRhdGEgPyB7XG4gICAgICAgIGlkOiBkYXRhLnZhbFxuICAgICAgfSA6IG51bGw7XG4gICAgfSxcbiAgfSxcbiAgLy8gQnV0dG9uXG4gIEJOOiB7XG4gICAgb3BlbjogXyA9PiAnPGJ1dHRvbj4nLFxuICAgIGNsb3NlOiBfID0+ICc8L2J1dHRvbj4nLFxuICAgIHByb3BzOiAoZGF0YSkgPT4ge1xuICAgICAgcmV0dXJuIGRhdGEgPyB7XG4gICAgICAgICdkYXRhLWFjdCc6IGRhdGEuYWN0LFxuICAgICAgICAnZGF0YS12YWwnOiBkYXRhLnZhbCxcbiAgICAgICAgJ2RhdGEtbmFtZSc6IGRhdGEubmFtZSxcbiAgICAgICAgJ2RhdGEtcmVmJzogZGF0YS5yZWZcbiAgICAgIH0gOiBudWxsO1xuICAgIH0sXG4gIH0sXG4gIC8vIEF1ZGlvIHJlY29yZGluZ1xuICBBVToge1xuICAgIG9wZW46IChkYXRhKSA9PiB7XG4gICAgICBjb25zdCB1cmwgPSBkYXRhLnJlZiB8fCBiYXNlNjR0b09iamVjdFVybChkYXRhLnZhbCwgZGF0YS5taW1lLCBEcmFmdHkubG9nZ2VyKTtcbiAgICAgIHJldHVybiAnPGF1ZGlvIGNvbnRyb2xzIHNyYz1cIicgKyB1cmwgKyAnXCI+JztcbiAgICB9LFxuICAgIGNsb3NlOiBfID0+ICc8L2F1ZGlvPicsXG4gICAgcHJvcHM6IChkYXRhKSA9PiB7XG4gICAgICBpZiAoIWRhdGEpIHJldHVybiBudWxsO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLy8gRW1iZWRkZWQgZGF0YSBvciBleHRlcm5hbCBsaW5rLlxuICAgICAgICBzcmM6IGRhdGEucmVmIHx8IGJhc2U2NHRvT2JqZWN0VXJsKGRhdGEudmFsLCBkYXRhLm1pbWUsIERyYWZ0eS5sb2dnZXIpLFxuICAgICAgICAnZGF0YS1wcmVsb2FkJzogZGF0YS5yZWYgPyAnbWV0YWRhdGEnIDogJ2F1dG8nLFxuICAgICAgICAnZGF0YS1kdXJhdGlvbic6IGRhdGEuZHVyYXRpb24sXG4gICAgICAgICdkYXRhLW5hbWUnOiBkYXRhLm5hbWUsXG4gICAgICAgICdkYXRhLXNpemUnOiBkYXRhLnZhbCA/ICgoZGF0YS52YWwubGVuZ3RoICogMC43NSkgfCAwKSA6IChkYXRhLnNpemUgfCAwKSxcbiAgICAgICAgJ2RhdGEtbWltZSc6IGRhdGEubWltZSxcbiAgICAgIH07XG4gICAgfVxuICB9LFxuICAvLyBJbWFnZVxuICBJTToge1xuICAgIG9wZW46IChkYXRhKSA9PiB7XG4gICAgICAvLyBEb24ndCB1c2UgZGF0YS5yZWYgZm9yIHByZXZpZXc6IGl0J3MgYSBzZWN1cml0eSByaXNrLlxuICAgICAgY29uc3QgdG1wUHJldmlld1VybCA9IGJhc2U2NHRvRGF0YVVybChkYXRhLl90ZW1wUHJldmlldywgZGF0YS5taW1lKTtcbiAgICAgIGNvbnN0IHByZXZpZXdVcmwgPSBiYXNlNjR0b09iamVjdFVybChkYXRhLnZhbCwgZGF0YS5taW1lLCBEcmFmdHkubG9nZ2VyKTtcbiAgICAgIGNvbnN0IGRvd25sb2FkVXJsID0gZGF0YS5yZWYgfHwgcHJldmlld1VybDtcbiAgICAgIHJldHVybiAoZGF0YS5uYW1lID8gJzxhIGhyZWY9XCInICsgZG93bmxvYWRVcmwgKyAnXCIgZG93bmxvYWQ9XCInICsgZGF0YS5uYW1lICsgJ1wiPicgOiAnJykgK1xuICAgICAgICAnPGltZyBzcmM9XCInICsgKHRtcFByZXZpZXdVcmwgfHwgcHJldmlld1VybCkgKyAnXCInICtcbiAgICAgICAgKGRhdGEud2lkdGggPyAnIHdpZHRoPVwiJyArIGRhdGEud2lkdGggKyAnXCInIDogJycpICtcbiAgICAgICAgKGRhdGEuaGVpZ2h0ID8gJyBoZWlnaHQ9XCInICsgZGF0YS5oZWlnaHQgKyAnXCInIDogJycpICsgJyBib3JkZXI9XCIwXCIgLz4nO1xuICAgIH0sXG4gICAgY2xvc2U6IChkYXRhKSA9PiB7XG4gICAgICByZXR1cm4gKGRhdGEubmFtZSA/ICc8L2E+JyA6ICcnKTtcbiAgICB9LFxuICAgIHByb3BzOiAoZGF0YSkgPT4ge1xuICAgICAgaWYgKCFkYXRhKSByZXR1cm4gbnVsbDtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC8vIFRlbXBvcmFyeSBwcmV2aWV3LCBvciBwZXJtYW5lbnQgcHJldmlldywgb3IgZXh0ZXJuYWwgbGluay5cbiAgICAgICAgc3JjOiBiYXNlNjR0b0RhdGFVcmwoZGF0YS5fdGVtcFByZXZpZXcsIGRhdGEubWltZSkgfHxcbiAgICAgICAgICBkYXRhLnJlZiB8fCBiYXNlNjR0b09iamVjdFVybChkYXRhLnZhbCwgZGF0YS5taW1lLCBEcmFmdHkubG9nZ2VyKSxcbiAgICAgICAgdGl0bGU6IGRhdGEubmFtZSxcbiAgICAgICAgYWx0OiBkYXRhLm5hbWUsXG4gICAgICAgICdkYXRhLXdpZHRoJzogZGF0YS53aWR0aCxcbiAgICAgICAgJ2RhdGEtaGVpZ2h0JzogZGF0YS5oZWlnaHQsXG4gICAgICAgICdkYXRhLW5hbWUnOiBkYXRhLm5hbWUsXG4gICAgICAgICdkYXRhLXNpemUnOiBkYXRhLnZhbCA/ICgoZGF0YS52YWwubGVuZ3RoICogMC43NSkgfCAwKSA6IChkYXRhLnNpemUgfCAwKSxcbiAgICAgICAgJ2RhdGEtbWltZSc6IGRhdGEubWltZSxcbiAgICAgIH07XG4gICAgfSxcbiAgfSxcbiAgLy8gRm9ybSAtIHN0cnVjdHVyZWQgbGF5b3V0IG9mIGVsZW1lbnRzLlxuICBGTToge1xuICAgIG9wZW46IF8gPT4gJzxkaXY+JyxcbiAgICBjbG9zZTogXyA9PiAnPC9kaXY+J1xuICB9LFxuICAvLyBSb3c6IGxvZ2ljIGdyb3VwaW5nIG9mIGVsZW1lbnRzXG4gIFJXOiB7XG4gICAgb3BlbjogXyA9PiAnPGRpdj4nLFxuICAgIGNsb3NlOiBfID0+ICc8L2Rpdj4nXG4gIH0sXG4gIC8vIFF1b3RlZCBibG9jay5cbiAgUVE6IHtcbiAgICBvcGVuOiBfID0+ICc8ZGl2PicsXG4gICAgY2xvc2U6IF8gPT4gJzwvZGl2PicsXG4gICAgcHJvcHM6IChkYXRhKSA9PiB7XG4gICAgICByZXR1cm4gZGF0YSA/IHt9IDogbnVsbDtcbiAgICB9LFxuICB9LFxuICAvLyBWaWRlbyBjYWxsXG4gIFZDOiB7XG4gICAgb3BlbjogXyA9PiAnPGRpdj4nLFxuICAgIGNsb3NlOiBfID0+ICc8L2Rpdj4nLFxuICAgIHByb3BzOiBkYXRhID0+IHtcbiAgICAgIGlmICghZGF0YSkgcmV0dXJuIHt9O1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgJ2RhdGEtZHVyYXRpb24nOiBkYXRhLmR1cmF0aW9uLFxuICAgICAgICAnZGF0YS1zdGF0ZSc6IGRhdGEuc3RhdGUsXG4gICAgICB9O1xuICAgIH1cbiAgfSxcbn07XG5cbi8qKlxuICogVGhlIG1haW4gb2JqZWN0IHdoaWNoIHBlcmZvcm1zIGFsbCB0aGUgZm9ybWF0dGluZyBhY3Rpb25zLlxuICogQGNsYXNzIERyYWZ0eVxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmNvbnN0IERyYWZ0eSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnR4dCA9ICcnO1xuICB0aGlzLmZtdCA9IFtdO1xuICB0aGlzLmVudCA9IFtdO1xufVxuXG4vKipcbiAqIEluaXRpYWxpemUgRHJhZnR5IGRvY3VtZW50IHRvIGEgcGxhaW4gdGV4dCBzdHJpbmcuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHBsYWluVGV4dCAtIHN0cmluZyB0byB1c2UgYXMgRHJhZnR5IGNvbnRlbnQuXG4gKlxuICogQHJldHVybnMgbmV3IERyYWZ0eSBkb2N1bWVudCBvciBudWxsIGlzIHBsYWluVGV4dCBpcyBub3QgYSBzdHJpbmcgb3IgdW5kZWZpbmVkLlxuICovXG5EcmFmdHkuaW5pdCA9IGZ1bmN0aW9uKHBsYWluVGV4dCkge1xuICBpZiAodHlwZW9mIHBsYWluVGV4dCA9PSAndW5kZWZpbmVkJykge1xuICAgIHBsYWluVGV4dCA9ICcnO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBwbGFpblRleHQgIT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgdHh0OiBwbGFpblRleHRcbiAgfTtcbn1cblxuLyoqXG4gKiBQYXJzZSBwbGFpbiB0ZXh0IGludG8gRHJhZnR5IGRvY3VtZW50LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBjb250ZW50IC0gcGxhaW4tdGV4dCBjb250ZW50IHRvIHBhcnNlLlxuICogQHJldHVybiB7RHJhZnR5fSBwYXJzZWQgZG9jdW1lbnQgb3IgbnVsbCBpZiB0aGUgc291cmNlIGlzIG5vdCBwbGFpbiB0ZXh0LlxuICovXG5EcmFmdHkucGFyc2UgPSBmdW5jdGlvbihjb250ZW50KSB7XG4gIC8vIE1ha2Ugc3VyZSB3ZSBhcmUgcGFyc2luZyBzdHJpbmdzIG9ubHkuXG4gIGlmICh0eXBlb2YgY29udGVudCAhPSAnc3RyaW5nJykge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLy8gU3BsaXQgdGV4dCBpbnRvIGxpbmVzLiBJdCBtYWtlcyBmdXJ0aGVyIHByb2Nlc3NpbmcgZWFzaWVyLlxuICBjb25zdCBsaW5lcyA9IGNvbnRlbnQuc3BsaXQoL1xccj9cXG4vKTtcblxuICAvLyBIb2xkcyBlbnRpdGllcyByZWZlcmVuY2VkIGZyb20gdGV4dFxuICBjb25zdCBlbnRpdHlNYXAgPSBbXTtcbiAgY29uc3QgZW50aXR5SW5kZXggPSB7fTtcblxuICAvLyBQcm9jZXNzaW5nIGxpbmVzIG9uZSBieSBvbmUsIGhvbGQgaW50ZXJtZWRpYXRlIHJlc3VsdCBpbiBibHguXG4gIGNvbnN0IGJseCA9IFtdO1xuICBsaW5lcy5mb3JFYWNoKChsaW5lKSA9PiB7XG4gICAgbGV0IHNwYW5zID0gW107XG4gICAgbGV0IGVudGl0aWVzO1xuXG4gICAgLy8gRmluZCBmb3JtYXR0ZWQgc3BhbnMgaW4gdGhlIHN0cmluZy5cbiAgICAvLyBUcnkgdG8gbWF0Y2ggZWFjaCBzdHlsZS5cbiAgICBJTkxJTkVfU1RZTEVTLmZvckVhY2goKHRhZykgPT4ge1xuICAgICAgLy8gRWFjaCBzdHlsZSBjb3VsZCBiZSBtYXRjaGVkIG11bHRpcGxlIHRpbWVzLlxuICAgICAgc3BhbnMgPSBzcGFucy5jb25jYXQoc3Bhbm5pZnkobGluZSwgdGFnLnN0YXJ0LCB0YWcuZW5kLCB0YWcubmFtZSkpO1xuICAgIH0pO1xuXG4gICAgbGV0IGJsb2NrO1xuICAgIGlmIChzcGFucy5sZW5ndGggPT0gMCkge1xuICAgICAgYmxvY2sgPSB7XG4gICAgICAgIHR4dDogbGluZVxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gU29ydCBzcGFucyBieSBzdHlsZSBvY2N1cmVuY2UgZWFybHkgLT4gbGF0ZSwgdGhlbiBieSBsZW5ndGg6IGZpcnN0IGxvbmcgdGhlbiBzaG9ydC5cbiAgICAgIHNwYW5zLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgY29uc3QgZGlmZiA9IGEuYXQgLSBiLmF0O1xuICAgICAgICByZXR1cm4gZGlmZiAhPSAwID8gZGlmZiA6IGIuZW5kIC0gYS5lbmQ7XG4gICAgICB9KTtcblxuICAgICAgLy8gQ29udmVydCBhbiBhcnJheSBvZiBwb3NzaWJseSBvdmVybGFwcGluZyBzcGFucyBpbnRvIGEgdHJlZS5cbiAgICAgIHNwYW5zID0gdG9TcGFuVHJlZShzcGFucyk7XG5cbiAgICAgIC8vIEJ1aWxkIGEgdHJlZSByZXByZXNlbnRhdGlvbiBvZiB0aGUgZW50aXJlIHN0cmluZywgbm90XG4gICAgICAvLyBqdXN0IHRoZSBmb3JtYXR0ZWQgcGFydHMuXG4gICAgICBjb25zdCBjaHVua3MgPSBjaHVua2lmeShsaW5lLCAwLCBsaW5lLmxlbmd0aCwgc3BhbnMpO1xuXG4gICAgICBjb25zdCBkcmFmdHkgPSBkcmFmdGlmeShjaHVua3MsIDApO1xuXG4gICAgICBibG9jayA9IHtcbiAgICAgICAgdHh0OiBkcmFmdHkudHh0LFxuICAgICAgICBmbXQ6IGRyYWZ0eS5mbXRcbiAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gRXh0cmFjdCBlbnRpdGllcyBmcm9tIHRoZSBjbGVhbmVkIHVwIHN0cmluZy5cbiAgICBlbnRpdGllcyA9IGV4dHJhY3RFbnRpdGllcyhibG9jay50eHQpO1xuICAgIGlmIChlbnRpdGllcy5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCByYW5nZXMgPSBbXTtcbiAgICAgIGZvciAobGV0IGkgaW4gZW50aXRpZXMpIHtcbiAgICAgICAgLy8ge29mZnNldDogbWF0Y2hbJ2luZGV4J10sIHVuaXF1ZTogbWF0Y2hbMF0sIGxlbjogbWF0Y2hbMF0ubGVuZ3RoLCBkYXRhOiBlbnQucGFja2VyKCksIHR5cGU6IGVudC5uYW1lfVxuICAgICAgICBjb25zdCBlbnRpdHkgPSBlbnRpdGllc1tpXTtcbiAgICAgICAgbGV0IGluZGV4ID0gZW50aXR5SW5kZXhbZW50aXR5LnVuaXF1ZV07XG4gICAgICAgIGlmICghaW5kZXgpIHtcbiAgICAgICAgICBpbmRleCA9IGVudGl0eU1hcC5sZW5ndGg7XG4gICAgICAgICAgZW50aXR5SW5kZXhbZW50aXR5LnVuaXF1ZV0gPSBpbmRleDtcbiAgICAgICAgICBlbnRpdHlNYXAucHVzaCh7XG4gICAgICAgICAgICB0cDogZW50aXR5LnR5cGUsXG4gICAgICAgICAgICBkYXRhOiBlbnRpdHkuZGF0YVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJhbmdlcy5wdXNoKHtcbiAgICAgICAgICBhdDogZW50aXR5Lm9mZnNldCxcbiAgICAgICAgICBsZW46IGVudGl0eS5sZW4sXG4gICAgICAgICAga2V5OiBpbmRleFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGJsb2NrLmVudCA9IHJhbmdlcztcbiAgICB9XG5cbiAgICBibHgucHVzaChibG9jayk7XG4gIH0pO1xuXG4gIGNvbnN0IHJlc3VsdCA9IHtcbiAgICB0eHQ6ICcnXG4gIH07XG5cbiAgLy8gTWVyZ2UgbGluZXMgYW5kIHNhdmUgbGluZSBicmVha3MgYXMgQlIgaW5saW5lIGZvcm1hdHRpbmcuXG4gIGlmIChibHgubGVuZ3RoID4gMCkge1xuICAgIHJlc3VsdC50eHQgPSBibHhbMF0udHh0O1xuICAgIHJlc3VsdC5mbXQgPSAoYmx4WzBdLmZtdCB8fCBbXSkuY29uY2F0KGJseFswXS5lbnQgfHwgW10pO1xuXG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCBibHgubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGJsb2NrID0gYmx4W2ldO1xuICAgICAgY29uc3Qgb2Zmc2V0ID0gcmVzdWx0LnR4dC5sZW5ndGggKyAxO1xuXG4gICAgICByZXN1bHQuZm10LnB1c2goe1xuICAgICAgICB0cDogJ0JSJyxcbiAgICAgICAgbGVuOiAxLFxuICAgICAgICBhdDogb2Zmc2V0IC0gMVxuICAgICAgfSk7XG5cbiAgICAgIHJlc3VsdC50eHQgKz0gJyAnICsgYmxvY2sudHh0O1xuICAgICAgaWYgKGJsb2NrLmZtdCkge1xuICAgICAgICByZXN1bHQuZm10ID0gcmVzdWx0LmZtdC5jb25jYXQoYmxvY2suZm10Lm1hcCgocykgPT4ge1xuICAgICAgICAgIHMuYXQgKz0gb2Zmc2V0O1xuICAgICAgICAgIHJldHVybiBzO1xuICAgICAgICB9KSk7XG4gICAgICB9XG4gICAgICBpZiAoYmxvY2suZW50KSB7XG4gICAgICAgIHJlc3VsdC5mbXQgPSByZXN1bHQuZm10LmNvbmNhdChibG9jay5lbnQubWFwKChzKSA9PiB7XG4gICAgICAgICAgcy5hdCArPSBvZmZzZXQ7XG4gICAgICAgICAgcmV0dXJuIHM7XG4gICAgICAgIH0pKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocmVzdWx0LmZtdC5sZW5ndGggPT0gMCkge1xuICAgICAgZGVsZXRlIHJlc3VsdC5mbXQ7XG4gICAgfVxuXG4gICAgaWYgKGVudGl0eU1hcC5sZW5ndGggPiAwKSB7XG4gICAgICByZXN1bHQuZW50ID0gZW50aXR5TWFwO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEFwcGVuZCBvbmUgRHJhZnR5IGRvY3VtZW50IHRvIGFub3RoZXIuXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGZpcnN0IC0gRHJhZnR5IGRvY3VtZW50IHRvIGFwcGVuZCB0by5cbiAqIEBwYXJhbSB7RHJhZnR5fHN0cmluZ30gc2Vjb25kIC0gRHJhZnR5IGRvY3VtZW50IG9yIHN0cmluZyBiZWluZyBhcHBlbmRlZC5cbiAqXG4gKiBAcmV0dXJuIHtEcmFmdHl9IGZpcnN0IGRvY3VtZW50IHdpdGggdGhlIHNlY29uZCBhcHBlbmRlZCB0byBpdC5cbiAqL1xuRHJhZnR5LmFwcGVuZCA9IGZ1bmN0aW9uKGZpcnN0LCBzZWNvbmQpIHtcbiAgaWYgKCFmaXJzdCkge1xuICAgIHJldHVybiBzZWNvbmQ7XG4gIH1cbiAgaWYgKCFzZWNvbmQpIHtcbiAgICByZXR1cm4gZmlyc3Q7XG4gIH1cblxuICBmaXJzdC50eHQgPSBmaXJzdC50eHQgfHwgJyc7XG4gIGNvbnN0IGxlbiA9IGZpcnN0LnR4dC5sZW5ndGg7XG5cbiAgaWYgKHR5cGVvZiBzZWNvbmQgPT0gJ3N0cmluZycpIHtcbiAgICBmaXJzdC50eHQgKz0gc2Vjb25kO1xuICB9IGVsc2UgaWYgKHNlY29uZC50eHQpIHtcbiAgICBmaXJzdC50eHQgKz0gc2Vjb25kLnR4dDtcbiAgfVxuXG4gIGlmIChBcnJheS5pc0FycmF5KHNlY29uZC5mbXQpKSB7XG4gICAgZmlyc3QuZm10ID0gZmlyc3QuZm10IHx8IFtdO1xuICAgIGlmIChBcnJheS5pc0FycmF5KHNlY29uZC5lbnQpKSB7XG4gICAgICBmaXJzdC5lbnQgPSBmaXJzdC5lbnQgfHwgW107XG4gICAgfVxuICAgIHNlY29uZC5mbXQuZm9yRWFjaChzcmMgPT4ge1xuICAgICAgY29uc3QgZm10ID0ge1xuICAgICAgICBhdDogKHNyYy5hdCB8IDApICsgbGVuLFxuICAgICAgICBsZW46IHNyYy5sZW4gfCAwXG4gICAgICB9O1xuICAgICAgLy8gU3BlY2lhbCBjYXNlIGZvciB0aGUgb3V0c2lkZSBvZiB0aGUgbm9ybWFsIHJlbmRlcmluZyBmbG93IHN0eWxlcy5cbiAgICAgIGlmIChzcmMuYXQgPT0gLTEpIHtcbiAgICAgICAgZm10LmF0ID0gLTE7XG4gICAgICAgIGZtdC5sZW4gPSAwO1xuICAgICAgfVxuICAgICAgaWYgKHNyYy50cCkge1xuICAgICAgICBmbXQudHAgPSBzcmMudHA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmbXQua2V5ID0gZmlyc3QuZW50Lmxlbmd0aDtcbiAgICAgICAgZmlyc3QuZW50LnB1c2goc2Vjb25kLmVudFtzcmMua2V5IHx8IDBdKTtcbiAgICAgIH1cbiAgICAgIGZpcnN0LmZtdC5wdXNoKGZtdCk7XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gZmlyc3Q7XG59XG5cbi8qKlxuICogQHR5cGVkZWYgRHJhZnR5LkltYWdlRGVzY1xuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHR5cGUgT2JqZWN0XG4gKiBAcGFyYW0ge3N0cmluZ30gbWltZSAtIG1pbWUtdHlwZSBvZiB0aGUgaW1hZ2UsIGUuZy4gXCJpbWFnZS9wbmdcIlxuICogQHBhcmFtIHtzdHJpbmd9IHByZXZpZXcgLSBiYXNlNjQtZW5jb2RlZCBpbWFnZSBjb250ZW50IChvciBwcmV2aWV3LCBpZiBsYXJnZSBpbWFnZSBpcyBhdHRhY2hlZCkuIENvdWxkIGJlIG51bGwvdW5kZWZpbmVkLlxuICogQHBhcmFtIHtpbnRlZ2VyfSB3aWR0aCAtIHdpZHRoIG9mIHRoZSBpbWFnZVxuICogQHBhcmFtIHtpbnRlZ2VyfSBoZWlnaHQgLSBoZWlnaHQgb2YgdGhlIGltYWdlXG4gKiBAcGFyYW0ge3N0cmluZ30gZmlsZW5hbWUgLSBmaWxlIG5hbWUgc3VnZ2VzdGlvbiBmb3IgZG93bmxvYWRpbmcgdGhlIGltYWdlLlxuICogQHBhcmFtIHtpbnRlZ2VyfSBzaXplIC0gc2l6ZSBvZiB0aGUgaW1hZ2UgaW4gYnl0ZXMuIFRyZWF0IGlzIGFzIGFuIHVudHJ1c3RlZCBoaW50LlxuICogQHBhcmFtIHtzdHJpbmd9IHJlZnVybCAtIHJlZmVyZW5jZSB0byB0aGUgY29udGVudC4gQ291bGQgYmUgbnVsbC91bmRlZmluZWQuXG4gKiBAcGFyYW0ge3N0cmluZ30gX3RlbXBQcmV2aWV3IC0gYmFzZTY0LWVuY29kZWQgaW1hZ2UgcHJldmlldyB1c2VkIGR1cmluZyB1cGxvYWQgcHJvY2Vzczsgbm90IHNlcmlhbGl6YWJsZS5cbiAqIEBwYXJhbSB7UHJvbWlzZX0gdXJsUHJvbWlzZSAtIFByb21pc2Ugd2hpY2ggcmV0dXJucyBjb250ZW50IFVSTCB3aGVuIHJlc29sdmVkLlxuICovXG5cbi8qKlxuICogSW5zZXJ0IGlubGluZSBpbWFnZSBpbnRvIERyYWZ0eSBkb2N1bWVudC5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eX0gY29udGVudCAtIGRvY3VtZW50IHRvIGFkZCBpbWFnZSB0by5cbiAqIEBwYXJhbSB7aW50ZWdlcn0gYXQgLSBpbmRleCB3aGVyZSB0aGUgb2JqZWN0IGlzIGluc2VydGVkLiBUaGUgbGVuZ3RoIG9mIHRoZSBpbWFnZSBpcyBhbHdheXMgMS5cbiAqIEBwYXJhbSB7SW1hZ2VEZXNjfSBpbWFnZURlc2MgLSBvYmplY3Qgd2l0aCBpbWFnZSBwYXJhbWVuZXRzIGFuZCBkYXRhLlxuICpcbiAqIEByZXR1cm4ge0RyYWZ0eX0gdXBkYXRlZCBkb2N1bWVudC5cbiAqL1xuRHJhZnR5Lmluc2VydEltYWdlID0gZnVuY3Rpb24oY29udGVudCwgYXQsIGltYWdlRGVzYykge1xuICBjb250ZW50ID0gY29udGVudCB8fCB7XG4gICAgdHh0OiAnICdcbiAgfTtcbiAgY29udGVudC5lbnQgPSBjb250ZW50LmVudCB8fCBbXTtcbiAgY29udGVudC5mbXQgPSBjb250ZW50LmZtdCB8fCBbXTtcblxuICBjb250ZW50LmZtdC5wdXNoKHtcbiAgICBhdDogYXQgfCAwLFxuICAgIGxlbjogMSxcbiAgICBrZXk6IGNvbnRlbnQuZW50Lmxlbmd0aFxuICB9KTtcblxuICBjb25zdCBleCA9IHtcbiAgICB0cDogJ0lNJyxcbiAgICBkYXRhOiB7XG4gICAgICBtaW1lOiBpbWFnZURlc2MubWltZSxcbiAgICAgIHZhbDogaW1hZ2VEZXNjLnByZXZpZXcsXG4gICAgICB3aWR0aDogaW1hZ2VEZXNjLndpZHRoLFxuICAgICAgaGVpZ2h0OiBpbWFnZURlc2MuaGVpZ2h0LFxuICAgICAgbmFtZTogaW1hZ2VEZXNjLmZpbGVuYW1lLFxuICAgICAgc2l6ZTogaW1hZ2VEZXNjLnNpemUgfCAwLFxuICAgICAgcmVmOiBpbWFnZURlc2MucmVmdXJsXG4gICAgfVxuICB9O1xuXG4gIGlmIChpbWFnZURlc2MudXJsUHJvbWlzZSkge1xuICAgIGV4LmRhdGEuX3RlbXBQcmV2aWV3ID0gaW1hZ2VEZXNjLl90ZW1wUHJldmlldztcbiAgICBleC5kYXRhLl9wcm9jZXNzaW5nID0gdHJ1ZTtcbiAgICBpbWFnZURlc2MudXJsUHJvbWlzZS50aGVuKFxuICAgICAgdXJsID0+IHtcbiAgICAgICAgZXguZGF0YS5yZWYgPSB1cmw7XG4gICAgICAgIGV4LmRhdGEuX3RlbXBQcmV2aWV3ID0gdW5kZWZpbmVkO1xuICAgICAgICBleC5kYXRhLl9wcm9jZXNzaW5nID0gdW5kZWZpbmVkO1xuICAgICAgfSxcbiAgICAgIF8gPT4ge1xuICAgICAgICAvLyBDYXRjaCB0aGUgZXJyb3IsIG90aGVyd2lzZSBpdCB3aWxsIGFwcGVhciBpbiB0aGUgY29uc29sZS5cbiAgICAgICAgZXguZGF0YS5fcHJvY2Vzc2luZyA9IHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICApO1xuICB9XG5cbiAgY29udGVudC5lbnQucHVzaChleCk7XG5cbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cbi8qKlxuICogQHR5cGVkZWYgRHJhZnR5LkF1ZGlvRGVzY1xuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHR5cGUgT2JqZWN0XG4gKiBAcGFyYW0ge3N0cmluZ30gbWltZSAtIG1pbWUtdHlwZSBvZiB0aGUgYXVkaW8sIGUuZy4gXCJhdWRpby9vZ2dcIi5cbiAqIEBwYXJhbSB7c3RyaW5nfSBkYXRhIC0gYmFzZTY0LWVuY29kZWQgYXVkaW8gY29udGVudC4gQ291bGQgYmUgbnVsbC91bmRlZmluZWQuXG4gKiBAcGFyYW0ge2ludGVnZXJ9IGR1cmF0aW9uIC0gZHVyYXRpb24gb2YgdGhlIHJlY29yZCBpbiBtaWxsaXNlY29uZHMuXG4gKiBAcGFyYW0ge3N0cmluZ30gcHJldmlldyAtIGJhc2U2NCBlbmNvZGVkIHNob3J0IGFycmF5IG9mIGFtcGxpdHVkZSB2YWx1ZXMgMC4uMTAwLlxuICogQHBhcmFtIHtzdHJpbmd9IGZpbGVuYW1lIC0gZmlsZSBuYW1lIHN1Z2dlc3Rpb24gZm9yIGRvd25sb2FkaW5nIHRoZSBhdWRpby5cbiAqIEBwYXJhbSB7aW50ZWdlcn0gc2l6ZSAtIHNpemUgb2YgdGhlIHJlY29yZGluZyBpbiBieXRlcy4gVHJlYXQgaXMgYXMgYW4gdW50cnVzdGVkIGhpbnQuXG4gKiBAcGFyYW0ge3N0cmluZ30gcmVmdXJsIC0gcmVmZXJlbmNlIHRvIHRoZSBjb250ZW50LiBDb3VsZCBiZSBudWxsL3VuZGVmaW5lZC5cbiAqIEBwYXJhbSB7UHJvbWlzZX0gdXJsUHJvbWlzZSAtIFByb21pc2Ugd2hpY2ggcmV0dXJucyBjb250ZW50IFVSTCB3aGVuIHJlc29sdmVkLlxuICovXG5cbi8qKlxuICogSW5zZXJ0IGF1ZGlvIHJlY29yZGluZyBpbnRvIERyYWZ0eSBkb2N1bWVudC5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eX0gY29udGVudCAtIGRvY3VtZW50IHRvIGFkZCBhdWRpbyByZWNvcmQgdG8uXG4gKiBAcGFyYW0ge2ludGVnZXJ9IGF0IC0gaW5kZXggd2hlcmUgdGhlIG9iamVjdCBpcyBpbnNlcnRlZC4gVGhlIGxlbmd0aCBvZiB0aGUgcmVjb3JkIGlzIGFsd2F5cyAxLlxuICogQHBhcmFtIHtBdWRpb0Rlc2N9IGF1ZGlvRGVzYyAtIG9iamVjdCB3aXRoIHRoZSBhdWRpbyBwYXJhbWVuZXRzIGFuZCBkYXRhLlxuICpcbiAqIEByZXR1cm4ge0RyYWZ0eX0gdXBkYXRlZCBkb2N1bWVudC5cbiAqL1xuRHJhZnR5Lmluc2VydEF1ZGlvID0gZnVuY3Rpb24oY29udGVudCwgYXQsIGF1ZGlvRGVzYykge1xuICBjb250ZW50ID0gY29udGVudCB8fCB7XG4gICAgdHh0OiAnICdcbiAgfTtcbiAgY29udGVudC5lbnQgPSBjb250ZW50LmVudCB8fCBbXTtcbiAgY29udGVudC5mbXQgPSBjb250ZW50LmZtdCB8fCBbXTtcblxuICBjb250ZW50LmZtdC5wdXNoKHtcbiAgICBhdDogYXQgfCAwLFxuICAgIGxlbjogMSxcbiAgICBrZXk6IGNvbnRlbnQuZW50Lmxlbmd0aFxuICB9KTtcblxuICBjb25zdCBleCA9IHtcbiAgICB0cDogJ0FVJyxcbiAgICBkYXRhOiB7XG4gICAgICBtaW1lOiBhdWRpb0Rlc2MubWltZSxcbiAgICAgIHZhbDogYXVkaW9EZXNjLmRhdGEsXG4gICAgICBkdXJhdGlvbjogYXVkaW9EZXNjLmR1cmF0aW9uIHwgMCxcbiAgICAgIHByZXZpZXc6IGF1ZGlvRGVzYy5wcmV2aWV3LFxuICAgICAgbmFtZTogYXVkaW9EZXNjLmZpbGVuYW1lLFxuICAgICAgc2l6ZTogYXVkaW9EZXNjLnNpemUgfCAwLFxuICAgICAgcmVmOiBhdWRpb0Rlc2MucmVmdXJsXG4gICAgfVxuICB9O1xuXG4gIGlmIChhdWRpb0Rlc2MudXJsUHJvbWlzZSkge1xuICAgIGV4LmRhdGEuX3Byb2Nlc3NpbmcgPSB0cnVlO1xuICAgIGF1ZGlvRGVzYy51cmxQcm9taXNlLnRoZW4oXG4gICAgICB1cmwgPT4ge1xuICAgICAgICBleC5kYXRhLnJlZiA9IHVybDtcbiAgICAgICAgZXguZGF0YS5fcHJvY2Vzc2luZyA9IHVuZGVmaW5lZDtcbiAgICAgIH0sXG4gICAgICBfID0+IHtcbiAgICAgICAgLy8gQ2F0Y2ggdGhlIGVycm9yLCBvdGhlcndpc2UgaXQgd2lsbCBhcHBlYXIgaW4gdGhlIGNvbnNvbGUuXG4gICAgICAgIGV4LmRhdGEuX3Byb2Nlc3NpbmcgPSB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgKTtcbiAgfVxuXG4gIGNvbnRlbnQuZW50LnB1c2goZXgpO1xuXG4gIHJldHVybiBjb250ZW50O1xufVxuXG4vKipcbiAqIENyZWF0ZSBhIChzZWxmLWNvbnRhaW5lZCkgdmlkZW8gY2FsbCBEcmFmdHkgZG9jdW1lbnQuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHJldHVybnMgVmlkZW8gQ2FsbCBkcmFmdHkgZG9jdW1lbnQuXG4gKi9cbkRyYWZ0eS52aWRlb0NhbGwgPSBmdW5jdGlvbigpIHtcbiAgY29uc3QgY29udGVudCA9IHtcbiAgICB0eHQ6ICcgJyxcbiAgICBmbXQ6IFt7XG4gICAgICBhdDogMCxcbiAgICAgIGxlbjogMSxcbiAgICAgIGtleTogMFxuICAgIH1dLFxuICAgIGVudDogW3tcbiAgICAgIHRwOiAnVkMnXG4gICAgfV1cbiAgfTtcbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cbi8qKlxuICogVXBkYXRlIHZpZGVvIGNhbGwgKFZDKSBlbnRpdHkgd2l0aCB0aGUgbmV3IHN0YXR1cyBhbmQgZHVyYXRpb24uXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGNvbnRlbnQgLSBWQyBkb2N1bWVudCB0byB1cGRhdGUuXG4gKiBAcGFyYW0ge29iamVjdH0gcGFyYW1zIC0gbmV3IHZpZGVvIGNhbGwgcGFyYW1ldGVycy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXJhbXMuc3RhdGUgLSBzdGF0ZSBvZiB2aWRlbyBjYWxsLlxuICogQHBhcmFtIHtudW1iZXJ9IHBhcmFtcy5kdXJhdGlvbiAtIGR1cmF0aW9uIG9mIHRoZSB2aWRlbyBjYWxsIGluIG1pbGxpc2Vjb25kcy5cbiAqXG4gKiBAcmV0dXJucyB0aGUgc2FtZSBkb2N1bWVudCB3aXRoIHVwZGF0ZSBhcHBsaWVkLlxuICovXG5EcmFmdHkudXBkYXRlVmlkZW9FbnQgPSBmdW5jdGlvbihjb250ZW50LCBwYXJhbXMpIHtcbiAgLy8gVGhlIHZpZGVvIGVsZW1lbnQgY291bGQgYmUganVzdCBhIGZvcm1hdCBvciBhIGZvcm1hdCArIGVudGl0eS5cbiAgLy8gTXVzdCBlbnN1cmUgaXQncyB0aGUgbGF0dGVyIGZpcnN0LlxuICBjb25zdCBmbXQgPSAoKGNvbnRlbnQgfHwge30pLmZtdCB8fCBbXSlbMF07XG4gIGlmICghZm10KSB7XG4gICAgLy8gVW5yZWNvZ25pemVkIGNvbnRlbnQuXG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH1cblxuICBsZXQgZW50O1xuICBpZiAoZm10LnRwID09ICdWQycpIHtcbiAgICAvLyBKdXN0IGEgZm9ybWF0LCBjb252ZXJ0IHRvIGZvcm1hdCArIGVudGl0eS5cbiAgICBkZWxldGUgZm10LnRwO1xuICAgIGZtdC5rZXkgPSAwO1xuICAgIGVudCA9IHtcbiAgICAgIHRwOiAnVkMnXG4gICAgfTtcbiAgICBjb250ZW50LmVudCA9IFtlbnRdO1xuICB9IGVsc2Uge1xuICAgIGVudCA9IChjb250ZW50LmVudCB8fCBbXSlbZm10LmtleSB8IDBdO1xuICAgIGlmICghZW50IHx8IGVudC50cCAhPSAnVkMnKSB7XG4gICAgICAvLyBOb3QgYSBWQyBlbnRpdHkuXG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9XG4gIH1cbiAgZW50LmRhdGEgPSBlbnQuZGF0YSB8fCB7fTtcbiAgT2JqZWN0LmFzc2lnbihlbnQuZGF0YSwgcGFyYW1zKTtcbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cbi8qKlxuICogQ3JlYXRlIGEgcXVvdGUgdG8gRHJhZnR5IGRvY3VtZW50LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBoZWFkZXIgLSBRdW90ZSBoZWFkZXIgKHRpdGxlLCBldGMuKS5cbiAqIEBwYXJhbSB7c3RyaW5nfSB1aWQgLSBVSUQgb2YgdGhlIGF1dGhvciB0byBtZW50aW9uLlxuICogQHBhcmFtIHtEcmFmdHl9IGJvZHkgLSBCb2R5IG9mIHRoZSBxdW90ZWQgbWVzc2FnZS5cbiAqXG4gKiBAcmV0dXJucyBSZXBseSBxdW90ZSBEcmFmdHkgZG9jIHdpdGggdGhlIHF1b3RlIGZvcm1hdHRpbmcuXG4gKi9cbkRyYWZ0eS5xdW90ZSA9IGZ1bmN0aW9uKGhlYWRlciwgdWlkLCBib2R5KSB7XG4gIGNvbnN0IHF1b3RlID0gRHJhZnR5LmFwcGVuZChEcmFmdHkuYXBwZW5kTGluZUJyZWFrKERyYWZ0eS5tZW50aW9uKGhlYWRlciwgdWlkKSksIGJvZHkpO1xuXG4gIC8vIFdyYXAgaW50byBhIHF1b3RlLlxuICBxdW90ZS5mbXQucHVzaCh7XG4gICAgYXQ6IDAsXG4gICAgbGVuOiBxdW90ZS50eHQubGVuZ3RoLFxuICAgIHRwOiAnUVEnXG4gIH0pO1xuXG4gIHJldHVybiBxdW90ZTtcbn1cblxuLyoqXG4gKiBDcmVhdGUgYSBEcmFmdHkgZG9jdW1lbnQgd2l0aCBhIG1lbnRpb24uXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBtZW50aW9uZWQgbmFtZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSB1aWQgLSBtZW50aW9uZWQgdXNlciBJRC5cbiAqXG4gKiBAcmV0dXJucyB7RHJhZnR5fSBkb2N1bWVudCB3aXRoIHRoZSBtZW50aW9uLlxuICovXG5EcmFmdHkubWVudGlvbiA9IGZ1bmN0aW9uKG5hbWUsIHVpZCkge1xuICByZXR1cm4ge1xuICAgIHR4dDogbmFtZSB8fCAnJyxcbiAgICBmbXQ6IFt7XG4gICAgICBhdDogMCxcbiAgICAgIGxlbjogKG5hbWUgfHwgJycpLmxlbmd0aCxcbiAgICAgIGtleTogMFxuICAgIH1dLFxuICAgIGVudDogW3tcbiAgICAgIHRwOiAnTU4nLFxuICAgICAgZGF0YToge1xuICAgICAgICB2YWw6IHVpZFxuICAgICAgfVxuICAgIH1dXG4gIH07XG59XG5cbi8qKlxuICogQXBwZW5kIGEgbGluayB0byBhIERyYWZ0eSBkb2N1bWVudC5cbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eX0gY29udGVudCAtIERyYWZ0eSBkb2N1bWVudCB0byBhcHBlbmQgbGluayB0by5cbiAqIEBwYXJhbSB7T2JqZWN0fSBsaW5rRGF0YSAtIExpbmsgaW5mbyBpbiBmb3JtYXQgPGNvZGU+e3R4dDogJ2Fua29yIHRleHQnLCB1cmw6ICdodHRwOi8vLi4uJ308L2NvZGU+LlxuICpcbiAqIEByZXR1cm5zIHtEcmFmdHl9IHRoZSBzYW1lIGRvY3VtZW50IGFzIDxjb2RlPmNvbnRlbnQ8L2NvZGU+LlxuICovXG5EcmFmdHkuYXBwZW5kTGluayA9IGZ1bmN0aW9uKGNvbnRlbnQsIGxpbmtEYXRhKSB7XG4gIGNvbnRlbnQgPSBjb250ZW50IHx8IHtcbiAgICB0eHQ6ICcnXG4gIH07XG5cbiAgY29udGVudC5lbnQgPSBjb250ZW50LmVudCB8fCBbXTtcbiAgY29udGVudC5mbXQgPSBjb250ZW50LmZtdCB8fCBbXTtcblxuICBjb250ZW50LmZtdC5wdXNoKHtcbiAgICBhdDogY29udGVudC50eHQubGVuZ3RoLFxuICAgIGxlbjogbGlua0RhdGEudHh0Lmxlbmd0aCxcbiAgICBrZXk6IGNvbnRlbnQuZW50Lmxlbmd0aFxuICB9KTtcbiAgY29udGVudC50eHQgKz0gbGlua0RhdGEudHh0O1xuXG4gIGNvbnN0IGV4ID0ge1xuICAgIHRwOiAnTE4nLFxuICAgIGRhdGE6IHtcbiAgICAgIHVybDogbGlua0RhdGEudXJsXG4gICAgfVxuICB9XG4gIGNvbnRlbnQuZW50LnB1c2goZXgpO1xuXG4gIHJldHVybiBjb250ZW50O1xufVxuXG4vKipcbiAqIEFwcGVuZCBpbWFnZSB0byBEcmFmdHkgZG9jdW1lbnQuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGNvbnRlbnQgLSBkb2N1bWVudCB0byBhZGQgaW1hZ2UgdG8uXG4gKiBAcGFyYW0ge0ltYWdlRGVzY30gaW1hZ2VEZXNjIC0gb2JqZWN0IHdpdGggaW1hZ2UgcGFyYW1lbmV0cy5cbiAqXG4gKiBAcmV0dXJuIHtEcmFmdHl9IHVwZGF0ZWQgZG9jdW1lbnQuXG4gKi9cbkRyYWZ0eS5hcHBlbmRJbWFnZSA9IGZ1bmN0aW9uKGNvbnRlbnQsIGltYWdlRGVzYykge1xuICBjb250ZW50ID0gY29udGVudCB8fCB7XG4gICAgdHh0OiAnJ1xuICB9O1xuICBjb250ZW50LnR4dCArPSAnICc7XG4gIHJldHVybiBEcmFmdHkuaW5zZXJ0SW1hZ2UoY29udGVudCwgY29udGVudC50eHQubGVuZ3RoIC0gMSwgaW1hZ2VEZXNjKTtcbn1cblxuLyoqXG4gKiBBcHBlbmQgYXVkaW8gcmVjb2RyaW5nIHRvIERyYWZ0eSBkb2N1bWVudC5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eX0gY29udGVudCAtIGRvY3VtZW50IHRvIGFkZCByZWNvcmRpbmcgdG8uXG4gKiBAcGFyYW0ge0F1ZGlvRGVzY30gYXVkaW9EZXNjIC0gb2JqZWN0IHdpdGggYXVkaW8gZGF0YS5cbiAqXG4gKiBAcmV0dXJuIHtEcmFmdHl9IHVwZGF0ZWQgZG9jdW1lbnQuXG4gKi9cbkRyYWZ0eS5hcHBlbmRBdWRpbyA9IGZ1bmN0aW9uKGNvbnRlbnQsIGF1ZGlvRGVzYykge1xuICBjb250ZW50ID0gY29udGVudCB8fCB7XG4gICAgdHh0OiAnJ1xuICB9O1xuICBjb250ZW50LnR4dCArPSAnICc7XG4gIHJldHVybiBEcmFmdHkuaW5zZXJ0QXVkaW8oY29udGVudCwgY29udGVudC50eHQubGVuZ3RoIC0gMSwgYXVkaW9EZXNjKTtcbn1cblxuLyoqXG4gKiBAdHlwZWRlZiBEcmFmdHkuQXR0YWNobWVudERlc2NcbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEB0eXBlIE9iamVjdFxuICogQHBhcmFtIHtzdHJpbmd9IG1pbWUgLSBtaW1lLXR5cGUgb2YgdGhlIGF0dGFjaG1lbnQsIGUuZy4gXCJhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW1cIlxuICogQHBhcmFtIHtzdHJpbmd9IGRhdGEgLSBiYXNlNjQtZW5jb2RlZCBpbi1iYW5kIGNvbnRlbnQgb2Ygc21hbGwgYXR0YWNobWVudHMuIENvdWxkIGJlIG51bGwvdW5kZWZpbmVkLlxuICogQHBhcmFtIHtzdHJpbmd9IGZpbGVuYW1lIC0gZmlsZSBuYW1lIHN1Z2dlc3Rpb24gZm9yIGRvd25sb2FkaW5nIHRoZSBhdHRhY2htZW50LlxuICogQHBhcmFtIHtpbnRlZ2VyfSBzaXplIC0gc2l6ZSBvZiB0aGUgZmlsZSBpbiBieXRlcy4gVHJlYXQgaXMgYXMgYW4gdW50cnVzdGVkIGhpbnQuXG4gKiBAcGFyYW0ge3N0cmluZ30gcmVmdXJsIC0gcmVmZXJlbmNlIHRvIHRoZSBvdXQtb2YtYmFuZCBjb250ZW50LiBDb3VsZCBiZSBudWxsL3VuZGVmaW5lZC5cbiAqIEBwYXJhbSB7UHJvbWlzZX0gdXJsUHJvbWlzZSAtIFByb21pc2Ugd2hpY2ggcmV0dXJucyBjb250ZW50IFVSTCB3aGVuIHJlc29sdmVkLlxuICovXG5cbi8qKlxuICogQXR0YWNoIGZpbGUgdG8gRHJhZnR5IGNvbnRlbnQuIEVpdGhlciBhcyBhIGJsb2Igb3IgYXMgYSByZWZlcmVuY2UuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGNvbnRlbnQgLSBkb2N1bWVudCB0byBhdHRhY2ggZmlsZSB0by5cbiAqIEBwYXJhbSB7QXR0YWNobWVudERlc2N9IG9iamVjdCAtIGNvbnRhaW5pbmcgYXR0YWNobWVudCBkZXNjcmlwdGlvbiBhbmQgZGF0YS5cbiAqXG4gKiBAcmV0dXJuIHtEcmFmdHl9IHVwZGF0ZWQgZG9jdW1lbnQuXG4gKi9cbkRyYWZ0eS5hdHRhY2hGaWxlID0gZnVuY3Rpb24oY29udGVudCwgYXR0YWNobWVudERlc2MpIHtcbiAgY29udGVudCA9IGNvbnRlbnQgfHwge1xuICAgIHR4dDogJydcbiAgfTtcblxuICBjb250ZW50LmVudCA9IGNvbnRlbnQuZW50IHx8IFtdO1xuICBjb250ZW50LmZtdCA9IGNvbnRlbnQuZm10IHx8IFtdO1xuXG4gIGNvbnRlbnQuZm10LnB1c2goe1xuICAgIGF0OiAtMSxcbiAgICBsZW46IDAsXG4gICAga2V5OiBjb250ZW50LmVudC5sZW5ndGhcbiAgfSk7XG5cbiAgY29uc3QgZXggPSB7XG4gICAgdHA6ICdFWCcsXG4gICAgZGF0YToge1xuICAgICAgbWltZTogYXR0YWNobWVudERlc2MubWltZSxcbiAgICAgIHZhbDogYXR0YWNobWVudERlc2MuZGF0YSxcbiAgICAgIG5hbWU6IGF0dGFjaG1lbnREZXNjLmZpbGVuYW1lLFxuICAgICAgcmVmOiBhdHRhY2htZW50RGVzYy5yZWZ1cmwsXG4gICAgICBzaXplOiBhdHRhY2htZW50RGVzYy5zaXplIHwgMFxuICAgIH1cbiAgfVxuICBpZiAoYXR0YWNobWVudERlc2MudXJsUHJvbWlzZSkge1xuICAgIGV4LmRhdGEuX3Byb2Nlc3NpbmcgPSB0cnVlO1xuICAgIGF0dGFjaG1lbnREZXNjLnVybFByb21pc2UudGhlbihcbiAgICAgIHVybCA9PiB7XG4gICAgICAgIGV4LmRhdGEucmVmID0gdXJsO1xuICAgICAgICBleC5kYXRhLl9wcm9jZXNzaW5nID0gdW5kZWZpbmVkO1xuICAgICAgfSxcbiAgICAgIF8gPT4ge1xuICAgICAgICAvKiBjYXRjaCB0aGUgZXJyb3IsIG90aGVyd2lzZSBpdCB3aWxsIGFwcGVhciBpbiB0aGUgY29uc29sZS4gKi9cbiAgICAgICAgZXguZGF0YS5fcHJvY2Vzc2luZyA9IHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICApO1xuICB9XG4gIGNvbnRlbnQuZW50LnB1c2goZXgpO1xuXG4gIHJldHVybiBjb250ZW50O1xufVxuXG4vKipcbiAqIFdyYXBzIGRyYWZ0eSBkb2N1bWVudCBpbnRvIGEgc2ltcGxlIGZvcm1hdHRpbmcgc3R5bGUuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl8c3RyaW5nfSBjb250ZW50IC0gZG9jdW1lbnQgb3Igc3RyaW5nIHRvIHdyYXAgaW50byBhIHN0eWxlLlxuICogQHBhcmFtIHtzdHJpbmd9IHN0eWxlIC0gdHdvLWxldHRlciBzdHlsZSB0byB3cmFwIGludG8uXG4gKiBAcGFyYW0ge251bWJlcn0gYXQgLSBpbmRleCB3aGVyZSB0aGUgc3R5bGUgc3RhcnRzLCBkZWZhdWx0IDAuXG4gKiBAcGFyYW0ge251bWJlcn0gbGVuIC0gbGVuZ3RoIG9mIHRoZSBmb3JtIGNvbnRlbnQsIGRlZmF1bHQgYWxsIG9mIGl0LlxuICpcbiAqIEByZXR1cm4ge0RyYWZ0eX0gdXBkYXRlZCBkb2N1bWVudC5cbiAqL1xuRHJhZnR5LndyYXBJbnRvID0gZnVuY3Rpb24oY29udGVudCwgc3R5bGUsIGF0LCBsZW4pIHtcbiAgaWYgKHR5cGVvZiBjb250ZW50ID09ICdzdHJpbmcnKSB7XG4gICAgY29udGVudCA9IHtcbiAgICAgIHR4dDogY29udGVudFxuICAgIH07XG4gIH1cbiAgY29udGVudC5mbXQgPSBjb250ZW50LmZtdCB8fCBbXTtcblxuICBjb250ZW50LmZtdC5wdXNoKHtcbiAgICBhdDogYXQgfHwgMCxcbiAgICBsZW46IGxlbiB8fCBjb250ZW50LnR4dC5sZW5ndGgsXG4gICAgdHA6IHN0eWxlLFxuICB9KTtcblxuICByZXR1cm4gY29udGVudDtcbn1cblxuLyoqXG4gKiBXcmFwcyBjb250ZW50IGludG8gYW4gaW50ZXJhY3RpdmUgZm9ybS5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eXxzdHJpbmd9IGNvbnRlbnQgLSB0byB3cmFwIGludG8gYSBmb3JtLlxuICogQHBhcmFtIHtudW1iZXJ9IGF0IC0gaW5kZXggd2hlcmUgdGhlIGZvcm1zIHN0YXJ0cy5cbiAqIEBwYXJhbSB7bnVtYmVyfSBsZW4gLSBsZW5ndGggb2YgdGhlIGZvcm0gY29udGVudC5cbiAqXG4gKiBAcmV0dXJuIHtEcmFmdHl9IHVwZGF0ZWQgZG9jdW1lbnQuXG4gKi9cbkRyYWZ0eS53cmFwQXNGb3JtID0gZnVuY3Rpb24oY29udGVudCwgYXQsIGxlbikge1xuICByZXR1cm4gRHJhZnR5LndyYXBJbnRvKGNvbnRlbnQsICdGTScsIGF0LCBsZW4pO1xufVxuXG4vKipcbiAqIEluc2VydCBjbGlja2FibGUgYnV0dG9uIGludG8gRHJhZnR5IGRvY3VtZW50LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fHN0cmluZ30gY29udGVudCAtIERyYWZ0eSBkb2N1bWVudCB0byBpbnNlcnQgYnV0dG9uIHRvIG9yIGEgc3RyaW5nIHRvIGJlIHVzZWQgYXMgYnV0dG9uIHRleHQuXG4gKiBAcGFyYW0ge251bWJlcn0gYXQgLSBsb2NhdGlvbiB3aGVyZSB0aGUgYnV0dG9uIGlzIGluc2VydGVkLlxuICogQHBhcmFtIHtudW1iZXJ9IGxlbiAtIHRoZSBsZW5ndGggb2YgdGhlIHRleHQgdG8gYmUgdXNlZCBhcyBidXR0b24gdGl0bGUuXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIHRoZSBidXR0b24uIENsaWVudCBzaG91bGQgcmV0dXJuIGl0IHRvIHRoZSBzZXJ2ZXIgd2hlbiB0aGUgYnV0dG9uIGlzIGNsaWNrZWQuXG4gKiBAcGFyYW0ge3N0cmluZ30gYWN0aW9uVHlwZSAtIHRoZSB0eXBlIG9mIHRoZSBidXR0b24sIG9uZSBvZiAndXJsJyBvciAncHViJy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBhY3Rpb25WYWx1ZSAtIHRoZSB2YWx1ZSB0byByZXR1cm4gb24gY2xpY2s6XG4gKiBAcGFyYW0ge3N0cmluZ30gcmVmVXJsIC0gdGhlIFVSTCB0byBnbyB0byB3aGVuIHRoZSAndXJsJyBidXR0b24gaXMgY2xpY2tlZC5cbiAqXG4gKiBAcmV0dXJuIHtEcmFmdHl9IHVwZGF0ZWQgZG9jdW1lbnQuXG4gKi9cbkRyYWZ0eS5pbnNlcnRCdXR0b24gPSBmdW5jdGlvbihjb250ZW50LCBhdCwgbGVuLCBuYW1lLCBhY3Rpb25UeXBlLCBhY3Rpb25WYWx1ZSwgcmVmVXJsKSB7XG4gIGlmICh0eXBlb2YgY29udGVudCA9PSAnc3RyaW5nJykge1xuICAgIGNvbnRlbnQgPSB7XG4gICAgICB0eHQ6IGNvbnRlbnRcbiAgICB9O1xuICB9XG5cbiAgaWYgKCFjb250ZW50IHx8ICFjb250ZW50LnR4dCB8fCBjb250ZW50LnR4dC5sZW5ndGggPCBhdCArIGxlbikge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgaWYgKGxlbiA8PSAwIHx8IFsndXJsJywgJ3B1YiddLmluZGV4T2YoYWN0aW9uVHlwZSkgPT0gLTEpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICAvLyBFbnN1cmUgcmVmVXJsIGlzIGEgc3RyaW5nLlxuICBpZiAoYWN0aW9uVHlwZSA9PSAndXJsJyAmJiAhcmVmVXJsKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgcmVmVXJsID0gJycgKyByZWZVcmw7XG5cbiAgY29udGVudC5lbnQgPSBjb250ZW50LmVudCB8fCBbXTtcbiAgY29udGVudC5mbXQgPSBjb250ZW50LmZtdCB8fCBbXTtcblxuICBjb250ZW50LmZtdC5wdXNoKHtcbiAgICBhdDogYXQgfCAwLFxuICAgIGxlbjogbGVuLFxuICAgIGtleTogY29udGVudC5lbnQubGVuZ3RoXG4gIH0pO1xuICBjb250ZW50LmVudC5wdXNoKHtcbiAgICB0cDogJ0JOJyxcbiAgICBkYXRhOiB7XG4gICAgICBhY3Q6IGFjdGlvblR5cGUsXG4gICAgICB2YWw6IGFjdGlvblZhbHVlLFxuICAgICAgcmVmOiByZWZVcmwsXG4gICAgICBuYW1lOiBuYW1lXG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gY29udGVudDtcbn1cblxuLyoqXG4gKiBBcHBlbmQgY2xpY2thYmxlIGJ1dHRvbiB0byBEcmFmdHkgZG9jdW1lbnQuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl8c3RyaW5nfSBjb250ZW50IC0gRHJhZnR5IGRvY3VtZW50IHRvIGluc2VydCBidXR0b24gdG8gb3IgYSBzdHJpbmcgdG8gYmUgdXNlZCBhcyBidXR0b24gdGV4dC5cbiAqIEBwYXJhbSB7c3RyaW5nfSB0aXRsZSAtIHRoZSB0ZXh0IHRvIGJlIHVzZWQgYXMgYnV0dG9uIHRpdGxlLlxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSB0aGUgYnV0dG9uLiBDbGllbnQgc2hvdWxkIHJldHVybiBpdCB0byB0aGUgc2VydmVyIHdoZW4gdGhlIGJ1dHRvbiBpcyBjbGlja2VkLlxuICogQHBhcmFtIHtzdHJpbmd9IGFjdGlvblR5cGUgLSB0aGUgdHlwZSBvZiB0aGUgYnV0dG9uLCBvbmUgb2YgJ3VybCcgb3IgJ3B1YicuXG4gKiBAcGFyYW0ge3N0cmluZ30gYWN0aW9uVmFsdWUgLSB0aGUgdmFsdWUgdG8gcmV0dXJuIG9uIGNsaWNrOlxuICogQHBhcmFtIHtzdHJpbmd9IHJlZlVybCAtIHRoZSBVUkwgdG8gZ28gdG8gd2hlbiB0aGUgJ3VybCcgYnV0dG9uIGlzIGNsaWNrZWQuXG4gKlxuICogQHJldHVybiB7RHJhZnR5fSB1cGRhdGVkIGRvY3VtZW50LlxuICovXG5EcmFmdHkuYXBwZW5kQnV0dG9uID0gZnVuY3Rpb24oY29udGVudCwgdGl0bGUsIG5hbWUsIGFjdGlvblR5cGUsIGFjdGlvblZhbHVlLCByZWZVcmwpIHtcbiAgY29udGVudCA9IGNvbnRlbnQgfHwge1xuICAgIHR4dDogJydcbiAgfTtcbiAgY29uc3QgYXQgPSBjb250ZW50LnR4dC5sZW5ndGg7XG4gIGNvbnRlbnQudHh0ICs9IHRpdGxlO1xuICByZXR1cm4gRHJhZnR5Lmluc2VydEJ1dHRvbihjb250ZW50LCBhdCwgdGl0bGUubGVuZ3RoLCBuYW1lLCBhY3Rpb25UeXBlLCBhY3Rpb25WYWx1ZSwgcmVmVXJsKTtcbn1cblxuLyoqXG4gKiBBdHRhY2ggYSBnZW5lcmljIEpTIG9iamVjdC4gVGhlIG9iamVjdCBpcyBhdHRhY2hlZCBhcyBhIGpzb24gc3RyaW5nLlxuICogSW50ZW5kZWQgZm9yIHJlcHJlc2VudGluZyBhIGZvcm0gcmVzcG9uc2UuXG4gKlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fSBjb250ZW50IC0gRHJhZnR5IGRvY3VtZW50IHRvIGF0dGFjaCBmaWxlIHRvLlxuICogQHBhcmFtIHtPYmplY3R9IGRhdGEgLSBkYXRhIHRvIGNvbnZlcnQgdG8ganNvbiBzdHJpbmcgYW5kIGF0dGFjaC5cbiAqIEByZXR1cm5zIHtEcmFmdHl9IHRoZSBzYW1lIGRvY3VtZW50IGFzIDxjb2RlPmNvbnRlbnQ8L2NvZGU+LlxuICovXG5EcmFmdHkuYXR0YWNoSlNPTiA9IGZ1bmN0aW9uKGNvbnRlbnQsIGRhdGEpIHtcbiAgY29udGVudCA9IGNvbnRlbnQgfHwge1xuICAgIHR4dDogJydcbiAgfTtcbiAgY29udGVudC5lbnQgPSBjb250ZW50LmVudCB8fCBbXTtcbiAgY29udGVudC5mbXQgPSBjb250ZW50LmZtdCB8fCBbXTtcblxuICBjb250ZW50LmZtdC5wdXNoKHtcbiAgICBhdDogLTEsXG4gICAgbGVuOiAwLFxuICAgIGtleTogY29udGVudC5lbnQubGVuZ3RoXG4gIH0pO1xuXG4gIGNvbnRlbnQuZW50LnB1c2goe1xuICAgIHRwOiAnRVgnLFxuICAgIGRhdGE6IHtcbiAgICAgIG1pbWU6IEpTT05fTUlNRV9UWVBFLFxuICAgICAgdmFsOiBkYXRhXG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gY29udGVudDtcbn1cbi8qKlxuICogQXBwZW5kIGxpbmUgYnJlYWsgdG8gYSBEcmFmdHkgZG9jdW1lbnQuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGNvbnRlbnQgLSBEcmFmdHkgZG9jdW1lbnQgdG8gYXBwZW5kIGxpbmVicmVhayB0by5cbiAqIEByZXR1cm5zIHtEcmFmdHl9IHRoZSBzYW1lIGRvY3VtZW50IGFzIDxjb2RlPmNvbnRlbnQ8L2NvZGU+LlxuICovXG5EcmFmdHkuYXBwZW5kTGluZUJyZWFrID0gZnVuY3Rpb24oY29udGVudCkge1xuICBjb250ZW50ID0gY29udGVudCB8fCB7XG4gICAgdHh0OiAnJ1xuICB9O1xuICBjb250ZW50LmZtdCA9IGNvbnRlbnQuZm10IHx8IFtdO1xuICBjb250ZW50LmZtdC5wdXNoKHtcbiAgICBhdDogY29udGVudC50eHQubGVuZ3RoLFxuICAgIGxlbjogMSxcbiAgICB0cDogJ0JSJ1xuICB9KTtcbiAgY29udGVudC50eHQgKz0gJyAnO1xuXG4gIHJldHVybiBjb250ZW50O1xufVxuLyoqXG4gKiBHaXZlbiBEcmFmdHkgZG9jdW1lbnQsIGNvbnZlcnQgaXQgdG8gSFRNTC5cbiAqIE5vIGF0dGVtcHQgaXMgbWFkZSB0byBzdHJpcCBwcmUtZXhpc3RpbmcgaHRtbCBtYXJrdXAuXG4gKiBUaGlzIGlzIHBvdGVudGlhbGx5IHVuc2FmZSBiZWNhdXNlIDxjb2RlPmNvbnRlbnQudHh0PC9jb2RlPiBtYXkgY29udGFpbiBtYWxpY2lvdXMgSFRNTFxuICogbWFya3VwLlxuICogQG1lbWJlcm9mIFRpbm9kZS5EcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eX0gZG9jIC0gZG9jdW1lbnQgdG8gY29udmVydC5cbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBIVE1MLXJlcHJlc2VudGF0aW9uIG9mIGNvbnRlbnQuXG4gKi9cbkRyYWZ0eS5VTlNBRkVfdG9IVE1MID0gZnVuY3Rpb24oZG9jKSB7XG4gIGNvbnN0IHRyZWUgPSBkcmFmdHlUb1RyZWUoZG9jKTtcbiAgY29uc3QgaHRtbEZvcm1hdHRlciA9IGZ1bmN0aW9uKHR5cGUsIGRhdGEsIHZhbHVlcykge1xuICAgIGNvbnN0IHRhZyA9IERFQ09SQVRPUlNbdHlwZV07XG4gICAgbGV0IHJlc3VsdCA9IHZhbHVlcyA/IHZhbHVlcy5qb2luKCcnKSA6ICcnO1xuICAgIGlmICh0YWcpIHtcbiAgICAgIHJlc3VsdCA9IHRhZy5vcGVuKGRhdGEpICsgcmVzdWx0ICsgdGFnLmNsb3NlKGRhdGEpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuICByZXR1cm4gdHJlZUJvdHRvbVVwKHRyZWUsIGh0bWxGb3JtYXR0ZXIsIDApO1xufVxuXG4vKipcbiAqIENhbGxiYWNrIGZvciBhcHBseWluZyBjdXN0b20gZm9ybWF0dGluZyB0byBhIERyYWZ0eSBkb2N1bWVudC5cbiAqIENhbGxlZCBvbmNlIGZvciBlYWNoIHN0eWxlIHNwYW4uXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQGNhbGxiYWNrIEZvcm1hdHRlclxuICogQHBhcmFtIHtzdHJpbmd9IHN0eWxlIC0gc3R5bGUgY29kZSBzdWNoIGFzIFwiU1RcIiBvciBcIklNXCIuXG4gKiBAcGFyYW0ge09iamVjdH0gZGF0YSAtIGVudGl0eSdzIGRhdGEuXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsdWVzIC0gcG9zc2libHkgc3R5bGVkIHN1YnNwYW5zIGNvbnRhaW5lZCBpbiB0aGlzIHN0eWxlIHNwYW4uXG4gKiBAcGFyYW0ge251bWJlcn0gaW5kZXggLSBpbmRleCBvZiB0aGUgZWxlbWVudCBndWFyYW50ZWVkIHRvIGJlIHVuaXF1ZS5cbiAqL1xuXG4vKipcbiAqIENvbnZlcnQgRHJhZnR5IGRvY3VtZW50IHRvIGEgcmVwcmVzZW50YXRpb24gc3VpdGFibGUgZm9yIGRpc3BsYXkuXG4gKiBUaGUgPGNvZGU+Y29udGV4dDwvY29kZT4gbWF5IGV4cG9zZSBhIGZ1bmN0aW9uIDxjb2RlPmdldEZvcm1hdHRlcihzdHlsZSk8L2NvZGU+LiBJZiBpdCdzIGF2YWlsYWJsZVxuICogaXQgd2lsbCBjYWxsIGl0IHRvIG9idGFpbiBhIDxjb2RlPmZvcm1hdHRlcjwvY29kZT4gZm9yIGEgc3VidHJlZSBvZiBzdHlsZXMgdW5kZXIgdGhlIDxjb2RlPnN0eWxlPC9jb2RlPi5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eXxPYmplY3R9IGNvbnRlbnQgLSBEcmFmdHkgZG9jdW1lbnQgdG8gdHJhbnNmb3JtLlxuICogQHBhcmFtIHtGb3JtYXR0ZXJ9IGZvcm1hdHRlciAtIGNhbGxiYWNrIHdoaWNoIGZvcm1hdHMgaW5kaXZpZHVhbCBlbGVtZW50cy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZXh0IC0gY29udGV4dCBwcm92aWRlZCB0byBmb3JtYXR0ZXIgYXMgPGNvZGU+dGhpczwvY29kZT4uXG4gKlxuICogQHJldHVybiB7T2JqZWN0fSB0cmFuc2Zvcm1lZCBvYmplY3RcbiAqL1xuRHJhZnR5LmZvcm1hdCA9IGZ1bmN0aW9uKG9yaWdpbmFsLCBmb3JtYXR0ZXIsIGNvbnRleHQpIHtcbiAgcmV0dXJuIHRyZWVCb3R0b21VcChkcmFmdHlUb1RyZWUob3JpZ2luYWwpLCBmb3JtYXR0ZXIsIDAsIFtdLCBjb250ZXh0KTtcbn1cblxuLyoqXG4gKiBTaG9ydGVuIERyYWZ0eSBkb2N1bWVudCBtYWtpbmcgdGhlIGRyYWZ0eSB0ZXh0IG5vIGxvbmdlciB0aGFuIHRoZSBsaW1pdC5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eXxzdHJpbmd9IG9yaWdpbmFsIC0gRHJhZnR5IG9iamVjdCB0byBzaG9ydGVuLlxuICogQHBhcmFtIHtudW1iZXJ9IGxpbWl0IC0gbGVuZ3RoIGluIGNoYXJhY3JldHMgdG8gc2hvcnRlbiB0by5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gbGlnaHQgLSByZW1vdmUgaGVhdnkgZGF0YSBmcm9tIGVudGl0aWVzLlxuICogQHJldHVybnMgbmV3IHNob3J0ZW5lZCBEcmFmdHkgb2JqZWN0IGxlYXZpbmcgdGhlIG9yaWdpbmFsIGludGFjdC5cbiAqL1xuRHJhZnR5LnNob3J0ZW4gPSBmdW5jdGlvbihvcmlnaW5hbCwgbGltaXQsIGxpZ2h0KSB7XG4gIGxldCB0cmVlID0gZHJhZnR5VG9UcmVlKG9yaWdpbmFsKTtcbiAgdHJlZSA9IHNob3J0ZW5UcmVlKHRyZWUsIGxpbWl0LCAn4oCmJyk7XG4gIGlmICh0cmVlICYmIGxpZ2h0KSB7XG4gICAgdHJlZSA9IGxpZ2h0RW50aXR5KHRyZWUpO1xuICB9XG4gIHJldHVybiB0cmVlVG9EcmFmdHkoe30sIHRyZWUsIFtdKTtcbn1cblxuLyoqXG4gKiBUcmFuc2Zvcm0gRHJhZnR5IGRvYyBmb3IgZm9yd2FyZGluZzogc3RyaXAgbGVhZGluZyBAbWVudGlvbiBhbmQgYW55IGxlYWRpbmcgbGluZSBicmVha3Mgb3Igd2hpdGVzcGFjZS5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eXxzdHJpbmd9IG9yaWdpbmFsIC0gRHJhZnR5IG9iamVjdCB0byBzaG9ydGVuLlxuICogQHJldHVybnMgY29udmVydGVkIERyYWZ0eSBvYmplY3QgbGVhdmluZyB0aGUgb3JpZ2luYWwgaW50YWN0LlxuICovXG5EcmFmdHkuZm9yd2FyZGVkQ29udGVudCA9IGZ1bmN0aW9uKG9yaWdpbmFsKSB7XG4gIGxldCB0cmVlID0gZHJhZnR5VG9UcmVlKG9yaWdpbmFsKTtcbiAgY29uc3Qgcm1NZW50aW9uID0gZnVuY3Rpb24obm9kZSkge1xuICAgIGlmIChub2RlLnR5cGUgPT0gJ01OJykge1xuICAgICAgaWYgKCFub2RlLnBhcmVudCB8fCAhbm9kZS5wYXJlbnQudHlwZSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cbiAgLy8gU3RyaXAgbGVhZGluZyBtZW50aW9uLlxuICB0cmVlID0gdHJlZVRvcERvd24odHJlZSwgcm1NZW50aW9uKTtcbiAgLy8gUmVtb3ZlIGxlYWRpbmcgd2hpdGVzcGFjZS5cbiAgdHJlZSA9IGxUcmltKHRyZWUpO1xuICAvLyBDb252ZXJ0IGJhY2sgdG8gRHJhZnR5LlxuICByZXR1cm4gdHJlZVRvRHJhZnR5KHt9LCB0cmVlLCBbXSk7XG59XG5cbi8qKlxuICogUHJlcGFyZSBEcmFmdHkgZG9jIGZvciB3cmFwcGluZyBpbnRvIFFRIGFzIGEgcmVwbHk6XG4gKiAgLSBSZXBsYWNlIGZvcndhcmRpbmcgbWVudGlvbiB3aXRoIHN5bWJvbCAn4p6mJyBhbmQgcmVtb3ZlIGRhdGEgKFVJRCkuXG4gKiAgLSBSZW1vdmUgcXVvdGVkIHRleHQgY29tcGxldGVseS5cbiAqICAtIFJlcGxhY2UgbGluZSBicmVha3Mgd2l0aCBzcGFjZXMuXG4gKiAgLSBTdHJpcCBlbnRpdGllcyBvZiBoZWF2eSBjb250ZW50LlxuICogIC0gTW92ZSBhdHRhY2htZW50cyB0byB0aGUgZW5kIG9mIHRoZSBkb2N1bWVudC5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eXxzdHJpbmd9IG9yaWdpbmFsIC0gRHJhZnR5IG9iamVjdCB0byBzaG9ydGVuLlxuICogQHBhcmFtIHtudW1iZXJ9IGxpbWl0IC0gbGVuZ3RoIGluIGNoYXJhY3RlcnMgdG8gc2hvcnRlbiB0by5cbiAqIEByZXR1cm5zIGNvbnZlcnRlZCBEcmFmdHkgb2JqZWN0IGxlYXZpbmcgdGhlIG9yaWdpbmFsIGludGFjdC5cbiAqL1xuRHJhZnR5LnJlcGx5Q29udGVudCA9IGZ1bmN0aW9uKG9yaWdpbmFsLCBsaW1pdCkge1xuICBjb25zdCBjb252TU5uUVFuQlIgPSBmdW5jdGlvbihub2RlKSB7XG4gICAgaWYgKG5vZGUudHlwZSA9PSAnUVEnKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9IGVsc2UgaWYgKG5vZGUudHlwZSA9PSAnTU4nKSB7XG4gICAgICBpZiAoKCFub2RlLnBhcmVudCB8fCAhbm9kZS5wYXJlbnQudHlwZSkgJiYgKG5vZGUudGV4dCB8fCAnJykuc3RhcnRzV2l0aCgn4p6mJykpIHtcbiAgICAgICAgbm9kZS50ZXh0ID0gJ+Kepic7XG4gICAgICAgIGRlbGV0ZSBub2RlLmNoaWxkcmVuO1xuICAgICAgICBkZWxldGUgbm9kZS5kYXRhO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAobm9kZS50eXBlID09ICdCUicpIHtcbiAgICAgIG5vZGUudGV4dCA9ICcgJztcbiAgICAgIGRlbGV0ZSBub2RlLnR5cGU7XG4gICAgICBkZWxldGUgbm9kZS5jaGlsZHJlbjtcbiAgICB9XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cblxuICBsZXQgdHJlZSA9IGRyYWZ0eVRvVHJlZShvcmlnaW5hbCk7XG4gIGlmICghdHJlZSkge1xuICAgIHJldHVybiBvcmlnaW5hbDtcbiAgfVxuXG4gIC8vIFN0cmlwIGxlYWRpbmcgbWVudGlvbi5cbiAgdHJlZSA9IHRyZWVUb3BEb3duKHRyZWUsIGNvbnZNTm5RUW5CUik7XG4gIC8vIE1vdmUgYXR0YWNobWVudHMgdG8gdGhlIGVuZCBvZiB0aGUgZG9jLlxuICB0cmVlID0gYXR0YWNobWVudHNUb0VuZCh0cmVlLCBNQVhfUFJFVklFV19BVFRBQ0hNRU5UUyk7XG4gIC8vIFNob3J0ZW4gdGhlIGRvYy5cbiAgdHJlZSA9IHNob3J0ZW5UcmVlKHRyZWUsIGxpbWl0LCAn4oCmJyk7XG4gIC8vIFN0cmlwIGhlYXZ5IGVsZW1lbnRzIGV4Y2VwdCBJTS5kYXRhWyd2YWwnXSAoaGF2ZSB0byBrZWVwIHRoZW0gdG8gZ2VuZXJhdGUgcHJldmlld3MgbGF0ZXIpLlxuICB0cmVlID0gbGlnaHRFbnRpdHkodHJlZSwgbm9kZSA9PiAobm9kZS50eXBlID09ICdJTScgPyBbJ3ZhbCddIDogbnVsbCkpO1xuICAvLyBDb252ZXJ0IGJhY2sgdG8gRHJhZnR5LlxuICByZXR1cm4gdHJlZVRvRHJhZnR5KHt9LCB0cmVlLCBbXSk7XG59XG5cblxuLyoqXG4gKiBHZW5lcmF0ZSBkcmFmdHkgcHJldmlldzpcbiAqICAtIFNob3J0ZW4gdGhlIGRvY3VtZW50LlxuICogIC0gU3RyaXAgYWxsIGhlYXZ5IGVudGl0eSBkYXRhIGxlYXZpbmcganVzdCBpbmxpbmUgc3R5bGVzIGFuZCBlbnRpdHkgcmVmZXJlbmNlcy5cbiAqICAtIFJlcGxhY2UgbGluZSBicmVha3Mgd2l0aCBzcGFjZXMuXG4gKiAgLSBSZXBsYWNlIGNvbnRlbnQgb2YgUVEgd2l0aCBhIHNwYWNlLlxuICogIC0gUmVwbGFjZSBmb3J3YXJkaW5nIG1lbnRpb24gd2l0aCBzeW1ib2wgJ+KepicuXG4gKiBtb3ZlIGFsbCBhdHRhY2htZW50cyB0byB0aGUgZW5kIG9mIHRoZSBkb2N1bWVudCBhbmQgbWFrZSB0aGVtIHZpc2libGUuXG4gKiBUaGUgPGNvZGU+Y29udGV4dDwvY29kZT4gbWF5IGV4cG9zZSBhIGZ1bmN0aW9uIDxjb2RlPmdldEZvcm1hdHRlcihzdHlsZSk8L2NvZGU+LiBJZiBpdCdzIGF2YWlsYWJsZVxuICogaXQgd2lsbCBjYWxsIGl0IHRvIG9idGFpbiBhIDxjb2RlPmZvcm1hdHRlcjwvY29kZT4gZm9yIGEgc3VidHJlZSBvZiBzdHlsZXMgdW5kZXIgdGhlIDxjb2RlPnN0eWxlPC9jb2RlPi5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eXxzdHJpbmd9IG9yaWdpbmFsIC0gRHJhZnR5IG9iamVjdCB0byBzaG9ydGVuLlxuICogQHBhcmFtIHtudW1iZXJ9IGxpbWl0IC0gbGVuZ3RoIGluIGNoYXJhY3RlcnMgdG8gc2hvcnRlbiB0by5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gZm9yd2FyZGluZyAtIHRoaXMgYSBmb3J3YXJkaW5nIG1lc3NhZ2UgcHJldmlldy5cbiAqIEByZXR1cm5zIG5ldyBzaG9ydGVuZWQgRHJhZnR5IG9iamVjdCBsZWF2aW5nIHRoZSBvcmlnaW5hbCBpbnRhY3QuXG4gKi9cbkRyYWZ0eS5wcmV2aWV3ID0gZnVuY3Rpb24ob3JpZ2luYWwsIGxpbWl0LCBmb3J3YXJkaW5nKSB7XG4gIGxldCB0cmVlID0gZHJhZnR5VG9UcmVlKG9yaWdpbmFsKTtcblxuICAvLyBNb3ZlIGF0dGFjaG1lbnRzIHRvIHRoZSBlbmQuXG4gIHRyZWUgPSBhdHRhY2htZW50c1RvRW5kKHRyZWUsIE1BWF9QUkVWSUVXX0FUVEFDSE1FTlRTKTtcblxuICAvLyBDb252ZXJ0IGxlYWRpbmcgbWVudGlvbiB0byAn4p6mJyBhbmQgcmVwbGFjZSBRUSBhbmQgQlIgd2l0aCBhIHNwYWNlICcgJy5cbiAgY29uc3QgY29udk1OblFRbkJSID0gZnVuY3Rpb24obm9kZSkge1xuICAgIGlmIChub2RlLnR5cGUgPT0gJ01OJykge1xuICAgICAgaWYgKCghbm9kZS5wYXJlbnQgfHwgIW5vZGUucGFyZW50LnR5cGUpICYmIChub2RlLnRleHQgfHwgJycpLnN0YXJ0c1dpdGgoJ+KepicpKSB7XG4gICAgICAgIG5vZGUudGV4dCA9ICfinqYnO1xuICAgICAgICBkZWxldGUgbm9kZS5jaGlsZHJlbjtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG5vZGUudHlwZSA9PSAnUVEnKSB7XG4gICAgICBub2RlLnRleHQgPSAnICc7XG4gICAgICBkZWxldGUgbm9kZS5jaGlsZHJlbjtcbiAgICB9IGVsc2UgaWYgKG5vZGUudHlwZSA9PSAnQlInKSB7XG4gICAgICBub2RlLnRleHQgPSAnICc7XG4gICAgICBkZWxldGUgbm9kZS5jaGlsZHJlbjtcbiAgICAgIGRlbGV0ZSBub2RlLnR5cGU7XG4gICAgfVxuICAgIHJldHVybiBub2RlO1xuICB9XG4gIHRyZWUgPSB0cmVlVG9wRG93bih0cmVlLCBjb252TU5uUVFuQlIpO1xuXG4gIHRyZWUgPSBzaG9ydGVuVHJlZSh0cmVlLCBsaW1pdCwgJ+KApicpO1xuICBpZiAoZm9yd2FyZGluZykge1xuICAgIC8vIEtlZXAgSU0gZGF0YSBmb3IgcHJldmlldy5cbiAgICB0cmVlID0gbGlnaHRFbnRpdHkodHJlZSwgbm9kZSA9PiAobm9kZS50eXBlID09ICdJTScgPyBbJ3ZhbCddIDogbnVsbCkpO1xuICB9IGVsc2Uge1xuICAgIHRyZWUgPSBsaWdodEVudGl0eSh0cmVlKTtcbiAgfVxuXG4gIC8vIENvbnZlcnQgYmFjayB0byBEcmFmdHkuXG4gIHJldHVybiB0cmVlVG9EcmFmdHkoe30sIHRyZWUsIFtdKTtcbn1cblxuLyoqXG4gKiBHaXZlbiBEcmFmdHkgZG9jdW1lbnQsIGNvbnZlcnQgaXQgdG8gcGxhaW4gdGV4dC5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eX0gY29udGVudCAtIGRvY3VtZW50IHRvIGNvbnZlcnQgdG8gcGxhaW4gdGV4dC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IHBsYWluLXRleHQgcmVwcmVzZW50YXRpb24gb2YgdGhlIGRyYWZ0eSBkb2N1bWVudC5cbiAqL1xuRHJhZnR5LnRvUGxhaW5UZXh0ID0gZnVuY3Rpb24oY29udGVudCkge1xuICByZXR1cm4gdHlwZW9mIGNvbnRlbnQgPT0gJ3N0cmluZycgPyBjb250ZW50IDogY29udGVudC50eHQ7XG59XG5cbi8qKlxuICogQ2hlY2sgaWYgdGhlIGRvY3VtZW50IGhhcyBubyBtYXJrdXAgYW5kIG5vIGVudGl0aWVzLlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fSBjb250ZW50IC0gY29udGVudCB0byBjaGVjayBmb3IgcHJlc2VuY2Ugb2YgbWFya3VwLlxuICogQHJldHVybnMgPGNvZGU+dHJ1ZTwvY29kZT4gaXMgY29udGVudCBpcyBwbGFpbiB0ZXh0LCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICovXG5EcmFmdHkuaXNQbGFpblRleHQgPSBmdW5jdGlvbihjb250ZW50KSB7XG4gIHJldHVybiB0eXBlb2YgY29udGVudCA9PSAnc3RyaW5nJyB8fCAhKGNvbnRlbnQuZm10IHx8IGNvbnRlbnQuZW50KTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0IGRvY3VtZW50IHRvIHBsYWluIHRleHQgd2l0aCBtYXJrZG93bi4gQWxsIGVsZW1lbnRzIHdoaWNoIGNhbm5vdFxuICogYmUgcmVwcmVzZW50ZWQgaW4gbWFya2Rvd24gYXJlIHN0cmlwcGVkLlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fSBjb250ZW50IC0gZG9jdW1lbnQgdG8gY29udmVydCB0byBwbGFpbiB0ZXh0IHdpdGggbWFya2Rvd24uXG4gKi9cbkRyYWZ0eS50b01hcmtkb3duID0gZnVuY3Rpb24oY29udGVudCkge1xuICBsZXQgdHJlZSA9IGRyYWZ0eVRvVHJlZShjb250ZW50KTtcbiAgY29uc3QgbWRGb3JtYXR0ZXIgPSBmdW5jdGlvbih0eXBlLCBfLCB2YWx1ZXMpIHtcbiAgICBjb25zdCBkZWYgPSBGT1JNQVRfVEFHU1t0eXBlXTtcbiAgICBsZXQgcmVzdWx0ID0gKHZhbHVlcyA/IHZhbHVlcy5qb2luKCcnKSA6ICcnKTtcbiAgICBpZiAoZGVmKSB7XG4gICAgICBpZiAoZGVmLmlzVm9pZCkge1xuICAgICAgICByZXN1bHQgPSBkZWYubWRfdGFnIHx8ICcnO1xuICAgICAgfSBlbHNlIGlmIChkZWYubWRfdGFnKSB7XG4gICAgICAgIHJlc3VsdCA9IGRlZi5tZF90YWcgKyByZXN1bHQgKyBkZWYubWRfdGFnO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuICByZXR1cm4gdHJlZUJvdHRvbVVwKHRyZWUsIG1kRm9ybWF0dGVyLCAwKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgdGhlIG9iamVjdCByZXByZXNldHMgaXMgYSB2YWxpZCBEcmFmdHkgZG9jdW1lbnQuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGNvbnRlbnQgLSBjb250ZW50IHRvIGNoZWNrIGZvciB2YWxpZGl0eS5cbiAqIEByZXR1cm5zIDxjb2RlPnRydWU8L2NvZGU+IGlzIGNvbnRlbnQgaXMgdmFsaWQsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gKi9cbkRyYWZ0eS5pc1ZhbGlkID0gZnVuY3Rpb24oY29udGVudCkge1xuICBpZiAoIWNvbnRlbnQpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdCB7XG4gICAgdHh0LFxuICAgIGZtdCxcbiAgICBlbnRcbiAgfSA9IGNvbnRlbnQ7XG5cbiAgaWYgKCF0eHQgJiYgdHh0ICE9PSAnJyAmJiAhZm10ICYmICFlbnQpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdCB0eHRfdHlwZSA9IHR5cGVvZiB0eHQ7XG4gIGlmICh0eHRfdHlwZSAhPSAnc3RyaW5nJyAmJiB0eHRfdHlwZSAhPSAndW5kZWZpbmVkJyAmJiB0eHQgIT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAodHlwZW9mIGZtdCAhPSAndW5kZWZpbmVkJyAmJiAhQXJyYXkuaXNBcnJheShmbXQpICYmIGZtdCAhPT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgZW50ICE9ICd1bmRlZmluZWQnICYmICFBcnJheS5pc0FycmF5KGVudCkgJiYgZW50ICE9PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG4vKipcbiAqIENoZWNrIGlmIHRoZSBkcmFmdHkgZG9jdW1lbnQgaGFzIGF0dGFjaG1lbnRzOiBzdHlsZSBFWCBhbmQgb3V0c2lkZSBvZiBub3JtYWwgcmVuZGVyaW5nIGZsb3csXG4gKiBpLmUuIDxjb2RlPmF0ID0gLTE8L2NvZGU+LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fSBjb250ZW50IC0gZG9jdW1lbnQgdG8gY2hlY2sgZm9yIGF0dGFjaG1lbnRzLlxuICogQHJldHVybnMgPGNvZGU+dHJ1ZTwvY29kZT4gaWYgdGhlcmUgYXJlIGF0dGFjaG1lbnRzLlxuICovXG5EcmFmdHkuaGFzQXR0YWNobWVudHMgPSBmdW5jdGlvbihjb250ZW50KSB7XG4gIGlmICghQXJyYXkuaXNBcnJheShjb250ZW50LmZtdCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgZm9yIChsZXQgaSBpbiBjb250ZW50LmZtdCkge1xuICAgIGNvbnN0IGZtdCA9IGNvbnRlbnQuZm10W2ldO1xuICAgIGlmIChmbXQgJiYgZm10LmF0IDwgMCkge1xuICAgICAgY29uc3QgZW50ID0gY29udGVudC5lbnRbZm10LmtleSB8IDBdO1xuICAgICAgcmV0dXJuIGVudCAmJiBlbnQudHAgPT0gJ0VYJyAmJiBlbnQuZGF0YTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIENhbGxiYWNrIGZvciBhcHBseWluZyBjdXN0b20gZm9ybWF0dGluZy90cmFuc2Zvcm1hdGlvbiB0byBhIERyYWZ0eSBkb2N1bWVudC5cbiAqIENhbGxlZCBvbmNlIGZvciBlYWNoIGVudGl0eS5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAY2FsbGJhY2sgRW50aXR5Q2FsbGJhY2tcbiAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIGVudGl0eSBkYXRhLlxuICogQHBhcmFtIHtzdHJpbmd9IGVudGl0eSB0eXBlLlxuICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IGVudGl0eSdzIGluZGV4IGluIGBjb250ZW50LmVudGAuXG4gKi9cblxuLyoqXG4gKiBFbnVtZXJhdGUgYXR0YWNobWVudHM6IHN0eWxlIEVYIGFuZCBvdXRzaWRlIG9mIG5vcm1hbCByZW5kZXJpbmcgZmxvdywgaS5lLiA8Y29kZT5hdCA9IC0xPC9jb2RlPi5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eX0gY29udGVudCAtIGRvY3VtZW50IHRvIHByb2Nlc3MgZm9yIGF0dGFjaG1lbnRzLlxuICogQHBhcmFtIHtFbnRpdHlDYWxsYmFja30gY2FsbGJhY2sgLSBjYWxsYmFjayB0byBjYWxsIGZvciBlYWNoIGF0dGFjaG1lbnQuXG4gKiBAcGFyYW0ge09iamVjdH0gY29udGV4dCAtIHZhbHVlIG9mIFwidGhpc1wiIGZvciBjYWxsYmFjay5cbiAqL1xuRHJhZnR5LmF0dGFjaG1lbnRzID0gZnVuY3Rpb24oY29udGVudCwgY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgaWYgKCFBcnJheS5pc0FycmF5KGNvbnRlbnQuZm10KSkge1xuICAgIHJldHVybjtcbiAgfVxuICBsZXQgaSA9IDA7XG4gIGNvbnRlbnQuZm10LmZvckVhY2goZm10ID0+IHtcbiAgICBpZiAoZm10ICYmIGZtdC5hdCA8IDApIHtcbiAgICAgIGNvbnN0IGVudCA9IGNvbnRlbnQuZW50W2ZtdC5rZXkgfCAwXTtcbiAgICAgIGlmIChlbnQgJiYgZW50LnRwID09ICdFWCcgJiYgZW50LmRhdGEpIHtcbiAgICAgICAgY2FsbGJhY2suY2FsbChjb250ZXh0LCBlbnQuZGF0YSwgaSsrLCAnRVgnKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufVxuXG4vKipcbiAqIENoZWNrIGlmIHRoZSBkcmFmdHkgZG9jdW1lbnQgaGFzIGVudGl0aWVzLlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fSBjb250ZW50IC0gZG9jdW1lbnQgdG8gY2hlY2sgZm9yIGVudGl0aWVzLlxuICogQHJldHVybnMgPGNvZGU+dHJ1ZTwvY29kZT4gaWYgdGhlcmUgYXJlIGVudGl0aWVzLlxuICovXG5EcmFmdHkuaGFzRW50aXRpZXMgPSBmdW5jdGlvbihjb250ZW50KSB7XG4gIHJldHVybiBjb250ZW50LmVudCAmJiBjb250ZW50LmVudC5sZW5ndGggPiAwO1xufVxuXG4vKipcbiAqIEVudW1lcmF0ZSBlbnRpdGllcy5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eX0gY29udGVudCAtIGRvY3VtZW50IHdpdGggZW50aXRpZXMgdG8gZW51bWVyYXRlLlxuICogQHBhcmFtIHtFbnRpdHlDYWxsYmFja30gY2FsbGJhY2sgLSBjYWxsYmFjayB0byBjYWxsIGZvciBlYWNoIGVudGl0eS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZXh0IC0gdmFsdWUgb2YgXCJ0aGlzXCIgZm9yIGNhbGxiYWNrLlxuICovXG5EcmFmdHkuZW50aXRpZXMgPSBmdW5jdGlvbihjb250ZW50LCBjYWxsYmFjaywgY29udGV4dCkge1xuICBpZiAoY29udGVudC5lbnQgJiYgY29udGVudC5lbnQubGVuZ3RoID4gMCkge1xuICAgIGZvciAobGV0IGkgaW4gY29udGVudC5lbnQpIHtcbiAgICAgIGlmIChjb250ZW50LmVudFtpXSkge1xuICAgICAgICBjYWxsYmFjay5jYWxsKGNvbnRleHQsIGNvbnRlbnQuZW50W2ldLmRhdGEsIGksIGNvbnRlbnQuZW50W2ldLnRwKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBSZW1vdmUgdW5yZWNvZ25pemVkIGZpZWxkcyBmcm9tIGVudGl0eSBkYXRhXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGNvbnRlbnQgLSBkb2N1bWVudCB3aXRoIGVudGl0aWVzIHRvIGVudW1lcmF0ZS5cbiAqIEByZXR1cm5zIGNvbnRlbnQuXG4gKi9cbkRyYWZ0eS5zYW5pdGl6ZUVudGl0aWVzID0gZnVuY3Rpb24oY29udGVudCkge1xuICBpZiAoY29udGVudCAmJiBjb250ZW50LmVudCAmJiBjb250ZW50LmVudC5sZW5ndGggPiAwKSB7XG4gICAgZm9yIChsZXQgaSBpbiBjb250ZW50LmVudCkge1xuICAgICAgY29uc3QgZW50ID0gY29udGVudC5lbnRbaV07XG4gICAgICBpZiAoZW50ICYmIGVudC5kYXRhKSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSBjb3B5RW50RGF0YShlbnQuZGF0YSk7XG4gICAgICAgIGlmIChkYXRhKSB7XG4gICAgICAgICAgY29udGVudC5lbnRbaV0uZGF0YSA9IGRhdGE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZGVsZXRlIGNvbnRlbnQuZW50W2ldLmRhdGE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cbi8qKlxuICogR2l2ZW4gdGhlIGVudGl0eSwgZ2V0IFVSTCB3aGljaCBjYW4gYmUgdXNlZCBmb3IgZG93bmxvYWRpbmdcbiAqIGVudGl0eSBkYXRhLlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBlbnREYXRhIC0gZW50aXR5LmRhdGEgdG8gZ2V0IHRoZSBVUmwgZnJvbS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFVSTCB0byBkb3dubG9hZCBlbnRpdHkgZGF0YSBvciA8Y29kZT5udWxsPC9jb2RlPi5cbiAqL1xuRHJhZnR5LmdldERvd25sb2FkVXJsID0gZnVuY3Rpb24oZW50RGF0YSkge1xuICBsZXQgdXJsID0gbnVsbDtcbiAgaWYgKGVudERhdGEubWltZSAhPSBKU09OX01JTUVfVFlQRSAmJiBlbnREYXRhLnZhbCkge1xuICAgIHVybCA9IGJhc2U2NHRvT2JqZWN0VXJsKGVudERhdGEudmFsLCBlbnREYXRhLm1pbWUsIERyYWZ0eS5sb2dnZXIpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBlbnREYXRhLnJlZiA9PSAnc3RyaW5nJykge1xuICAgIHVybCA9IGVudERhdGEucmVmO1xuICB9XG4gIHJldHVybiB1cmw7XG59XG5cbi8qKlxuICogQ2hlY2sgaWYgdGhlIGVudGl0eSBkYXRhIGlzIG5vdCByZWFkeSBmb3Igc2VuZGluZywgc3VjaCBhcyBiZWluZyB1cGxvYWRlZCB0byB0aGUgc2VydmVyLlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBlbnRpdHkuZGF0YSB0byBnZXQgdGhlIFVSbCBmcm9tLlxuICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgdXBsb2FkIGlzIGluIHByb2dyZXNzLCBmYWxzZSBvdGhlcndpc2UuXG4gKi9cbkRyYWZ0eS5pc1Byb2Nlc3NpbmcgPSBmdW5jdGlvbihlbnREYXRhKSB7XG4gIHJldHVybiAhIWVudERhdGEuX3Byb2Nlc3Npbmc7XG59XG5cbi8qKlxuICogR2l2ZW4gdGhlIGVudGl0eSwgZ2V0IFVSTCB3aGljaCBjYW4gYmUgdXNlZCBmb3IgcHJldmlld2luZ1xuICogdGhlIGVudGl0eS5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZW50aXR5LmRhdGEgdG8gZ2V0IHRoZSBVUmwgZnJvbS5cbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfSB1cmwgZm9yIHByZXZpZXdpbmcgb3IgbnVsbCBpZiBubyBzdWNoIHVybCBpcyBhdmFpbGFibGUuXG4gKi9cbkRyYWZ0eS5nZXRQcmV2aWV3VXJsID0gZnVuY3Rpb24oZW50RGF0YSkge1xuICByZXR1cm4gZW50RGF0YS52YWwgPyBiYXNlNjR0b09iamVjdFVybChlbnREYXRhLnZhbCwgZW50RGF0YS5taW1lLCBEcmFmdHkubG9nZ2VyKSA6IG51bGw7XG59XG5cbi8qKlxuICogR2V0IGFwcHJveGltYXRlIHNpemUgb2YgdGhlIGVudGl0eS5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZW50RGF0YSAtIGVudGl0eS5kYXRhIHRvIGdldCB0aGUgc2l6ZSBmb3IuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBzaXplIG9mIGVudGl0eSBkYXRhIGluIGJ5dGVzLlxuICovXG5EcmFmdHkuZ2V0RW50aXR5U2l6ZSA9IGZ1bmN0aW9uKGVudERhdGEpIHtcbiAgLy8gRWl0aGVyIHNpemUgaGludCBvciBsZW5ndGggb2YgdmFsdWUuIFRoZSB2YWx1ZSBpcyBiYXNlNjQgZW5jb2RlZCxcbiAgLy8gdGhlIGFjdHVhbCBvYmplY3Qgc2l6ZSBpcyBzbWFsbGVyIHRoYW4gdGhlIGVuY29kZWQgbGVuZ3RoLlxuICByZXR1cm4gZW50RGF0YS5zaXplID8gZW50RGF0YS5zaXplIDogZW50RGF0YS52YWwgPyAoZW50RGF0YS52YWwubGVuZ3RoICogMC43NSkgfCAwIDogMDtcbn1cblxuLyoqXG4gKiBHZXQgZW50aXR5IG1pbWUgdHlwZS5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZW50RGF0YSAtIGVudGl0eS5kYXRhIHRvIGdldCB0aGUgdHlwZSBmb3IuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBtaW1lIHR5cGUgb2YgZW50aXR5LlxuICovXG5EcmFmdHkuZ2V0RW50aXR5TWltZVR5cGUgPSBmdW5jdGlvbihlbnREYXRhKSB7XG4gIHJldHVybiBlbnREYXRhLm1pbWUgfHwgJ3RleHQvcGxhaW4nO1xufVxuXG4vKipcbiAqIEdldCBIVE1MIHRhZyBmb3IgYSBnaXZlbiB0d28tbGV0dGVyIHN0eWxlIG5hbWUuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHN0eWxlIC0gdHdvLWxldHRlciBzdHlsZSwgbGlrZSBTVCBvciBMTi5cbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBIVE1MIHRhZyBuYW1lIGlmIHN0eWxlIGlzIGZvdW5kLCB7Y29kZTogdW5kZWZpbmVkfSBpZiBzdHlsZSBpcyBmYWxzaXNoIG9yIG5vdCBmb3VuZC5cbiAqL1xuRHJhZnR5LnRhZ05hbWUgPSBmdW5jdGlvbihzdHlsZSkge1xuICByZXR1cm4gRk9STUFUX1RBR1Nbc3R5bGVdICYmIEZPUk1BVF9UQUdTW3N0eWxlXS5odG1sX3RhZztcbn1cblxuLyoqXG4gKiBGb3IgYSBnaXZlbiBkYXRhIGJ1bmRsZSBnZW5lcmF0ZSBhbiBvYmplY3Qgd2l0aCBIVE1MIGF0dHJpYnV0ZXMsXG4gKiBmb3IgaW5zdGFuY2UsIGdpdmVuIHt1cmw6IFwiaHR0cDovL3d3dy5leGFtcGxlLmNvbS9cIn0gcmV0dXJuXG4gKiB7aHJlZjogXCJodHRwOi8vd3d3LmV4YW1wbGUuY29tL1wifVxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHlsZSAtIHR3by1sZXR0ZXIgc3R5bGUgdG8gZ2VuZXJhdGUgYXR0cmlidXRlcyBmb3IuXG4gKiBAcGFyYW0ge09iamVjdH0gZGF0YSAtIGRhdGEgYnVuZGxlIHRvIGNvbnZlcnQgdG8gYXR0cmlidXRlc1xuICpcbiAqIEByZXR1cm5zIHtPYmplY3R9IG9iamVjdCB3aXRoIEhUTUwgYXR0cmlidXRlcy5cbiAqL1xuRHJhZnR5LmF0dHJWYWx1ZSA9IGZ1bmN0aW9uKHN0eWxlLCBkYXRhKSB7XG4gIGlmIChkYXRhICYmIERFQ09SQVRPUlNbc3R5bGVdKSB7XG4gICAgcmV0dXJuIERFQ09SQVRPUlNbc3R5bGVdLnByb3BzKGRhdGEpO1xuICB9XG5cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBEcmFmdHkgTUlNRSB0eXBlLlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9IGNvbnRlbnQtVHlwZSBcInRleHQveC1kcmFmdHlcIi5cbiAqL1xuRHJhZnR5LmdldENvbnRlbnRUeXBlID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBEUkFGVFlfTUlNRV9UWVBFO1xufVxuXG4vLyA9PT09PT09PT09PT09PT09PVxuLy8gVXRpbGl0eSBtZXRob2RzLlxuLy8gPT09PT09PT09PT09PT09PT1cblxuLy8gVGFrZSBhIHN0cmluZyBhbmQgZGVmaW5lZCBlYXJsaWVyIHN0eWxlIHNwYW5zLCByZS1jb21wb3NlIHRoZW0gaW50byBhIHRyZWUgd2hlcmUgZWFjaCBsZWFmIGlzXG4vLyBhIHNhbWUtc3R5bGUgKGluY2x1ZGluZyB1bnN0eWxlZCkgc3RyaW5nLiBJLmUuICdoZWxsbyAqYm9sZCBfaXRhbGljXyogYW5kIH5tb3JlfiB3b3JsZCcgLT5cbi8vICgnaGVsbG8gJywgKGI6ICdib2xkICcsIChpOiAnaXRhbGljJykpLCAnIGFuZCAnLCAoczogJ21vcmUnKSwgJyB3b3JsZCcpO1xuLy9cbi8vIFRoaXMgaXMgbmVlZGVkIGluIG9yZGVyIHRvIGNsZWFyIG1hcmt1cCwgaS5lLiAnaGVsbG8gKndvcmxkKicgLT4gJ2hlbGxvIHdvcmxkJyBhbmQgY29udmVydFxuLy8gcmFuZ2VzIGZyb20gbWFya3VwLWVkIG9mZnNldHMgdG8gcGxhaW4gdGV4dCBvZmZzZXRzLlxuZnVuY3Rpb24gY2h1bmtpZnkobGluZSwgc3RhcnQsIGVuZCwgc3BhbnMpIHtcbiAgY29uc3QgY2h1bmtzID0gW107XG5cbiAgaWYgKHNwYW5zLmxlbmd0aCA9PSAwKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgZm9yIChsZXQgaSBpbiBzcGFucykge1xuICAgIC8vIEdldCB0aGUgbmV4dCBjaHVuayBmcm9tIHRoZSBxdWV1ZVxuICAgIGNvbnN0IHNwYW4gPSBzcGFuc1tpXTtcblxuICAgIC8vIEdyYWIgdGhlIGluaXRpYWwgdW5zdHlsZWQgY2h1bmtcbiAgICBpZiAoc3Bhbi5hdCA+IHN0YXJ0KSB7XG4gICAgICBjaHVua3MucHVzaCh7XG4gICAgICAgIHR4dDogbGluZS5zbGljZShzdGFydCwgc3Bhbi5hdClcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIEdyYWIgdGhlIHN0eWxlZCBjaHVuay4gSXQgbWF5IGluY2x1ZGUgc3ViY2h1bmtzLlxuICAgIGNvbnN0IGNodW5rID0ge1xuICAgICAgdHA6IHNwYW4udHBcbiAgICB9O1xuICAgIGNvbnN0IGNobGQgPSBjaHVua2lmeShsaW5lLCBzcGFuLmF0ICsgMSwgc3Bhbi5lbmQsIHNwYW4uY2hpbGRyZW4pO1xuICAgIGlmIChjaGxkLmxlbmd0aCA+IDApIHtcbiAgICAgIGNodW5rLmNoaWxkcmVuID0gY2hsZDtcbiAgICB9IGVsc2Uge1xuICAgICAgY2h1bmsudHh0ID0gc3Bhbi50eHQ7XG4gICAgfVxuICAgIGNodW5rcy5wdXNoKGNodW5rKTtcbiAgICBzdGFydCA9IHNwYW4uZW5kICsgMTsgLy8gJysxJyBpcyB0byBza2lwIHRoZSBmb3JtYXR0aW5nIGNoYXJhY3RlclxuICB9XG5cbiAgLy8gR3JhYiB0aGUgcmVtYWluaW5nIHVuc3R5bGVkIGNodW5rLCBhZnRlciB0aGUgbGFzdCBzcGFuXG4gIGlmIChzdGFydCA8IGVuZCkge1xuICAgIGNodW5rcy5wdXNoKHtcbiAgICAgIHR4dDogbGluZS5zbGljZShzdGFydCwgZW5kKVxuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIGNodW5rcztcbn1cblxuLy8gRGV0ZWN0IHN0YXJ0cyBhbmQgZW5kcyBvZiBmb3JtYXR0aW5nIHNwYW5zLiBVbmZvcm1hdHRlZCBzcGFucyBhcmVcbi8vIGlnbm9yZWQgYXQgdGhpcyBzdGFnZS5cbmZ1bmN0aW9uIHNwYW5uaWZ5KG9yaWdpbmFsLCByZV9zdGFydCwgcmVfZW5kLCB0eXBlKSB7XG4gIGNvbnN0IHJlc3VsdCA9IFtdO1xuICBsZXQgaW5kZXggPSAwO1xuICBsZXQgbGluZSA9IG9yaWdpbmFsLnNsaWNlKDApOyAvLyBtYWtlIGEgY29weTtcblxuICB3aGlsZSAobGluZS5sZW5ndGggPiAwKSB7XG4gICAgLy8gbWF0Y2hbMF07IC8vIG1hdGNoLCBsaWtlICcqYWJjKidcbiAgICAvLyBtYXRjaFsxXTsgLy8gbWF0Y2ggY2FwdHVyZWQgaW4gcGFyZW50aGVzaXMsIGxpa2UgJ2FiYydcbiAgICAvLyBtYXRjaFsnaW5kZXgnXTsgLy8gb2Zmc2V0IHdoZXJlIHRoZSBtYXRjaCBzdGFydGVkLlxuXG4gICAgLy8gRmluZCB0aGUgb3BlbmluZyB0b2tlbi5cbiAgICBjb25zdCBzdGFydCA9IHJlX3N0YXJ0LmV4ZWMobGluZSk7XG4gICAgaWYgKHN0YXJ0ID09IG51bGwpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIC8vIEJlY2F1c2UgamF2YXNjcmlwdCBSZWdFeHAgZG9lcyBub3Qgc3VwcG9ydCBsb29rYmVoaW5kLCB0aGUgYWN0dWFsIG9mZnNldCBtYXkgbm90IHBvaW50XG4gICAgLy8gYXQgdGhlIG1hcmt1cCBjaGFyYWN0ZXIuIEZpbmQgaXQgaW4gdGhlIG1hdGNoZWQgc3RyaW5nLlxuICAgIGxldCBzdGFydF9vZmZzZXQgPSBzdGFydFsnaW5kZXgnXSArIHN0YXJ0WzBdLmxhc3RJbmRleE9mKHN0YXJ0WzFdKTtcbiAgICAvLyBDbGlwIHRoZSBwcm9jZXNzZWQgcGFydCBvZiB0aGUgc3RyaW5nLlxuICAgIGxpbmUgPSBsaW5lLnNsaWNlKHN0YXJ0X29mZnNldCArIDEpO1xuICAgIC8vIHN0YXJ0X29mZnNldCBpcyBhbiBvZmZzZXQgd2l0aGluIHRoZSBjbGlwcGVkIHN0cmluZy4gQ29udmVydCB0byBvcmlnaW5hbCBpbmRleC5cbiAgICBzdGFydF9vZmZzZXQgKz0gaW5kZXg7XG4gICAgLy8gSW5kZXggbm93IHBvaW50IHRvIHRoZSBiZWdpbm5pbmcgb2YgJ2xpbmUnIHdpdGhpbiB0aGUgJ29yaWdpbmFsJyBzdHJpbmcuXG4gICAgaW5kZXggPSBzdGFydF9vZmZzZXQgKyAxO1xuXG4gICAgLy8gRmluZCB0aGUgbWF0Y2hpbmcgY2xvc2luZyB0b2tlbi5cbiAgICBjb25zdCBlbmQgPSByZV9lbmQgPyByZV9lbmQuZXhlYyhsaW5lKSA6IG51bGw7XG4gICAgaWYgKGVuZCA9PSBudWxsKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgbGV0IGVuZF9vZmZzZXQgPSBlbmRbJ2luZGV4J10gKyBlbmRbMF0uaW5kZXhPZihlbmRbMV0pO1xuICAgIC8vIENsaXAgdGhlIHByb2Nlc3NlZCBwYXJ0IG9mIHRoZSBzdHJpbmcuXG4gICAgbGluZSA9IGxpbmUuc2xpY2UoZW5kX29mZnNldCArIDEpO1xuICAgIC8vIFVwZGF0ZSBvZmZzZXRzXG4gICAgZW5kX29mZnNldCArPSBpbmRleDtcbiAgICAvLyBJbmRleCBub3cgcG9pbnRzIHRvIHRoZSBiZWdpbm5pbmcgb2YgJ2xpbmUnIHdpdGhpbiB0aGUgJ29yaWdpbmFsJyBzdHJpbmcuXG4gICAgaW5kZXggPSBlbmRfb2Zmc2V0ICsgMTtcblxuICAgIHJlc3VsdC5wdXNoKHtcbiAgICAgIHR4dDogb3JpZ2luYWwuc2xpY2Uoc3RhcnRfb2Zmc2V0ICsgMSwgZW5kX29mZnNldCksXG4gICAgICBjaGlsZHJlbjogW10sXG4gICAgICBhdDogc3RhcnRfb2Zmc2V0LFxuICAgICAgZW5kOiBlbmRfb2Zmc2V0LFxuICAgICAgdHA6IHR5cGVcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8vIENvbnZlcnQgbGluZWFyIGFycmF5IG9yIHNwYW5zIGludG8gYSB0cmVlIHJlcHJlc2VudGF0aW9uLlxuLy8gS2VlcCBzdGFuZGFsb25lIGFuZCBuZXN0ZWQgc3BhbnMsIHRocm93IGF3YXkgcGFydGlhbGx5IG92ZXJsYXBwaW5nIHNwYW5zLlxuZnVuY3Rpb24gdG9TcGFuVHJlZShzcGFucykge1xuICBpZiAoc3BhbnMubGVuZ3RoID09IDApIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBjb25zdCB0cmVlID0gW3NwYW5zWzBdXTtcbiAgbGV0IGxhc3QgPSBzcGFuc1swXTtcbiAgZm9yIChsZXQgaSA9IDE7IGkgPCBzcGFucy5sZW5ndGg7IGkrKykge1xuICAgIC8vIEtlZXAgc3BhbnMgd2hpY2ggc3RhcnQgYWZ0ZXIgdGhlIGVuZCBvZiB0aGUgcHJldmlvdXMgc3BhbiBvciB0aG9zZSB3aGljaFxuICAgIC8vIGFyZSBjb21wbGV0ZSB3aXRoaW4gdGhlIHByZXZpb3VzIHNwYW4uXG4gICAgaWYgKHNwYW5zW2ldLmF0ID4gbGFzdC5lbmQpIHtcbiAgICAgIC8vIFNwYW4gaXMgY29tcGxldGVseSBvdXRzaWRlIG9mIHRoZSBwcmV2aW91cyBzcGFuLlxuICAgICAgdHJlZS5wdXNoKHNwYW5zW2ldKTtcbiAgICAgIGxhc3QgPSBzcGFuc1tpXTtcbiAgICB9IGVsc2UgaWYgKHNwYW5zW2ldLmVuZCA8PSBsYXN0LmVuZCkge1xuICAgICAgLy8gU3BhbiBpcyBmdWxseSBpbnNpZGUgb2YgdGhlIHByZXZpb3VzIHNwYW4uIFB1c2ggdG8gc3Vibm9kZS5cbiAgICAgIGxhc3QuY2hpbGRyZW4ucHVzaChzcGFuc1tpXSk7XG4gICAgfVxuICAgIC8vIFNwYW4gY291bGQgcGFydGlhbGx5IG92ZXJsYXAsIGlnbm9yaW5nIGl0IGFzIGludmFsaWQuXG4gIH1cblxuICAvLyBSZWN1cnNpdmVseSByZWFycmFuZ2UgdGhlIHN1Ym5vZGVzLlxuICBmb3IgKGxldCBpIGluIHRyZWUpIHtcbiAgICB0cmVlW2ldLmNoaWxkcmVuID0gdG9TcGFuVHJlZSh0cmVlW2ldLmNoaWxkcmVuKTtcbiAgfVxuXG4gIHJldHVybiB0cmVlO1xufVxuXG4vLyBDb252ZXJ0IGRyYWZ0eSBkb2N1bWVudCB0byBhIHRyZWUuXG5mdW5jdGlvbiBkcmFmdHlUb1RyZWUoZG9jKSB7XG4gIGlmICghZG9jKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBkb2MgPSAodHlwZW9mIGRvYyA9PSAnc3RyaW5nJykgPyB7XG4gICAgdHh0OiBkb2NcbiAgfSA6IGRvYztcbiAgbGV0IHtcbiAgICB0eHQsXG4gICAgZm10LFxuICAgIGVudFxuICB9ID0gZG9jO1xuXG4gIHR4dCA9IHR4dCB8fCAnJztcbiAgaWYgKCFBcnJheS5pc0FycmF5KGVudCkpIHtcbiAgICBlbnQgPSBbXTtcbiAgfVxuXG4gIGlmICghQXJyYXkuaXNBcnJheShmbXQpIHx8IGZtdC5sZW5ndGggPT0gMCkge1xuICAgIGlmIChlbnQubGVuZ3RoID09IDApIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHRleHQ6IHR4dFxuICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBIYW5kbGUgc3BlY2lhbCBjYXNlIHdoZW4gYWxsIHZhbHVlcyBpbiBmbXQgYXJlIDAgYW5kIGZtdCB0aGVyZWZvcmUgaXMgc2tpcHBlZC5cbiAgICBmbXQgPSBbe1xuICAgICAgYXQ6IDAsXG4gICAgICBsZW46IDAsXG4gICAgICBrZXk6IDBcbiAgICB9XTtcbiAgfVxuXG4gIC8vIFNhbml0aXplIHNwYW5zLlxuICBjb25zdCBzcGFucyA9IFtdO1xuICBjb25zdCBhdHRhY2htZW50cyA9IFtdO1xuICBmbXQuZm9yRWFjaCgoc3BhbikgPT4ge1xuICAgIGlmICghc3BhbiB8fCB0eXBlb2Ygc3BhbiAhPSAnb2JqZWN0Jykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghWyd1bmRlZmluZWQnLCAnbnVtYmVyJ10uaW5jbHVkZXModHlwZW9mIHNwYW4uYXQpKSB7XG4gICAgICAvLyBQcmVzZW50LCBidXQgbm9uLW51bWVyaWMgJ2F0Jy5cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFbJ3VuZGVmaW5lZCcsICdudW1iZXInXS5pbmNsdWRlcyh0eXBlb2Ygc3Bhbi5sZW4pKSB7XG4gICAgICAvLyBQcmVzZW50LCBidXQgbm9uLW51bWVyaWMgJ2xlbicuXG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGxldCBhdCA9IHNwYW4uYXQgfCAwO1xuICAgIGxldCBsZW4gPSBzcGFuLmxlbiB8IDA7XG4gICAgaWYgKGxlbiA8IDApIHtcbiAgICAgIC8vIEludmFsaWQgc3BhbiBsZW5ndGguXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IGtleSA9IHNwYW4ua2V5IHx8IDA7XG4gICAgaWYgKGVudC5sZW5ndGggPiAwICYmICh0eXBlb2Yga2V5ICE9ICdudW1iZXInIHx8IGtleSA8IDAgfHwga2V5ID49IGVudC5sZW5ndGgpKSB7XG4gICAgICAvLyBJbnZhbGlkIGtleSB2YWx1ZS5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoYXQgPD0gLTEpIHtcbiAgICAgIC8vIEF0dGFjaG1lbnQuIFN0b3JlIGF0dGFjaG1lbnRzIHNlcGFyYXRlbHkuXG4gICAgICBhdHRhY2htZW50cy5wdXNoKHtcbiAgICAgICAgc3RhcnQ6IC0xLFxuICAgICAgICBlbmQ6IDAsXG4gICAgICAgIGtleToga2V5XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9IGVsc2UgaWYgKGF0ICsgbGVuID4gdHh0Lmxlbmd0aCkge1xuICAgICAgLy8gU3BhbiBpcyBvdXQgb2YgYm91bmRzLlxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghc3Bhbi50cCkge1xuICAgICAgaWYgKGVudC5sZW5ndGggPiAwICYmICh0eXBlb2YgZW50W2tleV0gPT0gJ29iamVjdCcpKSB7XG4gICAgICAgIHNwYW5zLnB1c2goe1xuICAgICAgICAgIHN0YXJ0OiBhdCxcbiAgICAgICAgICBlbmQ6IGF0ICsgbGVuLFxuICAgICAgICAgIGtleToga2V5XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzcGFucy5wdXNoKHtcbiAgICAgICAgdHlwZTogc3Bhbi50cCxcbiAgICAgICAgc3RhcnQ6IGF0LFxuICAgICAgICBlbmQ6IGF0ICsgbGVuXG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vIFNvcnQgc3BhbnMgZmlyc3QgYnkgc3RhcnQgaW5kZXggKGFzYykgdGhlbiBieSBsZW5ndGggKGRlc2MpLCB0aGVuIGJ5IHdlaWdodC5cbiAgc3BhbnMuc29ydCgoYSwgYikgPT4ge1xuICAgIGxldCBkaWZmID0gYS5zdGFydCAtIGIuc3RhcnQ7XG4gICAgaWYgKGRpZmYgIT0gMCkge1xuICAgICAgcmV0dXJuIGRpZmY7XG4gICAgfVxuICAgIGRpZmYgPSBiLmVuZCAtIGEuZW5kO1xuICAgIGlmIChkaWZmICE9IDApIHtcbiAgICAgIHJldHVybiBkaWZmO1xuICAgIH1cbiAgICByZXR1cm4gRk1UX1dFSUdIVC5pbmRleE9mKGIudHlwZSkgLSBGTVRfV0VJR0hULmluZGV4T2YoYS50eXBlKTtcbiAgfSk7XG5cbiAgLy8gTW92ZSBhdHRhY2htZW50cyB0byB0aGUgZW5kIG9mIHRoZSBsaXN0LlxuICBpZiAoYXR0YWNobWVudHMubGVuZ3RoID4gMCkge1xuICAgIHNwYW5zLnB1c2goLi4uYXR0YWNobWVudHMpO1xuICB9XG5cbiAgc3BhbnMuZm9yRWFjaCgoc3BhbikgPT4ge1xuICAgIGlmIChlbnQubGVuZ3RoID4gMCAmJiAhc3Bhbi50eXBlICYmIGVudFtzcGFuLmtleV0gJiYgdHlwZW9mIGVudFtzcGFuLmtleV0gPT0gJ29iamVjdCcpIHtcbiAgICAgIHNwYW4udHlwZSA9IGVudFtzcGFuLmtleV0udHA7XG4gICAgICBzcGFuLmRhdGEgPSBlbnRbc3Bhbi5rZXldLmRhdGE7XG4gICAgfVxuXG4gICAgLy8gSXMgdHlwZSBzdGlsbCB1bmRlZmluZWQ/IEhpZGUgdGhlIGludmFsaWQgZWxlbWVudCFcbiAgICBpZiAoIXNwYW4udHlwZSkge1xuICAgICAgc3Bhbi50eXBlID0gJ0hEJztcbiAgICB9XG4gIH0pO1xuXG4gIGxldCB0cmVlID0gc3BhbnNUb1RyZWUoe30sIHR4dCwgMCwgdHh0Lmxlbmd0aCwgc3BhbnMpO1xuXG4gIC8vIEZsYXR0ZW4gdHJlZSBub2Rlcy5cbiAgY29uc3QgZmxhdHRlbiA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShub2RlLmNoaWxkcmVuKSAmJiBub2RlLmNoaWxkcmVuLmxlbmd0aCA9PSAxKSB7XG4gICAgICAvLyBVbndyYXAuXG4gICAgICBjb25zdCBjaGlsZCA9IG5vZGUuY2hpbGRyZW5bMF07XG4gICAgICBpZiAoIW5vZGUudHlwZSkge1xuICAgICAgICBjb25zdCBwYXJlbnQgPSBub2RlLnBhcmVudDtcbiAgICAgICAgbm9kZSA9IGNoaWxkO1xuICAgICAgICBub2RlLnBhcmVudCA9IHBhcmVudDtcbiAgICAgIH0gZWxzZSBpZiAoIWNoaWxkLnR5cGUgJiYgIWNoaWxkLmNoaWxkcmVuKSB7XG4gICAgICAgIG5vZGUudGV4dCA9IGNoaWxkLnRleHQ7XG4gICAgICAgIGRlbGV0ZSBub2RlLmNoaWxkcmVuO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuICB0cmVlID0gdHJlZVRvcERvd24odHJlZSwgZmxhdHRlbik7XG5cbiAgcmV0dXJuIHRyZWU7XG59XG5cbi8vIEFkZCB0cmVlIG5vZGUgdG8gYSBwYXJlbnQgdHJlZS5cbmZ1bmN0aW9uIGFkZE5vZGUocGFyZW50LCBuKSB7XG4gIGlmICghbikge1xuICAgIHJldHVybiBwYXJlbnQ7XG4gIH1cblxuICBpZiAoIXBhcmVudC5jaGlsZHJlbikge1xuICAgIHBhcmVudC5jaGlsZHJlbiA9IFtdO1xuICB9XG5cbiAgLy8gSWYgdGV4dCBpcyBwcmVzZW50LCBtb3ZlIGl0IHRvIGEgc3Vibm9kZS5cbiAgaWYgKHBhcmVudC50ZXh0KSB7XG4gICAgcGFyZW50LmNoaWxkcmVuLnB1c2goe1xuICAgICAgdGV4dDogcGFyZW50LnRleHQsXG4gICAgICBwYXJlbnQ6IHBhcmVudFxuICAgIH0pO1xuICAgIGRlbGV0ZSBwYXJlbnQudGV4dDtcbiAgfVxuXG4gIG4ucGFyZW50ID0gcGFyZW50O1xuICBwYXJlbnQuY2hpbGRyZW4ucHVzaChuKTtcblxuICByZXR1cm4gcGFyZW50O1xufVxuXG4vLyBSZXR1cm5zIGEgdHJlZSBvZiBub2Rlcy5cbmZ1bmN0aW9uIHNwYW5zVG9UcmVlKHBhcmVudCwgdGV4dCwgc3RhcnQsIGVuZCwgc3BhbnMpIHtcbiAgaWYgKCFzcGFucyB8fCBzcGFucy5sZW5ndGggPT0gMCkge1xuICAgIGlmIChzdGFydCA8IGVuZCkge1xuICAgICAgYWRkTm9kZShwYXJlbnQsIHtcbiAgICAgICAgdGV4dDogdGV4dC5zdWJzdHJpbmcoc3RhcnQsIGVuZClcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gcGFyZW50O1xuICB9XG5cbiAgLy8gUHJvY2VzcyBzdWJzcGFucy5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzcGFucy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHNwYW4gPSBzcGFuc1tpXTtcbiAgICBpZiAoc3Bhbi5zdGFydCA8IDAgJiYgc3Bhbi50eXBlID09ICdFWCcpIHtcbiAgICAgIGFkZE5vZGUocGFyZW50LCB7XG4gICAgICAgIHR5cGU6IHNwYW4udHlwZSxcbiAgICAgICAgZGF0YTogc3Bhbi5kYXRhLFxuICAgICAgICBrZXk6IHNwYW4ua2V5LFxuICAgICAgICBhdHQ6IHRydWVcbiAgICAgIH0pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gQWRkIHVuLXN0eWxlZCByYW5nZSBiZWZvcmUgdGhlIHN0eWxlZCBzcGFuIHN0YXJ0cy5cbiAgICBpZiAoc3RhcnQgPCBzcGFuLnN0YXJ0KSB7XG4gICAgICBhZGROb2RlKHBhcmVudCwge1xuICAgICAgICB0ZXh0OiB0ZXh0LnN1YnN0cmluZyhzdGFydCwgc3Bhbi5zdGFydClcbiAgICAgIH0pO1xuICAgICAgc3RhcnQgPSBzcGFuLnN0YXJ0O1xuICAgIH1cblxuICAgIC8vIEdldCBhbGwgc3BhbnMgd2hpY2ggYXJlIHdpdGhpbiB0aGUgY3VycmVudCBzcGFuLlxuICAgIGNvbnN0IHN1YnNwYW5zID0gW107XG4gICAgd2hpbGUgKGkgPCBzcGFucy5sZW5ndGggLSAxKSB7XG4gICAgICBjb25zdCBpbm5lciA9IHNwYW5zW2kgKyAxXTtcbiAgICAgIGlmIChpbm5lci5zdGFydCA8IDApIHtcbiAgICAgICAgLy8gQXR0YWNobWVudHMgYXJlIGluIHRoZSBlbmQuIFN0b3AuXG4gICAgICAgIGJyZWFrO1xuICAgICAgfSBlbHNlIGlmIChpbm5lci5zdGFydCA8IHNwYW4uZW5kKSB7XG4gICAgICAgIGlmIChpbm5lci5lbmQgPD0gc3Bhbi5lbmQpIHtcbiAgICAgICAgICBjb25zdCB0YWcgPSBGT1JNQVRfVEFHU1tpbm5lci50cF0gfHwge307XG4gICAgICAgICAgaWYgKGlubmVyLnN0YXJ0IDwgaW5uZXIuZW5kIHx8IHRhZy5pc1ZvaWQpIHtcbiAgICAgICAgICAgIC8vIFZhbGlkIHN1YnNwYW46IGNvbXBsZXRlbHkgd2l0aGluIHRoZSBjdXJyZW50IHNwYW4gYW5kXG4gICAgICAgICAgICAvLyBlaXRoZXIgbm9uLXplcm8gbGVuZ3RoIG9yIHplcm8gbGVuZ3RoIGlzIGFjY2VwdGFibGUuXG4gICAgICAgICAgICBzdWJzcGFucy5wdXNoKGlubmVyKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaSsrO1xuICAgICAgICAvLyBPdmVybGFwcGluZyBzdWJzcGFucyBhcmUgaWdub3JlZC5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFBhc3QgdGhlIGVuZCBvZiB0aGUgY3VycmVudCBzcGFuLiBTdG9wLlxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBhZGROb2RlKHBhcmVudCwgc3BhbnNUb1RyZWUoe1xuICAgICAgdHlwZTogc3Bhbi50eXBlLFxuICAgICAgZGF0YTogc3Bhbi5kYXRhLFxuICAgICAga2V5OiBzcGFuLmtleVxuICAgIH0sIHRleHQsIHN0YXJ0LCBzcGFuLmVuZCwgc3Vic3BhbnMpKTtcbiAgICBzdGFydCA9IHNwYW4uZW5kO1xuICB9XG5cbiAgLy8gQWRkIHRoZSBsYXN0IHVuZm9ybWF0dGVkIHJhbmdlLlxuICBpZiAoc3RhcnQgPCBlbmQpIHtcbiAgICBhZGROb2RlKHBhcmVudCwge1xuICAgICAgdGV4dDogdGV4dC5zdWJzdHJpbmcoc3RhcnQsIGVuZClcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBwYXJlbnQ7XG59XG5cbi8vIEFwcGVuZCBhIHRyZWUgdG8gYSBEcmFmdHkgZG9jLlxuZnVuY3Rpb24gdHJlZVRvRHJhZnR5KGRvYywgdHJlZSwga2V5bWFwKSB7XG4gIGlmICghdHJlZSkge1xuICAgIHJldHVybiBkb2M7XG4gIH1cblxuICBkb2MudHh0ID0gZG9jLnR4dCB8fCAnJztcblxuICAvLyBDaGVja3BvaW50IHRvIG1lYXN1cmUgbGVuZ3RoIG9mIHRoZSBjdXJyZW50IHRyZWUgbm9kZS5cbiAgY29uc3Qgc3RhcnQgPSBkb2MudHh0Lmxlbmd0aDtcblxuICBpZiAodHJlZS50ZXh0KSB7XG4gICAgZG9jLnR4dCArPSB0cmVlLnRleHQ7XG4gIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheSh0cmVlLmNoaWxkcmVuKSkge1xuICAgIHRyZWUuY2hpbGRyZW4uZm9yRWFjaCgoYykgPT4ge1xuICAgICAgdHJlZVRvRHJhZnR5KGRvYywgYywga2V5bWFwKTtcbiAgICB9KTtcbiAgfVxuXG4gIGlmICh0cmVlLnR5cGUpIHtcbiAgICBjb25zdCBsZW4gPSBkb2MudHh0Lmxlbmd0aCAtIHN0YXJ0O1xuICAgIGRvYy5mbXQgPSBkb2MuZm10IHx8IFtdO1xuICAgIGlmIChPYmplY3Qua2V5cyh0cmVlLmRhdGEgfHwge30pLmxlbmd0aCA+IDApIHtcbiAgICAgIGRvYy5lbnQgPSBkb2MuZW50IHx8IFtdO1xuICAgICAgY29uc3QgbmV3S2V5ID0gKHR5cGVvZiBrZXltYXBbdHJlZS5rZXldID09ICd1bmRlZmluZWQnKSA/IGRvYy5lbnQubGVuZ3RoIDoga2V5bWFwW3RyZWUua2V5XTtcbiAgICAgIGtleW1hcFt0cmVlLmtleV0gPSBuZXdLZXk7XG4gICAgICBkb2MuZW50W25ld0tleV0gPSB7XG4gICAgICAgIHRwOiB0cmVlLnR5cGUsXG4gICAgICAgIGRhdGE6IHRyZWUuZGF0YVxuICAgICAgfTtcbiAgICAgIGlmICh0cmVlLmF0dCkge1xuICAgICAgICAvLyBBdHRhY2htZW50LlxuICAgICAgICBkb2MuZm10LnB1c2goe1xuICAgICAgICAgIGF0OiAtMSxcbiAgICAgICAgICBsZW46IDAsXG4gICAgICAgICAga2V5OiBuZXdLZXlcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkb2MuZm10LnB1c2goe1xuICAgICAgICAgIGF0OiBzdGFydCxcbiAgICAgICAgICBsZW46IGxlbixcbiAgICAgICAgICBrZXk6IG5ld0tleVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZG9jLmZtdC5wdXNoKHtcbiAgICAgICAgdHA6IHRyZWUudHlwZSxcbiAgICAgICAgYXQ6IHN0YXJ0LFxuICAgICAgICBsZW46IGxlblxuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBkb2M7XG59XG5cbi8vIFRyYXZlcnNlIHRoZSB0cmVlIHRvcCBkb3duIHRyYW5zZm9ybWluZyB0aGUgbm9kZXM6IGFwcGx5IHRyYW5zZm9ybWVyIHRvIGV2ZXJ5IHRyZWUgbm9kZS5cbmZ1bmN0aW9uIHRyZWVUb3BEb3duKHNyYywgdHJhbnNmb3JtZXIsIGNvbnRleHQpIHtcbiAgaWYgKCFzcmMpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGxldCBkc3QgPSB0cmFuc2Zvcm1lci5jYWxsKGNvbnRleHQsIHNyYyk7XG4gIGlmICghZHN0IHx8ICFkc3QuY2hpbGRyZW4pIHtcbiAgICByZXR1cm4gZHN0O1xuICB9XG5cbiAgY29uc3QgY2hpbGRyZW4gPSBbXTtcbiAgZm9yIChsZXQgaSBpbiBkc3QuY2hpbGRyZW4pIHtcbiAgICBsZXQgbiA9IGRzdC5jaGlsZHJlbltpXTtcbiAgICBpZiAobikge1xuICAgICAgbiA9IHRyZWVUb3BEb3duKG4sIHRyYW5zZm9ybWVyLCBjb250ZXh0KTtcbiAgICAgIGlmIChuKSB7XG4gICAgICAgIGNoaWxkcmVuLnB1c2gobik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaWYgKGNoaWxkcmVuLmxlbmd0aCA9PSAwKSB7XG4gICAgZHN0LmNoaWxkcmVuID0gbnVsbDtcbiAgfSBlbHNlIHtcbiAgICBkc3QuY2hpbGRyZW4gPSBjaGlsZHJlbjtcbiAgfVxuXG4gIHJldHVybiBkc3Q7XG59XG5cbi8vIFRyYXZlcnNlIHRoZSB0cmVlIGJvdHRvbS11cDogYXBwbHkgZm9ybWF0dGVyIHRvIGV2ZXJ5IG5vZGUuXG4vLyBUaGUgZm9ybWF0dGVyIG11c3QgbWFpbnRhaW4gaXRzIHN0YXRlIHRocm91Z2ggY29udGV4dC5cbmZ1bmN0aW9uIHRyZWVCb3R0b21VcChzcmMsIGZvcm1hdHRlciwgaW5kZXgsIHN0YWNrLCBjb250ZXh0KSB7XG4gIGlmICghc3JjKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBpZiAoc3RhY2sgJiYgc3JjLnR5cGUpIHtcbiAgICBzdGFjay5wdXNoKHNyYy50eXBlKTtcbiAgfVxuXG4gIGxldCB2YWx1ZXMgPSBbXTtcbiAgZm9yIChsZXQgaSBpbiBzcmMuY2hpbGRyZW4pIHtcbiAgICBjb25zdCBuID0gdHJlZUJvdHRvbVVwKHNyYy5jaGlsZHJlbltpXSwgZm9ybWF0dGVyLCBpLCBzdGFjaywgY29udGV4dCk7XG4gICAgaWYgKG4pIHtcbiAgICAgIHZhbHVlcy5wdXNoKG4pO1xuICAgIH1cbiAgfVxuICBpZiAodmFsdWVzLmxlbmd0aCA9PSAwKSB7XG4gICAgaWYgKHNyYy50ZXh0KSB7XG4gICAgICB2YWx1ZXMgPSBbc3JjLnRleHRdO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZXMgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGlmIChzdGFjayAmJiBzcmMudHlwZSkge1xuICAgIHN0YWNrLnBvcCgpO1xuICB9XG5cbiAgcmV0dXJuIGZvcm1hdHRlci5jYWxsKGNvbnRleHQsIHNyYy50eXBlLCBzcmMuZGF0YSwgdmFsdWVzLCBpbmRleCwgc3RhY2spO1xufVxuXG4vLyBDbGlwIHRyZWUgdG8gdGhlIHByb3ZpZGVkIGxpbWl0LlxuZnVuY3Rpb24gc2hvcnRlblRyZWUodHJlZSwgbGltaXQsIHRhaWwpIHtcbiAgaWYgKCF0cmVlKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBpZiAodGFpbCkge1xuICAgIGxpbWl0IC09IHRhaWwubGVuZ3RoO1xuICB9XG5cbiAgY29uc3Qgc2hvcnRlbmVyID0gZnVuY3Rpb24obm9kZSkge1xuICAgIGlmIChsaW1pdCA8PSAtMSkge1xuICAgICAgLy8gTGltaXQgLTEgbWVhbnMgdGhlIGRvYyB3YXMgYWxyZWFkeSBjbGlwcGVkLlxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgaWYgKG5vZGUuYXR0KSB7XG4gICAgICAvLyBBdHRhY2htZW50cyBhcmUgdW5jaGFuZ2VkLlxuICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfVxuICAgIGlmIChsaW1pdCA9PSAwKSB7XG4gICAgICBub2RlLnRleHQgPSB0YWlsO1xuICAgICAgbGltaXQgPSAtMTtcbiAgICB9IGVsc2UgaWYgKG5vZGUudGV4dCkge1xuICAgICAgY29uc3QgbGVuID0gbm9kZS50ZXh0Lmxlbmd0aDtcbiAgICAgIGlmIChsZW4gPiBsaW1pdCkge1xuICAgICAgICBub2RlLnRleHQgPSBub2RlLnRleHQuc3Vic3RyaW5nKDAsIGxpbWl0KSArIHRhaWw7XG4gICAgICAgIGxpbWl0ID0gLTE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsaW1pdCAtPSBsZW47XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBub2RlO1xuICB9XG5cbiAgcmV0dXJuIHRyZWVUb3BEb3duKHRyZWUsIHNob3J0ZW5lcik7XG59XG5cbi8vIFN0cmlwIGhlYXZ5IGVudGl0aWVzIGZyb20gYSB0cmVlLlxuZnVuY3Rpb24gbGlnaHRFbnRpdHkodHJlZSwgYWxsb3cpIHtcbiAgY29uc3QgbGlnaHRDb3B5ID0gKG5vZGUpID0+IHtcbiAgICBjb25zdCBkYXRhID0gY29weUVudERhdGEobm9kZS5kYXRhLCB0cnVlLCBhbGxvdyA/IGFsbG93KG5vZGUpIDogbnVsbCk7XG4gICAgaWYgKGRhdGEpIHtcbiAgICAgIG5vZGUuZGF0YSA9IGRhdGE7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlbGV0ZSBub2RlLmRhdGE7XG4gICAgfVxuICAgIHJldHVybiBub2RlO1xuICB9XG4gIHJldHVybiB0cmVlVG9wRG93bih0cmVlLCBsaWdodENvcHkpO1xufVxuXG4vLyBSZW1vdmUgc3BhY2VzIGFuZCBicmVha3Mgb24gdGhlIGxlZnQuXG5mdW5jdGlvbiBsVHJpbSh0cmVlKSB7XG4gIGlmICh0cmVlLnR5cGUgPT0gJ0JSJykge1xuICAgIHRyZWUgPSBudWxsO1xuICB9IGVsc2UgaWYgKHRyZWUudGV4dCkge1xuICAgIGlmICghdHJlZS50eXBlKSB7XG4gICAgICB0cmVlLnRleHQgPSB0cmVlLnRleHQudHJpbVN0YXJ0KCk7XG4gICAgICBpZiAoIXRyZWUudGV4dCkge1xuICAgICAgICB0cmVlID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSBpZiAoIXRyZWUudHlwZSAmJiB0cmVlLmNoaWxkcmVuICYmIHRyZWUuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgIGNvbnN0IGMgPSBsVHJpbSh0cmVlLmNoaWxkcmVuWzBdKTtcbiAgICBpZiAoYykge1xuICAgICAgdHJlZS5jaGlsZHJlblswXSA9IGM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRyZWUuY2hpbGRyZW4uc2hpZnQoKTtcbiAgICAgIGlmICghdHJlZS50eXBlICYmIHRyZWUuY2hpbGRyZW4ubGVuZ3RoID09IDApIHtcbiAgICAgICAgdHJlZSA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiB0cmVlO1xufVxuXG4vLyBNb3ZlIGF0dGFjaG1lbnRzIHRvIHRoZSBlbmQuIEF0dGFjaG1lbnRzIG11c3QgYmUgYXQgdGhlIHRvcCBsZXZlbCwgbm8gbmVlZCB0byB0cmF2ZXJzZSB0aGUgdHJlZS5cbmZ1bmN0aW9uIGF0dGFjaG1lbnRzVG9FbmQodHJlZSwgbGltaXQpIHtcbiAgaWYgKCF0cmVlKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBpZiAodHJlZS5hdHQpIHtcbiAgICB0cmVlLnRleHQgPSAnICc7XG4gICAgZGVsZXRlIHRyZWUuYXR0O1xuICAgIGRlbGV0ZSB0cmVlLmNoaWxkcmVuO1xuICB9IGVsc2UgaWYgKHRyZWUuY2hpbGRyZW4pIHtcbiAgICBjb25zdCBhdHRhY2htZW50cyA9IFtdO1xuICAgIGNvbnN0IGNoaWxkcmVuID0gW107XG4gICAgZm9yIChsZXQgaSBpbiB0cmVlLmNoaWxkcmVuKSB7XG4gICAgICBjb25zdCBjID0gdHJlZS5jaGlsZHJlbltpXTtcbiAgICAgIGlmIChjLmF0dCkge1xuICAgICAgICBpZiAoYXR0YWNobWVudHMubGVuZ3RoID09IGxpbWl0KSB7XG4gICAgICAgICAgLy8gVG9vIG1hbnkgYXR0YWNobWVudHMgdG8gcHJldmlldztcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYy5kYXRhWydtaW1lJ10gPT0gSlNPTl9NSU1FX1RZUEUpIHtcbiAgICAgICAgICAvLyBKU09OIGF0dGFjaG1lbnRzIGFyZSBub3Qgc2hvd24gaW4gcHJldmlldy5cbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRlbGV0ZSBjLmF0dDtcbiAgICAgICAgZGVsZXRlIGMuY2hpbGRyZW47XG4gICAgICAgIGMudGV4dCA9ICcgJztcbiAgICAgICAgYXR0YWNobWVudHMucHVzaChjKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNoaWxkcmVuLnB1c2goYyk7XG4gICAgICB9XG4gICAgfVxuICAgIHRyZWUuY2hpbGRyZW4gPSBjaGlsZHJlbi5jb25jYXQoYXR0YWNobWVudHMpO1xuICB9XG4gIHJldHVybiB0cmVlO1xufVxuXG4vLyBHZXQgYSBsaXN0IG9mIGVudGl0aWVzIGZyb20gYSB0ZXh0LlxuZnVuY3Rpb24gZXh0cmFjdEVudGl0aWVzKGxpbmUpIHtcbiAgbGV0IG1hdGNoO1xuICBsZXQgZXh0cmFjdGVkID0gW107XG4gIEVOVElUWV9UWVBFUy5mb3JFYWNoKChlbnRpdHkpID0+IHtcbiAgICB3aGlsZSAoKG1hdGNoID0gZW50aXR5LnJlLmV4ZWMobGluZSkpICE9PSBudWxsKSB7XG4gICAgICBleHRyYWN0ZWQucHVzaCh7XG4gICAgICAgIG9mZnNldDogbWF0Y2hbJ2luZGV4J10sXG4gICAgICAgIGxlbjogbWF0Y2hbMF0ubGVuZ3RoLFxuICAgICAgICB1bmlxdWU6IG1hdGNoWzBdLFxuICAgICAgICBkYXRhOiBlbnRpdHkucGFjayhtYXRjaFswXSksXG4gICAgICAgIHR5cGU6IGVudGl0eS5uYW1lXG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuXG4gIGlmIChleHRyYWN0ZWQubGVuZ3RoID09IDApIHtcbiAgICByZXR1cm4gZXh0cmFjdGVkO1xuICB9XG5cbiAgLy8gUmVtb3ZlIGVudGl0aWVzIGRldGVjdGVkIGluc2lkZSBvdGhlciBlbnRpdGllcywgbGlrZSAjaGFzaHRhZyBpbiBhIFVSTC5cbiAgZXh0cmFjdGVkLnNvcnQoKGEsIGIpID0+IHtcbiAgICByZXR1cm4gYS5vZmZzZXQgLSBiLm9mZnNldDtcbiAgfSk7XG5cbiAgbGV0IGlkeCA9IC0xO1xuICBleHRyYWN0ZWQgPSBleHRyYWN0ZWQuZmlsdGVyKChlbCkgPT4ge1xuICAgIGNvbnN0IHJlc3VsdCA9IChlbC5vZmZzZXQgPiBpZHgpO1xuICAgIGlkeCA9IGVsLm9mZnNldCArIGVsLmxlbjtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9KTtcblxuICByZXR1cm4gZXh0cmFjdGVkO1xufVxuXG4vLyBDb252ZXJ0IHRoZSBjaHVua3MgaW50byBmb3JtYXQgc3VpdGFibGUgZm9yIHNlcmlhbGl6YXRpb24uXG5mdW5jdGlvbiBkcmFmdGlmeShjaHVua3MsIHN0YXJ0QXQpIHtcbiAgbGV0IHBsYWluID0gJyc7XG4gIGxldCByYW5nZXMgPSBbXTtcbiAgZm9yIChsZXQgaSBpbiBjaHVua3MpIHtcbiAgICBjb25zdCBjaHVuayA9IGNodW5rc1tpXTtcbiAgICBpZiAoIWNodW5rLnR4dCkge1xuICAgICAgY29uc3QgZHJhZnR5ID0gZHJhZnRpZnkoY2h1bmsuY2hpbGRyZW4sIHBsYWluLmxlbmd0aCArIHN0YXJ0QXQpO1xuICAgICAgY2h1bmsudHh0ID0gZHJhZnR5LnR4dDtcbiAgICAgIHJhbmdlcyA9IHJhbmdlcy5jb25jYXQoZHJhZnR5LmZtdCk7XG4gICAgfVxuXG4gICAgaWYgKGNodW5rLnRwKSB7XG4gICAgICByYW5nZXMucHVzaCh7XG4gICAgICAgIGF0OiBwbGFpbi5sZW5ndGggKyBzdGFydEF0LFxuICAgICAgICBsZW46IGNodW5rLnR4dC5sZW5ndGgsXG4gICAgICAgIHRwOiBjaHVuay50cFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcGxhaW4gKz0gY2h1bmsudHh0O1xuICB9XG4gIHJldHVybiB7XG4gICAgdHh0OiBwbGFpbixcbiAgICBmbXQ6IHJhbmdlc1xuICB9O1xufVxuXG4vLyBDcmVhdGUgYSBjb3B5IG9mIGVudGl0eSBkYXRhIHdpdGggKGxpZ2h0PWZhbHNlKSBvciB3aXRob3V0IChsaWdodD10cnVlKSB0aGUgbGFyZ2UgcGF5bG9hZC5cbi8vIFRoZSBhcnJheSAnYWxsb3cnIGNvbnRhaW5zIGEgbGlzdCBvZiBmaWVsZHMgZXhlbXB0IGZyb20gc3RyaXBwaW5nLlxuZnVuY3Rpb24gY29weUVudERhdGEoZGF0YSwgbGlnaHQsIGFsbG93KSB7XG4gIGlmIChkYXRhICYmIE9iamVjdC5lbnRyaWVzKGRhdGEpLmxlbmd0aCA+IDApIHtcbiAgICBhbGxvdyA9IGFsbG93IHx8IFtdO1xuICAgIGNvbnN0IGRjID0ge307XG4gICAgQUxMT1dFRF9FTlRfRklFTERTLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgaWYgKGRhdGFba2V5XSkge1xuICAgICAgICBpZiAobGlnaHQgJiYgIWFsbG93LmluY2x1ZGVzKGtleSkgJiZcbiAgICAgICAgICAodHlwZW9mIGRhdGFba2V5XSA9PSAnc3RyaW5nJyB8fCBBcnJheS5pc0FycmF5KGRhdGFba2V5XSkpICYmXG4gICAgICAgICAgZGF0YVtrZXldLmxlbmd0aCA+IE1BWF9QUkVWSUVXX0RBVEFfU0laRSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGRhdGFba2V5XSA9PSAnb2JqZWN0Jykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBkY1trZXldID0gZGF0YVtrZXldO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKE9iamVjdC5lbnRyaWVzKGRjKS5sZW5ndGggIT0gMCkge1xuICAgICAgcmV0dXJuIGRjO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuaWYgKHR5cGVvZiBtb2R1bGUgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBEcmFmdHk7XG59XG4iLCIvKipcbiAqIEBmaWxlIFV0aWxpdGllcyBmb3IgdXBsb2FkaW5nIGFuZCBkb3dubG9hZGluZyBmaWxlcy5cbiAqXG4gKiBAY29weXJpZ2h0IDIwMTUtMjAyMiBUaW5vZGUgTExDLlxuICovXG4ndXNlIHN0cmljdCc7XG5cbmltcG9ydCB7XG4gIGlzVXJsUmVsYXRpdmUsXG4gIGpzb25QYXJzZUhlbHBlclxufSBmcm9tICcuL3V0aWxzLmpzJztcblxubGV0IFhIUlByb3ZpZGVyO1xuXG4vKipcbiAqIEBjbGFzcyBMYXJnZUZpbGVIZWxwZXIgLSB1dGlsaXRpZXMgZm9yIHVwbG9hZGluZyBhbmQgZG93bmxvYWRpbmcgZmlsZXMgb3V0IG9mIGJhbmQuXG4gKiBEb24ndCBpbnN0YW50aWF0ZSB0aGlzIGNsYXNzIGRpcmVjdGx5LiBVc2Uge1Rpbm9kZS5nZXRMYXJnZUZpbGVIZWxwZXJ9IGluc3RlYWQuXG4gKiBAbWVtYmVyb2YgVGlub2RlXG4gKlxuICogQHBhcmFtIHtUaW5vZGV9IHRpbm9kZSAtIHRoZSBtYWluIFRpbm9kZSBvYmplY3QuXG4gKiBAcGFyYW0ge3N0cmluZ30gdmVyc2lvbiAtIHByb3RvY29sIHZlcnNpb24sIGkuZS4gJzAnLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMYXJnZUZpbGVIZWxwZXIge1xuICBjb25zdHJ1Y3Rvcih0aW5vZGUsIHZlcnNpb24pIHtcbiAgICB0aGlzLl90aW5vZGUgPSB0aW5vZGU7XG4gICAgdGhpcy5fdmVyc2lvbiA9IHZlcnNpb247XG5cbiAgICB0aGlzLl9hcGlLZXkgPSB0aW5vZGUuX2FwaUtleTtcbiAgICB0aGlzLl9hdXRoVG9rZW4gPSB0aW5vZGUuZ2V0QXV0aFRva2VuKCk7XG4gICAgdGhpcy5fcmVxSWQgPSB0aW5vZGUuZ2V0TmV4dFVuaXF1ZUlkKCk7XG4gICAgdGhpcy54aHIgPSBuZXcgWEhSUHJvdmlkZXIoKTtcblxuICAgIC8vIFByb21pc2VcbiAgICB0aGlzLnRvUmVzb2x2ZSA9IG51bGw7XG4gICAgdGhpcy50b1JlamVjdCA9IG51bGw7XG5cbiAgICAvLyBDYWxsYmFja3NcbiAgICB0aGlzLm9uUHJvZ3Jlc3MgPSBudWxsO1xuICAgIHRoaXMub25TdWNjZXNzID0gbnVsbDtcbiAgICB0aGlzLm9uRmFpbHVyZSA9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogU3RhcnQgdXBsb2FkaW5nIHRoZSBmaWxlIHRvIGEgbm9uLWRlZmF1bHQgZW5kcG9pbnQuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTGFyZ2VGaWxlSGVscGVyI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gYmFzZVVybCBhbHRlcm5hdGl2ZSBiYXNlIFVSTCBvZiB1cGxvYWQgc2VydmVyLlxuICAgKiBAcGFyYW0ge0ZpbGV8QmxvYn0gZGF0YSB0byB1cGxvYWQuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBhdmF0YXJGb3IgdG9waWMgbmFtZSBpZiB0aGUgdXBsb2FkIHJlcHJlc2VudHMgYW4gYXZhdGFyLlxuICAgKiBAcGFyYW0ge0NhbGxiYWNrfSBvblByb2dyZXNzIGNhbGxiYWNrLiBUYWtlcyBvbmUge2Zsb2F0fSBwYXJhbWV0ZXIgMC4uMVxuICAgKiBAcGFyYW0ge0NhbGxiYWNrfSBvblN1Y2Nlc3MgY2FsbGJhY2suIENhbGxlZCB3aGVuIHRoZSBmaWxlIGlzIHN1Y2Nlc3NmdWxseSB1cGxvYWRlZC5cbiAgICogQHBhcmFtIHtDYWxsYmFja30gb25GYWlsdXJlIGNhbGxiYWNrLiBDYWxsZWQgaW4gY2FzZSBvZiBhIGZhaWx1cmUuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSB1cGxvYWQgaXMgY29tcGxldGVkL2ZhaWxlZC5cbiAgICovXG4gIHVwbG9hZFdpdGhCYXNlVXJsKGJhc2VVcmwsIGRhdGEsIGF2YXRhckZvciwgb25Qcm9ncmVzcywgb25TdWNjZXNzLCBvbkZhaWx1cmUpIHtcbiAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXM7XG5cbiAgICBsZXQgdXJsID0gYC92JHt0aGlzLl92ZXJzaW9ufS9maWxlL3UvYDtcbiAgICBpZiAoYmFzZVVybCkge1xuICAgICAgbGV0IGJhc2UgPSBiYXNlVXJsO1xuICAgICAgaWYgKGJhc2UuZW5kc1dpdGgoJy8nKSkge1xuICAgICAgICAvLyBSZW1vdmluZyB0cmFpbGluZyBzbGFzaC5cbiAgICAgICAgYmFzZSA9IGJhc2Uuc2xpY2UoMCwgLTEpO1xuICAgICAgfVxuICAgICAgaWYgKGJhc2Uuc3RhcnRzV2l0aCgnaHR0cDovLycpIHx8IGJhc2Uuc3RhcnRzV2l0aCgnaHR0cHM6Ly8nKSkge1xuICAgICAgICB1cmwgPSBiYXNlICsgdXJsO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGJhc2UgVVJMICcke2Jhc2VVcmx9J2ApO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnhoci5vcGVuKCdQT1NUJywgdXJsLCB0cnVlKTtcbiAgICB0aGlzLnhoci5zZXRSZXF1ZXN0SGVhZGVyKCdYLVRpbm9kZS1BUElLZXknLCB0aGlzLl9hcGlLZXkpO1xuICAgIGlmICh0aGlzLl9hdXRoVG9rZW4pIHtcbiAgICAgIHRoaXMueGhyLnNldFJlcXVlc3RIZWFkZXIoJ1gtVGlub2RlLUF1dGgnLCBgVG9rZW4gJHt0aGlzLl9hdXRoVG9rZW4udG9rZW59YCk7XG4gICAgfVxuICAgIGNvbnN0IHJlc3VsdCA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMudG9SZXNvbHZlID0gcmVzb2x2ZTtcbiAgICAgIHRoaXMudG9SZWplY3QgPSByZWplY3Q7XG4gICAgfSk7XG5cbiAgICB0aGlzLm9uUHJvZ3Jlc3MgPSBvblByb2dyZXNzO1xuICAgIHRoaXMub25TdWNjZXNzID0gb25TdWNjZXNzO1xuICAgIHRoaXMub25GYWlsdXJlID0gb25GYWlsdXJlO1xuXG4gICAgdGhpcy54aHIudXBsb2FkLm9ucHJvZ3Jlc3MgPSAoZSkgPT4ge1xuICAgICAgaWYgKGUubGVuZ3RoQ29tcHV0YWJsZSAmJiBpbnN0YW5jZS5vblByb2dyZXNzKSB7XG4gICAgICAgIGluc3RhbmNlLm9uUHJvZ3Jlc3MoZS5sb2FkZWQgLyBlLnRvdGFsKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy54aHIub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgcGt0O1xuICAgICAgdHJ5IHtcbiAgICAgICAgcGt0ID0gSlNPTi5wYXJzZSh0aGlzLnJlc3BvbnNlLCBqc29uUGFyc2VIZWxwZXIpO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGluc3RhbmNlLl90aW5vZGUubG9nZ2VyKFwiRVJST1I6IEludmFsaWQgc2VydmVyIHJlc3BvbnNlIGluIExhcmdlRmlsZUhlbHBlclwiLCB0aGlzLnJlc3BvbnNlKTtcbiAgICAgICAgcGt0ID0ge1xuICAgICAgICAgIGN0cmw6IHtcbiAgICAgICAgICAgIGNvZGU6IHRoaXMuc3RhdHVzLFxuICAgICAgICAgICAgdGV4dDogdGhpcy5zdGF0dXNUZXh0XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5zdGF0dXMgPj0gMjAwICYmIHRoaXMuc3RhdHVzIDwgMzAwKSB7XG4gICAgICAgIGlmIChpbnN0YW5jZS50b1Jlc29sdmUpIHtcbiAgICAgICAgICBpbnN0YW5jZS50b1Jlc29sdmUocGt0LmN0cmwucGFyYW1zLnVybCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGluc3RhbmNlLm9uU3VjY2Vzcykge1xuICAgICAgICAgIGluc3RhbmNlLm9uU3VjY2Vzcyhwa3QuY3RybCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0dXMgPj0gNDAwKSB7XG4gICAgICAgIGlmIChpbnN0YW5jZS50b1JlamVjdCkge1xuICAgICAgICAgIGluc3RhbmNlLnRvUmVqZWN0KG5ldyBFcnJvcihgJHtwa3QuY3RybC50ZXh0fSAoJHtwa3QuY3RybC5jb2RlfSlgKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGluc3RhbmNlLm9uRmFpbHVyZSkge1xuICAgICAgICAgIGluc3RhbmNlLm9uRmFpbHVyZShwa3QuY3RybCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGluc3RhbmNlLl90aW5vZGUubG9nZ2VyKFwiRVJST1I6IFVuZXhwZWN0ZWQgc2VydmVyIHJlc3BvbnNlIHN0YXR1c1wiLCB0aGlzLnN0YXR1cywgdGhpcy5yZXNwb25zZSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRoaXMueGhyLm9uZXJyb3IgPSBmdW5jdGlvbihlKSB7XG4gICAgICBpZiAoaW5zdGFuY2UudG9SZWplY3QpIHtcbiAgICAgICAgaW5zdGFuY2UudG9SZWplY3QobmV3IEVycm9yKFwiZmFpbGVkXCIpKTtcbiAgICAgIH1cbiAgICAgIGlmIChpbnN0YW5jZS5vbkZhaWx1cmUpIHtcbiAgICAgICAgaW5zdGFuY2Uub25GYWlsdXJlKG51bGwpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLnhoci5vbmFib3J0ID0gZnVuY3Rpb24oZSkge1xuICAgICAgaWYgKGluc3RhbmNlLnRvUmVqZWN0KSB7XG4gICAgICAgIGluc3RhbmNlLnRvUmVqZWN0KG5ldyBFcnJvcihcInVwbG9hZCBjYW5jZWxsZWQgYnkgdXNlclwiKSk7XG4gICAgICB9XG4gICAgICBpZiAoaW5zdGFuY2Uub25GYWlsdXJlKSB7XG4gICAgICAgIGluc3RhbmNlLm9uRmFpbHVyZShudWxsKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGZvcm0gPSBuZXcgRm9ybURhdGEoKTtcbiAgICAgIGZvcm0uYXBwZW5kKCdmaWxlJywgZGF0YSk7XG4gICAgICBmb3JtLnNldCgnaWQnLCB0aGlzLl9yZXFJZCk7XG4gICAgICBpZiAoYXZhdGFyRm9yKSB7XG4gICAgICAgIGZvcm0uc2V0KCd0b3BpYycsIGF2YXRhckZvcik7XG4gICAgICB9XG4gICAgICB0aGlzLnhoci5zZW5kKGZvcm0pO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgaWYgKHRoaXMudG9SZWplY3QpIHtcbiAgICAgICAgdGhpcy50b1JlamVjdChlcnIpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMub25GYWlsdXJlKSB7XG4gICAgICAgIHRoaXMub25GYWlsdXJlKG51bGwpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgLyoqXG4gICAqIFN0YXJ0IHVwbG9hZGluZyB0aGUgZmlsZSB0byBkZWZhdWx0IGVuZHBvaW50LlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkxhcmdlRmlsZUhlbHBlciNcbiAgICpcbiAgICogQHBhcmFtIHtGaWxlfEJsb2J9IGRhdGEgdG8gdXBsb2FkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBhdmF0YXJGb3IgdG9waWMgbmFtZSBpZiB0aGUgdXBsb2FkIHJlcHJlc2VudHMgYW4gYXZhdGFyLlxuICAgKiBAcGFyYW0ge0NhbGxiYWNrfSBvblByb2dyZXNzIGNhbGxiYWNrLiBUYWtlcyBvbmUge2Zsb2F0fSBwYXJhbWV0ZXIgMC4uMVxuICAgKiBAcGFyYW0ge0NhbGxiYWNrfSBvblN1Y2Nlc3MgY2FsbGJhY2suIENhbGxlZCB3aGVuIHRoZSBmaWxlIGlzIHN1Y2Nlc3NmdWxseSB1cGxvYWRlZC5cbiAgICogQHBhcmFtIHtDYWxsYmFja30gb25GYWlsdXJlIGNhbGxiYWNrLiBDYWxsZWQgaW4gY2FzZSBvZiBhIGZhaWx1cmUuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSB1cGxvYWQgaXMgY29tcGxldGVkL2ZhaWxlZC5cbiAgICovXG4gIHVwbG9hZChkYXRhLCBhdmF0YXJGb3IsIG9uUHJvZ3Jlc3MsIG9uU3VjY2Vzcywgb25GYWlsdXJlKSB7XG4gICAgY29uc3QgYmFzZVVybCA9ICh0aGlzLl90aW5vZGUuX3NlY3VyZSA/ICdodHRwczovLycgOiAnaHR0cDovLycpICsgdGhpcy5fdGlub2RlLl9ob3N0O1xuICAgIHJldHVybiB0aGlzLnVwbG9hZFdpdGhCYXNlVXJsKGJhc2VVcmwsIGRhdGEsIGF2YXRhckZvciwgb25Qcm9ncmVzcywgb25TdWNjZXNzLCBvbkZhaWx1cmUpO1xuICB9XG4gIC8qKlxuICAgKiBEb3dubG9hZCB0aGUgZmlsZSBmcm9tIGEgZ2l2ZW4gVVJMIHVzaW5nIEdFVCByZXF1ZXN0LiBUaGlzIG1ldGhvZCB3b3JrcyB3aXRoIHRoZSBUaW5vZGUgc2VydmVyIG9ubHkuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTGFyZ2VGaWxlSGVscGVyI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcmVsYXRpdmVVcmwgLSBVUkwgdG8gZG93bmxvYWQgdGhlIGZpbGUgZnJvbS4gTXVzdCBiZSByZWxhdGl2ZSB1cmwsIGkuZS4gbXVzdCBub3QgY29udGFpbiB0aGUgaG9zdC5cbiAgICogQHBhcmFtIHtzdHJpbmc9fSBmaWxlbmFtZSAtIGZpbGUgbmFtZSB0byB1c2UgZm9yIHRoZSBkb3dubG9hZGVkIGZpbGUuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBkb3dubG9hZCBpcyBjb21wbGV0ZWQvZmFpbGVkLlxuICAgKi9cbiAgZG93bmxvYWQocmVsYXRpdmVVcmwsIGZpbGVuYW1lLCBtaW1ldHlwZSwgb25Qcm9ncmVzcywgb25FcnJvcikge1xuICAgIGlmICghaXNVcmxSZWxhdGl2ZShyZWxhdGl2ZVVybCkpIHtcbiAgICAgIC8vIEFzIGEgc2VjdXJpdHkgbWVhc3VyZSByZWZ1c2UgdG8gZG93bmxvYWQgZnJvbSBhbiBhYnNvbHV0ZSBVUkwuXG4gICAgICBpZiAob25FcnJvcikge1xuICAgICAgICBvbkVycm9yKGBUaGUgVVJMICcke3JlbGF0aXZlVXJsfScgbXVzdCBiZSByZWxhdGl2ZSwgbm90IGFic29sdXRlYCk7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghdGhpcy5fYXV0aFRva2VuKSB7XG4gICAgICBpZiAob25FcnJvcikge1xuICAgICAgICBvbkVycm9yKFwiTXVzdCBhdXRoZW50aWNhdGUgZmlyc3RcIik7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcztcbiAgICAvLyBHZXQgZGF0YSBhcyBibG9iIChzdG9yZWQgYnkgdGhlIGJyb3dzZXIgYXMgYSB0ZW1wb3JhcnkgZmlsZSkuXG4gICAgdGhpcy54aHIub3BlbignR0VUJywgcmVsYXRpdmVVcmwsIHRydWUpO1xuICAgIHRoaXMueGhyLnNldFJlcXVlc3RIZWFkZXIoJ1gtVGlub2RlLUFQSUtleScsIHRoaXMuX2FwaUtleSk7XG4gICAgdGhpcy54aHIuc2V0UmVxdWVzdEhlYWRlcignWC1UaW5vZGUtQXV0aCcsICdUb2tlbiAnICsgdGhpcy5fYXV0aFRva2VuLnRva2VuKTtcbiAgICB0aGlzLnhoci5yZXNwb25zZVR5cGUgPSAnYmxvYic7XG5cbiAgICB0aGlzLm9uUHJvZ3Jlc3MgPSBvblByb2dyZXNzO1xuICAgIHRoaXMueGhyLm9ucHJvZ3Jlc3MgPSBmdW5jdGlvbihlKSB7XG4gICAgICBpZiAoaW5zdGFuY2Uub25Qcm9ncmVzcykge1xuICAgICAgICAvLyBQYXNzaW5nIGUubG9hZGVkIGluc3RlYWQgb2YgZS5sb2FkZWQvZS50b3RhbCBiZWNhdXNlIGUudG90YWxcbiAgICAgICAgLy8gaXMgYWx3YXlzIDAgd2l0aCBnemlwIGNvbXByZXNzaW9uIGVuYWJsZWQgYnkgdGhlIHNlcnZlci5cbiAgICAgICAgaW5zdGFuY2Uub25Qcm9ncmVzcyhlLmxvYWRlZCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IHJlc3VsdCA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMudG9SZXNvbHZlID0gcmVzb2x2ZTtcbiAgICAgIHRoaXMudG9SZWplY3QgPSByZWplY3Q7XG4gICAgfSk7XG5cbiAgICAvLyBUaGUgYmxvYiBuZWVkcyB0byBiZSBzYXZlZCBhcyBmaWxlLiBUaGVyZSBpcyBubyBrbm93biB3YXkgdG9cbiAgICAvLyBzYXZlIHRoZSBibG9iIGFzIGZpbGUgb3RoZXIgdGhhbiB0byBmYWtlIGEgY2xpY2sgb24gYW4gPGEgaHJlZi4uLiBkb3dubG9hZD0uLi4+LlxuICAgIHRoaXMueGhyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHRoaXMuc3RhdHVzID09IDIwMCkge1xuICAgICAgICBjb25zdCBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgICAgICAvLyBVUkwuY3JlYXRlT2JqZWN0VVJMIGlzIG5vdCBhdmFpbGFibGUgaW4gbm9uLWJyb3dzZXIgZW52aXJvbm1lbnQuIFRoaXMgY2FsbCB3aWxsIGZhaWwuXG4gICAgICAgIGxpbmsuaHJlZiA9IHdpbmRvdy5VUkwuY3JlYXRlT2JqZWN0VVJMKG5ldyBCbG9iKFt0aGlzLnJlc3BvbnNlXSwge1xuICAgICAgICAgIHR5cGU6IG1pbWV0eXBlXG4gICAgICAgIH0pKTtcbiAgICAgICAgbGluay5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICBsaW5rLnNldEF0dHJpYnV0ZSgnZG93bmxvYWQnLCBmaWxlbmFtZSk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobGluayk7XG4gICAgICAgIGxpbmsuY2xpY2soKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChsaW5rKTtcbiAgICAgICAgd2luZG93LlVSTC5yZXZva2VPYmplY3RVUkwobGluay5ocmVmKTtcbiAgICAgICAgaWYgKGluc3RhbmNlLnRvUmVzb2x2ZSkge1xuICAgICAgICAgIGluc3RhbmNlLnRvUmVzb2x2ZSgpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdHVzID49IDQwMCAmJiBpbnN0YW5jZS50b1JlamVjdCkge1xuICAgICAgICAvLyBUaGUgdGhpcy5yZXNwb25zZVRleHQgaXMgdW5kZWZpbmVkLCBtdXN0IHVzZSB0aGlzLnJlc3BvbnNlIHdoaWNoIGlzIGEgYmxvYi5cbiAgICAgICAgLy8gTmVlZCB0byBjb252ZXJ0IHRoaXMucmVzcG9uc2UgdG8gSlNPTi4gVGhlIGJsb2IgY2FuIG9ubHkgYmUgYWNjZXNzZWQgYnkgdGhlXG4gICAgICAgIC8vIEZpbGVSZWFkZXIuXG4gICAgICAgIGNvbnN0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gICAgICAgIHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcGt0ID0gSlNPTi5wYXJzZSh0aGlzLnJlc3VsdCwganNvblBhcnNlSGVscGVyKTtcbiAgICAgICAgICAgIGluc3RhbmNlLnRvUmVqZWN0KG5ldyBFcnJvcihgJHtwa3QuY3RybC50ZXh0fSAoJHtwa3QuY3RybC5jb2RlfSlgKSk7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBpbnN0YW5jZS5fdGlub2RlLmxvZ2dlcihcIkVSUk9SOiBJbnZhbGlkIHNlcnZlciByZXNwb25zZSBpbiBMYXJnZUZpbGVIZWxwZXJcIiwgdGhpcy5yZXN1bHQpO1xuICAgICAgICAgICAgaW5zdGFuY2UudG9SZWplY3QoZXJyKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHJlYWRlci5yZWFkQXNUZXh0KHRoaXMucmVzcG9uc2UpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLnhoci5vbmVycm9yID0gZnVuY3Rpb24oZSkge1xuICAgICAgaWYgKGluc3RhbmNlLnRvUmVqZWN0KSB7XG4gICAgICAgIGluc3RhbmNlLnRvUmVqZWN0KG5ldyBFcnJvcihcImZhaWxlZFwiKSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRoaXMueGhyLm9uYWJvcnQgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmIChpbnN0YW5jZS50b1JlamVjdCkge1xuICAgICAgICBpbnN0YW5jZS50b1JlamVjdChudWxsKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdHJ5IHtcbiAgICAgIHRoaXMueGhyLnNlbmQoKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGlmICh0aGlzLnRvUmVqZWN0KSB7XG4gICAgICAgIHRoaXMudG9SZWplY3QoZXJyKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIC8qKlxuICAgKiBUcnkgdG8gY2FuY2VsIGFuIG9uZ29pbmcgdXBsb2FkIG9yIGRvd25sb2FkLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkxhcmdlRmlsZUhlbHBlciNcbiAgICovXG4gIGNhbmNlbCgpIHtcbiAgICBpZiAodGhpcy54aHIgJiYgdGhpcy54aHIucmVhZHlTdGF0ZSA8IDQpIHtcbiAgICAgIHRoaXMueGhyLmFib3J0KCk7XG4gICAgfVxuICB9XG4gIC8qKlxuICAgKiBHZXQgdW5pcXVlIGlkIG9mIHRoaXMgcmVxdWVzdC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5MYXJnZUZpbGVIZWxwZXIjXG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IHVuaXF1ZSBpZFxuICAgKi9cbiAgZ2V0SWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3JlcUlkO1xuICB9XG4gIC8qKlxuICAgKiBUbyB1c2UgTGFyZ2VGaWxlSGVscGVyIGluIGEgbm9uIGJyb3dzZXIgY29udGV4dCwgc3VwcGx5IFhNTEh0dHBSZXF1ZXN0IHByb3ZpZGVyLlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJvZiBMYXJnZUZpbGVIZWxwZXJcbiAgICogQHBhcmFtIHhoclByb3ZpZGVyIFhNTEh0dHBSZXF1ZXN0IHByb3ZpZGVyLCBlLmcuIGZvciBub2RlIDxjb2RlPnJlcXVpcmUoJ3hocicpPC9jb2RlPi5cbiAgICovXG4gIHN0YXRpYyBzZXROZXR3b3JrUHJvdmlkZXIoeGhyUHJvdmlkZXIpIHtcbiAgICBYSFJQcm92aWRlciA9IHhoclByb3ZpZGVyO1xuICB9XG59XG4iLCIvKipcbiAqIEBmaWxlIEhlbHBlciBjbGFzcyBmb3IgY29uc3RydWN0aW5nIHtAbGluayBUaW5vZGUuR2V0UXVlcnl9LlxuICpcbiAqIEBjb3B5cmlnaHQgMjAxNS0yMDIyIFRpbm9kZSBMTEMuXG4gKi9cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBIZWxwZXIgY2xhc3MgZm9yIGNvbnN0cnVjdGluZyB7QGxpbmsgVGlub2RlLkdldFF1ZXJ5fS5cbiAqXG4gKiBAY2xhc3MgTWV0YUdldEJ1aWxkZXJcbiAqIEBtZW1iZXJvZiBUaW5vZGVcbiAqXG4gKiBAcGFyYW0ge1Rpbm9kZS5Ub3BpY30gcGFyZW50IHRvcGljIHdoaWNoIGluc3RhbnRpYXRlZCB0aGlzIGJ1aWxkZXIuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1ldGFHZXRCdWlsZGVyIHtcbiAgY29uc3RydWN0b3IocGFyZW50KSB7XG4gICAgdGhpcy50b3BpYyA9IHBhcmVudDtcbiAgICB0aGlzLndoYXQgPSB7fTtcbiAgfVxuXG4gIC8vIEdldCB0aW1lc3RhbXAgb2YgdGhlIG1vc3QgcmVjZW50IGRlc2MgdXBkYXRlLlxuICAjZ2V0X2Rlc2NfaW1zKCkge1xuICAgIHJldHVybiB0aGlzLnRvcGljLnVwZGF0ZWQ7XG4gIH1cblxuICAvLyBHZXQgdGltZXN0YW1wIG9mIHRoZSBtb3N0IHJlY2VudCBzdWJzIHVwZGF0ZS5cbiAgI2dldF9zdWJzX2ltcygpIHtcbiAgICBpZiAodGhpcy50b3BpYy5pc1AyUFR5cGUoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuI2dldF9kZXNjX2ltcygpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy50b3BpYy5fbGFzdFN1YnNVcGRhdGU7XG4gIH1cbiAgLyoqXG4gICAqIEFkZCBxdWVyeSBwYXJhbWV0ZXJzIHRvIGZldGNoIG1lc3NhZ2VzIHdpdGhpbiBleHBsaWNpdCBsaW1pdHMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTWV0YUdldEJ1aWxkZXIjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gc2luY2UgLSBtZXNzYWdlcyBuZXdlciB0aGFuIHRoaXMgKGluY2x1c2l2ZSk7XG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gYmVmb3JlIC0gb2xkZXIgdGhhbiB0aGlzIChleGNsdXNpdmUpXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gbGltaXQgLSBudW1iZXIgb2YgbWVzc2FnZXMgdG8gZmV0Y2hcbiAgICogQHJldHVybnMge1Rpbm9kZS5NZXRhR2V0QnVpbGRlcn0gPGNvZGU+dGhpczwvY29kZT4gb2JqZWN0LlxuICAgKi9cbiAgd2l0aERhdGEoc2luY2UsIGJlZm9yZSwgbGltaXQpIHtcbiAgICB0aGlzLndoYXRbJ2RhdGEnXSA9IHtcbiAgICAgIHNpbmNlOiBzaW5jZSxcbiAgICAgIGJlZm9yZTogYmVmb3JlLFxuICAgICAgbGltaXQ6IGxpbWl0XG4gICAgfTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICAvKipcbiAgICogQWRkIHF1ZXJ5IHBhcmFtZXRlcnMgdG8gZmV0Y2ggbWVzc2FnZXMgbmV3ZXIgdGhhbiB0aGUgbGF0ZXN0IHNhdmVkIG1lc3NhZ2UuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTWV0YUdldEJ1aWxkZXIjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gbGltaXQgLSBudW1iZXIgb2YgbWVzc2FnZXMgdG8gZmV0Y2hcbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5NZXRhR2V0QnVpbGRlcn0gPGNvZGU+dGhpczwvY29kZT4gb2JqZWN0LlxuICAgKi9cbiAgd2l0aExhdGVyRGF0YShsaW1pdCkge1xuICAgIHJldHVybiB0aGlzLndpdGhEYXRhKHRoaXMudG9waWMuX21heFNlcSA+IDAgPyB0aGlzLnRvcGljLl9tYXhTZXEgKyAxIDogdW5kZWZpbmVkLCB1bmRlZmluZWQsIGxpbWl0KTtcbiAgfVxuICAvKipcbiAgICogQWRkIHF1ZXJ5IHBhcmFtZXRlcnMgdG8gZmV0Y2ggbWVzc2FnZXMgb2xkZXIgdGhhbiB0aGUgZWFybGllc3Qgc2F2ZWQgbWVzc2FnZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5NZXRhR2V0QnVpbGRlciNcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXI9fSBsaW1pdCAtIG1heGltdW0gbnVtYmVyIG9mIG1lc3NhZ2VzIHRvIGZldGNoLlxuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLk1ldGFHZXRCdWlsZGVyfSA8Y29kZT50aGlzPC9jb2RlPiBvYmplY3QuXG4gICAqL1xuICB3aXRoRWFybGllckRhdGEobGltaXQpIHtcbiAgICByZXR1cm4gdGhpcy53aXRoRGF0YSh1bmRlZmluZWQsIHRoaXMudG9waWMuX21pblNlcSA+IDAgPyB0aGlzLnRvcGljLl9taW5TZXEgOiB1bmRlZmluZWQsIGxpbWl0KTtcbiAgfVxuICAvKipcbiAgICogQWRkIHF1ZXJ5IHBhcmFtZXRlcnMgdG8gZmV0Y2ggdG9waWMgZGVzY3JpcHRpb24gaWYgaXQncyBuZXdlciB0aGFuIHRoZSBnaXZlbiB0aW1lc3RhbXAuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTWV0YUdldEJ1aWxkZXIjXG4gICAqXG4gICAqIEBwYXJhbSB7RGF0ZT19IGltcyAtIGZldGNoIG1lc3NhZ2VzIG5ld2VyIHRoYW4gdGhpcyB0aW1lc3RhbXAuXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuTWV0YUdldEJ1aWxkZXJ9IDxjb2RlPnRoaXM8L2NvZGU+IG9iamVjdC5cbiAgICovXG4gIHdpdGhEZXNjKGltcykge1xuICAgIHRoaXMud2hhdFsnZGVzYyddID0ge1xuICAgICAgaW1zOiBpbXNcbiAgICB9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIC8qKlxuICAgKiBBZGQgcXVlcnkgcGFyYW1ldGVycyB0byBmZXRjaCB0b3BpYyBkZXNjcmlwdGlvbiBpZiBpdCdzIG5ld2VyIHRoYW4gdGhlIGxhc3QgdXBkYXRlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLk1ldGFHZXRCdWlsZGVyI1xuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLk1ldGFHZXRCdWlsZGVyfSA8Y29kZT50aGlzPC9jb2RlPiBvYmplY3QuXG4gICAqL1xuICB3aXRoTGF0ZXJEZXNjKCkge1xuICAgIHJldHVybiB0aGlzLndpdGhEZXNjKHRoaXMuI2dldF9kZXNjX2ltcygpKTtcbiAgfVxuICAvKipcbiAgICogQWRkIHF1ZXJ5IHBhcmFtZXRlcnMgdG8gZmV0Y2ggc3Vic2NyaXB0aW9ucy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5NZXRhR2V0QnVpbGRlciNcbiAgICpcbiAgICogQHBhcmFtIHtEYXRlPX0gaW1zIC0gZmV0Y2ggc3Vic2NyaXB0aW9ucyBtb2RpZmllZCBtb3JlIHJlY2VudGx5IHRoYW4gdGhpcyB0aW1lc3RhbXBcbiAgICogQHBhcmFtIHtudW1iZXI9fSBsaW1pdCAtIG1heGltdW0gbnVtYmVyIG9mIHN1YnNjcmlwdGlvbnMgdG8gZmV0Y2guXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gdXNlck9yVG9waWMgLSB1c2VyIElEIG9yIHRvcGljIG5hbWUgdG8gZmV0Y2ggZm9yIGZldGNoaW5nIG9uZSBzdWJzY3JpcHRpb24uXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuTWV0YUdldEJ1aWxkZXJ9IDxjb2RlPnRoaXM8L2NvZGU+IG9iamVjdC5cbiAgICovXG4gIHdpdGhTdWIoaW1zLCBsaW1pdCwgdXNlck9yVG9waWMpIHtcbiAgICBjb25zdCBvcHRzID0ge1xuICAgICAgaW1zOiBpbXMsXG4gICAgICBsaW1pdDogbGltaXRcbiAgICB9O1xuICAgIGlmICh0aGlzLnRvcGljLmdldFR5cGUoKSA9PSAnbWUnKSB7XG4gICAgICBvcHRzLnRvcGljID0gdXNlck9yVG9waWM7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9wdHMudXNlciA9IHVzZXJPclRvcGljO1xuICAgIH1cbiAgICB0aGlzLndoYXRbJ3N1YiddID0gb3B0cztcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICAvKipcbiAgICogQWRkIHF1ZXJ5IHBhcmFtZXRlcnMgdG8gZmV0Y2ggYSBzaW5nbGUgc3Vic2NyaXB0aW9uLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLk1ldGFHZXRCdWlsZGVyI1xuICAgKlxuICAgKiBAcGFyYW0ge0RhdGU9fSBpbXMgLSBmZXRjaCBzdWJzY3JpcHRpb25zIG1vZGlmaWVkIG1vcmUgcmVjZW50bHkgdGhhbiB0aGlzIHRpbWVzdGFtcFxuICAgKiBAcGFyYW0ge3N0cmluZz19IHVzZXJPclRvcGljIC0gdXNlciBJRCBvciB0b3BpYyBuYW1lIHRvIGZldGNoIGZvciBmZXRjaGluZyBvbmUgc3Vic2NyaXB0aW9uLlxuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLk1ldGFHZXRCdWlsZGVyfSA8Y29kZT50aGlzPC9jb2RlPiBvYmplY3QuXG4gICAqL1xuICB3aXRoT25lU3ViKGltcywgdXNlck9yVG9waWMpIHtcbiAgICByZXR1cm4gdGhpcy53aXRoU3ViKGltcywgdW5kZWZpbmVkLCB1c2VyT3JUb3BpYyk7XG4gIH1cbiAgLyoqXG4gICAqIEFkZCBxdWVyeSBwYXJhbWV0ZXJzIHRvIGZldGNoIGEgc2luZ2xlIHN1YnNjcmlwdGlvbiBpZiBpdCdzIGJlZW4gdXBkYXRlZCBzaW5jZSB0aGUgbGFzdCB1cGRhdGUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTWV0YUdldEJ1aWxkZXIjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gdXNlck9yVG9waWMgLSB1c2VyIElEIG9yIHRvcGljIG5hbWUgdG8gZmV0Y2ggZm9yIGZldGNoaW5nIG9uZSBzdWJzY3JpcHRpb24uXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuTWV0YUdldEJ1aWxkZXJ9IDxjb2RlPnRoaXM8L2NvZGU+IG9iamVjdC5cbiAgICovXG4gIHdpdGhMYXRlck9uZVN1Yih1c2VyT3JUb3BpYykge1xuICAgIHJldHVybiB0aGlzLndpdGhPbmVTdWIodGhpcy50b3BpYy5fbGFzdFN1YnNVcGRhdGUsIHVzZXJPclRvcGljKTtcbiAgfVxuICAvKipcbiAgICogQWRkIHF1ZXJ5IHBhcmFtZXRlcnMgdG8gZmV0Y2ggc3Vic2NyaXB0aW9ucyB1cGRhdGVkIHNpbmNlIHRoZSBsYXN0IHVwZGF0ZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5NZXRhR2V0QnVpbGRlciNcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXI9fSBsaW1pdCAtIG1heGltdW0gbnVtYmVyIG9mIHN1YnNjcmlwdGlvbnMgdG8gZmV0Y2guXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuTWV0YUdldEJ1aWxkZXJ9IDxjb2RlPnRoaXM8L2NvZGU+IG9iamVjdC5cbiAgICovXG4gIHdpdGhMYXRlclN1YihsaW1pdCkge1xuICAgIHJldHVybiB0aGlzLndpdGhTdWIodGhpcy4jZ2V0X3N1YnNfaW1zKCksIGxpbWl0KTtcbiAgfVxuICAvKipcbiAgICogQWRkIHF1ZXJ5IHBhcmFtZXRlcnMgdG8gZmV0Y2ggdG9waWMgdGFncy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5NZXRhR2V0QnVpbGRlciNcbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5NZXRhR2V0QnVpbGRlcn0gPGNvZGU+dGhpczwvY29kZT4gb2JqZWN0LlxuICAgKi9cbiAgd2l0aFRhZ3MoKSB7XG4gICAgdGhpcy53aGF0Wyd0YWdzJ10gPSB0cnVlO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIC8qKlxuICAgKiBBZGQgcXVlcnkgcGFyYW1ldGVycyB0byBmZXRjaCB1c2VyJ3MgY3JlZGVudGlhbHMuIDxjb2RlPidtZSc8L2NvZGU+IHRvcGljIG9ubHkuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTWV0YUdldEJ1aWxkZXIjXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuTWV0YUdldEJ1aWxkZXJ9IDxjb2RlPnRoaXM8L2NvZGU+IG9iamVjdC5cbiAgICovXG4gIHdpdGhDcmVkKCkge1xuICAgIGlmICh0aGlzLnRvcGljLmdldFR5cGUoKSA9PSAnbWUnKSB7XG4gICAgICB0aGlzLndoYXRbJ2NyZWQnXSA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudG9waWMuX3Rpbm9kZS5sb2dnZXIoXCJFUlJPUjogSW52YWxpZCB0b3BpYyB0eXBlIGZvciBNZXRhR2V0QnVpbGRlcjp3aXRoQ3JlZHNcIiwgdGhpcy50b3BpYy5nZXRUeXBlKCkpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICAvKipcbiAgICogQWRkIHF1ZXJ5IHBhcmFtZXRlcnMgdG8gZmV0Y2ggZGVsZXRlZCBtZXNzYWdlcyB3aXRoaW4gZXhwbGljaXQgbGltaXRzLiBBbnkvYWxsIHBhcmFtZXRlcnMgY2FuIGJlIG51bGwuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTWV0YUdldEJ1aWxkZXIjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gc2luY2UgLSBpZHMgb2YgbWVzc2FnZXMgZGVsZXRlZCBzaW5jZSB0aGlzICdkZWwnIGlkIChpbmNsdXNpdmUpXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gbGltaXQgLSBudW1iZXIgb2YgZGVsZXRlZCBtZXNzYWdlIGlkcyB0byBmZXRjaFxuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLk1ldGFHZXRCdWlsZGVyfSA8Y29kZT50aGlzPC9jb2RlPiBvYmplY3QuXG4gICAqL1xuICB3aXRoRGVsKHNpbmNlLCBsaW1pdCkge1xuICAgIGlmIChzaW5jZSB8fCBsaW1pdCkge1xuICAgICAgdGhpcy53aGF0WydkZWwnXSA9IHtcbiAgICAgICAgc2luY2U6IHNpbmNlLFxuICAgICAgICBsaW1pdDogbGltaXRcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIC8qKlxuICAgKiBBZGQgcXVlcnkgcGFyYW1ldGVycyB0byBmZXRjaCBtZXNzYWdlcyBkZWxldGVkIGFmdGVyIHRoZSBzYXZlZCA8Y29kZT4nZGVsJzwvY29kZT4gaWQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTWV0YUdldEJ1aWxkZXIjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gbGltaXQgLSBudW1iZXIgb2YgZGVsZXRlZCBtZXNzYWdlIGlkcyB0byBmZXRjaFxuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLk1ldGFHZXRCdWlsZGVyfSA8Y29kZT50aGlzPC9jb2RlPiBvYmplY3QuXG4gICAqL1xuICB3aXRoTGF0ZXJEZWwobGltaXQpIHtcbiAgICAvLyBTcGVjaWZ5ICdzaW5jZScgb25seSBpZiB3ZSBoYXZlIGFscmVhZHkgcmVjZWl2ZWQgc29tZSBtZXNzYWdlcy4gSWZcbiAgICAvLyB3ZSBoYXZlIG5vIGxvY2FsbHkgY2FjaGVkIG1lc3NhZ2VzIHRoZW4gd2UgZG9uJ3QgY2FyZSBpZiBhbnkgbWVzc2FnZXMgd2VyZSBkZWxldGVkLlxuICAgIHJldHVybiB0aGlzLndpdGhEZWwodGhpcy50b3BpYy5fbWF4U2VxID4gMCA/IHRoaXMudG9waWMuX21heERlbCArIDEgOiB1bmRlZmluZWQsIGxpbWl0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeHRyYWN0IHN1YnF1ZXJ5OiBnZXQgYW4gb2JqZWN0IHRoYXQgY29udGFpbnMgc3BlY2lmaWVkIHN1YnF1ZXJ5LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLk1ldGFHZXRCdWlsZGVyI1xuICAgKiBAcGFyYW0ge3N0cmluZ30gd2hhdCAtIHN1YnF1ZXJ5IHRvIHJldHVybjogb25lIG9mICdkYXRhJywgJ3N1YicsICdkZXNjJywgJ3RhZ3MnLCAnY3JlZCcsICdkZWwnLlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSByZXF1ZXN0ZWQgc3VicXVlcnkgb3IgPGNvZGU+dW5kZWZpbmVkPC9jb2RlPi5cbiAgICovXG4gIGV4dHJhY3Qod2hhdCkge1xuICAgIHJldHVybiB0aGlzLndoYXRbd2hhdF07XG4gIH1cblxuICAvKipcbiAgICogQ29uc3RydWN0IHBhcmFtZXRlcnMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTWV0YUdldEJ1aWxkZXIjXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuR2V0UXVlcnl9IEdldCBxdWVyeVxuICAgKi9cbiAgYnVpbGQoKSB7XG4gICAgY29uc3Qgd2hhdCA9IFtdO1xuICAgIGxldCBwYXJhbXMgPSB7fTtcbiAgICBbJ2RhdGEnLCAnc3ViJywgJ2Rlc2MnLCAndGFncycsICdjcmVkJywgJ2RlbCddLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgaWYgKHRoaXMud2hhdC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgIHdoYXQucHVzaChrZXkpO1xuICAgICAgICBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGhpcy53aGF0W2tleV0pLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBwYXJhbXNba2V5XSA9IHRoaXMud2hhdFtrZXldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKHdoYXQubGVuZ3RoID4gMCkge1xuICAgICAgcGFyYW1zLndoYXQgPSB3aGF0LmpvaW4oJyAnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGFyYW1zID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICByZXR1cm4gcGFyYW1zO1xuICB9XG59XG4iLCIvKipcbiAqIEBtb2R1bGUgdGlub2RlLXNka1xuICpcbiAqIEBjb3B5cmlnaHQgMjAxNS0yMDIyIFRpbm9kZSBMTEMuXG4gKiBAc3VtbWFyeSBKYXZhc2NyaXB0IGJpbmRpbmdzIGZvciBUaW5vZGUuXG4gKiBAbGljZW5zZSBBcGFjaGUgMi4wXG4gKiBAdmVyc2lvbiAwLjIwXG4gKlxuICogU2VlIDxhIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vdGlub2RlL3dlYmFwcFwiPmh0dHBzOi8vZ2l0aHViLmNvbS90aW5vZGUvd2ViYXBwPC9hPiBmb3IgcmVhbC1saWZlIHVzYWdlLlxuICpcbiAqIEBleGFtcGxlXG4gKiA8aGVhZD5cbiAqIDxzY3JpcHQgc3JjPVwiLi4uL3Rpbm9kZS5qc1wiPjwvc2NyaXB0PlxuICogPC9oZWFkPlxuICpcbiAqIDxib2R5PlxuICogIC4uLlxuICogPHNjcmlwdD5cbiAqICAvLyBJbnN0YW50aWF0ZSB0aW5vZGUuXG4gKiAgY29uc3QgdGlub2RlID0gbmV3IFRpbm9kZShjb25maWcsIF8gPT4ge1xuICogICAgLy8gQ2FsbGVkIG9uIGluaXQgY29tcGxldGlvbi5cbiAqICB9KTtcbiAqICB0aW5vZGUuZW5hYmxlTG9nZ2luZyh0cnVlKTtcbiAqICB0aW5vZGUub25EaXNjb25uZWN0ID0gZXJyID0+IHtcbiAqICAgIC8vIEhhbmRsZSBkaXNjb25uZWN0LlxuICogIH07XG4gKiAgLy8gQ29ubmVjdCB0byB0aGUgc2VydmVyLlxuICogIHRpbm9kZS5jb25uZWN0KCdodHRwczovL2V4YW1wbGUuY29tLycpLnRoZW4oXyA9PiB7XG4gKiAgICAvLyBDb25uZWN0ZWQuIExvZ2luIG5vdy5cbiAqICAgIHJldHVybiB0aW5vZGUubG9naW5CYXNpYyhsb2dpbiwgcGFzc3dvcmQpO1xuICogIH0pLnRoZW4oY3RybCA9PiB7XG4gKiAgICAvLyBMb2dnZWQgaW4gZmluZSwgYXR0YWNoIGNhbGxiYWNrcywgc3Vic2NyaWJlIHRvICdtZScuXG4gKiAgICBjb25zdCBtZSA9IHRpbm9kZS5nZXRNZVRvcGljKCk7XG4gKiAgICBtZS5vbk1ldGFEZXNjID0gZnVuY3Rpb24obWV0YSkgeyAuLi4gfTtcbiAqICAgIC8vIFN1YnNjcmliZSwgZmV0Y2ggdG9waWMgZGVzY3JpcHRpb24gYW5kIHRoZSBsaXN0IG9mIGNvbnRhY3RzLlxuICogICAgbWUuc3Vic2NyaWJlKHtnZXQ6IHtkZXNjOiB7fSwgc3ViOiB7fX19KTtcbiAqICB9KS5jYXRjaChlcnIgPT4ge1xuICogICAgLy8gTG9naW4gb3Igc3Vic2NyaXB0aW9uIGZhaWxlZCwgZG8gc29tZXRoaW5nLlxuICogICAgLi4uXG4gKiAgfSk7XG4gKiAgLi4uXG4gKiA8L3NjcmlwdD5cbiAqIDwvYm9keT5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG4vLyBOT1RFIFRPIERFVkVMT1BFUlM6XG4vLyBMb2NhbGl6YWJsZSBzdHJpbmdzIHNob3VsZCBiZSBkb3VibGUgcXVvdGVkIFwi0YHRgtGA0L7QutCwINC90LAg0LTRgNGD0LPQvtC8INGP0LfRi9C60LVcIixcbi8vIG5vbi1sb2NhbGl6YWJsZSBzdHJpbmdzIHNob3VsZCBiZSBzaW5nbGUgcXVvdGVkICdub24tbG9jYWxpemVkJy5cblxuaW1wb3J0IEFjY2Vzc01vZGUgZnJvbSAnLi9hY2Nlc3MtbW9kZS5qcyc7XG5pbXBvcnQgKiBhcyBDb25zdCBmcm9tICcuL2NvbmZpZy5qcyc7XG5pbXBvcnQgQ29ubmVjdGlvbiBmcm9tICcuL2Nvbm5lY3Rpb24uanMnO1xuaW1wb3J0IERCQ2FjaGUgZnJvbSAnLi9kYi5qcyc7XG5pbXBvcnQgRHJhZnR5IGZyb20gJy4vZHJhZnR5LmpzJztcbmltcG9ydCBMYXJnZUZpbGVIZWxwZXIgZnJvbSAnLi9sYXJnZS1maWxlLmpzJztcbmltcG9ydCBNZXRhR2V0QnVpbGRlciBmcm9tICcuL21ldGEtYnVpbGRlci5qcyc7XG5pbXBvcnQge1xuICBUb3BpYyxcbiAgVG9waWNNZSxcbiAgVG9waWNGbmRcbn0gZnJvbSAnLi90b3BpYy5qcyc7XG5cbmltcG9ydCB7XG4gIGlzVXJsUmVsYXRpdmUsXG4gIGpzb25QYXJzZUhlbHBlcixcbiAgbWVyZ2VPYmosXG4gIHJmYzMzMzlEYXRlU3RyaW5nLFxuICBzaW1wbGlmeVxufSBmcm9tICcuL3V0aWxzLmpzJztcblxuLy8gUmUtZXhwb3J0IEFjY2Vzc01vZGVcbmV4cG9ydCB7XG4gIEFjY2Vzc01vZGVcbn07XG5cbmxldCBXZWJTb2NrZXRQcm92aWRlcjtcbmlmICh0eXBlb2YgV2ViU29ja2V0ICE9ICd1bmRlZmluZWQnKSB7XG4gIFdlYlNvY2tldFByb3ZpZGVyID0gV2ViU29ja2V0O1xufVxuXG5sZXQgWEhSUHJvdmlkZXI7XG5pZiAodHlwZW9mIFhNTEh0dHBSZXF1ZXN0ICE9ICd1bmRlZmluZWQnKSB7XG4gIFhIUlByb3ZpZGVyID0gWE1MSHR0cFJlcXVlc3Q7XG59XG5cbmxldCBJbmRleGVkREJQcm92aWRlcjtcbmlmICh0eXBlb2YgaW5kZXhlZERCICE9ICd1bmRlZmluZWQnKSB7XG4gIEluZGV4ZWREQlByb3ZpZGVyID0gaW5kZXhlZERCO1xufVxuXG4vLyBSZS1leHBvcnQgRHJhZnR5LlxuZXhwb3J0IHtcbiAgRHJhZnR5XG59XG5cbmluaXRGb3JOb25Ccm93c2VyQXBwKCk7XG5cbi8vIFV0aWxpdHkgZnVuY3Rpb25zXG5cbi8vIFBvbHlmaWxsIGZvciBub24tYnJvd3NlciBjb250ZXh0LCBlLmcuIE5vZGVKcy5cbmZ1bmN0aW9uIGluaXRGb3JOb25Ccm93c2VyQXBwKCkge1xuICAvLyBUaW5vZGUgcmVxdWlyZW1lbnQgaW4gbmF0aXZlIG1vZGUgYmVjYXVzZSByZWFjdCBuYXRpdmUgZG9lc24ndCBwcm92aWRlIEJhc2U2NCBtZXRob2RcbiAgY29uc3QgY2hhcnMgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLz0nO1xuXG4gIGlmICh0eXBlb2YgYnRvYSA9PSAndW5kZWZpbmVkJykge1xuICAgIGdsb2JhbC5idG9hID0gZnVuY3Rpb24oaW5wdXQgPSAnJykge1xuICAgICAgbGV0IHN0ciA9IGlucHV0O1xuICAgICAgbGV0IG91dHB1dCA9ICcnO1xuXG4gICAgICBmb3IgKGxldCBibG9jayA9IDAsIGNoYXJDb2RlLCBpID0gMCwgbWFwID0gY2hhcnM7IHN0ci5jaGFyQXQoaSB8IDApIHx8IChtYXAgPSAnPScsIGkgJSAxKTsgb3V0cHV0ICs9IG1hcC5jaGFyQXQoNjMgJiBibG9jayA+PiA4IC0gaSAlIDEgKiA4KSkge1xuXG4gICAgICAgIGNoYXJDb2RlID0gc3RyLmNoYXJDb2RlQXQoaSArPSAzIC8gNCk7XG5cbiAgICAgICAgaWYgKGNoYXJDb2RlID4gMHhGRikge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIididG9hJyBmYWlsZWQ6IFRoZSBzdHJpbmcgdG8gYmUgZW5jb2RlZCBjb250YWlucyBjaGFyYWN0ZXJzIG91dHNpZGUgb2YgdGhlIExhdGluMSByYW5nZS5cIik7XG4gICAgICAgIH1cbiAgICAgICAgYmxvY2sgPSBibG9jayA8PCA4IHwgY2hhckNvZGU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgYXRvYiA9PSAndW5kZWZpbmVkJykge1xuICAgIGdsb2JhbC5hdG9iID0gZnVuY3Rpb24oaW5wdXQgPSAnJykge1xuICAgICAgbGV0IHN0ciA9IGlucHV0LnJlcGxhY2UoLz0rJC8sICcnKTtcbiAgICAgIGxldCBvdXRwdXQgPSAnJztcblxuICAgICAgaWYgKHN0ci5sZW5ndGggJSA0ID09IDEpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiJ2F0b2InIGZhaWxlZDogVGhlIHN0cmluZyB0byBiZSBkZWNvZGVkIGlzIG5vdCBjb3JyZWN0bHkgZW5jb2RlZC5cIik7XG4gICAgICB9XG4gICAgICBmb3IgKGxldCBiYyA9IDAsIGJzID0gMCwgYnVmZmVyLCBpID0gMDsgYnVmZmVyID0gc3RyLmNoYXJBdChpKyspO1xuXG4gICAgICAgIH5idWZmZXIgJiYgKGJzID0gYmMgJSA0ID8gYnMgKiA2NCArIGJ1ZmZlciA6IGJ1ZmZlcixcbiAgICAgICAgICBiYysrICUgNCkgPyBvdXRwdXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZSgyNTUgJiBicyA+PiAoLTIgKiBiYyAmIDYpKSA6IDBcbiAgICAgICkge1xuICAgICAgICBidWZmZXIgPSBjaGFycy5pbmRleE9mKGJ1ZmZlcik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfTtcbiAgfVxuXG4gIGlmICh0eXBlb2Ygd2luZG93ID09ICd1bmRlZmluZWQnKSB7XG4gICAgZ2xvYmFsLndpbmRvdyA9IHtcbiAgICAgIFdlYlNvY2tldDogV2ViU29ja2V0UHJvdmlkZXIsXG4gICAgICBYTUxIdHRwUmVxdWVzdDogWEhSUHJvdmlkZXIsXG4gICAgICBpbmRleGVkREI6IEluZGV4ZWREQlByb3ZpZGVyLFxuICAgICAgVVJMOiB7XG4gICAgICAgIGNyZWF0ZU9iamVjdFVSTDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5hYmxlIHRvIHVzZSBVUkwuY3JlYXRlT2JqZWN0VVJMIGluIGEgbm9uLWJyb3dzZXIgYXBwbGljYXRpb25cIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBDb25uZWN0aW9uLnNldE5ldHdvcmtQcm92aWRlcnMoV2ViU29ja2V0UHJvdmlkZXIsIFhIUlByb3ZpZGVyKTtcbiAgTGFyZ2VGaWxlSGVscGVyLnNldE5ldHdvcmtQcm92aWRlcihYSFJQcm92aWRlcik7XG4gIERCQ2FjaGUuc2V0RGF0YWJhc2VQcm92aWRlcihJbmRleGVkREJQcm92aWRlcik7XG59XG5cbi8vIERldGVjdCBmaW5kIG1vc3QgdXNlZnVsIG5ldHdvcmsgdHJhbnNwb3J0LlxuZnVuY3Rpb24gZGV0ZWN0VHJhbnNwb3J0KCkge1xuICBpZiAodHlwZW9mIHdpbmRvdyA9PSAnb2JqZWN0Jykge1xuICAgIGlmICh3aW5kb3dbJ1dlYlNvY2tldCddKSB7XG4gICAgICByZXR1cm4gJ3dzJztcbiAgICB9IGVsc2UgaWYgKHdpbmRvd1snWE1MSHR0cFJlcXVlc3QnXSkge1xuICAgICAgLy8gVGhlIGJyb3dzZXIgb3Igbm9kZSBoYXMgbm8gd2Vic29ja2V0cywgdXNpbmcgbG9uZyBwb2xsaW5nLlxuICAgICAgcmV0dXJuICdscCc7XG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG4vLyBidG9hIHJlcGxhY2VtZW50LiBTdG9jayBidG9hIGZhaWxzIG9uIG9uIG5vbi1MYXRpbjEgc3RyaW5ncy5cbmZ1bmN0aW9uIGI2NEVuY29kZVVuaWNvZGUoc3RyKSB7XG4gIC8vIFRoZSBlbmNvZGVVUklDb21wb25lbnQgcGVyY2VudC1lbmNvZGVzIFVURi04IHN0cmluZyxcbiAgLy8gdGhlbiB0aGUgcGVyY2VudCBlbmNvZGluZyBpcyBjb252ZXJ0ZWQgaW50byByYXcgYnl0ZXMgd2hpY2hcbiAgLy8gY2FuIGJlIGZlZCBpbnRvIGJ0b2EuXG4gIHJldHVybiBidG9hKGVuY29kZVVSSUNvbXBvbmVudChzdHIpLnJlcGxhY2UoLyUoWzAtOUEtRl17Mn0pL2csXG4gICAgZnVuY3Rpb24gdG9Tb2xpZEJ5dGVzKG1hdGNoLCBwMSkge1xuICAgICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoJzB4JyArIHAxKTtcbiAgICB9KSk7XG59XG5cbi8vIEpTT04gc3RyaW5naWZ5IGhlbHBlciAtIHByZS1wcm9jZXNzb3IgZm9yIEpTT04uc3RyaW5naWZ5XG5mdW5jdGlvbiBqc29uQnVpbGRIZWxwZXIoa2V5LCB2YWwpIHtcbiAgaWYgKHZhbCBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAvLyBDb252ZXJ0IGphdmFzY3JpcHQgRGF0ZSBvYmplY3RzIHRvIHJmYzMzMzkgc3RyaW5nc1xuICAgIHZhbCA9IHJmYzMzMzlEYXRlU3RyaW5nKHZhbCk7XG4gIH0gZWxzZSBpZiAodmFsIGluc3RhbmNlb2YgQWNjZXNzTW9kZSkge1xuICAgIHZhbCA9IHZhbC5qc29uSGVscGVyKCk7XG4gIH0gZWxzZSBpZiAodmFsID09PSB1bmRlZmluZWQgfHwgdmFsID09PSBudWxsIHx8IHZhbCA9PT0gZmFsc2UgfHxcbiAgICAoQXJyYXkuaXNBcnJheSh2YWwpICYmIHZhbC5sZW5ndGggPT0gMCkgfHxcbiAgICAoKHR5cGVvZiB2YWwgPT0gJ29iamVjdCcpICYmIChPYmplY3Qua2V5cyh2YWwpLmxlbmd0aCA9PSAwKSkpIHtcbiAgICAvLyBzdHJpcCBvdXQgZW1wdHkgZWxlbWVudHMgd2hpbGUgc2VyaWFsaXppbmcgb2JqZWN0cyB0byBKU09OXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHJldHVybiB2YWw7XG59O1xuXG4vLyBUcmltcyB2ZXJ5IGxvbmcgc3RyaW5ncyAoZW5jb2RlZCBpbWFnZXMpIHRvIG1ha2UgbG9nZ2VkIHBhY2tldHMgbW9yZSByZWFkYWJsZS5cbmZ1bmN0aW9uIGpzb25Mb2dnZXJIZWxwZXIoa2V5LCB2YWwpIHtcbiAgaWYgKHR5cGVvZiB2YWwgPT0gJ3N0cmluZycgJiYgdmFsLmxlbmd0aCA+IDEyOCkge1xuICAgIHJldHVybiAnPCcgKyB2YWwubGVuZ3RoICsgJywgYnl0ZXM6ICcgKyB2YWwuc3Vic3RyaW5nKDAsIDEyKSArICcuLi4nICsgdmFsLnN1YnN0cmluZyh2YWwubGVuZ3RoIC0gMTIpICsgJz4nO1xuICB9XG4gIHJldHVybiBqc29uQnVpbGRIZWxwZXIoa2V5LCB2YWwpO1xufTtcblxuLy8gUGFyc2UgYnJvd3NlciB1c2VyIGFnZW50IHRvIGV4dHJhY3QgYnJvd3NlciBuYW1lIGFuZCB2ZXJzaW9uLlxuZnVuY3Rpb24gZ2V0QnJvd3NlckluZm8odWEsIHByb2R1Y3QpIHtcbiAgdWEgPSB1YSB8fCAnJztcbiAgbGV0IHJlYWN0bmF0aXZlID0gJyc7XG4gIC8vIENoZWNrIGlmIHRoaXMgaXMgYSBSZWFjdE5hdGl2ZSBhcHAuXG4gIGlmICgvcmVhY3RuYXRpdmUvaS50ZXN0KHByb2R1Y3QpKSB7XG4gICAgcmVhY3RuYXRpdmUgPSAnUmVhY3ROYXRpdmU7ICc7XG4gIH1cbiAgbGV0IHJlc3VsdDtcbiAgLy8gUmVtb3ZlIHVzZWxlc3Mgc3RyaW5nLlxuICB1YSA9IHVhLnJlcGxhY2UoJyAoS0hUTUwsIGxpa2UgR2Vja28pJywgJycpO1xuICAvLyBUZXN0IGZvciBXZWJLaXQtYmFzZWQgYnJvd3Nlci5cbiAgbGV0IG0gPSB1YS5tYXRjaCgvKEFwcGxlV2ViS2l0XFwvWy5cXGRdKykvaSk7XG4gIGlmIChtKSB7XG4gICAgLy8gTGlzdCBvZiBjb21tb24gc3RyaW5ncywgZnJvbSBtb3JlIHVzZWZ1bCB0byBsZXNzIHVzZWZ1bC5cbiAgICAvLyBBbGwgdW5rbm93biBzdHJpbmdzIGdldCB0aGUgaGlnaGVzdCAoLTEpIHByaW9yaXR5LlxuICAgIGNvbnN0IHByaW9yaXR5ID0gWydlZGcnLCAnY2hyb21lJywgJ3NhZmFyaScsICdtb2JpbGUnLCAndmVyc2lvbiddO1xuICAgIGxldCB0bXAgPSB1YS5zdWJzdHIobS5pbmRleCArIG1bMF0ubGVuZ3RoKS5zcGxpdCgnICcpO1xuICAgIGxldCB0b2tlbnMgPSBbXTtcbiAgICBsZXQgdmVyc2lvbjsgLy8gMS4wIGluIFZlcnNpb24vMS4wIG9yIHVuZGVmaW5lZDtcbiAgICAvLyBTcGxpdCBzdHJpbmcgbGlrZSAnTmFtZS8wLjAuMCcgaW50byBbJ05hbWUnLCAnMC4wLjAnLCAzXSB3aGVyZSB0aGUgbGFzdCBlbGVtZW50IGlzIHRoZSBwcmlvcml0eS5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRtcC5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IG0yID0gLyhbXFx3Ll0rKVtcXC9dKFtcXC5cXGRdKykvLmV4ZWModG1wW2ldKTtcbiAgICAgIGlmIChtMikge1xuICAgICAgICAvLyBVbmtub3duIHZhbHVlcyBhcmUgaGlnaGVzdCBwcmlvcml0eSAoLTEpLlxuICAgICAgICB0b2tlbnMucHVzaChbbTJbMV0sIG0yWzJdLCBwcmlvcml0eS5maW5kSW5kZXgoKGUpID0+IHtcbiAgICAgICAgICByZXR1cm4gbTJbMV0udG9Mb3dlckNhc2UoKS5zdGFydHNXaXRoKGUpO1xuICAgICAgICB9KV0pO1xuICAgICAgICBpZiAobTJbMV0gPT0gJ1ZlcnNpb24nKSB7XG4gICAgICAgICAgdmVyc2lvbiA9IG0yWzJdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIC8vIFNvcnQgYnkgcHJpb3JpdHk6IG1vcmUgaW50ZXJlc3RpbmcgaXMgZWFybGllciB0aGFuIGxlc3MgaW50ZXJlc3RpbmcuXG4gICAgdG9rZW5zLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgIHJldHVybiBhWzJdIC0gYlsyXTtcbiAgICB9KTtcbiAgICBpZiAodG9rZW5zLmxlbmd0aCA+IDApIHtcbiAgICAgIC8vIFJldHVybiB0aGUgbGVhc3QgY29tbW9uIGJyb3dzZXIgc3RyaW5nIGFuZCB2ZXJzaW9uLlxuICAgICAgaWYgKHRva2Vuc1swXVswXS50b0xvd2VyQ2FzZSgpLnN0YXJ0c1dpdGgoJ2VkZycpKSB7XG4gICAgICAgIHRva2Vuc1swXVswXSA9ICdFZGdlJztcbiAgICAgIH0gZWxzZSBpZiAodG9rZW5zWzBdWzBdID09ICdPUFInKSB7XG4gICAgICAgIHRva2Vuc1swXVswXSA9ICdPcGVyYSc7XG4gICAgICB9IGVsc2UgaWYgKHRva2Vuc1swXVswXSA9PSAnU2FmYXJpJyAmJiB2ZXJzaW9uKSB7XG4gICAgICAgIHRva2Vuc1swXVsxXSA9IHZlcnNpb247XG4gICAgICB9XG4gICAgICByZXN1bHQgPSB0b2tlbnNbMF1bMF0gKyAnLycgKyB0b2tlbnNbMF1bMV07XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEZhaWxlZCB0byBJRCB0aGUgYnJvd3Nlci4gUmV0dXJuIHRoZSB3ZWJraXQgdmVyc2lvbi5cbiAgICAgIHJlc3VsdCA9IG1bMV07XG4gICAgfVxuICB9IGVsc2UgaWYgKC9maXJlZm94L2kudGVzdCh1YSkpIHtcbiAgICBtID0gL0ZpcmVmb3hcXC8oWy5cXGRdKykvZy5leGVjKHVhKTtcbiAgICBpZiAobSkge1xuICAgICAgcmVzdWx0ID0gJ0ZpcmVmb3gvJyArIG1bMV07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdCA9ICdGaXJlZm94Lz8nO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvLyBOZWl0aGVyIEFwcGxlV2ViS2l0IG5vciBGaXJlZm94LiBUcnkgdGhlIGxhc3QgcmVzb3J0LlxuICAgIG0gPSAvKFtcXHcuXSspXFwvKFsuXFxkXSspLy5leGVjKHVhKTtcbiAgICBpZiAobSkge1xuICAgICAgcmVzdWx0ID0gbVsxXSArICcvJyArIG1bMl07XG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSB1YS5zcGxpdCgnICcpO1xuICAgICAgcmVzdWx0ID0gbVswXTtcbiAgICB9XG4gIH1cblxuICAvLyBTaG9ydGVuIHRoZSB2ZXJzaW9uIHRvIG9uZSBkb3QgJ2EuYmIuY2NjLmQgLT4gYS5iYicgYXQgbW9zdC5cbiAgbSA9IHJlc3VsdC5zcGxpdCgnLycpO1xuICBpZiAobS5sZW5ndGggPiAxKSB7XG4gICAgY29uc3QgdiA9IG1bMV0uc3BsaXQoJy4nKTtcbiAgICBjb25zdCBtaW5vciA9IHZbMV0gPyAnLicgKyB2WzFdLnN1YnN0cigwLCAyKSA6ICcnO1xuICAgIHJlc3VsdCA9IGAke21bMF19LyR7dlswXX0ke21pbm9yfWA7XG4gIH1cbiAgcmV0dXJuIHJlYWN0bmF0aXZlICsgcmVzdWx0O1xufVxuXG4vKipcbiAqIFRoZSBtYWluIGNsYXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIFRpbm9kZSBzZXJ2ZXIuXG4gKi9cbmV4cG9ydCBjbGFzcyBUaW5vZGUge1xuICBfaG9zdDtcbiAgX3NlY3VyZTtcblxuICBfYXBwTmFtZTtcblxuICAvLyBBUEkgS2V5LlxuICBfYXBpS2V5O1xuXG4gIC8vIE5hbWUgYW5kIHZlcnNpb24gb2YgdGhlIGJyb3dzZXIuXG4gIF9icm93c2VyID0gJyc7XG4gIF9wbGF0Zm9ybTtcbiAgLy8gSGFyZHdhcmVcbiAgX2h3b3MgPSAndW5kZWZpbmVkJztcbiAgX2h1bWFuTGFuZ3VhZ2UgPSAneHgnO1xuXG4gIC8vIExvZ2dpbmcgdG8gY29uc29sZSBlbmFibGVkXG4gIF9sb2dnaW5nRW5hYmxlZCA9IGZhbHNlO1xuICAvLyBXaGVuIGxvZ2dpbmcsIHRyaXAgbG9uZyBzdHJpbmdzIChiYXNlNjQtZW5jb2RlZCBpbWFnZXMpIGZvciByZWFkYWJpbGl0eVxuICBfdHJpbUxvbmdTdHJpbmdzID0gZmFsc2U7XG4gIC8vIFVJRCBvZiB0aGUgY3VycmVudGx5IGF1dGhlbnRpY2F0ZWQgdXNlci5cbiAgX215VUlEID0gbnVsbDtcbiAgLy8gU3RhdHVzIG9mIGNvbm5lY3Rpb246IGF1dGhlbnRpY2F0ZWQgb3Igbm90LlxuICBfYXV0aGVudGljYXRlZCA9IGZhbHNlO1xuICAvLyBMb2dpbiB1c2VkIGluIHRoZSBsYXN0IHN1Y2Nlc3NmdWwgYmFzaWMgYXV0aGVudGljYXRpb25cbiAgX2xvZ2luID0gbnVsbDtcbiAgLy8gVG9rZW4gd2hpY2ggY2FuIGJlIHVzZWQgZm9yIGxvZ2luIGluc3RlYWQgb2YgbG9naW4vcGFzc3dvcmQuXG4gIF9hdXRoVG9rZW4gPSBudWxsO1xuICAvLyBDb3VudGVyIG9mIHJlY2VpdmVkIHBhY2tldHNcbiAgX2luUGFja2V0Q291bnQgPSAwO1xuICAvLyBDb3VudGVyIGZvciBnZW5lcmF0aW5nIHVuaXF1ZSBtZXNzYWdlIElEc1xuICBfbWVzc2FnZUlkID0gTWF0aC5mbG9vcigoTWF0aC5yYW5kb20oKSAqIDB4RkZGRikgKyAweEZGRkYpO1xuICAvLyBJbmZvcm1hdGlvbiBhYm91dCB0aGUgc2VydmVyLCBpZiBjb25uZWN0ZWRcbiAgX3NlcnZlckluZm8gPSBudWxsO1xuICAvLyBQdXNoIG5vdGlmaWNhdGlvbiB0b2tlbi4gQ2FsbGVkIGRldmljZVRva2VuIGZvciBjb25zaXN0ZW5jeSB3aXRoIHRoZSBBbmRyb2lkIFNESy5cbiAgX2RldmljZVRva2VuID0gbnVsbDtcblxuICAvLyBDYWNoZSBvZiBwZW5kaW5nIHByb21pc2VzIGJ5IG1lc3NhZ2UgaWQuXG4gIF9wZW5kaW5nUHJvbWlzZXMgPSB7fTtcbiAgLy8gVGhlIFRpbWVvdXQgb2JqZWN0IHJldHVybmVkIGJ5IHRoZSByZWplY3QgZXhwaXJlZCBwcm9taXNlcyBzZXRJbnRlcnZhbC5cbiAgX2V4cGlyZVByb21pc2VzID0gbnVsbDtcblxuICAvLyBXZWJzb2NrZXQgb3IgbG9uZyBwb2xsaW5nIGNvbm5lY3Rpb24uXG4gIF9jb25uZWN0aW9uID0gbnVsbDtcblxuICAvLyBVc2UgaW5kZXhEQiBmb3IgY2FjaGluZyB0b3BpY3MgYW5kIG1lc3NhZ2VzLlxuICBfcGVyc2lzdCA9IGZhbHNlO1xuICAvLyBJbmRleGVkREIgd3JhcHBlciBvYmplY3QuXG4gIF9kYiA9IG51bGw7XG5cbiAgLy8gVGlub2RlJ3MgY2FjaGUgb2Ygb2JqZWN0c1xuICBfY2FjaGUgPSB7fTtcblxuICAvKipcbiAgICogQ3JlYXRlIFRpbm9kZSBvYmplY3QuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgLSBjb25maWd1cmF0aW9uIHBhcmFtZXRlcnMuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjb25maWcuYXBwTmFtZSAtIE5hbWUgb2YgdGhlIGNhbGxpbmcgYXBwbGljYXRpb24gdG8gYmUgcmVwb3J0ZWQgaW4gdGhlIFVzZXIgQWdlbnQuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjb25maWcuaG9zdCAtIEhvc3QgbmFtZSBhbmQgb3B0aW9uYWwgcG9ydCBudW1iZXIgdG8gY29ubmVjdCB0by5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGNvbmZpZy5hcGlLZXkgLSBBUEkga2V5IGdlbmVyYXRlZCBieSA8Y29kZT5rZXlnZW48L2NvZGU+LlxuICAgKiBAcGFyYW0ge3N0cmluZ30gY29uZmlnLnRyYW5zcG9ydCAtIFNlZSB7QGxpbmsgVGlub2RlLkNvbm5lY3Rpb24jdHJhbnNwb3J0fS5cbiAgICogQHBhcmFtIHtib29sZWFufSBjb25maWcuc2VjdXJlIC0gVXNlIFNlY3VyZSBXZWJTb2NrZXQgaWYgPGNvZGU+dHJ1ZTwvY29kZT4uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjb25maWcucGxhdGZvcm0gLSBPcHRpb25hbCBwbGF0Zm9ybSBpZGVudGlmaWVyLCBvbmUgb2YgPGNvZGU+XCJpb3NcIjwvY29kZT4sIDxjb2RlPlwid2ViXCI8L2NvZGU+LCA8Y29kZT5cImFuZHJvaWRcIjwvY29kZT4uXG4gICAqIEBwYXJhbSB7Ym9vbGVufSBjb25maWcucGVyc2lzdCAtIFVzZSBJbmRleGVkREIgcGVyc2lzdGVudCBzdG9yYWdlLlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBvbkNvbXBsZXRlIC0gY2FsbGJhY2sgdG8gY2FsbCB3aGVuIGluaXRpYWxpemF0aW9uIGlzIGNvbXBsZXRlZC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGNvbmZpZywgb25Db21wbGV0ZSkge1xuICAgIHRoaXMuX2hvc3QgPSBjb25maWcuaG9zdDtcbiAgICB0aGlzLl9zZWN1cmUgPSBjb25maWcuc2VjdXJlO1xuXG4gICAgLy8gQ2xpZW50LXByb3ZpZGVkIGFwcGxpY2F0aW9uIG5hbWUsIGZvcm1hdCA8TmFtZT4vPHZlcnNpb24gbnVtYmVyPlxuICAgIHRoaXMuX2FwcE5hbWUgPSBjb25maWcuYXBwTmFtZSB8fCBcIlVuZGVmaW5lZFwiO1xuXG4gICAgLy8gQVBJIEtleS5cbiAgICB0aGlzLl9hcGlLZXkgPSBjb25maWcuYXBpS2V5O1xuXG4gICAgLy8gTmFtZSBhbmQgdmVyc2lvbiBvZiB0aGUgYnJvd3Nlci5cbiAgICB0aGlzLl9wbGF0Zm9ybSA9IGNvbmZpZy5wbGF0Zm9ybSB8fCAnd2ViJztcbiAgICAvLyBVbmRlcmx5aW5nIE9TLlxuICAgIGlmICh0eXBlb2YgbmF2aWdhdG9yICE9ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aGlzLl9icm93c2VyID0gZ2V0QnJvd3NlckluZm8obmF2aWdhdG9yLnVzZXJBZ2VudCwgbmF2aWdhdG9yLnByb2R1Y3QpO1xuICAgICAgdGhpcy5faHdvcyA9IG5hdmlnYXRvci5wbGF0Zm9ybTtcbiAgICAgIC8vIFRoaXMgaXMgdGhlIGRlZmF1bHQgbGFuZ3VhZ2UuIEl0IGNvdWxkIGJlIGNoYW5nZWQgYnkgY2xpZW50LlxuICAgICAgdGhpcy5faHVtYW5MYW5ndWFnZSA9IG5hdmlnYXRvci5sYW5ndWFnZSB8fCAnZW4tVVMnO1xuICAgIH1cblxuICAgIENvbm5lY3Rpb24ubG9nZ2VyID0gdGhpcy5sb2dnZXI7XG4gICAgRHJhZnR5LmxvZ2dlciA9IHRoaXMubG9nZ2VyO1xuXG4gICAgLy8gV2ViU29ja2V0IG9yIGxvbmcgcG9sbGluZyBuZXR3b3JrIGNvbm5lY3Rpb24uXG4gICAgaWYgKGNvbmZpZy50cmFuc3BvcnQgIT0gJ2xwJyAmJiBjb25maWcudHJhbnNwb3J0ICE9ICd3cycpIHtcbiAgICAgIGNvbmZpZy50cmFuc3BvcnQgPSBkZXRlY3RUcmFuc3BvcnQoKTtcbiAgICB9XG4gICAgdGhpcy5fY29ubmVjdGlvbiA9IG5ldyBDb25uZWN0aW9uKGNvbmZpZywgQ29uc3QuUFJPVE9DT0xfVkVSU0lPTiwgLyogYXV0b3JlY29ubmVjdCAqLyB0cnVlKTtcbiAgICB0aGlzLl9jb25uZWN0aW9uLm9uTWVzc2FnZSA9IChkYXRhKSA9PiB7XG4gICAgICAvLyBDYWxsIHRoZSBtYWluIG1lc3NhZ2UgZGlzcGF0Y2hlci5cbiAgICAgIHRoaXMuI2Rpc3BhdGNoTWVzc2FnZShkYXRhKTtcbiAgICB9XG5cbiAgICAvLyBSZWFkeSB0byBzdGFydCBzZW5kaW5nLlxuICAgIHRoaXMuX2Nvbm5lY3Rpb24ub25PcGVuID0gXyA9PiB0aGlzLiNjb25uZWN0aW9uT3BlbigpO1xuICAgIHRoaXMuX2Nvbm5lY3Rpb24ub25EaXNjb25uZWN0ID0gKGVyciwgY29kZSkgPT4gdGhpcy4jZGlzY29ubmVjdGVkKGVyciwgY29kZSk7XG5cbiAgICAvLyBXcmFwcGVyIGZvciB0aGUgcmVjb25uZWN0IGl0ZXJhdG9yIGNhbGxiYWNrLlxuICAgIHRoaXMuX2Nvbm5lY3Rpb24ub25BdXRvcmVjb25uZWN0SXRlcmF0aW9uID0gKHRpbWVvdXQsIHByb21pc2UpID0+IHtcbiAgICAgIGlmICh0aGlzLm9uQXV0b3JlY29ubmVjdEl0ZXJhdGlvbikge1xuICAgICAgICB0aGlzLm9uQXV0b3JlY29ubmVjdEl0ZXJhdGlvbih0aW1lb3V0LCBwcm9taXNlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLl9wZXJzaXN0ID0gY29uZmlnLnBlcnNpc3Q7XG4gICAgLy8gSW5pdGlhbGl6ZSBvYmplY3QgcmVnYXJkbGVzcy4gSXQgc2ltcGxpZmllcyB0aGUgY29kZS5cbiAgICB0aGlzLl9kYiA9IG5ldyBEQkNhY2hlKGVyciA9PiB7XG4gICAgICB0aGlzLmxvZ2dlcignREInLCBlcnIpO1xuICAgIH0sIHRoaXMubG9nZ2VyKTtcblxuICAgIGlmICh0aGlzLl9wZXJzaXN0KSB7XG4gICAgICAvLyBDcmVhdGUgdGhlIHBlcnNpc3RlbnQgY2FjaGUuXG4gICAgICAvLyBTdG9yZSBwcm9taXNlcyB0byBiZSByZXNvbHZlZCB3aGVuIG1lc3NhZ2VzIGxvYWQgaW50byBtZW1vcnkuXG4gICAgICBjb25zdCBwcm9tID0gW107XG4gICAgICB0aGlzLl9kYi5pbml0RGF0YWJhc2UoKS50aGVuKF8gPT4ge1xuICAgICAgICAvLyBGaXJzdCBsb2FkIHRvcGljcyBpbnRvIG1lbW9yeS5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2RiLm1hcFRvcGljcygoZGF0YSkgPT4ge1xuICAgICAgICAgIGxldCB0b3BpYyA9IHRoaXMuI2NhY2hlR2V0KCd0b3BpYycsIGRhdGEubmFtZSk7XG4gICAgICAgICAgaWYgKHRvcGljKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChkYXRhLm5hbWUgPT0gQ29uc3QuVE9QSUNfTUUpIHtcbiAgICAgICAgICAgIHRvcGljID0gbmV3IFRvcGljTWUoKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGRhdGEubmFtZSA9PSBDb25zdC5UT1BJQ19GTkQpIHtcbiAgICAgICAgICAgIHRvcGljID0gbmV3IFRvcGljRm5kKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRvcGljID0gbmV3IFRvcGljKGRhdGEubmFtZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuX2RiLmRlc2VyaWFsaXplVG9waWModG9waWMsIGRhdGEpO1xuICAgICAgICAgIHRoaXMuI2F0dGFjaENhY2hlVG9Ub3BpYyh0b3BpYyk7XG4gICAgICAgICAgdG9waWMuX2NhY2hlUHV0U2VsZigpO1xuICAgICAgICAgIC8vIFRvcGljIGxvYWRlZCBmcm9tIERCIGlzIG5vdCBuZXcuXG4gICAgICAgICAgZGVsZXRlIHRvcGljLl9uZXc7XG4gICAgICAgICAgLy8gUmVxdWVzdCB0byBsb2FkIG1lc3NhZ2VzIGFuZCBzYXZlIHRoZSBwcm9taXNlLlxuICAgICAgICAgIHByb20ucHVzaCh0b3BpYy5fbG9hZE1lc3NhZ2VzKHRoaXMuX2RiKSk7XG4gICAgICAgIH0pO1xuICAgICAgfSkudGhlbihfID0+IHtcbiAgICAgICAgLy8gVGhlbiBsb2FkIHVzZXJzLlxuICAgICAgICByZXR1cm4gdGhpcy5fZGIubWFwVXNlcnMoKGRhdGEpID0+IHtcbiAgICAgICAgICB0aGlzLiNjYWNoZVB1dCgndXNlcicsIGRhdGEudWlkLCBtZXJnZU9iaih7fSwgZGF0YS5wdWJsaWMpKTtcbiAgICAgICAgfSk7XG4gICAgICB9KS50aGVuKF8gPT4ge1xuICAgICAgICAvLyBOb3cgd2FpdCBmb3IgYWxsIG1lc3NhZ2VzIHRvIGZpbmlzaCBsb2FkaW5nLlxuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbSk7XG4gICAgICB9KS50aGVuKF8gPT4ge1xuICAgICAgICBpZiAob25Db21wbGV0ZSkge1xuICAgICAgICAgIG9uQ29tcGxldGUoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxvZ2dlcihcIlBlcnNpc3RlbnQgY2FjaGUgaW5pdGlhbGl6ZWQuXCIpO1xuICAgICAgfSkuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgaWYgKG9uQ29tcGxldGUpIHtcbiAgICAgICAgICBvbkNvbXBsZXRlKGVycik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sb2dnZXIoXCJGYWlsZWQgdG8gaW5pdGlhbGl6ZSBwZXJzaXN0ZW50IGNhY2hlOlwiLCBlcnIpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2RiLmRlbGV0ZURhdGFiYXNlKCkudGhlbihfID0+IHtcbiAgICAgICAgaWYgKG9uQ29tcGxldGUpIHtcbiAgICAgICAgICBvbkNvbXBsZXRlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8vIFByaXZhdGUgbWV0aG9kcy5cblxuICAvLyBDb25zb2xlIGxvZ2dlci4gQmFiZWwgc29tZWhvdyBmYWlscyB0byBwYXJzZSAnLi4ucmVzdCcgcGFyYW1ldGVyLlxuICBsb2dnZXIoc3RyLCAuLi5hcmdzKSB7XG4gICAgaWYgKHRoaXMuX2xvZ2dpbmdFbmFibGVkKSB7XG4gICAgICBjb25zdCBkID0gbmV3IERhdGUoKTtcbiAgICAgIGNvbnN0IGRhdGVTdHJpbmcgPSAoJzAnICsgZC5nZXRVVENIb3VycygpKS5zbGljZSgtMikgKyAnOicgK1xuICAgICAgICAoJzAnICsgZC5nZXRVVENNaW51dGVzKCkpLnNsaWNlKC0yKSArICc6JyArXG4gICAgICAgICgnMCcgKyBkLmdldFVUQ1NlY29uZHMoKSkuc2xpY2UoLTIpICsgJy4nICtcbiAgICAgICAgKCcwMCcgKyBkLmdldFVUQ01pbGxpc2Vjb25kcygpKS5zbGljZSgtMyk7XG5cbiAgICAgIGNvbnNvbGUubG9nKCdbJyArIGRhdGVTdHJpbmcgKyAnXScsIHN0ciwgYXJncy5qb2luKCcgJykpO1xuICAgIH1cbiAgfVxuXG4gIC8vIEdlbmVyYXRvciBvZiBkZWZhdWx0IHByb21pc2VzIGZvciBzZW50IHBhY2tldHMuXG4gICNtYWtlUHJvbWlzZShpZCkge1xuICAgIGxldCBwcm9taXNlID0gbnVsbDtcbiAgICBpZiAoaWQpIHtcbiAgICAgIHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIC8vIFN0b3JlZCBjYWxsYmFja3Mgd2lsbCBiZSBjYWxsZWQgd2hlbiB0aGUgcmVzcG9uc2UgcGFja2V0IHdpdGggdGhpcyBJZCBhcnJpdmVzXG4gICAgICAgIHRoaXMuX3BlbmRpbmdQcm9taXNlc1tpZF0gPSB7XG4gICAgICAgICAgJ3Jlc29sdmUnOiByZXNvbHZlLFxuICAgICAgICAgICdyZWplY3QnOiByZWplY3QsXG4gICAgICAgICAgJ3RzJzogbmV3IERhdGUoKVxuICAgICAgICB9O1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBwcm9taXNlO1xuICB9O1xuXG4gIC8vIFJlc29sdmUgb3IgcmVqZWN0IGEgcGVuZGluZyBwcm9taXNlLlxuICAvLyBVbnJlc29sdmVkIHByb21pc2VzIGFyZSBzdG9yZWQgaW4gX3BlbmRpbmdQcm9taXNlcy5cbiAgI2V4ZWNQcm9taXNlKGlkLCBjb2RlLCBvbk9LLCBlcnJvclRleHQpIHtcbiAgICBjb25zdCBjYWxsYmFja3MgPSB0aGlzLl9wZW5kaW5nUHJvbWlzZXNbaWRdO1xuICAgIGlmIChjYWxsYmFja3MpIHtcbiAgICAgIGRlbGV0ZSB0aGlzLl9wZW5kaW5nUHJvbWlzZXNbaWRdO1xuICAgICAgaWYgKGNvZGUgPj0gMjAwICYmIGNvZGUgPCA0MDApIHtcbiAgICAgICAgaWYgKGNhbGxiYWNrcy5yZXNvbHZlKSB7XG4gICAgICAgICAgY2FsbGJhY2tzLnJlc29sdmUob25PSyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoY2FsbGJhY2tzLnJlamVjdCkge1xuICAgICAgICBjYWxsYmFja3MucmVqZWN0KG5ldyBFcnJvcihgJHtlcnJvclRleHR9ICgke2NvZGV9KWApKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBTZW5kIGEgcGFja2V0LiBJZiBwYWNrZXQgaWQgaXMgcHJvdmlkZWQgcmV0dXJuIGEgcHJvbWlzZS5cbiAgI3NlbmQocGt0LCBpZCkge1xuICAgIGxldCBwcm9taXNlO1xuICAgIGlmIChpZCkge1xuICAgICAgcHJvbWlzZSA9IHRoaXMuI21ha2VQcm9taXNlKGlkKTtcbiAgICB9XG4gICAgcGt0ID0gc2ltcGxpZnkocGt0KTtcbiAgICBsZXQgbXNnID0gSlNPTi5zdHJpbmdpZnkocGt0KTtcbiAgICB0aGlzLmxvZ2dlcihcIm91dDogXCIgKyAodGhpcy5fdHJpbUxvbmdTdHJpbmdzID8gSlNPTi5zdHJpbmdpZnkocGt0LCBqc29uTG9nZ2VySGVscGVyKSA6IG1zZykpO1xuICAgIHRyeSB7XG4gICAgICB0aGlzLl9jb25uZWN0aW9uLnNlbmRUZXh0KG1zZyk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAvLyBJZiBzZW5kVGV4dCB0aHJvd3MsIHdyYXAgdGhlIGVycm9yIGluIGEgcHJvbWlzZSBvciByZXRocm93LlxuICAgICAgaWYgKGlkKSB7XG4gICAgICAgIHRoaXMuI2V4ZWNQcm9taXNlKGlkLCBDb25uZWN0aW9uLk5FVFdPUktfRVJST1IsIG51bGwsIGVyci5tZXNzYWdlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IGVycjtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICAvLyBUaGUgbWFpbiBtZXNzYWdlIGRpc3BhdGNoZXIuXG4gICNkaXNwYXRjaE1lc3NhZ2UoZGF0YSkge1xuICAgIC8vIFNraXAgZW1wdHkgcmVzcG9uc2UuIFRoaXMgaGFwcGVucyB3aGVuIExQIHRpbWVzIG91dC5cbiAgICBpZiAoIWRhdGEpXG4gICAgICByZXR1cm47XG5cbiAgICB0aGlzLl9pblBhY2tldENvdW50Kys7XG5cbiAgICAvLyBTZW5kIHJhdyBtZXNzYWdlIHRvIGxpc3RlbmVyXG4gICAgaWYgKHRoaXMub25SYXdNZXNzYWdlKSB7XG4gICAgICB0aGlzLm9uUmF3TWVzc2FnZShkYXRhKTtcbiAgICB9XG5cbiAgICBpZiAoZGF0YSA9PT0gJzAnKSB7XG4gICAgICAvLyBTZXJ2ZXIgcmVzcG9uc2UgdG8gYSBuZXR3b3JrIHByb2JlLlxuICAgICAgaWYgKHRoaXMub25OZXR3b3JrUHJvYmUpIHtcbiAgICAgICAgdGhpcy5vbk5ldHdvcmtQcm9iZSgpO1xuICAgICAgfVxuICAgICAgLy8gTm8gcHJvY2Vzc2luZyBpcyBuZWNlc3NhcnkuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IHBrdCA9IEpTT04ucGFyc2UoZGF0YSwganNvblBhcnNlSGVscGVyKTtcbiAgICBpZiAoIXBrdCkge1xuICAgICAgdGhpcy5sb2dnZXIoXCJpbjogXCIgKyBkYXRhKTtcbiAgICAgIHRoaXMubG9nZ2VyKFwiRVJST1I6IGZhaWxlZCB0byBwYXJzZSBkYXRhXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmxvZ2dlcihcImluOiBcIiArICh0aGlzLl90cmltTG9uZ1N0cmluZ3MgPyBKU09OLnN0cmluZ2lmeShwa3QsIGpzb25Mb2dnZXJIZWxwZXIpIDogZGF0YSkpO1xuXG4gICAgICAvLyBTZW5kIGNvbXBsZXRlIHBhY2tldCB0byBsaXN0ZW5lclxuICAgICAgaWYgKHRoaXMub25NZXNzYWdlKSB7XG4gICAgICAgIHRoaXMub25NZXNzYWdlKHBrdCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChwa3QuY3RybCkge1xuICAgICAgICAvLyBIYW5kbGluZyB7Y3RybH0gbWVzc2FnZVxuICAgICAgICBpZiAodGhpcy5vbkN0cmxNZXNzYWdlKSB7XG4gICAgICAgICAgdGhpcy5vbkN0cmxNZXNzYWdlKHBrdC5jdHJsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJlc29sdmUgb3IgcmVqZWN0IGEgcGVuZGluZyBwcm9taXNlLCBpZiBhbnlcbiAgICAgICAgaWYgKHBrdC5jdHJsLmlkKSB7XG4gICAgICAgICAgdGhpcy4jZXhlY1Byb21pc2UocGt0LmN0cmwuaWQsIHBrdC5jdHJsLmNvZGUsIHBrdC5jdHJsLCBwa3QuY3RybC50ZXh0KTtcbiAgICAgICAgfVxuICAgICAgICBzZXRUaW1lb3V0KF8gPT4ge1xuICAgICAgICAgIGlmIChwa3QuY3RybC5jb2RlID09IDIwNSAmJiBwa3QuY3RybC50ZXh0ID09ICdldmljdGVkJykge1xuICAgICAgICAgICAgLy8gVXNlciBldmljdGVkIGZyb20gdG9waWMuXG4gICAgICAgICAgICBjb25zdCB0b3BpYyA9IHRoaXMuI2NhY2hlR2V0KCd0b3BpYycsIHBrdC5jdHJsLnRvcGljKTtcbiAgICAgICAgICAgIGlmICh0b3BpYykge1xuICAgICAgICAgICAgICB0b3BpYy5fcmVzZXRTdWIoKTtcbiAgICAgICAgICAgICAgaWYgKHBrdC5jdHJsLnBhcmFtcyAmJiBwa3QuY3RybC5wYXJhbXMudW5zdWIpIHtcbiAgICAgICAgICAgICAgICB0b3BpYy5fZ29uZSgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChwa3QuY3RybC5jb2RlIDwgMzAwICYmIHBrdC5jdHJsLnBhcmFtcykge1xuICAgICAgICAgICAgaWYgKHBrdC5jdHJsLnBhcmFtcy53aGF0ID09ICdkYXRhJykge1xuICAgICAgICAgICAgICAvLyBjb2RlPTIwOCwgYWxsIG1lc3NhZ2VzIHJlY2VpdmVkOiBcInBhcmFtc1wiOntcImNvdW50XCI6MTEsXCJ3aGF0XCI6XCJkYXRhXCJ9LFxuICAgICAgICAgICAgICBjb25zdCB0b3BpYyA9IHRoaXMuI2NhY2hlR2V0KCd0b3BpYycsIHBrdC5jdHJsLnRvcGljKTtcbiAgICAgICAgICAgICAgaWYgKHRvcGljKSB7XG4gICAgICAgICAgICAgICAgdG9waWMuX2FsbE1lc3NhZ2VzUmVjZWl2ZWQocGt0LmN0cmwucGFyYW1zLmNvdW50KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChwa3QuY3RybC5wYXJhbXMud2hhdCA9PSAnc3ViJykge1xuICAgICAgICAgICAgICAvLyBjb2RlPTIwNCwgdGhlIHRvcGljIGhhcyBubyAocmVmcmVzaGVkKSBzdWJzY3JpcHRpb25zLlxuICAgICAgICAgICAgICBjb25zdCB0b3BpYyA9IHRoaXMuI2NhY2hlR2V0KCd0b3BpYycsIHBrdC5jdHJsLnRvcGljKTtcbiAgICAgICAgICAgICAgaWYgKHRvcGljKSB7XG4gICAgICAgICAgICAgICAgLy8gVHJpZ2dlciB0b3BpYy5vblN1YnNVcGRhdGVkLlxuICAgICAgICAgICAgICAgIHRvcGljLl9wcm9jZXNzTWV0YVN1YihbXSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sIDApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2V0VGltZW91dChfID0+IHtcbiAgICAgICAgICBpZiAocGt0Lm1ldGEpIHtcbiAgICAgICAgICAgIC8vIEhhbmRsaW5nIGEge21ldGF9IG1lc3NhZ2UuXG4gICAgICAgICAgICAvLyBQcmVmZXJyZWQgQVBJOiBSb3V0ZSBtZXRhIHRvIHRvcGljLCBpZiBvbmUgaXMgcmVnaXN0ZXJlZFxuICAgICAgICAgICAgY29uc3QgdG9waWMgPSB0aGlzLiNjYWNoZUdldCgndG9waWMnLCBwa3QubWV0YS50b3BpYyk7XG4gICAgICAgICAgICBpZiAodG9waWMpIHtcbiAgICAgICAgICAgICAgdG9waWMuX3JvdXRlTWV0YShwa3QubWV0YSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChwa3QubWV0YS5pZCkge1xuICAgICAgICAgICAgICB0aGlzLiNleGVjUHJvbWlzZShwa3QubWV0YS5pZCwgMjAwLCBwa3QubWV0YSwgJ01FVEEnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gU2Vjb25kYXJ5IEFQSTogY2FsbGJhY2tcbiAgICAgICAgICAgIGlmICh0aGlzLm9uTWV0YU1lc3NhZ2UpIHtcbiAgICAgICAgICAgICAgdGhpcy5vbk1ldGFNZXNzYWdlKHBrdC5tZXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKHBrdC5kYXRhKSB7XG4gICAgICAgICAgICAvLyBIYW5kbGluZyB7ZGF0YX0gbWVzc2FnZVxuICAgICAgICAgICAgLy8gUHJlZmVycmVkIEFQSTogUm91dGUgZGF0YSB0byB0b3BpYywgaWYgb25lIGlzIHJlZ2lzdGVyZWRcbiAgICAgICAgICAgIGNvbnN0IHRvcGljID0gdGhpcy4jY2FjaGVHZXQoJ3RvcGljJywgcGt0LmRhdGEudG9waWMpO1xuICAgICAgICAgICAgaWYgKHRvcGljKSB7XG4gICAgICAgICAgICAgIHRvcGljLl9yb3V0ZURhdGEocGt0LmRhdGEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBTZWNvbmRhcnkgQVBJOiBDYWxsIGNhbGxiYWNrXG4gICAgICAgICAgICBpZiAodGhpcy5vbkRhdGFNZXNzYWdlKSB7XG4gICAgICAgICAgICAgIHRoaXMub25EYXRhTWVzc2FnZShwa3QuZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChwa3QucHJlcykge1xuICAgICAgICAgICAgLy8gSGFuZGxpbmcge3ByZXN9IG1lc3NhZ2VcbiAgICAgICAgICAgIC8vIFByZWZlcnJlZCBBUEk6IFJvdXRlIHByZXNlbmNlIHRvIHRvcGljLCBpZiBvbmUgaXMgcmVnaXN0ZXJlZFxuICAgICAgICAgICAgY29uc3QgdG9waWMgPSB0aGlzLiNjYWNoZUdldCgndG9waWMnLCBwa3QucHJlcy50b3BpYyk7XG4gICAgICAgICAgICBpZiAodG9waWMpIHtcbiAgICAgICAgICAgICAgdG9waWMuX3JvdXRlUHJlcyhwa3QucHJlcyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFNlY29uZGFyeSBBUEkgLSBjYWxsYmFja1xuICAgICAgICAgICAgaWYgKHRoaXMub25QcmVzTWVzc2FnZSkge1xuICAgICAgICAgICAgICB0aGlzLm9uUHJlc01lc3NhZ2UocGt0LnByZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAocGt0LmluZm8pIHtcbiAgICAgICAgICAgIC8vIHtpbmZvfSBtZXNzYWdlIC0gcmVhZC9yZWNlaXZlZCBub3RpZmljYXRpb25zIGFuZCBrZXkgcHJlc3Nlc1xuICAgICAgICAgICAgLy8gUHJlZmVycmVkIEFQSTogUm91dGUge2luZm99fSB0byB0b3BpYywgaWYgb25lIGlzIHJlZ2lzdGVyZWRcbiAgICAgICAgICAgIGNvbnN0IHRvcGljID0gdGhpcy4jY2FjaGVHZXQoJ3RvcGljJywgcGt0LmluZm8udG9waWMpO1xuICAgICAgICAgICAgaWYgKHRvcGljKSB7XG4gICAgICAgICAgICAgIHRvcGljLl9yb3V0ZUluZm8ocGt0LmluZm8pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBTZWNvbmRhcnkgQVBJIC0gY2FsbGJhY2tcbiAgICAgICAgICAgIGlmICh0aGlzLm9uSW5mb01lc3NhZ2UpIHtcbiAgICAgICAgICAgICAgdGhpcy5vbkluZm9NZXNzYWdlKHBrdC5pbmZvKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIoXCJFUlJPUjogVW5rbm93biBwYWNrZXQgcmVjZWl2ZWQuXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgMCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gQ29ubmVjdGlvbiBvcGVuLCByZWFkeSB0byBzdGFydCBzZW5kaW5nLlxuICAjY29ubmVjdGlvbk9wZW4oKSB7XG4gICAgaWYgKCF0aGlzLl9leHBpcmVQcm9taXNlcykge1xuICAgICAgLy8gUmVqZWN0IHByb21pc2VzIHdoaWNoIGhhdmUgbm90IGJlZW4gcmVzb2x2ZWQgZm9yIHRvbyBsb25nLlxuICAgICAgdGhpcy5fZXhwaXJlUHJvbWlzZXMgPSBzZXRJbnRlcnZhbChfID0+IHtcbiAgICAgICAgY29uc3QgZXJyID0gbmV3IEVycm9yKFwiVGltZW91dCAoNTA0KVwiKTtcbiAgICAgICAgY29uc3QgZXhwaXJlcyA9IG5ldyBEYXRlKG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gQ29uc3QuRVhQSVJFX1BST01JU0VTX1RJTUVPVVQpO1xuICAgICAgICBmb3IgKGxldCBpZCBpbiB0aGlzLl9wZW5kaW5nUHJvbWlzZXMpIHtcbiAgICAgICAgICBsZXQgY2FsbGJhY2tzID0gdGhpcy5fcGVuZGluZ1Byb21pc2VzW2lkXTtcbiAgICAgICAgICBpZiAoY2FsbGJhY2tzICYmIGNhbGxiYWNrcy50cyA8IGV4cGlyZXMpIHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyKFwiUHJvbWlzZSBleHBpcmVkXCIsIGlkKTtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9wZW5kaW5nUHJvbWlzZXNbaWRdO1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrcy5yZWplY3QpIHtcbiAgICAgICAgICAgICAgY2FsbGJhY2tzLnJlamVjdChlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwgQ29uc3QuRVhQSVJFX1BST01JU0VTX1BFUklPRCk7XG4gICAgfVxuICAgIHRoaXMuaGVsbG8oKTtcbiAgfVxuXG4gICNkaXNjb25uZWN0ZWQoZXJyLCBjb2RlKSB7XG4gICAgdGhpcy5faW5QYWNrZXRDb3VudCA9IDA7XG4gICAgdGhpcy5fc2VydmVySW5mbyA9IG51bGw7XG4gICAgdGhpcy5fYXV0aGVudGljYXRlZCA9IGZhbHNlO1xuXG4gICAgaWYgKHRoaXMuX2V4cGlyZVByb21pc2VzKSB7XG4gICAgICBjbGVhckludGVydmFsKHRoaXMuX2V4cGlyZVByb21pc2VzKTtcbiAgICAgIHRoaXMuX2V4cGlyZVByb21pc2VzID0gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBNYXJrIGFsbCB0b3BpY3MgYXMgdW5zdWJzY3JpYmVkXG4gICAgdGhpcy4jY2FjaGVNYXAoJ3RvcGljJywgKHRvcGljLCBrZXkpID0+IHtcbiAgICAgIHRvcGljLl9yZXNldFN1YigpO1xuICAgIH0pO1xuXG4gICAgLy8gUmVqZWN0IGFsbCBwZW5kaW5nIHByb21pc2VzXG4gICAgZm9yIChsZXQga2V5IGluIHRoaXMuX3BlbmRpbmdQcm9taXNlcykge1xuICAgICAgY29uc3QgY2FsbGJhY2tzID0gdGhpcy5fcGVuZGluZ1Byb21pc2VzW2tleV07XG4gICAgICBpZiAoY2FsbGJhY2tzICYmIGNhbGxiYWNrcy5yZWplY3QpIHtcbiAgICAgICAgY2FsbGJhY2tzLnJlamVjdChlcnIpO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLl9wZW5kaW5nUHJvbWlzZXMgPSB7fTtcblxuICAgIGlmICh0aGlzLm9uRGlzY29ubmVjdCkge1xuICAgICAgdGhpcy5vbkRpc2Nvbm5lY3QoZXJyKTtcbiAgICB9XG4gIH1cblxuICAvLyBHZXQgVXNlciBBZ2VudCBzdHJpbmdcbiAgI2dldFVzZXJBZ2VudCgpIHtcbiAgICByZXR1cm4gdGhpcy5fYXBwTmFtZSArICcgKCcgKyAodGhpcy5fYnJvd3NlciA/IHRoaXMuX2Jyb3dzZXIgKyAnOyAnIDogJycpICsgdGhpcy5faHdvcyArICcpOyAnICsgQ29uc3QuTElCUkFSWTtcbiAgfVxuXG4gIC8vIEdlbmVyYXRvciBvZiBwYWNrZXRzIHN0dWJzXG4gICNpbml0UGFja2V0KHR5cGUsIHRvcGljKSB7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICBjYXNlICdoaSc6XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgJ2hpJzoge1xuICAgICAgICAgICAgJ2lkJzogdGhpcy5nZXROZXh0VW5pcXVlSWQoKSxcbiAgICAgICAgICAgICd2ZXInOiBDb25zdC5WRVJTSU9OLFxuICAgICAgICAgICAgJ3VhJzogdGhpcy4jZ2V0VXNlckFnZW50KCksXG4gICAgICAgICAgICAnZGV2JzogdGhpcy5fZGV2aWNlVG9rZW4sXG4gICAgICAgICAgICAnbGFuZyc6IHRoaXMuX2h1bWFuTGFuZ3VhZ2UsXG4gICAgICAgICAgICAncGxhdGYnOiB0aGlzLl9wbGF0Zm9ybVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgY2FzZSAnYWNjJzpcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAnYWNjJzoge1xuICAgICAgICAgICAgJ2lkJzogdGhpcy5nZXROZXh0VW5pcXVlSWQoKSxcbiAgICAgICAgICAgICd1c2VyJzogbnVsbCxcbiAgICAgICAgICAgICdzY2hlbWUnOiBudWxsLFxuICAgICAgICAgICAgJ3NlY3JldCc6IG51bGwsXG4gICAgICAgICAgICAnbG9naW4nOiBmYWxzZSxcbiAgICAgICAgICAgICd0YWdzJzogbnVsbCxcbiAgICAgICAgICAgICdkZXNjJzoge30sXG4gICAgICAgICAgICAnY3JlZCc6IHt9XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICBjYXNlICdsb2dpbic6XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgJ2xvZ2luJzoge1xuICAgICAgICAgICAgJ2lkJzogdGhpcy5nZXROZXh0VW5pcXVlSWQoKSxcbiAgICAgICAgICAgICdzY2hlbWUnOiBudWxsLFxuICAgICAgICAgICAgJ3NlY3JldCc6IG51bGxcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgIGNhc2UgJ3N1Yic6XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgJ3N1Yic6IHtcbiAgICAgICAgICAgICdpZCc6IHRoaXMuZ2V0TmV4dFVuaXF1ZUlkKCksXG4gICAgICAgICAgICAndG9waWMnOiB0b3BpYyxcbiAgICAgICAgICAgICdzZXQnOiB7fSxcbiAgICAgICAgICAgICdnZXQnOiB7fVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgY2FzZSAnbGVhdmUnOlxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICdsZWF2ZSc6IHtcbiAgICAgICAgICAgICdpZCc6IHRoaXMuZ2V0TmV4dFVuaXF1ZUlkKCksXG4gICAgICAgICAgICAndG9waWMnOiB0b3BpYyxcbiAgICAgICAgICAgICd1bnN1Yic6IGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICBjYXNlICdwdWInOlxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICdwdWInOiB7XG4gICAgICAgICAgICAnaWQnOiB0aGlzLmdldE5leHRVbmlxdWVJZCgpLFxuICAgICAgICAgICAgJ3RvcGljJzogdG9waWMsXG4gICAgICAgICAgICAnbm9lY2hvJzogZmFsc2UsXG4gICAgICAgICAgICAnaGVhZCc6IG51bGwsXG4gICAgICAgICAgICAnY29udGVudCc6IHt9XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICBjYXNlICdnZXQnOlxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICdnZXQnOiB7XG4gICAgICAgICAgICAnaWQnOiB0aGlzLmdldE5leHRVbmlxdWVJZCgpLFxuICAgICAgICAgICAgJ3RvcGljJzogdG9waWMsXG4gICAgICAgICAgICAnd2hhdCc6IG51bGwsXG4gICAgICAgICAgICAnZGVzYyc6IHt9LFxuICAgICAgICAgICAgJ3N1Yic6IHt9LFxuICAgICAgICAgICAgJ2RhdGEnOiB7fVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgY2FzZSAnc2V0JzpcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAnc2V0Jzoge1xuICAgICAgICAgICAgJ2lkJzogdGhpcy5nZXROZXh0VW5pcXVlSWQoKSxcbiAgICAgICAgICAgICd0b3BpYyc6IHRvcGljLFxuICAgICAgICAgICAgJ2Rlc2MnOiB7fSxcbiAgICAgICAgICAgICdzdWInOiB7fSxcbiAgICAgICAgICAgICd0YWdzJzogW10sXG4gICAgICAgICAgICAnZXBoZW1lcmFsJzoge31cbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgIGNhc2UgJ2RlbCc6XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgJ2RlbCc6IHtcbiAgICAgICAgICAgICdpZCc6IHRoaXMuZ2V0TmV4dFVuaXF1ZUlkKCksXG4gICAgICAgICAgICAndG9waWMnOiB0b3BpYyxcbiAgICAgICAgICAgICd3aGF0JzogbnVsbCxcbiAgICAgICAgICAgICdkZWxzZXEnOiBudWxsLFxuICAgICAgICAgICAgJ3VzZXInOiBudWxsLFxuICAgICAgICAgICAgJ2hhcmQnOiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgY2FzZSAnbm90ZSc6XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgJ25vdGUnOiB7XG4gICAgICAgICAgICAvLyBubyBpZCBieSBkZXNpZ24gKGV4Y2VwdCBjYWxscykuXG4gICAgICAgICAgICAndG9waWMnOiB0b3BpYyxcbiAgICAgICAgICAgICd3aGF0JzogbnVsbCwgLy8gb25lIG9mIFwicmVjdlwiLCBcInJlYWRcIiwgXCJrcFwiLCBcImNhbGxcIlxuICAgICAgICAgICAgJ3NlcSc6IHVuZGVmaW5lZCAvLyB0aGUgc2VydmVyLXNpZGUgbWVzc2FnZSBpZCBhY2tub3dsZWRnZWQgYXMgcmVjZWl2ZWQgb3IgcmVhZC5cbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5rbm93biBwYWNrZXQgdHlwZSByZXF1ZXN0ZWQ6ICR7dHlwZX1gKTtcbiAgICB9XG4gIH1cblxuICAvLyBDYWNoZSBtYW5hZ2VtZW50XG4gICNjYWNoZVB1dCh0eXBlLCBuYW1lLCBvYmopIHtcbiAgICB0aGlzLl9jYWNoZVt0eXBlICsgJzonICsgbmFtZV0gPSBvYmo7XG4gIH1cbiAgI2NhY2hlR2V0KHR5cGUsIG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5fY2FjaGVbdHlwZSArICc6JyArIG5hbWVdO1xuICB9XG4gICNjYWNoZURlbCh0eXBlLCBuYW1lKSB7XG4gICAgZGVsZXRlIHRoaXMuX2NhY2hlW3R5cGUgKyAnOicgKyBuYW1lXTtcbiAgfVxuXG4gIC8vIEVudW1lcmF0ZSBhbGwgaXRlbXMgaW4gY2FjaGUsIGNhbGwgZnVuYyBmb3IgZWFjaCBpdGVtLlxuICAvLyBFbnVtZXJhdGlvbiBzdG9wcyBpZiBmdW5jIHJldHVybnMgdHJ1ZS5cbiAgI2NhY2hlTWFwKHR5cGUsIGZ1bmMsIGNvbnRleHQpIHtcbiAgICBjb25zdCBrZXkgPSB0eXBlID8gdHlwZSArICc6JyA6IHVuZGVmaW5lZDtcbiAgICBmb3IgKGxldCBpZHggaW4gdGhpcy5fY2FjaGUpIHtcbiAgICAgIGlmICgha2V5IHx8IGlkeC5pbmRleE9mKGtleSkgPT0gMCkge1xuICAgICAgICBpZiAoZnVuYy5jYWxsKGNvbnRleHQsIHRoaXMuX2NhY2hlW2lkeF0sIGlkeCkpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIE1ha2UgbGltaXRlZCBjYWNoZSBtYW5hZ2VtZW50IGF2YWlsYWJsZSB0byB0b3BpYy5cbiAgLy8gQ2FjaGluZyB1c2VyLnB1YmxpYyBvbmx5LiBFdmVyeXRoaW5nIGVsc2UgaXMgcGVyLXRvcGljLlxuICAjYXR0YWNoQ2FjaGVUb1RvcGljKHRvcGljKSB7XG4gICAgdG9waWMuX3Rpbm9kZSA9IHRoaXM7XG5cbiAgICB0b3BpYy5fY2FjaGVHZXRVc2VyID0gKHVpZCkgPT4ge1xuICAgICAgY29uc3QgcHViID0gdGhpcy4jY2FjaGVHZXQoJ3VzZXInLCB1aWQpO1xuICAgICAgaWYgKHB1Yikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHVzZXI6IHVpZCxcbiAgICAgICAgICBwdWJsaWM6IG1lcmdlT2JqKHt9LCBwdWIpXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH07XG4gICAgdG9waWMuX2NhY2hlUHV0VXNlciA9ICh1aWQsIHVzZXIpID0+IHtcbiAgICAgIHRoaXMuI2NhY2hlUHV0KCd1c2VyJywgdWlkLCBtZXJnZU9iaih7fSwgdXNlci5wdWJsaWMpKTtcbiAgICB9O1xuICAgIHRvcGljLl9jYWNoZURlbFVzZXIgPSAodWlkKSA9PiB7XG4gICAgICB0aGlzLiNjYWNoZURlbCgndXNlcicsIHVpZCk7XG4gICAgfTtcbiAgICB0b3BpYy5fY2FjaGVQdXRTZWxmID0gXyA9PiB7XG4gICAgICB0aGlzLiNjYWNoZVB1dCgndG9waWMnLCB0b3BpYy5uYW1lLCB0b3BpYyk7XG4gICAgfTtcbiAgICB0b3BpYy5fY2FjaGVEZWxTZWxmID0gXyA9PiB7XG4gICAgICB0aGlzLiNjYWNoZURlbCgndG9waWMnLCB0b3BpYy5uYW1lKTtcbiAgICB9O1xuICB9XG5cbiAgLy8gT24gc3VjY2Vzc2Z1bCBsb2dpbiBzYXZlIHNlcnZlci1wcm92aWRlZCBkYXRhLlxuICAjbG9naW5TdWNjZXNzZnVsKGN0cmwpIHtcbiAgICBpZiAoIWN0cmwucGFyYW1zIHx8ICFjdHJsLnBhcmFtcy51c2VyKSB7XG4gICAgICByZXR1cm4gY3RybDtcbiAgICB9XG4gICAgLy8gVGhpcyBpcyBhIHJlc3BvbnNlIHRvIGEgc3VjY2Vzc2Z1bCBsb2dpbixcbiAgICAvLyBleHRyYWN0IFVJRCBhbmQgc2VjdXJpdHkgdG9rZW4sIHNhdmUgaXQgaW4gVGlub2RlIG1vZHVsZVxuICAgIHRoaXMuX215VUlEID0gY3RybC5wYXJhbXMudXNlcjtcbiAgICB0aGlzLl9hdXRoZW50aWNhdGVkID0gKGN0cmwgJiYgY3RybC5jb2RlID49IDIwMCAmJiBjdHJsLmNvZGUgPCAzMDApO1xuICAgIGlmIChjdHJsLnBhcmFtcyAmJiBjdHJsLnBhcmFtcy50b2tlbiAmJiBjdHJsLnBhcmFtcy5leHBpcmVzKSB7XG4gICAgICB0aGlzLl9hdXRoVG9rZW4gPSB7XG4gICAgICAgIHRva2VuOiBjdHJsLnBhcmFtcy50b2tlbixcbiAgICAgICAgZXhwaXJlczogY3RybC5wYXJhbXMuZXhwaXJlc1xuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fYXV0aFRva2VuID0gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vbkxvZ2luKSB7XG4gICAgICB0aGlzLm9uTG9naW4oY3RybC5jb2RlLCBjdHJsLnRleHQpO1xuICAgIH1cblxuICAgIHJldHVybiBjdHJsO1xuICB9XG5cbiAgLy8gU3RhdGljIG1ldGhvZHMuXG4gIC8qKlxuICAgKiBIZWxwZXIgbWV0aG9kIHRvIHBhY2thZ2UgYWNjb3VudCBjcmVkZW50aWFsLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZyB8IENyZWRlbnRpYWx9IG1ldGggLSB2YWxpZGF0aW9uIG1ldGhvZCBvciBvYmplY3Qgd2l0aCB2YWxpZGF0aW9uIGRhdGEuXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gdmFsIC0gdmFsaWRhdGlvbiB2YWx1ZSAoZS5nLiBlbWFpbCBvciBwaG9uZSBudW1iZXIpLlxuICAgKiBAcGFyYW0ge09iamVjdD19IHBhcmFtcyAtIHZhbGlkYXRpb24gcGFyYW1ldGVycy5cbiAgICogQHBhcmFtIHtzdHJpbmc9fSByZXNwIC0gdmFsaWRhdGlvbiByZXNwb25zZS5cbiAgICpcbiAgICogQHJldHVybnMge0FycmF5LjxDcmVkZW50aWFsPn0gYXJyYXkgd2l0aCBhIHNpbmdsZSBjcmVkZW50aWFsIG9yIDxjb2RlPm51bGw8L2NvZGU+IGlmIG5vIHZhbGlkIGNyZWRlbnRpYWxzIHdlcmUgZ2l2ZW4uXG4gICAqL1xuICBzdGF0aWMgY3JlZGVudGlhbChtZXRoLCB2YWwsIHBhcmFtcywgcmVzcCkge1xuICAgIGlmICh0eXBlb2YgbWV0aCA9PSAnb2JqZWN0Jykge1xuICAgICAgKHtcbiAgICAgICAgdmFsLFxuICAgICAgICBwYXJhbXMsXG4gICAgICAgIHJlc3AsXG4gICAgICAgIG1ldGhcbiAgICAgIH0gPSBtZXRoKTtcbiAgICB9XG4gICAgaWYgKG1ldGggJiYgKHZhbCB8fCByZXNwKSkge1xuICAgICAgcmV0dXJuIFt7XG4gICAgICAgICdtZXRoJzogbWV0aCxcbiAgICAgICAgJ3ZhbCc6IHZhbCxcbiAgICAgICAgJ3Jlc3AnOiByZXNwLFxuICAgICAgICAncGFyYW1zJzogcGFyYW1zXG4gICAgICB9XTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lIHRvcGljIHR5cGUgZnJvbSB0b3BpYydzIG5hbWU6IGdycCwgcDJwLCBtZSwgZm5kLCBzeXMuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gdGVzdC5cbiAgICogQHJldHVybnMge3N0cmluZ30gT25lIG9mIDxjb2RlPlwibWVcIjwvY29kZT4sIDxjb2RlPlwiZm5kXCI8L2NvZGU+LCA8Y29kZT5cInN5c1wiPC9jb2RlPiwgPGNvZGU+XCJncnBcIjwvY29kZT4sXG4gICAqICAgIDxjb2RlPlwicDJwXCI8L2NvZGU+IG9yIDxjb2RlPnVuZGVmaW5lZDwvY29kZT4uXG4gICAqL1xuICBzdGF0aWMgdG9waWNUeXBlKG5hbWUpIHtcbiAgICByZXR1cm4gVG9waWMudG9waWNUeXBlKG5hbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSBnaXZlbiB0b3BpYyBuYW1lIGlzIGEgbmFtZSBvZiBhICdtZScgdG9waWMuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gdGVzdC5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIHRoZSBuYW1lIGlzIGEgbmFtZSBvZiBhICdtZScgdG9waWMsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBzdGF0aWMgaXNNZVRvcGljTmFtZShuYW1lKSB7XG4gICAgcmV0dXJuIFRvcGljLmlzTWVUb3BpY05hbWUobmFtZSk7XG4gIH1cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSBnaXZlbiB0b3BpYyBuYW1lIGlzIGEgbmFtZSBvZiBhIGdyb3VwIHRvcGljLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIHRlc3QuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0aGUgbmFtZSBpcyBhIG5hbWUgb2YgYSBncm91cCB0b3BpYywgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIHN0YXRpYyBpc0dyb3VwVG9waWNOYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gVG9waWMuaXNHcm91cFRvcGljTmFtZShuYW1lKTtcbiAgfVxuICAvKipcbiAgICogQ2hlY2sgaWYgdGhlIGdpdmVuIHRvcGljIG5hbWUgaXMgYSBuYW1lIG9mIGEgcDJwIHRvcGljLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIHRlc3QuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0aGUgbmFtZSBpcyBhIG5hbWUgb2YgYSBwMnAgdG9waWMsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBzdGF0aWMgaXNQMlBUb3BpY05hbWUobmFtZSkge1xuICAgIHJldHVybiBUb3BpYy5pc1AyUFRvcGljTmFtZShuYW1lKTtcbiAgfVxuICAvKipcbiAgICogQ2hlY2sgaWYgdGhlIGdpdmVuIHRvcGljIG5hbWUgaXMgYSBuYW1lIG9mIGEgY29tbXVuaWNhdGlvbiB0b3BpYywgaS5lLiBQMlAgb3IgZ3JvdXAuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gdGVzdC5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIHRoZSBuYW1lIGlzIGEgbmFtZSBvZiBhIHAycCBvciBncm91cCB0b3BpYywgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIHN0YXRpYyBpc0NvbW1Ub3BpY05hbWUobmFtZSkge1xuICAgIHJldHVybiBUb3BpYy5pc0NvbW1Ub3BpY05hbWUobmFtZSk7XG4gIH1cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSB0b3BpYyBuYW1lIGlzIGEgbmFtZSBvZiBhIG5ldyB0b3BpYy5cbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSB0b3BpYyBuYW1lIHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgdGhlIG5hbWUgaXMgYSBuYW1lIG9mIGEgbmV3IHRvcGljLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgc3RhdGljIGlzTmV3R3JvdXBUb3BpY05hbWUobmFtZSkge1xuICAgIHJldHVybiBUb3BpYy5pc05ld0dyb3VwVG9waWNOYW1lKG5hbWUpO1xuICB9XG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgdG9waWMgbmFtZSBpcyBhIG5hbWUgb2YgYSBjaGFubmVsLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIHRvcGljIG5hbWUgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIHtib29sZWFufSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0aGUgbmFtZSBpcyBhIG5hbWUgb2YgYSBjaGFubmVsLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgc3RhdGljIGlzQ2hhbm5lbFRvcGljTmFtZShuYW1lKSB7XG4gICAgcmV0dXJuIFRvcGljLmlzQ2hhbm5lbFRvcGljTmFtZShuYW1lKTtcbiAgfVxuICAvKipcbiAgICogR2V0IGluZm9ybWF0aW9uIGFib3V0IHRoZSBjdXJyZW50IHZlcnNpb24gb2YgdGhpcyBUaW5vZGUgY2xpZW50IGxpYnJhcnkuXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IHNlbWFudGljIHZlcnNpb24gb2YgdGhlIGxpYnJhcnksIGUuZy4gPGNvZGU+XCIwLjE1LjUtcmMxXCI8L2NvZGU+LlxuICAgKi9cbiAgc3RhdGljIGdldFZlcnNpb24oKSB7XG4gICAgcmV0dXJuIENvbnN0LlZFUlNJT047XG4gIH1cbiAgLyoqXG4gICAqIFRvIHVzZSBUaW5vZGUgaW4gYSBub24gYnJvd3NlciBjb250ZXh0LCBzdXBwbHkgV2ViU29ja2V0IGFuZCBYTUxIdHRwUmVxdWVzdCBwcm92aWRlcnMuXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHdzUHJvdmlkZXIgPGNvZGU+V2ViU29ja2V0PC9jb2RlPiBwcm92aWRlciwgZS5nLiBmb3Igbm9kZUpTICwgPGNvZGU+cmVxdWlyZSgnd3MnKTwvY29kZT4uXG4gICAqIEBwYXJhbSB4aHJQcm92aWRlciA8Y29kZT5YTUxIdHRwUmVxdWVzdDwvY29kZT4gcHJvdmlkZXIsIGUuZy4gZm9yIG5vZGUgPGNvZGU+cmVxdWlyZSgneGhyJyk8L2NvZGU+LlxuICAgKi9cbiAgc3RhdGljIHNldE5ldHdvcmtQcm92aWRlcnMod3NQcm92aWRlciwgeGhyUHJvdmlkZXIpIHtcbiAgICBXZWJTb2NrZXRQcm92aWRlciA9IHdzUHJvdmlkZXI7XG4gICAgWEhSUHJvdmlkZXIgPSB4aHJQcm92aWRlcjtcblxuICAgIENvbm5lY3Rpb24uc2V0TmV0d29ya1Byb3ZpZGVycyhXZWJTb2NrZXRQcm92aWRlciwgWEhSUHJvdmlkZXIpO1xuICAgIExhcmdlRmlsZUhlbHBlci5zZXROZXR3b3JrUHJvdmlkZXIoWEhSUHJvdmlkZXIpO1xuICB9XG4gIC8qKlxuICAgKiBUbyB1c2UgVGlub2RlIGluIGEgbm9uIGJyb3dzZXIgY29udGV4dCwgc3VwcGx5IDxjb2RlPmluZGV4ZWREQjwvY29kZT4gcHJvdmlkZXIuXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIGlkYlByb3ZpZGVyIDxjb2RlPmluZGV4ZWREQjwvY29kZT4gcHJvdmlkZXIsIGUuZy4gZm9yIG5vZGVKUyAsIDxjb2RlPnJlcXVpcmUoJ2Zha2UtaW5kZXhlZGRiJyk8L2NvZGU+LlxuICAgKi9cbiAgc3RhdGljIHNldERhdGFiYXNlUHJvdmlkZXIoaWRiUHJvdmlkZXIpIHtcbiAgICBJbmRleGVkREJQcm92aWRlciA9IGlkYlByb3ZpZGVyO1xuXG4gICAgREJDYWNoZS5zZXREYXRhYmFzZVByb3ZpZGVyKEluZGV4ZWREQlByb3ZpZGVyKTtcbiAgfVxuICAvKipcbiAgICogUmV0dXJuIGluZm9ybWF0aW9uIGFib3V0IHRoZSBjdXJyZW50IG5hbWUgYW5kIHZlcnNpb24gb2YgdGhpcyBUaW5vZGUgbGlicmFyeS5cbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSB0aGUgbmFtZSBvZiB0aGUgbGlicmFyeSBhbmQgaXQncyB2ZXJzaW9uLlxuICAgKi9cbiAgc3RhdGljIGdldExpYnJhcnkoKSB7XG4gICAgcmV0dXJuIENvbnN0LkxJQlJBUlk7XG4gIH1cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSBnaXZlbiBzdHJpbmcgcmVwcmVzZW50cyA8Y29kZT5OVUxMPC9jb2RlPiB2YWx1ZSBhcyBkZWZpbmVkIGJ5IFRpbm9kZSAoPGNvZGU+J1xcdTI0MjEnPC9jb2RlPikuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHIgLSBzdHJpbmcgdG8gY2hlY2sgZm9yIDxjb2RlPk5VTEw8L2NvZGU+IHZhbHVlLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgc3RyaW5nIHJlcHJlc2VudHMgPGNvZGU+TlVMTDwvY29kZT4gdmFsdWUsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBzdGF0aWMgaXNOdWxsVmFsdWUoc3RyKSB7XG4gICAgcmV0dXJuIHN0ciA9PT0gQ29uc3QuREVMX0NIQVI7XG4gIH1cblxuICAvLyBJbnN0YW5jZSBtZXRob2RzLlxuXG4gIC8vIEdlbmVyYXRlcyB1bmlxdWUgbWVzc2FnZSBJRHNcbiAgZ2V0TmV4dFVuaXF1ZUlkKCkge1xuICAgIHJldHVybiAodGhpcy5fbWVzc2FnZUlkICE9IDApID8gJycgKyB0aGlzLl9tZXNzYWdlSWQrKyA6IHVuZGVmaW5lZDtcbiAgfTtcblxuICAvKipcbiAgICogQ29ubmVjdCB0byB0aGUgc2VydmVyLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gaG9zdF8gLSBuYW1lIG9mIHRoZSBob3N0IHRvIGNvbm5lY3QgdG8uXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IFByb21pc2UgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgY29ubmVjdGlvbiBjYWxsIGNvbXBsZXRlczpcbiAgICogICAgPGNvZGU+cmVzb2x2ZSgpPC9jb2RlPiBpcyBjYWxsZWQgd2l0aG91dCBwYXJhbWV0ZXJzLCA8Y29kZT5yZWplY3QoKTwvY29kZT4gcmVjZWl2ZXMgdGhlXG4gICAqICAgIDxjb2RlPkVycm9yPC9jb2RlPiBhcyBhIHNpbmdsZSBwYXJhbWV0ZXIuXG4gICAqL1xuICBjb25uZWN0KGhvc3RfKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Nvbm5lY3Rpb24uY29ubmVjdChob3N0Xyk7XG4gIH1cblxuICAvKipcbiAgICogQXR0ZW1wdCB0byByZWNvbm5lY3QgdG8gdGhlIHNlcnZlciBpbW1lZGlhdGVseS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGZvcmNlIC0gcmVjb25uZWN0IGV2ZW4gaWYgdGhlcmUgaXMgYSBjb25uZWN0aW9uIGFscmVhZHkuXG4gICAqL1xuICByZWNvbm5lY3QoZm9yY2UpIHtcbiAgICB0aGlzLl9jb25uZWN0aW9uLnJlY29ubmVjdChmb3JjZSk7XG4gIH1cblxuICAvKipcbiAgICogRGlzY29ubmVjdCBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAqL1xuICBkaXNjb25uZWN0KCkge1xuICAgIHRoaXMuX2Nvbm5lY3Rpb24uZGlzY29ubmVjdCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIENsZWFyIHBlcnNpc3RlbnQgY2FjaGU6IHJlbW92ZSBJbmRleGVkREIuXG4gICAqXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IFByb21pc2UgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgb3BlcmF0aW9uIGlzIGNvbXBsZXRlZC5cbiAgICovXG4gIGNsZWFyU3RvcmFnZSgpIHtcbiAgICBpZiAodGhpcy5fZGIuaXNSZWFkeSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5fZGIuZGVsZXRlRGF0YWJhc2UoKTtcbiAgICB9XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgcGVyc2lzdGVudCBjYWNoZTogY3JlYXRlIEluZGV4ZWREQiBjYWNoZS5cbiAgICpcbiAgICogQHJldHVybiB7UHJvbWlzZX0gUHJvbWlzZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBvcGVyYXRpb24gaXMgY29tcGxldGVkLlxuICAgKi9cbiAgaW5pdFN0b3JhZ2UoKSB7XG4gICAgaWYgKCF0aGlzLl9kYi5pc1JlYWR5KCkpIHtcbiAgICAgIHJldHVybiB0aGlzLl9kYi5pbml0RGF0YWJhc2UoKTtcbiAgICB9XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgYSBuZXR3b3JrIHByb2JlIG1lc3NhZ2UgdG8gbWFrZSBzdXJlIHRoZSBjb25uZWN0aW9uIGlzIGFsaXZlLlxuICAgKi9cbiAgbmV0d29ya1Byb2JlKCkge1xuICAgIHRoaXMuX2Nvbm5lY3Rpb24ucHJvYmUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBmb3IgbGl2ZSBjb25uZWN0aW9uIHRvIHNlcnZlci5cbiAgICpcbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIHRoZXJlIGlzIGEgbGl2ZSBjb25uZWN0aW9uLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgaXNDb25uZWN0ZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Nvbm5lY3Rpb24uaXNDb25uZWN0ZWQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBjb25uZWN0aW9uIGlzIGF1dGhlbnRpY2F0ZWQgKGxhc3QgbG9naW4gd2FzIHN1Y2Nlc3NmdWwpLlxuICAgKlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgYXV0aGVudGljYXRlZCwgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIGlzQXV0aGVudGljYXRlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fYXV0aGVudGljYXRlZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgQVBJIGtleSBhbmQgYXV0aCB0b2tlbiB0byB0aGUgcmVsYXRpdmUgVVJMIG1ha2luZyBpdCB1c2FibGUgZm9yIGdldHRpbmcgZGF0YVxuICAgKiBmcm9tIHRoZSBzZXJ2ZXIgaW4gYSBzaW1wbGUgPGNvZGU+SFRUUCBHRVQ8L2NvZGU+IHJlcXVlc3QuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBVUkwgLSBVUkwgdG8gd3JhcC5cbiAgICogQHJldHVybnMge3N0cmluZ30gVVJMIHdpdGggYXBwZW5kZWQgQVBJIGtleSBhbmQgdG9rZW4sIGlmIHZhbGlkIHRva2VuIGlzIHByZXNlbnQuXG4gICAqL1xuICBhdXRob3JpemVVUkwodXJsKSB7XG4gICAgaWYgKHR5cGVvZiB1cmwgIT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiB1cmw7XG4gICAgfVxuXG4gICAgaWYgKGlzVXJsUmVsYXRpdmUodXJsKSkge1xuICAgICAgLy8gRmFrZSBiYXNlIHRvIG1ha2UgdGhlIHJlbGF0aXZlIFVSTCBwYXJzZWFibGUuXG4gICAgICBjb25zdCBiYXNlID0gJ3NjaGVtZTovL2hvc3QvJztcbiAgICAgIGNvbnN0IHBhcnNlZCA9IG5ldyBVUkwodXJsLCBiYXNlKTtcbiAgICAgIGlmICh0aGlzLl9hcGlLZXkpIHtcbiAgICAgICAgcGFyc2VkLnNlYXJjaFBhcmFtcy5hcHBlbmQoJ2FwaWtleScsIHRoaXMuX2FwaUtleSk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5fYXV0aFRva2VuICYmIHRoaXMuX2F1dGhUb2tlbi50b2tlbikge1xuICAgICAgICBwYXJzZWQuc2VhcmNoUGFyYW1zLmFwcGVuZCgnYXV0aCcsICd0b2tlbicpO1xuICAgICAgICBwYXJzZWQuc2VhcmNoUGFyYW1zLmFwcGVuZCgnc2VjcmV0JywgdGhpcy5fYXV0aFRva2VuLnRva2VuKTtcbiAgICAgIH1cbiAgICAgIC8vIENvbnZlcnQgYmFjayB0byBzdHJpbmcgYW5kIHN0cmlwIGZha2UgYmFzZSBVUkwgZXhjZXB0IGZvciB0aGUgcm9vdCBzbGFzaC5cbiAgICAgIHVybCA9IHBhcnNlZC50b1N0cmluZygpLnN1YnN0cmluZyhiYXNlLmxlbmd0aCAtIDEpO1xuICAgIH1cbiAgICByZXR1cm4gdXJsO1xuICB9XG5cbiAgLyoqXG4gICAqIEB0eXBlZGVmIEFjY291bnRQYXJhbXNcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHByb3BlcnR5IHtEZWZBY3M9fSBkZWZhY3MgLSBEZWZhdWx0IGFjY2VzcyBwYXJhbWV0ZXJzIGZvciB1c2VyJ3MgPGNvZGU+bWU8L2NvZGU+IHRvcGljLlxuICAgKiBAcHJvcGVydHkge09iamVjdD19IHB1YmxpYyAtIFB1YmxpYyBhcHBsaWNhdGlvbi1kZWZpbmVkIGRhdGEgZXhwb3NlZCBvbiA8Y29kZT5tZTwvY29kZT4gdG9waWMuXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0PX0gcHJpdmF0ZSAtIFByaXZhdGUgYXBwbGljYXRpb24tZGVmaW5lZCBkYXRhIGFjY2Vzc2libGUgb24gPGNvZGU+bWU8L2NvZGU+IHRvcGljLlxuICAgKiBAcHJvcGVydHkge09iamVjdD19IHRydXN0ZWQgLSBUcnVzdGVkIHVzZXIgZGF0YSB3aGljaCBjYW4gYmUgc2V0IGJ5IGEgcm9vdCB1c2VyIG9ubHkuXG4gICAqIEBwcm9wZXJ0eSB7QXJyYXkuPHN0cmluZz59IHRhZ3MgLSBhcnJheSBvZiBzdHJpbmcgdGFncyBmb3IgdXNlciBkaXNjb3ZlcnkuXG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nPX0gdG9rZW4gLSBhdXRoZW50aWNhdGlvbiB0b2tlbiB0byB1c2UuXG4gICAqIEBwcm9wZXJ0eSB7QXJyYXkuPHN0cmluZz49fSBhdHRhY2htZW50cyAtIEFycmF5IG9mIHJlZmVyZW5jZXMgdG8gb3V0IG9mIGJhbmQgYXR0YWNobWVudHMgdXNlZCBpbiBhY2NvdW50IGRlc2NyaXB0aW9uLlxuICAgKi9cbiAgLyoqXG4gICAqIEB0eXBlZGVmIERlZkFjc1xuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAcHJvcGVydHkge3N0cmluZz19IGF1dGggLSBBY2Nlc3MgbW9kZSBmb3IgPGNvZGU+bWU8L2NvZGU+IGZvciBhdXRoZW50aWNhdGVkIHVzZXJzLlxuICAgKiBAcHJvcGVydHkge3N0cmluZz19IGFub24gLSBBY2Nlc3MgbW9kZSBmb3IgPGNvZGU+bWU8L2NvZGU+IGZvciBhbm9ueW1vdXMgdXNlcnMuXG4gICAqL1xuXG4gIC8qKlxuICAgKiBDcmVhdGUgb3IgdXBkYXRlIGFuIGFjY291bnQuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1aWQgLSBVc2VyIGlkIHRvIHVwZGF0ZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2NoZW1lIC0gQXV0aGVudGljYXRpb24gc2NoZW1lOyA8Y29kZT5cImJhc2ljXCI8L2NvZGU+IGFuZCA8Y29kZT5cImFub255bW91c1wiPC9jb2RlPiBhcmUgdGhlIGN1cnJlbnRseSBzdXBwb3J0ZWQgc2NoZW1lcy5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHNlY3JldCAtIEF1dGhlbnRpY2F0aW9uIHNlY3JldCwgYXNzdW1lZCB0byBiZSBhbHJlYWR5IGJhc2U2NCBlbmNvZGVkLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBsb2dpbiAtIFVzZSBuZXcgYWNjb3VudCB0byBhdXRoZW50aWNhdGUgY3VycmVudCBzZXNzaW9uXG4gICAqIEBwYXJhbSB7QWNjb3VudFBhcmFtcz19IHBhcmFtcyAtIFVzZXIgZGF0YSB0byBwYXNzIHRvIHRoZSBzZXJ2ZXIuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiBzZXJ2ZXIgcmVwbHkgaXMgcmVjZWl2ZWQuXG4gICAqL1xuICBhY2NvdW50KHVpZCwgc2NoZW1lLCBzZWNyZXQsIGxvZ2luLCBwYXJhbXMpIHtcbiAgICBjb25zdCBwa3QgPSB0aGlzLiNpbml0UGFja2V0KCdhY2MnKTtcbiAgICBwa3QuYWNjLnVzZXIgPSB1aWQ7XG4gICAgcGt0LmFjYy5zY2hlbWUgPSBzY2hlbWU7XG4gICAgcGt0LmFjYy5zZWNyZXQgPSBzZWNyZXQ7XG4gICAgLy8gTG9nIGluIHRvIHRoZSBuZXcgYWNjb3VudCB1c2luZyBzZWxlY3RlZCBzY2hlbWVcbiAgICBwa3QuYWNjLmxvZ2luID0gbG9naW47XG5cbiAgICBpZiAocGFyYW1zKSB7XG4gICAgICBwa3QuYWNjLmRlc2MuZGVmYWNzID0gcGFyYW1zLmRlZmFjcztcbiAgICAgIHBrdC5hY2MuZGVzYy5wdWJsaWMgPSBwYXJhbXMucHVibGljO1xuICAgICAgcGt0LmFjYy5kZXNjLnByaXZhdGUgPSBwYXJhbXMucHJpdmF0ZTtcbiAgICAgIHBrdC5hY2MuZGVzYy50cnVzdGVkID0gcGFyYW1zLnRydXN0ZWQ7XG5cbiAgICAgIHBrdC5hY2MudGFncyA9IHBhcmFtcy50YWdzO1xuICAgICAgcGt0LmFjYy5jcmVkID0gcGFyYW1zLmNyZWQ7XG5cbiAgICAgIHBrdC5hY2MudG9rZW4gPSBwYXJhbXMudG9rZW47XG5cbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHBhcmFtcy5hdHRhY2htZW50cykgJiYgcGFyYW1zLmF0dGFjaG1lbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcGt0LmV4dHJhID0ge1xuICAgICAgICAgIGF0dGFjaG1lbnRzOiBwYXJhbXMuYXR0YWNobWVudHMuZmlsdGVyKHJlZiA9PiBpc1VybFJlbGF0aXZlKHJlZikpXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuI3NlbmQocGt0LCBwa3QuYWNjLmlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBuZXcgdXNlci4gV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNhY2NvdW50fS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNjaGVtZSAtIEF1dGhlbnRpY2F0aW9uIHNjaGVtZTsgPGNvZGU+XCJiYXNpY1wiPC9jb2RlPiBpcyB0aGUgb25seSBjdXJyZW50bHkgc3VwcG9ydGVkIHNjaGVtZS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHNlY3JldCAtIEF1dGhlbnRpY2F0aW9uLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBsb2dpbiAtIFVzZSBuZXcgYWNjb3VudCB0byBhdXRoZW50aWNhdGUgY3VycmVudCBzZXNzaW9uXG4gICAqIEBwYXJhbSB7QWNjb3VudFBhcmFtcz19IHBhcmFtcyAtIFVzZXIgZGF0YSB0byBwYXNzIHRvIHRoZSBzZXJ2ZXIuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiBzZXJ2ZXIgcmVwbHkgaXMgcmVjZWl2ZWQuXG4gICAqL1xuICBjcmVhdGVBY2NvdW50KHNjaGVtZSwgc2VjcmV0LCBsb2dpbiwgcGFyYW1zKSB7XG4gICAgbGV0IHByb21pc2UgPSB0aGlzLmFjY291bnQoQ29uc3QuVVNFUl9ORVcsIHNjaGVtZSwgc2VjcmV0LCBsb2dpbiwgcGFyYW1zKTtcbiAgICBpZiAobG9naW4pIHtcbiAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oY3RybCA9PiB0aGlzLiNsb2dpblN1Y2Nlc3NmdWwoY3RybCkpO1xuICAgIH1cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgdXNlciB3aXRoIDxjb2RlPidiYXNpYyc8L2NvZGU+IGF1dGhlbnRpY2F0aW9uIHNjaGVtZSBhbmQgaW1tZWRpYXRlbHlcbiAgICogdXNlIGl0IGZvciBhdXRoZW50aWNhdGlvbi4gV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNhY2NvdW50fS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVzZXJuYW1lIC0gTG9naW4gdG8gdXNlIGZvciB0aGUgbmV3IGFjY291bnQuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXNzd29yZCAtIFVzZXIncyBwYXNzd29yZC5cbiAgICogQHBhcmFtIHtBY2NvdW50UGFyYW1zPX0gcGFyYW1zIC0gVXNlciBkYXRhIHRvIHBhc3MgdG8gdGhlIHNlcnZlci5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHNlcnZlciByZXBseSBpcyByZWNlaXZlZC5cbiAgICovXG4gIGNyZWF0ZUFjY291bnRCYXNpYyh1c2VybmFtZSwgcGFzc3dvcmQsIHBhcmFtcykge1xuICAgIC8vIE1ha2Ugc3VyZSB3ZSBhcmUgbm90IHVzaW5nICdudWxsJyBvciAndW5kZWZpbmVkJztcbiAgICB1c2VybmFtZSA9IHVzZXJuYW1lIHx8ICcnO1xuICAgIHBhc3N3b3JkID0gcGFzc3dvcmQgfHwgJyc7XG4gICAgcmV0dXJuIHRoaXMuY3JlYXRlQWNjb3VudCgnYmFzaWMnLFxuICAgICAgYjY0RW5jb2RlVW5pY29kZSh1c2VybmFtZSArICc6JyArIHBhc3N3b3JkKSwgdHJ1ZSwgcGFyYW1zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgdXNlcidzIGNyZWRlbnRpYWxzIGZvciA8Y29kZT4nYmFzaWMnPC9jb2RlPiBhdXRoZW50aWNhdGlvbiBzY2hlbWUuIFdyYXBwZXIgZm9yIHtAbGluayBUaW5vZGUjYWNjb3VudH0uXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1aWQgLSBVc2VyIElEIHRvIHVwZGF0ZS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHVzZXJuYW1lIC0gTG9naW4gdG8gdXNlIGZvciB0aGUgbmV3IGFjY291bnQuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXNzd29yZCAtIFVzZXIncyBwYXNzd29yZC5cbiAgICogQHBhcmFtIHtBY2NvdW50UGFyYW1zPX0gcGFyYW1zIC0gZGF0YSB0byBwYXNzIHRvIHRoZSBzZXJ2ZXIuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiBzZXJ2ZXIgcmVwbHkgaXMgcmVjZWl2ZWQuXG4gICAqL1xuICB1cGRhdGVBY2NvdW50QmFzaWModWlkLCB1c2VybmFtZSwgcGFzc3dvcmQsIHBhcmFtcykge1xuICAgIC8vIE1ha2Ugc3VyZSB3ZSBhcmUgbm90IHVzaW5nICdudWxsJyBvciAndW5kZWZpbmVkJztcbiAgICB1c2VybmFtZSA9IHVzZXJuYW1lIHx8ICcnO1xuICAgIHBhc3N3b3JkID0gcGFzc3dvcmQgfHwgJyc7XG4gICAgcmV0dXJuIHRoaXMuYWNjb3VudCh1aWQsICdiYXNpYycsXG4gICAgICBiNjRFbmNvZGVVbmljb2RlKHVzZXJuYW1lICsgJzonICsgcGFzc3dvcmQpLCBmYWxzZSwgcGFyYW1zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kIGhhbmRzaGFrZSB0byB0aGUgc2VydmVyLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gc2VydmVyIHJlcGx5IGlzIHJlY2VpdmVkLlxuICAgKi9cbiAgaGVsbG8oKSB7XG4gICAgY29uc3QgcGt0ID0gdGhpcy4jaW5pdFBhY2tldCgnaGknKTtcblxuICAgIHJldHVybiB0aGlzLiNzZW5kKHBrdCwgcGt0LmhpLmlkKVxuICAgICAgLnRoZW4oY3RybCA9PiB7XG4gICAgICAgIC8vIFJlc2V0IGJhY2tvZmYgY291bnRlciBvbiBzdWNjZXNzZnVsIGNvbm5lY3Rpb24uXG4gICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uYmFja29mZlJlc2V0KCk7XG5cbiAgICAgICAgLy8gU2VydmVyIHJlc3BvbnNlIGNvbnRhaW5zIHNlcnZlciBwcm90b2NvbCB2ZXJzaW9uLCBidWlsZCwgY29uc3RyYWludHMsXG4gICAgICAgIC8vIHNlc3Npb24gSUQgZm9yIGxvbmcgcG9sbGluZy4gU2F2ZSB0aGVtLlxuICAgICAgICBpZiAoY3RybC5wYXJhbXMpIHtcbiAgICAgICAgICB0aGlzLl9zZXJ2ZXJJbmZvID0gY3RybC5wYXJhbXM7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5vbkNvbm5lY3QpIHtcbiAgICAgICAgICB0aGlzLm9uQ29ubmVjdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGN0cmw7XG4gICAgICB9KS5jYXRjaChlcnIgPT4ge1xuICAgICAgICB0aGlzLl9jb25uZWN0aW9uLnJlY29ubmVjdCh0cnVlKTtcblxuICAgICAgICBpZiAodGhpcy5vbkRpc2Nvbm5lY3QpIHtcbiAgICAgICAgICB0aGlzLm9uRGlzY29ubmVjdChlcnIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgb3IgcmVmcmVzaCB0aGUgcHVzaCBub3RpZmljYXRpb25zL2RldmljZSB0b2tlbi4gSWYgdGhlIGNsaWVudCBpcyBjb25uZWN0ZWQsXG4gICAqIHRoZSBkZXZpY2VUb2tlbiBjYW4gYmUgc2VudCB0byB0aGUgc2VydmVyLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZHQgLSB0b2tlbiBvYnRhaW5lZCBmcm9tIHRoZSBwcm92aWRlciBvciA8Y29kZT5mYWxzZTwvY29kZT4sXG4gICAqICAgIDxjb2RlPm51bGw8L2NvZGU+IG9yIDxjb2RlPnVuZGVmaW5lZDwvY29kZT4gdG8gY2xlYXIgdGhlIHRva2VuLlxuICAgKlxuICAgKiBAcmV0dXJucyA8Y29kZT50cnVlPC9jb2RlPiBpZiBhdHRlbXB0IHdhcyBtYWRlIHRvIHNlbmQgdGhlIHVwZGF0ZSB0byB0aGUgc2VydmVyLlxuICAgKi9cbiAgc2V0RGV2aWNlVG9rZW4oZHQpIHtcbiAgICBsZXQgc2VudCA9IGZhbHNlO1xuICAgIC8vIENvbnZlcnQgYW55IGZhbHNpc2ggdmFsdWUgdG8gbnVsbC5cbiAgICBkdCA9IGR0IHx8IG51bGw7XG4gICAgaWYgKGR0ICE9IHRoaXMuX2RldmljZVRva2VuKSB7XG4gICAgICB0aGlzLl9kZXZpY2VUb2tlbiA9IGR0O1xuICAgICAgaWYgKHRoaXMuaXNDb25uZWN0ZWQoKSAmJiB0aGlzLmlzQXV0aGVudGljYXRlZCgpKSB7XG4gICAgICAgIHRoaXMuI3NlbmQoe1xuICAgICAgICAgICdoaSc6IHtcbiAgICAgICAgICAgICdkZXYnOiBkdCB8fCBUaW5vZGUuREVMX0NIQVJcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBzZW50ID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHNlbnQ7XG4gIH1cblxuICAvKipcbiAgICogQHR5cGVkZWYgQ3JlZGVudGlhbFxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAcHJvcGVydHkge3N0cmluZ30gbWV0aCAtIHZhbGlkYXRpb24gbWV0aG9kLlxuICAgKiBAcHJvcGVydHkge3N0cmluZ30gdmFsIC0gdmFsdWUgdG8gdmFsaWRhdGUgKGUuZy4gZW1haWwgb3IgcGhvbmUgbnVtYmVyKS5cbiAgICogQHByb3BlcnR5IHtzdHJpbmd9IHJlc3AgLSB2YWxpZGF0aW9uIHJlc3BvbnNlLlxuICAgKiBAcHJvcGVydHkge09iamVjdH0gcGFyYW1zIC0gdmFsaWRhdGlvbiBwYXJhbWV0ZXJzLlxuICAgKi9cbiAgLyoqXG4gICAqIEF1dGhlbnRpY2F0ZSBjdXJyZW50IHNlc3Npb24uXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzY2hlbWUgLSBBdXRoZW50aWNhdGlvbiBzY2hlbWU7IDxjb2RlPlwiYmFzaWNcIjwvY29kZT4gaXMgdGhlIG9ubHkgY3VycmVudGx5IHN1cHBvcnRlZCBzY2hlbWUuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzZWNyZXQgLSBBdXRoZW50aWNhdGlvbiBzZWNyZXQsIGFzc3VtZWQgdG8gYmUgYWxyZWFkeSBiYXNlNjQgZW5jb2RlZC5cbiAgICogQHBhcmFtIHtDcmVkZW50aWFsPX0gY3JlZCAtIGNyZWRlbnRpYWwgY29uZmlybWF0aW9uLCBpZiByZXF1aXJlZC5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHNlcnZlciByZXBseSBpcyByZWNlaXZlZC5cbiAgICovXG4gIGxvZ2luKHNjaGVtZSwgc2VjcmV0LCBjcmVkKSB7XG4gICAgY29uc3QgcGt0ID0gdGhpcy4jaW5pdFBhY2tldCgnbG9naW4nKTtcbiAgICBwa3QubG9naW4uc2NoZW1lID0gc2NoZW1lO1xuICAgIHBrdC5sb2dpbi5zZWNyZXQgPSBzZWNyZXQ7XG4gICAgcGt0LmxvZ2luLmNyZWQgPSBjcmVkO1xuXG4gICAgcmV0dXJuIHRoaXMuI3NlbmQocGt0LCBwa3QubG9naW4uaWQpXG4gICAgICAudGhlbihjdHJsID0+IHRoaXMuI2xvZ2luU3VjY2Vzc2Z1bChjdHJsKSk7XG4gIH1cblxuICAvKipcbiAgICogV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNsb2dpbn0gd2l0aCBiYXNpYyBhdXRoZW50aWNhdGlvblxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdW5hbWUgLSBVc2VyIG5hbWUuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXNzd29yZCAgLSBQYXNzd29yZC5cbiAgICogQHBhcmFtIHtDcmVkZW50aWFsPX0gY3JlZCAtIGNyZWRlbnRpYWwgY29uZmlybWF0aW9uLCBpZiByZXF1aXJlZC5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCBvbiByZWNlaXZpbmcgc2VydmVyIHJlcGx5LlxuICAgKi9cbiAgbG9naW5CYXNpYyh1bmFtZSwgcGFzc3dvcmQsIGNyZWQpIHtcbiAgICByZXR1cm4gdGhpcy5sb2dpbignYmFzaWMnLCBiNjRFbmNvZGVVbmljb2RlKHVuYW1lICsgJzonICsgcGFzc3dvcmQpLCBjcmVkKVxuICAgICAgLnRoZW4oY3RybCA9PiB7XG4gICAgICAgIHRoaXMuX2xvZ2luID0gdW5hbWU7XG4gICAgICAgIHJldHVybiBjdHJsO1xuICAgICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNsb2dpbn0gd2l0aCB0b2tlbiBhdXRoZW50aWNhdGlvblxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9rZW4gLSBUb2tlbiByZWNlaXZlZCBpbiByZXNwb25zZSB0byBlYXJsaWVyIGxvZ2luLlxuICAgKiBAcGFyYW0ge0NyZWRlbnRpYWw9fSBjcmVkIC0gY3JlZGVudGlhbCBjb25maXJtYXRpb24sIGlmIHJlcXVpcmVkLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIG9uIHJlY2VpdmluZyBzZXJ2ZXIgcmVwbHkuXG4gICAqL1xuICBsb2dpblRva2VuKHRva2VuLCBjcmVkKSB7XG4gICAgcmV0dXJuIHRoaXMubG9naW4oJ3Rva2VuJywgdG9rZW4sIGNyZWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgYSByZXF1ZXN0IGZvciByZXNldHRpbmcgYW4gYXV0aGVudGljYXRpb24gc2VjcmV0LlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2NoZW1lIC0gYXV0aGVudGljYXRpb24gc2NoZW1lIHRvIHJlc2V0LlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWV0aG9kIC0gbWV0aG9kIHRvIHVzZSBmb3IgcmVzZXR0aW5nIHRoZSBzZWNyZXQsIHN1Y2ggYXMgXCJlbWFpbFwiIG9yIFwidGVsXCIuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSAtIHZhbHVlIG9mIHRoZSBjcmVkZW50aWFsIHRvIHVzZSwgYSBzcGVjaWZpYyBlbWFpbCBhZGRyZXNzIG9yIGEgcGhvbmUgbnVtYmVyLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIG9uIHJlY2VpdmluZyB0aGUgc2VydmVyIHJlcGx5LlxuICAgKi9cbiAgcmVxdWVzdFJlc2V0QXV0aFNlY3JldChzY2hlbWUsIG1ldGhvZCwgdmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5sb2dpbigncmVzZXQnLCBiNjRFbmNvZGVVbmljb2RlKHNjaGVtZSArICc6JyArIG1ldGhvZCArICc6JyArIHZhbHVlKSk7XG4gIH1cblxuICAvKipcbiAgICogQHR5cGVkZWYgQXV0aFRva2VuXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB0b2tlbiAtIFRva2VuIHZhbHVlLlxuICAgKiBAcHJvcGVydHkge0RhdGV9IGV4cGlyZXMgLSBUb2tlbiBleHBpcmF0aW9uIHRpbWUuXG4gICAqL1xuICAvKipcbiAgICogR2V0IHN0b3JlZCBhdXRoZW50aWNhdGlvbiB0b2tlbi5cbiAgICpcbiAgICogQHJldHVybnMge0F1dGhUb2tlbn0gYXV0aGVudGljYXRpb24gdG9rZW4uXG4gICAqL1xuICBnZXRBdXRoVG9rZW4oKSB7XG4gICAgaWYgKHRoaXMuX2F1dGhUb2tlbiAmJiAodGhpcy5fYXV0aFRva2VuLmV4cGlyZXMuZ2V0VGltZSgpID4gRGF0ZS5ub3coKSkpIHtcbiAgICAgIHJldHVybiB0aGlzLl9hdXRoVG9rZW47XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2F1dGhUb2tlbiA9IG51bGw7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGxpY2F0aW9uIG1heSBwcm92aWRlIGEgc2F2ZWQgYXV0aGVudGljYXRpb24gdG9rZW4uXG4gICAqXG4gICAqIEBwYXJhbSB7QXV0aFRva2VufSB0b2tlbiAtIGF1dGhlbnRpY2F0aW9uIHRva2VuLlxuICAgKi9cbiAgc2V0QXV0aFRva2VuKHRva2VuKSB7XG4gICAgdGhpcy5fYXV0aFRva2VuID0gdG9rZW47XG4gIH1cblxuICAvKipcbiAgICogQHR5cGVkZWYgU2V0UGFyYW1zXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBwcm9wZXJ0eSB7U2V0RGVzYz19IGRlc2MgLSBUb3BpYyBpbml0aWFsaXphdGlvbiBwYXJhbWV0ZXJzIHdoZW4gY3JlYXRpbmcgYSBuZXcgdG9waWMgb3IgYSBuZXcgc3Vic2NyaXB0aW9uLlxuICAgKiBAcHJvcGVydHkge1NldFN1Yj19IHN1YiAtIFN1YnNjcmlwdGlvbiBpbml0aWFsaXphdGlvbiBwYXJhbWV0ZXJzLlxuICAgKiBAcHJvcGVydHkge0FycmF5LjxzdHJpbmc+PX0gYXR0YWNobWVudHMgLSBVUkxzIG9mIG91dCBvZiBiYW5kIGF0dGFjaG1lbnRzIHVzZWQgaW4gcGFyYW1ldGVycy5cbiAgICovXG4gIC8qKlxuICAgKiBAdHlwZWRlZiBTZXREZXNjXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBwcm9wZXJ0eSB7RGVmQWNzPX0gZGVmYWNzIC0gRGVmYXVsdCBhY2Nlc3MgbW9kZS5cbiAgICogQHByb3BlcnR5IHtPYmplY3Q9fSBwdWJsaWMgLSBGcmVlLWZvcm0gdG9waWMgZGVzY3JpcHRpb24sIHB1YmxpY2FsbHkgYWNjZXNzaWJsZS5cbiAgICogQHByb3BlcnR5IHtPYmplY3Q9fSBwcml2YXRlIC0gRnJlZS1mb3JtIHRvcGljIGRlc2NyaXB0aW9uIGFjY2Vzc2libGUgb25seSB0byB0aGUgb3duZXIuXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0PX0gdHJ1c3RlZCAtIFRydXN0ZWQgdXNlciBkYXRhIHdoaWNoIGNhbiBiZSBzZXQgYnkgYSByb290IHVzZXIgb25seS5cbiAgICovXG4gIC8qKlxuICAgKiBAdHlwZWRlZiBTZXRTdWJcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHByb3BlcnR5IHtzdHJpbmc9fSB1c2VyIC0gVUlEIG9mIHRoZSB1c2VyIGFmZmVjdGVkIGJ5IHRoZSByZXF1ZXN0LiBEZWZhdWx0IChlbXB0eSkgLSBjdXJyZW50IHVzZXIuXG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nPX0gbW9kZSAtIFVzZXIgYWNjZXNzIG1vZGUsIGVpdGhlciByZXF1ZXN0ZWQgb3IgYXNzaWduZWQgZGVwZW5kZW50IG9uIGNvbnRleHQuXG4gICAqL1xuICAvKipcbiAgICogU2VuZCBhIHRvcGljIHN1YnNjcmlwdGlvbiByZXF1ZXN0LlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWMgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byBzdWJzY3JpYmUgdG8uXG4gICAqIEBwYXJhbSB7R2V0UXVlcnk9fSBnZXRQYXJhbXMgLSBPcHRpb25hbCBzdWJzY3JpcHRpb24gbWV0YWRhdGEgcXVlcnlcbiAgICogQHBhcmFtIHtTZXRQYXJhbXM9fSBzZXRQYXJhbXMgLSBPcHRpb25hbCBpbml0aWFsaXphdGlvbiBwYXJhbWV0ZXJzXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gcmVjZWl2aW5nIHNlcnZlciByZXBseS5cbiAgICovXG4gIHN1YnNjcmliZSh0b3BpY05hbWUsIGdldFBhcmFtcywgc2V0UGFyYW1zKSB7XG4gICAgY29uc3QgcGt0ID0gdGhpcy4jaW5pdFBhY2tldCgnc3ViJywgdG9waWNOYW1lKVxuICAgIGlmICghdG9waWNOYW1lKSB7XG4gICAgICB0b3BpY05hbWUgPSBDb25zdC5UT1BJQ19ORVc7XG4gICAgfVxuXG4gICAgcGt0LnN1Yi5nZXQgPSBnZXRQYXJhbXM7XG5cbiAgICBpZiAoc2V0UGFyYW1zKSB7XG4gICAgICBpZiAoc2V0UGFyYW1zLnN1Yikge1xuICAgICAgICBwa3Quc3ViLnNldC5zdWIgPSBzZXRQYXJhbXMuc3ViO1xuICAgICAgfVxuXG4gICAgICBpZiAoc2V0UGFyYW1zLmRlc2MpIHtcbiAgICAgICAgY29uc3QgZGVzYyA9IHNldFBhcmFtcy5kZXNjO1xuICAgICAgICBpZiAoVGlub2RlLmlzTmV3R3JvdXBUb3BpY05hbWUodG9waWNOYW1lKSkge1xuICAgICAgICAgIC8vIEZ1bGwgc2V0LmRlc2MgcGFyYW1zIGFyZSB1c2VkIGZvciBuZXcgdG9waWNzIG9ubHlcbiAgICAgICAgICBwa3Quc3ViLnNldC5kZXNjID0gZGVzYztcbiAgICAgICAgfSBlbHNlIGlmIChUaW5vZGUuaXNQMlBUb3BpY05hbWUodG9waWNOYW1lKSAmJiBkZXNjLmRlZmFjcykge1xuICAgICAgICAgIC8vIFVzZSBvcHRpb25hbCBkZWZhdWx0IHBlcm1pc3Npb25zIG9ubHkuXG4gICAgICAgICAgcGt0LnN1Yi5zZXQuZGVzYyA9IHtcbiAgICAgICAgICAgIGRlZmFjczogZGVzYy5kZWZhY3NcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFNlZSBpZiBleHRlcm5hbCBvYmplY3RzIHdlcmUgdXNlZCBpbiB0b3BpYyBkZXNjcmlwdGlvbi5cbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHNldFBhcmFtcy5hdHRhY2htZW50cykgJiYgc2V0UGFyYW1zLmF0dGFjaG1lbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcGt0LmV4dHJhID0ge1xuICAgICAgICAgIGF0dGFjaG1lbnRzOiBzZXRQYXJhbXMuYXR0YWNobWVudHMuZmlsdGVyKHJlZiA9PiBpc1VybFJlbGF0aXZlKHJlZikpXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIGlmIChzZXRQYXJhbXMudGFncykge1xuICAgICAgICBwa3Quc3ViLnNldC50YWdzID0gc2V0UGFyYW1zLnRhZ3M7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzLiNzZW5kKHBrdCwgcGt0LnN1Yi5pZCk7XG4gIH1cblxuICAvKipcbiAgICogRGV0YWNoIGFuZCBvcHRpb25hbGx5IHVuc3Vic2NyaWJlIGZyb20gdGhlIHRvcGljXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpYyAtIFRvcGljIHRvIGRldGFjaCBmcm9tLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHVuc3ViIC0gSWYgPGNvZGU+dHJ1ZTwvY29kZT4sIGRldGFjaCBhbmQgdW5zdWJzY3JpYmUsIG90aGVyd2lzZSBqdXN0IGRldGFjaC5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCBvbiByZWNlaXZpbmcgc2VydmVyIHJlcGx5LlxuICAgKi9cbiAgbGVhdmUodG9waWMsIHVuc3ViKSB7XG4gICAgY29uc3QgcGt0ID0gdGhpcy4jaW5pdFBhY2tldCgnbGVhdmUnLCB0b3BpYyk7XG4gICAgcGt0LmxlYXZlLnVuc3ViID0gdW5zdWI7XG5cbiAgICByZXR1cm4gdGhpcy4jc2VuZChwa3QsIHBrdC5sZWF2ZS5pZCk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIG1lc3NhZ2UgZHJhZnQgd2l0aG91dCBzZW5kaW5nIGl0IHRvIHRoZSBzZXJ2ZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpYyAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIHB1Ymxpc2ggdG8uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZW50IC0gUGF5bG9hZCB0byBwdWJsaXNoLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBub0VjaG8gLSBJZiA8Y29kZT50cnVlPC9jb2RlPiwgdGVsbCB0aGUgc2VydmVyIG5vdCB0byBlY2hvIHRoZSBtZXNzYWdlIHRvIHRoZSBvcmlnaW5hbCBzZXNzaW9uLlxuICAgKlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSBuZXcgbWVzc2FnZSB3aGljaCBjYW4gYmUgc2VudCB0byB0aGUgc2VydmVyIG9yIG90aGVyd2lzZSB1c2VkLlxuICAgKi9cbiAgY3JlYXRlTWVzc2FnZSh0b3BpYywgY29udGVudCwgbm9FY2hvKSB7XG4gICAgY29uc3QgcGt0ID0gdGhpcy4jaW5pdFBhY2tldCgncHViJywgdG9waWMpO1xuXG4gICAgbGV0IGRmdCA9IHR5cGVvZiBjb250ZW50ID09ICdzdHJpbmcnID8gRHJhZnR5LnBhcnNlKGNvbnRlbnQpIDogY29udGVudDtcbiAgICBpZiAoZGZ0ICYmICFEcmFmdHkuaXNQbGFpblRleHQoZGZ0KSkge1xuICAgICAgcGt0LnB1Yi5oZWFkID0ge1xuICAgICAgICBtaW1lOiBEcmFmdHkuZ2V0Q29udGVudFR5cGUoKVxuICAgICAgfTtcbiAgICAgIGNvbnRlbnQgPSBkZnQ7XG4gICAgfVxuICAgIHBrdC5wdWIubm9lY2hvID0gbm9FY2hvO1xuICAgIHBrdC5wdWIuY29udGVudCA9IGNvbnRlbnQ7XG5cbiAgICByZXR1cm4gcGt0LnB1YjtcbiAgfVxuXG4gIC8qKlxuICAgKiBQdWJsaXNoIHtkYXRhfSBtZXNzYWdlIHRvIHRvcGljLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWNOYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gcHVibGlzaCB0by5cbiAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRlbnQgLSBQYXlsb2FkIHRvIHB1Ymxpc2guXG4gICAqIEBwYXJhbSB7Ym9vbGVhbj19IG5vRWNobyAtIElmIDxjb2RlPnRydWU8L2NvZGU+LCB0ZWxsIHRoZSBzZXJ2ZXIgbm90IHRvIGVjaG8gdGhlIG1lc3NhZ2UgdG8gdGhlIG9yaWdpbmFsIHNlc3Npb24uXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gcmVjZWl2aW5nIHNlcnZlciByZXBseS5cbiAgICovXG4gIHB1Ymxpc2godG9waWNOYW1lLCBjb250ZW50LCBub0VjaG8pIHtcbiAgICByZXR1cm4gdGhpcy5wdWJsaXNoTWVzc2FnZShcbiAgICAgIHRoaXMuY3JlYXRlTWVzc2FnZSh0b3BpY05hbWUsIGNvbnRlbnQsIG5vRWNobylcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIFB1Ymxpc2ggbWVzc2FnZSB0byB0b3BpYy4gVGhlIG1lc3NhZ2Ugc2hvdWxkIGJlIGNyZWF0ZWQgYnkge0BsaW5rIFRpbm9kZSNjcmVhdGVNZXNzYWdlfS5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHB1YiAtIE1lc3NhZ2UgdG8gcHVibGlzaC5cbiAgICogQHBhcmFtIHtBcnJheS48c3RyaW5nPj19IGF0dGFjaG1lbnRzIC0gYXJyYXkgb2YgVVJMcyB3aXRoIGF0dGFjaG1lbnRzLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIG9uIHJlY2VpdmluZyBzZXJ2ZXIgcmVwbHkuXG4gICAqL1xuICBwdWJsaXNoTWVzc2FnZShwdWIsIGF0dGFjaG1lbnRzKSB7XG4gICAgLy8gTWFrZSBhIHNoYWxsb3cgY29weS4gTmVlZGVkIGluIG9yZGVyIHRvIGNsZWFyIGxvY2FsbHktYXNzaWduZWQgdGVtcCB2YWx1ZXM7XG4gICAgcHViID0gT2JqZWN0LmFzc2lnbih7fSwgcHViKTtcbiAgICBwdWIuc2VxID0gdW5kZWZpbmVkO1xuICAgIHB1Yi5mcm9tID0gdW5kZWZpbmVkO1xuICAgIHB1Yi50cyA9IHVuZGVmaW5lZDtcbiAgICBjb25zdCBtc2cgPSB7XG4gICAgICBwdWI6IHB1YixcbiAgICB9O1xuICAgIGlmIChhdHRhY2htZW50cykge1xuICAgICAgbXNnLmV4dHJhID0ge1xuICAgICAgICBhdHRhY2htZW50czogYXR0YWNobWVudHMuZmlsdGVyKHJlZiA9PiBpc1VybFJlbGF0aXZlKHJlZikpXG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy4jc2VuZChtc2csIHB1Yi5pZCk7XG4gIH1cblxuICAvKipcbiAgICogT3V0IG9mIGJhbmQgbm90aWZpY2F0aW9uOiBub3RpZnkgdG9waWMgdGhhdCBhbiBleHRlcm5hbCAocHVzaCkgbm90aWZpY2F0aW9uIHdhcyByZWNpdmVkIGJ5IHRoZSBjbGllbnQuXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBkYXRhIC0gbm90aWZpY2F0aW9uIHBheWxvYWQuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBkYXRhLndoYXQgLSBub3RpZmljYXRpb24gdHlwZSwgJ21zZycsICdyZWFkJywgJ3N1YicuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBkYXRhLnRvcGljIC0gbmFtZSBvZiB0aGUgdXBkYXRlZCB0b3BpYy5cbiAgICogQHBhcmFtIHtudW1iZXI9fSBkYXRhLnNlcSAtIHNlcSBJRCBvZiB0aGUgYWZmZWN0ZWQgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtzdHJpbmc9fSBkYXRhLnhmcm9tIC0gVUlEIG9mIHRoZSBzZW5kZXIuXG4gICAqIEBwYXJhbSB7b2JqZWN0PX0gZGF0YS5naXZlbiAtIG5ldyBzdWJzY3JpcHRpb24gJ2dpdmVuJywgZS5nLiAnQVNXUC4uLicuXG4gICAqIEBwYXJhbSB7b2JqZWN0PX0gZGF0YS53YW50IC0gbmV3IHN1YnNjcmlwdGlvbiAnd2FudCcsIGUuZy4gJ1JXSi4uLicuXG4gICAqL1xuICBvb2JOb3RpZmljYXRpb24oZGF0YSkge1xuICAgIHRoaXMubG9nZ2VyKFwib29iOiBcIiArICh0aGlzLl90cmltTG9uZ1N0cmluZ3MgPyBKU09OLnN0cmluZ2lmeShkYXRhLCBqc29uTG9nZ2VySGVscGVyKSA6IGRhdGEpKTtcblxuICAgIHN3aXRjaCAoZGF0YS53aGF0KSB7XG4gICAgICBjYXNlICdtc2cnOlxuICAgICAgICBpZiAoIWRhdGEuc2VxIHx8IGRhdGEuc2VxIDwgMSB8fCAhZGF0YS50b3BpYykge1xuICAgICAgICAgIC8vIFNlcnZlciBzZW50IGludmFsaWQgZGF0YS5cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5pc0Nvbm5lY3RlZCgpKSB7XG4gICAgICAgICAgLy8gTGV0J3MgaWdub3JlIHRoZSBtZXNzYWdlIGlzIHRoZXJlIGlzIG5vIGNvbm5lY3Rpb246IG5vIGNvbm5lY3Rpb24gbWVhbnMgdGhlcmUgYXJlIG5vIG9wZW5cbiAgICAgICAgICAvLyB0YWJzIHdpdGggVGlub2RlLlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdG9waWMgPSB0aGlzLiNjYWNoZUdldCgndG9waWMnLCBkYXRhLnRvcGljKTtcbiAgICAgICAgaWYgKCF0b3BpYykge1xuICAgICAgICAgIC8vIFRPRE86IGNoZWNrIGlmIHRoZXJlIGlzIGEgY2FzZSB3aGVuIGEgbWVzc2FnZSBjYW4gYXJyaXZlIGZyb20gYW4gdW5rbm93biB0b3BpYy5cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0b3BpYy5pc1N1YnNjcmliZWQoKSkge1xuICAgICAgICAgIC8vIE5vIG5lZWQgdG8gZmV0Y2g6IHRvcGljIGlzIGFscmVhZHkgc3Vic2NyaWJlZCBhbmQgZ290IGRhdGEgdGhyb3VnaCBub3JtYWwgY2hhbm5lbC5cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0b3BpYy5tYXhNc2dTZXEoKSA8IGRhdGEuc2VxKSB7XG4gICAgICAgICAgaWYgKHRvcGljLmlzQ2hhbm5lbFR5cGUoKSkge1xuICAgICAgICAgICAgdG9waWMuX3VwZGF0ZVJlY2VpdmVkKGRhdGEuc2VxLCAnZmFrZS11aWQnKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBOZXcgbWVzc2FnZS5cbiAgICAgICAgICBpZiAoZGF0YS54ZnJvbSAmJiAhdGhpcy4jY2FjaGVHZXQoJ3VzZXInLCBkYXRhLnhmcm9tKSkge1xuICAgICAgICAgICAgLy8gTWVzc2FnZSBmcm9tIHVua25vd24gc2VuZGVyLCBmZXRjaCBkZXNjcmlwdGlvbiBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAgICAgICAgICAvLyBTZW5kaW5nIGFzeW5jaHJvbm91c2x5IHdpdGhvdXQgYSBzdWJzY3JpcHRpb24uXG4gICAgICAgICAgICB0aGlzLmdldE1ldGEoZGF0YS54ZnJvbSwgbmV3IE1ldGFHZXRCdWlsZGVyKCkud2l0aERlc2MoKS5idWlsZCgpKS5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmxvZ2dlcihcIkZhaWxlZCB0byBnZXQgdGhlIG5hbWUgb2YgYSBuZXcgc2VuZGVyXCIsIGVycik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0b3BpYy5zdWJzY3JpYmUobnVsbCkudGhlbihfID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0b3BpYy5nZXRNZXRhKG5ldyBNZXRhR2V0QnVpbGRlcih0b3BpYykud2l0aExhdGVyRGF0YSgyNCkud2l0aExhdGVyRGVsKDI0KS5idWlsZCgpKTtcbiAgICAgICAgICB9KS50aGVuKF8gPT4ge1xuICAgICAgICAgICAgLy8gQWxsb3cgZGF0YSBmZXRjaCB0byBjb21wbGV0ZSBhbmQgZ2V0IHByb2Nlc3NlZCBzdWNjZXNzZnVsbHkuXG4gICAgICAgICAgICB0b3BpYy5sZWF2ZURlbGF5ZWQoZmFsc2UsIDEwMDApO1xuICAgICAgICAgIH0pLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlcihcIk9uIHB1c2ggZGF0YSBmZXRjaCBmYWlsZWRcIiwgZXJyKTtcbiAgICAgICAgICB9KS5maW5hbGx5KF8gPT4ge1xuICAgICAgICAgICAgdGhpcy5nZXRNZVRvcGljKCkuX3JlZnJlc2hDb250YWN0KCdtc2cnLCB0b3BpYyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ3JlYWQnOlxuICAgICAgICB0aGlzLmdldE1lVG9waWMoKS5fcm91dGVQcmVzKHtcbiAgICAgICAgICB3aGF0OiAncmVhZCcsXG4gICAgICAgICAgc2VxOiBkYXRhLnNlcVxuICAgICAgICB9KTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ3N1Yic6XG4gICAgICAgIGlmICghdGhpcy5pc01lKGRhdGEueGZyb20pKSB7XG4gICAgICAgICAgLy8gVE9ETzogaGFuZGxlIHVwZGF0ZXMgZnJvbSBvdGhlciB1c2Vycy5cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBtb2RlID0ge1xuICAgICAgICAgIGdpdmVuOiBkYXRhLm1vZGVHaXZlbixcbiAgICAgICAgICB3YW50OiBkYXRhLm1vZGVXYW50XG4gICAgICAgIH07XG4gICAgICAgIGxldCBhY3MgPSBuZXcgQWNjZXNzTW9kZShtb2RlKTtcbiAgICAgICAgbGV0IHByZXMgPSAoIWFjcy5tb2RlIHx8IGFjcy5tb2RlID09IEFjY2Vzc01vZGUuX05PTkUpID9cbiAgICAgICAgICAvLyBTdWJzY3JpcHRpb24gZGVsZXRlZC5cbiAgICAgICAgICB7XG4gICAgICAgICAgICB3aGF0OiAnZ29uZScsXG4gICAgICAgICAgICBzcmM6IGRhdGEudG9waWNcbiAgICAgICAgICB9IDpcbiAgICAgICAgICAvLyBOZXcgc3Vic2NyaXB0aW9uIG9yIHN1YnNjcmlwdGlvbiB1cGRhdGVkLlxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHdoYXQ6ICdhY3MnLFxuICAgICAgICAgICAgc3JjOiBkYXRhLnRvcGljLFxuICAgICAgICAgICAgZGFjczogbW9kZVxuICAgICAgICAgIH07XG4gICAgICAgIHRoaXMuZ2V0TWVUb3BpYygpLl9yb3V0ZVByZXMocHJlcyk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aGlzLmxvZ2dlcihcIlVua25vd24gcHVzaCB0eXBlIGlnbm9yZWRcIiwgZGF0YS53aGF0KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHR5cGVkZWYgR2V0UXVlcnlcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHByb3BlcnR5IHtHZXRPcHRzVHlwZT19IGRlc2MgLSBJZiBwcm92aWRlZCAoZXZlbiBpZiBlbXB0eSksIGZldGNoIHRvcGljIGRlc2NyaXB0aW9uLlxuICAgKiBAcHJvcGVydHkge0dldE9wdHNUeXBlPX0gc3ViIC0gSWYgcHJvdmlkZWQgKGV2ZW4gaWYgZW1wdHkpLCBmZXRjaCB0b3BpYyBzdWJzY3JpcHRpb25zLlxuICAgKiBAcHJvcGVydHkge0dldERhdGFUeXBlPX0gZGF0YSAtIElmIHByb3ZpZGVkIChldmVuIGlmIGVtcHR5KSwgZ2V0IG1lc3NhZ2VzLlxuICAgKi9cblxuICAvKipcbiAgICogQHR5cGVkZWYgR2V0T3B0c1R5cGVcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHByb3BlcnR5IHtEYXRlPX0gaW1zIC0gXCJJZiBtb2RpZmllZCBzaW5jZVwiLCBmZXRjaCBkYXRhIG9ubHkgaXQgd2FzIHdhcyBtb2RpZmllZCBzaW5jZSBzdGF0ZWQgZGF0ZS5cbiAgICogQHByb3BlcnR5IHtudW1iZXI9fSBsaW1pdCAtIE1heGltdW0gbnVtYmVyIG9mIHJlc3VsdHMgdG8gcmV0dXJuLiBJZ25vcmVkIHdoZW4gcXVlcnlpbmcgdG9waWMgZGVzY3JpcHRpb24uXG4gICAqL1xuXG4gIC8qKlxuICAgKiBAdHlwZWRlZiBHZXREYXRhVHlwZVxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAcHJvcGVydHkge251bWJlcj19IHNpbmNlIC0gTG9hZCBtZXNzYWdlcyB3aXRoIHNlcSBpZCBlcXVhbCBvciBncmVhdGVyIHRoYW4gdGhpcyB2YWx1ZS5cbiAgICogQHByb3BlcnR5IHtudW1iZXI9fSBiZWZvcmUgLSBMb2FkIG1lc3NhZ2VzIHdpdGggc2VxIGlkIGxvd2VyIHRoYW4gdGhpcyBudW1iZXIuXG4gICAqIEBwcm9wZXJ0eSB7bnVtYmVyPX0gbGltaXQgLSBNYXhpbXVtIG51bWJlciBvZiByZXN1bHRzIHRvIHJldHVybi5cbiAgICovXG5cbiAgLyoqXG4gICAqIFJlcXVlc3QgdG9waWMgbWV0YWRhdGFcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gcXVlcnkuXG4gICAqIEBwYXJhbSB7R2V0UXVlcnl9IHBhcmFtcyAtIFBhcmFtZXRlcnMgb2YgdGhlIHF1ZXJ5LiBVc2Uge0BsaW5rIFRpbm9kZS5NZXRhR2V0QnVpbGRlcn0gdG8gZ2VuZXJhdGUuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gcmVjZWl2aW5nIHNlcnZlciByZXBseS5cbiAgICovXG4gIGdldE1ldGEodG9waWMsIHBhcmFtcykge1xuICAgIGNvbnN0IHBrdCA9IHRoaXMuI2luaXRQYWNrZXQoJ2dldCcsIHRvcGljKTtcblxuICAgIHBrdC5nZXQgPSBtZXJnZU9iaihwa3QuZ2V0LCBwYXJhbXMpO1xuXG4gICAgcmV0dXJuIHRoaXMuI3NlbmQocGt0LCBwa3QuZ2V0LmlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgdG9waWMncyBtZXRhZGF0YTogZGVzY3JpcHRpb24sIHN1YnNjcmlidGlvbnMuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpYyAtIFRvcGljIHRvIHVwZGF0ZS5cbiAgICogQHBhcmFtIHtTZXRQYXJhbXN9IHBhcmFtcyAtIHRvcGljIG1ldGFkYXRhIHRvIHVwZGF0ZS5cbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCBvbiByZWNlaXZpbmcgc2VydmVyIHJlcGx5LlxuICAgKi9cbiAgc2V0TWV0YSh0b3BpYywgcGFyYW1zKSB7XG4gICAgY29uc3QgcGt0ID0gdGhpcy4jaW5pdFBhY2tldCgnc2V0JywgdG9waWMpO1xuICAgIGNvbnN0IHdoYXQgPSBbXTtcblxuICAgIGlmIChwYXJhbXMpIHtcbiAgICAgIFsnZGVzYycsICdzdWInLCAndGFncycsICdjcmVkJywgJ2VwaGVtZXJhbCddLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgIGlmIChwYXJhbXMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgIHdoYXQucHVzaChrZXkpO1xuICAgICAgICAgIHBrdC5zZXRba2V5XSA9IHBhcmFtc1trZXldO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkocGFyYW1zLmF0dGFjaG1lbnRzKSAmJiBwYXJhbXMuYXR0YWNobWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgICBwa3QuZXh0cmEgPSB7XG4gICAgICAgICAgYXR0YWNobWVudHM6IHBhcmFtcy5hdHRhY2htZW50cy5maWx0ZXIocmVmID0+IGlzVXJsUmVsYXRpdmUocmVmKSlcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAod2hhdC5sZW5ndGggPT0gMCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIkludmFsaWQge3NldH0gcGFyYW1ldGVyc1wiKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuI3NlbmQocGt0LCBwa3Quc2V0LmlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSYW5nZSBvZiBtZXNzYWdlIElEcyB0byBkZWxldGUuXG4gICAqXG4gICAqIEB0eXBlZGVmIERlbFJhbmdlXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBsb3cgLSBsb3cgZW5kIG9mIHRoZSByYW5nZSwgaW5jbHVzaXZlIChjbG9zZWQpLlxuICAgKiBAcHJvcGVydHkge251bWJlcj19IGhpIC0gaGlnaCBlbmQgb2YgdGhlIHJhbmdlLCBleGNsdXNpdmUgKG9wZW4pLlxuICAgKi9cbiAgLyoqXG4gICAqIERlbGV0ZSBzb21lIG9yIGFsbCBtZXNzYWdlcyBpbiBhIHRvcGljLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWMgLSBUb3BpYyBuYW1lIHRvIGRlbGV0ZSBtZXNzYWdlcyBmcm9tLlxuICAgKiBAcGFyYW0ge0RlbFJhbmdlW119IGxpc3QgLSBSYW5nZXMgb2YgbWVzc2FnZSBJRHMgdG8gZGVsZXRlLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBoYXJkIC0gSGFyZCBvciBzb2Z0IGRlbGV0ZVxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIG9uIHJlY2VpdmluZyBzZXJ2ZXIgcmVwbHkuXG4gICAqL1xuICBkZWxNZXNzYWdlcyh0b3BpYywgcmFuZ2VzLCBoYXJkKSB7XG4gICAgY29uc3QgcGt0ID0gdGhpcy4jaW5pdFBhY2tldCgnZGVsJywgdG9waWMpO1xuXG4gICAgcGt0LmRlbC53aGF0ID0gJ21zZyc7XG4gICAgcGt0LmRlbC5kZWxzZXEgPSByYW5nZXM7XG4gICAgcGt0LmRlbC5oYXJkID0gaGFyZDtcblxuICAgIHJldHVybiB0aGlzLiNzZW5kKHBrdCwgcGt0LmRlbC5pZCk7XG4gIH1cblxuICAvKipcbiAgICogRGVsZXRlIHRoZSB0b3BpYyBhbGx0b2dldGhlci4gUmVxdWlyZXMgT3duZXIgcGVybWlzc2lvbi5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljTmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIGRlbGV0ZVxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGhhcmQgLSBoYXJkLWRlbGV0ZSB0b3BpYy5cbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCBvbiByZWNlaXZpbmcgc2VydmVyIHJlcGx5LlxuICAgKi9cbiAgZGVsVG9waWModG9waWNOYW1lLCBoYXJkKSB7XG4gICAgY29uc3QgcGt0ID0gdGhpcy4jaW5pdFBhY2tldCgnZGVsJywgdG9waWNOYW1lKTtcbiAgICBwa3QuZGVsLndoYXQgPSAndG9waWMnO1xuICAgIHBrdC5kZWwuaGFyZCA9IGhhcmQ7XG5cbiAgICByZXR1cm4gdGhpcy4jc2VuZChwa3QsIHBrdC5kZWwuaWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIERlbGV0ZSBzdWJzY3JpcHRpb24uIFJlcXVpcmVzIFNoYXJlIHBlcm1pc3Npb24uXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpY05hbWUgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byBkZWxldGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVzZXIgLSBVc2VyIElEIHRvIHJlbW92ZS5cbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCBvbiByZWNlaXZpbmcgc2VydmVyIHJlcGx5LlxuICAgKi9cbiAgZGVsU3Vic2NyaXB0aW9uKHRvcGljTmFtZSwgdXNlcikge1xuICAgIGNvbnN0IHBrdCA9IHRoaXMuI2luaXRQYWNrZXQoJ2RlbCcsIHRvcGljTmFtZSk7XG4gICAgcGt0LmRlbC53aGF0ID0gJ3N1Yic7XG4gICAgcGt0LmRlbC51c2VyID0gdXNlcjtcblxuICAgIHJldHVybiB0aGlzLiNzZW5kKHBrdCwgcGt0LmRlbC5pZCk7XG4gIH1cblxuICAvKipcbiAgICogRGVsZXRlIGNyZWRlbnRpYWwuIEFsd2F5cyBzZW50IG9uIDxjb2RlPidtZSc8L2NvZGU+IHRvcGljLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWV0aG9kIC0gdmFsaWRhdGlvbiBtZXRob2Qgc3VjaCBhcyA8Y29kZT4nZW1haWwnPC9jb2RlPiBvciA8Y29kZT4ndGVsJzwvY29kZT4uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSAtIHZhbGlkYXRpb24gdmFsdWUsIGkuZS4gPGNvZGU+J2FsaWNlQGV4YW1wbGUuY29tJzwvY29kZT4uXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gcmVjZWl2aW5nIHNlcnZlciByZXBseS5cbiAgICovXG4gIGRlbENyZWRlbnRpYWwobWV0aG9kLCB2YWx1ZSkge1xuICAgIGNvbnN0IHBrdCA9IHRoaXMuI2luaXRQYWNrZXQoJ2RlbCcsIENvbnN0LlRPUElDX01FKTtcbiAgICBwa3QuZGVsLndoYXQgPSAnY3JlZCc7XG4gICAgcGt0LmRlbC5jcmVkID0ge1xuICAgICAgbWV0aDogbWV0aG9kLFxuICAgICAgdmFsOiB2YWx1ZVxuICAgIH07XG5cbiAgICByZXR1cm4gdGhpcy4jc2VuZChwa3QsIHBrdC5kZWwuaWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcXVlc3QgdG8gZGVsZXRlIGFjY291bnQgb2YgdGhlIGN1cnJlbnQgdXNlci5cbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSBoYXJkIC0gaGFyZC1kZWxldGUgdXNlci5cbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCBvbiByZWNlaXZpbmcgc2VydmVyIHJlcGx5LlxuICAgKi9cbiAgZGVsQ3VycmVudFVzZXIoaGFyZCkge1xuICAgIGNvbnN0IHBrdCA9IHRoaXMuI2luaXRQYWNrZXQoJ2RlbCcsIG51bGwpO1xuICAgIHBrdC5kZWwud2hhdCA9ICd1c2VyJztcbiAgICBwa3QuZGVsLmhhcmQgPSBoYXJkO1xuXG4gICAgcmV0dXJuIHRoaXMuI3NlbmQocGt0LCBwa3QuZGVsLmlkKS50aGVuKF8gPT4ge1xuICAgICAgdGhpcy5fbXlVSUQgPSBudWxsO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIE5vdGlmeSBzZXJ2ZXIgdGhhdCBhIG1lc3NhZ2Ugb3IgbWVzc2FnZXMgd2VyZSByZWFkIG9yIHJlY2VpdmVkLiBEb2VzIE5PVCByZXR1cm4gcHJvbWlzZS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljTmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHdoZXJlIHRoZSBtZXNhZ2UgaXMgYmVpbmcgYWtub3dsZWRnZWQuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB3aGF0IC0gQWN0aW9uIGJlaW5nIGFrbm93bGVkZ2VkLCBlaXRoZXIgPGNvZGU+XCJyZWFkXCI8L2NvZGU+IG9yIDxjb2RlPlwicmVjdlwiPC9jb2RlPi5cbiAgICogQHBhcmFtIHtudW1iZXJ9IHNlcSAtIE1heGltdW0gaWQgb2YgdGhlIG1lc3NhZ2UgYmVpbmcgYWNrbm93bGVkZ2VkLlxuICAgKi9cbiAgbm90ZSh0b3BpY05hbWUsIHdoYXQsIHNlcSkge1xuICAgIGlmIChzZXEgPD0gMCB8fCBzZXEgPj0gQ29uc3QuTE9DQUxfU0VRSUQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBtZXNzYWdlIGlkICR7c2VxfWApO1xuICAgIH1cblxuICAgIGNvbnN0IHBrdCA9IHRoaXMuI2luaXRQYWNrZXQoJ25vdGUnLCB0b3BpY05hbWUpO1xuICAgIHBrdC5ub3RlLndoYXQgPSB3aGF0O1xuICAgIHBrdC5ub3RlLnNlcSA9IHNlcTtcbiAgICB0aGlzLiNzZW5kKHBrdCk7XG4gIH1cblxuICAvKipcbiAgICogQnJvYWRjYXN0IGEga2V5LXByZXNzIG5vdGlmaWNhdGlvbiB0byB0b3BpYyBzdWJzY3JpYmVycy4gVXNlZCB0byBzaG93XG4gICAqIHR5cGluZyBub3RpZmljYXRpb25zIFwidXNlciBYIGlzIHR5cGluZy4uLlwiLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWNOYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gYnJvYWRjYXN0IHRvLlxuICAgKi9cbiAgbm90ZUtleVByZXNzKHRvcGljTmFtZSkge1xuICAgIGNvbnN0IHBrdCA9IHRoaXMuI2luaXRQYWNrZXQoJ25vdGUnLCB0b3BpY05hbWUpO1xuICAgIHBrdC5ub3RlLndoYXQgPSAna3AnO1xuICAgIHRoaXMuI3NlbmQocGt0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kIGEgdmlkZW8gY2FsbCBub3RpZmljYXRpb24gdG8gdG9waWMgc3Vic2NyaWJlcnMgKGluY2x1ZGluZyBkaWFsaW5nLFxuICAgKiBoYW5ndXAsIGV0Yy4pLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWNOYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gYnJvYWRjYXN0IHRvLlxuICAgKiBAcGFyYW0ge2ludH0gc2VxIC0gSUQgb2YgdGhlIGNhbGwgbWVzc2FnZSB0aGUgZXZlbnQgcGVydGFpbnMgdG8uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBldnQgLSBDYWxsIGV2ZW50LlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGF5bG9hZCAtIFBheWxvYWQgYXNzb2NpYXRlZCB3aXRoIHRoaXMgZXZlbnQgKGUuZy4gU0RQIHN0cmluZykuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIChmb3Igc29tZSBjYWxsIGV2ZW50cykgd2hpY2ggd2lsbFxuICAgKiAgICAgICAgICAgICAgICAgICAgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gcmVjZWl2aW5nIHNlcnZlciByZXBseVxuICAgKi9cbiAgdmlkZW9DYWxsKHRvcGljTmFtZSwgc2VxLCBldnQsIHBheWxvYWQpIHtcbiAgICBjb25zdCBwa3QgPSB0aGlzLiNpbml0UGFja2V0KCdub3RlJywgdG9waWNOYW1lKTtcbiAgICBwa3Qubm90ZS5zZXEgPSBzZXE7XG4gICAgcGt0Lm5vdGUud2hhdCA9ICdjYWxsJztcbiAgICBwa3Qubm90ZS5ldmVudCA9IGV2dDtcbiAgICBwa3Qubm90ZS5wYXlsb2FkID0gcGF5bG9hZDtcbiAgICB0aGlzLiNzZW5kKHBrdCwgcGt0Lm5vdGUuaWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhIG5hbWVkIHRvcGljLCBlaXRoZXIgcHVsbCBpdCBmcm9tIGNhY2hlIG9yIGNyZWF0ZSBhIG5ldyBpbnN0YW5jZS5cbiAgICogVGhlcmUgaXMgYSBzaW5nbGUgaW5zdGFuY2Ugb2YgdG9waWMgZm9yIGVhY2ggbmFtZS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljTmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIGdldC5cbiAgICpcbiAgICogQHJldHVybnMge1RvcGljfSBSZXF1ZXN0ZWQgb3IgbmV3bHkgY3JlYXRlZCB0b3BpYyBvciA8Y29kZT51bmRlZmluZWQ8L2NvZGU+IGlmIHRvcGljIG5hbWUgaXMgaW52YWxpZC5cbiAgICovXG4gIGdldFRvcGljKHRvcGljTmFtZSkge1xuICAgIGxldCB0b3BpYyA9IHRoaXMuI2NhY2hlR2V0KCd0b3BpYycsIHRvcGljTmFtZSk7XG4gICAgaWYgKCF0b3BpYyAmJiB0b3BpY05hbWUpIHtcbiAgICAgIGlmICh0b3BpY05hbWUgPT0gQ29uc3QuVE9QSUNfTUUpIHtcbiAgICAgICAgdG9waWMgPSBuZXcgVG9waWNNZSgpO1xuICAgICAgfSBlbHNlIGlmICh0b3BpY05hbWUgPT0gQ29uc3QuVE9QSUNfRk5EKSB7XG4gICAgICAgIHRvcGljID0gbmV3IFRvcGljRm5kKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0b3BpYyA9IG5ldyBUb3BpYyh0b3BpY05hbWUpO1xuICAgICAgfVxuICAgICAgLy8gQ2FjaGUgbWFuYWdlbWVudC5cbiAgICAgIHRoaXMuI2F0dGFjaENhY2hlVG9Ub3BpYyh0b3BpYyk7XG4gICAgICB0b3BpYy5fY2FjaGVQdXRTZWxmKCk7XG4gICAgICAvLyBEb24ndCBzYXZlIHRvIERCIGhlcmU6IGEgcmVjb3JkIHdpbGwgYmUgYWRkZWQgd2hlbiB0aGUgdG9waWMgaXMgc3Vic2NyaWJlZC5cbiAgICB9XG4gICAgcmV0dXJuIHRvcGljO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhIG5hbWVkIHRvcGljIGZyb20gY2FjaGUuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpY05hbWUgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byBnZXQuXG4gICAqXG4gICAqIEByZXR1cm5zIHtUb3BpY30gUmVxdWVzdGVkIHRvcGljIG9yIDxjb2RlPnVuZGVmaW5lZDwvY29kZT4gaWYgdG9waWMgaXMgbm90IGZvdW5kIGluIGNhY2hlLlxuICAgKi9cbiAgY2FjaGVHZXRUb3BpYyh0b3BpY05hbWUpIHtcbiAgICByZXR1cm4gdGhpcy4jY2FjaGVHZXQoJ3RvcGljJywgdG9waWNOYW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgbmFtZWQgdG9waWMgZnJvbSBjYWNoZS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljTmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIHJlbW92ZSBmcm9tIGNhY2hlLlxuICAgKi9cbiAgY2FjaGVSZW1Ub3BpYyh0b3BpY05hbWUpIHtcbiAgICB0aGlzLiNjYWNoZURlbCgndG9waWMnLCB0b3BpY05hbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEl0ZXJhdGUgb3ZlciBjYWNoZWQgdG9waWNzLlxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIC0gY2FsbGJhY2sgdG8gY2FsbCBmb3IgZWFjaCB0b3BpYy5cbiAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHQgLSAndGhpcycgaW5zaWRlIHRoZSAnZnVuYycuXG4gICAqL1xuICBtYXBUb3BpY3MoZnVuYywgY29udGV4dCkge1xuICAgIHRoaXMuI2NhY2hlTWFwKCd0b3BpYycsIGZ1bmMsIGNvbnRleHQpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIG5hbWVkIHRvcGljIGlzIGFscmVhZHkgcHJlc2VudCBpbiBjYWNoZS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljTmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiB0b3BpYyBpcyBmb3VuZCBpbiBjYWNoZSwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgKi9cbiAgaXNUb3BpY0NhY2hlZCh0b3BpY05hbWUpIHtcbiAgICByZXR1cm4gISF0aGlzLiNjYWNoZUdldCgndG9waWMnLCB0b3BpY05hbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlIHVuaXF1ZSBuYW1lIGxpa2UgPGNvZGU+J25ldzEyMzQ1Nic8L2NvZGU+IHN1aXRhYmxlIGZvciBjcmVhdGluZyBhIG5ldyBncm91cCB0b3BpYy5cbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSBpc0NoYW4gLSBpZiB0aGUgdG9waWMgaXMgY2hhbm5lbC1lbmFibGVkLlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBuYW1lIHdoaWNoIGNhbiBiZSB1c2VkIGZvciBjcmVhdGluZyBhIG5ldyBncm91cCB0b3BpYy5cbiAgICovXG4gIG5ld0dyb3VwVG9waWNOYW1lKGlzQ2hhbikge1xuICAgIHJldHVybiAoaXNDaGFuID8gQ29uc3QuVE9QSUNfTkVXX0NIQU4gOiBDb25zdC5UT1BJQ19ORVcpICsgdGhpcy5nZXROZXh0VW5pcXVlSWQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnN0YW50aWF0ZSA8Y29kZT4nbWUnPC9jb2RlPiB0b3BpYyBvciBnZXQgaXQgZnJvbSBjYWNoZS5cbiAgICpcbiAgICogQHJldHVybnMge1RvcGljTWV9IEluc3RhbmNlIG9mIDxjb2RlPidtZSc8L2NvZGU+IHRvcGljLlxuICAgKi9cbiAgZ2V0TWVUb3BpYygpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRUb3BpYyhDb25zdC5UT1BJQ19NRSk7XG4gIH1cblxuICAvKipcbiAgICogSW5zdGFudGlhdGUgPGNvZGU+J2ZuZCc8L2NvZGU+IChmaW5kKSB0b3BpYyBvciBnZXQgaXQgZnJvbSBjYWNoZS5cbiAgICpcbiAgICogQHJldHVybnMge1RvcGljfSBJbnN0YW5jZSBvZiA8Y29kZT4nZm5kJzwvY29kZT4gdG9waWMuXG4gICAqL1xuICBnZXRGbmRUb3BpYygpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRUb3BpYyhDb25zdC5UT1BJQ19GTkQpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyB7QGxpbmsgTGFyZ2VGaWxlSGVscGVyfSBpbnN0YW5jZVxuICAgKlxuICAgKiBAcmV0dXJucyB7TGFyZ2VGaWxlSGVscGVyfSBpbnN0YW5jZSBvZiBhIHtAbGluayBUaW5vZGUuTGFyZ2VGaWxlSGVscGVyfS5cbiAgICovXG4gIGdldExhcmdlRmlsZUhlbHBlcigpIHtcbiAgICByZXR1cm4gbmV3IExhcmdlRmlsZUhlbHBlcih0aGlzLCBDb25zdC5QUk9UT0NPTF9WRVJTSU9OKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIFVJRCBvZiB0aGUgdGhlIGN1cnJlbnQgYXV0aGVudGljYXRlZCB1c2VyLlxuICAgKlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBVSUQgb2YgdGhlIGN1cnJlbnQgdXNlciBvciA8Y29kZT51bmRlZmluZWQ8L2NvZGU+IGlmIHRoZSBzZXNzaW9uIGlzIG5vdCB5ZXRcbiAgICogYXV0aGVudGljYXRlZCBvciBpZiB0aGVyZSBpcyBubyBzZXNzaW9uLlxuICAgKi9cbiAgZ2V0Q3VycmVudFVzZXJJRCgpIHtcbiAgICByZXR1cm4gdGhpcy5fbXlVSUQ7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgdGhlIGdpdmVuIHVzZXIgSUQgaXMgZXF1YWwgdG8gdGhlIGN1cnJlbnQgdXNlcidzIFVJRC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVpZCAtIFVJRCB0byBjaGVjay5cbiAgICpcbiAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgdGhlIGdpdmVuIFVJRCBiZWxvbmdzIHRvIHRoZSBjdXJyZW50IGxvZ2dlZCBpbiB1c2VyLlxuICAgKi9cbiAgaXNNZSh1aWQpIHtcbiAgICByZXR1cm4gdGhpcy5fbXlVSUQgPT09IHVpZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgbG9naW4gdXNlZCBmb3IgbGFzdCBzdWNjZXNzZnVsIGF1dGhlbnRpY2F0aW9uLlxuICAgKlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBsb2dpbiBsYXN0IHVzZWQgc3VjY2Vzc2Z1bGx5IG9yIDxjb2RlPnVuZGVmaW5lZDwvY29kZT4uXG4gICAqL1xuICBnZXRDdXJyZW50TG9naW4oKSB7XG4gICAgcmV0dXJuIHRoaXMuX2xvZ2luO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiBpbmZvcm1hdGlvbiBhYm91dCB0aGUgc2VydmVyOiBwcm90b2NvbCB2ZXJzaW9uIGFuZCBidWlsZCB0aW1lc3RhbXAuXG4gICAqXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IGJ1aWxkIGFuZCB2ZXJzaW9uIG9mIHRoZSBzZXJ2ZXIgb3IgPGNvZGU+bnVsbDwvY29kZT4gaWYgdGhlcmUgaXMgbm8gY29ubmVjdGlvbiBvclxuICAgKiBpZiB0aGUgZmlyc3Qgc2VydmVyIHJlc3BvbnNlIGhhcyBub3QgYmVlbiByZWNlaXZlZCB5ZXQuXG4gICAqL1xuICBnZXRTZXJ2ZXJJbmZvKCkge1xuICAgIHJldHVybiB0aGlzLl9zZXJ2ZXJJbmZvO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcG9ydCBhIHRvcGljIGZvciBhYnVzZS4gV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNwdWJsaXNofS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGFjdGlvbiAtIHRoZSBvbmx5IHN1cHBvcnRlZCBhY3Rpb24gaXMgJ3JlcG9ydCcuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0YXJnZXQgLSBuYW1lIG9mIHRoZSB0b3BpYyBiZWluZyByZXBvcnRlZC5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgdG8gYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgc2VydmVyIHJlc3BvbmRzIHRvIHJlcXVlc3QuXG4gICAqL1xuICByZXBvcnQoYWN0aW9uLCB0YXJnZXQpIHtcbiAgICByZXR1cm4gdGhpcy5wdWJsaXNoKENvbnN0LlRPUElDX1NZUywgRHJhZnR5LmF0dGFjaEpTT04obnVsbCwge1xuICAgICAgJ2FjdGlvbic6IGFjdGlvbixcbiAgICAgICd0YXJnZXQnOiB0YXJnZXRcbiAgICB9KSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHNlcnZlci1wcm92aWRlZCBjb25maWd1cmF0aW9uIHZhbHVlLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBvZiB0aGUgdmFsdWUgdG8gcmV0dXJuLlxuICAgKiBAcGFyYW0ge09iamVjdH0gZGVmYXVsdFZhbHVlIHRvIHJldHVybiBpbiBjYXNlIHRoZSBwYXJhbWV0ZXIgaXMgbm90IHNldCBvciBub3QgZm91bmQuXG4gICAqXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IG5hbWVkIHZhbHVlLlxuICAgKi9cbiAgZ2V0U2VydmVyUGFyYW0obmFtZSwgZGVmYXVsdFZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NlcnZlckluZm8gJiYgdGhpcy5fc2VydmVySW5mb1tuYW1lXSB8fCBkZWZhdWx0VmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogVG9nZ2xlIGNvbnNvbGUgbG9nZ2luZy4gTG9nZ2luZyBpcyBvZmYgYnkgZGVmYXVsdC5cbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSBlbmFibGVkIC0gU2V0IHRvIDxjb2RlPnRydWU8L2NvZGU+IHRvIGVuYWJsZSBsb2dnaW5nIHRvIGNvbnNvbGUuXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gdHJpbUxvbmdTdHJpbmdzIC0gU2V0IHRvIDxjb2RlPnRydWU8L2NvZGU+IHRvIHRyaW0gbG9uZyBzdHJpbmdzLlxuICAgKi9cbiAgZW5hYmxlTG9nZ2luZyhlbmFibGVkLCB0cmltTG9uZ1N0cmluZ3MpIHtcbiAgICB0aGlzLl9sb2dnaW5nRW5hYmxlZCA9IGVuYWJsZWQ7XG4gICAgdGhpcy5fdHJpbUxvbmdTdHJpbmdzID0gZW5hYmxlZCAmJiB0cmltTG9uZ1N0cmluZ3M7XG4gIH1cblxuICAvKipcbiAgICogU2V0IFVJIGxhbmd1YWdlIHRvIHJlcG9ydCB0byB0aGUgc2VydmVyLiBNdXN0IGJlIGNhbGxlZCBiZWZvcmUgPGNvZGU+J2hpJzwvY29kZT4gaXMgc2VudCwgb3RoZXJ3aXNlIGl0IHdpbGwgbm90IGJlIHVzZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBobCAtIGh1bWFuIChVSSkgbGFuZ3VhZ2UsIGxpa2UgPGNvZGU+XCJlbl9VU1wiPC9jb2RlPiBvciA8Y29kZT5cInpoLUhhbnNcIjwvY29kZT4uXG4gICAqL1xuICBzZXRIdW1hbkxhbmd1YWdlKGhsKSB7XG4gICAgaWYgKGhsKSB7XG4gICAgICB0aGlzLl9odW1hbkxhbmd1YWdlID0gaGw7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGdpdmVuIHRvcGljIGlzIG9ubGluZS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgb2YgdGhlIHRvcGljIHRvIHRlc3QuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIHRvcGljIGlzIG9ubGluZSwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgKi9cbiAgaXNUb3BpY09ubGluZShuYW1lKSB7XG4gICAgY29uc3QgdG9waWMgPSB0aGlzLiNjYWNoZUdldCgndG9waWMnLCBuYW1lKTtcbiAgICByZXR1cm4gdG9waWMgJiYgdG9waWMub25saW5lO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhY2Nlc3MgbW9kZSBmb3IgdGhlIGdpdmVuIGNvbnRhY3QuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIG9mIHRoZSB0b3BpYyB0byBxdWVyeS5cbiAgICogQHJldHVybnMge0FjY2Vzc01vZGV9IGFjY2VzcyBtb2RlIGlmIHRvcGljIGlzIGZvdW5kLCBudWxsIG90aGVyd2lzZS5cbiAgICovXG4gIGdldFRvcGljQWNjZXNzTW9kZShuYW1lKSB7XG4gICAgY29uc3QgdG9waWMgPSB0aGlzLiNjYWNoZUdldCgndG9waWMnLCBuYW1lKTtcbiAgICByZXR1cm4gdG9waWMgPyB0b3BpYy5hY3MgOiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEluY2x1ZGUgbWVzc2FnZSBJRCBpbnRvIGFsbCBzdWJzZXF1ZXN0IG1lc3NhZ2VzIHRvIHNlcnZlciBpbnN0cnVjdGluIGl0IHRvIHNlbmQgYWtub3dsZWRnZW1lbnMuXG4gICAqIFJlcXVpcmVkIGZvciBwcm9taXNlcyB0byBmdW5jdGlvbi4gRGVmYXVsdCBpcyA8Y29kZT5cIm9uXCI8L2NvZGU+LlxuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHN0YXR1cyAtIFR1cm4gYWtub3dsZWRnZW1lbnMgb24gb3Igb2ZmLlxuICAgKiBAZGVwcmVjYXRlZFxuICAgKi9cbiAgd2FudEFrbihzdGF0dXMpIHtcbiAgICBpZiAoc3RhdHVzKSB7XG4gICAgICB0aGlzLl9tZXNzYWdlSWQgPSBNYXRoLmZsb29yKChNYXRoLnJhbmRvbSgpICogMHhGRkZGRkYpICsgMHhGRkZGRkYpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9tZXNzYWdlSWQgPSAwO1xuICAgIH1cbiAgfVxuXG4gIC8vIENhbGxiYWNrczpcbiAgLyoqXG4gICAqIENhbGxiYWNrIHRvIHJlcG9ydCB3aGVuIHRoZSB3ZWJzb2NrZXQgaXMgb3BlbmVkLiBUaGUgY2FsbGJhY2sgaGFzIG5vIHBhcmFtZXRlcnMuXG4gICAqXG4gICAqIEB0eXBlIHtvbldlYnNvY2tldE9wZW59XG4gICAqL1xuICBvbldlYnNvY2tldE9wZW4gPSB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIEB0eXBlZGVmIFNlcnZlclBhcmFtc1xuICAgKlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAcHJvcGVydHkge3N0cmluZ30gdmVyIC0gU2VydmVyIHZlcnNpb25cbiAgICogQHByb3BlcnR5IHtzdHJpbmd9IGJ1aWxkIC0gU2VydmVyIGJ1aWxkXG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nPX0gc2lkIC0gU2Vzc2lvbiBJRCwgbG9uZyBwb2xsaW5nIGNvbm5lY3Rpb25zIG9ubHkuXG4gICAqL1xuXG4gIC8qKlxuICAgKiBAY2FsbGJhY2sgb25Db25uZWN0XG4gICAqIEBwYXJhbSB7bnVtYmVyfSBjb2RlIC0gUmVzdWx0IGNvZGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRleHQgLSBUZXh0IGVweHBsYWluaW5nIHRoZSBjb21wbGV0aW9uLCBpLmUgXCJPS1wiIG9yIGFuIGVycm9yIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7U2VydmVyUGFyYW1zfSBwYXJhbXMgLSBQYXJhbWV0ZXJzIHJldHVybmVkIGJ5IHRoZSBzZXJ2ZXIuXG4gICAqL1xuICAvKipcbiAgICogQ2FsbGJhY2sgdG8gcmVwb3J0IHdoZW4gY29ubmVjdGlvbiB3aXRoIFRpbm9kZSBzZXJ2ZXIgaXMgZXN0YWJsaXNoZWQuXG4gICAqIEB0eXBlIHtvbkNvbm5lY3R9XG4gICAqL1xuICBvbkNvbm5lY3QgPSB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIHRvIHJlcG9ydCB3aGVuIGNvbm5lY3Rpb24gaXMgbG9zdC4gVGhlIGNhbGxiYWNrIGhhcyBubyBwYXJhbWV0ZXJzLlxuICAgKiBAdHlwZSB7b25EaXNjb25uZWN0fVxuICAgKi9cbiAgb25EaXNjb25uZWN0ID0gdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBAY2FsbGJhY2sgb25Mb2dpblxuICAgKiBAcGFyYW0ge251bWJlcn0gY29kZSAtIE5VbWVyaWMgY29tcGxldGlvbiBjb2RlLCBzYW1lIGFzIEhUVFAgc3RhdHVzIGNvZGVzLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGV4dCAtIEV4cGxhbmF0aW9uIG9mIHRoZSBjb21wbGV0aW9uIGNvZGUuXG4gICAqL1xuICAvKipcbiAgICogQ2FsbGJhY2sgdG8gcmVwb3J0IGxvZ2luIGNvbXBsZXRpb24uXG4gICAqIEB0eXBlIHtvbkxvZ2lufVxuICAgKi9cbiAgb25Mb2dpbiA9IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQ2FsbGJhY2sgdG8gcmVjZWl2ZSA8Y29kZT57Y3RybH08L2NvZGU+IChjb250cm9sKSBtZXNzYWdlcy5cbiAgICogQHR5cGUge29uQ3RybE1lc3NhZ2V9XG4gICAqL1xuICBvbkN0cmxNZXNzYWdlID0gdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBDYWxsYmFjayB0byByZWNpZXZlIDxjb2RlPntkYXRhfTwvY29kZT4gKGNvbnRlbnQpIG1lc3NhZ2VzLlxuICAgKiBAdHlwZSB7b25EYXRhTWVzc2FnZX1cbiAgICovXG4gIG9uRGF0YU1lc3NhZ2UgPSB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIHRvIHJlY2VpdmUgPGNvZGU+e3ByZXN9PC9jb2RlPiAocHJlc2VuY2UpIG1lc3NhZ2VzLlxuICAgKiBAdHlwZSB7b25QcmVzTWVzc2FnZX1cbiAgICovXG4gIG9uUHJlc01lc3NhZ2UgPSB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIHRvIHJlY2VpdmUgYWxsIG1lc3NhZ2VzIGFzIG9iamVjdHMuXG4gICAqIEB0eXBlIHtvbk1lc3NhZ2V9XG4gICAqL1xuICBvbk1lc3NhZ2UgPSB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIHRvIHJlY2VpdmUgYWxsIG1lc3NhZ2VzIGFzIHVucGFyc2VkIHRleHQuXG4gICAqIEB0eXBlIHtvblJhd01lc3NhZ2V9XG4gICAqL1xuICBvblJhd01lc3NhZ2UgPSB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIHRvIHJlY2VpdmUgc2VydmVyIHJlc3BvbnNlcyB0byBuZXR3b3JrIHByb2Jlcy4gU2VlIHtAbGluayBUaW5vZGUjbmV0d29ya1Byb2JlfVxuICAgKiBAdHlwZSB7b25OZXR3b3JrUHJvYmV9XG4gICAqL1xuICBvbk5ldHdvcmtQcm9iZSA9IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQ2FsbGJhY2sgdG8gYmUgbm90aWZpZWQgd2hlbiBleHBvbmVudGlhbCBiYWNrb2ZmIGlzIGl0ZXJhdGluZy5cbiAgICogQHR5cGUge29uQXV0b3JlY29ubmVjdEl0ZXJhdGlvbn1cbiAgICovXG4gIG9uQXV0b3JlY29ubmVjdEl0ZXJhdGlvbiA9IHVuZGVmaW5lZDtcbn07XG5cbi8vIEV4cG9ydGVkIGNvbnN0YW50c1xuVGlub2RlLk1FU1NBR0VfU1RBVFVTX05PTkUgPSBDb25zdC5NRVNTQUdFX1NUQVRVU19OT05FO1xuVGlub2RlLk1FU1NBR0VfU1RBVFVTX1FVRVVFRCA9IENvbnN0Lk1FU1NBR0VfU1RBVFVTX1FVRVVFRDtcblRpbm9kZS5NRVNTQUdFX1NUQVRVU19TRU5ESU5HID0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfU0VORElORztcblRpbm9kZS5NRVNTQUdFX1NUQVRVU19GQUlMRUQgPSBDb25zdC5NRVNTQUdFX1NUQVRVU19GQUlMRUQ7XG5UaW5vZGUuTUVTU0FHRV9TVEFUVVNfU0VOVCA9IENvbnN0Lk1FU1NBR0VfU1RBVFVTX1NFTlQ7XG5UaW5vZGUuTUVTU0FHRV9TVEFUVVNfUkVDRUlWRUQgPSBDb25zdC5NRVNTQUdFX1NUQVRVU19SRUNFSVZFRDtcblRpbm9kZS5NRVNTQUdFX1NUQVRVU19SRUFEID0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfUkVBRDtcblRpbm9kZS5NRVNTQUdFX1NUQVRVU19UT19NRSA9IENvbnN0Lk1FU1NBR0VfU1RBVFVTX1RPX01FO1xuVGlub2RlLk1FU1NBR0VfU1RBVFVTX0RFTF9SQU5HRSA9IENvbnN0Lk1FU1NBR0VfU1RBVFVTX0RFTF9SQU5HRTtcblxuLy8gVW5pY29kZSBbZGVsXSBzeW1ib2wuXG5UaW5vZGUuREVMX0NIQVIgPSBDb25zdC5ERUxfQ0hBUjtcblxuLy8gTmFtZXMgb2Yga2V5cyB0byBzZXJ2ZXItcHJvdmlkZWQgY29uZmlndXJhdGlvbiBsaW1pdHMuXG5UaW5vZGUuTUFYX01FU1NBR0VfU0laRSA9ICdtYXhNZXNzYWdlU2l6ZSc7XG5UaW5vZGUuTUFYX1NVQlNDUklCRVJfQ09VTlQgPSAnbWF4U3Vic2NyaWJlckNvdW50JztcblRpbm9kZS5NQVhfVEFHX0NPVU5UID0gJ21heFRhZ0NvdW50JztcblRpbm9kZS5NQVhfRklMRV9VUExPQURfU0laRSA9ICdtYXhGaWxlVXBsb2FkU2l6ZSc7XG4iLCIvKipcbiAqIEBmaWxlIFRvcGljIG1hbmFnZW1lbnQuXG4gKlxuICogQGNvcHlyaWdodCAyMDE1LTIwMjIgVGlub2RlIExMQy5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgQWNjZXNzTW9kZSBmcm9tICcuL2FjY2Vzcy1tb2RlLmpzJztcbmltcG9ydCBDQnVmZmVyIGZyb20gJy4vY2J1ZmZlci5qcyc7XG5pbXBvcnQgKiBhcyBDb25zdCBmcm9tICcuL2NvbmZpZy5qcyc7XG5pbXBvcnQgRHJhZnR5IGZyb20gJy4vZHJhZnR5LmpzJztcbmltcG9ydCBNZXRhR2V0QnVpbGRlciBmcm9tICcuL21ldGEtYnVpbGRlci5qcyc7XG5pbXBvcnQge1xuICBtZXJnZU9iaixcbiAgbWVyZ2VUb0NhY2hlLFxuICBub3JtYWxpemVBcnJheVxufSBmcm9tICcuL3V0aWxzLmpzJztcblxuZXhwb3J0IGNsYXNzIFRvcGljIHtcbiAgLyoqXG4gICAqIEBjYWxsYmFjayBUaW5vZGUuVG9waWMub25EYXRhXG4gICAqIEBwYXJhbSB7RGF0YX0gZGF0YSAtIERhdGEgcGFja2V0XG4gICAqL1xuICAvKipcbiAgICogVG9waWMgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgYSBsb2dpY2FsIGNvbW11bmljYXRpb24gY2hhbm5lbC5cbiAgICogQGNsYXNzIFRvcGljXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byBjcmVhdGUuXG4gICAqIEBwYXJhbSB7T2JqZWN0PX0gY2FsbGJhY2tzIC0gT2JqZWN0IHdpdGggdmFyaW91cyBldmVudCBjYWxsYmFja3MuXG4gICAqIEBwYXJhbSB7VGlub2RlLlRvcGljLm9uRGF0YX0gY2FsbGJhY2tzLm9uRGF0YSAtIENhbGxiYWNrIHdoaWNoIHJlY2VpdmVzIGEgPGNvZGU+e2RhdGF9PC9jb2RlPiBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge2NhbGxiYWNrfSBjYWxsYmFja3Mub25NZXRhIC0gQ2FsbGJhY2sgd2hpY2ggcmVjZWl2ZXMgYSA8Y29kZT57bWV0YX08L2NvZGU+IG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7Y2FsbGJhY2t9IGNhbGxiYWNrcy5vblByZXMgLSBDYWxsYmFjayB3aGljaCByZWNlaXZlcyBhIDxjb2RlPntwcmVzfTwvY29kZT4gbWVzc2FnZS5cbiAgICogQHBhcmFtIHtjYWxsYmFja30gY2FsbGJhY2tzLm9uSW5mbyAtIENhbGxiYWNrIHdoaWNoIHJlY2VpdmVzIGFuIDxjb2RlPntpbmZvfTwvY29kZT4gbWVzc2FnZS5cbiAgICogQHBhcmFtIHtjYWxsYmFja30gY2FsbGJhY2tzLm9uTWV0YURlc2MgLSBDYWxsYmFjayB3aGljaCByZWNlaXZlcyBjaGFuZ2VzIHRvIHRvcGljIGRlc2N0aW9wdGlvbiB7QGxpbmsgZGVzY30uXG4gICAqIEBwYXJhbSB7Y2FsbGJhY2t9IGNhbGxiYWNrcy5vbk1ldGFTdWIgLSBDYWxsZWQgZm9yIGEgc2luZ2xlIHN1YnNjcmlwdGlvbiByZWNvcmQgY2hhbmdlLlxuICAgKiBAcGFyYW0ge2NhbGxiYWNrfSBjYWxsYmFja3Mub25TdWJzVXBkYXRlZCAtIENhbGxlZCBhZnRlciBhIGJhdGNoIG9mIHN1YnNjcmlwdGlvbiBjaGFuZ2VzIGhhdmUgYmVlbiByZWNpZXZlZCBhbmQgY2FjaGVkLlxuICAgKiBAcGFyYW0ge2NhbGxiYWNrfSBjYWxsYmFja3Mub25EZWxldGVUb3BpYyAtIENhbGxlZCBhZnRlciB0aGUgdG9waWMgaXMgZGVsZXRlZC5cbiAgICogQHBhcmFtIHtjYWxsYmFja30gY2FsbGJhY2xzLm9uQWxsTWVzc2FnZXNSZWNlaXZlZCAtIENhbGxlZCB3aGVuIGFsbCByZXF1ZXN0ZWQgPGNvZGU+e2RhdGF9PC9jb2RlPiBtZXNzYWdlcyBoYXZlIGJlZW4gcmVjaXZlZC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG5hbWUsIGNhbGxiYWNrcykge1xuICAgIC8vIFBhcmVudCBUaW5vZGUgb2JqZWN0LlxuICAgIHRoaXMuX3Rpbm9kZSA9IG51bGw7XG5cbiAgICAvLyBTZXJ2ZXItcHJvdmlkZWQgZGF0YSwgbG9jYWxseSBpbW11dGFibGUuXG4gICAgLy8gdG9waWMgbmFtZVxuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgLy8gVGltZXN0YW1wIHdoZW4gdGhlIHRvcGljIHdhcyBjcmVhdGVkLlxuICAgIHRoaXMuY3JlYXRlZCA9IG51bGw7XG4gICAgLy8gVGltZXN0YW1wIHdoZW4gdGhlIHRvcGljIHdhcyBsYXN0IHVwZGF0ZWQuXG4gICAgdGhpcy51cGRhdGVkID0gbnVsbDtcbiAgICAvLyBUaW1lc3RhbXAgb2YgdGhlIGxhc3QgbWVzc2FnZXNcbiAgICB0aGlzLnRvdWNoZWQgPSBuZXcgRGF0ZSgwKTtcbiAgICAvLyBBY2Nlc3MgbW9kZSwgc2VlIEFjY2Vzc01vZGVcbiAgICB0aGlzLmFjcyA9IG5ldyBBY2Nlc3NNb2RlKG51bGwpO1xuICAgIC8vIFBlci10b3BpYyBwcml2YXRlIGRhdGEgKGFjY2Vzc2libGUgYnkgY3VycmVudCB1c2VyIG9ubHkpLlxuICAgIHRoaXMucHJpdmF0ZSA9IG51bGw7XG4gICAgLy8gUGVyLXRvcGljIHB1YmxpYyBkYXRhIChhY2Nlc3NpYmxlIGJ5IGFsbCB1c2VycykuXG4gICAgdGhpcy5wdWJsaWMgPSBudWxsO1xuICAgIC8vIFBlci10b3BpYyBzeXN0ZW0tcHJvdmlkZWQgZGF0YSAoYWNjZXNzaWJsZSBieSBhbGwgdXNlcnMpLlxuICAgIHRoaXMudHJ1c3RlZCA9IG51bGw7XG5cbiAgICAvLyBMb2NhbGx5IGNhY2hlZCBkYXRhXG4gICAgLy8gU3Vic2NyaWJlZCB1c2VycywgZm9yIHRyYWNraW5nIHJlYWQvcmVjdi9tc2cgbm90aWZpY2F0aW9ucy5cbiAgICB0aGlzLl91c2VycyA9IHt9O1xuXG4gICAgLy8gQ3VycmVudCB2YWx1ZSBvZiBsb2NhbGx5IGlzc3VlZCBzZXFJZCwgdXNlZCBmb3IgcGVuZGluZyBtZXNzYWdlcy5cbiAgICB0aGlzLl9xdWV1ZWRTZXFJZCA9IENvbnN0LkxPQ0FMX1NFUUlEO1xuXG4gICAgLy8gVGhlIG1heGltdW0ga25vd24ge2RhdGEuc2VxfSB2YWx1ZS5cbiAgICB0aGlzLl9tYXhTZXEgPSAwO1xuICAgIC8vIFRoZSBtaW5pbXVtIGtub3duIHtkYXRhLnNlcX0gdmFsdWUuXG4gICAgdGhpcy5fbWluU2VxID0gMDtcbiAgICAvLyBJbmRpY2F0b3IgdGhhdCB0aGUgbGFzdCByZXF1ZXN0IGZvciBlYXJsaWVyIG1lc3NhZ2VzIHJldHVybmVkIDAuXG4gICAgdGhpcy5fbm9FYXJsaWVyTXNncyA9IGZhbHNlO1xuICAgIC8vIFRoZSBtYXhpbXVtIGtub3duIGRlbGV0aW9uIElELlxuICAgIHRoaXMuX21heERlbCA9IDA7XG4gICAgLy8gVGltZXIgb2JqZWN0IHVzZWQgdG8gc2VuZCAncmVjdicgbm90aWZpY2F0aW9ucy5cbiAgICB0aGlzLl9yZWN2Tm90aWZpY2F0aW9uVGltZXIgPSBudWxsO1xuXG4gICAgLy8gVXNlciBkaXNjb3ZlcnkgdGFnc1xuICAgIHRoaXMuX3RhZ3MgPSBbXTtcbiAgICAvLyBDcmVkZW50aWFscyBzdWNoIGFzIGVtYWlsIG9yIHBob25lIG51bWJlci5cbiAgICB0aGlzLl9jcmVkZW50aWFscyA9IFtdO1xuICAgIC8vIE1lc3NhZ2UgdmVyc2lvbnMgY2FjaGUgKGUuZy4gZm9yIGVkaXRlZCBtZXNzYWdlcykuXG4gICAgLy8gS2V5czogb3JpZ2luYWwgbWVzc2FnZSBzZXEgSUQuXG4gICAgLy8gVmFsdWVzOiBDQnVmZmVycyBjb250YWluaW5nIG5ld2VyIHZlcnNpb25zIG9mIHRoZSBvcmlnaW5hbCBtZXNzYWdlXG4gICAgLy8gb3JkZXJlZCBieSBzZXEgaWQuXG4gICAgdGhpcy5fbWVzc2FnZVZlcnNpb25zID0ge307XG4gICAgLy8gTWVzc2FnZSBjYWNoZSwgc29ydGVkIGJ5IG1lc3NhZ2Ugc2VxIHZhbHVlcywgZnJvbSBvbGQgdG8gbmV3LlxuICAgIHRoaXMuX21lc3NhZ2VzID0gbmV3IENCdWZmZXIoKGEsIGIpID0+IHtcbiAgICAgIHJldHVybiBhLnNlcSAtIGIuc2VxO1xuICAgIH0sIHRydWUpO1xuICAgIC8vIEJvb2xlYW4sIHRydWUgaWYgdGhlIHRvcGljIGlzIGN1cnJlbnRseSBsaXZlXG4gICAgdGhpcy5fYXR0YWNoZWQgPSBmYWxzZTtcbiAgICAvLyBUaW1lc3RhcCBvZiB0aGUgbW9zdCByZWNlbnRseSB1cGRhdGVkIHN1YnNjcmlwdGlvbi5cbiAgICB0aGlzLl9sYXN0U3Vic1VwZGF0ZSA9IG5ldyBEYXRlKDApO1xuICAgIC8vIFRvcGljIGNyZWF0ZWQgYnV0IG5vdCB5ZXQgc3luY2VkIHdpdGggdGhlIHNlcnZlci4gVXNlZCBvbmx5IGR1cmluZyBpbml0aWFsaXphdGlvbi5cbiAgICB0aGlzLl9uZXcgPSB0cnVlO1xuICAgIC8vIFRoZSB0b3BpYyBpcyBkZWxldGVkIGF0IHRoZSBzZXJ2ZXIsIHRoaXMgaXMgYSBsb2NhbCBjb3B5LlxuICAgIHRoaXMuX2RlbGV0ZWQgPSBmYWxzZTtcblxuICAgIC8vIFRpbWVyIHVzZWQgdG8gdHJnZ2VyIHtsZWF2ZX0gcmVxdWVzdCBhZnRlciBhIGRlbGF5LlxuICAgIHRoaXMuX2RlbGF5ZWRMZWF2ZVRpbWVyID0gbnVsbDtcblxuICAgIC8vIENhbGxiYWNrc1xuICAgIGlmIChjYWxsYmFja3MpIHtcbiAgICAgIHRoaXMub25EYXRhID0gY2FsbGJhY2tzLm9uRGF0YTtcbiAgICAgIHRoaXMub25NZXRhID0gY2FsbGJhY2tzLm9uTWV0YTtcbiAgICAgIHRoaXMub25QcmVzID0gY2FsbGJhY2tzLm9uUHJlcztcbiAgICAgIHRoaXMub25JbmZvID0gY2FsbGJhY2tzLm9uSW5mbztcbiAgICAgIC8vIEEgc2luZ2xlIGRlc2MgdXBkYXRlO1xuICAgICAgdGhpcy5vbk1ldGFEZXNjID0gY2FsbGJhY2tzLm9uTWV0YURlc2M7XG4gICAgICAvLyBBIHNpbmdsZSBzdWJzY3JpcHRpb24gcmVjb3JkO1xuICAgICAgdGhpcy5vbk1ldGFTdWIgPSBjYWxsYmFja3Mub25NZXRhU3ViO1xuICAgICAgLy8gQWxsIHN1YnNjcmlwdGlvbiByZWNvcmRzIHJlY2VpdmVkO1xuICAgICAgdGhpcy5vblN1YnNVcGRhdGVkID0gY2FsbGJhY2tzLm9uU3Vic1VwZGF0ZWQ7XG4gICAgICB0aGlzLm9uVGFnc1VwZGF0ZWQgPSBjYWxsYmFja3Mub25UYWdzVXBkYXRlZDtcbiAgICAgIHRoaXMub25DcmVkc1VwZGF0ZWQgPSBjYWxsYmFja3Mub25DcmVkc1VwZGF0ZWQ7XG4gICAgICB0aGlzLm9uRGVsZXRlVG9waWMgPSBjYWxsYmFja3Mub25EZWxldGVUb3BpYztcbiAgICAgIHRoaXMub25BbGxNZXNzYWdlc1JlY2VpdmVkID0gY2FsbGJhY2tzLm9uQWxsTWVzc2FnZXNSZWNlaXZlZDtcbiAgICB9XG4gIH1cblxuICAvLyBTdGF0aWMgbWV0aG9kcy5cblxuICAvKipcbiAgICogRGV0ZXJtaW5lIHRvcGljIHR5cGUgZnJvbSB0b3BpYydzIG5hbWU6IGdycCwgcDJwLCBtZSwgZm5kLCBzeXMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byB0ZXN0LlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBPbmUgb2YgPGNvZGU+XCJtZVwiPC9jb2RlPiwgPGNvZGU+XCJmbmRcIjwvY29kZT4sIDxjb2RlPlwic3lzXCI8L2NvZGU+LCA8Y29kZT5cImdycFwiPC9jb2RlPixcbiAgICogICAgPGNvZGU+XCJwMnBcIjwvY29kZT4gb3IgPGNvZGU+dW5kZWZpbmVkPC9jb2RlPi5cbiAgICovXG4gIHN0YXRpYyB0b3BpY1R5cGUobmFtZSkge1xuICAgIGNvbnN0IHR5cGVzID0ge1xuICAgICAgJ21lJzogQ29uc3QuVE9QSUNfTUUsXG4gICAgICAnZm5kJzogQ29uc3QuVE9QSUNfRk5ELFxuICAgICAgJ2dycCc6IENvbnN0LlRPUElDX0dSUCxcbiAgICAgICduZXcnOiBDb25zdC5UT1BJQ19HUlAsXG4gICAgICAnbmNoJzogQ29uc3QuVE9QSUNfR1JQLFxuICAgICAgJ2Nobic6IENvbnN0LlRPUElDX0dSUCxcbiAgICAgICd1c3InOiBDb25zdC5UT1BJQ19QMlAsXG4gICAgICAnc3lzJzogQ29uc3QuVE9QSUNfU1lTXG4gICAgfTtcbiAgICByZXR1cm4gdHlwZXNbKHR5cGVvZiBuYW1lID09ICdzdHJpbmcnKSA/IG5hbWUuc3Vic3RyaW5nKDAsIDMpIDogJ3h4eCddO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSBnaXZlbiB0b3BpYyBuYW1lIGlzIGEgbmFtZSBvZiBhICdtZScgdG9waWMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byB0ZXN0LlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgdGhlIG5hbWUgaXMgYSBuYW1lIG9mIGEgJ21lJyB0b3BpYywgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIHN0YXRpYyBpc01lVG9waWNOYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gVG9waWMudG9waWNUeXBlKG5hbWUpID09IENvbnN0LlRPUElDX01FO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSBnaXZlbiB0b3BpYyBuYW1lIGlzIGEgbmFtZSBvZiBhIGdyb3VwIHRvcGljLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gdGVzdC5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIHRoZSBuYW1lIGlzIGEgbmFtZSBvZiBhIGdyb3VwIHRvcGljLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgc3RhdGljIGlzR3JvdXBUb3BpY05hbWUobmFtZSkge1xuICAgIHJldHVybiBUb3BpYy50b3BpY1R5cGUobmFtZSkgPT0gQ29uc3QuVE9QSUNfR1JQO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSBnaXZlbiB0b3BpYyBuYW1lIGlzIGEgbmFtZSBvZiBhIHAycCB0b3BpYy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIHRlc3QuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0aGUgbmFtZSBpcyBhIG5hbWUgb2YgYSBwMnAgdG9waWMsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBzdGF0aWMgaXNQMlBUb3BpY05hbWUobmFtZSkge1xuICAgIHJldHVybiBUb3BpYy50b3BpY1R5cGUobmFtZSkgPT0gQ29uc3QuVE9QSUNfUDJQO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSBnaXZlbiB0b3BpYyBuYW1lIGlzIGEgbmFtZSBvZiBhIGNvbW11bmljYXRpb24gdG9waWMsIGkuZS4gUDJQIG9yIGdyb3VwLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gdGVzdC5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIHRoZSBuYW1lIGlzIGEgbmFtZSBvZiBhIHAycCBvciBncm91cCB0b3BpYywgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIHN0YXRpYyBpc0NvbW1Ub3BpY05hbWUobmFtZSkge1xuICAgIHJldHVybiBUb3BpYy5pc1AyUFRvcGljTmFtZShuYW1lKSB8fCBUb3BpYy5pc0dyb3VwVG9waWNOYW1lKG5hbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSB0b3BpYyBuYW1lIGlzIGEgbmFtZSBvZiBhIG5ldyB0b3BpYy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIHRvcGljIG5hbWUgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIHtib29sZWFufSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0aGUgbmFtZSBpcyBhIG5hbWUgb2YgYSBuZXcgdG9waWMsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBzdGF0aWMgaXNOZXdHcm91cFRvcGljTmFtZShuYW1lKSB7XG4gICAgcmV0dXJuICh0eXBlb2YgbmFtZSA9PSAnc3RyaW5nJykgJiZcbiAgICAgIChuYW1lLnN1YnN0cmluZygwLCAzKSA9PSBDb25zdC5UT1BJQ19ORVcgfHwgbmFtZS5zdWJzdHJpbmcoMCwgMykgPT0gQ29uc3QuVE9QSUNfTkVXX0NIQU4pO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSB0b3BpYyBuYW1lIGlzIGEgbmFtZSBvZiBhIGNoYW5uZWwuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSB0b3BpYyBuYW1lIHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgdGhlIG5hbWUgaXMgYSBuYW1lIG9mIGEgY2hhbm5lbCwgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIHN0YXRpYyBpc0NoYW5uZWxUb3BpY05hbWUobmFtZSkge1xuICAgIHJldHVybiAodHlwZW9mIG5hbWUgPT0gJ3N0cmluZycpICYmXG4gICAgICAobmFtZS5zdWJzdHJpbmcoMCwgMykgPT0gQ29uc3QuVE9QSUNfQ0hBTiB8fCBuYW1lLnN1YnN0cmluZygwLCAzKSA9PSBDb25zdC5UT1BJQ19ORVdfQ0hBTik7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgdGhlIHRvcGljIGlzIHN1YnNjcmliZWQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlzIHRvcGljIGlzIGF0dGFjaGVkL3N1YnNjcmliZWQsIGZhbHNlIG90aGVyd2lzZS5cbiAgICovXG4gIGlzU3Vic2NyaWJlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fYXR0YWNoZWQ7XG4gIH1cblxuICAvKipcbiAgICogUmVxdWVzdCB0b3BpYyB0byBzdWJzY3JpYmUuIFdyYXBwZXIgZm9yIHtAbGluayBUaW5vZGUjc3Vic2NyaWJlfS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtUaW5vZGUuR2V0UXVlcnk9fSBnZXRQYXJhbXMgLSBnZXQgcXVlcnkgcGFyYW1ldGVycy5cbiAgICogQHBhcmFtIHtUaW5vZGUuU2V0UGFyYW1zPX0gc2V0UGFyYW1zIC0gc2V0IHBhcmFtZXRlcnMuXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHRvIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIHNlcnZlciByZXNwb25kcyB0byB0aGUgcmVxdWVzdC5cbiAgICovXG4gIHN1YnNjcmliZShnZXRQYXJhbXMsIHNldFBhcmFtcykge1xuICAgIC8vIENsZWFyIHJlcXVlc3QgdG8gbGVhdmUgdG9waWMuXG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuX2RlbGF5ZWRMZWF2ZVRpbWVyKTtcbiAgICB0aGlzLl9kZWxheWVkTGVhdmVUaW1lciA9IG51bGw7XG5cbiAgICAvLyBJZiB0aGUgdG9waWMgaXMgYWxyZWFkeSBzdWJzY3JpYmVkLCByZXR1cm4gcmVzb2x2ZWQgcHJvbWlzZVxuICAgIGlmICh0aGlzLl9hdHRhY2hlZCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzKTtcbiAgICB9XG5cbiAgICAvLyBJZiB0aGUgdG9waWMgaXMgZGVsZXRlZCwgcmVqZWN0IHN1YnNjcmlwdGlvbiByZXF1ZXN0cy5cbiAgICBpZiAodGhpcy5fZGVsZXRlZCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIkNvbnZlcnNhdGlvbiBkZWxldGVkXCIpKTtcbiAgICB9XG5cbiAgICAvLyBTZW5kIHN1YnNjcmliZSBtZXNzYWdlLCBoYW5kbGUgYXN5bmMgcmVzcG9uc2UuXG4gICAgLy8gSWYgdG9waWMgbmFtZSBpcyBleHBsaWNpdGx5IHByb3ZpZGVkLCB1c2UgaXQuIElmIG5vIG5hbWUsIHRoZW4gaXQncyBhIG5ldyBncm91cCB0b3BpYyxcbiAgICAvLyB1c2UgXCJuZXdcIi5cbiAgICByZXR1cm4gdGhpcy5fdGlub2RlLnN1YnNjcmliZSh0aGlzLm5hbWUgfHwgQ29uc3QuVE9QSUNfTkVXLCBnZXRQYXJhbXMsIHNldFBhcmFtcykudGhlbihjdHJsID0+IHtcbiAgICAgIGlmIChjdHJsLmNvZGUgPj0gMzAwKSB7XG4gICAgICAgIC8vIERvIG5vdGhpbmcgaWYgc3Vic2NyaXB0aW9uIHN0YXR1cyBoYXMgbm90IGNoYW5nZWQuXG4gICAgICAgIHJldHVybiBjdHJsO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9hdHRhY2hlZCA9IHRydWU7XG4gICAgICB0aGlzLl9kZWxldGVkID0gZmFsc2U7XG4gICAgICB0aGlzLmFjcyA9IChjdHJsLnBhcmFtcyAmJiBjdHJsLnBhcmFtcy5hY3MpID8gY3RybC5wYXJhbXMuYWNzIDogdGhpcy5hY3M7XG5cbiAgICAgIC8vIFNldCB0b3BpYyBuYW1lIGZvciBuZXcgdG9waWNzIGFuZCBhZGQgaXQgdG8gY2FjaGUuXG4gICAgICBpZiAodGhpcy5fbmV3KSB7XG4gICAgICAgIGRlbGV0ZSB0aGlzLl9uZXc7XG5cbiAgICAgICAgaWYgKHRoaXMubmFtZSAhPSBjdHJsLnRvcGljKSB7XG4gICAgICAgICAgLy8gTmFtZSBtYXkgY2hhbmdlIG5ldzEyMzQ1NiAtPiBncnBBYkNkRWYuIFJlbW92ZSBmcm9tIGNhY2hlIHVuZGVyIHRoZSBvbGQgbmFtZS5cbiAgICAgICAgICB0aGlzLl9jYWNoZURlbFNlbGYoKTtcbiAgICAgICAgICB0aGlzLm5hbWUgPSBjdHJsLnRvcGljO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2NhY2hlUHV0U2VsZigpO1xuXG4gICAgICAgIHRoaXMuY3JlYXRlZCA9IGN0cmwudHM7XG4gICAgICAgIHRoaXMudXBkYXRlZCA9IGN0cmwudHM7XG5cbiAgICAgICAgaWYgKHRoaXMubmFtZSAhPSBDb25zdC5UT1BJQ19NRSAmJiB0aGlzLm5hbWUgIT0gQ29uc3QuVE9QSUNfRk5EKSB7XG4gICAgICAgICAgLy8gQWRkIHRoZSBuZXcgdG9waWMgdG8gdGhlIGxpc3Qgb2YgY29udGFjdHMgbWFpbnRhaW5lZCBieSB0aGUgJ21lJyB0b3BpYy5cbiAgICAgICAgICBjb25zdCBtZSA9IHRoaXMuX3Rpbm9kZS5nZXRNZVRvcGljKCk7XG4gICAgICAgICAgaWYgKG1lLm9uTWV0YVN1Yikge1xuICAgICAgICAgICAgbWUub25NZXRhU3ViKHRoaXMpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAobWUub25TdWJzVXBkYXRlZCkge1xuICAgICAgICAgICAgbWUub25TdWJzVXBkYXRlZChbdGhpcy5uYW1lXSwgMSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNldFBhcmFtcyAmJiBzZXRQYXJhbXMuZGVzYykge1xuICAgICAgICAgIHNldFBhcmFtcy5kZXNjLl9ub0ZvcndhcmRpbmcgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuX3Byb2Nlc3NNZXRhRGVzYyhzZXRQYXJhbXMuZGVzYyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBjdHJsO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIGRyYWZ0IG9mIGEgbWVzc2FnZSB3aXRob3V0IHNlbmRpbmcgaXQgdG8gdGhlIHNlcnZlci5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmcgfCBPYmplY3R9IGRhdGEgLSBDb250ZW50IHRvIHdyYXAgaW4gYSBkcmFmdC5cbiAgICogQHBhcmFtIHtib29sZWFuPX0gbm9FY2hvIC0gSWYgPGNvZGU+dHJ1ZTwvY29kZT4gc2VydmVyIHdpbGwgbm90IGVjaG8gbWVzc2FnZSBiYWNrIHRvIG9yaWdpbmF0aW5nXG4gICAqIHNlc3Npb24uIE90aGVyd2lzZSB0aGUgc2VydmVyIHdpbGwgc2VuZCBhIGNvcHkgb2YgdGhlIG1lc3NhZ2UgdG8gc2VuZGVyLlxuICAgKlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSBtZXNzYWdlIGRyYWZ0LlxuICAgKi9cbiAgY3JlYXRlTWVzc2FnZShkYXRhLCBub0VjaG8pIHtcbiAgICByZXR1cm4gdGhpcy5fdGlub2RlLmNyZWF0ZU1lc3NhZ2UodGhpcy5uYW1lLCBkYXRhLCBub0VjaG8pO1xuICB9XG5cbiAgLyoqXG4gICAqIEltbWVkaWF0ZWx5IHB1Ymxpc2ggZGF0YSB0byB0b3BpYy4gV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNwdWJsaXNofS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmcgfCBPYmplY3R9IGRhdGEgLSBNZXNzYWdlIHRvIHB1Ymxpc2gsIGVpdGhlciBwbGFpbiBzdHJpbmcgb3IgYSBEcmFmdHkgb2JqZWN0LlxuICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBub0VjaG8gLSBJZiA8Y29kZT50cnVlPC9jb2RlPiBzZXJ2ZXIgd2lsbCBub3QgZWNobyBtZXNzYWdlIGJhY2sgdG8gb3JpZ2luYXRpbmdcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgdG8gYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgc2VydmVyIHJlc3BvbmRzIHRvIHRoZSByZXF1ZXN0LlxuICAgKi9cbiAgcHVibGlzaChkYXRhLCBub0VjaG8pIHtcbiAgICByZXR1cm4gdGhpcy5wdWJsaXNoTWVzc2FnZSh0aGlzLmNyZWF0ZU1lc3NhZ2UoZGF0YSwgbm9FY2hvKSk7XG4gIH1cblxuICAvKipcbiAgICogUHVibGlzaCBtZXNzYWdlIGNyZWF0ZWQgYnkge0BsaW5rIFRpbm9kZS5Ub3BpYyNjcmVhdGVNZXNzYWdlfS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHB1YiAtIHtkYXRhfSBvYmplY3QgdG8gcHVibGlzaC4gTXVzdCBiZSBjcmVhdGVkIGJ5IHtAbGluayBUaW5vZGUuVG9waWMjY3JlYXRlTWVzc2FnZX1cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgdG8gYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgc2VydmVyIHJlc3BvbmRzIHRvIHRoZSByZXF1ZXN0LlxuICAgKi9cbiAgcHVibGlzaE1lc3NhZ2UocHViKSB7XG4gICAgaWYgKCF0aGlzLl9hdHRhY2hlZCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIkNhbm5vdCBwdWJsaXNoIG9uIGluYWN0aXZlIHRvcGljXCIpKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuX3NlbmRpbmcpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJUaGUgbWVzc2FnZSBpcyBhbHJlYWR5IGJlaW5nIHNlbnRcIikpO1xuICAgIH1cblxuICAgIC8vIFNlbmQgZGF0YS5cbiAgICBwdWIuX3NlbmRpbmcgPSB0cnVlO1xuICAgIHB1Yi5fZmFpbGVkID0gZmFsc2U7XG5cbiAgICAvLyBFeHRyYWN0IHJlZmVyZWNlcyB0byBhdHRhY2htZW50cyBhbmQgb3V0IG9mIGJhbmQgaW1hZ2UgcmVjb3Jkcy5cbiAgICBsZXQgYXR0YWNobWVudHMgPSBudWxsO1xuICAgIGlmIChEcmFmdHkuaGFzRW50aXRpZXMocHViLmNvbnRlbnQpKSB7XG4gICAgICBhdHRhY2htZW50cyA9IFtdO1xuICAgICAgRHJhZnR5LmVudGl0aWVzKHB1Yi5jb250ZW50LCBkYXRhID0+IHtcbiAgICAgICAgaWYgKGRhdGEgJiYgZGF0YS5yZWYpIHtcbiAgICAgICAgICBhdHRhY2htZW50cy5wdXNoKGRhdGEucmVmKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBpZiAoYXR0YWNobWVudHMubGVuZ3RoID09IDApIHtcbiAgICAgICAgYXR0YWNobWVudHMgPSBudWxsO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl90aW5vZGUucHVibGlzaE1lc3NhZ2UocHViLCBhdHRhY2htZW50cykudGhlbihjdHJsID0+IHtcbiAgICAgIHB1Yi5fc2VuZGluZyA9IGZhbHNlO1xuICAgICAgcHViLnRzID0gY3RybC50cztcbiAgICAgIHRoaXMuc3dhcE1lc3NhZ2VJZChwdWIsIGN0cmwucGFyYW1zLnNlcSk7XG4gICAgICB0aGlzLl9tYXliZVVwZGF0ZU1lc3NhZ2VWZXJzaW9uc0NhY2hlKHB1Yik7XG4gICAgICB0aGlzLl9yb3V0ZURhdGEocHViKTtcbiAgICAgIHJldHVybiBjdHJsO1xuICAgIH0pLmNhdGNoKGVyciA9PiB7XG4gICAgICB0aGlzLl90aW5vZGUubG9nZ2VyKFwiV0FSTklORzogTWVzc2FnZSByZWplY3RlZCBieSB0aGUgc2VydmVyXCIsIGVycik7XG4gICAgICBwdWIuX3NlbmRpbmcgPSBmYWxzZTtcbiAgICAgIHB1Yi5fZmFpbGVkID0gdHJ1ZTtcbiAgICAgIGlmICh0aGlzLm9uRGF0YSkge1xuICAgICAgICB0aGlzLm9uRGF0YSgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBtZXNzYWdlIHRvIGxvY2FsIG1lc3NhZ2UgY2FjaGUsIHNlbmQgdG8gdGhlIHNlcnZlciB3aGVuIHRoZSBwcm9taXNlIGlzIHJlc29sdmVkLlxuICAgKiBJZiBwcm9taXNlIGlzIG51bGwgb3IgdW5kZWZpbmVkLCB0aGUgbWVzc2FnZSB3aWxsIGJlIHNlbnQgaW1tZWRpYXRlbHkuXG4gICAqIFRoZSBtZXNzYWdlIGlzIHNlbnQgd2hlbiB0aGVcbiAgICogVGhlIG1lc3NhZ2Ugc2hvdWxkIGJlIGNyZWF0ZWQgYnkge0BsaW5rIFRpbm9kZS5Ub3BpYyNjcmVhdGVNZXNzYWdlfS5cbiAgICogVGhpcyBpcyBwcm9iYWJseSBub3QgdGhlIGZpbmFsIEFQSS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHB1YiAtIE1lc3NhZ2UgdG8gdXNlIGFzIGEgZHJhZnQuXG4gICAqIEBwYXJhbSB7UHJvbWlzZX0gcHJvbSAtIE1lc3NhZ2Ugd2lsbCBiZSBzZW50IHdoZW4gdGhpcyBwcm9taXNlIGlzIHJlc29sdmVkLCBkaXNjYXJkZWQgaWYgcmVqZWN0ZWQuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBkZXJpdmVkIHByb21pc2UuXG4gICAqL1xuICBwdWJsaXNoRHJhZnQocHViLCBwcm9tKSB7XG4gICAgY29uc3Qgc2VxID0gcHViLnNlcSB8fCB0aGlzLl9nZXRRdWV1ZWRTZXFJZCgpO1xuICAgIGlmICghcHViLl9ub0ZvcndhcmRpbmcpIHtcbiAgICAgIC8vIFRoZSAnc2VxJywgJ3RzJywgYW5kICdmcm9tJyBhcmUgYWRkZWQgdG8gbWltaWMge2RhdGF9LiBUaGV5IGFyZSByZW1vdmVkIGxhdGVyXG4gICAgICAvLyBiZWZvcmUgdGhlIG1lc3NhZ2UgaXMgc2VudC5cbiAgICAgIHB1Yi5fbm9Gb3J3YXJkaW5nID0gdHJ1ZTtcbiAgICAgIHB1Yi5zZXEgPSBzZXE7XG4gICAgICBwdWIudHMgPSBuZXcgRGF0ZSgpO1xuICAgICAgcHViLmZyb20gPSB0aGlzLl90aW5vZGUuZ2V0Q3VycmVudFVzZXJJRCgpO1xuXG4gICAgICAvLyBEb24ndCBuZWVkIGFuIGVjaG8gbWVzc2FnZSBiZWNhdXNlIHRoZSBtZXNzYWdlIGlzIGFkZGVkIHRvIGxvY2FsIGNhY2hlIHJpZ2h0IGF3YXkuXG4gICAgICBwdWIubm9lY2hvID0gdHJ1ZTtcbiAgICAgIC8vIEFkZCB0byBjYWNoZS5cbiAgICAgIHRoaXMuX21lc3NhZ2VzLnB1dChwdWIpO1xuICAgICAgdGhpcy5fdGlub2RlLl9kYi5hZGRNZXNzYWdlKHB1Yik7XG5cbiAgICAgIGlmICh0aGlzLm9uRGF0YSkge1xuICAgICAgICB0aGlzLm9uRGF0YShwdWIpO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBJZiBwcm9taXNlIGlzIHByb3ZpZGVkLCBzZW5kIHRoZSBxdWV1ZWQgbWVzc2FnZSB3aGVuIGl0J3MgcmVzb2x2ZWQuXG4gICAgLy8gSWYgbm8gcHJvbWlzZSBpcyBwcm92aWRlZCwgY3JlYXRlIGEgcmVzb2x2ZWQgb25lIGFuZCBzZW5kIGltbWVkaWF0ZWx5LlxuICAgIHJldHVybiAocHJvbSB8fCBQcm9taXNlLnJlc29sdmUoKSlcbiAgICAgIC50aGVuKF8gPT4ge1xuICAgICAgICBpZiAocHViLl9jYW5jZWxsZWQpIHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY29kZTogMzAwLFxuICAgICAgICAgICAgdGV4dDogXCJjYW5jZWxsZWRcIlxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMucHVibGlzaE1lc3NhZ2UocHViKTtcbiAgICAgIH0pLmNhdGNoKGVyciA9PiB7XG4gICAgICAgIHRoaXMuX3Rpbm9kZS5sb2dnZXIoXCJXQVJOSU5HOiBNZXNzYWdlIGRyYWZ0IHJlamVjdGVkXCIsIGVycik7XG4gICAgICAgIHB1Yi5fc2VuZGluZyA9IGZhbHNlO1xuICAgICAgICBwdWIuX2ZhaWxlZCA9IHRydWU7XG4gICAgICAgIGlmICh0aGlzLm9uRGF0YSkge1xuICAgICAgICAgIHRoaXMub25EYXRhKCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gUmV0aHJvdyB0byBsZXQgY2FsbGVyIGtub3cgdGhhdCB0aGUgb3BlcmF0aW9uIGZhaWxlZC5cbiAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogTGVhdmUgdGhlIHRvcGljLCBvcHRpb25hbGx5IHVuc2lic2NyaWJlLiBMZWF2aW5nIHRoZSB0b3BpYyBtZWFucyB0aGUgdG9waWMgd2lsbCBzdG9wXG4gICAqIHJlY2VpdmluZyB1cGRhdGVzIGZyb20gdGhlIHNlcnZlci4gVW5zdWJzY3JpYmluZyB3aWxsIHRlcm1pbmF0ZSB1c2VyJ3MgcmVsYXRpb25zaGlwIHdpdGggdGhlIHRvcGljLlxuICAgKiBXcmFwcGVyIGZvciB7QGxpbmsgVGlub2RlI2xlYXZlfS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFuPX0gdW5zdWIgLSBJZiB0cnVlLCB1bnN1YnNjcmliZSwgb3RoZXJ3aXNlIGp1c3QgbGVhdmUuXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHRvIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIHNlcnZlciByZXNwb25kcyB0byB0aGUgcmVxdWVzdC5cbiAgICovXG4gIGxlYXZlKHVuc3ViKSB7XG4gICAgLy8gSXQncyBwb3NzaWJsZSB0byB1bnN1YnNjcmliZSAodW5zdWI9PXRydWUpIGZyb20gaW5hY3RpdmUgdG9waWMuXG4gICAgaWYgKCF0aGlzLl9hdHRhY2hlZCAmJiAhdW5zdWIpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJDYW5ub3QgbGVhdmUgaW5hY3RpdmUgdG9waWNcIikpO1xuICAgIH1cblxuICAgIC8vIFNlbmQgYSAnbGVhdmUnIG1lc3NhZ2UsIGhhbmRsZSBhc3luYyByZXNwb25zZVxuICAgIHJldHVybiB0aGlzLl90aW5vZGUubGVhdmUodGhpcy5uYW1lLCB1bnN1YikudGhlbihjdHJsID0+IHtcbiAgICAgIHRoaXMuX3Jlc2V0U3ViKCk7XG4gICAgICBpZiAodW5zdWIpIHtcbiAgICAgICAgdGhpcy5fZ29uZSgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGN0cmw7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogTGVhdmUgdGhlIHRvcGljLCBvcHRpb25hbGx5IHVuc2lic2NyaWJlIGFmdGVyIGEgZGVsYXkuIExlYXZpbmcgdGhlIHRvcGljIG1lYW5zIHRoZSB0b3BpYyB3aWxsIHN0b3BcbiAgICogcmVjZWl2aW5nIHVwZGF0ZXMgZnJvbSB0aGUgc2VydmVyLiBVbnN1YnNjcmliaW5nIHdpbGwgdGVybWluYXRlIHVzZXIncyByZWxhdGlvbnNoaXAgd2l0aCB0aGUgdG9waWMuXG4gICAqIFdyYXBwZXIgZm9yIHtAbGluayBUaW5vZGUjbGVhdmV9LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHVuc3ViIC0gSWYgdHJ1ZSwgdW5zdWJzY3JpYmUsIG90aGVyd2lzZSBqdXN0IGxlYXZlLlxuICAgKiBAcGFyYW0ge251bWJlcn0gZGVsYXkgLSB0aW1lIGluIG1pbGxpc2Vjb25kcyB0byBkZWxheSBsZWF2ZSByZXF1ZXN0LlxuICAgKi9cbiAgbGVhdmVEZWxheWVkKHVuc3ViLCBkZWxheSkge1xuICAgIGNsZWFyVGltZW91dCh0aGlzLl9kZWxheWVkTGVhdmVUaW1lcik7XG4gICAgdGhpcy5fZGVsYXllZExlYXZlVGltZXIgPSBzZXRUaW1lb3V0KF8gPT4ge1xuICAgICAgdGhpcy5fZGVsYXllZExlYXZlVGltZXIgPSBudWxsO1xuICAgICAgdGhpcy5sZWF2ZSh1bnN1YilcbiAgICB9LCBkZWxheSk7XG4gIH1cblxuICAvKipcbiAgICogUmVxdWVzdCB0b3BpYyBtZXRhZGF0YSBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7VGlub2RlLkdldFF1ZXJ5fSByZXF1ZXN0IHBhcmFtZXRlcnNcbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgdG8gYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgc2VydmVyIHJlc3BvbmRzIHRvIHJlcXVlc3QuXG4gICAqL1xuICBnZXRNZXRhKHBhcmFtcykge1xuICAgIC8vIFNlbmQge2dldH0gbWVzc2FnZSwgcmV0dXJuIHByb21pc2UuXG4gICAgcmV0dXJuIHRoaXMuX3Rpbm9kZS5nZXRNZXRhKHRoaXMubmFtZSwgcGFyYW1zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXF1ZXN0IG1vcmUgbWVzc2FnZXMgZnJvbSB0aGUgc2VydmVyXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBsaW1pdCBudW1iZXIgb2YgbWVzc2FnZXMgdG8gZ2V0LlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGZvcndhcmQgaWYgdHJ1ZSwgcmVxdWVzdCBuZXdlciBtZXNzYWdlcy5cbiAgICovXG4gIGdldE1lc3NhZ2VzUGFnZShsaW1pdCwgZm9yd2FyZCkge1xuICAgIGxldCBxdWVyeSA9IGZvcndhcmQgP1xuICAgICAgdGhpcy5zdGFydE1ldGFRdWVyeSgpLndpdGhMYXRlckRhdGEobGltaXQpIDpcbiAgICAgIHRoaXMuc3RhcnRNZXRhUXVlcnkoKS53aXRoRWFybGllckRhdGEobGltaXQpO1xuXG4gICAgLy8gRmlyc3QgdHJ5IGZldGNoaW5nIGZyb20gREIsIHRoZW4gZnJvbSB0aGUgc2VydmVyLlxuICAgIHJldHVybiB0aGlzLl9sb2FkTWVzc2FnZXModGhpcy5fdGlub2RlLl9kYiwgcXVlcnkuZXh0cmFjdCgnZGF0YScpKVxuICAgICAgLnRoZW4oKGNvdW50KSA9PiB7XG4gICAgICAgIGlmIChjb3VudCA9PSBsaW1pdCkge1xuICAgICAgICAgIC8vIEdvdCBlbm91Z2ggbWVzc2FnZXMgZnJvbSBsb2NhbCBjYWNoZS5cbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHtcbiAgICAgICAgICAgIHRvcGljOiB0aGlzLm5hbWUsXG4gICAgICAgICAgICBjb2RlOiAyMDAsXG4gICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgY291bnQ6IGNvdW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZWR1Y2UgdGhlIGNvdW50IG9mIHJlcXVlc3RlZCBtZXNzYWdlcy5cbiAgICAgICAgbGltaXQgLT0gY291bnQ7XG4gICAgICAgIC8vIFVwZGF0ZSBxdWVyeSB3aXRoIG5ldyB2YWx1ZXMgbG9hZGVkIGZyb20gREIuXG4gICAgICAgIHF1ZXJ5ID0gZm9yd2FyZCA/IHRoaXMuc3RhcnRNZXRhUXVlcnkoKS53aXRoTGF0ZXJEYXRhKGxpbWl0KSA6XG4gICAgICAgICAgdGhpcy5zdGFydE1ldGFRdWVyeSgpLndpdGhFYXJsaWVyRGF0YShsaW1pdCk7XG4gICAgICAgIGxldCBwcm9taXNlID0gdGhpcy5nZXRNZXRhKHF1ZXJ5LmJ1aWxkKCkpO1xuICAgICAgICBpZiAoIWZvcndhcmQpIHtcbiAgICAgICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKGN0cmwgPT4ge1xuICAgICAgICAgICAgaWYgKGN0cmwgJiYgY3RybC5wYXJhbXMgJiYgIWN0cmwucGFyYW1zLmNvdW50KSB7XG4gICAgICAgICAgICAgIHRoaXMuX25vRWFybGllck1zZ3MgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgfSk7XG4gIH1cbiAgLyoqXG4gICAqIFVwZGF0ZSB0b3BpYyBtZXRhZGF0YS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtUaW5vZGUuU2V0UGFyYW1zfSBwYXJhbXMgcGFyYW1ldGVycyB0byB1cGRhdGUuXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHRvIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIHNlcnZlciByZXNwb25kcyB0byByZXF1ZXN0LlxuICAgKi9cbiAgc2V0TWV0YShwYXJhbXMpIHtcbiAgICBpZiAocGFyYW1zLnRhZ3MpIHtcbiAgICAgIHBhcmFtcy50YWdzID0gbm9ybWFsaXplQXJyYXkocGFyYW1zLnRhZ3MpO1xuICAgIH1cbiAgICAvLyBTZW5kIFNldCBtZXNzYWdlLCBoYW5kbGUgYXN5bmMgcmVzcG9uc2UuXG4gICAgcmV0dXJuIHRoaXMuX3Rpbm9kZS5zZXRNZXRhKHRoaXMubmFtZSwgcGFyYW1zKVxuICAgICAgLnRoZW4oY3RybCA9PiB7XG4gICAgICAgIGlmIChjdHJsICYmIGN0cmwuY29kZSA+PSAzMDApIHtcbiAgICAgICAgICAvLyBOb3QgbW9kaWZpZWRcbiAgICAgICAgICByZXR1cm4gY3RybDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwYXJhbXMuc3ViKSB7XG4gICAgICAgICAgcGFyYW1zLnN1Yi50b3BpYyA9IHRoaXMubmFtZTtcbiAgICAgICAgICBpZiAoY3RybC5wYXJhbXMgJiYgY3RybC5wYXJhbXMuYWNzKSB7XG4gICAgICAgICAgICBwYXJhbXMuc3ViLmFjcyA9IGN0cmwucGFyYW1zLmFjcztcbiAgICAgICAgICAgIHBhcmFtcy5zdWIudXBkYXRlZCA9IGN0cmwudHM7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICghcGFyYW1zLnN1Yi51c2VyKSB7XG4gICAgICAgICAgICAvLyBUaGlzIGlzIGEgc3Vic2NyaXB0aW9uIHVwZGF0ZSBvZiB0aGUgY3VycmVudCB1c2VyLlxuICAgICAgICAgICAgLy8gQXNzaWduIHVzZXIgSUQgb3RoZXJ3aXNlIHRoZSB1cGRhdGUgd2lsbCBiZSBpZ25vcmVkIGJ5IF9wcm9jZXNzTWV0YVN1Yi5cbiAgICAgICAgICAgIHBhcmFtcy5zdWIudXNlciA9IHRoaXMuX3Rpbm9kZS5nZXRDdXJyZW50VXNlcklEKCk7XG4gICAgICAgICAgICBpZiAoIXBhcmFtcy5kZXNjKSB7XG4gICAgICAgICAgICAgIC8vIEZvcmNlIHVwZGF0ZSB0byB0b3BpYydzIGFzYy5cbiAgICAgICAgICAgICAgcGFyYW1zLmRlc2MgPSB7fTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcGFyYW1zLnN1Yi5fbm9Gb3J3YXJkaW5nID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLl9wcm9jZXNzTWV0YVN1YihbcGFyYW1zLnN1Yl0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHBhcmFtcy5kZXNjKSB7XG4gICAgICAgICAgaWYgKGN0cmwucGFyYW1zICYmIGN0cmwucGFyYW1zLmFjcykge1xuICAgICAgICAgICAgcGFyYW1zLmRlc2MuYWNzID0gY3RybC5wYXJhbXMuYWNzO1xuICAgICAgICAgICAgcGFyYW1zLmRlc2MudXBkYXRlZCA9IGN0cmwudHM7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuX3Byb2Nlc3NNZXRhRGVzYyhwYXJhbXMuZGVzYyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocGFyYW1zLnRhZ3MpIHtcbiAgICAgICAgICB0aGlzLl9wcm9jZXNzTWV0YVRhZ3MocGFyYW1zLnRhZ3MpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwYXJhbXMuY3JlZCkge1xuICAgICAgICAgIHRoaXMuX3Byb2Nlc3NNZXRhQ3JlZHMoW3BhcmFtcy5jcmVkXSwgdHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY3RybDtcbiAgICAgIH0pO1xuICB9XG4gIC8qKlxuICAgKiBVcGRhdGUgYWNjZXNzIG1vZGUgb2YgdGhlIGN1cnJlbnQgdXNlciBvciBvZiBhbm90aGVyIHRvcGljIHN1YnNyaWJlci5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVpZCAtIFVJRCBvZiB0aGUgdXNlciB0byB1cGRhdGUgb3IgbnVsbCB0byB1cGRhdGUgY3VycmVudCB1c2VyLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdXBkYXRlIC0gdGhlIHVwZGF0ZSB2YWx1ZSwgZnVsbCBvciBkZWx0YS5cbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgdG8gYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgc2VydmVyIHJlc3BvbmRzIHRvIHJlcXVlc3QuXG4gICAqL1xuICB1cGRhdGVNb2RlKHVpZCwgdXBkYXRlKSB7XG4gICAgY29uc3QgdXNlciA9IHVpZCA/IHRoaXMuc3Vic2NyaWJlcih1aWQpIDogbnVsbDtcbiAgICBjb25zdCBhbSA9IHVzZXIgP1xuICAgICAgdXNlci5hY3MudXBkYXRlR2l2ZW4odXBkYXRlKS5nZXRHaXZlbigpIDpcbiAgICAgIHRoaXMuZ2V0QWNjZXNzTW9kZSgpLnVwZGF0ZVdhbnQodXBkYXRlKS5nZXRXYW50KCk7XG5cbiAgICByZXR1cm4gdGhpcy5zZXRNZXRhKHtcbiAgICAgIHN1Yjoge1xuICAgICAgICB1c2VyOiB1aWQsXG4gICAgICAgIG1vZGU6IGFtXG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgLyoqXG4gICAqIENyZWF0ZSBuZXcgdG9waWMgc3Vic2NyaXB0aW9uLiBXcmFwcGVyIGZvciB7QGxpbmsgVGlub2RlI3NldE1ldGF9LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdWlkIC0gSUQgb2YgdGhlIHVzZXIgdG8gaW52aXRlXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gbW9kZSAtIEFjY2VzcyBtb2RlLiA8Y29kZT5udWxsPC9jb2RlPiBtZWFucyB0byB1c2UgZGVmYXVsdC5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgdG8gYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgc2VydmVyIHJlc3BvbmRzIHRvIHJlcXVlc3QuXG4gICAqL1xuICBpbnZpdGUodWlkLCBtb2RlKSB7XG4gICAgcmV0dXJuIHRoaXMuc2V0TWV0YSh7XG4gICAgICBzdWI6IHtcbiAgICAgICAgdXNlcjogdWlkLFxuICAgICAgICBtb2RlOiBtb2RlXG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgLyoqXG4gICAqIEFyY2hpdmUgb3IgdW4tYXJjaGl2ZSB0aGUgdG9waWMuIFdyYXBwZXIgZm9yIHtAbGluayBUaW5vZGUjc2V0TWV0YX0uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gYXJjaCAtIHRydWUgdG8gYXJjaGl2ZSB0aGUgdG9waWMsIGZhbHNlIG90aGVyd2lzZS5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgdG8gYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgc2VydmVyIHJlc3BvbmRzIHRvIHJlcXVlc3QuXG4gICAqL1xuICBhcmNoaXZlKGFyY2gpIHtcbiAgICBpZiAodGhpcy5wcml2YXRlICYmICghdGhpcy5wcml2YXRlLmFyY2ggPT0gIWFyY2gpKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGFyY2gpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zZXRNZXRhKHtcbiAgICAgIGRlc2M6IHtcbiAgICAgICAgcHJpdmF0ZToge1xuICAgICAgICAgIGFyY2g6IGFyY2ggPyB0cnVlIDogQ29uc3QuREVMX0NIQVJcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIC8qKlxuICAgKiBEZWxldGUgbWVzc2FnZXMuIEhhcmQtZGVsZXRpbmcgbWVzc2FnZXMgcmVxdWlyZXMgT3duZXIgcGVybWlzc2lvbi5cbiAgICogV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNkZWxNZXNzYWdlc30uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7VGlub2RlLkRlbFJhbmdlW119IHJhbmdlcyAtIFJhbmdlcyBvZiBtZXNzYWdlIElEcyB0byBkZWxldGUuXG4gICAqIEBwYXJhbSB7Ym9vbGVhbj19IGhhcmQgLSBIYXJkIG9yIHNvZnQgZGVsZXRlXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHRvIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIHNlcnZlciByZXNwb25kcyB0byByZXF1ZXN0LlxuICAgKi9cbiAgZGVsTWVzc2FnZXMocmFuZ2VzLCBoYXJkKSB7XG4gICAgaWYgKCF0aGlzLl9hdHRhY2hlZCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIkNhbm5vdCBkZWxldGUgbWVzc2FnZXMgaW4gaW5hY3RpdmUgdG9waWNcIikpO1xuICAgIH1cblxuICAgIC8vIFNvcnQgcmFuZ2VzIGluIGFjY2VuZGluZyBvcmRlciBieSBsb3csIHRoZSBkZXNjZW5kaW5nIGJ5IGhpLlxuICAgIHJhbmdlcy5zb3J0KChyMSwgcjIpID0+IHtcbiAgICAgIGlmIChyMS5sb3cgPCByMi5sb3cpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBpZiAocjEubG93ID09IHIyLmxvdykge1xuICAgICAgICByZXR1cm4gIXIyLmhpIHx8IChyMS5oaSA+PSByMi5oaSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSk7XG5cbiAgICAvLyBSZW1vdmUgcGVuZGluZyBtZXNzYWdlcyBmcm9tIHJhbmdlcyBwb3NzaWJseSBjbGlwcGluZyBzb21lIHJhbmdlcy5cbiAgICBsZXQgdG9zZW5kID0gcmFuZ2VzLnJlZHVjZSgob3V0LCByKSA9PiB7XG4gICAgICBpZiAoci5sb3cgPCBDb25zdC5MT0NBTF9TRVFJRCkge1xuICAgICAgICBpZiAoIXIuaGkgfHwgci5oaSA8IENvbnN0LkxPQ0FMX1NFUUlEKSB7XG4gICAgICAgICAgb3V0LnB1c2gocik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gQ2xpcCBoaSB0byBtYXggYWxsb3dlZCB2YWx1ZS5cbiAgICAgICAgICBvdXQucHVzaCh7XG4gICAgICAgICAgICBsb3c6IHIubG93LFxuICAgICAgICAgICAgaGk6IHRoaXMuX21heFNlcSArIDFcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG91dDtcbiAgICB9LCBbXSk7XG5cbiAgICAvLyBTZW5kIHtkZWx9IG1lc3NhZ2UsIHJldHVybiBwcm9taXNlXG4gICAgbGV0IHJlc3VsdDtcbiAgICBpZiAodG9zZW5kLmxlbmd0aCA+IDApIHtcbiAgICAgIHJlc3VsdCA9IHRoaXMuX3Rpbm9kZS5kZWxNZXNzYWdlcyh0aGlzLm5hbWUsIHRvc2VuZCwgaGFyZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdCA9IFByb21pc2UucmVzb2x2ZSh7XG4gICAgICAgIHBhcmFtczoge1xuICAgICAgICAgIGRlbDogMFxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgLy8gVXBkYXRlIGxvY2FsIGNhY2hlLlxuICAgIHJldHVybiByZXN1bHQudGhlbihjdHJsID0+IHtcbiAgICAgIGlmIChjdHJsLnBhcmFtcy5kZWwgPiB0aGlzLl9tYXhEZWwpIHtcbiAgICAgICAgdGhpcy5fbWF4RGVsID0gY3RybC5wYXJhbXMuZGVsO1xuICAgICAgfVxuXG4gICAgICByYW5nZXMuZm9yRWFjaCgocikgPT4ge1xuICAgICAgICBpZiAoci5oaSkge1xuICAgICAgICAgIHRoaXMuZmx1c2hNZXNzYWdlUmFuZ2Uoci5sb3csIHIuaGkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuZmx1c2hNZXNzYWdlKHIubG93KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuX3VwZGF0ZURlbGV0ZWRSYW5nZXMoKTtcblxuICAgICAgaWYgKHRoaXMub25EYXRhKSB7XG4gICAgICAgIC8vIENhbGxpbmcgd2l0aCBubyBwYXJhbWV0ZXJzIHRvIGluZGljYXRlIHRoZSBtZXNzYWdlcyB3ZXJlIGRlbGV0ZWQuXG4gICAgICAgIHRoaXMub25EYXRhKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY3RybDtcbiAgICB9KTtcbiAgfVxuICAvKipcbiAgICogRGVsZXRlIGFsbCBtZXNzYWdlcy4gSGFyZC1kZWxldGluZyBtZXNzYWdlcyByZXF1aXJlcyBEZWxldGVyIHBlcm1pc3Npb24uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gaGFyZERlbCAtIHRydWUgaWYgbWVzc2FnZXMgc2hvdWxkIGJlIGhhcmQtZGVsZXRlZC5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgdG8gYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgc2VydmVyIHJlc3BvbmRzIHRvIHJlcXVlc3QuXG4gICAqL1xuICBkZWxNZXNzYWdlc0FsbChoYXJkRGVsKSB7XG4gICAgaWYgKCF0aGlzLl9tYXhTZXEgfHwgdGhpcy5fbWF4U2VxIDw9IDApIHtcbiAgICAgIC8vIFRoZXJlIGFyZSBubyBtZXNzYWdlcyB0byBkZWxldGUuXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmRlbE1lc3NhZ2VzKFt7XG4gICAgICBsb3c6IDEsXG4gICAgICBoaTogdGhpcy5fbWF4U2VxICsgMSxcbiAgICAgIF9hbGw6IHRydWVcbiAgICB9XSwgaGFyZERlbCk7XG4gIH1cblxuICAvKipcbiAgICogRGVsZXRlIG11bHRpcGxlIG1lc3NhZ2VzIGRlZmluZWQgYnkgdGhlaXIgSURzLiBIYXJkLWRlbGV0aW5nIG1lc3NhZ2VzIHJlcXVpcmVzIERlbGV0ZXIgcGVybWlzc2lvbi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtBcnJheS48bnVtYmVyPn0gbGlzdCAtIGxpc3Qgb2Ygc2VxIElEcyB0byBkZWxldGUuXG4gICAqIEBwYXJhbSB7Ym9vbGVhbj19IGhhcmREZWwgLSB0cnVlIGlmIG1lc3NhZ2VzIHNob3VsZCBiZSBoYXJkLWRlbGV0ZWQuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHRvIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIHNlcnZlciByZXNwb25kcyB0byByZXF1ZXN0LlxuICAgKi9cbiAgZGVsTWVzc2FnZXNMaXN0KGxpc3QsIGhhcmREZWwpIHtcbiAgICAvLyBTb3J0IHRoZSBsaXN0IGluIGFzY2VuZGluZyBvcmRlclxuICAgIGxpc3Quc29ydCgoYSwgYikgPT4gYSAtIGIpO1xuICAgIC8vIENvbnZlcnQgdGhlIGFycmF5IG9mIElEcyB0byByYW5nZXMuXG4gICAgbGV0IHJhbmdlcyA9IGxpc3QucmVkdWNlKChvdXQsIGlkKSA9PiB7XG4gICAgICBpZiAob3V0Lmxlbmd0aCA9PSAwKSB7XG4gICAgICAgIC8vIEZpcnN0IGVsZW1lbnQuXG4gICAgICAgIG91dC5wdXNoKHtcbiAgICAgICAgICBsb3c6IGlkXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IHByZXYgPSBvdXRbb3V0Lmxlbmd0aCAtIDFdO1xuICAgICAgICBpZiAoKCFwcmV2LmhpICYmIChpZCAhPSBwcmV2LmxvdyArIDEpKSB8fCAoaWQgPiBwcmV2LmhpKSkge1xuICAgICAgICAgIC8vIE5ldyByYW5nZS5cbiAgICAgICAgICBvdXQucHVzaCh7XG4gICAgICAgICAgICBsb3c6IGlkXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gRXhwYW5kIGV4aXN0aW5nIHJhbmdlLlxuICAgICAgICAgIHByZXYuaGkgPSBwcmV2LmhpID8gTWF0aC5tYXgocHJldi5oaSwgaWQgKyAxKSA6IGlkICsgMTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG91dDtcbiAgICB9LCBbXSk7XG4gICAgLy8gU2VuZCB7ZGVsfSBtZXNzYWdlLCByZXR1cm4gcHJvbWlzZVxuICAgIHJldHVybiB0aGlzLmRlbE1lc3NhZ2VzKHJhbmdlcywgaGFyZERlbCk7XG4gIH1cblxuICAvKipcbiAgICogRGVsZXRlIG9yaWdpbmFsIG1lc3NhZ2UgYW5kIGVkaXRlZCB2YXJpYW50cy4gSGFyZC1kZWxldGluZyBtZXNzYWdlcyByZXF1aXJlcyBEZWxldGVyIHBlcm1pc3Npb24uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzZXEgLSBvcmlnaW5hbCBzZXEgSUQgb2YgdGhlIG1lc3NhZ2UgdG8gZGVsZXRlLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBoYXJkRGVsIC0gdHJ1ZSBpZiBtZXNzYWdlcyBzaG91bGQgYmUgaGFyZC1kZWxldGVkLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBzZXJ2ZXIgcmVzcG9uZHMgdG8gdGhlIHJlcXVlc3QuXG4gICAqL1xuICBkZWxNZXNzYWdlc0VkaXRzKHNlcSwgaGFyZERlbCkge1xuICAgIGNvbnN0IGxpc3QgPSBbc2VxXTtcbiAgICB0aGlzLm1lc3NhZ2VWZXJzaW9ucyhzZXEsIG1zZyA9PiBsaXN0LnB1c2gobXNnLnNlcSkpO1xuICAgIC8vIFNlbmQge2RlbH0gbWVzc2FnZSwgcmV0dXJuIHByb21pc2VcbiAgICByZXR1cm4gdGhpcy5kZWxNZXNzYWdlc0xpc3QobGlzdCwgaGFyZERlbCk7XG4gIH1cblxuICAvKipcbiAgICogRGVsZXRlIHRvcGljLiBSZXF1aXJlcyBPd25lciBwZXJtaXNzaW9uLiBXcmFwcGVyIGZvciB7QGxpbmsgVGlub2RlI2RlbFRvcGljfS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSBoYXJkIC0gaGFkLWRlbGV0ZSB0b3BpYy5cbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgdG8gYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgc2VydmVyIHJlc3BvbmRzIHRvIHRoZSByZXF1ZXN0LlxuICAgKi9cbiAgZGVsVG9waWMoaGFyZCkge1xuICAgIGlmICh0aGlzLl9kZWxldGVkKSB7XG4gICAgICAvLyBUaGUgdG9waWMgaXMgYWxyZWFkeSBkZWxldGVkIGF0IHRoZSBzZXJ2ZXIsIGp1c3QgcmVtb3ZlIGZyb20gREIuXG4gICAgICB0aGlzLl9nb25lKCk7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG51bGwpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl90aW5vZGUuZGVsVG9waWModGhpcy5uYW1lLCBoYXJkKS50aGVuKGN0cmwgPT4ge1xuICAgICAgdGhpcy5fZGVsZXRlZCA9IHRydWU7XG4gICAgICB0aGlzLl9yZXNldFN1YigpO1xuICAgICAgdGhpcy5fZ29uZSgpO1xuICAgICAgcmV0dXJuIGN0cmw7XG4gICAgfSk7XG4gIH1cbiAgLyoqXG4gICAqIERlbGV0ZSBzdWJzY3JpcHRpb24uIFJlcXVpcmVzIFNoYXJlIHBlcm1pc3Npb24uIFdyYXBwZXIgZm9yIHtAbGluayBUaW5vZGUjZGVsU3Vic2NyaXB0aW9ufS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVzZXIgLSBJRCBvZiB0aGUgdXNlciB0byByZW1vdmUgc3Vic2NyaXB0aW9uIGZvci5cbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgdG8gYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgc2VydmVyIHJlc3BvbmRzIHRvIHJlcXVlc3QuXG4gICAqL1xuICBkZWxTdWJzY3JpcHRpb24odXNlcikge1xuICAgIGlmICghdGhpcy5fYXR0YWNoZWQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJDYW5ub3QgZGVsZXRlIHN1YnNjcmlwdGlvbiBpbiBpbmFjdGl2ZSB0b3BpY1wiKSk7XG4gICAgfVxuICAgIC8vIFNlbmQge2RlbH0gbWVzc2FnZSwgcmV0dXJuIHByb21pc2VcbiAgICByZXR1cm4gdGhpcy5fdGlub2RlLmRlbFN1YnNjcmlwdGlvbih0aGlzLm5hbWUsIHVzZXIpLnRoZW4oY3RybCA9PiB7XG4gICAgICAvLyBSZW1vdmUgdGhlIG9iamVjdCBmcm9tIHRoZSBzdWJzY3JpcHRpb24gY2FjaGU7XG4gICAgICBkZWxldGUgdGhpcy5fdXNlcnNbdXNlcl07XG4gICAgICAvLyBOb3RpZnkgbGlzdGVuZXJzXG4gICAgICBpZiAodGhpcy5vblN1YnNVcGRhdGVkKSB7XG4gICAgICAgIHRoaXMub25TdWJzVXBkYXRlZChPYmplY3Qua2V5cyh0aGlzLl91c2VycykpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGN0cmw7XG4gICAgfSk7XG4gIH1cbiAgLyoqXG4gICAqIFNlbmQgYSByZWFkL3JlY3Ygbm90aWZpY2F0aW9uLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gd2hhdCAtIHdoYXQgbm90aWZpY2F0aW9uIHRvIHNlbmQ6IDxjb2RlPnJlY3Y8L2NvZGU+LCA8Y29kZT5yZWFkPC9jb2RlPi5cbiAgICogQHBhcmFtIHtudW1iZXJ9IHNlcSAtIElEIG9yIHRoZSBtZXNzYWdlIHJlYWQgb3IgcmVjZWl2ZWQuXG4gICAqL1xuICBub3RlKHdoYXQsIHNlcSkge1xuICAgIGlmICghdGhpcy5fYXR0YWNoZWQpIHtcbiAgICAgIC8vIENhbm5vdCBzZW5kaW5nIHtub3RlfSBvbiBhbiBpbmFjdGl2ZSB0b3BpY1wiLlxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFVwZGF0ZSBsb2NhbCBjYWNoZSB3aXRoIHRoZSBuZXcgY291bnQuXG4gICAgY29uc3QgdXNlciA9IHRoaXMuX3VzZXJzW3RoaXMuX3Rpbm9kZS5nZXRDdXJyZW50VXNlcklEKCldO1xuICAgIGxldCB1cGRhdGUgPSBmYWxzZTtcbiAgICBpZiAodXNlcikge1xuICAgICAgLy8gU2VsZi1zdWJzY3JpcHRpb24gaXMgZm91bmQuXG4gICAgICBpZiAoIXVzZXJbd2hhdF0gfHwgdXNlclt3aGF0XSA8IHNlcSkge1xuICAgICAgICB1c2VyW3doYXRdID0gc2VxO1xuICAgICAgICB1cGRhdGUgPSB0cnVlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBTZWxmLXN1YnNjcmlwdGlvbiBpcyBub3QgZm91bmQuXG4gICAgICB1cGRhdGUgPSAodGhpc1t3aGF0XSB8IDApIDwgc2VxO1xuICAgIH1cblxuICAgIGlmICh1cGRhdGUpIHtcbiAgICAgIC8vIFNlbmQgbm90aWZpY2F0aW9uIHRvIHRoZSBzZXJ2ZXIuXG4gICAgICB0aGlzLl90aW5vZGUubm90ZSh0aGlzLm5hbWUsIHdoYXQsIHNlcSk7XG4gICAgICAvLyBVcGRhdGUgbG9jYWxseSBjYWNoZWQgY29udGFjdCB3aXRoIHRoZSBuZXcgY291bnQuXG4gICAgICB0aGlzLl91cGRhdGVSZWFkUmVjdih3aGF0LCBzZXEpO1xuXG4gICAgICBpZiAodGhpcy5hY3MgIT0gbnVsbCAmJiAhdGhpcy5hY3MuaXNNdXRlZCgpKSB7XG4gICAgICAgIGNvbnN0IG1lID0gdGhpcy5fdGlub2RlLmdldE1lVG9waWMoKTtcbiAgICAgICAgLy8gU2VudCBhIG5vdGlmaWNhdGlvbiB0byAnbWUnIGxpc3RlbmVycy5cbiAgICAgICAgbWUuX3JlZnJlc2hDb250YWN0KHdoYXQsIHRoaXMpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kIGEgJ3JlY3YnIHJlY2VpcHQuIFdyYXBwZXIgZm9yIHtAbGluayBUaW5vZGUjbm90ZVJlY3Z9LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gc2VxIC0gSUQgb2YgdGhlIG1lc3NhZ2UgdG8gYWtub3dsZWRnZS5cbiAgICovXG4gIG5vdGVSZWN2KHNlcSkge1xuICAgIHRoaXMubm90ZSgncmVjdicsIHNlcSk7XG4gIH1cbiAgLyoqXG4gICAqIFNlbmQgYSAncmVhZCcgcmVjZWlwdC4gV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNub3RlUmVhZH0uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzZXEgLSBJRCBvZiB0aGUgbWVzc2FnZSB0byBha25vd2xlZGdlIG9yIDAvdW5kZWZpbmVkIHRvIGFja25vd2xlZGdlIHRoZSBsYXRlc3QgbWVzc2FnZXMuXG4gICAqL1xuICBub3RlUmVhZChzZXEpIHtcbiAgICBzZXEgPSBzZXEgfHwgdGhpcy5fbWF4U2VxO1xuICAgIGlmIChzZXEgPiAwKSB7XG4gICAgICB0aGlzLm5vdGUoJ3JlYWQnLCBzZXEpO1xuICAgIH1cbiAgfVxuICAvKipcbiAgICogU2VuZCBhIGtleS1wcmVzcyBub3RpZmljYXRpb24uIFdyYXBwZXIgZm9yIHtAbGluayBUaW5vZGUjbm90ZUtleVByZXNzfS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICovXG4gIG5vdGVLZXlQcmVzcygpIHtcbiAgICBpZiAodGhpcy5fYXR0YWNoZWQpIHtcbiAgICAgIHRoaXMuX3Rpbm9kZS5ub3RlS2V5UHJlc3ModGhpcy5uYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fdGlub2RlLmxvZ2dlcihcIklORk86IENhbm5vdCBzZW5kIG5vdGlmaWNhdGlvbiBpbiBpbmFjdGl2ZSB0b3BpY1wiKTtcbiAgICB9XG4gIH1cbiAgLyoqXG4gICAqIFNlbmQgYSB7bm90ZSB3aGF0PSdjYWxsJ30uIFdyYXBwZXIgZm9yIHtAbGluayBUaW5vZGUjdmlkZW9DYWxsfS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGV2dCAtIENhbGwgZXZlbnQuXG4gICAqIEBwYXJhbSB7aW50fSBzZXEgLSBJRCBvZiB0aGUgY2FsbCBtZXNzYWdlIHRoZSBldmVudCBwZXJ0YWlucyB0by5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHBheWxvYWQgLSBQYXlsb2FkIGFzc29jaWF0ZWQgd2l0aCB0aGlzIGV2ZW50IChlLmcuIFNEUCBzdHJpbmcpLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSAoZm9yIHNvbWUgY2FsbCBldmVudHMpIHdoaWNoIHdpbGxcbiAgICogICAgICAgICAgICAgICAgICAgIGJlIHJlc29sdmVkL3JlamVjdGVkIG9uIHJlY2VpdmluZyBzZXJ2ZXIgcmVwbHlcbiAgICovXG4gIHZpZGVvQ2FsbChldnQsIHNlcSwgcGF5bG9hZCkge1xuICAgIGlmICghdGhpcy5fYXR0YWNoZWQgJiYgIVsncmluZ2luZycsICdoYW5nLXVwJ10uaW5jbHVkZXMoZXZ0KSkge1xuICAgICAgLy8gQ2Fubm90IHtjYWxsfSBvbiBhbiBpbmFjdGl2ZSB0b3BpY1wiLlxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fdGlub2RlLnZpZGVvQ2FsbCh0aGlzLm5hbWUsIHNlcSwgZXZ0LCBwYXlsb2FkKTtcbiAgfVxuXG4gIC8vIFVwZGF0ZSBjYWNoZWQgcmVhZC9yZWN2L3VucmVhZCBjb3VudHMuXG4gIF91cGRhdGVSZWFkUmVjdih3aGF0LCBzZXEsIHRzKSB7XG4gICAgbGV0IG9sZFZhbCwgZG9VcGRhdGUgPSBmYWxzZTtcblxuICAgIHNlcSA9IHNlcSB8IDA7XG4gICAgdGhpcy5zZXEgPSB0aGlzLnNlcSB8IDA7XG4gICAgdGhpcy5yZWFkID0gdGhpcy5yZWFkIHwgMDtcbiAgICB0aGlzLnJlY3YgPSB0aGlzLnJlY3YgfCAwO1xuICAgIHN3aXRjaCAod2hhdCkge1xuICAgICAgY2FzZSAncmVjdic6XG4gICAgICAgIG9sZFZhbCA9IHRoaXMucmVjdjtcbiAgICAgICAgdGhpcy5yZWN2ID0gTWF0aC5tYXgodGhpcy5yZWN2LCBzZXEpO1xuICAgICAgICBkb1VwZGF0ZSA9IChvbGRWYWwgIT0gdGhpcy5yZWN2KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdyZWFkJzpcbiAgICAgICAgb2xkVmFsID0gdGhpcy5yZWFkO1xuICAgICAgICB0aGlzLnJlYWQgPSBNYXRoLm1heCh0aGlzLnJlYWQsIHNlcSk7XG4gICAgICAgIGRvVXBkYXRlID0gKG9sZFZhbCAhPSB0aGlzLnJlYWQpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21zZyc6XG4gICAgICAgIG9sZFZhbCA9IHRoaXMuc2VxO1xuICAgICAgICB0aGlzLnNlcSA9IE1hdGgubWF4KHRoaXMuc2VxLCBzZXEpO1xuICAgICAgICBpZiAoIXRoaXMudG91Y2hlZCB8fCB0aGlzLnRvdWNoZWQgPCB0cykge1xuICAgICAgICAgIHRoaXMudG91Y2hlZCA9IHRzO1xuICAgICAgICB9XG4gICAgICAgIGRvVXBkYXRlID0gKG9sZFZhbCAhPSB0aGlzLnNlcSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIC8vIFNhbml0eSBjaGVja3MuXG4gICAgaWYgKHRoaXMucmVjdiA8IHRoaXMucmVhZCkge1xuICAgICAgdGhpcy5yZWN2ID0gdGhpcy5yZWFkO1xuICAgICAgZG9VcGRhdGUgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAodGhpcy5zZXEgPCB0aGlzLnJlY3YpIHtcbiAgICAgIHRoaXMuc2VxID0gdGhpcy5yZWN2O1xuICAgICAgaWYgKCF0aGlzLnRvdWNoZWQgfHwgdGhpcy50b3VjaGVkIDwgdHMpIHtcbiAgICAgICAgdGhpcy50b3VjaGVkID0gdHM7XG4gICAgICB9XG4gICAgICBkb1VwZGF0ZSA9IHRydWU7XG4gICAgfVxuICAgIHRoaXMudW5yZWFkID0gdGhpcy5zZXEgLSB0aGlzLnJlYWQ7XG4gICAgcmV0dXJuIGRvVXBkYXRlO1xuICB9XG4gIC8qKlxuICAgKiBHZXQgdXNlciBkZXNjcmlwdGlvbiBmcm9tIGdsb2JhbCBjYWNoZS4gVGhlIHVzZXIgZG9lcyBub3QgbmVlZCB0byBiZSBhXG4gICAqIHN1YnNjcmliZXIgb2YgdGhpcyB0b3BpYy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVpZCAtIElEIG9mIHRoZSB1c2VyIHRvIGZldGNoLlxuICAgKiBAcmV0dXJuIHtPYmplY3R9IHVzZXIgZGVzY3JpcHRpb24gb3IgdW5kZWZpbmVkLlxuICAgKi9cbiAgdXNlckRlc2ModWlkKSB7XG4gICAgLy8gVE9ETzogaGFuZGxlIGFzeW5jaHJvbm91cyByZXF1ZXN0c1xuICAgIGNvbnN0IHVzZXIgPSB0aGlzLl9jYWNoZUdldFVzZXIodWlkKTtcbiAgICBpZiAodXNlcikge1xuICAgICAgcmV0dXJuIHVzZXI7IC8vIFByb21pc2UucmVzb2x2ZSh1c2VyKVxuICAgIH1cbiAgfVxuICAvKipcbiAgICogR2V0IGRlc2NyaXB0aW9uIG9mIHRoZSBwMnAgcGVlciBmcm9tIHN1YnNjcmlwdGlvbiBjYWNoZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHJldHVybiB7T2JqZWN0fSBwZWVyJ3MgZGVzY3JpcHRpb24gb3IgdW5kZWZpbmVkLlxuICAgKi9cbiAgcDJwUGVlckRlc2MoKSB7XG4gICAgaWYgKCF0aGlzLmlzUDJQVHlwZSgpKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fdXNlcnNbdGhpcy5uYW1lXTtcbiAgfVxuICAvKipcbiAgICogSXRlcmF0ZSBvdmVyIGNhY2hlZCBzdWJzY3JpYmVycy4gSWYgY2FsbGJhY2sgaXMgdW5kZWZpbmVkLCB1c2UgdGhpcy5vbk1ldGFTdWIuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIC0gQ2FsbGJhY2sgd2hpY2ggd2lsbCByZWNlaXZlIHN1YnNjcmliZXJzIG9uZSBieSBvbmUuXG4gICAqIEBwYXJhbSB7T2JqZWN0PX0gY29udGV4dCAtIFZhbHVlIG9mIGB0aGlzYCBpbnNpZGUgdGhlIGBjYWxsYmFja2AuXG4gICAqL1xuICBzdWJzY3JpYmVycyhjYWxsYmFjaywgY29udGV4dCkge1xuICAgIGNvbnN0IGNiID0gKGNhbGxiYWNrIHx8IHRoaXMub25NZXRhU3ViKTtcbiAgICBpZiAoY2IpIHtcbiAgICAgIGZvciAobGV0IGlkeCBpbiB0aGlzLl91c2Vycykge1xuICAgICAgICBjYi5jYWxsKGNvbnRleHQsIHRoaXMuX3VzZXJzW2lkeF0sIGlkeCwgdGhpcy5fdXNlcnMpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICAvKipcbiAgICogR2V0IGEgY29weSBvZiBjYWNoZWQgdGFncy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHJldHVybiB7QXJyYXkuPHN0cmluZz59IGEgY29weSBvZiB0YWdzXG4gICAqL1xuICB0YWdzKCkge1xuICAgIC8vIFJldHVybiBhIGNvcHkuXG4gICAgcmV0dXJuIHRoaXMuX3RhZ3Muc2xpY2UoMCk7XG4gIH1cbiAgLyoqXG4gICAqIEdldCBjYWNoZWQgc3Vic2NyaXB0aW9uIGZvciB0aGUgZ2l2ZW4gdXNlciBJRC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVpZCAtIGlkIG9mIHRoZSB1c2VyIHRvIHF1ZXJ5IGZvclxuICAgKiBAcmV0dXJuIHVzZXIgZGVzY3JpcHRpb24gb3IgdW5kZWZpbmVkLlxuICAgKi9cbiAgc3Vic2NyaWJlcih1aWQpIHtcbiAgICByZXR1cm4gdGhpcy5fdXNlcnNbdWlkXTtcbiAgfVxuICAvKipcbiAgICogSXRlcmF0ZSBvdmVyIHZlcnNpb25zIG9mIGEgbWVzc2FnZTogY2FsbCA8Y29kZT5jYWxsYmFjazwvY29kZT4gZm9yIGVhY2ggdmVyc2lvbiAoZXhjbHVkaW5nIG9yaWdpbmFsKS5cbiAgICogSWYgPGNvZGU+Y2FsbGJhY2s8L2NvZGU+IGlzIHVuZGVmaW5lZCwgZG9lcyBub3RoaW5nLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gb3JpZ1NlcSAtIHNlcSBJRCBvZiB0aGUgb3JpZ2luYWwgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtUaW5vZGUuRm9yRWFjaENhbGxiYWNrVHlwZX0gY2FsbGJhY2sgLSBDYWxsYmFjayB3aGljaCB3aWxsIHJlY2VpdmUgbWVzc2FnZXMgb25lIGJ5IG9uZS4gU2VlIHtAbGluayBUaW5vZGUuQ0J1ZmZlciNmb3JFYWNofVxuICAgKiBAcGFyYW0ge09iamVjdH0gY29udGV4dCAtIFZhbHVlIG9mIGB0aGlzYCBpbnNpZGUgdGhlIGBjYWxsYmFja2AuXG4gICAqL1xuICBtZXNzYWdlVmVyc2lvbnMob3JpZ1NlcSwgY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICBpZiAoIWNhbGxiYWNrKSB7XG4gICAgICAvLyBObyBjYWxsYmFjaz8gV2UgYXJlIGRvbmUgdGhlbi5cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgdmVyc2lvbnMgPSB0aGlzLl9tZXNzYWdlVmVyc2lvbnNbb3JpZ1NlcV07XG4gICAgaWYgKCF2ZXJzaW9ucykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2ZXJzaW9ucy5mb3JFYWNoKGNhbGxiYWNrLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgY29udGV4dCk7XG4gIH1cbiAgLyoqXG4gICAqIEl0ZXJhdGUgb3ZlciBjYWNoZWQgbWVzc2FnZXM6IGNhbGwgPGNvZGU+Y2FsbGJhY2s8L2NvZGU+IGZvciBlYWNoIG1lc3NhZ2UgaW4gdGhlIHJhbmdlIFtzaW5jZUlkeCwgYmVmb3JlSWR4KS5cbiAgICogSWYgPGNvZGU+Y2FsbGJhY2s8L2NvZGU+IGlzIHVuZGVmaW5lZCwgdXNlIDxjb2RlPnRoaXMub25EYXRhPC9jb2RlPi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtUaW5vZGUuRm9yRWFjaENhbGxiYWNrVHlwZX0gY2FsbGJhY2sgLSBDYWxsYmFjayB3aGljaCB3aWxsIHJlY2VpdmUgbWVzc2FnZXMgb25lIGJ5IG9uZS4gU2VlIHtAbGluayBUaW5vZGUuQ0J1ZmZlciNmb3JFYWNofVxuICAgKiBAcGFyYW0ge251bWJlcn0gc2luY2VJZCAtIE9wdGlvbmFsIHNlcUlkIHRvIHN0YXJ0IGl0ZXJhdGluZyBmcm9tIChpbmNsdXNpdmUpLlxuICAgKiBAcGFyYW0ge251bWJlcn0gYmVmb3JlSWQgLSBPcHRpb25hbCBzZXFJZCB0byBzdG9wIGl0ZXJhdGluZyBiZWZvcmUgaXQgaXMgcmVhY2hlZCAoZXhjbHVzaXZlKS5cbiAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHQgLSBWYWx1ZSBvZiBgdGhpc2AgaW5zaWRlIHRoZSBgY2FsbGJhY2tgLlxuICAgKi9cbiAgbWVzc2FnZXMoY2FsbGJhY2ssIHNpbmNlSWQsIGJlZm9yZUlkLCBjb250ZXh0KSB7XG4gICAgY29uc3QgY2IgPSAoY2FsbGJhY2sgfHwgdGhpcy5vbkRhdGEpO1xuICAgIGlmIChjYikge1xuICAgICAgY29uc3Qgc3RhcnRJZHggPSB0eXBlb2Ygc2luY2VJZCA9PSAnbnVtYmVyJyA/IHRoaXMuX21lc3NhZ2VzLmZpbmQoe1xuICAgICAgICBzZXE6IHNpbmNlSWRcbiAgICAgIH0sIHRydWUpIDogdW5kZWZpbmVkO1xuICAgICAgY29uc3QgYmVmb3JlSWR4ID0gdHlwZW9mIGJlZm9yZUlkID09ICdudW1iZXInID8gdGhpcy5fbWVzc2FnZXMuZmluZCh7XG4gICAgICAgIHNlcTogYmVmb3JlSWRcbiAgICAgIH0sIHRydWUpIDogdW5kZWZpbmVkO1xuICAgICAgaWYgKHN0YXJ0SWR4ICE9IC0xICYmIGJlZm9yZUlkeCAhPSAtMSkge1xuICAgICAgICAvLyBTdGVwIDEuIEZpbHRlciBvdXQgYWxsIHJlcGxhY2VtZW50IG1lc3NhZ2VzIGFuZFxuICAgICAgICAvLyBzYXZlIGRpc3BsYXlhYmxlIG1lc3NhZ2VzIGluIGEgdGVtcG9yYXJ5IGJ1ZmZlci5cbiAgICAgICAgbGV0IG1zZ3MgPSBbXTtcbiAgICAgICAgdGhpcy5fbWVzc2FnZXMuZm9yRWFjaCgobXNnLCB1bnVzZWQxLCB1bnVzZWQyLCBpKSA9PiB7XG4gICAgICAgICAgaWYgKHRoaXMuX2lzUmVwbGFjZW1lbnRNc2cobXNnKSkge1xuICAgICAgICAgICAgLy8gU2tpcCByZXBsYWNlbWVudHMuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIG1zZ3MucHVzaCh7XG4gICAgICAgICAgICBkYXRhOiB0aGlzLmxhdGVzdE1zZ1ZlcnNpb24obXNnLnNlcSkgfHwgbXNnLFxuICAgICAgICAgICAgaWR4OiBpXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sIHN0YXJ0SWR4LCBiZWZvcmVJZHgsIHt9KTtcbiAgICAgICAgLy8gU3RlcCAyLiBMb29wIG92ZXIgZGlzcGxheWJsZSBtZXNzYWdlcyBpbnZva2luZyBjYiBvbiBlYWNoIG9mIHRoZW0uXG4gICAgICAgIG1zZ3MuZm9yRWFjaCgodmFsLCBpKSA9PiB7XG4gICAgICAgICAgY2IuY2FsbChjb250ZXh0LCB2YWwuZGF0YSxcbiAgICAgICAgICAgIChpID4gMCA/IG1zZ3NbaSAtIDFdLmRhdGEgOiB1bmRlZmluZWQpLFxuICAgICAgICAgICAgKGkgPCBtc2dzLmxlbmd0aCAtIDEgPyBtc2dzW2kgKyAxXS5kYXRhIDogdW5kZWZpbmVkKSwgdmFsLmlkeCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICAvKipcbiAgICogR2V0IHRoZSBtZXNzYWdlIGZyb20gY2FjaGUgYnkgPGNvZGU+c2VxPC9jb2RlPi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IHNlcSAtIG1lc3NhZ2Ugc2VxSWQgdG8gc2VhcmNoIGZvci5cbiAgICogQHJldHVybnMge09iamVjdH0gdGhlIG1lc3NhZ2Ugd2l0aCB0aGUgZ2l2ZW4gPGNvZGU+c2VxPC9jb2RlPiBvciA8Y29kZT51bmRlZmluZWQ8L2NvZGU+LCBpZiBubyBzdWNoIG1lc3NhZ2UgaXMgZm91bmQuXG4gICAqL1xuICBmaW5kTWVzc2FnZShzZXEpIHtcbiAgICBjb25zdCBpZHggPSB0aGlzLl9tZXNzYWdlcy5maW5kKHtcbiAgICAgIHNlcTogc2VxXG4gICAgfSk7XG4gICAgaWYgKGlkeCA+PSAwKSB7XG4gICAgICByZXR1cm4gdGhpcy5fbWVzc2FnZXMuZ2V0QXQoaWR4KTtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuICAvKipcbiAgICogR2V0IHRoZSBtb3N0IHJlY2VudCBtZXNzYWdlIGZyb20gY2FjaGUuIFRoaXMgbWV0aG9kIGNvdW50cyBhbGwgbWVzc2FnZXMsIGluY2x1ZGluZyBkZWxldGVkIHJhbmdlcy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtib29sZW59IHNraXBEZWxldGVkIC0gaWYgdGhlIGxhc3QgbWVzc2FnZSBpcyBhIGRlbGV0ZWQgcmFuZ2UsIGdldCB0aGUgb25lIGJlZm9yZSBpdC5cbiAgICogQHJldHVybnMge09iamVjdH0gdGhlIG1vc3QgcmVjZW50IGNhY2hlZCBtZXNzYWdlIG9yIDxjb2RlPnVuZGVmaW5lZDwvY29kZT4sIGlmIG5vIG1lc3NhZ2VzIGFyZSBjYWNoZWQuXG4gICAqL1xuICBsYXRlc3RNZXNzYWdlKHNraXBEZWxldGVkKSB7XG4gICAgY29uc3QgbXNnID0gdGhpcy5fbWVzc2FnZXMuZ2V0TGFzdCgpO1xuICAgIGlmICghc2tpcERlbGV0ZWQgfHwgIW1zZyB8fCBtc2cuX3N0YXR1cyAhPSBDb25zdC5NRVNTQUdFX1NUQVRVU19ERUxfUkFOR0UpIHtcbiAgICAgIHJldHVybiBtc2c7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9tZXNzYWdlcy5nZXRMYXN0KDEpO1xuICB9XG4gIC8qKlxuICAgKiBHZXQgdGhlIGxhdGVzdCB2ZXJzaW9uIGZvciBtZXNzYWdlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gc2VxIC0gb3JpZ2luYWwgc2VxIElEIG9mIHRoZSBtZXNzYWdlLlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSB0aGUgbGF0ZXN0IHZlcnNpb24gb2YgdGhlIG1lc3NhZ2Ugb3IgbnVsbCBpZiBtZXNzYWdlIG5vdCBmb3VuZC5cbiAgICovXG4gIGxhdGVzdE1zZ1ZlcnNpb24oc2VxKSB7XG4gICAgY29uc3QgdmVyc2lvbnMgPSB0aGlzLl9tZXNzYWdlVmVyc2lvbnNbc2VxXTtcbiAgICByZXR1cm4gdmVyc2lvbnMgPyB2ZXJzaW9ucy5nZXRMYXN0KCkgOiBudWxsO1xuICB9XG4gIC8qKlxuICAgKiBHZXQgdGhlIG1heGltdW0gY2FjaGVkIHNlcSBJRC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHJldHVybnMge251bWJlcn0gdGhlIGdyZWF0ZXN0IHNlcSBJRCBpbiBjYWNoZS5cbiAgICovXG4gIG1heE1zZ1NlcSgpIHtcbiAgICByZXR1cm4gdGhpcy5fbWF4U2VxO1xuICB9XG4gIC8qKlxuICAgKiBHZXQgdGhlIG1heGltdW0gZGVsZXRpb24gSUQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IHRoZSBncmVhdGVzdCBkZWxldGlvbiBJRC5cbiAgICovXG4gIG1heENsZWFySWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX21heERlbDtcbiAgfVxuICAvKipcbiAgICogR2V0IHRoZSBudW1iZXIgb2YgbWVzc2FnZXMgaW4gdGhlIGNhY2hlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSBjb3VudCBvZiBjYWNoZWQgbWVzc2FnZXMuXG4gICAqL1xuICBtZXNzYWdlQ291bnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX21lc3NhZ2VzLmxlbmd0aCgpO1xuICB9XG4gIC8qKlxuICAgKiBJdGVyYXRlIG92ZXIgY2FjaGVkIHVuc2VudCBtZXNzYWdlcy4gV3JhcHMge0BsaW5rIFRpbm9kZS5Ub3BpYyNtZXNzYWdlc30uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIC0gQ2FsbGJhY2sgd2hpY2ggd2lsbCByZWNlaXZlIG1lc3NhZ2VzIG9uZSBieSBvbmUuIFNlZSB7QGxpbmsgVGlub2RlLkNCdWZmZXIjZm9yRWFjaH1cbiAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHQgLSBWYWx1ZSBvZiA8Y29kZT50aGlzPC9jb2RlPiBpbnNpZGUgdGhlIDxjb2RlPmNhbGxiYWNrPC9jb2RlPi5cbiAgICovXG4gIHF1ZXVlZE1lc3NhZ2VzKGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgaWYgKCFjYWxsYmFjaykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2FsbGJhY2sgbXVzdCBiZSBwcm92aWRlZFwiKTtcbiAgICB9XG4gICAgdGhpcy5tZXNzYWdlcyhjYWxsYmFjaywgQ29uc3QuTE9DQUxfU0VRSUQsIHVuZGVmaW5lZCwgY29udGV4dCk7XG4gIH1cbiAgLyoqXG4gICAqIEdldCB0aGUgbnVtYmVyIG9mIHRvcGljIHN1YnNjcmliZXJzIHdobyBtYXJrZWQgdGhpcyBtZXNzYWdlIGFzIGVpdGhlciByZWN2IG9yIHJlYWRcbiAgICogQ3VycmVudCB1c2VyIGlzIGV4Y2x1ZGVkIGZyb20gdGhlIGNvdW50LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gd2hhdCAtIHdoYXQgYWN0aW9uIHRvIGNvbnNpZGVyOiByZWNlaXZlZCA8Y29kZT5cInJlY3ZcIjwvY29kZT4gb3IgcmVhZCA8Y29kZT5cInJlYWRcIjwvY29kZT4uXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzZXEgLSBJRCBvciB0aGUgbWVzc2FnZSByZWFkIG9yIHJlY2VpdmVkLlxuICAgKlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSB0aGUgbnVtYmVyIG9mIHN1YnNjcmliZXJzIHdobyBtYXJrZWQgdGhlIG1lc3NhZ2Ugd2l0aCB0aGUgZ2l2ZW4gSUQgYXMgcmVhZCBvciByZWNlaXZlZC5cbiAgICovXG4gIG1zZ1JlY2VpcHRDb3VudCh3aGF0LCBzZXEpIHtcbiAgICBsZXQgY291bnQgPSAwO1xuICAgIGlmIChzZXEgPiAwKSB7XG4gICAgICBjb25zdCBtZSA9IHRoaXMuX3Rpbm9kZS5nZXRDdXJyZW50VXNlcklEKCk7XG4gICAgICBmb3IgKGxldCBpZHggaW4gdGhpcy5fdXNlcnMpIHtcbiAgICAgICAgY29uc3QgdXNlciA9IHRoaXMuX3VzZXJzW2lkeF07XG4gICAgICAgIGlmICh1c2VyLnVzZXIgIT09IG1lICYmIHVzZXJbd2hhdF0gPj0gc2VxKSB7XG4gICAgICAgICAgY291bnQrKztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY291bnQ7XG4gIH1cbiAgLyoqXG4gICAqIEdldCB0aGUgbnVtYmVyIG9mIHRvcGljIHN1YnNjcmliZXJzIHdobyBtYXJrZWQgdGhpcyBtZXNzYWdlIChhbmQgYWxsIG9sZGVyIG1lc3NhZ2VzKSBhcyByZWFkLlxuICAgKiBUaGUgY3VycmVudCB1c2VyIGlzIGV4Y2x1ZGVkIGZyb20gdGhlIGNvdW50LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gc2VxIC0gbWVzc2FnZSBpZCB0byBjaGVjay5cbiAgICogQHJldHVybnMge251bWJlcn0gbnVtYmVyIG9mIHN1YnNjcmliZXJzIHdobyBjbGFpbSB0byBoYXZlIHJlY2VpdmVkIHRoZSBtZXNzYWdlLlxuICAgKi9cbiAgbXNnUmVhZENvdW50KHNlcSkge1xuICAgIHJldHVybiB0aGlzLm1zZ1JlY2VpcHRDb3VudCgncmVhZCcsIHNlcSk7XG4gIH1cbiAgLyoqXG4gICAqIEdldCB0aGUgbnVtYmVyIG9mIHRvcGljIHN1YnNjcmliZXJzIHdobyBtYXJrZWQgdGhpcyBtZXNzYWdlIChhbmQgYWxsIG9sZGVyIG1lc3NhZ2VzKSBhcyByZWNlaXZlZC5cbiAgICogVGhlIGN1cnJlbnQgdXNlciBpcyBleGNsdWRlZCBmcm9tIHRoZSBjb3VudC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IHNlcSAtIE1lc3NhZ2UgaWQgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IE51bWJlciBvZiBzdWJzY3JpYmVycyB3aG8gY2xhaW0gdG8gaGF2ZSByZWNlaXZlZCB0aGUgbWVzc2FnZS5cbiAgICovXG4gIG1zZ1JlY3ZDb3VudChzZXEpIHtcbiAgICByZXR1cm4gdGhpcy5tc2dSZWNlaXB0Q291bnQoJ3JlY3YnLCBzZXEpO1xuICB9XG4gIC8qKlxuICAgKiBDaGVjayBpZiBjYWNoZWQgbWVzc2FnZSBJRHMgaW5kaWNhdGUgdGhhdCB0aGUgc2VydmVyIG1heSBoYXZlIG1vcmUgbWVzc2FnZXMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gbmV3ZXIgLSBpZiA8Y29kZT50cnVlPC9jb2RlPiwgY2hlY2sgZm9yIG5ld2VyIG1lc3NhZ2VzIG9ubHkuXG4gICAqL1xuICBtc2dIYXNNb3JlTWVzc2FnZXMobmV3ZXIpIHtcbiAgICByZXR1cm4gbmV3ZXIgPyB0aGlzLnNlcSA+IHRoaXMuX21heFNlcSA6XG4gICAgICAvLyBfbWluU2VxIGNvdWxkIGJlIG1vcmUgdGhhbiAxLCBidXQgZWFybGllciBtZXNzYWdlcyBjb3VsZCBoYXZlIGJlZW4gZGVsZXRlZC5cbiAgICAgICh0aGlzLl9taW5TZXEgPiAxICYmICF0aGlzLl9ub0VhcmxpZXJNc2dzKTtcbiAgfVxuICAvKipcbiAgICogQ2hlY2sgaWYgdGhlIGdpdmVuIHNlcSBJZCBpcyBpZCBvZiB0aGUgbW9zdCByZWNlbnQgbWVzc2FnZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IHNlcUlkIGlkIG9mIHRoZSBtZXNzYWdlIHRvIGNoZWNrXG4gICAqL1xuICBpc05ld01lc3NhZ2Uoc2VxSWQpIHtcbiAgICByZXR1cm4gdGhpcy5fbWF4U2VxIDw9IHNlcUlkO1xuICB9XG4gIC8qKlxuICAgKiBSZW1vdmUgb25lIG1lc3NhZ2UgZnJvbSBsb2NhbCBjYWNoZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IHNlcUlkIGlkIG9mIHRoZSBtZXNzYWdlIHRvIHJlbW92ZSBmcm9tIGNhY2hlLlxuICAgKiBAcmV0dXJucyB7TWVzc2FnZX0gcmVtb3ZlZCBtZXNzYWdlIG9yIHVuZGVmaW5lZCBpZiBzdWNoIG1lc3NhZ2Ugd2FzIG5vdCBmb3VuZC5cbiAgICovXG4gIGZsdXNoTWVzc2FnZShzZXFJZCkge1xuICAgIGNvbnN0IGlkeCA9IHRoaXMuX21lc3NhZ2VzLmZpbmQoe1xuICAgICAgc2VxOiBzZXFJZFxuICAgIH0pO1xuICAgIGRlbGV0ZSB0aGlzLl9tZXNzYWdlVmVyc2lvbnNbc2VxSWRdO1xuICAgIGlmIChpZHggPj0gMCkge1xuICAgICAgdGhpcy5fdGlub2RlLl9kYi5yZW1NZXNzYWdlcyh0aGlzLm5hbWUsIHNlcUlkKTtcbiAgICAgIHJldHVybiB0aGlzLl9tZXNzYWdlcy5kZWxBdChpZHgpO1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG4gIC8qKlxuICAgKiBSZW1vdmUgYSByYW5nZSBvZiBtZXNzYWdlcyBmcm9tIHRoZSBsb2NhbCBjYWNoZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IGZyb21JZCBzZXEgSUQgb2YgdGhlIGZpcnN0IG1lc3NhZ2UgdG8gcmVtb3ZlIChpbmNsdXNpdmUpLlxuICAgKiBAcGFyYW0ge251bWJlcn0gdW50aWxJZCBzZXFJRCBvZiB0aGUgbGFzdCBtZXNzYWdlIHRvIHJlbW92ZSAoZXhjbHVzaXZlKS5cbiAgICpcbiAgICogQHJldHVybnMge01lc3NhZ2VbXX0gYXJyYXkgb2YgcmVtb3ZlZCBtZXNzYWdlcyAoY291bGQgYmUgZW1wdHkpLlxuICAgKi9cbiAgZmx1c2hNZXNzYWdlUmFuZ2UoZnJvbUlkLCB1bnRpbElkKSB7XG4gICAgLy8gUmVtb3ZlIHJhbmdlIGZyb20gcGVyc2lzdGVudCBjYWNoZS5cbiAgICB0aGlzLl90aW5vZGUuX2RiLnJlbU1lc3NhZ2VzKHRoaXMubmFtZSwgZnJvbUlkLCB1bnRpbElkKTtcblxuICAgIC8vIFJlbW92ZSBhbGwgdmVyc2lvbnMga2V5ZWQgYnkgSURzIGluIHRoZSByYW5nZS5cbiAgICBmb3IgKGxldCBpID0gZnJvbUlkOyBpIDwgdW50aWxJZDsgaSsrKSB7XG4gICAgICBkZWxldGUgdGhpcy5fbWVzc2FnZVZlcnNpb25zW2ldO1xuICAgIH1cblxuICAgIC8vIHN0YXJ0LCBlbmQ6IGZpbmQgaW5zZXJ0aW9uIHBvaW50cyAobmVhcmVzdCA9PSB0cnVlKS5cbiAgICBjb25zdCBzaW5jZSA9IHRoaXMuX21lc3NhZ2VzLmZpbmQoe1xuICAgICAgc2VxOiBmcm9tSWRcbiAgICB9LCB0cnVlKTtcbiAgICByZXR1cm4gc2luY2UgPj0gMCA/IHRoaXMuX21lc3NhZ2VzLmRlbFJhbmdlKHNpbmNlLCB0aGlzLl9tZXNzYWdlcy5maW5kKHtcbiAgICAgIHNlcTogdW50aWxJZFxuICAgIH0sIHRydWUpKSA6IFtdO1xuICB9XG4gIC8qKlxuICAgKiBVcGRhdGUgbWVzc2FnZSdzIHNlcUlkLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcHViIG1lc3NhZ2Ugb2JqZWN0LlxuICAgKiBAcGFyYW0ge251bWJlcn0gbmV3U2VxSWQgbmV3IHNlcSBpZCBmb3IgcHViLlxuICAgKi9cbiAgc3dhcE1lc3NhZ2VJZChwdWIsIG5ld1NlcUlkKSB7XG4gICAgY29uc3QgaWR4ID0gdGhpcy5fbWVzc2FnZXMuZmluZChwdWIpO1xuICAgIGNvbnN0IG51bU1lc3NhZ2VzID0gdGhpcy5fbWVzc2FnZXMubGVuZ3RoKCk7XG4gICAgaWYgKDAgPD0gaWR4ICYmIGlkeCA8IG51bU1lc3NhZ2VzKSB7XG4gICAgICAvLyBSZW1vdmUgbWVzc2FnZSB3aXRoIHRoZSBvbGQgc2VxIElELlxuICAgICAgdGhpcy5fbWVzc2FnZXMuZGVsQXQoaWR4KTtcbiAgICAgIHRoaXMuX3Rpbm9kZS5fZGIucmVtTWVzc2FnZXModGhpcy5uYW1lLCBwdWIuc2VxKTtcbiAgICAgIC8vIEFkZCBtZXNzYWdlIHdpdGggdGhlIG5ldyBzZXEgSUQuXG4gICAgICBwdWIuc2VxID0gbmV3U2VxSWQ7XG4gICAgICB0aGlzLl9tZXNzYWdlcy5wdXQocHViKTtcbiAgICAgIHRoaXMuX3Rpbm9kZS5fZGIuYWRkTWVzc2FnZShwdWIpO1xuICAgIH1cbiAgfVxuICAvKipcbiAgICogQXR0ZW1wdCB0byBzdG9wIG1lc3NhZ2UgZnJvbSBiZWluZyBzZW50LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gc2VxSWQgaWQgb2YgdGhlIG1lc3NhZ2UgdG8gc3RvcCBzZW5kaW5nIGFuZCByZW1vdmUgZnJvbSBjYWNoZS5cbiAgICpcbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIG1lc3NhZ2Ugd2FzIGNhbmNlbGxlZCwgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIGNhbmNlbFNlbmQoc2VxSWQpIHtcbiAgICBjb25zdCBpZHggPSB0aGlzLl9tZXNzYWdlcy5maW5kKHtcbiAgICAgIHNlcTogc2VxSWRcbiAgICB9KTtcbiAgICBpZiAoaWR4ID49IDApIHtcbiAgICAgIGNvbnN0IG1zZyA9IHRoaXMuX21lc3NhZ2VzLmdldEF0KGlkeCk7XG4gICAgICBjb25zdCBzdGF0dXMgPSB0aGlzLm1zZ1N0YXR1cyhtc2cpO1xuICAgICAgaWYgKHN0YXR1cyA9PSBDb25zdC5NRVNTQUdFX1NUQVRVU19RVUVVRUQgfHwgc3RhdHVzID09IENvbnN0Lk1FU1NBR0VfU1RBVFVTX0ZBSUxFRCkge1xuICAgICAgICB0aGlzLl90aW5vZGUuX2RiLnJlbU1lc3NhZ2VzKHRoaXMubmFtZSwgc2VxSWQpO1xuICAgICAgICBtc2cuX2NhbmNlbGxlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuX21lc3NhZ2VzLmRlbEF0KGlkeCk7XG4gICAgICAgIGlmICh0aGlzLm9uRGF0YSkge1xuICAgICAgICAgIC8vIENhbGxpbmcgd2l0aCBubyBwYXJhbWV0ZXJzIHRvIGluZGljYXRlIHRoZSBtZXNzYWdlIHdhcyBkZWxldGVkLlxuICAgICAgICAgIHRoaXMub25EYXRhKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICAvKipcbiAgICogR2V0IHR5cGUgb2YgdGhlIHRvcGljOiBtZSwgcDJwLCBncnAsIGZuZC4uLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBPbmUgb2YgJ21lJywgJ3AycCcsICdncnAnLCAnZm5kJywgJ3N5cycgb3IgPGNvZGU+dW5kZWZpbmVkPC9jb2RlPi5cbiAgICovXG4gIGdldFR5cGUoKSB7XG4gICAgcmV0dXJuIFRvcGljLnRvcGljVHlwZSh0aGlzLm5hbWUpO1xuICB9XG4gIC8qKlxuICAgKiBHZXQgY3VycmVudCB1c2VyJ3MgYWNjZXNzIG1vZGUgb2YgdGhlIHRvcGljLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLkFjY2Vzc01vZGV9IC0gdXNlcidzIGFjY2VzcyBtb2RlXG4gICAqL1xuICBnZXRBY2Nlc3NNb2RlKCkge1xuICAgIHJldHVybiB0aGlzLmFjcztcbiAgfVxuICAvKipcbiAgICogU2V0IGN1cnJlbnQgdXNlcidzIGFjY2VzcyBtb2RlIG9mIHRoZSB0b3BpYy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtBY2Nlc3NNb2RlIHwgT2JqZWN0fSBhY3MgLSBhY2Nlc3MgbW9kZSB0byBzZXQuXG4gICAqL1xuICBzZXRBY2Nlc3NNb2RlKGFjcykge1xuICAgIHJldHVybiB0aGlzLmFjcyA9IG5ldyBBY2Nlc3NNb2RlKGFjcyk7XG4gIH1cbiAgLyoqXG4gICAqIEdldCB0b3BpYydzIGRlZmF1bHQgYWNjZXNzIG1vZGUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuRGVmQWNzfSAtIGFjY2VzcyBtb2RlLCBzdWNoIGFzIHthdXRoOiBgUldQYCwgYW5vbjogYE5gfS5cbiAgICovXG4gIGdldERlZmF1bHRBY2Nlc3MoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGVmYWNzO1xuICB9XG4gIC8qKlxuICAgKiBJbml0aWFsaXplIG5ldyBtZXRhIHtAbGluayBUaW5vZGUuR2V0UXVlcnl9IGJ1aWxkZXIuIFRoZSBxdWVyeSBpcyBhdHRjaGVkIHRvIHRoZSBjdXJyZW50IHRvcGljLlxuICAgKiBJdCB3aWxsIG5vdCB3b3JrIGNvcnJlY3RseSBpZiB1c2VkIHdpdGggYSBkaWZmZXJlbnQgdG9waWMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuTWV0YUdldEJ1aWxkZXJ9IHF1ZXJ5IGF0dGFjaGVkIHRvIHRoZSBjdXJyZW50IHRvcGljLlxuICAgKi9cbiAgc3RhcnRNZXRhUXVlcnkoKSB7XG4gICAgcmV0dXJuIG5ldyBNZXRhR2V0QnVpbGRlcih0aGlzKTtcbiAgfVxuICAvKipcbiAgICogQ2hlY2sgaWYgdG9waWMgaXMgYXJjaGl2ZWQsIGkuZS4gcHJpdmF0ZS5hcmNoID09IHRydWUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIDxjb2RlPnRydWU8L2NvZGU+IGlmIHRvcGljIGlzIGFyY2hpdmVkLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgaXNBcmNoaXZlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5wcml2YXRlICYmICEhdGhpcy5wcml2YXRlLmFyY2g7XG4gIH1cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRvcGljIGlzIGEgJ21lJyB0b3BpYy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHJldHVybnMge2Jvb2xlYW59IC0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgdG9waWMgaXMgYSAnbWUnIHRvcGljLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgaXNNZVR5cGUoKSB7XG4gICAgcmV0dXJuIFRvcGljLmlzTWVUb3BpY05hbWUodGhpcy5uYW1lKTtcbiAgfVxuICAvKipcbiAgICogQ2hlY2sgaWYgdG9waWMgaXMgYSBjaGFubmVsLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0b3BpYyBpcyBhIGNoYW5uZWwsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBpc0NoYW5uZWxUeXBlKCkge1xuICAgIHJldHVybiBUb3BpYy5pc0NoYW5uZWxUb3BpY05hbWUodGhpcy5uYW1lKTtcbiAgfVxuICAvKipcbiAgICogQ2hlY2sgaWYgdG9waWMgaXMgYSBncm91cCB0b3BpYy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHJldHVybnMge2Jvb2xlYW59IC0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgdG9waWMgaXMgYSBncm91cCwgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIGlzR3JvdXBUeXBlKCkge1xuICAgIHJldHVybiBUb3BpYy5pc0dyb3VwVG9waWNOYW1lKHRoaXMubmFtZSk7XG4gIH1cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRvcGljIGlzIGEgcDJwIHRvcGljLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0b3BpYyBpcyBhIHAycCB0b3BpYywgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIGlzUDJQVHlwZSgpIHtcbiAgICByZXR1cm4gVG9waWMuaXNQMlBUb3BpY05hbWUodGhpcy5uYW1lKTtcbiAgfVxuICAvKipcbiAgICogQ2hlY2sgaWYgdG9waWMgaXMgYSBjb21tdW5pY2F0aW9uIHRvcGljLCBpLmUuIGEgZ3JvdXAgb3IgcDJwIHRvcGljLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0b3BpYyBpcyBhIHAycCBvciBncm91cCB0b3BpYywgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIGlzQ29tbVR5cGUoKSB7XG4gICAgcmV0dXJuIFRvcGljLmlzQ29tbVRvcGljTmFtZSh0aGlzLm5hbWUpO1xuICB9XG4gIC8qKlxuICAgKiBHZXQgc3RhdHVzIChxdWV1ZWQsIHNlbnQsIHJlY2VpdmVkIGV0Yykgb2YgYSBnaXZlbiBtZXNzYWdlIGluIHRoZSBjb250ZXh0XG4gICAqIG9mIHRoaXMgdG9waWMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7TWVzc2FnZX0gbXNnIC0gbWVzc2FnZSB0byBjaGVjayBmb3Igc3RhdHVzLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHVwZCAtIHVwZGF0ZSBjaGFjaGVkIG1lc3NhZ2Ugc3RhdHVzLlxuICAgKlxuICAgKiBAcmV0dXJucyBtZXNzYWdlIHN0YXR1cyBjb25zdGFudC5cbiAgICovXG4gIG1zZ1N0YXR1cyhtc2csIHVwZCkge1xuICAgIGxldCBzdGF0dXMgPSBDb25zdC5NRVNTQUdFX1NUQVRVU19OT05FO1xuICAgIGlmICh0aGlzLl90aW5vZGUuaXNNZShtc2cuZnJvbSkpIHtcbiAgICAgIGlmIChtc2cuX3NlbmRpbmcpIHtcbiAgICAgICAgc3RhdHVzID0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfU0VORElORztcbiAgICAgIH0gZWxzZSBpZiAobXNnLl9mYWlsZWQgfHwgbXNnLl9jYW5jZWxsZWQpIHtcbiAgICAgICAgc3RhdHVzID0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfRkFJTEVEO1xuICAgICAgfSBlbHNlIGlmIChtc2cuc2VxID49IENvbnN0LkxPQ0FMX1NFUUlEKSB7XG4gICAgICAgIHN0YXR1cyA9IENvbnN0Lk1FU1NBR0VfU1RBVFVTX1FVRVVFRDtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5tc2dSZWFkQ291bnQobXNnLnNlcSkgPiAwKSB7XG4gICAgICAgIHN0YXR1cyA9IENvbnN0Lk1FU1NBR0VfU1RBVFVTX1JFQUQ7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMubXNnUmVjdkNvdW50KG1zZy5zZXEpID4gMCkge1xuICAgICAgICBzdGF0dXMgPSBDb25zdC5NRVNTQUdFX1NUQVRVU19SRUNFSVZFRDtcbiAgICAgIH0gZWxzZSBpZiAobXNnLnNlcSA+IDApIHtcbiAgICAgICAgc3RhdHVzID0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfU0VOVDtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG1zZy5fc3RhdHVzID09IENvbnN0Lk1FU1NBR0VfU1RBVFVTX0RFTF9SQU5HRSkge1xuICAgICAgc3RhdHVzID09IENvbnN0Lk1FU1NBR0VfU1RBVFVTX0RFTF9SQU5HRTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RhdHVzID0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfVE9fTUU7XG4gICAgfVxuXG4gICAgaWYgKHVwZCAmJiBtc2cuX3N0YXR1cyAhPSBzdGF0dXMpIHtcbiAgICAgIG1zZy5fc3RhdHVzID0gc3RhdHVzO1xuICAgICAgdGhpcy5fdGlub2RlLl9kYi51cGRNZXNzYWdlU3RhdHVzKHRoaXMubmFtZSwgbXNnLnNlcSwgc3RhdHVzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc3RhdHVzO1xuICB9XG5cbiAgLy8gUmV0dXJucyB0cnVlIGlmIHB1YiBpcyBtZWFudCB0byByZXBsYWNlIGFub3RoZXIgbWVzc2FnZSAoZS5nLiBvcmlnaW5hbCBtZXNzYWdlIHdhcyBlZGl0ZWQpLlxuICBfaXNSZXBsYWNlbWVudE1zZyhwdWIpIHtcbiAgICByZXR1cm4gcHViLmhlYWQgJiYgcHViLmhlYWQucmVwbGFjZTtcbiAgfVxuXG4gIC8vIElmIG1zZyBpcyBhIHJlcGxhY2VtZW50IGZvciBhbm90aGVyIG1lc3NhZ2UsIHNhdmUgdGhlIG1zZyBpbiB0aGUgbWVzc2FnZSB2ZXJzaW9ucyBjYWNoZVxuICAvLyBhcyBhIG5ld2VyIHZlcnNpb24gZm9yIHRoZSBtZXNzYWdlIGl0J3Mgc3VwcG9zZWQgdG8gcmVwbGFjZS5cbiAgX21heWJlVXBkYXRlTWVzc2FnZVZlcnNpb25zQ2FjaGUobXNnKSB7XG4gICAgaWYgKCF0aGlzLl9pc1JlcGxhY2VtZW50TXNnKG1zZykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgdGFyZ2V0U2VxID0gcGFyc2VJbnQobXNnLmhlYWQucmVwbGFjZS5zcGxpdCgnOicpWzFdKTtcbiAgICBpZiAodGFyZ2V0U2VxID4gbXNnLnNlcSkge1xuICAgICAgLy8gU3Vic3RpdHV0ZXMgYXJlIHN1cHBvc2VkIHRvIGhhdmUgaGlnaGVyIHNlcSBpZHMuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGxldCB2ZXJzaW9ucyA9IHRoaXMuX21lc3NhZ2VWZXJzaW9uc1t0YXJnZXRTZXFdIHx8IG5ldyBDQnVmZmVyKChhLCBiKSA9PiB7XG4gICAgICByZXR1cm4gYS5zZXEgLSBiLnNlcTtcbiAgICB9LCB0cnVlKTtcbiAgICB2ZXJzaW9ucy5wdXQobXNnKTtcbiAgICB0aGlzLl9tZXNzYWdlVmVyc2lvbnNbdGFyZ2V0U2VxXSA9IHZlcnNpb25zO1xuICB9XG5cbiAgLy8gUHJvY2VzcyBkYXRhIG1lc3NhZ2VcbiAgX3JvdXRlRGF0YShkYXRhKSB7XG4gICAgaWYgKGRhdGEuY29udGVudCkge1xuICAgICAgaWYgKCF0aGlzLnRvdWNoZWQgfHwgdGhpcy50b3VjaGVkIDwgZGF0YS50cykge1xuICAgICAgICB0aGlzLnRvdWNoZWQgPSBkYXRhLnRzO1xuICAgICAgICB0aGlzLl90aW5vZGUuX2RiLnVwZFRvcGljKHRoaXMpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChkYXRhLnNlcSA+IHRoaXMuX21heFNlcSkge1xuICAgICAgdGhpcy5fbWF4U2VxID0gZGF0YS5zZXE7XG4gICAgICB0aGlzLm1zZ1N0YXR1cyhkYXRhLCB0cnVlKTtcbiAgICAgIC8vIEFja24gcmVjZWl2aW5nIHRoZSBtZXNzYWdlLlxuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX3JlY3ZOb3RpZmljYXRpb25UaW1lcik7XG4gICAgICB0aGlzLl9yZWN2Tm90aWZpY2F0aW9uVGltZXIgPSBzZXRUaW1lb3V0KF8gPT4ge1xuICAgICAgICB0aGlzLl9yZWN2Tm90aWZpY2F0aW9uVGltZXIgPSBudWxsO1xuICAgICAgICB0aGlzLm5vdGVSZWN2KHRoaXMuX21heFNlcSk7XG4gICAgICB9LCBDb25zdC5SRUNWX1RJTUVPVVQpO1xuICAgIH1cblxuICAgIGlmIChkYXRhLnNlcSA8IHRoaXMuX21pblNlcSB8fCB0aGlzLl9taW5TZXEgPT0gMCkge1xuICAgICAgdGhpcy5fbWluU2VxID0gZGF0YS5zZXE7XG4gICAgfVxuXG4gICAgY29uc3Qgb3V0Z29pbmcgPSAoKCF0aGlzLmlzQ2hhbm5lbFR5cGUoKSAmJiAhZGF0YS5mcm9tKSB8fCB0aGlzLl90aW5vZGUuaXNNZShkYXRhLmZyb20pKTtcblxuICAgIGlmIChkYXRhLmhlYWQgJiYgZGF0YS5oZWFkLndlYnJ0YyAmJiBkYXRhLmhlYWQubWltZSA9PSBEcmFmdHkuZ2V0Q29udGVudFR5cGUoKSAmJiBkYXRhLmNvbnRlbnQpIHtcbiAgICAgIC8vIFJld3JpdGUgVkMgYm9keSB3aXRoIGluZm8gZnJvbSB0aGUgaGVhZGVycy5cbiAgICAgIGRhdGEuY29udGVudCA9IERyYWZ0eS51cGRhdGVWaWRlb0VudChkYXRhLmNvbnRlbnQsIHtcbiAgICAgICAgc3RhdGU6IGRhdGEuaGVhZC53ZWJydGMsXG4gICAgICAgIGR1cmF0aW9uOiBkYXRhLmhlYWRbJ3dlYnJ0Yy1kdXJhdGlvbiddLFxuICAgICAgICBpbmNvbWluZzogIW91dGdvaW5nLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKCFkYXRhLl9ub0ZvcndhcmRpbmcpIHtcbiAgICAgIHRoaXMuX21lc3NhZ2VzLnB1dChkYXRhKTtcbiAgICAgIHRoaXMuX3Rpbm9kZS5fZGIuYWRkTWVzc2FnZShkYXRhKTtcbiAgICAgIHRoaXMuX21heWJlVXBkYXRlTWVzc2FnZVZlcnNpb25zQ2FjaGUoZGF0YSk7XG4gICAgICB0aGlzLl91cGRhdGVEZWxldGVkUmFuZ2VzKCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMub25EYXRhKSB7XG4gICAgICB0aGlzLm9uRGF0YShkYXRhKTtcbiAgICB9XG5cbiAgICAvLyBVcGRhdGUgbG9jYWxseSBjYWNoZWQgY29udGFjdCB3aXRoIHRoZSBuZXcgbWVzc2FnZSBjb3VudC5cbiAgICBjb25zdCB3aGF0ID0gb3V0Z29pbmcgPyAncmVhZCcgOiAnbXNnJztcbiAgICB0aGlzLl91cGRhdGVSZWFkUmVjdih3aGF0LCBkYXRhLnNlcSwgZGF0YS50cyk7XG4gICAgLy8gTm90aWZ5ICdtZScgbGlzdGVuZXJzIG9mIHRoZSBjaGFuZ2UuXG4gICAgdGhpcy5fdGlub2RlLmdldE1lVG9waWMoKS5fcmVmcmVzaENvbnRhY3Qod2hhdCwgdGhpcyk7XG4gIH1cblxuICAvLyBQcm9jZXNzIG1ldGFkYXRhIG1lc3NhZ2VcbiAgX3JvdXRlTWV0YShtZXRhKSB7XG4gICAgaWYgKG1ldGEuZGVzYykge1xuICAgICAgdGhpcy5fcHJvY2Vzc01ldGFEZXNjKG1ldGEuZGVzYyk7XG4gICAgfVxuICAgIGlmIChtZXRhLnN1YiAmJiBtZXRhLnN1Yi5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLl9wcm9jZXNzTWV0YVN1YihtZXRhLnN1Yik7XG4gICAgfVxuICAgIGlmIChtZXRhLmRlbCkge1xuICAgICAgdGhpcy5fcHJvY2Vzc0RlbE1lc3NhZ2VzKG1ldGEuZGVsLmNsZWFyLCBtZXRhLmRlbC5kZWxzZXEpO1xuICAgIH1cbiAgICBpZiAobWV0YS50YWdzKSB7XG4gICAgICB0aGlzLl9wcm9jZXNzTWV0YVRhZ3MobWV0YS50YWdzKTtcbiAgICB9XG4gICAgaWYgKG1ldGEuY3JlZCkge1xuICAgICAgdGhpcy5fcHJvY2Vzc01ldGFDcmVkcyhtZXRhLmNyZWQpO1xuICAgIH1cbiAgICBpZiAodGhpcy5vbk1ldGEpIHtcbiAgICAgIHRoaXMub25NZXRhKG1ldGEpO1xuICAgIH1cbiAgfVxuICAvLyBQcm9jZXNzIHByZXNlbmNlIGNoYW5nZSBtZXNzYWdlXG4gIF9yb3V0ZVByZXMocHJlcykge1xuICAgIGxldCB1c2VyLCB1aWQ7XG4gICAgc3dpdGNoIChwcmVzLndoYXQpIHtcbiAgICAgIGNhc2UgJ2RlbCc6XG4gICAgICAgIC8vIERlbGV0ZSBjYWNoZWQgbWVzc2FnZXMuXG4gICAgICAgIHRoaXMuX3Byb2Nlc3NEZWxNZXNzYWdlcyhwcmVzLmNsZWFyLCBwcmVzLmRlbHNlcSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnb24nOlxuICAgICAgY2FzZSAnb2ZmJzpcbiAgICAgICAgLy8gVXBkYXRlIG9ubGluZSBzdGF0dXMgb2YgYSBzdWJzY3JpcHRpb24uXG4gICAgICAgIHVzZXIgPSB0aGlzLl91c2Vyc1twcmVzLnNyY107XG4gICAgICAgIGlmICh1c2VyKSB7XG4gICAgICAgICAgdXNlci5vbmxpbmUgPSBwcmVzLndoYXQgPT0gJ29uJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl90aW5vZGUubG9nZ2VyKFwiV0FSTklORzogUHJlc2VuY2UgdXBkYXRlIGZvciBhbiB1bmtub3duIHVzZXJcIiwgdGhpcy5uYW1lLCBwcmVzLnNyYyk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd0ZXJtJzpcbiAgICAgICAgLy8gQXR0YWNobWVudCB0byB0b3BpYyBpcyB0ZXJtaW5hdGVkIHByb2JhYmx5IGR1ZSB0byBjbHVzdGVyIHJlaGFzaGluZy5cbiAgICAgICAgdGhpcy5fcmVzZXRTdWIoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd1cGQnOlxuICAgICAgICAvLyBBIHRvcGljIHN1YnNjcmliZXIgaGFzIHVwZGF0ZWQgaGlzIGRlc2NyaXB0aW9uLlxuICAgICAgICAvLyBJc3N1ZSB7Z2V0IHN1Yn0gb25seSBpZiB0aGUgY3VycmVudCB1c2VyIGhhcyBubyBwMnAgdG9waWNzIHdpdGggdGhlIHVwZGF0ZWQgdXNlciAocDJwIG5hbWUgaXMgbm90IGluIGNhY2hlKS5cbiAgICAgICAgLy8gT3RoZXJ3aXNlICdtZScgd2lsbCBpc3N1ZSBhIHtnZXQgZGVzY30gcmVxdWVzdC5cbiAgICAgICAgaWYgKHByZXMuc3JjICYmICF0aGlzLl90aW5vZGUuaXNUb3BpY0NhY2hlZChwcmVzLnNyYykpIHtcbiAgICAgICAgICB0aGlzLmdldE1ldGEodGhpcy5zdGFydE1ldGFRdWVyeSgpLndpdGhMYXRlck9uZVN1YihwcmVzLnNyYykuYnVpbGQoKSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdhY3MnOlxuICAgICAgICB1aWQgPSBwcmVzLnNyYyB8fCB0aGlzLl90aW5vZGUuZ2V0Q3VycmVudFVzZXJJRCgpO1xuICAgICAgICB1c2VyID0gdGhpcy5fdXNlcnNbdWlkXTtcbiAgICAgICAgaWYgKCF1c2VyKSB7XG4gICAgICAgICAgLy8gVXBkYXRlIGZvciBhbiB1bmtub3duIHVzZXI6IG5vdGlmaWNhdGlvbiBvZiBhIG5ldyBzdWJzY3JpcHRpb24uXG4gICAgICAgICAgY29uc3QgYWNzID0gbmV3IEFjY2Vzc01vZGUoKS51cGRhdGVBbGwocHJlcy5kYWNzKTtcbiAgICAgICAgICBpZiAoYWNzICYmIGFjcy5tb2RlICE9IEFjY2Vzc01vZGUuX05PTkUpIHtcbiAgICAgICAgICAgIHVzZXIgPSB0aGlzLl9jYWNoZUdldFVzZXIodWlkKTtcbiAgICAgICAgICAgIGlmICghdXNlcikge1xuICAgICAgICAgICAgICB1c2VyID0ge1xuICAgICAgICAgICAgICAgIHVzZXI6IHVpZCxcbiAgICAgICAgICAgICAgICBhY3M6IGFjc1xuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICB0aGlzLmdldE1ldGEodGhpcy5zdGFydE1ldGFRdWVyeSgpLndpdGhPbmVTdWIodW5kZWZpbmVkLCB1aWQpLmJ1aWxkKCkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdXNlci5hY3MgPSBhY3M7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB1c2VyLnVwZGF0ZWQgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5fcHJvY2Vzc01ldGFTdWIoW3VzZXJdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gS25vd24gdXNlclxuICAgICAgICAgIHVzZXIuYWNzLnVwZGF0ZUFsbChwcmVzLmRhY3MpO1xuICAgICAgICAgIC8vIFVwZGF0ZSB1c2VyJ3MgYWNjZXNzIG1vZGUuXG4gICAgICAgICAgdGhpcy5fcHJvY2Vzc01ldGFTdWIoW3tcbiAgICAgICAgICAgIHVzZXI6IHVpZCxcbiAgICAgICAgICAgIHVwZGF0ZWQ6IG5ldyBEYXRlKCksXG4gICAgICAgICAgICBhY3M6IHVzZXIuYWNzXG4gICAgICAgICAgfV0pO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhpcy5fdGlub2RlLmxvZ2dlcihcIklORk86IElnbm9yZWQgcHJlc2VuY2UgdXBkYXRlXCIsIHByZXMud2hhdCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMub25QcmVzKSB7XG4gICAgICB0aGlzLm9uUHJlcyhwcmVzKTtcbiAgICB9XG4gIH1cbiAgLy8gUHJvY2VzcyB7aW5mb30gbWVzc2FnZVxuICBfcm91dGVJbmZvKGluZm8pIHtcbiAgICBzd2l0Y2ggKGluZm8ud2hhdCkge1xuICAgICAgY2FzZSAncmVjdic6XG4gICAgICBjYXNlICdyZWFkJzpcbiAgICAgICAgY29uc3QgdXNlciA9IHRoaXMuX3VzZXJzW2luZm8uZnJvbV07XG4gICAgICAgIGlmICh1c2VyKSB7XG4gICAgICAgICAgdXNlcltpbmZvLndoYXRdID0gaW5mby5zZXE7XG4gICAgICAgICAgaWYgKHVzZXIucmVjdiA8IHVzZXIucmVhZCkge1xuICAgICAgICAgICAgdXNlci5yZWN2ID0gdXNlci5yZWFkO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zdCBtc2cgPSB0aGlzLmxhdGVzdE1lc3NhZ2UoKTtcbiAgICAgICAgaWYgKG1zZykge1xuICAgICAgICAgIHRoaXMubXNnU3RhdHVzKG1zZywgdHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiB0aGlzIGlzIGFuIHVwZGF0ZSBmcm9tIHRoZSBjdXJyZW50IHVzZXIsIHVwZGF0ZSB0aGUgY2FjaGUgd2l0aCB0aGUgbmV3IGNvdW50LlxuICAgICAgICBpZiAodGhpcy5fdGlub2RlLmlzTWUoaW5mby5mcm9tKSkge1xuICAgICAgICAgIHRoaXMuX3VwZGF0ZVJlYWRSZWN2KGluZm8ud2hhdCwgaW5mby5zZXEpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gTm90aWZ5ICdtZScgbGlzdGVuZXIgb2YgdGhlIHN0YXR1cyBjaGFuZ2UuXG4gICAgICAgIHRoaXMuX3Rpbm9kZS5nZXRNZVRvcGljKCkuX3JlZnJlc2hDb250YWN0KGluZm8ud2hhdCwgdGhpcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAna3AnOlxuICAgICAgICAvLyBEbyBub3RoaW5nLlxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2NhbGwnOlxuICAgICAgICAvLyBEbyBub3RoaW5nIGhlcmUuXG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhpcy5fdGlub2RlLmxvZ2dlcihcIklORk86IElnbm9yZWQgaW5mbyB1cGRhdGVcIiwgaW5mby53aGF0KTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vbkluZm8pIHtcbiAgICAgIHRoaXMub25JbmZvKGluZm8pO1xuICAgIH1cbiAgfVxuICAvLyBDYWxsZWQgYnkgVGlub2RlIHdoZW4gbWV0YS5kZXNjIHBhY2tldCBpcyByZWNlaXZlZC5cbiAgLy8gQ2FsbGVkIGJ5ICdtZScgdG9waWMgb24gY29udGFjdCB1cGRhdGUgKGRlc2MuX25vRm9yd2FyZGluZyBpcyB0cnVlKS5cbiAgX3Byb2Nlc3NNZXRhRGVzYyhkZXNjKSB7XG4gICAgaWYgKHRoaXMuaXNQMlBUeXBlKCkpIHtcbiAgICAgIC8vIFN5bnRoZXRpYyBkZXNjIG1heSBpbmNsdWRlIGRlZmFjcyBmb3IgcDJwIHRvcGljcyB3aGljaCBpcyB1c2VsZXNzLlxuICAgICAgLy8gUmVtb3ZlIGl0LlxuICAgICAgZGVsZXRlIGRlc2MuZGVmYWNzO1xuXG4gICAgICAvLyBVcGRhdGUgdG8gcDJwIGRlc2MgaXMgdGhlIHNhbWUgYXMgdXNlciB1cGRhdGUuIFVwZGF0ZSBjYWNoZWQgdXNlci5cbiAgICAgIHRoaXMuX3Rpbm9kZS5fZGIudXBkVXNlcih0aGlzLm5hbWUsIGRlc2MucHVibGljKTtcbiAgICB9XG5cbiAgICAvLyBDb3B5IHBhcmFtZXRlcnMgZnJvbSBkZXNjIG9iamVjdCB0byB0aGlzIHRvcGljLlxuICAgIG1lcmdlT2JqKHRoaXMsIGRlc2MpO1xuICAgIC8vIFVwZGF0ZSBwZXJzaXN0ZW50IGNhY2hlLlxuICAgIHRoaXMuX3Rpbm9kZS5fZGIudXBkVG9waWModGhpcyk7XG5cbiAgICAvLyBOb3RpZnkgJ21lJyBsaXN0ZW5lciwgaWYgYXZhaWxhYmxlOlxuICAgIGlmICh0aGlzLm5hbWUgIT09IENvbnN0LlRPUElDX01FICYmICFkZXNjLl9ub0ZvcndhcmRpbmcpIHtcbiAgICAgIGNvbnN0IG1lID0gdGhpcy5fdGlub2RlLmdldE1lVG9waWMoKTtcbiAgICAgIGlmIChtZS5vbk1ldGFTdWIpIHtcbiAgICAgICAgbWUub25NZXRhU3ViKHRoaXMpO1xuICAgICAgfVxuICAgICAgaWYgKG1lLm9uU3Vic1VwZGF0ZWQpIHtcbiAgICAgICAgbWUub25TdWJzVXBkYXRlZChbdGhpcy5uYW1lXSwgMSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMub25NZXRhRGVzYykge1xuICAgICAgdGhpcy5vbk1ldGFEZXNjKHRoaXMpO1xuICAgIH1cbiAgfVxuICAvLyBDYWxsZWQgYnkgVGlub2RlIHdoZW4gbWV0YS5zdWIgaXMgcmVjaXZlZCBvciBpbiByZXNwb25zZSB0byByZWNlaXZlZFxuICAvLyB7Y3RybH0gYWZ0ZXIgc2V0TWV0YS1zdWIuXG4gIF9wcm9jZXNzTWV0YVN1YihzdWJzKSB7XG4gICAgZm9yIChsZXQgaWR4IGluIHN1YnMpIHtcbiAgICAgIGNvbnN0IHN1YiA9IHN1YnNbaWR4XTtcblxuICAgICAgLy8gRmlsbCBkZWZhdWx0cy5cbiAgICAgIHN1Yi5vbmxpbmUgPSAhIXN1Yi5vbmxpbmU7XG4gICAgICAvLyBVcGRhdGUgdGltZXN0YW1wIG9mIHRoZSBtb3N0IHJlY2VudCBzdWJzY3JpcHRpb24gdXBkYXRlLlxuICAgICAgdGhpcy5fbGFzdFN1YnNVcGRhdGUgPSBuZXcgRGF0ZShNYXRoLm1heCh0aGlzLl9sYXN0U3Vic1VwZGF0ZSwgc3ViLnVwZGF0ZWQpKTtcblxuICAgICAgbGV0IHVzZXIgPSBudWxsO1xuICAgICAgaWYgKCFzdWIuZGVsZXRlZCkge1xuICAgICAgICAvLyBJZiB0aGlzIGlzIGEgY2hhbmdlIHRvIHVzZXIncyBvd24gcGVybWlzc2lvbnMsIHVwZGF0ZSB0aGVtIGluIHRvcGljIHRvby5cbiAgICAgICAgLy8gRGVzYyB3aWxsIHVwZGF0ZSAnbWUnIHRvcGljLlxuICAgICAgICBpZiAodGhpcy5fdGlub2RlLmlzTWUoc3ViLnVzZXIpICYmIHN1Yi5hY3MpIHtcbiAgICAgICAgICB0aGlzLl9wcm9jZXNzTWV0YURlc2Moe1xuICAgICAgICAgICAgdXBkYXRlZDogc3ViLnVwZGF0ZWQsXG4gICAgICAgICAgICB0b3VjaGVkOiBzdWIudG91Y2hlZCxcbiAgICAgICAgICAgIGFjczogc3ViLmFjc1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHVzZXIgPSB0aGlzLl91cGRhdGVDYWNoZWRVc2VyKHN1Yi51c2VyLCBzdWIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gU3Vic2NyaXB0aW9uIGlzIGRlbGV0ZWQsIHJlbW92ZSBpdCBmcm9tIHRvcGljIChidXQgbGVhdmUgaW4gVXNlcnMgY2FjaGUpXG4gICAgICAgIGRlbGV0ZSB0aGlzLl91c2Vyc1tzdWIudXNlcl07XG4gICAgICAgIHVzZXIgPSBzdWI7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLm9uTWV0YVN1Yikge1xuICAgICAgICB0aGlzLm9uTWV0YVN1Yih1c2VyKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5vblN1YnNVcGRhdGVkKSB7XG4gICAgICB0aGlzLm9uU3Vic1VwZGF0ZWQoT2JqZWN0LmtleXModGhpcy5fdXNlcnMpKTtcbiAgICB9XG4gIH1cbiAgLy8gQ2FsbGVkIGJ5IFRpbm9kZSB3aGVuIG1ldGEudGFncyBpcyByZWNpdmVkLlxuICBfcHJvY2Vzc01ldGFUYWdzKHRhZ3MpIHtcbiAgICBpZiAodGFncy5sZW5ndGggPT0gMSAmJiB0YWdzWzBdID09IENvbnN0LkRFTF9DSEFSKSB7XG4gICAgICB0YWdzID0gW107XG4gICAgfVxuICAgIHRoaXMuX3RhZ3MgPSB0YWdzO1xuICAgIGlmICh0aGlzLm9uVGFnc1VwZGF0ZWQpIHtcbiAgICAgIHRoaXMub25UYWdzVXBkYXRlZCh0YWdzKTtcbiAgICB9XG4gIH1cbiAgLy8gRG8gbm90aGluZyBmb3IgdG9waWNzIG90aGVyIHRoYW4gJ21lJ1xuICBfcHJvY2Vzc01ldGFDcmVkcyhjcmVkcykge31cbiAgLy8gRGVsZXRlIGNhY2hlZCBtZXNzYWdlcyBhbmQgdXBkYXRlIGNhY2hlZCB0cmFuc2FjdGlvbiBJRHNcbiAgX3Byb2Nlc3NEZWxNZXNzYWdlcyhjbGVhciwgZGVsc2VxKSB7XG4gICAgdGhpcy5fbWF4RGVsID0gTWF0aC5tYXgoY2xlYXIsIHRoaXMuX21heERlbCk7XG4gICAgdGhpcy5jbGVhciA9IE1hdGgubWF4KGNsZWFyLCB0aGlzLmNsZWFyKTtcbiAgICBjb25zdCB0b3BpYyA9IHRoaXM7XG4gICAgbGV0IGNvdW50ID0gMDtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShkZWxzZXEpKSB7XG4gICAgICBkZWxzZXEuZm9yRWFjaChmdW5jdGlvbihyYW5nZSkge1xuICAgICAgICBpZiAoIXJhbmdlLmhpKSB7XG4gICAgICAgICAgY291bnQrKztcbiAgICAgICAgICB0b3BpYy5mbHVzaE1lc3NhZ2UocmFuZ2UubG93KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmb3IgKGxldCBpID0gcmFuZ2UubG93OyBpIDwgcmFuZ2UuaGk7IGkrKykge1xuICAgICAgICAgICAgY291bnQrKztcbiAgICAgICAgICAgIHRvcGljLmZsdXNoTWVzc2FnZShpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChjb3VudCA+IDApIHtcbiAgICAgIHRoaXMuX3VwZGF0ZURlbGV0ZWRSYW5nZXMoKTtcblxuICAgICAgaWYgKHRoaXMub25EYXRhKSB7XG4gICAgICAgIHRoaXMub25EYXRhKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIC8vIFRvcGljIGlzIGluZm9ybWVkIHRoYXQgdGhlIGVudGlyZSByZXNwb25zZSB0byB7Z2V0IHdoYXQ9ZGF0YX0gaGFzIGJlZW4gcmVjZWl2ZWQuXG4gIF9hbGxNZXNzYWdlc1JlY2VpdmVkKGNvdW50KSB7XG4gICAgdGhpcy5fdXBkYXRlRGVsZXRlZFJhbmdlcygpO1xuXG4gICAgaWYgKHRoaXMub25BbGxNZXNzYWdlc1JlY2VpdmVkKSB7XG4gICAgICB0aGlzLm9uQWxsTWVzc2FnZXNSZWNlaXZlZChjb3VudCk7XG4gICAgfVxuICB9XG4gIC8vIFJlc2V0IHN1YnNjcmliZWQgc3RhdGVcbiAgX3Jlc2V0U3ViKCkge1xuICAgIHRoaXMuX2F0dGFjaGVkID0gZmFsc2U7XG4gIH1cbiAgLy8gVGhpcyB0b3BpYyBpcyBlaXRoZXIgZGVsZXRlZCBvciB1bnN1YnNjcmliZWQgZnJvbS5cbiAgX2dvbmUoKSB7XG4gICAgdGhpcy5fbWVzc2FnZXMucmVzZXQoKTtcbiAgICB0aGlzLl90aW5vZGUuX2RiLnJlbU1lc3NhZ2VzKHRoaXMubmFtZSk7XG4gICAgdGhpcy5fdXNlcnMgPSB7fTtcbiAgICB0aGlzLmFjcyA9IG5ldyBBY2Nlc3NNb2RlKG51bGwpO1xuICAgIHRoaXMucHJpdmF0ZSA9IG51bGw7XG4gICAgdGhpcy5wdWJsaWMgPSBudWxsO1xuICAgIHRoaXMudHJ1c3RlZCA9IG51bGw7XG4gICAgdGhpcy5fbWF4U2VxID0gMDtcbiAgICB0aGlzLl9taW5TZXEgPSAwO1xuICAgIHRoaXMuX2F0dGFjaGVkID0gZmFsc2U7XG5cbiAgICBjb25zdCBtZSA9IHRoaXMuX3Rpbm9kZS5nZXRNZVRvcGljKCk7XG4gICAgaWYgKG1lKSB7XG4gICAgICBtZS5fcm91dGVQcmVzKHtcbiAgICAgICAgX25vRm9yd2FyZGluZzogdHJ1ZSxcbiAgICAgICAgd2hhdDogJ2dvbmUnLFxuICAgICAgICB0b3BpYzogQ29uc3QuVE9QSUNfTUUsXG4gICAgICAgIHNyYzogdGhpcy5uYW1lXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKHRoaXMub25EZWxldGVUb3BpYykge1xuICAgICAgdGhpcy5vbkRlbGV0ZVRvcGljKCk7XG4gICAgfVxuICB9XG4gIC8vIFVwZGF0ZSBnbG9iYWwgdXNlciBjYWNoZSBhbmQgbG9jYWwgc3Vic2NyaWJlcnMgY2FjaGUuXG4gIC8vIERvbid0IGNhbGwgdGhpcyBtZXRob2QgZm9yIG5vbi1zdWJzY3JpYmVycy5cbiAgX3VwZGF0ZUNhY2hlZFVzZXIodWlkLCBvYmopIHtcbiAgICAvLyBGZXRjaCB1c2VyIG9iamVjdCBmcm9tIHRoZSBnbG9iYWwgY2FjaGUuXG4gICAgLy8gVGhpcyBpcyBhIGNsb25lIG9mIHRoZSBzdG9yZWQgb2JqZWN0XG4gICAgbGV0IGNhY2hlZCA9IHRoaXMuX2NhY2hlR2V0VXNlcih1aWQpO1xuICAgIGNhY2hlZCA9IG1lcmdlT2JqKGNhY2hlZCB8fCB7fSwgb2JqKTtcbiAgICAvLyBTYXZlIHRvIGdsb2JhbCBjYWNoZVxuICAgIHRoaXMuX2NhY2hlUHV0VXNlcih1aWQsIGNhY2hlZCk7XG4gICAgLy8gU2F2ZSB0byB0aGUgbGlzdCBvZiB0b3BpYyBzdWJzcmliZXJzLlxuICAgIHJldHVybiBtZXJnZVRvQ2FjaGUodGhpcy5fdXNlcnMsIHVpZCwgY2FjaGVkKTtcbiAgfVxuICAvLyBHZXQgbG9jYWwgc2VxSWQgZm9yIGEgcXVldWVkIG1lc3NhZ2UuXG4gIF9nZXRRdWV1ZWRTZXFJZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fcXVldWVkU2VxSWQrKztcbiAgfVxuICAvLyBDYWxjdWxhdGUgcmFuZ2VzIG9mIG1pc3NpbmcgbWVzc2FnZXMuXG4gIF91cGRhdGVEZWxldGVkUmFuZ2VzKCkge1xuICAgIGNvbnN0IHJhbmdlcyA9IFtdO1xuXG4gICAgLy8gR2FwIG1hcmtlciwgcG9zc2libHkgZW1wdHkuXG4gICAgbGV0IHByZXYgPSBudWxsO1xuXG4gICAgLy8gQ2hlY2sgZm9yIGdhcCBpbiB0aGUgYmVnaW5uaW5nLCBiZWZvcmUgdGhlIGZpcnN0IG1lc3NhZ2UuXG4gICAgY29uc3QgZmlyc3QgPSB0aGlzLl9tZXNzYWdlcy5nZXRBdCgwKTtcbiAgICBpZiAoZmlyc3QgJiYgdGhpcy5fbWluU2VxID4gMSAmJiAhdGhpcy5fbm9FYXJsaWVyTXNncykge1xuICAgICAgLy8gU29tZSBtZXNzYWdlcyBhcmUgbWlzc2luZyBpbiB0aGUgYmVnaW5uaW5nLlxuICAgICAgaWYgKGZpcnN0LmhpKSB7XG4gICAgICAgIC8vIFRoZSBmaXJzdCBtZXNzYWdlIGFscmVhZHkgcmVwcmVzZW50cyBhIGdhcC5cbiAgICAgICAgaWYgKGZpcnN0LnNlcSA+IDEpIHtcbiAgICAgICAgICBmaXJzdC5zZXEgPSAxO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmaXJzdC5oaSA8IHRoaXMuX21pblNlcSAtIDEpIHtcbiAgICAgICAgICBmaXJzdC5oaSA9IHRoaXMuX21pblNlcSAtIDE7XG4gICAgICAgIH1cbiAgICAgICAgcHJldiA9IGZpcnN0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQ3JlYXRlIG5ldyBnYXAuXG4gICAgICAgIHByZXYgPSB7XG4gICAgICAgICAgc2VxOiAxLFxuICAgICAgICAgIGhpOiB0aGlzLl9taW5TZXEgLSAxXG4gICAgICAgIH07XG4gICAgICAgIHJhbmdlcy5wdXNoKHByZXYpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBObyBnYXAgaW4gdGhlIGJlZ2lubmluZy5cbiAgICAgIHByZXYgPSB7XG4gICAgICAgIHNlcTogMCxcbiAgICAgICAgaGk6IDBcbiAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gRmluZCBuZXcgZ2FwcyBpbiB0aGUgbGlzdCBvZiByZWNlaXZlZCBtZXNzYWdlcy4gVGhlIGxpc3QgY29udGFpbnMgbWVzc2FnZXMtcHJvcGVyIGFzIHdlbGxcbiAgICAvLyBhcyBwbGFjZWhvbGRlcnMgZm9yIGRlbGV0ZWQgcmFuZ2VzLlxuICAgIC8vIFRoZSBtZXNzYWdlcyBhcmUgaXRlcmF0ZWQgYnkgc2VxIElEIGluIGFzY2VuZGluZyBvcmRlci5cbiAgICB0aGlzLl9tZXNzYWdlcy5maWx0ZXIoKGRhdGEpID0+IHtcbiAgICAgIC8vIERvIG5vdCBjcmVhdGUgYSBnYXAgYmV0d2VlbiB0aGUgbGFzdCBzZW50IG1lc3NhZ2UgYW5kIHRoZSBmaXJzdCB1bnNlbnQgYXMgd2VsbCBhcyBiZXR3ZWVuIHVuc2VudCBtZXNzYWdlcy5cbiAgICAgIGlmIChkYXRhLnNlcSA+PSBDb25zdC5MT0NBTF9TRVFJRCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgLy8gQ2hlY2sgZm9yIGEgZ2FwIGJldHdlZW4gdGhlIHByZXZpb3VzIG1lc3NhZ2UvbWFya2VyIGFuZCB0aGlzIG1lc3NhZ2UvbWFya2VyLlxuICAgICAgaWYgKGRhdGEuc2VxID09IChwcmV2LmhpIHx8IHByZXYuc2VxKSArIDEpIHtcbiAgICAgICAgLy8gTm8gZ2FwIGJldHdlZW4gdGhpcyBtZXNzYWdlIGFuZCB0aGUgcHJldmlvdXMuXG4gICAgICAgIGlmIChkYXRhLmhpICYmIHByZXYuaGkpIHtcbiAgICAgICAgICAvLyBUd28gZ2FwIG1hcmtlcnMgaW4gYSByb3cuIEV4dGVuZCB0aGUgcHJldmlvdXMgb25lLCBkaXNjYXJkIHRoZSBjdXJyZW50LlxuICAgICAgICAgIHByZXYuaGkgPSBkYXRhLmhpO1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBwcmV2ID0gZGF0YTtcblxuICAgICAgICAvLyBLZWVwIGN1cnJlbnQuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBGb3VuZCBhIG5ldyBnYXAuXG4gICAgICAvLyBDaGVjayBpZiB0aGUgcHJldmlvdXMgaXMgYWxzbyBhIGdhcCBtYXJrZXIuXG4gICAgICBpZiAocHJldi5oaSkge1xuICAgICAgICAvLyBBbHRlciBpdCBpbnN0ZWFkIG9mIGNyZWF0aW5nIGEgbmV3IG9uZS5cbiAgICAgICAgcHJldi5oaSA9IGRhdGEuaGkgfHwgZGF0YS5zZXE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBQcmV2aW91cyBpcyBub3QgYSBnYXAgbWFya2VyLiBDcmVhdGUgYSBuZXcgb25lLlxuICAgICAgICBwcmV2ID0ge1xuICAgICAgICAgIHNlcTogcHJldi5zZXEgKyAxLFxuICAgICAgICAgIGhpOiBkYXRhLmhpIHx8IGRhdGEuc2VxXG4gICAgICAgIH07XG4gICAgICAgIHJhbmdlcy5wdXNoKHByZXYpO1xuICAgICAgfVxuXG4gICAgICAvLyBJZiBtYXJrZXIsIHJlbW92ZTsga2VlcCBpZiByZWd1bGFyIG1lc3NhZ2UuXG4gICAgICBpZiAoIWRhdGEuaGkpIHtcbiAgICAgICAgLy8gS2VlcGluZyB0aGUgY3VycmVudCByZWd1bGFyIG1lc3NhZ2UsIHNhdmUgaXQgYXMgcHJldmlvdXMuXG4gICAgICAgIHByZXYgPSBkYXRhO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgLy8gRGlzY2FyZCB0aGUgY3VycmVudCBnYXAgbWFya2VyOiB3ZSBlaXRoZXIgY3JlYXRlZCBhbiBlYXJsaWVyIGdhcCwgb3IgZXh0ZW5kZWQgdGhlIHByZXZvdXMgb25lLlxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0pO1xuXG4gICAgLy8gQ2hlY2sgZm9yIG1pc3NpbmcgbWVzc2FnZXMgYXQgdGhlIGVuZC5cbiAgICAvLyBBbGwgbWVzc2FnZXMgY291bGQgYmUgbWlzc2luZyBvciBpdCBjb3VsZCBiZSBhIG5ldyB0b3BpYyB3aXRoIG5vIG1lc3NhZ2VzLlxuICAgIGNvbnN0IGxhc3QgPSB0aGlzLl9tZXNzYWdlcy5nZXRMYXN0KCk7XG4gICAgY29uc3QgbWF4U2VxID0gTWF0aC5tYXgodGhpcy5zZXEsIHRoaXMuX21heFNlcSkgfHwgMDtcbiAgICBpZiAoKG1heFNlcSA+IDAgJiYgIWxhc3QpIHx8IChsYXN0ICYmICgobGFzdC5oaSB8fCBsYXN0LnNlcSkgPCBtYXhTZXEpKSkge1xuICAgICAgaWYgKGxhc3QgJiYgbGFzdC5oaSkge1xuICAgICAgICAvLyBFeHRlbmQgZXhpc3RpbmcgZ2FwXG4gICAgICAgIGxhc3QuaGkgPSBtYXhTZXE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBDcmVhdGUgbmV3IGdhcC5cbiAgICAgICAgcmFuZ2VzLnB1c2goe1xuICAgICAgICAgIHNlcTogbGFzdCA/IGxhc3Quc2VxICsgMSA6IDEsXG4gICAgICAgICAgaGk6IG1heFNlcVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBJbnNlcnQgbmV3IGdhcHMgaW50byBjYWNoZS5cbiAgICByYW5nZXMuZm9yRWFjaCgoZ2FwKSA9PiB7XG4gICAgICBnYXAuX3N0YXR1cyA9IENvbnN0Lk1FU1NBR0VfU1RBVFVTX0RFTF9SQU5HRTtcbiAgICAgIHRoaXMuX21lc3NhZ2VzLnB1dChnYXApO1xuICAgIH0pO1xuICB9XG4gIC8vIExvYWQgbW9zdCByZWNlbnQgbWVzc2FnZXMgZnJvbSBwZXJzaXN0ZW50IGNhY2hlLlxuICBfbG9hZE1lc3NhZ2VzKGRiLCBwYXJhbXMpIHtcbiAgICBjb25zdCB7XG4gICAgICBzaW5jZSxcbiAgICAgIGJlZm9yZSxcbiAgICAgIGxpbWl0XG4gICAgfSA9IHBhcmFtcyB8fCB7fTtcbiAgICByZXR1cm4gZGIucmVhZE1lc3NhZ2VzKHRoaXMubmFtZSwge1xuICAgICAgICBzaW5jZTogc2luY2UsXG4gICAgICAgIGJlZm9yZTogYmVmb3JlLFxuICAgICAgICBsaW1pdDogbGltaXQgfHwgQ29uc3QuREVGQVVMVF9NRVNTQUdFU19QQUdFXG4gICAgICB9KVxuICAgICAgLnRoZW4oKG1zZ3MpID0+IHtcbiAgICAgICAgbXNncy5mb3JFYWNoKChkYXRhKSA9PiB7XG4gICAgICAgICAgaWYgKGRhdGEuc2VxID4gdGhpcy5fbWF4U2VxKSB7XG4gICAgICAgICAgICB0aGlzLl9tYXhTZXEgPSBkYXRhLnNlcTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGRhdGEuc2VxIDwgdGhpcy5fbWluU2VxIHx8IHRoaXMuX21pblNlcSA9PSAwKSB7XG4gICAgICAgICAgICB0aGlzLl9taW5TZXEgPSBkYXRhLnNlcTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5fbWVzc2FnZXMucHV0KGRhdGEpO1xuICAgICAgICAgIHRoaXMuX21heWJlVXBkYXRlTWVzc2FnZVZlcnNpb25zQ2FjaGUoZGF0YSk7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAobXNncy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgdGhpcy5fdXBkYXRlRGVsZXRlZFJhbmdlcygpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtc2dzLmxlbmd0aDtcbiAgICAgIH0pO1xuICB9XG4gIC8vIFB1c2ggb3Ige3ByZXN9OiBtZXNzYWdlIHJlY2VpdmVkLlxuICBfdXBkYXRlUmVjZWl2ZWQoc2VxLCBhY3QpIHtcbiAgICB0aGlzLnRvdWNoZWQgPSBuZXcgRGF0ZSgpO1xuICAgIHRoaXMuc2VxID0gc2VxIHwgMDtcbiAgICAvLyBDaGVjayBpZiBtZXNzYWdlIGlzIHNlbnQgYnkgdGhlIGN1cnJlbnQgdXNlci4gSWYgc28gaXQncyBiZWVuIHJlYWQgYWxyZWFkeS5cbiAgICBpZiAoIWFjdCB8fCB0aGlzLl90aW5vZGUuaXNNZShhY3QpKSB7XG4gICAgICB0aGlzLnJlYWQgPSB0aGlzLnJlYWQgPyBNYXRoLm1heCh0aGlzLnJlYWQsIHRoaXMuc2VxKSA6IHRoaXMuc2VxO1xuICAgICAgdGhpcy5yZWN2ID0gdGhpcy5yZWN2ID8gTWF0aC5tYXgodGhpcy5yZWFkLCB0aGlzLnJlY3YpIDogdGhpcy5yZWFkO1xuICAgIH1cbiAgICB0aGlzLnVucmVhZCA9IHRoaXMuc2VxIC0gKHRoaXMucmVhZCB8IDApO1xuICAgIHRoaXMuX3Rpbm9kZS5fZGIudXBkVG9waWModGhpcyk7XG4gIH1cbn1cblxuXG4vKipcbiAqIEBjbGFzcyBUb3BpY01lIC0gc3BlY2lhbCBjYXNlIG9mIHtAbGluayBUaW5vZGUuVG9waWN9IGZvclxuICogbWFuYWdpbmcgZGF0YSBvZiB0aGUgY3VycmVudCB1c2VyLCBpbmNsdWRpbmcgY29udGFjdCBsaXN0LlxuICogQGV4dGVuZHMgVGlub2RlLlRvcGljXG4gKiBAbWVtYmVyb2YgVGlub2RlXG4gKlxuICogQHBhcmFtIHtUb3BpY01lLkNhbGxiYWNrc30gY2FsbGJhY2tzIC0gQ2FsbGJhY2tzIHRvIHJlY2VpdmUgdmFyaW91cyBldmVudHMuXG4gKi9cbi8qKlxuICogQGNsYXNzIFRvcGljTWUgLSBzcGVjaWFsIGNhc2Ugb2Yge0BsaW5rIFRpbm9kZS5Ub3BpY30gZm9yXG4gKiBtYW5hZ2luZyBkYXRhIG9mIHRoZSBjdXJyZW50IHVzZXIsIGluY2x1ZGluZyBjb250YWN0IGxpc3QuXG4gKiBAZXh0ZW5kcyBUaW5vZGUuVG9waWNcbiAqIEBtZW1iZXJvZiBUaW5vZGVcbiAqXG4gKiBAcGFyYW0ge1RvcGljTWUuQ2FsbGJhY2tzfSBjYWxsYmFja3MgLSBDYWxsYmFja3MgdG8gcmVjZWl2ZSB2YXJpb3VzIGV2ZW50cy5cbiAqL1xuZXhwb3J0IGNsYXNzIFRvcGljTWUgZXh0ZW5kcyBUb3BpYyB7XG4gIG9uQ29udGFjdFVwZGF0ZTtcblxuICBjb25zdHJ1Y3RvcihjYWxsYmFja3MpIHtcbiAgICBzdXBlcihDb25zdC5UT1BJQ19NRSwgY2FsbGJhY2tzKTtcblxuICAgIC8vIG1lLXNwZWNpZmljIGNhbGxiYWNrc1xuICAgIGlmIChjYWxsYmFja3MpIHtcbiAgICAgIHRoaXMub25Db250YWN0VXBkYXRlID0gY2FsbGJhY2tzLm9uQ29udGFjdFVwZGF0ZTtcbiAgICB9XG4gIH1cblxuICAvLyBPdmVycmlkZSB0aGUgb3JpZ2luYWwgVG9waWMuX3Byb2Nlc3NNZXRhRGVzYy5cbiAgX3Byb2Nlc3NNZXRhRGVzYyhkZXNjKSB7XG4gICAgLy8gQ2hlY2sgaWYgb25saW5lIGNvbnRhY3RzIG5lZWQgdG8gYmUgdHVybmVkIG9mZiBiZWNhdXNlIFAgcGVybWlzc2lvbiB3YXMgcmVtb3ZlZC5cbiAgICBjb25zdCB0dXJuT2ZmID0gKGRlc2MuYWNzICYmICFkZXNjLmFjcy5pc1ByZXNlbmNlcigpKSAmJiAodGhpcy5hY3MgJiYgdGhpcy5hY3MuaXNQcmVzZW5jZXIoKSk7XG5cbiAgICAvLyBDb3B5IHBhcmFtZXRlcnMgZnJvbSBkZXNjIG9iamVjdCB0byB0aGlzIHRvcGljLlxuICAgIG1lcmdlT2JqKHRoaXMsIGRlc2MpO1xuICAgIHRoaXMuX3Rpbm9kZS5fZGIudXBkVG9waWModGhpcyk7XG4gICAgLy8gVXBkYXRlIGN1cnJlbnQgdXNlcidzIHJlY29yZCBpbiB0aGUgZ2xvYmFsIGNhY2hlLlxuICAgIHRoaXMuX3VwZGF0ZUNhY2hlZFVzZXIodGhpcy5fdGlub2RlLl9teVVJRCwgZGVzYyk7XG5cbiAgICAvLyAnUCcgcGVybWlzc2lvbiB3YXMgcmVtb3ZlZC4gQWxsIHRvcGljcyBhcmUgb2ZmbGluZSBub3cuXG4gICAgaWYgKHR1cm5PZmYpIHtcbiAgICAgIHRoaXMuX3Rpbm9kZS5tYXBUb3BpY3MoKGNvbnQpID0+IHtcbiAgICAgICAgaWYgKGNvbnQub25saW5lKSB7XG4gICAgICAgICAgY29udC5vbmxpbmUgPSBmYWxzZTtcbiAgICAgICAgICBjb250LnNlZW4gPSBPYmplY3QuYXNzaWduKGNvbnQuc2VlbiB8fCB7fSwge1xuICAgICAgICAgICAgd2hlbjogbmV3IERhdGUoKVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRoaXMuX3JlZnJlc2hDb250YWN0KCdvZmYnLCBjb250KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMub25NZXRhRGVzYykge1xuICAgICAgdGhpcy5vbk1ldGFEZXNjKHRoaXMpO1xuICAgIH1cbiAgfVxuXG4gIC8vIE92ZXJyaWRlIHRoZSBvcmlnaW5hbCBUb3BpYy5fcHJvY2Vzc01ldGFTdWJcbiAgX3Byb2Nlc3NNZXRhU3ViKHN1YnMpIHtcbiAgICBsZXQgdXBkYXRlQ291bnQgPSAwO1xuICAgIHN1YnMuZm9yRWFjaCgoc3ViKSA9PiB7XG4gICAgICBjb25zdCB0b3BpY05hbWUgPSBzdWIudG9waWM7XG4gICAgICAvLyBEb24ndCBzaG93ICdtZScgYW5kICdmbmQnIHRvcGljcyBpbiB0aGUgbGlzdCBvZiBjb250YWN0cy5cbiAgICAgIGlmICh0b3BpY05hbWUgPT0gQ29uc3QuVE9QSUNfRk5EIHx8IHRvcGljTmFtZSA9PSBDb25zdC5UT1BJQ19NRSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBzdWIub25saW5lID0gISFzdWIub25saW5lO1xuXG4gICAgICBsZXQgY29udCA9IG51bGw7XG4gICAgICBpZiAoc3ViLmRlbGV0ZWQpIHtcbiAgICAgICAgY29udCA9IHN1YjtcbiAgICAgICAgdGhpcy5fdGlub2RlLmNhY2hlUmVtVG9waWModG9waWNOYW1lKTtcbiAgICAgICAgdGhpcy5fdGlub2RlLl9kYi5yZW1Ub3BpYyh0b3BpY05hbWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gRW5zdXJlIHRoZSB2YWx1ZXMgYXJlIGRlZmluZWQgYW5kIGFyZSBpbnRlZ2Vycy5cbiAgICAgICAgaWYgKHR5cGVvZiBzdWIuc2VxICE9ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgc3ViLnNlcSA9IHN1Yi5zZXEgfCAwO1xuICAgICAgICAgIHN1Yi5yZWN2ID0gc3ViLnJlY3YgfCAwO1xuICAgICAgICAgIHN1Yi5yZWFkID0gc3ViLnJlYWQgfCAwO1xuICAgICAgICAgIHN1Yi51bnJlYWQgPSBzdWIuc2VxIC0gc3ViLnJlYWQ7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB0b3BpYyA9IHRoaXMuX3Rpbm9kZS5nZXRUb3BpYyh0b3BpY05hbWUpO1xuICAgICAgICBpZiAodG9waWMuX25ldykge1xuICAgICAgICAgIGRlbGV0ZSB0b3BpYy5fbmV3O1xuICAgICAgICB9XG5cbiAgICAgICAgY29udCA9IG1lcmdlT2JqKHRvcGljLCBzdWIpO1xuICAgICAgICB0aGlzLl90aW5vZGUuX2RiLnVwZFRvcGljKGNvbnQpO1xuXG4gICAgICAgIGlmIChUb3BpYy5pc1AyUFRvcGljTmFtZSh0b3BpY05hbWUpKSB7XG4gICAgICAgICAgdGhpcy5fY2FjaGVQdXRVc2VyKHRvcGljTmFtZSwgY29udCk7XG4gICAgICAgICAgdGhpcy5fdGlub2RlLl9kYi51cGRVc2VyKHRvcGljTmFtZSwgY29udC5wdWJsaWMpO1xuICAgICAgICB9XG4gICAgICAgIC8vIE5vdGlmeSB0b3BpYyBvZiB0aGUgdXBkYXRlIGlmIGl0J3MgYW4gZXh0ZXJuYWwgdXBkYXRlLlxuICAgICAgICBpZiAoIXN1Yi5fbm9Gb3J3YXJkaW5nICYmIHRvcGljKSB7XG4gICAgICAgICAgc3ViLl9ub0ZvcndhcmRpbmcgPSB0cnVlO1xuICAgICAgICAgIHRvcGljLl9wcm9jZXNzTWV0YURlc2Moc3ViKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB1cGRhdGVDb3VudCsrO1xuXG4gICAgICBpZiAodGhpcy5vbk1ldGFTdWIpIHtcbiAgICAgICAgdGhpcy5vbk1ldGFTdWIoY29udCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5vblN1YnNVcGRhdGVkICYmIHVwZGF0ZUNvdW50ID4gMCkge1xuICAgICAgY29uc3Qga2V5cyA9IFtdO1xuICAgICAgc3Vicy5mb3JFYWNoKChzKSA9PiB7XG4gICAgICAgIGtleXMucHVzaChzLnRvcGljKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5vblN1YnNVcGRhdGVkKGtleXMsIHVwZGF0ZUNvdW50KTtcbiAgICB9XG4gIH1cblxuICAvLyBDYWxsZWQgYnkgVGlub2RlIHdoZW4gbWV0YS5zdWIgaXMgcmVjaXZlZC5cbiAgX3Byb2Nlc3NNZXRhQ3JlZHMoY3JlZHMsIHVwZCkge1xuICAgIGlmIChjcmVkcy5sZW5ndGggPT0gMSAmJiBjcmVkc1swXSA9PSBDb25zdC5ERUxfQ0hBUikge1xuICAgICAgY3JlZHMgPSBbXTtcbiAgICB9XG4gICAgaWYgKHVwZCkge1xuICAgICAgY3JlZHMuZm9yRWFjaCgoY3IpID0+IHtcbiAgICAgICAgaWYgKGNyLnZhbCkge1xuICAgICAgICAgIC8vIEFkZGluZyBhIGNyZWRlbnRpYWwuXG4gICAgICAgICAgbGV0IGlkeCA9IHRoaXMuX2NyZWRlbnRpYWxzLmZpbmRJbmRleCgoZWwpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBlbC5tZXRoID09IGNyLm1ldGggJiYgZWwudmFsID09IGNyLnZhbDtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAoaWR4IDwgMCkge1xuICAgICAgICAgICAgLy8gTm90IGZvdW5kLlxuICAgICAgICAgICAgaWYgKCFjci5kb25lKSB7XG4gICAgICAgICAgICAgIC8vIFVuY29uZmlybWVkIGNyZWRlbnRpYWwgcmVwbGFjZXMgcHJldmlvdXMgdW5jb25maXJtZWQgY3JlZGVudGlhbCBvZiB0aGUgc2FtZSBtZXRob2QuXG4gICAgICAgICAgICAgIGlkeCA9IHRoaXMuX2NyZWRlbnRpYWxzLmZpbmRJbmRleCgoZWwpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZWwubWV0aCA9PSBjci5tZXRoICYmICFlbC5kb25lO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgaWYgKGlkeCA+PSAwKSB7XG4gICAgICAgICAgICAgICAgLy8gUmVtb3ZlIHByZXZpb3VzIHVuY29uZmlybWVkIGNyZWRlbnRpYWwuXG4gICAgICAgICAgICAgICAgdGhpcy5fY3JlZGVudGlhbHMuc3BsaWNlKGlkeCwgMSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX2NyZWRlbnRpYWxzLnB1c2goY3IpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBGb3VuZC4gTWF5YmUgY2hhbmdlICdkb25lJyBzdGF0dXMuXG4gICAgICAgICAgICB0aGlzLl9jcmVkZW50aWFsc1tpZHhdLmRvbmUgPSBjci5kb25lO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChjci5yZXNwKSB7XG4gICAgICAgICAgLy8gSGFuZGxlIGNyZWRlbnRpYWwgY29uZmlybWF0aW9uLlxuICAgICAgICAgIGNvbnN0IGlkeCA9IHRoaXMuX2NyZWRlbnRpYWxzLmZpbmRJbmRleCgoZWwpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBlbC5tZXRoID09IGNyLm1ldGggJiYgIWVsLmRvbmU7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKGlkeCA+PSAwKSB7XG4gICAgICAgICAgICB0aGlzLl9jcmVkZW50aWFsc1tpZHhdLmRvbmUgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2NyZWRlbnRpYWxzID0gY3JlZHM7XG4gICAgfVxuICAgIGlmICh0aGlzLm9uQ3JlZHNVcGRhdGVkKSB7XG4gICAgICB0aGlzLm9uQ3JlZHNVcGRhdGVkKHRoaXMuX2NyZWRlbnRpYWxzKTtcbiAgICB9XG4gIH1cblxuICAvLyBQcm9jZXNzIHByZXNlbmNlIGNoYW5nZSBtZXNzYWdlXG4gIF9yb3V0ZVByZXMocHJlcykge1xuICAgIGlmIChwcmVzLndoYXQgPT0gJ3Rlcm0nKSB7XG4gICAgICAvLyBUaGUgJ21lJyB0b3BpYyBpdHNlbGYgaXMgZGV0YWNoZWQuIE1hcmsgYXMgdW5zdWJzY3JpYmVkLlxuICAgICAgdGhpcy5fcmVzZXRTdWIoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAocHJlcy53aGF0ID09ICd1cGQnICYmIHByZXMuc3JjID09IENvbnN0LlRPUElDX01FKSB7XG4gICAgICAvLyBVcGRhdGUgdG8gbWUncyBkZXNjcmlwdGlvbi4gUmVxdWVzdCB1cGRhdGVkIHZhbHVlLlxuICAgICAgdGhpcy5nZXRNZXRhKHRoaXMuc3RhcnRNZXRhUXVlcnkoKS53aXRoRGVzYygpLmJ1aWxkKCkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGNvbnQgPSB0aGlzLl90aW5vZGUuY2FjaGVHZXRUb3BpYyhwcmVzLnNyYyk7XG4gICAgaWYgKGNvbnQpIHtcbiAgICAgIHN3aXRjaCAocHJlcy53aGF0KSB7XG4gICAgICAgIGNhc2UgJ29uJzogLy8gdG9waWMgY2FtZSBvbmxpbmVcbiAgICAgICAgICBjb250Lm9ubGluZSA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ29mZic6IC8vIHRvcGljIHdlbnQgb2ZmbGluZVxuICAgICAgICAgIGlmIChjb250Lm9ubGluZSkge1xuICAgICAgICAgICAgY29udC5vbmxpbmUgPSBmYWxzZTtcbiAgICAgICAgICAgIGNvbnQuc2VlbiA9IE9iamVjdC5hc3NpZ24oY29udC5zZWVuIHx8IHt9LCB7XG4gICAgICAgICAgICAgIHdoZW46IG5ldyBEYXRlKClcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnbXNnJzogLy8gbmV3IG1lc3NhZ2UgcmVjZWl2ZWRcbiAgICAgICAgICBjb250Ll91cGRhdGVSZWNlaXZlZChwcmVzLnNlcSwgcHJlcy5hY3QpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICd1cGQnOiAvLyBkZXNjIHVwZGF0ZWRcbiAgICAgICAgICAvLyBSZXF1ZXN0IHVwZGF0ZWQgc3Vic2NyaXB0aW9uLlxuICAgICAgICAgIHRoaXMuZ2V0TWV0YSh0aGlzLnN0YXJ0TWV0YVF1ZXJ5KCkud2l0aExhdGVyT25lU3ViKHByZXMuc3JjKS5idWlsZCgpKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnYWNzJzogLy8gYWNjZXNzIG1vZGUgY2hhbmdlZFxuICAgICAgICAgIGlmIChjb250LmFjcykge1xuICAgICAgICAgICAgY29udC5hY3MudXBkYXRlQWxsKHByZXMuZGFjcyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnQuYWNzID0gbmV3IEFjY2Vzc01vZGUoKS51cGRhdGVBbGwocHJlcy5kYWNzKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29udC50b3VjaGVkID0gbmV3IERhdGUoKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAndWEnOlxuICAgICAgICAgIC8vIHVzZXIgYWdlbnQgY2hhbmdlZC5cbiAgICAgICAgICBjb250LnNlZW4gPSB7XG4gICAgICAgICAgICB3aGVuOiBuZXcgRGF0ZSgpLFxuICAgICAgICAgICAgdWE6IHByZXMudWFcbiAgICAgICAgICB9O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdyZWN2JzpcbiAgICAgICAgICAvLyB1c2VyJ3Mgb3RoZXIgc2Vzc2lvbiBtYXJrZWQgc29tZSBtZXNzZ2VzIGFzIHJlY2VpdmVkLlxuICAgICAgICAgIHByZXMuc2VxID0gcHJlcy5zZXEgfCAwO1xuICAgICAgICAgIGNvbnQucmVjdiA9IGNvbnQucmVjdiA/IE1hdGgubWF4KGNvbnQucmVjdiwgcHJlcy5zZXEpIDogcHJlcy5zZXE7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3JlYWQnOlxuICAgICAgICAgIC8vIHVzZXIncyBvdGhlciBzZXNzaW9uIG1hcmtlZCBzb21lIG1lc3NhZ2VzIGFzIHJlYWQuXG4gICAgICAgICAgcHJlcy5zZXEgPSBwcmVzLnNlcSB8IDA7XG4gICAgICAgICAgY29udC5yZWFkID0gY29udC5yZWFkID8gTWF0aC5tYXgoY29udC5yZWFkLCBwcmVzLnNlcSkgOiBwcmVzLnNlcTtcbiAgICAgICAgICBjb250LnJlY3YgPSBjb250LnJlY3YgPyBNYXRoLm1heChjb250LnJlYWQsIGNvbnQucmVjdikgOiBjb250LnJlY3Y7XG4gICAgICAgICAgY29udC51bnJlYWQgPSBjb250LnNlcSAtIGNvbnQucmVhZDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnZ29uZSc6XG4gICAgICAgICAgLy8gdG9waWMgZGVsZXRlZCBvciB1bnN1YnNjcmliZWQgZnJvbS5cbiAgICAgICAgICBpZiAoIWNvbnQuX2RlbGV0ZWQpIHtcbiAgICAgICAgICAgIGNvbnQuX2RlbGV0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgY29udC5fYXR0YWNoZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuX3Rpbm9kZS5fZGIubWFya1RvcGljQXNEZWxldGVkKHByZXMuc3JjKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fdGlub2RlLl9kYi5yZW1Ub3BpYyhwcmVzLnNyYyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdkZWwnOlxuICAgICAgICAgIC8vIFVwZGF0ZSB0b3BpYy5kZWwgdmFsdWUuXG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgdGhpcy5fdGlub2RlLmxvZ2dlcihcIklORk86IFVuc3VwcG9ydGVkIHByZXNlbmNlIHVwZGF0ZSBpbiAnbWUnXCIsIHByZXMud2hhdCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3JlZnJlc2hDb250YWN0KHByZXMud2hhdCwgY29udCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChwcmVzLndoYXQgPT0gJ2FjcycpIHtcbiAgICAgICAgLy8gTmV3IHN1YnNjcmlwdGlvbnMgYW5kIGRlbGV0ZWQvYmFubmVkIHN1YnNjcmlwdGlvbnMgaGF2ZSBmdWxsXG4gICAgICAgIC8vIGFjY2VzcyBtb2RlIChubyArIG9yIC0gaW4gdGhlIGRhY3Mgc3RyaW5nKS4gQ2hhbmdlcyB0byBrbm93biBzdWJzY3JpcHRpb25zIGFyZSBzZW50IGFzXG4gICAgICAgIC8vIGRlbHRhcywgYnV0IHRoZXkgc2hvdWxkIG5vdCBoYXBwZW4gaGVyZS5cbiAgICAgICAgY29uc3QgYWNzID0gbmV3IEFjY2Vzc01vZGUocHJlcy5kYWNzKTtcbiAgICAgICAgaWYgKCFhY3MgfHwgYWNzLm1vZGUgPT0gQWNjZXNzTW9kZS5fSU5WQUxJRCkge1xuICAgICAgICAgIHRoaXMuX3Rpbm9kZS5sb2dnZXIoXCJFUlJPUjogSW52YWxpZCBhY2Nlc3MgbW9kZSB1cGRhdGVcIiwgcHJlcy5zcmMsIHByZXMuZGFjcyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IGVsc2UgaWYgKGFjcy5tb2RlID09IEFjY2Vzc01vZGUuX05PTkUpIHtcbiAgICAgICAgICB0aGlzLl90aW5vZGUubG9nZ2VyKFwiV0FSTklORzogUmVtb3Zpbmcgbm9uLWV4aXN0ZW50IHN1YnNjcmlwdGlvblwiLCBwcmVzLnNyYywgcHJlcy5kYWNzKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gTmV3IHN1YnNjcmlwdGlvbi4gU2VuZCByZXF1ZXN0IGZvciB0aGUgZnVsbCBkZXNjcmlwdGlvbi5cbiAgICAgICAgICAvLyBVc2luZyAud2l0aE9uZVN1YiAobm90IC53aXRoTGF0ZXJPbmVTdWIpIHRvIG1ha2Ugc3VyZSBJZk1vZGlmaWVkU2luY2UgaXMgbm90IHNldC5cbiAgICAgICAgICB0aGlzLmdldE1ldGEodGhpcy5zdGFydE1ldGFRdWVyeSgpLndpdGhPbmVTdWIodW5kZWZpbmVkLCBwcmVzLnNyYykuYnVpbGQoKSk7XG4gICAgICAgICAgLy8gQ3JlYXRlIGEgZHVtbXkgZW50cnkgdG8gY2F0Y2ggb25saW5lIHN0YXR1cyB1cGRhdGUuXG4gICAgICAgICAgY29uc3QgZHVtbXkgPSB0aGlzLl90aW5vZGUuZ2V0VG9waWMocHJlcy5zcmMpO1xuICAgICAgICAgIGR1bW15LnRvcGljID0gcHJlcy5zcmM7XG4gICAgICAgICAgZHVtbXkub25saW5lID0gZmFsc2U7XG4gICAgICAgICAgZHVtbXkuYWNzID0gYWNzO1xuICAgICAgICAgIHRoaXMuX3Rpbm9kZS5fZGIudXBkVG9waWMoZHVtbXkpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHByZXMud2hhdCA9PSAndGFncycpIHtcbiAgICAgICAgdGhpcy5nZXRNZXRhKHRoaXMuc3RhcnRNZXRhUXVlcnkoKS53aXRoVGFncygpLmJ1aWxkKCkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLm9uUHJlcykge1xuICAgICAgdGhpcy5vblByZXMocHJlcyk7XG4gICAgfVxuICB9XG5cbiAgLy8gQ29udGFjdCBpcyB1cGRhdGVkLCBleGVjdXRlIGNhbGxiYWNrcy5cbiAgX3JlZnJlc2hDb250YWN0KHdoYXQsIGNvbnQpIHtcbiAgICBpZiAodGhpcy5vbkNvbnRhY3RVcGRhdGUpIHtcbiAgICAgIHRoaXMub25Db250YWN0VXBkYXRlKHdoYXQsIGNvbnQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBQdWJsaXNoaW5nIHRvIFRvcGljTWUgaXMgbm90IHN1cHBvcnRlZC4ge0BsaW5rIFRvcGljI3B1Ymxpc2h9IGlzIG92ZXJyaWRlbiBhbmQgdGhvd3MgYW4ge0Vycm9yfSBpZiBjYWxsZWQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWNNZSNcbiAgICogQHRocm93cyB7RXJyb3J9IEFsd2F5cyB0aHJvd3MgYW4gZXJyb3IuXG4gICAqL1xuICBwdWJsaXNoKCkge1xuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJQdWJsaXNoaW5nIHRvICdtZScgaXMgbm90IHN1cHBvcnRlZFwiKSk7XG4gIH1cblxuICAvKipcbiAgICogRGVsZXRlIHZhbGlkYXRpb24gY3JlZGVudGlhbC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpY01lI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWMgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byBkZWxldGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVzZXIgLSBVc2VyIElEIHRvIHJlbW92ZS5cbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCBvbiByZWNlaXZpbmcgc2VydmVyIHJlcGx5LlxuICAgKi9cbiAgZGVsQ3JlZGVudGlhbChtZXRob2QsIHZhbHVlKSB7XG4gICAgaWYgKCF0aGlzLl9hdHRhY2hlZCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIkNhbm5vdCBkZWxldGUgY3JlZGVudGlhbCBpbiBpbmFjdGl2ZSAnbWUnIHRvcGljXCIpKTtcbiAgICB9XG4gICAgLy8gU2VuZCB7ZGVsfSBtZXNzYWdlLCByZXR1cm4gcHJvbWlzZVxuICAgIHJldHVybiB0aGlzLl90aW5vZGUuZGVsQ3JlZGVudGlhbChtZXRob2QsIHZhbHVlKS50aGVuKGN0cmwgPT4ge1xuICAgICAgLy8gUmVtb3ZlIGRlbGV0ZWQgY3JlZGVudGlhbCBmcm9tIHRoZSBjYWNoZS5cbiAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5fY3JlZGVudGlhbHMuZmluZEluZGV4KChlbCkgPT4ge1xuICAgICAgICByZXR1cm4gZWwubWV0aCA9PSBtZXRob2QgJiYgZWwudmFsID09IHZhbHVlO1xuICAgICAgfSk7XG4gICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICB0aGlzLl9jcmVkZW50aWFscy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgfVxuICAgICAgLy8gTm90aWZ5IGxpc3RlbmVyc1xuICAgICAgaWYgKHRoaXMub25DcmVkc1VwZGF0ZWQpIHtcbiAgICAgICAgdGhpcy5vbkNyZWRzVXBkYXRlZCh0aGlzLl9jcmVkZW50aWFscyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY3RybDtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAY2FsbGJhY2sgY29udGFjdEZpbHRlclxuICAgKiBAcGFyYW0ge09iamVjdH0gY29udGFjdCB0byBjaGVjayBmb3IgaW5jbHVzaW9uLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgY29udGFjdCBzaG91bGQgYmUgcHJvY2Vzc2VkLCA8Y29kZT5mYWxzZTwvY29kZT4gdG8gZXhjbHVkZSBpdC5cbiAgICovXG4gIC8qKlxuICAgKiBJdGVyYXRlIG92ZXIgY2FjaGVkIGNvbnRhY3RzLlxuICAgKlxuICAgKiBAZnVuY3Rpb25cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpY01lI1xuICAgKiBAcGFyYW0ge1RvcGljTWUuQ29udGFjdENhbGxiYWNrfSBjYWxsYmFjayAtIENhbGxiYWNrIHRvIGNhbGwgZm9yIGVhY2ggY29udGFjdC5cbiAgICogQHBhcmFtIHtjb250YWN0RmlsdGVyPX0gZmlsdGVyIC0gT3B0aW9uYWxseSBmaWx0ZXIgY29udGFjdHM7IGluY2x1ZGUgYWxsIGlmIGZpbHRlciBpcyBmYWxzZS1pc2gsIG90aGVyd2lzZVxuICAgKiAgICAgIGluY2x1ZGUgdGhvc2UgZm9yIHdoaWNoIGZpbHRlciByZXR1cm5zIHRydWUtaXNoLlxuICAgKiBAcGFyYW0ge09iamVjdD19IGNvbnRleHQgLSBDb250ZXh0IHRvIHVzZSBmb3IgY2FsbGluZyB0aGUgYGNhbGxiYWNrYCwgaS5lLiB0aGUgdmFsdWUgb2YgYHRoaXNgIGluc2lkZSB0aGUgY2FsbGJhY2suXG4gICAqL1xuICBjb250YWN0cyhjYWxsYmFjaywgZmlsdGVyLCBjb250ZXh0KSB7XG4gICAgdGhpcy5fdGlub2RlLm1hcFRvcGljcygoYywgaWR4KSA9PiB7XG4gICAgICBpZiAoYy5pc0NvbW1UeXBlKCkgJiYgKCFmaWx0ZXIgfHwgZmlsdGVyKGMpKSkge1xuICAgICAgICBjYWxsYmFjay5jYWxsKGNvbnRleHQsIGMsIGlkeCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGEgY29udGFjdCBmcm9tIGNhY2hlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljTWUjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgY29udGFjdCB0byBnZXQsIGVpdGhlciBhIFVJRCAoZm9yIHAycCB0b3BpY3MpIG9yIGEgdG9waWMgbmFtZS5cbiAgICogQHJldHVybnMge1Rpbm9kZS5Db250YWN0fSAtIENvbnRhY3Qgb3IgYHVuZGVmaW5lZGAuXG4gICAqL1xuICBnZXRDb250YWN0KG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5fdGlub2RlLmNhY2hlR2V0VG9waWMobmFtZSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGFjY2VzcyBtb2RlIG9mIGEgZ2l2ZW4gY29udGFjdCBmcm9tIGNhY2hlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljTWUjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgY29udGFjdCB0byBnZXQgYWNjZXNzIG1vZGUgZm9yLCBlaXRoZXIgYSBVSUQgKGZvciBwMnAgdG9waWNzKVxuICAgKiAgICAgICAgb3IgYSB0b3BpYyBuYW1lOyBpZiBtaXNzaW5nLCBhY2Nlc3MgbW9kZSBmb3IgdGhlICdtZScgdG9waWMgaXRzZWxmLlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSAtIGFjY2VzcyBtb2RlLCBzdWNoIGFzIGBSV1BgLlxuICAgKi9cbiAgZ2V0QWNjZXNzTW9kZShuYW1lKSB7XG4gICAgaWYgKG5hbWUpIHtcbiAgICAgIGNvbnN0IGNvbnQgPSB0aGlzLl90aW5vZGUuY2FjaGVHZXRUb3BpYyhuYW1lKTtcbiAgICAgIHJldHVybiBjb250ID8gY29udC5hY3MgOiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5hY3M7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgY29udGFjdCBpcyBhcmNoaXZlZCwgaS5lLiBjb250YWN0LnByaXZhdGUuYXJjaCA9PSB0cnVlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljTWUjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgY29udGFjdCB0byBjaGVjayBhcmNoaXZlZCBzdGF0dXMsIGVpdGhlciBhIFVJRCAoZm9yIHAycCB0b3BpY3MpIG9yIGEgdG9waWMgbmFtZS5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IC0gdHJ1ZSBpZiBjb250YWN0IGlzIGFyY2hpdmVkLCBmYWxzZSBvdGhlcndpc2UuXG4gICAqL1xuICBpc0FyY2hpdmVkKG5hbWUpIHtcbiAgICBjb25zdCBjb250ID0gdGhpcy5fdGlub2RlLmNhY2hlR2V0VG9waWMobmFtZSk7XG4gICAgcmV0dXJuIGNvbnQgJiYgY29udC5wcml2YXRlICYmICEhY29udC5wcml2YXRlLmFyY2g7XG4gIH1cblxuICAvKipcbiAgICogQHR5cGVkZWYgVGlub2RlLkNyZWRlbnRpYWxcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAdHlwZSBPYmplY3RcbiAgICogQHByb3BlcnR5IHtzdHJpbmd9IG1ldGggLSB2YWxpZGF0aW9uIG1ldGhvZCBzdWNoIGFzICdlbWFpbCcgb3IgJ3RlbCcuXG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB2YWwgLSBjcmVkZW50aWFsIHZhbHVlLCBpLmUuICdqZG9lQGV4YW1wbGUuY29tJyBvciAnKzE3MDI1NTUxMjM0J1xuICAgKiBAcHJvcGVydHkge2Jvb2xlYW59IGRvbmUgLSB0cnVlIGlmIGNyZWRlbnRpYWwgaXMgdmFsaWRhdGVkLlxuICAgKi9cbiAgLyoqXG4gICAqIEdldCB0aGUgdXNlcidzIGNyZWRlbnRpYWxzOiBlbWFpbCwgcGhvbmUsIGV0Yy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpY01lI1xuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLkNyZWRlbnRpYWxbXX0gLSBhcnJheSBvZiBjcmVkZW50aWFscy5cbiAgICovXG4gIGdldENyZWRlbnRpYWxzKCkge1xuICAgIHJldHVybiB0aGlzLl9jcmVkZW50aWFscztcbiAgfVxufVxuXG4vKipcbiAqIEBjbGFzcyBUb3BpY0ZuZCAtIHNwZWNpYWwgY2FzZSBvZiB7QGxpbmsgVGlub2RlLlRvcGljfSBmb3Igc2VhcmNoaW5nIGZvclxuICogY29udGFjdHMgYW5kIGdyb3VwIHRvcGljcy5cbiAqIEBleHRlbmRzIFRpbm9kZS5Ub3BpY1xuICogQG1lbWJlcm9mIFRpbm9kZVxuICpcbiAqIEBwYXJhbSB7VG9waWNGbmQuQ2FsbGJhY2tzfSBjYWxsYmFja3MgLSBDYWxsYmFja3MgdG8gcmVjZWl2ZSB2YXJpb3VzIGV2ZW50cy5cbiAqL1xuZXhwb3J0IGNsYXNzIFRvcGljRm5kIGV4dGVuZHMgVG9waWMge1xuICAvLyBMaXN0IG9mIHVzZXJzIGFuZCB0b3BpY3MgdWlkIG9yIHRvcGljX25hbWUgLT4gQ29udGFjdCBvYmplY3QpXG4gIF9jb250YWN0cyA9IHt9O1xuXG4gIGNvbnN0cnVjdG9yKGNhbGxiYWNrcykge1xuICAgIHN1cGVyKENvbnN0LlRPUElDX0ZORCwgY2FsbGJhY2tzKTtcbiAgfVxuXG4gIC8vIE92ZXJyaWRlIHRoZSBvcmlnaW5hbCBUb3BpYy5fcHJvY2Vzc01ldGFTdWJcbiAgX3Byb2Nlc3NNZXRhU3ViKHN1YnMpIHtcbiAgICBsZXQgdXBkYXRlQ291bnQgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0aGlzLl9jb250YWN0cykubGVuZ3RoO1xuICAgIC8vIFJlc2V0IGNvbnRhY3QgbGlzdC5cbiAgICB0aGlzLl9jb250YWN0cyA9IHt9O1xuICAgIGZvciAobGV0IGlkeCBpbiBzdWJzKSB7XG4gICAgICBsZXQgc3ViID0gc3Vic1tpZHhdO1xuICAgICAgY29uc3QgaW5kZXhCeSA9IHN1Yi50b3BpYyA/IHN1Yi50b3BpYyA6IHN1Yi51c2VyO1xuXG4gICAgICBzdWIgPSBtZXJnZVRvQ2FjaGUodGhpcy5fY29udGFjdHMsIGluZGV4QnksIHN1Yik7XG4gICAgICB1cGRhdGVDb3VudCsrO1xuXG4gICAgICBpZiAodGhpcy5vbk1ldGFTdWIpIHtcbiAgICAgICAgdGhpcy5vbk1ldGFTdWIoc3ViKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodXBkYXRlQ291bnQgPiAwICYmIHRoaXMub25TdWJzVXBkYXRlZCkge1xuICAgICAgdGhpcy5vblN1YnNVcGRhdGVkKE9iamVjdC5rZXlzKHRoaXMuX2NvbnRhY3RzKSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFB1Ymxpc2hpbmcgdG8gVG9waWNGbmQgaXMgbm90IHN1cHBvcnRlZC4ge0BsaW5rIFRvcGljI3B1Ymxpc2h9IGlzIG92ZXJyaWRlbiBhbmQgdGhvd3MgYW4ge0Vycm9yfSBpZiBjYWxsZWQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWNGbmQjXG4gICAqIEB0aHJvd3Mge0Vycm9yfSBBbHdheXMgdGhyb3dzIGFuIGVycm9yLlxuICAgKi9cbiAgcHVibGlzaCgpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiUHVibGlzaGluZyB0byAnZm5kJyBpcyBub3Qgc3VwcG9ydGVkXCIpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBzZXRNZXRhIHRvIFRvcGljRm5kIHJlc2V0cyBjb250YWN0IGxpc3QgaW4gYWRkaXRpb24gdG8gc2VuZGluZyB0aGUgbWVzc2FnZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpY0ZuZCNcbiAgICogQHBhcmFtIHtUaW5vZGUuU2V0UGFyYW1zfSBwYXJhbXMgcGFyYW1ldGVycyB0byB1cGRhdGUuXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHRvIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIHNlcnZlciByZXNwb25kcyB0byByZXF1ZXN0LlxuICAgKi9cbiAgc2V0TWV0YShwYXJhbXMpIHtcbiAgICByZXR1cm4gT2JqZWN0LmdldFByb3RvdHlwZU9mKFRvcGljRm5kLnByb3RvdHlwZSkuc2V0TWV0YS5jYWxsKHRoaXMsIHBhcmFtcykudGhlbihfID0+IHtcbiAgICAgIGlmIChPYmplY3Qua2V5cyh0aGlzLl9jb250YWN0cykubGVuZ3RoID4gMCkge1xuICAgICAgICB0aGlzLl9jb250YWN0cyA9IHt9O1xuICAgICAgICBpZiAodGhpcy5vblN1YnNVcGRhdGVkKSB7XG4gICAgICAgICAgdGhpcy5vblN1YnNVcGRhdGVkKFtdKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEl0ZXJhdGUgb3ZlciBmb3VuZCBjb250YWN0cy4gSWYgY2FsbGJhY2sgaXMgdW5kZWZpbmVkLCB1c2Uge0BsaW5rIHRoaXMub25NZXRhU3VifS5cbiAgICogQGZ1bmN0aW9uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWNGbmQjXG4gICAqIEBwYXJhbSB7VG9waWNGbmQuQ29udGFjdENhbGxiYWNrfSBjYWxsYmFjayAtIENhbGxiYWNrIHRvIGNhbGwgZm9yIGVhY2ggY29udGFjdC5cbiAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHQgLSBDb250ZXh0IHRvIHVzZSBmb3IgY2FsbGluZyB0aGUgYGNhbGxiYWNrYCwgaS5lLiB0aGUgdmFsdWUgb2YgYHRoaXNgIGluc2lkZSB0aGUgY2FsbGJhY2suXG4gICAqL1xuICBjb250YWN0cyhjYWxsYmFjaywgY29udGV4dCkge1xuICAgIGNvbnN0IGNiID0gKGNhbGxiYWNrIHx8IHRoaXMub25NZXRhU3ViKTtcbiAgICBpZiAoY2IpIHtcbiAgICAgIGZvciAobGV0IGlkeCBpbiB0aGlzLl9jb250YWN0cykge1xuICAgICAgICBjYi5jYWxsKGNvbnRleHQsIHRoaXMuX2NvbnRhY3RzW2lkeF0sIGlkeCwgdGhpcy5fY29udGFjdHMpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIiwiLyoqXG4gKiBAZmlsZSBVdGlsaXRpZXMgdXNlZCBpbiBtdWx0aXBsZSBwbGFjZXMuXG4gKlxuICogQGNvcHlyaWdodCAyMDE1LTIwMjIgVGlub2RlIExMQy5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgQWNjZXNzTW9kZSBmcm9tICcuL2FjY2Vzcy1tb2RlLmpzJztcbmltcG9ydCB7XG4gIERFTF9DSEFSXG59IGZyb20gJy4vY29uZmlnLmpzJztcblxuLy8gQXR0ZW1wdCB0byBjb252ZXJ0IGRhdGUgYW5kIEFjY2Vzc01vZGUgc3RyaW5ncyB0byBvYmplY3RzLlxuZXhwb3J0IGZ1bmN0aW9uIGpzb25QYXJzZUhlbHBlcihrZXksIHZhbCkge1xuICAvLyBUcnkgdG8gY29udmVydCBzdHJpbmcgdGltZXN0YW1wcyB3aXRoIG9wdGlvbmFsIG1pbGxpc2Vjb25kcyB0byBEYXRlLFxuICAvLyBlLmcuIDIwMTUtMDktMDJUMDE6NDU6NDNbLjEyM11aXG4gIGlmICh0eXBlb2YgdmFsID09ICdzdHJpbmcnICYmIHZhbC5sZW5ndGggPj0gMjAgJiYgdmFsLmxlbmd0aCA8PSAyNCAmJiBbJ3RzJywgJ3RvdWNoZWQnLCAndXBkYXRlZCcsICdjcmVhdGVkJywgJ3doZW4nLCAnZGVsZXRlZCcsICdleHBpcmVzJ10uaW5jbHVkZXMoa2V5KSkge1xuXG4gICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKHZhbCk7XG4gICAgaWYgKCFpc05hTihkYXRlKSkge1xuICAgICAgcmV0dXJuIGRhdGU7XG4gICAgfVxuICB9IGVsc2UgaWYgKGtleSA9PT0gJ2FjcycgJiYgdHlwZW9mIHZhbCA9PT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gbmV3IEFjY2Vzc01vZGUodmFsKTtcbiAgfVxuICByZXR1cm4gdmFsO1xufVxuXG4vLyBDaGVja3MgaWYgVVJMIGlzIGEgcmVsYXRpdmUgdXJsLCBpLmUuIGhhcyBubyAnc2NoZW1lOi8vJywgaW5jbHVkaW5nIHRoZSBjYXNlIG9mIG1pc3Npbmcgc2NoZW1lICcvLycuXG4vLyBUaGUgc2NoZW1lIGlzIGV4cGVjdGVkIHRvIGJlIFJGQy1jb21wbGlhbnQsIGUuZy4gW2Etel1bYS16MC05Ky4tXSpcbi8vIGV4YW1wbGUuaHRtbCAtIG9rXG4vLyBodHRwczpleGFtcGxlLmNvbSAtIG5vdCBvay5cbi8vIGh0dHA6L2V4YW1wbGUuY29tIC0gbm90IG9rLlxuLy8gJyDihrIgaHR0cHM6Ly9leGFtcGxlLmNvbScgLSBub3Qgb2suICjihrIgbWVhbnMgY2FycmlhZ2UgcmV0dXJuKVxuZXhwb3J0IGZ1bmN0aW9uIGlzVXJsUmVsYXRpdmUodXJsKSB7XG4gIHJldHVybiB1cmwgJiYgIS9eXFxzKihbYS16XVthLXowLTkrLi1dKjp8XFwvXFwvKS9pbS50ZXN0KHVybCk7XG59XG5cbmZ1bmN0aW9uIGlzVmFsaWREYXRlKGQpIHtcbiAgcmV0dXJuIChkIGluc3RhbmNlb2YgRGF0ZSkgJiYgIWlzTmFOKGQpICYmIChkLmdldFRpbWUoKSAhPSAwKTtcbn1cblxuLy8gUkZDMzMzOSBmb3JtYXRlciBvZiBEYXRlXG5leHBvcnQgZnVuY3Rpb24gcmZjMzMzOURhdGVTdHJpbmcoZCkge1xuICBpZiAoIWlzVmFsaWREYXRlKGQpKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIGNvbnN0IHBhZCA9IGZ1bmN0aW9uKHZhbCwgc3ApIHtcbiAgICBzcCA9IHNwIHx8IDI7XG4gICAgcmV0dXJuICcwJy5yZXBlYXQoc3AgLSAoJycgKyB2YWwpLmxlbmd0aCkgKyB2YWw7XG4gIH07XG5cbiAgY29uc3QgbWlsbGlzID0gZC5nZXRVVENNaWxsaXNlY29uZHMoKTtcbiAgcmV0dXJuIGQuZ2V0VVRDRnVsbFllYXIoKSArICctJyArIHBhZChkLmdldFVUQ01vbnRoKCkgKyAxKSArICctJyArIHBhZChkLmdldFVUQ0RhdGUoKSkgK1xuICAgICdUJyArIHBhZChkLmdldFVUQ0hvdXJzKCkpICsgJzonICsgcGFkKGQuZ2V0VVRDTWludXRlcygpKSArICc6JyArIHBhZChkLmdldFVUQ1NlY29uZHMoKSkgK1xuICAgIChtaWxsaXMgPyAnLicgKyBwYWQobWlsbGlzLCAzKSA6ICcnKSArICdaJztcbn1cblxuLy8gUmVjdXJzaXZlbHkgbWVyZ2Ugc3JjJ3Mgb3duIHByb3BlcnRpZXMgdG8gZHN0LlxuLy8gSWdub3JlIHByb3BlcnRpZXMgd2hlcmUgaWdub3JlW3Byb3BlcnR5XSBpcyB0cnVlLlxuLy8gQXJyYXkgYW5kIERhdGUgb2JqZWN0cyBhcmUgc2hhbGxvdy1jb3BpZWQuXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VPYmooZHN0LCBzcmMsIGlnbm9yZSkge1xuICBpZiAodHlwZW9mIHNyYyAhPSAnb2JqZWN0Jykge1xuICAgIGlmIChzcmMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIGRzdDtcbiAgICB9XG4gICAgaWYgKHNyYyA9PT0gREVMX0NIQVIpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHJldHVybiBzcmM7XG4gIH1cbiAgLy8gSlMgaXMgY3Jhenk6IHR5cGVvZiBudWxsIGlzICdvYmplY3QnLlxuICBpZiAoc3JjID09PSBudWxsKSB7XG4gICAgcmV0dXJuIHNyYztcbiAgfVxuXG4gIC8vIEhhbmRsZSBEYXRlXG4gIGlmIChzcmMgaW5zdGFuY2VvZiBEYXRlICYmICFpc05hTihzcmMpKSB7XG4gICAgcmV0dXJuICghZHN0IHx8ICEoZHN0IGluc3RhbmNlb2YgRGF0ZSkgfHwgaXNOYU4oZHN0KSB8fCBkc3QgPCBzcmMpID8gc3JjIDogZHN0O1xuICB9XG5cbiAgLy8gQWNjZXNzIG1vZGVcbiAgaWYgKHNyYyBpbnN0YW5jZW9mIEFjY2Vzc01vZGUpIHtcbiAgICByZXR1cm4gbmV3IEFjY2Vzc01vZGUoc3JjKTtcbiAgfVxuXG4gIC8vIEhhbmRsZSBBcnJheVxuICBpZiAoc3JjIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICByZXR1cm4gc3JjO1xuICB9XG5cbiAgaWYgKCFkc3QgfHwgZHN0ID09PSBERUxfQ0hBUikge1xuICAgIGRzdCA9IHNyYy5jb25zdHJ1Y3RvcigpO1xuICB9XG5cbiAgZm9yIChsZXQgcHJvcCBpbiBzcmMpIHtcbiAgICBpZiAoc3JjLmhhc093blByb3BlcnR5KHByb3ApICYmICghaWdub3JlIHx8ICFpZ25vcmVbcHJvcF0pICYmIChwcm9wICE9ICdfbm9Gb3J3YXJkaW5nJykpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGRzdFtwcm9wXSA9IG1lcmdlT2JqKGRzdFtwcm9wXSwgc3JjW3Byb3BdKTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAvLyBGSVhNRTogcHJvYmFibHkgbmVlZCB0byBsb2cgc29tZXRoaW5nIGhlcmUuXG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBkc3Q7XG59XG5cbi8vIFVwZGF0ZSBvYmplY3Qgc3RvcmVkIGluIGEgY2FjaGUuIFJldHVybnMgdXBkYXRlZCB2YWx1ZS5cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZVRvQ2FjaGUoY2FjaGUsIGtleSwgbmV3dmFsLCBpZ25vcmUpIHtcbiAgY2FjaGVba2V5XSA9IG1lcmdlT2JqKGNhY2hlW2tleV0sIG5ld3ZhbCwgaWdub3JlKTtcbiAgcmV0dXJuIGNhY2hlW2tleV07XG59XG5cbi8vIFN0cmlwcyBhbGwgdmFsdWVzIGZyb20gYW4gb2JqZWN0IG9mIHRoZXkgZXZhbHVhdGUgdG8gZmFsc2Ugb3IgaWYgdGhlaXIgbmFtZSBzdGFydHMgd2l0aCAnXycuXG4vLyBVc2VkIG9uIGFsbCBvdXRnb2luZyBvYmplY3QgYmVmb3JlIHNlcmlhbGl6YXRpb24gdG8gc3RyaW5nLlxuZXhwb3J0IGZ1bmN0aW9uIHNpbXBsaWZ5KG9iaikge1xuICBPYmplY3Qua2V5cyhvYmopLmZvckVhY2goKGtleSkgPT4ge1xuICAgIGlmIChrZXlbMF0gPT0gJ18nKSB7XG4gICAgICAvLyBTdHJpcCBmaWVsZHMgbGlrZSBcIm9iai5fa2V5XCIuXG4gICAgICBkZWxldGUgb2JqW2tleV07XG4gICAgfSBlbHNlIGlmICghb2JqW2tleV0pIHtcbiAgICAgIC8vIFN0cmlwIGZpZWxkcyB3aGljaCBldmFsdWF0ZSB0byBmYWxzZS5cbiAgICAgIGRlbGV0ZSBvYmpba2V5XTtcbiAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkob2JqW2tleV0pICYmIG9ialtrZXldLmxlbmd0aCA9PSAwKSB7XG4gICAgICAvLyBTdHJpcCBlbXB0eSBhcnJheXMuXG4gICAgICBkZWxldGUgb2JqW2tleV07XG4gICAgfSBlbHNlIGlmICghb2JqW2tleV0pIHtcbiAgICAgIC8vIFN0cmlwIGZpZWxkcyB3aGljaCBldmFsdWF0ZSB0byBmYWxzZS5cbiAgICAgIGRlbGV0ZSBvYmpba2V5XTtcbiAgICB9IGVsc2UgaWYgKG9ialtrZXldIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgLy8gU3RyaXAgaW52YWxpZCBvciB6ZXJvIGRhdGUuXG4gICAgICBpZiAoIWlzVmFsaWREYXRlKG9ialtrZXldKSkge1xuICAgICAgICBkZWxldGUgb2JqW2tleV07XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0eXBlb2Ygb2JqW2tleV0gPT0gJ29iamVjdCcpIHtcbiAgICAgIHNpbXBsaWZ5KG9ialtrZXldKTtcbiAgICAgIC8vIFN0cmlwIGVtcHR5IG9iamVjdHMuXG4gICAgICBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMob2JqW2tleV0pLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgIGRlbGV0ZSBvYmpba2V5XTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gb2JqO1xufTtcblxuXG4vLyBUcmltIHdoaXRlc3BhY2UsIHN0cmlwIGVtcHR5IGFuZCBkdXBsaWNhdGUgZWxlbWVudHMgZWxlbWVudHMuXG4vLyBJZiB0aGUgcmVzdWx0IGlzIGFuIGVtcHR5IGFycmF5LCBhZGQgYSBzaW5nbGUgZWxlbWVudCBcIlxcdTI0MjFcIiAoVW5pY29kZSBEZWwgY2hhcmFjdGVyKS5cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVBcnJheShhcnIpIHtcbiAgbGV0IG91dCA9IFtdO1xuICBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSB7XG4gICAgLy8gVHJpbSwgdGhyb3cgYXdheSB2ZXJ5IHNob3J0IGFuZCBlbXB0eSB0YWdzLlxuICAgIGZvciAobGV0IGkgPSAwLCBsID0gYXJyLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgbGV0IHQgPSBhcnJbaV07XG4gICAgICBpZiAodCkge1xuICAgICAgICB0ID0gdC50cmltKCkudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgaWYgKHQubGVuZ3RoID4gMSkge1xuICAgICAgICAgIG91dC5wdXNoKHQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIG91dC5zb3J0KCkuZmlsdGVyKGZ1bmN0aW9uKGl0ZW0sIHBvcywgYXJ5KSB7XG4gICAgICByZXR1cm4gIXBvcyB8fCBpdGVtICE9IGFyeVtwb3MgLSAxXTtcbiAgICB9KTtcbiAgfVxuICBpZiAob3V0Lmxlbmd0aCA9PSAwKSB7XG4gICAgLy8gQWRkIHNpbmdsZSB0YWcgd2l0aCBhIFVuaWNvZGUgRGVsIGNoYXJhY3Rlciwgb3RoZXJ3aXNlIGFuIGFtcHR5IGFycmF5XG4gICAgLy8gaXMgYW1iaWd1b3MuIFRoZSBEZWwgdGFnIHdpbGwgYmUgc3RyaXBwZWQgYnkgdGhlIHNlcnZlci5cbiAgICBvdXQucHVzaChERUxfQ0hBUik7XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cbiIsIm1vZHVsZS5leHBvcnRzPXtcInZlcnNpb25cIjogXCIwLjIxLjAtYmV0YTFcIn1cbiJdfQ==
